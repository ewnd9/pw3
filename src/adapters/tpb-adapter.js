var Q = require('q');

var tpb = require('thepiratebay');
tpb.setUrl('http://thepiratebay.vg');

var _ = require('lodash');

var ReleaseModel = function(release) {
  return {
    name: release['name'],
    magnet: release['magnetLink'],
    seeders: release['seeders'],
    leechers: release['leechers'],
    size: release['size']
  }
};

module.exports = {
  query: function(query) {
    var deferred = Q.defer();

    tpb.search(query).then(function(results) {
      results = _.map(results, ReleaseModel);
      deferred.resolve(results);
    }).catch(function(err){
      deferred.reject(err);
    });

    return deferred.promise;
  }
}
