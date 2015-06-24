var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var spawnargs = require('spawn-args');
var kexec = require('kexec');

module.exports.exec = function(cmd) {
  console.log(cmd);

  return exec(cmd);
};

// module.exports.spawn = function() {
//   throw new Error('not implemented');
// };

module.exports.replace = function(cmd) {
  console.log(cmd);

  var args = spawnargs(cmd, { removequotes: true });

  var c1 = args.splice(0, 1)[0];
  var c2 = args;

  kexec(c1, c2);
};
