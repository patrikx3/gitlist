<?php

/*
 * This file is part of the Gitter library.
 *
 * (c) Klaus Silveira <klaussilveira@php.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Gitter\Model;

use Gitter\Repository;

class Blob extends Item
{
    public function __construct($hash, Repository $repository)
    {
        $this->setHash($hash);
        $this->setRepository($repository);
    }

    public function output()
    {
        $data = $this->getRepository()->getClient()->run($this->getRepository(), 'show ' . $this->getHash());

        return $data;
    }

    public function isBlob()
    {
        return true;
    }
}
