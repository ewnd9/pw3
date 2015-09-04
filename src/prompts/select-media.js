var inquirer = require('inquirer-question');
var _ = require('lodash');

var printUtils = require('./../utils/print-utils');

module.exports = (data, message = 'Select title') => {
  return inquirer.prompt({
    type: 'list',
    name: 'media',
    message: message,
    choices: _.map(data, (item) => {
      return {
        name: printUtils.mediaFormat(item),
        value: item
      }
    }).concat(new inquirer.Separator(), 'Exit')
  }).then((answers) => {
    if (answers.media === 'Exit') {
      process.exit(0);
    } else {
      return answers.media;
    }
  });
};
