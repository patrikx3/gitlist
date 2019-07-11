const hljs = require('highlight.js/lib/highlight.js');
hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml.js'));
hljs.registerLanguage('css', require('highlight.js/lib/languages/css.js'));
hljs.registerLanguage('cmake', require('highlight.js/lib/languages/cmake.js'));
hljs.registerLanguage('dockerfile', require('highlight.js/lib/languages/dockerfile.js'));
hljs.registerLanguage('Dockerfile', require('highlight.js/lib/languages/dockerfile.js'));
hljs.registerLanguage('less', require('highlight.js/lib/languages/less.js'));
hljs.registerLanguage('scss', require('highlight.js/lib/languages/scss.js'));
hljs.registerLanguage('yaml', require('highlight.js/lib/languages/yaml.js'));
hljs.registerLanguage('yml', require('highlight.js/lib/languages/yaml.js'));
hljs.registerLanguage('powershell', require('highlight.js/lib/languages/powershell.js'));
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript.js'));
hljs.registerLanguage('js', require('highlight.js/lib/languages/javascript.js'));
hljs.registerLanguage('json', require('highlight.js/lib/languages/json.js'));
hljs.registerLanguage('bash', require('highlight.js/lib/languages/shell.js'));
hljs.registerLanguage('php', require('highlight.js/lib/languages/php.js'));
hljs.registerLanguage('shell', require('highlight.js/lib/languages/shell.js'));
hljs.registerLanguage('cmd', require('highlight.js/lib/languages/shell.js'));
hljs.registerLanguage('typescript', require('highlight.js/lib/languages/typescript.js'));
hljs.registerLanguage('ts', require('highlight.js/lib/languages/typescript.js'));
hljs.registerLanguage('python', require('highlight.js/lib/languages/python.js'));
hljs.registerLanguage('py', require('highlight.js/lib/languages/python.js'));

const markdownRenderer = new marked.Renderer();
global.gitlist.markdownRenderer = markdownRenderer;

const kebabCase = require('lodash/kebabCase')
markdownRenderer.heading = function (text, level, raw) {
    level = level + 2;
    const ref = kebabCase(text).replace(/[^\x00-\xFF]/g, "");
    const id = ref + '-parent';
    const hover = ` onmouseenter="document.getElementById('${ref}').style.display = 'inline'"  onmouseleave="document.getElementById('${ref}').style.display = 'none'" `;

    const element = `<div ${hover} class="p3x-gitlist-markdown-heading-container"><h${level} id="${id}" class="p3x-gitlist-markdown-heading">${text}&nbsp;<a class="p3x-gitlist-markdown-heading-link" id="${ref}" href="${location.origin}${location.pathname}#${ref}" onclick="return window.gitlist.scrollHash(this, event)">#</a></h${level}></div>`;

    return element
}


markdownRenderer.link = function (href, title, text) {
    let a;
    if (href.startsWith('https:/') || href.startsWith('http:/')) {
        a = '<a target="_blank" href="' + href + '">' + text + '</a>';
    } else {
        // /ramdisk.git/tree/master/artifacts/
        //console.log(href)
        const start = gitlist.basepath + '/' + gitlist.repo + (href.endsWith('/') ? '/tree/' : '/blob/') + gitlist.branch + '/';
        if (!location.pathname.startsWith(start)) {
            href = start + href;
        } else {
            const url = new URL(location);
            let path = url.pathname.split('/');
            path.pop();
            path = path.join('/');
            href = path + '/' + href;
        }
        a = '<a href="' + href + '">' + text + '</a>';
    }
    return a;
}

markdownRenderer.image = function (href, title, text) {
    title = title || '';
    text = text || '';
    let resultText = title;
    if (text !== '') {
        if (title !== '') {
            resultText += ' - ';
        }
        resultText += text;
    }

    if (!href.startsWith('https:/') && !href.startsWith('http:/')) {
        const start = gitlist.basepath + '/' + gitlist.repo + '/raw/' + gitlist.branch + '/';
        if (!location.pathname.startsWith(start)) {
            href = start + href;
        } else {
            const url = new URL(location);
            let path = url.pathname.split('/');
            path.pop();
            path = path.join('/');
            href = path + '/' + href;
        }
    }

    const result = '<img class="p3x-gitlist-markdown-image" alt="' + htmlEncode(resultText) + '" title="' + htmlEncode(resultText) + '" src="' + href + '"/>';

    return result;
};

markdownRenderer.code = (code, language) => {
    if (language === undefined) {
        language = 'text';
    }

    language = language.toLowerCase()

    if ((hljs.getLanguage(language) === 'undefined' || hljs.getLanguage(language) === undefined) && language !== 'text') {
        console.error(`Please add highlight.js as a language (could be a marked error as well, sometimes it thinks a language): ${language}                
We are not loading everything, since it is about 500kb`)
    }
    language = language === 'text' || language === undefined ? 'html' : language;
    const validLang = !!(language && hljs.getLanguage(language));
    const highlighted = validLang ? hljs.highlight(language, code).value : code;
    return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
};

markdownRenderer.codespan = (code) => {
    const lang = 'html';
    const highlighted = hljs.highlight(lang, code).value;
    return `<code style="display: inline; line-height: 34px;" class="hljs ${lang}">${highlighted}</code>`;
}
window.gitlist.markdownRenderer = markdownRenderer;
$(function () {

    const mdContent = $('#p3x-gitlist-readme');
    if (mdContent.length) {
        const twemojiSettings = require('./settings').twemoji;
        const html = marked(mdContent.text(), {
            renderer: markdownRenderer
        });
        mdContent.html(twemoji.parse(html, twemojiSettings));
    }

});

window.gitlist.renderMarkdown = (options) => {
    const {markdown} = options;
    const twemojiSettings = require('./settings').twemoji;
    const markedHtml = marked(markdown, {
        renderer: window.gitlist.markdownRenderer
    });
    const html = twemoji.parse(markedHtml, twemojiSettings)
    return html;
}
