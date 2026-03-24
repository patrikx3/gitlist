const Cookies = require('js-cookie')

window.gitlist.gitNewPush = (json) => {
    if (typeof json === 'object' && json.hasOwnProperty('last-commit')) {
        const newLocation = `${window.gitlist.basepath}/${window.gitlist.repo}/commit/${json['last-commit']}?snack=` + encodeURIComponent(window.gitlist.t('js.new_push_snack')) + `&delete-branch=${window.gitlist.branch}`
        // console.log(json, newLocation)

        location = newLocation
        return true;
    }
    return false;
}

window.gitlist.changeableCommit = (opts = {snack: true}) => {
    if (!window.gitlist.branches.includes(window.gitlist.branch)) {
        let branchInfo;
        if (window.gitlist.branches.length === 1) {
            branchInfo = window.gitlist.t('js.only_branches_changeable').replace('{{ branches }}', `<strong>${window.gitlist.branches.join(', ')}</strong>`)
        } else {
            branchInfo = window.gitlist.t('js.only_branches_changeable').replace('{{ branches }}', `<strong>${window.gitlist.branches.join(', ')}</strong>`)
        }
        if (opts.snack) {
            $.snackbar({
                htmlAllowed: true,
                content: window.gitlist.t('js.branch_not_changeable').replace('{{ branch }}', `<strong>${window.gitlist.branch}</strong>`) + `<br/>${branchInfo}`,
                timeout: window.gitlist.snapckbarLongTimeout,
            })
        }
        return false;
    }
    {
        return true
    }
}

window.gitlist.preloadCommitValues = (options) => {
    const {type} = options

    const inputs = {
        name: $(`#p3x-gitlist-modal-${type}-name`),
        email: $(`#p3x-gitlist-modal-${type}-email`),
        comment: $(`#p3x-gitlist-modal-${type}-comment`),
    }

    for (let inputKey in inputs) {
        const input = inputs[inputKey]
        //console.log(inputKey, commentCookie)
        let cookieName = `p3x-gitlist-commit-${inputKey}`;
        if (inputKey === 'comment') {
            cookieName = `p3x-gitlist-commit-${type}-${inputKey}`;
        }
        const cookie = Cookies.get(cookieName)
        if (cookie) {
            input.val(cookie.trim());
        }
        input.change(() => {
            const val = input.val().trim();
            Cookies.set(cookieName, val, window.gitlist.cookieSettings);
            input.val(val);
        })
    }
    window.gitlist.commitModelInputs[type] = inputs
}

window.gitlist.gitHelperAjax = async (options) => {
    const {modal, action, inputs, upload, fileUpload} = options
    let {data, filename} = options

    if (filename === undefined) {
        filename = window.gitlist.getPath();

    }
    const defaultData = {
        email: inputs.email.val(),
        name: inputs.name.val(),
        comment: inputs.comment.val(),
    }

    if (data !== undefined) {
        data = Object.assign(defaultData, data)
    } else {
        data = defaultData
    }
    data.filename = filename

    modal.modal('hide')

    const url = `${window.gitlist.basepath}/${window.gitlist.repo}/git-helper/${window.gitlist.branch}/${action}`

    let request;
    if (upload === true) {
        const uploadData = new FormData();
        for (let dataKey of Object.keys(data)) {
            uploadData.append(dataKey, data[dataKey]);
        }
//        console.log(fileUpload)
        uploadData.append('upload-file', fileUpload[0].files[0], data.filename);

        request = $.ajax({
            url: url,
            type: 'POST',
            data: uploadData,
            processData: false,
            contentType: false,
        })
    } else {
        request = $.ajax({
            url: url,
            type: 'POST',
            data: data,
        })
    }

    const response = await request;

    const json = JSON.parse(response)

    if (json.error === true) {
        window.gitlist.ajaxErrorHandler(json);
    }

    if (json.hasOwnProperty('outputs') && json.outputs.length > 1 && typeof json.outputs[json.outputs.length - 1] === 'string') {
        const message = json.outputs[json.outputs.length - 1].trim();
        if (message !== '') {
            $.snackbar({
                htmlAllowed: true,
                content: message,
                timeout: window.gitlist.snapckbarLongTimeout,
            })
        }
    }

    return json;
}
