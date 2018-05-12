document.addEventListener("DOMContentLoaded", function(event) {

    const themes = require('./themes.js')


    const themeList = $('#theme-list');

    const menuResponsive = require('./menu-responsive')
    const debounceResize = menuResponsive({
        menuList: themeList,
    })

    const Cookies = require('js-cookie')
    const themeCookieName = 'gitlist-bootstrap-theme'

    function getThemeCookie() {
        const theme = Cookies.get(themeCookieName)
        return theme || 'bootstrap-cosmo';
    }

    gitlist.getThemeCookie = getThemeCookie;

    function setThemeCookie(theme) {
        Cookies.set(themeCookieName, theme,  { expires: 3650, path: '/' });
    }


    const currentCookie = getThemeCookie('gitlist-bootstrap-theme');
    for(let key in themes) {
        const menu = '<li class="' + (currentCookie  === key ? 'active' : '') + '" style="text-transform: capitalize"><a href="#" data-theme="' + key + '" class="theme-link">' + key.substring(10) + '</a></li>';
        themeList.append(menu);
    }

    gitlist.setCodeMirrorTheme(getThemeCookie())

    const themesheet = $('#bootstrap-theme');

    $('.theme-link').click(function(event){
        debounceResize();
        themeList.find('.active').removeClass('active');
        const $this = $(this);
        $this.parent().addClass('active');
        const themeurl = themes[$this.attr('data-theme')];
        setThemeCookie($this.attr('data-theme'));
        themesheet.attr('href', (gitlist.basepath === '/' ? '' : gitlist.basepath) + themeurl);
        gitlist.setCodeMirrorTheme(getThemeCookie())
        event.preventDefault();

    });

});