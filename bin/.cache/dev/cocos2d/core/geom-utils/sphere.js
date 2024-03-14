
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/geom-utils/sphere.js';
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
var _v3_tmp = new _valueTypes.Vec3();
/**
 * !#en
 * Sphere.
 * !#zh
 * 轴对齐球。
 * @class geomUtils.Sphere
 */


var sphere = /*#__PURE__*/function () {
  /**
   * !#en
   * create a new sphere
   * !#zh
   * 创建一个新的 sphere 实例。
   * @method create
   * @param cx X coordinates of the shape relative to the origin.
   * @param cy Y coordinates of the shape relative to the origin.
   * @param cz Z coordinates of the shape relative to the origin.
   * @param r Radius of sphere
   * @return {Sphere} Returns a sphere.
   */
  sphere.create = function create(cx, cy, cz, r) {
    return new sphere(cx, cy, cz, r);
  }
  /**
   * !#en
   * clone a new sphere
   * !#zh
   * 克隆一个新的 sphere 实例。
   * @method clone
   * @param {Sphere} p The target of cloning.
   * @return {Sphere} The cloned instance.
   */
  ;

  sphere.clone = function clone(p) {
    return new sphere(p.center.x, p.center.y, p.center.z, p.radius);
  }
  /**
   * !#en
   * copy the values from one sphere to another
   * !#zh
   * 将从一个 sphere 的值复制到另一个 sphere。
   * @method copy
   * @param {Sphere} out Accept the sphere of operations.
   * @param {Sphere} a Sphere being copied.
   * @return {Sphere} out Accept the sphere of operations.
   */
  ;

  sphere.copy = function copy(out, p) {
    _valueTypes.Vec3.copy(out.center, p.center);

    out.radius = p.radius;
    return out;
  }
  /**
   * !#en
   * create a new bounding sphere from two corner points
   * !#zh
   * 从两个点创建一个新的 sphere。
   * @method fromPoints
   * @param out - Accept the sphere of operations.
   * @param minPos - The smallest point of sphere.
   * @param maxPos - The maximum point of sphere.
   * @returns {Sphere} out Accept the sphere of operations.
   */
  ;

  sphere.fromPoints = function fromPoints(out, minPos, maxPos) {
    _valueTypes.Vec3.multiplyScalar(out.center, _valueTypes.Vec3.add(_v3_tmp, minPos, maxPos), 0.5);

    out.radius = _valueTypes.Vec3.subtract(_v3_tmp, maxPos, minPos).len() * 0.5;
    return out;
  }
  /**
   * !#en Set the components of a sphere to the given values
   * !#zh 将球体的属性设置为给定的值。
   * @method set
   * @param {Sphere} out Accept the sphere of operations.
   * @param cx X coordinates of the shape relative to the origin.
   * @param cy Y coordinates of the shape relative to the origin.
   * @param cz Z coordinates of the shape relative to the origin.
   * @param {number} r Radius.
   * @return {Sphere} out Accept the sphere of operations.
   */
  ;

  sphere.set = function set(out, cx, cy, cz, r) {
    out.center.x = cx;
    out.center.y = cy;
    out.center.z = cz;
    out.radius = r;
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

  /**
   * !#en
   * Construct a sphere.
   * !#zh
   * 构造一个球。
   * @constructor
   * @param cx The x-coordinate of the sphere's world coordinates.
   * @param cy The y-coordinate of the sphere's world coordinates.
   * @param cz The z-coordinate of the sphere's world coordinates.
   * @param {number} r Radius.
   */
  function sphere(cx, cy, cz, r) {
    if (cx === void 0) {
      cx = 0;
    }

    if (cy === void 0) {
      cy = 0;
    }

    if (cz === void 0) {
      cz = 0;
    }

    if (r === void 0) {
      r = 1;
    }

    this.center = void 0;
    this.radius = void 0;
    this._type = void 0;
    this._type = _enums["default"].SHAPE_SPHERE;
    this.center = new _valueTypes.Vec3(cx, cy, cz);
    this.radius = r;
  }
  /**
   * !#en
   * Clone.
   * !#zh
   * 获得克隆。
   * @method clone
   */


  var _proto = sphere.prototype;

  _proto.clone = function clone() {
    return sphere.clone(this);
  }
  /**
   * !#en
   * Copy sphere
   * !#zh
   * 拷贝对象。
   * @method copy
   * @param a Copy target.
   */
  ;

  _proto.copy = function copy(a) {
    return sphere.copy(this, a);
  }
  /**
   * !#en
   * Get the bounding points of this shape
   * !#zh
   * 获取此形状的边界点。
   * @method getBoundary
   * @param {Vec3} minPos
   * @param {Vec3} maxPos
   */
  ;

  _proto.getBoundary = function getBoundary(minPos, maxPos) {
    _valueTypes.Vec3.set(minPos, this.center.x - this.radius, this.center.y - this.radius, this.center.z - this.radius);

    _valueTypes.Vec3.set(maxPos, this.center.x + this.radius, this.center.y + this.radius, this.center.z + this.radius);
  }
  /**
   * !#en
   * Transform this shape
   * !#zh
   * 将 out 根据这个 sphere 的数据进行变换。
   * @method transform
   * @param m The transformation matrix.
   * @param pos The position part of the transformation.
   * @param rot The rotating part of the transformation.
   * @param scale The scaling part of the transformation.
   * @param out The target of the transformation.
   */
  ;

  _proto.transform = function transform(m, pos, rot, scale, out) {
    _valueTypes.Vec3.transformMat4(out.center, this.center, m);

    out.radius = this.radius * scale.maxAxis();
  }
  /**
   * !#zh
   * 将 out 根据这个 sphere 的数据进行变换。
   * @translateAndRotate
   * @param m The transformation matrix.
   * @param rot The rotating part of the transformation.
   * @param out The target of the transformation.
   */
  ;

  _proto.translateAndRotate = function translateAndRotate(m, rot, out) {
    _valueTypes.Vec3.transformMat4(out.center, this.center, m);
  }
  /**
   * !#en
   * Scale out based on the sphere data.
   * !#zh
   * 将 out 根据这个 sphere 的数据进行缩放。
   * @method setScale
   * @param scale Scale value
   * @param out Scale target
   */
  ;

  _proto.setScale = function setScale(scale, out) {
    out.radius = this.radius * scale.maxAxis();
  };

  return sphere;
}();

exports["default"] = sphere;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2dlb20tdXRpbHMvc3BoZXJlLnRzIl0sIm5hbWVzIjpbIl92M190bXAiLCJWZWMzIiwic3BoZXJlIiwiY3JlYXRlIiwiY3giLCJjeSIsImN6IiwiciIsImNsb25lIiwicCIsImNlbnRlciIsIngiLCJ5IiwieiIsInJhZGl1cyIsImNvcHkiLCJvdXQiLCJmcm9tUG9pbnRzIiwibWluUG9zIiwibWF4UG9zIiwibXVsdGlwbHlTY2FsYXIiLCJhZGQiLCJzdWJ0cmFjdCIsImxlbiIsInNldCIsIl90eXBlIiwiZW51bXMiLCJTSEFQRV9TUEhFUkUiLCJhIiwiZ2V0Qm91bmRhcnkiLCJ0cmFuc2Zvcm0iLCJtIiwicG9zIiwicm90Iiwic2NhbGUiLCJ0cmFuc2Zvcm1NYXQ0IiwibWF4QXhpcyIsInRyYW5zbGF0ZUFuZFJvdGF0ZSIsInNldFNjYWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOztBQUNBOzs7O0FBMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBLElBQU1BLE9BQU8sR0FBRyxJQUFJQyxnQkFBSixFQUFoQjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7SUFDcUJDO0FBRWpCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtTQUNrQkMsU0FBZCxnQkFBc0JDLEVBQXRCLEVBQWtDQyxFQUFsQyxFQUE4Q0MsRUFBOUMsRUFBMERDLENBQTFELEVBQTZFO0FBQ3pFLFdBQU8sSUFBSUwsTUFBSixDQUFXRSxFQUFYLEVBQWVDLEVBQWYsRUFBbUJDLEVBQW5CLEVBQXVCQyxDQUF2QixDQUFQO0FBQ0g7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUNrQkMsUUFBZCxlQUFxQkMsQ0FBckIsRUFBd0M7QUFDcEMsV0FBTyxJQUFJUCxNQUFKLENBQVdPLENBQUMsQ0FBQ0MsTUFBRixDQUFTQyxDQUFwQixFQUF1QkYsQ0FBQyxDQUFDQyxNQUFGLENBQVNFLENBQWhDLEVBQW1DSCxDQUFDLENBQUNDLE1BQUYsQ0FBU0csQ0FBNUMsRUFBK0NKLENBQUMsQ0FBQ0ssTUFBakQsQ0FBUDtBQUNIO0FBRUQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUNrQkMsT0FBZCxjQUFvQkMsR0FBcEIsRUFBaUNQLENBQWpDLEVBQW9EO0FBQ2hEUixxQkFBS2MsSUFBTCxDQUFVQyxHQUFHLENBQUNOLE1BQWQsRUFBc0JELENBQUMsQ0FBQ0MsTUFBeEI7O0FBQ0FNLElBQUFBLEdBQUcsQ0FBQ0YsTUFBSixHQUFhTCxDQUFDLENBQUNLLE1BQWY7QUFFQSxXQUFPRSxHQUFQO0FBQ0g7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7U0FDa0JDLGFBQWQsb0JBQTBCRCxHQUExQixFQUF1Q0UsTUFBdkMsRUFBcURDLE1BQXJELEVBQTJFO0FBQ3ZFbEIscUJBQUttQixjQUFMLENBQW9CSixHQUFHLENBQUNOLE1BQXhCLEVBQWdDVCxpQkFBS29CLEdBQUwsQ0FBU3JCLE9BQVQsRUFBa0JrQixNQUFsQixFQUEwQkMsTUFBMUIsQ0FBaEMsRUFBbUUsR0FBbkU7O0FBQ0FILElBQUFBLEdBQUcsQ0FBQ0YsTUFBSixHQUFhYixpQkFBS3FCLFFBQUwsQ0FBY3RCLE9BQWQsRUFBdUJtQixNQUF2QixFQUErQkQsTUFBL0IsRUFBdUNLLEdBQXZDLEtBQStDLEdBQTVEO0FBQ0EsV0FBT1AsR0FBUDtBQUNIO0FBRUQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O1NBQ2tCUSxNQUFkLGFBQW1CUixHQUFuQixFQUFnQ1osRUFBaEMsRUFBNENDLEVBQTVDLEVBQXdEQyxFQUF4RCxFQUFvRUMsQ0FBcEUsRUFBdUY7QUFDbkZTLElBQUFBLEdBQUcsQ0FBQ04sTUFBSixDQUFXQyxDQUFYLEdBQWVQLEVBQWY7QUFDQVksSUFBQUEsR0FBRyxDQUFDTixNQUFKLENBQVdFLENBQVgsR0FBZVAsRUFBZjtBQUNBVyxJQUFBQSxHQUFHLENBQUNOLE1BQUosQ0FBV0csQ0FBWCxHQUFlUCxFQUFmO0FBQ0FVLElBQUFBLEdBQUcsQ0FBQ0YsTUFBSixHQUFhUCxDQUFiO0FBRUEsV0FBT1MsR0FBUDtBQUNIO0FBRUQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQVlJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSSxrQkFBYVosRUFBYixFQUE2QkMsRUFBN0IsRUFBNkNDLEVBQTdDLEVBQTZEQyxDQUE3RCxFQUE0RTtBQUFBLFFBQS9ESCxFQUErRDtBQUEvREEsTUFBQUEsRUFBK0QsR0FBbEQsQ0FBa0Q7QUFBQTs7QUFBQSxRQUEvQ0MsRUFBK0M7QUFBL0NBLE1BQUFBLEVBQStDLEdBQWxDLENBQWtDO0FBQUE7O0FBQUEsUUFBL0JDLEVBQStCO0FBQS9CQSxNQUFBQSxFQUErQixHQUFsQixDQUFrQjtBQUFBOztBQUFBLFFBQWZDLENBQWU7QUFBZkEsTUFBQUEsQ0FBZSxHQUFILENBQUc7QUFBQTs7QUFBQSxTQXRCckVHLE1Bc0JxRTtBQUFBLFNBZnJFSSxNQWVxRTtBQUFBLFNBYmxFVyxLQWFrRTtBQUN4RSxTQUFLQSxLQUFMLEdBQWFDLGtCQUFNQyxZQUFuQjtBQUNBLFNBQUtqQixNQUFMLEdBQWMsSUFBSVQsZ0JBQUosQ0FBU0csRUFBVCxFQUFhQyxFQUFiLEVBQWlCQyxFQUFqQixDQUFkO0FBQ0EsU0FBS1EsTUFBTCxHQUFjUCxDQUFkO0FBQ0g7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7U0FDV0MsUUFBUCxpQkFBZ0I7QUFDWixXQUFPTixNQUFNLENBQUNNLEtBQVAsQ0FBYSxJQUFiLENBQVA7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUNXTyxPQUFQLGNBQWFhLENBQWIsRUFBd0I7QUFDcEIsV0FBTzFCLE1BQU0sQ0FBQ2EsSUFBUCxDQUFZLElBQVosRUFBa0JhLENBQWxCLENBQVA7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O1NBQ1dDLGNBQVAscUJBQW9CWCxNQUFwQixFQUFrQ0MsTUFBbEMsRUFBZ0Q7QUFDNUNsQixxQkFBS3VCLEdBQUwsQ0FBU04sTUFBVCxFQUFpQixLQUFLUixNQUFMLENBQVlDLENBQVosR0FBZ0IsS0FBS0csTUFBdEMsRUFBOEMsS0FBS0osTUFBTCxDQUFZRSxDQUFaLEdBQWdCLEtBQUtFLE1BQW5FLEVBQTJFLEtBQUtKLE1BQUwsQ0FBWUcsQ0FBWixHQUFnQixLQUFLQyxNQUFoRzs7QUFDQWIscUJBQUt1QixHQUFMLENBQVNMLE1BQVQsRUFBaUIsS0FBS1QsTUFBTCxDQUFZQyxDQUFaLEdBQWdCLEtBQUtHLE1BQXRDLEVBQThDLEtBQUtKLE1BQUwsQ0FBWUUsQ0FBWixHQUFnQixLQUFLRSxNQUFuRSxFQUEyRSxLQUFLSixNQUFMLENBQVlHLENBQVosR0FBZ0IsS0FBS0MsTUFBaEc7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O1NBQ1dnQixZQUFQLG1CQUFrQkMsQ0FBbEIsRUFBMkJDLEdBQTNCLEVBQXNDQyxHQUF0QyxFQUFpREMsS0FBakQsRUFBOERsQixHQUE5RCxFQUEyRTtBQUN2RWYscUJBQUtrQyxhQUFMLENBQW1CbkIsR0FBRyxDQUFDTixNQUF2QixFQUErQixLQUFLQSxNQUFwQyxFQUE0Q3FCLENBQTVDOztBQUNBZixJQUFBQSxHQUFHLENBQUNGLE1BQUosR0FBYSxLQUFLQSxNQUFMLEdBQWNvQixLQUFLLENBQUNFLE9BQU4sRUFBM0I7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUNXQyxxQkFBUCw0QkFBMkJOLENBQTNCLEVBQW9DRSxHQUFwQyxFQUErQ2pCLEdBQS9DLEVBQTJEO0FBQ3ZEZixxQkFBS2tDLGFBQUwsQ0FBbUJuQixHQUFHLENBQUNOLE1BQXZCLEVBQStCLEtBQUtBLE1BQXBDLEVBQTRDcUIsQ0FBNUM7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O1NBQ1dPLFdBQVAsa0JBQWlCSixLQUFqQixFQUE4QmxCLEdBQTlCLEVBQTJDO0FBQ3ZDQSxJQUFBQSxHQUFHLENBQUNGLE1BQUosR0FBYSxLQUFLQSxNQUFMLEdBQWNvQixLQUFLLENBQUNFLE9BQU4sRUFBM0I7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgeyBNYXQ0LCBRdWF0LCBWZWMzIH0gZnJvbSAnLi4vdmFsdWUtdHlwZXMnO1xuaW1wb3J0IGVudW1zIGZyb20gJy4vZW51bXMnO1xuXG5jb25zdCBfdjNfdG1wID0gbmV3IFZlYzMoKTtcblxuLyoqXG4gKiAhI2VuXG4gKiBTcGhlcmUuXG4gKiAhI3poXG4gKiDovbTlr7npvZDnkIPjgIJcbiAqIEBjbGFzcyBnZW9tVXRpbHMuU3BoZXJlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHNwaGVyZSB7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogY3JlYXRlIGEgbmV3IHNwaGVyZVxuICAgICAqICEjemhcbiAgICAgKiDliJvlu7rkuIDkuKrmlrDnmoQgc3BoZXJlIOWunuS+i+OAglxuICAgICAqIEBtZXRob2QgY3JlYXRlXG4gICAgICogQHBhcmFtIGN4IFggY29vcmRpbmF0ZXMgb2YgdGhlIHNoYXBlIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW4uXG4gICAgICogQHBhcmFtIGN5IFkgY29vcmRpbmF0ZXMgb2YgdGhlIHNoYXBlIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW4uXG4gICAgICogQHBhcmFtIGN6IFogY29vcmRpbmF0ZXMgb2YgdGhlIHNoYXBlIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW4uXG4gICAgICogQHBhcmFtIHIgUmFkaXVzIG9mIHNwaGVyZVxuICAgICAqIEByZXR1cm4ge1NwaGVyZX0gUmV0dXJucyBhIHNwaGVyZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZSAoY3g6IG51bWJlciwgY3k6IG51bWJlciwgY3o6IG51bWJlciwgcjogbnVtYmVyKTogc3BoZXJlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBzcGhlcmUoY3gsIGN5LCBjeiwgcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIGNsb25lIGEgbmV3IHNwaGVyZVxuICAgICAqICEjemhcbiAgICAgKiDlhYvpmobkuIDkuKrmlrDnmoQgc3BoZXJlIOWunuS+i+OAglxuICAgICAqIEBtZXRob2QgY2xvbmVcbiAgICAgKiBAcGFyYW0ge1NwaGVyZX0gcCBUaGUgdGFyZ2V0IG9mIGNsb25pbmcuXG4gICAgICogQHJldHVybiB7U3BoZXJlfSBUaGUgY2xvbmVkIGluc3RhbmNlLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY2xvbmUgKHA6IHNwaGVyZSk6IHNwaGVyZSB7XG4gICAgICAgIHJldHVybiBuZXcgc3BoZXJlKHAuY2VudGVyLngsIHAuY2VudGVyLnksIHAuY2VudGVyLnosIHAucmFkaXVzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogY29weSB0aGUgdmFsdWVzIGZyb20gb25lIHNwaGVyZSB0byBhbm90aGVyXG4gICAgICogISN6aFxuICAgICAqIOWwhuS7juS4gOS4qiBzcGhlcmUg55qE5YC85aSN5Yi25Yiw5Y+m5LiA5LiqIHNwaGVyZeOAglxuICAgICAqIEBtZXRob2QgY29weVxuICAgICAqIEBwYXJhbSB7U3BoZXJlfSBvdXQgQWNjZXB0IHRoZSBzcGhlcmUgb2Ygb3BlcmF0aW9ucy5cbiAgICAgKiBAcGFyYW0ge1NwaGVyZX0gYSBTcGhlcmUgYmVpbmcgY29waWVkLlxuICAgICAqIEByZXR1cm4ge1NwaGVyZX0gb3V0IEFjY2VwdCB0aGUgc3BoZXJlIG9mIG9wZXJhdGlvbnMuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjb3B5IChvdXQ6IHNwaGVyZSwgcDogc3BoZXJlKTogc3BoZXJlIHtcbiAgICAgICAgVmVjMy5jb3B5KG91dC5jZW50ZXIsIHAuY2VudGVyKTtcbiAgICAgICAgb3V0LnJhZGl1cyA9IHAucmFkaXVzO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIGNyZWF0ZSBhIG5ldyBib3VuZGluZyBzcGhlcmUgZnJvbSB0d28gY29ybmVyIHBvaW50c1xuICAgICAqICEjemhcbiAgICAgKiDku47kuKTkuKrngrnliJvlu7rkuIDkuKrmlrDnmoQgc3BoZXJl44CCXG4gICAgICogQG1ldGhvZCBmcm9tUG9pbnRzXG4gICAgICogQHBhcmFtIG91dCAtIEFjY2VwdCB0aGUgc3BoZXJlIG9mIG9wZXJhdGlvbnMuXG4gICAgICogQHBhcmFtIG1pblBvcyAtIFRoZSBzbWFsbGVzdCBwb2ludCBvZiBzcGhlcmUuXG4gICAgICogQHBhcmFtIG1heFBvcyAtIFRoZSBtYXhpbXVtIHBvaW50IG9mIHNwaGVyZS5cbiAgICAgKiBAcmV0dXJucyB7U3BoZXJlfSBvdXQgQWNjZXB0IHRoZSBzcGhlcmUgb2Ygb3BlcmF0aW9ucy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGZyb21Qb2ludHMgKG91dDogc3BoZXJlLCBtaW5Qb3M6IFZlYzMsIG1heFBvczogVmVjMyk6IHNwaGVyZSB7XG4gICAgICAgIFZlYzMubXVsdGlwbHlTY2FsYXIob3V0LmNlbnRlciwgVmVjMy5hZGQoX3YzX3RtcCwgbWluUG9zLCBtYXhQb3MpLCAwLjUpO1xuICAgICAgICBvdXQucmFkaXVzID0gVmVjMy5zdWJ0cmFjdChfdjNfdG1wLCBtYXhQb3MsIG1pblBvcykubGVuKCkgKiAwLjU7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIGNvbXBvbmVudHMgb2YgYSBzcGhlcmUgdG8gdGhlIGdpdmVuIHZhbHVlc1xuICAgICAqICEjemgg5bCG55CD5L2T55qE5bGe5oCn6K6+572u5Li657uZ5a6a55qE5YC844CCXG4gICAgICogQG1ldGhvZCBzZXRcbiAgICAgKiBAcGFyYW0ge1NwaGVyZX0gb3V0IEFjY2VwdCB0aGUgc3BoZXJlIG9mIG9wZXJhdGlvbnMuXG4gICAgICogQHBhcmFtIGN4IFggY29vcmRpbmF0ZXMgb2YgdGhlIHNoYXBlIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW4uXG4gICAgICogQHBhcmFtIGN5IFkgY29vcmRpbmF0ZXMgb2YgdGhlIHNoYXBlIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW4uXG4gICAgICogQHBhcmFtIGN6IFogY29vcmRpbmF0ZXMgb2YgdGhlIHNoYXBlIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW4uXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHIgUmFkaXVzLlxuICAgICAqIEByZXR1cm4ge1NwaGVyZX0gb3V0IEFjY2VwdCB0aGUgc3BoZXJlIG9mIG9wZXJhdGlvbnMuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzZXQgKG91dDogc3BoZXJlLCBjeDogbnVtYmVyLCBjeTogbnVtYmVyLCBjejogbnVtYmVyLCByOiBudW1iZXIpOiBzcGhlcmUge1xuICAgICAgICBvdXQuY2VudGVyLnggPSBjeDtcbiAgICAgICAgb3V0LmNlbnRlci55ID0gY3k7XG4gICAgICAgIG91dC5jZW50ZXIueiA9IGN6O1xuICAgICAgICBvdXQucmFkaXVzID0gcjtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBUaGUgY2VudGVyIG9mIHRoZSBsb2NhbCBjb29yZGluYXRlLlxuICAgICAqICEjemhcbiAgICAgKiDmnKzlnLDlnZDmoIfnmoTkuK3lv4PngrnjgIJcbiAgICAgKiBAcHJvcGVydHkge1ZlYzN9IGNlbnRlclxuICAgICAqL1xuICAgIHB1YmxpYyBjZW50ZXI6IFZlYzM7XG5cbiAgICAvKipcbiAgICAgKiAhI3poXG4gICAgICog5Y2K5b6E44CCXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHJhZGl1c1xuICAgICAqL1xuICAgIHB1YmxpYyByYWRpdXM6IG51bWJlcjtcblxuICAgIHByb3RlY3RlZCBfdHlwZTogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIENvbnN0cnVjdCBhIHNwaGVyZS5cbiAgICAgKiAhI3poXG4gICAgICog5p6E6YCg5LiA5Liq55CD44CCXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIGN4IFRoZSB4LWNvb3JkaW5hdGUgb2YgdGhlIHNwaGVyZSdzIHdvcmxkIGNvb3JkaW5hdGVzLlxuICAgICAqIEBwYXJhbSBjeSBUaGUgeS1jb29yZGluYXRlIG9mIHRoZSBzcGhlcmUncyB3b3JsZCBjb29yZGluYXRlcy5cbiAgICAgKiBAcGFyYW0gY3ogVGhlIHotY29vcmRpbmF0ZSBvZiB0aGUgc3BoZXJlJ3Mgd29ybGQgY29vcmRpbmF0ZXMuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHIgUmFkaXVzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yIChjeDogbnVtYmVyID0gMCwgY3k6IG51bWJlciA9IDAsIGN6OiBudW1iZXIgPSAwLCByOiBudW1iZXIgPSAxKSB7XG4gICAgICAgIHRoaXMuX3R5cGUgPSBlbnVtcy5TSEFQRV9TUEhFUkU7XG4gICAgICAgIHRoaXMuY2VudGVyID0gbmV3IFZlYzMoY3gsIGN5LCBjeik7XG4gICAgICAgIHRoaXMucmFkaXVzID0gcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ2xvbmUuXG4gICAgICogISN6aFxuICAgICAqIOiOt+W+l+WFi+mahuOAglxuICAgICAqIEBtZXRob2QgY2xvbmVcbiAgICAgKi9cbiAgICBwdWJsaWMgY2xvbmUgKCkge1xuICAgICAgICByZXR1cm4gc3BoZXJlLmNsb25lKHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDb3B5IHNwaGVyZVxuICAgICAqICEjemhcbiAgICAgKiDmi7fotJ3lr7nosaHjgIJcbiAgICAgKiBAbWV0aG9kIGNvcHlcbiAgICAgKiBAcGFyYW0gYSBDb3B5IHRhcmdldC5cbiAgICAgKi9cbiAgICBwdWJsaWMgY29weSAoYTogc3BoZXJlKSB7XG4gICAgICAgIHJldHVybiBzcGhlcmUuY29weSh0aGlzLCBhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0IHRoZSBib3VuZGluZyBwb2ludHMgb2YgdGhpcyBzaGFwZVxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bmraTlvaLnirbnmoTovrnnlYzngrnjgIJcbiAgICAgKiBAbWV0aG9kIGdldEJvdW5kYXJ5XG4gICAgICogQHBhcmFtIHtWZWMzfSBtaW5Qb3NcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IG1heFBvc1xuICAgICAqL1xuICAgIHB1YmxpYyBnZXRCb3VuZGFyeSAobWluUG9zOiBWZWMzLCBtYXhQb3M6IFZlYzMpIHtcbiAgICAgICAgVmVjMy5zZXQobWluUG9zLCB0aGlzLmNlbnRlci54IC0gdGhpcy5yYWRpdXMsIHRoaXMuY2VudGVyLnkgLSB0aGlzLnJhZGl1cywgdGhpcy5jZW50ZXIueiAtIHRoaXMucmFkaXVzKTtcbiAgICAgICAgVmVjMy5zZXQobWF4UG9zLCB0aGlzLmNlbnRlci54ICsgdGhpcy5yYWRpdXMsIHRoaXMuY2VudGVyLnkgKyB0aGlzLnJhZGl1cywgdGhpcy5jZW50ZXIueiArIHRoaXMucmFkaXVzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVHJhbnNmb3JtIHRoaXMgc2hhcGVcbiAgICAgKiAhI3poXG4gICAgICog5bCGIG91dCDmoLnmja7ov5nkuKogc3BoZXJlIOeahOaVsOaNrui/m+ihjOWPmOaNouOAglxuICAgICAqIEBtZXRob2QgdHJhbnNmb3JtXG4gICAgICogQHBhcmFtIG0gVGhlIHRyYW5zZm9ybWF0aW9uIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gcG9zIFRoZSBwb3NpdGlvbiBwYXJ0IG9mIHRoZSB0cmFuc2Zvcm1hdGlvbi5cbiAgICAgKiBAcGFyYW0gcm90IFRoZSByb3RhdGluZyBwYXJ0IG9mIHRoZSB0cmFuc2Zvcm1hdGlvbi5cbiAgICAgKiBAcGFyYW0gc2NhbGUgVGhlIHNjYWxpbmcgcGFydCBvZiB0aGUgdHJhbnNmb3JtYXRpb24uXG4gICAgICogQHBhcmFtIG91dCBUaGUgdGFyZ2V0IG9mIHRoZSB0cmFuc2Zvcm1hdGlvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgdHJhbnNmb3JtIChtOiBNYXQ0LCBwb3M6IFZlYzMsIHJvdDogUXVhdCwgc2NhbGU6IFZlYzMsIG91dDogc3BoZXJlKSB7XG4gICAgICAgIFZlYzMudHJhbnNmb3JtTWF0NChvdXQuY2VudGVyLCB0aGlzLmNlbnRlciwgbSk7XG4gICAgICAgIG91dC5yYWRpdXMgPSB0aGlzLnJhZGl1cyAqIHNjYWxlLm1heEF4aXMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poXG4gICAgICog5bCGIG91dCDmoLnmja7ov5nkuKogc3BoZXJlIOeahOaVsOaNrui/m+ihjOWPmOaNouOAglxuICAgICAqIEB0cmFuc2xhdGVBbmRSb3RhdGVcbiAgICAgKiBAcGFyYW0gbSBUaGUgdHJhbnNmb3JtYXRpb24gbWF0cml4LlxuICAgICAqIEBwYXJhbSByb3QgVGhlIHJvdGF0aW5nIHBhcnQgb2YgdGhlIHRyYW5zZm9ybWF0aW9uLlxuICAgICAqIEBwYXJhbSBvdXQgVGhlIHRhcmdldCBvZiB0aGUgdHJhbnNmb3JtYXRpb24uXG4gICAgICovXG4gICAgcHVibGljIHRyYW5zbGF0ZUFuZFJvdGF0ZSAobTogTWF0NCwgcm90OiBRdWF0LCBvdXQ6IHNwaGVyZSl7XG4gICAgICAgIFZlYzMudHJhbnNmb3JtTWF0NChvdXQuY2VudGVyLCB0aGlzLmNlbnRlciwgbSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNjYWxlIG91dCBiYXNlZCBvbiB0aGUgc3BoZXJlIGRhdGEuXG4gICAgICogISN6aFxuICAgICAqIOWwhiBvdXQg5qC55o2u6L+Z5LiqIHNwaGVyZSDnmoTmlbDmja7ov5vooYznvKnmlL7jgIJcbiAgICAgKiBAbWV0aG9kIHNldFNjYWxlXG4gICAgICogQHBhcmFtIHNjYWxlIFNjYWxlIHZhbHVlXG4gICAgICogQHBhcmFtIG91dCBTY2FsZSB0YXJnZXRcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0U2NhbGUgKHNjYWxlOiBWZWMzLCBvdXQ6IHNwaGVyZSkge1xuICAgICAgICBvdXQucmFkaXVzID0gdGhpcy5yYWRpdXMgKiBzY2FsZS5tYXhBeGlzKCk7XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvIn0=