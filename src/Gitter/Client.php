<?php

/*
 * This file is part of the Gitter library.
 *
 * (c) Klaus Silveira <klaussilveira@php.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Gitter;

use Symfony\Component\Process\Process;
use Symfony\Component\Process\ExecutableFinder;

class Client
{
    protected $defaultBranch;
    protected $hidden;
    protected $projects;
    protected $path;


    public function __construct($options = null)
    {
        $path = null;
        if (is_array($options)) {
            $this->setDefaultBranch($options['default_branch']);
            $this->setHidden($options['hidden']);
            $this->setProjects($options['projects'] ?? array());
            $path = $options['path'];
        }

        if (!$path) {
            $finder = new ExecutableFinder();
            $path = $finder->find('git', '/usr/bin/git');
        }

        $this->setPath($path);
    }

    /**
     * Creates a new repository on the specified path
     *
     * @param  string     $path Path where the new repository will be created
     * @return Repository Instance of Repository
     */
    public function createRepository($path, $bare = null)
    {
        if (file_exists($path . '/.git/HEAD') && !file_exists($path . '/HEAD')) {
            throw new \RuntimeException('A GIT repository already exists at ' . $path);
        }

        $repository = new Repository($path, $this);

        return $repository->create($bare);
    }

    /**
     * Opens a repository at the specified path
     *
     * @param  string     $path Path where the repository is located
     * @return Repository Instance of Repository
     */
    public function getRepository($path)
    {
        if (!file_exists($path) || !file_exists($path . '/.git/HEAD') && !file_exists($path . '/HEAD')) {
            throw new \RuntimeException('There is no GIT repository at ' . $path);
        }

        return new Repository($path, $this);
    }

    public function run($repository, $command)
    {
        if (version_compare($this->getVersion(), '1.7.2', '>=')) {
            $command = '-c "color.ui"=false ' . $command;
        }

        $command = $this->getPath() . ' ' . $command;

//        echo $command;
//        echo "<br/>";
//        echo $repository->getPath();
//        echo "<br/>";
//        echo "<br/>";

        $process = new Process($command, $repository->getPath());
        $process->setTimeout(180);
        $process->run();

        if (!$process->isSuccessful()) {
            throw new \RuntimeException($process->getErrorOutput());
        }

        return $process->getOutput();
    }

    public function getVersion()
    {
        static $version;

        if (null !== $version) {
            return $version;
        }

        $process = new Process($this->getPath() . ' --version');
        $process->run();

        if (!$process->isSuccessful()) {
            throw new \RuntimeException($process->getErrorOutput());
        }

        $version = trim(substr($process->getOutput(), 12));
        return $version;
    }

    /**
     * Get the current Git binary path
     *
     * @return string Path where the Git binary is located
     */
    protected function getPath()
    {
        return escapeshellarg($this->path);
    }

    /**
     * Set the current Git binary path
     *
     * @param string $path Path where the Git binary is located
     */
    protected function setPath($path)
    {
        $this->path = $path;

        return $this;
    }

    /**
     * Set default branch as a string.
     *
     * @param string $branch Name of branch to use when repo's HEAD is detached.
     * @return object
     */
    protected function setDefaultBranch($branch)
    {
        $this->defaultBranch = $branch;

        return $this;
    }

    /**
     * Return name of default branch as a string.
     */
    public function getDefaultBranch()
    {
        return $this->defaultBranch;
    }

    /**
     * Get hidden repository list
     *
     * @return array List of repositories to hide
     */
    protected function getHidden()
    {
        return $this->hidden;
    }

    /**
     * Set the hidden repository list
     *
     * @param array $hidden List of repositories to hide
     * @return object
     */
    protected function setHidden($hidden)
    {
        $this->hidden = $hidden;

        return $this;
    }

    /**
     * Get project list
     *
     * @return array List of repositories to show
     */
    protected function getProjects()
    {
        return $this->projects;
    }

    /**
     * Set the shown repository list
     *
     * @param array $projects List of repositories to show
     */
    protected function setProjects($projects)
    {
        $this->projects = $projects;

        return $this;
    }


    public function getRepositoryFromName($paths, $repo)
    {
        $repositories = $this->getRepositories($paths);
        $path = $repositories[$repo]['path'];

        return $this->getRepository($path);
    }

    /**
     * Searches for valid repositories on the specified path
     *
     * @param  array $paths Array of paths where repositories will be searched
     * @return array Found repositories, containing their name, path and description sorted
     *               by repository name
     */
    public function getRepositories($paths)
    {
        $allRepositories = array();

        foreach ($paths as $path) {
            $repositories = $this->recurseDirectory($path);

            if (empty($repositories)) {
                throw new \RuntimeException('There are no GIT repositories in ' . $path);
            }

            /**
             * Use "+" to preserve keys, only a problem with numeric repos
             */
            $allRepositories = $allRepositories + $repositories;
        }

        $allRepositories = array_unique($allRepositories, SORT_REGULAR);
        uksort($allRepositories, function($k1, $k2) {
            return strtolower($k2)<strtolower($k1);
        });

        return $allRepositories;
    }

    private function recurseDirectory($path, $appendPath = '')
    {
        $dir = new \DirectoryIterator($path);

        $repositories = array();

        foreach ($dir as $file) {
            if ($file->isDot()) {
                continue;
            }

            if (strrpos($file->getFilename(), '.') === 0) {
                continue;
            }

            if (!$file->isReadable()) {
                continue;
            }

            if ($file->isDir()) {
                $isBare = file_exists($file->getPathname() . '/HEAD');
                $isRepository = file_exists($file->getPathname() . '/.git/HEAD');

                if ($isRepository || $isBare) {
                    if (in_array($file->getPathname(), $this->getHidden())) {
                        continue;
                    }

                    if ($isBare) {
                        $description = $file->getPathname() . '/description';
                    } else {
                        $description = $file->getPathname() . '/.git/description';
                    }

                    if (file_exists($description)) {
                        $description = file_get_contents($description);
                    } else {
                        $description = null;
                    }

                    $repoName = $appendPath . $file->getFilename();

                    if (is_array($this->getProjects()) && !in_array($repoName, $this->getProjects())) {
                        continue;
                    }

                    $repositories[$repoName] = array(
                        'name' => $repoName,
                        'path' => $file->getPathname(),
                        'description' => $description
                    );

                    continue;
                } else {
                    $repositories = array_merge($repositories, $this->recurseDirectory($file->getPathname(), $appendPath . $file->getFilename() . '/'));
                }
            }
        }

        return $repositories;
    }

}
