<?php

namespace Framework;

use Pimple\Container;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Controller\ArgumentResolver;
use Symfony\Component\HttpKernel\Controller\ControllerResolver;
use Symfony\Component\HttpKernel\EventListener\RouterListener;
use Symfony\Component\HttpKernel\HttpKernel;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\Event\TerminateEvent;
use Symfony\Component\Routing\Generator\UrlGenerator;
use Symfony\Component\Routing\Matcher\UrlMatcher;
use Symfony\Component\Routing\RequestContext;
use Symfony\Component\Routing\RouteCollection;
use Twig\Environment as TwigEnvironment;
use Twig\Loader\FilesystemLoader;

class Application extends Container implements HttpKernelInterface
{
    protected $providers = [];
    protected $controllers = [];
    protected $booted = false;
    protected $routes;

    public function __construct()
    {
        parent::__construct();

        $app = $this;
        $this->routes = new RouteCollection();

        $this['debug'] = false;

        $this['request_stack'] = function () {
            return new RequestStack();
        };

        $this['dispatcher'] = function () use ($app) {
            return new EventDispatcher();
        };

        $this['resolver'] = function () {
            return new ControllerResolver();
        };

        $this['argument_resolver'] = function () {
            return new ArgumentResolver();
        };

        $this['kernel'] = function () use ($app) {
            return new HttpKernel(
                $app['dispatcher'],
                $app['resolver'],
                $app['request_stack'],
                $app['argument_resolver']
            );
        };

        $this['request_context'] = function () {
            $context = new RequestContext();
            $context->setHttpPort(80);
            $context->setHttpsPort(443);
            return $context;
        };

        $this['url_generator'] = function () use ($app) {
            return new UrlGenerator($app->routes, $app['request_context']);
        };

        $this['controllers_factory'] = $this->factory(function () use ($app) {
            return new ControllerCollection(function () {
                return new Route('');
            });
        });

        $this['callback_resolver'] = function () use ($app) {
            return new CallbackResolver($app);
        };
    }

    public function register($provider, array $values = [])
    {
        $this->providers[] = $provider;
        $provider->register($this);

        foreach ($values as $key => $value) {
            $this[$key] = $value;
        }

        return $this;
    }

    public function boot()
    {
        if ($this->booted) {
            return;
        }
        $this->booted = true;

        foreach ($this->providers as $provider) {
            if (method_exists($provider, 'boot')) {
                $provider->boot($this);
            }
        }
    }

    public function mount($prefix, $controllers)
    {
        if ($controllers instanceof ControllerProviderInterface) {
            $collection = $controllers->connect($this);
            if (!$collection instanceof ControllerCollection) {
                throw new \LogicException('The connect method must return a ControllerCollection instance.');
            }
            $this->controllers[] = ['prefix' => $prefix, 'collection' => $collection];
        } elseif ($controllers instanceof ControllerCollection) {
            $this->controllers[] = ['prefix' => $prefix, 'collection' => $controllers];
        } elseif (is_callable($controllers)) {
            $collection = $this['controllers_factory'];
            $controllers($collection);
            $this->controllers[] = ['prefix' => $prefix, 'collection' => $collection];
        } else {
            throw new \LogicException('mount() expects a ControllerProviderInterface, ControllerCollection, or callable.');
        }
    }

    protected function flush()
    {
        foreach ($this->controllers as $entry) {
            $routes = $entry['collection']->flush($entry['prefix']);
            $this->routes->addCollection($routes);
        }
    }

    public function error($callback, $priority = -8)
    {
        $app = $this;
        $this['dispatcher']->addListener(KernelEvents::EXCEPTION, function (ExceptionEvent $event) use ($callback, $app) {
            $exception = $event->getThrowable();
            $code = $exception instanceof \Symfony\Component\HttpKernel\Exception\HttpExceptionInterface
                ? $exception->getStatusCode()
                : 500;

            $result = $callback($exception, $code);

            if ($result instanceof Response) {
                $event->setResponse($result);
            } elseif (is_string($result)) {
                $event->setResponse(new Response($result, $code));
            }
        }, $priority);
    }

    public function before($callback, $priority = 0)
    {
        $this['dispatcher']->addListener(KernelEvents::REQUEST, function ($event) use ($callback) {
            if ($event->isMainRequest()) {
                $result = $callback($event->getRequest(), $this);
                if ($result instanceof Response) {
                    $event->setResponse($result);
                }
            }
        }, $priority);
    }

    public function after($callback, $priority = 0)
    {
        $this['dispatcher']->addListener(KernelEvents::RESPONSE, function ($event) use ($callback) {
            $callback($event->getRequest(), $event->getResponse(), $this);
        }, $priority);
    }

    public function finish($callback, $priority = 0)
    {
        $this['dispatcher']->addListener(KernelEvents::TERMINATE, function (TerminateEvent $event) use ($callback) {
            $callback($event->getRequest(), $event->getResponse());
        }, $priority);
    }

    public function redirect($url, $status = 302)
    {
        return new RedirectResponse($url, $status);
    }

    public function handle(Request $request, int $type = HttpKernelInterface::MAIN_REQUEST, bool $catch = true): Response
    {
        $this->boot();
        $this->flush();

        // Set up routing listener
        $matcher = new UrlMatcher($this->routes, $this['request_context']);
        $this['request_context']->fromRequest($request);

        $routerListener = new RouterListener($matcher, $this['request_stack']);
        $this['dispatcher']->addListener(KernelEvents::REQUEST, [$routerListener, 'onKernelRequest'], 256);

        // String to response listener
        $this['dispatcher']->addListener(KernelEvents::VIEW, function (ViewEvent $event) {
            $result = $event->getControllerResult();
            if (is_string($result)) {
                $event->setResponse(new Response($result));
            }
        }, -10);

        // Converter listener
        $app = $this;
        $this['dispatcher']->addListener(KernelEvents::CONTROLLER, function ($event) use ($app) {
            $request = $event->getRequest();
            $route = $this->routes->get($request->attributes->get('_route'));
            if (!$route) {
                return;
            }
            $converters = $route->getOption('_converters') ?: [];
            foreach ($converters as $name => $callback) {
                $callback = $app['callback_resolver']->resolveCallback($callback);
                $value = $request->attributes->get($name);
                $request->attributes->set($name, $callback($value, $request));
            }
        });

        return $this['kernel']->handle($request, $type, $catch);
    }

    public function run(Request $request = null)
    {
        if ($request === null) {
            $request = Request::createFromGlobals();
        }

        $response = $this->handle($request);
        $response->send();

        $this['kernel']->terminate($request, $response);
    }
}
