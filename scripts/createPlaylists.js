'use strict';

const { name } = require('../package.json');
const { pls, m3u8 } = require('../playlist');
const fs = require('fs');
const path = require('path');
const stations = require('../stations.json');
const [dest] = process.argv.slice(2);

fs.writeFileSync(path.join(dest, `${name}.pls`), pls(stations));
fs.writeFileSync(path.join(dest, `${name}.m3u8`), m3u8(stations));
