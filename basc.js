/**
 * Created by rain on 6/7/17.
 */
'use strict';

var gulp = require('gulp');
var translations = require('gulp-translations-from-spreadsheet');

gulp.task('translations', function () {
  return translations({
    key: '1cKTLZCglRJkJR_7NGL6vPn1MHdadcLPUOMYjqVKFlB4',
    sheet: 1,
    languages: ['en', 'ru'],
    keyColumn: 'key'
  })
    .pipe(gulp.dest('./i18n'));
});
