'use strict';

import plyr from 'plyr';
import Choices from 'choices.js';
import fade from 'fade';
import stations from './stations.json';

import './style.styl';

const App = (new class {
  constructor(el) {
    this.el = el;
  }

  run(stations) {
    this.player = this.setupPlayer('.radio-player');
    this.stationPicker = this.setupStationPicker('.station-picker', stations);

    this.playing = false;
    this.station = this.setStation(stations[0]);

    fade.in(this.el);
  }

  setupPlayer(selector) {
    const $player = plyr.setup(selector, {
      controls: [ 'play', 'mute', 'volume' ],
      keyboardShortcuts: { focused: true, global: true }
    })[0];
    const $container = $player.getContainer().parentNode;
    const $btnPopup = $container.querySelector('.btn-popup');
    $btnPopup && $btnPopup.addEventListener('click', () => this.openPopup());
    return $player;
  }

  setupStationPicker(selector, stations = []) {
    const choices = stations.map(it => ({
      label: it.name,
      value: it.url,
      customProperties: { station: it }
    }));
    const $picker = new Choices(selector, { choices });
    $picker.passedElement.addEventListener('change', () => {
      const { station } = $picker.getValue().customProperties;
      this.setStation(station);
      this.player.stop();
    });
  }

  openPopup(width = 300, height = 500) {
    const url = window.location.href;
    window.open(url, document.title, params({ width, height }));
  }

  setStation(station) {
    this.player.source({ type: 'audio', sources: [{ src: station.url }]});
    document.title = `${station.name} - Radiocloud`;
    this.station = station;
  }
}(document.body));

App.run(stations);

function params(options = {}) {
  return Object.keys(options)
    .map(key => `${key}=${options[key]}`)
    .join(',');
}
