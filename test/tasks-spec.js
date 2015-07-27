var fs = require('fs');                                                                                                                                                                                                                  [0/33]
var expect = require('chai').expect;

describe('tasksSpec', function() {

  var query = 'hannibal s01e02 720p';
  var config = {
    data: {
      adapters: {},
      preferences: {}
    },
    save: () => {}
  };

  var test = (taskResult) => {
    expect(typeof taskResult.then).to.equal('function');
  };

  it('availableTask', function() {
    var lib = require('./../src/available-task');
    test(lib.run(config));
  });

  it('infoTask', function() {
    var lib = require('./../src/info-task');
    test(lib.run(config, query));
  });

  it('searchTask', function() {
    var lib = require('./../src/search-task');
    test(lib.run(config, 'tpb', query));
  });

  it('setupTask', function() {
    var lib = require('./../src/setup-task');
    test(lib.run(config));
  });

  it('subtitlesTask', function() {
    this.timeout(5000);

    var lib = require('./../src/subtitles-task');
    test(lib.run(config, query, 'en'));
  });

  it('timelineTask', function() {
    var lib = require('./../src/timeline-task');
    test(lib.run(config));
  });

})
