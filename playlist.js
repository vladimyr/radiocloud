'use strict';

const escape = title => title.replace(/-/g, '\u2013');
const trimLeft = (strings, ...values) => interweave(strings, ...values).trimLeft();

const plsEntry = (stream, pos = 1) => trimLeft`
File${pos}=${stream.url}
Title${pos}=${stream.name}
Length${pos}=-1`;

module.exports.pls = streams => trimLeft`
[playlist]
NumberOfEntries=${streams.length}

${streams.map((stream, i) => plsEntry(stream, i + 1)).join('\n\n')}
Version=2`;

const m3u8Entry = stream => trimLeft`
#EXTINF:0,${escape(stream.name)}
${stream.url}`;

module.exports.m3u8 = streams => trimLeft`
#EXTM3U
${streams.map(stream => m3u8Entry(stream)).join('\n')}`;

function interweave(strings, ...values) {
  let output = '';
  values.forEach((val, i) => (output += strings[i] + val));
  output += strings[values.length];
  return output;
}
