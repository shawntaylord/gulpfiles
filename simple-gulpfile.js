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

var targets = {
  css_src: 'public/css/**/*.css',
  js_src: 'public/js/**/*.js',
  css_dest: 'dest/css',
  js_dest: 'dest/js',
  webpack_dest: 'app.js',
  main: 'index.js'
};

gulp.task('css', function() {
  var processorArray = [
    autoprefixer({ browsers: ['last 2 versions'] }),
    cssnano() // minify css
  ];
  return gulp.src(targets.css_src)
    .pipe(postcss(processorArray)) // transform to css
    .pipe(gulp.dest(targets.css_dest))
});

gulp.task('jslint', function() {
  return gulp.src(targets.js_src)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
});

gulp.task('webpack', function() {
  return gulp.src(targets.js_src)
    .pipe(webpack({
      output: { filename: targets.webpack_dest }
    }))
    .pipe(gulp.dest(targets.js_dest))
});

gulp.task('browser-sync', function() {
  browserSync.init({
    proxy: 'http://localhost:' + port,
    port: 5000, // must be different than port above
    notify: false, // hide popovers in browser window
    files:['dest/**/*.*'] // files to watch
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

gulp.task('default', ['browser-sync', 'nodemon'], function() {
  gulp.watch(targets.css_src, ['css']);
  gulp.watch(targets.css_dest).on('change', browserSync.reload);
  gulp.watch(targets.js_src, ['jslint']).on('change', browserSync.reload);
  gulp.watch(targets.js_src, ['webpack']).on('change', browserSync.reload);
  gulp.watch('public/index.html').on('change', browserSync.reload);
});
