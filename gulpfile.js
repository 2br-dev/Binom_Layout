const gulp				 = require('gulp');
const gulpSass			 = require('gulp-sass');
const nodeSass			 = require('node-sass');
const sass				 = gulpSass(nodeSass);
const browserify		 = require('browserify');
const source			 = require('vinyl-source-stream');
const include			 = require('gulp-file-include');
const autoprefixer		 = require('gulp-autoprefixer');
const babelify			 = require('babelify');
const buffer			 = require('gulp-buffer');

const browserSync		 = require('browser-sync').init({
	server: {
		baseDir: './release/'
	}
});


gulp.task('html', () => {
	return gulp.src("./src/html/**/*.html")
		.pipe(include({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('./release'))
		.pipe(browserSync.stream())
});


gulp.task('scss', () => {
	return gulp.src("./src/scss/**/*.scss")
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(autoprefixer())
		.pipe(gulp.dest('./release/css'))
		.pipe(browserSync.stream())
});

gulp.task('js', () => {
	return browserify("./src/js/master.js").transform(babelify.configure({
		presets: ['@babel/preset-env']
	}))
	.bundle()
	.pipe(source('master.js'))
	.pipe(buffer())
	.pipe(gulp.dest('./release/js'))
	.pipe(browserSync.stream())
});

gulp.task('watch', () => {
	gulp.watch("./src/html/**/*.html", gulp.series('html'));
	gulp.watch("./src/scss/**/*.scss", gulp.series('scss'));
	gulp.watch("./src/js/**/*.js", gulp.series('js'));
})