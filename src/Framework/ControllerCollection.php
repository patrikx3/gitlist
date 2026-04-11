<?php

namespace Framework;

use Symfony\Component\Routing\RouteCollection;

class ControllerCollection
{
    private $routes = [];
    private $prefix;
    private $routeFactory;

    public function __construct(callable $routeFactory, $prefix = '')
    {
        $this->routeFactory = $routeFactory;
        $this->prefix = $prefix;
    }

    public function match($pattern, $to = null)
    {
        $route = call_user_func($this->routeFactory);
        if ($to !== null) {
            $route->run($to);
        }
        $this->routes[] = ['pattern' => $pattern, 'route' => $route];
        return $route;
    }

    public function get($pattern, $to = null)
    {
        return $this->match($pattern, $to)->method('GET');
    }

    public function post($pattern, $to = null)
    {
        return $this->match($pattern, $to)->method('POST');
    }

    public function put($pattern, $to = null)
    {
        return $this->match($pattern, $to)->method('PUT');
    }

    public function delete($pattern, $to = null)
    {
        return $this->match($pattern, $to)->method('DELETE');
    }

    public function flush($prefix = '')
    {
        $collection = new RouteCollection();
        $combinedPrefix = $prefix . $this->prefix;

        foreach ($this->routes as $i => $entry) {
            $route = $entry['route'];
            $pattern = $entry['pattern'];

            $path = $combinedPrefix . $pattern;
            $route->setPath($path);

            $name = $route->getDefault('_bind');
            if (!$name) {
                $methods = implode('_', $route->getMethods()) ?: 'ANY';
                $name = $methods . '_' . preg_replace('/[^a-zA-Z0-9_]/', '_', $path) . '_' . $i;
            }

            $collection->add($name, $route);
        }

        return $collection;
    }
}
