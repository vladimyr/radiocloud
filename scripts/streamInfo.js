'use strict';

const avprobe = require('util').promisify(require('avprobemeta'));
const argv = require('minimist')(process.argv.slice(2));

if (require.main) {
  const [streamUrl] = argv._;
  avprobe(streamUrl)
    .then(data => console.log(data))
    .catch(err => console.error('Error:', err.message));
}

module.exports = avprobe;
