[//]: #@corifeus-header

  

[![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software) [![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Build Status](https://api.travis-ci.com/patrikx3/gitlist.svg?branch=master)](https://travis-ci.com/patrikx3/gitlist) 
[![Uptime Robot ratio (30 days)](https://img.shields.io/uptimerobot/ratio/m780749701-41bcade28c1ea8154eda7cca.svg)](https://uptimerobot.patrikx3.com/)

 


 
# 🤖 P3X Gitlist - A decorated enhanced elegant, feature rich and modern private git ui repository viewer  v2019.1.10-5    

  
🙏 This is an open-source project. Star this repository, if you like it, or even donate to maintain the servers and the development. Thank you so much!

I run my own server with dynamic IP address, so, it may happen, that the server can not be reachable for about max 15 minutes, due to nature of the dynamic DNS. The server may also be unreachable, when I backup the SSD with Clonzilla (very rarely) or an electrical issue (but this should not happen again). When the server is down, please hang on for 15-30 minutes and the server will be back up.

All my domains (patrikx3.com and corifeus.com) could have errors, since I am developing in my free time. However, it is usually stable.

**Bugs are evident™ - MATRIX️**  
    
  
# Description  


                        
[//]: #@corifeus-header:end

This is a new decorated enhanced GitList with web workers, editable/deletable files/directories, multiple themes (dark/light), sub-modules, uglify-es, webpack, toast, pure Bootstrap 3 and upgraded since PHP7.1 with all components.  

Because of the web workers, even a small router can use it with 64MB `PHP memory limit`.   


# Live demo

[http://gitlist.patrikx3.com/](http://gitlist.patrikx3.com/)


# Releases
  
[https://github.com/patrikx3/gitlist/releases](https://github.com/patrikx3/gitlist/releases)  

[Ubuntu prior Bionic PHP 7 version installation](artifacts/php-7.2-ubuntu.md)

### NGINX gitlist.patrikx3.com configs 

This is a complete config that uses NGINX, LETSENCRYPT (using https://acme.sh) and the **git-http-backend**.
This parse only the `public/index.php` file, no other PHP files, so that they are editable in `Decorated P3X GitList` as in the live demo.

[gitlist.patrikx3.com.conf](artifacts/gitlist.patrikx3.com.conf)

## FYI
[Change log](changelog.md)  
  
[TODO](todo.md)  
  
[Change breaking code](change-break.md)

# Development

To make it easier to develop Gitter and GitList, we unified the two code into one.  

## Requirements

By now `composer` is not enough. We are using `webpack`, `less`, `grunt` ...

For the build on your workstation (less, Bootstrap themes,  and webpack):

* ```NodeJs``` >= 10
  * https://nodejs.org/en/download/package-manager/
* ```Grunt``` (npm install -g npm grunt-cli)
* `Composer`

In order to run GitList on your server, you'll need:

* ```git```
* ```Apache``` with ```mod_rewrite``` enabled or ```nginx``` - preferred
* ```PHP``` >= 7.1 

## So, by hand

If you have Composer in your path, things get easier. But you know the drill.

If want to get the project dependencies, and build everything:

```
# ubuntu
# https://github.com/nodesource/distributions/blob/master/README.md#debinstall
curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
sudo apt-get install -y nodejs

git clone https://github.com/patrikx3/gitlist.git
curl -s http://getcomposer.org/installer | php
php composer.phar install

# i use Node latest usually and NPM
sudo npm install -g npm grunt-cli
npm install

# create some simple GIT repos
# create a test config.ini
./scripts/init.sh

# if you do not want to create a release
# just work on it
# now the js and css is built on the fly
# in the ./public folder
npm run watch

# you might need the zip program
# to create release
sudo apt install -y zip

# if you have bash and want to create a full release
# and strip all unneeded files,
# optimize the packagist vendor folder
# you might need zip from linux
# and the zip is in the ./build/p3x-gitlist-a.b.c.zip file
./scripts/release.sh
```

# Old info
[Original install information, although some new info is included](INSTALL.md) - here.

https://github.com/klaussilveira/gitlist

### Last merge from `klaussilveira`

#### Gitlist
https://github.com/klaussilveira/gitlist/commits/master  
January 9, 2019

#### Gitter
https://github.com/klaussilveira/gitter/commits/master  
January 9, 2019

# URL links

[https://patrikx3.github.io/gitlist/](https://patrikx3.github.io/gitlist/)  
[https://pages.corifeus.com/gitlist/](https://pages.corifeus.com/gitlist/)  
[https://gitlist.tk/](https://gitlist.tk/)  

[//]: #@corifeus-footer

---

[**P3X-GITLIST**](https://pages.corifeus.com/gitlist) Build v2019.1.10-5 

[![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software) [![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) 


## P3X Sponsors

[IntelliJ - The most intelligent Java IDE](https://www.jetbrains.com/?from=patrikx3)
  
[![JetBrains](https://cdn.corifeus.com/assets/svg/jetbrains-logo.svg)](https://www.jetbrains.com/?from=patrikx3) [![NoSQLBooster](https://cdn.corifeus.com/assets/png/nosqlbooster-70x70.png)](https://www.nosqlbooster.com/)

[The Smartest IDE for MongoDB](https://www.nosqlbooster.com)
  
  
 

[//]: #@corifeus-footer:end


