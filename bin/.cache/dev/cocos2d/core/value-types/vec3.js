
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/value-types/vec3.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _valueType = _interopRequireDefault(require("./value-type"));

var _CCClass = _interopRequireDefault(require("../platform/CCClass"));

var _misc = _interopRequireDefault(require("../utils/misc"));

var _vec = _interopRequireDefault(require("./vec2"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _x = 0.0;
var _y = 0.0;
var _z = 0.0;
/**
 * !#en Representation of 3D vectors and points.
 * !#zh 表示 3D 向量和坐标
 *
 * @class Vec3
 * @extends ValueType
 */

var Vec3 = /*#__PURE__*/function (_ValueType) {
  _inheritsLoose(Vec3, _ValueType);

  var _proto = Vec3.prototype;

  // deprecated

  /**
   * !#en Returns the length of this vector.
   * !#zh 返回该向量的长度。
   * @method mag
   * @return {number} the result
   * @example
   * var v = cc.v3(10, 10, 10);
   * v.mag(); // return 17.320508075688775;
   */

  /**
   * !#en Returns the squared length of this vector.
   * !#zh 返回该向量的长度平方。
   * @method magSqr
   * @return {number} the result
   */

  /**
   * !#en Subtracts one vector from this. If you want to save result to another vector, use sub() instead.
   * !#zh 向量减法。如果你想保存结果到另一个向量，可使用 sub() 代替。
   * @method subSelf
   * @param {Vec3} vector
   * @return {Vec3} returns this
   * @chainable
   */

  /**
   * !#en Subtracts one vector from this, and returns the new result.
   * !#zh 向量减法，并返回新结果。
   * @method sub
   * @param {Vec3} vector
   * @param {Vec3} [out] - optional, the receiving vector, you can pass the same vec3 to save result to itself, if not provided, a new vec3 will be created
   * @return {Vec3} the result
   */
  _proto.sub = function sub(vector, out) {
    return Vec3.subtract(out || new Vec3(), this, vector);
  }
  /**
   * !#en Multiplies this by a number. If you want to save result to another vector, use mul() instead.
   * !#zh 缩放当前向量。如果你想结果保存到另一个向量，可使用 mul() 代替。
   * @method mulSelf
   * @param {number} num
   * @return {Vec3} returns this
   * @chainable
   */
  ;

  /**
   * !#en Multiplies by a number, and returns the new result.
   * !#zh 缩放向量，并返回新结果。
   * @method mul
   * @param {number} num
   * @param {Vec3} [out] - optional, the receiving vector, you can pass the same vec3 to save result to itself, if not provided, a new vec3 will be created
   * @return {Vec3} the result
   */
  _proto.mul = function mul(num, out) {
    return Vec3.multiplyScalar(out || new Vec3(), this, num);
  }
  /**
   * !#en Divides by a number. If you want to save result to another vector, use div() instead.
   * !#zh 向量除法。如果你想结果保存到另一个向量，可使用 div() 代替。
   * @method divSelf
   * @param {number} num
   * @return {Vec3} returns this
   * @chainable
   */
  ;

  /**
   * !#en Divides by a number, and returns the new result.
   * !#zh 向量除法，并返回新的结果。
   * @method div
   * @param {number} num
   * @param {Vec3} [out] - optional, the receiving vector, you can pass the same vec3 to save result to itself, if not provided, a new vec3 will be created
   * @return {Vec3} the result
   */
  _proto.div = function div(num, out) {
    return Vec3.multiplyScalar(out || new Vec3(), this, 1 / num);
  }
  /**
   * !#en Multiplies two vectors.
   * !#zh 分量相乘。
   * @method scaleSelf
   * @param {Vec3} vector
   * @return {Vec3} returns this
   * @chainable
   */
  ;

  /**
   * !#en Multiplies two vectors, and returns the new result.
   * !#zh 分量相乘，并返回新的结果。
   * @method scale
   * @param {Vec3} vector
   * @param {Vec3} [out] - optional, the receiving vector, you can pass the same vec3 to save result to itself, if not provided, a new vec3 will be created
   * @return {Vec3} the result
   */
  _proto.scale = function scale(vector, out) {
    return Vec3.multiply(out || new Vec3(), this, vector);
  }
  /**
   * !#en Negates the components. If you want to save result to another vector, use neg() instead.
   * !#zh 向量取反。如果你想结果保存到另一个向量，可使用 neg() 代替。
   * @method negSelf
   * @return {Vec3} returns this
   * @chainable
   */
  ;

  /**
   * !#en Negates the components, and returns the new result.
   * !#zh 返回取反后的新向量。
   * @method neg
   * @param {Vec3} [out] - optional, the receiving vector, you can pass the same vec3 to save result to itself, if not provided, a new vec3 will be created
   * @return {Vec3} the result
   */
  _proto.neg = function neg(out) {
    return Vec3.negate(out || new Vec3(), this);
  }
  /**
   * !#en return a Vec3 object with x = 1, y = 1, z = 1.
   * !#zh 新 Vec3 对象。
   * @property ONE
   * @type Vec3
   * @static
   */
  ;

  /**
   * !#zh 将目标赋值为零向量
   * !#en The target of an assignment zero vector
   * @method zero
   * @typescript
   * zero<Out extends IVec3Like> (out: Out): Out
   * @static
   */
  Vec3.zero = function zero(out) {
    out.x = 0;
    out.y = 0;
    out.z = 0;
    return out;
  }
  /**
   * !#zh 获得指定向量的拷贝
   * !#en Obtaining copy vectors designated
   * @method clone
   * @typescript
   * clone<Out extends IVec3Like> (a: Out): Vec3
   * @static
   */
  ;

  Vec3.clone = function clone(a) {
    return new Vec3(a.x, a.y, a.z);
  }
  /**
   * !#zh 复制目标向量
   * !#en Copy the target vector
   * @method copy
   * @typescript
   * copy<Out extends IVec3Like, Vec3Like extends IVec3Like> (out: Out, a: Vec3Like): Out
   * @static
   */
  ;

  Vec3.copy = function copy(out, a) {
    out.x = a.x;
    out.y = a.y;
    out.z = a.z;
    return out;
  }
  /**
   * !#zh 设置向量值
   * !#en Set to value
   * @method set
   * @typescript
   * set<Out extends IVec3Like> (out: Out, x: number, y: number, z: number): Out
   * @static
   */
  ;

  Vec3.set = function set(out, x, y, z) {
    out.x = x;
    out.y = y;
    out.z = z;
    return out;
  }
  /**
   * !#zh 逐元素向量加法
   * !#en Element-wise vector addition
   * @method add
   * @typescript
   * add<Out extends IVec3Like> (out: Out, a: Out, b: Out): Out
   * @static
   */
  ;

  Vec3.add = function add(out, a, b) {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    out.z = a.z + b.z;
    return out;
  }
  /**
   * !#zh 逐元素向量减法
   * !#en Element-wise vector subtraction
   * @method subtract
   * @typescript
   * subtract<Out extends IVec3Like> (out: Out, a: Out, b: Out): Out
   * @static
   */
  ;

  Vec3.subtract = function subtract(out, a, b) {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    out.z = a.z - b.z;
    return out;
  }
  /**
   * !#zh 逐元素向量乘法 (分量积)
   * !#en Element-wise vector multiplication (product component)
   * @method multiply
   * @typescript
   * multiply<Out extends IVec3Like, Vec3Like_1 extends IVec3Like, Vec3Like_2 extends IVec3Like> (out: Out, a: Vec3Like_1, b: Vec3Like_2): Out
   * @static
   */
  ;

  Vec3.multiply = function multiply(out, a, b) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    out.z = a.z * b.z;
    return out;
  }
  /**
   * !#zh 逐元素向量除法
   * !#en Element-wise vector division
   * @method divide
   * @typescript
   * divide<Out extends IVec3Like> (out: Out, a: Out, b: Out): Out
   * @static
   */
  ;

  Vec3.divide = function divide(out, a, b) {
    out.x = a.x / b.x;
    out.y = a.y / b.y;
    out.z = a.z / b.z;
    return out;
  }
  /**
   * !#zh 逐元素向量向上取整
   * !#en Rounding up by elements of the vector
   * @method ceil
   * @typescript
   * ceil<Out extends IVec3Like> (out: Out, a: Out): Out
   * @static
   */
  ;

  Vec3.ceil = function ceil(out, a) {
    out.x = Math.ceil(a.x);
    out.y = Math.ceil(a.y);
    out.z = Math.ceil(a.z);
    return out;
  }
  /**
   * !#zh 逐元素向量向下取整
   * !#en Element vector by rounding down
   * @method floor
   * @typescript
   * floor<Out extends IVec3Like> (out: Out, a: Out): Out
   * @static
   */
  ;

  Vec3.floor = function floor(out, a) {
    out.x = Math.floor(a.x);
    out.y = Math.floor(a.y);
    out.z = Math.floor(a.z);
    return out;
  }
  /**
   * !#zh 逐元素向量最小值
   * !#en The minimum by-element vector
   * @method min
   * @typescript
   * min<Out extends IVec3Like> (out: Out, a: Out, b: Out): Out
   * @static
   */
  ;

  Vec3.min = function min(out, a, b) {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    out.z = Math.min(a.z, b.z);
    return out;
  }
  /**
   * !#zh 逐元素向量最大值
   * !#en The maximum value of the element-wise vector
   * @method max
   * @typescript
   * max<Out extends IVec3Like> (out: Out, a: Out, b: Out): Out
   * @static
   */
  ;

  Vec3.max = function max(out, a, b) {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    out.z = Math.max(a.z, b.z);
    return out;
  }
  /**
   * !#zh 逐元素向量四舍五入取整
   * !#en Element-wise vector of rounding to whole
   * @method round
   * @typescript
   * round<Out extends IVec3Like> (out: Out, a: Out): Out
   * @static
   */
  ;

  Vec3.round = function round(out, a) {
    out.x = Math.round(a.x);
    out.y = Math.round(a.y);
    out.z = Math.round(a.z);
    return out;
  }
  /**
   * !#zh 向量标量乘法
   * !#en Vector scalar multiplication
   * @method multiplyScalar
   * @typescript
   * multiplyScalar<Out extends IVec3Like, Vec3Like extends IVec3Like> (out: Out, a: Vec3Like, b: number): Out
   * @static
   */
  ;

  Vec3.multiplyScalar = function multiplyScalar(out, a, b) {
    out.x = a.x * b;
    out.y = a.y * b;
    out.z = a.z * b;
    return out;
  }
  /**
   * !#zh 逐元素向量乘加: A + B * scale
   * !#en Element-wise vector multiply add: A + B * scale
   * @method scaleAndAdd
   * @typescript
   * scaleAndAdd<Out extends IVec3Like> (out: Out, a: Out, b: Out, scale: number): Out
   * @static
   */
  ;

  Vec3.scaleAndAdd = function scaleAndAdd(out, a, b, scale) {
    out.x = a.x + b.x * scale;
    out.y = a.y + b.y * scale;
    out.z = a.z + b.z * scale;
    return out;
  }
  /**
   * !#zh 求两向量的欧氏距离
   * !#en Seeking two vectors Euclidean distance
   * @method distance
   * @typescript
   * distance<Out extends IVec3Like> (a: Out, b: Out): number
   * @static
   */
  ;

  Vec3.distance = function distance(a, b) {
    _x = b.x - a.x;
    _y = b.y - a.y;
    _z = b.z - a.z;
    return Math.sqrt(_x * _x + _y * _y + _z * _z);
  }
  /**
   * !#zh 求两向量的欧氏距离平方
   * !#en Euclidean distance squared seeking two vectors
   * @method squaredDistance
   * @typescript
   * squaredDistance<Out extends IVec3Like> (a: Out, b: Out): number
   * @static
   */
  ;

  Vec3.squaredDistance = function squaredDistance(a, b) {
    _x = b.x - a.x;
    _y = b.y - a.y;
    _z = b.z - a.z;
    return _x * _x + _y * _y + _z * _z;
  }
  /**
   * !#zh 求向量长度
   * !#en Seeking vector length
   * @method len
   * @typescript
   * len<Out extends IVec3Like> (a: Out): number
   * @static
   */
  ;

  Vec3.len = function len(a) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    return Math.sqrt(_x * _x + _y * _y + _z * _z);
  }
  /**
   * !#zh 求向量长度平方
   * !#en Seeking squared vector length
   * @method lengthSqr
   * @typescript
   * lengthSqr<Out extends IVec3Like> (a: Out): number
   * @static
   */
  ;

  Vec3.lengthSqr = function lengthSqr(a) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    return _x * _x + _y * _y + _z * _z;
  }
  /**
   * !#zh 逐元素向量取负
   * !#en By taking the negative elements of the vector
   * @method negate
   * @typescript
   * negate<Out extends IVec3Like> (out: Out, a: Out): Out
   * @static
   */
  ;

  Vec3.negate = function negate(out, a) {
    out.x = -a.x;
    out.y = -a.y;
    out.z = -a.z;
    return out;
  }
  /**
   * !#zh 逐元素向量取倒数，接近 0 时返回 Infinity
   * !#en Element vector by taking the inverse, return near 0 Infinity
   * @method inverse
   * @typescript
   * inverse<Out extends IVec3Like> (out: Out, a: Out): Out
   * @static
   */
  ;

  Vec3.inverse = function inverse(out, a) {
    out.x = 1.0 / a.x;
    out.y = 1.0 / a.y;
    out.z = 1.0 / a.z;
    return out;
  }
  /**
   * !#zh 逐元素向量取倒数，接近 0 时返回 0
   * !#en Element vector by taking the inverse, return near 0 0
   * @method inverseSafe
   * @typescript
   * inverseSafe<Out extends IVec3Like> (out: Out, a: Out): Out
   * @static
   */
  ;

  Vec3.inverseSafe = function inverseSafe(out, a) {
    _x = a.x;
    _y = a.y;
    _z = a.z;

    if (Math.abs(_x) < _utils.EPSILON) {
      out.x = 0;
    } else {
      out.x = 1.0 / _x;
    }

    if (Math.abs(_y) < _utils.EPSILON) {
      out.y = 0;
    } else {
      out.y = 1.0 / _y;
    }

    if (Math.abs(_z) < _utils.EPSILON) {
      out.z = 0;
    } else {
      out.z = 1.0 / _z;
    }

    return out;
  }
  /**
   * !#zh 归一化向量
   * !#en Normalized vector
   * @method normalize
   * @typescript
   * normalize<Out extends IVec3Like, Vec3Like extends IVec3Like> (out: Out, a: Vec3Like): Out
   * @static
   */
  ;

  Vec3.normalize = function normalize(out, a) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    var len = _x * _x + _y * _y + _z * _z;

    if (len > 0) {
      len = 1 / Math.sqrt(len);
      out.x = _x * len;
      out.y = _y * len;
      out.z = _z * len;
    }

    return out;
  }
  /**
   * !#zh 向量点积（数量积）
   * !#en Vector dot product (scalar product)
   * @method dot
   * @typescript
   * dot<Out extends IVec3Like> (a: Out, b: Out): number
   * @static
   */
  ;

  Vec3.dot = function dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }
  /**
   * !#zh 向量叉积（向量积）
   * !#en Vector cross product (vector product)
   * @method cross
   * @typescript
   * cross<Out extends IVec3Like, Vec3Like_1 extends IVec3Like, Vec3Like_2 extends IVec3Like> (out: Out, a: Vec3Like_1, b: Vec3Like_2): Out
   * @static
   */
  ;

  Vec3.cross = function cross(out, a, b) {
    var ax = a.x,
        ay = a.y,
        az = a.z;
    var bx = b.x,
        by = b.y,
        bz = b.z;
    out.x = ay * bz - az * by;
    out.y = az * bx - ax * bz;
    out.z = ax * by - ay * bx;
    return out;
  }
  /**
   * !#zh 逐元素向量线性插值： A + t * (B - A)
   * !#en Vector element by element linear interpolation: A + t * (B - A)
   * @method lerp
   * @typescript
   * lerp<Out extends IVec3Like> (out: Out, a: Out, b: Out, t: number): Out
   * @static
   */
  ;

  Vec3.lerp = function lerp(out, a, b, t) {
    out.x = a.x + t * (b.x - a.x);
    out.y = a.y + t * (b.y - a.y);
    out.z = a.z + t * (b.z - a.z);
    return out;
  }
  /**
   * !#zh 生成一个在单位球体上均匀分布的随机向量
   * !#en Generates a uniformly distributed random vectors on the unit sphere
   * @method random
   * @typescript
   * random<Out extends IVec3Like> (out: Out, scale?: number): Out
   * @param scale 生成的向量长度
   * @static
   */
  ;

  Vec3.random = function random(out, scale) {
    scale = scale || 1.0;
    var phi = (0, _utils.random)() * 2.0 * Math.PI;
    var cosTheta = (0, _utils.random)() * 2 - 1;
    var sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
    out.x = sinTheta * Math.cos(phi) * scale;
    out.y = sinTheta * Math.sin(phi) * scale;
    out.z = cosTheta * scale;
    return out;
  }
  /**
   * !#zh 向量与四维矩阵乘法，默认向量第四位为 1。
   * !#en Four-dimensional vector and matrix multiplication, the default vectors fourth one.
   * @method transformMat4
   * @typescript
   * transformMat4<Out extends IVec3Like, Vec3Like extends IVec3Like, MatLike extends IMat4Like> (out: Out, a: Vec3Like, mat: MatLike): Out
   * @static
   */
  ;

  Vec3.transformMat4 = function transformMat4(out, a, mat) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    var m = mat.m;
    var rhw = m[3] * _x + m[7] * _y + m[11] * _z + m[15];
    rhw = rhw ? 1 / rhw : 1;
    out.x = (m[0] * _x + m[4] * _y + m[8] * _z + m[12]) * rhw;
    out.y = (m[1] * _x + m[5] * _y + m[9] * _z + m[13]) * rhw;
    out.z = (m[2] * _x + m[6] * _y + m[10] * _z + m[14]) * rhw;
    return out;
  }
  /**
   * !#zh 向量与四维矩阵乘法，默认向量第四位为 0。
   * !#en Four-dimensional vector and matrix multiplication, vector fourth default is 0.
   * @method transformMat4Normal
   * @typescript
   * transformMat4Normal<Out extends IVec3Like, MatLike extends IMat4Like> (out: Out, a: Out, mat: MatLike): Out
   * @static
   */
  ;

  Vec3.transformMat4Normal = function transformMat4Normal(out, a, mat) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    var m = mat.m;
    var rhw = m[3] * _x + m[7] * _y + m[11] * _z;
    rhw = rhw ? 1 / rhw : 1;
    out.x = (m[0] * _x + m[4] * _y + m[8] * _z) * rhw;
    out.y = (m[1] * _x + m[5] * _y + m[9] * _z) * rhw;
    out.z = (m[2] * _x + m[6] * _y + m[10] * _z) * rhw;
    return out;
  }
  /**
   * !#zh 向量与三维矩阵乘法
   * !#en Dimensional vector matrix multiplication
   * @method transformMat3
   * @typescript
   * transformMat3<Out extends IVec3Like, MatLike extends IMat3Like> (out: Out, a: Out, mat: MatLike): Out
   * @static
   */
  ;

  Vec3.transformMat3 = function transformMat3(out, a, mat) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    var m = mat.m;
    out.x = _x * m[0] + _y * m[3] + _z * m[6];
    out.y = _x * m[1] + _y * m[4] + _z * m[7];
    out.z = _x * m[2] + _y * m[5] + _z * m[8];
    return out;
  }
  /**
   * !#zh 向量仿射变换
   * !#en Affine transformation vector
   * @method transformAffine
   * @typescript
   * transformAffine<Out extends IVec3Like, VecLike extends IVec3Like, MatLike extends IMat4Like>(out: Out, v: VecLike, mat: MatLike): Out
   * @static
   */
  ;

  Vec3.transformAffine = function transformAffine(out, v, mat) {
    _x = v.x;
    _y = v.y;
    _z = v.z;
    var m = mat.m;
    out.x = m[0] * _x + m[1] * _y + m[2] * _z + m[3];
    out.y = m[4] * _x + m[5] * _y + m[6] * _z + m[7];
    out.x = m[8] * _x + m[9] * _y + m[10] * _z + m[11];
    return out;
  }
  /**
   * !#zh 向量四元数乘法
   * !#en Vector quaternion multiplication
   * @method transformQuat
   * @typescript
   * transformQuat<Out extends IVec3Like, VecLike extends IVec3Like, QuatLike extends IQuatLike> (out: Out, a: VecLike, q: QuatLike): Out
   * @static
   */
  ;

  Vec3.transformQuat = function transformQuat(out, a, q) {
    // benchmarks: http://jsperf.com/quaternion-transform-Vec3-implementations
    // calculate quat * vec
    var ix = q.w * a.x + q.y * a.z - q.z * a.y;
    var iy = q.w * a.y + q.z * a.x - q.x * a.z;
    var iz = q.w * a.z + q.x * a.y - q.y * a.x;
    var iw = -q.x * a.x - q.y * a.y - q.z * a.z; // calculate result * inverse quat

    out.x = ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y;
    out.y = iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z;
    out.z = iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x;
    return out;
  }
  /**
   * !#zh 以缩放 -> 旋转 -> 平移顺序变换向量
   * !#en To scale -> rotation -> transformation vector sequence translation
   * @method transformQuat
   * @typescript
   * transformRTS<Out extends IVec3Like, VecLike extends IVec3Like, QuatLike extends IQuatLike>(out: Out, a: VecLike, r: QuatLike, t: VecLike, s: VecLike): Out
   * @static
   */
  ;

  Vec3.transformRTS = function transformRTS(out, a, r, t, s) {
    var x = a.x * s.x;
    var y = a.y * s.y;
    var z = a.z * s.z;
    var ix = r.w * x + r.y * z - r.z * y;
    var iy = r.w * y + r.z * x - r.x * z;
    var iz = r.w * z + r.x * y - r.y * x;
    var iw = -r.x * x - r.y * y - r.z * z;
    out.x = ix * r.w + iw * -r.x + iy * -r.z - iz * -r.y + t.x;
    out.y = iy * r.w + iw * -r.y + iz * -r.x - ix * -r.z + t.y;
    out.z = iz * r.w + iw * -r.z + ix * -r.y - iy * -r.x + t.z;
    return out;
  }
  /**
   * !#zh 以平移 -> 旋转 -> 缩放顺序逆变换向量
   * !#en Translational -> rotation -> Zoom inverse transformation vector sequence
   * @method transformInverseRTS
   * @typescript
   * transformInverseRTS<Out extends IVec3Like, VecLike extends IVec3Like, QuatLike extends IQuatLike>(out: Out, a: VecLike, r: QuatLike, t: VecLike, s: VecLike): Out
   * @static
   */
  ;

  Vec3.transformInverseRTS = function transformInverseRTS(out, a, r, t, s) {
    var x = a.x - t.x;
    var y = a.y - t.y;
    var z = a.z - t.z;
    var ix = r.w * x - r.y * z + r.z * y;
    var iy = r.w * y - r.z * x + r.x * z;
    var iz = r.w * z - r.x * y + r.y * x;
    var iw = r.x * x + r.y * y + r.z * z;
    out.x = (ix * r.w + iw * r.x + iy * r.z - iz * r.y) / s.x;
    out.y = (iy * r.w + iw * r.y + iz * r.x - ix * r.z) / s.y;
    out.z = (iz * r.w + iw * r.z + ix * r.y - iy * r.x) / s.z;
    return out;
  }
  /**
   * !#zh 绕 X 轴旋转向量指定弧度
   * !#en Rotation vector specified angle about the X axis
   * @method rotateX
   * @typescript
   * rotateX<Out extends IVec3Like> (out: Out, v: Out, o: Out, a: number): Out
   * @param v 待旋转向量
   * @param o 旋转中心
   * @param a 旋转弧度
   * @static
   */
  ;

  Vec3.rotateX = function rotateX(out, v, o, a) {
    // Translate point to the origin
    _x = v.x - o.x;
    _y = v.y - o.y;
    _z = v.z - o.z; // perform rotation

    var cos = Math.cos(a);
    var sin = Math.sin(a);
    var rx = _x;
    var ry = _y * cos - _z * sin;
    var rz = _y * sin + _z * cos; // translate to correct position

    out.x = rx + o.x;
    out.y = ry + o.y;
    out.z = rz + o.z;
    return out;
  }
  /**
   * !#zh 绕 Y 轴旋转向量指定弧度
   * !#en Rotation vector specified angle around the Y axis
   * @method rotateY
   * @typescript
   * rotateY<Out extends IVec3Like> (out: Out, v: Out, o: Out, a: number): Out
   * @param v 待旋转向量
   * @param o 旋转中心
   * @param a 旋转弧度
   * @static
   */
  ;

  Vec3.rotateY = function rotateY(out, v, o, a) {
    // Translate point to the origin
    _x = v.x - o.x;
    _y = v.y - o.y;
    _z = v.z - o.z; // perform rotation

    var cos = Math.cos(a);
    var sin = Math.sin(a);
    var rx = _z * sin + _x * cos;
    var ry = _y;
    var rz = _z * cos - _x * sin; // translate to correct position

    out.x = rx + o.x;
    out.y = ry + o.y;
    out.z = rz + o.z;
    return out;
  }
  /**
   * !#zh 绕 Z 轴旋转向量指定弧度
   * !#en Around the Z axis specified angle vector
   * @method rotateZ
   * @typescript
   * rotateZ<Out extends IVec3Like> (out: Out, v: Out, o: Out, a: number): Out
   * @param v 待旋转向量
   * @param o 旋转中心
   * @param a 旋转弧度
   * @static
   */
  ;

  Vec3.rotateZ = function rotateZ(out, v, o, a) {
    // Translate point to the origin
    _x = v.x - o.x;
    _y = v.y - o.y;
    _z = v.z - o.z; // perform rotation

    var cos = Math.cos(a);
    var sin = Math.sin(a);
    var rx = _x * cos - _y * sin;
    var ry = _x * sin + _y * cos;
    var rz = _z; // translate to correct position

    out.x = rx + o.x;
    out.y = ry + o.y;
    out.z = rz + o.z;
    return out;
  }
  /**
   * !#zh 向量等价判断
   * !#en Equivalent vectors Analyzing
   * @method strictEquals
   * @typescript
   * strictEquals<Out extends IVec3Like> (a: Out, b: Out): boolean
   * @static
   */
  ;

  Vec3.strictEquals = function strictEquals(a, b) {
    return a.x === b.x && a.y === b.y && a.z === b.z;
  }
  /**
   * !#zh 排除浮点数误差的向量近似等价判断
   * !#en Negative error vector floating point approximately equivalent Analyzing
   * @method equals
   * @typescript
   * equals<Out extends IVec3Like> (a: Out, b: Out, epsilon?: number): boolean
   * @static
   */
  ;

  Vec3.equals = function equals(a, b, epsilon) {
    if (epsilon === void 0) {
      epsilon = _utils.EPSILON;
    }

    var a0 = a.x,
        a1 = a.y,
        a2 = a.z;
    var b0 = b.x,
        b1 = b.y,
        b2 = b.z;
    return Math.abs(a0 - b0) <= epsilon * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= epsilon * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= epsilon * Math.max(1.0, Math.abs(a2), Math.abs(b2));
  }
  /**
   * !#zh 求两向量夹角弧度
   * !#en Radian angle between two vectors seek
   * @method angle
   * @typescript
   * angle<Out extends IVec3Like> (a: Out, b: Out): number
   * @static
   */
  ;

  Vec3.angle = function angle(a, b) {
    Vec3.normalize(v3_1, a);
    Vec3.normalize(v3_2, b);
    var cosine = Vec3.dot(v3_1, v3_2);

    if (cosine > 1.0) {
      return 0;
    }

    if (cosine < -1.0) {
      return Math.PI;
    }

    return Math.acos(cosine);
  }
  /**
   * !#zh 计算向量在指定平面上的投影
   * !#en Calculating a projection vector in the specified plane
   * @method projectOnPlane
   * @typescript
   * projectOnPlane<Out extends IVec3Like> (out: Out, a: Out, n: Out): Out
   * @param a 待投影向量
   * @param n 指定平面的法线
   * @static
   */
  ;

  Vec3.projectOnPlane = function projectOnPlane(out, a, n) {
    return Vec3.subtract(out, a, Vec3.project(out, a, n));
  }
  /**
   * !#zh 计算向量在指定向量上的投影
   * !#en Projection vector calculated in the vector designated
   * @method project
   * @typescript
   * project<Out extends IVec3Like> (out: Out, a: Out, b: Out): Out
   * @param a 待投影向量
   * @param n 目标向量
   * @static
   */
  ;

  Vec3.project = function project(out, a, b) {
    var sqrLen = Vec3.lengthSqr(b);

    if (sqrLen < 0.000001) {
      return Vec3.set(out, 0, 0, 0);
    } else {
      return Vec3.multiplyScalar(out, b, Vec3.dot(a, b) / sqrLen);
    }
  }
  /**
   * !#zh 向量转数组
   * !#en Vector transfer array
   * @method toArray
   * @typescript
   * toArray <Out extends IWritableArrayLike<number>> (out: Out, v: IVec3Like, ofs?: number): Out
   * @param ofs 数组起始偏移量
   * @static
   */
  ;

  Vec3.toArray = function toArray(out, v, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    out[ofs + 0] = v.x;
    out[ofs + 1] = v.y;
    out[ofs + 2] = v.z;
    return out;
  }
  /**
   * !#zh 数组转向量
   * !#en Array steering amount
   * @method fromArray
   * @typescript
   * fromArray <Out extends IVec3Like> (out: Out, arr: IWritableArrayLike<number>, ofs?: number): Out
   * @param ofs 数组起始偏移量
   * @static
   */
  ;

  Vec3.fromArray = function fromArray(out, arr, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    out.x = arr[ofs + 0];
    out.y = arr[ofs + 1];
    out.z = arr[ofs + 2];
    return out;
  }
  /**
   * @property {Number} x
   */
  ;

  /**
   * !#en
   * Constructor
   * see {{#crossLink "cc/vec3:method"}}cc.v3{{/crossLink}}
   * !#zh
   * 构造函数，可查看 {{#crossLink "cc/vec3:method"}}cc.v3{{/crossLink}}
   * @method constructor
   * @param {Vec3|number} [x=0]
   * @param {number} [y=0]
   * @param {number} [z=0]
   */
  function Vec3(x, y, z) {
    var _this;

    if (x === void 0) {
      x = 0;
    }

    if (y === void 0) {
      y = 0;
    }

    if (z === void 0) {
      z = 0;
    }

    _this = _ValueType.call(this) || this;
    _this.mag = Vec3.prototype.len;
    _this.magSqr = Vec3.prototype.lengthSqr;
    _this.subSelf = Vec3.prototype.subtract;
    _this.mulSelf = Vec3.prototype.multiplyScalar;
    _this.divSelf = Vec3.prototype.divide;
    _this.scaleSelf = Vec3.prototype.multiply;
    _this.negSelf = Vec3.prototype.negate;
    _this.x = void 0;
    _this.y = void 0;
    _this.z = void 0;
    _this.angle = _vec["default"].prototype.angle;
    _this.project = _vec["default"].prototype.project;

    if (x && typeof x === 'object') {
      _this.x = x.x;
      _this.y = x.y;
      _this.z = x.z;
    } else {
      _this.x = x;
      _this.y = y;
      _this.z = z;
    }

    return _this;
  }
  /**
   * !#en clone a Vec3 value
   * !#zh 克隆一个 Vec3 值
   * @method clone
   * @return {Vec3}
   */


  _proto.clone = function clone() {
    return new Vec3(this.x, this.y, this.z);
  }
  /**
   * !#en Set the current vector value with the given vector.
   * !#zh 用另一个向量设置当前的向量对象值。
   * @method set
   * @param {Vec3} newValue - !#en new value to set. !#zh 要设置的新值
   * @return {Vec3} returns this
   * @chainable
   */
  ;

  _proto.set = function set(newValue) {
    this.x = newValue.x;
    this.y = newValue.y;
    this.z = newValue.z;
    return this;
  }
  /**
   * !#en Check whether the vector equals another one
   * !#zh 当前的向量是否与指定的向量相等。
   * @method equals
   * @param {Vec3} other
   * @return {Boolean}
   */
  ;

  _proto.equals = function equals(other) {
    return other && this.x === other.x && this.y === other.y && this.z === other.z;
  }
  /**
   * !#en Check whether two vector equal with some degree of variance.
   * !#zh
   * 近似判断两个点是否相等。<br/>
   * 判断 2 个向量是否在指定数值的范围之内，如果在则返回 true，反之则返回 false。
   * @method fuzzyEquals
   * @param {Vec3} other
   * @param {Number} variance
   * @return {Boolean}
   */
  ;

  _proto.fuzzyEquals = function fuzzyEquals(other, variance) {
    if (this.x - variance <= other.x && other.x <= this.x + variance) {
      if (this.y - variance <= other.y && other.y <= this.y + variance) {
        if (this.z - variance <= other.z && other.z <= this.z + variance) return true;
      }
    }

    return false;
  }
  /**
   * !#en Transform to string with vector informations
   * !#zh 转换为方便阅读的字符串。
   * @method toString
   * @return {string}
   */
  ;

  _proto.toString = function toString() {
    return "(" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ", " + this.z.toFixed(2) + ")";
  }
  /**
   * !#en Calculate linear interpolation result between this vector and another one with given ratio
   * !#zh 线性插值。
   * @method lerp
   * @param {Vec3} to
   * @param {number} ratio - the interpolation coefficient
   * @param {Vec3} [out] - optional, the receiving vector, you can pass the same vec3 to save result to itself, if not provided, a new vec3 will be created
   * @return {Vec3}
   */
  ;

  _proto.lerp = function lerp(to, ratio, out) {
    out = out || new Vec3();
    Vec3.lerp(out, this, to, ratio);
    return out;
  }
  /**
   * !#en Clamp the vector between from float and to float.
   * !#zh
   * 返回指定限制区域后的向量。<br/>
   * 向量大于 max_inclusive 则返回 max_inclusive。<br/>
   * 向量小于 min_inclusive 则返回 min_inclusive。<br/>
   * 否则返回自身。
   * @method clampf
   * @param {Vec3} min_inclusive
   * @param {Vec3} max_inclusive
   * @return {Vec3}
   */
  ;

  _proto.clampf = function clampf(min_inclusive, max_inclusive) {
    this.x = _misc["default"].clampf(this.x, min_inclusive.x, max_inclusive.x);
    this.y = _misc["default"].clampf(this.y, min_inclusive.y, max_inclusive.y);
    this.z = _misc["default"].clampf(this.z, min_inclusive.z, max_inclusive.z);
    return this;
  }
  /**
   * !#en Adds this vector. If you want to save result to another vector, use add() instead.
   * !#zh 向量加法。如果你想保存结果到另一个向量，使用 add() 代替。
   * @method addSelf
   * @param {Vec3} vector
   * @return {Vec3} returns this
   * @chainable
   */
  ;

  _proto.addSelf = function addSelf(vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    return this;
  }
  /**
   * !#en Adds two vectors, and returns the new result.
   * !#zh 向量加法，并返回新结果。
   * @method add
   * @param {Vec3} vector
   * @param {Vec3} [out] - optional, the receiving vector, you can pass the same vec3 to save result to itself, if not provided, a new vec3 will be created
   * @return {Vec3} the result
   */
  ;

  _proto.add = function add(vector, out) {
    out = out || new Vec3();
    out.x = this.x + vector.x;
    out.y = this.y + vector.y;
    out.z = this.z + vector.z;
    return out;
  }
  /**
   * !#en Subtracts one vector from this.
   * !#zh 向量减法。
   * @method subtract
   * @param {Vec3} vector
   * @return {Vec3} returns this
   * @chainable
   */
  ;

  _proto.subtract = function subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
    return this;
  }
  /**
   * !#en Multiplies this by a number.
   * !#zh 缩放当前向量。
   * @method multiplyScalar
   * @param {number} num
   * @return {Vec3} returns this
   * @chainable
   */
  ;

  _proto.multiplyScalar = function multiplyScalar(num) {
    this.x *= num;
    this.y *= num;
    this.z *= num;
    return this;
  }
  /**
   * !#en Multiplies two vectors.
   * !#zh 分量相乘。
   * @method multiply
   * @param {Vec3} vector
   * @return {Vec3} returns this
   * @chainable
   */
  ;

  _proto.multiply = function multiply(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
    this.z *= vector.z;
    return this;
  }
  /**
   * !#en Divides by a number.
   * !#zh 向量除法。
   * @method divide
   * @param {number} num
   * @return {Vec3} returns this
   * @chainable
   */
  ;

  _proto.divide = function divide(num) {
    this.x /= num;
    this.y /= num;
    this.z /= num;
    return this;
  }
  /**
   * !#en Negates the components.
   * !#zh 向量取反。
   * @method negate
   * @return {Vec3} returns this
   * @chainable
   */
  ;

  _proto.negate = function negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }
  /**
   * !#en Dot product
   * !#zh 当前向量与指定向量进行点乘。
   * @method dot
   * @param {Vec3} [vector]
   * @return {number} the result
   */
  ;

  _proto.dot = function dot(vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }
  /**
   * !#en Cross product
   * !#zh 当前向量与指定向量进行叉乘。
   * @method cross
   * @param {Vec3} vector
   * @param {Vec3} [out]
   * @return {Vec3} the result
   */
  ;

  _proto.cross = function cross(vector, out) {
    out = out || new Vec3();
    Vec3.cross(out, this, vector);
    return out;
  }
  /**
   * !#en Returns the length of this vector.
   * !#zh 返回该向量的长度。
   * @method len
   * @return {number} the result
   * @example
   * var v = cc.v3(10, 10, 10);
   * v.len(); // return 17.320508075688775;
   */
  ;

  _proto.len = function len() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  /**
   * !#en Returns the squared length of this vector.
   * !#zh 返回该向量的长度平方。
   * @method lengthSqr
   * @return {number} the result
   */
  ;

  _proto.lengthSqr = function lengthSqr() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  /**
   * !#en Make the length of this vector to 1.
   * !#zh 向量归一化，让这个向量的长度为 1。
   * @method normalizeSelf
   * @return {Vec3} returns this
   * @chainable
   */
  ;

  _proto.normalizeSelf = function normalizeSelf() {
    Vec3.normalize(this, this);
    return this;
  };

  /**
   * !#en
   * Returns this vector with a magnitude of 1.<br/>
   * <br/>
   * Note that the current vector is unchanged and a new normalized vector is returned. If you want to normalize the current vector, use normalizeSelf function.
   * !#zh
   * 返回归一化后的向量。<br/>
   * <br/>
   * 注意，当前向量不变，并返回一个新的归一化向量。如果你想来归一化当前向量，可使用 normalizeSelf 函数。
   * @method normalize
   * @param {Vec3} [out] - optional, the receiving vector, you can pass the same vec3 to save result to itself, if not provided, a new vec3 will be created
   * @return {Vec3} result
   */
  _proto.normalize = function normalize(out) {
    out = out || new Vec3();
    Vec3.normalize(out, this);
    return out;
  }
  /**
   * Transforms the vec3 with a mat4. 4th vector component is implicitly '1'
   * @method transformMat4
   * @param {Mat4} m matrix to transform with
   * @param {Vec3} [out] the receiving vector, you can pass the same vec3 to save result to itself, if not provided, a new vec3 will be created
   * @returns {Vec3} out
   */
  ;

  _proto.transformMat4 = function transformMat4(m, out) {
    out = out || new Vec3();
    Vec3.transformMat4(out, this, m);
    return out;
  }
  /**
   * Returns the maximum value in x, y, and z
   * @method maxAxis
   * @returns {number}
   */
  ;

  _proto.maxAxis = function maxAxis() {
    return Math.max(this.x, this.y, this.z);
  }
  /**
   * !#en Get angle in radian between this and vector.
   * !#zh 夹角的弧度。
   * @method angle
   * @param {Vec3} vector
   * @return {number} from 0 to Math.PI
   */
  ;

  // Compatible with the vec2 API

  /**
   * !#en Get angle in radian between this and vector with direction. <br/>
   * In order to compatible with the vec2 API.
   * !#zh 带方向的夹角的弧度。该方法仅用做兼容 2D 计算。
   * @method signAngle
   * @param {Vec3 | Vec2} vector
   * @return {number} from -MathPI to Math.PI
   * @deprecated
   */
  _proto.signAngle = function signAngle(vector) {
    cc.warnID(1408, 'vec3.signAngle', 'v2.1', 'cc.v2(selfVector).signAngle(vector)');
    var vec1 = new _vec["default"](this.x, this.y);
    var vec2 = new _vec["default"](vector.x, vector.y);
    return vec1.signAngle(vec2);
  }
  /**
   * !#en rotate. In order to compatible with the vec2 API.
   * !#zh 返回旋转给定弧度后的新向量。该方法仅用做兼容 2D 计算。
   * @method rotate
   * @param {number} radians
   * @param {Vec3} [out] - optional, the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created
   * @return {Vec2 | Vec3} if the 'out' value is a vec3 you will get a Vec3 return.
   * @deprecated
   */
  ;

  _proto.rotate = function rotate(radians, out) {
    cc.warnID(1408, 'vec3.rotate', 'v2.1', 'cc.v2(selfVector).rotate(radians, out)');
    return _vec["default"].prototype.rotate.call(this, radians, out);
  }
  /**
   * !#en rotate self. In order to compatible with the vec2 API.
   * !#zh 按指定弧度旋转向量。该方法仅用做兼容 2D 计算。
   * @method rotateSelf
   * @param {number} radians
   * @return {Vec3} returns this
   * @chainable
   * @deprecated
   */
  ;

  _proto.rotateSelf = function rotateSelf(radians) {
    cc.warnID(1408, 'vec3.rotateSelf', 'v2.1', 'cc.v2(selfVector).rotateSelf(radians)');
    return _vec["default"].prototype.rotateSelf.call(this, radians);
  };

  _createClass(Vec3, null, [{
    key: "ONE",
    get: function get() {
      return new Vec3(1, 1, 1);
    }
  }, {
    key: "ZERO",
    get:
    /**
     * !#en return a Vec3 object with x = 0, y = 0, z = 0.
     * !#zh 返回 x = 0，y = 0，z = 0 的 Vec3 对象。
     * @property ZERO
     * @type Vec3
     * @static
     */
    function get() {
      return new Vec3();
    }
  }, {
    key: "UP",
    get:
    /**
     * !#en return a Vec3 object with x = 0, y = 1, z = 0.
     * !#zh 返回 x = 0, y = 1, z = 0 的 Vec3 对象。
     * @property UP
     * @type Vec3
     * @static
     */
    function get() {
      return new Vec3(0, 1, 0);
    }
  }, {
    key: "RIGHT",
    get:
    /**
     * !#en return a Vec3 object with x = 1, y = 0, z = 0.
     * !#zh 返回 x = 1，y = 0，z = 0 的 Vec3 对象。
     * @property RIGHT
     * @type Vec3
     * @static
     */
    function get() {
      return new Vec3(1, 0, 0);
    }
  }, {
    key: "FORWARD",
    get:
    /**
     * !#en return a Vec3 object with x = 0, y = 0, z = 1.
     * !#zh 返回 x = 0，y = 0，z = 1 的 Vec3 对象。
     * @property FORWARD
     * @type Vec3
     * @static
     */
    function get() {
      return new Vec3(0, 0, 1);
    }
  }]);

  return Vec3;
}(_valueType["default"]);

exports["default"] = Vec3;
Vec3.sub = Vec3.subtract;
Vec3.mul = Vec3.multiply;
Vec3.scale = Vec3.multiplyScalar;
Vec3.mag = Vec3.len;
Vec3.squaredMagnitude = Vec3.lengthSqr;
Vec3.div = Vec3.divide;
Vec3.ONE_R = Vec3.ONE;
Vec3.ZERO_R = Vec3.ZERO;
Vec3.UP_R = Vec3.UP;
Vec3.RIGHT_R = Vec3.RIGHT;
Vec3.FRONT_R = Vec3.FORWARD;
var v3_1 = new Vec3();
var v3_2 = new Vec3();

_CCClass["default"].fastDefine('cc.Vec3', Vec3, {
  x: 0,
  y: 0,
  z: 0
});
/**
 * @module cc
 */

/**
 * !#en The convenience method to create a new {{#crossLink "Vec3"}}cc.Vec3{{/crossLink}}.
 * !#zh 通过该简便的函数进行创建 {{#crossLink "Vec3"}}cc.Vec3{{/crossLink}} 对象。
 * @method v3
 * @param {Number|Object} [x=0]
 * @param {Number} [y=0]
 * @param {Number} [z=0]
 * @return {Vec3}
 * @example
 * var v1 = cc.v3();
 * var v2 = cc.v3(0, 0, 0);
 * var v3 = cc.v3(v2);
 * var v4 = cc.v3({x: 100, y: 100, z: 0});
 */


cc.v3 = function v3(x, y, z) {
  return new Vec3(x, y, z);
};

cc.Vec3 = Vec3;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3ZhbHVlLXR5cGVzL3ZlYzMudHMiXSwibmFtZXMiOlsiX3giLCJfeSIsIl96IiwiVmVjMyIsInN1YiIsInZlY3RvciIsIm91dCIsInN1YnRyYWN0IiwibXVsIiwibnVtIiwibXVsdGlwbHlTY2FsYXIiLCJkaXYiLCJzY2FsZSIsIm11bHRpcGx5IiwibmVnIiwibmVnYXRlIiwiemVybyIsIngiLCJ5IiwieiIsImNsb25lIiwiYSIsImNvcHkiLCJzZXQiLCJhZGQiLCJiIiwiZGl2aWRlIiwiY2VpbCIsIk1hdGgiLCJmbG9vciIsIm1pbiIsIm1heCIsInJvdW5kIiwic2NhbGVBbmRBZGQiLCJkaXN0YW5jZSIsInNxcnQiLCJzcXVhcmVkRGlzdGFuY2UiLCJsZW4iLCJsZW5ndGhTcXIiLCJpbnZlcnNlIiwiaW52ZXJzZVNhZmUiLCJhYnMiLCJFUFNJTE9OIiwibm9ybWFsaXplIiwiZG90IiwiY3Jvc3MiLCJheCIsImF5IiwiYXoiLCJieCIsImJ5IiwiYnoiLCJsZXJwIiwidCIsInJhbmRvbSIsInBoaSIsIlBJIiwiY29zVGhldGEiLCJzaW5UaGV0YSIsImNvcyIsInNpbiIsInRyYW5zZm9ybU1hdDQiLCJtYXQiLCJtIiwicmh3IiwidHJhbnNmb3JtTWF0NE5vcm1hbCIsInRyYW5zZm9ybU1hdDMiLCJ0cmFuc2Zvcm1BZmZpbmUiLCJ2IiwidHJhbnNmb3JtUXVhdCIsInEiLCJpeCIsInciLCJpeSIsIml6IiwiaXciLCJ0cmFuc2Zvcm1SVFMiLCJyIiwicyIsInRyYW5zZm9ybUludmVyc2VSVFMiLCJyb3RhdGVYIiwibyIsInJ4IiwicnkiLCJyeiIsInJvdGF0ZVkiLCJyb3RhdGVaIiwic3RyaWN0RXF1YWxzIiwiZXF1YWxzIiwiZXBzaWxvbiIsImEwIiwiYTEiLCJhMiIsImIwIiwiYjEiLCJiMiIsImFuZ2xlIiwidjNfMSIsInYzXzIiLCJjb3NpbmUiLCJhY29zIiwicHJvamVjdE9uUGxhbmUiLCJuIiwicHJvamVjdCIsInNxckxlbiIsInRvQXJyYXkiLCJvZnMiLCJmcm9tQXJyYXkiLCJhcnIiLCJtYWciLCJwcm90b3R5cGUiLCJtYWdTcXIiLCJzdWJTZWxmIiwibXVsU2VsZiIsImRpdlNlbGYiLCJzY2FsZVNlbGYiLCJuZWdTZWxmIiwiVmVjMiIsIm5ld1ZhbHVlIiwib3RoZXIiLCJmdXp6eUVxdWFscyIsInZhcmlhbmNlIiwidG9TdHJpbmciLCJ0b0ZpeGVkIiwidG8iLCJyYXRpbyIsImNsYW1wZiIsIm1pbl9pbmNsdXNpdmUiLCJtYXhfaW5jbHVzaXZlIiwibWlzYyIsImFkZFNlbGYiLCJub3JtYWxpemVTZWxmIiwibWF4QXhpcyIsInNpZ25BbmdsZSIsImNjIiwid2FybklEIiwidmVjMSIsInZlYzIiLCJyb3RhdGUiLCJyYWRpYW5zIiwiY2FsbCIsInJvdGF0ZVNlbGYiLCJWYWx1ZVR5cGUiLCJzcXVhcmVkTWFnbml0dWRlIiwiT05FX1IiLCJPTkUiLCJaRVJPX1IiLCJaRVJPIiwiVVBfUiIsIlVQIiwiUklHSFRfUiIsIlJJR0hUIiwiRlJPTlRfUiIsIkZPUldBUkQiLCJDQ0NsYXNzIiwiZmFzdERlZmluZSIsInYzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFJQSxFQUFVLEdBQUcsR0FBakI7QUFDQSxJQUFJQyxFQUFVLEdBQUcsR0FBakI7QUFDQSxJQUFJQyxFQUFVLEdBQUcsR0FBakI7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7SUFFcUJDOzs7OztBQUNqQjs7QUFRQTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtTQUNJQyxNQUFBLGFBQUtDLE1BQUwsRUFBbUJD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ckosSUFBSSxDQUFDc0o7QUF1c0NuQyxJQUFNeEQsSUFBSSxHQUFHLElBQUk5RixJQUFKLEVBQWI7QUFDQSxJQUFNK0YsSUFBSSxHQUFHLElBQUkvRixJQUFKLEVBQWI7O0FBRUF1SixvQkFBUUMsVUFBUixDQUFtQixTQUFuQixFQUE4QnhKLElBQTlCLEVBQW9DO0FBQUVjLEVBQUFBLENBQUMsRUFBRSxDQUFMO0FBQVFDLEVBQUFBLENBQUMsRUFBRSxDQUFYO0FBQWNDLEVBQUFBLENBQUMsRUFBRTtBQUFqQixDQUFwQztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQW1ILEVBQUUsQ0FBQ3NCLEVBQUgsR0FBUSxTQUFTQSxFQUFULENBQWEzSSxDQUFiLEVBQWdCQyxDQUFoQixFQUFtQkMsQ0FBbkIsRUFBc0I7QUFDMUIsU0FBTyxJQUFJaEIsSUFBSixDQUFTYyxDQUFULEVBQVlDLENBQVosRUFBZUMsQ0FBZixDQUFQO0FBQ0gsQ0FGRDs7QUFJQW1ILEVBQUUsQ0FBQ25JLElBQUgsR0FBVUEsSUFBViIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IFZhbHVlVHlwZSBmcm9tICcuL3ZhbHVlLXR5cGUnO1xuaW1wb3J0IENDQ2xhc3MgZnJvbSAnLi4vcGxhdGZvcm0vQ0NDbGFzcyc7XG5pbXBvcnQgbWlzYyBmcm9tICcuLi91dGlscy9taXNjJztcbmltcG9ydCBWZWMyIGZyb20gJy4vdmVjMic7XG5pbXBvcnQgTWF0NCBmcm9tICcuL21hdDQnO1xuaW1wb3J0IHsgRVBTSUxPTiwgcmFuZG9tIH0gZnJvbSAnLi91dGlscyc7XG5cbmxldCBfeDogbnVtYmVyID0gMC4wO1xubGV0IF95OiBudW1iZXIgPSAwLjA7XG5sZXQgX3o6IG51bWJlciA9IDAuMDtcblxuLyoqXG4gKiAhI2VuIFJlcHJlc2VudGF0aW9uIG9mIDNEIHZlY3RvcnMgYW5kIHBvaW50cy5cbiAqICEjemgg6KGo56S6IDNEIOWQkemHj+WSjOWdkOagh1xuICpcbiAqIEBjbGFzcyBWZWMzXG4gKiBAZXh0ZW5kcyBWYWx1ZVR5cGVcbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWZWMzIGV4dGVuZHMgVmFsdWVUeXBlIHtcbiAgICAvLyBkZXByZWNhdGVkXG4gICAgc3RhdGljIHN1YiAgID0gVmVjMy5zdWJ0cmFjdDtcbiAgICBzdGF0aWMgbXVsICAgPSBWZWMzLm11bHRpcGx5O1xuICAgIHN0YXRpYyBzY2FsZSA9IFZlYzMubXVsdGlwbHlTY2FsYXI7XG4gICAgc3RhdGljIG1hZyAgID0gVmVjMy5sZW47XG4gICAgc3RhdGljIHNxdWFyZWRNYWduaXR1ZGUgPSBWZWMzLmxlbmd0aFNxcjtcbiAgICBzdGF0aWMgZGl2ID0gVmVjMy5kaXZpZGU7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgdGhlIGxlbmd0aCBvZiB0aGlzIHZlY3Rvci5cbiAgICAgKiAhI3poIOi/lOWbnuivpeWQkemHj+eahOmVv+W6puOAglxuICAgICAqIEBtZXRob2QgbWFnXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgcmVzdWx0XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdiA9IGNjLnYzKDEwLCAxMCwgMTApO1xuICAgICAqIHYubWFnKCk7IC8vIHJldHVybiAxNy4zMjA1MDgwNzU2ODg3NzU7XG4gICAgICovXG4gICAgbWFnICA9IFZlYzMucHJvdG90eXBlLmxlbjtcbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgdGhlIHNxdWFyZWQgbGVuZ3RoIG9mIHRoaXMgdmVjdG9yLlxuICAgICAqICEjemgg6L+U5Zue6K+l5ZCR6YeP55qE6ZW/5bqm5bmz5pa544CCXG4gICAgICogQG1ldGhvZCBtYWdTcXJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSByZXN1bHRcbiAgICAgKi9cbiAgICBtYWdTcXIgPSBWZWMzLnByb3RvdHlwZS5sZW5ndGhTcXI7XG4gICAgLyoqXG4gICAgICogISNlbiBTdWJ0cmFjdHMgb25lIHZlY3RvciBmcm9tIHRoaXMuIElmIHlvdSB3YW50IHRvIHNhdmUgcmVzdWx0IHRvIGFub3RoZXIgdmVjdG9yLCB1c2Ugc3ViKCkgaW5zdGVhZC5cbiAgICAgKiAhI3poIOWQkemHj+WHj+azleOAguWmguaenOS9oOaDs+S/neWtmOe7k+aenOWIsOWPpuS4gOS4quWQkemHj++8jOWPr+S9v+eUqCBzdWIoKSDku6Pmm7/jgIJcbiAgICAgKiBAbWV0aG9kIHN1YlNlbGZcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHZlY3RvclxuICAgICAqIEByZXR1cm4ge1ZlYzN9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKi9cbiAgICBzdWJTZWxmICA9IFZlYzMucHJvdG90eXBlLnN1YnRyYWN0O1xuICAgIC8qKlxuICAgICAqICEjZW4gU3VidHJhY3RzIG9uZSB2ZWN0b3IgZnJvbSB0aGlzLCBhbmQgcmV0dXJucyB0aGUgbmV3IHJlc3VsdC5cbiAgICAgKiAhI3poIOWQkemHj+WHj+azle+8jOW5tui/lOWbnuaWsOe7k+aenOOAglxuICAgICAqIEBtZXRob2Qgc3ViXG4gICAgICogQHBhcmFtIHtWZWMzfSB2ZWN0b3JcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IFtvdXRdIC0gb3B0aW9uYWwsIHRoZSByZWNlaXZpbmcgdmVjdG9yLCB5b3UgY2FuIHBhc3MgdGhlIHNhbWUgdmVjMyB0byBzYXZlIHJlc3VsdCB0byBpdHNlbGYsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgdmVjMyB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJuIHtWZWMzfSB0aGUgcmVzdWx0XG4gICAgICovXG4gICAgc3ViICh2ZWN0b3I6IFZlYzMsIG91dD86IFZlYzMpIHtcbiAgICAgICAgcmV0dXJuIFZlYzMuc3VidHJhY3Qob3V0IHx8IG5ldyBWZWMzKCksIHRoaXMsIHZlY3Rvcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqICEjZW4gTXVsdGlwbGllcyB0aGlzIGJ5IGEgbnVtYmVyLiBJZiB5b3Ugd2FudCB0byBzYXZlIHJlc3VsdCB0byBhbm90aGVyIHZlY3RvciwgdXNlIG11bCgpIGluc3RlYWQuXG4gICAgICogISN6aCDnvKnmlL7lvZPliY3lkJHph4/jgILlpoLmnpzkvaDmg7Pnu5Pmnpzkv53lrZjliLDlj6bkuIDkuKrlkJHph4/vvIzlj6/kvb/nlKggbXVsKCkg5Luj5pu/44CCXG4gICAgICogQG1ldGhvZCBtdWxTZWxmXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bVxuICAgICAqIEByZXR1cm4ge1ZlYzN9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKi9cbiAgICBtdWxTZWxmICA9IFZlYzMucHJvdG90eXBlLm11bHRpcGx5U2NhbGFyO1xuICAgIC8qKlxuICAgICAqICEjZW4gTXVsdGlwbGllcyBieSBhIG51bWJlciwgYW5kIHJldHVybnMgdGhlIG5ldyByZXN1bHQuXG4gICAgICogISN6aCDnvKnmlL7lkJHph4/vvIzlubbov5Tlm57mlrDnu5PmnpzjgIJcbiAgICAgKiBAbWV0aG9kIG11bFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAgICAgKiBAcGFyYW0ge1ZlYzN9IFtvdXRdIC0gb3B0aW9uYWwsIHRoZSByZWNlaXZpbmcgdmVjdG9yLCB5b3UgY2FuIHBhc3MgdGhlIHNhbWUgdmVjMyB0byBzYXZlIHJlc3VsdCB0byBpdHNlbGYsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgdmVjMyB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJuIHtWZWMzfSB0aGUgcmVzdWx0XG4gICAgICovXG4gICAgbXVsIChudW06IG51bWJlciwgb3V0PzogVmVjMykge1xuICAgICAgICByZXR1cm4gVmVjMy5tdWx0aXBseVNjYWxhcihvdXQgfHwgbmV3IFZlYzMoKSwgdGhpcywgbnVtKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogISNlbiBEaXZpZGVzIGJ5IGEgbnVtYmVyLiBJZiB5b3Ugd2FudCB0byBzYXZlIHJlc3VsdCB0byBhbm90aGVyIHZlY3RvciwgdXNlIGRpdigpIGluc3RlYWQuXG4gICAgICogISN6aCDlkJHph4/pmaTms5XjgILlpoLmnpzkvaDmg7Pnu5Pmnpzkv53lrZjliLDlj6bkuIDkuKrlkJHph4/vvIzlj6/kvb/nlKggZGl2KCkg5Luj5pu/44CCXG4gICAgICogQG1ldGhvZCBkaXZTZWxmXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bVxuICAgICAqIEByZXR1cm4ge1ZlYzN9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKi9cbiAgICBkaXZTZWxmICA9IFZlYzMucHJvdG90eXBlLmRpdmlkZTtcbiAgICAvKipcbiAgICAgKiAhI2VuIERpdmlkZXMgYnkgYSBudW1iZXIsIGFuZCByZXR1cm5zIHRoZSBuZXcgcmVzdWx0LlxuICAgICAqICEjemgg5ZCR6YeP6Zmk5rOV77yM5bm26L+U5Zue5paw55qE57uT5p6c44CCXG4gICAgICogQG1ldGhvZCBkaXZcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtXG4gICAgICogQHBhcmFtIHtWZWMzfSBbb3V0XSAtIG9wdGlvbmFsLCB0aGUgcmVjZWl2aW5nIHZlY3RvciwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIHZlYzMgdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IHZlYzMgd2lsbCBiZSBjcmVhdGVkXG4gICAgICogQHJldHVybiB7VmVjM30gdGhlIHJlc3VsdFxuICAgICAqL1xuICAgIGRpdiAobnVtOiBudW1iZXIsIG91dD86IFZlYzMpOiBWZWMzIHtcbiAgICAgICAgcmV0dXJuIFZlYzMubXVsdGlwbHlTY2FsYXIob3V0IHx8IG5ldyBWZWMzKCksIHRoaXMsIDEvbnVtKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogISNlbiBNdWx0aXBsaWVzIHR3byB2ZWN0b3JzLlxuICAgICAqICEjemgg5YiG6YeP55u45LmY44CCXG4gICAgICogQG1ldGhvZCBzY2FsZVNlbGZcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHZlY3RvclxuICAgICAqIEByZXR1cm4ge1ZlYzN9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKi9cbiAgICBzY2FsZVNlbGYgPSBWZWMzLnByb3RvdHlwZS5tdWx0aXBseTtcbiAgICAvKipcbiAgICAgKiAhI2VuIE11bHRpcGxpZXMgdHdvIHZlY3RvcnMsIGFuZCByZXR1cm5zIHRoZSBuZXcgcmVzdWx0LlxuICAgICAqICEjemgg5YiG6YeP55u45LmY77yM5bm26L+U5Zue5paw55qE57uT5p6c44CCXG4gICAgICogQG1ldGhvZCBzY2FsZVxuICAgICAqIEBwYXJhbSB7VmVjM30gdmVjdG9yXG4gICAgICogQHBhcmFtIHtWZWMzfSBbb3V0XSAtIG9wdGlvbmFsLCB0aGUgcmVjZWl2aW5nIHZlY3RvciwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIHZlYzMgdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IHZlYzMgd2lsbCBiZSBjcmVhdGVkXG4gICAgICogQHJldHVybiB7VmVjM30gdGhlIHJlc3VsdFxuICAgICAqL1xuICAgIHNjYWxlICh2ZWN0b3I6IFZlYzMsIG91dD86IFZlYzMpIHtcbiAgICAgICAgcmV0dXJuIFZlYzMubXVsdGlwbHkob3V0IHx8IG5ldyBWZWMzKCksIHRoaXMsIHZlY3Rvcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqICEjZW4gTmVnYXRlcyB0aGUgY29tcG9uZW50cy4gSWYgeW91IHdhbnQgdG8gc2F2ZSByZXN1bHQgdG8gYW5vdGhlciB2ZWN0b3IsIHVzZSBuZWcoKSBpbnN0ZWFkLlxuICAgICAqICEjemgg5ZCR6YeP5Y+W5Y+N44CC5aaC5p6c5L2g5oOz57uT5p6c5L+d5a2Y5Yiw5Y+m5LiA5Liq5ZCR6YeP77yM5Y+v5L2/55SoIG5lZygpIOS7o+abv+OAglxuICAgICAqIEBtZXRob2QgbmVnU2VsZlxuICAgICAqIEByZXR1cm4ge1ZlYzN9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKi9cbiAgICBuZWdTZWxmID0gVmVjMy5wcm90b3R5cGUubmVnYXRlO1xuICAgIC8qKlxuICAgICAqICEjZW4gTmVnYXRlcyB0aGUgY29tcG9uZW50cywgYW5kIHJldHVybnMgdGhlIG5ldyByZXN1bHQuXG4gICAgICogISN6aCDov5Tlm57lj5blj43lkI7nmoTmlrDlkJHph4/jgIJcbiAgICAgKiBAbWV0aG9kIG5lZ1xuICAgICAqIEBwYXJhbSB7VmVjM30gW291dF0gLSBvcHRpb25hbCwgdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWMzIHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWMzIHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm4ge1ZlYzN9IHRoZSByZXN1bHRcbiAgICAgKi9cbiAgICBuZWcgKG91dD86IFZlYzMpIHtcbiAgICAgICAgcmV0dXJuIFZlYzMubmVnYXRlKG91dCB8fCBuZXcgVmVjMygpLCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIHJldHVybiBhIFZlYzMgb2JqZWN0IHdpdGggeCA9IDEsIHkgPSAxLCB6ID0gMS5cbiAgICAgKiAhI3poIOaWsCBWZWMzIOWvueixoeOAglxuICAgICAqIEBwcm9wZXJ0eSBPTkVcbiAgICAgKiBAdHlwZSBWZWMzXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgT05FICgpIHsgcmV0dXJuIG5ldyBWZWMzKDEsIDEsIDEpOyB9XG4gICAgc3RhdGljIHJlYWRvbmx5IE9ORV9SID0gVmVjMy5PTkU7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIHJldHVybiBhIFZlYzMgb2JqZWN0IHdpdGggeCA9IDAsIHkgPSAwLCB6ID0gMC5cbiAgICAgKiAhI3poIOi/lOWbniB4ID0gMO+8jHkgPSAw77yMeiA9IDAg55qEIFZlYzMg5a+56LGh44CCXG4gICAgICogQHByb3BlcnR5IFpFUk9cbiAgICAgKiBAdHlwZSBWZWMzXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgWkVSTyAoKSB7IHJldHVybiBuZXcgVmVjMygpOyB9XG4gICAgc3RhdGljIHJlYWRvbmx5IFpFUk9fUiA9IFZlYzMuWkVSTztcblxuICAgIC8qKlxuICAgICAqICEjZW4gcmV0dXJuIGEgVmVjMyBvYmplY3Qgd2l0aCB4ID0gMCwgeSA9IDEsIHogPSAwLlxuICAgICAqICEjemgg6L+U5ZueIHggPSAwLCB5ID0gMSwgeiA9IDAg55qEIFZlYzMg5a+56LGh44CCXG4gICAgICogQHByb3BlcnR5IFVQXG4gICAgICogQHR5cGUgVmVjM1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IFVQICgpIHsgcmV0dXJuIG5ldyBWZWMzKDAsIDEsIDApOyB9XG4gICAgc3RhdGljIHJlYWRvbmx5IFVQX1IgPSBWZWMzLlVQO1xuXG4gICAgLyoqXG4gICAgICogISNlbiByZXR1cm4gYSBWZWMzIG9iamVjdCB3aXRoIHggPSAxLCB5ID0gMCwgeiA9IDAuXG4gICAgICogISN6aCDov5Tlm54geCA9IDHvvIx5ID0gMO+8jHogPSAwIOeahCBWZWMzIOWvueixoeOAglxuICAgICAqIEBwcm9wZXJ0eSBSSUdIVFxuICAgICAqIEB0eXBlIFZlYzNcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGdldCBSSUdIVCAoKSB7IHJldHVybiBuZXcgVmVjMygxLCAwLCAwKTsgfVxuICAgIHN0YXRpYyByZWFkb25seSBSSUdIVF9SID0gVmVjMy5SSUdIVDtcblxuICAgIC8qKlxuICAgICAqICEjZW4gcmV0dXJuIGEgVmVjMyBvYmplY3Qgd2l0aCB4ID0gMCwgeSA9IDAsIHogPSAxLlxuICAgICAqICEjemgg6L+U5ZueIHggPSAw77yMeSA9IDDvvIx6ID0gMSDnmoQgVmVjMyDlr7nosaHjgIJcbiAgICAgKiBAcHJvcGVydHkgRk9SV0FSRFxuICAgICAqIEB0eXBlIFZlYzNcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGdldCBGT1JXQVJEICgpIHsgcmV0dXJuIG5ldyBWZWMzKDAsIDAsIDEpOyB9XG4gICAgc3RhdGljIHJlYWRvbmx5IEZST05UX1IgPSBWZWMzLkZPUldBUkQ7XG5cblxuICAgIC8qKlxuICAgICAqICEjemgg5bCG55uu5qCH6LWL5YC85Li66Zu25ZCR6YePXG4gICAgICogISNlbiBUaGUgdGFyZ2V0IG9mIGFuIGFzc2lnbm1lbnQgemVybyB2ZWN0b3JcbiAgICAgKiBAbWV0aG9kIHplcm9cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHplcm88T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHplcm88T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSAwO1xuICAgICAgICBvdXQueSA9IDA7XG4gICAgICAgIG91dC56ID0gMDtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiOt+W+l+aMh+WumuWQkemHj+eahOaLt+i0nVxuICAgICAqICEjZW4gT2J0YWluaW5nIGNvcHkgdmVjdG9ycyBkZXNpZ25hdGVkXG4gICAgICogQG1ldGhvZCBjbG9uZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogY2xvbmU8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAoYTogT3V0KTogVmVjM1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgY2xvbmU8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAoYTogT3V0KSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhhLngsIGEueSwgYS56KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWkjeWItuebruagh+WQkemHj1xuICAgICAqICEjZW4gQ29weSB0aGUgdGFyZ2V0IHZlY3RvclxuICAgICAqIEBtZXRob2QgY29weVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogY29weTxPdXQgZXh0ZW5kcyBJVmVjM0xpa2UsIFZlYzNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IFZlYzNMaWtlKTogT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBjb3B5PE91dCBleHRlbmRzIElWZWMzTGlrZSwgVmVjM0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogVmVjM0xpa2UpIHtcbiAgICAgICAgb3V0LnggPSBhLng7XG4gICAgICAgIG91dC55ID0gYS55O1xuICAgICAgICBvdXQueiA9IGEuejtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiuvue9ruWQkemHj+WAvFxuICAgICAqICEjZW4gU2V0IHRvIHZhbHVlXG4gICAgICogQG1ldGhvZCBzZXRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHNldDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgc2V0PE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCB4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKSB7XG4gICAgICAgIG91dC54ID0geDtcbiAgICAgICAgb3V0LnkgPSB5O1xuICAgICAgICBvdXQueiA9IHo7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/liqDms5VcbiAgICAgKiAhI2VuIEVsZW1lbnQtd2lzZSB2ZWN0b3IgYWRkaXRpb25cbiAgICAgKiBAbWV0aG9kIGFkZFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogYWRkPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCk6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgYWRkPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBvdXQueCA9IGEueCArIGIueDtcbiAgICAgICAgb3V0LnkgPSBhLnkgKyBiLnk7XG4gICAgICAgIG91dC56ID0gYS56ICsgYi56O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5YeP5rOVXG4gICAgICogISNlbiBFbGVtZW50LXdpc2UgdmVjdG9yIHN1YnRyYWN0aW9uXG4gICAgICogQG1ldGhvZCBzdWJ0cmFjdFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3VidHJhY3Q8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KTogT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBzdWJ0cmFjdDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSBhLnggLSBiLng7XG4gICAgICAgIG91dC55ID0gYS55IC0gYi55O1xuICAgICAgICBvdXQueiA9IGEueiAtIGIuejtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+S5mOazlSAo5YiG6YeP56evKVxuICAgICAqICEjZW4gRWxlbWVudC13aXNlIHZlY3RvciBtdWx0aXBsaWNhdGlvbiAocHJvZHVjdCBjb21wb25lbnQpXG4gICAgICogQG1ldGhvZCBtdWx0aXBseVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbXVsdGlwbHk8T3V0IGV4dGVuZHMgSVZlYzNMaWtlLCBWZWMzTGlrZV8xIGV4dGVuZHMgSVZlYzNMaWtlLCBWZWMzTGlrZV8yIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IFZlYzNMaWtlXzEsIGI6IFZlYzNMaWtlXzIpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIG11bHRpcGx5PE91dCBleHRlbmRzIElWZWMzTGlrZSwgVmVjM0xpa2VfMSBleHRlbmRzIElWZWMzTGlrZSwgVmVjM0xpa2VfMiBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBWZWMzTGlrZV8xLCBiOiBWZWMzTGlrZV8yKSB7XG4gICAgICAgIG91dC54ID0gYS54ICogYi54O1xuICAgICAgICBvdXQueSA9IGEueSAqIGIueTtcbiAgICAgICAgb3V0LnogPSBhLnogKiBiLno7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/pmaTms5VcbiAgICAgKiAhI2VuIEVsZW1lbnQtd2lzZSB2ZWN0b3IgZGl2aXNpb25cbiAgICAgKiBAbWV0aG9kIGRpdmlkZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZGl2aWRlPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCk6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZGl2aWRlPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBvdXQueCA9IGEueCAvIGIueDtcbiAgICAgICAgb3V0LnkgPSBhLnkgLyBiLnk7XG4gICAgICAgIG91dC56ID0gYS56IC8gYi56O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5ZCR5LiK5Y+W5pW0XG4gICAgICogISNlbiBSb3VuZGluZyB1cCBieSBlbGVtZW50cyBvZiB0aGUgdmVjdG9yXG4gICAgICogQG1ldGhvZCBjZWlsXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBjZWlsPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGNlaWw8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xuICAgICAgICBvdXQueCA9IE1hdGguY2VpbChhLngpO1xuICAgICAgICBvdXQueSA9IE1hdGguY2VpbChhLnkpO1xuICAgICAgICBvdXQueiA9IE1hdGguY2VpbChhLnopO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5ZCR5LiL5Y+W5pW0XG4gICAgICogISNlbiBFbGVtZW50IHZlY3RvciBieSByb3VuZGluZyBkb3duXG4gICAgICogQG1ldGhvZCBmbG9vclxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZmxvb3I8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCk6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZmxvb3I8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xuICAgICAgICBvdXQueCA9IE1hdGguZmxvb3IoYS54KTtcbiAgICAgICAgb3V0LnkgPSBNYXRoLmZsb29yKGEueSk7XG4gICAgICAgIG91dC56ID0gTWF0aC5mbG9vcihhLnopO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5pyA5bCP5YC8XG4gICAgICogISNlbiBUaGUgbWluaW11bSBieS1lbGVtZW50IHZlY3RvclxuICAgICAqIEBtZXRob2QgbWluXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBtaW48T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KTogT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBtaW48T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIG91dC54ID0gTWF0aC5taW4oYS54LCBiLngpO1xuICAgICAgICBvdXQueSA9IE1hdGgubWluKGEueSwgYi55KTtcbiAgICAgICAgb3V0LnogPSBNYXRoLm1pbihhLnosIGIueik7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/mnIDlpKflgLxcbiAgICAgKiAhI2VuIFRoZSBtYXhpbXVtIHZhbHVlIG9mIHRoZSBlbGVtZW50LXdpc2UgdmVjdG9yXG4gICAgICogQG1ldGhvZCBtYXhcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG1heDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIG1heDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSBNYXRoLm1heChhLngsIGIueCk7XG4gICAgICAgIG91dC55ID0gTWF0aC5tYXgoYS55LCBiLnkpO1xuICAgICAgICBvdXQueiA9IE1hdGgubWF4KGEueiwgYi56KTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+Wbm+iIjeS6lOWFpeWPluaVtFxuICAgICAqICEjZW4gRWxlbWVudC13aXNlIHZlY3RvciBvZiByb3VuZGluZyB0byB3aG9sZVxuICAgICAqIEBtZXRob2Qgcm91bmRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHJvdW5kPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHJvdW5kPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSBNYXRoLnJvdW5kKGEueCk7XG4gICAgICAgIG91dC55ID0gTWF0aC5yb3VuZChhLnkpO1xuICAgICAgICBvdXQueiA9IE1hdGgucm91bmQoYS56KTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWQkemHj+agh+mHj+S5mOazlVxuICAgICAqICEjZW4gVmVjdG9yIHNjYWxhciBtdWx0aXBsaWNhdGlvblxuICAgICAqIEBtZXRob2QgbXVsdGlwbHlTY2FsYXJcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG11bHRpcGx5U2NhbGFyPE91dCBleHRlbmRzIElWZWMzTGlrZSwgVmVjM0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogVmVjM0xpa2UsIGI6IG51bWJlcik6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgbXVsdGlwbHlTY2FsYXI8T3V0IGV4dGVuZHMgSVZlYzNMaWtlLCBWZWMzTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBWZWMzTGlrZSwgYjogbnVtYmVyKSB7XG4gICAgICAgIG91dC54ID0gYS54ICogYjtcbiAgICAgICAgb3V0LnkgPSBhLnkgKiBiO1xuICAgICAgICBvdXQueiA9IGEueiAqIGI7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/kuZjliqA6IEEgKyBCICogc2NhbGVcbiAgICAgKiAhI2VuIEVsZW1lbnQtd2lzZSB2ZWN0b3IgbXVsdGlwbHkgYWRkOiBBICsgQiAqIHNjYWxlXG4gICAgICogQG1ldGhvZCBzY2FsZUFuZEFkZFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc2NhbGVBbmRBZGQ8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0LCBzY2FsZTogbnVtYmVyKTogT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBzY2FsZUFuZEFkZDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQsIHNjYWxlOiBudW1iZXIpIHtcbiAgICAgICAgb3V0LnggPSBhLnggKyBiLnggKiBzY2FsZTtcbiAgICAgICAgb3V0LnkgPSBhLnkgKyBiLnkgKiBzY2FsZTtcbiAgICAgICAgb3V0LnogPSBhLnogKyBiLnogKiBzY2FsZTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOaxguS4pOWQkemHj+eahOasp+awj+i3neemu1xuICAgICAqICEjZW4gU2Vla2luZyB0d28gdmVjdG9ycyBFdWNsaWRlYW4gZGlzdGFuY2VcbiAgICAgKiBAbWV0aG9kIGRpc3RhbmNlXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBkaXN0YW5jZTxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChhOiBPdXQsIGI6IE91dCk6IG51bWJlclxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZGlzdGFuY2U8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAoYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgX3ggPSBiLnggLSBhLng7XG4gICAgICAgIF95ID0gYi55IC0gYS55O1xuICAgICAgICBfeiA9IGIueiAtIGEuejtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChfeCAqIF94ICsgX3kgKiBfeSArIF96ICogX3opO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5rGC5Lik5ZCR6YeP55qE5qyn5rCP6Led56a75bmz5pa5XG4gICAgICogISNlbiBFdWNsaWRlYW4gZGlzdGFuY2Ugc3F1YXJlZCBzZWVraW5nIHR3byB2ZWN0b3JzXG4gICAgICogQG1ldGhvZCBzcXVhcmVkRGlzdGFuY2VcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHNxdWFyZWREaXN0YW5jZTxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChhOiBPdXQsIGI6IE91dCk6IG51bWJlclxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgc3F1YXJlZERpc3RhbmNlPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIF94ID0gYi54IC0gYS54O1xuICAgICAgICBfeSA9IGIueSAtIGEueTtcbiAgICAgICAgX3ogPSBiLnogLSBhLno7XG4gICAgICAgIHJldHVybiBfeCAqIF94ICsgX3kgKiBfeSArIF96ICogX3o7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmsYLlkJHph4/plb/luqZcbiAgICAgKiAhI2VuIFNlZWtpbmcgdmVjdG9yIGxlbmd0aFxuICAgICAqIEBtZXRob2QgbGVuXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBsZW48T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAoYTogT3V0KTogbnVtYmVyXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBsZW48T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAoYTogT3V0KSB7XG4gICAgICAgIF94ID0gYS54O1xuICAgICAgICBfeSA9IGEueTtcbiAgICAgICAgX3ogPSBhLno7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoX3ggKiBfeCArIF95ICogX3kgKyBfeiAqIF96KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOaxguWQkemHj+mVv+W6puW5s+aWuVxuICAgICAqICEjZW4gU2Vla2luZyBzcXVhcmVkIHZlY3RvciBsZW5ndGhcbiAgICAgKiBAbWV0aG9kIGxlbmd0aFNxclxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbGVuZ3RoU3FyPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKGE6IE91dCk6IG51bWJlclxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgbGVuZ3RoU3FyPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKGE6IE91dCkge1xuICAgICAgICBfeCA9IGEueDtcbiAgICAgICAgX3kgPSBhLnk7XG4gICAgICAgIF96ID0gYS56O1xuICAgICAgICByZXR1cm4gX3ggKiBfeCArIF95ICogX3kgKyBfeiAqIF96O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5Y+W6LSfXG4gICAgICogISNlbiBCeSB0YWtpbmcgdGhlIG5lZ2F0aXZlIGVsZW1lbnRzIG9mIHRoZSB2ZWN0b3JcbiAgICAgKiBAbWV0aG9kIG5lZ2F0ZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbmVnYXRlPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIG5lZ2F0ZTxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XG4gICAgICAgIG91dC54ID0gLWEueDtcbiAgICAgICAgb3V0LnkgPSAtYS55O1xuICAgICAgICBvdXQueiA9IC1hLno7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/lj5blgJLmlbDvvIzmjqXov5EgMCDml7bov5Tlm54gSW5maW5pdHlcbiAgICAgKiAhI2VuIEVsZW1lbnQgdmVjdG9yIGJ5IHRha2luZyB0aGUgaW52ZXJzZSwgcmV0dXJuIG5lYXIgMCBJbmZpbml0eVxuICAgICAqIEBtZXRob2QgaW52ZXJzZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogaW52ZXJzZTxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogT3V0KTogT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBpbnZlcnNlPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSAxLjAgLyBhLng7XG4gICAgICAgIG91dC55ID0gMS4wIC8gYS55O1xuICAgICAgICBvdXQueiA9IDEuMCAvIGEuejtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+WPluWAkuaVsO+8jOaOpei/kSAwIOaXtui/lOWbniAwXG4gICAgICogISNlbiBFbGVtZW50IHZlY3RvciBieSB0YWtpbmcgdGhlIGludmVyc2UsIHJldHVybiBuZWFyIDAgMFxuICAgICAqIEBtZXRob2QgaW52ZXJzZVNhZmVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGludmVyc2VTYWZlPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGludmVyc2VTYWZlPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcbiAgICAgICAgX3ggPSBhLng7XG4gICAgICAgIF95ID0gYS55O1xuICAgICAgICBfeiA9IGEuejtcblxuICAgICAgICBpZiAoTWF0aC5hYnMoX3gpIDwgRVBTSUxPTikge1xuICAgICAgICAgICAgb3V0LnggPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0LnggPSAxLjAgLyBfeDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChNYXRoLmFicyhfeSkgPCBFUFNJTE9OKSB7XG4gICAgICAgICAgICBvdXQueSA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXQueSA9IDEuMCAvIF95O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKE1hdGguYWJzKF96KSA8IEVQU0lMT04pIHtcbiAgICAgICAgICAgIG91dC56ID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dC56ID0gMS4wIC8gX3o7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5b2S5LiA5YyW5ZCR6YePXG4gICAgICogISNlbiBOb3JtYWxpemVkIHZlY3RvclxuICAgICAqIEBtZXRob2Qgbm9ybWFsaXplXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBub3JtYWxpemU8T3V0IGV4dGVuZHMgSVZlYzNMaWtlLCBWZWMzTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBWZWMzTGlrZSk6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgbm9ybWFsaXplPE91dCBleHRlbmRzIElWZWMzTGlrZSwgVmVjM0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogVmVjM0xpa2UpIHtcbiAgICAgICAgX3ggPSBhLng7XG4gICAgICAgIF95ID0gYS55O1xuICAgICAgICBfeiA9IGEuejtcblxuICAgICAgICBsZXQgbGVuID0gX3ggKiBfeCArIF95ICogX3kgKyBfeiAqIF96O1xuICAgICAgICBpZiAobGVuID4gMCkge1xuICAgICAgICAgICAgbGVuID0gMSAvIE1hdGguc3FydChsZW4pO1xuICAgICAgICAgICAgb3V0LnggPSBfeCAqIGxlbjtcbiAgICAgICAgICAgIG91dC55ID0gX3kgKiBsZW47XG4gICAgICAgICAgICBvdXQueiA9IF96ICogbGVuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlkJHph4/ngrnnp6/vvIjmlbDph4/np6/vvIlcbiAgICAgKiAhI2VuIFZlY3RvciBkb3QgcHJvZHVjdCAoc2NhbGFyIHByb2R1Y3QpXG4gICAgICogQG1ldGhvZCBkb3RcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGRvdDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChhOiBPdXQsIGI6IE91dCk6IG51bWJlclxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZG90PE91dCBleHRlbmRzIElWZWMzTGlrZT4gKGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIHJldHVybiBhLnggKiBiLnggKyBhLnkgKiBiLnkgKyBhLnogKiBiLno7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlkJHph4/lj4nnp6/vvIjlkJHph4/np6/vvIlcbiAgICAgKiAhI2VuIFZlY3RvciBjcm9zcyBwcm9kdWN0ICh2ZWN0b3IgcHJvZHVjdClcbiAgICAgKiBAbWV0aG9kIGNyb3NzXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBjcm9zczxPdXQgZXh0ZW5kcyBJVmVjM0xpa2UsIFZlYzNMaWtlXzEgZXh0ZW5kcyBJVmVjM0xpa2UsIFZlYzNMaWtlXzIgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogVmVjM0xpa2VfMSwgYjogVmVjM0xpa2VfMik6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgY3Jvc3M8T3V0IGV4dGVuZHMgSVZlYzNMaWtlLCBWZWMzTGlrZV8xIGV4dGVuZHMgSVZlYzNMaWtlLCBWZWMzTGlrZV8yIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IFZlYzNMaWtlXzEsIGI6IFZlYzNMaWtlXzIpIHtcbiAgICAgICAgY29uc3QgeyB4OiBheCwgeTogYXksIHo6IGF6IH0gPSBhO1xuICAgICAgICBjb25zdCB7IHg6IGJ4LCB5OiBieSwgejogYnogfSA9IGI7XG4gICAgICAgIG91dC54ID0gYXkgKiBieiAtIGF6ICogYnk7XG4gICAgICAgIG91dC55ID0gYXogKiBieCAtIGF4ICogYno7XG4gICAgICAgIG91dC56ID0gYXggKiBieSAtIGF5ICogYng7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/nur/mgKfmj5LlgLzvvJogQSArIHQgKiAoQiAtIEEpXG4gICAgICogISNlbiBWZWN0b3IgZWxlbWVudCBieSBlbGVtZW50IGxpbmVhciBpbnRlcnBvbGF0aW9uOiBBICsgdCAqIChCIC0gQSlcbiAgICAgKiBAbWV0aG9kIGxlcnBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGxlcnA8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0LCB0OiBudW1iZXIpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGxlcnA8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0LCB0OiBudW1iZXIpIHtcbiAgICAgICAgb3V0LnggPSBhLnggKyB0ICogKGIueCAtIGEueCk7XG4gICAgICAgIG91dC55ID0gYS55ICsgdCAqIChiLnkgLSBhLnkpO1xuICAgICAgICBvdXQueiA9IGEueiArIHQgKiAoYi56IC0gYS56KTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOeUn+aIkOS4gOS4quWcqOWNleS9jeeQg+S9k+S4iuWdh+WMgOWIhuW4g+eahOmaj+acuuWQkemHj1xuICAgICAqICEjZW4gR2VuZXJhdGVzIGEgdW5pZm9ybWx5IGRpc3RyaWJ1dGVkIHJhbmRvbSB2ZWN0b3JzIG9uIHRoZSB1bml0IHNwaGVyZVxuICAgICAqIEBtZXRob2QgcmFuZG9tXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiByYW5kb208T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHNjYWxlPzogbnVtYmVyKTogT3V0XG4gICAgICogQHBhcmFtIHNjYWxlIOeUn+aIkOeahOWQkemHj+mVv+W6plxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgcmFuZG9tPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBzY2FsZT86IG51bWJlcikge1xuICAgICAgICBzY2FsZSA9IHNjYWxlIHx8IDEuMDtcblxuICAgICAgICBjb25zdCBwaGkgPSByYW5kb20oKSAqIDIuMCAqIE1hdGguUEk7XG4gICAgICAgIGNvbnN0IGNvc1RoZXRhID0gcmFuZG9tKCkgKiAyIC0gMTtcbiAgICAgICAgY29uc3Qgc2luVGhldGEgPSBNYXRoLnNxcnQoMSAtIGNvc1RoZXRhICogY29zVGhldGEpO1xuXG4gICAgICAgIG91dC54ID0gc2luVGhldGEgKiBNYXRoLmNvcyhwaGkpICogc2NhbGU7XG4gICAgICAgIG91dC55ID0gc2luVGhldGEgKiBNYXRoLnNpbihwaGkpICogc2NhbGU7XG4gICAgICAgIG91dC56ID0gY29zVGhldGEgKiBzY2FsZTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWQkemHj+S4juWbm+e7tOefqemYteS5mOazle+8jOm7mOiupOWQkemHj+esrOWbm+S9jeS4uiAx44CCXG4gICAgICogISNlbiBGb3VyLWRpbWVuc2lvbmFsIHZlY3RvciBhbmQgbWF0cml4IG11bHRpcGxpY2F0aW9uLCB0aGUgZGVmYXVsdCB2ZWN0b3JzIGZvdXJ0aCBvbmUuXG4gICAgICogQG1ldGhvZCB0cmFuc2Zvcm1NYXQ0XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiB0cmFuc2Zvcm1NYXQ0PE91dCBleHRlbmRzIElWZWMzTGlrZSwgVmVjM0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2UsIE1hdExpa2UgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogVmVjM0xpa2UsIG1hdDogTWF0TGlrZSk6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgdHJhbnNmb3JtTWF0NDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2UsIFZlYzNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlLCBNYXRMaWtlIGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IFZlYzNMaWtlLCBtYXQ6IE1hdExpa2UpIHtcbiAgICAgICAgX3ggPSBhLng7XG4gICAgICAgIF95ID0gYS55O1xuICAgICAgICBfeiA9IGEuejtcbiAgICAgICAgbGV0IG0gPSBtYXQubTtcbiAgICAgICAgbGV0IHJodyA9IG1bM10gKiBfeCArIG1bN10gKiBfeSArIG1bMTFdICogX3ogKyBtWzE1XTtcbiAgICAgICAgcmh3ID0gcmh3ID8gMSAvIHJodyA6IDE7XG4gICAgICAgIG91dC54ID0gKG1bMF0gKiBfeCArIG1bNF0gKiBfeSArIG1bOF0gKiBfeiArIG1bMTJdKSAqIHJodztcbiAgICAgICAgb3V0LnkgPSAobVsxXSAqIF94ICsgbVs1XSAqIF95ICsgbVs5XSAqIF96ICsgbVsxM10pICogcmh3O1xuICAgICAgICBvdXQueiA9IChtWzJdICogX3ggKyBtWzZdICogX3kgKyBtWzEwXSAqIF96ICsgbVsxNF0pICogcmh3O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5ZCR6YeP5LiO5Zub57u055+p6Zi15LmY5rOV77yM6buY6K6k5ZCR6YeP56ys5Zub5L2N5Li6IDDjgIJcbiAgICAgKiAhI2VuIEZvdXItZGltZW5zaW9uYWwgdmVjdG9yIGFuZCBtYXRyaXggbXVsdGlwbGljYXRpb24sIHZlY3RvciBmb3VydGggZGVmYXVsdCBpcyAwLlxuICAgICAqIEBtZXRob2QgdHJhbnNmb3JtTWF0NE5vcm1hbFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogdHJhbnNmb3JtTWF0NE5vcm1hbDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2UsIE1hdExpa2UgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBtYXQ6IE1hdExpa2UpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRyYW5zZm9ybU1hdDROb3JtYWw8T3V0IGV4dGVuZHMgSVZlYzNMaWtlLCBNYXRMaWtlIGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgbWF0OiBNYXRMaWtlKSB7XG4gICAgICAgIF94ID0gYS54O1xuICAgICAgICBfeSA9IGEueTtcbiAgICAgICAgX3ogPSBhLno7XG4gICAgICAgIGxldCBtID0gbWF0Lm07XG4gICAgICAgIGxldCByaHcgPSBtWzNdICogX3ggKyBtWzddICogX3kgKyBtWzExXSAqIF96O1xuICAgICAgICByaHcgPSByaHcgPyAxIC8gcmh3IDogMTtcbiAgICAgICAgb3V0LnggPSAobVswXSAqIF94ICsgbVs0XSAqIF95ICsgbVs4XSAqIF96KSAqIHJodztcbiAgICAgICAgb3V0LnkgPSAobVsxXSAqIF94ICsgbVs1XSAqIF95ICsgbVs5XSAqIF96KSAqIHJodztcbiAgICAgICAgb3V0LnogPSAobVsyXSAqIF94ICsgbVs2XSAqIF95ICsgbVsxMF0gKiBfeikgKiByaHc7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlkJHph4/kuI7kuInnu7Tnn6npmLXkuZjms5VcbiAgICAgKiAhI2VuIERpbWVuc2lvbmFsIHZlY3RvciBtYXRyaXggbXVsdGlwbGljYXRpb25cbiAgICAgKiBAbWV0aG9kIHRyYW5zZm9ybU1hdDNcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHRyYW5zZm9ybU1hdDM8T3V0IGV4dGVuZHMgSVZlYzNMaWtlLCBNYXRMaWtlIGV4dGVuZHMgSU1hdDNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgbWF0OiBNYXRMaWtlKTogT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyB0cmFuc2Zvcm1NYXQzPE91dCBleHRlbmRzIElWZWMzTGlrZSwgTWF0TGlrZSBleHRlbmRzIElNYXQzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIG1hdDogTWF0TGlrZSkge1xuICAgICAgICBfeCA9IGEueDtcbiAgICAgICAgX3kgPSBhLnk7XG4gICAgICAgIF96ID0gYS56O1xuICAgICAgICBsZXQgbSA9IG1hdC5tO1xuICAgICAgICBvdXQueCA9IF94ICogbVswXSArIF95ICogbVszXSArIF96ICogbVs2XTtcbiAgICAgICAgb3V0LnkgPSBfeCAqIG1bMV0gKyBfeSAqIG1bNF0gKyBfeiAqIG1bN107XG4gICAgICAgIG91dC56ID0gX3ggKiBtWzJdICsgX3kgKiBtWzVdICsgX3ogKiBtWzhdO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5ZCR6YeP5Lu/5bCE5Y+Y5o2iXG4gICAgICogISNlbiBBZmZpbmUgdHJhbnNmb3JtYXRpb24gdmVjdG9yXG4gICAgICogQG1ldGhvZCB0cmFuc2Zvcm1BZmZpbmVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHRyYW5zZm9ybUFmZmluZTxPdXQgZXh0ZW5kcyBJVmVjM0xpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2UsIE1hdExpa2UgZXh0ZW5kcyBJTWF0NExpa2U+KG91dDogT3V0LCB2OiBWZWNMaWtlLCBtYXQ6IE1hdExpa2UpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRyYW5zZm9ybUFmZmluZTxPdXQgZXh0ZW5kcyBJVmVjM0xpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2UsIE1hdExpa2UgZXh0ZW5kcyBJTWF0NExpa2U+XG4gICAgICAgIChvdXQ6IE91dCwgdjogVmVjTGlrZSwgbWF0OiBNYXRMaWtlKSB7XG4gICAgICAgIF94ID0gdi54O1xuICAgICAgICBfeSA9IHYueTtcbiAgICAgICAgX3ogPSB2Lno7XG4gICAgICAgIGxldCBtID0gbWF0Lm07XG4gICAgICAgIG91dC54ID0gbVswXSAqIF94ICsgbVsxXSAqIF95ICsgbVsyXSAqIF96ICsgbVszXTtcbiAgICAgICAgb3V0LnkgPSBtWzRdICogX3ggKyBtWzVdICogX3kgKyBtWzZdICogX3ogKyBtWzddO1xuICAgICAgICBvdXQueCA9IG1bOF0gKiBfeCArIG1bOV0gKiBfeSArIG1bMTBdICogX3ogKyBtWzExXTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWQkemHj+Wbm+WFg+aVsOS5mOazlVxuICAgICAqICEjZW4gVmVjdG9yIHF1YXRlcm5pb24gbXVsdGlwbGljYXRpb25cbiAgICAgKiBAbWV0aG9kIHRyYW5zZm9ybVF1YXRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHRyYW5zZm9ybVF1YXQ8T3V0IGV4dGVuZHMgSVZlYzNMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlLCBRdWF0TGlrZSBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCBhOiBWZWNMaWtlLCBxOiBRdWF0TGlrZSk6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgdHJhbnNmb3JtUXVhdDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2UsIFF1YXRMaWtlIGV4dGVuZHMgSVF1YXRMaWtlPiAob3V0OiBPdXQsIGE6IFZlY0xpa2UsIHE6IFF1YXRMaWtlKSB7XG4gICAgICAgIC8vIGJlbmNobWFya3M6IGh0dHA6Ly9qc3BlcmYuY29tL3F1YXRlcm5pb24tdHJhbnNmb3JtLVZlYzMtaW1wbGVtZW50YXRpb25zXG5cbiAgICAgICAgLy8gY2FsY3VsYXRlIHF1YXQgKiB2ZWNcbiAgICAgICAgY29uc3QgaXggPSBxLncgKiBhLnggKyBxLnkgKiBhLnogLSBxLnogKiBhLnk7XG4gICAgICAgIGNvbnN0IGl5ID0gcS53ICogYS55ICsgcS56ICogYS54IC0gcS54ICogYS56O1xuICAgICAgICBjb25zdCBpeiA9IHEudyAqIGEueiArIHEueCAqIGEueSAtIHEueSAqIGEueDtcbiAgICAgICAgY29uc3QgaXcgPSAtcS54ICogYS54IC0gcS55ICogYS55IC0gcS56ICogYS56O1xuXG4gICAgICAgIC8vIGNhbGN1bGF0ZSByZXN1bHQgKiBpbnZlcnNlIHF1YXRcbiAgICAgICAgb3V0LnggPSBpeCAqIHEudyArIGl3ICogLXEueCArIGl5ICogLXEueiAtIGl6ICogLXEueTtcbiAgICAgICAgb3V0LnkgPSBpeSAqIHEudyArIGl3ICogLXEueSArIGl6ICogLXEueCAtIGl4ICogLXEuejtcbiAgICAgICAgb3V0LnogPSBpeiAqIHEudyArIGl3ICogLXEueiArIGl4ICogLXEueSAtIGl5ICogLXEueDtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOS7pee8qeaUviAtPiDml4vovawgLT4g5bmz56e76aG65bqP5Y+Y5o2i5ZCR6YePXG4gICAgICogISNlbiBUbyBzY2FsZSAtPiByb3RhdGlvbiAtPiB0cmFuc2Zvcm1hdGlvbiB2ZWN0b3Igc2VxdWVuY2UgdHJhbnNsYXRpb25cbiAgICAgKiBAbWV0aG9kIHRyYW5zZm9ybVF1YXRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHRyYW5zZm9ybVJUUzxPdXQgZXh0ZW5kcyBJVmVjM0xpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2UsIFF1YXRMaWtlIGV4dGVuZHMgSVF1YXRMaWtlPihvdXQ6IE91dCwgYTogVmVjTGlrZSwgcjogUXVhdExpa2UsIHQ6IFZlY0xpa2UsIHM6IFZlY0xpa2UpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRyYW5zZm9ybVJUUzxPdXQgZXh0ZW5kcyBJVmVjM0xpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2UsIFF1YXRMaWtlIGV4dGVuZHMgSVF1YXRMaWtlPiAoXG4gICAgICAgIG91dDogT3V0LCBhOiBWZWNMaWtlLCByOiBRdWF0TGlrZSwgdDogVmVjTGlrZSwgczogVmVjTGlrZSkge1xuICAgICAgICBjb25zdCB4ID0gYS54ICogcy54O1xuICAgICAgICBjb25zdCB5ID0gYS55ICogcy55O1xuICAgICAgICBjb25zdCB6ID0gYS56ICogcy56O1xuICAgICAgICBjb25zdCBpeCA9IHIudyAqIHggKyByLnkgKiB6IC0gci56ICogeTtcbiAgICAgICAgY29uc3QgaXkgPSByLncgKiB5ICsgci56ICogeCAtIHIueCAqIHo7XG4gICAgICAgIGNvbnN0IGl6ID0gci53ICogeiArIHIueCAqIHkgLSByLnkgKiB4O1xuICAgICAgICBjb25zdCBpdyA9IC1yLnggKiB4IC0gci55ICogeSAtIHIueiAqIHo7XG4gICAgICAgIG91dC54ID0gaXggKiByLncgKyBpdyAqIC1yLnggKyBpeSAqIC1yLnogLSBpeiAqIC1yLnkgKyB0Lng7XG4gICAgICAgIG91dC55ID0gaXkgKiByLncgKyBpdyAqIC1yLnkgKyBpeiAqIC1yLnggLSBpeCAqIC1yLnogKyB0Lnk7XG4gICAgICAgIG91dC56ID0gaXogKiByLncgKyBpdyAqIC1yLnogKyBpeCAqIC1yLnkgLSBpeSAqIC1yLnggKyB0Lno7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDku6XlubPnp7sgLT4g5peL6L2sIC0+IOe8qeaUvumhuuW6j+mAhuWPmOaNouWQkemHj1xuICAgICAqICEjZW4gVHJhbnNsYXRpb25hbCAtPiByb3RhdGlvbiAtPiBab29tIGludmVyc2UgdHJhbnNmb3JtYXRpb24gdmVjdG9yIHNlcXVlbmNlXG4gICAgICogQG1ldGhvZCB0cmFuc2Zvcm1JbnZlcnNlUlRTXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiB0cmFuc2Zvcm1JbnZlcnNlUlRTPE91dCBleHRlbmRzIElWZWMzTGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZSwgUXVhdExpa2UgZXh0ZW5kcyBJUXVhdExpa2U+KG91dDogT3V0LCBhOiBWZWNMaWtlLCByOiBRdWF0TGlrZSwgdDogVmVjTGlrZSwgczogVmVjTGlrZSk6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgdHJhbnNmb3JtSW52ZXJzZVJUUzxPdXQgZXh0ZW5kcyBJVmVjM0xpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2UsIFF1YXRMaWtlIGV4dGVuZHMgSVF1YXRMaWtlPiAoXG4gICAgICAgIG91dDogT3V0LCBhOiBWZWNMaWtlLCByOiBRdWF0TGlrZSwgdDogVmVjTGlrZSwgczogVmVjTGlrZSkge1xuICAgICAgICBjb25zdCB4ID0gYS54IC0gdC54O1xuICAgICAgICBjb25zdCB5ID0gYS55IC0gdC55O1xuICAgICAgICBjb25zdCB6ID0gYS56IC0gdC56O1xuICAgICAgICBjb25zdCBpeCA9IHIudyAqIHggLSByLnkgKiB6ICsgci56ICogeTtcbiAgICAgICAgY29uc3QgaXkgPSByLncgKiB5IC0gci56ICogeCArIHIueCAqIHo7XG4gICAgICAgIGNvbnN0IGl6ID0gci53ICogeiAtIHIueCAqIHkgKyByLnkgKiB4O1xuICAgICAgICBjb25zdCBpdyA9IHIueCAqIHggKyByLnkgKiB5ICsgci56ICogejtcbiAgICAgICAgb3V0LnggPSAoaXggKiByLncgKyBpdyAqIHIueCArIGl5ICogci56IC0gaXogKiByLnkpIC8gcy54O1xuICAgICAgICBvdXQueSA9IChpeSAqIHIudyArIGl3ICogci55ICsgaXogKiByLnggLSBpeCAqIHIueikgLyBzLnk7XG4gICAgICAgIG91dC56ID0gKGl6ICogci53ICsgaXcgKiByLnogKyBpeCAqIHIueSAtIGl5ICogci54KSAvIHMuejtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOe7lSBYIOi9tOaXi+i9rOWQkemHj+aMh+WumuW8p+W6plxuICAgICAqICEjZW4gUm90YXRpb24gdmVjdG9yIHNwZWNpZmllZCBhbmdsZSBhYm91dCB0aGUgWCBheGlzXG4gICAgICogQG1ldGhvZCByb3RhdGVYXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiByb3RhdGVYPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCB2OiBPdXQsIG86IE91dCwgYTogbnVtYmVyKTogT3V0XG4gICAgICogQHBhcmFtIHYg5b6F5peL6L2s5ZCR6YePXG4gICAgICogQHBhcmFtIG8g5peL6L2s5Lit5b+DXG4gICAgICogQHBhcmFtIGEg5peL6L2s5byn5bqmXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyByb3RhdGVYPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCB2OiBPdXQsIG86IE91dCwgYTogbnVtYmVyKSB7XG4gICAgICAgIC8vIFRyYW5zbGF0ZSBwb2ludCB0byB0aGUgb3JpZ2luXG4gICAgICAgIF94ID0gdi54IC0gby54O1xuICAgICAgICBfeSA9IHYueSAtIG8ueTtcbiAgICAgICAgX3ogPSB2LnogLSBvLno7XG5cbiAgICAgICAgLy8gcGVyZm9ybSByb3RhdGlvblxuICAgICAgICBjb25zdCBjb3MgPSBNYXRoLmNvcyhhKTtcbiAgICAgICAgY29uc3Qgc2luID0gTWF0aC5zaW4oYSk7XG4gICAgICAgIGNvbnN0IHJ4ID0gX3g7XG4gICAgICAgIGNvbnN0IHJ5ID0gX3kgKiBjb3MgLSBfeiAqIHNpbjtcbiAgICAgICAgY29uc3QgcnogPSBfeSAqIHNpbiArIF96ICogY29zO1xuXG4gICAgICAgIC8vIHRyYW5zbGF0ZSB0byBjb3JyZWN0IHBvc2l0aW9uXG4gICAgICAgIG91dC54ID0gcnggKyBvLng7XG4gICAgICAgIG91dC55ID0gcnkgKyBvLnk7XG4gICAgICAgIG91dC56ID0gcnogKyBvLno7XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOe7lSBZIOi9tOaXi+i9rOWQkemHj+aMh+WumuW8p+W6plxuICAgICAqICEjZW4gUm90YXRpb24gdmVjdG9yIHNwZWNpZmllZCBhbmdsZSBhcm91bmQgdGhlIFkgYXhpc1xuICAgICAqIEBtZXRob2Qgcm90YXRlWVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcm90YXRlWTxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgdjogT3V0LCBvOiBPdXQsIGE6IG51bWJlcik6IE91dFxuICAgICAqIEBwYXJhbSB2IOW+heaXi+i9rOWQkemHj1xuICAgICAqIEBwYXJhbSBvIOaXi+i9rOS4reW/g1xuICAgICAqIEBwYXJhbSBhIOaXi+i9rOW8p+W6plxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgcm90YXRlWTxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgdjogT3V0LCBvOiBPdXQsIGE6IG51bWJlcikge1xuICAgICAgICAvLyBUcmFuc2xhdGUgcG9pbnQgdG8gdGhlIG9yaWdpblxuICAgICAgICBfeCA9IHYueCAtIG8ueDtcbiAgICAgICAgX3kgPSB2LnkgLSBvLnk7XG4gICAgICAgIF96ID0gdi56IC0gby56O1xuXG4gICAgICAgIC8vIHBlcmZvcm0gcm90YXRpb25cbiAgICAgICAgY29uc3QgY29zID0gTWF0aC5jb3MoYSk7XG4gICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKGEpO1xuICAgICAgICBjb25zdCByeCA9IF96ICogc2luICsgX3ggKiBjb3M7XG4gICAgICAgIGNvbnN0IHJ5ID0gX3k7XG4gICAgICAgIGNvbnN0IHJ6ID0gX3ogKiBjb3MgLSBfeCAqIHNpbjtcblxuICAgICAgICAvLyB0cmFuc2xhdGUgdG8gY29ycmVjdCBwb3NpdGlvblxuICAgICAgICBvdXQueCA9IHJ4ICsgby54O1xuICAgICAgICBvdXQueSA9IHJ5ICsgby55O1xuICAgICAgICBvdXQueiA9IHJ6ICsgby56O1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDnu5UgWiDovbTml4vovazlkJHph4/mjIflrprlvKfluqZcbiAgICAgKiAhI2VuIEFyb3VuZCB0aGUgWiBheGlzIHNwZWNpZmllZCBhbmdsZSB2ZWN0b3JcbiAgICAgKiBAbWV0aG9kIHJvdGF0ZVpcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHJvdGF0ZVo8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHY6IE91dCwgbzogT3V0LCBhOiBudW1iZXIpOiBPdXRcbiAgICAgKiBAcGFyYW0gdiDlvoXml4vovazlkJHph49cbiAgICAgKiBAcGFyYW0gbyDml4vovazkuK3lv4NcbiAgICAgKiBAcGFyYW0gYSDml4vovazlvKfluqZcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHJvdGF0ZVo8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHY6IE91dCwgbzogT3V0LCBhOiBudW1iZXIpIHtcbiAgICAgICAgLy8gVHJhbnNsYXRlIHBvaW50IHRvIHRoZSBvcmlnaW5cbiAgICAgICAgX3ggPSB2LnggLSBvLng7XG4gICAgICAgIF95ID0gdi55IC0gby55O1xuICAgICAgICBfeiA9IHYueiAtIG8uejtcblxuICAgICAgICAvLyBwZXJmb3JtIHJvdGF0aW9uXG4gICAgICAgIGNvbnN0IGNvcyA9IE1hdGguY29zKGEpO1xuICAgICAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihhKTtcbiAgICAgICAgY29uc3QgcnggPSBfeCAqIGNvcyAtIF95ICogc2luO1xuICAgICAgICBjb25zdCByeSA9IF94ICogc2luICsgX3kgKiBjb3M7XG4gICAgICAgIGNvbnN0IHJ6ID0gX3o7XG5cbiAgICAgICAgLy8gdHJhbnNsYXRlIHRvIGNvcnJlY3QgcG9zaXRpb25cbiAgICAgICAgb3V0LnggPSByeCArIG8ueDtcbiAgICAgICAgb3V0LnkgPSByeSArIG8ueTtcbiAgICAgICAgb3V0LnogPSByeiArIG8uejtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5ZCR6YeP562J5Lu35Yik5patXG4gICAgICogISNlbiBFcXVpdmFsZW50IHZlY3RvcnMgQW5hbHl6aW5nXG4gICAgICogQG1ldGhvZCBzdHJpY3RFcXVhbHNcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0cmljdEVxdWFsczxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChhOiBPdXQsIGI6IE91dCk6IGJvb2xlYW5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHN0cmljdEVxdWFsczxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICByZXR1cm4gYS54ID09PSBiLnggJiYgYS55ID09PSBiLnkgJiYgYS56ID09PSBiLno7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmjpLpmaTmta7ngrnmlbDor6/lt67nmoTlkJHph4/ov5HkvLznrYnku7fliKTmlq1cbiAgICAgKiAhI2VuIE5lZ2F0aXZlIGVycm9yIHZlY3RvciBmbG9hdGluZyBwb2ludCBhcHByb3hpbWF0ZWx5IGVxdWl2YWxlbnQgQW5hbHl6aW5nXG4gICAgICogQG1ldGhvZCBlcXVhbHNcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGVxdWFsczxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChhOiBPdXQsIGI6IE91dCwgZXBzaWxvbj86IG51bWJlcik6IGJvb2xlYW5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGVxdWFsczxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChhOiBPdXQsIGI6IE91dCwgZXBzaWxvbiA9IEVQU0lMT04pIHtcbiAgICAgICAgY29uc3QgeyB4OiBhMCwgeTogYTEsIHo6IGEyIH0gPSBhO1xuICAgICAgICBjb25zdCB7IHg6IGIwLCB5OiBiMSwgejogYjIgfSA9IGI7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBNYXRoLmFicyhhMCAtIGIwKSA8PVxuICAgICAgICAgICAgZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTApLCBNYXRoLmFicyhiMCkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhMSAtIGIxKSA8PVxuICAgICAgICAgICAgZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTEpLCBNYXRoLmFicyhiMSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhMiAtIGIyKSA8PVxuICAgICAgICAgICAgZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTIpLCBNYXRoLmFicyhiMikpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmsYLkuKTlkJHph4/lpLnop5LlvKfluqZcbiAgICAgKiAhI2VuIFJhZGlhbiBhbmdsZSBiZXR3ZWVuIHR3byB2ZWN0b3JzIHNlZWtcbiAgICAgKiBAbWV0aG9kIGFuZ2xlXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBhbmdsZTxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChhOiBPdXQsIGI6IE91dCk6IG51bWJlclxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgYW5nbGU8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAoYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgVmVjMy5ub3JtYWxpemUodjNfMSwgYSk7XG4gICAgICAgIFZlYzMubm9ybWFsaXplKHYzXzIsIGIpO1xuICAgICAgICBjb25zdCBjb3NpbmUgPSBWZWMzLmRvdCh2M18xLCB2M18yKTtcbiAgICAgICAgaWYgKGNvc2luZSA+IDEuMCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvc2luZSA8IC0xLjApIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLlBJO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoY29zaW5lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiuoeeul+WQkemHj+WcqOaMh+WumuW5s+mdouS4iueahOaKleW9sVxuICAgICAqICEjZW4gQ2FsY3VsYXRpbmcgYSBwcm9qZWN0aW9uIHZlY3RvciBpbiB0aGUgc3BlY2lmaWVkIHBsYW5lXG4gICAgICogQG1ldGhvZCBwcm9qZWN0T25QbGFuZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcHJvamVjdE9uUGxhbmU8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgbjogT3V0KTogT3V0XG4gICAgICogQHBhcmFtIGEg5b6F5oqV5b2x5ZCR6YePXG4gICAgICogQHBhcmFtIG4g5oyH5a6a5bmz6Z2i55qE5rOV57q/XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBwcm9qZWN0T25QbGFuZTxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBuOiBPdXQpIHtcbiAgICAgICAgcmV0dXJuIFZlYzMuc3VidHJhY3Qob3V0LCBhLCBWZWMzLnByb2plY3Qob3V0LCBhLCBuKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDorqHnrpflkJHph4/lnKjmjIflrprlkJHph4/kuIrnmoTmipXlvbFcbiAgICAgKiAhI2VuIFByb2plY3Rpb24gdmVjdG9yIGNhbGN1bGF0ZWQgaW4gdGhlIHZlY3RvciBkZXNpZ25hdGVkXG4gICAgICogQG1ldGhvZCBwcm9qZWN0XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBwcm9qZWN0PE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCk6IE91dFxuICAgICAqIEBwYXJhbSBhIOW+heaKleW9seWQkemHj1xuICAgICAqIEBwYXJhbSBuIOebruagh+WQkemHj1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgcHJvamVjdDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgY29uc3Qgc3FyTGVuID0gVmVjMy5sZW5ndGhTcXIoYik7XG4gICAgICAgIGlmIChzcXJMZW4gPCAwLjAwMDAwMSkge1xuICAgICAgICAgICAgcmV0dXJuIFZlYzMuc2V0KG91dCwgMCwgMCwgMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gVmVjMy5tdWx0aXBseVNjYWxhcihvdXQsIGIsIFZlYzMuZG90KGEsIGIpIC8gc3FyTGVuKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5ZCR6YeP6L2s5pWw57uEXG4gICAgICogISNlbiBWZWN0b3IgdHJhbnNmZXIgYXJyYXlcbiAgICAgKiBAbWV0aG9kIHRvQXJyYXlcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHRvQXJyYXkgPE91dCBleHRlbmRzIElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+PiAob3V0OiBPdXQsIHY6IElWZWMzTGlrZSwgb2ZzPzogbnVtYmVyKTogT3V0XG4gICAgICogQHBhcmFtIG9mcyDmlbDnu4Totbflp4vlgY/np7vph49cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRvQXJyYXkgPE91dCBleHRlbmRzIElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+PiAob3V0OiBPdXQsIHY6IElWZWMzTGlrZSwgb2ZzID0gMCkge1xuICAgICAgICBvdXRbb2ZzICsgMF0gPSB2Lng7XG4gICAgICAgIG91dFtvZnMgKyAxXSA9IHYueTtcbiAgICAgICAgb3V0W29mcyArIDJdID0gdi56O1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmlbDnu4TovazlkJHph49cbiAgICAgKiAhI2VuIEFycmF5IHN0ZWVyaW5nIGFtb3VudFxuICAgICAqIEBtZXRob2QgZnJvbUFycmF5XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBmcm9tQXJyYXkgPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhcnI6IElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+LCBvZnM/OiBudW1iZXIpOiBPdXRcbiAgICAgKiBAcGFyYW0gb2ZzIOaVsOe7hOi1t+Wni+WBj+enu+mHj1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbUFycmF5IDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYXJyOiBJV3JpdGFibGVBcnJheUxpa2U8bnVtYmVyPiwgb2ZzID0gMCkge1xuICAgICAgICBvdXQueCA9IGFycltvZnMgKyAwXTtcbiAgICAgICAgb3V0LnkgPSBhcnJbb2ZzICsgMV07XG4gICAgICAgIG91dC56ID0gYXJyW29mcyArIDJdO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHhcbiAgICAgKi9cbiAgICB4OiBudW1iZXI7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHlcbiAgICAgKi9cbiAgICB5OiBudW1iZXI7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHpcbiAgICAgKi9cbiAgICB6OiBudW1iZXI7XG5cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDb25zdHJ1Y3RvclxuICAgICAqIHNlZSB7eyNjcm9zc0xpbmsgXCJjYy92ZWMzOm1ldGhvZFwifX1jYy52M3t7L2Nyb3NzTGlua319XG4gICAgICogISN6aFxuICAgICAqIOaehOmAoOWHveaVsO+8jOWPr+afpeeciyB7eyNjcm9zc0xpbmsgXCJjYy92ZWMzOm1ldGhvZFwifX1jYy52M3t7L2Nyb3NzTGlua319XG4gICAgICogQG1ldGhvZCBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7VmVjM3xudW1iZXJ9IFt4PTBdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt5PTBdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt6PTBdXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKHg6IFZlYzMgfCBudW1iZXIgPSAwLCB5OiBudW1iZXIgPSAwLCB6OiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGlmICh4ICYmIHR5cGVvZiB4ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGhpcy54ID0geC54O1xuICAgICAgICAgICAgdGhpcy55ID0geC55O1xuICAgICAgICAgICAgdGhpcy56ID0geC56O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy54ID0geCBhcyBudW1iZXI7XG4gICAgICAgICAgICB0aGlzLnkgPSB5O1xuICAgICAgICAgICAgdGhpcy56ID0gejtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gY2xvbmUgYSBWZWMzIHZhbHVlXG4gICAgICogISN6aCDlhYvpmobkuIDkuKogVmVjMyDlgLxcbiAgICAgKiBAbWV0aG9kIGNsb25lXG4gICAgICogQHJldHVybiB7VmVjM31cbiAgICAgKi9cbiAgICBjbG9uZSAoKTogVmVjMyB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLngsIHRoaXMueSwgdGhpcy56KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCB0aGUgY3VycmVudCB2ZWN0b3IgdmFsdWUgd2l0aCB0aGUgZ2l2ZW4gdmVjdG9yLlxuICAgICAqICEjemgg55So5Y+m5LiA5Liq5ZCR6YeP6K6+572u5b2T5YmN55qE5ZCR6YeP5a+56LGh5YC844CCXG4gICAgICogQG1ldGhvZCBzZXRcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IG5ld1ZhbHVlIC0gISNlbiBuZXcgdmFsdWUgdG8gc2V0LiAhI3poIOimgeiuvue9rueahOaWsOWAvFxuICAgICAqIEByZXR1cm4ge1ZlYzN9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKi9cbiAgICBzZXQgKG5ld1ZhbHVlOiBWZWMzKTogVmVjMyB7XG4gICAgICAgIHRoaXMueCA9IG5ld1ZhbHVlLng7XG4gICAgICAgIHRoaXMueSA9IG5ld1ZhbHVlLnk7XG4gICAgICAgIHRoaXMueiA9IG5ld1ZhbHVlLno7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2hlY2sgd2hldGhlciB0aGUgdmVjdG9yIGVxdWFscyBhbm90aGVyIG9uZVxuICAgICAqICEjemgg5b2T5YmN55qE5ZCR6YeP5piv5ZCm5LiO5oyH5a6a55qE5ZCR6YeP55u4562J44CCXG4gICAgICogQG1ldGhvZCBlcXVhbHNcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IG90aGVyXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBlcXVhbHMgKG90aGVyOiBWZWMzKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBvdGhlciAmJiB0aGlzLnggPT09IG90aGVyLnggJiYgdGhpcy55ID09PSBvdGhlci55ICYmIHRoaXMueiA9PT0gb3RoZXIuejtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2hlY2sgd2hldGhlciB0d28gdmVjdG9yIGVxdWFsIHdpdGggc29tZSBkZWdyZWUgb2YgdmFyaWFuY2UuXG4gICAgICogISN6aFxuICAgICAqIOi/keS8vOWIpOaWreS4pOS4queCueaYr+WQpuebuOetieOAgjxici8+XG4gICAgICog5Yik5patIDIg5Liq5ZCR6YeP5piv5ZCm5Zyo5oyH5a6a5pWw5YC855qE6IyD5Zu05LmL5YaF77yM5aaC5p6c5Zyo5YiZ6L+U5ZueIHRydWXvvIzlj43kuYvliJnov5Tlm54gZmFsc2XjgIJcbiAgICAgKiBAbWV0aG9kIGZ1enp5RXF1YWxzXG4gICAgICogQHBhcmFtIHtWZWMzfSBvdGhlclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB2YXJpYW5jZVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgZnV6enlFcXVhbHMgKG90aGVyOiBWZWMzLCB2YXJpYW5jZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLnggLSB2YXJpYW5jZSA8PSBvdGhlci54ICYmIG90aGVyLnggPD0gdGhpcy54ICsgdmFyaWFuY2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnkgLSB2YXJpYW5jZSA8PSBvdGhlci55ICYmIG90aGVyLnkgPD0gdGhpcy55ICsgdmFyaWFuY2UpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy56IC0gdmFyaWFuY2UgPD0gb3RoZXIueiAmJiBvdGhlci56IDw9IHRoaXMueiArIHZhcmlhbmNlKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBUcmFuc2Zvcm0gdG8gc3RyaW5nIHdpdGggdmVjdG9yIGluZm9ybWF0aW9uc1xuICAgICAqICEjemgg6L2s5o2i5Li65pa55L6/6ZiF6K+755qE5a2X56ym5Liy44CCXG4gICAgICogQG1ldGhvZCB0b1N0cmluZ1xuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICB0b1N0cmluZyAoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFwiKFwiICtcbiAgICAgICAgICAgIHRoaXMueC50b0ZpeGVkKDIpICsgXCIsIFwiICtcbiAgICAgICAgICAgIHRoaXMueS50b0ZpeGVkKDIpICsgXCIsIFwiICtcbiAgICAgICAgICAgIHRoaXMuei50b0ZpeGVkKDIpICsgXCIpXCJcbiAgICAgICAgICAgIDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENhbGN1bGF0ZSBsaW5lYXIgaW50ZXJwb2xhdGlvbiByZXN1bHQgYmV0d2VlbiB0aGlzIHZlY3RvciBhbmQgYW5vdGhlciBvbmUgd2l0aCBnaXZlbiByYXRpb1xuICAgICAqICEjemgg57q/5oCn5o+S5YC844CCXG4gICAgICogQG1ldGhvZCBsZXJwXG4gICAgICogQHBhcmFtIHtWZWMzfSB0b1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByYXRpbyAtIHRoZSBpbnRlcnBvbGF0aW9uIGNvZWZmaWNpZW50XG4gICAgICogQHBhcmFtIHtWZWMzfSBbb3V0XSAtIG9wdGlvbmFsLCB0aGUgcmVjZWl2aW5nIHZlY3RvciwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIHZlYzMgdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IHZlYzMgd2lsbCBiZSBjcmVhdGVkXG4gICAgICogQHJldHVybiB7VmVjM31cbiAgICAgKi9cbiAgICBsZXJwICh0bzogVmVjMywgcmF0aW86IG51bWJlciwgb3V0PzogVmVjMyk6IFZlYzMge1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IFZlYzMoKTtcbiAgICAgICAgVmVjMy5sZXJwKG91dCwgdGhpcywgdG8sIHJhdGlvKTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENsYW1wIHRoZSB2ZWN0b3IgYmV0d2VlbiBmcm9tIGZsb2F0IGFuZCB0byBmbG9hdC5cbiAgICAgKiAhI3poXG4gICAgICog6L+U5Zue5oyH5a6a6ZmQ5Yi25Yy65Z+f5ZCO55qE5ZCR6YeP44CCPGJyLz5cbiAgICAgKiDlkJHph4/lpKfkuo4gbWF4X2luY2x1c2l2ZSDliJnov5Tlm54gbWF4X2luY2x1c2l2ZeOAgjxici8+XG4gICAgICog5ZCR6YeP5bCP5LqOIG1pbl9pbmNsdXNpdmUg5YiZ6L+U5ZueIG1pbl9pbmNsdXNpdmXjgII8YnIvPlxuICAgICAqIOWQpuWImei/lOWbnuiHqui6q+OAglxuICAgICAqIEBtZXRob2QgY2xhbXBmXG4gICAgICogQHBhcmFtIHtWZWMzfSBtaW5faW5jbHVzaXZlXG4gICAgICogQHBhcmFtIHtWZWMzfSBtYXhfaW5jbHVzaXZlXG4gICAgICogQHJldHVybiB7VmVjM31cbiAgICAgKi9cbiAgICBjbGFtcGYgKG1pbl9pbmNsdXNpdmU6IFZlYzMsIG1heF9pbmNsdXNpdmU6IFZlYzMpOiBWZWMzIHtcbiAgICAgICAgdGhpcy54ID0gbWlzYy5jbGFtcGYodGhpcy54LCBtaW5faW5jbHVzaXZlLngsIG1heF9pbmNsdXNpdmUueCk7XG4gICAgICAgIHRoaXMueSA9IG1pc2MuY2xhbXBmKHRoaXMueSwgbWluX2luY2x1c2l2ZS55LCBtYXhfaW5jbHVzaXZlLnkpO1xuICAgICAgICB0aGlzLnogPSBtaXNjLmNsYW1wZih0aGlzLnosIG1pbl9pbmNsdXNpdmUueiwgbWF4X2luY2x1c2l2ZS56KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBBZGRzIHRoaXMgdmVjdG9yLiBJZiB5b3Ugd2FudCB0byBzYXZlIHJlc3VsdCB0byBhbm90aGVyIHZlY3RvciwgdXNlIGFkZCgpIGluc3RlYWQuXG4gICAgICogISN6aCDlkJHph4/liqDms5XjgILlpoLmnpzkvaDmg7Pkv53lrZjnu5PmnpzliLDlj6bkuIDkuKrlkJHph4/vvIzkvb/nlKggYWRkKCkg5Luj5pu/44CCXG4gICAgICogQG1ldGhvZCBhZGRTZWxmXG4gICAgICogQHBhcmFtIHtWZWMzfSB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtWZWMzfSByZXR1cm5zIHRoaXNcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICovXG4gICAgYWRkU2VsZiAodmVjdG9yOiBWZWMzKTogdGhpcyB7XG4gICAgICAgIHRoaXMueCArPSB2ZWN0b3IueDtcbiAgICAgICAgdGhpcy55ICs9IHZlY3Rvci55O1xuICAgICAgICB0aGlzLnogKz0gdmVjdG9yLno7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQWRkcyB0d28gdmVjdG9ycywgYW5kIHJldHVybnMgdGhlIG5ldyByZXN1bHQuXG4gICAgICogISN6aCDlkJHph4/liqDms5XvvIzlubbov5Tlm57mlrDnu5PmnpzjgIJcbiAgICAgKiBAbWV0aG9kIGFkZFxuICAgICAqIEBwYXJhbSB7VmVjM30gdmVjdG9yXG4gICAgICogQHBhcmFtIHtWZWMzfSBbb3V0XSAtIG9wdGlvbmFsLCB0aGUgcmVjZWl2aW5nIHZlY3RvciwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIHZlYzMgdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IHZlYzMgd2lsbCBiZSBjcmVhdGVkXG4gICAgICogQHJldHVybiB7VmVjM30gdGhlIHJlc3VsdFxuICAgICAqL1xuICAgIGFkZCAodmVjdG9yOiBWZWMzLCBvdXQ/OiBWZWMzKTogVmVjMyB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgVmVjMygpO1xuICAgICAgICBvdXQueCA9IHRoaXMueCArIHZlY3Rvci54O1xuICAgICAgICBvdXQueSA9IHRoaXMueSArIHZlY3Rvci55O1xuICAgICAgICBvdXQueiA9IHRoaXMueiArIHZlY3Rvci56O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gU3VidHJhY3RzIG9uZSB2ZWN0b3IgZnJvbSB0aGlzLlxuICAgICAqICEjemgg5ZCR6YeP5YeP5rOV44CCXG4gICAgICogQG1ldGhvZCBzdWJ0cmFjdFxuICAgICAqIEBwYXJhbSB7VmVjM30gdmVjdG9yXG4gICAgICogQHJldHVybiB7VmVjM30gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIHN1YnRyYWN0ICh2ZWN0b3I6IFZlYzMpOiBWZWMzIHtcbiAgICAgICAgdGhpcy54IC09IHZlY3Rvci54O1xuICAgICAgICB0aGlzLnkgLT0gdmVjdG9yLnk7XG4gICAgICAgIHRoaXMueiAtPSB2ZWN0b3IuejtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBNdWx0aXBsaWVzIHRoaXMgYnkgYSBudW1iZXIuXG4gICAgICogISN6aCDnvKnmlL7lvZPliY3lkJHph4/jgIJcbiAgICAgKiBAbWV0aG9kIG11bHRpcGx5U2NhbGFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bVxuICAgICAqIEByZXR1cm4ge1ZlYzN9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKi9cbiAgICBtdWx0aXBseVNjYWxhciAobnVtOiBudW1iZXIpOiBWZWMzIHtcbiAgICAgICAgdGhpcy54ICo9IG51bTtcbiAgICAgICAgdGhpcy55ICo9IG51bTtcbiAgICAgICAgdGhpcy56ICo9IG51bTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBNdWx0aXBsaWVzIHR3byB2ZWN0b3JzLlxuICAgICAqICEjemgg5YiG6YeP55u45LmY44CCXG4gICAgICogQG1ldGhvZCBtdWx0aXBseVxuICAgICAqIEBwYXJhbSB7VmVjM30gdmVjdG9yXG4gICAgICogQHJldHVybiB7VmVjM30gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIG11bHRpcGx5ICh2ZWN0b3I6IFZlYzMpOiBWZWMzIHtcbiAgICAgICAgdGhpcy54ICo9IHZlY3Rvci54O1xuICAgICAgICB0aGlzLnkgKj0gdmVjdG9yLnk7XG4gICAgICAgIHRoaXMueiAqPSB2ZWN0b3IuejtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBEaXZpZGVzIGJ5IGEgbnVtYmVyLlxuICAgICAqICEjemgg5ZCR6YeP6Zmk5rOV44CCXG4gICAgICogQG1ldGhvZCBkaXZpZGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtXG4gICAgICogQHJldHVybiB7VmVjM30gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIGRpdmlkZSAobnVtOiBudW1iZXIpOiBWZWMzIHtcbiAgICAgICAgdGhpcy54IC89IG51bTtcbiAgICAgICAgdGhpcy55IC89IG51bTtcbiAgICAgICAgdGhpcy56IC89IG51bTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBOZWdhdGVzIHRoZSBjb21wb25lbnRzLlxuICAgICAqICEjemgg5ZCR6YeP5Y+W5Y+N44CCXG4gICAgICogQG1ldGhvZCBuZWdhdGVcbiAgICAgKiBAcmV0dXJuIHtWZWMzfSByZXR1cm5zIHRoaXNcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICovXG4gICAgbmVnYXRlICgpOiB0aGlzIHtcbiAgICAgICAgdGhpcy54ID0gLXRoaXMueDtcbiAgICAgICAgdGhpcy55ID0gLXRoaXMueTtcbiAgICAgICAgdGhpcy56ID0gLXRoaXMuejtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBEb3QgcHJvZHVjdFxuICAgICAqICEjemgg5b2T5YmN5ZCR6YeP5LiO5oyH5a6a5ZCR6YeP6L+b6KGM54K55LmY44CCXG4gICAgICogQG1ldGhvZCBkb3RcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IFt2ZWN0b3JdXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgcmVzdWx0XG4gICAgICovXG4gICAgZG90ICh2ZWN0b3I6IFZlYzMpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy54ICogdmVjdG9yLnggKyB0aGlzLnkgKiB2ZWN0b3IueSArIHRoaXMueiAqIHZlY3Rvci56O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQ3Jvc3MgcHJvZHVjdFxuICAgICAqICEjemgg5b2T5YmN5ZCR6YeP5LiO5oyH5a6a5ZCR6YeP6L+b6KGM5Y+J5LmY44CCXG4gICAgICogQG1ldGhvZCBjcm9zc1xuICAgICAqIEBwYXJhbSB7VmVjM30gdmVjdG9yXG4gICAgICogQHBhcmFtIHtWZWMzfSBbb3V0XVxuICAgICAqIEByZXR1cm4ge1ZlYzN9IHRoZSByZXN1bHRcbiAgICAgKi9cbiAgICBjcm9zcyAodmVjdG9yOiBWZWMzLCBvdXQ/OiBWZWMzKTogVmVjMyB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgVmVjMygpO1xuICAgICAgICBWZWMzLmNyb3NzKG91dCwgdGhpcywgdmVjdG9yKVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgbGVuZ3RoIG9mIHRoaXMgdmVjdG9yLlxuICAgICAqICEjemgg6L+U5Zue6K+l5ZCR6YeP55qE6ZW/5bqm44CCXG4gICAgICogQG1ldGhvZCBsZW5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSByZXN1bHRcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciB2ID0gY2MudjMoMTAsIDEwLCAxMCk7XG4gICAgICogdi5sZW4oKTsgLy8gcmV0dXJuIDE3LjMyMDUwODA3NTY4ODc3NTtcbiAgICAgKi9cbiAgICBsZW4gKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55ICsgdGhpcy56ICogdGhpcy56KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgdGhlIHNxdWFyZWQgbGVuZ3RoIG9mIHRoaXMgdmVjdG9yLlxuICAgICAqICEjemgg6L+U5Zue6K+l5ZCR6YeP55qE6ZW/5bqm5bmz5pa544CCXG4gICAgICogQG1ldGhvZCBsZW5ndGhTcXJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSByZXN1bHRcbiAgICAgKi9cbiAgICBsZW5ndGhTcXIgKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkgKyB0aGlzLnogKiB0aGlzLno7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBNYWtlIHRoZSBsZW5ndGggb2YgdGhpcyB2ZWN0b3IgdG8gMS5cbiAgICAgKiAhI3poIOWQkemHj+W9kuS4gOWMlu+8jOiuqei/meS4quWQkemHj+eahOmVv+W6puS4uiAx44CCXG4gICAgICogQG1ldGhvZCBub3JtYWxpemVTZWxmXG4gICAgICogQHJldHVybiB7VmVjM30gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIG5vcm1hbGl6ZVNlbGYgKCk6IFZlYzMge1xuICAgICAgICBWZWMzLm5vcm1hbGl6ZSh0aGlzLCB0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIHRoaXMgdmVjdG9yIHdpdGggYSBtYWduaXR1ZGUgb2YgMS48YnIvPlxuICAgICAqIDxici8+XG4gICAgICogTm90ZSB0aGF0IHRoZSBjdXJyZW50IHZlY3RvciBpcyB1bmNoYW5nZWQgYW5kIGEgbmV3IG5vcm1hbGl6ZWQgdmVjdG9yIGlzIHJldHVybmVkLiBJZiB5b3Ugd2FudCB0byBub3JtYWxpemUgdGhlIGN1cnJlbnQgdmVjdG9yLCB1c2Ugbm9ybWFsaXplU2VsZiBmdW5jdGlvbi5cbiAgICAgKiAhI3poXG4gICAgICog6L+U5Zue5b2S5LiA5YyW5ZCO55qE5ZCR6YeP44CCPGJyLz5cbiAgICAgKiA8YnIvPlxuICAgICAqIOazqOaEj++8jOW9k+WJjeWQkemHj+S4jeWPmO+8jOW5tui/lOWbnuS4gOS4quaWsOeahOW9kuS4gOWMluWQkemHj+OAguWmguaenOS9oOaDs+adpeW9kuS4gOWMluW9k+WJjeWQkemHj++8jOWPr+S9v+eUqCBub3JtYWxpemVTZWxmIOWHveaVsOOAglxuICAgICAqIEBtZXRob2Qgbm9ybWFsaXplXG4gICAgICogQHBhcmFtIHtWZWMzfSBbb3V0XSAtIG9wdGlvbmFsLCB0aGUgcmVjZWl2aW5nIHZlY3RvciwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIHZlYzMgdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IHZlYzMgd2lsbCBiZSBjcmVhdGVkXG4gICAgICogQHJldHVybiB7VmVjM30gcmVzdWx0XG4gICAgICovXG4gICAgbm9ybWFsaXplIChvdXQ/OiBWZWMzKTogVmVjMyB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgVmVjMygpO1xuICAgICAgICBWZWMzLm5vcm1hbGl6ZShvdXQsIHRoaXMpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYW5zZm9ybXMgdGhlIHZlYzMgd2l0aCBhIG1hdDQuIDR0aCB2ZWN0b3IgY29tcG9uZW50IGlzIGltcGxpY2l0bHkgJzEnXG4gICAgICogQG1ldGhvZCB0cmFuc2Zvcm1NYXQ0XG4gICAgICogQHBhcmFtIHtNYXQ0fSBtIG1hdHJpeCB0byB0cmFuc2Zvcm0gd2l0aFxuICAgICAqIEBwYXJhbSB7VmVjM30gW291dF0gdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWMzIHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWMzIHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm5zIHtWZWMzfSBvdXRcbiAgICAgKi9cbiAgICB0cmFuc2Zvcm1NYXQ0IChtOiBNYXQ0LCBvdXQ/OiBWZWMzKTogVmVjMyB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgVmVjMygpO1xuICAgICAgICBWZWMzLnRyYW5zZm9ybU1hdDQob3V0LCB0aGlzLCBtKTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBtYXhpbXVtIHZhbHVlIGluIHgsIHksIGFuZCB6XG4gICAgICogQG1ldGhvZCBtYXhBeGlzXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBtYXhBeGlzICgpOiBudW1iZXIge1xuICAgICAgIHJldHVybiBNYXRoLm1heCh0aGlzLngsIHRoaXMueSwgdGhpcy56KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldCBhbmdsZSBpbiByYWRpYW4gYmV0d2VlbiB0aGlzIGFuZCB2ZWN0b3IuXG4gICAgICogISN6aCDlpLnop5LnmoTlvKfluqbjgIJcbiAgICAgKiBAbWV0aG9kIGFuZ2xlXG4gICAgICogQHBhcmFtIHtWZWMzfSB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IGZyb20gMCB0byBNYXRoLlBJXG4gICAgICovXG4gICAgYW5nbGUgPSBWZWMyLnByb3RvdHlwZS5hbmdsZVxuICAgIC8qKlxuICAgICAqICEjZW4gQ2FsY3VsYXRlcyB0aGUgcHJvamVjdGlvbiBvZiB0aGUgY3VycmVudCB2ZWN0b3Igb3ZlciB0aGUgZ2l2ZW4gdmVjdG9yLlxuICAgICAqICEjemgg6L+U5Zue5b2T5YmN5ZCR6YeP5Zyo5oyH5a6aIHZlY3RvciDlkJHph4/kuIrnmoTmipXlvbHlkJHph4/jgIJcbiAgICAgKiBAbWV0aG9kIHByb2plY3RcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHZlY3RvclxuICAgICAqIEByZXR1cm4ge1ZlYzN9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdjEgPSBjYy52MygyMCwgMjAsIDIwKTtcbiAgICAgKiB2YXIgdjIgPSBjYy52Myg1LCA1LCA1KTtcbiAgICAgKiB2MS5wcm9qZWN0KHYyKTsgLy8gVmVjMyB7eDogMjAsIHk6IDIwLCB6OiAyMH07XG4gICAgICovXG4gICAgcHJvamVjdCA9IFZlYzIucHJvdG90eXBlLnByb2plY3RcbiAgICAvLyBDb21wYXRpYmxlIHdpdGggdGhlIHZlYzIgQVBJXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldCBhbmdsZSBpbiByYWRpYW4gYmV0d2VlbiB0aGlzIGFuZCB2ZWN0b3Igd2l0aCBkaXJlY3Rpb24uIDxici8+XG4gICAgICogSW4gb3JkZXIgdG8gY29tcGF0aWJsZSB3aXRoIHRoZSB2ZWMyIEFQSS5cbiAgICAgKiAhI3poIOW4puaWueWQkeeahOWkueinkueahOW8p+W6puOAguivpeaWueazleS7heeUqOWBmuWFvOWuuSAyRCDorqHnrpfjgIJcbiAgICAgKiBAbWV0aG9kIHNpZ25BbmdsZVxuICAgICAqIEBwYXJhbSB7VmVjMyB8IFZlYzJ9IHZlY3RvclxuICAgICAqIEByZXR1cm4ge251bWJlcn0gZnJvbSAtTWF0aFBJIHRvIE1hdGguUElcbiAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAqL1xuICAgIHNpZ25BbmdsZSAodmVjdG9yKSB7XG4gICAgICAgIGNjLndhcm5JRCgxNDA4LCAndmVjMy5zaWduQW5nbGUnLCAndjIuMScsICdjYy52MihzZWxmVmVjdG9yKS5zaWduQW5nbGUodmVjdG9yKScpO1xuICAgICAgICBsZXQgdmVjMSA9IG5ldyBWZWMyKHRoaXMueCwgdGhpcy55KTtcbiAgICAgICAgbGV0IHZlYzIgPSBuZXcgVmVjMih2ZWN0b3IueCwgdmVjdG9yLnkpO1xuICAgICAgICByZXR1cm4gdmVjMS5zaWduQW5nbGUodmVjMik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiByb3RhdGUuIEluIG9yZGVyIHRvIGNvbXBhdGlibGUgd2l0aCB0aGUgdmVjMiBBUEkuXG4gICAgICogISN6aCDov5Tlm57ml4vovaznu5nlrprlvKfluqblkI7nmoTmlrDlkJHph4/jgILor6Xmlrnms5Xku4XnlKjlgZrlhbzlrrkgMkQg6K6h566X44CCXG4gICAgICogQG1ldGhvZCByb3RhdGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFkaWFuc1xuICAgICAqIEBwYXJhbSB7VmVjM30gW291dF0gLSBvcHRpb25hbCwgdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWMyIHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWMyIHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm4ge1ZlYzIgfCBWZWMzfSBpZiB0aGUgJ291dCcgdmFsdWUgaXMgYSB2ZWMzIHlvdSB3aWxsIGdldCBhIFZlYzMgcmV0dXJuLlxuICAgICAqIEBkZXByZWNhdGVkXG4gICAgICovXG4gICAgcm90YXRlIChyYWRpYW5zLCBvdXQpIHtcbiAgICAgICAgY2Mud2FybklEKDE0MDgsICd2ZWMzLnJvdGF0ZScsICd2Mi4xJywgJ2NjLnYyKHNlbGZWZWN0b3IpLnJvdGF0ZShyYWRpYW5zLCBvdXQpJyk7XG4gICAgICAgIHJldHVybiBWZWMyLnByb3RvdHlwZS5yb3RhdGUuY2FsbCh0aGlzLCByYWRpYW5zLCBvdXQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gcm90YXRlIHNlbGYuIEluIG9yZGVyIHRvIGNvbXBhdGlibGUgd2l0aCB0aGUgdmVjMiBBUEkuXG4gICAgICogISN6aCDmjInmjIflrprlvKfluqbml4vovazlkJHph4/jgILor6Xmlrnms5Xku4XnlKjlgZrlhbzlrrkgMkQg6K6h566X44CCXG4gICAgICogQG1ldGhvZCByb3RhdGVTZWxmXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZGlhbnNcbiAgICAgKiBAcmV0dXJuIHtWZWMzfSByZXR1cm5zIHRoaXNcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICogQGRlcHJlY2F0ZWRcbiAgICAgKi9cbiAgICByb3RhdGVTZWxmIChyYWRpYW5zKSB7XG4gICAgICAgIGNjLndhcm5JRCgxNDA4LCAndmVjMy5yb3RhdGVTZWxmJywgJ3YyLjEnLCAnY2MudjIoc2VsZlZlY3Rvcikucm90YXRlU2VsZihyYWRpYW5zKScpO1xuICAgICAgICByZXR1cm4gVmVjMi5wcm90b3R5cGUucm90YXRlU2VsZi5jYWxsKHRoaXMsIHJhZGlhbnMpO1xuICAgIH1cbn1cblxuY29uc3QgdjNfMSA9IG5ldyBWZWMzKCk7XG5jb25zdCB2M18yID0gbmV3IFZlYzMoKTtcblxuQ0NDbGFzcy5mYXN0RGVmaW5lKCdjYy5WZWMzJywgVmVjMywgeyB4OiAwLCB5OiAwLCB6OiAwIH0pO1xuXG4vKipcbiAqIEBtb2R1bGUgY2NcbiAqL1xuXG4vKipcbiAqICEjZW4gVGhlIGNvbnZlbmllbmNlIG1ldGhvZCB0byBjcmVhdGUgYSBuZXcge3sjY3Jvc3NMaW5rIFwiVmVjM1wifX1jYy5WZWMze3svY3Jvc3NMaW5rfX0uXG4gKiAhI3poIOmAmui/h+ivpeeugOS+v+eahOWHveaVsOi/m+ihjOWIm+W7uiB7eyNjcm9zc0xpbmsgXCJWZWMzXCJ9fWNjLlZlYzN7ey9jcm9zc0xpbmt9fSDlr7nosaHjgIJcbiAqIEBtZXRob2QgdjNcbiAqIEBwYXJhbSB7TnVtYmVyfE9iamVjdH0gW3g9MF1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbeT0wXVxuICogQHBhcmFtIHtOdW1iZXJ9IFt6PTBdXG4gKiBAcmV0dXJuIHtWZWMzfVxuICogQGV4YW1wbGVcbiAqIHZhciB2MSA9IGNjLnYzKCk7XG4gKiB2YXIgdjIgPSBjYy52MygwLCAwLCAwKTtcbiAqIHZhciB2MyA9IGNjLnYzKHYyKTtcbiAqIHZhciB2NCA9IGNjLnYzKHt4OiAxMDAsIHk6IDEwMCwgejogMH0pO1xuICovXG5jYy52MyA9IGZ1bmN0aW9uIHYzICh4LCB5LCB6KSB7XG4gICAgcmV0dXJuIG5ldyBWZWMzKHgsIHksIHopO1xufTtcblxuY2MuVmVjMyA9IFZlYzM7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==