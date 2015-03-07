describe('kickass', function() {
  describe('#save()', function() {
    it('should save without error', function(done) {
      var kickassAdapter = require('../src/kickass-adapter');

      kickassAdapter.query('arrow s03e10').then(function(data) {
        console.log(data);
        done();
      })
    });
  });
});
