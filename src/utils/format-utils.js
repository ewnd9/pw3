var tr = (s, n) => (s.length >= n) ? s : tr('0' + s, n);

module.exports.tr = tr;

module.exports.formatEpisode = (title, s, ep) => {
  var showName = title;
  return `${showName}-${tr(s, 2)}x${tr(ep, 2)}`;
};
