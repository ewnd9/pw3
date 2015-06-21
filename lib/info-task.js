var imdb = require('./api/imdb');

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
        console.log('url: ' + m.url);
        console.log('rating: ' + m.rating);
        console.log('description:');
        console.log(m.description);

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
          _.each(s.episodes.reverse(), function(episode) {
            console.log(tr(s.season) + 'x' + tr(episode.episode) + ' ' + episode.title + ' (' + episode.date + ')');
          });
        });
      });
    };
  });
};
