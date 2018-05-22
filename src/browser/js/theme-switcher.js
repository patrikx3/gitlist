const themes = require('./themes.js')
window.gitlist.themes = themes;
const Cookies = require('js-cookie')
const themeCookieName = 'gitlist-bootstrap-theme'

function getThemeCookie() {
    const theme = Cookies.get(themeCookieName)
    return theme || 'bootstrap-cosmo';
}

gitlist.getThemeCookie = getThemeCookie;

$(function () {

    const themeList = $('#theme-list');

    const menuResponsive = require('./menu-responsive')
    const debounceResize = menuResponsive({
        menuList: themeList,
    })


    function setThemeCookie(theme) {
        Cookies.set(themeCookieName, theme, window.gitlist.cookieSettings);
    }


    const currentCookie = getThemeCookie('gitlist-bootstrap-theme');
    const darkMenu = [];
    const lightMenu = []
    for (let key in themes) {
        const actualTheme = key.substring(10)
        const menu = '<li class="' + (currentCookie === key ? 'active' : '') + '" style="text-transform: capitalize"><a href="#" data-theme="' + key + '" class="theme-link">' + actualTheme + '</a></li>';
        if (window.gitlist.isDark(actualTheme)) {
            darkMenu.push(menu)
        } else {
            lightMenu.push(menu)
        }
    }
    for (let menu of lightMenu) {
        themeList.append(menu);
    }
    themeList.append('<li class="divider"></li>')
    for (let menu of darkMenu) {
        themeList.append(menu);
    }

    const themesheet = $('#bootstrap-theme');

    let deferredSwitchTheme;
    $('.theme-link').click(function (event) {

        event.preventDefault();

        const generateNewTheme = () => {
            debounceResize();
            themeList.find('.active').removeClass('active');
            const $this = $(this);
            $this.parent().addClass('active');
            const themeurl = themes[$this.attr('data-theme')];
            setThemeCookie($this.attr('data-theme'));
            const href = themeurl;
            const currentHref = themesheet.attr('href')
//            console.log('currentHref', currentHref, 'href', href)
            if (currentHref === href) {
                return;
            }

            $('body').prepend(`
 <div class="p3x-gitlist-overlay">
        <div>
            <i class="fas fa-cog fa-spin fa-4x"></i>
        </div>
        <br/>
        <div>
            Hang on, we are not reloading the server ...
        </div>
</div>        
        `)

//            console.log('p3x-gitlist themer swtich')

            themesheet.attr('href', href);
            gitlist.setTheme()
        }

        clearTimeout(deferredSwitchTheme)
        deferredSwitchTheme = setTimeout(() => {
            generateNewTheme()
        }, 250)

    });
});
