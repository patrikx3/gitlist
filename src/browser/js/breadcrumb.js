$(function() {
    const $gitActions = $('#p3x-gitlist-breadcrumb-git');

    if ($gitActions.length === 0) {
        return;
    }

    const $gitActionFetch = $('#p3x-gitlist-breadcrumb-git-fetch')

    $gitActionFetch.on('click', async() => {
        const url = `${window.gitlist.basepath}/${window.gitlist.repo}/git-helper/${window.gitlist.branch}/fetch-origin`
        try {
            const request = $.ajax({
                url: url,
                type: 'POST',
            })

            const response = await request;
            const json = JSON.parse(response)

            if (json.error === true) {
                window.gitlist.ajaxErrorHandler(json);
                return;
            }

            $.snackbar({
                htmlAllowed: true,
                content: json.message,
                timeout: window.gitlist.snapckbarLongTimeout,
            })
        } catch(e) {
            window.gitlist.ajaxErrorHandler(e);

        }
    })

})
