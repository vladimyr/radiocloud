'use strict';

const plyr = require('plyr');
const Choices = require('choices.js');
const urlJoin = require('url-join');
const stations = require('./stations.json');

let $player = plyr.setup('.radio-player', {
  controls: [ 'play', 'mute', 'volume' ],
  keyboardShortcuts: { focused: true, global: true }
})[0];

let $picker = new Choices('.station-selector', { choices: stations });
setStation($player, $picker.passedElement.value);

$picker.passedElement.addEventListener('change', e => {
  setStation($player, e.target.value);
  $player.stop();
});

function setStation(player, streamUrl) {
  let src = urlJoin(streamUrl, '/;')
  player.source({ type: 'audio', sources: [{ src }] });
}
