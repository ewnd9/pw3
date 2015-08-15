var imdb = require('./api/imdb');
var print = require('./utils/print-utils');
var config = require('./utils/config');

module.exports.run = function(query) {
  var _ = require('lodash');
  var inquirer = require('inquirer-bluebird');

  var selectImdbTask = require('./helpers/select-imdb-task');
  var mediaStorage = require('./helpers/media-storage');

  return selectImdbTask.run(query).then((m) => {
    if (m === 'Exit') {
      process.exit(0);
    } else {
      print.info('');
      print.kv('title', m.title);
      print.kv('url', m.url);
      print.kv('rating', m.rating);
      print.kv('description', m.description);
      print.info('');

      var choices = m.isShow ? ['Seasons'] : [];

      if (!config.data.wantList[m.imdb]) {
        choices.push('Add to "Want to watch"');
      } else {
        choices.push('Remove from "Want to watch"');
      }

      choices.push('Exit');

      return inquirer.prompt({
        type: "list",
        name: "action",
        message: "Select action",
        choices: choices
      }).then(function(answers) {
        var a = answers.action;

        if (a.indexOf('Add to') === 0) {
          config.data.wantList[m.imdb] = m;
          config.save();

          return true;
        } else if (a.indexOf('Remove from') === 0) {
          delete config.data.wantList[m.imdb];
          config.save();

          return true;
        } else if (a === 'Seasons') {
          return showSeasons(m);
        } else {
          return true;
        }
      });
    }

    var showSeasons = function(m) {
      mediaStorage.getByImdb(m.imdb).then(function(data) {
        inquirer.prompt({
          type: "list",
          name: "season",
          message: "Select season",
          choices: _.map(data.seasons.reverse(), function(season) {
            return {
              name: 'Season ' + season.season + ' (' + season.from + ' - ' + season.to + ')',
              value: season
            };
          })
        }).then(function(answers) {
          var s = answers.season;
          print.splitByToday(s.episodes.reverse(), {
            userCheck: true
          });

          // @TODO: pull request to inquirer to disable pagination
          // inquirer.prompt({
          //   type: "list",
          //   name: "action",
          //   message: "Select action",
          //   choices: _.map(s.episodes.reverse(), function(episode) {
          //     return {
          //       name: tr(s.season) + 'x' + tr(episode.episode) + ' ' + episode.title + ' (' + episode.date + ')',
          //       disabled: true
          //     };
          //   }).concat(new inquirer.Separator(), 'Exit')
          // }, function(answers) {
          //   process.exit(0);
          // });
        });
      });
    };

  });

};
