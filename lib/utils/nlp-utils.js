"use strict";

module.exports.parseQuery = function (query) {
  var regex = /(.+)[sS]([\d]+)[eE]([\d]+)/;
  var found = query.match(regex);

  return found ? {
    title: found[1].trim().toLowerCase(),
    s: parseInt(found[2]),
    ep: parseInt(found[3])
  } : null;
};

module.exports.parseEpisodesRange = function (query) {
  var regex = /[eE]([\d]+)(\-([\d]+))?/;
  var found = query.match(regex);

  return found ? {
    expr: found[0],
    from: parseInt(found[1]),
    to: parseInt(found[3] || found[1])
  } : null;
};