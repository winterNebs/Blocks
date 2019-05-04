module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //concat: {
        //    dist: {
        //        src: ['./dist/src/**/*.js'],
        //        dest: './dist/bundle.js',
        //        options: {
        //            banner: ";(function( window, undefined ){ \n 'use strict';",
        //            footer: "}( window ));"
        //        }
        //    }
        //},
        browserify: {
            dist: {
                files: {
                    './dist/bundled.js': ['./dist/src/**/*.js']
                },
                options: {
                    plugin: [
                        [
                            'remapify', [{
                                src: './dist/src/**/*.js',  // glob for the files to remap
                                expose: 'asc', // this will expose `__dirname + /client/views/home.js` as `views/home.js`
                                cwd: __dirname  // defaults to process.cwd()
                            }
                            ]
                        ]
                    ],
                    browserifyOptions: {
                        debug: true,
                        standalone: 'asc'
                    },
                }
            }
        },
        //uglify: {
        //    options: {
        //        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        //    },
        //    build: {
        //        src: 'src/<%= pkg.name %>.js',
        //        dest: 'build/<%= pkg.name %>.min.js'
        //    }
        //}
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-browserify');

    // Load the plugin that provides the "uglify" task.
    //grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['browserify']);
   // grunt.registerTask('default', ['concat', 'browserify'])
    //grunt.registerTask('default', function () {
    //    var browserify = require('browserify');
    //    var fs = require('file-system');
    //    var done = this.async();
    //
    //    browserify({ debug: true })
    //        .add('./dist/**/*.js')
    //        .bundle()
    //        .on('error', function (err) {
    //            console.log(err);
    //        })
    //        .pipe(fs.createWriteStream('./dist/bundled.js')
    //            .on('end', done));});
    //grunt.registerTask('default', ['uglify']);
};