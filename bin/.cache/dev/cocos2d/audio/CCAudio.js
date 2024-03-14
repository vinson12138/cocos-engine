
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/audio/CCAudio.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var EventTarget = require('../core/event/event-target');

var sys = require('../core/platform/CCSys');

var LoadMode = require('../core/assets/CCAudioClip').LoadMode;

var touchBinded = false;
var touchPlayList = [//{ instance: Audio, offset: 0, audio: audio }
];

var Audio = function Audio(src) {
  EventTarget.call(this);
  this._shouldRecycleOnEnded = false;
  this._src = src;
  this._element = null;
  this.id = 0;
  this._state = Audio.State.INITIALZING;
  var self = this;

  this._onended = function () {
    self._state = Audio.State.STOPPED;
    self.emit('ended');
  };

  this._onendedSecond = function () {
    self._unbindEnded(self._onendedSecond);

    self._bindEnded();
  };
};

cc.js.extend(Audio, EventTarget);
/**
 * !#en Audio state.
 * !#zh 声音播放状态
 * @enum audioEngine.AudioState
 * @memberof cc
 */
// TODO - At present, the state is mixed with two states of users and systems, and it is best to split into two types. A "loading" should also be added to the system state.

Audio.State = {
  /**
   * @property {Number} ERROR
   */
  ERROR: -1,

  /**
   * @property {Number} INITIALZING
   */
  INITIALZING: 0,

  /**
   * @property {Number} PLAYING
   */
  PLAYING: 1,

  /**
   * @property {Number} PAUSED
   */
  PAUSED: 2,

  /**
   * @property {Number} STOPPED
   */
  STOPPED: 3
};

(function (proto) {
  proto._bindEnded = function (callback) {
    callback = callback || this._onended;

    if (callback._binded) {
      return;
    }

    callback._binded = true;
    var elem = this._element;

    if (this._src && elem instanceof HTMLAudioElement) {
      elem.addEventListener('ended', callback);
    } else {
      elem.onended = callback;
    }
  };

  proto._unbindEnded = function (callback) {
    callback = callback || this._onended;

    if (!callback._binded) {
      return;
    }

    callback._binded = false;
    var elem = this._element;

    if (elem instanceof HTMLAudioElement) {
      elem.removeEventListener('ended', callback);
    } else if (elem) {
      elem.onended = null;
    }
  };

  proto._onLoaded = function () {
    this._createElement();

    this._state = Audio.State.INITIALZING;
    this.setVolume(1);
    this.setLoop(false);
  };

  proto._createElement = function () {
    var elem = this._src._nativeAsset;

    if (elem instanceof HTMLAudioElement) {
      // Reuse dom audio element
      if (!this._element) {
        this._element = document.createElement('audio');
      }

      this._element.src = elem.src;
    } else {
      this._element = new WebAudioElement(elem, this);
    }
  };

  proto.play = function () {
    var self = this;
    this._src && this._src._ensureLoaded(function () {
      // marked as playing so it will playOnLoad
      self._state = Audio.State.PLAYING; // TODO: move to audio event listeners

      self._bindEnded();

      var playPromise = self._element.play(); // dom audio throws an error if pause audio immediately after playing


      if (window.Promise && playPromise instanceof Promise) {
        playPromise["catch"](function (err) {// do nothing
        });
      }

      self._touchToPlay();
    });
  };

  proto._touchToPlay = function () {
    if (this._src && this._src.loadMode === LoadMode.DOM_AUDIO && this._element.paused) {
      touchPlayList.push({
        instance: this,
        offset: 0,
        audio: this._element
      });
    }

    if (touchBinded) return;
    touchBinded = true;
    var touchEventName = 'ontouchend' in window ? 'touchend' : 'mousedown'; // Listen to the touchstart body event and play the audio when necessary.

    cc.game.canvas.addEventListener(touchEventName, function () {
      var item;

      while (item = touchPlayList.pop()) {
        item.audio.play(item.offset);
      }
    });
  };

  proto.destroy = function () {
    this._element = null;
  };

  proto.pause = function () {
    if (this.getState() !== Audio.State.PLAYING) {
      return;
    }

    var self = this;
    this._src && this._src._ensureLoaded(function () {
      // pause operation may fire 'ended' event
      self._unbindEnded();

      self._element.pause();

      self._state = Audio.State.PAUSED;
    });
  };

  proto.resume = function () {
    if (this.getState() !== Audio.State.PAUSED) {
      return;
    }

    var self = this;
    this._src && this._src._ensureLoaded(function () {
      self._bindEnded();

      self._element.play();

      self._state = Audio.State.PLAYING;
    });
  };

  proto.stop = function () {
    var self = this;
    this._src && this._src._ensureLoaded(function () {
      self._element.pause();

      self._element.currentTime = 0; // remove touchPlayList

      for (var i = 0; i < touchPlayList.length; i++) {
        if (touchPlayList[i].instance === self) {
          touchPlayList.splice(i, 1);
          break;
        }
      }

      self._unbindEnded();

      self.emit('stop');
      self._state = Audio.State.STOPPED;
    });
  };

  proto.setLoop = function (loop) {
    var self = this;
    this._src && this._src._ensureLoaded(function () {
      self._element.loop = loop;
    });
  };

  proto.getLoop = function () {
    return this._element ? this._element.loop : false;
  };

  proto.setVolume = function (num) {
    var self = this;
    this._src && this._src._ensureLoaded(function () {
      self._element.volume = num;
    });
  };

  proto.getVolume = function () {
    return this._element ? this._element.volume : 1;
  };

  proto.setCurrentTime = function (num) {
    var self = this;
    this._src && this._src._ensureLoaded(function () {
      // setCurrentTime would fire 'ended' event
      // so we need to change the callback to rebind ended callback after setCurrentTime
      self._unbindEnded();

      self._bindEnded(self._onendedSecond);

      self._element.currentTime = num;
    });
  };

  proto.getCurrentTime = function () {
    return this._element ? this._element.currentTime : 0;
  };

  proto.getDuration = function () {
    return this._src ? this._src.duration : 0;
  };

  proto.getState = function (forceUpdating) {
    if (forceUpdating === void 0) {
      forceUpdating = true;
    }

    // HACK: in some browser, audio may not fire 'ended' event
    // so we need to force updating the Audio state
    if (forceUpdating) {
      this._forceUpdatingState();
    }

    return this._state;
  };

  proto._forceUpdatingState = function () {
    var elem = this._element;

    if (elem) {
      if (Audio.State.PLAYING === this._state && elem.paused) {
        this._state = Audio.State.STOPPED;
      } else if (Audio.State.STOPPED === this._state && !elem.paused) {
        this._state = Audio.State.PLAYING;
      }
    }
  };

  Object.defineProperty(proto, 'src', {
    get: function get() {
      return this._src;
    },
    set: function set(clip) {
      this._unbindEnded();

      if (clip) {
        if (clip !== this._src) {
          this._src = clip;

          if (!clip.loaded) {
            var self = this; // need to call clip._ensureLoaded mannually to start loading

            clip.once('load', function () {
              // In case set a new src when the old one hasn't finished loading
              if (clip === self._src) {
                self._onLoaded();
              }
            });
          } else {
            this._onLoaded();
          }
        }
      } else {
        this._src = null;

        if (this._element instanceof WebAudioElement) {
          this._element = null;
        } else if (this._element) {
          this._element.src = '';
        }

        this._state = Audio.State.INITIALZING;
      }

      return clip;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, 'paused', {
    get: function get() {
      return this._element ? this._element.paused : true;
    },
    enumerable: true,
    configurable: true
  }); // setFinishCallback
})(Audio.prototype); // TIME_CONSTANT is used as an argument of setTargetAtTime interface
// TIME_CONSTANT need to be a positive number on Edge and Baidu browser
// TIME_CONSTANT need to be 0 by default, or may fail to set volume at the very beginning of playing audio


var TIME_CONSTANT;

if (cc.sys.browserType === cc.sys.BROWSER_TYPE_EDGE || cc.sys.browserType === cc.sys.BROWSER_TYPE_BAIDU || cc.sys.browserType === cc.sys.BROWSER_TYPE_UC) {
  TIME_CONSTANT = 0.01;
} else {
  TIME_CONSTANT = 0;
} // Encapsulated WebAudio interface


var WebAudioElement = function WebAudioElement(buffer, audio) {
  this._audio = audio;
  this._context = sys.__audioSupport.context;
  this._buffer = buffer;
  this._gainObj = this._context['createGain']();
  this.volume = 1;

  this._gainObj['connect'](this._context['destination']);

  this._loop = false; // The time stamp on the audio time axis when the recording begins to play.

  this._startTime = -1; // Record the currently playing 'Source'

  this._currentSource = null; // Record the time has been played

  this.playedLength = 0;
  this._currentTimer = null;

  this._endCallback = function () {
    if (this.onended) {
      this.onended(this);
    }
  }.bind(this);
};

(function (proto) {
  proto.play = function (offset) {
    // If repeat play, you need to stop before an audio
    if (this._currentSource && !this.paused) {
      this._currentSource.onended = null;

      this._currentSource.stop(0);

      this.playedLength = 0;
    }

    var audio = this._context["createBufferSource"]();

    audio.buffer = this._buffer;
    audio["connect"](this._gainObj);
    audio.loop = this._loop;
    this._startTime = this._context.currentTime;
    offset = offset || this.playedLength;

    if (offset) {
      this._startTime -= offset;
    }

    var duration = this._buffer.duration;
    var startTime = offset;
    var endTime;

    if (this._loop) {
      if (audio.start) audio.start(0, startTime);else if (audio["notoGrainOn"]) audio["noteGrainOn"](0, startTime);else audio["noteOn"](0, startTime);
    } else {
      endTime = duration - offset;
      if (audio.start) audio.start(0, startTime, endTime);else if (audio["noteGrainOn"]) audio["noteGrainOn"](0, startTime, endTime);else audio["noteOn"](0, startTime, endTime);
    }

    this._currentSource = audio;
    audio.onended = this._endCallback; // If the current audio context time stamp is 0 and audio context state is suspended
    // There may be a need to touch events before you can actually start playing audio

    if ((!audio.context.state || audio.context.state === "suspended") && this._context.currentTime === 0) {
      var self = this;
      clearTimeout(this._currentTimer);
      this._currentTimer = setTimeout(function () {
        if (self._context.currentTime === 0) {
          touchPlayList.push({
            instance: self._audio,
            offset: offset,
            audio: self
          });
        }
      }, 10);
    }

    var sys = cc.sys;

    if (sys.os === sys.OS_IOS && sys.isBrowser && sys.isMobile) {
      // Audio context is suspended when you unplug the earphones,
      // and is interrupted when the app enters background.
      // Both make the audioBufferSource unplayable.
      if (audio.context.state === "suspended" && this._context.currentTime !== 0 || audio.context.state === 'interrupted') {
        // reference: https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/resume
        audio.context.resume();
      }
    }
  };

  proto.pause = function () {
    clearTimeout(this._currentTimer);
    if (this.paused) return; // Record the time the current has been played

    this.playedLength = this._context.currentTime - this._startTime; // If more than the duration of the audio, Need to take the remainder

    this.playedLength %= this._buffer.duration;
    var audio = this._currentSource;

    if (audio) {
      if (audio.onended) {
        audio.onended._binded = false;
        audio.onended = null;
      }

      audio.stop(0);
    }

    this._currentSource = null;
    this._startTime = -1;
  };

  Object.defineProperty(proto, 'paused', {
    get: function get() {
      // If the current audio is a loop, paused is false
      if (this._currentSource && this._currentSource.loop) return false; // startTime default is -1

      if (this._startTime === -1) return true; // Current time -  Start playing time > Audio duration

      return this._context.currentTime - this._startTime > this._buffer.duration;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, 'loop', {
    get: function get() {
      return this._loop;
    },
    set: function set(bool) {
      if (this._currentSource) this._currentSource.loop = bool;
      return this._loop = bool;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, 'volume', {
    get: function get() {
      return this._volume;
    },
    set: function set(num) {
      this._volume = num; // https://www.chromestatus.com/features/5287995770929152

      if (this._gainObj.gain.setTargetAtTime) {
        try {
          this._gainObj.gain.setTargetAtTime(num, this._context.currentTime, TIME_CONSTANT);
        } catch (e) {
          // Some other unknown browsers may crash if TIME_CONSTANT is 0
          this._gainObj.gain.setTargetAtTime(num, this._context.currentTime, 0.01);
        }
      } else {
        this._gainObj.gain.value = num;
      }

      if (sys.os === sys.OS_IOS && !this.paused && this._currentSource) {
        // IOS must be stop webAudio
        this._currentSource.onended = null;
        this.pause();
        this.play();
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, 'currentTime', {
    get: function get() {
      if (this.paused) {
        return this.playedLength;
      } // Record the time the current has been played


      this.playedLength = this._context.currentTime - this._startTime; // If more than the duration of the audio, Need to take the remainder

      this.playedLength %= this._buffer.duration;
      return this.playedLength;
    },
    set: function set(num) {
      if (!this.paused) {
        this.pause();
        this.playedLength = num;
        this.play();
      } else {
        this.playedLength = num;
      }

      return num;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, 'duration', {
    get: function get() {
      return this._buffer.duration;
    },
    enumerable: true,
    configurable: true
  });
})(WebAudioElement.prototype);

module.exports = cc._Audio = Audio;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9hdWRpby9DQ0F1ZGlvLmpzIl0sIm5hbWVzIjpbIkV2ZW50VGFyZ2V0IiwicmVxdWlyZSIsInN5cyIsIkxvYWRNb2RlIiwidG91Y2hCaW5kZWQiLCJ0b3VjaFBsYXlMaXN0IiwiQXVkaW8iLCJzcmMiLCJjYWxsIiwiX3Nob3VsZFJlY3ljbGVPbkVuZGVkIiwiX3NyYyIsIl9lbGVtZW50IiwiaWQiLCJfc3RhdGUiLCJTdGF0ZSIsIklOSVRJQUxaSU5HIiwic2VsZiIsIl9vbmVuZGVkIiwiU1RPUFBFRCIsImVtaXQiLCJfb25lbmRlZFNlY29uZCIsIl91bmJpbmRFbmRlZCIsIl9iaW5kRW5kZWQiLCJjYyIsImpzIiwiZXh0ZW5kIiwiRVJST1IiLCJQTEFZSU5HIiwiUEFVU0VEIiwicHJvdG8iLCJjYWxsYmFjayIsIl9iaW5kZWQiLCJlbGVtIiwiSFRNTEF1ZGlvRWxlbWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJvbmVuZGVkIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIl9vbkxvYWRlZCIsIl9jcmVhdGVFbGVtZW50Iiwic2V0Vm9sdW1lIiwic2V0TG9vcCIsIl9uYXRpdmVBc3NldCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIldlYkF1ZGlvRWxlbWVudCIsInBsYXkiLCJfZW5zdXJlTG9hZGVkIiwicGxheVByb21pc2UiLCJ3aW5kb3ciLCJQcm9taXNlIiwiZXJyIiwiX3RvdWNoVG9QbGF5IiwibG9hZE1vZGUiLCJET01fQVVESU8iLCJwYXVzZWQiLCJwdXNoIiwiaW5zdGFuY2UiLCJvZmZzZXQiLCJhdWRpbyIsInRvdWNoRXZlbnROYW1lIiwiZ2FtZSIsImNhbnZhcyIsIml0ZW0iLCJwb3AiLCJkZXN0cm95IiwicGF1c2UiLCJnZXRTdGF0ZSIsInJlc3VtZSIsInN0b3AiLCJjdXJyZW50VGltZSIsImkiLCJsZW5ndGgiLCJzcGxpY2UiLCJsb29wIiwiZ2V0TG9vcCIsIm51bSIsInZvbHVtZSIsImdldFZvbHVtZSIsInNldEN1cnJlbnRUaW1lIiwiZ2V0Q3VycmVudFRpbWUiLCJnZXREdXJhdGlvbiIsImR1cmF0aW9uIiwiZm9yY2VVcGRhdGluZyIsIl9mb3JjZVVwZGF0aW5nU3RhdGUiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsInNldCIsImNsaXAiLCJsb2FkZWQiLCJvbmNlIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsInByb3RvdHlwZSIsIlRJTUVfQ09OU1RBTlQiLCJicm93c2VyVHlwZSIsIkJST1dTRVJfVFlQRV9FREdFIiwiQlJPV1NFUl9UWVBFX0JBSURVIiwiQlJPV1NFUl9UWVBFX1VDIiwiYnVmZmVyIiwiX2F1ZGlvIiwiX2NvbnRleHQiLCJfX2F1ZGlvU3VwcG9ydCIsImNvbnRleHQiLCJfYnVmZmVyIiwiX2dhaW5PYmoiLCJfbG9vcCIsIl9zdGFydFRpbWUiLCJfY3VycmVudFNvdXJjZSIsInBsYXllZExlbmd0aCIsIl9jdXJyZW50VGltZXIiLCJfZW5kQ2FsbGJhY2siLCJiaW5kIiwic3RhcnRUaW1lIiwiZW5kVGltZSIsInN0YXJ0Iiwic3RhdGUiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0Iiwib3MiLCJPU19JT1MiLCJpc0Jyb3dzZXIiLCJpc01vYmlsZSIsImJvb2wiLCJfdm9sdW1lIiwiZ2FpbiIsInNldFRhcmdldEF0VGltZSIsImUiLCJ2YWx1ZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJfQXVkaW8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsV0FBVyxHQUFHQyxPQUFPLENBQUMsNEJBQUQsQ0FBM0I7O0FBQ0EsSUFBTUMsR0FBRyxHQUFHRCxPQUFPLENBQUMsd0JBQUQsQ0FBbkI7O0FBQ0EsSUFBTUUsUUFB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S0EsWUFBTCxHQUFvQixLQUFLUixRQUFMLENBQWNoQyxXQUFkLEdBQTRCLEtBQUtzQyxVQUFyRCxDQUxhLENBTWI7O0FBQ0EsV0FBS0UsWUFBTCxJQUFxQixLQUFLTCxPQUFMLENBQWF2QixRQUFsQztBQUNBLGFBQU8sS0FBSzRCLFlBQVo7QUFDSCxLQVZ1QztBQVd4Q3RCLElBQUFBLEdBQUcsRUFBRSxhQUFVWixHQUFWLEVBQWU7QUFDaEIsVUFBSSxDQUFDLEtBQUtyQixNQUFWLEVBQWtCO0FBQ2QsYUFBS1csS0FBTDtBQUNBLGFBQUs0QyxZQUFMLEdBQW9CbEMsR0FBcEI7QUFDQSxhQUFLOUIsSUFBTDtBQUNILE9BSkQsTUFJTztBQUNILGFBQUtnRSxZQUFMLEdBQW9CbEMsR0FBcEI7QUFDSDs7QUFDRCxhQUFPQSxHQUFQO0FBQ0gsS0FwQnVDO0FBcUJ4Q2dCLElBQUFBLFVBQVUsRUFBRSxJQXJCNEI7QUFzQnhDQyxJQUFBQSxZQUFZLEVBQUU7QUF0QjBCLEdBQTVDO0FBeUJBUixFQUFBQSxNQUFNLENBQUNDLGNBQVAsQ0FBc0J4RCxLQUF0QixFQUE2QixVQUE3QixFQUF5QztBQUNyQ3lELElBQUFBLEdBQUcsRUFBRSxlQUFZO0FBQ2IsYUFBTyxLQUFLa0IsT0FBTCxDQUFhdkIsUUFBcEI7QUFDSCxLQUhvQztBQUlyQ1UsSUFBQUEsVUFBVSxFQUFFLElBSnlCO0FBS3JDQyxJQUFBQSxZQUFZLEVBQUU7QUFMdUIsR0FBekM7QUFRSCxDQTVMRCxFQTRMR2hELGVBQWUsQ0FBQ2lELFNBNUxuQjs7QUE4TEFvQyxNQUFNLENBQUNDLE9BQVAsR0FBaUIzRyxFQUFFLENBQUM0RyxNQUFILEdBQVk3SCxLQUE3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDA4LTIwMTAgUmljYXJkbyBRdWVzYWRhXG4gQ29weXJpZ2h0IChjKSAyMDExLTIwMTIgY29jb3MyZC14Lm9yZ1xuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZ1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3QgRXZlbnRUYXJnZXQgPSByZXF1aXJlKCcuLi9jb3JlL2V2ZW50L2V2ZW50LXRhcmdldCcpO1xuY29uc3Qgc3lzID0gcmVxdWlyZSgnLi4vY29yZS9wbGF0Zm9ybS9DQ1N5cycpO1xuY29uc3QgTG9hZE1vZGUgPSByZXF1aXJlKCcuLi9jb3JlL2Fzc2V0cy9DQ0F1ZGlvQ2xpcCcpLkxvYWRNb2RlO1xuXG5sZXQgdG91Y2hCaW5kZWQgPSBmYWxzZTtcbmxldCB0b3VjaFBsYXlMaXN0ID0gW1xuICAgIC8veyBpbnN0YW5jZTogQXVkaW8sIG9mZnNldDogMCwgYXVkaW86IGF1ZGlvIH1cbl07XG5cbmxldCBBdWRpbyA9IGZ1bmN0aW9uIChzcmMpIHtcbiAgICBFdmVudFRhcmdldC5jYWxsKHRoaXMpO1xuICAgIHRoaXMuX3Nob3VsZFJlY3ljbGVPbkVuZGVkID0gZmFsc2U7XG4gICAgdGhpcy5fc3JjID0gc3JjO1xuICAgIHRoaXMuX2VsZW1lbnQgPSBudWxsO1xuICAgIHRoaXMuaWQgPSAwO1xuICAgIHRoaXMuX3N0YXRlID0gQXVkaW8uU3RhdGUuSU5JVElBTFpJTkc7XG5cbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICB0aGlzLl9vbmVuZGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLl9zdGF0ZSA9IEF1ZGlvLlN0YXRlLlNUT1BQRUQ7XG4gICAgICAgIHNlbGYuZW1pdCgnZW5kZWQnKTtcbiAgICB9O1xuICAgIHRoaXMuX29uZW5kZWRTZWNvbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuX3VuYmluZEVuZGVkKHNlbGYuX29uZW5kZWRTZWNvbmQpO1xuICAgICAgICBzZWxmLl9iaW5kRW5kZWQoKTtcbiAgICB9O1xufTtcblxuY2MuanMuZXh0ZW5kKEF1ZGlvLCBFdmVudFRhcmdldCk7XG5cbi8qKlxuICogISNlbiBBdWRpbyBzdGF0ZS5cbiAqICEjemgg5aOw6Z+z5pKt5pS+54q25oCBXG4gKiBAZW51bSBhdWRpb0VuZ2luZS5BdWRpb1N0YXRlXG4gKiBAbWVtYmVyb2YgY2NcbiAqL1xuLy8gVE9ETyAtIEF0IHByZXNlbnQsIHRoZSBzdGF0ZSBpcyBtaXhlZCB3aXRoIHR3byBzdGF0ZXMgb2YgdXNlcnMgYW5kIHN5c3RlbXMsIGFuZCBpdCBpcyBiZXN0IHRvIHNwbGl0IGludG8gdHdvIHR5cGVzLiBBIFwibG9hZGluZ1wiIHNob3VsZCBhbHNvIGJlIGFkZGVkIHRvIHRoZSBzeXN0ZW0gc3RhdGUuXG5BdWRpby5TdGF0ZSA9IHtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gRVJST1JcbiAgICAgKi9cbiAgICBFUlJPUjogLTEsXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IElOSVRJQUxaSU5HXG4gICAgICovXG4gICAgSU5JVElBTFpJTkc6IDAsXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFBMQVlJTkdcbiAgICAgKi9cbiAgICBQTEFZSU5HOiAxLFxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBQQVVTRURcbiAgICAgKi9cbiAgICBQQVVTRUQ6IDIsXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFNUT1BQRURcbiAgICAgKi9cbiAgICBTVE9QUEVEOiAzLFxufTtcblxuKGZ1bmN0aW9uIChwcm90bykge1xuXG4gICAgcHJvdG8uX2JpbmRFbmRlZCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IHRoaXMuX29uZW5kZWQ7XG4gICAgICAgIGlmIChjYWxsYmFjay5fYmluZGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2suX2JpbmRlZCA9IHRydWU7XG5cbiAgICAgICAgbGV0IGVsZW0gPSB0aGlzLl9lbGVtZW50O1xuICAgICAgICBpZiAodGhpcy5fc3JjICYmIChlbGVtIGluc3RhbmNlb2YgSFRNTEF1ZGlvRWxlbWVudCkpIHtcbiAgICAgICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCBjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGVtLm9uZW5kZWQgPSBjYWxsYmFjaztcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwcm90by5fdW5iaW5kRW5kZWQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCB0aGlzLl9vbmVuZGVkO1xuICAgICAgICBpZiAoIWNhbGxiYWNrLl9iaW5kZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjYWxsYmFjay5fYmluZGVkID0gZmFsc2U7XG5cbiAgICAgICAgbGV0IGVsZW0gPSB0aGlzLl9lbGVtZW50O1xuICAgICAgICBpZiAoZWxlbSBpbnN0YW5jZW9mIEhUTUxBdWRpb0VsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignZW5kZWQnLCBjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbSkge1xuICAgICAgICAgICAgZWxlbS5vbmVuZGVkID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwcm90by5fb25Mb2FkZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2NyZWF0ZUVsZW1lbnQoKTtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBBdWRpby5TdGF0ZS5JTklUSUFMWklORztcbiAgICAgICAgdGhpcy5zZXRWb2x1bWUoMSk7XG4gICAgICAgIHRoaXMuc2V0TG9vcChmYWxzZSk7XG4gICAgfTtcblxuICAgIHByb3RvLl9jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgZWxlbSA9IHRoaXMuX3NyYy5fbmF0aXZlQXNzZXQ7XG4gICAgICAgIGlmIChlbGVtIGluc3RhbmNlb2YgSFRNTEF1ZGlvRWxlbWVudCkge1xuICAgICAgICAgICAgLy8gUmV1c2UgZG9tIGF1ZGlvIGVsZW1lbnRcbiAgICAgICAgICAgIGlmICghdGhpcy5fZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zcmMgPSBlbGVtLnNyYztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQgPSBuZXcgV2ViQXVkaW9FbGVtZW50KGVsZW0sIHRoaXMpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHByb3RvLnBsYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5fc3JjICYmIHRoaXMuX3NyYy5fZW5zdXJlTG9hZGVkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIG1hcmtlZCBhcyBwbGF5aW5nIHNvIGl0IHdpbGwgcGxheU9uTG9hZFxuICAgICAgICAgICAgc2VsZi5fc3RhdGUgPSBBdWRpby5TdGF0ZS5QTEFZSU5HO1xuICAgICAgICAgICAgLy8gVE9ETzogbW92ZSB0byBhdWRpbyBldmVudCBsaXN0ZW5lcnNcbiAgICAgICAgICAgIHNlbGYuX2JpbmRFbmRlZCgpO1xuICAgICAgICAgICAgbGV0IHBsYXlQcm9taXNlID0gc2VsZi5fZWxlbWVudC5wbGF5KCk7XG4gICAgICAgICAgICAvLyBkb20gYXVkaW8gdGhyb3dzIGFuIGVycm9yIGlmIHBhdXNlIGF1ZGlvIGltbWVkaWF0ZWx5IGFmdGVyIHBsYXlpbmdcbiAgICAgICAgICAgIGlmICh3aW5kb3cuUHJvbWlzZSAmJiBwbGF5UHJvbWlzZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICBwbGF5UHJvbWlzZS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuX3RvdWNoVG9QbGF5KCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwcm90by5fdG91Y2hUb1BsYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9zcmMgJiYgdGhpcy5fc3JjLmxvYWRNb2RlID09PSBMb2FkTW9kZS5ET01fQVVESU8gJiZcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQucGF1c2VkKSB7XG4gICAgICAgICAgICB0b3VjaFBsYXlMaXN0LnB1c2goeyBpbnN0YW5jZTogdGhpcywgb2Zmc2V0OiAwLCBhdWRpbzogdGhpcy5fZWxlbWVudCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b3VjaEJpbmRlZCkgcmV0dXJuO1xuICAgICAgICB0b3VjaEJpbmRlZCA9IHRydWU7XG5cbiAgICAgICAgbGV0IHRvdWNoRXZlbnROYW1lID0gKCdvbnRvdWNoZW5kJyBpbiB3aW5kb3cpID8gJ3RvdWNoZW5kJyA6ICdtb3VzZWRvd24nO1xuICAgICAgICAvLyBMaXN0ZW4gdG8gdGhlIHRvdWNoc3RhcnQgYm9keSBldmVudCBhbmQgcGxheSB0aGUgYXVkaW8gd2hlbiBuZWNlc3NhcnkuXG4gICAgICAgIGNjLmdhbWUuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIodG91Y2hFdmVudE5hbWUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCBpdGVtO1xuICAgICAgICAgICAgd2hpbGUgKGl0ZW0gPSB0b3VjaFBsYXlMaXN0LnBvcCgpKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5hdWRpby5wbGF5KGl0ZW0ub2Zmc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHByb3RvLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBudWxsO1xuICAgIH07XG5cbiAgICBwcm90by5wYXVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0U3RhdGUoKSAhPT0gQXVkaW8uU3RhdGUuUExBWUlORykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5fc3JjICYmIHRoaXMuX3NyYy5fZW5zdXJlTG9hZGVkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHBhdXNlIG9wZXJhdGlvbiBtYXkgZmlyZSAnZW5kZWQnIGV2ZW50XG4gICAgICAgICAgICBzZWxmLl91bmJpbmRFbmRlZCgpO1xuICAgICAgICAgICAgc2VsZi5fZWxlbWVudC5wYXVzZSgpO1xuICAgICAgICAgICAgc2VsZi5fc3RhdGUgPSBBdWRpby5TdGF0ZS5QQVVTRUQ7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwcm90by5yZXN1bWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmdldFN0YXRlKCkgIT09IEF1ZGlvLlN0YXRlLlBBVVNFRCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5fc3JjICYmIHRoaXMuX3NyYy5fZW5zdXJlTG9hZGVkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYuX2JpbmRFbmRlZCgpO1xuICAgICAgICAgICAgc2VsZi5fZWxlbWVudC5wbGF5KCk7XG4gICAgICAgICAgICBzZWxmLl9zdGF0ZSA9IEF1ZGlvLlN0YXRlLlBMQVlJTkc7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwcm90by5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuX3NyYyAmJiB0aGlzLl9zcmMuX2Vuc3VyZUxvYWRlZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLl9lbGVtZW50LnBhdXNlKCk7XG4gICAgICAgICAgICBzZWxmLl9lbGVtZW50LmN1cnJlbnRUaW1lID0gMDtcbiAgICAgICAgICAgIC8vIHJlbW92ZSB0b3VjaFBsYXlMaXN0XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdWNoUGxheUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodG91Y2hQbGF5TGlzdFtpXS5pbnN0YW5jZSA9PT0gc2VsZikge1xuICAgICAgICAgICAgICAgICAgICB0b3VjaFBsYXlMaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5fdW5iaW5kRW5kZWQoKTtcbiAgICAgICAgICAgIHNlbGYuZW1pdCgnc3RvcCcpO1xuICAgICAgICAgICAgc2VsZi5fc3RhdGUgPSBBdWRpby5TdGF0ZS5TVE9QUEVEO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHJvdG8uc2V0TG9vcCA9IGZ1bmN0aW9uIChsb29wKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5fc3JjICYmIHRoaXMuX3NyYy5fZW5zdXJlTG9hZGVkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYuX2VsZW1lbnQubG9vcCA9IGxvb3A7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcHJvdG8uZ2V0TG9vcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQgPyB0aGlzLl9lbGVtZW50Lmxvb3AgOiBmYWxzZTtcbiAgICB9O1xuXG4gICAgcHJvdG8uc2V0Vm9sdW1lID0gZnVuY3Rpb24gKG51bSkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuX3NyYyAmJiB0aGlzLl9zcmMuX2Vuc3VyZUxvYWRlZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLl9lbGVtZW50LnZvbHVtZSA9IG51bTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBwcm90by5nZXRWb2x1bWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50ID8gdGhpcy5fZWxlbWVudC52b2x1bWUgOiAxO1xuICAgIH07XG5cbiAgICBwcm90by5zZXRDdXJyZW50VGltZSA9IGZ1bmN0aW9uIChudW0pIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLl9zcmMgJiYgdGhpcy5fc3JjLl9lbnN1cmVMb2FkZWQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gc2V0Q3VycmVudFRpbWUgd291bGQgZmlyZSAnZW5kZWQnIGV2ZW50XG4gICAgICAgICAgICAvLyBzbyB3ZSBuZWVkIHRvIGNoYW5nZSB0aGUgY2FsbGJhY2sgdG8gcmViaW5kIGVuZGVkIGNhbGxiYWNrIGFmdGVyIHNldEN1cnJlbnRUaW1lXG4gICAgICAgICAgICBzZWxmLl91bmJpbmRFbmRlZCgpO1xuICAgICAgICAgICAgc2VsZi5fYmluZEVuZGVkKHNlbGYuX29uZW5kZWRTZWNvbmQpO1xuICAgICAgICAgICAgc2VsZi5fZWxlbWVudC5jdXJyZW50VGltZSA9IG51bTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHByb3RvLmdldEN1cnJlbnRUaW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudCA/IHRoaXMuX2VsZW1lbnQuY3VycmVudFRpbWUgOiAwO1xuICAgIH07XG5cbiAgICBwcm90by5nZXREdXJhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NyYyA/IHRoaXMuX3NyYy5kdXJhdGlvbiA6IDA7XG4gICAgfTtcblxuICAgIHByb3RvLmdldFN0YXRlID0gZnVuY3Rpb24gKGZvcmNlVXBkYXRpbmcgPSB0cnVlKSB7XG4gICAgICAgIC8vIEhBQ0s6IGluIHNvbWUgYnJvd3NlciwgYXVkaW8gbWF5IG5vdCBmaXJlICdlbmRlZCcgZXZlbnRcbiAgICAgICAgLy8gc28gd2UgbmVlZCB0byBmb3JjZSB1cGRhdGluZyB0aGUgQXVkaW8gc3RhdGVcbiAgICAgICAgaWYgKGZvcmNlVXBkYXRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmNlVXBkYXRpbmdTdGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgICB9O1xuXG4gICAgcHJvdG8uX2ZvcmNlVXBkYXRpbmdTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IGVsZW0gPSB0aGlzLl9lbGVtZW50O1xuICAgICAgICBpZiAoZWxlbSkge1xuICAgICAgICAgICAgaWYgKEF1ZGlvLlN0YXRlLlBMQVlJTkcgPT09IHRoaXMuX3N0YXRlICYmIGVsZW0ucGF1c2VkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBBdWRpby5TdGF0ZS5TVE9QUEVEO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoQXVkaW8uU3RhdGUuU1RPUFBFRCA9PT0gdGhpcy5fc3RhdGUgJiYgIWVsZW0ucGF1c2VkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBBdWRpby5TdGF0ZS5QTEFZSU5HO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90bywgJ3NyYycsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3JjO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChjbGlwKSB7XG4gICAgICAgICAgICB0aGlzLl91bmJpbmRFbmRlZCgpO1xuICAgICAgICAgICAgaWYgKGNsaXApIHtcbiAgICAgICAgICAgICAgICBpZiAoY2xpcCAhPT0gdGhpcy5fc3JjKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NyYyA9IGNsaXA7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY2xpcC5sb2FkZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5lZWQgdG8gY2FsbCBjbGlwLl9lbnN1cmVMb2FkZWQgbWFubnVhbGx5IHRvIHN0YXJ0IGxvYWRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaXAub25jZSgnbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJbiBjYXNlIHNldCBhIG5ldyBzcmMgd2hlbiB0aGUgb2xkIG9uZSBoYXNuJ3QgZmluaXNoZWQgbG9hZGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjbGlwID09PSBzZWxmLl9zcmMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5fb25Mb2FkZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX29uTG9hZGVkKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zcmMgPSBudWxsO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9lbGVtZW50IGluc3RhbmNlb2YgV2ViQXVkaW9FbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9lbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3JjID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gQXVkaW8uU3RhdGUuSU5JVElBTFpJTkc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2xpcDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG8sICdwYXVzZWQnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQgPyB0aGlzLl9lbGVtZW50LnBhdXNlZCA6IHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuXG4gICAgLy8gc2V0RmluaXNoQ2FsbGJhY2tcblxufSkoQXVkaW8ucHJvdG90eXBlKTtcblxuXG4vLyBUSU1FX0NPTlNUQU5UIGlzIHVzZWQgYXMgYW4gYXJndW1lbnQgb2Ygc2V0VGFyZ2V0QXRUaW1lIGludGVyZmFjZVxuLy8gVElNRV9DT05TVEFOVCBuZWVkIHRvIGJlIGEgcG9zaXRpdmUgbnVtYmVyIG9uIEVkZ2UgYW5kIEJhaWR1IGJyb3dzZXJcbi8vIFRJTUVfQ09OU1RBTlQgbmVlZCB0byBiZSAwIGJ5IGRlZmF1bHQsIG9yIG1heSBmYWlsIHRvIHNldCB2b2x1bWUgYXQgdGhlIHZlcnkgYmVnaW5uaW5nIG9mIHBsYXlpbmcgYXVkaW9cbmxldCBUSU1FX0NPTlNUQU5UO1xuaWYgKGNjLnN5cy5icm93c2VyVHlwZSA9PT0gY2Muc3lzLkJST1dTRVJfVFlQRV9FREdFIHx8XG4gICAgY2Muc3lzLmJyb3dzZXJUeXBlID09PSBjYy5zeXMuQlJPV1NFUl9UWVBFX0JBSURVIHx8XG4gICAgY2Muc3lzLmJyb3dzZXJUeXBlID09PSBjYy5zeXMuQlJPV1NFUl9UWVBFX1VDKSB7XG4gICAgVElNRV9DT05TVEFOVCA9IDAuMDE7XG59XG5lbHNlIHtcbiAgICBUSU1FX0NPTlNUQU5UID0gMDtcbn1cblxuLy8gRW5jYXBzdWxhdGVkIFdlYkF1ZGlvIGludGVyZmFjZVxubGV0IFdlYkF1ZGlvRWxlbWVudCA9IGZ1bmN0aW9uIChidWZmZXIsIGF1ZGlvKSB7XG4gICAgdGhpcy5fYXVkaW8gPSBhdWRpbztcbiAgICB0aGlzLl9jb250ZXh0ID0gc3lzLl9fYXVkaW9TdXBwb3J0LmNvbnRleHQ7XG4gICAgdGhpcy5fYnVmZmVyID0gYnVmZmVyO1xuXG4gICAgdGhpcy5fZ2Fpbk9iaiA9IHRoaXMuX2NvbnRleHRbJ2NyZWF0ZUdhaW4nXSgpO1xuICAgIHRoaXMudm9sdW1lID0gMTtcblxuICAgIHRoaXMuX2dhaW5PYmpbJ2Nvbm5lY3QnXSh0aGlzLl9jb250ZXh0WydkZXN0aW5hdGlvbiddKTtcbiAgICB0aGlzLl9sb29wID0gZmFsc2U7XG4gICAgLy8gVGhlIHRpbWUgc3RhbXAgb24gdGhlIGF1ZGlvIHRpbWUgYXhpcyB3aGVuIHRoZSByZWNvcmRpbmcgYmVnaW5zIHRvIHBsYXkuXG4gICAgdGhpcy5fc3RhcnRUaW1lID0gLTE7XG4gICAgLy8gUmVjb3JkIHRoZSBjdXJyZW50bHkgcGxheWluZyAnU291cmNlJ1xuICAgIHRoaXMuX2N1cnJlbnRTb3VyY2UgPSBudWxsO1xuICAgIC8vIFJlY29yZCB0aGUgdGltZSBoYXMgYmVlbiBwbGF5ZWRcbiAgICB0aGlzLnBsYXllZExlbmd0aCA9IDA7XG5cbiAgICB0aGlzLl9jdXJyZW50VGltZXIgPSBudWxsO1xuXG4gICAgdGhpcy5fZW5kQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLm9uZW5kZWQpIHtcbiAgICAgICAgICAgIHRoaXMub25lbmRlZCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH0uYmluZCh0aGlzKTtcbn07XG5cbihmdW5jdGlvbiAocHJvdG8pIHtcbiAgICBwcm90by5wbGF5ID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICAgICAgICAvLyBJZiByZXBlYXQgcGxheSwgeW91IG5lZWQgdG8gc3RvcCBiZWZvcmUgYW4gYXVkaW9cbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRTb3VyY2UgJiYgIXRoaXMucGF1c2VkKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50U291cmNlLm9uZW5kZWQgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFNvdXJjZS5zdG9wKDApO1xuICAgICAgICAgICAgdGhpcy5wbGF5ZWRMZW5ndGggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGF1ZGlvID0gdGhpcy5fY29udGV4dFtcImNyZWF0ZUJ1ZmZlclNvdXJjZVwiXSgpO1xuICAgICAgICBhdWRpby5idWZmZXIgPSB0aGlzLl9idWZmZXI7XG4gICAgICAgIGF1ZGlvW1wiY29ubmVjdFwiXSh0aGlzLl9nYWluT2JqKTtcbiAgICAgICAgYXVkaW8ubG9vcCA9IHRoaXMuX2xvb3A7XG5cbiAgICAgICAgdGhpcy5fc3RhcnRUaW1lID0gdGhpcy5fY29udGV4dC5jdXJyZW50VGltZTtcbiAgICAgICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IHRoaXMucGxheWVkTGVuZ3RoO1xuICAgICAgICBpZiAob2Zmc2V0KSB7XG4gICAgICAgICAgICB0aGlzLl9zdGFydFRpbWUgLT0gb2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIGxldCBkdXJhdGlvbiA9IHRoaXMuX2J1ZmZlci5kdXJhdGlvbjtcblxuICAgICAgICBsZXQgc3RhcnRUaW1lID0gb2Zmc2V0O1xuICAgICAgICBsZXQgZW5kVGltZTtcbiAgICAgICAgaWYgKHRoaXMuX2xvb3ApIHtcbiAgICAgICAgICAgIGlmIChhdWRpby5zdGFydClcbiAgICAgICAgICAgICAgICBhdWRpby5zdGFydCgwLCBzdGFydFRpbWUpO1xuICAgICAgICAgICAgZWxzZSBpZiAoYXVkaW9bXCJub3RvR3JhaW5PblwiXSlcbiAgICAgICAgICAgICAgICBhdWRpb1tcIm5vdGVHcmFpbk9uXCJdKDAsIHN0YXJ0VGltZSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYXVkaW9bXCJub3RlT25cIl0oMCwgc3RhcnRUaW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVuZFRpbWUgPSBkdXJhdGlvbiAtIG9mZnNldDtcbiAgICAgICAgICAgIGlmIChhdWRpby5zdGFydClcbiAgICAgICAgICAgICAgICBhdWRpby5zdGFydCgwLCBzdGFydFRpbWUsIGVuZFRpbWUpO1xuICAgICAgICAgICAgZWxzZSBpZiAoYXVkaW9bXCJub3RlR3JhaW5PblwiXSlcbiAgICAgICAgICAgICAgICBhdWRpb1tcIm5vdGVHcmFpbk9uXCJdKDAsIHN0YXJ0VGltZSwgZW5kVGltZSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYXVkaW9bXCJub3RlT25cIl0oMCwgc3RhcnRUaW1lLCBlbmRUaW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2N1cnJlbnRTb3VyY2UgPSBhdWRpbztcblxuICAgICAgICBhdWRpby5vbmVuZGVkID0gdGhpcy5fZW5kQ2FsbGJhY2s7XG5cbiAgICAgICAgLy8gSWYgdGhlIGN1cnJlbnQgYXVkaW8gY29udGV4dCB0aW1lIHN0YW1wIGlzIDAgYW5kIGF1ZGlvIGNvbnRleHQgc3RhdGUgaXMgc3VzcGVuZGVkXG4gICAgICAgIC8vIFRoZXJlIG1heSBiZSBhIG5lZWQgdG8gdG91Y2ggZXZlbnRzIGJlZm9yZSB5b3UgY2FuIGFjdHVhbGx5IHN0YXJ0IHBsYXlpbmcgYXVkaW9cbiAgICAgICAgaWYgKCghYXVkaW8uY29udGV4dC5zdGF0ZSB8fCBhdWRpby5jb250ZXh0LnN0YXRlID09PSBcInN1c3BlbmRlZFwiKSAmJiB0aGlzLl9jb250ZXh0LmN1cnJlbnRUaW1lID09PSAwKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fY3VycmVudFRpbWVyKTtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLl9jb250ZXh0LmN1cnJlbnRUaW1lID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvdWNoUGxheUxpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZTogc2VsZi5fYXVkaW8sXG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IG9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1ZGlvOiBzZWxmXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzeXMgPSBjYy5zeXM7XG4gICAgICAgIGlmIChzeXMub3MgPT09IHN5cy5PU19JT1MgJiYgc3lzLmlzQnJvd3NlciAmJiBzeXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgIC8vIEF1ZGlvIGNvbnRleHQgaXMgc3VzcGVuZGVkIHdoZW4geW91IHVucGx1ZyB0aGUgZWFycGhvbmVzLFxuICAgICAgICAgICAgLy8gYW5kIGlzIGludGVycnVwdGVkIHdoZW4gdGhlIGFwcCBlbnRlcnMgYmFja2dyb3VuZC5cbiAgICAgICAgICAgIC8vIEJvdGggbWFrZSB0aGUgYXVkaW9CdWZmZXJTb3VyY2UgdW5wbGF5YWJsZS5cbiAgICAgICAgICAgIGlmICgoYXVkaW8uY29udGV4dC5zdGF0ZSA9PT0gXCJzdXNwZW5kZWRcIiAmJiB0aGlzLl9jb250ZXh0LmN1cnJlbnRUaW1lICE9PSAwKVxuICAgICAgICAgICAgICAgIHx8IGF1ZGlvLmNvbnRleHQuc3RhdGUgPT09ICdpbnRlcnJ1cHRlZCcpIHtcbiAgICAgICAgICAgICAgICAvLyByZWZlcmVuY2U6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9BdWRpb0NvbnRleHQvcmVzdW1lXG4gICAgICAgICAgICAgICAgYXVkaW8uY29udGV4dC5yZXN1bWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwcm90by5wYXVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2N1cnJlbnRUaW1lcik7XG4gICAgICAgIGlmICh0aGlzLnBhdXNlZCkgcmV0dXJuO1xuICAgICAgICAvLyBSZWNvcmQgdGhlIHRpbWUgdGhlIGN1cnJlbnQgaGFzIGJlZW4gcGxheWVkXG4gICAgICAgIHRoaXMucGxheWVkTGVuZ3RoID0gdGhpcy5fY29udGV4dC5jdXJyZW50VGltZSAtIHRoaXMuX3N0YXJ0VGltZTtcbiAgICAgICAgLy8gSWYgbW9yZSB0aGFuIHRoZSBkdXJhdGlvbiBvZiB0aGUgYXVkaW8sIE5lZWQgdG8gdGFrZSB0aGUgcmVtYWluZGVyXG4gICAgICAgIHRoaXMucGxheWVkTGVuZ3RoICU9IHRoaXMuX2J1ZmZlci5kdXJhdGlvbjtcbiAgICAgICAgbGV0IGF1ZGlvID0gdGhpcy5fY3VycmVudFNvdXJjZTtcbiAgICAgICAgaWYgKGF1ZGlvKSB7XG4gICAgICAgICAgICBpZihhdWRpby5vbmVuZGVkKXtcbiAgICAgICAgICAgICAgICBhdWRpby5vbmVuZGVkLl9iaW5kZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBhdWRpby5vbmVuZGVkID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF1ZGlvLnN0b3AoMCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY3VycmVudFNvdXJjZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX3N0YXJ0VGltZSA9IC0xO1xuXG4gICAgfTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90bywgJ3BhdXNlZCcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgY3VycmVudCBhdWRpbyBpcyBhIGxvb3AsIHBhdXNlZCBpcyBmYWxzZVxuICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRTb3VyY2UgJiYgdGhpcy5fY3VycmVudFNvdXJjZS5sb29wKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgLy8gc3RhcnRUaW1lIGRlZmF1bHQgaXMgLTFcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdGFydFRpbWUgPT09IC0xKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgICAgICAvLyBDdXJyZW50IHRpbWUgLSAgU3RhcnQgcGxheWluZyB0aW1lID4gQXVkaW8gZHVyYXRpb25cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZXh0LmN1cnJlbnRUaW1lIC0gdGhpcy5fc3RhcnRUaW1lID4gdGhpcy5fYnVmZmVyLmR1cmF0aW9uO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90bywgJ2xvb3AnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xvb3A7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKGJvb2wpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50U291cmNlKVxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTb3VyY2UubG9vcCA9IGJvb2w7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb29wID0gYm9vbDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG8sICd2b2x1bWUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZvbHVtZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobnVtKSB7XG4gICAgICAgICAgICB0aGlzLl92b2x1bWUgPSBudW07XG4gICAgICAgICAgICAvLyBodHRwczovL3d3dy5jaHJvbWVzdGF0dXMuY29tL2ZlYXR1cmVzLzUyODc5OTU3NzA5MjkxNTJcbiAgICAgICAgICAgIGlmICh0aGlzLl9nYWluT2JqLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2Fpbk9iai5nYWluLnNldFRhcmdldEF0VGltZShudW0sIHRoaXMuX2NvbnRleHQuY3VycmVudFRpbWUsIFRJTUVfQ09OU1RBTlQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTb21lIG90aGVyIHVua25vd24gYnJvd3NlcnMgbWF5IGNyYXNoIGlmIFRJTUVfQ09OU1RBTlQgaXMgMFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nYWluT2JqLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKG51bSwgdGhpcy5fY29udGV4dC5jdXJyZW50VGltZSwgMC4wMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZ2Fpbk9iai5nYWluLnZhbHVlID0gbnVtO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc3lzLm9zID09PSBzeXMuT1NfSU9TICYmICF0aGlzLnBhdXNlZCAmJiB0aGlzLl9jdXJyZW50U291cmNlKSB7XG4gICAgICAgICAgICAgICAgLy8gSU9TIG11c3QgYmUgc3RvcCB3ZWJBdWRpb1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTb3VyY2Uub25lbmRlZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90bywgJ2N1cnJlbnRUaW1lJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhdXNlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXllZExlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFJlY29yZCB0aGUgdGltZSB0aGUgY3VycmVudCBoYXMgYmVlbiBwbGF5ZWRcbiAgICAgICAgICAgIHRoaXMucGxheWVkTGVuZ3RoID0gdGhpcy5fY29udGV4dC5jdXJyZW50VGltZSAtIHRoaXMuX3N0YXJ0VGltZTtcbiAgICAgICAgICAgIC8vIElmIG1vcmUgdGhhbiB0aGUgZHVyYXRpb24gb2YgdGhlIGF1ZGlvLCBOZWVkIHRvIHRha2UgdGhlIHJlbWFpbmRlclxuICAgICAgICAgICAgdGhpcy5wbGF5ZWRMZW5ndGggJT0gdGhpcy5fYnVmZmVyLmR1cmF0aW9uO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGxheWVkTGVuZ3RoO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChudW0pIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5wYXVzZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZWRMZW5ndGggPSBudW07XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucGxheWVkTGVuZ3RoID0gbnVtO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG8sICdkdXJhdGlvbicsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYnVmZmVyLmR1cmF0aW9uO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcblxufSkoV2ViQXVkaW9FbGVtZW50LnByb3RvdHlwZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gY2MuX0F1ZGlvID0gQXVkaW87XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==