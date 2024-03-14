
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/asset-manager/parser.js';
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

/**
 * @module cc.AssetManager
 */
var plistParser = require('../platform/CCSAXParser').plistParser;

var js = require('../platform/js');

var deserialize = require('./deserialize');

var Cache = require('./cache');

var _require = require('./helper'),
    isScene = _require.isScene;

var _require2 = require('./shared'),
    parsed = _require2.parsed,
    files = _require2.files;

var _require3 = require('../platform/CCSys'),
    __audioSupport = _require3.__audioSupport,
    capabilities = _require3.capabilities;

var _parsing = new Cache();
/**
 * !#en
 * Parse the downloaded file, it's a singleton, all member can be accessed with `cc.assetManager.parser`
 * 
 * !#zh
 * 解析已下载的文件，parser 是一个单例, 所有成员能通过 `cc.assetManaager.parser` 访问
 * 
 * @class Parser
 */


var parser = {
  /*
   * !#en
   * Parse image file
   * 
   * !#zh
   * 解析图片文件
   * 
   * @method parseImage
   * @param {Blob} file - The downloaded file
   * @param {Object} options - Some optional paramters 
   * @param {Function} [onComplete] - callback when finish parsing.
   * @param {Error} onComplete.err - The occurred error, null indicetes success
   * @param {ImageBitmap|HTMLImageElement} onComplete.img - The parsed content
   * 
   * @example
   * downloader.downloadFile('test.jpg', {responseType: 'blob'}, null, (err, file) => {
   *      parser.parseImage(file, null, (err, img) => console.log(err));
   * });
   * 
   * @typescript
   * parseImage(file: Blob, options: Record<string, any>, onComplete?: (err: Error, img: ImageBitmap|HTMLImageElement) => void): void
   */
  parseImage: function parseImage(file, options, onComplete) {
    if (capabilities.imageBitmap && file instanceof Blob) {
      var imageOptions = {};
      imageOptions.imageOrientation = options.__flipY__ ? 'flipY' : 'none';
      imageOptions.premultiplyAlpha = options.__premultiplyAlpha__ ? 'premultiply' : 'none';
      createImageBitmap(file, imageOptions).then(function (result) {
        result.flipY = !!options.__flipY__;
        result.premultiplyAlpha = !!options.__premultiplyAlpha__;
        onComplete && onComplete(null, result);
      }, function (err) {
        onComplete && onComplete(err, null);
      });
    } else {
      onComplete && onComplete(null, file);
    }
  },

  /*
   * !#en
   * Parse audio file
   * 
   * !#zh
   * 解析音频文件
   * 
   * @method parseAudio
   * @param {ArrayBuffer|HTMLAudioElement} file - The downloaded file
   * @param {Object} options - Some optional paramters
   * @param {Function} onComplete - Callback when finish parsing.
   * @param {Error} onComplete.err - The occurred error, null indicetes success
   * @param {AudioBuffer|HTMLAudioElement} onComplete.audio - The parsed content
   * 
   * @example
   * downloader.downloadFile('test.mp3', {responseType: 'arraybuffer'}, null, (err, file) => {
   *      parser.parseAudio(file, null, (err, audio) => console.log(err));
   * });
   * 
   * @typescript
   * parseAudio(file: ArrayBuffer|HTMLAudioElement, options: Record<string, any>, onComplete?: (err: Error, audio: AudioBuffer|HTMLAudioElement) => void): void
   */
  parseAudio: function parseAudio(file, options, onComplete) {
    if (file instanceof ArrayBuffer) {
      __audioSupport.context.decodeAudioData(file, function (buffer) {
        onComplete && onComplete(null, buffer);
      }, function (e) {
        onComplete && onComplete(e, null);
      });
    } else {
      onComplete && onComplete(null, file);
    }
  },

  /*
   * !#en
   * Parse pvr file 
   * 
   * !#zh
   * 解析压缩纹理格式 pvr 文件
   * 
   * @method parsePVRTex
   * @param {ArrayBuffer|ArrayBufferView} file - The downloaded file
   * @param {Object} options - Some optional paramters
   * @param {Function} onComplete - Callback when finish parsing.
   * @param {Error} onComplete.err - The occurred error, null indicetes success
   * @param {Object} onComplete.pvrAsset - The parsed content
   * 
   * @example
   * downloader.downloadFile('test.pvr', {responseType: 'arraybuffer'}, null, (err, file) => {
   *      parser.parsePVRTex(file, null, (err, pvrAsset) => console.log(err));
   * });
   * 
   * @typescript
   * parsePVRTex(file: ArrayBuffer|ArrayBufferView, options: Record<string, any>, onComplete: (err: Error, pvrAsset: {_data: Uint8Array, _compressed: boolean, width: number, height: number}) => void): void
   */
  parsePVRTex: function () {
    //===============//
    // PVR constants //
    //===============//
    // https://github.com/toji/texture-tester/blob/master/js/webgl-texture-util.js#L424
    var PVR_HEADER_LENGTH = 13; // The header length in 32 bit ints.

    var PVR_MAGIC = 0x03525650; //0x50565203;
    // Offsets into the header array.

    var PVR_HEADER_MAGIC = 0;
    var PVR_HEADER_FORMAT = 2;
    var PVR_HEADER_HEIGHT = 6;
    var PVR_HEADER_WIDTH = 7;
    var PVR_HEADER_MIPMAPCOUNT = 11;
    var PVR_HEADER_METADATA = 12;
    return function (file, options, onComplete) {
      var err = null,
          out = null;

      try {
        var buffer = file instanceof ArrayBuffer ? file : file.buffer; // Get a view of the arrayBuffer that represents the DDS header.

        var header = new Int32Array(buffer, 0, PVR_HEADER_LENGTH); // Do some sanity checks to make sure this is a valid DDS file.

        if (header[PVR_HEADER_MAGIC] != PVR_MAGIC) {
          throw new Error("Invalid magic number in PVR header");
        } // Gather other basic metrics and a view of the raw the DXT data.


        var width = header[PVR_HEADER_WIDTH];
        var height = header[PVR_HEADER_HEIGHT];
        var dataOffset = header[PVR_HEADER_METADATA] + 52;
        var pvrtcData = new Uint8Array(buffer, dataOffset);
        out = {
          _data: pvrtcData,
          _compressed: true,
          width: width,
          height: height
        };
      } catch (e) {
        err = e;
      }

      onComplete && onComplete(err, out);
    };
  }(),

  /*
   * !#en
   * Parse pkm file
   * 
   * !#zh
   * 解析压缩纹理格式 pkm 文件
   * 
   * @method parsePKMTex
   * @param {ArrayBuffer|ArrayBufferView} file - The downloaded file
   * @param {Object} options - Some optional paramters
   * @param {Function} onComplete - Callback when finish parsing.
   * @param {Error} onComplete.err - The occurred error, null indicetes success
   * @param {Object} onComplete.etcAsset - The parsed content
   * 
   * @example
   * downloader.downloadFile('test.pkm', {responseType: 'arraybuffer'}, null, (err, file) => {
   *      parser.parsePKMTex(file, null, (err, etcAsset) => console.log(err));
   * });
   * 
   * @typescript
   * parsePKMTex(file: ArrayBuffer|ArrayBufferView, options: Record<string, any>, onComplete: (err: Error, etcAsset: {_data: Uint8Array, _compressed: boolean, width: number, height: number}) => void): void
   */
  parsePKMTex: function () {
    //===============//
    // ETC constants //
    //===============//
    var ETC_PKM_HEADER_SIZE = 16;
    var ETC_PKM_FORMAT_OFFSET = 6;
    var ETC_PKM_ENCODED_WIDTH_OFFSET = 8;
    var ETC_PKM_ENCODED_HEIGHT_OFFSET = 10;
    var ETC_PKM_WIDTH_OFFSET = 12;
    var ETC_PKM_HEIGHT_OFFSET = 14;
    var ETC1_RGB_NO_MIPMAPS = 0;
    var ETC2_RGB_NO_MIPMAPS = 1;
    var ETC2_RGBA_NO_MIPMAPS = 3;

    function readBEUint16(header, offset) {
      return header[offset] << 8 | header[offset + 1];
    }

    return function (file, options, onComplete) {
      var err = null,
          out = null;

      try {
        var buffer = file instanceof ArrayBuffer ? file : file.buffer;
        var header = new Uint8Array(buffer);
        var format = readBEUint16(header, ETC_PKM_FORMAT_OFFSET);

        if (format !== ETC1_RGB_NO_MIPMAPS && format !== ETC2_RGB_NO_MIPMAPS && format !== ETC2_RGBA_NO_MIPMAPS) {
          return new Error("Invalid magic number in ETC header");
        }

        var width = readBEUint16(header, ETC_PKM_WIDTH_OFFSET);
        var height = readBEUint16(header, ETC_PKM_HEIGHT_OFFSET);
        var encodedWidth = readBEUint16(header, ETC_PKM_ENCODED_WIDTH_OFFSET);
        var encodedHeight = readBEUint16(header, ETC_PKM_ENCODED_HEIGHT_OFFSET);
        var etcData = new Uint8Array(buffer, ETC_PKM_HEADER_SIZE);
        out = {
          _data: etcData,
          _compressed: true,
          width: width,
          height: height
        };
      } catch (e) {
        err = e;
      }

      onComplete && onComplete(err, out);
    };
  }(),

  /*
   * !#en
   * Parse plist file
   * 
   * !#zh
   * 解析 plist 文件
   * 
   * @method parsePlist
   * @param {string} file - The downloaded file
   * @param {Object} options - Some optional paramters
   * @param {Function} onComplete - Callback when finish parsing
   * @param {Error} onComplete.err - The occurred error, null indicetes success
   * @param {*} onComplete.data - The parsed content
   * 
   * @example
   * downloader.downloadFile('test.plist', {responseType: 'text'}, null, (err, file) => {
   *      parser.parsePlist(file, null, (err, data) => console.log(err));
   * });
   * 
   * @typescript
   * parsePlist(file: string, options: Record<string, any>, onComplete?: (err: Error, data: any) => void): void
   */
  parsePlist: function parsePlist(file, options, onComplete) {
    var err = null;
    var result = plistParser.parse(file);
    if (!result) err = new Error('parse failed');
    onComplete && onComplete(err, result);
  },

  /*
   * !#en
   * Deserialize asset file
   * 
   * !#zh
   * 反序列化资源文件
   * 
   * @method parseImport
   * @param {Object} file - The serialized json
   * @param {Object} options - Some optional paramters
   * @param {Function} onComplete - Callback when finish parsing
   * @param {Error} onComplete.err - The occurred error, null indicetes success
   * @param {Asset} onComplete.asset - The parsed content
   * 
   * @example
   * downloader.downloadFile('test.json', {responseType: 'json'}, null, (err, file) => {
   *      parser.parseImport(file, null, (err, data) => console.log(err));
   * });
   * 
   * @typescript
   * parseImport (file: any, options: Record<string, any>, onComplete?: (err: Error, asset: cc.Asset) => void): void
   */
  parseImport: function parseImport(file, options, onComplete) {
    if (!file) return onComplete && onComplete(new Error('Json is empty'));
    var result,
        err = null;

    try {
      result = deserialize(file, options);
    } catch (e) {
      err = e;
    }

    onComplete && onComplete(err, result);
  },
  init: function init() {
    _parsing.clear();
  },

  /**
   * !#en
   * Register custom handler if you want to change default behavior or extend parser to parse other format file
   * 
   * !#zh
   * 当你想修改默认行为或者拓展 parser 来解析其他格式文件时可以注册自定义的handler
   * 
   * @method register
   * @param {string|Object} type - Extension likes '.jpg' or map likes {'.jpg': jpgHandler, '.png': pngHandler}
   * @param {Function} [handler] - The corresponding handler
   * @param {*} handler.file - File
   * @param {Object} handler.options - Some optional paramter
   * @param {Function} handler.onComplete - callback when finishing parsing
   * 
   * @example
   * parser.register('.tga', (file, options, onComplete) => onComplete(null, null));
   * parser.register({'.tga': (file, options, onComplete) => onComplete(null, null), '.ext': (file, options, onComplete) => onComplete(null, null)});
   * 
   * @typescript
   * register(type: string, handler: (file: any, options: Record<string, any>, onComplete: (err: Error, data: any) => void) => void): void
   * register(map: Record<string, (file: any, options: Record<string, any>, onComplete: (err: Error, data: any) => void) => void>): void
   */
  register: function register(type, handler) {
    if (typeof type === 'object') {
      js.mixin(parsers, type);
    } else {
      parsers[type] = handler;
    }
  },

  /**
   * !#en
   * Use corresponding handler to parse file 
   * 
   * !#zh
   * 使用对应的handler来解析文件
   * 
   * @method parse
   * @param {string} id - The id of file
   * @param {*} file - File
   * @param {string} type - The corresponding type of file, likes '.jpg'.
   * @param {Object} options - Some optional paramters will be transferred to the corresponding handler.
   * @param {Function} onComplete - callback when finishing downloading
   * @param {Error} onComplete.err - The occurred error, null indicetes success
   * @param {*} onComplete.contetnt - The parsed file
   * 
   * @example
   * downloader.downloadFile('test.jpg', {responseType: 'blob'}, null, (err, file) => {
   *      parser.parse('test.jpg', file, '.jpg', null, (err, img) => console.log(err));
   * });
   * 
   * @typescript
   * parse(id: string, file: any, type: string, options: Record<string, any>, onComplete: (err: Error, content: any) => void): void
   */
  parse: function parse(id, file, type, options, onComplete) {
    var parsedAsset, parsing, parseHandler;

    if (parsedAsset = parsed.get(id)) {
      onComplete(null, parsedAsset);
    } else if (parsing = _parsing.get(id)) {
      parsing.push(onComplete);
    } else if (parseHandler = parsers[type]) {
      _parsing.add(id, [onComplete]);

      parseHandler(file, options, function (err, data) {
        if (err) {
          files.remove(id);
        } else if (!isScene(data)) {
          parsed.add(id, data);
        }

        var callbacks = _parsing.remove(id);

        for (var i = 0, l = callbacks.length; i < l; i++) {
          callbacks[i](err, data);
        }
      });
    } else {
      onComplete(null, file);
    }
  }
};
var parsers = {
  '.png': parser.parseImage,
  '.jpg': parser.parseImage,
  '.bmp': parser.parseImage,
  '.jpeg': parser.parseImage,
  '.gif': parser.parseImage,
  '.ico': parser.parseImage,
  '.tiff': parser.parseImage,
  '.webp': parser.parseImage,
  '.image': parser.parseImage,
  '.pvr': parser.parsePVRTex,
  '.pkm': parser.parsePKMTex,
  // Audio
  '.mp3': parser.parseAudio,
  '.ogg': parser.parseAudio,
  '.wav': parser.parseAudio,
  '.m4a': parser.parseAudio,
  // plist
  '.plist': parser.parsePlist,
  'import': parser.parseImport
};
module.exports = parser;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0LW1hbmFnZXIvcGFyc2VyLmpzIl0sIm5hbWVzIjpbInBsaXN0UGFyc2VyIiwicmVxdWlyZSIsImpzIiwiZGVzZXJpYWxpemUiLCJDYWNoZSIsImlzU2NlbmUiLCJwYXJzZWQiLCJmaWxlcyIsIl9fYXVkaW9TdXBwb3J0IiwiY2FwYWJpbGl0aWVzIiwiX3BhcnNpbmciLCJwYXJzZXIiLCJwYXJzZUltYWdlIiwiZmlsZSIsIm9wdGlvbnMiLCJvbkNvbXBsZXRlIiwiaW1hZ2VCaXRtYXAiLCJCbG9iIiwiaW1hZ2VPcHRpb25zIiwiaW1hZ2VPcmllbnRhdGlvbiIsIl9fZmxpcFlfXyIsInByZW11bHRpcGx5QWxwaGEiLCJfX3ByZW11bHRpcGx5QWxwaGFfXyIsImNyZWF0ZUltYWdlQml0bWFwIiwidGhlbiIsInJlc3VsdCIsImZsaXBZIiwiZXJyIiwicGFyc2VBdWRpbyIsIkFycmF5QnVmZmVyIiwiY29udGV4dCIsImRlY29kZUF1ZGlvRGF0YSIsImJ1ZmZlciIsImUiLCJwYXJzZVBWUlRleCIsIlBWUl9IRUFERVJfTEVOR1RIIiwiUFZSX01BR0lDIiwiUFZSX0hFQURFUl9NQUdJQyIsIlBWUl9IRUFERVJfRk9STUFUIiwiUFZSX0hFQURFUl9IRUlHSFQiLCJQVlJfSEVBREVSX1dJRFRIIiwiUFZSX0hFQURFUl9NSVBNQVBDT1VOVCIsIlBWUl9IRUFERVJfTUVUQURBVEEiLCJvdXQiLCJoZWFkZXIiLCJJbnQzMkFycmF5IiwiRXJyb3IiLCJ3aWR0aCIsImhlaWdodCIsImRhdGFPZmZzZXQiLCJwdnJ0Y0RhdGEiLCJVaW50OEFycmF5IiwiX2RhdGEiLCJfY29tcHJlc3NlZCIsInBhcnNlUEtNVGV4IiwiRVRDX1BLTV9IRUFERVJfU0laRSIsIkVUQ19QS01fRk9STUFUX09GRlNFVCIsIkVUQ19QS01fRU5DT0RFRF9XSURUSF9PRkZTRVQiLCJFVENfUEtNX0VOQ09ERURfSEVJR0hUX09GRlNFVCIsIkVUQ19QS01fV0lEVEhfT0ZGU0VUIiwiRVRDX1BLTV9IRUlHSFRfT0ZGU0VUIiwiRVRDMV9SR0JfTk9fTUlQTUFQUyIsIkVUQzJfUkdCX05PX01JUE1BUFMiLCJFVEMyX1JHQkFfTk9fTUlQTUFQUyIsInJlYWRCRVVpbnQxNiIsIm9mZnNldCIsImZvcm1hdCIsImVuY29kZWRXaWR0aCIsImVuY29kZWRIZWlnaHQiLCJldGNEYXRhIiwicGFyc2VQbGlzdCIsInBhcnNlIiwicGFyc2VJbXBvcnQiLCJpbml0IiwiY2xlYXIiLCJyZWdpc3RlciIsInR5cGUiLCJoYW5kbGVyIiwibWl4aW4iLCJwYXJzZXJzIiwiaWQiLCJwYXJzZWRBc3NldCIsInBhcnNpbmciLCJwYXJzZUhhbmRsZXIiLCJnZXQiLCJwdXNoIiwiYWRkIiwiZGF0YSIsInJlbW92ZSIsImNhbGxiYWNrcyIsImkiLCJsIiwibGVuZ3RoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxXQUFXLEdBQUdDLE9BQU8sQ0FBQyx5QkFBRCxDQUFQLENBQW1DRCxXQUF2RDs7QUFDQSxJQUFNRSxFQUFFLEdBQUdELE9BQU8sQ0FBQyxnQkFBRCxDQUFsQjs7QUFDQSxJQUFNRSxXQUFXLEdBQUdGLE9BQU8sQ0FBQyxlQUFELENBQTNCOztBQUNBLElBQU1HLEtBQUssR0FBR0gsT0FBTyxDQUFDLFNBQUQsQ0FBckI7O2VBQ29CQSxPQUFPLENBQUMsVUFBRDtJQUFuQkksbUJBQUFBOztnQkFDa0JKLE9BQU8sQ0FBQyxVQUFEO0lBQXpCSyxtQkFBQUE7SUFBUUMsa0JBQUFBOztnQkFDeUJOLE9BQU8sQ0FBQyxtQkFBRDtJQUF4Q08sMkJBQUFBO0lBQWdCQyx5QkFBQUE7O0FBRXhC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LFVBVFI7QUFVVixVQUFTRCxNQUFNLENBQUN1QixXQVZOO0FBV1YsVUFBU3ZCLE1BQU0sQ0FBQzJDLFdBWE47QUFZVjtBQUNBLFVBQVMzQyxNQUFNLENBQUNpQixVQWJOO0FBY1YsVUFBU2pCLE1BQU0sQ0FBQ2lCLFVBZE47QUFlVixVQUFTakIsTUFBTSxDQUFDaUIsVUFmTjtBQWdCVixVQUFTakIsTUFBTSxDQUFDaUIsVUFoQk47QUFrQlY7QUFDQSxZQUFXakIsTUFBTSxDQUFDMkQsVUFuQlI7QUFvQlYsWUFBVzNELE1BQU0sQ0FBQzZEO0FBcEJSLENBQWQ7QUF1QkFxQixNQUFNLENBQUNDLE9BQVAsR0FBaUJuRixNQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqXG4gKiBAbW9kdWxlIGNjLkFzc2V0TWFuYWdlclxuICovXG5cbmNvbnN0IHBsaXN0UGFyc2VyID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vQ0NTQVhQYXJzZXInKS5wbGlzdFBhcnNlcjtcbmNvbnN0IGpzID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vanMnKTtcbmNvbnN0IGRlc2VyaWFsaXplID0gcmVxdWlyZSgnLi9kZXNlcmlhbGl6ZScpO1xuY29uc3QgQ2FjaGUgPSByZXF1aXJlKCcuL2NhY2hlJyk7XG5jb25zdCB7IGlzU2NlbmUgfSA9IHJlcXVpcmUoJy4vaGVscGVyJyk7XG5jb25zdCB7IHBhcnNlZCwgZmlsZXMgfSA9IHJlcXVpcmUoJy4vc2hhcmVkJyk7XG5jb25zdCB7IF9fYXVkaW9TdXBwb3J0LCBjYXBhYmlsaXRpZXMgfSA9IHJlcXVpcmUoJy4uL3BsYXRmb3JtL0NDU3lzJyk7XG5cbnZhciBfcGFyc2luZyA9IG5ldyBDYWNoZSgpO1xuXG4vKipcbiAqICEjZW5cbiAqIFBhcnNlIHRoZSBkb3dubG9hZGVkIGZpbGUsIGl0J3MgYSBzaW5nbGV0b24sIGFsbCBtZW1iZXIgY2FuIGJlIGFjY2Vzc2VkIHdpdGggYGNjLmFzc2V0TWFuYWdlci5wYXJzZXJgXG4gKiBcbiAqICEjemhcbiAqIOino+aekOW3suS4i+i9veeahOaWh+S7tu+8jHBhcnNlciDmmK/kuIDkuKrljZXkvossIOaJgOacieaIkOWRmOiDvemAmui/hyBgY2MuYXNzZXRNYW5hYWdlci5wYXJzZXJgIOiuv+mXrlxuICogXG4gKiBAY2xhc3MgUGFyc2VyXG4gKi9cbnZhciBwYXJzZXIgPSB7XG4gICAgLypcbiAgICAgKiAhI2VuXG4gICAgICogUGFyc2UgaW1hZ2UgZmlsZVxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDop6PmnpDlm77niYfmlofku7ZcbiAgICAgKiBcbiAgICAgKiBAbWV0aG9kIHBhcnNlSW1hZ2VcbiAgICAgKiBAcGFyYW0ge0Jsb2J9IGZpbGUgLSBUaGUgZG93bmxvYWRlZCBmaWxlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBTb21lIG9wdGlvbmFsIHBhcmFtdGVycyBcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25Db21wbGV0ZV0gLSBjYWxsYmFjayB3aGVuIGZpbmlzaCBwYXJzaW5nLlxuICAgICAqIEBwYXJhbSB7RXJyb3J9IG9uQ29tcGxldGUuZXJyIC0gVGhlIG9jY3VycmVkIGVycm9yLCBudWxsIGluZGljZXRlcyBzdWNjZXNzXG4gICAgICogQHBhcmFtIHtJbWFnZUJpdG1hcHxIVE1MSW1hZ2VFbGVtZW50fSBvbkNvbXBsZXRlLmltZyAtIFRoZSBwYXJzZWQgY29udGVudFxuICAgICAqIFxuICAgICAqIEBleGFtcGxlXG4gICAgICogZG93bmxvYWRlci5kb3dubG9hZEZpbGUoJ3Rlc3QuanBnJywge3Jlc3BvbnNlVHlwZTogJ2Jsb2InfSwgbnVsbCwgKGVyciwgZmlsZSkgPT4ge1xuICAgICAqICAgICAgcGFyc2VyLnBhcnNlSW1hZ2UoZmlsZSwgbnVsbCwgKGVyciwgaW1nKSA9PiBjb25zb2xlLmxvZyhlcnIpKTtcbiAgICAgKiB9KTtcbiAgICAgKiBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHBhcnNlSW1hZ2UoZmlsZTogQmxvYiwgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55Piwgb25Db21wbGV0ZT86IChlcnI6IEVycm9yLCBpbWc6IEltYWdlQml0bWFwfEhUTUxJbWFnZUVsZW1lbnQpID0+IHZvaWQpOiB2b2lkXG4gICAgICovXG4gICAgcGFyc2VJbWFnZSAoZmlsZSwgb3B0aW9ucywgb25Db21wbGV0ZSkge1xuICAgICAgICBpZiAoY2FwYWJpbGl0aWVzLmltYWdlQml0bWFwICYmIGZpbGUgaW5zdGFuY2VvZiBCbG9iKSB7XG4gICAgICAgICAgICBsZXQgaW1hZ2VPcHRpb25zID0ge307XG4gICAgICAgICAgICBpbWFnZU9wdGlvbnMuaW1hZ2VPcmllbnRhdGlvbiA9IG9wdGlvbnMuX19mbGlwWV9fID8gJ2ZsaXBZJyA6ICdub25lJztcbiAgICAgICAgICAgIGltYWdlT3B0aW9ucy5wcmVtdWx0aXBseUFscGhhID0gb3B0aW9ucy5fX3ByZW11bHRpcGx5QWxwaGFfXyA/ICdwcmVtdWx0aXBseScgOiAnbm9uZSc7XG4gICAgICAgICAgICBjcmVhdGVJbWFnZUJpdG1hcChmaWxlLCBpbWFnZU9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5mbGlwWSA9ICEhb3B0aW9ucy5fX2ZsaXBZX187XG4gICAgICAgICAgICAgICAgcmVzdWx0LnByZW11bHRpcGx5QWxwaGEgPSAhIW9wdGlvbnMuX19wcmVtdWx0aXBseUFscGhhX187XG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZSAmJiBvbkNvbXBsZXRlKG51bGwsIHJlc3VsdCk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZSAmJiBvbkNvbXBsZXRlKGVyciwgbnVsbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG9uQ29tcGxldGUgJiYgb25Db21wbGV0ZShudWxsLCBmaWxlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKlxuICAgICAqICEjZW5cbiAgICAgKiBQYXJzZSBhdWRpbyBmaWxlXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOino+aekOmfs+mikeaWh+S7tlxuICAgICAqIFxuICAgICAqIEBtZXRob2QgcGFyc2VBdWRpb1xuICAgICAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ8SFRNTEF1ZGlvRWxlbWVudH0gZmlsZSAtIFRoZSBkb3dubG9hZGVkIGZpbGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFNvbWUgb3B0aW9uYWwgcGFyYW10ZXJzXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25Db21wbGV0ZSAtIENhbGxiYWNrIHdoZW4gZmluaXNoIHBhcnNpbmcuXG4gICAgICogQHBhcmFtIHtFcnJvcn0gb25Db21wbGV0ZS5lcnIgLSBUaGUgb2NjdXJyZWQgZXJyb3IsIG51bGwgaW5kaWNldGVzIHN1Y2Nlc3NcbiAgICAgKiBAcGFyYW0ge0F1ZGlvQnVmZmVyfEhUTUxBdWRpb0VsZW1lbnR9IG9uQ29tcGxldGUuYXVkaW8gLSBUaGUgcGFyc2VkIGNvbnRlbnRcbiAgICAgKiBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGRvd25sb2FkZXIuZG93bmxvYWRGaWxlKCd0ZXN0Lm1wMycsIHtyZXNwb25zZVR5cGU6ICdhcnJheWJ1ZmZlcid9LCBudWxsLCAoZXJyLCBmaWxlKSA9PiB7XG4gICAgICogICAgICBwYXJzZXIucGFyc2VBdWRpbyhmaWxlLCBudWxsLCAoZXJyLCBhdWRpbykgPT4gY29uc29sZS5sb2coZXJyKSk7XG4gICAgICogfSk7XG4gICAgICogXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBwYXJzZUF1ZGlvKGZpbGU6IEFycmF5QnVmZmVyfEhUTUxBdWRpb0VsZW1lbnQsIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4sIG9uQ29tcGxldGU/OiAoZXJyOiBFcnJvciwgYXVkaW86IEF1ZGlvQnVmZmVyfEhUTUxBdWRpb0VsZW1lbnQpID0+IHZvaWQpOiB2b2lkXG4gICAgICovXG4gICAgcGFyc2VBdWRpbyAoZmlsZSwgb3B0aW9ucywgb25Db21wbGV0ZSkge1xuICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7IFxuICAgICAgICAgICAgX19hdWRpb1N1cHBvcnQuY29udGV4dC5kZWNvZGVBdWRpb0RhdGEoZmlsZSwgZnVuY3Rpb24gKGJ1ZmZlcikge1xuICAgICAgICAgICAgICAgIG9uQ29tcGxldGUgJiYgb25Db21wbGV0ZShudWxsLCBidWZmZXIpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZSAmJiBvbkNvbXBsZXRlKGUsIG51bGwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBvbkNvbXBsZXRlICYmIG9uQ29tcGxldGUobnVsbCwgZmlsZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiAhI2VuXG4gICAgICogUGFyc2UgcHZyIGZpbGUgXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOino+aekOWOi+e8qee6ueeQhuagvOW8jyBwdnIg5paH5Lu2XG4gICAgICogXG4gICAgICogQG1ldGhvZCBwYXJzZVBWUlRleFxuICAgICAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ8QXJyYXlCdWZmZXJWaWV3fSBmaWxlIC0gVGhlIGRvd25sb2FkZWQgZmlsZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gU29tZSBvcHRpb25hbCBwYXJhbXRlcnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvbkNvbXBsZXRlIC0gQ2FsbGJhY2sgd2hlbiBmaW5pc2ggcGFyc2luZy5cbiAgICAgKiBAcGFyYW0ge0Vycm9yfSBvbkNvbXBsZXRlLmVyciAtIFRoZSBvY2N1cnJlZCBlcnJvciwgbnVsbCBpbmRpY2V0ZXMgc3VjY2Vzc1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvbkNvbXBsZXRlLnB2ckFzc2V0IC0gVGhlIHBhcnNlZCBjb250ZW50XG4gICAgICogXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBkb3dubG9hZGVyLmRvd25sb2FkRmlsZSgndGVzdC5wdnInLCB7cmVzcG9uc2VUeXBlOiAnYXJyYXlidWZmZXInfSwgbnVsbCwgKGVyciwgZmlsZSkgPT4ge1xuICAgICAqICAgICAgcGFyc2VyLnBhcnNlUFZSVGV4KGZpbGUsIG51bGwsIChlcnIsIHB2ckFzc2V0KSA9PiBjb25zb2xlLmxvZyhlcnIpKTtcbiAgICAgKiB9KTtcbiAgICAgKiBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHBhcnNlUFZSVGV4KGZpbGU6IEFycmF5QnVmZmVyfEFycmF5QnVmZmVyVmlldywgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55Piwgb25Db21wbGV0ZTogKGVycjogRXJyb3IsIHB2ckFzc2V0OiB7X2RhdGE6IFVpbnQ4QXJyYXksIF9jb21wcmVzc2VkOiBib29sZWFuLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcn0pID0+IHZvaWQpOiB2b2lkXG4gICAgICovXG4gICAgcGFyc2VQVlJUZXggOiAoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLz09PT09PT09PT09PT09PS8vXG4gICAgICAgIC8vIFBWUiBjb25zdGFudHMgLy9cbiAgICAgICAgLy89PT09PT09PT09PT09PT0vL1xuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdG9qaS90ZXh0dXJlLXRlc3Rlci9ibG9iL21hc3Rlci9qcy93ZWJnbC10ZXh0dXJlLXV0aWwuanMjTDQyNFxuICAgICAgICBjb25zdCBQVlJfSEVBREVSX0xFTkdUSCA9IDEzOyAvLyBUaGUgaGVhZGVyIGxlbmd0aCBpbiAzMiBiaXQgaW50cy5cbiAgICAgICAgY29uc3QgUFZSX01BR0lDID0gMHgwMzUyNTY1MDsgLy8weDUwNTY1MjAzO1xuICAgIFxuICAgICAgICAvLyBPZmZzZXRzIGludG8gdGhlIGhlYWRlciBhcnJheS5cbiAgICAgICAgY29uc3QgUFZSX0hFQURFUl9NQUdJQyA9IDA7XG4gICAgICAgIGNvbnN0IFBWUl9IRUFERVJfRk9STUFUID0gMjtcbiAgICAgICAgY29uc3QgUFZSX0hFQURFUl9IRUlHSFQgPSA2O1xuICAgICAgICBjb25zdCBQVlJfSEVBREVSX1dJRFRIID0gNztcbiAgICAgICAgY29uc3QgUFZSX0hFQURFUl9NSVBNQVBDT1VOVCA9IDExO1xuICAgICAgICBjb25zdCBQVlJfSEVBREVSX01FVEFEQVRBID0gMTI7XG4gICAgXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZmlsZSwgb3B0aW9ucywgb25Db21wbGV0ZSkge1xuICAgICAgICAgICAgbGV0IGVyciA9IG51bGwsIG91dCA9IG51bGw7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxldCBidWZmZXIgPSBmaWxlIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgPyBmaWxlIDogZmlsZS5idWZmZXI7XG4gICAgICAgICAgICAgICAgLy8gR2V0IGEgdmlldyBvZiB0aGUgYXJyYXlCdWZmZXIgdGhhdCByZXByZXNlbnRzIHRoZSBERFMgaGVhZGVyLlxuICAgICAgICAgICAgICAgIGxldCBoZWFkZXIgPSBuZXcgSW50MzJBcnJheShidWZmZXIsIDAsIFBWUl9IRUFERVJfTEVOR1RIKTtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyBEbyBzb21lIHNhbml0eSBjaGVja3MgdG8gbWFrZSBzdXJlIHRoaXMgaXMgYSB2YWxpZCBERFMgZmlsZS5cbiAgICAgICAgICAgICAgICBpZihoZWFkZXJbUFZSX0hFQURFUl9NQUdJQ10gIT0gUFZSX01BR0lDKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgbWFnaWMgbnVtYmVyIGluIFBWUiBoZWFkZXJcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgICAgIC8vIEdhdGhlciBvdGhlciBiYXNpYyBtZXRyaWNzIGFuZCBhIHZpZXcgb2YgdGhlIHJhdyB0aGUgRFhUIGRhdGEuXG4gICAgICAgICAgICAgICAgbGV0IHdpZHRoID0gaGVhZGVyW1BWUl9IRUFERVJfV0lEVEhdO1xuICAgICAgICAgICAgICAgIGxldCBoZWlnaHQgPSBoZWFkZXJbUFZSX0hFQURFUl9IRUlHSFRdO1xuICAgICAgICAgICAgICAgIGxldCBkYXRhT2Zmc2V0ID0gaGVhZGVyW1BWUl9IRUFERVJfTUVUQURBVEFdICsgNTI7XG4gICAgICAgICAgICAgICAgbGV0IHB2cnRjRGF0YSA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlciwgZGF0YU9mZnNldCk7XG4gICAgXG4gICAgICAgICAgICAgICAgb3V0ID0ge1xuICAgICAgICAgICAgICAgICAgICBfZGF0YTogcHZydGNEYXRhLFxuICAgICAgICAgICAgICAgICAgICBfY29tcHJlc3NlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBlcnIgPSBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb25Db21wbGV0ZSAmJiBvbkNvbXBsZXRlKGVyciwgb3V0KTtcbiAgICAgICAgfTtcbiAgICB9KSgpLFxuXG4gICAgLypcbiAgICAgKiAhI2VuXG4gICAgICogUGFyc2UgcGttIGZpbGVcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog6Kej5p6Q5Y6L57yp57q555CG5qC85byPIHBrbSDmlofku7ZcbiAgICAgKiBcbiAgICAgKiBAbWV0aG9kIHBhcnNlUEtNVGV4XG4gICAgICogQHBhcmFtIHtBcnJheUJ1ZmZlcnxBcnJheUJ1ZmZlclZpZXd9IGZpbGUgLSBUaGUgZG93bmxvYWRlZCBmaWxlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBTb21lIG9wdGlvbmFsIHBhcmFtdGVyc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9uQ29tcGxldGUgLSBDYWxsYmFjayB3aGVuIGZpbmlzaCBwYXJzaW5nLlxuICAgICAqIEBwYXJhbSB7RXJyb3J9IG9uQ29tcGxldGUuZXJyIC0gVGhlIG9jY3VycmVkIGVycm9yLCBudWxsIGluZGljZXRlcyBzdWNjZXNzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9uQ29tcGxldGUuZXRjQXNzZXQgLSBUaGUgcGFyc2VkIGNvbnRlbnRcbiAgICAgKiBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGRvd25sb2FkZXIuZG93bmxvYWRGaWxlKCd0ZXN0LnBrbScsIHtyZXNwb25zZVR5cGU6ICdhcnJheWJ1ZmZlcid9LCBudWxsLCAoZXJyLCBmaWxlKSA9PiB7XG4gICAgICogICAgICBwYXJzZXIucGFyc2VQS01UZXgoZmlsZSwgbnVsbCwgKGVyciwgZXRjQXNzZXQpID0+IGNvbnNvbGUubG9nKGVycikpO1xuICAgICAqIH0pO1xuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcGFyc2VQS01UZXgoZmlsZTogQXJyYXlCdWZmZXJ8QXJyYXlCdWZmZXJWaWV3LCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvbkNvbXBsZXRlOiAoZXJyOiBFcnJvciwgZXRjQXNzZXQ6IHtfZGF0YTogVWludDhBcnJheSwgX2NvbXByZXNzZWQ6IGJvb2xlYW4sIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyfSkgPT4gdm9pZCk6IHZvaWRcbiAgICAgKi9cbiAgICBwYXJzZVBLTVRleDogKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy89PT09PT09PT09PT09PT0vL1xuICAgICAgICAvLyBFVEMgY29uc3RhbnRzIC8vXG4gICAgICAgIC8vPT09PT09PT09PT09PT09Ly9cbiAgICAgICAgY29uc3QgRVRDX1BLTV9IRUFERVJfU0laRSA9IDE2O1xuXG4gICAgICAgIGNvbnN0IEVUQ19QS01fRk9STUFUX09GRlNFVCA9IDY7XG4gICAgICAgIGNvbnN0IEVUQ19QS01fRU5DT0RFRF9XSURUSF9PRkZTRVQgPSA4O1xuICAgICAgICBjb25zdCBFVENfUEtNX0VOQ09ERURfSEVJR0hUX09GRlNFVCA9IDEwO1xuICAgICAgICBjb25zdCBFVENfUEtNX1dJRFRIX09GRlNFVCA9IDEyO1xuICAgICAgICBjb25zdCBFVENfUEtNX0hFSUdIVF9PRkZTRVQgPSAxNDtcblxuICAgICAgICBjb25zdCBFVEMxX1JHQl9OT19NSVBNQVBTICAgPSAwO1xuICAgICAgICBjb25zdCBFVEMyX1JHQl9OT19NSVBNQVBTICAgPSAxO1xuICAgICAgICBjb25zdCBFVEMyX1JHQkFfTk9fTUlQTUFQUyAgPSAzO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlYWRCRVVpbnQxNihoZWFkZXIsIG9mZnNldCkge1xuICAgICAgICAgICAgcmV0dXJuIChoZWFkZXJbb2Zmc2V0XSA8PCA4KSB8IGhlYWRlcltvZmZzZXQrMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmaWxlLCBvcHRpb25zLCBvbkNvbXBsZXRlKSB7XG4gICAgICAgICAgICBsZXQgZXJyID0gbnVsbCwgb3V0ID0gbnVsbDtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IGZpbGUgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciA/IGZpbGUgOiBmaWxlLmJ1ZmZlcjtcbiAgICAgICAgICAgICAgICBsZXQgaGVhZGVyID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKTtcbiAgICAgICAgICAgICAgICBsZXQgZm9ybWF0ID0gcmVhZEJFVWludDE2KGhlYWRlciwgRVRDX1BLTV9GT1JNQVRfT0ZGU0VUKTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWF0ICE9PSBFVEMxX1JHQl9OT19NSVBNQVBTICYmIGZvcm1hdCAhPT0gRVRDMl9SR0JfTk9fTUlQTUFQUyAmJiBmb3JtYXQgIT09IEVUQzJfUkdCQV9OT19NSVBNQVBTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJJbnZhbGlkIG1hZ2ljIG51bWJlciBpbiBFVEMgaGVhZGVyXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgd2lkdGggPSByZWFkQkVVaW50MTYoaGVhZGVyLCBFVENfUEtNX1dJRFRIX09GRlNFVCk7XG4gICAgICAgICAgICAgICAgbGV0IGhlaWdodCA9IHJlYWRCRVVpbnQxNihoZWFkZXIsIEVUQ19QS01fSEVJR0hUX09GRlNFVCk7XG4gICAgICAgICAgICAgICAgbGV0IGVuY29kZWRXaWR0aCA9IHJlYWRCRVVpbnQxNihoZWFkZXIsIEVUQ19QS01fRU5DT0RFRF9XSURUSF9PRkZTRVQpO1xuICAgICAgICAgICAgICAgIGxldCBlbmNvZGVkSGVpZ2h0ID0gcmVhZEJFVWludDE2KGhlYWRlciwgRVRDX1BLTV9FTkNPREVEX0hFSUdIVF9PRkZTRVQpO1xuICAgICAgICAgICAgICAgIGxldCBldGNEYXRhID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyLCBFVENfUEtNX0hFQURFUl9TSVpFKTtcbiAgICAgICAgICAgICAgICBvdXQgPSB7XG4gICAgICAgICAgICAgICAgICAgIF9kYXRhOiBldGNEYXRhLFxuICAgICAgICAgICAgICAgICAgICBfY29tcHJlc3NlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGVyciA9IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvbkNvbXBsZXRlICYmIG9uQ29tcGxldGUoZXJyLCBvdXQpO1xuICAgICAgICB9XG4gICAgfSkoKSxcblxuICAgIC8qXG4gICAgICogISNlblxuICAgICAqIFBhcnNlIHBsaXN0IGZpbGVcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog6Kej5p6QIHBsaXN0IOaWh+S7tlxuICAgICAqIFxuICAgICAqIEBtZXRob2QgcGFyc2VQbGlzdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlIC0gVGhlIGRvd25sb2FkZWQgZmlsZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gU29tZSBvcHRpb25hbCBwYXJhbXRlcnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvbkNvbXBsZXRlIC0gQ2FsbGJhY2sgd2hlbiBmaW5pc2ggcGFyc2luZ1xuICAgICAqIEBwYXJhbSB7RXJyb3J9IG9uQ29tcGxldGUuZXJyIC0gVGhlIG9jY3VycmVkIGVycm9yLCBudWxsIGluZGljZXRlcyBzdWNjZXNzXG4gICAgICogQHBhcmFtIHsqfSBvbkNvbXBsZXRlLmRhdGEgLSBUaGUgcGFyc2VkIGNvbnRlbnRcbiAgICAgKiBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGRvd25sb2FkZXIuZG93bmxvYWRGaWxlKCd0ZXN0LnBsaXN0Jywge3Jlc3BvbnNlVHlwZTogJ3RleHQnfSwgbnVsbCwgKGVyciwgZmlsZSkgPT4ge1xuICAgICAqICAgICAgcGFyc2VyLnBhcnNlUGxpc3QoZmlsZSwgbnVsbCwgKGVyciwgZGF0YSkgPT4gY29uc29sZS5sb2coZXJyKSk7XG4gICAgICogfSk7XG4gICAgICogXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBwYXJzZVBsaXN0KGZpbGU6IHN0cmluZywgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55Piwgb25Db21wbGV0ZT86IChlcnI6IEVycm9yLCBkYXRhOiBhbnkpID0+IHZvaWQpOiB2b2lkXG4gICAgICovXG4gICAgcGFyc2VQbGlzdCAoZmlsZSwgb3B0aW9ucywgb25Db21wbGV0ZSkge1xuICAgICAgICB2YXIgZXJyID0gbnVsbDtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHBsaXN0UGFyc2VyLnBhcnNlKGZpbGUpO1xuICAgICAgICBpZiAoIXJlc3VsdCkgZXJyID0gbmV3IEVycm9yKCdwYXJzZSBmYWlsZWQnKTtcbiAgICAgICAgb25Db21wbGV0ZSAmJiBvbkNvbXBsZXRlKGVyciwgcmVzdWx0KTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiAhI2VuXG4gICAgICogRGVzZXJpYWxpemUgYXNzZXQgZmlsZVxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDlj43luo/liJfljJbotYTmupDmlofku7ZcbiAgICAgKiBcbiAgICAgKiBAbWV0aG9kIHBhcnNlSW1wb3J0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGZpbGUgLSBUaGUgc2VyaWFsaXplZCBqc29uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBTb21lIG9wdGlvbmFsIHBhcmFtdGVyc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9uQ29tcGxldGUgLSBDYWxsYmFjayB3aGVuIGZpbmlzaCBwYXJzaW5nXG4gICAgICogQHBhcmFtIHtFcnJvcn0gb25Db21wbGV0ZS5lcnIgLSBUaGUgb2NjdXJyZWQgZXJyb3IsIG51bGwgaW5kaWNldGVzIHN1Y2Nlc3NcbiAgICAgKiBAcGFyYW0ge0Fzc2V0fSBvbkNvbXBsZXRlLmFzc2V0IC0gVGhlIHBhcnNlZCBjb250ZW50XG4gICAgICogXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBkb3dubG9hZGVyLmRvd25sb2FkRmlsZSgndGVzdC5qc29uJywge3Jlc3BvbnNlVHlwZTogJ2pzb24nfSwgbnVsbCwgKGVyciwgZmlsZSkgPT4ge1xuICAgICAqICAgICAgcGFyc2VyLnBhcnNlSW1wb3J0KGZpbGUsIG51bGwsIChlcnIsIGRhdGEpID0+IGNvbnNvbGUubG9nKGVycikpO1xuICAgICAqIH0pO1xuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcGFyc2VJbXBvcnQgKGZpbGU6IGFueSwgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55Piwgb25Db21wbGV0ZT86IChlcnI6IEVycm9yLCBhc3NldDogY2MuQXNzZXQpID0+IHZvaWQpOiB2b2lkXG4gICAgICovXG4gICAgcGFyc2VJbXBvcnQgKGZpbGUsIG9wdGlvbnMsIG9uQ29tcGxldGUpIHtcbiAgICAgICAgaWYgKCFmaWxlKSByZXR1cm4gb25Db21wbGV0ZSAmJiBvbkNvbXBsZXRlKG5ldyBFcnJvcignSnNvbiBpcyBlbXB0eScpKTtcbiAgICAgICAgdmFyIHJlc3VsdCwgZXJyID0gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGRlc2VyaWFsaXplKGZpbGUsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBlcnIgPSBlO1xuICAgICAgICB9XG4gICAgICAgIG9uQ29tcGxldGUgJiYgb25Db21wbGV0ZShlcnIsIHJlc3VsdCk7XG4gICAgfSxcblxuICAgIGluaXQgKCkge1xuICAgICAgICBfcGFyc2luZy5jbGVhcigpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmVnaXN0ZXIgY3VzdG9tIGhhbmRsZXIgaWYgeW91IHdhbnQgdG8gY2hhbmdlIGRlZmF1bHQgYmVoYXZpb3Igb3IgZXh0ZW5kIHBhcnNlciB0byBwYXJzZSBvdGhlciBmb3JtYXQgZmlsZVxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDlvZPkvaDmg7Pkv67mlLnpu5jorqTooYzkuLrmiJbogIXmi5PlsZUgcGFyc2VyIOadpeino+aekOWFtuS7luagvOW8j+aWh+S7tuaXtuWPr+S7peazqOWGjOiHquWumuS5ieeahGhhbmRsZXJcbiAgICAgKiBcbiAgICAgKiBAbWV0aG9kIHJlZ2lzdGVyXG4gICAgICogQHBhcmFtIHtzdHJpbmd8T2JqZWN0fSB0eXBlIC0gRXh0ZW5zaW9uIGxpa2VzICcuanBnJyBvciBtYXAgbGlrZXMgeycuanBnJzoganBnSGFuZGxlciwgJy5wbmcnOiBwbmdIYW5kbGVyfVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtoYW5kbGVyXSAtIFRoZSBjb3JyZXNwb25kaW5nIGhhbmRsZXJcbiAgICAgKiBAcGFyYW0geyp9IGhhbmRsZXIuZmlsZSAtIEZpbGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaGFuZGxlci5vcHRpb25zIC0gU29tZSBvcHRpb25hbCBwYXJhbXRlclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXIub25Db21wbGV0ZSAtIGNhbGxiYWNrIHdoZW4gZmluaXNoaW5nIHBhcnNpbmdcbiAgICAgKiBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHBhcnNlci5yZWdpc3RlcignLnRnYScsIChmaWxlLCBvcHRpb25zLCBvbkNvbXBsZXRlKSA9PiBvbkNvbXBsZXRlKG51bGwsIG51bGwpKTtcbiAgICAgKiBwYXJzZXIucmVnaXN0ZXIoeycudGdhJzogKGZpbGUsIG9wdGlvbnMsIG9uQ29tcGxldGUpID0+IG9uQ29tcGxldGUobnVsbCwgbnVsbCksICcuZXh0JzogKGZpbGUsIG9wdGlvbnMsIG9uQ29tcGxldGUpID0+IG9uQ29tcGxldGUobnVsbCwgbnVsbCl9KTtcbiAgICAgKiBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHJlZ2lzdGVyKHR5cGU6IHN0cmluZywgaGFuZGxlcjogKGZpbGU6IGFueSwgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55Piwgb25Db21wbGV0ZTogKGVycjogRXJyb3IsIGRhdGE6IGFueSkgPT4gdm9pZCkgPT4gdm9pZCk6IHZvaWRcbiAgICAgKiByZWdpc3RlcihtYXA6IFJlY29yZDxzdHJpbmcsIChmaWxlOiBhbnksIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4sIG9uQ29tcGxldGU6IChlcnI6IEVycm9yLCBkYXRhOiBhbnkpID0+IHZvaWQpID0+IHZvaWQ+KTogdm9pZFxuICAgICAqL1xuICAgIHJlZ2lzdGVyICh0eXBlLCBoYW5kbGVyKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGpzLm1peGluKHBhcnNlcnMsIHR5cGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcGFyc2Vyc1t0eXBlXSA9IGhhbmRsZXI7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFVzZSBjb3JyZXNwb25kaW5nIGhhbmRsZXIgdG8gcGFyc2UgZmlsZSBcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog5L2/55So5a+55bqU55qEaGFuZGxlcuadpeino+aekOaWh+S7tlxuICAgICAqIFxuICAgICAqIEBtZXRob2QgcGFyc2VcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgLSBUaGUgaWQgb2YgZmlsZVxuICAgICAqIEBwYXJhbSB7Kn0gZmlsZSAtIEZpbGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIFRoZSBjb3JyZXNwb25kaW5nIHR5cGUgb2YgZmlsZSwgbGlrZXMgJy5qcGcnLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gU29tZSBvcHRpb25hbCBwYXJhbXRlcnMgd2lsbCBiZSB0cmFuc2ZlcnJlZCB0byB0aGUgY29ycmVzcG9uZGluZyBoYW5kbGVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9uQ29tcGxldGUgLSBjYWxsYmFjayB3aGVuIGZpbmlzaGluZyBkb3dubG9hZGluZ1xuICAgICAqIEBwYXJhbSB7RXJyb3J9IG9uQ29tcGxldGUuZXJyIC0gVGhlIG9jY3VycmVkIGVycm9yLCBudWxsIGluZGljZXRlcyBzdWNjZXNzXG4gICAgICogQHBhcmFtIHsqfSBvbkNvbXBsZXRlLmNvbnRldG50IC0gVGhlIHBhcnNlZCBmaWxlXG4gICAgICogXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBkb3dubG9hZGVyLmRvd25sb2FkRmlsZSgndGVzdC5qcGcnLCB7cmVzcG9uc2VUeXBlOiAnYmxvYid9LCBudWxsLCAoZXJyLCBmaWxlKSA9PiB7XG4gICAgICogICAgICBwYXJzZXIucGFyc2UoJ3Rlc3QuanBnJywgZmlsZSwgJy5qcGcnLCBudWxsLCAoZXJyLCBpbWcpID0+IGNvbnNvbGUubG9nKGVycikpO1xuICAgICAqIH0pO1xuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcGFyc2UoaWQ6IHN0cmluZywgZmlsZTogYW55LCB0eXBlOiBzdHJpbmcsIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4sIG9uQ29tcGxldGU6IChlcnI6IEVycm9yLCBjb250ZW50OiBhbnkpID0+IHZvaWQpOiB2b2lkXG4gICAgICovXG4gICAgcGFyc2UgKGlkLCBmaWxlLCB0eXBlLCBvcHRpb25zLCBvbkNvbXBsZXRlKSB7XG4gICAgICAgIGxldCBwYXJzZWRBc3NldCwgcGFyc2luZywgcGFyc2VIYW5kbGVyO1xuICAgICAgICBpZiAocGFyc2VkQXNzZXQgPSBwYXJzZWQuZ2V0KGlkKSkge1xuICAgICAgICAgICAgb25Db21wbGV0ZShudWxsLCBwYXJzZWRBc3NldCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocGFyc2luZyA9IF9wYXJzaW5nLmdldChpZCkpe1xuICAgICAgICAgICAgcGFyc2luZy5wdXNoKG9uQ29tcGxldGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHBhcnNlSGFuZGxlciA9IHBhcnNlcnNbdHlwZV0pe1xuICAgICAgICAgICAgX3BhcnNpbmcuYWRkKGlkLCBbb25Db21wbGV0ZV0pO1xuICAgICAgICAgICAgcGFyc2VIYW5kbGVyKGZpbGUsIG9wdGlvbnMsIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVzLnJlbW92ZShpZCk7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICBlbHNlIGlmICghaXNTY2VuZShkYXRhKSl7XG4gICAgICAgICAgICAgICAgICAgIHBhcnNlZC5hZGQoaWQsIGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgY2FsbGJhY2tzID0gX3BhcnNpbmcucmVtb3ZlKGlkKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzW2ldKGVyciwgZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBvbkNvbXBsZXRlKG51bGwsIGZpbGUpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxudmFyIHBhcnNlcnMgPSB7XG4gICAgJy5wbmcnIDogcGFyc2VyLnBhcnNlSW1hZ2UsXG4gICAgJy5qcGcnIDogcGFyc2VyLnBhcnNlSW1hZ2UsXG4gICAgJy5ibXAnIDogcGFyc2VyLnBhcnNlSW1hZ2UsXG4gICAgJy5qcGVnJyA6IHBhcnNlci5wYXJzZUltYWdlLFxuICAgICcuZ2lmJyA6IHBhcnNlci5wYXJzZUltYWdlLFxuICAgICcuaWNvJyA6IHBhcnNlci5wYXJzZUltYWdlLFxuICAgICcudGlmZicgOiBwYXJzZXIucGFyc2VJbWFnZSxcbiAgICAnLndlYnAnIDogcGFyc2VyLnBhcnNlSW1hZ2UsXG4gICAgJy5pbWFnZScgOiBwYXJzZXIucGFyc2VJbWFnZSxcbiAgICAnLnB2cicgOiBwYXJzZXIucGFyc2VQVlJUZXgsXG4gICAgJy5wa20nIDogcGFyc2VyLnBhcnNlUEtNVGV4LFxuICAgIC8vIEF1ZGlvXG4gICAgJy5tcDMnIDogcGFyc2VyLnBhcnNlQXVkaW8sXG4gICAgJy5vZ2cnIDogcGFyc2VyLnBhcnNlQXVkaW8sXG4gICAgJy53YXYnIDogcGFyc2VyLnBhcnNlQXVkaW8sXG4gICAgJy5tNGEnIDogcGFyc2VyLnBhcnNlQXVkaW8sXG5cbiAgICAvLyBwbGlzdFxuICAgICcucGxpc3QnIDogcGFyc2VyLnBhcnNlUGxpc3QsXG4gICAgJ2ltcG9ydCcgOiBwYXJzZXIucGFyc2VJbXBvcnRcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VyOyJdLCJzb3VyY2VSb290IjoiLyJ9