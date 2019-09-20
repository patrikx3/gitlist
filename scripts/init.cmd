@echo off
set CACHE=cache
set GIT_TEST=git-test

del /s /q %CACHE%
rmdir /s /q %CACHE%
mkdir %CACHE%

del /s /q %GIT_TEST%
rmdir /s /q %GIT_TEST%
mkdir %GIT_TEST%

copy artifacts\config.windows.ini .\config.ini

pushd %GIT_TEST%

for %%r in ("https://github.com/patrikx3/angular-compile" "https://github.com/patrikx3/onenote" "https://github.com/patrikx3/aes-folder" "https://github.com/patrikx3/ramdisk" "https://github.com/patrikx3/openwrt-insomnia" "https://github.com/patrikx3/gitlist" "https://github.com/patrikx3/gitlist-workspace" "https://github.com/patrikx3/resume-web" "https://github.com/patrikx3/service-manager-tray-for-windows" "https://github.com/patrikx3/docker-debian-testing-mongodb-stable"  "https://github.com/financial-ai/financial-ai-electron) do (

   echo %%r
   git clone --bare %%r
)

popd

composer install
npm install
