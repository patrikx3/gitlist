$(() => {
    const $fragmentFilePanel = $('.p3x-gitlist-file-fragment-panel')
    if ($fragmentFilePanel.length > 0) {

        let $buttonToggleCodeMirrorCurrent;
        let $textareaCurrent;
        let $textCurrent

        for(let fragmentFile of $fragmentFilePanel) {
            const index = fragmentFile.dataset.index
            const $buttonToggleCodeMirror = $(`#p3x-gitlilst-file-fragment-heading-button-codemirror-${ index }`)
            const $text = $(`#p3x-gitlist-file-fragment-text-${ index }`)
            const $textarea = $(`#p3x-gitlist-file-fragment-codemirror-${ index }`)

            const $buttonEditor = $(`#p3x-gitlilst-file-fragment-heading-button-edit-${ index}`)
            if ($buttonEditor.length > 0) {
                $buttonEditor.on('click', function(event) {
                   const url = $buttonEditor.get(0).dataset.url
                   location = url;
                })

            }

            $buttonToggleCodeMirror.on('click', function(event) {
                if ($buttonToggleCodeMirrorCurrent !== undefined) {
                    $('.CodeMirror-wrap').remove()
                    const wasActive = $buttonToggleCodeMirror.hasClass('active')
                    window.gitlist.fragmentFileCodeMirror = undefined
                    $buttonToggleCodeMirrorCurrent.removeClass('active')
                    $textCurrent.removeClass('hidden')
                    $textareaCurrent.addClass('hidden')
                    if (wasActive) {
                        return;
                    }
                }

                $buttonToggleCodeMirrorCurrent = $buttonToggleCodeMirror
                $textCurrent = $text;
                $textareaCurrent = $textarea;
                $text.addClass('hidden');
                $textarea.removeClass('hidden')
                $buttonToggleCodeMirror.addClass('active')

                const cm  = CodeMirror.fromTextArea($textarea.get(0), {
                    styleActiveLine: true,
                    styleSelectedText: true,
                    value: fragmentFile.value,
                    lineNumbers: true,
                    matchBrackets: true,
                    lineWrapping: true,
                    readOnly: true,
                    height: 'auto',
                    mode: fragmentFile.dataset.mode,
                    theme: window.gitlist.getActualThemeCodemirror(),
                });
                window.gitlist.fragmentFileCodeMirror = cm
            })
        }

    }
})