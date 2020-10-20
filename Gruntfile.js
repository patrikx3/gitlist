const fsExtra = require('fs-extra');
const path = require('path');

const prodDir = require('./package').corifeus["prod-dir"]
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-less');

    const builder = require(`corifeus-builder`);
    const gruntUtil = builder.utils;
    const loader = new builder.loader(grunt);

    const lessConfig =  require('./src/browser/grunt/less').lessSettings(grunt)

    loader.js({
        replacer: {
            type: 'p3x',
            node: false,
            npmio: false,
        },
        config:
            {
                clean: {
                    generated: [
                        `public/${prodDir}/css`,
                        `public/${prodDir}/twemoji`,
                        `public/${prodDir}/webpack`,
                    ],
                    css: [

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
                                dest: `./public/${prodDir}/twemoji/svg`
                            },

                        ]
                    },

                },
                less: {
                    development: lessConfig,
                },
                watch: {
                    less: {
                        files: ['src/browser/less/*.*'],
                        tasks: ['clean:css', 'less'],
                        options: {
                            atBegin: true,
                            //spawn: false,
                        },
                    },

                }
            }
    });

    grunt.registerTask('wait-empty', async function() {
        const done = this.async()
        setTimeout(() => {
            const deleteMe = path.resolve(`${process.cwd()}/public/prod/webpack`)
            console.log(deleteMe)
            fsExtra.emptyDirSync(deleteMe)
            done()
        }, 5000)
    })
    grunt.registerTask('build', async function() {
        const done = this.async()
        const cwd = process.cwd()

        try {

            await gruntUtil.spawn({
                grunt: grunt,
                gruntThis: this,

            }, {
                cmd: `${cwd}/node_modules/.bin/webpack${gruntUtil.commandAddon}`,
                args: [
                    '--mode=production',
                ]
            });

            done()
        } catch(e) {
            done(e)
        }
    })

//    grunt.registerTask('default', ['clean', 'less', 'copy', 'cory-npm', 'cory-replace', 'build']);
    grunt.registerTask('default', ['cory-npm', 'cory-replace', 'wait-empty', 'clean', 'less', 'copy', 'build']);
    grunt.registerTask('default-less', [ 'cory-npm', 'clean', 'less', 'copy','cory-replace']);

};

