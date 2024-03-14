
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/geom-utils/plane.js';
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
var v1 = new _valueTypes.Vec3(0, 0, 0);
var v2 = new _valueTypes.Vec3(0, 0, 0);
var temp_mat = cc.mat4();
var temp_vec4 = cc.v4();
/**
 * !#en
 * plane。
 * !#zh
 * 平面。
 * @class geomUtils.Plane
 */

var plane = /*#__PURE__*/function () {
  /**
   * !#en
   * create a new plane
   * !#zh
   * 创建一个新的 plane。
   * @method create
   * @param {Number} nx The x part of the normal component.
   * @param {Number} ny The y part of the normal component.
   * @param {Number} nz The z part of the normal component.
   * @param {Number} d Distance from the origin.
   * @return {Plane}
   */
  plane.create = function create(nx, ny, nz, d) {
    return new plane(nx, ny, nz, d);
  }
  /**
   * !#en
   * clone a new plane
   * !#zh
   * 克隆一个新的 plane。
   * @method clone
   * @param {Plane} p The source of cloning.
   * @return {Plane} The cloned object.
   */
  ;

  plane.clone = function clone(p) {
    return new plane(p.n.x, p.n.y, p.n.z, p.d);
  }
  /**
   * !#en
   * copy the values from one plane to another
   * !#zh
   * 复制一个平面的值到另一个。
   * @method copy
   * @param {Plane} out The object that accepts the action.
   * @param {Plane} p The source of the copy.
   * @return {Plane} The object that accepts the action.
   */
  ;

  plane.copy = function copy(out, p) {
    _valueTypes.Vec3.copy(out.n, p.n);

    out.d = p.d;
    return out;
  }
  /**
   * !#en
   * create a plane from three points
   * !#zh
   * 用三个点创建一个平面。
   * @method fromPoints
   * @param {Plane} out The object that accepts the action.
   * @param {Vec3} a Point a。
   * @param {Vec3} b Point b。
   * @param {Vec3} c Point c。
   * @return {Plane} out The object that accepts the action.
   */
  ;

  plane.fromPoints = function fromPoints(out, a, b, c) {
    _valueTypes.Vec3.subtract(v1, b, a);

    _valueTypes.Vec3.subtract(v2, c, a);

    _valueTypes.Vec3.normalize(out.n, _valueTypes.Vec3.cross(out.n, v1, v2));

    out.d = _valueTypes.Vec3.dot(out.n, a);
    return out;
  }
  /**
   * !#en
   * Set the components of a plane to the given values
   * !#zh
   * 将给定平面的属性设置为给定值。
   * @method set
   * @param {Plane} out The object that accepts the action.
   * @param {Number} nx The x part of the normal component.
   * @param {Number} ny The y part of the normal component.
   * @param {Number} nz The z part of the normal component.
   * @param {Number} d Distance from the origin.
   * @return {Plane} out The object that accepts the action.
   */
  ;

  plane.set = function set(out, nx, ny, nz, d) {
    out.n.x = nx;
    out.n.y = ny;
    out.n.z = nz;
    out.d = d;
    return out;
  }
  /**
   * !#en
   * create plane from normal and point
   * !#zh
   * 用一条法线和一个点创建平面。
   * @method fromNormalAndPoint
   * @param {Plane} out The object that accepts the action.
   * @param {Vec3} normal The normal of a plane.
   * @param {Vec3} point A point on the plane.
   * @return {Plane} out The object that accepts the action.
   */
  ;

  plane.fromNormalAndPoint = function fromNormalAndPoint(out, normal, point) {
    _valueTypes.Vec3.copy(out.n, normal);

    out.d = _valueTypes.Vec3.dot(normal, point);
    return out;
  }
  /**
   * !#en
   * normalize a plane
   * !#zh
   * 归一化一个平面。
   * @method normalize
   * @param {Plane} out The object that accepts the action.
   * @param {Plane} a Source data for operations.
   * @return {Plane} out The object that accepts the action.
   */
  ;

  plane.normalize = function normalize(out, a) {
    var len = a.n.len();

    _valueTypes.Vec3.normalize(out.n, a.n);

    if (len > 0) {
      out.d = a.d / len;
    }

    return out;
  }
  /**
   * !#en
   * A normal vector.
   * !#zh
   * 法线向量。
   * @property {Vec3} n
   */
  ;

  /**
   * !#en Construct a plane.
   * !#zh 构造一个平面。
   * @constructor
   * @param {Number} nx The x part of the normal component.
   * @param {Number} ny The y part of the normal component.
   * @param {Number} nz The z part of the normal component.
   * @param {Number} d Distance from the origin.
   */
  function plane(nx, ny, nz, d) {
    if (nx === void 0) {
      nx = 0;
    }

    if (ny === void 0) {
      ny = 1;
    }

    if (nz === void 0) {
      nz = 0;
    }

    if (d === void 0) {
      d = 0;
    }

    this.n = void 0;
    this.d = void 0;
    this._type = void 0;
    this._type = _enums["default"].SHAPE_PLANE;
    this.n = new _valueTypes.Vec3(nx, ny, nz);
    this.d = d;
  }
  /**
   * !#en
   * Transform a plane.
   * !#zh
   * 变换一个平面。
   * @method transform
   * @param {Mat4} mat
   */


  var _proto = plane.prototype;

  _proto.transform = function transform(mat) {
    _valueTypes.Mat4.invert(temp_mat, mat);

    _valueTypes.Mat4.transpose(temp_mat, temp_mat);

    _valueTypes.Vec4.set(temp_vec4, this.n.x, this.n.y, this.n.z, this.d);

    _valueTypes.Vec4.transformMat4(temp_vec4, temp_vec4, temp_mat);

    _valueTypes.Vec3.set(this.n, temp_vec4.x, temp_vec4.y, temp_vec4.z);

    this.d = temp_vec4.w;
  };

  return plane;
}();

exports["default"] = plane;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2dlb20tdXRpbHMvcGxhbmUudHMiXSwibmFtZXMiOlsidjEiLCJWZWMzIiwidjIiLCJ0ZW1wX21hdCIsImNjIiwibWF0NCIsInRlbXBfdmVjNCIsInY0IiwicGxhbmUiLCJjcmVhdGUiLCJueCIsIm55IiwibnoiLCJkIiwiY2xvbmUiLCJwIiwibiIsIngiLCJ5IiwieiIsImNvcHkiLCJvdXQiLCJmcm9tUG9pbnRzIiwiYSIsImIiLCJjIiwic3VidHJhY3QiLCJub3JtYWxpemUiLCJjcm9zcyIsImRvdCIsInNldCIsImZyb21Ob3JtYWxBbmRQb2ludCIsIm5vcm1hbCIsInBvaW50IiwibGVuIiwiX3R5cGUiLCJlbnVtcyIsIlNIQVBFX1BMQU5FIiwidHJhbnNmb3JtIiwibWF0IiwiTWF0NCIsImludmVydCIsInRyYW5zcG9zZSIsIlZlYzQiLCJ0cmFuc2Zvcm1NYXQ0IiwidyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7QUFDQTs7OztBQTFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLQSxJQUFNQSxFQUFFLEdBQUcsSUFBSUMsZ0JBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FBWDtBQUNBLElBQU1DLEVBQUUsR0FBRyxJQUFJRCxnQkFBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFYO0FBQ0EsSUFBTUUsUUFBUSxHQUFHQyxFQUFFLENBQUNDLElBQUgsRUFBakI7QUFDQSxJQUFNQyxTQUFTLEdBQUdGLEVBQUUsQ0FBQ0csRUFBSCxFQUFsQjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztJQUNxQkM7QUFFakI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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eUIsWUFBUCxtQkFBa0JDLEdBQWxCLEVBQW1DO0FBQy9CQyxxQkFBS0MsTUFBTCxDQUFZdEMsUUFBWixFQUFzQm9DLEdBQXRCOztBQUNBQyxxQkFBS0UsU0FBTCxDQUFldkMsUUFBZixFQUF5QkEsUUFBekI7O0FBQ0F3QyxxQkFBS2IsR0FBTCxDQUFTeEIsU0FBVCxFQUFvQixLQUFLVSxDQUFMLENBQU9DLENBQTNCLEVBQThCLEtBQUtELENBQUwsQ0FBT0UsQ0FBckMsRUFBd0MsS0FBS0YsQ0FBTCxDQUFPRyxDQUEvQyxFQUFrRCxLQUFLTixDQUF2RDs7QUFDQThCLHFCQUFLQyxhQUFMLENBQW1CdEMsU0FBbkIsRUFBOEJBLFNBQTlCLEVBQXlDSCxRQUF6Qzs7QUFDQUYscUJBQUs2QixHQUFMLENBQVMsS0FBS2QsQ0FBZCxFQUFpQlYsU0FBUyxDQUFDVyxDQUEzQixFQUE4QlgsU0FBUyxDQUFDWSxDQUF4QyxFQUEyQ1osU0FBUyxDQUFDYSxDQUFyRDs7QUFDQSxTQUFLTixDQUFMLEdBQVNQLFNBQVMsQ0FBQ3VDLENBQW5CO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IHsgTWF0NCwgVmVjMywgVmVjNCB9IGZyb20gJy4uL3ZhbHVlLXR5cGVzJztcbmltcG9ydCBlbnVtcyBmcm9tICcuL2VudW1zJztcblxuY29uc3QgdjEgPSBuZXcgVmVjMygwLCAwLCAwKTtcbmNvbnN0IHYyID0gbmV3IFZlYzMoMCwgMCwgMCk7XG5jb25zdCB0ZW1wX21hdCA9IGNjLm1hdDQoKTtcbmNvbnN0IHRlbXBfdmVjNCA9IGNjLnY0KCk7XG5cbi8qKlxuICogISNlblxuICogcGxhbmXjgIJcbiAqICEjemhcbiAqIOW5s+mdouOAglxuICogQGNsYXNzIGdlb21VdGlscy5QbGFuZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBwbGFuZSB7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogY3JlYXRlIGEgbmV3IHBsYW5lXG4gICAgICogISN6aFxuICAgICAqIOWIm+W7uuS4gOS4quaWsOeahCBwbGFuZeOAglxuICAgICAqIEBtZXRob2QgY3JlYXRlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG54IFRoZSB4IHBhcnQgb2YgdGhlIG5vcm1hbCBjb21wb25lbnQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG55IFRoZSB5IHBhcnQgb2YgdGhlIG5vcm1hbCBjb21wb25lbnQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG56IFRoZSB6IHBhcnQgb2YgdGhlIG5vcm1hbCBjb21wb25lbnQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGQgRGlzdGFuY2UgZnJvbSB0aGUgb3JpZ2luLlxuICAgICAqIEByZXR1cm4ge1BsYW5lfVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlIChueDogbnVtYmVyLCBueTogbnVtYmVyLCBuejogbnVtYmVyLCBkOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBwbGFuZShueCwgbnksIG56LCBkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogY2xvbmUgYSBuZXcgcGxhbmVcbiAgICAgKiAhI3poXG4gICAgICog5YWL6ZqG5LiA5Liq5paw55qEIHBsYW5l44CCXG4gICAgICogQG1ldGhvZCBjbG9uZVxuICAgICAqIEBwYXJhbSB7UGxhbmV9IHAgVGhlIHNvdXJjZSBvZiBjbG9uaW5nLlxuICAgICAqIEByZXR1cm4ge1BsYW5lfSBUaGUgY2xvbmVkIG9iamVjdC5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGNsb25lIChwOiBwbGFuZSkge1xuICAgICAgICByZXR1cm4gbmV3IHBsYW5lKHAubi54LCBwLm4ueSwgcC5uLnosIHAuZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIGNvcHkgdGhlIHZhbHVlcyBmcm9tIG9uZSBwbGFuZSB0byBhbm90aGVyXG4gICAgICogISN6aFxuICAgICAqIOWkjeWItuS4gOS4quW5s+mdoueahOWAvOWIsOWPpuS4gOS4quOAglxuICAgICAqIEBtZXRob2QgY29weVxuICAgICAqIEBwYXJhbSB7UGxhbmV9IG91dCBUaGUgb2JqZWN0IHRoYXQgYWNjZXB0cyB0aGUgYWN0aW9uLlxuICAgICAqIEBwYXJhbSB7UGxhbmV9IHAgVGhlIHNvdXJjZSBvZiB0aGUgY29weS5cbiAgICAgKiBAcmV0dXJuIHtQbGFuZX0gVGhlIG9iamVjdCB0aGF0IGFjY2VwdHMgdGhlIGFjdGlvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGNvcHkgKG91dDogcGxhbmUsIHA6IHBsYW5lKSB7XG4gICAgICAgIFZlYzMuY29weShvdXQubiwgcC5uKTtcbiAgICAgICAgb3V0LmQgPSBwLmQ7XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogY3JlYXRlIGEgcGxhbmUgZnJvbSB0aHJlZSBwb2ludHNcbiAgICAgKiAhI3poXG4gICAgICog55So5LiJ5Liq54K55Yib5bu65LiA5Liq5bmz6Z2i44CCXG4gICAgICogQG1ldGhvZCBmcm9tUG9pbnRzXG4gICAgICogQHBhcmFtIHtQbGFuZX0gb3V0IFRoZSBvYmplY3QgdGhhdCBhY2NlcHRzIHRoZSBhY3Rpb24uXG4gICAgICogQHBhcmFtIHtWZWMzfSBhIFBvaW50IGHjgIJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IGIgUG9pbnQgYuOAglxuICAgICAqIEBwYXJhbSB7VmVjM30gYyBQb2ludCBj44CCXG4gICAgICogQHJldHVybiB7UGxhbmV9IG91dCBUaGUgb2JqZWN0IHRoYXQgYWNjZXB0cyB0aGUgYWN0aW9uLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZnJvbVBvaW50cyAob3V0OiBwbGFuZSwgYTogVmVjMywgYjogVmVjMywgYzogVmVjMykge1xuICAgICAgICBWZWMzLnN1YnRyYWN0KHYxLCBiLCBhKTtcbiAgICAgICAgVmVjMy5zdWJ0cmFjdCh2MiwgYywgYSk7XG5cbiAgICAgICAgVmVjMy5ub3JtYWxpemUob3V0Lm4sIFZlYzMuY3Jvc3Mob3V0Lm4sIHYxLCB2MikpO1xuICAgICAgICBvdXQuZCA9IFZlYzMuZG90KG91dC5uLCBhKTtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTZXQgdGhlIGNvbXBvbmVudHMgb2YgYSBwbGFuZSB0byB0aGUgZ2l2ZW4gdmFsdWVzXG4gICAgICogISN6aFxuICAgICAqIOWwhue7meWumuW5s+mdoueahOWxnuaAp+iuvue9ruS4uue7meWumuWAvOOAglxuICAgICAqIEBtZXRob2Qgc2V0XG4gICAgICogQHBhcmFtIHtQbGFuZX0gb3V0IFRoZSBvYmplY3QgdGhhdCBhY2NlcHRzIHRoZSBhY3Rpb24uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG54IFRoZSB4IHBhcnQgb2YgdGhlIG5vcm1hbCBjb21wb25lbnQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG55IFRoZSB5IHBhcnQgb2YgdGhlIG5vcm1hbCBjb21wb25lbnQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG56IFRoZSB6IHBhcnQgb2YgdGhlIG5vcm1hbCBjb21wb25lbnQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGQgRGlzdGFuY2UgZnJvbSB0aGUgb3JpZ2luLlxuICAgICAqIEByZXR1cm4ge1BsYW5lfSBvdXQgVGhlIG9iamVjdCB0aGF0IGFjY2VwdHMgdGhlIGFjdGlvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNldCAob3V0OiBwbGFuZSwgbng6IG51bWJlciwgbnk6IG51bWJlciwgbno6IG51bWJlciwgZDogbnVtYmVyKSB7XG4gICAgICAgIG91dC5uLnggPSBueDtcbiAgICAgICAgb3V0Lm4ueSA9IG55O1xuICAgICAgICBvdXQubi56ID0gbno7XG4gICAgICAgIG91dC5kID0gZDtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBjcmVhdGUgcGxhbmUgZnJvbSBub3JtYWwgYW5kIHBvaW50XG4gICAgICogISN6aFxuICAgICAqIOeUqOS4gOadoeazlee6v+WSjOS4gOS4queCueWIm+W7uuW5s+mdouOAglxuICAgICAqIEBtZXRob2QgZnJvbU5vcm1hbEFuZFBvaW50XG4gICAgICogQHBhcmFtIHtQbGFuZX0gb3V0IFRoZSBvYmplY3QgdGhhdCBhY2NlcHRzIHRoZSBhY3Rpb24uXG4gICAgICogQHBhcmFtIHtWZWMzfSBub3JtYWwgVGhlIG5vcm1hbCBvZiBhIHBsYW5lLlxuICAgICAqIEBwYXJhbSB7VmVjM30gcG9pbnQgQSBwb2ludCBvbiB0aGUgcGxhbmUuXG4gICAgICogQHJldHVybiB7UGxhbmV9IG91dCBUaGUgb2JqZWN0IHRoYXQgYWNjZXB0cyB0aGUgYWN0aW9uLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZnJvbU5vcm1hbEFuZFBvaW50IChvdXQ6IHBsYW5lLCBub3JtYWw6IFZlYzMsIHBvaW50OiBWZWMzKSB7XG4gICAgICAgIFZlYzMuY29weShvdXQubiwgbm9ybWFsKTtcbiAgICAgICAgb3V0LmQgPSBWZWMzLmRvdChub3JtYWwsIHBvaW50KTtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBub3JtYWxpemUgYSBwbGFuZVxuICAgICAqICEjemhcbiAgICAgKiDlvZLkuIDljJbkuIDkuKrlubPpnaLjgIJcbiAgICAgKiBAbWV0aG9kIG5vcm1hbGl6ZVxuICAgICAqIEBwYXJhbSB7UGxhbmV9IG91dCBUaGUgb2JqZWN0IHRoYXQgYWNjZXB0cyB0aGUgYWN0aW9uLlxuICAgICAqIEBwYXJhbSB7UGxhbmV9IGEgU291cmNlIGRhdGEgZm9yIG9wZXJhdGlvbnMuXG4gICAgICogQHJldHVybiB7UGxhbmV9IG91dCBUaGUgb2JqZWN0IHRoYXQgYWNjZXB0cyB0aGUgYWN0aW9uLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgbm9ybWFsaXplIChvdXQ6IHBsYW5lLCBhOiBwbGFuZSkge1xuICAgICAgICBjb25zdCBsZW4gPSBhLm4ubGVuKCk7XG4gICAgICAgIFZlYzMubm9ybWFsaXplKG91dC5uLCBhLm4pO1xuICAgICAgICBpZiAobGVuID4gMCkge1xuICAgICAgICAgICAgb3V0LmQgPSBhLmQgLyBsZW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQSBub3JtYWwgdmVjdG9yLlxuICAgICAqICEjemhcbiAgICAgKiDms5Xnur/lkJHph4/jgIJcbiAgICAgKiBAcHJvcGVydHkge1ZlYzN9IG5cbiAgICAgKi9cbiAgICBwdWJsaWMgbjogVmVjMztcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBUaGUgZGlzdGFuY2UgZnJvbSB0aGUgb3JpZ2luIHRvIHRoZSBwbGFuZS5cbiAgICAgKiAhI3poXG4gICAgICog5Y6f54K55Yiw5bmz6Z2i55qE6Led56a744CCXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGRcbiAgICAgKi9cbiAgICBwdWJsaWMgZDogbnVtYmVyO1xuXG4gICAgcHJpdmF0ZSBfdHlwZTogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBDb25zdHJ1Y3QgYSBwbGFuZS5cbiAgICAgKiAhI3poIOaehOmAoOS4gOS4quW5s+mdouOAglxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBueCBUaGUgeCBwYXJ0IG9mIHRoZSBub3JtYWwgY29tcG9uZW50LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBueSBUaGUgeSBwYXJ0IG9mIHRoZSBub3JtYWwgY29tcG9uZW50LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBueiBUaGUgeiBwYXJ0IG9mIHRoZSBub3JtYWwgY29tcG9uZW50LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkIERpc3RhbmNlIGZyb20gdGhlIG9yaWdpbi5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAobnggPSAwLCBueSA9IDEsIG56ID0gMCwgZCA9IDApIHtcbiAgICAgICAgdGhpcy5fdHlwZSA9IGVudW1zLlNIQVBFX1BMQU5FO1xuICAgICAgICB0aGlzLm4gPSBuZXcgVmVjMyhueCwgbnksIG56KTtcbiAgICAgICAgdGhpcy5kID0gZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVHJhbnNmb3JtIGEgcGxhbmUuXG4gICAgICogISN6aFxuICAgICAqIOWPmOaNouS4gOS4quW5s+mdouOAglxuICAgICAqIEBtZXRob2QgdHJhbnNmb3JtXG4gICAgICogQHBhcmFtIHtNYXQ0fSBtYXRcbiAgICAgKi9cbiAgICBwdWJsaWMgdHJhbnNmb3JtIChtYXQ6IE1hdDQpOiB2b2lkIHtcbiAgICAgICAgTWF0NC5pbnZlcnQodGVtcF9tYXQsIG1hdCk7XG4gICAgICAgIE1hdDQudHJhbnNwb3NlKHRlbXBfbWF0LCB0ZW1wX21hdCk7XG4gICAgICAgIFZlYzQuc2V0KHRlbXBfdmVjNCwgdGhpcy5uLngsIHRoaXMubi55LCB0aGlzLm4ueiwgdGhpcy5kKTtcbiAgICAgICAgVmVjNC50cmFuc2Zvcm1NYXQ0KHRlbXBfdmVjNCwgdGVtcF92ZWM0LCB0ZW1wX21hdCk7XG4gICAgICAgIFZlYzMuc2V0KHRoaXMubiwgdGVtcF92ZWM0LngsIHRlbXBfdmVjNC55LCB0ZW1wX3ZlYzQueik7XG4gICAgICAgIHRoaXMuZCA9IHRlbXBfdmVjNC53O1xuICAgIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiLyJ9