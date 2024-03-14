
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCRenderComponent.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _assembler = _interopRequireDefault(require("../renderer/assembler"));

var _materialVariant = _interopRequireDefault(require("../assets/material/material-variant"));

var _valueTypes = require("../value-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/****************************************************************************
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
var Component = require('./CCComponent');

var RenderFlow = require('../renderer/render-flow');

var Material = require('../assets/material/CCMaterial');

var _temp_color = new _valueTypes.Color();
/**
 * !#en
 * Base class for components which supports rendering features.
 * !#zh
 * 所有支持渲染的组件的基类
 *
 * @class RenderComponent
 * @extends Component
 */


var RenderComponent = cc.Class({
  name: 'RenderComponent',
  "extends": Component,
  editor: CC_EDITOR && {
    executeInEditMode: true,
    disallowMultiple: true
  },
  properties: {
    _materials: {
      "default": [],
      type: Material
    },

    /**
     * !#en The materials used by this render component.
     * !#zh 渲染组件使用的材质。
     * @property {[Material]} sharedMaterials
     */
    materials: {
      get: function get() {
        return this._materials;
      },
      set: function set(val) {
        this._materials = val;

        this._activateMaterial();
      },
      type: [Material],
      displayName: 'Materials',
      animatable: false
    }
  },
  ctor: function ctor() {
    this._vertsDirty = true;
    this._assembler = null;
  },
  _resetAssembler: function _resetAssembler() {
    _assembler["default"].init(this);

    this._updateColor();

    this.setVertsDirty();
  },
  __preload: function __preload() {
    this._resetAssembler();

    this._activateMaterial();
  },
  onEnable: function onEnable() {
    if (this.node._renderComponent) {
      this.node._renderComponent.enabled = false;
    }

    this.node._renderComponent = this;
    this.node._renderFlag |= RenderFlow.FLAG_OPACITY_COLOR;
    this.setVertsDirty();
  },
  onDisable: function onDisable() {
    this.node._renderComponent = null;
    this.disableRender();
  },
  onDestroy: function onDestroy() {
    var materials = this._materials;

    for (var i = 0; i < materials.length; i++) {
      cc.pool.material.put(materials[i]);
    }

    materials.length = 0;
    cc.pool.assembler.put(this._assembler);
  },
  setVertsDirty: function setVertsDirty() {
    this._vertsDirty = true;
    this.markForRender(true);
  },
  _on3DNodeChanged: function _on3DNodeChanged() {
    this._resetAssembler();
  },
  _validateRender: function _validateRender() {},
  markForValidate: function markForValidate() {
    cc.RenderFlow.registerValidate(this);
  },
  markForRender: function markForRender(enable) {
    var flag = RenderFlow.FLAG_RENDER | RenderFlow.FLAG_UPDATE_RENDER_DATA;

    if (enable) {
      this.node._renderFlag |= flag;
      this.markForValidate();
    } else {
      this.node._renderFlag &= ~flag;
    }
  },
  disableRender: function disableRender() {
    this.node._renderFlag &= ~(RenderFlow.FLAG_RENDER | RenderFlow.FLAG_UPDATE_RENDER_DATA);
  },

  /**
   * !#en Get the material by index.
   * !#zh 根据指定索引获取材质
   * @method getMaterial
   * @param {Number} index 
   * @return {MaterialVariant}
   */
  getMaterial: function getMaterial(index) {
    if (index < 0 || index >= this._materials.length) {
      return null;
    }

    var material = this._materials[index];
    if (!material) return null;

    var instantiated = _materialVariant["default"].create(material, this);

    if (instantiated !== material) {
      this.setMaterial(index, instantiated);
    }

    return instantiated;
  },

  /**
   * !#en Gets all the materials.
   * !#zh 获取所有材质。
   * @method getMaterials
   * @return {[MaterialVariant]}
   */
  getMaterials: function getMaterials() {
    var materials = this._materials;

    for (var i = 0; i < materials.length; i++) {
      materials[i] = _materialVariant["default"].create(materials[i], this);
    }

    return materials;
  },

  /**
   * !#en Set the material by index.
   * !#zh 根据指定索引设置材质
   * @method setMaterial
   * @param {Number} index 
   * @param {Material} material
   * @return {Material}
   */
  setMaterial: function setMaterial(index, material) {
    if (material !== this._materials[index]) {
      material = _materialVariant["default"].create(material, this);
      this._materials[index] = material;
    }

    this._updateMaterial();

    this.markForRender(true);
    return material;
  },
  _getDefaultMaterial: function _getDefaultMaterial() {
    return Material.getBuiltinMaterial('2d-sprite');
  },

  /**
   * Init material.
   */
  _activateMaterial: function _activateMaterial() {
    var materials = this._materials;

    if (!materials[0]) {
      var material = this._getDefaultMaterial();

      materials[0] = material;
    }

    for (var i = 0; i < materials.length; i++) {
      materials[i] = _materialVariant["default"].create(materials[i], this);
    }

    this._updateMaterial();
  },

  /**
   * Update material properties.
   */
  _updateMaterial: function _updateMaterial() {},
  _updateColor: function _updateColor() {
    if (this._assembler.updateColor) {
      var premultiply = this.srcBlendFactor === cc.macro.BlendFactor.ONE;
      premultiply && _valueTypes.Color.premultiplyAlpha(_temp_color, this.node._color);
      var color = premultiply ? _temp_color._val : null;

      this._assembler.updateColor(this, color);
    }
  },
  _checkBacth: function _checkBacth(renderer, cullingMask) {
    var material = this._materials[0];

    if (material && material.getHash() !== renderer.material.getHash() || renderer.cullingMask !== cullingMask) {
      renderer._flush();

      renderer.node = material.getDefine('CC_USE_MODEL') ? this.node : renderer._dummyNode;
      renderer.material = material;
      renderer.cullingMask = cullingMask;
    }
  }
});
cc.RenderComponent = module.exports = RenderComponent;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvQ0NSZW5kZXJDb21wb25lbnQuanMiXSwibmFtZXMiOlsiQ29tcG9uZW50IiwicmVxdWlyZSIsIlJlbmRlckZsb3ciLCJNYXRlcmlhbCIsIl90ZW1wX2NvbG9yIiwiQ29sb3IiLCJSZW5kZXJDb21wb25lbnQiLCJjYyIsIkNsYXNzIiwibmFtZSIsImVkaXRvciIsIkNDX0VESVRPUiIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiZGlzYWxsb3dNdWx0aXBsZSIsInByb3BlcnRpZXMiLCJfbWF0ZXJpYWxzIiwidHlwZSIsIm1hdGVyaWFscyIsImdldCIsInNldCIsInZhbCIsIl9hY3RpdmF0ZU1hdGVyaWFsIiwiZGlzcGxheU5hbWUiLCJhbmltYXRhYmxlIiwiY3RvciIsIl92ZXJ0c0RpcnR5IiwiX2Fzc2VtYmxlciIsIl9yZXNldEFzc2VtYmxlciIsIkFzc2VtYmxlciIsImluaXQiLCJfdXBkYXRlQ29sb3IiLCJzZXRWZXJ0c0RpcnR5IiwiX19wcmVsb2FkIiwib25FbmFibGUiLCJub2RlIiwiX3JlbmRlckNvbXBvbmVudCIsImVuYWJsZWQiLCJfcmVuZGVyRmxhZyIsIkZMQUdfT1BBQ0lUWV9DT0xPUiIsIm9uRGlzYWJsZSIsImRpc2FibGVSZW5kZXIiLCJvbkRlc3Ryb3kiLCJpIiwibGVuZ3RoIiwicG9vbCIsIm1hdGVyaWFsIiwicHV0IiwiYXNzZW1ibGVyIiwibWFya0ZvclJlbmRlciIsIl9vbjNETm9kZUNoYW5nZWQiLCJfdmFsaWRhdGVSZW5kZXIiLCJtYXJrRm9yVmFsaWRhdGUiLCJyZWdpc3RlclZhbGlkYXRlIiwiZW5hYmxlIiwiZmxhZyIsIkZMQUdfUkVOREVSIiwiRkxBR19VUERBVEVfUkVOREVSX0RBVEEiLCJnZXRNYXRlcmlhbCIsImluZGV4IiwiaW5zdGFudGlhdGVkIiwiTWF0ZXJpYWxWYXJpYW50IiwiY3JlYXRlIiwic2V0TWF0ZXJpYWwiLCJnZXRNYXRlcmlhbHMiLCJfdXBkYXRlTWF0ZXJpYWwiLCJfZ2V0RGVmYXVsdE1hdGVyaWFsIiwiZ2V0QnVpbHRpbk1hdGVyaWFsIiwidXBkYXRlQ29sb3IiLCJwcmVtdWx0aXBseSIsInNyY0JsZW5kRmFjdG9yIiwibWFjcm8iLCJCbGVuZEZhY3RvciIsIk9ORSIsInByZW11bHRpcGx5QWxwaGEiLCJfY29sb3IiLCJjb2xvciIsIl92YWwiLCJfY2hlY2tCYWN0aCIsInJlbmRlcmVyIiwiY3VsbGluZ01hc2siLCJnZXRIYXNoIiwiX2ZsdXNoIiwiZ2V0RGVmaW5lIiwiX2R1bW15Tm9kZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUF5QkE7O0FBQ0E7O0FBQ0E7Ozs7QUEzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTUEsSUFBTUEsU0FBUyxHQUFHQyxPQUFPLENBQUMsZUFBRCxDQUF6Qjs7QUFDQSxJQUFNQyxVQUFVLEdBQUdELE9BQU8sQ0FBQyx5QkFBRCxDQUExQjs7QUFDQSxJQUFNRSxRQUFRLEdBQUdGLE9BQU8sQ0FBQywrQkFBRCxDQUF4Qjs7QUFFQSxJQUFJRyxXQUFXLEdBQUcsSUFBSUMsaUJBQUosRUFBbEI7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQUlDLGVBQWUsR0FBR0MsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDM0JDLEVBQUFBLElBQUksRUFBRSxpQkFEcUI7QUFFM0IsYUFBU1QsU0FGa0I7QUFJM0JVLEVBQUFBLE1BQU0sRUFBRUMsU0FBUyxJQUFJO0FBQ2pCQyxJQUFBQSxpQkFBaUIsRUFBRSxJQURGO0FBRWpCQyxJQUFBQSxnQkFBZ0IsRUFBRTtBQUZELEdBSk07QUFTM0JDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxVQUFVLEVBQUU7QUFDUixp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LENBQUNqQyxRQUFULEdBQW9CQSxRQUFwQjtBQUNBaUMsTUFBQUEsUUFBUSxDQUFDQyxXQUFULEdBQXVCQSxXQUF2QjtBQUNIO0FBQ0o7QUFoTjBCLENBQVQsQ0FBdEI7QUFtTkF4RSxFQUFFLENBQUNELGVBQUgsR0FBcUI4RSxNQUFNLENBQUNDLE9BQVAsR0FBaUIvRSxlQUF0QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBBc3NlbWJsZXIgZnJvbSAnLi4vcmVuZGVyZXIvYXNzZW1ibGVyJztcbmltcG9ydCBNYXRlcmlhbFZhcmlhbnQgZnJvbSAnLi4vYXNzZXRzL21hdGVyaWFsL21hdGVyaWFsLXZhcmlhbnQnO1xuaW1wb3J0IHsgQ29sb3IgfSBmcm9tICcuLi92YWx1ZS10eXBlcyc7XG5cbmNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJy4vQ0NDb21wb25lbnQnKTtcbmNvbnN0IFJlbmRlckZsb3cgPSByZXF1aXJlKCcuLi9yZW5kZXJlci9yZW5kZXItZmxvdycpO1xuY29uc3QgTWF0ZXJpYWwgPSByZXF1aXJlKCcuLi9hc3NldHMvbWF0ZXJpYWwvQ0NNYXRlcmlhbCcpO1xuXG5sZXQgX3RlbXBfY29sb3IgPSBuZXcgQ29sb3IoKTtcblxuLyoqXG4gKiAhI2VuXG4gKiBCYXNlIGNsYXNzIGZvciBjb21wb25lbnRzIHdoaWNoIHN1cHBvcnRzIHJlbmRlcmluZyBmZWF0dXJlcy5cbiAqICEjemhcbiAqIOaJgOacieaUr+aMgea4suafk+eahOe7hOS7tueahOWfuuexu1xuICpcbiAqIEBjbGFzcyBSZW5kZXJDb21wb25lbnRcbiAqIEBleHRlbmRzIENvbXBvbmVudFxuICovXG5sZXQgUmVuZGVyQ29tcG9uZW50ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdSZW5kZXJDb21wb25lbnQnLFxuICAgIGV4dGVuZHM6IENvbXBvbmVudCxcblxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgZXhlY3V0ZUluRWRpdE1vZGU6IHRydWUsXG4gICAgICAgIGRpc2FsbG93TXVsdGlwbGU6IHRydWVcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBfbWF0ZXJpYWxzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IE1hdGVyaWFsLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBtYXRlcmlhbHMgdXNlZCBieSB0aGlzIHJlbmRlciBjb21wb25lbnQuXG4gICAgICAgICAqICEjemgg5riy5p+T57uE5Lu25L2/55So55qE5p2Q6LSo44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7W01hdGVyaWFsXX0gc2hhcmVkTWF0ZXJpYWxzXG4gICAgICAgICAqL1xuICAgICAgICBtYXRlcmlhbHM6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21hdGVyaWFscztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21hdGVyaWFscyA9IHZhbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9hY3RpdmF0ZU1hdGVyaWFsKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogW01hdGVyaWFsXSxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnTWF0ZXJpYWxzJyxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFxuICAgIGN0b3IgKCkge1xuICAgICAgICB0aGlzLl92ZXJ0c0RpcnR5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fYXNzZW1ibGVyID0gbnVsbDtcbiAgICB9LFxuXG4gICAgX3Jlc2V0QXNzZW1ibGVyICgpIHtcbiAgICAgICAgQXNzZW1ibGVyLmluaXQodGhpcyk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUNvbG9yKCk7XG4gICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgIH0sXG5cbiAgICBfX3ByZWxvYWQgKCkge1xuICAgICAgICB0aGlzLl9yZXNldEFzc2VtYmxlcigpO1xuICAgICAgICB0aGlzLl9hY3RpdmF0ZU1hdGVyaWFsKCk7XG4gICAgfSxcblxuICAgIG9uRW5hYmxlICgpIHtcbiAgICAgICAgaWYgKHRoaXMubm9kZS5fcmVuZGVyQ29tcG9uZW50KSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUuX3JlbmRlckNvbXBvbmVudC5lbmFibGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ub2RlLl9yZW5kZXJDb21wb25lbnQgPSB0aGlzO1xuICAgICAgICB0aGlzLm5vZGUuX3JlbmRlckZsYWcgfD0gUmVuZGVyRmxvdy5GTEFHX09QQUNJVFlfQ09MT1I7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnNldFZlcnRzRGlydHkoKTtcbiAgICB9LFxuXG4gICAgb25EaXNhYmxlICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLl9yZW5kZXJDb21wb25lbnQgPSBudWxsO1xuICAgICAgICB0aGlzLmRpc2FibGVSZW5kZXIoKTtcbiAgICB9LFxuXG4gICAgb25EZXN0cm95ICgpIHtcbiAgICAgICAgbGV0IG1hdGVyaWFscyA9IHRoaXMuX21hdGVyaWFscztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRlcmlhbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNjLnBvb2wubWF0ZXJpYWwucHV0KG1hdGVyaWFsc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgbWF0ZXJpYWxzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgY2MucG9vbC5hc3NlbWJsZXIucHV0KHRoaXMuX2Fzc2VtYmxlcik7XG4gICAgfSxcblxuICAgIHNldFZlcnRzRGlydHkgKCkge1xuICAgICAgICB0aGlzLl92ZXJ0c0RpcnR5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tYXJrRm9yUmVuZGVyKHRydWUpO1xuICAgIH0sXG5cbiAgICBfb24zRE5vZGVDaGFuZ2VkICgpIHtcbiAgICAgICAgdGhpcy5fcmVzZXRBc3NlbWJsZXIoKTtcbiAgICB9LFxuICAgIFxuICAgIF92YWxpZGF0ZVJlbmRlciAoKSB7XG4gICAgfSxcblxuICAgIG1hcmtGb3JWYWxpZGF0ZSAoKSB7XG4gICAgICAgIGNjLlJlbmRlckZsb3cucmVnaXN0ZXJWYWxpZGF0ZSh0aGlzKTtcbiAgICB9LFxuXG4gICAgbWFya0ZvclJlbmRlciAoZW5hYmxlKSB7XG4gICAgICAgIGxldCBmbGFnID0gUmVuZGVyRmxvdy5GTEFHX1JFTkRFUiB8IFJlbmRlckZsb3cuRkxBR19VUERBVEVfUkVOREVSX0RBVEE7XG4gICAgICAgIGlmIChlbmFibGUpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5fcmVuZGVyRmxhZyB8PSBmbGFnO1xuICAgICAgICAgICAgdGhpcy5tYXJrRm9yVmFsaWRhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5fcmVuZGVyRmxhZyAmPSB+ZmxhZztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBkaXNhYmxlUmVuZGVyICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLl9yZW5kZXJGbGFnICY9IH4oUmVuZGVyRmxvdy5GTEFHX1JFTkRFUiB8IFJlbmRlckZsb3cuRkxBR19VUERBVEVfUkVOREVSX0RBVEEpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldCB0aGUgbWF0ZXJpYWwgYnkgaW5kZXguXG4gICAgICogISN6aCDmoLnmja7mjIflrprntKLlvJXojrflj5bmnZDotKhcbiAgICAgKiBAbWV0aG9kIGdldE1hdGVyaWFsXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IFxuICAgICAqIEByZXR1cm4ge01hdGVyaWFsVmFyaWFudH1cbiAgICAgKi9cbiAgICBnZXRNYXRlcmlhbCAoaW5kZXgpIHtcbiAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLl9tYXRlcmlhbHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtYXRlcmlhbCA9IHRoaXMuX21hdGVyaWFsc1tpbmRleF07XG4gICAgICAgIGlmICghbWF0ZXJpYWwpIHJldHVybiBudWxsO1xuICAgICAgICBcbiAgICAgICAgbGV0IGluc3RhbnRpYXRlZCA9IE1hdGVyaWFsVmFyaWFudC5jcmVhdGUobWF0ZXJpYWwsIHRoaXMpO1xuICAgICAgICBpZiAoaW5zdGFudGlhdGVkICE9PSBtYXRlcmlhbCkge1xuICAgICAgICAgICAgdGhpcy5zZXRNYXRlcmlhbChpbmRleCwgaW5zdGFudGlhdGVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbnN0YW50aWF0ZWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0cyBhbGwgdGhlIG1hdGVyaWFscy5cbiAgICAgKiAhI3poIOiOt+WPluaJgOacieadkOi0qOOAglxuICAgICAqIEBtZXRob2QgZ2V0TWF0ZXJpYWxzXG4gICAgICogQHJldHVybiB7W01hdGVyaWFsVmFyaWFudF19XG4gICAgICovXG4gICAgZ2V0TWF0ZXJpYWxzICgpIHtcbiAgICAgICAgbGV0IG1hdGVyaWFscyA9IHRoaXMuX21hdGVyaWFscztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRlcmlhbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG1hdGVyaWFsc1tpXSA9IE1hdGVyaWFsVmFyaWFudC5jcmVhdGUobWF0ZXJpYWxzW2ldLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWF0ZXJpYWxzO1xuICAgIH0sXG4gICAgXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIG1hdGVyaWFsIGJ5IGluZGV4LlxuICAgICAqICEjemgg5qC55o2u5oyH5a6a57Si5byV6K6+572u5p2Q6LSoXG4gICAgICogQG1ldGhvZCBzZXRNYXRlcmlhbFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBcbiAgICAgKiBAcGFyYW0ge01hdGVyaWFsfSBtYXRlcmlhbFxuICAgICAqIEByZXR1cm4ge01hdGVyaWFsfVxuICAgICAqL1xuICAgIHNldE1hdGVyaWFsIChpbmRleCwgbWF0ZXJpYWwpIHtcbiAgICAgICAgaWYgKG1hdGVyaWFsICE9PSB0aGlzLl9tYXRlcmlhbHNbaW5kZXhdKSB7XG4gICAgICAgICAgICBtYXRlcmlhbCA9IE1hdGVyaWFsVmFyaWFudC5jcmVhdGUobWF0ZXJpYWwsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWxzW2luZGV4XSA9IG1hdGVyaWFsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VwZGF0ZU1hdGVyaWFsKCk7XG4gICAgICAgIHRoaXMubWFya0ZvclJlbmRlcih0cnVlKTtcbiAgICAgICAgcmV0dXJuIG1hdGVyaWFsO1xuICAgIH0sXG5cbiAgICBfZ2V0RGVmYXVsdE1hdGVyaWFsICgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGVyaWFsLmdldEJ1aWx0aW5NYXRlcmlhbCgnMmQtc3ByaXRlJyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEluaXQgbWF0ZXJpYWwuXG4gICAgICovXG4gICAgX2FjdGl2YXRlTWF0ZXJpYWwgKCkge1xuICAgICAgICBsZXQgbWF0ZXJpYWxzID0gdGhpcy5fbWF0ZXJpYWxzO1xuICAgICAgICBpZiAoIW1hdGVyaWFsc1swXSkge1xuICAgICAgICAgICAgbGV0IG1hdGVyaWFsID0gdGhpcy5fZ2V0RGVmYXVsdE1hdGVyaWFsKCk7XG4gICAgICAgICAgICBtYXRlcmlhbHNbMF0gPSBtYXRlcmlhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0ZXJpYWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBtYXRlcmlhbHNbaV0gPSBNYXRlcmlhbFZhcmlhbnQuY3JlYXRlKG1hdGVyaWFsc1tpXSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl91cGRhdGVNYXRlcmlhbCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgbWF0ZXJpYWwgcHJvcGVydGllcy5cbiAgICAgKi9cbiAgICBfdXBkYXRlTWF0ZXJpYWwgKCkge1xuXG4gICAgfSxcblxuICAgIF91cGRhdGVDb2xvciAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9hc3NlbWJsZXIudXBkYXRlQ29sb3IpIHtcbiAgICAgICAgICAgIGxldCBwcmVtdWx0aXBseSA9IHRoaXMuc3JjQmxlbmRGYWN0b3IgPT09IGNjLm1hY3JvLkJsZW5kRmFjdG9yLk9ORTtcbiAgICAgICAgICAgIHByZW11bHRpcGx5ICYmIENvbG9yLnByZW11bHRpcGx5QWxwaGEoX3RlbXBfY29sb3IsIHRoaXMubm9kZS5fY29sb3IpO1xuICAgICAgICAgICAgbGV0IGNvbG9yID0gcHJlbXVsdGlwbHkgPyBfdGVtcF9jb2xvci5fdmFsIDogbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2Fzc2VtYmxlci51cGRhdGVDb2xvcih0aGlzLCBjb2xvcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2NoZWNrQmFjdGggKHJlbmRlcmVyLCBjdWxsaW5nTWFzaykge1xuICAgICAgICBsZXQgbWF0ZXJpYWwgPSB0aGlzLl9tYXRlcmlhbHNbMF07XG4gICAgICAgIGlmICgobWF0ZXJpYWwgJiYgbWF0ZXJpYWwuZ2V0SGFzaCgpICE9PSByZW5kZXJlci5tYXRlcmlhbC5nZXRIYXNoKCkpIHx8IFxuICAgICAgICAgICAgcmVuZGVyZXIuY3VsbGluZ01hc2sgIT09IGN1bGxpbmdNYXNrKSB7XG4gICAgICAgICAgICByZW5kZXJlci5fZmx1c2goKTtcbiAgICBcbiAgICAgICAgICAgIHJlbmRlcmVyLm5vZGUgPSBtYXRlcmlhbC5nZXREZWZpbmUoJ0NDX1VTRV9NT0RFTCcpID8gdGhpcy5ub2RlIDogcmVuZGVyZXIuX2R1bW15Tm9kZTtcbiAgICAgICAgICAgIHJlbmRlcmVyLm1hdGVyaWFsID0gbWF0ZXJpYWw7XG4gICAgICAgICAgICByZW5kZXJlci5jdWxsaW5nTWFzayA9IGN1bGxpbmdNYXNrO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLlJlbmRlckNvbXBvbmVudCA9IG1vZHVsZS5leHBvcnRzID0gUmVuZGVyQ29tcG9uZW50O1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=