const Cookies = require('js-cookie')

$(function () {
    $('.p3x-gitlist-language-link').on('click', function (event) {
        event.preventDefault();
        const lang = $(this).attr('data-lang');
        if (lang === 'auto') {
            Cookies.remove('p3x-gitlist-language', window.gitlist.cookieSettings);
        } else {
            Cookies.set('p3x-gitlist-language', lang, window.gitlist.cookieSettings);
        }
        window.location.reload();
    });
});
