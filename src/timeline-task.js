module.exports.run = function(input) {
  var moment = require('moment');
  var _ = require('lodash');

  var now = moment();

  var time = (!input || input.length !== 2) ? [2, 'week'] : input;

  var twoWeekAgo = moment(now).add(time[0] * -1, time[1]);
  var twoWeekFromNow = moment(now).add(time[0], time[1]);

  return require('./helpers/get-shows-task').run().then((_episodes) => {
    var episodes = require('./helpers/flat-episodes-filter').run(_episodes);

    var filtered = _.filter(episodes, function(episode) {
      return episode._date.isAfter(twoWeekAgo) && episode._date.isBefore(twoWeekFromNow) && episode._date.isValid();
    });

    var sorted = _.sortBy(filtered, function(x) {
      return x._date.unix();
    });

    require('./utils/print-utils').splitByToday(sorted.reverse(), {
      userCheck: true
    });
  });
};
