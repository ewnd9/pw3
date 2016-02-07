var fs = require('fs');                                                                                                                                                                                                                  [0/33]
var expect = require('chai').expect;
var lib = require('./../src/expand-query');

it('#parseEpisodesRange', function() {
  var s = 'hannibal s01e02-05';
  var data = lib.parseEpisodesRange(s);

  expect(data.expr).to.equal('s01e02-05');
  expect(data.s).to.equal(1);
  expect(data.epFrom).to.equal(2);
  expect(data.epTo).to.equal(5);

  var result = lib.expandEpisodesRange(s);
  expect(result).to.eql([
    'hannibal s01e02',
    'hannibal s01e03',
    'hannibal s01e04',
    'hannibal s01e05'
  ]);
});

it('#parseEpisodesRange', function() {
  var s = 'hannibal s01e10-s01e12';
  var data = lib.parseEpisodesRange(s);

  expect(data.expr).to.equal('s01e10-s01e12');
  expect(data.s).to.equal(1);
  expect(data.epFrom).to.equal(10);
  expect(data.epTo).to.equal(12);

  var result = lib.expandEpisodesRange(s);
  expect(result).to.eql([
    'hannibal s01e10',
    'hannibal s01e11',
    'hannibal s01e12'
  ]);
});

it('#parseEpisodesRange', function() {
  var s = 'hannibal s01e05';
  var data = lib.parseEpisodesRange(s);
  expect(data).to.equal(null);

  var result = lib.expandEpisodesRange(s);
  expect(result).to.eql([s]);
});
