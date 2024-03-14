
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/scene/light.js';
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

var _gfx = _interopRequireDefault(require("../gfx"));

var _enums = _interopRequireDefault(require("../enums"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _forward = cc.v3(0, 0, -1);

var _m4_tmp = cc.mat4();

var _m3_tmp = _valueTypes.Mat3.create();

var _transformedLightDirection = cc.v3(0, 0, 0); // compute light viewProjMat for shadow.


function _computeSpotLightViewProjMatrix(light, outView, outProj) {
  // view matrix
  light._node.getWorldRT(outView);

  _valueTypes.Mat4.invert(outView, outView); // proj matrix


  _valueTypes.Mat4.perspective(outProj, light._spotAngle * light._spotAngleScale, 1, light._shadowMinDepth, light._shadowMaxDepth);
}

function _computeDirectionalLightViewProjMatrix(light, outView, outProj) {
  // view matrix
  light._node.getWorldRT(outView);

  _valueTypes.Mat4.invert(outView, outView); // TODO: should compute directional light frustum based on rendered meshes in scene.
  // proj matrix


  var halfSize = light._shadowFrustumSize / 2;

  _valueTypes.Mat4.ortho(outProj, -halfSize, halfSize, -halfSize, halfSize, light._shadowMinDepth, light._shadowMaxDepth);
}

function _computePointLightViewProjMatrix(light, outView, outProj) {
  // view matrix
  light._node.getWorldRT(outView);

  _valueTypes.Mat4.invert(outView, outView); // The transformation from Cartesian to polar coordinates is not a linear function,
  // so it cannot be achieved by means of a fixed matrix multiplication.
  // Here we just use a nearly 180 degree perspective matrix instead.


  _valueTypes.Mat4.perspective(outProj, (0, _valueTypes.toRadian)(179), 1, light._shadowMinDepth, light._shadowMaxDepth);
}
/**
 * A representation of a light source.
 * Could be a point light, a spot light or a directional light.
 */


var Light = /*#__PURE__*/function () {
  /**
   * Setup a default directional light with no shadows
   */
  function Light() {
    this._poolID = -1;
    this._node = null;
    this._type = _enums["default"].LIGHT_DIRECTIONAL;
    this._color = new _valueTypes.Vec3(1, 1, 1);
    this._intensity = 1; // used for spot and point light

    this._range = 1; // used for spot light, default to 60 degrees

    this._spotAngle = (0, _valueTypes.toRadian)(60);
    this._spotExp = 1; // cached for uniform

    this._directionUniform = new Float32Array(3);
    this._positionUniform = new Float32Array(3);
    this._colorUniform = new Float32Array([this._color.x * this._intensity, this._color.y * this._intensity, this._color.z * this._intensity]);
    this._spotUniform = new Float32Array([Math.cos(this._spotAngle * 0.5), this._spotExp]); // shadow params

    this._shadowType = _enums["default"].SHADOW_NONE;
    this._shadowFrameBuffer = null;
    this._shadowMap = null;
    this._shadowMapDirty = false;
    this._shadowDepthBuffer = null;
    this._shadowResolution = 1024;
    this._shadowBias = 0.0005;
    this._shadowDarkness = 1;
    this._shadowMinDepth = 1;
    this._shadowMaxDepth = 1000;
    this._frustumEdgeFalloff = 0; // used by directional and spot light.

    this._viewProjMatrix = cc.mat4();
    this._spotAngleScale = 1; // used for spot light.

    this._shadowFrustumSize = 50; // used for directional light.
  }
  /**
   * Get the hosting node of this camera
   * @returns {Node} the hosting node
   */


  var _proto = Light.prototype;

  _proto.getNode = function getNode() {
    return this._node;
  }
  /**
   * Set the hosting node of this camera
   * @param {Node} node the hosting node
   */
  ;

  _proto.setNode = function setNode(node) {
    this._node = node;
  }
  /**
   * set the color of the light source
   * @param {number} r red channel of the light color
   * @param {number} g green channel of the light color
   * @param {number} b blue channel of the light color
   */
  ;

  _proto.setColor = function setColor(r, g, b) {
    _valueTypes.Vec3.set(this._color, r, g, b);

    this._colorUniform[0] = r * this._intensity;
    this._colorUniform[1] = g * this._intensity;
    this._colorUniform[2] = b * this._intensity;
  }
  /**
   * get the color of the light source
   * @returns {Vec3} the light color
   */
  ;

  /**
   * set the intensity of the light source
   * @param {number} val the light intensity
   */
  _proto.setIntensity = function setIntensity(val) {
    this._intensity = val;
    this._colorUniform[0] = val * this._color.x;
    this._colorUniform[1] = val * this._color.y;
    this._colorUniform[2] = val * this._color.z;
  }
  /**
   * get the intensity of the light source
   * @returns {number} the light intensity
   */
  ;

  /**
   * set the type of the light source
   * @param {number} type light source type
   */
  _proto.setType = function setType(type) {
    this._type = type;
  }
  /**
   * get the type of the light source
   * @returns {number} light source type
   */
  ;

  /**
   * set the spot light angle
   * @param {number} val spot light angle
   */
  _proto.setSpotAngle = function setSpotAngle(val) {
    this._spotAngle = val;
    this._spotUniform[0] = Math.cos(this._spotAngle * 0.5);
  }
  /**
   * get the spot light angle
   * @returns {number} spot light angle
   */
  ;

  /**
   * set the spot light exponential
   * @param {number} val spot light exponential
   */
  _proto.setSpotExp = function setSpotExp(val) {
    this._spotExp = val;
    this._spotUniform[1] = val;
  }
  /**
   * get the spot light exponential
   * @returns {number} spot light exponential
   */
  ;

  /**
   * set the range of the light source
   * @param {number} val light source range
   */
  _proto.setRange = function setRange(val) {
    this._range = val;
  }
  /**
   * get the range of the light source
   * @returns {number} range of the light source
   */
  ;

  /**
   * set the shadow type of the light source
   * @param {number} type light source shadow type
   */
  _proto.setShadowType = function setShadowType(type) {
    if (this._shadowType === _enums["default"].SHADOW_NONE && type !== _enums["default"].SHADOW_NONE) {
      this._shadowMapDirty = true;
    }

    this._shadowType = type;
  }
  /**
   * get the shadow type of the light source
   * @returns {number} light source shadow type
   */
  ;

  /**
   * set the shadow resolution of the light source
   * @param {number} val light source shadow resolution
   */
  _proto.setShadowResolution = function setShadowResolution(val) {
    if (this._shadowResolution !== val) {
      this._shadowMapDirty = true;
    }

    this._shadowResolution = val;
  }
  /**
   * get the shadow resolution of the light source
   * @returns {number} light source shadow resolution
   */
  ;

  /**
   * set the shadow bias of the light source
   * @param {number} val light source shadow bias
   */
  _proto.setShadowBias = function setShadowBias(val) {
    this._shadowBias = val;
  }
  /**
   * get the shadow bias of the light source
   * @returns {number} light source shadow bias
   */
  ;

  /**
   * set the shadow darkness of the light source
   * @param {number} val light source shadow darkness
   */
  _proto.setShadowDarkness = function setShadowDarkness(val) {
    this._shadowDarkness = val;
  }
  /**
   * get the shadow darkness of the light source
   * @returns {number} light source shadow darkness
   */
  ;

  /**
   * set the shadow min depth of the light source
   * @param {number} val light source shadow min depth
   */
  _proto.setShadowMinDepth = function setShadowMinDepth(val) {
    this._shadowMinDepth = val;
  }
  /**
   * get the shadow min depth of the light source
   * @returns {number} light source shadow min depth
   */
  ;

  /**
   * set the shadow max depth of the light source
   * @param {number} val light source shadow max depth
   */
  _proto.setShadowMaxDepth = function setShadowMaxDepth(val) {
    this._shadowMaxDepth = val;
  }
  /**
   * get the shadow max depth of the light source
   * @returns {number} light source shadow max depth
   */
  ;

  /**
   * set the frustum edge falloff of the light source
   * @param {number} val light source frustum edge falloff
   */
  _proto.setFrustumEdgeFalloff = function setFrustumEdgeFalloff(val) {
    this._frustumEdgeFalloff = val;
  }
  /**
   * get the frustum edge falloff of the light source
   * @returns {number} light source frustum edge falloff
   */
  ;

  /**
   * set the shadow frustum size of the light source
   * @param {number} val light source shadow frustum size
   */
  _proto.setShadowFrustumSize = function setShadowFrustumSize(val) {
    this._shadowFrustumSize = val;
  }
  /**
   * get the shadow frustum size of the light source
   * @returns {number} light source shadow frustum size
   */
  ;

  /**
   * extract a view of this light source
   * @param {View} out the receiving view
   * @param {string[]} stages the stages using the view
   */
  _proto.extractView = function extractView(out, stages) {
    // TODO: view should not handle light.
    out._shadowLight = this; // priority. TODO: use varying value for shadow view?

    out._priority = -1; // rect

    out._rect.x = 0;
    out._rect.y = 0;
    out._rect.w = this._shadowResolution;
    out._rect.h = this._shadowResolution; // clear opts

    _valueTypes.Vec3.set(out._color, 1, 1, 1);

    out._depth = 1;
    out._stencil = 1;
    out._clearFlags = _enums["default"].CLEAR_COLOR | _enums["default"].CLEAR_DEPTH; // stages & framebuffer

    out._stages = stages;
    out._framebuffer = this._shadowFrameBuffer; // view projection matrix

    switch (this._type) {
      case _enums["default"].LIGHT_SPOT:
        _computeSpotLightViewProjMatrix(this, out._matView, out._matProj);

        break;

      case _enums["default"].LIGHT_DIRECTIONAL:
        _computeDirectionalLightViewProjMatrix(this, out._matView, out._matProj);

        break;

      case _enums["default"].LIGHT_POINT:
        _computePointLightViewProjMatrix(this, out._matView, out._matProj);

        break;

      case _enums["default"].LIGHT_AMBIENT:
        break;

      default:
        console.warn('shadow of this light type is not supported');
    } // view-projection


    _valueTypes.Mat4.mul(out._matViewProj, out._matProj, out._matView);

    this._viewProjMatrix = out._matViewProj;

    _valueTypes.Mat4.invert(out._matInvViewProj, out._matViewProj); // update view's frustum
    // out._frustum.update(out._matViewProj, out._matInvViewProj);


    out._cullingMask = 0xffffffff;
  };

  _proto._updateLightPositionAndDirection = function _updateLightPositionAndDirection() {
    this._node.getWorldMatrix(_m4_tmp);

    _valueTypes.Mat3.fromMat4(_m3_tmp, _m4_tmp);

    _valueTypes.Vec3.transformMat3(_transformedLightDirection, _forward, _m3_tmp);

    _valueTypes.Vec3.toArray(this._directionUniform, _transformedLightDirection);

    var pos = this._positionUniform;
    var m = _m4_tmp.m;
    pos[0] = m[12];
    pos[1] = m[13];
    pos[2] = m[14];
  };

  _proto._generateShadowMap = function _generateShadowMap(device) {
    this._shadowMap = new _gfx["default"].Texture2D(device, {
      width: this._shadowResolution,
      height: this._shadowResolution,
      format: _gfx["default"].TEXTURE_FMT_RGBA8,
      wrapS: _gfx["default"].WRAP_CLAMP,
      wrapT: _gfx["default"].WRAP_CLAMP
    });
    this._shadowDepthBuffer = new _gfx["default"].RenderBuffer(device, _gfx["default"].RB_FMT_D16, this._shadowResolution, this._shadowResolution);
    this._shadowFrameBuffer = new _gfx["default"].FrameBuffer(device, this._shadowResolution, this._shadowResolution, {
      colors: [this._shadowMap],
      depth: this._shadowDepthBuffer
    });
  };

  _proto._destroyShadowMap = function _destroyShadowMap() {
    if (this._shadowMap) {
      this._shadowMap.destroy();

      this._shadowDepthBuffer.destroy();

      this._shadowFrameBuffer.destroy();

      this._shadowMap = null;
      this._shadowDepthBuffer = null;
      this._shadowFrameBuffer = null;
    }
  }
  /**
   * update the light source
   * @param {Device} device the rendering device
   */
  ;

  _proto.update = function update(device) {
    this._updateLightPositionAndDirection();

    if (this._shadowType === _enums["default"].SHADOW_NONE) {
      this._destroyShadowMap();
    } else if (this._shadowMapDirty) {
      this._destroyShadowMap();

      this._generateShadowMap(device);

      this._shadowMapDirty = false;
    }
  };

  _createClass(Light, [{
    key: "color",
    get: function get() {
      return this._color;
    }
  }, {
    key: "intensity",
    get: function get() {
      return this._intensity;
    }
  }, {
    key: "type",
    get: function get() {
      return this._type;
    }
  }, {
    key: "spotAngle",
    get: function get() {
      return this._spotAngle;
    }
  }, {
    key: "spotExp",
    get: function get() {
      return this._spotExp;
    }
  }, {
    key: "range",
    get: function get() {
      return this._range;
    }
  }, {
    key: "shadowType",
    get: function get() {
      return this._shadowType;
    }
    /**
     * get the shadowmap of the light source
     * @returns {Texture2D} light source shadowmap
     */

  }, {
    key: "shadowMap",
    get: function get() {
      return this._shadowMap;
    }
    /**
     * get the view-projection matrix of the light source
     * @returns {Mat4} light source view-projection matrix
     */

  }, {
    key: "viewProjMatrix",
    get: function get() {
      return this._viewProjMatrix;
    }
  }, {
    key: "shadowResolution",
    get: function get() {
      return this._shadowResolution;
    }
  }, {
    key: "shadowBias",
    get: function get() {
      return this._shadowBias;
    }
  }, {
    key: "shadowDarkness",
    get: function get() {
      return this._shadowDarkness;
    }
  }, {
    key: "shadowMinDepth",
    get: function get() {
      if (this._type === _enums["default"].LIGHT_DIRECTIONAL) {
        return 1.0;
      }

      return this._shadowMinDepth;
    }
  }, {
    key: "shadowMaxDepth",
    get: function get() {
      if (this._type === _enums["default"].LIGHT_DIRECTIONAL) {
        return 1.0;
      }

      return this._shadowMaxDepth;
    }
  }, {
    key: "frustumEdgeFalloff",
    get: function get() {
      return this._frustumEdgeFalloff;
    }
  }, {
    key: "shadowFrustumSize",
    get: function get() {
      return this._shadowFrustumSize;
    }
  }]);

  return Light;
}();

exports["default"] = Light;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9yZW5kZXJlci9zY2VuZS9saWdodC5qcyJdLCJuYW1lcyI6WyJfZm9yd2FyZCIsImNjIiwidjMiLCJfbTRfdG1wIiwibWF0NCIsIl9tM190bXAiLCJNYXQzIiwiY3JlYXRlIiwiX3RyYW5zZm9ybWVkTGlnaHREaXJlY3Rpb24iLCJfY29tcHV0ZVNwb3RMaWdodFZpZXdQcm9qTWF0cml4IiwibGlnaHQiLCJvdXRWaWV3Iiwib3V0UHJvaiIsIl9ub2RlIiwiZ2V0V29ybGRSVCIsIk1hdDQiLCJpbnZlcnQiLCJwZXJzcGVjdGl2ZSIsIl9zcG90QW5nbGUiLCJfc3BvdEFuZ2xlU2NhbGUiLCJfc2hhZG93TWluRGVwdGgiLCJfc2hhZG93TWF4RGVwdGgiLCJfY29tcHV0ZURpcmVjdGlvbmFsTGlnaHRWaWV3UHJvak1hdHJpeCIsImhhbGZTaXplIiwiX3NoYWRvd0ZydXN0dW1TaXplIiwib3J0aG8iLCJfY29tcHV0ZVBvaW50TGlnaHRWaWV3UHJvak1hdHJpeCIsIkxpZ2h0IiwiX3Bvb2xJRCIsIl90eXBlIiwiZW51bXMiLCJMSUdIVF9ESVJFQ1RJT05BTCIsIl9jb2xvciIsIlZlYzMiLCJfaW50ZW5zaXR5IiwiX3JhbmdlIiwiX3Nwb3RFeHAiLCJfZGlyZWN0aW9uVW5pZm9ybSIsIkZsb2F0MzJBcnJheSIsIl9wb3NpdGlvblVuaWZvcm0iLCJfY29sb3JVbmlmb3JtIiwieCIsInkiLCJ6IiwiX3Nwb3RVbmlmb3JtIiwiTWF0aCIsImNvcyIsIl9zaGFkb3dUeXBlIiwiU0hBRE9XX05PTkUiLCJfc2hhZG93RnJhbWVCdWZmZXIiLCJfc2hhZG93TWFwIiwiX3NoYWRvd01hcERpcnR5IiwiX3NoYWRvd0RlcHRoQnVmZmVyIiwiX3NoYWRvd1Jlc29sdXRpb24iLCJfc2hhZG93QmlhcyIsIl9zaGFkb3dEYXJrbmVzcyIsIl9mcnVzdHVtRWRnZUZhbGxvZmYiLCJfdmlld1Byb2pNYXRyaXgiLCJnZXROb2RlIiwic2V0Tm9kZSIsIm5vZGUiLCJzZXRDb2xvciIsInIiLCJnIiwiYiIsInNldCIsInNldEludGVuc2l0eSIsInZhbCIsInNldFR5cGUiLCJ0eXBlIiwic2V0U3BvdEFuZ2xlIiwic2V0U3BvdEV4cCIsInNldFJhbmdlIiwic2V0U2hhZG93VHlwZSIsInNldFNoYWRvd1Jlc29sdXRpb24iLCJzZXRTaGFkb3dCaWFzIiwic2V0U2hhZG93RGFya25lc3MiLCJzZXRTaGFkb3dNaW5EZXB0aCIsInNldFNoYWRvd01heERlcHRoIiwic2V0RnJ1c3R1bUVkZ2VGYWxsb2ZmIiwic2V0U2hhZG93RnJ1c3R1bVNpemUiLCJleHRyYWN0VmlldyIsIm91dCIsInN0YWdlcyIsIl9zaGFkb3dMaWdodCIsIl9wcmlvcml0eSIsIl9yZWN0IiwidyIsImgiLCJfZGVwdGgiLCJfc3RlbmNpbCIsIl9jbGVhckZsYWdzIiwiQ0xFQVJfQ09MT1IiLCJDTEVBUl9ERVBUSCIsIl9zdGFnZXMiLCJfZnJhbWVidWZmZXIiLCJMSUdIVF9TUE9UIiwiX21hdFZpZXciLCJfbWF0UHJvaiIsIkxJR0hUX1BPSU5UIiwiTElHSFRfQU1CSUVOVCIsImNvbnNvbGUiLCJ3YXJuIiwibXVsIiwiX21hdFZpZXdQcm9qIiwiX21hdEludlZpZXdQcm9qIiwiX2N1bGxpbmdNYXNrIiwiX3VwZGF0ZUxpZ2h0UG9zaXRpb25BbmREaXJlY3Rpb24iLCJnZXRXb3JsZE1hdHJpeCIsImZyb21NYXQ0IiwidHJhbnNmb3JtTWF0MyIsInRvQXJyYXkiLCJwb3MiLCJtIiwiX2dlbmVyYXRlU2hhZG93TWFwIiwiZGV2aWNlIiwiZ2Z4IiwiVGV4dHVyZTJEIiwid2lkdGgiLCJoZWlnaHQiLCJmb3JtYXQiLCJURVhUVVJFX0ZNVF9SR0JBOCIsIndyYXBTIiwiV1JBUF9DTEFNUCIsIndyYXBUIiwiUmVuZGVyQnVmZmVyIiwiUkJfRk1UX0QxNiIsIkZyYW1lQnVmZmVyIiwiY29sb3JzIiwiZGVwdGgiLCJfZGVzdHJveVNoYWRvd01hcCIsImRlc3Ryb3kiLCJ1cGRhdGUiXSwibWFwcGluZ3MiOiI7Ozs7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LyBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuaW1wb3J0IHsgTWF0NCwgTWF0MywgVmVjMywgdG9SYWRpYW4gfSBmcm9tICcuLi8uLi9jb3JlL3ZhbHVlLXR5cGVzJztcbmltcG9ydCBnZnggZnJvbSAnLi4vZ2Z4JztcblxuaW1wb3J0IGVudW1zIGZyb20gJy4uL2VudW1zJztcblxuY29uc3QgX2ZvcndhcmQgPSBjYy52MygwLCAwLCAtMSk7XG5cbmxldCBfbTRfdG1wID0gY2MubWF0NCgpO1xubGV0IF9tM190bXAgPSBNYXQzLmNyZWF0ZSgpO1xubGV0IF90cmFuc2Zvcm1lZExpZ2h0RGlyZWN0aW9uID0gY2MudjMoMCwgMCwgMCk7XG5cbi8vIGNvbXB1dGUgbGlnaHQgdmlld1Byb2pNYXQgZm9yIHNoYWRvdy5cbmZ1bmN0aW9uIF9jb21wdXRlU3BvdExpZ2h0Vmlld1Byb2pNYXRyaXgobGlnaHQsIG91dFZpZXcsIG91dFByb2opIHtcbiAgLy8gdmlldyBtYXRyaXhcbiAgbGlnaHQuX25vZGUuZ2V0V29ybGRSVChvdXRWaWV3KTtcbiAgTWF0NC5pbnZlcnQob3V0Vmlldywgb3V0Vmlldyk7XG5cbiAgLy8gcHJvaiBtYXRyaXhcbiAgTWF0NC5wZXJzcGVjdGl2ZShvdXRQcm9qLCBsaWdodC5fc3BvdEFuZ2xlICogbGlnaHQuX3Nwb3RBbmdsZVNjYWxlLCAxLCBsaWdodC5fc2hhZG93TWluRGVwdGgsIGxpZ2h0Ll9zaGFkb3dNYXhEZXB0aCk7XG59XG5cbmZ1bmN0aW9uIF9jb21wdXRlRGlyZWN0aW9uYWxMaWdodFZpZXdQcm9qTWF0cml4KGxpZ2h0LCBvdXRWaWV3LCBvdXRQcm9qKSB7XG4gIC8vIHZpZXcgbWF0cml4XG4gIGxpZ2h0Ll9ub2RlLmdldFdvcmxkUlQob3V0Vmlldyk7XG4gIE1hdDQuaW52ZXJ0KG91dFZpZXcsIG91dFZpZXcpO1xuXG4gIC8vIFRPRE86IHNob3VsZCBjb21wdXRlIGRpcmVjdGlvbmFsIGxpZ2h0IGZydXN0dW0gYmFzZWQgb24gcmVuZGVyZWQgbWVzaGVzIGluIHNjZW5lLlxuICAvLyBwcm9qIG1hdHJpeFxuICBsZXQgaGFsZlNpemUgPSBsaWdodC5fc2hhZG93RnJ1c3R1bVNpemUgLyAyO1xuICBNYXQ0Lm9ydGhvKG91dFByb2osIC1oYWxmU2l6ZSwgaGFsZlNpemUsIC1oYWxmU2l6ZSwgaGFsZlNpemUsIGxpZ2h0Ll9zaGFkb3dNaW5EZXB0aCwgbGlnaHQuX3NoYWRvd01heERlcHRoKTtcbn1cblxuZnVuY3Rpb24gX2NvbXB1dGVQb2ludExpZ2h0Vmlld1Byb2pNYXRyaXgobGlnaHQsIG91dFZpZXcsIG91dFByb2opIHtcbiAgLy8gdmlldyBtYXRyaXhcbiAgbGlnaHQuX25vZGUuZ2V0V29ybGRSVChvdXRWaWV3KTtcbiAgTWF0NC5pbnZlcnQob3V0Vmlldywgb3V0Vmlldyk7XG5cbiAgLy8gVGhlIHRyYW5zZm9ybWF0aW9uIGZyb20gQ2FydGVzaWFuIHRvIHBvbGFyIGNvb3JkaW5hdGVzIGlzIG5vdCBhIGxpbmVhciBmdW5jdGlvbixcbiAgLy8gc28gaXQgY2Fubm90IGJlIGFjaGlldmVkIGJ5IG1lYW5zIG9mIGEgZml4ZWQgbWF0cml4IG11bHRpcGxpY2F0aW9uLlxuICAvLyBIZXJlIHdlIGp1c3QgdXNlIGEgbmVhcmx5IDE4MCBkZWdyZWUgcGVyc3BlY3RpdmUgbWF0cml4IGluc3RlYWQuXG4gIE1hdDQucGVyc3BlY3RpdmUob3V0UHJvaiwgdG9SYWRpYW4oMTc5KSwgMSwgbGlnaHQuX3NoYWRvd01pbkRlcHRoLCBsaWdodC5fc2hhZG93TWF4RGVwdGgpO1xufVxuXG4vKipcbiAqIEEgcmVwcmVzZW50YXRpb24gb2YgYSBsaWdodCBzb3VyY2UuXG4gKiBDb3VsZCBiZSBhIHBvaW50IGxpZ2h0LCBhIHNwb3QgbGlnaHQgb3IgYSBkaXJlY3Rpb25hbCBsaWdodC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGlnaHQge1xuICAvKipcbiAgICogU2V0dXAgYSBkZWZhdWx0IGRpcmVjdGlvbmFsIGxpZ2h0IHdpdGggbm8gc2hhZG93c1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fcG9vbElEID0gLTE7XG4gICAgdGhpcy5fbm9kZSA9IG51bGw7XG5cbiAgICB0aGlzLl90eXBlID0gZW51bXMuTElHSFRfRElSRUNUSU9OQUw7XG5cbiAgICB0aGlzLl9jb2xvciA9IG5ldyBWZWMzKDEsIDEsIDEpO1xuICAgIHRoaXMuX2ludGVuc2l0eSA9IDE7XG5cbiAgICAvLyB1c2VkIGZvciBzcG90IGFuZCBwb2ludCBsaWdodFxuICAgIHRoaXMuX3JhbmdlID0gMTtcbiAgICAvLyB1c2VkIGZvciBzcG90IGxpZ2h0LCBkZWZhdWx0IHRvIDYwIGRlZ3JlZXNcbiAgICB0aGlzLl9zcG90QW5nbGUgPSB0b1JhZGlhbig2MCk7XG4gICAgdGhpcy5fc3BvdEV4cCA9IDE7XG4gICAgLy8gY2FjaGVkIGZvciB1bmlmb3JtXG4gICAgdGhpcy5fZGlyZWN0aW9uVW5pZm9ybSA9IG5ldyBGbG9hdDMyQXJyYXkoMyk7XG4gICAgdGhpcy5fcG9zaXRpb25Vbmlmb3JtID0gbmV3IEZsb2F0MzJBcnJheSgzKTtcbiAgICB0aGlzLl9jb2xvclVuaWZvcm0gPSBuZXcgRmxvYXQzMkFycmF5KFt0aGlzLl9jb2xvci54ICogdGhpcy5faW50ZW5zaXR5LCB0aGlzLl9jb2xvci55ICogdGhpcy5faW50ZW5zaXR5LCB0aGlzLl9jb2xvci56ICogdGhpcy5faW50ZW5zaXR5XSk7XG4gICAgdGhpcy5fc3BvdFVuaWZvcm0gPSBuZXcgRmxvYXQzMkFycmF5KFtNYXRoLmNvcyh0aGlzLl9zcG90QW5nbGUgKiAwLjUpLCB0aGlzLl9zcG90RXhwXSk7XG5cbiAgICAvLyBzaGFkb3cgcGFyYW1zXG4gICAgdGhpcy5fc2hhZG93VHlwZSA9IGVudW1zLlNIQURPV19OT05FO1xuICAgIHRoaXMuX3NoYWRvd0ZyYW1lQnVmZmVyID0gbnVsbDtcbiAgICB0aGlzLl9zaGFkb3dNYXAgPSBudWxsO1xuICAgIHRoaXMuX3NoYWRvd01hcERpcnR5ID0gZmFsc2U7XG4gICAgdGhpcy5fc2hhZG93RGVwdGhCdWZmZXIgPSBudWxsO1xuICAgIHRoaXMuX3NoYWRvd1Jlc29sdXRpb24gPSAxMDI0O1xuICAgIHRoaXMuX3NoYWRvd0JpYXMgPSAwLjAwMDU7XG4gICAgdGhpcy5fc2hhZG93RGFya25lc3MgPSAxO1xuICAgIHRoaXMuX3NoYWRvd01pbkRlcHRoID0gMTtcbiAgICB0aGlzLl9zaGFkb3dNYXhEZXB0aCA9IDEwMDA7XG4gICAgdGhpcy5fZnJ1c3R1bUVkZ2VGYWxsb2ZmID0gMDsgLy8gdXNlZCBieSBkaXJlY3Rpb25hbCBhbmQgc3BvdCBsaWdodC5cbiAgICB0aGlzLl92aWV3UHJvak1hdHJpeCA9IGNjLm1hdDQoKTtcbiAgICB0aGlzLl9zcG90QW5nbGVTY2FsZSA9IDE7IC8vIHVzZWQgZm9yIHNwb3QgbGlnaHQuXG4gICAgdGhpcy5fc2hhZG93RnJ1c3R1bVNpemUgPSA1MDsgLy8gdXNlZCBmb3IgZGlyZWN0aW9uYWwgbGlnaHQuXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBob3N0aW5nIG5vZGUgb2YgdGhpcyBjYW1lcmFcbiAgICogQHJldHVybnMge05vZGV9IHRoZSBob3N0aW5nIG5vZGVcbiAgICovXG4gIGdldE5vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX25vZGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBob3N0aW5nIG5vZGUgb2YgdGhpcyBjYW1lcmFcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlIHRoZSBob3N0aW5nIG5vZGVcbiAgICovXG4gIHNldE5vZGUobm9kZSkge1xuICAgIHRoaXMuX25vZGUgPSBub2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIHNldCB0aGUgY29sb3Igb2YgdGhlIGxpZ2h0IHNvdXJjZVxuICAgKiBAcGFyYW0ge251bWJlcn0gciByZWQgY2hhbm5lbCBvZiB0aGUgbGlnaHQgY29sb3JcbiAgICogQHBhcmFtIHtudW1iZXJ9IGcgZ3JlZW4gY2hhbm5lbCBvZiB0aGUgbGlnaHQgY29sb3JcbiAgICogQHBhcmFtIHtudW1iZXJ9IGIgYmx1ZSBjaGFubmVsIG9mIHRoZSBsaWdodCBjb2xvclxuICAgKi9cbiAgc2V0Q29sb3IociwgZywgYikge1xuICAgIFZlYzMuc2V0KHRoaXMuX2NvbG9yLCByLCBnLCBiKTtcbiAgICB0aGlzLl9jb2xvclVuaWZvcm1bMF0gPSByICogdGhpcy5faW50ZW5zaXR5O1xuICAgIHRoaXMuX2NvbG9yVW5pZm9ybVsxXSA9IGcgKiB0aGlzLl9pbnRlbnNpdHk7XG4gICAgdGhpcy5fY29sb3JVbmlmb3JtWzJdID0gYiAqIHRoaXMuX2ludGVuc2l0eTtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXQgdGhlIGNvbG9yIG9mIHRoZSBsaWdodCBzb3VyY2VcbiAgICogQHJldHVybnMge1ZlYzN9IHRoZSBsaWdodCBjb2xvclxuICAgKi9cbiAgZ2V0IGNvbG9yKCkge1xuICAgIHJldHVybiB0aGlzLl9jb2xvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBzZXQgdGhlIGludGVuc2l0eSBvZiB0aGUgbGlnaHQgc291cmNlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2YWwgdGhlIGxpZ2h0IGludGVuc2l0eVxuICAgKi9cbiAgc2V0SW50ZW5zaXR5KHZhbCkge1xuICAgIHRoaXMuX2ludGVuc2l0eSA9IHZhbDtcbiAgICB0aGlzLl9jb2xvclVuaWZvcm1bMF0gPSB2YWwgKiB0aGlzLl9jb2xvci54O1xuICAgIHRoaXMuX2NvbG9yVW5pZm9ybVsxXSA9IHZhbCAqIHRoaXMuX2NvbG9yLnk7XG4gICAgdGhpcy5fY29sb3JVbmlmb3JtWzJdID0gdmFsICogdGhpcy5fY29sb3IuejtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXQgdGhlIGludGVuc2l0eSBvZiB0aGUgbGlnaHQgc291cmNlXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBsaWdodCBpbnRlbnNpdHlcbiAgICovXG4gIGdldCBpbnRlbnNpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ludGVuc2l0eTtcbiAgfVxuXG4gIC8qKlxuICAgKiBzZXQgdGhlIHR5cGUgb2YgdGhlIGxpZ2h0IHNvdXJjZVxuICAgKiBAcGFyYW0ge251bWJlcn0gdHlwZSBsaWdodCBzb3VyY2UgdHlwZVxuICAgKi9cbiAgc2V0VHlwZSh0eXBlKSB7XG4gICAgdGhpcy5fdHlwZSA9IHR5cGU7XG4gIH1cblxuICAvKipcbiAgICogZ2V0IHRoZSB0eXBlIG9mIHRoZSBsaWdodCBzb3VyY2VcbiAgICogQHJldHVybnMge251bWJlcn0gbGlnaHQgc291cmNlIHR5cGVcbiAgICovXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiB0aGlzLl90eXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIHNldCB0aGUgc3BvdCBsaWdodCBhbmdsZVxuICAgKiBAcGFyYW0ge251bWJlcn0gdmFsIHNwb3QgbGlnaHQgYW5nbGVcbiAgICovXG4gIHNldFNwb3RBbmdsZSh2YWwpIHtcbiAgICB0aGlzLl9zcG90QW5nbGUgPSB2YWw7XG4gICAgdGhpcy5fc3BvdFVuaWZvcm1bMF0gPSBNYXRoLmNvcyh0aGlzLl9zcG90QW5nbGUgKiAwLjUpO1xuICB9XG5cbiAgLyoqXG4gICAqIGdldCB0aGUgc3BvdCBsaWdodCBhbmdsZVxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBzcG90IGxpZ2h0IGFuZ2xlXG4gICAqL1xuICBnZXQgc3BvdEFuZ2xlKCkge1xuICAgIHJldHVybiB0aGlzLl9zcG90QW5nbGU7XG4gIH1cblxuICAvKipcbiAgICogc2V0IHRoZSBzcG90IGxpZ2h0IGV4cG9uZW50aWFsXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2YWwgc3BvdCBsaWdodCBleHBvbmVudGlhbFxuICAgKi9cbiAgc2V0U3BvdEV4cCh2YWwpIHtcbiAgICB0aGlzLl9zcG90RXhwID0gdmFsO1xuICAgIHRoaXMuX3Nwb3RVbmlmb3JtWzFdID0gdmFsO1xuICB9XG5cbiAgLyoqXG4gICAqIGdldCB0aGUgc3BvdCBsaWdodCBleHBvbmVudGlhbFxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBzcG90IGxpZ2h0IGV4cG9uZW50aWFsXG4gICAqL1xuICBnZXQgc3BvdEV4cCgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3BvdEV4cDtcbiAgfVxuXG4gIC8qKlxuICAgKiBzZXQgdGhlIHJhbmdlIG9mIHRoZSBsaWdodCBzb3VyY2VcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbCBsaWdodCBzb3VyY2UgcmFuZ2VcbiAgICovXG4gIHNldFJhbmdlKHZhbCkge1xuICAgIHRoaXMuX3JhbmdlID0gdmFsO1xuICB9XG5cbiAgLyoqXG4gICAqIGdldCB0aGUgcmFuZ2Ugb2YgdGhlIGxpZ2h0IHNvdXJjZVxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSByYW5nZSBvZiB0aGUgbGlnaHQgc291cmNlXG4gICAqL1xuICBnZXQgcmFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JhbmdlO1xuICB9XG5cbiAgLyoqXG4gICAqIHNldCB0aGUgc2hhZG93IHR5cGUgb2YgdGhlIGxpZ2h0IHNvdXJjZVxuICAgKiBAcGFyYW0ge251bWJlcn0gdHlwZSBsaWdodCBzb3VyY2Ugc2hhZG93IHR5cGVcbiAgICovXG4gIHNldFNoYWRvd1R5cGUodHlwZSkge1xuICAgIGlmICh0aGlzLl9zaGFkb3dUeXBlID09PSBlbnVtcy5TSEFET1dfTk9ORSAmJiB0eXBlICE9PSBlbnVtcy5TSEFET1dfTk9ORSkge1xuICAgICAgdGhpcy5fc2hhZG93TWFwRGlydHkgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLl9zaGFkb3dUeXBlID0gdHlwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXQgdGhlIHNoYWRvdyB0eXBlIG9mIHRoZSBsaWdodCBzb3VyY2VcbiAgICogQHJldHVybnMge251bWJlcn0gbGlnaHQgc291cmNlIHNoYWRvdyB0eXBlXG4gICAqL1xuICBnZXQgc2hhZG93VHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2hhZG93VHlwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXQgdGhlIHNoYWRvd21hcCBvZiB0aGUgbGlnaHQgc291cmNlXG4gICAqIEByZXR1cm5zIHtUZXh0dXJlMkR9IGxpZ2h0IHNvdXJjZSBzaGFkb3dtYXBcbiAgICovXG4gIGdldCBzaGFkb3dNYXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NoYWRvd01hcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXQgdGhlIHZpZXctcHJvamVjdGlvbiBtYXRyaXggb2YgdGhlIGxpZ2h0IHNvdXJjZVxuICAgKiBAcmV0dXJucyB7TWF0NH0gbGlnaHQgc291cmNlIHZpZXctcHJvamVjdGlvbiBtYXRyaXhcbiAgICovXG4gIGdldCB2aWV3UHJvak1hdHJpeCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmlld1Byb2pNYXRyaXg7XG4gIH1cblxuICAvKipcbiAgICogc2V0IHRoZSBzaGFkb3cgcmVzb2x1dGlvbiBvZiB0aGUgbGlnaHQgc291cmNlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2YWwgbGlnaHQgc291cmNlIHNoYWRvdyByZXNvbHV0aW9uXG4gICAqL1xuICBzZXRTaGFkb3dSZXNvbHV0aW9uKHZhbCkge1xuICAgIGlmICh0aGlzLl9zaGFkb3dSZXNvbHV0aW9uICE9PSB2YWwpIHtcbiAgICAgIHRoaXMuX3NoYWRvd01hcERpcnR5ID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5fc2hhZG93UmVzb2x1dGlvbiA9IHZhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXQgdGhlIHNoYWRvdyByZXNvbHV0aW9uIG9mIHRoZSBsaWdodCBzb3VyY2VcbiAgICogQHJldHVybnMge251bWJlcn0gbGlnaHQgc291cmNlIHNoYWRvdyByZXNvbHV0aW9uXG4gICAqL1xuICBnZXQgc2hhZG93UmVzb2x1dGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fc2hhZG93UmVzb2x1dGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBzZXQgdGhlIHNoYWRvdyBiaWFzIG9mIHRoZSBsaWdodCBzb3VyY2VcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbCBsaWdodCBzb3VyY2Ugc2hhZG93IGJpYXNcbiAgICovXG4gIHNldFNoYWRvd0JpYXModmFsKSB7XG4gICAgdGhpcy5fc2hhZG93QmlhcyA9IHZhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXQgdGhlIHNoYWRvdyBiaWFzIG9mIHRoZSBsaWdodCBzb3VyY2VcbiAgICogQHJldHVybnMge251bWJlcn0gbGlnaHQgc291cmNlIHNoYWRvdyBiaWFzXG4gICAqL1xuICBnZXQgc2hhZG93QmlhcygpIHtcbiAgICByZXR1cm4gdGhpcy5fc2hhZG93QmlhcztcbiAgfVxuXG4gIC8qKlxuICAgKiBzZXQgdGhlIHNoYWRvdyBkYXJrbmVzcyBvZiB0aGUgbGlnaHQgc291cmNlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2YWwgbGlnaHQgc291cmNlIHNoYWRvdyBkYXJrbmVzc1xuICAgKi9cbiAgc2V0U2hhZG93RGFya25lc3ModmFsKSB7XG4gICAgdGhpcy5fc2hhZG93RGFya25lc3MgPSB2YWw7XG4gIH1cblxuICAvKipcbiAgICogZ2V0IHRoZSBzaGFkb3cgZGFya25lc3Mgb2YgdGhlIGxpZ2h0IHNvdXJjZVxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBsaWdodCBzb3VyY2Ugc2hhZG93IGRhcmtuZXNzXG4gICAqL1xuICBnZXQgc2hhZG93RGFya25lc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NoYWRvd0RhcmtuZXNzO1xuICB9XG5cbiAgLyoqXG4gICAqIHNldCB0aGUgc2hhZG93IG1pbiBkZXB0aCBvZiB0aGUgbGlnaHQgc291cmNlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2YWwgbGlnaHQgc291cmNlIHNoYWRvdyBtaW4gZGVwdGhcbiAgICovXG4gIHNldFNoYWRvd01pbkRlcHRoKHZhbCkge1xuICAgIHRoaXMuX3NoYWRvd01pbkRlcHRoID0gdmFsO1xuICB9XG5cbiAgLyoqXG4gICAqIGdldCB0aGUgc2hhZG93IG1pbiBkZXB0aCBvZiB0aGUgbGlnaHQgc291cmNlXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGxpZ2h0IHNvdXJjZSBzaGFkb3cgbWluIGRlcHRoXG4gICAqL1xuICBnZXQgc2hhZG93TWluRGVwdGgoKSB7XG4gICAgaWYgKHRoaXMuX3R5cGUgPT09IGVudW1zLkxJR0hUX0RJUkVDVElPTkFMKSB7XG4gICAgICByZXR1cm4gMS4wO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fc2hhZG93TWluRGVwdGg7XG4gIH1cblxuICAvKipcbiAgICogc2V0IHRoZSBzaGFkb3cgbWF4IGRlcHRoIG9mIHRoZSBsaWdodCBzb3VyY2VcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbCBsaWdodCBzb3VyY2Ugc2hhZG93IG1heCBkZXB0aFxuICAgKi9cbiAgc2V0U2hhZG93TWF4RGVwdGgodmFsKSB7XG4gICAgdGhpcy5fc2hhZG93TWF4RGVwdGggPSB2YWw7XG4gIH1cblxuICAvKipcbiAgICogZ2V0IHRoZSBzaGFkb3cgbWF4IGRlcHRoIG9mIHRoZSBsaWdodCBzb3VyY2VcbiAgICogQHJldHVybnMge251bWJlcn0gbGlnaHQgc291cmNlIHNoYWRvdyBtYXggZGVwdGhcbiAgICovXG4gIGdldCBzaGFkb3dNYXhEZXB0aCgpIHtcbiAgICBpZiAodGhpcy5fdHlwZSA9PT0gZW51bXMuTElHSFRfRElSRUNUSU9OQUwpIHtcbiAgICAgIHJldHVybiAxLjA7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9zaGFkb3dNYXhEZXB0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBzZXQgdGhlIGZydXN0dW0gZWRnZSBmYWxsb2ZmIG9mIHRoZSBsaWdodCBzb3VyY2VcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbCBsaWdodCBzb3VyY2UgZnJ1c3R1bSBlZGdlIGZhbGxvZmZcbiAgICovXG4gIHNldEZydXN0dW1FZGdlRmFsbG9mZih2YWwpIHtcbiAgICB0aGlzLl9mcnVzdHVtRWRnZUZhbGxvZmYgPSB2YWw7XG4gIH1cblxuICAvKipcbiAgICogZ2V0IHRoZSBmcnVzdHVtIGVkZ2UgZmFsbG9mZiBvZiB0aGUgbGlnaHQgc291cmNlXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGxpZ2h0IHNvdXJjZSBmcnVzdHVtIGVkZ2UgZmFsbG9mZlxuICAgKi9cbiAgZ2V0IGZydXN0dW1FZGdlRmFsbG9mZigpIHtcbiAgICByZXR1cm4gdGhpcy5fZnJ1c3R1bUVkZ2VGYWxsb2ZmO1xuICB9XG5cbiAgLyoqXG4gICAqIHNldCB0aGUgc2hhZG93IGZydXN0dW0gc2l6ZSBvZiB0aGUgbGlnaHQgc291cmNlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2YWwgbGlnaHQgc291cmNlIHNoYWRvdyBmcnVzdHVtIHNpemVcbiAgICovXG4gIHNldFNoYWRvd0ZydXN0dW1TaXplKHZhbCkge1xuICAgIHRoaXMuX3NoYWRvd0ZydXN0dW1TaXplID0gdmFsO1xuICB9XG5cbiAgLyoqXG4gICAqIGdldCB0aGUgc2hhZG93IGZydXN0dW0gc2l6ZSBvZiB0aGUgbGlnaHQgc291cmNlXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGxpZ2h0IHNvdXJjZSBzaGFkb3cgZnJ1c3R1bSBzaXplXG4gICAqL1xuICBnZXQgc2hhZG93RnJ1c3R1bVNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NoYWRvd0ZydXN0dW1TaXplO1xuICB9XG5cbiAgLyoqXG4gICAqIGV4dHJhY3QgYSB2aWV3IG9mIHRoaXMgbGlnaHQgc291cmNlXG4gICAqIEBwYXJhbSB7Vmlld30gb3V0IHRoZSByZWNlaXZpbmcgdmlld1xuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBzdGFnZXMgdGhlIHN0YWdlcyB1c2luZyB0aGUgdmlld1xuICAgKi9cbiAgZXh0cmFjdFZpZXcob3V0LCBzdGFnZXMpIHtcbiAgICAvLyBUT0RPOiB2aWV3IHNob3VsZCBub3QgaGFuZGxlIGxpZ2h0LlxuICAgIG91dC5fc2hhZG93TGlnaHQgPSB0aGlzO1xuXG4gICAgLy8gcHJpb3JpdHkuIFRPRE86IHVzZSB2YXJ5aW5nIHZhbHVlIGZvciBzaGFkb3cgdmlldz9cbiAgICBvdXQuX3ByaW9yaXR5ID0gLTE7XG5cbiAgICAvLyByZWN0XG4gICAgb3V0Ll9yZWN0LnggPSAwO1xuICAgIG91dC5fcmVjdC55ID0gMDtcbiAgICBvdXQuX3JlY3QudyA9IHRoaXMuX3NoYWRvd1Jlc29sdXRpb247XG4gICAgb3V0Ll9yZWN0LmggPSB0aGlzLl9zaGFkb3dSZXNvbHV0aW9uO1xuXG4gICAgLy8gY2xlYXIgb3B0c1xuICAgIFZlYzMuc2V0KG91dC5fY29sb3IsIDEsIDEsIDEpO1xuICAgIG91dC5fZGVwdGggPSAxO1xuICAgIG91dC5fc3RlbmNpbCA9IDE7XG4gICAgb3V0Ll9jbGVhckZsYWdzID0gZW51bXMuQ0xFQVJfQ09MT1IgfCBlbnVtcy5DTEVBUl9ERVBUSDtcblxuICAgIC8vIHN0YWdlcyAmIGZyYW1lYnVmZmVyXG4gICAgb3V0Ll9zdGFnZXMgPSBzdGFnZXM7XG4gICAgb3V0Ll9mcmFtZWJ1ZmZlciA9IHRoaXMuX3NoYWRvd0ZyYW1lQnVmZmVyO1xuXG4gICAgLy8gdmlldyBwcm9qZWN0aW9uIG1hdHJpeFxuICAgIHN3aXRjaCh0aGlzLl90eXBlKSB7XG4gICAgICBjYXNlIGVudW1zLkxJR0hUX1NQT1Q6XG4gICAgICAgIF9jb21wdXRlU3BvdExpZ2h0Vmlld1Byb2pNYXRyaXgodGhpcywgb3V0Ll9tYXRWaWV3LCBvdXQuX21hdFByb2opO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBlbnVtcy5MSUdIVF9ESVJFQ1RJT05BTDpcbiAgICAgICAgX2NvbXB1dGVEaXJlY3Rpb25hbExpZ2h0Vmlld1Byb2pNYXRyaXgodGhpcywgb3V0Ll9tYXRWaWV3LCBvdXQuX21hdFByb2opO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBlbnVtcy5MSUdIVF9QT0lOVDpcbiAgICAgICAgX2NvbXB1dGVQb2ludExpZ2h0Vmlld1Byb2pNYXRyaXgodGhpcywgb3V0Ll9tYXRWaWV3LCBvdXQuX21hdFByb2opO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgZW51bXMuTElHSFRfQU1CSUVOVDpcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLndhcm4oJ3NoYWRvdyBvZiB0aGlzIGxpZ2h0IHR5cGUgaXMgbm90IHN1cHBvcnRlZCcpO1xuICAgIH1cblxuICAgIC8vIHZpZXctcHJvamVjdGlvblxuICAgIE1hdDQubXVsKG91dC5fbWF0Vmlld1Byb2osIG91dC5fbWF0UHJvaiwgb3V0Ll9tYXRWaWV3KTtcbiAgICB0aGlzLl92aWV3UHJvak1hdHJpeCA9IG91dC5fbWF0Vmlld1Byb2o7XG4gICAgTWF0NC5pbnZlcnQob3V0Ll9tYXRJbnZWaWV3UHJvaiwgb3V0Ll9tYXRWaWV3UHJvaik7XG5cbiAgICAvLyB1cGRhdGUgdmlldydzIGZydXN0dW1cbiAgICAvLyBvdXQuX2ZydXN0dW0udXBkYXRlKG91dC5fbWF0Vmlld1Byb2osIG91dC5fbWF0SW52Vmlld1Byb2opO1xuXG4gICAgb3V0Ll9jdWxsaW5nTWFzayA9IDB4ZmZmZmZmZmY7XG4gIH1cblxuICBfdXBkYXRlTGlnaHRQb3NpdGlvbkFuZERpcmVjdGlvbigpIHtcbiAgICB0aGlzLl9ub2RlLmdldFdvcmxkTWF0cml4KF9tNF90bXApO1xuICAgIE1hdDMuZnJvbU1hdDQoX20zX3RtcCwgX200X3RtcCk7XG4gICAgVmVjMy50cmFuc2Zvcm1NYXQzKF90cmFuc2Zvcm1lZExpZ2h0RGlyZWN0aW9uLCBfZm9yd2FyZCwgX20zX3RtcCk7XG4gICAgVmVjMy50b0FycmF5KHRoaXMuX2RpcmVjdGlvblVuaWZvcm0sIF90cmFuc2Zvcm1lZExpZ2h0RGlyZWN0aW9uKTtcbiAgICBsZXQgcG9zID0gdGhpcy5fcG9zaXRpb25Vbmlmb3JtO1xuICAgIGxldCBtID0gX200X3RtcC5tO1xuICAgIHBvc1swXSA9IG1bMTJdO1xuICAgIHBvc1sxXSA9IG1bMTNdO1xuICAgIHBvc1syXSA9IG1bMTRdO1xuICB9XG5cbiAgX2dlbmVyYXRlU2hhZG93TWFwKGRldmljZSkge1xuICAgIHRoaXMuX3NoYWRvd01hcCA9IG5ldyBnZnguVGV4dHVyZTJEKGRldmljZSwge1xuICAgICAgd2lkdGg6IHRoaXMuX3NoYWRvd1Jlc29sdXRpb24sXG4gICAgICBoZWlnaHQ6IHRoaXMuX3NoYWRvd1Jlc29sdXRpb24sXG4gICAgICBmb3JtYXQ6IGdmeC5URVhUVVJFX0ZNVF9SR0JBOCxcbiAgICAgIHdyYXBTOiBnZnguV1JBUF9DTEFNUCxcbiAgICAgIHdyYXBUOiBnZnguV1JBUF9DTEFNUCxcbiAgICB9KTtcbiAgICB0aGlzLl9zaGFkb3dEZXB0aEJ1ZmZlciA9IG5ldyBnZnguUmVuZGVyQnVmZmVyKGRldmljZSxcbiAgICAgIGdmeC5SQl9GTVRfRDE2LFxuICAgICAgdGhpcy5fc2hhZG93UmVzb2x1dGlvbixcbiAgICAgIHRoaXMuX3NoYWRvd1Jlc29sdXRpb25cbiAgICApO1xuICAgIHRoaXMuX3NoYWRvd0ZyYW1lQnVmZmVyID0gbmV3IGdmeC5GcmFtZUJ1ZmZlcihkZXZpY2UsIHRoaXMuX3NoYWRvd1Jlc29sdXRpb24sIHRoaXMuX3NoYWRvd1Jlc29sdXRpb24sIHtcbiAgICAgIGNvbG9yczogW3RoaXMuX3NoYWRvd01hcF0sXG4gICAgICBkZXB0aDogdGhpcy5fc2hhZG93RGVwdGhCdWZmZXIsXG4gICAgfSk7XG4gIH1cblxuICBfZGVzdHJveVNoYWRvd01hcCgpIHtcbiAgICBpZiAodGhpcy5fc2hhZG93TWFwKSB7XG4gICAgICB0aGlzLl9zaGFkb3dNYXAuZGVzdHJveSgpO1xuICAgICAgdGhpcy5fc2hhZG93RGVwdGhCdWZmZXIuZGVzdHJveSgpO1xuICAgICAgdGhpcy5fc2hhZG93RnJhbWVCdWZmZXIuZGVzdHJveSgpO1xuICAgICAgdGhpcy5fc2hhZG93TWFwID0gbnVsbDtcbiAgICAgIHRoaXMuX3NoYWRvd0RlcHRoQnVmZmVyID0gbnVsbDtcbiAgICAgIHRoaXMuX3NoYWRvd0ZyYW1lQnVmZmVyID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdXBkYXRlIHRoZSBsaWdodCBzb3VyY2VcbiAgICogQHBhcmFtIHtEZXZpY2V9IGRldmljZSB0aGUgcmVuZGVyaW5nIGRldmljZVxuICAgKi9cbiAgdXBkYXRlKGRldmljZSkge1xuICAgIHRoaXMuX3VwZGF0ZUxpZ2h0UG9zaXRpb25BbmREaXJlY3Rpb24oKTtcblxuICAgIGlmICh0aGlzLl9zaGFkb3dUeXBlID09PSBlbnVtcy5TSEFET1dfTk9ORSkge1xuICAgICAgdGhpcy5fZGVzdHJveVNoYWRvd01hcCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fc2hhZG93TWFwRGlydHkpIHtcbiAgICAgIHRoaXMuX2Rlc3Ryb3lTaGFkb3dNYXAoKTtcbiAgICAgIHRoaXMuX2dlbmVyYXRlU2hhZG93TWFwKGRldmljZSk7XG4gICAgICB0aGlzLl9zaGFkb3dNYXBEaXJ0eSA9IGZhbHNlO1xuICAgIH1cblxuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==