$(function() {

    const List = require('list.js')

    const id = 'p3x-gitlist-index'

    if ($(`#${id}`).length) {

        const Cookies = require('js-cookie');

        const cookieName = 'p3x-gitlist-query-repo';
        const value = Cookies.get(cookieName)
        const input = $('[name="query-repo"]')
        const inputClear = $('#p3x-gitlist-index-list-clear');


        const moment = require('moment')
        const times = $('.p3x-gitlist-index-repo-last-commit > .p3x-gitlist-index-repo-last-commit-time')
        for(let time of times) {
            const timeMoment = moment(time.innerText).fromNow()
            time.innerText = timeMoment
        }

        input.keypress(() => {
            Cookies.set(cookieName, input.val(), window.gitlist.cookieSettings)
        })
        input.change(() => {
            Cookies.set(cookieName, input.val(), window.gitlist.cookieSettings)
        })
        input.keydown(() => {
            Cookies.set(cookieName, input.val(), window.gitlist.cookieSettings)
        })
        input.keydown(() => {
            Cookies.set(cookieName, input.val(), window.gitlist.cookieSettings)
        })
        input.val(value);

        const listOptions = {
            valueNames: ['p3x-gitlist-index-name', 'p3x-gitlist-index-description', 'p3x-gitlist-index-repo-last-commit'],
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
