
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/spine/spine-assembler.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _assembler = _interopRequireDefault(require("../../cocos2d/core/renderer/assembler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Skeleton = require('./Skeleton');

var spine = require('./lib/spine');

var RenderFlow = require('../../cocos2d/core/renderer/render-flow');

var VertexFormat = require('../../cocos2d/core/renderer/webgl/vertex-format');

var VFOneColor = VertexFormat.vfmt3D;
var VFTwoColor = VertexFormat.vfmtPos3UvTwoColor;
var gfx = cc.gfx;
var FLAG_BATCH = 0x10;
var FLAG_TWO_COLOR = 0x01;
var _handleVal = 0x00;
var _quadTriangles = [0, 1, 2, 2, 3, 0];

var _slotColor = cc.color(0, 0, 255, 255);

var _boneColor = cc.color(255, 0, 0, 255);

var _originColor = cc.color(0, 255, 0, 255);

var _meshColor = cc.color(255, 255, 0, 255);

var _finalColor = null;
var _darkColor = null;
var _tempPos = null,
    _tempUv = null;

if (!CC_NATIVERENDERER) {
  _finalColor = new spine.Color(1, 1, 1, 1);
  _darkColor = new spine.Color(1, 1, 1, 1);
  _tempPos = new spine.Vector2();
  _tempUv = new spine.Vector2();
}

var _premultipliedAlpha;

var _multiplier;

var _slotRangeStart;

var _slotRangeEnd;

var _useTint;

var _debugSlots;

var _debugBones;

var _debugMesh;

var _nodeR, _nodeG, _nodeB, _nodeA;

var _finalColor32, _darkColor32;

var _vertexFormat;

var _perVertexSize;

var _perClipVertexSize;
/** 当前slot的顶点浮点数计数 */


var _vertexFloatCount = 0;
var _vertexCount = 0;
var _vertexFloatOffset = 0;
/** 此时的顶点在vbo的偏移 */

var _vertexOffset = 0;
/** 当前slot的顶点索引计数 */

var _indexCount = 0;
/** 此时的顶点在ibo的偏移 */

var _indexOffset = 0;
var _vfOffset = 0;

var _tempr, _tempg, _tempb;

var _inRange;

var _mustFlush;

var _x, _y, _m00, _m04, _m12, _m01, _m05, _m13;

var _r, _g, _b, _fr, _fg, _fb, _fa, _dr, _dg, _db, _da;

var _comp, _buffer, _renderer, _node, _needColor, _vertexEffect;

var _depth;

var _realtimeVertices = [];
/** 实时渲染的顶点大小(字节)，读取skeleton时用 */

var _realtimeSizePerVertex = 0;
var DEPTH_RATE = 5e-4;

function _getSlotMaterial(tex, blendMode) {
  var src, dst;

  switch (blendMode) {
    case spine.BlendMode.Additive:
      src = _premultipliedAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA;
      dst = cc.macro.ONE;
      break;

    case spine.BlendMode.Multiply:
      src = cc.macro.DST_COLOR;
      dst = cc.macro.ONE_MINUS_SRC_ALPHA;
      break;

    case spine.BlendMode.Screen:
      src = cc.macro.ONE;
      dst = cc.macro.ONE_MINUS_SRC_COLOR;
      break;

    case spine.BlendMode.Normal:
    default:
      src = _premultipliedAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA;
      dst = cc.macro.ONE_MINUS_SRC_ALPHA;
      break;
  }

  var useModel = !_comp.enableBatch;
  var baseMaterial = _comp._materials[0];
  if (!baseMaterial) return null; // The key use to find corresponding material

  var key = tex.getId() + src + dst + _useTint + useModel;
  var materialCache = _comp._materialCache;
  var material = materialCache[key];

  if (!material) {
    if (!materialCache.baseMaterial) {
      material = baseMaterial;
      materialCache.baseMaterial = baseMaterial;
    } else {
      material = cc.MaterialVariant.create(baseMaterial);
    }

    material.define('CC_USE_MODEL', useModel);
    material.define('USE_TINT', _useTint); // update texture

    material.setProperty('texture', tex); // update blend function

    material.setBlend(true, gfx.BLEND_FUNC_ADD, src, dst, gfx.BLEND_FUNC_ADD, src, dst);
    materialCache[key] = material;
  }

  return material;
}

function _handleColor(color) {
  // temp rgb has multiply 255, so need divide 255;
  _fa = color.fa * _nodeA;
  _multiplier = _premultipliedAlpha ? _fa / 255 : 1;
  _r = _nodeR * _multiplier;
  _g = _nodeG * _multiplier;
  _b = _nodeB * _multiplier;
  _fr = color.fr * _r;
  _fg = color.fg * _g;
  _fb = color.fb * _b;
  _finalColor32 = (_fa << 24 >>> 0) + (_fb << 16) + (_fg << 8) + _fr;
  _dr = color.dr * _r;
  _dg = color.dg * _g;
  _db = color.db * _b;
  _da = _premultipliedAlpha ? 255 : 0;
  _darkColor32 = (_da << 24 >>> 0) + (_db << 16) + (_dg << 8) + _dr;
}

function _spineColorToInt32(spineColor) {
  return (spineColor.a << 24 >>> 0) + (spineColor.b << 16) + (spineColor.g << 8) + spineColor.r;
}

var SpineAssembler = /*#__PURE__*/function (_Assembler) {
  _inheritsLoose(SpineAssembler, _Assembler);

  function SpineAssembler() {
    var _this;

    _this = _Assembler.call(this) || this;

    if (cc.sys.os != cc.sys.OS_ANDROID) {
      DEPTH_RATE = 1e-6;
    }

    console.log('assembler', DEPTH_RATE, cc.sys.os);
    return _this;
  }

  var _proto = SpineAssembler.prototype;

  _proto.updateRenderData = function updateRenderData(comp) {
    if (comp.isAnimationCached()) return;
    var skeleton = comp._skeleton;

    if (skeleton) {
      skeleton.updateWorldTransform();
    }
  };

  _proto.fillVertices = function fillVertices(skeletonColor, attachmentColor, slotColor, clipper, slot, slotIdx) {
    var vbuf = _buffer._vData,
        ibuf = _buffer._iData,
        uintVData = _buffer._uintVData;
    var offsetInfo;
    _finalColor.a = slotColor.a * attachmentColor.a * skeletonColor.a * _nodeA * 255;
    _multiplier = _premultipliedAlpha ? _finalColor.a : 255;
    _tempr = _nodeR * attachmentColor.r * skeletonColor.r * _multiplier;
    _tempg = _nodeG * attachmentColor.g * skeletonColor.g * _multiplier;
    _tempb = _nodeB * attachmentColor.b * skeletonColor.b * _multiplier;
    _finalColor.r = _tempr * slotColor.r;
    _finalColor.g = _tempg * slotColor.g;
    _finalColor.b = _tempb * slotColor.b;

    if (slot.darkColor == null) {
      _darkColor.set(0.0, 0.0, 0.0, 1.0);
    } else {
      _darkColor.r = slot.darkColor.r * _tempr;
      _darkColor.g = slot.darkColor.g * _tempg;
      _darkColor.b = slot.darkColor.b * _tempb;
    }

    _darkColor.a = _premultipliedAlpha ? 255 : 0;

    if (
    /**!clipper.isClipping()*/
    true) {
      if (_vertexEffect) {
        for (var v = _vertexFloatOffset, n = _vertexFloatOffset + _vertexFloatCount; v < n; v += _perVertexSize) {
          _tempPos.x = vbuf[v];
          _tempPos.y = vbuf[v + 1];
          _tempUv.x = vbuf[v + 3];
          _tempUv.y = vbuf[v + 4];

          _vertexEffect.transform(_tempPos, _tempUv, _finalColor, _darkColor);

          vbuf[v] = _tempPos.x; // x

          vbuf[v + 1] = _tempPos.y; // y

          vbuf[v + 3] = _tempUv.x; // u

          vbuf[v + 4] = _tempUv.y; // v

          uintVData[v + 5] = _spineColorToInt32(_finalColor); // light color

          _useTint && (uintVData[v + 6] = _spineColorToInt32(_darkColor)); // dark color
        }
      } else {
        _finalColor32 = _spineColorToInt32(_finalColor);
        _darkColor32 = _spineColorToInt32(_darkColor);

        for (var _v = _vertexFloatOffset, _n = _vertexFloatOffset + _vertexFloatCount; _v < _n; _v += _perVertexSize) {
          uintVData[_v + 5] = _finalColor32; // light color

          _useTint && (uintVData[_v + 6] = _darkColor32); // dark color
        }
      }
    } else {
      var uvs = vbuf.subarray(_vertexFloatOffset + 3);
      clipper.clipTriangles(vbuf.subarray(_vertexFloatOffset), _vertexFloatCount, ibuf.subarray(_indexOffset), _indexCount, uvs, _finalColor, _darkColor, _useTint, _perVertexSize);
      var clippedVertices = new Float32Array(clipper.clippedVertices);
      var clippedTriangles = clipper.clippedTriangles; // insure capacity

      _indexCount = clippedTriangles.length;
      _vertexFloatCount = clippedVertices.length / _perClipVertexSize * _perVertexSize;
      offsetInfo = _buffer.request(_vertexFloatCount / _perVertexSize, _indexCount);
      _indexOffset = offsetInfo.indiceOffset, _vertexOffset = offsetInfo.vertexOffset, _vertexFloatOffset = offsetInfo.byteOffset >> 2;
      vbuf = _buffer._vData, ibuf = _buffer._iData;
      uintVData = _buffer._uintVData; // fill indices

      ibuf.set(clippedTriangles, _indexOffset); // fill vertices contain x y u v light color dark color

      if (_vertexEffect) {
        for (var _v2 = 0, _n2 = clippedVertices.length, offset = _vertexFloatOffset; _v2 < _n2; _v2 += _perClipVertexSize, offset += _perVertexSize) {
          _tempPos.x = clippedVertices[_v2];
          _tempPos.y = clippedVertices[_v2 + 1];

          _finalColor.set(clippedVertices[_v2 + 2], clippedVertices[_v2 + 3], clippedVertices[_v2 + 4], clippedVertices[_v2 + 5]);

          _tempUv.x = clippedVertices[_v2 + 6];
          _tempUv.y = clippedVertices[_v2 + 7];

          if (_useTint) {
            _darkColor.set(clippedVertices[_v2 + 8], clippedVertices[_v2 + 9], clippedVertices[_v2 + 10], clippedVertices[_v2 + 11]);
          } else {
            _darkColor.set(0, 0, 0, 0);
          }

          _vertexEffect.transform(_tempPos, _tempUv, _finalColor, _darkColor);

          vbuf[offset] = _tempPos.x; // x

          vbuf[offset + 1] = _tempPos.y; // y

          vbuf[offset + 2] = _tempUv.x; // u

          vbuf[offset + 3] = _tempUv.y; // v

          uintVData[offset + 4] = _spineColorToInt32(_finalColor);

          if (_useTint) {
            uintVData[offset + 5] = _spineColorToInt32(_darkColor);
          }
        }
      } else {
        for (var _v3 = 0, _n3 = clippedVertices.length, _offset = _vertexFloatOffset; _v3 < _n3; _v3 += _perClipVertexSize, _offset += _perVertexSize) {
          vbuf[_offset] = clippedVertices[_v3]; // x

          vbuf[_offset + 1] = clippedVertices[_v3 + 1]; // y

          vbuf[_offset + 2] = clippedVertices[_v3 + 6]; // u

          vbuf[_offset + 3] = clippedVertices[_v3 + 7]; // v

          _finalColor32 = (clippedVertices[_v3 + 5] << 24 >>> 0) + (clippedVertices[_v3 + 4] << 16) + (clippedVertices[_v3 + 3] << 8) + clippedVertices[_v3 + 2];
          uintVData[_offset + 4] = _finalColor32;

          if (_useTint) {
            _darkColor32 = (clippedVertices[_v3 + 11] << 24 >>> 0) + (clippedVertices[_v3 + 10] << 16) + (clippedVertices[_v3 + 9] << 8) + clippedVertices[_v3 + 8];
            uintVData[_offset + 5] = _darkColor32;
          }
        }
      }
    }
  };

  _proto.realTimeTraverse = function realTimeTraverse(worldMat) {
    var vbuf;
    var ibuf;
    var locSkeleton = _comp._skeleton;
    var skeletonColor = locSkeleton.color;
    var graphics = _comp._debugRenderer;
    var clipper = _comp._clipper;
    var material = null;
    var attachment, attachmentColor, slotColor, uvs, triangles;
    var isRegion, isMesh, isClip;
    var offsetInfo;
    var slot;
    var worldMatm;
    _slotRangeStart = _comp._startSlotIndex;
    _slotRangeEnd = _comp._endSlotIndex;
    _inRange = false;
    if (_slotRangeStart == -1) _inRange = true;
    _debugSlots = _comp.debugSlots;
    _debugBones = _comp.debugBones;
    _debugMesh = _comp.debugMesh;

    if (graphics && (_debugBones || _debugSlots || _debugMesh)) {
      graphics.clear();
      graphics.lineWidth = 2;
    } // x y u v r1 g1 b1 a1 r2 g2 b2 a2 or x y u v r g b a 


    _perClipVertexSize = _useTint ? 12 : 8;
    _vertexFloatCount = 0;
    _vertexFloatOffset = 0;
    _vertexOffset = 0;
    _indexCount = 0;
    _indexOffset = 0;
    _realtimeVertices.length = 0;

    for (var slotIdx = 0, slotCount = locSkeleton.drawOrder.length; slotIdx < slotCount; slotIdx++) {
      slot = locSkeleton.drawOrder[slotIdx];

      if (slot == undefined) {
        continue;
      }

      if (_slotRangeStart >= 0 && _slotRangeStart == slot.data.index) {
        _inRange = true;
      }

      if (!_inRange) {
        clipper.clipEndWithSlot(slot);
        continue;
      }

      if (_slotRangeEnd >= 0 && _slotRangeEnd == slot.data.index) {
        _inRange = false;
      }

      _vertexFloatCount = 0;
      _indexCount = 0;
      _realtimeVertices.length = 0;
      attachment = slot.getAttachment();

      if (!attachment) {
        clipper.clipEndWithSlot(slot);
        continue;
      }

      isRegion = attachment instanceof spine.RegionAttachment;
      isMesh = attachment instanceof spine.MeshAttachment;
      isClip = attachment instanceof spine.ClippingAttachment;

      if (isClip) {
        clipper.clipStart(slot, attachment);
        continue;
      }

      if (!isRegion && !isMesh) {
        clipper.clipEndWithSlot(slot);
        continue;
      }

      material = _getSlotMaterial(attachment.region.texture._texture, slot.data.blendMode);

      if (!material) {
        clipper.clipEndWithSlot(slot);
        continue;
      }

      if (_mustFlush || material.getHash() !== _renderer.material.getHash()) {
        _mustFlush = false;

        _renderer._flush();

        _renderer.node = _node;
        _renderer.material = material;
      }

      if (isRegion) {
        triangles = _quadTriangles; // insure capacity

        _vertexFloatCount = 4 * _perVertexSize;
        _indexCount = 6;
        offsetInfo = _buffer.request(4, 6);
        _indexOffset = offsetInfo.indiceOffset, _vertexOffset = offsetInfo.vertexOffset, _vertexFloatOffset = offsetInfo.byteOffset >> 2;
        vbuf = _buffer._vData, ibuf = _buffer._iData; // compute vertex and fill x y
        // attachment.computeWorldVertices(slot.bone, vbuf, _vertexFloatOffset, _perVertexSize);

        attachment.computeWorldVertices(slot.bone, _realtimeVertices, 0, _realtimeSizePerVertex); //将此slot的顶点写入缓存区

        this._writeVertex2ToVertex3Buffer(_realtimeVertices, vbuf, _vertexFloatOffset, 4, slotIdx); // draw debug slots if enabled graphics


        if (graphics && _debugSlots) {
          graphics.strokeColor = _slotColor;
          graphics.moveTo(vbuf[_vertexFloatOffset], vbuf[_vertexFloatOffset + 1]);

          for (var ii = _vertexFloatOffset + _perVertexSize, nn = _vertexFloatOffset + _vertexFloatCount; ii < nn; ii += _perVertexSize) {
            graphics.lineTo(vbuf[ii], vbuf[ii + 1]);
          }

          graphics.close();
          graphics.stroke();
        }
      } else if (isMesh) {
        triangles = attachment.triangles; // insure capacity

        _vertexFloatCount = (attachment.worldVerticesLength >> 1) * _perVertexSize;
        _indexCount = triangles.length;
        offsetInfo = _buffer.request(_vertexFloatCount / _perVertexSize, _indexCount);
        _indexOffset = offsetInfo.indiceOffset, _vertexOffset = offsetInfo.vertexOffset, _vertexFloatOffset = offsetInfo.byteOffset >> 2;
        vbuf = _buffer._vData, ibuf = _buffer._iData; // compute vertex and fill x y
        // attachment.computeWorldVertices(slot, 0, attachment.worldVerticesLength, vbuf, _vertexFloatOffset, _perVertexSize);

        attachment.computeWorldVertices(slot, 0, attachment.worldVerticesLength, _realtimeVertices, 0, _realtimeSizePerVertex); //将此slot的顶点写入缓存区

        this._writeVertex2ToVertex3Buffer(_realtimeVertices, vbuf, _vertexFloatOffset, _vertexFloatCount / _perVertexSize, slotIdx); // draw debug mesh if enabled graphics


        if (graphics && _debugMesh) {
          graphics.strokeColor = _meshColor;

          for (var _ii = 0, _nn = triangles.length; _ii < _nn; _ii += 3) {
            var v1 = triangles[_ii] * _perVertexSize + _vertexFloatOffset;
            var v2 = triangles[_ii + 1] * _perVertexSize + _vertexFloatOffset;
            var v3 = triangles[_ii + 2] * _perVertexSize + _vertexFloatOffset;
            graphics.moveTo(vbuf[v1], vbuf[v1 + 1]);
            graphics.lineTo(vbuf[v2], vbuf[v2 + 1]);
            graphics.lineTo(vbuf[v3], vbuf[v3 + 1]);
            graphics.close();
            graphics.stroke();
          }
        }
      }

      if (_vertexFloatCount == 0 || _indexCount == 0) {
        clipper.clipEndWithSlot(slot);
        continue;
      } // fill indices


      ibuf.set(triangles, _indexOffset); // fill u v

      uvs = attachment.uvs;

      for (var v = _vertexFloatOffset, n = _vertexFloatOffset + _vertexFloatCount, u = 0; v < n; v += _perVertexSize, u += 2) {
        vbuf[v + 3] = uvs[u]; // u

        vbuf[v + 4] = uvs[u + 1]; // v
      }

      attachmentColor = attachment.color, slotColor = slot.color;
      this.fillVertices(skeletonColor, attachmentColor, slotColor, clipper, slot, slotIdx); // reset buffer pointer, because clipper maybe realloc a new buffer in file Vertices function.

      vbuf = _buffer._vData, ibuf = _buffer._iData;

      if (_indexCount > 0) {
        for (var _ii2 = _indexOffset, _nn2 = _indexOffset + _indexCount; _ii2 < _nn2; _ii2++) {
          ibuf[_ii2] += _vertexOffset;
        }

        if (worldMat) {
          worldMatm = worldMat.m;
          _m00 = worldMatm[0];
          _m04 = worldMatm[4];
          _m12 = worldMatm[12];
          _m01 = worldMatm[1];
          _m05 = worldMatm[5];
          _m13 = worldMatm[13];

          for (var _ii3 = _vertexFloatOffset, _nn3 = _vertexFloatOffset + _vertexFloatCount; _ii3 < _nn3; _ii3 += _perVertexSize) {
            _x = vbuf[_ii3];
            _y = vbuf[_ii3 + 1];
            vbuf[_ii3] = _x * _m00 + _y * _m04 + _m12;
            vbuf[_ii3 + 1] = _x * _m01 + _y * _m05 + _m13;
          }
        }

        _buffer.adjust(_vertexFloatCount / _perVertexSize, _indexCount);
      }

      clipper.clipEndWithSlot(slot);
    }

    clipper.clipEnd();

    if (graphics && _debugBones) {
      var bone;
      graphics.strokeColor = _boneColor;
      graphics.fillColor = _slotColor; // Root bone color is same as slot color.

      for (var i = 0, _n4 = locSkeleton.bones.length; i < _n4; i++) {
        bone = locSkeleton.bones[i];
        var x = bone.data.length * bone.a + bone.worldX;
        var y = bone.data.length * bone.c + bone.worldY; // Bone lengths.

        graphics.moveTo(bone.worldX, bone.worldY);
        graphics.lineTo(x, y);
        graphics.stroke(); // Bone origins.

        graphics.circle(bone.worldX, bone.worldY, Math.PI * 1.5);
        graphics.fill();

        if (i === 0) {
          graphics.fillColor = _originColor;
        }
      }
    }
  };

  _proto._writeVertex2ToVertex3Buffer = function _writeVertex2ToVertex3Buffer(vertex2Array, vertex3Buffer, offset, vertexCount, slotIdx) {
    for (var i = 0; i < vertexCount; i++) {
      var dstOffset = i * _perVertexSize + offset;
      var srcOffset = i * _realtimeSizePerVertex;
      vertex3Buffer[dstOffset] = vertex2Array[srcOffset]; //x

      vertex3Buffer[dstOffset + 1] = vertex2Array[srcOffset + 1]; //y

      vertex3Buffer[dstOffset + 2] = _depth - DEPTH_RATE * slotIdx; //z

      vertex3Buffer[dstOffset + 3] = vertex2Array[srcOffset + 2]; //u

      vertex3Buffer[dstOffset + 4] = vertex2Array[srcOffset + 3]; //v

      vertex3Buffer[dstOffset + 5] = vertex2Array[srcOffset + 4]; //c1

      if (_useTint) {
        vertex3Buffer[dstOffset + 6] = vertex2Array[srcOffset + 5]; //c2
      }
    }
  };

  _proto.cacheTraverse = function cacheTraverse(worldMat) {
    var frame = _comp._curFrame;
    if (!frame) return;
    var segments = frame.segments;
    if (segments.length == 0) return;
    var offsets = frame.offsets;
    var vbuf, ibuf, uintbuf;
    var material;
    var offsetInfo;
    var vertices = frame.vertices;
    var indices = frame.indices;
    var worldMatm;
    var frameVFOffset = 0,
        frameIndexOffset = 0,
        segVFCount = 0;

    if (worldMat) {
      worldMatm = worldMat.m;
      _m00 = worldMatm[0];
      _m01 = worldMatm[1];
      _m04 = worldMatm[4];
      _m05 = worldMatm[5];
      _m12 = worldMatm[12];
      _m13 = worldMatm[13];
    }

    var justTranslate = _m00 === 1 && _m01 === 0 && _m04 === 0 && _m05 === 1;
    var needBatch = _handleVal & FLAG_BATCH;
    var calcTranslate = needBatch && justTranslate;
    var colorOffset = 0;
    var colors = frame.colors;
    var nowColor = colors[colorOffset++];
    var maxVFOffset = nowColor.vfOffset;

    _handleColor(nowColor);

    for (var i = 0, n = segments.length; i < n; i++) {
      var segInfo = segments[i];
      material = _getSlotMaterial(segInfo.tex, segInfo.blendMode);
      if (!material) continue;

      if (_mustFlush || material.getHash() !== _renderer.material.getHash()) {
        _mustFlush = false;

        _renderer._flush();

        _renderer.node = _node;
        _renderer.material = material;
      }

      _vertexCount = segInfo.vertexCount;
      _indexCount = segInfo.indexCount;
      offsetInfo = _buffer.request(_vertexCount, _indexCount);
      _indexOffset = offsetInfo.indiceOffset;
      _vertexOffset = offsetInfo.vertexOffset;
      _vfOffset = offsetInfo.byteOffset >> 2;
      vbuf = _buffer._vData;
      ibuf = _buffer._iData;
      uintbuf = _buffer._uintVData;

      for (var ii = _indexOffset, il = _indexOffset + _indexCount; ii < il; ii++) {
        ibuf[ii] = _vertexOffset + indices[frameIndexOffset++];
      }

      segVFCount = segInfo.vfCount;
      var renderVertexCount = _vertexCount * _perVertexSize;

      for (var _i = 0; _i < _vertexCount; _i++) {
        var dstOffset = _vfOffset + _i * 7;
        var srcOffset = frameVFOffset + _i * 6;
        vbuf[dstOffset] = vertices[srcOffset];
        vbuf[dstOffset + 1] = vertices[srcOffset + 1];
        var j = void 0,
            len = void 0;

        for (j = 0, len = offsets.length; j < len; j++) {
          if (srcOffset <= offsets[j]) break;
        }

        vbuf[dstOffset + 2] = _depth - DEPTH_RATE * j; //todo depth + 自己深度

        vbuf[dstOffset + 3] = vertices[srcOffset + 2];
        vbuf[dstOffset + 4] = vertices[srcOffset + 3];
        vbuf[dstOffset + 5] = vertices[srcOffset + 4];
        vbuf[dstOffset + 6] = vertices[srcOffset + 5];
      } // vbuf.set(vertices.subarray(frameVFOffset, frameVFOffset + segVFCount), _vfOffset);


      frameVFOffset += segVFCount;

      if (calcTranslate) {
        for (var _ii4 = _vfOffset, _il = _vfOffset + renderVertexCount; _ii4 < _il; _ii4 += 7) {
          vbuf[_ii4] += _m12;
          vbuf[_ii4 + 1] += _m13;
        }
      } else if (needBatch) {
        for (var _ii5 = _vfOffset, _il2 = _vfOffset + renderVertexCount; _ii5 < _il2; _ii5 += 7) {
          _x = vbuf[_ii5];
          _y = vbuf[_ii5 + 1];
          vbuf[_ii5] = _x * _m00 + _y * _m04 + _m12;
          vbuf[_ii5 + 1] = _x * _m01 + _y * _m05 + _m13;
        }
      }

      _buffer.adjust(_vertexCount, _indexCount);

      if (!_needColor) continue; // handle color

      var frameColorOffset = frameVFOffset - segVFCount;

      for (var _ii6 = _vfOffset + 5, _il3 = _vfOffset + 5 + segVFCount; _ii6 < _il3; _ii6 += 7, frameColorOffset += 6) {
        if (frameColorOffset >= maxVFOffset) {
          nowColor = colors[colorOffset++];

          _handleColor(nowColor);

          maxVFOffset = nowColor.vfOffset;
        }

        uintbuf[_ii6] = _finalColor32;
        uintbuf[_ii6 + 1] = _darkColor32;
      }
    }
  };

  _proto.fillBuffers = function fillBuffers(comp, renderer) {
    var node = comp.node;
    node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;
    if (!comp._skeleton) return;
    var nodeColor = node._color;
    _nodeR = nodeColor.r / 255;
    _nodeG = nodeColor.g / 255;
    _nodeB = nodeColor.b / 255;
    _nodeA = nodeColor.a / 255;
    _useTint = comp.useTint || comp.isAnimationCached();
    _vertexFormat = _useTint ? VFTwoColor : VFOneColor; // x y z u v color1 color2 or x y u v color

    _perVertexSize = _useTint ? 7 : 6;
    _realtimeSizePerVertex = _useTint ? 6 : 5;
    _node = comp.node;
    _buffer = renderer.getBuffer('spine', _vertexFormat);
    _renderer = renderer;
    _comp = comp;
    _depth = _node.depth || 0;
    _mustFlush = true;
    _premultipliedAlpha = comp.premultipliedAlpha;
    _multiplier = 1.0;
    _handleVal = 0x00;
    _needColor = false;
    _vertexEffect = comp._effectDelegate && comp._effectDelegate._vertexEffect;

    if (nodeColor._val !== 0xffffffff || _premultipliedAlpha) {
      _needColor = true;
    }

    if (_useTint) {
      _handleVal |= FLAG_TWO_COLOR;
    }

    var worldMat = undefined;

    if (_comp.enableBatch) {
      worldMat = _node._worldMatrix;
      _mustFlush = false;
      _handleVal |= FLAG_BATCH;
    }

    if (comp.isAnimationCached()) {
      // Traverse input assembler.
      this.cacheTraverse(worldMat);
    } else {
      if (_vertexEffect) _vertexEffect.begin(comp._skeleton);
      this.realTimeTraverse(worldMat);
      if (_vertexEffect) _vertexEffect.end();
    } // sync attached node matrix


    renderer.worldMatDirty++;

    comp.attachUtil._syncAttachedNode(); // Clear temp var.


    _node = undefined;
    _buffer = undefined;
    _renderer = undefined;
    _comp = undefined;
    _vertexEffect = null;
  };

  _proto.postFillBuffers = function postFillBuffers(comp, renderer) {
    renderer.worldMatDirty--;
  };

  return SpineAssembler;
}(_assembler["default"]);

exports["default"] = SpineAssembler;

_assembler["default"].register(Skeleton, SpineAssembler);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvZXh0ZW5zaW9ucy9zcGluZS9zcGluZS1hc3NlbWJsZXIuanMiXSwibmFtZXMiOlsiU2tlbGV0b24iLCJyZXF1aXJlIiwic3BpbmUiLCJSZW5kZXJGbG93IiwiVmVydGV4Rm9ybWF0IiwiVkZPbmVDb2xvciIsInZmbXQzRCIsIlZGVHdvQ29sb3IiLCJ2Zm10UG9zM1V2VHdvQ29sb3IiLCJnZngiLCJjYyIsIkZMQUdfQkFUQ0giLCJGTEFHX1RXT19DT0xPUiIsIl9oYW5kbGVWYWwiLCJfcXVhZFRyaWFuZ2xlcyIsIl9zbG90Q29sb3IiLCJjb2xvciIsIl9ib25lQ29sb3IiLCJfb3JpZ2luQ29sb3IiLCJfbWVzaENvbG9yIiwiX2ZpbmFsQ29sb3IiLCJfZGFya0NvbG9yIiwiX3RlbXBQb3MiLCJfdGVtcFV2IiwiQ0NfTkFUSVZFUkVOREVSRVIiLCJDb2xvciIsIlZlY3RvcjIiLCJfcHJlbXVsdGlwbGllZEFscGhhIiwiX211bHRpcGxpZXIiLCJfc2xvdFJhbmdlU3RhcnQiLCJfc2xvdFJhbmdlRW5kIiwiX3VzZVRpbnQiLCJfZGVidWdTbG90cyIsIl9kZWJ1Z0JvbmVzIiwiX2RlYnVnTWVzaCIsIl9ub2RlUiIsIl9ub2RlRyIsIl9ub2RlQiIsIl9ub2RlQSIsIl9maW5hbENvbG9yMzIiLCJfZGFya0NvbG9yMzIiLCJfdmVydGV4Rm9ybWF0IiwiX3BlclZlcnRleFNpemUiLCJfcGVyQ2xpcFZlcnRleFNpemUiLCJfdmVydGV4RmxvYXRDb3VudCIsIl92ZXJ0ZXhDb3VudCIsIl92ZXJ0ZXhGbG9hdE9mZnNldCIsIl92ZXJ0ZXhPZmZzZXQiLCJfaW5kZXhDb3VudCIsIl9pbmRleE9mZnNldCIsIl92Zk9mZnNldCIsIl90ZW1wciIsIl90ZW1wZyIsIl90ZW1wYiIsIl9pblJhbmdlIiwiX211c3RGbHVzaCIsIl94IiwiX3kiLCJfbTAwIiwiX20wNCIsIl9tMTIiLCJfbTAxIiwiX20wNSIsIl9tMTMiLCJfciIsIl9nIiwiX2IiLCJfZnIiLCJfZmciLCJfZmIiLCJfZmEiLCJfZHIiLCJfZGciLCJfZGIiLCJfZGEiLCJfY29tcCIsIl9idWZmZXIiLCJfcmVuZGVyZXIiLCJfbm9kZSIsIl9uZWVkQ29sb3IiLCJfdmVydGV4RWZmZWN0IiwiX2RlcHRoIiwiX3JlYWx0aW1lVmVydGljZXMiLCJfcmVhbHRpbWVTaXplUGVyVmVydGV4IiwiREVQVEhfUkFURSIsIl9nZXRTbG90TWF0ZXJpYWwiLCJ0ZXgiLCJibGVuZE1vZGUiLCJzcmMiLCJkc3QiLCJCbGVuZE1vZGUiLCJBZGRpdGl2ZSIsIm1hY3JvIiwiT05FIiwiU1JDX0FMUEhBIiwiTXVsdGlwbHkiLCJEU1RfQ09MT1IiLCJPTkVfTUlOVVNfU1JDX0FMUEhBIiwiU2NyZWVuIiwiT05FX01JTlVTX1NSQ19DT0xPUiIsIk5vcm1hbCIsInVzZU1vZGVsIiwiZW5hYmxlQmF0Y2giLCJiYXNlTWF0ZXJpYWwiLCJfbWF0ZXJpYWxzIiwia2V5IiwiZ2V0SWQiLCJtYXRlcmlhbENhY2hlIiwiX21hdGVyaWFsQ2FjaGUiLCJtYXRlcmlhbCIsIk1hdGVyaWFsVmFyaWFudCIsImNyZWF0ZSIsImRlZmluZSIsInNldFByb3BlcnR5Iiwic2V0QmxlbmQiLCJCTEVORF9GVU5DX0FERCIsIl9oYW5kbGVDb2xvciIsImZhIiwiZnIiLCJmZyIsImZiIiwiZHIiLCJkZyIsImRiIiwiX3NwaW5lQ29sb3JUb0ludDMyIiwic3BpbmVDb2xvciIsImEiLCJiIiwiZyIsInIiLCJTcGluZUFzc2VtYmxlciIsInN5cyIsIm9zIiwiT1NfQU5EUk9JRCIsImNvbnNvbGUiLCJsb2ciLCJ1cGRhdGVSZW5kZXJEYXRhIiwiY29tcCIsImlzQW5pbWF0aW9uQ2FjaGVkIiwic2tlbGV0b24iLCJfc2tlbGV0b24iLCJ1cGRhdGVXb3JsZFRyYW5zZm9ybSIsImZpbGxWZXJ0aWNlcyIsInNrZWxldG9uQ29sb3IiLCJhdHRhY2htZW50Q29sb3IiLCJzbG90Q29sb3IiLCJjbGlwcGVyIiwic2xvdCIsInNsb3RJZHgiLCJ2YnVmIiwiX3ZEYXRhIiwiaWJ1ZiIsIl9pRGF0YSIsInVpbnRWRGF0YSIsIl91aW50VkRhdGEiLCJvZmZzZXRJbmZvIiwiZGFya0NvbG9yIiwic2V0IiwidiIsIm4iLCJ4IiwieSIsInRyYW5zZm9ybSIsInV2cyIsInN1YmFycmF5IiwiY2xpcFRyaWFuZ2xlcyIsImNsaXBwZWRWZXJ0aWNlcyIsIkZsb2F0MzJBcnJheSIsImNsaXBwZWRUcmlhbmdsZXMiLCJsZW5ndGgiLCJyZXF1ZXN0IiwiaW5kaWNlT2Zmc2V0IiwidmVydGV4T2Zmc2V0IiwiYnl0ZU9mZnNldCIsIm9mZnNldCIsInJlYWxUaW1lVHJhdmVyc2UiLCJ3b3JsZE1hdCIsImxvY1NrZWxldG9uIiwiZ3JhcGhpY3MiLCJfZGVidWdSZW5kZXJlciIsIl9jbGlwcGVyIiwiYXR0YWNobWVudCIsInRyaWFuZ2xlcyIsImlzUmVnaW9uIiwiaXNNZXNoIiwiaXNDbGlwIiwid29ybGRNYXRtIiwiX3N0YXJ0U2xvdEluZGV4IiwiX2VuZFNsb3RJbmRleCIsImRlYnVnU2xvdHMiLCJkZWJ1Z0JvbmVzIiwiZGVidWdNZXNoIiwiY2xlYXIiLCJsaW5lV2lkdGgiLCJzbG90Q291bnQiLCJkcmF3T3JkZXIiLCJ1bmRlZmluZWQiLCJkYXRhIiwiaW5kZXgiLCJjbGlwRW5kV2l0aFNsb3QiLCJnZXRBdHRhY2htZW50IiwiUmVnaW9uQXR0YWNobWVudCIsIk1lc2hBdHRhY2htZW50IiwiQ2xpcHBpbmdBdHRhY2htZW50IiwiY2xpcFN0YXJ0IiwicmVnaW9uIiwidGV4dHVyZSIsIl90ZXh0dXJlIiwiZ2V0SGFzaCIsIl9mbHVzaCIsIm5vZGUiLCJjb21wdXRlV29ybGRWZXJ0aWNlcyIsImJvbmUiLCJfd3JpdGVWZXJ0ZXgyVG9WZXJ0ZXgzQnVmZmVyIiwic3Ryb2tlQ29sb3IiLCJtb3ZlVG8iLCJpaSIsIm5uIiwibGluZVRvIiwiY2xvc2UiLCJzdHJva2UiLCJ3b3JsZFZlcnRpY2VzTGVuZ3RoIiwidjEiLCJ2MiIsInYzIiwidSIsIm0iLCJhZGp1c3QiLCJjbGlwRW5kIiwiZmlsbENvbG9yIiwiaSIsImJvbmVzIiwid29ybGRYIiwiYyIsIndvcmxkWSIsImNpcmNsZSIsIk1hdGgiLCJQSSIsImZpbGwiLCJ2ZXJ0ZXgyQXJyYXkiLCJ2ZXJ0ZXgzQnVmZmVyIiwidmVydGV4Q291bnQiLCJkc3RPZmZzZXQiLCJzcmNPZmZzZXQiLCJjYWNoZVRyYXZlcnNlIiwiZnJhbWUiLCJfY3VyRnJhbWUiLCJzZWdtZW50cyIsIm9mZnNldHMiLCJ1aW50YnVmIiwidmVydGljZXMiLCJpbmRpY2VzIiwiZnJhbWVWRk9mZnNldCIsImZyYW1lSW5kZXhPZmZzZXQiLCJzZWdWRkNvdW50IiwianVzdFRyYW5zbGF0ZSIsIm5lZWRCYXRjaCIsImNhbGNUcmFuc2xhdGUiLCJjb2xvck9mZnNldCIsImNvbG9ycyIsIm5vd0NvbG9yIiwibWF4VkZPZmZzZXQiLCJ2Zk9mZnNldCIsInNlZ0luZm8iLCJpbmRleENvdW50IiwiaWwiLCJ2ZkNvdW50IiwicmVuZGVyVmVydGV4Q291bnQiLCJqIiwibGVuIiwiZnJhbWVDb2xvck9mZnNldCIsImZpbGxCdWZmZXJzIiwicmVuZGVyZXIiLCJfcmVuZGVyRmxhZyIsIkZMQUdfVVBEQVRFX1JFTkRFUl9EQVRBIiwibm9kZUNvbG9yIiwiX2NvbG9yIiwidXNlVGludCIsImdldEJ1ZmZlciIsImRlcHRoIiwicHJlbXVsdGlwbGllZEFscGhhIiwiX2VmZmVjdERlbGVnYXRlIiwiX3ZhbCIsIl93b3JsZE1hdHJpeCIsImJlZ2luIiwiZW5kIiwid29ybGRNYXREaXJ0eSIsImF0dGFjaFV0aWwiLCJfc3luY0F0dGFjaGVkTm9kZSIsInBvc3RGaWxsQnVmZmVycyIsIkFzc2VtYmxlciIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOzs7Ozs7OztBQUVBLElBQU1BLFFBQVEsR0FBR0MsT0FBTyxDQUFDLFlBQUQsQ0FBeEI7O0FBQ0EsSUFBTUMsS0FBSyxHQUFHRCxPQUFPLENBQUMsYUFBRCxDQUFyQjs7QUFDQSxJQUFNRSxVQUFVLEdBQUdGLE9BQU8sQ0FBQyx5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RHVCLENBdUR4Qjs7O0FBQ0FiLElBQUFBLFFBQVEsQ0FBQ2MsYUFBVDs7QUFDQXJKLElBQUFBLElBQUksQ0FBQ3NKLFVBQUwsQ0FBZ0JDLGlCQUFoQixHQXpEd0IsQ0EyRHhCOzs7QUFDQWxOLElBQUFBLEtBQUssR0FBR3NILFNBQVI7QUFDQXhILElBQUFBLE9BQU8sR0FBR3dILFNBQVY7QUFDQXZILElBQUFBLFNBQVMsR0FBR3VILFNBQVo7QUFDQXpILElBQUFBLEtBQUssR0FBR3lILFNBQVI7QUFDQXBILElBQUFBLGFBQWEsR0FBRyxJQUFoQjtBQUNIOztTQUVEaU4sa0JBQUEseUJBQWdCeEosSUFBaEIsRUFBc0J1SSxRQUF0QixFQUFnQztBQUM1QkEsSUFBQUEsUUFBUSxDQUFDYyxhQUFUO0FBQ0g7OztFQXJrQnVDSTs7OztBQXdrQjVDQSxzQkFBVUMsUUFBVixDQUFtQm5TLFFBQW5CLEVBQTZCa0ksY0FBN0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgQXNzZW1ibGVyIGZyb20gJy4uLy4uL2NvY29zMmQvY29yZS9yZW5kZXJlci9hc3NlbWJsZXInO1xuXG5jb25zdCBTa2VsZXRvbiA9IHJlcXVpcmUoJy4vU2tlbGV0b24nKTtcbmNvbnN0IHNwaW5lID0gcmVxdWlyZSgnLi9saWIvc3BpbmUnKTtcbmNvbnN0IFJlbmRlckZsb3cgPSByZXF1aXJlKCcuLi8uLi9jb2NvczJkL2NvcmUvcmVuZGVyZXIvcmVuZGVyLWZsb3cnKTtcbmNvbnN0IFZlcnRleEZvcm1hdCA9IHJlcXVpcmUoJy4uLy4uL2NvY29zMmQvY29yZS9yZW5kZXJlci93ZWJnbC92ZXJ0ZXgtZm9ybWF0JylcbmNvbnN0IFZGT25lQ29sb3IgPSBWZXJ0ZXhGb3JtYXQudmZtdDNEO1xuY29uc3QgVkZUd29Db2xvciA9IFZlcnRleEZvcm1hdC52Zm10UG9zM1V2VHdvQ29sb3I7XG5jb25zdCBnZnggPSBjYy5nZng7XG5cbmNvbnN0IEZMQUdfQkFUQ0ggPSAweDEwO1xuY29uc3QgRkxBR19UV09fQ09MT1IgPSAweDAxO1xuXG5sZXQgX2hhbmRsZVZhbCA9IDB4MDA7XG5sZXQgX3F1YWRUcmlhbmdsZXMgPSBbMCwgMSwgMiwgMiwgMywgMF07XG5sZXQgX3Nsb3RDb2xvciA9IGNjLmNvbG9yKDAsIDAsIDI1NSwgMjU1KTtcbmxldCBfYm9uZUNvbG9yID0gY2MuY29sb3IoMjU1LCAwLCAwLCAyNTUpO1xubGV0IF9vcmlnaW5Db2xvciA9IGNjLmNvbG9yKDAsIDI1NSwgMCwgMjU1KTtcbmxldCBfbWVzaENvbG9yID0gY2MuY29sb3IoMjU1LCAyNTUsIDAsIDI1NSk7XG5cbmxldCBfZmluYWxDb2xvciA9IG51bGw7XG5sZXQgX2RhcmtDb2xvciA9IG51bGw7XG5sZXQgX3RlbXBQb3MgPSBudWxsLCBfdGVtcFV2ID0gbnVsbDtcbmlmICghQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICBfZmluYWxDb2xvciA9IG5ldyBzcGluZS5Db2xvcigxLCAxLCAxLCAxKTtcbiAgICBfZGFya0NvbG9yID0gbmV3IHNwaW5lLkNvbG9yKDEsIDEsIDEsIDEpO1xuICAgIF90ZW1wUG9zID0gbmV3IHNwaW5lLlZlY3RvcjIoKTtcbiAgICBfdGVtcFV2ID0gbmV3IHNwaW5lLlZlY3RvcjIoKTtcbn1cblxubGV0IF9wcmVtdWx0aXBsaWVkQWxwaGE7XG5sZXQgX211bHRpcGxpZXI7XG5sZXQgX3Nsb3RSYW5nZVN0YXJ0O1xubGV0IF9zbG90UmFuZ2VFbmQ7XG5sZXQgX3VzZVRpbnQ7XG5sZXQgX2RlYnVnU2xvdHM7XG5sZXQgX2RlYnVnQm9uZXM7XG5sZXQgX2RlYnVnTWVzaDtcbmxldCBfbm9kZVIsXG4gICAgX25vZGVHLFxuICAgIF9ub2RlQixcbiAgICBfbm9kZUE7XG5sZXQgX2ZpbmFsQ29sb3IzMiwgX2RhcmtDb2xvcjMyO1xubGV0IF92ZXJ0ZXhGb3JtYXQ7XG5sZXQgX3BlclZlcnRleFNpemU7XG5sZXQgX3BlckNsaXBWZXJ0ZXhTaXplO1xuXG4vKiog5b2T5YmNc2xvdOeahOmhtueCuea1rueCueaVsOiuoeaVsCAqL1xubGV0IF92ZXJ0ZXhGbG9hdENvdW50ID0gMDtcbmxldCBfdmVydGV4Q291bnQgPSAwO1xubGV0IF92ZXJ0ZXhGbG9hdE9mZnNldCA9IDA7XG4vKiog5q2k5pe255qE6aG254K55ZyodmJv55qE5YGP56e7ICovXG5sZXQgX3ZlcnRleE9mZnNldCA9IDA7XG4vKiog5b2T5YmNc2xvdOeahOmhtueCuee0ouW8leiuoeaVsCAqL1xubGV0IF9pbmRleENvdW50ID0gMDtcbi8qKiDmraTml7bnmoTpobbngrnlnKhpYm/nmoTlgY/np7sgKi9cbmxldCBfaW5kZXhPZmZzZXQgPSAwO1xubGV0IF92Zk9mZnNldCA9IDA7XG5cbmxldCBfdGVtcHIsIF90ZW1wZywgX3RlbXBiO1xubGV0IF9pblJhbmdlO1xubGV0IF9tdXN0Rmx1c2g7XG5sZXQgX3gsIF95LCBfbTAwLCBfbTA0LCBfbTEyLCBfbTAxLCBfbTA1LCBfbTEzO1xubGV0IF9yLCBfZywgX2IsIF9mciwgX2ZnLCBfZmIsIF9mYSwgX2RyLCBfZGcsIF9kYiwgX2RhO1xubGV0IF9jb21wLCBfYnVmZmVyLCBfcmVuZGVyZXIsIF9ub2RlLCBfbmVlZENvbG9yLCBfdmVydGV4RWZmZWN0O1xubGV0IF9kZXB0aDtcbmxldCBfcmVhbHRpbWVWZXJ0aWNlcyA9IFtdO1xuLyoqIOWunuaXtua4suafk+eahOmhtueCueWkp+WwjyjlrZfoioIp77yM6K+75Y+Wc2tlbGV0b27ml7bnlKggKi9cbmxldCBfcmVhbHRpbWVTaXplUGVyVmVydGV4ID0gMDtcblxubGV0IERFUFRIX1JBVEUgPSA1ZS00O1xuXG5mdW5jdGlvbiBfZ2V0U2xvdE1hdGVyaWFsKHRleCwgYmxlbmRNb2RlKSB7XG4gICAgbGV0IHNyYywgZHN0O1xuICAgIHN3aXRjaCAoYmxlbmRNb2RlKSB7XG4gICAgICAgIGNhc2Ugc3BpbmUuQmxlbmRNb2RlLkFkZGl0aXZlOlxuICAgICAgICAgICAgc3JjID0gX3ByZW11bHRpcGxpZWRBbHBoYSA/IGNjLm1hY3JvLk9ORSA6IGNjLm1hY3JvLlNSQ19BTFBIQTtcbiAgICAgICAgICAgIGRzdCA9IGNjLm1hY3JvLk9ORTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHNwaW5lLkJsZW5kTW9kZS5NdWx0aXBseTpcbiAgICAgICAgICAgIHNyYyA9IGNjLm1hY3JvLkRTVF9DT0xPUjtcbiAgICAgICAgICAgIGRzdCA9IGNjLm1hY3JvLk9ORV9NSU5VU19TUkNfQUxQSEE7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBzcGluZS5CbGVuZE1vZGUuU2NyZWVuOlxuICAgICAgICAgICAgc3JjID0gY2MubWFjcm8uT05FO1xuICAgICAgICAgICAgZHN0ID0gY2MubWFjcm8uT05FX01JTlVTX1NSQ19DT0xPUjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHNwaW5lLkJsZW5kTW9kZS5Ob3JtYWw6XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBzcmMgPSBfcHJlbXVsdGlwbGllZEFscGhhID8gY2MubWFjcm8uT05FIDogY2MubWFjcm8uU1JDX0FMUEhBO1xuICAgICAgICAgICAgZHN0ID0gY2MubWFjcm8uT05FX01JTlVTX1NSQ19BTFBIQTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGxldCB1c2VNb2RlbCA9ICFfY29tcC5lbmFibGVCYXRjaDtcbiAgICBsZXQgYmFzZU1hdGVyaWFsID0gX2NvbXAuX21hdGVyaWFsc1swXTtcbiAgICBpZiAoIWJhc2VNYXRlcmlhbCkgcmV0dXJuIG51bGw7XG5cbiAgICAvLyBUaGUga2V5IHVzZSB0byBmaW5kIGNvcnJlc3BvbmRpbmcgbWF0ZXJpYWxcbiAgICBsZXQga2V5ID0gdGV4LmdldElkKCkgKyBzcmMgKyBkc3QgKyBfdXNlVGludCArIHVzZU1vZGVsO1xuICAgIGxldCBtYXRlcmlhbENhY2hlID0gX2NvbXAuX21hdGVyaWFsQ2FjaGU7XG4gICAgbGV0IG1hdGVyaWFsID0gbWF0ZXJpYWxDYWNoZVtrZXldO1xuICAgIGlmICghbWF0ZXJpYWwpIHtcbiAgICAgICAgaWYgKCFtYXRlcmlhbENhY2hlLmJhc2VNYXRlcmlhbCkge1xuICAgICAgICAgICAgbWF0ZXJpYWwgPSBiYXNlTWF0ZXJpYWw7XG4gICAgICAgICAgICBtYXRlcmlhbENhY2hlLmJhc2VNYXRlcmlhbCA9IGJhc2VNYXRlcmlhbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1hdGVyaWFsID0gY2MuTWF0ZXJpYWxWYXJpYW50LmNyZWF0ZShiYXNlTWF0ZXJpYWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgbWF0ZXJpYWwuZGVmaW5lKCdDQ19VU0VfTU9ERUwnLCB1c2VNb2RlbCk7XG4gICAgICAgIG1hdGVyaWFsLmRlZmluZSgnVVNFX1RJTlQnLCBfdXNlVGludCk7XG4gICAgICAgIC8vIHVwZGF0ZSB0ZXh0dXJlXG4gICAgICAgIG1hdGVyaWFsLnNldFByb3BlcnR5KCd0ZXh0dXJlJywgdGV4KTtcblxuICAgICAgICAvLyB1cGRhdGUgYmxlbmQgZnVuY3Rpb25cbiAgICAgICAgbWF0ZXJpYWwuc2V0QmxlbmQoXG4gICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgZ2Z4LkJMRU5EX0ZVTkNfQURELFxuICAgICAgICAgICAgc3JjLCBkc3QsXG4gICAgICAgICAgICBnZnguQkxFTkRfRlVOQ19BREQsXG4gICAgICAgICAgICBzcmMsIGRzdFxuICAgICAgICApO1xuICAgICAgICBtYXRlcmlhbENhY2hlW2tleV0gPSBtYXRlcmlhbDtcbiAgICB9XG4gICAgcmV0dXJuIG1hdGVyaWFsO1xufVxuXG5mdW5jdGlvbiBfaGFuZGxlQ29sb3IoY29sb3IpIHtcbiAgICAvLyB0ZW1wIHJnYiBoYXMgbXVsdGlwbHkgMjU1LCBzbyBuZWVkIGRpdmlkZSAyNTU7XG4gICAgX2ZhID0gY29sb3IuZmEgKiBfbm9kZUE7XG4gICAgX211bHRpcGxpZXIgPSBfcHJlbXVsdGlwbGllZEFscGhhID8gX2ZhIC8gMjU1IDogMTtcbiAgICBfciA9IF9ub2RlUiAqIF9tdWx0aXBsaWVyO1xuICAgIF9nID0gX25vZGVHICogX211bHRpcGxpZXI7XG4gICAgX2IgPSBfbm9kZUIgKiBfbXVsdGlwbGllcjtcblxuICAgIF9mciA9IGNvbG9yLmZyICogX3I7XG4gICAgX2ZnID0gY29sb3IuZmcgKiBfZztcbiAgICBfZmIgPSBjb2xvci5mYiAqIF9iO1xuICAgIF9maW5hbENvbG9yMzIgPSAoKF9mYSA8PCAyNCkgPj4+IDApICsgKF9mYiA8PCAxNikgKyAoX2ZnIDw8IDgpICsgX2ZyO1xuXG4gICAgX2RyID0gY29sb3IuZHIgKiBfcjtcbiAgICBfZGcgPSBjb2xvci5kZyAqIF9nO1xuICAgIF9kYiA9IGNvbG9yLmRiICogX2I7XG4gICAgX2RhID0gX3ByZW11bHRpcGxpZWRBbHBoYSA/IDI1NSA6IDA7XG4gICAgX2RhcmtDb2xvcjMyID0gKChfZGEgPDwgMjQpID4+PiAwKSArIChfZGIgPDwgMTYpICsgKF9kZyA8PCA4KSArIF9kcjtcbn1cblxuZnVuY3Rpb24gX3NwaW5lQ29sb3JUb0ludDMyKHNwaW5lQ29sb3IpIHtcbiAgICByZXR1cm4gKChzcGluZUNvbG9yLmEgPDwgMjQpID4+PiAwKSArIChzcGluZUNvbG9yLmIgPDwgMTYpICsgKHNwaW5lQ29sb3IuZyA8PCA4KSArIHNwaW5lQ29sb3Iucjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3BpbmVBc3NlbWJsZXIgZXh0ZW5kcyBBc3NlbWJsZXIge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGlmIChjYy5zeXMub3MgIT0gY2Muc3lzLk9TX0FORFJPSUQpIHtcbiAgICAgICAgICAgIERFUFRIX1JBVEUgPSAxZS02O1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKCdhc3NlbWJsZXInLCBERVBUSF9SQVRFLCBjYy5zeXMub3MpO1xuICAgIH1cbiAgICB1cGRhdGVSZW5kZXJEYXRhKGNvbXApIHtcbiAgICAgICAgaWYgKGNvbXAuaXNBbmltYXRpb25DYWNoZWQoKSkgcmV0dXJuO1xuICAgICAgICBsZXQgc2tlbGV0b24gPSBjb21wLl9za2VsZXRvbjtcbiAgICAgICAgaWYgKHNrZWxldG9uKSB7XG4gICAgICAgICAgICBza2VsZXRvbi51cGRhdGVXb3JsZFRyYW5zZm9ybSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmlsbFZlcnRpY2VzKHNrZWxldG9uQ29sb3IsIGF0dGFjaG1lbnRDb2xvciwgc2xvdENvbG9yLCBjbGlwcGVyLCBzbG90LCBzbG90SWR4KSB7XG5cbiAgICAgICAgbGV0IHZidWYgPSBfYnVmZmVyLl92RGF0YSxcbiAgICAgICAgICAgIGlidWYgPSBfYnVmZmVyLl9pRGF0YSxcbiAgICAgICAgICAgIHVpbnRWRGF0YSA9IF9idWZmZXIuX3VpbnRWRGF0YTtcbiAgICAgICAgbGV0IG9mZnNldEluZm87XG5cbiAgICAgICAgX2ZpbmFsQ29sb3IuYSA9IHNsb3RDb2xvci5hICogYXR0YWNobWVudENvbG9yLmEgKiBza2VsZXRvbkNvbG9yLmEgKiBfbm9kZUEgKiAyNTU7XG4gICAgICAgIF9tdWx0aXBsaWVyID0gX3ByZW11bHRpcGxpZWRBbHBoYSA/IF9maW5hbENvbG9yLmEgOiAyNTU7XG4gICAgICAgIF90ZW1wciA9IF9ub2RlUiAqIGF0dGFjaG1lbnRDb2xvci5yICogc2tlbGV0b25Db2xvci5yICogX211bHRpcGxpZXI7XG4gICAgICAgIF90ZW1wZyA9IF9ub2RlRyAqIGF0dGFjaG1lbnRDb2xvci5nICogc2tlbGV0b25Db2xvci5nICogX211bHRpcGxpZXI7XG4gICAgICAgIF90ZW1wYiA9IF9ub2RlQiAqIGF0dGFjaG1lbnRDb2xvci5iICogc2tlbGV0b25Db2xvci5iICogX211bHRpcGxpZXI7XG5cbiAgICAgICAgX2ZpbmFsQ29sb3IuciA9IF90ZW1wciAqIHNsb3RDb2xvci5yO1xuICAgICAgICBfZmluYWxDb2xvci5nID0gX3RlbXBnICogc2xvdENvbG9yLmc7XG4gICAgICAgIF9maW5hbENvbG9yLmIgPSBfdGVtcGIgKiBzbG90Q29sb3IuYjtcblxuICAgICAgICBpZiAoc2xvdC5kYXJrQ29sb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgX2RhcmtDb2xvci5zZXQoMC4wLCAwLjAsIDAuMCwgMS4wKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9kYXJrQ29sb3IuciA9IHNsb3QuZGFya0NvbG9yLnIgKiBfdGVtcHI7XG4gICAgICAgICAgICBfZGFya0NvbG9yLmcgPSBzbG90LmRhcmtDb2xvci5nICogX3RlbXBnO1xuICAgICAgICAgICAgX2RhcmtDb2xvci5iID0gc2xvdC5kYXJrQ29sb3IuYiAqIF90ZW1wYjtcbiAgICAgICAgfVxuICAgICAgICBfZGFya0NvbG9yLmEgPSBfcHJlbXVsdGlwbGllZEFscGhhID8gMjU1IDogMDtcblxuICAgICAgICBpZiAoLyoqIWNsaXBwZXIuaXNDbGlwcGluZygpKi90cnVlKSB7XG4gICAgICAgICAgICBpZiAoX3ZlcnRleEVmZmVjdCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHYgPSBfdmVydGV4RmxvYXRPZmZzZXQsIG4gPSBfdmVydGV4RmxvYXRPZmZzZXQgKyBfdmVydGV4RmxvYXRDb3VudDsgdiA8IG47IHYgKz0gX3BlclZlcnRleFNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RlbXBQb3MueCA9IHZidWZbdl07XG4gICAgICAgICAgICAgICAgICAgIF90ZW1wUG9zLnkgPSB2YnVmW3YgKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgX3RlbXBVdi54ID0gdmJ1Zlt2ICsgM107XG4gICAgICAgICAgICAgICAgICAgIF90ZW1wVXYueSA9IHZidWZbdiArIDRdO1xuICAgICAgICAgICAgICAgICAgICBfdmVydGV4RWZmZWN0LnRyYW5zZm9ybShfdGVtcFBvcywgX3RlbXBVdiwgX2ZpbmFsQ29sb3IsIF9kYXJrQ29sb3IpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZidWZbdl0gPSBfdGVtcFBvcy54OyAgICAgICAgLy8geFxuICAgICAgICAgICAgICAgICAgICB2YnVmW3YgKyAxXSA9IF90ZW1wUG9zLnk7ICAgICAgICAvLyB5XG4gICAgICAgICAgICAgICAgICAgIHZidWZbdiArIDNdID0gX3RlbXBVdi54OyAgICAgICAgIC8vIHVcbiAgICAgICAgICAgICAgICAgICAgdmJ1Zlt2ICsgNF0gPSBfdGVtcFV2Lnk7ICAgICAgICAgLy8gdlxuICAgICAgICAgICAgICAgICAgICB1aW50VkRhdGFbdiArIDVdID0gX3NwaW5lQ29sb3JUb0ludDMyKF9maW5hbENvbG9yKTsgICAgICAgICAgICAgICAgICAvLyBsaWdodCBjb2xvclxuICAgICAgICAgICAgICAgICAgICBfdXNlVGludCAmJiAodWludFZEYXRhW3YgKyA2XSA9IF9zcGluZUNvbG9yVG9JbnQzMihfZGFya0NvbG9yKSk7ICAgICAgLy8gZGFyayBjb2xvclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX2ZpbmFsQ29sb3IzMiA9IF9zcGluZUNvbG9yVG9JbnQzMihfZmluYWxDb2xvcik7XG4gICAgICAgICAgICAgICAgX2RhcmtDb2xvcjMyID0gX3NwaW5lQ29sb3JUb0ludDMyKF9kYXJrQ29sb3IpO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdiA9IF92ZXJ0ZXhGbG9hdE9mZnNldCwgbiA9IF92ZXJ0ZXhGbG9hdE9mZnNldCArIF92ZXJ0ZXhGbG9hdENvdW50OyB2IDwgbjsgdiArPSBfcGVyVmVydGV4U2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICB1aW50VkRhdGFbdiArIDVdID0gX2ZpbmFsQ29sb3IzMjsgICAgICAgICAgICAgICAgICAgLy8gbGlnaHQgY29sb3JcbiAgICAgICAgICAgICAgICAgICAgX3VzZVRpbnQgJiYgKHVpbnRWRGF0YVt2ICsgNl0gPSBfZGFya0NvbG9yMzIpOyAgICAgIC8vIGRhcmsgY29sb3JcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgdXZzID0gdmJ1Zi5zdWJhcnJheShfdmVydGV4RmxvYXRPZmZzZXQgKyAzKTtcbiAgICAgICAgICAgIGNsaXBwZXIuY2xpcFRyaWFuZ2xlcyh2YnVmLnN1YmFycmF5KF92ZXJ0ZXhGbG9hdE9mZnNldCksIF92ZXJ0ZXhGbG9hdENvdW50LCBpYnVmLnN1YmFycmF5KF9pbmRleE9mZnNldCksIF9pbmRleENvdW50LCB1dnMsIF9maW5hbENvbG9yLCBfZGFya0NvbG9yLCBfdXNlVGludCwgX3BlclZlcnRleFNpemUpO1xuICAgICAgICAgICAgbGV0IGNsaXBwZWRWZXJ0aWNlcyA9IG5ldyBGbG9hdDMyQXJyYXkoY2xpcHBlci5jbGlwcGVkVmVydGljZXMpO1xuICAgICAgICAgICAgbGV0IGNsaXBwZWRUcmlhbmdsZXMgPSBjbGlwcGVyLmNsaXBwZWRUcmlhbmdsZXM7XG5cbiAgICAgICAgICAgIC8vIGluc3VyZSBjYXBhY2l0eVxuICAgICAgICAgICAgX2luZGV4Q291bnQgPSBjbGlwcGVkVHJpYW5nbGVzLmxlbmd0aDtcbiAgICAgICAgICAgIF92ZXJ0ZXhGbG9hdENvdW50ID0gY2xpcHBlZFZlcnRpY2VzLmxlbmd0aCAvIF9wZXJDbGlwVmVydGV4U2l6ZSAqIF9wZXJWZXJ0ZXhTaXplO1xuXG4gICAgICAgICAgICBvZmZzZXRJbmZvID0gX2J1ZmZlci5yZXF1ZXN0KF92ZXJ0ZXhGbG9hdENvdW50IC8gX3BlclZlcnRleFNpemUsIF9pbmRleENvdW50KTtcbiAgICAgICAgICAgIF9pbmRleE9mZnNldCA9IG9mZnNldEluZm8uaW5kaWNlT2Zmc2V0LFxuICAgICAgICAgICAgICAgIF92ZXJ0ZXhPZmZzZXQgPSBvZmZzZXRJbmZvLnZlcnRleE9mZnNldCxcbiAgICAgICAgICAgICAgICBfdmVydGV4RmxvYXRPZmZzZXQgPSBvZmZzZXRJbmZvLmJ5dGVPZmZzZXQgPj4gMjtcbiAgICAgICAgICAgIHZidWYgPSBfYnVmZmVyLl92RGF0YSxcbiAgICAgICAgICAgICAgICBpYnVmID0gX2J1ZmZlci5faURhdGE7XG4gICAgICAgICAgICB1aW50VkRhdGEgPSBfYnVmZmVyLl91aW50VkRhdGE7XG5cbiAgICAgICAgICAgIC8vIGZpbGwgaW5kaWNlc1xuICAgICAgICAgICAgaWJ1Zi5zZXQoY2xpcHBlZFRyaWFuZ2xlcywgX2luZGV4T2Zmc2V0KTtcblxuICAgICAgICAgICAgLy8gZmlsbCB2ZXJ0aWNlcyBjb250YWluIHggeSB1IHYgbGlnaHQgY29sb3IgZGFyayBjb2xvclxuICAgICAgICAgICAgaWYgKF92ZXJ0ZXhFZmZlY3QpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB2ID0gMCwgbiA9IGNsaXBwZWRWZXJ0aWNlcy5sZW5ndGgsIG9mZnNldCA9IF92ZXJ0ZXhGbG9hdE9mZnNldDsgdiA8IG47IHYgKz0gX3BlckNsaXBWZXJ0ZXhTaXplLCBvZmZzZXQgKz0gX3BlclZlcnRleFNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RlbXBQb3MueCA9IGNsaXBwZWRWZXJ0aWNlc1t2XTtcbiAgICAgICAgICAgICAgICAgICAgX3RlbXBQb3MueSA9IGNsaXBwZWRWZXJ0aWNlc1t2ICsgMV07XG4gICAgICAgICAgICAgICAgICAgIF9maW5hbENvbG9yLnNldChjbGlwcGVkVmVydGljZXNbdiArIDJdLCBjbGlwcGVkVmVydGljZXNbdiArIDNdLCBjbGlwcGVkVmVydGljZXNbdiArIDRdLCBjbGlwcGVkVmVydGljZXNbdiArIDVdKTtcbiAgICAgICAgICAgICAgICAgICAgX3RlbXBVdi54ID0gY2xpcHBlZFZlcnRpY2VzW3YgKyA2XTtcbiAgICAgICAgICAgICAgICAgICAgX3RlbXBVdi55ID0gY2xpcHBlZFZlcnRpY2VzW3YgKyA3XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF91c2VUaW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfZGFya0NvbG9yLnNldChjbGlwcGVkVmVydGljZXNbdiArIDhdLCBjbGlwcGVkVmVydGljZXNbdiArIDldLCBjbGlwcGVkVmVydGljZXNbdiArIDEwXSwgY2xpcHBlZFZlcnRpY2VzW3YgKyAxMV0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2RhcmtDb2xvci5zZXQoMCwgMCwgMCwgMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgX3ZlcnRleEVmZmVjdC50cmFuc2Zvcm0oX3RlbXBQb3MsIF90ZW1wVXYsIF9maW5hbENvbG9yLCBfZGFya0NvbG9yKTtcblxuICAgICAgICAgICAgICAgICAgICB2YnVmW29mZnNldF0gPSBfdGVtcFBvcy54OyAgICAgICAgICAgICAvLyB4XG4gICAgICAgICAgICAgICAgICAgIHZidWZbb2Zmc2V0ICsgMV0gPSBfdGVtcFBvcy55OyAgICAgICAgIC8vIHlcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltvZmZzZXQgKyAyXSA9IF90ZW1wVXYueDsgICAgICAgICAgLy8gdVxuICAgICAgICAgICAgICAgICAgICB2YnVmW29mZnNldCArIDNdID0gX3RlbXBVdi55OyAgICAgICAgICAvLyB2XG4gICAgICAgICAgICAgICAgICAgIHVpbnRWRGF0YVtvZmZzZXQgKyA0XSA9IF9zcGluZUNvbG9yVG9JbnQzMihfZmluYWxDb2xvcik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfdXNlVGludCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdWludFZEYXRhW29mZnNldCArIDVdID0gX3NwaW5lQ29sb3JUb0ludDMyKF9kYXJrQ29sb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB2ID0gMCwgbiA9IGNsaXBwZWRWZXJ0aWNlcy5sZW5ndGgsIG9mZnNldCA9IF92ZXJ0ZXhGbG9hdE9mZnNldDsgdiA8IG47IHYgKz0gX3BlckNsaXBWZXJ0ZXhTaXplLCBvZmZzZXQgKz0gX3BlclZlcnRleFNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltvZmZzZXRdID0gY2xpcHBlZFZlcnRpY2VzW3ZdOyAgICAgICAgIC8vIHhcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltvZmZzZXQgKyAxXSA9IGNsaXBwZWRWZXJ0aWNlc1t2ICsgMV07ICAgICAvLyB5XG4gICAgICAgICAgICAgICAgICAgIHZidWZbb2Zmc2V0ICsgMl0gPSBjbGlwcGVkVmVydGljZXNbdiArIDZdOyAgICAgLy8gdVxuICAgICAgICAgICAgICAgICAgICB2YnVmW29mZnNldCArIDNdID0gY2xpcHBlZFZlcnRpY2VzW3YgKyA3XTsgICAgIC8vIHZcblxuICAgICAgICAgICAgICAgICAgICBfZmluYWxDb2xvcjMyID0gKChjbGlwcGVkVmVydGljZXNbdiArIDVdIDw8IDI0KSA+Pj4gMCkgKyAoY2xpcHBlZFZlcnRpY2VzW3YgKyA0XSA8PCAxNikgKyAoY2xpcHBlZFZlcnRpY2VzW3YgKyAzXSA8PCA4KSArIGNsaXBwZWRWZXJ0aWNlc1t2ICsgMl07XG4gICAgICAgICAgICAgICAgICAgIHVpbnRWRGF0YVtvZmZzZXQgKyA0XSA9IF9maW5hbENvbG9yMzI7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKF91c2VUaW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfZGFya0NvbG9yMzIgPSAoKGNsaXBwZWRWZXJ0aWNlc1t2ICsgMTFdIDw8IDI0KSA+Pj4gMCkgKyAoY2xpcHBlZFZlcnRpY2VzW3YgKyAxMF0gPDwgMTYpICsgKGNsaXBwZWRWZXJ0aWNlc1t2ICsgOV0gPDwgOCkgKyBjbGlwcGVkVmVydGljZXNbdiArIDhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdWludFZEYXRhW29mZnNldCArIDVdID0gX2RhcmtDb2xvcjMyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVhbFRpbWVUcmF2ZXJzZSh3b3JsZE1hdCkge1xuICAgICAgICBsZXQgdmJ1ZjtcbiAgICAgICAgbGV0IGlidWY7XG5cbiAgICAgICAgbGV0IGxvY1NrZWxldG9uID0gX2NvbXAuX3NrZWxldG9uO1xuICAgICAgICBsZXQgc2tlbGV0b25Db2xvciA9IGxvY1NrZWxldG9uLmNvbG9yO1xuICAgICAgICBsZXQgZ3JhcGhpY3MgPSBfY29tcC5fZGVidWdSZW5kZXJlcjtcbiAgICAgICAgbGV0IGNsaXBwZXIgPSBfY29tcC5fY2xpcHBlcjtcbiAgICAgICAgbGV0IG1hdGVyaWFsID0gbnVsbDtcbiAgICAgICAgbGV0IGF0dGFjaG1lbnQsIGF0dGFjaG1lbnRDb2xvciwgc2xvdENvbG9yLCB1dnMsIHRyaWFuZ2xlcztcbiAgICAgICAgbGV0IGlzUmVnaW9uLCBpc01lc2gsIGlzQ2xpcDtcbiAgICAgICAgbGV0IG9mZnNldEluZm87XG4gICAgICAgIGxldCBzbG90O1xuICAgICAgICBsZXQgd29ybGRNYXRtO1xuXG4gICAgICAgIF9zbG90UmFuZ2VTdGFydCA9IF9jb21wLl9zdGFydFNsb3RJbmRleDtcbiAgICAgICAgX3Nsb3RSYW5nZUVuZCA9IF9jb21wLl9lbmRTbG90SW5kZXg7XG4gICAgICAgIF9pblJhbmdlID0gZmFsc2U7XG4gICAgICAgIGlmIChfc2xvdFJhbmdlU3RhcnQgPT0gLTEpIF9pblJhbmdlID0gdHJ1ZTtcblxuICAgICAgICBfZGVidWdTbG90cyA9IF9jb21wLmRlYnVnU2xvdHM7XG4gICAgICAgIF9kZWJ1Z0JvbmVzID0gX2NvbXAuZGVidWdCb25lcztcbiAgICAgICAgX2RlYnVnTWVzaCA9IF9jb21wLmRlYnVnTWVzaDtcbiAgICAgICAgaWYgKGdyYXBoaWNzICYmIChfZGVidWdCb25lcyB8fCBfZGVidWdTbG90cyB8fCBfZGVidWdNZXNoKSkge1xuICAgICAgICAgICAgZ3JhcGhpY3MuY2xlYXIoKTtcbiAgICAgICAgICAgIGdyYXBoaWNzLmxpbmVXaWR0aCA9IDI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB4IHkgdSB2IHIxIGcxIGIxIGExIHIyIGcyIGIyIGEyIG9yIHggeSB1IHYgciBnIGIgYSBcbiAgICAgICAgX3BlckNsaXBWZXJ0ZXhTaXplID0gX3VzZVRpbnQgPyAxMiA6IDg7XG5cbiAgICAgICAgX3ZlcnRleEZsb2F0Q291bnQgPSAwO1xuICAgICAgICBfdmVydGV4RmxvYXRPZmZzZXQgPSAwO1xuICAgICAgICBfdmVydGV4T2Zmc2V0ID0gMDtcbiAgICAgICAgX2luZGV4Q291bnQgPSAwO1xuICAgICAgICBfaW5kZXhPZmZzZXQgPSAwO1xuICAgICAgICBfcmVhbHRpbWVWZXJ0aWNlcy5sZW5ndGggPSAwO1xuXG4gICAgICAgIGZvciAobGV0IHNsb3RJZHggPSAwLCBzbG90Q291bnQgPSBsb2NTa2VsZXRvbi5kcmF3T3JkZXIubGVuZ3RoOyBzbG90SWR4IDwgc2xvdENvdW50OyBzbG90SWR4KyspIHtcbiAgICAgICAgICAgIHNsb3QgPSBsb2NTa2VsZXRvbi5kcmF3T3JkZXJbc2xvdElkeF07XG5cbiAgICAgICAgICAgIGlmIChzbG90ID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX3Nsb3RSYW5nZVN0YXJ0ID49IDAgJiYgX3Nsb3RSYW5nZVN0YXJ0ID09IHNsb3QuZGF0YS5pbmRleCkge1xuICAgICAgICAgICAgICAgIF9pblJhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFfaW5SYW5nZSkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX3Nsb3RSYW5nZUVuZCA+PSAwICYmIF9zbG90UmFuZ2VFbmQgPT0gc2xvdC5kYXRhLmluZGV4KSB7XG4gICAgICAgICAgICAgICAgX2luUmFuZ2UgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX3ZlcnRleEZsb2F0Q291bnQgPSAwO1xuICAgICAgICAgICAgX2luZGV4Q291bnQgPSAwO1xuICAgICAgICAgICAgX3JlYWx0aW1lVmVydGljZXMubGVuZ3RoID0gMDtcblxuICAgICAgICAgICAgYXR0YWNobWVudCA9IHNsb3QuZ2V0QXR0YWNobWVudCgpO1xuICAgICAgICAgICAgaWYgKCFhdHRhY2htZW50KSB7XG4gICAgICAgICAgICAgICAgY2xpcHBlci5jbGlwRW5kV2l0aFNsb3Qoc2xvdCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlzUmVnaW9uID0gYXR0YWNobWVudCBpbnN0YW5jZW9mIHNwaW5lLlJlZ2lvbkF0dGFjaG1lbnQ7XG4gICAgICAgICAgICBpc01lc2ggPSBhdHRhY2htZW50IGluc3RhbmNlb2Ygc3BpbmUuTWVzaEF0dGFjaG1lbnQ7XG4gICAgICAgICAgICBpc0NsaXAgPSBhdHRhY2htZW50IGluc3RhbmNlb2Ygc3BpbmUuQ2xpcHBpbmdBdHRhY2htZW50O1xuXG4gICAgICAgICAgICBpZiAoaXNDbGlwKSB7XG4gICAgICAgICAgICAgICAgY2xpcHBlci5jbGlwU3RhcnQoc2xvdCwgYXR0YWNobWVudCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaXNSZWdpb24gJiYgIWlzTWVzaCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXRlcmlhbCA9IF9nZXRTbG90TWF0ZXJpYWwoYXR0YWNobWVudC5yZWdpb24udGV4dHVyZS5fdGV4dHVyZSwgc2xvdC5kYXRhLmJsZW5kTW9kZSk7XG4gICAgICAgICAgICBpZiAoIW1hdGVyaWFsKSB7XG4gICAgICAgICAgICAgICAgY2xpcHBlci5jbGlwRW5kV2l0aFNsb3Qoc2xvdCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfbXVzdEZsdXNoIHx8IG1hdGVyaWFsLmdldEhhc2goKSAhPT0gX3JlbmRlcmVyLm1hdGVyaWFsLmdldEhhc2goKSkge1xuICAgICAgICAgICAgICAgIF9tdXN0Rmx1c2ggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBfcmVuZGVyZXIuX2ZsdXNoKCk7XG4gICAgICAgICAgICAgICAgX3JlbmRlcmVyLm5vZGUgPSBfbm9kZTtcbiAgICAgICAgICAgICAgICBfcmVuZGVyZXIubWF0ZXJpYWwgPSBtYXRlcmlhbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlzUmVnaW9uKSB7XG5cbiAgICAgICAgICAgICAgICB0cmlhbmdsZXMgPSBfcXVhZFRyaWFuZ2xlcztcblxuICAgICAgICAgICAgICAgIC8vIGluc3VyZSBjYXBhY2l0eVxuICAgICAgICAgICAgICAgIF92ZXJ0ZXhGbG9hdENvdW50ID0gNCAqIF9wZXJWZXJ0ZXhTaXplO1xuICAgICAgICAgICAgICAgIF9pbmRleENvdW50ID0gNjtcblxuICAgICAgICAgICAgICAgIG9mZnNldEluZm8gPSBfYnVmZmVyLnJlcXVlc3QoNCwgNik7XG4gICAgICAgICAgICAgICAgX2luZGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby5pbmRpY2VPZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgIF92ZXJ0ZXhPZmZzZXQgPSBvZmZzZXRJbmZvLnZlcnRleE9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgX3ZlcnRleEZsb2F0T2Zmc2V0ID0gb2Zmc2V0SW5mby5ieXRlT2Zmc2V0ID4+IDI7XG4gICAgICAgICAgICAgICAgdmJ1ZiA9IF9idWZmZXIuX3ZEYXRhLFxuICAgICAgICAgICAgICAgICAgICBpYnVmID0gX2J1ZmZlci5faURhdGE7XG5cbiAgICAgICAgICAgICAgICAvLyBjb21wdXRlIHZlcnRleCBhbmQgZmlsbCB4IHlcbiAgICAgICAgICAgICAgICAvLyBhdHRhY2htZW50LmNvbXB1dGVXb3JsZFZlcnRpY2VzKHNsb3QuYm9uZSwgdmJ1ZiwgX3ZlcnRleEZsb2F0T2Zmc2V0LCBfcGVyVmVydGV4U2l6ZSk7XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudC5jb21wdXRlV29ybGRWZXJ0aWNlcyhzbG90LmJvbmUsIF9yZWFsdGltZVZlcnRpY2VzLCAwLCBfcmVhbHRpbWVTaXplUGVyVmVydGV4KTtcblxuICAgICAgICAgICAgICAgIC8v5bCG5q2kc2xvdOeahOmhtueCueWGmeWFpee8k+WtmOWMulxuICAgICAgICAgICAgICAgIHRoaXMuX3dyaXRlVmVydGV4MlRvVmVydGV4M0J1ZmZlcihfcmVhbHRpbWVWZXJ0aWNlcywgdmJ1ZiwgX3ZlcnRleEZsb2F0T2Zmc2V0LCA0LCBzbG90SWR4KTtcblxuICAgICAgICAgICAgICAgIC8vIGRyYXcgZGVidWcgc2xvdHMgaWYgZW5hYmxlZCBncmFwaGljc1xuICAgICAgICAgICAgICAgIGlmIChncmFwaGljcyAmJiBfZGVidWdTbG90cykge1xuICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5zdHJva2VDb2xvciA9IF9zbG90Q29sb3I7XG4gICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLm1vdmVUbyh2YnVmW192ZXJ0ZXhGbG9hdE9mZnNldF0sIHZidWZbX3ZlcnRleEZsb2F0T2Zmc2V0ICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpaSA9IF92ZXJ0ZXhGbG9hdE9mZnNldCArIF9wZXJWZXJ0ZXhTaXplLCBubiA9IF92ZXJ0ZXhGbG9hdE9mZnNldCArIF92ZXJ0ZXhGbG9hdENvdW50OyBpaSA8IG5uOyBpaSArPSBfcGVyVmVydGV4U2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MubGluZVRvKHZidWZbaWldLCB2YnVmW2lpICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLnN0cm9rZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzTWVzaCkge1xuXG4gICAgICAgICAgICAgICAgdHJpYW5nbGVzID0gYXR0YWNobWVudC50cmlhbmdsZXM7XG5cbiAgICAgICAgICAgICAgICAvLyBpbnN1cmUgY2FwYWNpdHlcbiAgICAgICAgICAgICAgICBfdmVydGV4RmxvYXRDb3VudCA9IChhdHRhY2htZW50LndvcmxkVmVydGljZXNMZW5ndGggPj4gMSkgKiBfcGVyVmVydGV4U2l6ZTtcbiAgICAgICAgICAgICAgICBfaW5kZXhDb3VudCA9IHRyaWFuZ2xlcy5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICBvZmZzZXRJbmZvID0gX2J1ZmZlci5yZXF1ZXN0KF92ZXJ0ZXhGbG9hdENvdW50IC8gX3BlclZlcnRleFNpemUsIF9pbmRleENvdW50KTtcbiAgICAgICAgICAgICAgICBfaW5kZXhPZmZzZXQgPSBvZmZzZXRJbmZvLmluZGljZU9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgX3ZlcnRleE9mZnNldCA9IG9mZnNldEluZm8udmVydGV4T2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICBfdmVydGV4RmxvYXRPZmZzZXQgPSBvZmZzZXRJbmZvLmJ5dGVPZmZzZXQgPj4gMjtcbiAgICAgICAgICAgICAgICB2YnVmID0gX2J1ZmZlci5fdkRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGlidWYgPSBfYnVmZmVyLl9pRGF0YTtcblxuICAgICAgICAgICAgICAgIC8vIGNvbXB1dGUgdmVydGV4IGFuZCBmaWxsIHggeVxuICAgICAgICAgICAgICAgIC8vIGF0dGFjaG1lbnQuY29tcHV0ZVdvcmxkVmVydGljZXMoc2xvdCwgMCwgYXR0YWNobWVudC53b3JsZFZlcnRpY2VzTGVuZ3RoLCB2YnVmLCBfdmVydGV4RmxvYXRPZmZzZXQsIF9wZXJWZXJ0ZXhTaXplKTtcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50LmNvbXB1dGVXb3JsZFZlcnRpY2VzKHNsb3QsIDAsIGF0dGFjaG1lbnQud29ybGRWZXJ0aWNlc0xlbmd0aCwgX3JlYWx0aW1lVmVydGljZXMsIDAsIF9yZWFsdGltZVNpemVQZXJWZXJ0ZXgpO1xuXG4gICAgICAgICAgICAgICAgLy/lsIbmraRzbG9055qE6aG254K55YaZ5YWl57yT5a2Y5Yy6XG4gICAgICAgICAgICAgICAgdGhpcy5fd3JpdGVWZXJ0ZXgyVG9WZXJ0ZXgzQnVmZmVyKF9yZWFsdGltZVZlcnRpY2VzLCB2YnVmLCBfdmVydGV4RmxvYXRPZmZzZXQsIF92ZXJ0ZXhGbG9hdENvdW50IC8gX3BlclZlcnRleFNpemUsIHNsb3RJZHgpO1xuXG4gICAgICAgICAgICAgICAgLy8gZHJhdyBkZWJ1ZyBtZXNoIGlmIGVuYWJsZWQgZ3JhcGhpY3NcbiAgICAgICAgICAgICAgICBpZiAoZ3JhcGhpY3MgJiYgX2RlYnVnTWVzaCkge1xuICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5zdHJva2VDb2xvciA9IF9tZXNoQ29sb3I7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaWkgPSAwLCBubiA9IHRyaWFuZ2xlcy5sZW5ndGg7IGlpIDwgbm47IGlpICs9IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2MSA9IHRyaWFuZ2xlc1tpaV0gKiBfcGVyVmVydGV4U2l6ZSArIF92ZXJ0ZXhGbG9hdE9mZnNldDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2MiA9IHRyaWFuZ2xlc1tpaSArIDFdICogX3BlclZlcnRleFNpemUgKyBfdmVydGV4RmxvYXRPZmZzZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdjMgPSB0cmlhbmdsZXNbaWkgKyAyXSAqIF9wZXJWZXJ0ZXhTaXplICsgX3ZlcnRleEZsb2F0T2Zmc2V0O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5tb3ZlVG8odmJ1Zlt2MV0sIHZidWZbdjEgKyAxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5saW5lVG8odmJ1Zlt2Ml0sIHZidWZbdjIgKyAxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5saW5lVG8odmJ1Zlt2M10sIHZidWZbdjMgKyAxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3Muc3Ryb2tlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfdmVydGV4RmxvYXRDb3VudCA9PSAwIHx8IF9pbmRleENvdW50ID09IDApIHtcbiAgICAgICAgICAgICAgICBjbGlwcGVyLmNsaXBFbmRXaXRoU2xvdChzbG90KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZmlsbCBpbmRpY2VzXG4gICAgICAgICAgICBpYnVmLnNldCh0cmlhbmdsZXMsIF9pbmRleE9mZnNldCk7XG5cbiAgICAgICAgICAgIC8vIGZpbGwgdSB2XG4gICAgICAgICAgICB1dnMgPSBhdHRhY2htZW50LnV2cztcbiAgICAgICAgICAgIGZvciAobGV0IHYgPSBfdmVydGV4RmxvYXRPZmZzZXQsIG4gPSBfdmVydGV4RmxvYXRPZmZzZXQgKyBfdmVydGV4RmxvYXRDb3VudCwgdSA9IDA7IHYgPCBuOyB2ICs9IF9wZXJWZXJ0ZXhTaXplLCB1ICs9IDIpIHtcbiAgICAgICAgICAgICAgICB2YnVmW3YgKyAzXSA9IHV2c1t1XTsgICAgICAgICAgIC8vIHVcbiAgICAgICAgICAgICAgICB2YnVmW3YgKyA0XSA9IHV2c1t1ICsgMV07ICAgICAgIC8vIHZcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXR0YWNobWVudENvbG9yID0gYXR0YWNobWVudC5jb2xvcixcbiAgICAgICAgICAgICAgICBzbG90Q29sb3IgPSBzbG90LmNvbG9yO1xuXG4gICAgICAgICAgICB0aGlzLmZpbGxWZXJ0aWNlcyhza2VsZXRvbkNvbG9yLCBhdHRhY2htZW50Q29sb3IsIHNsb3RDb2xvciwgY2xpcHBlciwgc2xvdCwgc2xvdElkeCk7XG5cbiAgICAgICAgICAgIC8vIHJlc2V0IGJ1ZmZlciBwb2ludGVyLCBiZWNhdXNlIGNsaXBwZXIgbWF5YmUgcmVhbGxvYyBhIG5ldyBidWZmZXIgaW4gZmlsZSBWZXJ0aWNlcyBmdW5jdGlvbi5cbiAgICAgICAgICAgIHZidWYgPSBfYnVmZmVyLl92RGF0YSxcbiAgICAgICAgICAgICAgICBpYnVmID0gX2J1ZmZlci5faURhdGE7XG5cbiAgICAgICAgICAgIGlmIChfaW5kZXhDb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpaSA9IF9pbmRleE9mZnNldCwgbm4gPSBfaW5kZXhPZmZzZXQgKyBfaW5kZXhDb3VudDsgaWkgPCBubjsgaWkrKykge1xuICAgICAgICAgICAgICAgICAgICBpYnVmW2lpXSArPSBfdmVydGV4T2Zmc2V0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh3b3JsZE1hdCkge1xuICAgICAgICAgICAgICAgICAgICB3b3JsZE1hdG0gPSB3b3JsZE1hdC5tO1xuICAgICAgICAgICAgICAgICAgICBfbTAwID0gd29ybGRNYXRtWzBdO1xuICAgICAgICAgICAgICAgICAgICBfbTA0ID0gd29ybGRNYXRtWzRdO1xuICAgICAgICAgICAgICAgICAgICBfbTEyID0gd29ybGRNYXRtWzEyXTtcbiAgICAgICAgICAgICAgICAgICAgX20wMSA9IHdvcmxkTWF0bVsxXTtcbiAgICAgICAgICAgICAgICAgICAgX20wNSA9IHdvcmxkTWF0bVs1XTtcbiAgICAgICAgICAgICAgICAgICAgX20xMyA9IHdvcmxkTWF0bVsxM107XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGlpID0gX3ZlcnRleEZsb2F0T2Zmc2V0LCBubiA9IF92ZXJ0ZXhGbG9hdE9mZnNldCArIF92ZXJ0ZXhGbG9hdENvdW50OyBpaSA8IG5uOyBpaSArPSBfcGVyVmVydGV4U2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3ggPSB2YnVmW2lpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF95ID0gdmJ1ZltpaSArIDFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmJ1ZltpaV0gPSBfeCAqIF9tMDAgKyBfeSAqIF9tMDQgKyBfbTEyO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmJ1ZltpaSArIDFdID0gX3ggKiBfbTAxICsgX3kgKiBfbTA1ICsgX20xMztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfYnVmZmVyLmFkanVzdChfdmVydGV4RmxvYXRDb3VudCAvIF9wZXJWZXJ0ZXhTaXplLCBfaW5kZXhDb3VudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xpcHBlci5jbGlwRW5kKCk7XG5cbiAgICAgICAgaWYgKGdyYXBoaWNzICYmIF9kZWJ1Z0JvbmVzKSB7XG4gICAgICAgICAgICBsZXQgYm9uZTtcbiAgICAgICAgICAgIGdyYXBoaWNzLnN0cm9rZUNvbG9yID0gX2JvbmVDb2xvcjtcbiAgICAgICAgICAgIGdyYXBoaWNzLmZpbGxDb2xvciA9IF9zbG90Q29sb3I7IC8vIFJvb3QgYm9uZSBjb2xvciBpcyBzYW1lIGFzIHNsb3QgY29sb3IuXG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBuID0gbG9jU2tlbGV0b24uYm9uZXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYm9uZSA9IGxvY1NrZWxldG9uLmJvbmVzW2ldO1xuICAgICAgICAgICAgICAgIGxldCB4ID0gYm9uZS5kYXRhLmxlbmd0aCAqIGJvbmUuYSArIGJvbmUud29ybGRYO1xuICAgICAgICAgICAgICAgIGxldCB5ID0gYm9uZS5kYXRhLmxlbmd0aCAqIGJvbmUuYyArIGJvbmUud29ybGRZO1xuXG4gICAgICAgICAgICAgICAgLy8gQm9uZSBsZW5ndGhzLlxuICAgICAgICAgICAgICAgIGdyYXBoaWNzLm1vdmVUbyhib25lLndvcmxkWCwgYm9uZS53b3JsZFkpO1xuICAgICAgICAgICAgICAgIGdyYXBoaWNzLmxpbmVUbyh4LCB5KTtcbiAgICAgICAgICAgICAgICBncmFwaGljcy5zdHJva2UoKTtcblxuICAgICAgICAgICAgICAgIC8vIEJvbmUgb3JpZ2lucy5cbiAgICAgICAgICAgICAgICBncmFwaGljcy5jaXJjbGUoYm9uZS53b3JsZFgsIGJvbmUud29ybGRZLCBNYXRoLlBJICogMS41KTtcbiAgICAgICAgICAgICAgICBncmFwaGljcy5maWxsKCk7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MuZmlsbENvbG9yID0gX29yaWdpbkNvbG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF93cml0ZVZlcnRleDJUb1ZlcnRleDNCdWZmZXIodmVydGV4MkFycmF5LCB2ZXJ0ZXgzQnVmZmVyLCBvZmZzZXQsIHZlcnRleENvdW50LCBzbG90SWR4KSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVydGV4Q291bnQ7IGkrKykge1xuICAgICAgICAgICAgbGV0IGRzdE9mZnNldCA9IGkgKiBfcGVyVmVydGV4U2l6ZSArIG9mZnNldDtcbiAgICAgICAgICAgIGxldCBzcmNPZmZzZXQgPSBpICogX3JlYWx0aW1lU2l6ZVBlclZlcnRleDtcblxuICAgICAgICAgICAgdmVydGV4M0J1ZmZlcltkc3RPZmZzZXRdID0gdmVydGV4MkFycmF5W3NyY09mZnNldF07ICAgICAgICAgLy94XG4gICAgICAgICAgICB2ZXJ0ZXgzQnVmZmVyW2RzdE9mZnNldCArIDFdID0gdmVydGV4MkFycmF5W3NyY09mZnNldCArIDFdOyAvL3lcbiAgICAgICAgICAgIHZlcnRleDNCdWZmZXJbZHN0T2Zmc2V0ICsgMl0gPSBfZGVwdGggLSBERVBUSF9SQVRFICogc2xvdElkeDsgICAgICAgICAgLy96XG4gICAgICAgICAgICB2ZXJ0ZXgzQnVmZmVyW2RzdE9mZnNldCArIDNdID0gdmVydGV4MkFycmF5W3NyY09mZnNldCArIDJdOyAvL3VcbiAgICAgICAgICAgIHZlcnRleDNCdWZmZXJbZHN0T2Zmc2V0ICsgNF0gPSB2ZXJ0ZXgyQXJyYXlbc3JjT2Zmc2V0ICsgM107IC8vdlxuICAgICAgICAgICAgdmVydGV4M0J1ZmZlcltkc3RPZmZzZXQgKyA1XSA9IHZlcnRleDJBcnJheVtzcmNPZmZzZXQgKyA0XTsgLy9jMVxuICAgICAgICAgICAgaWYgKF91c2VUaW50KSB7XG4gICAgICAgICAgICAgICAgdmVydGV4M0J1ZmZlcltkc3RPZmZzZXQgKyA2XSA9IHZlcnRleDJBcnJheVtzcmNPZmZzZXQgKyA1XTsgLy9jMlxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FjaGVUcmF2ZXJzZSh3b3JsZE1hdCkge1xuXG4gICAgICAgIGxldCBmcmFtZSA9IF9jb21wLl9jdXJGcmFtZTtcbiAgICAgICAgaWYgKCFmcmFtZSkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBzZWdtZW50cyA9IGZyYW1lLnNlZ21lbnRzO1xuICAgICAgICBpZiAoc2VnbWVudHMubGVuZ3RoID09IDApIHJldHVybjtcblxuICAgICAgICBsZXQgb2Zmc2V0cyA9IGZyYW1lLm9mZnNldHM7XG5cbiAgICAgICAgbGV0IHZidWYsIGlidWYsIHVpbnRidWY7XG4gICAgICAgIGxldCBtYXRlcmlhbDtcbiAgICAgICAgbGV0IG9mZnNldEluZm87XG4gICAgICAgIGxldCB2ZXJ0aWNlcyA9IGZyYW1lLnZlcnRpY2VzO1xuICAgICAgICBsZXQgaW5kaWNlcyA9IGZyYW1lLmluZGljZXM7XG4gICAgICAgIGxldCB3b3JsZE1hdG07XG5cbiAgICAgICAgbGV0IGZyYW1lVkZPZmZzZXQgPSAwLCBmcmFtZUluZGV4T2Zmc2V0ID0gMCwgc2VnVkZDb3VudCA9IDA7XG4gICAgICAgIGlmICh3b3JsZE1hdCkge1xuICAgICAgICAgICAgd29ybGRNYXRtID0gd29ybGRNYXQubTtcbiAgICAgICAgICAgIF9tMDAgPSB3b3JsZE1hdG1bMF07XG4gICAgICAgICAgICBfbTAxID0gd29ybGRNYXRtWzFdO1xuICAgICAgICAgICAgX20wNCA9IHdvcmxkTWF0bVs0XTtcbiAgICAgICAgICAgIF9tMDUgPSB3b3JsZE1hdG1bNV07XG4gICAgICAgICAgICBfbTEyID0gd29ybGRNYXRtWzEyXTtcbiAgICAgICAgICAgIF9tMTMgPSB3b3JsZE1hdG1bMTNdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGp1c3RUcmFuc2xhdGUgPSBfbTAwID09PSAxICYmIF9tMDEgPT09IDAgJiYgX20wNCA9PT0gMCAmJiBfbTA1ID09PSAxO1xuICAgICAgICBsZXQgbmVlZEJhdGNoID0gKF9oYW5kbGVWYWwgJiBGTEFHX0JBVENIKTtcbiAgICAgICAgbGV0IGNhbGNUcmFuc2xhdGUgPSBuZWVkQmF0Y2ggJiYganVzdFRyYW5zbGF0ZTtcblxuICAgICAgICBsZXQgY29sb3JPZmZzZXQgPSAwO1xuICAgICAgICBsZXQgY29sb3JzID0gZnJhbWUuY29sb3JzO1xuICAgICAgICBsZXQgbm93Q29sb3IgPSBjb2xvcnNbY29sb3JPZmZzZXQrK107XG4gICAgICAgIGxldCBtYXhWRk9mZnNldCA9IG5vd0NvbG9yLnZmT2Zmc2V0O1xuICAgICAgICBfaGFuZGxlQ29sb3Iobm93Q29sb3IpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBuID0gc2VnbWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgc2VnSW5mbyA9IHNlZ21lbnRzW2ldO1xuICAgICAgICAgICAgbWF0ZXJpYWwgPSBfZ2V0U2xvdE1hdGVyaWFsKHNlZ0luZm8udGV4LCBzZWdJbmZvLmJsZW5kTW9kZSk7XG4gICAgICAgICAgICBpZiAoIW1hdGVyaWFsKSBjb250aW51ZTtcblxuICAgICAgICAgICAgaWYgKF9tdXN0Rmx1c2ggfHwgbWF0ZXJpYWwuZ2V0SGFzaCgpICE9PSBfcmVuZGVyZXIubWF0ZXJpYWwuZ2V0SGFzaCgpKSB7XG4gICAgICAgICAgICAgICAgX211c3RGbHVzaCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIF9yZW5kZXJlci5fZmx1c2goKTtcbiAgICAgICAgICAgICAgICBfcmVuZGVyZXIubm9kZSA9IF9ub2RlO1xuICAgICAgICAgICAgICAgIF9yZW5kZXJlci5tYXRlcmlhbCA9IG1hdGVyaWFsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfdmVydGV4Q291bnQgPSBzZWdJbmZvLnZlcnRleENvdW50O1xuICAgICAgICAgICAgX2luZGV4Q291bnQgPSBzZWdJbmZvLmluZGV4Q291bnQ7XG5cbiAgICAgICAgICAgIG9mZnNldEluZm8gPSBfYnVmZmVyLnJlcXVlc3QoX3ZlcnRleENvdW50LCBfaW5kZXhDb3VudCk7XG4gICAgICAgICAgICBfaW5kZXhPZmZzZXQgPSBvZmZzZXRJbmZvLmluZGljZU9mZnNldDtcbiAgICAgICAgICAgIF92ZXJ0ZXhPZmZzZXQgPSBvZmZzZXRJbmZvLnZlcnRleE9mZnNldDtcbiAgICAgICAgICAgIF92Zk9mZnNldCA9IG9mZnNldEluZm8uYnl0ZU9mZnNldCA+PiAyO1xuICAgICAgICAgICAgdmJ1ZiA9IF9idWZmZXIuX3ZEYXRhO1xuICAgICAgICAgICAgaWJ1ZiA9IF9idWZmZXIuX2lEYXRhO1xuICAgICAgICAgICAgdWludGJ1ZiA9IF9idWZmZXIuX3VpbnRWRGF0YTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaWkgPSBfaW5kZXhPZmZzZXQsIGlsID0gX2luZGV4T2Zmc2V0ICsgX2luZGV4Q291bnQ7IGlpIDwgaWw7IGlpKyspIHtcbiAgICAgICAgICAgICAgICBpYnVmW2lpXSA9IF92ZXJ0ZXhPZmZzZXQgKyBpbmRpY2VzW2ZyYW1lSW5kZXhPZmZzZXQrK107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlZ1ZGQ291bnQgPSBzZWdJbmZvLnZmQ291bnQ7XG4gICAgICAgICAgICBsZXQgcmVuZGVyVmVydGV4Q291bnQgPSBfdmVydGV4Q291bnQgKiBfcGVyVmVydGV4U2l6ZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgX3ZlcnRleENvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgZHN0T2Zmc2V0ID0gX3ZmT2Zmc2V0ICsgaSAqIDc7XG4gICAgICAgICAgICAgICAgbGV0IHNyY09mZnNldCA9IGZyYW1lVkZPZmZzZXQgKyBpICogNjtcblxuICAgICAgICAgICAgICAgIHZidWZbZHN0T2Zmc2V0XSA9IHZlcnRpY2VzW3NyY09mZnNldF07XG4gICAgICAgICAgICAgICAgdmJ1Zltkc3RPZmZzZXQgKyAxXSA9IHZlcnRpY2VzW3NyY09mZnNldCArIDFdO1xuICAgICAgICAgICAgICAgIGxldCBqLCBsZW47XG4gICAgICAgICAgICAgICAgZm9yIChqID0gMCwgbGVuID0gb2Zmc2V0cy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3JjT2Zmc2V0IDw9IG9mZnNldHNbal0pIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YnVmW2RzdE9mZnNldCArIDJdID0gX2RlcHRoIC0gREVQVEhfUkFURSAqIGo7ICAgLy90b2RvIGRlcHRoICsg6Ieq5bex5rex5bqmXG4gICAgICAgICAgICAgICAgdmJ1Zltkc3RPZmZzZXQgKyAzXSA9IHZlcnRpY2VzW3NyY09mZnNldCArIDJdO1xuICAgICAgICAgICAgICAgIHZidWZbZHN0T2Zmc2V0ICsgNF0gPSB2ZXJ0aWNlc1tzcmNPZmZzZXQgKyAzXTtcbiAgICAgICAgICAgICAgICB2YnVmW2RzdE9mZnNldCArIDVdID0gdmVydGljZXNbc3JjT2Zmc2V0ICsgNF07XG4gICAgICAgICAgICAgICAgdmJ1Zltkc3RPZmZzZXQgKyA2XSA9IHZlcnRpY2VzW3NyY09mZnNldCArIDVdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB2YnVmLnNldCh2ZXJ0aWNlcy5zdWJhcnJheShmcmFtZVZGT2Zmc2V0LCBmcmFtZVZGT2Zmc2V0ICsgc2VnVkZDb3VudCksIF92Zk9mZnNldCk7XG4gICAgICAgICAgICBmcmFtZVZGT2Zmc2V0ICs9IHNlZ1ZGQ291bnQ7XG5cbiAgICAgICAgICAgIGlmIChjYWxjVHJhbnNsYXRlKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaWkgPSBfdmZPZmZzZXQsIGlsID0gX3ZmT2Zmc2V0ICsgcmVuZGVyVmVydGV4Q291bnQ7IGlpIDwgaWw7IGlpICs9IDcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltpaV0gKz0gX20xMjtcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltpaSArIDFdICs9IF9tMTM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChuZWVkQmF0Y2gpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpaSA9IF92Zk9mZnNldCwgaWwgPSBfdmZPZmZzZXQgKyByZW5kZXJWZXJ0ZXhDb3VudDsgaWkgPCBpbDsgaWkgKz0gNykge1xuICAgICAgICAgICAgICAgICAgICBfeCA9IHZidWZbaWldO1xuICAgICAgICAgICAgICAgICAgICBfeSA9IHZidWZbaWkgKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltpaV0gPSBfeCAqIF9tMDAgKyBfeSAqIF9tMDQgKyBfbTEyO1xuICAgICAgICAgICAgICAgICAgICB2YnVmW2lpICsgMV0gPSBfeCAqIF9tMDEgKyBfeSAqIF9tMDUgKyBfbTEzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX2J1ZmZlci5hZGp1c3QoX3ZlcnRleENvdW50LCBfaW5kZXhDb3VudCk7XG4gICAgICAgICAgICBpZiAoIV9uZWVkQ29sb3IpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAvLyBoYW5kbGUgY29sb3JcbiAgICAgICAgICAgIGxldCBmcmFtZUNvbG9yT2Zmc2V0ID0gZnJhbWVWRk9mZnNldCAtIHNlZ1ZGQ291bnQ7XG4gICAgICAgICAgICBmb3IgKGxldCBpaSA9IF92Zk9mZnNldCArIDUsIGlsID0gX3ZmT2Zmc2V0ICsgNSArIHNlZ1ZGQ291bnQ7IGlpIDwgaWw7IGlpICs9IDcsIGZyYW1lQ29sb3JPZmZzZXQgKz0gNikge1xuICAgICAgICAgICAgICAgIGlmIChmcmFtZUNvbG9yT2Zmc2V0ID49IG1heFZGT2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIG5vd0NvbG9yID0gY29sb3JzW2NvbG9yT2Zmc2V0KytdO1xuICAgICAgICAgICAgICAgICAgICBfaGFuZGxlQ29sb3Iobm93Q29sb3IpO1xuICAgICAgICAgICAgICAgICAgICBtYXhWRk9mZnNldCA9IG5vd0NvbG9yLnZmT2Zmc2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB1aW50YnVmW2lpXSA9IF9maW5hbENvbG9yMzI7XG4gICAgICAgICAgICAgICAgdWludGJ1ZltpaSArIDFdID0gX2RhcmtDb2xvcjMyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmlsbEJ1ZmZlcnMoY29tcCwgcmVuZGVyZXIpIHtcblxuICAgICAgICBsZXQgbm9kZSA9IGNvbXAubm9kZTtcbiAgICAgICAgbm9kZS5fcmVuZGVyRmxhZyB8PSBSZW5kZXJGbG93LkZMQUdfVVBEQVRFX1JFTkRFUl9EQVRBO1xuICAgICAgICBpZiAoIWNvbXAuX3NrZWxldG9uKSByZXR1cm47XG5cbiAgICAgICAgbGV0IG5vZGVDb2xvciA9IG5vZGUuX2NvbG9yO1xuICAgICAgICBfbm9kZVIgPSBub2RlQ29sb3IuciAvIDI1NTtcbiAgICAgICAgX25vZGVHID0gbm9kZUNvbG9yLmcgLyAyNTU7XG4gICAgICAgIF9ub2RlQiA9IG5vZGVDb2xvci5iIC8gMjU1O1xuICAgICAgICBfbm9kZUEgPSBub2RlQ29sb3IuYSAvIDI1NTtcblxuICAgICAgICBfdXNlVGludCA9IGNvbXAudXNlVGludCB8fCBjb21wLmlzQW5pbWF0aW9uQ2FjaGVkKCk7XG4gICAgICAgIF92ZXJ0ZXhGb3JtYXQgPSBfdXNlVGludCA/IFZGVHdvQ29sb3IgOiBWRk9uZUNvbG9yO1xuICAgICAgICAvLyB4IHkgeiB1IHYgY29sb3IxIGNvbG9yMiBvciB4IHkgdSB2IGNvbG9yXG4gICAgICAgIF9wZXJWZXJ0ZXhTaXplID0gX3VzZVRpbnQgPyA3IDogNjtcbiAgICAgICAgX3JlYWx0aW1lU2l6ZVBlclZlcnRleCA9IF91c2VUaW50ID8gNiA6IDU7XG5cbiAgICAgICAgX25vZGUgPSBjb21wLm5vZGU7XG4gICAgICAgIF9idWZmZXIgPSByZW5kZXJlci5nZXRCdWZmZXIoJ3NwaW5lJywgX3ZlcnRleEZvcm1hdCk7XG4gICAgICAgIF9yZW5kZXJlciA9IHJlbmRlcmVyO1xuICAgICAgICBfY29tcCA9IGNvbXA7XG4gICAgICAgIF9kZXB0aCA9IF9ub2RlLmRlcHRoIHx8IDA7XG5cbiAgICAgICAgX211c3RGbHVzaCA9IHRydWU7XG4gICAgICAgIF9wcmVtdWx0aXBsaWVkQWxwaGEgPSBjb21wLnByZW11bHRpcGxpZWRBbHBoYTtcbiAgICAgICAgX211bHRpcGxpZXIgPSAxLjA7XG4gICAgICAgIF9oYW5kbGVWYWwgPSAweDAwO1xuICAgICAgICBfbmVlZENvbG9yID0gZmFsc2U7XG4gICAgICAgIF92ZXJ0ZXhFZmZlY3QgPSBjb21wLl9lZmZlY3REZWxlZ2F0ZSAmJiBjb21wLl9lZmZlY3REZWxlZ2F0ZS5fdmVydGV4RWZmZWN0O1xuXG4gICAgICAgIGlmIChub2RlQ29sb3IuX3ZhbCAhPT0gMHhmZmZmZmZmZiB8fCBfcHJlbXVsdGlwbGllZEFscGhhKSB7XG4gICAgICAgICAgICBfbmVlZENvbG9yID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfdXNlVGludCkge1xuICAgICAgICAgICAgX2hhbmRsZVZhbCB8PSBGTEFHX1RXT19DT0xPUjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB3b3JsZE1hdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKF9jb21wLmVuYWJsZUJhdGNoKSB7XG4gICAgICAgICAgICB3b3JsZE1hdCA9IF9ub2RlLl93b3JsZE1hdHJpeDtcbiAgICAgICAgICAgIF9tdXN0Rmx1c2ggPSBmYWxzZTtcbiAgICAgICAgICAgIF9oYW5kbGVWYWwgfD0gRkxBR19CQVRDSDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb21wLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHtcbiAgICAgICAgICAgIC8vIFRyYXZlcnNlIGlucHV0IGFzc2VtYmxlci5cbiAgICAgICAgICAgIHRoaXMuY2FjaGVUcmF2ZXJzZSh3b3JsZE1hdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoX3ZlcnRleEVmZmVjdCkgX3ZlcnRleEVmZmVjdC5iZWdpbihjb21wLl9za2VsZXRvbik7XG4gICAgICAgICAgICB0aGlzLnJlYWxUaW1lVHJhdmVyc2Uod29ybGRNYXQpO1xuICAgICAgICAgICAgaWYgKF92ZXJ0ZXhFZmZlY3QpIF92ZXJ0ZXhFZmZlY3QuZW5kKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzeW5jIGF0dGFjaGVkIG5vZGUgbWF0cml4XG4gICAgICAgIHJlbmRlcmVyLndvcmxkTWF0RGlydHkrKztcbiAgICAgICAgY29tcC5hdHRhY2hVdGlsLl9zeW5jQXR0YWNoZWROb2RlKCk7XG5cbiAgICAgICAgLy8gQ2xlYXIgdGVtcCB2YXIuXG4gICAgICAgIF9ub2RlID0gdW5kZWZpbmVkO1xuICAgICAgICBfYnVmZmVyID0gdW5kZWZpbmVkO1xuICAgICAgICBfcmVuZGVyZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIF9jb21wID0gdW5kZWZpbmVkO1xuICAgICAgICBfdmVydGV4RWZmZWN0ID0gbnVsbDtcbiAgICB9XG5cbiAgICBwb3N0RmlsbEJ1ZmZlcnMoY29tcCwgcmVuZGVyZXIpIHtcbiAgICAgICAgcmVuZGVyZXIud29ybGRNYXREaXJ0eS0tO1xuICAgIH1cbn1cblxuQXNzZW1ibGVyLnJlZ2lzdGVyKFNrZWxldG9uLCBTcGluZUFzc2VtYmxlcik7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==