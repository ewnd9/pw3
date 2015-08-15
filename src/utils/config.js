var config = require('dot-file-config')('.pw3-npm');

config.data.wantList = config.data.wantList || {};

module.exports = config;
