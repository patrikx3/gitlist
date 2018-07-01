<?php

namespace GitList\Controller;

use Silex\Application;
use Silex\Api\ControllerProviderInterface;
use Symfony\Component\HttpFoundation\Request;

class CommitController implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        $route = $app['controllers_factory'];
        $route->get('{repo}/commits/search', function (Request $request, $repo) use ($app) {
            $subRequest = Request::create(
                '/' . $repo . '/commits/master/search',
                'POST',
                array('query' => $request->get('query'))
            );
            return $app->handle($subRequest, \Symfony\Component\HttpKernel\HttpKernelInterface::SUB_REQUEST);
        })->assert('repo', $app['util.routing']->getRepositoryRegex());

        $route->get('{repo}/commits/{commitishPath}', function ($repo, $commitishPath) use ($app) {
            $repository = $app['git']->getRepositoryFromName($app['git.repos'], $repo);

            if ($commitishPath === null) {
                $commitishPath = $repository->getHead();
            }

            list($branch, $file) = $app['util.routing']
                ->parseCommitishPathParam($commitishPath, $repo);

            list($branch, $file) = $app['util.repository']->extractRef($repository, $branch, $file);

            $type = $file ? "$branch -- \"$file\"" : $branch;
            $pager = $app['util.view']->getPager($app['request_stack']->getCurrentRequest()->get('page'), $repository->getTotalCommits($type));
            $commits = $repository->getPaginatedCommits($type, $pager['current']);
            $categorized = array();


            foreach ($commits as $commit) {
                $date = $commit->getCommiterDate();
                $date = $date->format('Y-m-d');
                $categorized[$date][] = $commit;
            }

            $template = $app['request_stack']->getCurrentRequest()->isXmlHttpRequest() ? 'commits-list.js' : 'commits.twig';

            return $app['twig']->render($template, array(
                'page'           => 'commits',
                'pager'          => $pager,
                'repo'           => $repo,
                'branch'         => $branch,
                'branches'       => $repository->getBranches(),
                'browse_type'    => pathinfo($template)['filename'],
                'tags'           => $repository->getTags(),
                'commits'        => $categorized,
                'file'           => $file,
            ));
        })->assert('repo', $app['util.routing']->getRepositoryRegex())
          ->assert('commitishPath', $app['util.routing']->getCommitishPathRegex())
          ->value('commitishPath', null)
          ->convert('commitishPath', 'escaper.argument:escape')
          ->bind('commits');

        $route->post('{repo}/commits/{branch}/search', function (Request $request, $repo, $branch = '') use ($app) {
            $repository = $app['git']->getRepositoryFromName($app['git.repos'], $repo);
            $query = $request->get('query');

            $commits = $repository->searchCommitLog($query, $branch);
            $categorized = array();

            foreach ($commits as $commit) {
                $date = $commit->getCommiterDate();
                $date = $date->format('Y-m-d');
                $categorized[$date][] = $commit;
            }

            return $app['twig']->render('searchcommits.twig', array(
                'repo'           => $repo,
                'branch'         => $branch,
                'file'           => '',
                'commits'        => $categorized,
                'branches'       => $repository->getBranches(),
                'browse_type'    => 'searchcommits',
                'tags'           => $repository->getTags(),
                'query'          => $query
            ));
        })->assert('repo', $app['util.routing']->getRepositoryRegex())
          ->assert('branch', $app['util.routing']->getBranchRegex())
          ->convert('branch', 'escaper.argument:escape')
          ->bind('searchcommits');

        $route->get('{repo}/commit/{commit}', function (Request $request, $repo, $commit) use ($app) {
            $repository = $app['git']->getRepositoryFromName($app['git.repos'], $repo);

            $showLines = $request->get('ajax') === '1' || $app['request_stack']->getCurrentRequest()->isXmlHttpRequest();
            $filename = $request->get('filename');

            $commit = $repository->getCommit($commit, [
                "showLines" => $showLines,
                'filename' => $filename,
            ]);
            $branch = $repository->getHead();

            if($request->get('ajax') === '1' || $app['request_stack']->getCurrentRequest()->isXmlHttpRequest()) {
                $diffsInstance = $commit->getDiffs();
                $diffs = [];
                foreach($diffsInstance as $diffInstance) {
                    $lines = [];
                    foreach ($diffInstance->getLines() as $lineInstance) {
                        $lines[] = (object)[
                          'type' => $lineInstance->getType(),
                          'num-old' => $lineInstance->getNumOld(),
                          'num-new' => $lineInstance->getNumNew(),
                          'line' => $lineInstance->getLine(),
                        ];
                    }
                    $diffs[] = (object)[
                        'binary' => $diffInstance->getBinary(),
                        'file' => $diffInstance->getFile(),
                        'old' => trim($diffInstance->getOld()),
                        'new' => trim($diffInstance->getNew()),
                        'index' => trim($diffInstance->getIndex()),
                        'lines' => $lines,
                    ];
                }
                return $app->json($diffs);
            };


            return $app['twig']->render('commit.twig', array(
                'branches'       => $repository->getBranches(),
                'tags'           => $repository->getTags(),
                'browse_type'    => 'commit',
                'branch'         => $branch,
                'repo'           => $repo,
                'commit'         => $commit,
            ));
        })->assert('repo', $app['util.routing']->getRepositoryRegex())
          ->assert('commit', '[a-f0-9^]+')
          ->bind('commit');

        $route->get('{repo}/blame/{commitishPath}', function ($repo, $commitishPath) use ($app) {
            $repository = $app['git']->getRepositoryFromName($app['git.repos'], $repo);

            list($branch, $file) = $app['util.routing']
                ->parseCommitishPathParam($commitishPath, $repo);

            list($branch, $file) = $app['util.repository']->extractRef($repository, $branch, $file);

            $blames = $repository->getBlame("$branch -- \"$file\"");

            return $app['twig']->render('blame.twig', array(
                'file'           => $file,
                'repo'           => $repo,
                'branch'         => $branch,
                'branches'       => $repository->getBranches(),
                'browse_type'    => 'blame',
                'tags'           => $repository->getTags(),
                'blames'         => $blames,
            ));
        })->assert('repo', $app['util.routing']->getRepositoryRegex())
          ->assert('commitishPath', $app['util.routing']->getCommitishPathRegex())
          ->convert('commitishPath', 'escaper.argument:escape')
          ->bind('blame');

        return $route;
    }
}

