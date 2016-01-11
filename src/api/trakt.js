import request from 'request-promise';
import moment from 'moment';
import Promise from 'bluebird';

export let getAccessToken = (pin) => {
	var data = {
		code: pin,
		client_id: '412681ab85026009c32dc6e525ba6226ff063aad0c1a374def0c8ee171cf121f',
  	client_secret: '714f0cb219791a0ecffec788fd7818c601397b95b2b3e8f486691366954902fb',
  	redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
		grant_type: 'authorization_code'
	};

	var params = {
		url:'https://api-v2launch.trakt.tv/oauth/token',
		method: 'POST',
		form: data
	};

	return request(params).then((response) => {
		var body = JSON.parse(response);
		return body.access_token;
	});
};

var config = require('./../utils/config');
var token = config.data.traktAccessToken;
var formatUtils = require('./../utils/format-utils');

const traktRequest = (url) => {
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

export const traktCalendar = (interval) => {
	var startDate = moment().add(interval * -1, 'day').format('YYYY-MM-DD');
	return traktRequest(`https://api-v2launch.trakt.tv/calendars/my/shows/${startDate}/${interval * 2}`);
};

export const traktHistory = (show) => {
	return traktRequest('https://api-v2launch.trakt.tv/sync/history/shows/' + show);
};

export const traktTimeline = (input) => {
	let episodes;

	return traktCalendar(parseInt(input) || 30).then((result) => {
		var response = JSON.parse(result);
		var shows = {};

		episodes = response.filter((episode) => episode.episode.season > 0).map((episode) => {
			episode._date = moment(episode.first_aired);
			episode.showTitle = episode.show.title;
			episode.numericTitle = formatUtils.formatEpisodeNumeric(episode.episode.season, episode.episode.number);
			episode.title = episode.episode.title;

			shows[episode.show.ids.trakt] = true;

			return episode;
		});

		return Promise.map(Object.keys(shows), (curr) => {
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
		}, { concurrency: 5 })
	}).then(() => {
		return episodes;
	});
};
