var chalk = require('chalk');
var _ = require('lodash');

var argsJoin = function(args) {
  return Array.prototype.slice.call(args).map(function(x) { return typeof x === 'object' ? JSON.stringify(x) : x; }).join(' ');
}

var info = module.exports.info = function() {
  console.log(chalk.green(argsJoin(arguments)));
};

module.exports.kvFormat = function(key, value) {
  return chalk.green(key + ':') + ' ' + value;
};

module.exports.kv = function(key, value) {
  console.log(module.exports.kvFormat(key, value));
};

var episodeFormat = module.exports.episodeFormat = (episode, options = { userCheck: false }) => {
  var data = [episode._date.format('DD.MM.YYYY'), (episode.showTitle) || '', episode.numericTitle];

  if (options.userCheck) {
    var watchedStorage = require('./../helpers/watched-storage');
    data = [watchedStorage.isEpisodeChecked(episode) ? '[x]' : '[ ]'].concat(data);
  }

  var filtered = _.filter(data, s => s.length > 0);

  return module.exports.kvFormat(filtered.join(' '), episode.title);
};

module.exports.mediaFormat = (media) => {
  return `${media.title} (${media.year})`;
};

module.exports.splitByToday = function(episodes, options) {
  var moment = require('moment');
  var today = moment();

  var prevDate = null;
  var used = false;

  var printToday = function() {
    info('==== today (' + (today.format('DD.MM.YYYY')) + ') ====');
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

    console.log(episodeFormat(episode, options));
    prevDate = date;
  });

  if (!used) {
    printToday();
  }
};
