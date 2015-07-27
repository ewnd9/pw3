var Promise = require('bluebird');

var tpb = require('thepiratebay');
tpb.setUrl('http://thepiratebay.vg');

var _ = require('lodash');

module.exports.query = (query) => {
  return new Promise((resolve, reject) => {
    tpb.search(query).then((results) => {
      results = _.map(results, (release) => {
        return {
          name: release['name'],
          magnet: release['magnetLink'],
          seeders: release['seeders'],
          leechers: release['leechers'],
          size: release['size']
        }
      });
      resolve(results);
    });
  });
};
