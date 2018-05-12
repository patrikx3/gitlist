document.addEventListener("DOMContentLoaded", function(event) {
    function paginate() {
        const $pager = $('.pager');

        $pager.find('.next a').one('click', function (e) {
            e.preventDefault();
            const url = new URL(this.href);
            const retrieve = `${location.pathname}${url.search}`

            $.ajax({
                url: retrieve,
                type: "GET",
                cache: false,
                success: function (html) {
                    $pager.after(html);
                    $pager.remove();
                    paginate();
                }
            });
        });

        $pager.find('.previous').remove();
    }
    paginate();

})
