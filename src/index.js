import GoogleSpreadsheet from 'google-spreadsheet';
import through2 from 'through2';
import _ from 'lodash';
import File from 'vinyl';
import vfs from 'vinyl-fs';


function createFile(path, content) {
  return new File({
    path: path,
    contents: new Buffer(content)
  });
};

function loadSpreadsheet(options, stream) {

  let mySheetKey = new GoogleSpreadsheet(options.key);

  mySheetKey.getRows(options.sheet, (err, row_data) => {

    if (err) {
      throw err;
    }

    let type = options.type;
    let langs = options.languages;
    let key = options.keyColumn;

    let converted = _.reduce(row_data, (acc, row) => {

      if (row.type === 'message' && type === 'message') {
        if (row[key]) {
          _.each(langs, (lang) => {
            acc[lang] = acc[lang] || {};
            acc[lang][row[key]] = row[lang];
          })
        }
      }

      else if (row.type === 'template' && type === 'template') {

        if (row[key]) {
          _.each(langs, (lang) => {
            acc[lang] = acc[lang] || {};
            acc[lang][row[key]] = row[lang];
          })
        }
      }

      return acc;
    }, {});
    stream.write(converted);
  });
}

export default function StreamFile(options) {

  if (!options) {
    throw new Error('Missing options');
  }

  let stream = through2.obj(function (content, enc, cb) {
    let self = this;

    _.each(content, function (value, language) {
      if (options.type === 'template') {
        _.each(value, (templateVale, templateName) => {
          self.push(createFile(`lib/emails/partials/${language}/${templateName}`, templateVale))
        })
      } else {
        self.push(createFile(`${language}.json`, JSON.stringify(value)))
      }
    });

    cb();
  });

  loadSpreadsheet(options, stream);
  return stream.pipe(vfs.dest('./files'));
}

const optionsMessage = {
  key: '1a4MVpRD3D0Q_VdtePwtT9_SFc4MAc4b2qC5CgiPbBOs',
  sheet: 1,
  languages: ['en', 'fr'],
  keyColumn: 'key',
  type: 'message'
};

const optionsTemplate = {
  key: '1a4MVpRD3D0Q_VdtePwtT9_SFc4MAc4b2qC5CgiPbBOs',
  sheet: 1,
  languages: ['en', 'fr'],
  keyColumn: 'key',
  type: 'template'
};

StreamFile(optionsMessage);
StreamFile(optionsTemplate);
