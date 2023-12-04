global.twemoji = require('twemoji').default
const prodDir = require('../../package').corifeus["prod-dir"];
global.twemoji.base = `${prodDir}/twemoji/`;

global.htmlEncode = require('js-htmlencode')
const hljs = require('highlight.js/lib/core');

hljs.registerLanguage('conf', require('highlight.js/lib/languages/nginx'));
hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'));
hljs.registerLanguage('css', require('highlight.js/lib/languages/css'));
hljs.registerLanguage('cmake', require('highlight.js/lib/languages/cmake'));
hljs.registerLanguage('dockerfile', require('highlight.js/lib/languages/dockerfile'));
hljs.registerLanguage('Dockerfile', require('highlight.js/lib/languages/dockerfile'));
hljs.registerLanguage('less', require('highlight.js/lib/languages/less'));
hljs.registerLanguage('scss', require('highlight.js/lib/languages/scss'));
hljs.registerLanguage('yaml', require('highlight.js/lib/languages/yaml'));
hljs.registerLanguage('yml', require('highlight.js/lib/languages/yaml'));
hljs.registerLanguage('powershell', require('highlight.js/lib/languages/powershell'));
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
hljs.registerLanguage('js', require('highlight.js/lib/languages/javascript'));
hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));
hljs.registerLanguage('bash', require('highlight.js/lib/languages/shell'));
hljs.registerLanguage('php', require('highlight.js/lib/languages/php'));
hljs.registerLanguage('shell', require('highlight.js/lib/languages/shell'));
hljs.registerLanguage('cmd', require('highlight.js/lib/languages/shell'));
hljs.registerLanguage('typescript', require('highlight.js/lib/languages/typescript'));
hljs.registerLanguage('ts', require('highlight.js/lib/languages/typescript'));
hljs.registerLanguage('python', require('highlight.js/lib/languages/python'));
hljs.registerLanguage('py', require('highlight.js/lib/languages/python'));

const { marked } = require('marked')
global.marked = marked


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

let codeIndex = 0;

markdownRenderer.code = (code, language) => {
    if (language === undefined) {
        language = 'text';
    }

    language = language.toLowerCase()

    if ((hljs.getLanguage(language) === 'undefined' || hljs.getLanguage(language) === undefined) && language !== 'text' && language !== 'txt') {
        console.error(`Please add highlight.js as a language (could be a marked error as well, sometimes it thinks a language): ${language}
We are not loading everything, since it is about 500kb`)
    }
    language = language === 'text' || language === 'txt' || language === undefined ? 'html' : language;
    const validLang = !!(language && hljs.getLanguage(language));
    const highlighted = validLang ? hljs.highlight(code, {
        language: language,
    }).value : code;

    codeIndex++;

    return `<div class="p3x-gitlist-markdown-code"><div class="p3x-gitlist-markdown-code-copy-paste" onclick='window.p3xGitlistCopy(${codeIndex})'><i class="far fa-copy fa-lg"></i></div><pre><code class="hljs ${language}" id="markdown-code-${codeIndex}">${highlighted}</code></pre></div>`
    //return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
};

markdownRenderer.codespan = (code) => {
    const lang = 'html';
    const highlighted = hljs.highlight(code, {
        language: lang,
    }).value;
    return `<code style="display: inline; line-height: 34px;" class="hljs ${lang}">${highlighted}</code>`;
}
window.gitlist.markdownRenderer = markdownRenderer;
