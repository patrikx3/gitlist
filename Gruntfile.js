const fs = require('fs');
const fsExtra = require('fs-extra');
const glob = require('glob');
const crypto = require('crypto');

module.exports = function (grunt) {

    let lessLastHash = undefined;
    let lessFiles;
    const lessSettings = {
        options: {
            sourceMap: true,
            compress: true,
        },
        get files() {
            const files = glob.sync(`${__dirname}/public/less/**/*.*`)
            let string = ''
            for (let filename of files) {
                string += fs.readFileSync(filename, 'utf8')
            }
            const lessHash = crypto.createHash('sha256').update(string).digest("hex");

            const generateLessFiles = () => {
                const themeDir = './public/less/theme';

                const filesLess = {}

                const root = './node_modules/bootswatch';
                const watches = fs.readdirSync(root);
                const themes = [
                    'default',
                    'solar',
                ];
                const excluded = ['fonts'];

                // css with random
                const themeCss = {
                    'bootstrap-default': `/generated/css/bootstrap-default.${lessHash}.css`,
                    'bootstrap-solar': `/generated/css/bootstrap-solar.${lessHash}.css`,
                }

                for (let path of watches) {
                    const stat = fs.statSync(`${root}/${path}`);
                    if (stat.isDirectory() && !excluded.includes(path)) {
                        themes.push(path);
                        themeCss[`bootstrap-${path}`] = `/generated/css/bootstrap-${path}.${lessHash}.css`;
                    }
                }
                // -- css with random


                // less with random
                fsExtra.ensureDirSync(themeDir);

                for (let theme of themes) {
                    const less = `${themeDir}/${theme}.less`;

                    if (theme === 'default') {
                        fs.writeFileSync(less, `
@import "../../../node_modules/bootstrap/less/bootstrap";
@import "../default";
`)
                    } else if (theme === 'solar') {
                        fs.writeFileSync(less, `
@import "../../../node_modules/bootstrap/less/bootstrap";
@import "solar/variables";
@import "solar/bootswatch";
@import "../default";
`)
                    } else {
                        fs.writeFileSync(less, `
@import "../../../node_modules/bootstrap/less/bootstrap";
@import "../../../node_modules/bootswatch/${theme}/variables";
@import "../../../node_modules/bootswatch/${theme}/bootswatch";
@import "../default";
`)

                    }
//        console.log(less)
                    filesLess[`public/generated/css/bootstrap-${theme}.${lessHash}.css`] = less;

                }
                // -- less with random


                fs.writeFileSync(`./public/js/themes.js`, `
const themes = ${JSON.stringify(themeCss, null, 4)};
module.exports = themes;
`);
                return filesLess
//    grunt.log.writeln(JSON.stringify(filesLess, null, 2))
            }

            if (lessLastHash === lessHash) {
                grunt.log.writeln(`less hash is the same - ${lessHash}`)
                return lessFiles
            }
            grunt.log.writeln(`less hash new - ${lessHash}`)

            fs.writeFileSync(`${__dirname}/src/css-postfix`, lessHash)
            grunt.log.writeln('The css postfix file has been saved!');
            lessFiles = generateLessFiles();
            return lessFiles;
        }
    };

    grunt.loadNpmTasks('grunt-contrib-less');

    const builder = require(`corifeus-builder`);
    const loader = new builder.loader(grunt);
    loader.js({
        replacer: {
            type: 'p3x',
            npmio: false,
        },
        config:
            {
                injector: {
                    options: {},
                    gitlistNg: {
                        options: {
                            transform: function (filePath) {
                                const relative = builder.utils.injectorRelativePathGenerator({
                                    srcDir: 'public/js/injector',
                                    filePath: filePath,
                                })
                                return `require('./${relative}');`;
                            },
                            starttag: '//injector-angular-start',
                            endtag: '//injector-angular-end'
                        },
                        files: {
                            'public/js/injector/angular.js': [
                                'public/js/angular/**/*.js',
                            ],
                        }
                    },
                },
                clean: {
                    generated: [
                        'public/generated',
                        'public/webpack',
                    ],
                    css: [
                        'public/generated/css'
                    ]
                    /*
                    themes: [
                        themeDir
                    ],
                    fonts: [
                        'public/fonts'
                    ]
                    */
                },
                copy: {
                    tweomji: {
                        files: [
                            {
                                cwd: 'node_modules/twemoji/2/svg',
                                expand: true,
                                src: [
                                    '**',
                                ],
                                dest: './public/generated/twemoji/svg'
                            },

                        ]
                    },
                },
                less: {
                    development: lessSettings,
                },
                watch: {
                    less: {
                        files: ['public/less/*.*'],
                        tasks: ['clean:css', 'less'],
                        options: {
                            atBegin: true,
                            //spawn: false,
                        },
                    },
                    ng: {
                        files: ['public/js/angular/*.*'],
                        tasks: ['injector:gitlistNg'],
                        options: {
                            atBegin: true,
                            //spawn: false,
                        },
                    },
                }
            }
    });

    grunt.registerTask('default', ['clean', 'less', 'injector', 'copy', 'cory-npm', 'cory-replace']);
    grunt.registerTask('build', ['default']);

};

