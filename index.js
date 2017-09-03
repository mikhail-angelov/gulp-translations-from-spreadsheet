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

    my_sheet.getRows(options.sheet, function (err, row_data) {
        if (err) {
            new gutil.PluginError('gulp-translations-from-spreadsheet', err);
        }

        var langs = options.languages;
        var key = options.keyColumn;
        var converted = _.reduce(row_data, function (acc, row) {
            if (row[key]) {
                _.each(langs, function (lang) {
                    acc[lang] = acc[lang] || {};
                    acc[lang][row[key]] = row[lang];
                })
            }
            return acc;
        }, {});
        stream.write(converted);
        stream.end();
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
