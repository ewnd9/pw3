#!/usr/bin/env node

var _ = require('lodash');
var tpb = require('thepiratebay');
var prompt = require('prompt');
var Table = require('cli-table');
var sys = require('sys');
var exec = require('child_process').exec;
var Q = require('q');

var argv = require('minimist')(process.argv.slice(2));
var table = new Table({
  head: ['#', 'Name', 'Size', 'Stats']
});

var result = [];

var ioLoop = function(hideTable) {
  if (!hideTable) {
    console.log(table.toString());
  }

  process.stdout.write('select: ');
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
};

process.stdin.on('data', function (text) {
  var index = parseInt(text);
  var r = result[index - 1];
  console.log('running: ' + r.name);
  exec('transmission-gtk "' + r.magnet + '"');

  ioLoop(true);
});

var filterBySubstrings = function(results, substrings) {
  return _.filter(results, function(val) {
    var item = _.find(substrings, function(substring) {
      return val.name.indexOf(substring) === -1;
    });

    return typeof item === 'undefined';
  });
};

var adapters = {
  tpb: require('./src/tpb-adapter'),
  kickass: require('./src/kickass-adapter')
}

var search = function(query) {
  return adapters[argv['adapter'] || 'tpb'].query(query).then(function(results) {
    if (argv['c']) {
      results = filterBySubstrings(results, argv['c'].split(','));
    }

    return results;
  });
};

var query = argv['_'].join(' ');
var regex = /[eE]([\d]+)\-([\d]+)/;
var found = query.match(regex);
var xs = [];

var tr = function(s, n) {
  return (s.length >= n) ? s : tr('0' + s, n);
}

if (found) {
  xs = _.map(_.range(parseInt(found[1]), parseInt(found[2]) + 1), function(i) {
    return search(query.replace(found[0], 'e' + tr(i + '', 2)));
  });
} else {
  xs = [search(query)];
}

Q.all(xs).then(function(results) {
  result = _.flatten(results);

  if (result.length === 0) {
    console.log('0 results');
    process.exit();
  }

  _.each(result, function(val, i) {
    table.push(
      [(i + 1) + '', val.name, val.size, val.seeders + '/' + val.leechers]
    );
  });

  ioLoop();
});
