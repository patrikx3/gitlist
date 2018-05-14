const Cookies = require('js-cookie')
const themeCookieName = 'gitlist-bootstrap-theme'

function getThemeCookie() {
    const theme = Cookies.get(themeCookieName)
    return theme || 'bootstrap-cosmo';
}

gitlist.getThemeCookie = getThemeCookie;

document.addEventListener("DOMContentLoaded", function(event) {

    const themes = require('./themes.js')


    const themeList = $('#theme-list');

    const menuResponsive = require('./menu-responsive')
    const debounceResize = menuResponsive({
        menuList: themeList,
    })


    function setThemeCookie(theme) {
        Cookies.set(themeCookieName, theme,  { expires: 3650, path: '/' });
    }


    const currentCookie = getThemeCookie('gitlist-bootstrap-theme');
    for(let key in themes) {
        const menu = '<li class="' + (currentCookie  === key ? 'active' : '') + '" style="text-transform: capitalize"><a href="#" data-theme="' + key + '" class="theme-link">' + key.substring(10) + '</a></li>';
        themeList.append(menu);
    }

    gitlist.setTheme()

    const themesheet = $('#bootstrap-theme');

    $('.theme-link').click(function(event){

        if (window.gitlist.lastloadSpan !== undefined && window.gitlist.lastloadSpan > 1000) {
            $('body').prepend(`
 <div class="p3x-gitlist-overlay">
        <div>
            <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
        </div>
        <div>
            For a big page, it takes some time to switch the theme...<br/>
            The page rendering took about ${Math.ceil(window.gitlist.lastloadSpan / 1000)} seconds ...<br/>
            It means the theme will take <strong>about</strong> the same time ...
            
        </div>
</div>        
        `)
        }

        debounceResize();
        themeList.find('.active').removeClass('active');
        const $this = $(this);
        $this.parent().addClass('active');
        const themeurl = themes[$this.attr('data-theme')];
        setThemeCookie($this.attr('data-theme'));
        const href = (gitlist.basepath === '/' ? '' : gitlist.basepath) + themeurl;
        themesheet.attr('href', href);
        gitlist.setTheme()
        event.preventDefault();

    });

});