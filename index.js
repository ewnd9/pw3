#!/usr/bin/env node

var _ = require('lodash');
var tpb = require('thepiratebay');
var prompt = require('prompt');
var Table = require('cli-table');
var sys = require('sys');
var exec = require('child_process').exec;

var argv = require('minimist')(process.argv.slice(2));
var table = new Table({
  head: ['#', 'Name', 'Size', 'Stats']
});

var result = [];

process.stdin.on('data', function (text) {
  var index = parseInt(text);
  var r = result[index - 1];
  console.log(r);
  exec('transmission-gtk "' + r.magnetLink + '"');
  process.exit();
});

var filterBySubstrings = function(results, substrings) {
  return _.filter(results, function(val) {
    var item = _.find(substrings, function(substring) {
      return val.name.indexOf(substring) === -1;
    });

    return typeof item === 'undefined';
  });
};

tpb.search(argv['_'].join(' ')).then(function(results) {
  if (argv['c']) {
    result = filterBySubstrings(results, argv['c'].split(','));
  } else {
    result = results;
  }

  if (result.length === 0) {
    console.log('0 results');
    process.exit();
  }

  _.each(result, function(val, i) {
    table.push(
      [(i + 1) + '', val.name, val.size, val.seeders + '/' + val.leechers]
    );
  });

  console.log(table.toString());
  process.stdout.write('select: ');

  process.stdin.resume();
  process.stdin.setEncoding('utf8');
}).catch(function(err){
  console.log(err);
});
