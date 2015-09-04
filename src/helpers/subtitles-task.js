module.exports = (query, lang) => {
  var Promise = require('bluebird');
  var opensrt = require('opensrt_js');
  var OpenSRT = Promise.promisifyAll(new opensrt('OSTestUserAgent')); // @TODO: new user agent

  var _ = require('lodash');

  var nlpUtils = require('./../utils/nlp-utils');
  var print = require('./../utils/print-utils');
  var formatEpisode = require('./../utils/format-utils').formatEpisode;

  var selectImdbTask = require('./../helpers/select-imdb-task');
  var Download = require('download');

  var rangeQuery = nlpUtils.parseEpisodesRange(query);
  var queryMatches = nlpUtils.parseQuery(query);

  return selectImdbTask.run(queryMatches.title).then((media) => {
    var fromEp = queryMatches.ep;
    var toEp = queryMatches.ep;

    if (rangeQuery) {
      fromEp = rangeQuery.from;
      toEp = rangeQuery.to;
    }

    return Promise.reduce(_.range(fromEp, toEp + 1), (total, ep, index, arrayLength) => {
      var query = {
        imdbid: media.imdb,
        season: queryMatches.s,
        episode: ep
      };
      var title = formatEpisode(media.title, query.season, query.episode);

      return OpenSRT.searchEpisodeAsync(query).then((result) => {
        var url = result[lang][0] && result[lang][0].url;

        if (url) {
          var d = new Download({mode: '755'}).get(url).dest('.').rename(title + '.srt');
          return Promise.promisifyAll(d).runAsync();
        } else {
          return 'not found';
        }
      }).then((files) => {
        total[title] = files;

        print.kv(title, (files[0]) ? files[0].path : files);
        print.info((index + 1) + ' / ' + arrayLength);
        return total;
      });
    }, {});
  });
};
