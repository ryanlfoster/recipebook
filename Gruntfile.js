module.exports = function (grunt) {
    //grunt plugins
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-clear');
    grunt.loadNpmTasks('grunt-contrib-stylus');

    grunt.initConfig({

        watch: {
            stylus: {
                files: ['app/styles/**/*.styl'],
                tasks: ['stylus']
            }
        },

        stylus: {
            compile: {
                files: {
                    'app/styles/app.css': 'app/styles/app.styl'
                }
            }
        },

        requirejs: {
            compile: {
                options: {
                    appDir: "app/",
                    baseUrl: "js/",
                    dir: "app-build/",
                    optimize: 'none',
                    mainConfigFile: 'app/js/bootstrap.js',
                    modules: [
                        {
                            name: "bootstrap"
                        }
                    ],
                    removeCombined: true, //in the build delete files that get concatenated into others
                    logLevel: 0, //output results as they happen
                    findNestedDependencies: true, //add nested requires to the build
                    optimizeCss: "standard",
                    inlineText: true
                }
            }
        }
    });

    grunt.registerTask('build', ['stylus', 'requirejs']);
};