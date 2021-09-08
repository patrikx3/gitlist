#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TOP=$DIR/..

set -e

version=$( node -e "console.log(require('$TOP/package.json').version)" )
pkg_name=$( node -e "console.log(require('$TOP/package.json').name)" )
name=$pkg_name-v$version
repo=$TOP/build/$name

pushd $TOP
npm install

if [ "$HOSTNAME" = "workstation" ];
then
    /usr/local/bin/composer install --no-dev
    /usr/local/bin/composer dump-autoload --optimize
else
    composer install --no-dev
    composer dump-autoload --optimize
fi
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

for item in "$TOP/INSTALL.md" "$TOP/changelog.md" "$TOP/LICENSE" "$TOP/README.md" "$TOP/boot.php" "$TOP/config.example.ini" "$TOP/package.json"
do
    echo $item
    cp $item $repo/
done

rm -rf $repo/src/browser

zipname=$TOP/build/$name.zip
rm -rf $zipname
pushd $repo
#sudo apt install -y zip

zip -r $TOP/build/$name.zip .

popd

if [ $# -eq 0 ];
then
    rm -rf $repo
else
    RELEASE=$TOP/build/release
    rm -rf $RELEASE || true
    mv $repo $RELEASE
    cp $TOP/config.ini $RELEASE || true
    cp -R $TOP/git-test $RELEASE/ || true
fi

popd
