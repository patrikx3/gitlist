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

class Tree extends Item implements \RecursiveIterator
{
    public $path = '';
    protected $data;
    protected $position = 0;
    private $submodules = null;
    private $decorationCache = null;

    public function __construct($hash, Repository $repository)
    {
        $this->setHash($hash);
        $pathArray = explode(":", $hash);
        if (isset($pathArray[1])) {
            $this->path = str_replace("\"", "", $pathArray[1]);
        }
        //exit;
        $this->setRepository($repository);
    }

    public function parse()
    {
        $data = $this->getRepository()->getClient()->run($this->getRepository(), 'ls-tree -lz ' . $this->getHash());
        $lines = explode("\0", $data);
        $files = array();
        $root = array();

        //print_r($data);

        foreach ($lines as $key => $line) {
            if (empty($line)) {
                unset($lines[$key]);
                continue;
            }
            $tabSplit = preg_split("/[\t]+/", $line, 2);
            $file = preg_split("/[\s]+/", $tabSplit[0], 4);

            $file[] = $tabSplit[1];
            $files[] = $file;
        }

        foreach ($files as $file) {

            // submodule
            if ($file[0] == '160000') {
                $submodules = $this->getSubmodules($files, $this->getHash());
                if (strpos($this->getHash(), ':') === false) {
                    $submoduleName = $file[4];
                } else {
                    $submoduleName = str_replace('"', '', explode(':', $this->getHash())[1]) . "$file[4]";
                }

                $shortHash = $this->getRepository()->getShortHash($file[2]);
                $tree = new Module;
                $tree->setMode($file[0]);
                $tree->setName($file[4]);
                $tree->setHash($file[2]);
                $tree->setShortHash($shortHash);
//                echo $submoduleName;
                //              exit;
                $submoduleKey = "submodule $submoduleName";
                $url = '';
                if (is_array($submodules) && isset($submodules[$submoduleKey]['url'])) {
                    $url = $submodules[$submoduleKey]['url'];
                    if (preg_match('/^https?:\/\/(www\.)?github.com\//i', $url)) {
                        if (str_ends_with($url, '.git')) {
                            $url = substr($url, 0, -4);
                        }
                    }
                }
                $tree->setUrl($url);
                $this->decorateItem($file[4], $tree);
                $root[] = $tree;
                continue;
            }

            if ($file[0] == '120000') {
                $show = $this->getRepository()->getClient()->run($this->getRepository(), 'show ' . $file[2]);
                $tree = new Symlink;
                $tree->setMode($file[0]);
                $tree->setName($file[4]);
                $tree->setPath($show);
                $this->decorateItem($file[4], $tree);
                $root[] = $tree;
                continue;
            }

            if ($file[1] == 'blob') {
                $blob = new Blob($file[2], $this->getRepository());
                $blob->setMode($file[0]);
                $blob->setName($file[4]);
                $blob->setSize($file[3]);
                $this->decorateItem($file[4], $blob);


                $root[] = $blob;
                continue;
            }

            $tree = new Tree($file[2], $this->getRepository());

            $tree->setMode($file[0]);
            $tree->setName($file[4]);
            $this->decorateItem($file[4], $tree);
            $root[] = $tree;
        }

        $this->data = $root;
    }

    private function getSubmodules($files, $hash)
    {
        if ($this->submodules === null) {
            foreach ($files as $file) {
                if ($file[4] === '.gitmodules') {
                    $branch = $hash;
                    $gitsubmodule = $this->getRepository()->getBlob("$branch:\"$file[4]\"")->output();
                    $this->submodules = parse_ini_string($gitsubmodule, true);
                }
            }

            if ($this->submodules === null && strpos($hash, ':') !== false) {
                // Search in root folder
                $data = $this->getRepository()->getClient()->run($this->getRepository(), 'ls-tree -lz ' . explode(':', $hash)[0]);
                $lines = explode("\0", $data);
                $rootFolderFiles = array();
                $root = array();

                foreach ($lines as $key => $line) {
                    if (empty($line)) {
                        unset($lines[$key]);
                        continue;
                    }
                    $rootFolderFiles[] = preg_split("/[\s]+/", $line, 5);
                }

                $this->submodules = $this->getSubmodules($rootFolderFiles, explode(':', $hash)[0]);
            }
        }
        return $this->submodules;
    }

    private function buildDecorationCache()
    {
        if ($this->decorationCache !== null) {
            return;
        }
        $this->decorationCache = [];
        $branch = explode(':', $this->getHash())[0];
        // One git log over the whole directory; we walk newest-to-oldest and
        // record the FIRST occurrence of each filename. ASCII record sep \x1e
        // separates commits, unit sep \x1f separates fields.
        $sep = "\x1e";
        $usep = "\x1f";
        $pathArg = $this->path !== '' ? ' -- ' . escapeshellarg(rtrim($this->path, '/') . '/') : '';
        $command = 'log --name-only -z --pretty=tformat:"' . $sep . '%ar' . $usep . '%s"' . ' ' . escapeshellarg($branch) . $pathArg;
        $out = $this->getRepository()->getClient()->run($this->getRepository(), $command);
        if ($out === '' || $out === null) {
            return;
        }
        $blocks = explode($sep, $out);
        foreach ($blocks as $block) {
            $block = ltrim($block, "\n\0");
            if ($block === '') {
                continue;
            }
            // First line is "ar\x1fsubject", remaining lines are filenames separated by \0
            [$header, $rest] = array_pad(explode("\n", $block, 2), 2, '');
            [$ar, $subject] = array_pad(explode($usep, $header, 2), 2, '');
            if ($rest === '') {
                continue;
            }
            $files = explode("\0", $rest);
            foreach ($files as $f) {
                if ($f === '') {
                    continue;
                }
                // Strip the directory prefix so the cache key matches $filename in decorateItem
                if ($this->path !== '' && str_starts_with($f, $this->path)) {
                    $rel = substr($f, strlen($this->path));
                } else {
                    $rel = $f;
                }
                // Only the immediate child (first path segment) — match decorateItem's filename arg
                $slash = strpos($rel, '/');
                $key = $slash === false ? $rel : substr($rel, 0, $slash);
                if ($key === '' || isset($this->decorationCache[$key])) {
                    continue;
                }
                $this->decorationCache[$key] = [$ar, $subject];
            }
        }
    }

    public function decorateItem($filename, $item)
    {
        $this->buildDecorationCache();
        if (isset($this->decorationCache[$filename])) {
            [$ar, $subject] = $this->decorationCache[$filename];
            $item->setLastModified($ar);
            $item->message = $subject;
            return;
        }
        // Fallback: file not found in cache (very rare); single git log
        $command = 'log -1 --pretty=tformat:"%ar%n%s" ' . escapeshellarg(explode(':', $this->getHash())[0]) . ' -- ' . escapeshellarg($this->path . $filename);
        $fileInfo = explode("\n", $this->getRepository()->getClient()->run($this->getRepository(), $command));
        $item->setLastModified($fileInfo[0] ?? '');
        $item->message = $fileInfo[1] ?? '';
    }

    public function output()
    {
        $files = $folders = array();

        foreach ($this as $node) {
            if ($node instanceof Blob) {
                $file['type'] = 'blob';
                $file['name'] = $node->getName();
                $file['size'] = $node->getSize();
                $file['mode'] = $node->getMode();
                $file['hash'] = $node->getHash();
                $file['lastModified'] = $node->getLastModified();
                $file['message'] = $node->message;
                $files[] = $file;
                continue;
            }

            if ($node instanceof Tree) {
                $folder['type'] = 'folder';
                $folder['name'] = $node->getName();
                $folder['size'] = '';
                $folder['mode'] = $node->getMode();
                $folder['hash'] = $node->getHash();
                $folder['lastModified'] = $node->getLastModified();
                $folder['message'] = $node->message;
                $folders[] = $folder;
                continue;
            }

            if ($node instanceof Module) {

                $folder['type'] = 'module';
                $folder['name'] = $node->getName();
                $folder['size'] = '';
                $folder['mode'] = $node->getMode();
                $folder['hash'] = $node->getHash();
                $folder['shortHash'] = $node->getShortHash();
                $folder['url'] = $node->getUrl();
                $folders[] = $folder;
                $folder['lastModified'] = $node->getLastModified();
                $folder['message'] = $node->message;
                continue;
            }

            if ($node instanceof Symlink) {
                $folder['type'] = 'symlink';
                $folder['name'] = $node->getName();
                $folder['size'] = '';
                $folder['mode'] = $node->getMode();
                $folder['hash'] = '';
                $folder['path'] = $node->getPath();
                $folder['lastModified'] = $node->getLastModified();
                $folder['message'] = $node->message;
                $folders[] = $folder;
            }
        }

        // Little hack to make folders appear before files
        $files = array_merge($folders, $files);

        return $files;
    }

    #[\ReturnTypeWillChange]
    public function valid()
    {
        return isset($this->data[$this->position]);
    }

    #[\ReturnTypeWillChange]
    public function hasChildren()
    {
        return is_array($this->data[$this->position]);
    }

    #[\ReturnTypeWillChange]
    public function next()
    {
        $this->position++;
    }

    #[\ReturnTypeWillChange]
    public function current()
    {
        return $this->data[$this->position];
    }

    #[\ReturnTypeWillChange]
    public function getChildren()
    {
        return $this->data[$this->position];
    }

    #[\ReturnTypeWillChange]
    public function rewind()
    {
        $this->position = 0;
    }

    #[\ReturnTypeWillChange]
    public function key()
    {
        return $this->position;
    }

    public function isTree()
    {
        return true;
    }
}
