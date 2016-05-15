var gulp = require('gulp');
var autoprefixer = require('autoprefixer');
var postcss = require('gulp-postcss');
var cssnano = require('cssnano');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var browserSync = require('browser-sync').create();
var webpack = require('gulp-webpack');
var nodemon = require('gulp-nodemon');
var port = process.env.PORT || 3000;

gulp.task('css', function() {
  var processorArray = [
    autoprefixer({browsers: ['last 2 versions']}),
    cssnano()
  ];
  return gulp.src('css/**/*.css')
    .pipe(postcss(processorArray))
    .pipe(gulp.dest('public/css'))
});

gulp.task('jslint', function() {
  return gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
});

gulp.task('webpack', function() {
  return gulp.src('src/*.js')
    .pipe(webpack({
      output: { filename: 'app.js' }
    }))
    .pipe(gulp.dest('public/js'))
});

gulp.task('browser-sync', function() {
  browserSync.init({
    proxy: 'http://localhost:' + port,
    port: 5000,
    notify: true,
    files:['public/**/*.*']
  });
});

gulp.task('nodemon', function(cb) {
  var started = false;

  return nodemon({
    script: 'index.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
  }).on('start', function() {
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('default', ['css', 'jslint', 'webpack', 'browser-sync', 'nodemon'], function() {
  gulp.watch('css/*.css', ['css']);
  gulp.watch('public/css/*.css').on('change', browserSync.reload);
  gulp.watch('src/*.js', ['jslint']).on('change', browserSync.reload);
  gulp.watch('src/*.js', ['webpack']).on('change', browserSync.reload);
  gulp.watch('public/index.html').on('change', browserSync.reload);
});
