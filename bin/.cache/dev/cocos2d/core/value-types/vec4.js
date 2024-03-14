
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/value-types/vec4.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.v4 = v4;
exports["default"] = void 0;

var _CCClass = _interopRequireDefault(require("../platform/CCClass"));

var _valueType = _interopRequireDefault(require("./value-type"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _x = 0.0;
var _y = 0.0;
var _z = 0.0;
var _w = 0.0;
/**
 * !#en Representation of 3D vectors and points.
 * !#zh 表示 3D 向量和坐标
 *
 * @class Vec4
 * @extends ValueType
 */

var Vec4 = /*#__PURE__*/function (_ValueType) {
  _inheritsLoose(Vec4, _ValueType);

  var _proto = Vec4.prototype;

  // deprecated

  /**
   * !#en Subtracts one vector from this. If you want to save result to another vector, use sub() instead.
   * !#zh 向量减法。如果你想保存结果到另一个向量，可使用 sub() 代替。
   * @method subSelf
   * @param {Vec4} vector
   * @return {Vec4} returns this
   * @chainable
   */

  /**
   * !#en Subtracts one vector from this, and returns the new result.
   * !#zh 向量减法，并返回新结果。
   * @method sub
   * @param {Vec4} vector
   * @param {Vec4} [out] - optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created
   * @return {Vec4} the result
   */
  _proto.sub = function sub(vector, out) {
    return Vec4.subtract(out || new Vec4(), this, vector);
  }
  /**
   * !#en Multiplies this by a number. If you want to save result to another vector, use mul() instead.
   * !#zh 缩放当前向量。如果你想结果保存到另一个向量，可使用 mul() 代替。
   * @method mulSelf
   * @param {number} num
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  /**
   * !#en Multiplies by a number, and returns the new result.
   * !#zh 缩放向量，并返回新结果。
   * @method mul
   * @param {number} num
   * @param {Vec4} [out] - optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created
   * @return {Vec4} the result
   */
  _proto.mul = function mul(num, out) {
    return Vec4.multiplyScalar(out || new Vec4(), this, num);
  }
  /**
   * !#en Divides by a number. If you want to save result to another vector, use div() instead.
   * !#zh 向量除法。如果你想结果保存到另一个向量，可使用 div() 代替。
   * @method divSelf
   * @param {number} num
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  /**
   * !#en Divides by a number, and returns the new result.
   * !#zh 向量除法，并返回新的结果。
   * @method div
   * @param {number} num
   * @param {Vec4} [out] - optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created
   * @return {Vec4} the result
   */
  _proto.div = function div(num, out) {
    return Vec4.multiplyScalar(out || new Vec4(), this, 1 / num);
  }
  /**
   * !#en Multiplies two vectors.
   * !#zh 分量相乘。
   * @method scaleSelf
   * @param {Vec4} vector
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  /**
   * !#en Multiplies two vectors, and returns the new result.
   * !#zh 分量相乘，并返回新的结果。
   * @method scale
   * @param {Vec4} vector
   * @param {Vec4} [out] - optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created
   * @return {Vec4} the result
   */
  _proto.scale = function scale(vector, out) {
    return Vec4.multiply(out || new Vec4(), this, vector);
  }
  /**
   * !#en Negates the components. If you want to save result to another vector, use neg() instead.
   * !#zh 向量取反。如果你想结果保存到另一个向量，可使用 neg() 代替。
   * @method negSelf
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  /**
   * !#en Negates the components, and returns the new result.
   * !#zh 返回取反后的新向量。
   * @method neg
   * @param {Vec4} [out] - optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created
   * @return {Vec4} the result
   */
  _proto.neg = function neg(out) {
    return Vec4.negate(out || new Vec4(), this);
  };

  /**
   * !#zh 获得指定向量的拷贝
   * !#en Obtaining copy vectors designated
   * @method clone
   * @typescript
   * clone <Out extends IVec4Like> (a: Out): Vec4
   * @static
   */
  Vec4.clone = function clone(a) {
    return new Vec4(a.x, a.y, a.z, a.w);
  }
  /**
   * !#zh 复制目标向量
   * !#en Copy the target vector
   * @method copy
   * @typescript
   * copy <Out extends IVec4Like> (out: Out, a: Out): Out
   * @static
   */
  ;

  Vec4.copy = function copy(out, a) {
    out.x = a.x;
    out.y = a.y;
    out.z = a.z;
    out.w = a.w;
    return out;
  }
  /**
   * !#zh 设置向量值
   * !#en Set to value
   * @method set
   * @typescript
   * set <Out extends IVec4Like> (out: Out, x: number, y: number, z: number, w: number): Out
   * @static
   */
  ;

  Vec4.set = function set(out, x, y, z, w) {
    out.x = x;
    out.y = y;
    out.z = z;
    out.w = w;
    return out;
  }
  /**
   * !#zh 逐元素向量加法
   * !#en Element-wise vector addition
   * @method add
   * @typescript
   * add <Out extends IVec4Like> (out: Out, a: Out, b: Out): Out
   * @static
   */
  ;

  Vec4.add = function add(out, a, b) {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    out.z = a.z + b.z;
    out.w = a.w + b.w;
    return out;
  }
  /**
   * !#zh 逐元素向量减法
   * !#en Element-wise vector subtraction
   * @method subtract
   * @typescript
   * subtract <Out extends IVec4Like> (out: Out, a: Out, b: Out): Out
   * @static
   */
  ;

  Vec4.subtract = function subtract(out, a, b) {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    out.z = a.z - b.z;
    out.w = a.w - b.w;
    return out;
  }
  /**
   * !#zh 逐元素向量乘法
   * !#en Element-wise vector multiplication
   * @method multiply
   * @typescript
   * multiply <Out extends IVec4Like> (out: Out, a: Out, b: Out): Out
   * @static
   */
  ;

  Vec4.multiply = function multiply(out, a, b) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    out.z = a.z * b.z;
    out.w = a.w * b.w;
    return out;
  }
  /**
   * !#zh 逐元素向量除法
   * !#en Element-wise vector division
   * @method divide
   * @typescript
   * divide <Out extends IVec4Like> (out: Out, a: Out, b: Out): Out
   * @static
   */
  ;

  Vec4.divide = function divide(out, a, b) {
    out.x = a.x / b.x;
    out.y = a.y / b.y;
    out.z = a.z / b.z;
    out.w = a.w / b.w;
    return out;
  }
  /**
   * !#zh 逐元素向量向上取整
   * !#en Rounding up by elements of the vector
   * @method ceil
   * @typescript
   * ceil <Out extends IVec4Like> (out: Out, a: Out): Out
   * @static
   */
  ;

  Vec4.ceil = function ceil(out, a) {
    out.x = Math.ceil(a.x);
    out.y = Math.ceil(a.y);
    out.z = Math.ceil(a.z);
    out.w = Math.ceil(a.w);
    return out;
  }
  /**
   * !#zh 逐元素向量向下取整
   * !#en Element vector by rounding down
   * @method floor
   * @typescript
   * floor <Out extends IVec4Like> (out: Out, a: Out): Out
   * @static
   */
  ;

  Vec4.floor = function floor(out, a) {
    out.x = Math.floor(a.x);
    out.y = Math.floor(a.y);
    out.z = Math.floor(a.z);
    out.w = Math.floor(a.w);
    return out;
  }
  /**
   * !#zh 逐元素向量最小值
   * !#en The minimum by-element vector
   * @method min
   * @typescript
   * min <Out extends IVec4Like> (out: Out, a: Out, b: Out): Out
   * @static
   */
  ;

  Vec4.min = function min(out, a, b) {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    out.z = Math.min(a.z, b.z);
    out.w = Math.min(a.w, b.w);
    return out;
  }
  /**
   * !#zh 逐元素向量最大值
   * !#en The maximum value of the element-wise vector
   * @method max
   * @typescript
   * max <Out extends IVec4Like> (out: Out, a: Out, b: Out): Out
   * @static
   */
  ;

  Vec4.max = function max(out, a, b) {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    out.z = Math.max(a.z, b.z);
    out.w = Math.max(a.w, b.w);
    return out;
  }
  /**
   * !#zh 逐元素向量四舍五入取整
   * !#en Element-wise vector of rounding to whole
   * @method round
   * @typescript
   * round <Out extends IVec4Like> (out: Out, a: Out): Out
   * @static
   */
  ;

  Vec4.round = function round(out, a) {
    out.x = Math.round(a.x);
    out.y = Math.round(a.y);
    out.z = Math.round(a.z);
    out.w = Math.round(a.w);
    return out;
  }
  /**
   * !#zh 向量标量乘法
   * !#en Vector scalar multiplication
   * @method multiplyScalar
   * @typescript
   * multiplyScalar <Out extends IVec4Like> (out: Out, a: Out, b: number): Out
   * @static
   */
  ;

  Vec4.multiplyScalar = function multiplyScalar(out, a, b) {
    out.x = a.x * b;
    out.y = a.y * b;
    out.z = a.z * b;
    out.w = a.w * b;
    return out;
  }
  /**
   * !#zh 逐元素向量乘加: A + B * scale
   * !#en Element-wise vector multiply add: A + B * scale
   * @method scaleAndAdd
   * @typescript
   * scaleAndAdd <Out extends IVec4Like> (out: Out, a: Out, b: Out, scale: number): Out
   * @static
   */
  ;

  Vec4.scaleAndAdd = function scaleAndAdd(out, a, b, scale) {
    out.x = a.x + b.x * scale;
    out.y = a.y + b.y * scale;
    out.z = a.z + b.z * scale;
    out.w = a.w + b.w * scale;
    return out;
  }
  /**
   * !#zh 求两向量的欧氏距离
   * !#en Seeking two vectors Euclidean distance
   * @method distance
   * @typescript
   * distance <Out extends IVec4Like> (a: Out, b: Out): number
   * @static
   */
  ;

  Vec4.distance = function distance(a, b) {
    var x = b.x - a.x;
    var y = b.y - a.y;
    var z = b.z - a.z;
    var w = b.w - a.w;
    return Math.sqrt(x * x + y * y + z * z + w * w);
  }
  /**
   * !#zh 求两向量的欧氏距离平方
   * !#en Euclidean distance squared seeking two vectors
   * @method squaredDistance
   * @typescript
   * squaredDistance <Out extends IVec4Like> (a: Out, b: Out): number
   * @static
   */
  ;

  Vec4.squaredDistance = function squaredDistance(a, b) {
    var x = b.x - a.x;
    var y = b.y - a.y;
    var z = b.z - a.z;
    var w = b.w - a.w;
    return x * x + y * y + z * z + w * w;
  }
  /**
   * !#zh 求向量长度
   * !#en Seeking vector length
   * @method len
   * @typescript
   * len <Out extends IVec4Like> (a: Out): number
   * @static
   */
  ;

  Vec4.len = function len(a) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    _w = a.w;
    return Math.sqrt(_x * _x + _y * _y + _z * _z + _w * _w);
  }
  /**
   * !#zh 求向量长度平方
   * !#en Seeking squared vector length
   * @method lengthSqr
   * @typescript
   * lengthSqr <Out extends IVec4Like> (a: Out): number
   * @static
   */
  ;

  Vec4.lengthSqr = function lengthSqr(a) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    _w = a.w;
    return _x * _x + _y * _y + _z * _z + _w * _w;
  }
  /**
   * !#zh 逐元素向量取负
   * !#en By taking the negative elements of the vector
   * @method negate
   * @typescript
   * negate <Out extends IVec4Like> (out: Out, a: Out): Out
   * @static
   */
  ;

  Vec4.negate = function negate(out, a) {
    out.x = -a.x;
    out.y = -a.y;
    out.z = -a.z;
    out.w = -a.w;
    return out;
  }
  /**
   * !#zh 逐元素向量取倒数，接近 0 时返回 Infinity
   * !#en Element vector by taking the inverse, return near 0 Infinity
   * @method inverse
   * @typescript
   * inverse <Out extends IVec4Like> (out: Out, a: Out): Out
   * @static
   */
  ;

  Vec4.inverse = function inverse(out, a) {
    out.x = 1.0 / a.x;
    out.y = 1.0 / a.y;
    out.z = 1.0 / a.z;
    out.w = 1.0 / a.w;
    return out;
  }
  /**
   * !#zh 逐元素向量取倒数，接近 0 时返回 0
   * !#en Element vector by taking the inverse, return near 0 0
   * @method inverseSafe
   * @typescript
   * inverseSafe <Out extends IVec4Like> (out: Out, a: Out): Out
   * @static
   */
  ;

  Vec4.inverseSafe = function inverseSafe(out, a) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    _w = a.w;

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

    if (Math.abs(_w) < _utils.EPSILON) {
      out.w = 0;
    } else {
      out.w = 1.0 / _w;
    }

    return out;
  }
  /**
   * !#zh 归一化向量
   * !#en Normalized vector
   * @method normalize
   * @typescript
   * normalize <Out extends IVec4Like> (out: Out, a: Out): Out
   * @static
   */
  ;

  Vec4.normalize = function normalize(out, a) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    _w = a.w;
    var len = _x * _x + _y * _y + _z * _z + _w * _w;

    if (len > 0) {
      len = 1 / Math.sqrt(len);
      out.x = _x * len;
      out.y = _y * len;
      out.z = _z * len;
      out.w = _w * len;
    }

    return out;
  }
  /**
   * !#zh 向量点积（数量积）
   * !#en Vector dot product (scalar product)
   * @method dot
   * @typescript
   * dot <Out extends IVec4Like> (a: Out, b: Out): number
   * @static
   */
  ;

  Vec4.dot = function dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
  }
  /**
   * !#zh 逐元素向量线性插值： A + t * (B - A)
   * !#en Vector element by element linear interpolation: A + t * (B - A)
   * @method lerp
   * @typescript
   * lerp <Out extends IVec4Like> (out: Out, a: Out, b: Out, t: number): Out
   * @static
   */
  ;

  Vec4.lerp = function lerp(out, a, b, t) {
    out.x = a.x + t * (b.x - a.x);
    out.y = a.y + t * (b.y - a.y);
    out.z = a.z + t * (b.z - a.z);
    out.w = a.w + t * (b.w - a.w);
    return out;
  }
  /**
   * !#zh 生成一个在单位球体上均匀分布的随机向量
   * !#en Generates a uniformly distributed random vectors on the unit sphere
   * @method random
   * @typescript
   * random <Out extends IVec4Like> (out: Out, scale?: number): Out
   * @param scale 生成的向量长度
   * @static
   */
  ;

  Vec4.random = function random(out, scale) {
    scale = scale || 1.0;
    var phi = (0, _utils.random)() * 2.0 * Math.PI;
    var cosTheta = (0, _utils.random)() * 2 - 1;
    var sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
    out.x = sinTheta * Math.cos(phi) * scale;
    out.y = sinTheta * Math.sin(phi) * scale;
    out.z = cosTheta * scale;
    out.w = 0;
    return out;
  }
  /**
   * !#zh 向量矩阵乘法
   * !#en Vector matrix multiplication
   * @method transformMat4
   * @typescript
   * transformMat4 <Out extends IVec4Like, MatLike extends IMat4Like> (out: Out, a: Out, mat: MatLike): Out
   * @static
   */
  ;

  Vec4.transformMat4 = function transformMat4(out, a, mat) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    _w = a.w;
    var m = mat.m;
    out.x = m[0] * _x + m[4] * _y + m[8] * _z + m[12] * _w;
    out.y = m[1] * _x + m[5] * _y + m[9] * _z + m[13] * _w;
    out.z = m[2] * _x + m[6] * _y + m[10] * _z + m[14] * _w;
    out.w = m[3] * _x + m[7] * _y + m[11] * _z + m[15] * _w;
    return out;
  }
  /**
   * !#zh 向量仿射变换
   * !#en Affine transformation vector
   * @method transformAffine
   * @typescript
   * transformAffine<Out extends IVec4Like, VecLike extends IVec4Like, MatLike extends IMat4Like>(out: Out, v: VecLike, mat: MatLike): Out
   * @static
   */
  ;

  Vec4.transformAffine = function transformAffine(out, v, mat) {
    _x = v.x;
    _y = v.y;
    _z = v.z;
    _w = v.w;
    var m = mat.m;
    out.x = m[0] * _x + m[1] * _y + m[2] * _z + m[3] * _w;
    out.y = m[4] * _x + m[5] * _y + m[6] * _z + m[7] * _w;
    out.x = m[8] * _x + m[9] * _y + m[10] * _z + m[11] * _w;
    out.w = v.w;
    return out;
  }
  /**
   * !#zh 向量四元数乘法
   * !#en Vector quaternion multiplication
   * @method transformQuat
   * @typescript
   * transformQuat <Out extends IVec4Like, QuatLike extends IQuatLike> (out: Out, a: Out, q: QuatLike): Out
   * @static
   */
  ;

  Vec4.transformQuat = function transformQuat(out, a, q) {
    var x = a.x,
        y = a.y,
        z = a.z;
    _x = q.x;
    _y = q.y;
    _z = q.z;
    _w = q.w; // calculate quat * vec

    var ix = _w * x + _y * z - _z * y;
    var iy = _w * y + _z * x - _x * z;
    var iz = _w * z + _x * y - _y * x;
    var iw = -_x * x - _y * y - _z * z; // calculate result * inverse quat

    out.x = ix * _w + iw * -_x + iy * -_z - iz * -_y;
    out.y = iy * _w + iw * -_y + iz * -_x - ix * -_z;
    out.z = iz * _w + iw * -_z + ix * -_y - iy * -_x;
    out.w = a.w;
    return out;
  }
  /**
   * !#zh 向量等价判断
   * !#en Equivalent vectors Analyzing
   * @method strictEquals
   * @typescript
   * strictEquals <Out extends IVec4Like> (a: Out, b: Out): boolean
   * @static
   */
  ;

  Vec4.strictEquals = function strictEquals(a, b) {
    return a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w;
  }
  /**
   * !#zh 排除浮点数误差的向量近似等价判断
   * !#en Negative error vector floating point approximately equivalent Analyzing
   * @method equals
   * @typescript
   * equals <Out extends IVec4Like> (a: Out, b: Out, epsilon?: number): boolean
   * @static
   */
  ;

  Vec4.equals = function equals(a, b, epsilon) {
    if (epsilon === void 0) {
      epsilon = _utils.EPSILON;
    }

    return Math.abs(a.x - b.x) <= epsilon * Math.max(1.0, Math.abs(a.x), Math.abs(b.x)) && Math.abs(a.y - b.y) <= epsilon * Math.max(1.0, Math.abs(a.y), Math.abs(b.y)) && Math.abs(a.z - b.z) <= epsilon * Math.max(1.0, Math.abs(a.z), Math.abs(b.z)) && Math.abs(a.w - b.w) <= epsilon * Math.max(1.0, Math.abs(a.w), Math.abs(b.w));
  }
  /**
   * !#zh 向量转数组
   * !#en Vector transfer array
   * @method toArray
   * @typescript
   * toArray <Out extends IWritableArrayLike<number>> (out: Out, v: IVec4Like, ofs?: number): Out
   * @param ofs 数组起始偏移量
   * @static
   */
  ;

  Vec4.toArray = function toArray(out, v, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    out[ofs + 0] = v.x;
    out[ofs + 1] = v.y;
    out[ofs + 2] = v.z;
    out[ofs + 3] = v.w;
    return out;
  }
  /**
   * !#zh 数组转向量
   * !#en Array steering amount
   * @method fromArray
   * @typescript
   * fromArray <Out extends IVec4Like> (out: Out, arr: IWritableArrayLike<number>, ofs?: number): Out
   * @param ofs 数组起始偏移量
   * @static
   */
  ;

  Vec4.fromArray = function fromArray(out, arr, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    out.x = arr[ofs + 0];
    out.y = arr[ofs + 1];
    out.z = arr[ofs + 2];
    out.w = arr[ofs + 3];
    return out;
  }
  /**
   * @property {Number} x
   */
  ;

  /**
   * !#en
   * Constructor
   * see {{#crossLink "cc/vec4:method"}}cc.v4{{/crossLink}}
   * !#zh
   * 构造函数，可查看 {{#crossLink "cc/vec4:method"}}cc.v4{{/crossLink}}
   * @method constructor
   * @param {number} [x=0]
   * @param {number} [y=0]
   * @param {number} [z=0]
   * @param {number} [w=0]
   */
  function Vec4(x, y, z, w) {
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

    if (w === void 0) {
      w = 0;
    }

    _this = _ValueType.call(this) || this;
    _this.mag = Vec4.prototype.len;
    _this.magSqr = Vec4.prototype.lengthSqr;
    _this.subSelf = Vec4.prototype.subtract;
    _this.mulSelf = Vec4.prototype.multiplyScalar;
    _this.divSelf = Vec4.prototype.divide;
    _this.scaleSelf = Vec4.prototype.multiply;
    _this.negSelf = Vec4.prototype.negate;
    _this.x = void 0;
    _this.y = void 0;
    _this.z = void 0;
    _this.w = void 0;

    if (x && typeof x === 'object') {
      _this.x = x.x;
      _this.y = x.y;
      _this.z = x.z;
      _this.w = x.w;
    } else {
      _this.x = x;
      _this.y = y;
      _this.z = z;
      _this.w = w;
    }

    return _this;
  }
  /**
   * !#en clone a Vec4 value
   * !#zh 克隆一个 Vec4 值
   * @method clone
   * @return {Vec4}
   */


  _proto.clone = function clone() {
    return new Vec4(this.x, this.y, this.z, this.w);
  }
  /**
   * !#en Set the current vector value with the given vector.
   * !#zh 用另一个向量设置当前的向量对象值。
   * @method set
   * @param {Vec4} newValue - !#en new value to set. !#zh 要设置的新值
   * @return {Vec4} returns this
   */
  ;

  _proto.set = function set(x, y, z, w) {
    if (x && typeof x === 'object') {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
      this.w = x.w;
    } else {
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
      this.w = w || 0;
    }

    return this;
  }
  /**
   * !#en Check whether the vector equals another one
   * !#zh 当前的向量是否与指定的向量相等。
   * @method equals
   * @param {Vec4} other
   * @param {number} [epsilon]
   * @return {Boolean}
   */
  ;

  _proto.equals = function equals(other, epsilon) {
    if (epsilon === void 0) {
      epsilon = _utils.EPSILON;
    }

    return Math.abs(this.x - other.x) <= epsilon * Math.max(1.0, Math.abs(this.x), Math.abs(other.x)) && Math.abs(this.y - other.y) <= epsilon * Math.max(1.0, Math.abs(this.y), Math.abs(other.y)) && Math.abs(this.z - other.z) <= epsilon * Math.max(1.0, Math.abs(this.z), Math.abs(other.z)) && Math.abs(this.w - other.w) <= epsilon * Math.max(1.0, Math.abs(this.w), Math.abs(other.w));
  }
  /**
   * !#en Check whether the vector equals another one
   * !#zh 判断当前向量是否在误差范围内与指定分量的向量相等。
   * @method equals4f
   * @param {number} x - 相比较的向量的 x 分量。
   * @param {number} y - 相比较的向量的 y 分量。
   * @param {number} z - 相比较的向量的 z 分量。
   * @param {number} w - 相比较的向量的 w 分量。
   * @param {number} [epsilon] - 允许的误差，应为非负数。
   * @returns {Boolean} - 当两向量的各分量都在指定的误差范围内分别相等时，返回 `true`；否则返回 `false`。
   */
  ;

  _proto.equals4f = function equals4f(x, y, z, w, epsilon) {
    if (epsilon === void 0) {
      epsilon = _utils.EPSILON;
    }

    return Math.abs(this.x - x) <= epsilon * Math.max(1.0, Math.abs(this.x), Math.abs(x)) && Math.abs(this.y - y) <= epsilon * Math.max(1.0, Math.abs(this.y), Math.abs(y)) && Math.abs(this.z - z) <= epsilon * Math.max(1.0, Math.abs(this.z), Math.abs(z)) && Math.abs(this.w - w) <= epsilon * Math.max(1.0, Math.abs(this.w), Math.abs(w));
  }
  /**
   * !#en Check whether strict equals other Vec4
   * !#zh 判断当前向量是否与指定向量相等。两向量的各分量都分别相等时返回 `true`；否则返回 `false`。
   * @method strictEquals
   * @param {Vec4} other - 相比较的向量。
   * @returns {boolean}
   */
  ;

  _proto.strictEquals = function strictEquals(other) {
    return this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
  }
  /**
   * !#en Check whether strict equals other Vec4
   * !#zh 判断当前向量是否与指定分量的向量相等。两向量的各分量都分别相等时返回 `true`；否则返回 `false`。
   * @method strictEquals4f
   * @param {number} x - 指定向量的 x 分量。
   * @param {number} y - 指定向量的 y 分量。
   * @param {number} z - 指定向量的 z 分量。
   * @param {number} w - 指定向量的 w 分量。
   * @returns {boolean}
   */
  ;

  _proto.strictEquals4f = function strictEquals4f(x, y, z, w) {
    return this.x === x && this.y === y && this.z === z && this.w === w;
  }
  /**
   * !#en Calculate linear interpolation result between this vector and another one with given ratio
   * !#zh 根据指定的插值比率，从当前向量到目标向量之间做插值。
   * @method lerp
   * @param {Vec4} to 目标向量。
   * @param {number} ratio 插值比率，范围为 [0,1]。
   * @returns {Vec4}
   */
  ;

  _proto.lerp = function lerp(to, ratio) {
    _x = this.x;
    _y = this.y;
    _z = this.z;
    _w = this.w;
    this.x = _x + ratio * (to.x - _x);
    this.y = _y + ratio * (to.y - _y);
    this.z = _z + ratio * (to.z - _z);
    this.w = _w + ratio * (to.w - _w);
    return this;
  }
  /**
   * !#en Transform to string with vector informations
   * !#zh 返回当前向量的字符串表示。
   * @method toString
   * @returns {string} 当前向量的字符串表示。
   */
  ;

  _proto.toString = function toString() {
    return "(" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ", " + this.z.toFixed(2) + ", " + this.w.toFixed(2) + ")";
  }
  /**
   * !#en Clamp the vector between minInclusive and maxInclusive.
   * !#zh 设置当前向量的值，使其各个分量都处于指定的范围内。
   * @method clampf
   * @param {Vec4} minInclusive 每个分量都代表了对应分量允许的最小值。
   * @param {Vec4} maxInclusive 每个分量都代表了对应分量允许的最大值。
   * @returns {Vec4}
   */
  ;

  _proto.clampf = function clampf(minInclusive, maxInclusive) {
    this.x = (0, _utils.clamp)(this.x, minInclusive.x, maxInclusive.x);
    this.y = (0, _utils.clamp)(this.y, minInclusive.y, maxInclusive.y);
    this.z = (0, _utils.clamp)(this.z, minInclusive.z, maxInclusive.z);
    this.w = (0, _utils.clamp)(this.w, minInclusive.w, maxInclusive.w);
    return this;
  }
  /**
   * !#en Adds this vector. If you want to save result to another vector, use add() instead.
   * !#zh 向量加法。如果你想保存结果到另一个向量，使用 add() 代替。
   * @method addSelf
   * @param {Vec4} vector
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  _proto.addSelf = function addSelf(vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    this.w += vector.w;
    return this;
  }
  /**
   * !#en Adds two vectors, and returns the new result.
   * !#zh 向量加法，并返回新结果。
   * @method add
   * @param {Vec4} vector
   * @param {Vec4} [out] - optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created
   * @return {Vec4} the result
   */
  ;

  _proto.add = function add(vector, out) {
    out = out || new Vec4();
    out.x = this.x + vector.x;
    out.y = this.y + vector.y;
    out.z = this.z + vector.z;
    out.w = this.w + vector.w;
    return out;
  }
  /**
   * !#en Subtracts one vector from this, and returns the new result.
   * !#zh 向量减法，并返回新结果。
   * @method subtract
   * @param {Vec4} vector
   * @param {Vec4} [out] - optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created
   * @return {Vec4} the result
   */
  ;

  _proto.subtract = function subtract(vector, out) {
    out = out || new Vec4();
    out.x = this.x - vector.x;
    out.y = this.y - vector.y;
    out.z = this.z - vector.z;
    out.w = this.w - vector.w;
    return out;
  }
  /**
   * !#en Multiplies this by a number.
   * !#zh 缩放当前向量。
   * @method multiplyScalar
   * @param {number} num
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  _proto.multiplyScalar = function multiplyScalar(num) {
    this.x *= num;
    this.y *= num;
    this.z *= num;
    this.w *= num;
    return this;
  }
  /**
   * !#en Multiplies two vectors.
   * !#zh 分量相乘。
   * @method multiply
   * @param {Vec4} vector
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  _proto.multiply = function multiply(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
    this.z *= vector.z;
    this.w *= vector.w;
    return this;
  }
  /**
   * !#en Divides by a number.
   * !#zh 向量除法。
   * @method divide
   * @param {number} num
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  _proto.divide = function divide(num) {
    this.x /= num;
    this.y /= num;
    this.z /= num;
    this.w /= num;
    return this;
  }
  /**
   * !#en Negates the components.
   * !#zh 向量取反
   * @method negate
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  _proto.negate = function negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    this.w = -this.w;
    return this;
  }
  /**
   * !#en Dot product
   * !#zh 当前向量与指定向量进行点乘。
   * @method dot
   * @param {Vec4} [vector]
   * @return {number} the result
   */
  ;

  _proto.dot = function dot(vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z + this.w * vector.w;
  }
  /**
   * !#en Cross product
   * !#zh 当前向量与指定向量进行叉乘。
   * @method cross
   * @param {Vec4} vector
   * @param {Vec4} [out]
   * @return {Vec4} the result
   */
  ;

  _proto.cross = function cross(vector, out) {
    out = out || new Vec4();
    var ax = this.x,
        ay = this.y,
        az = this.z;
    var bx = vector.x,
        by = vector.y,
        bz = vector.z;
    out.x = ay * bz - az * by;
    out.y = az * bx - ax * bz;
    out.z = ax * by - ay * bx;
    return out;
  }
  /**
   * !#en Returns the length of this vector.
   * !#zh 返回该向量的长度。
   * @method len
   * @return {number} the result
   * @example
   * var v = cc.v4(10, 10);
   * v.len(); // return 14.142135623730951;
   */
  ;

  _proto.len = function len() {
    var x = this.x,
        y = this.y,
        z = this.z,
        w = this.w;
    return Math.sqrt(x * x + y * y + z * z + w * w);
  }
  /**
   * !#en Returns the squared length of this vector.
   * !#zh 返回该向量的长度平方。
   * @method lengthSqr
   * @return {number} the result
   */
  ;

  _proto.lengthSqr = function lengthSqr() {
    var x = this.x,
        y = this.y,
        z = this.z,
        w = this.w;
    return x * x + y * y + z * z + w * w;
  }
  /**
   * !#en Make the length of this vector to 1.
   * !#zh 向量归一化，让这个向量的长度为 1。
   * @method normalizeSelf
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  _proto.normalizeSelf = function normalizeSelf() {
    this.normalize(this);
    return this;
  }
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
   * @param {Vec4} [out] - optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created
   * @return {Vec4} result
   */
  ;

  _proto.normalize = function normalize(out) {
    out = out || new Vec4();
    _x = this.x;
    _y = this.y;
    _z = this.z;
    _w = this.w;
    var len = _x * _x + _y * _y + _z * _z + _w * _w;

    if (len > 0) {
      len = 1 / Math.sqrt(len);
      out.x = _x * len;
      out.y = _y * len;
      out.z = _z * len;
      out.w = _w * len;
    }

    return out;
  }
  /**
   * Transforms the vec4 with a mat4. 4th vector component is implicitly '1'
   * @method transformMat4
   * @param {Mat4} m matrix to transform with
   * @param {Vec4} [out] the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created
   * @returns {Vec4} out
   */
  ;

  _proto.transformMat4 = function transformMat4(matrix, out) {
    out = out || new Vec4();
    _x = this.x;
    _y = this.y;
    _z = this.z;
    _w = this.w;
    var m = matrix.m;
    out.x = m[0] * _x + m[4] * _y + m[8] * _z + m[12] * _w;
    out.y = m[1] * _x + m[5] * _y + m[9] * _z + m[13] * _w;
    out.z = m[2] * _x + m[6] * _y + m[10] * _z + m[14] * _w;
    out.w = m[3] * _x + m[7] * _y + m[11] * _z + m[15] * _w;
    return out;
  }
  /**
   * Returns the maximum value in x, y, z, w.
   * @method maxAxis
   * @returns {number}
   */
  ;

  _proto.maxAxis = function maxAxis() {
    return Math.max(this.x, this.y, this.z, this.w);
  };

  _createClass(Vec4, null, [{
    key: "ZERO",
    get: function get() {
      return new Vec4(0, 0, 0, 0);
    }
  }, {
    key: "ONE",
    get: function get() {
      return new Vec4(1, 1, 1, 1);
    }
  }, {
    key: "NEG_ONE",
    get: function get() {
      return new Vec4(-1, -1, -1, -1);
    }
  }]);

  return Vec4;
}(_valueType["default"]);

exports["default"] = Vec4;
Vec4.sub = Vec4.subtract;
Vec4.mul = Vec4.multiply;
Vec4.div = Vec4.divide;
Vec4.scale = Vec4.multiplyScalar;
Vec4.mag = Vec4.len;
Vec4.squaredMagnitude = Vec4.lengthSqr;
Vec4.ZERO_R = Vec4.ZERO;
Vec4.ONE_R = Vec4.ONE;
Vec4.NEG_ONE_R = Vec4.NEG_ONE;

_CCClass["default"].fastDefine('cc.Vec4', Vec4, {
  x: 0,
  y: 0,
  z: 0,
  w: 0
});

function v4(x, y, z, w) {
  return new Vec4(x, y, z, w);
}

cc.v4 = v4;
cc.Vec4 = Vec4;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3ZhbHVlLXR5cGVzL3ZlYzQudHMiXSwibmFtZXMiOlsiX3giLCJfeSIsIl96IiwiX3ciLCJWZWM0Iiwic3ViIiwidmVjdG9yIiwib3V0Iiwic3VidHJhY3QiLCJtdWwiLCJudW0iLCJtdWx0aXBseVNjYWxhciIsImRpdiIsInNjYWxlIiwibXVsdGlwbHkiLCJuZWciLCJuZWdhdGUiLCJjbG9uZSIsImEiLCJ4IiwieSIsInoiLCJ3IiwiY29weSIsInNldCIsImFkZCIsImIiLCJkaXZpZGUiLCJjZWlsIiwiTWF0aCIsImZsb29yIiwibWluIiwibWF4Iiwicm91bmQiLCJzY2FsZUFuZEFkZCIsImRpc3RhbmNlIiwic3FydCIsInNxdWFyZWREaXN0YW5jZSIsImxlbiIsImxlbmd0aFNxciIsImludmVyc2UiLCJpbnZlcnNlU2FmZSIsImFicyIsIkVQU0lMT04iLCJub3JtYWxpemUiLCJkb3QiLCJsZXJwIiwidCIsInJhbmRvbSIsInBoaSIsIlBJIiwiY29zVGhldGEiLCJzaW5UaGV0YSIsImNvcyIsInNpbiIsInRyYW5zZm9ybU1hdDQiLCJtYXQiLCJtIiwidHJhbnNmb3JtQWZmaW5lIiwidiIsInRyYW5zZm9ybVF1YXQiLCJxIiwiaXgiLCJpeSIsIml6IiwiaXciLCJzdHJpY3RFcXVhbHMiLCJlcXVhbHMiLCJlcHNpbG9uIiwidG9BcnJheSIsIm9mcyIsImZyb21BcnJheSIsImFyciIsIm1hZyIsInByb3RvdHlwZSIsIm1hZ1NxciIsInN1YlNlbGYiLCJtdWxTZWxmIiwiZGl2U2VsZiIsInNjYWxlU2VsZiIsIm5lZ1NlbGYiLCJvdGhlciIsImVxdWFsczRmIiwic3RyaWN0RXF1YWxzNGYiLCJ0byIsInJhdGlvIiwidG9TdHJpbmciLCJ0b0ZpeGVkIiwiY2xhbXBmIiwibWluSW5jbHVzaXZlIiwibWF4SW5jbHVzaXZlIiwiYWRkU2VsZiIsImNyb3NzIiwiYXgiLCJheSIsImF6IiwiYngiLCJieSIsImJ6Iiwibm9ybWFsaXplU2VsZiIsIm1hdHJpeCIsIm1heEF4aXMiLCJWYWx1ZVR5cGUiLCJzcXVhcmVkTWFnbml0dWRlIiwiWkVST19SIiwiWkVSTyIsIk9ORV9SIiwiT05FIiwiTkVHX09ORV9SIiwiTkVHX09ORSIsIkNDQ2xhc3MiLCJmYXN0RGVmaW5lIiwidjQiLCJjYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkE7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7OztBQUVBLElBQUlBLEVBQVUsR0FBRyxHQUFqQjtBQUNBLElBQUlDLEVBQVUsR0FBRyxHQUFqQjtBQUNBLElBQUlDLEVBQVUsR0FBRyxHQUFqQjtBQUNBLElBQUlDLEVBQVUsR0FBRyxHQUFqQjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztJQUNxQkM7Ozs7O0FBQ2pCOztBQVNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtTQUNJQyxNQUFBLGFBQUtDLE1BQUwsRUFBbUJDLEdBQW5CLEVBQStCO0FBQzNCLFdBQU9ILElBQUksQ0FBQ0ksUUFBTCxDQUFjRCxHQUFHLElBQUksSUFBSUgsSUFBSixFQUFyQixFQUFpQyxJQUFqQyxFQUF1Q0UsTUFBdkMsQ0FBUDtBQUNIO0FBQ0Q7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtTQUNJRyxNQUFBLGFBQUtDLEdBQUwsRUFBa0JILEdBQWxCLEVBQThCO0FBQzFCLFdBQU9ILElBQUksQ0FBQ08sY0FBTCxDQUFvQkosR0FBRyxJQUFJLElBQUlILElBQUosRUFBM0IsRUFBdUMsSUFBdkMsRUFBNkNNLEdBQTdDLENBQVA7QUFDSDtBQUNEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7U0FDSUUsTUFBQSxhQUFL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OEdNb0csU0FBU3BHLElBQUksQ0FBQ3FHO0FBOUdwQnJHLEtBaUhNc0csUUFBUXRHLElBQUksQ0FBQ3VHO0FBakhuQnZHLEtBb0hNd0csWUFBWXhHLElBQUksQ0FBQ3lHOztBQTArQjVDQyxvQkFBUUMsVUFBUixDQUFtQixTQUFuQixFQUE4QjNHLElBQTlCLEVBQW9DO0FBQUVlLEVBQUFBLENBQUMsRUFBRSxDQUFMO0FBQVFDLEVBQUFBLENBQUMsRUFBRSxDQUFYO0FBQWNDLEVBQUFBLENBQUMsRUFBRSxDQUFqQjtBQUFvQkMsRUFBQUEsQ0FBQyxFQUFFO0FBQXZCLENBQXBDOztBQUtPLFNBQVMwRixFQUFULENBQWE3RixDQUFiLEVBQWdDQyxDQUFoQyxFQUE0Q0MsQ0FBNUMsRUFBd0RDLENBQXhELEVBQW9FO0FBQ3ZFLFNBQU8sSUFBSWxCLElBQUosQ0FBU2UsQ0FBVCxFQUFtQkMsQ0FBbkIsRUFBc0JDLENBQXRCLEVBQXlCQyxDQUF6QixDQUFQO0FBQ0g7O0FBRUQyRixFQUFFLENBQUNELEVBQUgsR0FBUUEsRUFBUjtBQUNBQyxFQUFFLENBQUM3RyxJQUFILEdBQVVBLElBQVYiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuIENvcHlyaWdodCAoYykgMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwOi8vd3d3LmNvY29zLmNvbVxuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiovXG5cbmltcG9ydCBDQ0NsYXNzIGZyb20gJy4uL3BsYXRmb3JtL0NDQ2xhc3MnO1xuaW1wb3J0IFZhbHVlVHlwZSBmcm9tICcuL3ZhbHVlLXR5cGUnO1xuaW1wb3J0IE1hdDQgZnJvbSAnLi9tYXQ0JztcbmltcG9ydCB7IGNsYW1wLCBFUFNJTE9OLCByYW5kb20gfSBmcm9tICcuL3V0aWxzJztcblxubGV0IF94OiBudW1iZXIgPSAwLjA7XG5sZXQgX3k6IG51bWJlciA9IDAuMDtcbmxldCBfejogbnVtYmVyID0gMC4wO1xubGV0IF93OiBudW1iZXIgPSAwLjA7XG5cbi8qKlxuICogISNlbiBSZXByZXNlbnRhdGlvbiBvZiAzRCB2ZWN0b3JzIGFuZCBwb2ludHMuXG4gKiAhI3poIOihqOekuiAzRCDlkJHph4/lkozlnZDmoIdcbiAqXG4gKiBAY2xhc3MgVmVjNFxuICogQGV4dGVuZHMgVmFsdWVUeXBlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZlYzQgZXh0ZW5kcyBWYWx1ZVR5cGUge1xuICAgIC8vIGRlcHJlY2F0ZWRcbiAgICBwdWJsaWMgc3RhdGljIHN1YiAgID0gVmVjNC5zdWJ0cmFjdDtcbiAgICBwdWJsaWMgc3RhdGljIG11bCAgID0gVmVjNC5tdWx0aXBseTtcbiAgICBwdWJsaWMgc3RhdGljIGRpdiA9IFZlYzQuZGl2aWRlO1xuICAgIHB1YmxpYyBzdGF0aWMgc2NhbGUgPSBWZWM0Lm11bHRpcGx5U2NhbGFyO1xuICAgIHB1YmxpYyBzdGF0aWMgbWFnICAgPSBWZWM0LmxlbjtcbiAgICBwdWJsaWMgc3RhdGljIHNxdWFyZWRNYWduaXR1ZGUgPSBWZWM0Lmxlbmd0aFNxcjtcbiAgICBtYWcgID0gVmVjNC5wcm90b3R5cGUubGVuO1xuICAgIG1hZ1NxciA9IFZlYzQucHJvdG90eXBlLmxlbmd0aFNxcjtcbiAgICAvKipcbiAgICAgKiAhI2VuIFN1YnRyYWN0cyBvbmUgdmVjdG9yIGZyb20gdGhpcy4gSWYgeW91IHdhbnQgdG8gc2F2ZSByZXN1bHQgdG8gYW5vdGhlciB2ZWN0b3IsIHVzZSBzdWIoKSBpbnN0ZWFkLlxuICAgICAqICEjemgg5ZCR6YeP5YeP5rOV44CC5aaC5p6c5L2g5oOz5L+d5a2Y57uT5p6c5Yiw5Y+m5LiA5Liq5ZCR6YeP77yM5Y+v5L2/55SoIHN1YigpIOS7o+abv+OAglxuICAgICAqIEBtZXRob2Qgc3ViU2VsZlxuICAgICAqIEBwYXJhbSB7VmVjNH0gdmVjdG9yXG4gICAgICogQHJldHVybiB7VmVjNH0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIHN1YlNlbGYgID0gVmVjNC5wcm90b3R5cGUuc3VidHJhY3Q7XG4gICAgLyoqXG4gICAgICogISNlbiBTdWJ0cmFjdHMgb25lIHZlY3RvciBmcm9tIHRoaXMsIGFuZCByZXR1cm5zIHRoZSBuZXcgcmVzdWx0LlxuICAgICAqICEjemgg5ZCR6YeP5YeP5rOV77yM5bm26L+U5Zue5paw57uT5p6c44CCXG4gICAgICogQG1ldGhvZCBzdWJcbiAgICAgKiBAcGFyYW0ge1ZlYzR9IHZlY3RvclxuICAgICAqIEBwYXJhbSB7VmVjNH0gW291dF0gLSBvcHRpb25hbCwgdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWM0IHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWM0IHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm4ge1ZlYzR9IHRoZSByZXN1bHRcbiAgICAgKi9cbiAgICBzdWIgKHZlY3RvcjogVmVjNCwgb3V0PzogVmVjNCkge1xuICAgICAgICByZXR1cm4gVmVjNC5zdWJ0cmFjdChvdXQgfHwgbmV3IFZlYzQoKSwgdGhpcywgdmVjdG9yKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogISNlbiBNdWx0aXBsaWVzIHRoaXMgYnkgYSBudW1iZXIuIElmIHlvdSB3YW50IHRvIHNhdmUgcmVzdWx0IHRvIGFub3RoZXIgdmVjdG9yLCB1c2UgbXVsKCkgaW5zdGVhZC5cbiAgICAgKiAhI3poIOe8qeaUvuW9k+WJjeWQkemHj+OAguWmguaenOS9oOaDs+e7k+aenOS/neWtmOWIsOWPpuS4gOS4quWQkemHj++8jOWPr+S9v+eUqCBtdWwoKSDku6Pmm7/jgIJcbiAgICAgKiBAbWV0aG9kIG11bFNlbGZcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtXG4gICAgICogQHJldHVybiB7VmVjNH0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIG11bFNlbGYgID0gVmVjNC5wcm90b3R5cGUubXVsdGlwbHlTY2FsYXI7XG4gICAgLyoqXG4gICAgICogISNlbiBNdWx0aXBsaWVzIGJ5IGEgbnVtYmVyLCBhbmQgcmV0dXJucyB0aGUgbmV3IHJlc3VsdC5cbiAgICAgKiAhI3poIOe8qeaUvuWQkemHj++8jOW5tui/lOWbnuaWsOe7k+aenOOAglxuICAgICAqIEBtZXRob2QgbXVsXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bVxuICAgICAqIEBwYXJhbSB7VmVjNH0gW291dF0gLSBvcHRpb25hbCwgdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWM0IHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWM0IHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm4ge1ZlYzR9IHRoZSByZXN1bHRcbiAgICAgKi9cbiAgICBtdWwgKG51bTogbnVtYmVyLCBvdXQ/OiBWZWM0KSB7XG4gICAgICAgIHJldHVybiBWZWM0Lm11bHRpcGx5U2NhbGFyKG91dCB8fCBuZXcgVmVjNCgpLCB0aGlzLCBudW0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiAhI2VuIERpdmlkZXMgYnkgYSBudW1iZXIuIElmIHlvdSB3YW50IHRvIHNhdmUgcmVzdWx0IHRvIGFub3RoZXIgdmVjdG9yLCB1c2UgZGl2KCkgaW5zdGVhZC5cbiAgICAgKiAhI3poIOWQkemHj+mZpOazleOAguWmguaenOS9oOaDs+e7k+aenOS/neWtmOWIsOWPpuS4gOS4quWQkemHj++8jOWPr+S9v+eUqCBkaXYoKSDku6Pmm7/jgIJcbiAgICAgKiBAbWV0aG9kIGRpdlNlbGZcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtXG4gICAgICogQHJldHVybiB7VmVjNH0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIGRpdlNlbGYgID0gVmVjNC5wcm90b3R5cGUuZGl2aWRlO1xuICAgIC8qKlxuICAgICAqICEjZW4gRGl2aWRlcyBieSBhIG51bWJlciwgYW5kIHJldHVybnMgdGhlIG5ldyByZXN1bHQuXG4gICAgICogISN6aCDlkJHph4/pmaTms5XvvIzlubbov5Tlm57mlrDnmoTnu5PmnpzjgIJcbiAgICAgKiBAbWV0aG9kIGRpdlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAgICAgKiBAcGFyYW0ge1ZlYzR9IFtvdXRdIC0gb3B0aW9uYWwsIHRoZSByZWNlaXZpbmcgdmVjdG9yLCB5b3UgY2FuIHBhc3MgdGhlIHNhbWUgdmVjNCB0byBzYXZlIHJlc3VsdCB0byBpdHNlbGYsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgdmVjNCB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJuIHtWZWM0fSB0aGUgcmVzdWx0XG4gICAgICovXG4gICAgZGl2IChudW06IG51bWJlciwgb3V0PzogVmVjNCk6IFZlYzQge1xuICAgICAgICByZXR1cm4gVmVjNC5tdWx0aXBseVNjYWxhcihvdXQgfHwgbmV3IFZlYzQoKSwgdGhpcywgMS9udW0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiAhI2VuIE11bHRpcGxpZXMgdHdvIHZlY3RvcnMuXG4gICAgICogISN6aCDliIbph4/nm7jkuZjjgIJcbiAgICAgKiBAbWV0aG9kIHNjYWxlU2VsZlxuICAgICAqIEBwYXJhbSB7VmVjNH0gdmVjdG9yXG4gICAgICogQHJldHVybiB7VmVjNH0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIHNjYWxlU2VsZiA9IFZlYzQucHJvdG90eXBlLm11bHRpcGx5O1xuICAgIC8qKlxuICAgICAqICEjZW4gTXVsdGlwbGllcyB0d28gdmVjdG9ycywgYW5kIHJldHVybnMgdGhlIG5ldyByZXN1bHQuXG4gICAgICogISN6aCDliIbph4/nm7jkuZjvvIzlubbov5Tlm57mlrDnmoTnu5PmnpzjgIJcbiAgICAgKiBAbWV0aG9kIHNjYWxlXG4gICAgICogQHBhcmFtIHtWZWM0fSB2ZWN0b3JcbiAgICAgKiBAcGFyYW0ge1ZlYzR9IFtvdXRdIC0gb3B0aW9uYWwsIHRoZSByZWNlaXZpbmcgdmVjdG9yLCB5b3UgY2FuIHBhc3MgdGhlIHNhbWUgdmVjNCB0byBzYXZlIHJlc3VsdCB0byBpdHNlbGYsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgdmVjNCB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJuIHtWZWM0fSB0aGUgcmVzdWx0XG4gICAgICovXG4gICAgc2NhbGUgKHZlY3RvcjogVmVjNCwgb3V0PzogVmVjNCkge1xuICAgICAgICByZXR1cm4gVmVjNC5tdWx0aXBseShvdXQgfHwgbmV3IFZlYzQoKSwgdGhpcywgdmVjdG9yKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogISNlbiBOZWdhdGVzIHRoZSBjb21wb25lbnRzLiBJZiB5b3Ugd2FudCB0byBzYXZlIHJlc3VsdCB0byBhbm90aGVyIHZlY3RvciwgdXNlIG5lZygpIGluc3RlYWQuXG4gICAgICogISN6aCDlkJHph4/lj5blj43jgILlpoLmnpzkvaDmg7Pnu5Pmnpzkv53lrZjliLDlj6bkuIDkuKrlkJHph4/vvIzlj6/kvb/nlKggbmVnKCkg5Luj5pu/44CCXG4gICAgICogQG1ldGhvZCBuZWdTZWxmXG4gICAgICogQHJldHVybiB7VmVjNH0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIG5lZ1NlbGYgPSBWZWM0LnByb3RvdHlwZS5uZWdhdGU7XG4gICAgLyoqXG4gICAgICogISNlbiBOZWdhdGVzIHRoZSBjb21wb25lbnRzLCBhbmQgcmV0dXJucyB0aGUgbmV3IHJlc3VsdC5cbiAgICAgKiAhI3poIOi/lOWbnuWPluWPjeWQjueahOaWsOWQkemHj+OAglxuICAgICAqIEBtZXRob2QgbmVnXG4gICAgICogQHBhcmFtIHtWZWM0fSBbb3V0XSAtIG9wdGlvbmFsLCB0aGUgcmVjZWl2aW5nIHZlY3RvciwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIHZlYzQgdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IHZlYzQgd2lsbCBiZSBjcmVhdGVkXG4gICAgICogQHJldHVybiB7VmVjNH0gdGhlIHJlc3VsdFxuICAgICAqL1xuICAgIG5lZyAob3V0PzogVmVjNCkge1xuICAgICAgICByZXR1cm4gVmVjNC5uZWdhdGUob3V0IHx8IG5ldyBWZWM0KCksIHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFpFUk8gKCkgeyByZXR1cm4gbmV3IFZlYzQoMCwgMCwgMCwgMCk7IH1cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFpFUk9fUiA9IFZlYzQuWkVSTztcblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IE9ORSAoKSB7IHJldHVybiBuZXcgVmVjNCgxLCAxLCAxLCAxKTsgfVxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgT05FX1IgPSBWZWM0Lk9ORTtcblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IE5FR19PTkUgKCkgeyByZXR1cm4gbmV3IFZlYzQoLTEsIC0xLCAtMSwgLTEpOyB9XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBORUdfT05FX1IgPSBWZWM0Lk5FR19PTkU7XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiOt+W+l+aMh+WumuWQkemHj+eahOaLt+i0nVxuICAgICAqICEjZW4gT2J0YWluaW5nIGNvcHkgdmVjdG9ycyBkZXNpZ25hdGVkXG4gICAgICogQG1ldGhvZCBjbG9uZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogY2xvbmUgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKGE6IE91dCk6IFZlYzRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjbG9uZSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0KSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjNChhLngsIGEueSwgYS56LCBhLncpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5aSN5Yi255uu5qCH5ZCR6YePXG4gICAgICogISNlbiBDb3B5IHRoZSB0YXJnZXQgdmVjdG9yXG4gICAgICogQG1ldGhvZCBjb3B5XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBjb3B5IDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0KTogT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY29weSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xuICAgICAgICBvdXQueCA9IGEueDtcbiAgICAgICAgb3V0LnkgPSBhLnk7XG4gICAgICAgIG91dC56ID0gYS56O1xuICAgICAgICBvdXQudyA9IGEudztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiuvue9ruWQkemHj+WAvFxuICAgICAqICEjZW4gU2V0IHRvIHZhbHVlXG4gICAgICogQG1ldGhvZCBzZXRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHNldCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHc6IG51bWJlcik6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNldCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHc6IG51bWJlcikge1xuICAgICAgICBvdXQueCA9IHg7XG4gICAgICAgIG91dC55ID0geTtcbiAgICAgICAgb3V0LnogPSB6O1xuICAgICAgICBvdXQudyA9IHc7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/liqDms5VcbiAgICAgKiAhI2VuIEVsZW1lbnQtd2lzZSB2ZWN0b3IgYWRkaXRpb25cbiAgICAgKiBAbWV0aG9kIGFkZFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogYWRkIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhZGQgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBvdXQueCA9IGEueCArIGIueDtcbiAgICAgICAgb3V0LnkgPSBhLnkgKyBiLnk7XG4gICAgICAgIG91dC56ID0gYS56ICsgYi56O1xuICAgICAgICBvdXQudyA9IGEudyArIGIudztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+WHj+azlVxuICAgICAqICEjZW4gRWxlbWVudC13aXNlIHZlY3RvciBzdWJ0cmFjdGlvblxuICAgICAqIEBtZXRob2Qgc3VidHJhY3RcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN1YnRyYWN0IDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzdWJ0cmFjdCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIG91dC54ID0gYS54IC0gYi54O1xuICAgICAgICBvdXQueSA9IGEueSAtIGIueTtcbiAgICAgICAgb3V0LnogPSBhLnogLSBiLno7XG4gICAgICAgIG91dC53ID0gYS53IC0gYi53O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5LmY5rOVXG4gICAgICogISNlbiBFbGVtZW50LXdpc2UgdmVjdG9yIG11bHRpcGxpY2F0aW9uXG4gICAgICogQG1ldGhvZCBtdWx0aXBseVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbXVsdGlwbHkgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCk6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIG11bHRpcGx5IDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSBhLnggKiBiLng7XG4gICAgICAgIG91dC55ID0gYS55ICogYi55O1xuICAgICAgICBvdXQueiA9IGEueiAqIGIuejtcbiAgICAgICAgb3V0LncgPSBhLncgKiBiLnc7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/pmaTms5VcbiAgICAgKiAhI2VuIEVsZW1lbnQtd2lzZSB2ZWN0b3IgZGl2aXNpb25cbiAgICAgKiBAbWV0aG9kIGRpdmlkZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZGl2aWRlIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBkaXZpZGUgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBvdXQueCA9IGEueCAvIGIueDtcbiAgICAgICAgb3V0LnkgPSBhLnkgLyBiLnk7XG4gICAgICAgIG91dC56ID0gYS56IC8gYi56O1xuICAgICAgICBvdXQudyA9IGEudyAvIGIudztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+WQkeS4iuWPluaVtFxuICAgICAqICEjZW4gUm91bmRpbmcgdXAgYnkgZWxlbWVudHMgb2YgdGhlIHZlY3RvclxuICAgICAqIEBtZXRob2QgY2VpbFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogY2VpbCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCk6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGNlaWwgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSBNYXRoLmNlaWwoYS54KTtcbiAgICAgICAgb3V0LnkgPSBNYXRoLmNlaWwoYS55KTtcbiAgICAgICAgb3V0LnogPSBNYXRoLmNlaWwoYS56KTtcbiAgICAgICAgb3V0LncgPSBNYXRoLmNlaWwoYS53KTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+WQkeS4i+WPluaVtFxuICAgICAqICEjZW4gRWxlbWVudCB2ZWN0b3IgYnkgcm91bmRpbmcgZG93blxuICAgICAqIEBtZXRob2QgZmxvb3JcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGZsb29yIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0KTogT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZmxvb3IgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSBNYXRoLmZsb29yKGEueCk7XG4gICAgICAgIG91dC55ID0gTWF0aC5mbG9vcihhLnkpO1xuICAgICAgICBvdXQueiA9IE1hdGguZmxvb3IoYS56KTtcbiAgICAgICAgb3V0LncgPSBNYXRoLmZsb29yKGEudyk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/mnIDlsI/lgLxcbiAgICAgKiAhI2VuIFRoZSBtaW5pbXVtIGJ5LWVsZW1lbnQgdmVjdG9yXG4gICAgICogQG1ldGhvZCBtaW5cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG1pbiA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KTogT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgbWluIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSBNYXRoLm1pbihhLngsIGIueCk7XG4gICAgICAgIG91dC55ID0gTWF0aC5taW4oYS55LCBiLnkpO1xuICAgICAgICBvdXQueiA9IE1hdGgubWluKGEueiwgYi56KTtcbiAgICAgICAgb3V0LncgPSBNYXRoLm1pbihhLncsIGIudyk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/mnIDlpKflgLxcbiAgICAgKiAhI2VuIFRoZSBtYXhpbXVtIHZhbHVlIG9mIHRoZSBlbGVtZW50LXdpc2UgdmVjdG9yXG4gICAgICogQG1ldGhvZCBtYXhcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG1heCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KTogT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgbWF4IDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSBNYXRoLm1heChhLngsIGIueCk7XG4gICAgICAgIG91dC55ID0gTWF0aC5tYXgoYS55LCBiLnkpO1xuICAgICAgICBvdXQueiA9IE1hdGgubWF4KGEueiwgYi56KTtcbiAgICAgICAgb3V0LncgPSBNYXRoLm1heChhLncsIGIudyk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/lm5voiI3kupTlhaXlj5bmlbRcbiAgICAgKiAhI2VuIEVsZW1lbnQtd2lzZSB2ZWN0b3Igb2Ygcm91bmRpbmcgdG8gd2hvbGVcbiAgICAgKiBAbWV0aG9kIHJvdW5kXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiByb3VuZCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCk6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJvdW5kIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XG4gICAgICAgIG91dC54ID0gTWF0aC5yb3VuZChhLngpO1xuICAgICAgICBvdXQueSA9IE1hdGgucm91bmQoYS55KTtcbiAgICAgICAgb3V0LnogPSBNYXRoLnJvdW5kKGEueik7XG4gICAgICAgIG91dC53ID0gTWF0aC5yb3VuZChhLncpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5ZCR6YeP5qCH6YeP5LmY5rOVXG4gICAgICogISNlbiBWZWN0b3Igc2NhbGFyIG11bHRpcGxpY2F0aW9uXG4gICAgICogQG1ldGhvZCBtdWx0aXBseVNjYWxhclxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbXVsdGlwbHlTY2FsYXIgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IG51bWJlcik6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIG11bHRpcGx5U2NhbGFyIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBudW1iZXIpIHtcbiAgICAgICAgb3V0LnggPSBhLnggKiBiO1xuICAgICAgICBvdXQueSA9IGEueSAqIGI7XG4gICAgICAgIG91dC56ID0gYS56ICogYjtcbiAgICAgICAgb3V0LncgPSBhLncgKiBiO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5LmY5YqgOiBBICsgQiAqIHNjYWxlXG4gICAgICogISNlbiBFbGVtZW50LXdpc2UgdmVjdG9yIG11bHRpcGx5IGFkZDogQSArIEIgKiBzY2FsZVxuICAgICAqIEBtZXRob2Qgc2NhbGVBbmRBZGRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHNjYWxlQW5kQWRkIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQsIHNjYWxlOiBudW1iZXIpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzY2FsZUFuZEFkZCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0LCBzY2FsZTogbnVtYmVyKSB7XG4gICAgICAgIG91dC54ID0gYS54ICsgKGIueCAqIHNjYWxlKTtcbiAgICAgICAgb3V0LnkgPSBhLnkgKyAoYi55ICogc2NhbGUpO1xuICAgICAgICBvdXQueiA9IGEueiArIChiLnogKiBzY2FsZSk7XG4gICAgICAgIG91dC53ID0gYS53ICsgKGIudyAqIHNjYWxlKTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOaxguS4pOWQkemHj+eahOasp+awj+i3neemu1xuICAgICAqICEjZW4gU2Vla2luZyB0d28gdmVjdG9ycyBFdWNsaWRlYW4gZGlzdGFuY2VcbiAgICAgKiBAbWV0aG9kIGRpc3RhbmNlXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBkaXN0YW5jZSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0LCBiOiBPdXQpOiBudW1iZXJcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBkaXN0YW5jZSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgY29uc3QgeCA9IGIueCAtIGEueDtcbiAgICAgICAgY29uc3QgeSA9IGIueSAtIGEueTtcbiAgICAgICAgY29uc3QgeiA9IGIueiAtIGEuejtcbiAgICAgICAgY29uc3QgdyA9IGIudyAtIGEudztcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHogKyB3ICogdyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmsYLkuKTlkJHph4/nmoTmrKfmsI/ot53nprvlubPmlrlcbiAgICAgKiAhI2VuIEV1Y2xpZGVhbiBkaXN0YW5jZSBzcXVhcmVkIHNlZWtpbmcgdHdvIHZlY3RvcnNcbiAgICAgKiBAbWV0aG9kIHNxdWFyZWREaXN0YW5jZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3F1YXJlZERpc3RhbmNlIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChhOiBPdXQsIGI6IE91dCk6IG51bWJlclxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNxdWFyZWREaXN0YW5jZSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgY29uc3QgeCA9IGIueCAtIGEueDtcbiAgICAgICAgY29uc3QgeSA9IGIueSAtIGEueTtcbiAgICAgICAgY29uc3QgeiA9IGIueiAtIGEuejtcbiAgICAgICAgY29uc3QgdyA9IGIudyAtIGEudztcbiAgICAgICAgcmV0dXJuIHggKiB4ICsgeSAqIHkgKyB6ICogeiArIHcgKiB3O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5rGC5ZCR6YeP6ZW/5bqmXG4gICAgICogISNlbiBTZWVraW5nIHZlY3RvciBsZW5ndGhcbiAgICAgKiBAbWV0aG9kIGxlblxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbGVuIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChhOiBPdXQpOiBudW1iZXJcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBsZW4gPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKGE6IE91dCkge1xuICAgICAgICBfeCA9IGEueDtcbiAgICAgICAgX3kgPSBhLnk7XG4gICAgICAgIF96ID0gYS56O1xuICAgICAgICBfdyA9IGEudztcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChfeCAqIF94ICsgX3kgKiBfeSArIF96ICogX3ogKyBfdyAqIF93KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOaxguWQkemHj+mVv+W6puW5s+aWuVxuICAgICAqICEjZW4gU2Vla2luZyBzcXVhcmVkIHZlY3RvciBsZW5ndGhcbiAgICAgKiBAbWV0aG9kIGxlbmd0aFNxclxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbGVuZ3RoU3FyIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChhOiBPdXQpOiBudW1iZXJcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBsZW5ndGhTcXIgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKGE6IE91dCkge1xuICAgICAgICBfeCA9IGEueDtcbiAgICAgICAgX3kgPSBhLnk7XG4gICAgICAgIF96ID0gYS56O1xuICAgICAgICBfdyA9IGEudztcbiAgICAgICAgcmV0dXJuIF94ICogX3ggKyBfeSAqIF95ICsgX3ogKiBfeiArIF93ICogX3c7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/lj5botJ9cbiAgICAgKiAhI2VuIEJ5IHRha2luZyB0aGUgbmVnYXRpdmUgZWxlbWVudHMgb2YgdGhlIHZlY3RvclxuICAgICAqIEBtZXRob2QgbmVnYXRlXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBuZWdhdGUgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBuZWdhdGUgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSAtYS54O1xuICAgICAgICBvdXQueSA9IC1hLnk7XG4gICAgICAgIG91dC56ID0gLWEuejtcbiAgICAgICAgb3V0LncgPSAtYS53O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5Y+W5YCS5pWw77yM5o6l6L+RIDAg5pe26L+U5ZueIEluZmluaXR5XG4gICAgICogISNlbiBFbGVtZW50IHZlY3RvciBieSB0YWtpbmcgdGhlIGludmVyc2UsIHJldHVybiBuZWFyIDAgSW5maW5pdHlcbiAgICAgKiBAbWV0aG9kIGludmVyc2VcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGludmVyc2UgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBpbnZlcnNlIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XG4gICAgICAgIG91dC54ID0gMS4wIC8gYS54O1xuICAgICAgICBvdXQueSA9IDEuMCAvIGEueTtcbiAgICAgICAgb3V0LnogPSAxLjAgLyBhLno7XG4gICAgICAgIG91dC53ID0gMS4wIC8gYS53O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5Y+W5YCS5pWw77yM5o6l6L+RIDAg5pe26L+U5ZueIDBcbiAgICAgKiAhI2VuIEVsZW1lbnQgdmVjdG9yIGJ5IHRha2luZyB0aGUgaW52ZXJzZSwgcmV0dXJuIG5lYXIgMCAwXG4gICAgICogQG1ldGhvZCBpbnZlcnNlU2FmZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogaW52ZXJzZVNhZmUgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBpbnZlcnNlU2FmZSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xuICAgICAgICBfeCA9IGEueDtcbiAgICAgICAgX3kgPSBhLnk7XG4gICAgICAgIF96ID0gYS56O1xuICAgICAgICBfdyA9IGEudztcblxuICAgICAgICBpZiAoTWF0aC5hYnMoX3gpIDwgRVBTSUxPTikge1xuICAgICAgICAgICAgb3V0LnggPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0LnggPSAxLjAgLyBfeDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChNYXRoLmFicyhfeSkgPCBFUFNJTE9OKSB7XG4gICAgICAgICAgICBvdXQueSA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXQueSA9IDEuMCAvIF95O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKE1hdGguYWJzKF96KSA8IEVQU0lMT04pIHtcbiAgICAgICAgICAgIG91dC56ID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dC56ID0gMS4wIC8gX3o7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoTWF0aC5hYnMoX3cpIDwgRVBTSUxPTikge1xuICAgICAgICAgICAgb3V0LncgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0LncgPSAxLjAgLyBfdztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlvZLkuIDljJblkJHph49cbiAgICAgKiAhI2VuIE5vcm1hbGl6ZWQgdmVjdG9yXG4gICAgICogQG1ldGhvZCBub3JtYWxpemVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG5vcm1hbGl6ZSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCk6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIG5vcm1hbGl6ZSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xuICAgICAgICBfeCA9IGEueDtcbiAgICAgICAgX3kgPSBhLnk7XG4gICAgICAgIF96ID0gYS56O1xuICAgICAgICBfdyA9IGEudztcbiAgICAgICAgbGV0IGxlbiA9IF94ICogX3ggKyBfeSAqIF95ICsgX3ogKiBfeiArIF93ICogX3c7XG4gICAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgICAgICBsZW4gPSAxIC8gTWF0aC5zcXJ0KGxlbik7XG4gICAgICAgICAgICBvdXQueCA9IF94ICogbGVuO1xuICAgICAgICAgICAgb3V0LnkgPSBfeSAqIGxlbjtcbiAgICAgICAgICAgIG91dC56ID0gX3ogKiBsZW47XG4gICAgICAgICAgICBvdXQudyA9IF93ICogbGVuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlkJHph4/ngrnnp6/vvIjmlbDph4/np6/vvIlcbiAgICAgKiAhI2VuIFZlY3RvciBkb3QgcHJvZHVjdCAoc2NhbGFyIHByb2R1Y3QpXG4gICAgICogQG1ldGhvZCBkb3RcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGRvdCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0LCBiOiBPdXQpOiBudW1iZXJcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBkb3QgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIHJldHVybiBhLnggKiBiLnggKyBhLnkgKiBiLnkgKyBhLnogKiBiLnogKyBhLncgKiBiLnc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/nur/mgKfmj5LlgLzvvJogQSArIHQgKiAoQiAtIEEpXG4gICAgICogISNlbiBWZWN0b3IgZWxlbWVudCBieSBlbGVtZW50IGxpbmVhciBpbnRlcnBvbGF0aW9uOiBBICsgdCAqIChCIC0gQSlcbiAgICAgKiBAbWV0aG9kIGxlcnBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGxlcnAgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCwgdDogbnVtYmVyKTogT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgbGVycCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0LCB0OiBudW1iZXIpIHtcbiAgICAgICAgb3V0LnggPSBhLnggKyB0ICogKGIueCAtIGEueCk7XG4gICAgICAgIG91dC55ID0gYS55ICsgdCAqIChiLnkgLSBhLnkpO1xuICAgICAgICBvdXQueiA9IGEueiArIHQgKiAoYi56IC0gYS56KTtcbiAgICAgICAgb3V0LncgPSBhLncgKyB0ICogKGIudyAtIGEudyk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDnlJ/miJDkuIDkuKrlnKjljZXkvY3nkIPkvZPkuIrlnYfljIDliIbluIPnmoTpmo/mnLrlkJHph49cbiAgICAgKiAhI2VuIEdlbmVyYXRlcyBhIHVuaWZvcm1seSBkaXN0cmlidXRlZCByYW5kb20gdmVjdG9ycyBvbiB0aGUgdW5pdCBzcGhlcmVcbiAgICAgKiBAbWV0aG9kIHJhbmRvbVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcmFuZG9tIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgc2NhbGU/OiBudW1iZXIpOiBPdXRcbiAgICAgKiBAcGFyYW0gc2NhbGUg55Sf5oiQ55qE5ZCR6YeP6ZW/5bqmXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmFuZG9tIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgc2NhbGU/OiBudW1iZXIpIHtcbiAgICAgICAgc2NhbGUgPSBzY2FsZSB8fCAxLjA7XG5cbiAgICAgICAgY29uc3QgcGhpID0gcmFuZG9tKCkgKiAyLjAgKiBNYXRoLlBJO1xuICAgICAgICBjb25zdCBjb3NUaGV0YSA9IHJhbmRvbSgpICogMiAtIDE7XG4gICAgICAgIGNvbnN0IHNpblRoZXRhID0gTWF0aC5zcXJ0KDEgLSBjb3NUaGV0YSAqIGNvc1RoZXRhKTtcblxuICAgICAgICBvdXQueCA9IHNpblRoZXRhICogTWF0aC5jb3MocGhpKSAqIHNjYWxlO1xuICAgICAgICBvdXQueSA9IHNpblRoZXRhICogTWF0aC5zaW4ocGhpKSAqIHNjYWxlO1xuICAgICAgICBvdXQueiA9IGNvc1RoZXRhICogc2NhbGU7XG4gICAgICAgIG91dC53ID0gMDtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWQkemHj+efqemYteS5mOazlVxuICAgICAqICEjZW4gVmVjdG9yIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxuICAgICAqIEBtZXRob2QgdHJhbnNmb3JtTWF0NFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogdHJhbnNmb3JtTWF0NCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlLCBNYXRMaWtlIGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgbWF0OiBNYXRMaWtlKTogT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgdHJhbnNmb3JtTWF0NCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlLCBNYXRMaWtlIGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgbWF0OiBNYXRMaWtlKSB7XG4gICAgICAgIF94ID0gYS54O1xuICAgICAgICBfeSA9IGEueTtcbiAgICAgICAgX3ogPSBhLno7XG4gICAgICAgIF93ID0gYS53O1xuICAgICAgICBsZXQgbSA9IG1hdC5tO1xuICAgICAgICBvdXQueCA9IG1bMF0gKiBfeCArIG1bNF0gKiBfeSArIG1bOF0gICogX3ogKyBtWzEyXSAqIF93O1xuICAgICAgICBvdXQueSA9IG1bMV0gKiBfeCArIG1bNV0gKiBfeSArIG1bOV0gICogX3ogKyBtWzEzXSAqIF93O1xuICAgICAgICBvdXQueiA9IG1bMl0gKiBfeCArIG1bNl0gKiBfeSArIG1bMTBdICogX3ogKyBtWzE0XSAqIF93O1xuICAgICAgICBvdXQudyA9IG1bM10gKiBfeCArIG1bN10gKiBfeSArIG1bMTFdICogX3ogKyBtWzE1XSAqIF93O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5ZCR6YeP5Lu/5bCE5Y+Y5o2iXG4gICAgICogISNlbiBBZmZpbmUgdHJhbnNmb3JtYXRpb24gdmVjdG9yXG4gICAgICogQG1ldGhvZCB0cmFuc2Zvcm1BZmZpbmVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHRyYW5zZm9ybUFmZmluZTxPdXQgZXh0ZW5kcyBJVmVjNExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjNExpa2UsIE1hdExpa2UgZXh0ZW5kcyBJTWF0NExpa2U+KG91dDogT3V0LCB2OiBWZWNMaWtlLCBtYXQ6IE1hdExpa2UpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyB0cmFuc2Zvcm1BZmZpbmU8T3V0IGV4dGVuZHMgSVZlYzRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzRMaWtlLCBNYXRMaWtlIGV4dGVuZHMgSU1hdDRMaWtlPlxuICAgICAgICAob3V0OiBPdXQsIHY6IFZlY0xpa2UsIG1hdDogTWF0TGlrZSkge1xuICAgICAgICBfeCA9IHYueDtcbiAgICAgICAgX3kgPSB2Lnk7XG4gICAgICAgIF96ID0gdi56O1xuICAgICAgICBfdyA9IHYudztcbiAgICAgICAgbGV0IG0gPSBtYXQubTtcbiAgICAgICAgb3V0LnggPSBtWzBdICogX3ggKyBtWzFdICogX3kgKyBtWzJdICAqIF96ICsgbVszXSAqIF93O1xuICAgICAgICBvdXQueSA9IG1bNF0gKiBfeCArIG1bNV0gKiBfeSArIG1bNl0gICogX3ogKyBtWzddICogX3c7XG4gICAgICAgIG91dC54ID0gbVs4XSAqIF94ICsgbVs5XSAqIF95ICsgbVsxMF0gKiBfeiArIG1bMTFdICogX3c7XG4gICAgICAgIG91dC53ID0gdi53O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5ZCR6YeP5Zub5YWD5pWw5LmY5rOVXG4gICAgICogISNlbiBWZWN0b3IgcXVhdGVybmlvbiBtdWx0aXBsaWNhdGlvblxuICAgICAqIEBtZXRob2QgdHJhbnNmb3JtUXVhdFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogdHJhbnNmb3JtUXVhdCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlLCBRdWF0TGlrZSBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHE6IFF1YXRMaWtlKTogT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgdHJhbnNmb3JtUXVhdCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlLCBRdWF0TGlrZSBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHE6IFF1YXRMaWtlKSB7XG4gICAgICAgIGNvbnN0IHsgeCwgeSwgeiB9ID0gYTtcblxuICAgICAgICBfeCA9IHEueDtcbiAgICAgICAgX3kgPSBxLnk7XG4gICAgICAgIF96ID0gcS56O1xuICAgICAgICBfdyA9IHEudztcblxuICAgICAgICAvLyBjYWxjdWxhdGUgcXVhdCAqIHZlY1xuICAgICAgICBjb25zdCBpeCA9IF93ICogeCArIF95ICogeiAtIF96ICogeTtcbiAgICAgICAgY29uc3QgaXkgPSBfdyAqIHkgKyBfeiAqIHggLSBfeCAqIHo7XG4gICAgICAgIGNvbnN0IGl6ID0gX3cgKiB6ICsgX3ggKiB5IC0gX3kgKiB4O1xuICAgICAgICBjb25zdCBpdyA9IC1feCAqIHggLSBfeSAqIHkgLSBfeiAqIHo7XG5cbiAgICAgICAgLy8gY2FsY3VsYXRlIHJlc3VsdCAqIGludmVyc2UgcXVhdFxuICAgICAgICBvdXQueCA9IGl4ICogX3cgKyBpdyAqIC1feCArIGl5ICogLV96IC0gaXogKiAtX3k7XG4gICAgICAgIG91dC55ID0gaXkgKiBfdyArIGl3ICogLV95ICsgaXogKiAtX3ggLSBpeCAqIC1fejtcbiAgICAgICAgb3V0LnogPSBpeiAqIF93ICsgaXcgKiAtX3ogKyBpeCAqIC1feSAtIGl5ICogLV94O1xuICAgICAgICBvdXQudyA9IGEudztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWQkemHj+etieS7t+WIpOaWrVxuICAgICAqICEjZW4gRXF1aXZhbGVudCB2ZWN0b3JzIEFuYWx5emluZ1xuICAgICAqIEBtZXRob2Qgc3RyaWN0RXF1YWxzXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdHJpY3RFcXVhbHMgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKGE6IE91dCwgYjogT3V0KTogYm9vbGVhblxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHN0cmljdEVxdWFscyA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgcmV0dXJuIGEueCA9PT0gYi54ICYmIGEueSA9PT0gYi55ICYmIGEueiA9PT0gYi56ICYmIGEudyA9PT0gYi53O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5o6S6Zmk5rWu54K55pWw6K+v5beu55qE5ZCR6YeP6L+R5Ly8562J5Lu35Yik5patXG4gICAgICogISNlbiBOZWdhdGl2ZSBlcnJvciB2ZWN0b3IgZmxvYXRpbmcgcG9pbnQgYXBwcm94aW1hdGVseSBlcXVpdmFsZW50IEFuYWx5emluZ1xuICAgICAqIEBtZXRob2QgZXF1YWxzXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBlcXVhbHMgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKGE6IE91dCwgYjogT3V0LCBlcHNpbG9uPzogbnVtYmVyKTogYm9vbGVhblxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGVxdWFscyA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0LCBiOiBPdXQsIGVwc2lsb24gPSBFUFNJTE9OKSB7XG4gICAgICAgIHJldHVybiAoTWF0aC5hYnMoYS54IC0gYi54KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLngpLCBNYXRoLmFicyhiLngpKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYS55IC0gYi55KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLnkpLCBNYXRoLmFicyhiLnkpKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYS56IC0gYi56KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLnopLCBNYXRoLmFicyhiLnopKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYS53IC0gYi53KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLncpLCBNYXRoLmFicyhiLncpKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlkJHph4/ovazmlbDnu4RcbiAgICAgKiAhI2VuIFZlY3RvciB0cmFuc2ZlciBhcnJheVxuICAgICAqIEBtZXRob2QgdG9BcnJheVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogdG9BcnJheSA8T3V0IGV4dGVuZHMgSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4+IChvdXQ6IE91dCwgdjogSVZlYzRMaWtlLCBvZnM/OiBudW1iZXIpOiBPdXRcbiAgICAgKiBAcGFyYW0gb2ZzIOaVsOe7hOi1t+Wni+WBj+enu+mHj1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHRvQXJyYXkgPE91dCBleHRlbmRzIElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+PiAob3V0OiBPdXQsIHY6IElWZWM0TGlrZSwgb2ZzID0gMCkge1xuICAgICAgICBvdXRbb2ZzICsgMF0gPSB2Lng7XG4gICAgICAgIG91dFtvZnMgKyAxXSA9IHYueTtcbiAgICAgICAgb3V0W29mcyArIDJdID0gdi56O1xuICAgICAgICBvdXRbb2ZzICsgM10gPSB2Lnc7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmlbDnu4TovazlkJHph49cbiAgICAgKiAhI2VuIEFycmF5IHN0ZWVyaW5nIGFtb3VudFxuICAgICAqIEBtZXRob2QgZnJvbUFycmF5XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBmcm9tQXJyYXkgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhcnI6IElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+LCBvZnM/OiBudW1iZXIpOiBPdXRcbiAgICAgKiBAcGFyYW0gb2ZzIOaVsOe7hOi1t+Wni+WBj+enu+mHj1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGZyb21BcnJheSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGFycjogSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4sIG9mcyA9IDApIHtcbiAgICAgICAgb3V0LnggPSBhcnJbb2ZzICsgMF07XG4gICAgICAgIG91dC55ID0gYXJyW29mcyArIDFdO1xuICAgICAgICBvdXQueiA9IGFycltvZnMgKyAyXTtcbiAgICAgICAgb3V0LncgPSBhcnJbb2ZzICsgM107XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHhcbiAgICAgKi9cbiAgICBwdWJsaWMgeDogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHlcbiAgICAgKi9cbiAgICBwdWJsaWMgeTogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHpcbiAgICAgKi9cbiAgICBwdWJsaWMgejogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHdcbiAgICAgKi9cbiAgICBwdWJsaWMgdzogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIENvbnN0cnVjdG9yXG4gICAgICogc2VlIHt7I2Nyb3NzTGluayBcImNjL3ZlYzQ6bWV0aG9kXCJ9fWNjLnY0e3svY3Jvc3NMaW5rfX1cbiAgICAgKiAhI3poXG4gICAgICog5p6E6YCg5Ye95pWw77yM5Y+v5p+l55yLIHt7I2Nyb3NzTGluayBcImNjL3ZlYzQ6bWV0aG9kXCJ9fWNjLnY0e3svY3Jvc3NMaW5rfX1cbiAgICAgKiBAbWV0aG9kIGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt4PTBdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt5PTBdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt6PTBdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt3PTBdXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKHg6IG51bWJlciB8IFZlYzQgPSAwLCB5OiBudW1iZXIgPSAwLCB6OiBudW1iZXIgPSAwLCB3OiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGlmICh4ICYmIHR5cGVvZiB4ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGhpcy54ID0geC54O1xuICAgICAgICAgICAgdGhpcy55ID0geC55O1xuICAgICAgICAgICAgdGhpcy56ID0geC56O1xuICAgICAgICAgICAgdGhpcy53ID0geC53O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy54ID0geCBhcyBudW1iZXI7XG4gICAgICAgICAgICB0aGlzLnkgPSB5O1xuICAgICAgICAgICAgdGhpcy56ID0gejtcbiAgICAgICAgICAgIHRoaXMudyA9IHc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIGNsb25lIGEgVmVjNCB2YWx1ZVxuICAgICAqICEjemgg5YWL6ZqG5LiA5LiqIFZlYzQg5YC8XG4gICAgICogQG1ldGhvZCBjbG9uZVxuICAgICAqIEByZXR1cm4ge1ZlYzR9XG4gICAgICovXG4gICAgcHVibGljIGNsb25lICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWM0KHRoaXMueCwgdGhpcy55LCB0aGlzLnosIHRoaXMudyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIGN1cnJlbnQgdmVjdG9yIHZhbHVlIHdpdGggdGhlIGdpdmVuIHZlY3Rvci5cbiAgICAgKiAhI3poIOeUqOWPpuS4gOS4quWQkemHj+iuvue9ruW9k+WJjeeahOWQkemHj+WvueixoeWAvOOAglxuICAgICAqIEBtZXRob2Qgc2V0XG4gICAgICogQHBhcmFtIHtWZWM0fSBuZXdWYWx1ZSAtICEjZW4gbmV3IHZhbHVlIHRvIHNldC4gISN6aCDopoHorr7nva7nmoTmlrDlgLxcbiAgICAgKiBAcmV0dXJuIHtWZWM0fSByZXR1cm5zIHRoaXNcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IChvdGhlcjogVmVjNCk7XG5cbiAgICBwdWJsaWMgc2V0ICh4PzogbnVtYmVyLCB5PzogbnVtYmVyLCB6PzogbnVtYmVyLCB3PzogbnVtYmVyKTtcblxuICAgIHB1YmxpYyBzZXQgKHg/OiBudW1iZXIgfCBWZWM0LCB5PzogbnVtYmVyLCB6PzogbnVtYmVyLCB3PzogbnVtYmVyKSB7XG4gICAgICAgIGlmICh4ICYmIHR5cGVvZiB4ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGhpcy54ID0geC54O1xuICAgICAgICAgICAgdGhpcy55ID0geC55O1xuICAgICAgICAgICAgdGhpcy56ID0geC56O1xuICAgICAgICAgICAgdGhpcy53ID0geC53O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy54ID0geCBhcyBudW1iZXIgfHwgMDtcbiAgICAgICAgICAgIHRoaXMueSA9IHkgfHwgMDtcbiAgICAgICAgICAgIHRoaXMueiA9IHogfHwgMDtcbiAgICAgICAgICAgIHRoaXMudyA9IHcgfHwgMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENoZWNrIHdoZXRoZXIgdGhlIHZlY3RvciBlcXVhbHMgYW5vdGhlciBvbmVcbiAgICAgKiAhI3poIOW9k+WJjeeahOWQkemHj+aYr+WQpuS4juaMh+WumueahOWQkemHj+ebuOetieOAglxuICAgICAqIEBtZXRob2QgZXF1YWxzXG4gICAgICogQHBhcmFtIHtWZWM0fSBvdGhlclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbZXBzaWxvbl1cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIHB1YmxpYyBlcXVhbHMgKG90aGVyOiBWZWM0LCBlcHNpbG9uID0gRVBTSUxPTikge1xuICAgICAgICByZXR1cm4gKE1hdGguYWJzKHRoaXMueCAtIG90aGVyLngpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMueCksIE1hdGguYWJzKG90aGVyLngpKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy55IC0gb3RoZXIueSkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnModGhpcy55KSwgTWF0aC5hYnMob3RoZXIueSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyh0aGlzLnogLSBvdGhlci56KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLnopLCBNYXRoLmFicyhvdGhlci56KSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMudyAtIG90aGVyLncpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMudyksIE1hdGguYWJzKG90aGVyLncpKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDaGVjayB3aGV0aGVyIHRoZSB2ZWN0b3IgZXF1YWxzIGFub3RoZXIgb25lXG4gICAgICogISN6aCDliKTmlq3lvZPliY3lkJHph4/mmK/lkKblnKjor6/lt67ojIPlm7TlhoXkuI7mjIflrprliIbph4/nmoTlkJHph4/nm7jnrYnjgIJcbiAgICAgKiBAbWV0aG9kIGVxdWFsczRmXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSDnm7jmr5TovoPnmoTlkJHph4/nmoQgeCDliIbph4/jgIJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIOebuOavlOi+g+eahOWQkemHj+eahCB5IOWIhumHj+OAglxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB6IC0g55u45q+U6L6D55qE5ZCR6YeP55qEIHog5YiG6YeP44CCXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHcgLSDnm7jmr5TovoPnmoTlkJHph4/nmoQgdyDliIbph4/jgIJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2Vwc2lsb25dIC0g5YWB6K6455qE6K+v5beu77yM5bqU5Li66Z2e6LSf5pWw44CCXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59IC0g5b2T5Lik5ZCR6YeP55qE5ZCE5YiG6YeP6YO95Zyo5oyH5a6a55qE6K+v5beu6IyD5Zu05YaF5YiG5Yir55u4562J5pe277yM6L+U5ZueIGB0cnVlYO+8m+WQpuWImei/lOWbniBgZmFsc2Vg44CCXG4gICAgICovXG4gICAgcHVibGljIGVxdWFsczRmICh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB3OiBudW1iZXIsIGVwc2lsb24gPSBFUFNJTE9OKSB7XG4gICAgICAgIHJldHVybiAoTWF0aC5hYnModGhpcy54IC0geCkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnModGhpcy54KSwgTWF0aC5hYnMoeCkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyh0aGlzLnkgLSB5KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLnkpLCBNYXRoLmFicyh5KSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMueiAtIHopIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMueiksIE1hdGguYWJzKHopKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy53IC0gdykgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnModGhpcy53KSwgTWF0aC5hYnModykpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENoZWNrIHdoZXRoZXIgc3RyaWN0IGVxdWFscyBvdGhlciBWZWM0XG4gICAgICogISN6aCDliKTmlq3lvZPliY3lkJHph4/mmK/lkKbkuI7mjIflrprlkJHph4/nm7jnrYnjgILkuKTlkJHph4/nmoTlkITliIbph4/pg73liIbliKvnm7jnrYnml7bov5Tlm54gYHRydWVg77yb5ZCm5YiZ6L+U5ZueIGBmYWxzZWDjgIJcbiAgICAgKiBAbWV0aG9kIHN0cmljdEVxdWFsc1xuICAgICAqIEBwYXJhbSB7VmVjNH0gb3RoZXIgLSDnm7jmr5TovoPnmoTlkJHph4/jgIJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RyaWN0RXF1YWxzIChvdGhlcjogVmVjNCkge1xuICAgICAgICByZXR1cm4gdGhpcy54ID09PSBvdGhlci54ICYmIHRoaXMueSA9PT0gb3RoZXIueSAmJiB0aGlzLnogPT09IG90aGVyLnogJiYgdGhpcy53ID09PSBvdGhlci53O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2hlY2sgd2hldGhlciBzdHJpY3QgZXF1YWxzIG90aGVyIFZlYzRcbiAgICAgKiAhI3poIOWIpOaWreW9k+WJjeWQkemHj+aYr+WQpuS4juaMh+WumuWIhumHj+eahOWQkemHj+ebuOetieOAguS4pOWQkemHj+eahOWQhOWIhumHj+mDveWIhuWIq+ebuOetieaXtui/lOWbniBgdHJ1ZWDvvJvlkKbliJnov5Tlm54gYGZhbHNlYOOAglxuICAgICAqIEBtZXRob2Qgc3RyaWN0RXF1YWxzNGZcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIOaMh+WumuWQkemHj+eahCB4IOWIhumHj+OAglxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0g5oyH5a6a5ZCR6YeP55qEIHkg5YiG6YeP44CCXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHogLSDmjIflrprlkJHph4/nmoQgeiDliIbph4/jgIJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdyAtIOaMh+WumuWQkemHj+eahCB3IOWIhumHj+OAglxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIHB1YmxpYyBzdHJpY3RFcXVhbHM0ZiAoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdzogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggPT09IHggJiYgdGhpcy55ID09PSB5ICYmIHRoaXMueiA9PT0geiAmJiB0aGlzLncgPT09IHc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDYWxjdWxhdGUgbGluZWFyIGludGVycG9sYXRpb24gcmVzdWx0IGJldHdlZW4gdGhpcyB2ZWN0b3IgYW5kIGFub3RoZXIgb25lIHdpdGggZ2l2ZW4gcmF0aW9cbiAgICAgKiAhI3poIOagueaNruaMh+WumueahOaPkuWAvOavlOeOh++8jOS7juW9k+WJjeWQkemHj+WIsOebruagh+WQkemHj+S5i+mXtOWBmuaPkuWAvOOAglxuICAgICAqIEBtZXRob2QgbGVycFxuICAgICAqIEBwYXJhbSB7VmVjNH0gdG8g55uu5qCH5ZCR6YeP44CCXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhdGlvIOaPkuWAvOavlOeOh++8jOiMg+WbtOS4uiBbMCwxXeOAglxuICAgICAqIEByZXR1cm5zIHtWZWM0fVxuICAgICAqL1xuICAgIHB1YmxpYyBsZXJwICh0bzogVmVjNCwgcmF0aW86IG51bWJlcikge1xuICAgICAgICBfeCA9IHRoaXMueDtcbiAgICAgICAgX3kgPSB0aGlzLnk7XG4gICAgICAgIF96ID0gdGhpcy56O1xuICAgICAgICBfdyA9IHRoaXMudztcbiAgICAgICAgdGhpcy54ID0gX3ggKyByYXRpbyAqICh0by54IC0gX3gpO1xuICAgICAgICB0aGlzLnkgPSBfeSArIHJhdGlvICogKHRvLnkgLSBfeSk7XG4gICAgICAgIHRoaXMueiA9IF96ICsgcmF0aW8gKiAodG8ueiAtIF96KTtcbiAgICAgICAgdGhpcy53ID0gX3cgKyByYXRpbyAqICh0by53IC0gX3cpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRyYW5zZm9ybSB0byBzdHJpbmcgd2l0aCB2ZWN0b3IgaW5mb3JtYXRpb25zXG4gICAgICogISN6aCDov5Tlm57lvZPliY3lkJHph4/nmoTlrZfnrKbkuLLooajnpLrjgIJcbiAgICAgKiBAbWV0aG9kIHRvU3RyaW5nXG4gICAgICogQHJldHVybnMge3N0cmluZ30g5b2T5YmN5ZCR6YeP55qE5a2X56ym5Liy6KGo56S644CCXG4gICAgICovXG4gICAgcHVibGljIHRvU3RyaW5nICgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYCgke3RoaXMueC50b0ZpeGVkKDIpfSwgJHt0aGlzLnkudG9GaXhlZCgyKX0sICR7dGhpcy56LnRvRml4ZWQoMil9LCAke3RoaXMudy50b0ZpeGVkKDIpfSlgO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2xhbXAgdGhlIHZlY3RvciBiZXR3ZWVuIG1pbkluY2x1c2l2ZSBhbmQgbWF4SW5jbHVzaXZlLlxuICAgICAqICEjemgg6K6+572u5b2T5YmN5ZCR6YeP55qE5YC877yM5L2/5YW25ZCE5Liq5YiG6YeP6YO95aSE5LqO5oyH5a6a55qE6IyD5Zu05YaF44CCXG4gICAgICogQG1ldGhvZCBjbGFtcGZcbiAgICAgKiBAcGFyYW0ge1ZlYzR9IG1pbkluY2x1c2l2ZSDmr4/kuKrliIbph4/pg73ku6Pooajkuoblr7nlupTliIbph4/lhYHorrjnmoTmnIDlsI/lgLzjgIJcbiAgICAgKiBAcGFyYW0ge1ZlYzR9IG1heEluY2x1c2l2ZSDmr4/kuKrliIbph4/pg73ku6Pooajkuoblr7nlupTliIbph4/lhYHorrjnmoTmnIDlpKflgLzjgIJcbiAgICAgKiBAcmV0dXJucyB7VmVjNH1cbiAgICAgKi9cbiAgICBwdWJsaWMgY2xhbXBmIChtaW5JbmNsdXNpdmU6IFZlYzQsIG1heEluY2x1c2l2ZTogVmVjNCkge1xuICAgICAgICB0aGlzLnggPSBjbGFtcCh0aGlzLngsIG1pbkluY2x1c2l2ZS54LCBtYXhJbmNsdXNpdmUueCk7XG4gICAgICAgIHRoaXMueSA9IGNsYW1wKHRoaXMueSwgbWluSW5jbHVzaXZlLnksIG1heEluY2x1c2l2ZS55KTtcbiAgICAgICAgdGhpcy56ID0gY2xhbXAodGhpcy56LCBtaW5JbmNsdXNpdmUueiwgbWF4SW5jbHVzaXZlLnopO1xuICAgICAgICB0aGlzLncgPSBjbGFtcCh0aGlzLncsIG1pbkluY2x1c2l2ZS53LCBtYXhJbmNsdXNpdmUudyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQWRkcyB0aGlzIHZlY3Rvci4gSWYgeW91IHdhbnQgdG8gc2F2ZSByZXN1bHQgdG8gYW5vdGhlciB2ZWN0b3IsIHVzZSBhZGQoKSBpbnN0ZWFkLlxuICAgICAqICEjemgg5ZCR6YeP5Yqg5rOV44CC5aaC5p6c5L2g5oOz5L+d5a2Y57uT5p6c5Yiw5Y+m5LiA5Liq5ZCR6YeP77yM5L2/55SoIGFkZCgpIOS7o+abv+OAglxuICAgICAqIEBtZXRob2QgYWRkU2VsZlxuICAgICAqIEBwYXJhbSB7VmVjNH0gdmVjdG9yXG4gICAgICogQHJldHVybiB7VmVjNH0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIGFkZFNlbGYgKHZlY3RvcjogVmVjNCk6IHRoaXMge1xuICAgICAgICB0aGlzLnggKz0gdmVjdG9yLng7XG4gICAgICAgIHRoaXMueSArPSB2ZWN0b3IueTtcbiAgICAgICAgdGhpcy56ICs9IHZlY3Rvci56O1xuICAgICAgICB0aGlzLncgKz0gdmVjdG9yLnc7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQWRkcyB0d28gdmVjdG9ycywgYW5kIHJldHVybnMgdGhlIG5ldyByZXN1bHQuXG4gICAgICogISN6aCDlkJHph4/liqDms5XvvIzlubbov5Tlm57mlrDnu5PmnpzjgIJcbiAgICAgKiBAbWV0aG9kIGFkZFxuICAgICAqIEBwYXJhbSB7VmVjNH0gdmVjdG9yXG4gICAgICogQHBhcmFtIHtWZWM0fSBbb3V0XSAtIG9wdGlvbmFsLCB0aGUgcmVjZWl2aW5nIHZlY3RvciwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIHZlYzQgdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IHZlYzQgd2lsbCBiZSBjcmVhdGVkXG4gICAgICogQHJldHVybiB7VmVjNH0gdGhlIHJlc3VsdFxuICAgICAqL1xuICAgIGFkZCAodmVjdG9yOiBWZWM0LCBvdXQ/OiBWZWM0KTogVmVjNCB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgVmVjNCgpO1xuICAgICAgICBvdXQueCA9IHRoaXMueCArIHZlY3Rvci54O1xuICAgICAgICBvdXQueSA9IHRoaXMueSArIHZlY3Rvci55O1xuICAgICAgICBvdXQueiA9IHRoaXMueiArIHZlY3Rvci56O1xuICAgICAgICBvdXQudyA9IHRoaXMudyArIHZlY3Rvci53O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gU3VidHJhY3RzIG9uZSB2ZWN0b3IgZnJvbSB0aGlzLCBhbmQgcmV0dXJucyB0aGUgbmV3IHJlc3VsdC5cbiAgICAgKiAhI3poIOWQkemHj+WHj+azle+8jOW5tui/lOWbnuaWsOe7k+aenOOAglxuICAgICAqIEBtZXRob2Qgc3VidHJhY3RcbiAgICAgKiBAcGFyYW0ge1ZlYzR9IHZlY3RvclxuICAgICAqIEBwYXJhbSB7VmVjNH0gW291dF0gLSBvcHRpb25hbCwgdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWM0IHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWM0IHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm4ge1ZlYzR9IHRoZSByZXN1bHRcbiAgICAgKi9cbiAgICBzdWJ0cmFjdCAodmVjdG9yOiBWZWM0LCBvdXQ/OiBWZWM0KTogVmVjNCB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgVmVjNCgpO1xuICAgICAgICBvdXQueCA9IHRoaXMueCAtIHZlY3Rvci54O1xuICAgICAgICBvdXQueSA9IHRoaXMueSAtIHZlY3Rvci55O1xuICAgICAgICBvdXQueiA9IHRoaXMueiAtIHZlY3Rvci56O1xuICAgICAgICBvdXQudyA9IHRoaXMudyAtIHZlY3Rvci53O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gTXVsdGlwbGllcyB0aGlzIGJ5IGEgbnVtYmVyLlxuICAgICAqICEjemgg57yp5pS+5b2T5YmN5ZCR6YeP44CCXG4gICAgICogQG1ldGhvZCBtdWx0aXBseVNjYWxhclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAgICAgKiBAcmV0dXJuIHtWZWM0fSByZXR1cm5zIHRoaXNcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICovXG4gICAgbXVsdGlwbHlTY2FsYXIgKG51bTogbnVtYmVyKTogdGhpcyB7XG4gICAgICAgIHRoaXMueCAqPSBudW07XG4gICAgICAgIHRoaXMueSAqPSBudW07XG4gICAgICAgIHRoaXMueiAqPSBudW07XG4gICAgICAgIHRoaXMudyAqPSBudW07XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gTXVsdGlwbGllcyB0d28gdmVjdG9ycy5cbiAgICAgKiAhI3poIOWIhumHj+ebuOS5mOOAglxuICAgICAqIEBtZXRob2QgbXVsdGlwbHlcbiAgICAgKiBAcGFyYW0ge1ZlYzR9IHZlY3RvclxuICAgICAqIEByZXR1cm4ge1ZlYzR9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKi9cbiAgICBtdWx0aXBseSAodmVjdG9yOiBWZWM0KTogdGhpcyB7XG4gICAgICAgIHRoaXMueCAqPSB2ZWN0b3IueDtcbiAgICAgICAgdGhpcy55ICo9IHZlY3Rvci55O1xuICAgICAgICB0aGlzLnogKj0gdmVjdG9yLno7XG4gICAgICAgIHRoaXMudyAqPSB2ZWN0b3IudztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBEaXZpZGVzIGJ5IGEgbnVtYmVyLlxuICAgICAqICEjemgg5ZCR6YeP6Zmk5rOV44CCXG4gICAgICogQG1ldGhvZCBkaXZpZGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtXG4gICAgICogQHJldHVybiB7VmVjNH0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIGRpdmlkZSAobnVtOiBudW1iZXIpOiB0aGlzIHtcbiAgICAgICAgdGhpcy54IC89IG51bTtcbiAgICAgICAgdGhpcy55IC89IG51bTtcbiAgICAgICAgdGhpcy56IC89IG51bTtcbiAgICAgICAgdGhpcy53IC89IG51bTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBOZWdhdGVzIHRoZSBjb21wb25lbnRzLlxuICAgICAqICEjemgg5ZCR6YeP5Y+W5Y+NXG4gICAgICogQG1ldGhvZCBuZWdhdGVcbiAgICAgKiBAcmV0dXJuIHtWZWM0fSByZXR1cm5zIHRoaXNcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICovXG4gICAgbmVnYXRlICgpOiB0aGlzIHtcbiAgICAgICAgdGhpcy54ID0gLXRoaXMueDtcbiAgICAgICAgdGhpcy55ID0gLXRoaXMueTtcbiAgICAgICAgdGhpcy56ID0gLXRoaXMuejtcbiAgICAgICAgdGhpcy53ID0gLXRoaXMudztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBEb3QgcHJvZHVjdFxuICAgICAqICEjemgg5b2T5YmN5ZCR6YeP5LiO5oyH5a6a5ZCR6YeP6L+b6KGM54K55LmY44CCXG4gICAgICogQG1ldGhvZCBkb3RcbiAgICAgKiBAcGFyYW0ge1ZlYzR9IFt2ZWN0b3JdXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgcmVzdWx0XG4gICAgICovXG4gICAgZG90ICh2ZWN0b3I6IFZlYzQpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy54ICogdmVjdG9yLnggKyB0aGlzLnkgKiB2ZWN0b3IueSArIHRoaXMueiAqIHZlY3Rvci56ICsgdGhpcy53ICogdmVjdG9yLnc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDcm9zcyBwcm9kdWN0XG4gICAgICogISN6aCDlvZPliY3lkJHph4/kuI7mjIflrprlkJHph4/ov5vooYzlj4nkuZjjgIJcbiAgICAgKiBAbWV0aG9kIGNyb3NzXG4gICAgICogQHBhcmFtIHtWZWM0fSB2ZWN0b3JcbiAgICAgKiBAcGFyYW0ge1ZlYzR9IFtvdXRdXG4gICAgICogQHJldHVybiB7VmVjNH0gdGhlIHJlc3VsdFxuICAgICAqL1xuICAgIGNyb3NzICh2ZWN0b3I6IFZlYzQsIG91dD86IFZlYzQpOiBWZWM0IHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBWZWM0KCk7XG4gICAgICAgIGNvbnN0IHsgeDogYXgsIHk6IGF5LCB6OiBheiB9ID0gdGhpcztcbiAgICAgICAgY29uc3QgeyB4OiBieCwgeTogYnksIHo6IGJ6IH0gPSB2ZWN0b3I7XG5cbiAgICAgICAgb3V0LnggPSBheSAqIGJ6IC0gYXogKiBieTtcbiAgICAgICAgb3V0LnkgPSBheiAqIGJ4IC0gYXggKiBiejtcbiAgICAgICAgb3V0LnogPSBheCAqIGJ5IC0gYXkgKiBieDtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgdGhlIGxlbmd0aCBvZiB0aGlzIHZlY3Rvci5cbiAgICAgKiAhI3poIOi/lOWbnuivpeWQkemHj+eahOmVv+W6puOAglxuICAgICAqIEBtZXRob2QgbGVuXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgcmVzdWx0XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdiA9IGNjLnY0KDEwLCAxMCk7XG4gICAgICogdi5sZW4oKTsgLy8gcmV0dXJuIDE0LjE0MjEzNTYyMzczMDk1MTtcbiAgICAgKi9cbiAgICBsZW4gKCk6IG51bWJlciB7XG4gICAgICAgIGxldCB4ID0gdGhpcy54LFxuICAgICAgICAgIHkgPSB0aGlzLnksXG4gICAgICAgICAgeiA9IHRoaXMueixcbiAgICAgICAgICB3ID0gdGhpcy53O1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeiArIHcgKiB3KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgdGhlIHNxdWFyZWQgbGVuZ3RoIG9mIHRoaXMgdmVjdG9yLlxuICAgICAqICEjemgg6L+U5Zue6K+l5ZCR6YeP55qE6ZW/5bqm5bmz5pa544CCXG4gICAgICogQG1ldGhvZCBsZW5ndGhTcXJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSByZXN1bHRcbiAgICAgKi9cbiAgICBsZW5ndGhTcXIgKCk6IG51bWJlciB7XG4gICAgICAgIGxldCB4ID0gdGhpcy54LFxuICAgICAgICAgIHkgPSB0aGlzLnksXG4gICAgICAgICAgeiA9IHRoaXMueixcbiAgICAgICAgICB3ID0gdGhpcy53O1xuICAgICAgICByZXR1cm4geCAqIHggKyB5ICogeSArIHogKiB6ICsgdyAqIHc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBNYWtlIHRoZSBsZW5ndGggb2YgdGhpcyB2ZWN0b3IgdG8gMS5cbiAgICAgKiAhI3poIOWQkemHj+W9kuS4gOWMlu+8jOiuqei/meS4quWQkemHj+eahOmVv+W6puS4uiAx44CCXG4gICAgICogQG1ldGhvZCBub3JtYWxpemVTZWxmXG4gICAgICogQHJldHVybiB7VmVjNH0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIG5vcm1hbGl6ZVNlbGYgKCkge1xuICAgICAgICB0aGlzLm5vcm1hbGl6ZSh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgdGhpcyB2ZWN0b3Igd2l0aCBhIG1hZ25pdHVkZSBvZiAxLjxici8+XG4gICAgICogPGJyLz5cbiAgICAgKiBOb3RlIHRoYXQgdGhlIGN1cnJlbnQgdmVjdG9yIGlzIHVuY2hhbmdlZCBhbmQgYSBuZXcgbm9ybWFsaXplZCB2ZWN0b3IgaXMgcmV0dXJuZWQuIElmIHlvdSB3YW50IHRvIG5vcm1hbGl6ZSB0aGUgY3VycmVudCB2ZWN0b3IsIHVzZSBub3JtYWxpemVTZWxmIGZ1bmN0aW9uLlxuICAgICAqICEjemhcbiAgICAgKiDov5Tlm57lvZLkuIDljJblkI7nmoTlkJHph4/jgII8YnIvPlxuICAgICAqIDxici8+XG4gICAgICog5rOo5oSP77yM5b2T5YmN5ZCR6YeP5LiN5Y+Y77yM5bm26L+U5Zue5LiA5Liq5paw55qE5b2S5LiA5YyW5ZCR6YeP44CC5aaC5p6c5L2g5oOz5p2l5b2S5LiA5YyW5b2T5YmN5ZCR6YeP77yM5Y+v5L2/55SoIG5vcm1hbGl6ZVNlbGYg5Ye95pWw44CCXG4gICAgICogQG1ldGhvZCBub3JtYWxpemVcbiAgICAgKiBAcGFyYW0ge1ZlYzR9IFtvdXRdIC0gb3B0aW9uYWwsIHRoZSByZWNlaXZpbmcgdmVjdG9yLCB5b3UgY2FuIHBhc3MgdGhlIHNhbWUgdmVjNCB0byBzYXZlIHJlc3VsdCB0byBpdHNlbGYsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgdmVjNCB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJuIHtWZWM0fSByZXN1bHRcbiAgICAgKi9cbiAgICBub3JtYWxpemUgKG91dD86IFZlYzQpOiBWZWM0IHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBWZWM0KCk7XG4gICAgICAgIF94ID0gdGhpcy54O1xuICAgICAgICBfeSA9IHRoaXMueTtcbiAgICAgICAgX3ogPSB0aGlzLno7XG4gICAgICAgIF93ID0gdGhpcy53O1xuICAgICAgICBsZXQgbGVuID0gX3ggKiBfeCArIF95ICogX3kgKyBfeiAqIF96ICsgX3cgKiBfdztcbiAgICAgICAgaWYgKGxlbiA+IDApIHtcbiAgICAgICAgICAgIGxlbiA9IDEgLyBNYXRoLnNxcnQobGVuKTtcbiAgICAgICAgICAgIG91dC54ID0gX3ggKiBsZW47XG4gICAgICAgICAgICBvdXQueSA9IF95ICogbGVuO1xuICAgICAgICAgICAgb3V0LnogPSBfeiAqIGxlbjtcbiAgICAgICAgICAgIG91dC53ID0gX3cgKiBsZW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmFuc2Zvcm1zIHRoZSB2ZWM0IHdpdGggYSBtYXQ0LiA0dGggdmVjdG9yIGNvbXBvbmVudCBpcyBpbXBsaWNpdGx5ICcxJ1xuICAgICAqIEBtZXRob2QgdHJhbnNmb3JtTWF0NFxuICAgICAqIEBwYXJhbSB7TWF0NH0gbSBtYXRyaXggdG8gdHJhbnNmb3JtIHdpdGhcbiAgICAgKiBAcGFyYW0ge1ZlYzR9IFtvdXRdIHRoZSByZWNlaXZpbmcgdmVjdG9yLCB5b3UgY2FuIHBhc3MgdGhlIHNhbWUgdmVjNCB0byBzYXZlIHJlc3VsdCB0byBpdHNlbGYsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgdmVjNCB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJucyB7VmVjNH0gb3V0XG4gICAgICovXG4gICAgdHJhbnNmb3JtTWF0NCAobWF0cml4OiBNYXQ0LCBvdXQ6IFZlYzQpOiBWZWM0IHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBWZWM0KCk7XG4gICAgICAgIF94ID0gdGhpcy54O1xuICAgICAgICBfeSA9IHRoaXMueTtcbiAgICAgICAgX3ogPSB0aGlzLno7XG4gICAgICAgIF93ID0gdGhpcy53O1xuICAgICAgICBsZXQgbSA9IG1hdHJpeC5tO1xuICAgICAgICBvdXQueCA9IG1bMF0gKiBfeCArIG1bNF0gKiBfeSArIG1bOF0gICogX3ogKyBtWzEyXSAqIF93O1xuICAgICAgICBvdXQueSA9IG1bMV0gKiBfeCArIG1bNV0gKiBfeSArIG1bOV0gICogX3ogKyBtWzEzXSAqIF93O1xuICAgICAgICBvdXQueiA9IG1bMl0gKiBfeCArIG1bNl0gKiBfeSArIG1bMTBdICogX3ogKyBtWzE0XSAqIF93O1xuICAgICAgICBvdXQudyA9IG1bM10gKiBfeCArIG1bN10gKiBfeSArIG1bMTFdICogX3ogKyBtWzE1XSAqIF93O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG1heGltdW0gdmFsdWUgaW4geCwgeSwgeiwgdy5cbiAgICAgKiBAbWV0aG9kIG1heEF4aXNcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIG1heEF4aXMgKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLm1heCh0aGlzLngsIHRoaXMueSwgdGhpcy56LCB0aGlzLncpO1xuICAgIH1cbn1cblxuQ0NDbGFzcy5mYXN0RGVmaW5lKCdjYy5WZWM0JywgVmVjNCwgeyB4OiAwLCB5OiAwLCB6OiAwLCB3OiAwIH0pO1xuXG5leHBvcnQgZnVuY3Rpb24gdjQgKG90aGVyOiBWZWM0KTogVmVjNDtcbmV4cG9ydCBmdW5jdGlvbiB2NCAoeD86IG51bWJlciwgeT86IG51bWJlciwgej86IG51bWJlciwgdz86IG51bWJlcik6IFZlYzQ7XG5cbmV4cG9ydCBmdW5jdGlvbiB2NCAoeD86IG51bWJlciB8IFZlYzQsIHk/OiBudW1iZXIsIHo/OiBudW1iZXIsIHc/OiBudW1iZXIpIHtcbiAgICByZXR1cm4gbmV3IFZlYzQoeCBhcyBhbnksIHksIHosIHcpO1xufVxuXG5jYy52NCA9IHY0O1xuY2MuVmVjNCA9IFZlYzQ7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==