$(function () {

    const List = require('list.js')

    const id = 'p3x-gitlist-index'

    if ($(`#${id}`).length) {

        let paging = parseInt(window.gitlist.repoPaging)

        if (window.gitlist.isBot()) {
            paging = 0
        }

        const Cookies = require('js-cookie');

        const cookieName = 'p3x-gitlist-query-repo';
        const value = Cookies.get(cookieName)
        const input = $('[name="query-repo"]')
        const inputClear = $('#p3x-gitlist-index-list-clear');


        const moment = require('moment').default
        const times = $('.p3x-gitlist-index-repo-last-commit > .p3x-gitlist-index-repo-last-commit-time')
        const timesStamp = $('.p3x-gitlist-index-repo-last-commit > .p3x-gitlist-index-repo-last-commit-timestamp')
        const timesContainer = $('.p3x-gitlist-index-repo-last-commit')
        const timesContainerEmpty = $('.p3x-gitlist-index-repo-last-commit-empty')

        //console.info(times.length, timesStamp.length)

        timesStamp.each((timeindex, time) => {
            const txt = parseInt($(time).text())
            if (String(txt).trim() === '') {
                $(timesContainer[timeindex]).hide();
                $(timesContainerEmpty[timeindex]).show();
            } else {
                const timeMoment = moment(new Date(txt * 1000)).fromNow() //+ ' ' + moment(new Date(txt * 1000)).format('MMMM Do YYYY, h:mm:ss a')
                times[timeindex].innerText = timeMoment
            }
        })
        /*
        for (let timeindex in timesStamp) {
            console.log(timeindex)
            continue
            const time = timesStamp[timeindex]
            console.warn(time.innerText)
            const txt = parseInt(time.innerText)
            if (String(txt).trim() === '') {
                $(timesContainer[timeindex]).hide();
                $(timesContainerEmpty[timeindex]).show();
            } else {
                const timeMoment = moment(new Date(txt * 1000)).fromNow()
                times[timeindex].innerText = timeMoment
            }
        }
         */
        const inputHandler = () => {
            Cookies.set(cookieName, input.val(), window.gitlist.cookieSettings)
        }
        for (let ev of ['change', 'keydown']) {
            input.on(ev, inputHandler);
        }
        input.val(value);

        const listOptions = {
            valueNames: ['p3x-gitlist-index-name', 'p3x-gitlist-index-description', 'p3x-gitlist-index-repo-last-commit-timestamp', 'p3x-gitlist-index-repo-last-commit-user', 'p3x-gitlist-index-repo-last-commit-time'],
            indexAsync: false,
//            sortClass: 'p3x-gitlist-index-sort',
        };

        let showPaging = false;
        if (paging !== 0 && times.length > paging) {
            showPaging = true;
            listOptions.page = paging
            listOptions.pagination = [{
                name: "p3x-gitlist-index-pagination-top",
                paginationClass: "p3x-gitlist-index-pagination-top",
                innerWindow: 2,
                left: 1,
                right: 1
            }, {
                name: "p3x-gitlist-index-pagination-bottom",
                paginationClass: "p3x-gitlist-index-pagination-bottom",
                innerWindow: 2,
                left: 1,
                right: 1,
            }]
        } else {
            $('.p3x-gitlist-index-pagination-container').hide()
        }

        const list = new List(id, listOptions);
        const $pager = $('#p3x-gitlist-index-pagination-top')
        list.on('updated', () => {
            if (showPaging) {
                const items = $pager.find('li')
                if (items.length < 2) {
                    $('.p3x-gitlist-index-pagination-container').hide()
                } else {
                    $('.p3x-gitlist-index-pagination-container').show()
                }
            }
        })

        const inputSortOrder = $('#p3x-gitlist-index-list-sort-order')
        const inputSortSelect = $('#p3x-gitlist-index-list-sort-select')
        const cookieNameSortSelect = 'p3x-gitlist-repo-sort-select';
        const cookieNameSortOrder = 'p3x-gitlist-repo-sort-order';
        let settingSortSelect = Cookies.get(cookieNameSortSelect)
        let settingSortOrder = Cookies.get(cookieNameSortOrder)

        if (settingSortSelect === undefined) {
            settingSortSelect = 'p3x-gitlist-index-repo-last-commit-timestamp'
        }
        if (settingSortOrder === undefined) {
            settingSortOrder = 'desc'
        }

        const sort = () => {
            list.sort(settingSortSelect, {
                order: settingSortOrder
            })
            Cookies.set(cookieNameSortSelect, settingSortSelect, window.gitlist.cookieSettings)
            Cookies.set(cookieNameSortOrder, settingSortOrder, window.gitlist.cookieSettings)
        }

        const setInputSortOrder = () => {
            if (settingSortOrder === 'desc') {
                inputSortOrder.append(`<i class="fas fa-sort-amount-up"></i>`)
            } else {
                inputSortOrder.append(`<i class="fas fa-sort-amount-down"></i>`)
            }
        }

        inputSortSelect.val(settingSortSelect)


        inputSortSelect.on('change', () => {
            settingSortSelect = inputSortSelect.val()
            sort()
        })

        inputSortOrder.on('click', () => {
            inputSortOrder.empty()
            settingSortOrder = settingSortOrder === 'asc' ? 'desc' : 'asc'
            setInputSortOrder()
            sort()
        })

        // p3x-gitlist-index-name
        inputClear.on('click', () => {
            Cookies.remove(cookieName);
            input.val('');
            list.search('')
        })

        sort()
        setInputSortOrder()
        //setInputSortSelect()

        if (value !== undefined) {
            list.search(value);
        }
    }
})
