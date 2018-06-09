'use strict';

const {
  ElementTree,
  Element: element,
  SubElement: subElement
} = require('elementtree');

const escape = title => title.replace(/-/g, '\u2013');
const trimLeft = (strings, ...values) => interweave(strings, ...values).trimLeft();

const plsEntry = (stream, pos = 1) => trimLeft`
File${pos}=${stream.location}
Title${pos}=${stream.title}
Length${pos}=-1`;

module.exports.pls = streams => trimLeft`
[playlist]
NumberOfEntries=${streams.length}

${streams.map((stream, i) => plsEntry(stream, i + 1)).join('\n\n')}
Version=2`;

const m3u8Entry = stream => trimLeft`
#EXTINF:0,${escape(stream.title)}
${stream.location}`;

module.exports.m3u8 = streams => trimLeft`
#EXTM3U
${streams.map(stream => m3u8Entry(stream)).join('\n')}`;

const xspfTrack = (trackList, stream) => {
  const track = subElement(trackList, 'track');
  const location = subElement(track, 'location');
  location.text = stream.location;
  const title = subElement(track, 'title');
  title.text = stream.title;
};

module.exports.xspf = streams => {
  const root = element('playlist');
  root.set('xmlns', 'http://xspf.org/ns/0/');
  root.set('version', 1);
  const trackList = subElement(root, 'trackList');
  streams.forEach(stream => xspfTrack(trackList, stream));
  return (new ElementTree(root)).write({ indent: 2 });
};

function interweave(strings, ...values) {
  let output = '';
  values.forEach((val, i) => (output += strings[i] + val));
  output += strings[values.length];
  return output;
}
