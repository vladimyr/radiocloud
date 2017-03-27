class Caster {
  constructor() {
    this.remotePlayer = null;
    this.remotePlayerController = null;

    this.onConnectedChanged = this.maybeStartCast.bind(this);
  }

  init() {
    cast.framework.CastContext.getInstance().setOptions({
      receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    });

    this.remotePlayer = new cast.framework.RemotePlayer();
    this.remotePlayerController = new cast.framework.RemotePlayerController(this.remotePlayer);
    this.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED, this.onConnectedChanged);
  }

  maybeStartCast() {
    if (this.remotePlayer.isConnected) {
      console.log('cast connected');
    } else {
      console.log('cast disconnected');
    }
  }

  cast(source) {
    const castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    const mediaInfo = new chrome.cast.media.MediaInfo(source.value, 'audio/ogg');
    mediaInfo.streamType = chrome.cast.media.StreamType.LIVE;
    mediaInfo.duration = null;
    mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
    mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
    mediaInfo.metadata.title = source.label;
    mediaInfo.metadata.images = source.images;
    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    castSession.loadMedia(request)
        .then(() => console.log('success'))
        .catch((errorCode) => console.log('error', errorCode));
  }
}

module.exports = Caster
