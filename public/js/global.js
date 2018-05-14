
window.gitlist.isDark =(theme) => {
    for(var i = 0; i < window.gitlist.dark.length; i++ ) {
        if (window.gitlist.dark[i] === theme) {
            return true;
        }
    }
    return false;
}

let $body;

window.gitlist.codemirrorTheme = {
    light: 'idea',
    dark: 'dracula',
}

window.gitlist.getActualTheme = () => {
    const theme = window.gitlist.getThemeCookie()
    const actualTheme = theme.split('-')[1]
    return actualTheme;
}

window.gitlist.getActualThemeCodemirror = () => {
    if (window.gitlist.isDark(window.gitlist.getActualTheme())) {
        return window.gitlist.codemirrorTheme.dark;
    } else {
        return window.gitlist.codemirrorTheme.light;
    }
}

window.gitlist.setTheme = () => {
    if ($body === undefined || window.gitlist.getThemeCookie === undefined) {
        setTimeout(() => {
            window.gitlist.setTheme()
        })
        return;
    }
    const theme = window.gitlist.getActualTheme();
    if (window.gitlist.isDark(theme)) {
        $body.addClass('p3x-gitlist-dark')
        $body.removeClass('p3x-gitlist-light')
        if (gitlist.viewer !== undefined) {
            gitlist.viewer.setOption("theme", window.gitlist.codemirrorTheme.dark);
        }
    } else {
        $body.addClass('p3x-gitlist-light')
        $body.removeClass('p3x-gitlist-dark')
        if (gitlist.viewer !== undefined) {
            gitlist.viewer.setOption("theme", window.gitlist.codemirrorTheme.light);
        }
    }
    let setTimeoutSwitch;
    if (window.gitlist.lastloadSpan !== undefined && window.gitlist.lastloadSpan > 1000) {
        clearTimeout(setTimeoutSwitch)
        setTimeoutSwitch = setTimeout(() => {
            $('.p3x-gitlist-overlay').remove();
        }, window.gitlist.lastloadSpan)
    }
}


$(function () {

    $body = $('body');

    const es = document.getElementsByTagName('a')
    for(let i=0; i<es.length; i++){
        es[i].addEventListener('click', function(e) {
            const href = e.target.getAttribute('href');
            if (href === null) {
                return;
            }
            if (href.startsWith('#')) {
                e.preventDefault()
                const el = document.getElementById(href.substring(1));
                if (el === null) {
                    return;
                }
                el.scrollIntoView({
                    behavior: 'smooth',
                    block: "center",

                })

            }
        })
    }

    $('.search').click(function (e) {
        e.stopPropagation();
    });

});

document.addEventListener("DOMContentLoaded", function() {
    if (window.gitlist.lastload !== undefined) {
        window.gitlist.lastloadSpan = Date.now() - window.gitlist.lastload;
    }
    $('.p3x-gitlist-overlay').remove();
})



global.gitlist.scrollHash = function(element, event) {
    const url = new URL(element.href)
    const id = url.hash.substring(1)
    const elfind = document.getElementById(id + '-parent')
    if (elfind === null) {
        return true;
    }
    elfind.scrollIntoView({
        behavior: 'smooth',
        block: "center",

    })

    if (event !== undefined) {
        event.preventDefault()
        if(history.pushState) {
            const pushState = location.pathname + url.hash;
            history.pushState(null, null, pushState);
        }
        else {
            location.hash = url.hash;
        }
    }
    return false;
}
