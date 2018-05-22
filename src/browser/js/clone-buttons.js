$(function() {

    const cloneButtonSSH = $('#clone-button-ssh');
    const cloneButtonHTTP = $('#clone-button-http');
    const cloneInputSSH = $('#clone-input-ssh');
    const cloneInputHTTP = $('#clone-input-http');

    const debounce = require('lodash/debounce')
    const copy = debounce(($input) => {
        const input = $input[0];
        input.select()
        document.execCommand("Copy");
        $.snackbar({
            htmlAllowed: true,
            content: `
<strong>This URL is in your clipboard:</strong><br/>            
${input.value}`
        });
    }, 250);

    const copyCloneInputSSH = () => {
        copy(cloneInputSSH)
    }
    const copyCloneInputHTTP = () => {
        copy(cloneInputHTTP)
    }

    cloneInputSSH.click(copyCloneInputSSH)

    cloneInputHTTP.click(copyCloneInputHTTP)

    let cloneButtonSSHInit = false;
    cloneButtonSSH.click(function()
    {
        if(cloneButtonSSH.hasClass('active')) {
            return;
        }

        if (cloneButtonSSHInit) {
            copyCloneInputSSH();
        }
        cloneButtonSSHInit = true;
        cloneButtonSSH.addClass('active');
        cloneInputSSH.show();

        cloneButtonHTTP.removeClass('active');
        cloneInputHTTP.hide();
    });

    let cloneButtonHTTPInit = false;
    cloneButtonHTTP.click(function()
    {
        if(cloneButtonHTTP.hasClass('active')) {
            return;
        }

        if (cloneButtonHTTPInit) {
            copyCloneInputHTTP()
        }
        cloneButtonHTTPInit = true;
        cloneButtonHTTP.addClass('active');
        cloneInputHTTP.show();

        cloneButtonSSH.removeClass('active');
        cloneInputSSH.hide();
    });
    cloneButtonSSH.click();
    cloneButtonHTTP.click();
})
