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

🙏 This is an open-source project. Star this repository, if you like it, or even donate to maintain the servers and the development. Thank you so much!

Possible, this server, rarely, is down, please, hang on for 15-30 minutes and the server will be back up.

All my domains ([patrikx3.com](https://patrikx3.com) and [corifeus.com](https://corifeus.com)) could have minor errors, since I am developing in my free time. However, it is usually stable.

**Note about versioning:** Versions are cut in Major.Minor.Patch schema. Major is always the current year. Minor is either 4 (January - June) or 10 (July - December). Patch is incremental by every build. If there is a breaking change, it should be noted in the readme.


---

[**P3X-GITLIST**](https://corifeus.com/gitlist) Build v2023.10.123

[![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software)






[//]: #@corifeus-footer:end
