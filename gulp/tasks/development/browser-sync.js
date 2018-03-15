var gulp        = require('gulp');
var browsersync = require('browser-sync');
var config      = require('../config').browsersync;

/**
 * Run the build task and start a server with BrowserSync
 */
gulp.task('browsersync:staticServer', function() {
  browsersync(config.staticServer);
});

gulp.task('browsersync:proxy', function() {
  browsersync(config.proxy);
});
