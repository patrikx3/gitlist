$(function () {
    const $iframe = $('#p3x-gitlist-html-viewer');
    if ($iframe.length === 0) {
        return;
    }

    const iframe = $iframe[0];

    // auto-resize iframe to fit content
    const resize = () => {
        try {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            const body = doc.body;
            const html = doc.documentElement;
            const height = Math.max(
                body.scrollHeight, body.offsetHeight,
                html.clientHeight, html.scrollHeight, html.offsetHeight
            );
            $iframe.css('height', Math.max(height, 200) + 'px');
        } catch (e) {
            // sandbox restriction
        }
    };

    iframe.addEventListener('load', resize);
    setTimeout(resize, 100);
    setTimeout(resize, 500);
});
