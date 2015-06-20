#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var inquirer = require('inquirer');

if (argv.setup === true) {
  require('./lib/setup-task.js')();
} else if (argv.adapter) {
  require('./lib/search-task.js').search(argv.adapter);
} else {
  inquirer.prompt({
    type: "list",
    name: "adapter",
    message: "Select Adapter",
    choices: [
      "tpb",
      "kickass"
    ]
  }, function(answers) {
    require('./lib/search-task.js').search(answers.adapter);
  });
}
