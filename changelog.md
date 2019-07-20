[//]: #@corifeus-header

# 🤖 P3X Gitlist - A decorated enhanced elegant, feature rich and modern private git ui repository viewer

                        
[//]: #@corifeus-header:end


## v2019.10.114
* BUGFIX: SVG was showing "Display SVG" instead of "Toggle SVG".
* CHORE: Synched with klaussilveira on July 11, 2019
* FEATURE: The commits in the tree table messages are using Twemoji and Markdown.
* FEATURE: The tree table in sub-folder not only the "..", but the whole cell is going to upper folder using a pointer cursor.

## v2019.10.111
* FEATURE: The tree table looks like GitHub.
* FEATURE: The file/blob size is proper size, instead of rounded kilobytes.

## v2019.10.109
* FEATURE: Show last commited ago on the tree table by tag or branch with ellipsis
* FEATURE: Replaced mode column on the tree table with the last commit message with ellipsis


## v2019.4.128
* FEATURE: Added SASS/SCSS to CodeMirror

## v2019.4.124
* BUGFIX: Since Twemoji `svg` was using an older version.

## v2019.4.121
* BUGFIX: Since Twemoji `12.0.4`, the `svg` folder is missing
  * https://github.com/twitter/twemoji/issues/358 

## v2019.4.119
* FEATURE: Enhanced navigation. 

## v2019.4.116
* BUGFIX: UTF-8 encoding disabled, it should be on a GIT level. 
* FEATURE: Enhanced navigation. 

## v2019.4.113
* BUGFIX: UTF-8 encoding fix. Detect encoding. 

## v2019.4.108
* BUGFIX: Enhanced navigation on the left side bread-crumbs. 

## v2019.4.107
* BUGFIX: Enhanced navigation on the left side bread-crumbs. 

## v2019.4.106
* BUGFIX: Enhanced navigation on the left side bread-crumbs. 

## v2019.4.104
* BUGFIX: Enhanced navigation on the left side bread-crumbs. 

## v2019.4.102
* BUGFIX: Latin ( ISO-8859-1) CSV files tries to convert to UTF-8. 

## v2019.4.22
* FEATURE: if the blob view is a commit (instead of branch), the delete and edit buttons are hidden
* FEATURE: default code editor default is increased from 300px to 600px

## v2019.4.19
* BUGFIX: on the commit file list with a view/edit button, it was not showing the commit view, but instead, using the main branch

### v2019.4.16
* FEATURE: the blame view was totally wrong
* CHROE: upgraded Bootstrap to v3.4.1

### v2019.4.8
* SYNC: Synchronized to original Gitlist and Gitter
  * BUGFIX: Regex fix

### v2019.02.09
* FEATURE: On the modal and form buttons order were not correct, the cancel button should be the last.

## v2019.01.27
* BUGFIX: fix C like (C++, Objective-C, C) CodeMirror editor

## v2019.01.23
* BUGFIX: the repo list automatic search (when loading the page and is loading the search) was not properly working

## v2019.01.19
* BUGFIX: the markdown images were pointing to the wrong URL

## v2019.01.18
* FEATURE: the codemirror full height option has an alert, that is only shown on every week, not every time

## v2019.01.15
* FIX: the index page search was not working 100% exactly

## v2019.01.12
* FEATURE: on the index page pager, when there is just one page, the button is hidden
* FIX: repo_paging variables default was 5 instead of 10
* FIX: the index listing page is pure JavaScript, so for an intelligent bot will not see how to page, so it is a bot, the pager is disabled

## v2019.01.10
* added, on the repos list, sorting by name and last commit date - ascending/descending
* added paging, there is a new `config.ini` variable in the `app` section named `repo_paging`
  * if `repo_paging = 0`, pagination is disabled
  * otherwise the specified `repo_paging` / page is set, the default is 10
* fixed some variables, when they were not initialized
* the logo was too big, now it is proper

## v2019.01.01
* added a variable: app.fixed_navbar in config.ini
  * you can set the navbar as fixed or not
* added an alert when on the editor to let the users some people are not liking the full height editor mode and switch to the scroll mode 
* added a new ssh variable so that the ssh clone button can be dynamic like the http_user_dynamic called ssh_user_dynamic
* renamed the git_clone_subdir to ssh_clone_subdir, it makes more sense
* in the git clone ssh button was missing the protocol (ssh://)
* the RSS content type application/rss+xml is obsolete so I changed the content type to application/xml
* the http_user and the ssh_user is url encoded

## v2018.12.31
* config.ini changes
  * clone.git_http_subdir_calculated
    * true = it calculates to actual route/nested path by itself for the http clone button
  * git_http_subdir
    * if git_http_subdir_calculated is false, then the git_http_subdir variable uses as the path

## v2018.12.24
* Added Python as markdown and CodeMirror

## v2018.12.22
* Added a top to bottom button

## v2018.12.21
* The ZIP and TAR button moved to the Download button as a dropdown
* Added a GIT button, the first action is 
  * Fetch origin

## v2018.12.14
* The main icon was ugly, now, is centered perfectly and has a little shadow

## v2018.12.13
* The icons of the main tabs animations were not centered (cosmetic fix) 
* There was a routing problem, some pages were not working
* Added tooltips to the log, which is not shown - too long text ...

## v2018.9.20-0
* Sort the repo list by last updated

## v2.12
* Treegraph is using markdown

## v2.11
* Markdown images ware not working 100%
* File extension types were not working with like eg. JPG, Jpg, jPg, now it works
* On the index page it shows the last commit and username by elapsed time

## v2.10
* Upload binary and/or existing files
* Able to delete binary files
* Added some animation to the Fontawesome 5 icons
* Add new text files or add directory
* Sometimes, the delete file, it was not showing the last, but the previous last commit
* Markdown, twemoji on commits
* Fix long commits
* Display SVG files, while you can edit it as well
                   * The network dots were small, now big ones with 10 radius, 20px;
* Delete files
* grunt-contrib-less - 2 is missing the `@path` variable
* add change log display
* The right GitHub menu is now a popup menu instead of a link to GitHub.

## v2.9
* The tree search and the blames are using the shared code (with option to use with Code mirror)
* Diffs are rendering with web workers.
* Minor typo on the next/older commit page
* Synched to klaussilveira/gitlist
* Added twemoji to the commits list
* Memory limit
* Updated NPM and composer
* The Gitter is merged into Gitlist to code easier
* The pager was not working with the browser back function
* The commit message is using markdown


## v2.6.0
* network and graph works with Bootstrap 3 totally

## v2.5.0
* you can edit files now

## v2.0.12-585
* removed `Babel` 😀

## v2.0.4-579
* Automated build with webpack and grunt

## v1.1.18-573
* for big commits and changing the theme, it calculated the time it was loading the full commit list and it is about the same time when you change the theme, it added an overlay and this text eg. `9 seconds to switch the theme`
* automatic versions generated with grunt

## v1.1.14
* added overlay when loading big commits

## v1.1.12
* allow CodeMirror show toggle height 300px vs all

## v1.1.11
* Make to use the tag/branch button like GitHub

## v1.1.10
* total dark/light mode (CodeMirror, diff, Markdown)

## v1.1.9
* markdown dark mode
* we automatically load the next commit, when we are on the bottom of the page
* minor toast fix

## v1.1.8
The `config.ini` file with `url_subdir` or later `clone_subdir` variable has been changed to the `ssh_clone_subdir` variable.

## v1.1.7
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

## v1.1.6
* All `PHP` files will be in the `root` and only `index.php`, `images`, `icons`, `svg`, `css`, `js` bundle files will be in the `public` subdir.

## v1.1.5
* Removed old `clone` button modal popup, using `Bootstrap` only
* Double checked, all is using pure `Boostrap`
* Added `toast` and save the `url` to the clipboard when you click on the `clone` button
* Added `UglifyJs` and minimize the `css`.

## v1.1.3
* Moved to `webpack`
* Using `Babel`

## v1.1.2
* Added twemoji's

## v1.1.1
* Format size was missing space (ugly)
* Graph time was not using the ```config.ini```
* Fixed images to not show a html block span text and use now real image alt and title attributes in html
* Graph was not using Bootstrap
* Network wast not using Bootstrap

## v1.0.3
* Total bytes was not working with Twig 2

## v1.0.2
* Add support for .gitmodules files at repository root
* Updated to latest dependencies

## v1.0.1
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

   
[//]: #@corifeus-footer

---

🙏 This is an open-source project. Star this repository, if you like it, or even donate to maintain the servers and the development. Thank you so much!

Possible, this server, rarely, is down, please, hang on for 15-30 minutes and the server will be back up.

All my domains ([patrikx3.com](https://patrikx3.com) and [corifeus.com](https://corifeus.com)) could have minor errors, since I am developing in my free time. However, it is usually stable.
  
---
  
[**P3X-GITLIST**](https://pages.corifeus.com/gitlist) Build v2019.10.123 

[![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software) 


## P3X Sponsors

[IntelliJ - The most intelligent Java IDE](https://www.jetbrains.com/?from=patrikx3)
  
[![JetBrains](https://cdn.corifeus.com/assets/svg/jetbrains-logo.svg)](https://www.jetbrains.com/?from=patrikx3) [![NoSQLBooster](https://cdn.corifeus.com/assets/png/nosqlbooster-70x70.png)](https://www.nosqlbooster.com/)

[The Smartest IDE for MongoDB](https://www.nosqlbooster.com)
  
  
 

[//]: #@corifeus-footer:end
