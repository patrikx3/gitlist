window.gitlist.codemirrorTheme = {
    light: 'idea',
    dark: 'dracula',
}

require('@fortawesome/fontawesome-free/css/all.css')

window.gitlist.snapckbarLongTimeout = 20000;
global.jQuery = require('jquery')
global.$ = global.jQuery;
require('snackbarjs');
require('jquery.redirect');
require('bootstrap');

global.twemoji = require('twemoji').default
const prodDir = require('../../package').corifeus["prod-dir"];
global.twemoji.base = `${prodDir}/twemoji/`;

require('./js/network.js')

require('./js/gitgraph.js/gitgraph.css')
require('./js/gitgraph.js/gitgraph.js')

require('./js/tree')
require('./js/treegraph')
require('./js/markdown')
require('./js/clone-buttons')
require('./js/paginate')
require('./js/browser')
require('./js/index.js')
require('./js/file')
require('./js/theme-switcher.js')
require('./js/commit')
require('./js/breadcrumb')
require('./js/commits-list')
require('./js/file-fragment')
require('./js/change-log')
require('./js/todo')
require('./js/global')


