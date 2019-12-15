'use strict';

const CSON = require('cson-parser');
const path = require('path');
const pMap = require('p-map');
const readFile = require('util').promisify(require('fs').readFile);
const streamInfo = require('./scripts/streamInfo');

module.exports = async function () {
  const cson = await readFile(path.join(__dirname, './stations.cson'));
  const stations = CSON.parse(cson);
  return pMap(stations.playlist.track, async station => {
    try {
      const stream = await getStreamInfo(station);
      if (!stream) return station;
      return Object.assign({}, station, { stream });
    } catch (err) {
      return station;
    }
  });
};

async function getStreamInfo(station) {
  const { streams } = await streamInfo(station.location);
  const info = streams && streams[0];
  if (!info) return;
  return {
    codec: info.codec_name,
    profile: info.profile,
    bitrate: parseFloat(info.bit_rate),
    sampleRate: parseFloat(info.sample_rate)
  };
}
