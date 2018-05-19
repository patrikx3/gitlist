document.addEventListener("DOMContentLoaded", function(event) {

    const sourceCode = $('#sourcecode');
    if (sourceCode.length) {

        let originalCode = '';
        let disableFull = false;
        const Cookies = require('js-cookie')
        const cookieName = 'p3x-gitlist-codemirror-size'
        const currentSizing = Cookies.get(cookieName)

        const codeCodeMirroNormal = $('#p3x-gitlist-file-codemirror');
        const codeCodeMirrorBig = $('#p3x-gitlist-file-codemirror-exceeded')
        const value = sourceCode.text();
        const maxSize = window.gitlist.codemirror_full_limit;
        const size = Math.ceil(value.length / 1024);

        const createCodeMirror = () => {

            if (size > maxSize) {
                disableFull = true;
                codeCodeMirroNormal.hide();
                codeCodeMirrorBig.show();
            } else {
                codeCodeMirroNormal.show();
            }

            const mode = sourceCode.attr('language');
            const pre = sourceCode.get(0);

            const codeMirror = $('.CodeMirror');
            const buttonScroll = $('#p3x-gitlist-file-button-scroll');
            const buttonFull = $('#p3x-gitlist-file-button-full');
            const buttonEdit = $('#p3x-gitlist-file-button-edit');
            const buttonEditCancel = $('#p3x-gitlist-file-button-edit-cancel');
            const buttonEditSave = $('#p3x-gitlist-file-button-edit-save')
//            const buttonEditRow = $('#p3x-gitlist-file-button-edit-row');
            const codeMirrorHeight = 300;

            buttonEditCancel.hide();
            buttonEditSave.hide();

            buttonEdit.click(() => {
//                buttonEditRow.show();
                buttonEdit.hide();
                buttonEditCancel.show();
                buttonEditSave.show();
                gitlist.viewer.setOption('readOnly', false)
                originalCode = gitlist.viewer.getValue()
                gitlist.viewer.focus();
                $.snackbar({
                    content: 'Editing',
                })
            })

            buttonEditCancel.click(() => {
//                buttonEditRow.hide();
                buttonEdit.show();
                buttonEditSave.hide();
                buttonEditCancel.hide();
                gitlist.viewer.setValue(originalCode)
                gitlist.viewer.setOption('readOnly', true)
                $.snackbar({
                    content: 'Cancelled editing',
                })
            })

            buttonEditSave.click(() => {
//                buttonEditRow.show();
                $.snackbar({
                    content: 'Not implemented.',
                })
            })

            const setScroll = () => {
                buttonFull.removeClass('active')
                buttonScroll.addClass('active')
                codeMirror.css('height', codeMirrorHeight)
                gitlist.viewer.setSize(null, codeMirrorHeight);

                if (!disableFull) {
                    Cookies.set(cookieName, 'scroll', window.gitlist.cookieSettings)
                }
            }

            buttonScroll.click(setScroll)

            const setFull = () => {
                buttonScroll.removeClass('active')
                buttonFull.addClass('active')
                codeMirror.css('height', 'auto')
                gitlist.viewer.setSize(null, '100%');
                Cookies.set(cookieName, 'full', window.gitlist.cookieSettings)
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
            if (currentSizing === 'full' && !disableFull) {
                setFull()
            } else {
                setScroll()
            }

            if (location.search.includes('edit=1')) {
                setTimeout(() => {
                    buttonEdit.click();
                }, 500)
            }

        }
        createCodeMirror();

    }

})
