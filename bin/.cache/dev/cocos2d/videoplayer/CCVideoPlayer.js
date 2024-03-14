
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/videoplayer/CCVideoPlayer.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var VideoPlayerImpl = require('./video-player-impl');
/**
 * !#en Video event type
 * !#zh 视频事件类型
 * @enum VideoPlayer.EventType
 */

/**
 * !#en play
 * !#zh 播放
 * @property {Number} PLAYING
 */

/**
 * !#en pause
 * !#zh 暂停
 * @property {Number} PAUSED
 */

/**
 * !#en stop
 * !#zh 停止
 * @property {Number} STOPPED
 */

/**
 * !#en play end
 * !#zh 播放结束
 * @property {Number} COMPLETED
 */

/**
 * !#en meta data is loaded
 * !#zh 视频的元信息已加载完成，你可以调用 getDuration 来获取视频总时长
 * @property {Number} META_LOADED
 */

/**
 * !#en clicked by the user
 * !#zh 视频被用户点击了
 * @property {Number} CLICKED
 */

/**
 * !#en ready to play, this event is not guaranteed to be triggered on all platform or browser, please don't rely on it to play your video.<br/>
 * !#zh 视频准备好了，这个事件并不保障会在所有平台或浏览器中被触发，它依赖于平台实现，请不要依赖于这个事件做视频播放的控制。
 * @property {Number} READY_TO_PLAY
 */


var EventType = VideoPlayerImpl.EventType;
/**
 * !#en Enum for video resouce type type.
 * !#zh 视频来源
 * @enum VideoPlayer.ResourceType
 */

var ResourceType = cc.Enum({
  /**
   * !#en The remote resource type.
   * !#zh 远程视频
   * @property {Number} REMOTE
   */
  REMOTE: 0,

  /**
   * !#en The local resouce type.
   * !#zh 本地视频
   * @property {Number} LOCAL
   */
  LOCAL: 1
});
/**
 * !#en cc.VideoPlayer is a component for playing videos, you can use it for showing videos in your game. Because different platforms have different authorization, API and control methods for VideoPlayer component. And have not yet formed a unified standard, only Web, iOS, and Android platforms are currently supported.
 * !#zh Video 组件，用于在游戏中播放视频。由于不同平台对于 VideoPlayer 组件的授权、API、控制方式都不同，还没有形成统一的标准，所以目前只支持 Web、iOS 和 Android 平台。
 * @class VideoPlayer
 * @extends Component
 */

var VideoPlayer = cc.Class({
  name: 'cc.VideoPlayer',
  "extends": cc.Component,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.ui/VideoPlayer',
    inspector: 'packages://inspector/inspectors/comps/videoplayer.js',
    help: 'i18n:COMPONENT.help_url.videoplayer',
    executeInEditMode: true
  },
  properties: {
    _resourceType: ResourceType.REMOTE,

    /**
     * !#en The resource type of videoplayer, REMOTE for remote url and LOCAL for local file path.
     * !#zh 视频来源：REMOTE 表示远程视频 URL，LOCAL 表示本地视频地址。
     * @property {VideoPlayer.ResourceType} resourceType
     */
    resourceType: {
      tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.resourceType',
      type: ResourceType,
      set: function set(value) {
        this._resourceType = value;

        this._updateVideoSource();
      },
      get: function get() {
        return this._resourceType;
      }
    },
    _remoteURL: '',

    /**
     * !#en The remote URL of video.
     * !#zh 远程视频的 URL
     * @property {String} remoteURL
     */
    remoteURL: {
      tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.url',
      type: cc.String,
      set: function set(url) {
        this._remoteURL = url;

        this._updateVideoSource();
      },
      get: function get() {
        return this._remoteURL;
      }
    },
    _clip: {
      "default": null,
      type: cc.Asset
    },

    /**
     * !#en The local video full path.
     * !#zh 本地视频的 URL
     * @property {String} clip
     */
    clip: {
      tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.video',
      get: function get() {
        return this._clip;
      },
      set: function set(value) {
        this._clip = value;

        this._updateVideoSource();
      },
      type: cc.Asset
    },

    /**
     * !#en The current playback time of the now playing item in seconds, you could also change the start playback time.
     * !#zh 指定视频从什么时间点开始播放，单位是秒，也可以用来获取当前视频播放的时间进度。
     * @property {Number} currentTime
     */
    currentTime: {
      tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.currentTime',
      type: cc.Float,
      set: function set(time) {
        if (this._impl) {
          this._impl.seekTo(time);
        }
      },
      get: function get() {
        if (this._impl) {
          // for used to make the current time of each platform consistent
          if (this._currentStatus === EventType.NONE || this._currentStatus === EventType.STOPPED || this._currentStatus === EventType.META_LOADED || this._currentStatus === EventType.READY_TO_PLAY) {
            return 0;
          } else if (this._currentStatus === EventType.COMPLETED) {
            return this._impl.duration();
          }

          return this._impl.currentTime();
        }

        return -1;
      }
    },
    _volume: 1,

    /**
     * !#en The volume of the video.
     * !#zh 视频的音量（0.0 ~ 1.0）
     * @property volume
     * @type {Number}
     * @default 1
     */
    volume: {
      get: function get() {
        return this._volume;
      },
      set: function set(value) {
        this._volume = value;

        if (this.isPlaying() && !this._mute) {
          this._syncVolume();
        }
      },
      range: [0, 1],
      type: cc.Float,
      tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.volume'
    },
    _mute: false,

    /**
     * !#en Mutes the VideoPlayer. Mute sets the volume=0, Un-Mute restore the original volume.
     * !#zh 是否静音视频。静音时设置音量为 0，取消静音是恢复原来的音量。
     * @property mute
     * @type {Boolean}
     * @default false
     */
    mute: {
      get: function get() {
        return this._mute;
      },
      set: function set(value) {
        this._mute = value;

        this._syncVolume();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.mute'
    },

    /**
     * !#en Whether keep the aspect ration of the original video.
     * !#zh 是否保持视频原来的宽高比
     * @property {Boolean} keepAspectRatio
     * @type {Boolean}
     * @default true
     */
    keepAspectRatio: {
      tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.keepAspectRatio',
      "default": true,
      type: cc.Boolean,
      notify: function notify() {
        this._impl && this._impl.setKeepAspectRatioEnabled(this.keepAspectRatio);
      }
    },

    /**
     * !#en Whether play video in fullscreen mode.
     * !#zh 是否全屏播放视频
     * @property {Boolean} isFullscreen
     * @type {Boolean}
     * @default false
     */
    _isFullscreen: {
      "default": false,
      formerlySerializedAs: '_N$isFullscreen'
    },
    isFullscreen: {
      get: function get() {
        if (!CC_EDITOR) {
          this._isFullscreen = this._impl && this._impl.isFullScreenEnabled();
        }

        return this._isFullscreen;
      },
      set: function set(enable) {
        this._isFullscreen = enable;

        if (!CC_EDITOR) {
          this._impl && this._impl.setFullScreenEnabled(enable);
        }
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.isFullscreen'
    },

    /**
     * !#en Always below the game view (only useful on Web. Note: The specific effects are not guaranteed to be consistent, depending on whether each browser supports or restricts).
     * !#zh 永远在游戏视图最底层（这个属性只有在 Web 平台上有效果。注意：具体效果无法保证一致，跟各个浏览器是否支持与限制有关）
     * @property {Boolean} stayOnBottom
     */
    _stayOnBottom: false,
    stayOnBottom: {
      get: function get() {
        return this._stayOnBottom;
      },
      set: function set(enable) {
        this._stayOnBottom = enable;

        if (this._impl) {
          this._impl.setStayOnBottom(enable);
        }
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.stayOnBottom'
    },

    /**
     * !#en the video player's callback, it will be triggered when certain event occurs, like: playing, paused, stopped and completed.
     * !#zh 视频播放回调函数，该回调函数会在特定情况被触发，比如播放中，暂时，停止和完成播放。
     * @property {Component.EventHandler[]} videoPlayerEvent
     */
    videoPlayerEvent: {
      "default": [],
      type: cc.Component.EventHandler
    }
  },
  statics: {
    EventType: EventType,
    ResourceType: ResourceType,
    Impl: VideoPlayerImpl
  },
  ctor: function ctor() {
    this._impl = new VideoPlayerImpl();
    this._currentStatus = EventType.NONE;
  },
  _syncVolume: function _syncVolume() {
    var impl = this._impl;

    if (impl) {
      var volume = this._mute ? 0 : this._volume;
      impl.setVolume(volume);
    }
  },
  _updateVideoSource: function _updateVideoSource() {
    var url = '';

    if (this.resourceType === ResourceType.REMOTE) {
      url = this.remoteURL;
    } else if (this._clip) {
      url = this._clip.nativeUrl;
    }

    this._impl.setURL(url, this._mute || this._volume === 0);

    this._impl.setKeepAspectRatioEnabled(this.keepAspectRatio);
  },
  onLoad: function onLoad() {
    var impl = this._impl;

    if (impl) {
      impl.createDomElementIfNeeded(this._mute || this._volume === 0);
      impl.setStayOnBottom(this._stayOnBottom);

      this._updateVideoSource();

      if (!CC_EDITOR) {
        impl.seekTo(this.currentTime);
        impl.setFullScreenEnabled(this._isFullscreen);
        this.pause();
        impl.setEventListener(EventType.PLAYING, this.onPlaying.bind(this));
        impl.setEventListener(EventType.PAUSED, this.onPasued.bind(this));
        impl.setEventListener(EventType.STOPPED, this.onStopped.bind(this));
        impl.setEventListener(EventType.COMPLETED, this.onCompleted.bind(this));
        impl.setEventListener(EventType.META_LOADED, this.onMetaLoaded.bind(this));
        impl.setEventListener(EventType.CLICKED, this.onClicked.bind(this));
        impl.setEventListener(EventType.READY_TO_PLAY, this.onReadyToPlay.bind(this));
      }
    }
  },
  onRestore: function onRestore() {
    if (!this._impl) {
      this._impl = new VideoPlayerImpl();
    }
  },
  onEnable: function onEnable() {
    if (this._impl) {
      this._impl.enable();
    }
  },
  onDisable: function onDisable() {
    if (this._impl) {
      this._impl.disable();
    }
  },
  onDestroy: function onDestroy() {
    if (this._impl) {
      this._impl.destroy();

      this._impl = null;
    }
  },
  update: function update(dt) {
    if (this._impl) {
      this._impl.updateMatrix(this.node);
    }
  },
  onReadyToPlay: function onReadyToPlay() {
    this._currentStatus = EventType.READY_TO_PLAY;
    cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.READY_TO_PLAY);
    this.node.emit('ready-to-play', this);
  },
  onMetaLoaded: function onMetaLoaded() {
    this._currentStatus = EventType.META_LOADED;
    cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.META_LOADED);
    this.node.emit('meta-loaded', this);
  },
  onClicked: function onClicked() {
    this._currentStatus = EventType.CLICKED;
    cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.CLICKED);
    this.node.emit('clicked', this);
  },
  onPlaying: function onPlaying() {
    this._currentStatus = EventType.PLAYING;
    cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.PLAYING);
    this.node.emit('playing', this);
  },
  onPasued: function onPasued() {
    this._currentStatus = EventType.PAUSED;
    cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.PAUSED);
    this.node.emit('paused', this);
  },
  onStopped: function onStopped() {
    this._currentStatus = EventType.STOPPED;
    cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.STOPPED);
    this.node.emit('stopped', this);
  },
  onCompleted: function onCompleted() {
    this._currentStatus = EventType.COMPLETED;
    cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.COMPLETED);
    this.node.emit('completed', this);
  },

  /**
   * !#en If a video is paused, call this method could resume playing. If a video is stopped, call this method to play from scratch.
   * !#zh 如果视频被暂停播放了，调用这个接口可以继续播放。如果视频被停止播放了，调用这个接口可以从头开始播放。
   * @method play
   */
  play: function play() {
    if (this._impl) {
      this._syncVolume();

      this._impl.play();
    }
  },

  /**
   * !#en If a video is paused, call this method to resume playing.
   * !#zh 如果一个视频播放被暂停播放了，调用这个接口可以继续播放。
   * @method resume
   */
  resume: function resume() {
    if (this._impl) {
      this._syncVolume();

      this._impl.resume();
    }
  },

  /**
   * !#en If a video is playing, call this method to pause playing.
   * !#zh 如果一个视频正在播放，调用这个接口可以暂停播放。
   * @method pause
   */
  pause: function pause() {
    if (this._impl) {
      this._impl.pause();
    }
  },

  /**
   * !#en If a video is playing, call this method to stop playing immediately.
   * !#zh 如果一个视频正在播放，调用这个接口可以立马停止播放。
   * @method stop
   */
  stop: function stop() {
    if (this._impl) {
      this._impl.stop();
    }
  },

  /**
   * !#en Gets the duration of the video
   * !#zh 获取视频文件的播放总时长
   * @method getDuration
   * @returns {Number}
   */
  getDuration: function getDuration() {
    if (this._impl) {
      return this._impl.duration();
    }

    return -1;
  },

  /**
   * !#en Determine whether video is playing or not.
   * !#zh 判断当前视频是否处于播放状态
   * @method isPlaying
   * @returns {Boolean}
   */
  isPlaying: function isPlaying() {
    if (this._impl) {
      return this._impl.isPlaying();
    }

    return false;
  }
  /**
   * !#en if you don't need the VideoPlayer and it isn't in any running Scene, you should
   * call the destroy method on this component or the associated node explicitly.
   * Otherwise, the created DOM element won't be removed from web page.
   * !#zh
   * 如果你不再使用 VideoPlayer，并且组件未添加到场景中，那么你必须手动对组件或所在节点调用 destroy。
   * 这样才能移除网页上的 DOM 节点，避免 Web 平台内存泄露。
   * @example
   * videoplayer.node.parent = null;  // or  videoplayer.node.removeFromParent(false);
   * // when you don't need videoplayer anymore
   * videoplayer.node.destroy();
   * @method destroy
   * @return {Boolean} whether it is the first time the destroy being called
   */

});
cc.VideoPlayer = module.exports = VideoPlayer;
/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event ready-to-play
 * @param {Event.EventCustom} event
 * @param {VideoPlayer} videoPlayer - The VideoPlayer component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event meta-loaded
 * @param {Event.EventCustom} event
 * @param {VideoPlayer} videoPlayer - The VideoPlayer component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event clicked
 * @param {Event.EventCustom} event
 * @param {VideoPlayer} videoPlayer - The VideoPlayer component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event playing
 * @param {Event.EventCustom} event
 * @param {VideoPlayer} videoPlayer - The VideoPlayer component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event paused
 * @param {Event.EventCustom} event
 * @param {VideoPlayer} videoPlayer - The VideoPlayer component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event stopped
 * @param {Event.EventCustom} event
 * @param {VideoPlayer} videoPlayer - The VideoPlayer component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event completed
 * @param {Event.EventCustom} event
 * @param {VideoPlayer} videoPlayer - The VideoPlayer component.
 */
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_engine__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC92aWRlb3BsYXllci9DQ1ZpZGVvUGxheWVyLmpzIl0sIm5hbWVzIjpbIlZpZGVvUGxheWVySW1wbCIsInJlcXVpcmUiLCJFdmVudFR5cGUiLCJSZXNvdXJjZVR5cGUiLCJjYyIsIkVudW0iLCJSRU1PVEUiLCJMT0NBTCIsIlZpZGVvUGxheWVyIiwiQ2xhc3MiLCJuYW1lIiwiQ29tcG9uZW50IiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwibWVudSIsImluc3BlY3RvciIsImhlbHAiLCJleGVjdXRlSW5FZGl0TW9kZSIsInByb3BlcnRpZXMiLCJfcmVzb3VyY2VUeXBlIiwicmVzb3VyY2VUeXBlIiwidG9vbHRpcCIsIkNDX0RFViIsInR5cGUiLCJzZXQiLCJ2YWx1ZSIsIl91cGRhdGVWaWRlb1NvdXJjZSIsImdldCIsIl9yZW1vdGVVUkwiLCJyZW1vdGVVUkwiLCJTdHJpbmciLCJ1cmwiLCJfY2xpcCIsIkFzc2V0IiwiY2xpcCIsImN1cnJlbnRUaW1lIiwiRmxvYXQiLCJ0aW1lIiwiX2ltcGwiLCJzZWVrVG8iLCJfY3VycmVudFN0YXR1cyIsIk5PTkUiLCJTVE9QUEVEIiwiTUVUQV9MT0FERUQiLCJSRUFEWV9UT19QTEFZIiwiQ09NUExFVEVEIiwiZHVyYXRpb24iLCJfdm9sdW1lIiwidm9sdW1lIiwiaXNQbGF5aW5nIiwiX211dGUiLCJfc3luY1ZvbHVtZSIsInJhbmdlIiwibXV0ZSIsImtlZXBBc3BlY3RSYXRpbyIsIkJvb2xlYW4iLCJub3RpZnkiLCJzZXRLZWVwQXNwZWN0UmF0aW9FbmFibGVkIiwiX2lzRnVsbHNjcmVlbiIsImZvcm1lcmx5U2VyaWFsaXplZEFzIiwiaXNGdWxsc2NyZWVuIiwiaXNGdWxsU2NyZWVuRW5hYmxlZCIsImVuYWJsZSIsInNldEZ1bGxTY3JlZW5FbmFibGVkIiwiYW5pbWF0YWJsZSIsIl9zdGF5T25Cb3R0b20iLCJzdGF5T25Cb3R0b20iLCJzZXRTdGF5T25Cb3R0b20iLCJ2aWRlb1BsYXllckV2ZW50IiwiRXZlbnRIYW5kbGVyIiwic3RhdGljcyIsIkltcGwiLCJjdG9yIiwiaW1wbCIsInNldFZvbHVtZSIsIm5hdGl2ZVVybCIsInNldFVSTCIsIm9uTG9hZCIsImNyZWF0ZURvbUVsZW1lbnRJZk5lZWRlZCIsInBhdXNlIiwic2V0RXZlbnRMaXN0ZW5lciIsIlBMQVlJTkciLCJvblBsYXlpbmciLCJiaW5kIiwiUEFVU0VEIiwib25QYXN1ZWQiLCJvblN0b3BwZWQiLCJvbkNvbXBsZXRlZCIsIm9uTWV0YUxvYWRlZCIsIkNMSUNLRUQiLCJvbkNsaWNrZWQiLCJvblJlYWR5VG9QbGF5Iiwib25SZXN0b3JlIiwib25FbmFibGUiLCJvbkRpc2FibGUiLCJkaXNhYmxlIiwib25EZXN0cm95IiwiZGVzdHJveSIsInVwZGF0ZSIsImR0IiwidXBkYXRlTWF0cml4Iiwibm9kZSIsImVtaXRFdmVudHMiLCJlbWl0IiwicGxheSIsInJlc3VtZSIsInN0b3AiLCJnZXREdXJhdGlvbiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLGVBQWUsR0FBR0MsT0FBTyxDQUFDLHFCQUFELENBQS9CO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNQyxTQUFTLEdBQUdGLGVBQWUsQ0FBQ0UsU0FBbEM7QUFH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QUFDSixHQXJZc0I7O0FBdVl2QjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsV0E3WXVCLHlCQTZZUjtBQUNYLFFBQUksS0FBS3JFLEtBQVQsRUFBZ0I7QUFDWixhQUFPLEtBQUtBLEtBQUwsQ0FBV1EsUUFBWCxFQUFQO0FBQ0g7O0FBQ0QsV0FBTyxDQUFDLENBQVI7QUFDSCxHQWxac0I7O0FBb1p2QjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSUcsRUFBQUEsU0ExWnVCLHVCQTBaVjtBQUNULFFBQUksS0FBS1gsS0FBVCxFQUFnQjtBQUNaLGFBQU8sS0FBS0EsS0FBTCxDQUFXVyxTQUFYLEVBQVA7QUFDSDs7QUFDRCxXQUFPLEtBQVA7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBOWEyQixDQUFULENBQWxCO0FBaWJBN0MsRUFBRSxDQUFDSSxXQUFILEdBQWlCb0csTUFBTSxDQUFDQyxPQUFQLEdBQWlCckcsV0FBbEM7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3QgVmlkZW9QbGF5ZXJJbXBsID0gcmVxdWlyZSgnLi92aWRlby1wbGF5ZXItaW1wbCcpO1xuXG4vKipcbiAqICEjZW4gVmlkZW8gZXZlbnQgdHlwZVxuICogISN6aCDop4bpopHkuovku7bnsbvlnotcbiAqIEBlbnVtIFZpZGVvUGxheWVyLkV2ZW50VHlwZVxuICovXG4vKipcbiAqICEjZW4gcGxheVxuICogISN6aCDmkq3mlL5cbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBQTEFZSU5HXG4gKi9cbi8qKlxuICogISNlbiBwYXVzZVxuICogISN6aCDmmoLlgZxcbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBQQVVTRURcbiAqL1xuLyoqXG4gKiAhI2VuIHN0b3BcbiAqICEjemgg5YGc5q2iXG4gKiBAcHJvcGVydHkge051bWJlcn0gU1RPUFBFRFxuICovXG4vKipcbiAqICEjZW4gcGxheSBlbmRcbiAqICEjemgg5pKt5pS+57uT5p2fXG4gKiBAcHJvcGVydHkge051bWJlcn0gQ09NUExFVEVEXG4gKi9cbi8qKlxuICogISNlbiBtZXRhIGRhdGEgaXMgbG9hZGVkXG4gKiAhI3poIOinhumikeeahOWFg+S/oeaBr+W3suWKoOi9veWujOaIkO+8jOS9oOWPr+S7peiwg+eUqCBnZXREdXJhdGlvbiDmnaXojrflj5bop4bpopHmgLvml7bplb9cbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBNRVRBX0xPQURFRFxuICovXG4vKipcbiAqICEjZW4gY2xpY2tlZCBieSB0aGUgdXNlclxuICogISN6aCDop4bpopHooqvnlKjmiLfngrnlh7vkuoZcbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBDTElDS0VEXG4gKi9cbi8qKlxuICogISNlbiByZWFkeSB0byBwbGF5LCB0aGlzIGV2ZW50IGlzIG5vdCBndWFyYW50ZWVkIHRvIGJlIHRyaWdnZXJlZCBvbiBhbGwgcGxhdGZvcm0gb3IgYnJvd3NlciwgcGxlYXNlIGRvbid0IHJlbHkgb24gaXQgdG8gcGxheSB5b3VyIHZpZGVvLjxici8+XG4gKiAhI3poIOinhumikeWHhuWkh+WlveS6hu+8jOi/meS4quS6i+S7tuW5tuS4jeS/nemanOS8muWcqOaJgOacieW5s+WPsOaIlua1j+iniOWZqOS4reiiq+inpuWPke+8jOWug+S+nei1luS6juW5s+WPsOWunueOsO+8jOivt+S4jeimgeS+nei1luS6jui/meS4quS6i+S7tuWBmuinhumikeaSreaUvueahOaOp+WItuOAglxuICogQHByb3BlcnR5IHtOdW1iZXJ9IFJFQURZX1RPX1BMQVlcbiAqL1xuY29uc3QgRXZlbnRUeXBlID0gVmlkZW9QbGF5ZXJJbXBsLkV2ZW50VHlwZTtcblxuXG4vKipcbiAqICEjZW4gRW51bSBmb3IgdmlkZW8gcmVzb3VjZSB0eXBlIHR5cGUuXG4gKiAhI3poIOinhumikeadpea6kFxuICogQGVudW0gVmlkZW9QbGF5ZXIuUmVzb3VyY2VUeXBlXG4gKi9cbmNvbnN0IFJlc291cmNlVHlwZSA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHJlbW90ZSByZXNvdXJjZSB0eXBlLlxuICAgICAqICEjemgg6L+c56iL6KeG6aKRXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFJFTU9URVxuICAgICAqL1xuICAgIFJFTU9URTogMCxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBsb2NhbCByZXNvdWNlIHR5cGUuXG4gICAgICogISN6aCDmnKzlnLDop4bpopFcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gTE9DQUxcbiAgICAgKi9cbiAgICBMT0NBTDogMVxufSk7XG5cblxuLyoqXG4gKiAhI2VuIGNjLlZpZGVvUGxheWVyIGlzIGEgY29tcG9uZW50IGZvciBwbGF5aW5nIHZpZGVvcywgeW91IGNhbiB1c2UgaXQgZm9yIHNob3dpbmcgdmlkZW9zIGluIHlvdXIgZ2FtZS4gQmVjYXVzZSBkaWZmZXJlbnQgcGxhdGZvcm1zIGhhdmUgZGlmZmVyZW50IGF1dGhvcml6YXRpb24sIEFQSSBhbmQgY29udHJvbCBtZXRob2RzIGZvciBWaWRlb1BsYXllciBjb21wb25lbnQuIEFuZCBoYXZlIG5vdCB5ZXQgZm9ybWVkIGEgdW5pZmllZCBzdGFuZGFyZCwgb25seSBXZWIsIGlPUywgYW5kIEFuZHJvaWQgcGxhdGZvcm1zIGFyZSBjdXJyZW50bHkgc3VwcG9ydGVkLlxuICogISN6aCBWaWRlbyDnu4Tku7bvvIznlKjkuo7lnKjmuLjmiI/kuK3mkq3mlL7op4bpopHjgILnlLHkuo7kuI3lkIzlubPlj7Dlr7nkuo4gVmlkZW9QbGF5ZXIg57uE5Lu255qE5o6I5p2D44CBQVBJ44CB5o6n5Yi25pa55byP6YO95LiN5ZCM77yM6L+Y5rKh5pyJ5b2i5oiQ57uf5LiA55qE5qCH5YeG77yM5omA5Lul55uu5YmN5Y+q5pSv5oyBIFdlYuOAgWlPUyDlkowgQW5kcm9pZCDlubPlj7DjgIJcbiAqIEBjbGFzcyBWaWRlb1BsYXllclxuICogQGV4dGVuZHMgQ29tcG9uZW50XG4gKi9cbmxldCBWaWRlb1BsYXllciA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuVmlkZW9QbGF5ZXInLFxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC51aS9WaWRlb1BsYXllcicsXG4gICAgICAgIGluc3BlY3RvcjogJ3BhY2thZ2VzOi8vaW5zcGVjdG9yL2luc3BlY3RvcnMvY29tcHMvdmlkZW9wbGF5ZXIuanMnLFxuICAgICAgICBoZWxwOiAnaTE4bjpDT01QT05FTlQuaGVscF91cmwudmlkZW9wbGF5ZXInLFxuICAgICAgICBleGVjdXRlSW5FZGl0TW9kZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgX3Jlc291cmNlVHlwZTogUmVzb3VyY2VUeXBlLlJFTU9URSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHJlc291cmNlIHR5cGUgb2YgdmlkZW9wbGF5ZXIsIFJFTU9URSBmb3IgcmVtb3RlIHVybCBhbmQgTE9DQUwgZm9yIGxvY2FsIGZpbGUgcGF0aC5cbiAgICAgICAgICogISN6aCDop4bpopHmnaXmupDvvJpSRU1PVEUg6KGo56S66L+c56iL6KeG6aKRIFVSTO+8jExPQ0FMIOihqOekuuacrOWcsOinhumikeWcsOWdgOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1ZpZGVvUGxheWVyLlJlc291cmNlVHlwZX0gcmVzb3VyY2VUeXBlXG4gICAgICAgICAqL1xuICAgICAgICByZXNvdXJjZVR5cGU6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQudmlkZW9wbGF5ZXIucmVzb3VyY2VUeXBlJyxcbiAgICAgICAgICAgIHR5cGU6IFJlc291cmNlVHlwZSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzb3VyY2VUeXBlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlVmlkZW9Tb3VyY2UoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVzb3VyY2VUeXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF9yZW1vdGVVUkw6ICcnLFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgcmVtb3RlIFVSTCBvZiB2aWRlby5cbiAgICAgICAgICogISN6aCDov5znqIvop4bpopHnmoQgVVJMXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSByZW1vdGVVUkxcbiAgICAgICAgICovXG4gICAgICAgIHJlbW90ZVVSTDoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC52aWRlb3BsYXllci51cmwnLFxuICAgICAgICAgICAgdHlwZTogY2MuU3RyaW5nLFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3RlVVJMID0gdXJsO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVZpZGVvU291cmNlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlbW90ZVVSTDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfY2xpcDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkFzc2V0XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBsb2NhbCB2aWRlbyBmdWxsIHBhdGguXG4gICAgICAgICAqICEjemgg5pys5Zyw6KeG6aKR55qEIFVSTFxuICAgICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gY2xpcFxuICAgICAgICAgKi9cbiAgICAgICAgY2xpcDoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC52aWRlb3BsYXllci52aWRlbycsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2xpcDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NsaXAgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVWaWRlb1NvdXJjZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkFzc2V0XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIGN1cnJlbnQgcGxheWJhY2sgdGltZSBvZiB0aGUgbm93IHBsYXlpbmcgaXRlbSBpbiBzZWNvbmRzLCB5b3UgY291bGQgYWxzbyBjaGFuZ2UgdGhlIHN0YXJ0IHBsYXliYWNrIHRpbWUuXG4gICAgICAgICAqICEjemgg5oyH5a6a6KeG6aKR5LuO5LuA5LmI5pe26Ze054K55byA5aeL5pKt5pS+77yM5Y2V5L2N5piv56eS77yM5Lmf5Y+v5Lul55So5p2l6I635Y+W5b2T5YmN6KeG6aKR5pKt5pS+55qE5pe26Ze06L+b5bqm44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBjdXJyZW50VGltZVxuICAgICAgICAgKi9cbiAgICAgICAgY3VycmVudFRpbWU6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQudmlkZW9wbGF5ZXIuY3VycmVudFRpbWUnLFxuICAgICAgICAgICAgdHlwZTogY2MuRmxvYXQsXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh0aW1lKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW1wbC5zZWVrVG8odGltZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZvciB1c2VkIHRvIG1ha2UgdGhlIGN1cnJlbnQgdGltZSBvZiBlYWNoIHBsYXRmb3JtIGNvbnNpc3RlbnRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRTdGF0dXMgPT09IEV2ZW50VHlwZS5OT05FIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50U3RhdHVzID09PSBFdmVudFR5cGUuU1RPUFBFRCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudFN0YXR1cyA9PT0gRXZlbnRUeXBlLk1FVEFfTE9BREVEIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50U3RhdHVzID09PSBFdmVudFR5cGUuUkVBRFlfVE9fUExBWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fY3VycmVudFN0YXR1cyA9PT0gRXZlbnRUeXBlLkNPTVBMRVRFRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ltcGwuZHVyYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faW1wbC5jdXJyZW50VGltZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3ZvbHVtZTogMSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHZvbHVtZSBvZiB0aGUgdmlkZW8uXG4gICAgICAgICAqICEjemgg6KeG6aKR55qE6Z+z6YeP77yIMC4wIH4gMS4w77yJXG4gICAgICAgICAqIEBwcm9wZXJ0eSB2b2x1bWVcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMVxuICAgICAgICAgKi9cbiAgICAgICAgdm9sdW1lOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdm9sdW1lO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdm9sdW1lID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNQbGF5aW5nKCkgJiYgIXRoaXMuX211dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3luY1ZvbHVtZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByYW5nZTogWzAsIDFdLFxuICAgICAgICAgICAgdHlwZTogY2MuRmxvYXQsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnZpZGVvcGxheWVyLnZvbHVtZSdcbiAgICAgICAgfSxcblxuICAgICAgICBfbXV0ZTogZmFsc2UsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIE11dGVzIHRoZSBWaWRlb1BsYXllci4gTXV0ZSBzZXRzIHRoZSB2b2x1bWU9MCwgVW4tTXV0ZSByZXN0b3JlIHRoZSBvcmlnaW5hbCB2b2x1bWUuXG4gICAgICAgICAqICEjemgg5piv5ZCm6Z2Z6Z+z6KeG6aKR44CC6Z2Z6Z+z5pe26K6+572u6Z+z6YeP5Li6IDDvvIzlj5bmtojpnZnpn7PmmK/mgaLlpI3ljp/mnaXnmoTpn7Pph4/jgIJcbiAgICAgICAgICogQHByb3BlcnR5IG11dGVcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICBtdXRlOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbXV0ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX211dGUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zeW5jVm9sdW1lKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC52aWRlb3BsYXllci5tdXRlJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBXaGV0aGVyIGtlZXAgdGhlIGFzcGVjdCByYXRpb24gb2YgdGhlIG9yaWdpbmFsIHZpZGVvLlxuICAgICAgICAgKiAhI3poIOaYr+WQpuS/neaMgeinhumikeWOn+adpeeahOWuvemrmOavlFxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGtlZXBBc3BlY3RSYXRpb1xuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAgICAgKi9cbiAgICAgICAga2VlcEFzcGVjdFJhdGlvOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnZpZGVvcGxheWVyLmtlZXBBc3BlY3RSYXRpbycsXG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgICAgdHlwZTogY2MuQm9vbGVhbixcbiAgICAgICAgICAgIG5vdGlmeTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ltcGwgJiYgdGhpcy5faW1wbC5zZXRLZWVwQXNwZWN0UmF0aW9FbmFibGVkKHRoaXMua2VlcEFzcGVjdFJhdGlvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBXaGV0aGVyIHBsYXkgdmlkZW8gaW4gZnVsbHNjcmVlbiBtb2RlLlxuICAgICAgICAgKiAhI3poIOaYr+WQpuWFqOWxj+aSreaUvuinhumikVxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGlzRnVsbHNjcmVlblxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIF9pc0Z1bGxzY3JlZW46IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgZm9ybWVybHlTZXJpYWxpemVkQXM6ICdfTiRpc0Z1bGxzY3JlZW4nLFxuICAgICAgICB9LFxuICAgICAgICBpc0Z1bGxzY3JlZW46IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faXNGdWxsc2NyZWVuID0gdGhpcy5faW1wbCAmJiB0aGlzLl9pbXBsLmlzRnVsbFNjcmVlbkVuYWJsZWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzRnVsbHNjcmVlbjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKGVuYWJsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2lzRnVsbHNjcmVlbiA9IGVuYWJsZTtcbiAgICAgICAgICAgICAgICBpZiAoIUNDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbXBsICYmIHRoaXMuX2ltcGwuc2V0RnVsbFNjcmVlbkVuYWJsZWQoZW5hYmxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnZpZGVvcGxheWVyLmlzRnVsbHNjcmVlbidcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBBbHdheXMgYmVsb3cgdGhlIGdhbWUgdmlldyAob25seSB1c2VmdWwgb24gV2ViLiBOb3RlOiBUaGUgc3BlY2lmaWMgZWZmZWN0cyBhcmUgbm90IGd1YXJhbnRlZWQgdG8gYmUgY29uc2lzdGVudCwgZGVwZW5kaW5nIG9uIHdoZXRoZXIgZWFjaCBicm93c2VyIHN1cHBvcnRzIG9yIHJlc3RyaWN0cykuXG4gICAgICAgICAqICEjemgg5rC46L+c5Zyo5ri45oiP6KeG5Zu+5pyA5bqV5bGC77yI6L+Z5Liq5bGe5oCn5Y+q5pyJ5ZyoIFdlYiDlubPlj7DkuIrmnInmlYjmnpzjgILms6jmhI/vvJrlhbfkvZPmlYjmnpzml6Dms5Xkv53or4HkuIDoh7TvvIzot5/lkITkuKrmtY/op4jlmajmmK/lkKbmlK/mjIHkuI7pmZDliLbmnInlhbPvvIlcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBzdGF5T25Cb3R0b21cbiAgICAgICAgICovXG4gICAgICAgIF9zdGF5T25Cb3R0b206IGZhbHNlLFxuICAgICAgICBzdGF5T25Cb3R0b206IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXlPbkJvdHRvbVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAoZW5hYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RheU9uQm90dG9tID0gZW5hYmxlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ltcGwuc2V0U3RheU9uQm90dG9tKGVuYWJsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC52aWRlb3BsYXllci5zdGF5T25Cb3R0b20nLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIHRoZSB2aWRlbyBwbGF5ZXIncyBjYWxsYmFjaywgaXQgd2lsbCBiZSB0cmlnZ2VyZWQgd2hlbiBjZXJ0YWluIGV2ZW50IG9jY3VycywgbGlrZTogcGxheWluZywgcGF1c2VkLCBzdG9wcGVkIGFuZCBjb21wbGV0ZWQuXG4gICAgICAgICAqICEjemgg6KeG6aKR5pKt5pS+5Zue6LCD5Ye95pWw77yM6K+l5Zue6LCD5Ye95pWw5Lya5Zyo54m55a6a5oOF5Ya16KKr6Kem5Y+R77yM5q+U5aaC5pKt5pS+5Lit77yM5pqC5pe277yM5YGc5q2i5ZKM5a6M5oiQ5pKt5pS+44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Q29tcG9uZW50LkV2ZW50SGFuZGxlcltdfSB2aWRlb1BsYXllckV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICB2aWRlb1BsYXllckV2ZW50OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIsXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgRXZlbnRUeXBlOiBFdmVudFR5cGUsXG4gICAgICAgIFJlc291cmNlVHlwZTogUmVzb3VyY2VUeXBlLFxuICAgICAgICBJbXBsOiBWaWRlb1BsYXllckltcGxcbiAgICB9LFxuXG4gICAgY3RvciAoKSB7XG4gICAgICAgIHRoaXMuX2ltcGwgPSBuZXcgVmlkZW9QbGF5ZXJJbXBsKCk7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRTdGF0dXMgPSBFdmVudFR5cGUuTk9ORTtcbiAgICB9LFxuXG4gICAgX3N5bmNWb2x1bWUgKCkge1xuICAgICAgICBsZXQgaW1wbCA9IHRoaXMuX2ltcGw7XG4gICAgICAgIGlmIChpbXBsKSB7XG4gICAgICAgICAgICBsZXQgdm9sdW1lID0gdGhpcy5fbXV0ZSA/IDAgOiB0aGlzLl92b2x1bWU7XG4gICAgICAgICAgICBpbXBsLnNldFZvbHVtZSh2b2x1bWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVWaWRlb1NvdXJjZSAoKSB7XG4gICAgICAgIGxldCB1cmwgPSAnJztcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VUeXBlID09PSBSZXNvdXJjZVR5cGUuUkVNT1RFKSB7XG4gICAgICAgICAgICB1cmwgPSB0aGlzLnJlbW90ZVVSTDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLl9jbGlwKSB7XG4gICAgICAgICAgICB1cmwgPSB0aGlzLl9jbGlwLm5hdGl2ZVVybDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9pbXBsLnNldFVSTCh1cmwsIHRoaXMuX211dGUgfHwgdGhpcy5fdm9sdW1lID09PSAwKTtcbiAgICAgICAgdGhpcy5faW1wbC5zZXRLZWVwQXNwZWN0UmF0aW9FbmFibGVkKHRoaXMua2VlcEFzcGVjdFJhdGlvKTtcbiAgICB9LFxuXG4gICAgb25Mb2FkICgpIHtcbiAgICAgICAgbGV0IGltcGwgPSB0aGlzLl9pbXBsO1xuICAgICAgICBpZiAoaW1wbCkge1xuICAgICAgICAgICAgaW1wbC5jcmVhdGVEb21FbGVtZW50SWZOZWVkZWQodGhpcy5fbXV0ZSB8fCB0aGlzLl92b2x1bWUgPT09IDApO1xuICAgICAgICAgICAgaW1wbC5zZXRTdGF5T25Cb3R0b20odGhpcy5fc3RheU9uQm90dG9tKTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVZpZGVvU291cmNlKCk7XG5cbiAgICAgICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgaW1wbC5zZWVrVG8odGhpcy5jdXJyZW50VGltZSk7XG4gICAgICAgICAgICAgICAgaW1wbC5zZXRGdWxsU2NyZWVuRW5hYmxlZCh0aGlzLl9pc0Z1bGxzY3JlZW4pO1xuICAgICAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcblxuICAgICAgICAgICAgICAgIGltcGwuc2V0RXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuUExBWUlORywgdGhpcy5vblBsYXlpbmcuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgaW1wbC5zZXRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5QQVVTRUQsIHRoaXMub25QYXN1ZWQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgaW1wbC5zZXRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5TVE9QUEVELCB0aGlzLm9uU3RvcHBlZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICAgICBpbXBsLnNldEV2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLkNPTVBMRVRFRCwgdGhpcy5vbkNvbXBsZXRlZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICAgICBpbXBsLnNldEV2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLk1FVEFfTE9BREVELCB0aGlzLm9uTWV0YUxvYWRlZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICAgICBpbXBsLnNldEV2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLkNMSUNLRUQsIHRoaXMub25DbGlja2VkLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIGltcGwuc2V0RXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuUkVBRFlfVE9fUExBWSwgdGhpcy5vblJlYWR5VG9QbGF5LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uUmVzdG9yZSAoKSB7XG4gICAgICAgIGlmICghdGhpcy5faW1wbCkge1xuICAgICAgICAgICAgdGhpcy5faW1wbCA9IG5ldyBWaWRlb1BsYXllckltcGwoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkVuYWJsZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICB0aGlzLl9pbXBsLmVuYWJsZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRGlzYWJsZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICB0aGlzLl9pbXBsLmRpc2FibGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkRlc3Ryb3kgKCkge1xuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgdGhpcy5faW1wbC5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLl9pbXBsID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGRhdGUgKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICB0aGlzLl9pbXBsLnVwZGF0ZU1hdHJpeCh0aGlzLm5vZGUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uUmVhZHlUb1BsYXkgKCkge1xuICAgICAgICB0aGlzLl9jdXJyZW50U3RhdHVzID0gRXZlbnRUeXBlLlJFQURZX1RPX1BMQVk7XG4gICAgICAgIGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIuZW1pdEV2ZW50cyh0aGlzLnZpZGVvUGxheWVyRXZlbnQsIHRoaXMsIEV2ZW50VHlwZS5SRUFEWV9UT19QTEFZKTtcbiAgICAgICAgdGhpcy5ub2RlLmVtaXQoJ3JlYWR5LXRvLXBsYXknLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgb25NZXRhTG9hZGVkICgpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudFN0YXR1cyA9IEV2ZW50VHlwZS5NRVRBX0xPQURFRDtcbiAgICAgICAgY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlci5lbWl0RXZlbnRzKHRoaXMudmlkZW9QbGF5ZXJFdmVudCwgdGhpcywgRXZlbnRUeXBlLk1FVEFfTE9BREVEKTtcbiAgICAgICAgdGhpcy5ub2RlLmVtaXQoJ21ldGEtbG9hZGVkJywgdGhpcyk7XG4gICAgfSxcblxuICAgIG9uQ2xpY2tlZCAoKSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRTdGF0dXMgPSBFdmVudFR5cGUuQ0xJQ0tFRDtcbiAgICAgICAgY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlci5lbWl0RXZlbnRzKHRoaXMudmlkZW9QbGF5ZXJFdmVudCwgdGhpcywgRXZlbnRUeXBlLkNMSUNLRUQpO1xuICAgICAgICB0aGlzLm5vZGUuZW1pdCgnY2xpY2tlZCcsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBvblBsYXlpbmcgKCkge1xuICAgICAgICB0aGlzLl9jdXJyZW50U3RhdHVzID0gRXZlbnRUeXBlLlBMQVlJTkc7XG4gICAgICAgIGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIuZW1pdEV2ZW50cyh0aGlzLnZpZGVvUGxheWVyRXZlbnQsIHRoaXMsIEV2ZW50VHlwZS5QTEFZSU5HKTtcbiAgICAgICAgdGhpcy5ub2RlLmVtaXQoJ3BsYXlpbmcnLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgb25QYXN1ZWQgKCkge1xuICAgICAgICB0aGlzLl9jdXJyZW50U3RhdHVzID0gRXZlbnRUeXBlLlBBVVNFRDtcbiAgICAgICAgY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlci5lbWl0RXZlbnRzKHRoaXMudmlkZW9QbGF5ZXJFdmVudCwgdGhpcywgRXZlbnRUeXBlLlBBVVNFRCk7XG4gICAgICAgIHRoaXMubm9kZS5lbWl0KCdwYXVzZWQnLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgb25TdG9wcGVkICgpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudFN0YXR1cyA9IEV2ZW50VHlwZS5TVE9QUEVEO1xuICAgICAgICBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyLmVtaXRFdmVudHModGhpcy52aWRlb1BsYXllckV2ZW50LCB0aGlzLCBFdmVudFR5cGUuU1RPUFBFRCk7XG4gICAgICAgIHRoaXMubm9kZS5lbWl0KCdzdG9wcGVkJywgdGhpcyk7XG4gICAgfSxcblxuICAgIG9uQ29tcGxldGVkICgpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudFN0YXR1cyA9IEV2ZW50VHlwZS5DT01QTEVURUQ7XG4gICAgICAgIGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIuZW1pdEV2ZW50cyh0aGlzLnZpZGVvUGxheWVyRXZlbnQsIHRoaXMsIEV2ZW50VHlwZS5DT01QTEVURUQpO1xuICAgICAgICB0aGlzLm5vZGUuZW1pdCgnY29tcGxldGVkJywgdGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gSWYgYSB2aWRlbyBpcyBwYXVzZWQsIGNhbGwgdGhpcyBtZXRob2QgY291bGQgcmVzdW1lIHBsYXlpbmcuIElmIGEgdmlkZW8gaXMgc3RvcHBlZCwgY2FsbCB0aGlzIG1ldGhvZCB0byBwbGF5IGZyb20gc2NyYXRjaC5cbiAgICAgKiAhI3poIOWmguaenOinhumikeiiq+aaguWBnOaSreaUvuS6hu+8jOiwg+eUqOi/meS4quaOpeWPo+WPr+S7pee7p+e7reaSreaUvuOAguWmguaenOinhumikeiiq+WBnOatouaSreaUvuS6hu+8jOiwg+eUqOi/meS4quaOpeWPo+WPr+S7peS7juWktOW8gOWni+aSreaUvuOAglxuICAgICAqIEBtZXRob2QgcGxheVxuICAgICAqL1xuICAgIHBsYXkgKCkge1xuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgdGhpcy5fc3luY1ZvbHVtZSgpO1xuICAgICAgICAgICAgdGhpcy5faW1wbC5wbGF5KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBJZiBhIHZpZGVvIGlzIHBhdXNlZCwgY2FsbCB0aGlzIG1ldGhvZCB0byByZXN1bWUgcGxheWluZy5cbiAgICAgKiAhI3poIOWmguaenOS4gOS4quinhumikeaSreaUvuiiq+aaguWBnOaSreaUvuS6hu+8jOiwg+eUqOi/meS4quaOpeWPo+WPr+S7pee7p+e7reaSreaUvuOAglxuICAgICAqIEBtZXRob2QgcmVzdW1lXG4gICAgICovXG4gICAgcmVzdW1lICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcbiAgICAgICAgICAgIHRoaXMuX3N5bmNWb2x1bWUoKTtcbiAgICAgICAgICAgIHRoaXMuX2ltcGwucmVzdW1lKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBJZiBhIHZpZGVvIGlzIHBsYXlpbmcsIGNhbGwgdGhpcyBtZXRob2QgdG8gcGF1c2UgcGxheWluZy5cbiAgICAgKiAhI3poIOWmguaenOS4gOS4quinhumikeato+WcqOaSreaUvu+8jOiwg+eUqOi/meS4quaOpeWPo+WPr+S7peaaguWBnOaSreaUvuOAglxuICAgICAqIEBtZXRob2QgcGF1c2VcbiAgICAgKi9cbiAgICBwYXVzZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICB0aGlzLl9pbXBsLnBhdXNlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBJZiBhIHZpZGVvIGlzIHBsYXlpbmcsIGNhbGwgdGhpcyBtZXRob2QgdG8gc3RvcCBwbGF5aW5nIGltbWVkaWF0ZWx5LlxuICAgICAqICEjemgg5aaC5p6c5LiA5Liq6KeG6aKR5q2j5Zyo5pKt5pS+77yM6LCD55So6L+Z5Liq5o6l5Y+j5Y+v5Lul56uL6ams5YGc5q2i5pKt5pS+44CCXG4gICAgICogQG1ldGhvZCBzdG9wXG4gICAgICovXG4gICAgc3RvcCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICB0aGlzLl9pbXBsLnN0b3AoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldHMgdGhlIGR1cmF0aW9uIG9mIHRoZSB2aWRlb1xuICAgICAqICEjemgg6I635Y+W6KeG6aKR5paH5Lu255qE5pKt5pS+5oC75pe26ZW/XG4gICAgICogQG1ldGhvZCBnZXREdXJhdGlvblxuICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0RHVyYXRpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ltcGwuZHVyYXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gRGV0ZXJtaW5lIHdoZXRoZXIgdmlkZW8gaXMgcGxheWluZyBvciBub3QuXG4gICAgICogISN6aCDliKTmlq3lvZPliY3op4bpopHmmK/lkKblpITkuo7mkq3mlL7nirbmgIFcbiAgICAgKiBAbWV0aG9kIGlzUGxheWluZ1xuICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgICAqL1xuICAgIGlzUGxheWluZyAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW1wbC5pc1BsYXlpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBpZiB5b3UgZG9uJ3QgbmVlZCB0aGUgVmlkZW9QbGF5ZXIgYW5kIGl0IGlzbid0IGluIGFueSBydW5uaW5nIFNjZW5lLCB5b3Ugc2hvdWxkXG4gICAgICogY2FsbCB0aGUgZGVzdHJveSBtZXRob2Qgb24gdGhpcyBjb21wb25lbnQgb3IgdGhlIGFzc29jaWF0ZWQgbm9kZSBleHBsaWNpdGx5LlxuICAgICAqIE90aGVyd2lzZSwgdGhlIGNyZWF0ZWQgRE9NIGVsZW1lbnQgd29uJ3QgYmUgcmVtb3ZlZCBmcm9tIHdlYiBwYWdlLlxuICAgICAqICEjemhcbiAgICAgKiDlpoLmnpzkvaDkuI3lho3kvb/nlKggVmlkZW9QbGF5ZXLvvIzlubbkuJTnu4Tku7bmnKrmt7vliqDliLDlnLrmma/kuK3vvIzpgqPkuYjkvaDlv4XpobvmiYvliqjlr7nnu4Tku7bmiJbmiYDlnKjoioLngrnosIPnlKggZGVzdHJveeOAglxuICAgICAqIOi/meagt+aJjeiDveenu+mZpOe9kemhteS4iueahCBET00g6IqC54K577yM6YG/5YWNIFdlYiDlubPlj7DlhoXlrZjms4TpnLLjgIJcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZpZGVvcGxheWVyLm5vZGUucGFyZW50ID0gbnVsbDsgIC8vIG9yICB2aWRlb3BsYXllci5ub2RlLnJlbW92ZUZyb21QYXJlbnQoZmFsc2UpO1xuICAgICAqIC8vIHdoZW4geW91IGRvbid0IG5lZWQgdmlkZW9wbGF5ZXIgYW55bW9yZVxuICAgICAqIHZpZGVvcGxheWVyLm5vZGUuZGVzdHJveSgpO1xuICAgICAqIEBtZXRob2QgZGVzdHJveVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHdoZXRoZXIgaXQgaXMgdGhlIGZpcnN0IHRpbWUgdGhlIGRlc3Ryb3kgYmVpbmcgY2FsbGVkXG4gICAgICovXG59KTtcblxuY2MuVmlkZW9QbGF5ZXIgPSBtb2R1bGUuZXhwb3J0cyA9IFZpZGVvUGxheWVyO1xuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IHJlYWR5LXRvLXBsYXlcbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XG4gKiBAcGFyYW0ge1ZpZGVvUGxheWVyfSB2aWRlb1BsYXllciAtIFRoZSBWaWRlb1BsYXllciBjb21wb25lbnQuXG4gKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXG4gKiAhI3poXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcbiAqIEBldmVudCBtZXRhLWxvYWRlZFxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqIEBwYXJhbSB7VmlkZW9QbGF5ZXJ9IHZpZGVvUGxheWVyIC0gVGhlIFZpZGVvUGxheWVyIGNvbXBvbmVudC5cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IGNsaWNrZWRcbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XG4gKiBAcGFyYW0ge1ZpZGVvUGxheWVyfSB2aWRlb1BsYXllciAtIFRoZSBWaWRlb1BsYXllciBjb21wb25lbnQuXG4gKi9cblxuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IHBsYXlpbmdcbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XG4gKiBAcGFyYW0ge1ZpZGVvUGxheWVyfSB2aWRlb1BsYXllciAtIFRoZSBWaWRlb1BsYXllciBjb21wb25lbnQuXG4gKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXG4gKiAhI3poXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcbiAqIEBldmVudCBwYXVzZWRcbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XG4gKiBAcGFyYW0ge1ZpZGVvUGxheWVyfSB2aWRlb1BsYXllciAtIFRoZSBWaWRlb1BsYXllciBjb21wb25lbnQuXG4gKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXG4gKiAhI3poXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcbiAqIEBldmVudCBzdG9wcGVkXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxuICogQHBhcmFtIHtWaWRlb1BsYXllcn0gdmlkZW9QbGF5ZXIgLSBUaGUgVmlkZW9QbGF5ZXIgY29tcG9uZW50LlxuICovXG5cbi8qKlxuICogISNlblxuICogTm90ZTogVGhpcyBldmVudCBpcyBlbWl0dGVkIGZyb20gdGhlIG5vZGUgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBiZWxvbmdzLlxuICogISN6aFxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXG4gKiBAZXZlbnQgY29tcGxldGVkXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxuICogQHBhcmFtIHtWaWRlb1BsYXllcn0gdmlkZW9QbGF5ZXIgLSBUaGUgVmlkZW9QbGF5ZXIgY29tcG9uZW50LlxuICovXG4iXSwic291cmNlUm9vdCI6Ii8ifQ==