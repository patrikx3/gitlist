require('./global/cookie')
require('./global/hash')
require('./global/scroll')
require('./global/path')
require('./global/ajax')
require('./global/git')
require('./global/input')
require('./global/snackbar')
require('./global/theme')


$(function () {
    const Cookies = require('js-cookie')

    currentTheme = window.gitlist.getActualTheme(window.gitlist.loadTheme)

    $('.dropdown-toggle').dropdown();
    $('[data-toggle="tooltip"]').tooltip()

    window.gitlist.$body = $('body');

    const es = document.getElementsByTagName('a')
    for(let i=0; i<es.length; i++){
        es[i].addEventListener('click', function(e) {
            const href = e.target.getAttribute('href');
            if (href === null) {
                return;
            }
            if (href.startsWith('#')) {
                e.preventDefault()
                const hash = href.substring(1);
                const el = document.getElementById(hash);
                if (el === null) {
                    return;
                }
                window.gitlist.scrollIntoView(el);
                window.gitlist.pushHash(href)
            }
        })
    }

    /*
    $('.search').click(function (e) {
        e.stopPropagation();
    });
    */

    if (window.gitlist.lastload !== undefined) {
        window.gitlist.lastloadSpan = Date.now() - window.gitlist.lastload;
    }
    $('.p3x-gitlist-overlay').remove();
    window.gitlist.scrollHash(location)


    window.gitlist.networkRedraw();
    window.gitlist.treegraph();
    gitlist.setTheme()

    const snack = new URL(window.location).searchParams.get('snack')
    if (snack !== null) {
        $.snackbar({
            htmlAllowed: true,
            content: '<i class="fas fa-info-circle"></i>&nbsp;&nbsp;' + snack ,
            timeout: window.gitlist.snapckbarLongTimeout,
        })
    }

    const cookieShownChangelogName = 'p3x-gitlist-changelog-shown';
    const cookieShownChangelog = Cookies.get(cookieShownChangelogName)
    if (!cookieShownChangelog) {
        Cookies.set(cookieShownChangelogName, true, window.gitlist.cookieSettings)
        window.gitlist.changeLog()
    }

    $("#p3x-gitlist-to-top").click(function(event) {
        event.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });

});


$(window).scroll(function() {
    var height = $(window).scrollTop();
    if (height > 100) {
        $('#p3x-gitlist-to-top').fadeIn();
    } else {
        $('#p3x-gitlist-to-top').fadeOut();
    }
});
