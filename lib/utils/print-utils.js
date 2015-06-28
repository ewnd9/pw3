var chalk = require('chalk');

var argsJoin = function(args) {
  return Array.prototype.slice.call(args).map(function(x) { return typeof x === 'object' ? JSON.stringify(x) : x; }).join(' ');
}

module.exports.info = function() {
  console.log(chalk.green(argsJoin(arguments)));
};

module.exports.kv = function(key, value) {
  console.log(chalk.green(key + ':') + ' ' + value);
};

var tr = function(n) {
  return n < 10 ? '0' + n : '' + n;
};

module.exports.splitByToday = function(episodes, title) {
  var moment = require('moment');
  var _ = require('lodash');

  var today = moment();

  var prevDate = null;
  var used = false;

  var printToday = function() {
    module.exports.info('==== today (' + (today.format('DD.MM.YYYY')) + ') ====');
  };

  _.each(episodes, function(episode) {
    var date = episode._date;
    var isDateValid = date.isValid() && date.year() > 1900;

    if (isDateValid && prevDate && prevDate.isAfter(today) && date.isBefore(today)) {
      used = true;
      printToday();
    } else if (isDateValid && !prevDate && date.isBefore(today)) {
      used = true;
      printToday();
    }

    module.exports.kv([episode._date.format('DD.MM.YYYY'), episode.showTitle || '', tr(episode.season) + 'x' + tr(episode.episode)].join(' '), episode.title);
    prevDate = date;
  });

  if (!used) {
    printToday();
  }
};