var Promise = require('bluebird');
var inquirer = require('inquirer-bluebird');
var moment = require('moment');

var _ = require('lodash');

module.exports.run = (config) => {

  var watchedStorage = require('./helpers/watched-storage')(config);

  var flattenEpisodes = (show) => {
    var seasons = _.map(show.seasons, (season) => season.episodes);
    return _.flatten(seasons);
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
        })
      }).then((answers) => {
        return answers.media;
      });
    }).then((media) => {
      var progressEntry = watchedStorage.findProgressEntry(media);

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

        var checkEpisodes = (episodes) => {
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
          return episode._date.isBefore(moment()); // is before now
        });

        return inquirer.prompt({
          type: 'list',
          name: 'action',
          message: 'Select action',
          choices: ['Select episodes', 'Check all aired episodes as watched to'], // @TODO: Check all aired to [last-episode]
        }).then((answers) => {
          if (answers.action === 'Select episodes') {
            return selectEpisodes(season.episodes).then((episodes) => {
              checkEpisodes(episodes);
            });
          } else {
            return checkEpisodes(airedEpisodes);
          }
        });
      });
    });
  };

  return loop();

};
