var config = require('./utils/config');
var _ = require('lodash');
var inquirer = require('inquirer-question');

module.exports.run = function() {

  var a1 = 'Want to watch movies';
  var a2 = 'Want to watch shows';
  var a3 = 'Watching shows';

  var display = (isShow) => {
    var items = _.filter(config.data.wantList, (media) => media.isShow === isShow);
    return inquirer.prompt({
      type: 'list',
      name: 'query',
      message: 'Select media',
      choices: _.map(items, (item) => {
        return isShow ? `${item.title} s01e01` : item.title;
      })
    });
  };

  return inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'Select action',
    choices: [a1, a2, a3]
  }).then((answers) => {
    var action = answers.action;

    return (() => {
      if (action === a1) {
        return display(false);
      } else if (action == a2) {
        return display(true);
      } else {
        return require('./helpers/available-user-shows-task').run();
      }
    })().then((result) => {
      var title = result.query;
      return require('./helpers/search-with-postfix')(title);
    });
  });

};
