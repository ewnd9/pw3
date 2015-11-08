var fs = require('fs');                                                                                                                                                                                                                  [0/33]
var expect = require('chai').expect;
var request = require('request-promise');
var moment = require('moment');
var Promise = require('bluebird');
var traktApi = require('./../src/api/trakt');

describe('tasksSpec', function() {


  // it('availableMenu', function(done) {
  //   this.timeout(50000);
  //   traktApi.getAccessToken('9C92F11E').then((response) => {
  //     console.log(response);
  //   });
  // });

  //
  //
  //
  //     var episodes = response.map((episode) => {
  //       episode._date = moment(episode.first_aired);
  //       episode.showTitle = episode.show.title;
  //       episode.numericTitle = formatUtils.formatEpisodeNumeric(episode.episode.season, episode.episode.number);
  //       episode.title = episode.episode.title;
  //       shows[episode.showTitle] = 1;
  //
  //       return episode;
  //     });
  //     // console.log(response);
  //
  //     printUtils.splitByToday(response, {
  //       userCheck: true
  //     });
  //
  //     console.log(shows);
  //
  //     done();
  //   }).catch((err) => {
  //     console.log(err, err.stack);
  //     done();
  //   });
  //
  //   expect(result.choices).to.exist;
  //   expect(result.message).to.exist;
  // });

})
