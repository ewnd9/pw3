var printUtils = require('./../utils/print-utils');
var formatUtils = require('./../utils/format-utils');

var moment = require('moment');
var request = require('request-promise');
var Promise = require('bluebird');

var config = require('./../utils/config');
var token = config.data.traktAccessToken;

var traktRequest = (url) => {
	var options = {
		url: url,
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + token,
			'trakt-api-key': '412681ab85026009c32dc6e525ba6226ff063aad0c1a374def0c8ee171cf121f',
			'trakt-api-version': '2'
		}
	};

	return request(options);
};

var traktCalendar = (interval) => {
	var startDate = moment().add(interval * -1, 'day').format('YYYY-MM-DD');
	return traktRequest(`https://api-v2launch.trakt.tv/calendars/my/shows/${startDate}/${interval * 2}`);
};

var traktHistory = (show) => {
	return traktRequest('https://api-v2launch.trakt.tv/sync/history/shows/' + show);
};

export default (input) => {
	return traktCalendar(parseInt(input) || 30).then((result) => {
		var response = JSON.parse(result);
		var shows = {};

		var episodes = response.filter((episode) => episode.episode.season > 0).map((episode) => {
			episode._date = moment(episode.first_aired);
			episode.showTitle = episode.show.title;
			episode.numericTitle = formatUtils.formatEpisodeNumeric(episode.episode.season, episode.episode.number);
			episode.title = episode.episode.title;

			shows[episode.show.ids.trakt] = true;

			return episode;
		});

		Promise.map(Object.keys(shows), (curr) => {
			return traktHistory(curr).then((result) => {
				var response = JSON.parse(result);
				response.forEach((episode) => {
					if (episode.action === 'watch') {
						var x = episodes.find(x => {
							return x.episode.season === episode.episode.season &&
										 x.episode.number === episode.episode.number &&
										 x.show.ids.trakt === episode.show.ids.trakt;
						});
						if (x) {
							x.watched = true;
						}
					}
				});
			});
		}, { concurrency: 5 }).then(() => {
			printUtils.splitByToday(episodes.reverse(), {
				userCheck: true
			});
		});
	}).catch((err) => {
		console.log(err, err.stack);
	});
};
