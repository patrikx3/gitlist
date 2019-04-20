<?php

/*
 * This file is part of the Gitter library.
 *
 * (c) Klaus Silveira <klaussilveira@php.net>
 * (c) Patrik Laszlo <alabard@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Gitter;

use Gitter\Model\Commit\Commit;
use Gitter\Model\Tree;
use Gitter\Model\Blob;
use Gitter\Model\Commit\Diff;
use Gitter\Statistics\StatisticsInterface;
//use Gitter\PrettyFormat;
use Symfony\Component\Filesystem\Filesystem;
use Eloquent\Pathogen\FileSystem\FileSystemPath;

use Spatie\TemporaryDirectory\TemporaryDirectory;

class Repository
{
    protected $path;
    protected $client;
    protected $commitsHaveBeenParsed = false;

    protected $statistics = array();

    public function __construct($path, Client $client)
    {
        $this->setPath($path);
        $this->setClient($client);
    }

    /**
     * @param  bool $value
     * @return void
     */
    public function setCommitsHaveBeenParsed($value)
    {
        $this->commitsHaveBeenParsed = $value;
    }

    /**
     * @return boolean
     */
    public function getCommitsHaveBeenParsed()
    {
        return $this->commitsHaveBeenParsed;
    }

    /**
     * Create a new git repository
     */
    public function create($bare = null)
    {
        mkdir($this->getPath());
        $command = 'init';

        if ($bare) {
            $command .= ' --bare';
        }

        $this->getClient()->run($this, $command);

        return $this;
    }

    /**
     * Get a git configuration variable
     *
     * @param string $key Configuration key
     */
    public function getConfig($key)
    {
        $key = $this->getClient()->run($this, 'config ' . $key);

        return trim($key);
    }

    /**
     * Set a git configuration variable
     *
     * @param string $key   Configuration key
     * @param string $value Configuration value
     */
    public function setConfig($key, $value)
    {
        $this->getClient()->run($this, "config $key \"$value\"");

        return $this;
    }

    /**
     * Add statistic aggregator
     *
     * @param StatisticsInterface|array $statistics
     */
    public function addStatistics ($statistics)
    {
        if (!is_array($statistics)) {
            $statistics = array($statistics);
        }

        foreach ($statistics as $statistic) {
            $reflect = new \ReflectionClass($statistic);
            $this->statistics[strtolower($reflect->getShortName())] = $statistic;
        }
    }

    /**
     * Get statistic aggregators
     *
     * @return array
     */
    public function getStatistics($branch = null)
    {
        // Calculate amount of files, extensions and file size
        $logs = $this->getClient()->run($this, 'ls-tree -r -l ' . $branch);
        $lines = explode("\n", $logs);
        $files = [];
        $data['extensions'] = [];
        $data['size'] = 0;
        $data['files'] = 0;

        foreach ($lines as $key => $line) {
            if (empty($line)) {
                unset($lines[$key]);
                continue;
            }

            $files[] = preg_split("/[\s]+/", $line);
        }

        foreach ($files as $file) {
            if ($file[1] == 'blob') {
                $data['files']++;
            }

            if (is_numeric($file[3])) {
                $data['size'] += $file[3];
            }
        }

        $logs = $this->getClient()->run($this, 'ls-tree -l -r --name-only ' . $branch);
        $files = explode("\n", $logs);
        foreach ($files as $file) {
            if (($pos = strrpos($file, '.')) !== false) {
                $extension = substr($file, $pos);

                if (($pos = strrpos($extension, '/')) === false) {
                    $data['extensions'][] = $extension;
                }
            }
        }

        $data['extensions'] = array_count_values($data['extensions']);
        arsort($data['extensions']);

        return $data;
    }

    /**
     * Add untracked files
     *
     * @param mixed $files Files to be added to the repository
     */
    public function add($files = '.')
    {
        if (is_array($files)) {
            $files = implode(' ', array_map('escapeshellarg', $files));
        } else {
            $files = escapeshellarg($files);
        }

        $this->getClient()->run($this, "add $files");

        return $this;
    }

    /**
     * Add all untracked files
     */
    public function addAll()
    {
        $this->getClient()->run($this, "add -A");

        return $this;
    }

    /**
     * Commit changes to the repository
     *
     * @param string $message Description of the changes made
     */
    public function commit($message)
    {
        $this->getClient()->run($this, "commit -m \"$message\"");

        return $this;
    }

    /**
     * Checkout a branch
     *
     * @param string $branch Branch to be checked out
     */
    public function checkout($branch)
    {
        $this->getClient()->run($this, "checkout $branch");

        return $this;
    }

    /**
     * Pull repository changes
     */
    public function pull()
    {
        $this->getClient()->run($this, "pull");

        return $this;
    }

    /**
     * Update remote references
     *
     * @param string $repository Repository to be pushed
     * @param string $refspec    Refspec for the push
     */
    public function push($repository = null, $refspec = null)
    {
        $command = "push";

        if ($repository) {
            $command .= " $repository";
        }

        if ($refspec) {
            $command .= " $refspec";
        }

        $this->getClient()->run($this, $command);

        return $this;
    }

    /**
     * Get name of repository (top level directory)
     *
     * @return string
     */
    public function getName ()
    {
        $name = rtrim($this->path, '/');

        if (strstr($name, DIRECTORY_SEPARATOR)) {
            $name = substr($name, strrpos($name, DIRECTORY_SEPARATOR) + 1);
        }

        return trim($name);
    }

    /**
     * Show a list of the repository branches
     *
     * @return array List of branches
     */
    public function getBranches()
    {
        static $cache = array();

        if (array_key_exists($this->path, $cache)) {
            return $cache[$this->path];
        }

        $branches = $this->getClient()->run($this, "branch");
        $branches = explode("\n", $branches);
        $branches = array_filter(preg_replace('/[\*\s]/', '', $branches));

        if (empty($branches)) {
            return $cache[$this->path] = $branches;
        }

        // Since we've stripped whitespace, the result "* (detached from "
        // and "* (no branch)" that is displayed in detached HEAD state
        // becomes "(detachedfrom" and "(nobranch)" respectively.
        if ((strpos($branches[0], '(detachedfrom') === 0) || ($branches[0] === '(nobranch)')) {
            $branches = array_slice($branches, 1);
        }

        return $cache[$this->path] = $branches;
    }

    /**
     * Return the current repository branch
     *
     * @return mixed Current repository branch as a string, or NULL if in
     * detached HEAD state.
     */
    public function getCurrentBranch()
    {
        $branches = $this->getClient()->run($this, "branch");
        $branches = explode("\n", $branches);

        foreach ($branches as $branch) {
            if ($branch[0] === '*') {
                if ((strpos($branch, '* (detached from ') === 0) || ($branch === '* (no branch)')) {
                    return NULL;
                }

                return substr($branch, 2);
            }
        }
    }

    /**
     * Check if a specified branch exists
     *
     * @param  string  $branch Branch to be checked
     * @return boolean True if the branch exists
     */
    public function hasBranch($branch)
    {
        $branches = $this->getBranches();
        $status = in_array($branch, $branches);

        return $status;
    }

    /**
     * Create a new repository branch
     *
     * @param string $branch Branch name
     */
    public function createBranch($branch)
    {
        $this->getClient()->run($this, "branch $branch");
    }

    /**
     * Create a new repository tag
     *
     * @param string $tag Tag name
     */
    public function createTag($tag, $message = null)
    {
        $command = "tag";

        if ($message) {
            $command .= " -a -m '$message'";
        }

        $command .= " $tag";

        $this->getClient()->run($this, $command);
    }

    /**
     * Show a list of the repository tags
     *
     * @return array List of tags
     */
    public function getTags()
    {
        static $cache = array();

        if (array_key_exists($this->path, $cache)) {
            return $cache[$this->path];
        }

        $tags = $this->getClient()->run($this, "tag");
        $tags = explode("\n", $tags);
        array_pop($tags);

        if (empty($tags[0])) {
            return $cache[$this->path] = NULL;
        }

        return $cache[$this->path] = $tags;
    }

    /**
     * Show the amount of commits on the repository
     *
     * @return integer Total number of commits
     */
    public function getTotalCommits($file = null)
    {
        if (defined('PHP_WINDOWS_VERSION_BUILD')) {
            $command = "rev-list --count --all $file";
        } else {
            $command = "rev-list --all $file | wc -l";
        }

        $commits = $this->getClient()->run($this, $command);

        return trim($commits);
    }

    /**
     * Show the repository commit log
     *
     * @return array Commit log
     */
    public function getCommits($file = null)
    {
        $command = "log --pretty=format:\"<item><hash>%H</hash><short_hash>%h</short_hash><tree>%T</tree><parents>%P</parents><author>%an</author><author_email>%ae</author_email><date>%at</date><commiter>%cn</commiter><commiter_email>%ce</commiter_email><commiter_date>%ct</commiter_date><message><![CDATA[%s]]></message></item>\"";

        if ($file) {
            $command .= " $file";
        }

        $logs = $this->getPrettyFormat($command);

        foreach ($logs as $log) {
            $commit = new Commit;
            $commit->importData($log);
            $commits[] = $commit;

            foreach ($this->statistics as $statistic) {
                $statistic->addCommit($commit);
            }
        }

        $this->setCommitsHaveBeenParsed(true);

        return $commits;
    }

    /**
     * Show the data from a specific commit.
     *
     * @param  string $commitHash Hash of the specific commit to read data
     *
     * @return array  Commit data
     */
    public function getCommit($commitHash, $options = null)
    {
        $logs = $this->getClient()->run(
            $this,
            'show --pretty=format:"<item><hash>%H</hash>'
            . '<short_hash>%h</short_hash><tree>%T</tree><parents>%P</parents>'
            . '<author>%aN</author><author_email>%aE</author_email>'
            . '<date>%at</date><commiter>%cN</commiter><commiter_email>%cE</commiter_email>'
            . '<commiter_date>%ct</commiter_date>'
            . '<message><![CDATA[%s]]></message>'
            . '<body><![CDATA[%b]]></body>'
            . "</item>\" $commitHash"
        );

        $xmlEnd = strpos($logs, '</item>') + 7;
        $commitInfo = substr($logs, 0, $xmlEnd);
        $commitData = substr($logs, $xmlEnd);
        $logs = explode("\n", $commitData);

        // Read commit metadata
        $format = new PrettyFormat();
        $data = $format->parse($commitInfo);
        $commit = new Commit();
        $commit->importData($data[0]);

        if ($commit->getParentsHash()) {
            $command = 'diff ' . $commitHash . '~1..' . $commitHash;
            $logs = explode("\n", $this->getClient()->run($this, $command));
        }

        $commit->setDiffs($this->readDiffLogs($logs, $options));

        return $commit;
    }

    /**
     * Read diff logs and generate a collection of diffs.
     *
     * @param  array $logs Array of log rows
     *
     * @return array Array of diffs
     */
    public function readDiffLogs(array $logs, $options = null)
    {
        if ($options === null) {
            $options = [];
            $options['showLines'] = true;
        }
        if (!isset($options['filename'])) {
            $options['filename'] = '';
        }

        $diffs = [];

        $lineNumOld = 0;
        $lineNumNew = 0;
        foreach ($logs as $log) {
            // Skip empty lines
            if ($log == '') {
                continue;
            }
            if ('diff' === substr($log, 0, 4)) {
                if (isset($diff)) {
                    if ($options['filename'] === '') {
                        $diffs[] = $diff;
                    } elseif ($options['filename'] === $diff->getFile()) {
                        $diffs[] = $diff;
                    }
                }

                $diff = new Diff();
                if (preg_match('/^diff --[\S]+ a\/?(.+) b\/?/', $log, $name)) {
                    $diff->setFile($name[1]);
                }
                continue;
            }

            if ('index' === substr($log, 0, 5)) {
                $diff->setIndex($log);
                continue;
            }

            if ('---' === substr($log, 0, 3)) {
                $diff->setOld($log);
                continue;
            }

            if ('+++' === substr($log, 0, 3)) {
                $diff->setNew($log);
                continue;
            }

            // Handle binary files properly.
            if ('Binary' === substr($log, 0, 6)) {
                $m = [];
                if (preg_match('/Binary files (.+) and (.+) differ/', $log, $m)) {
                    $diff->setBinary(true);
                    $diff->setOld('--- ' . $m[1]);
                    $diff->setNew("+++ {$m[2]}");
                }
            }

            if (!empty($log)) {
                switch ($log[0]) {
                    case '@':
                        // Set the line numbers
                        preg_match('/@@ -([0-9]+)(?:,[0-9]+)? \+([0-9]+)/', $log, $matches);
                        $lineNumOld = $matches[1] - 1;
                        $lineNumNew = $matches[2] - 1;
                        break;
                    case '-':
                        $lineNumOld++;
                        break;
                    case '+':
                        $lineNumNew++;
                        break;
                    default:
                        $lineNumOld++;
                        $lineNumNew++;
                }
            } else {
                $lineNumOld++;
                $lineNumNew++;
            }

            if (isset($diff)) {
                if ($options['showLines']) {
                    $diff->addLine($log, $lineNumOld, $lineNumNew);
                }
                $diff->lineCount++;
            }
        }

        if (isset($diff)) {
            if ($options['filename'] === '' || count($diffs) === 0)
            $diffs[] = $diff;
        }

        return $diffs;
    }

    /**
     * Get the current HEAD.
     *
     * @param $default Optional branch to default to if in detached HEAD state.
     * If not passed, just grabs the first branch listed.
     * @return string the name of the HEAD branch, or a backup option if
     * in detached HEAD state.
     */
    public function getHead($default = null)
    {
        if ($default === null) {
            $client = $this->getClient();
            $default = $client->getDefaultBranch();
        }

        $file = '';
        if (file_exists($this->getPath() . '/.git/HEAD')) {
            $file = file_get_contents($this->getPath() . '/.git/HEAD');
        } elseif (file_exists($this->getPath() . '/HEAD')) {
            $file = file_get_contents($this->getPath() . '/HEAD');
        }

        // Find first existing branch
        foreach (explode("\n", $file) as $line) {
            $m = array();
            if (preg_match('#ref:\srefs/heads/(.+)#', $line, $m)) {
                if ($this->hasBranch($m[1])) {
                  return $m[1];
                }
            }
        }

        // If we were given a default branch and it exists, return that.
        if ($default !== null && $this->hasBranch($default)) {
            return $default;
        }

        // Otherwise, return the first existing branch.
        $branches = $this->getBranches();
        if (!empty($branches)) {
            return current($branches);
        }

        // No branches exist - null is the best we can do in this case.
        return null;
    }

    /**
     * Extract the tree hash for a given branch or tree reference
     *
     * @param  string $branch
     * @return string
     */
    public function getBranchTree($branch)
    {
        $hash = $this->getClient()->run($this, "log --pretty=\"%T\" --max-count=1 $branch");
        $hash = trim($hash, "\r\n ");

        return $hash ? : false;
    }

    /**
     * Get the Tree for the provided folder
     *
     * @param  string $tree Folder that will be parsed
     * @return Tree   Instance of Tree for the provided folder
     */
    public function getTree($tree)
    {
        $tree = new Tree($tree, $this);
        $tree->parse();

        return $tree;
    }

    /**
     * Get the Blob for the provided file
     *
     * @param  string $blob File that will be parsed
     * @return Blob   Instance of Blob for the provided file
     */
    public function getBlob($blob)
    {
        return new Blob($blob, $this);
    }

    /**
     * Blames the provided file and parses the output.
     *
     * @param  string $file File that will be blamed
     *
     * @return array  Commits hashes containing the lines
     */
    public function getBlame($file)
    {
        $blame = [];
        $logs = $this->getClient()->run($this, "blame --root -sl $file");
        $logs = explode("\n", $logs);

        $i = 0;
        $previousCommit = '';
        foreach ($logs as $log) {
            if ($log == '') {
                continue;
            }

            preg_match_all("/([a-zA-Z0-9]{40})\s+.*?([0-9]+)\)(.+)/", $log, $match);

            $currentCommit = $match[1][0];
            if ($currentCommit != $previousCommit) {
                ++$i;
                $blame[$i] = [
                    'line' => '',
                    'commit' => $currentCommit,
                    'commitShort' => substr($currentCommit, 0, 8),
                ];
            }

            $blame[$i]['line'] .= $match[3][0] . PHP_EOL;
            $previousCommit = $currentCommit;
        }

        return $blame;
    }

    /**
     * Get the current Repository path
     *
     * @return string Path where the repository is located
     */
    public function getPath()
    {
        return $this->path;
    }

    /**
     * Set the current Repository path
     *
     * @param string $path Path where the repository is located
     */
    public function setPath($path)
    {
        $this->path = $path;
    }

    /**
     * Get the current Client instance
     *
     * @return Client Client instance
     */
    public function getClient()
    {
        return $this->client;
    }

    /**
     * Set the Client
     *
     * @param Client $path Client instance
     */
    public function setClient(Client $client)
    {
        $this->client = $client;

        return $this;
    }

    /**
     * Get and parse the output of a git command with a XML-based pretty format
     *
     * @param  string $command Command to be run by git
     * @return array  Parsed command output
     */
    public function getPrettyFormat($command)
    {
        $output = $this->getClient()->run($this, $command);
        $format = new PrettyFormat;

        return $format->parse($output);
    }

    public function getShortHash($commit) {
        $shortHash = $this->getClient()->run($this, 'rev-parse  --short ' . $commit);
        $shortHash = trim($shortHash, "\r\n ");
        return $shortHash;
    }

    /**
     * Return true if the repo contains this commit.
     *
     * @param $commitHash Hash of commit whose existence we want to check
     *
     * @return bool Whether or not the commit exists in this repo
     */
    public function hasCommit($commitHash)
    {
        $logs = $this->getClient()->run($this, "show $commitHash");
        $logs = explode("\n", $logs);

        return strpos($logs[0], 'commit') === 0;
    }


    /**
     * Show Patches that where apllied to the selected file.
     *
     * @param  string $file File path for which we will retrieve a list of patch logs
     *
     * @return array  Collection of Commits data
     */
    public function getCommitsLogPatch($file)
    {
        $record_delimiter = chr(hexdec('0x1e'));
        $file_patches = $this->getClient()->run(
            $this,
            'log -p --pretty=format:"' . $record_delimiter . '<item><hash>%H</hash>'
            . '<short_hash>%h</short_hash><tree>%T</tree><parents>%P</parents>'
            . '<author>%aN</author><author_email>%aE</author_email>'
            . '<date>%at</date><commiter>%cN</commiter><commiter_email>%cE</commiter_email>'
            . '<commiter_date>%ct</commiter_date>'
            . '<message><![CDATA[%s]]></message>'
            . '<body><![CDATA[%b]]></body>'
            . "</item>\" -- $file"
        );

        $patch_collection = [];
        foreach (preg_split('/(' . $record_delimiter . '\<item\>)/', $file_patches, null, PREG_SPLIT_NO_EMPTY) as $patches) {
            $patches = '<item>' . $patches;
            $xmlEnd = strpos($patches, '</item>') + 7;
            $commitInfo = substr($patches, 0, $xmlEnd);
            $commitData = substr($patches, $xmlEnd);
            $logs = explode("\n", $commitData);

            // Read commit metadata
            $format = new PrettyFormat();
            $data = $format->parse($commitInfo);
            $commit = new Commit();
            $commit->importData($data[0]);
            $commit->setDiffs($this->readDiffLogs($logs));
            $patch_collection[] = $commit;
        }

        return $patch_collection;
    }

    /**
     * Show the repository commit log with pagination.
     *
     * @param string $file
     * @param int page
     *
     * @return array Commit log
     */
    public function getPaginatedCommits($file = null, $page = 0)
    {
        $page = 15 * $page;
        $pager = "--skip=$page --max-count=15";
        $command =
            "log $pager --pretty=format:\"<item><hash>%H</hash>"
            . '<short_hash>%h</short_hash><tree>%T</tree><parents>%P</parents>'
            . '<author>%aN</author><author_email>%aE</author_email>'
            . '<date>%at</date><commiter>%cN</commiter>'
            . '<commiter_email>%cE</commiter_email>'
            . '<commiter_date>%ct</commiter_date>'
            . '<message><![CDATA[%s]]></message></item>"';

        if ($file) {
            $command .= " $file";
        }

        try {
            $logs = $this->getPrettyFormat($command);
        } catch (\RuntimeException $e) {
            return [];
        }

        foreach ($logs as $log) {
            $commit = new Commit();
            $commit->importData($log);
            $commits[] = $commit;
        }

        return $commits;
    }

    public function searchCommitLog($query, $branch)
    {
        $query = escapeshellarg($query);
        $query = strtr($query, ['[' => '\\[', ']' => '\\]']);
        $command =
            "log --grep={$query} -i --pretty=format:\"<item><hash>%H</hash>"
            . '<short_hash>%h</short_hash><tree>%T</tree><parents>%P</parents>'
            . '<author>%aN</author><author_email>%aE</author_email>'
            . '<date>%at</date><commiter>%cN</commiter>'
            . '<commiter_email>%cE</commiter_email>'
            . '<commiter_date>%ct</commiter_date>'
            . '<message><![CDATA[%s]]></message></item>"'
            . " $branch";

        try {
            $logs = $this->getPrettyFormat($command);
        } catch (\RuntimeException $e) {
            return [];
        }

        foreach ($logs as $log) {
            $commit = new Commit();
            $commit->importData($log);
            $commits[] = $commit;
        }

        return $commits;
    }

    public function searchTree($query, $branch)
    {
        if (empty($query)) {
            return null;
        }

        $query = preg_replace('/(--?[A-Za-z0-9\-]+)/', '', $query);
        $query = escapeshellarg($query);

        try {
            $results = $this->getClient()->run($this, "grep -i --line-number -- {$query} $branch");
        } catch (\RuntimeException $e) {
            return false;
        }

        $results = explode("\n", $results);
        $searchResults = [];

        foreach ($results as $result) {
            if ($result == '') {
                continue;
            }

            preg_match_all('/([\w\-._]+):([^:]+):([0-9]+):(.+)/', $result, $matches, PREG_SET_ORDER);

            if (isset($matches[0])) {
                $data['branch'] = $matches[0][1];
                $data['file'] = $matches[0][2];
                $data['line'] = $matches[0][3];
                $data['match'] = $matches[0][4];
                $searchResults[] = $data;
            }
        }

        return $searchResults;
    }

    public function getAuthorStatistics($branch)
    {
        $logs = $this->getClient()->run($this, 'log --pretty=format:"%aN||%aE" ' . $branch);

        if (empty($logs)) {
            throw new \RuntimeException('No statistics available');
        }

        $logs = explode("\n", $logs);
        $logs = array_count_values($logs);
        arsort($logs);

        foreach ($logs as $user => $count) {
            $user = explode('||', $user);
            $data[] = ['name' => $user[0], 'email' => $user[1], 'commits' => $count];
        }

        return $data;
    }



    /**
     * Create a TAR or ZIP archive of a git tree.
     *
     * @param string $tree   Tree-ish reference
     * @param string $output Output File name
     * @param string $format Archive format
     */
    public function createArchive($tree, $output, $format = 'zip')
    {
        $fs = new Filesystem();
        $fs->mkdir(dirname($output));
        $this->getClient()->run($this, "archive --format=$format --output='$output' $tree");
    }

    /**
     * Return true if $path exists in $branch; return false otherwise.
     *
     * @param string $commitish commitish reference; branch, tag, SHA1, etc
     * @param string $path      path whose existence we want to verify
     *
     * @return bool
     *
     * GRIPE Arguably belongs in Gitter, as it's generally useful functionality.
     * Also, this really may not be the best way to do this.
     */
    public function pathExists($commitish, $path)
    {
        $output = $this->getClient()->run($this, "ls-tree $commitish '$path'");

        if (strlen($output) > 0) {
            return true;
        }

        return false;
    }


    protected function changeRepo($cachePath, $repo, $branch, $repoFilename, $name, $email, $comment, $callback) {
        $temporaryDirectory = '';
        $tempRepo = '';
        $hadError = false;
        $command  = '';
        $output = '';
        $outputs = [];
        $trace = null;

        try {
            $temporaryDirectory = (new TemporaryDirectory($cachePath))->create();

            $client = $this->getClient();
            $repoPath = realpath($this->getPath());
            $tempRepo = $temporaryDirectory->path();

            $output =  $client->run($this, 'clone '. $repoPath . ' ' . $tempRepo);
            $this->setPath($tempRepo);

            $normalizedRepoFilePath = $this->isValidPath($tempRepo, $repoFilename, $outputs);

            $filename = realpath($tempRepo . DIRECTORY_SEPARATOR . $repoFilename);

            $command = "checkout $branch";
            $output = $client->run($this, $command);
            array_push($outputs, $output);

            $message = $callback($client, $filename, $outputs, $tempRepo, $normalizedRepoFilePath);
            array_push($outputs, $message);

            $command = " -c \"user.name=$name\" -c \"user.email=$email\" commit -am \"$comment\" ";
            $output = $client->run($this, $command);
            array_push($outputs, $output);


            // $command = "commit -am \"$comment\"";
            // $output = $client->run($repository, $command);
            $command = "push";
            $output = $client->run($this, $command);
            array_push($outputs, $output);

            $command = " rev-parse HEAD ";
            $lastCommit = $client->run($this, $command);

            $result =  (object) [
                'status' => 'ok',
                'output' => $message,
                'outputs' => $outputs,
                'last-commit' => $lastCommit,
                'branch' => $branch,
            ];
            return $result;
        } catch(\Throwable $e) {

            $hadError = $e;
        } finally {

            if ($temporaryDirectory !== '') {
                @$temporaryDirectory->delete();
            }

            if ($hadError !== false) {

                $message = $hadError->getMessage();
                if ($message === '') {
                    $exceptionName = get_class($hadError);
                    $message = "Received exception without message with type '{$exceptionName}'. " . $hadError->getMessage();
                    $trace = $hadError->getTrace();
                }

                return ((object) [
                    'status' => $message === '' ? 'ok' : 'error',
                    'error' => $message === '' ? false : true,
                    //'temporaryDirectory' => $tempRepo,
                    'message' => $message,
                    //'currentdir' => getcwd(),
                    //'command' => $command,
                    'output' => $output,
                    'outputs' => $outputs,
                    'trace' => $trace,
                    //'$filename' => $filename,
                    //'$value' => $value,
                ]);
            }
        }
    }


    protected function isValidPath($tempRepo, $repoFilename, &$outputs) {
        $basePath = FileSystemPath::fromString($tempRepo);
        //array_push($outputs, "$basePath {$basePath}");
        $repoFilenameItem = FileSystemPath::fromString($repoFilename);
        //array_push($outputs, "$repoFilenameItem {$repoFilenameItem}");

        $normalizing = $basePath->resolve($repoFilenameItem);
        //array_push($outputs, "$normalizing {$normalizing}");
//        array_unshift($outputs, '$normalizing: ' . $normalizing);

        $normalized = FileSystemPath::fromString($normalizing)->normalize();
        //array_push($outputs, "$normalized {$normalized}");
//        array_unshift($outputs, '$normalized: ' . $normalized);

//        array_unshift($outputs, '$normalizing type: ' . gettype($normalizing));
///        array_unshift($outputs, '$normalized type: ' .  gettype($normalized));

        $normalizedRepoFilePath = $normalized->__toString();
        $validPath = strpos($normalizing->__toString(), $normalizedRepoFilePath ) !== false;
        //array_push($outputs, "$normalizing {$normalizing->__toString()}");
        //array_push($outputs, "$normalizedRepoFilePath {$normalizedRepoFilePath}");
        //array_push($outputs, (substr($normalizedRepoFilePath, 0, strlen($basePath)) . " $basePath"));
        if ($validPath === false || substr($normalizedRepoFilePath, 0, strlen($basePath)) != $basePath) {
            throw new \Exception("This '{$repoFilename}' path is invalid.");
        }
        return $normalizedRepoFilePath;
    }

    public function newFileBinary($cachePath, $repo, $branch, $repoFilename, $name, $email, $comment, $override, $phpUploadFile) {

        /*
        return (object)[
            'filename' => $repoFilename,
            'email' => $email,
            'name' => $name,
            'comment' => $comment,
            'upload-file' => $phpUploadFile,
            'override' => $override,
        ];
        */

        return $this->changeRepo($cachePath, $repo, $branch, $repoFilename, $name, $email, $comment, function ($client, $filename, &$outputs, $tempRepo, $normalizedRepoFilePath) use ($cachePath, $repo, $branch, $repoFilename, $name, $email, $comment, $override, $phpUploadFile) {
//            array_unshift($outputs, $cachePath);
//            array_unshift($outputs, $repoFilename);

            /*
            array_unshift($outputs, '$tempRepo: ' . $tempRepo);
            array_unshift($outputs, '$repo: ' . $repo);
            array_unshift($outputs, '$branch: ' . $branch);
            array_unshift($outputs, '$repoFilename: ' . $repoFilename);
            array_unshift($outputs, '$name: ' . $name);
            array_unshift($outputs, '$email: ' . $email);
            array_unshift($outputs, '$comment: ' . $comment);
            array_unshift($outputs, '$filename: ' . $filename);
            array_unshift($outputs, '$repoFilename: ' . $repoFilename);

            $basePath = FileSystemPath::fromString($tempRepo);
            $repoFilenameItem = FileSystemPath::fromString($repoFilename);

            $normalizing = $basePath->resolve($repoFilenameItem);
            array_unshift($outputs, '$normalizing: ' . $normalizing);

            $normalized = FileSystemPath::fromString($normalizing)->normalize();
            array_unshift($outputs, '$normalized: ' . $normalized);

            array_unshift($outputs, '$normalizing type: ' . gettype($normalizing));
            array_unshift($outputs, '$normalized type: ' .  gettype($normalized));

            $validPath = strpos($normalizing->__toString(), $normalized->__toString()) !== false;
            array_unshift($outputs, 'includes current path in search: ' . ($validPath ? 'true' : 'false'));

            return $repoFilename;
            */

            $wasItNonExisting = !realpath($normalizedRepoFilePath);

            array_push($outputs, $wasItNonExisting );
            array_push($outputs, $repoFilename);
            array_push($outputs, $normalizedRepoFilePath);
            array_push($outputs, $override);
            if (substr($repoFilename, -1) == '\\' || substr($repoFilename, -1) == '/') {
                return "The file can't end with this file name: {$repoFilename}";
            } else {
                if (!$wasItNonExisting && !$override) {
                    throw new \Exception("This file is already existing: {$repoFilename}");
                }
                if ($wasItNonExisting && $override) {
                    @unlink($normalizedRepoFilePath);
                }
                @mkdir(dirname($normalizedRepoFilePath), 0777, true);
                move_uploaded_file( $phpUploadFile['tmp_name'], $normalizedRepoFilePath);

                if ($wasItNonExisting) {
                    $command = " add . ";
                    $output = $client->run($this, $command);
                    array_push($outputs, $output);
                    return "Created new binary file : {$repoFilename}";
                } else {
                    return "Overridden binary file : {$repoFilename}";
                }
//                echo "path is file ";
            }
        });

        /*


        File mime type check is not implemented.

           $objectResult = $repository->newFileBinary($app->getCachePath(), $repo, $branch, $filename, $name, $email, $comment, $request->get('override') === '1' ? true : false, $_FILES[0]);


{
  "filename": "2017-Electronic-Diversity-Visa Lottery-Kriszti.jpg",
  "email": "alabard@gmail.com",
  "name": "patrikx3",
  "comment": "P3X Gitlist Commit New binary",
  "upload-file": {
    "name": "2017-Electronic-Diversity-Visa Lottery-Kriszti.jpg",
    "type": "image\/jpeg",
    "tmp_name": "\/tmp\/phpzGVxqY",
    "error": 0,
    "size": 125931
  },
  "override": "1"
}


{
  "filename": "krip.krip",
  "email": "alabard@gmail.com",
  "name": "patrikx3",
  "comment": "P3X Gitlist Commit New binary",
  "upload-file": {
    "name": "krip.krip",
    "type": "",
    "tmp_name": "",
    "error": 1,
    "size": 0
  },
  "override": "1"
}

{
  "filename": "corifeus-colors.txt",
  "email": "alabard@gmail.com",
  "name": "patrikx3",
  "comment": "P3X Gitlist Commit New binary",
  "upload-file": {
    "name": "corifeus-colors.txt",
    "type": "text\/plain",
    "tmp_name": "\/tmp\/phpxjBzT8",
    "error": 0,
    "size": 133
  },
  "override": "1"
}

         */
    }

    public function changeFile($cachePath, $repo, $branch, $repoFilename, $value, $name, $email, $comment) {

        return $this->changeRepo($cachePath, $repo, $branch, $repoFilename, $name, $email, $comment, function($client, $filename, $outputs, $tempRepo, $normalizedRepoFilePath) use ($value) {
            //$originalFileContent = file_get_contents($filename);
            file_put_contents($normalizedRepoFilePath, $value);
            return '';
        });
    }

    public function deleteFile($cachePath, $repo, $branch, $repoFilename, $name, $email, $comment) {

        return $this->changeRepo($cachePath, $repo, $branch, $repoFilename, $name, $email, $comment, function($client, $filename, $outputs, $tempRepo, $normalizedRepoFilePath) {
            //$originalFileContent = file_get_contents($filename);
            @unlink($normalizedRepoFilePath);
            return 'Deleted ' . $filename;
        });
    }

    public function newFileOrDirectory($cachePath, $repo, $branch, $repoFilename, $name, $email, $comment)
    {
        return $this->changeRepo($cachePath, $repo, $branch, $repoFilename, $name, $email, $comment, function ($client, $filename, &$outputs, $tempRepo, $normalizedRepoFilePath) use ($repoFilename, $repo, $branch, $name, $email, $comment) {
//            array_unshift($outputs, $cachePath);
//            array_unshift($outputs, $repoFilename);

            /*
            array_unshift($outputs, '$tempRepo: ' . $tempRepo);
            array_unshift($outputs, '$repo: ' . $repo);
            array_unshift($outputs, '$branch: ' . $branch);
            array_unshift($outputs, '$repoFilename: ' . $repoFilename);
            array_unshift($outputs, '$name: ' . $name);
            array_unshift($outputs, '$email: ' . $email);
            array_unshift($outputs, '$comment: ' . $comment);
            array_unshift($outputs, '$filename: ' . $filename);
            array_unshift($outputs, '$repoFilename: ' . $repoFilename);

            $basePath = FileSystemPath::fromString($tempRepo);
            $repoFilenameItem = FileSystemPath::fromString($repoFilename);

            $normalizing = $basePath->resolve($repoFilenameItem);
            array_unshift($outputs, '$normalizing: ' . $normalizing);

            $normalized = FileSystemPath::fromString($normalizing)->normalize();
            array_unshift($outputs, '$normalized: ' . $normalized);

            array_unshift($outputs, '$normalizing type: ' . gettype($normalizing));
            array_unshift($outputs, '$normalized type: ' .  gettype($normalized));

            $validPath = strpos($normalizing->__toString(), $normalized->__toString()) !== false;
            array_unshift($outputs, 'includes current path in search: ' . ($validPath ? 'true' : 'false'));

            return $repoFilename;
            */

            $existing = realpath($normalizedRepoFilePath);
            if ($existing) {
                throw new \Exception("This path is already existing: {$repoFilename}");
            }

            if (substr($repoFilename, -1) == '\\' || substr($repoFilename, -1) == '/') {
          //echo "is path ";
               // if (realpath($normalizedRepoFilePath) === FALSE) {
                    if (@mkdir($normalizedRepoFilePath, 0777, true)) {
                        //        echo "path is not existing ";
                        touch($normalizedRepoFilePath . '/.gitkeep');
                        $command = " add . ";
                        $output = $client->run($this, $command);
                        array_push($outputs, $output);
                        return "Created new directory (including .gitkeep file): {$repoFilename}";
                    }
                    return "Failed to create the new directory: {$repoFilename}";
                //} else {
              //      echo "path is existing ";
                //    throw new \Exception("This path is already existing.");
                //}
            } else {
                @mkdir(dirname($normalizedRepoFilePath), 0777, true);
                touch($normalizedRepoFilePath );
                $command = " add . ";
                $output = $client->run($this, $command);
                array_push($outputs, $output);
                return "Created new file : {$repoFilename}";
//                echo "path is file ";
            }
        });
    }


    public function fetchOrigin() {
        $output = $this->getClient()->run($this, "fetch origin '*:*'");
        return ((object) [
            'status' => 'ok',
            'error' => false,
            'message' => 'OK, fetch origin is done.',
//            'message' => $output
        ]);
    }

}
