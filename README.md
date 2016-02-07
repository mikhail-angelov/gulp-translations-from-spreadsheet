# gulp-translations-from-spreadsheet

[![Build Status](https://travis-ci.org/mikhail-angelov/gulp-translations-from-spreadsheet.svg?branch=master)](https://travis-ci.org/mikhail-angelov/gulp-translations-from-spreadsheet)

> Gulp plugin to generate translations json files for angular application from a google spreadsheet

# Install

```
npm install gulp-translations-from-spreadsheet --save-dev
```

# Basic Usage

This code will generate translation json files based on google spreadsheet:

```javascript
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
```

### Options
**NOTE:** all options are mandatory

#### key
Type: `String`

Google spreadsheet key.  
*Example: `https://docs.google.com/spreadsheets/d/1cKTLZCglRJkJR_7NGL6vPn1MHdadcLPUOMYjqVKFlB4/edit?usp=sharing`*

*`1cKTLZCglRJkJR_7NGL6vPn1MHdadcLPUOMYjqVKFlB4 is a key here`*

#### sheet
Type: `Number`

Worksheet id
**NOTE:** IDs start at 1

#### languages
Type: `Array`

List of languages must match with column names in worksheet

#### keyColumn
Type: `String`

Column name for prompts ids



**NOTE:** there is [link](https://github.com/marcbuils/gulp-i18n-gspreadsheet) to alternative version of such gulp plugin 

