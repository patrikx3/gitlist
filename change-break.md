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


## Quick and Affordable Web Development Services

If you want to quickly and affordably develop your next digital project, visit [corifeus.eu](https://corifeus.eu) for expert solutions tailored to your needs.

---

## Powerful Online Networking Tool  

Discover the powerful and free online networking tool at [network.corifeus.com](https://network.corifeus.com).  

**Free**  
Designed for professionals and enthusiasts, this tool provides essential features for network analysis, troubleshooting, and management.  
Additionally, it offers tools for:  
- Monitoring TCP, HTTP, and Ping to ensure optimal network performance and reliability.  
- Status page management to track uptime, performance, and incidents in real time with customizable dashboards.  

All these features are completely free to use.
  
## Support Our Open-Source Project ❤️
If you appreciate our work, consider starring this repository or making a donation to support server maintenance and ongoing development. Your support means the world to us—thank you!

### Server Availability
Our server may occasionally be down, but please be patient. Typically, it will be back online within 15-30 minutes. We appreciate your understanding.

### About My Domains
All my domains, including [patrikx3.com](https://patrikx3.com), [corifeus.hu](https://corifeus.hu) and [corifeus.com](https://corifeus.com), are developed in my spare time. While you may encounter minor errors, the sites are generally stable and fully functional.

### Versioning Policy
**Version Structure:** We follow a Major.Minor.Patch versioning scheme:
- **Major:** Corresponds to the current year.
- **Minor:** Set as 4 for releases from January to June, and 10 for July to December.
- **Patch:** Incremental, updated with each build.

**Important Changes:** Any breaking changes are prominently noted in the readme to keep you informed.

---


[**P3X-GITLIST**](https://corifeus.com/gitlist) Build v2025.4.103

 [![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software)






[//]: #@corifeus-footer:end
