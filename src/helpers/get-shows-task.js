module.exports.run = function(config) {
  var _ = require('lodash');
  var imdb = require('./../api/imdb');
  var Promise = require('bluebird');

  return require('./get-user-shows-task').run(config).then((searches) => {
    return Promise.all(_.map(searches, (request) => {
      return imdb.searchByImdb(request.imdb).then((result) => {
        result.user = request;
        return result;
      });
    }));
  });
};
