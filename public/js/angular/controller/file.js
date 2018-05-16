document.addEventListener("DOMContentLoaded", function(event) {

    const sourceCode = $('#sourcecode');
    if (sourceCode.length) {

        let originalCode = '';

        const Cookies = require('js-cookie')
        const cookieName = 'p3x-gitlist-codemirror-size'
        const currentSizing = Cookies.get(cookieName)

        const codeSmall = $('#p3x-gitlist-file-small');
        const codeBig = $('#p3x-gitlist-file-codemirror');
        const value = sourceCode.text();
        const maxSize = 64;
        const size = Math.ceil(value.length / 1024);

        const defaultInfo = `You enabled the full mode instead of scroll mode.<br/>
This can be slow. Scroll mode is fast!<br/>
The maximum auto parsed code size is ${maxSize} KB.<br/> 
This code is ${size} KB. `

        const createCodeMirror = () => {
            codeSmall.hide();
            codeBig.show();
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
                    content: 'The editor is now editable.',
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
                    content: 'You have cancelled you changes.',
                })
            })

            buttonEditSave.click(() => {
//                buttonEditRow.show();

                $.snackbar({
                    content: 'This function is not implemented. In progress now.',
                })
            })


            const setScroll = () => {
                buttonFull.removeClass('active')
                buttonScroll.addClass('active')
                codeMirror.css('height', codeMirrorHeight)
                gitlist.viewer.setSize(null, codeMirrorHeight);
                Cookies.set(cookieName, 'scroll', window.gitlist.cookieSettings)
            }

            buttonScroll.click(setScroll)

            const setFull = () => {

                if (currentSizing !== 'full' && size > maxSize) {
                    $.snackbar({
                        htmlAllowed: true,
                        content: defaultInfo,
                        timeout: 30000,
                    });
                }
                setTimeout(() => {
                    buttonScroll.removeClass('active')
                    buttonFull.addClass('active')
                    codeMirror.css('height', 'auto')
                    gitlist.viewer.setSize(null, '100%');
                    Cookies.set(cookieName, 'full', window.gitlist.cookieSettings)
                }, 250)
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

        if (size > maxSize && currentSizing === 'full') {
            codeBig.hide();
            codeSmall.show();
            const codeSmallButton = $('#p3x-gitlist-file-small-button');

            const animate = 'animated bounce'
            let timeout;
            setTimeout(() => {
                $.snackbar({
                    htmlAllowed: true,
                    content: `${defaultInfo} Auro-parsing disabled!<br/>
To see the parsed code, click the <strong>Parse code</strong> button.
`,
                    timeout: 30000,
                });

                let flag = true;
                timeout = setInterval(() => {
                    if (flag) {
                        codeSmall.removeClass(animate)
                    } else {
                        codeSmall.addClass(animate)
                    }
                    flag = !flag;
                }, 2000)
                codeSmall.addClass(animate)

            }, 250)

            codeSmallButton.click(() => {
                clearInterval(timeout)
                codeBig.show();
                codeSmall.hide();
                createCodeMirror();
            })
        } else {
            createCodeMirror();
        }
    }
})

global.gitlist.ng.controller('file', function( $scope, $http ) {

    //console.log(window.gitlist)

})
