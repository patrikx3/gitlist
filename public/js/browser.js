$(function() {

    const menu = $('#p3x-gitlist-branch-list-container');
    if (menu.length > 0) {
//    const menuResponsive = require('./menu-responsive')
//    menuResponsive({
//        menuList: $('#p3x-gitlist-branch-list-dropdown-menu'),
//    })

        const List = require('list.js')

        const mainId = 'p3x-gitlist-branch-list'
        const branchListId = 'p3x-gitlist-list-branch'
        const tagListId = 'p3x-gitlist-list-tag'

        const debounce = require('lodash/debounce')

        let paths = window.gitlist.getPaths();

        let slice = 4
        if (window.gitlist.browse_type === 'tree') {
            slice = 3
        }
        paths = paths.slice(slice);
        let path = paths.join('/')
        if (path !== '') {
            path = `/${path}`
        }


        const baseUrl = `${window.gitlist.basepath}/${window.gitlist.repo}`
        const search_query = window.gitlist.search_query;
        const urls = {
            tree: (options) => {
                return `${baseUrl}/${options.checkout}`;
            },
            commits: (options) => {
                return `${baseUrl}/commits/${options.checkout}${path}`;
            },
            commit: (options) => {
                return `${baseUrl}/commits/${options.checkout}${path}`;
            },
            stats: (options) => {
                return `${baseUrl}/stats/${options.checkout}${path}`;
            },
            network: (options) => {
                return `${baseUrl}/network/${options.checkout}${path}`;
            },
            blob: (options) => {
                return `${baseUrl}/blob/${options.checkout}${path}`;
            },
            blame: (options) => {
                return `${baseUrl}/blame/${options.checkout}${path}`;
            },
            treegraph: (options) => {
                return `${baseUrl}/treegraph/${options.checkout}${path}`;
            },
            search: (options) => {
                return {
                    url: `${baseUrl}/tree/${options.checkout}/search?query=${search_query}`,
                    post: true,
                }
            },
            searchcommits: (options) => {
                return {
                    url: `${baseUrl}/commits/${options.checkout}/search?query=${search_query}`,
                    post: true,
                };
            },

        }

        window.gitlist.browserClick = (options) => {
            let result = urls[window.gitlist.browse_type](options);
            if (typeof result === 'string') {
                result = {
                    url: result
                }
            }
            if (!result.hasOwnProperty('post')) {
                location = result.url;
            } else {
                $.redirect(result.url);
            }
        }



        if ($(`#${mainId}`).length) {
            const listBranchOptions = {
                valueNames: ['item'],
                indexAsync: true,
            };

            const branchList = new List(branchListId, listBranchOptions);
            const tagList = new List(tagListId, listBranchOptions);
            const input = $('#p3x-gitlist-branch-list-search');

            const debouncedKeyup = debounce(() => {
                const search = input.val().trim();

                branchList.search(search)

                if (tagList.hasOwnProperty('search')) {
                    tagList.search(search)
                }
            }, 250)

            input.keyup(debouncedKeyup)



        }
    }

})
