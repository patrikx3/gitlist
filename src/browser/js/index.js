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


        const repoCache = new Map();
        const populateRow = (tableEl, data) => {
            const link = tableEl.querySelector('.p3x-gitlist-index-repo-last-commit');
            const empty = tableEl.querySelector('.p3x-gitlist-index-repo-last-commit-empty');
            const loading = tableEl.querySelector('.p3x-gitlist-index-repo-last-commit-loading');
            if (loading) loading.style.display = 'none';
            if (!data || data.empty || !data.timestamp) {
                if (link) link.style.display = 'none';
                if (empty) empty.style.display = '';
                return;
            }
            const ts = parseInt(data.timestamp, 10);
            const tsSpan = tableEl.querySelector('.p3x-gitlist-index-repo-last-commit-timestamp');
            const timeSpan = tableEl.querySelector('.p3x-gitlist-index-repo-last-commit-time');
            const userSpan = tableEl.querySelector('.p3x-gitlist-index-repo-last-commit-user');
            const branchSpan = tableEl.querySelector('.p3x-gitlist-index-repo-last-commit-branch');
            if (tsSpan) tsSpan.textContent = ts;
            if (timeSpan && Number.isFinite(ts) && ts > 0) {
                const iso = new Date(ts * 1000).toISOString();
                timeSpan.textContent = window.gitlist.formatRelativeTime(iso);
            }
            if (userSpan) userSpan.textContent = data.user || '';
            if (branchSpan) branchSpan.textContent = data.branch || '';
            if (empty) empty.style.display = 'none';
            if (link) link.style.display = '';
        };
        const fetchRepoHead = (repoName) => {
            if (repoCache.has(repoName)) return Promise.resolve(repoCache.get(repoName));
            const base = window.gitlist.basepath || '';
            const url = `${base}/api/repo-head/${encodeURIComponent(repoName).replace(/%2F/g, '/')}`;
            const promise = fetch(url, { credentials: 'same-origin' })
                .then((resp) => {
                    if (!resp.ok) throw new Error('HTTP ' + resp.status);
                    return resp.json();
                })
                .then((data) => {
                    repoCache.set(repoName, data);
                    return data;
                })
                .catch((err) => {
                    repoCache.delete(repoName);
                    throw err;
                });
            repoCache.set(repoName, promise);
            return promise;
        };
        // Update both the row's DOM (for the visible page) AND the item's
        // List.js values (so sort works for items off the current page).
        const applyToItem = (item, data) => {
            if (item && item.elm) {
                populateRow(item.elm, data);
            }
            if (item && typeof item.values === 'function') {
                if (!data || data.empty || !data.timestamp) {
                    item.values({ 'p3x-gitlist-index-repo-last-commit-timestamp': '0' });
                    return;
                }
                const ts = parseInt(data.timestamp, 10);
                const iso = Number.isFinite(ts) && ts > 0 ? new Date(ts * 1000).toISOString() : '';
                item.values({
                    'p3x-gitlist-index-repo-last-commit-timestamp': String(ts),
                    'p3x-gitlist-index-repo-last-commit-user': data.user || '',
                    'p3x-gitlist-index-repo-last-commit-time': iso ? window.gitlist.formatRelativeTime(iso) : '',
                });
            }
        };

        // Iterate list.items (all repos, including off-page) — pagination removes
        // off-page items from the DOM, so a querySelectorAll-based loop would miss
        // 60/70 of them and the sort key (timestamp) would stay empty for them.
        const populateVisible = async () => {
            if (!list || !list.items || !list.items.length) return;
            const queue = [];
            for (const item of list.items) {
                let repoName = null;
                if (item.elm && item.elm.dataset && item.elm.dataset.repo) {
                    repoName = item.elm.dataset.repo;
                } else if (item.values) {
                    const v = item.values();
                    const name = v && v['p3x-gitlist-index-name'];
                    // strip_dot_git=false → DOM data-repo carries the .git suffix
                    if (name) repoName = name.endsWith('.git') ? name : name + '.git';
                }
                if (!repoName) continue;
                if (repoCache.has(repoName)) {
                    const cached = repoCache.get(repoName);
                    if (cached && typeof cached.then !== 'function') {
                        applyToItem(item, cached);
                    }
                    continue;
                }
                queue.push({ item, repoName });
            }
            if (queue.length === 0) return;
            let updatedAny = false;
            const concurrency = 6;
            const workers = Array.from({ length: concurrency }, async () => {
                while (queue.length) {
                    const job = queue.shift();
                    try {
                        const data = await fetchRepoHead(job.repoName);
                        applyToItem(job.item, data);
                        updatedAny = true;
                    } catch (e) {
                        if (job.item && job.item.elm) {
                            const loading = job.item.elm.querySelector('.p3x-gitlist-index-repo-last-commit-loading');
                            if (loading) loading.textContent = '—';
                        }
                        if (job.item && typeof job.item.values === 'function') {
                            job.item.values({ 'p3x-gitlist-index-repo-last-commit-timestamp': '0' });
                        }
                    }
                }
            });
            await Promise.all(workers);
            if (updatedAny) {
                // Resort with the now-correct timestamps. Avoid list.reIndex():
                // with pagination enabled List.js only keeps the current page in
                // DOM, and reIndex() rescans → drops off-page items.
                sort();
            }
        };
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

        const totalRepos = document.querySelectorAll('#p3x-gitlist-index [data-repo]').length;
        let showPaging = false;
        if (paging !== 0 && totalRepos > paging) {
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

        list.on('updated', () => {
            if (showPaging) {
                // Use list.matchingItems (search-filtered) instead of querying the DOM —
                // querying right after List.js rerenders is racy; matchingItems is canonical.
                const matching = (list.matchingItems && list.matchingItems.length) || list.size();
                if (matching > paging) {
                    $('.p3x-gitlist-index-pagination-container').show()
                } else {
                    $('.p3x-gitlist-index-pagination-container').hide()
                }
            }
            populateVisible();
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

        populateVisible();
    }
})
