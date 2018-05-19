
module.exports = function (grunt) {

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
                    development: require('./grunt/less').lessSettings(grunt),
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

                }
            }
    });

    grunt.registerTask('default', ['clean', 'less', 'copy', 'cory-npm', 'cory-replace']);
    grunt.registerTask('build', ['default']);

};

