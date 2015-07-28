var imdb = require('./../api/imdb');
var inquirer = require('inquirer-bluebird');

var _ = require('lodash');

module.exports.run = (query) => {
  return imdb.search(query).then(function(data) {
    return inquirer.prompt({
      type: 'list',
      name: 'movie',
      message: 'Select title for "' + query + '"',
      choices: _.map(data, function(item) {
        return {
          name: item.title + ' (' + item.year + ')',
          value: item
        }
      }).concat(new inquirer.Separator(), 'Exit')
    }).then(function(answers) {
      return answers.movie;
    });
  });
};
