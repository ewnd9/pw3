var printUtils = require('./../utils/print-utils');
var { traktTimeline } = require('./../api/trakt');

export default (input) => {
	return traktTimeline(parseInt(input) || 30).then(episodes => {
		printUtils.splitByToday(episodes.reverse(), {
			userCheck: true
		});
	}).catch((err) => {
		console.log(err, err.stack);
	});
};
