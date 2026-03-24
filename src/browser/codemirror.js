// CodeMirror 6 setup with CM5-compatible wrapper for GitList
const {EditorView, lineNumbers, highlightActiveLine, highlightActiveLineGutter, keymap, gutterLineClass, GutterMarker} = require('@codemirror/view');
const {EditorState, Compartment} = require('@codemirror/state');
const {syntaxHighlighting, defaultHighlightStyle, LanguageSupport, StreamLanguage, bracketMatching} = require('@codemirror/language');
const {defaultKeymap, history, historyKeymap} = require('@codemirror/commands');
const {searchKeymap, highlightSelectionMatches} = require('@codemirror/search');
const {oneDark} = require('@codemirror/theme-one-dark');

// Official CM6 language packages
const {javascript} = require('@codemirror/lang-javascript');
const {python} = require('@codemirror/lang-python');
const {php} = require('@codemirror/lang-php');
const {html} = require('@codemirror/lang-html');
const {css} = require('@codemirror/lang-css');
const {json} = require('@codemirror/lang-json');
const {markdown} = require('@codemirror/lang-markdown');
const {xml} = require('@codemirror/lang-xml');
const {sql} = require('@codemirror/lang-sql');
const {rust} = require('@codemirror/lang-rust');
const {cpp} = require('@codemirror/lang-cpp');
const {java} = require('@codemirror/lang-java');
const {go} = require('@codemirror/lang-go');
const {sass} = require('@codemirror/lang-sass');

// Legacy CM5 modes via StreamLanguage wrapper
const {lua} = require('@codemirror/legacy-modes/mode/lua');
const {ruby} = require('@codemirror/legacy-modes/mode/ruby');
const {perl} = require('@codemirror/legacy-modes/mode/perl');
const {shell} = require('@codemirror/legacy-modes/mode/shell');
const {yaml} = require('@codemirror/legacy-modes/mode/yaml');
const {dockerfile} = require('@codemirror/legacy-modes/mode/dockerfile');
const {haskell} = require('@codemirror/legacy-modes/mode/haskell');
const {clojure} = require('@codemirror/legacy-modes/mode/clojure');
const {erlang} = require('@codemirror/legacy-modes/mode/erlang');
const {pascal} = require('@codemirror/legacy-modes/mode/pascal');
const {coffeescript} = require('@codemirror/legacy-modes/mode/coffeescript');
const {diff} = require('@codemirror/legacy-modes/mode/diff');
const {cmake} = require('@codemirror/legacy-modes/mode/cmake');
const {r} = require('@codemirror/legacy-modes/mode/r');
const {swift} = require('@codemirror/legacy-modes/mode/swift');
const {groovy} = require('@codemirror/legacy-modes/mode/groovy');
const {scheme} = require('@codemirror/legacy-modes/mode/scheme');
const {powerShell} = require('@codemirror/legacy-modes/mode/powershell');
const {protobuf} = require('@codemirror/legacy-modes/mode/protobuf');
const {properties} = require('@codemirror/legacy-modes/mode/properties');
const {smalltalk} = require('@codemirror/legacy-modes/mode/smalltalk');
const {vb} = require('@codemirror/legacy-modes/mode/vb');
const {ntriples} = require('@codemirror/legacy-modes/mode/ntriples');
const {xQuery: xquery} = require('@codemirror/legacy-modes/mode/xquery');
const {vbScript} = require('@codemirror/legacy-modes/mode/vbscript');

// Map CM5 mode names to CM6 language extensions
function getLanguageExtension(mode) {
    if (!mode) return [];
    const m = mode.toLowerCase();

    // Official CM6 packages
    if (m === 'javascript' || m === 'application/javascript') return [javascript()];
    if (m === 'jsx') return [javascript({jsx: true})];
    if (m === 'application/typescript' || m === 'typescript') return [javascript({typescript: true})];
    if (m === 'python') return [python()];
    if (m === 'php' || m === 'application/x-httpd-php') return [php()];
    if (m === 'htmlmixed' || m === 'html') return [html()];
    if (m === 'css' || m === 'text/css') return [css()];
    if (m === 'application/json' || m === 'json') return [json()];
    if (m === 'markdown' || m === 'text/x-markdown') return [markdown()];
    if (m === 'xml' || m === 'application/xml') return [xml()];
    if (m === 'sql' || m === 'text/x-sql') return [sql()];
    if (m === 'rust') return [rust()];
    if (m === 'text/x-c++src' || m === 'text/x-csrc' || m === 'text/x-c') return [cpp()];
    if (m === 'text/x-java') return [java()];
    if (m === 'go') return [go()];
    if (m === 'sass' || m === 'text/x-scss') return [sass()];

    // Legacy modes via StreamLanguage
    const legacyMap = {
        'lua': lua, 'ruby': ruby, 'perl': perl, 'shell': shell,
        'yaml': yaml, 'dockerfile': dockerfile, 'haskell': haskell,
        'clojure': clojure, 'erlang': erlang, 'pascal': pascal,
        'coffeescript': coffeescript, 'diff': diff, 'cmake': cmake,
        'r': r, 'swift': swift, 'groovy': groovy, 'scheme': scheme,
        'powershell': powerShell, 'protobuf': protobuf,
        'properties': properties, 'smalltalk': smalltalk,
        'vbscript': vbScript, 'vb': vb, 'ntriples': ntriples,
        'xquery': xquery,
    };

    // Handle text/x-* MIME types from CM5
    const mimeMap = {
        'text/x-lua': lua, 'text/x-ruby': ruby, 'text/x-perl': perl,
        'text/x-sh': shell, 'text/x-yaml': yaml, 'text/x-dockerfile': dockerfile,
        'text/x-haskell': haskell, 'text/x-clojure': clojure,
        'text/x-erlang': erlang, 'text/x-pascal': pascal,
        'text/x-coffeescript': coffeescript, 'text/x-diff': diff,
        'text/x-cmake': cmake, 'text/x-rsrc': r, 'text/x-swift': swift,
        'text/x-groovy': groovy, 'text/x-scheme': scheme,
        'application/x-powershell': powerShell, 'text/x-protobuf': protobuf,
        'text/x-properties': properties, 'text/x-stsrc': smalltalk,
        'text/vbscript': vb,
    };

    if (legacyMap[m]) return [StreamLanguage.define(legacyMap[m])];
    if (mimeMap[m]) return [StreamLanguage.define(mimeMap[m])];

    // Fallback for clike modes
    if (m === 'text/x-csharp' || m === 'clike') return [cpp()];

    return [];
}

// Light theme (similar to 'idea')
const lightTheme = EditorView.theme({
    '&': { backgroundColor: '#ffffff', color: '#000000' },
    '.cm-gutters': { backgroundColor: '#f5f5f5', color: '#999', borderRight: '1px solid #ddd' },
    '.cm-activeLineGutter': { backgroundColor: '#e8f2ff' },
    '&.cm-focused .cm-activeLine': { backgroundColor: '#e8f2ff' },
}, {dark: false});

// Dark theme extension
const darkThemeExt = oneDark;

// Compartments for dynamic reconfiguration
const readOnlyComp = new Compartment();
const themeComp = new Compartment();
const languageComp = new Compartment();

function getThemeExtension(isDark) {
    return isDark ? darkThemeExt : lightTheme;
}

// CM5-compatible wrapper around CM6 EditorView
function createCM5Wrapper(view, options) {
    const wrapper = {
        _view: view,
        _options: options || {},

        getValue() {
            return view.state.doc.toString();
        },

        setValue(text) {
            view.dispatch({
                changes: {from: 0, to: view.state.doc.length, insert: text}
            });
        },

        setOption(key, val) {
            if (key === 'readOnly') {
                view.dispatch({effects: readOnlyComp.reconfigure(EditorState.readOnly.of(val))});
            } else if (key === 'theme') {
                // val is 'idea' or 'dracula' (CM5 theme names)
                const isDark = val === 'dracula';
                view.dispatch({effects: themeComp.reconfigure(getThemeExtension(isDark))});
            }
        },

        setSize(width, height) {
            if (height === '100%') {
                view.dom.style.height = 'auto';
                view.dom.style.maxHeight = 'none';
            } else if (typeof height === 'number') {
                view.dom.style.height = height + 'px';
                view.dom.style.maxHeight = height + 'px';
                view.dom.style.overflow = 'auto';
            }
        },

        setSelection(from, to) {
            const doc = view.state.doc;
            const fromLine = Math.max(0, Math.min(from.line, doc.lines - 1));
            const toLine = Math.max(0, Math.min(to.line, doc.lines - 1));
            const fromPos = doc.line(fromLine + 1).from;
            const toPos = doc.line(toLine + 1).to;
            view.dispatch({selection: {anchor: fromPos, head: toPos}});
            view.focus();
        },

        scrollIntoView(pos, margin) {
            const doc = view.state.doc;
            const line = Math.max(1, Math.min(pos.line, doc.lines));
            const linePos = doc.line(line).from;
            view.dispatch({
                effects: EditorView.scrollIntoView(linePos, {y: 'center'})
            });
            view.focus();
        },

        lineInfo(n) {
            return {line: n};
        },

        focus() {
            view.focus();
        },

        getWrapperElement() {
            return view.dom;
        },

        _handlers: {},

        on(event, handler) {
            if (!wrapper._handlers[event]) wrapper._handlers[event] = [];
            wrapper._handlers[event].push(handler);
        },

        _emit(event, ...args) {
            if (wrapper._handlers[event]) {
                wrapper._handlers[event].forEach(h => h(wrapper, ...args));
            }
        }
    };
    return wrapper;
}

// Main factory function - replaces global CodeMirror()
global.CodeMirror = function(callback, options) {
    const isDark = window.gitlist.isDark();
    const langExt = getLanguageExtension(options.mode);

    const extensions = [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        bracketMatching(),
        history(),
        highlightSelectionMatches(),
        keymap.of([...defaultKeymap, ...historyKeymap, ...searchKeymap]),
        syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
        EditorView.lineWrapping,
        readOnlyComp.of(EditorState.readOnly.of(options.readOnly !== false)),
        themeComp.of(getThemeExtension(isDark)),
        languageComp.of(langExt),
    ];

    const state = EditorState.create({
        doc: options.value || '',
        extensions: extensions,
    });

    const parent = document.createElement('div');
    parent.className = 'cm-editor-wrapper';

    const view = new EditorView({
        state: state,
        parent: parent,
    });

    if (typeof callback === 'function') {
        callback(parent);
    }

    const wrapper = createCM5Wrapper(view, options);

    // Click handler - gutter clicks emit gutterClick, all clicks update URL hash
    view.dom.addEventListener('click', (event) => {
        const pos = view.posAtCoords({x: event.clientX, y: event.clientY});
        if (pos === null) return;
        const lineNum = view.state.doc.lineAt(pos).number;

        const target = event.target;
        if (target.closest && target.closest('.cm-gutterElement')) {
            // Gutter click - emit event for file.js handler
            wrapper._emit('gutterClick', lineNum - 1);
        }

        // Update URL hash with current line on any click
        location.hash = '#L' + lineNum;
    });

    return wrapper;
};
