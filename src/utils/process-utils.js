var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var spawnargs = require('spawn-args');

module.exports.exec = function(cmd) {
  console.log(cmd);

  return exec(cmd);
};

module.exports.replace = function(cmd) {
  console.log(cmd);

  var data = spawnargs(cmd, { removequotes: true });

  var cmd = data.splice(0, 1)[0];
  var args = data;

  var child = spawn(cmd, args);

  child.stdin.setEncoding('utf-8');
  child.stdin.pipe(process.stdin);

  child.stdout.pipe(process.stdout);
};
