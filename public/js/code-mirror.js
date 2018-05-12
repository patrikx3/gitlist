document.addEventListener("DOMContentLoaded", function(event) {

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
                global.gitlist.setTheme()
            } else {
                setTimeout(function() {
                    setCodeMirror()
                })
            }
        }
        setCodeMirror()
    }
})
