[//]: #@corifeus-header

# 🤖 P3X Gitlist - A decorated enhanced elegant, feature rich and modern private git ui repository viewer

                        
[//]: #@corifeus-header:end

### v2026.4.1003
Released on 04/25/2026
* BUGFIX: Fix PHP 8.5 non-canonical (boolean) cast deprecation.
* PERF: Batch decorateItem with one git log per directory (was N+1).
* BUGFIX: Preserve paginated items after lazy-load by skipping List.js reIndex.
* BUGFIX: Pager visibility now uses list.matchingItems instead of a racy DOM query.
* BUGFIX: Remove hardcoded 1/2/... placeholder from bottom pager.
* BUGFIX: Pager visibility check now looks at all pagination uls, not just the top one.
* BUGFIX: Fix index pager visibility and markdown code wrapping.

### v2026.4.1002
Released on 04/25/2026
* FEATURE: Lazy-load index and treegraph for faster initial page rendering.
* FEATURE: Redesign treegraph as a 2-row table layout.

### v2026.4.1001
Released on 04/22/2026
* BUGFIX: Use explicit nullable type for PHP 8.4+ compatibility.

### v2026.4.1000
Released on 04/22/2026
* BUGFIX: Fix empty-repo render and toISOString crash on index page.
* BUGFIX: Gate livereload script to debug-only so production no longer logs ERR_CONNECTION_REFUSED on :35729.
* BUGFIX: Render nested inline markdown in headings, strong, and link elements.
* CHORE: Hoist grunt-contrib-clean/copy/htmlmin/watch as direct devDependencies so jit-grunt resolves them on a fresh yarn install.
* CHORE: Clean up English wording on index.repo.empty translation.

### v2026.4.999
Released on 04/20/2026
* CHORE: Routine maintenance release.

### v2026.4.803
Released on 04/20/2026
* CHORE: Routine maintenance release.

### v2026.4.802
Released on 04/20/2026
* CHORE: Bump corifeus-builder and regenerate footer.

### v2026.4.800
Released on 04/16/2026
* BUGFIX: Use explicit nullable type for PHP 8.4+ compatibility.

### v2026.4.799
Released on 04/11/2026
* FEATURE: Translate all hardcoded English strings across all 29 language files for full internationalization.
* FEATURE: Add dynamic page titles showing repository, file, and commit context.
* FEATURE: Add copy-to-clipboard for commit hashes in commits list, detail, and log views.
* FEATURE: Add keyboard shortcuts (/ for search, ? for help, Esc to blur).
* FEATURE: Add file info badges showing size and line count in the file viewer.
* FEATURE: Add relative time display on commit dates using native Intl.RelativeTimeFormat.
* FEATURE: Add configurable treegraph_limit setting to prevent canvas overflow.
* FEATURE: Add content-visibility paint virtualization for treegraph rows.
* FEATURE: Add ARIA labels on search forms and navigation for improved accessibility.
* BUGFIX: Fix treegraph dark mode by removing hardcoded black colors from gitgraph styles.
* REFACTOR: Replace deprecated moment.js with native browser APIs.

### v2026.4.331
Released on 04/10/2026
* BUGFIX: Add __isset to Twig global proxy so global.request.host resolves correctly.
* BUGFIX: Remove redundant duplicate empty repo message in empty repository view.

### v2026.4.331
Released on 04/10/2026
* REFACTOR: Use shared corifeus-builder changelog and GitHub release module.
* FIX: Handle empty repositories gracefully with a friendly page and clone URL display instead of "No route found" error.

### v2026.4.330
Released on 04/10/2026
* CHORE: Update changelog with actual change descriptions for v2026.4.329.

### v2026.4.329
Released on 04/08/2026
* FIX: Markdown tables and inline code not visible in light mode (white-on-white hljs background)
* FEATURE: Add auto language detection from browser Accept-Language header with "Auto" option in language dropdown

### v2026.4.328
Released on 04/02/2026
* CHORE: Version bump

### v2026.4.327
Released on 04/02/2026
* FIX: Use git -S to find changelog anchor commit and remove duplicate entries
* FIX: Always generate changelog entry on version bump

### v2026.4.322
Released on 04/02/2026
* FEATURE: Add auto theme mode with system preference detection and dark syntax highlighting
* FEATURE: Redesign blame view with syntax highlighting, rich metadata, and livereload support
* FEATURE: Improve navigation layout with responsive design and better menu structure
* FEATURE: Upgrade jQuery to 4.0 with optimized development watch mode
* FEATURE: Add multilingual localization for moment.js time-ago strings
* FIX: Correct footer layout with missing clear div and pager spacing
* FIX: Guard against missing submodule configuration when resolving URLs
* FIX: Improve Docker file permissions handling with targeted chown
* FIX: Fix navigation menu branch reference naming
* CHORE: Simplify changelog generation and remove redundant tagging
* CHORE: Update documentation and remove obsolete screenshot artifacts
* CHORE: Update PHP requirement to 8.3.0

### v2026.4.321
Released on 04/02/2026
* FEATURE: Add auto theme mode with system preference detection
* FEATURE: Redesign blame view with syntax highlighting, rich metadata, and livereload support
* FEATURE: jQuery 4.0 migration with fast dev watch and CodeMirror dark syntax highlighting
* FEATURE: Improve navigation pills layout with responsive stacking
* FIX: Fix footer layout with clear fix div and pager bottom margin
* FIX: Guard against missing submodule config when resolving URLs
* FIX: Use targeted chown instead of find for Docker file permissions
* CHORE: Simplify changelog generation and publish workflow
* CHORE: Update PHP requirement to 8.3.0, refresh documentation and translations

### v2026.4.320
Released on 04/02/2026
* FEATURE: Add auto theme mode with system preference detection
* FEATURE: Redesign blame view with syntax highlighting, rich metadata, and livereload support
* FEATURE: Improve navigation pills layout and responsive behavior on small screens
* FEATURE: jQuery 4.0 migration with fast dev watch (2 themes) and CodeMirror dark syntax highlighting
* FEATURE: Refactor repository endpoint naming from index.repo.on to index.repo.branch with translations
* FEATURE: Internationalize moment.js "time ago" strings based on language cookie
* FIX: Footer layout improvements (missing clear div and pager bottom margin)
* FIX: Guard against missing submodule config when resolving URLs
* FIX: Improve Docker build performance with targeted file permission changes
* CHORE: Simplify changelog generation and publishing process
* CHORE: Update documentation (screenshots, README restructuring, remove migration guide)
* CHORE: Update dependencies (PHP 8.3.0 requirement, remove danielstjules/stringy)

### v2026.4.319
Released on 03/27/2026
* FEATURE: Redesign blame view with syntax highlighting, rich metadata, and livereload support
* FEATURE: jQuery 4.0 migration with fast dev watch for multiple themes and CodeMirror dark syntax highlighting
* FEATURE: Localize moment.js "time ago" strings based on language cookie
* FEATURE: Improve navigation pills layout
* FEATURE: Rename index.repo.on to index.repo.branch with correct translations
* FIX: Fix footer layout with missing div for clear fix
* FIX: Guard against missing submodule config when resolving URLs
* FIX: Optimize Docker file permissions with targeted chown
* FIX: Stack navigation pills vertically on small screens
* FIX: Add bottom margin to pager for footer spacing
* CHORE: Simplify changelog generation and remove redundant tagging
* CHORE: Update documentation with v2026.4.307 entry and simplify publish script
* CHORE: Remove obsolete screenshot artifacts and update documentation
* CHORE: Reorganize and streamline README structure
* CHORE: Update PHP requirement to 8.3.0 and remove danielstjules/stringy dependency

### v2026.4.318
Released on 03/27/2026
* FEATURE: Redesign blame view with syntax highlighting, rich metadata, and livereload support
* FEATURE: Upgrade jQuery to 4.0 with improved dev watch for multiple themes and CodeMirror dark syntax highlighting
* FEATURE: Improve navigation pills layout and localize "time ago" strings
* FIX: Enhance footer layout with proper div structure and pager bottom margin
* FIX: Guard against missing submodule config when resolving URLs
* FIX: Stack navigation pills vertically on small screens and optimize Docker file permissions
* CHORE: Simplify changelog generation and update documentation
* CHORE: Refactor branch naming, upgrade PHP to 8.3.0, and remove obsolete dependencies

### v2026.4.317
Released on 03/27/2026
* FEATURE: Redesign blame view with syntax highlighting, rich metadata, and livereload support
* FEATURE: jQuery 4.0 migration with fast dev watch for multiple themes and CodeMirror dark syntax highlighting
* FEATURE: Improve navigation pills layout
* FIX: Fix footer layout with missing div for clear fix
* FIX: Guard against missing submodule config when resolving URLs
* FIX: Use targeted chown instead of find for Docker file permissions
* FIX: Stack navigation pills vertically on small screens (BS3-style)
* FIX: Add bottom margin to pager for footer spacing
* CHORE: Simplify changelog generation and remove redundant tagging
* CHORE: Remove obsolete screenshot artifacts and update migration guide
* CHORE: Streamline and reorganize README structure
* CHORE: Rename index.repo.on to index.repo.branch with correct translations
* CHORE: Localize moment.js "time ago" strings based on language cookie
* CHORE: Update PHP requirement to 8.3.0 and remove danielstjules/stringy dependency

### v2026.4.316
Released on 03/27/2026
* FEATURE: Redesign blame view with syntax highlighting, rich metadata, and livereload support
* FEATURE: Improve responsive navigation pills layout (BS3-style)
* FEATURE: jQuery 4.0 migration with fast dev watch and CodeMirror dark syntax highlighting
* FEATURE: Localize moment.js "time ago" strings based on language cookie
* FIX: Add missing footer div for proper clear fix layout
* FIX: Guard against missing submodule config when resolving URLs
* FIX: Improve Docker file permissions handling with targeted chown
* FIX: Add bottom margin to pager for footer spacing
* CHORE: Simplify changelog generation and remove redundant tagging
* CHORE: Remove obsolete screenshot artifacts and update documentation
* CHORE: Refactor repository reference from index.repo.on to index.repo.branch
* CHORE: Update PHP requirement to 8.3.0 and remove danielstjules/stringy dependency


### v2026.4.309
Released on 03/26/2026
* FEATURE: Redesign blame view with livereload support and improve menu pills layout
* FEATURE: Upgrade jQuery to 4.0 with fast development watch, multiple theme support, and CodeMirror dark syntax highlighting
* FIX: Use targeted chown for Docker file permissions instead of find
* FIX: Stack navigation pills vertically on small screens and add footer spacing to pager
* CHORE: Update documentation with changelog entries, README restructuring, screenshot cleanup, and remove obsolete artifacts

### v2026.4.307
Released on 03/26/2026
* FEATURE: Upgraded Bootstrap 3 to 5, Bootswatch 3 to 5, jQuery 3.7 to 4.0, CodeMirror 5 to 6
* FEATURE: Replaced vendored Silex with lightweight custom Framework layer using Symfony 7.x
* FEATURE: Added i18n/localization support with 29 languages including CodeMirror UI translation
* FEATURE: Added HTML viewer functionality
* FEATURE: Enabled .mjs file extension for CodeMirror syntax highlighting
* FEATURE: Redesigned blame view with BS5 theme-aware styling
* FEATURE: Added livereload support for development (auto-refresh on twig/scss/js changes)
* FEATURE: Fast dev watch mode (2 themes only, ~2s vs ~35s for all 27 themes)
* FEATURE: Network graph with touch support, momentum scrolling, and BS5 theme-aware colors
* FEATURE: Treegraph infinite scroll (auto-load more commits on scroll)
* FEATURE: CodeMirror dark/light theme with oneDark syntax highlighting
* FEATURE: Repository search fix for special characters (hyphens) by replacing List.js default search
* FEATURE: Commit date localization using built-in month translations
* FEATURE: Auto-generated changelog via Claude CLI in publish script
* FIX: CI upgraded PHP to 8.3 and GitHub Actions to v4
* FIX: Twig 3.24 compatibility (removed 'is defined' tests)
* FIX: Nav pills responsive layout (horizontal on desktop, vertical stacked on mobile)
* FIX: PHP opcache auto-restart after webhook deploy
* FIX: Docker file permission handling in build and deploy scripts
* CHORE: LESS to SCSS migration, removed snackbarjs (replaced with BS5 Toast)
* CHORE: Docker setup with Nginx, PHP-FPM, and automated deployment scripts
* CHORE: Removed danielstjules/stringy dependency (replaced with native PHP)
* CHORE: Removed all jQuery deprecated shorthands for jQuery 4.0 compatibility

### v2022.4.106 
Released on 02/05/2022
* CHORE: Upgrade all deps

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


[**P3X-GITLIST**](https://corifeus.com/gitlist) Build v2026.4.1003

 [![Donate for PatrikX3 / P3X](https://img.shields.io/badge/Donate-PatrikX3-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software)





[//]: #@corifeus-footer:end
