var _ = require('lodash');
var Promise = require('bluebird');
var imdb = require('./../api/imdb');

var inquirerPromise = require('./../utils/inquirer-promise');
var inquirer = require('inquirer');

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

  return resolveSearches(config, unresolved).then(function(data) {
    return searches;
  });
};
