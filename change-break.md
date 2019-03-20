[//]: #@corifeus-header

# 🤖 P3X Gitlist - A decorated enhanced elegant, feature rich and modern private git ui repository viewer

                        
[//]: #@corifeus-header:end
# Change breaking

### First 
Before, everything was in the `root` of the web server.  

Which is not secure.  

For now, you can create a folder eg. `/var/www/gitlist.me.com/` and make sure, that you server does not point to `/var/www/gitlist.me.com/`, but instead, point to `/var/www/gitlist.me.com/public`.

### Second
The `config.ini` file with `url_subdir` or later `clone_subdir` variable has been changed to the `ssh_clone_subdir` variable.

### Third 😀
I removed `Babel`, we started to upgrade in 2018 on this repo. If you want use an older `Browser` (like iPhone 5), you can probably install latest `Chrome` and it will work.
   
Besides, without `Babel` the `JavaScript` is much faster. (At work, without `Babel`, smaller `JS` bundle files and works about `20x` faster.)


### Fourth
I have disabled loading everything in `twig`, besides the `diffs` are loading via `AJAX` and `web workers`, I made it to work huge commits with `64MB` `PHP`.  
See in action:  
https://gitlist.patrikx3.com/gitlist.git/commit/f1e4d5b938c8f1a6cd178aeea2e9e86111ea5323#93  

### Fifth
If you upload a bigger binary file, it is important, that your web server allows to upload bigger files, because I found an error with `NGINX` as: 
```text
Request Entity Too Large
```

I resolved in the `NGINX` web server configuration file `nginx.conf` as:
  
`client_max_body_size 64M;`
  
Reference:  
http://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size
  
So, this is only for testing. You should limit for some max size, that you want it at maximum, really.

## The last version with Babel
https://github.com/patrikx3/gitlist/releases/tag/2.0.4-579

The following versions are not using `Babel`!!!! Yikes!
[//]: #@corifeus-footer

---

[**P3X-GITLIST**](https://pages.corifeus.com/gitlist) Build v2019.4.2 

[![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software) 


## P3X Sponsors

[IntelliJ - The most intelligent Java IDE](https://www.jetbrains.com/?from=patrikx3)
  
[![JetBrains](https://cdn.corifeus.com/assets/svg/jetbrains-logo.svg)](https://www.jetbrains.com/?from=patrikx3) [![NoSQLBooster](https://cdn.corifeus.com/assets/png/nosqlbooster-70x70.png)](https://www.nosqlbooster.com/)

[The Smartest IDE for MongoDB](https://www.nosqlbooster.com)
  
  
 

[//]: #@corifeus-footer:end