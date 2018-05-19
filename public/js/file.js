$(function() {

    const sourceCode = $('#sourcecode');
    if (sourceCode.length) {

        const commit = window.gitlist.commit;
        const branches = window.gitlist.branches;

        let originalCode = '';
        let disableFull = false;
        const Cookies = require('js-cookie')
        const cookieName = 'p3x-gitlist-codemirror-size'
        const currentSizing = Cookies.get(cookieName)

        const codeCodeMirroNormal = $('#p3x-gitlist-file-codemirror');
        const codeCodeMirrorBig = $('#p3x-gitlist-file-codemirror-exceeded')
        let value = sourceCode.text();
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
            const codeMirrorHeight = 300;

            buttonEditCancel.hide();
            buttonEditSave.hide();

            buttonEdit.click(() => {

                if (!branches.includes(commit)) {
                    let branchInfo;
                    if (branches.length === 1) {
                        branchInfo = `Only the <strong>${branches.join(', ')}</strong> branch is editable.`
                    }  else {
                        branchInfo = `Only the <strong>${branches.join(', ')}</strong> branches are editable.`
                    }
                    $.snackbar({
                        htmlAllowed: true,
                        content: `This commit <strong>${commit}</strong> is not editable.<br/>
${branchInfo}
`,
                        timeout: window.gitlist.snapckbarLongTimeout,
                    })

                    return;
                }

//                buttonEditRow.show();
                buttonEdit.hide();
                buttonEditCancel.show();
                buttonEditSave.show();
                gitlist.viewer.setOption('readOnly', false)
                originalCode = gitlist.viewer.getValue()
                gitlist.viewer.focus();
                $.snackbar({
                    content: `Editing`,
                })
            })

            buttonEditCancel.click(() => {
                buttonEdit.show();
                buttonEditSave.hide();
                buttonEditCancel.hide();
                gitlist.viewer.setValue(originalCode)
                gitlist.viewer.setOption('readOnly', true)
                $.snackbar({
                    content: 'Cancelled editing, you changes reverted.',
                })
            })

            let filename = location.pathname.split('/');
            filename = filename.slice(4).join('/');

            const errorHandler = (e) => {
                $.snackbar({
                    htmlAllowed: true,
                    content: e.message,
                    timeout: window.gitlist.snapckbarLongTimeout,
                })
                console.error(e);
            }

            const validateCodeIsSame = () => {
                value = gitlist.viewer.getValue();
                if (originalCode === value) {
                    $.snackbar({
                        content: 'The code has not changed. No saving.',
                    })
                    return true;
                }
                return false;
            }

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

            for(let inputKey in inputs) {
                const input = inputs[inputKey]
                const cookieName = `p3x-gitlist-commit-${inputKey}`;
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

            const commitCommitPushButton = $('#p3x-gitlist-modal-commit-push')

            commitCommitPushButton.click( async () => {

                if (validateCodeIsSame()) {
                    return;
                }

                if(commitForm[0].checkValidity() === false) {
                    $.snackbar({
                        content: 'The commit form data is invalid..'
                    })
                    return;
                }

                $.snackbar({
                    htmlAllowed: true,
                    content: ' <i class="fas fa-cog fa-spin"></i>&nbsp;Saving ...'
                })

                try {
                    const url = `${window.gitlist.basepath}/${window.gitlist.repo}/git-helper/${window.gitlist.branch}/save`
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

                    if (json.output !== '') {
                        $.snackbar({
                            htmlAllowed: true,
                            content: json.output,
                        })
                    }
                    if (json.error === true) {
                        errorHandler(json);
                    } else {
                        originalCode = value;
                        $.snackbar({
                            htmlAllowed: true,
                            content: '<i class="fas fa-check"></i>&nbsp;&nbsp;The file is saved.',
                        })
                    }
                    commitModal.modal('hide');
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

            const cm  = CodeMirror(function(elt) {
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
                const line = location.hash.startsWith('#L')  ? location.hash.substring(2) : undefined
                if (line !== undefined) {
                    setTimeout(() => {
                        cm.scrollIntoView({line: line, char:0}, isReallyFull ? window.innerHeight / 2 : 100)
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

    }

})
