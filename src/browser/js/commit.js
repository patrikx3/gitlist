$(() => {

    const diffEditors = $('.p3x-gitlist-diff-container');

    const commitMessage = $('#p3x-git-commit-heading');
    if (commitMessage.length) {
        const html = marked(commitMessage.text().trim(), {
            renderer: window.gitlist.markdownRenderer,
        });
        const twemojiSettings = require('./settings').twemoji;
        commitMessage.html(twemoji.parse(html, twemojiSettings));
    }

    let deferScroll;
    //console.log(diffEditors.length);
    if (diffEditors.length > 0) {

        const generatedDiffs = {};

        /*
        let diffs
        const url = new URL(location);
        url.searchParams.append('ajax', 1)
        $.ajax(url.toString()).then(function (diffsResponseJson) {
            if (typeof diffsResponseJson !== 'object') {
                const sendErrorMessage = `${window.gitlist.basepath}/json-error`;
                console.log(sendErrorMessage);
                $.redirect(sendErrorMessage, {
                    error: diffsResponseJson,
                })
            } else {
                diffs = diffsResponseJson;
            }
        }).catch(window.gitlist.ajaxErrorHandler)
        */

        for (let diffEditor of diffEditors) {
            const $editableHover = $('#' + diffEditor.dataset.diffId);
//            console.log(diffEditor.dataset.diffId)
            const $diffEditor = $(diffEditor);
            $editableHover.on('click', () => {
                clearTimeout(deferScroll)
                setTimeout(() => {
                    window.gitlist.pushHash(`#${diffEditor.dataset.diffRef}`)
                    const index = diffEditor.dataset.diffIndex;
                    $diffEditor.toggle();
                    $editableHover.toggleClass('active');
                    const showDiff = () => {
                        if (!window.gitlist.generateDiff.hasOwnProperty(index)) {
//                            console.log(window.gitlist.generateDiff[index]);
                            clearTimeout(diffEditor.timeout)
                            diffEditor.timeout = setTimeout(showDiff, 100);
                        } else if (!generatedDiffs.hasOwnProperty(index)) {
                                clearTimeout(diffEditor.timeout)
                                generatedDiffs[index] = true;
                                window.gitlist.generateDiff[index]({
                                    loading: true,
                                    toggle: false,
                                });
                        } else {
                            window.gitlist.generateDiff[index]({
                                loading: false,
                                toggle: true,
                            });
                        }
                    }
                    showDiff();
                })
            })
        }
    }

})