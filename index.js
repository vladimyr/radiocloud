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
    this.playing = false;

    const stationUrl = window.localStorage.getItem('stationUrl');
    const byStationUrl = it => it.url === stationUrl;
    const selectedStation = stations.filter(byStationUrl)[0] || stations[0];
    this.setStation(selectedStation);
    this.stationPicker = this.setupStationPicker('.station-picker', stations);

    fade.in(this.el);
  }

  setupPlayer(selector) {
    const keyboardShortcuts = { focused: true, global: true };
    const $player = plyr.setup(selector, {
      controls: [ 'play', 'mute', 'volume' ],
      // NOTE: Required due to misspelling:
      //       https://github.com/sampotts/plyr/blob/v2.0.18/src/js/plyr.js#L53
      keyboardShorcuts: keyboardShortcuts,
      keyboardShortcuts
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
      selected: it === this.station,
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
    window.localStorage.setItem('stationUrl', station.url);
    this.station = station;
  }
}(document.body));

App.run(stations);

function params(options = {}) {
  return Object.keys(options)
    .map(key => `${key}=${options[key]}`)
    .join(',');
}
