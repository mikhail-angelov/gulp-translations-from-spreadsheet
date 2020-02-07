var assert = require('assert');
var es = require('event-stream');
var plugin = require('../');

const example = `{
\t"hi": "Hello",
\t"bye": "Goodbye",
\t"": ""
}`
describe('gulp-translations-from-spreadsheet', function () {
    this.timeout(100000);

    it('should load google spreadsheet and create json files', function (done) {

        // Create plugin stream
        var test = plugin({
            key: '1cKTLZCglRJkJR_7NGL6vPn1MHdadcLPUOMYjqVKFlB4',
            sheet: 1,
            colCount: 4,
            firstRow: 1
        });

        // wait for the file to come back out
        test.once('data', function (file) {
            var data = file.contents.toString('utf8');
            console.log('---', data)
            assert.equal(file.path, '/en.json');
            assert.equal(data, example);
            done();
        });
    });
});
