#!/usr/bin/env node

var meow = require('meow');
var chalk = require('chalk');
var helpLine = (command, comment) => {
  return '  ' + command + (comment ? ' ' + comment : ''); // there was chalk, but not sure how it will be displayed on different terminal color schemes
};

var cli = meow({
  help: [
    'Usage',
    helpLine('pw3 --setup'),
    helpLine('pw3 lost s01e01 720p'),
    helpLine('pw3 daredevil s01e01-05 720p'),
    helpLine('pw3 subtitles daredevil s01e01-05 --lang="en"', '# download subtitles to current folder'),
    '',
    helpLine('pw3 info "sillicon valley"', '# description, air date of episodes'),
    helpLine('pw3 timeline', '# show all watching shows air dates'),
    helpLine('pw3 available', '# show all watching shows available episodes')
  ],
  pkg: '../package.json'
});

var isFirstRun = false; // dot-file-config logic error :(

var config = require('dot-file-config')('.pw3-npm', __dirname + '/default-config.json', function() {
  isFirstRun = true;
});

if (isFirstRun || cli.flags.setup === true) {
  require('./setup-task.js')(config);
} else if (cli.flags.adapter) {
  require('./search-task.js').search(cli.flags.adapter);
} else if (cli.input[0] === 'info') {
  cli.input.splice(0, 1);
  require('./info-task.js').search(config, cli.input.join(' '));
} else if (cli.input[0] === 'subtitles') {
  cli.input.splice(0, 1);

  if (!cli.flags.lang) {
    cli.showHelp();
    process.exit(1);
  }

  require('./subtitles-task.js').run(config, cli.input.join(' '), cli.flags.lang);
} else if (cli.input[0] === 'timeline') {
  require('./timeline-task.js').run(config);
} else if (cli.input[0] === 'available') {
  require('./available-task.js').run(config);
} else if (cli.input.length === 0 || cli.input.join('').trim().length === 0) {
  cli.showHelp();
} else {
  var adapter = config.data.preferences.adapter;

  require('./search-task.js').run(config, adapter, cli.input.join(' '), {
    c: cli.flags.c
  });
}
