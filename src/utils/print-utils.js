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

var episodeFormat = module.exports.episodeFormat = (episode, options = { userCheck: false, relativeDatesPadding: false, showTitlePadding: false }) => {
  var data = [];

  data.push(episode._date.format('DD.MM'));

  if (typeof options.relativeDatesPadding === 'number') {
    data.push(_.padLeft(episode._date.fromNow(), options.relativeDatesPadding));
  }

  if (typeof options.showTitlePadding === 'number') {
    data.push(_.padLeft(episode.showTitle, options.showTitlePadding));
  } else {
    data.push(episode.showTitle);
  }

  data.push(episode.numericTitle);

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

  var dateFormat = 'DD.MM';

  var printToday = function() {
    info('=== today (' + (today.format(dateFormat)) + ') ===');
  };

  var correctEpisodes = _.filter(episodes, (episode) => {
    return episode._date.isValid() && episode._date.year() > 1900;
  });

  var groups = _.groupBy(correctEpisodes, episode => episode._date.format(dateFormat));

  options.relativeDatesPadding = _.reduce(correctEpisodes, (result, episode) => {
    return Math.max(episode._date.fromNow().length, result);
  }, 0);

  options.showTitlePadding = _.reduce(correctEpisodes, (result, episode) => {
    episode.showTitle = episode.showTitle || ''; // it's bad
    return Math.max(episode.showTitle.length, result);
  }, 0);

  _.each(groups, function(episodes, dateString) {
    var date = moment(dateString, dateFormat);

    if (dateString === today.format(dateFormat)) {
      printToday();
      _.each(episodes, (episode) => console.log(episodeFormat(episode, options)));
      printToday();
    } else {
      if (prevDate && prevDate.isAfter(today) && date.isBefore(today)) {
        used = true;
        printToday();
      } else if (!prevDate && date.isBefore(today)) {
        used = true;
        printToday();
      }

      _.each(episodes, (episode) => console.log(episodeFormat(episode, options)));
    }

    prevDate = date;
  });

  if (!used) {
    printToday();
  }
};
