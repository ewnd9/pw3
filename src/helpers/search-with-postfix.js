var inquirer = require('inquirer-question');
var config = require('./../utils/config');

module.exports = (title) => {
  return inquirer.prompt({
    type: 'input',
    name: 'postfix',
    message: 'Enter query postfix'
  }).then((answers) => {
    var query = title + ' ' + answers.postfix;

    var print = require('./../utils/print-utils');
    print.info('Searching "' + query + '"');

    return require('./../search-task').run(config.data.adapter, query);
  });
}
