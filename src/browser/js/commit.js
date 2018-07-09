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
            const $diffEditor = $(diffEditor);
            $editableHover.on('click', () => {
                const url = new URL(location)
                $diffEditor.toggle()
                $editableHover.toggleClass('active')
                if (diffEditor.dataset.loaded) {
                    return;
                }
                const loopIndex = diffEditor.dataset.loopIndex;
                //console.log(loopIndex)
                diffEditor.dataset.loaded = true
                url.searchParams.append('ajax', '1')
                url.searchParams.append('filename', diffEditor.dataset.filename)

                const loader = $(`#p3x-gitlist-commit-diff-loader-${loopIndex}`)
                const loaderAjax = $(`#p3x-gitlist-commit-diff-loader-ajax-${loopIndex}`)
                const loaderWebworker = $(`#p3x-gitlist-commit-diff-loader-webworker-${loopIndex}`)
                const scroller = $(`#p3x-gitlist-commit-diff-scroller-${loopIndex}`)
                scroller.css('max-height', window.gitlist.editorMaxHeight)

                $.ajax(url.toString()).then(function (diffsResponseJson) {
                    if (typeof diffsResponseJson !== 'object') {
                        const sendErrorMessage = `${window.gitlist.basepath}/json-error`;
                        console.log(sendErrorMessage);
                        $.redirect(sendErrorMessage, {
                            error: diffsResponseJson,
                        })
                    } else {
                        const diffs = diffsResponseJson[0];
                        loaderAjax.hide()
                        loaderWebworker.show()
                        const worker = new Worker(`${window.gitlist.basepath}/web-worker/commit-diff.js`);
                        worker.addEventListener('message', function (event) {
                            loader.hide();
                            scroller.append(event.data)
                            worker.terminate()
                            //console.log('worker.onmessage', event.data)
                        })
                        /*
                          for(let diffLineIndex in diffs.lines) {
                            diffs.lines[diffLineIndex].line = htmlEncode(diffs.lines[diffLineIndex].line)
                        }
                        */
                        worker.postMessage({
                            diffs : diffs,
                            basepath: window.gitlist.basepath,
                            htmlEncode: window.htmlEncode.toString(),
                        });
                    }
                }).catch(window.gitlist.ajaxErrorHandler)
            })
        }
    }

})