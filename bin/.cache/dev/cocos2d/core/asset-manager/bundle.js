
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/asset-manager/bundle.js';
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
var Config = require('./config');

var releaseManager = require('./releaseManager');

var _require = require('./utilities'),
    parseParameters = _require.parseParameters,
    parseLoadResArgs = _require.parseLoadResArgs;

var _require2 = require('./shared'),
    RequestType = _require2.RequestType,
    assets = _require2.assets,
    bundles = _require2.bundles;
/**
 * @module cc.AssetManager
 */

/**
 * !#en
 * A bundle contains an amount of assets(includes scene), you can load, preload, release asset which is in this bundle
 * 
 * !#zh
 * 一个包含一定数量资源（包括场景）的包，你可以加载，预加载，释放此包内的资源
 * 
 * @class Bundle
 */


function Bundle() {
  this._config = new Config();
}

Bundle.prototype = {
  /**
   * !#en
   * Create a bundle
   * 
   * !#zh
   * 创建一个 bundle
   * 
   * @method constructor
   * 
   * @typescript
   * constructor()
   */
  constructor: Bundle,

  /**
   * !#en
   * The name of this bundle
   * 
   * !#zh
   * 此 bundle 的名称
   * 
   * @property name
   * @type {string}
   */
  get name() {
    return this._config.name;
  },

  /**
   * !#en
   * The dependency of this bundle
   * 
   * !#zh
   * 此 bundle 的依赖
   * 
   * @property deps
   * @type {string[]}
   */
  get deps() {
    return this._config.deps;
  },

  /**
   * !#en
   * The root path of this bundle, such like 'http://example.com/bundle1'
   * 
   * !#zh
   * 此 bundle 的根路径, 例如 'http://example.com/bundle1'
   * 
   * @property base
   * @type {string}
   */
  get base() {
    return this._config.base;
  },

  /**
   * !#en
   * Get asset's info using path, only valid when asset is in bundle folder.
   *  
   * !#zh
   * 使用 path 获取资源的配置信息
   * 
   * @method getInfoWithPath
   * @param {string} path - The relative path of asset, such as 'images/a'
   * @param {Function} [type] - The constructor of asset, such as  `cc.Texture2D`
   * @returns {Object} The asset info 
   * 
   * @example
   * var info = bundle.getInfoWithPath('image/a', cc.Texture2D);
   * 
   * @typescript
   * getInfoWithPath (path: string, type?: typeof cc.Asset): Record<string, any>
   */
  getInfoWithPath: function getInfoWithPath(path, type) {
    return this._config.getInfoWithPath(path, type);
  },

  /**
   * !#en
   * Get all asset's info within specific folder
   * 
   * !#zh
   * 获取在某个指定文件夹下的所有资源信息
   * 
   * @method getDirWithPath
   * @param {string} path - The relative path of folder, such as 'images'
   * @param {Function} [type] - The constructor should be used to filter paths
   * @param {Array} [out] - The output array
   * @returns {Object[]} Infos
   * 
   * @example 
   * var infos = [];
   * bundle.getDirWithPath('images', cc.Texture2D, infos);
   * 
   * @typescript
   * getDirWithPath (path: string, type: typeof cc.Asset, out: Array<Record<string, any>>): Array<Record<string, any>>
   * getDirWithPath (path: string, type: typeof cc.Asset): Array<Record<string, any>>
   * getDirWithPath (path: string): Array<Record<string, any>>
   */
  getDirWithPath: function getDirWithPath(path, type, out) {
    return this._config.getDirWithPath(path, type, out);
  },

  /**
   * !#en
   * Get asset's info with uuid
   * 
   * !#zh
   * 通过 uuid 获取资源信息
   * 
   * @method getAssetInfo
   * @param {string} uuid - The asset's uuid
   * @returns {Object} info 
   * 
   * @example
   * var info = bundle.getAssetInfo('fcmR3XADNLgJ1ByKhqcC5Z');
   * 
   * @typescript
   * getAssetInfo (uuid: string): Record<string, any>
   */
  getAssetInfo: function getAssetInfo(uuid) {
    return this._config.getAssetInfo(uuid);
  },

  /**
   * !#en
   * Get scene'info with name
   * 
   * !#zh
   * 通过场景名获取场景信息
   * 
   * @method getSceneInfo
   * @param {string} name - The name of scene
   * @return {Object} info
   * 
   * @example
   * var info = bundle.getSceneInfo('first.fire');
   * 
   * @typescript
   * getSceneInfo(name: string): Record<string, any>
   */
  getSceneInfo: function getSceneInfo(name) {
    return this._config.getSceneInfo(name);
  },

  /**
   * !#en
   * Initialize this bundle with options
   * 
   * !#zh
   * 初始化此 bundle
   * 
   * @method init
   * @param {Object} options 
   * 
   * @typescript
   * init(options: Record<string, any>): void
   */
  init: function init(options) {
    this._config.init(options);

    bundles.add(options.name, this);
  },

  /**
   * !#en
   * Load the asset within this bundle by the path which is relative to bundle's path
   * 
   * !#zh
   * 通过相对路径加载分包中的资源。路径是相对分包文件夹路径的相对路径
   *
   * @method load
   * @param {String|String[]} paths - Paths of the target assets.The path is relative to the bundle's folder, extensions must be omitted.
   * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
   * @param {Function} [onProgress] - Callback invoked when progression change.
   * @param {Number} onProgress.finish - The number of the items that are already completed.
   * @param {Number} onProgress.total - The total number of the items.
   * @param {RequestItem} onProgress.item - The finished request item.
   * @param {Function} [onComplete] - Callback invoked when all assets loaded.
   * @param {Error} onComplete.error - The error info or null if loaded successfully.
   * @param {Asset|Asset[]} onComplete.assets - The loaded assets.
   *
   * @example
   * // load the texture (${project}/assets/resources/textures/background.jpg) from resources
   * cc.resources.load('textures/background', cc.Texture2D, (err, texture) => console.log(err));
   * 
   * // load the audio (${project}/assets/resources/music/hit.mp3) from resources
   * cc.resources.load('music/hit', cc.AudioClip, (err, audio) => console.log(err));
   * 
   * // load the prefab (${project}/assets/bundle1/misc/character/cocos) from bundle1 folder
   * bundle1.load('misc/character/cocos', cc.Prefab, (err, prefab) => console.log(err));
   *
   * // load the sprite frame (${project}/assets/some/xxx/bundle2/imgs/cocos.png) from bundle2 folder
   * bundle2.load('imgs/cocos', cc.SpriteFrame, null, (err, spriteFrame) => console.log(err));
   * 
   * @typescript
   * load<T extends cc.Asset>(paths: string, type: typeof cc.Asset, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, assets: T) => void): void
   * load<T extends cc.Asset>(paths: string[], type: typeof cc.Asset, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, assets: Array<T>) => void): void
   * load<T extends cc.Asset>(paths: string, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, assets: T) => void): void
   * load<T extends cc.Asset>(paths: string[], onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, assets: Array<T>) => void): void
   * load<T extends cc.Asset>(paths: string, type: typeof cc.Asset, onComplete?: (error: Error, assets: T) => void): void
   * load<T extends cc.Asset>(paths: string[], type: typeof cc.Asset, onComplete?: (error: Error, assets: Array<T>) => void): void
   * load<T extends cc.Asset>(paths: string, onComplete?: (error: Error, assets: T) => void): void
   * load<T extends cc.Asset>(paths: string[], onComplete?: (error: Error, assets: Array<T>) => void): void
   */
  load: function load(paths, type, onProgress, onComplete) {
    var _parseLoadResArgs = parseLoadResArgs(type, onProgress, onComplete),
        type = _parseLoadResArgs.type,
        onProgress = _parseLoadResArgs.onProgress,
        onComplete = _parseLoadResArgs.onComplete;

    cc.assetManager.loadAny(paths, {
      __requestType__: RequestType.PATH,
      type: type,
      bundle: this.name,
      __outputAsArray__: Array.isArray(paths)
    }, onProgress, onComplete);
  },

  /**
   * !#en
   * Preload the asset within this bundle by the path which is relative to bundle's path. 
   * After calling this method, you still need to finish loading by calling `Bundle.load`.
   * It will be totally fine to call `Bundle.load` at any time even if the preloading is not
   * yet finished
   * 
   * !#zh
   * 通过相对路径预加载分包中的资源。路径是相对分包文件夹路径的相对路径。调用完后，你仍然需要通过 `Bundle.load` 来完成加载。
   * 就算预加载还没完成，你也可以直接调用 `Bundle.load`。
   *
   * @method preload
   * @param {String|String[]} paths - Paths of the target asset.The path is relative to bundle folder, extensions must be omitted.
   * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
   * @param {Function} [onProgress] - Callback invoked when progression change.
   * @param {Number} onProgress.finish - The number of the items that are already completed.
   * @param {Number} onProgress.total - The total number of the items.
   * @param {RequestItem} onProgress.item - The finished request item.
   * @param {Function} [onComplete] - Callback invoked when the resource loaded.
   * @param {Error} onComplete.error - The error info or null if loaded successfully.
   * @param {RequestItem[]} onComplete.items - The preloaded items.
   * 
   * @example
   * // preload the texture (${project}/assets/resources/textures/background.jpg) from resources
   * cc.resources.preload('textures/background', cc.Texture2D);
   * 
   * // preload the audio (${project}/assets/resources/music/hit.mp3) from resources
   * cc.resources.preload('music/hit', cc.AudioClip);
   * // wait for while
   * cc.resources.load('music/hit', cc.AudioClip, (err, audioClip) => {});
   * 
   * * // preload the prefab (${project}/assets/bundle1/misc/character/cocos) from bundle1 folder
   * bundle1.preload('misc/character/cocos', cc.Prefab);
   *
   * // load the sprite frame of (${project}/assets/bundle2/imgs/cocos.png) from bundle2 folder
   * bundle2.preload('imgs/cocos', cc.SpriteFrame);
   * // wait for while
   * bundle2.load('imgs/cocos', cc.SpriteFrame, (err, spriteFrame) => {});
   * 
   * @typescript
   * preload(paths: string|string[], type: typeof cc.Asset, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, items: RequestItem[]) => void): void
   * preload(paths: string|string[], onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, items: RequestItem[]) => void): void
   * preload(paths: string|string[], type: typeof cc.Asset, onComplete: (error: Error, items: RequestItem[]) => void): void
   * preload(paths: string|string[], type: typeof cc.Asset): void
   * preload(paths: string|string[], onComplete: (error: Error, items: RequestItem[]) => void): void
   * preload(paths: string|string[]): void
   */
  preload: function preload(paths, type, onProgress, onComplete) {
    var _parseLoadResArgs2 = parseLoadResArgs(type, onProgress, onComplete),
        type = _parseLoadResArgs2.type,
        onProgress = _parseLoadResArgs2.onProgress,
        onComplete = _parseLoadResArgs2.onComplete;

    cc.assetManager.preloadAny(paths, {
      __requestType__: RequestType.PATH,
      type: type,
      bundle: this.name
    }, onProgress, onComplete);
  },

  /**
   * !#en
   * Load all assets under a folder inside the bundle folder.<br>
   * <br>
   * Note: All asset paths in Creator use forward slashes, paths using backslashes will not work.
   * 
   * !#zh
   * 加载目标文件夹中的所有资源, 注意：路径中只能使用斜杠，反斜杠将停止工作
   *
   * @method loadDir
   * @param {string} dir - path of the target folder.The path is relative to the bundle folder, extensions must be omitted.
   * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
   * @param {Function} [onProgress] - Callback invoked when progression change.
   * @param {Number} onProgress.finish - The number of the items that are already completed.
   * @param {Number} onProgress.total - The total number of the items.
   * @param {Object} onProgress.item - The latest request item
   * @param {Function} [onComplete] - A callback which is called when all assets have been loaded, or an error occurs.
   * @param {Error} onComplete.error - If one of the asset failed, the complete callback is immediately called with the error. If all assets are loaded successfully, error will be null.
   * @param {Asset[]|Asset} onComplete.assets - An array of all loaded assets.
   * 
   * @example
   * // load all audios (resources/audios/) 
   * cc.resources.loadDir('audios', cc.AudioClip, (err, audios) => {});
   *
   * // load all textures in "resources/imgs/"
   * cc.resources.loadDir('imgs', cc.Texture2D, null, function (err, textures) {
   *     var texture1 = textures[0];
   *     var texture2 = textures[1];
   * });
   * 
   * // load all prefabs (${project}/assets/bundle1/misc/characters/) from bundle1 folder
   * bundle1.loadDir('misc/characters', cc.Prefab, (err, prefabs) => console.log(err));
   *
   * // load all sprite frame (${project}/assets/some/xxx/bundle2/skills/) from bundle2 folder
   * bundle2.loadDir('skills', cc.SpriteFrame, null, (err, spriteFrames) => console.log(err));
   *
   * @typescript
   * loadDir<T extends cc.Asset>(dir: string, type: typeof cc.Asset, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, assets: Array<T>) => void): void
   * loadDir<T extends cc.Asset>(dir: string, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, assets: Array<T>) => void): void
   * loadDir<T extends cc.Asset>(dir: string, type: typeof cc.Asset, onComplete: (error: Error, assets: Array<T>) => void): void
   * loadDir<T extends cc.Asset>(dir: string, type: typeof cc.Asset): void
   * loadDir<T extends cc.Asset>(dir: string, onComplete: (error: Error, assets: Array<T>) => void): void
   * loadDir<T extends cc.Asset>(dir: string): void
   */
  loadDir: function loadDir(dir, type, onProgress, onComplete) {
    var _parseLoadResArgs3 = parseLoadResArgs(type, onProgress, onComplete),
        type = _parseLoadResArgs3.type,
        onProgress = _parseLoadResArgs3.onProgress,
        onComplete = _parseLoadResArgs3.onComplete;

    cc.assetManager.loadAny(dir, {
      __requestType__: RequestType.DIR,
      type: type,
      bundle: this.name,
      __outputAsArray__: true
    }, onProgress, onComplete);
  },

  /**
   * !#en
   * Preload all assets under a folder inside the bundle folder.<br> After calling this method, you still need to finish loading by calling `Bundle.loadDir`.
   * It will be totally fine to call `Bundle.loadDir` at any time even if the preloading is not yet finished
   * 
   * !#zh
   * 预加载目标文件夹中的所有资源。调用完后，你仍然需要通过 `Bundle.loadDir` 来完成加载。
   * 就算预加载还没完成，你也可以直接调用 `Bundle.loadDir`。
   *
   * @method preloadDir
   * @param {string} dir - path of the target folder.The path is relative to the bundle folder, extensions must be omitted.
   * @param {Function} [type] - Only asset of type will be preloaded if this argument is supplied.
   * @param {Function} [onProgress] - Callback invoked when progression change.
   * @param {Number} onProgress.finish - The number of the items that are already completed.
   * @param {Number} onProgress.total - The total number of the items.
   * @param {Object} onProgress.item - The latest request item
   * @param {Function} [onComplete] - A callback which is called when all assets have been loaded, or an error occurs.
   * @param {Error} onComplete.error - If one of the asset failed, the complete callback is immediately called with the error. If all assets are preloaded successfully, error will be null.
   * @param {RequestItem[]} onComplete.items - An array of all preloaded items.
   * 
   * @example
   * // preload all audios (resources/audios/) 
   * cc.resources.preloadDir('audios', cc.AudioClip);
   *
   * // preload all textures in "resources/imgs/"
   * cc.resources.preloadDir('imgs', cc.Texture2D);
   * // wait for while
   * cc.resources.loadDir('imgs', cc.Texture2D, (err, textures) => {});
   * 
   * // preload all prefabs (${project}/assets/bundle1/misc/characters/) from bundle1 folder
   * bundle1.preloadDir('misc/characters', cc.Prefab);
   *
   * // preload all sprite frame (${project}/assets/some/xxx/bundle2/skills/) from bundle2 folder
   * bundle2.preloadDir('skills', cc.SpriteFrame);
   * // wait for while
   * bundle2.loadDir('skills', cc.SpriteFrame, (err, spriteFrames) => {});
   *                                             
   * @typescript
   * preloadDir(dir: string, type: typeof cc.Asset, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, items: RequestItem[]) => void): void
   * preloadDir(dir: string, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, items: RequestItem[]) => void): void
   * preloadDir(dir: string, type: typeof cc.Asset, onComplete: (error: Error, items: RequestItem[]) => void): void
   * preloadDir(dir: string, type: typeof cc.Asset): void
   * preloadDir(dir: string, onComplete: (error: Error, items: RequestItem[]) => void): void
   * preloadDir(dir: string): void
   */
  preloadDir: function preloadDir(dir, type, onProgress, onComplete) {
    var _parseLoadResArgs4 = parseLoadResArgs(type, onProgress, onComplete),
        type = _parseLoadResArgs4.type,
        onProgress = _parseLoadResArgs4.onProgress,
        onComplete = _parseLoadResArgs4.onComplete;

    cc.assetManager.preloadAny(dir, {
      __requestType__: RequestType.DIR,
      type: type,
      bundle: this.name
    }, onProgress, onComplete);
  },

  /**
   * !#en 
   * Loads the scene within this bundle by its name.  
   * 
   * !#zh 
   * 通过场景名称加载分包中的场景。
   *
   * @method loadScene
   * @param {String} sceneName - The name of the scene to load.
   * @param {Object} [options] - Some optional parameters
   * @param {Function} [onProgress] - Callback invoked when progression change.
   * @param {Number} onProgress.finish - The number of the items that are already completed.
   * @param {Number} onProgress.total - The total number of the items.
   * @param {Object} onProgress.item - The latest request item
   * @param {Function} [onComplete] - callback, will be called after scene launched.
   * @param {Error} onComplete.err - The occurred error, null indicetes success
   * @param {SceneAsset} onComplete.sceneAsset - The scene asset
   * 
   * @example
   * bundle1.loadScene('first', (err, sceneAsset) => cc.director.runScene(sceneAsset));
   * 
   * @typescript
   * loadScene(sceneName: string, options: Record<string, any>, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, sceneAsset: cc.SceneAsset) => void): void
   * loadScene(sceneName: string, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, sceneAsset: cc.SceneAsset) => void): void
   * loadScene(sceneName: string, options: Record<string, any>, onComplete: (error: Error, sceneAsset: cc.SceneAsset) => void): void
   * loadScene(sceneName: string, onComplete: (error: Error, sceneAsset: cc.SceneAsset) => void): void
   * loadScene(sceneName: string, options: Record<string, any>): void
   * loadScene(sceneName: string): void
   */
  loadScene: function loadScene(sceneName, options, onProgress, onComplete) {
    var _parseParameters = parseParameters(options, onProgress, onComplete),
        options = _parseParameters.options,
        onProgress = _parseParameters.onProgress,
        onComplete = _parseParameters.onComplete;

    options.preset = options.preset || 'scene';
    options.bundle = this.name;
    cc.assetManager.loadAny({
      'scene': sceneName
    }, options, onProgress, function (err, sceneAsset) {
      if (err) {
        cc.error(err.message, err.stack);
        onComplete && onComplete(err);
      } else if (sceneAsset instanceof cc.SceneAsset) {
        var scene = sceneAsset.scene;
        scene._id = sceneAsset._uuid;
        scene._name = sceneAsset._name;
        onComplete && onComplete(null, sceneAsset);
      } else {
        onComplete && onComplete(new Error('The asset ' + sceneAsset._uuid + ' is not a scene'));
      }
    });
  },

  /**
   * !#en
   * Preloads the scene within this bundle by its name. After calling this method, you still need to finish loading by calling `Bundle.loadScene` or `cc.director.loadScene`.
   * It will be totally fine to call `Bundle.loadDir` at any time even if the preloading is not yet finished
   * 
   * !#zh 
   * 通过场景名称预加载分包中的场景.调用完后，你仍然需要通过 `Bundle.loadScene` 或 `cc.director.loadScene` 来完成加载。
   * 就算预加载还没完成，你也可以直接调用 `Bundle.loadScene` 或 `cc.director.loadScene`。
   *
   * @method preloadScene
   * @param {String} sceneName - The name of the scene to preload.
   * @param {Object} [options] - Some optional parameters
   * @param {Function} [onProgress] - callback, will be called when the load progression change.
   * @param {Number} onProgress.finish - The number of the items that are already completed
   * @param {Number} onProgress.total - The total number of the items
   * @param {RequestItem} onProgress.item The latest request item
   * @param {Function} [onComplete] - callback, will be called after scene loaded.
   * @param {Error} onComplete.error - null or the error object.
   * 
   * @example
   * bundle1.preloadScene('first');
   * // wait for a while
   * bundle1.loadScene('first', (err, scene) => cc.director.runScene(scene));
   * 
   * @typescript
   * preloadScene(sceneName: string, options: Record<string, any>, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error) => void): void
   * preloadScene(sceneName: string, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error) => void): void
   * preloadScene(sceneName: string, options: Record<string, any>, onComplete: (error: Error) => void): void
   * preloadScene(sceneName: string, onComplete: (error: Error) => void): void
   * preloadScene(sceneName: string, options: Record<string, any>): void
   * preloadScene(sceneName: string): void
   */
  preloadScene: function preloadScene(sceneName, options, onProgress, onComplete) {
    var _parseParameters2 = parseParameters(options, onProgress, onComplete),
        options = _parseParameters2.options,
        onProgress = _parseParameters2.onProgress,
        onComplete = _parseParameters2.onComplete;

    options.bundle = this.name;
    cc.assetManager.preloadAny({
      'scene': sceneName
    }, options, onProgress, function (err) {
      if (err) {
        cc.errorID(1210, sceneName, err.message);
      }

      onComplete && onComplete(err);
    });
  },

  /**
   * !#en
   * Get asset within this bundle by path and type. <br>
   * After you load asset with {{#crossLink "Bundle/load:method"}}{{/crossLink}} or {{#crossLink "Bundle/loadDir:method"}}{{/crossLink}},
   * you can acquire them by passing the path to this API.
   * 
   * !#zh
   * 通过路径与类型获取资源。在你使用 {{#crossLink "Bundle/load:method"}}{{/crossLink}} 或者 {{#crossLink "Bundle/loadDir:method"}}{{/crossLink}} 之后，
   * 你能通过传路径通过这个 API 获取到这些资源。
   * 
   * @method get
   * @param {String} path - The path of asset
   * @param {Function} [type] - Only asset of type will be returned if this argument is supplied.
   * @returns {Asset} 
   * 
   * @example
   * bundle1.get('music/hit', cc.AudioClip);
   * 
   * @typescript
   * get<T extends cc.Asset> (path: string, type?: typeof cc.Asset): T
   */
  get: function get(path, type) {
    var info = this.getInfoWithPath(path, type);
    return assets.get(info && info.uuid);
  },

  /**
   * !#en 
   * Release the asset loaded by {{#crossLink "Bundle/load:method"}}{{/crossLink}} or {{#crossLink "Bundle/loadDir:method"}}{{/crossLink}} and it's dependencies. 
   * Refer to {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}} for detailed informations.
   * 
   * !#zh 
   * 释放通过 {{#crossLink "Bundle/load:method"}}{{/crossLink}} 或者 {{#crossLink "Bundle/loadDir:method"}}{{/crossLink}} 加载的资源。详细信息请参考 {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}}
   * 
   * @method release
   * @param {String} path - The path of asset
   * @param {Function} [type] - Only asset of type will be released if this argument is supplied.
   * 
   * @example
   * // release a texture which is no longer need
   * bundle1.release('misc/character/cocos');
   *
   * @typescript
   * release(path: string, type: typeof cc.Asset): void
   * release(path: string): void
   */
  release: function release(path, type) {
    releaseManager.tryRelease(this.get(path, type), true);
  },

  /**
   * !#en 
   * Release all unused assets within this bundle. Refer to {{#crossLink "AssetManager/releaseAll:method"}}{{/crossLink}} for detailed informations.
   * 
   * !#zh 
   * 释放此包中的所有没有用到的资源。详细信息请参考 {{#crossLink "AssetManager/releaseAll:method"}}{{/crossLink}}
   *
   * @method releaseUnusedAssets
   * @private
   * 
   * @example
   * // release all unused asset within bundle1
   * bundle1.releaseUnusedAssets();
   * 
   * @typescript
   * releaseUnusedAssets(): void
   */
  releaseUnusedAssets: function releaseUnusedAssets() {
    var self = this;
    assets.forEach(function (asset) {
      var info = self.getAssetInfo(asset._uuid);

      if (info && !info.redirect) {
        releaseManager.tryRelease(asset);
      }
    });
  },

  /**
   * !#en 
   * Release all assets within this bundle. Refer to {{#crossLink "AssetManager/releaseAll:method"}}{{/crossLink}} for detailed informations.
   * 
   * !#zh 
   * 释放此包中的所有资源。详细信息请参考 {{#crossLink "AssetManager/releaseAll:method"}}{{/crossLink}}
   *
   * @method releaseAll
   * 
   * @example
   * // release all asset within bundle1
   * bundle1.releaseAll();
   * 
   * @typescript
   * releaseAll(): void
   */
  releaseAll: function releaseAll() {
    var self = this;
    assets.forEach(function (asset) {
      var info = self.getAssetInfo(asset._uuid);

      if (info && !info.redirect) {
        releaseManager.tryRelease(asset, true);
      }
    });
  },
  _destroy: function _destroy() {
    this._config.destroy();
  }
};
module.exports = Bundle;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0LW1hbmFnZXIvYnVuZGxlLmpzIl0sIm5hbWVzIjpbIkNvbmZpZyIsInJlcXVpcmUiLCJyZWxlYXNlTWFuYWdlciIsInBhcnNlUGFyYW1ldGVycyIsInBhcnNlTG9hZFJlc0FyZ3MiLCJSZXF1ZXN0VHlwZSIsImFzc2V0cyIsImJ1bmRsZXMiLCJCdW5kbGUiLCJfY29uZmlnIiwicHJvdG90eXBlIiwiY29uc3RydWN0b3IiLCJuYW1lIiwiZGVwcyIsImJhc2UiLCJnZXRJbmZvV2l0aFBhdGgiLCJwYXRoIiwidHlwZSIsImdldERpcldpdGhQYXRoIiwib3V0IiwiZ2V0QXNzZXRJbmZvIiwidXVpZCIsImdldFNjZW5lSW5mbyIsImluaXQiLCJvcHRpb25zIiwiYWRkIiwibG9hZCIsInBhdGhzIiwib25Qcm9ncmVzcyIsIm9uQ29tcGxldGUiLCJjYyIsImFzc2V0TWFuYWdlciIsImxvYWRBbnkiLCJfX3JlcXVlc3RUeXBlX18iLCJQQVRIIiwiYnVuZGxlIiwiX19vdXRwdXRBc0FycmF5X18iLCJBcnJheSIsImlzQXJyYXkiLCJwcmVsb2FkIiwicHJlbG9hZEFueSIsImxvYWREaXIiLCJkaXIiLCJESVIiLCJwcmVsb2FkRGlyIiwibG9hZFNjZW5lIiwic2NlbmVOYW1lIiwicHJlc2V0IiwiZXJyIiwic2NlbmVBc3NldCIsImVycm9yIiwibWVzc2FnZSIsInN0YWNrIiwiU2NlbmVBc3NldCIsInNjZW5lIiwiX2lkIiwiX3V1aWQiLCJfbmFtZSIsIkVycm9yIiwicHJlbG9hZFNjZW5lIiwiZXJyb3JJRCIsImdldCIsImluZm8iLCJyZWxlYXNlIiwidHJ5UmVsZWFzZSIsInJlbGVhc2VVbnVzZWRBc3NldHMiLCJzZWxmIiwiZm9yRWFjaCIsImFzc2V0IiwicmVkaXJlY3QiLCJyZWxlYXNlQWxsIiwiX2Rlc3Ryb3kiLCJkZXN0cm95IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztB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O0FBbmpCYyxDQUFuQjtBQXVqQkFDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmxFLE1BQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuY29uc3QgQ29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKTtcbmNvbnN0IHJlbGVhc2VNYW5hZ2VyID0gcmVxdWlyZSgnLi9yZWxlYXNlTWFuYWdlcicpO1xuY29uc3QgeyBwYXJzZVBhcmFtZXRlcnMsIHBhcnNlTG9hZFJlc0FyZ3MgfSA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzJyk7XG5jb25zdCB7IFJlcXVlc3RUeXBlLCBhc3NldHMsIGJ1bmRsZXMgfSA9IHJlcXVpcmUoJy4vc2hhcmVkJyk7XG5cbi8qKlxuICogQG1vZHVsZSBjYy5Bc3NldE1hbmFnZXJcbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIEEgYnVuZGxlIGNvbnRhaW5zIGFuIGFtb3VudCBvZiBhc3NldHMoaW5jbHVkZXMgc2NlbmUpLCB5b3UgY2FuIGxvYWQsIHByZWxvYWQsIHJlbGVhc2UgYXNzZXQgd2hpY2ggaXMgaW4gdGhpcyBidW5kbGVcbiAqIFxuICogISN6aFxuICog5LiA5Liq5YyF5ZCr5LiA5a6a5pWw6YeP6LWE5rqQ77yI5YyF5ous5Zy65pmv77yJ55qE5YyF77yM5L2g5Y+v5Lul5Yqg6L2977yM6aKE5Yqg6L2977yM6YeK5pS+5q2k5YyF5YaF55qE6LWE5rqQXG4gKiBcbiAqIEBjbGFzcyBCdW5kbGVcbiAqL1xuZnVuY3Rpb24gQnVuZGxlICgpIHtcbiAgICB0aGlzLl9jb25maWcgPSBuZXcgQ29uZmlnKCk7XG59XG5cbkJ1bmRsZS5wcm90b3R5cGUgPSB7XG4gICAgXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIENyZWF0ZSBhIGJ1bmRsZVxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDliJvlu7rkuIDkuKogYnVuZGxlXG4gICAgICogXG4gICAgICogQG1ldGhvZCBjb25zdHJ1Y3RvclxuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogY29uc3RydWN0b3IoKVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yOiBCdW5kbGUsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVGhlIG5hbWUgb2YgdGhpcyBidW5kbGVcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog5q2kIGJ1bmRsZSDnmoTlkI3np7BcbiAgICAgKiBcbiAgICAgKiBAcHJvcGVydHkgbmFtZVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0IG5hbWUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnLm5hbWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBUaGUgZGVwZW5kZW5jeSBvZiB0aGlzIGJ1bmRsZVxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDmraQgYnVuZGxlIOeahOS+nei1llxuICAgICAqIFxuICAgICAqIEBwcm9wZXJ0eSBkZXBzXG4gICAgICogQHR5cGUge3N0cmluZ1tdfVxuICAgICAqL1xuICAgIGdldCBkZXBzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZy5kZXBzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVGhlIHJvb3QgcGF0aCBvZiB0aGlzIGJ1bmRsZSwgc3VjaCBsaWtlICdodHRwOi8vZXhhbXBsZS5jb20vYnVuZGxlMSdcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog5q2kIGJ1bmRsZSDnmoTmoLnot6/lvoQsIOS+i+WmgiAnaHR0cDovL2V4YW1wbGUuY29tL2J1bmRsZTEnXG4gICAgICogXG4gICAgICogQHByb3BlcnR5IGJhc2VcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldCBiYXNlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZy5iYXNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0IGFzc2V0J3MgaW5mbyB1c2luZyBwYXRoLCBvbmx5IHZhbGlkIHdoZW4gYXNzZXQgaXMgaW4gYnVuZGxlIGZvbGRlci5cbiAgICAgKiAgXG4gICAgICogISN6aFxuICAgICAqIOS9v+eUqCBwYXRoIOiOt+WPlui1hOa6kOeahOmFjee9ruS/oeaBr1xuICAgICAqIFxuICAgICAqIEBtZXRob2QgZ2V0SW5mb1dpdGhQYXRoXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcmVsYXRpdmUgcGF0aCBvZiBhc3NldCwgc3VjaCBhcyAnaW1hZ2VzL2EnXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3R5cGVdIC0gVGhlIGNvbnN0cnVjdG9yIG9mIGFzc2V0LCBzdWNoIGFzICBgY2MuVGV4dHVyZTJEYFxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBhc3NldCBpbmZvIFxuICAgICAqIFxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGluZm8gPSBidW5kbGUuZ2V0SW5mb1dpdGhQYXRoKCdpbWFnZS9hJywgY2MuVGV4dHVyZTJEKTtcbiAgICAgKiBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGdldEluZm9XaXRoUGF0aCAocGF0aDogc3RyaW5nLCB0eXBlPzogdHlwZW9mIGNjLkFzc2V0KTogUmVjb3JkPHN0cmluZywgYW55PlxuICAgICAqL1xuICAgIGdldEluZm9XaXRoUGF0aCAocGF0aCwgdHlwZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnLmdldEluZm9XaXRoUGF0aChwYXRoLCB0eXBlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldCBhbGwgYXNzZXQncyBpbmZvIHdpdGhpbiBzcGVjaWZpYyBmb2xkZXJcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5Zyo5p+Q5Liq5oyH5a6a5paH5Lu25aS55LiL55qE5omA5pyJ6LWE5rqQ5L+h5oGvXG4gICAgICogXG4gICAgICogQG1ldGhvZCBnZXREaXJXaXRoUGF0aFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHJlbGF0aXZlIHBhdGggb2YgZm9sZGVyLCBzdWNoIGFzICdpbWFnZXMnXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3R5cGVdIC0gVGhlIGNvbnN0cnVjdG9yIHNob3VsZCBiZSB1c2VkIHRvIGZpbHRlciBwYXRoc1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IFtvdXRdIC0gVGhlIG91dHB1dCBhcnJheVxuICAgICAqIEByZXR1cm5zIHtPYmplY3RbXX0gSW5mb3NcbiAgICAgKiBcbiAgICAgKiBAZXhhbXBsZSBcbiAgICAgKiB2YXIgaW5mb3MgPSBbXTtcbiAgICAgKiBidW5kbGUuZ2V0RGlyV2l0aFBhdGgoJ2ltYWdlcycsIGNjLlRleHR1cmUyRCwgaW5mb3MpO1xuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZ2V0RGlyV2l0aFBhdGggKHBhdGg6IHN0cmluZywgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCBvdXQ6IEFycmF5PFJlY29yZDxzdHJpbmcsIGFueT4+KTogQXJyYXk8UmVjb3JkPHN0cmluZywgYW55Pj5cbiAgICAgKiBnZXREaXJXaXRoUGF0aCAocGF0aDogc3RyaW5nLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQpOiBBcnJheTxSZWNvcmQ8c3RyaW5nLCBhbnk+PlxuICAgICAqIGdldERpcldpdGhQYXRoIChwYXRoOiBzdHJpbmcpOiBBcnJheTxSZWNvcmQ8c3RyaW5nLCBhbnk+PlxuICAgICAqL1xuICAgIGdldERpcldpdGhQYXRoIChwYXRoLCB0eXBlLCBvdXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZy5nZXREaXJXaXRoUGF0aChwYXRoLCB0eXBlLCBvdXQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0IGFzc2V0J3MgaW5mbyB3aXRoIHV1aWRcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog6YCa6L+HIHV1aWQg6I635Y+W6LWE5rqQ5L+h5oGvXG4gICAgICogXG4gICAgICogQG1ldGhvZCBnZXRBc3NldEluZm9cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXVpZCAtIFRoZSBhc3NldCdzIHV1aWRcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBpbmZvIFxuICAgICAqIFxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGluZm8gPSBidW5kbGUuZ2V0QXNzZXRJbmZvKCdmY21SM1hBRE5MZ0oxQnlLaHFjQzVaJyk7XG4gICAgICogXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBnZXRBc3NldEluZm8gKHV1aWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT5cbiAgICAgKi9cbiAgICBnZXRBc3NldEluZm8gKHV1aWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZy5nZXRBc3NldEluZm8odXVpZCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgc2NlbmUnaW5mbyB3aXRoIG5hbWVcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog6YCa6L+H5Zy65pmv5ZCN6I635Y+W5Zy65pmv5L+h5oGvXG4gICAgICogXG4gICAgICogQG1ldGhvZCBnZXRTY2VuZUluZm9cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHNjZW5lXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBpbmZvXG4gICAgICogXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgaW5mbyA9IGJ1bmRsZS5nZXRTY2VuZUluZm8oJ2ZpcnN0LmZpcmUnKTtcbiAgICAgKiBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGdldFNjZW5lSW5mbyhuYW1lOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBhbnk+XG4gICAgICovXG4gICAgZ2V0U2NlbmVJbmZvIChuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWcuZ2V0U2NlbmVJbmZvKG5hbWUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogSW5pdGlhbGl6ZSB0aGlzIGJ1bmRsZSB3aXRoIG9wdGlvbnNcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog5Yid5aeL5YyW5q2kIGJ1bmRsZVxuICAgICAqIFxuICAgICAqIEBtZXRob2QgaW5pdFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFxuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogaW5pdChvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogdm9pZFxuICAgICAqL1xuICAgIGluaXQgKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fY29uZmlnLmluaXQob3B0aW9ucyk7XG4gICAgICAgIGJ1bmRsZXMuYWRkKG9wdGlvbnMubmFtZSwgdGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBMb2FkIHRoZSBhc3NldCB3aXRoaW4gdGhpcyBidW5kbGUgYnkgdGhlIHBhdGggd2hpY2ggaXMgcmVsYXRpdmUgdG8gYnVuZGxlJ3MgcGF0aFxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDpgJrov4fnm7jlr7not6/lvoTliqDovb3liIbljIXkuK3nmoTotYTmupDjgILot6/lvoTmmK/nm7jlr7nliIbljIXmlofku7blpLnot6/lvoTnmoTnm7jlr7not6/lvoRcbiAgICAgKlxuICAgICAqIEBtZXRob2QgbG9hZFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFN0cmluZ1tdfSBwYXRocyAtIFBhdGhzIG9mIHRoZSB0YXJnZXQgYXNzZXRzLlRoZSBwYXRoIGlzIHJlbGF0aXZlIHRvIHRoZSBidW5kbGUncyBmb2xkZXIsIGV4dGVuc2lvbnMgbXVzdCBiZSBvbWl0dGVkLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFt0eXBlXSAtIE9ubHkgYXNzZXQgb2YgdHlwZSB3aWxsIGJlIGxvYWRlZCBpZiB0aGlzIGFyZ3VtZW50IGlzIHN1cHBsaWVkLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvblByb2dyZXNzXSAtIENhbGxiYWNrIGludm9rZWQgd2hlbiBwcm9ncmVzc2lvbiBjaGFuZ2UuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9uUHJvZ3Jlc3MuZmluaXNoIC0gVGhlIG51bWJlciBvZiB0aGUgaXRlbXMgdGhhdCBhcmUgYWxyZWFkeSBjb21wbGV0ZWQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9uUHJvZ3Jlc3MudG90YWwgLSBUaGUgdG90YWwgbnVtYmVyIG9mIHRoZSBpdGVtcy5cbiAgICAgKiBAcGFyYW0ge1JlcXVlc3RJdGVtfSBvblByb2dyZXNzLml0ZW0gLSBUaGUgZmluaXNoZWQgcmVxdWVzdCBpdGVtLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvbkNvbXBsZXRlXSAtIENhbGxiYWNrIGludm9rZWQgd2hlbiBhbGwgYXNzZXRzIGxvYWRlZC5cbiAgICAgKiBAcGFyYW0ge0Vycm9yfSBvbkNvbXBsZXRlLmVycm9yIC0gVGhlIGVycm9yIGluZm8gb3IgbnVsbCBpZiBsb2FkZWQgc3VjY2Vzc2Z1bGx5LlxuICAgICAqIEBwYXJhbSB7QXNzZXR8QXNzZXRbXX0gb25Db21wbGV0ZS5hc3NldHMgLSBUaGUgbG9hZGVkIGFzc2V0cy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gbG9hZCB0aGUgdGV4dHVyZSAoJHtwcm9qZWN0fS9hc3NldHMvcmVzb3VyY2VzL3RleHR1cmVzL2JhY2tncm91bmQuanBnKSBmcm9tIHJlc291cmNlc1xuICAgICAqIGNjLnJlc291cmNlcy5sb2FkKCd0ZXh0dXJlcy9iYWNrZ3JvdW5kJywgY2MuVGV4dHVyZTJELCAoZXJyLCB0ZXh0dXJlKSA9PiBjb25zb2xlLmxvZyhlcnIpKTtcbiAgICAgKiBcbiAgICAgKiAvLyBsb2FkIHRoZSBhdWRpbyAoJHtwcm9qZWN0fS9hc3NldHMvcmVzb3VyY2VzL211c2ljL2hpdC5tcDMpIGZyb20gcmVzb3VyY2VzXG4gICAgICogY2MucmVzb3VyY2VzLmxvYWQoJ211c2ljL2hpdCcsIGNjLkF1ZGlvQ2xpcCwgKGVyciwgYXVkaW8pID0+IGNvbnNvbGUubG9nKGVycikpO1xuICAgICAqIFxuICAgICAqIC8vIGxvYWQgdGhlIHByZWZhYiAoJHtwcm9qZWN0fS9hc3NldHMvYnVuZGxlMS9taXNjL2NoYXJhY3Rlci9jb2NvcykgZnJvbSBidW5kbGUxIGZvbGRlclxuICAgICAqIGJ1bmRsZTEubG9hZCgnbWlzYy9jaGFyYWN0ZXIvY29jb3MnLCBjYy5QcmVmYWIsIChlcnIsIHByZWZhYikgPT4gY29uc29sZS5sb2coZXJyKSk7XG4gICAgICpcbiAgICAgKiAvLyBsb2FkIHRoZSBzcHJpdGUgZnJhbWUgKCR7cHJvamVjdH0vYXNzZXRzL3NvbWUveHh4L2J1bmRsZTIvaW1ncy9jb2Nvcy5wbmcpIGZyb20gYnVuZGxlMiBmb2xkZXJcbiAgICAgKiBidW5kbGUyLmxvYWQoJ2ltZ3MvY29jb3MnLCBjYy5TcHJpdGVGcmFtZSwgbnVsbCwgKGVyciwgc3ByaXRlRnJhbWUpID0+IGNvbnNvbGUubG9nKGVycikpO1xuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbG9hZDxUIGV4dGVuZHMgY2MuQXNzZXQ+KHBhdGhzOiBzdHJpbmcsIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgb25Qcm9ncmVzczogKGZpbmlzaDogbnVtYmVyLCB0b3RhbDogbnVtYmVyLCBpdGVtOiBSZXF1ZXN0SXRlbSkgPT4gdm9pZCwgb25Db21wbGV0ZTogKGVycm9yOiBFcnJvciwgYXNzZXRzOiBUKSA9PiB2b2lkKTogdm9pZFxuICAgICAqIGxvYWQ8VCBleHRlbmRzIGNjLkFzc2V0PihwYXRoczogc3RyaW5nW10sIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgb25Qcm9ncmVzczogKGZpbmlzaDogbnVtYmVyLCB0b3RhbDogbnVtYmVyLCBpdGVtOiBSZXF1ZXN0SXRlbSkgPT4gdm9pZCwgb25Db21wbGV0ZTogKGVycm9yOiBFcnJvciwgYXNzZXRzOiBBcnJheTxUPikgPT4gdm9pZCk6IHZvaWRcbiAgICAgKiBsb2FkPFQgZXh0ZW5kcyBjYy5Bc3NldD4ocGF0aHM6IHN0cmluZywgb25Qcm9ncmVzczogKGZpbmlzaDogbnVtYmVyLCB0b3RhbDogbnVtYmVyLCBpdGVtOiBSZXF1ZXN0SXRlbSkgPT4gdm9pZCwgb25Db21wbGV0ZTogKGVycm9yOiBFcnJvciwgYXNzZXRzOiBUKSA9PiB2b2lkKTogdm9pZFxuICAgICAqIGxvYWQ8VCBleHRlbmRzIGNjLkFzc2V0PihwYXRoczogc3RyaW5nW10sIG9uUHJvZ3Jlc3M6IChmaW5pc2g6IG51bWJlciwgdG90YWw6IG51bWJlciwgaXRlbTogUmVxdWVzdEl0ZW0pID0+IHZvaWQsIG9uQ29tcGxldGU6IChlcnJvcjogRXJyb3IsIGFzc2V0czogQXJyYXk8VD4pID0+IHZvaWQpOiB2b2lkXG4gICAgICogbG9hZDxUIGV4dGVuZHMgY2MuQXNzZXQ+KHBhdGhzOiBzdHJpbmcsIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgb25Db21wbGV0ZT86IChlcnJvcjogRXJyb3IsIGFzc2V0czogVCkgPT4gdm9pZCk6IHZvaWRcbiAgICAgKiBsb2FkPFQgZXh0ZW5kcyBjYy5Bc3NldD4ocGF0aHM6IHN0cmluZ1tdLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQsIG9uQ29tcGxldGU/OiAoZXJyb3I6IEVycm9yLCBhc3NldHM6IEFycmF5PFQ+KSA9PiB2b2lkKTogdm9pZFxuICAgICAqIGxvYWQ8VCBleHRlbmRzIGNjLkFzc2V0PihwYXRoczogc3RyaW5nLCBvbkNvbXBsZXRlPzogKGVycm9yOiBFcnJvciwgYXNzZXRzOiBUKSA9PiB2b2lkKTogdm9pZFxuICAgICAqIGxvYWQ8VCBleHRlbmRzIGNjLkFzc2V0PihwYXRoczogc3RyaW5nW10sIG9uQ29tcGxldGU/OiAoZXJyb3I6IEVycm9yLCBhc3NldHM6IEFycmF5PFQ+KSA9PiB2b2lkKTogdm9pZFxuICAgICAqL1xuICAgIGxvYWQgKHBhdGhzLCB0eXBlLCBvblByb2dyZXNzLCBvbkNvbXBsZXRlKSB7XG4gICAgICAgIHZhciB7IHR5cGUsIG9uUHJvZ3Jlc3MsIG9uQ29tcGxldGUgfSA9IHBhcnNlTG9hZFJlc0FyZ3ModHlwZSwgb25Qcm9ncmVzcywgb25Db21wbGV0ZSk7XG4gICAgICAgIGNjLmFzc2V0TWFuYWdlci5sb2FkQW55KHBhdGhzLCB7IF9fcmVxdWVzdFR5cGVfXzogUmVxdWVzdFR5cGUuUEFUSCwgdHlwZTogdHlwZSwgYnVuZGxlOiB0aGlzLm5hbWUsIF9fb3V0cHV0QXNBcnJheV9fOiBBcnJheS5pc0FycmF5KHBhdGhzKSB9LCBvblByb2dyZXNzLCBvbkNvbXBsZXRlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFByZWxvYWQgdGhlIGFzc2V0IHdpdGhpbiB0aGlzIGJ1bmRsZSBieSB0aGUgcGF0aCB3aGljaCBpcyByZWxhdGl2ZSB0byBidW5kbGUncyBwYXRoLiBcbiAgICAgKiBBZnRlciBjYWxsaW5nIHRoaXMgbWV0aG9kLCB5b3Ugc3RpbGwgbmVlZCB0byBmaW5pc2ggbG9hZGluZyBieSBjYWxsaW5nIGBCdW5kbGUubG9hZGAuXG4gICAgICogSXQgd2lsbCBiZSB0b3RhbGx5IGZpbmUgdG8gY2FsbCBgQnVuZGxlLmxvYWRgIGF0IGFueSB0aW1lIGV2ZW4gaWYgdGhlIHByZWxvYWRpbmcgaXMgbm90XG4gICAgICogeWV0IGZpbmlzaGVkXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOmAmui/h+ebuOWvuei3r+W+hOmihOWKoOi9veWIhuWMheS4reeahOi1hOa6kOOAgui3r+W+hOaYr+ebuOWvueWIhuWMheaWh+S7tuWkuei3r+W+hOeahOebuOWvuei3r+W+hOOAguiwg+eUqOWujOWQju+8jOS9oOS7jeeEtumcgOimgemAmui/hyBgQnVuZGxlLmxvYWRgIOadpeWujOaIkOWKoOi9veOAglxuICAgICAqIOWwseeul+mihOWKoOi9vei/mOayoeWujOaIkO+8jOS9oOS5n+WPr+S7peebtOaOpeiwg+eUqCBgQnVuZGxlLmxvYWRg44CCXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHByZWxvYWRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xTdHJpbmdbXX0gcGF0aHMgLSBQYXRocyBvZiB0aGUgdGFyZ2V0IGFzc2V0LlRoZSBwYXRoIGlzIHJlbGF0aXZlIHRvIGJ1bmRsZSBmb2xkZXIsIGV4dGVuc2lvbnMgbXVzdCBiZSBvbWl0dGVkLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFt0eXBlXSAtIE9ubHkgYXNzZXQgb2YgdHlwZSB3aWxsIGJlIGxvYWRlZCBpZiB0aGlzIGFyZ3VtZW50IGlzIHN1cHBsaWVkLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvblByb2dyZXNzXSAtIENhbGxiYWNrIGludm9rZWQgd2hlbiBwcm9ncmVzc2lvbiBjaGFuZ2UuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9uUHJvZ3Jlc3MuZmluaXNoIC0gVGhlIG51bWJlciBvZiB0aGUgaXRlbXMgdGhhdCBhcmUgYWxyZWFkeSBjb21wbGV0ZWQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9uUHJvZ3Jlc3MudG90YWwgLSBUaGUgdG90YWwgbnVtYmVyIG9mIHRoZSBpdGVtcy5cbiAgICAgKiBAcGFyYW0ge1JlcXVlc3RJdGVtfSBvblByb2dyZXNzLml0ZW0gLSBUaGUgZmluaXNoZWQgcmVxdWVzdCBpdGVtLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvbkNvbXBsZXRlXSAtIENhbGxiYWNrIGludm9rZWQgd2hlbiB0aGUgcmVzb3VyY2UgbG9hZGVkLlxuICAgICAqIEBwYXJhbSB7RXJyb3J9IG9uQ29tcGxldGUuZXJyb3IgLSBUaGUgZXJyb3IgaW5mbyBvciBudWxsIGlmIGxvYWRlZCBzdWNjZXNzZnVsbHkuXG4gICAgICogQHBhcmFtIHtSZXF1ZXN0SXRlbVtdfSBvbkNvbXBsZXRlLml0ZW1zIC0gVGhlIHByZWxvYWRlZCBpdGVtcy5cbiAgICAgKiBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vIHByZWxvYWQgdGhlIHRleHR1cmUgKCR7cHJvamVjdH0vYXNzZXRzL3Jlc291cmNlcy90ZXh0dXJlcy9iYWNrZ3JvdW5kLmpwZykgZnJvbSByZXNvdXJjZXNcbiAgICAgKiBjYy5yZXNvdXJjZXMucHJlbG9hZCgndGV4dHVyZXMvYmFja2dyb3VuZCcsIGNjLlRleHR1cmUyRCk7XG4gICAgICogXG4gICAgICogLy8gcHJlbG9hZCB0aGUgYXVkaW8gKCR7cHJvamVjdH0vYXNzZXRzL3Jlc291cmNlcy9tdXNpYy9oaXQubXAzKSBmcm9tIHJlc291cmNlc1xuICAgICAqIGNjLnJlc291cmNlcy5wcmVsb2FkKCdtdXNpYy9oaXQnLCBjYy5BdWRpb0NsaXApO1xuICAgICAqIC8vIHdhaXQgZm9yIHdoaWxlXG4gICAgICogY2MucmVzb3VyY2VzLmxvYWQoJ211c2ljL2hpdCcsIGNjLkF1ZGlvQ2xpcCwgKGVyciwgYXVkaW9DbGlwKSA9PiB7fSk7XG4gICAgICogXG4gICAgICogKiAvLyBwcmVsb2FkIHRoZSBwcmVmYWIgKCR7cHJvamVjdH0vYXNzZXRzL2J1bmRsZTEvbWlzYy9jaGFyYWN0ZXIvY29jb3MpIGZyb20gYnVuZGxlMSBmb2xkZXJcbiAgICAgKiBidW5kbGUxLnByZWxvYWQoJ21pc2MvY2hhcmFjdGVyL2NvY29zJywgY2MuUHJlZmFiKTtcbiAgICAgKlxuICAgICAqIC8vIGxvYWQgdGhlIHNwcml0ZSBmcmFtZSBvZiAoJHtwcm9qZWN0fS9hc3NldHMvYnVuZGxlMi9pbWdzL2NvY29zLnBuZykgZnJvbSBidW5kbGUyIGZvbGRlclxuICAgICAqIGJ1bmRsZTIucHJlbG9hZCgnaW1ncy9jb2NvcycsIGNjLlNwcml0ZUZyYW1lKTtcbiAgICAgKiAvLyB3YWl0IGZvciB3aGlsZVxuICAgICAqIGJ1bmRsZTIubG9hZCgnaW1ncy9jb2NvcycsIGNjLlNwcml0ZUZyYW1lLCAoZXJyLCBzcHJpdGVGcmFtZSkgPT4ge30pO1xuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcHJlbG9hZChwYXRoczogc3RyaW5nfHN0cmluZ1tdLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQsIG9uUHJvZ3Jlc3M6IChmaW5pc2g6IG51bWJlciwgdG90YWw6IG51bWJlciwgaXRlbTogUmVxdWVzdEl0ZW0pID0+IHZvaWQsIG9uQ29tcGxldGU6IChlcnJvcjogRXJyb3IsIGl0ZW1zOiBSZXF1ZXN0SXRlbVtdKSA9PiB2b2lkKTogdm9pZFxuICAgICAqIHByZWxvYWQocGF0aHM6IHN0cmluZ3xzdHJpbmdbXSwgb25Qcm9ncmVzczogKGZpbmlzaDogbnVtYmVyLCB0b3RhbDogbnVtYmVyLCBpdGVtOiBSZXF1ZXN0SXRlbSkgPT4gdm9pZCwgb25Db21wbGV0ZTogKGVycm9yOiBFcnJvciwgaXRlbXM6IFJlcXVlc3RJdGVtW10pID0+IHZvaWQpOiB2b2lkXG4gICAgICogcHJlbG9hZChwYXRoczogc3RyaW5nfHN0cmluZ1tdLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQsIG9uQ29tcGxldGU6IChlcnJvcjogRXJyb3IsIGl0ZW1zOiBSZXF1ZXN0SXRlbVtdKSA9PiB2b2lkKTogdm9pZFxuICAgICAqIHByZWxvYWQocGF0aHM6IHN0cmluZ3xzdHJpbmdbXSwgdHlwZTogdHlwZW9mIGNjLkFzc2V0KTogdm9pZFxuICAgICAqIHByZWxvYWQocGF0aHM6IHN0cmluZ3xzdHJpbmdbXSwgb25Db21wbGV0ZTogKGVycm9yOiBFcnJvciwgaXRlbXM6IFJlcXVlc3RJdGVtW10pID0+IHZvaWQpOiB2b2lkXG4gICAgICogcHJlbG9hZChwYXRoczogc3RyaW5nfHN0cmluZ1tdKTogdm9pZFxuICAgICAqL1xuICAgIHByZWxvYWQgKHBhdGhzLCB0eXBlLCBvblByb2dyZXNzLCBvbkNvbXBsZXRlKSB7XG4gICAgICAgIHZhciB7IHR5cGUsIG9uUHJvZ3Jlc3MsIG9uQ29tcGxldGUgfSA9IHBhcnNlTG9hZFJlc0FyZ3ModHlwZSwgb25Qcm9ncmVzcywgb25Db21wbGV0ZSk7XG4gICAgICAgIGNjLmFzc2V0TWFuYWdlci5wcmVsb2FkQW55KHBhdGhzLCB7IF9fcmVxdWVzdFR5cGVfXzogUmVxdWVzdFR5cGUuUEFUSCwgdHlwZTogdHlwZSwgYnVuZGxlOiB0aGlzLm5hbWUgfSwgb25Qcm9ncmVzcywgb25Db21wbGV0ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBMb2FkIGFsbCBhc3NldHMgdW5kZXIgYSBmb2xkZXIgaW5zaWRlIHRoZSBidW5kbGUgZm9sZGVyLjxicj5cbiAgICAgKiA8YnI+XG4gICAgICogTm90ZTogQWxsIGFzc2V0IHBhdGhzIGluIENyZWF0b3IgdXNlIGZvcndhcmQgc2xhc2hlcywgcGF0aHMgdXNpbmcgYmFja3NsYXNoZXMgd2lsbCBub3Qgd29yay5cbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog5Yqg6L2955uu5qCH5paH5Lu25aS55Lit55qE5omA5pyJ6LWE5rqQLCDms6jmhI/vvJrot6/lvoTkuK3lj6rog73kvb/nlKjmlpzmnaDvvIzlj43mlpzmnaDlsIblgZzmraLlt6XkvZxcbiAgICAgKlxuICAgICAqIEBtZXRob2QgbG9hZERpclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBkaXIgLSBwYXRoIG9mIHRoZSB0YXJnZXQgZm9sZGVyLlRoZSBwYXRoIGlzIHJlbGF0aXZlIHRvIHRoZSBidW5kbGUgZm9sZGVyLCBleHRlbnNpb25zIG11c3QgYmUgb21pdHRlZC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbdHlwZV0gLSBPbmx5IGFzc2V0IG9mIHR5cGUgd2lsbCBiZSBsb2FkZWQgaWYgdGhpcyBhcmd1bWVudCBpcyBzdXBwbGllZC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25Qcm9ncmVzc10gLSBDYWxsYmFjayBpbnZva2VkIHdoZW4gcHJvZ3Jlc3Npb24gY2hhbmdlLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvblByb2dyZXNzLmZpbmlzaCAtIFRoZSBudW1iZXIgb2YgdGhlIGl0ZW1zIHRoYXQgYXJlIGFscmVhZHkgY29tcGxldGVkLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvblByb2dyZXNzLnRvdGFsIC0gVGhlIHRvdGFsIG51bWJlciBvZiB0aGUgaXRlbXMuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9uUHJvZ3Jlc3MuaXRlbSAtIFRoZSBsYXRlc3QgcmVxdWVzdCBpdGVtXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uQ29tcGxldGVdIC0gQSBjYWxsYmFjayB3aGljaCBpcyBjYWxsZWQgd2hlbiBhbGwgYXNzZXRzIGhhdmUgYmVlbiBsb2FkZWQsIG9yIGFuIGVycm9yIG9jY3Vycy5cbiAgICAgKiBAcGFyYW0ge0Vycm9yfSBvbkNvbXBsZXRlLmVycm9yIC0gSWYgb25lIG9mIHRoZSBhc3NldCBmYWlsZWQsIHRoZSBjb21wbGV0ZSBjYWxsYmFjayBpcyBpbW1lZGlhdGVseSBjYWxsZWQgd2l0aCB0aGUgZXJyb3IuIElmIGFsbCBhc3NldHMgYXJlIGxvYWRlZCBzdWNjZXNzZnVsbHksIGVycm9yIHdpbGwgYmUgbnVsbC5cbiAgICAgKiBAcGFyYW0ge0Fzc2V0W118QXNzZXR9IG9uQ29tcGxldGUuYXNzZXRzIC0gQW4gYXJyYXkgb2YgYWxsIGxvYWRlZCBhc3NldHMuXG4gICAgICogXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyBsb2FkIGFsbCBhdWRpb3MgKHJlc291cmNlcy9hdWRpb3MvKSBcbiAgICAgKiBjYy5yZXNvdXJjZXMubG9hZERpcignYXVkaW9zJywgY2MuQXVkaW9DbGlwLCAoZXJyLCBhdWRpb3MpID0+IHt9KTtcbiAgICAgKlxuICAgICAqIC8vIGxvYWQgYWxsIHRleHR1cmVzIGluIFwicmVzb3VyY2VzL2ltZ3MvXCJcbiAgICAgKiBjYy5yZXNvdXJjZXMubG9hZERpcignaW1ncycsIGNjLlRleHR1cmUyRCwgbnVsbCwgZnVuY3Rpb24gKGVyciwgdGV4dHVyZXMpIHtcbiAgICAgKiAgICAgdmFyIHRleHR1cmUxID0gdGV4dHVyZXNbMF07XG4gICAgICogICAgIHZhciB0ZXh0dXJlMiA9IHRleHR1cmVzWzFdO1xuICAgICAqIH0pO1xuICAgICAqIFxuICAgICAqIC8vIGxvYWQgYWxsIHByZWZhYnMgKCR7cHJvamVjdH0vYXNzZXRzL2J1bmRsZTEvbWlzYy9jaGFyYWN0ZXJzLykgZnJvbSBidW5kbGUxIGZvbGRlclxuICAgICAqIGJ1bmRsZTEubG9hZERpcignbWlzYy9jaGFyYWN0ZXJzJywgY2MuUHJlZmFiLCAoZXJyLCBwcmVmYWJzKSA9PiBjb25zb2xlLmxvZyhlcnIpKTtcbiAgICAgKlxuICAgICAqIC8vIGxvYWQgYWxsIHNwcml0ZSBmcmFtZSAoJHtwcm9qZWN0fS9hc3NldHMvc29tZS94eHgvYnVuZGxlMi9za2lsbHMvKSBmcm9tIGJ1bmRsZTIgZm9sZGVyXG4gICAgICogYnVuZGxlMi5sb2FkRGlyKCdza2lsbHMnLCBjYy5TcHJpdGVGcmFtZSwgbnVsbCwgKGVyciwgc3ByaXRlRnJhbWVzKSA9PiBjb25zb2xlLmxvZyhlcnIpKTtcbiAgICAgKlxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbG9hZERpcjxUIGV4dGVuZHMgY2MuQXNzZXQ+KGRpcjogc3RyaW5nLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQsIG9uUHJvZ3Jlc3M6IChmaW5pc2g6IG51bWJlciwgdG90YWw6IG51bWJlciwgaXRlbTogUmVxdWVzdEl0ZW0pID0+IHZvaWQsIG9uQ29tcGxldGU6IChlcnJvcjogRXJyb3IsIGFzc2V0czogQXJyYXk8VD4pID0+IHZvaWQpOiB2b2lkXG4gICAgICogbG9hZERpcjxUIGV4dGVuZHMgY2MuQXNzZXQ+KGRpcjogc3RyaW5nLCBvblByb2dyZXNzOiAoZmluaXNoOiBudW1iZXIsIHRvdGFsOiBudW1iZXIsIGl0ZW06IFJlcXVlc3RJdGVtKSA9PiB2b2lkLCBvbkNvbXBsZXRlOiAoZXJyb3I6IEVycm9yLCBhc3NldHM6IEFycmF5PFQ+KSA9PiB2b2lkKTogdm9pZFxuICAgICAqIGxvYWREaXI8VCBleHRlbmRzIGNjLkFzc2V0PihkaXI6IHN0cmluZywgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCBvbkNvbXBsZXRlOiAoZXJyb3I6IEVycm9yLCBhc3NldHM6IEFycmF5PFQ+KSA9PiB2b2lkKTogdm9pZFxuICAgICAqIGxvYWREaXI8VCBleHRlbmRzIGNjLkFzc2V0PihkaXI6IHN0cmluZywgdHlwZTogdHlwZW9mIGNjLkFzc2V0KTogdm9pZFxuICAgICAqIGxvYWREaXI8VCBleHRlbmRzIGNjLkFzc2V0PihkaXI6IHN0cmluZywgb25Db21wbGV0ZTogKGVycm9yOiBFcnJvciwgYXNzZXRzOiBBcnJheTxUPikgPT4gdm9pZCk6IHZvaWRcbiAgICAgKiBsb2FkRGlyPFQgZXh0ZW5kcyBjYy5Bc3NldD4oZGlyOiBzdHJpbmcpOiB2b2lkXG4gICAgICovXG4gICAgbG9hZERpciAoZGlyLCB0eXBlLCBvblByb2dyZXNzLCBvbkNvbXBsZXRlKSB7XG4gICAgICAgIHZhciB7IHR5cGUsIG9uUHJvZ3Jlc3MsIG9uQ29tcGxldGUgfSA9IHBhcnNlTG9hZFJlc0FyZ3ModHlwZSwgb25Qcm9ncmVzcywgb25Db21wbGV0ZSk7XG4gICAgICAgIGNjLmFzc2V0TWFuYWdlci5sb2FkQW55KGRpciwgeyBfX3JlcXVlc3RUeXBlX186IFJlcXVlc3RUeXBlLkRJUiwgdHlwZTogdHlwZSwgYnVuZGxlOiB0aGlzLm5hbWUsIF9fb3V0cHV0QXNBcnJheV9fOiB0cnVlIH0sIG9uUHJvZ3Jlc3MsIG9uQ29tcGxldGUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUHJlbG9hZCBhbGwgYXNzZXRzIHVuZGVyIGEgZm9sZGVyIGluc2lkZSB0aGUgYnVuZGxlIGZvbGRlci48YnI+IEFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QsIHlvdSBzdGlsbCBuZWVkIHRvIGZpbmlzaCBsb2FkaW5nIGJ5IGNhbGxpbmcgYEJ1bmRsZS5sb2FkRGlyYC5cbiAgICAgKiBJdCB3aWxsIGJlIHRvdGFsbHkgZmluZSB0byBjYWxsIGBCdW5kbGUubG9hZERpcmAgYXQgYW55IHRpbWUgZXZlbiBpZiB0aGUgcHJlbG9hZGluZyBpcyBub3QgeWV0IGZpbmlzaGVkXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOmihOWKoOi9veebruagh+aWh+S7tuWkueS4reeahOaJgOaciei1hOa6kOOAguiwg+eUqOWujOWQju+8jOS9oOS7jeeEtumcgOimgemAmui/hyBgQnVuZGxlLmxvYWREaXJgIOadpeWujOaIkOWKoOi9veOAglxuICAgICAqIOWwseeul+mihOWKoOi9vei/mOayoeWujOaIkO+8jOS9oOS5n+WPr+S7peebtOaOpeiwg+eUqCBgQnVuZGxlLmxvYWREaXJg44CCXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHByZWxvYWREaXJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZGlyIC0gcGF0aCBvZiB0aGUgdGFyZ2V0IGZvbGRlci5UaGUgcGF0aCBpcyByZWxhdGl2ZSB0byB0aGUgYnVuZGxlIGZvbGRlciwgZXh0ZW5zaW9ucyBtdXN0IGJlIG9taXR0ZWQuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3R5cGVdIC0gT25seSBhc3NldCBvZiB0eXBlIHdpbGwgYmUgcHJlbG9hZGVkIGlmIHRoaXMgYXJndW1lbnQgaXMgc3VwcGxpZWQuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uUHJvZ3Jlc3NdIC0gQ2FsbGJhY2sgaW52b2tlZCB3aGVuIHByb2dyZXNzaW9uIGNoYW5nZS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb25Qcm9ncmVzcy5maW5pc2ggLSBUaGUgbnVtYmVyIG9mIHRoZSBpdGVtcyB0aGF0IGFyZSBhbHJlYWR5IGNvbXBsZXRlZC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb25Qcm9ncmVzcy50b3RhbCAtIFRoZSB0b3RhbCBudW1iZXIgb2YgdGhlIGl0ZW1zLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvblByb2dyZXNzLml0ZW0gLSBUaGUgbGF0ZXN0IHJlcXVlc3QgaXRlbVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvbkNvbXBsZXRlXSAtIEEgY2FsbGJhY2sgd2hpY2ggaXMgY2FsbGVkIHdoZW4gYWxsIGFzc2V0cyBoYXZlIGJlZW4gbG9hZGVkLCBvciBhbiBlcnJvciBvY2N1cnMuXG4gICAgICogQHBhcmFtIHtFcnJvcn0gb25Db21wbGV0ZS5lcnJvciAtIElmIG9uZSBvZiB0aGUgYXNzZXQgZmFpbGVkLCB0aGUgY29tcGxldGUgY2FsbGJhY2sgaXMgaW1tZWRpYXRlbHkgY2FsbGVkIHdpdGggdGhlIGVycm9yLiBJZiBhbGwgYXNzZXRzIGFyZSBwcmVsb2FkZWQgc3VjY2Vzc2Z1bGx5LCBlcnJvciB3aWxsIGJlIG51bGwuXG4gICAgICogQHBhcmFtIHtSZXF1ZXN0SXRlbVtdfSBvbkNvbXBsZXRlLml0ZW1zIC0gQW4gYXJyYXkgb2YgYWxsIHByZWxvYWRlZCBpdGVtcy5cbiAgICAgKiBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vIHByZWxvYWQgYWxsIGF1ZGlvcyAocmVzb3VyY2VzL2F1ZGlvcy8pIFxuICAgICAqIGNjLnJlc291cmNlcy5wcmVsb2FkRGlyKCdhdWRpb3MnLCBjYy5BdWRpb0NsaXApO1xuICAgICAqXG4gICAgICogLy8gcHJlbG9hZCBhbGwgdGV4dHVyZXMgaW4gXCJyZXNvdXJjZXMvaW1ncy9cIlxuICAgICAqIGNjLnJlc291cmNlcy5wcmVsb2FkRGlyKCdpbWdzJywgY2MuVGV4dHVyZTJEKTtcbiAgICAgKiAvLyB3YWl0IGZvciB3aGlsZVxuICAgICAqIGNjLnJlc291cmNlcy5sb2FkRGlyKCdpbWdzJywgY2MuVGV4dHVyZTJELCAoZXJyLCB0ZXh0dXJlcykgPT4ge30pO1xuICAgICAqIFxuICAgICAqIC8vIHByZWxvYWQgYWxsIHByZWZhYnMgKCR7cHJvamVjdH0vYXNzZXRzL2J1bmRsZTEvbWlzYy9jaGFyYWN0ZXJzLykgZnJvbSBidW5kbGUxIGZvbGRlclxuICAgICAqIGJ1bmRsZTEucHJlbG9hZERpcignbWlzYy9jaGFyYWN0ZXJzJywgY2MuUHJlZmFiKTtcbiAgICAgKlxuICAgICAqIC8vIHByZWxvYWQgYWxsIHNwcml0ZSBmcmFtZSAoJHtwcm9qZWN0fS9hc3NldHMvc29tZS94eHgvYnVuZGxlMi9za2lsbHMvKSBmcm9tIGJ1bmRsZTIgZm9sZGVyXG4gICAgICogYnVuZGxlMi5wcmVsb2FkRGlyKCdza2lsbHMnLCBjYy5TcHJpdGVGcmFtZSk7XG4gICAgICogLy8gd2FpdCBmb3Igd2hpbGVcbiAgICAgKiBidW5kbGUyLmxvYWREaXIoJ3NraWxscycsIGNjLlNwcml0ZUZyYW1lLCAoZXJyLCBzcHJpdGVGcmFtZXMpID0+IHt9KTtcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcHJlbG9hZERpcihkaXI6IHN0cmluZywgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCBvblByb2dyZXNzOiAoZmluaXNoOiBudW1iZXIsIHRvdGFsOiBudW1iZXIsIGl0ZW06IFJlcXVlc3RJdGVtKSA9PiB2b2lkLCBvbkNvbXBsZXRlOiAoZXJyb3I6IEVycm9yLCBpdGVtczogUmVxdWVzdEl0ZW1bXSkgPT4gdm9pZCk6IHZvaWRcbiAgICAgKiBwcmVsb2FkRGlyKGRpcjogc3RyaW5nLCBvblByb2dyZXNzOiAoZmluaXNoOiBudW1iZXIsIHRvdGFsOiBudW1iZXIsIGl0ZW06IFJlcXVlc3RJdGVtKSA9PiB2b2lkLCBvbkNvbXBsZXRlOiAoZXJyb3I6IEVycm9yLCBpdGVtczogUmVxdWVzdEl0ZW1bXSkgPT4gdm9pZCk6IHZvaWRcbiAgICAgKiBwcmVsb2FkRGlyKGRpcjogc3RyaW5nLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQsIG9uQ29tcGxldGU6IChlcnJvcjogRXJyb3IsIGl0ZW1zOiBSZXF1ZXN0SXRlbVtdKSA9PiB2b2lkKTogdm9pZFxuICAgICAqIHByZWxvYWREaXIoZGlyOiBzdHJpbmcsIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCk6IHZvaWRcbiAgICAgKiBwcmVsb2FkRGlyKGRpcjogc3RyaW5nLCBvbkNvbXBsZXRlOiAoZXJyb3I6IEVycm9yLCBpdGVtczogUmVxdWVzdEl0ZW1bXSkgPT4gdm9pZCk6IHZvaWRcbiAgICAgKiBwcmVsb2FkRGlyKGRpcjogc3RyaW5nKTogdm9pZFxuICAgICAqL1xuICAgIHByZWxvYWREaXIgKGRpciwgdHlwZSwgb25Qcm9ncmVzcywgb25Db21wbGV0ZSkge1xuICAgICAgICB2YXIgeyB0eXBlLCBvblByb2dyZXNzLCBvbkNvbXBsZXRlIH0gPSBwYXJzZUxvYWRSZXNBcmdzKHR5cGUsIG9uUHJvZ3Jlc3MsIG9uQ29tcGxldGUpO1xuICAgICAgICBjYy5hc3NldE1hbmFnZXIucHJlbG9hZEFueShkaXIsIHsgX19yZXF1ZXN0VHlwZV9fOiBSZXF1ZXN0VHlwZS5ESVIsIHR5cGU6IHR5cGUsIGJ1bmRsZTogdGhpcy5uYW1lIH0sIG9uUHJvZ3Jlc3MsIG9uQ29tcGxldGUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFxuICAgICAqIExvYWRzIHRoZSBzY2VuZSB3aXRoaW4gdGhpcyBidW5kbGUgYnkgaXRzIG5hbWUuICBcbiAgICAgKiBcbiAgICAgKiAhI3poIFxuICAgICAqIOmAmui/h+WcuuaZr+WQjeensOWKoOi9veWIhuWMheS4reeahOWcuuaZr+OAglxuICAgICAqXG4gICAgICogQG1ldGhvZCBsb2FkU2NlbmVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2NlbmVOYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHNjZW5lIHRvIGxvYWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIFNvbWUgb3B0aW9uYWwgcGFyYW1ldGVyc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvblByb2dyZXNzXSAtIENhbGxiYWNrIGludm9rZWQgd2hlbiBwcm9ncmVzc2lvbiBjaGFuZ2UuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9uUHJvZ3Jlc3MuZmluaXNoIC0gVGhlIG51bWJlciBvZiB0aGUgaXRlbXMgdGhhdCBhcmUgYWxyZWFkeSBjb21wbGV0ZWQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9uUHJvZ3Jlc3MudG90YWwgLSBUaGUgdG90YWwgbnVtYmVyIG9mIHRoZSBpdGVtcy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb25Qcm9ncmVzcy5pdGVtIC0gVGhlIGxhdGVzdCByZXF1ZXN0IGl0ZW1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25Db21wbGV0ZV0gLSBjYWxsYmFjaywgd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgc2NlbmUgbGF1bmNoZWQuXG4gICAgICogQHBhcmFtIHtFcnJvcn0gb25Db21wbGV0ZS5lcnIgLSBUaGUgb2NjdXJyZWQgZXJyb3IsIG51bGwgaW5kaWNldGVzIHN1Y2Nlc3NcbiAgICAgKiBAcGFyYW0ge1NjZW5lQXNzZXR9IG9uQ29tcGxldGUuc2NlbmVBc3NldCAtIFRoZSBzY2VuZSBhc3NldFxuICAgICAqIFxuICAgICAqIEBleGFtcGxlXG4gICAgICogYnVuZGxlMS5sb2FkU2NlbmUoJ2ZpcnN0JywgKGVyciwgc2NlbmVBc3NldCkgPT4gY2MuZGlyZWN0b3IucnVuU2NlbmUoc2NlbmVBc3NldCkpO1xuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbG9hZFNjZW5lKHNjZW5lTmFtZTogc3RyaW5nLCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvblByb2dyZXNzOiAoZmluaXNoOiBudW1iZXIsIHRvdGFsOiBudW1iZXIsIGl0ZW06IFJlcXVlc3RJdGVtKSA9PiB2b2lkLCBvbkNvbXBsZXRlOiAoZXJyb3I6IEVycm9yLCBzY2VuZUFzc2V0OiBjYy5TY2VuZUFzc2V0KSA9PiB2b2lkKTogdm9pZFxuICAgICAqIGxvYWRTY2VuZShzY2VuZU5hbWU6IHN0cmluZywgb25Qcm9ncmVzczogKGZpbmlzaDogbnVtYmVyLCB0b3RhbDogbnVtYmVyLCBpdGVtOiBSZXF1ZXN0SXRlbSkgPT4gdm9pZCwgb25Db21wbGV0ZTogKGVycm9yOiBFcnJvciwgc2NlbmVBc3NldDogY2MuU2NlbmVBc3NldCkgPT4gdm9pZCk6IHZvaWRcbiAgICAgKiBsb2FkU2NlbmUoc2NlbmVOYW1lOiBzdHJpbmcsIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4sIG9uQ29tcGxldGU6IChlcnJvcjogRXJyb3IsIHNjZW5lQXNzZXQ6IGNjLlNjZW5lQXNzZXQpID0+IHZvaWQpOiB2b2lkXG4gICAgICogbG9hZFNjZW5lKHNjZW5lTmFtZTogc3RyaW5nLCBvbkNvbXBsZXRlOiAoZXJyb3I6IEVycm9yLCBzY2VuZUFzc2V0OiBjYy5TY2VuZUFzc2V0KSA9PiB2b2lkKTogdm9pZFxuICAgICAqIGxvYWRTY2VuZShzY2VuZU5hbWU6IHN0cmluZywgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55Pik6IHZvaWRcbiAgICAgKiBsb2FkU2NlbmUoc2NlbmVOYW1lOiBzdHJpbmcpOiB2b2lkXG4gICAgICovXG4gICAgbG9hZFNjZW5lIChzY2VuZU5hbWUsIG9wdGlvbnMsIG9uUHJvZ3Jlc3MsIG9uQ29tcGxldGUpIHtcbiAgICAgICAgdmFyIHsgb3B0aW9ucywgb25Qcm9ncmVzcywgb25Db21wbGV0ZSB9ID0gcGFyc2VQYXJhbWV0ZXJzKG9wdGlvbnMsIG9uUHJvZ3Jlc3MsIG9uQ29tcGxldGUpO1xuICAgIFxuICAgICAgICBvcHRpb25zLnByZXNldCA9IG9wdGlvbnMucHJlc2V0IHx8ICdzY2VuZSc7XG4gICAgICAgIG9wdGlvbnMuYnVuZGxlID0gdGhpcy5uYW1lO1xuICAgICAgICBjYy5hc3NldE1hbmFnZXIubG9hZEFueSh7ICdzY2VuZSc6IHNjZW5lTmFtZSB9LCBvcHRpb25zLCBvblByb2dyZXNzLCBmdW5jdGlvbiAoZXJyLCBzY2VuZUFzc2V0KSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3IoZXJyLm1lc3NhZ2UsIGVyci5zdGFjayk7XG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZSAmJiBvbkNvbXBsZXRlKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChzY2VuZUFzc2V0IGluc3RhbmNlb2YgY2MuU2NlbmVBc3NldCkge1xuICAgICAgICAgICAgICAgIHZhciBzY2VuZSA9IHNjZW5lQXNzZXQuc2NlbmU7XG4gICAgICAgICAgICAgICAgc2NlbmUuX2lkID0gc2NlbmVBc3NldC5fdXVpZDtcbiAgICAgICAgICAgICAgICBzY2VuZS5fbmFtZSA9IHNjZW5lQXNzZXQuX25hbWU7XG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZSAmJiBvbkNvbXBsZXRlKG51bGwsIHNjZW5lQXNzZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZSAmJiBvbkNvbXBsZXRlKG5ldyBFcnJvcignVGhlIGFzc2V0ICcgKyBzY2VuZUFzc2V0Ll91dWlkICsgJyBpcyBub3QgYSBzY2VuZScpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBQcmVsb2FkcyB0aGUgc2NlbmUgd2l0aGluIHRoaXMgYnVuZGxlIGJ5IGl0cyBuYW1lLiBBZnRlciBjYWxsaW5nIHRoaXMgbWV0aG9kLCB5b3Ugc3RpbGwgbmVlZCB0byBmaW5pc2ggbG9hZGluZyBieSBjYWxsaW5nIGBCdW5kbGUubG9hZFNjZW5lYCBvciBgY2MuZGlyZWN0b3IubG9hZFNjZW5lYC5cbiAgICAgKiBJdCB3aWxsIGJlIHRvdGFsbHkgZmluZSB0byBjYWxsIGBCdW5kbGUubG9hZERpcmAgYXQgYW55IHRpbWUgZXZlbiBpZiB0aGUgcHJlbG9hZGluZyBpcyBub3QgeWV0IGZpbmlzaGVkXG4gICAgICogXG4gICAgICogISN6aCBcbiAgICAgKiDpgJrov4flnLrmma/lkI3np7DpooTliqDovb3liIbljIXkuK3nmoTlnLrmma8u6LCD55So5a6M5ZCO77yM5L2g5LuN54S26ZyA6KaB6YCa6L+HIGBCdW5kbGUubG9hZFNjZW5lYCDmiJYgYGNjLmRpcmVjdG9yLmxvYWRTY2VuZWAg5p2l5a6M5oiQ5Yqg6L2944CCXG4gICAgICog5bCx566X6aKE5Yqg6L296L+Y5rKh5a6M5oiQ77yM5L2g5Lmf5Y+v5Lul55u05o6l6LCD55SoIGBCdW5kbGUubG9hZFNjZW5lYCDmiJYgYGNjLmRpcmVjdG9yLmxvYWRTY2VuZWDjgIJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcHJlbG9hZFNjZW5lXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNjZW5lTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzY2VuZSB0byBwcmVsb2FkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSBTb21lIG9wdGlvbmFsIHBhcmFtZXRlcnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25Qcm9ncmVzc10gLSBjYWxsYmFjaywgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgbG9hZCBwcm9ncmVzc2lvbiBjaGFuZ2UuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9uUHJvZ3Jlc3MuZmluaXNoIC0gVGhlIG51bWJlciBvZiB0aGUgaXRlbXMgdGhhdCBhcmUgYWxyZWFkeSBjb21wbGV0ZWRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb25Qcm9ncmVzcy50b3RhbCAtIFRoZSB0b3RhbCBudW1iZXIgb2YgdGhlIGl0ZW1zXG4gICAgICogQHBhcmFtIHtSZXF1ZXN0SXRlbX0gb25Qcm9ncmVzcy5pdGVtIFRoZSBsYXRlc3QgcmVxdWVzdCBpdGVtXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uQ29tcGxldGVdIC0gY2FsbGJhY2ssIHdpbGwgYmUgY2FsbGVkIGFmdGVyIHNjZW5lIGxvYWRlZC5cbiAgICAgKiBAcGFyYW0ge0Vycm9yfSBvbkNvbXBsZXRlLmVycm9yIC0gbnVsbCBvciB0aGUgZXJyb3Igb2JqZWN0LlxuICAgICAqIFxuICAgICAqIEBleGFtcGxlXG4gICAgICogYnVuZGxlMS5wcmVsb2FkU2NlbmUoJ2ZpcnN0Jyk7XG4gICAgICogLy8gd2FpdCBmb3IgYSB3aGlsZVxuICAgICAqIGJ1bmRsZTEubG9hZFNjZW5lKCdmaXJzdCcsIChlcnIsIHNjZW5lKSA9PiBjYy5kaXJlY3Rvci5ydW5TY2VuZShzY2VuZSkpO1xuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcHJlbG9hZFNjZW5lKHNjZW5lTmFtZTogc3RyaW5nLCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvblByb2dyZXNzOiAoZmluaXNoOiBudW1iZXIsIHRvdGFsOiBudW1iZXIsIGl0ZW06IFJlcXVlc3RJdGVtKSA9PiB2b2lkLCBvbkNvbXBsZXRlOiAoZXJyb3I6IEVycm9yKSA9PiB2b2lkKTogdm9pZFxuICAgICAqIHByZWxvYWRTY2VuZShzY2VuZU5hbWU6IHN0cmluZywgb25Qcm9ncmVzczogKGZpbmlzaDogbnVtYmVyLCB0b3RhbDogbnVtYmVyLCBpdGVtOiBSZXF1ZXN0SXRlbSkgPT4gdm9pZCwgb25Db21wbGV0ZTogKGVycm9yOiBFcnJvcikgPT4gdm9pZCk6IHZvaWRcbiAgICAgKiBwcmVsb2FkU2NlbmUoc2NlbmVOYW1lOiBzdHJpbmcsIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4sIG9uQ29tcGxldGU6IChlcnJvcjogRXJyb3IpID0+IHZvaWQpOiB2b2lkXG4gICAgICogcHJlbG9hZFNjZW5lKHNjZW5lTmFtZTogc3RyaW5nLCBvbkNvbXBsZXRlOiAoZXJyb3I6IEVycm9yKSA9PiB2b2lkKTogdm9pZFxuICAgICAqIHByZWxvYWRTY2VuZShzY2VuZU5hbWU6IHN0cmluZywgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55Pik6IHZvaWRcbiAgICAgKiBwcmVsb2FkU2NlbmUoc2NlbmVOYW1lOiBzdHJpbmcpOiB2b2lkXG4gICAgICovXG4gICAgcHJlbG9hZFNjZW5lIChzY2VuZU5hbWUsIG9wdGlvbnMsIG9uUHJvZ3Jlc3MsIG9uQ29tcGxldGUpIHtcbiAgICAgICAgdmFyIHsgb3B0aW9ucywgb25Qcm9ncmVzcywgb25Db21wbGV0ZSB9ID0gcGFyc2VQYXJhbWV0ZXJzKG9wdGlvbnMsIG9uUHJvZ3Jlc3MsIG9uQ29tcGxldGUpO1xuXG4gICAgICAgIG9wdGlvbnMuYnVuZGxlID0gdGhpcy5uYW1lO1xuICAgICAgICBjYy5hc3NldE1hbmFnZXIucHJlbG9hZEFueSh7J3NjZW5lJzogc2NlbmVOYW1lfSwgb3B0aW9ucywgb25Qcm9ncmVzcywgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMTIxMCwgc2NlbmVOYW1lLCBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvbkNvbXBsZXRlICYmIG9uQ29tcGxldGUoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgYXNzZXQgd2l0aGluIHRoaXMgYnVuZGxlIGJ5IHBhdGggYW5kIHR5cGUuIDxicj5cbiAgICAgKiBBZnRlciB5b3UgbG9hZCBhc3NldCB3aXRoIHt7I2Nyb3NzTGluayBcIkJ1bmRsZS9sb2FkOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSBvciB7eyNjcm9zc0xpbmsgXCJCdW5kbGUvbG9hZERpcjptZXRob2RcIn19e3svY3Jvc3NMaW5rfX0sXG4gICAgICogeW91IGNhbiBhY3F1aXJlIHRoZW0gYnkgcGFzc2luZyB0aGUgcGF0aCB0byB0aGlzIEFQSS5cbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog6YCa6L+H6Lev5b6E5LiO57G75Z6L6I635Y+W6LWE5rqQ44CC5Zyo5L2g5L2/55SoIHt7I2Nyb3NzTGluayBcIkJ1bmRsZS9sb2FkOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSDmiJbogIUge3sjY3Jvc3NMaW5rIFwiQnVuZGxlL2xvYWREaXI6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IOS5i+WQju+8jFxuICAgICAqIOS9oOiDvemAmui/h+S8oOi3r+W+hOmAmui/h+i/meS4qiBBUEkg6I635Y+W5Yiw6L+Z5Lqb6LWE5rqQ44CCXG4gICAgICogXG4gICAgICogQG1ldGhvZCBnZXRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIG9mIGFzc2V0XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3R5cGVdIC0gT25seSBhc3NldCBvZiB0eXBlIHdpbGwgYmUgcmV0dXJuZWQgaWYgdGhpcyBhcmd1bWVudCBpcyBzdXBwbGllZC5cbiAgICAgKiBAcmV0dXJucyB7QXNzZXR9IFxuICAgICAqIFxuICAgICAqIEBleGFtcGxlXG4gICAgICogYnVuZGxlMS5nZXQoJ211c2ljL2hpdCcsIGNjLkF1ZGlvQ2xpcCk7XG4gICAgICogXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBnZXQ8VCBleHRlbmRzIGNjLkFzc2V0PiAocGF0aDogc3RyaW5nLCB0eXBlPzogdHlwZW9mIGNjLkFzc2V0KTogVFxuICAgICAqL1xuICAgIGdldCAocGF0aCwgdHlwZSkge1xuICAgICAgICB2YXIgaW5mbyA9IHRoaXMuZ2V0SW5mb1dpdGhQYXRoKHBhdGgsIHR5cGUpO1xuICAgICAgICByZXR1cm4gYXNzZXRzLmdldChpbmZvICYmIGluZm8udXVpZCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gXG4gICAgICogUmVsZWFzZSB0aGUgYXNzZXQgbG9hZGVkIGJ5IHt7I2Nyb3NzTGluayBcIkJ1bmRsZS9sb2FkOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSBvciB7eyNjcm9zc0xpbmsgXCJCdW5kbGUvbG9hZERpcjptZXRob2RcIn19e3svY3Jvc3NMaW5rfX0gYW5kIGl0J3MgZGVwZW5kZW5jaWVzLiBcbiAgICAgKiBSZWZlciB0byB7eyNjcm9zc0xpbmsgXCJBc3NldE1hbmFnZXIvcmVsZWFzZUFzc2V0Om1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSBmb3IgZGV0YWlsZWQgaW5mb3JtYXRpb25zLlxuICAgICAqIFxuICAgICAqICEjemggXG4gICAgICog6YeK5pS+6YCa6L+HIHt7I2Nyb3NzTGluayBcIkJ1bmRsZS9sb2FkOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSDmiJbogIUge3sjY3Jvc3NMaW5rIFwiQnVuZGxlL2xvYWREaXI6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IOWKoOi9veeahOi1hOa6kOOAguivpue7huS/oeaBr+ivt+WPguiAgyB7eyNjcm9zc0xpbmsgXCJBc3NldE1hbmFnZXIvcmVsZWFzZUFzc2V0Om1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuICAgICAqIFxuICAgICAqIEBtZXRob2QgcmVsZWFzZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggb2YgYXNzZXRcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbdHlwZV0gLSBPbmx5IGFzc2V0IG9mIHR5cGUgd2lsbCBiZSByZWxlYXNlZCBpZiB0aGlzIGFyZ3VtZW50IGlzIHN1cHBsaWVkLlxuICAgICAqIFxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gcmVsZWFzZSBhIHRleHR1cmUgd2hpY2ggaXMgbm8gbG9uZ2VyIG5lZWRcbiAgICAgKiBidW5kbGUxLnJlbGVhc2UoJ21pc2MvY2hhcmFjdGVyL2NvY29zJyk7XG4gICAgICpcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHJlbGVhc2UocGF0aDogc3RyaW5nLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQpOiB2b2lkXG4gICAgICogcmVsZWFzZShwYXRoOiBzdHJpbmcpOiB2b2lkXG4gICAgICovXG4gICAgcmVsZWFzZSAocGF0aCwgdHlwZSkge1xuICAgICAgICByZWxlYXNlTWFuYWdlci50cnlSZWxlYXNlKHRoaXMuZ2V0KHBhdGgsIHR5cGUpLCB0cnVlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBcbiAgICAgKiBSZWxlYXNlIGFsbCB1bnVzZWQgYXNzZXRzIHdpdGhpbiB0aGlzIGJ1bmRsZS4gUmVmZXIgdG8ge3sjY3Jvc3NMaW5rIFwiQXNzZXRNYW5hZ2VyL3JlbGVhc2VBbGw6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IGZvciBkZXRhaWxlZCBpbmZvcm1hdGlvbnMuXG4gICAgICogXG4gICAgICogISN6aCBcbiAgICAgKiDph4rmlL7mraTljIXkuK3nmoTmiYDmnInmsqHmnInnlKjliLDnmoTotYTmupDjgILor6bnu4bkv6Hmga/or7flj4LogIMge3sjY3Jvc3NMaW5rIFwiQXNzZXRNYW5hZ2VyL3JlbGVhc2VBbGw6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJlbGVhc2VVbnVzZWRBc3NldHNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIFxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gcmVsZWFzZSBhbGwgdW51c2VkIGFzc2V0IHdpdGhpbiBidW5kbGUxXG4gICAgICogYnVuZGxlMS5yZWxlYXNlVW51c2VkQXNzZXRzKCk7XG4gICAgICogXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiByZWxlYXNlVW51c2VkQXNzZXRzKCk6IHZvaWRcbiAgICAgKi9cbiAgICByZWxlYXNlVW51c2VkQXNzZXRzICgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBhc3NldHMuZm9yRWFjaChmdW5jdGlvbiAoYXNzZXQpIHtcbiAgICAgICAgICAgIGxldCBpbmZvID0gc2VsZi5nZXRBc3NldEluZm8oYXNzZXQuX3V1aWQpO1xuICAgICAgICAgICAgaWYgKGluZm8gJiYgIWluZm8ucmVkaXJlY3QpIHtcbiAgICAgICAgICAgICAgICByZWxlYXNlTWFuYWdlci50cnlSZWxlYXNlKGFzc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gXG4gICAgICogUmVsZWFzZSBhbGwgYXNzZXRzIHdpdGhpbiB0aGlzIGJ1bmRsZS4gUmVmZXIgdG8ge3sjY3Jvc3NMaW5rIFwiQXNzZXRNYW5hZ2VyL3JlbGVhc2VBbGw6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IGZvciBkZXRhaWxlZCBpbmZvcm1hdGlvbnMuXG4gICAgICogXG4gICAgICogISN6aCBcbiAgICAgKiDph4rmlL7mraTljIXkuK3nmoTmiYDmnInotYTmupDjgILor6bnu4bkv6Hmga/or7flj4LogIMge3sjY3Jvc3NMaW5rIFwiQXNzZXRNYW5hZ2VyL3JlbGVhc2VBbGw6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJlbGVhc2VBbGxcbiAgICAgKiBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vIHJlbGVhc2UgYWxsIGFzc2V0IHdpdGhpbiBidW5kbGUxXG4gICAgICogYnVuZGxlMS5yZWxlYXNlQWxsKCk7XG4gICAgICogXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiByZWxlYXNlQWxsKCk6IHZvaWRcbiAgICAgKi9cbiAgICByZWxlYXNlQWxsICgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBhc3NldHMuZm9yRWFjaChmdW5jdGlvbiAoYXNzZXQpIHtcbiAgICAgICAgICAgIGxldCBpbmZvID0gc2VsZi5nZXRBc3NldEluZm8oYXNzZXQuX3V1aWQpO1xuICAgICAgICAgICAgaWYgKGluZm8gJiYgIWluZm8ucmVkaXJlY3QpIHtcbiAgICAgICAgICAgICAgICByZWxlYXNlTWFuYWdlci50cnlSZWxlYXNlKGFzc2V0LCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIF9kZXN0cm95ICgpIHtcbiAgICAgICAgdGhpcy5fY29uZmlnLmRlc3Ryb3koKTtcbiAgICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQnVuZGxlOyJdLCJzb3VyY2VSb290IjoiLyJ9