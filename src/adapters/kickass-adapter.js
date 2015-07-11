var Q = require('q');
var Kickass = require('node-kickass');

var bytesToSize = function(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return 'n/a';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  if (i == 0) return bytes + ' ' + sizes[i];
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

var ReleaseModel = function(release) {
  return {
    name: release['title'],
    magnet: release['torrent:magneturi']['#'],
    seeders: release['torrent:seeds']['#'],
    leechers: release['torrent:peers']['#'],
    size: bytesToSize(parseInt(release['torrent:contentlength']['#']))
  }
};

module.exports = {
  query: function(query) {
    var deferred = Q.defer();
    var k = new Kickass().setQuery(query)
                         .setPage(0)
                         .run(function(errors, data) {
      if (errors.length > 0) {
        deferred.reject(errors);
      } else {
        deferred.resolve(data.map(ReleaseModel));
      }
    });

    return deferred.promise;
  }
};
