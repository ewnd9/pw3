module.exports.run = (config, query) => {
  var inquirer = require('inquirer-bluebird');
  var _ = require('lodash');

  var imdb = require('./../api/imdb');

  var historyStorage = require('./history-storage');
  var mediaStorage = require('./media-storage');

  var history = historyStorage.getHistory(config, query);

  var imdbSearch = () => {
    return imdb.search(query).then((data) => {
      return inquirer.prompt({
        type: 'list',
        name: 'media',
        message: 'Select title',
        choices: _.map(data, (item) => {
          return {
            name: item.title + ' (' + item.year + ')',
            value: item
          }
        }).concat(new inquirer.Separator(), 'Exit')
      });
    }).then((answers) => {
      historyStorage.setImdb(config, query, answers.media.imdb);
      return answers.media;
    });
  }

  if (history.imdb) {
    return mediaStorage.getByImdb(history.imdb).then((media) => {
      return inquirer.prompt({
        type: 'list',
        name: 'media',
        message: 'Select title',
        choices: [{
          name: media.title + ' (' + media.year + ')',
          value: media
        }].concat(new inquirer.Separator(), 'More')
      });
    }).then((answers) => {
      if (answers.media === 'More') {
        return imdbSearch();
      } else {
        return answers.media;
      }
    });
  } else {
    return imdbSearch();
  }
};
