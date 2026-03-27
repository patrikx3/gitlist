[//]: #@corifeus-header

# 🤖 P3X Gitlist - A decorated enhanced elegant, feature rich and modern private git ui repository viewer

                        
[//]: #@corifeus-header:end
# GitList - Agent Instructions

## Build & Test Workflow

When working on frontend changes (SCSS, JS, Twig templates), always build and let the user test on localhost:8080 before committing.

### Build commands
```bash
# Fix Docker root-owned files first (Docker composer creates root-owned files)
sudo chown -R $(id -u):$(id -g) build/ public/ node_modules/

# CSS only (fast, ~35s for 27 themes)
npx grunt sass

# JS only (webpack)
npx webpack --mode=production

# Full build - NOTE: grunt async webpack task may silently fail, safer to run sass and webpack separately
npm run build
```

### Testing
User runs PHP dev server on localhost:8080. After CSS/JS rebuild, user refreshes browser to check. Compare with git.patrikx3.com (production) for visual parity.

### Deploy pipeline
```bash
# Full pipeline: fix-perms → publish GitHub release → git commit+push → deploy to ngivr
./secure/deploy-all.sh

# Or individually:
./secure/publish.sh          # Build + GitHub release
./secure/deploy-ngivr.sh     # Deploy latest release to git.ngivr.sygnus.hu
```

## Server Access

See `secure/server-access.md` for server IPs, ports, SSH scripts, and webhook config.

## Architecture

- **PHP Backend**: Custom Framework layer (replaced Silex), Pimple container, Symfony components
- **Frontend**: Webpack + Grunt, Bootstrap 5 + Bootswatch 5 (SCSS), jQuery 4.0, CodeMirror 6
- **Templates**: Twig with `|t` filter for i18n (29 languages)
- **Localization**: JSON files in `src/translation/`, language selector in navbar, cookie-based. CodeMirror 6 also has translated phrases via `EditorState.phrases.of()`

## Known Issues / TODO

- **Nav pills on small screens**: The menu pills (Files, Commits, Log, Graph, Stats) must always stay in a single horizontal row at all screen sizes. They shrink text/padding to fit, never wrap. On very small screens they use `flex-wrap: nowrap` with `overflow-x: auto`. The pills and the "browsing: master" dropdown should be vertically centered (`align-items: center`). See `_menu.scss` for the implementation.
- **Nav pills height alignment**: The pills row and the "browsing: branch" dropdown should be the same height and vertically aligned. If they look misaligned, check `_menu.scss` for `align-items: center` on the flex container.
- **Dark/light theme awareness**: All new UI components must support both light and dark Bootswatch themes. Use `.p3x-gitlist-light &` and `.p3x-gitlist-dark &` SCSS selectors for theme-specific styles. Use `var(--bs-border-color)` and other BS5 CSS variables where possible.

## Key Constraints

- **Twig**: Cannot use `is defined` test freely in Twig 3.24+ (use `is not empty` or pass variables explicitly)
- **PHP opcache**: After deploying new PHP files, PHP-FPM must be restarted (`systemctl restart php8.3-fpm`). The webhook on git.patrikx3.com does this automatically.
- **Composer platform**: `composer.json` has `"platform": {"php": "8.3.0"}` to keep deps compatible with the ngivr server (PHP 8.3)
- **Bootstrap/Bootswatch**: Now on BS5. Old BS3 classes must not be used. See `docs/migration-all-packages.md` for full migration details.
- **snackbarjs**: Removed. Replaced with BS5 native Toast via `$.snackbar()` compatibility shim in `bundle.js`.
- **Docker permissions**: Docker composer run creates root-owned files in `vendor/`, `node_modules/`, `public/prod/`. Always fix with `sudo chown` before building.
- **Raphaël SVG (network.js)**: The network graph uses Raphaël library for SVG rendering. Raphaël elements (e.g. `commit.dot`) have their own `.mouseover()`, `.mouseout()`, `.click()`, `.data()` methods — these are NOT jQuery methods. Do NOT refactor them to `.on('click', ...)` — they will break. Only jQuery DOM elements need the `.on()` pattern.
- **jQuery 4.0**: All jQuery event shorthands (`.click()`, `.scroll()`, `.change()`, `.keyup()`, etc.) have been replaced with `.on('event', fn)` and `.trigger('event')`. Native DOM methods like `.focus()`, `.submit()` on raw elements are unaffected.

## Translation / i18n

- Translation files: `src/translation/{lang}.json` (flat key-value JSON)
- Twig: `{{ 'key'|t }}` filter
- JS: `window.gitlist.t('key')` function
- Add language: create JSON file + add code to `$allowedLangs` in `src/GitList/Application.php`
- JSON must be valid - escape `"` inside values, avoid fancy quotes like `„"` or `""`

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

### 🌍 About My Domains  
All my domains, including [patrikx3.com](https://patrikx3.com), [corifeus.eu](https://corifeus.eu), and [corifeus.com](https://corifeus.com), are developed in my spare time. While you may encounter minor errors, the sites are generally stable and fully functional.  

---

### 📈 Versioning Policy  
**Version Structure:** We follow a **Major.Minor.Patch** versioning scheme:  
- **Major:** 📅 Corresponds to the current year.  
- **Minor:** 🌓 Set as 4 for releases from January to June, and 10 for July to December.  
- **Patch:** 🔧 Incremental, updated with each build.  

**🚨 Important Changes:** Any breaking changes are prominently noted in the readme to keep you informed.

---


[**P3X-GITLIST**](https://corifeus.com/gitlist) Build v2026.4.314

 [![Donate for PatrikX3 / P3X](https://img.shields.io/badge/Donate-PatrikX3-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software)





[//]: #@corifeus-footer:end