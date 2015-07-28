module.exports.run = function() {
  var _ = require('lodash');
  var Promise = require('bluebird');

  var mediaStorage = require('./media-storage');

  return require('./get-user-shows-task').run().then((searches) => {
    return Promise.all(_.map(searches, (request) => {
      return mediaStorage.getByImdb(request.imdb).then((result) => {
        result.user = request;
        return result;
      });
    }));
  });
};
