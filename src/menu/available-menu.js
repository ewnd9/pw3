var config = require('./../utils/config');
var _ = require('lodash');
var inquirer = require('inquirer-question');

var display = (isShow) => {

  var items = _.filter(config.data.wantList, (media) => media.isShow === isShow);

  return inquirer.prompt({
    type: 'list',
    name: 'query',
    message: 'media',
    choices: _.map(items, (item) => {
      return isShow ? `${item.title} s01e01` : item.title;
    })
  });

};

var search = (result) => {
  var title = result.query;
  return require('./../helpers/search-with-postfix')(title);
};

module.exports = () => {
  return {
    message: 'available',
    choices: {
      'Want to watch movies': () => display(false).then(search),
      'Want to watch shows': () => display(true).then(search),
      'Watching shows': () => require('./../helpers/available-user-shows-task').run().then(search)
    }
  };
};
