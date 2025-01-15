[//]: #@corifeus-header

# 🤖 P3X Gitlist - A decorated enhanced elegant, feature rich and modern private git ui repository viewer

                        
[//]: #@corifeus-header:end
# GitList Installation
* Download GitList from [https://github.com/patrikx3/gitlist/releases](https://github.com/patrikx3/gitlist/releases/) and decompress to your `/var/www/gitlist` folder, or anywhere else you want to place GitList.
* Rename the `config.example.ini-example` file to `config.ini`.
* Open up the `config.ini` and configure your installation. You'll have to provide where your repositories are located and the base GitList URL.
* Create the cache folder and give read/write permissions to your web server user:

```bash
cd /var/www/gitlist
mkdir -p cache
chmod 777 cache
```

That's it, installation complete!

## Webserver configuration

Apache is the "default" webserver for GitList. You will find the configuration inside the `.htaccess` file. However, nginx and lighttpd are also supported.

To make it to be more secure:
All `PHP` files will be in the `root` and only `index.php`, `images`, `icons`, `svg`, `css`, `js`bundle files will be in the `public` subdir.

### nginx server.conf

```conf
server {
    server_name MYSERVER;
    access_log /var/log/nginx/MYSERVER.access.log combined;
    error_log /var/log/nginx/MYSERVER.error.log error;

    root /var/www/DIR/public;
    index index.php;

#   auth_basic "Restricted";
#   auth_basic_user_file .htpasswd;

    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }

    location ~* ^/index.php.*$ {
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;

        # if you're using php7.2-fpm via socket
        fastcgi_pass unix:/var/run/php7.2-fpm.sock;

        include snippets/fastcgi-php.conf;;
    }

    location ~ \.php$ {
    	include      snippets/fastcgi-php.conf;
    	fastcgi_pass $php_listener;
    }
    
    location ~ /\.ht {
     deny all;
    }	

    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
    add_header Vary "Accept-Encoding";
        expires max;
        try_files $uri @gitlist;
        tcp_nodelay off;
        tcp_nopush on;
    }

#   location ~* \.(git|svn|patch|htaccess|log|route|plist|inc|json|pl|po|sh|ini|sample|kdev4)$ {
#       deny all;
#   }

 
}
```



### lighthttpd

I do not use `lighthttpd`, but you know what I mean. Make sure only, the `gitlist/public` folder should be enabled.

```txt
# GitList is located in /var/www/gitlist/
server.document-root        = "/var/www"

url.rewrite-once = (
    "^/gitlist/web/.+" => "$0",
    "^/gitlist/favicon\.ico$" => "$0",
    "^/gitlist(/[^\?]*)(\?.*)?" => "/gitlist/index.php$1$2"
)
```

### hiawatha

I do not use `hiawatha`, but you know what I mean. Make sure only, the `gitlist/public` folder should be enabled.


```txt
UrlToolkit {
    ToolkitID = gitlist
    RequestURI isfile Return
    # If you have example.com/gitlist/ ; Otherwise remove "/gitlist" below
    Match ^/gitlist/.* Rewrite /gitlist/index.php
    Match ^/gitlist/.*\.ini DenyAccess
}
```

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

### 🖥️ Server Availability  
Our server may occasionally be down, but please be patient. Typically, it will be back online within 15-30 minutes. We appreciate your understanding.  

---

### 🌍 About My Domains  
All my domains, including [patrikx3.com](https://patrikx3.com), [corifeus.hu](https://corifeus.hu), and [corifeus.com](https://corifeus.com), are developed in my spare time. While you may encounter minor errors, the sites are generally stable and fully functional.  

---

### 📈 Versioning Policy  
**Version Structure:** We follow a **Major.Minor.Patch** versioning scheme:  
- **Major:** 📅 Corresponds to the current year.  
- **Minor:** 🌓 Set as 4 for releases from January to June, and 10 for July to December.  
- **Patch:** 🔧 Incremental, updated with each build.  

**🚨 Important Changes:** Any breaking changes are prominently noted in the readme to keep you informed.

---


[**P3X-GITLIST**](https://corifeus.com/gitlist) Build v2025.4.106

 [![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software)






[//]: #@corifeus-footer:end

