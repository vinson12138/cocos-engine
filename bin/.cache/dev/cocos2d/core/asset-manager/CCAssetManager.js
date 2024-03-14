
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/asset-manager/CCAssetManager.js';
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
var preprocess = require('./preprocess');

var fetch = require('./fetch');

var Cache = require('./cache');

var helper = require('./helper');

var releaseManager = require('./releaseManager');

var dependUtil = require('./depend-util');

var load = require('./load');

var Pipeline = require('./pipeline');

var Task = require('./task');

var RequestItem = require('./request-item');

var downloader = require('./downloader');

var parser = require('./parser');

var packManager = require('./pack-manager');

var Bundle = require('./bundle');

var builtins = require('./builtins');

var factory = require('./factory');

var _require = require('./urlTransformer'),
    parse = _require.parse,
    combine = _require.combine;

var _require2 = require('./utilities'),
    parseParameters = _require2.parseParameters,
    asyncify = _require2.asyncify;

var _require3 = require('./shared'),
    assets = _require3.assets,
    files = _require3.files,
    parsed = _require3.parsed,
    pipeline = _require3.pipeline,
    transformPipeline = _require3.transformPipeline,
    fetchPipeline = _require3.fetchPipeline,
    RequestType = _require3.RequestType,
    bundles = _require3.bundles,
    BuiltinBundleName = _require3.BuiltinBundleName;
/**
 * @module cc
 */

/**
 * !#en
 * This module controls asset's behaviors and information, include loading, releasing etc. it is a singleton
 * All member can be accessed with `cc.assetManager`.
 * 
 * !#zh
 * 此模块管理资源的行为和信息，包括加载，释放等，这是一个单例，所有成员能够通过 `cc.assetManager` 调用
 * 
 * @class AssetManager
 */


function AssetManager() {
  this._preprocessPipe = preprocess;
  this._fetchPipe = fetch;
  this._loadPipe = load;
  /**
   * !#en 
   * Normal loading pipeline
   * 
   * !#zh
   * 正常加载管线
   * 
   * @property pipeline
   * @type {Pipeline}
   */

  this.pipeline = pipeline.append(preprocess).append(load);
  /**
   * !#en 
   * Fetching pipeline
   * 
   * !#zh
   * 下载管线
   * 
   * @property fetchPipeline
   * @type {Pipeline}
   */

  this.fetchPipeline = fetchPipeline.append(preprocess).append(fetch);
  /**
   * !#en 
   * Url transformer
   * 
   * !#zh
   * Url 转换器
   * 
   * @property transformPipeline
   * @type {Pipeline}
   */

  this.transformPipeline = transformPipeline.append(parse).append(combine);
  /**
   * !#en 
   * The collection of bundle which is already loaded, you can remove cache with {{#crossLink "AssetManager/removeBundle:method"}}{{/crossLink}}
   * 
   * !#zh
   * 已加载 bundle 的集合， 你能通过 {{#crossLink "AssetManager/removeBundle:method"}}{{/crossLink}} 来移除缓存
   * 
   * @property bundles
   * @type {Cache}
   * @typescript
   * bundles: AssetManager.Cache<AssetManager.Bundle>
   */

  this.bundles = bundles;
  /**
   * !#en 
   * The collection of asset which is already loaded, you can remove cache with {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}}
   * 
   * !#zh
   * 已加载资源的集合， 你能通过 {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}} 来移除缓存
   * 
   * @property assets
   * @type {Cache}
   * @typescript
   * assets: AssetManager.Cache<cc.Asset>
   */

  this.assets = assets;
  this._files = files;
  this._parsed = parsed;
  this.generalImportBase = '';
  this.generalNativeBase = '';
  /**
   * !#en 
   * Manage relationship between asset and its dependencies
   * 
   * !#zh
   * 管理资源依赖关系
   * 
   * @property dependUtil
   * @type {DependUtil}
   */

  this.dependUtil = dependUtil;
  this._releaseManager = releaseManager;
  /**
   * !#en 
   * Whether or not cache the loaded asset
   * 
   * !#zh
   * 是否缓存已加载的资源
   * 
   * @property cacheAsset
   * @type {boolean}
   */

  this.cacheAsset = true;
  /**
   * !#en 
   * Whether or not load asset forcely, if it is true, asset will be loaded regardless of error
   * 
   * !#zh
   * 是否强制加载资源, 如果为 true ，加载资源将会忽略报错
   * 
   * @property force
   * @type {boolean}
   */

  this.force = false;
  /**
   * !#en 
   * Some useful function
   * 
   * !#zh
   * 一些有用的方法
   * 
   * @property utils
   * @type {Helper}
   */

  this.utils = helper;
  /**
   * !#en 
   * Manage all downloading task
   * 
   * !#zh
   * 管理所有下载任务
   * 
   * @property downloader
   * @type {Downloader}
   */

  this.downloader = downloader;
  /**
   * !#en 
   * Manage all parsing task
   * 
   * !#zh
   * 管理所有解析任务
   * 
   * @property parser
   * @type {Parser}
   */

  this.parser = parser;
  /**
   * !#en 
   * Manage internal asset
   * 
   * !#zh
   * 管理内置资源
   * 
   * @property builtins
   * @type {Builtins}
   */

  this.builtins = builtins;
  /**
   * !#en 
   * Manage all packed asset
   * 
   * !#zh
   * 管理所有合并后的资源
   * 
   * @property packManager
   * @type {PackManager}
   */

  this.packManager = packManager;
  this.factory = factory;
  /**
   * !#en 
   * Cache manager is a module which controls all caches downloaded from server in non-web platform.
   * 
   * !#zh
   * 缓存管理器是一个模块，在非 WEB 平台上，用于管理所有从服务器上下载下来的缓存
   * 
   * @property cacheManager
   * @type {cc.AssetManager.CacheManager}
   * @typescript
   * cacheManager: cc.AssetManager.CacheManager|null
   */

  this.cacheManager = null;
  /**
   * !#en 
   * The preset of options
   * 
   * !#zh
   * 可选参数的预设集
   * 
   * @property presets
   * @type {Object}
   * @typescript
   * presets: Record<string, Record<string, any>>
   */

  this.presets = {
    'default': {
      priority: 0
    },
    'preload': {
      maxConcurrency: 2,
      maxRequestsPerFrame: 2,
      priority: -1
    },
    'scene': {
      maxConcurrency: 8,
      maxRequestsPerFrame: 8,
      priority: 1
    },
    'bundle': {
      maxConcurrency: 8,
      maxRequestsPerFrame: 8,
      priority: 2
    },
    'remote': {
      maxRetryCount: 4
    },
    'script': {
      maxConcurrency: 1024,
      maxRequestsPerFrame: 1024,
      priority: 2
    }
  };
}

AssetManager.Pipeline = Pipeline;
AssetManager.Task = Task;
AssetManager.Cache = Cache;
AssetManager.RequestItem = RequestItem;
AssetManager.Bundle = Bundle;
AssetManager.BuiltinBundleName = BuiltinBundleName;
AssetManager.prototype = {
  constructor: AssetManager,

  /**
   * !#en 
   * The builtin 'main' bundle
   * 
   * !#zh
   * 内置 main 包
   * 
   * @property main
   * @readonly
   * @type {Bundle}
   */
  get main() {
    return bundles.get(BuiltinBundleName.MAIN);
  },

  /**
   * !#en 
   * The builtin 'resources' bundle
   * 
   * !#zh
   * 内置 resources 包
   * 
   * @property resources
   * @readonly
   * @type {Bundle}
   */
  get resources() {
    return bundles.get(BuiltinBundleName.RESOURCES);
  },

  /**
   * !#en 
   * The builtin 'internal' bundle
   * 
   * !#zh
   * 内置 internal 包
   * 
   * @property internal
   * @readonly
   * @type {Bundle}
   */
  get internal() {
    return bundles.get(BuiltinBundleName.INTERNAL);
  },

  /**
   * !#en
   * Initialize assetManager with options
   * 
   * !#zh
   * 初始化资源管理器
   * 
   * @method init
   * @param {Object} options 
   * 
   * @typescript
   * init(options: Record<string, any>): void
   */
  init: function init(options) {
    options = options || Object.create(null);

    this._files.clear();

    this._parsed.clear();

    this._releaseManager.init();

    this.assets.clear();
    this.bundles.clear();
    this.packManager.init();
    this.downloader.init(options.bundleVers, options.server);
    this.parser.init();
    this.dependUtil.init();
    this.generalImportBase = options.importBase;
    this.generalNativeBase = options.nativeBase;
  },

  /**
   * !#en 
   * Get the bundle which has been loaded
   * 
   * !#zh
   * 获取已加载的分包
   * 
   * @method getBundle
   * @param {String} name - The name of bundle 
   * @return {Bundle} - The loaded bundle
   * 
   * @example
   * // ${project}/assets/test1
   * cc.assetManager.getBundle('test1');
   * 
   * cc.assetManager.getBundle('resources');
   * 
   * @typescript
   * getBundle (name: string): cc.AssetManager.Bundle
   */
  getBundle: function getBundle(name) {
    return bundles.get(name);
  },

  /**
   * !#en 
   * Remove this bundle. NOTE: The asset whthin this bundle will not be released automatically, you can call {{#crossLink "Bundle/releaseAll:method"}}{{/crossLink}} manually before remove it if you need
   * 
   * !#zh 
   * 移除此包, 注意：这个包内的资源不会自动释放, 如果需要的话你可以在摧毁之前手动调用 {{#crossLink "Bundle/releaseAll:method"}}{{/crossLink}} 进行释放
   *
   * @method removeBundle
   * @param {Bundle} bundle - The bundle to be removed 
   * 
   * @typescript
   * removeBundle(bundle: cc.AssetManager.Bundle): void
   */
  removeBundle: function removeBundle(bundle) {
    bundle._destroy();

    bundles.remove(bundle.name);
  },

  /**
   * !#en
   * General interface used to load assets with a progression callback and a complete callback. You can achieve almost all effect you want with combination of `requests` and `options`.
   * It is highly recommended that you use more simple API, such as `load`, `loadDir` etc. Every custom parameter in `options` will be distribute to each of `requests`. 
   * if request already has same one, the parameter in request will be given priority. Besides, if request has dependencies, `options` will distribute to dependencies too.
   * Every custom parameter in `requests` will be tranfered to handler of `downloader` and `parser` as `options`. 
   * You can register you own handler downloader or parser to collect these custom parameters for some effect.
   * 
   * Reserved Keyword: `uuid`, `url`, `path`, `dir`, `scene`, `type`, `priority`, `preset`, `audioLoadMode`, `ext`, `bundle`, `onFileProgress`, `maxConcurrency`, `maxRequestsPerFrame`
   * `maxRetryCount`, `version`, `responseType`, `withCredentials`, `mimeType`, `timeout`, `header`, `reload`, `cacheAsset`, `cacheEnabled`,
   * Please DO NOT use these words as custom options!
   * 
   * !#zh
   * 通用加载资源接口，可传入进度回调以及完成回调，通过组合 `request` 和 `options` 参数，几乎可以实现和扩展所有想要的加载效果。非常建议你使用更简单的API，例如 `load`、`loadDir` 等。
   * `options` 中的自定义参数将会分发到 `requests` 的每一项中，如果request中已存在同名的参数则以 `requests` 中为准，同时如果有其他
   * 依赖资源，则 `options` 中的参数会继续向依赖项中分发。request中的自定义参数都会以 `options` 形式传入加载流程中的 `downloader`, `parser` 的方法中, 你可以
   * 扩展 `downloader`, `parser` 收集参数完成想实现的效果。
   * 
   * 保留关键字: `uuid`, `url`, `path`, `dir`, `scene`, `type`, `priority`, `preset`, `audioLoadMode`, `ext`, `bundle`, `onFileProgress`, `maxConcurrency`, `maxRequestsPerFrame`
   * `maxRetryCount`, `version`, `responseType`, `withCredentials`, `mimeType`, `timeout`, `header`, `reload`, `cacheAsset`, `cacheEnabled`,
   * 请不要使用这些字段为自定义参数!
   * 
   * @method loadAny
   * @param {string|string[]|Object|Object[]} requests - The request you want to load
   * @param {Object} [options] - Optional parameters
   * @param {Function} [onProgress] - Callback invoked when progression change
   * @param {Number} onProgress.finished - The number of the items that are already completed
   * @param {Number} onProgress.total - The total number of the items
   * @param {RequestItem} onProgress.item - The current request item
   * @param {Function} [onComplete] - Callback invoked when finish loading
   * @param {Error} onComplete.err - The error occured in loading process.
   * @param {Object} onComplete.data - The loaded content
   * 
   * @example
   * cc.assetManager.loadAny({url: 'http://example.com/a.png'}, (err, img) => cc.log(img));
   * cc.assetManager.loadAny(['60sVXiTH1D/6Aft4MRt9VC'], (err, assets) => cc.log(assets));
   * cc.assetManager.loadAny([{ uuid: '0cbZa5Y71CTZAccaIFluuZ'}, {url: 'http://example.com/a.png'}], (err, assets) => cc.log(assets));
   * cc.assetManager.downloader.register('.asset', (url, options, onComplete) => {
   *      url += '?userName=' + options.userName + "&password=" + options.password;
   *      cc.assetManager.downloader.downloadFile(url, null, onComplete);
   * });
   * cc.assetManager.parser.register('.asset', (file, options, onComplete) => {
   *      var json = JSON.parse(file);
   *      var skin = json[options.skin];
   *      var model = json[options.model];
   *      onComplete(null, {skin, model});
   * });
   * cc.assetManager.loadAny({ url: 'http://example.com/my.asset', skin: 'xxx', model: 'xxx', userName: 'xxx', password: 'xxx' });
   * 
   * @typescript
   * loadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], options: Record<string, any>, onProgress: (finished: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete: (err: Error, data: any) => void): void
   * loadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], onProgress: (finished: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete: (err: Error, data: any) => void): void
   * loadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], options: Record<string, any>, onComplete: (err: Error, data: any) => void): void
   * loadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], onComplete: (err: Error, data: any) => void): void
   * loadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], options: Record<string, any>): void
   * loadAny(requests: string | string[] | Record<string, any> | Record<string, any>[]): void
   */
  loadAny: function loadAny(requests, options, onProgress, onComplete) {
    var _parseParameters = parseParameters(options, onProgress, onComplete),
        options = _parseParameters.options,
        onProgress = _parseParameters.onProgress,
        onComplete = _parseParameters.onComplete;

    options.preset = options.preset || 'default';
    requests = Array.isArray(requests) ? requests.concat() : requests;
    var task = new Task({
      input: requests,
      onProgress: onProgress,
      onComplete: asyncify(onComplete),
      options: options
    });
    pipeline.async(task);
  },

  /**
   * !#en
   * General interface used to preload assets with a progression callback and a complete callback.It is highly recommended that you use more simple API, such as `preloadRes`, `preloadResDir` etc.
   * Everything about preload is just likes `cc.assetManager.loadAny`, the difference is `cc.assetManager.preloadAny` will only download asset but not parse asset. You need to invoke `cc.assetManager.loadAny(preloadTask)` 
   * to finish loading asset
   * 
   * !#zh
   * 通用预加载资源接口，可传入进度回调以及完成回调，非常建议你使用更简单的 API ，例如 `preloadRes`, `preloadResDir` 等。`preloadAny` 和 `loadAny` 几乎一样，区别在于 `preloadAny` 只会下载资源，不会去解析资源，你需要调用 `cc.assetManager.loadAny(preloadTask)`
   * 来完成资源加载。
   * 
   * @method preloadAny
   * @param {string|string[]|Object|Object[]} requests - The request you want to preload
   * @param {Object} [options] - Optional parameters
   * @param {Function} [onProgress] - Callback invoked when progression change
   * @param {Number} onProgress.finished - The number of the items that are already completed
   * @param {Number} onProgress.total - The total number of the items
   * @param {RequestItem} onProgress.item - The current request item
   * @param {Function} [onComplete] - Callback invoked when finish preloading
   * @param {Error} onComplete.err - The error occured in preloading process.
   * @param {RequestItem[]} onComplete.items - The preloaded content
   * 
   * @example
   * cc.assetManager.preloadAny('0cbZa5Y71CTZAccaIFluuZ', (err) => cc.assetManager.loadAny('0cbZa5Y71CTZAccaIFluuZ'));
   * 
   * @typescript
   * preloadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], options: Record<string, any>, onProgress: (finished: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete: (err: Error, items: cc.AssetManager.RequestItem[]) => void): void
   * preloadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], onProgress: (finished: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete: (err: Error, items: cc.AssetManager.RequestItem[]) => void): void
   * preloadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], options: Record<string, any>, onComplete: (err: Error, items: cc.AssetManager.RequestItem[]) => void): void
   * preloadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], onComplete: (err: Error, items: cc.AssetManager.RequestItem[]) => void): void
   * preloadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], options: Record<string, any>): void
   * preloadAny(requests: string | string[] | Record<string, any> | Record<string, any>[]): void
   */
  preloadAny: function preloadAny(requests, options, onProgress, onComplete) {
    var _parseParameters2 = parseParameters(options, onProgress, onComplete),
        options = _parseParameters2.options,
        onProgress = _parseParameters2.onProgress,
        onComplete = _parseParameters2.onComplete;

    options.preset = options.preset || 'preload';
    requests = Array.isArray(requests) ? requests.concat() : requests;
    var task = new Task({
      input: requests,
      onProgress: onProgress,
      onComplete: asyncify(onComplete),
      options: options
    });
    fetchPipeline.async(task);
  },

  /**
   * !#en
   * Load native file of asset, if you check the option 'Async Load Assets', you may need to load native file with this before you use the asset
   * 
   * !#zh
   * 加载资源的原生文件，如果你勾选了'延迟加载资源'选项，你可能需要在使用资源之前调用此方法来加载原生文件
   * 
   * @method postLoadNative
   * @param {Asset} asset - The asset
   * @param {Object} [options] - Some optional parameters
   * @param {Function} [onComplete] - Callback invoked when finish loading
   * @param {Error} onComplete.err - The error occured in loading process.
   * 
   * @example
   * cc.assetManager.postLoadNative(texture, (err) => console.log(err));
   * 
   * @typescript
   * postLoadNative(asset: cc.Asset, options: Record<string, any>, onComplete: (err: Error) => void): void
   * postLoadNative(asset: cc.Asset, onComplete: (err: Error) => void): void
   * postLoadNative(asset: cc.Asset, options: Record<string, any>): void
   * postLoadNative(asset: cc.Asset): void
   */
  postLoadNative: function postLoadNative(asset, options, onComplete) {
    if (!(asset instanceof cc.Asset)) throw new Error('input is not asset');

    var _parseParameters3 = parseParameters(options, undefined, onComplete),
        options = _parseParameters3.options,
        onComplete = _parseParameters3.onComplete;

    if (!asset._native || asset._nativeAsset) {
      return asyncify(onComplete)(null);
    }

    var depend = dependUtil.getNativeDep(asset._uuid);

    if (depend) {
      if (!bundles.has(depend.bundle)) {
        var bundle = bundles.find(function (bundle) {
          return bundle.getAssetInfo(asset._uuid);
        });

        if (bundle) {
          depend.bundle = bundle.name;
        }
      }

      this.loadAny(depend, options, function (err, _native) {
        if (!err) {
          if (asset.isValid && !asset._nativeAsset) {
            asset._nativeAsset = _native;
          }
        } else {
          cc.error(err.message, err.stack);
        }

        onComplete && onComplete(err);
      });
    }
  },

  /**
   * !#en
   * Load remote asset with url, such as audio, image, text and so on.
   * 
   * !#zh
   * 使用 url 加载远程资源，例如音频，图片，文本等等。
   * 
   * @method loadRemote
   * @param {string} url - The url of asset
   * @param {Object} [options] - Some optional parameters
   * @param {cc.AudioClip.LoadMode} [options.audioLoadMode] - Indicate which mode audio you want to load
   * @param {string} [options.ext] - If the url does not have a extension name, you can specify one manually.
   * @param {Function} [onComplete] - Callback invoked when finish loading
   * @param {Error} onComplete.err - The error occured in loading process.
   * @param {Asset} onComplete.asset - The loaded texture
   * 
   * @example
   * cc.assetManager.loadRemote('http://www.cloud.com/test1.jpg', (err, texture) => console.log(err));
   * cc.assetManager.loadRemote('http://www.cloud.com/test2.mp3', (err, audioClip) => console.log(err));
   * cc.assetManager.loadRemote('http://www.cloud.com/test3', { ext: '.png' }, (err, texture) => console.log(err));
   * 
   * @typescript
   * loadRemote<T extends cc.Asset>(url: string, options: Record<string, any>, onComplete: (err: Error, asset: T) => void): void
   * loadRemote<T extends cc.Asset>(url: string, onComplete: (err: Error, asset: T) => void): void
   * loadRemote<T extends cc.Asset>(url: string, options: Record<string, any>): void
   * loadRemote<T extends cc.Asset>(url: string): void
   */
  loadRemote: function loadRemote(url, options, onComplete) {
    var _parseParameters4 = parseParameters(options, undefined, onComplete),
        options = _parseParameters4.options,
        onComplete = _parseParameters4.onComplete;

    if (this.assets.has(url)) {
      return asyncify(onComplete)(null, this.assets.get(url));
    }

    options.__isNative__ = true;
    options.preset = options.preset || 'remote';
    this.loadAny({
      url: url
    }, options, null, function (err, data) {
      if (err) {
        cc.error(err.message, err.stack);
        onComplete && onComplete(err, null);
      } else {
        factory.create(url, data, options.ext || cc.path.extname(url), options, function (err, out) {
          onComplete && onComplete(err, out);
        });
      }
    });
  },

  /**
   * !#en
   * Load script 
   * 
   * !#zh
   * 加载脚本
   * 
   * @method loadScript
   * @param {string|string[]} url - Url of the script
   * @param {Object} [options] - Some optional paramters
   * @param {boolean} [options.async] - Indicate whether or not loading process should be async
   * @param {Function} [onComplete] - Callback when script loaded or failed
   * @param {Error} onComplete.err - The occurred error, null indicetes success
   * 
   * @example
   * loadScript('http://localhost:8080/index.js', null, (err) => console.log(err));
   * 
   * @typescript
   * loadScript(url: string|string[], options: Record<string, any>, onComplete: (err: Error) => void): void
   * loadScript(url: string|string[], onComplete: (err: Error) => void): void
   * loadScript(url: string|string[], options: Record<string, any>): void
   * loadScript(url: string|string[]): void
   */
  loadScript: function loadScript(url, options, onComplete) {
    var _parseParameters5 = parseParameters(options, undefined, onComplete),
        options = _parseParameters5.options,
        onComplete = _parseParameters5.onComplete;

    options.__requestType__ = RequestType.URL;
    options.preset = options.preset || 'script';
    this.loadAny(url, options, onComplete);
  },

  /**
   * !#en
   * load bundle
   * 
   * !#zh
   * 加载资源包
   * 
   * @method loadBundle
   * @param {string} nameOrUrl - The name or root path of bundle
   * @param {Object} [options] - Some optional paramter, same like downloader.downloadFile
   * @param {string} [options.version] - The version of this bundle, you can check config.json in this bundle
   * @param {Function} [onComplete] - Callback when bundle loaded or failed
   * @param {Error} onComplete.err - The occurred error, null indicetes success
   * @param {Bundle} onComplete.bundle - The loaded bundle
   * 
   * @example
   * loadBundle('http://localhost:8080/test', null, (err, bundle) => console.log(err));
   * 
   * @typescript
   * loadBundle(nameOrUrl: string, options: Record<string, any>, onComplete: (err: Error, bundle: cc.AssetManager.Bundle) => void): void
   * loadBundle(nameOrUrl: string, onComplete: (err: Error, bundle: cc.AssetManager.Bundle) => void): void
   * loadBundle(nameOrUrl: string, options: Record<string, any>): void
   * loadBundle(nameOrUrl: string): void
   */
  loadBundle: function loadBundle(nameOrUrl, options, onComplete) {
    var _parseParameters6 = parseParameters(options, undefined, onComplete),
        options = _parseParameters6.options,
        onComplete = _parseParameters6.onComplete;

    var bundleName = cc.path.basename(nameOrUrl);

    if (this.bundles.has(bundleName)) {
      return asyncify(onComplete)(null, this.getBundle(bundleName));
    }

    options.preset = options.preset || 'bundle';
    options.ext = 'bundle';
    this.loadRemote(nameOrUrl, options, onComplete);
  },

  /**
   * !#en
   * Release asset and it's dependencies.
   * This method will not only remove the cache of the asset in assetManager, but also clean up its content.
   * For example, if you release a texture, the texture asset and its gl texture data will be freed up.
   * Notice, this method may cause the texture to be unusable, if there are still other nodes use the same texture, they may turn to black and report gl errors.
   * 
   * !#zh
   * 释放资源以及其依赖资源, 这个方法不仅会从 assetManager 中删除资源的缓存引用，还会清理它的资源内容。
   * 比如说，当你释放一个 texture 资源，这个 texture 和它的 gl 贴图数据都会被释放。
   * 注意，这个函数可能会导致资源贴图或资源所依赖的贴图不可用，如果场景中存在节点仍然依赖同样的贴图，它们可能会变黑并报 GL 错误。
   *
   * @method releaseAsset
   * @param {Asset} asset - The asset to be released
   * 
   * @example
   * // release a texture which is no longer need
   * cc.assetManager.releaseAsset(texture);
   *
   * @typescript
   * releaseAsset(asset: cc.Asset): void
   */
  releaseAsset: function releaseAsset(asset) {
    releaseManager.tryRelease(asset, true);
  },

  /**
   * !#en 
   * Release all unused assets. Refer to {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}} for detailed informations.
   * 
   * !#zh 
   * 释放所有没有用到的资源。详细信息请参考 {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}}
   *
   * @method releaseUnusedAssets
   * @private
   * 
   * @typescript
   * releaseUnusedAssets(): void
   */
  releaseUnusedAssets: function releaseUnusedAssets() {
    assets.forEach(function (asset) {
      releaseManager.tryRelease(asset);
    });
  },

  /**
   * !#en 
   * Release all assets. Refer to {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}} for detailed informations.
   * 
   * !#zh 
   * 释放所有资源。详细信息请参考 {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}}
   *
   * @method releaseAll
   * 
   * @typescript
   * releaseAll(): void
   */
  releaseAll: function releaseAll() {
    assets.forEach(function (asset) {
      releaseManager.tryRelease(asset, true);
    });
  },
  _transform: function _transform(input, options) {
    var subTask = Task.create({
      input: input,
      options: options
    });
    var urls = [];

    try {
      var result = transformPipeline.sync(subTask);

      for (var i = 0, l = result.length; i < l; i++) {
        var item = result[i];
        var url = item.url;
        item.recycle();
        urls.push(url);
      }
    } catch (e) {
      for (var i = 0, l = subTask.output.length; i < l; i++) {
        subTask.output[i].recycle();
      }

      cc.error(e.message, e.stack);
    }

    subTask.recycle();
    return urls.length > 1 ? urls : urls[0];
  }
};
cc.AssetManager = AssetManager;
/**
 * @module cc
 */

/**
 * @property assetManager
 * @type {AssetManager}
 */

cc.assetManager = new AssetManager();
Object.defineProperty(cc, 'resources', {
  /**
   * !#en
   * cc.resources is a bundle and controls all asset under assets/resources
   * 
   * !#zh
   * cc.resources 是一个 bundle，用于管理所有在 assets/resources 下的资源
   * 
   * @property resources
   * @readonly
   * @type {AssetManager.Bundle}
   */
  get: function get() {
    return bundles.get(BuiltinBundleName.RESOURCES);
  }
});
module.exports = cc.assetManager;
/**
 * !#en
 * This module controls asset's behaviors and information, include loading, releasing etc. 
 * All member can be accessed with `cc.assetManager`. All class or enum can be accessed with `cc.AssetManager`
 * 
 * !#zh
 * 此模块管理资源的行为和信息，包括加载，释放等，所有成员能够通过 `cc.assetManager` 调用. 所有类型或枚举能通过 `cc.AssetManager` 访问
 * 
 * @module cc.AssetManager
 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0LW1hbmFnZXIvQ0NBc3NldE1hbmFnZXIuanMiXSwibmFtZXMiOlsicHJlcHJvY2VzcyIsInJlcXVpcmUiLCJmZXRjaCIsIkNhY2hlIiwiaGVscGVyIiwicmVsZWFzZU1hbmFnZXIiLCJkZXBlbmRVdGlsIiwibG9hZCIsIlBpcGVsaW5lIiwiVGFzayIsIlJlcXVlc3RJdGVtIiwiZG93bmxvYWRlciIsInBhcnNlciIsInBhY2tNYW5hZ2VyIiwiQnVuZGxlIiwiYnVpbHRpbnMiLCJmYWN0b3J5IiwicGFyc2UiLCJjb21iaW5lIiwicGFyc2VQYXJhbWV0ZXJzIiwiYXN5bmNpZnkiLCJhc3NldHMiLCJmaWxlcyIsInBhcnNlZCIsInBpcGVsaW5lIiwidHJhbnNmb3JtUGlwZWxpbmUiLCJmZXRjaFBpcGVsaW5lIiwiUmVxdWVzdFR5cGUiLCJidW5kbGVzIiwiQnVpbHRpbkJ1bmRsZU5hbWUiLCJBc3NldE1hbmFnZXIiLCJfcHJlcHJvY2Vzc1BpcGUiLCJfZmV0Y2hQaXBlIiwiX2xvYWRQaXBlIiwiYXBwZW5kIiwiX2ZpbGVzIiwiX3BhcnNlZCIsImdlbmVyYWxJbXBvcnRCYXNlIiwiZ2VuZXJhbE5hdGl2ZUJhc2UiLCJfcmVsZWFzZU1hbmFnZXIiLCJjYWNoZUFzc2V0IiwiZm9yY2UiLCJ1dGlscyIsImNhY2hlTWFuYWdlciIsInByZXNldHMiLCJwcmlvcml0eSIsIm1heENvbmN1cnJlbmN5IiwibWF4UmVxdWVzdHNQZXJGcmFtZSIsIm1heFJldHJ5Q291bnQiLCJwcm90b3R5cGUiLCJjb25zdHJ1Y3RvciIsIm1haW4iLCJnZXQiLCJNQUlOIiwicmVzb3VyY2VzIiwiUkVTT1VSQ0VTIiwiaW50ZXJuYWwiLCJJTlRFUk5BTCIsImluaXQiLCJvcHRpb25zIiwiT2JqZWN0IiwiY3JlYXRlIiwiY2xlYXIiLCJidW5kbGVWZXJzIiwic2VydmVyIiwiaW1wb3J0QmFzZSIsIm5hdGl2ZUJhc2UiLCJnZXRCdW5kbGUiLCJuYW1lIiwicmVtb3ZlQnVuZGxlIiwiYnVuZGxlIiwiX2Rlc3Ryb3kiLCJyZW1vdmUiLCJsb2FkQW55IiwicmVxdWVzdHMiLCJvblByb2dyZXNzIiwib25Db21wbGV0ZSIsInByZXNldCIsIkFycmF5IiwiaXNBcnJheSIsImNvbmNhdCIsInRhc2siLCJpbnB1dCIsImFzeW5jIiwicHJlbG9hZEFueSIsInBvc3RMb2FkTmF0aXZlIiwiYXNzZXQiLCJjYyIsIkFzc2V0IiwiRXJyb3IiLCJ1bmRlZmluZWQiLCJfbmF0aXZlIiwiX25hdGl2ZUFzc2V0IiwiZGVwZW5kIiwiZ2V0TmF0aXZlRGVwIiwiX3V1aWQiLCJoYXMiLCJmaW5kIiwiZ2V0QXNzZXRJbmZvIiwiZXJyIiwibmF0aXZlIiwiaXNWYWxpZCIsImVycm9yIiwibWVzc2FnZSIsInN0YWNrIiwibG9hZFJlbW90ZSIsInVybCIsIl9faXNOYXRpdmVfXyIsImRhdGEiLCJleHQiLCJwYXRoIiwiZXh0bmFtZSIsIm91dCIsImxvYWRTY3JpcHQiLCJfX3JlcXVlc3RUeXBlX18iLCJVUkwiLCJsb2FkQnVuZGxlIiwibmFtZU9yVXJsIiwiYnVuZGxlTmFtZSIsImJhc2VuYW1lIiwicmVsZWFzZUFzc2V0IiwidHJ5UmVsZWFzZSIsInJlbGVhc2VVbnVzZWRBc3NldHMiLCJmb3JFYWNoIiwicmVsZWFzZUFsbCIsIl90cmFuc2Zvcm0iLCJzdWJUYXNrIiwidXJscyIsInJlc3VsdCIsInN5bmMiLCJpIiwibCIsImxlbmd0aCIsIml0ZW0iLCJyZWN5Y2xlIiwicHVzaCIsImUiLCJvdXRwdXQiLCJhc3NldE1hbmFnZXIiLCJkZWZpbmVQcm9wZXJ0eSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxV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QUFDLEVBQW5ELEVBQXVEO0FBQ25ESixRQUFBQSxPQUFPLENBQUNXLE1BQVIsQ0FBZVAsQ0FBZixFQUFrQkksT0FBbEI7QUFDSDs7QUFDRC9DLE1BQUFBLEVBQUUsQ0FBQ2UsS0FBSCxDQUFTa0MsQ0FBQyxDQUFDakMsT0FBWCxFQUFvQmlDLENBQUMsQ0FBQ2hDLEtBQXRCO0FBQ0g7O0FBQ0RzQixJQUFBQSxPQUFPLENBQUNRLE9BQVI7QUFDQSxXQUFPUCxJQUFJLENBQUNLLE1BQUwsR0FBYyxDQUFkLEdBQWtCTCxJQUFsQixHQUF5QkEsSUFBSSxDQUFDLENBQUQsQ0FBcEM7QUFDSDtBQWplb0IsQ0FBekI7QUFvZUF4QyxFQUFFLENBQUN6RCxZQUFILEdBQWtCQSxZQUFsQjtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQXlELEVBQUUsQ0FBQ21ELFlBQUgsR0FBa0IsSUFBSTVHLFlBQUosRUFBbEI7QUFFQThCLE1BQU0sQ0FBQytFLGNBQVAsQ0FBc0JwRCxFQUF0QixFQUEwQixXQUExQixFQUF1QztBQUNuQztBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0luQyxFQUFBQSxHQVptQyxpQkFZNUI7QUFDSCxXQUFPeEIsT0FBTyxDQUFDd0IsR0FBUixDQUFZdkIsaUJBQWlCLENBQUMwQixTQUE5QixDQUFQO0FBQ0g7QUFka0MsQ0FBdkM7QUFrQkFxRixNQUFNLENBQUNDLE9BQVAsR0FBaUJ0RCxFQUFFLENBQUNtRCxZQUFwQjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBwcmVwcm9jZXNzID0gcmVxdWlyZSgnLi9wcmVwcm9jZXNzJyk7XG5jb25zdCBmZXRjaCA9IHJlcXVpcmUoJy4vZmV0Y2gnKTtcbmNvbnN0IENhY2hlID0gcmVxdWlyZSgnLi9jYWNoZScpO1xuY29uc3QgaGVscGVyID0gcmVxdWlyZSgnLi9oZWxwZXInKTtcbmNvbnN0IHJlbGVhc2VNYW5hZ2VyID0gcmVxdWlyZSgnLi9yZWxlYXNlTWFuYWdlcicpO1xuY29uc3QgZGVwZW5kVXRpbCA9IHJlcXVpcmUoJy4vZGVwZW5kLXV0aWwnKTtcbmNvbnN0IGxvYWQgPSByZXF1aXJlKCcuL2xvYWQnKTtcbmNvbnN0IFBpcGVsaW5lID0gcmVxdWlyZSgnLi9waXBlbGluZScpO1xuY29uc3QgVGFzayA9IHJlcXVpcmUoJy4vdGFzaycpO1xuY29uc3QgUmVxdWVzdEl0ZW0gPSByZXF1aXJlKCcuL3JlcXVlc3QtaXRlbScpO1xuY29uc3QgZG93bmxvYWRlciA9IHJlcXVpcmUoJy4vZG93bmxvYWRlcicpO1xuY29uc3QgcGFyc2VyID0gcmVxdWlyZSgnLi9wYXJzZXInKTtcbmNvbnN0IHBhY2tNYW5hZ2VyID0gcmVxdWlyZSgnLi9wYWNrLW1hbmFnZXInKTtcbmNvbnN0IEJ1bmRsZSA9IHJlcXVpcmUoJy4vYnVuZGxlJyk7XG5jb25zdCBidWlsdGlucyA9IHJlcXVpcmUoJy4vYnVpbHRpbnMnKTtcbmNvbnN0IGZhY3RvcnkgPSByZXF1aXJlKCcuL2ZhY3RvcnknKTtcbmNvbnN0IHsgcGFyc2UsIGNvbWJpbmUgfSA9IHJlcXVpcmUoJy4vdXJsVHJhbnNmb3JtZXInKTtcbmNvbnN0IHsgcGFyc2VQYXJhbWV0ZXJzLCBhc3luY2lmeSB9ID0gcmVxdWlyZSgnLi91dGlsaXRpZXMnKTtcbmNvbnN0IHsgYXNzZXRzLCBmaWxlcywgcGFyc2VkLCBwaXBlbGluZSwgdHJhbnNmb3JtUGlwZWxpbmUsIGZldGNoUGlwZWxpbmUsIFJlcXVlc3RUeXBlLCBidW5kbGVzLCBCdWlsdGluQnVuZGxlTmFtZSB9ID0gcmVxdWlyZSgnLi9zaGFyZWQnKTtcblxuXG4vKipcbiAqIEBtb2R1bGUgY2NcbiAqL1xuLyoqXG4gKiAhI2VuXG4gKiBUaGlzIG1vZHVsZSBjb250cm9scyBhc3NldCdzIGJlaGF2aW9ycyBhbmQgaW5mb3JtYXRpb24sIGluY2x1ZGUgbG9hZGluZywgcmVsZWFzaW5nIGV0Yy4gaXQgaXMgYSBzaW5nbGV0b25cbiAqIEFsbCBtZW1iZXIgY2FuIGJlIGFjY2Vzc2VkIHdpdGggYGNjLmFzc2V0TWFuYWdlcmAuXG4gKiBcbiAqICEjemhcbiAqIOatpOaooeWdl+euoeeQhui1hOa6kOeahOihjOS4uuWSjOS/oeaBr++8jOWMheaLrOWKoOi9ve+8jOmHiuaUvuetie+8jOi/meaYr+S4gOS4quWNleS+i++8jOaJgOacieaIkOWRmOiDveWkn+mAmui/hyBgY2MuYXNzZXRNYW5hZ2VyYCDosIPnlKhcbiAqIFxuICogQGNsYXNzIEFzc2V0TWFuYWdlclxuICovXG5mdW5jdGlvbiBBc3NldE1hbmFnZXIgKCkge1xuXG4gICAgdGhpcy5fcHJlcHJvY2Vzc1BpcGUgPSBwcmVwcm9jZXNzO1xuXG4gICAgdGhpcy5fZmV0Y2hQaXBlID0gZmV0Y2g7XG5cbiAgICB0aGlzLl9sb2FkUGlwZSA9IGxvYWQ7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFxuICAgICAqIE5vcm1hbCBsb2FkaW5nIHBpcGVsaW5lXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOato+W4uOWKoOi9veeuoee6v1xuICAgICAqIFxuICAgICAqIEBwcm9wZXJ0eSBwaXBlbGluZVxuICAgICAqIEB0eXBlIHtQaXBlbGluZX1cbiAgICAgKi9cbiAgICB0aGlzLnBpcGVsaW5lID0gcGlwZWxpbmUuYXBwZW5kKHByZXByb2Nlc3MpLmFwcGVuZChsb2FkKTtcbiAgICBcbiAgICAvKipcbiAgICAgKiAhI2VuIFxuICAgICAqIEZldGNoaW5nIHBpcGVsaW5lXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOS4i+i9veeuoee6v1xuICAgICAqIFxuICAgICAqIEBwcm9wZXJ0eSBmZXRjaFBpcGVsaW5lXG4gICAgICogQHR5cGUge1BpcGVsaW5lfVxuICAgICAqL1xuICAgIHRoaXMuZmV0Y2hQaXBlbGluZSA9IGZldGNoUGlwZWxpbmUuYXBwZW5kKHByZXByb2Nlc3MpLmFwcGVuZChmZXRjaCk7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFxuICAgICAqIFVybCB0cmFuc2Zvcm1lclxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiBVcmwg6L2s5o2i5ZmoXG4gICAgICogXG4gICAgICogQHByb3BlcnR5IHRyYW5zZm9ybVBpcGVsaW5lXG4gICAgICogQHR5cGUge1BpcGVsaW5lfVxuICAgICAqL1xuICAgIHRoaXMudHJhbnNmb3JtUGlwZWxpbmUgPSB0cmFuc2Zvcm1QaXBlbGluZS5hcHBlbmQocGFyc2UpLmFwcGVuZChjb21iaW5lKTtcblxuXG4gICAgLyoqXG4gICAgICogISNlbiBcbiAgICAgKiBUaGUgY29sbGVjdGlvbiBvZiBidW5kbGUgd2hpY2ggaXMgYWxyZWFkeSBsb2FkZWQsIHlvdSBjYW4gcmVtb3ZlIGNhY2hlIHdpdGgge3sjY3Jvc3NMaW5rIFwiQXNzZXRNYW5hZ2VyL3JlbW92ZUJ1bmRsZTptZXRob2RcIn19e3svY3Jvc3NMaW5rfX1cbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog5bey5Yqg6L29IGJ1bmRsZSDnmoTpm4blkIjvvIwg5L2g6IO96YCa6L+HIHt7I2Nyb3NzTGluayBcIkFzc2V0TWFuYWdlci9yZW1vdmVCdW5kbGU6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IOadpeenu+mZpOe8k+WtmFxuICAgICAqIFxuICAgICAqIEBwcm9wZXJ0eSBidW5kbGVzXG4gICAgICogQHR5cGUge0NhY2hlfVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogYnVuZGxlczogQXNzZXRNYW5hZ2VyLkNhY2hlPEFzc2V0TWFuYWdlci5CdW5kbGU+XG4gICAgICovXG4gICAgdGhpcy5idW5kbGVzID0gYnVuZGxlcztcblxuICAgIC8qKlxuICAgICAqICEjZW4gXG4gICAgICogVGhlIGNvbGxlY3Rpb24gb2YgYXNzZXQgd2hpY2ggaXMgYWxyZWFkeSBsb2FkZWQsIHlvdSBjYW4gcmVtb3ZlIGNhY2hlIHdpdGgge3sjY3Jvc3NMaW5rIFwiQXNzZXRNYW5hZ2VyL3JlbGVhc2VBc3NldDptZXRob2RcIn19e3svY3Jvc3NMaW5rfX1cbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog5bey5Yqg6L296LWE5rqQ55qE6ZuG5ZCI77yMIOS9oOiDvemAmui/hyB7eyNjcm9zc0xpbmsgXCJBc3NldE1hbmFnZXIvcmVsZWFzZUFzc2V0Om1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSDmnaXnp7vpmaTnvJPlrZhcbiAgICAgKiBcbiAgICAgKiBAcHJvcGVydHkgYXNzZXRzXG4gICAgICogQHR5cGUge0NhY2hlfVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogYXNzZXRzOiBBc3NldE1hbmFnZXIuQ2FjaGU8Y2MuQXNzZXQ+XG4gICAgICovXG4gICAgdGhpcy5hc3NldHMgPSBhc3NldHM7XG4gICAgXG4gICAgdGhpcy5fZmlsZXMgPSBmaWxlcztcbiAgICBcbiAgICB0aGlzLl9wYXJzZWQgPSBwYXJzZWQ7XG5cbiAgICB0aGlzLmdlbmVyYWxJbXBvcnRCYXNlID0gJyc7XG5cbiAgICB0aGlzLmdlbmVyYWxOYXRpdmVCYXNlID0gJyc7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFxuICAgICAqIE1hbmFnZSByZWxhdGlvbnNoaXAgYmV0d2VlbiBhc3NldCBhbmQgaXRzIGRlcGVuZGVuY2llc1xuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDnrqHnkIbotYTmupDkvp3otZblhbPns7tcbiAgICAgKiBcbiAgICAgKiBAcHJvcGVydHkgZGVwZW5kVXRpbFxuICAgICAqIEB0eXBlIHtEZXBlbmRVdGlsfVxuICAgICAqL1xuICAgIHRoaXMuZGVwZW5kVXRpbCA9IGRlcGVuZFV0aWw7XG5cbiAgICB0aGlzLl9yZWxlYXNlTWFuYWdlciA9IHJlbGVhc2VNYW5hZ2VyO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBcbiAgICAgKiBXaGV0aGVyIG9yIG5vdCBjYWNoZSB0aGUgbG9hZGVkIGFzc2V0XG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOaYr+WQpue8k+WtmOW3suWKoOi9veeahOi1hOa6kFxuICAgICAqIFxuICAgICAqIEBwcm9wZXJ0eSBjYWNoZUFzc2V0XG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5jYWNoZUFzc2V0ID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gXG4gICAgICogV2hldGhlciBvciBub3QgbG9hZCBhc3NldCBmb3JjZWx5LCBpZiBpdCBpcyB0cnVlLCBhc3NldCB3aWxsIGJlIGxvYWRlZCByZWdhcmRsZXNzIG9mIGVycm9yXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOaYr+WQpuW8uuWItuWKoOi9vei1hOa6kCwg5aaC5p6c5Li6IHRydWUg77yM5Yqg6L296LWE5rqQ5bCG5Lya5b+955Wl5oql6ZSZXG4gICAgICogXG4gICAgICogQHByb3BlcnR5IGZvcmNlXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5mb3JjZSA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBcbiAgICAgKiBTb21lIHVzZWZ1bCBmdW5jdGlvblxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDkuIDkupvmnInnlKjnmoTmlrnms5VcbiAgICAgKiBcbiAgICAgKiBAcHJvcGVydHkgdXRpbHNcbiAgICAgKiBAdHlwZSB7SGVscGVyfVxuICAgICAqL1xuICAgIHRoaXMudXRpbHMgPSBoZWxwZXI7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFxuICAgICAqIE1hbmFnZSBhbGwgZG93bmxvYWRpbmcgdGFza1xuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDnrqHnkIbmiYDmnInkuIvovb3ku7vliqFcbiAgICAgKiBcbiAgICAgKiBAcHJvcGVydHkgZG93bmxvYWRlclxuICAgICAqIEB0eXBlIHtEb3dubG9hZGVyfVxuICAgICAqL1xuICAgIHRoaXMuZG93bmxvYWRlciA9IGRvd25sb2FkZXI7IFxuXG4gICAgLyoqXG4gICAgICogISNlbiBcbiAgICAgKiBNYW5hZ2UgYWxsIHBhcnNpbmcgdGFza1xuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDnrqHnkIbmiYDmnInop6PmnpDku7vliqFcbiAgICAgKiBcbiAgICAgKiBAcHJvcGVydHkgcGFyc2VyXG4gICAgICogQHR5cGUge1BhcnNlcn1cbiAgICAgKi9cbiAgICB0aGlzLnBhcnNlciA9IHBhcnNlcjtcblxuICAgIC8qKlxuICAgICAqICEjZW4gXG4gICAgICogTWFuYWdlIGludGVybmFsIGFzc2V0XG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOeuoeeQhuWGhee9rui1hOa6kFxuICAgICAqIFxuICAgICAqIEBwcm9wZXJ0eSBidWlsdGluc1xuICAgICAqIEB0eXBlIHtCdWlsdGluc31cbiAgICAgKi9cbiAgICB0aGlzLmJ1aWx0aW5zID0gYnVpbHRpbnM7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFxuICAgICAqIE1hbmFnZSBhbGwgcGFja2VkIGFzc2V0XG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOeuoeeQhuaJgOacieWQiOW5tuWQjueahOi1hOa6kFxuICAgICAqIFxuICAgICAqIEBwcm9wZXJ0eSBwYWNrTWFuYWdlclxuICAgICAqIEB0eXBlIHtQYWNrTWFuYWdlcn1cbiAgICAgKi9cbiAgICB0aGlzLnBhY2tNYW5hZ2VyID0gcGFja01hbmFnZXI7XG5cbiAgICB0aGlzLmZhY3RvcnkgPSBmYWN0b3J5O1xuXG4gICAgLyoqXG4gICAgICogISNlbiBcbiAgICAgKiBDYWNoZSBtYW5hZ2VyIGlzIGEgbW9kdWxlIHdoaWNoIGNvbnRyb2xzIGFsbCBjYWNoZXMgZG93bmxvYWRlZCBmcm9tIHNlcnZlciBpbiBub24td2ViIHBsYXRmb3JtLlxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDnvJPlrZjnrqHnkIblmajmmK/kuIDkuKrmqKHlnZfvvIzlnKjpnZ4gV0VCIOW5s+WPsOS4iu+8jOeUqOS6jueuoeeQhuaJgOacieS7juacjeWKoeWZqOS4iuS4i+i9veS4i+adpeeahOe8k+WtmFxuICAgICAqIFxuICAgICAqIEBwcm9wZXJ0eSBjYWNoZU1hbmFnZXJcbiAgICAgKiBAdHlwZSB7Y2MuQXNzZXRNYW5hZ2VyLkNhY2hlTWFuYWdlcn1cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGNhY2hlTWFuYWdlcjogY2MuQXNzZXRNYW5hZ2VyLkNhY2hlTWFuYWdlcnxudWxsXG4gICAgICovXG4gICAgdGhpcy5jYWNoZU1hbmFnZXIgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBcbiAgICAgKiBUaGUgcHJlc2V0IG9mIG9wdGlvbnNcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog5Y+v6YCJ5Y+C5pWw55qE6aKE6K6+6ZuGXG4gICAgICogXG4gICAgICogQHByb3BlcnR5IHByZXNldHNcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcHJlc2V0czogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55Pj5cbiAgICAgKi9cbiAgICB0aGlzLnByZXNldHMgPSB7XG4gICAgICAgICdkZWZhdWx0Jzoge1xuICAgICAgICAgICAgcHJpb3JpdHk6IDAsXG4gICAgICAgIH0sXG5cbiAgICAgICAgJ3ByZWxvYWQnOiB7XG4gICAgICAgICAgICBtYXhDb25jdXJyZW5jeTogMiwgXG4gICAgICAgICAgICBtYXhSZXF1ZXN0c1BlckZyYW1lOiAyLFxuICAgICAgICAgICAgcHJpb3JpdHk6IC0xLFxuICAgICAgICB9LFxuXG4gICAgICAgICdzY2VuZSc6IHtcbiAgICAgICAgICAgIG1heENvbmN1cnJlbmN5OiA4LCBcbiAgICAgICAgICAgIG1heFJlcXVlc3RzUGVyRnJhbWU6IDgsXG4gICAgICAgICAgICBwcmlvcml0eTogMSxcbiAgICAgICAgfSxcblxuICAgICAgICAnYnVuZGxlJzoge1xuICAgICAgICAgICAgbWF4Q29uY3VycmVuY3k6IDgsIFxuICAgICAgICAgICAgbWF4UmVxdWVzdHNQZXJGcmFtZTogOCxcbiAgICAgICAgICAgIHByaW9yaXR5OiAyLFxuICAgICAgICB9LFxuXG4gICAgICAgICdyZW1vdGUnOiB7XG4gICAgICAgICAgICBtYXhSZXRyeUNvdW50OiA0XG4gICAgICAgIH0sXG5cbiAgICAgICAgJ3NjcmlwdCc6IHtcbiAgICAgICAgICAgIG1heENvbmN1cnJlbmN5OiAxMDI0LFxuICAgICAgICAgICAgbWF4UmVxdWVzdHNQZXJGcmFtZTogMTAyNCxcbiAgICAgICAgICAgIHByaW9yaXR5OiAyXG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuQXNzZXRNYW5hZ2VyLlBpcGVsaW5lID0gUGlwZWxpbmU7XG5Bc3NldE1hbmFnZXIuVGFzayA9IFRhc2s7XG5Bc3NldE1hbmFnZXIuQ2FjaGUgPSBDYWNoZTtcbkFzc2V0TWFuYWdlci5SZXF1ZXN0SXRlbSA9IFJlcXVlc3RJdGVtO1xuQXNzZXRNYW5hZ2VyLkJ1bmRsZSA9IEJ1bmRsZTtcbkFzc2V0TWFuYWdlci5CdWlsdGluQnVuZGxlTmFtZSA9IEJ1aWx0aW5CdW5kbGVOYW1lO1xuXG5Bc3NldE1hbmFnZXIucHJvdG90eXBlID0ge1xuXG4gICAgY29uc3RydWN0b3I6IEFzc2V0TWFuYWdlcixcblxuICAgIC8qKlxuICAgICAqICEjZW4gXG4gICAgICogVGhlIGJ1aWx0aW4gJ21haW4nIGJ1bmRsZVxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDlhoXnva4gbWFpbiDljIVcbiAgICAgKiBcbiAgICAgKiBAcHJvcGVydHkgbWFpblxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtCdW5kbGV9XG4gICAgICovXG4gICAgZ2V0IG1haW4gKCkge1xuICAgICAgICByZXR1cm4gYnVuZGxlcy5nZXQoQnVpbHRpbkJ1bmRsZU5hbWUuTUFJTik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gXG4gICAgICogVGhlIGJ1aWx0aW4gJ3Jlc291cmNlcycgYnVuZGxlXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOWGhee9riByZXNvdXJjZXMg5YyFXG4gICAgICogXG4gICAgICogQHByb3BlcnR5IHJlc291cmNlc1xuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtCdW5kbGV9XG4gICAgICovXG4gICAgZ2V0IHJlc291cmNlcyAoKSB7XG4gICAgICAgIHJldHVybiBidW5kbGVzLmdldChCdWlsdGluQnVuZGxlTmFtZS5SRVNPVVJDRVMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFxuICAgICAqIFRoZSBidWlsdGluICdpbnRlcm5hbCcgYnVuZGxlXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOWGhee9riBpbnRlcm5hbCDljIVcbiAgICAgKiBcbiAgICAgKiBAcHJvcGVydHkgaW50ZXJuYWxcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7QnVuZGxlfVxuICAgICAqL1xuICAgIGdldCBpbnRlcm5hbCAoKSB7XG4gICAgICAgIHJldHVybiBidW5kbGVzLmdldChCdWlsdGluQnVuZGxlTmFtZS5JTlRFUk5BTCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBJbml0aWFsaXplIGFzc2V0TWFuYWdlciB3aXRoIG9wdGlvbnNcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog5Yid5aeL5YyW6LWE5rqQ566h55CG5ZmoXG4gICAgICogXG4gICAgICogQG1ldGhvZCBpbml0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgXG4gICAgICogXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBpbml0KG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4pOiB2b2lkXG4gICAgICovXG4gICAgaW5pdCAob3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICB0aGlzLl9maWxlcy5jbGVhcigpO1xuICAgICAgICB0aGlzLl9wYXJzZWQuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5fcmVsZWFzZU1hbmFnZXIuaW5pdCgpO1xuICAgICAgICB0aGlzLmFzc2V0cy5jbGVhcigpO1xuICAgICAgICB0aGlzLmJ1bmRsZXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5wYWNrTWFuYWdlci5pbml0KCk7XG4gICAgICAgIHRoaXMuZG93bmxvYWRlci5pbml0KG9wdGlvbnMuYnVuZGxlVmVycywgb3B0aW9ucy5zZXJ2ZXIpO1xuICAgICAgICB0aGlzLnBhcnNlci5pbml0KCk7XG4gICAgICAgIHRoaXMuZGVwZW5kVXRpbC5pbml0KCk7XG4gICAgICAgIHRoaXMuZ2VuZXJhbEltcG9ydEJhc2UgPSBvcHRpb25zLmltcG9ydEJhc2U7XG4gICAgICAgIHRoaXMuZ2VuZXJhbE5hdGl2ZUJhc2UgPSBvcHRpb25zLm5hdGl2ZUJhc2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gXG4gICAgICogR2V0IHRoZSBidW5kbGUgd2hpY2ggaGFzIGJlZW4gbG9hZGVkXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluW3suWKoOi9veeahOWIhuWMhVxuICAgICAqIFxuICAgICAqIEBtZXRob2QgZ2V0QnVuZGxlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiBidW5kbGUgXG4gICAgICogQHJldHVybiB7QnVuZGxlfSAtIFRoZSBsb2FkZWQgYnVuZGxlXG4gICAgICogXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyAke3Byb2plY3R9L2Fzc2V0cy90ZXN0MVxuICAgICAqIGNjLmFzc2V0TWFuYWdlci5nZXRCdW5kbGUoJ3Rlc3QxJyk7XG4gICAgICogXG4gICAgICogY2MuYXNzZXRNYW5hZ2VyLmdldEJ1bmRsZSgncmVzb3VyY2VzJyk7XG4gICAgICogXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBnZXRCdW5kbGUgKG5hbWU6IHN0cmluZyk6IGNjLkFzc2V0TWFuYWdlci5CdW5kbGVcbiAgICAgKi9cbiAgICBnZXRCdW5kbGUgKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGJ1bmRsZXMuZ2V0KG5hbWUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFxuICAgICAqIFJlbW92ZSB0aGlzIGJ1bmRsZS4gTk9URTogVGhlIGFzc2V0IHdodGhpbiB0aGlzIGJ1bmRsZSB3aWxsIG5vdCBiZSByZWxlYXNlZCBhdXRvbWF0aWNhbGx5LCB5b3UgY2FuIGNhbGwge3sjY3Jvc3NMaW5rIFwiQnVuZGxlL3JlbGVhc2VBbGw6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IG1hbnVhbGx5IGJlZm9yZSByZW1vdmUgaXQgaWYgeW91IG5lZWRcbiAgICAgKiBcbiAgICAgKiAhI3poIFxuICAgICAqIOenu+mZpOatpOWMhSwg5rOo5oSP77ya6L+Z5Liq5YyF5YaF55qE6LWE5rqQ5LiN5Lya6Ieq5Yqo6YeK5pS+LCDlpoLmnpzpnIDopoHnmoTor53kvaDlj6/ku6XlnKjmkafmr4HkuYvliY3miYvliqjosIPnlKgge3sjY3Jvc3NMaW5rIFwiQnVuZGxlL3JlbGVhc2VBbGw6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IOi/m+ihjOmHiuaUvlxuICAgICAqXG4gICAgICogQG1ldGhvZCByZW1vdmVCdW5kbGVcbiAgICAgKiBAcGFyYW0ge0J1bmRsZX0gYnVuZGxlIC0gVGhlIGJ1bmRsZSB0byBiZSByZW1vdmVkIFxuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcmVtb3ZlQnVuZGxlKGJ1bmRsZTogY2MuQXNzZXRNYW5hZ2VyLkJ1bmRsZSk6IHZvaWRcbiAgICAgKi9cbiAgICByZW1vdmVCdW5kbGUgKGJ1bmRsZSkge1xuICAgICAgICBidW5kbGUuX2Rlc3Ryb3koKTtcbiAgICAgICAgYnVuZGxlcy5yZW1vdmUoYnVuZGxlLm5hbWUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2VuZXJhbCBpbnRlcmZhY2UgdXNlZCB0byBsb2FkIGFzc2V0cyB3aXRoIGEgcHJvZ3Jlc3Npb24gY2FsbGJhY2sgYW5kIGEgY29tcGxldGUgY2FsbGJhY2suIFlvdSBjYW4gYWNoaWV2ZSBhbG1vc3QgYWxsIGVmZmVjdCB5b3Ugd2FudCB3aXRoIGNvbWJpbmF0aW9uIG9mIGByZXF1ZXN0c2AgYW5kIGBvcHRpb25zYC5cbiAgICAgKiBJdCBpcyBoaWdobHkgcmVjb21tZW5kZWQgdGhhdCB5b3UgdXNlIG1vcmUgc2ltcGxlIEFQSSwgc3VjaCBhcyBgbG9hZGAsIGBsb2FkRGlyYCBldGMuIEV2ZXJ5IGN1c3RvbSBwYXJhbWV0ZXIgaW4gYG9wdGlvbnNgIHdpbGwgYmUgZGlzdHJpYnV0ZSB0byBlYWNoIG9mIGByZXF1ZXN0c2AuIFxuICAgICAqIGlmIHJlcXVlc3QgYWxyZWFkeSBoYXMgc2FtZSBvbmUsIHRoZSBwYXJhbWV0ZXIgaW4gcmVxdWVzdCB3aWxsIGJlIGdpdmVuIHByaW9yaXR5LiBCZXNpZGVzLCBpZiByZXF1ZXN0IGhhcyBkZXBlbmRlbmNpZXMsIGBvcHRpb25zYCB3aWxsIGRpc3RyaWJ1dGUgdG8gZGVwZW5kZW5jaWVzIHRvby5cbiAgICAgKiBFdmVyeSBjdXN0b20gcGFyYW1ldGVyIGluIGByZXF1ZXN0c2Agd2lsbCBiZSB0cmFuZmVyZWQgdG8gaGFuZGxlciBvZiBgZG93bmxvYWRlcmAgYW5kIGBwYXJzZXJgIGFzIGBvcHRpb25zYC4gXG4gICAgICogWW91IGNhbiByZWdpc3RlciB5b3Ugb3duIGhhbmRsZXIgZG93bmxvYWRlciBvciBwYXJzZXIgdG8gY29sbGVjdCB0aGVzZSBjdXN0b20gcGFyYW1ldGVycyBmb3Igc29tZSBlZmZlY3QuXG4gICAgICogXG4gICAgICogUmVzZXJ2ZWQgS2V5d29yZDogYHV1aWRgLCBgdXJsYCwgYHBhdGhgLCBgZGlyYCwgYHNjZW5lYCwgYHR5cGVgLCBgcHJpb3JpdHlgLCBgcHJlc2V0YCwgYGF1ZGlvTG9hZE1vZGVgLCBgZXh0YCwgYGJ1bmRsZWAsIGBvbkZpbGVQcm9ncmVzc2AsIGBtYXhDb25jdXJyZW5jeWAsIGBtYXhSZXF1ZXN0c1BlckZyYW1lYFxuICAgICAqIGBtYXhSZXRyeUNvdW50YCwgYHZlcnNpb25gLCBgcmVzcG9uc2VUeXBlYCwgYHdpdGhDcmVkZW50aWFsc2AsIGBtaW1lVHlwZWAsIGB0aW1lb3V0YCwgYGhlYWRlcmAsIGByZWxvYWRgLCBgY2FjaGVBc3NldGAsIGBjYWNoZUVuYWJsZWRgLFxuICAgICAqIFBsZWFzZSBETyBOT1QgdXNlIHRoZXNlIHdvcmRzIGFzIGN1c3RvbSBvcHRpb25zIVxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDpgJrnlKjliqDovb3otYTmupDmjqXlj6PvvIzlj6/kvKDlhaXov5vluqblm57osIPku6Xlj4rlrozmiJDlm57osIPvvIzpgJrov4fnu4TlkIggYHJlcXVlc3RgIOWSjCBgb3B0aW9uc2Ag5Y+C5pWw77yM5Yeg5LmO5Y+v5Lul5a6e546w5ZKM5omp5bGV5omA5pyJ5oOz6KaB55qE5Yqg6L295pWI5p6c44CC6Z2e5bi45bu66K6u5L2g5L2/55So5pu0566A5Y2V55qEQVBJ77yM5L6L5aaCIGBsb2FkYOOAgWBsb2FkRGlyYCDnrYnjgIJcbiAgICAgKiBgb3B0aW9uc2Ag5Lit55qE6Ieq5a6a5LmJ5Y+C5pWw5bCG5Lya5YiG5Y+R5YiwIGByZXF1ZXN0c2Ag55qE5q+P5LiA6aG55Lit77yM5aaC5p6ccmVxdWVzdOS4reW3suWtmOWcqOWQjOWQjeeahOWPguaVsOWImeS7pSBgcmVxdWVzdHNgIOS4reS4uuWHhu+8jOWQjOaXtuWmguaenOacieWFtuS7llxuICAgICAqIOS+nei1lui1hOa6kO+8jOWImSBgb3B0aW9uc2Ag5Lit55qE5Y+C5pWw5Lya57un57ut5ZCR5L6d6LWW6aG55Lit5YiG5Y+R44CCcmVxdWVzdOS4reeahOiHquWumuS5ieWPguaVsOmDveS8muS7pSBgb3B0aW9uc2Ag5b2i5byP5Lyg5YWl5Yqg6L295rWB56iL5Lit55qEIGBkb3dubG9hZGVyYCwgYHBhcnNlcmAg55qE5pa55rOV5LitLCDkvaDlj6/ku6VcbiAgICAgKiDmianlsZUgYGRvd25sb2FkZXJgLCBgcGFyc2VyYCDmlLbpm4blj4LmlbDlrozmiJDmg7Plrp7njrDnmoTmlYjmnpzjgIJcbiAgICAgKiBcbiAgICAgKiDkv53nlZnlhbPplK7lrZc6IGB1dWlkYCwgYHVybGAsIGBwYXRoYCwgYGRpcmAsIGBzY2VuZWAsIGB0eXBlYCwgYHByaW9yaXR5YCwgYHByZXNldGAsIGBhdWRpb0xvYWRNb2RlYCwgYGV4dGAsIGBidW5kbGVgLCBgb25GaWxlUHJvZ3Jlc3NgLCBgbWF4Q29uY3VycmVuY3lgLCBgbWF4UmVxdWVzdHNQZXJGcmFtZWBcbiAgICAgKiBgbWF4UmV0cnlDb3VudGAsIGB2ZXJzaW9uYCwgYHJlc3BvbnNlVHlwZWAsIGB3aXRoQ3JlZGVudGlhbHNgLCBgbWltZVR5cGVgLCBgdGltZW91dGAsIGBoZWFkZXJgLCBgcmVsb2FkYCwgYGNhY2hlQXNzZXRgLCBgY2FjaGVFbmFibGVkYCxcbiAgICAgKiDor7fkuI3opoHkvb/nlKjov5nkupvlrZfmrrXkuLroh6rlrprkuYnlj4LmlbAhXG4gICAgICogXG4gICAgICogQG1ldGhvZCBsb2FkQW55XG4gICAgICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW118T2JqZWN0fE9iamVjdFtdfSByZXF1ZXN0cyAtIFRoZSByZXF1ZXN0IHlvdSB3YW50IHRvIGxvYWRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gT3B0aW9uYWwgcGFyYW1ldGVyc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvblByb2dyZXNzXSAtIENhbGxiYWNrIGludm9rZWQgd2hlbiBwcm9ncmVzc2lvbiBjaGFuZ2VcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb25Qcm9ncmVzcy5maW5pc2hlZCAtIFRoZSBudW1iZXIgb2YgdGhlIGl0ZW1zIHRoYXQgYXJlIGFscmVhZHkgY29tcGxldGVkXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9uUHJvZ3Jlc3MudG90YWwgLSBUaGUgdG90YWwgbnVtYmVyIG9mIHRoZSBpdGVtc1xuICAgICAqIEBwYXJhbSB7UmVxdWVzdEl0ZW19IG9uUHJvZ3Jlc3MuaXRlbSAtIFRoZSBjdXJyZW50IHJlcXVlc3QgaXRlbVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvbkNvbXBsZXRlXSAtIENhbGxiYWNrIGludm9rZWQgd2hlbiBmaW5pc2ggbG9hZGluZ1xuICAgICAqIEBwYXJhbSB7RXJyb3J9IG9uQ29tcGxldGUuZXJyIC0gVGhlIGVycm9yIG9jY3VyZWQgaW4gbG9hZGluZyBwcm9jZXNzLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvbkNvbXBsZXRlLmRhdGEgLSBUaGUgbG9hZGVkIGNvbnRlbnRcbiAgICAgKiBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNjLmFzc2V0TWFuYWdlci5sb2FkQW55KHt1cmw6ICdodHRwOi8vZXhhbXBsZS5jb20vYS5wbmcnfSwgKGVyciwgaW1nKSA9PiBjYy5sb2coaW1nKSk7XG4gICAgICogY2MuYXNzZXRNYW5hZ2VyLmxvYWRBbnkoWyc2MHNWWGlUSDFELzZBZnQ0TVJ0OVZDJ10sIChlcnIsIGFzc2V0cykgPT4gY2MubG9nKGFzc2V0cykpO1xuICAgICAqIGNjLmFzc2V0TWFuYWdlci5sb2FkQW55KFt7IHV1aWQ6ICcwY2JaYTVZNzFDVFpBY2NhSUZsdXVaJ30sIHt1cmw6ICdodHRwOi8vZXhhbXBsZS5jb20vYS5wbmcnfV0sIChlcnIsIGFzc2V0cykgPT4gY2MubG9nKGFzc2V0cykpO1xuICAgICAqIGNjLmFzc2V0TWFuYWdlci5kb3dubG9hZGVyLnJlZ2lzdGVyKCcuYXNzZXQnLCAodXJsLCBvcHRpb25zLCBvbkNvbXBsZXRlKSA9PiB7XG4gICAgICogICAgICB1cmwgKz0gJz91c2VyTmFtZT0nICsgb3B0aW9ucy51c2VyTmFtZSArIFwiJnBhc3N3b3JkPVwiICsgb3B0aW9ucy5wYXNzd29yZDtcbiAgICAgKiAgICAgIGNjLmFzc2V0TWFuYWdlci5kb3dubG9hZGVyLmRvd25sb2FkRmlsZSh1cmwsIG51bGwsIG9uQ29tcGxldGUpO1xuICAgICAqIH0pO1xuICAgICAqIGNjLmFzc2V0TWFuYWdlci5wYXJzZXIucmVnaXN0ZXIoJy5hc3NldCcsIChmaWxlLCBvcHRpb25zLCBvbkNvbXBsZXRlKSA9PiB7XG4gICAgICogICAgICB2YXIganNvbiA9IEpTT04ucGFyc2UoZmlsZSk7XG4gICAgICogICAgICB2YXIgc2tpbiA9IGpzb25bb3B0aW9ucy5za2luXTtcbiAgICAgKiAgICAgIHZhciBtb2RlbCA9IGpzb25bb3B0aW9ucy5tb2RlbF07XG4gICAgICogICAgICBvbkNvbXBsZXRlKG51bGwsIHtza2luLCBtb2RlbH0pO1xuICAgICAqIH0pO1xuICAgICAqIGNjLmFzc2V0TWFuYWdlci5sb2FkQW55KHsgdXJsOiAnaHR0cDovL2V4YW1wbGUuY29tL215LmFzc2V0Jywgc2tpbjogJ3h4eCcsIG1vZGVsOiAneHh4JywgdXNlck5hbWU6ICd4eHgnLCBwYXNzd29yZDogJ3h4eCcgfSk7XG4gICAgICogXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBsb2FkQW55KHJlcXVlc3RzOiBzdHJpbmcgfCBzdHJpbmdbXSB8IFJlY29yZDxzdHJpbmcsIGFueT4gfCBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4sIG9uUHJvZ3Jlc3M6IChmaW5pc2hlZDogbnVtYmVyLCB0b3RhbDogbnVtYmVyLCBpdGVtOiBjYy5Bc3NldE1hbmFnZXIuUmVxdWVzdEl0ZW0pID0+IHZvaWQsIG9uQ29tcGxldGU6IChlcnI6IEVycm9yLCBkYXRhOiBhbnkpID0+IHZvaWQpOiB2b2lkXG4gICAgICogbG9hZEFueShyZXF1ZXN0czogc3RyaW5nIHwgc3RyaW5nW10gfCBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgUmVjb3JkPHN0cmluZywgYW55PltdLCBvblByb2dyZXNzOiAoZmluaXNoZWQ6IG51bWJlciwgdG90YWw6IG51bWJlciwgaXRlbTogY2MuQXNzZXRNYW5hZ2VyLlJlcXVlc3RJdGVtKSA9PiB2b2lkLCBvbkNvbXBsZXRlOiAoZXJyOiBFcnJvciwgZGF0YTogYW55KSA9PiB2b2lkKTogdm9pZFxuICAgICAqIGxvYWRBbnkocmVxdWVzdHM6IHN0cmluZyB8IHN0cmluZ1tdIHwgUmVjb3JkPHN0cmluZywgYW55PiB8IFJlY29yZDxzdHJpbmcsIGFueT5bXSwgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55Piwgb25Db21wbGV0ZTogKGVycjogRXJyb3IsIGRhdGE6IGFueSkgPT4gdm9pZCk6IHZvaWRcbiAgICAgKiBsb2FkQW55KHJlcXVlc3RzOiBzdHJpbmcgfCBzdHJpbmdbXSB8IFJlY29yZDxzdHJpbmcsIGFueT4gfCBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sIG9uQ29tcGxldGU6IChlcnI6IEVycm9yLCBkYXRhOiBhbnkpID0+IHZvaWQpOiB2b2lkXG4gICAgICogbG9hZEFueShyZXF1ZXN0czogc3RyaW5nIHwgc3RyaW5nW10gfCBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgUmVjb3JkPHN0cmluZywgYW55PltdLCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogdm9pZFxuICAgICAqIGxvYWRBbnkocmVxdWVzdHM6IHN0cmluZyB8IHN0cmluZ1tdIHwgUmVjb3JkPHN0cmluZywgYW55PiB8IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IHZvaWRcbiAgICAgKi9cbiAgICBsb2FkQW55IChyZXF1ZXN0cywgb3B0aW9ucywgb25Qcm9ncmVzcywgb25Db21wbGV0ZSkge1xuICAgICAgICB2YXIgeyBvcHRpb25zLCBvblByb2dyZXNzLCBvbkNvbXBsZXRlIH0gPSBwYXJzZVBhcmFtZXRlcnMob3B0aW9ucywgb25Qcm9ncmVzcywgb25Db21wbGV0ZSk7XG4gICAgICAgIFxuICAgICAgICBvcHRpb25zLnByZXNldCA9IG9wdGlvbnMucHJlc2V0IHx8ICdkZWZhdWx0JztcbiAgICAgICAgcmVxdWVzdHMgPSBBcnJheS5pc0FycmF5KHJlcXVlc3RzKSA/IHJlcXVlc3RzLmNvbmNhdCgpIDogcmVxdWVzdHM7XG4gICAgICAgIGxldCB0YXNrID0gbmV3IFRhc2soe2lucHV0OiByZXF1ZXN0cywgb25Qcm9ncmVzcywgb25Db21wbGV0ZTogYXN5bmNpZnkob25Db21wbGV0ZSksIG9wdGlvbnN9KTtcbiAgICAgICAgcGlwZWxpbmUuYXN5bmModGFzayk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZW5lcmFsIGludGVyZmFjZSB1c2VkIHRvIHByZWxvYWQgYXNzZXRzIHdpdGggYSBwcm9ncmVzc2lvbiBjYWxsYmFjayBhbmQgYSBjb21wbGV0ZSBjYWxsYmFjay5JdCBpcyBoaWdobHkgcmVjb21tZW5kZWQgdGhhdCB5b3UgdXNlIG1vcmUgc2ltcGxlIEFQSSwgc3VjaCBhcyBgcHJlbG9hZFJlc2AsIGBwcmVsb2FkUmVzRGlyYCBldGMuXG4gICAgICogRXZlcnl0aGluZyBhYm91dCBwcmVsb2FkIGlzIGp1c3QgbGlrZXMgYGNjLmFzc2V0TWFuYWdlci5sb2FkQW55YCwgdGhlIGRpZmZlcmVuY2UgaXMgYGNjLmFzc2V0TWFuYWdlci5wcmVsb2FkQW55YCB3aWxsIG9ubHkgZG93bmxvYWQgYXNzZXQgYnV0IG5vdCBwYXJzZSBhc3NldC4gWW91IG5lZWQgdG8gaW52b2tlIGBjYy5hc3NldE1hbmFnZXIubG9hZEFueShwcmVsb2FkVGFzaylgIFxuICAgICAqIHRvIGZpbmlzaCBsb2FkaW5nIGFzc2V0XG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOmAmueUqOmihOWKoOi9vei1hOa6kOaOpeWPo++8jOWPr+S8oOWFpei/m+W6puWbnuiwg+S7peWPiuWujOaIkOWbnuiwg++8jOmdnuW4uOW7uuiuruS9oOS9v+eUqOabtOeugOWNleeahCBBUEkg77yM5L6L5aaCIGBwcmVsb2FkUmVzYCwgYHByZWxvYWRSZXNEaXJgIOetieOAgmBwcmVsb2FkQW55YCDlkowgYGxvYWRBbnlgIOWHoOS5juS4gOagt++8jOWMuuWIq+WcqOS6jiBgcHJlbG9hZEFueWAg5Y+q5Lya5LiL6L296LWE5rqQ77yM5LiN5Lya5Y676Kej5p6Q6LWE5rqQ77yM5L2g6ZyA6KaB6LCD55SoIGBjYy5hc3NldE1hbmFnZXIubG9hZEFueShwcmVsb2FkVGFzaylgXG4gICAgICog5p2l5a6M5oiQ6LWE5rqQ5Yqg6L2944CCXG4gICAgICogXG4gICAgICogQG1ldGhvZCBwcmVsb2FkQW55XG4gICAgICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW118T2JqZWN0fE9iamVjdFtdfSByZXF1ZXN0cyAtIFRoZSByZXF1ZXN0IHlvdSB3YW50IHRvIHByZWxvYWRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gT3B0aW9uYWwgcGFyYW1ldGVyc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvblByb2dyZXNzXSAtIENhbGxiYWNrIGludm9rZWQgd2hlbiBwcm9ncmVzc2lvbiBjaGFuZ2VcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb25Qcm9ncmVzcy5maW5pc2hlZCAtIFRoZSBudW1iZXIgb2YgdGhlIGl0ZW1zIHRoYXQgYXJlIGFscmVhZHkgY29tcGxldGVkXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9uUHJvZ3Jlc3MudG90YWwgLSBUaGUgdG90YWwgbnVtYmVyIG9mIHRoZSBpdGVtc1xuICAgICAqIEBwYXJhbSB7UmVxdWVzdEl0ZW19IG9uUHJvZ3Jlc3MuaXRlbSAtIFRoZSBjdXJyZW50IHJlcXVlc3QgaXRlbVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvbkNvbXBsZXRlXSAtIENhbGxiYWNrIGludm9rZWQgd2hlbiBmaW5pc2ggcHJlbG9hZGluZ1xuICAgICAqIEBwYXJhbSB7RXJyb3J9IG9uQ29tcGxldGUuZXJyIC0gVGhlIGVycm9yIG9jY3VyZWQgaW4gcHJlbG9hZGluZyBwcm9jZXNzLlxuICAgICAqIEBwYXJhbSB7UmVxdWVzdEl0ZW1bXX0gb25Db21wbGV0ZS5pdGVtcyAtIFRoZSBwcmVsb2FkZWQgY29udGVudFxuICAgICAqIFxuICAgICAqIEBleGFtcGxlXG4gICAgICogY2MuYXNzZXRNYW5hZ2VyLnByZWxvYWRBbnkoJzBjYlphNVk3MUNUWkFjY2FJRmx1dVonLCAoZXJyKSA9PiBjYy5hc3NldE1hbmFnZXIubG9hZEFueSgnMGNiWmE1WTcxQ1RaQWNjYUlGbHV1WicpKTtcbiAgICAgKiBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHByZWxvYWRBbnkocmVxdWVzdHM6IHN0cmluZyB8IHN0cmluZ1tdIHwgUmVjb3JkPHN0cmluZywgYW55PiB8IFJlY29yZDxzdHJpbmcsIGFueT5bXSwgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55Piwgb25Qcm9ncmVzczogKGZpbmlzaGVkOiBudW1iZXIsIHRvdGFsOiBudW1iZXIsIGl0ZW06IGNjLkFzc2V0TWFuYWdlci5SZXF1ZXN0SXRlbSkgPT4gdm9pZCwgb25Db21wbGV0ZTogKGVycjogRXJyb3IsIGl0ZW1zOiBjYy5Bc3NldE1hbmFnZXIuUmVxdWVzdEl0ZW1bXSkgPT4gdm9pZCk6IHZvaWRcbiAgICAgKiBwcmVsb2FkQW55KHJlcXVlc3RzOiBzdHJpbmcgfCBzdHJpbmdbXSB8IFJlY29yZDxzdHJpbmcsIGFueT4gfCBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sIG9uUHJvZ3Jlc3M6IChmaW5pc2hlZDogbnVtYmVyLCB0b3RhbDogbnVtYmVyLCBpdGVtOiBjYy5Bc3NldE1hbmFnZXIuUmVxdWVzdEl0ZW0pID0+IHZvaWQsIG9uQ29tcGxldGU6IChlcnI6IEVycm9yLCBpdGVtczogY2MuQXNzZXRNYW5hZ2VyLlJlcXVlc3RJdGVtW10pID0+IHZvaWQpOiB2b2lkXG4gICAgICogcHJlbG9hZEFueShyZXF1ZXN0czogc3RyaW5nIHwgc3RyaW5nW10gfCBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgUmVjb3JkPHN0cmluZywgYW55PltdLCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvbkNvbXBsZXRlOiAoZXJyOiBFcnJvciwgaXRlbXM6IGNjLkFzc2V0TWFuYWdlci5SZXF1ZXN0SXRlbVtdKSA9PiB2b2lkKTogdm9pZFxuICAgICAqIHByZWxvYWRBbnkocmVxdWVzdHM6IHN0cmluZyB8IHN0cmluZ1tdIHwgUmVjb3JkPHN0cmluZywgYW55PiB8IFJlY29yZDxzdHJpbmcsIGFueT5bXSwgb25Db21wbGV0ZTogKGVycjogRXJyb3IsIGl0ZW1zOiBjYy5Bc3NldE1hbmFnZXIuUmVxdWVzdEl0ZW1bXSkgPT4gdm9pZCk6IHZvaWRcbiAgICAgKiBwcmVsb2FkQW55KHJlcXVlc3RzOiBzdHJpbmcgfCBzdHJpbmdbXSB8IFJlY29yZDxzdHJpbmcsIGFueT4gfCBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4pOiB2b2lkXG4gICAgICogcHJlbG9hZEFueShyZXF1ZXN0czogc3RyaW5nIHwgc3RyaW5nW10gfCBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgUmVjb3JkPHN0cmluZywgYW55PltdKTogdm9pZFxuICAgICAqL1xuICAgIHByZWxvYWRBbnkgKHJlcXVlc3RzLCBvcHRpb25zLCBvblByb2dyZXNzLCBvbkNvbXBsZXRlKSB7XG4gICAgICAgIHZhciB7IG9wdGlvbnMsIG9uUHJvZ3Jlc3MsIG9uQ29tcGxldGUgfSA9IHBhcnNlUGFyYW1ldGVycyhvcHRpb25zLCBvblByb2dyZXNzLCBvbkNvbXBsZXRlKTtcbiAgICBcbiAgICAgICAgb3B0aW9ucy5wcmVzZXQgPSBvcHRpb25zLnByZXNldCB8fCAncHJlbG9hZCc7XG4gICAgICAgIHJlcXVlc3RzID0gQXJyYXkuaXNBcnJheShyZXF1ZXN0cykgPyByZXF1ZXN0cy5jb25jYXQoKSA6IHJlcXVlc3RzO1xuICAgICAgICB2YXIgdGFzayA9IG5ldyBUYXNrKHtpbnB1dDogcmVxdWVzdHMsIG9uUHJvZ3Jlc3MsIG9uQ29tcGxldGU6IGFzeW5jaWZ5KG9uQ29tcGxldGUpLCBvcHRpb25zfSk7XG4gICAgICAgIGZldGNoUGlwZWxpbmUuYXN5bmModGFzayk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBMb2FkIG5hdGl2ZSBmaWxlIG9mIGFzc2V0LCBpZiB5b3UgY2hlY2sgdGhlIG9wdGlvbiAnQXN5bmMgTG9hZCBBc3NldHMnLCB5b3UgbWF5IG5lZWQgdG8gbG9hZCBuYXRpdmUgZmlsZSB3aXRoIHRoaXMgYmVmb3JlIHlvdSB1c2UgdGhlIGFzc2V0XG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOWKoOi9vei1hOa6kOeahOWOn+eUn+aWh+S7tu+8jOWmguaenOS9oOWLvumAieS6hiflu7bov5/liqDovb3otYTmupAn6YCJ6aG577yM5L2g5Y+v6IO96ZyA6KaB5Zyo5L2/55So6LWE5rqQ5LmL5YmN6LCD55So5q2k5pa55rOV5p2l5Yqg6L295Y6f55Sf5paH5Lu2XG4gICAgICogXG4gICAgICogQG1ldGhvZCBwb3N0TG9hZE5hdGl2ZVxuICAgICAqIEBwYXJhbSB7QXNzZXR9IGFzc2V0IC0gVGhlIGFzc2V0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIFNvbWUgb3B0aW9uYWwgcGFyYW1ldGVyc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvbkNvbXBsZXRlXSAtIENhbGxiYWNrIGludm9rZWQgd2hlbiBmaW5pc2ggbG9hZGluZ1xuICAgICAqIEBwYXJhbSB7RXJyb3J9IG9uQ29tcGxldGUuZXJyIC0gVGhlIGVycm9yIG9jY3VyZWQgaW4gbG9hZGluZyBwcm9jZXNzLlxuICAgICAqIFxuICAgICAqIEBleGFtcGxlXG4gICAgICogY2MuYXNzZXRNYW5hZ2VyLnBvc3RMb2FkTmF0aXZlKHRleHR1cmUsIChlcnIpID0+IGNvbnNvbGUubG9nKGVycikpO1xuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcG9zdExvYWROYXRpdmUoYXNzZXQ6IGNjLkFzc2V0LCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvbkNvbXBsZXRlOiAoZXJyOiBFcnJvcikgPT4gdm9pZCk6IHZvaWRcbiAgICAgKiBwb3N0TG9hZE5hdGl2ZShhc3NldDogY2MuQXNzZXQsIG9uQ29tcGxldGU6IChlcnI6IEVycm9yKSA9PiB2b2lkKTogdm9pZFxuICAgICAqIHBvc3RMb2FkTmF0aXZlKGFzc2V0OiBjYy5Bc3NldCwgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55Pik6IHZvaWRcbiAgICAgKiBwb3N0TG9hZE5hdGl2ZShhc3NldDogY2MuQXNzZXQpOiB2b2lkXG4gICAgICovXG4gICAgcG9zdExvYWROYXRpdmUgKGFzc2V0LCBvcHRpb25zLCBvbkNvbXBsZXRlKSB7XG4gICAgICAgIGlmICghKGFzc2V0IGluc3RhbmNlb2YgY2MuQXNzZXQpKSB0aHJvdyBuZXcgRXJyb3IoJ2lucHV0IGlzIG5vdCBhc3NldCcpO1xuICAgICAgICB2YXIgeyBvcHRpb25zLCBvbkNvbXBsZXRlIH0gPSBwYXJzZVBhcmFtZXRlcnMob3B0aW9ucywgdW5kZWZpbmVkLCBvbkNvbXBsZXRlKTtcblxuICAgICAgICBpZiAoIWFzc2V0Ll9uYXRpdmUgfHwgYXNzZXQuX25hdGl2ZUFzc2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gYXN5bmNpZnkob25Db21wbGV0ZSkobnVsbCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGVwZW5kID0gZGVwZW5kVXRpbC5nZXROYXRpdmVEZXAoYXNzZXQuX3V1aWQpO1xuICAgICAgICBpZiAoZGVwZW5kKSB7XG4gICAgICAgICAgICBpZiAoIWJ1bmRsZXMuaGFzKGRlcGVuZC5idW5kbGUpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJ1bmRsZSA9IGJ1bmRsZXMuZmluZChmdW5jdGlvbiAoYnVuZGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBidW5kbGUuZ2V0QXNzZXRJbmZvKGFzc2V0Ll91dWlkKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoYnVuZGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZC5idW5kbGUgPSBidW5kbGUubmFtZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMubG9hZEFueShkZXBlbmQsIG9wdGlvbnMsIGZ1bmN0aW9uIChlcnIsIG5hdGl2ZSkge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhc3NldC5pc1ZhbGlkICYmICFhc3NldC5fbmF0aXZlQXNzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0Ll9uYXRpdmVBc3NldCA9IG5hdGl2ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcihlcnIubWVzc2FnZSwgZXJyLnN0YWNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZSAmJiBvbkNvbXBsZXRlKGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogTG9hZCByZW1vdGUgYXNzZXQgd2l0aCB1cmwsIHN1Y2ggYXMgYXVkaW8sIGltYWdlLCB0ZXh0IGFuZCBzbyBvbi5cbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog5L2/55SoIHVybCDliqDovb3ov5znqIvotYTmupDvvIzkvovlpoLpn7PpopHvvIzlm77niYfvvIzmlofmnKznrYnnrYnjgIJcbiAgICAgKiBcbiAgICAgKiBAbWV0aG9kIGxvYWRSZW1vdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIHVybCBvZiBhc3NldFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSBTb21lIG9wdGlvbmFsIHBhcmFtZXRlcnNcbiAgICAgKiBAcGFyYW0ge2NjLkF1ZGlvQ2xpcC5Mb2FkTW9kZX0gW29wdGlvbnMuYXVkaW9Mb2FkTW9kZV0gLSBJbmRpY2F0ZSB3aGljaCBtb2RlIGF1ZGlvIHlvdSB3YW50IHRvIGxvYWRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZXh0XSAtIElmIHRoZSB1cmwgZG9lcyBub3QgaGF2ZSBhIGV4dGVuc2lvbiBuYW1lLCB5b3UgY2FuIHNwZWNpZnkgb25lIG1hbnVhbGx5LlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvbkNvbXBsZXRlXSAtIENhbGxiYWNrIGludm9rZWQgd2hlbiBmaW5pc2ggbG9hZGluZ1xuICAgICAqIEBwYXJhbSB7RXJyb3J9IG9uQ29tcGxldGUuZXJyIC0gVGhlIGVycm9yIG9jY3VyZWQgaW4gbG9hZGluZyBwcm9jZXNzLlxuICAgICAqIEBwYXJhbSB7QXNzZXR9IG9uQ29tcGxldGUuYXNzZXQgLSBUaGUgbG9hZGVkIHRleHR1cmVcbiAgICAgKiBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNjLmFzc2V0TWFuYWdlci5sb2FkUmVtb3RlKCdodHRwOi8vd3d3LmNsb3VkLmNvbS90ZXN0MS5qcGcnLCAoZXJyLCB0ZXh0dXJlKSA9PiBjb25zb2xlLmxvZyhlcnIpKTtcbiAgICAgKiBjYy5hc3NldE1hbmFnZXIubG9hZFJlbW90ZSgnaHR0cDovL3d3dy5jbG91ZC5jb20vdGVzdDIubXAzJywgKGVyciwgYXVkaW9DbGlwKSA9PiBjb25zb2xlLmxvZyhlcnIpKTtcbiAgICAgKiBjYy5hc3NldE1hbmFnZXIubG9hZFJlbW90ZSgnaHR0cDovL3d3dy5jbG91ZC5jb20vdGVzdDMnLCB7IGV4dDogJy5wbmcnIH0sIChlcnIsIHRleHR1cmUpID0+IGNvbnNvbGUubG9nKGVycikpO1xuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbG9hZFJlbW90ZTxUIGV4dGVuZHMgY2MuQXNzZXQ+KHVybDogc3RyaW5nLCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvbkNvbXBsZXRlOiAoZXJyOiBFcnJvciwgYXNzZXQ6IFQpID0+IHZvaWQpOiB2b2lkXG4gICAgICogbG9hZFJlbW90ZTxUIGV4dGVuZHMgY2MuQXNzZXQ+KHVybDogc3RyaW5nLCBvbkNvbXBsZXRlOiAoZXJyOiBFcnJvciwgYXNzZXQ6IFQpID0+IHZvaWQpOiB2b2lkXG4gICAgICogbG9hZFJlbW90ZTxUIGV4dGVuZHMgY2MuQXNzZXQ+KHVybDogc3RyaW5nLCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogdm9pZFxuICAgICAqIGxvYWRSZW1vdGU8VCBleHRlbmRzIGNjLkFzc2V0Pih1cmw6IHN0cmluZyk6IHZvaWRcbiAgICAgKi9cbiAgICBsb2FkUmVtb3RlICh1cmwsIG9wdGlvbnMsIG9uQ29tcGxldGUpIHtcbiAgICAgICAgdmFyIHsgb3B0aW9ucywgb25Db21wbGV0ZSB9ID0gcGFyc2VQYXJhbWV0ZXJzKG9wdGlvbnMsIHVuZGVmaW5lZCwgb25Db21wbGV0ZSk7XG5cbiAgICAgICAgaWYgKHRoaXMuYXNzZXRzLmhhcyh1cmwpKSB7XG4gICAgICAgICAgICByZXR1cm4gYXN5bmNpZnkob25Db21wbGV0ZSkobnVsbCwgdGhpcy5hc3NldHMuZ2V0KHVybCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0aW9ucy5fX2lzTmF0aXZlX18gPSB0cnVlO1xuICAgICAgICBvcHRpb25zLnByZXNldCA9IG9wdGlvbnMucHJlc2V0IHx8ICdyZW1vdGUnO1xuICAgICAgICB0aGlzLmxvYWRBbnkoe3VybH0sIG9wdGlvbnMsIG51bGwsIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcihlcnIubWVzc2FnZSwgZXJyLnN0YWNrKTtcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlICYmIG9uQ29tcGxldGUoZXJyLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZhY3RvcnkuY3JlYXRlKHVybCwgZGF0YSwgb3B0aW9ucy5leHQgfHwgY2MucGF0aC5leHRuYW1lKHVybCksIG9wdGlvbnMsIGZ1bmN0aW9uIChlcnIsIG91dCkge1xuICAgICAgICAgICAgICAgICAgICBvbkNvbXBsZXRlICYmIG9uQ29tcGxldGUoZXJyLCBvdXQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIExvYWQgc2NyaXB0IFxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDliqDovb3ohJrmnKxcbiAgICAgKiBcbiAgICAgKiBAbWV0aG9kIGxvYWRTY3JpcHRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gdXJsIC0gVXJsIG9mIHRoZSBzY3JpcHRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gU29tZSBvcHRpb25hbCBwYXJhbXRlcnNcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmFzeW5jXSAtIEluZGljYXRlIHdoZXRoZXIgb3Igbm90IGxvYWRpbmcgcHJvY2VzcyBzaG91bGQgYmUgYXN5bmNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25Db21wbGV0ZV0gLSBDYWxsYmFjayB3aGVuIHNjcmlwdCBsb2FkZWQgb3IgZmFpbGVkXG4gICAgICogQHBhcmFtIHtFcnJvcn0gb25Db21wbGV0ZS5lcnIgLSBUaGUgb2NjdXJyZWQgZXJyb3IsIG51bGwgaW5kaWNldGVzIHN1Y2Nlc3NcbiAgICAgKiBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGxvYWRTY3JpcHQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9pbmRleC5qcycsIG51bGwsIChlcnIpID0+IGNvbnNvbGUubG9nKGVycikpO1xuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbG9hZFNjcmlwdCh1cmw6IHN0cmluZ3xzdHJpbmdbXSwgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55Piwgb25Db21wbGV0ZTogKGVycjogRXJyb3IpID0+IHZvaWQpOiB2b2lkXG4gICAgICogbG9hZFNjcmlwdCh1cmw6IHN0cmluZ3xzdHJpbmdbXSwgb25Db21wbGV0ZTogKGVycjogRXJyb3IpID0+IHZvaWQpOiB2b2lkXG4gICAgICogbG9hZFNjcmlwdCh1cmw6IHN0cmluZ3xzdHJpbmdbXSwgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55Pik6IHZvaWRcbiAgICAgKiBsb2FkU2NyaXB0KHVybDogc3RyaW5nfHN0cmluZ1tdKTogdm9pZFxuICAgICAqL1xuICAgIGxvYWRTY3JpcHQgKHVybCwgb3B0aW9ucywgb25Db21wbGV0ZSkge1xuICAgICAgICB2YXIgeyBvcHRpb25zLCBvbkNvbXBsZXRlIH0gPSBwYXJzZVBhcmFtZXRlcnMob3B0aW9ucywgdW5kZWZpbmVkLCBvbkNvbXBsZXRlKTtcbiAgICAgICAgb3B0aW9ucy5fX3JlcXVlc3RUeXBlX18gPSBSZXF1ZXN0VHlwZS5VUkw7XG4gICAgICAgIG9wdGlvbnMucHJlc2V0ID0gb3B0aW9ucy5wcmVzZXQgfHwgJ3NjcmlwdCc7XG4gICAgICAgIHRoaXMubG9hZEFueSh1cmwsIG9wdGlvbnMsIG9uQ29tcGxldGUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogbG9hZCBidW5kbGVcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog5Yqg6L296LWE5rqQ5YyFXG4gICAgICogXG4gICAgICogQG1ldGhvZCBsb2FkQnVuZGxlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVPclVybCAtIFRoZSBuYW1lIG9yIHJvb3QgcGF0aCBvZiBidW5kbGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gU29tZSBvcHRpb25hbCBwYXJhbXRlciwgc2FtZSBsaWtlIGRvd25sb2FkZXIuZG93bmxvYWRGaWxlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLnZlcnNpb25dIC0gVGhlIHZlcnNpb24gb2YgdGhpcyBidW5kbGUsIHlvdSBjYW4gY2hlY2sgY29uZmlnLmpzb24gaW4gdGhpcyBidW5kbGVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25Db21wbGV0ZV0gLSBDYWxsYmFjayB3aGVuIGJ1bmRsZSBsb2FkZWQgb3IgZmFpbGVkXG4gICAgICogQHBhcmFtIHtFcnJvcn0gb25Db21wbGV0ZS5lcnIgLSBUaGUgb2NjdXJyZWQgZXJyb3IsIG51bGwgaW5kaWNldGVzIHN1Y2Nlc3NcbiAgICAgKiBAcGFyYW0ge0J1bmRsZX0gb25Db21wbGV0ZS5idW5kbGUgLSBUaGUgbG9hZGVkIGJ1bmRsZVxuICAgICAqIFxuICAgICAqIEBleGFtcGxlXG4gICAgICogbG9hZEJ1bmRsZSgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL3Rlc3QnLCBudWxsLCAoZXJyLCBidW5kbGUpID0+IGNvbnNvbGUubG9nKGVycikpO1xuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbG9hZEJ1bmRsZShuYW1lT3JVcmw6IHN0cmluZywgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55Piwgb25Db21wbGV0ZTogKGVycjogRXJyb3IsIGJ1bmRsZTogY2MuQXNzZXRNYW5hZ2VyLkJ1bmRsZSkgPT4gdm9pZCk6IHZvaWRcbiAgICAgKiBsb2FkQnVuZGxlKG5hbWVPclVybDogc3RyaW5nLCBvbkNvbXBsZXRlOiAoZXJyOiBFcnJvciwgYnVuZGxlOiBjYy5Bc3NldE1hbmFnZXIuQnVuZGxlKSA9PiB2b2lkKTogdm9pZFxuICAgICAqIGxvYWRCdW5kbGUobmFtZU9yVXJsOiBzdHJpbmcsIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4pOiB2b2lkXG4gICAgICogbG9hZEJ1bmRsZShuYW1lT3JVcmw6IHN0cmluZyk6IHZvaWRcbiAgICAgKi9cbiAgICBsb2FkQnVuZGxlIChuYW1lT3JVcmwsIG9wdGlvbnMsIG9uQ29tcGxldGUpIHtcbiAgICAgICAgdmFyIHsgb3B0aW9ucywgb25Db21wbGV0ZSB9ID0gcGFyc2VQYXJhbWV0ZXJzKG9wdGlvbnMsIHVuZGVmaW5lZCwgb25Db21wbGV0ZSk7XG5cbiAgICAgICAgbGV0IGJ1bmRsZU5hbWUgPSBjYy5wYXRoLmJhc2VuYW1lKG5hbWVPclVybCk7XG5cbiAgICAgICAgaWYgKHRoaXMuYnVuZGxlcy5oYXMoYnVuZGxlTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBhc3luY2lmeShvbkNvbXBsZXRlKShudWxsLCB0aGlzLmdldEJ1bmRsZShidW5kbGVOYW1lKSk7XG4gICAgICAgIH1cblxuICAgICAgICBvcHRpb25zLnByZXNldCA9IG9wdGlvbnMucHJlc2V0IHx8ICdidW5kbGUnO1xuICAgICAgICBvcHRpb25zLmV4dCA9ICdidW5kbGUnO1xuICAgICAgICB0aGlzLmxvYWRSZW1vdGUobmFtZU9yVXJsLCBvcHRpb25zLCBvbkNvbXBsZXRlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJlbGVhc2UgYXNzZXQgYW5kIGl0J3MgZGVwZW5kZW5jaWVzLlxuICAgICAqIFRoaXMgbWV0aG9kIHdpbGwgbm90IG9ubHkgcmVtb3ZlIHRoZSBjYWNoZSBvZiB0aGUgYXNzZXQgaW4gYXNzZXRNYW5hZ2VyLCBidXQgYWxzbyBjbGVhbiB1cCBpdHMgY29udGVudC5cbiAgICAgKiBGb3IgZXhhbXBsZSwgaWYgeW91IHJlbGVhc2UgYSB0ZXh0dXJlLCB0aGUgdGV4dHVyZSBhc3NldCBhbmQgaXRzIGdsIHRleHR1cmUgZGF0YSB3aWxsIGJlIGZyZWVkIHVwLlxuICAgICAqIE5vdGljZSwgdGhpcyBtZXRob2QgbWF5IGNhdXNlIHRoZSB0ZXh0dXJlIHRvIGJlIHVudXNhYmxlLCBpZiB0aGVyZSBhcmUgc3RpbGwgb3RoZXIgbm9kZXMgdXNlIHRoZSBzYW1lIHRleHR1cmUsIHRoZXkgbWF5IHR1cm4gdG8gYmxhY2sgYW5kIHJlcG9ydCBnbCBlcnJvcnMuXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOmHiuaUvui1hOa6kOS7peWPiuWFtuS+nei1lui1hOa6kCwg6L+Z5Liq5pa55rOV5LiN5LuF5Lya5LuOIGFzc2V0TWFuYWdlciDkuK3liKDpmaTotYTmupDnmoTnvJPlrZjlvJXnlKjvvIzov5jkvJrmuIXnkIblroPnmoTotYTmupDlhoXlrrnjgIJcbiAgICAgKiDmr5TlpoLor7TvvIzlvZPkvaDph4rmlL7kuIDkuKogdGV4dHVyZSDotYTmupDvvIzov5nkuKogdGV4dHVyZSDlkozlroPnmoQgZ2wg6LS05Zu+5pWw5o2u6YO95Lya6KKr6YeK5pS+44CCXG4gICAgICog5rOo5oSP77yM6L+Z5Liq5Ye95pWw5Y+v6IO95Lya5a+86Ie06LWE5rqQ6LS05Zu+5oiW6LWE5rqQ5omA5L6d6LWW55qE6LS05Zu+5LiN5Y+v55So77yM5aaC5p6c5Zy65pmv5Lit5a2Y5Zyo6IqC54K55LuN54S25L6d6LWW5ZCM5qC355qE6LS05Zu+77yM5a6D5Lus5Y+v6IO95Lya5Y+Y6buR5bm25oqlIEdMIOmUmeivr+OAglxuICAgICAqXG4gICAgICogQG1ldGhvZCByZWxlYXNlQXNzZXRcbiAgICAgKiBAcGFyYW0ge0Fzc2V0fSBhc3NldCAtIFRoZSBhc3NldCB0byBiZSByZWxlYXNlZFxuICAgICAqIFxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gcmVsZWFzZSBhIHRleHR1cmUgd2hpY2ggaXMgbm8gbG9uZ2VyIG5lZWRcbiAgICAgKiBjYy5hc3NldE1hbmFnZXIucmVsZWFzZUFzc2V0KHRleHR1cmUpO1xuICAgICAqXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiByZWxlYXNlQXNzZXQoYXNzZXQ6IGNjLkFzc2V0KTogdm9pZFxuICAgICAqL1xuICAgIHJlbGVhc2VBc3NldCAoYXNzZXQpIHtcbiAgICAgICAgcmVsZWFzZU1hbmFnZXIudHJ5UmVsZWFzZShhc3NldCwgdHJ1ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gXG4gICAgICogUmVsZWFzZSBhbGwgdW51c2VkIGFzc2V0cy4gUmVmZXIgdG8ge3sjY3Jvc3NMaW5rIFwiQXNzZXRNYW5hZ2VyL3JlbGVhc2VBc3NldDptZXRob2RcIn19e3svY3Jvc3NMaW5rfX0gZm9yIGRldGFpbGVkIGluZm9ybWF0aW9ucy5cbiAgICAgKiBcbiAgICAgKiAhI3poIFxuICAgICAqIOmHiuaUvuaJgOacieayoeacieeUqOWIsOeahOi1hOa6kOOAguivpue7huS/oeaBr+ivt+WPguiAgyB7eyNjcm9zc0xpbmsgXCJBc3NldE1hbmFnZXIvcmVsZWFzZUFzc2V0Om1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuICAgICAqXG4gICAgICogQG1ldGhvZCByZWxlYXNlVW51c2VkQXNzZXRzXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHJlbGVhc2VVbnVzZWRBc3NldHMoKTogdm9pZFxuICAgICAqL1xuICAgIHJlbGVhc2VVbnVzZWRBc3NldHMgKCkge1xuICAgICAgICBhc3NldHMuZm9yRWFjaChmdW5jdGlvbiAoYXNzZXQpIHtcbiAgICAgICAgICAgIHJlbGVhc2VNYW5hZ2VyLnRyeVJlbGVhc2UoYXNzZXQpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBcbiAgICAgKiBSZWxlYXNlIGFsbCBhc3NldHMuIFJlZmVyIHRvIHt7I2Nyb3NzTGluayBcIkFzc2V0TWFuYWdlci9yZWxlYXNlQXNzZXQ6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IGZvciBkZXRhaWxlZCBpbmZvcm1hdGlvbnMuXG4gICAgICogXG4gICAgICogISN6aCBcbiAgICAgKiDph4rmlL7miYDmnInotYTmupDjgILor6bnu4bkv6Hmga/or7flj4LogIMge3sjY3Jvc3NMaW5rIFwiQXNzZXRNYW5hZ2VyL3JlbGVhc2VBc3NldDptZXRob2RcIn19e3svY3Jvc3NMaW5rfX1cbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmVsZWFzZUFsbFxuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcmVsZWFzZUFsbCgpOiB2b2lkXG4gICAgICovXG4gICAgcmVsZWFzZUFsbCAoKSB7XG4gICAgICAgIGFzc2V0cy5mb3JFYWNoKGZ1bmN0aW9uIChhc3NldCkge1xuICAgICAgICAgICAgcmVsZWFzZU1hbmFnZXIudHJ5UmVsZWFzZShhc3NldCwgdHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBfdHJhbnNmb3JtIChpbnB1dCwgb3B0aW9ucykge1xuICAgICAgICB2YXIgc3ViVGFzayA9IFRhc2suY3JlYXRlKHtpbnB1dCwgb3B0aW9uc30pO1xuICAgICAgICB2YXIgdXJscyA9IFtdO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRyYW5zZm9ybVBpcGVsaW5lLnN5bmMoc3ViVGFzayk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHJlc3VsdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHJlc3VsdFtpXTtcbiAgICAgICAgICAgICAgICB2YXIgdXJsID0gaXRlbS51cmw7XG4gICAgICAgICAgICAgICAgaXRlbS5yZWN5Y2xlKCk7XG4gICAgICAgICAgICAgICAgdXJscy5wdXNoKHVybCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gc3ViVGFzay5vdXRwdXQubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc3ViVGFzay5vdXRwdXRbaV0ucmVjeWNsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2MuZXJyb3IoZS5tZXNzYWdlLCBlLnN0YWNrKTtcbiAgICAgICAgfVxuICAgICAgICBzdWJUYXNrLnJlY3ljbGUoKTtcbiAgICAgICAgcmV0dXJuIHVybHMubGVuZ3RoID4gMSA/IHVybHMgOiB1cmxzWzBdO1xuICAgIH1cbn07XG5cbmNjLkFzc2V0TWFuYWdlciA9IEFzc2V0TWFuYWdlcjtcbi8qKlxuICogQG1vZHVsZSBjY1xuICovXG4vKipcbiAqIEBwcm9wZXJ0eSBhc3NldE1hbmFnZXJcbiAqIEB0eXBlIHtBc3NldE1hbmFnZXJ9XG4gKi9cbmNjLmFzc2V0TWFuYWdlciA9IG5ldyBBc3NldE1hbmFnZXIoKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGNjLCAncmVzb3VyY2VzJywge1xuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBjYy5yZXNvdXJjZXMgaXMgYSBidW5kbGUgYW5kIGNvbnRyb2xzIGFsbCBhc3NldCB1bmRlciBhc3NldHMvcmVzb3VyY2VzXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIGNjLnJlc291cmNlcyDmmK/kuIDkuKogYnVuZGxl77yM55So5LqO566h55CG5omA5pyJ5ZyoIGFzc2V0cy9yZXNvdXJjZXMg5LiL55qE6LWE5rqQXG4gICAgICogXG4gICAgICogQHByb3BlcnR5IHJlc291cmNlc1xuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtBc3NldE1hbmFnZXIuQnVuZGxlfVxuICAgICAqL1xuICAgIGdldCAoKSB7XG4gICAgICAgIHJldHVybiBidW5kbGVzLmdldChCdWlsdGluQnVuZGxlTmFtZS5SRVNPVVJDRVMpO1xuICAgIH1cbn0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gY2MuYXNzZXRNYW5hZ2VyO1xuXG4vKipcbiAqICEjZW5cbiAqIFRoaXMgbW9kdWxlIGNvbnRyb2xzIGFzc2V0J3MgYmVoYXZpb3JzIGFuZCBpbmZvcm1hdGlvbiwgaW5jbHVkZSBsb2FkaW5nLCByZWxlYXNpbmcgZXRjLiBcbiAqIEFsbCBtZW1iZXIgY2FuIGJlIGFjY2Vzc2VkIHdpdGggYGNjLmFzc2V0TWFuYWdlcmAuIEFsbCBjbGFzcyBvciBlbnVtIGNhbiBiZSBhY2Nlc3NlZCB3aXRoIGBjYy5Bc3NldE1hbmFnZXJgXG4gKiBcbiAqICEjemhcbiAqIOatpOaooeWdl+euoeeQhui1hOa6kOeahOihjOS4uuWSjOS/oeaBr++8jOWMheaLrOWKoOi9ve+8jOmHiuaUvuetie+8jOaJgOacieaIkOWRmOiDveWkn+mAmui/hyBgY2MuYXNzZXRNYW5hZ2VyYCDosIPnlKguIOaJgOacieexu+Wei+aIluaemuS4vuiDvemAmui/hyBgY2MuQXNzZXRNYW5hZ2VyYCDorr/pl65cbiAqIFxuICogQG1vZHVsZSBjYy5Bc3NldE1hbmFnZXJcbiAqLyJdLCJzb3VyY2VSb290IjoiLyJ9