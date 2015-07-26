var _ = require('lodash');

module.exports.process = (config, queryMatches) => {
  config.data.preferences.searches = config.data.preferences.searches || [];

  var last = _.find(config.data.preferences.searches, function(item) {
    return item.title === queryMatches.title;
  });

  if (last) {
    if (queryMatches.s > last.s) {
      last.s = queryMatches.s;
      last.ep = queryMatches.ep;
    } else if (queryMatches.ep > last.ep) {
      last.ep = queryMatches.ep;
    }
  } else {
    config.data.preferences.searches.push(queryMatches);
  }

  config.save();
};

module.exports.getImdb = (config, title) => {
  var searches = config.data.preferences.searchesImdb = config.data.preferences.searchesImdb || [];
  var last = _.find(searches, item => item.title === title);

  return last;
};

module.exports.setImdb = (config, title, media) => {
  var last = module.exports.getImdb(config, title);

  if (last) {
    last.media = media;
  } else {
    searches.push({
      title: title,
      media: media
    });
  }

  config.save();
};
