var chalk = require('chalk');

var argsJoin = function(args) {
  return Array.prototype.slice.call(args).map(function(x) { return typeof x === 'object' ? JSON.stringify(x) : x; }).join(' ');
}

module.exports.info = function() {
  console.log(chalk.green(argsJoin(arguments)));
};

module.exports.kv = function(key, value) {
  console.log(chalk.green(key + ':') + ' ' + value);
};
