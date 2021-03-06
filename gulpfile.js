var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
// var mocha = require('gulp-mocha');
// var jscs = require('gulp-jscs');
// var jshint = require('gulp-jshint');

// gulp.task('test', function () {
//     gulp.src(['test/**/*.js/'])
//         .pipe(mocha({
//             reporter: 'list'
//         }));

// });

// gulp.task('lint', function () {
//     return gulp
//         .src(['./lib/**/*.js', './*.js'])
//         .pipe(jscs())
//         .pipe(jshint())
//         .pipe(jshint.reporter('jshint-stylish', {
//             verbose: true
//         }));
// });

gulp.task('default', function () {
	nodemon({
		script: 'src/app.js',
		ext: 'js',
		env: {
			PORT: 6500
		},
		ignore: ['./node_modules/**']
	}).on('start', [ /*'test'*/], function () {

	}).on('restart', function () {

	});
});

// gulp.task('dist', function () {
//     gulp
//         .src(['./src/**/*', './Dockerfile', './sonar-project.properties'])
//         .pipe(gulp.dest('./dist'));
// });