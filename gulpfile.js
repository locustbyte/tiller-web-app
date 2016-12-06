var gulp = require('gulp');
var minify = require('gulp-minify');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var clean = require('gulp-clean');
var browserSync = require('browser-sync').create();
//var jshint = require('gulp-jshint');

/**
 * Cleanup
 */

gulp.task('clean-styles', function() {
    return gulp.src('dist/assets/css/*', {read: false})
        .pipe(clean());
});

gulp.task('clean-scripts', function() {
    return gulp.src('dist/assets/js/*', {read: false})
        .pipe(clean());
});

gulp.task('clean-images', function() {
    return gulp.src('dist/assets/img/*', {read: false})
        .pipe(clean());
});

gulp.task('clean-components', function() {
    return gulp.src('dist/components/*', {read: false})
        .pipe(clean());
});

gulp.task('clean-views', function() {
    return gulp.src('dist/views/*', {read: false})
        .pipe(clean());
});

gulp.task('clean-index', function() {
    return gulp.src('dist/index.html', {read: false})
        .pipe(clean());
});

gulp.task('clean-stub', function() {
    return gulp.src('dist/stub/*', {read: false})
        .pipe(clean());
});

/**
 * Builds
 */


/*gulp.task('build-nvd3', ['clean-styles'], function () {
    var stream = gulp.src('bower_components/nvd3/build/nv.d3.css')
        .pipe(gulp.dest('./dist/assets/css/'))
        .pipe(browserSync.stream());
    return stream;
});*/

gulp.task('build-styles', ['clean-styles'], function () {
    var stream = gulp.src('src/assets/sass/theme.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist/assets/css/'))
        .pipe(browserSync.stream());
    return stream;
});

gulp.task('build-scripts', ['clean-scripts'], function () {
    var stream = gulp.src(
        [
            'bower_components/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/jquery/jquery.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-environment/dist/angular-environment.js',
            'bower_components/angular-base64/angular-base64.js',
            //'bower_components/angular-animate/angular-animate.js',
            'bower_components/ngStorage/ngStorage.js',
            'bower_components/angular-pubsub/src/angular-pubsub.js',
            //'bower_components/roundSlider/dist/roundslider.min.js',
            'bower_components/waterRipple/js/ripple-min.js',
            'bower_components/angular-input-masks/angular-input-masks-standalone.js',
            'bower_components/angular-ui-router/release/angular-ui-router.min.js',
            'bower_components/d3/d3.js',
            'bower_components/moment/moment.js',
            'bower_components/perfect-scrollbar/min/perfect-scrollbar.min.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'bower_components/jquery.scrollbar/jquery.scrollbar.min.js',
            //'bower_components/angular-bootstrap/ui-bootstrap.js',
            'src/app/app.js',
			'src/app/e2e.js',
            'src/app/services/**/*.js',
            'src/app/directives/**/*.js',
            'src/app/views/**/*.js',
            '!src/app/**/*_test.js'
        ])
        .pipe(sourcemaps.init())
        //.pipe(jshint())
        //.pipe(jshint.reporter('default'))
        .pipe(concat('app.js'))
        //.pipe(minify())
        //.pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(browserSync.stream());
    return stream;
});

gulp.task('build-images', ['clean-images'], function () {
    return gulp.src('src/assets/img/**/*')
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/assets/img/'));
});

gulp.task('build-fonts', function () {
    return gulp.src('src/assets/fonts/**/*')
        .pipe(gulp.dest('dist/assets/fonts/'));
});

gulp.task('build-components', ['clean-components'], function() {
    var stream = gulp.src('src/app/components/**/*.html')
        .pipe(gulp.dest('dist/components/'))
        .pipe(browserSync.stream());
    return stream;
});

gulp.task('build-views', ['clean-views'], function() {
    var stream = gulp.src('src/app/views/**/*.html')
        .pipe(gulp.dest('dist/views/'))
        .pipe(browserSync.stream());
    return stream;
});

gulp.task('build-index', ['clean-index'], function() {
    var stream = gulp.src('src/app/index.html')
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.stream());
    return stream;
});

gulp.task('build-stub', ['clean-stub'], function () {
  return gulp.src('src/app/stubs/**/*.json')
    .pipe(gulp.dest('dist/stub/'))
	.pipe(browserSync.stream());
	return stream;
});

/**
 * Compression
 */

gulp.task('compress-scripts', ['build-scripts'], function() {
    gulp.src('dist/assets/js/app.js')
        .pipe(minify({
            mangle: false
        }))
        .pipe(gulp.dest('dist/assets/js'))
});

/**
 * Notifications
 */
gulp.task('notify-front-end', ['build-components', 'build-views', 'build-styles', 'build-scripts'], function() {
    gulp.src('src/app/index.html')
        .pipe(notify('Front-end build complete'));
});

gulp.task('notify-components', ['build-components'], function() {
    gulp.src('src/app/index.html')
        .pipe(notify('Components build complete'));
});

gulp.task('notify-views', ['build-views'], function() {
    gulp.src('src/app/index.html')
        .pipe(notify('View build complete'));
});

gulp.task('notify-styles', ['build-styles'], function() {
    gulp.src('src/app/index.html')
        .pipe(notify('Style build complete'));
});

gulp.task('notify-scripts', ['compress-scripts'], function() {
    gulp.src('src/app/index.html')
        .pipe(notify('Scripts build complete'));
});

gulp.task('notify-images', ['build-images'], function() {
    gulp.src('src/app/index.html')
        .pipe(notify('Images build complete'));
});

gulp.task('notify-fonts', ['build-fonts'], function() {
    gulp.src('src/app/index.html')
        .pipe(notify('Fonts build complete'));
});

gulp.task('notify-index', ['build-index'], function() {
    gulp.src('src/app/index.html')
        .pipe(notify('Index build complete'));
});

gulp.task('notify-stub', ['build-stub'], function() {
    gulp.src('src/app/index.html')
        .pipe(notify('Stub build complete'));
});

/**
 * Watch functionality for development
 */
gulp.task('watch', function() {

    browserSync.init({
        server: "./dist",
        port: 8000
    });

    gulp.watch(['src/assets/sass/**/*.scss'],['clean-styles', 'build-styles', 'notify-styles']);
    gulp.watch(['src/assets/img/**/*.*'],['clean-images', 'build-images', 'notify-images']);
    gulp.watch(['src/assets/fonts/**/*.*'],['build-fonts', 'notify-images']);
    gulp.watch(['src/app/**/*.js'],['clean-scripts', 'build-scripts', 'compress-scripts', 'notify-scripts']);
    gulp.watch(['src/app/components/**/*.html'],['clean-components', 'build-components', 'notify-components']);
    gulp.watch(['src/app/views/**/*.html'],['clean-views', 'build-views', 'notify-views']);
    gulp.watch(['src/app/index.html'],['clean-index', 'build-index', 'notify-index']);
    gulp.watch(['src/app/stubs/**/*.json'],['clean-stub', 'build-stub', 'notify-stub']);

});

gulp.task('default', ['clean-styles', 'build-styles', 'clean-scripts', 'build-scripts', 'compress-scripts', 'clean-components', 'build-components', 'clean-views', 'build-views', 'clean-images', 'build-images', 'build-fonts', 'clean-index', 'build-index', 'clean-stub', 'build-stub', 'notify-stub', 'notify-front-end']);
//gulp.task('default', ['clean-styles', 'build-styles', 'clean-scripts', 'build-scripts', 'clean-views', 'build-views', 'clean-images', 'build-fonts', 'clean-index', 'build-index', 'notify-front-end']);