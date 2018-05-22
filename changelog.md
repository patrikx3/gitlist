[//]: #@corifeus-header

# 🤖 P3X Gitlist

                        
[//]: #@corifeus-header:end

### v2.6.0
* network and graph works with Bootstrap 3 totally

### v2.5.0
* you can edit files now

### v2.0.12-585
* removed `Babel` 😀

### v2.0.4-579
* Automated build with webpack and grunt

### v1.1.18-573
* for big commits and changing the theme, it calculated the time it was loading the full commit list and it is about the same time when you change the theme, it added an overlay and this text eg. `9 seconds to switch the theme`
* automatic versions generated with grunt

### v1.1.14
* added overlay when loading big commits

### v1.1.12
* allow CodeMirror show toggle height 300px vs all

### v1.1.11
* Make to use the tag/branch button like GitHub

### v1.1.10
* total dark/light mode (CodeMirror, diff, Markdown)

### v1.1.9
* markdown dark mode
* we automatically load the next commit, when we are on the bottom of the page
* minor toast fix

### v1.1.8
The `config.ini` file with `url_subdir` or later `clone_subdir` variable has been changed to the `git_clone_subdir` variable.

### v1.1.7
The following `CodeMirror` syntax highlighting has been added:
```js
require('codemirror/mode/cmake/cmake');
require('codemirror/mode/css/css');
require('codemirror/mode/dockerfile/dockerfile');
require('codemirror/mode/go/go');
require('codemirror/mode/handlebars/handlebars');
require('codemirror/mode/htmlmixed/htmlmixed');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/jsx/jsx');
require('codemirror/mode/perl/perl');
require('codemirror/mode/php/php');
require('codemirror/mode/powershell/powershell');
require('codemirror/mode/python/python');
require('codemirror/mode/ruby/ruby');
require('codemirror/mode/sass/sass');
require('codemirror/mode/shell/shell');
require('codemirror/mode/sql/sql');
require('codemirror/mode/swift/swift');
require('codemirror/mode/twig/twig');
require('codemirror/mode/vue/vue');
require('codemirror/mode/xml/xml');
require('codemirror/mode/xquery/xquery');
require('codemirror/mode/yaml/yaml');
```

### v1.1.6
* All `PHP` files will be in the `root` and only `index.php`, `images`, `icons`, `svg`, `css`, `js`bundle files will be in the `public` subdir.

### v1.1.5
* Removed old `clone` button modal popup, using `Bootstrap` only
* Double checked, all is using pure `Boostrap`
* Added `toast` and save the `url` to the clipboard when you click on the `clone` button
* Added `UglifyJs` and minimize the `css`.

### v1.1.3
* Moved to `webpack`
* Using `Babel`

### v1.1.2
* Added twemoji's

### v1.1.1
* Format size was missing space (ugly)
* Graph time was not using the ```config.ini```
* Fixed images to not show a html block span text and use now real image alt and title attributes in html
* Graph was not using Bootstrap
* Network wast not using Bootstrap

### v1.0.3
* Total bytes was not working with Twig 2

### v1.0.2
* Add support for .gitmodules files at repository root
* Updated to latest dependencies

### v1.0.1
* The minimum PHP version is 7.1 and PHPUNIT 7.

### v1.0.0
* Works with ```PHP 7.2```


### v0.5.6
* The Markdown image links were not working. 
* Missed out the ```package.json``` from the previous release.

### v0.5.5
* Fixed PHPUNIT 6

### v0.5.4
* Different submodule links for Gitlist and Github

### v0.5.3
* The markdown links are working right
* Shows submodules

### v0.5.2
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

   
[//]: #@corifeus-footer

---

[**P3X-GITLIST**](https://pages.corifeus.com/gitlist) Build v2.7.79-796 

[![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software) [![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) 


## P3X Sponsors

[IntelliJ - The most intelligent Java IDE](https://www.jetbrains.com)
  
[![JetBrains](https://cdn.corifeus.com/assets/svg/jetbrains-logo.svg)](https://www.jetbrains.com/) [![NoSQLBooster](https://cdn.corifeus.com/assets/png/nosqlbooster-70x70.png)](https://www.nosqlbooster.com/)

[The Smartest IDE for MongoDB](https://www.nosqlbooster.com)
  
  
 

[//]: #@corifeus-footer:end