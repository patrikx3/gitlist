#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TOP=$DIR/..

set -e

version=$( node -e "console.log(require('$TOP/package.json').version)" )
pkg_name=$( node -e "console.log(require('$TOP/package.json').name)" )
name=$pkg_name
repo=$TOP/build/$name

pushd $TOP
npm install
composer install --no-dev
composer dump-autoload --optimize
mkdir -p $TOP/cache
#npm install
npm run build

rm -rf $repo || true
mkdir -p $repo

for item in "$TOP/cache" "$TOP/src" "$TOP/public" "$TOP/vendor"
do
    echo $item
    cp -R $item $repo/
done

for item in "$TOP/INSTALL.md" "$TOP/change-log.md" "$TOP/LICENSE" "$TOP/README.md" "$TOP/boot.php" "$TOP/config.example.ini" "$TOP/package.json"
do
    echo $item
    cp $item $repo/
done

rm -rf $repo/src/browser

cp config.docker.ini $repo/config.ini

pushd $repo

popd

popd
