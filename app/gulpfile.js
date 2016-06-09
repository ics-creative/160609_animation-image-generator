 
var gulp = require('gulp');
var electron = require('electron-connect').server.create();
 
gulp.task('serve', function () {
  // Start browser process 
  electron.start();
 
  // Restart browser process 
  gulp.watch('main.js', electron.restart);
 
  // Reload renderer process 
  gulp.watch(['src/**/*.js','index.html','styles/**/*.css'], electron.reload);

  electron.on('quit', () => {process.exit(0)})
});