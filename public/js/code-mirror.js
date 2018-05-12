document.addEventListener("DOMContentLoaded", function(event) {
    function setCodeMirrorTheme(theme) {
        if (gitlist.viewer === undefined) {
            return;
        }
        const actualTheme = theme.split('-')[1]
        if (window.gitlist.isDark(actualTheme)) {
            gitlist.viewer.setOption("theme", 'blackboard');
        } else {
            gitlist.viewer.setOption("theme", 'default');
        }
    }
    window.gitlist.setCodeMirrorTheme = setCodeMirrorTheme;

    const sourceCode = $('#sourcecode');
    if (sourceCode.length) {
        const value = sourceCode.text();
        const mode = sourceCode.attr('language');
        const pre = sourceCode.get(0);

        gitlist.viewer = CodeMirror(function(elt) {
            pre.parentNode.replaceChild(elt, pre);
        }, {
            value: value,
            lineNumbers: true,
            matchBrackets: true,
            lineWrapping: true,
            readOnly: true,
            mode: mode,
        });

        const setCodeMirror = function() {
            if (gitlist.getThemeCookie !== undefined) {
                setCodeMirrorTheme(gitlist.getThemeCookie())
            } else {
                setTimeout(function() {
                    setCodeMirror()
                }, 250)
            }
        }
        setCodeMirror()
    }
})
