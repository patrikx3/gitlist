window.gitlist.codemirrorTheme = {
    light: 'light',
    dark: 'dracula',
}

require('@fortawesome/fontawesome-free/css/all.css')

window.gitlist.snapckbarLongTimeout = 20000;
global.jQuery = require('jquery')
global.$ = global.jQuery;
// BS5 Toast replacement for snackbarjs - provides $.snackbar() compatibility
(function($) {
    let container = null;
    const ensureContainer = () => {
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            container.style.zIndex = '9999';
            document.body.appendChild(container);
        }
        return container;
    };
    $.snackbar = function(options) {
        const content = options.content || '';
        const timeout = options.timeout || 5000;
        const htmlAllowed = options.htmlAllowed || false;

        const toastEl = document.createElement('div');
        toastEl.className = 'toast show';
        toastEl.setAttribute('role', 'alert');
        const isDark = window.gitlist.isDark();
        toastEl.className = 'toast show ' + (isDark ? 'text-bg-light' : 'text-bg-dark');
        toastEl.innerHTML = `
            <div class="toast-body d-flex align-items-center justify-content-between">
                <span>${htmlAllowed ? content : $('<span>').text(content).html()}</span>
                <button type="button" class="btn-close ${isDark ? '' : 'btn-close-white'} ms-2" data-bs-dismiss="toast"></button>
            </div>`;

        ensureContainer().appendChild(toastEl);
        const bsToast = new bootstrap.Toast(toastEl, { delay: timeout, autohide: true });
        bsToast.show();
        toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    };
})(jQuery);
const bootstrap = require('bootstrap');
window.bootstrap = bootstrap;

global.twemoji = require('twemoji').default
const prodDir = require('../../package').corifeus["prod-dir"];
global.twemoji.base = `${prodDir}/twemoji/`;

global.hljs = require('./js/hljs-loader');

require('./js/network.js')

require('./js/gitgraph.js/gitgraph.css')
require('./js/gitgraph.js/gitgraph.js')

require('./js/tree')
require('./js/treegraph')
require('./js/markdown')
require('./js/html-viewer')
require('./js/clone-buttons')
require('./js/paginate')
require('./js/browser')
require('./js/index.js')
require('./js/file')
require('./js/theme-switcher.js')
require('./js/language-switcher.js')
require('./js/commit')
require('./js/breadcrumb')
require('./js/commits-list')
require('./js/file-fragment')
require('./js/blame')
require('./js/change-log')
require('./js/todo')
require('./js/global')


