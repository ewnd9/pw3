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

  it('availableMenu', function() {
    var lib = require('./../src/menu/available-menu');
    var result = lib();
    expect(result.choices).to.exist;
    expect(result.message).to.exist;
  });

  it('infoTask', function() {
    var lib = require('./../src/menu/info-menu');
    test(lib(query));
  });

  it('progressTask', function() {
    var lib = require('./../src/menu/progress-menu');
    test(lib());
  });

  it('searchTask', function() {
    var lib = require('./../src/helpers/search-task');
    test(lib(query));
  });

  it('setupTask', function() {
    var lib = require('./../src/prompts/setup-prompt');
    test(lib());
  });

  it('subtitlesTask', function() {
    this.timeout(5000);

    var lib = require('./../src/helpers/subtitles-task');
    test(lib(query, 'en'));
  });

  it('timelineTask', function() {
    var lib = require('./../src/helpers/timeline-task');
    test(lib());
  });

})
