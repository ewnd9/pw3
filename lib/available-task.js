'use strict';

module.exports.run = function (config) {

  var moment = require('moment');
  var _ = require('lodash');

  var now = moment();

  require('./helpers/get-shows-task').run(config).then(function (shows) {

    var filterEpisode = function filterEpisode(show, episode) {
      var isUnwatched = episode.season > show.user.s || episode.season == show.user.s && episode.episode > show.user.ep;
      var isAired = episode._date.isBefore(now);

      return isUnwatched && isAired;
    };

    var result = _.map(shows, function (show) {

      show.seasons = _.map(show.seasons, function (season) {
        season.episodes = _.filter(season.episodes, function (episode) {
          return filterEpisode(show, episode);
        });
        season.episodes = _.sortBy(season.episodes, function (episode) {
          return episode._date.unix();
        });

        return season;
      });

      show.seasons = _.filter(show.seasons, function (season) {
        return season.episodes.length > 0;
      });

      return show;
    });

    var print = require('./utils/print-utils');

    var seasons = _.map(result, function (show) {
      return _.map(show.seasons, function (season) {
        var xs = _.map(season.episodes, function (episode) {
          return episode.numericTitle;
        }).join(', ');

        var first = _.first(season.episodes);
        var last = _.last(season.episodes);

        var dates = first._date.format('DD.MM.YYYY');
        var eps = first.numericTitle;
        var query = first.numericEpisode;

        if (season.episodes.length > 1) {
          dates += ' - ' + last._date.format('DD.MM.YYYY');
          eps += ' - ' + last.numericTitle;
          query += '-' + last.numericEpisode;
        }

        season.formatted = print.kvFormat('' + show.title + ' ' + season.season + ' season', '(' + season.episodes.length + ' episodes) | ' + eps + ' | ' + dates);
        season.query = '' + show.title + ' s' + first.numericSeason + 'e' + query;

        return season;
      });
    });

    return require('inquirer-bluebird').prompt([{
      type: 'list',
      name: 'query',
      message: 'Select season',
      choices: _.map(_.flatten(seasons), function (season) {
        return {
          name: season.formatted,
          value: season.query
        };
      })
    }, {
      type: 'input',
      name: 'postfix',
      message: 'Enter query postfix'
    }]).then(function (answers) {
      var query = answers.query + ' ' + answers.postfix;
      print.info('Searching "' + query + '"');

      return require('./search-task').run(config, 'tpb', query);
    });
  });
};