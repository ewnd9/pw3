module.exports.run = (result) => {
  var _ = require('lodash');

  return _.flatten(_.map(result, function(show) {
    return _.flatten(_.map(show.seasons, function(season) {
      return _.map(season.episodes, function(episode) {
        episode.showTitle = show.title;
        episode.showImdb = show.imdb;
        return episode;
      });
    }));
  }));
};
