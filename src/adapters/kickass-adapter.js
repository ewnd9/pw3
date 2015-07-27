var Promise = require('bluebird');
var Kickass = require('node-kickass-json');
var prettyBytes = require('pretty-bytes');

var _ = require('lodash');

module.exports.query = (query) => {
  return new Promise((resolve, reject) => {
    new Kickass().setQuery(query)
      .run(function(error, data) {
        if (error) {
          reject(error);
        } else {
          resolve(_.map(data, (release) => {
            return {
              name: release['title'],
              // magnet: release['torrent:magneturi']['#'],
              magnet: release['torrentLink'],
              seeders: release['seeds'],
              leechers: release['leechs'],
              size: prettyBytes(parseInt(release['size']))
            }
          }));
        }
      });
  });
};
