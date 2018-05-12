document.addEventListener("DOMContentLoaded", function(event) {
    function paginate() {
        const $pager = $('.pager');

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

})
