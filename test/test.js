var assert = require('assert');
var es = require('event-stream');
var plugin = require('../');

describe('gulp-translations-from-spreadsheet', function () {

    it('should load google spreadsheet and create json files', function (done) {

        // Create plugin stream
        var test = plugin({
            key: '1cKTLZCglRJkJR_7NGL6vPn1MHdadcLPUOMYjqVKFlB4',
            sheet: 1,
            languages: ['en', 'ru'],
            keyColumn: 'key'
        });

        // wait for the file to come back out
        test.once('data', function (file) {
            var data = file.contents.toString('utf8');
            assert.equal(file.path, '/en.json');
            assert.equal(data, '{"hi":"Hello","bye":"Goodbye"}');
            done();
        });
    });
});