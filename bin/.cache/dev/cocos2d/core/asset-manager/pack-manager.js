
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/asset-manager/pack-manager.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _deserializeCompiled = require("../platform/deserialize-compiled");

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
var downloader = require('./downloader');

var Cache = require('./cache');

var js = require('../platform/js');

var _require = require('./shared'),
    files = _require.files;

var _loading = new Cache();

function isLoading(val) {
  return _loading.has(val.uuid);
}
/**
 * @module cc.AssetManager
 */

/**
 * !#en
 * Handle the packed asset, include unpacking, loading, cache and so on. It is a singleton. All member can be accessed with `cc.assetManager.packManager`
 * 
 * !#zh
 * 处理打包资源，包括拆包，加载，缓存等等，这是一个单例, 所有成员能通过 `cc.assetManager.packManager` 访问
 * 
 * @class PackManager
 */


var packManager = {
  /**
   * !#en
   * Unpack the json, revert to what it was before packing
   * 
   * !#zh
   * 拆解 json 包，恢复为打包之前的内容
   * 
   * @method unpackJson
   * @param {String[]} pack - The pack
   * @param {Object} json - The content of pack
   * @param {Object} options - Some optional parameters
   * @param {Function} onComplete - Callback when finish unpacking
   * @param {Error} onComplete.err - The occurred error, null indicetes success
   * @param {Object} onComplete.content - The unpacked assets
   * 
   * @example
   * downloader.downloadFile('pack.json', {responseType: 'json'}, null, (err, file) => {
   *      packManager.unpackJson(['a', 'b'], file, null, (err, data) => console.log(err));
   * });
   * 
   * @typescript
   * unpackJson(pack: string[], json: any, options: Record<string, any>, onComplete?: (err: Error, content: any) => void): void
   */
  unpackJson: function unpackJson(pack, json, options, onComplete) {
    var out = js.createMap(true),
        err = null;

    if (Array.isArray(json)) {
      json = (0, _deserializeCompiled.unpackJSONs)(json);

      if (json.length !== pack.length) {
        cc.errorID(4915);
      }

      for (var i = 0; i < pack.length; i++) {
        var key = pack[i] + '@import';
        out[key] = json[i];
      }
    } else {
      var textureType = js._getClassId(cc.Texture2D);

      if (json.type === textureType) {
        if (json.data) {
          var datas = json.data.split('|');

          if (datas.length !== pack.length) {
            cc.errorID(4915);
          }

          for (var _i = 0; _i < pack.length; _i++) {
            out[pack[_i] + '@import'] = (0, _deserializeCompiled.packCustomObjData)(textureType, datas[_i], true);
          }
        }
      } else {
        err = new Error('unmatched type pack!');
        out = null;
      }
    }

    onComplete && onComplete(err, out);
  },
  init: function init() {
    _loading.clear();
  },

  /**
   * !#en
   * Register custom handler if you want to change default behavior or extend packManager to unpack other format pack
   * 
   * !#zh
   * 当你想修改默认行为或者拓展 packManager 来拆分其他格式的包时可以注册自定义的 handler
   * 
   * @method register
   * @param {string|Object} type - Extension likes '.bin' or map likes {'.bin': binHandler, '.ab': abHandler}
   * @param {Function} [handler] - handler
   * @param {string} handler.packUuid - The uuid of pack
   * @param {*} handler.data - The content of pack
   * @param {Object} handler.options - Some optional parameters
   * @param {Function} handler.onComplete - Callback when finishing unpacking
   * 
   * @example
   * packManager.register('.bin', (packUuid, file, options, onComplete) => onComplete(null, null));
   * packManager.register({'.bin': (packUuid, file, options, onComplete) => onComplete(null, null), '.ab': (packUuid, file, options, onComplete) => onComplete(null, null)});
   * 
   * @typescript
   * register(type: string, handler: (packUuid: string, data: any, options: Record<string, any>, onComplete: (err: Error, content: any) => void) => void): void
   * register(map: Record<string, (packUuid: string, data: any, options: Record<string, any>, onComplete: (err: Error, content: any) => void) => void>): void
   */
  register: function register(type, handler) {
    if (typeof type === 'object') {
      js.mixin(unpackers, type);
    } else {
      unpackers[type] = handler;
    }
  },

  /**
   * !#en
   * Use corresponding handler to unpack package
   * 
   * !#zh
   * 用对应的 handler 来进行解包 
   * 
   * @method unpack
   * @param {String[]} pack - The uuid of packed assets 
   * @param {*} data - The packed data
   * @param {string} type - The type indicates that which handler should be used to download, such as '.jpg'
   * @param {Object} options - Some optional parameter
   * @param {Function} onComplete - callback when finishing unpacking
   * @param {Error} onComplete.err -  The occurred error, null indicetes success
   * @param {*} onComplete.data - Original assets
   * 
   * @example
   * downloader.downloadFile('pack.json', {responseType: 'json'}, null, (err, file) => {
   *      packManager.unpack(['2fawq123d', '1zsweq23f'], file, '.json', null, (err, data) => console.log(err));
   * });
   * 
   * @typescript
   * unpack(pack: string[], data: any, type: string, options: Record<string, any>, onComplete?: (err: Error, data: any) => void): void
   */
  unpack: function unpack(pack, data, type, options, onComplete) {
    if (!data) {
      onComplete && onComplete(new Error('package data is wrong!'));
      return;
    }

    var unpacker = unpackers[type];
    unpacker(pack, data, options, onComplete);
  },

  /**
   * !#en
   * Download request item, If item is not in any package, download as usual. Otherwise, download the corresponding package and unpack it. 
   * And then retrieve the corresponding content form it.
   * 
   * !#zh
   * 下载请求对象，如果请求对象不在任何包内，则正常下载，否则下载对应的 package 并进行拆解，并取回包内对应的内容
   * 
   * @method load
   * @param {RequestItem} item - Some item you want to download
   * @param {Object} options - Some optional parameters
   * @param {Function} onComplete - Callback when finished
   * @param {Err} onComplete.err - The occurred error, null indicetes success
   * @param {*} onComplete.data - The unpacked data retrieved from package
   * 
   * @example
   * var requestItem = cc.AssetManager.RequestItem.create();
   * requestItem.uuid = 'fcmR3XADNLgJ1ByKhqcC5Z';
   * requestItem.info = config.getAssetInfo('fcmR3XADNLgJ1ByKhqcC5Z');
   * packManager.load(requestItem, null, (err, data) => console.log(err));
   * 
   * @typescript
   * load(item: RequestItem, options: Record<string, any>, onComplete: (err: Error, data: any) => void): void
   * 
   */
  load: function load(item, options, onComplete) {
    // if not in any package, download as uausl
    if (item.isNative || !item.info || !item.info.packs) return downloader.download(item.id, item.url, item.ext, item.options, onComplete);
    if (files.has(item.id)) return onComplete(null, files.get(item.id));
    var packs = item.info.packs; // find a loading package

    var pack = packs.find(isLoading);
    if (pack) return _loading.get(pack.uuid).push({
      onComplete: onComplete,
      id: item.id
    }); // download a new package

    pack = packs[0];

    _loading.add(pack.uuid, [{
      onComplete: onComplete,
      id: item.id
    }]);

    var url = cc.assetManager._transform(pack.uuid, {
      ext: pack.ext,
      bundle: item.config.name
    });

    downloader.download(pack.uuid, url, pack.ext, item.options, function (err, data) {
      files.remove(pack.uuid);

      if (err) {
        cc.error(err.message, err.stack);
      } // unpack package


      packManager.unpack(pack.packs, data, pack.ext, item.options, function (err, result) {
        if (!err) {
          for (var id in result) {
            files.add(id, result[id]);
          }
        }

        var callbacks = _loading.remove(pack.uuid);

        for (var i = 0, l = callbacks.length; i < l; i++) {
          var cb = callbacks[i];

          if (err) {
            cb.onComplete(err);
            continue;
          }

          var data = result[cb.id];

          if (!data) {
            cb.onComplete(new Error('can not retrieve data from package'));
          } else {
            cb.onComplete(null, data);
          }
        }
      });
    });
  }
};
var unpackers = {
  '.json': packManager.unpackJson
};
module.exports = packManager;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0LW1hbmFnZXIvcGFjay1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbImRvd25sb2FkZXIiLCJyZXF1aXJlIiwiQ2FjaGUiLCJqcyIsImZpbGVzIiwiX2xvYWRpbmciLCJpc0xvYWRpbmciLCJ2YWwiLCJoYXMiLCJ1dWlkIiwicGFja01hbmFnZXIiLCJ1bnBhY2tKc29uIiwicGFjayIsImpzb24iLCJvcHRpb25zIiwib25Db21wbGV0ZSIsIm91dCIsImNyZWF0ZU1hcCIsImVyciIsIkFycmF5IiwiaXNBcnJheSIsImxlbmd0aCIsImNjIiwiZXJyb3JJRCIsImkiLCJrZXkiLCJ0ZXh0dXJlVHlwZSIsIl9nZXRDbGFzc0lkIiwiVGV4dHVyZTJEIiwidHlwZSIsImRhdGEiLCJkYXRhcyIsInNwbGl0IiwiRXJyb3IiLCJpbml0IiwiY2xlYXIiLCJyZWdpc3RlciIsImhhbmRsZXIiLCJtaXhpbiIsInVucGFja2VycyIsInVucGFjayIsInVucGFja2VyIiwibG9hZCIsIml0ZW0iLCJpc05hdGl2ZSIsImluZm8iLCJwYWNrcyIsImRvd25sb2FkIiwiaWQiLCJ1cmwiLCJleHQiLCJnZXQiLCJmaW5kIiwicHVzaCIsImFkZCIsImFzc2V0TWFuYWdlciIsIl90cmFuc2Zvcm0iLCJidW5kbGUiLCJjb25maWciLCJuYW1lIiwicmVtb3ZlIiwiZXJyb3IiLCJtZXNzYWdlIiwic3RhY2siLCJyZXN1bHQiLCJjYWxsYmFja3MiLCJsIiwiY2IiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBeUJBOztBQXpCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQSxJQUFNQSxVQUFVLEdBQUdDLE9BQU8sQ0FBQyxjQUFELENBQTFCOztB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QXBCO0FBQ0g7QUFDSjs7QUFDRCxZQUFJaUIsU0FBUyxHQUFHNUQsUUFBUSxDQUFDdUQsTUFBVCxDQUFnQmhELElBQUksQ0FBQ0gsSUFBckIsQ0FBaEI7O0FBQ0EsYUFBSyxJQUFJZSxDQUFDLEdBQUcsQ0FBUixFQUFXMEMsQ0FBQyxHQUFHRCxTQUFTLENBQUM1QyxNQUE5QixFQUFzQ0csQ0FBQyxHQUFHMEMsQ0FBMUMsRUFBNkMxQyxDQUFDLEVBQTlDLEVBQWtEO0FBQzlDLGNBQUkyQyxFQUFFLEdBQUdGLFNBQVMsQ0FBQ3pDLENBQUQsQ0FBbEI7O0FBQ0EsY0FBSU4sR0FBSixFQUFTO0FBQ0xpRCxZQUFBQSxFQUFFLENBQUNwRCxVQUFILENBQWNHLEdBQWQ7QUFDQTtBQUNIOztBQUVELGNBQUlZLElBQUksR0FBR2tDLE1BQU0sQ0FBQ0csRUFBRSxDQUFDbkIsRUFBSixDQUFqQjs7QUFDQSxjQUFJLENBQUNsQixJQUFMLEVBQVc7QUFDUHFDLFlBQUFBLEVBQUUsQ0FBQ3BELFVBQUgsQ0FBYyxJQUFJa0IsS0FBSixDQUFVLG9DQUFWLENBQWQ7QUFDSCxXQUZELE1BR0s7QUFDRGtDLFlBQUFBLEVBQUUsQ0FBQ3BELFVBQUgsQ0FBYyxJQUFkLEVBQW9CZSxJQUFwQjtBQUNIO0FBQ0o7QUFDSixPQXRCRDtBQXVCSCxLQTdCRDtBQThCSDtBQTdNYSxDQUFsQjtBQWdOQSxJQUFJUyxTQUFTLEdBQUc7QUFDWixXQUFTN0IsV0FBVyxDQUFDQztBQURULENBQWhCO0FBSUF5RCxNQUFNLENBQUNDLE9BQVAsR0FBaUIzRCxXQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgeyB1bnBhY2tKU09OcywgcGFja0N1c3RvbU9iakRhdGEgfSBmcm9tICcuLi9wbGF0Zm9ybS9kZXNlcmlhbGl6ZS1jb21waWxlZCc7XG5cbmNvbnN0IGRvd25sb2FkZXIgPSByZXF1aXJlKCcuL2Rvd25sb2FkZXInKTtcbmNvbnN0IENhY2hlID0gcmVxdWlyZSgnLi9jYWNoZScpO1xuY29uc3QganMgPSByZXF1aXJlKCcuLi9wbGF0Zm9ybS9qcycpO1xuY29uc3QgeyBmaWxlcyB9ID0gcmVxdWlyZSgnLi9zaGFyZWQnKTtcblxudmFyIF9sb2FkaW5nID0gbmV3IENhY2hlKCk7XG5cbmZ1bmN0aW9uIGlzTG9hZGluZyAodmFsKSB7XG4gICAgcmV0dXJuIF9sb2FkaW5nLmhhcyh2YWwudXVpZCk7XG59XG5cblxuLyoqXG4gKiBAbW9kdWxlIGNjLkFzc2V0TWFuYWdlclxuICovXG4vKipcbiAqICEjZW5cbiAqIEhhbmRsZSB0aGUgcGFja2VkIGFzc2V0LCBpbmNsdWRlIHVucGFja2luZywgbG9hZGluZywgY2FjaGUgYW5kIHNvIG9uLiBJdCBpcyBhIHNpbmdsZXRvbi4gQWxsIG1lbWJlciBjYW4gYmUgYWNjZXNzZWQgd2l0aCBgY2MuYXNzZXRNYW5hZ2VyLnBhY2tNYW5hZ2VyYFxuICogXG4gKiAhI3poXG4gKiDlpITnkIbmiZPljIXotYTmupDvvIzljIXmi6zmi4bljIXvvIzliqDovb3vvIznvJPlrZjnrYnnrYnvvIzov5nmmK/kuIDkuKrljZXkvossIOaJgOacieaIkOWRmOiDvemAmui/hyBgY2MuYXNzZXRNYW5hZ2VyLnBhY2tNYW5hZ2VyYCDorr/pl65cbiAqIFxuICogQGNsYXNzIFBhY2tNYW5hZ2VyXG4gKi9cbnZhciBwYWNrTWFuYWdlciA9IHtcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBVbnBhY2sgdGhlIGpzb24sIHJldmVydCB0byB3aGF0IGl0IHdhcyBiZWZvcmUgcGFja2luZ1xuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDmi4bop6MganNvbiDljIXvvIzmgaLlpI3kuLrmiZPljIXkuYvliY3nmoTlhoXlrrlcbiAgICAgKiBcbiAgICAgKiBAbWV0aG9kIHVucGFja0pzb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBwYWNrIC0gVGhlIHBhY2tcbiAgICAgKiBAcGFyYW0ge09iamVjdH0ganNvbiAtIFRoZSBjb250ZW50IG9mIHBhY2tcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFNvbWUgb3B0aW9uYWwgcGFyYW1ldGVyc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9uQ29tcGxldGUgLSBDYWxsYmFjayB3aGVuIGZpbmlzaCB1bnBhY2tpbmdcbiAgICAgKiBAcGFyYW0ge0Vycm9yfSBvbkNvbXBsZXRlLmVyciAtIFRoZSBvY2N1cnJlZCBlcnJvciwgbnVsbCBpbmRpY2V0ZXMgc3VjY2Vzc1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvbkNvbXBsZXRlLmNvbnRlbnQgLSBUaGUgdW5wYWNrZWQgYXNzZXRzXG4gICAgICogXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBkb3dubG9hZGVyLmRvd25sb2FkRmlsZSgncGFjay5qc29uJywge3Jlc3BvbnNlVHlwZTogJ2pzb24nfSwgbnVsbCwgKGVyciwgZmlsZSkgPT4ge1xuICAgICAqICAgICAgcGFja01hbmFnZXIudW5wYWNrSnNvbihbJ2EnLCAnYiddLCBmaWxlLCBudWxsLCAoZXJyLCBkYXRhKSA9PiBjb25zb2xlLmxvZyhlcnIpKTtcbiAgICAgKiB9KTtcbiAgICAgKiBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHVucGFja0pzb24ocGFjazogc3RyaW5nW10sIGpzb246IGFueSwgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55Piwgb25Db21wbGV0ZT86IChlcnI6IEVycm9yLCBjb250ZW50OiBhbnkpID0+IHZvaWQpOiB2b2lkXG4gICAgICovXG4gICAgdW5wYWNrSnNvbiAocGFjaywganNvbiwgb3B0aW9ucywgb25Db21wbGV0ZSkge1xuXG4gICAgICAgIHZhciBvdXQgPSBqcy5jcmVhdGVNYXAodHJ1ZSksIGVyciA9IG51bGw7XG4gICAgICAgIFxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShqc29uKSkge1xuXG4gICAgICAgICAgICBqc29uID0gdW5wYWNrSlNPTnMoanNvbik7XG5cbiAgICAgICAgICAgIGlmIChqc29uLmxlbmd0aCAhPT0gcGFjay5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDQ5MTUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYWNrLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IHBhY2tbaV0gKyAnQGltcG9ydCc7XG4gICAgICAgICAgICAgICAgb3V0W2tleV0gPSBqc29uW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgdGV4dHVyZVR5cGUgPSBqcy5fZ2V0Q2xhc3NJZChjYy5UZXh0dXJlMkQpO1xuICAgICAgICAgICAgaWYgKGpzb24udHlwZSA9PT0gdGV4dHVyZVR5cGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoanNvbi5kYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhcyA9IGpzb24uZGF0YS5zcGxpdCgnfCcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YXMubGVuZ3RoICE9PSBwYWNrLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3JJRCg0OTE1KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhY2subGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dFtwYWNrW2ldICsgJ0BpbXBvcnQnXSA9IHBhY2tDdXN0b21PYmpEYXRhKHRleHR1cmVUeXBlLCBkYXRhc1tpXSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBlcnIgPSBuZXcgRXJyb3IoJ3VubWF0Y2hlZCB0eXBlIHBhY2shJyk7XG4gICAgICAgICAgICAgICAgb3V0ID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBvbkNvbXBsZXRlICYmIG9uQ29tcGxldGUoZXJyLCBvdXQpO1xuICAgIH0sXG5cbiAgICBpbml0ICgpIHtcbiAgICAgICAgX2xvYWRpbmcuY2xlYXIoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJlZ2lzdGVyIGN1c3RvbSBoYW5kbGVyIGlmIHlvdSB3YW50IHRvIGNoYW5nZSBkZWZhdWx0IGJlaGF2aW9yIG9yIGV4dGVuZCBwYWNrTWFuYWdlciB0byB1bnBhY2sgb3RoZXIgZm9ybWF0IHBhY2tcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog5b2T5L2g5oOz5L+u5pS56buY6K6k6KGM5Li65oiW6ICF5ouT5bGVIHBhY2tNYW5hZ2VyIOadpeaLhuWIhuWFtuS7luagvOW8j+eahOWMheaXtuWPr+S7peazqOWGjOiHquWumuS5ieeahCBoYW5kbGVyXG4gICAgICogXG4gICAgICogQG1ldGhvZCByZWdpc3RlclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfE9iamVjdH0gdHlwZSAtIEV4dGVuc2lvbiBsaWtlcyAnLmJpbicgb3IgbWFwIGxpa2VzIHsnLmJpbic6IGJpbkhhbmRsZXIsICcuYWInOiBhYkhhbmRsZXJ9XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2hhbmRsZXJdIC0gaGFuZGxlclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBoYW5kbGVyLnBhY2tVdWlkIC0gVGhlIHV1aWQgb2YgcGFja1xuICAgICAqIEBwYXJhbSB7Kn0gaGFuZGxlci5kYXRhIC0gVGhlIGNvbnRlbnQgb2YgcGFja1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoYW5kbGVyLm9wdGlvbnMgLSBTb21lIG9wdGlvbmFsIHBhcmFtZXRlcnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyLm9uQ29tcGxldGUgLSBDYWxsYmFjayB3aGVuIGZpbmlzaGluZyB1bnBhY2tpbmdcbiAgICAgKiBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHBhY2tNYW5hZ2VyLnJlZ2lzdGVyKCcuYmluJywgKHBhY2tVdWlkLCBmaWxlLCBvcHRpb25zLCBvbkNvbXBsZXRlKSA9PiBvbkNvbXBsZXRlKG51bGwsIG51bGwpKTtcbiAgICAgKiBwYWNrTWFuYWdlci5yZWdpc3Rlcih7Jy5iaW4nOiAocGFja1V1aWQsIGZpbGUsIG9wdGlvbnMsIG9uQ29tcGxldGUpID0+IG9uQ29tcGxldGUobnVsbCwgbnVsbCksICcuYWInOiAocGFja1V1aWQsIGZpbGUsIG9wdGlvbnMsIG9uQ29tcGxldGUpID0+IG9uQ29tcGxldGUobnVsbCwgbnVsbCl9KTtcbiAgICAgKiBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHJlZ2lzdGVyKHR5cGU6IHN0cmluZywgaGFuZGxlcjogKHBhY2tVdWlkOiBzdHJpbmcsIGRhdGE6IGFueSwgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55Piwgb25Db21wbGV0ZTogKGVycjogRXJyb3IsIGNvbnRlbnQ6IGFueSkgPT4gdm9pZCkgPT4gdm9pZCk6IHZvaWRcbiAgICAgKiByZWdpc3RlcihtYXA6IFJlY29yZDxzdHJpbmcsIChwYWNrVXVpZDogc3RyaW5nLCBkYXRhOiBhbnksIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4sIG9uQ29tcGxldGU6IChlcnI6IEVycm9yLCBjb250ZW50OiBhbnkpID0+IHZvaWQpID0+IHZvaWQ+KTogdm9pZFxuICAgICAqL1xuICAgIHJlZ2lzdGVyICh0eXBlLCBoYW5kbGVyKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGpzLm1peGluKHVucGFja2VycywgdHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB1bnBhY2tlcnNbdHlwZV0gPSBoYW5kbGVyO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBcbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVXNlIGNvcnJlc3BvbmRpbmcgaGFuZGxlciB0byB1bnBhY2sgcGFja2FnZVxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDnlKjlr7nlupTnmoQgaGFuZGxlciDmnaXov5vooYzop6PljIUgXG4gICAgICogXG4gICAgICogQG1ldGhvZCB1bnBhY2tcbiAgICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBwYWNrIC0gVGhlIHV1aWQgb2YgcGFja2VkIGFzc2V0cyBcbiAgICAgKiBAcGFyYW0geyp9IGRhdGEgLSBUaGUgcGFja2VkIGRhdGFcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIGluZGljYXRlcyB0aGF0IHdoaWNoIGhhbmRsZXIgc2hvdWxkIGJlIHVzZWQgdG8gZG93bmxvYWQsIHN1Y2ggYXMgJy5qcGcnXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBTb21lIG9wdGlvbmFsIHBhcmFtZXRlclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9uQ29tcGxldGUgLSBjYWxsYmFjayB3aGVuIGZpbmlzaGluZyB1bnBhY2tpbmdcbiAgICAgKiBAcGFyYW0ge0Vycm9yfSBvbkNvbXBsZXRlLmVyciAtICBUaGUgb2NjdXJyZWQgZXJyb3IsIG51bGwgaW5kaWNldGVzIHN1Y2Nlc3NcbiAgICAgKiBAcGFyYW0geyp9IG9uQ29tcGxldGUuZGF0YSAtIE9yaWdpbmFsIGFzc2V0c1xuICAgICAqIFxuICAgICAqIEBleGFtcGxlXG4gICAgICogZG93bmxvYWRlci5kb3dubG9hZEZpbGUoJ3BhY2suanNvbicsIHtyZXNwb25zZVR5cGU6ICdqc29uJ30sIG51bGwsIChlcnIsIGZpbGUpID0+IHtcbiAgICAgKiAgICAgIHBhY2tNYW5hZ2VyLnVucGFjayhbJzJmYXdxMTIzZCcsICcxenN3ZXEyM2YnXSwgZmlsZSwgJy5qc29uJywgbnVsbCwgKGVyciwgZGF0YSkgPT4gY29uc29sZS5sb2coZXJyKSk7XG4gICAgICogfSk7XG4gICAgICogXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiB1bnBhY2socGFjazogc3RyaW5nW10sIGRhdGE6IGFueSwgdHlwZTogc3RyaW5nLCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvbkNvbXBsZXRlPzogKGVycjogRXJyb3IsIGRhdGE6IGFueSkgPT4gdm9pZCk6IHZvaWRcbiAgICAgKi9cbiAgICB1bnBhY2sgKHBhY2ssIGRhdGEsIHR5cGUsIG9wdGlvbnMsIG9uQ29tcGxldGUpIHtcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICBvbkNvbXBsZXRlICYmIG9uQ29tcGxldGUobmV3IEVycm9yKCdwYWNrYWdlIGRhdGEgaXMgd3JvbmchJykpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciB1bnBhY2tlciA9IHVucGFja2Vyc1t0eXBlXTtcbiAgICAgICAgdW5wYWNrZXIocGFjaywgZGF0YSwgb3B0aW9ucywgb25Db21wbGV0ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBEb3dubG9hZCByZXF1ZXN0IGl0ZW0sIElmIGl0ZW0gaXMgbm90IGluIGFueSBwYWNrYWdlLCBkb3dubG9hZCBhcyB1c3VhbC4gT3RoZXJ3aXNlLCBkb3dubG9hZCB0aGUgY29ycmVzcG9uZGluZyBwYWNrYWdlIGFuZCB1bnBhY2sgaXQuIFxuICAgICAqIEFuZCB0aGVuIHJldHJpZXZlIHRoZSBjb3JyZXNwb25kaW5nIGNvbnRlbnQgZm9ybSBpdC5cbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog5LiL6L296K+35rGC5a+56LGh77yM5aaC5p6c6K+35rGC5a+56LGh5LiN5Zyo5Lu75L2V5YyF5YaF77yM5YiZ5q2j5bi45LiL6L2977yM5ZCm5YiZ5LiL6L295a+55bqU55qEIHBhY2thZ2Ug5bm26L+b6KGM5ouG6Kej77yM5bm25Y+W5Zue5YyF5YaF5a+55bqU55qE5YaF5a65XG4gICAgICogXG4gICAgICogQG1ldGhvZCBsb2FkXG4gICAgICogQHBhcmFtIHtSZXF1ZXN0SXRlbX0gaXRlbSAtIFNvbWUgaXRlbSB5b3Ugd2FudCB0byBkb3dubG9hZFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gU29tZSBvcHRpb25hbCBwYXJhbWV0ZXJzXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25Db21wbGV0ZSAtIENhbGxiYWNrIHdoZW4gZmluaXNoZWRcbiAgICAgKiBAcGFyYW0ge0Vycn0gb25Db21wbGV0ZS5lcnIgLSBUaGUgb2NjdXJyZWQgZXJyb3IsIG51bGwgaW5kaWNldGVzIHN1Y2Nlc3NcbiAgICAgKiBAcGFyYW0geyp9IG9uQ29tcGxldGUuZGF0YSAtIFRoZSB1bnBhY2tlZCBkYXRhIHJldHJpZXZlZCBmcm9tIHBhY2thZ2VcbiAgICAgKiBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciByZXF1ZXN0SXRlbSA9IGNjLkFzc2V0TWFuYWdlci5SZXF1ZXN0SXRlbS5jcmVhdGUoKTtcbiAgICAgKiByZXF1ZXN0SXRlbS51dWlkID0gJ2ZjbVIzWEFETkxnSjFCeUtocWNDNVonO1xuICAgICAqIHJlcXVlc3RJdGVtLmluZm8gPSBjb25maWcuZ2V0QXNzZXRJbmZvKCdmY21SM1hBRE5MZ0oxQnlLaHFjQzVaJyk7XG4gICAgICogcGFja01hbmFnZXIubG9hZChyZXF1ZXN0SXRlbSwgbnVsbCwgKGVyciwgZGF0YSkgPT4gY29uc29sZS5sb2coZXJyKSk7XG4gICAgICogXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBsb2FkKGl0ZW06IFJlcXVlc3RJdGVtLCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvbkNvbXBsZXRlOiAoZXJyOiBFcnJvciwgZGF0YTogYW55KSA9PiB2b2lkKTogdm9pZFxuICAgICAqIFxuICAgICAqL1xuICAgIGxvYWQgKGl0ZW0sIG9wdGlvbnMsIG9uQ29tcGxldGUpIHtcbiAgICAgICAgLy8gaWYgbm90IGluIGFueSBwYWNrYWdlLCBkb3dubG9hZCBhcyB1YXVzbFxuICAgICAgICBpZiAoaXRlbS5pc05hdGl2ZSB8fCAhaXRlbS5pbmZvIHx8ICFpdGVtLmluZm8ucGFja3MpIHJldHVybiBkb3dubG9hZGVyLmRvd25sb2FkKGl0ZW0uaWQsIGl0ZW0udXJsLCBpdGVtLmV4dCwgaXRlbS5vcHRpb25zLCBvbkNvbXBsZXRlKTtcblxuICAgICAgICBpZiAoZmlsZXMuaGFzKGl0ZW0uaWQpKSByZXR1cm4gb25Db21wbGV0ZShudWxsLCBmaWxlcy5nZXQoaXRlbS5pZCkpO1xuXG4gICAgICAgIHZhciBwYWNrcyA9IGl0ZW0uaW5mby5wYWNrcztcblxuICAgICAgICAvLyBmaW5kIGEgbG9hZGluZyBwYWNrYWdlXG4gICAgICAgIHZhciBwYWNrID0gcGFja3MuZmluZChpc0xvYWRpbmcpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHBhY2spIHJldHVybiBfbG9hZGluZy5nZXQocGFjay51dWlkKS5wdXNoKHsgb25Db21wbGV0ZSwgaWQ6IGl0ZW0uaWQgfSk7XG5cbiAgICAgICAgLy8gZG93bmxvYWQgYSBuZXcgcGFja2FnZVxuICAgICAgICBwYWNrID0gcGFja3NbMF07XG4gICAgICAgIF9sb2FkaW5nLmFkZChwYWNrLnV1aWQsIFt7IG9uQ29tcGxldGUsIGlkOiBpdGVtLmlkIH1dKTtcblxuICAgICAgICBsZXQgdXJsID0gY2MuYXNzZXRNYW5hZ2VyLl90cmFuc2Zvcm0ocGFjay51dWlkLCB7ZXh0OiBwYWNrLmV4dCwgYnVuZGxlOiBpdGVtLmNvbmZpZy5uYW1lfSk7XG5cbiAgICAgICAgZG93bmxvYWRlci5kb3dubG9hZChwYWNrLnV1aWQsIHVybCwgcGFjay5leHQsIGl0ZW0ub3B0aW9ucywgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgZmlsZXMucmVtb3ZlKHBhY2sudXVpZCk7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3IoZXJyLm1lc3NhZ2UsIGVyci5zdGFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB1bnBhY2sgcGFja2FnZVxuICAgICAgICAgICAgcGFja01hbmFnZXIudW5wYWNrKHBhY2sucGFja3MsIGRhdGEsIHBhY2suZXh0LCBpdGVtLm9wdGlvbnMsIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGlkIGluIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXMuYWRkKGlkLCByZXN1bHRbaWRdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgY2FsbGJhY2tzID0gX2xvYWRpbmcucmVtb3ZlKHBhY2sudXVpZCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjYiA9IGNhbGxiYWNrc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2Iub25Db21wbGV0ZShlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHJlc3VsdFtjYi5pZF07XG4gICAgICAgICAgICAgICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2Iub25Db21wbGV0ZShuZXcgRXJyb3IoJ2NhbiBub3QgcmV0cmlldmUgZGF0YSBmcm9tIHBhY2thZ2UnKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYi5vbkNvbXBsZXRlKG51bGwsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbnZhciB1bnBhY2tlcnMgPSB7XG4gICAgJy5qc29uJzogcGFja01hbmFnZXIudW5wYWNrSnNvblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBwYWNrTWFuYWdlcjtcbiJdLCJzb3VyY2VSb290IjoiLyJ9