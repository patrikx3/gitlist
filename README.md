[//]: #@corifeus-header

  [![Donate for PatrikX3 / P3X](https://img.shields.io/badge/Donate-PatrikX3-003087.svg)](https://paypal.me/patrikx3) [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Corifeus @ Facebook](https://img.shields.io/badge/Facebook-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software)  [![Uptime ratio (90 days)](https://network.corifeus.com/public/api/uptime-shield/31ad7a5c194347c33e5445dbaf8.svg)](https://network.corifeus.com/status/31ad7a5c194347c33e5445dbaf8)





# 🛠️ 🤖 P3X Gitlist - A decorated enhanced elegant, feature rich and modern private git ui repository viewer  v2026.4.1004


  
🌌 **Bugs are evident™ - MATRIX️**  
🚧 **This project is under active development!**  
📢 **We welcome your feedback and contributions.**  
    

# Description


                        
[//]: #@corifeus-header:end

P3X GitList is an enhanced fork of [klaussilveira/gitlist](https://github.com/klaussilveira/gitlist), rebuilt for modern PHP and designed for performance. It handles large repositories and commits within 64 MB of memory by offloading heavy work (e.g. huge diffs) to the client via web workers. Sub-modules are fully supported.

**Key features:**
- 27 themes (22 light, 5 dark)
- CodeMirror 6 code editor with syntax highlighting and file editing
- 100% responsive with Bootstrap 5 LTS, jQuery 4 LTS, and FontAwesome icons
- Markdown rendering with Twitter Emojis in commits and logs
- Runs on OpenWrt

**Requires PHP >= 8.3 LTS**

> **Note:** Only UTF-8 encoded files are supported. Non-UTF-8 files may produce incorrect results.

## Demo

[Live demo](https://demo.gitlist.patrikx3.com) | [Screenshots](artifacts/screenshots.md)

## Releases

[GitHub Releases](https://github.com/patrikx3/gitlist/releases)

## Localization / i18n

P3X GitList supports multiple languages, switchable via the **Language** dropdown in the navigation bar. The selected language is stored in a cookie.

**29 languages supported:** Afrikaans, العربية (Arabic), বাংলা (Bengali), Català, Čeština, Dansk, Deutsch, Ελληνικά, English, Español, Suomi, Français, עברית (Hebrew), Magyar, Italiano, 日本語, 한국어, Nederlands, Norsk, Polski, Português, Română, Русский, Српски, Svenska, Türkçe, Українська, Tiếng Việt, 中文.

Translation files are located in `src/translation/` as JSON files. To add a new language, create a new JSON file (e.g. `th.json`) with the same keys as `en.json`, and add the language code to the `$langNames` array in `src/GitList/Application.php`.

## NGINX Configuration

A complete config using NGINX, Let's Encrypt (via [acme.sh](https://acme.sh)), and `git-http-backend`. Only `public/index.php` is parsed — all other PHP files remain editable in the GitList UI.

[gitlist.patrikx3.com.conf](artifacts/gitlist.patrikx3.com.conf)

## Additional Documentation

- [Change log](change-log.md)
- [TODO](todo.md)
- [Breaking changes](change-break.md)
- [Original install guide](INSTALL.md)

# Development

Gitter and GitList are unified into a single codebase for easier development.

## Build Requirements

* [Node.js](https://nodejs.org/en/download/package-manager/) >= LTS
* `grunt-cli` (`npm install -g grunt-cli`)
* `Composer`

## Server Requirements

* `git`
* `Apache` with `mod_rewrite` enabled or `nginx` (preferred)
* `PHP` >= 8.3

## Building from Source

```bash
# Install Node.js (Ubuntu)
curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and install dependencies
git clone https://github.com/patrikx3/gitlist.git
curl -s http://getcomposer.org/installer | php
php composer.phar install

sudo npm install -g npm grunt-cli
yarn install

# Initialize test repos and config
./scripts/init.sh

# Development mode (watches for changes)
npm run watch

# Create a release build (requires zip)
sudo apt install -y zip
./scripts/release.sh
```

# Origin

Forked from [klaussilveira/gitlist](https://github.com/klaussilveira/gitlist).

**Last merge from upstream:** September 7, 2021
- [Gitlist commits](https://github.com/klaussilveira/gitlist/commits/master)
- [Gitter commits](https://github.com/klaussilveira/gitter/commits/master)

# Links

- [P3X GitList playground](https://www.patrikx3.com/en/front/playground/17/p3x-gitlist#PG17)
- [Corifeus P3X GitList](https://corifeus.com/gitlist/)
- [AlternativeTo](https://alternativeto.net/software/p3x-gitlist/)
- [GitHub Pages](https://patrikx3.github.io/gitlist/)
- [Git Wiki - Web Interfaces](https://git.wiki.kernel.org/index.php/Interfaces,_frontends,_and_tools#Web_Interfaces)


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
