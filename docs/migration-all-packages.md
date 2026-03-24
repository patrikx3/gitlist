[//]: #@corifeus-header

# 🤖 P3X Gitlist - A decorated enhanced elegant, feature rich and modern private git ui repository viewer

                        
[//]: #@corifeus-header:end
# Migration: Bootstrap 3 → 5, LESS → SCSS, jQuery 3.4 → 3.7, snackbarjs → BS5 Toasts

## Overview

This document covers the full package migration done in a single session. If the session crashes, use this to pick up where we left off.

**Status: In progress - NOT YET COMMITTED**

---

## 1. Bootstrap 3.4.1 → Bootstrap 5.3.8

### Build system: LESS → SCSS

- **Removed**: `grunt-contrib-less`, `less-loader` from devDependencies
- **Added**: `grunt-sass` (^3.1.0), `sass` (^1.86.0) to devDependencies
- **Added**: `@popperjs/core` (^2.11.8) to dependencies (required by BS5)
- **Removed**: entire `src/browser/less/` directory (23 .less files + theme dir with solar custom theme)
- **Created**: `src/browser/scss/` directory with all converted SCSS files

#### Files created in src/browser/scss/:
- `_default.scss` - main custom styles (converted from default.less)
- `_bs3-compat.scss` - **compatibility layer** mapping BS3 variable names to BS5 equivalents
- `_blame.scss`, `_browser.scss`, `_clone-button.scss`, `_codemirror.scss`, `_commit.scss`, `_commits-lists.scss`, `_file-fragment.scss`, `_file.scss`, `_footer.scss`, `_html-viewer.scss`, `_index.scss`, `_list-group-striped.scss`, `_markdown.scss`, `_menu.scss`, `_navigation.scss`, `_network.scss`, `_overlay.scss`, `_pager.scss`, `_search.scss`, `_tree.scss`, `_treegraph.scss`
- `style.scss` - entry point (no underscore prefix)
- `theme/` - auto-generated per-theme entry files by grunt

#### LESS → SCSS syntax changes applied:
- `@variable` → `$variable` (all Bootstrap variable references)
- `@import (less) "file"` → `@import "file"`
- `fadein(@var, 50%)` → `rgba($var, 0.5)`
- Local variables like `@fontSize` → `$fontSize`
- Snackbar imports removed (see section 3)

#### BS3-compat.scss variable mappings:
```scss
$padding-base-vertical: $spacer * .375
$padding-base-horizontal: $spacer * .75
$navbar-height: 3.5rem
$gray-lighter: $gray-200
$navbar-default-bg: $gray-200
$navbar-inverse-bg: $gray-900
$text-color: $body-color
$table-bg-accent: rgba(0, 0, 0, 0.05)  // BS5 uses CSS vars, can't nest in rgba()
$state-danger-text: #a94442  // hardcoded, BS5 uses CSS vars
$brand-primary: $primary
$list-group-border: $list-group-border-color
```

#### Build config changes:
- `Gruntfile.js`: `grunt-contrib-less` → `grunt-sass`, task names `less` → `sass`
- `src/browser/grunt/less.js` → `src/browser/grunt/sass.js` (new file)
  - Scans `node_modules/bootswatch/dist/{theme}/` (BS5 path)
  - Import order: variables → bootstrap → bootswatch → bs3-compat → default
  - Solar theme now from bootswatch natively (no custom files)
  - Cache path: `build/sass/` instead of `build/less/`
- `webpack.config.js`: removed `less-loader` from CSS rule, changed test from `/\.(css|less)$/` to `/\.css$/`
- `package.json` scripts: `less-watch` → `sass-watch`, `default-less` → `default-sass`
- Added `fix-perms` grunt task to handle Docker root-owned files in `public/prod/` and `build/`

#### Themes: 18 → 27
- **Removed**: `paper`, `readable` (not in Bootswatch 5)
- **Added**: `brite`, `litera`, `lux`, `materia`, `minty`, `morph`, `pulse`, `quartz`, `sketchy`, `vapor`, `zephyr`
- **Solar**: now from Bootswatch 5 natively, custom `src/browser/less/theme/solar/` deleted

### Twig template changes (18 files)

#### Data attributes (all files):
- `data-toggle` → `data-bs-toggle`
- `data-dismiss` → `data-bs-dismiss`
- `data-target` → `data-bs-target`
- `data-placement` → `data-bs-placement`

#### CSS class replacements:
- `btn-default` → `btn-secondary`
- `pull-left` → `float-start`
- `pull-right` → `float-end`
- `hidden-xs` → `d-none d-sm-block` (or `d-none d-sm-inline-block`)
- `visible-xs` → `d-block d-sm-none` (or `d-inline-block d-sm-none`)
- `panel panel-default` → `card`
- `panel-heading` → `card-header`
- `panel-body` → `card-body`
- `label label-primary` → `badge bg-primary`
- `label label-info` → `badge bg-info`
- `input-group-addon` → `input-group-text`
- `input-group-btn` → removed wrapper (buttons directly in input-group)
- `<b class="caret"></b>` → removed (BS5 dropdown-toggle has built-in caret)
- `<span class="caret"></span>` → removed
- `<li class="divider">` → `<hr class="dropdown-divider">`
- `class="close"` → `class="btn-close"` (modal/alert close buttons)
- Close button inner HTML `<span><i class="fas fa-times"></i></span>` → removed (btn-close has built-in X)

#### Navigation (navigation.twig) - FULL REWRITE:
- `<div class="navbar navbar-default">` → `<nav class="navbar navbar-expand-lg navbar-dark bg-dark">`
- `navbar-fixed-top` → `fixed-top`
- Removed `navbar-header` div (doesn't exist in BS5)
- `navbar-toggle` → `navbar-toggler` with `navbar-toggler-icon`
- `data-target=".navbar-collapse"` → `data-bs-target="#p3x-gitlist-navigation-theme"` (ID reference)
- `<ul class="nav navbar-nav navbar-right">` → `<ul class="navbar-nav ms-auto">`
- `<li class="dropdown">` → `<li class="nav-item dropdown">`
- `<a class="dropdown-toggle">` → `<a class="nav-link dropdown-toggle">`
- Dropdown items: `<a href="...">` → `<a class="dropdown-item" href="...">`
- `dropdown-menu-end` added to right-aligned dropdowns

#### Menu tabs (menu.twig):
- `<ul class="nav nav-pills nav-justified">` → `<ul class="nav nav-pills nav-fill flex-nowrap">`
- `<li class="active">` → `<li class="nav-item">` with `active` on the `<a class="nav-link">`
- Added responsive font-size/padding in `_menu.scss`

#### Breadcrumbs (breadcrumb.twig):
- `<ol class="breadcrumb">` → `<nav aria-label="breadcrumb"><ol class="breadcrumb">`
- `<li class="active">` → `<li class="breadcrumb-item active">`
- Added background/padding in SCSS (BS5 removed default breadcrumb background)
- All dropdown items got `class="dropdown-item"`

#### Other twig files changed:
- `commit.twig` - panels → cards, labels → badges
- `commits-list.twig` - panels → cards, responsive classes
- `stats.twig` - panels → cards
- `search.twig` - panels → cards
- `html-viewer.twig` - panels → cards
- `markdown.twig` - panels → cards
- `blame.twig` - labels → badges
- `treegraph.twig` - labels → badges
- `searchcommits.twig` - labels → badges
- `commits.twig` - btn-default → btn-secondary
- `tree.twig` - input-group-addon → input-group-text
- `modal/modal-commit.twig` - close button, input-group-addon → input-group-text
- `file.twig` - close buttons, btn-default → btn-secondary
- `index.twig` - btn-default → btn-secondary, pull-right → float-end
- `layout-page.twig` - input-group-btn removed, form-group → mb-3

### JavaScript changes (10 files)

#### Bootstrap JS API (jQuery → vanilla):
- `$el.modal('show')` → `bootstrap.Modal.getOrCreateInstance($el[0]).show()`
- `$el.modal('hide')` → `bootstrap.Modal.getOrCreateInstance($el[0]).hide()`
- `$('.dropdown-toggle').dropdown()` → removed (BS5 auto-initializes via data attributes)
- `$('[data-toggle="tooltip"]').tooltip()` → `document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el))`

#### Files changed:
- `bundle.js` - `require('bootstrap')` → `const bootstrap = require('bootstrap'); window.bootstrap = bootstrap;`
- `file.js` - 2x modal calls updated
- `tree.js` - 2x modal calls updated
- `change-log.js` - 1x modal call updated
- `todo.js` - 1x modal call updated
- `global/git.js` - 1x modal hide updated
- `global.js` - tooltip + dropdown init updated
- `theme-switcher.js` - dropdown items use `dropdown-item` class, active on `<a>` not `<li>`, divider → `dropdown-divider`

### CSS/SCSS additions for BS5 compatibility:
In `_default.scss`:
- Removed link underlines globally (`a { text-decoration: none; }`)
- `navbar-brand`, `nav-link`, `dropdown-item`, `list-group-item a` - no underlines
- Breadcrumb background/padding restored (BS5 removed it)
- Card, list-group default margins added (BS5 removed them)
- Toast container styling (replacement for snackbarjs)
- `.p3x-gitlist-button` margin added

In `_menu.scss`:
- Nav pills responsive sizing with `flex-nowrap`
- Smaller font/padding on mobile

In `_navigation.scss`:
- Logo height constraint added (prevents SVG blowup on mobile)
- Small screen logo: `width: 2rem; height: 2rem`

---

## 2. jQuery 3.4.1 → 3.7.1

- Changed `package.json`: `"jquery": "=3.4.1"` → `"jquery": "^3.7.1"`
- No code changes needed (minor version, backward compatible)
- Did NOT go to jQuery 4.0 (breaks snackbarjs, jquery.redirect, and BS3 plugins)

---

## 3. snackbarjs → Bootstrap 5 native Toasts

- **Removed**: `snackbarjs` from package.json dependencies
- **Removed**: snackbarjs CSS imports from `_default.scss`
- **Removed**: `#snackbar-container` custom CSS
- **Added**: `$.snackbar()` jQuery plugin replacement in `bundle.js` using BS5 Toast API
  - Same API: `$.snackbar({ content: '...', htmlAllowed: true/false, timeout: 5000 })`
  - Creates toast elements dynamically, appends to `.toast-container`
  - Auto-dismiss with configurable timeout
  - Dark background matching the old snackbar look
- **No changes to call sites** - all 17 `$.snackbar()` calls work as-is
- Toast container styled in `_default.scss` (dark background, white text, bottom-right position)

---

## 4. .ncurc.json

- Removed `jquery`, `codemirror` from reject list
- Removed `bootswatch`, `bootstrap` from reject list
- File now has empty reject array: `{ "reject": [] }`

---

## 5. Other changes in this batch

### Title version always visible
- `src/GitList/Application.php`: title always includes version (`$titleBase . ' v' . $pkg['version']`)

### Deploy scripts
- `secure/deploy-all.sh` - full pipeline: fix-perms → publish → commit → push → deploy-ngivr
- `secure/deploy-ngivr.sh` - deploy latest GitHub release to git.ngivr.sygnus.hu

---

## 6. Known issues / TODO

- [ ] Grunt `build` task (webpack) sometimes doesn't run in the grunt chain due to async issues - webpack works fine standalone with `npx webpack --mode=production`
- [ ] Docker creates root-owned files in `public/prod/` and `build/` - `fix-perms` grunt task handles this with sudo chown
- [ ] Some Bootswatch 5 themes may need CSS tweaks for dark mode (navbar colors, code blocks, etc.)
- [ ] `jquery.redirect` package is unmaintained (last update 2014) - works but should be replaced long-term
- [ ] Sass `@import` deprecation warnings (will need `@use` migration before Dart Sass 3.0)

---

## 7. How to rebuild from this state

```bash
# Fix permissions (if Docker left root-owned files)
sudo chown -R $(id -u):$(id -g) build/ public/prod/ node_modules/

# Install deps
yarn install

# Build CSS (27 themes)
npx grunt sass

# Build JS (webpack)
npx webpack --mode=production

# Or full build (may need permission fixes first)
npm run build
```

## 8. Files summary

### New files:
- `src/browser/scss/` - all SCSS files (23 partials + entry point)
- `src/browser/grunt/sass.js` - Grunt SCSS build config
- `docs/migration-all-packages.md` - this document
- `secure/deploy-all.sh` - deploy pipeline script
- `secure/deploy-ngivr.sh` - ngivr deploy script

### Deleted files:
- `src/browser/less/` - entire directory (23 .less files)
- `src/browser/less/theme/` - all generated theme .less files
- `src/browser/less/theme/solar/` - custom solar theme (bootswatch.less, variables.less)

### Modified files (82 total per git diff --stat):
- `Gruntfile.js` - sass task, fix-perms task
- `package.json` - dependency changes
- `webpack.config.js` - removed less-loader
- `.ncurc.json` - emptied reject list
- `src/browser/bundle.js` - BS5 bootstrap import, toast replacement
- `src/browser/js/themes.js` - auto-generated (27 themes)
- 8 JS files - BS5 modal/tooltip/dropdown API
- 18 twig files - BS5 classes and data attributes
- `yarn.lock` - updated lockfile
- Various .md files - version bumps from build

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


[**P3X-GITLIST**](https://corifeus.com/gitlist) Build v2026.4.253

 [![Donate for PatrikX3 / P3X](https://img.shields.io/badge/Donate-PatrikX3-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software)





[//]: #@corifeus-footer:end