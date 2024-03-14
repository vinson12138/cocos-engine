
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/webgl/assemblers/graphics/index.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _assembler = _interopRequireDefault(require("../../../assembler"));

var _inputAssembler = _interopRequireDefault(require("../../../../../renderer/core/input-assembler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MeshBuffer = require('../../mesh-buffer');

var renderer = require('../../../index');

var Graphics = require('../../../../graphics/graphics');

var PointFlags = require('../../../../graphics/types').PointFlags;

var LineJoin = Graphics.LineJoin;
var LineCap = Graphics.LineCap;

var Earcut = require('./earcut');

require('./impl');

var MAX_VERTEX = 65535;
var MAX_INDICE = MAX_VERTEX * 2;
var PI = Math.PI;
var min = Math.min;
var max = Math.max;
var ceil = Math.ceil;
var acos = Math.acos;
var cos = Math.cos;
var sin = Math.sin;
var atan2 = Math.atan2;

function curveDivs(r, arc, tol) {
  var da = acos(r / (r + tol)) * 2.0;
  return max(2, ceil(arc / da));
}

function clamp(v, min, max) {
  if (v < min) {
    return min;
  } else if (v > max) {
    return max;
  }

  return v;
}

var gfx = cc.gfx;
var vfmtPosColorSdf = new gfx.VertexFormat([{
  name: gfx.ATTR_POSITION,
  type: gfx.ATTR_TYPE_FLOAT32,
  num: 2
}, {
  name: gfx.ATTR_COLOR,
  type: gfx.ATTR_TYPE_UINT8,
  num: 4,
  normalize: true
}, {
  name: 'a_dist',
  type: gfx.ATTR_TYPE_FLOAT32,
  num: 1
}]);
vfmtPosColorSdf.name = 'vfmtPosColorSdf';

var GraphicsAssembler = /*#__PURE__*/function (_Assembler) {
  _inheritsLoose(GraphicsAssembler, _Assembler);

  function GraphicsAssembler(graphics) {
    var _this;

    _this = _Assembler.call(this, graphics) || this;
    _this._buffer = null;
    _this._buffers = [];
    _this._bufferOffset = 0;
    return _this;
  }

  var _proto = GraphicsAssembler.prototype;

  _proto.getVfmt = function getVfmt() {
    return vfmtPosColorSdf;
  };

  _proto.getVfmtFloatCount = function getVfmtFloatCount() {
    return 4;
  };

  _proto.requestBuffer = function requestBuffer() {
    var buffer = {
      indiceStart: 0,
      vertexStart: 0
    };
    var meshbuffer = new MeshBuffer(renderer._handle, this.getVfmt());
    buffer.meshbuffer = meshbuffer;
    var ia = new _inputAssembler["default"](meshbuffer._vb, meshbuffer._ib);
    buffer.ia = ia;

    this._buffers.push(buffer);

    return buffer;
  };

  _proto.getBuffers = function getBuffers() {
    if (this._buffers.length === 0) {
      this.requestBuffer();
    }

    return this._buffers;
  };

  _proto.clear = function clear(clean) {
    this._bufferOffset = 0;
    var datas = this._buffers;

    if (clean) {
      for (var i = 0, l = datas.length; i < l; i++) {
        var data = datas[i];
        data.meshbuffer.destroy();
        data.meshbuffer = null;
      }

      datas.length = 0;
    } else {
      for (var _i = 0, _l = datas.length; _i < _l; _i++) {
        var _data = datas[_i];
        _data.indiceStart = 0;
        _data.vertexStart = 0;
        var meshbuffer = _data.meshbuffer;
        meshbuffer.reset();
      }
    }
  };

  _proto.fillBuffers = function fillBuffers(graphics, renderer) {
    renderer._flush();

    renderer.node = graphics.node;
    renderer.material = graphics._materials[0];
    var buffers = this.getBuffers();

    for (var index = 0, length = buffers.length; index < length; index++) {
      var buffer = buffers[index];
      var meshbuffer = buffer.meshbuffer;
      buffer.ia._count = buffer.indiceStart;

      renderer._flushIA(buffer.ia);

      meshbuffer.uploadData();
    }
  };

  _proto.genBuffer = function genBuffer(graphics, cverts) {
    var buffers = this.getBuffers();
    var buffer = buffers[this._bufferOffset];
    var meshbuffer = buffer.meshbuffer;
    var maxVertsCount = buffer.vertexStart + cverts;

    if (maxVertsCount > MAX_VERTEX || maxVertsCount * 3 > MAX_INDICE) {
      ++this._bufferOffset;
      maxVertsCount = cverts;

      if (this._bufferOffset < buffers.length) {
        buffer = buffers[this._bufferOffset];
      } else {
        buffer = this.requestBuffer(graphics);
        buffers[this._bufferOffset] = buffer;
      }

      meshbuffer = buffer.meshbuffer;
    }

    if (maxVertsCount > meshbuffer.vertexOffset) {
      meshbuffer.requestStatic(cverts, cverts * 3);
    }

    this._buffer = buffer;
    return buffer;
  };

  _proto.stroke = function stroke(graphics) {
    this._curColor = graphics._strokeColor._val;

    this._flattenPaths(graphics._impl);

    this._expandStroke(graphics);

    graphics._impl._updatePathOffset = true;
  };

  _proto.fill = function fill(graphics) {
    this._curColor = graphics._fillColor._val;

    this._expandFill(graphics);

    graphics._impl._updatePathOffset = true;
  };

  _proto._expandStroke = function _expandStroke(graphics) {
    var w = graphics.lineWidth * 0.5,
        lineCap = graphics.lineCap,
        lineJoin = graphics.lineJoin,
        miterLimit = graphics.miterLimit;
    var impl = graphics._impl;
    var ncap = curveDivs(w, PI, impl._tessTol);

    this._calculateJoins(impl, w, lineJoin, miterLimit);

    var paths = impl._paths; // Calculate max vertex usage.

    var cverts = 0;

    for (var i = impl._pathOffset, l = impl._pathLength; i < l; i++) {
      var path = paths[i];
      var pointsLength = path.points.length;
      if (lineJoin === LineJoin.ROUND) cverts += (pointsLength + path.nbevel * (ncap + 2) + 1) * 2; // plus one for loop
      else cverts += (pointsLength + path.nbevel * 5 + 1) * 2; // plus one for loop

      if (!path.closed) {
        // space for caps
        if (lineCap === LineCap.ROUND) {
          cverts += (ncap * 2 + 2) * 2;
        } else {
          cverts += (3 + 3) * 2;
        }
      }
    }

    var buffer = this.genBuffer(graphics, cverts),
        meshbuffer = buffer.meshbuffer,
        vData = meshbuffer._vData,
        iData = meshbuffer._iData;

    for (var _i2 = impl._pathOffset, _l2 = impl._pathLength; _i2 < _l2; _i2++) {
      var _path = paths[_i2];
      var pts = _path.points;
      var _pointsLength = pts.length;
      var offset = buffer.vertexStart;
      var p0 = void 0,
          p1 = void 0;
      var start = void 0,
          end = void 0,
          loop = void 0;
      loop = _path.closed;

      if (loop) {
        // Looping
        p0 = pts[_pointsLength - 1];
        p1 = pts[0];
        start = 0;
        end = _pointsLength;
      } else {
        // Add cap
        p0 = pts[0];
        p1 = pts[1];
        start = 1;
        end = _pointsLength - 1;
      }

      p1 = p1 || p0;

      if (!loop) {
        // Add cap
        var dPos = p1.sub(p0);
        dPos.normalizeSelf();
        var dx = dPos.x;
        var dy = dPos.y;
        if (lineCap === LineCap.BUTT) this._buttCapStart(p0, dx, dy, w, 0);else if (lineCap === LineCap.SQUARE) this._buttCapStart(p0, dx, dy, w, w);else if (lineCap === LineCap.ROUND) this._roundCapStart(p0, dx, dy, w, ncap);
      }

      for (var j = start; j < end; ++j) {
        if (lineJoin === LineJoin.ROUND) {
          this._roundJoin(p0, p1, w, w, ncap);
        } else if ((p1.flags & (PointFlags.PT_BEVEL | PointFlags.PT_INNERBEVEL)) !== 0) {
          this._bevelJoin(p0, p1, w, w);
        } else {
          this._vset(p1.x + p1.dmx * w, p1.y + p1.dmy * w, 1);

          this._vset(p1.x - p1.dmx * w, p1.y - p1.dmy * w, -1);
        }

        p0 = p1;
        p1 = pts[j + 1];
      }

      if (loop) {
        // Loop it
        var floatCount = this.getVfmtFloatCount();
        var vDataoOfset = offset * floatCount;

        this._vset(vData[vDataoOfset], vData[vDataoOfset + 1], 1);

        this._vset(vData[vDataoOfset + floatCount], vData[vDataoOfset + floatCount + 1], -1);
      } else {
        // Add cap
        var _dPos = p1.sub(p0);

        _dPos.normalizeSelf();

        var _dx = _dPos.x;
        var _dy = _dPos.y;
        if (lineCap === LineCap.BUTT) this._buttCapEnd(p1, _dx, _dy, w, 0);else if (lineCap === LineCap.SQUARE) this._buttCapEnd(p1, _dx, _dy, w, w);else if (lineCap === LineCap.ROUND) this._roundCapEnd(p1, _dx, _dy, w, ncap);
      } // stroke indices


      var indicesOffset = buffer.indiceStart;

      for (var _start = offset + 2, _end = buffer.vertexStart; _start < _end; _start++) {
        iData[indicesOffset++] = _start - 2;
        iData[indicesOffset++] = _start - 1;
        iData[indicesOffset++] = _start;
      }

      buffer.indiceStart = indicesOffset;
    }
  };

  _proto._expandFill = function _expandFill(graphics) {
    var impl = graphics._impl;
    var paths = impl._paths; // Calculate max vertex usage.

    var cverts = 0;

    for (var i = impl._pathOffset, l = impl._pathLength; i < l; i++) {
      var path = paths[i];
      var pointsLength = path.points.length;
      cverts += pointsLength;
    }

    var buffer = this.genBuffer(graphics, cverts),
        meshbuffer = buffer.meshbuffer,
        vData = meshbuffer._vData,
        iData = meshbuffer._iData;

    for (var _i3 = impl._pathOffset, _l3 = impl._pathLength; _i3 < _l3; _i3++) {
      var _path2 = paths[_i3];
      var pts = _path2.points;
      var _pointsLength2 = pts.length;

      if (_pointsLength2 === 0) {
        continue;
      } // Calculate shape vertices.


      var offset = buffer.vertexStart;

      for (var j = 0; j < _pointsLength2; ++j) {
        this._vset(pts[j].x, pts[j].y);
      }

      var indicesOffset = buffer.indiceStart;

      if (_path2.complex) {
        var earcutData = [];
        var floatCount = this.getVfmtFloatCount();

        for (var _j = offset, end = buffer.vertexStart; _j < end; _j++) {
          var vDataOffset = _j * floatCount;
          earcutData.push(vData[vDataOffset]);
          earcutData.push(vData[vDataOffset + 1]);
        }

        var newIndices = Earcut(earcutData, null, 2);

        if (!newIndices || newIndices.length === 0) {
          continue;
        }

        for (var _j2 = 0, nIndices = newIndices.length; _j2 < nIndices; _j2++) {
          iData[indicesOffset++] = newIndices[_j2] + offset;
        }
      } else {
        var first = offset;

        for (var start = offset + 2, _end2 = buffer.vertexStart; start < _end2; start++) {
          iData[indicesOffset++] = first;
          iData[indicesOffset++] = start - 1;
          iData[indicesOffset++] = start;
        }
      }

      buffer.indiceStart = indicesOffset;
    }
  };

  _proto._calculateJoins = function _calculateJoins(impl, w, lineJoin, miterLimit) {
    var iw = 0.0;

    if (w > 0.0) {
      iw = 1 / w;
    } // Calculate which joins needs extra vertices to append, and gather vertex count.


    var paths = impl._paths;

    for (var i = impl._pathOffset, l = impl._pathLength; i < l; i++) {
      var path = paths[i];
      var pts = path.points;
      var ptsLength = pts.length;
      var p0 = pts[ptsLength - 1];
      var p1 = pts[0];
      var nleft = 0;
      path.nbevel = 0;

      for (var j = 0; j < ptsLength; j++) {
        var dmr2 = void 0,
            cross = void 0,
            limit = void 0; // perp normals

        var dlx0 = p0.dy;
        var dly0 = -p0.dx;
        var dlx1 = p1.dy;
        var dly1 = -p1.dx; // Calculate extrusions

        p1.dmx = (dlx0 + dlx1) * 0.5;
        p1.dmy = (dly0 + dly1) * 0.5;
        dmr2 = p1.dmx * p1.dmx + p1.dmy * p1.dmy;

        if (dmr2 > 0.000001) {
          var scale = 1 / dmr2;

          if (scale > 600) {
            scale = 600;
          }

          p1.dmx *= scale;
          p1.dmy *= scale;
        } // Keep track of left turns.


        cross = p1.dx * p0.dy - p0.dx * p1.dy;

        if (cross > 0) {
          nleft++;
          p1.flags |= PointFlags.PT_LEFT;
        } // Calculate if we should use bevel or miter for inner join.


        limit = max(11, min(p0.len, p1.len) * iw);

        if (dmr2 * limit * limit < 1) {
          p1.flags |= PointFlags.PT_INNERBEVEL;
        } // Check whether dm length is too long


        var dmwx = p1.dmx * w;
        var dmwy = p1.dmy * w;
        var dmlen = dmwx * dmwx + dmwy * dmwy;

        if (dmlen > p1.len * p1.len || dmlen > p0.len * p0.len) {
          p1.flags |= PointFlags.PT_INNERBEVEL;
        } // Check to see if the corner needs to be beveled.


        if (p1.flags & PointFlags.PT_CORNER) {
          if (dmr2 * miterLimit * miterLimit < 1 || lineJoin === LineJoin.BEVEL || lineJoin === LineJoin.ROUND) {
            p1.flags |= PointFlags.PT_BEVEL;
          }
        }

        if ((p1.flags & (PointFlags.PT_BEVEL | PointFlags.PT_INNERBEVEL)) !== 0) {
          path.nbevel++;
        }

        p0 = p1;
        p1 = pts[j + 1];
      }
    }
  };

  _proto._flattenPaths = function _flattenPaths(impl) {
    var paths = impl._paths;

    for (var i = impl._pathOffset, l = impl._pathLength; i < l; i++) {
      var path = paths[i];
      var pts = path.points;
      var p0 = pts[pts.length - 1];
      var p1 = pts[0];

      if (pts.length > 2 && p0.equals(p1)) {
        path.closed = true;
        pts.pop();
        p0 = pts[pts.length - 1];
      }

      for (var j = 0, size = pts.length; j < size; j++) {
        // Calculate segment direction and length
        var dPos = p1.sub(p0);
        p0.len = dPos.mag();
        if (dPos.x || dPos.y) dPos.normalizeSelf();
        p0.dx = dPos.x;
        p0.dy = dPos.y; // Advance

        p0 = p1;
        p1 = pts[j + 1];
      }
    }
  };

  _proto._chooseBevel = function _chooseBevel(bevel, p0, p1, w) {
    var x = p1.x;
    var y = p1.y;
    var x0, y0, x1, y1;

    if (bevel !== 0) {
      x0 = x + p0.dy * w;
      y0 = y - p0.dx * w;
      x1 = x + p1.dy * w;
      y1 = y - p1.dx * w;
    } else {
      x0 = x1 = x + p1.dmx * w;
      y0 = y1 = y + p1.dmy * w;
    }

    return [x0, y0, x1, y1];
  };

  _proto._buttCapStart = function _buttCapStart(p, dx, dy, w, d) {
    var px = p.x - dx * d;
    var py = p.y - dy * d;
    var dlx = dy;
    var dly = -dx;

    this._vset(px + dlx * w, py + dly * w, 1);

    this._vset(px - dlx * w, py - dly * w, -1);
  };

  _proto._buttCapEnd = function _buttCapEnd(p, dx, dy, w, d) {
    var px = p.x + dx * d;
    var py = p.y + dy * d;
    var dlx = dy;
    var dly = -dx;

    this._vset(px + dlx * w, py + dly * w, 1);

    this._vset(px - dlx * w, py - dly * w, -1);
  };

  _proto._roundCapStart = function _roundCapStart(p, dx, dy, w, ncap) {
    var px = p.x;
    var py = p.y;
    var dlx = dy;
    var dly = -dx;

    for (var i = 0; i < ncap; i++) {
      var a = i / (ncap - 1) * PI;
      var ax = cos(a) * w,
          ay = sin(a) * w;

      this._vset(px - dlx * ax - dx * ay, py - dly * ax - dy * ay, 1);

      this._vset(px, py, 0);
    }

    this._vset(px + dlx * w, py + dly * w, 1);

    this._vset(px - dlx * w, py - dly * w, -1);
  };

  _proto._roundCapEnd = function _roundCapEnd(p, dx, dy, w, ncap) {
    var px = p.x;
    var py = p.y;
    var dlx = dy;
    var dly = -dx;

    this._vset(px + dlx * w, py + dly * w, 1);

    this._vset(px - dlx * w, py - dly * w, -1);

    for (var i = 0; i < ncap; i++) {
      var a = i / (ncap - 1) * PI;
      var ax = cos(a) * w,
          ay = sin(a) * w;

      this._vset(px, py, 0);

      this._vset(px - dlx * ax + dx * ay, py - dly * ax + dy * ay, 1);
    }
  };

  _proto._roundJoin = function _roundJoin(p0, p1, lw, rw, ncap) {
    var dlx0 = p0.dy;
    var dly0 = -p0.dx;
    var dlx1 = p1.dy;
    var dly1 = -p1.dx;
    var p1x = p1.x;
    var p1y = p1.y;

    if ((p1.flags & PointFlags.PT_LEFT) !== 0) {
      var out = this._chooseBevel(p1.flags & PointFlags.PT_INNERBEVEL, p0, p1, lw);

      var lx0 = out[0];
      var ly0 = out[1];
      var lx1 = out[2];
      var ly1 = out[3];
      var a0 = atan2(-dly0, -dlx0);
      var a1 = atan2(-dly1, -dlx1);
      if (a1 > a0) a1 -= PI * 2;

      this._vset(lx0, ly0, 1);

      this._vset(p1x - dlx0 * rw, p1.y - dly0 * rw, -1);

      var n = clamp(ceil((a0 - a1) / PI) * ncap, 2, ncap);

      for (var i = 0; i < n; i++) {
        var u = i / (n - 1);
        var a = a0 + u * (a1 - a0);
        var rx = p1x + cos(a) * rw;
        var ry = p1y + sin(a) * rw;

        this._vset(p1x, p1y, 0);

        this._vset(rx, ry, -1);
      }

      this._vset(lx1, ly1, 1);

      this._vset(p1x - dlx1 * rw, p1y - dly1 * rw, -1);
    } else {
      var _out = this._chooseBevel(p1.flags & PointFlags.PT_INNERBEVEL, p0, p1, -rw);

      var rx0 = _out[0];
      var ry0 = _out[1];
      var rx1 = _out[2];
      var ry1 = _out[3];

      var _a = atan2(dly0, dlx0);

      var _a2 = atan2(dly1, dlx1);

      if (_a2 < _a) _a2 += PI * 2;

      this._vset(p1x + dlx0 * rw, p1y + dly0 * rw, 1);

      this._vset(rx0, ry0, -1);

      var _n = clamp(ceil((_a2 - _a) / PI) * ncap, 2, ncap);

      for (var _i4 = 0; _i4 < _n; _i4++) {
        var _u = _i4 / (_n - 1);

        var _a3 = _a + _u * (_a2 - _a);

        var lx = p1x + cos(_a3) * lw;
        var ly = p1y + sin(_a3) * lw;

        this._vset(lx, ly, 1);

        this._vset(p1x, p1y, 0);
      }

      this._vset(p1x + dlx1 * rw, p1y + dly1 * rw, 1);

      this._vset(rx1, ry1, -1);
    }
  };

  _proto._bevelJoin = function _bevelJoin(p0, p1, lw, rw) {
    var rx0, ry0, rx1, ry1;
    var lx0, ly0, lx1, ly1;
    var dlx0 = p0.dy;
    var dly0 = -p0.dx;
    var dlx1 = p1.dy;
    var dly1 = -p1.dx;

    if (p1.flags & PointFlags.PT_LEFT) {
      var out = this._chooseBevel(p1.flags & PointFlags.PT_INNERBEVEL, p0, p1, lw);

      lx0 = out[0];
      ly0 = out[1];
      lx1 = out[2];
      ly1 = out[3];

      this._vset(lx0, ly0, 1);

      this._vset(p1.x - dlx0 * rw, p1.y - dly0 * rw, -1);

      this._vset(lx1, ly1, 1);

      this._vset(p1.x - dlx1 * rw, p1.y - dly1 * rw, -1);
    } else {
      var _out2 = this._chooseBevel(p1.flags & PointFlags.PT_INNERBEVEL, p0, p1, -rw);

      rx0 = _out2[0];
      ry0 = _out2[1];
      rx1 = _out2[2];
      ry1 = _out2[3];

      this._vset(p1.x + dlx0 * lw, p1.y + dly0 * lw, 1);

      this._vset(rx0, ry0, -1);

      this._vset(p1.x + dlx1 * lw, p1.y + dly1 * lw, 1);

      this._vset(rx1, ry1, -1);
    }
  };

  _proto._vset = function _vset(x, y, distance) {
    if (distance === void 0) {
      distance = 0;
    }

    var buffer = this._buffer;
    var meshbuffer = buffer.meshbuffer;
    var dataOffset = buffer.vertexStart * this.getVfmtFloatCount();
    var vData = meshbuffer._vData;
    var uintVData = meshbuffer._uintVData;
    vData[dataOffset] = x;
    vData[dataOffset + 1] = y;
    uintVData[dataOffset + 2] = this._curColor;
    vData[dataOffset + 3] = distance;
    buffer.vertexStart++;
    meshbuffer._dirty = true;
  };

  return GraphicsAssembler;
}(_assembler["default"]);

exports["default"] = GraphicsAssembler;

_assembler["default"].register(cc.Graphics, GraphicsAssembler);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL3dlYmdsL2Fzc2VtYmxlcnMvZ3JhcGhpY3MvaW5kZXguanMiXSwibmFtZXMiOlsiTWVzaEJ1ZmZlciIsInJlcXVpcmUiLCJyZW5kZXJlciIsIkdyYXBoaWNzIiwiUG9pbnRGbGFncyIsIkxpbmVKb2luIiwiTGluZUNhcCIsIkVhcmN1dCIsIk1BWF9WRVJURVgiLCJNQVhfSU5ESUNFIiwiUEkiLCJNYXRoIiwibWluIiwibWF4IiwiY2VpbCIsImFjb3MiLCJjb3MiLCJzaW4iLCJhdGFuMiIsImN1cnZlRGl2cyIsInIiLCJhcmMiLCJ0b2wiLCJkYSIsImNsYW1wIiwidiIsImdmeCIsImNjIiwidmZtdFBvc0NvbG9yU2RmIiwiVmVydGV4Rm9ybWF0IiwibmFtZSIsIkFUVFJfUE9TSVRJT04iLCJ0eXBlIiwiQVRUUl9UWVBFX0ZMT0FUMzIiLCJudW0iLCJBVFRSX0NPTE9SIiwiQVRUUl9UWVBFX1VJTlQ4Iiwibm9ybWFsaXplIiwiR3JhcGhpY3NBc3NlbWJsZXIiLCJncmFwaGljcyIsIl9idWZmZXIiLCJfYnVmZmVycyIsIl9idWZmZXJPZmZzZXQiLCJnZXRWZm10IiwiZ2V0VmZtdEZsb2F0Q291bnQiLCJyZXF1ZXN0QnVmZmVyIiwiYnVmZmVyIiwiaW5kaWNlU3RhcnQiLCJ2ZXJ0ZXhTdGFydCIsIm1lc2hidWZmZXIiLCJfaGFuZGxlIiwiaWEiLCJJbnB1dEFzc2VtYmxlciIsIl92YiIsIl9pYiIsInB1c2giLCJnZXRCdWZmZXJzIiwibGVuZ3RoIiwiY2xlYXIiLCJjbGVhbiIsImRhdGFzIiwiaSIsImwiLCJkYXRhIiwiZGVzdHJveSIsInJlc2V0IiwiZmlsbEJ1ZmZlcnMiLCJfZmx1c2giLCJub2RlIiwibWF0ZXJpYWwiLCJfbWF0ZXJpYWxzIiwiYnVmZmVycyIsImluZGV4IiwiX2NvdW50IiwiX2ZsdXNoSUEiLCJ1cGxvYWREYXRhIiwiZ2VuQnVmZmVyIiwiY3ZlcnRzIiwibWF4VmVydHNDb3VudCIsInZlcnRleE9mZnNldCIsInJlcXVlc3RTdGF0aWMiLCJzdHJva2UiLCJfY3VyQ29sb3IiLCJfc3Ryb2tlQ29sb3IiLCJfdmFsIiwiX2ZsYXR0ZW5QYXRocyIsIl9pbXBsIiwiX2V4cGFuZFN0cm9rZSIsIl91cGRhdGVQYXRoT2Zmc2V0IiwiZmlsbCIsIl9maWxsQ29sb3IiLCJfZXhwYW5kRmlsbCIsInciLCJsaW5lV2lkdGgiLCJsaW5lQ2FwIiwibGluZUpvaW4iLCJtaXRlckxpbWl0IiwiaW1wbCIsIm5jYXAiLCJfdGVzc1RvbCIsIl9jYWxjdWxhdGVKb2lucyIsInBhdGhzIiwiX3BhdGhzIiwiX3BhdGhPZmZzZXQiLCJfcGF0aExlbmd0aCIsInBhdGgiLCJwb2ludHNMZW5ndGgiLCJwb2ludHMiLCJST1VORCIsIm5iZXZlbCIsImNsb3NlZCIsInZEYXRhIiwiX3ZEYXRhIiwiaURhdGEiLCJfaURhdGEiLCJwdHMiLCJvZmZzZXQiLCJwMCIsInAxIiwic3RhcnQiLCJlbmQiLCJsb29wIiwiZFBvcyIsInN1YiIsIm5vcm1hbGl6ZVNlbGYiLCJkeCIsIngiLCJkeSIsInkiLCJCVVRUIiwiX2J1dHRDYXBTdGFydCIsIlNRVUFSRSIsIl9yb3VuZENhcFN0YXJ0IiwiaiIsIl9yb3VuZEpvaW4iLCJmbGFncyIsIlBUX0JFVkVMIiwiUFRfSU5ORVJCRVZFTCIsIl9iZXZlbEpvaW4iLCJfdnNldCIsImRteCIsImRteSIsImZsb2F0Q291bnQiLCJ2RGF0YW9PZnNldCIsIl9idXR0Q2FwRW5kIiwiX3JvdW5kQ2FwRW5kIiwiaW5kaWNlc09mZnNldCIsImNvbXBsZXgiLCJlYXJjdXREYXRhIiwidkRhdGFPZmZzZXQiLCJuZXdJbmRpY2VzIiwibkluZGljZXMiLCJmaXJzdCIsIml3IiwicHRzTGVuZ3RoIiwibmxlZnQiLCJkbXIyIiwiY3Jvc3MiLCJsaW1pdCIsImRseDAiLCJkbHkwIiwiZGx4MSIsImRseTEiLCJzY2FsZSIsIlBUX0xFRlQiLCJsZW4iLCJkbXd4IiwiZG13eSIsImRtbGVuIiwiUFRfQ09STkVSIiwiQkVWRUwiLCJlcXVhbHMiLCJwb3AiLCJzaXplIiwibWFnIiwiX2Nob29zZUJldmVsIiwiYmV2ZWwiLCJ4MCIsInkwIiwieDEiLCJ5MSIsInAiLCJkIiwicHgiLCJweSIsImRseCIsImRseSIsImEiLCJheCIsImF5IiwibHciLCJydyIsInAxeCIsInAxeSIsIm91dCIsImx4MCIsImx5MCIsImx4MSIsImx5MSIsImEwIiwiYTEiLCJuIiwidSIsInJ4IiwicnkiLCJyeDAiLCJyeTAiLCJyeDEiLCJyeTEiLCJseCIsImx5IiwiZGlzdGFuY2UiLCJkYXRhT2Zmc2V0IiwidWludFZEYXRhIiwiX3VpbnRWRGF0YSIsIl9kaXJ0eSIsIkFzc2VtYmxlciIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOztBQUVBOzs7Ozs7OztBQUVBLElBQU1BLFVBQVUsR0FBR0MsT0FBTyxDQUFDLG1CQUFELENBQTFCOztBQUNBLElBQU1DLFFBQVEsR0FBR0QsT0FBTyxDQUFDLGdCQUFELENBQXhCOztBQUVBLElBQU1FLFFBQVEsR0FBR0YsT0FBTyxDQUFDLCtCQUFELENBQXhCOztBQUNBLElBQU1HLFVBQVUsR0FBR0gsT0FBTyxDQUFDLDRCQUFELENBQVAsQ0FBc0NHLFVBQXpEOztBQUNBLElBQU1DLFFBQVEsR0FBR0YsUUFBUSxDQUFDRSxRQUExQjtBQUNBLElBQU1DLE9BQU8sR0FBR0gsUUFBUSxDQUFDRyxPQUF6Qjs7QUFDQSxJQUFNQyxNQUFNLEdBQUdOLE9BQU8sQ0FBQyxVQUFELENBQXRCOztBQUNBQSxPQUFPLENBQUMsUUFBRCxDQUFQOztBQUVBLElBQU1PLFVBQVUsR0FBRyxLQUFuQjtBQUNBLElBQU1DLFVBQVUsR0FBR0QsVUFBVSxHQUFHLENBQWhDO0FBRUEsSUFBTUUsRUFBRSxHQUFRQyxJQUFJLENBQUNELEVBQXJCO0FBQ0EsSUFBTUUsR0FBRyxHQUFPRCxJQUFJLENBQUNDLEdBQXJCO0FBQ0EsSUFBTUMsR0FBRyxHQUFPRixJQUFJLENBQUNFLEdBQXJCO0FBQ0EsSUFBTUMs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Q0FBL0M7O0FBQ0EsV0FBS25ELEtBQUwsQ0FBV29FLEdBQVgsRUFBZ0JDLEdBQWhCLEVBQXFCLENBQUMsQ0FBdEI7QUFDSDtBQUNKOztTQUVEckUsUUFBQSxlQUFPYixDQUFQLEVBQVVFLENBQVYsRUFBYW1GLFFBQWIsRUFBMkI7QUFBQSxRQUFkQSxRQUFjO0FBQWRBLE1BQUFBLFFBQWMsR0FBSCxDQUFHO0FBQUE7O0FBQ3ZCLFFBQUlySyxNQUFNLEdBQUcsS0FBS04sT0FBbEI7QUFDQSxRQUFJUyxVQUFVLEdBQUdILE1BQU0sQ0FBQ0csVUFBeEI7QUFDQSxRQUFJbUssVUFBVSxHQUFHdEssTUFBTSxDQUFDRSxXQUFQLEdBQXFCLEtBQUtKLGlCQUFMLEVBQXRDO0FBRUEsUUFBSW1FLEtBQUssR0FBRzlELFVBQVUsQ0FBQytELE1BQXZCO0FBQ0EsUUFBSXFHLFNBQVMsR0FBR3BLLFVBQVUsQ0FBQ3FLLFVBQTNCO0FBRUF2RyxJQUFBQSxLQUFLLENBQUNxRyxVQUFELENBQUwsR0FBb0J0RixDQUFwQjtBQUNBZixJQUFBQSxLQUFLLENBQUNxRyxVQUFVLEdBQUMsQ0FBWixDQUFMLEdBQXNCcEYsQ0FBdEI7QUFDQXFGLElBQUFBLFNBQVMsQ0FBQ0QsVUFBVSxHQUFDLENBQVosQ0FBVCxHQUEwQixLQUFLbEksU0FBL0I7QUFDQTZCLElBQUFBLEtBQUssQ0FBQ3FHLFVBQVUsR0FBQyxDQUFaLENBQUwsR0FBc0JELFFBQXRCO0FBRUFySyxJQUFBQSxNQUFNLENBQUNFLFdBQVA7QUFDQUMsSUFBQUEsVUFBVSxDQUFDc0ssTUFBWCxHQUFvQixJQUFwQjtBQUNIOzs7RUEvbUIwQ0M7Ozs7QUFrbkIvQ0Esc0JBQVVDLFFBQVYsQ0FBbUI5TCxFQUFFLENBQUN4QixRQUF0QixFQUFnQ21DLGlCQUFoQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBBc3NlbWJsZXIgZnJvbSAnLi4vLi4vLi4vYXNzZW1ibGVyJztcblxuaW1wb3J0IElucHV0QXNzZW1ibGVyIGZyb20gJy4uLy4uLy4uLy4uLy4uL3JlbmRlcmVyL2NvcmUvaW5wdXQtYXNzZW1ibGVyJztcblxuY29uc3QgTWVzaEJ1ZmZlciA9IHJlcXVpcmUoJy4uLy4uL21lc2gtYnVmZmVyJyk7XG5jb25zdCByZW5kZXJlciA9IHJlcXVpcmUoJy4uLy4uLy4uL2luZGV4Jyk7XG5cbmNvbnN0IEdyYXBoaWNzID0gcmVxdWlyZSgnLi4vLi4vLi4vLi4vZ3JhcGhpY3MvZ3JhcGhpY3MnKTtcbmNvbnN0IFBvaW50RmxhZ3MgPSByZXF1aXJlKCcuLi8uLi8uLi8uLi9ncmFwaGljcy90eXBlcycpLlBvaW50RmxhZ3M7XG5jb25zdCBMaW5lSm9pbiA9IEdyYXBoaWNzLkxpbmVKb2luO1xuY29uc3QgTGluZUNhcCA9IEdyYXBoaWNzLkxpbmVDYXA7XG5jb25zdCBFYXJjdXQgPSByZXF1aXJlKCcuL2VhcmN1dCcpO1xucmVxdWlyZSgnLi9pbXBsJyk7XG5cbmNvbnN0IE1BWF9WRVJURVggPSA2NTUzNTtcbmNvbnN0IE1BWF9JTkRJQ0UgPSBNQVhfVkVSVEVYICogMjtcblxuY29uc3QgUEkgICAgICA9IE1hdGguUEk7XG5jb25zdCBtaW4gICAgID0gTWF0aC5taW47XG5jb25zdCBtYXggICAgID0gTWF0aC5tYXg7XG5jb25zdCBjZWlsICAgID0gTWF0aC5jZWlsO1xuY29uc3QgYWNvcyAgICA9IE1hdGguYWNvcztcbmNvbnN0IGNvcyAgICAgPSBNYXRoLmNvcztcbmNvbnN0IHNpbiAgICAgPSBNYXRoLnNpbjtcbmNvbnN0IGF0YW4yICAgPSBNYXRoLmF0YW4yO1xuXG5mdW5jdGlvbiBjdXJ2ZURpdnMgKHIsIGFyYywgdG9sKSB7XG4gICAgbGV0IGRhID0gYWNvcyhyIC8gKHIgKyB0b2wpKSAqIDIuMDtcbiAgICByZXR1cm4gbWF4KDIsIGNlaWwoYXJjIC8gZGEpKTtcbn1cblxuZnVuY3Rpb24gY2xhbXAgKHYsIG1pbiwgbWF4KSB7XG4gICAgaWYgKHYgPCBtaW4pIHtcbiAgICAgICAgcmV0dXJuIG1pbjtcbiAgICB9XG4gICAgZWxzZSBpZiAodiA+IG1heCkge1xuICAgICAgICByZXR1cm4gbWF4O1xuICAgIH1cbiAgICByZXR1cm4gdjtcbn1cblxuXG5sZXQgZ2Z4ID0gY2MuZ2Z4O1xubGV0IHZmbXRQb3NDb2xvclNkZiA9IG5ldyBnZnguVmVydGV4Rm9ybWF0KFtcbiAgICB7IG5hbWU6IGdmeC5BVFRSX1BPU0lUSU9OLCB0eXBlOiBnZnguQVRUUl9UWVBFX0ZMT0FUMzIsIG51bTogMiB9LFxuICAgIHsgbmFtZTogZ2Z4LkFUVFJfQ09MT1IsIHR5cGU6IGdmeC5BVFRSX1RZUEVfVUlOVDgsIG51bTogNCwgbm9ybWFsaXplOiB0cnVlIH0sXG4gICAgeyBuYW1lOiAnYV9kaXN0JywgdHlwZTogZ2Z4LkFUVFJfVFlQRV9GTE9BVDMyLCBudW06IDEgfSxcbl0pO1xudmZtdFBvc0NvbG9yU2RmLm5hbWUgPSAndmZtdFBvc0NvbG9yU2RmJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JhcGhpY3NBc3NlbWJsZXIgZXh0ZW5kcyBBc3NlbWJsZXIge1xuICAgIGNvbnN0cnVjdG9yIChncmFwaGljcykge1xuICAgICAgICBzdXBlcihncmFwaGljcyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLl9idWZmZXIgPSBudWxsO1xuICAgICAgICB0aGlzLl9idWZmZXJzID0gW107XG4gICAgICAgIHRoaXMuX2J1ZmZlck9mZnNldCA9IDA7XG4gICAgfVxuXG4gICAgZ2V0VmZtdCAoKSB7XG4gICAgICAgIHJldHVybiB2Zm10UG9zQ29sb3JTZGY7XG4gICAgfVxuXG4gICAgZ2V0VmZtdEZsb2F0Q291bnQgKCkge1xuICAgICAgICByZXR1cm4gNDtcbiAgICB9XG5cbiAgICByZXF1ZXN0QnVmZmVyICgpIHtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IHtcbiAgICAgICAgICAgIGluZGljZVN0YXJ0OiAwLFxuICAgICAgICAgICAgdmVydGV4U3RhcnQ6IDBcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgbWVzaGJ1ZmZlciA9IG5ldyBNZXNoQnVmZmVyKHJlbmRlcmVyLl9oYW5kbGUsIHRoaXMuZ2V0VmZtdCgpKTtcbiAgICAgICAgYnVmZmVyLm1lc2hidWZmZXIgPSBtZXNoYnVmZmVyO1xuXG4gICAgICAgIGxldCBpYSA9IG5ldyBJbnB1dEFzc2VtYmxlcihtZXNoYnVmZmVyLl92YiwgbWVzaGJ1ZmZlci5faWIpO1xuICAgICAgICBidWZmZXIuaWEgPSBpYTtcblxuICAgICAgICB0aGlzLl9idWZmZXJzLnB1c2goYnVmZmVyKTtcblxuICAgICAgICByZXR1cm4gYnVmZmVyO1xuICAgIH1cblxuICAgIGdldEJ1ZmZlcnMgKCkge1xuICAgICAgICBpZiAodGhpcy5fYnVmZmVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdEJ1ZmZlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2J1ZmZlcnM7XG4gICAgfVxuXG4gICAgY2xlYXIgKGNsZWFuKSB7XG4gICAgICAgIHRoaXMuX2J1ZmZlck9mZnNldCA9IDA7XG5cbiAgICAgICAgbGV0IGRhdGFzID0gdGhpcy5fYnVmZmVycztcbiAgICAgICAgaWYgKGNsZWFuKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGRhdGFzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gZGF0YXNbaV07XG4gICAgICAgICAgICAgICAgZGF0YS5tZXNoYnVmZmVyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICBkYXRhLm1lc2hidWZmZXIgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGF0YXMubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZGF0YXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBkYXRhc1tpXTtcblxuICAgICAgICAgICAgICAgIGRhdGEuaW5kaWNlU3RhcnQgPSAwO1xuICAgICAgICAgICAgICAgIGRhdGEudmVydGV4U3RhcnQgPSAwO1xuXG4gICAgICAgICAgICAgICAgbGV0IG1lc2hidWZmZXIgPSBkYXRhLm1lc2hidWZmZXI7XG4gICAgICAgICAgICAgICAgbWVzaGJ1ZmZlci5yZXNldCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmlsbEJ1ZmZlcnMgKGdyYXBoaWNzLCByZW5kZXJlcikge1xuICAgICAgICByZW5kZXJlci5fZmx1c2goKTtcblxuICAgICAgICByZW5kZXJlci5ub2RlID0gZ3JhcGhpY3Mubm9kZTtcbiAgICAgICAgcmVuZGVyZXIubWF0ZXJpYWwgPSBncmFwaGljcy5fbWF0ZXJpYWxzWzBdO1xuXG4gICAgICAgIGxldCBidWZmZXJzID0gdGhpcy5nZXRCdWZmZXJzKCk7XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMCwgbGVuZ3RoID0gYnVmZmVycy5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBsZXQgYnVmZmVyID0gYnVmZmVyc1tpbmRleF07XG4gICAgICAgICAgICBsZXQgbWVzaGJ1ZmZlciA9IGJ1ZmZlci5tZXNoYnVmZmVyO1xuICAgICAgICAgICAgYnVmZmVyLmlhLl9jb3VudCA9IGJ1ZmZlci5pbmRpY2VTdGFydDtcbiAgICAgICAgICAgIHJlbmRlcmVyLl9mbHVzaElBKGJ1ZmZlci5pYSk7XG4gICAgICAgICAgICBtZXNoYnVmZmVyLnVwbG9hZERhdGEoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbkJ1ZmZlciAoZ3JhcGhpY3MsIGN2ZXJ0cykge1xuICAgICAgICBsZXQgYnVmZmVycyA9IHRoaXMuZ2V0QnVmZmVycygpOyBcbiAgICAgICAgbGV0IGJ1ZmZlciA9IGJ1ZmZlcnNbdGhpcy5fYnVmZmVyT2Zmc2V0XTtcbiAgICAgICAgbGV0IG1lc2hidWZmZXIgPSBidWZmZXIubWVzaGJ1ZmZlcjtcblxuICAgICAgICBsZXQgbWF4VmVydHNDb3VudCA9IGJ1ZmZlci52ZXJ0ZXhTdGFydCArIGN2ZXJ0cztcbiAgICAgICAgaWYgKG1heFZlcnRzQ291bnQgPiBNQVhfVkVSVEVYIHx8XG4gICAgICAgICAgICBtYXhWZXJ0c0NvdW50ICogMyA+IE1BWF9JTkRJQ0UpIHtcbiAgICAgICAgICAgICsrdGhpcy5fYnVmZmVyT2Zmc2V0O1xuICAgICAgICAgICAgbWF4VmVydHNDb3VudCA9IGN2ZXJ0cztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHRoaXMuX2J1ZmZlck9mZnNldCA8IGJ1ZmZlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgYnVmZmVyID0gYnVmZmVyc1t0aGlzLl9idWZmZXJPZmZzZXRdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYnVmZmVyID0gdGhpcy5yZXF1ZXN0QnVmZmVyKGdyYXBoaWNzKTtcbiAgICAgICAgICAgICAgICBidWZmZXJzW3RoaXMuX2J1ZmZlck9mZnNldF0gPSBidWZmZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1lc2hidWZmZXIgPSBidWZmZXIubWVzaGJ1ZmZlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtYXhWZXJ0c0NvdW50ID4gbWVzaGJ1ZmZlci52ZXJ0ZXhPZmZzZXQpIHtcbiAgICAgICAgICAgIG1lc2hidWZmZXIucmVxdWVzdFN0YXRpYyhjdmVydHMsIGN2ZXJ0cyozKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2J1ZmZlciA9IGJ1ZmZlcjtcbiAgICAgICAgcmV0dXJuIGJ1ZmZlcjtcbiAgICB9XG5cbiAgICBzdHJva2UgKGdyYXBoaWNzKSB7XG4gICAgICAgIHRoaXMuX2N1ckNvbG9yID0gZ3JhcGhpY3MuX3N0cm9rZUNvbG9yLl92YWw7XG5cbiAgICAgICAgdGhpcy5fZmxhdHRlblBhdGhzKGdyYXBoaWNzLl9pbXBsKTtcbiAgICAgICAgdGhpcy5fZXhwYW5kU3Ryb2tlKGdyYXBoaWNzKTtcbiAgICBcbiAgICAgICAgZ3JhcGhpY3MuX2ltcGwuX3VwZGF0ZVBhdGhPZmZzZXQgPSB0cnVlO1xuICAgIH1cblxuICAgIGZpbGwgKGdyYXBoaWNzKSB7XG4gICAgICAgIHRoaXMuX2N1ckNvbG9yID0gZ3JhcGhpY3MuX2ZpbGxDb2xvci5fdmFsO1xuXG4gICAgICAgIHRoaXMuX2V4cGFuZEZpbGwoZ3JhcGhpY3MpO1xuICAgICAgICBncmFwaGljcy5faW1wbC5fdXBkYXRlUGF0aE9mZnNldCA9IHRydWU7XG4gICAgfVxuXG4gICAgX2V4cGFuZFN0cm9rZSAoZ3JhcGhpY3MpIHtcbiAgICAgICAgbGV0IHcgPSBncmFwaGljcy5saW5lV2lkdGggKiAwLjUsXG4gICAgICAgICAgICBsaW5lQ2FwID0gZ3JhcGhpY3MubGluZUNhcCxcbiAgICAgICAgICAgIGxpbmVKb2luID0gZ3JhcGhpY3MubGluZUpvaW4sXG4gICAgICAgICAgICBtaXRlckxpbWl0ID0gZ3JhcGhpY3MubWl0ZXJMaW1pdDtcblxuICAgICAgICBsZXQgaW1wbCA9IGdyYXBoaWNzLl9pbXBsO1xuICAgIFxuICAgICAgICBsZXQgbmNhcCA9IGN1cnZlRGl2cyh3LCBQSSwgaW1wbC5fdGVzc1RvbCk7XG4gICAgXG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZUpvaW5zKGltcGwsIHcsIGxpbmVKb2luLCBtaXRlckxpbWl0KTtcbiAgICBcbiAgICAgICAgbGV0IHBhdGhzID0gaW1wbC5fcGF0aHM7XG4gICAgICAgIFxuICAgICAgICAvLyBDYWxjdWxhdGUgbWF4IHZlcnRleCB1c2FnZS5cbiAgICAgICAgbGV0IGN2ZXJ0cyA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSBpbXBsLl9wYXRoT2Zmc2V0LCBsID0gaW1wbC5fcGF0aExlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbGV0IHBhdGggPSBwYXRoc1tpXTtcbiAgICAgICAgICAgIGxldCBwb2ludHNMZW5ndGggPSBwYXRoLnBvaW50cy5sZW5ndGg7XG5cbiAgICAgICAgICAgIGlmIChsaW5lSm9pbiA9PT0gTGluZUpvaW4uUk9VTkQpIGN2ZXJ0cyArPSAocG9pbnRzTGVuZ3RoICsgcGF0aC5uYmV2ZWwgKiAobmNhcCArIDIpICsgMSkgKiAyOyAvLyBwbHVzIG9uZSBmb3IgbG9vcFxuICAgICAgICAgICAgZWxzZSBjdmVydHMgKz0gKHBvaW50c0xlbmd0aCArIHBhdGgubmJldmVsICogNSArIDEpICogMjsgLy8gcGx1cyBvbmUgZm9yIGxvb3BcblxuICAgICAgICAgICAgaWYgKCFwYXRoLmNsb3NlZCkge1xuICAgICAgICAgICAgICAgIC8vIHNwYWNlIGZvciBjYXBzXG4gICAgICAgICAgICAgICAgaWYgKGxpbmVDYXAgPT09IExpbmVDYXAuUk9VTkQpIHtcbiAgICAgICAgICAgICAgICAgICAgY3ZlcnRzICs9IChuY2FwICogMiArIDIpICogMjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjdmVydHMgKz0gKDMgKyAzKSAqIDI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBsZXQgYnVmZmVyID0gdGhpcy5nZW5CdWZmZXIoZ3JhcGhpY3MsIGN2ZXJ0cyksXG4gICAgICAgICAgICBtZXNoYnVmZmVyID0gYnVmZmVyLm1lc2hidWZmZXIsXG4gICAgICAgICAgICB2RGF0YSA9IG1lc2hidWZmZXIuX3ZEYXRhLFxuICAgICAgICAgICAgaURhdGEgPSBtZXNoYnVmZmVyLl9pRGF0YTtcbiAgICAgICAgICAgIFxuICAgICAgICBmb3IgKGxldCBpID0gaW1wbC5fcGF0aE9mZnNldCwgbCA9IGltcGwuX3BhdGhMZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBwYXRoID0gcGF0aHNbaV07XG4gICAgICAgICAgICBsZXQgcHRzID0gcGF0aC5wb2ludHM7XG4gICAgICAgICAgICBsZXQgcG9pbnRzTGVuZ3RoID0gcHRzLmxlbmd0aDtcbiAgICAgICAgICAgIGxldCBvZmZzZXQgPSBidWZmZXIudmVydGV4U3RhcnQ7XG5cbiAgICAgICAgICAgIGxldCBwMCwgcDE7XG4gICAgICAgICAgICBsZXQgc3RhcnQsIGVuZCwgbG9vcDtcbiAgICAgICAgICAgIGxvb3AgPSBwYXRoLmNsb3NlZDtcbiAgICAgICAgICAgIGlmIChsb29wKSB7XG4gICAgICAgICAgICAgICAgLy8gTG9vcGluZ1xuICAgICAgICAgICAgICAgIHAwID0gcHRzW3BvaW50c0xlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgIHAxID0gcHRzWzBdO1xuICAgICAgICAgICAgICAgIHN0YXJ0ID0gMDtcbiAgICAgICAgICAgICAgICBlbmQgPSBwb2ludHNMZW5ndGg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEFkZCBjYXBcbiAgICAgICAgICAgICAgICBwMCA9IHB0c1swXTtcbiAgICAgICAgICAgICAgICBwMSA9IHB0c1sxXTtcbiAgICAgICAgICAgICAgICBzdGFydCA9IDE7XG4gICAgICAgICAgICAgICAgZW5kID0gcG9pbnRzTGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcDEgPSBwMSB8fCBwMDtcbiAgICBcbiAgICAgICAgICAgIGlmICghbG9vcCkge1xuICAgICAgICAgICAgICAgIC8vIEFkZCBjYXBcbiAgICAgICAgICAgICAgICBsZXQgZFBvcyA9IHAxLnN1YihwMCk7XG4gICAgICAgICAgICAgICAgZFBvcy5ub3JtYWxpemVTZWxmKCk7XG4gICAgXG4gICAgICAgICAgICAgICAgbGV0IGR4ID0gZFBvcy54O1xuICAgICAgICAgICAgICAgIGxldCBkeSA9IGRQb3MueTtcbiAgICBcbiAgICAgICAgICAgICAgICBpZiAobGluZUNhcCA9PT0gTGluZUNhcC5CVVRUKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9idXR0Q2FwU3RhcnQocDAsIGR4LCBkeSwgdywgMCk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobGluZUNhcCA9PT0gTGluZUNhcC5TUVVBUkUpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2J1dHRDYXBTdGFydChwMCwgZHgsIGR5LCB3LCB3KTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChsaW5lQ2FwID09PSBMaW5lQ2FwLlJPVU5EKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yb3VuZENhcFN0YXJ0KHAwLCBkeCwgZHksIHcsIG5jYXApO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IHN0YXJ0OyBqIDwgZW5kOyArK2opIHtcbiAgICAgICAgICAgICAgICBpZiAobGluZUpvaW4gPT09IExpbmVKb2luLlJPVU5EKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JvdW5kSm9pbihwMCwgcDEsIHcsIHcsIG5jYXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICgocDEuZmxhZ3MgJiAoUG9pbnRGbGFncy5QVF9CRVZFTCB8IFBvaW50RmxhZ3MuUFRfSU5ORVJCRVZFTCkpICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2JldmVsSm9pbihwMCwgcDEsIHcsIHcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdnNldChwMS54ICsgcDEuZG14ICogdywgcDEueSArIHAxLmRteSAqIHcsIDEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl92c2V0KHAxLnggLSBwMS5kbXggKiB3LCBwMS55IC0gcDEuZG15ICogdywgLTEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgICAgICBwMCA9IHAxO1xuICAgICAgICAgICAgICAgIHAxID0gcHRzW2ogKyAxXTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGlmIChsb29wKSB7XG4gICAgICAgICAgICAgICAgLy8gTG9vcCBpdFxuICAgICAgICAgICAgICAgIGxldCBmbG9hdENvdW50ID0gdGhpcy5nZXRWZm10RmxvYXRDb3VudCgpO1xuICAgICAgICAgICAgICAgIGxldCB2RGF0YW9PZnNldCA9IG9mZnNldCAqIGZsb2F0Q291bnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fdnNldCh2RGF0YVt2RGF0YW9PZnNldF0sICAgdkRhdGFbdkRhdGFvT2ZzZXQrMV0sIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZzZXQodkRhdGFbdkRhdGFvT2ZzZXQrZmxvYXRDb3VudF0sIHZEYXRhW3ZEYXRhb09mc2V0K2Zsb2F0Q291bnQrMV0sIC0xKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gQWRkIGNhcFxuICAgICAgICAgICAgICAgIGxldCBkUG9zID0gcDEuc3ViKHAwKTtcbiAgICAgICAgICAgICAgICBkUG9zLm5vcm1hbGl6ZVNlbGYoKTtcbiAgICBcbiAgICAgICAgICAgICAgICBsZXQgZHggPSBkUG9zLng7XG4gICAgICAgICAgICAgICAgbGV0IGR5ID0gZFBvcy55O1xuICAgIFxuICAgICAgICAgICAgICAgIGlmIChsaW5lQ2FwID09PSBMaW5lQ2FwLkJVVFQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2J1dHRDYXBFbmQocDEsIGR4LCBkeSwgdywgMCk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobGluZUNhcCA9PT0gTGluZUNhcC5TUVVBUkUpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2J1dHRDYXBFbmQocDEsIGR4LCBkeSwgdywgdyk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobGluZUNhcCA9PT0gTGluZUNhcC5ST1VORClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcm91bmRDYXBFbmQocDEsIGR4LCBkeSwgdywgbmNhcCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHN0cm9rZSBpbmRpY2VzXG4gICAgICAgICAgICBsZXQgaW5kaWNlc09mZnNldCA9IGJ1ZmZlci5pbmRpY2VTdGFydDtcbiAgICAgICAgICAgIGZvciAobGV0IHN0YXJ0ID0gb2Zmc2V0KzIsIGVuZCA9IGJ1ZmZlci52ZXJ0ZXhTdGFydDsgc3RhcnQgPCBlbmQ7IHN0YXJ0KyspIHtcbiAgICAgICAgICAgICAgICBpRGF0YVtpbmRpY2VzT2Zmc2V0KytdID0gc3RhcnQgLSAyO1xuICAgICAgICAgICAgICAgIGlEYXRhW2luZGljZXNPZmZzZXQrK10gPSBzdGFydCAtIDE7XG4gICAgICAgICAgICAgICAgaURhdGFbaW5kaWNlc09mZnNldCsrXSA9IHN0YXJ0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBidWZmZXIuaW5kaWNlU3RhcnQgPSBpbmRpY2VzT2Zmc2V0O1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIF9leHBhbmRGaWxsIChncmFwaGljcykge1xuICAgICAgICBsZXQgaW1wbCA9IGdyYXBoaWNzLl9pbXBsO1xuXG4gICAgICAgIGxldCBwYXRocyA9IGltcGwuX3BhdGhzO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBtYXggdmVydGV4IHVzYWdlLlxuICAgICAgICBsZXQgY3ZlcnRzID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IGltcGwuX3BhdGhPZmZzZXQsIGwgPSBpbXBsLl9wYXRoTGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcGF0aCA9IHBhdGhzW2ldO1xuICAgICAgICAgICAgbGV0IHBvaW50c0xlbmd0aCA9IHBhdGgucG9pbnRzLmxlbmd0aDtcblxuICAgICAgICAgICAgY3ZlcnRzICs9IHBvaW50c0xlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBidWZmZXIgPSB0aGlzLmdlbkJ1ZmZlcihncmFwaGljcywgY3ZlcnRzKSxcbiAgICAgICAgICAgIG1lc2hidWZmZXIgPSBidWZmZXIubWVzaGJ1ZmZlcixcbiAgICAgICAgICAgIHZEYXRhID0gbWVzaGJ1ZmZlci5fdkRhdGEsXG4gICAgICAgICAgICBpRGF0YSA9IG1lc2hidWZmZXIuX2lEYXRhO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSBpbXBsLl9wYXRoT2Zmc2V0LCBsID0gaW1wbC5fcGF0aExlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbGV0IHBhdGggPSBwYXRoc1tpXTtcbiAgICAgICAgICAgIGxldCBwdHMgPSBwYXRoLnBvaW50cztcbiAgICAgICAgICAgIGxldCBwb2ludHNMZW5ndGggPSBwdHMubGVuZ3RoO1xuICAgIFxuICAgICAgICAgICAgaWYgKHBvaW50c0xlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHNoYXBlIHZlcnRpY2VzLlxuICAgICAgICAgICAgbGV0IG9mZnNldCA9IGJ1ZmZlci52ZXJ0ZXhTdGFydDtcbiAgICBcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcG9pbnRzTGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgICAgICB0aGlzLl92c2V0KHB0c1tqXS54LCBwdHNbal0ueSk7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICBsZXQgaW5kaWNlc09mZnNldCA9IGJ1ZmZlci5pbmRpY2VTdGFydDtcbiAgICBcbiAgICAgICAgICAgIGlmIChwYXRoLmNvbXBsZXgpIHtcbiAgICAgICAgICAgICAgICBsZXQgZWFyY3V0RGF0YSA9IFtdO1xuICAgICAgICAgICAgICAgIGxldCBmbG9hdENvdW50ID0gdGhpcy5nZXRWZm10RmxvYXRDb3VudCgpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSBvZmZzZXQsIGVuZCA9IGJ1ZmZlci52ZXJ0ZXhTdGFydDsgaiA8IGVuZDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB2RGF0YU9mZnNldCA9IGogKiBmbG9hdENvdW50O1xuICAgICAgICAgICAgICAgICAgICBlYXJjdXREYXRhLnB1c2godkRhdGFbdkRhdGFPZmZzZXRdKTtcbiAgICAgICAgICAgICAgICAgICAgZWFyY3V0RGF0YS5wdXNoKHZEYXRhW3ZEYXRhT2Zmc2V0KzFdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICAgICAgbGV0IG5ld0luZGljZXMgPSBFYXJjdXQoZWFyY3V0RGF0YSwgbnVsbCwgMik7XG4gICAgXG4gICAgICAgICAgICAgICAgaWYgKCFuZXdJbmRpY2VzIHx8IG5ld0luZGljZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbkluZGljZXMgPSBuZXdJbmRpY2VzLmxlbmd0aDsgaiA8IG5JbmRpY2VzOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaURhdGFbaW5kaWNlc09mZnNldCsrXSA9IG5ld0luZGljZXNbal0gKyBvZmZzZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGZpcnN0ID0gb2Zmc2V0O1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHN0YXJ0ID0gb2Zmc2V0KzIsIGVuZCA9IGJ1ZmZlci52ZXJ0ZXhTdGFydDsgc3RhcnQgPCBlbmQ7IHN0YXJ0KyspIHtcbiAgICAgICAgICAgICAgICAgICAgaURhdGFbaW5kaWNlc09mZnNldCsrXSA9IGZpcnN0O1xuICAgICAgICAgICAgICAgICAgICBpRGF0YVtpbmRpY2VzT2Zmc2V0KytdID0gc3RhcnQgLSAxO1xuICAgICAgICAgICAgICAgICAgICBpRGF0YVtpbmRpY2VzT2Zmc2V0KytdID0gc3RhcnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBidWZmZXIuaW5kaWNlU3RhcnQgPSBpbmRpY2VzT2Zmc2V0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2NhbGN1bGF0ZUpvaW5zIChpbXBsLCB3LCBsaW5lSm9pbiwgbWl0ZXJMaW1pdCkge1xuICAgICAgICBsZXQgaXcgPSAwLjA7XG4gICAgXG4gICAgICAgIGlmICh3ID4gMC4wKSB7XG4gICAgICAgICAgICBpdyA9IDEgLyB3O1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIC8vIENhbGN1bGF0ZSB3aGljaCBqb2lucyBuZWVkcyBleHRyYSB2ZXJ0aWNlcyB0byBhcHBlbmQsIGFuZCBnYXRoZXIgdmVydGV4IGNvdW50LlxuICAgICAgICBsZXQgcGF0aHMgPSBpbXBsLl9wYXRocztcbiAgICAgICAgZm9yIChsZXQgaSA9IGltcGwuX3BhdGhPZmZzZXQsIGwgPSBpbXBsLl9wYXRoTGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcGF0aCA9IHBhdGhzW2ldO1xuICAgIFxuICAgICAgICAgICAgbGV0IHB0cyA9IHBhdGgucG9pbnRzO1xuICAgICAgICAgICAgbGV0IHB0c0xlbmd0aCA9IHB0cy5sZW5ndGg7XG4gICAgICAgICAgICBsZXQgcDAgPSBwdHNbcHRzTGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBsZXQgcDEgPSBwdHNbMF07XG4gICAgICAgICAgICBsZXQgbmxlZnQgPSAwO1xuICAgIFxuICAgICAgICAgICAgcGF0aC5uYmV2ZWwgPSAwO1xuICAgIFxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwdHNMZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBkbXIyLCBjcm9zcywgbGltaXQ7XG4gICAgXG4gICAgICAgICAgICAgICAgLy8gcGVycCBub3JtYWxzXG4gICAgICAgICAgICAgICAgbGV0IGRseDAgPSBwMC5keTtcbiAgICAgICAgICAgICAgICBsZXQgZGx5MCA9IC1wMC5keDtcbiAgICAgICAgICAgICAgICBsZXQgZGx4MSA9IHAxLmR5O1xuICAgICAgICAgICAgICAgIGxldCBkbHkxID0gLXAxLmR4O1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBleHRydXNpb25zXG4gICAgICAgICAgICAgICAgcDEuZG14ID0gKGRseDAgKyBkbHgxKSAqIDAuNTtcbiAgICAgICAgICAgICAgICBwMS5kbXkgPSAoZGx5MCArIGRseTEpICogMC41O1xuICAgICAgICAgICAgICAgIGRtcjIgPSBwMS5kbXggKiBwMS5kbXggKyBwMS5kbXkgKiBwMS5kbXk7XG4gICAgICAgICAgICAgICAgaWYgKGRtcjIgPiAwLjAwMDAwMSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2NhbGUgPSAxIC8gZG1yMjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjYWxlID4gNjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZSA9IDYwMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwMS5kbXggKj0gc2NhbGU7XG4gICAgICAgICAgICAgICAgICAgIHAxLmRteSAqPSBzY2FsZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICAgICAgLy8gS2VlcCB0cmFjayBvZiBsZWZ0IHR1cm5zLlxuICAgICAgICAgICAgICAgIGNyb3NzID0gcDEuZHggKiBwMC5keSAtIHAwLmR4ICogcDEuZHk7XG4gICAgICAgICAgICAgICAgaWYgKGNyb3NzID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBubGVmdCsrO1xuICAgICAgICAgICAgICAgICAgICBwMS5mbGFncyB8PSBQb2ludEZsYWdzLlBUX0xFRlQ7XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBpZiB3ZSBzaG91bGQgdXNlIGJldmVsIG9yIG1pdGVyIGZvciBpbm5lciBqb2luLlxuICAgICAgICAgICAgICAgIGxpbWl0ID0gbWF4KDExLCBtaW4ocDAubGVuLCBwMS5sZW4pICogaXcpO1xuICAgICAgICAgICAgICAgIGlmIChkbXIyICogbGltaXQgKiBsaW1pdCA8IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcDEuZmxhZ3MgfD0gUG9pbnRGbGFncy5QVF9JTk5FUkJFVkVMO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIENoZWNrIHdoZXRoZXIgZG0gbGVuZ3RoIGlzIHRvbyBsb25nXG4gICAgICAgICAgICAgICAgbGV0IGRtd3ggPSBwMS5kbXggKiB3O1xuICAgICAgICAgICAgICAgIGxldCBkbXd5ID0gcDEuZG15ICogdztcbiAgICAgICAgICAgICAgICBsZXQgZG1sZW4gPSBkbXd4KmRtd3ggKyBkbXd5KmRtd3k7XG4gICAgICAgICAgICAgICAgaWYgKGRtbGVuID4gKHAxLmxlbiAqIHAxLmxlbikgfHwgZG1sZW4gPiAocDAubGVuICogcDAubGVuKSkge1xuICAgICAgICAgICAgICAgICAgICBwMS5mbGFncyB8PSBQb2ludEZsYWdzLlBUX0lOTkVSQkVWRUw7XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgY29ybmVyIG5lZWRzIHRvIGJlIGJldmVsZWQuXG4gICAgICAgICAgICAgICAgaWYgKHAxLmZsYWdzICYgUG9pbnRGbGFncy5QVF9DT1JORVIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRtcjIgKiBtaXRlckxpbWl0ICogbWl0ZXJMaW1pdCA8IDEgfHwgbGluZUpvaW4gPT09IExpbmVKb2luLkJFVkVMIHx8IGxpbmVKb2luID09PSBMaW5lSm9pbi5ST1VORCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcDEuZmxhZ3MgfD0gUG9pbnRGbGFncy5QVF9CRVZFTDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgICAgICBpZiAoKHAxLmZsYWdzICYgKFBvaW50RmxhZ3MuUFRfQkVWRUwgfCBQb2ludEZsYWdzLlBUX0lOTkVSQkVWRUwpKSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBwYXRoLm5iZXZlbCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgICAgICBwMCA9IHAxO1xuICAgICAgICAgICAgICAgIHAxID0gcHRzW2ogKyAxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBfZmxhdHRlblBhdGhzIChpbXBsKSB7XG4gICAgICAgIGxldCBwYXRocyA9IGltcGwuX3BhdGhzO1xuICAgICAgICBmb3IgKGxldCBpID0gaW1wbC5fcGF0aE9mZnNldCwgbCA9IGltcGwuX3BhdGhMZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBwYXRoID0gcGF0aHNbaV07XG4gICAgICAgICAgICBsZXQgcHRzID0gcGF0aC5wb2ludHM7XG4gICAgXG4gICAgICAgICAgICBsZXQgcDAgPSBwdHNbcHRzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgbGV0IHAxID0gcHRzWzBdO1xuICAgIFxuICAgICAgICAgICAgaWYgKHB0cy5sZW5ndGggPiAyICYmIHAwLmVxdWFscyhwMSkpIHtcbiAgICAgICAgICAgICAgICBwYXRoLmNsb3NlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcHRzLnBvcCgpO1xuICAgICAgICAgICAgICAgIHAwID0gcHRzW3B0cy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBzaXplID0gcHRzLmxlbmd0aDsgaiA8IHNpemU7IGorKykge1xuICAgICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBzZWdtZW50IGRpcmVjdGlvbiBhbmQgbGVuZ3RoXG4gICAgICAgICAgICAgICAgbGV0IGRQb3MgPSBwMS5zdWIocDApO1xuICAgICAgICAgICAgICAgIHAwLmxlbiA9IGRQb3MubWFnKCk7XG4gICAgICAgICAgICAgICAgaWYgKGRQb3MueCB8fCBkUG9zLnkpXG4gICAgICAgICAgICAgICAgICAgIGRQb3Mubm9ybWFsaXplU2VsZigpO1xuICAgICAgICAgICAgICAgIHAwLmR4ID0gZFBvcy54O1xuICAgICAgICAgICAgICAgIHAwLmR5ID0gZFBvcy55O1xuICAgICAgICAgICAgICAgIC8vIEFkdmFuY2VcbiAgICAgICAgICAgICAgICBwMCA9IHAxO1xuICAgICAgICAgICAgICAgIHAxID0gcHRzW2ogKyAxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9jaG9vc2VCZXZlbCAoYmV2ZWwsIHAwLCBwMSwgdykge1xuICAgICAgICBsZXQgeCA9IHAxLng7XG4gICAgICAgIGxldCB5ID0gcDEueTtcbiAgICAgICAgbGV0IHgwLCB5MCwgeDEsIHkxO1xuICAgIFxuICAgICAgICBpZiAoYmV2ZWwgIT09IDApIHtcbiAgICAgICAgICAgIHgwID0geCArIHAwLmR5ICogdztcbiAgICAgICAgICAgIHkwID0geSAtIHAwLmR4ICogdztcbiAgICAgICAgICAgIHgxID0geCArIHAxLmR5ICogdztcbiAgICAgICAgICAgIHkxID0geSAtIHAxLmR4ICogdztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHgwID0geDEgPSB4ICsgcDEuZG14ICogdztcbiAgICAgICAgICAgIHkwID0geTEgPSB5ICsgcDEuZG15ICogdztcbiAgICAgICAgfVxuICAgIFxuICAgICAgICByZXR1cm4gW3gwLCB5MCwgeDEsIHkxXTtcbiAgICB9XG4gICAgXG4gICAgX2J1dHRDYXBTdGFydCAocCwgZHgsIGR5LCB3LCBkKSB7XG4gICAgICAgIGxldCBweCA9IHAueCAtIGR4ICogZDtcbiAgICAgICAgbGV0IHB5ID0gcC55IC0gZHkgKiBkO1xuICAgICAgICBsZXQgZGx4ID0gZHk7XG4gICAgICAgIGxldCBkbHkgPSAtZHg7XG4gICAgXG4gICAgICAgIHRoaXMuX3ZzZXQocHggKyBkbHggKiB3LCBweSArIGRseSAqIHcsIDEpO1xuICAgICAgICB0aGlzLl92c2V0KHB4IC0gZGx4ICogdywgcHkgLSBkbHkgKiB3LCAtMSk7XG4gICAgfVxuXG4gICAgX2J1dHRDYXBFbmQgKHAsIGR4LCBkeSwgdywgZCkge1xuICAgICAgICBsZXQgcHggPSBwLnggKyBkeCAqIGQ7XG4gICAgICAgIGxldCBweSA9IHAueSArIGR5ICogZDtcbiAgICAgICAgbGV0IGRseCA9IGR5O1xuICAgICAgICBsZXQgZGx5ID0gLWR4O1xuICAgIFxuICAgICAgICB0aGlzLl92c2V0KHB4ICsgZGx4ICogdywgcHkgKyBkbHkgKiB3LCAxKTtcbiAgICAgICAgdGhpcy5fdnNldChweCAtIGRseCAqIHcsIHB5IC0gZGx5ICogdywgLTEpO1xuICAgIH1cbiAgICBcbiAgICBfcm91bmRDYXBTdGFydCAocCwgZHgsIGR5LCB3LCBuY2FwKSB7XG4gICAgICAgIGxldCBweCA9IHAueDtcbiAgICAgICAgbGV0IHB5ID0gcC55O1xuICAgICAgICBsZXQgZGx4ID0gZHk7XG4gICAgICAgIGxldCBkbHkgPSAtZHg7XG4gICAgXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmNhcDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYSA9IGkgLyAobmNhcCAtIDEpICogUEk7XG4gICAgICAgICAgICBsZXQgYXggPSBjb3MoYSkgKiB3LFxuICAgICAgICAgICAgICAgIGF5ID0gc2luKGEpICogdztcbiAgICAgICAgICAgIHRoaXMuX3ZzZXQocHggLSBkbHggKiBheCAtIGR4ICogYXksIHB5IC0gZGx5ICogYXggLSBkeSAqIGF5LCAxKTtcbiAgICAgICAgICAgIHRoaXMuX3ZzZXQocHgsIHB5LCAwKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl92c2V0KHB4ICsgZGx4ICogdywgcHkgKyBkbHkgKiB3LCAxKTtcbiAgICAgICAgdGhpcy5fdnNldChweCAtIGRseCAqIHcsIHB5IC0gZGx5ICogdywgLTEpO1xuICAgIH1cbiAgICBcbiAgICBfcm91bmRDYXBFbmQgKHAsIGR4LCBkeSwgdywgbmNhcCkge1xuICAgICAgICBsZXQgcHggPSBwLng7XG4gICAgICAgIGxldCBweSA9IHAueTtcbiAgICAgICAgbGV0IGRseCA9IGR5O1xuICAgICAgICBsZXQgZGx5ID0gLWR4O1xuICAgIFxuICAgICAgICB0aGlzLl92c2V0KHB4ICsgZGx4ICogdywgcHkgKyBkbHkgKiB3LCAxKTtcbiAgICAgICAgdGhpcy5fdnNldChweCAtIGRseCAqIHcsIHB5IC0gZGx5ICogdywgLTEpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5jYXA7IGkrKykge1xuICAgICAgICAgICAgbGV0IGEgPSBpIC8gKG5jYXAgLSAxKSAqIFBJO1xuICAgICAgICAgICAgbGV0IGF4ID0gY29zKGEpICogdyxcbiAgICAgICAgICAgICAgICBheSA9IHNpbihhKSAqIHc7XG4gICAgICAgICAgICB0aGlzLl92c2V0KHB4LCBweSwgMCk7XG4gICAgICAgICAgICB0aGlzLl92c2V0KHB4IC0gZGx4ICogYXggKyBkeCAqIGF5LCBweSAtIGRseSAqIGF4ICsgZHkgKiBheSwgMSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgX3JvdW5kSm9pbiAocDAsIHAxLCBsdywgcncsIG5jYXApIHtcbiAgICAgICAgbGV0IGRseDAgPSBwMC5keTtcbiAgICAgICAgbGV0IGRseTAgPSAtcDAuZHg7XG4gICAgICAgIGxldCBkbHgxID0gcDEuZHk7XG4gICAgICAgIGxldCBkbHkxID0gLXAxLmR4O1xuICAgIFxuICAgICAgICBsZXQgcDF4ID0gcDEueDtcbiAgICAgICAgbGV0IHAxeSA9IHAxLnk7XG4gICAgXG4gICAgICAgIGlmICgocDEuZmxhZ3MgJiBQb2ludEZsYWdzLlBUX0xFRlQpICE9PSAwKSB7XG4gICAgICAgICAgICBsZXQgb3V0ID0gdGhpcy5fY2hvb3NlQmV2ZWwocDEuZmxhZ3MgJiBQb2ludEZsYWdzLlBUX0lOTkVSQkVWRUwsIHAwLCBwMSwgbHcpO1xuICAgICAgICAgICAgbGV0IGx4MCA9IG91dFswXTtcbiAgICAgICAgICAgIGxldCBseTAgPSBvdXRbMV07XG4gICAgICAgICAgICBsZXQgbHgxID0gb3V0WzJdO1xuICAgICAgICAgICAgbGV0IGx5MSA9IG91dFszXTtcbiAgICBcbiAgICAgICAgICAgIGxldCBhMCA9IGF0YW4yKC1kbHkwLCAtZGx4MCk7XG4gICAgICAgICAgICBsZXQgYTEgPSBhdGFuMigtZGx5MSwgLWRseDEpO1xuICAgICAgICAgICAgaWYgKGExID4gYTApIGExIC09IFBJICogMjtcbiAgICBcbiAgICAgICAgICAgIHRoaXMuX3ZzZXQobHgwLCBseTAsIDEpO1xuICAgICAgICAgICAgdGhpcy5fdnNldChwMXggLSBkbHgwICogcncsIHAxLnkgLSBkbHkwICogcncsIC0xKTtcbiAgICBcbiAgICAgICAgICAgIGxldCBuID0gY2xhbXAoY2VpbCgoYTAgLSBhMSkgLyBQSSkgKiBuY2FwLCAyLCBuY2FwKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHUgPSBpIC8gKG4gLSAxKTtcbiAgICAgICAgICAgICAgICBsZXQgYSA9IGEwICsgdSAqIChhMSAtIGEwKTtcbiAgICAgICAgICAgICAgICBsZXQgcnggPSBwMXggKyBjb3MoYSkgKiBydztcbiAgICAgICAgICAgICAgICBsZXQgcnkgPSBwMXkgKyBzaW4oYSkgKiBydztcbiAgICAgICAgICAgICAgICB0aGlzLl92c2V0KHAxeCwgcDF5LCAwKTtcbiAgICAgICAgICAgICAgICB0aGlzLl92c2V0KHJ4LCByeSwgLTEpO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgdGhpcy5fdnNldChseDEsIGx5MSwgMSk7XG4gICAgICAgICAgICB0aGlzLl92c2V0KHAxeCAtIGRseDEgKiBydywgcDF5IC0gZGx5MSAqIHJ3LCAtMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgb3V0ID0gdGhpcy5fY2hvb3NlQmV2ZWwocDEuZmxhZ3MgJiBQb2ludEZsYWdzLlBUX0lOTkVSQkVWRUwsIHAwLCBwMSwgLXJ3KTtcbiAgICAgICAgICAgIGxldCByeDAgPSBvdXRbMF07XG4gICAgICAgICAgICBsZXQgcnkwID0gb3V0WzFdO1xuICAgICAgICAgICAgbGV0IHJ4MSA9IG91dFsyXTtcbiAgICAgICAgICAgIGxldCByeTEgPSBvdXRbM107XG4gICAgXG4gICAgICAgICAgICBsZXQgYTAgPSBhdGFuMihkbHkwLCBkbHgwKTtcbiAgICAgICAgICAgIGxldCBhMSA9IGF0YW4yKGRseTEsIGRseDEpO1xuICAgICAgICAgICAgaWYgKGExIDwgYTApIGExICs9IFBJICogMjtcbiAgICBcbiAgICAgICAgICAgIHRoaXMuX3ZzZXQocDF4ICsgZGx4MCAqIHJ3LCBwMXkgKyBkbHkwICogcncsIDEpO1xuICAgICAgICAgICAgdGhpcy5fdnNldChyeDAsIHJ5MCwgLTEpO1xuICAgIFxuICAgICAgICAgICAgbGV0IG4gPSBjbGFtcChjZWlsKChhMSAtIGEwKSAvIFBJKSAqIG5jYXAsIDIsIG5jYXApO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgdSA9IGkgLyAobiAtIDEpO1xuICAgICAgICAgICAgICAgIGxldCBhID0gYTAgKyB1ICogKGExIC0gYTApO1xuICAgICAgICAgICAgICAgIGxldCBseCA9IHAxeCArIGNvcyhhKSAqIGx3O1xuICAgICAgICAgICAgICAgIGxldCBseSA9IHAxeSArIHNpbihhKSAqIGx3O1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZzZXQobHgsIGx5LCAxKTtcbiAgICAgICAgICAgICAgICB0aGlzLl92c2V0KHAxeCwgcDF5LCAwKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIHRoaXMuX3ZzZXQocDF4ICsgZGx4MSAqIHJ3LCBwMXkgKyBkbHkxICogcncsIDEpO1xuICAgICAgICAgICAgdGhpcy5fdnNldChyeDEsIHJ5MSwgLTEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIF9iZXZlbEpvaW4gKHAwLCBwMSwgbHcsIHJ3KSB7XG4gICAgICAgIGxldCByeDAsIHJ5MCwgcngxLCByeTE7XG4gICAgICAgIGxldCBseDAsIGx5MCwgbHgxLCBseTE7XG4gICAgICAgIGxldCBkbHgwID0gcDAuZHk7XG4gICAgICAgIGxldCBkbHkwID0gLXAwLmR4O1xuICAgICAgICBsZXQgZGx4MSA9IHAxLmR5O1xuICAgICAgICBsZXQgZGx5MSA9IC1wMS5keDtcbiAgICBcbiAgICAgICAgaWYgKHAxLmZsYWdzICYgUG9pbnRGbGFncy5QVF9MRUZUKSB7XG4gICAgICAgICAgICBsZXQgb3V0ID0gdGhpcy5fY2hvb3NlQmV2ZWwocDEuZmxhZ3MgJiBQb2ludEZsYWdzLlBUX0lOTkVSQkVWRUwsIHAwLCBwMSwgbHcpO1xuICAgICAgICAgICAgbHgwID0gb3V0WzBdO1xuICAgICAgICAgICAgbHkwID0gb3V0WzFdO1xuICAgICAgICAgICAgbHgxID0gb3V0WzJdO1xuICAgICAgICAgICAgbHkxID0gb3V0WzNdO1xuICAgIFxuICAgICAgICAgICAgdGhpcy5fdnNldChseDAsIGx5MCwgMSk7XG4gICAgICAgICAgICB0aGlzLl92c2V0KHAxLnggLSBkbHgwICogcncsIHAxLnkgLSBkbHkwICogcncsIC0xKTtcbiAgICBcbiAgICAgICAgICAgIHRoaXMuX3ZzZXQobHgxLCBseTEsIDEpO1xuICAgICAgICAgICAgdGhpcy5fdnNldChwMS54IC0gZGx4MSAqIHJ3LCBwMS55IC0gZGx5MSAqIHJ3LCAtMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgb3V0ID0gdGhpcy5fY2hvb3NlQmV2ZWwocDEuZmxhZ3MgJiBQb2ludEZsYWdzLlBUX0lOTkVSQkVWRUwsIHAwLCBwMSwgLXJ3KTtcbiAgICAgICAgICAgIHJ4MCA9IG91dFswXTtcbiAgICAgICAgICAgIHJ5MCA9IG91dFsxXTtcbiAgICAgICAgICAgIHJ4MSA9IG91dFsyXTtcbiAgICAgICAgICAgIHJ5MSA9IG91dFszXTtcbiAgICBcbiAgICAgICAgICAgIHRoaXMuX3ZzZXQocDEueCArIGRseDAgKiBsdywgcDEueSArIGRseTAgKiBsdywgMSk7XG4gICAgICAgICAgICB0aGlzLl92c2V0KHJ4MCwgcnkwLCAtMSk7XG4gICAgXG4gICAgICAgICAgICB0aGlzLl92c2V0KHAxLnggKyBkbHgxICogbHcsIHAxLnkgKyBkbHkxICogbHcsIDEpO1xuICAgICAgICAgICAgdGhpcy5fdnNldChyeDEsIHJ5MSwgLTEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIF92c2V0ICh4LCB5LCBkaXN0YW5jZSA9IDApIHtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IHRoaXMuX2J1ZmZlcjtcbiAgICAgICAgbGV0IG1lc2hidWZmZXIgPSBidWZmZXIubWVzaGJ1ZmZlcjtcbiAgICAgICAgbGV0IGRhdGFPZmZzZXQgPSBidWZmZXIudmVydGV4U3RhcnQgKiB0aGlzLmdldFZmbXRGbG9hdENvdW50KCk7XG5cbiAgICAgICAgbGV0IHZEYXRhID0gbWVzaGJ1ZmZlci5fdkRhdGE7XG4gICAgICAgIGxldCB1aW50VkRhdGEgPSBtZXNoYnVmZmVyLl91aW50VkRhdGE7XG5cbiAgICAgICAgdkRhdGFbZGF0YU9mZnNldF0gPSB4O1xuICAgICAgICB2RGF0YVtkYXRhT2Zmc2V0KzFdID0geTtcbiAgICAgICAgdWludFZEYXRhW2RhdGFPZmZzZXQrMl0gPSB0aGlzLl9jdXJDb2xvcjtcbiAgICAgICAgdkRhdGFbZGF0YU9mZnNldCszXSA9IGRpc3RhbmNlO1xuXG4gICAgICAgIGJ1ZmZlci52ZXJ0ZXhTdGFydCArKztcbiAgICAgICAgbWVzaGJ1ZmZlci5fZGlydHkgPSB0cnVlO1xuICAgIH1cbn1cblxuQXNzZW1ibGVyLnJlZ2lzdGVyKGNjLkdyYXBoaWNzLCBHcmFwaGljc0Fzc2VtYmxlcik7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==