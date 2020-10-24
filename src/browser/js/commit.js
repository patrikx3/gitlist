$(async() => {

    const $diffEditors = $('.p3x-gitlist-diff-container');

    const $commitMessage = $('#p3x-gitlist-commit-heading');
    //console.log($commitMessage)
    if ($commitMessage.length) {

        await import(
            /* webpackChunkName: "marked" */
            /* webpackPrefetch: true */
            '../marked'
            )

        const html = marked($commitMessage.text().trim(), {
            renderer: window.gitlist.markdownRenderer,
        });
        const twemojiSettings = require('./settings').twemoji;
        $commitMessage.html(twemoji.parse(html, twemojiSettings));
    }

    if ($diffEditors.length > 0) {


        for (let diffEditor of $diffEditors) {
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
                        const Worker = require(`./web-worker/commit-diff.worker`);
                        const worker = new Worker.default();
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
                            diffs: diffs,
                            basepath: window.gitlist.basepath,
                        });
                    }
                }).catch(window.gitlist.ajaxErrorHandler)
            })

        }

        const isStringInt = require('is-string-int')
        if (isStringInt(location.hash.substr(1))) {
            const diff = parseInt(location.hash.substr(1))
            const position = `p3x-gitlist-diff-${diff}`
            const element = document.getElementById(position);
            const diffButton = $(`#p3x-gitlist-diff-data-${diff}`)
            setTimeout(() => {
                window.gitlist.scrollIntoView(element)
                diffButton.click()
            }, 500)
        }
    }

})
