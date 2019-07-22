import { EventEmitter } from 'events';
import pkg from './package.json';

const DEFAULT_IMAGE_URL = require('./static/images/ee_logo_large.png');

const {
  CastContext,
  RemotePlayer,
  RemotePlayerController,
  RemotePlayerEventType
} = cast.framework;

const {
  DEFAULT_MEDIA_RECEIVER_APP_ID,
  GenericMediaMetadata,
  LoadRequest,
  MediaInfo,
  StreamType
} = chrome.cast.media;

const { AutoJoinPolicy, Image } = chrome.cast;

export default class Caster extends EventEmitter {
  constructor() {
    super();
    this.remotePlayer = null;
    this.remotePlayerController = null;
    this.mediaSource = null;
    this.initInterval = null;
    this.isPlaying = false;
  }

  get castContext() {
    return CastContext.getInstance();
  }

  get isConnected() {
    return this.remotePlayer && this.remotePlayer.isConnected;
  }

  init(options = {}) {
    // TODO: Replace with receiver application ID when created in the Google Cast Developer Console
    options.receiverApplicationId = DEFAULT_MEDIA_RECEIVER_APP_ID;
    // Auto join policy can be one of the following three:
    // ORIGIN_SCOPED - Auto connect from same appId and page origin
    // TAB_AND_ORIGIN_SCOPED - Auto connect from same appId, page origin, and tab
    // PAGE_SCOPED - No auto connect
    options.autoJoinPolicy = AutoJoinPolicy.ORIGIN_SCOPED;

    this.castContext.setOptions(options);

    this.remotePlayer = new RemotePlayer();
    this.remotePlayerController = new RemotePlayerController(this.remotePlayer);
    this.remotePlayerController.addEventListener(
      RemotePlayerEventType.IS_CONNECTED_CHANGED,
      ({ value: isConnected }) => {
        isConnected ? this.emit('cast:start') : this.emit('cast:stop');
      }
    );
    this.remotePlayerController.addEventListener(
      RemotePlayerEventType.IS_PAUSED_CHANGED,
      isPaused => (this.isPlaying = !isPaused)
    );

    return this;
  }

  play() {
    const mediaInfo = new MediaInfo(this.mediaSource.location, 'audio/*');
    const metadata = Object.assign(new GenericMediaMetadata(), {
      title: this.mediaSource.title,
      subtitle: `⚡️ powered by ${pkg.name}`,
      images: getImages(this.mediaSource)
    });
    Object.assign(mediaInfo, {
      streamType: StreamType.LIVE,
      metadata
    });
    this.castContext.getCurrentSession()
      .loadMedia(new LoadRequest(mediaInfo))
      .then(() => (this.isPlaying = true))
      .catch(errorCode => console.error('error', errorCode));
  }

  setMediaSource(mediaSource) {
    this.mediaSource = mediaSource;
  }
}

function getImages(mediaSource) {
  let { images } = mediaSource;
  if (!Array.isArray(images) || !images.length) {
    const imageUrl = new URL(window.location);
    imageUrl.pathname = DEFAULT_IMAGE_URL;
    images = [imageUrl.href];
  }
  return images.map(it => new Image(it));
}
