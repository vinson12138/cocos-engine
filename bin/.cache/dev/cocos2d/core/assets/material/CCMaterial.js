
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/material/CCMaterial.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
var Asset = require('../CCAsset');

var Texture = require('../CCTexture2D');

var PixelFormat = Texture.PixelFormat;

var EffectAsset = require('./CCEffectAsset');

var textureUtil = require('../../utils/texture-util');

var gfx = cc.gfx;
/**
 * !#en Material builtin name
 * !#zh 内置材质名字
 * @enum Material.BUILTIN_NAME
 */

var BUILTIN_NAME = cc.Enum({
  /**
   * @property SPRITE
   * @readonly
   * @type {String}
   */
  SPRITE: '2d-sprite',

  /**
   * @property GRAY_SPRITE
   * @readonly
   * @type {String}
   */
  GRAY_SPRITE: '2d-gray-sprite',

  /**
   * @property UNLIT
   * @readonly
   * @type {String}
   */
  UNLIT: 'unlit'
});
/**
 * !#en Material Asset.
 * !#zh 材质资源类。
 * @class Material
 * @extends Asset
 */

var Material = cc.Class({
  name: 'cc.Material',
  "extends": Asset,
  ctor: function ctor() {
    this.loaded = false;
    this._manualHash = false;
    this._dirty = true;
    this._effect = null;
  },
  properties: {
    // deprecated
    _defines: {
      "default": undefined,
      type: Object
    },
    // deprecated
    _props: {
      "default": undefined,
      type: Object
    },
    _effectAsset: {
      type: EffectAsset,
      "default": null
    },
    _techniqueIndex: 0,
    _techniqueData: Object,
    effectName: CC_EDITOR ? {
      get: function get() {
        return this._effectAsset && this._effectAsset.name;
      },
      set: function set(val) {
        var effectAsset = cc.assetManager.builtins.getBuiltin('effect', val);

        if (!effectAsset) {
          Editor.warn("no effect named '" + val + "' found");
          return;
        }

        this.effectAsset = effectAsset;
      }
    } : undefined,
    effectAsset: {
      get: function get() {
        return this._effectAsset;
      },
      set: function set(asset) {
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
          return;
        }

        this._effectAsset = asset;

        if (!asset) {
          cc.error('Can not set an empty effect asset.');
          return;
        }

        this._effect = this._effectAsset.getInstantiatedEffect();
      }
    },
    effect: {
      get: function get() {
        return this._effect;
      }
    },
    techniqueIndex: {
      get: function get() {
        return this._techniqueIndex;
      },
      set: function set(v) {
        this._techniqueIndex = v;

        this._effect.switchTechnique(v);
      }
    }
  },
  statics: {
    /**
     * !#en Get built-in materials
     * !#zh 获取内置材质
     * @static
     * @method getBuiltinMaterial
     * @param {string} name 
     * @return {Material}
     */
    getBuiltinMaterial: function getBuiltinMaterial(name) {
      if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
        return new cc.Material();
      }

      return cc.assetManager.builtins.getBuiltin('material', 'builtin-' + name);
    },
    BUILTIN_NAME: BUILTIN_NAME,

    /**
     * !#en Creates a Material with builtin Effect.
     * !#zh 使用内建 Effect 创建一个材质。
     * @static
     * @method createWithBuiltin
     * @param {string} effectName 
     * @param {number} [techniqueIndex] 
     * @return {Material}
     */
    createWithBuiltin: function createWithBuiltin(effectName, techniqueIndex) {
      if (techniqueIndex === void 0) {
        techniqueIndex = 0;
      }

      var effectAsset = cc.assetManager.builtins.getBuiltin('effect', 'builtin-' + effectName);
      return Material.create(effectAsset, techniqueIndex);
    },

    /**
     * !#en Creates a Material.
     * !#zh 创建一个材质。
     * @static
     * @method create
     * @param {EffectAsset} effectAsset 
     * @param {number} [techniqueIndex] 
     * @return {Material}
     */
    create: function create(effectAsset, techniqueIndex) {
      if (techniqueIndex === void 0) {
        techniqueIndex = 0;
      }

      if (!effectAsset) return null;
      var material = new Material();
      material.effectAsset = effectAsset;
      material.techniqueIndex = techniqueIndex;
      return material;
    }
  },

  /**
   * !#en Sets the Material property
   * !#zh 设置材质的属性
   * @method setProperty
   * @param {string} name
   * @param {Object} val
   * @param {number} [passIdx]
   * @param {boolean} [directly]
   */
  setProperty: function setProperty(name, val, passIdx, directly) {
    if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) return;

    if (typeof passIdx === 'string') {
      passIdx = parseInt(passIdx);
    }

    if (val instanceof Texture) {
      var isAlphaAtlas = val.isAlphaAtlas();
      var key = 'CC_USE_ALPHA_ATLAS_' + name;
      var def = this.getDefine(key, passIdx);

      if (isAlphaAtlas || def) {
        this.define(key, isAlphaAtlas);
      }

      if (!val.loaded) {
        cc.assetManager.postLoadNative(val);
      }
    }

    this._effect.setProperty(name, val, passIdx, directly);
  },

  /**
   * !#en Gets the Material property.
   * !#zh 获取材质的属性。
   * @method getProperty
   * @param {string} name 
   * @param {number} passIdx 
   * @return {Object}
   */
  getProperty: function getProperty(name, passIdx) {
    if (typeof passIdx === 'string') {
      passIdx = parseInt(passIdx);
    }

    return this._effect.getProperty(name, passIdx);
  },

  /**
   * !#en Sets the Material define.
   * !#zh 设置材质的宏定义。
   * @method define
   * @param {string} name
   * @param {boolean|number} val
   * @param {number} [passIdx]
   * @param {boolean} [force]
   */
  define: function define(name, val, passIdx, force) {
    if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) return;

    if (typeof passIdx === 'string') {
      passIdx = parseInt(passIdx);
    }

    this._effect.define(name, val, passIdx, force);
  },

  /**
   * !#en Gets the Material define.
   * !#zh 获取材质的宏定义。
   * @method getDefine
   * @param {string} name 
   * @param {number} [passIdx] 
   * @return {boolean|number}
   */
  getDefine: function getDefine(name, passIdx) {
    if (typeof passIdx === 'string') {
      passIdx = parseInt(passIdx);
    }

    return this._effect.getDefine(name, passIdx);
  },

  /**
   * !#en Sets the Material cull mode.
   * !#zh 设置材质的裁减模式。
   * @method setCullMode
   * @param {number} cullMode 
   * @param {number} passIdx 
   */
  setCullMode: function setCullMode(cullMode, passIdx) {
    if (cullMode === void 0) {
      cullMode = gfx.CULL_BACK;
    }

    this._effect.setCullMode(cullMode, passIdx);
  },

  /**
   * !#en Sets the Material depth states.
   * !#zh 设置材质的深度渲染状态。
   * @method setDepth
   * @param {boolean} depthTest 
   * @param {boolean} depthWrite 
   * @param {number} depthFunc 
   * @param {number} passIdx 
   */
  setDepth: function setDepth(depthTest, depthWrite, depthFunc, passIdx) {
    if (depthTest === void 0) {
      depthTest = false;
    }

    if (depthWrite === void 0) {
      depthWrite = false;
    }

    if (depthFunc === void 0) {
      depthFunc = gfx.DS_FUNC_LESS;
    }

    this._effect.setDepth(depthTest, depthWrite, depthFunc, passIdx);
  },

  /**
   * !#en Sets the Material blend states.
   * !#zh 设置材质的混合渲染状态。
   * @method setBlend
   * @param {boolean} enabled 
   * @param {number} blendEq 
   * @param {number} blendSrc 
   * @param {number} blendDst 
   * @param {number} blendAlphaEq 
   * @param {number} blendSrcAlpha 
   * @param {number} blendDstAlpha 
   * @param {number} blendColor 
   * @param {number} passIdx 
   */
  setBlend: function setBlend(enabled, blendEq, blendSrc, blendDst, blendAlphaEq, blendSrcAlpha, blendDstAlpha, blendColor, passIdx) {
    if (enabled === void 0) {
      enabled = false;
    }

    if (blendEq === void 0) {
      blendEq = gfx.BLEND_FUNC_ADD;
    }

    if (blendSrc === void 0) {
      blendSrc = gfx.BLEND_SRC_ALPHA;
    }

    if (blendDst === void 0) {
      blendDst = gfx.BLEND_ONE_MINUS_SRC_ALPHA;
    }

    if (blendAlphaEq === void 0) {
      blendAlphaEq = gfx.BLEND_FUNC_ADD;
    }

    if (blendSrcAlpha === void 0) {
      blendSrcAlpha = gfx.BLEND_SRC_ALPHA;
    }

    if (blendDstAlpha === void 0) {
      blendDstAlpha = gfx.BLEND_ONE_MINUS_SRC_ALPHA;
    }

    if (blendColor === void 0) {
      blendColor = 0xffffffff;
    }

    this._effect.setBlend(enabled, blendEq, blendSrc, blendDst, blendAlphaEq, blendSrcAlpha, blendDstAlpha, blendColor, passIdx);
  },

  /**
   * !#en Sets whether enable the stencil test.
   * !#zh 设置是否开启模板测试。
   * @method setStencilEnabled
   * @param {number} stencilTest 
   * @param {number} passIdx 
   */
  setStencilEnabled: function setStencilEnabled(stencilTest, passIdx) {
    if (stencilTest === void 0) {
      stencilTest = gfx.STENCIL_INHERIT;
    }

    this._effect.setStencilEnabled(stencilTest, passIdx);
  },

  /**
   * !#en Sets the Material stencil render states.
   * !#zh 设置材质的模板测试渲染参数。
   * @method setStencil
   * @param {number} stencilTest 
   * @param {number} stencilFunc 
   * @param {number} stencilRef 
   * @param {number} stencilMask 
   * @param {number} stencilFailOp 
   * @param {number} stencilZFailOp 
   * @param {number} stencilZPassOp 
   * @param {number} stencilWriteMask 
   * @param {number} passIdx 
   */
  setStencil: function setStencil(stencilTest, stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask, passIdx) {
    if (stencilTest === void 0) {
      stencilTest = gfx.STENCIL_INHERIT;
    }

    if (stencilFunc === void 0) {
      stencilFunc = gfx.DS_FUNC_ALWAYS;
    }

    if (stencilRef === void 0) {
      stencilRef = 0;
    }

    if (stencilMask === void 0) {
      stencilMask = 0xff;
    }

    if (stencilFailOp === void 0) {
      stencilFailOp = gfx.STENCIL_OP_KEEP;
    }

    if (stencilZFailOp === void 0) {
      stencilZFailOp = gfx.STENCIL_OP_KEEP;
    }

    if (stencilZPassOp === void 0) {
      stencilZPassOp = gfx.STENCIL_OP_KEEP;
    }

    if (stencilWriteMask === void 0) {
      stencilWriteMask = 0xff;
    }

    this._effect.setStencil(stencilTest, stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask, passIdx);
  },
  updateHash: function updateHash(hash) {
    this._manualHash = hash;
    this._effect && this._effect.updateHash(hash);
  },
  getHash: function getHash() {
    return this._manualHash || this._effect && this._effect.getHash();
  },
  onLoad: function onLoad() {
    this.effectAsset = this._effectAsset;
    if (!this._effect) return;

    if (this._techniqueIndex) {
      this._effect.switchTechnique(this._techniqueIndex);
    }

    this._techniqueData = this._techniqueData || {};
    var passDatas = this._techniqueData;

    for (var index in passDatas) {
      index = parseInt(index);
      var passData = passDatas[index];
      if (!passData) continue;

      for (var def in passData.defines) {
        this.define(def, passData.defines[def], index);
      }

      for (var prop in passData.props) {
        this.setProperty(prop, passData.props[prop], index);
      }
    }
  }
});
var _default = Material;
exports["default"] = _default;
cc.Material = Material;
module.exports = exports["default"];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0cy9tYXRlcmlhbC9DQ01hdGVyaWFsLmpzIl0sIm5hbWVzIjpbIkFzc2V0IiwicmVxdWlyZSIsIlRleHR1cmUiLCJQaXhlbEZvcm1hdCIsIkVmZmVjdEFzc2V0IiwidGV4dHVyZVV0aWwiLCJnZngiLCJjYyIsIkJVSUxUSU5fTkFNRSIsIkVudW0iLCJTUFJJVEUiLCJHUkFZX1NQUklURSIsIlVOTElUIiwiTWF0ZXJpYWwiLCJDbGFzcyIsIm5hbWUiLCJjdG9yIiwibG9hZGVkIiwiX21hbnVhbEhhc2giLCJfZGlydHkiLCJfZWZmZWN0IiwicHJvcGVydGllcyIsIl9kZWZpbmVzIiwidW5kZWZpbmVkIiwidHlwZSIsIk9iamVjdCIsIl9wcm9wcyIsIl9lZmZlY3RBc3NldCIsIl90ZWNobmlxdWVJbmRleCIsIl90ZWNobmlxdWVEYXRhIiwiZWZmZWN0TmFtZSIsIkNDX0VESVRPUiIsImdldCIsInNldCIsInZhbCIsImVmZmVjdEFzc2V0IiwiYXNzZXRNYW5hZ2VyIiwiYnVpbHRpbnMiLCJnZXRCdWlsdGluIiwiRWRpdG9yIiwid2FybiIsImFzc2V0IiwiZ2FtZSIsInJlbmRlclR5cGUiLCJSRU5ERVJfVFlQRV9DQU5WQVMiLCJlcnJvciIsImdldEluc3RhbnRpYXRlZEVmZmVjdCIsImVmZmVjdCIsInRlY2huaXF1ZUluZGV4IiwidiIsInN3aXRjaFRlY2huaXF1ZSIsInN0YXRpY3MiLCJnZXRCdWlsdGluTWF0ZXJpYWwiLCJjcmVhdGVXaXRoQnVpbHRpbiIsImNyZWF0ZSIsIm1hdGVyaWFsIiwic2V0UHJvcGVydHkiLCJwYXNzSWR4IiwiZGlyZWN0bHkiLCJwYXJzZUludCIsImlzQWxwaGFBdGxhcyIsImtleSIsImRlZiIsImdldERlZmluZSIsImRlZmluZSIsInBvc3RMb2FkTmF0aXZlIiwiZ2V0UHJvcGVydHkiLCJmb3JjZSIsInNldEN1bGxNb2RlIiwiY3VsbE1vZGUiLCJDVUxMX0JBQ0siLCJzZXREZXB0aCIsImRlcHRoVGVzdCIsImRlcHRoV3JpdGUiLCJkZXB0aEZ1bmMiLCJEU19GVU5DX0xFU1MiLCJzZXRCbGVuZCIsImVuYWJsZWQiLCJibGVuZEVxIiwiYmxlbmRTcmMiLCJibGVuZERzdCIsImJsZW5kQWxwaGFFcSIsImJsZW5kU3JjQWxwaGEiLCJibGVuZERzdEFscGhhIiwiYmxlbmRDb2xvciIsIkJMRU5EX0ZVTkNfQUREIiwiQkxFTkRfU1JDX0FMUEhBIiwiQkxFTkRfT05FX01JTlVTX1NSQ19BTFBIQSIsInNldFN0ZW5jaWxFbmFibGVkIiwic3RlbmNpbFRlc3QiLCJTVEVOQ0lMX0lOSEVSSVQiLCJzZXRTdGVuY2lsIiwic3RlbmNpbEZ1bmMiLCJzdGVuY2lsUmVmIiwic3RlbmNpbE1hc2siLCJzdGVuY2lsRmFpbE9wIiwic3RlbmNpbFpGYWlsT3AiLCJzdGVuY2lsWlBhc3NPcCIsInN0ZW5jaWxXcml0ZU1hc2siLCJEU19GVU5DX0FMV0FZUyIsIlNURU5DSUxfT1BfS0VFUCIsInVwZGF0ZUhhc2giLCJoYXNoIiwiZ2V0SGFzaCIsIm9uTG9hZCIsInBhc3NEYXRhcyIsImluZGV4IiwicGFzc0RhdGEiLCJkZWZpbmVzIiwicHJvcCIsInByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsS0FBSyxHQUFHQyxPQUFPLENBQUMsWUFBRCxDQUFyQjs7QUFDQSxJQUFNQyxPQUFPLEdBQUdELE9BQU8sQ0FBQyxnQkFBRCxDQUF2Qjs7QUFDQSxJQUFNRSxXQUFXLEdBQUdELE9BQU8sQ0FBQ0MsV0FBNUI7O0FBQ0EsSUFBTUMsV0FBVyxHQUFHSCxPQUFPLENBQUMsaUJBQUQsQ0FBM0I7O0FBQ0EsSUFBTUksV0FBVyxHQUFHSixPQUFPLENBQUMsMEJBQUQsQ0FB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QyxHQUFqQixDQUFqQixFQUF3QzRDLEtBQXhDO0FBQ0g7O0FBQ0QsV0FBSyxJQUFJRyxJQUFULElBQWlCRixRQUFRLENBQUNHLEtBQTFCLEVBQWlDO0FBQzdCLGFBQUt0RCxXQUFMLENBQWlCcUQsSUFBakIsRUFBdUJGLFFBQVEsQ0FBQ0csS0FBVCxDQUFlRCxJQUFmLENBQXZCLEVBQTZDSCxLQUE3QztBQUNIO0FBQ0o7QUFFSjtBQWxWbUIsQ0FBVCxDQUFmO2VBcVZlN0Y7O0FBQ2ZOLEVBQUUsQ0FBQ00sUUFBSCxHQUFjQSxRQUFkIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHA6Ly93d3cuY29jb3MuY29tXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBBc3NldCA9IHJlcXVpcmUoJy4uL0NDQXNzZXQnKTtcbmNvbnN0IFRleHR1cmUgPSByZXF1aXJlKCcuLi9DQ1RleHR1cmUyRCcpO1xuY29uc3QgUGl4ZWxGb3JtYXQgPSBUZXh0dXJlLlBpeGVsRm9ybWF0O1xuY29uc3QgRWZmZWN0QXNzZXQgPSByZXF1aXJlKCcuL0NDRWZmZWN0QXNzZXQnKTtcbmNvbnN0IHRleHR1cmVVdGlsID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvdGV4dHVyZS11dGlsJyk7XG5jb25zdCBnZnggPSBjYy5nZng7XG5cbi8qKlxuICogISNlbiBNYXRlcmlhbCBidWlsdGluIG5hbWVcbiAqICEjemgg5YaF572u5p2Q6LSo5ZCN5a2XXG4gKiBAZW51bSBNYXRlcmlhbC5CVUlMVElOX05BTUVcbiAqL1xuY29uc3QgQlVJTFRJTl9OQU1FID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IFNQUklURVxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgU1BSSVRFOiAnMmQtc3ByaXRlJyxcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgR1JBWV9TUFJJVEVcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIEdSQVlfU1BSSVRFOiAnMmQtZ3JheS1zcHJpdGUnLFxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBVTkxJVFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgVU5MSVQ6ICd1bmxpdCcsXG59KTtcblxuXG4vKipcbiAqICEjZW4gTWF0ZXJpYWwgQXNzZXQuXG4gKiAhI3poIOadkOi0qOi1hOa6kOexu+OAglxuICogQGNsYXNzIE1hdGVyaWFsXG4gKiBAZXh0ZW5kcyBBc3NldFxuICovXG5sZXQgTWF0ZXJpYWwgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLk1hdGVyaWFsJyxcbiAgICBleHRlbmRzOiBBc3NldCxcblxuICAgIGN0b3IgKCkge1xuICAgICAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9tYW51YWxIYXNoID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2RpcnR5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fZWZmZWN0ID0gbnVsbDtcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBkZXByZWNhdGVkXG4gICAgICAgIF9kZWZpbmVzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICB0eXBlOiBPYmplY3RcbiAgICAgICAgfSxcbiAgICAgICAgLy8gZGVwcmVjYXRlZFxuICAgICAgICBfcHJvcHM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHR5cGU6IE9iamVjdFxuICAgICAgICB9LFxuXG4gICAgICAgIF9lZmZlY3RBc3NldDoge1xuICAgICAgICAgICAgdHlwZTogRWZmZWN0QXNzZXQsXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICB9LFxuXG4gICAgICAgIF90ZWNobmlxdWVJbmRleDogMCxcbiAgICAgICAgX3RlY2huaXF1ZURhdGE6IE9iamVjdCxcblxuICAgICAgICBlZmZlY3ROYW1lOiBDQ19FRElUT1IgPyB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9lZmZlY3RBc3NldCAmJiB0aGlzLl9lZmZlY3RBc3NldC5uYW1lO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsKSB7XG4gICAgICAgICAgICAgICAgbGV0IGVmZmVjdEFzc2V0ID0gY2MuYXNzZXRNYW5hZ2VyLmJ1aWx0aW5zLmdldEJ1aWx0aW4oJ2VmZmVjdCcsIHZhbCk7XG4gICAgICAgICAgICAgICAgaWYgKCFlZmZlY3RBc3NldCkge1xuICAgICAgICAgICAgICAgICAgICBFZGl0b3Iud2Fybihgbm8gZWZmZWN0IG5hbWVkICcke3ZhbH0nIGZvdW5kYCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5lZmZlY3RBc3NldCA9IGVmZmVjdEFzc2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IDogdW5kZWZpbmVkLFxuXG4gICAgICAgIGVmZmVjdEFzc2V0OiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9lZmZlY3RBc3NldDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKGFzc2V0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGNjLmdhbWUucmVuZGVyVHlwZSA9PT0gY2MuZ2FtZS5SRU5ERVJfVFlQRV9DQU5WQVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuX2VmZmVjdEFzc2V0ID0gYXNzZXQ7XG4gICAgICAgICAgICAgICAgaWYgKCFhc3NldCkge1xuICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcignQ2FuIG5vdCBzZXQgYW4gZW1wdHkgZWZmZWN0IGFzc2V0LicpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5fZWZmZWN0ID0gdGhpcy5fZWZmZWN0QXNzZXQuZ2V0SW5zdGFudGlhdGVkRWZmZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZWZmZWN0OiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9lZmZlY3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdGVjaG5pcXVlSW5kZXg6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RlY2huaXF1ZUluZGV4O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3RlY2huaXF1ZUluZGV4ID0gdjtcbiAgICAgICAgICAgICAgICB0aGlzLl9lZmZlY3Quc3dpdGNoVGVjaG5pcXVlKHYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gR2V0IGJ1aWx0LWluIG1hdGVyaWFsc1xuICAgICAgICAgKiAhI3poIOiOt+WPluWGhee9ruadkOi0qFxuICAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICAqIEBtZXRob2QgZ2V0QnVpbHRpbk1hdGVyaWFsXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFxuICAgICAgICAgKiBAcmV0dXJuIHtNYXRlcmlhbH1cbiAgICAgICAgICovXG4gICAgICAgIGdldEJ1aWx0aW5NYXRlcmlhbCAobmFtZSkge1xuICAgICAgICAgICAgaWYgKGNjLmdhbWUucmVuZGVyVHlwZSA9PT0gY2MuZ2FtZS5SRU5ERVJfVFlQRV9DQU5WQVMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGNjLk1hdGVyaWFsKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2MuYXNzZXRNYW5hZ2VyLmJ1aWx0aW5zLmdldEJ1aWx0aW4oJ21hdGVyaWFsJywgJ2J1aWx0aW4tJyArIG5hbWUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIEJVSUxUSU5fTkFNRSxcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIENyZWF0ZXMgYSBNYXRlcmlhbCB3aXRoIGJ1aWx0aW4gRWZmZWN0LlxuICAgICAgICAgKiAhI3poIOS9v+eUqOWGheW7uiBFZmZlY3Qg5Yib5bu65LiA5Liq5p2Q6LSo44CCXG4gICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICogQG1ldGhvZCBjcmVhdGVXaXRoQnVpbHRpblxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gZWZmZWN0TmFtZSBcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFt0ZWNobmlxdWVJbmRleF0gXG4gICAgICAgICAqIEByZXR1cm4ge01hdGVyaWFsfVxuICAgICAgICAgKi9cbiAgICAgICAgY3JlYXRlV2l0aEJ1aWx0aW4gKGVmZmVjdE5hbWUsIHRlY2huaXF1ZUluZGV4ID0gMCkge1xuICAgICAgICAgICAgbGV0IGVmZmVjdEFzc2V0ID0gY2MuYXNzZXRNYW5hZ2VyLmJ1aWx0aW5zLmdldEJ1aWx0aW4oJ2VmZmVjdCcsICdidWlsdGluLScgKyBlZmZlY3ROYW1lKTtcbiAgICAgICAgICAgIHJldHVybiBNYXRlcmlhbC5jcmVhdGUoZWZmZWN0QXNzZXQsIHRlY2huaXF1ZUluZGV4KTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gQ3JlYXRlcyBhIE1hdGVyaWFsLlxuICAgICAgICAgKiAhI3poIOWIm+W7uuS4gOS4quadkOi0qOOAglxuICAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICAqIEBtZXRob2QgY3JlYXRlXG4gICAgICAgICAqIEBwYXJhbSB7RWZmZWN0QXNzZXR9IGVmZmVjdEFzc2V0IFxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gW3RlY2huaXF1ZUluZGV4XSBcbiAgICAgICAgICogQHJldHVybiB7TWF0ZXJpYWx9XG4gICAgICAgICAqL1xuICAgICAgICBjcmVhdGUgKGVmZmVjdEFzc2V0LCB0ZWNobmlxdWVJbmRleCA9IDApIHtcbiAgICAgICAgICAgIGlmICghZWZmZWN0QXNzZXQpIHJldHVybiBudWxsO1xuICAgICAgICAgICAgbGV0IG1hdGVyaWFsID0gbmV3IE1hdGVyaWFsKCk7XG4gICAgICAgICAgICBtYXRlcmlhbC5lZmZlY3RBc3NldCA9IGVmZmVjdEFzc2V0O1xuICAgICAgICAgICAgbWF0ZXJpYWwudGVjaG5pcXVlSW5kZXggPSB0ZWNobmlxdWVJbmRleDtcbiAgICAgICAgICAgIHJldHVybiBtYXRlcmlhbDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgdGhlIE1hdGVyaWFsIHByb3BlcnR5XG4gICAgICogISN6aCDorr7nva7mnZDotKjnmoTlsZ7mgKdcbiAgICAgKiBAbWV0aG9kIHNldFByb3BlcnR5XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdmFsXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtwYXNzSWR4XVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2RpcmVjdGx5XVxuICAgICAqL1xuICAgIHNldFByb3BlcnR5IChuYW1lLCB2YWwsIHBhc3NJZHgsIGRpcmVjdGx5KSB7XG4gICAgICAgIGlmIChjYy5nYW1lLnJlbmRlclR5cGUgPT09IGNjLmdhbWUuUkVOREVSX1RZUEVfQ0FOVkFTKSByZXR1cm47XG5cbiAgICAgICAgaWYgKHR5cGVvZiBwYXNzSWR4ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcGFzc0lkeCA9IHBhcnNlSW50KHBhc3NJZHgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbCBpbnN0YW5jZW9mIFRleHR1cmUpIHtcbiAgICAgICAgICAgIGxldCBpc0FscGhhQXRsYXMgPSB2YWwuaXNBbHBoYUF0bGFzKCk7XG4gICAgICAgICAgICBsZXQga2V5ID0gJ0NDX1VTRV9BTFBIQV9BVExBU18nICsgbmFtZTtcbiAgICAgICAgICAgIGxldCBkZWYgPSB0aGlzLmdldERlZmluZShrZXksIHBhc3NJZHgpO1xuICAgICAgICAgICAgaWYgKGlzQWxwaGFBdGxhcyB8fCBkZWYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmluZShrZXksIGlzQWxwaGFBdGxhcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXZhbC5sb2FkZWQpIHtcbiAgICAgICAgICAgICAgICBjYy5hc3NldE1hbmFnZXIucG9zdExvYWROYXRpdmUodmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2VmZmVjdC5zZXRQcm9wZXJ0eShuYW1lLCB2YWwsIHBhc3NJZHgsIGRpcmVjdGx5KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBHZXRzIHRoZSBNYXRlcmlhbCBwcm9wZXJ0eS5cbiAgICAgKiAhI3poIOiOt+WPluadkOi0qOeahOWxnuaAp+OAglxuICAgICAqIEBtZXRob2QgZ2V0UHJvcGVydHlcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGFzc0lkeCBcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0UHJvcGVydHkgKG5hbWUsIHBhc3NJZHgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwYXNzSWR4ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcGFzc0lkeCA9IHBhcnNlSW50KHBhc3NJZHgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9lZmZlY3QuZ2V0UHJvcGVydHkobmFtZSwgcGFzc0lkeCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0cyB0aGUgTWF0ZXJpYWwgZGVmaW5lLlxuICAgICAqICEjemgg6K6+572u5p2Q6LSo55qE5a6P5a6a5LmJ44CCXG4gICAgICogQG1ldGhvZCBkZWZpbmVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbnxudW1iZXJ9IHZhbFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbcGFzc0lkeF1cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtmb3JjZV1cbiAgICAgKi9cbiAgICBkZWZpbmUgKG5hbWUsIHZhbCwgcGFzc0lkeCwgZm9yY2UpIHtcbiAgICAgICAgaWYgKGNjLmdhbWUucmVuZGVyVHlwZSA9PT0gY2MuZ2FtZS5SRU5ERVJfVFlQRV9DQU5WQVMpIHJldHVybjtcblxuICAgICAgICBpZiAodHlwZW9mIHBhc3NJZHggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBwYXNzSWR4ID0gcGFyc2VJbnQocGFzc0lkeCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZWZmZWN0LmRlZmluZShuYW1lLCB2YWwsIHBhc3NJZHgsIGZvcmNlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBHZXRzIHRoZSBNYXRlcmlhbCBkZWZpbmUuXG4gICAgICogISN6aCDojrflj5bmnZDotKjnmoTlro/lrprkuYnjgIJcbiAgICAgKiBAbWV0aG9kIGdldERlZmluZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbcGFzc0lkeF0gXG4gICAgICogQHJldHVybiB7Ym9vbGVhbnxudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0RGVmaW5lIChuYW1lLCBwYXNzSWR4KSB7XG4gICAgICAgIGlmICh0eXBlb2YgcGFzc0lkeCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHBhc3NJZHggPSBwYXJzZUludChwYXNzSWR4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fZWZmZWN0LmdldERlZmluZShuYW1lLCBwYXNzSWR4KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXRzIHRoZSBNYXRlcmlhbCBjdWxsIG1vZGUuXG4gICAgICogISN6aCDorr7nva7mnZDotKjnmoToo4Hlh4/mqKHlvI/jgIJcbiAgICAgKiBAbWV0aG9kIHNldEN1bGxNb2RlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGN1bGxNb2RlIFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwYXNzSWR4IFxuICAgICAqL1xuICAgIHNldEN1bGxNb2RlIChjdWxsTW9kZSA9IGdmeC5DVUxMX0JBQ0ssIHBhc3NJZHgpIHtcbiAgICAgICAgdGhpcy5fZWZmZWN0LnNldEN1bGxNb2RlKGN1bGxNb2RlLCBwYXNzSWR4KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXRzIHRoZSBNYXRlcmlhbCBkZXB0aCBzdGF0ZXMuXG4gICAgICogISN6aCDorr7nva7mnZDotKjnmoTmt7HluqbmuLLmn5PnirbmgIHjgIJcbiAgICAgKiBAbWV0aG9kIHNldERlcHRoXG4gICAgICogQHBhcmFtIHtib29sZWFufSBkZXB0aFRlc3QgXG4gICAgICogQHBhcmFtIHtib29sZWFufSBkZXB0aFdyaXRlIFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZXB0aEZ1bmMgXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBhc3NJZHggXG4gICAgICovXG4gICAgc2V0RGVwdGggKFxuICAgICAgICBkZXB0aFRlc3QgPSBmYWxzZSxcbiAgICAgICAgZGVwdGhXcml0ZSA9IGZhbHNlLFxuICAgICAgICBkZXB0aEZ1bmMgPSBnZnguRFNfRlVOQ19MRVNTLFxuICAgICAgICBwYXNzSWR4XG4gICAgKSB7XG4gICAgICAgIHRoaXMuX2VmZmVjdC5zZXREZXB0aChkZXB0aFRlc3QsIGRlcHRoV3JpdGUsIGRlcHRoRnVuYywgcGFzc0lkeCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0cyB0aGUgTWF0ZXJpYWwgYmxlbmQgc3RhdGVzLlxuICAgICAqICEjemgg6K6+572u5p2Q6LSo55qE5re35ZCI5riy5p+T54q25oCB44CCXG4gICAgICogQG1ldGhvZCBzZXRCbGVuZFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlZCBcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmxlbmRFcSBcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmxlbmRTcmMgXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJsZW5kRHN0IFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBibGVuZEFscGhhRXEgXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJsZW5kU3JjQWxwaGEgXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJsZW5kRHN0QWxwaGEgXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJsZW5kQ29sb3IgXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBhc3NJZHggXG4gICAgICovXG4gICAgc2V0QmxlbmQgKFxuICAgICAgICBlbmFibGVkID0gZmFsc2UsXG4gICAgICAgIGJsZW5kRXEgPSBnZnguQkxFTkRfRlVOQ19BREQsXG4gICAgICAgIGJsZW5kU3JjID0gZ2Z4LkJMRU5EX1NSQ19BTFBIQSxcbiAgICAgICAgYmxlbmREc3QgPSBnZnguQkxFTkRfT05FX01JTlVTX1NSQ19BTFBIQSxcbiAgICAgICAgYmxlbmRBbHBoYUVxID0gZ2Z4LkJMRU5EX0ZVTkNfQURELFxuICAgICAgICBibGVuZFNyY0FscGhhID0gZ2Z4LkJMRU5EX1NSQ19BTFBIQSxcbiAgICAgICAgYmxlbmREc3RBbHBoYSA9IGdmeC5CTEVORF9PTkVfTUlOVVNfU1JDX0FMUEhBLFxuICAgICAgICBibGVuZENvbG9yID0gMHhmZmZmZmZmZixcbiAgICAgICAgcGFzc0lkeFxuICAgICkge1xuICAgICAgICB0aGlzLl9lZmZlY3Quc2V0QmxlbmQoZW5hYmxlZCwgYmxlbmRFcSwgYmxlbmRTcmMsIGJsZW5kRHN0LCBibGVuZEFscGhhRXEsIGJsZW5kU3JjQWxwaGEsIGJsZW5kRHN0QWxwaGEsIGJsZW5kQ29sb3IsIHBhc3NJZHgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgd2hldGhlciBlbmFibGUgdGhlIHN0ZW5jaWwgdGVzdC5cbiAgICAgKiAhI3poIOiuvue9ruaYr+WQpuW8gOWQr+aooeadv+a1i+ivleOAglxuICAgICAqIEBtZXRob2Qgc2V0U3RlbmNpbEVuYWJsZWRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RlbmNpbFRlc3QgXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBhc3NJZHggXG4gICAgICovXG4gICAgc2V0U3RlbmNpbEVuYWJsZWQgKHN0ZW5jaWxUZXN0ID0gZ2Z4LlNURU5DSUxfSU5IRVJJVCwgcGFzc0lkeCkge1xuICAgICAgICB0aGlzLl9lZmZlY3Quc2V0U3RlbmNpbEVuYWJsZWQoc3RlbmNpbFRlc3QsIHBhc3NJZHgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgdGhlIE1hdGVyaWFsIHN0ZW5jaWwgcmVuZGVyIHN0YXRlcy5cbiAgICAgKiAhI3poIOiuvue9ruadkOi0qOeahOaooeadv+a1i+ivlea4suafk+WPguaVsOOAglxuICAgICAqIEBtZXRob2Qgc2V0U3RlbmNpbFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGVuY2lsVGVzdCBcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RlbmNpbEZ1bmMgXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0ZW5jaWxSZWYgXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0ZW5jaWxNYXNrIFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGVuY2lsRmFpbE9wIFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGVuY2lsWkZhaWxPcCBcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RlbmNpbFpQYXNzT3AgXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0ZW5jaWxXcml0ZU1hc2sgXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBhc3NJZHggXG4gICAgICovXG4gICAgc2V0U3RlbmNpbCAoXG4gICAgICAgIHN0ZW5jaWxUZXN0ID0gZ2Z4LlNURU5DSUxfSU5IRVJJVCxcbiAgICAgICAgc3RlbmNpbEZ1bmMgPSBnZnguRFNfRlVOQ19BTFdBWVMsXG4gICAgICAgIHN0ZW5jaWxSZWYgPSAwLFxuICAgICAgICBzdGVuY2lsTWFzayA9IDB4ZmYsXG4gICAgICAgIHN0ZW5jaWxGYWlsT3AgPSBnZnguU1RFTkNJTF9PUF9LRUVQLFxuICAgICAgICBzdGVuY2lsWkZhaWxPcCA9IGdmeC5TVEVOQ0lMX09QX0tFRVAsXG4gICAgICAgIHN0ZW5jaWxaUGFzc09wID0gZ2Z4LlNURU5DSUxfT1BfS0VFUCxcbiAgICAgICAgc3RlbmNpbFdyaXRlTWFzayA9IDB4ZmYsXG4gICAgICAgIHBhc3NJZHhcbiAgICApIHtcbiAgICAgICAgdGhpcy5fZWZmZWN0LnNldFN0ZW5jaWwoc3RlbmNpbFRlc3QsIHN0ZW5jaWxGdW5jLCBzdGVuY2lsUmVmLCBzdGVuY2lsTWFzaywgc3RlbmNpbEZhaWxPcCwgc3RlbmNpbFpGYWlsT3AsIHN0ZW5jaWxaUGFzc09wLCBzdGVuY2lsV3JpdGVNYXNrLCBwYXNzSWR4KTtcbiAgICB9LFxuXG4gICAgdXBkYXRlSGFzaCAoaGFzaCkge1xuICAgICAgICB0aGlzLl9tYW51YWxIYXNoID0gaGFzaDtcbiAgICAgICAgdGhpcy5fZWZmZWN0ICYmIHRoaXMuX2VmZmVjdC51cGRhdGVIYXNoKGhhc2gpO1xuICAgIH0sXG5cbiAgICBnZXRIYXNoICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hbnVhbEhhc2ggfHwgKHRoaXMuX2VmZmVjdCAmJiB0aGlzLl9lZmZlY3QuZ2V0SGFzaCgpKTtcbiAgICB9LFxuXG4gICAgb25Mb2FkICgpIHtcbiAgICAgICAgdGhpcy5lZmZlY3RBc3NldCA9IHRoaXMuX2VmZmVjdEFzc2V0O1xuICAgICAgICBpZiAoIXRoaXMuX2VmZmVjdCkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLl90ZWNobmlxdWVJbmRleCkge1xuICAgICAgICAgICAgdGhpcy5fZWZmZWN0LnN3aXRjaFRlY2huaXF1ZSh0aGlzLl90ZWNobmlxdWVJbmRleCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl90ZWNobmlxdWVEYXRhID0gdGhpcy5fdGVjaG5pcXVlRGF0YSB8fCB7fTtcblxuICAgICAgICBsZXQgcGFzc0RhdGFzID0gdGhpcy5fdGVjaG5pcXVlRGF0YTtcbiAgICAgICAgZm9yIChsZXQgaW5kZXggaW4gcGFzc0RhdGFzKSB7XG4gICAgICAgICAgICBpbmRleCA9IHBhcnNlSW50KGluZGV4KTtcbiAgICAgICAgICAgIGxldCBwYXNzRGF0YSA9IHBhc3NEYXRhc1tpbmRleF07XG4gICAgICAgICAgICBpZiAoIXBhc3NEYXRhKSBjb250aW51ZTtcblxuICAgICAgICAgICAgZm9yIChsZXQgZGVmIGluIHBhc3NEYXRhLmRlZmluZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmluZShkZWYsIHBhc3NEYXRhLmRlZmluZXNbZGVmXSwgaW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgcHJvcCBpbiBwYXNzRGF0YS5wcm9wcykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0UHJvcGVydHkocHJvcCwgcGFzc0RhdGEucHJvcHNbcHJvcF0sIGluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBNYXRlcmlhbDtcbmNjLk1hdGVyaWFsID0gTWF0ZXJpYWw7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==