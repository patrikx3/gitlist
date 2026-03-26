const hljs = require('highlight.js/lib/common');

// Extra languages not in common
hljs.registerLanguage('conf', require('highlight.js/lib/languages/nginx'));
hljs.registerLanguage('cmake', require('highlight.js/lib/languages/cmake'));
hljs.registerLanguage('dockerfile', require('highlight.js/lib/languages/dockerfile'));
hljs.registerLanguage('Dockerfile', require('highlight.js/lib/languages/dockerfile'));
hljs.registerLanguage('powershell', require('highlight.js/lib/languages/powershell'));

// Aliases for common extensions
hljs.registerLanguage('yml', require('highlight.js/lib/languages/yaml'));
hljs.registerLanguage('js', require('highlight.js/lib/languages/javascript'));
hljs.registerLanguage('ts', require('highlight.js/lib/languages/typescript'));
hljs.registerLanguage('sh', require('highlight.js/lib/languages/shell'));
hljs.registerLanguage('cmd', require('highlight.js/lib/languages/shell'));
hljs.registerLanguage('py', require('highlight.js/lib/languages/python'));

module.exports = hljs;
