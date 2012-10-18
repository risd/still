var fs = require('fs'),
  still = require('../'),
  build = still.build.build,
  server = still.server;

describe('Templates', function () {

  describe('Swig', function () {
    var out = 'tests/tmp/swigout';

    it('renders', function (done) {
      build({
        _: [__dirname + '/templates/swig'],
        e: 'swig',
        o: out,
        verbose: 0,
        encoding: 'utf-8'
      }, function () {
        fs.readFile(out + '/index.html', 'utf8', function (err, data) {
          data.should.eql('\nhi\n');
          done();
        });
      });
    });
  });

});
