var imdb = require('./../api/imdb');
var inquirer = require('inquirer-bluebird');

var _ = require('lodash');

var selectMediaPrompt = require('./../prompts/select-media');

module.exports.run = (query) => {
  var message = `Select title for ${query}`;
  return imdb.search(query).then((data) => selectMediaPrompt(data, message));
};
