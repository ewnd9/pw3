var tr = (s, n) => (String(s).length >= n) ? s : tr('0' + s, n);

module.exports.tr = tr;

module.exports.formatEpisodeNumeric = (s, ep) => {
  return `${tr(s, 2)}x${tr(ep, 2)}`;
};

module.exports.formatEpisode = (title, s, ep) => {
  var showName = title; // @TODO: slug
  return `${showName}-${module.exports.formatEpisodeNumeric(s, ep)}`;
};
