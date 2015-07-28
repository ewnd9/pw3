var config = require('dot-file-config')('.pw3-npm-media-cache');
var Promise = require('bluebird');
var moment = require('moment');

var imdbApi = require('./../api/imdb');

module.exports.getByImdb = (imdb) => {
  config.data.imdb = config.data.imdb || {};

  if (config.data.imdb && config.data.imdb[imdb]) {
    var date = config.data.imdb[imdb].date;
    var twoDaysAgo = moment().add(-2, 'days');

    if (moment(date, 'DD-MM-YYYY').isAfter(twoDaysAgo)) {
      return Promise.resolve(config.data.imdb[imdb].media);
    }
  }

  return imdbApi.searchByImdb(imdb).then((media) => {
    config.data.imdb[imdb] = {
      media: media,
      date: moment().format('DD-MM-YYYY')
    };
    config.save();

    return media;
  });
};
