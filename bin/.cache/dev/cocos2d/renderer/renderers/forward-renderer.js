
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
    _this._defines = {}; // this._registerStage('shadowcast', this._shadowStage.bind(this));

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
    } // this._updateLights(scene);


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

      var _device = this._device;

      _device.setUniform('cc_lightDirection', directions);

      _device.setUniform('cc_lightColor', colors);

      _device.setUniform('cc_lightPositionAndRange', positionAndRanges);
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

    var shadowLights = this._shadowLights;

    for (var i = 0, len = shadowLights.length; i < len; ++i) {
      var light = shadowLights[i];
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
    // let shadowLights = this._shadowLights;
    // if (shadowLights.length === 0 && this._numLights === 0) {
    for (var i = 0, len = items.length; i < len; ++i) {
      var item = items.data[i];

      this._draw(item);
    } // }
    // else {
    //   for (let i = 0, len = items.length; i < len; ++i) {
    //     let item = items.data[i];
    //     for (let shadowIdx = 0; shadowIdx < shadowLights.length; ++shadowIdx) {
    //       this._device.setTexture('cc_shadow_map_' + shadowIdx, shadowLights[shadowIdx].shadowMap, this._allocTextureUnit());
    //     }
    //     this._draw(item);
    //   }
    // }

  };

  _proto._opaqueStage = function _opaqueStage(view, items) {
    view.getPosition(_camPos); // update uniforms

    var device = this._device;
    device.setUniform('cc_matView', _valueTypes.Mat4.toArray(_a16_view, view._matView));
    device.setUniform('cc_matViewInv', _valueTypes.Mat4.toArray(_a16_view_inv, view._matViewInv));
    device.setUniform('cc_matProj', _valueTypes.Mat4.toArray(_a16_proj, view._matProj));
    device.setUniform('cc_matViewProj', _valueTypes.Mat4.toArray(_a16_viewProj, view._matViewProj));
    device.setUniform('cc_cameraPos', _valueTypes.Vec4.toArray(_a4_camPos, _camPos)); // update rendering
    // this._submitLightsUniforms();
    // this._submitOtherStagesUniforms();

    this._drawItems(view, items);
  };

  _proto._transparentStage = function _transparentStage(view, items) {
    view.getPosition(_camPos);
    view.getForward(_camFwd); // update uniforms

    var device = this._device;
    device.setUniform('cc_matView', _valueTypes.Mat4.toArray(_a16_view, view._matView));
    device.setUniform('cc_matViewInv', _valueTypes.Mat4.toArray(_a16_view_inv, view._matViewInv));
    device.setUniform('cc_matProj', _valueTypes.Mat4.toArray(_a16_proj, view._matProj));
    device.setUniform('cc_matViewProj', _valueTypes.Mat4.toArray(_a16_viewProj, view._matViewProj));
    device.setUniform('cc_cameraPos', _valueTypes.Vec4.toArray(_a4_camPos, _camPos)); // this._submitLightsUniforms();
    // this._submitOtherStagesUniforms();
    // calculate zdist

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9yZW5kZXJlci9yZW5kZXJlcnMvZm9yd2FyZC1yZW5kZXJlci5qcyJdLCJuYW1lcyI6WyJfYTE2X3ZpZXciLCJGbG9hdDMyQXJyYXkiLCJfYTE2X3ZpZXdfaW52IiwiX2ExNl9wcm9qIiwiX2ExNl92aWV3UHJvaiIsIl9hNF9jYW1Qb3MiLCJfYTY0X3NoYWRvd19saWdodFZpZXdQcm9qIiwiX2ExNl9zaGFkb3dfbGlnaHRWaWV3UHJvanMiLCJfYTRfc2hhZG93X2luZm8iLCJfY2FtUG9zIiwiVmVjNCIsIl9jYW1Gd2QiLCJWZWMzIiwiX3YzX3RtcDEiLCJDQ19NQVhfTElHSFRTIiwiQ0NfTUFYX1NIQURPV19MSUdIVFMiLCJfZmxvYXQxNl9wb29sIiwiUmVjeWNsZVBvb2wiLCJzb3J0VmlldyIsImEiLCJiIiwiX3ByaW9yaXR5IiwiRm9yd2FyZFJlbmRlcmVyIiwiZGV2aWNlIiwiYnVpbHRpbiIsIl90aW1lIiwiX2xpZ2h0cyIsIl9zaGFkb3dMaWdodHMiLCJfbnVtTGlnaHRzIiwiX2RlZmluZXMiLCJfcmVnaXN0ZXJTdGFnZSIsIl9vcGFxdWVTdGFnZSIsImJpbmQiLCJfdHJhbnNwYXJlbnRTdGFnZSIsInJlc2V0IiwicmVuZGVyIiwic2NlbmUiLCJkdCIsIkNDX0VESVRPUiIsIl9kZXZpY2UiLCJzZXRVbmlmb3JtIiwiY2FudmFzIiwiX2dsIiwiaSIsIl9jYW1lcmFzIiwibGVuZ3RoIiwidmlldyIsIl9yZXF1ZXN0VmlldyIsIndpZHRoIiwiaGVpZ2h0IiwiY2FtZXJhIiwiZGF0YSIsImV4dHJhY3RWaWV3IiwiX3ZpZXdQb29scyIsInNvcnQiLCJfcmVuZGVyIiwicmVuZGVyQ2FtZXJhIiwiX3VwZGF0ZUxpZ2h0cyIsImxpZ2h0cyIsImxpZ2h0IiwidXBkYXRlIiwic2hhZG93VHlwZSIsImVudW1zIiwiU0hBRE9XX05PTkUiLCJzcGxpY2UiLCJwdXNoIiwiX3VwZGF0ZUxpZ2h0RGVmaW5lcyIsIl9jb3VudCIsImRlZmluZXMiLCJsaWdodEtleSIsInNoYWRvd0tleSIsIl90eXBlIiwiX2RlZmluZXNDaGFuZ2VkIiwiX3NoYWRvd1R5cGUiLCJuZXdDb3VudCIsIk1hdGgiLCJtaW4iLCJDQ19OVU1fTElHSFRTIiwiQ0NfTlVNX1NIQURPV19MSUdIVFMiLCJfc3VibWl0TGlnaHRzVW5pZm9ybXMiLCJwb3NpdGlvbkFuZFJhbmdlcyIsImFkZCIsImRpcmVjdGlvbnMiLCJjb2xvcnMiLCJsaWdodE51bSIsImluZGV4Iiwic2V0IiwiX2NvbG9yVW5pZm9ybSIsIl9kaXJlY3Rpb25Vbmlmb3JtIiwiX3Bvc2l0aW9uVW5pZm9ybSIsIl9yYW5nZSIsIkxJR0hUX1NQT1QiLCJfc3BvdFVuaWZvcm0iLCJfc3VibWl0U2hhZG93U3RhZ2VVbmlmb3JtcyIsIl9zaGFkb3dMaWdodCIsInNoYWRvd0luZm8iLCJzaGFkb3dNaW5EZXB0aCIsInNoYWRvd01heERlcHRoIiwic2hhZG93RGVwdGhTY2FsZSIsInNoYWRvd0RhcmtuZXNzIiwiTWF0NCIsInRvQXJyYXkiLCJfbWF0Vmlld1Byb2oiLCJzaGFkb3dCaWFzIiwiQ0NfU0hBRE9XX1RZUEUiLCJfc3VibWl0T3RoZXJTdGFnZXNVbmlmb3JtcyIsInNoYWRvd0xpZ2h0cyIsImxlbiIsImJ1ZmZlciIsInZpZXdQcm9qTWF0cml4IiwiX3NoYWRvd1Jlc29sdXRpb24iLCJfc29ydEl0ZW1zIiwiaXRlbXMiLCJwYXNzZXMiLCJzb3J0S2V5IiwiX3NoYWRvd1N0YWdlIiwiaXRlbSIsImVmZmVjdCIsImdldERlZmluZSIsIl9kcmF3IiwiX2RyYXdJdGVtcyIsImdldFBvc2l0aW9uIiwiX21hdFZpZXciLCJfbWF0Vmlld0ludiIsIl9tYXRQcm9qIiwiZ2V0Rm9yd2FyZCIsIm5vZGUiLCJnZXRXb3JsZFBvc2l0aW9uIiwic3ViIiwiZG90IiwiQmFzZVJlbmRlcmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxJQUFJQSxTQUFT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SSxDQUFDNkUsV0FBakMsQ0FBbkM7QUFDQXBHLElBQUFBLE1BQU0sQ0FBQ2lCLFVBQVAsQ0FBa0IsWUFBbEIsRUFBZ0M0RCxpQkFBS0MsT0FBTCxDQUFhbEcsU0FBYixFQUF3QjJDLElBQUksQ0FBQzhFLFFBQTdCLENBQWhDO0FBQ0FyRyxJQUFBQSxNQUFNLENBQUNpQixVQUFQLENBQWtCLGdCQUFsQixFQUFvQzRELGlCQUFLQyxPQUFMLENBQWFqRyxhQUFiLEVBQTRCMEMsSUFBSSxDQUFDd0QsWUFBakMsQ0FBcEM7QUFDQS9FLElBQUFBLE1BQU0sQ0FBQ2lCLFVBQVAsQ0FBa0IsY0FBbEIsRUFBa0M5QixpQkFBSzJGLE9BQUwsQ0FBYWhHLFVBQWIsRUFBeUJJLE9BQXpCLENBQWxDLEVBVjZCLENBWTdCO0FBQ0E7QUFFQTs7QUFDQSxTQUFLLElBQUlrQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHcUUsS0FBSyxDQUFDbkUsTUFBMUIsRUFBa0MsRUFBRUYsQ0FBcEMsRUFBdUM7QUFDckMsVUFBSXlFLElBQUksR0FBR0osS0FBSyxDQUFDN0QsSUFBTixDQUFXUixDQUFYLENBQVgsQ0FEcUMsQ0FHckM7O0FBQ0F5RSxNQUFBQSxJQUFJLENBQUNVLElBQUwsQ0FBVUMsZ0JBQVYsQ0FBMkJsSCxRQUEzQjs7QUFFQUQsdUJBQUtvSCxHQUFMLENBQVNuSCxRQUFULEVBQW1CQSxRQUFuQixFQUE2QkosT0FBN0I7O0FBQ0EyRyxNQUFBQSxJQUFJLENBQUNGLE9BQUwsR0FBZSxDQUFDdEcsaUJBQUtxSCxHQUFMLENBQVNwSCxRQUFULEVBQW1CRixPQUFuQixDQUFoQjtBQUNEOztBQUVELFNBQUtvRyxVQUFMLENBQWdCQyxLQUFoQjs7QUFDQSxTQUFLUSxVQUFMLENBQWdCMUUsSUFBaEIsRUFBc0JrRSxLQUF0QjtBQUNEOzs7RUFuVDBDa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuaW1wb3J0IHsgVmVjMywgVmVjNCwgTWF0NCB9IGZyb20gJy4uLy4uL2NvcmUvdmFsdWUtdHlwZXMnO1xuaW1wb3J0IEJhc2VSZW5kZXJlciBmcm9tICcuLi9jb3JlL2Jhc2UtcmVuZGVyZXInO1xuaW1wb3J0IGVudW1zIGZyb20gJy4uL2VudW1zJztcbmltcG9ydCB7IFJlY3ljbGVQb29sIH0gZnJvbSAnLi4vbWVtb3AnO1xuXG5sZXQgX2ExNl92aWV3ID0gbmV3IEZsb2F0MzJBcnJheSgxNik7XG5sZXQgX2ExNl92aWV3X2ludiA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpO1xubGV0IF9hMTZfcHJvaiA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpO1xubGV0IF9hMTZfdmlld1Byb2ogPSBuZXcgRmxvYXQzMkFycmF5KDE2KTtcbmxldCBfYTRfY2FtUG9zID0gbmV3IEZsb2F0MzJBcnJheSg0KTtcblxubGV0IF9hNjRfc2hhZG93X2xpZ2h0Vmlld1Byb2ogPSBuZXcgRmxvYXQzMkFycmF5KDY0KTtcbmxldCBfYTE2X3NoYWRvd19saWdodFZpZXdQcm9qcyA9IFtdO1xubGV0IF9hNF9zaGFkb3dfaW5mbyA9IG5ldyBGbG9hdDMyQXJyYXkoNCk7XG5cbmxldCBfY2FtUG9zID0gbmV3IFZlYzQoMCwgMCwgMCwgMCk7XG5sZXQgX2NhbUZ3ZCA9IG5ldyBWZWMzKDAsIDAsIDApO1xubGV0IF92M190bXAxID0gbmV3IFZlYzMoMCwgMCwgMCk7XG5cbmNvbnN0IENDX01BWF9MSUdIVFMgPSA0O1xuY29uc3QgQ0NfTUFYX1NIQURPV19MSUdIVFMgPSAyO1xuXG5sZXQgX2Zsb2F0MTZfcG9vbCA9IG5ldyBSZWN5Y2xlUG9vbCgoKSA9PiB7XG4gIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KDE2KTtcbn0sIDgpO1xuXG5mdW5jdGlvbiBzb3J0VmlldyhhLCBiKSB7XG4gIHJldHVybiAoYS5fcHJpb3JpdHkgLSBiLl9wcmlvcml0eSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZvcndhcmRSZW5kZXJlciBleHRlbmRzIEJhc2VSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKGRldmljZSwgYnVpbHRpbikge1xuICAgIHN1cGVyKGRldmljZSwgYnVpbHRpbik7XG5cbiAgICB0aGlzLl90aW1lID0gbmV3IEZsb2F0MzJBcnJheSg0KTtcblxuICAgIHRoaXMuX2xpZ2h0cyA9IFtdO1xuICAgIHRoaXMuX3NoYWRvd0xpZ2h0cyA9IFtdO1xuXG4gICAgdGhpcy5fbnVtTGlnaHRzID0gMDtcblxuICAgIHRoaXMuX2RlZmluZXMgPSB7XG4gICAgfTtcblxuICAgIC8vIHRoaXMuX3JlZ2lzdGVyU3RhZ2UoJ3NoYWRvd2Nhc3QnLCB0aGlzLl9zaGFkb3dTdGFnZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9yZWdpc3RlclN0YWdlKCdvcGFxdWUnLCB0aGlzLl9vcGFxdWVTdGFnZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9yZWdpc3RlclN0YWdlKCd0cmFuc3BhcmVudCcsIHRoaXMuX3RyYW5zcGFyZW50U3RhZ2UuYmluZCh0aGlzKSk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICBfZmxvYXQxNl9wb29sLnJlc2V0KCk7XG4gICAgc3VwZXIucmVzZXQoKTtcbiAgfVxuXG4gIHJlbmRlcihzY2VuZSwgZHQpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICBpZiAoIUNDX0VESVRPUikge1xuICAgICAgaWYgKGR0KSB7XG4gICAgICAgIHRoaXMuX3RpbWVbMF0gKz0gZHQ7XG4gICAgICAgIHRoaXMuX3RpbWVbMV0gPSBkdDtcbiAgICAgICAgdGhpcy5fdGltZVsyXSsrO1xuICAgICAgfVxuICAgICAgdGhpcy5fZGV2aWNlLnNldFVuaWZvcm0oJ2NjX3RpbWUnLCB0aGlzLl90aW1lKTtcbiAgICB9XG5cbiAgICAvLyB0aGlzLl91cGRhdGVMaWdodHMoc2NlbmUpO1xuXG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5fZGV2aWNlLl9nbC5jYW52YXM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzY2VuZS5fY2FtZXJhcy5sZW5ndGg7ICsraSkge1xuICAgICAgbGV0IHZpZXcgPSB0aGlzLl9yZXF1ZXN0VmlldygpO1xuICAgICAgbGV0IHdpZHRoID0gY2FudmFzLndpZHRoO1xuICAgICAgbGV0IGhlaWdodCA9IGNhbnZhcy5oZWlnaHQ7XG4gICAgICBsZXQgY2FtZXJhID0gc2NlbmUuX2NhbWVyYXMuZGF0YVtpXTtcbiAgICAgIGNhbWVyYS5leHRyYWN0Vmlldyh2aWV3LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICB9XG5cbiAgICAvLyByZW5kZXIgYnkgY2FtZXJhc1xuICAgIHRoaXMuX3ZpZXdQb29scy5zb3J0KHNvcnRWaWV3KTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdmlld1Bvb2xzLmxlbmd0aDsgKytpKSB7XG4gICAgICBsZXQgdmlldyA9IHRoaXMuX3ZpZXdQb29scy5kYXRhW2ldO1xuICAgICAgdGhpcy5fcmVuZGVyKHZpZXcsIHNjZW5lKTtcbiAgICB9XG4gIH1cblxuICAvLyBkaXJlY3QgcmVuZGVyIGEgc2luZ2xlIGNhbWVyYVxuICByZW5kZXJDYW1lcmEoY2FtZXJhLCBzY2VuZSkge1xuICAgIHRoaXMucmVzZXQoKTtcblxuICAgIHRoaXMuX3VwZGF0ZUxpZ2h0cyhzY2VuZSk7XG5cbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLl9kZXZpY2UuX2dsLmNhbnZhcztcbiAgICBsZXQgd2lkdGggPSBjYW52YXMud2lkdGg7XG4gICAgbGV0IGhlaWdodCA9IGNhbnZhcy5oZWlnaHQ7XG5cbiAgICBsZXQgdmlldyA9IHRoaXMuX3JlcXVlc3RWaWV3KCk7XG4gICAgY2FtZXJhLmV4dHJhY3RWaWV3KHZpZXcsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgLy8gcmVuZGVyIGJ5IGNhbWVyYXNcbiAgICB0aGlzLl92aWV3UG9vbHMuc29ydChzb3J0Vmlldyk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3ZpZXdQb29scy5sZW5ndGg7ICsraSkge1xuICAgICAgbGV0IHZpZXcgPSB0aGlzLl92aWV3UG9vbHMuZGF0YVtpXTtcbiAgICAgIHRoaXMuX3JlbmRlcih2aWV3LCBzY2VuZSk7XG4gICAgfVxuICB9XG5cbiAgX3VwZGF0ZUxpZ2h0cyhzY2VuZSkge1xuICAgIHRoaXMuX2xpZ2h0cy5sZW5ndGggPSAwO1xuICAgIHRoaXMuX3NoYWRvd0xpZ2h0cy5sZW5ndGggPSAwO1xuXG4gICAgbGV0IGxpZ2h0cyA9IHNjZW5lLl9saWdodHM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaWdodHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGxldCBsaWdodCA9IGxpZ2h0cy5kYXRhW2ldO1xuICAgICAgbGlnaHQudXBkYXRlKHRoaXMuX2RldmljZSk7XG5cbiAgICAgIGlmIChsaWdodC5zaGFkb3dUeXBlICE9PSBlbnVtcy5TSEFET1dfTk9ORSkge1xuICAgICAgICBpZiAodGhpcy5fc2hhZG93TGlnaHRzLmxlbmd0aCA8IENDX01BWF9TSEFET1dfTElHSFRTKSB7XG4gICAgICAgICAgdGhpcy5fc2hhZG93TGlnaHRzLnNwbGljZSgwLCAwLCBsaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHZpZXcgPSB0aGlzLl9yZXF1ZXN0VmlldygpO1xuICAgICAgICBsaWdodC5leHRyYWN0Vmlldyh2aWV3LCBbJ3NoYWRvd2Nhc3QnXSk7XG5cbiAgICAgICAgdGhpcy5fbGlnaHRzLnNwbGljZSgwLCAwLCBsaWdodCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5fbGlnaHRzLnB1c2gobGlnaHQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZUxpZ2h0RGVmaW5lcygpO1xuICAgIHRoaXMuX251bUxpZ2h0cyA9IGxpZ2h0cy5fY291bnQ7XG4gIH1cblxuICBfdXBkYXRlTGlnaHREZWZpbmVzKCkge1xuICAgIGxldCBkZWZpbmVzID0gdGhpcy5fZGVmaW5lcztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbGlnaHRzLmxlbmd0aDsgKytpKSB7XG4gICAgICBsZXQgbGlnaHQgPSB0aGlzLl9saWdodHNbaV07XG4gICAgICBsZXQgbGlnaHRLZXkgPSBgQ0NfTElHSFRfJHtpfV9UWVBFYDtcbiAgICAgIGxldCBzaGFkb3dLZXkgPSBgQ0NfU0hBRE9XXyR7aX1fVFlQRWA7XG4gICAgICBpZiAoZGVmaW5lc1tsaWdodEtleV0gIT09IGxpZ2h0Ll90eXBlKSB7XG4gICAgICAgIGRlZmluZXNbbGlnaHRLZXldID0gbGlnaHQuX3R5cGU7XG4gICAgICAgIHRoaXMuX2RlZmluZXNDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChkZWZpbmVzW3NoYWRvd0tleV0gIT09IGxpZ2h0Ll9zaGFkb3dUeXBlKSB7XG4gICAgICAgIGRlZmluZXNbc2hhZG93S2V5XSA9IGxpZ2h0Ll9zaGFkb3dUeXBlO1xuICAgICAgICB0aGlzLl9kZWZpbmVzQ2hhbmdlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IG5ld0NvdW50ID0gTWF0aC5taW4oQ0NfTUFYX0xJR0hUUywgdGhpcy5fbGlnaHRzLmxlbmd0aCk7XG4gICAgaWYgKGRlZmluZXMuQ0NfTlVNX0xJR0hUUyAhPT0gbmV3Q291bnQpIHtcbiAgICAgIGRlZmluZXMuQ0NfTlVNX0xJR0hUUyA9IG5ld0NvdW50O1xuICAgICAgdGhpcy5fZGVmaW5lc0NoYW5nZWQgPSB0cnVlO1xuICAgIH1cbiAgICBuZXdDb3VudCA9IE1hdGgubWluKENDX01BWF9MSUdIVFMsIHRoaXMuX3NoYWRvd0xpZ2h0cy5sZW5ndGgpO1xuICAgIGlmIChkZWZpbmVzLkNDX05VTV9TSEFET1dfTElHSFRTICE9PSBuZXdDb3VudCkge1xuICAgICAgZGVmaW5lcy5DQ19OVU1fU0hBRE9XX0xJR0hUUyA9IG5ld0NvdW50O1xuICAgICAgdGhpcy5fZGVmaW5lc0NoYW5nZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIF9zdWJtaXRMaWdodHNVbmlmb3JtcygpIHtcbiAgICBsZXQgZGV2aWNlID0gdGhpcy5fZGV2aWNlO1xuXG4gICAgaWYgKHRoaXMuX2xpZ2h0cy5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgcG9zaXRpb25BbmRSYW5nZXMgPSBfZmxvYXQxNl9wb29sLmFkZCgpO1xuICAgICAgbGV0IGRpcmVjdGlvbnMgPSBfZmxvYXQxNl9wb29sLmFkZCgpO1xuICAgICAgbGV0IGNvbG9ycyA9IF9mbG9hdDE2X3Bvb2wuYWRkKCk7XG4gICAgICBsZXQgbGlnaHROdW0gPSBNYXRoLm1pbihDQ19NQVhfTElHSFRTLCB0aGlzLl9saWdodHMubGVuZ3RoKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlnaHROdW07ICsraSkge1xuICAgICAgICBsZXQgbGlnaHQgPSB0aGlzLl9saWdodHNbaV07XG4gICAgICAgIGxldCBpbmRleCA9IGkgKiA0O1xuXG4gICAgICAgIGNvbG9ycy5zZXQobGlnaHQuX2NvbG9yVW5pZm9ybSwgaW5kZXgpO1xuICAgICAgICBkaXJlY3Rpb25zLnNldChsaWdodC5fZGlyZWN0aW9uVW5pZm9ybSwgaW5kZXgpO1xuICAgICAgICBwb3NpdGlvbkFuZFJhbmdlcy5zZXQobGlnaHQuX3Bvc2l0aW9uVW5pZm9ybSwgaW5kZXgpO1xuICAgICAgICBwb3NpdGlvbkFuZFJhbmdlc1tpbmRleCArIDNdID0gbGlnaHQuX3JhbmdlO1xuXG4gICAgICAgIGlmIChsaWdodC5fdHlwZSA9PT0gZW51bXMuTElHSFRfU1BPVCkge1xuICAgICAgICAgIGRpcmVjdGlvbnNbaW5kZXggKyAzXSA9IGxpZ2h0Ll9zcG90VW5pZm9ybVswXTtcbiAgICAgICAgICBjb2xvcnNbaW5kZXggKyAzXSA9IGxpZ2h0Ll9zcG90VW5pZm9ybVsxXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBkaXJlY3Rpb25zW2luZGV4ICsgM10gPSAwO1xuICAgICAgICAgIGNvbG9yc1tpbmRleCArIDNdID0gMDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBkZXZpY2UgPSB0aGlzLl9kZXZpY2U7XG4gICAgICBkZXZpY2Uuc2V0VW5pZm9ybSgnY2NfbGlnaHREaXJlY3Rpb24nLCBkaXJlY3Rpb25zKTtcbiAgICAgIGRldmljZS5zZXRVbmlmb3JtKCdjY19saWdodENvbG9yJywgY29sb3JzKTtcbiAgICAgIGRldmljZS5zZXRVbmlmb3JtKCdjY19saWdodFBvc2l0aW9uQW5kUmFuZ2UnLCBwb3NpdGlvbkFuZFJhbmdlcyk7XG4gICAgfVxuICB9XG5cbiAgX3N1Ym1pdFNoYWRvd1N0YWdlVW5pZm9ybXModmlldykge1xuXG4gICAgbGV0IGxpZ2h0ID0gdmlldy5fc2hhZG93TGlnaHQ7XG5cbiAgICBsZXQgc2hhZG93SW5mbyA9IF9hNF9zaGFkb3dfaW5mbztcbiAgICBzaGFkb3dJbmZvWzBdID0gbGlnaHQuc2hhZG93TWluRGVwdGg7XG4gICAgc2hhZG93SW5mb1sxXSA9IGxpZ2h0LnNoYWRvd01heERlcHRoO1xuICAgIHNoYWRvd0luZm9bMl0gPSBsaWdodC5zaGFkb3dEZXB0aFNjYWxlO1xuICAgIHNoYWRvd0luZm9bM10gPSBsaWdodC5zaGFkb3dEYXJrbmVzcztcblxuICAgIHRoaXMuX2RldmljZS5zZXRVbmlmb3JtKCdjY19zaGFkb3dfbWFwX2xpZ2h0Vmlld1Byb2pNYXRyaXgnLCBNYXQ0LnRvQXJyYXkoX2ExNl92aWV3UHJvaiwgdmlldy5fbWF0Vmlld1Byb2opKTtcbiAgICB0aGlzLl9kZXZpY2Uuc2V0VW5pZm9ybSgnY2Nfc2hhZG93X21hcF9pbmZvJywgc2hhZG93SW5mbyk7XG4gICAgdGhpcy5fZGV2aWNlLnNldFVuaWZvcm0oJ2NjX3NoYWRvd19tYXBfYmlhcycsIGxpZ2h0LnNoYWRvd0JpYXMpO1xuXG4gICAgdGhpcy5fZGVmaW5lcy5DQ19TSEFET1dfVFlQRSA9IGxpZ2h0Ll9zaGFkb3dUeXBlO1xuICB9XG5cbiAgX3N1Ym1pdE90aGVyU3RhZ2VzVW5pZm9ybXMoKSB7XG4gICAgbGV0IHNoYWRvd0luZm8gPSBfZmxvYXQxNl9wb29sLmFkZCgpO1xuXG4gICAgY29uc3Qgc2hhZG93TGlnaHRzID0gdGhpcy5fc2hhZG93TGlnaHRzO1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBzaGFkb3dMaWdodHMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIGxldCBsaWdodCA9IHNoYWRvd0xpZ2h0c1tpXTtcbiAgICAgIGxldCB2aWV3ID0gX2ExNl9zaGFkb3dfbGlnaHRWaWV3UHJvanNbaV07XG4gICAgICBpZiAoIXZpZXcpIHtcbiAgICAgICAgdmlldyA9IF9hMTZfc2hhZG93X2xpZ2h0Vmlld1Byb2pzW2ldID0gbmV3IEZsb2F0MzJBcnJheShfYTY0X3NoYWRvd19saWdodFZpZXdQcm9qLmJ1ZmZlciwgaSAqIDY0LCAxNik7XG4gICAgICB9XG4gICAgICBNYXQ0LnRvQXJyYXkodmlldywgbGlnaHQudmlld1Byb2pNYXRyaXgpO1xuXG4gICAgICBsZXQgaW5kZXggPSBpICogNDtcbiAgICAgIHNoYWRvd0luZm9baW5kZXhdID0gbGlnaHQuc2hhZG93TWluRGVwdGg7XG4gICAgICBzaGFkb3dJbmZvW2luZGV4ICsgMV0gPSBsaWdodC5zaGFkb3dNYXhEZXB0aDtcbiAgICAgIHNoYWRvd0luZm9baW5kZXggKyAyXSA9IGxpZ2h0Ll9zaGFkb3dSZXNvbHV0aW9uO1xuICAgICAgc2hhZG93SW5mb1tpbmRleCArIDNdID0gbGlnaHQuc2hhZG93RGFya25lc3M7XG4gICAgfVxuXG4gICAgdGhpcy5fZGV2aWNlLnNldFVuaWZvcm0oYGNjX3NoYWRvd19saWdodFZpZXdQcm9qTWF0cml4YCwgX2E2NF9zaGFkb3dfbGlnaHRWaWV3UHJvaik7XG4gICAgdGhpcy5fZGV2aWNlLnNldFVuaWZvcm0oYGNjX3NoYWRvd19pbmZvYCwgc2hhZG93SW5mbyk7XG4gICAgLy8gdGhpcy5fZGV2aWNlLnNldFVuaWZvcm0oYGNjX2ZydXN0dW1FZGdlRmFsbG9mZl8ke2luZGV4fWAsIGxpZ2h0LmZydXN0dW1FZGdlRmFsbG9mZik7XG4gIH1cblxuICBfc29ydEl0ZW1zKGl0ZW1zKSB7XG4gICAgLy8gc29ydCBpdGVtc1xuICAgIGl0ZW1zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIC8vIGlmIChhLmxheWVyICE9PSBiLmxheWVyKSB7XG4gICAgICAvLyAgIHJldHVybiBhLmxheWVyIC0gYi5sYXllcjtcbiAgICAgIC8vIH1cblxuICAgICAgaWYgKGEucGFzc2VzLmxlbmd0aCAhPT0gYi5wYXNzZXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBhLnBhc3Nlcy5sZW5ndGggLSBiLnBhc3Nlcy5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhLnNvcnRLZXkgLSBiLnNvcnRLZXk7XG4gICAgfSk7XG4gIH1cblxuICBfc2hhZG93U3RhZ2UodmlldywgaXRlbXMpIHtcbiAgICAvLyB1cGRhdGUgcmVuZGVyaW5nXG4gICAgdGhpcy5fc3VibWl0U2hhZG93U3RhZ2VVbmlmb3Jtcyh2aWV3KTtcblxuICAgIC8vIHRoaXMuX3NvcnRJdGVtcyhpdGVtcyk7XG5cbiAgICAvLyBkcmF3IGl0XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7ICsraSkge1xuICAgICAgbGV0IGl0ZW0gPSBpdGVtcy5kYXRhW2ldO1xuICAgICAgaWYgKGl0ZW0uZWZmZWN0LmdldERlZmluZSgnQ0NfQ0FTVElOR19TSEFET1cnKSkge1xuICAgICAgICB0aGlzLl9kcmF3KGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9kcmF3SXRlbXModmlldywgaXRlbXMpIHtcblxuICAgIC8vIGxldCBzaGFkb3dMaWdodHMgPSB0aGlzLl9zaGFkb3dMaWdodHM7XG4gICAgLy8gaWYgKHNoYWRvd0xpZ2h0cy5sZW5ndGggPT09IDAgJiYgdGhpcy5fbnVtTGlnaHRzID09PSAwKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGl0ZW1zLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBsZXQgaXRlbSA9IGl0ZW1zLmRhdGFbaV07XG4gICAgICB0aGlzLl9kcmF3KGl0ZW0pO1xuICAgIH1cbiAgICAvLyB9XG4gICAgLy8gZWxzZSB7XG4gICAgLy8gICBmb3IgKGxldCBpID0gMCwgbGVuID0gaXRlbXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAvLyAgICAgbGV0IGl0ZW0gPSBpdGVtcy5kYXRhW2ldO1xuXG4gICAgLy8gICAgIGZvciAobGV0IHNoYWRvd0lkeCA9IDA7IHNoYWRvd0lkeCA8IHNoYWRvd0xpZ2h0cy5sZW5ndGg7ICsrc2hhZG93SWR4KSB7XG4gICAgLy8gICAgICAgdGhpcy5fZGV2aWNlLnNldFRleHR1cmUoJ2NjX3NoYWRvd19tYXBfJyArIHNoYWRvd0lkeCwgc2hhZG93TGlnaHRzW3NoYWRvd0lkeF0uc2hhZG93TWFwLCB0aGlzLl9hbGxvY1RleHR1cmVVbml0KCkpO1xuICAgIC8vICAgICB9XG5cbiAgICAvLyAgICAgdGhpcy5fZHJhdyhpdGVtKTtcbiAgICAvLyAgIH1cbiAgICAvLyB9XG4gIH1cblxuICBfb3BhcXVlU3RhZ2UodmlldywgaXRlbXMpIHtcbiAgICB2aWV3LmdldFBvc2l0aW9uKF9jYW1Qb3MpO1xuXG4gICAgLy8gdXBkYXRlIHVuaWZvcm1zXG4gICAgY29uc3QgZGV2aWNlID0gdGhpcy5fZGV2aWNlO1xuICAgIGRldmljZS5zZXRVbmlmb3JtKCdjY19tYXRWaWV3JywgTWF0NC50b0FycmF5KF9hMTZfdmlldywgdmlldy5fbWF0VmlldykpO1xuICAgIGRldmljZS5zZXRVbmlmb3JtKCdjY19tYXRWaWV3SW52JywgTWF0NC50b0FycmF5KF9hMTZfdmlld19pbnYsIHZpZXcuX21hdFZpZXdJbnYpKTtcbiAgICBkZXZpY2Uuc2V0VW5pZm9ybSgnY2NfbWF0UHJvaicsIE1hdDQudG9BcnJheShfYTE2X3Byb2osIHZpZXcuX21hdFByb2opKTtcbiAgICBkZXZpY2Uuc2V0VW5pZm9ybSgnY2NfbWF0Vmlld1Byb2onLCBNYXQ0LnRvQXJyYXkoX2ExNl92aWV3UHJvaiwgdmlldy5fbWF0Vmlld1Byb2opKTtcbiAgICBkZXZpY2Uuc2V0VW5pZm9ybSgnY2NfY2FtZXJhUG9zJywgVmVjNC50b0FycmF5KF9hNF9jYW1Qb3MsIF9jYW1Qb3MpKTtcblxuICAgIC8vIHVwZGF0ZSByZW5kZXJpbmdcbiAgICAvLyB0aGlzLl9zdWJtaXRMaWdodHNVbmlmb3JtcygpO1xuICAgIC8vIHRoaXMuX3N1Ym1pdE90aGVyU3RhZ2VzVW5pZm9ybXMoKTtcblxuICAgIHRoaXMuX2RyYXdJdGVtcyh2aWV3LCBpdGVtcyk7XG4gIH1cblxuICBfdHJhbnNwYXJlbnRTdGFnZSh2aWV3LCBpdGVtcykge1xuICAgIHZpZXcuZ2V0UG9zaXRpb24oX2NhbVBvcyk7XG4gICAgdmlldy5nZXRGb3J3YXJkKF9jYW1Gd2QpO1xuXG4gICAgLy8gdXBkYXRlIHVuaWZvcm1zXG4gICAgY29uc3QgZGV2aWNlID0gdGhpcy5fZGV2aWNlXG4gICAgZGV2aWNlLnNldFVuaWZvcm0oJ2NjX21hdFZpZXcnLCBNYXQ0LnRvQXJyYXkoX2ExNl92aWV3LCB2aWV3Ll9tYXRWaWV3KSk7XG4gICAgZGV2aWNlLnNldFVuaWZvcm0oJ2NjX21hdFZpZXdJbnYnLCBNYXQ0LnRvQXJyYXkoX2ExNl92aWV3X2ludiwgdmlldy5fbWF0Vmlld0ludikpO1xuICAgIGRldmljZS5zZXRVbmlmb3JtKCdjY19tYXRQcm9qJywgTWF0NC50b0FycmF5KF9hMTZfcHJvaiwgdmlldy5fbWF0UHJvaikpO1xuICAgIGRldmljZS5zZXRVbmlmb3JtKCdjY19tYXRWaWV3UHJvaicsIE1hdDQudG9BcnJheShfYTE2X3ZpZXdQcm9qLCB2aWV3Ll9tYXRWaWV3UHJvaikpO1xuICAgIGRldmljZS5zZXRVbmlmb3JtKCdjY19jYW1lcmFQb3MnLCBWZWM0LnRvQXJyYXkoX2E0X2NhbVBvcywgX2NhbVBvcykpO1xuXG4gICAgLy8gdGhpcy5fc3VibWl0TGlnaHRzVW5pZm9ybXMoKTtcbiAgICAvLyB0aGlzLl9zdWJtaXRPdGhlclN0YWdlc1VuaWZvcm1zKCk7XG5cbiAgICAvLyBjYWxjdWxhdGUgemRpc3RcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgKytpKSB7XG4gICAgICBsZXQgaXRlbSA9IGl0ZW1zLmRhdGFbaV07XG5cbiAgICAgIC8vIFRPRE86IHdlIHNob3VsZCB1c2UgbWVzaCBjZW50ZXIgaW5zdGVhZCFcbiAgICAgIGl0ZW0ubm9kZS5nZXRXb3JsZFBvc2l0aW9uKF92M190bXAxKTtcblxuICAgICAgVmVjMy5zdWIoX3YzX3RtcDEsIF92M190bXAxLCBfY2FtUG9zKTtcbiAgICAgIGl0ZW0uc29ydEtleSA9IC1WZWMzLmRvdChfdjNfdG1wMSwgX2NhbUZ3ZCk7XG4gICAgfVxuXG4gICAgdGhpcy5fc29ydEl0ZW1zKGl0ZW1zKTtcbiAgICB0aGlzLl9kcmF3SXRlbXModmlldywgaXRlbXMpO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==