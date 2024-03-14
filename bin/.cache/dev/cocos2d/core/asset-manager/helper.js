
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/asset-manager/helper.js';
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
var _require = require('./shared'),
    bundles = _require.bundles;
/**
 * @module cc.AssetManager
 */

/**
 * !#en
 * Provide some helpful function, it is a singleton. All member can be accessed with `cc.assetManager.utils`
 * 
 * !#zh
 * 提供一些辅助方法，helper 是一个单例, 所有成员能通过 `cc.assetManager.utils` 访问
 * 
 * @class Helper
 */


var helper = {
  /**
   * !#en
   * Decode uuid, returns the original uuid
   * 
   * !#zh
   * 解码 uuid，返回原始 uuid
   * 
   * @method decodeUuid
   * @param {String} base64 - the encoded uuid
   * @returns {String} the original uuid 
   * 
   * @example
   * var uuid = 'fcmR3XADNLgJ1ByKhqcC5Z';
   * var originalUuid = decodeUuid(uuid); // fc991dd7-0033-4b80-9d41-c8a86a702e59
   * 
   * @typescript
   * decodeUuid(base64: string): string
   */
  decodeUuid: require('../utils/decode-uuid'),

  /**
   * !#en
   * Extract uuid from url
   * 
   * !#zh
   * 从 url 中提取 uuid
   * 
   * @method getUuidFromURL
   * @param {String} url - url
   * @returns {String} the uuid parsed from url
   * 
   * @example
   * var url = 'assets/main/import/fc/fc991dd7-0033-4b80-9d41-c8a86a702e59.json';
   * var uuid = getUuidFromURL(url); // fc991dd7-0033-4b80-9d41-c8a86a702e59
   * 
   * @typescript
   * getUuidFromURL(url: string): string
   */
  getUuidFromURL: function () {
    var _uuidRegex = /.*[/\\][0-9a-fA-F]{2}[/\\]([0-9a-fA-F-]{8,})/;
    return function (url) {
      var matches = url.match(_uuidRegex);

      if (matches) {
        return matches[1];
      }

      return '';
    };
  }(),

  /**
   * !#en
   * Transform uuid to url
   * 
   * !#zh
   * 转换 uuid 为 url
   * 
   * @method getUrlWithUuid
   * @param {string} uuid - The uuid of asset
   * @param {Object} [options] - Some optional parameters
   * @param {Boolean} [options.isNative] - Indicates whether the path you want is a native resource path
   * @param {string} [options.nativeExt] - Extension of the native resource path, it is required when isNative is true
   * @returns {string} url
   * 
   * @example
   * // json path, 'assets/main/import/fc/fc991dd7-0033-4b80-9d41-c8a86a702e59.json';
   * var url = getUrlWithUuid('fcmR3XADNLgJ1ByKhqcC5Z', {isNative: false});
   * 
   * // png path, 'assets/main/native/fc/fc991dd7-0033-4b80-9d41-c8a86a702e59.png';
   * var url = getUrlWithUuid('fcmR3XADNLgJ1ByKhqcC5Z', {isNative: true, nativeExt: '.png'});
   * 
   * @typescript
   * getUrlWithUuid(uuid: string, options?: Record<string, any>): string
   */
  getUrlWithUuid: function getUrlWithUuid(uuid, options) {
    options = options || Object.create(null);
    options.__isNative__ = options.isNative;
    options.ext = options.nativeExt;
    var bundle = bundles.find(function (bundle) {
      return bundle.getAssetInfo(uuid);
    });

    if (bundle) {
      options.bundle = bundle.name;
    }

    return cc.assetManager._transform(uuid, options);
  },

  /**
   * !#en
   * Check if the type of asset is scene
   * 
   * !#zh
   * 检查资源类型是否是场景
   * 
   * @method isScene
   * @param {*} asset - asset
   * @returns {boolean} - whether or not type is cc.SceneAsset
   * 
   * @typescript
   * isScene(asset: any): boolean
   */
  isScene: function isScene(asset) {
    return asset && (asset.constructor === cc.SceneAsset || asset instanceof cc.Scene);
  },

  /**
   * !#en
   * Normalize url, strip './' and '/'
   * 
   * !#zh
   * 标准化 url ，去除 './' 和 '/' 
   * 
   * @method normalize
   * @param {string} url - url
   * @returns {string} - The normalized url
   * 
   * @typescript
   * normalize(url: string): string
   */
  normalize: function normalize(url) {
    if (url) {
      if (url.charCodeAt(0) === 46 && url.charCodeAt(1) === 47) {
        // strip './'
        url = url.slice(2);
      } else if (url.charCodeAt(0) === 47) {
        // strip '/'
        url = url.slice(1);
      }
    }

    return url;
  }
};
module.exports = helper;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0LW1hbmFnZXIvaGVscGVyLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJidW5kbGVzIiwiaGVscGVyIiwiZGVjb2RlVXVpZCIsImdldFV1aWRGcm9tVVJMIiwiX3V1aWRSZWdleCIsInVybCIsIm1hdGNoZXMiLCJtYXRjaCIsImdldFVybFdpdGhVdWlkIiwidXVpZCIsIm9wdGlvbnMiLCJPYmplY3QiLCJjcmVhdGUiLCJfX2lzTmF0aXZlX18iLCJpc05hdGl2ZSIsImV4dCIsIm5hdGl2ZUV4dCIsImJ1bmRsZSIsImZpbmQiLCJnZXRBc3NldEluZm8iLCJuYW1lIiwiY2MiLCJhc3NldE1hbmFnZXIiLCJfdHJhbnNmb3JtIiwiaXNTY2VuZSIsImFzc2V0IiwiY29uc3RydWN0b3IiLCJTY2VuZUFzc2V0IiwiU2NlbmUiLCJub3JtYWxpemUiLCJjaGFyQ29kZUF0Iiwic2xpY2UiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO2VBQ29CQSxPQUFPLENBQUMsVUFBRDtJQUFuQkMsbUJBQUFBO0FBQ1I7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBSUMsTUFBTSxHQUFHO0FBQ1Q7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLEVBQUFBLFVBQVUsRUFBRUgsT0FBTyxDQUFDLHNCQUFELENBbkJWOztBQXFCVDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSUksRUFBQUEsY0FBYyxFQUFHLFlBQVk7QUFDekIsUUFBSUMsVUFBVSxHQUFHLDhDQUFqQjtBQUNBLFdBQU8sVUFBVUMsR0FBVixFQUFlO0FBQ2xCLFVBQUlDLE9BQU8sR0FBR0QsR0FBRyxDQUFDRSxLQUFKLENBQVVILFVBQVYsQ0FBZDs7QUFDQSxVQUFJRSxPQUFKLEVBQWE7QUFDVCxlQUFPQSxPQUFPLENBQUMsQ0FBRCxDQUFkO0FBQ0g7O0FBQ0QsYUFBTyxFQUFQO0FBQ0gsS0FORDtBQU9ILEdBVGUsRUF2Q1A7O0FBa0RUO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJRSxFQUFBQSxjQUFjLEVBQUUsd0JBQVVDLElBQVYsRUFBZ0JDLE9BQWhCLEVBQXlCO0FBQ3JDQSxJQUFBQSxPQUFPLEdBQUdBLE9BQU8sSUFBSUMsTUFBTSxDQUFDQyxNQUFQLENBQWMsSUFBZCxDQUFyQjtBQUNBRixJQUFBQSxPQUFPLENBQUNHLFlBQVIsR0FBdUJILE9BQU8sQ0FBQ0ksUUFBL0I7QUFDQUosSUFBQUEsT0FBTyxDQUFDSyxHQUFSLEdBQWNMLE9BQU8sQ0FBQ00sU0FBdEI7QUFDQSxRQUFJQyxNQUFNLEdBQUdqQixPQUFPLENBQUNrQixJQUFSLENBQWEsVUFBVUQsTUFBVixFQUFrQjtBQUN4QyxhQUFPQSxNQUFNLENBQUNFLFlBQVAsQ0FBb0JWLElBQXBCLENBQVA7QUFDSCxLQUZZLENBQWI7O0FBSUEsUUFBSVEsTUFBSixFQUFZO0FBQ1JQLE1BQUFBLE9BQU8sQ0FBQ08sTUFBUixHQUFpQkEsTUFBTSxDQUFDRyxJQUF4QjtBQUNIOztBQUVELFdBQU9DLEVBQUUsQ0FBQ0MsWUFBSCxDQUFnQkMsVUFBaEIsQ0FBMkJkLElBQTNCLEVBQWlDQyxPQUFqQyxDQUFQO0FBQ0gsR0F2RlE7O0FBeUZUO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSWMsRUFBQUEsT0FBTyxFQUFFLGlCQUFVQyxLQUFWLEVBQWlCO0FBQ3RCLFdBQU9BLEtBQUssS0FBS0EsS0FBSyxDQUFDQyxXQUFOLEtBQXNCTCxFQUFFLENBQUNNLFVBQXpCLElBQXVDRixLQUFLLFlBQVlKLEVBQUUsQ0FBQ08sS0FBaEUsQ0FBWjtBQUNILEdBekdROztBQTJHVDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLEVBQUFBLFNBQVMsRUFBRSxtQkFBVXhCLEdBQVYsRUFBZTtBQUN0QixRQUFJQSxHQUFKLEVBQVM7QUFDTCxVQUFJQSxHQUFHLENBQUN5QixVQUFKLENBQWUsQ0FBZixNQUFzQixFQUF0QixJQUE0QnpCLEdBQUcsQ0FBQ3lCLFVBQUosQ0FBZSxDQUFmLE1BQXNCLEVBQXRELEVBQTBEO0FBQ3REO0FBQ0F6QixRQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQzBCLEtBQUosQ0FBVSxDQUFWLENBQU47QUFDSCxPQUhELE1BSUssSUFBSTFCLEdBQUcsQ0FBQ3lCLFVBQUosQ0FBZSxDQUFmLE1BQXNCLEVBQTFCLEVBQThCO0FBQy9CO0FBQ0F6QixRQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQzBCLEtBQUosQ0FBVSxDQUFWLENBQU47QUFDSDtBQUNKOztBQUNELFdBQU8xQixHQUFQO0FBQ0g7QUFySVEsQ0FBYjtBQXdJQTJCLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmhDLE1BQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuY29uc3QgeyBidW5kbGVzIH0gPSByZXF1aXJlKCcuL3NoYXJlZCcpO1xuLyoqXG4gKiBAbW9kdWxlIGNjLkFzc2V0TWFuYWdlclxuICovXG4vKipcbiAqICEjZW5cbiAqIFByb3ZpZGUgc29tZSBoZWxwZnVsIGZ1bmN0aW9uLCBpdCBpcyBhIHNpbmdsZXRvbi4gQWxsIG1lbWJlciBjYW4gYmUgYWNjZXNzZWQgd2l0aCBgY2MuYXNzZXRNYW5hZ2VyLnV0aWxzYFxuICogXG4gKiAhI3poXG4gKiDmj5DkvpvkuIDkupvovoXliqnmlrnms5XvvIxoZWxwZXIg5piv5LiA5Liq5Y2V5L6LLCDmiYDmnInmiJDlkZjog73pgJrov4cgYGNjLmFzc2V0TWFuYWdlci51dGlsc2Ag6K6/6ZeuXG4gKiBcbiAqIEBjbGFzcyBIZWxwZXJcbiAqL1xudmFyIGhlbHBlciA9IHtcbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogRGVjb2RlIHV1aWQsIHJldHVybnMgdGhlIG9yaWdpbmFsIHV1aWRcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog6Kej56CBIHV1aWTvvIzov5Tlm57ljp/lp4sgdXVpZFxuICAgICAqIFxuICAgICAqIEBtZXRob2QgZGVjb2RlVXVpZFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBiYXNlNjQgLSB0aGUgZW5jb2RlZCB1dWlkXG4gICAgICogQHJldHVybnMge1N0cmluZ30gdGhlIG9yaWdpbmFsIHV1aWQgXG4gICAgICogXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdXVpZCA9ICdmY21SM1hBRE5MZ0oxQnlLaHFjQzVaJztcbiAgICAgKiB2YXIgb3JpZ2luYWxVdWlkID0gZGVjb2RlVXVpZCh1dWlkKTsgLy8gZmM5OTFkZDctMDAzMy00YjgwLTlkNDEtYzhhODZhNzAyZTU5XG4gICAgICogXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBkZWNvZGVVdWlkKGJhc2U2NDogc3RyaW5nKTogc3RyaW5nXG4gICAgICovXG4gICAgZGVjb2RlVXVpZDogcmVxdWlyZSgnLi4vdXRpbHMvZGVjb2RlLXV1aWQnKSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBFeHRyYWN0IHV1aWQgZnJvbSB1cmxcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog5LuOIHVybCDkuK3mj5Dlj5YgdXVpZFxuICAgICAqIFxuICAgICAqIEBtZXRob2QgZ2V0VXVpZEZyb21VUkxcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIC0gdXJsXG4gICAgICogQHJldHVybnMge1N0cmluZ30gdGhlIHV1aWQgcGFyc2VkIGZyb20gdXJsXG4gICAgICogXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdXJsID0gJ2Fzc2V0cy9tYWluL2ltcG9ydC9mYy9mYzk5MWRkNy0wMDMzLTRiODAtOWQ0MS1jOGE4NmE3MDJlNTkuanNvbic7XG4gICAgICogdmFyIHV1aWQgPSBnZXRVdWlkRnJvbVVSTCh1cmwpOyAvLyBmYzk5MWRkNy0wMDMzLTRiODAtOWQ0MS1jOGE4NmE3MDJlNTlcbiAgICAgKiBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGdldFV1aWRGcm9tVVJMKHVybDogc3RyaW5nKTogc3RyaW5nXG4gICAgICovXG4gICAgZ2V0VXVpZEZyb21VUkw6IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdXVpZFJlZ2V4ID0gLy4qWy9cXFxcXVswLTlhLWZBLUZdezJ9Wy9cXFxcXShbMC05YS1mQS1GLV17OCx9KS87XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2hlcyA9IHVybC5tYXRjaChfdXVpZFJlZ2V4KTtcbiAgICAgICAgICAgIGlmIChtYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoZXNbMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICB9KSgpLFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFRyYW5zZm9ybSB1dWlkIHRvIHVybFxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDovazmjaIgdXVpZCDkuLogdXJsXG4gICAgICogXG4gICAgICogQG1ldGhvZCBnZXRVcmxXaXRoVXVpZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1dWlkIC0gVGhlIHV1aWQgb2YgYXNzZXRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gU29tZSBvcHRpb25hbCBwYXJhbWV0ZXJzXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5pc05hdGl2ZV0gLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgcGF0aCB5b3Ugd2FudCBpcyBhIG5hdGl2ZSByZXNvdXJjZSBwYXRoXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm5hdGl2ZUV4dF0gLSBFeHRlbnNpb24gb2YgdGhlIG5hdGl2ZSByZXNvdXJjZSBwYXRoLCBpdCBpcyByZXF1aXJlZCB3aGVuIGlzTmF0aXZlIGlzIHRydWVcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSB1cmxcbiAgICAgKiBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vIGpzb24gcGF0aCwgJ2Fzc2V0cy9tYWluL2ltcG9ydC9mYy9mYzk5MWRkNy0wMDMzLTRiODAtOWQ0MS1jOGE4NmE3MDJlNTkuanNvbic7XG4gICAgICogdmFyIHVybCA9IGdldFVybFdpdGhVdWlkKCdmY21SM1hBRE5MZ0oxQnlLaHFjQzVaJywge2lzTmF0aXZlOiBmYWxzZX0pO1xuICAgICAqIFxuICAgICAqIC8vIHBuZyBwYXRoLCAnYXNzZXRzL21haW4vbmF0aXZlL2ZjL2ZjOTkxZGQ3LTAwMzMtNGI4MC05ZDQxLWM4YTg2YTcwMmU1OS5wbmcnO1xuICAgICAqIHZhciB1cmwgPSBnZXRVcmxXaXRoVXVpZCgnZmNtUjNYQUROTGdKMUJ5S2hxY0M1WicsIHtpc05hdGl2ZTogdHJ1ZSwgbmF0aXZlRXh0OiAnLnBuZyd9KTtcbiAgICAgKiBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGdldFVybFdpdGhVdWlkKHV1aWQ6IHN0cmluZywgb3B0aW9ucz86IFJlY29yZDxzdHJpbmcsIGFueT4pOiBzdHJpbmdcbiAgICAgKi9cbiAgICBnZXRVcmxXaXRoVXVpZDogZnVuY3Rpb24gKHV1aWQsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwgT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgb3B0aW9ucy5fX2lzTmF0aXZlX18gPSBvcHRpb25zLmlzTmF0aXZlO1xuICAgICAgICBvcHRpb25zLmV4dCA9IG9wdGlvbnMubmF0aXZlRXh0O1xuICAgICAgICB2YXIgYnVuZGxlID0gYnVuZGxlcy5maW5kKGZ1bmN0aW9uIChidW5kbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBidW5kbGUuZ2V0QXNzZXRJbmZvKHV1aWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoYnVuZGxlKSB7XG4gICAgICAgICAgICBvcHRpb25zLmJ1bmRsZSA9IGJ1bmRsZS5uYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNjLmFzc2V0TWFuYWdlci5fdHJhbnNmb3JtKHV1aWQsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ2hlY2sgaWYgdGhlIHR5cGUgb2YgYXNzZXQgaXMgc2NlbmVcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog5qOA5p+l6LWE5rqQ57G75Z6L5piv5ZCm5piv5Zy65pmvXG4gICAgICogXG4gICAgICogQG1ldGhvZCBpc1NjZW5lXG4gICAgICogQHBhcmFtIHsqfSBhc3NldCAtIGFzc2V0XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IC0gd2hldGhlciBvciBub3QgdHlwZSBpcyBjYy5TY2VuZUFzc2V0XG4gICAgICogXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBpc1NjZW5lKGFzc2V0OiBhbnkpOiBib29sZWFuXG4gICAgICovXG4gICAgaXNTY2VuZTogZnVuY3Rpb24gKGFzc2V0KSB7XG4gICAgICAgIHJldHVybiBhc3NldCAmJiAoYXNzZXQuY29uc3RydWN0b3IgPT09IGNjLlNjZW5lQXNzZXQgfHwgYXNzZXQgaW5zdGFuY2VvZiBjYy5TY2VuZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBOb3JtYWxpemUgdXJsLCBzdHJpcCAnLi8nIGFuZCAnLydcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog5qCH5YeG5YyWIHVybCDvvIzljrvpmaQgJy4vJyDlkowgJy8nIFxuICAgICAqIFxuICAgICAqIEBtZXRob2Qgbm9ybWFsaXplXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIHVybFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gVGhlIG5vcm1hbGl6ZWQgdXJsXG4gICAgICogXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBub3JtYWxpemUodXJsOiBzdHJpbmcpOiBzdHJpbmdcbiAgICAgKi9cbiAgICBub3JtYWxpemU6IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgICAgaWYgKHVybC5jaGFyQ29kZUF0KDApID09PSA0NiAmJiB1cmwuY2hhckNvZGVBdCgxKSA9PT0gNDcpIHtcbiAgICAgICAgICAgICAgICAvLyBzdHJpcCAnLi8nXG4gICAgICAgICAgICAgICAgdXJsID0gdXJsLnNsaWNlKDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodXJsLmNoYXJDb2RlQXQoMCkgPT09IDQ3KSB7XG4gICAgICAgICAgICAgICAgLy8gc3RyaXAgJy8nXG4gICAgICAgICAgICAgICAgdXJsID0gdXJsLnNsaWNlKDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBoZWxwZXI7Il0sInNvdXJjZVJvb3QiOiIvIn0=