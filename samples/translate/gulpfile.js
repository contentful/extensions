var gulp = require('gulp');
var serve = require('gulp-serve');
var inlinesource = require('gulp-inline-source');

gulp.task('default', ['copy', 'serve', 'bundle']);

// Serve dist folder on port 3000 for local development
gulp.task('serve', serve({
  root: 'dist',
  port: process.env.PORT || 3000
}));

// Copy required dependencies into dist folder
gulp.task('copy', function() {

  var files = [
    'index.html',
    'translate.js'
  ];

  var dependencies = [
    'node_modules/contentful-ui-extensions-sdk/dist/cf-extension-api.js',
    'node_modules/contentful-ui-extensions-sdk/dist/cf-extension.css'
  ];

  gulp.src(files)
    .pipe(gulp.dest('./dist'));

  gulp.src(dependencies)
    .pipe(gulp.dest('./dist/lib'));

});

// Inlines all external scripts and stylesheets that have the inline attribute
// Outputs the index.all.html file into the dist folder
// This can be used with the widget srcdoc option to upload all widget code to Contentful
gulp.task('bundle', function() {
  gulp.src('index.all.html')
    .pipe(inlinesource())
    .pipe(gulp.dest('./dist'));
});
