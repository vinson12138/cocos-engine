
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/asset-manager/builtins.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
var Cache = require('./cache');

var releaseManager = require('./releaseManager');

var _require = require('./shared'),
    BuiltinBundleName = _require.BuiltinBundleName;
/**
 * @module cc.AssetManager
 */

/**
 * !#en
 * This module contains the builtin asset, it's a singleton, all member can be accessed with `cc.assetManager.builtins` 
 * 
 * !#zh
 * 此模块包含内建资源，这是一个单例，所有成员能通过 `cc.assetManager.builtins` 访问
 * 
 * @class Builtins
 */


var builtins = {
  _assets: new Cache({
    material: new Cache(),
    effect: new Cache()
  }),
  // builtin assets
  _loadBuiltins: function _loadBuiltins(name, cb) {
    var dirname = name + 's';

    var builtin = this._assets.get(name);

    return cc.assetManager.internal.loadDir(dirname, null, null, function (err, assets) {
      if (err) {
        cc.error(err.message, err.stack);
      } else {
        for (var i = 0; i < assets.length; i++) {
          var asset = assets[i];
          builtin.add(asset.name, asset.addRef());
        }
      }

      cb();
    });
  },

  /**
   * !#en
   * Initialize
   * 
   * !#zh
   * 初始化 
   * 
   * @method init
   * @param {Function} cb - Callback when finish loading built-in assets
   * 
   * @typescript
   * init (cb: () => void): void
   */
  init: function init(cb) {
    var _this = this;

    this.clear();

    if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS || !cc.assetManager.bundles.has(BuiltinBundleName.INTERNAL)) {
      return cb && cb();
    }

    this._loadBuiltins('effect', function () {
      _this._loadBuiltins('material', cb);
    });
  },

  /**
   * !#en
   * Get the built-in asset using specific type and name.
   * 
   * !#zh
   * 通过特定的类型和名称获取内建资源
   * 
   * @method getBuiltin
   * @param {string} [type] - The type of asset, such as `effect`
   * @param {string} [name] - The name of asset, such as `phong`
   * @return {Asset|Cache} Builtin-assets
   * 
   * @example
   * cc.assetManaer.builtins.getBuiltin('effect', 'phone');
   * 
   * @typescript
   * getBuiltin(type?: string, name?: string): cc.Asset | Cache<cc.Asset>
   */
  getBuiltin: function getBuiltin(type, name) {
    if (arguments.length === 0) return this._assets;else if (arguments.length === 1) return this._assets.get(type);else return this._assets.get(type).get(name);
  },

  /**
   * !#en
   * Clear all builtin assets
   * 
   * !#zh
   * 清空所有内置资源
   * 
   * @method clear
   * 
   * @typescript
   * clear(): void
   */
  clear: function clear() {
    this._assets.forEach(function (assets) {
      assets.forEach(function (asset) {
        releaseManager.tryRelease(asset, true);
      });
      assets.clear();
    });
  }
};
module.exports = builtins;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0LW1hbmFnZXIvYnVpbHRpbnMuanMiXSwibmFtZXMiOlsiQ2FjaGUiLCJyZXF1aXJlIiwicmVsZWFzZU1hbmFnZXIiLCJCdWlsdGluQnVuZGxlTmFtZSIsImJ1aWx0aW5zIiwiX2Fzc2V0cyIsIm1hdGVyaWFsIiwiZWZmZWN0IiwiX2xvYWRCdWlsdGlucyIsIm5hbWUiLCJjYiIsImRpcm5hbWUiLCJidWlsdGluIiwiZ2V0IiwiY2MiLCJhc3NldE1hbmFnZXIiLCJpbnRlcm5hbCIsImxvYWREaXIiLCJlcnIiLCJhc3NldHMiLCJlcnJvciIsIm1lc3NhZ2UiLCJzdGFjayIsImkiLCJsZW5ndGgiLCJhc3NldCIsImFkZCIsImFkZFJlZiIsImluaXQiLCJjbGVhciIsImdhbWUiLCJyZW5kZXJUeXBlIiwiUkVOREVSX1RZUEVfQ0FOVkFTIiwiYnVuZGxlcyIsImhhcyIsIklOVEVSTkFMIiwiZ2V0QnVpbHRpbiIsInR5cGUiLCJhcmd1bWVudHMiLCJmb3JFYWNoIiwidHJ5UmVsZWFzZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNQSxLQUFLLEdBQUdDLE9BQU8sQ0FBQyxTQUFELENBQXJCOztBQUNBLElBQU1DLGNBQWMsR0FBR0QsT0FBTyxDQUFDLGtCQUFELENBQTlCOztlQUM4QkEsT0FBTyxDQUFDLFVBQUQ7SUFBN0JFLDZCQUFBQTtBQUVSO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQUlDLFFBQVEsR0FBRztBQUVYQyxFQUFBQSxPQUFPLEVBQUUsSUFBSUwsS0FBSixD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RUFBaUI7QUFDNUJ2QixRQUFBQSxjQUFjLENBQUNzQyxVQUFmLENBQTBCZixLQUExQixFQUFpQyxJQUFqQztBQUNILE9BRkQ7QUFHQU4sTUFBQUEsTUFBTSxDQUFDVSxLQUFQO0FBQ0gsS0FMRDtBQU1IO0FBekZVLENBQWY7QUE0RkFZLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnRDLFFBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuY29uc3QgQ2FjaGUgPSByZXF1aXJlKCcuL2NhY2hlJyk7XG5jb25zdCByZWxlYXNlTWFuYWdlciA9IHJlcXVpcmUoJy4vcmVsZWFzZU1hbmFnZXInKTtcbmNvbnN0IHsgQnVpbHRpbkJ1bmRsZU5hbWUgfSA9IHJlcXVpcmUoJy4vc2hhcmVkJyk7IFxuXG4vKipcbiAqIEBtb2R1bGUgY2MuQXNzZXRNYW5hZ2VyXG4gKi9cbi8qKlxuICogISNlblxuICogVGhpcyBtb2R1bGUgY29udGFpbnMgdGhlIGJ1aWx0aW4gYXNzZXQsIGl0J3MgYSBzaW5nbGV0b24sIGFsbCBtZW1iZXIgY2FuIGJlIGFjY2Vzc2VkIHdpdGggYGNjLmFzc2V0TWFuYWdlci5idWlsdGluc2AgXG4gKiBcbiAqICEjemhcbiAqIOatpOaooeWdl+WMheWQq+WGheW7uui1hOa6kO+8jOi/meaYr+S4gOS4quWNleS+i++8jOaJgOacieaIkOWRmOiDvemAmui/hyBgY2MuYXNzZXRNYW5hZ2VyLmJ1aWx0aW5zYCDorr/pl65cbiAqIFxuICogQGNsYXNzIEJ1aWx0aW5zXG4gKi9cbnZhciBidWlsdGlucyA9IHtcbiAgICBcbiAgICBfYXNzZXRzOiBuZXcgQ2FjaGUoeyBtYXRlcmlhbDogbmV3IENhY2hlKCksIGVmZmVjdDogbmV3IENhY2hlKCkgfSksIC8vIGJ1aWx0aW4gYXNzZXRzXG5cbiAgICBfbG9hZEJ1aWx0aW5zIChuYW1lLCBjYikge1xuICAgICAgICBsZXQgZGlybmFtZSA9IG5hbWUgICsgJ3MnO1xuICAgICAgICBsZXQgYnVpbHRpbiA9IHRoaXMuX2Fzc2V0cy5nZXQobmFtZSk7XG4gICAgICAgIHJldHVybiBjYy5hc3NldE1hbmFnZXIuaW50ZXJuYWwubG9hZERpcihkaXJuYW1lLCBudWxsLCBudWxsLCAoZXJyLCBhc3NldHMpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcihlcnIubWVzc2FnZSwgZXJyLnN0YWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXNzZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhc3NldCA9IGFzc2V0c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgYnVpbHRpbi5hZGQoYXNzZXQubmFtZSwgYXNzZXQuYWRkUmVmKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2IoKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBJbml0aWFsaXplXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOWIneWni+WMliBcbiAgICAgKiBcbiAgICAgKiBAbWV0aG9kIGluaXRcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYiAtIENhbGxiYWNrIHdoZW4gZmluaXNoIGxvYWRpbmcgYnVpbHQtaW4gYXNzZXRzXG4gICAgICogXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBpbml0IChjYjogKCkgPT4gdm9pZCk6IHZvaWRcbiAgICAgKi9cbiAgICBpbml0IChjYikge1xuICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgIGlmIChjYy5nYW1lLnJlbmRlclR5cGUgPT09IGNjLmdhbWUuUkVOREVSX1RZUEVfQ0FOVkFTIHx8ICFjYy5hc3NldE1hbmFnZXIuYnVuZGxlcy5oYXMoQnVpbHRpbkJ1bmRsZU5hbWUuSU5URVJOQUwpKSB7XG4gICAgICAgICAgICByZXR1cm4gY2IgJiYgY2IoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvYWRCdWlsdGlucygnZWZmZWN0JywgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fbG9hZEJ1aWx0aW5zKCdtYXRlcmlhbCcsIGNiKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgdGhlIGJ1aWx0LWluIGFzc2V0IHVzaW5nIHNwZWNpZmljIHR5cGUgYW5kIG5hbWUuXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOmAmui/h+eJueWumueahOexu+Wei+WSjOWQjeensOiOt+WPluWGheW7uui1hOa6kFxuICAgICAqIFxuICAgICAqIEBtZXRob2QgZ2V0QnVpbHRpblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV0gLSBUaGUgdHlwZSBvZiBhc3NldCwgc3VjaCBhcyBgZWZmZWN0YFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbbmFtZV0gLSBUaGUgbmFtZSBvZiBhc3NldCwgc3VjaCBhcyBgcGhvbmdgXG4gICAgICogQHJldHVybiB7QXNzZXR8Q2FjaGV9IEJ1aWx0aW4tYXNzZXRzXG4gICAgICogXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjYy5hc3NldE1hbmFlci5idWlsdGlucy5nZXRCdWlsdGluKCdlZmZlY3QnLCAncGhvbmUnKTtcbiAgICAgKiBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGdldEJ1aWx0aW4odHlwZT86IHN0cmluZywgbmFtZT86IHN0cmluZyk6IGNjLkFzc2V0IHwgQ2FjaGU8Y2MuQXNzZXQ+XG4gICAgICovXG4gICAgZ2V0QnVpbHRpbiAodHlwZSwgbmFtZSkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRoaXMuX2Fzc2V0cztcbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkgcmV0dXJuIHRoaXMuX2Fzc2V0cy5nZXQodHlwZSk7XG4gICAgICAgIGVsc2UgcmV0dXJuIHRoaXMuX2Fzc2V0cy5nZXQodHlwZSkuZ2V0KG5hbWUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ2xlYXIgYWxsIGJ1aWx0aW4gYXNzZXRzXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOa4heepuuaJgOacieWGhee9rui1hOa6kFxuICAgICAqIFxuICAgICAqIEBtZXRob2QgY2xlYXJcbiAgICAgKiBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGNsZWFyKCk6IHZvaWRcbiAgICAgKi9cbiAgICBjbGVhciAoKSB7XG4gICAgICAgIHRoaXMuX2Fzc2V0cy5mb3JFYWNoKGZ1bmN0aW9uIChhc3NldHMpIHtcbiAgICAgICAgICAgIGFzc2V0cy5mb3JFYWNoKGZ1bmN0aW9uIChhc3NldCkge1xuICAgICAgICAgICAgICAgIHJlbGVhc2VNYW5hZ2VyLnRyeVJlbGVhc2UoYXNzZXQsIHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhc3NldHMuY2xlYXIoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJ1aWx0aW5zO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=