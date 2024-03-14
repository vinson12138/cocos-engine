
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/tilemap/CCTiledMapAsset.js';
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

/**
 * Class for tiled map asset handling.
 * @class TiledMapAsset
 * @extends Asset
 *
 */
var TiledMapAsset = cc.Class({
  name: 'cc.TiledMapAsset',
  "extends": cc.Asset,
  properties: {
    tmxXmlStr: '',

    /**
     * @property {Texture2D[]} textures
     */
    textures: {
      "default": [],
      type: [cc.Texture2D]
    },

    /**
     * @property {String[]} textureNames
     */
    textureNames: [cc.String],

    /**
     * @property {Size[]} textureSizes
     */
    textureSizes: {
      "default": [],
      type: [cc.Size]
    },

    /**
     * @property {Texture2D[]} imageLayerTextures
     */
    imageLayerTextures: {
      "default": [],
      type: [cc.Texture2D]
    },

    /**
     * @property {String[]} imageLayerTextureNames
     */
    imageLayerTextureNames: [cc.String],
    tsxFiles: [cc.TextAsset],
    tsxFileNames: [cc.String]
  },
  statics: {
    preventDeferredLoadDependents: true
  },
  createNode: CC_EDITOR && function (callback) {
    var node = new cc.Node(this.name);
    var tiledMap = node.addComponent(cc.TiledMap);
    tiledMap.tmxAsset = this;
    return callback(null, node);
  }
});
cc.TiledMapAsset = TiledMapAsset;
module.exports = TiledMapAsset;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC90aWxlbWFwL0NDVGlsZWRNYXBBc3NldC5qcyJdLCJuYW1lcyI6WyJUaWxlZE1hcEFzc2V0IiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJBc3NldCIsInByb3BlcnRpZXMiLCJ0bXhYbWxTdHIiLCJ0ZXh0dXJlcyIsInR5cGUiLCJUZXh0dXJlMkQiLCJ0ZXh0dXJlTmFtZXMiLCJTdHJpbmciLCJ0ZXh0dXJlU2l6ZXMiLCJTaXplIiwiaW1hZ2VMYXllclRleHR1cmVzIiwiaW1hZ2VMYXllclRleHR1cmVOYW1lcyIsInRzeEZpbGVzIiwiVGV4dEFzc2V0IiwidHN4RmlsZU5hbWVzIiwic3RhdGljcyIsInByZXZlbnREZWZlcnJlZExvYWREZXBlbmRlbnRzIiwiY3JlYXRlTm9kZSIsIkNDX0VESVRPUiIsImNhbGxiYWNrIiwibm9kZSIsIk5vZGUiLCJ0aWxlZE1hcCIsImFkZENvbXBvbmVudCIsIlRpbGVkTWFwIiwidG14QXNzZXQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSUEsYUFBYSxHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUN6QkMsRUFBQUEsSUFBSSxFQUFFLGtCQURtQjtBQUV6QixhQUFTRixFQUFFLENBQUNHLEtBRmE7QUFJekJDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxTQUFTLEVBQUUsRUFESDs7QUFHUjtBQUNSO0FBQ0E7QUFDUUMsSUFBQUEsUUFBUSxFQUFFO0FBQ04saUJBQVMsRUFESDtBQUVOQyxNQUFBQSxJQUFJLEVBQUUsQ0FBQ1AsRUFBRSxDQUFDUSxTQUFKO0FBRkEsS0FORjs7QUFXUjtBQUNSO0FBQ0E7QUFDUUMsSUFBQUEsWUFBWSxFQUFFLENBQUNULEVBQUUsQ0FBQ1UsTUFBSixDQWROOztBQWdCUjtBQUNSO0FBQ0E7QUFDUUMsSUFBQUEsWUFBWSxFQUFFO0FBQ1YsaUJBQVMsRUFEQztBQUVWSixNQUFBQSxJQUFJLEVBQUUsQ0FBQ1AsRUFBRSxDQUFDWSxJQUFKO0FBRkksS0FuQk47O0FBd0JSO0FBQ1I7QUFDQTtBQUNRQyxJQUFBQSxrQkFBa0IsRUFBRTtBQUNoQixpQkFBUyxFQURPO0FBRWhCTixNQUFBQSxJQUFJLEVBQUUsQ0FBQ1AsRUFBRSxDQUFDUSxTQUFKO0FBRlUsS0EzQlo7O0FBZ0NSO0FBQ1I7QUFDQTtBQUNRTSxJQUFBQSxzQkFBc0IsRUFBRSxDQUFDZCxFQUFFLENBQUNVLE1BQUosQ0FuQ2hCO0FBcUNSSyxJQUFBQSxRQUFRLEVBQUUsQ0FBQ2YsRUFBRSxDQUFDZ0IsU0FBSixDQXJDRjtBQXNDUkMsSUFBQUEsWUFBWSxFQUFFLENBQUNqQixFQUFFLENBQUNVLE1BQUo7QUF0Q04sR0FKYTtBQTZDekJRLEVBQUFBLE9BQU8sRUFBRTtBQUNMQyxJQUFBQSw2QkFBNkIsRUFBRTtBQUQxQixHQTdDZ0I7QUFpRHpCQyxFQUFBQSxVQUFVLEVBQUVDLFNBQVMsSUFBSSxVQUFVQyxRQUFWLEVBQW9CO0FBQ3pDLFFBQUlDLElBQUksR0FBRyxJQUFJdkIsRUFBRSxDQUFDd0IsSUFBUCxDQUFZLEtBQUt0QixJQUFqQixDQUFYO0FBQ0EsUUFBSXVCLFFBQVEsR0FBR0YsSUFBSSxDQUFDRyxZQUFMLENBQWtCMUIsRUFBRSxDQUFDMkIsUUFBckIsQ0FBZjtBQUNBRixJQUFBQSxRQUFRLENBQUNHLFFBQVQsR0FBb0IsSUFBcEI7QUFFQSxXQUFPTixRQUFRLENBQUMsSUFBRCxFQUFPQyxJQUFQLENBQWY7QUFDSDtBQXZEd0IsQ0FBVCxDQUFwQjtBQTBEQXZCLEVBQUUsQ0FBQ0QsYUFBSCxHQUFtQkEsYUFBbkI7QUFDQThCLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQi9CLGFBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKipcbiAqIENsYXNzIGZvciB0aWxlZCBtYXAgYXNzZXQgaGFuZGxpbmcuXG4gKiBAY2xhc3MgVGlsZWRNYXBBc3NldFxuICogQGV4dGVuZHMgQXNzZXRcbiAqXG4gKi9cbmxldCBUaWxlZE1hcEFzc2V0ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5UaWxlZE1hcEFzc2V0JyxcbiAgICBleHRlbmRzOiBjYy5Bc3NldCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdG14WG1sU3RyOiAnJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHByb3BlcnR5IHtUZXh0dXJlMkRbXX0gdGV4dHVyZXNcbiAgICAgICAgICovXG4gICAgICAgIHRleHR1cmVzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IFtjYy5UZXh0dXJlMkRdXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nW119IHRleHR1cmVOYW1lc1xuICAgICAgICAgKi9cbiAgICAgICAgdGV4dHVyZU5hbWVzOiBbY2MuU3RyaW5nXSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHByb3BlcnR5IHtTaXplW119IHRleHR1cmVTaXplc1xuICAgICAgICAgKi9cbiAgICAgICAgdGV4dHVyZVNpemVzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IFtjYy5TaXplXVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJvcGVydHkge1RleHR1cmUyRFtdfSBpbWFnZUxheWVyVGV4dHVyZXNcbiAgICAgICAgICovXG4gICAgICAgIGltYWdlTGF5ZXJUZXh0dXJlczoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBbY2MuVGV4dHVyZTJEXVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJvcGVydHkge1N0cmluZ1tdfSBpbWFnZUxheWVyVGV4dHVyZU5hbWVzXG4gICAgICAgICAqL1xuICAgICAgICBpbWFnZUxheWVyVGV4dHVyZU5hbWVzOiBbY2MuU3RyaW5nXSxcblxuICAgICAgICB0c3hGaWxlczogW2NjLlRleHRBc3NldF0sXG4gICAgICAgIHRzeEZpbGVOYW1lczogW2NjLlN0cmluZ10sXG4gICAgfSxcblxuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgcHJldmVudERlZmVycmVkTG9hZERlcGVuZGVudHM6IHRydWVcbiAgICB9LFxuXG4gICAgY3JlYXRlTm9kZTogQ0NfRURJVE9SICYmIGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICBsZXQgbm9kZSA9IG5ldyBjYy5Ob2RlKHRoaXMubmFtZSk7XG4gICAgICAgIGxldCB0aWxlZE1hcCA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLlRpbGVkTWFwKTtcbiAgICAgICAgdGlsZWRNYXAudG14QXNzZXQgPSB0aGlzO1xuXG4gICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBub2RlKTtcbiAgICB9XG59KTtcblxuY2MuVGlsZWRNYXBBc3NldCA9IFRpbGVkTWFwQXNzZXQ7XG5tb2R1bGUuZXhwb3J0cyA9IFRpbGVkTWFwQXNzZXQ7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==