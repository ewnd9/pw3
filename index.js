var _ = require('lodash');
var tpb = require('thepiratebay');
var prompt = require('prompt');
var Table = require('cli-table');
var sys = require('sys');
var exec = require('child_process').exec;

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

tpb.search(process.argv.splice(2).join(' ')).then(function(results) {
  result = results;

  if (result.length === 0) {
    console.log('0 results');
    process.exit();
  }

  _.each(results, function(val, i) {
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
