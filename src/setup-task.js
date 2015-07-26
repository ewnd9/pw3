var inquirer = require('inquirer-bluebird');
var _ = require('lodash');

var pathUtils = require('./utils/path-utils');

module.exports = function(config) {
  var now = function(value) {
    return value ? ' (now: ' + value + ')' : '';
  };

  var adapters = config.data.adapters;

  var q1 = {
    type: "list",
    message: "Default adapter" + now(config.data.preferences.adapter),
    name: "adapter",
    choices: _.map(adapters, function(adapter) {
      return {
        name: adapter
      }
    })
  };

  var programs = config.data['available-programs'];

  var q2 = {
    type: "list",
    message: "Default program" + now(config.data.preferences.program),
    name: "program",
    choices: _.map(programs, function(program) {
      var name = [
        program.name,
        pathUtils.isInPath(program.name) ? '(installed)' : '(not founded)', // Inquirer's disabled doesn't seem to work for me
        '[' + program.description + ']',
        '[' + program.script + ']'
      ];

      return {
        name: name.join(' '),
        value: program.name
      }
    })
  };

  inquirer.prompt([q1, q2]).then(function(answers) {
    config.data.preferences.adapter = answers.adapter;
    config.data.preferences.program = answers.program;
    config.save();
  });
};
