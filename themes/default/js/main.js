$(function () {

    $('.dropdown-toggle').dropdown();

    if ($('#sourcecode').length) {
        var value = $('#sourcecode').text();
        var mode = $('#sourcecode').attr('language');
        var pre = $('#sourcecode').get(0);
        var viewer = CodeMirror(function(elt) {
            pre.parentNode.replaceChild(elt, pre);
        }, {
            value: value,
            lineNumbers: true,
            matchBrackets: true,
            lineWrapping: true,
            readOnly: true,
            mode: mode,
            lineNumberFormatter: function(ln) {
                return ln;
            }
        });
    }
// blob/master

    var markdownRenderer = new marked.Renderer();

    markdownRenderer.heading = function (text, level, raw) {
        var ref = _.kebabCase(text).replace(/[^\x00-\xFF]/g, "");
        var id = ref + '-parent';
        var hover = ' onmouseenter="document.getElementById(\'' + ref + '\').style.display = \'inline\'"  onmouseleave="document.getElementById(\'' + ref + '\').style.display = \'none\'" '

        var element = '<div ' + hover + ' class="p3x-gitlist-markdown-heading-container"><h' + level + ' id="' + id + '" class="p3x-gitlist-markdown-heading">' + text + '&nbsp;<a class="p3x-gitlist-markdown-heading-link" id="' +  ref + '" href="' + location.origin + location.pathname + '#' + ref + '">#</a></h' + level + '></div>';

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
        var result = '<img class="p3x-gitlist-markdown-image" alt="' + htmlEncode(resultText) + '" title="' + htmlEncode(resultText) + '" src="' + href + '"/>';

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

