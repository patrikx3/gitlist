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

    const Cookies = require('js-cookie');
    const dateModeCookie = 'p3x-gitlist-treegraph-date-mode';

    // Apply chosen date display mode to all date cells in the table
    const applyDateMode = function(mode) {
        document.querySelectorAll('.p3x-gitlist-treegraph-date').forEach(function(el) {
            const iso = el.dataset.iso;
            const abs = el.dataset.absolute;
            if (!iso || !abs) return;
            if (mode === 'relative') {
                el.textContent = window.gitlist.formatRelativeTime(iso);
                el.title = abs;
            } else {
                el.textContent = abs;
                el.title = window.gitlist.formatRelativeTime(iso);
            }
        });
    };

    // Render git's "%D" ref-list string into colored badges
    const renderRefs = function(raw) {
        if (!raw) return '';
        const cleaned = raw.trim().replace(/^\(/, '').replace(/\)$/, '').trim();
        if (!cleaned) return '';
        const escapeRef = (s) => $('<span>').text(s == null ? '' : s).html();
        return cleaned.split(',').map(p => p.trim()).filter(Boolean).map(part => {
            if (part.startsWith('HEAD ->')) {
                const br = part.substring(7).trim();
                return '<span class="p3x-gitlist-treegraph-ref p3x-gitlist-treegraph-ref-head">HEAD</span>'
                     + '<span class="p3x-gitlist-treegraph-ref p3x-gitlist-treegraph-ref-branch">' + escapeRef(br) + '</span>';
            }
            if (part === 'HEAD') {
                return '<span class="p3x-gitlist-treegraph-ref p3x-gitlist-treegraph-ref-head">HEAD</span>';
            }
            if (part.startsWith('tag:')) {
                const tg = part.substring(4).trim();
                return '<span class="p3x-gitlist-treegraph-ref p3x-gitlist-treegraph-ref-tag"><i class="fas fa-tag"></i>' + escapeRef(tg) + '</span>';
            }
            return '<span class="p3x-gitlist-treegraph-ref p3x-gitlist-treegraph-ref-branch">' + escapeRef(part) + '</span>';
        }).join('');
    };

    // Load more button + auto-load on scroll
    const $loadMore = $('#p3x-gitlist-treegraph-load-more');
    if ($loadMore.length) {
        let loading = false;
        let totalItems = $('#graph-raw-list li').length;

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
                    const $revList = $('#rev-list > tbody');
                    const $rawList = $('#graph-raw-list');

                    // Cap items to not exceed canvas limit
                    const remaining = TREEGRAPH_MAX_ITEMS - totalItems;
                    const items = response.graphItems.slice(0, remaining);
                    const escape = (s) => $('<span>').text(s == null ? '' : s).html();

                    for (const item of items) {
                        $rawList.append('<li><span class="node-relation">' + escape(item.relation) + '</span></li>');

                        let rows = '';
                        if (item.rev) {
                            const commitUrl = window.gitlist.basepath + '/' + repo + '/commit/' + item.rev;
                            const branchHtml = renderRefs(item.branch);
                            rows += '<tr class="p3x-gitlist-treegraph-row-info">';
                            rows += '<td class="p3x-gitlist-treegraph-hash">';
                            rows += '<a id="' + escape(item.short_rev) + '" class="treegraph-button" href="' + commitUrl + '">' + escape(item.short_rev) + '</a>';
                            rows += ' <a href="javascript:void(0)" class="p3x-gitlist-copy-hash" data-hash="' + escape(item.rev) + '" title="' + window.gitlist.t('js.copy_hash') + '"><i class="far fa-copy p3x-gitlist-treegraph-copy"></i></a>';
                            rows += '</td>';
                            rows += '<td class="p3x-gitlist-treegraph-date" data-iso="' + escape(item.date_iso) + '" data-absolute="' + escape(item.date) + '">' + escape(item.date) + '</td>';
                            rows += '<td class="p3x-gitlist-treegraph-branch">' + branchHtml + '</td>';
                            rows += '<td class="p3x-gitlist-treegraph-author">' + window.gitlist.t('index.repo.by') + ' <a class="treegraph-link" href="mailto:' + escape(item.author_email) + '">' + escape(item.author) + '</a></td>';
                            rows += '<td class="p3x-gitlist-treegraph-spacer"></td>';
                            rows += '</tr>';
                            rows += '<tr class="p3x-gitlist-treegraph-row-subject">';
                            rows += '<td colspan="5"><span class="p3x-gitlist-treegraph-subject">' + item.subject + '</span></td>';
                            rows += '</tr>';
                        } else {
                            rows += '<tr class="p3x-gitlist-treegraph-row-relation"><td colspan="5"></td></tr>';
                            rows += '<tr class="p3x-gitlist-treegraph-row-relation"><td colspan="5"></td></tr>';
                        }
                        $revList.append(rows);
                    }

                    totalItems += items.length;

                    // Render markdown for new subjects (2 rows per item, subject in 2nd)
                    const newSubjects = $('#rev-list .p3x-gitlist-treegraph-subject').slice(-items.length);
                    for (let subject of newSubjects) {
                        const html = await window.gitlist.renderMarkdown({ markdown: subject.innerHTML });
                        subject.innerHTML = html;
                    }

                    // Set titles on the info rows for new items (2 trs per item)
                    $('#rev-list > tbody > tr.p3x-gitlist-treegraph-row-info').slice(-items.length).each(function() {
                        const text = $(this).next('.p3x-gitlist-treegraph-row-subject').find('.p3x-gitlist-treegraph-subject').text();
                        if (text) $(this).attr('title', text);
                    });

                    // Alternating stripe per commit block (info + subject pair)
                    let stripeIdx = 0;
                    $('#rev-list > tbody > tr.p3x-gitlist-treegraph-row-info').each(function() {
                        const $info = $(this);
                        const odd = stripeIdx % 2 === 1;
                        $info.toggleClass('p3x-gitlist-treegraph-stripe', odd);
                        $info.next('.p3x-gitlist-treegraph-row-subject').toggleClass('p3x-gitlist-treegraph-stripe', odd);
                        stripeIdx++;
                    });

                    // Apply current date display mode to newly added rows
                    applyDateMode(Cookies.get(dateModeCookie) || 'absolute');

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

        // Date mode toggle (absolute date ↔ relative "X ago")
        const $dateToggle = $('#p3x-gitlist-treegraph-date-toggle');
        if ($dateToggle.length) {
            const updateToggleLabel = function(mode) {
                const labelKey = mode === 'relative'
                    ? 'treegraph.date_toggle_to_absolute'
                    : 'treegraph.date_toggle_to_relative';
                $dateToggle.find('.p3x-gitlist-treegraph-date-toggle-label').text(window.gitlist.t(labelKey));
            };
            const initialMode = Cookies.get(dateModeCookie) || 'absolute';
            updateToggleLabel(initialMode);

            $dateToggle.on('click', function() {
                const current = Cookies.get(dateModeCookie) || 'absolute';
                const next = current === 'relative' ? 'absolute' : 'relative';
                Cookies.set(dateModeCookie, next, window.gitlist.cookieSettings);
                applyDateMode(next);
                updateToggleLabel(next);
            });
        }

        // Auto-load first page on mount when nothing rendered server-side
        if (totalItems === 0) {
            loadMore();
        }

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
        const $rows = $('#rev-list > tbody > tr');
        $rows.each(function () {
            const $this = $(this)
            const text = $this.find('.p3x-gitlist-treegraph-subject').text()
            if (text !== undefined && text !== '') {
                $this.attr('title', text)
            }
        })
        if (graphList.length === 0) {
            return;
        }
        global.gitGraph(document.getElementById('graph-canvas'), graphList, {
            unitSize: 40,
            lineWidth: 3,
            nodeRadius: 4
        });
    }
}
