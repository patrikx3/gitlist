$(function() {


    const commit = window.gitlist.commit;
    const branches = window.gitlist.branches;

    const Cookies = require('js-cookie')

    const errorHandler = window.gitlist.ajaxErrorHandler;

    const invalidSnackbarCommit = () => {
        $.snackbar({
            content: 'The commit form data is invalid..'
        })
    }

    const validCommit = () => {
        if (!branches.includes(commit)) {
            let branchInfo;
            if (branches.length === 1) {
                branchInfo = `Only the <strong>${branches.join(', ')}</strong> branch is editable.`
            }  else {
                branchInfo = `Only the <strong>${branches.join(', ')}</strong> branches are editable.`
            }
            $.snackbar({
                htmlAllowed: true,
                content: `This commit <strong>${commit}</strong> is not changeable.<br/>
${branchInfo}
`,
            })

            return false;
        } {
            return true
        }
    }

    const preLoadCommits = (options) => {
        const { inputs, commentCookie } = options
        for(let inputKey in inputs) {
            const input = inputs[inputKey]
            //console.log(inputKey, commentCookie)
            let cookieName = `p3x-gitlist-commit-${inputKey}`;
            if (inputKey === 'comment') {
                cookieName = `p3x-gitlist-commit-${commentCookie }-${inputKey}`;
            }
            const cookie = Cookies.get(cookieName)
            if (cookie) {
                input.val(cookie.trim());
            }
            input.change(() => {
                const val = input.val().trim();
                Cookies.set(cookieName, val);
                input.val(val);
            })
        }
    }

    const paths = window.gitlist.getPaths();
    filename = paths.slice(4).join('/');

    const gitHelperAjax = async (options) => {
        const { modal, action, inputs, value } = options

        modal.modal('hide')

        const url = `${window.gitlist.basepath}/${window.gitlist.repo}/git-helper/${window.gitlist.branch}/${action}`
        const response = await $.ajax({
            url: url,
            type: 'POST',
            data: {
                value: value,
                email: inputs.email.val(),
                name: inputs.name.val(),
                comment: inputs.comment.val(),
                filename: filename
            }
        })
        const json = JSON.parse(response)

        if (json.hasOwnProperty('output') && json.output !== '') {
            $.snackbar({
                htmlAllowed: true,
                content: json.output,
            })
        }
        if (json.error === true) {
            errorHandler(json);
        }
        return json;
    }

    const $modalDelete = $('#p3x-gitlist-modal-delete')
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
    preLoadCommits({
        inputs: inputs,
        commentCookie: 'delete'
    })

    $buttonDelete.click(() => {
        if (!validCommit()) {
            return
        }
        $modalDelete.modal('show')
    })


    $buttonDeleteSure.click(async() => {
        if($formDeleteForm[0].checkValidity() === false) {
            invalidSnackbarCommit()
            return;
        }

        try {
            const json = await gitHelperAjax({
                modal: $modalDelete,
                action: 'delete',
                inputs: inputs,
                value: undefined,
            })
            const newLocation = `${window.gitlist.basepath}/${paths[1]}/commit/${json.output}?snack=` + encodeURIComponent(`The "${filename}" file is deleted. You are switched to the page where you can see the  last commit.`)
            // console.log(json, newLocation)
            location = newLocation
            /*
            close();
            $.snackbar({ewLo
                htmlAllowed: true,
                content: '<i class="fas fa-check"></i>&nbsp;&nbsp;The file is saved.',
            })
            */

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

        const codeCodeMirroNormal = $('#p3x-gitlist-file-codemirror');
        const codeCodeMirrorBig = $('#p3x-gitlist-file-codemirror-exceeded')
        let value = sourceCode.text();
        const maxSize = window.gitlist.codemirror_full_limit;
        const size = Math.ceil(value.length / 1024);

        let cm;

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
            const buttonDelete = $('#p3x-gitlist-file-delete')
            const codeMirrorHeight = window.gitlist.editorMaxHeight;

            buttonEditCancel.hide();
            buttonEditSave.hide();

            buttonEdit.click(() => {

                if (!validCommit()) {
                    return
                }

//                buttonEditRow.show();
                buttonEdit.hide();
                buttonDelete.hide()
                buttonEditCancel.show();
                buttonEditSave.show();
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
                buttonDelete.show()
                buttonEdit.show();
                buttonEditSave.hide();
                buttonEditCancel.hide();
                gitlist.viewer.setOption('readOnly', true)
            }

            buttonEditCancel.click(() => {
                if (!validateCodeIsSame(false)) {
                    gitlist.viewer.setValue(originalCode)
                    $.snackbar({
                        htmlAllowed: true,
                        content: 'The changes are reverted.',
                    })
                }
                close();
            })


            const commitModal = $('#p3x-gitlist-modal-commit');
            buttonEditSave.click(async () => {
                if (validateCodeIsSame()) {
                    return;
                }
                commitModal.modal('show')
            })
            const commitInputName = $('#p3x-gitlist-modal-commit-name');
            const commitInputEmail = $('#p3x-gitlist-modal-commit-email');
            const commitInputComment = $('#p3x-gitlist-modal-commit-comment');
            const commitForm = $('#p3x-gitlist-modal-commit-form');

            const inputs = {
                name: commitInputName,
                email: commitInputEmail,
                comment: commitInputComment,
            }

            preLoadCommits({
                inputs: inputs,
                commentCookie: 'change'
            })

            const commitCommitPushButton = $('#p3x-gitlist-modal-commit-push')

            commitCommitPushButton.click( async () => {

                if (validateCodeIsSame()) {
                    return;
                }

                if(commitForm[0].checkValidity() === false) {
                    invalidSnackbarCommit()
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
                        modal: commitModal,
                        action: 'save',
                        inputs: inputs,
                        value: value,
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
                    buttonEdit.click();
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
