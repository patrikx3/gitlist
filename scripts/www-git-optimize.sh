#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TOP=$DIR/..
set -e
pushd $TOP
git checkout -f .
git pull
chown git:www-data -R $PWD
./scripts/optimize.sh
echo PWD: $PWD
chown git:www-data -R $PWD
popd
