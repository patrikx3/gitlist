$(function() {

    const List = require('list.js')

    const id = 'p3x-gitlist-index'

    if ($(`#${id}`).length) {

        const Cookies = require('js-cookie');

        const cookieName = 'p3x-gitlist-query-repo';
        const value = Cookies.get(cookieName)
        const input = $('[name="query-repo"]')
        const inputClear = $('#p3x-gitlist-index-list-clear');


        input.keypress(() => {
            Cookies.set(cookieName, input.val(), window.gitlist.cookieSettings)
        })
        input.val(value);

        const listOptions = {
            valueNames: ['name', 'description'],
            indexAsync: true,
        };
        const list = new List(id, listOptions);
        if (value !== undefined) {
            list.search(value);
        }

        inputClear.click(() => {
            Cookies.remove(cookieName);
            input.val('');
            list.search('')
        })

    }
})
