var GoogleSpreadsheet = require("google-spreadsheet");
var through2 = require('through2');
var _ = require('lodash');
var File = require('vinyl');
var gutil = require('gulp-util');

function createI18nFile(language, content) {
    return new File({
        cwd: "/",
        base: "/",
        path: "/" + language + '.json',
        contents: new Buffer(content)
    });
}


function loadSpreadsheet(options, cb) {
    //https://github.com/theoephraim/node-google-spreadsheet
    var my_sheet = new GoogleSpreadsheet(options.key);

    // takes service account info
    if (options.private_key_id) {
        options.type = 'service_account';
        my_sheet.useServiceAccountAuth({
            private_key_id: options.private_key_id,
            private_key: options.private_key,
            client_email: options.client_email,
            client_id: options.client_id
        }, function () { processSpreadsheet(my_sheet, options, cb) });
    } else {
        processSpreadsheet(my_sheet, options, cb)
    }

}


function processSpreadsheet(my_sheet, options, cb) {

    my_sheet.getInfo(function (err, info) {
        if (err) {
            return cb(err)
        }

        var sheet = info.worksheets[options.sheet - 1];
        var firstRow = options.firstRow || 1;
        var colCount = options.colCount || sheet.colCount
        var rowCount = sheet.rowCount

        my_sheet.getCells(options.sheet, {
            'min-row': firstRow,
            'max-row': rowCount,
            'min-col': 1,
            'max-col': colCount,
            'return-empty': true
        }, function (err, row_data) {
            if (err) {
                return cb(err)
            }
            var converted = {};
            var langs = [];
            var commentsColumnIndex;

            for (var i = 1; i < colCount; i++) {
                if (options.ignoreCommentsColumn == true && row_data[i].value == 'comments') {
                    // do nothing
                    commentsColumnIndex = i;
                } else {
                    if (options.warnOnMissingValues && row_data[i].value.length == 0) {
                        console.log('Column is missing key at index ' + i)
                    }
                    if (options.errorOnMissingValues && row_data[i].value.length == 0) {
                        throw new Error('Column is missing key at index ' + i);
                    }
                    langs[i] = row_data[i].value;
                }
            }

            for (var i = firstRow + 1; i < rowCount - 1; i++) {
                for (var j = 1; j < colCount; j++) {
                    if (options.ignoreCommentsColumn && j == commentsColumnIndex) {
                        // do nothing
                    } else {
                        if (options.warnOnMissingValues && row_data[(i - 1) * colCount + j].value.length == 0) {
                            console.log('Cell is missing value at col ' + i + ', row ' + j)
                        }
                        if (options.errorOnMissingValues && row_data[(i - 1) * colCount + j].value.length == 0) {
                            throw new Error('Cell is missing value at col ' + i + ', row ' + j);
                        }
                        var lang = langs[j];
                        converted[lang] = converted[lang] || {};
                        converted[lang][row_data[(i - 1) * colCount].value] = row_data[(i - 1) * colCount + j].value;
                    }
                }
            }
            return cb(null, converted);
        });
    });

}

function gulpI18n(options) {

    if (!options) {
        new gutil.PluginError('gulp-translations-from-spreadsheet', 'Missing options!');
    }

    var stream = through2.obj(function (content, enc, cb) {
        var self = this;
        _.each(content, function (value, key) {
            var lFile = createI18nFile(key, JSON.stringify(value));
            self.push(lFile);
        });
        cb();
    });

    loadSpreadsheet(options, function (err, data) {
        if (err) {
            new gutil.PluginError('gulp-translations-from-spreadsheet', err);
            stream.write({ err: err });
        } else {
            stream.write(data);
        }
        stream.end();
    });
    return stream;
}

module.exports = gulpI18n;
