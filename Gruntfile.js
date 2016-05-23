module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'assets/sass',
                    src: ['main.scss'],
                    dest: 'assets/css',
                    ext: '.css'
                }]
            }
        },

        watch: {
            sass: {
                files: ['assets/sass/*.scss', 'assets/sass/**/*.scss'],
                tasks: ['sass', 'autoprefixer', 'cssmin'],
            }
        },

        cssmin: {
            minify: {
                expand: true,
                cwd: 'assets/css',
                src: ['main.css', '!*.min.css'],
                dest: 'assets/css/',
                ext: '.min.css'
            }
        },

        autoprefixer: {
            dist: {
                files: {
                    'assets/css/main.css':'assets/css/main.css'
                }
            }
        }
    });

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-autoprefixer');

    grunt.registerTask('default', ['dev']);
    grunt.registerTask('dev', ['sass', 'autoprefixer', 'cssmin', 'watch']);
};