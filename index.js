#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));

if (argv.setup === true) {
  require('./lib/setup-task.js')();
} else if (argv.adapter) {
  require('./lib/search-task.js').search(argv.adapter);
} else {
  require('./lib/search-task.js').withDialog();
}
