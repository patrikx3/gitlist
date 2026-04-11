// Canvas max height limit: browsers cap at ~32767px.
// With 30px per row, that's ~1092 rows. Configurable via config.ini [app] treegraph_limit.
// 0 = no limit (may break on very large repos).
const TREEGRAPH_MAX_ITEMS = window.gitlist.treegraphLimit || 800;

$(async() => {
    const subjects = $('.p3x-gitlist-treegraph-subject')
    if (subjects) {
        for (let subject of subjects) {
            const html = await window.gitlist.renderMarkdown({
                markdown: subject.innerHTML
            })
            subject.innerHTML = html
        }
    }

    // Load more button + auto-load on scroll
    const $loadMore = $('#p3x-gitlist-treegraph-load-more');
    if ($loadMore.length) {
        let loading = false;
        let totalItems = $('#rev-list li').length;

        const loadMore = async function() {
            if (loading) return;

            // Check canvas height limit
            if (totalItems >= TREEGRAPH_MAX_ITEMS) {
                $('#p3x-gitlist-treegraph-load-more-container').hide();
                $.snackbar({ content: window.gitlist.t('js.treegraph_limit') });
                return;
            }

            loading = true;
            const $btn = $loadMore;
            const repo = $btn.data('repo');
            const branch = $btn.data('branch');
            const page = parseInt($btn.data('page'));

            $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> ' + window.gitlist.t('commit.list.older_next'));

            try {
                const url = window.gitlist.basepath + '/' + repo + '/treegraph-more/' + branch + '?page=' + page;
                const response = await $.ajax({ url: url, dataType: 'json' });

                if (response.graphItems && response.graphItems.length > 0) {
                    const $revList = $('#rev-list');
                    const $rawList = $('#graph-raw-list');

                    // Cap items to not exceed canvas limit
                    const remaining = TREEGRAPH_MAX_ITEMS - totalItems;
                    const items = response.graphItems.slice(0, remaining);

                    for (const item of items) {
                        // Add to raw list for canvas
                        $rawList.append('<li><span class="node-relation">' + $('<span>').text(item.relation).html() + '</span></li>');

                        // Add to visible list
                        let li = '<li>';
                        if (item.rev) {
                            const commitUrl = window.gitlist.basepath + '/' + repo + '/commit/' + item.rev;
                            li += '<a id="' + item.short_rev + '" class="treegraph-button" href="' + commitUrl + '"> ' + item.short_rev + '</a>';
                            li += ' <a href="javascript:void(0)" class="p3x-gitlist-copy-hash" data-hash="' + item.rev + '" title="' + window.gitlist.t('js.copy_hash') + '"><i class="far fa-copy p3x-gitlist-treegraph-copy"></i></a>';
                            li += ' <strong> ' + $('<strong>').text(item.branch).html() + ' </strong>';
                            li += ' <span>' + $('<span>').text(item.date).html() + '</span>';
                            li += ' ' + window.gitlist.t('index.repo.by') + ' ';
                            li += '<span class="author"><a class="treegraph-link" href="mailto:' + item.author_email + '">' + $('<span>').text(item.author).html() + '</a></span>';
                            li += '&nbsp;<span class="p3x-gitlist-treegraph-subject">' + item.subject + '</span>';
                        } else {
                            li += '<span></span>';
                        }
                        li += '</li>';
                        $revList.append(li);
                    }

                    totalItems += items.length;

                    // Render markdown for new subjects
                    const newSubjects = $revList.find('.p3x-gitlist-treegraph-subject').slice(-items.length);
                    for (let subject of newSubjects) {
                        const html = await window.gitlist.renderMarkdown({ markdown: subject.innerHTML });
                        subject.innerHTML = html;
                    }

                    // Set titles on new items
                    $revList.find('li').slice(-items.length).each(function() {
                        const text = $(this).find('.p3x-gitlist-treegraph-subject').text();
                        if (text) $(this).attr('title', text);
                    });

                    // Re-render canvas with all data
                    window.gitlist.treegraph();

                    if (totalItems >= TREEGRAPH_MAX_ITEMS) {
                        $('#p3x-gitlist-treegraph-load-more-container').hide();
                        $.snackbar({ content: window.gitlist.t('js.treegraph_limit') });
                    } else if (response.hasMore) {
                        $btn.data('page', page + 1);
                        $btn.prop('disabled', false).html('<i class="fas fa-chevron-down"></i> ' + window.gitlist.t('commit.list.older_next'));
                    } else {
                        $('#p3x-gitlist-treegraph-load-more-container').hide();
                        $.snackbar({ content: window.gitlist.t('js.no_more_commits') });
                    }
                } else {
                    $('#p3x-gitlist-treegraph-load-more-container').hide();
                    $.snackbar({ content: window.gitlist.t('js.no_more_commits') });
                }
            } catch(e) {
                $btn.prop('disabled', false).html('<i class="fas fa-chevron-down"></i> ' + window.gitlist.t('commit.list.older_next'));
                console.error('Load more failed:', e);
            }
            loading = false;
        };

        $loadMore.on('click', loadMore);

        // Auto-load when scrolling near bottom
        $(window).on('scroll', function() {
            if (loading) return;
            if (!$loadMore.is(':visible')) return;
            if (totalItems >= TREEGRAPH_MAX_ITEMS) return;
            const scrollBottom = $(window).scrollTop() + $(window).height();
            const docHeight = document.documentElement.scrollHeight;
            if (scrollBottom >= docHeight - 300) {
                loadMore();
            }
        });
    }
})

window.gitlist.treegraph = () => {
    if (!document.getElementById('graph-canvas')) {
        return;
    }
    const log = $("#p3x-gitlist-treegraph-log");

    if (log) {
        const graphList = [];
        $("#graph-raw-list li span.node-relation").each(function () {
            graphList.push($(this).text().trim());
        })
        const $li = $('#rev-list li');
        $li.each(function () {
            const $this = $(this)
            const text = $this.find('.p3x-gitlist-treegraph-subject').text()
            if (text !== undefined && text !== '') {
                $this.attr('title', text)
            }
        })
        global.gitGraph(document.getElementById('graph-canvas'), graphList);
    }
}
