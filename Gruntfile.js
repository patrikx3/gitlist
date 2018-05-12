const fs = require('fs');
const fsExtra = require('fs-extra');

module.exports = function (grunt) {

    const themeDir = './public/less/theme';

    const filesLess = {
    }


    const root = './node_modules/bootswatch';
    const watches = fs.readdirSync(root);
    const themes = ['default'];
    const excluded = ['fonts'];
    const themeCss = {
        'bootstrap-default': '/css/bootstrap-default.css',
    }

    for(let path of watches) {
        const stat = fs.statSync(`${root}/${path}`);
        if (stat.isDirectory() && !excluded.includes(path)) {
            themes.push(path);
            themeCss[`bootstrap-${path}`] = `/css/bootstrap-${path}.css`;
        }
    }
    fsExtra.ensureDirSync(themeDir);

    for(let theme of themes) {
        const less = `${themeDir}/${theme}.less`;

        if (theme === 'default') {
            fs.writeFileSync(less, `
@import "../../../node_modules/bootstrap/less/bootstrap";
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
        filesLess[`public/css/bootstrap-${theme}.css`] = less;

    }


    fs.writeFileSync(`./public/js/themes.js`, `
module.exports = ${JSON.stringify(themeCss, null, 4)}
`);

//    grunt.log.writeln(JSON.stringify(filesLess, null, 2))

    grunt.loadNpmTasks('grunt-contrib-less');


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
                                dest: './public/webpack/assets/twemoji/svg'
                            },

                        ]
                    },
                },
                less: {
                    development: {
                        options: {
                            compress: true,
                        },
                        files: filesLess
                    },

                },

                watch: {
                    less: {
                        files: ['public/assets/less/*.*'],
                        tasks: ['less'],
                        options: {
                            atBegin: true,
                            //spawn: false,
                        },
                    },
                }
            }
    });

    grunt.registerTask('default', ['clean','less', 'copy', 'cory-replace']);
    grunt.registerTask('build', ['default']);
    grunt.registerTask('run', ['watch:less']);

};

