const hljs = require('highlight.js/lib/highlight.js');
hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml.js'));
hljs.registerLanguage('css', require('highlight.js/lib/languages/css.js'));
hljs.registerLanguage('cmake', require('highlight.js/lib/languages/cmake.js'));
hljs.registerLanguage('dockerfile', require('highlight.js/lib/languages/dockerfile.js'));
hljs.registerLanguage('less', require('highlight.js/lib/languages/less.js'));
hljs.registerLanguage('scss', require('highlight.js/lib/languages/scss.js'));
hljs.registerLanguage('yaml', require('highlight.js/lib/languages/yaml.js'));
hljs.registerLanguage('powershell', require('highlight.js/lib/languages/powershell.js'));
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript.js'));
hljs.registerLanguage('js', require('highlight.js/lib/languages/javascript.js'));
hljs.registerLanguage('json', require('highlight.js/lib/languages/json.js'));
hljs.registerLanguage('bash', require('highlight.js/lib/languages/shell.js'));
hljs.registerLanguage('php', require('highlight.js/lib/languages/php.js'));
hljs.registerLanguage('shell', require('highlight.js/lib/languages/shell.js'));
hljs.registerLanguage('typescript', require('highlight.js/lib/languages/typescript.js'));
hljs.registerLanguage('ts', require('highlight.js/lib/languages/typescript.js'));

document.addEventListener("DOMContentLoaded", function(event) {

    const markdownRenderer = new marked.Renderer();

    const kebabCase = require('lodash/kebabCase')
    markdownRenderer.heading = function (text, level, raw) {
        const ref = kebabCase(text).replace(/[^\x00-\xFF]/g, "");
        const id = ref + '-parent';
        const hover = ` onmouseenter="document.getElementById('${ref}').style.display = 'inline'"  onmouseleave="document.getElementById('${ref}').style.display = 'none'" `;

        const element = `<div ${hover} class="p3x-gitlist-markdown-heading-container"><h${level} id="${id}" class="p3x-gitlist-markdown-heading">${text}&nbsp;<a class="p3x-gitlist-markdown-heading-link" id="${ref}" href="${location.origin}${location.pathname}#${ref}" onclick="return window.gitlist.scrollHash(this, event)">#</a></h${level}></div>`;

        return element
    }



    markdownRenderer.link = function(href, title, text) {
        let a;
        if (href.startsWith('https:/') || href.startsWith('http:/')) {
            a = '<a target="_blank" href="' + href + '">' + text + '</a>';
        } else {
            const start = gitlist.basepath + '/' + gitlist.repo + '/blob/' +  gitlist.branch + '/';
            if (!location.pathname.startsWith(start)) {
                href = start + href;
            }
            a = '<a href="' + href + '">' + text + '</a>';
        }
        return a;
    }

    markdownRenderer.image = function(href, title, text) {
        title = title || '';
        text = text || '';
        let resultText = title;
        if (text !== '') {
            if (title !== '') {
                resultText += ' - ';
            }
            resultText += text;
        }
        const result = '<a target="_blank" href="' + href + '"><img class="p3x-gitlist-markdown-image" alt="' + htmlEncode(resultText) + '" title="' + htmlEncode(resultText) + '" src="' + href + '"/></a>';

        return result;
    };

    markdownRenderer.code = (code, language ) => {
        if (language === undefined) {
            language = 'text';
        }

        language = language.toLowerCase()

        if ((hljs.getLanguage(language) === 'undefined' ||  hljs.getLanguage(language) === undefined) && language !== 'text') {
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
        const highlighted = hljs.highlight(lang, code).value ;
        return `<code style="display: inline; line-height: 34px;" class="hljs ${lang}">${highlighted}</code>`;
    }

    const mdContent = $('#md-content');
    if (mdContent.length) {
        global.gitlist.setTheme();
        const html = marked(mdContent.text(), {
            renderer: markdownRenderer
        });
        mdContent.html(twemoji.parse(html, {
            folder: 'svg',
            ext: '.svg',
        }));
    }

});
