var imdb = require('./../api/imdb');
var print = require('./../utils/print-utils');
var config = require('./../utils/config');

var _ = require('lodash');
var selectImdbTask = require('./../helpers/select-imdb-task');

module.exports = (query) => {

  return selectImdbTask.run(query).then((m) => {
    var utils = require('./info-utils');

    if (m === 'Exit') {
      return void 0;
    } else {
      return () => {
        utils.print(m);
        var choices = {};

        if (m.isShows) {
          choices['Seasons'] = () => utils.showSeasons(m);
        }

        if (config.data.wantList[m.imdb]) {
          choices['Remove from "Want to watch"'] = function() {
            delete config.data.wantList[m.imdb];
            config.save();

            return true;
          };
        } else {
          choices['Add to "Want to watch"'] = function() {
            config.data.wantList[m.imdb] = m;
            config.save();

            return true;
          };
        }

        choices['Search on torrents'] = function() {
          var query = m.isShow ? `${m.title} s01e01` : m.title;
          return require('./../helpers/search-with-postfix')(query);
        };

        return {
          message: "Select action",
          choices: choices
        };
      };
    }
  });

};
