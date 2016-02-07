import * as fmt from 'show-episode-format';

export const parseEpisodesRange = function(query) {
  const found0 = query.match(/[sS]([\d]+)[eE]([\d]+)\-([\d]+)/);

  if (found0) {
    return {
      expr: found0[0],
      s: parseInt(found0[1]),
      epFrom: parseInt(found0[2]),
      epTo: parseInt(found0[3])
    };
  }

  const found1 = query.match(/[sS]([\d]+)[eE]([\d]+)\-[sS]([\d]+)[eE]([\d]+)/);

  if (found1) {
    return {
      expr: found1[0],
      s: parseInt(found1[1]),
      epFrom: parseInt(found1[2]),
      epTo: parseInt(found1[4])
    };
  }

  return null;
};

export const expandEpisodesRange = function(query) {
  const data = parseEpisodesRange(query);

  if (!data) {
    return [query];
  }

  const result = [];

  for (let i = data.epFrom ; i <= data.epTo ; i++) {
    result.push(query.replace(data.expr, fmt.formatEpisodeRelease(data.s, i)).trim());
  }

  return result;
};
