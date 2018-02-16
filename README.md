[//]: #@corifeus-header

  [![Build Status](https://travis-ci.org/patrikx3/gitlist.svg?branch=master)](https://travis-ci.org/patrikx3/gitlist)  [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/patrikx3/gitlist/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/patrikx3/gitlist/?branch=master)  [![Code Coverage](https://scrutinizer-ci.com/g/patrikx3/gitlist/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/patrikx3/gitlist/?branch=master) 

---

 
# P3X Gitlist  v1.0.1    

# Description  


                        
[//]: #@corifeus-header:end

This is Klaus Silveira's fork, with multiple themes, sub-modules and updated to PHP7 only and upgraded all components.

### PHP > 7.1 only
 
# Release version/update info

## Package
Done, just put on your server, nothing to build:   
https://github.com/patrikx3/gitlist/releases

### v1.0.1
* The minimum PHP version is 7.1 and PHPUNIT 7.

## v1.0.0
* Works with ```PHP 7.2```


## v0.5.6
* The Markdown image links were not working. 
* Missed out the ```package.json``` from the previous release.

## v0.5.5
* Fixed PHPUNIT 6

## v0.5.4
* Different submodule links for Gitlist and Github

## v0.5.3
* The markdown links are working right
* Shows submodules

## v0.5.2
* Added all Bootsswatch themes (https://bootswatch.com/)
* Removed default theme, kept only Bootstrap (though like over 10 themes now)
* Removed PHP 5 support, only >= 7
* Upgraded Silex v1 to v2
* Upgraded Twig v1 to v2
* Upgraded Symfony/twig-bridge v2 to v3
* Upgraded  Symfony/filesystem v2 to v3
* Upgraded Phpunit v4 to v6
* Moved from Showdown to Marked (more features)
* For building requires (not required for the server):
  * NodeJs >= 8.9.0
  * Bower
  * Grunt

   
# Old info
https://github.com/klaussilveira/gitlist

# Live demo

http://gitlist.patrikx3.com/

# Installation

## Requirements
For the build on your workstation (themes):
* ```NodeJs``` >= 7.8
* ```Bower``` and ```Grunt``` (npm install -g bower grunt-cli)

In order to run GitList on your server, you'll need:

* ```git```
* ```Apache``` with ```mod_rewrite``` enabled or ```nginx```
* ```PHP``` >= 7.0 

## By hand
If you just want to get the project dependencies, instead of building everything:

```
git clone https://github.com/patrikx3/gitlist.git
curl -s http://getcomposer.org/installer | php
php composer.phar install
bower install
grunt
```

If you have Composer in your path, things get easier. But you know the drill.

[Install](INSTALL.md) - here.


[//]: #@corifeus-footer

---

[**GITLIST**](https://pages.corifeus.com/gitlist) Build v1.0.1 

[![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software) [![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=LFRV89WPRMMVE&lc=HU&item_name=Patrik%20Laszlo&item_number=patrikx3&currency_code=HUF&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) 


## Sponsor

[![JetBrains](https://www.patrikx3.com/images/jetbrains-logo.svg)](https://www.jetbrains.com/)
  
 

[//]: #@corifeus-footer:end