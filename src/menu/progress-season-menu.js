var Promise = require('bluebird');
var inquirer = require('inquirer-question');
var moment = require('moment');

var _ = require('lodash');

var config = require('./../utils/config');

var watchedStorage = require('./../helpers/watched-storage');
var historyStorage = require('./../helpers/history-storage');

var printUtils = require('./../utils/print-utils');

var utils = require('./progress-utils');

var f = (media, season) => {
  var airedEpisodes = _.filter(season.episodes, (episode) => {
    return episode._date.isBefore(moment());
  });

  return inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'Select action',
    choices: ['Select episodes', 'Check all aired episodes as watched'],
  }).then((answers) => {
    if (answers.action === 'Select episodes') {
      return utils.selectEpisodes(season.episodes).then((episodes) => {
        utils.checkEpisodes(media, episodes);
      });
    } else {
      return utils.checkEpisodes(media, airedEpisodes);
    }
  });
};

module.exports = (media) => {
  return () => {
    var menu = {
      message: 'season',
      choices: {}
    };

    _.each(media.seasons, (season) => {
      var stats = watchedStorage.getStats(media, season.episodes);
      menu.choices[`${season.season} season | ${stats}`] = () => f(media, season);
    });

    return menu;
  };
};
