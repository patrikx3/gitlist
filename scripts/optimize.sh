#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TOP=$DIR/..

pushd $TOP
composer install
composer install --no-dev
composer dump-autoload --optimize
npm install
grunt
npm run webpack
popd