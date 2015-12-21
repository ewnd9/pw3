var fs = require('fs');                                                                                                                                                                                                                  [0/33]
var expect = require('chai').expect;
var imdb = require('./../src/api/imdb');

describe('imdb spec', function() {

  it('brooklyn nine nine', function() {
    this.timeout(20000);

		return imdb.search('brooklyn nine nine', 'TV').then((data) => {
      expect(data.length).to.eq(1);
			expect(data[0].imdb).to.eq('tt2467372');
    });
  });

})
