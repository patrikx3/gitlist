$(function () {

    let $pager;
    let loading = false;
    let $button;
    let noMore = false;
    let $noCommits;

    const nextCommitListItem = () => {

        if (loading === true) {
            return;
        }
        loading = true;
        const href = $button.attr('href');
        //console.log(href);
        if (href === undefined) {
            loading = false;
            if (!noMore) {
                $.snackbar({
                    htmlAllowed: true,
                    content: `No more commits.`
                });
                noMore = true;
            }
            return
        }
        noMore = false;
        const retrieve = `${location.pathname}${href}`
        history.pushState({}, document.title, retrieve);

        const url = new URL(location);
        url.search = href;
        url.searchParams.append('ajax', 1)
        $.ajax({
            url: url.toString(),
            async: true,
            type: "GET",
        }).then(function (html) {
            $pager.after(html);
            $pager.remove();
            loading = false;
            window.gitlist.constructCommitsListConstructMarkdown()
            paginate();
            $('.p3x-gitlist-commit-list-no-more-commit').remove();
        });
    }


    function paginate() {
        $pager = $('#p3x-gitlist-pager-bottom');
        $noCommits = $('#p3x-gitlist-commits-no-more')
        if ($noCommits.length !== 0) {
            $pager.remove();
            return;
        }
        $button = $pager.find('#p3x-gitlist-commit-list-next');
        $button.one('click', function (e) {
            e.preventDefault();
            nextCommitListItem()
            return false;
        });
    }

    paginate();

    if ($button.length > 0) {
        $(window).scroll(function () {
            if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
                nextCommitListItem();
            }
        });
    }

})
