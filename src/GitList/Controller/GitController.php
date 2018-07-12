<?php

namespace GitList\Controller;

use Gitlist\Application as GitlistApp;
use Gitter\Repository;
use Silex\Application;
use Silex\Api\ControllerProviderInterface;
use Symfony\Component\HttpFoundation\Request;

class GitController implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        $route = $app['controllers_factory'];

        $route->post('{repo}/git-helper/{branch}/{action}', function (Request $request, $repo, $branch = '', $action) use ($app) {
            $repository = ($app['git']->getRepositoryFromName($app['git.repos'], $repo));

            $hadError = false;

            try {
                if ($repository instanceof Repository && $app instanceof GitlistApp) {
                    $filename = $request->get('filename');
                    $value = $request->get('value');
                    $email = $request->get('email');
                    $name = $request->get('name');
                    $comment = $request->get('comment');


                    switch($action) {
                        case 'save':
                            $objectResult = $repository->changeFile($app->getCachePath(), $repo, $branch, $filename, $value, $name, $email, $comment);
                            return json_encode($objectResult);

                        case 'delete':
                            $objectResult = $repository->deleteFile($app->getCachePath(), $repo, $branch, $filename, $name, $email, $comment);
                            return json_encode($objectResult);
                            break;

                        default:
                            return json_encode((object) [
                                'status' => 'error',
                                'error' => true,
                                'message' => 'Un-implemented action "' . $action . '".' ,
                            ]);

                    }
                }
            } catch(\Throwable $e) {
                $hadError = $e;
            } finally {
                if ($hadError !== false) {
                    return json_encode((object) [
                        'status' => 'error',
                        'error' => true,
                        'message' => $hadError->getMessage(),
                    ]);
                }
            }
        });

        return $route;
    }
}

