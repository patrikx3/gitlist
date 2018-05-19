const themes = require('./themes.js')
window.gitlist.themes = themes;
const Cookies = require('js-cookie')
const themeCookieName = 'gitlist-bootstrap-theme'

function getThemeCookie() {
    const theme = Cookies.get(themeCookieName)
    return theme || 'bootstrap-cosmo';
}

gitlist.getThemeCookie = getThemeCookie;

document.addEventListener("DOMContentLoaded", function(event) {



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
    for(let key in themes) {
        const actualTheme = key.substring(10)
        const menu = '<li class="' + (currentCookie  === key ? 'active' : '') + '" style="text-transform: capitalize"><a href="#" data-theme="' + key + '" class="theme-link">' + actualTheme + '</a></li>';
        if (window.gitlist.isDark(actualTheme)) {
            darkMenu.push(menu)
        } else {
            lightMenu.push(menu)
        }
    }
    for(let menu of lightMenu) {
        themeList.append(menu);
    }
    themeList.append('<li class="divider"></li>')
    for(let menu of darkMenu) {
        themeList.append(menu);
    }

    gitlist.setTheme()

    const themesheet = $('#bootstrap-theme');

    $('.theme-link').click(function(event){

        event.preventDefault();

        const generateNewTheme = () => {
            debounceResize();
            themeList.find('.active').removeClass('active');
            const $this = $(this);
            $this.parent().addClass('active');
            const themeurl = themes[$this.attr('data-theme')];
            setThemeCookie($this.attr('data-theme'));
            const href = (gitlist.basepath === '/' ? '' : gitlist.basepath) + themeurl;
            themesheet.attr('href', href);
            gitlist.setTheme()
        }

        if (window.gitlist.lastloadSpan !== undefined && window.gitlist.lastloadSpan > 1000) {
            $('body').prepend(`
 <div class="p3x-gitlist-overlay">
        <div>
            <i class="fas fa-cog fa-spin fa-3x"></i>
        </div>
        <div>
            For a big page, it takes some time to switch the theme...<br/>
            The page rendering took about ${Math.ceil(window.gitlist.lastloadSpan / 1000)} seconds ...<br/>
            It means, the theme will take <strong>about</strong> the same time ...<br/>
            What is good, is that we are not reloading the server data.   
        </div>
</div>        
        `)
            setTimeout(() => {
                generateNewTheme()
            }, 250)
        } else {
            generateNewTheme();
        }
        
    });
// 12312312312adsasdasdasd
});
