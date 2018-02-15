[//]: #@corifeus-header

## P3X Gitlist

---
                        
[//]: #@corifeus-header:end
# GitList Installation
* Download GitList from [https://github.com/patrikx3/gitlist/releases](https://github.com/patrikx3/gitlist/releases/) and decompress to your `/var/www/gitlist` folder, or anywhere else you want to place GitList.
* Rename the `config.example.ini-example` file to `config.ini`.
* Open up the `config.ini` and configure your installation. You'll have to provide where your repositories are located and the base GitList URL (in our case, http://localhost/gitlist).
* Create the cache folder and give read/write permissions to your web server user:

```
cd /var/www/gitlist
mkdir -p cache
chmod 777 cache
```

That's it, installation complete!

## Webserver configuration
Apache is the "default" webserver for GitList. You will find the configuration inside the `.htaccess` file. However, nginx and lighttpd are also supported.

### nginx server.conf

```
server {
    server_name MYSERVER;
    access_log /var/log/nginx/MYSERVER.access.log combined;
    error_log /var/log/nginx/MYSERVER.error.log error;

    root /var/www/DIR;
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

        # if you're using php5-fpm via tcp
        fastcgi_pass 127.0.0.1:9000;

        # if you're using php5-fpm via socket
        #fastcgi_pass unix:/var/run/php5-fpm.sock;

        include /etc/nginx/fastcgi_params;
    }

    location / {
        try_files $uri @gitlist;
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

    location @gitlist {
        rewrite ^/.*$ /index.php;
    }
}
```

### lighttpd

```
# GitList is located in /var/www/gitlist
server.document-root        = "/var/www"

url.rewrite-once = (
    "^/gitlist/web/.+" => "$0",
    "^/gitlist/favicon\.ico$" => "$0",
    "^/gitlist(/[^\?]*)(\?.*)?" => "/gitlist/index.php$1$2"
)
```

### hiawatha

```
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

[**GITLIST**](https://pages.corifeus.com/gitlist) Build v1.0.1 

[![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software) [![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=LFRV89WPRMMVE&lc=HU&item_name=Patrik%20Laszlo&item_number=patrikx3&currency_code=HUF&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) 


## Sponsor

[![JetBrains](https://www.patrikx3.com/images/jetbrains-logo.svg)](https://www.jetbrains.com/)
  
 

[//]: #@corifeus-footer:end