<?php

namespace GitList\Controller;

use Framework\Application;
use Framework\ControllerProviderInterface;
use Symfony\Component\HttpFoundation\Response;

class BlobController implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        $route = $app['controllers_factory'];

        $route->get('{repo}/blob/{commitishPath}', function ($repo, $commitishPath) use ($app) {
            $repository = $app['git']->getRepositoryFromName($app['git.repos'], $repo);

            list($branch, $file) = $app['util.routing']
                ->parseCommitishPathParam($commitishPath, $repo);

            list($branch, $file) = $app['util.repository']->extractRef($repository, $branch, $file);

            $blob = $repository->getBlob("$branch:\"$file\"");
            $breadcrumbs = $app['util.view']->getBreadcrumbs($file);
            $fileType = $app['util.repository']->getFileType($file);

            $binary = $app['util.repository']->isBinary($file) && $fileType !== 'image';

            /*
            if ($fileType !== 'image' && $app['util.repository']->isBinary($file)) {
                return $app->redirect($app['url_generator']->generate('blob_raw', array(
                    'repo'   => $repo,
                    'commitishPath' => $commitishPath,
                )));
            }
            */

            if (!$binary) {
                $output = $blob->output();
            } else {
                $output = '';
            }

            $extension = '';
            $pathinfo = (pathinfo($file));
            if (isset($pathinfo['extension'])) {
                $extension = $pathinfo['extension'];
            }

            $isHtml = in_array(strtolower($extension), ['html', 'htm']);

            $lineCount = 0;
            if (!$binary && $output !== '') {
                $lineCount = substr_count($output, "\n") + 1;
            }

            return $app['twig']->render('file.twig', array(
                'binary' => $binary,
                'fileSize' => strlen($output),
                'lineCount' => $lineCount,
                'extension' => $extension,
                'file' => $file,
                'fileType' => $fileType,
                'blob' => $output,
                'repo' => $repo,
                'breadcrumbs' => $breadcrumbs,
                'branch' => $branch,
                'branches' => $repository->getBranches(),
                'browse_type' => 'blob',
                'tags' => $repository->getTags(),
                'enforceCodemirror' => isset($_GET['codemirror']),
                'isHtml' => $isHtml,
            ));
        })->assert('repo', $app['util.routing']->getRepositoryRegex())
            ->assert('commitishPath', '.+')
            ->convert('commitishPath', 'escaper.argument:escape')
            ->bind('blob');

        $route->get('{repo}/raw/{commitishPath}', function ($repo, $commitishPath) use ($app) {
            $repository = $app['git']->getRepositoryFromName($app['git.repos'], $repo);

            list($branch, $file) = $app['util.routing']
                ->parseCommitishPathParam($commitishPath, $repo);

            list($branch, $file) = $app['util.repository']->extractRef($repository, $branch, $file);

            $blob = $repository->getBlob("$branch:\"$file\"")->output();

            $headers = array();
            if ($app['util.repository']->isBinary($file)) {
                $headers['Content-Disposition'] = 'attachment; filename="' . $file . '"';
                $headers['Content-Type'] = 'application/octet-stream';
            } else {
                $mimeMap = [
                    // HTML
                    'html' => 'text/html; charset=UTF-8',
                    'htm' => 'text/html; charset=UTF-8',
                    // CSS / JS
                    'css' => 'text/css; charset=UTF-8',
                    'js' => 'application/javascript; charset=UTF-8',
                    'mjs' => 'application/javascript; charset=UTF-8',
                    // Data
                    'json' => 'application/json; charset=UTF-8',
                    'xml' => 'application/xml; charset=UTF-8',
                    'svg' => 'image/svg+xml; charset=UTF-8',
                    // PDF
                    'pdf' => 'application/pdf',
                    // Video
                    'mp4' => 'video/mp4',
                    'webm' => 'video/webm',
                    'ogv' => 'video/ogg',
                    // Audio
                    'mp3' => 'audio/mpeg',
                    'ogg' => 'audio/ogg',
                    'wav' => 'audio/wav',
                    'flac' => 'audio/flac',
                    // Images
                    'png' => 'image/png',
                    'jpg' => 'image/jpeg',
                    'jpeg' => 'image/jpeg',
                    'gif' => 'image/gif',
                    'webp' => 'image/webp',
                    'ico' => 'image/x-icon',
                    'bmp' => 'image/bmp',
                ];
                $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                $headers['Content-Type'] = $mimeMap[$extension] ?? 'text/plain';
            }

            return new Response($blob, 200, $headers);
        })->assert('repo', $app['util.routing']->getRepositoryRegex())
            ->assert('commitishPath', $app['util.routing']->getCommitishPathRegex())
            ->convert('commitishPath', 'escaper.argument:escape')
            ->bind('blob_raw');

        return $route;
    }
}

