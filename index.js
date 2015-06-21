#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
args = argv['_'] || [];

if (argv.setup === true) {
  require('./lib/setup-task.js')();
} else if (argv.adapter) {
  require('./lib/search-task.js').search(argv.adapter);
} else if (args[0] === 'info') {
  args.splice(0, 1);
  require('./lib/info-task.js').search(args.join(' '));
} else {
  require('inquirer').prompt({
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
