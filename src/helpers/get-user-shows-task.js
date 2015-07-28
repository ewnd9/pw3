var _ = require('lodash');
var Promise = require('bluebird');
var imdb = require('./../api/imdb');

var inquirer = require('inquirer-bluebird');

var config = require('dot-file-config')('.pw3-npm');

var resolveSearches = function(unresolved) {
  var f = function(request) {
    return require('./resolve-title-task').run(request.title).then((movie) => {
      request.imdb = movie.imdb;
      config.save();

      return true;
    });
  };

  return Promise.reduce(unresolved, function(total, request) {
    return f(request);
  }, 0).then(function(complete) {
    return complete;
  });
};

module.exports.run = function() {
  var searches = config.data.searches = config.data.searches || [];

  var unresolved = _.filter(searches, function(search) {
    return !search.imdb;
  });

  return resolveSearches(unresolved).then(function(data) {
    return searches;
  });
};
