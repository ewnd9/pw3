var inquirer = require('inquirer');
var Promise = require('bluebird');

module.exports.prompt = function(params) {
  return new Promise(function(resolve, reject) {
    inquirer.prompt(params, function(answers) {
      resolve(answers);
    });
  });
};
