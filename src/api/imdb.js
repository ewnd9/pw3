var request = require('request-promise');
var _ = require('lodash');
var moment = require('moment');

var tr = function(n) {
  return n < 10 ? '0' + n : '' + n;
};

var parse = function(item) {
  return {
    imdb: item.idIMDB,
    title: item.title,
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
          _date: moment(date, 'D MMM YYYY', true)
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

module.exports.search = function(query) {
  var params = {
    title: query,
    limit: 10,
  };

  return request({ url: 'http://www.myapifilms.com/imdb', qs: params }).then(function(body) {
    var data = JSON.parse(body);
    return _.map(data, function(item) {
      return parse(item);
    });
  });
};

module.exports.searchByImdb = function(imdb) {
  var params = {
    idIMDB: imdb,
    limit: 1,
    seasons: 1
  };

  return request({ url: 'http://www.myapifilms.com/imdb', qs: params }).then(function(body) {
    var data = JSON.parse(body);
    return parse(data);
  });
};
