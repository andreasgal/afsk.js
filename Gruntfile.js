/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: ['*.js'],
    },
    nodeunit: {
      all: ['tests/*.js'],
    },
  });

  // Load the npm installed tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['nodeunit']);

  // The default tasks to run when you type: grunt
  grunt.registerTask('default', ['jshint']);
};
