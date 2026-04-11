<?php

namespace Framework;

use Symfony\Component\Routing\Route as BaseRoute;

class Route extends BaseRoute
{
    public function assert($variable, $regexp)
    {
        $this->setRequirement($variable, $regexp);
        return $this;
    }

    public function value($variable, $default)
    {
        $this->setDefault($variable, $default);
        return $this;
    }

    public function convert($variable, $callback)
    {
        $converters = $this->getOption('_converters') ?: [];
        $converters[$variable] = $callback;
        $this->setOption('_converters', $converters);
        return $this;
    }

    public function method($method)
    {
        $this->setMethods(explode('|', $method));
        return $this;
    }

    public function bind($routeName)
    {
        $this->setDefault('_bind', $routeName);
        return $this;
    }

    public function run($to)
    {
        $this->setDefault('_controller', $to);
        return $this;
    }

    public function before($callback)
    {
        $before = $this->getOption('_before_middlewares') ?: [];
        $before[] = $callback;
        $this->setOption('_before_middlewares', $before);
        return $this;
    }

    public function after($callback)
    {
        $after = $this->getOption('_after_middlewares') ?: [];
        $after[] = $callback;
        $this->setOption('_after_middlewares', $after);
        return $this;
    }
}
