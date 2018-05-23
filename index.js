'use strict';

import Plyr from 'plyr';
import Choices from 'choices.js';
import fade from 'fade';
import stations from './stations.json';

import './style.styl';

// const KEY_SPACE = 32;
const KEY_K = 75;

class Player extends Plyr {
  constructor(...args) {
    super(...args);
    this._hooks = [];
  }

  play() {
    this._hooks.play && this._hooks.play();
    super.play();
  }

  hook(action, fn) {
    this._hooks[action] = fn;
  }
}

const App = (new class {
  constructor(el) {
    this.el = el;
  }

  run(stations) {
    this.plyr = this.setupPlayer('.radio-player');
    this.playing = false;

    const stationUrl = this.plyr.storage.get('stationUrl');
    const byStationUrl = it => it.url === stationUrl;
    const selectedStation = stations.filter(byStationUrl)[0] || stations[0];
    this.setStation(selectedStation);
    this.stationPicker = this.setupStationPicker('.station-picker', stations);

    fade.in(this.el);
  }

  setupPlayer(selector) {
    // Install shortcut hook.
    window.addEventListener('keydown', e => {
      if (!plyr.paused) return;
      const keyCode = e.keyCode ? e.keyCode : e.which;
      if (keyCode === KEY_K) this.onPlay();
    }, { useCapture: true });
    // Setup player.
    const plyr = new Player(selector, {
      controls: [ 'play', 'mute', 'volume' ],
      keyboard: { focused: true, global: true }
    });
    // Install action hooks.
    plyr.hook('play', () => this.onPlay());
    plyr.on('pause', () => this.onPause());
    // Setup popup button.
    const { container } = plyr.elements;
    const btnPopup = container.parentNode.querySelector('.btn-popup');
    btnPopup && btnPopup.addEventListener('click', () => this.openPopup());
    return plyr;
  }

  setupStationPicker(selector, stations = []) {
    const choices = stations.map(it => ({
      label: it.name,
      value: it.url,
      selected: it === this.station,
      customProperties: { station: it }
    }));
    const picker = new Choices(selector, { choices });
    picker.passedElement.addEventListener('change', () => {
      const { station } = picker.getValue().customProperties;
      this.setStation(station);

      if (this.plyr.playing) this.plyr.play();
      else this.plyr.stop();
    });
  }

  onPlay() {
    this._setSource(this.station.url);
  }

  onPause() {
    this._setSource(null);
  }

  openPopup(width = 300, height = 500) {
    const url = window.location.href;
    window.open(url, document.title, params({ width, height }));
  }

  setStation(station) {
    document.title = `${station.name} - Radiocloud`;
    this.plyr.storage.set({ stationUrl: station.url });
    this.station = station;
  }

  _setSource(streamUrl) {
    streamUrl = streamUrl || '';
    this.plyr.source = { type: 'audio', sources: [{ src: streamUrl }] };
  }
}(document.body));

App.run(stations);

function params(options = {}) {
  return Object.keys(options)
    .map(key => `${key}=${options[key]}`)
    .join(',');
}
