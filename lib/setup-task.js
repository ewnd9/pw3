var config = require('dot-file-config')('.pw3-npm', __dirname + '/default-config.json');
var inquirer = require('inquirer');
var _ = require('lodash');

var allAdapters = ['kickass', 'tpb'];
var adapters = config.data.adapters || [];

module.exports = function() {
  inquirer.prompt([
    {
      type: "checkbox",
      message: "Select adapters",
      name: "adapters",
      choices: [
        {
          name: "Cheese",
          checked: true
        },
      ],
      choices: _.map(allAdapters, function(adapter) {
        return {
          name: adapter,
          checked: _.indexOf(adapters, adapter) !== -1
        }
      })
    }
  ], function(answers) {
    config.data.adapters = answers.adapters;
    config.save();
  });
};
