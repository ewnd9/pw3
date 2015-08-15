var config = require('./../utils/config');

module.exports.run = function() {

  var moment = require('moment');
  var _ = require('lodash');

  var now = moment();
  var watchedStorage = require('./watched-storage');

  return require('./get-shows-task').run().then((shows) => {

    var filterEpisode = (show, episode) => {
      var lastWatchedEpisode = watchedStorage.findLatestEpisode(show);

      var isSearchUnwatched = episode.season > show.user.s || episode.season == show.user.s && episode.episode > show.user.ep;
      var isProgressUnwatched = !lastWatchedEpisode || (episode.season > lastWatchedEpisode.season || episode.season == lastWatchedEpisode.season && episode.episode > lastWatchedEpisode.episode);

      var isAired = episode._date.isBefore(now) && episode._date.isValid();

      return isSearchUnwatched && isProgressUnwatched && isAired;
    };

    var result = _.map(shows, function(show) {

      show.seasons = _.map(show.seasons, (season) => {
        season.episodes = _.filter(season.episodes, (episode) => filterEpisode(show, episode));
        season.episodes = _.sortBy(season.episodes, (episode) => episode._date.unix());

        return season;
      });

      show.seasons = _.filter(show.seasons, (season) => season.episodes.length > 0);

      return show;

    });

    var print = require('./../utils/print-utils');

    var seasons = _.map(result, (show) => {
      return _.map(show.seasons, (season) => {
        var xs = _.map(season.episodes, (episode) => episode.numericTitle).join(', ');

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

        season.formatted = print.kvFormat(`${show.title} ${season.season} season`, `(${season.episodes.length} episodes) | ${eps} | ${dates}`);
        season.query = `${show.title} s${first.numericSeason}e${query}`;

        return season;
      });
    });

    return require('inquirer-bluebird').prompt({
      type: 'list',
      name: 'query',
      message: 'Select season',
      choices: _.map(_.flatten(seasons), (season) => {
        return {
          name: season.formatted,
          value: season.query
        };
      })
    });
  });

};