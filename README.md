[//]: #@corifeus-header

  [![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software) [![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Build Status](https://travis-ci.org/patrikx3/gitlist.svg?branch=master)](https://travis-ci.org/patrikx3/gitlist) 
[![Uptime Robot ratio (30 days)](https://img.shields.io/uptimerobot/ratio/m780749701-41bcade28c1ea8154eda7cca.svg)](https://uptimerobot.patrikx3.com/)

 


 
# 🤖 P3X Gitlist - A decorated enhanced elegant, feature rich and modern private git ui repository viewer  v2018.12.30-3    

  
This is an open-source project. Star this repository, if you like it, or even donate! Thank you so much! :)

I run my own server with dynamic IP address, so, it may happen, that the server can not be reachable for about max 15 minutes, due to nature of the dynamic DNS. The server may also be unreachable, when I backup the SSD with Clonzilla (very rarely) or an electrical issue (but this should not happen again). When the server is down, please hang on for 15-30 minutes and the server will be back up.

All my domains (patrikx3.com and corifeus.com) could have errors, since I am developing in my free time. However, it is usually stable.

**Bugs are evident™ - MATRIX️**  
    
  
# Description  


                        
[//]: #@corifeus-header:end

This is a new enhanced GitList with web workers, multiple themes (dark/light), sub-modules, uglify-es, webpack, toast, pure Bootstrap 3 and upgraded to PHP7.1 with all components.  

Usually, even a small router can use it with 64MB `PHP memory limit`.   


# Live demo

http://gitlist.patrikx3.com/


# Release version/update info

### PHP 7 version installation
 
[README](artifacts/php-7.2-ubuntu.md)

## Package
Done, just put on your server, nothing to build:   
https://github.com/patrikx3/gitlist/releases

### Web server
You might need to tune your web server, to only parse the `public/index.php` PHP script, so you can view your `php` files in `P3X GitList`. 

## There is a changing break
[README](change-break.md)


# TODO and Change log

[Change log](changelog.md) ...

[TODO](todo.md) ...

# Installation

## Requirements

By now `composer` is not enough. We are using `webpack`, `less`, `grunt` ...

For the build on your workstation (less, Bootstrap themes,  and webpack):

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
# and the zip is in the ./build/release/p3x-gitlist-a.b.c.zip file
./scripts/release.sh

```

[Install](INSTALL.md) - here.

# Old info
https://github.com/klaussilveira/gitlist

### Last merge from `klaussilveira`

#### Gitlist
https://github.com/klaussilveira/gitlist/commits/master  
Nov 14, 2018

#### Gitter
https://github.com/klaussilveira/gitter/commits/master  
Jun 1, 2018


[//]: #@corifeus-footer

---

[**P3X-GITLIST**](https://pages.corifeus.com/gitlist) Build v2018.12.30-3 

[![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software) [![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) 


## P3X Sponsors

[IntelliJ - The most intelligent Java IDE](https://www.jetbrains.com)
  
[![JetBrains](https://cdn.corifeus.com/assets/svg/jetbrains-logo.svg)](https://www.jetbrains.com/) [![NoSQLBooster](https://cdn.corifeus.com/assets/png/nosqlbooster-70x70.png)](https://www.nosqlbooster.com/)

[The Smartest IDE for MongoDB](https://www.nosqlbooster.com)
  
  
 

[//]: #@corifeus-footer:end


