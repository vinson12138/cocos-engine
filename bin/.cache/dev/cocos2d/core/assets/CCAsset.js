
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCAsset.js';
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
var CCObject = require('../platform/CCObject');
/**
 * !#en
 * Base class for handling assets used in Creator.<br/>
 *
 * You may want to override:<br/>
 * - createNode<br/>
 * - getset functions of _nativeAsset<br/>
 * - cc.Object._serialize<br/>
 * - cc.Object._deserialize<br/>
 * !#zh
 * Creator 中的资源基类。<br/>
 *
 * 您可能需要重写：<br/>
 * - createNode <br/>
 * - _nativeAsset 的 getset 方法<br/>
 * - cc.Object._serialize<br/>
 * - cc.Object._deserialize<br/>
 *
 * @class Asset
 * @extends Object
 */


cc.Asset = cc.Class({
  name: 'cc.Asset',
  "extends": CCObject,
  ctor: function ctor() {
    /**
     * @property {String} _uuid
     * @private
     */
    // enumerable is false by default, to avoid uuid being assigned to empty string during destroy
    Object.defineProperty(this, '_uuid', {
      value: '',
      writable: true
    });
    /**
     * !#en
     * Whether the asset is loaded or not.
     * !#zh
     * 该资源是否已经成功加载。
     *
     * @property loaded
     * @type {Boolean}
     */

    this.loaded = true;
    this._nativeUrl = '';
    this._ref = 0;
  },
  properties: {
    /**
     * !#en
     * Returns the url of this asset's native object, if none it will returns an empty string.
     * !#zh
     * 返回该资源对应的目标平台资源的 URL，如果没有将返回一个空字符串。
     * @property nativeUrl
     * @type {String}
     * @readOnly
     */
    nativeUrl: {
      get: function get() {
        if (!this._nativeUrl) {
          if (this._native) {
            var name = this._native;

            if (name.charCodeAt(0) === 47) {
              // '/'
              // remove library tag
              // not imported in library, just created on-the-fly
              return name.slice(1);
            }

            if (name.charCodeAt(0) === 46) {
              // '.'
              // imported in dir where json exist
              this._nativeUrl = cc.assetManager.utils.getUrlWithUuid(this._uuid, {
                nativeExt: name,
                isNative: true
              });
            } else {
              // imported in an independent dir
              this._nativeUrl = cc.assetManager.utils.getUrlWithUuid(this._uuid, {
                __nativeName__: name,
                nativeExt: cc.path.extname(name),
                isNative: true
              });
            }
          }
        }

        return this._nativeUrl;
      },
      visible: false
    },

    /**
     * !#en
     * The number of reference
     * 
     * !#zh
     * 引用的数量
     * 
     * @property refCount
     * @type {Number}
     */
    refCount: {
      get: function get() {
        return this._ref;
      }
    },

    /**
     * !#en
     * Serializable url for native asset.
     * !#zh
     * 保存原生资源的 URL。
     * @property {String} _native
     * @default undefined
     * @private
     */
    _native: "",

    /**
     * !#en
     * The underlying native asset of this asset if one is available.
     * This property can be used to access additional details or functionality releated to the asset.
     * This property will be initialized by the loader if `_native` is available.
     * !#zh
     * 此资源依赖的底层原生资源（如果有的话）。
     * 此属性可用于访问与资源相关的其他详细信息或功能。
     * 如果 `_native` 可用，则此属性将由加载器初始化。
     * @property {Object} _nativeAsset
     * @default null
     * @private
     */
    _nativeAsset: {
      get: function get() {
        return this._$nativeAsset;
      },
      set: function set(obj) {
        this._$nativeAsset = obj;
      }
    },
    _nativeDep: {
      get: function get() {
        if (this._native) {
          return {
            __isNative__: true,
            uuid: this._uuid,
            ext: this._native
          };
        }
      }
    }
  },
  statics: {
    /**
     * !#en
     * Provide this method at the request of AssetDB.
     * !#zh
     * 应 AssetDB 要求提供这个方法。
     *
     * @method deserialize
     * @param {String} data
     * @return {Asset}
     * @static
     * @private
     */
    deserialize: CC_EDITOR && function (data) {
      return cc.deserialize(data);
    },

    /**
     * !#en Indicates whether its dependent raw assets can support deferred load if the owner scene (or prefab) is marked as `asyncLoadAssets`.
     * !#zh 当场景或 Prefab 被标记为 `asyncLoadAssets`，禁止延迟加载该资源所依赖的其它原始资源。
     *
     * @property {Boolean} preventDeferredLoadDependents
     * @default false
     * @static
     */
    preventDeferredLoadDependents: false,

    /**
     * !#en Indicates whether its native object should be preloaded from native url.
     * !#zh 禁止预加载原生对象。
     *
     * @property {Boolean} preventPreloadNativeObject
     * @default false
     * @static
     */
    preventPreloadNativeObject: false
  },

  /**
   * !#en
   * Returns the asset's url.
    * The `Asset` object overrides the `toString()` method of the `Object` object.
   * For `Asset` objects, the `toString()` method returns a string representation of the object.
   * JavaScript calls the `toString()` method automatically when an asset is to be represented as a text value or when a texture is referred to in a string concatenation.
   * !#zh
   * 返回资源的 URL。
   * 
   * Asset 对象将会重写 Object 对象的 `toString()` 方法。
   * 对于 Asset 对象，`toString()` 方法返回该对象的字符串表示形式。
   * 当资源要表示为文本值时或在字符串连接时引用时，JavaScript 会自动调用 `toString()` 方法。
   * @method toString
   * @return {String}
   */
  toString: function toString() {
    return this.nativeUrl;
  },

  /**
   * !#en
   * Provide this method at the request of AssetDB.
   * !#zh
   * 应 AssetDB 要求提供这个方法。
   *
   * @method serialize
   * @return {String}
   * @private
   */
  serialize: CC_EDITOR && function () {
    return Editor.serialize(this);
  },

  /**
   * !#en
   * Create a new node using this asset in the scene.<br/>
   * If this type of asset dont have its corresponding node type, this method should be null.
   * !#zh
   * 使用该资源在场景中创建一个新节点。<br/>
   * 如果这类资源没有相应的节点类型，该方法应该是空的。
   *
   * @method createNode
   * @param {Function} callback
   * @param {String} callback.error - null or the error info
   * @param {Object} callback.node - the created node or null
   */
  createNode: null,

  /**
   * !#en
   * Set native file name for this asset.
   * !#zh
   * 为此资源设置原生文件名。
   * 
   * @seealso nativeUrl
   *
   * @method _setRawAsset
   * @param {String} filename
   * @param {Boolean} [inLibrary=true]
   * @private
   */
  _setRawAsset: function _setRawAsset(filename, inLibrary) {
    if (inLibrary !== false) {
      this._native = filename || undefined;
    } else {
      this._native = '/' + filename; // simply use '/' to tag location where is not in the library
    }
  },

  /**
   * !#en
   * Add references of asset
   * 
   * !#zh
   * 增加资源的引用
   * 
   * @method addRef
   * @return {Asset} itself
   * 
   * @typescript
   * addRef(): cc.Asset
   */
  addRef: function addRef() {
    this._ref++;
    return this;
  },

  /**
   * !#en
   * Reduce references of asset and it will be auto released when refCount equals 0.
   * 
   * !#zh
   * 减少资源的引用并尝试进行自动释放。
   * 
   * @method decRef
   * @return {Asset} itself
   * 
   * @typescript
   * decRef(): cc.Asset
   */
  decRef: function decRef(autoRelease) {
    this._ref > 0 && this._ref--;
    autoRelease !== false && cc.assetManager._releaseManager.tryRelease(this);
    return this;
  }
});
module.exports = cc.Asset;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0cy9DQ0Fzc2V0LmpzIl0sIm5hbWVzIjpbIkNDT2JqZWN0IiwicmVxdWlyZSIsImNjIiwiQXNzZXQiLCJDbGFzcyIsIm5hbWUiLCJjdG9yIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJ2YWx1ZSIsIndyaXRhYmxlIiwibG9hZGVkIiwiX25hdGl2ZVVybCIsIl9yZWYiLCJwcm9wZXJ0aWVzIiwibmF0aXZlVXJsIiwiZ2V0IiwiX25hdGl2ZSIsImNoYXJDb2RlQXQiLCJzbGljZSIsImFzc2V0TWFuYWdlciIsInV0aWxzIiwiZ2V0VXJsV2l0aFV1aWQiLCJfdXVpZCIsIm5hdGl2ZUV4dCIsImlzTmF0aXZlIiwiX19uYXRpdmVOYW1lX18iLCJwYXRoIiwiZXh0bmFtZSIsInZpc2libGUiLCJyZWZDb3VudCIsIl9uYXRpdmVBc3NldCIsIl8kbmF0aXZlQXNzZXQiLCJzZXQiLCJvYmoiLCJfbmF0aXZlRGVwIiwiX19pc05hdGl2ZV9fIiwidXVpZCIsImV4dCIsInN0YXRpY3MiLCJkZXNlcmlhbGl6ZSIsIkNDX0VESVRPUiIsImRhdGEiLCJwcmV2ZW50RGVmZXJyZWRMb2FkRGVwZW5kZW50cyIsInByZXZlbnRQcmVsb2FkTmF0aXZlT2JqZWN0IiwidG9TdHJpbmciLCJzZXJpYWxpemUiLCJFZGl0b3IiLCJjcmVhdGVOb2RlIiwiX3NldFJhd0Fzc2V0IiwiZmlsZW5hbWUiLCJpbkxpYnJhcnkiLCJ1bmRlZmluZWQiLCJhZGRSZWYiLCJkZWNSZWYiLCJhdXRvUmVsZWFzZSIsIl9yZWxlYXNlTWFuYWdlciIsInRyeVJlbGVhc2UiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxudmFyIENDT2JqZWN0ID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vQ0NPYmplY3QnKTtcblxuLyoqXG4gKiAhI2VuXG4gKiBCYXNlIGNsYXNzIGZvciBoYW5kbGluZyBhc3NldHMgdXNlZCBpbiBDcmVhdG9yLjxici8+XG4gKlxuICogWW91IG1heSB3YW50IHRvIG92ZXJyaWRlOjxici8+XG4gKiAtIGNyZWF0ZU5vZGU8YnIvPlxuICogLSBnZXRzZXQgZnVuY3Rpb25zIG9mIF9uYXRpdmVBc3NldDxici8+XG4gKiAtIGNjLk9iamVjdC5fc2VyaWFsaXplPGJyLz5cbiAqIC0gY2MuT2JqZWN0Ll9kZXNlcmlhbGl6ZTxici8+XG4gKiAhI3poXG4gKiBDcmVhdG9yIOS4reeahOi1hOa6kOWfuuexu+OAgjxici8+XG4gKlxuICog5oKo5Y+v6IO96ZyA6KaB6YeN5YaZ77yaPGJyLz5cbiAqIC0gY3JlYXRlTm9kZSA8YnIvPlxuICogLSBfbmF0aXZlQXNzZXQg55qEIGdldHNldCDmlrnms5U8YnIvPlxuICogLSBjYy5PYmplY3QuX3NlcmlhbGl6ZTxici8+XG4gKiAtIGNjLk9iamVjdC5fZGVzZXJpYWxpemU8YnIvPlxuICpcbiAqIEBjbGFzcyBBc3NldFxuICogQGV4dGVuZHMgT2JqZWN0XG4gKi9cbmNjLkFzc2V0ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5Bc3NldCcsIGV4dGVuZHM6IENDT2JqZWN0LFxuXG4gICAgY3RvciAoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gX3V1aWRcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIC8vIGVudW1lcmFibGUgaXMgZmFsc2UgYnkgZGVmYXVsdCwgdG8gYXZvaWQgdXVpZCBiZWluZyBhc3NpZ25lZCB0byBlbXB0eSBzdHJpbmcgZHVyaW5nIGRlc3Ryb3lcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdfdXVpZCcsIHtcbiAgICAgICAgICAgIHZhbHVlOiAnJyxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogV2hldGhlciB0aGUgYXNzZXQgaXMgbG9hZGVkIG9yIG5vdC5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDor6XotYTmupDmmK/lkKblt7Lnu4/miJDlip/liqDovb3jgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3BlcnR5IGxvYWRlZFxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbmF0aXZlVXJsID0gJyc7XG4gICAgICAgIHRoaXMuX3JlZiA9IDA7XG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogUmV0dXJucyB0aGUgdXJsIG9mIHRoaXMgYXNzZXQncyBuYXRpdmUgb2JqZWN0LCBpZiBub25lIGl0IHdpbGwgcmV0dXJucyBhbiBlbXB0eSBzdHJpbmcuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog6L+U5Zue6K+l6LWE5rqQ5a+55bqU55qE55uu5qCH5bmz5Y+w6LWE5rqQ55qEIFVSTO+8jOWmguaenOayoeacieWwhui/lOWbnuS4gOS4quepuuWtl+espuS4suOAglxuICAgICAgICAgKiBAcHJvcGVydHkgbmF0aXZlVXJsXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAgKi9cbiAgICAgICAgbmF0aXZlVXJsOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX25hdGl2ZVVybCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fbmF0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IHRoaXMuX25hdGl2ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuYW1lLmNoYXJDb2RlQXQoMCkgPT09IDQ3KSB7ICAgIC8vICcvJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBsaWJyYXJ5IHRhZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vdCBpbXBvcnRlZCBpbiBsaWJyYXJ5LCBqdXN0IGNyZWF0ZWQgb24tdGhlLWZseVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuYW1lLnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWUuY2hhckNvZGVBdCgwKSA9PT0gNDYpIHsgIC8vICcuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbXBvcnRlZCBpbiBkaXIgd2hlcmUganNvbiBleGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX25hdGl2ZVVybCA9IGNjLmFzc2V0TWFuYWdlci51dGlscy5nZXRVcmxXaXRoVXVpZCh0aGlzLl91dWlkLCB7bmF0aXZlRXh0OiBuYW1lLCBpc05hdGl2ZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGltcG9ydGVkIGluIGFuIGluZGVwZW5kZW50IGRpclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX25hdGl2ZVVybCA9IGNjLmFzc2V0TWFuYWdlci51dGlscy5nZXRVcmxXaXRoVXVpZCh0aGlzLl91dWlkLCB7X19uYXRpdmVOYW1lX186IG5hbWUsIG5hdGl2ZUV4dDogY2MucGF0aC5leHRuYW1lKG5hbWUpLCBpc05hdGl2ZTogdHJ1ZX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9uYXRpdmVVcmw7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgbnVtYmVyIG9mIHJlZmVyZW5jZVxuICAgICAgICAgKiBcbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDlvJXnlKjnmoTmlbDph49cbiAgICAgICAgICogXG4gICAgICAgICAqIEBwcm9wZXJ0eSByZWZDb3VudFxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgcmVmQ291bnQ6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBTZXJpYWxpemFibGUgdXJsIGZvciBuYXRpdmUgYXNzZXQuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5L+d5a2Y5Y6f55Sf6LWE5rqQ55qEIFVSTOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gX25hdGl2ZVxuICAgICAgICAgKiBAZGVmYXVsdCB1bmRlZmluZWRcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF9uYXRpdmU6IFwiXCIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIHVuZGVybHlpbmcgbmF0aXZlIGFzc2V0IG9mIHRoaXMgYXNzZXQgaWYgb25lIGlzIGF2YWlsYWJsZS5cbiAgICAgICAgICogVGhpcyBwcm9wZXJ0eSBjYW4gYmUgdXNlZCB0byBhY2Nlc3MgYWRkaXRpb25hbCBkZXRhaWxzIG9yIGZ1bmN0aW9uYWxpdHkgcmVsZWF0ZWQgdG8gdGhlIGFzc2V0LlxuICAgICAgICAgKiBUaGlzIHByb3BlcnR5IHdpbGwgYmUgaW5pdGlhbGl6ZWQgYnkgdGhlIGxvYWRlciBpZiBgX25hdGl2ZWAgaXMgYXZhaWxhYmxlLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOatpOi1hOa6kOS+nei1lueahOW6leWxguWOn+eUn+i1hOa6kO+8iOWmguaenOacieeahOivne+8ieOAglxuICAgICAgICAgKiDmraTlsZ7mgKflj6/nlKjkuo7orr/pl67kuI7otYTmupDnm7jlhbPnmoTlhbbku5bor6bnu4bkv6Hmga/miJblip/og73jgIJcbiAgICAgICAgICog5aaC5p6cIGBfbmF0aXZlYCDlj6/nlKjvvIzliJnmraTlsZ7mgKflsIbnlLHliqDovb3lmajliJ3lp4vljJbjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtPYmplY3R9IF9uYXRpdmVBc3NldFxuICAgICAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBfbmF0aXZlQXNzZXQ6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuXyRuYXRpdmVBc3NldDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKG9iaikge1xuICAgICAgICAgICAgICAgIHRoaXMuXyRuYXRpdmVBc3NldCA9IG9iajtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfbmF0aXZlRGVwOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9uYXRpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtfX2lzTmF0aXZlX186IHRydWUsIHV1aWQ6IHRoaXMuX3V1aWQsIGV4dDogdGhpcy5fbmF0aXZlfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBQcm92aWRlIHRoaXMgbWV0aG9kIGF0IHRoZSByZXF1ZXN0IG9mIEFzc2V0REIuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5bqUIEFzc2V0REIg6KaB5rGC5o+Q5L6b6L+Z5Liq5pa55rOV44CCXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZXRob2QgZGVzZXJpYWxpemVcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGFcbiAgICAgICAgICogQHJldHVybiB7QXNzZXR9XG4gICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGRlc2VyaWFsaXplOiBDQ19FRElUT1IgJiYgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBjYy5kZXNlcmlhbGl6ZShkYXRhKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBJbmRpY2F0ZXMgd2hldGhlciBpdHMgZGVwZW5kZW50IHJhdyBhc3NldHMgY2FuIHN1cHBvcnQgZGVmZXJyZWQgbG9hZCBpZiB0aGUgb3duZXIgc2NlbmUgKG9yIHByZWZhYikgaXMgbWFya2VkIGFzIGBhc3luY0xvYWRBc3NldHNgLlxuICAgICAgICAgKiAhI3poIOW9k+WcuuaZr+aIliBQcmVmYWIg6KKr5qCH6K6w5Li6IGBhc3luY0xvYWRBc3NldHNg77yM56aB5q2i5bu26L+f5Yqg6L296K+l6LWE5rqQ5omA5L6d6LWW55qE5YW25a6D5Y6f5aeL6LWE5rqQ44CCXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gcHJldmVudERlZmVycmVkTG9hZERlcGVuZGVudHNcbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICogQHN0YXRpY1xuICAgICAgICAgKi9cbiAgICAgICAgcHJldmVudERlZmVycmVkTG9hZERlcGVuZGVudHM6IGZhbHNlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEluZGljYXRlcyB3aGV0aGVyIGl0cyBuYXRpdmUgb2JqZWN0IHNob3VsZCBiZSBwcmVsb2FkZWQgZnJvbSBuYXRpdmUgdXJsLlxuICAgICAgICAgKiAhI3poIOemgeatoumihOWKoOi9veWOn+eUn+WvueixoeOAglxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IHByZXZlbnRQcmVsb2FkTmF0aXZlT2JqZWN0XG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICovXG4gICAgICAgIHByZXZlbnRQcmVsb2FkTmF0aXZlT2JqZWN0OiBmYWxzZVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIHRoZSBhc3NldCdzIHVybC5cblxuICAgICAqIFRoZSBgQXNzZXRgIG9iamVjdCBvdmVycmlkZXMgdGhlIGB0b1N0cmluZygpYCBtZXRob2Qgb2YgdGhlIGBPYmplY3RgIG9iamVjdC5cbiAgICAgKiBGb3IgYEFzc2V0YCBvYmplY3RzLCB0aGUgYHRvU3RyaW5nKClgIG1ldGhvZCByZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBvYmplY3QuXG4gICAgICogSmF2YVNjcmlwdCBjYWxscyB0aGUgYHRvU3RyaW5nKClgIG1ldGhvZCBhdXRvbWF0aWNhbGx5IHdoZW4gYW4gYXNzZXQgaXMgdG8gYmUgcmVwcmVzZW50ZWQgYXMgYSB0ZXh0IHZhbHVlIG9yIHdoZW4gYSB0ZXh0dXJlIGlzIHJlZmVycmVkIHRvIGluIGEgc3RyaW5nIGNvbmNhdGVuYXRpb24uXG4gICAgICogISN6aFxuICAgICAqIOi/lOWbnui1hOa6kOeahCBVUkzjgIJcbiAgICAgKiBcbiAgICAgKiBBc3NldCDlr7nosaHlsIbkvJrph43lhpkgT2JqZWN0IOWvueixoeeahCBgdG9TdHJpbmcoKWAg5pa55rOV44CCXG4gICAgICog5a+55LqOIEFzc2V0IOWvueixoe+8jGB0b1N0cmluZygpYCDmlrnms5Xov5Tlm57or6Xlr7nosaHnmoTlrZfnrKbkuLLooajnpLrlvaLlvI/jgIJcbiAgICAgKiDlvZPotYTmupDopoHooajnpLrkuLrmlofmnKzlgLzml7bmiJblnKjlrZfnrKbkuLLov57mjqXml7blvJXnlKjml7bvvIxKYXZhU2NyaXB0IOS8muiHquWKqOiwg+eUqCBgdG9TdHJpbmcoKWAg5pa55rOV44CCXG4gICAgICogQG1ldGhvZCB0b1N0cmluZ1xuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKi9cbiAgICB0b1N0cmluZyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hdGl2ZVVybDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFByb3ZpZGUgdGhpcyBtZXRob2QgYXQgdGhlIHJlcXVlc3Qgb2YgQXNzZXREQi5cbiAgICAgKiAhI3poXG4gICAgICog5bqUIEFzc2V0REIg6KaB5rGC5o+Q5L6b6L+Z5Liq5pa55rOV44CCXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNlcmlhbGl6ZVxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHNlcmlhbGl6ZTogQ0NfRURJVE9SICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIEVkaXRvci5zZXJpYWxpemUodGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDcmVhdGUgYSBuZXcgbm9kZSB1c2luZyB0aGlzIGFzc2V0IGluIHRoZSBzY2VuZS48YnIvPlxuICAgICAqIElmIHRoaXMgdHlwZSBvZiBhc3NldCBkb250IGhhdmUgaXRzIGNvcnJlc3BvbmRpbmcgbm9kZSB0eXBlLCB0aGlzIG1ldGhvZCBzaG91bGQgYmUgbnVsbC5cbiAgICAgKiAhI3poXG4gICAgICog5L2/55So6K+l6LWE5rqQ5Zyo5Zy65pmv5Lit5Yib5bu65LiA5Liq5paw6IqC54K544CCPGJyLz5cbiAgICAgKiDlpoLmnpzov5nnsbvotYTmupDmsqHmnInnm7jlupTnmoToioLngrnnsbvlnovvvIzor6Xmlrnms5XlupTor6XmmK/nqbrnmoTjgIJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgY3JlYXRlTm9kZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGNhbGxiYWNrLmVycm9yIC0gbnVsbCBvciB0aGUgZXJyb3IgaW5mb1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjYWxsYmFjay5ub2RlIC0gdGhlIGNyZWF0ZWQgbm9kZSBvciBudWxsXG4gICAgICovXG4gICAgY3JlYXRlTm9kZTogbnVsbCxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTZXQgbmF0aXZlIGZpbGUgbmFtZSBmb3IgdGhpcyBhc3NldC5cbiAgICAgKiAhI3poXG4gICAgICog5Li65q2k6LWE5rqQ6K6+572u5Y6f55Sf5paH5Lu25ZCN44CCXG4gICAgICogXG4gICAgICogQHNlZWFsc28gbmF0aXZlVXJsXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIF9zZXRSYXdBc3NldFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2luTGlicmFyeT10cnVlXVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldFJhd0Fzc2V0OiBmdW5jdGlvbiAoZmlsZW5hbWUsIGluTGlicmFyeSkge1xuICAgICAgICBpZiAoaW5MaWJyYXJ5ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgdGhpcy5fbmF0aXZlID0gZmlsZW5hbWUgfHwgdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbmF0aXZlID0gJy8nICsgZmlsZW5hbWU7ICAvLyBzaW1wbHkgdXNlICcvJyB0byB0YWcgbG9jYXRpb24gd2hlcmUgaXMgbm90IGluIHRoZSBsaWJyYXJ5XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEFkZCByZWZlcmVuY2VzIG9mIGFzc2V0XG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOWinuWKoOi1hOa6kOeahOW8leeUqFxuICAgICAqIFxuICAgICAqIEBtZXRob2QgYWRkUmVmXG4gICAgICogQHJldHVybiB7QXNzZXR9IGl0c2VsZlxuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogYWRkUmVmKCk6IGNjLkFzc2V0XG4gICAgICovXG4gICAgYWRkUmVmICgpIHtcbiAgICAgICAgdGhpcy5fcmVmKys7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmVkdWNlIHJlZmVyZW5jZXMgb2YgYXNzZXQgYW5kIGl0IHdpbGwgYmUgYXV0byByZWxlYXNlZCB3aGVuIHJlZkNvdW50IGVxdWFscyAwLlxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDlh4/lsJHotYTmupDnmoTlvJXnlKjlubblsJ3or5Xov5vooYzoh6rliqjph4rmlL7jgIJcbiAgICAgKiBcbiAgICAgKiBAbWV0aG9kIGRlY1JlZlxuICAgICAqIEByZXR1cm4ge0Fzc2V0fSBpdHNlbGZcbiAgICAgKiBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGRlY1JlZigpOiBjYy5Bc3NldFxuICAgICAqL1xuICAgIGRlY1JlZiAoYXV0b1JlbGVhc2UpIHtcbiAgICAgICAgdGhpcy5fcmVmID4gMCAmJiB0aGlzLl9yZWYtLTtcbiAgICAgICAgYXV0b1JlbGVhc2UgIT09IGZhbHNlICYmIGNjLmFzc2V0TWFuYWdlci5fcmVsZWFzZU1hbmFnZXIudHJ5UmVsZWFzZSh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gY2MuQXNzZXQ7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==