var _ = require('lodash');

var watchedStorage = require('./../helpers/watched-storage');
var historyStorage = require('./../helpers/history-storage');
var utils = require('./progress-utils');

var checkSeasons = require('./progress-season-menu');

module.exports = (media) => {
  var history = historyStorage.getHistoryByImdb(media.imdb);
  var lastWatchedEpisode = watchedStorage.findLatestEpisode(media);

  if (!history || history.s === 0 || history.ep === 0) {
    return checkSeasons(media);
  }

  if (lastWatchedEpisode && lastWatchedEpisode.season === history.s && lastWatchedEpisode.episode === history.ep) {
    return checkSeasons(media);
  }

  var lastHistoryEpisode = require('./../utils/format-utils').formatEpisodeNumeric(history.s, history.ep);

  return () => {
    var menu = {
      message: 'action',
      choices: {}
    };

    menu.choices['Check seasons'] = () => checkSeasons(media);
    menu.choices['Check up to ' + lastHistoryEpisode] = () => {
      var episodes = flattenEpisodes(media);

      var filtered = _.filter(episodes, (episode) => {
        return episode.season < history.s || episode.season === history.s && episode.episode <= history.ep;
      });

      return checkEpisodes(media, filtered);
    }
  };

};
