$(function() {

    const List = require('list.js')

    const id = 'repositories'

    if ($(`#${id}`).length) {

        const Cookies = require('js-cookie');

        const cookieName = 'p3x-gitlist-query-repo';
        const value = Cookies.get(cookieName)
        const input = $('[name="query-repo"]')
        const inputClear = $('#p3x-gitlist-repo-list-clear');


        input.keypress(() => {
            Cookies.set(cookieName, input.val(), window.gitlist.cookieSettings)
        })
        input.val(value);
        console.log(input)

        const listOptions = {
            valueNames: ['name'],
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
