[//]: #@corifeus-header

  [![Build Status](https://travis-ci.org/patrikx3/gitlist.svg?branch=master)](https://travis-ci.org/patrikx3/gitlist)  [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/patrikx3/gitlist/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/patrikx3/gitlist/?branch=master)  [![Code Coverage](https://scrutinizer-ci.com/g/patrikx3/gitlist/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/patrikx3/gitlist/?branch=master) 


 
# 🤖 P3X Gitlist v2.0.32-606  

This is an open-source project. Star this repository if you like it, or even donate!  Thank you so much! :)

I run my own server with dynamic IP address so it may happen that the server can not be reachable for about max 15 minutes due to the dynamic DNS. The server may also be unreachable when I backup the SSD with Clonzilla (very rarely) or an electrical issue (but this should not happen again). When the server is down, please hang on for 15-30 minutes and the server will be back up.

All my domains (patrikx3.com and corifeus.com) could have errors since I am developing in my free time. However, it is usually stable.


### Node Version Requirement 
``` 
>=8.9.0 
```  
   
### Built on Node 
``` 
v10.1.0
```   
   
The ```async``` and ```await``` keywords are required.

Install NodeJs:    
https://nodejs.org/en/download/package-manager/    



# Description  

                        
[//]: #@corifeus-header:end

This is Klaus Silveira's fork, with multiple themes (dark/light), sub-modules, uglify-es, webpack, toast, pure Bootstrap 3 and upgraded to PHP7.1 with all components.

### PHP > 7.1 only
 
[README](artifacts/php-7.2-ubuntu.md)
 
# Release version/update info

## Package
Done, just put on your server, nothing to build:   
https://github.com/patrikx3/gitlist/releases

### Web server
You might need to tune your web server, to only parse the `public/index.php` PHP script, so you can view your `php` files in `P3X GitList`. 

## There is a changing break

### First 
Before, everything was in the `root` of the web server.  

Which is not secure.  

For now, you can create a folder eg. `/var/www/gitlist.me.com/` and make sure, that you server does not point to `/var/www/gitlist.me.com/`, but instead, point to `/var/www/gitlist.me.com/public`.

### Second
The `config.ini` file with `url_subdir` or later `clone_subdir` variable has been changed to the `git_clone_subdir` variable.

### Third
I 😀 removed `Babel`, we are in 2018. If you want older version (like iPhone 5), you can probably install latest `Chrome` and it will work. 
Besides without `Babel` the `JavaScript` is much faster. (At work, without `Babel`, bigger `JS` file and loads `20x` faster.)

#### The last version with Babel
https://github.com/patrikx3/gitlist/releases/tag/2.0.4-579

The following versions are not using `Babel`!!!! Yikes!

### Unreleased / in progress
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
# just work on it
# now the js and css is built on the fly
# in the ./public folder
npm run watch

# if you have bash and want to create a full release
# and strip all unneeded files,
# optimize the packagist vendor folder
# you might need zip from linux
# the files will be in the ./build/release folder
# and the zip is in the ./build/release/gitlist-a.b.c.zip file
./scripts/release.sh

```

[Install](INSTALL.md) - here.

[//]: #@corifeus-footer

---

[**P3X-GITLIST**](https://pages.corifeus.com/gitlist) Build v2.0.32-606 

[![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software) [![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) 


## P3X Sponsors

[IntelliJ - The most intelligent Java IDE](https://www.jetbrains.com)
  
[![JetBrains](https://cdn.corifeus.com/assets/svg/jetbrains-logo.svg)](https://www.jetbrains.com/) [![NoSQLBooster](https://cdn.corifeus.com/assets/png/nosqlbooster-70x70.png)](https://www.nosqlbooster.com/)

[The Smartest IDE for MongoDB](https://www.nosqlbooster.com)
  
  
 

[//]: #@corifeus-footer:end