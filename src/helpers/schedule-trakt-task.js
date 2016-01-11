var printUtils = require('./../utils/print-utils');
var { traktTimeline } = require('./../api/trakt');

var _ = require('lodash');
var moment = require('moment');

var now = moment();

export default (input) => {
	return traktTimeline(parseInt(input) || 30).then(episodes => {
		const shows = _.groupBy(episodes, ep => ep.show.title);
		_.each(shows, (eps, showTitle) => {
			const notWatched = eps.filter(ep => !ep.watched);

			if (notWatched.length === 0) {
				return;
			}

			const [pastEpisodes, futureEpisodes] = _.partition(notWatched, ep => ep._date.isBefore(now));

			const pastTitle = pastEpisodes.length > 0 ? `${pastEpisodes.length} available` : '';
			const nextTitle = futureEpisodes.length > 0 ? `next episode ${futureEpisodes[0]._date.fromNow()}` : '';

			const intervals = [];
			const futureEpisodesTail = _.rest(futureEpisodes);

			if (futureEpisodesTail.length > 0) {
				let currStreak = 1;

				const processDiff = (diff) => {
					if (diff === 7) {
						currStreak++;
					} else {
						if (currStreak > 1) {
							intervals.push(`then ${currStreak} episodes every week`);
						}

						if (diff) {
							intervals.push(`then next episode in ${diff} days`);
						}

						currStreak = 1;
					}
				};

				for (let i = 1 ; i < futureEpisodesTail.length ; i++) {
					const diff = futureEpisodesTail[i]._date.diff(futureEpisodesTail[i - 1]._date, 'days');
					processDiff(diff);
				}

				if (currStreak > 1) {
					processDiff();
				}
			}

			const titles = [pastTitle, nextTitle].concat(intervals).filter(title => !!title).join(', ');
			console.log(printUtils.kvFormat(showTitle, titles));
		});
	}).catch((err) => {
		console.log(err, err.stack);
	});
};
