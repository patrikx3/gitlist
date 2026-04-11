global.twemoji = require('twemoji').default
const prodDir = require('../../package').corifeus["prod-dir"];
global.twemoji.base = `${prodDir}/twemoji/`;

global.htmlEncode = require('js-htmlencode')
const hljs = require('./js/hljs-loader');
global.hljs = hljs;

const { marked } = require('marked')
global.marked = marked


const markdownRenderer = new marked.Renderer();
global.gitlist.markdownRenderer = markdownRenderer;

const kebabCase = require('lodash/kebabCase')
markdownRenderer.heading = (token) => {
    //console.log('token heading', token)
    //            console.log('text', text,)
    //            console.log('raw', raw)
    
    // text, level, raw
    const text = token.text;
    let level = token.depth;
    const raw = token.raw

    level = level + 2;
    const ref = kebabCase(text).replace(/[^\x00-\xFF]/g, "");
    const id = ref + '-parent';
    const hover = ` onmouseenter="document.getElementById('${ref}').style.display = 'inline'"  onmouseleave="document.getElementById('${ref}').style.display = 'none'" `;

    const element = `<div ${hover} class="p3x-gitlist-markdown-heading-container"><h${level} id="${id}" class="p3x-gitlist-markdown-heading">${text}&nbsp;<a class="p3x-gitlist-markdown-heading-link" id="${ref}" href="${location.origin}${location.pathname}#${ref}" onclick="return window.gitlist.scrollHash(this, event);">#</a></h${level}></div>`;

    return element
}


markdownRenderer.strong = (token) => {
    return `<font style="font-weight: bold;">${token.text}</font>`;
}

markdownRenderer.link = (token) => {
    //console.log('token link', token)

    const title = token.title
    let href = token.href
    let text = token.text


    if (token.tokens.length === 1) {
        if (token.tokens[0].type === 'image') {
            const imageToken = token.tokens[0]
            //console.log('image token', imageToken)
            text = markdownRenderer.image(imageToken);
        } else if (token.tokens[0].type === 'strong') {
            const strongToken = token.tokens[0]
            //console.log('strong token', strongToken)
            text = markdownRenderer.strong(strongToken);
        }
    }


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

markdownRenderer.image = (token) => {
    //console.log('token image', token)

    // href, title, text
    let {href, title, text} = token;

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

    //console.warn('result image', result)
    return result;
};

let codeIndex = 0;

markdownRenderer.code = (token) => {
    //console.log('token code', token)

    // code, language
    //console.warn('code', token)

    const code = token.text;
    let language = token.lang;

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

markdownRenderer.codespan = (token) => {
    //console.log('token codespan', token)
    
    //console.warn('codespan', token)

    const code = token.text
    const lang = 'html';
    const highlighted = hljs.highlight(code, {
        language: lang,
    }).value;
    return `<code style="display: inline; line-height: 34px;" class="hljs ${lang}">${highlighted}</code>`;
}
window.gitlist.markdownRenderer = markdownRenderer;
