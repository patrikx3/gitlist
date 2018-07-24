
window.gitlist.isDark =(theme = window.gitlist.getActualTheme()) => {
    for(let i = 0; i < window.gitlist.dark.length; i++ ) {
        if (window.gitlist.dark[i] === theme) {
            return true;
        }
    }
    return false;
}



window.gitlist.getActualTheme = (theme = window.gitlist.getThemeCookie()) => {
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

let currentTheme;
let setTimeoutSwitch;
window.gitlist.setTheme = () => {
    if (window.gitlist.$body === undefined) {
        setTimeout(() => {
            window.gitlist.setTheme()
        })
        return;
    }
    const theme = window.gitlist.getActualTheme();
//    console.log('theming', 'currenTheme', currentTheme, 'new theme', theme);
    if (theme === currentTheme) {
//        console.log('same theme')
        return;
    }

    const diffButtons = $('.p3x-gitlist-diff-button.active');
    //console.log(diffButtons)
    for(let diffButton of diffButtons ) {
        diffButton.click();
    }

    const switchThemeActually = () => {
        currentTheme = theme;

        /*
        const themeFragmentFileCodeMirror  = (options) => {
            const {  theme } = options
            for(let cm of window.gitlist.fragmentFileCodeMirror) {
                cm.setOption("theme", theme);
            }
        }
        */

        let bodyAddClass
        let bodyRemoveClass
        let codeMirrorTheme
        if (window.gitlist.isDark(theme)) {
            bodyAddClass = 'p3x-gitlist-dark'
            bodyRemoveClass = 'p3x-gitlist-light'
            codeMirrorTheme = window.gitlist.codemirrorTheme.dark
        } else {
            bodyAddClass = 'p3x-gitlist-light'
            bodyRemoveClass = 'p3x-gitlist-dark'
            codeMirrorTheme = window.gitlist.codemirrorTheme.light

        }

        window.gitlist.$body.addClass(bodyAddClass)
        window.gitlist.$body.removeClass(bodyRemoveClass)
        if (gitlist.viewer !== undefined) {
            gitlist.viewer.setOption("theme", codeMirrorTheme);
        }
        if (gitlist.fragmentFileCodeMirror !== undefined) {
            gitlist.fragmentFileCodeMirror.setOption("theme", codeMirrorTheme);
        }


        window.gitlist.networkRedraw();
        window.gitlist.treegraph();
//    if (window.gitlist.lastloadSpan !== undefined && window.gitlist.lastloadSpan > 1000) {
        clearTimeout(setTimeoutSwitch)
        setTimeoutSwitch = setTimeout(() => {
            $('.p3x-gitlist-overlay').remove();
        }, 250)

    }
    //    console.log('p3x-gitlist switching theme')
//    }

    if (diffButtons.length > 0) {
        $.snackbar({
            content: `We hid the shown diffs, to make the theme switching faster.`,
            timeout: window.gitlist.snapckbarLongTimeout,
        });
        window.scrollTo(0, 0);
        setTimeout(switchThemeActually, 250)
    } else {
        switchThemeActually()
    }


}