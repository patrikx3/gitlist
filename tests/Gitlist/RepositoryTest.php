<?php

use Gitter\Client;
use Gitter\Repository;
use PHPUnit\Framework\TestCase;
use Prophecy\Argument;
use Prophecy\PhpUnit\ProphecyTrait;

class RepositoryTest extends TestCase
{
    use ProphecyTrait;

    public function testIsSanitizingSearchWithPager()
    {
        $client = $this->prophesize(Client::class);
        $client->run(Argument::type(Repository::class), "grep -i --line-number -- '=sleep 5;' master")->shouldBeCalled();

        $repository = new Repository('/tmp', $client->reveal());
        $repository->searchTree('--open-files-in-pager=sleep 5;', 'master');
        $repository->searchTree('-O=sleep 5;', 'master');
    }

    public function testIsSanitizingSearchWithAnyOption()
    {
        $client = $this->prophesize(Client::class);
        $client->run(Argument::type(Repository::class), "grep -i --line-number -- 'foobar  =bar;' foo")->shouldBeCalled();

        $repository = new Repository('/tmp', $client->reveal());
        $repository->searchTree('foobar --bar --foo=bar;', 'foo');
    }
}
