
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCAudioClip.js';
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
var Asset = require('./CCAsset');

var EventTarget = require('../event/event-target');

var LoadMode = cc.Enum({
  WEB_AUDIO: 0,
  DOM_AUDIO: 1
});
/**
 * !#en Class for audio data handling.
 * !#zh 音频资源类。
 * @class AudioClip
 * @extends Asset
 * @uses EventTarget
 */

var AudioClip = cc.Class({
  name: 'cc.AudioClip',
  "extends": Asset,
  mixins: [EventTarget],
  ctor: function ctor() {
    this._loading = false;
    this.loaded = false; // the web audio buffer or <audio> element

    this._audio = null;
  },
  properties: {
    /**
     * !#en Get the audio clip duration
     * !#zh 获取音频剪辑的长度
     * @property duration
     * @type {Number}
     */
    duration: 0,
    loadMode: {
      "default": LoadMode.WEB_AUDIO,
      type: LoadMode
    },
    _nativeAsset: {
      get: function get() {
        return this._audio;
      },
      set: function set(value) {
        // HACK: fix load mp3 as audioClip, _nativeAsset is set as audioClip.
        // Should load mp3 as audioBuffer indeed.
        if (value instanceof cc.AudioClip) {
          this._audio = value._nativeAsset;
        } else {
          this._audio = value;
        }

        if (this._audio) {
          this.loaded = true;
          this.emit('load');
        }
      },
      override: true
    },
    _nativeDep: {
      get: function get() {
        return {
          uuid: this._uuid,
          audioLoadMode: this.loadMode,
          ext: cc.path.extname(this._native),
          __isNative__: true
        };
      },
      override: true
    }
  },
  statics: {
    LoadMode: LoadMode,
    _loadByUrl: function _loadByUrl(url, callback) {
      var audioClip = cc.assetManager.assets.get(url);

      if (!audioClip) {
        cc.assetManager.loadRemote(url, function (error, data) {
          if (error) {
            return callback(error);
          }

          callback(null, data);
        });
      } else {
        callback(null, audioClip);
      }
    }
  },
  _ensureLoaded: function _ensureLoaded(onComplete) {
    if (this.loaded) {
      return onComplete && onComplete();
    } else {
      if (onComplete) {
        this.once('load', onComplete);
      }

      if (!this._loading) {
        this._loading = true;
        var self = this;
        cc.assetManager.postLoadNative(this, function (err) {
          self._loading = false;
        });
      }
    }
  },
  destroy: function destroy() {
    cc.audioEngine.uncache(this);

    this._super();
  }
});
/**
 * !#zh
 * 当该资源加载成功后触发该事件
 * !#en
 * This event is emitted when the asset is loaded
 *
 * @event load
 */

cc.AudioClip = AudioClip;
module.exports = AudioClip;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0cy9DQ0F1ZGlvQ2xpcC5qcyJdLCJuYW1lcyI6WyJBc3NldCIsInJlcXVpcmUiLCJFdmVudFRhcmdldCIsIkxvYWRNb2RlIiwiY2MiLCJFbnVtIiwiV0VCX0FVRElPIiwiRE9NX0FVRElPIiwiQXVkaW9DbGlwIiwiQ2xhc3MiLCJuYW1lIiwibWl4aW5zIiwiY3RvciIsIl9sb2FkaW5nIiwibG9hZGVkIiwiX2F1ZGlvIiwicHJvcGVydGllcyIsImR1cmF0aW9uIiwibG9hZE1vZGUiLCJ0eXBlIiwiX25hdGl2ZUFzc2V0IiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJlbWl0Iiwib3ZlcnJpZGUiLCJfbmF0aXZlRGVwIiwidXVpZCIsIl91dWlkIiwiYXVkaW9Mb2FkTW9kZSIsImV4dCIsInBhdGgiLCJleHRuYW1lIiwiX25hdGl2ZSIsIl9faXNOYXRpdmVfXyIsInN0YXRpY3MiLCJfbG9hZEJ5VXJsIiwidXJsIiwiY2FsbGJhY2siLCJhdWRpb0NsaXAiLCJhc3NldE1hbmFnZXIiLCJhc3NldHMiLCJsb2FkUmVtb3RlIiwiZXJyb3IiLCJkYXRhIiwiX2Vuc3VyZUxvYWRlZCIsIm9uQ29tcGxldGUiLCJvbmNlIiwic2VsZiIsInBvc3RMb2FkTmF0aXZlIiwiZXJyIiwiZGVzdHJveSIsImF1ZGlvRW5naW5lIiwidW5jYWNoZSIsIl9zdXBlciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLEtBQUssR0FBR0MsT0FBTyxDQUFDLFdBQUQsQ0FBckI7O0FBQ0EsSUFBTUMsV0FBVyxHQUFHRCxPQUFPLENBQUMsdUJBQUQsQ0FBM0I7O0FBRUEsSUFB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YixhQUFPZ0MsVUFBVSxJQUFJQSxVQUFVLEVBQS9CO0FBQ0gsS0FGRCxNQUdLO0FBQ0QsVUFBSUEsVUFBSixFQUFnQjtBQUNaLGFBQUtDLElBQUwsQ0FBVSxNQUFWLEVBQWtCRCxVQUFsQjtBQUNIOztBQUNELFVBQUksQ0FBQyxLQUFLakMsUUFBVixFQUFvQjtBQUNoQixhQUFLQSxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsWUFBSW1DLElBQUksR0FBRyxJQUFYO0FBQ0E1QyxRQUFBQSxFQUFFLENBQUNvQyxZQUFILENBQWdCUyxjQUFoQixDQUErQixJQUEvQixFQUFxQyxVQUFVQyxHQUFWLEVBQWU7QUFDaERGLFVBQUFBLElBQUksQ0FBQ25DLFFBQUwsR0FBZ0IsS0FBaEI7QUFDSCxTQUZEO0FBR0g7QUFDSjtBQUNKLEdBeEZvQjtBQTBGckJzQyxFQUFBQSxPQTFGcUIscUJBMEZWO0FBQ1AvQyxJQUFBQSxFQUFFLENBQUNnRCxXQUFILENBQWVDLE9BQWYsQ0FBdUIsSUFBdkI7O0FBQ0EsU0FBS0MsTUFBTDtBQUNIO0FBN0ZvQixDQUFULENBQWhCO0FBZ0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUFsRCxFQUFFLENBQUNJLFNBQUgsR0FBZUEsU0FBZjtBQUNBK0MsTUFBTSxDQUFDQyxPQUFQLEdBQWlCaEQsU0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IEFzc2V0ID0gcmVxdWlyZSgnLi9DQ0Fzc2V0Jyk7XG5jb25zdCBFdmVudFRhcmdldCA9IHJlcXVpcmUoJy4uL2V2ZW50L2V2ZW50LXRhcmdldCcpO1xuXG52YXIgTG9hZE1vZGUgPSBjYy5FbnVtKHtcbiAgICBXRUJfQVVESU86IDAsXG4gICAgRE9NX0FVRElPOiAxLFxufSk7XG5cbi8qKlxuICogISNlbiBDbGFzcyBmb3IgYXVkaW8gZGF0YSBoYW5kbGluZy5cbiAqICEjemgg6Z+z6aKR6LWE5rqQ57G744CCXG4gKiBAY2xhc3MgQXVkaW9DbGlwXG4gKiBAZXh0ZW5kcyBBc3NldFxuICogQHVzZXMgRXZlbnRUYXJnZXRcbiAqL1xudmFyIEF1ZGlvQ2xpcCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuQXVkaW9DbGlwJyxcbiAgICBleHRlbmRzOiBBc3NldCxcbiAgICBtaXhpbnM6IFtFdmVudFRhcmdldF0sXG5cbiAgICBjdG9yICgpIHtcbiAgICAgICAgdGhpcy5fbG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xuXG4gICAgICAgIC8vIHRoZSB3ZWIgYXVkaW8gYnVmZmVyIG9yIDxhdWRpbz4gZWxlbWVudFxuICAgICAgICB0aGlzLl9hdWRpbyA9IG51bGw7XG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gR2V0IHRoZSBhdWRpbyBjbGlwIGR1cmF0aW9uXG4gICAgICAgICAqICEjemgg6I635Y+W6Z+z6aKR5Ymq6L6R55qE6ZW/5bqmXG4gICAgICAgICAqIEBwcm9wZXJ0eSBkdXJhdGlvblxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgZHVyYXRpb246IDAsXG4gICAgICAgIGxvYWRNb2RlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBMb2FkTW9kZS5XRUJfQVVESU8sXG4gICAgICAgICAgICB0eXBlOiBMb2FkTW9kZVxuICAgICAgICB9LFxuICAgICAgICBfbmF0aXZlQXNzZXQ6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2F1ZGlvO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAvLyBIQUNLOiBmaXggbG9hZCBtcDMgYXMgYXVkaW9DbGlwLCBfbmF0aXZlQXNzZXQgaXMgc2V0IGFzIGF1ZGlvQ2xpcC5cbiAgICAgICAgICAgICAgICAvLyBTaG91bGQgbG9hZCBtcDMgYXMgYXVkaW9CdWZmZXIgaW5kZWVkLlxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIGNjLkF1ZGlvQ2xpcCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hdWRpbyA9IHZhbHVlLl9uYXRpdmVBc3NldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2F1ZGlvID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hdWRpbykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnbG9hZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvdmVycmlkZTogdHJ1ZVxuICAgICAgICB9LFxuXG4gICAgICAgIF9uYXRpdmVEZXA6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgdXVpZDogdGhpcy5fdXVpZCwgYXVkaW9Mb2FkTW9kZTogdGhpcy5sb2FkTW9kZSwgZXh0OiBjYy5wYXRoLmV4dG5hbWUodGhpcy5fbmF0aXZlKSwgX19pc05hdGl2ZV9fOiB0cnVlIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3ZlcnJpZGU6IHRydWVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIExvYWRNb2RlOiBMb2FkTW9kZSxcbiAgICAgICAgX2xvYWRCeVVybDogZnVuY3Rpb24gKHVybCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHZhciBhdWRpb0NsaXAgPSBjYy5hc3NldE1hbmFnZXIuYXNzZXRzLmdldCh1cmwpO1xuICAgICAgICAgICAgaWYgKCFhdWRpb0NsaXApIHtcbiAgICAgICAgICAgICAgICBjYy5hc3NldE1hbmFnZXIubG9hZFJlbW90ZSh1cmwsIGZ1bmN0aW9uIChlcnJvciwgZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgZGF0YSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBhdWRpb0NsaXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9lbnN1cmVMb2FkZWQgKG9uQ29tcGxldGUpIHtcbiAgICAgICAgaWYgKHRoaXMubG9hZGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gb25Db21wbGV0ZSAmJiBvbkNvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAob25Db21wbGV0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMub25jZSgnbG9hZCcsIG9uQ29tcGxldGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLl9sb2FkaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGNjLmFzc2V0TWFuYWdlci5wb3N0TG9hZE5hdGl2ZSh0aGlzLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBkZXN0cm95ICgpIHtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUudW5jYWNoZSh0aGlzKTtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI3poXG4gKiDlvZPor6XotYTmupDliqDovb3miJDlip/lkI7op6blj5Hor6Xkuovku7ZcbiAqICEjZW5cbiAqIFRoaXMgZXZlbnQgaXMgZW1pdHRlZCB3aGVuIHRoZSBhc3NldCBpcyBsb2FkZWRcbiAqXG4gKiBAZXZlbnQgbG9hZFxuICovXG5cbmNjLkF1ZGlvQ2xpcCA9IEF1ZGlvQ2xpcDtcbm1vZHVsZS5leHBvcnRzID0gQXVkaW9DbGlwO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=