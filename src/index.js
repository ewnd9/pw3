#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var args = argv['_'] || [];

var isFirstRun = false; // dot-file-config logic error :(

var config = require('dot-file-config')('.pw3-npm', __dirname + '/default-config.json', function() {
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
} else if (argv['_'].length === 0 || argv['_'].join('').trim().length === 0) {
  console.log('empty input');
  process.exit(1);
} else {
  var adapter = config.data.preferences.adapter;

  require('./search-task.js').run(config, adapter, argv['_'].join(' '), {
    c: argv['c']
  });
}
