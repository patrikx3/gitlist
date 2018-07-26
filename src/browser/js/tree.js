$(() => {
    const $buttonNewFile = $('#p3x-gitlist-tree-new-file')

    if ($buttonNewFile.length === 0) {
        return
    }

    const path = window.gitlist.getPath()

    // <editor-fold desc="file">

    const $buttonNewFileModal = $('#p3x-gitlist-modal-new')
    const $formNewfile = $('#p3x-gitlist-modal-new-form')
    //const $buttonSubmitNewfile = $('#p3x-gitlist-modal-new-filename-confirm')
    const $inputNewfile = $('#p3x-gitlist-modal-new-filename')
    $inputNewfile.val(path)

    $buttonNewFile.click(() => {
        if (!window.gitlist.changeableCommit()) {
            return
        }
        $buttonNewFileModal.modal('show')
    })

    $formNewfile[0].addEventListener('submit', async(ev) => {
        ev.preventDefault();

        if($formNewfile[0].checkValidity() === false) {
            window.gitlist.invalidSnackbarCommit()
            return;
        }


        try {
            const inputs = window.gitlist.commitModelInputs['new']
            const json = await window.gitlist.gitHelperAjax({
                modal: $buttonNewFileModal,
                action: 'new-file-or-directory',
                inputs: inputs,
                filename: $inputNewfile.val(),
            })
            if (window.gitlist.gitNewPush(json)) {
                return
            }


        } catch(e) {
            window.gitlist.ajaxErrorHandler(e)
        }
        return false;


       // $buttonNewFileModal.modal('hide')
    }, false)

    // </editor-fold>

    // <editor-fold desc="upload">

    const $buttonNewBinary = $('#p3x-gitlist-tree-new-binary')
    const $buttonNewBinaryModal = $('#p3x-gitlist-modal-new-binary')
    const $formNewfileBinary = $('#p3x-gitlist-modal-new-binary-form')
    //const $buttonSubmitNewfileBinary = $('#p3x-gitlist-modal-new-filename-binary-confirm')
    const $inputNewfileBinaryFile = $('#p3x-gitlist-modal-new-binary-filename-binary')
    const $inputNewfileBinaryUpload = $('#p3x-gitlist-modal-new-binary-filename-binary-upload')
    const $inputNewfileBinaryOverride = $('#p3x-gitlist-modal-new-binary-filename-binary-override')
    $inputNewfileBinaryFile.val(path)

    let uploadBinaryFilename = ''

    $buttonNewBinary.click(() => {
        if (!window.gitlist.changeableCommit()) {
            return
        }
        $buttonNewBinaryModal.modal('show')
    })

    $inputNewfileBinaryUpload.change(() => {
        if ($inputNewfileBinaryUpload[0].files.length === 0) {
            $inputNewfileBinaryFile.val(`${path}`)
        } else {
            uploadBinaryFilename = $inputNewfileBinaryUpload[0].files[0].name
            $inputNewfileBinaryFile.val(`${path}${uploadBinaryFilename}`)
        }
    })


    $formNewfileBinary[0].addEventListener('submit', async function(ev) {
        ev.preventDefault();

        if($formNewfileBinary[0].checkValidity() === false) {
            window.gitlist.invalidSnackbarCommit()
            return;
        }

        try {
            // http://php.net/manual/en/features.file-upload.php#114004
            const inputs = window.gitlist.commitModelInputs['new-binary']
            const json = await window.gitlist.gitHelperAjax({
                upload: true,
                modal: $buttonNewBinaryModal,
                action: 'file-binary',
                inputs: inputs,
                filename: $inputNewfileBinaryFile.val(),
                fileUpload: $inputNewfileBinaryUpload,
                data: {
                    override: $inputNewfileBinaryOverride.is(`:checked`) ? 1 : 0,
                }
            })
            if (window.gitlist.gitNewPush(json)) {
                return
            }

        } catch(e) {
            window.gitlist.ajaxErrorHandler(e)
        }
        return false;
    }, false);

    /*
    $buttonSubmitNewfileBinary.click(async () => {
        if($formNewfileBinary[0].checkValidity() === false) {
            window.gitlist.invalidSnackbarCommit()
            return;
        }

        try {
            const inputs = window.gitlist.commitModelInputs['new-binary']
            const json = await window.gitlist.gitHelperAjax({
                upload: true,
                modal: $buttonNewBinaryModal,
                action: 'file-binary',
                inputs: inputs,
                filename: $inputNewfileBinaryFile.val(),
                fileUpload: $inputNewfileBinaryUpload,
                data: {
                    override: $inputNewfileBinaryOverride.val()
                }
            })
            if (window.gitlist.gitNewPush(json)) {
                return
            }

        } catch(e) {
            alert(e);
            window.gitlist.ajaxErrorHandler(e)
        }
        return false;
    })
    */


    // </editor-fold>


})

