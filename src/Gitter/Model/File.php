<?php

namespace Gitter\Model;

class File extends AbstractModel
{

    protected $mode;
    protected $name;
    protected $hash;
    protected $path;
    protected $size;
    protected $shortHash;

    public function getSize()
    {
        return $this->size;
    }

    public function setSize($size)
    {
        $this->size = $size;

        return $this;
    }

    public function getPath()
    {
        return $this->path;
    }

    public function setPath($path)
    {
        $this->path = $path;

        return $this;
    }

    public function getMode()
    {
        return $this->mode;
    }

    public function setMode($mode)
    {
        $this->mode = $mode;

        return $this;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    public function getHash()
    {
        return $this->hash;
    }

    public function setHash($hash)
    {
        $this->hash = $hash;

        return $this;
    }


    public function getShortHash()
    {
        return $this->shortHash;
    }

    public function setShortHash($hash)
    {
        $this->shortHash = $hash;

        return $this;
    }


}
