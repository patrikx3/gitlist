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

for %%r in ("https://github.com/patrikx3/gitlist" "https://github.com/patrikx3/gitter" "https://github.com/patrikx3/corifeus" "https://github.com/patrikx3/corifeus-builder" "https://github.com/patrikx3/gitlist-workspace" "https://github.com/patrikx3/onenote" "https://github.com/patrikx3/resume-web") do (

   echo %%r
   git clone --bare %%r
)

popd

composer install
npm install
