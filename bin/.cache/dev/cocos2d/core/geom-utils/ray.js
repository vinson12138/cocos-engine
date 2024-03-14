
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/geom-utils/ray.js';
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

/**
 * !#en
 * ray
 * !#zh
 * 射线。
 * @class geomUtils.Ray
 */
var ray = /*#__PURE__*/function () {
  /**
   * !#en
   * create a new ray
   * !#zh
   * 创建一条射线。
   * @method create
   * @param {number} ox The x part of the starting point.
   * @param {number} oy The y part of the starting point.
   * @param {number} oz The z part of the starting point.
   * @param {number} dx X in the direction.
   * @param {number} dy Y in the direction.
   * @param {number} dz Z in the direction.
   * @return {Ray}
   */
  ray.create = function create(ox, oy, oz, dx, dy, dz) {
    if (ox === void 0) {
      ox = 0;
    }

    if (oy === void 0) {
      oy = 0;
    }

    if (oz === void 0) {
      oz = 0;
    }

    if (dx === void 0) {
      dx = 0;
    }

    if (dy === void 0) {
      dy = 0;
    }

    if (dz === void 0) {
      dz = 1;
    }

    return new ray(ox, oy, oz, dx, dy, dz);
  }
  /**
   * !#en
   * Creates a new ray initialized with values from an existing ray
   * !#zh
   * 从一条射线克隆出一条新的射线。
   * @method clone
   * @param {Ray} a Clone target
   * @return {Ray} Clone result
   */
  ;

  ray.clone = function clone(a) {
    return new ray(a.o.x, a.o.y, a.o.z, a.d.x, a.d.y, a.d.z);
  }
  /**
   * !#en
   * Copy the values from one ray to another
   * !#zh
   * 将从一个 ray 的值复制到另一个 ray。
   * @method copy
   * @param {Ray} out Accept the ray of the operation.
   * @param {Ray} a Copied ray.
   * @return {Ray} out Accept the ray of the operation.
   */
  ;

  ray.copy = function copy(out, a) {
    _valueTypes.Vec3.copy(out.o, a.o);

    _valueTypes.Vec3.copy(out.d, a.d);

    return out;
  }
  /**
   * !#en
   * create a ray from two points
   * !#zh
   * 用两个点创建一条射线。
   * @method fromPoints
   * @param {Ray} out Receive the operating ray.
   * @param {Vec3} origin Origin of ray
   * @param {Vec3} target A point on a ray.
   * @return {Ray} out Receive the operating ray.
   */
  ;

  ray.fromPoints = function fromPoints(out, origin, target) {
    _valueTypes.Vec3.copy(out.o, origin);

    _valueTypes.Vec3.normalize(out.d, _valueTypes.Vec3.subtract(out.d, target, origin));

    return out;
  }
  /**
   * !#en
   * Set the components of a ray to the given values
   * !#zh
   * 将给定射线的属性设置为给定的值。
   * @method set
   * @param {Ray} out Receive the operating ray.
   * @param {number} ox The x part of the starting point.
   * @param {number} oy The y part of the starting point.
   * @param {number} oz The z part of the starting point.
   * @param {number} dx X in the direction.
   * @param {number} dy Y in the direction.
   * @param {number} dz Z in the direction.
   * @return {Ray} out Receive the operating ray.
   */
  ;

  ray.set = function set(out, ox, oy, oz, dx, dy, dz) {
    out.o.x = ox;
    out.o.y = oy;
    out.o.z = oz;
    out.d.x = dx;
    out.d.y = dy;
    out.d.z = dz;
    return out;
  }
  /**
   * !#en
   * Start point.
   * !#zh
   * 起点。
   * @property {Vec3} o
   */
  ;

  /**
   * !#en Construct a ray.
   * !#zh 构造一条射线。
   * @constructor
   * @param {number} ox The x part of the starting point.
   * @param {number} oy The y part of the starting point.
   * @param {number} oz The z part of the starting point.
   * @param {number} dx X in the direction.
   * @param {number} dy Y in the direction.
   * @param {number} dz Z in the direction.
   */
  function ray(ox, oy, oz, dx, dy, dz) {
    if (ox === void 0) {
      ox = 0;
    }

    if (oy === void 0) {
      oy = 0;
    }

    if (oz === void 0) {
      oz = 0;
    }

    if (dx === void 0) {
      dx = 0;
    }

    if (dy === void 0) {
      dy = 0;
    }

    if (dz === void 0) {
      dz = -1;
    }

    this.o = void 0;
    this.d = void 0;
    this._type = void 0;
    this._type = _enums["default"].SHAPE_RAY;
    this.o = new _valueTypes.Vec3(ox, oy, oz);
    this.d = new _valueTypes.Vec3(dx, dy, dz);
  }
  /**
   * !#en Compute hit.
   * @method computeHit
   * @param {IVec3Like} out
   * @param {number} distance
   */


  var _proto = ray.prototype;

  _proto.computeHit = function computeHit(out, distance) {
    _valueTypes.Vec3.normalize(out, this.d);

    _valueTypes.Vec3.scaleAndAdd(out, this.o, out, distance);
  };

  return ray;
}();

exports["default"] = ray;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2dlb20tdXRpbHMvcmF5LnRzIl0sIm5hbWVzIjpbInJheSIsImNyZWF0ZSIsIm94Iiwib3kiLCJveiIsImR4IiwiZHkiLCJkeiIsImNsb25lIiwiYSIsIm8iLCJ4IiwieSIsInoiLCJkIiwiY29weSIsIm91dCIsIlZlYzMiLCJmcm9tUG9pbnRzIiwib3JpZ2luIiwidGFyZ2V0Iiwibm9ybWFsaXplIiwic3VidHJhY3QiLCJzZXQiLCJfdHlwZSIsImVudW1zIiwiU0hBUEVfUkFZIiwiY29tcHV0ZUhpdCIsImRpc3RhbmNlIiwic2NhbGVBbmRBZGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7O0FBQ0E7Ozs7QUExQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBQ3FCQTtBQUVqQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO01BQ2tCQyxTQUFkLGdCQUFzQkMsRUFBdEIsRUFBc0NDLEVBQXRDLEVBQXNEQyxFQUF0RCxFQUFzRUMsRUFBdEUsRUFBc0ZDLEVBQXRGLEVBQXNHQyxFQUF0RyxFQUEySDtBQUFBLFFBQXJHTCxFQUFxRztBQUFyR0EsTUFBQUEsRUFBcUcsR0FBeEYsQ0FBd0Y7QUFBQTs7QUFBQSxRQUFyRkMsRUFBcUY7QUFBckZBLE1BQUFBLEVBQXFGLEdBQXhFLENBQXdFO0FBQUE7O0FBQUEsUUFBckVDLEVBQXFFO0FBQXJFQSxNQUFBQSxFQUFxRSxHQUF4RCxDQUF3RDtBQUFBOztBQUFBLFFBQXJEQyxFQUFxRDtBQUFyREEsTUFBQUEsRUFBcUQsR0FBeEMsQ0FBd0M7QUFBQTs7QUFB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QixDQUMyQjtBQUFBOztBQUFBLFFBRHhCQyxFQUN3QjtBQUR4QkEsTUFBQUEsRUFDd0IsR0FEWCxDQUNXO0FBQUE7O0FBQUEsUUFEUkMsRUFDUTtBQURSQSxNQUFBQSxFQUNRLEdBREssQ0FDTDtBQUFBOztBQUFBLFFBQWpEQyxFQUFpRDtBQUFqREEsTUFBQUEsRUFBaUQsR0FBcEMsQ0FBb0M7QUFBQTs7QUFBQSxRQUFqQ0MsRUFBaUM7QUFBakNBLE1BQUFBLEVBQWlDLEdBQXBCLENBQW9CO0FBQUE7O0FBQUEsUUFBakJDLEVBQWlCO0FBQWpCQSxNQUFBQSxFQUFpQixHQUFKLENBQUMsQ0FBRztBQUFBOztBQUFBLFNBekI5Q0csQ0F5QjhDO0FBQUEsU0FoQjlDSSxDQWdCOEM7QUFBQSxTQWQ3Q1UsS0FjNkM7QUFDakQsU0FBS0EsS0FBTCxHQUFhQyxrQkFBTUMsU0FBbkI7QUFDQSxTQUFLaEIsQ0FBTCxHQUFTLElBQUlPLGdCQUFKLENBQVNmLEVBQVQsRUFBYUMsRUFBYixFQUFpQkMsRUFBakIsQ0FBVDtBQUNBLFNBQUtVLENBQUwsR0FBUyxJQUFJRyxnQkFBSixDQUFTWixFQUFULEVBQWFDLEVBQWIsRUFBaUJDLEVBQWpCLENBQVQ7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7U0FDV29CLGFBQVAsb0JBQW1CWCxHQUFuQixFQUFtQ1ksUUFBbkMsRUFBcUQ7QUFDakRYLHFCQUFLSSxTQUFMLENBQWVMLEdBQWYsRUFBb0IsS0FBS0YsQ0FBekI7O0FBQ0FHLHFCQUFLWSxXQUFMLENBQWlCYixHQUFqQixFQUFzQixLQUFLTixDQUEzQixFQUE4Qk0sR0FBOUIsRUFBbUNZLFFBQW5DO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IHsgVmVjMyB9IGZyb20gJy4uL3ZhbHVlLXR5cGVzJztcbmltcG9ydCBlbnVtcyBmcm9tICcuL2VudW1zJztcbmltcG9ydCB7IElWZWMzTGlrZSB9IGZyb20gJy4uL3ZhbHVlLXR5cGVzL21hdGgnO1xuXG4vKipcbiAqICEjZW5cbiAqIHJheVxuICogISN6aFxuICog5bCE57q/44CCXG4gKiBAY2xhc3MgZ2VvbVV0aWxzLlJheVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyByYXkge1xuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIGNyZWF0ZSBhIG5ldyByYXlcbiAgICAgKiAhI3poXG4gICAgICog5Yib5bu65LiA5p2h5bCE57q/44CCXG4gICAgICogQG1ldGhvZCBjcmVhdGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb3ggVGhlIHggcGFydCBvZiB0aGUgc3RhcnRpbmcgcG9pbnQuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG95IFRoZSB5IHBhcnQgb2YgdGhlIHN0YXJ0aW5nIHBvaW50LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBveiBUaGUgeiBwYXJ0IG9mIHRoZSBzdGFydGluZyBwb2ludC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZHggWCBpbiB0aGUgZGlyZWN0aW9uLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkeSBZIGluIHRoZSBkaXJlY3Rpb24uXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGR6IFogaW4gdGhlIGRpcmVjdGlvbi5cbiAgICAgKiBAcmV0dXJuIHtSYXl9XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUgKG94OiBudW1iZXIgPSAwLCBveTogbnVtYmVyID0gMCwgb3o6IG51bWJlciA9IDAsIGR4OiBudW1iZXIgPSAwLCBkeTogbnVtYmVyID0gMCwgZHo6IG51bWJlciA9IDEpOiByYXkge1xuICAgICAgICByZXR1cm4gbmV3IHJheShveCwgb3ksIG96LCBkeCwgZHksIGR6KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ3JlYXRlcyBhIG5ldyByYXkgaW5pdGlhbGl6ZWQgd2l0aCB2YWx1ZXMgZnJvbSBhbiBleGlzdGluZyByYXlcbiAgICAgKiAhI3poXG4gICAgICog5LuO5LiA5p2h5bCE57q/5YWL6ZqG5Ye65LiA5p2h5paw55qE5bCE57q/44CCXG4gICAgICogQG1ldGhvZCBjbG9uZVxuICAgICAqIEBwYXJhbSB7UmF5fSBhIENsb25lIHRhcmdldFxuICAgICAqIEByZXR1cm4ge1JheX0gQ2xvbmUgcmVzdWx0XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjbG9uZSAoYTogcmF5KTogcmF5IHtcbiAgICAgICAgcmV0dXJuIG5ldyByYXkoXG4gICAgICAgICAgICBhLm8ueCwgYS5vLnksIGEuby56LFxuICAgICAgICAgICAgYS5kLngsIGEuZC55LCBhLmQueixcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ29weSB0aGUgdmFsdWVzIGZyb20gb25lIHJheSB0byBhbm90aGVyXG4gICAgICogISN6aFxuICAgICAqIOWwhuS7juS4gOS4qiByYXkg55qE5YC85aSN5Yi25Yiw5Y+m5LiA5LiqIHJheeOAglxuICAgICAqIEBtZXRob2QgY29weVxuICAgICAqIEBwYXJhbSB7UmF5fSBvdXQgQWNjZXB0IHRoZSByYXkgb2YgdGhlIG9wZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0ge1JheX0gYSBDb3BpZWQgcmF5LlxuICAgICAqIEByZXR1cm4ge1JheX0gb3V0IEFjY2VwdCB0aGUgcmF5IG9mIHRoZSBvcGVyYXRpb24uXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjb3B5IChvdXQ6IHJheSwgYTogcmF5KTogcmF5IHtcbiAgICAgICAgVmVjMy5jb3B5KG91dC5vLCBhLm8pO1xuICAgICAgICBWZWMzLmNvcHkob3V0LmQsIGEuZCk7XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogY3JlYXRlIGEgcmF5IGZyb20gdHdvIHBvaW50c1xuICAgICAqICEjemhcbiAgICAgKiDnlKjkuKTkuKrngrnliJvlu7rkuIDmnaHlsITnur/jgIJcbiAgICAgKiBAbWV0aG9kIGZyb21Qb2ludHNcbiAgICAgKiBAcGFyYW0ge1JheX0gb3V0IFJlY2VpdmUgdGhlIG9wZXJhdGluZyByYXkuXG4gICAgICogQHBhcmFtIHtWZWMzfSBvcmlnaW4gT3JpZ2luIG9mIHJheVxuICAgICAqIEBwYXJhbSB7VmVjM30gdGFyZ2V0IEEgcG9pbnQgb24gYSByYXkuXG4gICAgICogQHJldHVybiB7UmF5fSBvdXQgUmVjZWl2ZSB0aGUgb3BlcmF0aW5nIHJheS5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGZyb21Qb2ludHMgKG91dDogcmF5LCBvcmlnaW46IFZlYzMsIHRhcmdldDogVmVjMyk6IHJheSB7XG4gICAgICAgIFZlYzMuY29weShvdXQubywgb3JpZ2luKTtcbiAgICAgICAgVmVjMy5ub3JtYWxpemUob3V0LmQsIFZlYzMuc3VidHJhY3Qob3V0LmQsIHRhcmdldCwgb3JpZ2luKSk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldCB0aGUgY29tcG9uZW50cyBvZiBhIHJheSB0byB0aGUgZ2l2ZW4gdmFsdWVzXG4gICAgICogISN6aFxuICAgICAqIOWwhue7meWumuWwhOe6v+eahOWxnuaAp+iuvue9ruS4uue7meWumueahOWAvOOAglxuICAgICAqIEBtZXRob2Qgc2V0XG4gICAgICogQHBhcmFtIHtSYXl9IG91dCBSZWNlaXZlIHRoZSBvcGVyYXRpbmcgcmF5LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBveCBUaGUgeCBwYXJ0IG9mIHRoZSBzdGFydGluZyBwb2ludC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb3kgVGhlIHkgcGFydCBvZiB0aGUgc3RhcnRpbmcgcG9pbnQuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG96IFRoZSB6IHBhcnQgb2YgdGhlIHN0YXJ0aW5nIHBvaW50LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkeCBYIGluIHRoZSBkaXJlY3Rpb24uXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGR5IFkgaW4gdGhlIGRpcmVjdGlvbi5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZHogWiBpbiB0aGUgZGlyZWN0aW9uLlxuICAgICAqIEByZXR1cm4ge1JheX0gb3V0IFJlY2VpdmUgdGhlIG9wZXJhdGluZyByYXkuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzZXQgKG91dDogcmF5LCBveDogbnVtYmVyLCBveTogbnVtYmVyLCBvejogbnVtYmVyLCBkeDogbnVtYmVyLCBkeTogbnVtYmVyLCBkejogbnVtYmVyKTogcmF5IHtcbiAgICAgICAgb3V0Lm8ueCA9IG94O1xuICAgICAgICBvdXQuby55ID0gb3k7XG4gICAgICAgIG91dC5vLnogPSBvejtcbiAgICAgICAgb3V0LmQueCA9IGR4O1xuICAgICAgICBvdXQuZC55ID0gZHk7XG4gICAgICAgIG91dC5kLnogPSBkejtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTdGFydCBwb2ludC5cbiAgICAgKiAhI3poXG4gICAgICog6LW354K544CCXG4gICAgICogQHByb3BlcnR5IHtWZWMzfSBvXG4gICAgICovXG4gICAgcHVibGljIG86IFZlYzM7XG5cbiAgICAvKipcbiAgICAgKiAhI2VcbiAgICAgKiBEaXJlY3Rpb25cbiAgICAgKiAhI3poXG4gICAgICog5pa55ZCR44CCXG4gICAgICogQHByb3BlcnR5IHtWZWMzfSBkXG4gICAgICovXG4gICAgcHVibGljIGQ6IFZlYzM7XG5cbiAgICBwcml2YXRlIF90eXBlOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENvbnN0cnVjdCBhIHJheS5cbiAgICAgKiAhI3poIOaehOmAoOS4gOadoeWwhOe6v+OAglxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBveCBUaGUgeCBwYXJ0IG9mIHRoZSBzdGFydGluZyBwb2ludC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb3kgVGhlIHkgcGFydCBvZiB0aGUgc3RhcnRpbmcgcG9pbnQuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG96IFRoZSB6IHBhcnQgb2YgdGhlIHN0YXJ0aW5nIHBvaW50LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkeCBYIGluIHRoZSBkaXJlY3Rpb24uXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGR5IFkgaW4gdGhlIGRpcmVjdGlvbi5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZHogWiBpbiB0aGUgZGlyZWN0aW9uLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yIChveDogbnVtYmVyID0gMCwgb3k6IG51bWJlciA9IDAsIG96OiBudW1iZXIgPSAwLFxuICAgICAgICBkeDogbnVtYmVyID0gMCwgZHk6IG51bWJlciA9IDAsIGR6OiBudW1iZXIgPSAtMSkge1xuICAgICAgICB0aGlzLl90eXBlID0gZW51bXMuU0hBUEVfUkFZO1xuICAgICAgICB0aGlzLm8gPSBuZXcgVmVjMyhveCwgb3ksIG96KTtcbiAgICAgICAgdGhpcy5kID0gbmV3IFZlYzMoZHgsIGR5LCBkeik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDb21wdXRlIGhpdC5cbiAgICAgKiBAbWV0aG9kIGNvbXB1dGVIaXRcbiAgICAgKiBAcGFyYW0ge0lWZWMzTGlrZX0gb3V0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlXG4gICAgICovXG4gICAgcHVibGljIGNvbXB1dGVIaXQgKG91dDogSVZlYzNMaWtlLCBkaXN0YW5jZTogbnVtYmVyKSB7XG4gICAgICAgIFZlYzMubm9ybWFsaXplKG91dCwgdGhpcy5kKVxuICAgICAgICBWZWMzLnNjYWxlQW5kQWRkKG91dCwgdGhpcy5vLCBvdXQsIGRpc3RhbmNlKTtcbiAgICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==