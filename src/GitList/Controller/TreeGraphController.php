<?php

namespace GitList\Controller;

use Framework\Application;
use Framework\ControllerProviderInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class TreeGraphController implements ControllerProviderInterface
{
    private static $pageSize = 100;

    private static function parseGraphLog($repository, $skip = 0, $limit = 100, $dateFormat = null)
    {
        $command = 'log --graph --date-order --all -C -M'
            . ' --skip=' . (int)$skip
            . ' -n ' . (int)$limit
            . ' --date=iso'
            . ' --pretty=format:"B[%d] C[%H] D[%ad] A[%an] E[%ae] H[%h] S[%s]"';
        $rawRows = $repository->getClient()->run($repository, $command);
        $rawRows = explode(PHP_EOL, $rawRows);
        $graphItems = array();

        foreach ($rawRows as $row) {
            if (preg_match("/^(.+?)(\s(B\[(.*?)\])? C\[(.+?)\] D\[(.+?)\] A\[(.+?)\] E\[(.+?)\] H\[(.+?)\] S\[(.+?)\])?$/", $row, $output)) {
                if (!isset($output[4])) {
                    $graphItems[] = array(
                        "relation" => $output[1]
                    );
                    continue;
                }
                $rawDate = $output[6];
                $formattedDate = $rawDate;
                $isoDate = $rawDate;
                try {
                    $dt = new \DateTime($rawDate);
                    $isoDate = $dt->format(\DateTime::ATOM);
                    if ($dateFormat) {
                        $formattedDate = $dt->format($dateFormat);
                    }
                } catch (\Exception $e) {
                    // fall back to raw values
                }
                $graphItems[] = array(
                    "relation" => $output[1],
                    "branch" => $output[4],
                    "rev" => $output[5],
                    "date" => $formattedDate,
                    "date_iso" => $isoDate,
                    "author" => $output[7],
                    "author_email" => $output[8],
                    "short_rev" => $output[9],
                    "subject" => preg_replace('/(^|\s)(#[[:xdigit:]]+)(\s|$)/', '$1<a href="$2">$2</a>$3', $output[10])
                );
            }
        }
        return $graphItems;
    }

    public function connect(Application $app)
    {
        $route = $app['controllers_factory'];

        // AJAX endpoint for loading more treegraph items
        $route->get(
            '{repo}/treegraph-more/{commitishPath}',
            function (Request $request, $repo, $commitishPath) use ($app) {
                $page = (int)$request->get('page', 1);
                $skip = $page * self::$pageSize;

                $repository = $app['git']->getRepositoryFromName($app['git.repos'], $repo);
                $graphItems = self::parseGraphLog($repository, $skip, self::$pageSize, $app['date.format']);

                return new JsonResponse(array(
                    'graphItems' => $graphItems,
                    'hasMore' => count($graphItems) >= self::$pageSize,
                    'page' => $page,
                ));
            }
        )->assert('repo', $app['util.routing']->getRepositoryRegex())
            ->assert('commitishPath', $app['util.routing']->getCommitishPathRegex())
            ->value('commitishPath', null)
            ->convert('commitishPath', 'escaper.argument:escape')
            ->bind('treegraph_more');

        $route->get(
            '{repo}/treegraph/{commitishPath}',
            function ($repo, $commitishPath) use ($app) {

                $repository = $app['git']->getRepositoryFromName($app['git.repos'], $repo);

                if ($commitishPath === null) {
                    $commitishPath = $repository->getHead();
                }

                list($branch, $file) = $app['util.routing']->parseCommitishPathParam($commitishPath, $repo);
                list($branch, $file) = $app['util.repository']->extractRef($repository, $branch, $file);

                return $app['twig']->render(
                    'treegraph.twig',
                    array(
                        'repo' => $repo,
                        'branch' => $branch,
                        'branches' => $repository->getBranches(),
                        'tags' => $repository->getTags(),
                        'browse_type' => 'treegraph',
                        'commitishPath' => $commitishPath,
                        'graphItems' => array(),
                        'hasMore' => true,
                    )
                );
            }
        )->assert('repo', $app['util.routing']->getRepositoryRegex())
            ->assert('commitishPath', $app['util.routing']->getCommitishPathRegex())
            ->value('commitishPath', null)
            ->convert('commitishPath', 'escaper.argument:escape')
            ->bind('treegraph');

        return $route;
    }
}
