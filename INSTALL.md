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

🙏 This is an open-source project. Star this repository, if you like it, or even donate to maintain the servers and the development. Thank you so much!

Possible, this server, rarely, is down, please, hang on for 15-30 minutes and the server will be back up.

All my domains ([patrikx3.com](https://patrikx3.com) and [corifeus.com](https://corifeus.com)) could have minor errors, since I am developing in my free time. However, it is usually stable.

**Note about versioning:** Versions are cut in Major.Minor.Patch schema. Major is always the current year. Minor is either 4 (January - June) or 10 (July - December). Patch is incremental by every build. If there is a breaking change, it should be noted in the readme.


---

[**P3X-GITLIST**](https://corifeus.com/gitlist) Build v2023.10.123

[![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software)






[//]: #@corifeus-footer:end

