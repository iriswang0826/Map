var gulp        = require('gulp');
var runSequence = require('run-sequence');

/**
 * Run all tasks needed for a build in defined order
 */
gulp.task('publish', function(callback) {
  runSequence('delete:all', 
    'moveToBuild',
    'seajs',
    'moveConcat',
    [
    'optimize:css',
    'optimize:js',
    'optimize:images'
  ],
  'delete:tmp',
  callback);
});



//本地压缩测试用，不必使用
gulp.task('localPdTest',function(callback) {
  runSequence('delete:all', 
    'moveToBuild',
    'seajs',
    'moveConcat',
    [
    'optimize:css',
    'optimize:js',
    'optimize:images'
  ],
  'delete:tmp',
  callback);
});