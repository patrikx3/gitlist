const Cookies = require('js-cookie')

$(function () {
    $('.p3x-gitlist-language-link').click(function (event) {
        event.preventDefault();
        const lang = $(this).attr('data-lang');
        Cookies.set('p3x-gitlist-language', lang, window.gitlist.cookieSettings);
        window.location.reload();
    });
});
