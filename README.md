[//]: #@corifeus-header

  

[![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://paypal.me/patrikx3) [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Corifeus @ Facebook](https://img.shields.io/badge/Facebook-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software)  [![Build Status](https://api.travis-ci.com/patrikx3/gitlist.svg?branch=master)](https://travis-ci.com/patrikx3/gitlist) 
[![Uptime Robot ratio (30 days)](https://img.shields.io/uptimerobot/ratio/m780749701-41bcade28c1ea8154eda7cca.svg)](https://uptimerobot.patrikx3.com/)

 


 
# 🤖 P3X Gitlist - A decorated enhanced elegant, feature rich and modern private git ui repository viewer  v2019.3.3-0    

  
🙏 This is an open-source project. Star this repository, if you like it, or even donate to maintain the servers and the development. Thank you so much!

Possible, this mini server, rarely, is down, please hang on for 15-30 minutes and the server will be back up.

All my domains ([patrikx3.com](https://patrikx3.com) and [corifeus.com](https://corifeus.com)) could have minor errors, since I am developing in my free time. However, it is usually stable.

**Bugs are evident™ - MATRIX️**  
    
  
# Description  


                        
[//]: #@corifeus-header:end

P3X Enhanced GitList is a fork of the klaussilveira Gitlist. What is different about is, that it requires/uses the latest PHP version, works with sub-modules. Updates all dependencies with monthly release. With big git repos/commits, it works with 64Mb memory (some Twig templates are removed and moved to the client and web workers - eg. huge diffs).  
 
 You will love it to work it on OpenWrt. Provides multiple themes with dark mode - 11 light and 5 dark. Code editor with syntax highlighting, editable files. All changes in the original fork are synced with the enhanced version. 100% responsive with Bootstrap 3. Latest Fontawesome for icons. The markdown engine uses Emojis with Twitter's Emojis. Besides, the commits and logs are parsed as Markdown and Emojis. 

# Live demo

[http://gitlist.patrikx3.com/](http://gitlist.patrikx3.com/)

[Screenshots](artifacts/screenshots.md)

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

```bash
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

[P3X Gitlist playground](https://patrikx3.com/en/front/playground/19/p3x-gitlist#PG19)  

[Corifeus P3X Gitlist pages](https://pages.corifeus.com/gitlist/)  

[AlternativeTo Gitlist](https://alternativeto.net/software/p3x-gitlist/)  

[Github.io Gitlist](https://patrikx3.github.io/gitlist/)  

[Gitlist.tk](https://gitlist.tk/gitlist.git/blob/master/README.md)  

[Git Wiki Kernel Web Interfaces](https://git.wiki.kernel.org/index.php/Interfaces,_frontends,_and_tools#Web_Interfaces)  


[//]: https://betapage.co/startup/p3x-gitlist


[//]: #@corifeus-footer

---

[**P3X-GITLIST**](https://pages.corifeus.com/gitlist) Build v2019.3.3-0 

[![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software) 


## P3X Sponsors

[IntelliJ - The most intelligent Java IDE](https://www.jetbrains.com/?from=patrikx3)
  
[![JetBrains](https://cdn.corifeus.com/assets/svg/jetbrains-logo.svg)](https://www.jetbrains.com/?from=patrikx3) [![NoSQLBooster](https://cdn.corifeus.com/assets/png/nosqlbooster-70x70.png)](https://www.nosqlbooster.com/)

[The Smartest IDE for MongoDB](https://www.nosqlbooster.com)
  
  
 

[//]: #@corifeus-footer:end


