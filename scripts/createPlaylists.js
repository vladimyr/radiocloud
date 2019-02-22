'use strict';

const { name } = require('../package.json');
const { pls, m3u8, xspf } = require('../playlist');
const fs = require('fs');
const path = require('path');
const CSON = require('season');
const { playlist } = CSON.readFileSync(path.join(__dirname, '../stations.cson'));
const [dest] = process.argv.slice(2);

const jsonify = obj => JSON.stringify(obj, null, 2);

fs.writeFileSync(path.join(dest, `${name}.pls`), pls(playlist.track));
fs.writeFileSync(path.join(dest, `${name}.m3u8`), m3u8(playlist.track));
fs.writeFileSync(path.join(dest, `${name}.xspf`), xspf(playlist.track));
fs.writeFileSync(path.join(dest, `${name}.jspf`), jsonify({ playlist }));
