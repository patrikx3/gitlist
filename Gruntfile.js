const fsExtra = require('fs-extra');
const path = require('path');

module.exports = function (grunt) {

    const prodDir = JSON.parse(require('fs').readFileSync('./package.json')).corifeus["prod-dir"]

    grunt.loadNpmTasks('grunt-sass');

    const builder = require(`corifeus-builder`);
    const gruntUtil = builder.utils;
    const loader = new builder.loader(grunt);

    const sassConfig =  require('./src/browser/grunt/sass').sassSettings(grunt)

    loader.js({
        replacer: {
            type: 'p3x',
            node: false,         
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
                sass: {
                    development: sassConfig,
                },
                watch: {
                    sass: {
                        files: ['src/browser/scss/**/*.*'],
                        tasks: ['clean:css', 'sass'],
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
            try {
                fsExtra.emptyDirSync(deleteMe)
            } catch(e) {
                // Fix Docker root-owned files
                require('child_process').execSync(`sudo chown -R $(id -u):$(id -g) "${deleteMe}" 2>/dev/null || true`)
                fsExtra.emptyDirSync(deleteMe)
            }
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
    grunt.registerTask('fix-perms', function() {
        const cwd = process.cwd()
        try {
            require('child_process').execSync(`sudo chown -R $(id -u):$(id -g) "${cwd}/public/prod" "${cwd}/build" 2>/dev/null || true`)
        } catch(e) {}
    });
    grunt.registerTask('default', ['fix-perms', 'cory-npm', 'cory-replace', 'wait-empty', 'clean', 'sass', 'copy', 'build']);
    grunt.registerTask('default-sass', [ 'cory-npm', 'clean', 'sass', 'copy','cory-replace']);

};

