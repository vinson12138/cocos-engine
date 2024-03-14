
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/mesh/CCMeshRenderer.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _gfx = _interopRequireDefault(require("../../renderer/gfx"));

var _inputAssembler = _interopRequireDefault(require("../../renderer/core/input-assembler"));

var _aabb = _interopRequireDefault(require("../geom-utils/aabb"));

var _vec = _interopRequireDefault(require("../value-types/vec3"));

var _mat = _interopRequireDefault(require("../value-types/mat4"));

var _materialVariant = _interopRequireDefault(require("../assets/material/material-variant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
var RenderComponent = require('../components/CCRenderComponent');

var Mesh = require('./CCMesh');

var RenderFlow = require('../renderer/render-flow');

var Renderer = require('../renderer');

var Material = require('../assets/material/CCMaterial');
/**
 * !#en Shadow projection mode
 *
 * !#ch 阴影投射方式
 * @static
 * @enum MeshRenderer.ShadowCastingMode
 */


var ShadowCastingMode = cc.Enum({
  /**
   * !#en
   *
   * !#ch 关闭阴影投射
   * @property OFF
   * @readonly
   * @type {Number}
   */
  OFF: 0,

  /**
   * !#en
   *
   * !#ch 开启阴影投射，当阴影光产生的时候
   * @property ON
   * @readonly
   * @type {Number}
   */
  ON: 1 // /**
  //  * !#en
  //  *
  //  * !#ch 可以从网格的任意一遍投射出阴影
  //  * @property TWO_SIDED
  //  * @readonly
  //  * @type {Number}
  //  */
  // TWO_SIDED: 2,
  // /**
  //  * !#en
  //  *
  //  * !#ch 只显示阴影
  //  * @property SHADOWS_ONLY
  //  * @readonly
  //  * @type {Number}
  //  */
  // SHADOWS_ONLY: 3,

});
/**
 * !#en
 * Mesh Renderer Component
 * !#zh
 * 网格渲染组件
 * @class MeshRenderer
 * @extends RenderComponent
 */

var MeshRenderer = cc.Class({
  name: 'cc.MeshRenderer',
  "extends": RenderComponent,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.mesh/MeshRenderer'
  },
  properties: {
    _mesh: {
      "default": null,
      type: Mesh
    },
    _receiveShadows: false,
    _shadowCastingMode: ShadowCastingMode.OFF,
    _enableAutoBatch: false,

    /**
     * !#en
     * The mesh which the renderer uses.
     * !#zh
     * 设置使用的网格
     * @property {Mesh} mesh
     */
    mesh: {
      get: function get() {
        return this._mesh;
      },
      set: function set(v) {
        if (this._mesh === v) return;

        this._setMesh(v);

        if (!v) {
          this.disableRender();
          return;
        }

        this.markForRender(true);
        this.node._renderFlag |= RenderFlow.FLAG_TRANSFORM;
      },
      type: Mesh,
      animatable: false
    },
    textures: {
      "default": [],
      type: cc.Texture2D,
      visible: false
    },

    /**
     * !#en
     * Whether the mesh should receive shadows.
     * !#zh
     * 网格是否接受光源投射的阴影
     * @property {Boolean} receiveShadows
     */
    receiveShadows: {
      get: function get() {
        return this._receiveShadows;
      },
      set: function set(val) {
        this._receiveShadows = val;

        this._updateReceiveShadow();
      },
      animatable: false
    },

    /**
     * !#en
     * Shadow Casting Mode
     * !#zh
     * 网格投射阴影的模式
     * @property {ShadowCastingMode} shadowCastingMode
     */
    shadowCastingMode: {
      get: function get() {
        return this._shadowCastingMode;
      },
      set: function set(val) {
        this._shadowCastingMode = val;

        this._updateCastShadow();
      },
      type: ShadowCastingMode,
      animatable: false
    },

    /**
     * !#en
     * Enable auto merge mesh, only support when mesh's VertexFormat, PrimitiveType, materials are all the same
     * !#zh 
     * 开启自动合并 mesh 功能，只有在网格的 顶点格式，PrimitiveType, 使用的材质 都一致的情况下才会有效
     * @property {Boolean} enableAutoBatch
     */
    enableAutoBatch: {
      get: function get() {
        return this._enableAutoBatch;
      },
      set: function set(val) {
        this._enableAutoBatch = val;
      }
    }
  },
  statics: {
    ShadowCastingMode: ShadowCastingMode
  },
  ctor: function ctor() {
    this._boundingBox = cc.geomUtils && new _aabb["default"]();

    if (CC_DEBUG) {
      this._debugDatas = {
        wireFrame: [],
        normal: []
      };
    }
  },
  onEnable: function onEnable() {
    var _this = this;

    this._super();

    if (this._mesh && !this._mesh.loaded) {
      this.disableRender();

      this._mesh.once('load', function () {
        if (!_this.isValid) return;

        _this._setMesh(_this._mesh);

        _this.markForRender(true);
      });

      cc.assetManager.postLoadNative(this._mesh);
    } else {
      this._setMesh(this._mesh);
    }

    this._updateRenderNode();

    this._updateMaterial();
  },
  onDestroy: function onDestroy() {
    this._setMesh(null);

    cc.pool.assembler.put(this._assembler);
  },
  _updateRenderNode: function _updateRenderNode() {
    this._assembler.setRenderNode(this.node);
  },
  _setMesh: function _setMesh(mesh) {
    if (cc.geomUtils && mesh) {
      _aabb["default"].fromPoints(this._boundingBox, mesh._minPos, mesh._maxPos);
    }

    if (this._mesh) {
      this._mesh.off('init-format', this._updateMeshAttribute, this);
    }

    if (mesh) {
      mesh.on('init-format', this._updateMeshAttribute, this);
    }

    this._mesh = mesh;
    this._assembler && (this._assembler._worldDatas = {});

    this._updateMeshAttribute();
  },
  _getDefaultMaterial: function _getDefaultMaterial() {
    return Material.getBuiltinMaterial('unlit');
  },
  _validateRender: function _validateRender() {
    var mesh = this._mesh;

    if (mesh && mesh._subDatas.length > 0) {
      return;
    }

    this.disableRender();
  },
  _updateMaterial: function _updateMaterial() {
    // TODO: used to upgrade from 2.1, should be removed
    var textures = this.textures;

    if (textures && textures.length > 0) {
      var defaultMaterial = this._getDefaultMaterial();

      for (var i = 0; i < textures.length; i++) {
        var material = this._materials[i];
        if (material && material._uuid !== defaultMaterial._uuid) continue;

        if (!material) {
          material = _materialVariant["default"].create(defaultMaterial, this);
          this.setMaterial(i, material);
        }

        material.setProperty('diffuseTexture', textures[i]);
      }
    }

    this._updateReceiveShadow();

    this._updateCastShadow();

    this._updateMeshAttribute();
  },
  _updateReceiveShadow: function _updateReceiveShadow() {
    var materials = this.getMaterials();

    for (var i = 0; i < materials.length; i++) {
      materials[i].define('CC_USE_SHADOW_MAP', this._receiveShadows, undefined, true);
    }
  },
  _updateCastShadow: function _updateCastShadow() {
    var materials = this.getMaterials();

    for (var i = 0; i < materials.length; i++) {
      materials[i].define('CC_CASTING_SHADOW', this._shadowCastingMode === ShadowCastingMode.ON, undefined, true);
    }
  },
  _updateMeshAttribute: function _updateMeshAttribute() {
    var subDatas = this._mesh && this._mesh.subDatas;
    if (!subDatas) return;
    var materials = this.getMaterials();

    for (var i = 0; i < materials.length; i++) {
      if (!subDatas[i]) break;
      var vfm = subDatas[i].vfm;
      var material = materials[i];
      material.define('CC_USE_ATTRIBUTE_COLOR', !!vfm.element(_gfx["default"].ATTR_COLOR), undefined, true);
      material.define('CC_USE_ATTRIBUTE_UV0', !!vfm.element(_gfx["default"].ATTR_UV0), undefined, true);
      material.define('CC_USE_ATTRIBUTE_NORMAL', !!vfm.element(_gfx["default"].ATTR_NORMAL), undefined, true);
      material.define('CC_USE_ATTRIBUTE_TANGENT', !!vfm.element(_gfx["default"].ATTR_TANGENT), undefined, true);
    }

    if (CC_DEBUG) {
      for (var name in this._debugDatas) {
        this._debugDatas[name].length = 0;
      }
    }

    if (CC_JSB && CC_NATIVERENDERER) {
      this._assembler.updateMeshData(this);
    }
  },
  _checkBacth: function _checkBacth() {}
});

if (CC_DEBUG) {
  var BLACK_COLOR = cc.Color.BLACK;
  var RED_COLOR = cc.Color.RED;
  var v3_tmp = [cc.v3(), cc.v3()];
  var mat4_tmp = cc.mat4();
  var createDebugDataFns = {
    normal: function normal(comp, ia, subData, subIndex) {
      var oldVfm = subData.vfm;
      var normalEle = oldVfm.element(_gfx["default"].ATTR_NORMAL);
      var posEle = oldVfm.element(_gfx["default"].ATTR_POSITION);
      var jointEle = oldVfm.element(_gfx["default"].ATTR_JOINTS);
      var weightEle = oldVfm.element(_gfx["default"].ATTR_WEIGHTS);

      if (!normalEle || !posEle) {
        return;
      }

      var indices = [];
      var vbData = [];
      var lineLength = 100;

      _vec["default"].set(v3_tmp[0], 5, 0, 0);

      _mat["default"].invert(mat4_tmp, comp.node._worldMatrix);

      _vec["default"].transformMat4Normal(v3_tmp[0], v3_tmp[0], mat4_tmp);

      lineLength = v3_tmp[0].mag();
      var mesh = comp.mesh;

      var posData = mesh._getAttrMeshData(subIndex, _gfx["default"].ATTR_POSITION);

      var normalData = mesh._getAttrMeshData(subIndex, _gfx["default"].ATTR_NORMAL);

      var jointData = mesh._getAttrMeshData(subIndex, _gfx["default"].ATTR_JOINTS);

      var weightData = mesh._getAttrMeshData(subIndex, _gfx["default"].ATTR_WEIGHTS);

      var vertexCount = posData.length / posEle.num;

      for (var i = 0; i < vertexCount; i++) {
        var normalIndex = i * normalEle.num;
        var posIndex = i * posEle.num;

        _vec["default"].set(v3_tmp[0], normalData[normalIndex], normalData[normalIndex + 1], normalData[normalIndex + 2]);

        _vec["default"].set(v3_tmp[1], posData[posIndex], posData[posIndex + 1], posData[posIndex + 2]);

        _vec["default"].scaleAndAdd(v3_tmp[0], v3_tmp[1], v3_tmp[0], lineLength);

        for (var lineIndex = 0; lineIndex < 2; lineIndex++) {
          vbData.push(v3_tmp[lineIndex].x, v3_tmp[lineIndex].y, v3_tmp[lineIndex].z);

          if (jointEle) {
            var jointIndex = i * jointEle.num;

            for (var j = 0; j < jointEle.num; j++) {
              vbData.push(jointData[jointIndex + j]);
            }
          }

          if (weightEle) {
            var weightIndex = i * weightEle.num;

            for (var _j = 0; _j < weightEle.num; _j++) {
              vbData.push(weightData[weightIndex + _j]);
            }
          }
        }

        indices.push(i * 2, i * 2 + 1);
      }

      var formatOpts = [{
        name: _gfx["default"].ATTR_POSITION,
        type: _gfx["default"].ATTR_TYPE_FLOAT32,
        num: 3
      }];

      if (jointEle) {
        formatOpts.push({
          name: _gfx["default"].ATTR_JOINTS,
          type: _gfx["default"].ATTR_TYPE_FLOAT32,
          num: jointEle.num
        });
      }

      if (weightEle) {
        formatOpts.push({
          name: _gfx["default"].ATTR_WEIGHTS,
          type: _gfx["default"].ATTR_TYPE_FLOAT32,
          num: weightEle.num
        });
      }

      var gfxVFmt = new _gfx["default"].VertexFormat(formatOpts);
      var vb = new _gfx["default"].VertexBuffer(Renderer.device, gfxVFmt, _gfx["default"].USAGE_STATIC, new Float32Array(vbData));
      var ibData = new Uint16Array(indices);
      var ib = new _gfx["default"].IndexBuffer(Renderer.device, _gfx["default"].INDEX_FMT_UINT16, _gfx["default"].USAGE_STATIC, ibData, ibData.length);

      var m = _materialVariant["default"].createWithBuiltin('unlit');

      m.setProperty('diffuseColor', RED_COLOR);
      return {
        material: m,
        ia: new _inputAssembler["default"](vb, ib, _gfx["default"].PT_LINES)
      };
    },
    wireFrame: function wireFrame(comp, ia, subData) {
      var oldIbData = subData.getIData(Uint16Array);

      var m = _materialVariant["default"].createWithBuiltin('unlit');

      m.setProperty('diffuseColor', BLACK_COLOR);
      var indices = [];

      for (var i = 0; i < oldIbData.length; i += 3) {
        var a = oldIbData[i + 0];
        var b = oldIbData[i + 1];
        var c = oldIbData[i + 2];
        indices.push(a, b, b, c, c, a);
      }

      var ibData = new Uint16Array(indices);
      var ib = new _gfx["default"].IndexBuffer(Renderer.device, _gfx["default"].INDEX_FMT_UINT16, _gfx["default"].USAGE_STATIC, ibData, ibData.length);
      return {
        material: m,
        ia: new _inputAssembler["default"](ia._vertexBuffer, ib, _gfx["default"].PT_LINES)
      };
    }
  };
  var _proto = MeshRenderer.prototype;

  _proto._updateDebugDatas = function () {
    var debugDatas = this._debugDatas;
    var subMeshes = this._mesh.subMeshes;
    var subDatas = this._mesh._subDatas;

    for (var name in debugDatas) {
      var debugData = debugDatas[name];
      if (debugData.length === subMeshes.length) continue;
      if (!cc.macro['SHOW_MESH_' + name.toUpperCase()]) continue;
      debugData.length = subMeshes.length;

      for (var i = 0; i < subMeshes.length; i++) {
        debugData[i] = createDebugDataFns[name](this, subMeshes[i], subDatas[i], i);
      }
    }
  };
}

cc.MeshRenderer = module.exports = MeshRenderer;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL21lc2gvQ0NNZXNoUmVuZGVyZXIuanMiXSwibmFtZXMiOlsiUmVuZGVyQ29tcG9uZW50IiwicmVxdWlyZSIsIk1lc2giLCJSZW5kZXJGbG93IiwiUmVuZGVyZXIiLCJNYXRlcmlhbCIsIlNoYWRvd0Nhc3RpbmdNb2RlIiwiY2MiLCJFbnVtIiwiT0ZGIiwiT04iLCJNZXNoUmVuZGVyZXIiLCJDbGFzcyIsIm5hbWUiLCJlZGl0b3IiLCJDQ19FRElUT1IiLCJtZW51IiwicHJvcGVydGllcyIsIl9tZXNoIiwidHlwZSIsIl9yZWNlaXZlU2hhZG93cyIsIl9zaGFkb3dDYXN0aW5nTW9kZSIsIl9lbmFibGVBdXRvQmF0Y2giLCJtZXNoIiwiZ2V0Iiwic2V0IiwidiIsIl9zZXRNZXNoIiwiZGlzYWJsZVJlbmRlciIsIm1hcmtGb3JSZW5kZXIiLCJub2RlIiwiX3JlbmRlckZsYWciLCJGTEFHX1RSQU5TRk9STSIsImFuaW1hdGFibGUiLCJ0ZXh0dXJlcyIsIlRleHR1cmUyRCIsInZpc2libGUiLCJyZWNlaXZlU2hhZG93cyIsInZhbCIsIl91cGRhdGVSZWNlaXZlU2hhZG93Iiwic2hhZG93Q2FzdGluZ01vZGUiLCJfdXBkYXRlQ2FzdFNoYWRvdyIsImVuYWJsZUF1dG9CYXRjaCIsInN0YXRpY3MiLCJjdG9yIiwiX2JvdW5kaW5nQm94IiwiZ2VvbVV0aWxzIiwiQWFiYiIsIkNDX0RFQlVHIiwiX2RlYnVnRGF0YXMiLCJ3aXJlRnJhbWUiLCJub3JtYWwiLCJvbkVuYWJsZSIsIl9zdXBlciIsImxvYWRlZCIsIm9uY2UiLCJpc1ZhbGlkIiwiYXNzZXRNYW5hZ2VyIiwicG9zdExvYWROYXRpdmUiLCJfdXBkYXRlUmVuZGVyTm9kZSIsIl91cGRhdGVNYXRlcmlhbCIsIm9uRGVzdHJveSIsInBvb2wiLCJhc3NlbWJsZXIiLCJwdXQiLCJfYXNzZW1ibGVyIiwic2V0UmVuZGVyTm9kZSIsImZyb21Qb2ludHMiLCJfbWluUG9zIiwiX21heFBvcyIsIm9mZiIsIl91cGRhdGVNZXNoQXR0cmlidXRlIiwib24iLCJfd29ybGREYXRhcyIsIl9nZXREZWZhdWx0TWF0ZXJpYWwiLCJnZXRCdWlsdGluTWF0ZXJpYWwiLCJfdmFsaWRhdGVSZW5kZXIiLCJfc3ViRGF0YXMiLCJsZW5ndGgiLCJkZWZhdWx0TWF0ZXJpYWwiLCJpIiwibWF0ZXJpYWwiLCJfbWF0ZXJpYWxzIiwiX3V1aWQiLCJNYXRlcmlhbFZhcmlhbnQiLCJjcmVhdGUiLCJzZXRNYXRlcmlhbCIsInNldFByb3BlcnR5IiwibWF0ZXJpYWxzIiwiZ2V0TWF0ZXJpYWxzIiwiZGVmaW5lIiwidW5kZWZpbmVkIiwic3ViRGF0YXMiLCJ2Zm0iLCJlbGVtZW50IiwiZ2Z4IiwiQVRUUl9DT0xPUiIsIkFUVFJfVVYwIiwiQVRUUl9OT1JNQUwiLCJBVFRSX1RBTkdFTlQiLCJDQ19KU0IiLCJDQ19OQVRJVkVSRU5ERVJFUiIsInVwZGF0ZU1lc2hEYXRhIiwiX2NoZWNrQmFjdGgiLCJCTEFDS19DT0xPUiIsIkNvbG9yIiwiQkxBQ0siLCJSRURfQ09MT1IiLCJSRUQiLCJ2M190bXAiLCJ2MyIsIm1hdDRfdG1wIiwibWF0NCIsImNyZWF0ZURlYnVnRGF0YUZucyIsImNvbXAiLCJpYSIsInN1YkRhdGEiLCJzdWJJbmRleCIsIm9sZFZmbSIsIm5vcm1hbEVsZSIsInBvc0VsZSIsIkFUVFJfUE9TSVRJT04iLCJqb2ludEVsZSIsIkFUVFJfSk9JTlRTIiwid2VpZ2h0RWxlIiwiQVRUUl9XRUlHSFRTIiwiaW5kaWNlcyIsInZiRGF0YSIsImxpbmVMZW5ndGgiLCJWZWMzIiwiTWF0NCIsImludmVydCIsIl93b3JsZE1hdHJpeCIsInRyYW5zZm9ybU1hdDROb3JtYWwiLCJtYWciLCJwb3NEYXRhIiwiX2dldEF0dHJNZXNoRGF0YSIsIm5vcm1hbERhdGEiLCJqb2ludERhdGEiLCJ3ZWlnaHREYXRhIiwidmVydGV4Q291bnQiLCJudW0iLCJub3JtYWxJbmRleCIsInBvc0luZGV4Iiwic2NhbGVBbmRBZGQiLCJsaW5lSW5kZXgiLCJwdXNoIiwieCIsInkiLCJ6Iiwiam9pbnRJbmRleCIsImoiLCJ3ZWlnaHRJbmRleCIsImZvcm1hdE9wdHMiLCJBVFRSX1RZUEVfRkxPQVQzMiIsImdmeFZGbXQiLCJWZXJ0ZXhGb3JtYXQiLCJ2YiIsIlZlcnRleEJ1ZmZlciIsImRldmljZSIsIlVTQUdFX1NUQVRJQyIsIkZsb2F0MzJBcnJheSIsImliRGF0YSIsIlVpbnQxNkFycmF5IiwiaWIiLCJJbmRleEJ1ZmZlciIsIklOREVYX0ZNVF9VSU5UMTYiLCJtIiwiY3JlYXRlV2l0aEJ1aWx0aW4iLCJJbnB1dEFzc2VtYmxlciIsIlBUX0xJTkVTIiwib2xkSWJEYXRhIiwiZ2V0SURhdGEiLCJhIiwiYiIsImMiLCJfdmVydGV4QnVmZmVyIiwiX3Byb3RvIiwicHJvdG90eXBlIiwiX3VwZGF0ZURlYnVnRGF0YXMiLCJkZWJ1Z0RhdGFzIiwic3ViTWVzaGVzIiwiZGVidWdEYXRhIiwibWFjcm8iLCJ0b1VwcGVyQ2FzZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUF5QkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUE5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBU0EsSUFBTUEsZUFBZSxHQUFHQyxPQUFPLENBQUMsaUNBQUQsQ0FBL0I7O0FBQ0EsSUFBTUMsSUFBSSxHQUFHRCxPQUFPLENBQUMsVUFBRCxDQUFwQjs7QUFDQSxJQUFNRSxVQUFVLEdBQUdGLE9BQU8sQ0FBQyx5QkFBRCxDQUExQjs7QUFDQSxJQUFNRyxRQUFRLEdBQUdILE9BQU8sQ0FBQyxhQUFELENBQXhCOztBQUNBLElBQU1JLFFBQVEsR0FBR0osT0FBTyxDQUFDLCtCQUFELENBQXhCO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFDdkUsRUFBRSxDQUFDZ0wsS0FBSCxDQUFTLGVBQWUxSyxJQUFJLENBQUMySyxXQUFMLEVBQXhCLENBQUwsRUFBa0Q7QUFFbERGLE1BQUFBLFNBQVMsQ0FBQ3hHLE1BQVYsR0FBbUJ1RyxTQUFTLENBQUN2RyxNQUE3Qjs7QUFDQSxXQUFLLElBQUlFLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdxRyxTQUFTLENBQUN2RyxNQUE5QixFQUFzQ0UsQ0FBQyxFQUF2QyxFQUEyQztBQUN2Q3NHLFFBQUFBLFNBQVMsQ0FBQ3RHLENBQUQsQ0FBVCxHQUFlaUMsa0JBQWtCLENBQUNwRyxJQUFELENBQWxCLENBQXlCLElBQXpCLEVBQStCd0ssU0FBUyxDQUFDckcsQ0FBRCxDQUF4QyxFQUE2Q1ksUUFBUSxDQUFDWixDQUFELENBQXJELEVBQTBEQSxDQUExRCxDQUFmO0FBQ0g7QUFDSjtBQUNKLEdBZEQ7QUFlSDs7QUFFRHpFLEVBQUUsQ0FBQ0ksWUFBSCxHQUFrQjhLLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQi9LLFlBQW5DIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHA6Ly93d3cuY29jb3MuY29tXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgZ2Z4IGZyb20gJy4uLy4uL3JlbmRlcmVyL2dmeCc7XG5pbXBvcnQgSW5wdXRBc3NlbWJsZXIgZnJvbSAnLi4vLi4vcmVuZGVyZXIvY29yZS9pbnB1dC1hc3NlbWJsZXInO1xuaW1wb3J0IEFhYmIgZnJvbSAnLi4vZ2VvbS11dGlscy9hYWJiJztcbmltcG9ydCBWZWMzIGZyb20gJy4uL3ZhbHVlLXR5cGVzL3ZlYzMnO1xuaW1wb3J0IE1hdDQgZnJvbSAnLi4vdmFsdWUtdHlwZXMvbWF0NCc7XG5pbXBvcnQgTWF0ZXJpYWxWYXJpYW50IGZyb20gJy4uL2Fzc2V0cy9tYXRlcmlhbC9tYXRlcmlhbC12YXJpYW50JztcblxuY29uc3QgUmVuZGVyQ29tcG9uZW50ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9DQ1JlbmRlckNvbXBvbmVudCcpO1xuY29uc3QgTWVzaCA9IHJlcXVpcmUoJy4vQ0NNZXNoJyk7XG5jb25zdCBSZW5kZXJGbG93ID0gcmVxdWlyZSgnLi4vcmVuZGVyZXIvcmVuZGVyLWZsb3cnKTtcbmNvbnN0IFJlbmRlcmVyID0gcmVxdWlyZSgnLi4vcmVuZGVyZXInKTtcbmNvbnN0IE1hdGVyaWFsID0gcmVxdWlyZSgnLi4vYXNzZXRzL21hdGVyaWFsL0NDTWF0ZXJpYWwnKTtcblxuXG4vKipcbiAqICEjZW4gU2hhZG93IHByb2plY3Rpb24gbW9kZVxuICpcbiAqICEjY2gg6Zi05b2x5oqV5bCE5pa55byPXG4gKiBAc3RhdGljXG4gKiBAZW51bSBNZXNoUmVuZGVyZXIuU2hhZG93Q2FzdGluZ01vZGVcbiAqL1xubGV0IFNoYWRvd0Nhc3RpbmdNb2RlID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqXG4gICAgICogISNjaCDlhbPpl63pmLTlvbHmipXlsIRcbiAgICAgKiBAcHJvcGVydHkgT0ZGXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBPRkY6IDAsXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqXG4gICAgICogISNjaCDlvIDlkK/pmLTlvbHmipXlsITvvIzlvZPpmLTlvbHlhYnkuqfnlJ/nmoTml7blgJlcbiAgICAgKiBAcHJvcGVydHkgT05cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIE9OOiAxLFxuICAgIC8vIC8qKlxuICAgIC8vICAqICEjZW5cbiAgICAvLyAgKlxuICAgIC8vICAqICEjY2gg5Y+v5Lul5LuO572R5qC855qE5Lu75oSP5LiA6YGN5oqV5bCE5Ye66Zi05b2xXG4gICAgLy8gICogQHByb3BlcnR5IFRXT19TSURFRFxuICAgIC8vICAqIEByZWFkb25seVxuICAgIC8vICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgLy8gICovXG4gICAgLy8gVFdPX1NJREVEOiAyLFxuICAgIC8vIC8qKlxuICAgIC8vICAqICEjZW5cbiAgICAvLyAgKlxuICAgIC8vICAqICEjY2gg5Y+q5pi+56S66Zi05b2xXG4gICAgLy8gICogQHByb3BlcnR5IFNIQURPV1NfT05MWVxuICAgIC8vICAqIEByZWFkb25seVxuICAgIC8vICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgLy8gICovXG4gICAgLy8gU0hBRE9XU19PTkxZOiAzLFxufSk7XG5cbi8qKlxuICogISNlblxuICogTWVzaCBSZW5kZXJlciBDb21wb25lbnRcbiAqICEjemhcbiAqIOe9keagvOa4suafk+e7hOS7tlxuICogQGNsYXNzIE1lc2hSZW5kZXJlclxuICogQGV4dGVuZHMgUmVuZGVyQ29tcG9uZW50XG4gKi9cbmxldCBNZXNoUmVuZGVyZXIgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLk1lc2hSZW5kZXJlcicsXG4gICAgZXh0ZW5kczogUmVuZGVyQ29tcG9uZW50LFxuICAgIFxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5tZXNoL01lc2hSZW5kZXJlcicsXG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX21lc2g6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBNZXNoXG4gICAgICAgIH0sXG5cbiAgICAgICAgX3JlY2VpdmVTaGFkb3dzOiBmYWxzZSxcbiAgICAgICAgX3NoYWRvd0Nhc3RpbmdNb2RlOiBTaGFkb3dDYXN0aW5nTW9kZS5PRkYsXG5cbiAgICAgICAgX2VuYWJsZUF1dG9CYXRjaDogZmFsc2UsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIG1lc2ggd2hpY2ggdGhlIHJlbmRlcmVyIHVzZXMuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog6K6+572u5L2/55So55qE572R5qC8XG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TWVzaH0gbWVzaFxuICAgICAgICAgKi9cbiAgICAgICAgbWVzaDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbWVzaDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHYpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbWVzaCA9PT0gdikgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHRoaXMuX3NldE1lc2godik7XG4gICAgICAgICAgICAgICAgaWYgKCF2KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzYWJsZVJlbmRlcigpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMubWFya0ZvclJlbmRlcih0cnVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuX3JlbmRlckZsYWcgfD0gUmVuZGVyRmxvdy5GTEFHX1RSQU5TRk9STTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBNZXNoLFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICB0ZXh0dXJlczoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5UZXh0dXJlMkQsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFdoZXRoZXIgdGhlIG1lc2ggc2hvdWxkIHJlY2VpdmUgc2hhZG93cy5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDnvZHmoLzmmK/lkKbmjqXlj5flhYnmupDmipXlsITnmoTpmLTlvbFcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSByZWNlaXZlU2hhZG93c1xuICAgICAgICAgKi9cbiAgICAgICAgcmVjZWl2ZVNoYWRvd3M6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlY2VpdmVTaGFkb3dzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjZWl2ZVNoYWRvd3MgPSB2YWw7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmVjZWl2ZVNoYWRvdygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogU2hhZG93IENhc3RpbmcgTW9kZVxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOe9keagvOaKleWwhOmYtOW9seeahOaooeW8j1xuICAgICAgICAgKiBAcHJvcGVydHkge1NoYWRvd0Nhc3RpbmdNb2RlfSBzaGFkb3dDYXN0aW5nTW9kZVxuICAgICAgICAgKi9cbiAgICAgICAgc2hhZG93Q2FzdGluZ01vZGU6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NoYWRvd0Nhc3RpbmdNb2RlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2hhZG93Q2FzdGluZ01vZGUgPSB2YWw7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ2FzdFNoYWRvdygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IFNoYWRvd0Nhc3RpbmdNb2RlLFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBFbmFibGUgYXV0byBtZXJnZSBtZXNoLCBvbmx5IHN1cHBvcnQgd2hlbiBtZXNoJ3MgVmVydGV4Rm9ybWF0LCBQcmltaXRpdmVUeXBlLCBtYXRlcmlhbHMgYXJlIGFsbCB0aGUgc2FtZVxuICAgICAgICAgKiAhI3poIFxuICAgICAgICAgKiDlvIDlkK/oh6rliqjlkIjlubYgbWVzaCDlip/og73vvIzlj6rmnInlnKjnvZHmoLznmoQg6aG254K55qC85byP77yMUHJpbWl0aXZlVHlwZSwg5L2/55So55qE5p2Q6LSoIOmDveS4gOiHtOeahOaDheWGteS4i+aJjeS8muacieaViFxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGVuYWJsZUF1dG9CYXRjaFxuICAgICAgICAgKi9cbiAgICAgICAgZW5hYmxlQXV0b0JhdGNoOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbmFibGVBdXRvQmF0Y2g7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbmFibGVBdXRvQmF0Y2ggPSB2YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgU2hhZG93Q2FzdGluZ01vZGU6IFNoYWRvd0Nhc3RpbmdNb2RlXG4gICAgfSxcblxuICAgIGN0b3IgKCkge1xuICAgICAgICB0aGlzLl9ib3VuZGluZ0JveCA9IGNjLmdlb21VdGlscyAmJiBuZXcgQWFiYigpO1xuXG4gICAgICAgIGlmIChDQ19ERUJVRykge1xuICAgICAgICAgICAgdGhpcy5fZGVidWdEYXRhcyA9IHtcbiAgICAgICAgICAgICAgICB3aXJlRnJhbWU6IFtdLFxuICAgICAgICAgICAgICAgIG5vcm1hbDogW11cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25FbmFibGUgKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICBpZiAodGhpcy5fbWVzaCAmJiAhdGhpcy5fbWVzaC5sb2FkZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZVJlbmRlcigpO1xuICAgICAgICAgICAgdGhpcy5fbWVzaC5vbmNlKCdsb2FkJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKSByZXR1cm47XG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0TWVzaCh0aGlzLl9tZXNoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1hcmtGb3JSZW5kZXIodHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNjLmFzc2V0TWFuYWdlci5wb3N0TG9hZE5hdGl2ZSh0aGlzLl9tZXNoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3NldE1lc2godGhpcy5fbWVzaCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl91cGRhdGVSZW5kZXJOb2RlKCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZU1hdGVyaWFsKCk7XG4gICAgfSxcblxuICAgIG9uRGVzdHJveSAoKSB7XG4gICAgICAgIHRoaXMuX3NldE1lc2gobnVsbCk7XG4gICAgICAgIGNjLnBvb2wuYXNzZW1ibGVyLnB1dCh0aGlzLl9hc3NlbWJsZXIpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlUmVuZGVyTm9kZSAoKSB7XG4gICAgICAgIHRoaXMuX2Fzc2VtYmxlci5zZXRSZW5kZXJOb2RlKHRoaXMubm9kZSk7XG4gICAgfSxcblxuICAgIF9zZXRNZXNoIChtZXNoKSB7XG4gICAgICAgIGlmIChjYy5nZW9tVXRpbHMgJiYgbWVzaCkge1xuICAgICAgICAgICAgQWFiYi5mcm9tUG9pbnRzKHRoaXMuX2JvdW5kaW5nQm94LCBtZXNoLl9taW5Qb3MsIG1lc2guX21heFBvcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fbWVzaCkge1xuICAgICAgICAgICAgdGhpcy5fbWVzaC5vZmYoJ2luaXQtZm9ybWF0JywgdGhpcy5fdXBkYXRlTWVzaEF0dHJpYnV0ZSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lc2gpIHtcbiAgICAgICAgICAgIG1lc2gub24oJ2luaXQtZm9ybWF0JywgdGhpcy5fdXBkYXRlTWVzaEF0dHJpYnV0ZSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbWVzaCA9IG1lc2g7XG4gICAgICAgIHRoaXMuX2Fzc2VtYmxlciAmJiAodGhpcy5fYXNzZW1ibGVyLl93b3JsZERhdGFzID0ge30pO1xuICAgICAgICB0aGlzLl91cGRhdGVNZXNoQXR0cmlidXRlKCk7XG4gICAgfSxcblxuICAgIF9nZXREZWZhdWx0TWF0ZXJpYWwgKCkge1xuICAgICAgICByZXR1cm4gTWF0ZXJpYWwuZ2V0QnVpbHRpbk1hdGVyaWFsKCd1bmxpdCcpO1xuICAgIH0sXG5cbiAgICBfdmFsaWRhdGVSZW5kZXIgKCkge1xuICAgICAgICBsZXQgbWVzaCA9IHRoaXMuX21lc2g7XG4gICAgICAgIGlmIChtZXNoICYmIG1lc2guX3N1YkRhdGFzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlzYWJsZVJlbmRlcigpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlTWF0ZXJpYWwgKCkge1xuICAgICAgICAvLyBUT0RPOiB1c2VkIHRvIHVwZ3JhZGUgZnJvbSAyLjEsIHNob3VsZCBiZSByZW1vdmVkXG4gICAgICAgIGxldCB0ZXh0dXJlcyA9IHRoaXMudGV4dHVyZXM7XG4gICAgICAgIGlmICh0ZXh0dXJlcyAmJiB0ZXh0dXJlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgZGVmYXVsdE1hdGVyaWFsID0gdGhpcy5fZ2V0RGVmYXVsdE1hdGVyaWFsKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRleHR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hdGVyaWFsID0gdGhpcy5fbWF0ZXJpYWxzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChtYXRlcmlhbCAmJiBtYXRlcmlhbC5fdXVpZCAhPT0gZGVmYXVsdE1hdGVyaWFsLl91dWlkKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBpZiAoIW1hdGVyaWFsKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsID0gTWF0ZXJpYWxWYXJpYW50LmNyZWF0ZShkZWZhdWx0TWF0ZXJpYWwsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE1hdGVyaWFsKGksIG1hdGVyaWFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwuc2V0UHJvcGVydHkoJ2RpZmZ1c2VUZXh0dXJlJywgdGV4dHVyZXNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdXBkYXRlUmVjZWl2ZVNoYWRvdygpO1xuICAgICAgICB0aGlzLl91cGRhdGVDYXN0U2hhZG93KCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZU1lc2hBdHRyaWJ1dGUoKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZVJlY2VpdmVTaGFkb3cgKCkge1xuICAgICAgICBsZXQgbWF0ZXJpYWxzID0gdGhpcy5nZXRNYXRlcmlhbHMoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRlcmlhbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG1hdGVyaWFsc1tpXS5kZWZpbmUoJ0NDX1VTRV9TSEFET1dfTUFQJywgdGhpcy5fcmVjZWl2ZVNoYWRvd3MsIHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VwZGF0ZUNhc3RTaGFkb3cgKCkge1xuICAgICAgICBsZXQgbWF0ZXJpYWxzID0gdGhpcy5nZXRNYXRlcmlhbHMoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRlcmlhbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG1hdGVyaWFsc1tpXS5kZWZpbmUoJ0NDX0NBU1RJTkdfU0hBRE9XJywgdGhpcy5fc2hhZG93Q2FzdGluZ01vZGUgPT09IFNoYWRvd0Nhc3RpbmdNb2RlLk9OLCB1bmRlZmluZWQsIHRydWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVNZXNoQXR0cmlidXRlICgpIHtcbiAgICAgICAgbGV0IHN1YkRhdGFzID0gdGhpcy5fbWVzaCAmJiB0aGlzLl9tZXNoLnN1YkRhdGFzO1xuICAgICAgICBpZiAoIXN1YkRhdGFzKSByZXR1cm47XG5cbiAgICAgICAgbGV0IG1hdGVyaWFscyA9IHRoaXMuZ2V0TWF0ZXJpYWxzKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0ZXJpYWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoIXN1YkRhdGFzW2ldKSBicmVhaztcbiAgICAgICAgICAgIGxldCB2Zm0gPSBzdWJEYXRhc1tpXS52Zm07XG4gICAgICAgICAgICBsZXQgbWF0ZXJpYWwgPSBtYXRlcmlhbHNbaV07XG4gICAgICAgICAgICBtYXRlcmlhbC5kZWZpbmUoJ0NDX1VTRV9BVFRSSUJVVEVfQ09MT1InLCAhIXZmbS5lbGVtZW50KGdmeC5BVFRSX0NPTE9SKSwgdW5kZWZpbmVkLCB0cnVlKTtcbiAgICAgICAgICAgIG1hdGVyaWFsLmRlZmluZSgnQ0NfVVNFX0FUVFJJQlVURV9VVjAnLCAhIXZmbS5lbGVtZW50KGdmeC5BVFRSX1VWMCksIHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICAgICAgICBtYXRlcmlhbC5kZWZpbmUoJ0NDX1VTRV9BVFRSSUJVVEVfTk9STUFMJywgISF2Zm0uZWxlbWVudChnZnguQVRUUl9OT1JNQUwpLCB1bmRlZmluZWQsIHRydWUpO1xuICAgICAgICAgICAgbWF0ZXJpYWwuZGVmaW5lKCdDQ19VU0VfQVRUUklCVVRFX1RBTkdFTlQnLCAhIXZmbS5lbGVtZW50KGdmeC5BVFRSX1RBTkdFTlQpLCB1bmRlZmluZWQsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKENDX0RFQlVHKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBuYW1lIGluIHRoaXMuX2RlYnVnRGF0YXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWJ1Z0RhdGFzW25hbWVdLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQ0NfSlNCICYmIENDX05BVElWRVJFTkRFUkVSKSB7XG4gICAgICAgICAgICB0aGlzLl9hc3NlbWJsZXIudXBkYXRlTWVzaERhdGEodGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2NoZWNrQmFjdGggKCkge1xuICAgIH0sXG59KTtcblxuaWYgKENDX0RFQlVHKSB7XG4gICAgY29uc3QgQkxBQ0tfQ09MT1IgPSBjYy5Db2xvci5CTEFDSztcbiAgICBjb25zdCBSRURfQ09MT1IgPSBjYy5Db2xvci5SRUQ7XG5cbiAgICBsZXQgdjNfdG1wID0gW2NjLnYzKCksIGNjLnYzKCldO1xuICAgIGxldCBtYXQ0X3RtcCA9IGNjLm1hdDQoKTtcblxuICAgIGxldCBjcmVhdGVEZWJ1Z0RhdGFGbnMgPSB7XG4gICAgICAgIG5vcm1hbCAoY29tcCwgaWEsIHN1YkRhdGEsIHN1YkluZGV4KSB7XG4gICAgICAgICAgICBsZXQgb2xkVmZtID0gc3ViRGF0YS52Zm07XG5cbiAgICAgICAgICAgIGxldCBub3JtYWxFbGUgPSBvbGRWZm0uZWxlbWVudChnZnguQVRUUl9OT1JNQUwpO1xuICAgICAgICAgICAgbGV0IHBvc0VsZSA9IG9sZFZmbS5lbGVtZW50KGdmeC5BVFRSX1BPU0lUSU9OKTtcbiAgICAgICAgICAgIGxldCBqb2ludEVsZSA9IG9sZFZmbS5lbGVtZW50KGdmeC5BVFRSX0pPSU5UUyk7XG4gICAgICAgICAgICBsZXQgd2VpZ2h0RWxlID0gb2xkVmZtLmVsZW1lbnQoZ2Z4LkFUVFJfV0VJR0hUUyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghbm9ybWFsRWxlIHx8ICFwb3NFbGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBpbmRpY2VzID0gW107XG4gICAgICAgICAgICBsZXQgdmJEYXRhID0gW107XG5cbiAgICAgICAgICAgIGxldCBsaW5lTGVuZ3RoID0gMTAwO1xuICAgICAgICAgICAgVmVjMy5zZXQodjNfdG1wWzBdLCA1LCAwLCAwKTtcbiAgICAgICAgICAgIE1hdDQuaW52ZXJ0KG1hdDRfdG1wLCBjb21wLm5vZGUuX3dvcmxkTWF0cml4KTtcbiAgICAgICAgICAgIFZlYzMudHJhbnNmb3JtTWF0NE5vcm1hbCh2M190bXBbMF0sIHYzX3RtcFswXSwgbWF0NF90bXApO1xuICAgICAgICAgICAgbGluZUxlbmd0aCA9IHYzX3RtcFswXS5tYWcoKTtcblxuICAgICAgICAgICAgbGV0IG1lc2ggPSBjb21wLm1lc2g7XG4gICAgICAgICAgICBsZXQgcG9zRGF0YSA9IG1lc2guX2dldEF0dHJNZXNoRGF0YShzdWJJbmRleCwgZ2Z4LkFUVFJfUE9TSVRJT04pO1xuICAgICAgICAgICAgbGV0IG5vcm1hbERhdGEgPSBtZXNoLl9nZXRBdHRyTWVzaERhdGEoc3ViSW5kZXgsIGdmeC5BVFRSX05PUk1BTCk7XG4gICAgICAgICAgICBsZXQgam9pbnREYXRhID0gbWVzaC5fZ2V0QXR0ck1lc2hEYXRhKHN1YkluZGV4LCBnZnguQVRUUl9KT0lOVFMpO1xuICAgICAgICAgICAgbGV0IHdlaWdodERhdGEgPSBtZXNoLl9nZXRBdHRyTWVzaERhdGEoc3ViSW5kZXgsIGdmeC5BVFRSX1dFSUdIVFMpO1xuXG4gICAgICAgICAgICBsZXQgdmVydGV4Q291bnQgPSBwb3NEYXRhLmxlbmd0aCAvIHBvc0VsZS5udW07XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVydGV4Q291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBub3JtYWxJbmRleCA9IGkgKiBub3JtYWxFbGUubnVtO1xuICAgICAgICAgICAgICAgIGxldCBwb3NJbmRleCA9IGkgKiBwb3NFbGUubnVtO1xuXG4gICAgICAgICAgICAgICAgVmVjMy5zZXQodjNfdG1wWzBdLCBub3JtYWxEYXRhW25vcm1hbEluZGV4XSwgbm9ybWFsRGF0YVtub3JtYWxJbmRleCsxXSwgbm9ybWFsRGF0YVtub3JtYWxJbmRleCsyXSk7XG4gICAgICAgICAgICAgICAgVmVjMy5zZXQodjNfdG1wWzFdLCBwb3NEYXRhW3Bvc0luZGV4XSwgcG9zRGF0YVtwb3NJbmRleCsxXSwgcG9zRGF0YVtwb3NJbmRleCsyXSk7XG4gICAgICAgICAgICAgICAgVmVjMy5zY2FsZUFuZEFkZCh2M190bXBbMF0sIHYzX3RtcFsxXSwgdjNfdG1wWzBdLCBsaW5lTGVuZ3RoKTtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGxpbmVJbmRleCA9IDA7IGxpbmVJbmRleCA8IDI7IGxpbmVJbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZiRGF0YS5wdXNoKHYzX3RtcFtsaW5lSW5kZXhdLngsIHYzX3RtcFtsaW5lSW5kZXhdLnksIHYzX3RtcFtsaW5lSW5kZXhdLnopO1xuICAgICAgICAgICAgICAgICAgICBpZiAoam9pbnRFbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBqb2ludEluZGV4ID0gaSAqIGpvaW50RWxlLm51bTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgam9pbnRFbGUubnVtOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YkRhdGEucHVzaChqb2ludERhdGFbam9pbnRJbmRleCArIGpdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAod2VpZ2h0RWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgd2VpZ2h0SW5kZXggPSBpICogd2VpZ2h0RWxlLm51bTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgd2VpZ2h0RWxlLm51bTsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmJEYXRhLnB1c2god2VpZ2h0RGF0YVt3ZWlnaHRJbmRleCArIGpdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChpKjIsIGkqMisxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGZvcm1hdE9wdHMgPSBbXG4gICAgICAgICAgICAgICAgeyBuYW1lOiBnZnguQVRUUl9QT1NJVElPTiwgdHlwZTogZ2Z4LkFUVFJfVFlQRV9GTE9BVDMyLCBudW06IDMgfSxcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBpZiAoam9pbnRFbGUpIHtcbiAgICAgICAgICAgICAgICBmb3JtYXRPcHRzLnB1c2goeyBuYW1lOiBnZnguQVRUUl9KT0lOVFMsIHR5cGU6IGdmeC5BVFRSX1RZUEVfRkxPQVQzMiwgbnVtOiBqb2ludEVsZS5udW0gfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh3ZWlnaHRFbGUpIHtcbiAgICAgICAgICAgICAgICBmb3JtYXRPcHRzLnB1c2goeyBuYW1lOiBnZnguQVRUUl9XRUlHSFRTLCB0eXBlOiBnZnguQVRUUl9UWVBFX0ZMT0FUMzIsIG51bTogd2VpZ2h0RWxlLm51bSB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGdmeFZGbXQgPSBuZXcgZ2Z4LlZlcnRleEZvcm1hdChmb3JtYXRPcHRzKTtcblxuICAgICAgICAgICAgbGV0IHZiID0gbmV3IGdmeC5WZXJ0ZXhCdWZmZXIoXG4gICAgICAgICAgICAgICAgUmVuZGVyZXIuZGV2aWNlLFxuICAgICAgICAgICAgICAgIGdmeFZGbXQsXG4gICAgICAgICAgICAgICAgZ2Z4LlVTQUdFX1NUQVRJQyxcbiAgICAgICAgICAgICAgICBuZXcgRmxvYXQzMkFycmF5KHZiRGF0YSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGxldCBpYkRhdGEgPSBuZXcgVWludDE2QXJyYXkoaW5kaWNlcyk7XG4gICAgICAgICAgICBsZXQgaWIgPSBuZXcgZ2Z4LkluZGV4QnVmZmVyKFxuICAgICAgICAgICAgICAgIFJlbmRlcmVyLmRldmljZSxcbiAgICAgICAgICAgICAgICBnZnguSU5ERVhfRk1UX1VJTlQxNixcbiAgICAgICAgICAgICAgICBnZnguVVNBR0VfU1RBVElDLFxuICAgICAgICAgICAgICAgIGliRGF0YSxcbiAgICAgICAgICAgICAgICBpYkRhdGEubGVuZ3RoXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBsZXQgbSA9IE1hdGVyaWFsVmFyaWFudC5jcmVhdGVXaXRoQnVpbHRpbigndW5saXQnKTtcbiAgICAgICAgICAgIG0uc2V0UHJvcGVydHkoJ2RpZmZ1c2VDb2xvcicsIFJFRF9DT0xPUik7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbWF0ZXJpYWw6IG0sXG4gICAgICAgICAgICAgICAgaWE6IG5ldyBJbnB1dEFzc2VtYmxlcih2YiwgaWIsIGdmeC5QVF9MSU5FUylcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2lyZUZyYW1lIChjb21wLCBpYSwgc3ViRGF0YSkge1xuICAgICAgICAgICAgbGV0IG9sZEliRGF0YSA9IHN1YkRhdGEuZ2V0SURhdGEoVWludDE2QXJyYXkpO1xuICAgICAgICAgICAgbGV0IG0gPSBNYXRlcmlhbFZhcmlhbnQuY3JlYXRlV2l0aEJ1aWx0aW4oJ3VubGl0Jyk7XG4gICAgICAgICAgICBtLnNldFByb3BlcnR5KCdkaWZmdXNlQ29sb3InLCBCTEFDS19DT0xPUik7XG5cbiAgICAgICAgICAgIGxldCBpbmRpY2VzID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9sZEliRGF0YS5sZW5ndGg7IGkrPTMpIHtcbiAgICAgICAgICAgICAgICBsZXQgYSA9IG9sZEliRGF0YVsgaSArIDAgXTtcbiAgICAgICAgICAgICAgICBsZXQgYiA9IG9sZEliRGF0YVsgaSArIDEgXTtcbiAgICAgICAgICAgICAgICBsZXQgYyA9IG9sZEliRGF0YVsgaSArIDIgXTtcbiAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goYSwgYiwgYiwgYywgYywgYSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBpYkRhdGEgPSBuZXcgVWludDE2QXJyYXkoaW5kaWNlcyk7XG4gICAgICAgICAgICBsZXQgaWIgPSBuZXcgZ2Z4LkluZGV4QnVmZmVyKFxuICAgICAgICAgICAgICAgIFJlbmRlcmVyLmRldmljZSxcbiAgICAgICAgICAgICAgICBnZnguSU5ERVhfRk1UX1VJTlQxNixcbiAgICAgICAgICAgICAgICBnZnguVVNBR0VfU1RBVElDLFxuICAgICAgICAgICAgICAgIGliRGF0YSxcbiAgICAgICAgICAgICAgICBpYkRhdGEubGVuZ3RoXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG1hdGVyaWFsOiBtLFxuICAgICAgICAgICAgICAgIGlhOiBuZXcgSW5wdXRBc3NlbWJsZXIoaWEuX3ZlcnRleEJ1ZmZlciwgaWIsIGdmeC5QVF9MSU5FUylcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbGV0IF9wcm90byA9IE1lc2hSZW5kZXJlci5wcm90b3R5cGU7XG4gICAgX3Byb3RvLl91cGRhdGVEZWJ1Z0RhdGFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgZGVidWdEYXRhcyA9IHRoaXMuX2RlYnVnRGF0YXM7XG4gICAgICAgIGxldCBzdWJNZXNoZXMgPSB0aGlzLl9tZXNoLnN1Yk1lc2hlcztcbiAgICAgICAgbGV0IHN1YkRhdGFzID0gdGhpcy5fbWVzaC5fc3ViRGF0YXM7XG4gICAgICAgIGZvciAobGV0IG5hbWUgaW4gZGVidWdEYXRhcykge1xuICAgICAgICAgICAgbGV0IGRlYnVnRGF0YSA9IGRlYnVnRGF0YXNbbmFtZV07XG4gICAgICAgICAgICBpZiAoZGVidWdEYXRhLmxlbmd0aCA9PT0gc3ViTWVzaGVzLmxlbmd0aCkgY29udGludWU7XG4gICAgICAgICAgICBpZiAoIWNjLm1hY3JvWydTSE9XX01FU0hfJyArIG5hbWUudG9VcHBlckNhc2UoKV0pIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBkZWJ1Z0RhdGEubGVuZ3RoID0gc3ViTWVzaGVzLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3ViTWVzaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGVidWdEYXRhW2ldID0gY3JlYXRlRGVidWdEYXRhRm5zW25hbWVdKHRoaXMsIHN1Yk1lc2hlc1tpXSwgc3ViRGF0YXNbaV0sIGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cblxuY2MuTWVzaFJlbmRlcmVyID0gbW9kdWxlLmV4cG9ydHMgPSBNZXNoUmVuZGVyZXI7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==