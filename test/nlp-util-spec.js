var fs = require('fs');                                                                                                                                                                                                                  [0/33]
var expect = require("chai").expect;

describe('', function() {

  var lib = require('./../lib/utils/nlp-utils');
  var config = null;

  afterEach(function() {

  });

  it('#parseQuery', function() {
    var s = 'hannibal s01e02 720p';
    var result = lib.parseQuery(s);

    expect(result.title).to.equal('hannibal');
    expect(result.s).to.equal(1);
    expect(result.ep).to.equal(2);
  });

  it('#parseEpisodesRange', function() {
    var s = 'hannibal s01e02-05';
    var result = lib.parseEpisodesRange(s);

    expect(result.expr).to.equal('e02-05');
    expect(result.from).to.equal(2);
    expect(result.to).to.equal(5);
  });

  it('#parseEpisodesRange', function() {
    var s = 'hannibal s01e08';
    var result = lib.parseEpisodesRange(s);

    expect(result.expr).to.equal('e08');
    expect(result.from).to.equal(8);
    expect(result.to).to.equal(8);
  });

})
