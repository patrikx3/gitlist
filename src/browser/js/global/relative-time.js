// Relative time display using native Intl.RelativeTimeFormat
window.gitlist.formatRelativeTime = function (dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date - now;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    const diffWeek = Math.round(diffDay / 7);
    const diffMonth = Math.round(diffDay / 30);
    const diffYear = Math.round(diffDay / 365);

    const lang = window.gitlist.lang || 'en';
    let rtf;
    try {
        rtf = new Intl.RelativeTimeFormat(lang, {numeric: 'auto'});
    } catch (e) {
        rtf = new Intl.RelativeTimeFormat('en', {numeric: 'auto'});
    }

    if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
    if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
    if (Math.abs(diffHour) < 24) return rtf.format(diffHour, 'hour');
    if (Math.abs(diffDay) < 7) return rtf.format(diffDay, 'day');
    if (Math.abs(diffWeek) < 4) return rtf.format(diffWeek, 'week');
    if (Math.abs(diffMonth) < 12) return rtf.format(diffMonth, 'month');
    return rtf.format(diffYear, 'year');
};

window.gitlist.updateRelativeTimes = function () {
    document.querySelectorAll('time[datetime]').forEach(function (el) {
        const iso = el.getAttribute('datetime');
        if (iso) {
            el.setAttribute('title', el.textContent.trim());
            const relative = window.gitlist.formatRelativeTime(iso);
            if (!el.querySelector('.p3x-gitlist-relative-time')) {
                const span = document.createElement('span');
                span.className = 'p3x-gitlist-relative-time';
                span.textContent = ' (' + relative + ')';
                el.appendChild(span);
            }
        }
    });
};
