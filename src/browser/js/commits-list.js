$(() => {

    const constructMarkdown = () => {
        const $commitListTables = $('.p3x-gitlist-commits-list:not(.p3x-gitlist-commits-list-rendered)');

        if ($commitListTables.length > 0) {

            for(let commitTable of $commitListTables) {
                const $commitTable = $(commitTable)
                console.log($commitTable.hasClass("p3x-gitlist-commits-list-rendered"))
                $commitTable.addClass('p3x-gitlist-commits-list-rendered')

            }
        }
    }

    constructMarkdown();
    window.gitlist.constructCommitsListConstructMarkdown = constructMarkdown;
})