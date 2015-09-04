var mediaStorage = require('./../helpers/media-storage');
var print = require('./../utils/print-utils');

var inquirer = require('inquirer-question');
var _ = require('lodash');

module.exports.print = (m) => {
  print.info('');
  print.kv('title', m.title);
  print.kv('year', m.year);
  print.kv('url', m.url);
  print.kv('rating', m.rating);
  print.kv('description', m.description);
  print.info('');
};

module.exports.showSeasons = function(m) {

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
