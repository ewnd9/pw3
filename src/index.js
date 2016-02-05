const meow = require('meow');
const inquirer = require('inquirer-bluebird');
const kickass = require('./kickass');
const interactive = require('./promise-interactive');

const cli = meow({
  help: `
    Usage

    # search torrents
    pw3 lost s01e01 720p

    # range query
    pw3 daredevil s01e01-05 720p
  `,
  pkg: '../package.json'
});

let query = [cli.input.join(' ')];

try {
  query = JSON.parse(query[0]);
} catch (e) {
}

console.log('\n', query.join('\n'), '\n');

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));
const callApi = (query, index) => delay(index * 200).then(() => kickass(query.replace(/\W/, '')).then(data => ({ data, query })));

interactive(query.map(callApi), fn).catch(err => console.log(err));

function fn({ data, query }) {
  return inquirer.prompt({
    type: 'list',
    name: 'uri',
    message: query,
    pageSize: 10,
    choices: data.map(_ => ({ name: _.name, value: _.hash }))
  })
  .then(({ uri }) => {
    console.log(uri);
    require('copy-paste').copy(uri);
  });
}
