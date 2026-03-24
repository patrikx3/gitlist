<?php

namespace Framework;

use Pimple\Container;

class CallbackResolver
{
    private const PATTERN = '/^[A-Za-z0-9._\-]+:[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$/';

    private $app;

    public function __construct(Container $app)
    {
        $this->app = $app;
    }

    public function resolveCallback($name)
    {
        if (is_string($name) && preg_match(self::PATTERN, $name)) {
            list($service, $method) = explode(':', $name, 2);
            return [$this->app[$service], $method];
        }

        return $name;
    }
}
