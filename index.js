'use strict';

import plyr from 'plyr';
import Choices from 'choices.js';
import fade from 'fade';
import stations from './stations.json';

import './style.styl';

const KEY_SPACE = 32;
const KEY_K = 75;

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
    // Install shortcut hook.
    window.addEventListener('keydown', e => {
      if (!$player.isPaused()) return;
      const keyCode = e.keyCode ? e.keyCode : e.which;
      if (keyCode === KEY_K) this.onPlay();
    }, { useCapture: true });
    // Setup player.
    const keyboardShortcuts = { focused: true, global: true };
    const $player = plyr.setup(selector, {
      controls: [ 'play', 'mute', 'volume' ],
      // NOTE: Required due to misspelling:
      //       https://github.com/sampotts/plyr/blob/v2.0.18/src/js/plyr.js#L53
      keyboardShorcuts: keyboardShortcuts,
      keyboardShortcuts
    })[0];
    const $container = $player.getContainer().parentNode;
    // Install action hooks.
    const $controls = $container.querySelector('.plyr__controls');
    const $btnPlay = $controls.querySelector('[data-plyr="play"]');
    $controls && $controls.addEventListener('click', e => {
      const $el = e.target;
      if ($btnPlay.isSameNode($el) || $btnPlay.contains($el)) this.onPlay();
    }, { capture: true });
    $player.on('pause', () => this.onPause());
    // Setup popup button.
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
    window.localStorage.setItem('stationUrl', station.url);
    this.station = station;
  }

  _setSource(streamUrl) {
    streamUrl = streamUrl || '';
    this.player.source({ type: 'audio', sources: [{ src: streamUrl }]});
  }
}(document.body));

App.run(stations);

function params(options = {}) {
  return Object.keys(options)
    .map(key => `${key}=${options[key]}`)
    .join(',');
}
