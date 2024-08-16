
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
var DEPTH_RATE = 0;

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
    DEPTH_RATE = Skeleton.depthRate;
    console.log('assembler depth rate', DEPTH_RATE);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvZXh0ZW5zaW9ucy9zcGluZS9zcGluZS1hc3NlbWJsZXIuanMiXSwibmFtZXMiOlsiU2tlbGV0b24iLCJyZXF1aXJlIiwic3BpbmUiLCJSZW5kZXJGbG93IiwiVmVydGV4Rm9ybWF0IiwiVkZPbmVDb2xvciIsInZmbXQzRCIsIlZGVHdvQ29sb3IiLCJ2Zm10UG9zM1V2VHdvQ29sb3IiLCJnZngiLCJjYyIsIkZMQUdfQkFUQ0giLCJGTEFHX1RXT19DT0xPUiIsIl9oYW5kbGVWYWwiLCJfcXVhZFRyaWFuZ2xlcyIsIl9zbG90Q29sb3IiLCJjb2xvciIsIl9ib25lQ29sb3IiLCJfb3JpZ2luQ29sb3IiLCJfbWVzaENvbG9yIiwiX2ZpbmFsQ29sb3IiLCJfZGFya0NvbG9yIiwiX3RlbXBQb3MiLCJfdGVtcFV2IiwiQ0NfTkFUSVZFUkVOREVSRVIiLCJDb2xvciIsIlZlY3RvcjIiLCJfcHJlbXVsdGlwbGllZEFscGhhIiwiX211bHRpcGxpZXIiLCJfc2xvdFJhbmdlU3RhcnQiLCJfc2xvdFJhbmdlRW5kIiwiX3VzZVRpbnQiLCJfZGVidWdTbG90cyIsIl9kZWJ1Z0JvbmVzIiwiX2RlYnVnTWVzaCIsIl9ub2RlUiIsIl9ub2RlRyIsIl9ub2RlQiIsIl9ub2RlQSIsIl9maW5hbENvbG9yMzIiLCJfZGFya0NvbG9yMzIiLCJfdmVydGV4Rm9ybWF0IiwiX3BlclZlcnRleFNpemUiLCJfcGVyQ2xpcFZlcnRleFNpemUiLCJfdmVydGV4RmxvYXRDb3VudCIsIl92ZXJ0ZXhDb3VudCIsIl92ZXJ0ZXhGbG9hdE9mZnNldCIsIl92ZXJ0ZXhPZmZzZXQiLCJfaW5kZXhDb3VudCIsIl9pbmRleE9mZnNldCIsIl92Zk9mZnNldCIsIl90ZW1wciIsIl90ZW1wZyIsIl90ZW1wYiIsIl9pblJhbmdlIiwiX211c3RGbHVzaCIsIl94IiwiX3kiLCJfbTAwIiwiX20wNCIsIl9tMTIiLCJfbTAxIiwiX20wNSIsIl9tMTMiLCJfciIsIl9nIiwiX2IiLCJfZnIiLCJfZmciLCJfZmIiLCJfZmEiLCJfZHIiLCJfZGciLCJfZGIiLCJfZGEiLCJfY29tcCIsIl9idWZmZXIiLCJfcmVuZGVyZXIiLCJfbm9kZSIsIl9uZWVkQ29sb3IiLCJfdmVydGV4RWZmZWN0IiwiX2RlcHRoIiwiX3JlYWx0aW1lVmVydGljZXMiLCJfcmVhbHRpbWVTaXplUGVyVmVydGV4IiwiREVQVEhfUkFURSIsIl9nZXRTbG90TWF0ZXJpYWwiLCJ0ZXgiLCJibGVuZE1vZGUiLCJzcmMiLCJkc3QiLCJCbGVuZE1vZGUiLCJBZGRpdGl2ZSIsIm1hY3JvIiwiT05FIiwiU1JDX0FMUEhBIiwiTXVsdGlwbHkiLCJEU1RfQ09MT1IiLCJPTkVfTUlOVVNfU1JDX0FMUEhBIiwiU2NyZWVuIiwiT05FX01JTlVTX1NSQ19DT0xPUiIsIk5vcm1hbCIsInVzZU1vZGVsIiwiZW5hYmxlQmF0Y2giLCJiYXNlTWF0ZXJpYWwiLCJfbWF0ZXJpYWxzIiwia2V5IiwiZ2V0SWQiLCJtYXRlcmlhbENhY2hlIiwiX21hdGVyaWFsQ2FjaGUiLCJtYXRlcmlhbCIsIk1hdGVyaWFsVmFyaWFudCIsImNyZWF0ZSIsImRlZmluZSIsInNldFByb3BlcnR5Iiwic2V0QmxlbmQiLCJCTEVORF9GVU5DX0FERCIsIl9oYW5kbGVDb2xvciIsImZhIiwiZnIiLCJmZyIsImZiIiwiZHIiLCJkZyIsImRiIiwiX3NwaW5lQ29sb3JUb0ludDMyIiwic3BpbmVDb2xvciIsImEiLCJiIiwiZyIsInIiLCJTcGluZUFzc2VtYmxlciIsImRlcHRoUmF0ZSIsImNvbnNvbGUiLCJsb2ciLCJ1cGRhdGVSZW5kZXJEYXRhIiwiY29tcCIsImlzQW5pbWF0aW9uQ2FjaGVkIiwic2tlbGV0b24iLCJfc2tlbGV0b24iLCJ1cGRhdGVXb3JsZFRyYW5zZm9ybSIsImZpbGxWZXJ0aWNlcyIsInNrZWxldG9uQ29sb3IiLCJhdHRhY2htZW50Q29sb3IiLCJzbG90Q29sb3IiLCJjbGlwcGVyIiwic2xvdCIsInNsb3RJZHgiLCJ2YnVmIiwiX3ZEYXRhIiwiaWJ1ZiIsIl9pRGF0YSIsInVpbnRWRGF0YSIsIl91aW50VkRhdGEiLCJvZmZzZXRJbmZvIiwiZGFya0NvbG9yIiwic2V0IiwidiIsIm4iLCJ4IiwieSIsInRyYW5zZm9ybSIsInV2cyIsInN1YmFycmF5IiwiY2xpcFRyaWFuZ2xlcyIsImNsaXBwZWRWZXJ0aWNlcyIsIkZsb2F0MzJBcnJheSIsImNsaXBwZWRUcmlhbmdsZXMiLCJsZW5ndGgiLCJyZXF1ZXN0IiwiaW5kaWNlT2Zmc2V0IiwidmVydGV4T2Zmc2V0IiwiYnl0ZU9mZnNldCIsIm9mZnNldCIsInJlYWxUaW1lVHJhdmVyc2UiLCJ3b3JsZE1hdCIsImxvY1NrZWxldG9uIiwiZ3JhcGhpY3MiLCJfZGVidWdSZW5kZXJlciIsIl9jbGlwcGVyIiwiYXR0YWNobWVudCIsInRyaWFuZ2xlcyIsImlzUmVnaW9uIiwiaXNNZXNoIiwiaXNDbGlwIiwid29ybGRNYXRtIiwiX3N0YXJ0U2xvdEluZGV4IiwiX2VuZFNsb3RJbmRleCIsImRlYnVnU2xvdHMiLCJkZWJ1Z0JvbmVzIiwiZGVidWdNZXNoIiwiY2xlYXIiLCJsaW5lV2lkdGgiLCJzbG90Q291bnQiLCJkcmF3T3JkZXIiLCJ1bmRlZmluZWQiLCJkYXRhIiwiaW5kZXgiLCJjbGlwRW5kV2l0aFNsb3QiLCJnZXRBdHRhY2htZW50IiwiUmVnaW9uQXR0YWNobWVudCIsIk1lc2hBdHRhY2htZW50IiwiQ2xpcHBpbmdBdHRhY2htZW50IiwiY2xpcFN0YXJ0IiwicmVnaW9uIiwidGV4dHVyZSIsIl90ZXh0dXJlIiwiZ2V0SGFzaCIsIl9mbHVzaCIsIm5vZGUiLCJjb21wdXRlV29ybGRWZXJ0aWNlcyIsImJvbmUiLCJfd3JpdGVWZXJ0ZXgyVG9WZXJ0ZXgzQnVmZmVyIiwic3Ryb2tlQ29sb3IiLCJtb3ZlVG8iLCJpaSIsIm5uIiwibGluZVRvIiwiY2xvc2UiLCJzdHJva2UiLCJ3b3JsZFZlcnRpY2VzTGVuZ3RoIiwidjEiLCJ2MiIsInYzIiwidSIsIm0iLCJhZGp1c3QiLCJjbGlwRW5kIiwiZmlsbENvbG9yIiwiaSIsImJvbmVzIiwid29ybGRYIiwiYyIsIndvcmxkWSIsImNpcmNsZSIsIk1hdGgiLCJQSSIsImZpbGwiLCJ2ZXJ0ZXgyQXJyYXkiLCJ2ZXJ0ZXgzQnVmZmVyIiwidmVydGV4Q291bnQiLCJkc3RPZmZzZXQiLCJzcmNPZmZzZXQiLCJjYWNoZVRyYXZlcnNlIiwiZnJhbWUiLCJfY3VyRnJhbWUiLCJzZWdtZW50cyIsIm9mZnNldHMiLCJ1aW50YnVmIiwidmVydGljZXMiLCJpbmRpY2VzIiwiZnJhbWVWRk9mZnNldCIsImZyYW1lSW5kZXhPZmZzZXQiLCJzZWdWRkNvdW50IiwianVzdFRyYW5zbGF0ZSIsIm5lZWRCYXRjaCIsImNhbGNUcmFuc2xhdGUiLCJjb2xvck9mZnNldCIsImNvbG9ycyIsIm5vd0NvbG9yIiwibWF4VkZPZmZzZXQiLCJ2Zk9mZnNldCIsInNlZ0luZm8iLCJpbmRleENvdW50IiwiaWwiLCJ2ZkNvdW50IiwicmVuZGVyVmVydGV4Q291bnQiLCJqIiwibGVuIiwiZnJhbWVDb2xvck9mZnNldCIsImZpbGxCdWZmZXJzIiwicmVuZGVyZXIiLCJfcmVuZGVyRmxhZyIsIkZMQUdfVVBEQVRFX1JFTkRFUl9EQVRBIiwibm9kZUNvbG9yIiwiX2NvbG9yIiwidXNlVGludCIsImdldEJ1ZmZlciIsImRlcHRoIiwicHJlbXVsdGlwbGllZEFscGhhIiwiX2VmZmVjdERlbGVnYXRlIiwiX3ZhbCIsIl93b3JsZE1hdHJpeCIsImJlZ2luIiwiZW5kIiwid29ybGRNYXREaXJ0eSIsImF0dGFjaFV0aWwiLCJfc3luY0F0dGFjaGVkTm9kZSIsInBvc3RGaWxsQnVmZmVycyIsIkFzc2VtYmxlciIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOzs7Ozs7OztBQUVBLElBQU1BLFFBQVEsR0FBR0MsT0FBTyxDQUFDLFlBQUQsQ0FBeEI7O0FBQ0EsSUFBTUMsS0FBSyxHQUFHRCxPQUFPLENBQUMsYUFBRCxDQUFyQjs7QUFDQSxJQUFNRSxVQUFVLEdBQUdGLE9BQU8sQ0FBQyx5Q0FBRCxDQUExQjs7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O0FBQ0F0SCxJQUFBQSxPQUFPLEdBQUdzSCxTQUFWO0FBQ0FySCxJQUFBQSxTQUFTLEdBQUdxSCxTQUFaO0FBQ0F2SCxJQUFBQSxLQUFLLEdBQUd1SCxTQUFSO0FBQ0FsSCxJQUFBQSxhQUFhLEdBQUcsSUFBaEI7QUFDSDs7U0FFRCtNLGtCQUFBLHlCQUFnQnhKLElBQWhCLEVBQXNCdUksUUFBdEIsRUFBZ0M7QUFDNUJBLElBQUFBLFFBQVEsQ0FBQ2MsYUFBVDtBQUNIOzs7RUFua0J1Q0k7Ozs7QUFza0I1Q0Esc0JBQVVDLFFBQVYsQ0FBbUJqUyxRQUFuQixFQUE2QmtJLGNBQTdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IEFzc2VtYmxlciBmcm9tICcuLi8uLi9jb2NvczJkL2NvcmUvcmVuZGVyZXIvYXNzZW1ibGVyJztcblxuY29uc3QgU2tlbGV0b24gPSByZXF1aXJlKCcuL1NrZWxldG9uJyk7XG5jb25zdCBzcGluZSA9IHJlcXVpcmUoJy4vbGliL3NwaW5lJyk7XG5jb25zdCBSZW5kZXJGbG93ID0gcmVxdWlyZSgnLi4vLi4vY29jb3MyZC9jb3JlL3JlbmRlcmVyL3JlbmRlci1mbG93Jyk7XG5jb25zdCBWZXJ0ZXhGb3JtYXQgPSByZXF1aXJlKCcuLi8uLi9jb2NvczJkL2NvcmUvcmVuZGVyZXIvd2ViZ2wvdmVydGV4LWZvcm1hdCcpXG5jb25zdCBWRk9uZUNvbG9yID0gVmVydGV4Rm9ybWF0LnZmbXQzRDtcbmNvbnN0IFZGVHdvQ29sb3IgPSBWZXJ0ZXhGb3JtYXQudmZtdFBvczNVdlR3b0NvbG9yO1xuY29uc3QgZ2Z4ID0gY2MuZ2Z4O1xuXG5jb25zdCBGTEFHX0JBVENIID0gMHgxMDtcbmNvbnN0IEZMQUdfVFdPX0NPTE9SID0gMHgwMTtcblxubGV0IF9oYW5kbGVWYWwgPSAweDAwO1xubGV0IF9xdWFkVHJpYW5nbGVzID0gWzAsIDEsIDIsIDIsIDMsIDBdO1xubGV0IF9zbG90Q29sb3IgPSBjYy5jb2xvcigwLCAwLCAyNTUsIDI1NSk7XG5sZXQgX2JvbmVDb2xvciA9IGNjLmNvbG9yKDI1NSwgMCwgMCwgMjU1KTtcbmxldCBfb3JpZ2luQ29sb3IgPSBjYy5jb2xvcigwLCAyNTUsIDAsIDI1NSk7XG5sZXQgX21lc2hDb2xvciA9IGNjLmNvbG9yKDI1NSwgMjU1LCAwLCAyNTUpO1xuXG5sZXQgX2ZpbmFsQ29sb3IgPSBudWxsO1xubGV0IF9kYXJrQ29sb3IgPSBudWxsO1xubGV0IF90ZW1wUG9zID0gbnVsbCwgX3RlbXBVdiA9IG51bGw7XG5pZiAoIUNDX05BVElWRVJFTkRFUkVSKSB7XG4gICAgX2ZpbmFsQ29sb3IgPSBuZXcgc3BpbmUuQ29sb3IoMSwgMSwgMSwgMSk7XG4gICAgX2RhcmtDb2xvciA9IG5ldyBzcGluZS5Db2xvcigxLCAxLCAxLCAxKTtcbiAgICBfdGVtcFBvcyA9IG5ldyBzcGluZS5WZWN0b3IyKCk7XG4gICAgX3RlbXBVdiA9IG5ldyBzcGluZS5WZWN0b3IyKCk7XG59XG5cbmxldCBfcHJlbXVsdGlwbGllZEFscGhhO1xubGV0IF9tdWx0aXBsaWVyO1xubGV0IF9zbG90UmFuZ2VTdGFydDtcbmxldCBfc2xvdFJhbmdlRW5kO1xubGV0IF91c2VUaW50O1xubGV0IF9kZWJ1Z1Nsb3RzO1xubGV0IF9kZWJ1Z0JvbmVzO1xubGV0IF9kZWJ1Z01lc2g7XG5sZXQgX25vZGVSLFxuICAgIF9ub2RlRyxcbiAgICBfbm9kZUIsXG4gICAgX25vZGVBO1xubGV0IF9maW5hbENvbG9yMzIsIF9kYXJrQ29sb3IzMjtcbmxldCBfdmVydGV4Rm9ybWF0O1xubGV0IF9wZXJWZXJ0ZXhTaXplO1xubGV0IF9wZXJDbGlwVmVydGV4U2l6ZTtcblxuLyoqIOW9k+WJjXNsb3TnmoTpobbngrnmta7ngrnmlbDorqHmlbAgKi9cbmxldCBfdmVydGV4RmxvYXRDb3VudCA9IDA7XG5sZXQgX3ZlcnRleENvdW50ID0gMDtcbmxldCBfdmVydGV4RmxvYXRPZmZzZXQgPSAwO1xuLyoqIOatpOaXtueahOmhtueCueWcqHZib+eahOWBj+enuyAqL1xubGV0IF92ZXJ0ZXhPZmZzZXQgPSAwO1xuLyoqIOW9k+WJjXNsb3TnmoTpobbngrnntKLlvJXorqHmlbAgKi9cbmxldCBfaW5kZXhDb3VudCA9IDA7XG4vKiog5q2k5pe255qE6aG254K55ZyoaWJv55qE5YGP56e7ICovXG5sZXQgX2luZGV4T2Zmc2V0ID0gMDtcbmxldCBfdmZPZmZzZXQgPSAwO1xuXG5sZXQgX3RlbXByLCBfdGVtcGcsIF90ZW1wYjtcbmxldCBfaW5SYW5nZTtcbmxldCBfbXVzdEZsdXNoO1xubGV0IF94LCBfeSwgX20wMCwgX20wNCwgX20xMiwgX20wMSwgX20wNSwgX20xMztcbmxldCBfciwgX2csIF9iLCBfZnIsIF9mZywgX2ZiLCBfZmEsIF9kciwgX2RnLCBfZGIsIF9kYTtcbmxldCBfY29tcCwgX2J1ZmZlciwgX3JlbmRlcmVyLCBfbm9kZSwgX25lZWRDb2xvciwgX3ZlcnRleEVmZmVjdDtcbmxldCBfZGVwdGg7XG5sZXQgX3JlYWx0aW1lVmVydGljZXMgPSBbXTtcbi8qKiDlrp7ml7bmuLLmn5PnmoTpobbngrnlpKflsI8o5a2X6IqCKe+8jOivu+WPlnNrZWxldG9u5pe255SoICovXG5sZXQgX3JlYWx0aW1lU2l6ZVBlclZlcnRleCA9IDA7XG5cbmxldCBERVBUSF9SQVRFID0gMDtcblxuZnVuY3Rpb24gX2dldFNsb3RNYXRlcmlhbCh0ZXgsIGJsZW5kTW9kZSkge1xuICAgIGxldCBzcmMsIGRzdDtcbiAgICBzd2l0Y2ggKGJsZW5kTW9kZSkge1xuICAgICAgICBjYXNlIHNwaW5lLkJsZW5kTW9kZS5BZGRpdGl2ZTpcbiAgICAgICAgICAgIHNyYyA9IF9wcmVtdWx0aXBsaWVkQWxwaGEgPyBjYy5tYWNyby5PTkUgOiBjYy5tYWNyby5TUkNfQUxQSEE7XG4gICAgICAgICAgICBkc3QgPSBjYy5tYWNyby5PTkU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBzcGluZS5CbGVuZE1vZGUuTXVsdGlwbHk6XG4gICAgICAgICAgICBzcmMgPSBjYy5tYWNyby5EU1RfQ09MT1I7XG4gICAgICAgICAgICBkc3QgPSBjYy5tYWNyby5PTkVfTUlOVVNfU1JDX0FMUEhBO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2Ugc3BpbmUuQmxlbmRNb2RlLlNjcmVlbjpcbiAgICAgICAgICAgIHNyYyA9IGNjLm1hY3JvLk9ORTtcbiAgICAgICAgICAgIGRzdCA9IGNjLm1hY3JvLk9ORV9NSU5VU19TUkNfQ09MT1I7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBzcGluZS5CbGVuZE1vZGUuTm9ybWFsOlxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgc3JjID0gX3ByZW11bHRpcGxpZWRBbHBoYSA/IGNjLm1hY3JvLk9ORSA6IGNjLm1hY3JvLlNSQ19BTFBIQTtcbiAgICAgICAgICAgIGRzdCA9IGNjLm1hY3JvLk9ORV9NSU5VU19TUkNfQUxQSEE7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBsZXQgdXNlTW9kZWwgPSAhX2NvbXAuZW5hYmxlQmF0Y2g7XG4gICAgbGV0IGJhc2VNYXRlcmlhbCA9IF9jb21wLl9tYXRlcmlhbHNbMF07XG4gICAgaWYgKCFiYXNlTWF0ZXJpYWwpIHJldHVybiBudWxsO1xuXG4gICAgLy8gVGhlIGtleSB1c2UgdG8gZmluZCBjb3JyZXNwb25kaW5nIG1hdGVyaWFsXG4gICAgbGV0IGtleSA9IHRleC5nZXRJZCgpICsgc3JjICsgZHN0ICsgX3VzZVRpbnQgKyB1c2VNb2RlbDtcbiAgICBsZXQgbWF0ZXJpYWxDYWNoZSA9IF9jb21wLl9tYXRlcmlhbENhY2hlO1xuICAgIGxldCBtYXRlcmlhbCA9IG1hdGVyaWFsQ2FjaGVba2V5XTtcbiAgICBpZiAoIW1hdGVyaWFsKSB7XG4gICAgICAgIGlmICghbWF0ZXJpYWxDYWNoZS5iYXNlTWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIG1hdGVyaWFsID0gYmFzZU1hdGVyaWFsO1xuICAgICAgICAgICAgbWF0ZXJpYWxDYWNoZS5iYXNlTWF0ZXJpYWwgPSBiYXNlTWF0ZXJpYWw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtYXRlcmlhbCA9IGNjLk1hdGVyaWFsVmFyaWFudC5jcmVhdGUoYmFzZU1hdGVyaWFsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdGVyaWFsLmRlZmluZSgnQ0NfVVNFX01PREVMJywgdXNlTW9kZWwpO1xuICAgICAgICBtYXRlcmlhbC5kZWZpbmUoJ1VTRV9USU5UJywgX3VzZVRpbnQpO1xuICAgICAgICAvLyB1cGRhdGUgdGV4dHVyZVxuICAgICAgICBtYXRlcmlhbC5zZXRQcm9wZXJ0eSgndGV4dHVyZScsIHRleCk7XG5cbiAgICAgICAgLy8gdXBkYXRlIGJsZW5kIGZ1bmN0aW9uXG4gICAgICAgIG1hdGVyaWFsLnNldEJsZW5kKFxuICAgICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICAgIGdmeC5CTEVORF9GVU5DX0FERCxcbiAgICAgICAgICAgIHNyYywgZHN0LFxuICAgICAgICAgICAgZ2Z4LkJMRU5EX0ZVTkNfQURELFxuICAgICAgICAgICAgc3JjLCBkc3RcbiAgICAgICAgKTtcbiAgICAgICAgbWF0ZXJpYWxDYWNoZVtrZXldID0gbWF0ZXJpYWw7XG4gICAgfVxuICAgIHJldHVybiBtYXRlcmlhbDtcbn1cblxuZnVuY3Rpb24gX2hhbmRsZUNvbG9yKGNvbG9yKSB7XG4gICAgLy8gdGVtcCByZ2IgaGFzIG11bHRpcGx5IDI1NSwgc28gbmVlZCBkaXZpZGUgMjU1O1xuICAgIF9mYSA9IGNvbG9yLmZhICogX25vZGVBO1xuICAgIF9tdWx0aXBsaWVyID0gX3ByZW11bHRpcGxpZWRBbHBoYSA/IF9mYSAvIDI1NSA6IDE7XG4gICAgX3IgPSBfbm9kZVIgKiBfbXVsdGlwbGllcjtcbiAgICBfZyA9IF9ub2RlRyAqIF9tdWx0aXBsaWVyO1xuICAgIF9iID0gX25vZGVCICogX211bHRpcGxpZXI7XG5cbiAgICBfZnIgPSBjb2xvci5mciAqIF9yO1xuICAgIF9mZyA9IGNvbG9yLmZnICogX2c7XG4gICAgX2ZiID0gY29sb3IuZmIgKiBfYjtcbiAgICBfZmluYWxDb2xvcjMyID0gKChfZmEgPDwgMjQpID4+PiAwKSArIChfZmIgPDwgMTYpICsgKF9mZyA8PCA4KSArIF9mcjtcblxuICAgIF9kciA9IGNvbG9yLmRyICogX3I7XG4gICAgX2RnID0gY29sb3IuZGcgKiBfZztcbiAgICBfZGIgPSBjb2xvci5kYiAqIF9iO1xuICAgIF9kYSA9IF9wcmVtdWx0aXBsaWVkQWxwaGEgPyAyNTUgOiAwO1xuICAgIF9kYXJrQ29sb3IzMiA9ICgoX2RhIDw8IDI0KSA+Pj4gMCkgKyAoX2RiIDw8IDE2KSArIChfZGcgPDwgOCkgKyBfZHI7XG59XG5cbmZ1bmN0aW9uIF9zcGluZUNvbG9yVG9JbnQzMihzcGluZUNvbG9yKSB7XG4gICAgcmV0dXJuICgoc3BpbmVDb2xvci5hIDw8IDI0KSA+Pj4gMCkgKyAoc3BpbmVDb2xvci5iIDw8IDE2KSArIChzcGluZUNvbG9yLmcgPDwgOCkgKyBzcGluZUNvbG9yLnI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwaW5lQXNzZW1ibGVyIGV4dGVuZHMgQXNzZW1ibGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBERVBUSF9SQVRFID0gU2tlbGV0b24uZGVwdGhSYXRlO1xuICAgICAgICBjb25zb2xlLmxvZygnYXNzZW1ibGVyIGRlcHRoIHJhdGUnLCBERVBUSF9SQVRFKTtcbiAgICB9XG4gICAgdXBkYXRlUmVuZGVyRGF0YShjb21wKSB7XG4gICAgICAgIGlmIChjb21wLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHJldHVybjtcbiAgICAgICAgbGV0IHNrZWxldG9uID0gY29tcC5fc2tlbGV0b247XG4gICAgICAgIGlmIChza2VsZXRvbikge1xuICAgICAgICAgICAgc2tlbGV0b24udXBkYXRlV29ybGRUcmFuc2Zvcm0oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbGxWZXJ0aWNlcyhza2VsZXRvbkNvbG9yLCBhdHRhY2htZW50Q29sb3IsIHNsb3RDb2xvciwgY2xpcHBlciwgc2xvdCwgc2xvdElkeCkge1xuXG4gICAgICAgIGxldCB2YnVmID0gX2J1ZmZlci5fdkRhdGEsXG4gICAgICAgICAgICBpYnVmID0gX2J1ZmZlci5faURhdGEsXG4gICAgICAgICAgICB1aW50VkRhdGEgPSBfYnVmZmVyLl91aW50VkRhdGE7XG4gICAgICAgIGxldCBvZmZzZXRJbmZvO1xuXG4gICAgICAgIF9maW5hbENvbG9yLmEgPSBzbG90Q29sb3IuYSAqIGF0dGFjaG1lbnRDb2xvci5hICogc2tlbGV0b25Db2xvci5hICogX25vZGVBICogMjU1O1xuICAgICAgICBfbXVsdGlwbGllciA9IF9wcmVtdWx0aXBsaWVkQWxwaGEgPyBfZmluYWxDb2xvci5hIDogMjU1O1xuICAgICAgICBfdGVtcHIgPSBfbm9kZVIgKiBhdHRhY2htZW50Q29sb3IuciAqIHNrZWxldG9uQ29sb3IuciAqIF9tdWx0aXBsaWVyO1xuICAgICAgICBfdGVtcGcgPSBfbm9kZUcgKiBhdHRhY2htZW50Q29sb3IuZyAqIHNrZWxldG9uQ29sb3IuZyAqIF9tdWx0aXBsaWVyO1xuICAgICAgICBfdGVtcGIgPSBfbm9kZUIgKiBhdHRhY2htZW50Q29sb3IuYiAqIHNrZWxldG9uQ29sb3IuYiAqIF9tdWx0aXBsaWVyO1xuXG4gICAgICAgIF9maW5hbENvbG9yLnIgPSBfdGVtcHIgKiBzbG90Q29sb3IucjtcbiAgICAgICAgX2ZpbmFsQ29sb3IuZyA9IF90ZW1wZyAqIHNsb3RDb2xvci5nO1xuICAgICAgICBfZmluYWxDb2xvci5iID0gX3RlbXBiICogc2xvdENvbG9yLmI7XG5cbiAgICAgICAgaWYgKHNsb3QuZGFya0NvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgIF9kYXJrQ29sb3Iuc2V0KDAuMCwgMC4wLCAwLjAsIDEuMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfZGFya0NvbG9yLnIgPSBzbG90LmRhcmtDb2xvci5yICogX3RlbXByO1xuICAgICAgICAgICAgX2RhcmtDb2xvci5nID0gc2xvdC5kYXJrQ29sb3IuZyAqIF90ZW1wZztcbiAgICAgICAgICAgIF9kYXJrQ29sb3IuYiA9IHNsb3QuZGFya0NvbG9yLmIgKiBfdGVtcGI7XG4gICAgICAgIH1cbiAgICAgICAgX2RhcmtDb2xvci5hID0gX3ByZW11bHRpcGxpZWRBbHBoYSA/IDI1NSA6IDA7XG5cbiAgICAgICAgaWYgKC8qKiFjbGlwcGVyLmlzQ2xpcHBpbmcoKSovdHJ1ZSkge1xuICAgICAgICAgICAgaWYgKF92ZXJ0ZXhFZmZlY3QpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB2ID0gX3ZlcnRleEZsb2F0T2Zmc2V0LCBuID0gX3ZlcnRleEZsb2F0T2Zmc2V0ICsgX3ZlcnRleEZsb2F0Q291bnQ7IHYgPCBuOyB2ICs9IF9wZXJWZXJ0ZXhTaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIF90ZW1wUG9zLnggPSB2YnVmW3ZdO1xuICAgICAgICAgICAgICAgICAgICBfdGVtcFBvcy55ID0gdmJ1Zlt2ICsgMV07XG4gICAgICAgICAgICAgICAgICAgIF90ZW1wVXYueCA9IHZidWZbdiArIDNdO1xuICAgICAgICAgICAgICAgICAgICBfdGVtcFV2LnkgPSB2YnVmW3YgKyA0XTtcbiAgICAgICAgICAgICAgICAgICAgX3ZlcnRleEVmZmVjdC50cmFuc2Zvcm0oX3RlbXBQb3MsIF90ZW1wVXYsIF9maW5hbENvbG9yLCBfZGFya0NvbG9yKTtcblxuICAgICAgICAgICAgICAgICAgICB2YnVmW3ZdID0gX3RlbXBQb3MueDsgICAgICAgIC8vIHhcbiAgICAgICAgICAgICAgICAgICAgdmJ1Zlt2ICsgMV0gPSBfdGVtcFBvcy55OyAgICAgICAgLy8geVxuICAgICAgICAgICAgICAgICAgICB2YnVmW3YgKyAzXSA9IF90ZW1wVXYueDsgICAgICAgICAvLyB1XG4gICAgICAgICAgICAgICAgICAgIHZidWZbdiArIDRdID0gX3RlbXBVdi55OyAgICAgICAgIC8vIHZcbiAgICAgICAgICAgICAgICAgICAgdWludFZEYXRhW3YgKyA1XSA9IF9zcGluZUNvbG9yVG9JbnQzMihfZmluYWxDb2xvcik7ICAgICAgICAgICAgICAgICAgLy8gbGlnaHQgY29sb3JcbiAgICAgICAgICAgICAgICAgICAgX3VzZVRpbnQgJiYgKHVpbnRWRGF0YVt2ICsgNl0gPSBfc3BpbmVDb2xvclRvSW50MzIoX2RhcmtDb2xvcikpOyAgICAgIC8vIGRhcmsgY29sb3JcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF9maW5hbENvbG9yMzIgPSBfc3BpbmVDb2xvclRvSW50MzIoX2ZpbmFsQ29sb3IpO1xuICAgICAgICAgICAgICAgIF9kYXJrQ29sb3IzMiA9IF9zcGluZUNvbG9yVG9JbnQzMihfZGFya0NvbG9yKTtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IHYgPSBfdmVydGV4RmxvYXRPZmZzZXQsIG4gPSBfdmVydGV4RmxvYXRPZmZzZXQgKyBfdmVydGV4RmxvYXRDb3VudDsgdiA8IG47IHYgKz0gX3BlclZlcnRleFNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgdWludFZEYXRhW3YgKyA1XSA9IF9maW5hbENvbG9yMzI7ICAgICAgICAgICAgICAgICAgIC8vIGxpZ2h0IGNvbG9yXG4gICAgICAgICAgICAgICAgICAgIF91c2VUaW50ICYmICh1aW50VkRhdGFbdiArIDZdID0gX2RhcmtDb2xvcjMyKTsgICAgICAvLyBkYXJrIGNvbG9yXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHV2cyA9IHZidWYuc3ViYXJyYXkoX3ZlcnRleEZsb2F0T2Zmc2V0ICsgMyk7XG4gICAgICAgICAgICBjbGlwcGVyLmNsaXBUcmlhbmdsZXModmJ1Zi5zdWJhcnJheShfdmVydGV4RmxvYXRPZmZzZXQpLCBfdmVydGV4RmxvYXRDb3VudCwgaWJ1Zi5zdWJhcnJheShfaW5kZXhPZmZzZXQpLCBfaW5kZXhDb3VudCwgdXZzLCBfZmluYWxDb2xvciwgX2RhcmtDb2xvciwgX3VzZVRpbnQsIF9wZXJWZXJ0ZXhTaXplKTtcbiAgICAgICAgICAgIGxldCBjbGlwcGVkVmVydGljZXMgPSBuZXcgRmxvYXQzMkFycmF5KGNsaXBwZXIuY2xpcHBlZFZlcnRpY2VzKTtcbiAgICAgICAgICAgIGxldCBjbGlwcGVkVHJpYW5nbGVzID0gY2xpcHBlci5jbGlwcGVkVHJpYW5nbGVzO1xuXG4gICAgICAgICAgICAvLyBpbnN1cmUgY2FwYWNpdHlcbiAgICAgICAgICAgIF9pbmRleENvdW50ID0gY2xpcHBlZFRyaWFuZ2xlcy5sZW5ndGg7XG4gICAgICAgICAgICBfdmVydGV4RmxvYXRDb3VudCA9IGNsaXBwZWRWZXJ0aWNlcy5sZW5ndGggLyBfcGVyQ2xpcFZlcnRleFNpemUgKiBfcGVyVmVydGV4U2l6ZTtcblxuICAgICAgICAgICAgb2Zmc2V0SW5mbyA9IF9idWZmZXIucmVxdWVzdChfdmVydGV4RmxvYXRDb3VudCAvIF9wZXJWZXJ0ZXhTaXplLCBfaW5kZXhDb3VudCk7XG4gICAgICAgICAgICBfaW5kZXhPZmZzZXQgPSBvZmZzZXRJbmZvLmluZGljZU9mZnNldCxcbiAgICAgICAgICAgICAgICBfdmVydGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby52ZXJ0ZXhPZmZzZXQsXG4gICAgICAgICAgICAgICAgX3ZlcnRleEZsb2F0T2Zmc2V0ID0gb2Zmc2V0SW5mby5ieXRlT2Zmc2V0ID4+IDI7XG4gICAgICAgICAgICB2YnVmID0gX2J1ZmZlci5fdkRhdGEsXG4gICAgICAgICAgICAgICAgaWJ1ZiA9IF9idWZmZXIuX2lEYXRhO1xuICAgICAgICAgICAgdWludFZEYXRhID0gX2J1ZmZlci5fdWludFZEYXRhO1xuXG4gICAgICAgICAgICAvLyBmaWxsIGluZGljZXNcbiAgICAgICAgICAgIGlidWYuc2V0KGNsaXBwZWRUcmlhbmdsZXMsIF9pbmRleE9mZnNldCk7XG5cbiAgICAgICAgICAgIC8vIGZpbGwgdmVydGljZXMgY29udGFpbiB4IHkgdSB2IGxpZ2h0IGNvbG9yIGRhcmsgY29sb3JcbiAgICAgICAgICAgIGlmIChfdmVydGV4RWZmZWN0KSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdiA9IDAsIG4gPSBjbGlwcGVkVmVydGljZXMubGVuZ3RoLCBvZmZzZXQgPSBfdmVydGV4RmxvYXRPZmZzZXQ7IHYgPCBuOyB2ICs9IF9wZXJDbGlwVmVydGV4U2l6ZSwgb2Zmc2V0ICs9IF9wZXJWZXJ0ZXhTaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIF90ZW1wUG9zLnggPSBjbGlwcGVkVmVydGljZXNbdl07XG4gICAgICAgICAgICAgICAgICAgIF90ZW1wUG9zLnkgPSBjbGlwcGVkVmVydGljZXNbdiArIDFdO1xuICAgICAgICAgICAgICAgICAgICBfZmluYWxDb2xvci5zZXQoY2xpcHBlZFZlcnRpY2VzW3YgKyAyXSwgY2xpcHBlZFZlcnRpY2VzW3YgKyAzXSwgY2xpcHBlZFZlcnRpY2VzW3YgKyA0XSwgY2xpcHBlZFZlcnRpY2VzW3YgKyA1XSk7XG4gICAgICAgICAgICAgICAgICAgIF90ZW1wVXYueCA9IGNsaXBwZWRWZXJ0aWNlc1t2ICsgNl07XG4gICAgICAgICAgICAgICAgICAgIF90ZW1wVXYueSA9IGNsaXBwZWRWZXJ0aWNlc1t2ICsgN107XG4gICAgICAgICAgICAgICAgICAgIGlmIChfdXNlVGludCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2RhcmtDb2xvci5zZXQoY2xpcHBlZFZlcnRpY2VzW3YgKyA4XSwgY2xpcHBlZFZlcnRpY2VzW3YgKyA5XSwgY2xpcHBlZFZlcnRpY2VzW3YgKyAxMF0sIGNsaXBwZWRWZXJ0aWNlc1t2ICsgMTFdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kYXJrQ29sb3Iuc2V0KDAsIDAsIDAsIDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF92ZXJ0ZXhFZmZlY3QudHJhbnNmb3JtKF90ZW1wUG9zLCBfdGVtcFV2LCBfZmluYWxDb2xvciwgX2RhcmtDb2xvcik7XG5cbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltvZmZzZXRdID0gX3RlbXBQb3MueDsgICAgICAgICAgICAgLy8geFxuICAgICAgICAgICAgICAgICAgICB2YnVmW29mZnNldCArIDFdID0gX3RlbXBQb3MueTsgICAgICAgICAvLyB5XG4gICAgICAgICAgICAgICAgICAgIHZidWZbb2Zmc2V0ICsgMl0gPSBfdGVtcFV2Lng7ICAgICAgICAgIC8vIHVcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltvZmZzZXQgKyAzXSA9IF90ZW1wVXYueTsgICAgICAgICAgLy8gdlxuICAgICAgICAgICAgICAgICAgICB1aW50VkRhdGFbb2Zmc2V0ICsgNF0gPSBfc3BpbmVDb2xvclRvSW50MzIoX2ZpbmFsQ29sb3IpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoX3VzZVRpbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVpbnRWRGF0YVtvZmZzZXQgKyA1XSA9IF9zcGluZUNvbG9yVG9JbnQzMihfZGFya0NvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdiA9IDAsIG4gPSBjbGlwcGVkVmVydGljZXMubGVuZ3RoLCBvZmZzZXQgPSBfdmVydGV4RmxvYXRPZmZzZXQ7IHYgPCBuOyB2ICs9IF9wZXJDbGlwVmVydGV4U2l6ZSwgb2Zmc2V0ICs9IF9wZXJWZXJ0ZXhTaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIHZidWZbb2Zmc2V0XSA9IGNsaXBwZWRWZXJ0aWNlc1t2XTsgICAgICAgICAvLyB4XG4gICAgICAgICAgICAgICAgICAgIHZidWZbb2Zmc2V0ICsgMV0gPSBjbGlwcGVkVmVydGljZXNbdiArIDFdOyAgICAgLy8geVxuICAgICAgICAgICAgICAgICAgICB2YnVmW29mZnNldCArIDJdID0gY2xpcHBlZFZlcnRpY2VzW3YgKyA2XTsgICAgIC8vIHVcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltvZmZzZXQgKyAzXSA9IGNsaXBwZWRWZXJ0aWNlc1t2ICsgN107ICAgICAvLyB2XG5cbiAgICAgICAgICAgICAgICAgICAgX2ZpbmFsQ29sb3IzMiA9ICgoY2xpcHBlZFZlcnRpY2VzW3YgKyA1XSA8PCAyNCkgPj4+IDApICsgKGNsaXBwZWRWZXJ0aWNlc1t2ICsgNF0gPDwgMTYpICsgKGNsaXBwZWRWZXJ0aWNlc1t2ICsgM10gPDwgOCkgKyBjbGlwcGVkVmVydGljZXNbdiArIDJdO1xuICAgICAgICAgICAgICAgICAgICB1aW50VkRhdGFbb2Zmc2V0ICsgNF0gPSBfZmluYWxDb2xvcjMyO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChfdXNlVGludCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2RhcmtDb2xvcjMyID0gKChjbGlwcGVkVmVydGljZXNbdiArIDExXSA8PCAyNCkgPj4+IDApICsgKGNsaXBwZWRWZXJ0aWNlc1t2ICsgMTBdIDw8IDE2KSArIChjbGlwcGVkVmVydGljZXNbdiArIDldIDw8IDgpICsgY2xpcHBlZFZlcnRpY2VzW3YgKyA4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVpbnRWRGF0YVtvZmZzZXQgKyA1XSA9IF9kYXJrQ29sb3IzMjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlYWxUaW1lVHJhdmVyc2Uod29ybGRNYXQpIHtcbiAgICAgICAgbGV0IHZidWY7XG4gICAgICAgIGxldCBpYnVmO1xuXG4gICAgICAgIGxldCBsb2NTa2VsZXRvbiA9IF9jb21wLl9za2VsZXRvbjtcbiAgICAgICAgbGV0IHNrZWxldG9uQ29sb3IgPSBsb2NTa2VsZXRvbi5jb2xvcjtcbiAgICAgICAgbGV0IGdyYXBoaWNzID0gX2NvbXAuX2RlYnVnUmVuZGVyZXI7XG4gICAgICAgIGxldCBjbGlwcGVyID0gX2NvbXAuX2NsaXBwZXI7XG4gICAgICAgIGxldCBtYXRlcmlhbCA9IG51bGw7XG4gICAgICAgIGxldCBhdHRhY2htZW50LCBhdHRhY2htZW50Q29sb3IsIHNsb3RDb2xvciwgdXZzLCB0cmlhbmdsZXM7XG4gICAgICAgIGxldCBpc1JlZ2lvbiwgaXNNZXNoLCBpc0NsaXA7XG4gICAgICAgIGxldCBvZmZzZXRJbmZvO1xuICAgICAgICBsZXQgc2xvdDtcbiAgICAgICAgbGV0IHdvcmxkTWF0bTtcblxuICAgICAgICBfc2xvdFJhbmdlU3RhcnQgPSBfY29tcC5fc3RhcnRTbG90SW5kZXg7XG4gICAgICAgIF9zbG90UmFuZ2VFbmQgPSBfY29tcC5fZW5kU2xvdEluZGV4O1xuICAgICAgICBfaW5SYW5nZSA9IGZhbHNlO1xuICAgICAgICBpZiAoX3Nsb3RSYW5nZVN0YXJ0ID09IC0xKSBfaW5SYW5nZSA9IHRydWU7XG5cbiAgICAgICAgX2RlYnVnU2xvdHMgPSBfY29tcC5kZWJ1Z1Nsb3RzO1xuICAgICAgICBfZGVidWdCb25lcyA9IF9jb21wLmRlYnVnQm9uZXM7XG4gICAgICAgIF9kZWJ1Z01lc2ggPSBfY29tcC5kZWJ1Z01lc2g7XG4gICAgICAgIGlmIChncmFwaGljcyAmJiAoX2RlYnVnQm9uZXMgfHwgX2RlYnVnU2xvdHMgfHwgX2RlYnVnTWVzaCkpIHtcbiAgICAgICAgICAgIGdyYXBoaWNzLmNsZWFyKCk7XG4gICAgICAgICAgICBncmFwaGljcy5saW5lV2lkdGggPSAyO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8geCB5IHUgdiByMSBnMSBiMSBhMSByMiBnMiBiMiBhMiBvciB4IHkgdSB2IHIgZyBiIGEgXG4gICAgICAgIF9wZXJDbGlwVmVydGV4U2l6ZSA9IF91c2VUaW50ID8gMTIgOiA4O1xuXG4gICAgICAgIF92ZXJ0ZXhGbG9hdENvdW50ID0gMDtcbiAgICAgICAgX3ZlcnRleEZsb2F0T2Zmc2V0ID0gMDtcbiAgICAgICAgX3ZlcnRleE9mZnNldCA9IDA7XG4gICAgICAgIF9pbmRleENvdW50ID0gMDtcbiAgICAgICAgX2luZGV4T2Zmc2V0ID0gMDtcbiAgICAgICAgX3JlYWx0aW1lVmVydGljZXMubGVuZ3RoID0gMDtcblxuICAgICAgICBmb3IgKGxldCBzbG90SWR4ID0gMCwgc2xvdENvdW50ID0gbG9jU2tlbGV0b24uZHJhd09yZGVyLmxlbmd0aDsgc2xvdElkeCA8IHNsb3RDb3VudDsgc2xvdElkeCsrKSB7XG4gICAgICAgICAgICBzbG90ID0gbG9jU2tlbGV0b24uZHJhd09yZGVyW3Nsb3RJZHhdO1xuXG4gICAgICAgICAgICBpZiAoc2xvdCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF9zbG90UmFuZ2VTdGFydCA+PSAwICYmIF9zbG90UmFuZ2VTdGFydCA9PSBzbG90LmRhdGEuaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBfaW5SYW5nZSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghX2luUmFuZ2UpIHtcbiAgICAgICAgICAgICAgICBjbGlwcGVyLmNsaXBFbmRXaXRoU2xvdChzbG90KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF9zbG90UmFuZ2VFbmQgPj0gMCAmJiBfc2xvdFJhbmdlRW5kID09IHNsb3QuZGF0YS5pbmRleCkge1xuICAgICAgICAgICAgICAgIF9pblJhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF92ZXJ0ZXhGbG9hdENvdW50ID0gMDtcbiAgICAgICAgICAgIF9pbmRleENvdW50ID0gMDtcbiAgICAgICAgICAgIF9yZWFsdGltZVZlcnRpY2VzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgICAgIGF0dGFjaG1lbnQgPSBzbG90LmdldEF0dGFjaG1lbnQoKTtcbiAgICAgICAgICAgIGlmICghYXR0YWNobWVudCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpc1JlZ2lvbiA9IGF0dGFjaG1lbnQgaW5zdGFuY2VvZiBzcGluZS5SZWdpb25BdHRhY2htZW50O1xuICAgICAgICAgICAgaXNNZXNoID0gYXR0YWNobWVudCBpbnN0YW5jZW9mIHNwaW5lLk1lc2hBdHRhY2htZW50O1xuICAgICAgICAgICAgaXNDbGlwID0gYXR0YWNobWVudCBpbnN0YW5jZW9mIHNwaW5lLkNsaXBwaW5nQXR0YWNobWVudDtcblxuICAgICAgICAgICAgaWYgKGlzQ2xpcCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcFN0YXJ0KHNsb3QsIGF0dGFjaG1lbnQpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWlzUmVnaW9uICYmICFpc01lc2gpIHtcbiAgICAgICAgICAgICAgICBjbGlwcGVyLmNsaXBFbmRXaXRoU2xvdChzbG90KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0ZXJpYWwgPSBfZ2V0U2xvdE1hdGVyaWFsKGF0dGFjaG1lbnQucmVnaW9uLnRleHR1cmUuX3RleHR1cmUsIHNsb3QuZGF0YS5ibGVuZE1vZGUpO1xuICAgICAgICAgICAgaWYgKCFtYXRlcmlhbCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX211c3RGbHVzaCB8fCBtYXRlcmlhbC5nZXRIYXNoKCkgIT09IF9yZW5kZXJlci5tYXRlcmlhbC5nZXRIYXNoKCkpIHtcbiAgICAgICAgICAgICAgICBfbXVzdEZsdXNoID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgX3JlbmRlcmVyLl9mbHVzaCgpO1xuICAgICAgICAgICAgICAgIF9yZW5kZXJlci5ub2RlID0gX25vZGU7XG4gICAgICAgICAgICAgICAgX3JlbmRlcmVyLm1hdGVyaWFsID0gbWF0ZXJpYWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpc1JlZ2lvbikge1xuXG4gICAgICAgICAgICAgICAgdHJpYW5nbGVzID0gX3F1YWRUcmlhbmdsZXM7XG5cbiAgICAgICAgICAgICAgICAvLyBpbnN1cmUgY2FwYWNpdHlcbiAgICAgICAgICAgICAgICBfdmVydGV4RmxvYXRDb3VudCA9IDQgKiBfcGVyVmVydGV4U2l6ZTtcbiAgICAgICAgICAgICAgICBfaW5kZXhDb3VudCA9IDY7XG5cbiAgICAgICAgICAgICAgICBvZmZzZXRJbmZvID0gX2J1ZmZlci5yZXF1ZXN0KDQsIDYpO1xuICAgICAgICAgICAgICAgIF9pbmRleE9mZnNldCA9IG9mZnNldEluZm8uaW5kaWNlT2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICBfdmVydGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby52ZXJ0ZXhPZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgIF92ZXJ0ZXhGbG9hdE9mZnNldCA9IG9mZnNldEluZm8uYnl0ZU9mZnNldCA+PiAyO1xuICAgICAgICAgICAgICAgIHZidWYgPSBfYnVmZmVyLl92RGF0YSxcbiAgICAgICAgICAgICAgICAgICAgaWJ1ZiA9IF9idWZmZXIuX2lEYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8gY29tcHV0ZSB2ZXJ0ZXggYW5kIGZpbGwgeCB5XG4gICAgICAgICAgICAgICAgLy8gYXR0YWNobWVudC5jb21wdXRlV29ybGRWZXJ0aWNlcyhzbG90LmJvbmUsIHZidWYsIF92ZXJ0ZXhGbG9hdE9mZnNldCwgX3BlclZlcnRleFNpemUpO1xuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnQuY29tcHV0ZVdvcmxkVmVydGljZXMoc2xvdC5ib25lLCBfcmVhbHRpbWVWZXJ0aWNlcywgMCwgX3JlYWx0aW1lU2l6ZVBlclZlcnRleCk7XG5cbiAgICAgICAgICAgICAgICAvL+WwhuatpHNsb3TnmoTpobbngrnlhpnlhaXnvJPlrZjljLpcbiAgICAgICAgICAgICAgICB0aGlzLl93cml0ZVZlcnRleDJUb1ZlcnRleDNCdWZmZXIoX3JlYWx0aW1lVmVydGljZXMsIHZidWYsIF92ZXJ0ZXhGbG9hdE9mZnNldCwgNCwgc2xvdElkeCk7XG5cbiAgICAgICAgICAgICAgICAvLyBkcmF3IGRlYnVnIHNsb3RzIGlmIGVuYWJsZWQgZ3JhcGhpY3NcbiAgICAgICAgICAgICAgICBpZiAoZ3JhcGhpY3MgJiYgX2RlYnVnU2xvdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3Muc3Ryb2tlQ29sb3IgPSBfc2xvdENvbG9yO1xuICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5tb3ZlVG8odmJ1ZltfdmVydGV4RmxvYXRPZmZzZXRdLCB2YnVmW192ZXJ0ZXhGbG9hdE9mZnNldCArIDFdKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaWkgPSBfdmVydGV4RmxvYXRPZmZzZXQgKyBfcGVyVmVydGV4U2l6ZSwgbm4gPSBfdmVydGV4RmxvYXRPZmZzZXQgKyBfdmVydGV4RmxvYXRDb3VudDsgaWkgPCBubjsgaWkgKz0gX3BlclZlcnRleFNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLmxpbmVUbyh2YnVmW2lpXSwgdmJ1ZltpaSArIDFdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5zdHJva2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc01lc2gpIHtcblxuICAgICAgICAgICAgICAgIHRyaWFuZ2xlcyA9IGF0dGFjaG1lbnQudHJpYW5nbGVzO1xuXG4gICAgICAgICAgICAgICAgLy8gaW5zdXJlIGNhcGFjaXR5XG4gICAgICAgICAgICAgICAgX3ZlcnRleEZsb2F0Q291bnQgPSAoYXR0YWNobWVudC53b3JsZFZlcnRpY2VzTGVuZ3RoID4+IDEpICogX3BlclZlcnRleFNpemU7XG4gICAgICAgICAgICAgICAgX2luZGV4Q291bnQgPSB0cmlhbmdsZXMubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgb2Zmc2V0SW5mbyA9IF9idWZmZXIucmVxdWVzdChfdmVydGV4RmxvYXRDb3VudCAvIF9wZXJWZXJ0ZXhTaXplLCBfaW5kZXhDb3VudCk7XG4gICAgICAgICAgICAgICAgX2luZGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby5pbmRpY2VPZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgIF92ZXJ0ZXhPZmZzZXQgPSBvZmZzZXRJbmZvLnZlcnRleE9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgX3ZlcnRleEZsb2F0T2Zmc2V0ID0gb2Zmc2V0SW5mby5ieXRlT2Zmc2V0ID4+IDI7XG4gICAgICAgICAgICAgICAgdmJ1ZiA9IF9idWZmZXIuX3ZEYXRhLFxuICAgICAgICAgICAgICAgICAgICBpYnVmID0gX2J1ZmZlci5faURhdGE7XG5cbiAgICAgICAgICAgICAgICAvLyBjb21wdXRlIHZlcnRleCBhbmQgZmlsbCB4IHlcbiAgICAgICAgICAgICAgICAvLyBhdHRhY2htZW50LmNvbXB1dGVXb3JsZFZlcnRpY2VzKHNsb3QsIDAsIGF0dGFjaG1lbnQud29ybGRWZXJ0aWNlc0xlbmd0aCwgdmJ1ZiwgX3ZlcnRleEZsb2F0T2Zmc2V0LCBfcGVyVmVydGV4U2l6ZSk7XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudC5jb21wdXRlV29ybGRWZXJ0aWNlcyhzbG90LCAwLCBhdHRhY2htZW50LndvcmxkVmVydGljZXNMZW5ndGgsIF9yZWFsdGltZVZlcnRpY2VzLCAwLCBfcmVhbHRpbWVTaXplUGVyVmVydGV4KTtcblxuICAgICAgICAgICAgICAgIC8v5bCG5q2kc2xvdOeahOmhtueCueWGmeWFpee8k+WtmOWMulxuICAgICAgICAgICAgICAgIHRoaXMuX3dyaXRlVmVydGV4MlRvVmVydGV4M0J1ZmZlcihfcmVhbHRpbWVWZXJ0aWNlcywgdmJ1ZiwgX3ZlcnRleEZsb2F0T2Zmc2V0LCBfdmVydGV4RmxvYXRDb3VudCAvIF9wZXJWZXJ0ZXhTaXplLCBzbG90SWR4KTtcblxuICAgICAgICAgICAgICAgIC8vIGRyYXcgZGVidWcgbWVzaCBpZiBlbmFibGVkIGdyYXBoaWNzXG4gICAgICAgICAgICAgICAgaWYgKGdyYXBoaWNzICYmIF9kZWJ1Z01lc2gpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3Muc3Ryb2tlQ29sb3IgPSBfbWVzaENvbG9yO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGlpID0gMCwgbm4gPSB0cmlhbmdsZXMubGVuZ3RoOyBpaSA8IG5uOyBpaSArPSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdjEgPSB0cmlhbmdsZXNbaWldICogX3BlclZlcnRleFNpemUgKyBfdmVydGV4RmxvYXRPZmZzZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdjIgPSB0cmlhbmdsZXNbaWkgKyAxXSAqIF9wZXJWZXJ0ZXhTaXplICsgX3ZlcnRleEZsb2F0T2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHYzID0gdHJpYW5nbGVzW2lpICsgMl0gKiBfcGVyVmVydGV4U2l6ZSArIF92ZXJ0ZXhGbG9hdE9mZnNldDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MubW92ZVRvKHZidWZbdjFdLCB2YnVmW3YxICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MubGluZVRvKHZidWZbdjJdLCB2YnVmW3YyICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MubGluZVRvKHZidWZbdjNdLCB2YnVmW3YzICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLnN0cm9rZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX3ZlcnRleEZsb2F0Q291bnQgPT0gMCB8fCBfaW5kZXhDb3VudCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgY2xpcHBlci5jbGlwRW5kV2l0aFNsb3Qoc2xvdCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGZpbGwgaW5kaWNlc1xuICAgICAgICAgICAgaWJ1Zi5zZXQodHJpYW5nbGVzLCBfaW5kZXhPZmZzZXQpO1xuXG4gICAgICAgICAgICAvLyBmaWxsIHUgdlxuICAgICAgICAgICAgdXZzID0gYXR0YWNobWVudC51dnM7XG4gICAgICAgICAgICBmb3IgKGxldCB2ID0gX3ZlcnRleEZsb2F0T2Zmc2V0LCBuID0gX3ZlcnRleEZsb2F0T2Zmc2V0ICsgX3ZlcnRleEZsb2F0Q291bnQsIHUgPSAwOyB2IDwgbjsgdiArPSBfcGVyVmVydGV4U2l6ZSwgdSArPSAyKSB7XG4gICAgICAgICAgICAgICAgdmJ1Zlt2ICsgM10gPSB1dnNbdV07ICAgICAgICAgICAvLyB1XG4gICAgICAgICAgICAgICAgdmJ1Zlt2ICsgNF0gPSB1dnNbdSArIDFdOyAgICAgICAvLyB2XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF0dGFjaG1lbnRDb2xvciA9IGF0dGFjaG1lbnQuY29sb3IsXG4gICAgICAgICAgICAgICAgc2xvdENvbG9yID0gc2xvdC5jb2xvcjtcblxuICAgICAgICAgICAgdGhpcy5maWxsVmVydGljZXMoc2tlbGV0b25Db2xvciwgYXR0YWNobWVudENvbG9yLCBzbG90Q29sb3IsIGNsaXBwZXIsIHNsb3QsIHNsb3RJZHgpO1xuXG4gICAgICAgICAgICAvLyByZXNldCBidWZmZXIgcG9pbnRlciwgYmVjYXVzZSBjbGlwcGVyIG1heWJlIHJlYWxsb2MgYSBuZXcgYnVmZmVyIGluIGZpbGUgVmVydGljZXMgZnVuY3Rpb24uXG4gICAgICAgICAgICB2YnVmID0gX2J1ZmZlci5fdkRhdGEsXG4gICAgICAgICAgICAgICAgaWJ1ZiA9IF9idWZmZXIuX2lEYXRhO1xuXG4gICAgICAgICAgICBpZiAoX2luZGV4Q291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaWkgPSBfaW5kZXhPZmZzZXQsIG5uID0gX2luZGV4T2Zmc2V0ICsgX2luZGV4Q291bnQ7IGlpIDwgbm47IGlpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWJ1ZltpaV0gKz0gX3ZlcnRleE9mZnNldDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAod29ybGRNYXQpIHtcbiAgICAgICAgICAgICAgICAgICAgd29ybGRNYXRtID0gd29ybGRNYXQubTtcbiAgICAgICAgICAgICAgICAgICAgX20wMCA9IHdvcmxkTWF0bVswXTtcbiAgICAgICAgICAgICAgICAgICAgX20wNCA9IHdvcmxkTWF0bVs0XTtcbiAgICAgICAgICAgICAgICAgICAgX20xMiA9IHdvcmxkTWF0bVsxMl07XG4gICAgICAgICAgICAgICAgICAgIF9tMDEgPSB3b3JsZE1hdG1bMV07XG4gICAgICAgICAgICAgICAgICAgIF9tMDUgPSB3b3JsZE1hdG1bNV07XG4gICAgICAgICAgICAgICAgICAgIF9tMTMgPSB3b3JsZE1hdG1bMTNdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpaSA9IF92ZXJ0ZXhGbG9hdE9mZnNldCwgbm4gPSBfdmVydGV4RmxvYXRPZmZzZXQgKyBfdmVydGV4RmxvYXRDb3VudDsgaWkgPCBubjsgaWkgKz0gX3BlclZlcnRleFNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF94ID0gdmJ1ZltpaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBfeSA9IHZidWZbaWkgKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZidWZbaWldID0gX3ggKiBfbTAwICsgX3kgKiBfbTA0ICsgX20xMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZidWZbaWkgKyAxXSA9IF94ICogX20wMSArIF95ICogX20wNSArIF9tMTM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX2J1ZmZlci5hZGp1c3QoX3ZlcnRleEZsb2F0Q291bnQgLyBfcGVyVmVydGV4U2l6ZSwgX2luZGV4Q291bnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjbGlwcGVyLmNsaXBFbmRXaXRoU2xvdChzbG90KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNsaXBwZXIuY2xpcEVuZCgpO1xuXG4gICAgICAgIGlmIChncmFwaGljcyAmJiBfZGVidWdCb25lcykge1xuICAgICAgICAgICAgbGV0IGJvbmU7XG4gICAgICAgICAgICBncmFwaGljcy5zdHJva2VDb2xvciA9IF9ib25lQ29sb3I7XG4gICAgICAgICAgICBncmFwaGljcy5maWxsQ29sb3IgPSBfc2xvdENvbG9yOyAvLyBSb290IGJvbmUgY29sb3IgaXMgc2FtZSBhcyBzbG90IGNvbG9yLlxuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IGxvY1NrZWxldG9uLmJvbmVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgICAgIGJvbmUgPSBsb2NTa2VsZXRvbi5ib25lc1tpXTtcbiAgICAgICAgICAgICAgICBsZXQgeCA9IGJvbmUuZGF0YS5sZW5ndGggKiBib25lLmEgKyBib25lLndvcmxkWDtcbiAgICAgICAgICAgICAgICBsZXQgeSA9IGJvbmUuZGF0YS5sZW5ndGggKiBib25lLmMgKyBib25lLndvcmxkWTtcblxuICAgICAgICAgICAgICAgIC8vIEJvbmUgbGVuZ3Rocy5cbiAgICAgICAgICAgICAgICBncmFwaGljcy5tb3ZlVG8oYm9uZS53b3JsZFgsIGJvbmUud29ybGRZKTtcbiAgICAgICAgICAgICAgICBncmFwaGljcy5saW5lVG8oeCwgeSk7XG4gICAgICAgICAgICAgICAgZ3JhcGhpY3Muc3Ryb2tlKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBCb25lIG9yaWdpbnMuXG4gICAgICAgICAgICAgICAgZ3JhcGhpY3MuY2lyY2xlKGJvbmUud29ybGRYLCBib25lLndvcmxkWSwgTWF0aC5QSSAqIDEuNSk7XG4gICAgICAgICAgICAgICAgZ3JhcGhpY3MuZmlsbCgpO1xuICAgICAgICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLmZpbGxDb2xvciA9IF9vcmlnaW5Db2xvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfd3JpdGVWZXJ0ZXgyVG9WZXJ0ZXgzQnVmZmVyKHZlcnRleDJBcnJheSwgdmVydGV4M0J1ZmZlciwgb2Zmc2V0LCB2ZXJ0ZXhDb3VudCwgc2xvdElkeCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZlcnRleENvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGxldCBkc3RPZmZzZXQgPSBpICogX3BlclZlcnRleFNpemUgKyBvZmZzZXQ7XG4gICAgICAgICAgICBsZXQgc3JjT2Zmc2V0ID0gaSAqIF9yZWFsdGltZVNpemVQZXJWZXJ0ZXg7XG5cbiAgICAgICAgICAgIHZlcnRleDNCdWZmZXJbZHN0T2Zmc2V0XSA9IHZlcnRleDJBcnJheVtzcmNPZmZzZXRdOyAgICAgICAgIC8veFxuICAgICAgICAgICAgdmVydGV4M0J1ZmZlcltkc3RPZmZzZXQgKyAxXSA9IHZlcnRleDJBcnJheVtzcmNPZmZzZXQgKyAxXTsgLy95XG4gICAgICAgICAgICB2ZXJ0ZXgzQnVmZmVyW2RzdE9mZnNldCArIDJdID0gX2RlcHRoIC0gREVQVEhfUkFURSAqIHNsb3RJZHg7ICAgICAgICAgIC8velxuICAgICAgICAgICAgdmVydGV4M0J1ZmZlcltkc3RPZmZzZXQgKyAzXSA9IHZlcnRleDJBcnJheVtzcmNPZmZzZXQgKyAyXTsgLy91XG4gICAgICAgICAgICB2ZXJ0ZXgzQnVmZmVyW2RzdE9mZnNldCArIDRdID0gdmVydGV4MkFycmF5W3NyY09mZnNldCArIDNdOyAvL3ZcbiAgICAgICAgICAgIHZlcnRleDNCdWZmZXJbZHN0T2Zmc2V0ICsgNV0gPSB2ZXJ0ZXgyQXJyYXlbc3JjT2Zmc2V0ICsgNF07IC8vYzFcbiAgICAgICAgICAgIGlmIChfdXNlVGludCkge1xuICAgICAgICAgICAgICAgIHZlcnRleDNCdWZmZXJbZHN0T2Zmc2V0ICsgNl0gPSB2ZXJ0ZXgyQXJyYXlbc3JjT2Zmc2V0ICsgNV07IC8vYzJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNhY2hlVHJhdmVyc2Uod29ybGRNYXQpIHtcblxuICAgICAgICBsZXQgZnJhbWUgPSBfY29tcC5fY3VyRnJhbWU7XG4gICAgICAgIGlmICghZnJhbWUpIHJldHVybjtcblxuICAgICAgICBsZXQgc2VnbWVudHMgPSBmcmFtZS5zZWdtZW50cztcbiAgICAgICAgaWYgKHNlZ21lbnRzLmxlbmd0aCA9PSAwKSByZXR1cm47XG5cbiAgICAgICAgbGV0IG9mZnNldHMgPSBmcmFtZS5vZmZzZXRzO1xuXG4gICAgICAgIGxldCB2YnVmLCBpYnVmLCB1aW50YnVmO1xuICAgICAgICBsZXQgbWF0ZXJpYWw7XG4gICAgICAgIGxldCBvZmZzZXRJbmZvO1xuICAgICAgICBsZXQgdmVydGljZXMgPSBmcmFtZS52ZXJ0aWNlcztcbiAgICAgICAgbGV0IGluZGljZXMgPSBmcmFtZS5pbmRpY2VzO1xuICAgICAgICBsZXQgd29ybGRNYXRtO1xuXG4gICAgICAgIGxldCBmcmFtZVZGT2Zmc2V0ID0gMCwgZnJhbWVJbmRleE9mZnNldCA9IDAsIHNlZ1ZGQ291bnQgPSAwO1xuICAgICAgICBpZiAod29ybGRNYXQpIHtcbiAgICAgICAgICAgIHdvcmxkTWF0bSA9IHdvcmxkTWF0Lm07XG4gICAgICAgICAgICBfbTAwID0gd29ybGRNYXRtWzBdO1xuICAgICAgICAgICAgX20wMSA9IHdvcmxkTWF0bVsxXTtcbiAgICAgICAgICAgIF9tMDQgPSB3b3JsZE1hdG1bNF07XG4gICAgICAgICAgICBfbTA1ID0gd29ybGRNYXRtWzVdO1xuICAgICAgICAgICAgX20xMiA9IHdvcmxkTWF0bVsxMl07XG4gICAgICAgICAgICBfbTEzID0gd29ybGRNYXRtWzEzXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBqdXN0VHJhbnNsYXRlID0gX20wMCA9PT0gMSAmJiBfbTAxID09PSAwICYmIF9tMDQgPT09IDAgJiYgX20wNSA9PT0gMTtcbiAgICAgICAgbGV0IG5lZWRCYXRjaCA9IChfaGFuZGxlVmFsICYgRkxBR19CQVRDSCk7XG4gICAgICAgIGxldCBjYWxjVHJhbnNsYXRlID0gbmVlZEJhdGNoICYmIGp1c3RUcmFuc2xhdGU7XG5cbiAgICAgICAgbGV0IGNvbG9yT2Zmc2V0ID0gMDtcbiAgICAgICAgbGV0IGNvbG9ycyA9IGZyYW1lLmNvbG9ycztcbiAgICAgICAgbGV0IG5vd0NvbG9yID0gY29sb3JzW2NvbG9yT2Zmc2V0KytdO1xuICAgICAgICBsZXQgbWF4VkZPZmZzZXQgPSBub3dDb2xvci52Zk9mZnNldDtcbiAgICAgICAgX2hhbmRsZUNvbG9yKG5vd0NvbG9yKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IHNlZ21lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgbGV0IHNlZ0luZm8gPSBzZWdtZW50c1tpXTtcbiAgICAgICAgICAgIG1hdGVyaWFsID0gX2dldFNsb3RNYXRlcmlhbChzZWdJbmZvLnRleCwgc2VnSW5mby5ibGVuZE1vZGUpO1xuICAgICAgICAgICAgaWYgKCFtYXRlcmlhbCkgY29udGludWU7XG5cbiAgICAgICAgICAgIGlmIChfbXVzdEZsdXNoIHx8IG1hdGVyaWFsLmdldEhhc2goKSAhPT0gX3JlbmRlcmVyLm1hdGVyaWFsLmdldEhhc2goKSkge1xuICAgICAgICAgICAgICAgIF9tdXN0Rmx1c2ggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBfcmVuZGVyZXIuX2ZsdXNoKCk7XG4gICAgICAgICAgICAgICAgX3JlbmRlcmVyLm5vZGUgPSBfbm9kZTtcbiAgICAgICAgICAgICAgICBfcmVuZGVyZXIubWF0ZXJpYWwgPSBtYXRlcmlhbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX3ZlcnRleENvdW50ID0gc2VnSW5mby52ZXJ0ZXhDb3VudDtcbiAgICAgICAgICAgIF9pbmRleENvdW50ID0gc2VnSW5mby5pbmRleENvdW50O1xuXG4gICAgICAgICAgICBvZmZzZXRJbmZvID0gX2J1ZmZlci5yZXF1ZXN0KF92ZXJ0ZXhDb3VudCwgX2luZGV4Q291bnQpO1xuICAgICAgICAgICAgX2luZGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby5pbmRpY2VPZmZzZXQ7XG4gICAgICAgICAgICBfdmVydGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby52ZXJ0ZXhPZmZzZXQ7XG4gICAgICAgICAgICBfdmZPZmZzZXQgPSBvZmZzZXRJbmZvLmJ5dGVPZmZzZXQgPj4gMjtcbiAgICAgICAgICAgIHZidWYgPSBfYnVmZmVyLl92RGF0YTtcbiAgICAgICAgICAgIGlidWYgPSBfYnVmZmVyLl9pRGF0YTtcbiAgICAgICAgICAgIHVpbnRidWYgPSBfYnVmZmVyLl91aW50VkRhdGE7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGlpID0gX2luZGV4T2Zmc2V0LCBpbCA9IF9pbmRleE9mZnNldCArIF9pbmRleENvdW50OyBpaSA8IGlsOyBpaSsrKSB7XG4gICAgICAgICAgICAgICAgaWJ1ZltpaV0gPSBfdmVydGV4T2Zmc2V0ICsgaW5kaWNlc1tmcmFtZUluZGV4T2Zmc2V0KytdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWdWRkNvdW50ID0gc2VnSW5mby52ZkNvdW50O1xuICAgICAgICAgICAgbGV0IHJlbmRlclZlcnRleENvdW50ID0gX3ZlcnRleENvdW50ICogX3BlclZlcnRleFNpemU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IF92ZXJ0ZXhDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRzdE9mZnNldCA9IF92Zk9mZnNldCArIGkgKiA3O1xuICAgICAgICAgICAgICAgIGxldCBzcmNPZmZzZXQgPSBmcmFtZVZGT2Zmc2V0ICsgaSAqIDY7XG5cbiAgICAgICAgICAgICAgICB2YnVmW2RzdE9mZnNldF0gPSB2ZXJ0aWNlc1tzcmNPZmZzZXRdO1xuICAgICAgICAgICAgICAgIHZidWZbZHN0T2Zmc2V0ICsgMV0gPSB2ZXJ0aWNlc1tzcmNPZmZzZXQgKyAxXTtcbiAgICAgICAgICAgICAgICBsZXQgaiwgbGVuO1xuICAgICAgICAgICAgICAgIGZvciAoaiA9IDAsIGxlbiA9IG9mZnNldHMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNyY09mZnNldCA8PSBvZmZzZXRzW2pdKSBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmJ1Zltkc3RPZmZzZXQgKyAyXSA9IF9kZXB0aCAtIERFUFRIX1JBVEUgKiBqOyAgIC8vdG9kbyBkZXB0aCArIOiHquW3sea3seW6plxuICAgICAgICAgICAgICAgIHZidWZbZHN0T2Zmc2V0ICsgM10gPSB2ZXJ0aWNlc1tzcmNPZmZzZXQgKyAyXTtcbiAgICAgICAgICAgICAgICB2YnVmW2RzdE9mZnNldCArIDRdID0gdmVydGljZXNbc3JjT2Zmc2V0ICsgM107XG4gICAgICAgICAgICAgICAgdmJ1Zltkc3RPZmZzZXQgKyA1XSA9IHZlcnRpY2VzW3NyY09mZnNldCArIDRdO1xuICAgICAgICAgICAgICAgIHZidWZbZHN0T2Zmc2V0ICsgNl0gPSB2ZXJ0aWNlc1tzcmNPZmZzZXQgKyA1XTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdmJ1Zi5zZXQodmVydGljZXMuc3ViYXJyYXkoZnJhbWVWRk9mZnNldCwgZnJhbWVWRk9mZnNldCArIHNlZ1ZGQ291bnQpLCBfdmZPZmZzZXQpO1xuICAgICAgICAgICAgZnJhbWVWRk9mZnNldCArPSBzZWdWRkNvdW50O1xuXG4gICAgICAgICAgICBpZiAoY2FsY1RyYW5zbGF0ZSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGlpID0gX3ZmT2Zmc2V0LCBpbCA9IF92Zk9mZnNldCArIHJlbmRlclZlcnRleENvdW50OyBpaSA8IGlsOyBpaSArPSA3KSB7XG4gICAgICAgICAgICAgICAgICAgIHZidWZbaWldICs9IF9tMTI7XG4gICAgICAgICAgICAgICAgICAgIHZidWZbaWkgKyAxXSArPSBfbTEzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobmVlZEJhdGNoKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaWkgPSBfdmZPZmZzZXQsIGlsID0gX3ZmT2Zmc2V0ICsgcmVuZGVyVmVydGV4Q291bnQ7IGlpIDwgaWw7IGlpICs9IDcpIHtcbiAgICAgICAgICAgICAgICAgICAgX3ggPSB2YnVmW2lpXTtcbiAgICAgICAgICAgICAgICAgICAgX3kgPSB2YnVmW2lpICsgMV07XG4gICAgICAgICAgICAgICAgICAgIHZidWZbaWldID0gX3ggKiBfbTAwICsgX3kgKiBfbTA0ICsgX20xMjtcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltpaSArIDFdID0gX3ggKiBfbTAxICsgX3kgKiBfbTA1ICsgX20xMztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF9idWZmZXIuYWRqdXN0KF92ZXJ0ZXhDb3VudCwgX2luZGV4Q291bnQpO1xuICAgICAgICAgICAgaWYgKCFfbmVlZENvbG9yKSBjb250aW51ZTtcblxuICAgICAgICAgICAgLy8gaGFuZGxlIGNvbG9yXG4gICAgICAgICAgICBsZXQgZnJhbWVDb2xvck9mZnNldCA9IGZyYW1lVkZPZmZzZXQgLSBzZWdWRkNvdW50O1xuICAgICAgICAgICAgZm9yIChsZXQgaWkgPSBfdmZPZmZzZXQgKyA1LCBpbCA9IF92Zk9mZnNldCArIDUgKyBzZWdWRkNvdW50OyBpaSA8IGlsOyBpaSArPSA3LCBmcmFtZUNvbG9yT2Zmc2V0ICs9IDYpIHtcbiAgICAgICAgICAgICAgICBpZiAoZnJhbWVDb2xvck9mZnNldCA+PSBtYXhWRk9mZnNldCkge1xuICAgICAgICAgICAgICAgICAgICBub3dDb2xvciA9IGNvbG9yc1tjb2xvck9mZnNldCsrXTtcbiAgICAgICAgICAgICAgICAgICAgX2hhbmRsZUNvbG9yKG5vd0NvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgbWF4VkZPZmZzZXQgPSBub3dDb2xvci52Zk9mZnNldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdWludGJ1ZltpaV0gPSBfZmluYWxDb2xvcjMyO1xuICAgICAgICAgICAgICAgIHVpbnRidWZbaWkgKyAxXSA9IF9kYXJrQ29sb3IzMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbGxCdWZmZXJzKGNvbXAsIHJlbmRlcmVyKSB7XG5cbiAgICAgICAgbGV0IG5vZGUgPSBjb21wLm5vZGU7XG4gICAgICAgIG5vZGUuX3JlbmRlckZsYWcgfD0gUmVuZGVyRmxvdy5GTEFHX1VQREFURV9SRU5ERVJfREFUQTtcbiAgICAgICAgaWYgKCFjb21wLl9za2VsZXRvbikgcmV0dXJuO1xuXG4gICAgICAgIGxldCBub2RlQ29sb3IgPSBub2RlLl9jb2xvcjtcbiAgICAgICAgX25vZGVSID0gbm9kZUNvbG9yLnIgLyAyNTU7XG4gICAgICAgIF9ub2RlRyA9IG5vZGVDb2xvci5nIC8gMjU1O1xuICAgICAgICBfbm9kZUIgPSBub2RlQ29sb3IuYiAvIDI1NTtcbiAgICAgICAgX25vZGVBID0gbm9kZUNvbG9yLmEgLyAyNTU7XG5cbiAgICAgICAgX3VzZVRpbnQgPSBjb21wLnVzZVRpbnQgfHwgY29tcC5pc0FuaW1hdGlvbkNhY2hlZCgpO1xuICAgICAgICBfdmVydGV4Rm9ybWF0ID0gX3VzZVRpbnQgPyBWRlR3b0NvbG9yIDogVkZPbmVDb2xvcjtcbiAgICAgICAgLy8geCB5IHogdSB2IGNvbG9yMSBjb2xvcjIgb3IgeCB5IHUgdiBjb2xvclxuICAgICAgICBfcGVyVmVydGV4U2l6ZSA9IF91c2VUaW50ID8gNyA6IDY7XG4gICAgICAgIF9yZWFsdGltZVNpemVQZXJWZXJ0ZXggPSBfdXNlVGludCA/IDYgOiA1O1xuXG4gICAgICAgIF9ub2RlID0gY29tcC5ub2RlO1xuICAgICAgICBfYnVmZmVyID0gcmVuZGVyZXIuZ2V0QnVmZmVyKCdzcGluZScsIF92ZXJ0ZXhGb3JtYXQpO1xuICAgICAgICBfcmVuZGVyZXIgPSByZW5kZXJlcjtcbiAgICAgICAgX2NvbXAgPSBjb21wO1xuICAgICAgICBfZGVwdGggPSBfbm9kZS5kZXB0aCB8fCAwO1xuXG4gICAgICAgIF9tdXN0Rmx1c2ggPSB0cnVlO1xuICAgICAgICBfcHJlbXVsdGlwbGllZEFscGhhID0gY29tcC5wcmVtdWx0aXBsaWVkQWxwaGE7XG4gICAgICAgIF9tdWx0aXBsaWVyID0gMS4wO1xuICAgICAgICBfaGFuZGxlVmFsID0gMHgwMDtcbiAgICAgICAgX25lZWRDb2xvciA9IGZhbHNlO1xuICAgICAgICBfdmVydGV4RWZmZWN0ID0gY29tcC5fZWZmZWN0RGVsZWdhdGUgJiYgY29tcC5fZWZmZWN0RGVsZWdhdGUuX3ZlcnRleEVmZmVjdDtcblxuICAgICAgICBpZiAobm9kZUNvbG9yLl92YWwgIT09IDB4ZmZmZmZmZmYgfHwgX3ByZW11bHRpcGxpZWRBbHBoYSkge1xuICAgICAgICAgICAgX25lZWRDb2xvciA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3VzZVRpbnQpIHtcbiAgICAgICAgICAgIF9oYW5kbGVWYWwgfD0gRkxBR19UV09fQ09MT1I7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgd29ybGRNYXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChfY29tcC5lbmFibGVCYXRjaCkge1xuICAgICAgICAgICAgd29ybGRNYXQgPSBfbm9kZS5fd29ybGRNYXRyaXg7XG4gICAgICAgICAgICBfbXVzdEZsdXNoID0gZmFsc2U7XG4gICAgICAgICAgICBfaGFuZGxlVmFsIHw9IEZMQUdfQkFUQ0g7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29tcC5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICAvLyBUcmF2ZXJzZSBpbnB1dCBhc3NlbWJsZXIuXG4gICAgICAgICAgICB0aGlzLmNhY2hlVHJhdmVyc2Uod29ybGRNYXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF92ZXJ0ZXhFZmZlY3QpIF92ZXJ0ZXhFZmZlY3QuYmVnaW4oY29tcC5fc2tlbGV0b24pO1xuICAgICAgICAgICAgdGhpcy5yZWFsVGltZVRyYXZlcnNlKHdvcmxkTWF0KTtcbiAgICAgICAgICAgIGlmIChfdmVydGV4RWZmZWN0KSBfdmVydGV4RWZmZWN0LmVuZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc3luYyBhdHRhY2hlZCBub2RlIG1hdHJpeFxuICAgICAgICByZW5kZXJlci53b3JsZE1hdERpcnR5Kys7XG4gICAgICAgIGNvbXAuYXR0YWNoVXRpbC5fc3luY0F0dGFjaGVkTm9kZSgpO1xuXG4gICAgICAgIC8vIENsZWFyIHRlbXAgdmFyLlxuICAgICAgICBfbm9kZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgX2J1ZmZlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgX3JlbmRlcmVyID0gdW5kZWZpbmVkO1xuICAgICAgICBfY29tcCA9IHVuZGVmaW5lZDtcbiAgICAgICAgX3ZlcnRleEVmZmVjdCA9IG51bGw7XG4gICAgfVxuXG4gICAgcG9zdEZpbGxCdWZmZXJzKGNvbXAsIHJlbmRlcmVyKSB7XG4gICAgICAgIHJlbmRlcmVyLndvcmxkTWF0RGlydHktLTtcbiAgICB9XG59XG5cbkFzc2VtYmxlci5yZWdpc3RlcihTa2VsZXRvbiwgU3BpbmVBc3NlbWJsZXIpO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=