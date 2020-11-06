module.exports = function(grunt) {
    // Project configuration
    grunt.initConfig({
      // optionally read package.json
      pkg: grunt.file.readJSON('package.json'),

      // Metadata
      meta: {
        basePath: '../',             // your project path
        srcPath: './scss/',  // where you keep your sass files
        deployPath: './css/' // where you want your compiled css files
      },

      // info banner
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
              '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
              '* Copyright (c) <%= grunt.template.today("yyyy") %> ',

      // IMPORTANT: the task configuration
      sass: {
        dist: {
          files: {
            '<%= meta.deployPath %>style.css' : '<%= meta.srcPath %>style.scss',
          }
        }
      },

      // watch all .scss files under the srcPath
      watch: {
        scripts: {
          files: [
            '<%= meta.srcPath %>/**/*.scss'
          ],
          tasks: ['sass']
        }
      }
    });
    
    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task   
    grunt.registerTask("default", ['sass']);
};

// On command line inside the project directory, type `grunt watch` 