[//]: #@corifeus-header

  [![Donate for PatrikX3 / P3X](https://img.shields.io/badge/Donate-PatrikX3-003087.svg)](https://paypal.me/patrikx3) [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Corifeus @ Facebook](https://img.shields.io/badge/Facebook-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software)  [![Uptime ratio (90 days)](https://network.corifeus.com/public/api/uptime-shield/31ad7a5c194347c33e5445dbaf8.svg)](https://network.corifeus.com/status/31ad7a5c194347c33e5445dbaf8)





# 🛠️ 🤖 P3X Gitlist - A decorated enhanced elegant, feature rich and modern private git ui repository viewer  v2025.4.112


  
🌌 **Bugs are evident™ - MATRIX️**  
🚧 **This project is under active development!**  
📢 **We welcome your feedback and contributions.**  
    

# Description


                        
[//]: #@corifeus-header:end

P3X Enhanced GitList is a fork of the klaussilveira Gitlist. What is different about is, that it requires/uses the latest PHP version, works with sub-modules. With big git repos/commits, it works with 64Mb memory (some Twig templates are removed and moved to the client and web workers - eg. huge diffs).  
 
 You will love it to work it on OpenWrt. Provides multiple themes with dark mode - 11 light and 5 dark. Code editor with syntax highlighting, editable files. All changes in the original fork are synced with the enhanced version. 100% responsive with Bootstrap 3. Latest Fontawesome for icons. The markdown engine uses Emojis with Twitter's Emojis. Besides, the commits and logs are parsed as Markdown and Emojis. 
  
**Works on PHP 8.1**
  
**It works on CodeMirror 5**

## Beware
If you use other, than UTF-8 encoded files, you could get incorrect results, as it does not do converting, it only works with UTF-8.

# Demo

[Screenshots](artifacts/screenshots.md)

# Releases
  
[https://github.com/patrikx3/gitlist/releases](https://github.com/patrikx3/gitlist/releases)  


### NGINX gitlist.patrikx3.com configs 

This is a complete config that uses NGINX, LETSENCRYPT (using https://acme.sh) and the **git-http-backend**.
This parse only the `public/index.php` file, no other PHP files, so that they are editable in `Decorated P3X GitList` as in the live demo.

[gitlist.patrikx3.com.conf](artifacts/gitlist.patrikx3.com.conf)

## FYI
[Change log](change-log.md)  
  
[TODO](todo.md)  
  
[Change breaking code](change-break.md)

# Development

To make it easier to develop Gitter and GitList, we unified the two code into one.  

## Requirements

By now `composer` is not enough. We are using `webpack`, `less`, `grunt` ...

For the build on your workstation (less, Bootstrap themes,  and webpack):

* ```NodeJs``` >= 12
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
curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

git clone https://github.com/patrikx3/gitlist.git
curl -s http://getcomposer.org/installer | php
php composer.phar install

# i use Node latest usually and NPM
sudo npm install -g npm grunt-cli
yarn install

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
Sept 7, 2021

#### Gitter
https://github.com/klaussilveira/gitter/commits/master  
Sept 7, 2021

# URL links

[P3X Gitlist playground](https://www.patrikx3.com/en/front/playground/17/p3x-gitlist#PG17)  

[Corifeus P3X Gitlist](https://corifeus.com/gitlist/)  
  
[AlternativeTo Gitlist](https://alternativeto.net/software/p3x-gitlist/)  

[Github.io Gitlist](https://patrikx3.github.io/gitlist/)  

[Git Wiki Kernel Web Interfaces](https://git.wiki.kernel.org/index.php/Interfaces,_frontends,_and_tools#Web_Interfaces)  


[//]: https://betapage.co/startup/p3x-gitlist


[//]: #@corifeus-footer

---

## 🚀 Quick and Affordable Web Development Services

If you want to quickly and affordably develop your next digital project, visit [corifeus.eu](https://corifeus.eu) for expert solutions tailored to your needs.

---

## 🌐 Powerful Online Networking Tool  

Discover the powerful and free online networking tool at [network.corifeus.com](https://network.corifeus.com).  

**🆓 Free**  
Designed for professionals and enthusiasts, this tool provides essential features for network analysis, troubleshooting, and management.  
Additionally, it offers tools for:  
- 📡 Monitoring TCP, HTTP, and Ping to ensure optimal network performance and reliability.  
- 📊 Status page management to track uptime, performance, and incidents in real time with customizable dashboards.  

All these features are completely free to use.  

---

## ❤️ Support Our Open-Source Project  
If you appreciate our work, consider ⭐ starring this repository or 💰 making a donation to support server maintenance and ongoing development. Your support means the world to us—thank you!  

---

### 🌍 About My Domains  
All my domains, including [patrikx3.com](https://patrikx3.com), [corifeus.eu](https://corifeus.eu), and [corifeus.com](https://corifeus.com), are developed in my spare time. While you may encounter minor errors, the sites are generally stable and fully functional.  

---

### 📈 Versioning Policy  
**Version Structure:** We follow a **Major.Minor.Patch** versioning scheme:  
- **Major:** 📅 Corresponds to the current year.  
- **Minor:** 🌓 Set as 4 for releases from January to June, and 10 for July to December.  
- **Patch:** 🔧 Incremental, updated with each build.  

**🚨 Important Changes:** Any breaking changes are prominently noted in the readme to keep you informed.

---


[**P3X-GITLIST**](https://corifeus.com/gitlist) Build v2025.4.112

 [![Donate for PatrikX3 / P3X](https://img.shields.io/badge/Donate-PatrikX3-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software)





[//]: #@corifeus-footer:end
