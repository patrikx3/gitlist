<?php
/*
 * This file is part of the Gitter library.
 *
 * (c) Patrik Laszlo <alabard@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GitList\Controller;

use Gitlist\Application as GitlistApp;
use Gitter\Repository;
use Silex\Application;
use Silex\Api\ControllerProviderInterface;
use Symfony\Component\HttpFoundation\Request;
use TheSeer\Tokenizer\Exception;

class GitController implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        $route = $app['controllers_factory'];

        $route->post('{repo}/git-helper/{branch}/{action}', function (Request $request, $repo, $branch = '', $action = '') use ($app) {
            $repository = ($app['git']->getRepositoryFromName($app['git.repos'], $repo));


            $hadError = false;

            try {

                if ($repository instanceof Repository && $app instanceof GitlistApp) {
                    $filename = $request->get('filename');
                    if ($filename !== null) {
                        $filename = trim($filename);
                    }
                    $value = $request->get('value');
                    $email = $request->get('email');
                    $name = $request->get('name');
                    $comment = $request->get('comment');


                    switch ($action) {
                        case 'save':
                            if (!$app['enable_editing']) {
                                throw new \Error('Editing is disabled');
                            }
                            $objectResult = $repository->changeFile($app->getCachePath(), $repo, $branch, $filename, $value, $name, $email, $comment);
                            return json_encode($objectResult);

                        case 'delete':
                            if (!$app['enable_editing']) {
                                throw new \Error('Editing is disabled');
                            }
                            $objectResult = $repository->deleteFile($app->getCachePath(), $repo, $branch, $filename, $name, $email, $comment);
                            return json_encode($objectResult);
                            break;

                        case 'new-file-or-directory':
                            if (!$app['enable_editing']) {
                                throw new \Error('Editing is disabled');
                            }
                            $objectResult = $repository->newFileOrDirectory($app->getCachePath(), $repo, $branch, $filename, $name, $email, $comment);
                            return json_encode($objectResult);
                            break;

                        case 'file-binary':
                            if (!$app['enable_editing']) {
                                throw new \Error('Editing is disabled');
                            }
                            $objectResult = $repository->newFileBinary($app->getCachePath(), $repo, $branch, $filename, $name, $email, $comment, $request->get('override') === '1' ? true : false, $_FILES['upload-file']);
                            return json_encode($objectResult);

                            /*
                            return json_encode((object)[
                               'filename' => $filename,
                                'email' => $email,
                                'name' => $name,
                                'comment' => $comment,
                                'upload-file' => $_FILES['upload-file'],
                                'override' => $request->get('override'),
                            ]);
                            */
                            break;

                        case 'fetch-origin':
                            try {
                                $objectResult = $repository->fetchOrigin();
                                return json_encode($objectResult);
                            } catch (\Exception $e) {
                                return json_encode(((object)[
                                    'status' => 'error',
                                    'error' => true,
                                    //'temporaryDirectory' => $tempRepo,
                                    'message' => $e->getMessage(),
                                    'trace' => $e->getTrace(),
                                    //'$filename' => $filename,
                                    //'$value' => $value,
                                ]));
                            }
                            break;

                        default:
                            return json_encode((object)[
                                'status' => 'error',
                                'error' => true,
                                'message' => 'Un-implemented action "' . $action . '".',
                            ]);

                    }
                }
            } catch (\Throwable $e) {
                $hadError = $e;
            } finally {
                if ($hadError !== false) {
                    return json_encode((object)[
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

