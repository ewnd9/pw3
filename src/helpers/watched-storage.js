module.exports = (config) => {
  var _ = require('lodash');
  var moment = require('moment');

  var data = config.data.progress = config.data.progress || {};

  var result = {};

  result.findProgressEntry = (show) => {
    var progressEntry = data[show.imdb];

    if (!progressEntry) {
      progressEntry = data[show.imdb] = {
        title: show.title,
        imdb: show.imdb,
        episodes: []
      };
    }

    return progressEntry;
  };

  result.findEpisodeEntry = (progressEntry, episode) => {
    return _.find(progressEntry.episodes, (progressEpisode) => {
      return episode.season === progressEpisode.season && episode.episode === progressEpisode.episode;
    });
  };

  result.findLatestEpisode = (media) => {
    var showEntry = result.findProgressEntry(media);
    return _.last(_.sortByAll(showEntry.episodes, ['season', 'episode']));
  };

  result.isEpisodeChecked = (episode) => {
    var progressEntry = data[episode.showImdb];
    if (!progressEntry) {
      return false;
    }

    var episodeEntry = result.findEpisodeEntry(progressEntry, episode);
    return episodeEntry && episodeEntry.checked;
  };

  var now = moment();

  result.getStats = (show, episodes) => {
    var watched = 0;
    var unwatched = 0;
    var unaired = 0;

    _.each(episodes, (episode) => {
      if (result.isEpisodeChecked(episode)) {
        watched++;
      } else if (episode._date.isBefore(now)) {
        unwatched++;
      } else {
        unaired++;
      }
    });

    if (watched === episodes.length) {
      return 'watched: all';
    } else {
      // var s1 = '';
      var s1 = watched > 0 ? `watched: ${watched} episodes` : '';
      var s2 = unwatched > 0 ? `unwatched: ${unwatched} episodes` : '';
      var s3 = unaired > 0 ? `unaired: ${unaired} episodes` : '';

      return _.filter([s1, s2, s3], (s) => s.length > 0).join(', '); // @TODO: plurals
    }
  };

  // wip
  result.getSeasonsStats = (show, seasons) => {
    var watchedSeasons = 0;
    var unwatchedSeasons = 0;
    var watched = 0;
    var unwatched = 0;

    _.each(seasons, (season) => {
      watched = 0;
      unwatched = 0;

      _.each(season.episodes, (episode) => {
        if (result.isEpisodeChecked(episode)) {
          watched++;
        } else {
          unwatched++;
        }
      });

      if (watched === season.episodes.length) {
        watchedSeasons++;
      } else {
        unwatchedSeasons++;
      }
    });

    var watchedString = (watchedSeasons > 0) ? `${watchedSeasons} seasons` : `0 seasons`;
    var unwatchedString = (unwatchedSeasons === 1) ? `${unwatched} episodes` : `${unwatchedSeasons} seasons`;

    return `watched: ${watchedString}, unwatched: ${unwatchedString}`; // @TODO: plurals
  };

  return result;
};
