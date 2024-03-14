
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCAudioSource.js';
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
var misc = require('../utils/misc');

var Component = require('./CCComponent');

var AudioClip = require('../assets/CCAudioClip');
/**
 * !#en Audio Source.
 * !#zh 音频源组件，能对音频剪辑。
 * @class AudioSource
 * @extends Component
 */


var AudioSource = cc.Class({
  name: 'cc.AudioSource',
  "extends": Component,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.others/AudioSource',
    help: 'i18n:COMPONENT.help_url.audiosource'
  },
  ctor: function ctor() {
    // We can't require Audio here because jsb Audio is implemented outside the engine,
    // it can only take effect rely on overwriting cc._Audio
    this.audio = new cc._Audio();
  },
  properties: {
    _clip: {
      "default": null,
      type: AudioClip
    },
    _volume: 1,
    _mute: false,
    _loop: false,
    _pausedFlag: {
      "default": false,
      serializable: false
    },
    _firstlyEnabled: true,

    /**
     * !#en
     * Is the audio source playing (Read Only). <br/>
     * Note: isPlaying is not supported for Native platforms.
     * !#zh
     * 该音频剪辑是否正播放（只读）。<br/>
     * 注意：Native 平台暂时不支持 isPlaying。
     * @property isPlaying
     * @type {Boolean}
     * @readOnly
     * @default false
     */
    isPlaying: {
      get: function get() {
        var state = this.audio.getState();
        return state === cc._Audio.State.PLAYING;
      },
      visible: false
    },

    /**
     * !#en The clip of the audio source to play.
     * !#zh 要播放的音频剪辑。
     * @property clip
     * @type {AudioClip}
     * @default 1
     */
    clip: {
      get: function get() {
        return this._clip;
      },
      set: function set(value) {
        if (value === this._clip) {
          return;
        }

        if (!(value instanceof AudioClip)) {
          return cc.error('Wrong type of AudioClip.');
        }

        this._clip = value;
        this.audio.stop();
        this.audio.src = this._clip;

        if (this.preload) {
          this._clip._ensureLoaded();
        }
      },
      type: AudioClip,
      tooltip: CC_DEV && 'i18n:COMPONENT.audio.clip',
      animatable: false
    },

    /**
     * !#en The volume of the audio source.
     * !#zh 音频源的音量（0.0 ~ 1.0）。
     * @property volume
     * @type {Number}
     * @default 1
     */
    volume: {
      get: function get() {
        return this._volume;
      },
      set: function set(value) {
        value = misc.clamp01(value);
        this._volume = value;

        if (!this._mute) {
          this.audio.setVolume(value);
        }

        return value;
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.audio.volume'
    },

    /**
     * !#en Is the audio source mute?
     * !#zh 是否静音音频源。Mute 是设置音量为 0，取消静音是恢复原来的音量。
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
        this.audio.setVolume(value ? 0 : this._volume);
        return value;
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.audio.mute'
    },

    /**
     * !#en Is the audio source looping?
     * !#zh 音频源是否循环播放？
     * @property loop
     * @type {Boolean}
     * @default false
     */
    loop: {
      get: function get() {
        return this._loop;
      },
      set: function set(value) {
        this._loop = value;
        this.audio.setLoop(value);
        return value;
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.audio.loop'
    },

    /**
     * !#en If set to true, the audio source will automatically start playing on onEnable.
     * !#zh 如果设置为 true，音频源将在 onEnable 时自动播放。
     * @property playOnLoad
     * @type {Boolean}
     * @default true
     */
    playOnLoad: {
      "default": false,
      tooltip: CC_DEV && 'i18n:COMPONENT.audio.play_on_load',
      animatable: false
    },

    /**
     * !#en If set to true and AudioClip is a deferred load resource, the component will preload AudioClip in the onLoad phase.
     * !#zh 如果设置为 true 且 AudioClip 为延迟加载资源，组件将在 onLoad 阶段预加载 AudioClip。
     * @property preload
     * @type {Boolean}
     * @default false
     */
    preload: {
      "default": false,
      animatable: false
    }
  },
  _pausedCallback: function _pausedCallback() {
    var state = this.audio.getState();

    if (state === cc._Audio.State.PLAYING) {
      this.audio.pause();
      this._pausedFlag = true;
    }
  },
  _restoreCallback: function _restoreCallback() {
    if (this._pausedFlag) {
      this.audio.resume();
    }

    this._pausedFlag = false;
  },
  onLoad: function onLoad() {
    // this.audio.src is undefined, when the clip property is deserialized from the scene
    if (!this.audio.src) {
      this.audio.src = this._clip;
    }

    if (this.preload) {
      this._clip._ensureLoaded();
    }
  },
  onEnable: function onEnable() {
    if (this.playOnLoad && this._firstlyEnabled) {
      this._firstlyEnabled = false;
      this.play();
    }

    cc.game.on(cc.game.EVENT_HIDE, this._pausedCallback, this);
    cc.game.on(cc.game.EVENT_SHOW, this._restoreCallback, this);
  },
  onDisable: function onDisable() {
    this.stop();
    cc.game.off(cc.game.EVENT_HIDE, this._pausedCallback, this);
    cc.game.off(cc.game.EVENT_SHOW, this._restoreCallback, this);
  },
  onDestroy: function onDestroy() {
    this.audio.destroy();
  },

  /**
   * !#en Plays the clip.
   * !#zh 播放音频剪辑。
   * @method play
   */
  play: function play() {
    if (CC_EDITOR || !this._clip) return;
    var audio = this.audio;
    audio.setVolume(this._mute ? 0 : this._volume);
    audio.setLoop(this._loop);
    audio.setCurrentTime(0);
    audio.play();
  },

  /**
   * !#en Stops the clip.
   * !#zh 停止当前音频剪辑。
   * @method stop
   */
  stop: function stop() {
    this.audio.stop();
  },

  /**
   * !#en Pause the clip.
   * !#zh 暂停当前音频剪辑。
   * @method pause
   */
  pause: function pause() {
    this.audio.pause();
  },

  /**
   * !#en Resume the clip.
   * !#zh 恢复播放。
   * @method resume
   */
  resume: function resume() {
    this.audio.resume();
  },

  /**
   * !#en Rewind playing music.
   * !#zh 从头开始播放。
   * @method rewind
   */
  rewind: function rewind() {
    this.audio.setCurrentTime(0);
  },

  /**
   * !#en Get current time
   * !#zh 获取当前的播放时间
   * @method getCurrentTime
   * @return {Number}
   */
  getCurrentTime: function getCurrentTime() {
    return this.audio.getCurrentTime();
  },

  /**
   * !#en Set current time
   * !#zh 设置当前的播放时间
   * @method setCurrentTime
   * @param {Number} time
   * @return {Number}
   */
  setCurrentTime: function setCurrentTime(time) {
    this.audio.setCurrentTime(time);
    return time;
  },

  /**
   * !#en Get audio duration
   * !#zh 获取当前音频的长度
   * @method getDuration
   * @return {Number}
   */
  getDuration: function getDuration() {
    return this.audio.getDuration();
  }
});
cc.AudioSource = module.exports = AudioSource;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvQ0NBdWRpb1NvdXJjZS5qcyJdLCJuYW1lcyI6WyJtaXNjIiwicmVxdWlyZSIsIkNvbXBvbmVudCIsIkF1ZGlvQ2xpcCIsIkF1ZGlvU291cmNlIiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJlZGl0b3IiLCJDQ19FRElUT1IiLCJtZW51IiwiaGVscCIsImN0b3IiLCJhdWRpbyIsIl9BdWRpbyIsInByb3BlcnRpZXMiLCJfY2xpcCIsInR5cGUiLCJfdm9sdW1lIiwiX211dGUiLCJfbG9vcCIsIl9wYXVzZWRGbGFnIiwic2VyaWFsaXphYmxlIiwiX2ZpcnN0bHlFbmFibGVkIiwiaXNQbGF5aW5nIiwiZ2V0Iiwic3RhdGUiLCJnZXRTdGF0ZSIsIlN0YXRlIiwiUExBWUlORyIsInZpc2libGUiLCJjbGlwIiwic2V0IiwidmFsdWUiLCJlcnJvciIsInN0b3AiLCJzcmMiLCJwcmVsb2FkIiwiX2Vuc3VyZUxvYWRlZCIsInRvb2x0aXAiLCJDQ19ERVYiLCJhbmltYXRhYmxlIiwidm9sdW1lIiwiY2xhbXAwMSIsInNldFZvbHVtZSIsIm11dGUiLCJsb29wIiwic2V0TG9vcCIsInBsYXlPbkxvYWQiLCJfcGF1c2VkQ2FsbGJhY2siLCJwYXVzZSIsIl9yZXN0b3JlQ2FsbGJhY2siLCJyZXN1bWUiLCJvbkxvYWQiLCJvbkVuYWJsZSIsInBsYXkiLCJnYW1lIiwib24iLCJFVkVOVF9ISURFIiwiRVZFTlRfU0hPVyIsIm9uRGlzYWJsZSIsIm9mZiIsIm9uRGVzdHJveSIsImRlc3Ryb3kiLCJzZXRDdXJyZW50VGltZSIsInJld2luZCIsImdldEN1cnJlbnRUaW1lIiwidGltZSIsImdldER1cmF0aW9uIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QU0sQ0FBQ0MsT0FBUCxHQUFpQmxFLFdBQWxDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBtaXNjID0gcmVxdWlyZSgnLi4vdXRpbHMvbWlzYycpO1xuY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9DQ0NvbXBvbmVudCcpO1xuY29uc3QgQXVkaW9DbGlwID0gcmVxdWlyZSgnLi4vYXNzZXRzL0NDQXVkaW9DbGlwJyk7XG5cbi8qKlxuICogISNlbiBBdWRpbyBTb3VyY2UuXG4gKiAhI3poIOmfs+mikea6kOe7hOS7tu+8jOiDveWvuemfs+mikeWJqui+keOAglxuICogQGNsYXNzIEF1ZGlvU291cmNlXG4gKiBAZXh0ZW5kcyBDb21wb25lbnRcbiAqL1xudmFyIEF1ZGlvU291cmNlID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5BdWRpb1NvdXJjZScsXG4gICAgZXh0ZW5kczogQ29tcG9uZW50LFxuXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50Lm90aGVycy9BdWRpb1NvdXJjZScsXG4gICAgICAgIGhlbHA6ICdpMThuOkNPTVBPTkVOVC5oZWxwX3VybC5hdWRpb3NvdXJjZScsXG4gICAgfSxcblxuICAgIGN0b3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gV2UgY2FuJ3QgcmVxdWlyZSBBdWRpbyBoZXJlIGJlY2F1c2UganNiIEF1ZGlvIGlzIGltcGxlbWVudGVkIG91dHNpZGUgdGhlIGVuZ2luZSxcbiAgICAgICAgLy8gaXQgY2FuIG9ubHkgdGFrZSBlZmZlY3QgcmVseSBvbiBvdmVyd3JpdGluZyBjYy5fQXVkaW9cbiAgICAgICAgdGhpcy5hdWRpbyA9IG5ldyBjYy5fQXVkaW8oKTtcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBfY2xpcDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IEF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICBfdm9sdW1lOiAxLFxuICAgICAgICBfbXV0ZTogZmFsc2UsXG4gICAgICAgIF9sb29wOiBmYWxzZSxcbiAgICAgICAgX3BhdXNlZEZsYWc6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgc2VyaWFsaXphYmxlOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBfZmlyc3RseUVuYWJsZWQ6IHRydWUsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogSXMgdGhlIGF1ZGlvIHNvdXJjZSBwbGF5aW5nIChSZWFkIE9ubHkpLiA8YnIvPlxuICAgICAgICAgKiBOb3RlOiBpc1BsYXlpbmcgaXMgbm90IHN1cHBvcnRlZCBmb3IgTmF0aXZlIHBsYXRmb3Jtcy5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDor6Xpn7PpopHliarovpHmmK/lkKbmraPmkq3mlL7vvIjlj6ror7vvvInjgII8YnIvPlxuICAgICAgICAgKiDms6jmhI/vvJpOYXRpdmUg5bmz5Y+w5pqC5pe25LiN5pSv5oyBIGlzUGxheWluZ+OAglxuICAgICAgICAgKiBAcHJvcGVydHkgaXNQbGF5aW5nXG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKiBAcmVhZE9ubHlcbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIGlzUGxheWluZzoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5hdWRpby5nZXRTdGF0ZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZSA9PT0gY2MuX0F1ZGlvLlN0YXRlLlBMQVlJTkc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgY2xpcCBvZiB0aGUgYXVkaW8gc291cmNlIHRvIHBsYXkuXG4gICAgICAgICAqICEjemgg6KaB5pKt5pS+55qE6Z+z6aKR5Ymq6L6R44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBjbGlwXG4gICAgICAgICAqIEB0eXBlIHtBdWRpb0NsaXB9XG4gICAgICAgICAqIEBkZWZhdWx0IDFcbiAgICAgICAgICovXG4gICAgICAgIGNsaXA6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jbGlwO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLl9jbGlwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCEodmFsdWUgaW5zdGFuY2VvZiBBdWRpb0NsaXApKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYy5lcnJvcignV3JvbmcgdHlwZSBvZiBBdWRpb0NsaXAuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2NsaXAgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmF1ZGlvLnN0b3AoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmF1ZGlvLnNyYyA9IHRoaXMuX2NsaXA7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJlbG9hZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jbGlwLl9lbnN1cmVMb2FkZWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogQXVkaW9DbGlwLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5hdWRpby5jbGlwJyxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHZvbHVtZSBvZiB0aGUgYXVkaW8gc291cmNlLlxuICAgICAgICAgKiAhI3poIOmfs+mikea6kOeahOmfs+mHj++8iDAuMCB+IDEuMO+8ieOAglxuICAgICAgICAgKiBAcHJvcGVydHkgdm9sdW1lXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDFcbiAgICAgICAgICovXG4gICAgICAgIHZvbHVtZToge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZvbHVtZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gbWlzYy5jbGFtcDAxKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLl92b2x1bWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX211dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdWRpby5zZXRWb2x1bWUodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5hdWRpby52b2x1bWUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSXMgdGhlIGF1ZGlvIHNvdXJjZSBtdXRlP1xuICAgICAgICAgKiAhI3poIOaYr+WQpumdmemfs+mfs+mikea6kOOAgk11dGUg5piv6K6+572u6Z+z6YeP5Li6IDDvvIzlj5bmtojpnZnpn7PmmK/mgaLlpI3ljp/mnaXnmoTpn7Pph4/jgIJcbiAgICAgICAgICogQHByb3BlcnR5IG11dGVcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICBtdXRlOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbXV0ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX211dGUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmF1ZGlvLnNldFZvbHVtZSh2YWx1ZSA/IDAgOiB0aGlzLl92b2x1bWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuYXVkaW8ubXV0ZScsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSXMgdGhlIGF1ZGlvIHNvdXJjZSBsb29waW5nP1xuICAgICAgICAgKiAhI3poIOmfs+mikea6kOaYr+WQpuW+queOr+aSreaUvu+8n1xuICAgICAgICAgKiBAcHJvcGVydHkgbG9vcFxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIGxvb3A6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb29wO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9vcCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuYXVkaW8uc2V0TG9vcCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5hdWRpby5sb29wJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIElmIHNldCB0byB0cnVlLCB0aGUgYXVkaW8gc291cmNlIHdpbGwgYXV0b21hdGljYWxseSBzdGFydCBwbGF5aW5nIG9uIG9uRW5hYmxlLlxuICAgICAgICAgKiAhI3poIOWmguaenOiuvue9ruS4uiB0cnVl77yM6Z+z6aKR5rqQ5bCG5ZyoIG9uRW5hYmxlIOaXtuiHquWKqOaSreaUvuOAglxuICAgICAgICAgKiBAcHJvcGVydHkgcGxheU9uTG9hZFxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAgICAgKi9cbiAgICAgICAgcGxheU9uTG9hZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmF1ZGlvLnBsYXlfb25fbG9hZCcsXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIElmIHNldCB0byB0cnVlIGFuZCBBdWRpb0NsaXAgaXMgYSBkZWZlcnJlZCBsb2FkIHJlc291cmNlLCB0aGUgY29tcG9uZW50IHdpbGwgcHJlbG9hZCBBdWRpb0NsaXAgaW4gdGhlIG9uTG9hZCBwaGFzZS5cbiAgICAgICAgICogISN6aCDlpoLmnpzorr7nva7kuLogdHJ1ZSDkuJQgQXVkaW9DbGlwIOS4uuW7tui/n+WKoOi9vei1hOa6kO+8jOe7hOS7tuWwhuWcqCBvbkxvYWQg6Zi25q616aKE5Yqg6L29IEF1ZGlvQ2xpcOOAglxuICAgICAgICAgKiBAcHJvcGVydHkgcHJlbG9hZFxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIHByZWxvYWQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfcGF1c2VkQ2FsbGJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5hdWRpby5nZXRTdGF0ZSgpO1xuICAgICAgICBpZiAoc3RhdGUgPT09IGNjLl9BdWRpby5TdGF0ZS5QTEFZSU5HKSB7XG4gICAgICAgICAgICB0aGlzLmF1ZGlvLnBhdXNlKCk7XG4gICAgICAgICAgICB0aGlzLl9wYXVzZWRGbGFnID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfcmVzdG9yZUNhbGxiYWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9wYXVzZWRGbGFnKSB7XG4gICAgICAgICAgICB0aGlzLmF1ZGlvLnJlc3VtZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3BhdXNlZEZsYWcgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHRoaXMuYXVkaW8uc3JjIGlzIHVuZGVmaW5lZCwgd2hlbiB0aGUgY2xpcCBwcm9wZXJ0eSBpcyBkZXNlcmlhbGl6ZWQgZnJvbSB0aGUgc2NlbmVcbiAgICAgICAgaWYgKCF0aGlzLmF1ZGlvLnNyYykge1xuICAgICAgICAgICAgdGhpcy5hdWRpby5zcmMgPSB0aGlzLl9jbGlwO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnByZWxvYWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2NsaXAuX2Vuc3VyZUxvYWRlZCgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnBsYXlPbkxvYWQgJiYgdGhpcy5fZmlyc3RseUVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZpcnN0bHlFbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgfVxuICAgICAgICBjYy5nYW1lLm9uKGNjLmdhbWUuRVZFTlRfSElERSwgdGhpcy5fcGF1c2VkQ2FsbGJhY2ssIHRoaXMpO1xuICAgICAgICBjYy5nYW1lLm9uKGNjLmdhbWUuRVZFTlRfU0hPVywgdGhpcy5fcmVzdG9yZUNhbGxiYWNrLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICBjYy5nYW1lLm9mZihjYy5nYW1lLkVWRU5UX0hJREUsIHRoaXMuX3BhdXNlZENhbGxiYWNrLCB0aGlzKTtcbiAgICAgICAgY2MuZ2FtZS5vZmYoY2MuZ2FtZS5FVkVOVF9TSE9XLCB0aGlzLl9yZXN0b3JlQ2FsbGJhY2ssIHRoaXMpO1xuICAgIH0sXG5cbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5hdWRpby5kZXN0cm95KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUGxheXMgdGhlIGNsaXAuXG4gICAgICogISN6aCDmkq3mlL7pn7PpopHliarovpHjgIJcbiAgICAgKiBAbWV0aG9kIHBsYXlcbiAgICAgKi9cbiAgICBwbGF5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICggQ0NfRURJVE9SIHx8ICF0aGlzLl9jbGlwICkgcmV0dXJuO1xuXG4gICAgICAgIHZhciBhdWRpbyA9IHRoaXMuYXVkaW87XG4gICAgICAgIGF1ZGlvLnNldFZvbHVtZSh0aGlzLl9tdXRlID8gMCA6IHRoaXMuX3ZvbHVtZSk7XG4gICAgICAgIGF1ZGlvLnNldExvb3AodGhpcy5fbG9vcCk7XG4gICAgICAgIGF1ZGlvLnNldEN1cnJlbnRUaW1lKDApO1xuICAgICAgICBhdWRpby5wbGF5KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU3RvcHMgdGhlIGNsaXAuXG4gICAgICogISN6aCDlgZzmraLlvZPliY3pn7PpopHliarovpHjgIJcbiAgICAgKiBAbWV0aG9kIHN0b3BcbiAgICAgKi9cbiAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYXVkaW8uc3RvcCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBhdXNlIHRoZSBjbGlwLlxuICAgICAqICEjemgg5pqC5YGc5b2T5YmN6Z+z6aKR5Ymq6L6R44CCXG4gICAgICogQG1ldGhvZCBwYXVzZVxuICAgICAqL1xuICAgIHBhdXNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYXVkaW8ucGF1c2UoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXN1bWUgdGhlIGNsaXAuXG4gICAgICogISN6aCDmgaLlpI3mkq3mlL7jgIJcbiAgICAgKiBAbWV0aG9kIHJlc3VtZVxuICAgICAqL1xuICAgIHJlc3VtZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmF1ZGlvLnJlc3VtZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJld2luZCBwbGF5aW5nIG11c2ljLlxuICAgICAqICEjemgg5LuO5aS05byA5aeL5pKt5pS+44CCXG4gICAgICogQG1ldGhvZCByZXdpbmRcbiAgICAgKi9cbiAgICByZXdpbmQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuYXVkaW8uc2V0Q3VycmVudFRpbWUoMCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0IGN1cnJlbnQgdGltZVxuICAgICAqICEjemgg6I635Y+W5b2T5YmN55qE5pKt5pS+5pe26Ze0XG4gICAgICogQG1ldGhvZCBnZXRDdXJyZW50VGltZVxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRDdXJyZW50VGltZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hdWRpby5nZXRDdXJyZW50VGltZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCBjdXJyZW50IHRpbWVcbiAgICAgKiAhI3poIOiuvue9ruW9k+WJjeeahOaSreaUvuaXtumXtFxuICAgICAqIEBtZXRob2Qgc2V0Q3VycmVudFRpbWVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdGltZVxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBzZXRDdXJyZW50VGltZTogZnVuY3Rpb24gKHRpbWUpIHtcbiAgICAgICAgdGhpcy5hdWRpby5zZXRDdXJyZW50VGltZSh0aW1lKTtcbiAgICAgICAgcmV0dXJuIHRpbWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0IGF1ZGlvIGR1cmF0aW9uXG4gICAgICogISN6aCDojrflj5blvZPliY3pn7PpopHnmoTplb/luqZcbiAgICAgKiBAbWV0aG9kIGdldER1cmF0aW9uXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldER1cmF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF1ZGlvLmdldER1cmF0aW9uKCk7XG4gICAgfVxuXG59KTtcblxuY2MuQXVkaW9Tb3VyY2UgPSBtb2R1bGUuZXhwb3J0cyA9IEF1ZGlvU291cmNlO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=