var fs = require('fs');                                                                                                                                                                                                                  [0/33]
var expect = require('chai').expect;

describe('adaptersSpec', function() {

  var query = 'hannibal s01e02 720p';

  var test = (lib, query) => {
    return lib.query(query).then((data) => {
      expect(data.length).to.be.above(0);

      expect(data[0]).to.have.property('name');
      expect(data[0]).to.have.property('magnet');
      expect(data[0]).to.have.property('seeders');
      expect(data[0]).to.have.property('leechers');
      expect(data[0]).to.have.property('size');
    });
  };

  it('thepiratebay', async function() {
    this.timeout(20000);

    var lib = require('./../src/adapters/tpb-adapter');
    return test(lib, query);
  });

  // it('kickass', function(done) {
  //   this.timeout(10000);
  //
  //   var lib = require('./../src/adapters/kickass-adapter');
  //   test(lib, query, done);
  // });
  //
  // it('eztv', function(done) {
  //   this.timeout(20000);
  //
  //   var lib = require('./../src/adapters/eztv-adapter');
  //   test(lib, query, done);
  // });

})
