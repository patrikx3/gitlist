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
global.twemoji = require('twemoji')
global.twemoji.base = 'webpack/assets/twemoji/';


require('./network-graph.js')

require('./gitgraph.js/gitgraph.css')
require('./gitgraph.js/gitgraph.js')

require('./gitgraph-draw')
require('./markdown')
require('./code-mirror')
require('./menu')
require('./clone-buttons')
require('./paginate')
require('./search-branch')
require('./search-repositories')
require('./global')
require('./theme-switcher.js')

