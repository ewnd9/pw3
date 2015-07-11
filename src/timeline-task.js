module.exports.run = function(config) {
  var moment = require('moment');
  var _ = require('lodash');

  var now = moment();
  var twoWeekAgo = moment(now).add(-2, 'week');
  var twoWeekFromNow = moment(now).add(+2, 'week');

  require('./helpers/get-shows-task').run(config).then((_episodes) => {
    var episodes = require('./helpers/flat-episodes-filter').run(_episodes);
    
    var filtered = _.filter(episodes, function(episode) {
      return episode._date.isAfter(twoWeekAgo) && episode._date.isBefore(twoWeekFromNow);
    });

    var sorted = _.sortBy(filtered, function(x) {
      return x._date.unix();
    });

    require('./utils/print-utils').splitByToday(sorted.reverse());
  });
};
