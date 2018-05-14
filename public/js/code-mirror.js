document.addEventListener("DOMContentLoaded", function(event) {


    const sourceCode = $('#sourcecode');
    if (sourceCode.length) {
        const value = sourceCode.text();
        const mode = sourceCode.attr('language');
        const pre = sourceCode.get(0);

        const codeMirror = $('.CodeMirror');
        const buttonScroll = $('#p3x-gitlist-file-button-scroll');
        const buttonFull = $('#p3x-gitlist-file-button-full');
        const codeMirrorHeight = 300;

        const Cookies = require('js-cookie')
        const cookieName = 'p3x-gitlist-codemirror-size'

        const currentSizing = Cookies.get(cookieName)
        const cookieSettings = {
            path: '/',
            expires: 3650
        }

        const setScroll = () => {
            buttonFull.removeClass('active')
            buttonScroll.addClass('active')
            codeMirror.css('height', codeMirrorHeight)
            gitlist.viewer.setSize(null, codeMirrorHeight);
            Cookies.set(cookieName, 'scroll', cookieSettings)
        }

        buttonScroll.click(setScroll)

        const setFull = () => {
            buttonScroll.removeClass('active')
            buttonFull.addClass('active')
            codeMirror.css('height', 'auto')
            gitlist.viewer.setSize(null, '100%');
            Cookies.set(cookieName, 'full', cookieSettings)
        }

        buttonFull.click(setFull)

        gitlist.viewer = CodeMirror(function(elt) {
            pre.parentNode.replaceChild(elt, pre);
        }, {
            value: value,
            lineNumbers: true,
            matchBrackets: true,
            lineWrapping: true,
            readOnly: true,
            mode: mode,
            theme: window.gitlist.getActualThemeCodemirror(),
        });
        if (currentSizing === 'full') {
            setFull()
        } else {
            setScroll()
        }
    }
})
