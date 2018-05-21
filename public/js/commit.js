$(() => {

    const diffEditors = $('.p3x-gitlist-diff-container');

    let deferScroll;
    if (diffEditors) {
        for (let diffEditor of diffEditors) {
            const $editableHover = $('#' + diffEditor.dataset.diffId);
            $editableHover.one('click', () => {
                clearTimeout(deferScroll)
                setTimeout(() => {
                    window.gitlist.scrollIntoView(document.getElementById(diffEditor.dataset.diffRef))
                    window.gitlist.pushHash(`#${diffEditor.dataset.diffRef}`)
                    //console.log(diffEditor)
                    $(diffEditor).show();
                }, 0)
                $editableHover.hide();
            })
        }
    }

})