let isWatchingSass = false;
for (let testWatching of process.argv) {
    if (testWatching.includes('clean:css')) {
        isWatchingSass = true;
        break;
    }
}

module.exports = function (grunt) {

    const gruntUtils = require('./grunt/scss')

    const sassOptions = {
        options: {
//            arguments: process.argv,
//            isWatching: isWatchingSass,
            //require('./grunt/license')();
            sourceMap: isWatchingSass ? undefined : true,
            outputStyle: isWatchingSass ? 'expanded' : 'compressed',
            importer: gruntUtils.nodeSassCssImporter()
        },
        development: gruntUtils.scssSettings(grunt),
    };

//    console.log(sassOptions)

    grunt.loadNpmTasks('grunt-sass');

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
                sass: sassOptions,
                watch: {
                    scss: {
                        files: ['public/scss/*.*'],
                        tasks: ['clean:css', 'sass'],
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

    grunt.registerTask('default', ['clean', 'sass', 'injector', 'copy', 'cory-npm', 'cory-replace']);
    grunt.registerTask('build', ['default']);

};

