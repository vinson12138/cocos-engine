
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/value-types/mat4.js';
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

var _vec = _interopRequireDefault(require("./vec3"));

var _quat = _interopRequireDefault(require("./quat"));

var _utils = require("./utils");

var _mat = _interopRequireDefault(require("./mat3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _a00 = 0;
var _a01 = 0;
var _a02 = 0;
var _a03 = 0;
var _a10 = 0;
var _a11 = 0;
var _a12 = 0;
var _a13 = 0;
var _a20 = 0;
var _a21 = 0;
var _a22 = 0;
var _a23 = 0;
var _a30 = 0;
var _a31 = 0;
var _a32 = 0;
var _a33 = 0;
/**
 * !#en Representation of 4*4 matrix.
 * !#zh 表示 4*4 矩阵
 *
 * @class Mat4
 * @extends ValueType
 */

var Mat4 = /*#__PURE__*/function (_ValueType) {
  _inheritsLoose(Mat4, _ValueType);

  var _proto = Mat4.prototype;

  /**
   * !#en Multiply the current matrix with another one
   * !#zh 将当前矩阵与指定矩阵相乘
   * @method mul
   * @param {Mat4} other the second operand
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
   * @returns {Mat4} out
   */
  _proto.mul = function mul(m, out) {
    return Mat4.multiply(out || new Mat4(), this, m);
  }
  /**
   * !#en Multiply each element of the matrix by a scalar.
   * !#zh 将矩阵的每一个元素都乘以指定的缩放值。
   * @method mulScalar
   * @param {Number} number amount to scale the matrix's elements by
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
   * @returns {Mat4} out
   */
  ;

  _proto.mulScalar = function mulScalar(num, out) {
    Mat4.multiplyScalar(out || new Mat4(), this, num);
  }
  /**
   * !#en Subtracts the current matrix with another one
   * !#zh 将当前矩阵与指定的矩阵相减
   * @method sub
   * @param {Mat4} other the second operand
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
   * @returns {Mat4} out
   */
  ;

  _proto.sub = function sub(m, out) {
    Mat4.subtract(out || new Mat4(), this, m);
  }
  /**
   * Identity  of Mat4
   * @property {Mat4} IDENTITY
   * @static
   */
  ;

  /**
   * !#zh 获得指定矩阵的拷贝
   * !#en Copy of the specified matrix to obtain
   * @method clone
   * @typescript
   * clone<Out extends IMat4Like> (a: Out): Mat4
   * @static
   */
  Mat4.clone = function clone(a) {
    var m = a.m;
    return new Mat4(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[10], m[11], m[12], m[13], m[14], m[15]);
  }
  /**
   * !#zh 复制目标矩阵
   * !#en Copy the target matrix
   * @method copy
   * @typescript
   * copy<Out extends IMat4Like> (out: Out, a: Out): Out
   * @static
   */
  ;

  Mat4.copy = function copy(out, a) {
    var m = out.m,
        am = a.m;
    m[0] = am[0];
    m[1] = am[1];
    m[2] = am[2];
    m[3] = am[3];
    m[4] = am[4];
    m[5] = am[5];
    m[6] = am[6];
    m[7] = am[7];
    m[8] = am[8];
    m[9] = am[9];
    m[10] = am[10];
    m[11] = am[11];
    m[12] = am[12];
    m[13] = am[13];
    m[14] = am[14];
    m[15] = am[15];
    return out;
  }
  /**
   * !#zh 设置矩阵值
   * !#en Setting matrix values
   * @static
   */
  ;

  Mat4.set = function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    var m = out.m;
    m[0] = m00;
    m[1] = m01;
    m[2] = m02;
    m[3] = m03;
    m[4] = m10;
    m[5] = m11;
    m[6] = m12;
    m[7] = m13;
    m[8] = m20;
    m[9] = m21;
    m[10] = m22;
    m[11] = m23;
    m[12] = m30;
    m[13] = m31;
    m[14] = m32;
    m[15] = m33;
    return out;
  }
  /**
   * !#zh 将目标赋值为单位矩阵
   * !#en The target of an assignment is the identity matrix
   * @method identity
   * @typescript
   * identity<Out extends IMat4Like> (out: Out): Out
   * @static
   */
  ;

  Mat4.identity = function identity(out) {
    var m = out.m;
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = 1;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = 1;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 转置矩阵
   * !#en Transposed matrix
   * @method transpose
   * @typescript
   * transpose<Out extends IMat4Like> (out: Out, a: Out): Out
   * @static
   */
  ;

  Mat4.transpose = function transpose(out, a) {
    var m = out.m,
        am = a.m; // If we are transposing ourselves we can skip a few steps but have to cache some values

    if (out === a) {
      var a01 = am[1],
          a02 = am[2],
          a03 = am[3],
          a12 = am[6],
          a13 = am[7],
          a23 = am[11];
      m[1] = am[4];
      m[2] = am[8];
      m[3] = am[12];
      m[4] = a01;
      m[6] = am[9];
      m[7] = am[13];
      m[8] = a02;
      m[9] = a12;
      m[11] = am[14];
      m[12] = a03;
      m[13] = a13;
      m[14] = a23;
    } else {
      m[0] = am[0];
      m[1] = am[4];
      m[2] = am[8];
      m[3] = am[12];
      m[4] = am[1];
      m[5] = am[5];
      m[6] = am[9];
      m[7] = am[13];
      m[8] = am[2];
      m[9] = am[6];
      m[10] = am[10];
      m[11] = am[14];
      m[12] = am[3];
      m[13] = am[7];
      m[14] = am[11];
      m[15] = am[15];
    }

    return out;
  }
  /**
   * !#zh 矩阵求逆
   * !#en Matrix inversion
   * @method invert
   * @typescript
   * invert<Out extends IMat4Like> (out: Out, a: Out): Out
   * @static
   */
  ;

  Mat4.invert = function invert(out, a) {
    var am = a.m;
    _a00 = am[0];
    _a01 = am[1];
    _a02 = am[2];
    _a03 = am[3];
    _a10 = am[4];
    _a11 = am[5];
    _a12 = am[6];
    _a13 = am[7];
    _a20 = am[8];
    _a21 = am[9];
    _a22 = am[10];
    _a23 = am[11];
    _a30 = am[12];
    _a31 = am[13];
    _a32 = am[14];
    _a33 = am[15];
    var b00 = _a00 * _a11 - _a01 * _a10;
    var b01 = _a00 * _a12 - _a02 * _a10;
    var b02 = _a00 * _a13 - _a03 * _a10;
    var b03 = _a01 * _a12 - _a02 * _a11;
    var b04 = _a01 * _a13 - _a03 * _a11;
    var b05 = _a02 * _a13 - _a03 * _a12;
    var b06 = _a20 * _a31 - _a21 * _a30;
    var b07 = _a20 * _a32 - _a22 * _a30;
    var b08 = _a20 * _a33 - _a23 * _a30;
    var b09 = _a21 * _a32 - _a22 * _a31;
    var b10 = _a21 * _a33 - _a23 * _a31;
    var b11 = _a22 * _a33 - _a23 * _a32; // Calculate the determinant

    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (det === 0) {
      return null;
    }

    det = 1.0 / det;
    var m = out.m;
    m[0] = (_a11 * b11 - _a12 * b10 + _a13 * b09) * det;
    m[1] = (_a02 * b10 - _a01 * b11 - _a03 * b09) * det;
    m[2] = (_a31 * b05 - _a32 * b04 + _a33 * b03) * det;
    m[3] = (_a22 * b04 - _a21 * b05 - _a23 * b03) * det;
    m[4] = (_a12 * b08 - _a10 * b11 - _a13 * b07) * det;
    m[5] = (_a00 * b11 - _a02 * b08 + _a03 * b07) * det;
    m[6] = (_a32 * b02 - _a30 * b05 - _a33 * b01) * det;
    m[7] = (_a20 * b05 - _a22 * b02 + _a23 * b01) * det;
    m[8] = (_a10 * b10 - _a11 * b08 + _a13 * b06) * det;
    m[9] = (_a01 * b08 - _a00 * b10 - _a03 * b06) * det;
    m[10] = (_a30 * b04 - _a31 * b02 + _a33 * b00) * det;
    m[11] = (_a21 * b02 - _a20 * b04 - _a23 * b00) * det;
    m[12] = (_a11 * b07 - _a10 * b09 - _a12 * b06) * det;
    m[13] = (_a00 * b09 - _a01 * b07 + _a02 * b06) * det;
    m[14] = (_a31 * b01 - _a30 * b03 - _a32 * b00) * det;
    m[15] = (_a20 * b03 - _a21 * b01 + _a22 * b00) * det;
    return out;
  }
  /**
   * !#zh 矩阵行列式
   * !#en Matrix determinant
   * @method determinant
   * @typescript
   * determinant<Out extends IMat4Like> (a: Out): number
   * @static
   */
  ;

  Mat4.determinant = function determinant(a) {
    var m = a.m;
    _a00 = m[0];
    _a01 = m[1];
    _a02 = m[2];
    _a03 = m[3];
    _a10 = m[4];
    _a11 = m[5];
    _a12 = m[6];
    _a13 = m[7];
    _a20 = m[8];
    _a21 = m[9];
    _a22 = m[10];
    _a23 = m[11];
    _a30 = m[12];
    _a31 = m[13];
    _a32 = m[14];
    _a33 = m[15];
    var b00 = _a00 * _a11 - _a01 * _a10;
    var b01 = _a00 * _a12 - _a02 * _a10;
    var b02 = _a00 * _a13 - _a03 * _a10;
    var b03 = _a01 * _a12 - _a02 * _a11;
    var b04 = _a01 * _a13 - _a03 * _a11;
    var b05 = _a02 * _a13 - _a03 * _a12;
    var b06 = _a20 * _a31 - _a21 * _a30;
    var b07 = _a20 * _a32 - _a22 * _a30;
    var b08 = _a20 * _a33 - _a23 * _a30;
    var b09 = _a21 * _a32 - _a22 * _a31;
    var b10 = _a21 * _a33 - _a23 * _a31;
    var b11 = _a22 * _a33 - _a23 * _a32; // Calculate the determinant

    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  }
  /**
   * !#zh 矩阵乘法
   * !#en Matrix Multiplication
   * @method multiply
   * @typescript
   * multiply<Out extends IMat4Like> (out: Out, a: Out, b: Out): Out
   * @static
   */
  ;

  Mat4.multiply = function multiply(out, a, b) {
    var m = out.m,
        am = a.m,
        bm = b.m;
    _a00 = am[0];
    _a01 = am[1];
    _a02 = am[2];
    _a03 = am[3];
    _a10 = am[4];
    _a11 = am[5];
    _a12 = am[6];
    _a13 = am[7];
    _a20 = am[8];
    _a21 = am[9];
    _a22 = am[10];
    _a23 = am[11];
    _a30 = am[12];
    _a31 = am[13];
    _a32 = am[14];
    _a33 = am[15]; // Cache only the current line of the second matrix

    var b0 = bm[0],
        b1 = bm[1],
        b2 = bm[2],
        b3 = bm[3];
    m[0] = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
    m[1] = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
    m[2] = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
    m[3] = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;
    b0 = bm[4];
    b1 = bm[5];
    b2 = bm[6];
    b3 = bm[7];
    m[4] = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
    m[5] = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
    m[6] = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
    m[7] = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;
    b0 = bm[8];
    b1 = bm[9];
    b2 = bm[10];
    b3 = bm[11];
    m[8] = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
    m[9] = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
    m[10] = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
    m[11] = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;
    b0 = bm[12];
    b1 = bm[13];
    b2 = bm[14];
    b3 = bm[15];
    m[12] = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
    m[13] = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
    m[14] = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
    m[15] = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;
    return out;
  }
  /**
   * !#zh 在给定矩阵变换基础上加入变换
   * !#en Was added in a given transformation matrix transformation on the basis of
   * @method transform
   * @typescript
   * transform<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, v: VecLike): Out
   * @static
   */
  ;

  Mat4.transform = function transform(out, a, v) {
    var x = v.x,
        y = v.y,
        z = v.z;
    var m = out.m,
        am = a.m;

    if (a === out) {
      m[12] = am[0] * x + am[4] * y + am[8] * z + am[12];
      m[13] = am[1] * x + am[5] * y + am[9] * z + am[13];
      m[14] = am[2] * x + am[6] * y + am[10] * z + am[14];
      m[15] = am[3] * x + am[7] * y + am[11] * z + am[15];
    } else {
      _a00 = am[0];
      _a01 = am[1];
      _a02 = am[2];
      _a03 = am[3];
      _a10 = am[4];
      _a11 = am[5];
      _a12 = am[6];
      _a13 = am[7];
      _a20 = am[8];
      _a21 = am[9];
      _a22 = am[10];
      _a23 = am[11];
      _a30 = am[12];
      _a31 = am[13];
      _a32 = am[14];
      _a33 = am[15];
      m[0] = _a00;
      m[1] = _a01;
      m[2] = _a02;
      m[3] = _a03;
      m[4] = _a10;
      m[5] = _a11;
      m[6] = _a12;
      m[7] = _a13;
      m[8] = _a20;
      m[9] = _a21;
      m[10] = _a22;
      m[11] = _a23;
      m[12] = _a00 * x + _a10 * y + _a20 * z + am[12];
      m[13] = _a01 * x + _a11 * y + _a21 * z + am[13];
      m[14] = _a02 * x + _a12 * y + _a22 * z + am[14];
      m[15] = _a03 * x + _a13 * y + _a23 * z + am[15];
    }

    return out;
  }
  /**
   * !#zh 在给定矩阵变换基础上加入新位移变换
   * !#en Add new displacement transducer in a matrix transformation on the basis of a given
   * @method translate
   * @typescript
   * translate<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, v: VecLike): Out
   * @static
   */
  ;

  Mat4.translate = function translate(out, a, v) {
    var m = out.m,
        am = a.m;

    if (a === out) {
      m[12] += v.x;
      m[13] += v.y;
      m[14] += v.z;
    } else {
      m[0] = am[0];
      m[1] = am[1];
      m[2] = am[2];
      m[3] = am[3];
      m[4] = am[4];
      m[5] = am[5];
      m[6] = am[6];
      m[7] = am[7];
      m[8] = am[8];
      m[9] = am[9];
      m[10] = am[10];
      m[11] = am[11];
      m[12] += v.x;
      m[13] += v.y;
      m[14] += v.z;
      m[15] = am[15];
    }

    return out;
  }
  /**
   * !#zh 在给定矩阵变换基础上加入新缩放变换
   * !#en Add new scaling transformation in a given matrix transformation on the basis of
   * @method scale
   * @typescript
   * scale<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, v: VecLike): Out
   * @static
   */
  ;

  Mat4.scale = function scale(out, a, v) {
    var x = v.x,
        y = v.y,
        z = v.z;
    var m = out.m,
        am = a.m;
    m[0] = am[0] * x;
    m[1] = am[1] * x;
    m[2] = am[2] * x;
    m[3] = am[3] * x;
    m[4] = am[4] * y;
    m[5] = am[5] * y;
    m[6] = am[6] * y;
    m[7] = am[7] * y;
    m[8] = am[8] * z;
    m[9] = am[9] * z;
    m[10] = am[10] * z;
    m[11] = am[11] * z;
    m[12] = am[12];
    m[13] = am[13];
    m[14] = am[14];
    m[15] = am[15];
    return out;
  }
  /**
   * !#zh 在给定矩阵变换基础上加入新旋转变换
   * !#en Add a new rotational transform matrix transformation on the basis of a given
   * @method rotate
   * @typescript
   * rotate<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, rad: number, axis: VecLike): Out
   * @param rad 旋转角度
   * @param axis 旋转轴
   * @static
   */
  ;

  Mat4.rotate = function rotate(out, a, rad, axis) {
    var x = axis.x,
        y = axis.y,
        z = axis.z;
    var len = Math.sqrt(x * x + y * y + z * z);

    if (Math.abs(len) < _utils.EPSILON) {
      return null;
    }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var t = 1 - c;
    var am = a.m;
    _a00 = am[0];
    _a01 = am[1];
    _a02 = am[2];
    _a03 = am[3];
    _a10 = am[4];
    _a11 = am[5];
    _a12 = am[6];
    _a13 = am[7];
    _a20 = am[8];
    _a21 = am[9];
    _a22 = am[10];
    _a23 = am[11]; // Construct the elements of the rotation matrix

    var b00 = x * x * t + c,
        b01 = y * x * t + z * s,
        b02 = z * x * t - y * s;
    var b10 = x * y * t - z * s,
        b11 = y * y * t + c,
        b12 = z * y * t + x * s;
    var b20 = x * z * t + y * s,
        b21 = y * z * t - x * s,
        b22 = z * z * t + c;
    var m = out.m; // Perform rotation-specific matrix multiplication

    m[0] = _a00 * b00 + _a10 * b01 + _a20 * b02;
    m[1] = _a01 * b00 + _a11 * b01 + _a21 * b02;
    m[2] = _a02 * b00 + _a12 * b01 + _a22 * b02;
    m[3] = _a03 * b00 + _a13 * b01 + _a23 * b02;
    m[4] = _a00 * b10 + _a10 * b11 + _a20 * b12;
    m[5] = _a01 * b10 + _a11 * b11 + _a21 * b12;
    m[6] = _a02 * b10 + _a12 * b11 + _a22 * b12;
    m[7] = _a03 * b10 + _a13 * b11 + _a23 * b12;
    m[8] = _a00 * b20 + _a10 * b21 + _a20 * b22;
    m[9] = _a01 * b20 + _a11 * b21 + _a21 * b22;
    m[10] = _a02 * b20 + _a12 * b21 + _a22 * b22;
    m[11] = _a03 * b20 + _a13 * b21 + _a23 * b22; // If the source and destination differ, copy the unchanged last row

    if (a !== out) {
      m[12] = am[12];
      m[13] = am[13];
      m[14] = am[14];
      m[15] = am[15];
    }

    return out;
  }
  /**
   * !#zh 在给定矩阵变换基础上加入绕 X 轴的旋转变换
   * !#en Add rotational transformation around the X axis at a given matrix transformation on the basis of
   * @method rotateX
   * @typescript
   * rotateX<Out extends IMat4Like> (out: Out, a: Out, rad: number): Out
   * @param rad 旋转角度
   * @static
   */
  ;

  Mat4.rotateX = function rotateX(out, a, rad) {
    var m = out.m,
        am = a.m;
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = am[4],
        a11 = am[5],
        a12 = am[6],
        a13 = am[7],
        a20 = am[8],
        a21 = am[9],
        a22 = am[10],
        a23 = am[11];

    if (a !== out) {
      // If the source and destination differ, copy the unchanged rows
      m[0] = am[0];
      m[1] = am[1];
      m[2] = am[2];
      m[3] = am[3];
      m[12] = am[12];
      m[13] = am[13];
      m[14] = am[14];
      m[15] = am[15];
    } // Perform axis-specific matrix multiplication


    m[4] = a10 * c + a20 * s;
    m[5] = a11 * c + a21 * s;
    m[6] = a12 * c + a22 * s;
    m[7] = a13 * c + a23 * s;
    m[8] = a20 * c - a10 * s;
    m[9] = a21 * c - a11 * s;
    m[10] = a22 * c - a12 * s;
    m[11] = a23 * c - a13 * s;
    return out;
  }
  /**
   * !#zh 在给定矩阵变换基础上加入绕 Y 轴的旋转变换
   * !#en Add about the Y axis rotation transformation in a given matrix transformation on the basis of
   * @method rotateY
   * @typescript
   * rotateY<Out extends IMat4Like> (out: Out, a: Out, rad: number): Out
   * @param rad 旋转角度
   * @static
   */
  ;

  Mat4.rotateY = function rotateY(out, a, rad) {
    var m = out.m,
        am = a.m;
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = am[0],
        a01 = am[1],
        a02 = am[2],
        a03 = am[3],
        a20 = am[8],
        a21 = am[9],
        a22 = am[10],
        a23 = am[11];

    if (a !== out) {
      // If the source and destination differ, copy the unchanged rows
      m[4] = am[4];
      m[5] = am[5];
      m[6] = am[6];
      m[7] = am[7];
      m[12] = am[12];
      m[13] = am[13];
      m[14] = am[14];
      m[15] = am[15];
    } // Perform axis-specific matrix multiplication


    m[0] = a00 * c - a20 * s;
    m[1] = a01 * c - a21 * s;
    m[2] = a02 * c - a22 * s;
    m[3] = a03 * c - a23 * s;
    m[8] = a00 * s + a20 * c;
    m[9] = a01 * s + a21 * c;
    m[10] = a02 * s + a22 * c;
    m[11] = a03 * s + a23 * c;
    return out;
  }
  /**
   * !#zh 在给定矩阵变换基础上加入绕 Z 轴的旋转变换
   * !#en Added about the Z axis at a given rotational transformation matrix transformation on the basis of
   * @method rotateZ
   * @typescript
   * rotateZ<Out extends IMat4Like> (out: Out, a: Out, rad: number): Out
   * @param rad 旋转角度
   * @static
   */
  ;

  Mat4.rotateZ = function rotateZ(out, a, rad) {
    var am = a.m;
    var m = out.m;
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a.m[0],
        a01 = a.m[1],
        a02 = a.m[2],
        a03 = a.m[3],
        a10 = a.m[4],
        a11 = a.m[5],
        a12 = a.m[6],
        a13 = a.m[7]; // If the source and destination differ, copy the unchanged last row

    if (a !== out) {
      m[8] = am[8];
      m[9] = am[9];
      m[10] = am[10];
      m[11] = am[11];
      m[12] = am[12];
      m[13] = am[13];
      m[14] = am[14];
      m[15] = am[15];
    } // Perform axis-specific matrix multiplication


    m[0] = a00 * c + a10 * s;
    m[1] = a01 * c + a11 * s;
    m[2] = a02 * c + a12 * s;
    m[3] = a03 * c + a13 * s;
    m[4] = a10 * c - a00 * s;
    m[5] = a11 * c - a01 * s;
    m[6] = a12 * c - a02 * s;
    m[7] = a13 * c - a03 * s;
    return out;
  }
  /**
   * !#zh 计算位移矩阵
   * !#en Displacement matrix calculation
   * @method fromTranslation
   * @typescript
   * fromTranslation<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, v: VecLike): Out
   * @static
   */
  ;

  Mat4.fromTranslation = function fromTranslation(out, v) {
    var m = out.m;
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = 1;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = 1;
    m[11] = 0;
    m[12] = v.x;
    m[13] = v.y;
    m[14] = v.z;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 计算缩放矩阵
   * !#en Scaling matrix calculation
   * @method fromScaling
   * @typescript
   * fromScaling<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, v: VecLike): Out
   * @static
   */
  ;

  Mat4.fromScaling = function fromScaling(out, v) {
    var m = out.m;
    m[0] = v.x;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = v.y;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = v.z;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 计算旋转矩阵
   * !#en Calculates the rotation matrix
   * @method fromRotation
   * @typescript
   * fromRotation<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, rad: number, axis: VecLike): Out
   * @static
   */
  ;

  Mat4.fromRotation = function fromRotation(out, rad, axis) {
    var x = axis.x,
        y = axis.y,
        z = axis.z;
    var len = Math.sqrt(x * x + y * y + z * z);

    if (Math.abs(len) < _utils.EPSILON) {
      return null;
    }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var t = 1 - c; // Perform rotation-specific matrix multiplication

    var m = out.m;
    m[0] = x * x * t + c;
    m[1] = y * x * t + z * s;
    m[2] = z * x * t - y * s;
    m[3] = 0;
    m[4] = x * y * t - z * s;
    m[5] = y * y * t + c;
    m[6] = z * y * t + x * s;
    m[7] = 0;
    m[8] = x * z * t + y * s;
    m[9] = y * z * t - x * s;
    m[10] = z * z * t + c;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 计算绕 X 轴的旋转矩阵
   * !#en Calculating rotation matrix about the X axis
   * @method fromXRotation
   * @typescript
   * fromXRotation<Out extends IMat4Like> (out: Out, rad: number): Out
   * @static
   */
  ;

  Mat4.fromXRotation = function fromXRotation(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad); // Perform axis-specific matrix multiplication

    var m = out.m;
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = c;
    m[6] = s;
    m[7] = 0;
    m[8] = 0;
    m[9] = -s;
    m[10] = c;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 计算绕 Y 轴的旋转矩阵
   * !#en Calculating rotation matrix about the Y axis
   * @method fromYRotation
   * @typescript
   * fromYRotation<Out extends IMat4Like> (out: Out, rad: number): Out
   * @static
   */
  ;

  Mat4.fromYRotation = function fromYRotation(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad); // Perform axis-specific matrix multiplication

    var m = out.m;
    m[0] = c;
    m[1] = 0;
    m[2] = -s;
    m[3] = 0;
    m[4] = 0;
    m[5] = 1;
    m[6] = 0;
    m[7] = 0;
    m[8] = s;
    m[9] = 0;
    m[10] = c;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 计算绕 Z 轴的旋转矩阵
   * !#en Calculating rotation matrix about the Z axis
   * @method fromZRotation
   * @typescript
   * fromZRotation<Out extends IMat4Like> (out: Out, rad: number): Out
   * @static
   */
  ;

  Mat4.fromZRotation = function fromZRotation(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad); // Perform axis-specific matrix multiplication

    var m = out.m;
    m[0] = c;
    m[1] = s;
    m[2] = 0;
    m[3] = 0;
    m[4] = -s;
    m[5] = c;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = 1;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 根据旋转和位移信息计算矩阵
   * !#en The rotation and displacement information calculating matrix
   * @method fromRT
   * @typescript
   * fromRT<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, q: Quat, v: VecLike): Out
   * @static
   */
  ;

  Mat4.fromRT = function fromRT(out, q, v) {
    var x = q.x,
        y = q.y,
        z = q.z,
        w = q.w;
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var m = out.m;
    m[0] = 1 - (yy + zz);
    m[1] = xy + wz;
    m[2] = xz - wy;
    m[3] = 0;
    m[4] = xy - wz;
    m[5] = 1 - (xx + zz);
    m[6] = yz + wx;
    m[7] = 0;
    m[8] = xz + wy;
    m[9] = yz - wx;
    m[10] = 1 - (xx + yy);
    m[11] = 0;
    m[12] = v.x;
    m[13] = v.y;
    m[14] = v.z;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 提取矩阵的位移信息, 默认矩阵中的变换以 S->R->T 的顺序应用
   * !#en Extracting displacement information of the matrix, the matrix transform to the default sequential application S-> R-> T is
   * @method getTranslation
   * @typescript
   * getTranslation<Out extends IMat4Like, VecLike extends IVec3Like> (out: VecLike, mat: Out): VecLike
   * @static
   */
  ;

  Mat4.getTranslation = function getTranslation(out, mat) {
    var m = mat.m;
    out.x = m[12];
    out.y = m[13];
    out.z = m[14];
    return out;
  }
  /**
   * !#zh 提取矩阵的缩放信息, 默认矩阵中的变换以 S->R->T 的顺序应用
   * !#en Scaling information extraction matrix, the matrix transform to the default sequential application S-> R-> T is
   * @method getScaling
   * @typescript
   * getScaling<Out extends IMat4Like, VecLike extends IVec3Like> (out: VecLike, mat: Out): VecLike
   * @static
   */
  ;

  Mat4.getScaling = function getScaling(out, mat) {
    var m = mat.m;
    var m3 = m3_1.m;
    var m00 = m3[0] = m[0];
    var m01 = m3[1] = m[1];
    var m02 = m3[2] = m[2];
    var m04 = m3[3] = m[4];
    var m05 = m3[4] = m[5];
    var m06 = m3[5] = m[6];
    var m08 = m3[6] = m[8];
    var m09 = m3[7] = m[9];
    var m10 = m3[8] = m[10];
    out.x = Math.sqrt(m00 * m00 + m01 * m01 + m02 * m02);
    out.y = Math.sqrt(m04 * m04 + m05 * m05 + m06 * m06);
    out.z = Math.sqrt(m08 * m08 + m09 * m09 + m10 * m10); // account for refections

    if (_mat["default"].determinant(m3_1) < 0) {
      out.x *= -1;
    }

    return out;
  }
  /**
   * !#zh 提取矩阵的旋转信息, 默认输入矩阵不含有缩放信息，如考虑缩放应使用 `toRTS` 函数。
   * !#en Rotation information extraction matrix, the matrix containing no default input scaling information, such as the use of `toRTS` should consider the scaling function.
   * @method getRotation
   * @typescript
   * getRotation<Out extends IMat4Like> (out: Quat, mat: Out): Quat
   * @static
   */
  ;

  Mat4.getRotation = function getRotation(out, mat) {
    var m = mat.m;
    var trace = m[0] + m[5] + m[10];
    var S = 0;

    if (trace > 0) {
      S = Math.sqrt(trace + 1.0) * 2;
      out.w = 0.25 * S;
      out.x = (m[6] - m[9]) / S;
      out.y = (m[8] - m[2]) / S;
      out.z = (m[1] - m[4]) / S;
    } else if (m[0] > m[5] && m[0] > m[10]) {
      S = Math.sqrt(1.0 + m[0] - m[5] - m[10]) * 2;
      out.w = (m[6] - m[9]) / S;
      out.x = 0.25 * S;
      out.y = (m[1] + m[4]) / S;
      out.z = (m[8] + m[2]) / S;
    } else if (m[5] > m[10]) {
      S = Math.sqrt(1.0 + m[5] - m[0] - m[10]) * 2;
      out.w = (m[8] - m[2]) / S;
      out.x = (m[1] + m[4]) / S;
      out.y = 0.25 * S;
      out.z = (m[6] + m[9]) / S;
    } else {
      S = Math.sqrt(1.0 + m[10] - m[0] - m[5]) * 2;
      out.w = (m[1] - m[4]) / S;
      out.x = (m[8] + m[2]) / S;
      out.y = (m[6] + m[9]) / S;
      out.z = 0.25 * S;
    }

    return out;
  }
  /**
   * !#zh 提取旋转、位移、缩放信息， 默认矩阵中的变换以 S->R->T 的顺序应用
   * !#en Extracting rotational displacement, zoom information, the default matrix transformation in order S-> R-> T applications
   * @method toRTS
   * @typescript
   * toRTS<Out extends IMat4Like, VecLike extends IVec3Like> (mat: Out, q: Quat, v: VecLike, s: VecLike): void
   * @static
   */
  ;

  Mat4.toRTS = function toRTS(mat, q, v, s) {
    var m = mat.m;
    var m3 = m3_1.m;
    s.x = _vec["default"].set(v3_1, m[0], m[1], m[2]).mag();
    m3[0] = m[0] / s.x;
    m3[1] = m[1] / s.x;
    m3[2] = m[2] / s.x;
    s.y = _vec["default"].set(v3_1, m[4], m[5], m[6]).mag();
    m3[3] = m[4] / s.y;
    m3[4] = m[5] / s.y;
    m3[5] = m[6] / s.y;
    s.z = _vec["default"].set(v3_1, m[8], m[9], m[10]).mag();
    m3[6] = m[8] / s.z;
    m3[7] = m[9] / s.z;
    m3[8] = m[10] / s.z;

    var det = _mat["default"].determinant(m3_1);

    if (det < 0) {
      s.x *= -1;
      m3[0] *= -1;
      m3[1] *= -1;
      m3[2] *= -1;
    }

    _quat["default"].fromMat3(q, m3_1); // already normalized


    _vec["default"].set(v, m[12], m[13], m[14]);
  }
  /**
   * !#zh 根据旋转、位移、缩放信息计算矩阵，以 S->R->T 的顺序应用
   * !#en The rotary displacement, the scaling matrix calculation information, the order S-> R-> T applications
   * @method fromRTS
   * @typescript
   * fromRTS<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, q: Quat, v: VecLike, s: VecLike): Out
   * @static
   */
  ;

  Mat4.fromRTS = function fromRTS(out, q, v, s) {
    var x = q.x,
        y = q.y,
        z = q.z,
        w = q.w;
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s.x;
    var sy = s.y;
    var sz = s.z;
    var m = out.m;
    m[0] = (1 - (yy + zz)) * sx;
    m[1] = (xy + wz) * sx;
    m[2] = (xz - wy) * sx;
    m[3] = 0;
    m[4] = (xy - wz) * sy;
    m[5] = (1 - (xx + zz)) * sy;
    m[6] = (yz + wx) * sy;
    m[7] = 0;
    m[8] = (xz + wy) * sz;
    m[9] = (yz - wx) * sz;
    m[10] = (1 - (xx + yy)) * sz;
    m[11] = 0;
    m[12] = v.x;
    m[13] = v.y;
    m[14] = v.z;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 根据指定的旋转、位移、缩放及变换中心信息计算矩阵，以 S->R->T 的顺序应用
   * !#en According to the specified rotation, displacement, and scale conversion matrix calculation information center, order S-> R-> T applications
   * @method fromRTSOrigin
   * @typescript
   * fromRTSOrigin<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, q: Quat, v: VecLike, s: VecLike, o: VecLike): Out
   * @param q 旋转值
   * @param v 位移值
   * @param s 缩放值
   * @param o 指定变换中心
   * @static
   */
  ;

  Mat4.fromRTSOrigin = function fromRTSOrigin(out, q, v, s, o) {
    var x = q.x,
        y = q.y,
        z = q.z,
        w = q.w;
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s.x;
    var sy = s.y;
    var sz = s.z;
    var ox = o.x;
    var oy = o.y;
    var oz = o.z;
    var m = out.m;
    m[0] = (1 - (yy + zz)) * sx;
    m[1] = (xy + wz) * sx;
    m[2] = (xz - wy) * sx;
    m[3] = 0;
    m[4] = (xy - wz) * sy;
    m[5] = (1 - (xx + zz)) * sy;
    m[6] = (yz + wx) * sy;
    m[7] = 0;
    m[8] = (xz + wy) * sz;
    m[9] = (yz - wx) * sz;
    m[10] = (1 - (xx + yy)) * sz;
    m[11] = 0;
    m[12] = v.x + ox - (m[0] * ox + m[4] * oy + m[8] * oz);
    m[13] = v.y + oy - (m[1] * ox + m[5] * oy + m[9] * oz);
    m[14] = v.z + oz - (m[2] * ox + m[6] * oy + m[10] * oz);
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 根据指定的旋转信息计算矩阵
   * !#en The rotation matrix calculation information specified
   * @method fromQuat
   * @typescript
   * fromQuat<Out extends IMat4Like> (out: Out, q: Quat): Out
   * @static
   */
  ;

  Mat4.fromQuat = function fromQuat(out, q) {
    var x = q.x,
        y = q.y,
        z = q.z,
        w = q.w;
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var yx = y * x2;
    var yy = y * y2;
    var zx = z * x2;
    var zy = z * y2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var m = out.m;
    m[0] = 1 - yy - zz;
    m[1] = yx + wz;
    m[2] = zx - wy;
    m[3] = 0;
    m[4] = yx - wz;
    m[5] = 1 - xx - zz;
    m[6] = zy + wx;
    m[7] = 0;
    m[8] = zx + wy;
    m[9] = zy - wx;
    m[10] = 1 - xx - yy;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 根据指定的视锥体信息计算矩阵
   * !#en The matrix calculation information specified frustum
   * @method frustum
   * @typescript
   * frustum<Out extends IMat4Like> (out: Out, left: number, right: number, bottom: number, top: number, near: number, far: number): Out
   * @param left 左平面距离
   * @param right 右平面距离
   * @param bottom 下平面距离
   * @param top 上平面距离
   * @param near 近平面距离
   * @param far 远平面距离
   * @static
   */
  ;

  Mat4.frustum = function frustum(out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left);
    var tb = 1 / (top - bottom);
    var nf = 1 / (near - far);
    var m = out.m;
    m[0] = near * 2 * rl;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = near * 2 * tb;
    m[6] = 0;
    m[7] = 0;
    m[8] = (right + left) * rl;
    m[9] = (top + bottom) * tb;
    m[10] = (far + near) * nf;
    m[11] = -1;
    m[12] = 0;
    m[13] = 0;
    m[14] = far * near * 2 * nf;
    m[15] = 0;
    return out;
  }
  /**
   * !#zh 计算透视投影矩阵
   * !#en Perspective projection matrix calculation
   * @method perspective
   * @typescript
   * perspective<Out extends IMat4Like> (out: Out, fovy: number, aspect: number, near: number, far: number): Out
   * @param fovy 纵向视角高度
   * @param aspect 长宽比
   * @param near 近平面距离
   * @param far 远平面距离
   * @static
   */
  ;

  Mat4.perspective = function perspective(out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2);
    var nf = 1 / (near - far);
    var m = out.m;
    m[0] = f / aspect;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = f;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = (far + near) * nf;
    m[11] = -1;
    m[12] = 0;
    m[13] = 0;
    m[14] = 2 * far * near * nf;
    m[15] = 0;
    return out;
  }
  /**
   * !#zh 计算正交投影矩阵
   * !#en Computing orthogonal projection matrix
   * @method ortho
   * @typescript
   * ortho<Out extends IMat4Like> (out: Out, left: number, right: number, bottom: number, top: number, near: number, far: number): Out
   * @param left 左平面距离
   * @param right 右平面距离
   * @param bottom 下平面距离
   * @param top 上平面距离
   * @param near 近平面距离
   * @param far 远平面距离
   * @static
   */
  ;

  Mat4.ortho = function ortho(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    var m = out.m;
    m[0] = -2 * lr;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = -2 * bt;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = 2 * nf;
    m[11] = 0;
    m[12] = (left + right) * lr;
    m[13] = (top + bottom) * bt;
    m[14] = (far + near) * nf;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 根据视点计算矩阵，注意 `eye - center` 不能为零向量或与 `up` 向量平行
   * !#en `Up` parallel vector or vector center` not be zero - the matrix calculation according to the viewpoint, note` eye
   * @method lookAt
   * @typescript
   * lookAt<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, eye: VecLike, center: VecLike, up: VecLike): Out
   * @param eye 当前位置
   * @param center 目标视点
   * @param up 视口上方向
   * @static
   */
  ;

  Mat4.lookAt = function lookAt(out, eye, center, up) {
    var eyex = eye.x;
    var eyey = eye.y;
    var eyez = eye.z;
    var upx = up.x;
    var upy = up.y;
    var upz = up.z;
    var centerx = center.x;
    var centery = center.y;
    var centerz = center.z;
    var z0 = eyex - centerx;
    var z1 = eyey - centery;
    var z2 = eyez - centerz;
    var len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    var x0 = upy * z2 - upz * z1;
    var x1 = upz * z0 - upx * z2;
    var x2 = upx * z1 - upy * z0;
    len = 1 / Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    x0 *= len;
    x1 *= len;
    x2 *= len;
    var y0 = z1 * x2 - z2 * x1;
    var y1 = z2 * x0 - z0 * x2;
    var y2 = z0 * x1 - z1 * x0;
    var m = out.m;
    m[0] = x0;
    m[1] = y0;
    m[2] = z0;
    m[3] = 0;
    m[4] = x1;
    m[5] = y1;
    m[6] = z1;
    m[7] = 0;
    m[8] = x2;
    m[9] = y2;
    m[10] = z2;
    m[11] = 0;
    m[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    m[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    m[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 计算逆转置矩阵
   * !#en Reversal matrix calculation
   * @method inverseTranspose
   * @typescript
   * inverseTranspose<Out extends IMat4Like> (out: Out, a: Out): Out
   * @static
   */
  ;

  Mat4.inverseTranspose = function inverseTranspose(out, a) {
    var m = a.m;
    _a00 = m[0];
    _a01 = m[1];
    _a02 = m[2];
    _a03 = m[3];
    _a10 = m[4];
    _a11 = m[5];
    _a12 = m[6];
    _a13 = m[7];
    _a20 = m[8];
    _a21 = m[9];
    _a22 = m[10];
    _a23 = m[11];
    _a30 = m[12];
    _a31 = m[13];
    _a32 = m[14];
    _a33 = m[15];
    var b00 = _a00 * _a11 - _a01 * _a10;
    var b01 = _a00 * _a12 - _a02 * _a10;
    var b02 = _a00 * _a13 - _a03 * _a10;
    var b03 = _a01 * _a12 - _a02 * _a11;
    var b04 = _a01 * _a13 - _a03 * _a11;
    var b05 = _a02 * _a13 - _a03 * _a12;
    var b06 = _a20 * _a31 - _a21 * _a30;
    var b07 = _a20 * _a32 - _a22 * _a30;
    var b08 = _a20 * _a33 - _a23 * _a30;
    var b09 = _a21 * _a32 - _a22 * _a31;
    var b10 = _a21 * _a33 - _a23 * _a31;
    var b11 = _a22 * _a33 - _a23 * _a32; // Calculate the determinant

    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return null;
    }

    det = 1.0 / det;
    m = out.m;
    m[0] = (_a11 * b11 - _a12 * b10 + _a13 * b09) * det;
    m[1] = (_a12 * b08 - _a10 * b11 - _a13 * b07) * det;
    m[2] = (_a10 * b10 - _a11 * b08 + _a13 * b06) * det;
    m[3] = 0;
    m[4] = (_a02 * b10 - _a01 * b11 - _a03 * b09) * det;
    m[5] = (_a00 * b11 - _a02 * b08 + _a03 * b07) * det;
    m[6] = (_a01 * b08 - _a00 * b10 - _a03 * b06) * det;
    m[7] = 0;
    m[8] = (_a31 * b05 - _a32 * b04 + _a33 * b03) * det;
    m[9] = (_a32 * b02 - _a30 * b05 - _a33 * b01) * det;
    m[10] = (_a30 * b04 - _a31 * b02 + _a33 * b00) * det;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 逐元素矩阵加法
   * !#en Element by element matrix addition
   * @method add
   * @typescript
   * add<Out extends IMat4Like> (out: Out, a: Out, b: Out): Out
   * @static
   */
  ;

  Mat4.add = function add(out, a, b) {
    var m = out.m,
        am = a.m,
        bm = b.m;
    m[0] = am[0] + bm[0];
    m[1] = am[1] + bm[1];
    m[2] = am[2] + bm[2];
    m[3] = am[3] + bm[3];
    m[4] = am[4] + bm[4];
    m[5] = am[5] + bm[5];
    m[6] = am[6] + bm[6];
    m[7] = am[7] + bm[7];
    m[8] = am[8] + bm[8];
    m[9] = am[9] + bm[9];
    m[10] = am[10] + bm[10];
    m[11] = am[11] + bm[11];
    m[12] = am[12] + bm[12];
    m[13] = am[13] + bm[13];
    m[14] = am[14] + bm[14];
    m[15] = am[15] + bm[15];
    return out;
  }
  /**
   * !#zh 逐元素矩阵减法
   * !#en Matrix element by element subtraction
   * @method subtract
   * @typescript
   * subtract<Out extends IMat4Like> (out: Out, a: Out, b: Out): Out
   * @static
   */
  ;

  Mat4.subtract = function subtract(out, a, b) {
    var m = out.m,
        am = a.m,
        bm = b.m;
    m[0] = am[0] - bm[0];
    m[1] = am[1] - bm[1];
    m[2] = am[2] - bm[2];
    m[3] = am[3] - bm[3];
    m[4] = am[4] - bm[4];
    m[5] = am[5] - bm[5];
    m[6] = am[6] - bm[6];
    m[7] = am[7] - bm[7];
    m[8] = am[8] - bm[8];
    m[9] = am[9] - bm[9];
    m[10] = am[10] - bm[10];
    m[11] = am[11] - bm[11];
    m[12] = am[12] - bm[12];
    m[13] = am[13] - bm[13];
    m[14] = am[14] - bm[14];
    m[15] = am[15] - bm[15];
    return out;
  }
  /**
   * !#zh 矩阵标量乘法
   * !#en Matrix scalar multiplication
   * @method multiplyScalar
   * @typescript
   * multiplyScalar<Out extends IMat4Like> (out: Out, a: Out, b: number): Out
   * @static
   */
  ;

  Mat4.multiplyScalar = function multiplyScalar(out, a, b) {
    var m = out.m,
        am = a.m;
    m[0] = am[0] * b;
    m[1] = am[1] * b;
    m[2] = am[2] * b;
    m[3] = am[3] * b;
    m[4] = am[4] * b;
    m[5] = am[5] * b;
    m[6] = am[6] * b;
    m[7] = am[7] * b;
    m[8] = am[8] * b;
    m[9] = am[9] * b;
    m[10] = am[10] * b;
    m[11] = am[11] * b;
    m[12] = am[12] * b;
    m[13] = am[13] * b;
    m[14] = am[14] * b;
    m[15] = am[15] * b;
    return out;
  }
  /**
   * !#zh 逐元素矩阵标量乘加: A + B * scale
   * !#en Elements of the matrix by the scalar multiplication and addition: A + B * scale
   * @method multiplyScalarAndAdd
   * @typescript
   * multiplyScalarAndAdd<Out extends IMat4Like> (out: Out, a: Out, b: Out, scale: number): Out
   * @static
   */
  ;

  Mat4.multiplyScalarAndAdd = function multiplyScalarAndAdd(out, a, b, scale) {
    var m = out.m,
        am = a.m,
        bm = b.m;
    m[0] = am[0] + bm[0] * scale;
    m[1] = am[1] + bm[1] * scale;
    m[2] = am[2] + bm[2] * scale;
    m[3] = am[3] + bm[3] * scale;
    m[4] = am[4] + bm[4] * scale;
    m[5] = am[5] + bm[5] * scale;
    m[6] = am[6] + bm[6] * scale;
    m[7] = am[7] + bm[7] * scale;
    m[8] = am[8] + bm[8] * scale;
    m[9] = am[9] + bm[9] * scale;
    m[10] = am[10] + bm[10] * scale;
    m[11] = am[11] + bm[11] * scale;
    m[12] = am[12] + bm[12] * scale;
    m[13] = am[13] + bm[13] * scale;
    m[14] = am[14] + bm[14] * scale;
    m[15] = am[15] + bm[15] * scale;
    return out;
  }
  /**
   * !#zh 矩阵等价判断
   * !#en Analyzing the equivalent matrix
   * @method strictEquals
   * @return {bool}
   * @typescript
   * strictEquals<Out extends IMat4Like> (a: Out, b: Out): boolean
   * @static
   */
  ;

  Mat4.strictEquals = function strictEquals(a, b) {
    var am = a.m,
        bm = b.m;
    return am[0] === bm[0] && am[1] === bm[1] && am[2] === bm[2] && am[3] === bm[3] && am[4] === bm[4] && am[5] === bm[5] && am[6] === bm[6] && am[7] === bm[7] && am[8] === bm[8] && am[9] === bm[9] && am[10] === bm[10] && am[11] === bm[11] && am[12] === bm[12] && am[13] === bm[13] && am[14] === bm[14] && am[15] === bm[15];
  }
  /**
   * !#zh 排除浮点数误差的矩阵近似等价判断
   * !#en Negative floating point error is approximately equivalent to determining a matrix
   * @method equals
   * @typescript
   * equals<Out extends IMat4Like> (a: Out, b: Out, epsilon?: number): boolean
   * @static
   */
  ;

  Mat4.equals = function equals(a, b, epsilon) {
    if (epsilon === void 0) {
      epsilon = _utils.EPSILON;
    }

    var am = a.m,
        bm = b.m;
    return Math.abs(am[0] - bm[0]) <= epsilon * Math.max(1.0, Math.abs(am[0]), Math.abs(bm[0])) && Math.abs(am[1] - bm[1]) <= epsilon * Math.max(1.0, Math.abs(am[1]), Math.abs(bm[1])) && Math.abs(am[2] - bm[2]) <= epsilon * Math.max(1.0, Math.abs(am[2]), Math.abs(bm[2])) && Math.abs(am[3] - bm[3]) <= epsilon * Math.max(1.0, Math.abs(am[3]), Math.abs(bm[3])) && Math.abs(am[4] - bm[4]) <= epsilon * Math.max(1.0, Math.abs(am[4]), Math.abs(bm[4])) && Math.abs(am[5] - bm[5]) <= epsilon * Math.max(1.0, Math.abs(am[5]), Math.abs(bm[5])) && Math.abs(am[6] - bm[6]) <= epsilon * Math.max(1.0, Math.abs(am[6]), Math.abs(bm[6])) && Math.abs(am[7] - bm[7]) <= epsilon * Math.max(1.0, Math.abs(am[7]), Math.abs(bm[7])) && Math.abs(am[8] - bm[8]) <= epsilon * Math.max(1.0, Math.abs(am[8]), Math.abs(bm[8])) && Math.abs(am[9] - bm[9]) <= epsilon * Math.max(1.0, Math.abs(am[9]), Math.abs(bm[9])) && Math.abs(am[10] - bm[10]) <= epsilon * Math.max(1.0, Math.abs(am[10]), Math.abs(bm[10])) && Math.abs(am[11] - bm[11]) <= epsilon * Math.max(1.0, Math.abs(am[11]), Math.abs(bm[11])) && Math.abs(am[12] - bm[12]) <= epsilon * Math.max(1.0, Math.abs(am[12]), Math.abs(bm[12])) && Math.abs(am[13] - bm[13]) <= epsilon * Math.max(1.0, Math.abs(am[13]), Math.abs(bm[13])) && Math.abs(am[14] - bm[14]) <= epsilon * Math.max(1.0, Math.abs(am[14]), Math.abs(bm[14])) && Math.abs(am[15] - bm[15]) <= epsilon * Math.max(1.0, Math.abs(am[15]), Math.abs(bm[15]));
  }
  /**
   * Calculates the adjugate of a matrix.
   *
   * @param {Mat4} out - Matrix to store result.
   * @param {Mat4} a - Matrix to calculate.
   * @returns {Mat4} out.
   */
  ;

  Mat4.adjoint = function adjoint(out, a) {
    var am = a.m,
        outm = out.m;
    var a00 = am[0],
        a01 = am[1],
        a02 = am[2],
        a03 = am[3],
        a10 = am[4],
        a11 = am[5],
        a12 = am[6],
        a13 = am[7],
        a20 = am[8],
        a21 = am[9],
        a22 = am[10],
        a23 = am[11],
        a30 = am[12],
        a31 = am[13],
        a32 = am[14],
        a33 = am[15];
    outm[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
    outm[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    outm[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
    outm[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    outm[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    outm[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
    outm[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    outm[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
    outm[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
    outm[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    outm[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
    outm[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    outm[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    outm[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
    outm[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    outm[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
    return out;
  }
  /**
   * !#zh 矩阵转数组
   * !#en Matrix transpose array
   * @method toArray
   * @typescript
   * toArray <Out extends IWritableArrayLike<number>> (out: Out, mat: IMat4Like, ofs?: number): Out
   * @param ofs 数组内的起始偏移量
   * @static
   */
  ;

  Mat4.toArray = function toArray(out, mat, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    var m = mat.m;

    for (var i = 0; i < 16; i++) {
      out[ofs + i] = m[i];
    }

    return out;
  }
  /**
   * !#zh 数组转矩阵
   * !#en Transfer matrix array
   * @method fromArray
   * @typescript
   * fromArray <Out extends IMat4Like> (out: Out, arr: IWritableArrayLike<number>, ofs?: number): Out
   * @param ofs 数组起始偏移量
   * @static
   */
  ;

  Mat4.fromArray = function fromArray(out, arr, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    var m = out.m;

    for (var i = 0; i < 16; i++) {
      m[i] = arr[ofs + i];
    }

    return out;
  }
  /**
   * !#en Matrix Data
   * !#zh 矩阵数据
   * @property {Float64Array | Float32Array} m
   */
  ;

  /**
   * !#en
   * Constructor
   * see {{#crossLink "cc/mat4:method"}}cc.mat4{{/crossLink}}
   * !#zh
   * 构造函数，可查看 {{#crossLink "cc/mat4:method"}}cc.mat4{{/crossLink}}
   * @method constructor
   * @typescript
   * constructor ( m00?: number, m01?: number, m02?: number, m03?: number, m10?: number, m11?: number, m12?: number, m13?: number, m20?: number, m21?: number, m22?: number, m23?: number, m30?: number, m31?: number, m32?: number, m33?: number)
   */
  function Mat4(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    var _this;

    if (m00 === void 0) {
      m00 = 1;
    }

    if (m01 === void 0) {
      m01 = 0;
    }

    if (m02 === void 0) {
      m02 = 0;
    }

    if (m03 === void 0) {
      m03 = 0;
    }

    if (m10 === void 0) {
      m10 = 0;
    }

    if (m11 === void 0) {
      m11 = 1;
    }

    if (m12 === void 0) {
      m12 = 0;
    }

    if (m13 === void 0) {
      m13 = 0;
    }

    if (m20 === void 0) {
      m20 = 0;
    }

    if (m21 === void 0) {
      m21 = 0;
    }

    if (m22 === void 0) {
      m22 = 1;
    }

    if (m23 === void 0) {
      m23 = 0;
    }

    if (m30 === void 0) {
      m30 = 0;
    }

    if (m31 === void 0) {
      m31 = 0;
    }

    if (m32 === void 0) {
      m32 = 0;
    }

    if (m33 === void 0) {
      m33 = 1;
    }

    _this = _ValueType.call(this) || this;
    _this.m = void 0;

    if (m00 instanceof _utils.FLOAT_ARRAY_TYPE) {
      _this.m = m00;
    } else {
      _this.m = new _utils.FLOAT_ARRAY_TYPE(16);
      var tm = _this.m;
      tm[0] = m00;
      tm[1] = m01;
      tm[2] = m02;
      tm[3] = m03;
      tm[4] = m10;
      tm[5] = m11;
      tm[6] = m12;
      tm[7] = m13;
      tm[8] = m20;
      tm[9] = m21;
      tm[10] = m22;
      tm[11] = m23;
      tm[12] = m30;
      tm[13] = m31;
      tm[14] = m32;
      tm[15] = m33;
    }

    return _this;
  }
  /**
   * !#en clone a Mat4 object
   * !#zh 克隆一个 Mat4 对象
   * @method clone
   * @return {Mat4}
   */


  _proto.clone = function clone() {
    var t = this;
    var tm = t.m;
    return new Mat4(tm[0], tm[1], tm[2], tm[3], tm[4], tm[5], tm[6], tm[7], tm[8], tm[9], tm[10], tm[11], tm[12], tm[13], tm[14], tm[15]);
  }
  /**
   * !#en Sets the matrix with another one's value
   * !#zh 用另一个矩阵设置这个矩阵的值。
   * @method set
   * @param {Mat4} srcObj
   * @return {Mat4} returns this
   * @chainable
   */
  ;

  _proto.set = function set(s) {
    var t = this;
    var tm = t.m,
        sm = s.m;
    tm[0] = sm[0];
    tm[1] = sm[1];
    tm[2] = sm[2];
    tm[3] = sm[3];
    tm[4] = sm[4];
    tm[5] = sm[5];
    tm[6] = sm[6];
    tm[7] = sm[7];
    tm[8] = sm[8];
    tm[9] = sm[9];
    tm[10] = sm[10];
    tm[11] = sm[11];
    tm[12] = sm[12];
    tm[13] = sm[13];
    tm[14] = sm[14];
    tm[15] = sm[15];
    return this;
  }
  /**
   * !#en Check whether two matrix equal
   * !#zh 当前的矩阵是否与指定的矩阵相等。
   * @method equals
   * @param {Mat4} other
   * @return {Boolean}
   */
  ;

  _proto.equals = function equals(other) {
    return Mat4.strictEquals(this, other);
  }
  /**
   * !#en Check whether two matrix equal with default degree of variance.
   * !#zh
   * 近似判断两个矩阵是否相等。<br/>
   * 判断 2 个矩阵是否在默认误差范围之内，如果在则返回 true，反之则返回 false。
   * @method fuzzyEquals
   * @param {Mat4} other
   * @return {Boolean}
   */
  ;

  _proto.fuzzyEquals = function fuzzyEquals(other) {
    return Mat4.equals(this, other);
  }
  /**
   * !#en Transform to string with matrix informations
   * !#zh 转换为方便阅读的字符串。
   * @method toString
   * @return {string}
   */
  ;

  _proto.toString = function toString() {
    var tm = this.m;

    if (tm) {
      return "[\n" + tm[0] + ", " + tm[1] + ", " + tm[2] + ", " + tm[3] + ",\n" + tm[4] + ", " + tm[5] + ", " + tm[6] + ", " + tm[7] + ",\n" + tm[8] + ", " + tm[9] + ", " + tm[10] + ", " + tm[11] + ",\n" + tm[12] + ", " + tm[13] + ", " + tm[14] + ", " + tm[15] + "\n" + "]";
    } else {
      return "[\n" + "1, 0, 0, 0\n" + "0, 1, 0, 0\n" + "0, 0, 1, 0\n" + "0, 0, 0, 1\n" + "]";
    }
  }
  /**
   * Set the matrix to the identity matrix
   * @method identity
   * @returns {Mat4} self
   * @chainable
   */
  ;

  _proto.identity = function identity() {
    return Mat4.identity(this);
  }
  /**
   * Transpose the values of a mat4
   * @method transpose
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created.
   * @returns {Mat4} out
   */
  ;

  _proto.transpose = function transpose(out) {
    out = out || new Mat4();
    return Mat4.transpose(out, this);
  }
  /**
   * Inverts a mat4
   * @method invert
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created.
   * @returns {Mat4} out
   */
  ;

  _proto.invert = function invert(out) {
    out = out || new Mat4();
    return Mat4.invert(out, this);
  }
  /**
   * Calculates the adjugate of a mat4
   * @method adjoint
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created.
   * @returns {Mat4} out
   */
  ;

  _proto.adjoint = function adjoint(out) {
    out = out || new Mat4();
    return Mat4.adjoint(out, this);
  }
  /**
   * Calculates the determinant of a mat4
   * @method determinant
   * @returns {Number} determinant of a
   */
  ;

  _proto.determinant = function determinant() {
    return Mat4.determinant(this);
  }
  /**
   * Adds two Mat4
   * @method add
   * @param {Mat4} other the second operand
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created.
   * @returns {Mat4} out
   */
  ;

  _proto.add = function add(other, out) {
    out = out || new Mat4();
    return Mat4.add(out, this, other);
  }
  /**
   * Subtracts the current matrix with another one
   * @method subtract
   * @param {Mat4} other the second operand
   * @returns {Mat4} this
   */
  ;

  _proto.subtract = function subtract(other) {
    return Mat4.subtract(this, this, other);
  }
  /**
   * Subtracts the current matrix with another one
   * @method multiply
   * @param {Mat4} other the second operand
   * @returns {Mat4} this
   */
  ;

  _proto.multiply = function multiply(other) {
    return Mat4.multiply(this, this, other);
  }
  /**
   * Multiply each element of the matrix by a scalar.
   * @method multiplyScalar
   * @param {Number} number amount to scale the matrix's elements by
   * @returns {Mat4} this
   */
  ;

  _proto.multiplyScalar = function multiplyScalar(number) {
    return Mat4.multiplyScalar(this, this, number);
  }
  /**
   * Translate a mat4 by the given vector
   * @method translate
   * @param {Vec3} v vector to translate by
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
   * @returns {Mat4} out
   */
  ;

  _proto.translate = function translate(v, out) {
    out = out || new Mat4();
    return Mat4.translate(out, this, v);
  }
  /**
   * Scales the mat4 by the dimensions in the given vec3
   * @method scale
   * @param {Vec3} v vector to scale by
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
   * @returns {Mat4} out
   */
  ;

  _proto.scale = function scale(v, out) {
    out = out || new Mat4();
    return Mat4.scale(out, this, v);
  }
  /**
   * Rotates a mat4 by the given angle around the given axis
   * @method rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @param {Vec3} axis the axis to rotate around
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
   * @returns {Mat4} out
   */
  ;

  _proto.rotate = function rotate(rad, axis, out) {
    out = out || new Mat4();
    return Mat4.rotate(out, this, rad, axis);
  }
  /**
   * Returns the translation vector component of a transformation matrix.
   * @method getTranslation
   * @param  {Vec3} out Vector to receive translation component, if not provided, a new vec3 will be created
   * @return {Vec3} out
   */
  ;

  _proto.getTranslation = function getTranslation(out) {
    out = out || new _vec["default"]();
    return Mat4.getTranslation(out, this);
  }
  /**
   * Returns the scale factor component of a transformation matrix
   * @method getScale
   * @param  {Vec3} out Vector to receive scale component, if not provided, a new vec3 will be created
   * @return {Vec3} out
   */
  ;

  _proto.getScale = function getScale(out) {
    out = out || new _vec["default"]();
    return Mat4.getScaling(out, this);
  }
  /**
   * Returns the rotation factor component of a transformation matrix
   * @method getRotation
   * @param  {Quat} out Vector to receive rotation component, if not provided, a new quaternion object will be created
   * @return {Quat} out
   */
  ;

  _proto.getRotation = function getRotation(out) {
    out = out || new _quat["default"]();
    return Mat4.getRotation(out, this);
  }
  /**
   * Restore the matrix values from a quaternion rotation, vector translation and vector scale
   * @method fromRTS
   * @param {Quat} q Rotation quaternion
   * @param {Vec3} v Translation vector
   * @param {Vec3} s Scaling vector
   * @returns {Mat4} the current mat4 object
   * @chainable
   */
  ;

  _proto.fromRTS = function fromRTS(q, v, s) {
    return Mat4.fromRTS(this, q, v, s);
  }
  /**
   * Restore the matrix values from a quaternion rotation
   * @method fromQuat
   * @param {Quat} q Rotation quaternion
   * @returns {Mat4} the current mat4 object
   * @chainable
   */
  ;

  _proto.fromQuat = function fromQuat(quat) {
    return Mat4.fromQuat(this, quat);
  };

  return Mat4;
}(_valueType["default"]);

exports["default"] = Mat4;
Mat4.mul = Mat4.multiply;
Mat4.sub = Mat4.subtract;
Mat4.IDENTITY = Object.freeze(new Mat4());
var v3_1 = new _vec["default"]();
var m3_1 = new _mat["default"]();

_CCClass["default"].fastDefine('cc.Mat4', Mat4, {
  m00: 1,
  m01: 0,
  m02: 0,
  m03: 0,
  m04: 0,
  m05: 1,
  m06: 0,
  m07: 0,
  m08: 0,
  m09: 0,
  m10: 1,
  m11: 0,
  m12: 0,
  m13: 0,
  m14: 0,
  m15: 1
});

var _loop = function _loop(i) {
  Object.defineProperty(Mat4.prototype, 'm' + i, {
    get: function get() {
      return this.m[i];
    },
    set: function set(value) {
      this.m[i] = value;
    }
  });
};

for (var i = 0; i < 16; i++) {
  _loop(i);
}
/**
 * @module cc
 */

/**
 * !#en The convenience method to create a new {{#crossLink "Mat4"}}cc.Mat4{{/crossLink}}.
 * !#zh 通过该简便的函数进行创建 {{#crossLink "Mat4"}}cc.Mat4{{/crossLink}} 对象。
 * @method mat4
 * @param {Number} [m00] Component in column 0, row 0 position (index 0)
 * @param {Number} [m01] Component in column 0, row 1 position (index 1)
 * @param {Number} [m02] Component in column 0, row 2 position (index 2)
 * @param {Number} [m03] Component in column 0, row 3 position (index 3)
 * @param {Number} [m10] Component in column 1, row 0 position (index 4)
 * @param {Number} [m11] Component in column 1, row 1 position (index 5)
 * @param {Number} [m12] Component in column 1, row 2 position (index 6)
 * @param {Number} [m13] Component in column 1, row 3 position (index 7)
 * @param {Number} [m20] Component in column 2, row 0 position (index 8)
 * @param {Number} [m21] Component in column 2, row 1 position (index 9)
 * @param {Number} [m22] Component in column 2, row 2 position (index 10)
 * @param {Number} [m23] Component in column 2, row 3 position (index 11)
 * @param {Number} [m30] Component in column 3, row 0 position (index 12)
 * @param {Number} [m31] Component in column 3, row 1 position (index 13)
 * @param {Number} [m32] Component in column 3, row 2 position (index 14)
 * @param {Number} [m33] Component in column 3, row 3 position (index 15)
 * @return {Mat4}
 */


cc.mat4 = function (m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  var mat = new Mat4(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);

  if (m00 === undefined) {
    Mat4.identity(mat);
  }

  return mat;
};

cc.Mat4 = Mat4;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3ZhbHVlLXR5cGVzL21hdDQudHMiXSwibmFtZXMiOlsiX2EwMCIsIl9hMDEiLCJfYTAyIiwiX2EwMyIsIl9hMTAiLCJfYTExIiwiX2ExMiIsIl9hMTMiLCJfYTIwIiwiX2EyMSIsIl9hMjIiLCJfYTIzIiwiX2EzMCIsIl9hMzEiLCJfYTMyIiwiX2EzMyIsIk1hdDQiLCJtdWwiLCJtIiwib3V0IiwibXVsdGlwbHkiLCJtdWxTY2FsYXIiLCJudW0iLCJtdWx0aXBseVNjYWxhciIsInN1YiIsInN1YnRyYWN0IiwiY2xvbmUiLCJhIiwiY29weSIsImFtIiwic2V0IiwibTAwIiwibTAxIiwibTAyIiwibTAzIiwibTEwIiwibTExIiwibTEyIiwibTEzIiwibTIwIiwibTIxIiwibTIyIiwibTIzIiwibTMwIiwibTMxIiwibTMyIiwibTMzIiwiaWRlbnRpdHkiLCJ0cmFuc3Bvc2UiLCJhMDEiLCJhMDIiLCJhMDMiLCJhMTIiLCJhMTMiLCJhMjMiLCJpbnZlcnQiLCJiMDAiLCJiMDEiLCJiMDIiLCJiMDMiLCJiMDQiLCJiMDUiLCJiMDYiLCJiMDciLCJiMDgiLCJiMDkiLCJiMTAiLCJiMTEiLCJkZXQiLCJkZXRlcm1pbmFudCIsImIiLCJibSIsImIwIiwiYjEiLCJiMiIsImIzIiwidHJhbnNmb3JtIiwidiIsIngiLCJ5IiwieiIsInRyYW5zbGF0ZSIsInNjYWxlIiwicm90YXRlIiwicmFkIiwiYXhpcyIsImxlbiIsIk1hdGgiLCJzcXJ0IiwiYWJzIiwiRVBTSUxPTiIsInMiLCJzaW4iLCJjIiwiY29zIiwidCIsImIxMiIsImIyMCIsImIyMSIsImIyMiIsInJvdGF0ZVgiLCJhMTAiLCJhMTEiLCJhMjAiLCJhMjEiLCJhMjIiLCJyb3RhdGVZIiwiYTAwIiwicm90YXRlWiIsImZyb21UcmFuc2xhdGlvbiIsImZyb21TY2FsaW5nIiwiZnJvbVJvdGF0aW9uIiwiZnJvbVhSb3RhdGlvbiIsImZyb21ZUm90YXRpb24iLCJmcm9tWlJvdGF0aW9uIiwiZnJvbVJUIiwicSIsInciLCJ4MiIsInkyIiwiejIiLCJ4eCIsInh5IiwieHoiLCJ5eSIsInl6IiwienoiLCJ3eCIsInd5Iiwid3oiLCJnZXRUcmFuc2xhdGlvbiIsIm1hdCIsImdldFNjYWxpbmciLCJtMyIsIm0zXzEiLCJtMDQiLCJtMDUiLCJtMDYiLCJtMDgiLCJtMDkiLCJNYXQzIiwiZ2V0Um90YXRpb24iLCJ0cmFjZSIsIlMiLCJ0b1JUUyIsIlZlYzMiLCJ2M18xIiwibWFnIiwiUXVhdCIsImZyb21NYXQzIiwiZnJvbVJUUyIsInN4Iiwic3kiLCJzeiIsImZyb21SVFNPcmlnaW4iLCJvIiwib3giLCJveSIsIm96IiwiZnJvbVF1YXQiLCJ5eCIsInp4IiwienkiLCJmcnVzdHVtIiwibGVmdCIsInJpZ2h0IiwiYm90dG9tIiwidG9wIiwibmVhciIsImZhciIsInJsIiwidGIiLCJuZiIsInBlcnNwZWN0aXZlIiwiZm92eSIsImFzcGVjdCIsImYiLCJ0YW4iLCJvcnRobyIsImxyIiwiYnQiLCJsb29rQXQiLCJleWUiLCJjZW50ZXIiLCJ1cCIsImV5ZXgiLCJleWV5IiwiZXlleiIsInVweCIsInVweSIsInVweiIsImNlbnRlcngiLCJjZW50ZXJ5IiwiY2VudGVyeiIsInowIiwiejEiLCJ4MCIsIngxIiwieTAiLCJ5MSIsImludmVyc2VUcmFuc3Bvc2UiLCJhZGQiLCJtdWx0aXBseVNjYWxhckFuZEFkZCIsInN0cmljdEVxdWFscyIsImVxdWFscyIsImVwc2lsb24iLCJtYXgiLCJhZGpvaW50Iiwib3V0bSIsImEzMCIsImEzMSIsImEzMiIsImEzMyIsInRvQXJyYXkiLCJvZnMiLCJpIiwiZnJvbUFycmF5IiwiYXJyIiwiRkxPQVRfQVJSQVlfVFlQRSIsInRtIiwic20iLCJvdGhlciIsImZ1enp5RXF1YWxzIiwidG9TdHJpbmciLCJudW1iZXIiLCJnZXRTY2FsZSIsInF1YXQiLCJWYWx1ZVR5cGUiLCJJREVOVElUWSIsIk9iamVjdCIsImZyZWV6ZSIsIkNDQ2xhc3MiLCJmYXN0RGVmaW5lIiwibTA3IiwibTE0IiwibTE1IiwiZGVmaW5lUHJvcGVydHkiLCJwcm90b3R5cGUiLCJnZXQiLCJ2YWx1ZSIsImNjIiwibWF0NCIsInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFJQSxJQUFZLEdBQUcsQ0FBbkI7QUFBc0IsSUFBSUMsSUFBWSxHQUFHLENBQW5CO0FBQXNCLElBQUlDLElBQVksR0FBRyxDQUFuQjtBQUFzQixJQUFJQyxJQUFZLEdBQUcsQ0FBbkI7QUFDbEUsSUFBSUMsSUFBWSxHQUFHLENBQW5CO0FBQXNCLElBQUlDLElBQVksR0FBRyxDQUFuQjtBQUFzQixJQUFJQyxJQUFZLEdBQUcsQ0FBbkI7QUFBc0IsSUFBSUMsSUFBWSxHQUFHLENBQW5CO0FBQ2xFLElBQUlDLElBQVksR0FBRyxDQUFuQjtBQUFzQixJQUFJQyxJQUFZLEdBQUcsQ0FBbkI7QUFBc0IsSUFBSUMsSUFBWSxHQUFHLENBQW5CO0FBQXNCLElBQUlDLElBQVksR0FBRyxDQUFuQjtBQUNsRSxJQUFJQyxJQUFZLEdBQUcsQ0FBbkI7QUFBc0IsSUFBSUMsSUFBWSxHQUFHLENBQW5CO0FBQXNCLElBQUlDLElBQVksR0FBRyxDQUFuQjtBQUFzQixJQUFJQyxJQUFZLEdBQUcsQ0FBbkI7QUFFbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0lBQ3FCQzs7Ozs7QUFJakI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtTQUNJQyxNQUFBLGFBQUtDLENBQUwsRUFBY0MsR0FBZCxFQUErQjtBQUMzQixXQUFPSCxJQUFJLENBQUNJLFFBQUwsQ0FBY0QsR0FBRyxJQUFJLElBQUlILElBQUosRUFBckIsRUFBaUMsSUFBakMsRUFBdUNFLENBQXZDLENBQVA7QUFDSDtBQUNEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUNJRyxZQUFBLG1CQUFXQyxHQUFYLEVBQXdC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QjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRVyxFQUFFLENBQUMsRUFBRCxDQUFGLEdBQVMwQyxFQUFFLENBQUMsRUFBRCxDQUFuQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRVyxFQUFFLENBQUMsRUFBRCxDQUFGLEdBQVMwQyxFQUFFLENBQUMsRUFBRCxDQUFuQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRVyxFQUFFLENBQUMsRUFBRCxDQUFGLEdBQVMwQyxFQUFFLENBQUMsRUFBRCxDQUFuQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRVyxFQUFFLENBQUMsRUFBRCxDQUFGLEdBQVMwQyxFQUFFLENBQUMsRUFBRCxDQUFuQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRVyxFQUFFLENBQUMsRUFBRCxDQUFGLEdBQVMwQyxFQUFFLENBQUMsRUFBRCxDQUFuQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRVyxFQUFFLENBQUMsRUFBRCxDQUFGLEdBQVMwQyxFQUFFLENBQUMsRUFBRCxDQUFuQjtBQUNBLFdBQU9wRCxHQUFQO0FBQ0g7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7T0FDV00sV0FBUCxrQkFBd0NOLEdBQXhDLEVBQWtEUSxDQUFsRCxFQUEwRDJDLENBQTFELEVBQWtFO0FBQzlELFFBQUlwRCxDQUFDLEdBQUdDLEdBQUcsQ0FBQ0QsQ0FBWjtBQUFBLFFBQWVXLEVBQUUsR0FBR0YsQ0FBQyxDQUFDVCxDQUF0QjtBQUFBLFFBQXlCcUQsRUFBRSxHQUFHRCxDQUFDLENBQUNwRCxDQUFoQztBQUNBQSxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQWpCO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQWpCO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQWpCO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQWpCO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQWpCO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQWpCO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQWpCO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQWpCO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQWpCO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQWpCO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVFXLEVBQUUsQ0FBQyxFQUFELENBQUYsR0FBUzBDLEVBQUUsQ0FBQyxFQUFELENBQW5CO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVFXLEVBQUUsQ0FBQyxFQUFELENBQUYsR0FBUzBDLEVBQUUsQ0FBQyxFQUFELENBQW5CO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVFXLEVBQUUsQ0FBQyxFQUFELENBQUYsR0FBUzBDLEVBQUUsQ0FBQyxFQUFELENBQW5CO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVFXLEVBQUUsQ0FBQyxFQUFELENBQUYsR0FBUzBDLEVBQUUsQ0FBQyxFQUFELENBQW5CO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVFXLEVBQUUsQ0FBQyxFQUFELENBQUYsR0FBUzBDLEVBQUUsQ0FBQyxFQUFELENBQW5CO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVFXLEVBQUUsQ0FBQyxFQUFELENBQUYsR0FBUzBDLEVBQUUsQ0FBQyxFQUFELENBQW5CO0FBQ0EsV0FBT3BELEdBQVA7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztPQUNXSSxpQkFBUCx3QkFBOENKLEdBQTlDLEVBQXdEUSxDQUF4RCxFQUFn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QUFHLEVBQXBCLEVBQXdCQSxDQUFDLEVBQXpCLEVBQTZCO0FBQUEsUUFBcEJBLENBQW9CO0FBUzVCO0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQXlCLEVBQUUsQ0FBQ0MsSUFBSCxHQUFVLFVBQVVsTixHQUFWLEVBQWVDLEdBQWYsRUFBb0JDLEdBQXBCLEVBQXlCQyxHQUF6QixFQUE4QkMsR0FBOUIsRUFBbUNDLEdBQW5DLEVBQXdDQyxHQUF4QyxFQUE2Q0MsR0FBN0MsRUFBa0RDLEdBQWxELEVBQXVEQyxHQUF2RCxFQUE0REMsR0FBNUQsRUFBaUVDLEdBQWpFLEVBQXNFQyxHQUF0RSxFQUEyRUMsR0FBM0UsRUFBZ0ZDLEdBQWhGLEVBQXFGQyxHQUFyRixFQUEwRjtBQUNoRyxNQUFJcUYsR0FBRyxHQUFHLElBQUluSCxJQUFKLENBQVNlLEdBQVQsRUFBY0MsR0FBZCxFQUFtQkMsR0FBbkIsRUFBd0JDLEdBQXhCLEVBQTZCQyxHQUE3QixFQUFrQ0MsR0FBbEMsRUFBdUNDLEdBQXZDLEVBQTRDQyxHQUE1QyxFQUFpREMsR0FBakQsRUFBc0RDLEdBQXRELEVBQTJEQyxHQUEzRCxFQUFnRUMsR0FBaEUsRUFBcUVDLEdBQXJFLEVBQTBFQyxHQUExRSxFQUErRUMsR0FBL0UsRUFBb0ZDLEdBQXBGLENBQVY7O0FBQ0EsTUFBSWYsR0FBRyxLQUFLbU4sU0FBWixFQUF1QjtBQUNuQmxPLElBQUFBLElBQUksQ0FBQytCLFFBQUwsQ0FBY29GLEdBQWQ7QUFDSDs7QUFDRCxTQUFPQSxHQUFQO0FBQ0gsQ0FORDs7QUFRQTZHLEVBQUUsQ0FBQ2hPLElBQUgsR0FBVUEsSUFBViIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgVmFsdWVUeXBlIGZyb20gJy4vdmFsdWUtdHlwZSc7XG5pbXBvcnQgQ0NDbGFzcyBmcm9tICcuLi9wbGF0Zm9ybS9DQ0NsYXNzJztcbmltcG9ydCBWZWMzIGZyb20gJy4vdmVjMyc7XG5pbXBvcnQgUXVhdCBmcm9tICcuL3F1YXQnO1xuaW1wb3J0IHsgRVBTSUxPTiwgRkxPQVRfQVJSQVlfVFlQRSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IE1hdDMgZnJvbSAnLi9tYXQzJztcblxubGV0IF9hMDA6IG51bWJlciA9IDA7IGxldCBfYTAxOiBudW1iZXIgPSAwOyBsZXQgX2EwMjogbnVtYmVyID0gMDsgbGV0IF9hMDM6IG51bWJlciA9IDA7XG5sZXQgX2ExMDogbnVtYmVyID0gMDsgbGV0IF9hMTE6IG51bWJlciA9IDA7IGxldCBfYTEyOiBudW1iZXIgPSAwOyBsZXQgX2ExMzogbnVtYmVyID0gMDtcbmxldCBfYTIwOiBudW1iZXIgPSAwOyBsZXQgX2EyMTogbnVtYmVyID0gMDsgbGV0IF9hMjI6IG51bWJlciA9IDA7IGxldCBfYTIzOiBudW1iZXIgPSAwO1xubGV0IF9hMzA6IG51bWJlciA9IDA7IGxldCBfYTMxOiBudW1iZXIgPSAwOyBsZXQgX2EzMjogbnVtYmVyID0gMDsgbGV0IF9hMzM6IG51bWJlciA9IDA7XG5cbi8qKlxuICogISNlbiBSZXByZXNlbnRhdGlvbiBvZiA0KjQgbWF0cml4LlxuICogISN6aCDooajnpLogNCo0IOefqemYtVxuICpcbiAqIEBjbGFzcyBNYXQ0XG4gKiBAZXh0ZW5kcyBWYWx1ZVR5cGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWF0NCBleHRlbmRzIFZhbHVlVHlwZSB7XG4gICAgc3RhdGljIG11bCA9IE1hdDQubXVsdGlwbHk7XG4gICAgc3RhdGljIHN1YiA9IE1hdDQuc3VidHJhY3Q7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIE11bHRpcGx5IHRoZSBjdXJyZW50IG1hdHJpeCB3aXRoIGFub3RoZXIgb25lXG4gICAgICogISN6aCDlsIblvZPliY3nn6npmLXkuI7mjIflrprnn6npmLXnm7jkuZhcbiAgICAgKiBAbWV0aG9kIG11bFxuICAgICAqIEBwYXJhbSB7TWF0NH0gb3RoZXIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAgICogQHBhcmFtIHtNYXQ0fSBbb3V0XSB0aGUgcmVjZWl2aW5nIG1hdHJpeCwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIG1hdHJpeCB0byBzYXZlIHJlc3VsdCB0byBpdHNlbGYsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgbWF0cml4IHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm5zIHtNYXQ0fSBvdXRcbiAgICAgKi9cbiAgICBtdWwgKG06IE1hdDQsIG91dDogTWF0NCk6IE1hdDQge1xuICAgICAgICByZXR1cm4gTWF0NC5tdWx0aXBseShvdXQgfHwgbmV3IE1hdDQoKSwgdGhpcywgbSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqICEjZW4gTXVsdGlwbHkgZWFjaCBlbGVtZW50IG9mIHRoZSBtYXRyaXggYnkgYSBzY2FsYXIuXG4gICAgICogISN6aCDlsIbnn6npmLXnmoTmr4/kuIDkuKrlhYPntKDpg73kuZjku6XmjIflrprnmoTnvKnmlL7lgLzjgIJcbiAgICAgKiBAbWV0aG9kIG11bFNjYWxhclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBudW1iZXIgYW1vdW50IHRvIHNjYWxlIHRoZSBtYXRyaXgncyBlbGVtZW50cyBieVxuICAgICAqIEBwYXJhbSB7TWF0NH0gW291dF0gdGhlIHJlY2VpdmluZyBtYXRyaXgsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSBtYXRyaXggdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IG1hdHJpeCB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJucyB7TWF0NH0gb3V0XG4gICAgICovXG4gICAgbXVsU2NhbGFyIChudW06IG51bWJlciwgb3V0OiBNYXQ0KSB7XG4gICAgICAgIE1hdDQubXVsdGlwbHlTY2FsYXIob3V0IHx8IG5ldyBNYXQ0KCksIHRoaXMsIG51bSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqICEjZW4gU3VidHJhY3RzIHRoZSBjdXJyZW50IG1hdHJpeCB3aXRoIGFub3RoZXIgb25lXG4gICAgICogISN6aCDlsIblvZPliY3nn6npmLXkuI7mjIflrprnmoTnn6npmLXnm7jlh49cbiAgICAgKiBAbWV0aG9kIHN1YlxuICAgICAqIEBwYXJhbSB7TWF0NH0gb3RoZXIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAgICogQHBhcmFtIHtNYXQ0fSBbb3V0XSB0aGUgcmVjZWl2aW5nIG1hdHJpeCwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIG1hdHJpeCB0byBzYXZlIHJlc3VsdCB0byBpdHNlbGYsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgbWF0cml4IHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm5zIHtNYXQ0fSBvdXRcbiAgICAgKi9cbiAgICBzdWIgKG06IE1hdDQsIG91dDogTWF0NCkge1xuICAgICAgICBNYXQ0LnN1YnRyYWN0KG91dCB8fCBuZXcgTWF0NCgpLCB0aGlzLCBtKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZGVudGl0eSAgb2YgTWF0NFxuICAgICAqIEBwcm9wZXJ0eSB7TWF0NH0gSURFTlRJVFlcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIElERU5USVRZID0gT2JqZWN0LmZyZWV6ZShuZXcgTWF0NCgpKTtcblxuICAgIC8qKlxuICAgICAqICEjemgg6I635b6X5oyH5a6a55+p6Zi155qE5ou36LSdXG4gICAgICogISNlbiBDb3B5IG9mIHRoZSBzcGVjaWZpZWQgbWF0cml4IHRvIG9idGFpblxuICAgICAqIEBtZXRob2QgY2xvbmVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGNsb25lPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKGE6IE91dCk6IE1hdDRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGNsb25lPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKGE6IE91dCkge1xuICAgICAgICBsZXQgbSA9IGEubTtcbiAgICAgICAgcmV0dXJuIG5ldyBNYXQ0KFxuICAgICAgICAgICAgbVswXSwgbVsxXSwgbVsyXSwgbVszXSxcbiAgICAgICAgICAgIG1bNF0sIG1bNV0sIG1bNl0sIG1bN10sXG4gICAgICAgICAgICBtWzhdLCBtWzldLCBtWzEwXSwgbVsxMV0sXG4gICAgICAgICAgICBtWzEyXSwgbVsxM10sIG1bMTRdLCBtWzE1XSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWkjeWItuebruagh+efqemYtVxuICAgICAqICEjZW4gQ29weSB0aGUgdGFyZ2V0IG1hdHJpeFxuICAgICAqIEBtZXRob2QgY29weVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogY29weTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0KTogT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBjb3B5PE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcbiAgICAgICAgbGV0IG0gPSBvdXQubSwgYW0gPSBhLm07XG4gICAgICAgIG1bMF0gPSBhbVswXTtcbiAgICAgICAgbVsxXSA9IGFtWzFdO1xuICAgICAgICBtWzJdID0gYW1bMl07XG4gICAgICAgIG1bM10gPSBhbVszXTtcbiAgICAgICAgbVs0XSA9IGFtWzRdO1xuICAgICAgICBtWzVdID0gYW1bNV07XG4gICAgICAgIG1bNl0gPSBhbVs2XTtcbiAgICAgICAgbVs3XSA9IGFtWzddO1xuICAgICAgICBtWzhdID0gYW1bOF07XG4gICAgICAgIG1bOV0gPSBhbVs5XTtcbiAgICAgICAgbVsxMF0gPSBhbVsxMF07XG4gICAgICAgIG1bMTFdID0gYW1bMTFdO1xuICAgICAgICBtWzEyXSA9IGFtWzEyXTtcbiAgICAgICAgbVsxM10gPSBhbVsxM107XG4gICAgICAgIG1bMTRdID0gYW1bMTRdO1xuICAgICAgICBtWzE1XSA9IGFtWzE1XTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiuvue9ruefqemYteWAvFxuICAgICAqICEjZW4gU2V0dGluZyBtYXRyaXggdmFsdWVzXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBzZXQ8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAoXG4gICAgICAgIG91dDogT3V0LFxuICAgICAgICBtMDA6IG51bWJlciwgbTAxOiBudW1iZXIsIG0wMjogbnVtYmVyLCBtMDM6IG51bWJlcixcbiAgICAgICAgbTEwOiBudW1iZXIsIG0xMTogbnVtYmVyLCBtMTI6IG51bWJlciwgbTEzOiBudW1iZXIsXG4gICAgICAgIG0yMDogbnVtYmVyLCBtMjE6IG51bWJlciwgbTIyOiBudW1iZXIsIG0yMzogbnVtYmVyLFxuICAgICAgICBtMzA6IG51bWJlciwgbTMxOiBudW1iZXIsIG0zMjogbnVtYmVyLCBtMzM6IG51bWJlcixcbiAgICApIHtcbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgbVswXSA9IG0wMDsgbVsxXSA9IG0wMTsgbVsyXSA9IG0wMjsgbVszXSA9IG0wMztcbiAgICAgICAgbVs0XSA9IG0xMDsgbVs1XSA9IG0xMTsgbVs2XSA9IG0xMjsgbVs3XSA9IG0xMztcbiAgICAgICAgbVs4XSA9IG0yMDsgbVs5XSA9IG0yMTsgbVsxMF0gPSBtMjI7IG1bMTFdID0gbTIzO1xuICAgICAgICBtWzEyXSA9IG0zMDsgbVsxM10gPSBtMzE7IG1bMTRdID0gbTMyOyBtWzE1XSA9IG0zMztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWwhuebruagh+i1i+WAvOS4uuWNleS9jeefqemYtVxuICAgICAqICEjZW4gVGhlIHRhcmdldCBvZiBhbiBhc3NpZ25tZW50IGlzIHRoZSBpZGVudGl0eSBtYXRyaXhcbiAgICAgKiBAbWV0aG9kIGlkZW50aXR5XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBpZGVudGl0eTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCk6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgaWRlbnRpdHk8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQpIHtcbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgbVswXSA9IDE7XG4gICAgICAgIG1bMV0gPSAwO1xuICAgICAgICBtWzJdID0gMDtcbiAgICAgICAgbVszXSA9IDA7XG4gICAgICAgIG1bNF0gPSAwO1xuICAgICAgICBtWzVdID0gMTtcbiAgICAgICAgbVs2XSA9IDA7XG4gICAgICAgIG1bN10gPSAwO1xuICAgICAgICBtWzhdID0gMDtcbiAgICAgICAgbVs5XSA9IDA7XG4gICAgICAgIG1bMTBdID0gMTtcbiAgICAgICAgbVsxMV0gPSAwO1xuICAgICAgICBtWzEyXSA9IDA7XG4gICAgICAgIG1bMTNdID0gMDtcbiAgICAgICAgbVsxNF0gPSAwO1xuICAgICAgICBtWzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDovaznva7nn6npmLVcbiAgICAgKiAhI2VuIFRyYW5zcG9zZWQgbWF0cml4XG4gICAgICogQG1ldGhvZCB0cmFuc3Bvc2VcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHRyYW5zcG9zZTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0KTogT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyB0cmFuc3Bvc2U8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xuICAgICAgICBsZXQgbSA9IG91dC5tLCBhbSA9IGEubTtcbiAgICAgICAgLy8gSWYgd2UgYXJlIHRyYW5zcG9zaW5nIG91cnNlbHZlcyB3ZSBjYW4gc2tpcCBhIGZldyBzdGVwcyBidXQgaGF2ZSB0byBjYWNoZSBzb21lIHZhbHVlc1xuICAgICAgICBpZiAob3V0ID09PSBhKSB7XG4gICAgICAgICAgICBjb25zdCBhMDEgPSBhbVsxXSwgYTAyID0gYW1bMl0sIGEwMyA9IGFtWzNdLCBhMTIgPSBhbVs2XSwgYTEzID0gYW1bN10sIGEyMyA9IGFtWzExXTtcbiAgICAgICAgICAgIG1bMV0gPSBhbVs0XTtcbiAgICAgICAgICAgIG1bMl0gPSBhbVs4XTtcbiAgICAgICAgICAgIG1bM10gPSBhbVsxMl07XG4gICAgICAgICAgICBtWzRdID0gYTAxO1xuICAgICAgICAgICAgbVs2XSA9IGFtWzldO1xuICAgICAgICAgICAgbVs3XSA9IGFtWzEzXTtcbiAgICAgICAgICAgIG1bOF0gPSBhMDI7XG4gICAgICAgICAgICBtWzldID0gYTEyO1xuICAgICAgICAgICAgbVsxMV0gPSBhbVsxNF07XG4gICAgICAgICAgICBtWzEyXSA9IGEwMztcbiAgICAgICAgICAgIG1bMTNdID0gYTEzO1xuICAgICAgICAgICAgbVsxNF0gPSBhMjM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtWzBdID0gYW1bMF07XG4gICAgICAgICAgICBtWzFdID0gYW1bNF07XG4gICAgICAgICAgICBtWzJdID0gYW1bOF07XG4gICAgICAgICAgICBtWzNdID0gYW1bMTJdO1xuICAgICAgICAgICAgbVs0XSA9IGFtWzFdO1xuICAgICAgICAgICAgbVs1XSA9IGFtWzVdO1xuICAgICAgICAgICAgbVs2XSA9IGFtWzldO1xuICAgICAgICAgICAgbVs3XSA9IGFtWzEzXTtcbiAgICAgICAgICAgIG1bOF0gPSBhbVsyXTtcbiAgICAgICAgICAgIG1bOV0gPSBhbVs2XTtcbiAgICAgICAgICAgIG1bMTBdID0gYW1bMTBdO1xuICAgICAgICAgICAgbVsxMV0gPSBhbVsxNF07XG4gICAgICAgICAgICBtWzEyXSA9IGFtWzNdO1xuICAgICAgICAgICAgbVsxM10gPSBhbVs3XTtcbiAgICAgICAgICAgIG1bMTRdID0gYW1bMTFdO1xuICAgICAgICAgICAgbVsxNV0gPSBhbVsxNV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOefqemYteaxgumAhlxuICAgICAqICEjZW4gTWF0cml4IGludmVyc2lvblxuICAgICAqIEBtZXRob2QgaW52ZXJ0XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBpbnZlcnQ8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCk6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgaW52ZXJ0PE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcbiAgICAgICAgbGV0IGFtID0gYS5tO1xuICAgICAgICBfYTAwID0gYW1bMF07IF9hMDEgPSBhbVsxXTsgX2EwMiA9IGFtWzJdOyBfYTAzID0gYW1bM107XG4gICAgICAgIF9hMTAgPSBhbVs0XTsgX2ExMSA9IGFtWzVdOyBfYTEyID0gYW1bNl07IF9hMTMgPSBhbVs3XTtcbiAgICAgICAgX2EyMCA9IGFtWzhdOyBfYTIxID0gYW1bOV07IF9hMjIgPSBhbVsxMF07IF9hMjMgPSBhbVsxMV07XG4gICAgICAgIF9hMzAgPSBhbVsxMl07IF9hMzEgPSBhbVsxM107IF9hMzIgPSBhbVsxNF07IF9hMzMgPSBhbVsxNV07XG5cbiAgICAgICAgY29uc3QgYjAwID0gX2EwMCAqIF9hMTEgLSBfYTAxICogX2ExMDtcbiAgICAgICAgY29uc3QgYjAxID0gX2EwMCAqIF9hMTIgLSBfYTAyICogX2ExMDtcbiAgICAgICAgY29uc3QgYjAyID0gX2EwMCAqIF9hMTMgLSBfYTAzICogX2ExMDtcbiAgICAgICAgY29uc3QgYjAzID0gX2EwMSAqIF9hMTIgLSBfYTAyICogX2ExMTtcbiAgICAgICAgY29uc3QgYjA0ID0gX2EwMSAqIF9hMTMgLSBfYTAzICogX2ExMTtcbiAgICAgICAgY29uc3QgYjA1ID0gX2EwMiAqIF9hMTMgLSBfYTAzICogX2ExMjtcbiAgICAgICAgY29uc3QgYjA2ID0gX2EyMCAqIF9hMzEgLSBfYTIxICogX2EzMDtcbiAgICAgICAgY29uc3QgYjA3ID0gX2EyMCAqIF9hMzIgLSBfYTIyICogX2EzMDtcbiAgICAgICAgY29uc3QgYjA4ID0gX2EyMCAqIF9hMzMgLSBfYTIzICogX2EzMDtcbiAgICAgICAgY29uc3QgYjA5ID0gX2EyMSAqIF9hMzIgLSBfYTIyICogX2EzMTtcbiAgICAgICAgY29uc3QgYjEwID0gX2EyMSAqIF9hMzMgLSBfYTIzICogX2EzMTtcbiAgICAgICAgY29uc3QgYjExID0gX2EyMiAqIF9hMzMgLSBfYTIzICogX2EzMjtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGRldGVybWluYW50XG4gICAgICAgIGxldCBkZXQgPSBiMDAgKiBiMTEgLSBiMDEgKiBiMTAgKyBiMDIgKiBiMDkgKyBiMDMgKiBiMDggLSBiMDQgKiBiMDcgKyBiMDUgKiBiMDY7XG5cbiAgICAgICAgaWYgKGRldCA9PT0gMCkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgICBkZXQgPSAxLjAgLyBkZXQ7XG5cbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgbVswXSA9IChfYTExICogYjExIC0gX2ExMiAqIGIxMCArIF9hMTMgKiBiMDkpICogZGV0O1xuICAgICAgICBtWzFdID0gKF9hMDIgKiBiMTAgLSBfYTAxICogYjExIC0gX2EwMyAqIGIwOSkgKiBkZXQ7XG4gICAgICAgIG1bMl0gPSAoX2EzMSAqIGIwNSAtIF9hMzIgKiBiMDQgKyBfYTMzICogYjAzKSAqIGRldDtcbiAgICAgICAgbVszXSA9IChfYTIyICogYjA0IC0gX2EyMSAqIGIwNSAtIF9hMjMgKiBiMDMpICogZGV0O1xuICAgICAgICBtWzRdID0gKF9hMTIgKiBiMDggLSBfYTEwICogYjExIC0gX2ExMyAqIGIwNykgKiBkZXQ7XG4gICAgICAgIG1bNV0gPSAoX2EwMCAqIGIxMSAtIF9hMDIgKiBiMDggKyBfYTAzICogYjA3KSAqIGRldDtcbiAgICAgICAgbVs2XSA9IChfYTMyICogYjAyIC0gX2EzMCAqIGIwNSAtIF9hMzMgKiBiMDEpICogZGV0O1xuICAgICAgICBtWzddID0gKF9hMjAgKiBiMDUgLSBfYTIyICogYjAyICsgX2EyMyAqIGIwMSkgKiBkZXQ7XG4gICAgICAgIG1bOF0gPSAoX2ExMCAqIGIxMCAtIF9hMTEgKiBiMDggKyBfYTEzICogYjA2KSAqIGRldDtcbiAgICAgICAgbVs5XSA9IChfYTAxICogYjA4IC0gX2EwMCAqIGIxMCAtIF9hMDMgKiBiMDYpICogZGV0O1xuICAgICAgICBtWzEwXSA9IChfYTMwICogYjA0IC0gX2EzMSAqIGIwMiArIF9hMzMgKiBiMDApICogZGV0O1xuICAgICAgICBtWzExXSA9IChfYTIxICogYjAyIC0gX2EyMCAqIGIwNCAtIF9hMjMgKiBiMDApICogZGV0O1xuICAgICAgICBtWzEyXSA9IChfYTExICogYjA3IC0gX2ExMCAqIGIwOSAtIF9hMTIgKiBiMDYpICogZGV0O1xuICAgICAgICBtWzEzXSA9IChfYTAwICogYjA5IC0gX2EwMSAqIGIwNyArIF9hMDIgKiBiMDYpICogZGV0O1xuICAgICAgICBtWzE0XSA9IChfYTMxICogYjAxIC0gX2EzMCAqIGIwMyAtIF9hMzIgKiBiMDApICogZGV0O1xuICAgICAgICBtWzE1XSA9IChfYTIwICogYjAzIC0gX2EyMSAqIGIwMSArIF9hMjIgKiBiMDApICogZGV0O1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDnn6npmLXooYzliJflvI9cbiAgICAgKiAhI2VuIE1hdHJpeCBkZXRlcm1pbmFudFxuICAgICAqIEBtZXRob2QgZGV0ZXJtaW5hbnRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGRldGVybWluYW50PE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKGE6IE91dCk6IG51bWJlclxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZGV0ZXJtaW5hbnQ8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAoYTogT3V0KTogbnVtYmVyIHtcbiAgICAgICAgbGV0IG0gPSBhLm07XG4gICAgICAgIF9hMDAgPSBtWzBdOyBfYTAxID0gbVsxXTsgX2EwMiA9IG1bMl07IF9hMDMgPSBtWzNdO1xuICAgICAgICBfYTEwID0gbVs0XTsgX2ExMSA9IG1bNV07IF9hMTIgPSBtWzZdOyBfYTEzID0gbVs3XTtcbiAgICAgICAgX2EyMCA9IG1bOF07IF9hMjEgPSBtWzldOyBfYTIyID0gbVsxMF07IF9hMjMgPSBtWzExXTtcbiAgICAgICAgX2EzMCA9IG1bMTJdOyBfYTMxID0gbVsxM107IF9hMzIgPSBtWzE0XTsgX2EzMyA9IG1bMTVdO1xuXG4gICAgICAgIGNvbnN0IGIwMCA9IF9hMDAgKiBfYTExIC0gX2EwMSAqIF9hMTA7XG4gICAgICAgIGNvbnN0IGIwMSA9IF9hMDAgKiBfYTEyIC0gX2EwMiAqIF9hMTA7XG4gICAgICAgIGNvbnN0IGIwMiA9IF9hMDAgKiBfYTEzIC0gX2EwMyAqIF9hMTA7XG4gICAgICAgIGNvbnN0IGIwMyA9IF9hMDEgKiBfYTEyIC0gX2EwMiAqIF9hMTE7XG4gICAgICAgIGNvbnN0IGIwNCA9IF9hMDEgKiBfYTEzIC0gX2EwMyAqIF9hMTE7XG4gICAgICAgIGNvbnN0IGIwNSA9IF9hMDIgKiBfYTEzIC0gX2EwMyAqIF9hMTI7XG4gICAgICAgIGNvbnN0IGIwNiA9IF9hMjAgKiBfYTMxIC0gX2EyMSAqIF9hMzA7XG4gICAgICAgIGNvbnN0IGIwNyA9IF9hMjAgKiBfYTMyIC0gX2EyMiAqIF9hMzA7XG4gICAgICAgIGNvbnN0IGIwOCA9IF9hMjAgKiBfYTMzIC0gX2EyMyAqIF9hMzA7XG4gICAgICAgIGNvbnN0IGIwOSA9IF9hMjEgKiBfYTMyIC0gX2EyMiAqIF9hMzE7XG4gICAgICAgIGNvbnN0IGIxMCA9IF9hMjEgKiBfYTMzIC0gX2EyMyAqIF9hMzE7XG4gICAgICAgIGNvbnN0IGIxMSA9IF9hMjIgKiBfYTMzIC0gX2EyMyAqIF9hMzI7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBkZXRlcm1pbmFudFxuICAgICAgICByZXR1cm4gYjAwICogYjExIC0gYjAxICogYjEwICsgYjAyICogYjA5ICsgYjAzICogYjA4IC0gYjA0ICogYjA3ICsgYjA1ICogYjA2O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg55+p6Zi15LmY5rOVXG4gICAgICogISNlbiBNYXRyaXggTXVsdGlwbGljYXRpb25cbiAgICAgKiBAbWV0aG9kIG11bHRpcGx5XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBtdWx0aXBseTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIG11bHRpcGx5PE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBsZXQgbSA9IG91dC5tLCBhbSA9IGEubSwgYm0gPSBiLm07XG4gICAgICAgIF9hMDAgPSBhbVswXTsgX2EwMSA9IGFtWzFdOyBfYTAyID0gYW1bMl07IF9hMDMgPSBhbVszXTtcbiAgICAgICAgX2ExMCA9IGFtWzRdOyBfYTExID0gYW1bNV07IF9hMTIgPSBhbVs2XTsgX2ExMyA9IGFtWzddO1xuICAgICAgICBfYTIwID0gYW1bOF07IF9hMjEgPSBhbVs5XTsgX2EyMiA9IGFtWzEwXTsgX2EyMyA9IGFtWzExXTtcbiAgICAgICAgX2EzMCA9IGFtWzEyXTsgX2EzMSA9IGFtWzEzXTsgX2EzMiA9IGFtWzE0XTsgX2EzMyA9IGFtWzE1XTtcblxuICAgICAgICAvLyBDYWNoZSBvbmx5IHRoZSBjdXJyZW50IGxpbmUgb2YgdGhlIHNlY29uZCBtYXRyaXhcbiAgICAgICAgbGV0IGIwID0gYm1bMF0sIGIxID0gYm1bMV0sIGIyID0gYm1bMl0sIGIzID0gYm1bM107XG4gICAgICAgIG1bMF0gPSBiMCAqIF9hMDAgKyBiMSAqIF9hMTAgKyBiMiAqIF9hMjAgKyBiMyAqIF9hMzA7XG4gICAgICAgIG1bMV0gPSBiMCAqIF9hMDEgKyBiMSAqIF9hMTEgKyBiMiAqIF9hMjEgKyBiMyAqIF9hMzE7XG4gICAgICAgIG1bMl0gPSBiMCAqIF9hMDIgKyBiMSAqIF9hMTIgKyBiMiAqIF9hMjIgKyBiMyAqIF9hMzI7XG4gICAgICAgIG1bM10gPSBiMCAqIF9hMDMgKyBiMSAqIF9hMTMgKyBiMiAqIF9hMjMgKyBiMyAqIF9hMzM7XG5cbiAgICAgICAgYjAgPSBibVs0XTsgYjEgPSBibVs1XTsgYjIgPSBibVs2XTsgYjMgPSBibVs3XTtcbiAgICAgICAgbVs0XSA9IGIwICogX2EwMCArIGIxICogX2ExMCArIGIyICogX2EyMCArIGIzICogX2EzMDtcbiAgICAgICAgbVs1XSA9IGIwICogX2EwMSArIGIxICogX2ExMSArIGIyICogX2EyMSArIGIzICogX2EzMTtcbiAgICAgICAgbVs2XSA9IGIwICogX2EwMiArIGIxICogX2ExMiArIGIyICogX2EyMiArIGIzICogX2EzMjtcbiAgICAgICAgbVs3XSA9IGIwICogX2EwMyArIGIxICogX2ExMyArIGIyICogX2EyMyArIGIzICogX2EzMztcblxuICAgICAgICBiMCA9IGJtWzhdOyBiMSA9IGJtWzldOyBiMiA9IGJtWzEwXTsgYjMgPSBibVsxMV07XG4gICAgICAgIG1bOF0gPSBiMCAqIF9hMDAgKyBiMSAqIF9hMTAgKyBiMiAqIF9hMjAgKyBiMyAqIF9hMzA7XG4gICAgICAgIG1bOV0gPSBiMCAqIF9hMDEgKyBiMSAqIF9hMTEgKyBiMiAqIF9hMjEgKyBiMyAqIF9hMzE7XG4gICAgICAgIG1bMTBdID0gYjAgKiBfYTAyICsgYjEgKiBfYTEyICsgYjIgKiBfYTIyICsgYjMgKiBfYTMyO1xuICAgICAgICBtWzExXSA9IGIwICogX2EwMyArIGIxICogX2ExMyArIGIyICogX2EyMyArIGIzICogX2EzMztcblxuICAgICAgICBiMCA9IGJtWzEyXTsgYjEgPSBibVsxM107IGIyID0gYm1bMTRdOyBiMyA9IGJtWzE1XTtcbiAgICAgICAgbVsxMl0gPSBiMCAqIF9hMDAgKyBiMSAqIF9hMTAgKyBiMiAqIF9hMjAgKyBiMyAqIF9hMzA7XG4gICAgICAgIG1bMTNdID0gYjAgKiBfYTAxICsgYjEgKiBfYTExICsgYjIgKiBfYTIxICsgYjMgKiBfYTMxO1xuICAgICAgICBtWzE0XSA9IGIwICogX2EwMiArIGIxICogX2ExMiArIGIyICogX2EyMiArIGIzICogX2EzMjtcbiAgICAgICAgbVsxNV0gPSBiMCAqIF9hMDMgKyBiMSAqIF9hMTMgKyBiMiAqIF9hMjMgKyBiMyAqIF9hMzM7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlnKjnu5nlrprnn6npmLXlj5jmjaLln7rnoYDkuIrliqDlhaXlj5jmjaJcbiAgICAgKiAhI2VuIFdhcyBhZGRlZCBpbiBhIGdpdmVuIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCB0cmFuc2Zvcm1hdGlvbiBvbiB0aGUgYmFzaXMgb2ZcbiAgICAgKiBAbWV0aG9kIHRyYW5zZm9ybVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogdHJhbnNmb3JtPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHY6IFZlY0xpa2UpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRyYW5zZm9ybTxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogT3V0LCB2OiBWZWNMaWtlKSB7XG4gICAgICAgIGNvbnN0IHggPSB2LngsIHkgPSB2LnksIHogPSB2Lno7XG4gICAgICAgIGxldCBtID0gb3V0Lm0sIGFtID0gYS5tO1xuICAgICAgICBpZiAoYSA9PT0gb3V0KSB7XG4gICAgICAgICAgICBtWzEyXSA9IGFtWzBdICogeCArIGFtWzRdICogeSArIGFtWzhdICogeiArIGFtWzEyXTtcbiAgICAgICAgICAgIG1bMTNdID0gYW1bMV0gKiB4ICsgYW1bNV0gKiB5ICsgYW1bOV0gKiB6ICsgYW1bMTNdO1xuICAgICAgICAgICAgbVsxNF0gPSBhbVsyXSAqIHggKyBhbVs2XSAqIHkgKyBhbVsxMF0gKiB6ICsgYW1bMTRdO1xuICAgICAgICAgICAgbVsxNV0gPSBhbVszXSAqIHggKyBhbVs3XSAqIHkgKyBhbVsxMV0gKiB6ICsgYW1bMTVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX2EwMCA9IGFtWzBdOyBfYTAxID0gYW1bMV07IF9hMDIgPSBhbVsyXTsgX2EwMyA9IGFtWzNdO1xuICAgICAgICAgICAgX2ExMCA9IGFtWzRdOyBfYTExID0gYW1bNV07IF9hMTIgPSBhbVs2XTsgX2ExMyA9IGFtWzddO1xuICAgICAgICAgICAgX2EyMCA9IGFtWzhdOyBfYTIxID0gYW1bOV07IF9hMjIgPSBhbVsxMF07IF9hMjMgPSBhbVsxMV07XG4gICAgICAgICAgICBfYTMwID0gYW1bMTJdOyBfYTMxID0gYW1bMTNdOyBfYTMyID0gYW1bMTRdOyBfYTMzID0gYW1bMTVdO1xuXG4gICAgICAgICAgICBtWzBdID0gX2EwMDsgbVsxXSA9IF9hMDE7IG1bMl0gPSBfYTAyOyBtWzNdID0gX2EwMztcbiAgICAgICAgICAgIG1bNF0gPSBfYTEwOyBtWzVdID0gX2ExMTsgbVs2XSA9IF9hMTI7IG1bN10gPSBfYTEzO1xuICAgICAgICAgICAgbVs4XSA9IF9hMjA7IG1bOV0gPSBfYTIxOyBtWzEwXSA9IF9hMjI7IG1bMTFdID0gX2EyMztcblxuICAgICAgICAgICAgbVsxMl0gPSBfYTAwICogeCArIF9hMTAgKiB5ICsgX2EyMCAqIHogKyBhbVsxMl07XG4gICAgICAgICAgICBtWzEzXSA9IF9hMDEgKiB4ICsgX2ExMSAqIHkgKyBfYTIxICogeiArIGFtWzEzXTtcbiAgICAgICAgICAgIG1bMTRdID0gX2EwMiAqIHggKyBfYTEyICogeSArIF9hMjIgKiB6ICsgYW1bMTRdO1xuICAgICAgICAgICAgbVsxNV0gPSBfYTAzICogeCArIF9hMTMgKiB5ICsgX2EyMyAqIHogKyBhbVsxNV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWcqOe7meWumuefqemYteWPmOaNouWfuuehgOS4iuWKoOWFpeaWsOS9jeenu+WPmOaNolxuICAgICAqICEjZW4gQWRkIG5ldyBkaXNwbGFjZW1lbnQgdHJhbnNkdWNlciBpbiBhIG1hdHJpeCB0cmFuc2Zvcm1hdGlvbiBvbiB0aGUgYmFzaXMgb2YgYSBnaXZlblxuICAgICAqIEBtZXRob2QgdHJhbnNsYXRlXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiB0cmFuc2xhdGU8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgdjogVmVjTGlrZSk6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgdHJhbnNsYXRlPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHY6IFZlY0xpa2UpIHtcbiAgICAgICAgbGV0IG0gPSBvdXQubSwgYW0gPSBhLm07XG4gICAgICAgIGlmIChhID09PSBvdXQpIHtcbiAgICAgICAgICAgIG1bMTJdICs9IHYueDtcbiAgICAgICAgICAgIG1bMTNdICs9IHYueTtcbiAgICAgICAgICAgIG1bMTRdICs9IHYuejtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1bMF0gPSBhbVswXTsgbVsxXSA9IGFtWzFdOyBtWzJdID0gYW1bMl07IG1bM10gPSBhbVszXTtcbiAgICAgICAgICAgIG1bNF0gPSBhbVs0XTsgbVs1XSA9IGFtWzVdOyBtWzZdID0gYW1bNl07IG1bN10gPSBhbVs3XTtcbiAgICAgICAgICAgIG1bOF0gPSBhbVs4XTsgbVs5XSA9IGFtWzldOyBtWzEwXSA9IGFtWzEwXTsgbVsxMV0gPSBhbVsxMV07XG4gICAgICAgICAgICBtWzEyXSArPSB2Lng7XG4gICAgICAgICAgICBtWzEzXSArPSB2Lnk7XG4gICAgICAgICAgICBtWzE0XSArPSB2Lno7XG4gICAgICAgICAgICBtWzE1XSA9IGFtWzE1XTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5Zyo57uZ5a6a55+p6Zi15Y+Y5o2i5Z+656GA5LiK5Yqg5YWl5paw57yp5pS+5Y+Y5o2iXG4gICAgICogISNlbiBBZGQgbmV3IHNjYWxpbmcgdHJhbnNmb3JtYXRpb24gaW4gYSBnaXZlbiBtYXRyaXggdHJhbnNmb3JtYXRpb24gb24gdGhlIGJhc2lzIG9mXG4gICAgICogQG1ldGhvZCBzY2FsZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc2NhbGU8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgdjogVmVjTGlrZSk6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgc2NhbGU8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgdjogVmVjTGlrZSkge1xuICAgICAgICBjb25zdCB4ID0gdi54LCB5ID0gdi55LCB6ID0gdi56O1xuICAgICAgICBsZXQgbSA9IG91dC5tLCBhbSA9IGEubTtcbiAgICAgICAgbVswXSA9IGFtWzBdICogeDtcbiAgICAgICAgbVsxXSA9IGFtWzFdICogeDtcbiAgICAgICAgbVsyXSA9IGFtWzJdICogeDtcbiAgICAgICAgbVszXSA9IGFtWzNdICogeDtcbiAgICAgICAgbVs0XSA9IGFtWzRdICogeTtcbiAgICAgICAgbVs1XSA9IGFtWzVdICogeTtcbiAgICAgICAgbVs2XSA9IGFtWzZdICogeTtcbiAgICAgICAgbVs3XSA9IGFtWzddICogeTtcbiAgICAgICAgbVs4XSA9IGFtWzhdICogejtcbiAgICAgICAgbVs5XSA9IGFtWzldICogejtcbiAgICAgICAgbVsxMF0gPSBhbVsxMF0gKiB6O1xuICAgICAgICBtWzExXSA9IGFtWzExXSAqIHo7XG4gICAgICAgIG1bMTJdID0gYW1bMTJdO1xuICAgICAgICBtWzEzXSA9IGFtWzEzXTtcbiAgICAgICAgbVsxNF0gPSBhbVsxNF07XG4gICAgICAgIG1bMTVdID0gYW1bMTVdO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5Zyo57uZ5a6a55+p6Zi15Y+Y5o2i5Z+656GA5LiK5Yqg5YWl5paw5peL6L2s5Y+Y5o2iXG4gICAgICogISNlbiBBZGQgYSBuZXcgcm90YXRpb25hbCB0cmFuc2Zvcm0gbWF0cml4IHRyYW5zZm9ybWF0aW9uIG9uIHRoZSBiYXNpcyBvZiBhIGdpdmVuXG4gICAgICogQG1ldGhvZCByb3RhdGVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHJvdGF0ZTxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogT3V0LCByYWQ6IG51bWJlciwgYXhpczogVmVjTGlrZSk6IE91dFxuICAgICAqIEBwYXJhbSByYWQg5peL6L2s6KeS5bqmXG4gICAgICogQHBhcmFtIGF4aXMg5peL6L2s6L20XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyByb3RhdGU8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgcmFkOiBudW1iZXIsIGF4aXM6IFZlY0xpa2UpIHtcbiAgICAgICAgbGV0IHggPSBheGlzLngsIHkgPSBheGlzLnksIHogPSBheGlzLno7XG5cbiAgICAgICAgbGV0IGxlbiA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xuXG4gICAgICAgIGlmIChNYXRoLmFicyhsZW4pIDwgRVBTSUxPTikge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBsZW4gPSAxIC8gbGVuO1xuICAgICAgICB4ICo9IGxlbjtcbiAgICAgICAgeSAqPSBsZW47XG4gICAgICAgIHogKj0gbGVuO1xuXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihyYWQpO1xuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MocmFkKTtcbiAgICAgICAgY29uc3QgdCA9IDEgLSBjO1xuXG4gICAgICAgIGxldCBhbSA9IGEubTtcbiAgICAgICAgX2EwMCA9IGFtWzBdOyBfYTAxID0gYW1bMV07IF9hMDIgPSBhbVsyXTsgX2EwMyA9IGFtWzNdO1xuICAgICAgICBfYTEwID0gYW1bNF07IF9hMTEgPSBhbVs1XTsgX2ExMiA9IGFtWzZdOyBfYTEzID0gYW1bN107XG4gICAgICAgIF9hMjAgPSBhbVs4XTsgX2EyMSA9IGFtWzldOyBfYTIyID0gYW1bMTBdOyBfYTIzID0gYW1bMTFdO1xuXG4gICAgICAgIC8vIENvbnN0cnVjdCB0aGUgZWxlbWVudHMgb2YgdGhlIHJvdGF0aW9uIG1hdHJpeFxuICAgICAgICBjb25zdCBiMDAgPSB4ICogeCAqIHQgKyBjLCBiMDEgPSB5ICogeCAqIHQgKyB6ICogcywgYjAyID0geiAqIHggKiB0IC0geSAqIHM7XG4gICAgICAgIGNvbnN0IGIxMCA9IHggKiB5ICogdCAtIHogKiBzLCBiMTEgPSB5ICogeSAqIHQgKyBjLCBiMTIgPSB6ICogeSAqIHQgKyB4ICogcztcbiAgICAgICAgY29uc3QgYjIwID0geCAqIHogKiB0ICsgeSAqIHMsIGIyMSA9IHkgKiB6ICogdCAtIHggKiBzLCBiMjIgPSB6ICogeiAqIHQgKyBjO1xuXG4gICAgICAgIGxldCBtID0gb3V0Lm07XG4gICAgICAgIC8vIFBlcmZvcm0gcm90YXRpb24tc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXG4gICAgICAgIG1bMF0gPSBfYTAwICogYjAwICsgX2ExMCAqIGIwMSArIF9hMjAgKiBiMDI7XG4gICAgICAgIG1bMV0gPSBfYTAxICogYjAwICsgX2ExMSAqIGIwMSArIF9hMjEgKiBiMDI7XG4gICAgICAgIG1bMl0gPSBfYTAyICogYjAwICsgX2ExMiAqIGIwMSArIF9hMjIgKiBiMDI7XG4gICAgICAgIG1bM10gPSBfYTAzICogYjAwICsgX2ExMyAqIGIwMSArIF9hMjMgKiBiMDI7XG4gICAgICAgIG1bNF0gPSBfYTAwICogYjEwICsgX2ExMCAqIGIxMSArIF9hMjAgKiBiMTI7XG4gICAgICAgIG1bNV0gPSBfYTAxICogYjEwICsgX2ExMSAqIGIxMSArIF9hMjEgKiBiMTI7XG4gICAgICAgIG1bNl0gPSBfYTAyICogYjEwICsgX2ExMiAqIGIxMSArIF9hMjIgKiBiMTI7XG4gICAgICAgIG1bN10gPSBfYTAzICogYjEwICsgX2ExMyAqIGIxMSArIF9hMjMgKiBiMTI7XG4gICAgICAgIG1bOF0gPSBfYTAwICogYjIwICsgX2ExMCAqIGIyMSArIF9hMjAgKiBiMjI7XG4gICAgICAgIG1bOV0gPSBfYTAxICogYjIwICsgX2ExMSAqIGIyMSArIF9hMjEgKiBiMjI7XG4gICAgICAgIG1bMTBdID0gX2EwMiAqIGIyMCArIF9hMTIgKiBiMjEgKyBfYTIyICogYjIyO1xuICAgICAgICBtWzExXSA9IF9hMDMgKiBiMjAgKyBfYTEzICogYjIxICsgX2EyMyAqIGIyMjtcblxuICAgICAgICAvLyBJZiB0aGUgc291cmNlIGFuZCBkZXN0aW5hdGlvbiBkaWZmZXIsIGNvcHkgdGhlIHVuY2hhbmdlZCBsYXN0IHJvd1xuICAgICAgICBpZiAoYSAhPT0gb3V0KSB7XG4gICAgICAgICAgICBtWzEyXSA9IGFtWzEyXTtcbiAgICAgICAgICAgIG1bMTNdID0gYW1bMTNdO1xuICAgICAgICAgICAgbVsxNF0gPSBhbVsxNF07XG4gICAgICAgICAgICBtWzE1XSA9IGFtWzE1XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlnKjnu5nlrprnn6npmLXlj5jmjaLln7rnoYDkuIrliqDlhaXnu5UgWCDovbTnmoTml4vovazlj5jmjaJcbiAgICAgKiAhI2VuIEFkZCByb3RhdGlvbmFsIHRyYW5zZm9ybWF0aW9uIGFyb3VuZCB0aGUgWCBheGlzIGF0IGEgZ2l2ZW4gbWF0cml4IHRyYW5zZm9ybWF0aW9uIG9uIHRoZSBiYXNpcyBvZlxuICAgICAqIEBtZXRob2Qgcm90YXRlWFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcm90YXRlWDxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCByYWQ6IG51bWJlcik6IE91dFxuICAgICAqIEBwYXJhbSByYWQg5peL6L2s6KeS5bqmXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyByb3RhdGVYPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHJhZDogbnVtYmVyKSB7XG4gICAgICAgIGxldCBtID0gb3V0Lm0sIGFtID0gYS5tO1xuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4ocmFkKSxcbiAgICAgICAgICAgIGMgPSBNYXRoLmNvcyhyYWQpLFxuICAgICAgICAgICAgYTEwID0gYW1bNF0sXG4gICAgICAgICAgICBhMTEgPSBhbVs1XSxcbiAgICAgICAgICAgIGExMiA9IGFtWzZdLFxuICAgICAgICAgICAgYTEzID0gYW1bN10sXG4gICAgICAgICAgICBhMjAgPSBhbVs4XSxcbiAgICAgICAgICAgIGEyMSA9IGFtWzldLFxuICAgICAgICAgICAgYTIyID0gYW1bMTBdLFxuICAgICAgICAgICAgYTIzID0gYW1bMTFdO1xuXG4gICAgICAgIGlmIChhICE9PSBvdXQpIHsgLy8gSWYgdGhlIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gZGlmZmVyLCBjb3B5IHRoZSB1bmNoYW5nZWQgcm93c1xuICAgICAgICAgICAgbVswXSA9IGFtWzBdO1xuICAgICAgICAgICAgbVsxXSA9IGFtWzFdO1xuICAgICAgICAgICAgbVsyXSA9IGFtWzJdO1xuICAgICAgICAgICAgbVszXSA9IGFtWzNdO1xuICAgICAgICAgICAgbVsxMl0gPSBhbVsxMl07XG4gICAgICAgICAgICBtWzEzXSA9IGFtWzEzXTtcbiAgICAgICAgICAgIG1bMTRdID0gYW1bMTRdO1xuICAgICAgICAgICAgbVsxNV0gPSBhbVsxNV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQZXJmb3JtIGF4aXMtc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXG4gICAgICAgIG1bNF0gPSBhMTAgKiBjICsgYTIwICogcztcbiAgICAgICAgbVs1XSA9IGExMSAqIGMgKyBhMjEgKiBzO1xuICAgICAgICBtWzZdID0gYTEyICogYyArIGEyMiAqIHM7XG4gICAgICAgIG1bN10gPSBhMTMgKiBjICsgYTIzICogcztcbiAgICAgICAgbVs4XSA9IGEyMCAqIGMgLSBhMTAgKiBzO1xuICAgICAgICBtWzldID0gYTIxICogYyAtIGExMSAqIHM7XG4gICAgICAgIG1bMTBdID0gYTIyICogYyAtIGExMiAqIHM7XG4gICAgICAgIG1bMTFdID0gYTIzICogYyAtIGExMyAqIHM7XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWcqOe7meWumuefqemYteWPmOaNouWfuuehgOS4iuWKoOWFpee7lSBZIOi9tOeahOaXi+i9rOWPmOaNolxuICAgICAqICEjZW4gQWRkIGFib3V0IHRoZSBZIGF4aXMgcm90YXRpb24gdHJhbnNmb3JtYXRpb24gaW4gYSBnaXZlbiBtYXRyaXggdHJhbnNmb3JtYXRpb24gb24gdGhlIGJhc2lzIG9mXG4gICAgICogQG1ldGhvZCByb3RhdGVZXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiByb3RhdGVZPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHJhZDogbnVtYmVyKTogT3V0XG4gICAgICogQHBhcmFtIHJhZCDml4vovazop5LluqZcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHJvdGF0ZVk8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgcmFkOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IG0gPSBvdXQubSwgYW0gPSBhLm07XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihyYWQpLFxuICAgICAgICAgICAgYyA9IE1hdGguY29zKHJhZCksXG4gICAgICAgICAgICBhMDAgPSBhbVswXSxcbiAgICAgICAgICAgIGEwMSA9IGFtWzFdLFxuICAgICAgICAgICAgYTAyID0gYW1bMl0sXG4gICAgICAgICAgICBhMDMgPSBhbVszXSxcbiAgICAgICAgICAgIGEyMCA9IGFtWzhdLFxuICAgICAgICAgICAgYTIxID0gYW1bOV0sXG4gICAgICAgICAgICBhMjIgPSBhbVsxMF0sXG4gICAgICAgICAgICBhMjMgPSBhbVsxMV07XG5cbiAgICAgICAgaWYgKGEgIT09IG91dCkgeyAvLyBJZiB0aGUgc291cmNlIGFuZCBkZXN0aW5hdGlvbiBkaWZmZXIsIGNvcHkgdGhlIHVuY2hhbmdlZCByb3dzXG4gICAgICAgICAgICBtWzRdID0gYW1bNF07XG4gICAgICAgICAgICBtWzVdID0gYW1bNV07XG4gICAgICAgICAgICBtWzZdID0gYW1bNl07XG4gICAgICAgICAgICBtWzddID0gYW1bN107XG4gICAgICAgICAgICBtWzEyXSA9IGFtWzEyXTtcbiAgICAgICAgICAgIG1bMTNdID0gYW1bMTNdO1xuICAgICAgICAgICAgbVsxNF0gPSBhbVsxNF07XG4gICAgICAgICAgICBtWzE1XSA9IGFtWzE1XTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cbiAgICAgICAgbVswXSA9IGEwMCAqIGMgLSBhMjAgKiBzO1xuICAgICAgICBtWzFdID0gYTAxICogYyAtIGEyMSAqIHM7XG4gICAgICAgIG1bMl0gPSBhMDIgKiBjIC0gYTIyICogcztcbiAgICAgICAgbVszXSA9IGEwMyAqIGMgLSBhMjMgKiBzO1xuICAgICAgICBtWzhdID0gYTAwICogcyArIGEyMCAqIGM7XG4gICAgICAgIG1bOV0gPSBhMDEgKiBzICsgYTIxICogYztcbiAgICAgICAgbVsxMF0gPSBhMDIgKiBzICsgYTIyICogYztcbiAgICAgICAgbVsxMV0gPSBhMDMgKiBzICsgYTIzICogYztcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5Zyo57uZ5a6a55+p6Zi15Y+Y5o2i5Z+656GA5LiK5Yqg5YWl57uVIFog6L2055qE5peL6L2s5Y+Y5o2iXG4gICAgICogISNlbiBBZGRlZCBhYm91dCB0aGUgWiBheGlzIGF0IGEgZ2l2ZW4gcm90YXRpb25hbCB0cmFuc2Zvcm1hdGlvbiBtYXRyaXggdHJhbnNmb3JtYXRpb24gb24gdGhlIGJhc2lzIG9mXG4gICAgICogQG1ldGhvZCByb3RhdGVaXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiByb3RhdGVaPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHJhZDogbnVtYmVyKTogT3V0XG4gICAgICogQHBhcmFtIHJhZCDml4vovazop5LluqZcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHJvdGF0ZVo8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgcmFkOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgYW0gPSBhLm07XG4gICAgICAgIGxldCBtID0gb3V0Lm07XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihyYWQpLFxuICAgICAgICAgICAgYyA9IE1hdGguY29zKHJhZCksXG4gICAgICAgICAgICBhMDAgPSBhLm1bMF0sXG4gICAgICAgICAgICBhMDEgPSBhLm1bMV0sXG4gICAgICAgICAgICBhMDIgPSBhLm1bMl0sXG4gICAgICAgICAgICBhMDMgPSBhLm1bM10sXG4gICAgICAgICAgICBhMTAgPSBhLm1bNF0sXG4gICAgICAgICAgICBhMTEgPSBhLm1bNV0sXG4gICAgICAgICAgICBhMTIgPSBhLm1bNl0sXG4gICAgICAgICAgICBhMTMgPSBhLm1bN107XG5cbiAgICAgICAgLy8gSWYgdGhlIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gZGlmZmVyLCBjb3B5IHRoZSB1bmNoYW5nZWQgbGFzdCByb3dcbiAgICAgICAgaWYgKGEgIT09IG91dCkge1xuICAgICAgICAgICAgbVs4XSA9IGFtWzhdO1xuICAgICAgICAgICAgbVs5XSA9IGFtWzldO1xuICAgICAgICAgICAgbVsxMF0gPSBhbVsxMF07XG4gICAgICAgICAgICBtWzExXSA9IGFtWzExXTtcbiAgICAgICAgICAgIG1bMTJdID0gYW1bMTJdO1xuICAgICAgICAgICAgbVsxM10gPSBhbVsxM107XG4gICAgICAgICAgICBtWzE0XSA9IGFtWzE0XTtcbiAgICAgICAgICAgIG1bMTVdID0gYW1bMTVdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUGVyZm9ybSBheGlzLXNwZWNpZmljIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxuICAgICAgICBtWzBdID0gYTAwICogYyArIGExMCAqIHM7XG4gICAgICAgIG1bMV0gPSBhMDEgKiBjICsgYTExICogcztcbiAgICAgICAgbVsyXSA9IGEwMiAqIGMgKyBhMTIgKiBzO1xuICAgICAgICBtWzNdID0gYTAzICogYyArIGExMyAqIHM7XG4gICAgICAgIG1bNF0gPSBhMTAgKiBjIC0gYTAwICogcztcbiAgICAgICAgbVs1XSA9IGExMSAqIGMgLSBhMDEgKiBzO1xuICAgICAgICBtWzZdID0gYTEyICogYyAtIGEwMiAqIHM7XG4gICAgICAgIG1bN10gPSBhMTMgKiBjIC0gYTAzICogcztcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6K6h566X5L2N56e755+p6Zi1XG4gICAgICogISNlbiBEaXNwbGFjZW1lbnQgbWF0cml4IGNhbGN1bGF0aW9uXG4gICAgICogQG1ldGhvZCBmcm9tVHJhbnNsYXRpb25cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGZyb21UcmFuc2xhdGlvbjxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgdjogVmVjTGlrZSk6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbVRyYW5zbGF0aW9uPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCB2OiBWZWNMaWtlKSB7XG4gICAgICAgIGxldCBtID0gb3V0Lm07XG4gICAgICAgIG1bMF0gPSAxO1xuICAgICAgICBtWzFdID0gMDtcbiAgICAgICAgbVsyXSA9IDA7XG4gICAgICAgIG1bM10gPSAwO1xuICAgICAgICBtWzRdID0gMDtcbiAgICAgICAgbVs1XSA9IDE7XG4gICAgICAgIG1bNl0gPSAwO1xuICAgICAgICBtWzddID0gMDtcbiAgICAgICAgbVs4XSA9IDA7XG4gICAgICAgIG1bOV0gPSAwO1xuICAgICAgICBtWzEwXSA9IDE7XG4gICAgICAgIG1bMTFdID0gMDtcbiAgICAgICAgbVsxMl0gPSB2Lng7XG4gICAgICAgIG1bMTNdID0gdi55O1xuICAgICAgICBtWzE0XSA9IHYuejtcbiAgICAgICAgbVsxNV0gPSAxO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6K6h566X57yp5pS+55+p6Zi1XG4gICAgICogISNlbiBTY2FsaW5nIG1hdHJpeCBjYWxjdWxhdGlvblxuICAgICAqIEBtZXRob2QgZnJvbVNjYWxpbmdcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGZyb21TY2FsaW5nPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCB2OiBWZWNMaWtlKTogT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tU2NhbGluZzxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgdjogVmVjTGlrZSkge1xuICAgICAgICBsZXQgbSA9IG91dC5tO1xuICAgICAgICBtWzBdID0gdi54O1xuICAgICAgICBtWzFdID0gMDtcbiAgICAgICAgbVsyXSA9IDA7XG4gICAgICAgIG1bM10gPSAwO1xuICAgICAgICBtWzRdID0gMDtcbiAgICAgICAgbVs1XSA9IHYueTtcbiAgICAgICAgbVs2XSA9IDA7XG4gICAgICAgIG1bN10gPSAwO1xuICAgICAgICBtWzhdID0gMDtcbiAgICAgICAgbVs5XSA9IDA7XG4gICAgICAgIG1bMTBdID0gdi56O1xuICAgICAgICBtWzExXSA9IDA7XG4gICAgICAgIG1bMTJdID0gMDtcbiAgICAgICAgbVsxM10gPSAwO1xuICAgICAgICBtWzE0XSA9IDA7XG4gICAgICAgIG1bMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiuoeeul+aXi+i9rOefqemYtVxuICAgICAqICEjZW4gQ2FsY3VsYXRlcyB0aGUgcm90YXRpb24gbWF0cml4XG4gICAgICogQG1ldGhvZCBmcm9tUm90YXRpb25cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGZyb21Sb3RhdGlvbjxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgcmFkOiBudW1iZXIsIGF4aXM6IFZlY0xpa2UpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGZyb21Sb3RhdGlvbjxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgcmFkOiBudW1iZXIsIGF4aXM6IFZlY0xpa2UpIHtcbiAgICAgICAgbGV0IHggPSBheGlzLngsIHkgPSBheGlzLnksIHogPSBheGlzLno7XG4gICAgICAgIGxldCBsZW4gPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcblxuICAgICAgICBpZiAoTWF0aC5hYnMobGVuKSA8IEVQU0lMT04pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgbGVuID0gMSAvIGxlbjtcbiAgICAgICAgeCAqPSBsZW47XG4gICAgICAgIHkgKj0gbGVuO1xuICAgICAgICB6ICo9IGxlbjtcblxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4ocmFkKTtcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKHJhZCk7XG4gICAgICAgIGNvbnN0IHQgPSAxIC0gYztcblxuICAgICAgICAvLyBQZXJmb3JtIHJvdGF0aW9uLXNwZWNpZmljIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxuICAgICAgICBsZXQgbSA9IG91dC5tO1xuICAgICAgICBtWzBdID0geCAqIHggKiB0ICsgYztcbiAgICAgICAgbVsxXSA9IHkgKiB4ICogdCArIHogKiBzO1xuICAgICAgICBtWzJdID0geiAqIHggKiB0IC0geSAqIHM7XG4gICAgICAgIG1bM10gPSAwO1xuICAgICAgICBtWzRdID0geCAqIHkgKiB0IC0geiAqIHM7XG4gICAgICAgIG1bNV0gPSB5ICogeSAqIHQgKyBjO1xuICAgICAgICBtWzZdID0geiAqIHkgKiB0ICsgeCAqIHM7XG4gICAgICAgIG1bN10gPSAwO1xuICAgICAgICBtWzhdID0geCAqIHogKiB0ICsgeSAqIHM7XG4gICAgICAgIG1bOV0gPSB5ICogeiAqIHQgLSB4ICogcztcbiAgICAgICAgbVsxMF0gPSB6ICogeiAqIHQgKyBjO1xuICAgICAgICBtWzExXSA9IDA7XG4gICAgICAgIG1bMTJdID0gMDtcbiAgICAgICAgbVsxM10gPSAwO1xuICAgICAgICBtWzE0XSA9IDA7XG4gICAgICAgIG1bMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiuoeeul+e7lSBYIOi9tOeahOaXi+i9rOefqemYtVxuICAgICAqICEjZW4gQ2FsY3VsYXRpbmcgcm90YXRpb24gbWF0cml4IGFib3V0IHRoZSBYIGF4aXNcbiAgICAgKiBAbWV0aG9kIGZyb21YUm90YXRpb25cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGZyb21YUm90YXRpb248T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIHJhZDogbnVtYmVyKTogT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tWFJvdGF0aW9uPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCByYWQ6IG51bWJlcikge1xuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4ocmFkKSwgYyA9IE1hdGguY29zKHJhZCk7XG5cbiAgICAgICAgLy8gUGVyZm9ybSBheGlzLXNwZWNpZmljIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxuICAgICAgICBsZXQgbSA9IG91dC5tO1xuICAgICAgICBtWzBdID0gMTtcbiAgICAgICAgbVsxXSA9IDA7XG4gICAgICAgIG1bMl0gPSAwO1xuICAgICAgICBtWzNdID0gMDtcbiAgICAgICAgbVs0XSA9IDA7XG4gICAgICAgIG1bNV0gPSBjO1xuICAgICAgICBtWzZdID0gcztcbiAgICAgICAgbVs3XSA9IDA7XG4gICAgICAgIG1bOF0gPSAwO1xuICAgICAgICBtWzldID0gLXM7XG4gICAgICAgIG1bMTBdID0gYztcbiAgICAgICAgbVsxMV0gPSAwO1xuICAgICAgICBtWzEyXSA9IDA7XG4gICAgICAgIG1bMTNdID0gMDtcbiAgICAgICAgbVsxNF0gPSAwO1xuICAgICAgICBtWzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDorqHnrpfnu5UgWSDovbTnmoTml4vovaznn6npmLVcbiAgICAgKiAhI2VuIENhbGN1bGF0aW5nIHJvdGF0aW9uIG1hdHJpeCBhYm91dCB0aGUgWSBheGlzXG4gICAgICogQG1ldGhvZCBmcm9tWVJvdGF0aW9uXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBmcm9tWVJvdGF0aW9uPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCByYWQ6IG51bWJlcik6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbVlSb3RhdGlvbjxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgcmFkOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKHJhZCksIGMgPSBNYXRoLmNvcyhyYWQpO1xuXG4gICAgICAgIC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgbVswXSA9IGM7XG4gICAgICAgIG1bMV0gPSAwO1xuICAgICAgICBtWzJdID0gLXM7XG4gICAgICAgIG1bM10gPSAwO1xuICAgICAgICBtWzRdID0gMDtcbiAgICAgICAgbVs1XSA9IDE7XG4gICAgICAgIG1bNl0gPSAwO1xuICAgICAgICBtWzddID0gMDtcbiAgICAgICAgbVs4XSA9IHM7XG4gICAgICAgIG1bOV0gPSAwO1xuICAgICAgICBtWzEwXSA9IGM7XG4gICAgICAgIG1bMTFdID0gMDtcbiAgICAgICAgbVsxMl0gPSAwO1xuICAgICAgICBtWzEzXSA9IDA7XG4gICAgICAgIG1bMTRdID0gMDtcbiAgICAgICAgbVsxNV0gPSAxO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6K6h566X57uVIFog6L2055qE5peL6L2s55+p6Zi1XG4gICAgICogISNlbiBDYWxjdWxhdGluZyByb3RhdGlvbiBtYXRyaXggYWJvdXQgdGhlIFogYXhpc1xuICAgICAqIEBtZXRob2QgZnJvbVpSb3RhdGlvblxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZnJvbVpSb3RhdGlvbjxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgcmFkOiBudW1iZXIpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGZyb21aUm90YXRpb248T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIHJhZDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihyYWQpLCBjID0gTWF0aC5jb3MocmFkKTtcblxuICAgICAgICAvLyBQZXJmb3JtIGF4aXMtc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXG4gICAgICAgIGxldCBtID0gb3V0Lm07XG4gICAgICAgIG1bMF0gPSBjO1xuICAgICAgICBtWzFdID0gcztcbiAgICAgICAgbVsyXSA9IDA7XG4gICAgICAgIG1bM10gPSAwO1xuICAgICAgICBtWzRdID0gLXM7XG4gICAgICAgIG1bNV0gPSBjO1xuICAgICAgICBtWzZdID0gMDtcbiAgICAgICAgbVs3XSA9IDA7XG4gICAgICAgIG1bOF0gPSAwO1xuICAgICAgICBtWzldID0gMDtcbiAgICAgICAgbVsxMF0gPSAxO1xuICAgICAgICBtWzExXSA9IDA7XG4gICAgICAgIG1bMTJdID0gMDtcbiAgICAgICAgbVsxM10gPSAwO1xuICAgICAgICBtWzE0XSA9IDA7XG4gICAgICAgIG1bMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOagueaNruaXi+i9rOWSjOS9jeenu+S/oeaBr+iuoeeul+efqemYtVxuICAgICAqICEjZW4gVGhlIHJvdGF0aW9uIGFuZCBkaXNwbGFjZW1lbnQgaW5mb3JtYXRpb24gY2FsY3VsYXRpbmcgbWF0cml4XG4gICAgICogQG1ldGhvZCBmcm9tUlRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGZyb21SVDxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgcTogUXVhdCwgdjogVmVjTGlrZSk6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbVJUPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBxOiBRdWF0LCB2OiBWZWNMaWtlKSB7XG4gICAgICAgIGNvbnN0IHggPSBxLngsIHkgPSBxLnksIHogPSBxLnosIHcgPSBxLnc7XG4gICAgICAgIGNvbnN0IHgyID0geCArIHg7XG4gICAgICAgIGNvbnN0IHkyID0geSArIHk7XG4gICAgICAgIGNvbnN0IHoyID0geiArIHo7XG5cbiAgICAgICAgY29uc3QgeHggPSB4ICogeDI7XG4gICAgICAgIGNvbnN0IHh5ID0geCAqIHkyO1xuICAgICAgICBjb25zdCB4eiA9IHggKiB6MjtcbiAgICAgICAgY29uc3QgeXkgPSB5ICogeTI7XG4gICAgICAgIGNvbnN0IHl6ID0geSAqIHoyO1xuICAgICAgICBjb25zdCB6eiA9IHogKiB6MjtcbiAgICAgICAgY29uc3Qgd3ggPSB3ICogeDI7XG4gICAgICAgIGNvbnN0IHd5ID0gdyAqIHkyO1xuICAgICAgICBjb25zdCB3eiA9IHcgKiB6MjtcblxuICAgICAgICBsZXQgbSA9IG91dC5tO1xuICAgICAgICBtWzBdID0gMSAtICh5eSArIHp6KTtcbiAgICAgICAgbVsxXSA9IHh5ICsgd3o7XG4gICAgICAgIG1bMl0gPSB4eiAtIHd5O1xuICAgICAgICBtWzNdID0gMDtcbiAgICAgICAgbVs0XSA9IHh5IC0gd3o7XG4gICAgICAgIG1bNV0gPSAxIC0gKHh4ICsgenopO1xuICAgICAgICBtWzZdID0geXogKyB3eDtcbiAgICAgICAgbVs3XSA9IDA7XG4gICAgICAgIG1bOF0gPSB4eiArIHd5O1xuICAgICAgICBtWzldID0geXogLSB3eDtcbiAgICAgICAgbVsxMF0gPSAxIC0gKHh4ICsgeXkpO1xuICAgICAgICBtWzExXSA9IDA7XG4gICAgICAgIG1bMTJdID0gdi54O1xuICAgICAgICBtWzEzXSA9IHYueTtcbiAgICAgICAgbVsxNF0gPSB2Lno7XG4gICAgICAgIG1bMTVdID0gMTtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5o+Q5Y+W55+p6Zi155qE5L2N56e75L+h5oGvLCDpu5jorqTnn6npmLXkuK3nmoTlj5jmjaLku6UgUy0+Ui0+VCDnmoTpobrluo/lupTnlKhcbiAgICAgKiAhI2VuIEV4dHJhY3RpbmcgZGlzcGxhY2VtZW50IGluZm9ybWF0aW9uIG9mIHRoZSBtYXRyaXgsIHRoZSBtYXRyaXggdHJhbnNmb3JtIHRvIHRoZSBkZWZhdWx0IHNlcXVlbnRpYWwgYXBwbGljYXRpb24gUy0+IFItPiBUIGlzXG4gICAgICogQG1ldGhvZCBnZXRUcmFuc2xhdGlvblxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZ2V0VHJhbnNsYXRpb248T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBWZWNMaWtlLCBtYXQ6IE91dCk6IFZlY0xpa2VcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGdldFRyYW5zbGF0aW9uPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogVmVjTGlrZSwgbWF0OiBPdXQpIHtcbiAgICAgICAgbGV0IG0gPSBtYXQubTtcbiAgICAgICAgb3V0LnggPSBtWzEyXTtcbiAgICAgICAgb3V0LnkgPSBtWzEzXTtcbiAgICAgICAgb3V0LnogPSBtWzE0XTtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5o+Q5Y+W55+p6Zi155qE57yp5pS+5L+h5oGvLCDpu5jorqTnn6npmLXkuK3nmoTlj5jmjaLku6UgUy0+Ui0+VCDnmoTpobrluo/lupTnlKhcbiAgICAgKiAhI2VuIFNjYWxpbmcgaW5mb3JtYXRpb24gZXh0cmFjdGlvbiBtYXRyaXgsIHRoZSBtYXRyaXggdHJhbnNmb3JtIHRvIHRoZSBkZWZhdWx0IHNlcXVlbnRpYWwgYXBwbGljYXRpb24gUy0+IFItPiBUIGlzXG4gICAgICogQG1ldGhvZCBnZXRTY2FsaW5nXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBnZXRTY2FsaW5nPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogVmVjTGlrZSwgbWF0OiBPdXQpOiBWZWNMaWtlXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBnZXRTY2FsaW5nPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogVmVjTGlrZSwgbWF0OiBPdXQpIHtcbiAgICAgICAgbGV0IG0gPSBtYXQubTtcbiAgICAgICAgbGV0IG0zID0gbTNfMS5tO1xuICAgICAgICBjb25zdCBtMDAgPSBtM1swXSA9IG1bMF07XG4gICAgICAgIGNvbnN0IG0wMSA9IG0zWzFdID0gbVsxXTtcbiAgICAgICAgY29uc3QgbTAyID0gbTNbMl0gPSBtWzJdO1xuICAgICAgICBjb25zdCBtMDQgPSBtM1szXSA9IG1bNF07XG4gICAgICAgIGNvbnN0IG0wNSA9IG0zWzRdID0gbVs1XTtcbiAgICAgICAgY29uc3QgbTA2ID0gbTNbNV0gPSBtWzZdO1xuICAgICAgICBjb25zdCBtMDggPSBtM1s2XSA9IG1bOF07XG4gICAgICAgIGNvbnN0IG0wOSA9IG0zWzddID0gbVs5XTtcbiAgICAgICAgY29uc3QgbTEwID0gbTNbOF0gPSBtWzEwXTtcbiAgICAgICAgb3V0LnggPSBNYXRoLnNxcnQobTAwICogbTAwICsgbTAxICogbTAxICsgbTAyICogbTAyKTtcbiAgICAgICAgb3V0LnkgPSBNYXRoLnNxcnQobTA0ICogbTA0ICsgbTA1ICogbTA1ICsgbTA2ICogbTA2KTtcbiAgICAgICAgb3V0LnogPSBNYXRoLnNxcnQobTA4ICogbTA4ICsgbTA5ICogbTA5ICsgbTEwICogbTEwKTtcbiAgICAgICAgLy8gYWNjb3VudCBmb3IgcmVmZWN0aW9uc1xuICAgICAgICBpZiAoTWF0My5kZXRlcm1pbmFudChtM18xKSA8IDApIHsgb3V0LnggKj0gLTE7IH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOaPkOWPluefqemYteeahOaXi+i9rOS/oeaBrywg6buY6K6k6L6T5YWl55+p6Zi15LiN5ZCr5pyJ57yp5pS+5L+h5oGv77yM5aaC6ICD6JmR57yp5pS+5bqU5L2/55SoIGB0b1JUU2Ag5Ye95pWw44CCXG4gICAgICogISNlbiBSb3RhdGlvbiBpbmZvcm1hdGlvbiBleHRyYWN0aW9uIG1hdHJpeCwgdGhlIG1hdHJpeCBjb250YWluaW5nIG5vIGRlZmF1bHQgaW5wdXQgc2NhbGluZyBpbmZvcm1hdGlvbiwgc3VjaCBhcyB0aGUgdXNlIG9mIGB0b1JUU2Agc2hvdWxkIGNvbnNpZGVyIHRoZSBzY2FsaW5nIGZ1bmN0aW9uLlxuICAgICAqIEBtZXRob2QgZ2V0Um90YXRpb25cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGdldFJvdGF0aW9uPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogUXVhdCwgbWF0OiBPdXQpOiBRdWF0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBnZXRSb3RhdGlvbjxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IFF1YXQsIG1hdDogT3V0KSB7XG4gICAgICAgIGxldCBtID0gbWF0Lm07XG4gICAgICAgIGNvbnN0IHRyYWNlID0gbVswXSArIG1bNV0gKyBtWzEwXTtcbiAgICAgICAgbGV0IFMgPSAwO1xuXG4gICAgICAgIGlmICh0cmFjZSA+IDApIHtcbiAgICAgICAgICAgIFMgPSBNYXRoLnNxcnQodHJhY2UgKyAxLjApICogMjtcbiAgICAgICAgICAgIG91dC53ID0gMC4yNSAqIFM7XG4gICAgICAgICAgICBvdXQueCA9IChtWzZdIC0gbVs5XSkgLyBTO1xuICAgICAgICAgICAgb3V0LnkgPSAobVs4XSAtIG1bMl0pIC8gUztcbiAgICAgICAgICAgIG91dC56ID0gKG1bMV0gLSBtWzRdKSAvIFM7XG4gICAgICAgIH0gZWxzZSBpZiAoKG1bMF0gPiBtWzVdKSAmJiAobVswXSA+IG1bMTBdKSkge1xuICAgICAgICAgICAgUyA9IE1hdGguc3FydCgxLjAgKyBtWzBdIC0gbVs1XSAtIG1bMTBdKSAqIDI7XG4gICAgICAgICAgICBvdXQudyA9IChtWzZdIC0gbVs5XSkgLyBTO1xuICAgICAgICAgICAgb3V0LnggPSAwLjI1ICogUztcbiAgICAgICAgICAgIG91dC55ID0gKG1bMV0gKyBtWzRdKSAvIFM7XG4gICAgICAgICAgICBvdXQueiA9IChtWzhdICsgbVsyXSkgLyBTO1xuICAgICAgICB9IGVsc2UgaWYgKG1bNV0gPiBtWzEwXSkge1xuICAgICAgICAgICAgUyA9IE1hdGguc3FydCgxLjAgKyBtWzVdIC0gbVswXSAtIG1bMTBdKSAqIDI7XG4gICAgICAgICAgICBvdXQudyA9IChtWzhdIC0gbVsyXSkgLyBTO1xuICAgICAgICAgICAgb3V0LnggPSAobVsxXSArIG1bNF0pIC8gUztcbiAgICAgICAgICAgIG91dC55ID0gMC4yNSAqIFM7XG4gICAgICAgICAgICBvdXQueiA9IChtWzZdICsgbVs5XSkgLyBTO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgUyA9IE1hdGguc3FydCgxLjAgKyBtWzEwXSAtIG1bMF0gLSBtWzVdKSAqIDI7XG4gICAgICAgICAgICBvdXQudyA9IChtWzFdIC0gbVs0XSkgLyBTO1xuICAgICAgICAgICAgb3V0LnggPSAobVs4XSArIG1bMl0pIC8gUztcbiAgICAgICAgICAgIG91dC55ID0gKG1bNl0gKyBtWzldKSAvIFM7XG4gICAgICAgICAgICBvdXQueiA9IDAuMjUgKiBTO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOaPkOWPluaXi+i9rOOAgeS9jeenu+OAgee8qeaUvuS/oeaBr++8jCDpu5jorqTnn6npmLXkuK3nmoTlj5jmjaLku6UgUy0+Ui0+VCDnmoTpobrluo/lupTnlKhcbiAgICAgKiAhI2VuIEV4dHJhY3Rpbmcgcm90YXRpb25hbCBkaXNwbGFjZW1lbnQsIHpvb20gaW5mb3JtYXRpb24sIHRoZSBkZWZhdWx0IG1hdHJpeCB0cmFuc2Zvcm1hdGlvbiBpbiBvcmRlciBTLT4gUi0+IFQgYXBwbGljYXRpb25zXG4gICAgICogQG1ldGhvZCB0b1JUU1xuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogdG9SVFM8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAobWF0OiBPdXQsIHE6IFF1YXQsIHY6IFZlY0xpa2UsIHM6IFZlY0xpa2UpOiB2b2lkXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyB0b1JUUzxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChtYXQ6IE91dCwgcTogUXVhdCwgdjogVmVjTGlrZSwgczogVmVjTGlrZSkge1xuICAgICAgICBsZXQgbSA9IG1hdC5tO1xuICAgICAgICBsZXQgbTMgPSBtM18xLm07XG4gICAgICAgIHMueCA9IFZlYzMuc2V0KHYzXzEsIG1bMF0sIG1bMV0sIG1bMl0pLm1hZygpO1xuICAgICAgICBtM1swXSA9IG1bMF0gLyBzLng7XG4gICAgICAgIG0zWzFdID0gbVsxXSAvIHMueDtcbiAgICAgICAgbTNbMl0gPSBtWzJdIC8gcy54O1xuICAgICAgICBzLnkgPSBWZWMzLnNldCh2M18xLCBtWzRdLCBtWzVdLCBtWzZdKS5tYWcoKTtcbiAgICAgICAgbTNbM10gPSBtWzRdIC8gcy55O1xuICAgICAgICBtM1s0XSA9IG1bNV0gLyBzLnk7XG4gICAgICAgIG0zWzVdID0gbVs2XSAvIHMueTtcbiAgICAgICAgcy56ID0gVmVjMy5zZXQodjNfMSwgbVs4XSwgbVs5XSwgbVsxMF0pLm1hZygpO1xuICAgICAgICBtM1s2XSA9IG1bOF0gLyBzLno7XG4gICAgICAgIG0zWzddID0gbVs5XSAvIHMuejtcbiAgICAgICAgbTNbOF0gPSBtWzEwXSAvIHMuejtcbiAgICAgICAgY29uc3QgZGV0ID0gTWF0My5kZXRlcm1pbmFudChtM18xKTtcbiAgICAgICAgaWYgKGRldCA8IDApIHsgcy54ICo9IC0xOyBtM1swXSAqPSAtMTsgbTNbMV0gKj0gLTE7IG0zWzJdICo9IC0xOyB9XG4gICAgICAgIFF1YXQuZnJvbU1hdDMocSwgbTNfMSk7IC8vIGFscmVhZHkgbm9ybWFsaXplZFxuICAgICAgICBWZWMzLnNldCh2LCBtWzEyXSwgbVsxM10sIG1bMTRdKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOagueaNruaXi+i9rOOAgeS9jeenu+OAgee8qeaUvuS/oeaBr+iuoeeul+efqemYte+8jOS7pSBTLT5SLT5UIOeahOmhuuW6j+W6lOeUqFxuICAgICAqICEjZW4gVGhlIHJvdGFyeSBkaXNwbGFjZW1lbnQsIHRoZSBzY2FsaW5nIG1hdHJpeCBjYWxjdWxhdGlvbiBpbmZvcm1hdGlvbiwgdGhlIG9yZGVyIFMtPiBSLT4gVCBhcHBsaWNhdGlvbnNcbiAgICAgKiBAbWV0aG9kIGZyb21SVFNcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGZyb21SVFM8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHE6IFF1YXQsIHY6IFZlY0xpa2UsIHM6IFZlY0xpa2UpOiBPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGZyb21SVFM8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHE6IFF1YXQsIHY6IFZlY0xpa2UsIHM6IFZlY0xpa2UpIHtcbiAgICAgICAgY29uc3QgeCA9IHEueCwgeSA9IHEueSwgeiA9IHEueiwgdyA9IHEudztcbiAgICAgICAgY29uc3QgeDIgPSB4ICsgeDtcbiAgICAgICAgY29uc3QgeTIgPSB5ICsgeTtcbiAgICAgICAgY29uc3QgejIgPSB6ICsgejtcblxuICAgICAgICBjb25zdCB4eCA9IHggKiB4MjtcbiAgICAgICAgY29uc3QgeHkgPSB4ICogeTI7XG4gICAgICAgIGNvbnN0IHh6ID0geCAqIHoyO1xuICAgICAgICBjb25zdCB5eSA9IHkgKiB5MjtcbiAgICAgICAgY29uc3QgeXogPSB5ICogejI7XG4gICAgICAgIGNvbnN0IHp6ID0geiAqIHoyO1xuICAgICAgICBjb25zdCB3eCA9IHcgKiB4MjtcbiAgICAgICAgY29uc3Qgd3kgPSB3ICogeTI7XG4gICAgICAgIGNvbnN0IHd6ID0gdyAqIHoyO1xuICAgICAgICBjb25zdCBzeCA9IHMueDtcbiAgICAgICAgY29uc3Qgc3kgPSBzLnk7XG4gICAgICAgIGNvbnN0IHN6ID0gcy56O1xuXG4gICAgICAgIGxldCBtID0gb3V0Lm07XG4gICAgICAgIG1bMF0gPSAoMSAtICh5eSArIHp6KSkgKiBzeDtcbiAgICAgICAgbVsxXSA9ICh4eSArIHd6KSAqIHN4O1xuICAgICAgICBtWzJdID0gKHh6IC0gd3kpICogc3g7XG4gICAgICAgIG1bM10gPSAwO1xuICAgICAgICBtWzRdID0gKHh5IC0gd3opICogc3k7XG4gICAgICAgIG1bNV0gPSAoMSAtICh4eCArIHp6KSkgKiBzeTtcbiAgICAgICAgbVs2XSA9ICh5eiArIHd4KSAqIHN5O1xuICAgICAgICBtWzddID0gMDtcbiAgICAgICAgbVs4XSA9ICh4eiArIHd5KSAqIHN6O1xuICAgICAgICBtWzldID0gKHl6IC0gd3gpICogc3o7XG4gICAgICAgIG1bMTBdID0gKDEgLSAoeHggKyB5eSkpICogc3o7XG4gICAgICAgIG1bMTFdID0gMDtcbiAgICAgICAgbVsxMl0gPSB2Lng7XG4gICAgICAgIG1bMTNdID0gdi55O1xuICAgICAgICBtWzE0XSA9IHYuejtcbiAgICAgICAgbVsxNV0gPSAxO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmoLnmja7mjIflrprnmoTml4vovazjgIHkvY3np7vjgIHnvKnmlL7lj4rlj5jmjaLkuK3lv4Pkv6Hmga/orqHnrpfnn6npmLXvvIzku6UgUy0+Ui0+VCDnmoTpobrluo/lupTnlKhcbiAgICAgKiAhI2VuIEFjY29yZGluZyB0byB0aGUgc3BlY2lmaWVkIHJvdGF0aW9uLCBkaXNwbGFjZW1lbnQsIGFuZCBzY2FsZSBjb252ZXJzaW9uIG1hdHJpeCBjYWxjdWxhdGlvbiBpbmZvcm1hdGlvbiBjZW50ZXIsIG9yZGVyIFMtPiBSLT4gVCBhcHBsaWNhdGlvbnNcbiAgICAgKiBAbWV0aG9kIGZyb21SVFNPcmlnaW5cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGZyb21SVFNPcmlnaW48T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHE6IFF1YXQsIHY6IFZlY0xpa2UsIHM6IFZlY0xpa2UsIG86IFZlY0xpa2UpOiBPdXRcbiAgICAgKiBAcGFyYW0gcSDml4vovazlgLxcbiAgICAgKiBAcGFyYW0gdiDkvY3np7vlgLxcbiAgICAgKiBAcGFyYW0gcyDnvKnmlL7lgLxcbiAgICAgKiBAcGFyYW0gbyDmjIflrprlj5jmjaLkuK3lv4NcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGZyb21SVFNPcmlnaW48T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHE6IFF1YXQsIHY6IFZlY0xpa2UsIHM6IFZlY0xpa2UsIG86IFZlY0xpa2UpIHtcbiAgICAgICAgY29uc3QgeCA9IHEueCwgeSA9IHEueSwgeiA9IHEueiwgdyA9IHEudztcbiAgICAgICAgY29uc3QgeDIgPSB4ICsgeDtcbiAgICAgICAgY29uc3QgeTIgPSB5ICsgeTtcbiAgICAgICAgY29uc3QgejIgPSB6ICsgejtcblxuICAgICAgICBjb25zdCB4eCA9IHggKiB4MjtcbiAgICAgICAgY29uc3QgeHkgPSB4ICogeTI7XG4gICAgICAgIGNvbnN0IHh6ID0geCAqIHoyO1xuICAgICAgICBjb25zdCB5eSA9IHkgKiB5MjtcbiAgICAgICAgY29uc3QgeXogPSB5ICogejI7XG4gICAgICAgIGNvbnN0IHp6ID0geiAqIHoyO1xuICAgICAgICBjb25zdCB3eCA9IHcgKiB4MjtcbiAgICAgICAgY29uc3Qgd3kgPSB3ICogeTI7XG4gICAgICAgIGNvbnN0IHd6ID0gdyAqIHoyO1xuXG4gICAgICAgIGNvbnN0IHN4ID0gcy54O1xuICAgICAgICBjb25zdCBzeSA9IHMueTtcbiAgICAgICAgY29uc3Qgc3ogPSBzLno7XG5cbiAgICAgICAgY29uc3Qgb3ggPSBvLng7XG4gICAgICAgIGNvbnN0IG95ID0gby55O1xuICAgICAgICBjb25zdCBveiA9IG8uejtcblxuICAgICAgICBsZXQgbSA9IG91dC5tO1xuICAgICAgICBtWzBdID0gKDEgLSAoeXkgKyB6eikpICogc3g7XG4gICAgICAgIG1bMV0gPSAoeHkgKyB3eikgKiBzeDtcbiAgICAgICAgbVsyXSA9ICh4eiAtIHd5KSAqIHN4O1xuICAgICAgICBtWzNdID0gMDtcbiAgICAgICAgbVs0XSA9ICh4eSAtIHd6KSAqIHN5O1xuICAgICAgICBtWzVdID0gKDEgLSAoeHggKyB6eikpICogc3k7XG4gICAgICAgIG1bNl0gPSAoeXogKyB3eCkgKiBzeTtcbiAgICAgICAgbVs3XSA9IDA7XG4gICAgICAgIG1bOF0gPSAoeHogKyB3eSkgKiBzejtcbiAgICAgICAgbVs5XSA9ICh5eiAtIHd4KSAqIHN6O1xuICAgICAgICBtWzEwXSA9ICgxIC0gKHh4ICsgeXkpKSAqIHN6O1xuICAgICAgICBtWzExXSA9IDA7XG4gICAgICAgIG1bMTJdID0gdi54ICsgb3ggLSAobVswXSAqIG94ICsgbVs0XSAqIG95ICsgbVs4XSAqIG96KTtcbiAgICAgICAgbVsxM10gPSB2LnkgKyBveSAtIChtWzFdICogb3ggKyBtWzVdICogb3kgKyBtWzldICogb3opO1xuICAgICAgICBtWzE0XSA9IHYueiArIG96IC0gKG1bMl0gKiBveCArIG1bNl0gKiBveSArIG1bMTBdICogb3opO1xuICAgICAgICBtWzE1XSA9IDE7XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOagueaNruaMh+WumueahOaXi+i9rOS/oeaBr+iuoeeul+efqemYtVxuICAgICAqICEjZW4gVGhlIHJvdGF0aW9uIG1hdHJpeCBjYWxjdWxhdGlvbiBpbmZvcm1hdGlvbiBzcGVjaWZpZWRcbiAgICAgKiBAbWV0aG9kIGZyb21RdWF0XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBmcm9tUXVhdDxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgcTogUXVhdCk6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbVF1YXQ8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIHE6IFF1YXQpIHtcbiAgICAgICAgY29uc3QgeCA9IHEueCwgeSA9IHEueSwgeiA9IHEueiwgdyA9IHEudztcbiAgICAgICAgY29uc3QgeDIgPSB4ICsgeDtcbiAgICAgICAgY29uc3QgeTIgPSB5ICsgeTtcbiAgICAgICAgY29uc3QgejIgPSB6ICsgejtcblxuICAgICAgICBjb25zdCB4eCA9IHggKiB4MjtcbiAgICAgICAgY29uc3QgeXggPSB5ICogeDI7XG4gICAgICAgIGNvbnN0IHl5ID0geSAqIHkyO1xuICAgICAgICBjb25zdCB6eCA9IHogKiB4MjtcbiAgICAgICAgY29uc3QgenkgPSB6ICogeTI7XG4gICAgICAgIGNvbnN0IHp6ID0geiAqIHoyO1xuICAgICAgICBjb25zdCB3eCA9IHcgKiB4MjtcbiAgICAgICAgY29uc3Qgd3kgPSB3ICogeTI7XG4gICAgICAgIGNvbnN0IHd6ID0gdyAqIHoyO1xuXG4gICAgICAgIGxldCBtID0gb3V0Lm07XG4gICAgICAgIG1bMF0gPSAxIC0geXkgLSB6ejtcbiAgICAgICAgbVsxXSA9IHl4ICsgd3o7XG4gICAgICAgIG1bMl0gPSB6eCAtIHd5O1xuICAgICAgICBtWzNdID0gMDtcblxuICAgICAgICBtWzRdID0geXggLSB3ejtcbiAgICAgICAgbVs1XSA9IDEgLSB4eCAtIHp6O1xuICAgICAgICBtWzZdID0genkgKyB3eDtcbiAgICAgICAgbVs3XSA9IDA7XG5cbiAgICAgICAgbVs4XSA9IHp4ICsgd3k7XG4gICAgICAgIG1bOV0gPSB6eSAtIHd4O1xuICAgICAgICBtWzEwXSA9IDEgLSB4eCAtIHl5O1xuICAgICAgICBtWzExXSA9IDA7XG5cbiAgICAgICAgbVsxMl0gPSAwO1xuICAgICAgICBtWzEzXSA9IDA7XG4gICAgICAgIG1bMTRdID0gMDtcbiAgICAgICAgbVsxNV0gPSAxO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmoLnmja7mjIflrprnmoTop4bplKXkvZPkv6Hmga/orqHnrpfnn6npmLVcbiAgICAgKiAhI2VuIFRoZSBtYXRyaXggY2FsY3VsYXRpb24gaW5mb3JtYXRpb24gc3BlY2lmaWVkIGZydXN0dW1cbiAgICAgKiBAbWV0aG9kIGZydXN0dW1cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGZydXN0dW08T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGxlZnQ6IG51bWJlciwgcmlnaHQ6IG51bWJlciwgYm90dG9tOiBudW1iZXIsIHRvcDogbnVtYmVyLCBuZWFyOiBudW1iZXIsIGZhcjogbnVtYmVyKTogT3V0XG4gICAgICogQHBhcmFtIGxlZnQg5bem5bmz6Z2i6Led56a7XG4gICAgICogQHBhcmFtIHJpZ2h0IOWPs+W5s+mdoui3neemu1xuICAgICAqIEBwYXJhbSBib3R0b20g5LiL5bmz6Z2i6Led56a7XG4gICAgICogQHBhcmFtIHRvcCDkuIrlubPpnaLot53nprtcbiAgICAgKiBAcGFyYW0gbmVhciDov5HlubPpnaLot53nprtcbiAgICAgKiBAcGFyYW0gZmFyIOi/nOW5s+mdoui3neemu1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJ1c3R1bTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgbGVmdDogbnVtYmVyLCByaWdodDogbnVtYmVyLCBib3R0b206IG51bWJlciwgdG9wOiBudW1iZXIsIG5lYXI6IG51bWJlciwgZmFyOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgcmwgPSAxIC8gKHJpZ2h0IC0gbGVmdCk7XG4gICAgICAgIGNvbnN0IHRiID0gMSAvICh0b3AgLSBib3R0b20pO1xuICAgICAgICBjb25zdCBuZiA9IDEgLyAobmVhciAtIGZhcik7XG5cbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgbVswXSA9IChuZWFyICogMikgKiBybDtcbiAgICAgICAgbVsxXSA9IDA7XG4gICAgICAgIG1bMl0gPSAwO1xuICAgICAgICBtWzNdID0gMDtcbiAgICAgICAgbVs0XSA9IDA7XG4gICAgICAgIG1bNV0gPSAobmVhciAqIDIpICogdGI7XG4gICAgICAgIG1bNl0gPSAwO1xuICAgICAgICBtWzddID0gMDtcbiAgICAgICAgbVs4XSA9IChyaWdodCArIGxlZnQpICogcmw7XG4gICAgICAgIG1bOV0gPSAodG9wICsgYm90dG9tKSAqIHRiO1xuICAgICAgICBtWzEwXSA9IChmYXIgKyBuZWFyKSAqIG5mO1xuICAgICAgICBtWzExXSA9IC0xO1xuICAgICAgICBtWzEyXSA9IDA7XG4gICAgICAgIG1bMTNdID0gMDtcbiAgICAgICAgbVsxNF0gPSAoZmFyICogbmVhciAqIDIpICogbmY7XG4gICAgICAgIG1bMTVdID0gMDtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiuoeeul+mAj+inhuaKleW9seefqemYtVxuICAgICAqICEjZW4gUGVyc3BlY3RpdmUgcHJvamVjdGlvbiBtYXRyaXggY2FsY3VsYXRpb25cbiAgICAgKiBAbWV0aG9kIHBlcnNwZWN0aXZlXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBwZXJzcGVjdGl2ZTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgZm92eTogbnVtYmVyLCBhc3BlY3Q6IG51bWJlciwgbmVhcjogbnVtYmVyLCBmYXI6IG51bWJlcik6IE91dFxuICAgICAqIEBwYXJhbSBmb3Z5IOe6teWQkeinhuinkumrmOW6plxuICAgICAqIEBwYXJhbSBhc3BlY3Qg6ZW/5a695q+UXG4gICAgICogQHBhcmFtIG5lYXIg6L+R5bmz6Z2i6Led56a7XG4gICAgICogQHBhcmFtIGZhciDov5zlubPpnaLot53nprtcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHBlcnNwZWN0aXZlPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBmb3Z5OiBudW1iZXIsIGFzcGVjdDogbnVtYmVyLCBuZWFyOiBudW1iZXIsIGZhcjogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGYgPSAxLjAgLyBNYXRoLnRhbihmb3Z5IC8gMik7XG4gICAgICAgIGNvbnN0IG5mID0gMSAvIChuZWFyIC0gZmFyKTtcblxuICAgICAgICBsZXQgbSA9IG91dC5tO1xuICAgICAgICBtWzBdID0gZiAvIGFzcGVjdDtcbiAgICAgICAgbVsxXSA9IDA7XG4gICAgICAgIG1bMl0gPSAwO1xuICAgICAgICBtWzNdID0gMDtcbiAgICAgICAgbVs0XSA9IDA7XG4gICAgICAgIG1bNV0gPSBmO1xuICAgICAgICBtWzZdID0gMDtcbiAgICAgICAgbVs3XSA9IDA7XG4gICAgICAgIG1bOF0gPSAwO1xuICAgICAgICBtWzldID0gMDtcbiAgICAgICAgbVsxMF0gPSAoZmFyICsgbmVhcikgKiBuZjtcbiAgICAgICAgbVsxMV0gPSAtMTtcbiAgICAgICAgbVsxMl0gPSAwO1xuICAgICAgICBtWzEzXSA9IDA7XG4gICAgICAgIG1bMTRdID0gKDIgKiBmYXIgKiBuZWFyKSAqIG5mO1xuICAgICAgICBtWzE1XSA9IDA7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDorqHnrpfmraPkuqTmipXlvbHnn6npmLVcbiAgICAgKiAhI2VuIENvbXB1dGluZyBvcnRob2dvbmFsIHByb2plY3Rpb24gbWF0cml4XG4gICAgICogQG1ldGhvZCBvcnRob1xuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogb3J0aG88T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGxlZnQ6IG51bWJlciwgcmlnaHQ6IG51bWJlciwgYm90dG9tOiBudW1iZXIsIHRvcDogbnVtYmVyLCBuZWFyOiBudW1iZXIsIGZhcjogbnVtYmVyKTogT3V0XG4gICAgICogQHBhcmFtIGxlZnQg5bem5bmz6Z2i6Led56a7XG4gICAgICogQHBhcmFtIHJpZ2h0IOWPs+W5s+mdoui3neemu1xuICAgICAqIEBwYXJhbSBib3R0b20g5LiL5bmz6Z2i6Led56a7XG4gICAgICogQHBhcmFtIHRvcCDkuIrlubPpnaLot53nprtcbiAgICAgKiBAcGFyYW0gbmVhciDov5HlubPpnaLot53nprtcbiAgICAgKiBAcGFyYW0gZmFyIOi/nOW5s+mdoui3neemu1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgb3J0aG88T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGxlZnQ6IG51bWJlciwgcmlnaHQ6IG51bWJlciwgYm90dG9tOiBudW1iZXIsIHRvcDogbnVtYmVyLCBuZWFyOiBudW1iZXIsIGZhcjogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGxyID0gMSAvIChsZWZ0IC0gcmlnaHQpO1xuICAgICAgICBjb25zdCBidCA9IDEgLyAoYm90dG9tIC0gdG9wKTtcbiAgICAgICAgY29uc3QgbmYgPSAxIC8gKG5lYXIgLSBmYXIpO1xuICAgICAgICBsZXQgbSA9IG91dC5tO1xuICAgICAgICBtWzBdID0gLTIgKiBscjtcbiAgICAgICAgbVsxXSA9IDA7XG4gICAgICAgIG1bMl0gPSAwO1xuICAgICAgICBtWzNdID0gMDtcbiAgICAgICAgbVs0XSA9IDA7XG4gICAgICAgIG1bNV0gPSAtMiAqIGJ0O1xuICAgICAgICBtWzZdID0gMDtcbiAgICAgICAgbVs3XSA9IDA7XG4gICAgICAgIG1bOF0gPSAwO1xuICAgICAgICBtWzldID0gMDtcbiAgICAgICAgbVsxMF0gPSAyICogbmY7XG4gICAgICAgIG1bMTFdID0gMDtcbiAgICAgICAgbVsxMl0gPSAobGVmdCArIHJpZ2h0KSAqIGxyO1xuICAgICAgICBtWzEzXSA9ICh0b3AgKyBib3R0b20pICogYnQ7XG4gICAgICAgIG1bMTRdID0gKGZhciArIG5lYXIpICogbmY7XG4gICAgICAgIG1bMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOagueaNruinhueCueiuoeeul+efqemYte+8jOazqOaEjyBgZXllIC0gY2VudGVyYCDkuI3og73kuLrpm7blkJHph4/miJbkuI4gYHVwYCDlkJHph4/lubPooYxcbiAgICAgKiAhI2VuIGBVcGAgcGFyYWxsZWwgdmVjdG9yIG9yIHZlY3RvciBjZW50ZXJgIG5vdCBiZSB6ZXJvIC0gdGhlIG1hdHJpeCBjYWxjdWxhdGlvbiBhY2NvcmRpbmcgdG8gdGhlIHZpZXdwb2ludCwgbm90ZWAgZXllXG4gICAgICogQG1ldGhvZCBsb29rQXRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGxvb2tBdDxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgZXllOiBWZWNMaWtlLCBjZW50ZXI6IFZlY0xpa2UsIHVwOiBWZWNMaWtlKTogT3V0XG4gICAgICogQHBhcmFtIGV5ZSDlvZPliY3kvY3nva5cbiAgICAgKiBAcGFyYW0gY2VudGVyIOebruagh+inhueCuVxuICAgICAqIEBwYXJhbSB1cCDop4blj6PkuIrmlrnlkJFcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGxvb2tBdDxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgZXllOiBWZWNMaWtlLCBjZW50ZXI6IFZlY0xpa2UsIHVwOiBWZWNMaWtlKSB7XG4gICAgICAgIGNvbnN0IGV5ZXggPSBleWUueDtcbiAgICAgICAgY29uc3QgZXlleSA9IGV5ZS55O1xuICAgICAgICBjb25zdCBleWV6ID0gZXllLno7XG4gICAgICAgIGNvbnN0IHVweCA9IHVwLng7XG4gICAgICAgIGNvbnN0IHVweSA9IHVwLnk7XG4gICAgICAgIGNvbnN0IHVweiA9IHVwLno7XG4gICAgICAgIGNvbnN0IGNlbnRlcnggPSBjZW50ZXIueDtcbiAgICAgICAgY29uc3QgY2VudGVyeSA9IGNlbnRlci55O1xuICAgICAgICBjb25zdCBjZW50ZXJ6ID0gY2VudGVyLno7XG5cbiAgICAgICAgbGV0IHowID0gZXlleCAtIGNlbnRlcng7XG4gICAgICAgIGxldCB6MSA9IGV5ZXkgLSBjZW50ZXJ5O1xuICAgICAgICBsZXQgejIgPSBleWV6IC0gY2VudGVyejtcblxuICAgICAgICBsZXQgbGVuID0gMSAvIE1hdGguc3FydCh6MCAqIHowICsgejEgKiB6MSArIHoyICogejIpO1xuICAgICAgICB6MCAqPSBsZW47XG4gICAgICAgIHoxICo9IGxlbjtcbiAgICAgICAgejIgKj0gbGVuO1xuXG4gICAgICAgIGxldCB4MCA9IHVweSAqIHoyIC0gdXB6ICogejE7XG4gICAgICAgIGxldCB4MSA9IHVweiAqIHowIC0gdXB4ICogejI7XG4gICAgICAgIGxldCB4MiA9IHVweCAqIHoxIC0gdXB5ICogejA7XG4gICAgICAgIGxlbiA9IDEgLyBNYXRoLnNxcnQoeDAgKiB4MCArIHgxICogeDEgKyB4MiAqIHgyKTtcbiAgICAgICAgeDAgKj0gbGVuO1xuICAgICAgICB4MSAqPSBsZW47XG4gICAgICAgIHgyICo9IGxlbjtcblxuICAgICAgICBjb25zdCB5MCA9IHoxICogeDIgLSB6MiAqIHgxO1xuICAgICAgICBjb25zdCB5MSA9IHoyICogeDAgLSB6MCAqIHgyO1xuICAgICAgICBjb25zdCB5MiA9IHowICogeDEgLSB6MSAqIHgwO1xuXG4gICAgICAgIGxldCBtID0gb3V0Lm07XG4gICAgICAgIG1bMF0gPSB4MDtcbiAgICAgICAgbVsxXSA9IHkwO1xuICAgICAgICBtWzJdID0gejA7XG4gICAgICAgIG1bM10gPSAwO1xuICAgICAgICBtWzRdID0geDE7XG4gICAgICAgIG1bNV0gPSB5MTtcbiAgICAgICAgbVs2XSA9IHoxO1xuICAgICAgICBtWzddID0gMDtcbiAgICAgICAgbVs4XSA9IHgyO1xuICAgICAgICBtWzldID0geTI7XG4gICAgICAgIG1bMTBdID0gejI7XG4gICAgICAgIG1bMTFdID0gMDtcbiAgICAgICAgbVsxMl0gPSAtKHgwICogZXlleCArIHgxICogZXlleSArIHgyICogZXlleik7XG4gICAgICAgIG1bMTNdID0gLSh5MCAqIGV5ZXggKyB5MSAqIGV5ZXkgKyB5MiAqIGV5ZXopO1xuICAgICAgICBtWzE0XSA9IC0oejAgKiBleWV4ICsgejEgKiBleWV5ICsgejIgKiBleWV6KTtcbiAgICAgICAgbVsxNV0gPSAxO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDorqHnrpfpgIbovaznva7nn6npmLVcbiAgICAgKiAhI2VuIFJldmVyc2FsIG1hdHJpeCBjYWxjdWxhdGlvblxuICAgICAqIEBtZXRob2QgaW52ZXJzZVRyYW5zcG9zZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogaW52ZXJzZVRyYW5zcG9zZTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0KTogT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBpbnZlcnNlVHJhbnNwb3NlPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcblxuICAgICAgICBsZXQgbSA9IGEubTtcbiAgICAgICAgX2EwMCA9IG1bMF07IF9hMDEgPSBtWzFdOyBfYTAyID0gbVsyXTsgX2EwMyA9IG1bM107XG4gICAgICAgIF9hMTAgPSBtWzRdOyBfYTExID0gbVs1XTsgX2ExMiA9IG1bNl07IF9hMTMgPSBtWzddO1xuICAgICAgICBfYTIwID0gbVs4XTsgX2EyMSA9IG1bOV07IF9hMjIgPSBtWzEwXTsgX2EyMyA9IG1bMTFdO1xuICAgICAgICBfYTMwID0gbVsxMl07IF9hMzEgPSBtWzEzXTsgX2EzMiA9IG1bMTRdOyBfYTMzID0gbVsxNV07XG5cbiAgICAgICAgY29uc3QgYjAwID0gX2EwMCAqIF9hMTEgLSBfYTAxICogX2ExMDtcbiAgICAgICAgY29uc3QgYjAxID0gX2EwMCAqIF9hMTIgLSBfYTAyICogX2ExMDtcbiAgICAgICAgY29uc3QgYjAyID0gX2EwMCAqIF9hMTMgLSBfYTAzICogX2ExMDtcbiAgICAgICAgY29uc3QgYjAzID0gX2EwMSAqIF9hMTIgLSBfYTAyICogX2ExMTtcbiAgICAgICAgY29uc3QgYjA0ID0gX2EwMSAqIF9hMTMgLSBfYTAzICogX2ExMTtcbiAgICAgICAgY29uc3QgYjA1ID0gX2EwMiAqIF9hMTMgLSBfYTAzICogX2ExMjtcbiAgICAgICAgY29uc3QgYjA2ID0gX2EyMCAqIF9hMzEgLSBfYTIxICogX2EzMDtcbiAgICAgICAgY29uc3QgYjA3ID0gX2EyMCAqIF9hMzIgLSBfYTIyICogX2EzMDtcbiAgICAgICAgY29uc3QgYjA4ID0gX2EyMCAqIF9hMzMgLSBfYTIzICogX2EzMDtcbiAgICAgICAgY29uc3QgYjA5ID0gX2EyMSAqIF9hMzIgLSBfYTIyICogX2EzMTtcbiAgICAgICAgY29uc3QgYjEwID0gX2EyMSAqIF9hMzMgLSBfYTIzICogX2EzMTtcbiAgICAgICAgY29uc3QgYjExID0gX2EyMiAqIF9hMzMgLSBfYTIzICogX2EzMjtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGRldGVybWluYW50XG4gICAgICAgIGxldCBkZXQgPSBiMDAgKiBiMTEgLSBiMDEgKiBiMTAgKyBiMDIgKiBiMDkgKyBiMDMgKiBiMDggLSBiMDQgKiBiMDcgKyBiMDUgKiBiMDY7XG5cbiAgICAgICAgaWYgKCFkZXQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGRldCA9IDEuMCAvIGRldDtcblxuICAgICAgICBtID0gb3V0Lm07XG4gICAgICAgIG1bMF0gPSAoX2ExMSAqIGIxMSAtIF9hMTIgKiBiMTAgKyBfYTEzICogYjA5KSAqIGRldDtcbiAgICAgICAgbVsxXSA9IChfYTEyICogYjA4IC0gX2ExMCAqIGIxMSAtIF9hMTMgKiBiMDcpICogZGV0O1xuICAgICAgICBtWzJdID0gKF9hMTAgKiBiMTAgLSBfYTExICogYjA4ICsgX2ExMyAqIGIwNikgKiBkZXQ7XG4gICAgICAgIG1bM10gPSAwO1xuXG4gICAgICAgIG1bNF0gPSAoX2EwMiAqIGIxMCAtIF9hMDEgKiBiMTEgLSBfYTAzICogYjA5KSAqIGRldDtcbiAgICAgICAgbVs1XSA9IChfYTAwICogYjExIC0gX2EwMiAqIGIwOCArIF9hMDMgKiBiMDcpICogZGV0O1xuICAgICAgICBtWzZdID0gKF9hMDEgKiBiMDggLSBfYTAwICogYjEwIC0gX2EwMyAqIGIwNikgKiBkZXQ7XG4gICAgICAgIG1bN10gPSAwO1xuXG4gICAgICAgIG1bOF0gPSAoX2EzMSAqIGIwNSAtIF9hMzIgKiBiMDQgKyBfYTMzICogYjAzKSAqIGRldDtcbiAgICAgICAgbVs5XSA9IChfYTMyICogYjAyIC0gX2EzMCAqIGIwNSAtIF9hMzMgKiBiMDEpICogZGV0O1xuICAgICAgICBtWzEwXSA9IChfYTMwICogYjA0IC0gX2EzMSAqIGIwMiArIF9hMzMgKiBiMDApICogZGV0O1xuICAgICAgICBtWzExXSA9IDA7XG5cbiAgICAgICAgbVsxMl0gPSAwO1xuICAgICAgICBtWzEzXSA9IDA7XG4gICAgICAgIG1bMTRdID0gMDtcbiAgICAgICAgbVsxNV0gPSAxO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDnn6npmLXliqDms5VcbiAgICAgKiAhI2VuIEVsZW1lbnQgYnkgZWxlbWVudCBtYXRyaXggYWRkaXRpb25cbiAgICAgKiBAbWV0aG9kIGFkZFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogYWRkPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCk6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgYWRkPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBsZXQgbSA9IG91dC5tLCBhbSA9IGEubSwgYm0gPSBiLm07XG4gICAgICAgIG1bMF0gPSBhbVswXSArIGJtWzBdO1xuICAgICAgICBtWzFdID0gYW1bMV0gKyBibVsxXTtcbiAgICAgICAgbVsyXSA9IGFtWzJdICsgYm1bMl07XG4gICAgICAgIG1bM10gPSBhbVszXSArIGJtWzNdO1xuICAgICAgICBtWzRdID0gYW1bNF0gKyBibVs0XTtcbiAgICAgICAgbVs1XSA9IGFtWzVdICsgYm1bNV07XG4gICAgICAgIG1bNl0gPSBhbVs2XSArIGJtWzZdO1xuICAgICAgICBtWzddID0gYW1bN10gKyBibVs3XTtcbiAgICAgICAgbVs4XSA9IGFtWzhdICsgYm1bOF07XG4gICAgICAgIG1bOV0gPSBhbVs5XSArIGJtWzldO1xuICAgICAgICBtWzEwXSA9IGFtWzEwXSArIGJtWzEwXTtcbiAgICAgICAgbVsxMV0gPSBhbVsxMV0gKyBibVsxMV07XG4gICAgICAgIG1bMTJdID0gYW1bMTJdICsgYm1bMTJdO1xuICAgICAgICBtWzEzXSA9IGFtWzEzXSArIGJtWzEzXTtcbiAgICAgICAgbVsxNF0gPSBhbVsxNF0gKyBibVsxNF07XG4gICAgICAgIG1bMTVdID0gYW1bMTVdICsgYm1bMTVdO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg55+p6Zi15YeP5rOVXG4gICAgICogISNlbiBNYXRyaXggZWxlbWVudCBieSBlbGVtZW50IHN1YnRyYWN0aW9uXG4gICAgICogQG1ldGhvZCBzdWJ0cmFjdFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3VidHJhY3Q8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KTogT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBzdWJ0cmFjdDxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgbGV0IG0gPSBvdXQubSwgYW0gPSBhLm0sIGJtID0gYi5tO1xuICAgICAgICBtWzBdID0gYW1bMF0gLSBibVswXTtcbiAgICAgICAgbVsxXSA9IGFtWzFdIC0gYm1bMV07XG4gICAgICAgIG1bMl0gPSBhbVsyXSAtIGJtWzJdO1xuICAgICAgICBtWzNdID0gYW1bM10gLSBibVszXTtcbiAgICAgICAgbVs0XSA9IGFtWzRdIC0gYm1bNF07XG4gICAgICAgIG1bNV0gPSBhbVs1XSAtIGJtWzVdO1xuICAgICAgICBtWzZdID0gYW1bNl0gLSBibVs2XTtcbiAgICAgICAgbVs3XSA9IGFtWzddIC0gYm1bN107XG4gICAgICAgIG1bOF0gPSBhbVs4XSAtIGJtWzhdO1xuICAgICAgICBtWzldID0gYW1bOV0gLSBibVs5XTtcbiAgICAgICAgbVsxMF0gPSBhbVsxMF0gLSBibVsxMF07XG4gICAgICAgIG1bMTFdID0gYW1bMTFdIC0gYm1bMTFdO1xuICAgICAgICBtWzEyXSA9IGFtWzEyXSAtIGJtWzEyXTtcbiAgICAgICAgbVsxM10gPSBhbVsxM10gLSBibVsxM107XG4gICAgICAgIG1bMTRdID0gYW1bMTRdIC0gYm1bMTRdO1xuICAgICAgICBtWzE1XSA9IGFtWzE1XSAtIGJtWzE1XTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOefqemYteagh+mHj+S5mOazlVxuICAgICAqICEjZW4gTWF0cml4IHNjYWxhciBtdWx0aXBsaWNhdGlvblxuICAgICAqIEBtZXRob2QgbXVsdGlwbHlTY2FsYXJcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG11bHRpcGx5U2NhbGFyPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IG51bWJlcik6IE91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgbXVsdGlwbHlTY2FsYXI8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogbnVtYmVyKSB7XG4gICAgICAgIGxldCBtID0gb3V0Lm0sIGFtID0gYS5tO1xuICAgICAgICBtWzBdID0gYW1bMF0gKiBiO1xuICAgICAgICBtWzFdID0gYW1bMV0gKiBiO1xuICAgICAgICBtWzJdID0gYW1bMl0gKiBiO1xuICAgICAgICBtWzNdID0gYW1bM10gKiBiO1xuICAgICAgICBtWzRdID0gYW1bNF0gKiBiO1xuICAgICAgICBtWzVdID0gYW1bNV0gKiBiO1xuICAgICAgICBtWzZdID0gYW1bNl0gKiBiO1xuICAgICAgICBtWzddID0gYW1bN10gKiBiO1xuICAgICAgICBtWzhdID0gYW1bOF0gKiBiO1xuICAgICAgICBtWzldID0gYW1bOV0gKiBiO1xuICAgICAgICBtWzEwXSA9IGFtWzEwXSAqIGI7XG4gICAgICAgIG1bMTFdID0gYW1bMTFdICogYjtcbiAgICAgICAgbVsxMl0gPSBhbVsxMl0gKiBiO1xuICAgICAgICBtWzEzXSA9IGFtWzEzXSAqIGI7XG4gICAgICAgIG1bMTRdID0gYW1bMTRdICogYjtcbiAgICAgICAgbVsxNV0gPSBhbVsxNV0gKiBiO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg55+p6Zi15qCH6YeP5LmY5YqgOiBBICsgQiAqIHNjYWxlXG4gICAgICogISNlbiBFbGVtZW50cyBvZiB0aGUgbWF0cml4IGJ5IHRoZSBzY2FsYXIgbXVsdGlwbGljYXRpb24gYW5kIGFkZGl0aW9uOiBBICsgQiAqIHNjYWxlXG4gICAgICogQG1ldGhvZCBtdWx0aXBseVNjYWxhckFuZEFkZFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbXVsdGlwbHlTY2FsYXJBbmRBZGQ8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0LCBzY2FsZTogbnVtYmVyKTogT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBtdWx0aXBseVNjYWxhckFuZEFkZDxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQsIHNjYWxlOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IG0gPSBvdXQubSwgYW0gPSBhLm0sIGJtID0gYi5tO1xuICAgICAgICBtWzBdID0gYW1bMF0gKyAoYm1bMF0gKiBzY2FsZSk7XG4gICAgICAgIG1bMV0gPSBhbVsxXSArIChibVsxXSAqIHNjYWxlKTtcbiAgICAgICAgbVsyXSA9IGFtWzJdICsgKGJtWzJdICogc2NhbGUpO1xuICAgICAgICBtWzNdID0gYW1bM10gKyAoYm1bM10gKiBzY2FsZSk7XG4gICAgICAgIG1bNF0gPSBhbVs0XSArIChibVs0XSAqIHNjYWxlKTtcbiAgICAgICAgbVs1XSA9IGFtWzVdICsgKGJtWzVdICogc2NhbGUpO1xuICAgICAgICBtWzZdID0gYW1bNl0gKyAoYm1bNl0gKiBzY2FsZSk7XG4gICAgICAgIG1bN10gPSBhbVs3XSArIChibVs3XSAqIHNjYWxlKTtcbiAgICAgICAgbVs4XSA9IGFtWzhdICsgKGJtWzhdICogc2NhbGUpO1xuICAgICAgICBtWzldID0gYW1bOV0gKyAoYm1bOV0gKiBzY2FsZSk7XG4gICAgICAgIG1bMTBdID0gYW1bMTBdICsgKGJtWzEwXSAqIHNjYWxlKTtcbiAgICAgICAgbVsxMV0gPSBhbVsxMV0gKyAoYm1bMTFdICogc2NhbGUpO1xuICAgICAgICBtWzEyXSA9IGFtWzEyXSArIChibVsxMl0gKiBzY2FsZSk7XG4gICAgICAgIG1bMTNdID0gYW1bMTNdICsgKGJtWzEzXSAqIHNjYWxlKTtcbiAgICAgICAgbVsxNF0gPSBhbVsxNF0gKyAoYm1bMTRdICogc2NhbGUpO1xuICAgICAgICBtWzE1XSA9IGFtWzE1XSArIChibVsxNV0gKiBzY2FsZSk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDnn6npmLXnrYnku7fliKTmlq1cbiAgICAgKiAhI2VuIEFuYWx5emluZyB0aGUgZXF1aXZhbGVudCBtYXRyaXhcbiAgICAgKiBAbWV0aG9kIHN0cmljdEVxdWFsc1xuICAgICAqIEByZXR1cm4ge2Jvb2x9XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdHJpY3RFcXVhbHM8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAoYTogT3V0LCBiOiBPdXQpOiBib29sZWFuXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBzdHJpY3RFcXVhbHM8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAoYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgbGV0IGFtID0gYS5tLCBibSA9IGIubTtcbiAgICAgICAgcmV0dXJuIGFtWzBdID09PSBibVswXSAmJiBhbVsxXSA9PT0gYm1bMV0gJiYgYW1bMl0gPT09IGJtWzJdICYmIGFtWzNdID09PSBibVszXSAmJlxuICAgICAgICAgICAgYW1bNF0gPT09IGJtWzRdICYmIGFtWzVdID09PSBibVs1XSAmJiBhbVs2XSA9PT0gYm1bNl0gJiYgYW1bN10gPT09IGJtWzddICYmXG4gICAgICAgICAgICBhbVs4XSA9PT0gYm1bOF0gJiYgYW1bOV0gPT09IGJtWzldICYmIGFtWzEwXSA9PT0gYm1bMTBdICYmIGFtWzExXSA9PT0gYm1bMTFdICYmXG4gICAgICAgICAgICBhbVsxMl0gPT09IGJtWzEyXSAmJiBhbVsxM10gPT09IGJtWzEzXSAmJiBhbVsxNF0gPT09IGJtWzE0XSAmJiBhbVsxNV0gPT09IGJtWzE1XTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOaOkumZpOa1rueCueaVsOivr+W3rueahOefqemYtei/keS8vOetieS7t+WIpOaWrVxuICAgICAqICEjZW4gTmVnYXRpdmUgZmxvYXRpbmcgcG9pbnQgZXJyb3IgaXMgYXBwcm94aW1hdGVseSBlcXVpdmFsZW50IHRvIGRldGVybWluaW5nIGEgbWF0cml4XG4gICAgICogQG1ldGhvZCBlcXVhbHNcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGVxdWFsczxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChhOiBPdXQsIGI6IE91dCwgZXBzaWxvbj86IG51bWJlcik6IGJvb2xlYW5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGVxdWFsczxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChhOiBPdXQsIGI6IE91dCwgZXBzaWxvbiA9IEVQU0lMT04pIHtcblxuICAgICAgICBsZXQgYW0gPSBhLm0sIGJtID0gYi5tO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgTWF0aC5hYnMoYW1bMF0gLSBibVswXSkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYW1bMF0pLCBNYXRoLmFicyhibVswXSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhbVsxXSAtIGJtWzFdKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhbVsxXSksIE1hdGguYWJzKGJtWzFdKSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFtWzJdIC0gYm1bMl0pIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGFtWzJdKSwgTWF0aC5hYnMoYm1bMl0pKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYW1bM10gLSBibVszXSkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYW1bM10pLCBNYXRoLmFicyhibVszXSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhbVs0XSAtIGJtWzRdKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhbVs0XSksIE1hdGguYWJzKGJtWzRdKSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFtWzVdIC0gYm1bNV0pIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGFtWzVdKSwgTWF0aC5hYnMoYm1bNV0pKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYW1bNl0gLSBibVs2XSkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYW1bNl0pLCBNYXRoLmFicyhibVs2XSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhbVs3XSAtIGJtWzddKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhbVs3XSksIE1hdGguYWJzKGJtWzddKSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFtWzhdIC0gYm1bOF0pIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGFtWzhdKSwgTWF0aC5hYnMoYm1bOF0pKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYW1bOV0gLSBibVs5XSkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYW1bOV0pLCBNYXRoLmFicyhibVs5XSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhbVsxMF0gLSBibVsxMF0pIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGFtWzEwXSksIE1hdGguYWJzKGJtWzEwXSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhbVsxMV0gLSBibVsxMV0pIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGFtWzExXSksIE1hdGguYWJzKGJtWzExXSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhbVsxMl0gLSBibVsxMl0pIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGFtWzEyXSksIE1hdGguYWJzKGJtWzEyXSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhbVsxM10gLSBibVsxM10pIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGFtWzEzXSksIE1hdGguYWJzKGJtWzEzXSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhbVsxNF0gLSBibVsxNF0pIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGFtWzE0XSksIE1hdGguYWJzKGJtWzE0XSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhbVsxNV0gLSBibVsxNV0pIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGFtWzE1XSksIE1hdGguYWJzKGJtWzE1XSkpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgYWRqdWdhdGUgb2YgYSBtYXRyaXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge01hdDR9IG91dCAtIE1hdHJpeCB0byBzdG9yZSByZXN1bHQuXG4gICAgICogQHBhcmFtIHtNYXQ0fSBhIC0gTWF0cml4IHRvIGNhbGN1bGF0ZS5cbiAgICAgKiBAcmV0dXJucyB7TWF0NH0gb3V0LlxuICAgICAqL1xuICAgIHN0YXRpYyBhZGpvaW50IChvdXQsIGEpIHtcbiAgICAgICAgbGV0IGFtID0gYS5tLCBvdXRtID0gb3V0Lm07XG4gICAgICAgIGxldCBhMDAgPSBhbVswXSwgYTAxID0gYW1bMV0sIGEwMiA9IGFtWzJdLCBhMDMgPSBhbVszXSxcbiAgICAgICAgICAgIGExMCA9IGFtWzRdLCBhMTEgPSBhbVs1XSwgYTEyID0gYW1bNl0sIGExMyA9IGFtWzddLFxuICAgICAgICAgICAgYTIwID0gYW1bOF0sIGEyMSA9IGFtWzldLCBhMjIgPSBhbVsxMF0sIGEyMyA9IGFtWzExXSxcbiAgICAgICAgICAgIGEzMCA9IGFtWzEyXSwgYTMxID0gYW1bMTNdLCBhMzIgPSBhbVsxNF0sIGEzMyA9IGFtWzE1XTtcblxuICAgICAgICBvdXRtWzBdID0gKGExMSAqIChhMjIgKiBhMzMgLSBhMjMgKiBhMzIpIC0gYTIxICogKGExMiAqIGEzMyAtIGExMyAqIGEzMikgKyBhMzEgKiAoYTEyICogYTIzIC0gYTEzICogYTIyKSk7XG4gICAgICAgIG91dG1bMV0gPSAtKGEwMSAqIChhMjIgKiBhMzMgLSBhMjMgKiBhMzIpIC0gYTIxICogKGEwMiAqIGEzMyAtIGEwMyAqIGEzMikgKyBhMzEgKiAoYTAyICogYTIzIC0gYTAzICogYTIyKSk7XG4gICAgICAgIG91dG1bMl0gPSAoYTAxICogKGExMiAqIGEzMyAtIGExMyAqIGEzMikgLSBhMTEgKiAoYTAyICogYTMzIC0gYTAzICogYTMyKSArIGEzMSAqIChhMDIgKiBhMTMgLSBhMDMgKiBhMTIpKTtcbiAgICAgICAgb3V0bVszXSA9IC0oYTAxICogKGExMiAqIGEyMyAtIGExMyAqIGEyMikgLSBhMTEgKiAoYTAyICogYTIzIC0gYTAzICogYTIyKSArIGEyMSAqIChhMDIgKiBhMTMgLSBhMDMgKiBhMTIpKTtcbiAgICAgICAgb3V0bVs0XSA9IC0oYTEwICogKGEyMiAqIGEzMyAtIGEyMyAqIGEzMikgLSBhMjAgKiAoYTEyICogYTMzIC0gYTEzICogYTMyKSArIGEzMCAqIChhMTIgKiBhMjMgLSBhMTMgKiBhMjIpKTtcbiAgICAgICAgb3V0bVs1XSA9IChhMDAgKiAoYTIyICogYTMzIC0gYTIzICogYTMyKSAtIGEyMCAqIChhMDIgKiBhMzMgLSBhMDMgKiBhMzIpICsgYTMwICogKGEwMiAqIGEyMyAtIGEwMyAqIGEyMikpO1xuICAgICAgICBvdXRtWzZdID0gLShhMDAgKiAoYTEyICogYTMzIC0gYTEzICogYTMyKSAtIGExMCAqIChhMDIgKiBhMzMgLSBhMDMgKiBhMzIpICsgYTMwICogKGEwMiAqIGExMyAtIGEwMyAqIGExMikpO1xuICAgICAgICBvdXRtWzddID0gKGEwMCAqIChhMTIgKiBhMjMgLSBhMTMgKiBhMjIpIC0gYTEwICogKGEwMiAqIGEyMyAtIGEwMyAqIGEyMikgKyBhMjAgKiAoYTAyICogYTEzIC0gYTAzICogYTEyKSk7XG4gICAgICAgIG91dG1bOF0gPSAoYTEwICogKGEyMSAqIGEzMyAtIGEyMyAqIGEzMSkgLSBhMjAgKiAoYTExICogYTMzIC0gYTEzICogYTMxKSArIGEzMCAqIChhMTEgKiBhMjMgLSBhMTMgKiBhMjEpKTtcbiAgICAgICAgb3V0bVs5XSA9IC0oYTAwICogKGEyMSAqIGEzMyAtIGEyMyAqIGEzMSkgLSBhMjAgKiAoYTAxICogYTMzIC0gYTAzICogYTMxKSArIGEzMCAqIChhMDEgKiBhMjMgLSBhMDMgKiBhMjEpKTtcbiAgICAgICAgb3V0bVsxMF0gPSAoYTAwICogKGExMSAqIGEzMyAtIGExMyAqIGEzMSkgLSBhMTAgKiAoYTAxICogYTMzIC0gYTAzICogYTMxKSArIGEzMCAqIChhMDEgKiBhMTMgLSBhMDMgKiBhMTEpKTtcbiAgICAgICAgb3V0bVsxMV0gPSAtKGEwMCAqIChhMTEgKiBhMjMgLSBhMTMgKiBhMjEpIC0gYTEwICogKGEwMSAqIGEyMyAtIGEwMyAqIGEyMSkgKyBhMjAgKiAoYTAxICogYTEzIC0gYTAzICogYTExKSk7XG4gICAgICAgIG91dG1bMTJdID0gLShhMTAgKiAoYTIxICogYTMyIC0gYTIyICogYTMxKSAtIGEyMCAqIChhMTEgKiBhMzIgLSBhMTIgKiBhMzEpICsgYTMwICogKGExMSAqIGEyMiAtIGExMiAqIGEyMSkpO1xuICAgICAgICBvdXRtWzEzXSA9IChhMDAgKiAoYTIxICogYTMyIC0gYTIyICogYTMxKSAtIGEyMCAqIChhMDEgKiBhMzIgLSBhMDIgKiBhMzEpICsgYTMwICogKGEwMSAqIGEyMiAtIGEwMiAqIGEyMSkpO1xuICAgICAgICBvdXRtWzE0XSA9IC0oYTAwICogKGExMSAqIGEzMiAtIGExMiAqIGEzMSkgLSBhMTAgKiAoYTAxICogYTMyIC0gYTAyICogYTMxKSArIGEzMCAqIChhMDEgKiBhMTIgLSBhMDIgKiBhMTEpKTtcbiAgICAgICAgb3V0bVsxNV0gPSAoYTAwICogKGExMSAqIGEyMiAtIGExMiAqIGEyMSkgLSBhMTAgKiAoYTAxICogYTIyIC0gYTAyICogYTIxKSArIGEyMCAqIChhMDEgKiBhMTIgLSBhMDIgKiBhMTEpKTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOefqemYtei9rOaVsOe7hFxuICAgICAqICEjZW4gTWF0cml4IHRyYW5zcG9zZSBhcnJheVxuICAgICAqIEBtZXRob2QgdG9BcnJheVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogdG9BcnJheSA8T3V0IGV4dGVuZHMgSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4+IChvdXQ6IE91dCwgbWF0OiBJTWF0NExpa2UsIG9mcz86IG51bWJlcik6IE91dFxuICAgICAqIEBwYXJhbSBvZnMg5pWw57uE5YaF55qE6LW35aeL5YGP56e76YePXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyB0b0FycmF5PE91dCBleHRlbmRzIElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+PiAob3V0OiBPdXQsIG1hdDogSU1hdDRMaWtlLCBvZnMgPSAwKSB7XG4gICAgICAgIGxldCBtID0gbWF0Lm07XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7IGkrKykge1xuICAgICAgICAgICAgb3V0W29mcyArIGldID0gbVtpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5pWw57uE6L2s55+p6Zi1XG4gICAgICogISNlbiBUcmFuc2ZlciBtYXRyaXggYXJyYXlcbiAgICAgKiBAbWV0aG9kIGZyb21BcnJheVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZnJvbUFycmF5IDxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYXJyOiBJV3JpdGFibGVBcnJheUxpa2U8bnVtYmVyPiwgb2ZzPzogbnVtYmVyKTogT3V0XG4gICAgICogQHBhcmFtIG9mcyDmlbDnu4Totbflp4vlgY/np7vph49cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGZyb21BcnJheTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYXJyOiBJV3JpdGFibGVBcnJheUxpa2U8bnVtYmVyPiwgb2ZzID0gMCkge1xuICAgICAgICBsZXQgbSA9IG91dC5tO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyBpKyspIHtcbiAgICAgICAgICAgIG1baV0gPSBhcnJbb2ZzICsgaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIE1hdHJpeCBEYXRhXG4gICAgICogISN6aCDnn6npmLXmlbDmja5cbiAgICAgKiBAcHJvcGVydHkge0Zsb2F0NjRBcnJheSB8IEZsb2F0MzJBcnJheX0gbVxuICAgICAqL1xuICAgIG06IEZsb2F0QXJyYXk7XG5cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDb25zdHJ1Y3RvclxuICAgICAqIHNlZSB7eyNjcm9zc0xpbmsgXCJjYy9tYXQ0Om1ldGhvZFwifX1jYy5tYXQ0e3svY3Jvc3NMaW5rfX1cbiAgICAgKiAhI3poXG4gICAgICog5p6E6YCg5Ye95pWw77yM5Y+v5p+l55yLIHt7I2Nyb3NzTGluayBcImNjL21hdDQ6bWV0aG9kXCJ9fWNjLm1hdDR7ey9jcm9zc0xpbmt9fVxuICAgICAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0cnVjdG9yICggbTAwPzogbnVtYmVyLCBtMDE/OiBudW1iZXIsIG0wMj86IG51bWJlciwgbTAzPzogbnVtYmVyLCBtMTA/OiBudW1iZXIsIG0xMT86IG51bWJlciwgbTEyPzogbnVtYmVyLCBtMTM/OiBudW1iZXIsIG0yMD86IG51bWJlciwgbTIxPzogbnVtYmVyLCBtMjI/OiBudW1iZXIsIG0yMz86IG51bWJlciwgbTMwPzogbnVtYmVyLCBtMzE/OiBudW1iZXIsIG0zMj86IG51bWJlciwgbTMzPzogbnVtYmVyKVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yIChcbiAgICAgICAgbTAwOiBudW1iZXIgfCBGbG9hdEFycmF5ID0gMSwgbTAxOiBudW1iZXIgPSAwLCBtMDI6IG51bWJlciA9IDAsIG0wMzogbnVtYmVyID0gMCxcbiAgICAgICAgbTEwOiBudW1iZXIgPSAwLCBtMTE6IG51bWJlciA9IDEsIG0xMjogbnVtYmVyID0gMCwgbTEzOiBudW1iZXIgPSAwLFxuICAgICAgICBtMjA6IG51bWJlciA9IDAsIG0yMTogbnVtYmVyID0gMCwgbTIyOiBudW1iZXIgPSAxLCBtMjM6IG51bWJlciA9IDAsXG4gICAgICAgIG0zMDogbnVtYmVyID0gMCwgbTMxOiBudW1iZXIgPSAwLCBtMzI6IG51bWJlciA9IDAsIG0zMzogbnVtYmVyID0gMSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBpZiAobTAwIGluc3RhbmNlb2YgRkxPQVRfQVJSQVlfVFlQRSkge1xuICAgICAgICAgICAgdGhpcy5tID0gbTAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tID0gbmV3IEZMT0FUX0FSUkFZX1RZUEUoMTYpO1xuICAgICAgICAgICAgbGV0IHRtID0gdGhpcy5tO1xuICAgICAgICAgICAgdG1bMF0gPSBtMDAgYXMgbnVtYmVyO1xuICAgICAgICAgICAgdG1bMV0gPSBtMDE7XG4gICAgICAgICAgICB0bVsyXSA9IG0wMjtcbiAgICAgICAgICAgIHRtWzNdID0gbTAzO1xuICAgICAgICAgICAgdG1bNF0gPSBtMTA7XG4gICAgICAgICAgICB0bVs1XSA9IG0xMTtcbiAgICAgICAgICAgIHRtWzZdID0gbTEyO1xuICAgICAgICAgICAgdG1bN10gPSBtMTM7XG4gICAgICAgICAgICB0bVs4XSA9IG0yMDtcbiAgICAgICAgICAgIHRtWzldID0gbTIxO1xuICAgICAgICAgICAgdG1bMTBdID0gbTIyO1xuICAgICAgICAgICAgdG1bMTFdID0gbTIzO1xuICAgICAgICAgICAgdG1bMTJdID0gbTMwO1xuICAgICAgICAgICAgdG1bMTNdID0gbTMxO1xuICAgICAgICAgICAgdG1bMTRdID0gbTMyO1xuICAgICAgICAgICAgdG1bMTVdID0gbTMzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBjbG9uZSBhIE1hdDQgb2JqZWN0XG4gICAgICogISN6aCDlhYvpmobkuIDkuKogTWF0NCDlr7nosaFcbiAgICAgKiBAbWV0aG9kIGNsb25lXG4gICAgICogQHJldHVybiB7TWF0NH1cbiAgICAgKi9cbiAgICBjbG9uZSAoKSB7XG4gICAgICAgIGxldCB0ID0gdGhpcztcbiAgICAgICAgbGV0IHRtID0gdC5tO1xuICAgICAgICByZXR1cm4gbmV3IE1hdDQoXG4gICAgICAgICAgICB0bVswXSwgdG1bMV0sIHRtWzJdLCB0bVszXSxcbiAgICAgICAgICAgIHRtWzRdLCB0bVs1XSwgdG1bNl0sIHRtWzddLFxuICAgICAgICAgICAgdG1bOF0sIHRtWzldLCB0bVsxMF0sIHRtWzExXSxcbiAgICAgICAgICAgIHRtWzEyXSwgdG1bMTNdLCB0bVsxNF0sIHRtWzE1XSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXRzIHRoZSBtYXRyaXggd2l0aCBhbm90aGVyIG9uZSdzIHZhbHVlXG4gICAgICogISN6aCDnlKjlj6bkuIDkuKrnn6npmLXorr7nva7ov5nkuKrnn6npmLXnmoTlgLzjgIJcbiAgICAgKiBAbWV0aG9kIHNldFxuICAgICAqIEBwYXJhbSB7TWF0NH0gc3JjT2JqXG4gICAgICogQHJldHVybiB7TWF0NH0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIHNldCAocykge1xuICAgICAgICBsZXQgdCA9IHRoaXM7XG4gICAgICAgIGxldCB0bSA9IHQubSwgc20gPSBzLm07XG4gICAgICAgIHRtWzBdID0gc21bMF07XG4gICAgICAgIHRtWzFdID0gc21bMV07XG4gICAgICAgIHRtWzJdID0gc21bMl07XG4gICAgICAgIHRtWzNdID0gc21bM107XG4gICAgICAgIHRtWzRdID0gc21bNF07XG4gICAgICAgIHRtWzVdID0gc21bNV07XG4gICAgICAgIHRtWzZdID0gc21bNl07XG4gICAgICAgIHRtWzddID0gc21bN107XG4gICAgICAgIHRtWzhdID0gc21bOF07XG4gICAgICAgIHRtWzldID0gc21bOV07XG4gICAgICAgIHRtWzEwXSA9IHNtWzEwXTtcbiAgICAgICAgdG1bMTFdID0gc21bMTFdO1xuICAgICAgICB0bVsxMl0gPSBzbVsxMl07XG4gICAgICAgIHRtWzEzXSA9IHNtWzEzXTtcbiAgICAgICAgdG1bMTRdID0gc21bMTRdO1xuICAgICAgICB0bVsxNV0gPSBzbVsxNV07XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2hlY2sgd2hldGhlciB0d28gbWF0cml4IGVxdWFsXG4gICAgICogISN6aCDlvZPliY3nmoTnn6npmLXmmK/lkKbkuI7mjIflrprnmoTnn6npmLXnm7jnrYnjgIJcbiAgICAgKiBAbWV0aG9kIGVxdWFsc1xuICAgICAqIEBwYXJhbSB7TWF0NH0gb3RoZXJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGVxdWFscyAob3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIE1hdDQuc3RyaWN0RXF1YWxzKHRoaXMsIG90aGVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENoZWNrIHdoZXRoZXIgdHdvIG1hdHJpeCBlcXVhbCB3aXRoIGRlZmF1bHQgZGVncmVlIG9mIHZhcmlhbmNlLlxuICAgICAqICEjemhcbiAgICAgKiDov5HkvLzliKTmlq3kuKTkuKrnn6npmLXmmK/lkKbnm7jnrYnjgII8YnIvPlxuICAgICAqIOWIpOaWrSAyIOS4quefqemYteaYr+WQpuWcqOm7mOiupOivr+W3ruiMg+WbtOS5i+WGhe+8jOWmguaenOWcqOWImei/lOWbniB0cnVl77yM5Y+N5LmL5YiZ6L+U5ZueIGZhbHNl44CCXG4gICAgICogQG1ldGhvZCBmdXp6eUVxdWFsc1xuICAgICAqIEBwYXJhbSB7TWF0NH0gb3RoZXJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGZ1enp5RXF1YWxzIChvdGhlcikge1xuICAgICAgICByZXR1cm4gTWF0NC5lcXVhbHModGhpcywgb3RoZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gVHJhbnNmb3JtIHRvIHN0cmluZyB3aXRoIG1hdHJpeCBpbmZvcm1hdGlvbnNcbiAgICAgKiAhI3poIOi9rOaNouS4uuaWueS+v+mYheivu+eahOWtl+espuS4suOAglxuICAgICAqIEBtZXRob2QgdG9TdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgdG9TdHJpbmcgKCkge1xuICAgICAgICBsZXQgdG0gPSB0aGlzLm07XG4gICAgICAgIGlmICh0bSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiW1xcblwiICtcbiAgICAgICAgICAgICAgICB0bVswXSArIFwiLCBcIiArIHRtWzFdICsgXCIsIFwiICsgdG1bMl0gKyBcIiwgXCIgKyB0bVszXSArIFwiLFxcblwiICtcbiAgICAgICAgICAgICAgICB0bVs0XSArIFwiLCBcIiArIHRtWzVdICsgXCIsIFwiICsgdG1bNl0gKyBcIiwgXCIgKyB0bVs3XSArIFwiLFxcblwiICtcbiAgICAgICAgICAgICAgICB0bVs4XSArIFwiLCBcIiArIHRtWzldICsgXCIsIFwiICsgdG1bMTBdICsgXCIsIFwiICsgdG1bMTFdICsgXCIsXFxuXCIgK1xuICAgICAgICAgICAgICAgIHRtWzEyXSArIFwiLCBcIiArIHRtWzEzXSArIFwiLCBcIiArIHRtWzE0XSArIFwiLCBcIiArIHRtWzE1XSArIFwiXFxuXCIgK1xuICAgICAgICAgICAgICAgIFwiXVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFwiW1xcblwiICtcbiAgICAgICAgICAgICAgICBcIjEsIDAsIDAsIDBcXG5cIiArXG4gICAgICAgICAgICAgICAgXCIwLCAxLCAwLCAwXFxuXCIgK1xuICAgICAgICAgICAgICAgIFwiMCwgMCwgMSwgMFxcblwiICtcbiAgICAgICAgICAgICAgICBcIjAsIDAsIDAsIDFcXG5cIiArXG4gICAgICAgICAgICAgICAgXCJdXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIG1hdHJpeCB0byB0aGUgaWRlbnRpdHkgbWF0cml4XG4gICAgICogQG1ldGhvZCBpZGVudGl0eVxuICAgICAqIEByZXR1cm5zIHtNYXQ0fSBzZWxmXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIGlkZW50aXR5ICgpOiB0aGlzIHtcbiAgICAgICAgcmV0dXJuIE1hdDQuaWRlbnRpdHkodGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJhbnNwb3NlIHRoZSB2YWx1ZXMgb2YgYSBtYXQ0XG4gICAgICogQG1ldGhvZCB0cmFuc3Bvc2VcbiAgICAgKiBAcGFyYW0ge01hdDR9IFtvdXRdIHRoZSByZWNlaXZpbmcgbWF0cml4LCB5b3UgY2FuIHBhc3MgdGhlIHNhbWUgbWF0cml4IHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyBtYXRyaXggd2lsbCBiZSBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIHtNYXQ0fSBvdXRcbiAgICAgKi9cbiAgICB0cmFuc3Bvc2UgKG91dCkge1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IE1hdDQoKTtcbiAgICAgICAgcmV0dXJuIE1hdDQudHJhbnNwb3NlKG91dCwgdGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52ZXJ0cyBhIG1hdDRcbiAgICAgKiBAbWV0aG9kIGludmVydFxuICAgICAqIEBwYXJhbSB7TWF0NH0gW291dF0gdGhlIHJlY2VpdmluZyBtYXRyaXgsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSBtYXRyaXggdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IG1hdHJpeCB3aWxsIGJlIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMge01hdDR9IG91dFxuICAgICAqL1xuICAgIGludmVydCAob3V0KSB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgTWF0NCgpO1xuICAgICAgICByZXR1cm4gTWF0NC5pbnZlcnQob3V0LCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBhZGp1Z2F0ZSBvZiBhIG1hdDRcbiAgICAgKiBAbWV0aG9kIGFkam9pbnRcbiAgICAgKiBAcGFyYW0ge01hdDR9IFtvdXRdIHRoZSByZWNlaXZpbmcgbWF0cml4LCB5b3UgY2FuIHBhc3MgdGhlIHNhbWUgbWF0cml4IHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyBtYXRyaXggd2lsbCBiZSBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIHtNYXQ0fSBvdXRcbiAgICAgKi9cbiAgICBhZGpvaW50IChvdXQpIHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBNYXQ0KCk7XG4gICAgICAgIHJldHVybiBNYXQ0LmFkam9pbnQob3V0LCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBkZXRlcm1pbmFudCBvZiBhIG1hdDRcbiAgICAgKiBAbWV0aG9kIGRldGVybWluYW50XG4gICAgICogQHJldHVybnMge051bWJlcn0gZGV0ZXJtaW5hbnQgb2YgYVxuICAgICAqL1xuICAgIGRldGVybWluYW50ICgpIHtcbiAgICAgICAgcmV0dXJuIE1hdDQuZGV0ZXJtaW5hbnQodGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyB0d28gTWF0NFxuICAgICAqIEBtZXRob2QgYWRkXG4gICAgICogQHBhcmFtIHtNYXQ0fSBvdGhlciB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICAgKiBAcGFyYW0ge01hdDR9IFtvdXRdIHRoZSByZWNlaXZpbmcgbWF0cml4LCB5b3UgY2FuIHBhc3MgdGhlIHNhbWUgbWF0cml4IHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyBtYXRyaXggd2lsbCBiZSBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIHtNYXQ0fSBvdXRcbiAgICAgKi9cbiAgICBhZGQgKG90aGVyLCBvdXQpIHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBNYXQ0KCk7XG4gICAgICAgIHJldHVybiBNYXQ0LmFkZChvdXQsIHRoaXMsIG90aGVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdWJ0cmFjdHMgdGhlIGN1cnJlbnQgbWF0cml4IHdpdGggYW5vdGhlciBvbmVcbiAgICAgKiBAbWV0aG9kIHN1YnRyYWN0XG4gICAgICogQHBhcmFtIHtNYXQ0fSBvdGhlciB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICAgKiBAcmV0dXJucyB7TWF0NH0gdGhpc1xuICAgICAqL1xuICAgIHN1YnRyYWN0IChvdGhlcik6IHRoaXMge1xuICAgICAgICByZXR1cm4gTWF0NC5zdWJ0cmFjdCh0aGlzLCB0aGlzLCBvdGhlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3VidHJhY3RzIHRoZSBjdXJyZW50IG1hdHJpeCB3aXRoIGFub3RoZXIgb25lXG4gICAgICogQG1ldGhvZCBtdWx0aXBseVxuICAgICAqIEBwYXJhbSB7TWF0NH0gb3RoZXIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAgICogQHJldHVybnMge01hdDR9IHRoaXNcbiAgICAgKi9cbiAgICBtdWx0aXBseSAob3RoZXIpOiB0aGlzIHtcbiAgICAgICAgcmV0dXJuIE1hdDQubXVsdGlwbHkodGhpcywgdGhpcywgb3RoZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE11bHRpcGx5IGVhY2ggZWxlbWVudCBvZiB0aGUgbWF0cml4IGJ5IGEgc2NhbGFyLlxuICAgICAqIEBtZXRob2QgbXVsdGlwbHlTY2FsYXJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbnVtYmVyIGFtb3VudCB0byBzY2FsZSB0aGUgbWF0cml4J3MgZWxlbWVudHMgYnlcbiAgICAgKiBAcmV0dXJucyB7TWF0NH0gdGhpc1xuICAgICAqL1xuICAgIG11bHRpcGx5U2NhbGFyIChudW1iZXIpOiB0aGlzIHtcbiAgICAgICAgcmV0dXJuIE1hdDQubXVsdGlwbHlTY2FsYXIodGhpcywgdGhpcywgbnVtYmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmFuc2xhdGUgYSBtYXQ0IGJ5IHRoZSBnaXZlbiB2ZWN0b3JcbiAgICAgKiBAbWV0aG9kIHRyYW5zbGF0ZVxuICAgICAqIEBwYXJhbSB7VmVjM30gdiB2ZWN0b3IgdG8gdHJhbnNsYXRlIGJ5XG4gICAgICogQHBhcmFtIHtNYXQ0fSBbb3V0XSB0aGUgcmVjZWl2aW5nIG1hdHJpeCwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIG1hdHJpeCB0byBzYXZlIHJlc3VsdCB0byBpdHNlbGYsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgbWF0cml4IHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm5zIHtNYXQ0fSBvdXRcbiAgICAgKi9cbiAgICB0cmFuc2xhdGUgKHYsIG91dCkge1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IE1hdDQoKTtcbiAgICAgICAgcmV0dXJuIE1hdDQudHJhbnNsYXRlKG91dCwgdGhpcywgdik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2NhbGVzIHRoZSBtYXQ0IGJ5IHRoZSBkaW1lbnNpb25zIGluIHRoZSBnaXZlbiB2ZWMzXG4gICAgICogQG1ldGhvZCBzY2FsZVxuICAgICAqIEBwYXJhbSB7VmVjM30gdiB2ZWN0b3IgdG8gc2NhbGUgYnlcbiAgICAgKiBAcGFyYW0ge01hdDR9IFtvdXRdIHRoZSByZWNlaXZpbmcgbWF0cml4LCB5b3UgY2FuIHBhc3MgdGhlIHNhbWUgbWF0cml4IHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyBtYXRyaXggd2lsbCBiZSBjcmVhdGVkXG4gICAgICogQHJldHVybnMge01hdDR9IG91dFxuICAgICAqL1xuICAgIHNjYWxlICh2LCBvdXQpIHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBNYXQ0KCk7XG4gICAgICAgIHJldHVybiBNYXQ0LnNjYWxlKG91dCwgdGhpcywgdik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUm90YXRlcyBhIG1hdDQgYnkgdGhlIGdpdmVuIGFuZ2xlIGFyb3VuZCB0aGUgZ2l2ZW4gYXhpc1xuICAgICAqIEBtZXRob2Qgcm90YXRlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IGF4aXMgdGhlIGF4aXMgdG8gcm90YXRlIGFyb3VuZFxuICAgICAqIEBwYXJhbSB7TWF0NH0gW291dF0gdGhlIHJlY2VpdmluZyBtYXRyaXgsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSBtYXRyaXggdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IG1hdHJpeCB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJucyB7TWF0NH0gb3V0XG4gICAgICovXG4gICAgcm90YXRlIChyYWQsIGF4aXMsIG91dCkge1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IE1hdDQoKTtcbiAgICAgICAgcmV0dXJuIE1hdDQucm90YXRlKG91dCwgdGhpcywgcmFkLCBheGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB0cmFuc2xhdGlvbiB2ZWN0b3IgY29tcG9uZW50IG9mIGEgdHJhbnNmb3JtYXRpb24gbWF0cml4LlxuICAgICAqIEBtZXRob2QgZ2V0VHJhbnNsYXRpb25cbiAgICAgKiBAcGFyYW0gIHtWZWMzfSBvdXQgVmVjdG9yIHRvIHJlY2VpdmUgdHJhbnNsYXRpb24gY29tcG9uZW50LCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IHZlYzMgd2lsbCBiZSBjcmVhdGVkXG4gICAgICogQHJldHVybiB7VmVjM30gb3V0XG4gICAgICovXG4gICAgZ2V0VHJhbnNsYXRpb24gKG91dCkge1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IFZlYzMoKTtcbiAgICAgICAgcmV0dXJuIE1hdDQuZ2V0VHJhbnNsYXRpb24ob3V0LCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBzY2FsZSBmYWN0b3IgY29tcG9uZW50IG9mIGEgdHJhbnNmb3JtYXRpb24gbWF0cml4XG4gICAgICogQG1ldGhvZCBnZXRTY2FsZVxuICAgICAqIEBwYXJhbSAge1ZlYzN9IG91dCBWZWN0b3IgdG8gcmVjZWl2ZSBzY2FsZSBjb21wb25lbnQsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgdmVjMyB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJuIHtWZWMzfSBvdXRcbiAgICAgKi9cbiAgICBnZXRTY2FsZSAob3V0KSB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgVmVjMygpO1xuICAgICAgICByZXR1cm4gTWF0NC5nZXRTY2FsaW5nKG91dCwgdGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgcm90YXRpb24gZmFjdG9yIGNvbXBvbmVudCBvZiBhIHRyYW5zZm9ybWF0aW9uIG1hdHJpeFxuICAgICAqIEBtZXRob2QgZ2V0Um90YXRpb25cbiAgICAgKiBAcGFyYW0gIHtRdWF0fSBvdXQgVmVjdG9yIHRvIHJlY2VpdmUgcm90YXRpb24gY29tcG9uZW50LCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IHF1YXRlcm5pb24gb2JqZWN0IHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm4ge1F1YXR9IG91dFxuICAgICAqL1xuICAgIGdldFJvdGF0aW9uIChvdXQpIHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBRdWF0KCk7XG4gICAgICAgIHJldHVybiBNYXQ0LmdldFJvdGF0aW9uKG91dCwgdGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzdG9yZSB0aGUgbWF0cml4IHZhbHVlcyBmcm9tIGEgcXVhdGVybmlvbiByb3RhdGlvbiwgdmVjdG9yIHRyYW5zbGF0aW9uIGFuZCB2ZWN0b3Igc2NhbGVcbiAgICAgKiBAbWV0aG9kIGZyb21SVFNcbiAgICAgKiBAcGFyYW0ge1F1YXR9IHEgUm90YXRpb24gcXVhdGVybmlvblxuICAgICAqIEBwYXJhbSB7VmVjM30gdiBUcmFuc2xhdGlvbiB2ZWN0b3JcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHMgU2NhbGluZyB2ZWN0b3JcbiAgICAgKiBAcmV0dXJucyB7TWF0NH0gdGhlIGN1cnJlbnQgbWF0NCBvYmplY3RcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICovXG4gICAgZnJvbVJUUyAocSwgdiwgcyk6IHRoaXMge1xuICAgICAgICByZXR1cm4gTWF0NC5mcm9tUlRTKHRoaXMsIHEsIHYsIHMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc3RvcmUgdGhlIG1hdHJpeCB2YWx1ZXMgZnJvbSBhIHF1YXRlcm5pb24gcm90YXRpb25cbiAgICAgKiBAbWV0aG9kIGZyb21RdWF0XG4gICAgICogQHBhcmFtIHtRdWF0fSBxIFJvdGF0aW9uIHF1YXRlcm5pb25cbiAgICAgKiBAcmV0dXJucyB7TWF0NH0gdGhlIGN1cnJlbnQgbWF0NCBvYmplY3RcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICovXG4gICAgZnJvbVF1YXQgKHF1YXQpOiB0aGlzIHtcbiAgICAgICAgcmV0dXJuIE1hdDQuZnJvbVF1YXQodGhpcywgcXVhdCk7XG4gICAgfVxufVxuXG5jb25zdCB2M18xOiBWZWMzID0gbmV3IFZlYzMoKTtcbmNvbnN0IG0zXzE6IE1hdDMgPSBuZXcgTWF0MygpO1xuXG5DQ0NsYXNzLmZhc3REZWZpbmUoJ2NjLk1hdDQnLCBNYXQ0LCB7XG4gICAgbTAwOiAxLCBtMDE6IDAsIG0wMjogMCwgbTAzOiAwLFxuICAgIG0wNDogMCwgbTA1OiAxLCBtMDY6IDAsIG0wNzogMCxcbiAgICBtMDg6IDAsIG0wOTogMCwgbTEwOiAxLCBtMTE6IDAsXG4gICAgbTEyOiAwLCBtMTM6IDAsIG0xNDogMCwgbTE1OiAxXG59KTtcblxuZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hdDQucHJvdG90eXBlLCAnbScgKyBpLCB7XG4gICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tW2ldO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLm1baV0gPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBAbW9kdWxlIGNjXG4gKi9cblxuLyoqXG4gKiAhI2VuIFRoZSBjb252ZW5pZW5jZSBtZXRob2QgdG8gY3JlYXRlIGEgbmV3IHt7I2Nyb3NzTGluayBcIk1hdDRcIn19Y2MuTWF0NHt7L2Nyb3NzTGlua319LlxuICogISN6aCDpgJrov4for6XnroDkvr/nmoTlh73mlbDov5vooYzliJvlu7oge3sjY3Jvc3NMaW5rIFwiTWF0NFwifX1jYy5NYXQ0e3svY3Jvc3NMaW5rfX0g5a+56LGh44CCXG4gKiBAbWV0aG9kIG1hdDRcbiAqIEBwYXJhbSB7TnVtYmVyfSBbbTAwXSBDb21wb25lbnQgaW4gY29sdW1uIDAsIHJvdyAwIHBvc2l0aW9uIChpbmRleCAwKVxuICogQHBhcmFtIHtOdW1iZXJ9IFttMDFdIENvbXBvbmVudCBpbiBjb2x1bW4gMCwgcm93IDEgcG9zaXRpb24gKGluZGV4IDEpXG4gKiBAcGFyYW0ge051bWJlcn0gW20wMl0gQ29tcG9uZW50IGluIGNvbHVtbiAwLCByb3cgMiBwb3NpdGlvbiAoaW5kZXggMilcbiAqIEBwYXJhbSB7TnVtYmVyfSBbbTAzXSBDb21wb25lbnQgaW4gY29sdW1uIDAsIHJvdyAzIHBvc2l0aW9uIChpbmRleCAzKVxuICogQHBhcmFtIHtOdW1iZXJ9IFttMTBdIENvbXBvbmVudCBpbiBjb2x1bW4gMSwgcm93IDAgcG9zaXRpb24gKGluZGV4IDQpXG4gKiBAcGFyYW0ge051bWJlcn0gW20xMV0gQ29tcG9uZW50IGluIGNvbHVtbiAxLCByb3cgMSBwb3NpdGlvbiAoaW5kZXggNSlcbiAqIEBwYXJhbSB7TnVtYmVyfSBbbTEyXSBDb21wb25lbnQgaW4gY29sdW1uIDEsIHJvdyAyIHBvc2l0aW9uIChpbmRleCA2KVxuICogQHBhcmFtIHtOdW1iZXJ9IFttMTNdIENvbXBvbmVudCBpbiBjb2x1bW4gMSwgcm93IDMgcG9zaXRpb24gKGluZGV4IDcpXG4gKiBAcGFyYW0ge051bWJlcn0gW20yMF0gQ29tcG9uZW50IGluIGNvbHVtbiAyLCByb3cgMCBwb3NpdGlvbiAoaW5kZXggOClcbiAqIEBwYXJhbSB7TnVtYmVyfSBbbTIxXSBDb21wb25lbnQgaW4gY29sdW1uIDIsIHJvdyAxIHBvc2l0aW9uIChpbmRleCA5KVxuICogQHBhcmFtIHtOdW1iZXJ9IFttMjJdIENvbXBvbmVudCBpbiBjb2x1bW4gMiwgcm93IDIgcG9zaXRpb24gKGluZGV4IDEwKVxuICogQHBhcmFtIHtOdW1iZXJ9IFttMjNdIENvbXBvbmVudCBpbiBjb2x1bW4gMiwgcm93IDMgcG9zaXRpb24gKGluZGV4IDExKVxuICogQHBhcmFtIHtOdW1iZXJ9IFttMzBdIENvbXBvbmVudCBpbiBjb2x1bW4gMywgcm93IDAgcG9zaXRpb24gKGluZGV4IDEyKVxuICogQHBhcmFtIHtOdW1iZXJ9IFttMzFdIENvbXBvbmVudCBpbiBjb2x1bW4gMywgcm93IDEgcG9zaXRpb24gKGluZGV4IDEzKVxuICogQHBhcmFtIHtOdW1iZXJ9IFttMzJdIENvbXBvbmVudCBpbiBjb2x1bW4gMywgcm93IDIgcG9zaXRpb24gKGluZGV4IDE0KVxuICogQHBhcmFtIHtOdW1iZXJ9IFttMzNdIENvbXBvbmVudCBpbiBjb2x1bW4gMywgcm93IDMgcG9zaXRpb24gKGluZGV4IDE1KVxuICogQHJldHVybiB7TWF0NH1cbiAqL1xuY2MubWF0NCA9IGZ1bmN0aW9uIChtMDAsIG0wMSwgbTAyLCBtMDMsIG0xMCwgbTExLCBtMTIsIG0xMywgbTIwLCBtMjEsIG0yMiwgbTIzLCBtMzAsIG0zMSwgbTMyLCBtMzMpIHtcbiAgICBsZXQgbWF0ID0gbmV3IE1hdDQobTAwLCBtMDEsIG0wMiwgbTAzLCBtMTAsIG0xMSwgbTEyLCBtMTMsIG0yMCwgbTIxLCBtMjIsIG0yMywgbTMwLCBtMzEsIG0zMiwgbTMzKTtcbiAgICBpZiAobTAwID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgTWF0NC5pZGVudGl0eShtYXQpO1xuICAgIH1cbiAgICByZXR1cm4gbWF0O1xufTtcblxuY2MuTWF0NCA9IE1hdDQ7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==