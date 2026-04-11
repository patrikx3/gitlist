<?php
error_reporting(E_ALL);
//error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
ini_set('display_errors', 1);

/**
 * P3X GitList: an elegant and modern git repository viewer
 * http://github.com/patrikx3/gitlist
 */
if (!ini_get('date.timezone')) {
    date_default_timezone_set('UTC');
}

if (php_sapi_name() == 'cli-server' && file_exists(substr($_SERVER['REQUEST_URI'], 1))) {
    return false;
}

$cacheFolder = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'cache';
if (!is_writable($cacheFolder)) {
    die(sprintf('The "%s" folder must be writable for GitList to run.', $cacheFolder));
}

require '../vendor/autoload.php';

$config = GitList\Config::fromFile('../config.ini');

if ($config->get('date', 'timezone')) {
    date_default_timezone_set($config->get('date', 'timezone'));
}

$app = require '../boot.php';
$app->run();

