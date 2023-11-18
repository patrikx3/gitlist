[//]: #@corifeus-header

# 🤖 P3X Gitlist - A decorated enhanced elegant, feature rich and modern private git ui repository viewer

                        
[//]: #@corifeus-header:end
## TODO
* Maintain Silex
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
* Search, at work, "fix" string has 1221 results, use AJAX and pager
* Blames in gitlist on composer.lock has 994 results, use AJAX and pager
* In submodules, if the "submodule" and "path" is not the same, it chokes (it should work the submodule name and path are not the same)
  * Works
    * submodule "path/name"
    * path path/name
  * Not working
    * submodule "name"
    * path path/name 
* In submodules, the url cannot have slash at the end


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
