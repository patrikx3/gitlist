<?php

namespace GitList\Controller;

use Gitlist\Application as GitlistApp;
use Gitter\Repository;
use Silex\Application;
use Silex\Api\ControllerProviderInterface;
use Symfony\Component\HttpFoundation\Request;

use Spatie\TemporaryDirectory\TemporaryDirectory;


class GitController implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        $route = $app['controllers_factory'];

        $route->post('{repo}/git-helper/{branch}/save', function (Request $request, $repo, $branch = '') use ($app) {
            $repository = ($app['git']->getRepositoryFromName($app['git.repos'], $repo));

            $temporaryDirectory = '';
            $tempRepo = '';
            $hadError = false;
            $command  = '';
            $output = '';
            try {
                if ($repository instanceof Repository && $app instanceof GitlistApp) {

                    $temporaryDirectory = (new TemporaryDirectory($app->getCachePath()))->create();

                    $client = $repository->getClient();
                    $repoPath = realpath($repository->getPath());
                    $tempRepo = $temporaryDirectory->path();

                    $output =  $client->run($repository, 'clone '. $repoPath . ' ' . $tempRepo);
                    $repository->setPath($tempRepo);

                    $command = "checkout $branch";
                    $output = $client->run($repository, $command);

                    $filename = realpath($tempRepo . DIRECTORY_SEPARATOR . $request->get('filename'));
                    //$originalFileContent = file_get_contents($filename);

                    $value = $request->get('value');
                    $email = $request->get('email');
                    $name = $request->get('name');
                    $comment = $request->get('comment');

                    file_put_contents($filename, $value);

                    $command = " -c \"user.name=$name\" -c \"user.email=$email\" commit -am \"$comment\" ";
                    $output = $client->run($repository, $command);
//                    $command = "commit -am \"$comment\"";
//                    $output = $client->run($repository, $command);
                    $command = "push";
                    $output = $client->run($repository, "push");
                    $result =  (object) [
                        'status' => 'ok',
                        'output' => $output,
                    ];
                    return json_encode($result);
                }
            } catch(\Throwable $e) {
                $hadError = $e;
            } finally {
                if ($temporaryDirectory !== '') {
                  $temporaryDirectory->delete();
                }

                if ($hadError !== false) {
                    $message = $hadError->getMessage();
                    return json_encode((object) [
                        'status' => $message === '' ? 'ok' : 'error',
                        'error' => $message === '' ? false : true,
                        //'temporaryDirectory' => $tempRepo,
                        'message' => $message,
                        //'currentdir' => getcwd(),
                        //'command' => $command,
                        'output' => $output,
                        //'$filename' => $filename,
                        //'$value' => $value,
                    ]);
                }

            }
        });

        return $route;
    }
}

