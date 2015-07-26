module.exports.run = (config, query) => {
  var inquirer = require('inquirer-bluebird');
  var _ = require('lodash');

  var imdb = require('./../api/imdb');

  var historyStorage = require('./history-storage');
  var history = historyStorage.getImdb(config, query);

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
      historyStorage.setImdb(config, query, answers.media);
      return answers.media;
    });
  }

  if (history) {
    return inquirer.prompt({
      type: 'list',
      name: 'media',
      message: 'Select title',
      choices: [{
        name: history.media.title + ' (' + history.media.year + ')',
        value: history.media
      }].concat(new inquirer.Separator(), 'More')
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
