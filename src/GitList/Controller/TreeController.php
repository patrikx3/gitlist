<?php

namespace GitList\Controller;

use Silex\Application;
use Silex\Api\ControllerProviderInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class TreeController implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        $route = $app['controllers_factory'];

        $route->get('{repo}/tree/{commitishPath}/', $treeController = function ($repo, $commitishPath = '') use ($app) {
            $repository = $app['git']->getRepositoryFromName($app['git.repos'], $repo);
            $head = $repository->getHead();
            if (!$commitishPath) {
                $commitishPath = $head;
            }

            list($branch, $tree) = $app['util.routing']->parseCommitishPathParam($commitishPath, $repo);

            list($branch, $tree) = $app['util.repository']->extractRef($repository, $branch, $tree);
            $files = $repository->getTree($tree ? "$branch:\"$tree\"/" : $branch);
            $breadcrumbs = $app['util.view']->getBreadcrumbs($tree);

            $parent = null;
            if (($slash = strrpos($tree, '/')) !== false) {
                $parent = substr($tree, 0, $slash);
            } elseif (!empty($tree)) {
                $parent = '';
            }

            return $app['twig']->render('tree.twig', array(
                'head'           => $head,
                'files'          => $files->output(),
                'repo'           => $repo,
                'branch'         => $branch,
                'path'           => $tree ? $tree . '/' : $tree,
                'parent'         => $parent,
                'breadcrumbs'    => $breadcrumbs,
                'branches'       => $repository->getBranches(),
                'browse_type'    => 'tree',
                'tags'           => $repository->getTags(),
                'readme'         => $app['util.repository']->getReadme($repository, $branch, $tree ? "$tree" : ""),
            ));
        })->assert('repo', $app['util.routing']->getRepositoryRegex())
          ->assert('commitishPath', $app['util.routing']->getCommitishPathRegex())
          ->convert('commitishPath', 'escaper.argument:escape')
          ->bind('tree');

        $route->post('{repo}/tree/{branch}/search', function (Request $request, $repo, $branch = '', $tree = '') use ($app) {
            $repository = $app['git']->getRepositoryFromName($app['git.repos'], $repo);
            if (!$branch) {
                $branch = $repository->getHead();
            }

            $query = $request->get('query');
            $breadcrumbs = array(array('dir' => 'Search results for: ' . $query, 'path' => ''));
            $results = $repository->searchTree($query, $branch);

            if ($results === false) {
                $results = [];
            }
            for($i = 0; $i < count($results); $i++) {
                $result = $results[$i];
                $results[$i]['type'] = $app['util.repository']->getFileType($result['file']);
            }


            return $app['twig']->render('search.twig', array(
                'results'        => $results,
                'repo'           => $repo,
                'path'           => $tree,
                'breadcrumbs'    => $breadcrumbs,
                'branch'         => $branch,
                'branches'       => $repository->getBranches(),
                'browse_type'    => 'search',
                'tags'           => $repository->getTags(),
                'query'          => $query
            ));

        })->assert('repo', $app['util.routing']->getRepositoryRegex())
          ->assert('branch', $app['util.routing']->getBranchRegex())
          ->convert('branch', 'escaper.argument:escape')
          ->bind('search');

        $route->get('{repo}/{format}ball/{branch}', function($repo, $format, $branch) use ($app) {
            $repository = $app['git']->getRepositoryFromName($app['git.repos'], $repo);

            $tree = $repository->getBranchTree($branch);

            if (false === $tree) {
                return $app->abort(404, 'Invalid commit or tree reference: ' . $branch);
            }

            $file = $app['cache.archives'] . DIRECTORY_SEPARATOR
                    . $repo . DIRECTORY_SEPARATOR
                    . substr($tree, 0, 2) . DIRECTORY_SEPARATOR
                    . substr($tree, 2)
                    . '.'
                    . $format;

            if (!file_exists($file)) {
                $repository->createArchive($tree, $file, $format);
            }

            /**
             * Generating name for downloading, lowercasing and removing all non
             * ascii and special characters
             */
            $filename = strtolower($repo.'-'.$branch);
            $filename = preg_replace('#[^a-z0-9]+#', '-', $filename);

            $shortHash = $repository->getShortHash($branch);

            $filename = $filename . '-' . $shortHash . '.' . $format;

            $response = new BinaryFileResponse($file);
            $response->setContentDisposition('attachment', $filename);
            return $response;
        })->assert('format', '(zip|tar)')
          ->assert('repo', $app['util.routing']->getRepositoryRegex())
          ->assert('branch', $app['util.routing']->getBranchRegex())
          ->convert('branch', 'escaper.argument:escape')
          ->bind('archive');


        // this is weird ... was / , not working, i changed to \/ , now it works
        $route->get('{repo}\/{branch}', function($repo, $branch) use ($app) {
            return $app->redirect( $app['url_subdir'] . '/' . $repo . '/tree/' . $branch);
        })->assert('repo', $app['util.routing']->getRepositoryRegex())
          ->assert('branch', $app['util.routing']->getBranchRegex())
          ->convert('branch', 'escaper.argument:escape')
          ->bind('branch');

        $route->get('{repo}/', function($repo) use ($app) {
            $repository = $app['git']->getRepositoryFromName($app['git.repos'], $repo);
            $head = $repository->getHead();
            return $app->redirect( $app['url_subdir'] . '/' . $repo . '/tree/' . $head);
        })->assert('repo', $app['util.routing']->getRepositoryRegex())
          ->bind('repository');

        return $route;
    }
}

