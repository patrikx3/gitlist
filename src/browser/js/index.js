$(async function () {

    const id = 'p3x-gitlist-index'

    if ($(`#${id}`).length) {

        const { default: List} = await import (
            /* webpackChunkName: "list" */
            /* webpackPrefetch: true */
            '../list'
            )

        let paging = parseInt(window.gitlist.repoPaging)

        if (window.gitlist.isBot()) {
            paging = 0
        }

        const Cookies = require('js-cookie');

        const cookieName = 'p3x-gitlist-query-repo';
        const value = Cookies.get(cookieName)
        const input = $('[name="query-repo"]')
        const inputClear = $('#p3x-gitlist-index-list-clear');


        const times = $('.p3x-gitlist-index-repo-last-commit > .p3x-gitlist-index-repo-last-commit-time')
        const timesStamp = $('.p3x-gitlist-index-repo-last-commit > .p3x-gitlist-index-repo-last-commit-timestamp')
        const timesContainer = $('.p3x-gitlist-index-repo-last-commit')
        const timesContainerEmpty = $('.p3x-gitlist-index-repo-last-commit-empty')

        timesStamp.each((timeindex, time) => {
            const raw = $(time).text().trim()
            const txt = parseInt(raw, 10)
            if (raw === '' || !Number.isFinite(txt) || txt <= 0) {
                $(timesContainer[timeindex]).hide();
                $(timesContainerEmpty[timeindex]).show();
            } else {
                const dateIso = new Date(txt * 1000).toISOString();
                times[timeindex].innerText = window.gitlist.formatRelativeTime(dateIso)
            }
        })
        const inputHandler = () => {
            Cookies.set(cookieName, input.val(), window.gitlist.cookieSettings)
        }
        for (let ev of ['change', 'keydown']) {
            input.on(ev, inputHandler);
        }
        input.val(value);

        const searchColumns = ['p3x-gitlist-index-name', 'p3x-gitlist-index-description', 'p3x-gitlist-index-repo-last-commit-user'];
        const customSearch = function(searchString, columns) {
            // List.js escapes special chars for regex, but uses indexOf - so we unescape
            const query = searchString.replace(/\\(.)/g, '$1').toLowerCase().trim();
            if (!query) return;
            const words = query.split(/\s+/);
            for (let k = 0; k < list.items.length; k++) {
                const item = list.items[k];
                item.found = false;
                let allWordsFound = true;
                for (let i = 0; i < words.length; i++) {
                    let wordFound = false;
                    const values = item.values();
                    for (let j = 0; j < columns.length; j++) {
                        const val = values[columns[j]];
                        if (val != null) {
                            const text = (typeof val !== 'string' ? val.toString() : val).toLowerCase();
                            if (text.indexOf(words[i]) !== -1) {
                                wordFound = true;
                                break;
                            }
                        }
                    }
                    if (!wordFound) { allWordsFound = false; break; }
                }
                item.found = allWordsFound;
            }
        };

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

        // Custom search handler to fix List.js bug where special chars like - are regex-escaped
        const debounce = require('lodash/debounce');
        const searchHandler = debounce(() => {
            const val = input.val();
            if (val) {
                list.search(val, searchColumns, customSearch);
            } else {
                list.search();
            }
        }, 200);
        input.on('keyup', searchHandler);
        input.on('input', function() {
            if (input.val() === '') {
                list.search();
            }
        });

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
            list.search()
            if (showPaging) {
                $('.p3x-gitlist-index-pagination-container').show()
            }
        })

        sort()
        setInputSortOrder()
        //setInputSortSelect()

        if (value !== undefined) {
            list.search(value, searchColumns, customSearch);
        }
    }
})
