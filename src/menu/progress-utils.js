var Promise = require('bluebird');
var inquirer = require('inquirer-question');
var moment = require('moment');

var _ = require('lodash');

var config = require('./../utils/config');

var watchedStorage = require('./../helpers/watched-storage');
var historyStorage = require('./../helpers/history-storage');

var printUtils = require('./../utils/print-utils');

var selectEpisodes = module.exports.selectEpisodes = (episodes) => {
  return inquirer.prompt({
    type: 'checkbox',
    name: 'episodes',
    message: 'Select watched episodes',
    choices: _.map(episodes, (episode) => {
      return {
        name: printUtils.episodeFormat(episode),
        value: episode,
        checked: watchedStorage.isEpisodeChecked(episode)
      };
    })
  }).then((answers) => {
    return answers.episodes;
  });
};

var flattenEpisodes = module.exports.flattenEpisodes = (show) => {
  var seasons = _.map(show.seasons, (season) => season.episodes);
  return _.flatten(seasons);
};

var checkEpisodes = module.exports.checkEpisodes = (show, episodes) => {
  var progressEntry = watchedStorage.findProgressEntry(show);
  var now = moment().toString();

  _.each(episodes, (episode) => {

    var episodeEntry = watchedStorage.findEpisodeEntry(progressEntry, episode);

    if (!episodeEntry) {
      episodeEntry = {
        episode: episode.episode,
        season: episode.season,
      };

      progressEntry.episodes.push(episodeEntry);
    }

    episodeEntry.checked = true;
    episodeEntry.checkedDate = now;
  });

  config.save();
};
