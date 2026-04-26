[//]: #@corifeus-header

# 🤖 P3X Gitlist - A decorated enhanced elegant, feature rich and modern private git ui repository viewer

                        
[//]: #@corifeus-header:end
### v2021.10.211
Released on 11/18/2021
* FEATURE: Works on PHP 8.1

### v2021.10.198
Released on 11/05/2021
* ISSUE: https://github.com/patrikx3/gitlist/issues/37

### v2021.10.197
Released on 11/05/2021
* ISSUE: https://github.com/patrikx3/gitlist/issues/36

### v2021.10.195
Released on 11/04/2021
* PULL: https://github.com/patrikx3/gitlist/pull/35

### v2021.10.194
Released on 11/03/2021
* FEATURE: On the markdown code is giving a copy function (on hover). 

## v2021.10.191
Released on 10/29/2021
* BUGFIX: Remove composer platform check to work on PHP 7 and PHP 8 at once.

## v2021.10.189
Released on 10/27/2021
* FEATURE: The tag list menu is ordered by natural compare sorting.

## v2021.10.183
Released on 10/27/2021
* CHORE: Update deps and NodeJs.

## v2021.10.161
Released on 9/18/2021
* BUGFIX: There was not showing the binary files and pictures, since the total Packagist upgrade. Now it is working.

## v2021.10.152
* FEATURE: Move from Silex's Packagist composer and keep the code in the source as it has been upgraded with latest Symfony packages.

## v202.10.146
* FEATURE: Works on PHP 8.

## v2021.10.143
* FEATURE: Add option to remove .git extension from repo names
  * BASED ON: https://github.com/klaussilveira/gitlist/commit/434521a4e762e72a9d69d8756ee2d1279134c8af

## v2021.4.102
* CHORE: Update deps.

## v2020.10.189
* FEATURE: Add NGINX config to `highlight.js`.

## v2020.10.187
* BUGFIX: Fix a layout problem in the log.

## v2020.10.185
* BUILD: Further bundle size optimization (~800kB minus)

## v2020.10.182
* BUILD: Splitted vendor modules packages with Webpack using `import` with pre-fetch.  

## v2020.10.170
* BUILD: Kept older versions in the release.

## v2020.10.138
* BUGFIX: List searcher pager elements were hidden after the search clear button click.

## v2020.10.136
* BUGFIX: List searcher pager elements were hidden after the search clear button click.

## v2020.10.104
* CHORE: Upgrade Webpack web worker loader.

## v2020.10.102
* BUGFIX: Missing TypeScript Codemirror mode.
* BGUFIX: The active line was not highlighting the line number.

## v2020.4.218
* BUGFIX: Since using Fontawesome fonts instead of svg, had to do some fix-up.

## v2020.4.210
* BUGFIX: Fontawesome was using SVG, replaced with fonts as it was giving 1.5MB bundle bigger (using SVG)

## v2020.4.188
* FEATURE: Enable generate a link when clicking on the line number/gutter and scroll to the given line.

## v2020.4.185
* FEATURE: enable/disable editing via `config.ini` under the `[app]` `enable_editing` variable
* BUG: DELETE button is missing in the viewer, only after editing was showing

## v2020.4.146
* FEATURE: the browser tags are in reverse order, just like GitHub

## v2020.4.144
* BUGFIX: On the sort by last commit, was not working perfectly.

## v2020.4.126
* FEATURE: Latest (Git 2.25), the log changed.

## v2020.4.125
* FEATURE: Latest (Git 2.25), the log changed.

## v2020.4.123
* FEATURE: Stronger TerserJs compression.

## v2020.4.117
* FEATURE: Enable dark/light mode for tree graph.

## v2020.4.116
* BUGFIX: Log graph was throwing an error.

## v2020.4.114
* BUGFIX: Log graph was throwing an error.

## v2020.4.111
* BUGFIX: The release zip folder was bad.

## v2020.4.107
* BUGFIX: Network graph loading popup was not working right.

## v2020.4.105
* CHORE: Updated NPM versions.
* BUGFIX: Network graph was not working (drag / scroll).

## v2020.4.103
* CHORE: Updated NPM versions.

## v2019.10.154
* CHORE: Updated composer versions.
* FEATURE: Enable ico file types.

## v2019.10.146
* BUGFIX: Was not working on the tree list paths with in space.

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

[//]: #@corifeus-footer

---

# Corifeus Network

AI-powered network & email toolkit — free, no signup.

**Web** · [network.corifeus.com](https://network.corifeus.com)  **MCP** · [`npm i -g p3x-network-mcp`](https://www.npmjs.com/package/p3x-network-mcp)

- **AI Network Assistant** — ask in plain language, get a full domain health report
- **Network Audit** — DNS, SSL, security headers, DNSBL, BGP, IPv6, geolocation in one call
- **Diagnostics** — DNS lookup & global propagation, WHOIS, reverse DNS, HTTP check, my-IP
- **Mail Tester** — live SPF/DKIM/DMARC + spam score + AI fix suggestions, results emailed (localized)
- **Monitoring** — TCP / HTTP / Ping with alerts and public status pages
- **MCP server** — 17 tools exposed to Claude Code, Codex, Cursor, any MCP client
- **Install** — `claude mcp add p3x-network -- npx p3x-network-mcp`
- **Try** — *"audit example.com"*, *"why do my emails land in spam? test me@example.com"*
- **Source** — [patrikx3/network](https://github.com/patrikx3/network) · [patrikx3/network-mcp](https://github.com/patrikx3/network-mcp)
- **Contact** — [patrikx3.com](https://www.patrikx3.com/en/front/contact) · [donate](https://paypal.me/patrikx3)

---

## ❤️ Support Our Open-Source Project  
If you appreciate our work, consider ⭐ starring this repository or 💰 making a donation to support server maintenance and ongoing development. Your support means the world to us—thank you!  

---

### 🌍 About My Domains  
All my domains, including [patrikx3.com](https://patrikx3.com), [corifeus.eu](https://corifeus.eu), and [corifeus.com](https://corifeus.com), are developed in my spare time. While you may encounter minor errors, the sites are generally stable and fully functional.  

---

### 📈 Versioning Policy  
**Version Structure:** We follow a **Major.Minor.Patch** versioning scheme:  
- **Major:** 📅 Corresponds to the current year.  
- **Minor:** 🌓 Set as 4 for releases from January to June, and 10 for July to December.  
- **Patch:** 🔧 Incremental, updated with each build.  

**🚨 Important Changes:** Any breaking changes are prominently noted in the readme to keep you informed.


[**P3X-GITLIST**](https://corifeus.com/gitlist) Build v2026.4.1004

 [![Donate for PatrikX3 / P3X](https://img.shields.io/badge/Donate-PatrikX3-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software)





[//]: #@corifeus-footer:end