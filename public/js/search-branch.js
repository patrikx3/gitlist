document.addEventListener("DOMContentLoaded", function(event) {


//    const menuResponsive = require('./menu-responsive')
//    menuResponsive({
//        menuList: $('#p3x-gitlist-branch-list-dropdown-menu'),
//    })

    const List = require('list.js')

    const mainId = 'p3x-gitlist-branch-list'
    const branchListId = 'p3x-gitlist-list-branch'
    const tagListId = 'p3x-gitlist-list-tag'

    const debounce = require('lodash/debounce')

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

})
