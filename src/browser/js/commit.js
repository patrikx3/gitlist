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

        const generatedDiffs = {};
        const generatedDiffsGenerated = {};
        const waiter = 10;
        let timeout = 10;

        $.snackbar({
            htmlAllowed: true,
            content: `Hang on, loading and rendering diffs deffered via AJAX...`,
            timeout: window.gitlist.snapckbarLongTimeout,
        })

        $.ajax(location).then((diffs) => {
            let index = 0;
            for(let diff of diffs) {

/*

 <table>
    {% for line in diff.getLines %}
        <tr>
            <td class="lineNo">
                {% if line.getType != 'chunk' %}
                    <!--                                <a id="{{ diff.index  | to_id }}L{{ loop.index }}R{{ line.getNumOld }}"></a> -->
                    <!--                                <a href="#{{ diff.index  | to_id }}L{{ loop.index }}R{{ line.getNumOld }}"> -->
                {% endif %}
                {{ line.getNumOld }}
                {% if line.getType != 'chunk' %}
                    <!--                                </a> -->
                {% endif %}
            </td>
            <td class="lineNo">
                {% if line.getType != 'chunk' %}
                    <!--                                <a id="{{ diff.index  | to_id }}L{{ loop.index }}L{{ line.getNumNew }}"></a> -->
                    <!--                                <a href="#{{ diff.index | to_id }}L{{ loop.index }}L{{ line.getNumNew }}"> -->
                {% endif %}
                {{ line.getNumNew }}
                {% if line.getType != 'chunk' %}
                    <!--                                </a> -->
                {% endif %}
            </td>
            <td style="width: 100%">
                <pre{% if line.getType %} class="{{ line.getType }}"{% endif %}>{{ line.getLine }}</pre>
            </td>
        </tr>
    {% endfor %}
</table>

 */
                setTimeout(() => {
                    index++;
                    let html = '';
                    html += '<table>';
                    for(let line of diff.lines) {
//                    console.log(line)
                        html += `
        <tr>
            <td class="lineNo">
            ${line['num-old']}
            </td>
            <td class="lineNo">
            ${line['num-new']}
            </td>
           <td style="width: 100%">
                <pre class="${line.type}">${htmlEncode(line.line)}</pre>
            </td>
        </tr>
`;
                    }
                    html += '</table>';
//                    console.log(index);
                    generatedDiffs[index] = html;
                    console.log(`P3X-GITLIST loading via AJAX and rendering diffs deffered - ${index}`)
                }, timeout)
                timeout += waiter;
            }
        }).catch(window.gitlist.ajaxErrorHandler)

        for (let diffEditor of diffEditors) {
            const $editableHover = $('#' + diffEditor.dataset.diffId);
//            console.log(diffEditor.dataset.diffId)
            const $diffEditor = $(diffEditor);
            $editableHover.on
            ('click', () => {
                clearTimeout(deferScroll)
                setTimeout(() => {
                    //window.gitlist.scrollIntoView(document.getElementById(diffEditor.dataset.diffRef))
                    window.gitlist.pushHash(`#${diffEditor.dataset.diffRef}`)
                    const index = diffEditor.dataset.diffIndex;
                    //console.log(diffEditor)
                    const showDiff = () => {
                        if (!generatedDiffs.hasOwnProperty(index)) {
                            clearTimeout(diffEditor.timeout)
                            diffEditor.timeout = setTimeout(showDiff, 250);
                        } else if (!generatedDiffsGenerated.hasOwnProperty()) {
                            const $div = $(`#p3x-gitlist-diff-ajax-${index}`)
                            $div.html(generatedDiffs[index])
                            generatedDiffsGenerated[index] = true;
                        }
                    }
                    showDiff();
                    $diffEditor.toggle();
                    $editableHover.toggleClass('active');
                }, 0)
            })
        }
    }

})