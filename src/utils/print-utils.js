var chalk = require('chalk');
var _ = require('lodash');

var argsJoin = function(args) {
  return Array.prototype.slice.call(args).map(function(x) { return typeof x === 'object' ? JSON.stringify(x) : x; }).join(' ');
}

var info = module.exports.info = function() {
  console.log(chalk.green(argsJoin(arguments)));
};

module.exports.kvFormat = function(key, value, color = chalk.green) {
  return color(key + ':') + ' ' + value;
};

module.exports.kv = function(key, value) {
  console.log(module.exports.kvFormat(key, value));
};

var episodeFormat = module.exports.episodeFormat = (episode, options = { userCheck: false, relativeDatesPadding: false, showTitlePadding: false }) => {
  var data = [];

  data.push(episode._date.format('ddd DD.MM'));

  if (typeof options.relativeDatesPadding === 'number') {
    data.push(_.padLeft(episode._date.fromNow(), options.relativeDatesPadding));
  }

  if (typeof options.showTitlePadding === 'number') {
    data.push(_.padLeft(episode.showTitle, options.showTitlePadding));
  } else {
    data.push(episode.showTitle);
  }

  data.push(episode.numericTitle);

  var color = chalk.green;

  if (options.userCheck) {
    var watchedStorage = require('./../helpers/watched-storage');

    if (watchedStorage.isEpisodeChecked(episode)) {
      data = ['[x]'].concat(data);
      color = (input) => input;
    } else {
      data = ['[ ]'].concat(data);
    }
  }

  var filtered = _.filter(data, s => s.length > 0);

  return module.exports.kvFormat(filtered.join(' '), episode.title, color);
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
    info('=== today (' + (today.format('ddd ' + dateFormat)) + ') ===');
  };

  var correctEpisodes = _.filter(episodes, (episode) => {
    return episode._date.isValid() && episode._date.year() > 1900;
  });

  var groups = _.groupBy(correctEpisodes, episode => episode._date.format(dateFormat));

  var unairedOptions = _.clone(options);

  unairedOptions.relativeDatesPadding = _.reduce(correctEpisodes, (result, episode) => {
    var pattern = episode._date.isAfter(today) ? episode._date.fromNow().length : 0;
    return Math.max(pattern, result);
  }, 0);

  var showTitlePadding = (predicate) => {
    return _.reduce(correctEpisodes, (result, episode) => {
      episode.showTitle = episode.showTitle || ''; // it's bad

      var pattern = predicate(episode) ? episode.showTitle.length : 0;
      return Math.max(pattern, result);
    }, 0);
  };

  unairedOptions.showTitlePadding = showTitlePadding(episode => episode._date.isAfter(today));
  options.showTitlePadding = showTitlePadding(episode => !episode._date.isAfter(today));

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

      if (date.isAfter(today)) {
        _.each(episodes, (episode) => console.log(episodeFormat(episode, unairedOptions)));
      } else {
        _.each(episodes, (episode) => console.log(episodeFormat(episode, options)));
      }
    }

    prevDate = date;
  });

  if (!used) {
    printToday();
  }
};
