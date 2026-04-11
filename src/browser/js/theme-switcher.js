const themes = require('./themes.js')
window.gitlist.themes = themes;
const Cookies = require('js-cookie')
const themeCookieName = 'gitlist-bootstrap-theme'

const AUTO_THEME = 'auto';
const AUTO_LIGHT = 'bootstrap-cosmo';
const AUTO_DARK = 'bootstrap-slate';

function getSystemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function resolveAutoTheme() {
    return getSystemPrefersDark() ? AUTO_DARK : AUTO_LIGHT;
}

function getRawThemeCookie() {
    return Cookies.get(themeCookieName) || AUTO_THEME;
}

function getThemeCookie() {
    const raw = getRawThemeCookie();
    if (raw === AUTO_THEME) {
        return resolveAutoTheme();
    }
    return raw;
}

function isAutoTheme() {
    return getRawThemeCookie() === AUTO_THEME;
}

gitlist.getThemeCookie = getThemeCookie;
gitlist.isAutoTheme = isAutoTheme;

$(function () {

    const themeList = $('#theme-list');

    const menuResponsive = require('./menu-responsive')
    const debounceResize = menuResponsive({
        menuList: themeList,
    })

    function setThemeCookie(theme) {
        Cookies.set(themeCookieName, theme, window.gitlist.cookieSettings);
    }

    const currentRaw = getRawThemeCookie();

    // Auto option at top with divider
    const autoLabel = window.gitlist.t('nav.theme_auto');
    const autoMenu = '<li><a href="#" data-theme="' + AUTO_THEME + '" class="dropdown-item theme-link ' + (currentRaw === AUTO_THEME ? 'active' : '') + '">' + autoLabel + '</a></li>';
    themeList.append(autoMenu);
    themeList.append('<li><hr class="dropdown-divider"></li>');

    const darkMenu = [];
    const lightMenu = []
    for (let key in themes) {
        const actualTheme = key.substring(10)
        const menu = '<li><a href="#" data-theme="' + key + '" class="dropdown-item theme-link ' + (currentRaw !== AUTO_THEME && currentRaw === key ? 'active' : '') + '" style="text-transform: capitalize">' + actualTheme + '</a></li>';
        if (window.gitlist.isDark(actualTheme)) {
            darkMenu.push(menu)
        } else {
            lightMenu.push(menu)
        }
    }
    for (let menu of lightMenu) {
        themeList.append(menu);
    }
    themeList.append('<li><hr class="dropdown-divider"></li>')
    for (let menu of darkMenu) {
        themeList.append(menu);
    }

    const themesheet = $('#bootstrap-theme');

    function switchToTheme(resolvedThemeKey) {
        const themeurl = themes[resolvedThemeKey];
        const currentHref = themesheet.attr('href')
        if (currentHref === themeurl) {
            return;
        }

        $('body').prepend(`
 <div class="p3x-gitlist-overlay">
        <div>
            <i class="fas fa-cog fa-spin fa-4x"></i>
        </div>
        <br/>
        <div>
            ${window.gitlist.t('js.theme_loading')}
        </div>
</div>
        `)

        themesheet.attr('href', themeurl);
        gitlist.setTheme()
    }

    let deferredSwitchTheme;
    $('.theme-link').on('click', function (event) {

        event.preventDefault();

        const generateNewTheme = () => {
            debounceResize();
            themeList.find('.active').removeClass('active');
            const $this = $(this);
            $this.addClass('active');
            const themeKey = $this.attr('data-theme');
            setThemeCookie(themeKey);

            const resolvedKey = themeKey === AUTO_THEME ? resolveAutoTheme() : themeKey;
            switchToTheme(resolvedKey);
        }

        clearTimeout(deferredSwitchTheme)
        deferredSwitchTheme = setTimeout(() => {
            generateNewTheme()
        }, 250)

    });

    // Listen for system preference changes when in auto mode
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
            if (isAutoTheme()) {
                switchToTheme(resolveAutoTheme());
            }
        });
    }
});
