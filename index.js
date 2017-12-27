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
            console.log(row_data[0].value, row_data[1].value)
            var converted = {};
            var langs = [];
            for (var i = 1; i < colCount; i++) {
                langs[i] = row_data[i].value;
            }
            console.log('-', row_data[0].value, langs)
            for (var i = firstRow + 1; i < rowCount - 1; i++) {
                for (var j = 1; j < colCount; j++) {
                    var lang = langs[j];
                    converted[lang] = converted[lang] || {}
                    converted[lang][row_data[(i - 1) * colCount].value] = row_data[(i - 1) * colCount + j].value;
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
            stream.write({err:err});
        } else {
             stream.write(data);
        }
        stream.end();
    });
    return stream;
}

module.exports = gulpI18n;
