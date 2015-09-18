var inquirer = require('inquirer-question');
var _ = require('lodash');

var watchedStorage = require('./../helpers/watched-storage');
var historyStorage = require('./../helpers/history-storage');
var utils = require('./progress-utils');

module.exports = () => {
  return require('./../helpers/get-shows-task').run().then((shows) => {
    return () => {
      var menu = {
        message: 'title',
        choices: {}
      };

      _.each(shows, (show) => {
        var episodes = utils.flattenEpisodes(show);
        if (show.isMovie) {
          return; // @TODO hack, should be not movies at all
        }

        var stats = watchedStorage.getStats(show, episodes);

        menu.choices[`${show.title} | ${stats}`] = () => require('./progress-show-menu')(show);
      });

      menu.choices['+ Add new show'] = () => {
        return inquirer.prompt({
          type: 'input',
          name: 'title',
          message: 'Show name'
        }).then((answers) => {
          var userInput = answers.title;

          return require('./../helpers/resolve-title-task').run(userInput).then((media) => {
            historyStorage.setImdb(userInput, media.imdb);
            return true;
          });
        });
      };

      return menu;
    };
  });
};
