var gulp = require('gulp');
var merge = require('merge-stream');
var del = require('del');
var serve = require('gulp-serve');
var rename = require('gulp-rename');
var inlinesource = require('gulp-inline-source');
var stylus = require('gulp-stylus');

var src = 'src/**/';
var dependencies = [
  'node_modules/contentful-ui-extensions-sdk/dist/cf-extension.css',
  'node_modules/contentful-ui-extensions-sdk/dist/cf-extension-api.js',
  'node_modules/json-editor/dist/jsoneditor.js'
];

gulp.task('default', ['build'], function () {
  gulp.start('serve');
});

// Serve and watch for changes so we don't have to run `gulp` after each change.
gulp.task('watch', ['build'], function () {
  gulp.start('serve');
  gulp.watch([src + '*', dependencies], function () {
    gulp.start(['build']);
  });
});

// Serve dist folder on port 3000 for local development.
gulp.task('serve', serve({
  root: 'dist'
}));

// Copy required dependencies into dist folder.
gulp.task('build', ['stylus'], function () {

  var filesStream = gulp.src(src + '!(*.styl)')
    .pipe(gulp.dest('./dist'));

  var depsStream = gulp.src(dependencies)
    .pipe(gulp.dest('./dist/lib'));

  return merge(filesStream, depsStream);
});

gulp.task('stylus', function () {
  return gulp.src(src + '*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./dist'));
});

// Bundles the whole widget into one file which can be uploaded to Contentful.
gulp.task('bundle', ['build'], function () {
  return gulp.src('./dist/index.html')
    .pipe(rename('index.min.html'))
    .pipe(inlinesource())
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean', function () {
  return del([
    './dist'
  ]);
});
