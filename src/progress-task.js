var Promise = require('bluebird');
var inquirer = require('inquirer-bluebird');
var moment = require('moment');

var _ = require('lodash');

module.exports.run = (config) => {

  var watchedStorage = require('./helpers/watched-storage')(config);
  var historyStorage = require('./helpers/history-storage');

  var flattenEpisodes = (show) => {
    var seasons = _.map(show.seasons, (season) => season.episodes);
    return _.flatten(seasons);
  };

  var checkEpisodes = (show, episodes) => {
    var progressEntry = watchedStorage.findProgressEntry(show);
    var now = moment().toString();

    _.each(episodes, (episode) => {

      var episodeEntry = watchedStorage.findEpisodeEntry(progressEntry, episode);

      if (!episodeEntry) {
        episodeEntry = {
          episode: episode.episode,
          season: episode.season,
        };

        progressEntry.episodes.push(episodeEntry);
      }

      episodeEntry.checked = true;
      episodeEntry.checkedDate = now;
    });

    config.save();
    return loop();
  };

  var checkSeasons = (media) => {
    return inquirer.prompt({
      type: 'list',
      name: 'season',
      message: 'Select season',
      choices: _.map(media.seasons, (season) => {
        var stats = watchedStorage.getStats(media, season.episodes);

        return {
          name: `${season.season} season | ${stats}`,
          value: season
        };
      })
    }).then((answers) => {
      var season = answers.season;

      var selectEpisodes = (episodes) => {
        return inquirer.prompt({
          type: 'checkbox',
          name: 'episodes',
          message: 'Select watched episodes',
          choices: _.map(episodes, (episode) => {
            return {
              name: episode.fullTitle,
              value: episode,
              checked: watchedStorage.isEpisodeChecked(media, episode)
            };
          })
        }).then((answers) => {
          return answers.episodes;
        });
      };

      var airedEpisodes = _.filter(season.episodes, (episode) => {
        return episode._date.isBefore(moment());
      });

      return inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'Select action',
        choices: ['Select episodes', 'Check all aired episodes as watched'],
      }).then((answers) => {
        if (answers.action === 'Select episodes') {
          return selectEpisodes(season.episodes).then((episodes) => {
            checkEpisodes(media, episodes);
          });
        } else {
          return checkEpisodes(media, airedEpisodes);
        }
      });
    });
  };

  var checkShow = (media) => {
    var history = historyStorage.getHistoryByImdb(config, media.imdb);
    var lastWatchedEpisode = watchedStorage.findLatestEpisode(media);

    if (!history || history.s === 0 || history.ep === 0) {
      return checkSeasons(media);
    }

    if (lastWatchedEpisode && lastWatchedEpisode.season === history.s && lastWatchedEpisode.episode === history.ep) {
      return checkSeasons(media);
    }

    var lastHistoryEpisode = require('./utils/format-utils').formatEpisodeNumeric(history.s, history.ep);

    return inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'Select action',
      choices: ['Check seasons', 'Check up to ' + lastHistoryEpisode]
    }).then((answers) => {
      if (answers.action === 'Check seasons') {
        return checkSeasons(media);
      } else {
        var episodes = flattenEpisodes(media);
        var filtered = _.filter(episodes, (episode) => {
          return episode.season < history.s || episode.season === history.s && episode.episode <= history.ep;
        });
        return checkEpisodes(media, filtered);
      }
    });
  };

  var loop = () => {
    return require('./helpers/get-shows-task').run(config).then((shows) => {
      return inquirer.prompt({
        type: 'list',
        name: 'media',
        message: 'Select title',
        choices: _.map(shows, (show) => {
          var episodes = flattenEpisodes(show);
          var stats = watchedStorage.getStats(show, episodes);

          return {
            name: `${show.title} | ${stats}`,
            value: show
          };
        }).concat(new inquirer.Separator(), 'Add new show')
      }).then((answers) => {
        return answers.media;
      });
    }).then((media) => {
      if (media === 'Add new show') {
        return inquirer.prompt({
          type: 'input',
          name: 'title',
          message: 'Show name'
        }).then((answers) => {
          var userInput = answers.title;

          return require('./helpers/resolve-title-task').run(userInput).then((media) => {
            historyStorage.setImdb(config, userInput, media.imdb);
            return loop();
          });
        });
      } else {
        return checkShow(media);
      }
    });
  };

  return loop();

};
