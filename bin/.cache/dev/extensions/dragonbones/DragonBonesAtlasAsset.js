
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/dragonbones/DragonBonesAtlasAsset.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
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

/**
 * @module dragonBones
 */
var ArmatureCache = !CC_JSB && require('./ArmatureCache').sharedCache;
/**
 * !#en The skeleton atlas data of dragonBones.
 * !#zh dragonBones 的骨骼纹理数据。
 * @class DragonBonesAtlasAsset
 * @extends Asset
 */


var DragonBonesAtlasAsset = cc.Class({
  name: 'dragonBones.DragonBonesAtlasAsset',
  "extends": cc.Asset,
  ctor: function ctor() {
    this._clear();
  },
  properties: {
    _atlasJson: '',

    /**
     * @property {string} atlasJson
     */
    atlasJson: {
      get: function get() {
        return this._atlasJson;
      },
      set: function set(value) {
        this._atlasJson = value;
        this._atlasJsonData = JSON.parse(this.atlasJson);

        this._clear();
      }
    },
    _texture: {
      "default": null,
      type: cc.Texture2D,
      formerlySerializedAs: 'texture'
    },

    /**
     * @property {Texture2D} texture
     */
    texture: {
      get: function get() {
        return this._texture;
      },
      set: function set(value) {
        this._texture = value;

        this._clear();
      }
    },
    _textureAtlasData: null
  },
  statics: {
    preventDeferredLoadDependents: true
  },
  createNode: CC_EDITOR && function (callback) {
    var node = new cc.Node(this.name);
    var armatureDisplay = node.addComponent(dragonBones.ArmatureDisplay);
    armatureDisplay.dragonAtlasAsset = this;
    return callback(null, node);
  },
  init: function init(factory) {
    this._factory = factory;

    if (!this._atlasJsonData) {
      this._atlasJsonData = JSON.parse(this.atlasJson);
    }

    var atlasJsonObj = this._atlasJsonData; // If create by manual, uuid is empty.

    this._uuid = this._uuid || atlasJsonObj.name;

    if (this._textureAtlasData) {
      factory.addTextureAtlasData(this._textureAtlasData, this._uuid);
    } else {
      this._textureAtlasData = factory.parseTextureAtlasData(atlasJsonObj, this.texture, this._uuid);
    }
  },
  _clear: function _clear() {
    if (CC_JSB) return;

    if (this._factory) {
      ArmatureCache.resetArmature(this._uuid);

      this._factory.removeTextureAtlasData(this._uuid, true);

      this._factory.removeDragonBonesDataByUUID(this._uuid, true);
    }

    this._textureAtlasData = null;
  },
  destroy: function destroy() {
    this._clear();

    this._super();
  }
});
dragonBones.DragonBonesAtlasAsset = module.exports = DragonBonesAtlasAsset;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvZXh0ZW5zaW9ucy9kcmFnb25ib25lcy9EcmFnb25Cb25lc0F0bGFzQXNzZXQuanMiXSwibmFtZXMiOlsiQXJtYXR1cmVDYWNoZSIsIkNDX0pTQiIsInJlcXVpcmUiLCJzaGFyZWRDYWNoZSIsIkRyYWdvbkJvbmVzQXRsYXNBc3NldCIsImNjIiwiQ2xhc3MiLCJuYW1lIiwiQXNzZXQiLCJjdG9yIiwiX2NsZWFyIiwicHJvcGVydGllcyIsIl9hdGxhc0pzb24iLCJhdGxhc0pzb24iLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsIl9hdGxhc0pzb25EYXRhIiwiSlNPTiIsInBhcnNlIiwiX3RleHR1cmUiLCJ0eXBlIiwiVGV4dHVyZTJEIiwiZm9ybWVybHlTZXJpYWxpemVkQXMiLCJ0ZXh0dXJlIiwiX3RleHR1cmVBdGxhc0RhdGEiLCJzdGF0aWNzIiwicHJldmVudERlZmVycmVkTG9hZERlcGVuZGVudHMiLCJjcmVhdGVOb2RlIiwiQ0NfRURJVE9SIiwiY2FsbGJhY2siLCJub2RlIiwiTm9kZSIsImFybWF0dXJlRGlzcGxheSIsImFkZENvbXBvbmVudCIsImRyYWdvbkJvbmVzIiwiQXJtYXR1cmVEaXNwbGF5IiwiZHJhZ29uQXRsYXNBc3NldCIsImluaXQiLCJmYWN0b3J5IiwiX2ZhY3RvcnkiLCJhdGxhc0pzb25PYmoiLCJfdXVpZCIsImFkZFRleHR1cmVBdGxhc0RhdGEiLCJwYXJzZVRleHR1cmVBdGxhc0RhdGEiLCJyZXNldEFybWF0dXJlIiwicmVtb3ZlVGV4dHVyZUF0bGFzRGF0YSIsInJlbW92ZURyYWdvbkJvbmVzRGF0YUJ5VVVJRCIsImRlc3Ryb3kiLCJfc3VwZXIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBOEVqQ2hDLEVBQUFBLE1BOUVpQyxvQkE4RXZCO0FBQ04sUUFBSVQsTUFBSixFQUFZOztBQUNaLFFBQUksS0FBS3VDLFFBQVQsRUFBbUI7QUFDZnhDLE1BQUFBLGFBQWEsQ0FBQzZDLGFBQWQsQ0FBNEIsS0FBS0gsS0FBakM7O0FBQ0EsV0FBS0YsUUFBTCxDQUFjTSxzQkFBZCxDQUFxQyxLQUFLSixLQUExQyxFQUFpRCxJQUFqRDs7QUFDQSxXQUFLRixRQUFMLENBQWNPLDJCQUFkLENBQTBDLEtBQUtMLEtBQS9DLEVBQXNELElBQXREO0FBQ0g7O0FBQ0QsU0FBS2pCLGlCQUFMLEdBQXlCLElBQXpCO0FBQ0gsR0F0RmdDO0FBd0ZqQ3VCLEVBQUFBLE9BeEZpQyxxQkF3RnRCO0FBQ1AsU0FBS3RDLE1BQUw7O0FBQ0EsU0FBS3VDLE1BQUw7QUFDSDtBQTNGZ0MsQ0FBVCxDQUE1QjtBQThGQWQsV0FBVyxDQUFDL0IscUJBQVosR0FBb0M4QyxNQUFNLENBQUNDLE9BQVAsR0FBaUIvQyxxQkFBckQiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogQG1vZHVsZSBkcmFnb25Cb25lc1xuICovXG5sZXQgQXJtYXR1cmVDYWNoZSA9ICFDQ19KU0IgJiYgcmVxdWlyZSgnLi9Bcm1hdHVyZUNhY2hlJykuc2hhcmVkQ2FjaGU7XG5cbi8qKlxuICogISNlbiBUaGUgc2tlbGV0b24gYXRsYXMgZGF0YSBvZiBkcmFnb25Cb25lcy5cbiAqICEjemggZHJhZ29uQm9uZXMg55qE6aqo6aq857q555CG5pWw5o2u44CCXG4gKiBAY2xhc3MgRHJhZ29uQm9uZXNBdGxhc0Fzc2V0XG4gKiBAZXh0ZW5kcyBBc3NldFxuICovXG52YXIgRHJhZ29uQm9uZXNBdGxhc0Fzc2V0ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdkcmFnb25Cb25lcy5EcmFnb25Cb25lc0F0bGFzQXNzZXQnLFxuICAgIGV4dGVuZHM6IGNjLkFzc2V0LFxuXG4gICAgY3RvciAoKSB7XG4gICAgICAgIHRoaXMuX2NsZWFyKCk7XG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX2F0bGFzSnNvbiA6ICcnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gYXRsYXNKc29uXG4gICAgICAgICAqL1xuICAgICAgICBhdGxhc0pzb246IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hdGxhc0pzb247XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hdGxhc0pzb24gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9hdGxhc0pzb25EYXRhID0gSlNPTi5wYXJzZSh0aGlzLmF0bGFzSnNvbik7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2xlYXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfdGV4dHVyZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlRleHR1cmUyRCxcbiAgICAgICAgICAgIGZvcm1lcmx5U2VyaWFsaXplZEFzOiAndGV4dHVyZSdcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHByb3BlcnR5IHtUZXh0dXJlMkR9IHRleHR1cmVcbiAgICAgICAgICovXG4gICAgICAgIHRleHR1cmU6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHR1cmU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3RleHR1cmUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jbGVhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF90ZXh0dXJlQXRsYXNEYXRhOiBudWxsLFxuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIHByZXZlbnREZWZlcnJlZExvYWREZXBlbmRlbnRzOiB0cnVlXG4gICAgfSxcblxuICAgIGNyZWF0ZU5vZGU6IENDX0VESVRPUiAmJiAgZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBub2RlID0gbmV3IGNjLk5vZGUodGhpcy5uYW1lKTtcbiAgICAgICAgdmFyIGFybWF0dXJlRGlzcGxheSA9IG5vZGUuYWRkQ29tcG9uZW50KGRyYWdvbkJvbmVzLkFybWF0dXJlRGlzcGxheSk7XG4gICAgICAgIGFybWF0dXJlRGlzcGxheS5kcmFnb25BdGxhc0Fzc2V0ID0gdGhpcztcblxuICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgbm9kZSk7XG4gICAgfSxcblxuICAgIGluaXQgKGZhY3RvcnkpIHtcbiAgICAgICAgdGhpcy5fZmFjdG9yeSA9IGZhY3Rvcnk7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9hdGxhc0pzb25EYXRhKSB7XG4gICAgICAgICAgICB0aGlzLl9hdGxhc0pzb25EYXRhID0gSlNPTi5wYXJzZSh0aGlzLmF0bGFzSnNvbik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGF0bGFzSnNvbk9iaiA9IHRoaXMuX2F0bGFzSnNvbkRhdGE7XG5cbiAgICAgICAgLy8gSWYgY3JlYXRlIGJ5IG1hbnVhbCwgdXVpZCBpcyBlbXB0eS5cbiAgICAgICAgdGhpcy5fdXVpZCA9IHRoaXMuX3V1aWQgfHwgYXRsYXNKc29uT2JqLm5hbWU7XG5cbiAgICAgICAgaWYgKHRoaXMuX3RleHR1cmVBdGxhc0RhdGEpIHtcbiAgICAgICAgICAgIGZhY3RvcnkuYWRkVGV4dHVyZUF0bGFzRGF0YSh0aGlzLl90ZXh0dXJlQXRsYXNEYXRhLCB0aGlzLl91dWlkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmVBdGxhc0RhdGEgPSBmYWN0b3J5LnBhcnNlVGV4dHVyZUF0bGFzRGF0YShhdGxhc0pzb25PYmosIHRoaXMudGV4dHVyZSwgdGhpcy5fdXVpZCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2NsZWFyICgpIHtcbiAgICAgICAgaWYgKENDX0pTQikgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5fZmFjdG9yeSkge1xuICAgICAgICAgICAgQXJtYXR1cmVDYWNoZS5yZXNldEFybWF0dXJlKHRoaXMuX3V1aWQpO1xuICAgICAgICAgICAgdGhpcy5fZmFjdG9yeS5yZW1vdmVUZXh0dXJlQXRsYXNEYXRhKHRoaXMuX3V1aWQsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5fZmFjdG9yeS5yZW1vdmVEcmFnb25Cb25lc0RhdGFCeVVVSUQodGhpcy5fdXVpZCwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdGV4dHVyZUF0bGFzRGF0YSA9IG51bGw7XG4gICAgfSxcblxuICAgIGRlc3Ryb3kgKCkge1xuICAgICAgICB0aGlzLl9jbGVhcigpO1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG59KTtcblxuZHJhZ29uQm9uZXMuRHJhZ29uQm9uZXNBdGxhc0Fzc2V0ID0gbW9kdWxlLmV4cG9ydHMgPSBEcmFnb25Cb25lc0F0bGFzQXNzZXQ7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==