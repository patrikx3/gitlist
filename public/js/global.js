
window.gitlist.dark =  [
    'cyborg',
    'darkly',
    'slate',
    'superhero',
];

window.gitlist.isDark =(theme) => {
    for(var i = 0; i < window.gitlist.dark.length; i++ ) {
        if (window.gitlist.dark[i] === theme) {
            return true;
        }
    }
    return false;
}

let $body;

window.gitlist.setTheme = () => {
    if ($body === undefined) {
        setTimeout(() => {
            window.gitlist.setTheme(theme)
        })
        return;
    }
    const theme = global.gitlist.getThemeCookie()
    const actualTheme = theme.split('-')[1]
    if (window.gitlist.isDark(actualTheme)) {
        $body.addClass('p3x-gitlist-dark')
        $body.removeClass('p3x-gitlist-light')
        if (gitlist.viewer !== undefined) {
            gitlist.viewer.setOption("theme", 'blackboard');
        }
    } else {
        $body.addClass('p3x-gitlist-light')
        $body.removeClass('p3x-gitlist-dark')
        if (gitlist.viewer !== undefined) {
            gitlist.viewer.setOption("theme", 'default');
        }
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
