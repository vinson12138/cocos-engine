
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/scene/camera.js';
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

var _geomUtils = require("../../core/geom-utils");

var _enums = _interopRequireDefault(require("../enums"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _tmp_mat4 = new _valueTypes.Mat4();

var _matView = new _valueTypes.Mat4();

var _matViewInv = new _valueTypes.Mat4();

var _matProj = new _valueTypes.Mat4();

var _matViewProj = new _valueTypes.Mat4();

var _matInvViewProj = new _valueTypes.Mat4();

var _tmp_v3 = new _valueTypes.Vec3();

var _tmp2_v3 = new _valueTypes.Vec3();
/**
 * A representation of a camera instance
 */


var Camera = /*#__PURE__*/function () {
  function Camera() {
    this._poolID = -1;
    this._node = null;
    this._projection = _enums["default"].PROJ_PERSPECTIVE;
    this._priority = 0;
    this._color = new _valueTypes.Vec4(0.2, 0.3, 0.47, 1);
    this._depth = 1;
    this._stencil = 0;
    this._clearFlags = _enums["default"].CLEAR_COLOR | _enums["default"].CLEAR_DEPTH;
    this._clearModel = null;
    this._stages = [];
    this._framebuffer = null;
    this._near = 0.01;
    this._far = 1000.0;
    this._fov = Math.PI / 4.0;
    this._rect = {
      x: 0,
      y: 0,
      w: 1,
      h: 1
    };
    this._orthoHeight = 10;
    this._cullingMask = 0xffffffff;
  }

  var _proto = Camera.prototype;

  _proto.setCullingMask = function setCullingMask(mask) {
    this._cullingMask = mask;
  }
  /**
   * Get the hosting node of this camera
   * @returns {Node} the hosting node
   */
  ;

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
   * Get the projection type of the camera
   * @returns {number} camera projection type
   */
  ;

  _proto.getType = function getType() {
    return this._projection;
  }
  /**
   * Set the projection type of the camera
   * @param {number} type camera projection type
   */
  ;

  _proto.setType = function setType(type) {
    this._projection = type;
  }
  /**
   * Get the priority of the camera
   * @returns {number} camera priority
   */
  ;

  _proto.getPriority = function getPriority() {
    return this._priority;
  }
  /**
   * Set the priority of the camera
   * @param {number} priority camera priority
   */
  ;

  _proto.setPriority = function setPriority(priority) {
    this._priority = priority;
  }
  /**
   * Get the orthogonal height of the camera
   * @returns {number} camera height
   */
  ;

  _proto.getOrthoHeight = function getOrthoHeight() {
    return this._orthoHeight;
  }
  /**
   * Set the orthogonal height of the camera
   * @param {number} val camera height
   */
  ;

  _proto.setOrthoHeight = function setOrthoHeight(val) {
    this._orthoHeight = val;
  }
  /**
   * Get the field of view of the camera
   * @returns {number} camera field of view
   */
  ;

  _proto.getFov = function getFov() {
    return this._fov;
  }
  /**
   * Set the field of view of the camera
   * @param {number} fov camera field of view
   */
  ;

  _proto.setFov = function setFov(fov) {
    this._fov = fov;
  }
  /**
   * Get the near clipping distance of the camera
   * @returns {number} camera near clipping distance
   */
  ;

  _proto.getNear = function getNear() {
    return this._near;
  }
  /**
   * Set the near clipping distance of the camera
   * @param {number} near camera near clipping distance
   */
  ;

  _proto.setNear = function setNear(near) {
    this._near = near;
  }
  /**
   * Get the far clipping distance of the camera
   * @returns {number} camera far clipping distance
   */
  ;

  _proto.getFar = function getFar() {
    return this._far;
  }
  /**
   * Set the far clipping distance of the camera
   * @param {number} far camera far clipping distance
   */
  ;

  _proto.setFar = function setFar(far) {
    this._far = far;
  }
  /**
   * Get the clear color of the camera
   * @returns {Vec4} out the receiving color vector
   */
  ;

  _proto.getColor = function getColor(out) {
    return _valueTypes.Vec4.copy(out, this._color);
  }
  /**
   * Set the clear color of the camera
   * @param {number} r red channel of camera clear color
   * @param {number} g green channel of camera clear color
   * @param {number} b blue channel of camera clear color
   * @param {number} a alpha channel of camera clear color
   */
  ;

  _proto.setColor = function setColor(r, g, b, a) {
    _valueTypes.Vec4.set(this._color, r, g, b, a);
  }
  /**
   * Get the clear depth of the camera
   * @returns {number} camera clear depth
   */
  ;

  _proto.getDepth = function getDepth() {
    return this._depth;
  }
  /**
   * Set the clear depth of the camera
   * @param {number} depth camera clear depth
   */
  ;

  _proto.setDepth = function setDepth(depth) {
    this._depth = depth;
  }
  /**
   * Get the clearing stencil value of the camera
   * @returns {number} camera clearing stencil value
   */
  ;

  _proto.getStencil = function getStencil() {
    return this._stencil;
  }
  /**
   * Set the clearing stencil value of the camera
   * @param {number} stencil camera clearing stencil value
   */
  ;

  _proto.setStencil = function setStencil(stencil) {
    this._stencil = stencil;
  }
  /**
   * Get the clearing flags of the camera
   * @returns {number} camera clearing flags
   */
  ;

  _proto.getClearFlags = function getClearFlags() {
    return this._clearFlags;
  }
  /**
   * Set the clearing flags of the camera
   * @param {number} flags camera clearing flags
   */
  ;

  _proto.setClearFlags = function setClearFlags(flags) {
    this._clearFlags = flags;
  }
  /**
   * Get the rect of the camera
   * @param {Object} out the receiving object
   * @returns {Object} camera rect
   */
  ;

  _proto.getRect = function getRect(out) {
    out.x = this._rect.x;
    out.y = this._rect.y;
    out.w = this._rect.w;
    out.h = this._rect.h;
    return out;
  }
  /**
   * Set the rect of the camera
   * @param {Number} x - [0,1]
   * @param {Number} y - [0,1]
   * @param {Number} w - [0,1]
   * @param {Number} h - [0,1]
   */
  ;

  _proto.setRect = function setRect(x, y, w, h) {
    this._rect.x = x;
    this._rect.y = y;
    this._rect.w = w;
    this._rect.h = h;
  }
  /**
   * Get the stages of the camera
   * @returns {string[]} camera stages
   */
  ;

  _proto.getStages = function getStages() {
    return this._stages;
  }
  /**
   * Set the stages of the camera
   * @param {string[]} stages camera stages
   */
  ;

  _proto.setStages = function setStages(stages) {
    this._stages = stages;
  }
  /**
   * Get the framebuffer of the camera
   * @returns {FrameBuffer} camera framebuffer
   */
  ;

  _proto.getFramebuffer = function getFramebuffer() {
    return this._framebuffer;
  }
  /**
   * Set the framebuffer of the camera
   * @param {FrameBuffer} framebuffer camera framebuffer
   */
  ;

  _proto.setFrameBuffer = function setFrameBuffer(framebuffer) {
    this._framebuffer = framebuffer;
  };

  _proto._calcMatrices = function _calcMatrices(width, height) {
    // view matrix
    this._node.getWorldRT(_matViewInv);

    _valueTypes.Mat4.invert(_matView, _matViewInv); // projection matrix


    var aspect = width / height;

    if (this._projection === _enums["default"].PROJ_PERSPECTIVE) {
      _valueTypes.Mat4.perspective(_matProj, this._fov, aspect, this._near, this._far);
    } else {
      var x = this._orthoHeight * aspect;
      var y = this._orthoHeight;

      _valueTypes.Mat4.ortho(_matProj, -x, x, -y, y, this._near, this._far);
    } // view-projection


    _valueTypes.Mat4.mul(_matViewProj, _matProj, _matView); // inv view-projection


    _valueTypes.Mat4.invert(_matInvViewProj, _matViewProj);
  }
  /**
   * extract a view of this camera
   * @param {View} out the receiving view
   * @param {number} width framebuffer width
   * @param {number} height framebuffer height
   */
  ;

  _proto.extractView = function extractView(out, width, height) {
    if (this._framebuffer) {
      width = this._framebuffer._width;
      height = this._framebuffer._height;
    } // priority


    out._priority = this._priority; // rect

    out._rect.x = this._rect.x * width;
    out._rect.y = this._rect.y * height;
    out._rect.w = this._rect.w * width;
    out._rect.h = this._rect.h * height; // clear opts

    this.getColor(out._color);
    out._depth = this._depth;
    out._stencil = this._stencil;
    out._clearFlags = this._clearFlags;
    out._clearModel = this._clearModel; // stages & framebuffer

    out._stages = this._stages;
    out._framebuffer = this._framebuffer;

    this._calcMatrices(width, height);

    _valueTypes.Mat4.copy(out._matView, _matView);

    _valueTypes.Mat4.copy(out._matViewInv, _matViewInv);

    _valueTypes.Mat4.copy(out._matProj, _matProj);

    _valueTypes.Mat4.copy(out._matViewProj, _matViewProj);

    _valueTypes.Mat4.copy(out._matInvViewProj, _matInvViewProj);

    out._cullingMask = this._cullingMask;
  }
  /**
   * transform a screen position to a world space ray
   * @param {number} x the screen x position to be transformed
   * @param {number} y the screen y position to be transformed
   * @param {number} width framebuffer width
   * @param {number} height framebuffer height
   * @param {Ray} out the resulting ray
   * @returns {Ray} the resulting ray
   */
  ;

  _proto.screenPointToRay = function screenPointToRay(x, y, width, height, out) {
    if (!cc.geomUtils) return out;
    out = out || new _geomUtils.Ray();

    this._calcMatrices(width, height);

    var cx = this._rect.x * width;
    var cy = this._rect.y * height;
    var cw = this._rect.w * width;
    var ch = this._rect.h * height; // far plane intersection

    _valueTypes.Vec3.set(_tmp2_v3, (x - cx) / cw * 2 - 1, (y - cy) / ch * 2 - 1, 1);

    _valueTypes.Vec3.transformMat4(_tmp2_v3, _tmp2_v3, _matInvViewProj);

    if (this._projection === _enums["default"].PROJ_PERSPECTIVE) {
      // camera origin
      this._node.getWorldPosition(_tmp_v3);
    } else {
      // near plane intersection
      _valueTypes.Vec3.set(_tmp_v3, (x - cx) / cw * 2 - 1, (y - cy) / ch * 2 - 1, -1);

      _valueTypes.Vec3.transformMat4(_tmp_v3, _tmp_v3, _matInvViewProj);
    }

    return _geomUtils.Ray.fromPoints(out, _tmp_v3, _tmp2_v3);
  }
  /**
   * transform a screen position to world space
   * @param {Vec3} out the resulting vector
   * @param {Vec3} screenPos the screen position to be transformed
   * @param {number} width framebuffer width
   * @param {number} height framebuffer height
   * @returns {Vec3} the resulting vector
   */
  ;

  _proto.screenToWorld = function screenToWorld(out, screenPos, width, height) {
    this._calcMatrices(width, height);

    var cx = this._rect.x * width;
    var cy = this._rect.y * height;
    var cw = this._rect.w * width;
    var ch = this._rect.h * height;

    if (this._projection === _enums["default"].PROJ_PERSPECTIVE) {
      // calculate screen pos in far clip plane
      _valueTypes.Vec3.set(out, (screenPos.x - cx) / cw * 2 - 1, (screenPos.y - cy) / ch * 2 - 1, 0.9999); // transform to world


      _valueTypes.Vec3.transformMat4(out, out, _matInvViewProj); // lerp to depth z


      this._node.getWorldPosition(_tmp_v3);

      _valueTypes.Vec3.lerp(out, _tmp_v3, out, (0, _valueTypes.lerp)(this._near / this._far, 1, screenPos.z));
    } else {
      _valueTypes.Vec3.set(out, (screenPos.x - cx) / cw * 2 - 1, (screenPos.y - cy) / ch * 2 - 1, screenPos.z * 2 - 1); // transform to world


      _valueTypes.Vec3.transformMat4(out, out, _matInvViewProj);
    }

    return out;
  }
  /**
   * transform a world space position to screen space
   * @param {Vec3} out the resulting vector
   * @param {Vec3} worldPos the world space position to be transformed
   * @param {number} width framebuffer width
   * @param {number} height framebuffer height
   * @returns {Vec3} the resulting vector
   */
  ;

  _proto.worldToScreen = function worldToScreen(out, worldPos, width, height) {
    this._calcMatrices(width, height);

    var cx = this._rect.x * width;
    var cy = this._rect.y * height;
    var cw = this._rect.w * width;
    var ch = this._rect.h * height;

    _valueTypes.Vec3.transformMat4(out, worldPos, _matViewProj);

    out.x = cx + (out.x + 1) * 0.5 * cw;
    out.y = cy + (out.y + 1) * 0.5 * ch;
    out.z = out.z * 0.5 + 0.5;
    return out;
  }
  /**
   * transform a world space matrix to screen space
   * @param {Mat4} out the resulting vector
   * @param {Mat4} worldMatrix the world space matrix to be transformed
   * @param {number} width framebuffer width
   * @param {number} height framebuffer height
   * @returns {Mat4} the resulting vector
   */
  ;

  _proto.worldMatrixToScreen = function worldMatrixToScreen(out, worldMatrix, width, height) {
    this._calcMatrices(width, height);

    _valueTypes.Mat4.mul(out, _matViewProj, worldMatrix);

    var halfWidth = width / 2;
    var halfHeight = height / 2;

    _valueTypes.Mat4.identity(_tmp_mat4);

    _valueTypes.Mat4.transform(_tmp_mat4, _tmp_mat4, _valueTypes.Vec3.set(_tmp_v3, halfWidth, halfHeight, 0));

    _valueTypes.Mat4.scale(_tmp_mat4, _tmp_mat4, _valueTypes.Vec3.set(_tmp_v3, halfWidth, halfHeight, 1));

    _valueTypes.Mat4.mul(out, _tmp_mat4, out);

    return out;
  };

  _createClass(Camera, [{
    key: "cullingMask",
    get: // culling mask
    function get() {
      return this._cullingMask;
    },
    set: function set(mask) {
      this._cullingMask = mask;
    }
  }]);

  return Camera;
}();

exports["default"] = Camera;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9yZW5kZXJlci9zY2VuZS9jYW1lcmEuanMiXSwibmFtZXMiOlsiX3RtcF9tYXQ0IiwiTWF0NCIsIl9tYXRWaWV3IiwiX21hdFZpZXdJbnYiLCJfbWF0UHJvaiIsIl9tYXRWaWV3UHJvaiIsIl9tYXRJbnZWaWV3UHJvaiIsIl90bXBfdjMiLCJWZWMzIiwiX3RtcDJfdjMiLCJDYW1lcmEiLCJfcG9vbElEIiwiX25vZGUiLCJfcHJvamVjdGlvbiIsImVudW1zIiwiUFJPSl9QRVJTUEVDVElWRSIsIl9wcmlvcml0eSIsIl9jb2xvciIsIlZlYzQiLCJfZGVwdGgiLCJfc3RlbmNpbCIsIl9jbGVhckZsYWdzIiwiQ0xFQVJfQ09MT1IiLCJDTEVBUl9ERVBUSCIsIl9jbGVhck1vZGVsIiwiX3N0YWdlcyIsIl9mcmFtZWJ1ZmZlciIsIl9uZWFyIiwiX2ZhciIsIl9mb3YiLCJNYXRoIiwiUEkiLCJfcmVjdCIsIngiLCJ5IiwidyIsImgiLCJfb3J0aG9IZWlnaHQiLCJfY3VsbGluZ01hc2siLCJzZXRDdWxsaW5nTWFzayIsIm1hc2siLCJnZXROb2RlIiwic2V0Tm9kZSIsIm5vZGUiLCJnZXRUeXBlIiwic2V0VHlwZSIsInR5cGUiLCJnZXRQcmlvcml0eSIsInNldFByaW9yaXR5IiwicHJpb3JpdHkiLCJnZXRPcnRob0hlaWdodCIsInNldE9ydGhvSGVpZ2h0IiwidmFsIiwiZ2V0Rm92Iiwic2V0Rm92IiwiZm92IiwiZ2V0TmVhciIsInNldE5lYXIiLCJuZWFyIiwiZ2V0RmFyIiwic2V0RmFyIiwiZmFyIiwiZ2V0Q29sb3IiLCJvdXQiLCJjb3B5Iiwic2V0Q29sb3IiLCJyIiwiZyIsImIiLCJhIiwic2V0IiwiZ2V0RGVwdGgiLCJzZXREZXB0aCIsImRlcHRoIiwiZ2V0U3RlbmNpbCIsInNldFN0ZW5jaWwiLCJzdGVuY2lsIiwiZ2V0Q2xlYXJGbGFncyIsInNldENsZWFyRmxhZ3MiLCJmbGFncyIsImdldFJlY3QiLCJzZXRSZWN0IiwiZ2V0U3RhZ2VzIiwic2V0U3RhZ2VzIiwic3RhZ2VzIiwiZ2V0RnJhbWVidWZmZXIiLCJzZXRGcmFtZUJ1ZmZlciIsImZyYW1lYnVmZmVyIiwiX2NhbGNNYXRyaWNlcyIsIndpZHRoIiwiaGVpZ2h0IiwiZ2V0V29ybGRSVCIsImludmVydCIsImFzcGVjdCIsInBlcnNwZWN0aXZlIiwib3J0aG8iLCJtdWwiLCJleHRyYWN0VmlldyIsIl93aWR0aCIsIl9oZWlnaHQiLCJzY3JlZW5Qb2ludFRvUmF5IiwiY2MiLCJnZW9tVXRpbHMiLCJSYXkiLCJjeCIsImN5IiwiY3ciLCJjaCIsInRyYW5zZm9ybU1hdDQiLCJnZXRXb3JsZFBvc2l0aW9uIiwiZnJvbVBvaW50cyIsInNjcmVlblRvV29ybGQiLCJzY3JlZW5Qb3MiLCJsZXJwIiwieiIsIndvcmxkVG9TY3JlZW4iLCJ3b3JsZFBvcyIsIndvcmxkTWF0cml4VG9TY3JlZW4iLCJ3b3JsZE1hdHJpeCIsImhhbGZXaWR0aCIsImhhbGZIZWlnaHQiLCJpZGVudGl0eSIsInRyYW5zZm9ybSIsInNjYWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBSUEsU0FBUyxHQUFHLElBQUlDLGdCQUFKLEVBQWhCOztBQUVBLElBQUlDLFFBQVEsR0FBRyxJQUFJRCxnQkFBSixFQUFmOztBQUNBLElBQUlFLFdBQVcsR0FBRyxJQUFJRixnQkFBSixFQUFsQjs7QUFDQSxJQUFJRyxRQUFRLEdBQUcsSUFBSUgsZ0JBQUosRUFBZjs7QUFDQSxJQUFJSSxZQUFZLEdBQUcsSUFBSUosZ0JBQUosRUFBbkI7O0FBQ0EsSUFBSUssZUFBZSxHQUFHLElBQUlMLGdCQUFKLEVBQXRCOztBQUNBLElBQUlNLE9BQU8sR0FBRyxJQUFJQyxnQkFBSixFQUFkOztBQUNBLElBQUlDLFFBQVEsR0FBRyxJQUFJRCxnQkFBSixFQUFmO0FBRUE7QUFDQTtBQUNBOzs7SUFDcUJFOztTQUNuQkMsVUFBVSxDQUFDO1NBQ1hDLFFBQVE7U0FDUkMsY0FBY0Msa0JBQU1DO1NBR3BCQyxZQUFZO1NBR1pDLFNBQVMsSUFBSUMsZ0JBQUosQ0FBUyxHQUFULEVBQWMsR0FBZCxFQUFtQixJQUFuQixFQUF5QixDQUF6QjtTQUNUQyxTQUFTO1NBQ1RDLFdBQVc7U0FDWEMsY0FBY1Asa0JBQU1RLFdBQU4sR0FBb0JSLGtCQUFNUztTQUN4Q0MsY0FBYztTQUdkQyxVQUFVO1NBQ1ZDLGVBQWU7U0FHZkMsUUFBUTtTQUNSQyxPQUFPO1NBQ1BDLE9BQU9DLElBQUksQ0FBQ0MsRUFBTCxHQUFVO1NBQ2pCQyxRQUFRO0FBQ05DLE1BQUFBLENBQUMsRUFBRSxDQURHO0FBQ0FDLE1BQUFBLENBQUMsRUFBRSxDQURIO0FBQ01DLE1BQUFBLENBQUMsRUFBRSxDQURUO0FBQ1lDLE1BQUFBLENBQUMsRUFBRTtBQURmO1NBS1JDLGVBQWU7U0FFZkMsZUFBZTs7Ozs7U0FZZkMsaUJBQUEsd0JBQWdCQyxJQUFoQixFQUFzQjtBQUNwQixTQUFLRixZQUFMLEdBQW9CRSxJQUFwQjtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7OztTQUNFQyxVQUFBLG1CQUFXO0FBQ1QsV0FBTyxLQUFLN0IsS0FBWjtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7OztTQUNFOEIsVUFBQSxpQkFBU0MsSUFBVCxFQUFlO0FBQ2IsU0FBSy9CLEtBQUwsR0FBYStCLElBQWI7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBOzs7U0FDRUMsVUFBQSxtQkFBVztBQUNULFdBQU8sS0FBSy9CLFdBQVo7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBOzs7U0FDRWdDLFVBQUEsaUJBQVNDLElBQVQsRUFBZTtBQUNiLFNBQUtqQyxXQUFMLEdBQW1CaUMsSUFBbkI7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBOzs7U0FDRUMsY0FBQSx1QkFBZTtBQUNiLFdBQU8sS0FBSy9CLFNBQVo7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBOzs7U0FDRWdDLGNBQUEscUJBQWFDLFFBQWIsRUFBdUI7QUFDckIsU0FBS2pDLFNBQUwsR0FBaUJpQyxRQUFqQjtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7OztTQUNFQyxpQkFBQSwwQkFBa0I7QUFDaEIsV0FBTyxLQUFLYixZQUFaO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTs7O1NBQ0VjLGlCQUFBLHdCQUFnQkMsR0FBaEIsRUFBcUI7QUFDbkIsU0FBS2YsWUFBTCxHQUFvQmUsR0FBcEI7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBOzs7U0FDRUMsU0FBQSxrQkFBVTtBQUNSLFdBQU8sS0FBS3hCLElBQVo7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBOzs7U0FDRXlCLFNBQUEsZ0JBQVFDLEdBQVIsRUFBYTtBQUNYLFNBQUsxQixJQUFMLEdBQVkwQixHQUFaO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTs7O1NBQ0VDLFVBQUEsbUJBQVc7QUFDVCxXQUFPLEtBQUs3QixLQUFaO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTs7O1NBQ0U4QixVQUFBLGlCQUFTQyxJQUFULEVBQWU7QUFDYixTQUFLL0IsS0FBTCxHQUFhK0IsSUFBYjtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7OztTQUNFQyxTQUFBLGtCQUFVO0FBQ1IsV0FBTyxLQUFLL0IsSUFBWjtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7OztTQUNFZ0MsU0FBQSxnQkFBUUMsR0FBUixFQUFhO0FBQ1gsU0FBS2pDLElBQUwsR0FBWWlDLEdBQVo7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBOzs7U0FDRUMsV0FBQSxrQkFBVUMsR0FBVixFQUFlO0FBQ2IsV0FBTzdDLGlCQUFLOEMsSUFBTCxDQUFVRCxHQUFWLEVBQWUsS0FBSzlDLE1BQXBCLENBQVA7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7U0FDRWdELFdBQUEsa0JBQVVDLENBQVYsRUFBYUMsQ0FBYixFQUFnQkMsQ0FBaEIsRUFBbUJDLENBQW5CLEVBQXNCO0FBQ3BCbkQscUJBQUtvRCxHQUFMLENBQVMsS0FBS3JELE1BQWQsRUFBc0JpRCxDQUF0QixFQUF5QkMsQ0FBekIsRUFBNEJDLENBQTVCLEVBQStCQyxDQUEvQjtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7OztTQUNFRSxXQUFBLG9CQUFZO0FBQ1YsV0FBTyxLQUFLcEQsTUFBWjtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7OztTQUNFcUQsV0FBQSxrQkFBVUMsS0FBVixFQUFpQjtBQUNmLFNBQUt0RCxNQUFMLEdBQWNzRCxLQUFkO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTs7O1NBQ0VDLGFBQUEsc0JBQWM7QUFDWixXQUFPLEtBQUt0RCxRQUFaO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTs7O1NBQ0V1RCxhQUFBLG9CQUFZQyxPQUFaLEVBQXFCO0FBQ25CLFNBQUt4RCxRQUFMLEdBQWdCd0QsT0FBaEI7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBOzs7U0FDRUMsZ0JBQUEseUJBQWlCO0FBQ2YsV0FBTyxLQUFLeEQsV0FBWjtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7OztTQUNFeUQsZ0JBQUEsdUJBQWVDLEtBQWYsRUFBc0I7QUFDcEIsU0FBSzFELFdBQUwsR0FBbUIwRCxLQUFuQjtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7O1NBQ0VDLFVBQUEsaUJBQVNqQixHQUFULEVBQWM7QUFDWkEsSUFBQUEsR0FBRyxDQUFDOUIsQ0FBSixHQUFRLEtBQUtELEtBQUwsQ0FBV0MsQ0FBbkI7QUFDQThCLElBQUFBLEdBQUcsQ0FBQzdCLENBQUosR0FBUSxLQUFLRixLQUFMLENBQVdFLENBQW5CO0FBQ0E2QixJQUFBQSxHQUFHLENBQUM1QixDQUFKLEdBQVEsS0FBS0gsS0FBTCxDQUFXRyxDQUFuQjtBQUNBNEIsSUFBQUEsR0FBRyxDQUFDM0IsQ0FBSixHQUFRLEtBQUtKLEtBQUwsQ0FBV0ksQ0FBbkI7QUFFQSxXQUFPMkIsR0FBUDtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUNFa0IsVUFBQSxpQkFBU2hELENBQVQsRUFBWUMsQ0FBWixFQUFlQyxDQUFmLEVBQWtCQyxDQUFsQixFQUFxQjtBQUNuQixTQUFLSixLQUFMLENBQVdDLENBQVgsR0FBZUEsQ0FBZjtBQUNBLFNBQUtELEtBQUwsQ0FBV0UsQ0FBWCxHQUFlQSxDQUFmO0FBQ0EsU0FBS0YsS0FBTCxDQUFXRyxDQUFYLEdBQWVBLENBQWY7QUFDQSxTQUFLSCxLQUFMLENBQVdJLENBQVgsR0FBZUEsQ0FBZjtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7OztTQUNFOEMsWUFBQSxxQkFBYTtBQUNYLFdBQU8sS0FBS3pELE9BQVo7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBOzs7U0FDRTBELFlBQUEsbUJBQVdDLE1BQVgsRUFBbUI7QUFDakIsU0FBSzNELE9BQUwsR0FBZTJELE1BQWY7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBOzs7U0FDRUMsaUJBQUEsMEJBQWtCO0FBQ2hCLFdBQU8sS0FBSzNELFlBQVo7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBOzs7U0FDRTRELGlCQUFBLHdCQUFnQkMsV0FBaEIsRUFBNkI7QUFDM0IsU0FBSzdELFlBQUwsR0FBb0I2RCxXQUFwQjtBQUNEOztTQUVEQyxnQkFBQSx1QkFBZUMsS0FBZixFQUFzQkMsTUFBdEIsRUFBOEI7QUFDNUI7QUFDQSxTQUFLOUUsS0FBTCxDQUFXK0UsVUFBWCxDQUFzQnhGLFdBQXRCOztBQUNBRixxQkFBSzJGLE1BQUwsQ0FBWTFGLFFBQVosRUFBc0JDLFdBQXRCLEVBSDRCLENBSzVCOzs7QUFDQSxRQUFJMEYsTUFBTSxHQUFHSixLQUFLLEdBQUdDLE1BQXJCOztBQUNBLFFBQUksS0FBSzdFLFdBQUwsS0FBcUJDLGtCQUFNQyxnQkFBL0IsRUFBaUQ7QUFDL0NkLHVCQUFLNkYsV0FBTCxDQUFpQjFGLFFBQWpCLEVBQ0UsS0FBS3lCLElBRFAsRUFFRWdFLE1BRkYsRUFHRSxLQUFLbEUsS0FIUCxFQUlFLEtBQUtDLElBSlA7QUFNRCxLQVBELE1BT087QUFDTCxVQUFJSyxDQUFDLEdBQUcsS0FBS0ksWUFBTCxHQUFvQndELE1BQTVCO0FBQ0EsVUFBSTNELENBQUMsR0FBRyxLQUFLRyxZQUFiOztBQUNBcEMsdUJBQUs4RixLQUFMLENBQVczRixRQUFYLEVBQ0UsQ0FBQzZCLENBREgsRUFDTUEsQ0FETixFQUNTLENBQUNDLENBRFYsRUFDYUEsQ0FEYixFQUNnQixLQUFLUCxLQURyQixFQUM0QixLQUFLQyxJQURqQztBQUdELEtBcEIyQixDQXNCNUI7OztBQUNBM0IscUJBQUsrRixHQUFMLENBQVMzRixZQUFULEVBQXVCRCxRQUF2QixFQUFpQ0YsUUFBakMsRUF2QjRCLENBd0I1Qjs7O0FBQ0FELHFCQUFLMkYsTUFBTCxDQUFZdEYsZUFBWixFQUE2QkQsWUFBN0I7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O1NBQ0U0RixjQUFBLHFCQUFhbEMsR0FBYixFQUFrQjBCLEtBQWxCLEVBQXlCQyxNQUF6QixFQUFpQztBQUMvQixRQUFJLEtBQUtoRSxZQUFULEVBQXVCO0FBQ3JCK0QsTUFBQUEsS0FBSyxHQUFHLEtBQUsvRCxZQUFMLENBQWtCd0UsTUFBMUI7QUFDQVIsTUFBQUEsTUFBTSxHQUFHLEtBQUtoRSxZQUFMLENBQWtCeUUsT0FBM0I7QUFDRCxLQUo4QixDQU0vQjs7O0FBQ0FwQyxJQUFBQSxHQUFHLENBQUMvQyxTQUFKLEdBQWdCLEtBQUtBLFNBQXJCLENBUCtCLENBUy9COztBQUNBK0MsSUFBQUEsR0FBRyxDQUFDL0IsS0FBSixDQUFVQyxDQUFWLEdBQWMsS0FBS0QsS0FBTCxDQUFXQyxDQUFYLEdBQWV3RCxLQUE3QjtBQUNBMUIsSUFBQUEsR0FBRyxDQUFDL0IsS0FBSixDQUFVRSxDQUFWLEdBQWMsS0FBS0YsS0FBTCxDQUFXRSxDQUFYLEdBQWV3RCxNQUE3QjtBQUNBM0IsSUFBQUEsR0FBRyxDQUFDL0IsS0FBSixDQUFVRyxDQUFWLEdBQWMsS0FBS0gsS0FBTCxDQUFXRyxDQUFYLEdBQWVzRCxLQUE3QjtBQUNBMUIsSUFBQUEsR0FBRyxDQUFDL0IsS0FBSixDQUFVSSxDQUFWLEdBQWMsS0FBS0osS0FBTCxDQUFXSSxDQUFYLEdBQWVzRCxNQUE3QixDQWIrQixDQWUvQjs7QUFDQSxTQUFLNUIsUUFBTCxDQUFjQyxHQUFHLENBQUM5QyxNQUFsQjtBQUNBOEMsSUFBQUEsR0FBRyxDQUFDNUMsTUFBSixHQUFhLEtBQUtBLE1BQWxCO0FBQ0E0QyxJQUFBQSxHQUFHLENBQUMzQyxRQUFKLEdBQWUsS0FBS0EsUUFBcEI7QUFDQTJDLElBQUFBLEdBQUcsQ0FBQzFDLFdBQUosR0FBa0IsS0FBS0EsV0FBdkI7QUFDQTBDLElBQUFBLEdBQUcsQ0FBQ3ZDLFdBQUosR0FBa0IsS0FBS0EsV0FBdkIsQ0FwQitCLENBc0IvQjs7QUFDQXVDLElBQUFBLEdBQUcsQ0FBQ3RDLE9BQUosR0FBYyxLQUFLQSxPQUFuQjtBQUNBc0MsSUFBQUEsR0FBRyxDQUFDckMsWUFBSixHQUFtQixLQUFLQSxZQUF4Qjs7QUFFQSxTQUFLOEQsYUFBTCxDQUFtQkMsS0FBbkIsRUFBMEJDLE1BQTFCOztBQUNBekYscUJBQUsrRCxJQUFMLENBQVVELEdBQUcsQ0FBQzdELFFBQWQsRUFBd0JBLFFBQXhCOztBQUNBRCxxQkFBSytELElBQUwsQ0FBVUQsR0FBRyxDQUFDNUQsV0FBZCxFQUEyQkEsV0FBM0I7O0FBQ0FGLHFCQUFLK0QsSUFBTCxDQUFVRCxHQUFHLENBQUMzRCxRQUFkLEVBQXdCQSxRQUF4Qjs7QUFDQUgscUJBQUsrRCxJQUFMLENBQVVELEdBQUcsQ0FBQzFELFlBQWQsRUFBNEJBLFlBQTVCOztBQUNBSixxQkFBSytELElBQUwsQ0FBVUQsR0FBRyxDQUFDekQsZUFBZCxFQUErQkEsZUFBL0I7O0FBRUF5RCxJQUFBQSxHQUFHLENBQUN6QixZQUFKLEdBQW1CLEtBQUtBLFlBQXhCO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUNFOEQsbUJBQUEsMEJBQWtCbkUsQ0FBbEIsRUFBcUJDLENBQXJCLEVBQXdCdUQsS0FBeEIsRUFBK0JDLE1BQS9CLEVBQXVDM0IsR0FBdkMsRUFBNEM7QUFDMUMsUUFBSSxDQUFDc0MsRUFBRSxDQUFDQyxTQUFSLEVBQW1CLE9BQU92QyxHQUFQO0FBRW5CQSxJQUFBQSxHQUFHLEdBQUdBLEdBQUcsSUFBSSxJQUFJd0MsY0FBSixFQUFiOztBQUNBLFNBQUtmLGFBQUwsQ0FBbUJDLEtBQW5CLEVBQTBCQyxNQUExQjs7QUFFQSxRQUFJYyxFQUFFLEdBQUcsS0FBS3hFLEtBQUwsQ0FBV0MsQ0FBWCxHQUFld0QsS0FBeEI7QUFDQSxRQUFJZ0IsRUFBRSxHQUFHLEtBQUt6RSxLQUFMLENBQVdFLENBQVgsR0FBZXdELE1BQXhCO0FBQ0EsUUFBSWdCLEVBQUUsR0FBRyxLQUFLMUUsS0FBTCxDQUFXRyxDQUFYLEdBQWVzRCxLQUF4QjtBQUNBLFFBQUlrQixFQUFFLEdBQUcsS0FBSzNFLEtBQUwsQ0FBV0ksQ0FBWCxHQUFlc0QsTUFBeEIsQ0FUMEMsQ0FXMUM7O0FBQ0FsRixxQkFBSzhELEdBQUwsQ0FBUzdELFFBQVQsRUFBbUIsQ0FBQ3dCLENBQUMsR0FBR3VFLEVBQUwsSUFBV0UsRUFBWCxHQUFnQixDQUFoQixHQUFvQixDQUF2QyxFQUEwQyxDQUFDeEUsQ0FBQyxHQUFHdUUsRUFBTCxJQUFXRSxFQUFYLEdBQWdCLENBQWhCLEdBQW9CLENBQTlELEVBQWlFLENBQWpFOztBQUNBbkcscUJBQUtvRyxhQUFMLENBQW1CbkcsUUFBbkIsRUFBNkJBLFFBQTdCLEVBQXVDSCxlQUF2Qzs7QUFFQSxRQUFJLEtBQUtPLFdBQUwsS0FBcUJDLGtCQUFNQyxnQkFBL0IsRUFBaUQ7QUFDL0M7QUFDQSxXQUFLSCxLQUFMLENBQVdpRyxnQkFBWCxDQUE0QnRHLE9BQTVCO0FBQ0QsS0FIRCxNQUdPO0FBQ0w7QUFDQUMsdUJBQUs4RCxHQUFMLENBQVMvRCxPQUFULEVBQWtCLENBQUMwQixDQUFDLEdBQUd1RSxFQUFMLElBQVdFLEVBQVgsR0FBZ0IsQ0FBaEIsR0FBb0IsQ0FBdEMsRUFBeUMsQ0FBQ3hFLENBQUMsR0FBR3VFLEVBQUwsSUFBV0UsRUFBWCxHQUFnQixDQUFoQixHQUFvQixDQUE3RCxFQUFnRSxDQUFDLENBQWpFOztBQUNBbkcsdUJBQUtvRyxhQUFMLENBQW1CckcsT0FBbkIsRUFBNEJBLE9BQTVCLEVBQXFDRCxlQUFyQztBQUNEOztBQUVELFdBQU9pRyxlQUFJTyxVQUFKLENBQWUvQyxHQUFmLEVBQW9CeEQsT0FBcEIsRUFBNkJFLFFBQTdCLENBQVA7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUNFc0csZ0JBQUEsdUJBQWVoRCxHQUFmLEVBQW9CaUQsU0FBcEIsRUFBK0J2QixLQUEvQixFQUFzQ0MsTUFBdEMsRUFBOEM7QUFDNUMsU0FBS0YsYUFBTCxDQUFtQkMsS0FBbkIsRUFBMEJDLE1BQTFCOztBQUVBLFFBQUljLEVBQUUsR0FBRyxLQUFLeEUsS0FBTCxDQUFXQyxDQUFYLEdBQWV3RCxLQUF4QjtBQUNBLFFBQUlnQixFQUFFLEdBQUcsS0FBS3pFLEtBQUwsQ0FBV0UsQ0FBWCxHQUFld0QsTUFBeEI7QUFDQSxRQUFJZ0IsRUFBRSxHQUFHLEtBQUsxRSxLQUFMLENBQVdHLENBQVgsR0FBZXNELEtBQXhCO0FBQ0EsUUFBSWtCLEVBQUUsR0FBRyxLQUFLM0UsS0FBTCxDQUFXSSxDQUFYLEdBQWVzRCxNQUF4Qjs7QUFFQSxRQUFJLEtBQUs3RSxXQUFMLEtBQXFCQyxrQkFBTUMsZ0JBQS9CLEVBQWlEO0FBQy9DO0FBQ0FQLHVCQUFLOEQsR0FBTCxDQUFTUCxHQUFULEVBQ0UsQ0FBQ2lELFNBQVMsQ0FBQy9FLENBQVYsR0FBY3VFLEVBQWYsSUFBcUJFLEVBQXJCLEdBQTBCLENBQTFCLEdBQThCLENBRGhDLEVBRUUsQ0FBQ00sU0FBUyxDQUFDOUUsQ0FBVixHQUFjdUUsRUFBZixJQUFxQkUsRUFBckIsR0FBMEIsQ0FBMUIsR0FBOEIsQ0FGaEMsRUFHRSxNQUhGLEVBRitDLENBUS9DOzs7QUFDQW5HLHVCQUFLb0csYUFBTCxDQUFtQjdDLEdBQW5CLEVBQXdCQSxHQUF4QixFQUE2QnpELGVBQTdCLEVBVCtDLENBVy9DOzs7QUFDQSxXQUFLTSxLQUFMLENBQVdpRyxnQkFBWCxDQUE0QnRHLE9BQTVCOztBQUVBQyx1QkFBS3lHLElBQUwsQ0FBVWxELEdBQVYsRUFBZXhELE9BQWYsRUFBd0J3RCxHQUF4QixFQUE2QixzQkFBSyxLQUFLcEMsS0FBTCxHQUFhLEtBQUtDLElBQXZCLEVBQTZCLENBQTdCLEVBQWdDb0YsU0FBUyxDQUFDRSxDQUExQyxDQUE3QjtBQUNELEtBZkQsTUFlTztBQUNMMUcsdUJBQUs4RCxHQUFMLENBQVNQLEdBQVQsRUFDRSxDQUFDaUQsU0FBUyxDQUFDL0UsQ0FBVixHQUFjdUUsRUFBZixJQUFxQkUsRUFBckIsR0FBMEIsQ0FBMUIsR0FBOEIsQ0FEaEMsRUFFRSxDQUFDTSxTQUFTLENBQUM5RSxDQUFWLEdBQWN1RSxFQUFmLElBQXFCRSxFQUFyQixHQUEwQixDQUExQixHQUE4QixDQUZoQyxFQUdFSyxTQUFTLENBQUNFLENBQVYsR0FBYyxDQUFkLEdBQWtCLENBSHBCLEVBREssQ0FPTDs7O0FBQ0ExRyx1QkFBS29HLGFBQUwsQ0FBbUI3QyxHQUFuQixFQUF3QkEsR0FBeEIsRUFBNkJ6RCxlQUE3QjtBQUNEOztBQUVELFdBQU95RCxHQUFQO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7U0FDRW9ELGdCQUFBLHVCQUFlcEQsR0FBZixFQUFvQnFELFFBQXBCLEVBQThCM0IsS0FBOUIsRUFBcUNDLE1BQXJDLEVBQTZDO0FBQzNDLFNBQUtGLGFBQUwsQ0FBbUJDLEtBQW5CLEVBQTBCQyxNQUExQjs7QUFFQSxRQUFJYyxFQUFFLEdBQUcsS0FBS3hFLEtBQUwsQ0FBV0MsQ0FBWCxHQUFld0QsS0FBeEI7QUFDQSxRQUFJZ0IsRUFBRSxHQUFHLEtBQUt6RSxLQUFMLENBQVdFLENBQVgsR0FBZXdELE1BQXhCO0FBQ0EsUUFBSWdCLEVBQUUsR0FBRyxLQUFLMUUsS0FBTCxDQUFXRyxDQUFYLEdBQWVzRCxLQUF4QjtBQUNBLFFBQUlrQixFQUFFLEdBQUcsS0FBSzNFLEtBQUwsQ0FBV0ksQ0FBWCxHQUFlc0QsTUFBeEI7O0FBRUFsRixxQkFBS29HLGFBQUwsQ0FBbUI3QyxHQUFuQixFQUF3QnFELFFBQXhCLEVBQWtDL0csWUFBbEM7O0FBQ0EwRCxJQUFBQSxHQUFHLENBQUM5QixDQUFKLEdBQVF1RSxFQUFFLEdBQUcsQ0FBQ3pDLEdBQUcsQ0FBQzlCLENBQUosR0FBUSxDQUFULElBQWMsR0FBZCxHQUFvQnlFLEVBQWpDO0FBQ0EzQyxJQUFBQSxHQUFHLENBQUM3QixDQUFKLEdBQVF1RSxFQUFFLEdBQUcsQ0FBQzFDLEdBQUcsQ0FBQzdCLENBQUosR0FBUSxDQUFULElBQWMsR0FBZCxHQUFvQnlFLEVBQWpDO0FBQ0E1QyxJQUFBQSxHQUFHLENBQUNtRCxDQUFKLEdBQVFuRCxHQUFHLENBQUNtRCxDQUFKLEdBQVEsR0FBUixHQUFjLEdBQXRCO0FBRUEsV0FBT25ELEdBQVA7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUNFc0Qsc0JBQUEsNkJBQXFCdEQsR0FBckIsRUFBMEJ1RCxXQUExQixFQUF1QzdCLEtBQXZDLEVBQThDQyxNQUE5QyxFQUFzRDtBQUNwRCxTQUFLRixhQUFMLENBQW1CQyxLQUFuQixFQUEwQkMsTUFBMUI7O0FBRUF6RixxQkFBSytGLEdBQUwsQ0FBU2pDLEdBQVQsRUFBYzFELFlBQWQsRUFBNEJpSCxXQUE1Qjs7QUFFQSxRQUFJQyxTQUFTLEdBQUc5QixLQUFLLEdBQUcsQ0FBeEI7QUFDQSxRQUFJK0IsVUFBVSxHQUFHOUIsTUFBTSxHQUFHLENBQTFCOztBQUNBekYscUJBQUt3SCxRQUFMLENBQWN6SCxTQUFkOztBQUNBQyxxQkFBS3lILFNBQUwsQ0FBZTFILFNBQWYsRUFBMEJBLFNBQTFCLEVBQXFDUSxpQkFBSzhELEdBQUwsQ0FBUy9ELE9BQVQsRUFBa0JnSCxTQUFsQixFQUE2QkMsVUFBN0IsRUFBeUMsQ0FBekMsQ0FBckM7O0FBQ0F2SCxxQkFBSzBILEtBQUwsQ0FBVzNILFNBQVgsRUFBc0JBLFNBQXRCLEVBQWlDUSxpQkFBSzhELEdBQUwsQ0FBUy9ELE9BQVQsRUFBa0JnSCxTQUFsQixFQUE2QkMsVUFBN0IsRUFBeUMsQ0FBekMsQ0FBakM7O0FBRUF2SCxxQkFBSytGLEdBQUwsQ0FBU2pDLEdBQVQsRUFBYy9ELFNBQWQsRUFBeUIrRCxHQUF6Qjs7QUFFQSxXQUFPQSxHQUFQO0FBQ0Q7Ozs7U0FqY0Q7QUFDQSxtQkFBbUI7QUFDakIsYUFBTyxLQUFLekIsWUFBWjtBQUNEO1NBRUQsYUFBaUJFLElBQWpCLEVBQXVCO0FBQ3JCLFdBQUtGLFlBQUwsR0FBb0JFLElBQXBCO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuaW1wb3J0IHsgVmVjMywgTWF0NCwgbGVycCwgVmVjNCB9IGZyb20gJy4uLy4uL2NvcmUvdmFsdWUtdHlwZXMnO1xuaW1wb3J0IHsgUmF5IH0gZnJvbSAnLi4vLi4vY29yZS9nZW9tLXV0aWxzJztcbmltcG9ydCBlbnVtcyBmcm9tICcuLi9lbnVtcyc7XG5cbmxldCBfdG1wX21hdDQgPSBuZXcgTWF0NCgpO1xuXG5sZXQgX21hdFZpZXcgPSBuZXcgTWF0NCgpO1xubGV0IF9tYXRWaWV3SW52ID0gbmV3IE1hdDQoKTtcbmxldCBfbWF0UHJvaiA9IG5ldyBNYXQ0KCk7XG5sZXQgX21hdFZpZXdQcm9qID0gbmV3IE1hdDQoKTtcbmxldCBfbWF0SW52Vmlld1Byb2ogPSBuZXcgTWF0NCgpO1xubGV0IF90bXBfdjMgPSBuZXcgVmVjMygpO1xubGV0IF90bXAyX3YzID0gbmV3IFZlYzMoKTtcblxuLyoqXG4gKiBBIHJlcHJlc2VudGF0aW9uIG9mIGEgY2FtZXJhIGluc3RhbmNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbWVyYSB7XG4gIF9wb29sSUQgPSAtMTtcbiAgX25vZGUgPSBudWxsO1xuICBfcHJvamVjdGlvbiA9IGVudW1zLlBST0pfUEVSU1BFQ1RJVkU7XG5cbiAgLy8gcHJpb3JpdHkuIHRoZSBzbWFsbGVyIG9uZSB3aWxsIGJlIHJlbmRlcmVkIGZpcnN0XG4gIF9wcmlvcml0eSA9IDA7XG5cbiAgLy8gY2xlYXIgb3B0aW9uc1xuICBfY29sb3IgPSBuZXcgVmVjNCgwLjIsIDAuMywgMC40NywgMSk7XG4gIF9kZXB0aCA9IDE7XG4gIF9zdGVuY2lsID0gMDtcbiAgX2NsZWFyRmxhZ3MgPSBlbnVtcy5DTEVBUl9DT0xPUiB8IGVudW1zLkNMRUFSX0RFUFRIO1xuICBfY2xlYXJNb2RlbCA9IG51bGw7XG5cbiAgLy8gc3RhZ2VzICYgZnJhbWVidWZmZXJcbiAgX3N0YWdlcyA9IFtdO1xuICBfZnJhbWVidWZmZXIgPSBudWxsO1xuXG4gIC8vIHByb2plY3Rpb24gcHJvcGVydGllc1xuICBfbmVhciA9IDAuMDE7XG4gIF9mYXIgPSAxMDAwLjA7XG4gIF9mb3YgPSBNYXRoLlBJIC8gNC4wOyAvLyB2ZXJ0aWNhbCBmb3ZcbiAgX3JlY3QgPSB7XG4gICAgeDogMCwgeTogMCwgdzogMSwgaDogMVxuICB9O1xuXG4gIC8vIG9ydGhvIHByb3BlcnRpZXNcbiAgX29ydGhvSGVpZ2h0ID0gMTA7XG5cbiAgX2N1bGxpbmdNYXNrID0gMHhmZmZmZmZmZjtcblxuXG4gIC8vIGN1bGxpbmcgbWFza1xuICBnZXQgY3VsbGluZ01hc2sgKCkge1xuICAgIHJldHVybiB0aGlzLl9jdWxsaW5nTWFzaztcbiAgfVxuXG4gIHNldCBjdWxsaW5nTWFzayAobWFzaykge1xuICAgIHRoaXMuX2N1bGxpbmdNYXNrID0gbWFzaztcbiAgfVxuXG4gIHNldEN1bGxpbmdNYXNrIChtYXNrKSB7XG4gICAgdGhpcy5fY3VsbGluZ01hc2sgPSBtYXNrO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgaG9zdGluZyBub2RlIG9mIHRoaXMgY2FtZXJhXG4gICAqIEByZXR1cm5zIHtOb2RlfSB0aGUgaG9zdGluZyBub2RlXG4gICAqL1xuICBnZXROb2RlICgpIHtcbiAgICByZXR1cm4gdGhpcy5fbm9kZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGhvc3Rpbmcgbm9kZSBvZiB0aGlzIGNhbWVyYVxuICAgKiBAcGFyYW0ge05vZGV9IG5vZGUgdGhlIGhvc3Rpbmcgbm9kZVxuICAgKi9cbiAgc2V0Tm9kZSAobm9kZSkge1xuICAgIHRoaXMuX25vZGUgPSBub2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgcHJvamVjdGlvbiB0eXBlIG9mIHRoZSBjYW1lcmFcbiAgICogQHJldHVybnMge251bWJlcn0gY2FtZXJhIHByb2plY3Rpb24gdHlwZVxuICAgKi9cbiAgZ2V0VHlwZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Byb2plY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBwcm9qZWN0aW9uIHR5cGUgb2YgdGhlIGNhbWVyYVxuICAgKiBAcGFyYW0ge251bWJlcn0gdHlwZSBjYW1lcmEgcHJvamVjdGlvbiB0eXBlXG4gICAqL1xuICBzZXRUeXBlICh0eXBlKSB7XG4gICAgdGhpcy5fcHJvamVjdGlvbiA9IHR5cGU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBwcmlvcml0eSBvZiB0aGUgY2FtZXJhXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGNhbWVyYSBwcmlvcml0eVxuICAgKi9cbiAgZ2V0UHJpb3JpdHkgKCkge1xuICAgIHJldHVybiB0aGlzLl9wcmlvcml0eTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHByaW9yaXR5IG9mIHRoZSBjYW1lcmFcbiAgICogQHBhcmFtIHtudW1iZXJ9IHByaW9yaXR5IGNhbWVyYSBwcmlvcml0eVxuICAgKi9cbiAgc2V0UHJpb3JpdHkgKHByaW9yaXR5KSB7XG4gICAgdGhpcy5fcHJpb3JpdHkgPSBwcmlvcml0eTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIG9ydGhvZ29uYWwgaGVpZ2h0IG9mIHRoZSBjYW1lcmFcbiAgICogQHJldHVybnMge251bWJlcn0gY2FtZXJhIGhlaWdodFxuICAgKi9cbiAgZ2V0T3J0aG9IZWlnaHQgKCkge1xuICAgIHJldHVybiB0aGlzLl9vcnRob0hlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIG9ydGhvZ29uYWwgaGVpZ2h0IG9mIHRoZSBjYW1lcmFcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbCBjYW1lcmEgaGVpZ2h0XG4gICAqL1xuICBzZXRPcnRob0hlaWdodCAodmFsKSB7XG4gICAgdGhpcy5fb3J0aG9IZWlnaHQgPSB2YWw7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBmaWVsZCBvZiB2aWV3IG9mIHRoZSBjYW1lcmFcbiAgICogQHJldHVybnMge251bWJlcn0gY2FtZXJhIGZpZWxkIG9mIHZpZXdcbiAgICovXG4gIGdldEZvdiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ZvdjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGZpZWxkIG9mIHZpZXcgb2YgdGhlIGNhbWVyYVxuICAgKiBAcGFyYW0ge251bWJlcn0gZm92IGNhbWVyYSBmaWVsZCBvZiB2aWV3XG4gICAqL1xuICBzZXRGb3YgKGZvdikge1xuICAgIHRoaXMuX2ZvdiA9IGZvdjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIG5lYXIgY2xpcHBpbmcgZGlzdGFuY2Ugb2YgdGhlIGNhbWVyYVxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBjYW1lcmEgbmVhciBjbGlwcGluZyBkaXN0YW5jZVxuICAgKi9cbiAgZ2V0TmVhciAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX25lYXI7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBuZWFyIGNsaXBwaW5nIGRpc3RhbmNlIG9mIHRoZSBjYW1lcmFcbiAgICogQHBhcmFtIHtudW1iZXJ9IG5lYXIgY2FtZXJhIG5lYXIgY2xpcHBpbmcgZGlzdGFuY2VcbiAgICovXG4gIHNldE5lYXIgKG5lYXIpIHtcbiAgICB0aGlzLl9uZWFyID0gbmVhcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGZhciBjbGlwcGluZyBkaXN0YW5jZSBvZiB0aGUgY2FtZXJhXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGNhbWVyYSBmYXIgY2xpcHBpbmcgZGlzdGFuY2VcbiAgICovXG4gIGdldEZhciAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ZhcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGZhciBjbGlwcGluZyBkaXN0YW5jZSBvZiB0aGUgY2FtZXJhXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBmYXIgY2FtZXJhIGZhciBjbGlwcGluZyBkaXN0YW5jZVxuICAgKi9cbiAgc2V0RmFyIChmYXIpIHtcbiAgICB0aGlzLl9mYXIgPSBmYXI7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjbGVhciBjb2xvciBvZiB0aGUgY2FtZXJhXG4gICAqIEByZXR1cm5zIHtWZWM0fSBvdXQgdGhlIHJlY2VpdmluZyBjb2xvciB2ZWN0b3JcbiAgICovXG4gIGdldENvbG9yIChvdXQpIHtcbiAgICByZXR1cm4gVmVjNC5jb3B5KG91dCwgdGhpcy5fY29sb3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgY2xlYXIgY29sb3Igb2YgdGhlIGNhbWVyYVxuICAgKiBAcGFyYW0ge251bWJlcn0gciByZWQgY2hhbm5lbCBvZiBjYW1lcmEgY2xlYXIgY29sb3JcbiAgICogQHBhcmFtIHtudW1iZXJ9IGcgZ3JlZW4gY2hhbm5lbCBvZiBjYW1lcmEgY2xlYXIgY29sb3JcbiAgICogQHBhcmFtIHtudW1iZXJ9IGIgYmx1ZSBjaGFubmVsIG9mIGNhbWVyYSBjbGVhciBjb2xvclxuICAgKiBAcGFyYW0ge251bWJlcn0gYSBhbHBoYSBjaGFubmVsIG9mIGNhbWVyYSBjbGVhciBjb2xvclxuICAgKi9cbiAgc2V0Q29sb3IgKHIsIGcsIGIsIGEpIHtcbiAgICBWZWM0LnNldCh0aGlzLl9jb2xvciwgciwgZywgYiwgYSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjbGVhciBkZXB0aCBvZiB0aGUgY2FtZXJhXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGNhbWVyYSBjbGVhciBkZXB0aFxuICAgKi9cbiAgZ2V0RGVwdGggKCkge1xuICAgIHJldHVybiB0aGlzLl9kZXB0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGNsZWFyIGRlcHRoIG9mIHRoZSBjYW1lcmFcbiAgICogQHBhcmFtIHtudW1iZXJ9IGRlcHRoIGNhbWVyYSBjbGVhciBkZXB0aFxuICAgKi9cbiAgc2V0RGVwdGggKGRlcHRoKSB7XG4gICAgdGhpcy5fZGVwdGggPSBkZXB0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGNsZWFyaW5nIHN0ZW5jaWwgdmFsdWUgb2YgdGhlIGNhbWVyYVxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBjYW1lcmEgY2xlYXJpbmcgc3RlbmNpbCB2YWx1ZVxuICAgKi9cbiAgZ2V0U3RlbmNpbCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0ZW5jaWw7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBjbGVhcmluZyBzdGVuY2lsIHZhbHVlIG9mIHRoZSBjYW1lcmFcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN0ZW5jaWwgY2FtZXJhIGNsZWFyaW5nIHN0ZW5jaWwgdmFsdWVcbiAgICovXG4gIHNldFN0ZW5jaWwgKHN0ZW5jaWwpIHtcbiAgICB0aGlzLl9zdGVuY2lsID0gc3RlbmNpbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGNsZWFyaW5nIGZsYWdzIG9mIHRoZSBjYW1lcmFcbiAgICogQHJldHVybnMge251bWJlcn0gY2FtZXJhIGNsZWFyaW5nIGZsYWdzXG4gICAqL1xuICBnZXRDbGVhckZsYWdzICgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2xlYXJGbGFncztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGNsZWFyaW5nIGZsYWdzIG9mIHRoZSBjYW1lcmFcbiAgICogQHBhcmFtIHtudW1iZXJ9IGZsYWdzIGNhbWVyYSBjbGVhcmluZyBmbGFnc1xuICAgKi9cbiAgc2V0Q2xlYXJGbGFncyAoZmxhZ3MpIHtcbiAgICB0aGlzLl9jbGVhckZsYWdzID0gZmxhZ3M7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSByZWN0IG9mIHRoZSBjYW1lcmFcbiAgICogQHBhcmFtIHtPYmplY3R9IG91dCB0aGUgcmVjZWl2aW5nIG9iamVjdFxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBjYW1lcmEgcmVjdFxuICAgKi9cbiAgZ2V0UmVjdCAob3V0KSB7XG4gICAgb3V0LnggPSB0aGlzLl9yZWN0Lng7XG4gICAgb3V0LnkgPSB0aGlzLl9yZWN0Lnk7XG4gICAgb3V0LncgPSB0aGlzLl9yZWN0Lnc7XG4gICAgb3V0LmggPSB0aGlzLl9yZWN0Lmg7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgcmVjdCBvZiB0aGUgY2FtZXJhXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4IC0gWzAsMV1cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkgLSBbMCwxXVxuICAgKiBAcGFyYW0ge051bWJlcn0gdyAtIFswLDFdXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBoIC0gWzAsMV1cbiAgICovXG4gIHNldFJlY3QgKHgsIHksIHcsIGgpIHtcbiAgICB0aGlzLl9yZWN0LnggPSB4O1xuICAgIHRoaXMuX3JlY3QueSA9IHk7XG4gICAgdGhpcy5fcmVjdC53ID0gdztcbiAgICB0aGlzLl9yZWN0LmggPSBoO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgc3RhZ2VzIG9mIHRoZSBjYW1lcmFcbiAgICogQHJldHVybnMge3N0cmluZ1tdfSBjYW1lcmEgc3RhZ2VzXG4gICAqL1xuICBnZXRTdGFnZXMgKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGFnZXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBzdGFnZXMgb2YgdGhlIGNhbWVyYVxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBzdGFnZXMgY2FtZXJhIHN0YWdlc1xuICAgKi9cbiAgc2V0U3RhZ2VzIChzdGFnZXMpIHtcbiAgICB0aGlzLl9zdGFnZXMgPSBzdGFnZXM7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBmcmFtZWJ1ZmZlciBvZiB0aGUgY2FtZXJhXG4gICAqIEByZXR1cm5zIHtGcmFtZUJ1ZmZlcn0gY2FtZXJhIGZyYW1lYnVmZmVyXG4gICAqL1xuICBnZXRGcmFtZWJ1ZmZlciAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ZyYW1lYnVmZmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgZnJhbWVidWZmZXIgb2YgdGhlIGNhbWVyYVxuICAgKiBAcGFyYW0ge0ZyYW1lQnVmZmVyfSBmcmFtZWJ1ZmZlciBjYW1lcmEgZnJhbWVidWZmZXJcbiAgICovXG4gIHNldEZyYW1lQnVmZmVyIChmcmFtZWJ1ZmZlcikge1xuICAgIHRoaXMuX2ZyYW1lYnVmZmVyID0gZnJhbWVidWZmZXI7XG4gIH1cblxuICBfY2FsY01hdHJpY2VzICh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgLy8gdmlldyBtYXRyaXhcbiAgICB0aGlzLl9ub2RlLmdldFdvcmxkUlQoX21hdFZpZXdJbnYpO1xuICAgIE1hdDQuaW52ZXJ0KF9tYXRWaWV3LCBfbWF0Vmlld0ludik7XG5cbiAgICAvLyBwcm9qZWN0aW9uIG1hdHJpeFxuICAgIGxldCBhc3BlY3QgPSB3aWR0aCAvIGhlaWdodDtcbiAgICBpZiAodGhpcy5fcHJvamVjdGlvbiA9PT0gZW51bXMuUFJPSl9QRVJTUEVDVElWRSkge1xuICAgICAgTWF0NC5wZXJzcGVjdGl2ZShfbWF0UHJvaixcbiAgICAgICAgdGhpcy5fZm92LFxuICAgICAgICBhc3BlY3QsXG4gICAgICAgIHRoaXMuX25lYXIsXG4gICAgICAgIHRoaXMuX2ZhclxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHggPSB0aGlzLl9vcnRob0hlaWdodCAqIGFzcGVjdDtcbiAgICAgIGxldCB5ID0gdGhpcy5fb3J0aG9IZWlnaHQ7XG4gICAgICBNYXQ0Lm9ydGhvKF9tYXRQcm9qLFxuICAgICAgICAteCwgeCwgLXksIHksIHRoaXMuX25lYXIsIHRoaXMuX2ZhclxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyB2aWV3LXByb2plY3Rpb25cbiAgICBNYXQ0Lm11bChfbWF0Vmlld1Byb2osIF9tYXRQcm9qLCBfbWF0Vmlldyk7XG4gICAgLy8gaW52IHZpZXctcHJvamVjdGlvblxuICAgIE1hdDQuaW52ZXJ0KF9tYXRJbnZWaWV3UHJvaiwgX21hdFZpZXdQcm9qKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBleHRyYWN0IGEgdmlldyBvZiB0aGlzIGNhbWVyYVxuICAgKiBAcGFyYW0ge1ZpZXd9IG91dCB0aGUgcmVjZWl2aW5nIHZpZXdcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIGZyYW1lYnVmZmVyIHdpZHRoXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgZnJhbWVidWZmZXIgaGVpZ2h0XG4gICAqL1xuICBleHRyYWN0VmlldyAob3V0LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgaWYgKHRoaXMuX2ZyYW1lYnVmZmVyKSB7XG4gICAgICB3aWR0aCA9IHRoaXMuX2ZyYW1lYnVmZmVyLl93aWR0aDtcbiAgICAgIGhlaWdodCA9IHRoaXMuX2ZyYW1lYnVmZmVyLl9oZWlnaHQ7XG4gICAgfVxuXG4gICAgLy8gcHJpb3JpdHlcbiAgICBvdXQuX3ByaW9yaXR5ID0gdGhpcy5fcHJpb3JpdHk7XG5cbiAgICAvLyByZWN0XG4gICAgb3V0Ll9yZWN0LnggPSB0aGlzLl9yZWN0LnggKiB3aWR0aDtcbiAgICBvdXQuX3JlY3QueSA9IHRoaXMuX3JlY3QueSAqIGhlaWdodDtcbiAgICBvdXQuX3JlY3QudyA9IHRoaXMuX3JlY3QudyAqIHdpZHRoO1xuICAgIG91dC5fcmVjdC5oID0gdGhpcy5fcmVjdC5oICogaGVpZ2h0O1xuXG4gICAgLy8gY2xlYXIgb3B0c1xuICAgIHRoaXMuZ2V0Q29sb3Iob3V0Ll9jb2xvcik7XG4gICAgb3V0Ll9kZXB0aCA9IHRoaXMuX2RlcHRoO1xuICAgIG91dC5fc3RlbmNpbCA9IHRoaXMuX3N0ZW5jaWw7XG4gICAgb3V0Ll9jbGVhckZsYWdzID0gdGhpcy5fY2xlYXJGbGFncztcbiAgICBvdXQuX2NsZWFyTW9kZWwgPSB0aGlzLl9jbGVhck1vZGVsO1xuXG4gICAgLy8gc3RhZ2VzICYgZnJhbWVidWZmZXJcbiAgICBvdXQuX3N0YWdlcyA9IHRoaXMuX3N0YWdlcztcbiAgICBvdXQuX2ZyYW1lYnVmZmVyID0gdGhpcy5fZnJhbWVidWZmZXI7XG5cbiAgICB0aGlzLl9jYWxjTWF0cmljZXMod2lkdGgsIGhlaWdodCk7XG4gICAgTWF0NC5jb3B5KG91dC5fbWF0VmlldywgX21hdFZpZXcpO1xuICAgIE1hdDQuY29weShvdXQuX21hdFZpZXdJbnYsIF9tYXRWaWV3SW52KTtcbiAgICBNYXQ0LmNvcHkob3V0Ll9tYXRQcm9qLCBfbWF0UHJvaik7XG4gICAgTWF0NC5jb3B5KG91dC5fbWF0Vmlld1Byb2osIF9tYXRWaWV3UHJvaik7XG4gICAgTWF0NC5jb3B5KG91dC5fbWF0SW52Vmlld1Byb2osIF9tYXRJbnZWaWV3UHJvaik7XG5cbiAgICBvdXQuX2N1bGxpbmdNYXNrID0gdGhpcy5fY3VsbGluZ01hc2s7XG4gIH1cblxuICAvKipcbiAgICogdHJhbnNmb3JtIGEgc2NyZWVuIHBvc2l0aW9uIHRvIGEgd29ybGQgc3BhY2UgcmF5XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB4IHRoZSBzY3JlZW4geCBwb3NpdGlvbiB0byBiZSB0cmFuc2Zvcm1lZFxuICAgKiBAcGFyYW0ge251bWJlcn0geSB0aGUgc2NyZWVuIHkgcG9zaXRpb24gdG8gYmUgdHJhbnNmb3JtZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIGZyYW1lYnVmZmVyIHdpZHRoXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgZnJhbWVidWZmZXIgaGVpZ2h0XG4gICAqIEBwYXJhbSB7UmF5fSBvdXQgdGhlIHJlc3VsdGluZyByYXlcbiAgICogQHJldHVybnMge1JheX0gdGhlIHJlc3VsdGluZyByYXlcbiAgICovXG4gIHNjcmVlblBvaW50VG9SYXkgKHgsIHksIHdpZHRoLCBoZWlnaHQsIG91dCkge1xuICAgIGlmICghY2MuZ2VvbVV0aWxzKSByZXR1cm4gb3V0O1xuXG4gICAgb3V0ID0gb3V0IHx8IG5ldyBSYXkoKTtcbiAgICB0aGlzLl9jYWxjTWF0cmljZXMod2lkdGgsIGhlaWdodCk7XG5cbiAgICBsZXQgY3ggPSB0aGlzLl9yZWN0LnggKiB3aWR0aDtcbiAgICBsZXQgY3kgPSB0aGlzLl9yZWN0LnkgKiBoZWlnaHQ7XG4gICAgbGV0IGN3ID0gdGhpcy5fcmVjdC53ICogd2lkdGg7XG4gICAgbGV0IGNoID0gdGhpcy5fcmVjdC5oICogaGVpZ2h0O1xuXG4gICAgLy8gZmFyIHBsYW5lIGludGVyc2VjdGlvblxuICAgIFZlYzMuc2V0KF90bXAyX3YzLCAoeCAtIGN4KSAvIGN3ICogMiAtIDEsICh5IC0gY3kpIC8gY2ggKiAyIC0gMSwgMSk7XG4gICAgVmVjMy50cmFuc2Zvcm1NYXQ0KF90bXAyX3YzLCBfdG1wMl92MywgX21hdEludlZpZXdQcm9qKTtcblxuICAgIGlmICh0aGlzLl9wcm9qZWN0aW9uID09PSBlbnVtcy5QUk9KX1BFUlNQRUNUSVZFKSB7XG4gICAgICAvLyBjYW1lcmEgb3JpZ2luXG4gICAgICB0aGlzLl9ub2RlLmdldFdvcmxkUG9zaXRpb24oX3RtcF92Myk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG5lYXIgcGxhbmUgaW50ZXJzZWN0aW9uXG4gICAgICBWZWMzLnNldChfdG1wX3YzLCAoeCAtIGN4KSAvIGN3ICogMiAtIDEsICh5IC0gY3kpIC8gY2ggKiAyIC0gMSwgLTEpO1xuICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KF90bXBfdjMsIF90bXBfdjMsIF9tYXRJbnZWaWV3UHJvaik7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJheS5mcm9tUG9pbnRzKG91dCwgX3RtcF92MywgX3RtcDJfdjMpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRyYW5zZm9ybSBhIHNjcmVlbiBwb3NpdGlvbiB0byB3b3JsZCBzcGFjZVxuICAgKiBAcGFyYW0ge1ZlYzN9IG91dCB0aGUgcmVzdWx0aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge1ZlYzN9IHNjcmVlblBvcyB0aGUgc2NyZWVuIHBvc2l0aW9uIHRvIGJlIHRyYW5zZm9ybWVkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBmcmFtZWJ1ZmZlciB3aWR0aFxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IGZyYW1lYnVmZmVyIGhlaWdodFxuICAgKiBAcmV0dXJucyB7VmVjM30gdGhlIHJlc3VsdGluZyB2ZWN0b3JcbiAgICovXG4gIHNjcmVlblRvV29ybGQgKG91dCwgc2NyZWVuUG9zLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy5fY2FsY01hdHJpY2VzKHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgbGV0IGN4ID0gdGhpcy5fcmVjdC54ICogd2lkdGg7XG4gICAgbGV0IGN5ID0gdGhpcy5fcmVjdC55ICogaGVpZ2h0O1xuICAgIGxldCBjdyA9IHRoaXMuX3JlY3QudyAqIHdpZHRoO1xuICAgIGxldCBjaCA9IHRoaXMuX3JlY3QuaCAqIGhlaWdodDtcblxuICAgIGlmICh0aGlzLl9wcm9qZWN0aW9uID09PSBlbnVtcy5QUk9KX1BFUlNQRUNUSVZFKSB7XG4gICAgICAvLyBjYWxjdWxhdGUgc2NyZWVuIHBvcyBpbiBmYXIgY2xpcCBwbGFuZVxuICAgICAgVmVjMy5zZXQob3V0LFxuICAgICAgICAoc2NyZWVuUG9zLnggLSBjeCkgLyBjdyAqIDIgLSAxLFxuICAgICAgICAoc2NyZWVuUG9zLnkgLSBjeSkgLyBjaCAqIDIgLSAxLFxuICAgICAgICAwLjk5OTlcbiAgICAgICk7XG5cbiAgICAgIC8vIHRyYW5zZm9ybSB0byB3b3JsZFxuICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KG91dCwgb3V0LCBfbWF0SW52Vmlld1Byb2opO1xuXG4gICAgICAvLyBsZXJwIHRvIGRlcHRoIHpcbiAgICAgIHRoaXMuX25vZGUuZ2V0V29ybGRQb3NpdGlvbihfdG1wX3YzKTtcblxuICAgICAgVmVjMy5sZXJwKG91dCwgX3RtcF92Mywgb3V0LCBsZXJwKHRoaXMuX25lYXIgLyB0aGlzLl9mYXIsIDEsIHNjcmVlblBvcy56KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIFZlYzMuc2V0KG91dCxcbiAgICAgICAgKHNjcmVlblBvcy54IC0gY3gpIC8gY3cgKiAyIC0gMSxcbiAgICAgICAgKHNjcmVlblBvcy55IC0gY3kpIC8gY2ggKiAyIC0gMSxcbiAgICAgICAgc2NyZWVuUG9zLnogKiAyIC0gMVxuICAgICAgKTtcblxuICAgICAgLy8gdHJhbnNmb3JtIHRvIHdvcmxkXG4gICAgICBWZWMzLnRyYW5zZm9ybU1hdDQob3V0LCBvdXQsIF9tYXRJbnZWaWV3UHJvaik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIC8qKlxuICAgKiB0cmFuc2Zvcm0gYSB3b3JsZCBzcGFjZSBwb3NpdGlvbiB0byBzY3JlZW4gc3BhY2VcbiAgICogQHBhcmFtIHtWZWMzfSBvdXQgdGhlIHJlc3VsdGluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHtWZWMzfSB3b3JsZFBvcyB0aGUgd29ybGQgc3BhY2UgcG9zaXRpb24gdG8gYmUgdHJhbnNmb3JtZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIGZyYW1lYnVmZmVyIHdpZHRoXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgZnJhbWVidWZmZXIgaGVpZ2h0XG4gICAqIEByZXR1cm5zIHtWZWMzfSB0aGUgcmVzdWx0aW5nIHZlY3RvclxuICAgKi9cbiAgd29ybGRUb1NjcmVlbiAob3V0LCB3b3JsZFBvcywgd2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMuX2NhbGNNYXRyaWNlcyh3aWR0aCwgaGVpZ2h0KTtcblxuICAgIGxldCBjeCA9IHRoaXMuX3JlY3QueCAqIHdpZHRoO1xuICAgIGxldCBjeSA9IHRoaXMuX3JlY3QueSAqIGhlaWdodDtcbiAgICBsZXQgY3cgPSB0aGlzLl9yZWN0LncgKiB3aWR0aDtcbiAgICBsZXQgY2ggPSB0aGlzLl9yZWN0LmggKiBoZWlnaHQ7XG5cbiAgICBWZWMzLnRyYW5zZm9ybU1hdDQob3V0LCB3b3JsZFBvcywgX21hdFZpZXdQcm9qKTtcbiAgICBvdXQueCA9IGN4ICsgKG91dC54ICsgMSkgKiAwLjUgKiBjdztcbiAgICBvdXQueSA9IGN5ICsgKG91dC55ICsgMSkgKiAwLjUgKiBjaDtcbiAgICBvdXQueiA9IG91dC56ICogMC41ICsgMC41O1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIC8qKlxuICAgKiB0cmFuc2Zvcm0gYSB3b3JsZCBzcGFjZSBtYXRyaXggdG8gc2NyZWVuIHNwYWNlXG4gICAqIEBwYXJhbSB7TWF0NH0gb3V0IHRoZSByZXN1bHRpbmcgdmVjdG9yXG4gICAqIEBwYXJhbSB7TWF0NH0gd29ybGRNYXRyaXggdGhlIHdvcmxkIHNwYWNlIG1hdHJpeCB0byBiZSB0cmFuc2Zvcm1lZFxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggZnJhbWVidWZmZXIgd2lkdGhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBmcmFtZWJ1ZmZlciBoZWlnaHRcbiAgICogQHJldHVybnMge01hdDR9IHRoZSByZXN1bHRpbmcgdmVjdG9yXG4gICAqL1xuICB3b3JsZE1hdHJpeFRvU2NyZWVuIChvdXQsIHdvcmxkTWF0cml4LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy5fY2FsY01hdHJpY2VzKHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgTWF0NC5tdWwob3V0LCBfbWF0Vmlld1Byb2osIHdvcmxkTWF0cml4KTtcblxuICAgIGxldCBoYWxmV2lkdGggPSB3aWR0aCAvIDI7XG4gICAgbGV0IGhhbGZIZWlnaHQgPSBoZWlnaHQgLyAyO1xuICAgIE1hdDQuaWRlbnRpdHkoX3RtcF9tYXQ0KTtcbiAgICBNYXQ0LnRyYW5zZm9ybShfdG1wX21hdDQsIF90bXBfbWF0NCwgVmVjMy5zZXQoX3RtcF92MywgaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAwKSk7XG4gICAgTWF0NC5zY2FsZShfdG1wX21hdDQsIF90bXBfbWF0NCwgVmVjMy5zZXQoX3RtcF92MywgaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAxKSk7XG5cbiAgICBNYXQ0Lm11bChvdXQsIF90bXBfbWF0NCwgb3V0KTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiLyJ9