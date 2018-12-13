<?php

namespace GitList\Controller;

use Silex\Application;
use Silex\Api\ControllerProviderInterface;
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

            $lastCommit = [];
            foreach ($repositories as $repo) {
                $repository = $app['git']->getRepositoryFromName($app['git.repos'], $repo['name']);

                $command = 'log --graph --date-order --all -C -M -n 1 --date=rfc ' .
                    '--pretty=format:"B[%D] C[%H] D[%ad] A[%an] E[%ae] H[%h] S[%s]"';
                $rawRows = $repository->getClient()->run($repository, $command);
                $rawRows = explode("\n", $rawRows);

                foreach ($rawRows as $row) {
                    if (preg_match("/^(.+?)(\s(B\[(.*?)\])? C\[(.+?)\] D\[(.+?)\] A\[(.+?)\] E\[(.+?)\] H\[(.+?)\] S\[(.+?)\])?$/", $row, $output)) {
                        if (!isset($output[4])) {
                            $graphItems[] = array(
                                "relation" => $output[1]
                            );
                            continue;
                        }
                        $branch = $output[4];
                        $branchArray = explode('->', $branch);
                        if (isset($branchArray[1])) {
                            $branch = trim($branchArray[1]);
                        }
                        $repositories[$repo['name']]['time'] = $output[6];
                        $repositories[$repo['name']]['timestamp'] = strtotime($output[6]);
                        $repositories[$repo['name']]['user'] = $output[7];
                        $repositories[$repo['name']]['branch'] = $branch;
                        $repositories[$repo['name']]['key'] = $repo['name'];

                        /*
                        $graphItems[] = array(
                            "relation"=>$output[1],
                            "branch"=>$output[4],
                            "rev"=>$output[5],
                            "date"=>$output[6],
                            "author"=>$output[7],
                            "author_email"=>$output[8],
                            "short_rev"=>$output[9],
                            "subject"=>preg_replace('/(^|\s)(#[[:xdigit:]]+)(\s|$)/', '$1<a href="$2">$2</a>$3', $output[10])
                        );
                        */
                    }
                }

            }

            uksort($repositories, function($a, $b) use ($repositories) {
                $timestampA = isset($repositories[$a]['timestamp']) ? $repositories[$a]['timestamp'] : -1;
                $timestampB = isset($repositories[$b]['timestamp']) ? $repositories[$b]['timestamp'] : -1;
                return $timestampA < $timestampB  ? 1 : -1;
            });

            return $app['twig']->render('index.twig', array(
                'repositories' => $repositories,
                'branch' => '',
                'repo' => '',
            ));
        })->bind('homepage');

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

            return new Response($html, 200, array('Content-Type' => 'application/rss+xml'));
        })->assert('repo', $app['util.routing']->getRepositoryRegex())
            ->assert('branch', $app['util.routing']->getBranchRegex())
            ->value('branch', null)
            ->convert('branch', 'escaper.argument:escape')
            ->bind('rss');

        return $route;
    }
}
