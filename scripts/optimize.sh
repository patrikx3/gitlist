#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TOP=$DIR/..
set -e
pushd $TOP
sudo rm -rf ./cache
mkdir -p ./cache
touch ./cache/.gitkeep
chmod 0770 ./cache
composer install
composer install --no-dev
composer dump-autoload --optimize
npm install
npm run build --verbose
rm -rf ./node_modules
popd