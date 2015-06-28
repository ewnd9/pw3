var _ = require('lodash');
var Promise = require('bluebird');

var inquirerPromise = require('./utils/inquirer-promise');
var inquirer = require('inquirer');

var imdb = require('./api/imdb');

var resolveSearches = function(config, unresolved) {
  var f = function(request) {
    return imdb.search(request.title).then(function(data) {
      return inquirerPromise.prompt({
        type: "list",
        name: "movie",
        message: "Select title",
        choices: _.map(data, function(item) {
          return {
            name: item.title + ' (' + item.year + ')',
            value: item
          }
        }).concat(new inquirer.Separator(), 'Exit')
      }).then(function(answers) {
        request.imdb = answers.movie.imdb;
        config.save();

        return true;
      });
    });
  };

  return Promise.reduce(unresolved, function(total, request) {
    return f(request);
  }, 0).then(function(complete) {
    return complete;
  });
};

module.exports.run = function(config) {
  var searches = config.data.preferences.searches = config.data.preferences.searches || [];

  var unresolved = _.filter(searches, function(search) {
    return !search.imdb;
  });

  resolveSearches(config, unresolved).then(function(data) {
    var moment = require('moment');

    var now = moment();
    var twoWeekAgo = moment(now).add(-2, 'week');
    var twoWeekFromNow = moment(now).add(+2, 'week');

    return Promise.all(_.map(searches, function(request) {
      return imdb.searchByImdb(request.imdb);
    })).then(function(result) {
      var episodes = _.flatten(_.map(result, function(show) {
        return _.flatten(_.map(show.seasons, function(season) {
          return _.map(season.episodes, function(episode) {
            episode.showTitle = show.title;
            return episode;
          });
        }));
      }));

      var filtered = _.filter(episodes, function(episode) {
        return episode._date.isAfter(twoWeekAgo) && episode._date.isBefore(twoWeekFromNow);
      });

      var sorted = _.sortBy(filtered, function(x) {
        return x._date.unix();
      });

      require('./utils/print-utils').splitByToday(sorted.reverse());
    }, function(err) {
      console.log(err);
    });
  });
};
