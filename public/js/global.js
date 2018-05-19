let $body;
let $head;

const Cookies = require('js-cookie')

const scrollIntoViewOptions = {
    behavior: "instant",
    block: "start",
    inline: "start"
}
const navbarHeight = 80;
const scrollIntoView = (el) => {
    el.scrollIntoView(scrollIntoViewOptions)
    if ((window.innerHeight + window.scrollY) <= document.body.offsetHeight - navbarHeight ) {
        window.scrollBy(0,-navbarHeight )
    }
}

const regExpEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

window.gitlist.validate = {
    email: (email) => {
        return regExpEmail.test(String(email));
    }
}

window.gitlist.clearInput = (name) => {
    const input = $(`[name=${name}]`)
    input.val('')
    Cookies.set(`p3x-gitlist-${name}`, '', window.gitlist.cookieSettings)
    input.focus()
}

window.gitlist.setInputQuery = (name) => {
    const input = $(`[name=${name}]`)
    Cookies.set(`p3x-gitlist-${name}`, input.val(), window.gitlist.cookieSettings)
}

window.gitlist.isDark =(theme) => {
    for(var i = 0; i < window.gitlist.dark.length; i++ ) {
        if (window.gitlist.dark[i] === theme) {
            return true;
        }
    }
    return false;
}

window.gitlist.cookieSettings = {
    path: gitlist.basepath === '' ? '/' : gitlist.basepath,
    expires: 3650
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
    if ($body === undefined) {
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

const pushHash = (hash) => {
    if(history.pushState) {
        const pushState = location.pathname + hash;
        history.pushState(null, null, pushState);
    }
    else {
        location.hash = hash;
    }

}


global.gitlist.scrollHash = function(element, event) {
    const url = new URL(element.href)
    const id = url.hash.substring(1)
    const elfind = document.getElementById(id + '-parent')
    if (elfind === null) {
        return true;
    }
    scrollIntoView(elfind);

    if (event !== undefined) {
        event.preventDefault()
        pushHash(url.hash)
    }
    return false;
}

$(function () {
    $('.dropdown-toggle').dropdown();
    $body = $('body');
    $head = $('head')

    Object.values(window.gitlist.themes).forEach(css => {
        const cssPath = `${window.gitlist.basepath}${css}`;
        $head.append(`<link rel="prefetch" href="${cssPath}">`)
    })


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
                scrollIntoView(el);
                pushHash(href)
            }
        })
    }

    $('.search').click(function (e) {
        e.stopPropagation();
    });

    if (window.gitlist.lastload !== undefined) {
        window.gitlist.lastloadSpan = Date.now() - window.gitlist.lastload;
    }
    $('.p3x-gitlist-overlay').remove();
    global.gitlist.scrollHash(location)
});




