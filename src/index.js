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

if (cli.input.length === 0 || cli.input.join('').trim().length === 0) {
  require('./menu-entry')();
} else {
  require('./cli-entry')(cli);
}
