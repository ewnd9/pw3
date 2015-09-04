var components = require('./components');
var _ = require('lodash');
var menu = require('inquirer-menu');
var Promise = require('bluebird');

module.exports = (cli) => {
  var result = null;
  var query = cli.input.slice(1).join(' ').trim();

  var curr = components[cli.input[0]];

  if (curr) {
    var args = _.map(curr.args, (arg) => arg === 'query' ? query : cli.flags[arg]);

    var fn = require(curr.path);
    var result = fn.apply(this, args);

    if (curr.type === 'menu') {
      ((result && result.then) ? result : Promise.resolve(result)).then((result) => {
        menu(result);
      });
    }
  } else {
    cli.showHelp();
    process.exit(1);
  }

  if (result && typeof result.then === 'function') {
    result.catch((err) => {
      console.error(err.stack);
    });
  }
};
