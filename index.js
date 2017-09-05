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


function loadSpreadsheet(options, stream) {
    //https://github.com/theoephraim/node-google-spreadsheet
    var my_sheet = new GoogleSpreadsheet(options.key);

    my_sheet.getInfo(function (err, info) {

        var sheet = info.worksheets[options.sheet - 1];
        var firstRow = options.firstRow || 1;

        my_sheet.getCells(options.sheet, {
            'min-row': firstRow,
            'max-row': sheet.rowCount,
            'return-empty': true
        }, function (err, row_data) {
            if (err) {
                new gutil.PluginError('gulp-translations-from-spreadsheet', err);
            }
            console.log(row_data[0].value, row_data[1].value)
            var converted = {};
            var langs = [];
            for (var i = 1; i < sheet.colCount; i++) {
                langs[i] = row_data[i].value;
            }
            for (var i = firstRow+1; i < sheet.rowCount - 1; i++) {
                for (var j = 1; j < sheet.colCount; j++) {
                    var lang = langs[j];
                    converted[lang] = converted[lang] || {}
                    converted[lang][row_data[(i-1) * sheet.colCount].value] = row_data[(i-1) * sheet.colCount + j].value;
                }
            }
            stream.write(converted);
            stream.end();
        });
    });

}

function gulpI18n(options) {

    if (!options) {
        var err = new gutil.PluginError('gulp-translations-from-spreadsheet', 'Missing options!');
    }

    var stream = through2.obj(function (content, enc, cb) {
        var self = this;
        _.each(content, function (value, key) {
            var lFile = createI18nFile(key, JSON.stringify(value));
            self.push(lFile);
        });
        cb();
    });

    loadSpreadsheet(options, stream);
    return stream;
}

module.exports = gulpI18n;
