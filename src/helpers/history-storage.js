var _ = require('lodash');
var mediaStorage = require('./media-storage');

var config = require('dot-file-config')('.pw3-npm');

module.exports.getHistory = (title) => {
  var searches = config.data.searches = config.data.searches || [];
  var result = _.find(searches, (item) => item.title === title);

  if (!result) {
    result = {
      title: title,
      s: 0,
      ep: 0
    };
    searches.push(result);
  }

  return result;
};

module.exports.process = (queryMatches) => {
  var last = module.exports.getHistory(queryMatches.title);

  if (last) {
    if (queryMatches.s > last.s) {
      last.s = queryMatches.s;
      last.ep = queryMatches.ep;
    } else if (queryMatches.ep > last.ep) {
      last.ep = queryMatches.ep;
    }
  } else {
    config.data.searches.push(queryMatches);
  }

  config.save();
};

module.exports.getHistoryByImdb = (imdb) => {
  var searches = config.data.searches = config.data.searches || [];
  return _.find(searches, (item) => item.imdb === imdb);
};

module.exports.setImdb = (title, imdb) => {
  var last = module.exports.getHistory(title);
  last.imdb = imdb;

  config.save();
};
