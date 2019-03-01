export default class Caster {
  constructor(localPlayer) {
    this.localPlayer = localPlayer;
    this.remotePlayer = null;
    this.remotePlayerController = null;
    this.mediaSource = null;
    this.initInterval = null;
    this.isPlaying = false;

    this.onConnectedChanged = this.switchPlayer.bind(this);
    this.onPausedChanged = this.togglePause.bind(this);
  }

  init() {
    // This horrible hack is required because it's possible for `cast` variable to be uninitialized
    // at this point, even though chromecast API says it should be.
    if (!this.initInterval) {
      this.initInterval = setInterval(this.init.bind(this), 1000);
    }
    if (typeof chrome === 'undefined' || typeof cast === 'undefined') {
      return;
    } else {
      clearInterval(this.initInterval);
      this.initInterval = null;
    }

    const options = {};

    // TODO: Replace with receiver application ID when created in the Google Cast Developer Console
    options.receiverApplicationId = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
    // Auto join policy can be one of the following three:
    // ORIGIN_SCOPED - Auto connect from same appId and page origin
    // TAB_AND_ORIGIN_SCOPED - Auto connect from same appId, page origin, and tab
    // PAGE_SCOPED - No auto connect
    options.autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;

    cast.framework.CastContext.getInstance().setOptions(options);

    this.remotePlayer = new cast.framework.RemotePlayer();
    this.remotePlayerController = new cast.framework.RemotePlayerController(this.remotePlayer);
    this.remotePlayerController.addEventListener(
      cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
      this.onConnectedChanged
    );
    this.remotePlayerController.addEventListener(
      cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED,
      this.onPausedChanged
    );
  }

  switchPlayer() {
    if (cast && cast.framework && this.remotePlayer.isConnected) {
      this.localPlayer.pause();
      this.play();
    } else {
      this.localPlayer.play();
    }
  }

  togglePause(isPaused) {
    this.isPlaying = !isPaused.value;
  }

  play() {
    const castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    const mediaInfo = new chrome.cast.media.MediaInfo(this.mediaSource.location, 'audio/ogg');
    mediaInfo.streamType = chrome.cast.media.StreamType.LIVE;
    mediaInfo.duration = null;
    mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
    mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
    mediaInfo.metadata.title = this.mediaSource.title;
    mediaInfo.metadata.images = this._formatImages(this.mediaSource.images);
    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    castSession.loadMedia(request)
      .then(() => (this.isPlaying = true))
      .catch((errorCode) => console.log('error', errorCode));
  }

  setMediaSource(mediaSource) {
    this.mediaSource = mediaSource;
  }

  _formatImages(images) {
    if (!Array.isArray(images) || images.length < 1) {
      const defaultImage = '/images/ee_logo_large.png';

      return [new chrome.cast.Image(defaultImage)];
    }

    return images.map((image) => new chrome.cast.Image(image.url));
  }
}
