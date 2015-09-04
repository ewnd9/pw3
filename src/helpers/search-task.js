var _ = require('lodash');
var prompt = require('prompt');
var Table = require('cli-table');
var sys = require('sys');
var Promise = require('bluebird');

var processUtils = require('./../utils/process-utils');
var nlpUtils = require('./../utils/nlp-utils');
var print = require('./../utils/print-utils');

var config = require('./../utils/config');

var f = function(query, options, finish) {
  var adapter = 'tpb';
  options = options || {};

  var table = new Table({
    head: ['#', 'Name', 'Size', 'Stats']
  });

  var result = [];

  var ioLoop = function(hideTable) {
    if (!hideTable) {
      print.info(table.toString());
    }

    process.stdout.write('select: ');
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
  };

  var onInput = (text) => {
    var index = parseInt(text);
    var r = result[index - 1];

    if (r) {
      var pjson = require('./../../package.json');
      var programs = pjson['app-data']['programs'];

      var program = _.find(programs, function(program) {
        return program.name === config.data.program;
      });

      print.info(program);

      var script = program.script.replace('$arg', r.magnet);

      print.info('running "' + r.name + '"');
      processUtils[program.type](script);

      if (r.description.queryMatches) {
        require('./../helpers/history-storage').process(r.description.queryMatches);
      }

      ioLoop(true);
    } else if (text.trim() === 'exit') {
      process.stdin.removeListener('data', onInput);
      process.stdin.pause();
      
      finish();
    } else {
      print.info('wrong input');
      ioLoop(true);
    }
  };

  process.stdin.on('data', onInput);

  var filterBySubstrings = function(results, substrings) {
    return _.filter(results, function(val) {
      var item = _.find(substrings, function(substring) {
        return val.name.indexOf(substring) === -1;
      });

      return typeof item === 'undefined';
    });
  };

  var adapters = {
    tpb: require('./../adapters/tpb-adapter'),
    kickass: require('./../adapters/kickass-adapter'),
    eztv: require('./../adapters/eztv-adapter')
  }

  var search = function(query, description) {
    return adapters[adapter].query(query).then(function(results) {
      if (options['c']) {
        results = filterBySubstrings(results, options['c'].split(','));
      }

      return _.map(results, (result) => {
        result.description = description || {};
        return result;
      });
    });
  };

  var tr = require('./../utils/format-utils').tr;

  var searchRequests = null;
  var rangeQuery = nlpUtils.parseEpisodesRange(query);

  if (rangeQuery) {
    searchRequests = _.map(_.range(rangeQuery.from, rangeQuery.to + 1), function(i) {
      var currQuery = query.replace(rangeQuery.expr, 'e' + tr(i + '', 2));

      return search(currQuery, {
        episode: i,
        queryMatches: nlpUtils.parseQuery(currQuery)
      });
    });
  } else {
    searchRequests = [search(query), {
      queryMatches: nlpUtils.parseQuery(query)
    }];
  }

  return Promise.all(searchRequests).then(function(results) {
    result = _.flatten(results);
    var i = 0;

    if (results.length === 0) {
      print.info('0 results');
      process.exit();
    }

    try {
      _.each(results, function(response, j) {

        if (j > 0) {
          table.push(['', '---']);
        }

        if (response.length === 0) {
          table.push(['', '--- no results ---']);
        }

        _.each(response, (val) => {
          table.push(
            [(i + 1) + '', val.name, val.size, val.seeders + '/' + val.leechers]
          );

          i = i + 1;
        });

      });
    } catch (e) {
      console.log(e);
    }

    ioLoop();
  });
};

module.exports = (query, options) => {
  return new Promise((resolve, reject) => {
    f(query, options, resolve);
  });
};
