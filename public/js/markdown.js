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

    const mdContent = $('#md-content');
    if (mdContent.length) {
        const html = marked(mdContent.text(), {
            renderer: markdownRenderer
        });
        mdContent.html(twemoji.parse(html, {
            folder: 'svg',
            ext: '.svg',
        }));
        global.gitlist.scrollHash(location)
    }

});
