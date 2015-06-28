#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
args = argv['_'] || [];

var isFirstRun = false; // dot-file-config logic error :(

var config = require('dot-file-config')('.pw3-npm', __dirname + '/default-config.json', function() {
  isFirstRun = true;
});

if (isFirstRun || argv.setup === true) {
  require('./lib/setup-task.js')(config);
} else if (argv.adapter) {
  require('./lib/search-task.js').search(argv.adapter);
} else if (args[0] === 'info') {
  args.splice(0, 1);
  require('./lib/info-task.js').search(args.join(' '));
} else if (args[0] === 'timeline') {
  require('./lib/timeline-task.js').run(config);
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
