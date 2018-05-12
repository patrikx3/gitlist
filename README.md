[//]: #@corifeus-header

  [![Build Status](https://travis-ci.org/patrikx3/gitlist.svg?branch=master)](https://travis-ci.org/patrikx3/gitlist)  [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/patrikx3/gitlist/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/patrikx3/gitlist/?branch=master)  [![Code Coverage](https://scrutinizer-ci.com/g/patrikx3/gitlist/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/patrikx3/gitlist/?branch=master) 


 
# 🤖 P3X Gitlist  v1.1.5    

# Description  


                        
[//]: #@corifeus-header:end

This is Klaus Silveira's fork, with multiple themes, sub-modules and updated to PHP7 only and upgraded all components.

### PHP > 7.1 only
 
[README](artifacts/php-7.2-ubuntu.md)
 
# Release version/update info

## Package
Done, just put on your server, nothing to build:   
https://github.com/patrikx3/gitlist/releases

### v1.2.0 - unreleased / in progress
* In submodules, if the "submodule" and "path" is not the same, it chokes (it should work the submodule name and path are not the same)
  * Works
    * submodule "path/name"
    * path path/name
  * Not working
    * submodule "name"
    * path path/name 


Further [change log](changelog.md) ...

# Old info
https://github.com/klaussilveira/gitlist

# Live demo

http://gitlist.patrikx3.com/

# Installation

## Requirements

By now `composer` is not enough. We are using `webpack`, `babel`, `less`, `grunt` ...

For the build on your workstation (less, babel, Bootstrap themes,  and webpack):

* ```NodeJs``` >= 10
* ```Grunt``` (npm install -g npm grunt-cli)
* `Composer`

In order to run GitList on your server, you'll need:

* ```git```
* ```Apache``` with ```mod_rewrite``` enabled or ```nginx```
* ```PHP``` >= 7.1 

## By hand

If you have Composer in your path, things get easier. But you know the drill.

If want to get the project dependencies, and build everything:

```
git clone https://github.com/patrikx3/gitlist.git
curl -s http://getcomposer.org/installer | php
php composer.phar install

# i use Node v10 and NPM v6
sudo npm install -g npm grunt-cli
npm install

# if you do not want to create a release
npm run webpack-watch
# another terminal
npm run less-watch

# now you can work in it

# if you have bash and want to create a full release
# and strip all unneeded files,
# optimize the packagist vendor folder
# you might need zip from linux
# this is it:
./scripts/release.sh

# the files will be in the ./build/release folder
# and the zip is in the ./build/release/gitlist-a.b.c.zip file
```

[Install](INSTALL.md) - here.

[//]: #@corifeus-footer

---

[**GITLIST**](https://pages.corifeus.com/gitlist) Build v1.1.5 

[![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software) [![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) 


## P3X Sponsors

[IntelliJ - The most intelligent Java IDE](https://www.jetbrains.com)
  
[![JetBrains](https://cdn.corifeus.com/assets/svg/jetbrains-logo.svg)](https://www.jetbrains.com/) [![NoSQLBooster](https://cdn.corifeus.com/assets/png/nosqlbooster-70x70.png)](https://www.nosqlbooster.com/)

[The Smartest IDE for MongoDB](https://www.nosqlbooster.com)
  
  
 

[//]: #@corifeus-footer:end