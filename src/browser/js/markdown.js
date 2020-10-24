$(async function () {

    const mdContent = $('#p3x-gitlist-readme');
    if (mdContent.length) {

        await import(
            /* webpackChunkName: "marked" */
            /* webpackPrefetch: true */
            '../marked'
        )

        const twemojiSettings = require('./settings').twemoji;
        const html = marked(mdContent.text(), {
            renderer: window.gitlist.markdownRenderer
        });
        mdContent.html(twemoji.parse(html, twemojiSettings));
    }

});

window.gitlist.renderMarkdown = async(options) => {
    await import(
        /* webpackChunkName: "marked" */
        /* webpackPrefetch: true */
        '../marked'
        )

    const {markdown} = options;
    const twemojiSettings = require('./settings').twemoji;
    const markedHtml = marked(markdown, {
        renderer: window.gitlist.markdownRenderer
    });
    const html = twemoji.parse(markedHtml, twemojiSettings)
    return html;
}
