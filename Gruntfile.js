module.exports = function(grunt){

	// grunt config
	grunt.initConfig({
	  uglify: {
	    my_target: {
	      files: {
	        'dest/bootstrap-moodle.min.js': ['src/bootstrap-moodle.js']
	      }
	    }
	  }
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');

	// tasks
	grunt.registerTask('default', ['uglify']);
};