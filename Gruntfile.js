const prodDir = require('./package').corifeus["prod-dir"]
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-less');

    const builder = require(`corifeus-builder`);
    const loader = new builder.loader(grunt);
    loader.js({
        replacer: {
            type: 'build',
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
                    development: require('./src/browser/grunt/less').lessSettings(grunt),
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

    grunt.registerTask('default', ['clean', 'less', 'copy', 'cory-npm', 'cory-replace']);
    grunt.registerTask('build', ['default']);

};

