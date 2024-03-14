
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/asset-manager/deprecated.js';
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
var js = require('../platform/js');

require('../CCDirector');

var utilities = require('./utilities');

var dependUtil = require('./depend-util');

var releaseManager = require('./releaseManager');

var downloader = require('./downloader');

var factory = require('./factory');

var helper = require('./helper');

var ImageFmts = ['.png', '.jpg', '.bmp', '.jpeg', '.gif', '.ico', '.tiff', '.webp', '.image', '.pvr', '.pkm'];
var AudioFmts = ['.mp3', '.ogg', '.wav', '.m4a'];

function GetTrue() {
  return true;
}

var md5Pipe = {
  transformURL: function transformURL(url) {
    var uuid = helper.getUuidFromURL(url);

    if (!uuid) {
      return url;
    }

    var bundle = cc.assetManager.bundles.find(function (b) {
      return !!b.getAssetInfo(uuid);
    });

    if (!bundle) {
      return url;
    }

    var hashValue = '';
    var info = bundle.getAssetInfo(uuid);

    if (url.startsWith(bundle.base + bundle._config.nativeBase)) {
      hashValue = info.nativeVer || '';
    } else {
      hashValue = info.ver || '';
    }

    if (!hashValue || url.indexOf(hashValue) !== -1) {
      return url;
    }

    var hashPatchInFolder = false;

    if (cc.path.extname(url) === '.ttf') {
      hashPatchInFolder = true;
    }

    if (hashPatchInFolder) {
      var dirname = cc.path.dirname(url);
      var basename = cc.path.basename(url);
      url = dirname + "." + hashValue + "/" + basename;
    } else {
      url = url.replace(/.*[/\\][0-9a-fA-F]{2}[/\\]([0-9a-fA-F-]{8,})/, function (match, uuid) {
        return match + '.' + hashValue;
      });
    }

    return url;
  }
};
/**
 * `cc.loader` is deprecated, please backup your project and upgrade to {{#crossLink "AssetManager"}}{{/crossLink}}
 *
 * @class loader
 * @static
 * @deprecated cc.loader is deprecated, please backup your project and upgrade to cc.assetManager
 */

var loader = {
  /**
   * `cc.loader.onProgress` is deprecated, please transfer onProgress to API as a parameter
   * @property onProgress
   * @deprecated cc.loader.onProgress is deprecated, please transfer onProgress to API as a parameter
   */
  onProgress: null,
  _autoReleaseSetting: Object.create(null),

  get _cache() {
    return cc.assetManager.assets._map;
  },

  /**
   * `cc.loader.load` is deprecated, please use {{#crossLink "AssetManager/loadAny:method"}}{{/crossLink}} instead
   *
   * @deprecated cc.loader.load is deprecated, please use cc.assetManager.loadAny instead
   *
   * @method load
   * @param {String|String[]|Object} resources - Url list in an array
   * @param {Function} [progressCallback] - Callback invoked when progression change
   * @param {Number} progressCallback.completedCount - The number of the items that are already completed
   * @param {Number} progressCallback.totalCount - The total number of the items
   * @param {Object} progressCallback.item - The latest item which flow out the pipeline
   * @param {Function} [completeCallback] - Callback invoked when all resources loaded
   * @typescript
   * load(resources: string|string[]|{uuid?: string, url?: string, type?: string}, completeCallback?: Function): void
   * load(resources: string|string[]|{uuid?: string, url?: string, type?: string}, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: Function|null): void
   */
  load: function load(resources, progressCallback, completeCallback) {
    if (completeCallback === undefined) {
      if (progressCallback !== undefined) {
        completeCallback = progressCallback;
        progressCallback = null;
      }
    }

    resources = Array.isArray(resources) ? resources : [resources];

    for (var i = 0; i < resources.length; i++) {
      var item = resources[i];

      if (typeof item === 'string') {
        resources[i] = {
          url: item,
          __isNative__: true
        };
      } else {
        if (item.type) {
          item.ext = '.' + item.type;
          item.type = undefined;
        }

        if (item.url) {
          item.__isNative__ = true;
        }
      }
    }

    var images = [];
    var audios = [];
    cc.assetManager.loadAny(resources, null, function (finish, total, item) {
      if (item.content) {
        if (ImageFmts.includes(item.ext)) {
          images.push(item.content);
        } else if (AudioFmts.includes(item.ext)) {
          audios.push(item.content);
        }
      }

      progressCallback && progressCallback(finish, total, item);
    }, function (err, _native) {
      var res = null;

      if (!err) {
        _native = Array.isArray(_native) ? _native : [_native];

        for (var i = 0; i < _native.length; i++) {
          var item = _native[i];

          if (!(item instanceof cc.Asset)) {
            var asset = item;
            var url = resources[i].url;

            if (images.includes(asset)) {
              factory.create(url, item, '.png', null, function (err, image) {
                asset = _native[i] = image;
              });
            } else if (audios.includes(asset)) {
              factory.create(url, item, '.mp3', null, function (err, audio) {
                asset = _native[i] = audio;
              });
            }

            cc.assetManager.assets.add(url, asset);
          }
        }

        if (_native.length > 1) {
          var map = Object.create(null);

          _native.forEach(function (asset) {
            map[asset._uuid] = asset;
          });

          res = {
            isCompleted: GetTrue,
            _map: map
          };
        } else {
          res = _native[0];
        }
      }

      completeCallback && completeCallback(err, res);
    });
  },

  /**
   * `cc.loader.getXMLHttpRequest` is deprecated, please use `XMLHttpRequest` directly
   *
   * @method getXMLHttpRequest
   * @deprecated cc.loader.getXMLHttpRequest is deprecated, please use XMLHttpRequest directly
   * @returns {XMLHttpRequest}
   */
  getXMLHttpRequest: function getXMLHttpRequest() {
    return new XMLHttpRequest();
  },
  _parseLoadResArgs: utilities.parseLoadResArgs,

  /**
   * `cc.loader.getItem` is deprecated, please use `cc.assetManager.asset.get` instead
   *
   * @method getItem
   * @param {Object} id The id of the item
   * @return {Object}
   * @deprecated cc.loader.getItem is deprecated, please use cc.assetManager.assets.get instead
   */
  getItem: function getItem(key) {
    return cc.assetManager.assets.has(key) ? {
      content: cc.assetManager.assets.get(key)
    } : null;
  },

  /**
   * `cc.loader.loadRes` is deprecated, please use {{#crossLink "Bundle/load:method"}}{{/crossLink}}  instead
   *
   * @deprecated cc.loader.loadRes is deprecated, please use cc.resources.load  instead
   * @method loadRes
   * @param {String} url - Url of the target resource.
   *                       The url is relative to the "resources" folder, extensions must be omitted.
   * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
   * @param {Function} [progressCallback] - Callback invoked when progression change.
   * @param {Number} progressCallback.completedCount - The number of the items that are already completed.
   * @param {Number} progressCallback.totalCount - The total number of the items.
   * @param {Object} progressCallback.item - The latest item which flow out the pipeline.
   * @param {Function} [completeCallback] - Callback invoked when the resource loaded.
   * @param {Error} completeCallback.error - The error info or null if loaded successfully.
   * @param {Object} completeCallback.resource - The loaded resource if it can be found otherwise returns null.
   *
   * @typescript
   * loadRes(url: string, type: typeof cc.Asset, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any) => void)|null): void
   * loadRes(url: string, type: typeof cc.Asset, completeCallback: (error: Error, resource: any) => void): void
   * loadRes(url: string, type: typeof cc.Asset): void
   * loadRes(url: string, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any) => void)|null): void
   * loadRes(url: string, completeCallback: (error: Error, resource: any) => void): void
   * loadRes(url: string): void
   */
  loadRes: function loadRes(url, type, progressCallback, completeCallback) {
    var _this$_parseLoadResAr = this._parseLoadResArgs(type, progressCallback, completeCallback),
        type = _this$_parseLoadResAr.type,
        onProgress = _this$_parseLoadResAr.onProgress,
        onComplete = _this$_parseLoadResAr.onComplete;

    var extname = cc.path.extname(url);

    if (extname) {
      // strip extname
      url = url.slice(0, -extname.length);
    }

    cc.resources.load(url, type, onProgress, onComplete);
  },

  /**
   * `cc.loader.loadResArray` is deprecated, please use {{#crossLink "Bundle/load:method"}}{{/crossLink}} instead
   *
   * @deprecated cc.loader.loadResArray is deprecated, please use cc.resources.load instead
   * @method loadResArray
   * @param {String[]} urls - Array of URLs of the target resource.
   *                          The url is relative to the "resources" folder, extensions must be omitted.
   * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
   * @param {Function} [progressCallback] - Callback invoked when progression change.
   * @param {Number} progressCallback.completedCount - The number of the items that are already completed.
   * @param {Number} progressCallback.totalCount - The total number of the items.
   * @param {Object} progressCallback.item - The latest item which flow out the pipeline.
   * @param {Function} [completeCallback] - A callback which is called when all assets have been loaded, or an error occurs.
   * @param {Error} completeCallback.error - If one of the asset failed, the complete callback is immediately called
   *                                         with the error. If all assets are loaded successfully, error will be null.
   * @param {Asset[]|Array} completeCallback.assets - An array of all loaded assets.
   *                                                     If nothing to load, assets will be an empty array.
   * @typescript
   * loadResArray(url: string[], type: typeof cc.Asset, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[]) => void)|null): void
   * loadResArray(url: string[], type: typeof cc.Asset, completeCallback: (error: Error, resource: any[]) => void): void
   * loadResArray(url: string[], type: typeof cc.Asset): void
   * loadResArray(url: string[], progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[]) => void)|null): void
   * loadResArray(url: string[], completeCallback: (error: Error, resource: any[]) => void): void
   * loadResArray(url: string[]): void
   * loadResArray(url: string[], type: typeof cc.Asset[]): void
   */
  loadResArray: function loadResArray(urls, type, progressCallback, completeCallback) {
    var _this$_parseLoadResAr2 = this._parseLoadResArgs(type, progressCallback, completeCallback),
        type = _this$_parseLoadResAr2.type,
        onProgress = _this$_parseLoadResAr2.onProgress,
        onComplete = _this$_parseLoadResAr2.onComplete;

    urls.forEach(function (url, i) {
      var extname = cc.path.extname(url);

      if (extname) {
        // strip extname
        urls[i] = url.slice(0, -extname.length);
      }
    });
    cc.resources.load(urls, type, onProgress, onComplete);
  },

  /**
   * `cc.loader.loadResDir` is deprecated, please use {{#crossLink "Bundle/loadDir:method"}}{{/crossLink}} instead
   *
   * @deprecated cc.loader.loadResDir is deprecated, please use cc.resources.loadDir instead
   * @method loadResDir
   * @param {String} url - Url of the target folder.
   *                       The url is relative to the "resources" folder, extensions must be omitted.
   * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
   * @param {Function} [progressCallback] - Callback invoked when progression change.
   * @param {Number} progressCallback.completedCount - The number of the items that are already completed.
   * @param {Number} progressCallback.totalCount - The total number of the items.
   * @param {Object} progressCallback.item - The latest item which flow out the pipeline.
   * @param {Function} [completeCallback] - A callback which is called when all assets have been loaded, or an error occurs.
   * @param {Error} completeCallback.error - If one of the asset failed, the complete callback is immediately called
   *                                         with the error. If all assets are loaded successfully, error will be null.
   * @param {Asset[]|Array} completeCallback.assets - An array of all loaded assets.
   *                                             If nothing to load, assets will be an empty array.
   * @param {String[]} completeCallback.urls - An array that lists all the URLs of loaded assets.
   *
   * @typescript
   * loadResDir(url: string, type: typeof cc.Asset, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[], urls: string[]) => void)|null): void
   * loadResDir(url: string, type: typeof cc.Asset, completeCallback: (error: Error, resource: any[], urls: string[]) => void): void
   * loadResDir(url: string, type: typeof cc.Asset): void
   * loadResDir(url: string, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[], urls: string[]) => void)|null): void
   * loadResDir(url: string, completeCallback: (error: Error, resource: any[], urls: string[]) => void): void
   * loadResDir(url: string): void
   */
  loadResDir: function loadResDir(url, type, progressCallback, completeCallback) {
    var _this$_parseLoadResAr3 = this._parseLoadResArgs(type, progressCallback, completeCallback),
        type = _this$_parseLoadResAr3.type,
        onProgress = _this$_parseLoadResAr3.onProgress,
        onComplete = _this$_parseLoadResAr3.onComplete;

    cc.resources.loadDir(url, type, onProgress, function (err, assets) {
      var urls = [];

      if (!err) {
        var infos = cc.resources.getDirWithPath(url, type);
        urls = infos.map(function (info) {
          return info.path;
        });
      }

      onComplete && onComplete(err, assets, urls);
    });
  },

  /**
   * `cc.loader.getRes` is deprecated, please use {{#crossLink "Bundle/get:method"}}{{/crossLink}} instead
   *
   * @method getRes
   * @param {String} url
   * @param {Function} [type] - Only asset of type will be returned if this argument is supplied.
   * @returns {*}
   * @deprecated cc.loader.getRes is deprecated, please use cc.resources.get instead
   */
  getRes: function getRes(url, type) {
    return cc.assetManager.assets.has(url) ? cc.assetManager.assets.get(url) : cc.resources.get(url, type);
  },
  getResCount: function getResCount() {
    return cc.assetManager.assets.count;
  },

  /**
   * `cc.loader.getDependsRecursively` is deprecated, please use use {{#crossLink "DependUtil/getDepsRecursively:method"}}{{/crossLink}} instead
   *
   * @deprecated cc.loader.getDependsRecursively is deprecated, please use use cc.assetManager.dependUtil.getDepsRecursively instead
   * @method getDependsRecursively
   * @param {Asset|String} owner - The owner asset or the resource url or the asset's uuid
   * @returns {Array}
   */
  getDependsRecursively: function getDependsRecursively(owner) {
    if (!owner) return [];
    return dependUtil.getDepsRecursively(typeof owner === 'string' ? owner : owner._uuid).concat([owner._uuid]);
  },

  /**
   * `cc.loader.assetLoader` was removed, assetLoader and md5Pipe were merged into {{#crossLink "AssetManager/transformPipeline:property"}}{{/crossLink}}
   *
   * @property assetLoader
   * @deprecated cc.loader.assetLoader was removed, assetLoader and md5Pipe were merged into cc.assetManager.transformPipeline
   * @type {Object}
   */
  get assetLoader() {
    if (CC_DEBUG) {
      cc.error('cc.loader.assetLoader was removed, assetLoader and md5Pipe were merged into cc.assetManager.transformPipeline');
    }
  },

  /**
   * `cc.loader.md5Pipe` is deprecated, assetLoader and md5Pipe were merged into {{#crossLink "AssetManager/transformPipeline:property"}}{{/crossLink}}
   *
   * @property md5Pipe
   * @deprecated cc.loader.md5Pipe is deprecated, assetLoader and md5Pipe were merged into cc.assetManager.transformPipeline
   * @type {Object}
   */
  get md5Pipe() {
    return md5Pipe;
  },

  /**
   * `cc.loader.downloader` is deprecated, please use {{#crossLink "AssetManager/downloader:property"}}{{/crossLink}} instead
   *
   * @deprecated cc.loader.downloader is deprecated, please use cc.assetManager.downloader instead
   * @property downloader
   * @type {Object}
   */
  get downloader() {
    return cc.assetManager.downloader;
  },

  /**
   * `cc.loader.loader` is deprecated, please use {{#crossLink "AssetManager/parser:property"}}{{/crossLink}} instead
   *
   * @property loader
   * @type {Object}
   * @deprecated cc.loader.loader is deprecated, please use cc.assetManager.parser instead
   */
  get loader() {
    return cc.assetManager.parser;
  },

  /**
   * `cc.loader.addDownloadHandlers` is deprecated, please use `cc.assetManager.downloader.register` instead
   *
   * @method addDownloadHandlers
   * @param {Object} extMap Custom supported types with corresponded handler
   * @deprecated cc.loader.addDownloadHandlers is deprecated, please use cc.assetManager.downloader.register instead
  */
  addDownloadHandlers: function addDownloadHandlers(extMap) {
    if (CC_DEBUG) {
      cc.warn('`cc.loader.addDownloadHandlers` is deprecated, please use `cc.assetManager.downloader.register` instead');
    }

    var handler = Object.create(null);

    for (var type in extMap) {
      var func = extMap[type];

      handler['.' + type] = function (url, options, onComplete) {
        func({
          url: url
        }, onComplete);
      };
    }

    cc.assetManager.downloader.register(handler);
  },

  /**
   * `cc.loader.addLoadHandlers` is deprecated, please use `cc.assetManager.parser.register` instead
   *
   * @method addLoadHandlers
   * @param {Object} extMap Custom supported types with corresponded handler
   * @deprecated cc.loader.addLoadHandlers is deprecated, please use cc.assetManager.parser.register instead
   */
  addLoadHandlers: function addLoadHandlers(extMap) {
    if (CC_DEBUG) {
      cc.warn('`cc.loader.addLoadHandlers` is deprecated, please use `cc.assetManager.parser.register` instead');
    }

    var handler = Object.create(null);

    for (var type in extMap) {
      var func = extMap[type];

      handler['.' + type] = function (file, options, onComplete) {
        func({
          content: file
        }, onComplete);
      };
    }

    cc.assetManager.parser.register(handler);
  },
  flowInDeps: function flowInDeps() {
    if (CC_DEBUG) {
      cc.error('cc.loader.flowInDeps was removed');
    }
  },

  /**
   * `cc.loader.release` is deprecated, please use {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}} instead
   *
   * @method release
   * @param {Asset|String|Array} asset
   * @deprecated cc.loader.release is deprecated, please use cc.assetManager.releaseAsset instead
   */
  release: function release(asset) {
    if (Array.isArray(asset)) {
      for (var i = 0; i < asset.length; i++) {
        var key = asset[i];
        if (typeof key === 'string') key = cc.assetManager.assets.get(key);

        var isBuiltin = cc.assetManager.builtins._assets.find(function (assets) {
          return assets.find(function (builtinAsset) {
            return builtinAsset === key;
          });
        });

        if (isBuiltin) continue;
        cc.assetManager.releaseAsset(key);
      }
    } else if (asset) {
      if (typeof asset === 'string') asset = cc.assetManager.assets.get(asset);

      var _isBuiltin = cc.assetManager.builtins._assets.find(function (assets) {
        return assets.find(function (builtinAsset) {
          return builtinAsset === asset;
        });
      });

      if (_isBuiltin) return;
      cc.assetManager.releaseAsset(asset);
    }
  },

  /**
   * `cc.loader.releaseAsset` is deprecated, please use {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}} instead
   *
   * @deprecated cc.loader.releaseAsset is deprecated, please use cc.assetManager.releaseAsset instead
   * @method releaseAsset
   * @param {Asset} asset
   */
  releaseAsset: function releaseAsset(asset) {
    cc.assetManager.releaseAsset(asset);
  },

  /**
   * `cc.loader.releaseRes` is deprecated, please use {{#crossLink "AssetManager/releaseRes:method"}}{{/crossLink}} instead
   *
   * @deprecated cc.loader.releaseRes is deprecated, please use cc.assetManager.releaseRes instead
   * @method releaseRes
   * @param {String} url
   * @param {Function} [type] - Only asset of type will be released if this argument is supplied.
   */
  releaseRes: function releaseRes(url, type) {
    cc.resources.release(url, type);
  },

  /**
   * `cc.loader.releaseResDir` was removed, please use {{#crossLink "AssetManager/releaseRes:method"}}{{/crossLink}} instead
   *
   * @deprecated cc.loader.releaseResDir was removed, please use cc.assetManager.releaseRes instead
   * @method releaseResDir
   */
  releaseResDir: function releaseResDir() {
    if (CC_DEBUG) {
      cc.error('cc.loader.releaseResDir was removed, please use cc.assetManager.releaseAsset instead');
    }
  },

  /**
   * `cc.loader.releaseAll` is deprecated, please use {{#crossLink "AssetManager/releaseAll:method"}}{{/crossLink}} instead
   *
   * @deprecated cc.loader.releaseAll is deprecated, please use cc.assetManager.releaseAll instead
   * @method releaseAll
   */
  releaseAll: function releaseAll() {
    cc.assetManager.releaseAll();
    cc.assetManager.assets.clear();
  },

  /**
   * `cc.loader.removeItem` is deprecated, please use `cc.assetManager.assets.remove` instead
   *
   * @deprecated cc.loader.removeItem is deprecated, please use cc.assetManager.assets.remove instead
   * @method removeItem
   * @param {Object} id The id of the item
   * @return {Boolean} succeed or not
   */
  removeItem: function removeItem(key) {
    cc.assetManager.assets.remove(key);
  },

  /**
   * `cc.loader.setAutoRelease` is deprecated, if you want to prevent some asset from auto releasing, please use {{#crossLink "Asset/addRef:method"}}{{/crossLink}} instead
   *
   * @deprecated cc.loader.setAutoRelease is deprecated, if you want to prevent some asset from auto releasing, please use cc.Asset.addRef instead
   * @method setAutoRelease
   * @param {Asset|String} assetOrUrlOrUuid - asset object or the raw asset's url or uuid
   * @param {Boolean} autoRelease - indicates whether should release automatically
   */
  setAutoRelease: function setAutoRelease(asset, autoRelease) {
    if (typeof asset === 'object') asset = asset._uuid;
    this._autoReleaseSetting[asset] = !!autoRelease;
  },

  /**
   * `cc.loader.setAutoReleaseRecursively` is deprecated, if you want to prevent some asset from auto releasing, please use {{#crossLink "Asset/addRef:method"}}{{/crossLink}} instead
   *
   * @method setAutoReleaseRecursively
   * @param {Asset|String} assetOrUrlOrUuid - asset object or the raw asset's url or uuid
   * @param {Boolean} autoRelease - indicates whether should release automatically
   * @deprecated cc.loader.setAutoReleaseRecursively is deprecated, if you want to prevent some asset from auto releasing, please use cc.Asset.addRef instead
   */
  setAutoReleaseRecursively: function setAutoReleaseRecursively(asset, autoRelease) {
    if (typeof asset === 'object') asset = asset._uuid;
    autoRelease = !!autoRelease;
    this._autoReleaseSetting[asset] = autoRelease;
    var depends = dependUtil.getDepsRecursively(asset);

    for (var i = 0; i < depends.length; i++) {
      var depend = depends[i];
      this._autoReleaseSetting[depend] = autoRelease;
    }
  },

  /**
   * `cc.loader.isAutoRelease` is deprecated
   *
   * @method isAutoRelease
   * @param {Asset|String} assetOrUrl - asset object or the raw asset's url
   * @returns {Boolean}
   * @deprecated cc.loader.isAutoRelease is deprecated
   */
  isAutoRelease: function isAutoRelease(asset) {
    if (typeof asset === 'object') asset = asset._uuid;
    return !!this._autoReleaseSetting[asset];
  }
};
/**
 * @class Downloader
 */

/**
 * `cc.loader.downloader.loadSubpackage` is deprecated, please use {{#crossLink "AssetManager/loadBundle:method"}}{{/crossLink}} instead
 *
 * @deprecated cc.loader.downloader.loadSubpackage is deprecated, please use AssetManager.loadBundle instead
 * @method loadSubpackage
 * @param {String} name - Subpackage name
 * @param {Function} [completeCallback] -  Callback invoked when subpackage loaded
 * @param {Error} completeCallback.error - error information
 */

downloader.loadSubpackage = function (name, completeCallback) {
  cc.assetManager.loadBundle(name, null, completeCallback);
};
/**
 * @deprecated cc.AssetLibrary is deprecated, please backup your project and upgrade to cc.assetManager
 */


var AssetLibrary = {
  /**
   * @deprecated cc.AssetLibrary.init is deprecated, please use cc.assetManager.init instead
   */
  init: function init(options) {
    options.importBase = options.libraryPath;
    options.nativeBase = CC_BUILD ? options.rawAssetsBase : options.libraryPath;
    cc.assetManager.init(options);

    if (options.rawAssets) {
      var resources = new cc.AssetManager.Bundle();
      resources.init({
        name: cc.AssetManager.BuiltinBundleName.RESOURCES,
        importBase: options.importBase,
        nativeBase: options.nativeBase,
        paths: options.rawAssets.assets,
        uuids: Object.keys(options.rawAssets.assets)
      });
    }
  },

  /**
   * @deprecated cc.AssetLibrary is deprecated, please use cc.assetManager.loadAny instead
   */
  loadAsset: function loadAsset(uuid, onComplete) {
    cc.assetManager.loadAny(uuid, onComplete);
  },
  getLibUrlNoExt: function getLibUrlNoExt() {
    if (CC_DEBUG) {
      cc.error('cc.AssetLibrary.getLibUrlNoExt was removed, if you want to transform url, please use cc.assetManager.utils.getUrlWithUuid instead');
    }
  },
  queryAssetInfo: function queryAssetInfo() {
    if (CC_DEBUG) {
      cc.error('cc.AssetLibrary.queryAssetInfo was removed, only available in the editor by using cc.assetManager.editorExtend.queryAssetInfo');
    }
  }
};
/**
 * `cc.url` is deprecated
 *
 * @deprecated cc.url is deprecated
 * @class url
 * @static
 */

cc.url = {
  normalize: function normalize(url) {
    cc.warnID(1400, 'cc.url.normalize', 'cc.assetManager.utils.normalize');
    return cc.assetManager.utils.normalize(url);
  },

  /**
   * `cc.url.raw` is deprecated, please use `cc.resources.load` directly, or use `Asset.nativeUrl` instead.
   *
   * @deprecated cc.url.raw is deprecated, please use cc.resources.load directly, or use Asset.nativeUrl instead.
   * @method raw
   * @param {String} url
   * @return {String}
   */
  raw: function raw(url) {
    cc.warnID(1400, 'cc.url.raw', 'cc.resources.load');

    if (url.startsWith('resources/')) {
      return cc.assetManager._transform({
        'path': cc.path.changeExtname(url.substr(10)),
        bundle: cc.AssetManager.BuiltinBundleName.RESOURCES,
        __isNative__: true,
        ext: cc.path.extname(url)
      });
    }

    return '';
  }
};
var onceWarns = {
  loader: true,
  assetLibrary: true
};
Object.defineProperties(cc, {
  loader: {
    get: function get() {
      if (CC_DEBUG) {
        if (onceWarns.loader) {
          onceWarns.loader = false;
          cc.log('cc.loader is deprecated, use cc.assetManager instead please. See https://docs.cocos.com/creator/manual/zh/release-notes/asset-manager-upgrade-guide.html');
        }
      }

      return loader;
    }
  },
  AssetLibrary: {
    get: function get() {
      if (CC_DEBUG) {
        if (onceWarns.assetLibrary) {
          onceWarns.assetLibrary = false;
          cc.log('cc.AssetLibrary is deprecated, use cc.assetManager instead please. See https://docs.cocos.com/creator/manual/zh/release-notes/asset-manager-upgrade-guide.html');
        }
      }

      return AssetLibrary;
    }
  },

  /**
   * `cc.LoadingItems` was removed, please use {{#crossLink "Task"}}{{/crossLink}} instead
   *
   * @deprecated cc.LoadingItems was removed, please use cc.AssetManager.Task instead
   * @class LoadingItems
   */
  LoadingItems: {
    get: function get() {
      cc.warnID(1400, 'cc.LoadingItems', 'cc.AssetManager.Task');
      return cc.AssetManager.Task;
    }
  },
  Pipeline: {
    get: function get() {
      cc.warnID(1400, 'cc.Pipeline', 'cc.AssetManager.Pipeline');
      return cc.AssetManager.Pipeline;
    }
  }
});
js.obsolete(cc, 'cc.RawAsset', 'cc.Asset');
/**
 * @class Asset
 */

/**
 * `cc.Asset.url` is deprecated, please use {{#crossLink "Asset/nativeUrl:property"}}{{/crossLink}} instead
 * @property url
 * @type {String}
 * @deprecated cc.Asset.url is deprecated, please use cc.Asset.nativeUrl instead
 */

js.obsolete(cc.Asset.prototype, 'cc.Asset.url', 'nativeUrl');
/**
 * @class macro
 * @static
 */

Object.defineProperties(cc.macro, {
  /**
   * `cc.macro.DOWNLOAD_MAX_CONCURRENT` is deprecated now, please use {{#crossLink "Downloader/maxConcurrency:property"}}{{/crossLink}} instead
   * 
   * @property DOWNLOAD_MAX_CONCURRENT
   * @type {Number}
   * @deprecated cc.macro.DOWNLOAD_MAX_CONCURRENT is deprecated now, please use cc.assetManager.downloader.maxConcurrency instead
   */
  DOWNLOAD_MAX_CONCURRENT: {
    get: function get() {
      return cc.assetManager.downloader.maxConcurrency;
    },
    set: function set(val) {
      cc.assetManager.downloader.maxConcurrency = val;
    }
  }
});
Object.assign(cc.director, {
  _getSceneUuid: function _getSceneUuid(sceneName) {
    cc.assetManager.main.getSceneInfo(sceneName);
  }
});
Object.defineProperties(cc.game, {
  _sceneInfos: {
    get: function get() {
      var scenes = [];

      cc.assetManager.main._config.scenes.forEach(function (val) {
        scenes.push(val);
      });

      return scenes;
    }
  }
});
var parseParameters = utilities.parseParameters;

utilities.parseParameters = function (options, onProgress, onComplete) {
  var result = parseParameters(options, onProgress, onComplete);
  result.onProgress = result.onProgress || loader.onProgress;
  return result;
};

var autoRelease = releaseManager._autoRelease;

releaseManager._autoRelease = function () {
  autoRelease.apply(this, arguments);
  var releaseSettings = loader._autoReleaseSetting;
  var keys = Object.keys(releaseSettings);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];

    if (releaseSettings[key] === true) {
      var asset = cc.assetManager.assets.get(key);
      asset && releaseManager.tryRelease(asset);
    }
  }
};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0LW1hbmFnZXIvZGVwcmVjYXRlZC5qcyJdLCJuYW1lcyI6WyJqcyIsInJlcXVpcmUiLCJ1dGlsaXRpZXMiLCJkZXBlbmRVdGlsIiwicmVsZWFzZU1hbmFnZXIiLCJkb3dubG9hZGVyIiwiZmFjdG9yeSIsImhlbHBlciIsIkltYWdlRm10cyIsIkF1ZGlvRm10cyIsIkdldFRydWUiLCJtZDVQaXBlIiwidHJhbnNmb3JtVVJMIiwidXJsIiwidXVpZCIsImdldFV1aWRGcm9tVVJMIiwiYnVuZGxlIiwiY2MiLCJhc3NldE1hbmFnZXIiLCJidW5kbGVzIiwiZmluZCIsImIiLCJnZXRBc3NldEluZm8iLCJoYXNoVmFsdWUiLCJpbmZvIiwic3RhcnRzV2l0aCIsImJhc2UiLCJfY29uZmlnIiwibmF0aXZlQmFzZSIsIm5hdGl2ZVZlciIsInZlciIsImluZGV4T2YiLCJoYXNoUGF0Y2hJbkZvbGRlciIsInBhdGgiLCJleHRuYW1lIiwiZGlybmFtZSIsImJhc2VuYW1lIiwicmVwbGFjZSIsIm1hdGNoIiwibG9hZGVyIiwib25Qcm9ncmVzcyIsIl9hdXRvUmVsZWFzZVNldHRpbmciLCJPYmplY3QiLCJjcmVhdGUiLCJfY2FjaGUiLCJhc3NldHMiLCJfbWFwIiwibG9hZCIsInJlc291cmNlcyIsInByb2dyZXNzQ2FsbGJhY2siLCJjb21wbGV0ZUNhbGxiYWNrIiwidW5kZWZpbmVkIiwiQXJyYXkiLCJpc0FycmF5IiwiaSIsImxlbmd0aCIsIml0ZW0iLCJfX2lzTmF0aXZlX18iLCJ0eXBlIiwiZXh0IiwiaW1hZ2VzIiwiYXVkaW9zIiwibG9hZEFueSIsImZpbmlzaCIsInRvdGFsIiwiY29udGVudCIsImluY2x1ZGVzIiwicHVzaCIsImVyciIsIm5hdGl2ZSIsInJlcyIsIkFzc2V0IiwiYXNzZXQiLCJpbWFnZSIsImF1ZGlvIiwiYWRkIiwibWFwIiwiZm9yRWFjaCIsIl91dWlkIiwiaXNDb21wbGV0ZWQiLCJnZXRYTUxIdHRwUmVxdWVzdCIsIlhNTEh0dHBSZXF1ZXN0IiwiX3BhcnNlTG9hZFJlc0FyZ3MiLCJwYXJzZUxvYWRSZXNBcmdzIiwiZ2V0SXRlbSIsImtleSIsImhhcyIsImdldCIsImxvYWRSZXMiLCJvbkNvbXBsZXRlIiwic2xpY2UiLCJsb2FkUmVzQXJyYXkiLCJ1cmxzIiwibG9hZFJlc0RpciIsImxvYWREaXIiLCJpbmZvcyIsImdldERpcldpdGhQYXRoIiwiZ2V0UmVzIiwiZ2V0UmVzQ291bnQiLCJjb3VudCIsImdldERlcGVuZHNSZWN1cnNpdmVseSIsIm93bmVyIiwiZ2V0RGVwc1JlY3Vyc2l2ZWx5IiwiY29uY2F0IiwiYXNzZXRMb2FkZXIiLCJDQ19ERUJVRyIsImVycm9yIiwicGFyc2VyIiwiYWRkRG93bmxvYWRIYW5kbGVycyIsImV4dE1hcCIsIndhcm4iLCJoYW5kbGVyIiwiZnVuYyIsIm9wdGlvbnMiLCJyZWdpc3RlciIsImFkZExvYWRIYW5kbGVycyIsImZpbGUiLCJmbG93SW5EZXBzIiwicmVsZWFzZSIsImlzQnVpbHRpbiIsImJ1aWx0aW5zIiwiX2Fzc2V0cyIsImJ1aWx0aW5Bc3NldCIsInJlbGVhc2VBc3NldCIsInJlbGVhc2VSZXMiLCJyZWxlYXNlUmVzRGlyIiwicmVsZWFzZUFsbCIsImNsZWFyIiwicmVtb3ZlSXRlbSIsInJlbW92ZSIsInNldEF1dG9SZWxlYXNlIiwiYXV0b1JlbGVhc2UiLCJzZXRBdXRvUmVsZWFzZVJlY3Vyc2l2ZWx5IiwiZGVwZW5kcyIsImRlcGVuZCIsImlzQXV0b1JlbGVhc2UiLCJsb2FkU3VicGFja2FnZSIsIm5hbWUiLCJsb2FkQnVuZGxlIiwiQXNzZXRMaWJyYXJ5IiwiaW5pdCIsImltcG9ydEJhc2UiLCJsaWJyYXJ5UGF0aCIsIkNDX0JVSUxEIiwicmF3QXNzZXRzQmFzZSIsInJhd0Fzc2V0cyIsIkFzc2V0TWFuYWdlciIsIkJ1bmRsZSIsIkJ1aWx0aW5CdW5kbGVOYW1lIiwiUkVTT1VSQ0VTIiwicGF0aHMiLCJ1dWlkcyIsImtleXMiLCJsb2FkQXNzZXQiLCJnZXRMaWJVcmxOb0V4dCIsInF1ZXJ5QXNzZXRJbmZvIiwibm9ybWFsaXplIiwid2FybklEIiwidXRpbHMiLCJyYXciLCJfdHJhbnNmb3JtIiwiY2hhbmdlRXh0bmFtZSIsInN1YnN0ciIsIm9uY2VXYXJucyIsImFzc2V0TGlicmFyeSIsImRlZmluZVByb3BlcnRpZXMiLCJsb2ciLCJMb2FkaW5nSXRlbXMiLCJUYXNrIiwiUGlwZWxpbmUiLCJvYnNvbGV0ZSIsInByb3RvdHlwZSIsIm1hY3JvIiwiRE9XTkxPQURfTUFYX0NPTkNVUlJFTlQiLCJtYXhDb25jdXJyZW5jeSIsInNldCIsInZhbCIsImFzc2lnbiIsImRpcmVjdG9yIiwiX2dldFNjZW5lVXVpZCIsInNjZW5lTmFtZSIsIm1haW4iLCJnZXRTY2VuZUluZm8iLCJnYW1lIiwiX3NjZW5lSW5mb3MiLCJzY2VuZXMiLCJwYXJzZVBhcmFtZXRlcnMiLCJyZXN1bHQiLCJfYXV0b1JlbGVhc2UiLCJhcHBseSIsImFyZ3VtZW50cyIsInJlbGVhc2VTZXR0aW5ncyIsInRyeVJlbGVhc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxnQkFBRCxDQUFsQjs7QUFDQUEsT0FBTyxDQUFDLGVBQUQsQ0FBUDs7QUFDQSxJQUFNQyxTQUFTLEdBQUdELE9BQU8sQ0FBQyxhQUFELENBQXpCOztBQUNBLElBQU1FLFVBQVUsR0FBR0YsT0FBTyxDQUFDLGVBQUQsQ0FBMUI7O0FBQ0EsSUFBTUcsY0FBYyxHQUFHSCxPQUFPLENBQUMsa0JBQUQsQ0FBOUI7O0FBQ0EsSUFBTUksVUFBVSxHQUFHSixPQUFPLENBQUMsY0FBRCxDQUExQjs7QUFDQSxJQUFNSyxPQUFPLEdBQUdMLE9BQU8sQ0FBQyxXQUFE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LFVBQS9CLEVBQTJDO0FBQ25FLE1BQUlrRyxNQUFNLEdBQUdELGVBQWUsQ0FBQ3pFLE9BQUQsRUFBVXpFLFVBQVYsRUFBc0JpRCxVQUF0QixDQUE1QjtBQUNBa0csRUFBQUEsTUFBTSxDQUFDbkosVUFBUCxHQUFvQm1KLE1BQU0sQ0FBQ25KLFVBQVAsSUFBcUJELE1BQU0sQ0FBQ0MsVUFBaEQ7QUFDQSxTQUFPbUosTUFBUDtBQUNILENBSkQ7O0FBTUEsSUFBSXhELFdBQVcsR0FBRy9ILGNBQWMsQ0FBQ3dMLFlBQWpDOztBQUNBeEwsY0FBYyxDQUFDd0wsWUFBZixHQUE4QixZQUFZO0FBQ3RDekQsRUFBQUEsV0FBVyxDQUFDMEQsS0FBWixDQUFrQixJQUFsQixFQUF3QkMsU0FBeEI7QUFDQSxNQUFJQyxlQUFlLEdBQUd4SixNQUFNLENBQUNFLG1CQUE3QjtBQUNBLE1BQUkrRyxJQUFJLEdBQUc5RyxNQUFNLENBQUM4RyxJQUFQLENBQVl1QyxlQUFaLENBQVg7O0FBQ0EsT0FBSyxJQUFJekksQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR2tHLElBQUksQ0FBQ2pHLE1BQXpCLEVBQWlDRCxDQUFDLEVBQWxDLEVBQXNDO0FBQ2xDLFFBQUkrQixHQUFHLEdBQUdtRSxJQUFJLENBQUNsRyxDQUFELENBQWQ7O0FBQ0EsUUFBSXlJLGVBQWUsQ0FBQzFHLEdBQUQsQ0FBZixLQUF5QixJQUE3QixFQUFtQztBQUMvQixVQUFJYixLQUFLLEdBQUd2RCxFQUFFLENBQUNDLFlBQUgsQ0FBZ0IyQixNQUFoQixDQUF1QjBDLEdBQXZCLENBQTJCRixHQUEzQixDQUFaO0FBQ0FiLE1BQUFBLEtBQUssSUFBSXBFLGNBQWMsQ0FBQzRMLFVBQWYsQ0FBMEJ4SCxLQUExQixDQUFUO0FBQ0g7QUFDSjtBQUNKLENBWEQiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IGpzID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vanMnKTtcbnJlcXVpcmUoJy4uL0NDRGlyZWN0b3InKTtcbmNvbnN0IHV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzJyk7XG5jb25zdCBkZXBlbmRVdGlsID0gcmVxdWlyZSgnLi9kZXBlbmQtdXRpbCcpO1xuY29uc3QgcmVsZWFzZU1hbmFnZXIgPSByZXF1aXJlKCcuL3JlbGVhc2VNYW5hZ2VyJyk7XG5jb25zdCBkb3dubG9hZGVyID0gcmVxdWlyZSgnLi9kb3dubG9hZGVyJyk7XG5jb25zdCBmYWN0b3J5ID0gcmVxdWlyZSgnLi9mYWN0b3J5Jyk7XG5jb25zdCBoZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcicpO1xuXG5jb25zdCBJbWFnZUZtdHMgPSBbJy5wbmcnLCAnLmpwZycsICcuYm1wJywgJy5qcGVnJywgJy5naWYnLCAnLmljbycsICcudGlmZicsICcud2VicCcsICcuaW1hZ2UnLCAnLnB2cicsICcucGttJ107XG5jb25zdCBBdWRpb0ZtdHMgPSBbJy5tcDMnLCAnLm9nZycsICcud2F2JywgJy5tNGEnXTtcblxuZnVuY3Rpb24gR2V0VHJ1ZSAoKSB7IHJldHVybiB0cnVlOyB9XG5cbmNvbnN0IG1kNVBpcGUgPSB7XG4gICAgdHJhbnNmb3JtVVJMICh1cmwpIHtcbiAgICAgICAgbGV0IHV1aWQgPSBoZWxwZXIuZ2V0VXVpZEZyb21VUkwodXJsKTtcbiAgICAgICAgaWYgKCF1dWlkKSB7IHJldHVybiB1cmw7IH1cbiAgICAgICAgbGV0IGJ1bmRsZSA9IGNjLmFzc2V0TWFuYWdlci5idW5kbGVzLmZpbmQoKGIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAhIWIuZ2V0QXNzZXRJbmZvKHV1aWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFidW5kbGUpIHsgcmV0dXJuIHVybDsgfVxuICAgICAgICBsZXQgaGFzaFZhbHVlID0gJyc7XG4gICAgICAgIGxldCBpbmZvID0gYnVuZGxlLmdldEFzc2V0SW5mbyh1dWlkKTtcbiAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKGJ1bmRsZS5iYXNlICsgYnVuZGxlLl9jb25maWcubmF0aXZlQmFzZSkpIHtcbiAgICAgICAgICAgIGhhc2hWYWx1ZSA9IGluZm8ubmF0aXZlVmVyIHx8ICcnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaGFzaFZhbHVlID0gaW5mby52ZXIgfHwgJyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFoYXNoVmFsdWUgfHwgdXJsLmluZGV4T2YoaGFzaFZhbHVlKSAhPT0gLTEpIHsgcmV0dXJuIHVybDsgfVxuICAgICAgICBsZXQgaGFzaFBhdGNoSW5Gb2xkZXIgPSBmYWxzZTtcbiAgICAgICAgaWYgKGNjLnBhdGguZXh0bmFtZSh1cmwpID09PSAnLnR0ZicpIHtcbiAgICAgICAgICAgIGhhc2hQYXRjaEluRm9sZGVyID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFzaFBhdGNoSW5Gb2xkZXIpIHtcbiAgICAgICAgICAgIGxldCBkaXJuYW1lID0gY2MucGF0aC5kaXJuYW1lKHVybCk7XG4gICAgICAgICAgICBsZXQgYmFzZW5hbWUgPSBjYy5wYXRoLmJhc2VuYW1lKHVybCk7XG4gICAgICAgICAgICB1cmwgPSBgJHtkaXJuYW1lfS4ke2hhc2hWYWx1ZX0vJHtiYXNlbmFtZX1gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoLy4qWy9cXFxcXVswLTlhLWZBLUZdezJ9Wy9cXFxcXShbMC05YS1mQS1GLV17OCx9KS8sIChtYXRjaCwgdXVpZCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaCArICcuJyArIGhhc2hWYWx1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdXJsO1xuICAgIH0sXG59O1xuXG4vKipcbiAqIGBjYy5sb2FkZXJgIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSBiYWNrdXAgeW91ciBwcm9qZWN0IGFuZCB1cGdyYWRlIHRvIHt7I2Nyb3NzTGluayBcIkFzc2V0TWFuYWdlclwifX17ey9jcm9zc0xpbmt9fVxuICpcbiAqIEBjbGFzcyBsb2FkZXJcbiAqIEBzdGF0aWNcbiAqIEBkZXByZWNhdGVkIGNjLmxvYWRlciBpcyBkZXByZWNhdGVkLCBwbGVhc2UgYmFja3VwIHlvdXIgcHJvamVjdCBhbmQgdXBncmFkZSB0byBjYy5hc3NldE1hbmFnZXJcbiAqL1xuY29uc3QgbG9hZGVyID0ge1xuICAgIC8qKlxuICAgICAqIGBjYy5sb2FkZXIub25Qcm9ncmVzc2AgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHRyYW5zZmVyIG9uUHJvZ3Jlc3MgdG8gQVBJIGFzIGEgcGFyYW1ldGVyXG4gICAgICogQHByb3BlcnR5IG9uUHJvZ3Jlc3NcbiAgICAgKiBAZGVwcmVjYXRlZCBjYy5sb2FkZXIub25Qcm9ncmVzcyBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdHJhbnNmZXIgb25Qcm9ncmVzcyB0byBBUEkgYXMgYSBwYXJhbWV0ZXJcbiAgICAgKi9cbiAgICBvblByb2dyZXNzOiBudWxsLFxuICAgIF9hdXRvUmVsZWFzZVNldHRpbmc6IE9iamVjdC5jcmVhdGUobnVsbCksXG5cbiAgICBnZXQgX2NhY2hlICgpIHtcbiAgICAgICAgcmV0dXJuIGNjLmFzc2V0TWFuYWdlci5hc3NldHMuX21hcDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogYGNjLmxvYWRlci5sb2FkYCBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIHt7I2Nyb3NzTGluayBcIkFzc2V0TWFuYWdlci9sb2FkQW55Om1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSBpbnN0ZWFkXG4gICAgICpcbiAgICAgKiBAZGVwcmVjYXRlZCBjYy5sb2FkZXIubG9hZCBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGNjLmFzc2V0TWFuYWdlci5sb2FkQW55IGluc3RlYWRcbiAgICAgKlxuICAgICAqIEBtZXRob2QgbG9hZFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFN0cmluZ1tdfE9iamVjdH0gcmVzb3VyY2VzIC0gVXJsIGxpc3QgaW4gYW4gYXJyYXlcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcHJvZ3Jlc3NDYWxsYmFja10gLSBDYWxsYmFjayBpbnZva2VkIHdoZW4gcHJvZ3Jlc3Npb24gY2hhbmdlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHByb2dyZXNzQ2FsbGJhY2suY29tcGxldGVkQ291bnQgLSBUaGUgbnVtYmVyIG9mIHRoZSBpdGVtcyB0aGF0IGFyZSBhbHJlYWR5IGNvbXBsZXRlZFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwcm9ncmVzc0NhbGxiYWNrLnRvdGFsQ291bnQgLSBUaGUgdG90YWwgbnVtYmVyIG9mIHRoZSBpdGVtc1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9ncmVzc0NhbGxiYWNrLml0ZW0gLSBUaGUgbGF0ZXN0IGl0ZW0gd2hpY2ggZmxvdyBvdXQgdGhlIHBpcGVsaW5lXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBsZXRlQ2FsbGJhY2tdIC0gQ2FsbGJhY2sgaW52b2tlZCB3aGVuIGFsbCByZXNvdXJjZXMgbG9hZGVkXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBsb2FkKHJlc291cmNlczogc3RyaW5nfHN0cmluZ1tdfHt1dWlkPzogc3RyaW5nLCB1cmw/OiBzdHJpbmcsIHR5cGU/OiBzdHJpbmd9LCBjb21wbGV0ZUNhbGxiYWNrPzogRnVuY3Rpb24pOiB2b2lkXG4gICAgICogbG9hZChyZXNvdXJjZXM6IHN0cmluZ3xzdHJpbmdbXXx7dXVpZD86IHN0cmluZywgdXJsPzogc3RyaW5nLCB0eXBlPzogc3RyaW5nfSwgcHJvZ3Jlc3NDYWxsYmFjazogKGNvbXBsZXRlZENvdW50OiBudW1iZXIsIHRvdGFsQ291bnQ6IG51bWJlciwgaXRlbTogYW55KSA9PiB2b2lkLCBjb21wbGV0ZUNhbGxiYWNrOiBGdW5jdGlvbnxudWxsKTogdm9pZFxuICAgICAqL1xuICAgIGxvYWQgKHJlc291cmNlcywgcHJvZ3Jlc3NDYWxsYmFjaywgY29tcGxldGVDYWxsYmFjaykge1xuICAgICAgICBpZiAoY29tcGxldGVDYWxsYmFjayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3NDYWxsYmFjayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29tcGxldGVDYWxsYmFjayA9IHByb2dyZXNzQ2FsbGJhY2s7XG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NDYWxsYmFjayA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzb3VyY2VzID0gQXJyYXkuaXNBcnJheShyZXNvdXJjZXMpID8gcmVzb3VyY2VzIDogW3Jlc291cmNlc107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzb3VyY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IHJlc291cmNlc1tpXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICByZXNvdXJjZXNbaV0gPSB7IHVybDogaXRlbSwgX19pc05hdGl2ZV9fOiB0cnVlfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5leHQgPSAnLicgKyBpdGVtLnR5cGU7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udHlwZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaXRlbS51cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5fX2lzTmF0aXZlX18gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgaW1hZ2VzID0gW107XG4gICAgICAgIHZhciBhdWRpb3MgPSBbXTtcbiAgICAgICAgY2MuYXNzZXRNYW5hZ2VyLmxvYWRBbnkocmVzb3VyY2VzLCBudWxsLCAoZmluaXNoLCB0b3RhbCwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgaWYgKGl0ZW0uY29udGVudCkge1xuICAgICAgICAgICAgICAgIGlmIChJbWFnZUZtdHMuaW5jbHVkZXMoaXRlbS5leHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGltYWdlcy5wdXNoKGl0ZW0uY29udGVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKEF1ZGlvRm10cy5pbmNsdWRlcyhpdGVtLmV4dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYXVkaW9zLnB1c2goaXRlbS5jb250ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9ncmVzc0NhbGxiYWNrICYmIHByb2dyZXNzQ2FsbGJhY2soZmluaXNoLCB0b3RhbCwgaXRlbSk7XG4gICAgICAgIH0sIChlcnIsIG5hdGl2ZSkgPT4ge1xuICAgICAgICAgICAgdmFyIHJlcyA9IG51bGw7XG4gICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgIG5hdGl2ZSA9IEFycmF5LmlzQXJyYXkobmF0aXZlKSA/IG5hdGl2ZSA6IFtuYXRpdmVdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmF0aXZlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gbmF0aXZlW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIShpdGVtIGluc3RhbmNlb2YgY2MuQXNzZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXNzZXQgPSBpdGVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVybCA9IHJlc291cmNlc1tpXS51cmw7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW1hZ2VzLmluY2x1ZGVzKGFzc2V0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhY3RvcnkuY3JlYXRlKHVybCwgaXRlbSwgJy5wbmcnLCBudWxsLCAoZXJyLCBpbWFnZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NldCA9IG5hdGl2ZVtpXSA9IGltYWdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoYXVkaW9zLmluY2x1ZGVzKGFzc2V0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhY3RvcnkuY3JlYXRlKHVybCwgaXRlbSwgJy5tcDMnLCBudWxsLCAoZXJyLCBhdWRpbykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NldCA9IG5hdGl2ZVtpXSA9IGF1ZGlvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2MuYXNzZXRNYW5hZ2VyLmFzc2V0cy5hZGQodXJsLCBhc3NldCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5hdGl2ZS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICBuYXRpdmUuZm9yRWFjaChmdW5jdGlvbiAoYXNzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcFthc3NldC5fdXVpZF0gPSBhc3NldDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJlcyA9IHsgaXNDb21wbGV0ZWQ6IEdldFRydWUsIF9tYXA6IG1hcCB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzID0gbmF0aXZlWzBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbXBsZXRlQ2FsbGJhY2sgJiYgY29tcGxldGVDYWxsYmFjayhlcnIsIHJlcyk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBgY2MubG9hZGVyLmdldFhNTEh0dHBSZXF1ZXN0YCBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGBYTUxIdHRwUmVxdWVzdGAgZGlyZWN0bHlcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZ2V0WE1MSHR0cFJlcXVlc3RcbiAgICAgKiBAZGVwcmVjYXRlZCBjYy5sb2FkZXIuZ2V0WE1MSHR0cFJlcXVlc3QgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSBYTUxIdHRwUmVxdWVzdCBkaXJlY3RseVxuICAgICAqIEByZXR1cm5zIHtYTUxIdHRwUmVxdWVzdH1cbiAgICAgKi9cbiAgICBnZXRYTUxIdHRwUmVxdWVzdCAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB9LFxuXG4gICAgX3BhcnNlTG9hZFJlc0FyZ3M6IHV0aWxpdGllcy5wYXJzZUxvYWRSZXNBcmdzLFxuXG4gICAgLyoqXG4gICAgICogYGNjLmxvYWRlci5nZXRJdGVtYCBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGBjYy5hc3NldE1hbmFnZXIuYXNzZXQuZ2V0YCBpbnN0ZWFkXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGdldEl0ZW1cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaWQgVGhlIGlkIG9mIHRoZSBpdGVtXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqIEBkZXByZWNhdGVkIGNjLmxvYWRlci5nZXRJdGVtIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgY2MuYXNzZXRNYW5hZ2VyLmFzc2V0cy5nZXQgaW5zdGVhZFxuICAgICAqL1xuICAgIGdldEl0ZW0gKGtleSkge1xuICAgICAgICByZXR1cm4gY2MuYXNzZXRNYW5hZ2VyLmFzc2V0cy5oYXMoa2V5KSA/IHsgY29udGVudDogY2MuYXNzZXRNYW5hZ2VyLmFzc2V0cy5nZXQoa2V5KSB9IDogbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogYGNjLmxvYWRlci5sb2FkUmVzYCBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIHt7I2Nyb3NzTGluayBcIkJ1bmRsZS9sb2FkOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSAgaW5zdGVhZFxuICAgICAqXG4gICAgICogQGRlcHJlY2F0ZWQgY2MubG9hZGVyLmxvYWRSZXMgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSBjYy5yZXNvdXJjZXMubG9hZCAgaW5zdGVhZFxuICAgICAqIEBtZXRob2QgbG9hZFJlc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSBVcmwgb2YgdGhlIHRhcmdldCByZXNvdXJjZS5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgVGhlIHVybCBpcyByZWxhdGl2ZSB0byB0aGUgXCJyZXNvdXJjZXNcIiBmb2xkZXIsIGV4dGVuc2lvbnMgbXVzdCBiZSBvbWl0dGVkLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFt0eXBlXSAtIE9ubHkgYXNzZXQgb2YgdHlwZSB3aWxsIGJlIGxvYWRlZCBpZiB0aGlzIGFyZ3VtZW50IGlzIHN1cHBsaWVkLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtwcm9ncmVzc0NhbGxiYWNrXSAtIENhbGxiYWNrIGludm9rZWQgd2hlbiBwcm9ncmVzc2lvbiBjaGFuZ2UuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHByb2dyZXNzQ2FsbGJhY2suY29tcGxldGVkQ291bnQgLSBUaGUgbnVtYmVyIG9mIHRoZSBpdGVtcyB0aGF0IGFyZSBhbHJlYWR5IGNvbXBsZXRlZC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcHJvZ3Jlc3NDYWxsYmFjay50b3RhbENvdW50IC0gVGhlIHRvdGFsIG51bWJlciBvZiB0aGUgaXRlbXMuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHByb2dyZXNzQ2FsbGJhY2suaXRlbSAtIFRoZSBsYXRlc3QgaXRlbSB3aGljaCBmbG93IG91dCB0aGUgcGlwZWxpbmUuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBsZXRlQ2FsbGJhY2tdIC0gQ2FsbGJhY2sgaW52b2tlZCB3aGVuIHRoZSByZXNvdXJjZSBsb2FkZWQuXG4gICAgICogQHBhcmFtIHtFcnJvcn0gY29tcGxldGVDYWxsYmFjay5lcnJvciAtIFRoZSBlcnJvciBpbmZvIG9yIG51bGwgaWYgbG9hZGVkIHN1Y2Nlc3NmdWxseS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29tcGxldGVDYWxsYmFjay5yZXNvdXJjZSAtIFRoZSBsb2FkZWQgcmVzb3VyY2UgaWYgaXQgY2FuIGJlIGZvdW5kIG90aGVyd2lzZSByZXR1cm5zIG51bGwuXG4gICAgICpcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGxvYWRSZXModXJsOiBzdHJpbmcsIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgcHJvZ3Jlc3NDYWxsYmFjazogKGNvbXBsZXRlZENvdW50OiBudW1iZXIsIHRvdGFsQ291bnQ6IG51bWJlciwgaXRlbTogYW55KSA9PiB2b2lkLCBjb21wbGV0ZUNhbGxiYWNrOiAoKGVycm9yOiBFcnJvciwgcmVzb3VyY2U6IGFueSkgPT4gdm9pZCl8bnVsbCk6IHZvaWRcbiAgICAgKiBsb2FkUmVzKHVybDogc3RyaW5nLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQsIGNvbXBsZXRlQ2FsbGJhY2s6IChlcnJvcjogRXJyb3IsIHJlc291cmNlOiBhbnkpID0+IHZvaWQpOiB2b2lkXG4gICAgICogbG9hZFJlcyh1cmw6IHN0cmluZywgdHlwZTogdHlwZW9mIGNjLkFzc2V0KTogdm9pZFxuICAgICAqIGxvYWRSZXModXJsOiBzdHJpbmcsIHByb2dyZXNzQ2FsbGJhY2s6IChjb21wbGV0ZWRDb3VudDogbnVtYmVyLCB0b3RhbENvdW50OiBudW1iZXIsIGl0ZW06IGFueSkgPT4gdm9pZCwgY29tcGxldGVDYWxsYmFjazogKChlcnJvcjogRXJyb3IsIHJlc291cmNlOiBhbnkpID0+IHZvaWQpfG51bGwpOiB2b2lkXG4gICAgICogbG9hZFJlcyh1cmw6IHN0cmluZywgY29tcGxldGVDYWxsYmFjazogKGVycm9yOiBFcnJvciwgcmVzb3VyY2U6IGFueSkgPT4gdm9pZCk6IHZvaWRcbiAgICAgKiBsb2FkUmVzKHVybDogc3RyaW5nKTogdm9pZFxuICAgICAqL1xuICAgIGxvYWRSZXMgKHVybCwgdHlwZSwgcHJvZ3Jlc3NDYWxsYmFjaywgY29tcGxldGVDYWxsYmFjaykge1xuICAgICAgICB2YXIgeyB0eXBlLCBvblByb2dyZXNzLCBvbkNvbXBsZXRlIH0gPSB0aGlzLl9wYXJzZUxvYWRSZXNBcmdzKHR5cGUsIHByb2dyZXNzQ2FsbGJhY2ssIGNvbXBsZXRlQ2FsbGJhY2spO1xuICAgICAgICB2YXIgZXh0bmFtZSA9IGNjLnBhdGguZXh0bmFtZSh1cmwpO1xuICAgICAgICBpZiAoZXh0bmFtZSkge1xuICAgICAgICAgICAgLy8gc3RyaXAgZXh0bmFtZVxuICAgICAgICAgICAgdXJsID0gdXJsLnNsaWNlKDAsIC0gZXh0bmFtZS5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIGNjLnJlc291cmNlcy5sb2FkKHVybCwgdHlwZSwgb25Qcm9ncmVzcywgb25Db21wbGV0ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGBjYy5sb2FkZXIubG9hZFJlc0FycmF5YCBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIHt7I2Nyb3NzTGluayBcIkJ1bmRsZS9sb2FkOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSBpbnN0ZWFkXG4gICAgICpcbiAgICAgKiBAZGVwcmVjYXRlZCBjYy5sb2FkZXIubG9hZFJlc0FycmF5IGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgY2MucmVzb3VyY2VzLmxvYWQgaW5zdGVhZFxuICAgICAqIEBtZXRob2QgbG9hZFJlc0FycmF5XG4gICAgICogQHBhcmFtIHtTdHJpbmdbXX0gdXJscyAtIEFycmF5IG9mIFVSTHMgb2YgdGhlIHRhcmdldCByZXNvdXJjZS5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIHVybCBpcyByZWxhdGl2ZSB0byB0aGUgXCJyZXNvdXJjZXNcIiBmb2xkZXIsIGV4dGVuc2lvbnMgbXVzdCBiZSBvbWl0dGVkLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFt0eXBlXSAtIE9ubHkgYXNzZXQgb2YgdHlwZSB3aWxsIGJlIGxvYWRlZCBpZiB0aGlzIGFyZ3VtZW50IGlzIHN1cHBsaWVkLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtwcm9ncmVzc0NhbGxiYWNrXSAtIENhbGxiYWNrIGludm9rZWQgd2hlbiBwcm9ncmVzc2lvbiBjaGFuZ2UuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHByb2dyZXNzQ2FsbGJhY2suY29tcGxldGVkQ291bnQgLSBUaGUgbnVtYmVyIG9mIHRoZSBpdGVtcyB0aGF0IGFyZSBhbHJlYWR5IGNvbXBsZXRlZC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcHJvZ3Jlc3NDYWxsYmFjay50b3RhbENvdW50IC0gVGhlIHRvdGFsIG51bWJlciBvZiB0aGUgaXRlbXMuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHByb2dyZXNzQ2FsbGJhY2suaXRlbSAtIFRoZSBsYXRlc3QgaXRlbSB3aGljaCBmbG93IG91dCB0aGUgcGlwZWxpbmUuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBsZXRlQ2FsbGJhY2tdIC0gQSBjYWxsYmFjayB3aGljaCBpcyBjYWxsZWQgd2hlbiBhbGwgYXNzZXRzIGhhdmUgYmVlbiBsb2FkZWQsIG9yIGFuIGVycm9yIG9jY3Vycy5cbiAgICAgKiBAcGFyYW0ge0Vycm9yfSBjb21wbGV0ZUNhbGxiYWNrLmVycm9yIC0gSWYgb25lIG9mIHRoZSBhc3NldCBmYWlsZWQsIHRoZSBjb21wbGV0ZSBjYWxsYmFjayBpcyBpbW1lZGlhdGVseSBjYWxsZWRcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2l0aCB0aGUgZXJyb3IuIElmIGFsbCBhc3NldHMgYXJlIGxvYWRlZCBzdWNjZXNzZnVsbHksIGVycm9yIHdpbGwgYmUgbnVsbC5cbiAgICAgKiBAcGFyYW0ge0Fzc2V0W118QXJyYXl9IGNvbXBsZXRlQ2FsbGJhY2suYXNzZXRzIC0gQW4gYXJyYXkgb2YgYWxsIGxvYWRlZCBhc3NldHMuXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIElmIG5vdGhpbmcgdG8gbG9hZCwgYXNzZXRzIHdpbGwgYmUgYW4gZW1wdHkgYXJyYXkuXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBsb2FkUmVzQXJyYXkodXJsOiBzdHJpbmdbXSwgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCBwcm9ncmVzc0NhbGxiYWNrOiAoY29tcGxldGVkQ291bnQ6IG51bWJlciwgdG90YWxDb3VudDogbnVtYmVyLCBpdGVtOiBhbnkpID0+IHZvaWQsIGNvbXBsZXRlQ2FsbGJhY2s6ICgoZXJyb3I6IEVycm9yLCByZXNvdXJjZTogYW55W10pID0+IHZvaWQpfG51bGwpOiB2b2lkXG4gICAgICogbG9hZFJlc0FycmF5KHVybDogc3RyaW5nW10sIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgY29tcGxldGVDYWxsYmFjazogKGVycm9yOiBFcnJvciwgcmVzb3VyY2U6IGFueVtdKSA9PiB2b2lkKTogdm9pZFxuICAgICAqIGxvYWRSZXNBcnJheSh1cmw6IHN0cmluZ1tdLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQpOiB2b2lkXG4gICAgICogbG9hZFJlc0FycmF5KHVybDogc3RyaW5nW10sIHByb2dyZXNzQ2FsbGJhY2s6IChjb21wbGV0ZWRDb3VudDogbnVtYmVyLCB0b3RhbENvdW50OiBudW1iZXIsIGl0ZW06IGFueSkgPT4gdm9pZCwgY29tcGxldGVDYWxsYmFjazogKChlcnJvcjogRXJyb3IsIHJlc291cmNlOiBhbnlbXSkgPT4gdm9pZCl8bnVsbCk6IHZvaWRcbiAgICAgKiBsb2FkUmVzQXJyYXkodXJsOiBzdHJpbmdbXSwgY29tcGxldGVDYWxsYmFjazogKGVycm9yOiBFcnJvciwgcmVzb3VyY2U6IGFueVtdKSA9PiB2b2lkKTogdm9pZFxuICAgICAqIGxvYWRSZXNBcnJheSh1cmw6IHN0cmluZ1tdKTogdm9pZFxuICAgICAqIGxvYWRSZXNBcnJheSh1cmw6IHN0cmluZ1tdLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXRbXSk6IHZvaWRcbiAgICAgKi9cbiAgICBsb2FkUmVzQXJyYXkgKHVybHMsIHR5cGUsIHByb2dyZXNzQ2FsbGJhY2ssIGNvbXBsZXRlQ2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHsgdHlwZSwgb25Qcm9ncmVzcywgb25Db21wbGV0ZSB9ID0gdGhpcy5fcGFyc2VMb2FkUmVzQXJncyh0eXBlLCBwcm9ncmVzc0NhbGxiYWNrLCBjb21wbGV0ZUNhbGxiYWNrKTtcbiAgICAgICAgdXJscy5mb3JFYWNoKCh1cmwsIGkpID0+IHtcbiAgICAgICAgICAgIHZhciBleHRuYW1lID0gY2MucGF0aC5leHRuYW1lKHVybCk7XG4gICAgICAgICAgICBpZiAoZXh0bmFtZSkge1xuICAgICAgICAgICAgICAgIC8vIHN0cmlwIGV4dG5hbWVcbiAgICAgICAgICAgICAgICB1cmxzW2ldID0gdXJsLnNsaWNlKDAsIC0gZXh0bmFtZS5sZW5ndGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBjYy5yZXNvdXJjZXMubG9hZCh1cmxzLCB0eXBlLCBvblByb2dyZXNzLCBvbkNvbXBsZXRlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogYGNjLmxvYWRlci5sb2FkUmVzRGlyYCBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIHt7I2Nyb3NzTGluayBcIkJ1bmRsZS9sb2FkRGlyOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSBpbnN0ZWFkXG4gICAgICpcbiAgICAgKiBAZGVwcmVjYXRlZCBjYy5sb2FkZXIubG9hZFJlc0RpciBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGNjLnJlc291cmNlcy5sb2FkRGlyIGluc3RlYWRcbiAgICAgKiBAbWV0aG9kIGxvYWRSZXNEaXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIC0gVXJsIG9mIHRoZSB0YXJnZXQgZm9sZGVyLlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICBUaGUgdXJsIGlzIHJlbGF0aXZlIHRvIHRoZSBcInJlc291cmNlc1wiIGZvbGRlciwgZXh0ZW5zaW9ucyBtdXN0IGJlIG9taXR0ZWQuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3R5cGVdIC0gT25seSBhc3NldCBvZiB0eXBlIHdpbGwgYmUgbG9hZGVkIGlmIHRoaXMgYXJndW1lbnQgaXMgc3VwcGxpZWQuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3Byb2dyZXNzQ2FsbGJhY2tdIC0gQ2FsbGJhY2sgaW52b2tlZCB3aGVuIHByb2dyZXNzaW9uIGNoYW5nZS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcHJvZ3Jlc3NDYWxsYmFjay5jb21wbGV0ZWRDb3VudCAtIFRoZSBudW1iZXIgb2YgdGhlIGl0ZW1zIHRoYXQgYXJlIGFscmVhZHkgY29tcGxldGVkLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwcm9ncmVzc0NhbGxiYWNrLnRvdGFsQ291bnQgLSBUaGUgdG90YWwgbnVtYmVyIG9mIHRoZSBpdGVtcy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJvZ3Jlc3NDYWxsYmFjay5pdGVtIC0gVGhlIGxhdGVzdCBpdGVtIHdoaWNoIGZsb3cgb3V0IHRoZSBwaXBlbGluZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY29tcGxldGVDYWxsYmFja10gLSBBIGNhbGxiYWNrIHdoaWNoIGlzIGNhbGxlZCB3aGVuIGFsbCBhc3NldHMgaGF2ZSBiZWVuIGxvYWRlZCwgb3IgYW4gZXJyb3Igb2NjdXJzLlxuICAgICAqIEBwYXJhbSB7RXJyb3J9IGNvbXBsZXRlQ2FsbGJhY2suZXJyb3IgLSBJZiBvbmUgb2YgdGhlIGFzc2V0IGZhaWxlZCwgdGhlIGNvbXBsZXRlIGNhbGxiYWNrIGlzIGltbWVkaWF0ZWx5IGNhbGxlZFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRoIHRoZSBlcnJvci4gSWYgYWxsIGFzc2V0cyBhcmUgbG9hZGVkIHN1Y2Nlc3NmdWxseSwgZXJyb3Igd2lsbCBiZSBudWxsLlxuICAgICAqIEBwYXJhbSB7QXNzZXRbXXxBcnJheX0gY29tcGxldGVDYWxsYmFjay5hc3NldHMgLSBBbiBhcnJheSBvZiBhbGwgbG9hZGVkIGFzc2V0cy5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIElmIG5vdGhpbmcgdG8gbG9hZCwgYXNzZXRzIHdpbGwgYmUgYW4gZW1wdHkgYXJyYXkuXG4gICAgICogQHBhcmFtIHtTdHJpbmdbXX0gY29tcGxldGVDYWxsYmFjay51cmxzIC0gQW4gYXJyYXkgdGhhdCBsaXN0cyBhbGwgdGhlIFVSTHMgb2YgbG9hZGVkIGFzc2V0cy5cbiAgICAgKlxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbG9hZFJlc0Rpcih1cmw6IHN0cmluZywgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCBwcm9ncmVzc0NhbGxiYWNrOiAoY29tcGxldGVkQ291bnQ6IG51bWJlciwgdG90YWxDb3VudDogbnVtYmVyLCBpdGVtOiBhbnkpID0+IHZvaWQsIGNvbXBsZXRlQ2FsbGJhY2s6ICgoZXJyb3I6IEVycm9yLCByZXNvdXJjZTogYW55W10sIHVybHM6IHN0cmluZ1tdKSA9PiB2b2lkKXxudWxsKTogdm9pZFxuICAgICAqIGxvYWRSZXNEaXIodXJsOiBzdHJpbmcsIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgY29tcGxldGVDYWxsYmFjazogKGVycm9yOiBFcnJvciwgcmVzb3VyY2U6IGFueVtdLCB1cmxzOiBzdHJpbmdbXSkgPT4gdm9pZCk6IHZvaWRcbiAgICAgKiBsb2FkUmVzRGlyKHVybDogc3RyaW5nLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQpOiB2b2lkXG4gICAgICogbG9hZFJlc0Rpcih1cmw6IHN0cmluZywgcHJvZ3Jlc3NDYWxsYmFjazogKGNvbXBsZXRlZENvdW50OiBudW1iZXIsIHRvdGFsQ291bnQ6IG51bWJlciwgaXRlbTogYW55KSA9PiB2b2lkLCBjb21wbGV0ZUNhbGxiYWNrOiAoKGVycm9yOiBFcnJvciwgcmVzb3VyY2U6IGFueVtdLCB1cmxzOiBzdHJpbmdbXSkgPT4gdm9pZCl8bnVsbCk6IHZvaWRcbiAgICAgKiBsb2FkUmVzRGlyKHVybDogc3RyaW5nLCBjb21wbGV0ZUNhbGxiYWNrOiAoZXJyb3I6IEVycm9yLCByZXNvdXJjZTogYW55W10sIHVybHM6IHN0cmluZ1tdKSA9PiB2b2lkKTogdm9pZFxuICAgICAqIGxvYWRSZXNEaXIodXJsOiBzdHJpbmcpOiB2b2lkXG4gICAgICovXG4gICAgbG9hZFJlc0RpciAodXJsLCB0eXBlLCBwcm9ncmVzc0NhbGxiYWNrLCBjb21wbGV0ZUNhbGxiYWNrKSB7XG4gICAgICAgIHZhciB7IHR5cGUsIG9uUHJvZ3Jlc3MsIG9uQ29tcGxldGUgfSA9IHRoaXMuX3BhcnNlTG9hZFJlc0FyZ3ModHlwZSwgcHJvZ3Jlc3NDYWxsYmFjaywgY29tcGxldGVDYWxsYmFjayk7XG4gICAgICAgIGNjLnJlc291cmNlcy5sb2FkRGlyKHVybCwgdHlwZSwgb25Qcm9ncmVzcywgZnVuY3Rpb24gKGVyciwgYXNzZXRzKSB7XG4gICAgICAgICAgICB2YXIgdXJscyA9IFtdO1xuICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5mb3MgPSBjYy5yZXNvdXJjZXMuZ2V0RGlyV2l0aFBhdGgodXJsLCB0eXBlKTtcbiAgICAgICAgICAgICAgICB1cmxzID0gaW5mb3MubWFwKGZ1bmN0aW9uIChpbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbmZvLnBhdGg7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvbkNvbXBsZXRlICYmIG9uQ29tcGxldGUoZXJyLCBhc3NldHMsIHVybHMpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogYGNjLmxvYWRlci5nZXRSZXNgIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2Uge3sjY3Jvc3NMaW5rIFwiQnVuZGxlL2dldDptZXRob2RcIn19e3svY3Jvc3NMaW5rfX0gaW5zdGVhZFxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXRSZXNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3R5cGVdIC0gT25seSBhc3NldCBvZiB0eXBlIHdpbGwgYmUgcmV0dXJuZWQgaWYgdGhpcyBhcmd1bWVudCBpcyBzdXBwbGllZC5cbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKiBAZGVwcmVjYXRlZCBjYy5sb2FkZXIuZ2V0UmVzIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgY2MucmVzb3VyY2VzLmdldCBpbnN0ZWFkXG4gICAgICovXG4gICAgZ2V0UmVzICh1cmwsIHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIGNjLmFzc2V0TWFuYWdlci5hc3NldHMuaGFzKHVybCkgPyBjYy5hc3NldE1hbmFnZXIuYXNzZXRzLmdldCh1cmwpIDogY2MucmVzb3VyY2VzLmdldCh1cmwsIHR5cGUpO1xuICAgIH0sXG5cbiAgICBnZXRSZXNDb3VudCAoKSB7XG4gICAgICAgIHJldHVybiBjYy5hc3NldE1hbmFnZXIuYXNzZXRzLmNvdW50O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBgY2MubG9hZGVyLmdldERlcGVuZHNSZWN1cnNpdmVseWAgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSB1c2Uge3sjY3Jvc3NMaW5rIFwiRGVwZW5kVXRpbC9nZXREZXBzUmVjdXJzaXZlbHk6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IGluc3RlYWRcbiAgICAgKlxuICAgICAqIEBkZXByZWNhdGVkIGNjLmxvYWRlci5nZXREZXBlbmRzUmVjdXJzaXZlbHkgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSB1c2UgY2MuYXNzZXRNYW5hZ2VyLmRlcGVuZFV0aWwuZ2V0RGVwc1JlY3Vyc2l2ZWx5IGluc3RlYWRcbiAgICAgKiBAbWV0aG9kIGdldERlcGVuZHNSZWN1cnNpdmVseVxuICAgICAqIEBwYXJhbSB7QXNzZXR8U3RyaW5nfSBvd25lciAtIFRoZSBvd25lciBhc3NldCBvciB0aGUgcmVzb3VyY2UgdXJsIG9yIHRoZSBhc3NldCdzIHV1aWRcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICovXG4gICAgZ2V0RGVwZW5kc1JlY3Vyc2l2ZWx5IChvd25lcikge1xuICAgICAgICBpZiAoIW93bmVyKSByZXR1cm4gW107XG4gICAgICAgIHJldHVybiBkZXBlbmRVdGlsLmdldERlcHNSZWN1cnNpdmVseSh0eXBlb2Ygb3duZXIgPT09ICdzdHJpbmcnID8gb3duZXIgOiBvd25lci5fdXVpZCkuY29uY2F0KFsgb3duZXIuX3V1aWQgXSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGBjYy5sb2FkZXIuYXNzZXRMb2FkZXJgIHdhcyByZW1vdmVkLCBhc3NldExvYWRlciBhbmQgbWQ1UGlwZSB3ZXJlIG1lcmdlZCBpbnRvIHt7I2Nyb3NzTGluayBcIkFzc2V0TWFuYWdlci90cmFuc2Zvcm1QaXBlbGluZTpwcm9wZXJ0eVwifX17ey9jcm9zc0xpbmt9fVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IGFzc2V0TG9hZGVyXG4gICAgICogQGRlcHJlY2F0ZWQgY2MubG9hZGVyLmFzc2V0TG9hZGVyIHdhcyByZW1vdmVkLCBhc3NldExvYWRlciBhbmQgbWQ1UGlwZSB3ZXJlIG1lcmdlZCBpbnRvIGNjLmFzc2V0TWFuYWdlci50cmFuc2Zvcm1QaXBlbGluZVxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0IGFzc2V0TG9hZGVyICgpIHtcbiAgICAgICAgaWYgKENDX0RFQlVHKSB7XG4gICAgICAgICAgICBjYy5lcnJvcignY2MubG9hZGVyLmFzc2V0TG9hZGVyIHdhcyByZW1vdmVkLCBhc3NldExvYWRlciBhbmQgbWQ1UGlwZSB3ZXJlIG1lcmdlZCBpbnRvIGNjLmFzc2V0TWFuYWdlci50cmFuc2Zvcm1QaXBlbGluZScpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGBjYy5sb2FkZXIubWQ1UGlwZWAgaXMgZGVwcmVjYXRlZCwgYXNzZXRMb2FkZXIgYW5kIG1kNVBpcGUgd2VyZSBtZXJnZWQgaW50byB7eyNjcm9zc0xpbmsgXCJBc3NldE1hbmFnZXIvdHJhbnNmb3JtUGlwZWxpbmU6cHJvcGVydHlcIn19e3svY3Jvc3NMaW5rfX1cbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBtZDVQaXBlXG4gICAgICogQGRlcHJlY2F0ZWQgY2MubG9hZGVyLm1kNVBpcGUgaXMgZGVwcmVjYXRlZCwgYXNzZXRMb2FkZXIgYW5kIG1kNVBpcGUgd2VyZSBtZXJnZWQgaW50byBjYy5hc3NldE1hbmFnZXIudHJhbnNmb3JtUGlwZWxpbmVcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldCBtZDVQaXBlICgpIHtcbiAgICAgICAgcmV0dXJuIG1kNVBpcGU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGBjYy5sb2FkZXIuZG93bmxvYWRlcmAgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSB7eyNjcm9zc0xpbmsgXCJBc3NldE1hbmFnZXIvZG93bmxvYWRlcjpwcm9wZXJ0eVwifX17ey9jcm9zc0xpbmt9fSBpbnN0ZWFkXG4gICAgICpcbiAgICAgKiBAZGVwcmVjYXRlZCBjYy5sb2FkZXIuZG93bmxvYWRlciBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGNjLmFzc2V0TWFuYWdlci5kb3dubG9hZGVyIGluc3RlYWRcbiAgICAgKiBAcHJvcGVydHkgZG93bmxvYWRlclxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0IGRvd25sb2FkZXIgKCkge1xuICAgICAgICByZXR1cm4gY2MuYXNzZXRNYW5hZ2VyLmRvd25sb2FkZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGBjYy5sb2FkZXIubG9hZGVyYCBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIHt7I2Nyb3NzTGluayBcIkFzc2V0TWFuYWdlci9wYXJzZXI6cHJvcGVydHlcIn19e3svY3Jvc3NMaW5rfX0gaW5zdGVhZFxuICAgICAqXG4gICAgICogQHByb3BlcnR5IGxvYWRlclxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQGRlcHJlY2F0ZWQgY2MubG9hZGVyLmxvYWRlciBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGNjLmFzc2V0TWFuYWdlci5wYXJzZXIgaW5zdGVhZFxuICAgICAqL1xuICAgIGdldCBsb2FkZXIgKCkge1xuICAgICAgICByZXR1cm4gY2MuYXNzZXRNYW5hZ2VyLnBhcnNlcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogYGNjLmxvYWRlci5hZGREb3dubG9hZEhhbmRsZXJzYCBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGBjYy5hc3NldE1hbmFnZXIuZG93bmxvYWRlci5yZWdpc3RlcmAgaW5zdGVhZFxuICAgICAqXG4gICAgICogQG1ldGhvZCBhZGREb3dubG9hZEhhbmRsZXJzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGV4dE1hcCBDdXN0b20gc3VwcG9ydGVkIHR5cGVzIHdpdGggY29ycmVzcG9uZGVkIGhhbmRsZXJcbiAgICAgKiBAZGVwcmVjYXRlZCBjYy5sb2FkZXIuYWRkRG93bmxvYWRIYW5kbGVycyBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGNjLmFzc2V0TWFuYWdlci5kb3dubG9hZGVyLnJlZ2lzdGVyIGluc3RlYWRcbiAgICAqL1xuICAgIGFkZERvd25sb2FkSGFuZGxlcnMgKGV4dE1hcCkge1xuICAgICAgICBpZiAoQ0NfREVCVUcpIHtcbiAgICAgICAgICAgIGNjLndhcm4oJ2BjYy5sb2FkZXIuYWRkRG93bmxvYWRIYW5kbGVyc2AgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSBgY2MuYXNzZXRNYW5hZ2VyLmRvd25sb2FkZXIucmVnaXN0ZXJgIGluc3RlYWQnKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaGFuZGxlciA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGZvciAodmFyIHR5cGUgaW4gZXh0TWFwKSB7XG4gICAgICAgICAgICB2YXIgZnVuYyA9IGV4dE1hcFt0eXBlXTtcbiAgICAgICAgICAgIGhhbmRsZXJbJy4nICsgdHlwZV0gPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zLCBvbkNvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgZnVuYyh7dXJsfSwgb25Db21wbGV0ZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNjLmFzc2V0TWFuYWdlci5kb3dubG9hZGVyLnJlZ2lzdGVyKGhhbmRsZXIpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBgY2MubG9hZGVyLmFkZExvYWRIYW5kbGVyc2AgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSBgY2MuYXNzZXRNYW5hZ2VyLnBhcnNlci5yZWdpc3RlcmAgaW5zdGVhZFxuICAgICAqXG4gICAgICogQG1ldGhvZCBhZGRMb2FkSGFuZGxlcnNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZXh0TWFwIEN1c3RvbSBzdXBwb3J0ZWQgdHlwZXMgd2l0aCBjb3JyZXNwb25kZWQgaGFuZGxlclxuICAgICAqIEBkZXByZWNhdGVkIGNjLmxvYWRlci5hZGRMb2FkSGFuZGxlcnMgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSBjYy5hc3NldE1hbmFnZXIucGFyc2VyLnJlZ2lzdGVyIGluc3RlYWRcbiAgICAgKi9cbiAgICBhZGRMb2FkSGFuZGxlcnMgKGV4dE1hcCkge1xuICAgICAgICBpZiAoQ0NfREVCVUcpIHtcbiAgICAgICAgICAgIGNjLndhcm4oJ2BjYy5sb2FkZXIuYWRkTG9hZEhhbmRsZXJzYCBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGBjYy5hc3NldE1hbmFnZXIucGFyc2VyLnJlZ2lzdGVyYCBpbnN0ZWFkJyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGhhbmRsZXIgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICBmb3IgKHZhciB0eXBlIGluIGV4dE1hcCkge1xuICAgICAgICAgICAgdmFyIGZ1bmMgPSBleHRNYXBbdHlwZV07XG4gICAgICAgICAgICBoYW5kbGVyWycuJyArIHR5cGVdID0gZnVuY3Rpb24gKGZpbGUsIG9wdGlvbnMsIG9uQ29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICBmdW5jKHtjb250ZW50OiBmaWxlfSwgb25Db21wbGV0ZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNjLmFzc2V0TWFuYWdlci5wYXJzZXIucmVnaXN0ZXIoaGFuZGxlcik7XG4gICAgfSxcblxuICAgIGZsb3dJbkRlcHMgKCkge1xuICAgICAgICBpZiAoQ0NfREVCVUcpIHtcbiAgICAgICAgICAgIGNjLmVycm9yKCdjYy5sb2FkZXIuZmxvd0luRGVwcyB3YXMgcmVtb3ZlZCcpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGBjYy5sb2FkZXIucmVsZWFzZWAgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSB7eyNjcm9zc0xpbmsgXCJBc3NldE1hbmFnZXIvcmVsZWFzZUFzc2V0Om1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSBpbnN0ZWFkXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJlbGVhc2VcbiAgICAgKiBAcGFyYW0ge0Fzc2V0fFN0cmluZ3xBcnJheX0gYXNzZXRcbiAgICAgKiBAZGVwcmVjYXRlZCBjYy5sb2FkZXIucmVsZWFzZSBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGNjLmFzc2V0TWFuYWdlci5yZWxlYXNlQXNzZXQgaW5zdGVhZFxuICAgICAqL1xuICAgIHJlbGVhc2UgKGFzc2V0KSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGFzc2V0KSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhc3NldC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBhc3NldFtpXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycpIGtleSA9IGNjLmFzc2V0TWFuYWdlci5hc3NldHMuZ2V0KGtleSk7XG4gICAgICAgICAgICAgICAgbGV0IGlzQnVpbHRpbiA9IGNjLmFzc2V0TWFuYWdlci5idWlsdGlucy5fYXNzZXRzLmZpbmQoZnVuY3Rpb24gKGFzc2V0cykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXNzZXRzLmZpbmQoYnVpbHRpbkFzc2V0ID0+IGJ1aWx0aW5Bc3NldCA9PT0ga2V5KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoaXNCdWlsdGluKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYy5hc3NldE1hbmFnZXIucmVsZWFzZUFzc2V0KGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYXNzZXQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXNzZXQgPT09ICdzdHJpbmcnKSBhc3NldCA9IGNjLmFzc2V0TWFuYWdlci5hc3NldHMuZ2V0KGFzc2V0KTtcbiAgICAgICAgICAgIGxldCBpc0J1aWx0aW4gPSBjYy5hc3NldE1hbmFnZXIuYnVpbHRpbnMuX2Fzc2V0cy5maW5kKGZ1bmN0aW9uIChhc3NldHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXNzZXRzLmZpbmQoYnVpbHRpbkFzc2V0ID0+IGJ1aWx0aW5Bc3NldCA9PT0gYXNzZXQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoaXNCdWlsdGluKSByZXR1cm47XG4gICAgICAgICAgICBjYy5hc3NldE1hbmFnZXIucmVsZWFzZUFzc2V0KGFzc2V0KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBgY2MubG9hZGVyLnJlbGVhc2VBc3NldGAgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSB7eyNjcm9zc0xpbmsgXCJBc3NldE1hbmFnZXIvcmVsZWFzZUFzc2V0Om1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSBpbnN0ZWFkXG4gICAgICpcbiAgICAgKiBAZGVwcmVjYXRlZCBjYy5sb2FkZXIucmVsZWFzZUFzc2V0IGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgY2MuYXNzZXRNYW5hZ2VyLnJlbGVhc2VBc3NldCBpbnN0ZWFkXG4gICAgICogQG1ldGhvZCByZWxlYXNlQXNzZXRcbiAgICAgKiBAcGFyYW0ge0Fzc2V0fSBhc3NldFxuICAgICAqL1xuICAgIHJlbGVhc2VBc3NldCAoYXNzZXQpIHtcbiAgICAgICAgY2MuYXNzZXRNYW5hZ2VyLnJlbGVhc2VBc3NldChhc3NldCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGBjYy5sb2FkZXIucmVsZWFzZVJlc2AgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSB7eyNjcm9zc0xpbmsgXCJBc3NldE1hbmFnZXIvcmVsZWFzZVJlczptZXRob2RcIn19e3svY3Jvc3NMaW5rfX0gaW5zdGVhZFxuICAgICAqXG4gICAgICogQGRlcHJlY2F0ZWQgY2MubG9hZGVyLnJlbGVhc2VSZXMgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSBjYy5hc3NldE1hbmFnZXIucmVsZWFzZVJlcyBpbnN0ZWFkXG4gICAgICogQG1ldGhvZCByZWxlYXNlUmVzXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFt0eXBlXSAtIE9ubHkgYXNzZXQgb2YgdHlwZSB3aWxsIGJlIHJlbGVhc2VkIGlmIHRoaXMgYXJndW1lbnQgaXMgc3VwcGxpZWQuXG4gICAgICovXG4gICAgcmVsZWFzZVJlcyAodXJsLCB0eXBlKSB7XG4gICAgICAgIGNjLnJlc291cmNlcy5yZWxlYXNlKHVybCwgdHlwZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGBjYy5sb2FkZXIucmVsZWFzZVJlc0RpcmAgd2FzIHJlbW92ZWQsIHBsZWFzZSB1c2Uge3sjY3Jvc3NMaW5rIFwiQXNzZXRNYW5hZ2VyL3JlbGVhc2VSZXM6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IGluc3RlYWRcbiAgICAgKlxuICAgICAqIEBkZXByZWNhdGVkIGNjLmxvYWRlci5yZWxlYXNlUmVzRGlyIHdhcyByZW1vdmVkLCBwbGVhc2UgdXNlIGNjLmFzc2V0TWFuYWdlci5yZWxlYXNlUmVzIGluc3RlYWRcbiAgICAgKiBAbWV0aG9kIHJlbGVhc2VSZXNEaXJcbiAgICAgKi9cbiAgICByZWxlYXNlUmVzRGlyICgpIHtcbiAgICAgICAgaWYgKENDX0RFQlVHKSB7XG4gICAgICAgICAgICBjYy5lcnJvcignY2MubG9hZGVyLnJlbGVhc2VSZXNEaXIgd2FzIHJlbW92ZWQsIHBsZWFzZSB1c2UgY2MuYXNzZXRNYW5hZ2VyLnJlbGVhc2VBc3NldCBpbnN0ZWFkJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogYGNjLmxvYWRlci5yZWxlYXNlQWxsYCBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIHt7I2Nyb3NzTGluayBcIkFzc2V0TWFuYWdlci9yZWxlYXNlQWxsOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSBpbnN0ZWFkXG4gICAgICpcbiAgICAgKiBAZGVwcmVjYXRlZCBjYy5sb2FkZXIucmVsZWFzZUFsbCBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGNjLmFzc2V0TWFuYWdlci5yZWxlYXNlQWxsIGluc3RlYWRcbiAgICAgKiBAbWV0aG9kIHJlbGVhc2VBbGxcbiAgICAgKi9cbiAgICByZWxlYXNlQWxsICgpIHtcbiAgICAgICAgY2MuYXNzZXRNYW5hZ2VyLnJlbGVhc2VBbGwoKTtcbiAgICAgICAgY2MuYXNzZXRNYW5hZ2VyLmFzc2V0cy5jbGVhcigpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBgY2MubG9hZGVyLnJlbW92ZUl0ZW1gIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgYGNjLmFzc2V0TWFuYWdlci5hc3NldHMucmVtb3ZlYCBpbnN0ZWFkXG4gICAgICpcbiAgICAgKiBAZGVwcmVjYXRlZCBjYy5sb2FkZXIucmVtb3ZlSXRlbSBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGNjLmFzc2V0TWFuYWdlci5hc3NldHMucmVtb3ZlIGluc3RlYWRcbiAgICAgKiBAbWV0aG9kIHJlbW92ZUl0ZW1cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaWQgVGhlIGlkIG9mIHRoZSBpdGVtXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gc3VjY2VlZCBvciBub3RcbiAgICAgKi9cbiAgICByZW1vdmVJdGVtIChrZXkpIHtcbiAgICAgICAgY2MuYXNzZXRNYW5hZ2VyLmFzc2V0cy5yZW1vdmUoa2V5KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogYGNjLmxvYWRlci5zZXRBdXRvUmVsZWFzZWAgaXMgZGVwcmVjYXRlZCwgaWYgeW91IHdhbnQgdG8gcHJldmVudCBzb21lIGFzc2V0IGZyb20gYXV0byByZWxlYXNpbmcsIHBsZWFzZSB1c2Uge3sjY3Jvc3NMaW5rIFwiQXNzZXQvYWRkUmVmOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSBpbnN0ZWFkXG4gICAgICpcbiAgICAgKiBAZGVwcmVjYXRlZCBjYy5sb2FkZXIuc2V0QXV0b1JlbGVhc2UgaXMgZGVwcmVjYXRlZCwgaWYgeW91IHdhbnQgdG8gcHJldmVudCBzb21lIGFzc2V0IGZyb20gYXV0byByZWxlYXNpbmcsIHBsZWFzZSB1c2UgY2MuQXNzZXQuYWRkUmVmIGluc3RlYWRcbiAgICAgKiBAbWV0aG9kIHNldEF1dG9SZWxlYXNlXG4gICAgICogQHBhcmFtIHtBc3NldHxTdHJpbmd9IGFzc2V0T3JVcmxPclV1aWQgLSBhc3NldCBvYmplY3Qgb3IgdGhlIHJhdyBhc3NldCdzIHVybCBvciB1dWlkXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBhdXRvUmVsZWFzZSAtIGluZGljYXRlcyB3aGV0aGVyIHNob3VsZCByZWxlYXNlIGF1dG9tYXRpY2FsbHlcbiAgICAgKi9cbiAgICBzZXRBdXRvUmVsZWFzZSAoYXNzZXQsIGF1dG9SZWxlYXNlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYXNzZXQgPT09ICdvYmplY3QnKSBhc3NldCA9IGFzc2V0Ll91dWlkO1xuICAgICAgICB0aGlzLl9hdXRvUmVsZWFzZVNldHRpbmdbYXNzZXRdID0gISFhdXRvUmVsZWFzZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogYGNjLmxvYWRlci5zZXRBdXRvUmVsZWFzZVJlY3Vyc2l2ZWx5YCBpcyBkZXByZWNhdGVkLCBpZiB5b3Ugd2FudCB0byBwcmV2ZW50IHNvbWUgYXNzZXQgZnJvbSBhdXRvIHJlbGVhc2luZywgcGxlYXNlIHVzZSB7eyNjcm9zc0xpbmsgXCJBc3NldC9hZGRSZWY6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IGluc3RlYWRcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgc2V0QXV0b1JlbGVhc2VSZWN1cnNpdmVseVxuICAgICAqIEBwYXJhbSB7QXNzZXR8U3RyaW5nfSBhc3NldE9yVXJsT3JVdWlkIC0gYXNzZXQgb2JqZWN0IG9yIHRoZSByYXcgYXNzZXQncyB1cmwgb3IgdXVpZFxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gYXV0b1JlbGVhc2UgLSBpbmRpY2F0ZXMgd2hldGhlciBzaG91bGQgcmVsZWFzZSBhdXRvbWF0aWNhbGx5XG4gICAgICogQGRlcHJlY2F0ZWQgY2MubG9hZGVyLnNldEF1dG9SZWxlYXNlUmVjdXJzaXZlbHkgaXMgZGVwcmVjYXRlZCwgaWYgeW91IHdhbnQgdG8gcHJldmVudCBzb21lIGFzc2V0IGZyb20gYXV0byByZWxlYXNpbmcsIHBsZWFzZSB1c2UgY2MuQXNzZXQuYWRkUmVmIGluc3RlYWRcbiAgICAgKi9cbiAgICBzZXRBdXRvUmVsZWFzZVJlY3Vyc2l2ZWx5IChhc3NldCwgYXV0b1JlbGVhc2UpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhc3NldCA9PT0gJ29iamVjdCcpIGFzc2V0ID0gYXNzZXQuX3V1aWQ7XG4gICAgICAgIGF1dG9SZWxlYXNlID0gISFhdXRvUmVsZWFzZTtcbiAgICAgICAgdGhpcy5fYXV0b1JlbGVhc2VTZXR0aW5nW2Fzc2V0XSA9IGF1dG9SZWxlYXNlO1xuICAgICAgICB2YXIgZGVwZW5kcyA9IGRlcGVuZFV0aWwuZ2V0RGVwc1JlY3Vyc2l2ZWx5KGFzc2V0KTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkZXBlbmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZGVwZW5kID0gZGVwZW5kc1tpXTtcbiAgICAgICAgICAgIHRoaXMuX2F1dG9SZWxlYXNlU2V0dGluZ1tkZXBlbmRdID0gYXV0b1JlbGVhc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogYGNjLmxvYWRlci5pc0F1dG9SZWxlYXNlYCBpcyBkZXByZWNhdGVkXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGlzQXV0b1JlbGVhc2VcbiAgICAgKiBAcGFyYW0ge0Fzc2V0fFN0cmluZ30gYXNzZXRPclVybCAtIGFzc2V0IG9iamVjdCBvciB0aGUgcmF3IGFzc2V0J3MgdXJsXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICogQGRlcHJlY2F0ZWQgY2MubG9hZGVyLmlzQXV0b1JlbGVhc2UgaXMgZGVwcmVjYXRlZFxuICAgICAqL1xuICAgIGlzQXV0b1JlbGVhc2UgKGFzc2V0KSB7XG4gICAgICAgIGlmICh0eXBlb2YgYXNzZXQgPT09ICdvYmplY3QnKSBhc3NldCA9IGFzc2V0Ll91dWlkO1xuICAgICAgICByZXR1cm4gISF0aGlzLl9hdXRvUmVsZWFzZVNldHRpbmdbYXNzZXRdO1xuICAgIH1cbn07XG5cbi8qKlxuICogQGNsYXNzIERvd25sb2FkZXJcbiAqL1xuLyoqXG4gKiBgY2MubG9hZGVyLmRvd25sb2FkZXIubG9hZFN1YnBhY2thZ2VgIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2Uge3sjY3Jvc3NMaW5rIFwiQXNzZXRNYW5hZ2VyL2xvYWRCdW5kbGU6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IGluc3RlYWRcbiAqXG4gKiBAZGVwcmVjYXRlZCBjYy5sb2FkZXIuZG93bmxvYWRlci5sb2FkU3VicGFja2FnZSBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIEFzc2V0TWFuYWdlci5sb2FkQnVuZGxlIGluc3RlYWRcbiAqIEBtZXRob2QgbG9hZFN1YnBhY2thZ2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gU3VicGFja2FnZSBuYW1lXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY29tcGxldGVDYWxsYmFja10gLSAgQ2FsbGJhY2sgaW52b2tlZCB3aGVuIHN1YnBhY2thZ2UgbG9hZGVkXG4gKiBAcGFyYW0ge0Vycm9yfSBjb21wbGV0ZUNhbGxiYWNrLmVycm9yIC0gZXJyb3IgaW5mb3JtYXRpb25cbiAqL1xuZG93bmxvYWRlci5sb2FkU3VicGFja2FnZSA9IGZ1bmN0aW9uIChuYW1lLCBjb21wbGV0ZUNhbGxiYWNrKSB7XG4gICAgY2MuYXNzZXRNYW5hZ2VyLmxvYWRCdW5kbGUobmFtZSwgbnVsbCwgY29tcGxldGVDYWxsYmFjayk7XG59O1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIGNjLkFzc2V0TGlicmFyeSBpcyBkZXByZWNhdGVkLCBwbGVhc2UgYmFja3VwIHlvdXIgcHJvamVjdCBhbmQgdXBncmFkZSB0byBjYy5hc3NldE1hbmFnZXJcbiAqL1xudmFyIEFzc2V0TGlicmFyeSA9IHtcblxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIGNjLkFzc2V0TGlicmFyeS5pbml0IGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgY2MuYXNzZXRNYW5hZ2VyLmluaXQgaW5zdGVhZFxuICAgICAqL1xuICAgIGluaXQgKG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucy5pbXBvcnRCYXNlID0gb3B0aW9ucy5saWJyYXJ5UGF0aDtcbiAgICAgICAgb3B0aW9ucy5uYXRpdmVCYXNlID0gQ0NfQlVJTEQgPyBvcHRpb25zLnJhd0Fzc2V0c0Jhc2UgOiBvcHRpb25zLmxpYnJhcnlQYXRoO1xuICAgICAgICBjYy5hc3NldE1hbmFnZXIuaW5pdChvcHRpb25zKTtcbiAgICAgICAgaWYgKG9wdGlvbnMucmF3QXNzZXRzKSB7XG4gICAgICAgICAgICB2YXIgcmVzb3VyY2VzID0gbmV3IGNjLkFzc2V0TWFuYWdlci5CdW5kbGUoKTtcbiAgICAgICAgICAgIHJlc291cmNlcy5pbml0KHtcbiAgICAgICAgICAgICAgICBuYW1lOiBjYy5Bc3NldE1hbmFnZXIuQnVpbHRpbkJ1bmRsZU5hbWUuUkVTT1VSQ0VTLFxuICAgICAgICAgICAgICAgIGltcG9ydEJhc2U6IG9wdGlvbnMuaW1wb3J0QmFzZSxcbiAgICAgICAgICAgICAgICBuYXRpdmVCYXNlOiBvcHRpb25zLm5hdGl2ZUJhc2UsXG4gICAgICAgICAgICAgICAgcGF0aHM6IG9wdGlvbnMucmF3QXNzZXRzLmFzc2V0cyxcbiAgICAgICAgICAgICAgICB1dWlkczogT2JqZWN0LmtleXMob3B0aW9ucy5yYXdBc3NldHMuYXNzZXRzKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIGNjLkFzc2V0TGlicmFyeSBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGNjLmFzc2V0TWFuYWdlci5sb2FkQW55IGluc3RlYWRcbiAgICAgKi9cbiAgICBsb2FkQXNzZXQgKHV1aWQsIG9uQ29tcGxldGUpIHtcbiAgICAgICAgY2MuYXNzZXRNYW5hZ2VyLmxvYWRBbnkodXVpZCwgb25Db21wbGV0ZSk7XG4gICAgfSxcblxuICAgIGdldExpYlVybE5vRXh0ICgpIHtcbiAgICAgICAgaWYgKENDX0RFQlVHKSB7XG4gICAgICAgICAgICBjYy5lcnJvcignY2MuQXNzZXRMaWJyYXJ5LmdldExpYlVybE5vRXh0IHdhcyByZW1vdmVkLCBpZiB5b3Ugd2FudCB0byB0cmFuc2Zvcm0gdXJsLCBwbGVhc2UgdXNlIGNjLmFzc2V0TWFuYWdlci51dGlscy5nZXRVcmxXaXRoVXVpZCBpbnN0ZWFkJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcXVlcnlBc3NldEluZm8gKCkge1xuICAgICAgICBpZiAoQ0NfREVCVUcpIHtcbiAgICAgICAgICAgIGNjLmVycm9yKCdjYy5Bc3NldExpYnJhcnkucXVlcnlBc3NldEluZm8gd2FzIHJlbW92ZWQsIG9ubHkgYXZhaWxhYmxlIGluIHRoZSBlZGl0b3IgYnkgdXNpbmcgY2MuYXNzZXRNYW5hZ2VyLmVkaXRvckV4dGVuZC5xdWVyeUFzc2V0SW5mbycpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiBgY2MudXJsYCBpcyBkZXByZWNhdGVkXG4gKlxuICogQGRlcHJlY2F0ZWQgY2MudXJsIGlzIGRlcHJlY2F0ZWRcbiAqIEBjbGFzcyB1cmxcbiAqIEBzdGF0aWNcbiAqL1xuY2MudXJsID0ge1xuICAgIG5vcm1hbGl6ZSAodXJsKSB7XG4gICAgICAgIGNjLndhcm5JRCgxNDAwLCAnY2MudXJsLm5vcm1hbGl6ZScsICdjYy5hc3NldE1hbmFnZXIudXRpbHMubm9ybWFsaXplJyk7XG4gICAgICAgIHJldHVybiBjYy5hc3NldE1hbmFnZXIudXRpbHMubm9ybWFsaXplKHVybCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGBjYy51cmwucmF3YCBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGBjYy5yZXNvdXJjZXMubG9hZGAgZGlyZWN0bHksIG9yIHVzZSBgQXNzZXQubmF0aXZlVXJsYCBpbnN0ZWFkLlxuICAgICAqXG4gICAgICogQGRlcHJlY2F0ZWQgY2MudXJsLnJhdyBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGNjLnJlc291cmNlcy5sb2FkIGRpcmVjdGx5LCBvciB1c2UgQXNzZXQubmF0aXZlVXJsIGluc3RlYWQuXG4gICAgICogQG1ldGhvZCByYXdcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuICAgIHJhdyAodXJsKSB7XG4gICAgICAgIGNjLndhcm5JRCgxNDAwLCAnY2MudXJsLnJhdycsICdjYy5yZXNvdXJjZXMubG9hZCcpO1xuICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgoJ3Jlc291cmNlcy8nKSkge1xuICAgICAgICAgICAgcmV0dXJuIGNjLmFzc2V0TWFuYWdlci5fdHJhbnNmb3JtKHsncGF0aCc6IGNjLnBhdGguY2hhbmdlRXh0bmFtZSh1cmwuc3Vic3RyKDEwKSksIGJ1bmRsZTogY2MuQXNzZXRNYW5hZ2VyLkJ1aWx0aW5CdW5kbGVOYW1lLlJFU09VUkNFUywgX19pc05hdGl2ZV9fOiB0cnVlLCBleHQ6IGNjLnBhdGguZXh0bmFtZSh1cmwpfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbn07XG5cbmxldCBvbmNlV2FybnMgPSB7XG4gICAgbG9hZGVyOiB0cnVlLFxuICAgIGFzc2V0TGlicmFyeTogdHJ1ZSxcbn07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGNjLCB7XG4gICAgbG9hZGVyOiB7XG4gICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICBpZiAoQ0NfREVCVUcpIHtcbiAgICAgICAgICAgICAgICBpZiAob25jZVdhcm5zLmxvYWRlcikge1xuICAgICAgICAgICAgICAgICAgICBvbmNlV2FybnMubG9hZGVyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZygnY2MubG9hZGVyIGlzIGRlcHJlY2F0ZWQsIHVzZSBjYy5hc3NldE1hbmFnZXIgaW5zdGVhZCBwbGVhc2UuIFNlZSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL3poL3JlbGVhc2Utbm90ZXMvYXNzZXQtbWFuYWdlci11cGdyYWRlLWd1aWRlLmh0bWwnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbG9hZGVyO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIEFzc2V0TGlicmFyeToge1xuICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgaWYgKENDX0RFQlVHKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9uY2VXYXJucy5hc3NldExpYnJhcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgb25jZVdhcm5zLmFzc2V0TGlicmFyeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjYy5sb2coJ2NjLkFzc2V0TGlicmFyeSBpcyBkZXByZWNhdGVkLCB1c2UgY2MuYXNzZXRNYW5hZ2VyIGluc3RlYWQgcGxlYXNlLiBTZWUgaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC96aC9yZWxlYXNlLW5vdGVzL2Fzc2V0LW1hbmFnZXItdXBncmFkZS1ndWlkZS5odG1sJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIEFzc2V0TGlicmFyeTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBgY2MuTG9hZGluZ0l0ZW1zYCB3YXMgcmVtb3ZlZCwgcGxlYXNlIHVzZSB7eyNjcm9zc0xpbmsgXCJUYXNrXCJ9fXt7L2Nyb3NzTGlua319IGluc3RlYWRcbiAgICAgKlxuICAgICAqIEBkZXByZWNhdGVkIGNjLkxvYWRpbmdJdGVtcyB3YXMgcmVtb3ZlZCwgcGxlYXNlIHVzZSBjYy5Bc3NldE1hbmFnZXIuVGFzayBpbnN0ZWFkXG4gICAgICogQGNsYXNzIExvYWRpbmdJdGVtc1xuICAgICAqL1xuICAgIExvYWRpbmdJdGVtczoge1xuICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgY2Mud2FybklEKDE0MDAsICdjYy5Mb2FkaW5nSXRlbXMnLCAnY2MuQXNzZXRNYW5hZ2VyLlRhc2snKTtcbiAgICAgICAgICAgIHJldHVybiBjYy5Bc3NldE1hbmFnZXIuVGFzaztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBQaXBlbGluZToge1xuICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgY2Mud2FybklEKDE0MDAsICdjYy5QaXBlbGluZScsICdjYy5Bc3NldE1hbmFnZXIuUGlwZWxpbmUnKTtcbiAgICAgICAgICAgIHJldHVybiBjYy5Bc3NldE1hbmFnZXIuUGlwZWxpbmU7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuanMub2Jzb2xldGUoY2MsICdjYy5SYXdBc3NldCcsICdjYy5Bc3NldCcpO1xuXG4vKipcbiAqIEBjbGFzcyBBc3NldFxuICovXG4vKipcbiAqIGBjYy5Bc3NldC51cmxgIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2Uge3sjY3Jvc3NMaW5rIFwiQXNzZXQvbmF0aXZlVXJsOnByb3BlcnR5XCJ9fXt7L2Nyb3NzTGlua319IGluc3RlYWRcbiAqIEBwcm9wZXJ0eSB1cmxcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAZGVwcmVjYXRlZCBjYy5Bc3NldC51cmwgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSBjYy5Bc3NldC5uYXRpdmVVcmwgaW5zdGVhZFxuICovXG5qcy5vYnNvbGV0ZShjYy5Bc3NldC5wcm90b3R5cGUsICdjYy5Bc3NldC51cmwnLCAnbmF0aXZlVXJsJyk7XG5cbi8qKlxuICogQGNsYXNzIG1hY3JvXG4gKiBAc3RhdGljXG4gKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGNjLm1hY3JvLCB7XG4gICAgLyoqXG4gICAgICogYGNjLm1hY3JvLkRPV05MT0FEX01BWF9DT05DVVJSRU5UYCBpcyBkZXByZWNhdGVkIG5vdywgcGxlYXNlIHVzZSB7eyNjcm9zc0xpbmsgXCJEb3dubG9hZGVyL21heENvbmN1cnJlbmN5OnByb3BlcnR5XCJ9fXt7L2Nyb3NzTGlua319IGluc3RlYWRcbiAgICAgKiBcbiAgICAgKiBAcHJvcGVydHkgRE9XTkxPQURfTUFYX0NPTkNVUlJFTlRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBkZXByZWNhdGVkIGNjLm1hY3JvLkRPV05MT0FEX01BWF9DT05DVVJSRU5UIGlzIGRlcHJlY2F0ZWQgbm93LCBwbGVhc2UgdXNlIGNjLmFzc2V0TWFuYWdlci5kb3dubG9hZGVyLm1heENvbmN1cnJlbmN5IGluc3RlYWRcbiAgICAgKi9cbiAgICBET1dOTE9BRF9NQVhfQ09OQ1VSUkVOVDoge1xuICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNjLmFzc2V0TWFuYWdlci5kb3dubG9hZGVyLm1heENvbmN1cnJlbmN5O1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldCAodmFsKSB7XG4gICAgICAgICAgICBjYy5hc3NldE1hbmFnZXIuZG93bmxvYWRlci5tYXhDb25jdXJyZW5jeSA9IHZhbDtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5PYmplY3QuYXNzaWduKGNjLmRpcmVjdG9yLCB7XG4gICAgX2dldFNjZW5lVXVpZCAoc2NlbmVOYW1lKSB7XG4gICAgICAgIGNjLmFzc2V0TWFuYWdlci5tYWluLmdldFNjZW5lSW5mbyhzY2VuZU5hbWUpO1xuICAgIH1cbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhjYy5nYW1lLCB7XG4gICAgX3NjZW5lSW5mb3M6IHtcbiAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgIHZhciBzY2VuZXMgPSBbXTtcbiAgICAgICAgICAgIGNjLmFzc2V0TWFuYWdlci5tYWluLl9jb25maWcuc2NlbmVzLmZvckVhY2goZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgIHNjZW5lcy5wdXNoKHZhbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBzY2VuZXM7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxudmFyIHBhcnNlUGFyYW1ldGVycyA9IHV0aWxpdGllcy5wYXJzZVBhcmFtZXRlcnM7XG51dGlsaXRpZXMucGFyc2VQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKG9wdGlvbnMsIG9uUHJvZ3Jlc3MsIG9uQ29tcGxldGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gcGFyc2VQYXJhbWV0ZXJzKG9wdGlvbnMsIG9uUHJvZ3Jlc3MsIG9uQ29tcGxldGUpO1xuICAgIHJlc3VsdC5vblByb2dyZXNzID0gcmVzdWx0Lm9uUHJvZ3Jlc3MgfHwgbG9hZGVyLm9uUHJvZ3Jlc3M7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnZhciBhdXRvUmVsZWFzZSA9IHJlbGVhc2VNYW5hZ2VyLl9hdXRvUmVsZWFzZTtcbnJlbGVhc2VNYW5hZ2VyLl9hdXRvUmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBhdXRvUmVsZWFzZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciByZWxlYXNlU2V0dGluZ3MgPSBsb2FkZXIuX2F1dG9SZWxlYXNlU2V0dGluZztcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHJlbGVhc2VTZXR0aW5ncyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBrZXkgPSBrZXlzW2ldO1xuICAgICAgICBpZiAocmVsZWFzZVNldHRpbmdzW2tleV0gPT09IHRydWUpIHtcbiAgICAgICAgICAgIHZhciBhc3NldCA9IGNjLmFzc2V0TWFuYWdlci5hc3NldHMuZ2V0KGtleSk7XG4gICAgICAgICAgICBhc3NldCAmJiByZWxlYXNlTWFuYWdlci50cnlSZWxlYXNlKGFzc2V0KTtcbiAgICAgICAgfVxuICAgIH1cbn07Il0sInNvdXJjZVJvb3QiOiIvIn0=