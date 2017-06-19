'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = StreamFile;

var _googleSpreadsheet = require('google-spreadsheet');

var _googleSpreadsheet2 = _interopRequireDefault(_googleSpreadsheet);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _vinyl = require('vinyl');

var _vinyl2 = _interopRequireDefault(_vinyl);

var _vinylFs = require('vinyl-fs');

var _vinylFs2 = _interopRequireDefault(_vinylFs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createFile(path, content) {
  return new _vinyl2.default({
    path: path,
    contents: new Buffer(content)
  });
};

function loadSpreadsheet(options, stream) {

  var mySheetKey = new _googleSpreadsheet2.default(options.key);

  mySheetKey.getRows(options.sheet, function (err, row_data) {

    if (err) {
      throw err;
    }

    var type = options.type;
    var langs = options.languages;
    var key = options.keyColumn;

    var converted = _lodash2.default.reduce(row_data, function (acc, row) {

      if (row.type === 'message' && type === 'message') {
        if (row[key]) {
          _lodash2.default.each(langs, function (lang) {
            acc[lang] = acc[lang] || {};
            acc[lang][row[key]] = row[lang];
          });
        }
      } else if (row.type === 'template' && type === 'template') {

        if (row[key]) {
          _lodash2.default.each(langs, function (lang) {
            acc[lang] = acc[lang] || {};
            acc[lang][row[key]] = row[lang];
          });
        }
      }

      return acc;
    }, {});
    stream.write(converted);
  });
}

function StreamFile(options) {

  if (!options) {
    throw new Error('Missing options');
  }

  var stream = _through2.default.obj(function (content, enc, cb) {
    var self = this;

    _lodash2.default.each(content, function (value, language) {
      if (options.type === 'template') {
        _lodash2.default.each(value, function (templateVale, templateName) {
          self.push(createFile('lib/emails/partials/' + language + '/' + templateName, templateVale));
        });
      } else {
        self.push(createFile(language + '.json', JSON.stringify(value)));
      }
    });

    cb();
  });

  loadSpreadsheet(options, stream);
  return stream.pipe(_vinylFs2.default.dest('./files'));
}

var optionsMessage = {
  key: '1a4MVpRD3D0Q_VdtePwtT9_SFc4MAc4b2qC5CgiPbBOs',
  sheet: 1,
  languages: ['en', 'fr'],
  keyColumn: 'key',
  type: 'message'
};

var optionsTemplate = {
  key: '1a4MVpRD3D0Q_VdtePwtT9_SFc4MAc4b2qC5CgiPbBOs',
  sheet: 1,
  languages: ['en', 'fr'],
  keyColumn: 'key',
  type: 'template'
};

StreamFile(optionsMessage);
StreamFile(optionsTemplate);
