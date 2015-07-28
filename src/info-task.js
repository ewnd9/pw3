var imdb = require('./api/imdb');
var print = require('./utils/print-utils');

module.exports.run = function(config, query) {
  var _ = require('lodash');
  var inquirer = require('inquirer-bluebird');

  var selectImdbTask = require('./helpers/select-imdb-task');
  var mediaStorage = require('./helpers/media-storage');

  return selectImdbTask.run(config, query).then((m) => {
    if (m === 'Exit') {
      process.exit(0);
    } else {
      print.info('');
      print.kv('title', m.title);
      print.kv('url', m.url);
      print.kv('rating', m.rating);
      print.kv('description', m.description);
      print.info('');

      inquirer.prompt({
        type: "list",
        name: "action",
        message: "Select action",
        choices: (m.isShow ? ['Seasons'] : []).concat(['Exit'])
      }).then(function(answers) {
        var a = answers.action;

        if (a === 'Seasons') {
          showSeasons(m);
        } else if (a === 'Exit') {
          process.exit(1);
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
            userCheck: true,
            config: config
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
