# gulp-translations-from-spreadsheet

[![Build Status](https://travis-ci.org/mikhail-angelov/gulp-translations-from-spreadsheet.svg?branch=master)](https://travis-ci.org/mikhail-angelov/gulp-translations-from-spreadsheet)

> Gulp plugin to generate translations json files for angular application from a google spreadsheet

> **IMPORTANT:** If you do not want to use a service account, google spreadsheet must have no auth public permissions (e.g.  Anyone with the link can view)
> and it should be explicitly published using "File > Publish to the web" menu option in the google spreadsheets GUI.
> this plugin is based on [node-google-spreadsheet](https://github.com/theoephraim/node-google-spreadsheet)

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
          colCount: 4,
          firstRow: 1,
          private_key_id: 'xxx',
          private_key: '-----BEGIN PRIVATE KEY-----\xxx\n-----END PRIVATE KEY-----\n',
          client_email: 'xxx@developer.gserviceaccount.com',
          client_id: 'xxx.apps.googleusercontent.com',
          ignoreCommentsColumn: false,
          warnOnMissingValues: true,
          errorOnMissingValues: false
      })
    .pipe(gulp.dest('./i18n'));
});
```
---
### Options

#### key
Type: `String: mandatory`

Google spreadsheet key.  
*Example: `https://docs.google.com/spreadsheets/d/1cKTLZCglRJkJR_7NGL6vPn1MHdadcLPUOMYjqVKFlB4/edit?usp=sharing`*

*`1cKTLZCglRJkJR_7NGL6vPn1MHdadcLPUOMYjqVKFlB4 is a key here`*

#### sheet
Type: `Number: optional, default 1`

**NOTE:** Worksheet id, ids start at 1

### It is recommended that you DELETE all unused rows and columns in your spreadsheet to optimize load time, and only create addition columns and rows when needed.
### The following two options allow you to specify a custom range of columns and rows if required. 

#### firstRow
Type: `Number: optional, default 1`

**NOTE:** the index of the first row, start with 1

#### colCount
Type: `Number: optional, default value from spreadsheet`

**NOTE:** the number of valuable columns, it's better to specify this number, otherwise, it could be more than you expect

### The following four options are required if you want to use a service account to authenticate (recommended):

#### private_key_id
Type: `String: optional`

The Google API private key id to use for authentication.

#### private_key
Type: `String: optional`

The Google API private key to use for authentication.

**NOTE:** You should never commit your private_key into your git repo. Rather you should use an ENV variable.

#### client_email
Type: `String: optional`

The Google API email to use for authentication. This account must have read access to the spreadsheet you want to pull the translations from.

#### client_id
Type: `String: optional`

The Google API client id to use for authentication.

#### ignoreCommentsColumn
Type: `Boolean: optional, default false`

If there is a column with the top cell labelled 'comments', this column will be skipped.

#### warnOnMissingValues
Type: `Boolean: optional, default true`

If there is a column lacking a given value, throw a warning in the console.

#### errorOnMissingValues
Type: `Boolean: optional, default false`

If there is a column lacking a given value, throw a fatal error and stop the task (recommended).

---

**NOTE:** there is [link](https://github.com/marcbuils/gulp-i18n-gspreadsheet) to alternative version of such gulp plugin 