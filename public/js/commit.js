$(() => {

    const diffEditors = $('.p3x-gitlist-commit-diff');

    let deferScroll;
    if (diffEditors) {
        for (let diffEditor of diffEditors) {
            const $editableHover = $('#' + diffEditor.dataset.diffId);
            const editableHover = $editableHover.get(0);
            $editableHover.one('click', () => {
                clearTimeout(deferScroll)
                setTimeout(() => {
                    window.gitlist.scrollIntoView(document.getElementById(diffEditor.dataset.diffRef))
                }, 0)
                $editableHover.find('.panel-body').html('<i class="fas fa-cog fa-spin"></i> Loading the diff ...')
                const value = JSON.parse(diffEditor.innerText).toString()
                diffEditor.remove();
                const editor = CodeMirror(function (node) {
                    editableHover.parentNode.replaceChild(node, editableHover);
                }, {
                    styleActiveLine: true,
                    styleSelectedText: true,
                    value: value,
                    lineNumbers: false,
                    matchBrackets: true,
                    lineWrapping: false,
                    readOnly: true,
                    mode: 'text/x-diff',
                    theme: window.gitlist.getActualThemeCodemirror(),
                });
                window.gitlist.diffEditors.push(editor)
            })
        }
    }

})