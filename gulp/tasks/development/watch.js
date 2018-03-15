var gulp        = require('gulp');
var config      = require('../config').watch;

gulp.task('watch', function() {
  //gulp.watch(config.sprites, ['sprites']);
  gulp.watch(config.less, ['less']);
});
