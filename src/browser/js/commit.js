$(() => {

    const diffEditors = $('.p3x-gitlist-diff-container');

    const commitMessage = $('#p3x-git-commit-heading');
    if (commitMessage.length) {
        const html = marked(commitMessage.text().trim(), {
            renderer: window.gitlist.markdownRenderer,
        });
        commitMessage.html(twemoji.parse(html, {
            folder: 'svg',
            ext: '.svg',
        }));
    }

    let deferScroll;
    if (diffEditors) {
        for (let diffEditor of diffEditors) {
            const $editableHover = $('#' + diffEditor.dataset.diffId);
            const $diffEditor = $(diffEditor);
            $editableHover.on
            ('click', () => {
                clearTimeout(deferScroll)
                setTimeout(() => {
                    //window.gitlist.scrollIntoView(document.getElementById(diffEditor.dataset.diffRef))
                    window.gitlist.pushHash(`#${diffEditor.dataset.diffRef}`)
                    //console.log(diffEditor)
                    $diffEditor.toggle();
                    $editableHover.toggleClass('active');
                }, 0)
            })
        }
    }

})