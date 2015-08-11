module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            files: ['Gruntfile.js', 'src/javascript/**/*.js', 'test/spec/**/*.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },
        less: {
            development: {
                options: {
                    compress: false,
                },
                files: {
                    "./src/assets/css/mygame.css": "./src/assets/less/main.less"
                }
            },
            prod: {
                options: {
                    compress: true,
                },
                files: {
                    "./src/assets/css/mygame.<%= pkg.version %>.min.css": "./src/assets/less/main.less"
                }
            }
        },
        concat: {
            vendor: {
                src: [
                    './bower_components/jquery/dist/jquery.js'
                ],
                dest: './src/assets/js/vendors.js',
            },
            js: {
                src: [
                    'src/javascript/utils/**/*.js',
                    'src/javascript/services/**/*.js',
                    'src/javascript/controllers/**/*.js'
                ],
                dest: './src/assets/js/mygame.js',
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            frontend: {
                files: {
                    './src/assets/js/mygame.<%= pkg.version %>.min.js': './src/assets/js/mygame.js',
                }
            },
            vendor: {
                files: {
                    './src/assets/js/vendors.<%= pkg.version %>.min.js': './src/assets/js/vendors.js',
                }
            }
        },
        replace: {
            prod: {
                src: ['./src/index.html'],
                dest: './src/index.html',
                replacements: [{
                    from: 'vendors.js',
                    to: 'vendors.<%= pkg.version %>.min.js'
                }, {
                    from: 'mygame.js',
                    to: 'mygame.<%= pkg.version %>.min.js'
                }, {
                    from: 'mygame.css',
                    to: 'mygame.<%= pkg.version %>.min.css'
                }]
            },
            dev: {
                src: ['./src/index.html'],
                dest: './src/index.html',
                replacements: [{
                    from: 'vendors.<%= pkg.version %>.min.js',
                    to: 'vendors.js'
                }, {
                    from: 'mygame.<%= pkg.version %>.min.js',
                    to: 'mygame.js'
                }, {
                    from: 'mygame.<%= pkg.version %>.min.css',
                    to: 'mygame.css'
                }]
            }
        },
        watch: {
            js: {
                files: ['Gruntfile.js','karma.conf.js','src/javascript/**/*.js', 'test/spec/**/*.js'],
                tasks: ['jshint', 'concat:js', 'karma'],
                options: {
                    livereload: true
                }
            },
            less: {
                files: ['./src/assets/**/*.less'],
                tasks: ['less:development'],
                options: {
                    livereload: true
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },
        connect: {
            server: {
                options:{
                    base: ["src"],
                    port: 9009,
                    hostname: "*",
                    keepalive: true
                }
            }
        },
        open: {
            all: {
                path: 'http://localhost:<%= connect.server.options.port%>'
            }
        },
        clean: ["test/coverage", "src/assets/js", "src/assets/css"]
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');

    grunt.registerTask('run', ['clean', 'less:prod', 'concat', 'uglify', 'replace:prod', 'open', 'connect']);

    grunt.registerTask('default', ['dev']);
    grunt.registerTask('dev', ['clean', 'jshint', 'less:development', 'concat', 'replace:dev', 'watch']);

    grunt.registerTask('test', ['clean', 'jshint', 'concat', 'replace:dev', 'karma', 'watch']);
};
