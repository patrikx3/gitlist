require('codemirror/lib/codemirror.css')
require('codemirror/theme/blackboard.css')
require('../less/style.less')
require('../less/fontawesome.less')

global.jQuery = require('jquery')
global.$ = global.jQuery;

require('bootstrap');

global.marked = require('marked')
global.htmlEncode = require('js-htmlencode')
global.CodeMirror = require('codemirror');
require('codemirror/addon/mode/simple');
require('codemirror/addon/mode/multiplex');
require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/css/css');
require('codemirror/mode/htmlmixed/htmlmixed');
require('codemirror/mode/handlebars/handlebars');
require('codemirror/mode/yaml/yaml');
require('codemirror/mode/sass/sass');
require('eve-raphael/eve.js');
global.Raphael = require('raphael')
global.phpDate = require('php-date')
global.twemoji = require('twemoji')
global.twemoji.base = 'webpack/assets/twemoji/';
global.List = require('./list.min.js')

require('./network-graph.js')

require('./gitgraph.js/gitgraph.css')
require('./gitgraph.js/gitgraph.js')

require('./gitgraph-draw')
require('./main')
require('./themes.js')
require('./theme-switcher.js')

