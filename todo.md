[//]: #@corifeus-header

# 🤖 P3X Gitlist - A decorated enhanced elegant, feature rich and modern private git ui repository viewer

                        
[//]: #@corifeus-header:end
## TODO
* Localization (twig, controller, php, js)
* Sometimes, I try to upload a file like `grub.png` and it does not work, while I upload a different `.png` and it works, weird
* make sure new functions work with Windows or disable some features is Windows
* treegraph pager
* diff by file
* pager not working right with commits
* search has no pager (either of two)
* Basically, the twig "for" is not cheap => expensive, use AJAX and web worker 
  * search.twig
  * blame.twig
* Search, at work, "fix" string hs 1221 results, use AJAX and pager
* Blames in gitlist on composer.lock has 994 results, use AJAX and pager
* In submodules, if the "submodule" and "path" is not the same, it chokes (it should work the submodule name and path are not the same)
  * Works
    * submodule "path/name"
    * path path/name
  * Not working
    * submodule "name"
    * path path/name 
* In submodules, the url cannot have slash at the end
* Convert Silex 2 to Symfony 4 - actually this is stays as Silex, Symfony is overcomplicated for a small web site


[//]: #@corifeus-footer

---

[**P3X-GITLIST**](https://pages.corifeus.com/gitlist) Build v2019.1.23-0 

[![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software) [![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) 


## P3X Sponsors

[IntelliJ - The most intelligent Java IDE](https://www.jetbrains.com/?from=patrikx3)
  
[![JetBrains](https://cdn.corifeus.com/assets/svg/jetbrains-logo.svg)](https://www.jetbrains.com/?from=patrikx3) [![NoSQLBooster](https://cdn.corifeus.com/assets/png/nosqlbooster-70x70.png)](https://www.nosqlbooster.com/)

[The Smartest IDE for MongoDB](https://www.nosqlbooster.com)
  
  
 

[//]: #@corifeus-footer:end