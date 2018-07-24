window.gitlist.ajaxErrorHandler = (e) => {

    if (e.hasOwnProperty('status') && e.status !== 200 && typeof e.status !== 'string') {
        $.snackbar({
            htmlAllowed: true,
            content: e.statusText,
            timeout: window.gitlist.snapckbarLongTimeout,
        })

    } else  {
        $.snackbar({
            htmlAllowed: true,
            content: e.message,
            timeout: window.gitlist.snapckbarLongTimeout,
        })
    }
    console.error(e);
}


