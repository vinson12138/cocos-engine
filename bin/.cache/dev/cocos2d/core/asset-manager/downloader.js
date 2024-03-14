
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/asset-manager/downloader.js';
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
var js = require('../platform/js');

var debug = require('../CCDebug');

var _require = require('./font-loader'),
    loadFont = _require.loadFont;

var callInNextTick = require('../platform/utils').callInNextTick;

var downloadDomImage = require('./download-dom-image');

var downloadDomAudio = require('./download-dom-audio');

var downloadFile = require('./download-file');

var downloadScript = require('./download-script.js');

var Cache = require('./cache');

var _require2 = require('./shared'),
    files = _require2.files;

var _require3 = require('../platform/CCSys'),
    __audioSupport = _require3.__audioSupport,
    capabilities = _require3.capabilities;

var _require4 = require('./utilities'),
    urlAppendTimestamp = _require4.urlAppendTimestamp,
    retry = _require4.retry;

var REGEX = /^(?:\w+:\/\/|\.+\/).+/;
var formatSupport = __audioSupport.format || [];

var unsupported = function unsupported(url, options, onComplete) {
  onComplete(new Error(debug.getError(4927)));
};

var downloadAudio = function downloadAudio(url, options, onComplete) {
  // web audio need to download file as arrayBuffer
  if (options.audioLoadMode !== cc.AudioClip.LoadMode.DOM_AUDIO) {
    downloadArrayBuffer(url, options, onComplete);
  } else {
    downloadDomAudio(url, options, onComplete);
  }
};

var downloadAudio = !CC_EDITOR || !Editor.isMainProcess ? formatSupport.length === 0 ? unsupported : __audioSupport.WEB_AUDIO ? downloadAudio : downloadDomAudio : null;

var downloadImage = function downloadImage(url, options, onComplete) {
  // if createImageBitmap is valid, we can transform blob to ImageBitmap. Otherwise, just use HTMLImageElement to load
  var func = capabilities.imageBitmap && cc.macro.ALLOW_IMAGE_BITMAP ? downloadBlob : downloadDomImage;
  func.apply(this, arguments);
};

var downloadBlob = function downloadBlob(url, options, onComplete) {
  options.responseType = "blob";
  downloadFile(url, options, options.onFileProgress, onComplete);
};

var downloadJson = function downloadJson(url, options, onComplete) {
  options.responseType = "json";
  downloadFile(url, options, options.onFileProgress, function (err, data) {
    if (!err && typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        err = e;
      }
    }

    onComplete && onComplete(err, data);
  });
};

var downloadArrayBuffer = function downloadArrayBuffer(url, options, onComplete) {
  options.responseType = "arraybuffer";
  downloadFile(url, options, options.onFileProgress, onComplete);
};

var downloadText = function downloadText(url, options, onComplete) {
  options.responseType = "text";
  downloadFile(url, options, options.onFileProgress, onComplete);
};

var downloadVideo = function downloadVideo(url, options, onComplete) {
  onComplete(null, url);
};

var downloadBundle = function downloadBundle(nameOrUrl, options, onComplete) {
  var bundleName = cc.path.basename(nameOrUrl);
  var url = nameOrUrl;
  if (!REGEX.test(url)) url = 'assets/' + bundleName;
  var version = options.version || downloader.bundleVers[bundleName];
  var count = 0;
  var config = url + "/config." + (version ? version + '.' : '') + "json";
  var out = null,
      error = null;
  downloadJson(config, options, function (err, response) {
    if (err) {
      error = err;
    }

    out = response;
    out && (out.base = url + '/');
    count++;

    if (count === 2) {
      onComplete(error, out);
    }
  });
  var js = url + "/index." + (version ? version + '.' : '') + "js";
  downloadScript(js, options, function (err) {
    if (err) {
      error = err;
    }

    count++;

    if (count === 2) {
      onComplete(error, out);
    }
  });
};

var _downloading = new Cache();

var _queue = [];
var _queueDirty = false; // the number of loading thread

var _totalNum = 0; // the number of request that launched in this period

var _totalNumThisPeriod = 0; // last time, if now - lastTime > period, refresh _totalNumThisPeriod.

var _lastDate = -1; // if _totalNumThisPeriod equals max, move request to next period using setTimeOut.


var _checkNextPeriod = false;

var updateTime = function updateTime() {
  var now = Date.now(); // use deltaTime as interval

  var interval = cc.director._deltaTime > downloader._maxInterval ? downloader._maxInterval : cc.director._deltaTime;

  if (now - _lastDate > interval * 1000) {
    _totalNumThisPeriod = 0;
    _lastDate = now;
  }
}; // handle the rest request in next period


var handleQueue = function handleQueue(maxConcurrency, maxRequestsPerFrame) {
  _checkNextPeriod = false;
  updateTime();

  while (_queue.length > 0 && _totalNum < maxConcurrency && _totalNumThisPeriod < maxRequestsPerFrame) {
    if (_queueDirty) {
      _queue.sort(function (a, b) {
        return a.priority - b.priority;
      });

      _queueDirty = false;
    }

    var nextOne = _queue.pop();

    if (!nextOne) {
      break;
    }

    _totalNum++;
    _totalNumThisPeriod++;
    nextOne.invoke();
  }

  if (_queue.length > 0 && _totalNum < maxConcurrency) {
    callInNextTick(handleQueue, maxConcurrency, maxRequestsPerFrame);
    _checkNextPeriod = true;
  }
};
/**
 * !#en
 * Control all download process, it is a singleton. All member can be accessed with `cc.assetManager.downloader` , it can download several types of files:
 * 1. Text
 * 2. Image
 * 3. Audio
 * 4. Assets
 * 5. Scripts
 * 
 * !#zh
 * 管理所有下载过程，downloader 是个单例，所有成员能通过 `cc.assetManager.downloader` 访问，它能下载以下几种类型的文件：
 * 1. 文本
 * 2. 图片
 * 3. 音频
 * 4. 资源
 * 5. 脚本
 * 
 * @class Downloader
 */


var downloader = {
  _remoteServerAddress: '',
  _maxInterval: 1 / 30,

  /**
   * !#en 
   * The address of remote server
   * 
   * !#zh
   * 远程服务器地址
   * 
   * @property remoteServerAddress
   * @type {string}
   * @default ''
   */
  get remoteServerAddress() {
    return this._remoteServerAddress;
  },

  /**
   * !#en 
   * The maximum number of concurrent when downloading
   * 
   * !#zh
   * 下载时的最大并发数
   * 
   * @property maxConcurrency
   * @type {number}
   * @default 6
   */
  maxConcurrency: 6,

  /**
   * !#en 
   * The maximum number of request can be launched per frame when downloading
   * 
   * !#zh
   * 下载时每帧可以启动的最大请求数
   * 
   * @property maxRequestsPerFrame
   * @type {number}
   * @default 6
   */
  maxRequestsPerFrame: 6,

  /**
   * !#en
   * The max number of retries when fail
   *  
   * !#zh
   * 失败重试次数
   * 
   * @property maxRetryCount
   * @type {Number}
   */
  maxRetryCount: 3,
  appendTimeStamp: false,
  limited: true,

  /**
   * !#en
   * Wait for while before another retry, unit: ms
   * 
   * !#zh
   * 重试的间隔时间
   * 
   * @property retryInterval
   * @type {Number}
   */
  retryInterval: 2000,
  bundleVers: null,

  /*
   * !#en
   * Use Image element to download image
   *  
   * !#zh
   * 使用 Image 元素来下载图片
   * 
   * @method downloadDomImage
   * @param {string} url - Url of the image
   * @param {Object} [options] - Some optional paramters
   * @param {Function} [onComplete] - Callback when image loaded or failed
   * @param {Error} onComplete.err - The occurred error, null indicetes success
   * @param {HTMLImageElement} onComplete.img - The loaded Image element, null if error occurred
   * @returns {HTMLImageElement} The image element
   * 
   * @example
   * downloadDomImage('http://example.com/test.jpg', null, (err, img) => console.log(err));
   * 
   * @typescript
   * downloadDomImage(url: string, options?: Record<string, any> , onComplete?: (err: Error, img: HTMLImageElement) => void): HTMLImageElement
   * downloadDomImage(url: string, onComplete?: (err: Error, img: HTMLImageElement) => void): HTMLImageElement
   */
  downloadDomImage: downloadDomImage,

  /*
   * !#en
   * Use audio element to download audio
   * 
   * !#zh
   * 使用 Audio 元素来下载音频 
   * 
   * @method downloadDomAudio
   * @param {string} url - Url of the audio
   * @param {Object} [options] - Some optional paramters
   * @param {Function} [onComplete] - Callback invoked when audio loaded or failed
   * @param {Error} onComplete.err - The occurred error, null indicetes success
   * @param {HTMLAudioElement} onComplete.audio - The loaded audio element, null if error occurred
   * @returns {HTMLAudioElement} The audio element
   * 
   * @example
   * downloadDomAudio('http://example.com/test.mp3', null, (err, audio) => console.log(err));
   * 
   * @typescript
   * downloadDomAudio(url: string, options?: Record<string, any>, onComplete?: (err: Error, audio: HTMLAudioElement) => void): HTMLAudioElement
   * downloadDomAudio(url: string, onComplete?: (err: Error, audio: HTMLAudioElement) => void): HTMLAudioElement
   */
  downloadDomAudio: downloadDomAudio,

  /*
   * !#en
   * Use XMLHttpRequest to download file
   * 
   * !#zh
   * 使用 XMLHttpRequest 来下载文件
   * 
   * @method downloadFile
   * @param {string} url - Url of the file
   * @param {Object} [options] - Some optional paramters
   * @param {string} [options.responseType] - Indicate which type of content should be returned
   * @param {boolean} [options.withCredentials] - Indicate whether or not cross-site Access-Contorl requests should be made using credentials
   * @param {string} [options.mimeType] - Indicate which type of content should be returned. In some browsers, responseType does't work, you can use mimeType instead
   * @param {Number} [options.timeout] - Represent the number of ms a request can take before being terminated.
   * @param {Object} [options.header] - The header should be tranferred to server
   * @param {Function} [onFileProgress] - Callback continuously during download is processing
   * @param {Number} onFileProgress.loaded - Size of downloaded content.
   * @param {Number} onFileProgress.total - Total size of content.
   * @param {Function} [onComplete] - Callback when file loaded or failed
   * @param {Error} onComplete.err - The occurred error, null indicetes success
   * @param {*} onComplete.response - The loaded content, null if error occurred, type of content can be indicated by options.responseType
   * @returns {XMLHttpRequest} The xhr to be send
   * 
   * @example
   * downloadFile('http://example.com/test.bin', {responseType: 'arraybuffer'}, null, (err, arrayBuffer) => console.log(err));
   * 
   * @typescript
   * downloadFile(url: string, options?: Record<string, any>, onFileProgress?: (loaded: Number, total: Number) => void, onComplete?: (err: Error, response: any) => void): XMLHttpRequest
   * downloadFile(url: string, onFileProgress?: (loaded: Number, total: Number) => void, onComplete?: (err: Error, response: any) => void): XMLHttpRequest
   * downloadFile(url: string, options?: Record<string, any>, onComplete?: (err: Error, response: any) => void): XMLHttpRequest
   * downloadFile(url: string, onComplete?: (err: Error, response: any) => void): XMLHttpRequest
   */
  downloadFile: downloadFile,

  /*
   * !#en
   * Load script 
   * 
   * !#zh
   * 加载脚本
   * 
   * @method downloadScript
   * @param {string} url - Url of the script
   * @param {Object} [options] - Some optional paramters
   * @param {boolean} [options.isAsync] - Indicate whether or not loading process should be async
   * @param {Function} [onComplete] - Callback when script loaded or failed
   * @param {Error} onComplete.err - The occurred error, null indicetes success
   * 
   * @example
   * downloadScript('http://localhost:8080/index.js', null, (err) => console.log(err));
   * 
   * @typescript
   * downloadScript(url: string, options?: Record<string, any>, onComplete?: (err: Error) => void): void
   * downloadScript(url: string, onComplete?: (err: Error) => void): void
   */
  downloadScript: downloadScript,
  init: function init(bundleVers, remoteServerAddress) {
    _downloading.clear();

    _queue.length = 0;
    this._remoteServerAddress = remoteServerAddress || '';
    this.bundleVers = bundleVers || Object.create(null);
  },

  /**
   * !#en
   * Register custom handler if you want to change default behavior or extend downloader to download other format file
   * 
   * !#zh
   * 当你想修改默认行为或者拓展 downloader 来下载其他格式文件时可以注册自定义的 handler 
   * 
   * @method register
   * @param {string|Object} type - Extension likes '.jpg' or map likes {'.jpg': jpgHandler, '.png': pngHandler}
   * @param {Function} [handler] - handler
   * @param {string} handler.url - url
   * @param {Object} handler.options - some optional paramters will be transferred to handler.
   * @param {Function} handler.onComplete - callback when finishing downloading
   * 
   * @example
   * downloader.register('.tga', (url, options, onComplete) => onComplete(null, null));
   * downloader.register({'.tga': (url, options, onComplete) => onComplete(null, null), '.ext': (url, options, onComplete) => onComplete(null, null)});
   * 
   * @typescript
   * register(type: string, handler: (url: string, options: Record<string, any>, onComplete: (err: Error, content: any) => void) => void): void
   * register(map: Record<string, (url: string, options: Record<string, any>, onComplete: (err: Error, content: any) => void) => void>): void
   */
  register: function register(type, handler) {
    if (typeof type === 'object') {
      js.mixin(downloaders, type);
    } else {
      downloaders[type] = handler;
    }
  },

  /**
   * !#en
   * Use corresponding handler to download file under limitation 
   * 
   * !#zh
   * 在限制下使用对应的 handler 来下载文件
   * 
   * @method download
   * @param {string} url - The url should be downloaded
   * @param {string} type - The type indicates that which handler should be used to download, such as '.jpg'
   * @param {Object} options - some optional paramters will be transferred to the corresponding handler.
   * @param {Function} [options.onFileProgress] - progressive callback will be transferred to handler.
   * @param {Number} [options.maxRetryCount] - How many times should retry when download failed
   * @param {Number} [options.maxConcurrency] - The maximum number of concurrent when downloading
   * @param {Number} [options.maxRequestsPerFrame] - The maximum number of request can be launched per frame when downloading
   * @param {Number} [options.priority] - The priority of this url, default is 0, the greater number is higher priority.
   * @param {Function} onComplete - callback when finishing downloading
   * @param {Error} onComplete.err - The occurred error, null indicetes success
   * @param {*} onComplete.contetnt - The downloaded file
   * 
   * @example
   * download('http://example.com/test.tga', '.tga', {onFileProgress: (loaded, total) => console.lgo(loaded/total)}, onComplete: (err) => console.log(err));
   * 
   * @typescript
   * download(id: string, url: string, type: string, options: Record<string, any>, onComplete: (err: Error, content: any) => void): void
   */
  download: function download(id, url, type, options, onComplete) {
    var func = downloaders[type] || downloaders['default'];
    var self = this; // if it is downloaded, don't download again

    var file, downloadCallbacks;

    if (file = files.get(id)) {
      onComplete(null, file);
    } else if (downloadCallbacks = _downloading.get(id)) {
      downloadCallbacks.push(onComplete);

      for (var i = 0, l = _queue.length; i < l; i++) {
        var item = _queue[i];

        if (item.id === id) {
          var priority = options.priority || 0;

          if (item.priority < priority) {
            item.priority = priority;
            _queueDirty = true;
          }

          return;
        }
      }
    } else {
      var process = function process(index, callback) {
        if (index === 0) {
          _downloading.add(id, [onComplete]);
        }

        if (!self.limited) return func(urlAppendTimestamp(url), options, callback); // refresh

        updateTime();

        function invoke() {
          func(urlAppendTimestamp(url), options, function () {
            // when finish downloading, update _totalNum
            _totalNum--;

            if (!_checkNextPeriod && _queue.length > 0) {
              callInNextTick(handleQueue, maxConcurrency, maxRequestsPerFrame);
              _checkNextPeriod = true;
            }

            callback.apply(this, arguments);
          });
        }

        if (_totalNum < maxConcurrency && _totalNumThisPeriod < maxRequestsPerFrame) {
          invoke();
          _totalNum++;
          _totalNumThisPeriod++;
        } else {
          // when number of request up to limitation, cache the rest
          _queue.push({
            id: id,
            priority: options.priority || 0,
            invoke: invoke
          });

          _queueDirty = true;

          if (!_checkNextPeriod && _totalNum < maxConcurrency) {
            callInNextTick(handleQueue, maxConcurrency, maxRequestsPerFrame);
            _checkNextPeriod = true;
          }
        }
      }; // when retry finished, invoke callbacks


      var finale = function finale(err, result) {
        if (!err) files.add(id, result);

        var callbacks = _downloading.remove(id);

        for (var _i = 0, _l = callbacks.length; _i < _l; _i++) {
          callbacks[_i](err, result);
        }
      };

      // if download fail, should retry
      var maxRetryCount = typeof options.maxRetryCount !== 'undefined' ? options.maxRetryCount : this.maxRetryCount;
      var maxConcurrency = typeof options.maxConcurrency !== 'undefined' ? options.maxConcurrency : this.maxConcurrency;
      var maxRequestsPerFrame = typeof options.maxRequestsPerFrame !== 'undefined' ? options.maxRequestsPerFrame : this.maxRequestsPerFrame;
      retry(process, maxRetryCount, this.retryInterval, finale);
    }
  }
}; // dafault handler map

var downloaders = {
  // Images
  '.png': downloadImage,
  '.jpg': downloadImage,
  '.bmp': downloadImage,
  '.jpeg': downloadImage,
  '.gif': downloadImage,
  '.ico': downloadImage,
  '.tiff': downloadImage,
  '.webp': downloadImage,
  '.image': downloadImage,
  '.pvr': downloadArrayBuffer,
  '.pkm': downloadArrayBuffer,
  // Audio
  '.mp3': downloadAudio,
  '.ogg': downloadAudio,
  '.wav': downloadAudio,
  '.m4a': downloadAudio,
  // Txt
  '.txt': downloadText,
  '.xml': downloadText,
  '.vsh': downloadText,
  '.fsh': downloadText,
  '.atlas': downloadText,
  '.tmx': downloadText,
  '.tsx': downloadText,
  '.json': downloadJson,
  '.ExportJson': downloadJson,
  '.plist': downloadText,
  '.fnt': downloadText,
  // font
  '.font': loadFont,
  '.eot': loadFont,
  '.ttf': loadFont,
  '.woff': loadFont,
  '.svg': loadFont,
  '.ttc': loadFont,
  // Video
  '.mp4': downloadVideo,
  '.avi': downloadVideo,
  '.mov': downloadVideo,
  '.mpg': downloadVideo,
  '.mpeg': downloadVideo,
  '.rm': downloadVideo,
  '.rmvb': downloadVideo,
  // Binary
  '.binary': downloadArrayBuffer,
  '.bin': downloadArrayBuffer,
  '.dbbin': downloadArrayBuffer,
  '.skel': downloadArrayBuffer,
  '.js': downloadScript,
  'bundle': downloadBundle,
  'default': downloadText
};
downloader._downloaders = downloaders;
module.exports = downloader;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0LW1hbmFnZXIvZG93bmxvYWRlci5qcyJdLCJuYW1lcyI6WyJqcyIsInJlcXVpcmUiLCJkZWJ1ZyIsImxvYWRGb250IiwiY2FsbEluTmV4dFRpY2siLCJkb3dubG9hZERvbUltYWdlIiwiZG93bmxvYWREb21BdWRpbyIsImRvd25sb2FkRmlsZSIsImRvd25sb2FkU2NyaXB0IiwiQ2FjaGUiLCJmaWxlcyIsIl9fYXVkaW9TdXBwb3J0IiwiY2FwYWJpbGl0aWVzIiwidXJsQXBwZW5kVGltZXN0YW1wIiwicmV0cnkiLCJSRUdFWCIsImZvcm1hdFN1cHBvcnQiLCJmb3JtYXQiLCJ1bnN1cHBvcnRlZCIsInVybCIsIm9wdGlvbnMiLCJvbkNvbXBsZXRlIiwiRXJyb3IiLCJnZXRFcnJvciIsImRvd25sb2FkQXVkaW8iLCJhdWRpb0xvYWRNb2RlIiwiY2MiLCJBdWRpb0NsaXAiLCJMb2FkTW9kZSIsIkRPTV9BVURJTyIsImRvd25sb2FkQXJyYXlCdWZmZXIiLCJDQ19FRElUT1IiLCJFZGl0b3IiLCJpc01haW5Qcm9jZXNzIiwibGVuZ3RoIiwiV0VCX0FVRElPIiwiZG93bmxvYWRJbWFnZSIsImZ1bmMiLCJpbWFnZUJpdG1hcCIsIm1hY3JvIiwiQUxMT1dfSU1BR0VfQklUTUFQIiwiZG93bmxvYWRCbG9iIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJyZXNwb25zZVR5cGUiLCJvbkZpbGVQcm9ncmVzcyIsImRvd25sb2FkSnNvbiIsImVyciIsImRhdGEiLCJKU09OIiwicGFyc2UiLCJlIiwiZG93bmxvYWRUZXh0IiwiZG93bmxvYWRWaWRlbyIsImRvd25sb2FkQnVuZGxlIiwibmFtZU9yVXJsIiwiYnVuZGxlTmFtZSIsInBhdGgiLCJiYXNlbmFtZSIsInRlc3QiLCJ2ZXJzaW9uIiwiZG93bmxvYWRlciIsImJ1bmRsZVZlcnMiLCJjb3VudCIsImNvbmZpZyIsIm91dCIsImVycm9yIiwicmVzcG9uc2UiLCJiYXNlIiwiX2Rvd25sb2FkaW5nIiwiX3F1ZXVlIiwiX3F1ZXVlRGlydHkiLCJfdG90YWxOdW0iLCJfdG90YWxOdW1UaGlzUGVyaW9kIiwiX2xhc3REYXRlIiwiX2NoZWNrTmV4dFBlcmlvZCIsInVwZGF0ZVRpbWUiLCJub3ciLCJEYXRlIiwiaW50ZXJ2YWwiLCJkaXJlY3RvciIsIl9kZWx0YVRpbWUiLCJfbWF4SW50ZXJ2YWwiLCJoYW5kbGVRdWV1ZSIsIm1heENvbmN1cnJlbmN5IiwibWF4UmVxdWVzdHNQZXJGcmFtZSIsInNvcnQiLCJhIiwiYiIsInByaW9yaXR5IiwibmV4dE9uZSIsInBvcCIsImludm9rZSIsIl9yZW1vdGVTZXJ2ZXJBZGRyZXNzIiwicmVtb3RlU2VydmVyQWRkcmVzcyIsIm1heFJldHJ5Q291bnQiLCJhcHBlbmRUaW1lU3RhbXAiLCJsaW1pdGVkIiwicmV0cnlJbnRlcnZhbCIsImluaXQiLCJjbGVhciIsIk9iamVjdCIsImNyZWF0ZSIsInJlZ2lzdGVyIiwidHlwZSIsImhhbmRsZXIiLCJtaXhpbiIsImRvd25sb2FkZXJzIiwiZG93bmxvYWQiLCJpZCIsInNlbGYiLCJmaWxlIiwiZG93bmxvYWRDYWxsYmFja3MiLCJnZXQiLCJwdXNoIiwiaSIsImwiLCJpdGVtIiwicHJvY2VzcyIsImluZGV4IiwiY2FsbGJhY2siLCJhZGQiLCJmaW5hbGUiLCJyZXN1bHQiLCJjYWxsYmFja3MiLCJyZW1vdmUiLCJfZG93bmxvYWRlcnMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU1BLEVBQUUsR0FBR0MsT0FBTyxDQUFDLGdCQUFELENBQWxCOztBQUNBLElBQU1DLEtBQUssR0FBR0QsT0FBTyxDQUFDLFlBQUQsQ0FB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O0FBZ0RkLFVBQVFBLGFBaERNO0FBaURkLFdBQVNBLGFBakRLO0FBa0RkLFNBQU9BLGFBbERPO0FBbURkLFdBQVNBLGFBbkRLO0FBcURkO0FBQ0EsYUFBWXZCLG1CQXRERTtBQXVEZCxVQUFRQSxtQkF2RE07QUF3RGQsWUFBVUEsbUJBeERJO0FBeURkLFdBQVNBLG1CQXpESztBQTJEZCxTQUFPdEIsY0EzRE87QUE2RGQsWUFBVThDLGNBN0RJO0FBK0RkLGFBQVdGO0FBL0RHLENBQWxCO0FBbUVBUyxVQUFVLENBQUNpRSxZQUFYLEdBQTBCbkIsV0FBMUI7QUFDQW9CLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQm5FLFVBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqXG4gKiBAbW9kdWxlIGNjLkFzc2V0TWFuYWdlclxuICovXG5jb25zdCBqcyA9IHJlcXVpcmUoJy4uL3BsYXRmb3JtL2pzJyk7XG5jb25zdCBkZWJ1ZyA9IHJlcXVpcmUoJy4uL0NDRGVidWcnKTtcbmNvbnN0IHsgbG9hZEZvbnQgfSA9IHJlcXVpcmUoJy4vZm9udC1sb2FkZXInKTtcbmNvbnN0IGNhbGxJbk5leHRUaWNrID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vdXRpbHMnKS5jYWxsSW5OZXh0VGljaztcbmNvbnN0IGRvd25sb2FkRG9tSW1hZ2UgPSByZXF1aXJlKCcuL2Rvd25sb2FkLWRvbS1pbWFnZScpO1xuY29uc3QgZG93bmxvYWREb21BdWRpbyA9IHJlcXVpcmUoJy4vZG93bmxvYWQtZG9tLWF1ZGlvJyk7XG5jb25zdCBkb3dubG9hZEZpbGUgPSByZXF1aXJlKCcuL2Rvd25sb2FkLWZpbGUnKTtcbmNvbnN0IGRvd25sb2FkU2NyaXB0ID0gcmVxdWlyZSgnLi9kb3dubG9hZC1zY3JpcHQuanMnKTtcbmNvbnN0IENhY2hlID0gcmVxdWlyZSgnLi9jYWNoZScpO1xuY29uc3QgeyBmaWxlcyB9ID0gcmVxdWlyZSgnLi9zaGFyZWQnKTtcbmNvbnN0IHsgX19hdWRpb1N1cHBvcnQsIGNhcGFiaWxpdGllcyB9ID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vQ0NTeXMnKTtcbmNvbnN0IHsgdXJsQXBwZW5kVGltZXN0YW1wLCByZXRyeSB9ID0gcmVxdWlyZSgnLi91dGlsaXRpZXMnKTtcblxuY29uc3QgUkVHRVggPSAvXig/Olxcdys6XFwvXFwvfFxcLitcXC8pLisvO1xuXG5cbnZhciBmb3JtYXRTdXBwb3J0ID0gX19hdWRpb1N1cHBvcnQuZm9ybWF0IHx8IFtdO1xuXG52YXIgdW5zdXBwb3J0ZWQgPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zLCBvbkNvbXBsZXRlKSB7XG4gICAgb25Db21wbGV0ZShuZXcgRXJyb3IoZGVidWcuZ2V0RXJyb3IoNDkyNykpKTtcbn1cblxudmFyIGRvd25sb2FkQXVkaW8gPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zLCBvbkNvbXBsZXRlKSB7XG4gICAgLy8gd2ViIGF1ZGlvIG5lZWQgdG8gZG93bmxvYWQgZmlsZSBhcyBhcnJheUJ1ZmZlclxuICAgIGlmIChvcHRpb25zLmF1ZGlvTG9hZE1vZGUgIT09IGNjLkF1ZGlvQ2xpcC5Mb2FkTW9kZS5ET01fQVVESU8pIHtcbiAgICAgICAgZG93bmxvYWRBcnJheUJ1ZmZlcih1cmwsIG9wdGlvbnMsIG9uQ29tcGxldGUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZG93bmxvYWREb21BdWRpbyh1cmwsIG9wdGlvbnMsIG9uQ29tcGxldGUpO1xuICAgIH1cbn07XG5cbnZhciBkb3dubG9hZEF1ZGlvID0gKCFDQ19FRElUT1IgfHwgIUVkaXRvci5pc01haW5Qcm9jZXNzKSA/IChmb3JtYXRTdXBwb3J0Lmxlbmd0aCA9PT0gMCA/IHVuc3VwcG9ydGVkIDogKF9fYXVkaW9TdXBwb3J0LldFQl9BVURJTyA/IGRvd25sb2FkQXVkaW8gOiBkb3dubG9hZERvbUF1ZGlvKSkgOiBudWxsO1xuXG52YXIgZG93bmxvYWRJbWFnZSA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMsIG9uQ29tcGxldGUpIHtcbiAgICAvLyBpZiBjcmVhdGVJbWFnZUJpdG1hcCBpcyB2YWxpZCwgd2UgY2FuIHRyYW5zZm9ybSBibG9iIHRvIEltYWdlQml0bWFwLiBPdGhlcndpc2UsIGp1c3QgdXNlIEhUTUxJbWFnZUVsZW1lbnQgdG8gbG9hZFxuICAgIHZhciBmdW5jID0gY2FwYWJpbGl0aWVzLmltYWdlQml0bWFwICYmIGNjLm1hY3JvLkFMTE9XX0lNQUdFX0JJVE1BUCA/IGRvd25sb2FkQmxvYiA6IGRvd25sb2FkRG9tSW1hZ2U7XG4gICAgZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcblxudmFyIGRvd25sb2FkQmxvYiA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMsIG9uQ29tcGxldGUpIHtcbiAgICBvcHRpb25zLnJlc3BvbnNlVHlwZSA9IFwiYmxvYlwiO1xuICAgIGRvd25sb2FkRmlsZSh1cmwsIG9wdGlvbnMsIG9wdGlvbnMub25GaWxlUHJvZ3Jlc3MsIG9uQ29tcGxldGUpO1xufTtcblxudmFyIGRvd25sb2FkSnNvbiA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMsIG9uQ29tcGxldGUpIHtcbiAgICBvcHRpb25zLnJlc3BvbnNlVHlwZSA9IFwianNvblwiO1xuICAgIGRvd25sb2FkRmlsZSh1cmwsIG9wdGlvbnMsIG9wdGlvbnMub25GaWxlUHJvZ3Jlc3MsIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgICAgaWYgKCFlcnIgJiYgdHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBlcnIgPSBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG9uQ29tcGxldGUgJiYgb25Db21wbGV0ZShlcnIsIGRhdGEpO1xuICAgIH0pO1xufTtcblxudmFyIGRvd25sb2FkQXJyYXlCdWZmZXIgPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zLCBvbkNvbXBsZXRlKSB7XG4gICAgb3B0aW9ucy5yZXNwb25zZVR5cGUgPSBcImFycmF5YnVmZmVyXCI7XG4gICAgZG93bmxvYWRGaWxlKHVybCwgb3B0aW9ucywgb3B0aW9ucy5vbkZpbGVQcm9ncmVzcywgb25Db21wbGV0ZSk7XG59O1xuXG52YXIgZG93bmxvYWRUZXh0ID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucywgb25Db21wbGV0ZSkge1xuICAgIG9wdGlvbnMucmVzcG9uc2VUeXBlID0gXCJ0ZXh0XCI7XG4gICAgZG93bmxvYWRGaWxlKHVybCwgb3B0aW9ucywgb3B0aW9ucy5vbkZpbGVQcm9ncmVzcywgb25Db21wbGV0ZSk7XG59O1xuXG52YXIgZG93bmxvYWRWaWRlbyA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMsIG9uQ29tcGxldGUpIHtcbiAgICBvbkNvbXBsZXRlKG51bGwsIHVybCk7XG59O1xuXG52YXIgZG93bmxvYWRCdW5kbGUgPSBmdW5jdGlvbiAobmFtZU9yVXJsLCBvcHRpb25zLCBvbkNvbXBsZXRlKSB7XG4gICAgbGV0IGJ1bmRsZU5hbWUgPSBjYy5wYXRoLmJhc2VuYW1lKG5hbWVPclVybCk7XG4gICAgbGV0IHVybCA9IG5hbWVPclVybDtcbiAgICBpZiAoIVJFR0VYLnRlc3QodXJsKSkgdXJsID0gJ2Fzc2V0cy8nICsgYnVuZGxlTmFtZTtcbiAgICB2YXIgdmVyc2lvbiA9IG9wdGlvbnMudmVyc2lvbiB8fCBkb3dubG9hZGVyLmJ1bmRsZVZlcnNbYnVuZGxlTmFtZV07XG4gICAgdmFyIGNvdW50ID0gMDtcbiAgICB2YXIgY29uZmlnID0gYCR7dXJsfS9jb25maWcuJHt2ZXJzaW9uID8gdmVyc2lvbiArICcuJyA6ICcnfWpzb25gO1xuICAgIGxldCBvdXQgPSBudWxsLCBlcnJvciA9IG51bGw7XG4gICAgZG93bmxvYWRKc29uKGNvbmZpZywgb3B0aW9ucywgZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgZXJyb3IgPSBlcnI7XG4gICAgICAgIH1cbiAgICAgICAgb3V0ID0gcmVzcG9uc2U7XG4gICAgICAgIG91dCAmJiAob3V0LmJhc2UgPSB1cmwgKyAnLycpO1xuICAgICAgICBjb3VudCsrO1xuICAgICAgICBpZiAoY291bnQgPT09IDIpIHtcbiAgICAgICAgICAgIG9uQ29tcGxldGUoZXJyb3IsIG91dCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBqcyA9IGAke3VybH0vaW5kZXguJHt2ZXJzaW9uID8gdmVyc2lvbiArICcuJyA6ICcnfWpzYDtcbiAgICBkb3dubG9hZFNjcmlwdChqcywgb3B0aW9ucywgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBlcnJvciA9IGVycjtcbiAgICAgICAgfVxuICAgICAgICBjb3VudCsrO1xuICAgICAgICBpZiAoY291bnQgPT09IDIpIHtcbiAgICAgICAgICAgIG9uQ29tcGxldGUoZXJyb3IsIG91dCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbnZhciBfZG93bmxvYWRpbmcgPSBuZXcgQ2FjaGUoKTtcbnZhciBfcXVldWUgPSBbXTtcbnZhciBfcXVldWVEaXJ0eSA9IGZhbHNlO1xuXG4vLyB0aGUgbnVtYmVyIG9mIGxvYWRpbmcgdGhyZWFkXG52YXIgX3RvdGFsTnVtID0gMDtcblxuLy8gdGhlIG51bWJlciBvZiByZXF1ZXN0IHRoYXQgbGF1bmNoZWQgaW4gdGhpcyBwZXJpb2RcbnZhciBfdG90YWxOdW1UaGlzUGVyaW9kID0gMDtcblxuLy8gbGFzdCB0aW1lLCBpZiBub3cgLSBsYXN0VGltZSA+IHBlcmlvZCwgcmVmcmVzaCBfdG90YWxOdW1UaGlzUGVyaW9kLlxudmFyIF9sYXN0RGF0ZSA9IC0xO1xuXG4vLyBpZiBfdG90YWxOdW1UaGlzUGVyaW9kIGVxdWFscyBtYXgsIG1vdmUgcmVxdWVzdCB0byBuZXh0IHBlcmlvZCB1c2luZyBzZXRUaW1lT3V0LlxudmFyIF9jaGVja05leHRQZXJpb2QgPSBmYWxzZTtcblxudmFyIHVwZGF0ZVRpbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5vdyA9IERhdGUubm93KCk7XG4gICAgLy8gdXNlIGRlbHRhVGltZSBhcyBpbnRlcnZhbFxuICAgIGxldCBpbnRlcnZhbCA9IGNjLmRpcmVjdG9yLl9kZWx0YVRpbWUgPiBkb3dubG9hZGVyLl9tYXhJbnRlcnZhbCA/IGRvd25sb2FkZXIuX21heEludGVydmFsIDogY2MuZGlyZWN0b3IuX2RlbHRhVGltZTtcbiAgICBpZiAobm93IC0gX2xhc3REYXRlID4gaW50ZXJ2YWwgKiAxMDAwKSB7XG4gICAgICAgIF90b3RhbE51bVRoaXNQZXJpb2QgPSAwO1xuICAgICAgICBfbGFzdERhdGUgPSBub3c7XG4gICAgfVxufTtcblxuLy8gaGFuZGxlIHRoZSByZXN0IHJlcXVlc3QgaW4gbmV4dCBwZXJpb2RcbnZhciBoYW5kbGVRdWV1ZSA9IGZ1bmN0aW9uIChtYXhDb25jdXJyZW5jeSwgbWF4UmVxdWVzdHNQZXJGcmFtZSkge1xuICAgIF9jaGVja05leHRQZXJpb2QgPSBmYWxzZTtcbiAgICB1cGRhdGVUaW1lKCk7XG4gICAgd2hpbGUgKF9xdWV1ZS5sZW5ndGggPiAwICYmIF90b3RhbE51bSA8IG1heENvbmN1cnJlbmN5ICYmIF90b3RhbE51bVRoaXNQZXJpb2QgPCBtYXhSZXF1ZXN0c1BlckZyYW1lKSB7XG4gICAgICAgIGlmIChfcXVldWVEaXJ0eSkge1xuICAgICAgICAgICAgX3F1ZXVlLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS5wcmlvcml0eSAtIGIucHJpb3JpdHk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIF9xdWV1ZURpcnR5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5leHRPbmUgPSBfcXVldWUucG9wKCk7XG4gICAgICAgIGlmICghbmV4dE9uZSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgX3RvdGFsTnVtKys7XG4gICAgICAgIF90b3RhbE51bVRoaXNQZXJpb2QrKztcbiAgICAgICAgbmV4dE9uZS5pbnZva2UoKTtcbiAgICB9XG5cbiAgICBpZiAoX3F1ZXVlLmxlbmd0aCA+IDAgJiYgX3RvdGFsTnVtIDwgbWF4Q29uY3VycmVuY3kpIHtcbiAgICAgICAgY2FsbEluTmV4dFRpY2soaGFuZGxlUXVldWUsIG1heENvbmN1cnJlbmN5LCBtYXhSZXF1ZXN0c1BlckZyYW1lKTtcbiAgICAgICAgX2NoZWNrTmV4dFBlcmlvZCA9IHRydWU7XG4gICAgfVxufVxuXG5cbi8qKlxuICogISNlblxuICogQ29udHJvbCBhbGwgZG93bmxvYWQgcHJvY2VzcywgaXQgaXMgYSBzaW5nbGV0b24uIEFsbCBtZW1iZXIgY2FuIGJlIGFjY2Vzc2VkIHdpdGggYGNjLmFzc2V0TWFuYWdlci5kb3dubG9hZGVyYCAsIGl0IGNhbiBkb3dubG9hZCBzZXZlcmFsIHR5cGVzIG9mIGZpbGVzOlxuICogMS4gVGV4dFxuICogMi4gSW1hZ2VcbiAqIDMuIEF1ZGlvXG4gKiA0LiBBc3NldHNcbiAqIDUuIFNjcmlwdHNcbiAqIFxuICogISN6aFxuICog566h55CG5omA5pyJ5LiL6L296L+H56iL77yMZG93bmxvYWRlciDmmK/kuKrljZXkvovvvIzmiYDmnInmiJDlkZjog73pgJrov4cgYGNjLmFzc2V0TWFuYWdlci5kb3dubG9hZGVyYCDorr/pl67vvIzlroPog73kuIvovb3ku6XkuIvlh6Dnp43nsbvlnovnmoTmlofku7bvvJpcbiAqIDEuIOaWh+acrFxuICogMi4g5Zu+54mHXG4gKiAzLiDpn7PpopFcbiAqIDQuIOi1hOa6kFxuICogNS4g6ISa5pysXG4gKiBcbiAqIEBjbGFzcyBEb3dubG9hZGVyXG4gKi9cbnZhciBkb3dubG9hZGVyID0ge1xuXG4gICAgX3JlbW90ZVNlcnZlckFkZHJlc3M6ICcnLFxuICAgIF9tYXhJbnRlcnZhbDogMSAvIDMwLFxuICAgIFxuICAgIC8qKlxuICAgICAqICEjZW4gXG4gICAgICogVGhlIGFkZHJlc3Mgb2YgcmVtb3RlIHNlcnZlclxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDov5znqIvmnI3liqHlmajlnLDlnYBcbiAgICAgKiBcbiAgICAgKiBAcHJvcGVydHkgcmVtb3RlU2VydmVyQWRkcmVzc1xuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQGRlZmF1bHQgJydcbiAgICAgKi9cbiAgICBnZXQgcmVtb3RlU2VydmVyQWRkcmVzcyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZW1vdGVTZXJ2ZXJBZGRyZXNzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFxuICAgICAqIFRoZSBtYXhpbXVtIG51bWJlciBvZiBjb25jdXJyZW50IHdoZW4gZG93bmxvYWRpbmdcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog5LiL6L295pe255qE5pyA5aSn5bm25Y+R5pWwXG4gICAgICogXG4gICAgICogQHByb3BlcnR5IG1heENvbmN1cnJlbmN5XG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAZGVmYXVsdCA2XG4gICAgICovXG4gICAgbWF4Q29uY3VycmVuY3k6IDYsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFxuICAgICAqIFRoZSBtYXhpbXVtIG51bWJlciBvZiByZXF1ZXN0IGNhbiBiZSBsYXVuY2hlZCBwZXIgZnJhbWUgd2hlbiBkb3dubG9hZGluZ1xuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDkuIvovb3ml7bmr4/luKflj6/ku6XlkK/liqjnmoTmnIDlpKfor7fmsYLmlbBcbiAgICAgKiBcbiAgICAgKiBAcHJvcGVydHkgbWF4UmVxdWVzdHNQZXJGcmFtZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGRlZmF1bHQgNlxuICAgICAqL1xuICAgIG1heFJlcXVlc3RzUGVyRnJhbWU6IDYsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVGhlIG1heCBudW1iZXIgb2YgcmV0cmllcyB3aGVuIGZhaWxcbiAgICAgKiAgXG4gICAgICogISN6aFxuICAgICAqIOWksei0pemHjeivleasoeaVsFxuICAgICAqIFxuICAgICAqIEBwcm9wZXJ0eSBtYXhSZXRyeUNvdW50XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBtYXhSZXRyeUNvdW50OiAzLFxuXG4gICAgYXBwZW5kVGltZVN0YW1wOiBmYWxzZSxcblxuICAgIGxpbWl0ZWQ6IHRydWUsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogV2FpdCBmb3Igd2hpbGUgYmVmb3JlIGFub3RoZXIgcmV0cnksIHVuaXQ6IG1zXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOmHjeivleeahOmXtOmalOaXtumXtFxuICAgICAqIFxuICAgICAqIEBwcm9wZXJ0eSByZXRyeUludGVydmFsXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICByZXRyeUludGVydmFsOiAyMDAwLFxuXG4gICAgYnVuZGxlVmVyczogbnVsbCxcblxuICAgIC8qXG4gICAgICogISNlblxuICAgICAqIFVzZSBJbWFnZSBlbGVtZW50IHRvIGRvd25sb2FkIGltYWdlXG4gICAgICogIFxuICAgICAqICEjemhcbiAgICAgKiDkvb/nlKggSW1hZ2Ug5YWD57Sg5p2l5LiL6L295Zu+54mHXG4gICAgICogXG4gICAgICogQG1ldGhvZCBkb3dubG9hZERvbUltYWdlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFVybCBvZiB0aGUgaW1hZ2VcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gU29tZSBvcHRpb25hbCBwYXJhbXRlcnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25Db21wbGV0ZV0gLSBDYWxsYmFjayB3aGVuIGltYWdlIGxvYWRlZCBvciBmYWlsZWRcbiAgICAgKiBAcGFyYW0ge0Vycm9yfSBvbkNvbXBsZXRlLmVyciAtIFRoZSBvY2N1cnJlZCBlcnJvciwgbnVsbCBpbmRpY2V0ZXMgc3VjY2Vzc1xuICAgICAqIEBwYXJhbSB7SFRNTEltYWdlRWxlbWVudH0gb25Db21wbGV0ZS5pbWcgLSBUaGUgbG9hZGVkIEltYWdlIGVsZW1lbnQsIG51bGwgaWYgZXJyb3Igb2NjdXJyZWRcbiAgICAgKiBAcmV0dXJucyB7SFRNTEltYWdlRWxlbWVudH0gVGhlIGltYWdlIGVsZW1lbnRcbiAgICAgKiBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGRvd25sb2FkRG9tSW1hZ2UoJ2h0dHA6Ly9leGFtcGxlLmNvbS90ZXN0LmpwZycsIG51bGwsIChlcnIsIGltZykgPT4gY29uc29sZS5sb2coZXJyKSk7XG4gICAgICogXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBkb3dubG9hZERvbUltYWdlKHVybDogc3RyaW5nLCBvcHRpb25zPzogUmVjb3JkPHN0cmluZywgYW55PiAsIG9uQ29tcGxldGU/OiAoZXJyOiBFcnJvciwgaW1nOiBIVE1MSW1hZ2VFbGVtZW50KSA9PiB2b2lkKTogSFRNTEltYWdlRWxlbWVudFxuICAgICAqIGRvd25sb2FkRG9tSW1hZ2UodXJsOiBzdHJpbmcsIG9uQ29tcGxldGU/OiAoZXJyOiBFcnJvciwgaW1nOiBIVE1MSW1hZ2VFbGVtZW50KSA9PiB2b2lkKTogSFRNTEltYWdlRWxlbWVudFxuICAgICAqL1xuICAgIGRvd25sb2FkRG9tSW1hZ2U6IGRvd25sb2FkRG9tSW1hZ2UsXG5cbiAgICAvKlxuICAgICAqICEjZW5cbiAgICAgKiBVc2UgYXVkaW8gZWxlbWVudCB0byBkb3dubG9hZCBhdWRpb1xuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDkvb/nlKggQXVkaW8g5YWD57Sg5p2l5LiL6L296Z+z6aKRIFxuICAgICAqIFxuICAgICAqIEBtZXRob2QgZG93bmxvYWREb21BdWRpb1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBVcmwgb2YgdGhlIGF1ZGlvXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIFNvbWUgb3B0aW9uYWwgcGFyYW10ZXJzXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uQ29tcGxldGVdIC0gQ2FsbGJhY2sgaW52b2tlZCB3aGVuIGF1ZGlvIGxvYWRlZCBvciBmYWlsZWRcbiAgICAgKiBAcGFyYW0ge0Vycm9yfSBvbkNvbXBsZXRlLmVyciAtIFRoZSBvY2N1cnJlZCBlcnJvciwgbnVsbCBpbmRpY2V0ZXMgc3VjY2Vzc1xuICAgICAqIEBwYXJhbSB7SFRNTEF1ZGlvRWxlbWVudH0gb25Db21wbGV0ZS5hdWRpbyAtIFRoZSBsb2FkZWQgYXVkaW8gZWxlbWVudCwgbnVsbCBpZiBlcnJvciBvY2N1cnJlZFxuICAgICAqIEByZXR1cm5zIHtIVE1MQXVkaW9FbGVtZW50fSBUaGUgYXVkaW8gZWxlbWVudFxuICAgICAqIFxuICAgICAqIEBleGFtcGxlXG4gICAgICogZG93bmxvYWREb21BdWRpbygnaHR0cDovL2V4YW1wbGUuY29tL3Rlc3QubXAzJywgbnVsbCwgKGVyciwgYXVkaW8pID0+IGNvbnNvbGUubG9nKGVycikpO1xuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZG93bmxvYWREb21BdWRpbyh1cmw6IHN0cmluZywgb3B0aW9ucz86IFJlY29yZDxzdHJpbmcsIGFueT4sIG9uQ29tcGxldGU/OiAoZXJyOiBFcnJvciwgYXVkaW86IEhUTUxBdWRpb0VsZW1lbnQpID0+IHZvaWQpOiBIVE1MQXVkaW9FbGVtZW50XG4gICAgICogZG93bmxvYWREb21BdWRpbyh1cmw6IHN0cmluZywgb25Db21wbGV0ZT86IChlcnI6IEVycm9yLCBhdWRpbzogSFRNTEF1ZGlvRWxlbWVudCkgPT4gdm9pZCk6IEhUTUxBdWRpb0VsZW1lbnRcbiAgICAgKi9cbiAgICBkb3dubG9hZERvbUF1ZGlvOiBkb3dubG9hZERvbUF1ZGlvLFxuICAgIFxuICAgIC8qXG4gICAgICogISNlblxuICAgICAqIFVzZSBYTUxIdHRwUmVxdWVzdCB0byBkb3dubG9hZCBmaWxlXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOS9v+eUqCBYTUxIdHRwUmVxdWVzdCDmnaXkuIvovb3mlofku7ZcbiAgICAgKiBcbiAgICAgKiBAbWV0aG9kIGRvd25sb2FkRmlsZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBVcmwgb2YgdGhlIGZpbGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gU29tZSBvcHRpb25hbCBwYXJhbXRlcnNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMucmVzcG9uc2VUeXBlXSAtIEluZGljYXRlIHdoaWNoIHR5cGUgb2YgY29udGVudCBzaG91bGQgYmUgcmV0dXJuZWRcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLndpdGhDcmVkZW50aWFsc10gLSBJbmRpY2F0ZSB3aGV0aGVyIG9yIG5vdCBjcm9zcy1zaXRlIEFjY2Vzcy1Db250b3JsIHJlcXVlc3RzIHNob3VsZCBiZSBtYWRlIHVzaW5nIGNyZWRlbnRpYWxzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm1pbWVUeXBlXSAtIEluZGljYXRlIHdoaWNoIHR5cGUgb2YgY29udGVudCBzaG91bGQgYmUgcmV0dXJuZWQuIEluIHNvbWUgYnJvd3NlcnMsIHJlc3BvbnNlVHlwZSBkb2VzJ3Qgd29yaywgeW91IGNhbiB1c2UgbWltZVR5cGUgaW5zdGVhZFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy50aW1lb3V0XSAtIFJlcHJlc2VudCB0aGUgbnVtYmVyIG9mIG1zIGEgcmVxdWVzdCBjYW4gdGFrZSBiZWZvcmUgYmVpbmcgdGVybWluYXRlZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuaGVhZGVyXSAtIFRoZSBoZWFkZXIgc2hvdWxkIGJlIHRyYW5mZXJyZWQgdG8gc2VydmVyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uRmlsZVByb2dyZXNzXSAtIENhbGxiYWNrIGNvbnRpbnVvdXNseSBkdXJpbmcgZG93bmxvYWQgaXMgcHJvY2Vzc2luZ1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvbkZpbGVQcm9ncmVzcy5sb2FkZWQgLSBTaXplIG9mIGRvd25sb2FkZWQgY29udGVudC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb25GaWxlUHJvZ3Jlc3MudG90YWwgLSBUb3RhbCBzaXplIG9mIGNvbnRlbnQuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uQ29tcGxldGVdIC0gQ2FsbGJhY2sgd2hlbiBmaWxlIGxvYWRlZCBvciBmYWlsZWRcbiAgICAgKiBAcGFyYW0ge0Vycm9yfSBvbkNvbXBsZXRlLmVyciAtIFRoZSBvY2N1cnJlZCBlcnJvciwgbnVsbCBpbmRpY2V0ZXMgc3VjY2Vzc1xuICAgICAqIEBwYXJhbSB7Kn0gb25Db21wbGV0ZS5yZXNwb25zZSAtIFRoZSBsb2FkZWQgY29udGVudCwgbnVsbCBpZiBlcnJvciBvY2N1cnJlZCwgdHlwZSBvZiBjb250ZW50IGNhbiBiZSBpbmRpY2F0ZWQgYnkgb3B0aW9ucy5yZXNwb25zZVR5cGVcbiAgICAgKiBAcmV0dXJucyB7WE1MSHR0cFJlcXVlc3R9IFRoZSB4aHIgdG8gYmUgc2VuZFxuICAgICAqIFxuICAgICAqIEBleGFtcGxlXG4gICAgICogZG93bmxvYWRGaWxlKCdodHRwOi8vZXhhbXBsZS5jb20vdGVzdC5iaW4nLCB7cmVzcG9uc2VUeXBlOiAnYXJyYXlidWZmZXInfSwgbnVsbCwgKGVyciwgYXJyYXlCdWZmZXIpID0+IGNvbnNvbGUubG9nKGVycikpO1xuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZG93bmxvYWRGaWxlKHVybDogc3RyaW5nLCBvcHRpb25zPzogUmVjb3JkPHN0cmluZywgYW55Piwgb25GaWxlUHJvZ3Jlc3M/OiAobG9hZGVkOiBOdW1iZXIsIHRvdGFsOiBOdW1iZXIpID0+IHZvaWQsIG9uQ29tcGxldGU/OiAoZXJyOiBFcnJvciwgcmVzcG9uc2U6IGFueSkgPT4gdm9pZCk6IFhNTEh0dHBSZXF1ZXN0XG4gICAgICogZG93bmxvYWRGaWxlKHVybDogc3RyaW5nLCBvbkZpbGVQcm9ncmVzcz86IChsb2FkZWQ6IE51bWJlciwgdG90YWw6IE51bWJlcikgPT4gdm9pZCwgb25Db21wbGV0ZT86IChlcnI6IEVycm9yLCByZXNwb25zZTogYW55KSA9PiB2b2lkKTogWE1MSHR0cFJlcXVlc3RcbiAgICAgKiBkb3dubG9hZEZpbGUodXJsOiBzdHJpbmcsIG9wdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvbkNvbXBsZXRlPzogKGVycjogRXJyb3IsIHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpOiBYTUxIdHRwUmVxdWVzdFxuICAgICAqIGRvd25sb2FkRmlsZSh1cmw6IHN0cmluZywgb25Db21wbGV0ZT86IChlcnI6IEVycm9yLCByZXNwb25zZTogYW55KSA9PiB2b2lkKTogWE1MSHR0cFJlcXVlc3RcbiAgICAgKi9cbiAgICBkb3dubG9hZEZpbGU6IGRvd25sb2FkRmlsZSxcblxuICAgIC8qXG4gICAgICogISNlblxuICAgICAqIExvYWQgc2NyaXB0IFxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDliqDovb3ohJrmnKxcbiAgICAgKiBcbiAgICAgKiBAbWV0aG9kIGRvd25sb2FkU2NyaXB0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFVybCBvZiB0aGUgc2NyaXB0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIFNvbWUgb3B0aW9uYWwgcGFyYW10ZXJzXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5pc0FzeW5jXSAtIEluZGljYXRlIHdoZXRoZXIgb3Igbm90IGxvYWRpbmcgcHJvY2VzcyBzaG91bGQgYmUgYXN5bmNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25Db21wbGV0ZV0gLSBDYWxsYmFjayB3aGVuIHNjcmlwdCBsb2FkZWQgb3IgZmFpbGVkXG4gICAgICogQHBhcmFtIHtFcnJvcn0gb25Db21wbGV0ZS5lcnIgLSBUaGUgb2NjdXJyZWQgZXJyb3IsIG51bGwgaW5kaWNldGVzIHN1Y2Nlc3NcbiAgICAgKiBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGRvd25sb2FkU2NyaXB0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvaW5kZXguanMnLCBudWxsLCAoZXJyKSA9PiBjb25zb2xlLmxvZyhlcnIpKTtcbiAgICAgKiBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGRvd25sb2FkU2NyaXB0KHVybDogc3RyaW5nLCBvcHRpb25zPzogUmVjb3JkPHN0cmluZywgYW55Piwgb25Db21wbGV0ZT86IChlcnI6IEVycm9yKSA9PiB2b2lkKTogdm9pZFxuICAgICAqIGRvd25sb2FkU2NyaXB0KHVybDogc3RyaW5nLCBvbkNvbXBsZXRlPzogKGVycjogRXJyb3IpID0+IHZvaWQpOiB2b2lkXG4gICAgICovXG4gICAgZG93bmxvYWRTY3JpcHQ6IGRvd25sb2FkU2NyaXB0LFxuXG4gICAgaW5pdCAoYnVuZGxlVmVycywgcmVtb3RlU2VydmVyQWRkcmVzcykge1xuICAgICAgICBfZG93bmxvYWRpbmcuY2xlYXIoKTtcbiAgICAgICAgX3F1ZXVlLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuX3JlbW90ZVNlcnZlckFkZHJlc3MgPSByZW1vdGVTZXJ2ZXJBZGRyZXNzIHx8ICcnO1xuICAgICAgICB0aGlzLmJ1bmRsZVZlcnMgPSBidW5kbGVWZXJzIHx8IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZWdpc3RlciBjdXN0b20gaGFuZGxlciBpZiB5b3Ugd2FudCB0byBjaGFuZ2UgZGVmYXVsdCBiZWhhdmlvciBvciBleHRlbmQgZG93bmxvYWRlciB0byBkb3dubG9hZCBvdGhlciBmb3JtYXQgZmlsZVxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDlvZPkvaDmg7Pkv67mlLnpu5jorqTooYzkuLrmiJbogIXmi5PlsZUgZG93bmxvYWRlciDmnaXkuIvovb3lhbbku5bmoLzlvI/mlofku7bml7blj6/ku6Xms6jlhozoh6rlrprkuYnnmoQgaGFuZGxlciBcbiAgICAgKiBcbiAgICAgKiBAbWV0aG9kIHJlZ2lzdGVyXG4gICAgICogQHBhcmFtIHtzdHJpbmd8T2JqZWN0fSB0eXBlIC0gRXh0ZW5zaW9uIGxpa2VzICcuanBnJyBvciBtYXAgbGlrZXMgeycuanBnJzoganBnSGFuZGxlciwgJy5wbmcnOiBwbmdIYW5kbGVyfVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtoYW5kbGVyXSAtIGhhbmRsZXJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaGFuZGxlci51cmwgLSB1cmxcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaGFuZGxlci5vcHRpb25zIC0gc29tZSBvcHRpb25hbCBwYXJhbXRlcnMgd2lsbCBiZSB0cmFuc2ZlcnJlZCB0byBoYW5kbGVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXIub25Db21wbGV0ZSAtIGNhbGxiYWNrIHdoZW4gZmluaXNoaW5nIGRvd25sb2FkaW5nXG4gICAgICogXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBkb3dubG9hZGVyLnJlZ2lzdGVyKCcudGdhJywgKHVybCwgb3B0aW9ucywgb25Db21wbGV0ZSkgPT4gb25Db21wbGV0ZShudWxsLCBudWxsKSk7XG4gICAgICogZG93bmxvYWRlci5yZWdpc3Rlcih7Jy50Z2EnOiAodXJsLCBvcHRpb25zLCBvbkNvbXBsZXRlKSA9PiBvbkNvbXBsZXRlKG51bGwsIG51bGwpLCAnLmV4dCc6ICh1cmwsIG9wdGlvbnMsIG9uQ29tcGxldGUpID0+IG9uQ29tcGxldGUobnVsbCwgbnVsbCl9KTtcbiAgICAgKiBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHJlZ2lzdGVyKHR5cGU6IHN0cmluZywgaGFuZGxlcjogKHVybDogc3RyaW5nLCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvbkNvbXBsZXRlOiAoZXJyOiBFcnJvciwgY29udGVudDogYW55KSA9PiB2b2lkKSA9PiB2b2lkKTogdm9pZFxuICAgICAqIHJlZ2lzdGVyKG1hcDogUmVjb3JkPHN0cmluZywgKHVybDogc3RyaW5nLCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvbkNvbXBsZXRlOiAoZXJyOiBFcnJvciwgY29udGVudDogYW55KSA9PiB2b2lkKSA9PiB2b2lkPik6IHZvaWRcbiAgICAgKi9cbiAgICByZWdpc3RlciAodHlwZSwgaGFuZGxlcikge1xuICAgICAgICBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBqcy5taXhpbihkb3dubG9hZGVycywgdHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkb3dubG9hZGVyc1t0eXBlXSA9IGhhbmRsZXI7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFVzZSBjb3JyZXNwb25kaW5nIGhhbmRsZXIgdG8gZG93bmxvYWQgZmlsZSB1bmRlciBsaW1pdGF0aW9uIFxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDlnKjpmZDliLbkuIvkvb/nlKjlr7nlupTnmoQgaGFuZGxlciDmnaXkuIvovb3mlofku7ZcbiAgICAgKiBcbiAgICAgKiBAbWV0aG9kIGRvd25sb2FkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSB1cmwgc2hvdWxkIGJlIGRvd25sb2FkZWRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIGluZGljYXRlcyB0aGF0IHdoaWNoIGhhbmRsZXIgc2hvdWxkIGJlIHVzZWQgdG8gZG93bmxvYWQsIHN1Y2ggYXMgJy5qcGcnXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBzb21lIG9wdGlvbmFsIHBhcmFtdGVycyB3aWxsIGJlIHRyYW5zZmVycmVkIHRvIHRoZSBjb3JyZXNwb25kaW5nIGhhbmRsZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMub25GaWxlUHJvZ3Jlc3NdIC0gcHJvZ3Jlc3NpdmUgY2FsbGJhY2sgd2lsbCBiZSB0cmFuc2ZlcnJlZCB0byBoYW5kbGVyLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXhSZXRyeUNvdW50XSAtIEhvdyBtYW55IHRpbWVzIHNob3VsZCByZXRyeSB3aGVuIGRvd25sb2FkIGZhaWxlZFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXhDb25jdXJyZW5jeV0gLSBUaGUgbWF4aW11bSBudW1iZXIgb2YgY29uY3VycmVudCB3aGVuIGRvd25sb2FkaW5nXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1heFJlcXVlc3RzUGVyRnJhbWVdIC0gVGhlIG1heGltdW0gbnVtYmVyIG9mIHJlcXVlc3QgY2FuIGJlIGxhdW5jaGVkIHBlciBmcmFtZSB3aGVuIGRvd25sb2FkaW5nXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnByaW9yaXR5XSAtIFRoZSBwcmlvcml0eSBvZiB0aGlzIHVybCwgZGVmYXVsdCBpcyAwLCB0aGUgZ3JlYXRlciBudW1iZXIgaXMgaGlnaGVyIHByaW9yaXR5LlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9uQ29tcGxldGUgLSBjYWxsYmFjayB3aGVuIGZpbmlzaGluZyBkb3dubG9hZGluZ1xuICAgICAqIEBwYXJhbSB7RXJyb3J9IG9uQ29tcGxldGUuZXJyIC0gVGhlIG9jY3VycmVkIGVycm9yLCBudWxsIGluZGljZXRlcyBzdWNjZXNzXG4gICAgICogQHBhcmFtIHsqfSBvbkNvbXBsZXRlLmNvbnRldG50IC0gVGhlIGRvd25sb2FkZWQgZmlsZVxuICAgICAqIFxuICAgICAqIEBleGFtcGxlXG4gICAgICogZG93bmxvYWQoJ2h0dHA6Ly9leGFtcGxlLmNvbS90ZXN0LnRnYScsICcudGdhJywge29uRmlsZVByb2dyZXNzOiAobG9hZGVkLCB0b3RhbCkgPT4gY29uc29sZS5sZ28obG9hZGVkL3RvdGFsKX0sIG9uQ29tcGxldGU6IChlcnIpID0+IGNvbnNvbGUubG9nKGVycikpO1xuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZG93bmxvYWQoaWQ6IHN0cmluZywgdXJsOiBzdHJpbmcsIHR5cGU6IHN0cmluZywgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55Piwgb25Db21wbGV0ZTogKGVycjogRXJyb3IsIGNvbnRlbnQ6IGFueSkgPT4gdm9pZCk6IHZvaWRcbiAgICAgKi9cbiAgICBkb3dubG9hZCAoaWQsIHVybCwgdHlwZSwgb3B0aW9ucywgb25Db21wbGV0ZSkge1xuICAgICAgICBsZXQgZnVuYyA9IGRvd25sb2FkZXJzW3R5cGVdIHx8IGRvd25sb2FkZXJzWydkZWZhdWx0J107XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgLy8gaWYgaXQgaXMgZG93bmxvYWRlZCwgZG9uJ3QgZG93bmxvYWQgYWdhaW5cbiAgICAgICAgbGV0IGZpbGUsIGRvd25sb2FkQ2FsbGJhY2tzO1xuICAgICAgICBpZiAoZmlsZSA9IGZpbGVzLmdldChpZCkpIHtcbiAgICAgICAgICAgIG9uQ29tcGxldGUobnVsbCwgZmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZG93bmxvYWRDYWxsYmFja3MgPSBfZG93bmxvYWRpbmcuZ2V0KGlkKSkge1xuICAgICAgICAgICAgZG93bmxvYWRDYWxsYmFja3MucHVzaChvbkNvbXBsZXRlKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gX3F1ZXVlLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gX3F1ZXVlW2ldO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLmlkID09PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcHJpb3JpdHkgPSBvcHRpb25zLnByaW9yaXR5IHx8IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnByaW9yaXR5IDwgcHJpb3JpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ucHJpb3JpdHkgPSBwcmlvcml0eTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9xdWV1ZURpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBpZiBkb3dubG9hZCBmYWlsLCBzaG91bGQgcmV0cnlcbiAgICAgICAgICAgIHZhciBtYXhSZXRyeUNvdW50ID0gdHlwZW9mIG9wdGlvbnMubWF4UmV0cnlDb3VudCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLm1heFJldHJ5Q291bnQgOiB0aGlzLm1heFJldHJ5Q291bnQ7XG4gICAgICAgICAgICB2YXIgbWF4Q29uY3VycmVuY3kgPSB0eXBlb2Ygb3B0aW9ucy5tYXhDb25jdXJyZW5jeSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLm1heENvbmN1cnJlbmN5IDogdGhpcy5tYXhDb25jdXJyZW5jeTtcbiAgICAgICAgICAgIHZhciBtYXhSZXF1ZXN0c1BlckZyYW1lID0gdHlwZW9mIG9wdGlvbnMubWF4UmVxdWVzdHNQZXJGcmFtZSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLm1heFJlcXVlc3RzUGVyRnJhbWUgOiB0aGlzLm1heFJlcXVlc3RzUGVyRnJhbWU7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHByb2Nlc3MgKGluZGV4LCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBfZG93bmxvYWRpbmcuYWRkKGlkLCBbb25Db21wbGV0ZV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYubGltaXRlZCkgcmV0dXJuIGZ1bmModXJsQXBwZW5kVGltZXN0YW1wKHVybCksIG9wdGlvbnMsIGNhbGxiYWNrKTtcblxuICAgICAgICAgICAgICAgIC8vIHJlZnJlc2hcbiAgICAgICAgICAgICAgICB1cGRhdGVUaW1lKCk7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBpbnZva2UgKCkge1xuICAgICAgICAgICAgICAgICAgICBmdW5jKHVybEFwcGVuZFRpbWVzdGFtcCh1cmwpLCBvcHRpb25zLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGVuIGZpbmlzaCBkb3dubG9hZGluZywgdXBkYXRlIF90b3RhbE51bVxuICAgICAgICAgICAgICAgICAgICAgICAgX3RvdGFsTnVtLS07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIV9jaGVja05leHRQZXJpb2QgJiYgX3F1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsSW5OZXh0VGljayhoYW5kbGVRdWV1ZSwgbWF4Q29uY3VycmVuY3ksIG1heFJlcXVlc3RzUGVyRnJhbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jaGVja05leHRQZXJpb2QgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKF90b3RhbE51bSA8IG1heENvbmN1cnJlbmN5ICYmIF90b3RhbE51bVRoaXNQZXJpb2QgPCBtYXhSZXF1ZXN0c1BlckZyYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGludm9rZSgpO1xuICAgICAgICAgICAgICAgICAgICBfdG90YWxOdW0rKztcbiAgICAgICAgICAgICAgICAgICAgX3RvdGFsTnVtVGhpc1BlcmlvZCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hlbiBudW1iZXIgb2YgcmVxdWVzdCB1cCB0byBsaW1pdGF0aW9uLCBjYWNoZSB0aGUgcmVzdFxuICAgICAgICAgICAgICAgICAgICBfcXVldWUucHVzaCh7IGlkLCBwcmlvcml0eTogb3B0aW9ucy5wcmlvcml0eSB8fCAwLCBpbnZva2UgfSk7XG4gICAgICAgICAgICAgICAgICAgIF9xdWV1ZURpcnR5ID0gdHJ1ZTtcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFfY2hlY2tOZXh0UGVyaW9kICYmIF90b3RhbE51bSA8IG1heENvbmN1cnJlbmN5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsSW5OZXh0VGljayhoYW5kbGVRdWV1ZSwgbWF4Q29uY3VycmVuY3ksIG1heFJlcXVlc3RzUGVyRnJhbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2NoZWNrTmV4dFBlcmlvZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHdoZW4gcmV0cnkgZmluaXNoZWQsIGludm9rZSBjYWxsYmFja3NcbiAgICAgICAgICAgIGZ1bmN0aW9uIGZpbmFsZSAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVycikgZmlsZXMuYWRkKGlkLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgIHZhciBjYWxsYmFja3MgPSBfZG93bmxvYWRpbmcucmVtb3ZlKGlkKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzW2ldKGVyciwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICByZXRyeShwcm9jZXNzLCBtYXhSZXRyeUNvdW50LCB0aGlzLnJldHJ5SW50ZXJ2YWwsIGZpbmFsZSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vLyBkYWZhdWx0IGhhbmRsZXIgbWFwXG52YXIgZG93bmxvYWRlcnMgPSB7XG4gICAgLy8gSW1hZ2VzXG4gICAgJy5wbmcnIDogZG93bmxvYWRJbWFnZSxcbiAgICAnLmpwZycgOiBkb3dubG9hZEltYWdlLFxuICAgICcuYm1wJyA6IGRvd25sb2FkSW1hZ2UsXG4gICAgJy5qcGVnJyA6IGRvd25sb2FkSW1hZ2UsXG4gICAgJy5naWYnIDogZG93bmxvYWRJbWFnZSxcbiAgICAnLmljbycgOiBkb3dubG9hZEltYWdlLFxuICAgICcudGlmZicgOiBkb3dubG9hZEltYWdlLFxuICAgICcud2VicCcgOiBkb3dubG9hZEltYWdlLFxuICAgICcuaW1hZ2UnIDogZG93bmxvYWRJbWFnZSxcbiAgICAnLnB2cic6IGRvd25sb2FkQXJyYXlCdWZmZXIsXG4gICAgJy5wa20nOiBkb3dubG9hZEFycmF5QnVmZmVyLFxuXG4gICAgLy8gQXVkaW9cbiAgICAnLm1wMycgOiBkb3dubG9hZEF1ZGlvLFxuICAgICcub2dnJyA6IGRvd25sb2FkQXVkaW8sXG4gICAgJy53YXYnIDogZG93bmxvYWRBdWRpbyxcbiAgICAnLm00YScgOiBkb3dubG9hZEF1ZGlvLFxuXG4gICAgLy8gVHh0XG4gICAgJy50eHQnIDogZG93bmxvYWRUZXh0LFxuICAgICcueG1sJyA6IGRvd25sb2FkVGV4dCxcbiAgICAnLnZzaCcgOiBkb3dubG9hZFRleHQsXG4gICAgJy5mc2gnIDogZG93bmxvYWRUZXh0LFxuICAgICcuYXRsYXMnIDogZG93bmxvYWRUZXh0LFxuXG4gICAgJy50bXgnIDogZG93bmxvYWRUZXh0LFxuICAgICcudHN4JyA6IGRvd25sb2FkVGV4dCxcblxuICAgICcuanNvbicgOiBkb3dubG9hZEpzb24sXG4gICAgJy5FeHBvcnRKc29uJyA6IGRvd25sb2FkSnNvbixcbiAgICAnLnBsaXN0JyA6IGRvd25sb2FkVGV4dCxcblxuICAgICcuZm50JyA6IGRvd25sb2FkVGV4dCxcblxuICAgIC8vIGZvbnRcbiAgICAnLmZvbnQnIDogbG9hZEZvbnQsXG4gICAgJy5lb3QnIDogbG9hZEZvbnQsXG4gICAgJy50dGYnIDogbG9hZEZvbnQsXG4gICAgJy53b2ZmJyA6IGxvYWRGb250LFxuICAgICcuc3ZnJyA6IGxvYWRGb250LFxuICAgICcudHRjJyA6IGxvYWRGb250LFxuXG4gICAgLy8gVmlkZW9cbiAgICAnLm1wNCc6IGRvd25sb2FkVmlkZW8sXG4gICAgJy5hdmknOiBkb3dubG9hZFZpZGVvLFxuICAgICcubW92JzogZG93bmxvYWRWaWRlbyxcbiAgICAnLm1wZyc6IGRvd25sb2FkVmlkZW8sXG4gICAgJy5tcGVnJzogZG93bmxvYWRWaWRlbyxcbiAgICAnLnJtJzogZG93bmxvYWRWaWRlbyxcbiAgICAnLnJtdmInOiBkb3dubG9hZFZpZGVvLFxuXG4gICAgLy8gQmluYXJ5XG4gICAgJy5iaW5hcnknIDogZG93bmxvYWRBcnJheUJ1ZmZlcixcbiAgICAnLmJpbic6IGRvd25sb2FkQXJyYXlCdWZmZXIsXG4gICAgJy5kYmJpbic6IGRvd25sb2FkQXJyYXlCdWZmZXIsXG4gICAgJy5za2VsJzogZG93bmxvYWRBcnJheUJ1ZmZlcixcblxuICAgICcuanMnOiBkb3dubG9hZFNjcmlwdCxcblxuICAgICdidW5kbGUnOiBkb3dubG9hZEJ1bmRsZSxcblxuICAgICdkZWZhdWx0JzogZG93bmxvYWRUZXh0XG5cbn07XG5cbmRvd25sb2FkZXIuX2Rvd25sb2FkZXJzID0gZG93bmxvYWRlcnM7XG5tb2R1bGUuZXhwb3J0cyA9IGRvd25sb2FkZXI7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==