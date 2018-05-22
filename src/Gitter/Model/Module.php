<?php
namespace Gitter\Model;

class Module extends File
{
    protected $url;

    public function setUrl($url) {
        $this->url = $url;
    }

    public function getUrl() {
        return $this->url;
    }
}
