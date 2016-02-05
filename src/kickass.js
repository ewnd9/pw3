const got = require('got');
const prettyBytes = require('pretty-bytes');

export default query => got('https://kat.cr/json.php', {
  query: { q: query },
  json: true,
  timeout: 2000
})
.then(res => res.body.list.map(release => ({
  name: `${release.title} ${prettyBytes(parseInt(release.size))} (${release.leechs} / ${release.seeds})`,
  hash: `magnet:?xt=urn:btih:${release.hash}&dn=${encodeURIComponent(release.title)}&tr=udp%3A%2F%2Ftrackerelease.publicbt.com%3A80%2Fannounce&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce`
})));
