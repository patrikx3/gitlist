<?php

namespace GitList;

use Silex\Application as SilexApplication;
use Silex\Provider\TwigServiceProvider;
use Silex\Provider\UrlGeneratorServiceProvider;
use GitList\Provider\GitServiceProvider;
use GitList\Provider\RepositoryUtilServiceProvider;
use GitList\Provider\ViewUtilServiceProvider;
use GitList\Provider\RoutingUtilServiceProvider;
use Symfony\Component\Filesystem\Filesystem;

/**
 * GitList application.
 */
class Application extends SilexApplication
{
    protected $path;

    /**
     * Constructor initialize services.
     *
     * @param Config $config
     * @param string $root   Base path of the application files (views, cache)
     */
    public function __construct(Config $config, $root = null)
    {
        parent::__construct();
        $app = $this;
        $this->path = realpath($root);

        $string = file_get_contents("../package.json");
        $pkg = json_decode($string, true);

        $this['url_subdir'] = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
        if ($this['url_subdir'] === '/') {
            $this['url_subdir'] = '';
        }
        $this['debug'] = $config->get('app', 'debug');
        $this['date.format'] = $config->get('date', 'format') ? $config->get('date', 'format') : 'd/m/Y H:i:s';
        $this['theme'] = 'bootstrap';

        $this['title'] = $config->get('app', 'title') ? $config->get('app', 'title') : 'P3X GitList ' . $pkg['version'];
        $this['filetypes'] = $config->getSection('filetypes');
        $this['binary_filetypes'] = $config->getSection('binary_filetypes');
        $this['cache.archives'] = $this->getCachePath() . 'archives';
        $this['avatar.url'] = $config->get('avatar', 'url');
        $this['avatar.query'] = $config->get('avatar', 'query');
        $this['show_http_remote'] = $config->get('clone_button', 'show_http_remote');
        $this['use_https'] = $config->get('clone_button', 'use_https');
        $this['ssh_clone_subdir'] = $config->get('clone_button', 'ssh_clone_subdir');
        $this['http_user'] = $config->get('clone_button', 'http_user_dynamic') ? $_SERVER['PHP_AUTH_USER'] : $config->get('clone_button', 'http_user');

        $this['http_user'] = str_replace('@', '%40', $this['http_user']);

        $this['show_ssh_remote'] = $config->get('clone_button', 'show_ssh_remote');

        if (!isset($_SERVER['PHP_AUTH_USER'])) {
            $_SERVER['PHP_AUTH_USER'] = '';
        }

        $this['ssh_user'] = $config->get('clone_button', 'ssh_user_dynamic') ? $_SERVER['PHP_AUTH_USER'] : $config->get('clone_button', 'ssh_user');


        $this['ssh_user'] = str_replace('@', '%40', $this['ssh_user']);

        $this['git_http_subdir_calculated'] = $config->get('clone_button', 'git_http_subdir_calculated');
        $this['git_http_subdir'] = $config->get('clone_button', 'git_http_subdir');
        $this['fixed_navbar'] = $config->get('app', 'fixed_navbar');

        // Register services
        $this->register(new TwigServiceProvider(), array(
            'twig.path'       => array($this->getThemePath($this['theme'])),
            'twig.options'    => $config->get('app', 'cache') ?
                                 array('cache' => $this->getCachePath() . 'views') : array(),
        ));

        $repositories = $config->get('git', 'repositories');
        $this['git.projects'] = $config->get('git', 'project_list') ?
                                $this->parseProjectList($config->get('git', 'project_list')) :
                                false;

        $this->register(new GitServiceProvider(), array(
            'config'            => $config,
            'git.client'         => $config->get('git', 'client'),
            'git.repos'          => $repositories,
            'ini.file'           => "config.ini",
            'git.hidden'         => $config->get('git', 'hidden') ?
                                    $config->get('git', 'hidden') : array(),
            'git.default_branch' => $config->get('git', 'default_branch') ?
                                    $config->get('git', 'default_branch') : 'master',
        ));

        $this->register(new ViewUtilServiceProvider());
        $this->register(new RepositoryUtilServiceProvider());
        $this->register(new RoutingUtilServiceProvider());

        $this['twig'] =  $this->extend('twig', function ($twig, $app) use ($pkg, $config) {

            $twig->addFilter(new \Twig_SimpleFilter('to_id', function($value) {
                $value = str_replace(['.', '/', '\\', ' '], '-', $value);
                $value = strtolower($value);
                return $value;
            }));

            $twig->addFilter(new \Twig_SimpleFilter('remove_extension', function ($string) {
                return pathinfo($string, PATHINFO_FILENAME);
            }));


            $twig->addFilter(new \Twig_SimpleFilter('htmlentities', 'htmlentities'));
            $twig->addFilter(new \Twig_SimpleFilter('md5', 'md5'));
            $twig->addFilter(new \Twig_SimpleFilter('format_date', array($app, 'formatDate')));
            $twig->addFilter(new \Twig_SimpleFilter('format_size', array($app, 'formatSize')));
            $twig->addFunction(new \Twig_SimpleFunction('avatar', array($app, 'getAvatar')));

            $currentTheme = !isset($_COOKIE['gitlist-bootstrap-theme']) ? 'bootstrap-cosmo' : $_COOKIE['gitlist-bootstrap-theme'];
            $themeDark = [
                'cyborg',
                'darkly',
                'slate',
                'superhero',
                'solar',
            ];

            $twig->addGlobal('theme_type', !in_array(substr($currentTheme, strlen('bootstrap-')), $themeDark) ? 'p3x-gitlist-light' : 'p3x-gitlist-dark');

            $twig->addGlobal('theme', $currentTheme);
            $query = isset($_REQUEST['query']) ? $_REQUEST['query'] : (isset($_COOKIE['p3x-gitlist-query']) ? $_COOKIE['p3x-gitlist-query'] : '');

            setcookie('p3x-gitlist-query',$query,0, '/' . $this['url_subdir']);

            $_COOKIE['p3x-gitlist-query'] = $query;

            $twig->addGlobal('search_query', $query);

            $twig->addGlobal('theme_postfix', $pkg['corifeus']['css-postfix']);
            $twig->addGlobal('prod_dir', $pkg['corifeus']['prod-dir']);

            $twig->addGlobal('theme_dark', $themeDark);

            $twig->addGlobal('version', $pkg['version']);
            $twig->addGlobal('gitlist_date_format', $this['date.format']);


            $codemirror_full_limit = (int)$config->get('app', 'codemirror_full_limit');
            if (!is_int($codemirror_full_limit) || $codemirror_full_limit < 32) {
                $codemirror_full_limit = 32;
            }
            $twig->addGlobal('codemirror_full_limit', $codemirror_full_limit);


            return $twig;
        });

        $this['escaper.argument'] = $this->factory(function() {
            return new Escaper\ArgumentEscaper();
        });

        // Handle errors
        $this->error(function (\Exception $e, $code) use ($app) {
            if ($app['debug']) {
                return;
            }

            return $app['twig']->render('error.twig', array(
                'message' => $e->getMessage(),
            ));
        });

        $this->finish(function () use ($app, $config) {
            if (!$config->get('app', 'cache')) {
                $fs = new Filesystem();
                $fs->remove($app['cache.archives']);
            }
        });
    }

    public function formatDate($date)
    {
        return $date->format($this['date.format']);
    }

    public function formatSize($size)
    {
        $mod = 1000;
        $units = array('B', 'kB', 'MB', 'GB');
        for($i = 0; $size > $mod; $i++) $size /= $mod;
        return round($size, 2) . " " . $units[$i];
    }

    public function getAvatar($email, $size)
    {
        $url = $this['avatar.url'] ? $this['avatar.url'] : "//gravatar.com/avatar/";
        $query = array("s=$size");
        if (is_string($this['avatar.query']))
            $query[] = $this['avatar.query'];
        else if (is_array($this['avatar.query']))
            $query = array_merge($query, $this['avatar.query']);
        $id = md5(strtolower($email));
        return $url . $id . "?" . implode('&', $query);
    }

    public function getPath()
    {
        return $this->path . DIRECTORY_SEPARATOR;
    }

    public function setPath($path)
    {
        $this->path = $path;

        return $this;
    }

    public function getCachePath()
    {
        return $this->path
            . DIRECTORY_SEPARATOR
            . 'cache'
            . DIRECTORY_SEPARATOR;
    }

    public function getThemePath($theme)
    {
        return $this->path
            . DIRECTORY_SEPARATOR
            . 'src'
            . DIRECTORY_SEPARATOR
            . 'twig'
            . DIRECTORY_SEPARATOR;
    }

    public function parseProjectList($project_list)
    {
        $projects = array();
        $file = fopen($project_list, "r");
        while ($file && !feof($file))
            $projects[] = trim(fgets($file));
        fclose($file);
        return $projects;
    }
}
