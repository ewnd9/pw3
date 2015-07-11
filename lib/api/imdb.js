'use strict';

var request = require('request-promise');
var _ = require('lodash');
var moment = require('moment');

var tr = function tr(n) {
  return n < 10 ? '0' + n : '' + n;
};

var parse = function parse(item) {
  return {
    imdb: item.idIMDB,
    title: item.title,
    url: item.urlIMDB,
    year: item.year,
    description: item.plot,
    rating: item.rating,
    isMovie: item.type !== 'TV Series',
    isShow: item.type === 'TV Series',
    seasons: _.map(item.seasons, function (season) {
      var episodes = _.map(season.episodes, function (episode) {
        var s = season.numSeason;
        var numericSeason = tr(s);
        var numericEpisode = tr(episode.episode);
        var numericTitle = numericSeason + 'x' + numericEpisode;

        return {
          title: episode.title,
          episode: episode.episode,
          date: episode.date,
          season: s,
          numericSeason: numericSeason,
          numericEpisode: numericEpisode,
          numericTitle: numericTitle,
          fullTitle: numericTitle + ' ' + episode.title,
          _date: moment(episode.date.replace('.', ''), 'D MMM YYYY', true)
        };
      });

      return {
        season: season.numSeason,
        episodes: episodes,
        from: _.first(episodes).date,
        to: _.last(episodes).date
      };
    })
  };
};

module.exports.search = function (query) {
  var params = {
    title: query,
    limit: 10 };

  return request({ url: 'http://www.myapifilms.com/imdb', qs: params }).then(function (body) {
    var data = JSON.parse(body);
    return _.map(data, function (item) {
      return parse(item);
    });
  });
};

module.exports.searchByImdb = function (imdb) {
  var params = {
    idIMDB: imdb,
    limit: 1,
    seasons: 1
  };

  return request({ url: 'http://www.myapifilms.com/imdb', qs: params }).then(function (body) {
    var data = JSON.parse(body);
    return parse(data);
  });
};