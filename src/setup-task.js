var inquirer = require('inquirer-bluebird');
var _ = require('lodash');

var pathUtils = require('./utils/path-utils');

module.exports.run = function(config) {
  var now = function(value) {
    return value ? ' (now: ' + value + ')' : '';
  };

  var adapters = ['tpb', 'kickass', 'eztv'];

  var q1 = {
    type: "list",
    message: "Default adapter" + now(config.data.adapter),
    name: "adapter",
    choices: _.map(adapters, function(adapter) {
      return {
        name: adapter
      }
    })
  };

  var pjson = require('./../package.json');
  var programs = pjson['app-data']['programs'];

  var q2 = {
    type: "list",
    message: "Default program" + now(config.data.program),
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

  return inquirer.prompt([q1, q2]).then(function(answers) {
    config.data.adapter = answers.adapter;
    config.data.program = answers.program;
    config.save();
  });
};
