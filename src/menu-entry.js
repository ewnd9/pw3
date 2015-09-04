var menu = require('inquirer-menu');
var inquirer = require('inquirer-question');
var _ = require('lodash');
var Promise = require('bluebird');

var components = require('./components');

module.exports = () => {
  var mainMenu = {
    message: 'pw3',
    choices: {}
  };

  _.each(components, (params, key) => {
    mainMenu.choices[key] = () => {
      var promise = Promise.resolve(true);
      var args = [];

      if (params.args) {

        _.each(params.args, (arg) => {
          promise = promise.then(() => {

            return inquirer.prompt({
              type: 'input',
              name: 'x',
              message: arg,
            }).then(result => args.push(result.x));

          });
        });

      }

      return promise.then(() => {
        var fn = require(params.path);
        return fn.apply(this, args);
      });
    };
  });

  menu(mainMenu);
};
