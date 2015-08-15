#!/usr/bin/env node

var config = require('./utils/config');

var meow = require('meow');
var chalk = require('chalk');
var helpLine = (command, comment) => {
  return '  ' + command + (comment ? ' ' + comment : ''); // there was chalk, but not sure how it will be displayed on different terminal color schemes
};

var cli = meow({
  help: [
    'Usage',
    helpLine('# configure default torrent-tracker and torrent programm'),
    helpLine('pw3 --setup'),
    '',
    helpLine('# search torrents'),
    helpLine('pw3 lost s01e01 720p'),
    '',
    helpLine('# range query'),
    helpLine('pw3 daredevil s01e01-05 720p'),
    '',
    helpLine('# specify torrent-tracker [tpb|kickass|eztv]'),
    helpLine('pw3 true detective s01e01 720p --adapter=kickass'),
    '',
    helpLine('# download subtitles to current dir'),
    helpLine('pw3 subtitles daredevil s01e01-05 --lang="en"'),
    '',
    helpLine('# description, air date of episodes'),
    helpLine('pw3 info "sillicon valley"'),
    '',
    helpLine('# show all watching shows air dates'),
    helpLine('pw3 timeline'),
    '',
    helpLine('# search all unwatched episodes torrents'),
    helpLine('pw3 available'),
    '',
    helpLine('# check watched episodes'),
    helpLine('pw3 progress'),
    '',
    'Data',
    helpLine(config.path)
  ],
  pkg: '../package.json'
});

var result = null;

if (config.isFirstRun || cli.flags.setup === true) {
  result = require('./setup-task.js').run();
} else if (cli.input[0] === 'info') {
  cli.input.splice(0, 1);
  var query = cli.input.join(' ').trim();

  if (query.length === 0) {
    cli.showHelp();
    process.exit(1);
  }

  result = require('./info-task.js').run(query);
} else if (cli.input[0] === 'subtitles') {
  cli.input.splice(0, 1);

  if (!cli.flags.lang) {
    cli.showHelp();
    process.exit(1);
  }

  result = require('./subtitles-task.js').run(cli.input.join(' '), cli.flags.lang);
} else if (cli.input[0] === 'timeline') {
  cli.input.splice(0, 1);
  result = require('./timeline-task.js').run(cli.input);
} else if (cli.input[0] === 'available') {
  result = require('./available-task.js').run();
} else if (cli.input[0] === 'progress') {
  result = require('./progress-task.js').run();
} else if (cli.input.length === 0 || cli.input.join('').trim().length === 0) {
  cli.showHelp();
} else {
  var adapter = cli.flags.adapter ? cli.flags.adapter : config.data.adapter;

  result = require('./search-task.js').run(adapter, cli.input.join(' '), {
    c: cli.flags.c
  });
}

if (result && typeof result.then === 'function') {
  result.catch((err) => {
    console.error(err.stack);
  });
}
