$(async() => {

    const constructMarkdown = async() => {
        const $commitListTables = $('.p3x-gitlist-commits-list:not(.p3x-gitlist-commits-list-rendered)');

        if ($commitListTables.length > 0) {

            for (let commitTable of $commitListTables) {
                const $commitTable = $(commitTable)
                $commitTable.addClass('p3x-gitlist-commits-list-rendered')
//console.log(commitTable)
                const $markedItems = $commitTable.find('.p3x-gitlist-commits-list-message')

                for (let markedItem of $markedItems) {
                    //console.log(markedItem)
                    const $markedItem = $(markedItem)
                    const html = await window.gitlist.renderMarkdown({
                        markdown: $markedItem.html()
                    })
                    //console.log(html)
                    $markedItem.html(html)
                }
            }
        }
    }

    await constructMarkdown();
    window.gitlist.constructCommitsListConstructMarkdown = constructMarkdown;
})
