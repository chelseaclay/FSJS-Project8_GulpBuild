'use strict'

var gulp = require('gulp'),
     del = require('del'),
  minifier = require('minifier'),
  concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
  rename = require('gulp-rename'),
imagemin = require('gulp-imagemin'),
webserver = require('gulp-webserver');

gulp.task('concatJS', function() {
  return gulp.src([
    'js/circle/autogrow.js',
    'js/circle/circle.js'
  ])
  .pipe(maps.init())
  .pipe(concat('global.js'))
  .pipe(maps.write('./'))
  .pipe(gulp.dest('js'));
});

gulp.task('minifyJS', ['concatJS'], function() {
  minifier.minify('js/global.js')
  return gulp.src('js/global.min.js')
  // .pipe(minifier.minify())
  .pipe(rename('all.min.js'))
  .pipe(gulp.dest('js'));
});

gulp.task('compileSass', function() {
  return gulp.src('sass/global.scss')
  .pipe(maps.init())
  .pipe(sass())
  .pipe(maps.write('./'))
  .pipe(gulp.dest('css'));
});

gulp.task('minifyCSS', ['compileSass'], function() {
  minifier.minify('css/global.css');
  return gulp.src('css/global.min.css')
  .pipe(rename('all.min.css'))
  .pipe(gulp.dest('css'));
});

gulp.task('watchSass', function() {
  return gulp.watch('sass/**/*.scss', ['styles']);
});

gulp.task('styles', ['minifyCSS'], function() {
  return gulp.src(['css/global.css.map', 'css/all.min.css'])
  .pipe(gulp.dest('dist/styles'));
});

gulp.task('scripts', ['minifyJS'], function() {
  return gulp.src(['js/global.js.map', 'js/all.min.js'])
  .pipe(gulp.dest('dist/scripts'));
});

gulp.task('images', ['clean'], function() {
  return gulp.src('images/*')
        .pipe(imagemin([
          imagemin.jpegtran({progressive: true}),
          imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe(gulp.dest('dist/content'));
});

gulp.task('clean', function(done) {
  del(["dist/*"]);
  done();
});

gulp.task('build', ['clean', 'scripts', 'styles', 'images'], function() {
  return gulp.src([ 'index.html', 'icons/**/*'], {base: './'})
  .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build', 'watchSass'], function() {
  gulp.src('dist')
    .pipe(webserver({
      port: 3000,
      livereload: true,
      open: true
    }));
});
