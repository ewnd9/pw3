var request = require('request-promise');
var _ = require('lodash');
var moment = require('moment');

var tr = function(n) {
  return n < 10 ? '0' + n : '' + n;
};

var prettyFormat = module.exports.prettyFormat = function(item) {
  var title = item.title;
  var imdb = item.idIMDB;

  return {
    imdb: imdb,
    title: title,
    url: item.urlIMDB,
    year: item.year,
    description: item.plot,
    rating: item.rating,
    isMovie: item.type !== 'TV Series',
    isShow: item.type === 'TV Series',
    seasons: _.map(item.seasons, function(season) {
      var episodes = _.map(season.episodes, function(episode) {
        var s = season.numSeason;
        var numericSeason = tr(s);
        var numericEpisode = tr(episode.episode);
        var numericTitle = numericSeason + 'x' + numericEpisode;
        var date = episode.date.replace('.', '');

        return {
          title: episode.title,
          episode: episode.episode,
          season: s,
          numericSeason: numericSeason,
          numericEpisode: numericEpisode,
          numericTitle: numericTitle,
          fullTitle: numericTitle + ' ' + episode.title,
          date: date,
          _date: moment(date, 'D MMM YYYY', true),
          showTitle: title,
          showImdb: imdb
        };
      });

      return {
        season: season.numSeason,
        episodes: episodes,
        from: _.first(episodes).date,
        to: _.last(episodes).date
      };
    })
  }
};

var searchRaw = module.exports.searchRaw = function(query) {
  var params = {
    title: query,
    limit: 10,
  };

  return request({ url: 'http://www.myapifilms.com/imdb', qs: params }).then(function(body) {
    return JSON.parse(body);
  });
};

module.exports.search = function(query) {
  return searchRaw(query).then((data) => {
    return _.map(data, function(item) {
      return prettyFormat(item);
    });
  })
};

var searchByImdbRaw = module.exports.searchByImdbRaw = function(imdb) {
  var params = {
    idIMDB: imdb,
    limit: 1,
    seasons: 1
  };

  return request({ url: 'http://www.myapifilms.com/imdb', qs: params }).then(function(body) {
    return JSON.parse(body);
  });
};

module.exports.searchByImdb = function(imdb) {
  return searchByImdbRaw(imdb).then(function(data) {
    return prettyFormat(data);
  });
};
