
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/utils/affine-transform.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

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
 * AffineTransform class represent an affine transform matrix. It's composed basically by translation, rotation, scale transformations.<br/>
 * !#zh
 * AffineTransform 类代表一个仿射变换矩阵。它基本上是由平移旋转，缩放转变所组成。<br/>
 * @class AffineTransform
 * @constructor
 * @param {Number} a
 * @param {Number} b
 * @param {Number} c
 * @param {Number} d
 * @param {Number} tx
 * @param {Number} ty
 * @see AffineTransform.create
 */
var AffineTransform = function AffineTransform(a, b, c, d, tx, ty) {
  this.a = a;
  this.b = b;
  this.c = c;
  this.d = d;
  this.tx = tx;
  this.ty = ty;
};
/**
 * !#en Create a AffineTransform object with all contents in the matrix.
 * !#zh 用在矩阵中的所有内容创建一个 AffineTransform 对象。
 * @method create
 * @static
 * @param {Number} a
 * @param {Number} b
 * @param {Number} c
 * @param {Number} d
 * @param {Number} tx
 * @param {Number} ty
 * @return {AffineTransform}
 */


AffineTransform.create = function (a, b, c, d, tx, ty) {
  return {
    a: a,
    b: b,
    c: c,
    d: d,
    tx: tx,
    ty: ty
  };
};
/**
 * !#en
 * Create a identity transformation matrix: <br/>
 * [ 1, 0, 0, <br/>
 *   0, 1, 0 ]
 * !#zh
 * 单位矩阵：<br/>
 * [ 1, 0, 0, <br/>
 *   0, 1, 0 ]
 *
 * @method identity
 * @static
 * @return {AffineTransform}
 */


AffineTransform.identity = function () {
  return {
    a: 1.0,
    b: 0.0,
    c: 0.0,
    d: 1.0,
    tx: 0.0,
    ty: 0.0
  };
};
/**
 * !#en Clone a AffineTransform object from the specified transform.
 * !#zh 克隆指定的 AffineTransform 对象。
 * @method clone
 * @static
 * @param {AffineTransform} t
 * @return {AffineTransform}
 */


AffineTransform.clone = function (t) {
  return {
    a: t.a,
    b: t.b,
    c: t.c,
    d: t.d,
    tx: t.tx,
    ty: t.ty
  };
};
/**
 * !#en
 * Concatenate a transform matrix to another
 * The results are reflected in the out affine transform
 * out = t1 * t2
 * This function is memory free, you should create the output affine transform by yourself and manage its memory.
 * !#zh
 * 拼接两个矩阵，将结果保存到 out 矩阵。这个函数不创建任何内存，你需要先创建 AffineTransform 对象用来存储结果，并作为第一个参数传入函数。
 * out = t1 * t2
 * @method concat
 * @static
 * @param {AffineTransform} out Out object to store the concat result
 * @param {AffineTransform} t1 The first transform object.
 * @param {AffineTransform} t2 The transform object to concatenate.
 * @return {AffineTransform} Out object with the result of concatenation.
 */


AffineTransform.concat = function (out, t1, t2) {
  var a = t1.a,
      b = t1.b,
      c = t1.c,
      d = t1.d,
      tx = t1.tx,
      ty = t1.ty;
  out.a = a * t2.a + b * t2.c;
  out.b = a * t2.b + b * t2.d;
  out.c = c * t2.a + d * t2.c;
  out.d = c * t2.b + d * t2.d;
  out.tx = tx * t2.a + ty * t2.c + t2.tx;
  out.ty = tx * t2.b + ty * t2.d + t2.ty;
  return out;
};
/**
 * !#en Get the invert transform of an AffineTransform object.
 * This function is memory free, you should create the output affine transform by yourself and manage its memory.
 * !#zh 求逆矩阵。这个函数不创建任何内存，你需要先创建 AffineTransform 对象用来存储结果，并作为第一个参数传入函数。
 * @method invert
 * @static
 * @param {AffineTransform} out
 * @param {AffineTransform} t
 * @return {AffineTransform} Out object with inverted result.
 */


AffineTransform.invert = function (out, t) {
  var a = t.a,
      b = t.b,
      c = t.c,
      d = t.d;
  var determinant = 1 / (a * d - b * c);
  var tx = t.tx,
      ty = t.ty;
  out.a = determinant * d;
  out.b = -determinant * b;
  out.c = -determinant * c;
  out.d = determinant * a;
  out.tx = determinant * (c * ty - d * tx);
  out.ty = determinant * (b * tx - a * ty);
  return out;
};
/**
 * !#en Get an AffineTransform object from a given matrix 4x4.
 * This function is memory free, you should create the output affine transform by yourself and manage its memory.
 * !#zh 从一个 4x4 Matrix 获取 AffineTransform 对象。这个函数不创建任何内存，你需要先创建 AffineTransform 对象用来存储结果，并作为第一个参数传入函数。
 * @method invert
 * @static
 * @param {AffineTransform} out
 * @param {Mat4} mat
 * @return {AffineTransform} Out object with inverted result.
 */


AffineTransform.fromMat4 = function (out, mat) {
  var matm = mat.m;
  out.a = matm[0];
  out.b = matm[1];
  out.c = matm[4];
  out.d = matm[5];
  out.tx = matm[12];
  out.ty = matm[13];
  return out;
};
/**
 * !#en Apply the affine transformation on a point.
 * This function is memory free, you should create the output Vec2 by yourself and manage its memory.
 * !#zh 对一个点应用矩阵变换。这个函数不创建任何内存，你需要先创建一个 Vec2 对象用来存储结果，并作为第一个参数传入函数。
 * @method transformVec2
 * @static
 * @param {Vec2} out The output point to store the result
 * @param {Vec2|Number} point Point to apply transform or x.
 * @param {AffineTransform|Number} transOrY transform matrix or y.
 * @param {AffineTransform} [t] transform matrix.
 * @return {Vec2}
 */


AffineTransform.transformVec2 = function (out, point, transOrY, t) {
  var x, y;

  if (t === undefined) {
    t = transOrY;
    x = point.x;
    y = point.y;
  } else {
    x = point;
    y = transOrY;
  }

  out.x = t.a * x + t.c * y + t.tx;
  out.y = t.b * x + t.d * y + t.ty;
  return out;
};
/**
 * !#en Apply the affine transformation on a size.
 * This function is memory free, you should create the output Size by yourself and manage its memory.
 * !#zh 应用仿射变换矩阵到 Size 上。这个函数不创建任何内存，你需要先创建一个 Size 对象用来存储结果，并作为第一个参数传入函数。
 * @method transformSize
 * @static
 * @param {Size} out The output point to store the result
 * @param {Size} size
 * @param {AffineTransform} t
 * @return {Size}
 */


AffineTransform.transformSize = function (out, size, t) {
  out.width = t.a * size.width + t.c * size.height;
  out.height = t.b * size.width + t.d * size.height;
  return out;
};
/**
 * !#en Apply the affine transformation on a rect.
 * This function is memory free, you should create the output Rect by yourself and manage its memory.
 * !#zh 应用仿射变换矩阵到 Rect 上。这个函数不创建任何内存，你需要先创建一个 Rect 对象用来存储结果，并作为第一个参数传入函数。
 * @method transformRect
 * @static
 * @param {Rect} out
 * @param {Rect} rect
 * @param {AffineTransform} anAffineTransform
 * @return {Rect}
 */


AffineTransform.transformRect = function (out, rect, t) {
  var ol = rect.x;
  var ob = rect.y;
  var or = ol + rect.width;
  var ot = ob + rect.height;
  var lbx = t.a * ol + t.c * ob + t.tx;
  var lby = t.b * ol + t.d * ob + t.ty;
  var rbx = t.a * or + t.c * ob + t.tx;
  var rby = t.b * or + t.d * ob + t.ty;
  var ltx = t.a * ol + t.c * ot + t.tx;
  var lty = t.b * ol + t.d * ot + t.ty;
  var rtx = t.a * or + t.c * ot + t.tx;
  var rty = t.b * or + t.d * ot + t.ty;
  var minX = Math.min(lbx, rbx, ltx, rtx);
  var maxX = Math.max(lbx, rbx, ltx, rtx);
  var minY = Math.min(lby, rby, lty, rty);
  var maxY = Math.max(lby, rby, lty, rty);
  out.x = minX;
  out.y = minY;
  out.width = maxX - minX;
  out.height = maxY - minY;
  return out;
};
/**
 * !#en Apply the affine transformation on a rect, and truns to an Oriented Bounding Box.
 * This function is memory free, you should create the output vectors by yourself and manage their memory.
 * !#zh 应用仿射变换矩阵到 Rect 上, 并转换为有向包围盒。这个函数不创建任何内存，你需要先创建包围盒的四个 Vector 对象用来存储结果，并作为前四个参数传入函数。
 * @method transformObb
 * @static
 * @param {Vec2} out_bl
 * @param {Vec2} out_tl
 * @param {Vec2} out_tr
 * @param {Vec2} out_br
 * @param {Rect} rect
 * @param {AffineTransform} anAffineTransform
 */


AffineTransform.transformObb = function (out_bl, out_tl, out_tr, out_br, rect, anAffineTransform) {
  var x = rect.x;
  var y = rect.y;
  var width = rect.width;
  var height = rect.height;
  var tx = anAffineTransform.a * x + anAffineTransform.c * y + anAffineTransform.tx;
  var ty = anAffineTransform.b * x + anAffineTransform.d * y + anAffineTransform.ty;
  var xa = anAffineTransform.a * width;
  var xb = anAffineTransform.b * width;
  var yc = anAffineTransform.c * height;
  var yd = anAffineTransform.d * height;
  out_tl.x = tx;
  out_tl.y = ty;
  out_tr.x = xa + tx;
  out_tr.y = xb + ty;
  out_bl.x = yc + tx;
  out_bl.y = yd + ty;
  out_br.x = xa + yc + tx;
  out_br.y = xb + yd + ty;
};

cc.AffineTransform = module.exports = AffineTransform;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3V0aWxzL2FmZmluZS10cmFuc2Zvcm0uanMiXSwibmFtZXMiOlsiQWZmaW5lVHJhbnNmb3JtIiwiYSIsImIiLCJjIiwiZCIsInR4IiwidHkiLCJjcmVhdGUiLCJpZGVudGl0eSIsImNsb25lIiwidCIsImNvbmNhdCIsIm91dCIsInQxIiwidDIiLCJpbnZlcnQiLCJkZXRlcm1pbmFudCIsImZyb21NYXQ0IiwibWF0IiwibWF0bSIsIm0iLCJ0cmFuc2Zvcm1WZWMyIiwicG9pbnQiLCJ0cmFuc09yWSIsIngiLCJ5IiwidW5kZWZpbmVkIiwidHJhbnNmb3JtU2l6ZSIsInNpemUiLCJ3aWR0aCIsImhlaWdodCIsInRyYW5zZm9ybVJlY3QiLCJyZWN0Iiwib2wiLCJvYiIsIm9yIiwib3QiLCJsYngiLCJsYnkiLCJyYngiLCJyYnkiLCJsdHgiLCJsdHkiLCJydHgiLCJydHkiLCJtaW5YIiwiTWF0aCIsIm1pbiIsIm1heFgiLCJtYXgiLCJtaW5ZIiwibWF4WSIsInRyYW5zZm9ybU9iYiIsIm91dF9ibCIsIm91dF90bCIsIm91dF90ciIsIm91dF9iciIsImFuQWZmaW5lVHJhbnNmb3JtIiwieGEiLCJ4YiIsInljIiwieWQiLCJjYyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUlBLGVBQWUsR0FBRyxTQUFsQkEsZUFBa0IsQ0FBVUMsQ0FBVixFQUFhQyxDQUFiLEVBQWdCQyxDQUFoQixFQUFtQkMsQ0FBbkIs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QUdILGlCQUFpQixDQUFDdEQsQ0FBbEIsR0FBc0IyQixNQUEvQjtBQUNBLE1BQUkrQixFQUFFLEdBQUdKLGlCQUFpQixDQUFDckQsQ0FBbEIsR0FBc0IwQixNQUEvQjtBQUVBd0IsRUFBQUEsTUFBTSxDQUFDOUIsQ0FBUCxHQUFXbkIsRUFBWDtBQUNBaUQsRUFBQUEsTUFBTSxDQUFDN0IsQ0FBUCxHQUFXbkIsRUFBWDtBQUNBaUQsRUFBQUEsTUFBTSxDQUFDL0IsQ0FBUCxHQUFXa0MsRUFBRSxHQUFHckQsRUFBaEI7QUFDQWtELEVBQUFBLE1BQU0sQ0FBQzlCLENBQVAsR0FBV2tDLEVBQUUsR0FBR3JELEVBQWhCO0FBQ0ErQyxFQUFBQSxNQUFNLENBQUM3QixDQUFQLEdBQVdvQyxFQUFFLEdBQUd2RCxFQUFoQjtBQUNBZ0QsRUFBQUEsTUFBTSxDQUFDNUIsQ0FBUCxHQUFXb0MsRUFBRSxHQUFHdkQsRUFBaEI7QUFDQWtELEVBQUFBLE1BQU0sQ0FBQ2hDLENBQVAsR0FBV2tDLEVBQUUsR0FBR0UsRUFBTCxHQUFVdkQsRUFBckI7QUFDQW1ELEVBQUFBLE1BQU0sQ0FBQy9CLENBQVAsR0FBV2tDLEVBQUUsR0FBR0UsRUFBTCxHQUFVdkQsRUFBckI7QUFDSCxDQXJCRDs7QUF1QkF3RCxFQUFFLENBQUM5RCxlQUFILEdBQXFCK0QsTUFBTSxDQUFDQyxPQUFQLEdBQWlCaEUsZUFBdEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAwOC0yMDEwIFJpY2FyZG8gUXVlc2FkYVxuIENvcHlyaWdodCAoYykgMjAxMS0yMDEyIGNvY29zMmQteC5vcmdcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwOi8vd3d3LmNvY29zMmQteC5vcmdcblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogISNlblxuICogQWZmaW5lVHJhbnNmb3JtIGNsYXNzIHJlcHJlc2VudCBhbiBhZmZpbmUgdHJhbnNmb3JtIG1hdHJpeC4gSXQncyBjb21wb3NlZCBiYXNpY2FsbHkgYnkgdHJhbnNsYXRpb24sIHJvdGF0aW9uLCBzY2FsZSB0cmFuc2Zvcm1hdGlvbnMuPGJyLz5cbiAqICEjemhcbiAqIEFmZmluZVRyYW5zZm9ybSDnsbvku6PooajkuIDkuKrku7/lsITlj5jmjaLnn6npmLXjgILlroPln7rmnKzkuIrmmK/nlLHlubPnp7vml4vovazvvIznvKnmlL7ovazlj5jmiYDnu4TmiJDjgII8YnIvPlxuICogQGNsYXNzIEFmZmluZVRyYW5zZm9ybVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge051bWJlcn0gYVxuICogQHBhcmFtIHtOdW1iZXJ9IGJcbiAqIEBwYXJhbSB7TnVtYmVyfSBjXG4gKiBAcGFyYW0ge051bWJlcn0gZFxuICogQHBhcmFtIHtOdW1iZXJ9IHR4XG4gKiBAcGFyYW0ge051bWJlcn0gdHlcbiAqIEBzZWUgQWZmaW5lVHJhbnNmb3JtLmNyZWF0ZVxuICovXG52YXIgQWZmaW5lVHJhbnNmb3JtID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHR4LCB0eSkge1xuICAgIHRoaXMuYSA9IGE7XG4gICAgdGhpcy5iID0gYjtcbiAgICB0aGlzLmMgPSBjO1xuICAgIHRoaXMuZCA9IGQ7XG4gICAgdGhpcy50eCA9IHR4O1xuICAgIHRoaXMudHkgPSB0eTtcbn07XG5cbi8qKlxuICogISNlbiBDcmVhdGUgYSBBZmZpbmVUcmFuc2Zvcm0gb2JqZWN0IHdpdGggYWxsIGNvbnRlbnRzIGluIHRoZSBtYXRyaXguXG4gKiAhI3poIOeUqOWcqOefqemYteS4reeahOaJgOacieWGheWuueWIm+W7uuS4gOS4qiBBZmZpbmVUcmFuc2Zvcm0g5a+56LGh44CCXG4gKiBAbWV0aG9kIGNyZWF0ZVxuICogQHN0YXRpY1xuICogQHBhcmFtIHtOdW1iZXJ9IGFcbiAqIEBwYXJhbSB7TnVtYmVyfSBiXG4gKiBAcGFyYW0ge051bWJlcn0gY1xuICogQHBhcmFtIHtOdW1iZXJ9IGRcbiAqIEBwYXJhbSB7TnVtYmVyfSB0eFxuICogQHBhcmFtIHtOdW1iZXJ9IHR5XG4gKiBAcmV0dXJuIHtBZmZpbmVUcmFuc2Zvcm19XG4gKi9cbkFmZmluZVRyYW5zZm9ybS5jcmVhdGUgPSBmdW5jdGlvbiAoYSwgYiwgYywgZCwgdHgsIHR5KSB7XG4gICAgcmV0dXJuIHthOiBhLCBiOiBiLCBjOiBjLCBkOiBkLCB0eDogdHgsIHR5OiB0eX07XG59O1xuXG4vKipcbiAqICEjZW5cbiAqIENyZWF0ZSBhIGlkZW50aXR5IHRyYW5zZm9ybWF0aW9uIG1hdHJpeDogPGJyLz5cbiAqIFsgMSwgMCwgMCwgPGJyLz5cbiAqICAgMCwgMSwgMCBdXG4gKiAhI3poXG4gKiDljZXkvY3nn6npmLXvvJo8YnIvPlxuICogWyAxLCAwLCAwLCA8YnIvPlxuICogICAwLCAxLCAwIF1cbiAqXG4gKiBAbWV0aG9kIGlkZW50aXR5XG4gKiBAc3RhdGljXG4gKiBAcmV0dXJuIHtBZmZpbmVUcmFuc2Zvcm19XG4gKi9cbkFmZmluZVRyYW5zZm9ybS5pZGVudGl0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge2E6IDEuMCwgYjogMC4wLCBjOiAwLjAsIGQ6IDEuMCwgdHg6IDAuMCwgdHk6IDAuMH07XG59O1xuXG4vKipcbiAqICEjZW4gQ2xvbmUgYSBBZmZpbmVUcmFuc2Zvcm0gb2JqZWN0IGZyb20gdGhlIHNwZWNpZmllZCB0cmFuc2Zvcm0uXG4gKiAhI3poIOWFi+mahuaMh+WumueahCBBZmZpbmVUcmFuc2Zvcm0g5a+56LGh44CCXG4gKiBAbWV0aG9kIGNsb25lXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0ge0FmZmluZVRyYW5zZm9ybX0gdFxuICogQHJldHVybiB7QWZmaW5lVHJhbnNmb3JtfVxuICovXG5BZmZpbmVUcmFuc2Zvcm0uY2xvbmUgPSBmdW5jdGlvbiAodCkge1xuICAgIHJldHVybiB7YTogdC5hLCBiOiB0LmIsIGM6IHQuYywgZDogdC5kLCB0eDogdC50eCwgdHk6IHQudHl9O1xufTtcblxuLyoqXG4gKiAhI2VuXG4gKiBDb25jYXRlbmF0ZSBhIHRyYW5zZm9ybSBtYXRyaXggdG8gYW5vdGhlclxuICogVGhlIHJlc3VsdHMgYXJlIHJlZmxlY3RlZCBpbiB0aGUgb3V0IGFmZmluZSB0cmFuc2Zvcm1cbiAqIG91dCA9IHQxICogdDJcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbWVtb3J5IGZyZWUsIHlvdSBzaG91bGQgY3JlYXRlIHRoZSBvdXRwdXQgYWZmaW5lIHRyYW5zZm9ybSBieSB5b3Vyc2VsZiBhbmQgbWFuYWdlIGl0cyBtZW1vcnkuXG4gKiAhI3poXG4gKiDmi7zmjqXkuKTkuKrnn6npmLXvvIzlsIbnu5Pmnpzkv53lrZjliLAgb3V0IOefqemYteOAgui/meS4quWHveaVsOS4jeWIm+W7uuS7u+S9leWGheWtmO+8jOS9oOmcgOimgeWFiOWIm+W7uiBBZmZpbmVUcmFuc2Zvcm0g5a+56LGh55So5p2l5a2Y5YKo57uT5p6c77yM5bm25L2c5Li656ys5LiA5Liq5Y+C5pWw5Lyg5YWl5Ye95pWw44CCXG4gKiBvdXQgPSB0MSAqIHQyXG4gKiBAbWV0aG9kIGNvbmNhdFxuICogQHN0YXRpY1xuICogQHBhcmFtIHtBZmZpbmVUcmFuc2Zvcm19IG91dCBPdXQgb2JqZWN0IHRvIHN0b3JlIHRoZSBjb25jYXQgcmVzdWx0XG4gKiBAcGFyYW0ge0FmZmluZVRyYW5zZm9ybX0gdDEgVGhlIGZpcnN0IHRyYW5zZm9ybSBvYmplY3QuXG4gKiBAcGFyYW0ge0FmZmluZVRyYW5zZm9ybX0gdDIgVGhlIHRyYW5zZm9ybSBvYmplY3QgdG8gY29uY2F0ZW5hdGUuXG4gKiBAcmV0dXJuIHtBZmZpbmVUcmFuc2Zvcm19IE91dCBvYmplY3Qgd2l0aCB0aGUgcmVzdWx0IG9mIGNvbmNhdGVuYXRpb24uXG4gKi9cbkFmZmluZVRyYW5zZm9ybS5jb25jYXQgPSBmdW5jdGlvbiAob3V0LCB0MSwgdDIpIHtcbiAgICB2YXIgYSA9IHQxLmEsIGIgPSB0MS5iLCBjID0gdDEuYywgZCA9IHQxLmQsIHR4ID0gdDEudHgsIHR5ID0gdDEudHk7XG4gICAgb3V0LmEgPSBhICogdDIuYSArIGIgKiB0Mi5jO1xuICAgIG91dC5iID0gYSAqIHQyLmIgKyBiICogdDIuZDtcbiAgICBvdXQuYyA9IGMgKiB0Mi5hICsgZCAqIHQyLmM7XG4gICAgb3V0LmQgPSBjICogdDIuYiArIGQgKiB0Mi5kO1xuICAgIG91dC50eCA9IHR4ICogdDIuYSArIHR5ICogdDIuYyArIHQyLnR4O1xuICAgIG91dC50eSA9IHR4ICogdDIuYiArIHR5ICogdDIuZCArIHQyLnR5O1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqICEjZW4gR2V0IHRoZSBpbnZlcnQgdHJhbnNmb3JtIG9mIGFuIEFmZmluZVRyYW5zZm9ybSBvYmplY3QuXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIG1lbW9yeSBmcmVlLCB5b3Ugc2hvdWxkIGNyZWF0ZSB0aGUgb3V0cHV0IGFmZmluZSB0cmFuc2Zvcm0gYnkgeW91cnNlbGYgYW5kIG1hbmFnZSBpdHMgbWVtb3J5LlxuICogISN6aCDmsYLpgIbnn6npmLXjgILov5nkuKrlh73mlbDkuI3liJvlu7rku7vkvZXlhoXlrZjvvIzkvaDpnIDopoHlhYjliJvlu7ogQWZmaW5lVHJhbnNmb3JtIOWvueixoeeUqOadpeWtmOWCqOe7k+aenO+8jOW5tuS9nOS4uuesrOS4gOS4quWPguaVsOS8oOWFpeWHveaVsOOAglxuICogQG1ldGhvZCBpbnZlcnRcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSB7QWZmaW5lVHJhbnNmb3JtfSBvdXRcbiAqIEBwYXJhbSB7QWZmaW5lVHJhbnNmb3JtfSB0XG4gKiBAcmV0dXJuIHtBZmZpbmVUcmFuc2Zvcm19IE91dCBvYmplY3Qgd2l0aCBpbnZlcnRlZCByZXN1bHQuXG4gKi9cbkFmZmluZVRyYW5zZm9ybS5pbnZlcnQgPSBmdW5jdGlvbiAob3V0LCB0KSB7XG4gICAgdmFyIGEgPSB0LmEsIGIgPSB0LmIsIGMgPSB0LmMsIGQgPSB0LmQ7XG4gICAgdmFyIGRldGVybWluYW50ID0gMSAvIChhICogZCAtIGIgKiBjKTtcbiAgICB2YXIgdHggPSB0LnR4LCB0eSA9IHQudHk7XG4gICAgb3V0LmEgPSBkZXRlcm1pbmFudCAqIGQ7XG4gICAgb3V0LmIgPSAtZGV0ZXJtaW5hbnQgKiBiO1xuICAgIG91dC5jID0gLWRldGVybWluYW50ICogYztcbiAgICBvdXQuZCA9IGRldGVybWluYW50ICogYTtcbiAgICBvdXQudHggPSBkZXRlcm1pbmFudCAqIChjICogdHkgLSBkICogdHgpO1xuICAgIG91dC50eSA9IGRldGVybWluYW50ICogKGIgKiB0eCAtIGEgKiB0eSk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogISNlbiBHZXQgYW4gQWZmaW5lVHJhbnNmb3JtIG9iamVjdCBmcm9tIGEgZ2l2ZW4gbWF0cml4IDR4NC5cbiAqIFRoaXMgZnVuY3Rpb24gaXMgbWVtb3J5IGZyZWUsIHlvdSBzaG91bGQgY3JlYXRlIHRoZSBvdXRwdXQgYWZmaW5lIHRyYW5zZm9ybSBieSB5b3Vyc2VsZiBhbmQgbWFuYWdlIGl0cyBtZW1vcnkuXG4gKiAhI3poIOS7juS4gOS4qiA0eDQgTWF0cml4IOiOt+WPliBBZmZpbmVUcmFuc2Zvcm0g5a+56LGh44CC6L+Z5Liq5Ye95pWw5LiN5Yib5bu65Lu75L2V5YaF5a2Y77yM5L2g6ZyA6KaB5YWI5Yib5bu6IEFmZmluZVRyYW5zZm9ybSDlr7nosaHnlKjmnaXlrZjlgqjnu5PmnpzvvIzlubbkvZzkuLrnrKzkuIDkuKrlj4LmlbDkvKDlhaXlh73mlbDjgIJcbiAqIEBtZXRob2QgaW52ZXJ0XG4gKiBAc3RhdGljXG4gKiBAcGFyYW0ge0FmZmluZVRyYW5zZm9ybX0gb3V0XG4gKiBAcGFyYW0ge01hdDR9IG1hdFxuICogQHJldHVybiB7QWZmaW5lVHJhbnNmb3JtfSBPdXQgb2JqZWN0IHdpdGggaW52ZXJ0ZWQgcmVzdWx0LlxuICovXG5BZmZpbmVUcmFuc2Zvcm0uZnJvbU1hdDQgPSBmdW5jdGlvbiAob3V0LCBtYXQpIHtcbiAgICBsZXQgbWF0bSA9IG1hdC5tO1xuICAgIG91dC5hID0gbWF0bVswXTtcbiAgICBvdXQuYiA9IG1hdG1bMV07XG4gICAgb3V0LmMgPSBtYXRtWzRdO1xuICAgIG91dC5kID0gbWF0bVs1XTtcbiAgICBvdXQudHggPSBtYXRtWzEyXTtcbiAgICBvdXQudHkgPSBtYXRtWzEzXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiAhI2VuIEFwcGx5IHRoZSBhZmZpbmUgdHJhbnNmb3JtYXRpb24gb24gYSBwb2ludC5cbiAqIFRoaXMgZnVuY3Rpb24gaXMgbWVtb3J5IGZyZWUsIHlvdSBzaG91bGQgY3JlYXRlIHRoZSBvdXRwdXQgVmVjMiBieSB5b3Vyc2VsZiBhbmQgbWFuYWdlIGl0cyBtZW1vcnkuXG4gKiAhI3poIOWvueS4gOS4queCueW6lOeUqOefqemYteWPmOaNouOAgui/meS4quWHveaVsOS4jeWIm+W7uuS7u+S9leWGheWtmO+8jOS9oOmcgOimgeWFiOWIm+W7uuS4gOS4qiBWZWMyIOWvueixoeeUqOadpeWtmOWCqOe7k+aenO+8jOW5tuS9nOS4uuesrOS4gOS4quWPguaVsOS8oOWFpeWHveaVsOOAglxuICogQG1ldGhvZCB0cmFuc2Zvcm1WZWMyXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0ge1ZlYzJ9IG91dCBUaGUgb3V0cHV0IHBvaW50IHRvIHN0b3JlIHRoZSByZXN1bHRcbiAqIEBwYXJhbSB7VmVjMnxOdW1iZXJ9IHBvaW50IFBvaW50IHRvIGFwcGx5IHRyYW5zZm9ybSBvciB4LlxuICogQHBhcmFtIHtBZmZpbmVUcmFuc2Zvcm18TnVtYmVyfSB0cmFuc09yWSB0cmFuc2Zvcm0gbWF0cml4IG9yIHkuXG4gKiBAcGFyYW0ge0FmZmluZVRyYW5zZm9ybX0gW3RdIHRyYW5zZm9ybSBtYXRyaXguXG4gKiBAcmV0dXJuIHtWZWMyfVxuICovXG5BZmZpbmVUcmFuc2Zvcm0udHJhbnNmb3JtVmVjMiA9IGZ1bmN0aW9uIChvdXQsIHBvaW50LCB0cmFuc09yWSwgdCkge1xuICAgIHZhciB4LCB5O1xuICAgIGlmICh0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdCA9IHRyYW5zT3JZO1xuICAgICAgICB4ID0gcG9pbnQueDtcbiAgICAgICAgeSA9IHBvaW50Lnk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgeCA9IHBvaW50O1xuICAgICAgICB5ID0gdHJhbnNPclk7XG4gICAgfVxuICAgIG91dC54ID0gdC5hICogeCArIHQuYyAqIHkgKyB0LnR4O1xuICAgIG91dC55ID0gdC5iICogeCArIHQuZCAqIHkgKyB0LnR5O1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqICEjZW4gQXBwbHkgdGhlIGFmZmluZSB0cmFuc2Zvcm1hdGlvbiBvbiBhIHNpemUuXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIG1lbW9yeSBmcmVlLCB5b3Ugc2hvdWxkIGNyZWF0ZSB0aGUgb3V0cHV0IFNpemUgYnkgeW91cnNlbGYgYW5kIG1hbmFnZSBpdHMgbWVtb3J5LlxuICogISN6aCDlupTnlKjku7/lsITlj5jmjaLnn6npmLXliLAgU2l6ZSDkuIrjgILov5nkuKrlh73mlbDkuI3liJvlu7rku7vkvZXlhoXlrZjvvIzkvaDpnIDopoHlhYjliJvlu7rkuIDkuKogU2l6ZSDlr7nosaHnlKjmnaXlrZjlgqjnu5PmnpzvvIzlubbkvZzkuLrnrKzkuIDkuKrlj4LmlbDkvKDlhaXlh73mlbDjgIJcbiAqIEBtZXRob2QgdHJhbnNmb3JtU2l6ZVxuICogQHN0YXRpY1xuICogQHBhcmFtIHtTaXplfSBvdXQgVGhlIG91dHB1dCBwb2ludCB0byBzdG9yZSB0aGUgcmVzdWx0XG4gKiBAcGFyYW0ge1NpemV9IHNpemVcbiAqIEBwYXJhbSB7QWZmaW5lVHJhbnNmb3JtfSB0XG4gKiBAcmV0dXJuIHtTaXplfVxuICovXG5BZmZpbmVUcmFuc2Zvcm0udHJhbnNmb3JtU2l6ZSA9IGZ1bmN0aW9uIChvdXQsIHNpemUsIHQpIHtcbiAgICBvdXQud2lkdGggPSB0LmEgKiBzaXplLndpZHRoICsgdC5jICogc2l6ZS5oZWlnaHQ7XG4gICAgb3V0LmhlaWdodCA9IHQuYiAqIHNpemUud2lkdGggKyB0LmQgKiBzaXplLmhlaWdodDtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiAhI2VuIEFwcGx5IHRoZSBhZmZpbmUgdHJhbnNmb3JtYXRpb24gb24gYSByZWN0LlxuICogVGhpcyBmdW5jdGlvbiBpcyBtZW1vcnkgZnJlZSwgeW91IHNob3VsZCBjcmVhdGUgdGhlIG91dHB1dCBSZWN0IGJ5IHlvdXJzZWxmIGFuZCBtYW5hZ2UgaXRzIG1lbW9yeS5cbiAqICEjemgg5bqU55So5Lu/5bCE5Y+Y5o2i55+p6Zi15YiwIFJlY3Qg5LiK44CC6L+Z5Liq5Ye95pWw5LiN5Yib5bu65Lu75L2V5YaF5a2Y77yM5L2g6ZyA6KaB5YWI5Yib5bu65LiA5LiqIFJlY3Qg5a+56LGh55So5p2l5a2Y5YKo57uT5p6c77yM5bm25L2c5Li656ys5LiA5Liq5Y+C5pWw5Lyg5YWl5Ye95pWw44CCXG4gKiBAbWV0aG9kIHRyYW5zZm9ybVJlY3RcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSB7UmVjdH0gb3V0XG4gKiBAcGFyYW0ge1JlY3R9IHJlY3RcbiAqIEBwYXJhbSB7QWZmaW5lVHJhbnNmb3JtfSBhbkFmZmluZVRyYW5zZm9ybVxuICogQHJldHVybiB7UmVjdH1cbiAqL1xuQWZmaW5lVHJhbnNmb3JtLnRyYW5zZm9ybVJlY3QgPSBmdW5jdGlvbihvdXQsIHJlY3QsIHQpe1xuICAgIHZhciBvbCA9IHJlY3QueDtcbiAgICB2YXIgb2IgPSByZWN0Lnk7XG4gICAgdmFyIG9yID0gb2wgKyByZWN0LndpZHRoO1xuICAgIHZhciBvdCA9IG9iICsgcmVjdC5oZWlnaHQ7XG4gICAgdmFyIGxieCA9IHQuYSAqIG9sICsgdC5jICogb2IgKyB0LnR4O1xuICAgIHZhciBsYnkgPSB0LmIgKiBvbCArIHQuZCAqIG9iICsgdC50eTtcbiAgICB2YXIgcmJ4ID0gdC5hICogb3IgKyB0LmMgKiBvYiArIHQudHg7XG4gICAgdmFyIHJieSA9IHQuYiAqIG9yICsgdC5kICogb2IgKyB0LnR5O1xuICAgIHZhciBsdHggPSB0LmEgKiBvbCArIHQuYyAqIG90ICsgdC50eDtcbiAgICB2YXIgbHR5ID0gdC5iICogb2wgKyB0LmQgKiBvdCArIHQudHk7XG4gICAgdmFyIHJ0eCA9IHQuYSAqIG9yICsgdC5jICogb3QgKyB0LnR4O1xuICAgIHZhciBydHkgPSB0LmIgKiBvciArIHQuZCAqIG90ICsgdC50eTtcblxuICAgIHZhciBtaW5YID0gTWF0aC5taW4obGJ4LCByYngsIGx0eCwgcnR4KTtcbiAgICB2YXIgbWF4WCA9IE1hdGgubWF4KGxieCwgcmJ4LCBsdHgsIHJ0eCk7XG4gICAgdmFyIG1pblkgPSBNYXRoLm1pbihsYnksIHJieSwgbHR5LCBydHkpO1xuICAgIHZhciBtYXhZID0gTWF0aC5tYXgobGJ5LCByYnksIGx0eSwgcnR5KTtcblxuICAgIG91dC54ID0gbWluWDtcbiAgICBvdXQueSA9IG1pblk7XG4gICAgb3V0LndpZHRoID0gbWF4WCAtIG1pblg7XG4gICAgb3V0LmhlaWdodCA9IG1heFkgLSBtaW5ZO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqICEjZW4gQXBwbHkgdGhlIGFmZmluZSB0cmFuc2Zvcm1hdGlvbiBvbiBhIHJlY3QsIGFuZCB0cnVucyB0byBhbiBPcmllbnRlZCBCb3VuZGluZyBCb3guXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIG1lbW9yeSBmcmVlLCB5b3Ugc2hvdWxkIGNyZWF0ZSB0aGUgb3V0cHV0IHZlY3RvcnMgYnkgeW91cnNlbGYgYW5kIG1hbmFnZSB0aGVpciBtZW1vcnkuXG4gKiAhI3poIOW6lOeUqOS7v+WwhOWPmOaNouefqemYteWIsCBSZWN0IOS4iiwg5bm26L2s5o2i5Li65pyJ5ZCR5YyF5Zu055uS44CC6L+Z5Liq5Ye95pWw5LiN5Yib5bu65Lu75L2V5YaF5a2Y77yM5L2g6ZyA6KaB5YWI5Yib5bu65YyF5Zu055uS55qE5Zub5LiqIFZlY3RvciDlr7nosaHnlKjmnaXlrZjlgqjnu5PmnpzvvIzlubbkvZzkuLrliY3lm5vkuKrlj4LmlbDkvKDlhaXlh73mlbDjgIJcbiAqIEBtZXRob2QgdHJhbnNmb3JtT2JiXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0ge1ZlYzJ9IG91dF9ibFxuICogQHBhcmFtIHtWZWMyfSBvdXRfdGxcbiAqIEBwYXJhbSB7VmVjMn0gb3V0X3RyXG4gKiBAcGFyYW0ge1ZlYzJ9IG91dF9iclxuICogQHBhcmFtIHtSZWN0fSByZWN0XG4gKiBAcGFyYW0ge0FmZmluZVRyYW5zZm9ybX0gYW5BZmZpbmVUcmFuc2Zvcm1cbiAqL1xuQWZmaW5lVHJhbnNmb3JtLnRyYW5zZm9ybU9iYiA9IGZ1bmN0aW9uIChvdXRfYmwsIG91dF90bCwgb3V0X3RyLCBvdXRfYnIsIHJlY3QsIGFuQWZmaW5lVHJhbnNmb3JtKSB7XG4gICAgdmFyIHggPSByZWN0Lng7XG4gICAgdmFyIHkgPSByZWN0Lnk7XG4gICAgdmFyIHdpZHRoID0gcmVjdC53aWR0aDtcbiAgICB2YXIgaGVpZ2h0ID0gcmVjdC5oZWlnaHQ7XG5cbiAgICB2YXIgdHggPSBhbkFmZmluZVRyYW5zZm9ybS5hICogeCArIGFuQWZmaW5lVHJhbnNmb3JtLmMgKiB5ICsgYW5BZmZpbmVUcmFuc2Zvcm0udHg7XG4gICAgdmFyIHR5ID0gYW5BZmZpbmVUcmFuc2Zvcm0uYiAqIHggKyBhbkFmZmluZVRyYW5zZm9ybS5kICogeSArIGFuQWZmaW5lVHJhbnNmb3JtLnR5O1xuICAgIHZhciB4YSA9IGFuQWZmaW5lVHJhbnNmb3JtLmEgKiB3aWR0aDtcbiAgICB2YXIgeGIgPSBhbkFmZmluZVRyYW5zZm9ybS5iICogd2lkdGg7XG4gICAgdmFyIHljID0gYW5BZmZpbmVUcmFuc2Zvcm0uYyAqIGhlaWdodDtcbiAgICB2YXIgeWQgPSBhbkFmZmluZVRyYW5zZm9ybS5kICogaGVpZ2h0O1xuXG4gICAgb3V0X3RsLnggPSB0eDtcbiAgICBvdXRfdGwueSA9IHR5O1xuICAgIG91dF90ci54ID0geGEgKyB0eDtcbiAgICBvdXRfdHIueSA9IHhiICsgdHk7XG4gICAgb3V0X2JsLnggPSB5YyArIHR4O1xuICAgIG91dF9ibC55ID0geWQgKyB0eTtcbiAgICBvdXRfYnIueCA9IHhhICsgeWMgKyB0eDtcbiAgICBvdXRfYnIueSA9IHhiICsgeWQgKyB0eTtcbn07XG5cbmNjLkFmZmluZVRyYW5zZm9ybSA9IG1vZHVsZS5leHBvcnRzID0gQWZmaW5lVHJhbnNmb3JtOyJdLCJzb3VyY2VSb290IjoiLyJ9