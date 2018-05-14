require('codemirror/lib/codemirror.css')
require('codemirror/theme/dracula.css')
require('codemirror/theme/idea.css')
require('../less/style.less')
require('../less/fontawesome.less')

global.jQuery = require('jquery')
global.$ = global.jQuery;

require('bootstrap');
require('snackbarjs');
require('animate.css');

global.marked = require('marked')
global.htmlEncode = require('js-htmlencode')
global.CodeMirror = require('codemirror');
require('codemirror/addon/mode/simple');
require('codemirror/addon/mode/multiplex');

require('codemirror/mode/cmake/cmake');
require('codemirror/mode/css/css');
require('codemirror/mode/dockerfile/dockerfile');
require('codemirror/mode/go/go');
require('codemirror/mode/handlebars/handlebars');
require('codemirror/mode/htmlmixed/htmlmixed');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/jsx/jsx');
require('codemirror/mode/perl/perl');
require('codemirror/mode/php/php');
require('codemirror/mode/powershell/powershell');
require('codemirror/mode/python/python');
require('codemirror/mode/ruby/ruby');
require('codemirror/mode/sass/sass');
require('codemirror/mode/shell/shell');
require('codemirror/mode/sql/sql');
require('codemirror/mode/swift/swift');
require('codemirror/mode/twig/twig');
require('codemirror/mode/vue/vue');
require('codemirror/mode/xml/xml');
require('codemirror/mode/xquery/xquery');
require('codemirror/mode/yaml/yaml');

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
require('./theme-switcher.js')
require('./global')

