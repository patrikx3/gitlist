<?php

namespace GitList\Controller;

use Framework\Application;
use Framework\ControllerProviderInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class MainController implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        $route = $app['controllers_factory'];

        $route->post('/json-error', function (Request $request) use ($app) {

            return $app['twig']->render('error.twig', array(
                'error' => $request->get('error'),
            ));
        })->bind('json-error');


        $route->get('/', function () use ($app) {
            $repositories = $app['git']->getRepositories($app['git.repos']);

            return $app['twig']->render('index.twig', array(
                'repositories' => $repositories,
                'branch' => '',
                'repo' => '',
            ));
        })->bind('homepage');

        $route->get('api/repo-head/{repo}', function ($repo) use ($app) {
            $repository = $app['git']->getRepositoryFromName($app['git.repos'], $repo);

            $command = 'log --date-order --all -n 1 --date=rfc ' .
                '--pretty=format:"B[%D] D[%ad] A[%an] H[%h] S[%s]"';
            $raw = trim($repository->getClient()->run($repository, $command));

            $data = ['empty' => true];
            if ($raw !== '' && preg_match('/^B\[(.*?)\] D\[(.+?)\] A\[(.+?)\] H\[(.+?)\] S\[(.+?)\]$/', $raw, $m)) {
                $branch = $m[1];
                $branchArray = explode('->', $branch);
                if (isset($branchArray[1])) {
                    $branch = trim($branchArray[1]);
                }
                $data = [
                    'time' => $m[2],
                    'timestamp' => strtotime($m[2]),
                    'user' => $m[3],
                    'branch' => $branch,
                    'hash' => $m[4],
                    'subject' => $m[5],
                ];
            }

            return new Response(json_encode($data), 200, ['Content-Type' => 'application/json']);
        })->assert('repo', $app['util.routing']->getRepositoryRegex())
            ->bind('api_repo_head');

        $route->get('/refresh', function (Request $request) use ($app) {
            # Go back to calling page
            return $app->redirect($request->headers->get('Referer'));
        })->bind('refresh');

        $route->get('{repo}/stats/{branch}', function ($repo, $branch) use ($app) {
            $repository = $app['git']->getRepositoryFromName($app['git.repos'], $repo);

            if ($branch === null) {
                $branch = $repository->getHead();
            }

            $stats = $repository->getStatistics($branch);
            $authors = $repository->getAuthorStatistics($branch);

            return $app['twig']->render('stats.twig', array(
                'repo' => $repo,
                'branch' => $branch,
                'branches' => $repository->getBranches(),
                'browse_type' => 'stats',
                'tags' => $repository->getTags(),
                'stats' => $stats,
                'authors' => $authors,
            ));
        })->assert('repo', $app['util.routing']->getRepositoryRegex())
            ->assert('branch', $app['util.routing']->getBranchRegex())
            ->value('branch', null)
            ->convert('branch', 'escaper.argument:escape')
            ->bind('stats');

        $route->get('{repo}/{branch}/rss/', function ($repo, $branch) use ($app) {
            $repository = $app['git']->getRepositoryFromName($app['git.repos'], $repo);

            if ($branch === null) {
                $branch = $repository->getHead();
            }

            $commits = $repository->getPaginatedCommits($branch);

            $html = $app['twig']->render('rss.twig', array(
                'repo' => $repo,
                'branch' => $branch,
                'commits' => $commits,
            ));

            return new Response($html, 200, array('Content-Type' => 'application/xml'));
        })->assert('repo', $app['util.routing']->getRepositoryRegex())
            ->assert('branch', $app['util.routing']->getBranchRegex())
            ->value('branch', null)
            ->convert('branch', 'escaper.argument:escape')
            ->bind('rss');

        return $route;
    }
}
