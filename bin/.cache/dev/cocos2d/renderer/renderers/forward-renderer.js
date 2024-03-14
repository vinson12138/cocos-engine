
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/renderers/forward-renderer.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _valueTypes = require("../../core/value-types");

var _baseRenderer = _interopRequireDefault(require("../core/base-renderer"));

var _enums = _interopRequireDefault(require("../enums"));

var _memop = require("../memop");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _a16_view = new Float32Array(16);

var _a16_view_inv = new Float32Array(16);

var _a16_proj = new Float32Array(16);

var _a16_viewProj = new Float32Array(16);

var _a4_camPos = new Float32Array(4);

var _a64_shadow_lightViewProj = new Float32Array(64);

var _a16_shadow_lightViewProjs = [];

var _a4_shadow_info = new Float32Array(4);

var _camPos = new _valueTypes.Vec4(0, 0, 0, 0);

var _camFwd = new _valueTypes.Vec3(0, 0, 0);

var _v3_tmp1 = new _valueTypes.Vec3(0, 0, 0);

var CC_MAX_LIGHTS = 4;
var CC_MAX_SHADOW_LIGHTS = 2;

var _float16_pool = new _memop.RecyclePool(function () {
  return new Float32Array(16);
}, 8);

function sortView(a, b) {
  return a._priority - b._priority;
}

var ForwardRenderer = /*#__PURE__*/function (_BaseRenderer) {
  _inheritsLoose(ForwardRenderer, _BaseRenderer);

  function ForwardRenderer(device, builtin) {
    var _this;

    _this = _BaseRenderer.call(this, device, builtin) || this;
    _this._time = new Float32Array(4);
    _this._lights = [];
    _this._shadowLights = [];
    _this._numLights = 0;
    _this._defines = {};

    _this._registerStage('shadowcast', _this._shadowStage.bind(_assertThisInitialized(_this)));

    _this._registerStage('opaque', _this._opaqueStage.bind(_assertThisInitialized(_this)));

    _this._registerStage('transparent', _this._transparentStage.bind(_assertThisInitialized(_this)));

    return _this;
  }

  var _proto = ForwardRenderer.prototype;

  _proto.reset = function reset() {
    _float16_pool.reset();

    _BaseRenderer.prototype.reset.call(this);
  };

  _proto.render = function render(scene, dt) {
    this.reset();

    if (!CC_EDITOR) {
      if (dt) {
        this._time[0] += dt;
        this._time[1] = dt;
        this._time[2]++;
      }

      this._device.setUniform('cc_time', this._time);
    }

    this._updateLights(scene);

    var canvas = this._device._gl.canvas;

    for (var i = 0; i < scene._cameras.length; ++i) {
      var view = this._requestView();

      var width = canvas.width;
      var height = canvas.height;
      var camera = scene._cameras.data[i];
      camera.extractView(view, width, height);
    } // render by cameras


    this._viewPools.sort(sortView);

    for (var _i = 0; _i < this._viewPools.length; ++_i) {
      var _view = this._viewPools.data[_i];

      this._render(_view, scene);
    }
  } // direct render a single camera
  ;

  _proto.renderCamera = function renderCamera(camera, scene) {
    this.reset();

    this._updateLights(scene);

    var canvas = this._device._gl.canvas;
    var width = canvas.width;
    var height = canvas.height;

    var view = this._requestView();

    camera.extractView(view, width, height); // render by cameras

    this._viewPools.sort(sortView);

    for (var i = 0; i < this._viewPools.length; ++i) {
      var _view2 = this._viewPools.data[i];

      this._render(_view2, scene);
    }
  };

  _proto._updateLights = function _updateLights(scene) {
    this._lights.length = 0;
    this._shadowLights.length = 0;
    var lights = scene._lights;

    for (var i = 0; i < lights.length; ++i) {
      var light = lights.data[i];
      light.update(this._device);

      if (light.shadowType !== _enums["default"].SHADOW_NONE) {
        if (this._shadowLights.length < CC_MAX_SHADOW_LIGHTS) {
          this._shadowLights.splice(0, 0, light);
        }

        var view = this._requestView();

        light.extractView(view, ['shadowcast']);

        this._lights.splice(0, 0, light);
      } else {
        this._lights.push(light);
      }
    }

    this._updateLightDefines();

    this._numLights = lights._count;
  };

  _proto._updateLightDefines = function _updateLightDefines() {
    var defines = this._defines;

    for (var i = 0; i < this._lights.length; ++i) {
      var light = this._lights[i];
      var lightKey = "CC_LIGHT_" + i + "_TYPE";
      var shadowKey = "CC_SHADOW_" + i + "_TYPE";

      if (defines[lightKey] !== light._type) {
        defines[lightKey] = light._type;
        this._definesChanged = true;
      }

      if (defines[shadowKey] !== light._shadowType) {
        defines[shadowKey] = light._shadowType;
        this._definesChanged = true;
      }
    }

    var newCount = Math.min(CC_MAX_LIGHTS, this._lights.length);

    if (defines.CC_NUM_LIGHTS !== newCount) {
      defines.CC_NUM_LIGHTS = newCount;
      this._definesChanged = true;
    }

    newCount = Math.min(CC_MAX_LIGHTS, this._shadowLights.length);

    if (defines.CC_NUM_SHADOW_LIGHTS !== newCount) {
      defines.CC_NUM_SHADOW_LIGHTS = newCount;
      this._definesChanged = true;
    }
  };

  _proto._submitLightsUniforms = function _submitLightsUniforms() {
    var device = this._device;

    if (this._lights.length > 0) {
      var positionAndRanges = _float16_pool.add();

      var directions = _float16_pool.add();

      var colors = _float16_pool.add();

      var lightNum = Math.min(CC_MAX_LIGHTS, this._lights.length);

      for (var i = 0; i < lightNum; ++i) {
        var light = this._lights[i];
        var index = i * 4;
        colors.set(light._colorUniform, index);
        directions.set(light._directionUniform, index);
        positionAndRanges.set(light._positionUniform, index);
        positionAndRanges[index + 3] = light._range;

        if (light._type === _enums["default"].LIGHT_SPOT) {
          directions[index + 3] = light._spotUniform[0];
          colors[index + 3] = light._spotUniform[1];
        } else {
          directions[index + 3] = 0;
          colors[index + 3] = 0;
        }
      }

      device.setUniform('cc_lightDirection', directions);
      device.setUniform('cc_lightColor', colors);
      device.setUniform('cc_lightPositionAndRange', positionAndRanges);
    }
  };

  _proto._submitShadowStageUniforms = function _submitShadowStageUniforms(view) {
    var light = view._shadowLight;
    var shadowInfo = _a4_shadow_info;
    shadowInfo[0] = light.shadowMinDepth;
    shadowInfo[1] = light.shadowMaxDepth;
    shadowInfo[2] = light.shadowDepthScale;
    shadowInfo[3] = light.shadowDarkness;

    this._device.setUniform('cc_shadow_map_lightViewProjMatrix', _valueTypes.Mat4.toArray(_a16_viewProj, view._matViewProj));

    this._device.setUniform('cc_shadow_map_info', shadowInfo);

    this._device.setUniform('cc_shadow_map_bias', light.shadowBias);

    this._defines.CC_SHADOW_TYPE = light._shadowType;
  };

  _proto._submitOtherStagesUniforms = function _submitOtherStagesUniforms() {
    var shadowInfo = _float16_pool.add();

    for (var i = 0; i < this._shadowLights.length; ++i) {
      var light = this._shadowLights[i];
      var view = _a16_shadow_lightViewProjs[i];

      if (!view) {
        view = _a16_shadow_lightViewProjs[i] = new Float32Array(_a64_shadow_lightViewProj.buffer, i * 64, 16);
      }

      _valueTypes.Mat4.toArray(view, light.viewProjMatrix);

      var index = i * 4;
      shadowInfo[index] = light.shadowMinDepth;
      shadowInfo[index + 1] = light.shadowMaxDepth;
      shadowInfo[index + 2] = light._shadowResolution;
      shadowInfo[index + 3] = light.shadowDarkness;
    }

    this._device.setUniform("cc_shadow_lightViewProjMatrix", _a64_shadow_lightViewProj);

    this._device.setUniform("cc_shadow_info", shadowInfo); // this._device.setUniform(`cc_frustumEdgeFalloff_${index}`, light.frustumEdgeFalloff);

  };

  _proto._sortItems = function _sortItems(items) {
    // sort items
    items.sort(function (a, b) {
      // if (a.layer !== b.layer) {
      //   return a.layer - b.layer;
      // }
      if (a.passes.length !== b.passes.length) {
        return a.passes.length - b.passes.length;
      }

      return a.sortKey - b.sortKey;
    });
  };

  _proto._shadowStage = function _shadowStage(view, items) {
    // update rendering
    this._submitShadowStageUniforms(view); // this._sortItems(items);
    // draw it


    for (var i = 0; i < items.length; ++i) {
      var item = items.data[i];

      if (item.effect.getDefine('CC_CASTING_SHADOW')) {
        this._draw(item);
      }
    }
  };

  _proto._drawItems = function _drawItems(view, items) {
    var shadowLights = this._shadowLights;

    if (shadowLights.length === 0 && this._numLights === 0) {
      for (var i = 0; i < items.length; ++i) {
        var item = items.data[i];

        this._draw(item);
      }
    } else {
      for (var _i2 = 0; _i2 < items.length; ++_i2) {
        var _item = items.data[_i2];

        for (var shadowIdx = 0; shadowIdx < shadowLights.length; ++shadowIdx) {
          this._device.setTexture('cc_shadow_map_' + shadowIdx, shadowLights[shadowIdx].shadowMap, this._allocTextureUnit());
        }

        this._draw(_item);
      }
    }
  };

  _proto._opaqueStage = function _opaqueStage(view, items) {
    view.getPosition(_camPos); // update uniforms

    this._device.setUniform('cc_matView', _valueTypes.Mat4.toArray(_a16_view, view._matView));

    this._device.setUniform('cc_matViewInv', _valueTypes.Mat4.toArray(_a16_view_inv, view._matViewInv));

    this._device.setUniform('cc_matProj', _valueTypes.Mat4.toArray(_a16_proj, view._matProj));

    this._device.setUniform('cc_matViewProj', _valueTypes.Mat4.toArray(_a16_viewProj, view._matViewProj));

    this._device.setUniform('cc_cameraPos', _valueTypes.Vec4.toArray(_a4_camPos, _camPos)); // update rendering


    this._submitLightsUniforms();

    this._submitOtherStagesUniforms();

    this._drawItems(view, items);
  };

  _proto._transparentStage = function _transparentStage(view, items) {
    view.getPosition(_camPos);
    view.getForward(_camFwd); // update uniforms

    this._device.setUniform('cc_matView', _valueTypes.Mat4.toArray(_a16_view, view._matView));

    this._device.setUniform('cc_matViewInv', _valueTypes.Mat4.toArray(_a16_view_inv, view._matViewInv));

    this._device.setUniform('cc_matProj', _valueTypes.Mat4.toArray(_a16_proj, view._matProj));

    this._device.setUniform('cc_matViewProj', _valueTypes.Mat4.toArray(_a16_viewProj, view._matViewProj));

    this._device.setUniform('cc_cameraPos', _valueTypes.Vec4.toArray(_a4_camPos, _camPos));

    this._submitLightsUniforms();

    this._submitOtherStagesUniforms(); // calculate zdist


    for (var i = 0; i < items.length; ++i) {
      var item = items.data[i]; // TODO: we should use mesh center instead!

      item.node.getWorldPosition(_v3_tmp1);

      _valueTypes.Vec3.sub(_v3_tmp1, _v3_tmp1, _camPos);

      item.sortKey = -_valueTypes.Vec3.dot(_v3_tmp1, _camFwd);
    }

    this._sortItems(items);

    this._drawItems(view, items);
  };

  return ForwardRenderer;
}(_baseRenderer["default"]);

exports["default"] = ForwardRenderer;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9yZW5kZXJlci9yZW5kZXJlcnMvZm9yd2FyZC1yZW5kZXJlci5qcyJdLCJuYW1lcyI6WyJfYTE2X3ZpZXciLCJGbG9hdDMyQXJyYXkiLCJfYTE2X3ZpZXdfaW52IiwiX2ExNl9wcm9qIiwiX2ExNl92aWV3UHJvaiIsIl9hNF9jYW1Qb3MiLCJfYTY0X3NoYWRvd19saWdodFZpZXdQcm9qIiwiX2ExNl9zaGFkb3dfbGlnaHRWaWV3UHJvanMiLCJfYTRfc2hhZG93X2luZm8iLCJfY2FtUG9zIiwiVmVjNCIsIl9jYW1Gd2QiLCJWZWMzIiwiX3YzX3RtcDEiLCJDQ19NQVhfTElHSFRTIiwiQ0NfTUFYX1NIQURPV19MSUdIVFMiLCJfZmxvYXQxNl9wb29sIiwiUmVjeWNsZVBvb2wiLCJzb3J0VmlldyIsImEiLCJiIiwiX3ByaW9yaXR5IiwiRm9yd2FyZFJlbmRlcmVyIiwiZGV2aWNlIiwiYnVpbHRpbiIsIl90aW1lIiwiX2xpZ2h0cyIsIl9zaGFkb3dMaWdodHMiLCJfbnVtTGlnaHRzIiwiX2RlZmluZXMiLCJfcmVnaXN0ZXJTdGFnZSIsIl9zaGFkb3dTdGFnZSIsImJpbmQiLCJfb3BhcXVlU3RhZ2UiLCJfdHJhbnNwYXJlbnRTdGFnZSIsInJlc2V0IiwicmVuZGVyIiwic2NlbmUiLCJkdCIsIkNDX0VESVRPUiIsIl9kZXZpY2UiLCJzZXRVbmlmb3JtIiwiX3VwZGF0ZUxpZ2h0cyIsImNhbnZhcyIsIl9nbCIsImkiLCJfY2FtZXJhcyIsImxlbmd0aCIsInZpZXciLCJfcmVxdWVzdFZpZXciLCJ3aWR0aCIsImhlaWdodCIsImNhbWVyYSIsImRhdGEiLCJleHRyYWN0VmlldyIsIl92aWV3UG9vbHMiLCJzb3J0IiwiX3JlbmRlciIsInJlbmRlckNhbWVyYSIsImxpZ2h0cyIsImxpZ2h0IiwidXBkYXRlIiwic2hhZG93VHlwZSIsImVudW1zIiwiU0hBRE9XX05PTkUiLCJzcGxpY2UiLCJwdXNoIiwiX3VwZGF0ZUxpZ2h0RGVmaW5lcyIsIl9jb3VudCIsImRlZmluZXMiLCJsaWdodEtleSIsInNoYWRvd0tleSIsIl90eXBlIiwiX2RlZmluZXNDaGFuZ2VkIiwiX3NoYWRvd1R5cGUiLCJuZXdDb3VudCIsIk1hdGgiLCJtaW4iLCJDQ19OVU1fTElHSFRTIiwiQ0NfTlVNX1NIQURPV19MSUdIVFMiLCJfc3VibWl0TGlnaHRzVW5pZm9ybXMiLCJwb3NpdGlvbkFuZFJhbmdlcyIsImFkZCIsImRpcmVjdGlvbnMiLCJjb2xvcnMiLCJsaWdodE51bSIsImluZGV4Iiwic2V0IiwiX2NvbG9yVW5pZm9ybSIsIl9kaXJlY3Rpb25Vbmlmb3JtIiwiX3Bvc2l0aW9uVW5pZm9ybSIsIl9yYW5nZSIsIkxJR0hUX1NQT1QiLCJfc3BvdFVuaWZvcm0iLCJfc3VibWl0U2hhZG93U3RhZ2VVbmlmb3JtcyIsIl9zaGFkb3dMaWdodCIsInNoYWRvd0luZm8iLCJzaGFkb3dNaW5EZXB0aCIsInNoYWRvd01heERlcHRoIiwic2hhZG93RGVwdGhTY2FsZSIsInNoYWRvd0RhcmtuZXNzIiwiTWF0NCIsInRvQXJyYXkiLCJfbWF0Vmlld1Byb2oiLCJzaGFkb3dCaWFzIiwiQ0NfU0hBRE9XX1RZUEUiLCJfc3VibWl0T3RoZXJTdGFnZXNVbmlmb3JtcyIsImJ1ZmZlciIsInZpZXdQcm9qTWF0cml4IiwiX3NoYWRvd1Jlc29sdXRpb24iLCJfc29ydEl0ZW1zIiwiaXRlbXMiLCJwYXNzZXMiLCJzb3J0S2V5IiwiaXRlbSIsImVmZmVjdCIsImdldERlZmluZSIsIl9kcmF3IiwiX2RyYXdJdGVtcyIsInNoYWRvd0xpZ2h0cyIsInNoYWRvd0lkeCIsInNldFRleHR1cmUiLCJzaGFkb3dNYXAiLCJfYWxsb2NUZXh0dXJlVW5pdCIsImdldFBvc2l0aW9uIiwiX21hdFZpZXciLCJfbWF0Vmlld0ludiIsIl9tYXRQcm9qIiwiZ2V0Rm9yd2FyZCIsIm5vZGUiLCJnZXRXb3JsZFBvc2l0aW9uIiwic3ViIiwiZG90IiwiQmFzZVJlbmRlcmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7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LElBQUksR0FBR0gsS0FBSyxDQUFDMUQsSUFBTixDQUFXUixDQUFYLENBQVgsQ0FEcUMsQ0FHckM7O0FBQ0FxRSxNQUFBQSxJQUFJLENBQUNlLElBQUwsQ0FBVUMsZ0JBQVYsQ0FBMkJySCxRQUEzQjs7QUFFQUQsdUJBQUt1SCxHQUFMLENBQVN0SCxRQUFULEVBQW1CQSxRQUFuQixFQUE2QkosT0FBN0I7O0FBQ0F5RyxNQUFBQSxJQUFJLENBQUNELE9BQUwsR0FBZSxDQUFDckcsaUJBQUt3SCxHQUFMLENBQVN2SCxRQUFULEVBQW1CRixPQUFuQixDQUFoQjtBQUNEOztBQUVELFNBQUttRyxVQUFMLENBQWdCQyxLQUFoQjs7QUFDQSxTQUFLTyxVQUFMLENBQWdCdEUsSUFBaEIsRUFBc0IrRCxLQUF0QjtBQUNEOzs7RUE5UzBDc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuaW1wb3J0IHsgVmVjMywgVmVjNCwgTWF0NCB9IGZyb20gJy4uLy4uL2NvcmUvdmFsdWUtdHlwZXMnO1xuaW1wb3J0IEJhc2VSZW5kZXJlciBmcm9tICcuLi9jb3JlL2Jhc2UtcmVuZGVyZXInO1xuaW1wb3J0IGVudW1zIGZyb20gJy4uL2VudW1zJztcbmltcG9ydCB7IFJlY3ljbGVQb29sIH0gZnJvbSAnLi4vbWVtb3AnO1xuXG5sZXQgX2ExNl92aWV3ID0gbmV3IEZsb2F0MzJBcnJheSgxNik7XG5sZXQgX2ExNl92aWV3X2ludiA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpO1xubGV0IF9hMTZfcHJvaiA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpO1xubGV0IF9hMTZfdmlld1Byb2ogPSBuZXcgRmxvYXQzMkFycmF5KDE2KTtcbmxldCBfYTRfY2FtUG9zID0gbmV3IEZsb2F0MzJBcnJheSg0KTtcblxubGV0IF9hNjRfc2hhZG93X2xpZ2h0Vmlld1Byb2ogPSBuZXcgRmxvYXQzMkFycmF5KDY0KTtcbmxldCBfYTE2X3NoYWRvd19saWdodFZpZXdQcm9qcyA9IFtdO1xubGV0IF9hNF9zaGFkb3dfaW5mbyA9IG5ldyBGbG9hdDMyQXJyYXkoNCk7XG5cbmxldCBfY2FtUG9zID0gbmV3IFZlYzQoMCwgMCwgMCwgMCk7XG5sZXQgX2NhbUZ3ZCA9IG5ldyBWZWMzKDAsIDAsIDApO1xubGV0IF92M190bXAxID0gbmV3IFZlYzMoMCwgMCwgMCk7XG5cbmNvbnN0IENDX01BWF9MSUdIVFMgPSA0O1xuY29uc3QgQ0NfTUFYX1NIQURPV19MSUdIVFMgPSAyO1xuXG5sZXQgX2Zsb2F0MTZfcG9vbCA9IG5ldyBSZWN5Y2xlUG9vbCgoKSA9PiB7XG4gIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KDE2KTtcbn0sIDgpO1xuXG5mdW5jdGlvbiBzb3J0VmlldyAoYSwgYikge1xuICByZXR1cm4gKGEuX3ByaW9yaXR5IC0gYi5fcHJpb3JpdHkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGb3J3YXJkUmVuZGVyZXIgZXh0ZW5kcyBCYXNlUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihkZXZpY2UsIGJ1aWx0aW4pIHtcbiAgICBzdXBlcihkZXZpY2UsIGJ1aWx0aW4pO1xuXG4gICAgdGhpcy5fdGltZSA9IG5ldyBGbG9hdDMyQXJyYXkoNCk7XG5cbiAgICB0aGlzLl9saWdodHMgPSBbXTtcbiAgICB0aGlzLl9zaGFkb3dMaWdodHMgPSBbXTtcblxuICAgIHRoaXMuX251bUxpZ2h0cyA9IDA7XG5cbiAgICB0aGlzLl9kZWZpbmVzID0ge1xuICAgIH07XG5cbiAgICB0aGlzLl9yZWdpc3RlclN0YWdlKCdzaGFkb3djYXN0JywgdGhpcy5fc2hhZG93U3RhZ2UuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fcmVnaXN0ZXJTdGFnZSgnb3BhcXVlJywgdGhpcy5fb3BhcXVlU3RhZ2UuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fcmVnaXN0ZXJTdGFnZSgndHJhbnNwYXJlbnQnLCB0aGlzLl90cmFuc3BhcmVudFN0YWdlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgcmVzZXQgKCkge1xuICAgIF9mbG9hdDE2X3Bvb2wucmVzZXQoKTtcbiAgICBzdXBlci5yZXNldCgpO1xuICB9XG5cbiAgcmVuZGVyIChzY2VuZSwgZHQpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICBpZiAoIUNDX0VESVRPUikge1xuICAgICAgaWYgKGR0KSB7XG4gICAgICAgIHRoaXMuX3RpbWVbMF0gKz0gZHQ7XG4gICAgICAgIHRoaXMuX3RpbWVbMV0gPSBkdDtcbiAgICAgICAgdGhpcy5fdGltZVsyXSArKztcbiAgICAgIH1cbiAgICAgIHRoaXMuX2RldmljZS5zZXRVbmlmb3JtKCdjY190aW1lJywgdGhpcy5fdGltZSk7XG4gICAgfVxuXG4gICAgdGhpcy5fdXBkYXRlTGlnaHRzKHNjZW5lKTtcblxuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuX2RldmljZS5fZ2wuY2FudmFzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2NlbmUuX2NhbWVyYXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGxldCB2aWV3ID0gdGhpcy5fcmVxdWVzdFZpZXcoKTtcbiAgICAgIGxldCB3aWR0aCA9IGNhbnZhcy53aWR0aDtcbiAgICAgIGxldCBoZWlnaHQgPSBjYW52YXMuaGVpZ2h0O1xuICAgICAgbGV0IGNhbWVyYSA9IHNjZW5lLl9jYW1lcmFzLmRhdGFbaV07XG4gICAgICBjYW1lcmEuZXh0cmFjdFZpZXcodmlldywgd2lkdGgsIGhlaWdodCk7XG4gICAgfVxuXG4gICAgLy8gcmVuZGVyIGJ5IGNhbWVyYXNcbiAgICB0aGlzLl92aWV3UG9vbHMuc29ydChzb3J0Vmlldyk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3ZpZXdQb29scy5sZW5ndGg7ICsraSkge1xuICAgICAgbGV0IHZpZXcgPSB0aGlzLl92aWV3UG9vbHMuZGF0YVtpXTtcbiAgICAgIHRoaXMuX3JlbmRlcih2aWV3LCBzY2VuZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gZGlyZWN0IHJlbmRlciBhIHNpbmdsZSBjYW1lcmFcbiAgcmVuZGVyQ2FtZXJhIChjYW1lcmEsIHNjZW5lKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuXG4gICAgdGhpcy5fdXBkYXRlTGlnaHRzKHNjZW5lKTtcblxuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuX2RldmljZS5fZ2wuY2FudmFzO1xuICAgIGxldCB3aWR0aCA9IGNhbnZhcy53aWR0aDtcbiAgICBsZXQgaGVpZ2h0ID0gY2FudmFzLmhlaWdodDtcblxuICAgIGxldCB2aWV3ID0gdGhpcy5fcmVxdWVzdFZpZXcoKTtcbiAgICBjYW1lcmEuZXh0cmFjdFZpZXcodmlldywgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAvLyByZW5kZXIgYnkgY2FtZXJhc1xuICAgIHRoaXMuX3ZpZXdQb29scy5zb3J0KHNvcnRWaWV3KTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdmlld1Bvb2xzLmxlbmd0aDsgKytpKSB7XG4gICAgICBsZXQgdmlldyA9IHRoaXMuX3ZpZXdQb29scy5kYXRhW2ldO1xuICAgICAgdGhpcy5fcmVuZGVyKHZpZXcsIHNjZW5lKTtcbiAgICB9XG4gIH1cblxuICBfdXBkYXRlTGlnaHRzIChzY2VuZSkge1xuICAgIHRoaXMuX2xpZ2h0cy5sZW5ndGggPSAwO1xuICAgIHRoaXMuX3NoYWRvd0xpZ2h0cy5sZW5ndGggPSAwO1xuXG4gICAgbGV0IGxpZ2h0cyA9IHNjZW5lLl9saWdodHM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaWdodHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGxldCBsaWdodCA9IGxpZ2h0cy5kYXRhW2ldO1xuICAgICAgbGlnaHQudXBkYXRlKHRoaXMuX2RldmljZSk7XG5cbiAgICAgIGlmIChsaWdodC5zaGFkb3dUeXBlICE9PSBlbnVtcy5TSEFET1dfTk9ORSkge1xuICAgICAgICBpZiAodGhpcy5fc2hhZG93TGlnaHRzLmxlbmd0aCA8IENDX01BWF9TSEFET1dfTElHSFRTKSB7XG4gICAgICAgICAgdGhpcy5fc2hhZG93TGlnaHRzLnNwbGljZSgwLCAwLCBsaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHZpZXcgPSB0aGlzLl9yZXF1ZXN0VmlldygpO1xuICAgICAgICBsaWdodC5leHRyYWN0Vmlldyh2aWV3LCBbJ3NoYWRvd2Nhc3QnXSk7XG5cbiAgICAgICAgdGhpcy5fbGlnaHRzLnNwbGljZSgwLCAwLCBsaWdodCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5fbGlnaHRzLnB1c2gobGlnaHQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZUxpZ2h0RGVmaW5lcygpO1xuICAgIHRoaXMuX251bUxpZ2h0cyA9IGxpZ2h0cy5fY291bnQ7XG4gIH1cblxuICBfdXBkYXRlTGlnaHREZWZpbmVzICgpIHtcbiAgICBsZXQgZGVmaW5lcyA9IHRoaXMuX2RlZmluZXM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2xpZ2h0cy5sZW5ndGg7ICsraSkge1xuICAgICAgbGV0IGxpZ2h0ID0gdGhpcy5fbGlnaHRzW2ldO1xuICAgICAgbGV0IGxpZ2h0S2V5ID0gYENDX0xJR0hUXyR7aX1fVFlQRWA7XG4gICAgICBsZXQgc2hhZG93S2V5ID0gYENDX1NIQURPV18ke2l9X1RZUEVgO1xuICAgICAgaWYgKGRlZmluZXNbbGlnaHRLZXldICE9PSBsaWdodC5fdHlwZSl7XG4gICAgICAgIGRlZmluZXNbbGlnaHRLZXldID0gbGlnaHQuX3R5cGU7XG4gICAgICAgIHRoaXMuX2RlZmluZXNDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChkZWZpbmVzW3NoYWRvd0tleV0gIT09IGxpZ2h0Ll9zaGFkb3dUeXBlKXtcbiAgICAgICAgZGVmaW5lc1tzaGFkb3dLZXldID0gbGlnaHQuX3NoYWRvd1R5cGU7XG4gICAgICAgIHRoaXMuX2RlZmluZXNDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgbmV3Q291bnQgPSBNYXRoLm1pbihDQ19NQVhfTElHSFRTLCB0aGlzLl9saWdodHMubGVuZ3RoKTtcbiAgICBpZiAoZGVmaW5lcy5DQ19OVU1fTElHSFRTICE9PSBuZXdDb3VudCkge1xuICAgICAgZGVmaW5lcy5DQ19OVU1fTElHSFRTID0gbmV3Q291bnQ7XG4gICAgICB0aGlzLl9kZWZpbmVzQ2hhbmdlZCA9IHRydWU7XG4gICAgfVxuICAgIG5ld0NvdW50ID0gTWF0aC5taW4oQ0NfTUFYX0xJR0hUUywgdGhpcy5fc2hhZG93TGlnaHRzLmxlbmd0aCk7XG4gICAgaWYgKGRlZmluZXMuQ0NfTlVNX1NIQURPV19MSUdIVFMgIT09IG5ld0NvdW50KSB7XG4gICAgICBkZWZpbmVzLkNDX05VTV9TSEFET1dfTElHSFRTID0gbmV3Q291bnQ7XG4gICAgICB0aGlzLl9kZWZpbmVzQ2hhbmdlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgX3N1Ym1pdExpZ2h0c1VuaWZvcm1zICgpIHtcbiAgICBsZXQgZGV2aWNlID0gdGhpcy5fZGV2aWNlO1xuXG4gICAgaWYgKHRoaXMuX2xpZ2h0cy5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgcG9zaXRpb25BbmRSYW5nZXMgPSBfZmxvYXQxNl9wb29sLmFkZCgpO1xuICAgICAgbGV0IGRpcmVjdGlvbnMgPSBfZmxvYXQxNl9wb29sLmFkZCgpO1xuICAgICAgbGV0IGNvbG9ycyA9IF9mbG9hdDE2X3Bvb2wuYWRkKCk7XG4gICAgICBsZXQgbGlnaHROdW0gPSBNYXRoLm1pbihDQ19NQVhfTElHSFRTLCB0aGlzLl9saWdodHMubGVuZ3RoKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlnaHROdW07ICsraSkge1xuICAgICAgICBsZXQgbGlnaHQgPSB0aGlzLl9saWdodHNbaV07XG4gICAgICAgIGxldCBpbmRleCA9IGkgKiA0O1xuXG4gICAgICAgIGNvbG9ycy5zZXQobGlnaHQuX2NvbG9yVW5pZm9ybSwgaW5kZXgpO1xuICAgICAgICBkaXJlY3Rpb25zLnNldChsaWdodC5fZGlyZWN0aW9uVW5pZm9ybSwgaW5kZXgpO1xuICAgICAgICBwb3NpdGlvbkFuZFJhbmdlcy5zZXQobGlnaHQuX3Bvc2l0aW9uVW5pZm9ybSwgaW5kZXgpO1xuICAgICAgICBwb3NpdGlvbkFuZFJhbmdlc1tpbmRleCszXSA9IGxpZ2h0Ll9yYW5nZTtcblxuICAgICAgICBpZiAobGlnaHQuX3R5cGUgPT09IGVudW1zLkxJR0hUX1NQT1QpIHtcbiAgICAgICAgICBkaXJlY3Rpb25zW2luZGV4KzNdID0gbGlnaHQuX3Nwb3RVbmlmb3JtWzBdO1xuICAgICAgICAgIGNvbG9yc1tpbmRleCszXSA9IGxpZ2h0Ll9zcG90VW5pZm9ybVsxXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBkaXJlY3Rpb25zW2luZGV4KzNdID0gMDtcbiAgICAgICAgICBjb2xvcnNbaW5kZXgrM10gPSAwO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGRldmljZS5zZXRVbmlmb3JtKCdjY19saWdodERpcmVjdGlvbicsIGRpcmVjdGlvbnMpO1xuICAgICAgZGV2aWNlLnNldFVuaWZvcm0oJ2NjX2xpZ2h0Q29sb3InLCBjb2xvcnMpO1xuICAgICAgZGV2aWNlLnNldFVuaWZvcm0oJ2NjX2xpZ2h0UG9zaXRpb25BbmRSYW5nZScsIHBvc2l0aW9uQW5kUmFuZ2VzKTtcbiAgICB9XG4gIH1cblxuICBfc3VibWl0U2hhZG93U3RhZ2VVbmlmb3Jtcyh2aWV3KSB7XG5cbiAgICBsZXQgbGlnaHQgPSB2aWV3Ll9zaGFkb3dMaWdodDtcblxuICAgIGxldCBzaGFkb3dJbmZvID0gX2E0X3NoYWRvd19pbmZvO1xuICAgIHNoYWRvd0luZm9bMF0gPSBsaWdodC5zaGFkb3dNaW5EZXB0aDtcbiAgICBzaGFkb3dJbmZvWzFdID0gbGlnaHQuc2hhZG93TWF4RGVwdGg7XG4gICAgc2hhZG93SW5mb1syXSA9IGxpZ2h0LnNoYWRvd0RlcHRoU2NhbGU7XG4gICAgc2hhZG93SW5mb1szXSA9IGxpZ2h0LnNoYWRvd0RhcmtuZXNzO1xuXG4gICAgdGhpcy5fZGV2aWNlLnNldFVuaWZvcm0oJ2NjX3NoYWRvd19tYXBfbGlnaHRWaWV3UHJvak1hdHJpeCcsIE1hdDQudG9BcnJheShfYTE2X3ZpZXdQcm9qLCB2aWV3Ll9tYXRWaWV3UHJvaikpO1xuICAgIHRoaXMuX2RldmljZS5zZXRVbmlmb3JtKCdjY19zaGFkb3dfbWFwX2luZm8nLCBzaGFkb3dJbmZvKTtcbiAgICB0aGlzLl9kZXZpY2Uuc2V0VW5pZm9ybSgnY2Nfc2hhZG93X21hcF9iaWFzJywgbGlnaHQuc2hhZG93Qmlhcyk7XG5cbiAgICB0aGlzLl9kZWZpbmVzLkNDX1NIQURPV19UWVBFID0gbGlnaHQuX3NoYWRvd1R5cGU7XG4gIH1cblxuICBfc3VibWl0T3RoZXJTdGFnZXNVbmlmb3JtcygpIHtcbiAgICBsZXQgc2hhZG93SW5mbyA9IF9mbG9hdDE2X3Bvb2wuYWRkKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3NoYWRvd0xpZ2h0cy5sZW5ndGg7ICsraSkge1xuICAgICAgbGV0IGxpZ2h0ID0gdGhpcy5fc2hhZG93TGlnaHRzW2ldO1xuICAgICAgbGV0IHZpZXcgPSBfYTE2X3NoYWRvd19saWdodFZpZXdQcm9qc1tpXTtcbiAgICAgIGlmICghdmlldykge1xuICAgICAgICB2aWV3ID0gX2ExNl9zaGFkb3dfbGlnaHRWaWV3UHJvanNbaV0gPSBuZXcgRmxvYXQzMkFycmF5KF9hNjRfc2hhZG93X2xpZ2h0Vmlld1Byb2ouYnVmZmVyLCBpICogNjQsIDE2KTtcbiAgICAgIH1cbiAgICAgIE1hdDQudG9BcnJheSh2aWV3LCBsaWdodC52aWV3UHJvak1hdHJpeCk7XG5cbiAgICAgIGxldCBpbmRleCA9IGkqNDtcbiAgICAgIHNoYWRvd0luZm9baW5kZXhdID0gbGlnaHQuc2hhZG93TWluRGVwdGg7XG4gICAgICBzaGFkb3dJbmZvW2luZGV4KzFdID0gbGlnaHQuc2hhZG93TWF4RGVwdGg7XG4gICAgICBzaGFkb3dJbmZvW2luZGV4KzJdID0gbGlnaHQuX3NoYWRvd1Jlc29sdXRpb247XG4gICAgICBzaGFkb3dJbmZvW2luZGV4KzNdID0gbGlnaHQuc2hhZG93RGFya25lc3M7XG4gICAgfVxuXG4gICAgdGhpcy5fZGV2aWNlLnNldFVuaWZvcm0oYGNjX3NoYWRvd19saWdodFZpZXdQcm9qTWF0cml4YCwgX2E2NF9zaGFkb3dfbGlnaHRWaWV3UHJvaik7XG4gICAgdGhpcy5fZGV2aWNlLnNldFVuaWZvcm0oYGNjX3NoYWRvd19pbmZvYCwgc2hhZG93SW5mbyk7XG4gICAgLy8gdGhpcy5fZGV2aWNlLnNldFVuaWZvcm0oYGNjX2ZydXN0dW1FZGdlRmFsbG9mZl8ke2luZGV4fWAsIGxpZ2h0LmZydXN0dW1FZGdlRmFsbG9mZik7XG4gIH1cblxuICBfc29ydEl0ZW1zIChpdGVtcykge1xuICAgIC8vIHNvcnQgaXRlbXNcbiAgICBpdGVtcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAvLyBpZiAoYS5sYXllciAhPT0gYi5sYXllcikge1xuICAgICAgLy8gICByZXR1cm4gYS5sYXllciAtIGIubGF5ZXI7XG4gICAgICAvLyB9XG5cbiAgICAgIGlmIChhLnBhc3Nlcy5sZW5ndGggIT09IGIucGFzc2VzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gYS5wYXNzZXMubGVuZ3RoIC0gYi5wYXNzZXMubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYS5zb3J0S2V5IC0gYi5zb3J0S2V5O1xuICAgIH0pO1xuICB9XG5cbiAgX3NoYWRvd1N0YWdlICh2aWV3LCBpdGVtcykge1xuICAgIC8vIHVwZGF0ZSByZW5kZXJpbmdcbiAgICB0aGlzLl9zdWJtaXRTaGFkb3dTdGFnZVVuaWZvcm1zKHZpZXcpO1xuXG4gICAgLy8gdGhpcy5fc29ydEl0ZW1zKGl0ZW1zKTtcblxuICAgIC8vIGRyYXcgaXRcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgKytpKSB7XG4gICAgICBsZXQgaXRlbSA9IGl0ZW1zLmRhdGFbaV07XG4gICAgICBpZiAoaXRlbS5lZmZlY3QuZ2V0RGVmaW5lKCdDQ19DQVNUSU5HX1NIQURPVycpKSB7XG4gICAgICAgIHRoaXMuX2RyYXcoaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2RyYXdJdGVtcyAodmlldywgaXRlbXMpIHtcbiAgICBsZXQgc2hhZG93TGlnaHRzID0gdGhpcy5fc2hhZG93TGlnaHRzO1xuICAgIGlmIChzaGFkb3dMaWdodHMubGVuZ3RoID09PSAwICYmIHRoaXMuX251bUxpZ2h0cyA9PT0gMCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7ICsraSkge1xuICAgICAgICBsZXQgaXRlbSA9IGl0ZW1zLmRhdGFbaV07XG4gICAgICAgIHRoaXMuX2RyYXcoaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7ICsraSkge1xuICAgICAgICBsZXQgaXRlbSA9IGl0ZW1zLmRhdGFbaV07XG5cbiAgICAgICAgZm9yIChsZXQgc2hhZG93SWR4ID0gMDsgc2hhZG93SWR4IDwgc2hhZG93TGlnaHRzLmxlbmd0aDsgKytzaGFkb3dJZHgpIHtcbiAgICAgICAgICB0aGlzLl9kZXZpY2Uuc2V0VGV4dHVyZSgnY2Nfc2hhZG93X21hcF8nK3NoYWRvd0lkeCwgc2hhZG93TGlnaHRzW3NoYWRvd0lkeF0uc2hhZG93TWFwLCB0aGlzLl9hbGxvY1RleHR1cmVVbml0KCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZHJhdyhpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfb3BhcXVlU3RhZ2UgKHZpZXcsIGl0ZW1zKSB7XG4gICAgdmlldy5nZXRQb3NpdGlvbihfY2FtUG9zKTtcblxuICAgIC8vIHVwZGF0ZSB1bmlmb3Jtc1xuICAgIHRoaXMuX2RldmljZS5zZXRVbmlmb3JtKCdjY19tYXRWaWV3JywgTWF0NC50b0FycmF5KF9hMTZfdmlldywgdmlldy5fbWF0VmlldykpO1xuICAgIHRoaXMuX2RldmljZS5zZXRVbmlmb3JtKCdjY19tYXRWaWV3SW52JywgTWF0NC50b0FycmF5KF9hMTZfdmlld19pbnYsIHZpZXcuX21hdFZpZXdJbnYpKTtcbiAgICB0aGlzLl9kZXZpY2Uuc2V0VW5pZm9ybSgnY2NfbWF0UHJvaicsIE1hdDQudG9BcnJheShfYTE2X3Byb2osIHZpZXcuX21hdFByb2opKTtcbiAgICB0aGlzLl9kZXZpY2Uuc2V0VW5pZm9ybSgnY2NfbWF0Vmlld1Byb2onLCBNYXQ0LnRvQXJyYXkoX2ExNl92aWV3UHJvaiwgdmlldy5fbWF0Vmlld1Byb2opKTtcbiAgICB0aGlzLl9kZXZpY2Uuc2V0VW5pZm9ybSgnY2NfY2FtZXJhUG9zJywgVmVjNC50b0FycmF5KF9hNF9jYW1Qb3MsIF9jYW1Qb3MpKTtcblxuICAgIC8vIHVwZGF0ZSByZW5kZXJpbmdcbiAgICB0aGlzLl9zdWJtaXRMaWdodHNVbmlmb3JtcygpO1xuICAgIHRoaXMuX3N1Ym1pdE90aGVyU3RhZ2VzVW5pZm9ybXMoKTtcblxuICAgIHRoaXMuX2RyYXdJdGVtcyh2aWV3LCBpdGVtcyk7XG4gIH1cblxuICBfdHJhbnNwYXJlbnRTdGFnZSAodmlldywgaXRlbXMpIHtcbiAgICB2aWV3LmdldFBvc2l0aW9uKF9jYW1Qb3MpO1xuICAgIHZpZXcuZ2V0Rm9yd2FyZChfY2FtRndkKTtcblxuICAgIC8vIHVwZGF0ZSB1bmlmb3Jtc1xuICAgIHRoaXMuX2RldmljZS5zZXRVbmlmb3JtKCdjY19tYXRWaWV3JywgTWF0NC50b0FycmF5KF9hMTZfdmlldywgdmlldy5fbWF0VmlldykpO1xuICAgIHRoaXMuX2RldmljZS5zZXRVbmlmb3JtKCdjY19tYXRWaWV3SW52JywgTWF0NC50b0FycmF5KF9hMTZfdmlld19pbnYsIHZpZXcuX21hdFZpZXdJbnYpKTtcbiAgICB0aGlzLl9kZXZpY2Uuc2V0VW5pZm9ybSgnY2NfbWF0UHJvaicsIE1hdDQudG9BcnJheShfYTE2X3Byb2osIHZpZXcuX21hdFByb2opKTtcbiAgICB0aGlzLl9kZXZpY2Uuc2V0VW5pZm9ybSgnY2NfbWF0Vmlld1Byb2onLCBNYXQ0LnRvQXJyYXkoX2ExNl92aWV3UHJvaiwgdmlldy5fbWF0Vmlld1Byb2opKTtcbiAgICB0aGlzLl9kZXZpY2Uuc2V0VW5pZm9ybSgnY2NfY2FtZXJhUG9zJywgVmVjNC50b0FycmF5KF9hNF9jYW1Qb3MsIF9jYW1Qb3MpKTtcblxuICAgIHRoaXMuX3N1Ym1pdExpZ2h0c1VuaWZvcm1zKCk7XG4gICAgdGhpcy5fc3VibWl0T3RoZXJTdGFnZXNVbmlmb3JtcygpO1xuXG4gICAgLy8gY2FsY3VsYXRlIHpkaXN0XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7ICsraSkge1xuICAgICAgbGV0IGl0ZW0gPSBpdGVtcy5kYXRhW2ldO1xuXG4gICAgICAvLyBUT0RPOiB3ZSBzaG91bGQgdXNlIG1lc2ggY2VudGVyIGluc3RlYWQhXG4gICAgICBpdGVtLm5vZGUuZ2V0V29ybGRQb3NpdGlvbihfdjNfdG1wMSk7XG5cbiAgICAgIFZlYzMuc3ViKF92M190bXAxLCBfdjNfdG1wMSwgX2NhbVBvcyk7XG4gICAgICBpdGVtLnNvcnRLZXkgPSAtVmVjMy5kb3QoX3YzX3RtcDEsIF9jYW1Gd2QpO1xuICAgIH1cblxuICAgIHRoaXMuX3NvcnRJdGVtcyhpdGVtcyk7XG4gICAgdGhpcy5fZHJhd0l0ZW1zKHZpZXcsIGl0ZW1zKTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvIn0=