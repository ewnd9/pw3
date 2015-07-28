var Promise = require('bluebird');
var eztv = Promise.promisifyAll(require('eztv'));

var _ = require('lodash');

var nlpUtils = require('./../utils/nlp-utils');

module.exports.query = (query) => {

  var data = nlpUtils.parseQuery(query);

  return eztv.getShowsAsync({query: data.title}).then((results) => {
    if (results.length === 0) {
      return [];
    } else {
      return Promise.reduce(results, (all, show) => {
        return eztv.getShowEpisodesAsync(show.id).then((results) => {
          var filtered = _.filter(results.episodes, (episode) => {
            return episode.seasonNumber === data.s && episode.episodeNumber === data.ep;
          });

          var results = _.map(filtered, (episode) => {
            return {
              name: episode.title,
              magnet: episode.magnet,
              seeders: 'N/A',
              leechers: 'N/A',
              size: 'N/A'
            };
          });

          all.push(results);
          return all;
        });
      }, []).then((results) => {
        return _.flatten(results);
      });
    }
  });
};
