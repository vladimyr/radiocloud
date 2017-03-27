'use strict';

const plyr = require('plyr');
const Choices = require('choices.js');
const fade = require('fade');
const Caster = require('./caster');
const stations = require('./stations.json');

const caster = new Caster();
let init = false
window.__onGCastApiAvailable = (isAvailable) => {
  if (isAvailable) {
    caster.init();
    init = true;
    console.log('finished initializing the caster');
  }
};

let $app = document.body;
let $player = plyr.setup('.radio-player', {
  controls: [ 'play', 'mute', 'volume' ],
  keyboardShortcuts: { focused: true, global: true }
})[0];

function onCastClick() {
  console.log('cast clicked');
}

const container = $player.getContainer();
const controls = container.children[1];
const muteButton = controls.children[2];
const castButton = document.createElement('button', 'google-cast-button');
castButton.setAttribute('class', 'cast-button');
castButton.addEventListener('click', onCastClick);
controls.insertBefore(castButton, muteButton);

let path = getPath(window.location);
let selectedStation = findStation(stations, path);
selectedStation.selected = true;

let $picker = new Choices('.station-selector', { choices: stations });
setStation($player, $picker.passedElement.value);

fade.in($app);

$picker.passedElement.addEventListener('change', e => {
  setStation($player, e.target.value);
});

$player.on('play', e => {
  if (init) caster.cast(findStationByValue(stations, $picker.passedElement.value));
})

function setStation(player, src) {
  player.source({ type: 'audio', sources: [{ src: src }] });
}

function getPath(location=window.location) {
  return location.pathname.replace(/^\//, '');
}

function findStation(stations, path='') {
  return stations.find(it => {
    if (!it.path) return false;
    return equals(it.path, path);
  }) || stations[0];
}

function findStationByValue(stations, value='') {
  return stations.find(it => {
    if (!it.value) return false;
    return equals(it.value, value);
  }) || stations[0];
}

function equals(str1, str2) {
  return str1.trim().toLowerCase() === str2.trim().toLowerCase();
}
