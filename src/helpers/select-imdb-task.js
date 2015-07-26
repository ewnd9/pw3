module.exports.run = (query) => {
  var inquirer = require('inquirer-bluebird');
  var _ = require('lodash');

  var imdb = require('./../api/imdb');

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
  }).then((answers) => answers.media);
};
