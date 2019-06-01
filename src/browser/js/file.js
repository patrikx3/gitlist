$(function() {

    const Cookies = require('js-cookie')

    const errorHandler = window.gitlist.ajaxErrorHandler;

    const gitHelperAjax = window.gitlist.gitHelperAjax;

    const $modalDelete = $('#p3x-gitlist-modal-delete')


    if ($modalDelete.length === 0 ) {
        return;
    }

    const $buttonDelete = $('#p3x-gitlist-file-delete')
    const $buttonDeleteSure = $('#p3x-gitlist-modal-delete-confirm')
    const $formDeleteForm = $('#p3x-gitlist-modal-delete-form')

    const $deleteInputName = $('#p3x-gitlist-modal-delete-name');
    const $deleteInputEmail = $('#p3x-gitlist-modal-delete-email');
    const $deleteInputComment = $('#p3x-gitlist-modal-delete-comment');

    const inputs = {
        name: $deleteInputName,
        email: $deleteInputEmail,
        comment: $deleteInputComment,
    }


    $buttonDelete.click(() => {
        if (!window.gitlist.changeableCommit()) {
            return
        }
        $modalDelete.modal('show')
    })

    $formDeleteForm[0].addEventListener('submit', async(ev) => {
        ev.preventDefault();
        if($formDeleteForm[0].checkValidity() === false) {
            window.gitlist.invalidSnackbarCommit()
            return;
        }

        try {

            const json = await gitHelperAjax({
                modal: $modalDelete,
                action: 'delete',
                inputs: inputs,

            })
            if (window.gitlist.gitNewPush(json)) {
                return
            }


        } catch(e) {
            errorHandler(e)
        }

    })

    const sourceCode = $('#p3x-gitlist-file-editor');
    if (sourceCode.length) {

        let originalCode = '';
        let disableFull = false;
        const cookieName = 'p3x-gitlist-codemirror-size'
        const currentSizing = Cookies.get(cookieName)

        const $codeCodeMirroNormal = $('#p3x-gitlist-file-codemirror');
        const $codeCodeMirrorBig = $('#p3x-gitlist-file-codemirror-exceeded')
        const $codeCodeMirrorFullHeight = $('#p3x-gitlist-file-codemirror-full-height');

        const fullHeightCookieName = 'p3x-gitlist-codemirror-full-height';
        let fullHeightCookie = Cookies.get(fullHeightCookieName)

        if (fullHeightCookie !== undefined) {
            $codeCodeMirrorFullHeight.remove();
        }

        let value = sourceCode.text();
        const maxSize = window.gitlist.codemirror_full_limit;
        const size = Math.ceil(value.length / 1024);

        let cm;

        const createCodeMirror = () => {

            if (size > maxSize) {
                disableFull = true;
                $codeCodeMirroNormal.hide();
                $codeCodeMirrorBig.show();
            } else {
                $codeCodeMirroNormal.show();
            }

            const mode = sourceCode.attr('language');
            const pre = sourceCode.get(0);

            const $codeMirror = $('.CodeMirror');
            const $buttonScroll = $('#p3x-gitlist-file-button-scroll');
            const $buttonFull = $('#p3x-gitlist-file-button-full');
            const $buttonEdit = $('#p3x-gitlist-file-button-edit');
            const $buttonEditCancel = $('#p3x-gitlist-file-button-edit-cancel');
            const $buttonEditSave = $('#p3x-gitlist-file-button-edit-save')
            const $buttonDelete = $('#p3x-gitlist-file-delete')
            const codeMirrorHeight = window.gitlist.editorMaxHeight;

            //$buttonEditCancel.hide();
            //$buttonEditSave.hide();

            /*
            if (!window.gitlist.changeableCommit({ snack: false})) {
                $buttonEdit.hide();
                $buttonDelete.hide();
            } else {
                $buttonEdit.show();
                $buttonDelete.show();
            }
             */

            $buttonEdit.click(() => {

                if (!window.gitlist.changeableCommit()) {
                    return
                }

//                buttonEditRow.show();
                $buttonEdit.hide();
                $buttonDelete.hide()
                $buttonEditCancel.show();
                $buttonEditSave.show();
                gitlist.viewer.setOption('readOnly', false)
                originalCode = gitlist.viewer.getValue()
                gitlist.viewer.focus();
                $.snackbar({
                    content: `Editing`,
                })
            })

            const validateCodeIsSame = (snack = true) => {
                value = gitlist.viewer.getValue();
                if (originalCode === value) {
                    if (snack) {
                        $.snackbar({
                            content: 'The code has not changed. No saving.',
                        })
                    }
                    return true;
                }
                return false;
            }

            const close = () => {
                $buttonDelete.show()
                $buttonEdit.show();
                $buttonEditSave.hide();
                $buttonEditCancel.hide();
                gitlist.viewer.setOption('readOnly', true)
            }

            $buttonEditCancel.click(() => {
                if (!validateCodeIsSame(false)) {
                    gitlist.viewer.setValue(originalCode)
                    $.snackbar({
                        htmlAllowed: true,
                        content: 'The changes are reverted.',
                    })
                }
                close();
            })


            const $commitModal = $('#p3x-gitlist-modal-commit');
            $buttonEditSave.click(async () => {
                if (validateCodeIsSame()) {
                    return;
                }
                $commitModal.modal('show')
            })
            const $commitInputName = $('#p3x-gitlist-modal-commit-name');
            const $commitInputEmail = $('#p3x-gitlist-modal-commit-email');
            const $commitInputComment = $('#p3x-gitlist-modal-commit-comment');
            const $commitForm = $('#p3x-gitlist-modal-commit-form');

            const inputs = {
                name: $commitInputName,
                email: $commitInputEmail,
                comment: $commitInputComment,
            }

            //const $commitCommitPushButton = $('#p3x-gitlist-modal-commit-push')

            $commitForm[0].addEventListener('submit', async(ev) => {
                ev.preventDefault();

                if (validateCodeIsSame()) {
                    return;
                }

                if($commitForm[0].checkValidity() === false) {
                    window.gitlist.invalidSnackbarCommit()
                    return;
                }

                /*
                $.snackbar({
                    htmlAllowed: true,
                    content: ' <i class="fas fa-cog fa-spin"></i>&nbsp;Saving ...'
                })
                */

                try {

                    await gitHelperAjax({
                        modal: $commitModal,
                        action: 'save',
                        inputs: inputs,
                        data: {
                            value: value
                        },
                    })

                    originalCode = value;
                    close();
                    $.snackbar({
                        htmlAllowed: true,
                        content: '<i class="fas fa-check"></i>&nbsp;&nbsp;The file is saved.',
                    })
                } catch(e) {
                    errorHandler(e);
                }

            })

            const setScroll = () => {
                if (fullHeightCookie !== undefined) {
                    $codeCodeMirrorFullHeight.remove()
                }

                $codeCodeMirrorFullHeight.hide()
                $buttonFull.removeClass('active')
                $buttonScroll.addClass('active')
                $codeMirror.css('height', codeMirrorHeight)
                gitlist.viewer.setSize(null, codeMirrorHeight);

                if (!disableFull) {
                    Cookies.set(cookieName, 'scroll', window.gitlist.cookieSettings)
                }
            }

            $buttonScroll.click(setScroll)

            const setFull = () => {
                $codeCodeMirrorFullHeight.show()

                fullHeightCookie = true
                Cookies.set(fullHeightCookieName, true, window.gitlist.cookieSettingsShort)

                $buttonScroll.removeClass('active')
                $buttonFull.addClass('active')
                $codeMirror.css('height', 'auto')
                gitlist.viewer.setSize(null, '100%');
                Cookies.set(cookieName, 'full', window.gitlist.cookieSettings)
            }

            $buttonFull.click(setFull)
            cm  = CodeMirror(function(elt) {
                pre.parentNode.replaceChild(elt, pre);
            }, {
                styleActiveLine: true,
                styleSelectedText: true,
                value: value,
                lineNumbers: true,
                matchBrackets: true,
                lineWrapping: true,
                readOnly: true,
                mode: mode,
                theme: window.gitlist.getActualThemeCodemirror(),
            });
            gitlist.viewer = cm;
            const isReallyFull = currentSizing === 'full' && !disableFull;
            if (isReallyFull) {
                setFull()


            } else {
                setScroll()
            }

            const scrollToEditor = () => {
                let line = location.hash.startsWith('#L')  ? location.hash.substring(2) : undefined
                if (line !== undefined) {
                    setTimeout(() => {
                        line = parseInt(line)
                        cm.setSelection({
                            line: line - 1 ,
                            char: 0,
                        }, {
                            line: line - 1,
                            char: Number.MAX_SAFE_INTEGER
                        })
                        cm.scrollIntoView({line: line, char:0}, isReallyFull ? window.innerHeight / 2 : 100)
                        /*
                        const codes =  $('.CodeMirror-linenumber')
                        for(let codeLinenumber of codes) {
                            const $codeLinenumber = $(codeLinenumber)
                            const findLine = $codeLinenumber.text();
                            if(findLine === line ) {
                                break;
                            }
                        }
                        */
                    }, 250)
                }
            }

            if (location.search.includes('edit=1')) {
                setTimeout(() => {
                    $buttonEdit.click();
                    scrollToEditor();
                }, 500)
            } else {
                scrollToEditor();
            }

        }
        createCodeMirror();

        const $showSvgButton = $('#p3x-gitlist-file-svg-show')
        if ($showSvgButton.length > 0) {
            const $svgElements = $('.p3x-gitlist-file-svg-toggle')
            const $cmWrapper = $(cm.getWrapperElement())
            const $svgContentWrapper = $('#p3x-gitlist-file-svg-content')
            $showSvgButton.click(() => {
                if ($showSvgButton.hasClass('active')) {
                    $svgContentWrapper.empty()
                } else {
                    const image = `<img class="p3x-gitlist-max-width" src="data:image/svg+xml;base64,${btoa(cm.getValue())}"/>`
//                    console.log(image)
                    $svgContentWrapper.append(image)
                }
                $showSvgButton.toggleClass('active')
                $svgElements.toggle()
                $cmWrapper.toggle()

            })
        }

    }

})
