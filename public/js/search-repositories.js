document.addEventListener("DOMContentLoaded", function(event) {

    const List = require('list.js')

    const id = 'repositories'

    if ($(`#${id}`).length) {
        const listOptions = {
            valueNames: ['name'],
            indexAsync: true,
        };
        const list = new List(id, listOptions);
    }
})
