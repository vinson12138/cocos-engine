
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/geom-utils/intersect.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _gfx = _interopRequireDefault(require("../../renderer/gfx"));

var _recyclePool = _interopRequireDefault(require("../../renderer/memop/recycle-pool"));

var _valueTypes = require("../value-types");

var _aabb = _interopRequireDefault(require("./aabb"));

var distance = _interopRequireWildcard(require("./distance"));

var _enums = _interopRequireDefault(require("./enums"));

var _ray = _interopRequireDefault(require("./ray"));

var _triangle = _interopRequireDefault(require("./triangle"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
 * @class geomUtils.intersect
 */
var ray_mesh = function () {
  var tri = _triangle["default"].create();

  var minDist = Infinity;

  function getVec3(out, data, idx, stride) {
    _valueTypes.Vec3.set(out, data[idx * stride], data[idx * stride + 1], data[idx * stride + 2]);
  }

  return function (ray, mesh) {
    minDist = Infinity;
    var subMeshes = mesh._subMeshes;

    for (var i = 0; i < subMeshes.length; i++) {
      if (subMeshes[i]._primitiveType !== _gfx["default"].PT_TRIANGLES) continue;
      var subData = mesh._subDatas[i] || mesh._subDatas[0];

      var posData = mesh._getAttrMeshData(i, _gfx["default"].ATTR_POSITION);

      var iData = subData.getIData(Uint16Array);
      var format = subData.vfm;
      var fmt = format.element(_gfx["default"].ATTR_POSITION);
      var num = fmt.num;

      for (var _i = 0; _i < iData.length; _i += 3) {
        getVec3(tri.a, posData, iData[_i], num);
        getVec3(tri.b, posData, iData[_i + 1], num);
        getVec3(tri.c, posData, iData[_i + 2], num);
        var dist = ray_triangle(ray, tri);

        if (dist > 0 && dist < minDist) {
          minDist = dist;
        }
      }
    }

    return minDist;
  };
}(); // adapt to old api


var rayMesh = ray_mesh;
/** 
 * !#en
 * Check whether ray intersect with nodes
 * !#zh
 * 检测射线是否与物体有交集
 * @static
 * @method ray_cast
 * @param {Node} root - If root is null, then traversal nodes from scene node
 * @param {geomUtils.Ray} worldRay
 * @param {Function} handler
 * @param {Function} filter
 * @return {[]} [{node, distance}]
*/

var ray_cast = function () {
  function traversal(node, cb) {
    var children = node.children;

    for (var i = children.length - 1; i >= 0; i--) {
      var child = children[i];
      traversal(child, cb);
    }

    cb(node);
  }

  function cmp(a, b) {
    return a.distance - b.distance;
  }

  function transformMat4Normal(out, a, m) {
    var mm = m.m;
    var x = a.x,
        y = a.y,
        z = a.z,
        rhw = mm[3] * x + mm[7] * y + mm[11] * z;
    rhw = rhw ? 1 / rhw : 1;
    out.x = (mm[0] * x + mm[4] * y + mm[8] * z) * rhw;
    out.y = (mm[1] * x + mm[5] * y + mm[9] * z) * rhw;
    out.z = (mm[2] * x + mm[6] * y + mm[10] * z) * rhw;
    return out;
  }

  var resultsPool = new _recyclePool["default"](function () {
    return {
      distance: 0,
      node: null
    };
  }, 1);
  var results = []; // temp variable

  var nodeAabb = _aabb["default"].create();

  var minPos = new _valueTypes.Vec3();
  var maxPos = new _valueTypes.Vec3();
  var modelRay = new _ray["default"]();
  var m4_1 = cc.mat4();
  var m4_2 = cc.mat4();
  var d = new _valueTypes.Vec3();

  function distanceValid(distance) {
    return distance > 0 && distance < Infinity;
  }

  return function (root, worldRay, handler, filter) {
    resultsPool.reset();
    results.length = 0;
    root = root || cc.director.getScene();
    traversal(root, function (node) {
      if (filter && !filter(node)) return; // transform world ray to model ray

      _valueTypes.Mat4.invert(m4_2, node.getWorldMatrix(m4_1));

      _valueTypes.Vec3.transformMat4(modelRay.o, worldRay.o, m4_2);

      _valueTypes.Vec3.normalize(modelRay.d, transformMat4Normal(modelRay.d, worldRay.d, m4_2)); // raycast with bounding box


      var distance = Infinity;
      var component = node._renderComponent;

      if (component instanceof cc.MeshRenderer) {
        distance = ray_aabb(modelRay, component._boundingBox);
      } else if (node.width && node.height) {
        _valueTypes.Vec3.set(minPos, -node.width * node.anchorX, -node.height * node.anchorY, node.z);

        _valueTypes.Vec3.set(maxPos, node.width * (1 - node.anchorX), node.height * (1 - node.anchorY), node.z);

        _aabb["default"].fromPoints(nodeAabb, minPos, maxPos);

        distance = ray_aabb(modelRay, nodeAabb);
      }

      if (!distanceValid(distance)) return;

      if (handler) {
        distance = handler(modelRay, node, distance);
      }

      if (distanceValid(distance)) {
        _valueTypes.Vec3.scale(d, modelRay.d, distance);

        transformMat4Normal(d, d, m4_1);
        var res = resultsPool.add();
        res.node = node;
        res.distance = _valueTypes.Vec3.mag(d);
        results.push(res);
      }
    });
    results.sort(cmp);
    return results;
  };
}(); // adapt to old api


var raycast = ray_cast;
/**
 * !#en ray-plane intersect<br/>
 * !#zh 射线与平面的相交性检测。
 * @static
 * @method ray_plane
 * @param {geomUtils.Ray} ray
 * @param {geomUtils.Plane} plane
 * @return {number} 0 or not 0
 */

var ray_plane = function () {
  var pt = new _valueTypes.Vec3(0, 0, 0);
  return function (ray, plane) {
    var denom = _valueTypes.Vec3.dot(ray.d, plane.n);

    if (Math.abs(denom) < Number.EPSILON) {
      return 0;
    }

    _valueTypes.Vec3.multiplyScalar(pt, plane.n, plane.d);

    var t = _valueTypes.Vec3.dot(_valueTypes.Vec3.subtract(pt, pt, ray.o), plane.n) / denom;

    if (t < 0) {
      return 0;
    }

    return t;
  };
}();
/**
 * !#en line-plane intersect<br/>
 * !#zh 线段与平面的相交性检测。
 * @static
 * @method line_plane
 * @param {geomUtils.Line} line
 * @param {geomUtils.Plane} plane
 * @return {number} 0 or not 0
 */


var line_plane = function () {
  var ab = new _valueTypes.Vec3(0, 0, 0);
  return function (line, plane) {
    _valueTypes.Vec3.subtract(ab, line.e, line.s);

    var t = (plane.d - _valueTypes.Vec3.dot(line.s, plane.n)) / _valueTypes.Vec3.dot(ab, plane.n);

    if (t < 0 || t > 1) {
      return 0;
    }

    return t;
  };
}(); // based on http://fileadmin.cs.lth.se/cs/Personal/Tomas_Akenine-Moller/raytri/

/**
 * !#en ray-triangle intersect<br/>
 * !#zh 射线与三角形的相交性检测。
 * @static
 * @method ray_triangle
 * @param {geomUtils.Ray} ray
 * @param {geomUtils.Triangle} triangle
 * @param {boolean} doubleSided
 * @return {number} 0 or not 0
 */


var ray_triangle = function () {
  var ab = new _valueTypes.Vec3(0, 0, 0);
  var ac = new _valueTypes.Vec3(0, 0, 0);
  var pvec = new _valueTypes.Vec3(0, 0, 0);
  var tvec = new _valueTypes.Vec3(0, 0, 0);
  var qvec = new _valueTypes.Vec3(0, 0, 0);
  return function (ray, triangle, doubleSided) {
    _valueTypes.Vec3.subtract(ab, triangle.b, triangle.a);

    _valueTypes.Vec3.subtract(ac, triangle.c, triangle.a);

    _valueTypes.Vec3.cross(pvec, ray.d, ac);

    var det = _valueTypes.Vec3.dot(ab, pvec);

    if (det < Number.EPSILON && (!doubleSided || det > -Number.EPSILON)) {
      return 0;
    }

    var inv_det = 1 / det;

    _valueTypes.Vec3.subtract(tvec, ray.o, triangle.a);

    var u = _valueTypes.Vec3.dot(tvec, pvec) * inv_det;

    if (u < 0 || u > 1) {
      return 0;
    }

    _valueTypes.Vec3.cross(qvec, tvec, ab);

    var v = _valueTypes.Vec3.dot(ray.d, qvec) * inv_det;

    if (v < 0 || u + v > 1) {
      return 0;
    }

    var t = _valueTypes.Vec3.dot(ac, qvec) * inv_det;
    return t < 0 ? 0 : t;
  };
}(); // adapt to old api


var rayTriangle = ray_triangle;
/**
 * !#en line-triangle intersect<br/>
 * !#zh 线段与三角形的相交性检测。
 * @static
 * @method line_triangle
 * @param {geomUtils.Line} line
 * @param {geomUtils.Triangle} triangle
 * @param {Vec3} outPt optional, The intersection point
 * @return {number} 0 or not 0
 */

var line_triangle = function () {
  var ab = new _valueTypes.Vec3(0, 0, 0);
  var ac = new _valueTypes.Vec3(0, 0, 0);
  var qp = new _valueTypes.Vec3(0, 0, 0);
  var ap = new _valueTypes.Vec3(0, 0, 0);
  var n = new _valueTypes.Vec3(0, 0, 0);
  var e = new _valueTypes.Vec3(0, 0, 0);
  return function (line, triangle, outPt) {
    _valueTypes.Vec3.subtract(ab, triangle.b, triangle.a);

    _valueTypes.Vec3.subtract(ac, triangle.c, triangle.a);

    _valueTypes.Vec3.subtract(qp, line.s, line.e);

    _valueTypes.Vec3.cross(n, ab, ac);

    var det = _valueTypes.Vec3.dot(qp, n);

    if (det <= 0.0) {
      return 0;
    }

    _valueTypes.Vec3.subtract(ap, line.s, triangle.a);

    var t = _valueTypes.Vec3.dot(ap, n);

    if (t < 0 || t > det) {
      return 0;
    }

    _valueTypes.Vec3.cross(e, qp, ap);

    var v = _valueTypes.Vec3.dot(ac, e);

    if (v < 0 || v > det) {
      return 0;
    }

    var w = -_valueTypes.Vec3.dot(ab, e);

    if (w < 0.0 || v + w > det) {
      return 0;
    }

    if (outPt) {
      var invDet = 1.0 / det;
      v *= invDet;
      w *= invDet;
      var u = 1.0 - v - w; // outPt = u*a + v*d + w*c;

      _valueTypes.Vec3.set(outPt, triangle.a.x * u + triangle.b.x * v + triangle.c.x * w, triangle.a.y * u + triangle.b.y * v + triangle.c.y * w, triangle.a.z * u + triangle.b.z * v + triangle.c.z * w);
    }

    return 1;
  };
}();
/**
 * !#en line-quad intersect<br/>
 * !#zh 线段与四边形的相交性检测。
 * @static
 * @method line_quad
 * @param {Vec3} p A point on a line segment
 * @param {Vec3} q Another point on the line segment
 * @param {Vec3} a Quadrilateral point a
 * @param {Vec3} b Quadrilateral point b
 * @param {Vec3} c Quadrilateral point c
 * @param {Vec3} d Quadrilateral point d
 * @param {Vec3} outPt optional, The intersection point
 * @return {number} 0 or not 0
 */


var line_quad = function () {
  var pq = new _valueTypes.Vec3(0, 0, 0);
  var pa = new _valueTypes.Vec3(0, 0, 0);
  var pb = new _valueTypes.Vec3(0, 0, 0);
  var pc = new _valueTypes.Vec3(0, 0, 0);
  var pd = new _valueTypes.Vec3(0, 0, 0);
  var m = new _valueTypes.Vec3(0, 0, 0);
  var tmp = new _valueTypes.Vec3(0, 0, 0);
  return function (p, q, a, b, c, d, outPt) {
    _valueTypes.Vec3.subtract(pq, q, p);

    _valueTypes.Vec3.subtract(pa, a, p);

    _valueTypes.Vec3.subtract(pb, b, p);

    _valueTypes.Vec3.subtract(pc, c, p); // Determine which triangle to test against by testing against diagonal first


    _valueTypes.Vec3.cross(m, pc, pq);

    var v = _valueTypes.Vec3.dot(pa, m);

    if (v >= 0) {
      // Test intersection against triangle abc
      var u = -_valueTypes.Vec3.dot(pb, m);

      if (u < 0) {
        return 0;
      }

      var w = _valueTypes.Vec3.dot(_valueTypes.Vec3.cross(tmp, pq, pb), pa);

      if (w < 0) {
        return 0;
      } // outPt = u*a + v*b + w*c;


      if (outPt) {
        var denom = 1.0 / (u + v + w);
        u *= denom;
        v *= denom;
        w *= denom;

        _valueTypes.Vec3.set(outPt, a.x * u + b.x * v + c.x * w, a.y * u + b.y * v + c.y * w, a.z * u + b.z * v + c.z * w);
      }
    } else {
      // Test intersection against triangle dac
      _valueTypes.Vec3.subtract(pd, d, p);

      var _u = _valueTypes.Vec3.dot(pd, m);

      if (_u < 0) {
        return 0;
      }

      var _w = _valueTypes.Vec3.dot(_valueTypes.Vec3.cross(tmp, pq, pa), pd);

      if (_w < 0) {
        return 0;
      } // outPt = u*a + v*d + w*c;


      if (outPt) {
        v = -v;

        var _denom = 1.0 / (_u + v + _w);

        _u *= _denom;
        v *= _denom;
        _w *= _denom;

        _valueTypes.Vec3.set(outPt, a.x * _u + d.x * v + c.x * _w, a.y * _u + d.y * v + c.y * _w, a.z * _u + d.z * v + c.z * _w);
      }
    }

    return 1;
  };
}();
/**
 * !#en ray-sphere intersect<br/>
 * !#zh 射线和球的相交性检测。
 * @static
 * @method ray_sphere
 * @param {geomUtils.Ray} ray
 * @param {geomUtils.Sphere} sphere
 * @return {number} 0 or not 0
 */


var ray_sphere = function () {
  var e = new _valueTypes.Vec3(0, 0, 0);
  return function (ray, sphere) {
    var r = sphere.radius;
    var c = sphere.center;
    var o = ray.o;
    var d = ray.d;
    var rSq = r * r;

    _valueTypes.Vec3.subtract(e, c, o);

    var eSq = e.lengthSqr();

    var aLength = _valueTypes.Vec3.dot(e, d); // assume ray direction already normalized


    var fSq = rSq - (eSq - aLength * aLength);

    if (fSq < 0) {
      return 0;
    }

    var f = Math.sqrt(fSq);
    var t = eSq < rSq ? aLength + f : aLength - f;

    if (t < 0) {
      return 0;
    }

    return t;
  };
}();
/**
 * !#en ray-aabb intersect<br/>
 * !#zh 射线和轴对齐包围盒的相交性检测。
 * @static
 * @method ray_aabb
 * @param {geomUtils.Ray} ray
 * @param {geomUtils.Aabb} aabb Align the axis around the box
 * @return {number} 0 or not 0
 */


var ray_aabb = function () {
  var min = new _valueTypes.Vec3();
  var max = new _valueTypes.Vec3();
  return function (ray, aabb) {
    var o = ray.o,
        d = ray.d;
    var ix = 1 / d.x,
        iy = 1 / d.y,
        iz = 1 / d.z;

    _valueTypes.Vec3.subtract(min, aabb.center, aabb.halfExtents);

    _valueTypes.Vec3.add(max, aabb.center, aabb.halfExtents);

    var t1 = (min.x - o.x) * ix;
    var t2 = (max.x - o.x) * ix;
    var t3 = (min.y - o.y) * iy;
    var t4 = (max.y - o.y) * iy;
    var t5 = (min.z - o.z) * iz;
    var t6 = (max.z - o.z) * iz;
    var tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
    var tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));

    if (tmax < 0 || tmin > tmax) {
      return 0;
    }

    ;
    return tmin;
  };
}(); // adapt to old api


var rayAabb = ray_aabb;
/**
 * !#en ray-obb intersect<br/>
 * !#zh 射线和方向包围盒的相交性检测。
 * @static
 * @method ray_obb
 * @param {geomUtils.Ray} ray
 * @param {geomUtils.Obb} obb Direction box
 * @return {number} 0 or or 0
 */

var ray_obb = function () {
  var center = new _valueTypes.Vec3();
  var o = new _valueTypes.Vec3();
  var d = new _valueTypes.Vec3();
  var X = new _valueTypes.Vec3();
  var Y = new _valueTypes.Vec3();
  var Z = new _valueTypes.Vec3();
  var p = new _valueTypes.Vec3();
  var size = new Array(3);
  var f = new Array(3);
  var e = new Array(3);
  var t = new Array(6);
  return function (ray, obb) {
    size[0] = obb.halfExtents.x;
    size[1] = obb.halfExtents.y;
    size[2] = obb.halfExtents.z;
    center = obb.center;
    o = ray.o;
    d = ray.d;
    var obbm = obb.orientation.m;

    _valueTypes.Vec3.set(X, obbm[0], obbm[1], obbm[2]);

    _valueTypes.Vec3.set(Y, obbm[3], obbm[4], obbm[5]);

    _valueTypes.Vec3.set(Z, obbm[6], obbm[7], obbm[8]);

    _valueTypes.Vec3.subtract(p, center, o); // The cos values of the ray on the X, Y, Z


    f[0] = _valueTypes.Vec3.dot(X, d);
    f[1] = _valueTypes.Vec3.dot(Y, d);
    f[2] = _valueTypes.Vec3.dot(Z, d); // The projection length of P on X, Y, Z

    e[0] = _valueTypes.Vec3.dot(X, p);
    e[1] = _valueTypes.Vec3.dot(Y, p);
    e[2] = _valueTypes.Vec3.dot(Z, p);

    for (var i = 0; i < 3; ++i) {
      if (f[i] === 0) {
        if (-e[i] - size[i] > 0 || -e[i] + size[i] < 0) {
          return 0;
        } // Avoid div by 0!


        f[i] = 0.0000001;
      } // min


      t[i * 2 + 0] = (e[i] + size[i]) / f[i]; // max

      t[i * 2 + 1] = (e[i] - size[i]) / f[i];
    }

    var tmin = Math.max(Math.max(Math.min(t[0], t[1]), Math.min(t[2], t[3])), Math.min(t[4], t[5]));
    var tmax = Math.min(Math.min(Math.max(t[0], t[1]), Math.max(t[2], t[3])), Math.max(t[4], t[5]));

    if (tmax < 0 || tmin > tmax || tmin < 0) {
      return 0;
    }

    return tmin;
  };
}();
/**
 * !#en aabb-aabb intersect<br/>
 * !#zh 轴对齐包围盒和轴对齐包围盒的相交性检测。
 * @static
 * @method aabb_aabb
 * @param {geomUtils.Aabb} aabb1 Axis alignment surrounds box 1
 * @param {geomUtils.Aabb} aabb2 Axis alignment surrounds box 2
 * @return {number} 0 or not 0
 */


var aabb_aabb = function () {
  var aMin = new _valueTypes.Vec3();
  var aMax = new _valueTypes.Vec3();
  var bMin = new _valueTypes.Vec3();
  var bMax = new _valueTypes.Vec3();
  return function (aabb1, aabb2) {
    _valueTypes.Vec3.subtract(aMin, aabb1.center, aabb1.halfExtents);

    _valueTypes.Vec3.add(aMax, aabb1.center, aabb1.halfExtents);

    _valueTypes.Vec3.subtract(bMin, aabb2.center, aabb2.halfExtents);

    _valueTypes.Vec3.add(bMax, aabb2.center, aabb2.halfExtents);

    return aMin.x <= bMax.x && aMax.x >= bMin.x && aMin.y <= bMax.y && aMax.y >= bMin.y && aMin.z <= bMax.z && aMax.z >= bMin.z;
  };
}();

function getAABBVertices(min, max, out) {
  _valueTypes.Vec3.set(out[0], min.x, max.y, max.z);

  _valueTypes.Vec3.set(out[1], min.x, max.y, min.z);

  _valueTypes.Vec3.set(out[2], min.x, min.y, max.z);

  _valueTypes.Vec3.set(out[3], min.x, min.y, min.z);

  _valueTypes.Vec3.set(out[4], max.x, max.y, max.z);

  _valueTypes.Vec3.set(out[5], max.x, max.y, min.z);

  _valueTypes.Vec3.set(out[6], max.x, min.y, max.z);

  _valueTypes.Vec3.set(out[7], max.x, min.y, min.z);
}

function getOBBVertices(c, e, a1, a2, a3, out) {
  _valueTypes.Vec3.set(out[0], c.x + a1.x * e.x + a2.x * e.y + a3.x * e.z, c.y + a1.y * e.x + a2.y * e.y + a3.y * e.z, c.z + a1.z * e.x + a2.z * e.y + a3.z * e.z);

  _valueTypes.Vec3.set(out[1], c.x - a1.x * e.x + a2.x * e.y + a3.x * e.z, c.y - a1.y * e.x + a2.y * e.y + a3.y * e.z, c.z - a1.z * e.x + a2.z * e.y + a3.z * e.z);

  _valueTypes.Vec3.set(out[2], c.x + a1.x * e.x - a2.x * e.y + a3.x * e.z, c.y + a1.y * e.x - a2.y * e.y + a3.y * e.z, c.z + a1.z * e.x - a2.z * e.y + a3.z * e.z);

  _valueTypes.Vec3.set(out[3], c.x + a1.x * e.x + a2.x * e.y - a3.x * e.z, c.y + a1.y * e.x + a2.y * e.y - a3.y * e.z, c.z + a1.z * e.x + a2.z * e.y - a3.z * e.z);

  _valueTypes.Vec3.set(out[4], c.x - a1.x * e.x - a2.x * e.y - a3.x * e.z, c.y - a1.y * e.x - a2.y * e.y - a3.y * e.z, c.z - a1.z * e.x - a2.z * e.y - a3.z * e.z);

  _valueTypes.Vec3.set(out[5], c.x + a1.x * e.x - a2.x * e.y - a3.x * e.z, c.y + a1.y * e.x - a2.y * e.y - a3.y * e.z, c.z + a1.z * e.x - a2.z * e.y - a3.z * e.z);

  _valueTypes.Vec3.set(out[6], c.x - a1.x * e.x + a2.x * e.y - a3.x * e.z, c.y - a1.y * e.x + a2.y * e.y - a3.y * e.z, c.z - a1.z * e.x + a2.z * e.y - a3.z * e.z);

  _valueTypes.Vec3.set(out[7], c.x - a1.x * e.x - a2.x * e.y + a3.x * e.z, c.y - a1.y * e.x - a2.y * e.y + a3.y * e.z, c.z - a1.z * e.x - a2.z * e.y + a3.z * e.z);
}

function getInterval(vertices, axis) {
  var min = _valueTypes.Vec3.dot(axis, vertices[0]),
      max = min;

  for (var i = 1; i < 8; ++i) {
    var projection = _valueTypes.Vec3.dot(axis, vertices[i]);

    min = projection < min ? projection : min;
    max = projection > max ? projection : max;
  }

  return [min, max];
}
/**
 * !#en aabb-obb intersect<br/>
 * !#zh 轴对齐包围盒和方向包围盒的相交性检测。
 * @static
 * @method aabb_obb
 * @param {geomUtils.Aabb} aabb Align the axis around the box
 * @param {geomUtils.Obb} obb Direction box
 * @return {number} 0 or not 0
 */


var aabb_obb = function () {
  var test = new Array(15);

  for (var i = 0; i < 15; i++) {
    test[i] = new _valueTypes.Vec3(0, 0, 0);
  }

  var vertices = new Array(8);
  var vertices2 = new Array(8);

  for (var _i2 = 0; _i2 < 8; _i2++) {
    vertices[_i2] = new _valueTypes.Vec3(0, 0, 0);
    vertices2[_i2] = new _valueTypes.Vec3(0, 0, 0);
  }

  var min = new _valueTypes.Vec3();
  var max = new _valueTypes.Vec3();
  return function (aabb, obb) {
    var obbm = obb.orientation.m;

    _valueTypes.Vec3.set(test[0], 1, 0, 0);

    _valueTypes.Vec3.set(test[1], 0, 1, 0);

    _valueTypes.Vec3.set(test[2], 0, 0, 1);

    _valueTypes.Vec3.set(test[3], obbm[0], obbm[1], obbm[2]);

    _valueTypes.Vec3.set(test[4], obbm[3], obbm[4], obbm[5]);

    _valueTypes.Vec3.set(test[5], obbm[6], obbm[7], obbm[8]);

    for (var _i3 = 0; _i3 < 3; ++_i3) {
      // Fill out rest of axis
      _valueTypes.Vec3.cross(test[6 + _i3 * 3 + 0], test[_i3], test[0]);

      _valueTypes.Vec3.cross(test[6 + _i3 * 3 + 1], test[_i3], test[1]);

      _valueTypes.Vec3.cross(test[6 + _i3 * 3 + 1], test[_i3], test[2]);
    }

    _valueTypes.Vec3.subtract(min, aabb.center, aabb.halfExtents);

    _valueTypes.Vec3.add(max, aabb.center, aabb.halfExtents);

    getAABBVertices(min, max, vertices);
    getOBBVertices(obb.center, obb.halfExtents, test[3], test[4], test[5], vertices2);

    for (var j = 0; j < 15; ++j) {
      var a = getInterval(vertices, test[j]);
      var b = getInterval(vertices2, test[j]);

      if (b[0] > a[1] || a[0] > b[1]) {
        return 0; // Seperating axis found
      }
    }

    return 1;
  };
}();
/**
 * !#en aabb-plane intersect<br/>
 * !#zh 轴对齐包围盒和平面的相交性检测。
 * @static
 * @method aabb_plane
 * @param {geomUtils.Aabb} aabb Align the axis around the box
 * @param {geomUtils.Plane} plane
 * @return {number} inside(back) = -1, outside(front) = 0, intersect = 1
 */


var aabb_plane = function aabb_plane(aabb, plane) {
  var r = aabb.halfExtents.x * Math.abs(plane.n.x) + aabb.halfExtents.y * Math.abs(plane.n.y) + aabb.halfExtents.z * Math.abs(plane.n.z);

  var dot = _valueTypes.Vec3.dot(plane.n, aabb.center);

  if (dot + r < plane.d) {
    return -1;
  } else if (dot - r > plane.d) {
    return 0;
  }

  return 1;
};
/**
 * !#en aabb-frustum intersect, faster but has false positive corner cases<br/>
 * !#zh 轴对齐包围盒和锥台相交性检测，速度快，但有错误情况。
 * @static
 * @method aabb_frustum
 * @param {geomUtils.Aabb} aabb Align the axis around the box
 * @param {geomUtils.Frustum} frustum
 * @return {number} 0 or not 0
 */


var aabb_frustum = function aabb_frustum(aabb, frustum) {
  for (var i = 0; i < frustum.planes.length; i++) {
    // frustum plane normal points to the inside
    if (aabb_plane(aabb, frustum.planes[i]) === -1) {
      return 0;
    }
  } // completely outside


  return 1;
}; // https://cesium.com/blog/2017/02/02/tighter-frustum-culling-and-why-you-may-want-to-disregard-it/

/**
 * !#en aabb-frustum intersect, handles most of the false positives correctly<br/>
 * !#zh 轴对齐包围盒和锥台相交性检测，正确处理大多数错误情况。
 * @static
 * @method aabb_frustum_accurate
 * @param {geomUtils.Aabb} aabb Align the axis around the box
 * @param {geomUtils.Frustum} frustum
 * @return {number}
 */


var aabb_frustum_accurate = function () {
  var tmp = new Array(8);
  var out1 = 0,
      out2 = 0;

  for (var i = 0; i < tmp.length; i++) {
    tmp[i] = new _valueTypes.Vec3(0, 0, 0);
  }

  return function (aabb, frustum) {
    var result = 0,
        intersects = false; // 1. aabb inside/outside frustum test

    for (var _i4 = 0; _i4 < frustum.planes.length; _i4++) {
      result = aabb_plane(aabb, frustum.planes[_i4]); // frustum plane normal points to the inside

      if (result === -1) {
        return 0;
      } // completely outside
      else if (result === 1) {
          intersects = true;
        }
    }

    if (!intersects) {
      return 1;
    } // completely inside
    // in case of false positives
    // 2. frustum inside/outside aabb test


    for (var _i5 = 0; _i5 < frustum.vertices.length; _i5++) {
      _valueTypes.Vec3.subtract(tmp[_i5], frustum.vertices[_i5], aabb.center);
    }

    out1 = 0, out2 = 0;

    for (var _i6 = 0; _i6 < frustum.vertices.length; _i6++) {
      if (tmp[_i6].x > aabb.halfExtents.x) {
        out1++;
      } else if (tmp[_i6].x < -aabb.halfExtents.x) {
        out2++;
      }
    }

    if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
      return 0;
    }

    out1 = 0;
    out2 = 0;

    for (var _i7 = 0; _i7 < frustum.vertices.length; _i7++) {
      if (tmp[_i7].y > aabb.halfExtents.y) {
        out1++;
      } else if (tmp[_i7].y < -aabb.halfExtents.y) {
        out2++;
      }
    }

    if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
      return 0;
    }

    out1 = 0;
    out2 = 0;

    for (var _i8 = 0; _i8 < frustum.vertices.length; _i8++) {
      if (tmp[_i8].z > aabb.halfExtents.z) {
        out1++;
      } else if (tmp[_i8].z < -aabb.halfExtents.z) {
        out2++;
      }
    }

    if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
      return 0;
    }

    return 1;
  };
}();
/**
 * !#en obb-point intersect<br/>
 * !#zh 方向包围盒和点的相交性检测。
 * @static
 * @method obb_point
 * @param {geomUtils.Obb} obb Direction box
 * @param {geomUtils.Vec3} point
 * @return {boolean} true or false
 */


var obb_point = function () {
  var tmp = new _valueTypes.Vec3(0, 0, 0),
      m3 = new _valueTypes.Mat3();

  var lessThan = function lessThan(a, b) {
    return Math.abs(a.x) < b.x && Math.abs(a.y) < b.y && Math.abs(a.z) < b.z;
  };

  return function (obb, point) {
    _valueTypes.Vec3.subtract(tmp, point, obb.center);

    _valueTypes.Vec3.transformMat3(tmp, tmp, _valueTypes.Mat3.transpose(m3, obb.orientation));

    return lessThan(tmp, obb.halfExtents);
  };
}();
/**
 * !#en obb-plane intersect<br/>
 * !#zh 方向包围盒和平面的相交性检测。
 * @static
 * @method obb_plane
 * @param {geomUtils.Obb} obb Direction box
 * @param {geomUtils.Plane} plane
 * @return {number} inside(back) = -1, outside(front) = 0, intersect = 1
 */


var obb_plane = function () {
  var absDot = function absDot(n, x, y, z) {
    return Math.abs(n.x * x + n.y * y + n.z * z);
  };

  return function (obb, plane) {
    var obbm = obb.orientation.m; // Real-Time Collision Detection, Christer Ericson, p. 163.

    var r = obb.halfExtents.x * absDot(plane.n, obbm[0], obbm[1], obbm[2]) + obb.halfExtents.y * absDot(plane.n, obbm[3], obbm[4], obbm[5]) + obb.halfExtents.z * absDot(plane.n, obbm[6], obbm[7], obbm[8]);

    var dot = _valueTypes.Vec3.dot(plane.n, obb.center);

    if (dot + r < plane.d) {
      return -1;
    } else if (dot - r > plane.d) {
      return 0;
    }

    return 1;
  };
}();
/**
 * !#en obb-frustum intersect, faster but has false positive corner cases<br/>
 * !#zh 方向包围盒和锥台相交性检测，速度快，但有错误情况。
 * @static
 * @method obb_frustum
 * @param {geomUtils.Obb} obb Direction box
 * @param {geomUtils.Frustum} frustum
 * @return {number} 0 or not 0
 */


var obb_frustum = function obb_frustum(obb, frustum) {
  for (var i = 0; i < frustum.planes.length; i++) {
    // frustum plane normal points to the inside
    if (obb_plane(obb, frustum.planes[i]) === -1) {
      return 0;
    }
  } // completely outside


  return 1;
}; // https://cesium.com/blog/2017/02/02/tighter-frustum-culling-and-why-you-may-want-to-disregard-it/

/**
 * !#en obb-frustum intersect, handles most of the false positives correctly<br/>
 * !#zh 方向包围盒和锥台相交性检测，正确处理大多数错误情况。
 * @static
 * @method obb_frustum_accurate
 * @param {geomUtils.Obb} obb Direction box
 * @param {geomUtils.Frustum} frustum
 * @return {number} 0 or not 0
 */


var obb_frustum_accurate = function () {
  var tmp = new Array(8);
  var dist = 0,
      out1 = 0,
      out2 = 0;

  for (var i = 0; i < tmp.length; i++) {
    tmp[i] = new _valueTypes.Vec3(0, 0, 0);
  }

  var dot = function dot(n, x, y, z) {
    return n.x * x + n.y * y + n.z * z;
  };

  return function (obb, frustum) {
    var result = 0,
        intersects = false; // 1. obb inside/outside frustum test

    for (var _i9 = 0; _i9 < frustum.planes.length; _i9++) {
      result = obb_plane(obb, frustum.planes[_i9]); // frustum plane normal points to the inside

      if (result === -1) {
        return 0;
      } // completely outside
      else if (result === 1) {
          intersects = true;
        }
    }

    if (!intersects) {
      return 1;
    } // completely inside
    // in case of false positives
    // 2. frustum inside/outside obb test


    for (var _i10 = 0; _i10 < frustum.vertices.length; _i10++) {
      _valueTypes.Vec3.subtract(tmp[_i10], frustum.vertices[_i10], obb.center);
    }

    out1 = 0, out2 = 0;
    var obbm = obb.orientation.m;

    for (var _i11 = 0; _i11 < frustum.vertices.length; _i11++) {
      dist = dot(tmp[_i11], obbm[0], obbm[1], obbm[2]);

      if (dist > obb.halfExtents.x) {
        out1++;
      } else if (dist < -obb.halfExtents.x) {
        out2++;
      }
    }

    if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
      return 0;
    }

    out1 = 0;
    out2 = 0;

    for (var _i12 = 0; _i12 < frustum.vertices.length; _i12++) {
      dist = dot(tmp[_i12], obbm[3], obbm[4], obbm[5]);

      if (dist > obb.halfExtents.y) {
        out1++;
      } else if (dist < -obb.halfExtents.y) {
        out2++;
      }
    }

    if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
      return 0;
    }

    out1 = 0;
    out2 = 0;

    for (var _i13 = 0; _i13 < frustum.vertices.length; _i13++) {
      dist = dot(tmp[_i13], obbm[6], obbm[7], obbm[8]);

      if (dist > obb.halfExtents.z) {
        out1++;
      } else if (dist < -obb.halfExtents.z) {
        out2++;
      }
    }

    if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
      return 0;
    }

    return 1;
  };
}();
/**
 * !#en obb-obb intersect<br/>
 * !#zh 方向包围盒和方向包围盒的相交性检测。
 * @static
 * @method obb_obb
 * @param {geomUtils.Obb} obb1 Direction box1
 * @param {geomUtils.Obb} obb2 Direction box2
 * @return {number} 0 or not 0
 */


var obb_obb = function () {
  var test = new Array(15);

  for (var i = 0; i < 15; i++) {
    test[i] = new _valueTypes.Vec3(0, 0, 0);
  }

  var vertices = new Array(8);
  var vertices2 = new Array(8);

  for (var _i14 = 0; _i14 < 8; _i14++) {
    vertices[_i14] = new _valueTypes.Vec3(0, 0, 0);
    vertices2[_i14] = new _valueTypes.Vec3(0, 0, 0);
  }

  return function (obb1, obb2) {
    var obb1m = obb1.orientation.m;
    var obb2m = obb2.orientation.m;

    _valueTypes.Vec3.set(test[0], obb1m[0], obb1m[1], obb1m[2]);

    _valueTypes.Vec3.set(test[1], obb1m[3], obb1m[4], obb1m[5]);

    _valueTypes.Vec3.set(test[2], obb1m[6], obb1m[7], obb1m[8]);

    _valueTypes.Vec3.set(test[3], obb2m[0], obb2m[1], obb2m[2]);

    _valueTypes.Vec3.set(test[4], obb2m[3], obb2m[4], obb2m[5]);

    _valueTypes.Vec3.set(test[5], obb2m[6], obb2m[7], obb2m[8]);

    for (var _i15 = 0; _i15 < 3; ++_i15) {
      // Fill out rest of axis
      _valueTypes.Vec3.cross(test[6 + _i15 * 3 + 0], test[_i15], test[0]);

      _valueTypes.Vec3.cross(test[6 + _i15 * 3 + 1], test[_i15], test[1]);

      _valueTypes.Vec3.cross(test[6 + _i15 * 3 + 1], test[_i15], test[2]);
    }

    getOBBVertices(obb1.center, obb1.halfExtents, test[0], test[1], test[2], vertices);
    getOBBVertices(obb2.center, obb2.halfExtents, test[3], test[4], test[5], vertices2);

    for (var _i16 = 0; _i16 < 15; ++_i16) {
      var a = getInterval(vertices, test[_i16]);
      var b = getInterval(vertices2, test[_i16]);

      if (b[0] > a[1] || a[0] > b[1]) {
        return 0; // Seperating axis found
      }
    }

    return 1;
  };
}();
/**
 * !#en phere-plane intersect, not necessarily faster than obb-plane<br/>
 * due to the length calculation of the plane normal to factor out<br/>
 * the unnomalized plane distance<br/>
 * !#zh 球与平面的相交性检测。
 * @static
 * @method sphere_plane
 * @param {geomUtils.Sphere} sphere
 * @param {geomUtils.Plane} plane
 * @return {number} inside(back) = -1, outside(front) = 0, intersect = 1
 */


var sphere_plane = function sphere_plane(sphere, plane) {
  var dot = _valueTypes.Vec3.dot(plane.n, sphere.center);

  var r = sphere.radius * plane.n.length();

  if (dot + r < plane.d) {
    return -1;
  } else if (dot - r > plane.d) {
    return 0;
  }

  return 1;
};
/**
 * !#en sphere-frustum intersect, faster but has false positive corner cases<br/>
 * !#zh 球和锥台的相交性检测，速度快，但有错误情况。
 * @static
 * @method sphere_frustum
 * @param {geomUtils.Sphere} sphere
 * @param {geomUtils.Frustum} frustum
 * @return {number} 0 or not 0
 */


var sphere_frustum = function sphere_frustum(sphere, frustum) {
  for (var i = 0; i < frustum.planes.length; i++) {
    // frustum plane normal points to the inside
    if (sphere_plane(sphere, frustum.planes[i]) === -1) {
      return 0;
    }
  } // completely outside


  return 1;
}; // https://stackoverflow.com/questions/20912692/view-frustum-culling-corner-cases

/**
 * !#en sphere-frustum intersect, handles the false positives correctly<br/>
 * !#zh 球和锥台的相交性检测，正确处理大多数错误情况。
 * @static
 * @method sphere_frustum_accurate
 * @param {geomUtils.Sphere} sphere
 * @param {geomUtils.Frustum} frustum
 * @return {number} 0 or not 0
 */


var sphere_frustum_accurate = function () {
  var pt = new _valueTypes.Vec3(0, 0, 0),
      map = [1, -1, 1, -1, 1, -1];
  return function (sphere, frustum) {
    for (var i = 0; i < 6; i++) {
      var plane = frustum.planes[i];
      var r = sphere.radius,
          c = sphere.center;
      var n = plane.n,
          d = plane.d;

      var dot = _valueTypes.Vec3.dot(n, c); // frustum plane normal points to the inside


      if (dot + r < d) {
        return 0;
      } // completely outside
      else if (dot - r > d) {
          continue;
        } // in case of false positives
      // has false negatives, still working on it


      _valueTypes.Vec3.add(pt, c, _valueTypes.Vec3.multiplyScalar(pt, n, r));

      for (var j = 0; j < 6; j++) {
        if (j === i || j === i + map[i]) {
          continue;
        }

        var test = frustum.planes[j];

        if (_valueTypes.Vec3.dot(test.n, pt) < test.d) {
          return 0;
        }
      }
    }

    return 1;
  };
}();
/**
 * !#en sphere-sphere intersect<br/>
 * !#zh 球和球的相交性检测。
 * @static
 * @method sphere_sphere
 * @param {geomUtils.Sphere} sphere0
 * @param {geomUtils.Sphere} sphere1
 * @return {boolean} true or false
 */


var sphere_sphere = function sphere_sphere(sphere0, sphere1) {
  var r = sphere0.radius + sphere1.radius;
  return _valueTypes.Vec3.squaredDistance(sphere0.center, sphere1.center) < r * r;
};
/**
 * !#en sphere-aabb intersect<br/>
 * !#zh 球和轴对齐包围盒的相交性检测。
 * @static
 * @method sphere_aabb
 * @param {geomUtils.Sphere} sphere
 * @param {geomUtils.Aabb} aabb
 * @return {boolean} true or false
 */


var sphere_aabb = function () {
  var pt = new _valueTypes.Vec3();
  return function (sphere, aabb) {
    distance.pt_point_aabb(pt, sphere.center, aabb);
    return _valueTypes.Vec3.squaredDistance(sphere.center, pt) < sphere.radius * sphere.radius;
  };
}();
/**
 * !#en sphere-obb intersect<br/>
 * !#zh 球和方向包围盒的相交性检测。
 * @static
 * @method sphere_obb
 * @param {geomUtils.Sphere} sphere
 * @param {geomUtils.Obb} obb
 * @return {boolean} true or false
 */


var sphere_obb = function () {
  var pt = new _valueTypes.Vec3();
  return function (sphere, obb) {
    distance.pt_point_obb(pt, sphere.center, obb);
    return _valueTypes.Vec3.squaredDistance(sphere.center, pt) < sphere.radius * sphere.radius;
  };
}();

var intersect = {
  // old api
  rayAabb: rayAabb,
  rayMesh: rayMesh,
  raycast: raycast,
  rayTriangle: rayTriangle,
  ray_sphere: ray_sphere,
  ray_aabb: ray_aabb,
  ray_obb: ray_obb,
  ray_plane: ray_plane,
  ray_triangle: ray_triangle,
  line_plane: line_plane,
  line_triangle: line_triangle,
  line_quad: line_quad,
  sphere_sphere: sphere_sphere,
  sphere_aabb: sphere_aabb,
  sphere_obb: sphere_obb,
  sphere_plane: sphere_plane,
  sphere_frustum: sphere_frustum,
  sphere_frustum_accurate: sphere_frustum_accurate,
  aabb_aabb: aabb_aabb,
  aabb_obb: aabb_obb,
  aabb_plane: aabb_plane,
  aabb_frustum: aabb_frustum,
  aabb_frustum_accurate: aabb_frustum_accurate,
  obb_obb: obb_obb,
  obb_plane: obb_plane,
  obb_frustum: obb_frustum,
  obb_frustum_accurate: obb_frustum_accurate,
  obb_point: obb_point,

  /**
   * !#en
   * The intersection detection of g1 and g2 can fill in the shape in the basic geometry.
   * !#zh
   * g1 和 g2 的相交性检测，可填入基础几何中的形状。
   * @static
   * @method resolve
   * @param g1 Geometry 1
   * @param g2 Geometry 2
   * @param outPt optional, Intersection point. (note: only partial shape detection with this return value)
   */
  resolve: function resolve(g1, g2, outPt) {
    if (outPt === void 0) {
      outPt = null;
    }

    var type1 = g1._type,
        type2 = g2._type;
    var resolver = this[type1 | type2];

    if (type1 < type2) {
      return resolver(g1, g2, outPt);
    } else {
      return resolver(g2, g1, outPt);
    }
  }
};
intersect[_enums["default"].SHAPE_RAY | _enums["default"].SHAPE_SPHERE] = ray_sphere;
intersect[_enums["default"].SHAPE_RAY | _enums["default"].SHAPE_AABB] = ray_aabb;
intersect[_enums["default"].SHAPE_RAY | _enums["default"].SHAPE_OBB] = ray_obb;
intersect[_enums["default"].SHAPE_RAY | _enums["default"].SHAPE_PLANE] = ray_plane;
intersect[_enums["default"].SHAPE_RAY | _enums["default"].SHAPE_TRIANGLE] = ray_triangle;
intersect[_enums["default"].SHAPE_LINE | _enums["default"].SHAPE_PLANE] = line_plane;
intersect[_enums["default"].SHAPE_LINE | _enums["default"].SHAPE_TRIANGLE] = line_triangle;
intersect[_enums["default"].SHAPE_SPHERE] = sphere_sphere;
intersect[_enums["default"].SHAPE_SPHERE | _enums["default"].SHAPE_AABB] = sphere_aabb;
intersect[_enums["default"].SHAPE_SPHERE | _enums["default"].SHAPE_OBB] = sphere_obb;
intersect[_enums["default"].SHAPE_SPHERE | _enums["default"].SHAPE_PLANE] = sphere_plane;
intersect[_enums["default"].SHAPE_SPHERE | _enums["default"].SHAPE_FRUSTUM] = sphere_frustum;
intersect[_enums["default"].SHAPE_SPHERE | _enums["default"].SHAPE_FRUSTUM_ACCURATE] = sphere_frustum_accurate;
intersect[_enums["default"].SHAPE_AABB] = aabb_aabb;
intersect[_enums["default"].SHAPE_AABB | _enums["default"].SHAPE_OBB] = aabb_obb;
intersect[_enums["default"].SHAPE_AABB | _enums["default"].SHAPE_PLANE] = aabb_plane;
intersect[_enums["default"].SHAPE_AABB | _enums["default"].SHAPE_FRUSTUM] = aabb_frustum;
intersect[_enums["default"].SHAPE_AABB | _enums["default"].SHAPE_FRUSTUM_ACCURATE] = aabb_frustum_accurate;
intersect[_enums["default"].SHAPE_OBB] = obb_obb;
intersect[_enums["default"].SHAPE_OBB | _enums["default"].SHAPE_PLANE] = obb_plane;
intersect[_enums["default"].SHAPE_OBB | _enums["default"].SHAPE_FRUSTUM] = obb_frustum;
intersect[_enums["default"].SHAPE_OBB | _enums["default"].SHAPE_FRUSTUM_ACCURATE] = obb_frustum_accurate;
var _default = intersect;
exports["default"] = _default;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2dlb20tdXRpbHMvaW50ZXJzZWN0LnRzIl0sIm5hbWVzIjpbInJheV9tZXNoIiwidHJpIiwidHJpYW5nbGUiLCJjcmVhdGUiLCJtaW5EaXN0IiwiSW5maW5pdHkiLCJnZXRWZWMzIiwib3V0IiwiZGF0YSIsImlkeCIsInN0cmlkZSIsIlZlYzMiLCJzZXQiLCJyYXkiLCJtZXNoIiwic3ViTWVzaGVzIiwiX3N1Yk1lc2hlcyIsImkiLCJsZW5ndGgiLCJfcHJpbWl0aXZlVHlwZSIsImdmeCIsIlBUX1RSSUFOR0xFUyIsInN1YkRhdGEiLCJfc3ViRGF0YXMiLCJwb3NEYXRhIiwiX2dldEF0dHJNZXNoRGF0YSIsIkFUVFJfUE9TSVRJT04iLCJpRGF0YSIsImdldElEYXRhIiwiVWludDE2QXJyYXkiLCJmb3JtYXQiLCJ2Zm0iLCJmbXQiLCJlbGVtZW50IiwibnVtIiwiYSIsImIiLCJjIiwiZGlzdCIsInJheV90cmlhbmdsZSIsInJheU1lc2giLCJyYXlfY2FzdCIsInRyYXZlcnNhbCIsIm5vZGUiLCJjYiIsImNoaWxkcmVuIiwiY2hpbGQiLCJjbXAiLCJkaXN0YW5jZSIsInRyYW5zZm9ybU1hdDROb3JtYWwiLCJtIiwibW0iLCJ4IiwieSIsInoiLCJyaHciLCJyZXN1bHRzUG9vbCIsIlJlY3ljbGVQb29sIiwicmVzdWx0cyIsIm5vZGVBYWJiIiwiYWFiYiIsIm1pblBvcyIsIm1heFBvcyIsIm1vZGVsUmF5IiwibTRfMSIsImNjIiwibWF0NCIsIm00XzIiLCJkIiwiZGlzdGFuY2VWYWxpZCIsInJvb3QiLCJ3b3JsZFJheSIsImhhbmRsZXIiLCJmaWx0ZXIiLCJyZXNldCIsImRpcmVjdG9yIiwiZ2V0U2NlbmUiLCJNYXQ0IiwiaW52ZXJ0IiwiZ2V0V29ybGRNYXRyaXgiLCJ0cmFuc2Zvcm1NYXQ0IiwibyIsIm5vcm1hbGl6ZSIsImNvbXBvbmVudCIsIl9yZW5kZXJDb21wb25lbnQiLCJNZXNoUmVuZGVyZXIiLCJyYXlfYWFiYiIsIl9ib3VuZGluZ0JveCIsIndpZHRoIiwiaGVpZ2h0IiwiYW5jaG9yWCIsImFuY2hvclkiLCJmcm9tUG9pbnRzIiwic2NhbGUiLCJyZXMiLCJhZGQiLCJtYWciLCJwdXNoIiwic29ydCIsInJheWNhc3QiLCJyYXlfcGxhbmUiLCJwdCIsInBsYW5lIiwiZGVub20iLCJkb3QiLCJuIiwiTWF0aCIsImFicyIsIk51bWJlciIsIkVQU0lMT04iLCJtdWx0aXBseVNjYWxhciIsInQiLCJzdWJ0cmFjdCIsImxpbmVfcGxhbmUiLCJhYiIsImxpbmUiLCJlIiwicyIsImFjIiwicHZlYyIsInR2ZWMiLCJxdmVjIiwiZG91YmxlU2lkZWQiLCJjcm9zcyIsImRldCIsImludl9kZXQiLCJ1IiwidiIsInJheVRyaWFuZ2xlIiwibGluZV90cmlhbmdsZSIsInFwIiwiYXAiLCJvdXRQdCIsInciLCJpbnZEZXQiLCJsaW5lX3F1YWQiLCJwcSIsInBhIiwicGIiLCJwYyIsInBkIiwidG1wIiwicCIsInEiLCJyYXlfc3BoZXJlIiwic3BoZXJlIiwiciIsInJhZGl1cyIsImNlbnRlciIsInJTcSIsImVTcSIsImxlbmd0aFNxciIsImFMZW5ndGgiLCJmU3EiLCJmIiwic3FydCIsIm1pbiIsIm1heCIsIml4IiwiaXkiLCJpeiIsImhhbGZFeHRlbnRzIiwidDEiLCJ0MiIsInQzIiwidDQiLCJ0NSIsInQ2IiwidG1pbiIsInRtYXgiLCJyYXlBYWJiIiwicmF5X29iYiIsIlgiLCJZIiwiWiIsInNpemUiLCJBcnJheSIsIm9iYiIsIm9iYm0iLCJvcmllbnRhdGlvbiIsImFhYmJfYWFiYiIsImFNaW4iLCJhTWF4IiwiYk1pbiIsImJNYXgiLCJhYWJiMSIsImFhYmIyIiwiZ2V0QUFCQlZlcnRpY2VzIiwiZ2V0T0JCVmVydGljZXMiLCJhMSIsImEyIiwiYTMiLCJnZXRJbnRlcnZhbCIsInZlcnRpY2VzIiwiYXhpcyIsInByb2plY3Rpb24iLCJhYWJiX29iYiIsInRlc3QiLCJ2ZXJ0aWNlczIiLCJqIiwiYWFiYl9wbGFuZSIsImFhYmJfZnJ1c3R1bSIsImZydXN0dW0iLCJwbGFuZXMiLCJhYWJiX2ZydXN0dW1fYWNjdXJhdGUiLCJvdXQxIiwib3V0MiIsInJlc3VsdCIsImludGVyc2VjdHMiLCJvYmJfcG9pbnQiLCJtMyIsIk1hdDMiLCJsZXNzVGhhbiIsInBvaW50IiwidHJhbnNmb3JtTWF0MyIsInRyYW5zcG9zZSIsIm9iYl9wbGFuZSIsImFic0RvdCIsIm9iYl9mcnVzdHVtIiwib2JiX2ZydXN0dW1fYWNjdXJhdGUiLCJvYmJfb2JiIiwib2JiMSIsIm9iYjIiLCJvYmIxbSIsIm9iYjJtIiwic3BoZXJlX3BsYW5lIiwic3BoZXJlX2ZydXN0dW0iLCJzcGhlcmVfZnJ1c3R1bV9hY2N1cmF0ZSIsIm1hcCIsInNwaGVyZV9zcGhlcmUiLCJzcGhlcmUwIiwic3BoZXJlMSIsInNxdWFyZWREaXN0YW5jZSIsInNwaGVyZV9hYWJiIiwicHRfcG9pbnRfYWFiYiIsInNwaGVyZV9vYmIiLCJwdF9wb2ludF9vYmIiLCJpbnRlcnNlY3QiLCJyZXNvbHZlIiwiZzEiLCJnMiIsInR5cGUxIiwiX3R5cGUiLCJ0eXBlMiIsInJlc29sdmVyIiwiZW51bXMiLCJTSEFQRV9SQVkiLCJTSEFQRV9TUEhFUkUiLCJTSEFQRV9BQUJCIiwiU0hBUEVfT0JCIiwiU0hBUEVfUExBTkUiLCJTSEFQRV9UUklBTkdMRSIsIlNIQVBFX0xJTkUiLCJTSEFQRV9GUlVTVFVNIiwiU0hBUEVfRlJVU1RVTV9BQ0NVUkFURSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFLQTs7QUFFQTs7Ozs7Ozs7QUF0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQWlCQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxRQUFRLEdBQUksWUFBWTtBQUMxQixN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QkFBTUUsWUFBTixHQUFxQkYsa0JBQU1TLHNCQUE1QixDQUFULEdBQStEM0IsdUJBQS9EO0FBRUFVLFNBQVMsQ0FBQ1Esa0JBQU1HLFVBQVAsQ0FBVCxHQUE4QnBFLFNBQTlCO0FBQ0F5RCxTQUFTLENBQUNRLGtCQUFNRyxVQUFOLEdBQW1CSCxrQkFBTUksU0FBMUIsQ0FBVCxHQUFnRHJELFFBQWhEO0FBQ0F5QyxTQUFTLENBQUNRLGtCQUFNRyxVQUFOLEdBQW1CSCxrQkFBTUssV0FBMUIsQ0FBVCxHQUFrRGxELFVBQWxEO0FBQ0FxQyxTQUFTLENBQUNRLGtCQUFNRyxVQUFOLEdBQW1CSCxrQkFBTVEsYUFBMUIsQ0FBVCxHQUFvRHBELFlBQXBEO0FBQ0FvQyxTQUFTLENBQUNRLGtCQUFNRyxVQUFOLEdBQW1CSCxrQkFBTVMsc0JBQTFCLENBQVQsR0FBNkRsRCxxQkFBN0Q7QUFFQWlDLFNBQVMsQ0FBQ1Esa0JBQU1JLFNBQVAsQ0FBVCxHQUE2QjdCLE9BQTdCO0FBQ0FpQixTQUFTLENBQUNRLGtCQUFNSSxTQUFOLEdBQWtCSixrQkFBTUssV0FBekIsQ0FBVCxHQUFpRGxDLFNBQWpEO0FBQ0FxQixTQUFTLENBQUNRLGtCQUFNSSxTQUFOLEdBQWtCSixrQkFBTVEsYUFBekIsQ0FBVCxHQUFtRG5DLFdBQW5EO0FBQ0FtQixTQUFTLENBQUNRLGtCQUFNSSxTQUFOLEdBQWtCSixrQkFBTVMsc0JBQXpCLENBQVQsR0FBNERuQyxvQkFBNUQ7ZUFFZWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBnZnggZnJvbSAnLi4vLi4vcmVuZGVyZXIvZ2Z4JztcbmltcG9ydCBSZWN5Y2xlUG9vbCBmcm9tICcuLi8uLi9yZW5kZXJlci9tZW1vcC9yZWN5Y2xlLXBvb2wnO1xuXG5pbXBvcnQgeyBNYXQzLCBWZWMzLCBNYXQ0IH0gZnJvbSAnLi4vdmFsdWUtdHlwZXMnO1xuaW1wb3J0IGFhYmIgZnJvbSAnLi9hYWJiJztcbmltcG9ydCAqIGFzIGRpc3RhbmNlIGZyb20gJy4vZGlzdGFuY2UnO1xuaW1wb3J0IGVudW1zIGZyb20gJy4vZW51bXMnO1xuaW1wb3J0IHsgZnJ1c3R1bSB9IGZyb20gJy4vZnJ1c3R1bSc7XG5pbXBvcnQgbGluZSBmcm9tICcuL2xpbmUnO1xuaW1wb3J0IG9iYiBmcm9tICcuL29iYic7XG5pbXBvcnQgcGxhbmUgZnJvbSAnLi9wbGFuZSc7XG5pbXBvcnQgcmF5IGZyb20gJy4vcmF5JztcbmltcG9ydCBzcGhlcmUgZnJvbSAnLi9zcGhlcmUnO1xuaW1wb3J0IHRyaWFuZ2xlIGZyb20gJy4vdHJpYW5nbGUnO1xuXG4vKipcbiAqIEBjbGFzcyBnZW9tVXRpbHMuaW50ZXJzZWN0XG4gKi9cblxuY29uc3QgcmF5X21lc2ggPSAoZnVuY3Rpb24gKCkge1xuICAgIGxldCB0cmkgPSB0cmlhbmdsZS5jcmVhdGUoKTtcbiAgICBsZXQgbWluRGlzdCA9IEluZmluaXR5O1xuXG4gICAgZnVuY3Rpb24gZ2V0VmVjMyAob3V0LCBkYXRhLCBpZHgsIHN0cmlkZSkge1xuICAgICAgICBWZWMzLnNldChvdXQsIGRhdGFbaWR4KnN0cmlkZV0sIGRhdGFbaWR4KnN0cmlkZSArIDFdLCBkYXRhW2lkeCpzdHJpZGUgKyAyXSk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBmdW5jdGlvbiAocmF5LCBtZXNoKSB7XG4gICAgICAgIG1pbkRpc3QgPSBJbmZpbml0eTtcbiAgICAgICAgbGV0IHN1Yk1lc2hlcyA9IG1lc2guX3N1Yk1lc2hlcztcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1Yk1lc2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHN1Yk1lc2hlc1tpXS5fcHJpbWl0aXZlVHlwZSAhPT0gZ2Z4LlBUX1RSSUFOR0xFUykgY29udGludWU7XG5cbiAgICAgICAgICAgIGxldCBzdWJEYXRhID0gKG1lc2guX3N1YkRhdGFzW2ldIHx8IG1lc2guX3N1YkRhdGFzWzBdKTtcbiAgICAgICAgICAgIGxldCBwb3NEYXRhID0gbWVzaC5fZ2V0QXR0ck1lc2hEYXRhKGksIGdmeC5BVFRSX1BPU0lUSU9OKTtcbiAgICAgICAgICAgIGxldCBpRGF0YSA9IHN1YkRhdGEuZ2V0SURhdGEoVWludDE2QXJyYXkpO1xuXG4gICAgICAgICAgICBsZXQgZm9ybWF0ID0gc3ViRGF0YS52Zm07XG4gICAgICAgICAgICBsZXQgZm10ID0gZm9ybWF0LmVsZW1lbnQoZ2Z4LkFUVFJfUE9TSVRJT04pO1xuICAgICAgICAgICAgbGV0IG51bSA9IGZtdC5udW07XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlEYXRhLmxlbmd0aDsgaSArPSAzKSB7XG4gICAgICAgICAgICAgICAgZ2V0VmVjMyh0cmkuYSwgcG9zRGF0YSwgaURhdGFbIGkgXSwgbnVtKTtcbiAgICAgICAgICAgICAgICBnZXRWZWMzKHRyaS5iLCBwb3NEYXRhLCBpRGF0YVtpKzFdLCBudW0pO1xuICAgICAgICAgICAgICAgIGdldFZlYzModHJpLmMsIHBvc0RhdGEsIGlEYXRhW2krMl0sIG51bSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgZGlzdCA9IHJheV90cmlhbmdsZShyYXksIHRyaSk7XG4gICAgICAgICAgICAgICAgaWYgKGRpc3QgPiAwICYmIGRpc3QgPCBtaW5EaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIG1pbkRpc3QgPSBkaXN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluRGlzdDtcbiAgICB9O1xufSkoKTtcblxuLy8gYWRhcHQgdG8gb2xkIGFwaVxuY29uc3QgcmF5TWVzaCA9IHJheV9tZXNoO1xuXG4vKiogXG4gKiAhI2VuXG4gKiBDaGVjayB3aGV0aGVyIHJheSBpbnRlcnNlY3Qgd2l0aCBub2Rlc1xuICogISN6aFxuICog5qOA5rWL5bCE57q/5piv5ZCm5LiO54mp5L2T5pyJ5Lqk6ZuGXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kIHJheV9jYXN0XG4gKiBAcGFyYW0ge05vZGV9IHJvb3QgLSBJZiByb290IGlzIG51bGwsIHRoZW4gdHJhdmVyc2FsIG5vZGVzIGZyb20gc2NlbmUgbm9kZVxuICogQHBhcmFtIHtnZW9tVXRpbHMuUmF5fSB3b3JsZFJheVxuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZmlsdGVyXG4gKiBAcmV0dXJuIHtbXX0gW3tub2RlLCBkaXN0YW5jZX1dXG4qL1xuY29uc3QgcmF5X2Nhc3QgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIHRyYXZlcnNhbCAobm9kZSwgY2IpIHtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcblxuICAgICAgICBmb3IgKHZhciBpID0gY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgdHJhdmVyc2FsKGNoaWxkLCBjYik7XG4gICAgICAgIH1cblxuICAgICAgICBjYihub2RlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbXAgKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEuZGlzdGFuY2UgLSBiLmRpc3RhbmNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybU1hdDROb3JtYWwgKG91dCwgYSwgbSkge1xuICAgICAgICBsZXQgbW0gPSBtLm07XG4gICAgICAgIGxldCB4ID0gYS54LCB5ID0gYS55LCB6ID0gYS56LFxuICAgICAgICAgICAgcmh3ID0gbW1bM10gKiB4ICsgbW1bN10gKiB5ICsgbW1bMTFdICogejtcbiAgICAgICAgcmh3ID0gcmh3ID8gMSAvIHJodyA6IDE7XG4gICAgICAgIG91dC54ID0gKG1tWzBdICogeCArIG1tWzRdICogeSArIG1tWzhdICogeikgKiByaHc7XG4gICAgICAgIG91dC55ID0gKG1tWzFdICogeCArIG1tWzVdICogeSArIG1tWzldICogeikgKiByaHc7XG4gICAgICAgIG91dC56ID0gKG1tWzJdICogeCArIG1tWzZdICogeSArIG1tWzEwXSAqIHopICogcmh3O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIGxldCByZXN1bHRzUG9vbCA9IG5ldyBSZWN5Y2xlUG9vbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkaXN0YW5jZTogMCxcbiAgICAgICAgICAgIG5vZGU6IG51bGxcbiAgICAgICAgfVxuICAgIH0sIDEpO1xuXG4gICAgbGV0IHJlc3VsdHMgPSBbXTtcblxuICAgIC8vIHRlbXAgdmFyaWFibGVcbiAgICBsZXQgbm9kZUFhYmIgPSBhYWJiLmNyZWF0ZSgpO1xuICAgIGxldCBtaW5Qb3MgPSBuZXcgVmVjMygpO1xuICAgIGxldCBtYXhQb3MgPSBuZXcgVmVjMygpO1xuXG4gICAgbGV0IG1vZGVsUmF5ID0gbmV3IHJheSgpO1xuICAgIGxldCBtNF8xID0gY2MubWF0NCgpO1xuICAgIGxldCBtNF8yID0gY2MubWF0NCgpO1xuICAgIGxldCBkID0gbmV3IFZlYzMoKTtcblxuICAgIGZ1bmN0aW9uIGRpc3RhbmNlVmFsaWQgKGRpc3RhbmNlKSB7XG4gICAgICAgIHJldHVybiBkaXN0YW5jZSA+IDAgJiYgZGlzdGFuY2UgPCBJbmZpbml0eTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKHJvb3QsIHdvcmxkUmF5LCBoYW5kbGVyLCBmaWx0ZXIpIHtcbiAgICAgICAgcmVzdWx0c1Bvb2wucmVzZXQoKTtcbiAgICAgICAgcmVzdWx0cy5sZW5ndGggPSAwO1xuXG4gICAgICAgIHJvb3QgPSByb290IHx8IGNjLmRpcmVjdG9yLmdldFNjZW5lKCk7XG4gICAgICAgIHRyYXZlcnNhbChyb290LCBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgaWYgKGZpbHRlciAmJiAhZmlsdGVyKG5vZGUpKSByZXR1cm47XG5cbiAgICAgICAgICAgIC8vIHRyYW5zZm9ybSB3b3JsZCByYXkgdG8gbW9kZWwgcmF5XG4gICAgICAgICAgICBNYXQ0LmludmVydChtNF8yLCBub2RlLmdldFdvcmxkTWF0cml4KG00XzEpKTtcbiAgICAgICAgICAgIFZlYzMudHJhbnNmb3JtTWF0NChtb2RlbFJheS5vLCB3b3JsZFJheS5vLCBtNF8yKTtcbiAgICAgICAgICAgIFZlYzMubm9ybWFsaXplKG1vZGVsUmF5LmQsIHRyYW5zZm9ybU1hdDROb3JtYWwobW9kZWxSYXkuZCwgd29ybGRSYXkuZCwgbTRfMikpO1xuXG4gICAgICAgICAgICAvLyByYXljYXN0IHdpdGggYm91bmRpbmcgYm94XG4gICAgICAgICAgICBsZXQgZGlzdGFuY2UgPSBJbmZpbml0eTtcbiAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSBub2RlLl9yZW5kZXJDb21wb25lbnQ7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgY2MuTWVzaFJlbmRlcmVyICkge1xuICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gcmF5X2FhYmIobW9kZWxSYXksIGNvbXBvbmVudC5fYm91bmRpbmdCb3gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobm9kZS53aWR0aCAmJiBub2RlLmhlaWdodCkge1xuICAgICAgICAgICAgICAgIFZlYzMuc2V0KG1pblBvcywgLW5vZGUud2lkdGggKiBub2RlLmFuY2hvclgsIC1ub2RlLmhlaWdodCAqIG5vZGUuYW5jaG9yWSwgbm9kZS56KTtcbiAgICAgICAgICAgICAgICBWZWMzLnNldChtYXhQb3MsIG5vZGUud2lkdGggKiAoMSAtIG5vZGUuYW5jaG9yWCksIG5vZGUuaGVpZ2h0ICogKDEgLSBub2RlLmFuY2hvclkpLCBub2RlLnopO1xuICAgICAgICAgICAgICAgIGFhYmIuZnJvbVBvaW50cyhub2RlQWFiYiwgbWluUG9zLCBtYXhQb3MpO1xuICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gcmF5X2FhYmIobW9kZWxSYXksIG5vZGVBYWJiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFkaXN0YW5jZVZhbGlkKGRpc3RhbmNlKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBpZiAoaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gaGFuZGxlcihtb2RlbFJheSwgbm9kZSwgZGlzdGFuY2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGlzdGFuY2VWYWxpZChkaXN0YW5jZSkpIHtcbiAgICAgICAgICAgICAgICBWZWMzLnNjYWxlKGQsIG1vZGVsUmF5LmQsIGRpc3RhbmNlKTtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1NYXQ0Tm9ybWFsKGQsIGQsIG00XzEpO1xuICAgICAgICAgICAgICAgIGxldCByZXMgPSByZXN1bHRzUG9vbC5hZGQoKTtcbiAgICAgICAgICAgICAgICByZXMubm9kZSA9IG5vZGU7XG4gICAgICAgICAgICAgICAgcmVzLmRpc3RhbmNlID0gVmVjMy5tYWcoZCk7XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc3VsdHMuc29ydChjbXApO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG59KSgpO1xuXG4vLyBhZGFwdCB0byBvbGQgYXBpXG5jb25zdCByYXljYXN0ID0gcmF5X2Nhc3Q7XG5cbi8qKlxuICogISNlbiByYXktcGxhbmUgaW50ZXJzZWN0PGJyLz5cbiAqICEjemgg5bCE57q/5LiO5bmz6Z2i55qE55u45Lqk5oCn5qOA5rWL44CCXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kIHJheV9wbGFuZVxuICogQHBhcmFtIHtnZW9tVXRpbHMuUmF5fSByYXlcbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLlBsYW5lfSBwbGFuZVxuICogQHJldHVybiB7bnVtYmVyfSAwIG9yIG5vdCAwXG4gKi9cbmNvbnN0IHJheV9wbGFuZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgcHQgPSBuZXcgVmVjMygwLCAwLCAwKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAocmF5OiByYXksIHBsYW5lOiBwbGFuZSk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IGRlbm9tID0gVmVjMy5kb3QocmF5LmQsIHBsYW5lLm4pO1xuICAgICAgICBpZiAoTWF0aC5hYnMoZGVub20pIDwgTnVtYmVyLkVQU0lMT04pIHsgcmV0dXJuIDA7IH1cbiAgICAgICAgVmVjMy5tdWx0aXBseVNjYWxhcihwdCwgcGxhbmUubiwgcGxhbmUuZCk7XG4gICAgICAgIGNvbnN0IHQgPSBWZWMzLmRvdChWZWMzLnN1YnRyYWN0KHB0LCBwdCwgcmF5Lm8pLCBwbGFuZS5uKSAvIGRlbm9tO1xuICAgICAgICBpZiAodCA8IDApIHsgcmV0dXJuIDA7IH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogISNlbiBsaW5lLXBsYW5lIGludGVyc2VjdDxici8+XG4gKiAhI3poIOe6v+auteS4juW5s+mdoueahOebuOS6pOaAp+ajgOa1i+OAglxuICogQHN0YXRpY1xuICogQG1ldGhvZCBsaW5lX3BsYW5lXG4gKiBAcGFyYW0ge2dlb21VdGlscy5MaW5lfSBsaW5lXG4gKiBAcGFyYW0ge2dlb21VdGlscy5QbGFuZX0gcGxhbmVcbiAqIEByZXR1cm4ge251bWJlcn0gMCBvciBub3QgMFxuICovXG5jb25zdCBsaW5lX3BsYW5lID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBhYiA9IG5ldyBWZWMzKDAsIDAsIDApO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChsaW5lOiBsaW5lLCBwbGFuZTogcGxhbmUpOiBudW1iZXIge1xuICAgICAgICBWZWMzLnN1YnRyYWN0KGFiLCBsaW5lLmUsIGxpbmUucyk7XG4gICAgICAgIGNvbnN0IHQgPSAocGxhbmUuZCAtIFZlYzMuZG90KGxpbmUucywgcGxhbmUubikpIC8gVmVjMy5kb3QoYWIsIHBsYW5lLm4pO1xuICAgICAgICBpZiAodCA8IDAgfHwgdCA+IDEpIHsgcmV0dXJuIDA7IH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbn0pKCk7XG5cbi8vIGJhc2VkIG9uIGh0dHA6Ly9maWxlYWRtaW4uY3MubHRoLnNlL2NzL1BlcnNvbmFsL1RvbWFzX0FrZW5pbmUtTW9sbGVyL3JheXRyaS9cbi8qKlxuICogISNlbiByYXktdHJpYW5nbGUgaW50ZXJzZWN0PGJyLz5cbiAqICEjemgg5bCE57q/5LiO5LiJ6KeS5b2i55qE55u45Lqk5oCn5qOA5rWL44CCXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kIHJheV90cmlhbmdsZVxuICogQHBhcmFtIHtnZW9tVXRpbHMuUmF5fSByYXlcbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLlRyaWFuZ2xlfSB0cmlhbmdsZVxuICogQHBhcmFtIHtib29sZWFufSBkb3VibGVTaWRlZFxuICogQHJldHVybiB7bnVtYmVyfSAwIG9yIG5vdCAwXG4gKi9cbmNvbnN0IHJheV90cmlhbmdsZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgYWIgPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICBjb25zdCBhYyA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIGNvbnN0IHB2ZWMgPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICBjb25zdCB0dmVjID0gbmV3IFZlYzMoMCwgMCwgMCk7XG4gICAgY29uc3QgcXZlYyA9IG5ldyBWZWMzKDAsIDAsIDApO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyYXk6IHJheSwgdHJpYW5nbGU6IHRyaWFuZ2xlLCBkb3VibGVTaWRlZD86IGJvb2xlYW4pIHtcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChhYiwgdHJpYW5nbGUuYiwgdHJpYW5nbGUuYSk7XG4gICAgICAgIFZlYzMuc3VidHJhY3QoYWMsIHRyaWFuZ2xlLmMsIHRyaWFuZ2xlLmEpO1xuXG4gICAgICAgIFZlYzMuY3Jvc3MocHZlYywgcmF5LmQsIGFjKTtcbiAgICAgICAgY29uc3QgZGV0ID0gVmVjMy5kb3QoYWIsIHB2ZWMpO1xuICAgICAgICBpZiAoZGV0IDwgTnVtYmVyLkVQU0lMT04gJiYgKCFkb3VibGVTaWRlZCB8fCBkZXQgPiAtTnVtYmVyLkVQU0lMT04pKSB7IHJldHVybiAwOyB9XG5cbiAgICAgICAgY29uc3QgaW52X2RldCA9IDEgLyBkZXQ7XG5cbiAgICAgICAgVmVjMy5zdWJ0cmFjdCh0dmVjLCByYXkubywgdHJpYW5nbGUuYSk7XG4gICAgICAgIGNvbnN0IHUgPSBWZWMzLmRvdCh0dmVjLCBwdmVjKSAqIGludl9kZXQ7XG4gICAgICAgIGlmICh1IDwgMCB8fCB1ID4gMSkgeyByZXR1cm4gMDsgfVxuXG4gICAgICAgIFZlYzMuY3Jvc3MocXZlYywgdHZlYywgYWIpO1xuICAgICAgICBjb25zdCB2ID0gVmVjMy5kb3QocmF5LmQsIHF2ZWMpICogaW52X2RldDtcbiAgICAgICAgaWYgKHYgPCAwIHx8IHUgKyB2ID4gMSkgeyByZXR1cm4gMDsgfVxuXG4gICAgICAgIGNvbnN0IHQgPSBWZWMzLmRvdChhYywgcXZlYykgKiBpbnZfZGV0O1xuICAgICAgICByZXR1cm4gdCA8IDAgPyAwIDogdDtcbiAgICB9O1xufSkoKTtcblxuLy8gYWRhcHQgdG8gb2xkIGFwaVxuY29uc3QgcmF5VHJpYW5nbGUgPSByYXlfdHJpYW5nbGU7XG5cbi8qKlxuICogISNlbiBsaW5lLXRyaWFuZ2xlIGludGVyc2VjdDxici8+XG4gKiAhI3poIOe6v+auteS4juS4ieinkuW9oueahOebuOS6pOaAp+ajgOa1i+OAglxuICogQHN0YXRpY1xuICogQG1ldGhvZCBsaW5lX3RyaWFuZ2xlXG4gKiBAcGFyYW0ge2dlb21VdGlscy5MaW5lfSBsaW5lXG4gKiBAcGFyYW0ge2dlb21VdGlscy5UcmlhbmdsZX0gdHJpYW5nbGVcbiAqIEBwYXJhbSB7VmVjM30gb3V0UHQgb3B0aW9uYWwsIFRoZSBpbnRlcnNlY3Rpb24gcG9pbnRcbiAqIEByZXR1cm4ge251bWJlcn0gMCBvciBub3QgMFxuICovXG5jb25zdCBsaW5lX3RyaWFuZ2xlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBhYiA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIGNvbnN0IGFjID0gbmV3IFZlYzMoMCwgMCwgMCk7XG4gICAgY29uc3QgcXAgPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICBjb25zdCBhcCA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIGNvbnN0IG4gPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICBjb25zdCBlID0gbmV3IFZlYzMoMCwgMCwgMCk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKGxpbmU6IGxpbmUsIHRyaWFuZ2xlOiB0cmlhbmdsZSwgb3V0UHQ6IFZlYzMpOiBudW1iZXIge1xuICAgICAgICBWZWMzLnN1YnRyYWN0KGFiLCB0cmlhbmdsZS5iLCB0cmlhbmdsZS5hKTtcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChhYywgdHJpYW5nbGUuYywgdHJpYW5nbGUuYSk7XG4gICAgICAgIFZlYzMuc3VidHJhY3QocXAsIGxpbmUucywgbGluZS5lKTtcblxuICAgICAgICBWZWMzLmNyb3NzKG4sIGFiLCBhYyk7XG4gICAgICAgIGNvbnN0IGRldCA9IFZlYzMuZG90KHFwLCBuKTtcblxuICAgICAgICBpZiAoZGV0IDw9IDAuMCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cblxuICAgICAgICBWZWMzLnN1YnRyYWN0KGFwLCBsaW5lLnMsIHRyaWFuZ2xlLmEpO1xuICAgICAgICBjb25zdCB0ID0gVmVjMy5kb3QoYXAsIG4pO1xuICAgICAgICBpZiAodCA8IDAgfHwgdCA+IGRldCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cblxuICAgICAgICBWZWMzLmNyb3NzKGUsIHFwLCBhcCk7XG4gICAgICAgIGxldCB2ID0gVmVjMy5kb3QoYWMsIGUpO1xuICAgICAgICBpZiAodiA8IDAgfHwgdiA+IGRldCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdyA9IC1WZWMzLmRvdChhYiwgZSk7XG4gICAgICAgIGlmICh3IDwgMC4wIHx8IHYgKyB3ID4gZGV0KSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvdXRQdCkge1xuICAgICAgICAgICAgY29uc3QgaW52RGV0ID0gMS4wIC8gZGV0O1xuICAgICAgICAgICAgdiAqPSBpbnZEZXQ7XG4gICAgICAgICAgICB3ICo9IGludkRldDtcbiAgICAgICAgICAgIGNvbnN0IHUgPSAxLjAgLSB2IC0gdztcblxuICAgICAgICAgICAgLy8gb3V0UHQgPSB1KmEgKyB2KmQgKyB3KmM7XG4gICAgICAgICAgICBWZWMzLnNldChvdXRQdCxcbiAgICAgICAgICAgICAgICB0cmlhbmdsZS5hLnggKiB1ICsgdHJpYW5nbGUuYi54ICogdiArIHRyaWFuZ2xlLmMueCAqIHcsXG4gICAgICAgICAgICAgICAgdHJpYW5nbGUuYS55ICogdSArIHRyaWFuZ2xlLmIueSAqIHYgKyB0cmlhbmdsZS5jLnkgKiB3LFxuICAgICAgICAgICAgICAgIHRyaWFuZ2xlLmEueiAqIHUgKyB0cmlhbmdsZS5iLnogKiB2ICsgdHJpYW5nbGUuYy56ICogdyxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMTtcbiAgICB9O1xufSkoKTtcblxuLyoqXG4gKiAhI2VuIGxpbmUtcXVhZCBpbnRlcnNlY3Q8YnIvPlxuICogISN6aCDnur/mrrXkuI7lm5vovrnlvaLnmoTnm7jkuqTmgKfmo4DmtYvjgIJcbiAqIEBzdGF0aWNcbiAqIEBtZXRob2QgbGluZV9xdWFkXG4gKiBAcGFyYW0ge1ZlYzN9IHAgQSBwb2ludCBvbiBhIGxpbmUgc2VnbWVudFxuICogQHBhcmFtIHtWZWMzfSBxIEFub3RoZXIgcG9pbnQgb24gdGhlIGxpbmUgc2VnbWVudFxuICogQHBhcmFtIHtWZWMzfSBhIFF1YWRyaWxhdGVyYWwgcG9pbnQgYVxuICogQHBhcmFtIHtWZWMzfSBiIFF1YWRyaWxhdGVyYWwgcG9pbnQgYlxuICogQHBhcmFtIHtWZWMzfSBjIFF1YWRyaWxhdGVyYWwgcG9pbnQgY1xuICogQHBhcmFtIHtWZWMzfSBkIFF1YWRyaWxhdGVyYWwgcG9pbnQgZFxuICogQHBhcmFtIHtWZWMzfSBvdXRQdCBvcHRpb25hbCwgVGhlIGludGVyc2VjdGlvbiBwb2ludFxuICogQHJldHVybiB7bnVtYmVyfSAwIG9yIG5vdCAwXG4gKi9cbmNvbnN0IGxpbmVfcXVhZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgcHEgPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICBjb25zdCBwYSA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIGNvbnN0IHBiID0gbmV3IFZlYzMoMCwgMCwgMCk7XG4gICAgY29uc3QgcGMgPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICBjb25zdCBwZCA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIGNvbnN0IG0gPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICBjb25zdCB0bXAgPSBuZXcgVmVjMygwLCAwLCAwKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAocDogVmVjMywgcTogVmVjMywgYTogVmVjMywgYjogVmVjMywgYzogVmVjMywgZDogVmVjMywgb3V0UHQ6IFZlYzMpOiBudW1iZXIge1xuICAgICAgICBWZWMzLnN1YnRyYWN0KHBxLCBxLCBwKTtcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChwYSwgYSwgcCk7XG4gICAgICAgIFZlYzMuc3VidHJhY3QocGIsIGIsIHApO1xuICAgICAgICBWZWMzLnN1YnRyYWN0KHBjLCBjLCBwKTtcblxuICAgICAgICAvLyBEZXRlcm1pbmUgd2hpY2ggdHJpYW5nbGUgdG8gdGVzdCBhZ2FpbnN0IGJ5IHRlc3RpbmcgYWdhaW5zdCBkaWFnb25hbCBmaXJzdFxuICAgICAgICBWZWMzLmNyb3NzKG0sIHBjLCBwcSk7XG4gICAgICAgIGxldCB2ID0gVmVjMy5kb3QocGEsIG0pO1xuXG4gICAgICAgIGlmICh2ID49IDApIHtcbiAgICAgICAgICAgIC8vIFRlc3QgaW50ZXJzZWN0aW9uIGFnYWluc3QgdHJpYW5nbGUgYWJjXG4gICAgICAgICAgICBsZXQgdSA9IC1WZWMzLmRvdChwYiwgbSk7XG4gICAgICAgICAgICBpZiAodSA8IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHcgPSBWZWMzLmRvdChWZWMzLmNyb3NzKHRtcCwgcHEsIHBiKSwgcGEpO1xuICAgICAgICAgICAgaWYgKHcgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIG91dFB0ID0gdSphICsgdipiICsgdypjO1xuICAgICAgICAgICAgaWYgKG91dFB0KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVub20gPSAxLjAgLyAodSArIHYgKyB3KTtcbiAgICAgICAgICAgICAgICB1ICo9IGRlbm9tO1xuICAgICAgICAgICAgICAgIHYgKj0gZGVub207XG4gICAgICAgICAgICAgICAgdyAqPSBkZW5vbTtcblxuICAgICAgICAgICAgICAgIFZlYzMuc2V0KG91dFB0LFxuICAgICAgICAgICAgICAgICAgICBhLnggKiB1ICsgYi54ICogdiArIGMueCAqIHcsXG4gICAgICAgICAgICAgICAgICAgIGEueSAqIHUgKyBiLnkgKiB2ICsgYy55ICogdyxcbiAgICAgICAgICAgICAgICAgICAgYS56ICogdSArIGIueiAqIHYgKyBjLnogKiB3LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUZXN0IGludGVyc2VjdGlvbiBhZ2FpbnN0IHRyaWFuZ2xlIGRhY1xuICAgICAgICAgICAgVmVjMy5zdWJ0cmFjdChwZCwgZCwgcCk7XG5cbiAgICAgICAgICAgIGxldCB1ID0gVmVjMy5kb3QocGQsIG0pO1xuICAgICAgICAgICAgaWYgKHUgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB3ID0gVmVjMy5kb3QoVmVjMy5jcm9zcyh0bXAsIHBxLCBwYSksIHBkKTtcbiAgICAgICAgICAgIGlmICh3IDwgMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBvdXRQdCA9IHUqYSArIHYqZCArIHcqYztcbiAgICAgICAgICAgIGlmIChvdXRQdCkge1xuICAgICAgICAgICAgICAgIHYgPSAtdjtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGRlbm9tID0gMS4wIC8gKHUgKyB2ICsgdyk7XG4gICAgICAgICAgICAgICAgdSAqPSBkZW5vbTtcbiAgICAgICAgICAgICAgICB2ICo9IGRlbm9tO1xuICAgICAgICAgICAgICAgIHcgKj0gZGVub207XG5cbiAgICAgICAgICAgICAgICBWZWMzLnNldChvdXRQdCxcbiAgICAgICAgICAgICAgICAgICAgYS54ICogdSArIGQueCAqIHYgKyBjLnggKiB3LFxuICAgICAgICAgICAgICAgICAgICBhLnkgKiB1ICsgZC55ICogdiArIGMueSAqIHcsXG4gICAgICAgICAgICAgICAgICAgIGEueiAqIHUgKyBkLnogKiB2ICsgYy56ICogdyxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogISNlbiByYXktc3BoZXJlIGludGVyc2VjdDxici8+XG4gKiAhI3poIOWwhOe6v+WSjOeQg+eahOebuOS6pOaAp+ajgOa1i+OAglxuICogQHN0YXRpY1xuICogQG1ldGhvZCByYXlfc3BoZXJlXG4gKiBAcGFyYW0ge2dlb21VdGlscy5SYXl9IHJheVxuICogQHBhcmFtIHtnZW9tVXRpbHMuU3BoZXJlfSBzcGhlcmVcbiAqIEByZXR1cm4ge251bWJlcn0gMCBvciBub3QgMFxuICovXG5jb25zdCByYXlfc3BoZXJlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBlID0gbmV3IFZlYzMoMCwgMCwgMCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyYXk6IHJheSwgc3BoZXJlOiBzcGhlcmUpOiBudW1iZXIge1xuICAgICAgICBjb25zdCByID0gc3BoZXJlLnJhZGl1cztcbiAgICAgICAgY29uc3QgYyA9IHNwaGVyZS5jZW50ZXI7XG4gICAgICAgIGNvbnN0IG8gPSByYXkubztcbiAgICAgICAgY29uc3QgZCA9IHJheS5kO1xuICAgICAgICBjb25zdCByU3EgPSByICogcjtcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChlLCBjLCBvKTtcbiAgICAgICAgY29uc3QgZVNxID0gZS5sZW5ndGhTcXIoKTtcblxuICAgICAgICBjb25zdCBhTGVuZ3RoID0gVmVjMy5kb3QoZSwgZCk7IC8vIGFzc3VtZSByYXkgZGlyZWN0aW9uIGFscmVhZHkgbm9ybWFsaXplZFxuICAgICAgICBjb25zdCBmU3EgPSByU3EgLSAoZVNxIC0gYUxlbmd0aCAqIGFMZW5ndGgpO1xuICAgICAgICBpZiAoZlNxIDwgMCkgeyByZXR1cm4gMDsgfVxuXG4gICAgICAgIGNvbnN0IGYgPSBNYXRoLnNxcnQoZlNxKTtcbiAgICAgICAgY29uc3QgdCA9IGVTcSA8IHJTcSA/IGFMZW5ndGggKyBmIDogYUxlbmd0aCAtIGY7XG4gICAgICAgIGlmICh0IDwgMCkgeyByZXR1cm4gMDsgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xufSkoKTtcblxuLyoqXG4gKiAhI2VuIHJheS1hYWJiIGludGVyc2VjdDxici8+XG4gKiAhI3poIOWwhOe6v+WSjOi9tOWvuem9kOWMheWbtOebkueahOebuOS6pOaAp+ajgOa1i+OAglxuICogQHN0YXRpY1xuICogQG1ldGhvZCByYXlfYWFiYlxuICogQHBhcmFtIHtnZW9tVXRpbHMuUmF5fSByYXlcbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLkFhYmJ9IGFhYmIgQWxpZ24gdGhlIGF4aXMgYXJvdW5kIHRoZSBib3hcbiAqIEByZXR1cm4ge251bWJlcn0gMCBvciBub3QgMFxuICovXG5jb25zdCByYXlfYWFiYiA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbWluID0gbmV3IFZlYzMoKTtcbiAgICBjb25zdCBtYXggPSBuZXcgVmVjMygpO1xuICAgIHJldHVybiBmdW5jdGlvbiAocmF5OiByYXksIGFhYmI6IGFhYmIpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBvID0gcmF5Lm8sIGQgPSByYXkuZDtcbiAgICAgICAgY29uc3QgaXggPSAxIC8gZC54LCBpeSA9IDEgLyBkLnksIGl6ID0gMSAvIGQuejtcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChtaW4sIGFhYmIuY2VudGVyLCBhYWJiLmhhbGZFeHRlbnRzKTtcbiAgICAgICAgVmVjMy5hZGQobWF4LCBhYWJiLmNlbnRlciwgYWFiYi5oYWxmRXh0ZW50cyk7XG4gICAgICAgIGNvbnN0IHQxID0gKG1pbi54IC0gby54KSAqIGl4O1xuICAgICAgICBjb25zdCB0MiA9IChtYXgueCAtIG8ueCkgKiBpeDtcbiAgICAgICAgY29uc3QgdDMgPSAobWluLnkgLSBvLnkpICogaXk7XG4gICAgICAgIGNvbnN0IHQ0ID0gKG1heC55IC0gby55KSAqIGl5O1xuICAgICAgICBjb25zdCB0NSA9IChtaW4ueiAtIG8ueikgKiBpejtcbiAgICAgICAgY29uc3QgdDYgPSAobWF4LnogLSBvLnopICogaXo7XG4gICAgICAgIGNvbnN0IHRtaW4gPSBNYXRoLm1heChNYXRoLm1heChNYXRoLm1pbih0MSwgdDIpLCBNYXRoLm1pbih0MywgdDQpKSwgTWF0aC5taW4odDUsIHQ2KSk7XG4gICAgICAgIGNvbnN0IHRtYXggPSBNYXRoLm1pbihNYXRoLm1pbihNYXRoLm1heCh0MSwgdDIpLCBNYXRoLm1heCh0MywgdDQpKSwgTWF0aC5tYXgodDUsIHQ2KSk7XG4gICAgICAgIGlmICh0bWF4IDwgMCB8fCB0bWluID4gdG1heCkgeyByZXR1cm4gMCB9O1xuICAgICAgICByZXR1cm4gdG1pbjtcbiAgICB9O1xufSkoKTtcblxuLy8gYWRhcHQgdG8gb2xkIGFwaVxuY29uc3QgcmF5QWFiYiA9IHJheV9hYWJiO1xuXG4vKipcbiAqICEjZW4gcmF5LW9iYiBpbnRlcnNlY3Q8YnIvPlxuICogISN6aCDlsITnur/lkozmlrnlkJHljIXlm7Tnm5LnmoTnm7jkuqTmgKfmo4DmtYvjgIJcbiAqIEBzdGF0aWNcbiAqIEBtZXRob2QgcmF5X29iYlxuICogQHBhcmFtIHtnZW9tVXRpbHMuUmF5fSByYXlcbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLk9iYn0gb2JiIERpcmVjdGlvbiBib3hcbiAqIEByZXR1cm4ge251bWJlcn0gMCBvciBvciAwXG4gKi9cbmNvbnN0IHJheV9vYmIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGxldCBjZW50ZXIgPSBuZXcgVmVjMygpO1xuICAgIGxldCBvID0gbmV3IFZlYzMoKTtcbiAgICBsZXQgZCA9IG5ldyBWZWMzKCk7XG4gICAgY29uc3QgWCA9IG5ldyBWZWMzKCk7XG4gICAgY29uc3QgWSA9IG5ldyBWZWMzKCk7XG4gICAgY29uc3QgWiA9IG5ldyBWZWMzKCk7XG4gICAgY29uc3QgcCA9IG5ldyBWZWMzKCk7XG4gICAgY29uc3Qgc2l6ZSA9IG5ldyBBcnJheSgzKTtcbiAgICBjb25zdCBmID0gbmV3IEFycmF5KDMpO1xuICAgIGNvbnN0IGUgPSBuZXcgQXJyYXkoMyk7XG4gICAgY29uc3QgdCA9IG5ldyBBcnJheSg2KTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAocmF5OiByYXksIG9iYjogb2JiKTogbnVtYmVyIHtcbiAgICAgICAgc2l6ZVswXSA9IG9iYi5oYWxmRXh0ZW50cy54O1xuICAgICAgICBzaXplWzFdID0gb2JiLmhhbGZFeHRlbnRzLnk7XG4gICAgICAgIHNpemVbMl0gPSBvYmIuaGFsZkV4dGVudHMuejtcbiAgICAgICAgY2VudGVyID0gb2JiLmNlbnRlcjtcbiAgICAgICAgbyA9IHJheS5vO1xuICAgICAgICBkID0gcmF5LmQ7XG5cbiAgICAgICAgbGV0IG9iYm0gPSBvYmIub3JpZW50YXRpb24ubTtcblxuICAgICAgICBWZWMzLnNldChYLCBvYmJtWzBdLCBvYmJtWzFdLCBvYmJtWzJdKTtcbiAgICAgICAgVmVjMy5zZXQoWSwgb2JibVszXSwgb2JibVs0XSwgb2JibVs1XSk7XG4gICAgICAgIFZlYzMuc2V0KFosIG9iYm1bNl0sIG9iYm1bN10sIG9iYm1bOF0pO1xuICAgICAgICBWZWMzLnN1YnRyYWN0KHAsIGNlbnRlciwgbyk7XG5cbiAgICAgICAgLy8gVGhlIGNvcyB2YWx1ZXMgb2YgdGhlIHJheSBvbiB0aGUgWCwgWSwgWlxuICAgICAgICBmWzBdID0gVmVjMy5kb3QoWCwgZCk7XG4gICAgICAgIGZbMV0gPSBWZWMzLmRvdChZLCBkKTtcbiAgICAgICAgZlsyXSA9IFZlYzMuZG90KFosIGQpO1xuXG4gICAgICAgIC8vIFRoZSBwcm9qZWN0aW9uIGxlbmd0aCBvZiBQIG9uIFgsIFksIFpcbiAgICAgICAgZVswXSA9IFZlYzMuZG90KFgsIHApO1xuICAgICAgICBlWzFdID0gVmVjMy5kb3QoWSwgcCk7XG4gICAgICAgIGVbMl0gPSBWZWMzLmRvdChaLCBwKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7ICsraSkge1xuICAgICAgICAgICAgaWYgKGZbaV0gPT09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoLWVbaV0gLSBzaXplW2ldID4gMCB8fCAtZVtpXSArIHNpemVbaV0gPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBBdm9pZCBkaXYgYnkgMCFcbiAgICAgICAgICAgICAgICBmW2ldID0gMC4wMDAwMDAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbWluXG4gICAgICAgICAgICB0W2kgKiAyICsgMF0gPSAoZVtpXSArIHNpemVbaV0pIC8gZltpXTtcbiAgICAgICAgICAgIC8vIG1heFxuICAgICAgICAgICAgdFtpICogMiArIDFdID0gKGVbaV0gLSBzaXplW2ldKSAvIGZbaV07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdG1pbiA9IE1hdGgubWF4KFxuICAgICAgICAgICAgTWF0aC5tYXgoXG4gICAgICAgICAgICAgICAgTWF0aC5taW4odFswXSwgdFsxXSksXG4gICAgICAgICAgICAgICAgTWF0aC5taW4odFsyXSwgdFszXSkpLFxuICAgICAgICAgICAgTWF0aC5taW4odFs0XSwgdFs1XSksXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHRtYXggPSBNYXRoLm1pbihcbiAgICAgICAgICAgIE1hdGgubWluKFxuICAgICAgICAgICAgICAgIE1hdGgubWF4KHRbMF0sIHRbMV0pLFxuICAgICAgICAgICAgICAgIE1hdGgubWF4KHRbMl0sIHRbM10pKSxcbiAgICAgICAgICAgIE1hdGgubWF4KHRbNF0sIHRbNV0pLFxuICAgICAgICApO1xuICAgICAgICBpZiAodG1heCA8IDAgfHwgdG1pbiA+IHRtYXggfHwgdG1pbiA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRtaW47XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogISNlbiBhYWJiLWFhYmIgaW50ZXJzZWN0PGJyLz5cbiAqICEjemgg6L205a+56b2Q5YyF5Zu055uS5ZKM6L205a+56b2Q5YyF5Zu055uS55qE55u45Lqk5oCn5qOA5rWL44CCXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kIGFhYmJfYWFiYlxuICogQHBhcmFtIHtnZW9tVXRpbHMuQWFiYn0gYWFiYjEgQXhpcyBhbGlnbm1lbnQgc3Vycm91bmRzIGJveCAxXG4gKiBAcGFyYW0ge2dlb21VdGlscy5BYWJifSBhYWJiMiBBeGlzIGFsaWdubWVudCBzdXJyb3VuZHMgYm94IDJcbiAqIEByZXR1cm4ge251bWJlcn0gMCBvciBub3QgMFxuICovXG5jb25zdCBhYWJiX2FhYmIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGFNaW4gPSBuZXcgVmVjMygpO1xuICAgIGNvbnN0IGFNYXggPSBuZXcgVmVjMygpO1xuICAgIGNvbnN0IGJNaW4gPSBuZXcgVmVjMygpO1xuICAgIGNvbnN0IGJNYXggPSBuZXcgVmVjMygpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoYWFiYjE6IGFhYmIsIGFhYmIyOiBhYWJiKSB7XG4gICAgICAgIFZlYzMuc3VidHJhY3QoYU1pbiwgYWFiYjEuY2VudGVyLCBhYWJiMS5oYWxmRXh0ZW50cyk7XG4gICAgICAgIFZlYzMuYWRkKGFNYXgsIGFhYmIxLmNlbnRlciwgYWFiYjEuaGFsZkV4dGVudHMpO1xuICAgICAgICBWZWMzLnN1YnRyYWN0KGJNaW4sIGFhYmIyLmNlbnRlciwgYWFiYjIuaGFsZkV4dGVudHMpO1xuICAgICAgICBWZWMzLmFkZChiTWF4LCBhYWJiMi5jZW50ZXIsIGFhYmIyLmhhbGZFeHRlbnRzKTtcbiAgICAgICAgcmV0dXJuIChhTWluLnggPD0gYk1heC54ICYmIGFNYXgueCA+PSBiTWluLngpICYmXG4gICAgICAgICAgICAoYU1pbi55IDw9IGJNYXgueSAmJiBhTWF4LnkgPj0gYk1pbi55KSAmJlxuICAgICAgICAgICAgKGFNaW4ueiA8PSBiTWF4LnogJiYgYU1heC56ID49IGJNaW4ueik7XG4gICAgfTtcbn0pKCk7XG5cbmZ1bmN0aW9uIGdldEFBQkJWZXJ0aWNlcyAobWluOiBWZWMzLCBtYXg6IFZlYzMsIG91dDogVmVjM1tdKSB7XG4gICAgVmVjMy5zZXQob3V0WzBdLCBtaW4ueCwgbWF4LnksIG1heC56KTtcbiAgICBWZWMzLnNldChvdXRbMV0sIG1pbi54LCBtYXgueSwgbWluLnopO1xuICAgIFZlYzMuc2V0KG91dFsyXSwgbWluLngsIG1pbi55LCBtYXgueik7XG4gICAgVmVjMy5zZXQob3V0WzNdLCBtaW4ueCwgbWluLnksIG1pbi56KTtcbiAgICBWZWMzLnNldChvdXRbNF0sIG1heC54LCBtYXgueSwgbWF4LnopO1xuICAgIFZlYzMuc2V0KG91dFs1XSwgbWF4LngsIG1heC55LCBtaW4ueik7XG4gICAgVmVjMy5zZXQob3V0WzZdLCBtYXgueCwgbWluLnksIG1heC56KTtcbiAgICBWZWMzLnNldChvdXRbN10sIG1heC54LCBtaW4ueSwgbWluLnopO1xufVxuXG5mdW5jdGlvbiBnZXRPQkJWZXJ0aWNlcyAoYzogVmVjMywgZTogVmVjMywgYTE6IFZlYzMsIGEyOiBWZWMzLCBhMzogVmVjMywgb3V0OiBWZWMzW10pIHtcbiAgICBWZWMzLnNldChvdXRbMF0sXG4gICAgICAgIGMueCArIGExLnggKiBlLnggKyBhMi54ICogZS55ICsgYTMueCAqIGUueixcbiAgICAgICAgYy55ICsgYTEueSAqIGUueCArIGEyLnkgKiBlLnkgKyBhMy55ICogZS56LFxuICAgICAgICBjLnogKyBhMS56ICogZS54ICsgYTIueiAqIGUueSArIGEzLnogKiBlLnosXG4gICAgKTtcbiAgICBWZWMzLnNldChvdXRbMV0sXG4gICAgICAgIGMueCAtIGExLnggKiBlLnggKyBhMi54ICogZS55ICsgYTMueCAqIGUueixcbiAgICAgICAgYy55IC0gYTEueSAqIGUueCArIGEyLnkgKiBlLnkgKyBhMy55ICogZS56LFxuICAgICAgICBjLnogLSBhMS56ICogZS54ICsgYTIueiAqIGUueSArIGEzLnogKiBlLnosXG4gICAgKTtcbiAgICBWZWMzLnNldChvdXRbMl0sXG4gICAgICAgIGMueCArIGExLnggKiBlLnggLSBhMi54ICogZS55ICsgYTMueCAqIGUueixcbiAgICAgICAgYy55ICsgYTEueSAqIGUueCAtIGEyLnkgKiBlLnkgKyBhMy55ICogZS56LFxuICAgICAgICBjLnogKyBhMS56ICogZS54IC0gYTIueiAqIGUueSArIGEzLnogKiBlLnosXG4gICAgKTtcbiAgICBWZWMzLnNldChvdXRbM10sXG4gICAgICAgIGMueCArIGExLnggKiBlLnggKyBhMi54ICogZS55IC0gYTMueCAqIGUueixcbiAgICAgICAgYy55ICsgYTEueSAqIGUueCArIGEyLnkgKiBlLnkgLSBhMy55ICogZS56LFxuICAgICAgICBjLnogKyBhMS56ICogZS54ICsgYTIueiAqIGUueSAtIGEzLnogKiBlLnosXG4gICAgKTtcbiAgICBWZWMzLnNldChvdXRbNF0sXG4gICAgICAgIGMueCAtIGExLnggKiBlLnggLSBhMi54ICogZS55IC0gYTMueCAqIGUueixcbiAgICAgICAgYy55IC0gYTEueSAqIGUueCAtIGEyLnkgKiBlLnkgLSBhMy55ICogZS56LFxuICAgICAgICBjLnogLSBhMS56ICogZS54IC0gYTIueiAqIGUueSAtIGEzLnogKiBlLnosXG4gICAgKTtcbiAgICBWZWMzLnNldChvdXRbNV0sXG4gICAgICAgIGMueCArIGExLnggKiBlLnggLSBhMi54ICogZS55IC0gYTMueCAqIGUueixcbiAgICAgICAgYy55ICsgYTEueSAqIGUueCAtIGEyLnkgKiBlLnkgLSBhMy55ICogZS56LFxuICAgICAgICBjLnogKyBhMS56ICogZS54IC0gYTIueiAqIGUueSAtIGEzLnogKiBlLnosXG4gICAgKTtcbiAgICBWZWMzLnNldChvdXRbNl0sXG4gICAgICAgIGMueCAtIGExLnggKiBlLnggKyBhMi54ICogZS55IC0gYTMueCAqIGUueixcbiAgICAgICAgYy55IC0gYTEueSAqIGUueCArIGEyLnkgKiBlLnkgLSBhMy55ICogZS56LFxuICAgICAgICBjLnogLSBhMS56ICogZS54ICsgYTIueiAqIGUueSAtIGEzLnogKiBlLnosXG4gICAgKTtcbiAgICBWZWMzLnNldChvdXRbN10sXG4gICAgICAgIGMueCAtIGExLnggKiBlLnggLSBhMi54ICogZS55ICsgYTMueCAqIGUueixcbiAgICAgICAgYy55IC0gYTEueSAqIGUueCAtIGEyLnkgKiBlLnkgKyBhMy55ICogZS56LFxuICAgICAgICBjLnogLSBhMS56ICogZS54IC0gYTIueiAqIGUueSArIGEzLnogKiBlLnosXG4gICAgKTtcbn1cblxuZnVuY3Rpb24gZ2V0SW50ZXJ2YWwgKHZlcnRpY2VzOiBhbnlbXSB8IFZlYzNbXSwgYXhpczogVmVjMykge1xuICAgIGxldCBtaW4gPSBWZWMzLmRvdChheGlzLCB2ZXJ0aWNlc1swXSksIG1heCA9IG1pbjtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IDg7ICsraSkge1xuICAgICAgICBjb25zdCBwcm9qZWN0aW9uID0gVmVjMy5kb3QoYXhpcywgdmVydGljZXNbaV0pO1xuICAgICAgICBtaW4gPSAocHJvamVjdGlvbiA8IG1pbikgPyBwcm9qZWN0aW9uIDogbWluO1xuICAgICAgICBtYXggPSAocHJvamVjdGlvbiA+IG1heCkgPyBwcm9qZWN0aW9uIDogbWF4O1xuICAgIH1cbiAgICByZXR1cm4gW21pbiwgbWF4XTtcbn1cblxuLyoqXG4gKiAhI2VuIGFhYmItb2JiIGludGVyc2VjdDxici8+XG4gKiAhI3poIOi9tOWvuem9kOWMheWbtOebkuWSjOaWueWQkeWMheWbtOebkueahOebuOS6pOaAp+ajgOa1i+OAglxuICogQHN0YXRpY1xuICogQG1ldGhvZCBhYWJiX29iYlxuICogQHBhcmFtIHtnZW9tVXRpbHMuQWFiYn0gYWFiYiBBbGlnbiB0aGUgYXhpcyBhcm91bmQgdGhlIGJveFxuICogQHBhcmFtIHtnZW9tVXRpbHMuT2JifSBvYmIgRGlyZWN0aW9uIGJveFxuICogQHJldHVybiB7bnVtYmVyfSAwIG9yIG5vdCAwXG4gKi9cbmNvbnN0IGFhYmJfb2JiID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCB0ZXN0ID0gbmV3IEFycmF5KDE1KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE1OyBpKyspIHtcbiAgICAgICAgdGVzdFtpXSA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIH1cbiAgICBjb25zdCB2ZXJ0aWNlcyA9IG5ldyBBcnJheSg4KTtcbiAgICBjb25zdCB2ZXJ0aWNlczIgPSBuZXcgQXJyYXkoOCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA4OyBpKyspIHtcbiAgICAgICAgdmVydGljZXNbaV0gPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICAgICAgdmVydGljZXMyW2ldID0gbmV3IFZlYzMoMCwgMCwgMCk7XG4gICAgfVxuICAgIGNvbnN0IG1pbiA9IG5ldyBWZWMzKCk7XG4gICAgY29uc3QgbWF4ID0gbmV3IFZlYzMoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGFhYmI6IGFhYmIsIG9iYjogb2JiKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IG9iYm0gPSBvYmIub3JpZW50YXRpb24ubTtcblxuICAgICAgICBWZWMzLnNldCh0ZXN0WzBdLCAxLCAwLCAwKTtcbiAgICAgICAgVmVjMy5zZXQodGVzdFsxXSwgMCwgMSwgMCk7XG4gICAgICAgIFZlYzMuc2V0KHRlc3RbMl0sIDAsIDAsIDEpO1xuICAgICAgICBWZWMzLnNldCh0ZXN0WzNdLCBvYmJtWzBdLCBvYmJtWzFdLCBvYmJtWzJdKTtcbiAgICAgICAgVmVjMy5zZXQodGVzdFs0XSwgb2JibVszXSwgb2JibVs0XSwgb2JibVs1XSk7XG4gICAgICAgIFZlYzMuc2V0KHRlc3RbNV0sIG9iYm1bNl0sIG9iYm1bN10sIG9iYm1bOF0pO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgKytpKSB7IC8vIEZpbGwgb3V0IHJlc3Qgb2YgYXhpc1xuICAgICAgICAgICAgVmVjMy5jcm9zcyh0ZXN0WzYgKyBpICogMyArIDBdLCB0ZXN0W2ldLCB0ZXN0WzBdKTtcbiAgICAgICAgICAgIFZlYzMuY3Jvc3ModGVzdFs2ICsgaSAqIDMgKyAxXSwgdGVzdFtpXSwgdGVzdFsxXSk7XG4gICAgICAgICAgICBWZWMzLmNyb3NzKHRlc3RbNiArIGkgKiAzICsgMV0sIHRlc3RbaV0sIHRlc3RbMl0pO1xuICAgICAgICB9XG5cbiAgICAgICAgVmVjMy5zdWJ0cmFjdChtaW4sIGFhYmIuY2VudGVyLCBhYWJiLmhhbGZFeHRlbnRzKTtcbiAgICAgICAgVmVjMy5hZGQobWF4LCBhYWJiLmNlbnRlciwgYWFiYi5oYWxmRXh0ZW50cyk7XG4gICAgICAgIGdldEFBQkJWZXJ0aWNlcyhtaW4sIG1heCwgdmVydGljZXMpO1xuICAgICAgICBnZXRPQkJWZXJ0aWNlcyhvYmIuY2VudGVyLCBvYmIuaGFsZkV4dGVudHMsIHRlc3RbM10sIHRlc3RbNF0sIHRlc3RbNV0sIHZlcnRpY2VzMik7XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxNTsgKytqKSB7XG4gICAgICAgICAgICBjb25zdCBhID0gZ2V0SW50ZXJ2YWwodmVydGljZXMsIHRlc3Rbal0pO1xuICAgICAgICAgICAgY29uc3QgYiA9IGdldEludGVydmFsKHZlcnRpY2VzMiwgdGVzdFtqXSk7XG4gICAgICAgICAgICBpZiAoYlswXSA+IGFbMV0gfHwgYVswXSA+IGJbMV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDsgLy8gU2VwZXJhdGluZyBheGlzIGZvdW5kXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMTtcbiAgICB9O1xufSkoKTtcblxuLyoqXG4gKiAhI2VuIGFhYmItcGxhbmUgaW50ZXJzZWN0PGJyLz5cbiAqICEjemgg6L205a+56b2Q5YyF5Zu055uS5ZKM5bmz6Z2i55qE55u45Lqk5oCn5qOA5rWL44CCXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kIGFhYmJfcGxhbmVcbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLkFhYmJ9IGFhYmIgQWxpZ24gdGhlIGF4aXMgYXJvdW5kIHRoZSBib3hcbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLlBsYW5lfSBwbGFuZVxuICogQHJldHVybiB7bnVtYmVyfSBpbnNpZGUoYmFjaykgPSAtMSwgb3V0c2lkZShmcm9udCkgPSAwLCBpbnRlcnNlY3QgPSAxXG4gKi9cbmNvbnN0IGFhYmJfcGxhbmUgPSBmdW5jdGlvbiAoYWFiYjogYWFiYiwgcGxhbmU6IHBsYW5lKTogbnVtYmVyIHtcbiAgICBjb25zdCByID0gYWFiYi5oYWxmRXh0ZW50cy54ICogTWF0aC5hYnMocGxhbmUubi54KSArXG4gICAgICAgIGFhYmIuaGFsZkV4dGVudHMueSAqIE1hdGguYWJzKHBsYW5lLm4ueSkgK1xuICAgICAgICBhYWJiLmhhbGZFeHRlbnRzLnogKiBNYXRoLmFicyhwbGFuZS5uLnopO1xuICAgIGNvbnN0IGRvdCA9IFZlYzMuZG90KHBsYW5lLm4sIGFhYmIuY2VudGVyKTtcbiAgICBpZiAoZG90ICsgciA8IHBsYW5lLmQpIHsgcmV0dXJuIC0xOyB9XG4gICAgZWxzZSBpZiAoZG90IC0gciA+IHBsYW5lLmQpIHsgcmV0dXJuIDA7IH1cbiAgICByZXR1cm4gMTtcbn07XG5cbi8qKlxuICogISNlbiBhYWJiLWZydXN0dW0gaW50ZXJzZWN0LCBmYXN0ZXIgYnV0IGhhcyBmYWxzZSBwb3NpdGl2ZSBjb3JuZXIgY2FzZXM8YnIvPlxuICogISN6aCDovbTlr7npvZDljIXlm7Tnm5LlkozplKXlj7Dnm7jkuqTmgKfmo4DmtYvvvIzpgJ/luqblv6vvvIzkvYbmnInplJnor6/mg4XlhrXjgIJcbiAqIEBzdGF0aWNcbiAqIEBtZXRob2QgYWFiYl9mcnVzdHVtXG4gKiBAcGFyYW0ge2dlb21VdGlscy5BYWJifSBhYWJiIEFsaWduIHRoZSBheGlzIGFyb3VuZCB0aGUgYm94XG4gKiBAcGFyYW0ge2dlb21VdGlscy5GcnVzdHVtfSBmcnVzdHVtXG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAgb3Igbm90IDBcbiAqL1xuY29uc3QgYWFiYl9mcnVzdHVtID0gZnVuY3Rpb24gKGFhYmI6IGFhYmIsIGZydXN0dW06IGZydXN0dW0pOiBudW1iZXIge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS5wbGFuZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gZnJ1c3R1bSBwbGFuZSBub3JtYWwgcG9pbnRzIHRvIHRoZSBpbnNpZGVcbiAgICAgICAgaWYgKGFhYmJfcGxhbmUoYWFiYiwgZnJ1c3R1bS5wbGFuZXNbaV0pID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9IC8vIGNvbXBsZXRlbHkgb3V0c2lkZVxuICAgIHJldHVybiAxO1xufTtcblxuLy8gaHR0cHM6Ly9jZXNpdW0uY29tL2Jsb2cvMjAxNy8wMi8wMi90aWdodGVyLWZydXN0dW0tY3VsbGluZy1hbmQtd2h5LXlvdS1tYXktd2FudC10by1kaXNyZWdhcmQtaXQvXG4vKipcbiAqICEjZW4gYWFiYi1mcnVzdHVtIGludGVyc2VjdCwgaGFuZGxlcyBtb3N0IG9mIHRoZSBmYWxzZSBwb3NpdGl2ZXMgY29ycmVjdGx5PGJyLz5cbiAqICEjemgg6L205a+56b2Q5YyF5Zu055uS5ZKM6ZSl5Y+w55u45Lqk5oCn5qOA5rWL77yM5q2j56Gu5aSE55CG5aSn5aSa5pWw6ZSZ6K+v5oOF5Ya144CCXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kIGFhYmJfZnJ1c3R1bV9hY2N1cmF0ZVxuICogQHBhcmFtIHtnZW9tVXRpbHMuQWFiYn0gYWFiYiBBbGlnbiB0aGUgYXhpcyBhcm91bmQgdGhlIGJveFxuICogQHBhcmFtIHtnZW9tVXRpbHMuRnJ1c3R1bX0gZnJ1c3R1bVxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5jb25zdCBhYWJiX2ZydXN0dW1fYWNjdXJhdGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHRtcCA9IG5ldyBBcnJheSg4KTtcbiAgICBsZXQgb3V0MSA9IDAsIG91dDIgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG1wLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRtcFtpXSA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gKGFhYmI6IGFhYmIsIGZydXN0dW06IGZydXN0dW0pOiBudW1iZXIge1xuICAgICAgICBsZXQgcmVzdWx0ID0gMCwgaW50ZXJzZWN0cyA9IGZhbHNlO1xuICAgICAgICAvLyAxLiBhYWJiIGluc2lkZS9vdXRzaWRlIGZydXN0dW0gdGVzdFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZydXN0dW0ucGxhbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBhYWJiX3BsYW5lKGFhYmIsIGZydXN0dW0ucGxhbmVzW2ldKTtcbiAgICAgICAgICAgIC8vIGZydXN0dW0gcGxhbmUgbm9ybWFsIHBvaW50cyB0byB0aGUgaW5zaWRlXG4gICAgICAgICAgICBpZiAocmVzdWx0ID09PSAtMSkgeyByZXR1cm4gMDsgfSAvLyBjb21wbGV0ZWx5IG91dHNpZGVcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlc3VsdCA9PT0gMSkgeyBpbnRlcnNlY3RzID0gdHJ1ZTsgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghaW50ZXJzZWN0cykgeyByZXR1cm4gMTsgfSAvLyBjb21wbGV0ZWx5IGluc2lkZVxuICAgICAgICAvLyBpbiBjYXNlIG9mIGZhbHNlIHBvc2l0aXZlc1xuICAgICAgICAvLyAyLiBmcnVzdHVtIGluc2lkZS9vdXRzaWRlIGFhYmIgdGVzdFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZydXN0dW0udmVydGljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIFZlYzMuc3VidHJhY3QodG1wW2ldLCBmcnVzdHVtLnZlcnRpY2VzW2ldLCBhYWJiLmNlbnRlcik7XG4gICAgICAgIH1cbiAgICAgICAgb3V0MSA9IDAsIG91dDIgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZydXN0dW0udmVydGljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0bXBbaV0ueCA+IGFhYmIuaGFsZkV4dGVudHMueCkgeyBvdXQxKys7IH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRtcFtpXS54IDwgLWFhYmIuaGFsZkV4dGVudHMueCkgeyBvdXQyKys7IH1cbiAgICAgICAgfVxuICAgICAgICBpZiAob3V0MSA9PT0gZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGggfHwgb3V0MiA9PT0gZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGgpIHsgcmV0dXJuIDA7IH1cbiAgICAgICAgb3V0MSA9IDA7IG91dDIgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZydXN0dW0udmVydGljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0bXBbaV0ueSA+IGFhYmIuaGFsZkV4dGVudHMueSkgeyBvdXQxKys7IH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRtcFtpXS55IDwgLWFhYmIuaGFsZkV4dGVudHMueSkgeyBvdXQyKys7IH1cbiAgICAgICAgfVxuICAgICAgICBpZiAob3V0MSA9PT0gZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGggfHwgb3V0MiA9PT0gZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGgpIHsgcmV0dXJuIDA7IH1cbiAgICAgICAgb3V0MSA9IDA7IG91dDIgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZydXN0dW0udmVydGljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0bXBbaV0ueiA+IGFhYmIuaGFsZkV4dGVudHMueikgeyBvdXQxKys7IH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRtcFtpXS56IDwgLWFhYmIuaGFsZkV4dGVudHMueikgeyBvdXQyKys7IH1cbiAgICAgICAgfVxuICAgICAgICBpZiAob3V0MSA9PT0gZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGggfHwgb3V0MiA9PT0gZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGgpIHsgcmV0dXJuIDA7IH1cbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogISNlbiBvYmItcG9pbnQgaW50ZXJzZWN0PGJyLz5cbiAqICEjemgg5pa55ZCR5YyF5Zu055uS5ZKM54K555qE55u45Lqk5oCn5qOA5rWL44CCXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kIG9iYl9wb2ludFxuICogQHBhcmFtIHtnZW9tVXRpbHMuT2JifSBvYmIgRGlyZWN0aW9uIGJveFxuICogQHBhcmFtIHtnZW9tVXRpbHMuVmVjM30gcG9pbnRcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgb3IgZmFsc2VcbiAqL1xuY29uc3Qgb2JiX3BvaW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCB0bXAgPSBuZXcgVmVjMygwLCAwLCAwKSwgbTMgPSBuZXcgTWF0MygpO1xuICAgIGNvbnN0IGxlc3NUaGFuID0gZnVuY3Rpb24gKGE6IFZlYzMsIGI6IFZlYzMpOiBib29sZWFuIHsgcmV0dXJuIE1hdGguYWJzKGEueCkgPCBiLnggJiYgTWF0aC5hYnMoYS55KSA8IGIueSAmJiBNYXRoLmFicyhhLnopIDwgYi56OyB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAob2JiOiBvYmIsIHBvaW50OiBWZWMzKTogYm9vbGVhbiB7XG4gICAgICAgIFZlYzMuc3VidHJhY3QodG1wLCBwb2ludCwgb2JiLmNlbnRlcik7XG4gICAgICAgIFZlYzMudHJhbnNmb3JtTWF0Myh0bXAsIHRtcCwgTWF0My50cmFuc3Bvc2UobTMsIG9iYi5vcmllbnRhdGlvbikpO1xuICAgICAgICByZXR1cm4gbGVzc1RoYW4odG1wLCBvYmIuaGFsZkV4dGVudHMpO1xuICAgIH07XG59KSgpO1xuXG4vKipcbiAqICEjZW4gb2JiLXBsYW5lIGludGVyc2VjdDxici8+XG4gKiAhI3poIOaWueWQkeWMheWbtOebkuWSjOW5s+mdoueahOebuOS6pOaAp+ajgOa1i+OAglxuICogQHN0YXRpY1xuICogQG1ldGhvZCBvYmJfcGxhbmVcbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLk9iYn0gb2JiIERpcmVjdGlvbiBib3hcbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLlBsYW5lfSBwbGFuZVxuICogQHJldHVybiB7bnVtYmVyfSBpbnNpZGUoYmFjaykgPSAtMSwgb3V0c2lkZShmcm9udCkgPSAwLCBpbnRlcnNlY3QgPSAxXG4gKi9cbmNvbnN0IG9iYl9wbGFuZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgYWJzRG90ID0gZnVuY3Rpb24gKG46IFZlYzMsIHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKG4ueCAqIHggKyBuLnkgKiB5ICsgbi56ICogeik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9iYjogb2JiLCBwbGFuZTogcGxhbmUpOiBudW1iZXIge1xuICAgICAgICBsZXQgb2JibSA9IG9iYi5vcmllbnRhdGlvbi5tO1xuICAgICAgICAvLyBSZWFsLVRpbWUgQ29sbGlzaW9uIERldGVjdGlvbiwgQ2hyaXN0ZXIgRXJpY3NvbiwgcC4gMTYzLlxuICAgICAgICBjb25zdCByID0gb2JiLmhhbGZFeHRlbnRzLnggKiBhYnNEb3QocGxhbmUubiwgb2JibVswXSwgb2JibVsxXSwgb2JibVsyXSkgK1xuICAgICAgICAgICAgb2JiLmhhbGZFeHRlbnRzLnkgKiBhYnNEb3QocGxhbmUubiwgb2JibVszXSwgb2JibVs0XSwgb2JibVs1XSkgK1xuICAgICAgICAgICAgb2JiLmhhbGZFeHRlbnRzLnogKiBhYnNEb3QocGxhbmUubiwgb2JibVs2XSwgb2JibVs3XSwgb2JibVs4XSk7XG5cbiAgICAgICAgY29uc3QgZG90ID0gVmVjMy5kb3QocGxhbmUubiwgb2JiLmNlbnRlcik7XG4gICAgICAgIGlmIChkb3QgKyByIDwgcGxhbmUuZCkgeyByZXR1cm4gLTE7IH1cbiAgICAgICAgZWxzZSBpZiAoZG90IC0gciA+IHBsYW5lLmQpIHsgcmV0dXJuIDA7IH1cbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogISNlbiBvYmItZnJ1c3R1bSBpbnRlcnNlY3QsIGZhc3RlciBidXQgaGFzIGZhbHNlIHBvc2l0aXZlIGNvcm5lciBjYXNlczxici8+XG4gKiAhI3poIOaWueWQkeWMheWbtOebkuWSjOmUpeWPsOebuOS6pOaAp+ajgOa1i++8jOmAn+W6puW/q++8jOS9huaciemUmeivr+aDheWGteOAglxuICogQHN0YXRpY1xuICogQG1ldGhvZCBvYmJfZnJ1c3R1bVxuICogQHBhcmFtIHtnZW9tVXRpbHMuT2JifSBvYmIgRGlyZWN0aW9uIGJveFxuICogQHBhcmFtIHtnZW9tVXRpbHMuRnJ1c3R1bX0gZnJ1c3R1bVxuICogQHJldHVybiB7bnVtYmVyfSAwIG9yIG5vdCAwXG4gKi9cbmNvbnN0IG9iYl9mcnVzdHVtID0gZnVuY3Rpb24gKG9iYjogb2JiLCBmcnVzdHVtOiBmcnVzdHVtKTogbnVtYmVyIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZydXN0dW0ucGxhbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIGZydXN0dW0gcGxhbmUgbm9ybWFsIHBvaW50cyB0byB0aGUgaW5zaWRlXG4gICAgICAgIGlmIChvYmJfcGxhbmUob2JiLCBmcnVzdHVtLnBsYW5lc1tpXSkgPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH0gLy8gY29tcGxldGVseSBvdXRzaWRlXG4gICAgcmV0dXJuIDE7XG59O1xuXG4vLyBodHRwczovL2Nlc2l1bS5jb20vYmxvZy8yMDE3LzAyLzAyL3RpZ2h0ZXItZnJ1c3R1bS1jdWxsaW5nLWFuZC13aHkteW91LW1heS13YW50LXRvLWRpc3JlZ2FyZC1pdC9cbi8qKlxuICogISNlbiBvYmItZnJ1c3R1bSBpbnRlcnNlY3QsIGhhbmRsZXMgbW9zdCBvZiB0aGUgZmFsc2UgcG9zaXRpdmVzIGNvcnJlY3RseTxici8+XG4gKiAhI3poIOaWueWQkeWMheWbtOebkuWSjOmUpeWPsOebuOS6pOaAp+ajgOa1i++8jOato+ehruWkhOeQhuWkp+WkmuaVsOmUmeivr+aDheWGteOAglxuICogQHN0YXRpY1xuICogQG1ldGhvZCBvYmJfZnJ1c3R1bV9hY2N1cmF0ZVxuICogQHBhcmFtIHtnZW9tVXRpbHMuT2JifSBvYmIgRGlyZWN0aW9uIGJveFxuICogQHBhcmFtIHtnZW9tVXRpbHMuRnJ1c3R1bX0gZnJ1c3R1bVxuICogQHJldHVybiB7bnVtYmVyfSAwIG9yIG5vdCAwXG4gKi9cbmNvbnN0IG9iYl9mcnVzdHVtX2FjY3VyYXRlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCB0bXAgPSBuZXcgQXJyYXkoOCk7XG4gICAgbGV0IGRpc3QgPSAwLCBvdXQxID0gMCwgb3V0MiA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0bXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdG1wW2ldID0gbmV3IFZlYzMoMCwgMCwgMCk7XG4gICAgfVxuICAgIGNvbnN0IGRvdCA9IGZ1bmN0aW9uIChuOiBWZWMzLCB4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIG4ueCAqIHggKyBuLnkgKiB5ICsgbi56ICogejtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAob2JiOiBvYmIsIGZydXN0dW06IGZydXN0dW0pOiBudW1iZXIge1xuICAgICAgICBsZXQgcmVzdWx0ID0gMCwgaW50ZXJzZWN0cyA9IGZhbHNlO1xuICAgICAgICAvLyAxLiBvYmIgaW5zaWRlL291dHNpZGUgZnJ1c3R1bSB0ZXN0XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS5wbGFuZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IG9iYl9wbGFuZShvYmIsIGZydXN0dW0ucGxhbmVzW2ldKTtcbiAgICAgICAgICAgIC8vIGZydXN0dW0gcGxhbmUgbm9ybWFsIHBvaW50cyB0byB0aGUgaW5zaWRlXG4gICAgICAgICAgICBpZiAocmVzdWx0ID09PSAtMSkgeyByZXR1cm4gMDsgfSAvLyBjb21wbGV0ZWx5IG91dHNpZGVcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlc3VsdCA9PT0gMSkgeyBpbnRlcnNlY3RzID0gdHJ1ZTsgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghaW50ZXJzZWN0cykgeyByZXR1cm4gMTsgfSAvLyBjb21wbGV0ZWx5IGluc2lkZVxuICAgICAgICAvLyBpbiBjYXNlIG9mIGZhbHNlIHBvc2l0aXZlc1xuICAgICAgICAvLyAyLiBmcnVzdHVtIGluc2lkZS9vdXRzaWRlIG9iYiB0ZXN0XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgVmVjMy5zdWJ0cmFjdCh0bXBbaV0sIGZydXN0dW0udmVydGljZXNbaV0sIG9iYi5jZW50ZXIpO1xuICAgICAgICB9XG4gICAgICAgIG91dDEgPSAwLCBvdXQyID0gMDtcbiAgICAgICAgbGV0IG9iYm0gPSBvYmIub3JpZW50YXRpb24ubTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBkaXN0ID0gZG90KHRtcFtpXSwgb2JibVswXSwgb2JibVsxXSwgb2JibVsyXSk7XG4gICAgICAgICAgICBpZiAoZGlzdCA+IG9iYi5oYWxmRXh0ZW50cy54KSB7IG91dDErKzsgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZGlzdCA8IC1vYmIuaGFsZkV4dGVudHMueCkgeyBvdXQyKys7IH1cbiAgICAgICAgfVxuICAgICAgICBpZiAob3V0MSA9PT0gZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGggfHwgb3V0MiA9PT0gZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGgpIHsgcmV0dXJuIDA7IH1cbiAgICAgICAgb3V0MSA9IDA7IG91dDIgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZydXN0dW0udmVydGljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGRpc3QgPSBkb3QodG1wW2ldLCBvYmJtWzNdLCBvYmJtWzRdLCBvYmJtWzVdKTtcbiAgICAgICAgICAgIGlmIChkaXN0ID4gb2JiLmhhbGZFeHRlbnRzLnkpIHsgb3V0MSsrOyB9XG4gICAgICAgICAgICBlbHNlIGlmIChkaXN0IDwgLW9iYi5oYWxmRXh0ZW50cy55KSB7IG91dDIrKzsgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvdXQxID09PSBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aCB8fCBvdXQyID09PSBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aCkgeyByZXR1cm4gMDsgfVxuICAgICAgICBvdXQxID0gMDsgb3V0MiA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZGlzdCA9IGRvdCh0bXBbaV0sIG9iYm1bNl0sIG9iYm1bN10sIG9iYm1bOF0pO1xuICAgICAgICAgICAgaWYgKGRpc3QgPiBvYmIuaGFsZkV4dGVudHMueikgeyBvdXQxKys7IH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGRpc3QgPCAtb2JiLmhhbGZFeHRlbnRzLnopIHsgb3V0MisrOyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG91dDEgPT09IGZydXN0dW0udmVydGljZXMubGVuZ3RoIHx8IG91dDIgPT09IGZydXN0dW0udmVydGljZXMubGVuZ3RoKSB7IHJldHVybiAwOyB9XG4gICAgICAgIHJldHVybiAxO1xuICAgIH07XG59KSgpO1xuXG4vKipcbiAqICEjZW4gb2JiLW9iYiBpbnRlcnNlY3Q8YnIvPlxuICogISN6aCDmlrnlkJHljIXlm7Tnm5LlkozmlrnlkJHljIXlm7Tnm5LnmoTnm7jkuqTmgKfmo4DmtYvjgIJcbiAqIEBzdGF0aWNcbiAqIEBtZXRob2Qgb2JiX29iYlxuICogQHBhcmFtIHtnZW9tVXRpbHMuT2JifSBvYmIxIERpcmVjdGlvbiBib3gxXG4gKiBAcGFyYW0ge2dlb21VdGlscy5PYmJ9IG9iYjIgRGlyZWN0aW9uIGJveDJcbiAqIEByZXR1cm4ge251bWJlcn0gMCBvciBub3QgMFxuICovXG5jb25zdCBvYmJfb2JiID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCB0ZXN0ID0gbmV3IEFycmF5KDE1KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE1OyBpKyspIHtcbiAgICAgICAgdGVzdFtpXSA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIH1cblxuICAgIGNvbnN0IHZlcnRpY2VzID0gbmV3IEFycmF5KDgpO1xuICAgIGNvbnN0IHZlcnRpY2VzMiA9IG5ldyBBcnJheSg4KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDg7IGkrKykge1xuICAgICAgICB2ZXJ0aWNlc1tpXSA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgICAgICB2ZXJ0aWNlczJbaV0gPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKG9iYjE6IG9iYiwgb2JiMjogb2JiKTogbnVtYmVyIHtcblxuICAgICAgICBsZXQgb2JiMW0gPSBvYmIxLm9yaWVudGF0aW9uLm07XG4gICAgICAgIGxldCBvYmIybSA9IG9iYjIub3JpZW50YXRpb24ubTtcblxuICAgICAgICBWZWMzLnNldCh0ZXN0WzBdLCBvYmIxbVswXSwgb2JiMW1bMV0sIG9iYjFtWzJdKTtcbiAgICAgICAgVmVjMy5zZXQodGVzdFsxXSwgb2JiMW1bM10sIG9iYjFtWzRdLCBvYmIxbVs1XSk7XG4gICAgICAgIFZlYzMuc2V0KHRlc3RbMl0sIG9iYjFtWzZdLCBvYmIxbVs3XSwgb2JiMW1bOF0pO1xuICAgICAgICBWZWMzLnNldCh0ZXN0WzNdLCBvYmIybVswXSwgb2JiMm1bMV0sIG9iYjJtWzJdKTtcbiAgICAgICAgVmVjMy5zZXQodGVzdFs0XSwgb2JiMm1bM10sIG9iYjJtWzRdLCBvYmIybVs1XSk7XG4gICAgICAgIFZlYzMuc2V0KHRlc3RbNV0sIG9iYjJtWzZdLCBvYmIybVs3XSwgb2JiMm1bOF0pO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgKytpKSB7IC8vIEZpbGwgb3V0IHJlc3Qgb2YgYXhpc1xuICAgICAgICAgICAgVmVjMy5jcm9zcyh0ZXN0WzYgKyBpICogMyArIDBdLCB0ZXN0W2ldLCB0ZXN0WzBdKTtcbiAgICAgICAgICAgIFZlYzMuY3Jvc3ModGVzdFs2ICsgaSAqIDMgKyAxXSwgdGVzdFtpXSwgdGVzdFsxXSk7XG4gICAgICAgICAgICBWZWMzLmNyb3NzKHRlc3RbNiArIGkgKiAzICsgMV0sIHRlc3RbaV0sIHRlc3RbMl0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0T0JCVmVydGljZXMob2JiMS5jZW50ZXIsIG9iYjEuaGFsZkV4dGVudHMsIHRlc3RbMF0sIHRlc3RbMV0sIHRlc3RbMl0sIHZlcnRpY2VzKTtcbiAgICAgICAgZ2V0T0JCVmVydGljZXMob2JiMi5jZW50ZXIsIG9iYjIuaGFsZkV4dGVudHMsIHRlc3RbM10sIHRlc3RbNF0sIHRlc3RbNV0sIHZlcnRpY2VzMik7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNTsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBhID0gZ2V0SW50ZXJ2YWwodmVydGljZXMsIHRlc3RbaV0pO1xuICAgICAgICAgICAgY29uc3QgYiA9IGdldEludGVydmFsKHZlcnRpY2VzMiwgdGVzdFtpXSk7XG4gICAgICAgICAgICBpZiAoYlswXSA+IGFbMV0gfHwgYVswXSA+IGJbMV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDsgLy8gU2VwZXJhdGluZyBheGlzIGZvdW5kXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMTtcbiAgICB9O1xufSkoKTtcblxuLyoqXG4gKiAhI2VuIHBoZXJlLXBsYW5lIGludGVyc2VjdCwgbm90IG5lY2Vzc2FyaWx5IGZhc3RlciB0aGFuIG9iYi1wbGFuZTxici8+XG4gKiBkdWUgdG8gdGhlIGxlbmd0aCBjYWxjdWxhdGlvbiBvZiB0aGUgcGxhbmUgbm9ybWFsIHRvIGZhY3RvciBvdXQ8YnIvPlxuICogdGhlIHVubm9tYWxpemVkIHBsYW5lIGRpc3RhbmNlPGJyLz5cbiAqICEjemgg55CD5LiO5bmz6Z2i55qE55u45Lqk5oCn5qOA5rWL44CCXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kIHNwaGVyZV9wbGFuZVxuICogQHBhcmFtIHtnZW9tVXRpbHMuU3BoZXJlfSBzcGhlcmVcbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLlBsYW5lfSBwbGFuZVxuICogQHJldHVybiB7bnVtYmVyfSBpbnNpZGUoYmFjaykgPSAtMSwgb3V0c2lkZShmcm9udCkgPSAwLCBpbnRlcnNlY3QgPSAxXG4gKi9cbmNvbnN0IHNwaGVyZV9wbGFuZSA9IGZ1bmN0aW9uIChzcGhlcmU6IHNwaGVyZSwgcGxhbmU6IHBsYW5lKTogbnVtYmVyIHtcbiAgICBjb25zdCBkb3QgPSBWZWMzLmRvdChwbGFuZS5uLCBzcGhlcmUuY2VudGVyKTtcbiAgICBjb25zdCByID0gc3BoZXJlLnJhZGl1cyAqIHBsYW5lLm4ubGVuZ3RoKCk7XG4gICAgaWYgKGRvdCArIHIgPCBwbGFuZS5kKSB7IHJldHVybiAtMTsgfVxuICAgIGVsc2UgaWYgKGRvdCAtIHIgPiBwbGFuZS5kKSB7IHJldHVybiAwOyB9XG4gICAgcmV0dXJuIDE7XG59O1xuXG4vKipcbiAqICEjZW4gc3BoZXJlLWZydXN0dW0gaW50ZXJzZWN0LCBmYXN0ZXIgYnV0IGhhcyBmYWxzZSBwb3NpdGl2ZSBjb3JuZXIgY2FzZXM8YnIvPlxuICogISN6aCDnkIPlkozplKXlj7DnmoTnm7jkuqTmgKfmo4DmtYvvvIzpgJ/luqblv6vvvIzkvYbmnInplJnor6/mg4XlhrXjgIJcbiAqIEBzdGF0aWNcbiAqIEBtZXRob2Qgc3BoZXJlX2ZydXN0dW1cbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLlNwaGVyZX0gc3BoZXJlXG4gKiBAcGFyYW0ge2dlb21VdGlscy5GcnVzdHVtfSBmcnVzdHVtXG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAgb3Igbm90IDBcbiAqL1xuY29uc3Qgc3BoZXJlX2ZydXN0dW0gPSBmdW5jdGlvbiAoc3BoZXJlOiBzcGhlcmUsIGZydXN0dW06IGZydXN0dW0pOiBudW1iZXIge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS5wbGFuZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gZnJ1c3R1bSBwbGFuZSBub3JtYWwgcG9pbnRzIHRvIHRoZSBpbnNpZGVcbiAgICAgICAgaWYgKHNwaGVyZV9wbGFuZShzcGhlcmUsIGZydXN0dW0ucGxhbmVzW2ldKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfSAvLyBjb21wbGV0ZWx5IG91dHNpZGVcbiAgICByZXR1cm4gMTtcbn07XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzIwOTEyNjkyL3ZpZXctZnJ1c3R1bS1jdWxsaW5nLWNvcm5lci1jYXNlc1xuLyoqXG4gKiAhI2VuIHNwaGVyZS1mcnVzdHVtIGludGVyc2VjdCwgaGFuZGxlcyB0aGUgZmFsc2UgcG9zaXRpdmVzIGNvcnJlY3RseTxici8+XG4gKiAhI3poIOeQg+WSjOmUpeWPsOeahOebuOS6pOaAp+ajgOa1i++8jOato+ehruWkhOeQhuWkp+WkmuaVsOmUmeivr+aDheWGteOAglxuICogQHN0YXRpY1xuICogQG1ldGhvZCBzcGhlcmVfZnJ1c3R1bV9hY2N1cmF0ZVxuICogQHBhcmFtIHtnZW9tVXRpbHMuU3BoZXJlfSBzcGhlcmVcbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLkZydXN0dW19IGZydXN0dW1cbiAqIEByZXR1cm4ge251bWJlcn0gMCBvciBub3QgMFxuICovXG5jb25zdCBzcGhlcmVfZnJ1c3R1bV9hY2N1cmF0ZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgcHQgPSBuZXcgVmVjMygwLCAwLCAwKSwgbWFwID0gWzEsIC0xLCAxLCAtMSwgMSwgLTFdO1xuICAgIHJldHVybiBmdW5jdGlvbiAoc3BoZXJlOiBzcGhlcmUsIGZydXN0dW06IGZydXN0dW0pOiBudW1iZXIge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDY7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcGxhbmUgPSBmcnVzdHVtLnBsYW5lc1tpXTtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBzcGhlcmUucmFkaXVzLCBjID0gc3BoZXJlLmNlbnRlcjtcbiAgICAgICAgICAgIGNvbnN0IG4gPSBwbGFuZS5uLCBkID0gcGxhbmUuZDtcbiAgICAgICAgICAgIGNvbnN0IGRvdCA9IFZlYzMuZG90KG4sIGMpO1xuICAgICAgICAgICAgLy8gZnJ1c3R1bSBwbGFuZSBub3JtYWwgcG9pbnRzIHRvIHRoZSBpbnNpZGVcbiAgICAgICAgICAgIGlmIChkb3QgKyByIDwgZCkgeyByZXR1cm4gMDsgfSAvLyBjb21wbGV0ZWx5IG91dHNpZGVcbiAgICAgICAgICAgIGVsc2UgaWYgKGRvdCAtIHIgPiBkKSB7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAvLyBpbiBjYXNlIG9mIGZhbHNlIHBvc2l0aXZlc1xuICAgICAgICAgICAgLy8gaGFzIGZhbHNlIG5lZ2F0aXZlcywgc3RpbGwgd29ya2luZyBvbiBpdFxuICAgICAgICAgICAgVmVjMy5hZGQocHQsIGMsIFZlYzMubXVsdGlwbHlTY2FsYXIocHQsIG4sIHIpKTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgNjsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGogPT09IGkgfHwgaiA9PT0gaSArIG1hcFtpXSkgeyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3QgPSBmcnVzdHVtLnBsYW5lc1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoVmVjMy5kb3QodGVzdC5uLCBwdCkgPCB0ZXN0LmQpIHsgcmV0dXJuIDA7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMTtcbiAgICB9O1xufSkoKTtcblxuLyoqXG4gKiAhI2VuIHNwaGVyZS1zcGhlcmUgaW50ZXJzZWN0PGJyLz5cbiAqICEjemgg55CD5ZKM55CD55qE55u45Lqk5oCn5qOA5rWL44CCXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kIHNwaGVyZV9zcGhlcmVcbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLlNwaGVyZX0gc3BoZXJlMFxuICogQHBhcmFtIHtnZW9tVXRpbHMuU3BoZXJlfSBzcGhlcmUxXG4gKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIG9yIGZhbHNlXG4gKi9cbmNvbnN0IHNwaGVyZV9zcGhlcmUgPSBmdW5jdGlvbiAoc3BoZXJlMDogc3BoZXJlLCBzcGhlcmUxOiBzcGhlcmUpOiBib29sZWFuIHtcbiAgICBjb25zdCByID0gc3BoZXJlMC5yYWRpdXMgKyBzcGhlcmUxLnJhZGl1cztcbiAgICByZXR1cm4gVmVjMy5zcXVhcmVkRGlzdGFuY2Uoc3BoZXJlMC5jZW50ZXIsIHNwaGVyZTEuY2VudGVyKSA8IHIgKiByO1xufTtcblxuLyoqXG4gKiAhI2VuIHNwaGVyZS1hYWJiIGludGVyc2VjdDxici8+XG4gKiAhI3poIOeQg+WSjOi9tOWvuem9kOWMheWbtOebkueahOebuOS6pOaAp+ajgOa1i+OAglxuICogQHN0YXRpY1xuICogQG1ldGhvZCBzcGhlcmVfYWFiYlxuICogQHBhcmFtIHtnZW9tVXRpbHMuU3BoZXJlfSBzcGhlcmVcbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLkFhYmJ9IGFhYmJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgb3IgZmFsc2VcbiAqL1xuY29uc3Qgc3BoZXJlX2FhYmIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHB0ID0gbmV3IFZlYzMoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHNwaGVyZTogc3BoZXJlLCBhYWJiOiBhYWJiKTogYm9vbGVhbiB7XG4gICAgICAgIGRpc3RhbmNlLnB0X3BvaW50X2FhYmIocHQsIHNwaGVyZS5jZW50ZXIsIGFhYmIpO1xuICAgICAgICByZXR1cm4gVmVjMy5zcXVhcmVkRGlzdGFuY2Uoc3BoZXJlLmNlbnRlciwgcHQpIDwgc3BoZXJlLnJhZGl1cyAqIHNwaGVyZS5yYWRpdXM7XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogISNlbiBzcGhlcmUtb2JiIGludGVyc2VjdDxici8+XG4gKiAhI3poIOeQg+WSjOaWueWQkeWMheWbtOebkueahOebuOS6pOaAp+ajgOa1i+OAglxuICogQHN0YXRpY1xuICogQG1ldGhvZCBzcGhlcmVfb2JiXG4gKiBAcGFyYW0ge2dlb21VdGlscy5TcGhlcmV9IHNwaGVyZVxuICogQHBhcmFtIHtnZW9tVXRpbHMuT2JifSBvYmJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgb3IgZmFsc2VcbiAqL1xuY29uc3Qgc3BoZXJlX29iYiA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgcHQgPSBuZXcgVmVjMygpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoc3BoZXJlOiBzcGhlcmUsIG9iYjogb2JiKTogYm9vbGVhbiB7XG4gICAgICAgIGRpc3RhbmNlLnB0X3BvaW50X29iYihwdCwgc3BoZXJlLmNlbnRlciwgb2JiKTtcbiAgICAgICAgcmV0dXJuIFZlYzMuc3F1YXJlZERpc3RhbmNlKHNwaGVyZS5jZW50ZXIsIHB0KSA8IHNwaGVyZS5yYWRpdXMgKiBzcGhlcmUucmFkaXVzO1xuICAgIH07XG59KSgpO1xuXG5jb25zdCBpbnRlcnNlY3QgPSB7XG4gICAgLy8gb2xkIGFwaVxuICAgIHJheUFhYmIsXG4gICAgcmF5TWVzaCxcbiAgICByYXljYXN0LFxuICAgIHJheVRyaWFuZ2xlLFxuXG4gICAgcmF5X3NwaGVyZSxcbiAgICByYXlfYWFiYixcbiAgICByYXlfb2JiLFxuICAgIHJheV9wbGFuZSxcbiAgICByYXlfdHJpYW5nbGUsXG4gICAgbGluZV9wbGFuZSxcbiAgICBsaW5lX3RyaWFuZ2xlLFxuICAgIGxpbmVfcXVhZCxcblxuICAgIHNwaGVyZV9zcGhlcmUsXG4gICAgc3BoZXJlX2FhYmIsXG4gICAgc3BoZXJlX29iYixcbiAgICBzcGhlcmVfcGxhbmUsXG4gICAgc3BoZXJlX2ZydXN0dW0sXG4gICAgc3BoZXJlX2ZydXN0dW1fYWNjdXJhdGUsXG5cbiAgICBhYWJiX2FhYmIsXG4gICAgYWFiYl9vYmIsXG4gICAgYWFiYl9wbGFuZSxcbiAgICBhYWJiX2ZydXN0dW0sXG4gICAgYWFiYl9mcnVzdHVtX2FjY3VyYXRlLFxuXG4gICAgb2JiX29iYixcbiAgICBvYmJfcGxhbmUsXG4gICAgb2JiX2ZydXN0dW0sXG4gICAgb2JiX2ZydXN0dW1fYWNjdXJhdGUsXG4gICAgb2JiX3BvaW50LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFRoZSBpbnRlcnNlY3Rpb24gZGV0ZWN0aW9uIG9mIGcxIGFuZCBnMiBjYW4gZmlsbCBpbiB0aGUgc2hhcGUgaW4gdGhlIGJhc2ljIGdlb21ldHJ5LlxuICAgICAqICEjemhcbiAgICAgKiBnMSDlkowgZzIg55qE55u45Lqk5oCn5qOA5rWL77yM5Y+v5aGr5YWl5Z+656GA5Yeg5L2V5Lit55qE5b2i54q244CCXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZXRob2QgcmVzb2x2ZVxuICAgICAqIEBwYXJhbSBnMSBHZW9tZXRyeSAxXG4gICAgICogQHBhcmFtIGcyIEdlb21ldHJ5IDJcbiAgICAgKiBAcGFyYW0gb3V0UHQgb3B0aW9uYWwsIEludGVyc2VjdGlvbiBwb2ludC4gKG5vdGU6IG9ubHkgcGFydGlhbCBzaGFwZSBkZXRlY3Rpb24gd2l0aCB0aGlzIHJldHVybiB2YWx1ZSlcbiAgICAgKi9cbiAgICByZXNvbHZlIChnMTogYW55LCBnMjogYW55LCBvdXRQdCA9IG51bGwpIHtcbiAgICAgICAgY29uc3QgdHlwZTEgPSBnMS5fdHlwZSwgdHlwZTIgPSBnMi5fdHlwZTtcbiAgICAgICAgY29uc3QgcmVzb2x2ZXIgPSB0aGlzW3R5cGUxIHwgdHlwZTJdO1xuICAgICAgICBpZiAodHlwZTEgPCB0eXBlMikgeyByZXR1cm4gcmVzb2x2ZXIoZzEsIGcyLCBvdXRQdCk7IH1cbiAgICAgICAgZWxzZSB7IHJldHVybiByZXNvbHZlcihnMiwgZzEsIG91dFB0KTsgfVxuICAgIH0sXG59O1xuXG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfUkFZIHwgZW51bXMuU0hBUEVfU1BIRVJFXSA9IHJheV9zcGhlcmU7XG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfUkFZIHwgZW51bXMuU0hBUEVfQUFCQl0gPSByYXlfYWFiYjtcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9SQVkgfCBlbnVtcy5TSEFQRV9PQkJdID0gcmF5X29iYjtcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9SQVkgfCBlbnVtcy5TSEFQRV9QTEFORV0gPSByYXlfcGxhbmU7XG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfUkFZIHwgZW51bXMuU0hBUEVfVFJJQU5HTEVdID0gcmF5X3RyaWFuZ2xlO1xuaW50ZXJzZWN0W2VudW1zLlNIQVBFX0xJTkUgfCBlbnVtcy5TSEFQRV9QTEFORV0gPSBsaW5lX3BsYW5lO1xuaW50ZXJzZWN0W2VudW1zLlNIQVBFX0xJTkUgfCBlbnVtcy5TSEFQRV9UUklBTkdMRV0gPSBsaW5lX3RyaWFuZ2xlO1xuXG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfU1BIRVJFXSA9IHNwaGVyZV9zcGhlcmU7XG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfU1BIRVJFIHwgZW51bXMuU0hBUEVfQUFCQl0gPSBzcGhlcmVfYWFiYjtcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9TUEhFUkUgfCBlbnVtcy5TSEFQRV9PQkJdID0gc3BoZXJlX29iYjtcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9TUEhFUkUgfCBlbnVtcy5TSEFQRV9QTEFORV0gPSBzcGhlcmVfcGxhbmU7XG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfU1BIRVJFIHwgZW51bXMuU0hBUEVfRlJVU1RVTV0gPSBzcGhlcmVfZnJ1c3R1bTtcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9TUEhFUkUgfCBlbnVtcy5TSEFQRV9GUlVTVFVNX0FDQ1VSQVRFXSA9IHNwaGVyZV9mcnVzdHVtX2FjY3VyYXRlO1xuXG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfQUFCQl0gPSBhYWJiX2FhYmI7XG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfQUFCQiB8IGVudW1zLlNIQVBFX09CQl0gPSBhYWJiX29iYjtcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9BQUJCIHwgZW51bXMuU0hBUEVfUExBTkVdID0gYWFiYl9wbGFuZTtcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9BQUJCIHwgZW51bXMuU0hBUEVfRlJVU1RVTV0gPSBhYWJiX2ZydXN0dW07XG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfQUFCQiB8IGVudW1zLlNIQVBFX0ZSVVNUVU1fQUNDVVJBVEVdID0gYWFiYl9mcnVzdHVtX2FjY3VyYXRlO1xuXG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfT0JCXSA9IG9iYl9vYmI7XG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfT0JCIHwgZW51bXMuU0hBUEVfUExBTkVdID0gb2JiX3BsYW5lO1xuaW50ZXJzZWN0W2VudW1zLlNIQVBFX09CQiB8IGVudW1zLlNIQVBFX0ZSVVNUVU1dID0gb2JiX2ZydXN0dW07XG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfT0JCIHwgZW51bXMuU0hBUEVfRlJVU1RVTV9BQ0NVUkFURV0gPSBvYmJfZnJ1c3R1bV9hY2N1cmF0ZTtcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJzZWN0O1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=