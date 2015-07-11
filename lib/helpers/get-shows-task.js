'use strict';

module.exports.run = function (config) {
  var _ = require('lodash');
  var imdb = require('./../api/imdb');
  var Promise = require('bluebird');

  return require('./get-user-shows-task').run(config).then(function (searches) {
    return Promise.all(_.map(searches, function (request) {
      return imdb.searchByImdb(request.imdb).then(function (result) {
        result.user = request;
        return result;
      });
    }));
  });
};