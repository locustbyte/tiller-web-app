//jshint strict: false
module.exports = function(config) {
  config.set({

    basePath: './',

    files: [
      'bower_components/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/jquery/jquery.js',
      'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
	  'bower_components/karma-read-json/karma-read-json.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-environment/dist/angular-environment.js',
      'bower_components/angular-base64/angular-base64.js',
      'bower_components/ngStorage/ngStorage.js',
      'bower_components/angular-pubsub/src/angular-pubsub.js',
      'bower_components/roundSlider/dist/roundslider.min.js',
      'bower_components/waterRipple/js/ripple-min.js',
      'bower_components/angular-input-masks/angular-input-masks-standalone.js',
      'bower_components/angular-ui-router/release/angular-ui-router.min.js',
      'bower_components/d3/d3.js',
      'bower_components/moment/moment.js',
      'bower_components/perfect-scrollbar/min/perfect-scrollbar.min.js',
      'src/app/mocks/*.js',
	  'src/app/tests/**/*.js',
      'src/app/app.js',
      'src/app/services/**/*.js',
      'src/app/directives/**/*.js',
      'src/app/views/**/*.js',
	  // fixtures
		{ pattern: 'src/app/stubs/**/*.json',
			watched: true,
			served:  true,
			included: false
		}
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-junit-reporter'
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
