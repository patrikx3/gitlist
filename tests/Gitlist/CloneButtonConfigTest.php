<?php

namespace GitList\Tests;

use GitList\Application;
use GitList\Config;
use PHPUnit\Framework\TestCase;

class CloneButtonConfigTest extends TestCase
{
    protected function createMockConfig(array $cloneButtonConfig = [])
    {
        $defaultConfig = [
            'git' => [
                'client' => 'git',
                'default_branch' => 'master',
                'repositories' => [sys_get_temp_dir()],
            ],
            'app' => [
                'debug' => false,
                'cache' => false,
            ],
            'clone_button' => array_merge([
                'show_ssh_remote' => true,
                'ssh_user' => 'git',
                'ssh_user_dynamic' => false,
                'ssh_clone_subdir' => '',
                'ssh_host' => '',
                'show_http_remote' => true,
                'use_https' => true,
                'http_host' => '',
                'http_user' => '',
                'http_user_dynamic' => false,
                'git_http_subdir_calculated' => true,
                'git_http_subdir' => '',
            ], $cloneButtonConfig),
        ];

        return new Config($defaultConfig);
    }

    protected function createApplication(Config $config)
    {
        $_SERVER['SCRIPT_NAME'] = '/index.php';
        return new Application($config, __DIR__ . '/../../');
    }

    public function testDefaultCloneHostnamesAreEmpty()
    {
        $config = $this->createMockConfig();
        $app = $this->createApplication($config);

        $this->assertEquals('', $app['ssh_host']);
        $this->assertEquals('', $app['http_host']);
    }

    public function testCustomCloneHostnamesAreLoaded()
    {
        $config = $this->createMockConfig([
            'ssh_host' => 'git.example.com',
            'http_host' => 'http-git.example.com',
        ]);
        $app = $this->createApplication($config);

        $this->assertEquals('git.example.com', $app['ssh_host']);
        $this->assertEquals('http-git.example.com', $app['http_host']);
    }
}
