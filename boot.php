<?php
// This is where we move to Symfony form Silex
// Startup and configure Silex application
// https://github.com/symfony/symfony-docs/issues/8678
$app = new GitList\Application($config, __DIR__);

// Mount the controllers
$app->mount('', new GitList\Controller\MainController());
$app->mount('', new GitList\Controller\BlobController());
$app->mount('', new GitList\Controller\CommitController());
$app->mount('', new GitList\Controller\TreeController());
$app->mount('', new GitList\Controller\NetworkController());
$app->mount('', new GitList\Controller\TreeGraphController());
$app->mount('', new GitList\Controller\GitController());

return $app;

