$(function () {

    $('.dropdown-toggle').dropdown();

    function setCodeMirrorTheme(theme) {
        if (gitlist.viewer === undefined) {
            return;
        }
        var actualTheme = theme.split('-')[1]
        if (window.gitlist.isDark(actualTheme)) {
            gitlist.viewer.setOption("theme", 'blackboard');
        } else {
            gitlist.viewer.setOption("theme", 'default');
        }
    }
    window.gitlist.setCodeMirrorTheme = setCodeMirrorTheme;

    if ($('#sourcecode').length) {
        var value = $('#sourcecode').text();
        var mode = $('#sourcecode').attr('language');
        var pre = $('#sourcecode').get(0);

        gitlist.viewer = CodeMirror(function(elt) {
            pre.parentNode.replaceChild(elt, pre);
        }, {
            value: value,
            lineNumbers: true,
            matchBrackets: true,
            lineWrapping: true,
            readOnly: true,
            mode: mode,
        });

        var setCodeMirror = function() {
            if (gitlist.getThemeCookie !== undefined) {
                setCodeMirrorTheme(gitlist.getThemeCookie())
            } else {
                setTimeout(function() {
                    setCodeMirror()
                }, 250)
            }
        }
        setCodeMirror()
    }
// blob/master

    var markdownRenderer = new marked.Renderer();

    var kebabCase = require('lodash/kebabCase')
    markdownRenderer.heading = function (text, level, raw) {
        var ref = kebabCase(text).replace(/[^\x00-\xFF]/g, "");
        var id = ref + '-parent';
        var hover = ' onmouseenter="document.getElementById(\'' + ref + '\').style.display = \'inline\'"  onmouseleave="document.getElementById(\'' + ref + '\').style.display = \'none\'" '

        var element = '<div ' + hover + ' class="p3x-gitlist-markdown-heading-container"><h' + level + ' id="' + id + '" class="p3x-gitlist-markdown-heading">' + text + '&nbsp;<a class="p3x-gitlist-markdown-heading-link" id="' +  ref + '" href="' + location.origin + location.pathname + '#' + ref + '" onclick="return window.gitlist.scrollHash(this, event)">#</a></h' + level + '></div>';

        return element
    }



    markdownRenderer.link = function(href, title, text) {
        var a;
        if (href.startsWith('https:/') || href.startsWith('http:/')) {
            a = '<a target="_blank" href="' + href + '">' + text + '</a>';
        } else {
            var start = gitlist.basepath + '/' + gitlist.repo + '/blob/' +  gitlist.branch + '/';
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
        var resultText = title;
        if (text !== '') {
            if (title !== '') {
                resultText += ' - ';
            }
            resultText += text;
        }
        var result = '<a target="_blank" href="' + href + '"><img class="p3x-gitlist-markdown-image" alt="' + htmlEncode(resultText) + '" title="' + htmlEncode(resultText) + '" src="' + href + '"/></a>';

        return result;
    };



    if ($('#md-content').length) {
        var html = marked($('#md-content').text(), {
            renderer: markdownRenderer
        });
        $('#md-content').html(twemoji.parse(html, {
            folder: 'svg',
            ext: '.svg',
        }));
        global.gitlist.scrollHash(location)
    }

    var clonePopup = $('#clone-popup')
    var cloneButtonShow = $('#clone-button-show');
    var cloneButtonHide = $('#clone-button-hide');
    var cloneButtonSSH = $('#clone-button-ssh');
    var cloneButtonHTTP = $('#clone-button-http');
    var cloneInputSSH = $('#clone-input-ssh');
    var cloneInputHTTP = $('#clone-input-http');

    cloneButtonShow.click(function()
    {
        clonePopup.fadeIn();
    });

    cloneButtonHide.click(function()
    {
        clonePopup.fadeOut();
    });

    cloneButtonSSH.click(function()
    {
        if(cloneButtonSSH.hasClass('active'))
            return;

        cloneButtonSSH.addClass('active');
        cloneInputSSH.show();

        cloneButtonHTTP.removeClass('active');
        cloneInputHTTP.hide();
    });

    cloneButtonHTTP.click(function()
    {
        if(cloneButtonHTTP.hasClass('active'))
            return;

        cloneButtonHTTP.addClass('active');
        cloneInputHTTP.show();

        cloneButtonSSH.removeClass('active');
        cloneInputSSH.hide();
    });

    function paginate() {
        var $pager = $('.pager');

        $pager.find('.next a').one('click', function (e) {
            e.preventDefault();
            $.get(this.href, function (html) {
                $pager.after(html);
                $pager.remove();
                paginate();
            });
        });

        $pager.find('.previous').remove();
    }
    paginate();
});

if ($('#repositories').length) {
    var listOptions = {
        valueNames: ['name']
    };
    var repoList = new List('repositories', listOptions);
}

if ($('#branchList').length) {
    var listBranchOptions = {
        valueNames: ['item']
    };
    var repoList = new List('branchList', listBranchOptions);
}

$('.search').click(function (e) {
    e.stopPropagation();
});

global.gitlist.scrollHash = function(element, event) {
    var url = new URL(element.href)
    var id = url.hash.substring(1)
    var elfind = document.getElementById(id + '-parent')
    if (elfind === null) {
        return true;
    }
    elfind.scrollIntoView({
        behavior: 'smooth',
        block: "center",

    })

    if (event !== undefined) {
        event.preventDefault()
        if(history.pushState) {
            var pushState = location.pathname + url.hash;
            history.pushState(null, null, pushState);
        }
        else {
            location.hash = url.hash;
        }
    }
    return false;
}

document.addEventListener('DOMContentLoaded', function(){
    var es = document.getElementsByTagName('a')
    for(var i=0; i<es.length; i++){
        es[i].addEventListener('click', function(e) {
            var href = e.target.getAttribute('href');
            if (href === null) {
                return;
            }
            if (href.startsWith('#')) {
                e.preventDefault()
                var el = document.getElementById(href.substring(1));
                if (el === null) {
                    return;
                }
                el.scrollIntoView({
                    behavior: 'smooth',
                    block: "center",

                })

            }
        })
    }

})