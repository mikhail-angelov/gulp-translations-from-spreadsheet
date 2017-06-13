/*const assert = require('assert');*/

import assert from 'assert';
import StreamFile from '../index';

import path from 'path';

describe('translations-from-spreadsheet', () => {

  it('should load google spreadsheet and create message files', async done => {

    const test = StreamFile({
      key: '1a4MVpRD3D0Q_VdtePwtT9_SFc4MAc4b2qC5CgiPbBOs',
      sheet: 1,
      languages: ['en', 'fr'],
      keyColumn: 'key',
      type: 'message'
    });

    test.once('data', (file) => {
      assert.equal(file.path, path.resolve('files/en.json'));
      done()
    });

  }).timeout(10000)

  it('should load google spreadsheet and create template files', async done => {

    const test = StreamFile({
      key: '1a4MVpRD3D0Q_VdtePwtT9_SFc4MAc4b2qC5CgiPbBOs',
      sheet: 1,
      languages: ['en', 'fr'],
      keyColumn: 'key',
      type: 'template'
    });

    test.once('data', (file) => {
      assert.equal(file.path, path.resolve('files/lib/emails/partials/en/agent-created.hbs'));
      done()
    });

  }).timeout(20000)


});