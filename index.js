'use strict';

import plyr from 'plyr';
import Choices from 'choices.js';
import fade from 'fade';
import stations from './stations.json';

import './style.styl';

const normalize = str => str.trim().toLowerCase();
const equals = (str1 = '', str2 = '') => normalize(str1) === normalize(str2);
const params = obj => Object.keys(obj).map(key => `${key}=${obj[key]}`).join(',');

let $app = document.body;

let $btnPopup = document.getElementsByClassName('btn-popup')[0];
if ($btnPopup) {
  $btnPopup.addEventListener('click', e => {
    const width = 300;
    const height = 500;
    window.open(window.location.href, document.title, params({ width, height }));
  });
}

let $player = plyr.setup('.radio-player', {
  controls: [ 'play', 'mute', 'volume' ],
  keyboardShortcuts: { focused: true, global: true }
})[0];

let path = getPath(window.location);
let selectedStation = findStation(stations, path);
selectedStation.selected = true;

let $picker = new Choices('.station-selector', { choices: stations });
setStation($player, $picker.passedElement.value);

fade.in($app);

$picker.passedElement.addEventListener('change', e => {
  setStation($player, e.target.value);
  $player.stop();
});

function setStation(player, src) {
  player.source({ type: 'audio', sources: [{ src }] });
}

function getPath(location = window.location) {
  return location.pathname.replace(/^\//, '');
}

function findStation(stations, path='') {
  return stations.find(it => {
    if (!it.path) return false;
    return equals(it.path, path);
  }) || stations[0];
}
