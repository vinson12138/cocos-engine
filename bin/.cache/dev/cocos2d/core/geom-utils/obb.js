
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/geom-utils/obb.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _valueTypes = require("../value-types");

var _enums = _interopRequireDefault(require("./enums"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _v3_tmp = new _valueTypes.Vec3();

var _v3_tmp2 = new _valueTypes.Vec3();

var _m3_tmp = new _valueTypes.Mat3(); // https://zeuxcg.org/2010/10/17/aabb-from-obb-with-component-wise-abs/


var transform_extent_m3 = function transform_extent_m3(out, extent, m3) {
  var m3_tmpm = _m3_tmp.m,
      m3m = m3.m;
  m3_tmpm[0] = Math.abs(m3m[0]);
  m3_tmpm[1] = Math.abs(m3m[1]);
  m3_tmpm[2] = Math.abs(m3m[2]);
  m3_tmpm[3] = Math.abs(m3m[3]);
  m3_tmpm[4] = Math.abs(m3m[4]);
  m3_tmpm[5] = Math.abs(m3m[5]);
  m3_tmpm[6] = Math.abs(m3m[6]);
  m3_tmpm[7] = Math.abs(m3m[7]);
  m3_tmpm[8] = Math.abs(m3m[8]);

  _valueTypes.Vec3.transformMat3(out, extent, _m3_tmp);
};
/**
 * !#en obb
 * !#zh
 * 基础几何  方向包围盒。
 * @class geomUtils.Obb
 */


var obb = /*#__PURE__*/function () {
  /**
   * !#en
   * create a new obb
   * !#zh
   * 创建一个新的 obb 实例。
   * @method create
   * @param {Number} cx X coordinates of the shape relative to the origin.
   * @param {Number} cy Y coordinates of the shape relative to the origin.
   * @param {Number} cz Z coordinates of the shape relative to the origin.
   * @param {Number} hw Obb is half the width.
   * @param {Number} hh Obb is half the height.
   * @param {Number} hl Obb is half the Length.
   * @param {Number} ox_1 Direction matrix parameter.
   * @param {Number} ox_2 Direction matrix parameter.
   * @param {Number} ox_3 Direction matrix parameter.
   * @param {Number} oy_1 Direction matrix parameter.
   * @param {Number} oy_2 Direction matrix parameter.
   * @param {Number} oy_3 Direction matrix parameter.
   * @param {Number} oz_1 Direction matrix parameter.
   * @param {Number} oz_2 Direction matrix parameter.
   * @param {Number} oz_3 Direction matrix parameter.
   * @return {Obb} Direction Box.
   */
  obb.create = function create(cx, cy, cz, hw, hh, hl, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3) {
    return new obb(cx, cy, cz, hw, hh, hl, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
  }
  /**
   * !#en
   * clone a new obb
   * !#zh
   * 克隆一个 obb。
   * @method clone
   * @param {Obb} a The target of cloning.
   * @returns {Obb} New object cloned.
   */
  ;

  obb.clone = function clone(a) {
    var aom = a.orientation.m;
    return new obb(a.center.x, a.center.y, a.center.z, a.halfExtents.x, a.halfExtents.y, a.halfExtents.z, aom[0], aom[1], aom[2], aom[3], aom[4], aom[5], aom[6], aom[7], aom[8]);
  }
  /**
   * !#en
   * copy the values from one obb to another
   * !#zh
   * 将从一个 obb 的值复制到另一个 obb。
   * @method copy
   * @param {Obb} out Obb that accepts the operation.
   * @param {Obb} a Obb being copied.
   * @return {Obb} out Obb that accepts the operation.
   */
  ;

  obb.copy = function copy(out, a) {
    _valueTypes.Vec3.copy(out.center, a.center);

    _valueTypes.Vec3.copy(out.halfExtents, a.halfExtents);

    _valueTypes.Mat3.copy(out.orientation, a.orientation);

    return out;
  }
  /**
   * !#en
   * create a new obb from two corner points
   * !#zh
   * 用两个点创建一个新的 obb。
   * @method fromPoints
   * @param {Obb} out Obb that accepts the operation.
   * @param {Vec3} minPos The smallest point of obb.
   * @param {Vec3} maxPos Obb's maximum point.
   * @returns {Obb} out Obb that accepts the operation.
   */
  ;

  obb.fromPoints = function fromPoints(out, minPos, maxPos) {
    _valueTypes.Vec3.multiplyScalar(out.center, _valueTypes.Vec3.add(_v3_tmp, minPos, maxPos), 0.5);

    _valueTypes.Vec3.multiplyScalar(out.halfExtents, _valueTypes.Vec3.subtract(_v3_tmp2, maxPos, minPos), 0.5);

    _valueTypes.Mat3.identity(out.orientation);

    return out;
  }
  /**
   * !#en
   * Set the components of a obb to the given values
   * !#zh
   * 将给定 obb 的属性设置为给定的值。
   * @method set
   * @param {Number} cx X coordinates of the shape relative to the origin.
   * @param {Number} cy Y coordinates of the shape relative to the origin.
   * @param {Number} cz Z coordinates of the shape relative to the origin.
   * @param {Number} hw Obb is half the width.
   * @param {Number} hh Obb is half the height.
   * @param {Number} hl Obb is half the Length.
   * @param {Number} ox_1 Direction matrix parameter.
   * @param {Number} ox_2 Direction matrix parameter.
   * @param {Number} ox_3 Direction matrix parameter.
   * @param {Number} oy_1 Direction matrix parameter.
   * @param {Number} oy_2 Direction matrix parameter.
   * @param {Number} oy_3 Direction matrix parameter.
   * @param {Number} oz_1 Direction matrix parameter.
   * @param {Number} oz_2 Direction matrix parameter.
   * @param {Number} oz_3 Direction matrix parameter.
   * @return {Obb} out
   */
  ;

  obb.set = function set(out, cx, cy, cz, hw, hh, hl, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3) {
    _valueTypes.Vec3.set(out.center, cx, cy, cz);

    _valueTypes.Vec3.set(out.halfExtents, hw, hh, hl);

    _valueTypes.Mat3.set(out.orientation, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);

    return out;
  }
  /**
   * !#en
   * The center of the local coordinate.
   * !#zh
   * 本地坐标的中心点。
   * @property {Vec3} center
   */
  ;

  function obb(cx, cy, cz, hw, hh, hl, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3) {
    if (cx === void 0) {
      cx = 0;
    }

    if (cy === void 0) {
      cy = 0;
    }

    if (cz === void 0) {
      cz = 0;
    }

    if (hw === void 0) {
      hw = 1;
    }

    if (hh === void 0) {
      hh = 1;
    }

    if (hl === void 0) {
      hl = 1;
    }

    if (ox_1 === void 0) {
      ox_1 = 1;
    }

    if (ox_2 === void 0) {
      ox_2 = 0;
    }

    if (ox_3 === void 0) {
      ox_3 = 0;
    }

    if (oy_1 === void 0) {
      oy_1 = 0;
    }

    if (oy_2 === void 0) {
      oy_2 = 1;
    }

    if (oy_3 === void 0) {
      oy_3 = 0;
    }

    if (oz_1 === void 0) {
      oz_1 = 0;
    }

    if (oz_2 === void 0) {
      oz_2 = 0;
    }

    if (oz_3 === void 0) {
      oz_3 = 1;
    }

    this.center = void 0;
    this.halfExtents = void 0;
    this.orientation = void 0;
    this._type = void 0;
    this._type = _enums["default"].SHAPE_OBB;
    this.center = new _valueTypes.Vec3(cx, cy, cz);
    this.halfExtents = new _valueTypes.Vec3(hw, hh, hl);
    this.orientation = new _valueTypes.Mat3(ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
  }
  /**
   * !#en
   * Get the bounding points of this shape
   * !#zh
   * 获取 obb 的最小点和最大点。
   * @method getBoundary
   * @param {Vec3} minPos
   * @param {Vec3} maxPos
   */


  var _proto = obb.prototype;

  _proto.getBoundary = function getBoundary(minPos, maxPos) {
    transform_extent_m3(_v3_tmp, this.halfExtents, this.orientation);

    _valueTypes.Vec3.subtract(minPos, this.center, _v3_tmp);

    _valueTypes.Vec3.add(maxPos, this.center, _v3_tmp);
  }
  /**
   * !#en Transform this shape
   * !#zh
   * 将 out 根据这个 obb 的数据进行变换。
   * @method transform
   * @param {Mat4} m The transformation matrix.
   * @param {Vec3} pos The position part of the transformation.
   * @param {Quat} rot The rotating part of the transformation.
   * @param {Vec3} scale The scaling part of the transformation.
   * @param {Obb} out Target of transformation.
   */
  ;

  _proto.transform = function transform(m, pos, rot, scale, out) {
    _valueTypes.Vec3.transformMat4(out.center, this.center, m); // parent shape doesn't contain rotations for now


    _valueTypes.Mat3.fromQuat(out.orientation, rot);

    _valueTypes.Vec3.multiply(out.halfExtents, this.halfExtents, scale);
  }
  /**
   * !#en
   * Transform out based on this obb data.
   * !#zh
   * 将 out 根据这个 obb 的数据进行变换。
   * @method translateAndRotate
   * @param {Mat4} m The transformation matrix.
   * @param {Quat} rot The rotating part of the transformation.
   * @param {Obb} out Target of transformation.
   */
  ;

  _proto.translateAndRotate = function translateAndRotate(m, rot, out) {
    _valueTypes.Vec3.transformMat4(out.center, this.center, m); // parent shape doesn't contain rotations for now


    _valueTypes.Mat3.fromQuat(out.orientation, rot);
  }
  /**
   * !#en
   * Scale out based on this obb data.
   * !#zh
   * 将 out 根据这个 obb 的数据进行缩放。
   * @method setScale
   * @param {Vec3} scale Scale value.
   * @param {Obb} out Scaled target.
   */
  ;

  _proto.setScale = function setScale(scale, out) {
    _valueTypes.Vec3.multiply(out.halfExtents, this.halfExtents, scale);
  };

  _createClass(obb, [{
    key: "type",
    get:
    /**
     * !#zh
     * 获取形状的类型。
     * @property {number} type
     * @readonly
     */
    function get() {
      return this._type;
    }
  }]);

  return obb;
}();

exports["default"] = obb;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2dlb20tdXRpbHMvb2JiLnRzIl0sIm5hbWVzIjpbIl92M190bXAiLCJWZWMzIiwiX3YzX3RtcDIiLCJfbTNfdG1wIiwiTWF0MyIsInRyYW5zZm9ybV9leHRlbnRfbTMiLCJvdXQiLCJleHRlbnQiLCJtMyIsIm0zX3RtcG0iLCJtIiwibTNtIiwiTWF0aCIsImFicyIsInRyYW5zZm9ybU1hdDMiLCJvYmIiLCJjcmVhdGUiLCJjeCIsImN5IiwiY3oiLCJodyIsImhoIiwiaGwiLCJveF8xIiwib3hfMiIsIm94XzMiLCJveV8xIiwib3lfMiIsIm95XzMiLCJvel8xIiwib3pfMiIsIm96XzMiLCJjbG9uZSIsImEiLCJhb20iLCJvcmllbnRhdGlvbiIsImNlbnRlciIsIngiLCJ5IiwieiIsImhhbGZFeHRlbnRzIiwiY29weSIsImZyb21Qb2ludHMiLCJtaW5Qb3MiLCJtYXhQb3MiLCJtdWx0aXBseVNjYWxhciIsImFkZCIsInN1YnRyYWN0IiwiaWRlbnRpdHkiLCJzZXQiLCJfdHlwZSIsImVudW1zIiwiU0hBUEVfT0JCIiwiZ2V0Qm91bmRhcnkiLCJ0cmFuc2Zvcm0iLCJwb3MiLCJyb3QiLCJzY2FsZSIsInRyYW5zZm9ybU1hdDQiLCJmcm9tUXVhdCIsIm11bHRpcGx5IiwidHJhbnNsYXRlQW5kUm90YXRlIiwic2V0U2NhbGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTUEsT0FBTyxHQUFHLElBQUlDLGdCQUFKLEVBQWhCOztBQUNBLElBQU1DLFFBQVEsR0FBRyxJQUFJRCxnQkFBSixFQUFqQjs7QUFDQSxJQUFNRSxPQUFPLEdBQUcsSUFBSUMsZ0JBQUosRUFBaEIsRUFFQTs7O0FBQ0EsSUFBTUMsbUJBQW1CLEdBQUcsU0FBdEJBLG1CQUFzQixDQUFDQyxHQUFELEVBQVlDLE1BQVosRUFBMEJDLEVBQTFCLEVBQXVDO0FBQy9ELE1BQUlDLE9BQU8sR0FBR04sT0FBTyxDQUFDTyxDQUF0QjtBQUFBLE1BQXlCQyxHQUFHLEdBQUdILEVBQUUsQ0FBQ0UsQ0FBbEM7QUFDQUQsRUFBQUEsT0FBTyxDQUFDLENBQUQsQ0FBUCxHQUFhRyxJQUFJLENBQUNDLEdBQUwsQ0FBU0YsR0FBRyxDQUFDLENBQUQsQ0FBWixDQUFiO0FBQStCRixFQUFBQSxPQUFPLENBQUMsQ0FBRCxDQUFQLEdBQWFHLElBQUksQ0FBQ0MsR0FBTCxDQUFTRixHQUFHLENBQUMsQ0FBRCxDQUFaLENBQWI7QUFBK0JGLEVBQUFBLE9BQU8sQ0FBQyxDQUFELENBQVAsR0FBYUcsSUFBSSxDQUFDQyxHQUFMLENBQVNGLEdBQUcsQ0FBQyxDQUFELENBQVosQ0FBYjtBQUM5REYsRUFBQUEsT0FBTyxDQUFDLENBQUQsQ0FBUCxHQUFhRyxJQUFJLENBQUNDLEdBQUwsQ0FBU0YsR0FBRyxDQUFDLENBQUQsQ0FBWixDQUFiO0FBQStCRixFQUFBQSxPQUFPLENBQUMsQ0FBRCxDQUFQLEdBQWFHLElBQUksQ0FBQ0MsR0FBTCxDQUFTRixHQUFHLENBQUMsQ0FBRCxDQUFaLENBQWI7QUFBK0JGLEVBQUFBLE9BQU8sQ0FBQyxDQUFELENBQVAsR0FBYUcsSUFBSSxDQUFDQyxHQUFMLENBQVNGLEdBQUcsQ0FBQyxDQUFELENBQVosQ0FBYjtBQUM5REYsRUFBQUEsT0FBTyxDQUFDLENBQUQsQ0FBUCxHQUFhRyxJQUFJLENBQUNDLEdBQUwsQ0FBU0YsR0FBRyxDQUFDLENBQUQsQ0FBWixDQUFiO0FBQStCRixFQUFBQSxPQUFPLENBQUMsQ0FBRCxDQUFQLEdBQWFHLElBQUksQ0FBQ0MsR0FBTCxDQUFTRixHQUFHLENBQUMsQ0FBRCxDQUFaLENBQWI7QUFBK0JGLEVBQUFBLE9BQU8sQ0FBQyxDQUFELENBQVAsR0FBYUcsSUFBSSxDQUFDQyxHQUFMLENBQVNGLEdBQUcsQ0FBQyxDQUFELENBQVosQ0FBYjs7QUFDOURWLG1CQUFLYSxhQUFMLENBQW1CUixHQUFuQixFQUF3QkMsTUFBeEIsRUFBZ0NKLE9BQWhDO0FBQ0gsQ0FORDtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0lBQ3FCWTtBQVlqQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO01BQ2tCQyxTQUFkLGdCQUNJQyxFQURKLEVBQ2dCQyxFQURoQixFQUM0QkMsRUFENUIsRUFFSUMsRUFGSixFQUVnQkMsRUFGaEIsRUFFNEJDLEVBRjVCLEVBR0lDLElBSEosRUFHa0JDLElBSGxCLEVBR2dDQyxJQUhoQyxFQUlJQyxJQUpKLEVBSWtCQyxJQUpsQixFQUlnQ0MsSUFKaEMsRUFLSUMsSUFMSixFQUtrQkMsSUFMbEIsRUFLZ0NDLElBTGhDLEVBSzhDO0FBQzFDLFdBQU8sSUFBSWhCLEdBQUosQ0FBUUUsRUFBUixFQUFZQyxFQUFaLEVBQWdCQyxFQUFoQixFQUFvQkMsRUFBcEIsRUFBd0JDLEVBQXhCLEVBQTRCQyxFQUE1QixFQUFnQ0MsSUFBaEMsRUFBc0NDLElBQXRDLEVBQTRDQyxJQUE1QyxFQUFrREMsSUFBbEQsRUFBd0RDLElBQXhELEVBQThEQyxJQUE5RCxFQUFvRUMsSUFBcEUsRUFBMEVDLElBQTFFLEVBQWdGQyxJQUFoRixDQUFQO0FBQ0g7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztNQUNrQkMsUUFBZCxlQUFxQkMsQ0FBckIsRUFBNkI7QUFDekIsUUFBSUMsR0FBRyxHQUFHRCxDQUFDLENBQUNFLFdBQUYsQ0FBY3pCLENBQXhCO0FBQ0EsV0FBTyxJQUFJSyxHQUFKLENBQVFrQixDQUFDLENBQUNHLE1BQUYsQ0FBU0MsQ0FBakIsRUFBb0JKLENBQUMsQ0FBQ0csTUFBRixDQUFTRSxDQUE3QixFQUFnQ0wsQ0FBQyxDQUFDRyxNQUFGLENBQVNHLENBQXpDLEVBQ0hOLENBQUMsQ0FBQ08sV0FBRixDQUFjSCxDQURYLEVBQ2NKLENBQUMsQ0FBQ08sV0FBRixDQUFjRixDQUQ1QixFQUMrQkwsQ0FBQyxDQUFDTyxXQUFGLENBQWNELENBRDdDLEVBRUhMLEdBQUcsQ0FBQyxDQUFELENBRkEsRUFFS0EsR0FBRyxDQUFDLENBQUQsQ0FGUixFQUVhQSxHQUFHLENBQUMsQ0FBRCxDQUZoQixFQUdIQSxHQUFHLENBQUMsQ0FBRCxDQUhBLEVBR0tBLEdBQUcsQ0FBQyxDQUFELENBSFIsRUFHYUEsR0FBRyxDQUFDLENBQUQsQ0FIaEIsRUFJSEEsR0FBRyxDQUFDLENBQUQsQ0FKQSxFQUlLQSxHQUFHLENBQUMsQ0FBRCxDQUpSLEVBSWFBLEdBQUcsQ0FBQyxDQUFELENBSmhCLENBQVA7QUFLSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7TUFDa0JPLE9BQWQsY0FBb0JuQyxHQUFwQixFQUE4QjJCLENBQTlCLEVBQTJDO0FBQ3ZDaEMscUJBQUt3QyxJQUFMLENBQVVuQyxHQUFHLENBQUM4QixNQUFkLEVBQXNCSCxDQUFDLENBQUNHLE1BQXhCOztBQUNBbkMscUJBQUt3QyxJQUFMLENBQVVuQyxHQUFHLENBQUNrQyxXQUFkLEVBQTJCUCxDQUFDLENBQUNPLFdBQTdCOztBQUNBcEMscUJBQUtxQyxJQUFMLENBQVVuQyxHQUFHLENBQUM2QixXQUFkLEVBQTJCRixDQUFDLENBQUNFLFdBQTdCOztBQUVBLFdBQU83QixHQUFQO0FBQ0g7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7TUFDa0JvQyxhQUFkLG9CQUEwQnBDLEdBQTFCLEVBQW9DcUMsTUFBcEMsRUFBa0RDLE1BQWxELEVBQXFFO0FBQ2pFM0MscUJBQUs0QyxjQUFMLENBQW9CdkMsR0FBRyxDQUFDOEIsTUFBeEIsRUFBZ0NuQyxpQkFBSzZDLEdBQUwsQ0FBUzlDLE9BQVQsRUFBa0IyQyxNQUFsQixFQUEwQkMsTUFBMUIsQ0FBaEMsRUFBbUUsR0FBbkU7O0FBQ0EzQyxxQkFBSzRDLGNBQUwsQ0FBb0J2QyxHQUFHLENBQUNrQyxXQUF4QixFQUFxQ3ZDLGlCQUFLOEMsUUFBTCxDQUFjN0MsUUFBZCxFQUF3QjBDLE1BQXhCLEVBQWdDRCxNQUFoQyxDQUFyQyxFQUE4RSxHQUE5RTs7QUFDQXZDLHFCQUFLNEMsUUFBTCxDQUFjMUMsR0FBRyxDQUFDNkIsV0FBbEI7O0FBQ0EsV0FBTzdCLEdBQVA7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztNQUNrQjJDLE1BQWQsYUFDSTNDLEdBREosRUFFSVcsRUFGSixFQUVnQkMsRUFGaEIsRUFFNEJDLEVBRjVCLEVBR0lDLEVBSEosRUFHZ0JDLEVBSGhCLEVBRzRCQyxFQUg1QixFQUlJQyxJQUpKLEVBSWtCQyxJQUpsQixFQUlnQ0MsSUFKaEMsRUFLSUMsSUFMSixFQUtrQkMsSUFMbEIsRUFLZ0NDLElBTGhDLEVBTUlDLElBTkosRUFNa0JDLElBTmxCLEVBTWdDQyxJQU5oQyxFQU1tRDtBQUMvQzlCLHFCQUFLZ0QsR0FBTCxDQUFTM0MsR0FBRyxDQUFDOEIsTUFBYixFQUFxQm5CLEVBQXJCLEVBQXlCQyxFQUF6QixFQUE2QkMsRUFBN0I7O0FBQ0FsQixxQkFBS2dELEdBQUwsQ0FBUzNDLEdBQUcsQ0FBQ2tDLFdBQWIsRUFBMEJwQixFQUExQixFQUE4QkMsRUFBOUIsRUFBa0NDLEVBQWxDOztBQUNBbEIscUJBQUs2QyxHQUFMLENBQVMzQyxHQUFHLENBQUM2QixXQUFiLEVBQTBCWixJQUExQixFQUFnQ0MsSUFBaEMsRUFBc0NDLElBQXRDLEVBQTRDQyxJQUE1QyxFQUFrREMsSUFBbEQsRUFBd0RDLElBQXhELEVBQThEQyxJQUE5RCxFQUFvRUMsSUFBcEUsRUFBMEVDLElBQTFFOztBQUNBLFdBQU96QixHQUFQO0FBQ0g7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBdUJJLGVBQWFXLEVBQWIsRUFBcUJDLEVBQXJCLEVBQTZCQyxFQUE3QixFQUNhQyxFQURiLEVBQ3FCQyxFQURyQixFQUM2QkMsRUFEN0IsRUFFYUMsSUFGYixFQUV1QkMsSUFGdkIsRUFFaUNDLElBRmpDLEVBR2FDLElBSGIsRUFHdUJDLElBSHZCLEVBR2lDQyxJQUhqQyxFQUlhQyxJQUpiLEVBSXVCQyxJQUp2QixFQUlpQ0MsSUFKakMsRUFJMkM7QUFBQSxRQUo5QmQsRUFJOEI7QUFKOUJBLE1BQUFBLEVBSThCLEdBSnpCLENBSXlCO0FBQUE7O0FBQUEsUUFKdEJDLEVBSXNCO0FBSnRCQSxNQUFBQSxFQUlzQixHQUpqQixDQUlpQjtBQUFBOztBQUFBLFFBSmRDLEVBSWM7QUFKZEEsTUFBQUEsRUFJYyxHQUpULENBSVM7QUFBQTs7QUFBQSxRQUg5QkMsRUFHOEI7QUFIOUJBLE1BQUFBLEVBRzhCLEdBSHpCLENBR3lCO0FBQUE7O0FBQUEsUUFIdEJDLEVBR3NCO0FBSHRCQSxNQUFBQSxFQUdzQixHQUhqQixDQUdpQjtBQUFBOztBQUFBLFFBSGRDLEVBR2M7QUFIZEEsTUFBQUEsRUFHYyxHQUhULENBR1M7QUFBQTs7QUFBQSxRQUY5QkMsSUFFOEI7QUFGOUJBLE1BQUFBLElBRThCLEdBRnZCLENBRXVCO0FBQUE7O0FBQUEsUUFGcEJDLElBRW9CO0FBRnBCQSxNQUFBQSxJQUVvQixHQUZiLENBRWE7QUFBQTs7QUFBQSxRQUZWQyxJQUVVO0FBRlZBLE1BQUFBLElBRVUsR0FGSCxDQUVHO0FBQUE7O0FBQUEsUUFEOUJDLElBQzhCO0FBRDlCQSxNQUFBQSxJQUM4QixHQUR2QixDQUN1QjtBQUFBOztBQUFBLFFBRHBCQyxJQUNvQjtBQURwQkEsTUFBQUEsSUFDb0IsR0FEYixDQUNhO0FBQUE7O0FBQUEsUUFEVkMsSUFDVTtBQURWQSxNQUFBQSxJQUNVLEdBREgsQ0FDRztBQUFBOztBQUFBLFFBQTlCQyxJQUE4QjtBQUE5QkEsTUFBQUEsSUFBOEIsR0FBdkIsQ0FBdUI7QUFBQTs7QUFBQSxRQUFwQkMsSUFBb0I7QUFBcEJBLE1BQUFBLElBQW9CLEdBQWIsQ0FBYTtBQUFBOztBQUFBLFFBQVZDLElBQVU7QUFBVkEsTUFBQUEsSUFBVSxHQUFILENBQUc7QUFBQTs7QUFBQSxTQTFCcENLLE1BMEJvQztBQUFBLFNBakJwQ0ksV0FpQm9DO0FBQUEsU0FScENMLFdBUW9DO0FBQUEsU0FOakNlLEtBTWlDO0FBQ3ZDLFNBQUtBLEtBQUwsR0FBYUMsa0JBQU1DLFNBQW5CO0FBQ0EsU0FBS2hCLE1BQUwsR0FBYyxJQUFJbkMsZ0JBQUosQ0FBU2dCLEVBQVQsRUFBYUMsRUFBYixFQUFpQkMsRUFBakIsQ0FBZDtBQUNBLFNBQUtxQixXQUFMLEdBQW1CLElBQUl2QyxnQkFBSixDQUFTbUIsRUFBVCxFQUFhQyxFQUFiLEVBQWlCQyxFQUFqQixDQUFuQjtBQUNBLFNBQUthLFdBQUwsR0FBbUIsSUFBSS9CLGdCQUFKLENBQVNtQixJQUFULEVBQWVDLElBQWYsRUFBcUJDLElBQXJCLEVBQTJCQyxJQUEzQixFQUFpQ0MsSUFBakMsRUFBdUNDLElBQXZDLEVBQTZDQyxJQUE3QyxFQUFtREMsSUFBbkQsRUFBeURDLElBQXpELENBQW5CO0FBQ0g7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O1NBQ1dzQixjQUFQLHFCQUFvQlYsTUFBcEIsRUFBa0NDLE1BQWxDLEVBQWdEO0FBQzVDdkMsSUFBQUEsbUJBQW1CLENBQUNMLE9BQUQsRUFBVSxLQUFLd0MsV0FBZixFQUE0QixLQUFLTCxXQUFqQyxDQUFuQjs7QUFDQWxDLHFCQUFLOEMsUUFBTCxDQUFjSixNQUFkLEVBQXNCLEtBQUtQLE1BQTNCLEVBQW1DcEMsT0FBbkM7O0FBQ0FDLHFCQUFLNkMsR0FBTCxDQUFTRixNQUFULEVBQWlCLEtBQUtSLE1BQXRCLEVBQThCcEMsT0FBOUI7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUNXc0QsWUFBUCxtQkFBa0I1QyxDQUFsQixFQUEyQjZDLEdBQTNCLEVBQXNDQyxHQUF0QyxFQUFpREMsS0FBakQsRUFBOERuRCxHQUE5RCxFQUF3RTtBQUNwRUwscUJBQUt5RCxhQUFMLENBQW1CcEQsR0FBRyxDQUFDOEIsTUFBdkIsRUFBK0IsS0FBS0EsTUFBcEMsRUFBNEMxQixDQUE1QyxFQURvRSxDQUVwRTs7O0FBQ0FOLHFCQUFLdUQsUUFBTCxDQUFjckQsR0FBRyxDQUFDNkIsV0FBbEIsRUFBK0JxQixHQUEvQjs7QUFDQXZELHFCQUFLMkQsUUFBTCxDQUFjdEQsR0FBRyxDQUFDa0MsV0FBbEIsRUFBK0IsS0FBS0EsV0FBcEMsRUFBaURpQixLQUFqRDtBQUNIO0FBRUQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUNXSSxxQkFBUCw0QkFBMkJuRCxDQUEzQixFQUFvQzhDLEdBQXBDLEVBQStDbEQsR0FBL0MsRUFBd0Q7QUFDcERMLHFCQUFLeUQsYUFBTCxDQUFtQnBELEdBQUcsQ0FBQzhCLE1BQXZCLEVBQStCLEtBQUtBLE1BQXBDLEVBQTRDMUIsQ0FBNUMsRUFEb0QsQ0FFcEQ7OztBQUNBTixxQkFBS3VELFFBQUwsQ0FBY3JELEdBQUcsQ0FBQzZCLFdBQWxCLEVBQStCcUIsR0FBL0I7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O1NBQ1dNLFdBQVAsa0JBQWlCTCxLQUFqQixFQUE4Qm5ELEdBQTlCLEVBQXdDO0FBQ3BDTCxxQkFBSzJELFFBQUwsQ0FBY3RELEdBQUcsQ0FBQ2tDLFdBQWxCLEVBQStCLEtBQUtBLFdBQXBDLEVBQWlEaUIsS0FBakQ7QUFDSDs7Ozs7QUF4T0Q7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0ksbUJBQVk7QUFDUixhQUFPLEtBQUtQLEtBQVo7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgeyBNYXQzLCBNYXQ0LCBRdWF0LCBWZWMzIH0gZnJvbSAnLi4vdmFsdWUtdHlwZXMnO1xuaW1wb3J0IGVudW1zIGZyb20gJy4vZW51bXMnO1xuXG5jb25zdCBfdjNfdG1wID0gbmV3IFZlYzMoKTtcbmNvbnN0IF92M190bXAyID0gbmV3IFZlYzMoKTtcbmNvbnN0IF9tM190bXAgPSBuZXcgTWF0MygpO1xuXG4vLyBodHRwczovL3pldXhjZy5vcmcvMjAxMC8xMC8xNy9hYWJiLWZyb20tb2JiLXdpdGgtY29tcG9uZW50LXdpc2UtYWJzL1xuY29uc3QgdHJhbnNmb3JtX2V4dGVudF9tMyA9IChvdXQ6IFZlYzMsIGV4dGVudDogVmVjMywgbTM6IE1hdDMpID0+IHtcbiAgICBsZXQgbTNfdG1wbSA9IF9tM190bXAubSwgbTNtID0gbTMubTtcbiAgICBtM190bXBtWzBdID0gTWF0aC5hYnMobTNtWzBdKTsgbTNfdG1wbVsxXSA9IE1hdGguYWJzKG0zbVsxXSk7IG0zX3RtcG1bMl0gPSBNYXRoLmFicyhtM21bMl0pO1xuICAgIG0zX3RtcG1bM10gPSBNYXRoLmFicyhtM21bM10pOyBtM190bXBtWzRdID0gTWF0aC5hYnMobTNtWzRdKTsgbTNfdG1wbVs1XSA9IE1hdGguYWJzKG0zbVs1XSk7XG4gICAgbTNfdG1wbVs2XSA9IE1hdGguYWJzKG0zbVs2XSk7IG0zX3RtcG1bN10gPSBNYXRoLmFicyhtM21bN10pOyBtM190bXBtWzhdID0gTWF0aC5hYnMobTNtWzhdKTtcbiAgICBWZWMzLnRyYW5zZm9ybU1hdDMob3V0LCBleHRlbnQsIF9tM190bXApO1xufTtcblxuLyoqXG4gKiAhI2VuIG9iYlxuICogISN6aFxuICog5Z+656GA5Yeg5L2VICDmlrnlkJHljIXlm7Tnm5LjgIJcbiAqIEBjbGFzcyBnZW9tVXRpbHMuT2JiXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIG9iYiB7XG5cbiAgICAvKipcbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5b2i54q255qE57G75Z6L44CCXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHR5cGVcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBnZXQgdHlwZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBjcmVhdGUgYSBuZXcgb2JiXG4gICAgICogISN6aFxuICAgICAqIOWIm+W7uuS4gOS4quaWsOeahCBvYmIg5a6e5L6L44CCXG4gICAgICogQG1ldGhvZCBjcmVhdGVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gY3ggWCBjb29yZGluYXRlcyBvZiB0aGUgc2hhcGUgcmVsYXRpdmUgdG8gdGhlIG9yaWdpbi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gY3kgWSBjb29yZGluYXRlcyBvZiB0aGUgc2hhcGUgcmVsYXRpdmUgdG8gdGhlIG9yaWdpbi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gY3ogWiBjb29yZGluYXRlcyBvZiB0aGUgc2hhcGUgcmVsYXRpdmUgdG8gdGhlIG9yaWdpbi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaHcgT2JiIGlzIGhhbGYgdGhlIHdpZHRoLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoaCBPYmIgaXMgaGFsZiB0aGUgaGVpZ2h0LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBobCBPYmIgaXMgaGFsZiB0aGUgTGVuZ3RoLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBveF8xIERpcmVjdGlvbiBtYXRyaXggcGFyYW1ldGVyLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBveF8yIERpcmVjdGlvbiBtYXRyaXggcGFyYW1ldGVyLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBveF8zIERpcmVjdGlvbiBtYXRyaXggcGFyYW1ldGVyLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBveV8xIERpcmVjdGlvbiBtYXRyaXggcGFyYW1ldGVyLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBveV8yIERpcmVjdGlvbiBtYXRyaXggcGFyYW1ldGVyLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBveV8zIERpcmVjdGlvbiBtYXRyaXggcGFyYW1ldGVyLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvel8xIERpcmVjdGlvbiBtYXRyaXggcGFyYW1ldGVyLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvel8yIERpcmVjdGlvbiBtYXRyaXggcGFyYW1ldGVyLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvel8zIERpcmVjdGlvbiBtYXRyaXggcGFyYW1ldGVyLlxuICAgICAqIEByZXR1cm4ge09iYn0gRGlyZWN0aW9uIEJveC5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZSAoXG4gICAgICAgIGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIGN6OiBudW1iZXIsXG4gICAgICAgIGh3OiBudW1iZXIsIGhoOiBudW1iZXIsIGhsOiBudW1iZXIsXG4gICAgICAgIG94XzE6IG51bWJlciwgb3hfMjogbnVtYmVyLCBveF8zOiBudW1iZXIsXG4gICAgICAgIG95XzE6IG51bWJlciwgb3lfMjogbnVtYmVyLCBveV8zOiBudW1iZXIsXG4gICAgICAgIG96XzE6IG51bWJlciwgb3pfMjogbnVtYmVyLCBvel8zOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBvYmIoY3gsIGN5LCBjeiwgaHcsIGhoLCBobCwgb3hfMSwgb3hfMiwgb3hfMywgb3lfMSwgb3lfMiwgb3lfMywgb3pfMSwgb3pfMiwgb3pfMyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIGNsb25lIGEgbmV3IG9iYlxuICAgICAqICEjemhcbiAgICAgKiDlhYvpmobkuIDkuKogb2Ji44CCXG4gICAgICogQG1ldGhvZCBjbG9uZVxuICAgICAqIEBwYXJhbSB7T2JifSBhIFRoZSB0YXJnZXQgb2YgY2xvbmluZy5cbiAgICAgKiBAcmV0dXJucyB7T2JifSBOZXcgb2JqZWN0IGNsb25lZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGNsb25lIChhOiBvYmIpIHtcbiAgICAgICAgbGV0IGFvbSA9IGEub3JpZW50YXRpb24ubTtcbiAgICAgICAgcmV0dXJuIG5ldyBvYmIoYS5jZW50ZXIueCwgYS5jZW50ZXIueSwgYS5jZW50ZXIueixcbiAgICAgICAgICAgIGEuaGFsZkV4dGVudHMueCwgYS5oYWxmRXh0ZW50cy55LCBhLmhhbGZFeHRlbnRzLnosXG4gICAgICAgICAgICBhb21bMF0sIGFvbVsxXSwgYW9tWzJdLFxuICAgICAgICAgICAgYW9tWzNdLCBhb21bNF0sIGFvbVs1XSxcbiAgICAgICAgICAgIGFvbVs2XSwgYW9tWzddLCBhb21bOF0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBjb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgb2JiIHRvIGFub3RoZXJcbiAgICAgKiAhI3poXG4gICAgICog5bCG5LuO5LiA5LiqIG9iYiDnmoTlgLzlpI3liLbliLDlj6bkuIDkuKogb2Ji44CCXG4gICAgICogQG1ldGhvZCBjb3B5XG4gICAgICogQHBhcmFtIHtPYmJ9IG91dCBPYmIgdGhhdCBhY2NlcHRzIHRoZSBvcGVyYXRpb24uXG4gICAgICogQHBhcmFtIHtPYmJ9IGEgT2JiIGJlaW5nIGNvcGllZC5cbiAgICAgKiBAcmV0dXJuIHtPYmJ9IG91dCBPYmIgdGhhdCBhY2NlcHRzIHRoZSBvcGVyYXRpb24uXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjb3B5IChvdXQ6IG9iYiwgYTogb2JiKTogb2JiIHtcbiAgICAgICAgVmVjMy5jb3B5KG91dC5jZW50ZXIsIGEuY2VudGVyKTtcbiAgICAgICAgVmVjMy5jb3B5KG91dC5oYWxmRXh0ZW50cywgYS5oYWxmRXh0ZW50cyk7XG4gICAgICAgIE1hdDMuY29weShvdXQub3JpZW50YXRpb24sIGEub3JpZW50YXRpb24pO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIGNyZWF0ZSBhIG5ldyBvYmIgZnJvbSB0d28gY29ybmVyIHBvaW50c1xuICAgICAqICEjemhcbiAgICAgKiDnlKjkuKTkuKrngrnliJvlu7rkuIDkuKrmlrDnmoQgb2Ji44CCXG4gICAgICogQG1ldGhvZCBmcm9tUG9pbnRzXG4gICAgICogQHBhcmFtIHtPYmJ9IG91dCBPYmIgdGhhdCBhY2NlcHRzIHRoZSBvcGVyYXRpb24uXG4gICAgICogQHBhcmFtIHtWZWMzfSBtaW5Qb3MgVGhlIHNtYWxsZXN0IHBvaW50IG9mIG9iYi5cbiAgICAgKiBAcGFyYW0ge1ZlYzN9IG1heFBvcyBPYmIncyBtYXhpbXVtIHBvaW50LlxuICAgICAqIEByZXR1cm5zIHtPYmJ9IG91dCBPYmIgdGhhdCBhY2NlcHRzIHRoZSBvcGVyYXRpb24uXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBmcm9tUG9pbnRzIChvdXQ6IG9iYiwgbWluUG9zOiBWZWMzLCBtYXhQb3M6IFZlYzMpOiBvYmIge1xuICAgICAgICBWZWMzLm11bHRpcGx5U2NhbGFyKG91dC5jZW50ZXIsIFZlYzMuYWRkKF92M190bXAsIG1pblBvcywgbWF4UG9zKSwgMC41KTtcbiAgICAgICAgVmVjMy5tdWx0aXBseVNjYWxhcihvdXQuaGFsZkV4dGVudHMsIFZlYzMuc3VidHJhY3QoX3YzX3RtcDIsIG1heFBvcywgbWluUG9zKSwgMC41KTtcbiAgICAgICAgTWF0My5pZGVudGl0eShvdXQub3JpZW50YXRpb24pO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTZXQgdGhlIGNvbXBvbmVudHMgb2YgYSBvYmIgdG8gdGhlIGdpdmVuIHZhbHVlc1xuICAgICAqICEjemhcbiAgICAgKiDlsIbnu5nlrpogb2JiIOeahOWxnuaAp+iuvue9ruS4uue7meWumueahOWAvOOAglxuICAgICAqIEBtZXRob2Qgc2V0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGN4IFggY29vcmRpbmF0ZXMgb2YgdGhlIHNoYXBlIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW4uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGN5IFkgY29vcmRpbmF0ZXMgb2YgdGhlIHNoYXBlIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW4uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGN6IFogY29vcmRpbmF0ZXMgb2YgdGhlIHNoYXBlIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW4uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGh3IE9iYiBpcyBoYWxmIHRoZSB3aWR0aC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaGggT2JiIGlzIGhhbGYgdGhlIGhlaWdodC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaGwgT2JiIGlzIGhhbGYgdGhlIExlbmd0aC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb3hfMSBEaXJlY3Rpb24gbWF0cml4IHBhcmFtZXRlci5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb3hfMiBEaXJlY3Rpb24gbWF0cml4IHBhcmFtZXRlci5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb3hfMyBEaXJlY3Rpb24gbWF0cml4IHBhcmFtZXRlci5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb3lfMSBEaXJlY3Rpb24gbWF0cml4IHBhcmFtZXRlci5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb3lfMiBEaXJlY3Rpb24gbWF0cml4IHBhcmFtZXRlci5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb3lfMyBEaXJlY3Rpb24gbWF0cml4IHBhcmFtZXRlci5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb3pfMSBEaXJlY3Rpb24gbWF0cml4IHBhcmFtZXRlci5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb3pfMiBEaXJlY3Rpb24gbWF0cml4IHBhcmFtZXRlci5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb3pfMyBEaXJlY3Rpb24gbWF0cml4IHBhcmFtZXRlci5cbiAgICAgKiBAcmV0dXJuIHtPYmJ9IG91dFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2V0IChcbiAgICAgICAgb3V0OiBvYmIsXG4gICAgICAgIGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIGN6OiBudW1iZXIsXG4gICAgICAgIGh3OiBudW1iZXIsIGhoOiBudW1iZXIsIGhsOiBudW1iZXIsXG4gICAgICAgIG94XzE6IG51bWJlciwgb3hfMjogbnVtYmVyLCBveF8zOiBudW1iZXIsXG4gICAgICAgIG95XzE6IG51bWJlciwgb3lfMjogbnVtYmVyLCBveV8zOiBudW1iZXIsXG4gICAgICAgIG96XzE6IG51bWJlciwgb3pfMjogbnVtYmVyLCBvel8zOiBudW1iZXIpOiBvYmIge1xuICAgICAgICBWZWMzLnNldChvdXQuY2VudGVyLCBjeCwgY3ksIGN6KTtcbiAgICAgICAgVmVjMy5zZXQob3V0LmhhbGZFeHRlbnRzLCBodywgaGgsIGhsKTtcbiAgICAgICAgTWF0My5zZXQob3V0Lm9yaWVudGF0aW9uLCBveF8xLCBveF8yLCBveF8zLCBveV8xLCBveV8yLCBveV8zLCBvel8xLCBvel8yLCBvel8zKTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVGhlIGNlbnRlciBvZiB0aGUgbG9jYWwgY29vcmRpbmF0ZS5cbiAgICAgKiAhI3poXG4gICAgICog5pys5Zyw5Z2Q5qCH55qE5Lit5b+D54K544CCXG4gICAgICogQHByb3BlcnR5IHtWZWMzfSBjZW50ZXJcbiAgICAgKi9cbiAgICBwdWJsaWMgY2VudGVyOiBWZWMzO1xuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEhhbGYgdGhlIGxlbmd0aCwgd2lkdGgsIGFuZCBoZWlnaHQuXG4gICAgICogISN6aFxuICAgICAqIOmVv+WuvemrmOeahOS4gOWNiuOAglxuICAgICAqIEBwcm9wZXJ0eSB7VmVjM30gaGFsZkV4dGVudHNcbiAgICAgKi9cbiAgICBwdWJsaWMgaGFsZkV4dGVudHM6IFZlYzM7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogRGlyZWN0aW9uIG1hdHJpeC5cbiAgICAgKiAhI3poXG4gICAgICog5pa55ZCR55+p6Zi144CCXG4gICAgICogQHByb3BlcnR5IHtNYXQzfSBvcmllbnRhdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBvcmllbnRhdGlvbjogTWF0MztcblxuICAgIHByb3RlY3RlZCBfdHlwZTogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IgKGN4ID0gMCwgY3kgPSAwLCBjeiA9IDAsXG4gICAgICAgICAgICAgICAgIGh3ID0gMSwgaGggPSAxLCBobCA9IDEsXG4gICAgICAgICAgICAgICAgIG94XzEgPSAxLCBveF8yID0gMCwgb3hfMyA9IDAsXG4gICAgICAgICAgICAgICAgIG95XzEgPSAwLCBveV8yID0gMSwgb3lfMyA9IDAsXG4gICAgICAgICAgICAgICAgIG96XzEgPSAwLCBvel8yID0gMCwgb3pfMyA9IDEpIHtcbiAgICAgICAgdGhpcy5fdHlwZSA9IGVudW1zLlNIQVBFX09CQjtcbiAgICAgICAgdGhpcy5jZW50ZXIgPSBuZXcgVmVjMyhjeCwgY3ksIGN6KTtcbiAgICAgICAgdGhpcy5oYWxmRXh0ZW50cyA9IG5ldyBWZWMzKGh3LCBoaCwgaGwpO1xuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gbmV3IE1hdDMob3hfMSwgb3hfMiwgb3hfMywgb3lfMSwgb3lfMiwgb3lfMywgb3pfMSwgb3pfMiwgb3pfMyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldCB0aGUgYm91bmRpbmcgcG9pbnRzIG9mIHRoaXMgc2hhcGVcbiAgICAgKiAhI3poXG4gICAgICog6I635Y+WIG9iYiDnmoTmnIDlsI/ngrnlkozmnIDlpKfngrnjgIJcbiAgICAgKiBAbWV0aG9kIGdldEJvdW5kYXJ5XG4gICAgICogQHBhcmFtIHtWZWMzfSBtaW5Qb3NcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IG1heFBvc1xuICAgICAqL1xuICAgIHB1YmxpYyBnZXRCb3VuZGFyeSAobWluUG9zOiBWZWMzLCBtYXhQb3M6IFZlYzMpIHtcbiAgICAgICAgdHJhbnNmb3JtX2V4dGVudF9tMyhfdjNfdG1wLCB0aGlzLmhhbGZFeHRlbnRzLCB0aGlzLm9yaWVudGF0aW9uKTtcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChtaW5Qb3MsIHRoaXMuY2VudGVyLCBfdjNfdG1wKTtcbiAgICAgICAgVmVjMy5hZGQobWF4UG9zLCB0aGlzLmNlbnRlciwgX3YzX3RtcCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBUcmFuc2Zvcm0gdGhpcyBzaGFwZVxuICAgICAqICEjemhcbiAgICAgKiDlsIYgb3V0IOagueaNrui/meS4qiBvYmIg55qE5pWw5o2u6L+b6KGM5Y+Y5o2i44CCXG4gICAgICogQG1ldGhvZCB0cmFuc2Zvcm1cbiAgICAgKiBAcGFyYW0ge01hdDR9IG0gVGhlIHRyYW5zZm9ybWF0aW9uIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHBvcyBUaGUgcG9zaXRpb24gcGFydCBvZiB0aGUgdHJhbnNmb3JtYXRpb24uXG4gICAgICogQHBhcmFtIHtRdWF0fSByb3QgVGhlIHJvdGF0aW5nIHBhcnQgb2YgdGhlIHRyYW5zZm9ybWF0aW9uLlxuICAgICAqIEBwYXJhbSB7VmVjM30gc2NhbGUgVGhlIHNjYWxpbmcgcGFydCBvZiB0aGUgdHJhbnNmb3JtYXRpb24uXG4gICAgICogQHBhcmFtIHtPYmJ9IG91dCBUYXJnZXQgb2YgdHJhbnNmb3JtYXRpb24uXG4gICAgICovXG4gICAgcHVibGljIHRyYW5zZm9ybSAobTogTWF0NCwgcG9zOiBWZWMzLCByb3Q6IFF1YXQsIHNjYWxlOiBWZWMzLCBvdXQ6IG9iYikge1xuICAgICAgICBWZWMzLnRyYW5zZm9ybU1hdDQob3V0LmNlbnRlciwgdGhpcy5jZW50ZXIsIG0pO1xuICAgICAgICAvLyBwYXJlbnQgc2hhcGUgZG9lc24ndCBjb250YWluIHJvdGF0aW9ucyBmb3Igbm93XG4gICAgICAgIE1hdDMuZnJvbVF1YXQob3V0Lm9yaWVudGF0aW9uLCByb3QpO1xuICAgICAgICBWZWMzLm11bHRpcGx5KG91dC5oYWxmRXh0ZW50cywgdGhpcy5oYWxmRXh0ZW50cywgc2NhbGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBUcmFuc2Zvcm0gb3V0IGJhc2VkIG9uIHRoaXMgb2JiIGRhdGEuXG4gICAgICogISN6aFxuICAgICAqIOWwhiBvdXQg5qC55o2u6L+Z5LiqIG9iYiDnmoTmlbDmja7ov5vooYzlj5jmjaLjgIJcbiAgICAgKiBAbWV0aG9kIHRyYW5zbGF0ZUFuZFJvdGF0ZVxuICAgICAqIEBwYXJhbSB7TWF0NH0gbSBUaGUgdHJhbnNmb3JtYXRpb24gbWF0cml4LlxuICAgICAqIEBwYXJhbSB7UXVhdH0gcm90IFRoZSByb3RhdGluZyBwYXJ0IG9mIHRoZSB0cmFuc2Zvcm1hdGlvbi5cbiAgICAgKiBAcGFyYW0ge09iYn0gb3V0IFRhcmdldCBvZiB0cmFuc2Zvcm1hdGlvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgdHJhbnNsYXRlQW5kUm90YXRlIChtOiBNYXQ0LCByb3Q6IFF1YXQsIG91dDogb2JiKXtcbiAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KG91dC5jZW50ZXIsIHRoaXMuY2VudGVyLCBtKTtcbiAgICAgICAgLy8gcGFyZW50IHNoYXBlIGRvZXNuJ3QgY29udGFpbiByb3RhdGlvbnMgZm9yIG5vd1xuICAgICAgICBNYXQzLmZyb21RdWF0KG91dC5vcmllbnRhdGlvbiwgcm90KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2NhbGUgb3V0IGJhc2VkIG9uIHRoaXMgb2JiIGRhdGEuXG4gICAgICogISN6aFxuICAgICAqIOWwhiBvdXQg5qC55o2u6L+Z5LiqIG9iYiDnmoTmlbDmja7ov5vooYznvKnmlL7jgIJcbiAgICAgKiBAbWV0aG9kIHNldFNjYWxlXG4gICAgICogQHBhcmFtIHtWZWMzfSBzY2FsZSBTY2FsZSB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge09iYn0gb3V0IFNjYWxlZCB0YXJnZXQuXG4gICAgICovXG4gICAgcHVibGljIHNldFNjYWxlIChzY2FsZTogVmVjMywgb3V0OiBvYmIpIHtcbiAgICAgICAgVmVjMy5tdWx0aXBseShvdXQuaGFsZkV4dGVudHMsIHRoaXMuaGFsZkV4dGVudHMsIHNjYWxlKTtcbiAgICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==