var imdb = require('./api/imdb');
var print = require('./utils/print-utils');

module.exports.search = function(query) {
  var _ = require('lodash');

  imdb.search(query).then(function(data) {
    var inquirer = require('inquirer');

    inquirer.prompt({
      type: "list",
      name: "movie",
      message: "Select title",
      choices: _.map(data, function(item) {
        return {
          name: item.title + ' (' + item.year + ')',
          value: item
        }
      }).concat(new inquirer.Separator(), 'Exit')
    }, function(answers) {
      var m = answers.movie;

      if (m === 'Exit') {
        process.exit(0);
      } else {
        print.kv('url', m.url);
        print.kv('rating', m.rating);
        print.kv('description', m.description);

        inquirer.prompt({
          type: "list",
          name: "action",
          message: "Select action",
          choices: (m.isShow ? ['Seasons'] : []).concat(['Exit'])
        }, function(answers) {
          var a = answers.action;
          if (a === 'Seasons') {
            showSeasons(m);
          } else if (a === 'Exit') {
            process.exit(1);
          }
        });
      }
    });

    var showSeasons = function(m) {
      imdb.searchByImdb(m.imdb).then(function(data) {
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
        }, function(answers) {
          var s = answers.season;
          var tr = function(n) {
            return n < 10 ? '0' + n : '' + n;
          };

          var moment = require('moment');
          var today = moment();
          var prevDate = null;
          var used = false;

          _.each(s.episodes.reverse(), function(episode) {
            var date = moment(episode.date, 'D MMMM YYYY');
            var isDateValid = date.isValid() && date.year() > 1900;

            if (isDateValid && prevDate && prevDate.isAfter(today) && date.isBefore(today)) {
              used = true;
              print.info('==== today ====');
            } else if (isDateValid && !prevDate && date.isBefore(today)) {
              used = true;
              print.info('==== today ====');
            }

            print.kv(tr(s.season) + 'x' + tr(episode.episode), episode.title + ' (' + episode.date + ')');
            prevDate = date;
          });

          if (!used) {
            print.info('==== today ====');
          }

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
