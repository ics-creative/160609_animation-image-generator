 
var gulp = require('gulp');
var electron = require('electron-connect').server.create();
var seq = require("run-sequence");
gulp.task('serve', function () {
  // Start browser process
  electron.start();

  //gulp.watch('main.js', electron.restart);

  // Reload renderer process
  gulp.watch(['index.html','styles/**/*.css'], electron.reload);

  // Reload renderer process
  gulp.watch(['src/**/*.js'], function () {
    seq('webpack', electron.reload);
  });

  electron.on('quit', () => {process.exit(0)})
});

var webpackConfig = require('./webpack.config.js');
var webpack = require('gulp-webpack');
gulp.task('webpack', function () {
  return gulp.src(['./src/index.js'])
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./'));
});

