#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
set -e
sudo rm -rf ./cache
mkdir -p ./cache
touch ./cache/.gitkeep
chmod 0770 ./cache

sudo rm -rf ./git-test/
mkdir -p ./git-test/

pushd ./git-test

for repo in "https://github.com/patrikx3/gitlist" "https://github.com/patrikx3/gitter" "https://github.com/patrikx3/corifeus" "https://github.com/patrikx3/corifeus-builder" "https://github.com/patrikx3/gitlist-workspace" "https://github.com/patrikx3/onenote" "https://github.com/patrikx3/resume-web"
do
    git clone --bare $repo
done

find . -name '*description*' |
while read filename
do
    echo "$(dirname ${filename:2}) is a test repository." > $filename
done

popd

sudo chmod 0777 ./git-test
cp ./artifacts/config.ini ./

composer install

chown $USER:$USER ./cache
chown $USER:$USER ./git-test
chown $USER:$USER ./config.ini


