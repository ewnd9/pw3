var delimiter = require('path').delimiter;
var fs = require('fs');

module.exports.isInPath = function(cmd) {
  var result = false;

  process.env.PATH.split(delimiter).some(function (path) {
    try {
      fs.readdirSync(path).forEach(function(file) {
        if (file === cmd) {
          result = true;
        }
      });
    } catch (err) {
      console.log(err);
    }
  });

  return result;
};
