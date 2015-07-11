#!/usr/bin/env node
'use strict';

var argv = require('minimist')(process.argv.slice(2));
var args = argv['_'] || [];

var isFirstRun = false; // dot-file-config logic error :(

var config = require('dot-file-config')('.pw3-npm', __dirname + '/default-config.json', function () {
  isFirstRun = true;
});

if (isFirstRun || argv.setup === true) {
  require('./setup-task.js')(config);
} else if (argv.adapter) {
  require('./search-task.js').search(argv.adapter);
} else if (args[0] === 'info') {
  args.splice(0, 1);
  require('./info-task.js').search(args.join(' '));
} else if (args[0] === 'timeline') {
  require('./timeline-task.js').run(config);
} else if (args[0] === 'available') {
  require('./available-task.js').run(config);
} else {
  require('inquirer-bluebird').prompt({
    type: 'list',
    name: 'adapter',
    message: 'Select Adapter',
    choices: ['tpb', 'kickass']
  }).then(function (answers) {
    require('./search-task.js').run(config, answers.adapter, argv['_'].join(' '), {
      c: argv['c']
    });
  });
}