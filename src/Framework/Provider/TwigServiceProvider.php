<?php

namespace Framework\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Twig\Environment;
use Twig\Loader\FilesystemLoader;
use Twig\Loader\ChainLoader;
use Twig\Loader\ArrayLoader;
use Twig\Extension\DebugExtension;
use Symfony\Bridge\Twig\Extension\RoutingExtension;

class TwigServiceProvider implements ServiceProviderInterface
{
    public function register(Container $app)
    {
        $app['twig.path'] = [];
        $app['twig.templates'] = [];
        $app['twig.options'] = [];

        $app['twig.loader.filesystem'] = function ($app) {
            $paths = $app['twig.path'];
            if (!is_array($paths)) {
                $paths = [$paths];
            }
            return new FilesystemLoader($paths);
        };

        $app['twig.loader.array'] = function ($app) {
            return new ArrayLoader($app['twig.templates']);
        };

        $app['twig.loader'] = function ($app) {
            return new ChainLoader([
                $app['twig.loader.filesystem'],
                $app['twig.loader.array'],
            ]);
        };

        $app['twig'] = function ($app) {
            $options = array_merge([
                'charset' => 'UTF-8',
                'debug' => $app['debug'] ?? false,
                'strict_variables' => $app['debug'] ?? false,
            ], $app['twig.options']);

            $twig = new Environment($app['twig.loader'], $options);

            if ($app['debug'] ?? false) {
                $twig->addExtension(new DebugExtension());
            }

            if (isset($app['url_generator'])) {
                $twig->addExtension(new RoutingExtension($app['url_generator']));
            }

            $twig->addGlobal('app', $app);
            $twig->addGlobal('global', new class($app) {
                private $app;
                public function __construct($app) { $this->app = $app; }
                public function __get($name) {
                    if ($name === 'request') {
                        return $this->app['request_stack']->getCurrentRequest();
                    }
                    return null;
                }
            });

            return $twig;
        };
    }

    public function boot(Container $app)
    {
    }
}
