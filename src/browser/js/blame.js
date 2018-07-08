$(() => {
    const $blamePanel = $('.p3x-gitlist-blame-panel')
    if ($blamePanel.length > 0) {

        let $buttonToggleCodeMirrorCurrent;
        let $textareaCurrent;
        let $textCurrent

        for(let blame of $blamePanel) {
            const index = blame.dataset.index
            const $buttonToggleCodeMirror = $(`#p3x-gitlilst-blame-heading-button-codemirror-${ index }`)
            const $text = $(`#p3x-gitlist-blame-text-${ index }`)
            const $textarea = $(`#p3x-gitlist-blame-codemirror-${ index }`)

            $buttonToggleCodeMirror.on('click', function(event) {
                if ($buttonToggleCodeMirrorCurrent !== undefined) {
                    $('.CodeMirror-wrap').remove()
                    const wasActive = $buttonToggleCodeMirror.hasClass('active')
                    window.gitlist.blameCodeMirror = undefined
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
                    value: blame.value,
                    lineNumbers: true,
                    matchBrackets: true,
                    lineWrapping: true,
                    readOnly: true,
                    height: 'auto',
                    mode: blame.dataset.mode,
                    theme: window.gitlist.getActualThemeCodemirror(),
                });
                window.gitlist.blameCodeMirror = cm
            })
        }

    }
})