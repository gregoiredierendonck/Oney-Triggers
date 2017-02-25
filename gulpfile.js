console.time("Loading core"); //start measuring
/**
 * Require
 */

var gulp                = require('gulp');

// Tools
var plumber             = require('gulp-plumber');
var rename              = require('gulp-rename');
var fs                  = require('fs');

console.timeEnd("Loading core"); //end measuring

/**
 * Config
 */

 var path = {
  dist: 'dist/',
  img: 'images/',
  templates: 'templates/',
  css: 'css/'
 }

// Error handling with plumber
var onError = function (err) {
  console.log(err);
  this.emit('end');
};

/**
 * Liquid
 */

gulp.task("html", function() {
  var liquify = require('gulp-liquify');
  var inlineCss = require('gulp-inline-css');

  gulp.src([path.templates + '*.liquid'])
    .pipe(liquify({}, { base: path.templates }))
    .pipe(rename({
      extname: ".html"
    }))
    .pipe(inlineCss({
      preserveMediaQueries: true
    }))
    .pipe(gulp.dest( '' ));
});

/**
 * Images/SVG
 */

// Optmize image (jpg, png)
gulp.task('img', function () {
  var imagemin = require('gulp-imagemin');

  return gulp.src([path.img + '**/*.jpg', path.img + '**/*.png', path.img + '**/*.gif'])
    .pipe(imagemin())
    .pipe(gulp.dest(path.dist + path.img));
});

/**
 * Watch
 */

gulp.task('watch', ['html'], function() {
  gulp.watch([path.templates + '**/*.liquid'], ['html']);
});

/**
 * Global tasks
 */
gulp.task('default', ['watch']);
gulp.task('dist', ['clean', 'html', 'img'], function(){
  return gulp.src([
    '*.html'
  ])
  .pipe(gulp.dest(path.dist));
});

gulp.task('clean', function(cb){
  var del = require('del');
  del([ path.dist + '**/*', ], cb);
});

/**
 * Deploy
 */

gulp.task('deploy', ['dist'], function() {
  var ghPages = require('gulp-gh-pages');

  return gulp.src([ path.dist + '**/*']).pipe(ghPages());
});
