var gulp        = require('gulp');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var config      = require('../config').less;
var path = require('path');
var filter = require('gulp-filter');

gulp.task('less', function() {

    return gulp.src(config.src)
      .pipe(filter(['**/*.less', '!**/_*.less']))
      .pipe(plumber())
      .pipe(less({paths: [ path.join(__dirname, '../../../Content/less') ]}))
      .pipe( gulp.dest(config.dest) );

});