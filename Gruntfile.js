const fs = require('fs');
const fsExtra = require('fs-extra');

module.exports = function (grunt) {

    const themeDir = './themes/default/less/theme';

    const filesLess = {
        'themes/default/css/style.css': 'themes/default/less/style.less',
        'themes/default/css/fontawesome.css': 'themes/default/less/fontawesome.less',
    }

    const wiredepOverrides = {
        // for jgrowl it requires animate, so slim is not good
        'jquery': {
            main: 'dist/jquery.js'
        },
        codemirror: {
            main: [
                'lib/codemirror.css',
                'lib/codemirror.js',
                'addon/mode/simple.js',
                'addon/mode/multiplex.js',
                'addon/mode/multiplex.js',
                'mode/xml/xml.js',
                'mode/javascript/javascript.js',
                'mode/css/css.js',
                'mode/htmlmixed/htmlmixed.js',
                'mode/handlebars/handlebars.js',
                'mode/yaml/yaml.js',
                'mode/sass/sass.js',
            ]
        },
        twemoji: {
            main: [
                '2/twemoji.js',
            ]
        }
    };


    const root = './node_modules/bootswatch';
    const watches = fs.readdirSync(root);
    const themes = ['default'];
    const excluded = ['fonts'];
    const themeCss = {
        'bootstrap-default': '/themes/default/css/bootstrap-default.css',
    }

    for(let path of watches) {
        const stat = fs.statSync(`${root}/${path}`);
        if (stat.isDirectory() && !excluded.includes(path)) {
            themes.push(path);
            themeCss[`bootstrap-${path}`] = `/themes/default/css/bootstrap-${path}.css`;
        }
    }
    fsExtra.ensureDirSync(themeDir);

    for(let theme of themes) {
        const less = `${themeDir}/${theme}.less`;

        if (theme === 'default') {
            fs.writeFileSync(less, `
@import "../../../../node_modules/bootstrap/less/bootstrap";
@import "../default";
`)

        } else {
            fs.writeFileSync(less, `
@import "../../../../node_modules/bootstrap/less/bootstrap";
@import "../../../../node_modules/bootswatch/${theme}/variables";
@import "../../../../node_modules/bootswatch/${theme}/bootswatch";
@import "../default";
`)

        }
//        console.log(less)
        filesLess[`themes/default/css/bootstrap-${theme}.css`] = less;

    }


    fs.writeFileSync(`./themes/default/js/themes.js`, `
var themes = ${JSON.stringify(themeCss, null, 4)}
`);

//    grunt.log.writeln(JSON.stringify(filesLess, null, 2))

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-wiredep');

    const builder = require(`corifeus-builder`);
    const loader = new builder.loader(grunt);
    loader.js({
        replacer: {
            type: 'p3x',
            npmio: false,
            node: false,
        },
        config:
            {
                clean: {
                    /*
                    themes: [
                        themeDir
                    ],
                    fonts: [
                        'themes/default/fonts'
                    ]
                    */
                },
                copy: {
                    bootstrap: {
                        expand: true,
                        cwd: './node_modules/bootstrap/fonts',
                        src: '**',
                        dest: 'themes/default/fonts/',
                    },
                    fontawesome: {
                        expand: true,
                        cwd: './node_modules/font-awesome/fonts',
                        src: '**',
                        dest: 'themes/default/fonts/',
                    },
                },
                less: {
                    development: {
                        files: filesLess
                    },

                },
                wiredep: {
                    target: {
                        src: 'themes/default/twig/layout.twig',
                        ignorePath: '../../..',
                        overrides: wiredepOverrides,
                        //              exclude: wiredepExclude
                        fileTypes: {
                            twig: {
                                block: /(([ \t]*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
                                detect: {
                                    js: /<script.*src=['"]([^'"]+)/gi,
                                    css: /<link.*href=['"]([^'"]+)/gi
                                },
                                replace: {
                                    js: '<script src="\{\{ app.url_subdir \}\}{{filePath}}"></script>',
                                    css: '<link rel="stylesheet" href="\{\{ app.url_subdir \}\}{{filePath}}" />'
                                }
                            },
                        },

                    }
                },
                watch: {
                    scripts: {
                        files: ['themes/default/**/*.*'],
                        tasks: ['less'],
                        options: {
                            atBegin: true,
                            spawn: false,
                        },
                    },
                }
            }
    });

    grunt.registerTask('default', ['clean','copy', 'less', 'wiredep', 'cory-replace']);
    grunt.registerTask('build', ['default']);
    grunt.registerTask('run', ['watch:scripts']);

};

