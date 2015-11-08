var inquirer = require('inquirer-question');
var _ = require('lodash');

var pathUtils = require('./../utils/path-utils');
var config = require('./../utils/config');
var Promise = require('bluebird');
var traktApi = require('./../api/trakt');

module.exports = function() {
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

  var pjson = require('./../../package.json');
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

  var q3 = {
    type: 'input',
    message: `Open "https://trakt.tv/pin/6495", then paste pin here. Leave empty if you don't want to use trakt`,
    name: 'traktPin'
  };

  return inquirer.prompt([q1, q2, q3]).then(function(answers) {
    config.data.adapter = answers.adapter;
    config.data.program = answers.program;

    config.save();

    if (answers.traktPin.length > 0) {
      return traktApi.getAccessToken(answers.traktPin).then((accessToken) => {
        config.data.traktAccessToken = accessToken;
        config.save();
      })
    } else {
      return Promise.resolve(true);
    }
  });
};
