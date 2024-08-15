
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

    if (cc.sys.os == cc.sys.OS_IOS) {
      DEPTH_RATE = 1e-6;
    }

    console.log('update DEPTH_RATE', DEPTH_RATE, cc.sys.os);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvZXh0ZW5zaW9ucy9zcGluZS9zcGluZS1hc3NlbWJsZXIuanMiXSwibmFtZXMiOlsiU2tlbGV0b24iLCJyZXF1aXJlIiwic3BpbmUiLCJSZW5kZXJGbG93IiwiVmVydGV4Rm9ybWF0IiwiVkZPbmVDb2xvciIsInZmbXQzRCIsIlZGVHdvQ29sb3IiLCJ2Zm10UG9zM1V2VHdvQ29sb3IiLCJnZngiLCJjYyIsIkZMQUdfQkFUQ0giLCJGTEFHX1RXT19DT0xPUiIsIl9oYW5kbGVWYWwiLCJfcXVhZFRyaWFuZ2xlcyIsIl9zbG90Q29sb3IiLCJjb2xvciIsIl9ib25lQ29sb3IiLCJfb3JpZ2luQ29sb3IiLCJfbWVzaENvbG9yIiwiX2ZpbmFsQ29sb3IiLCJfZGFya0NvbG9yIiwiX3RlbXBQb3MiLCJfdGVtcFV2IiwiQ0NfTkFUSVZFUkVOREVSRVIiLCJDb2xvciIsIlZlY3RvcjIiLCJfcHJlbXVsdGlwbGllZEFscGhhIiwiX211bHRpcGxpZXIiLCJfc2xvdFJhbmdlU3RhcnQiLCJfc2xvdFJhbmdlRW5kIiwiX3VzZVRpbnQiLCJfZGVidWdTbG90cyIsIl9kZWJ1Z0JvbmVzIiwiX2RlYnVnTWVzaCIsIl9ub2RlUiIsIl9ub2RlRyIsIl9ub2RlQiIsIl9ub2RlQSIsIl9maW5hbENvbG9yMzIiLCJfZGFya0NvbG9yMzIiLCJfdmVydGV4Rm9ybWF0IiwiX3BlclZlcnRleFNpemUiLCJfcGVyQ2xpcFZlcnRleFNpemUiLCJfdmVydGV4RmxvYXRDb3VudCIsIl92ZXJ0ZXhDb3VudCIsIl92ZXJ0ZXhGbG9hdE9mZnNldCIsIl92ZXJ0ZXhPZmZzZXQiLCJfaW5kZXhDb3VudCIsIl9pbmRleE9mZnNldCIsIl92Zk9mZnNldCIsIl90ZW1wciIsIl90ZW1wZyIsIl90ZW1wYiIsIl9pblJhbmdlIiwiX211c3RGbHVzaCIsIl94IiwiX3kiLCJfbTAwIiwiX20wNCIsIl9tMTIiLCJfbTAxIiwiX20wNSIsIl9tMTMiLCJfciIsIl9nIiwiX2IiLCJfZnIiLCJfZmciLCJfZmIiLCJfZmEiLCJfZHIiLCJfZGciLCJfZGIiLCJfZGEiLCJfY29tcCIsIl9idWZmZXIiLCJfcmVuZGVyZXIiLCJfbm9kZSIsIl9uZWVkQ29sb3IiLCJfdmVydGV4RWZmZWN0IiwiX2RlcHRoIiwiX3JlYWx0aW1lVmVydGljZXMiLCJfcmVhbHRpbWVTaXplUGVyVmVydGV4IiwiREVQVEhfUkFURSIsIl9nZXRTbG90TWF0ZXJpYWwiLCJ0ZXgiLCJibGVuZE1vZGUiLCJzcmMiLCJkc3QiLCJCbGVuZE1vZGUiLCJBZGRpdGl2ZSIsIm1hY3JvIiwiT05FIiwiU1JDX0FMUEhBIiwiTXVsdGlwbHkiLCJEU1RfQ09MT1IiLCJPTkVfTUlOVVNfU1JDX0FMUEhBIiwiU2NyZWVuIiwiT05FX01JTlVTX1NSQ19DT0xPUiIsIk5vcm1hbCIsInVzZU1vZGVsIiwiZW5hYmxlQmF0Y2giLCJiYXNlTWF0ZXJpYWwiLCJfbWF0ZXJpYWxzIiwia2V5IiwiZ2V0SWQiLCJtYXRlcmlhbENhY2hlIiwiX21hdGVyaWFsQ2FjaGUiLCJtYXRlcmlhbCIsIk1hdGVyaWFsVmFyaWFudCIsImNyZWF0ZSIsImRlZmluZSIsInNldFByb3BlcnR5Iiwic2V0QmxlbmQiLCJCTEVORF9GVU5DX0FERCIsIl9oYW5kbGVDb2xvciIsImZhIiwiZnIiLCJmZyIsImZiIiwiZHIiLCJkZyIsImRiIiwiX3NwaW5lQ29sb3JUb0ludDMyIiwic3BpbmVDb2xvciIsImEiLCJiIiwiZyIsInIiLCJTcGluZUFzc2VtYmxlciIsInN5cyIsIm9zIiwiT1NfSU9TIiwiY29uc29sZSIsImxvZyIsInVwZGF0ZVJlbmRlckRhdGEiLCJjb21wIiwiaXNBbmltYXRpb25DYWNoZWQiLCJza2VsZXRvbiIsIl9za2VsZXRvbiIsInVwZGF0ZVdvcmxkVHJhbnNmb3JtIiwiZmlsbFZlcnRpY2VzIiwic2tlbGV0b25Db2xvciIsImF0dGFjaG1lbnRDb2xvciIsInNsb3RDb2xvciIsImNsaXBwZXIiLCJzbG90Iiwic2xvdElkeCIsInZidWYiLCJfdkRhdGEiLCJpYnVmIiwiX2lEYXRhIiwidWludFZEYXRhIiwiX3VpbnRWRGF0YSIsIm9mZnNldEluZm8iLCJkYXJrQ29sb3IiLCJzZXQiLCJ2IiwibiIsIngiLCJ5IiwidHJhbnNmb3JtIiwidXZzIiwic3ViYXJyYXkiLCJjbGlwVHJpYW5nbGVzIiwiY2xpcHBlZFZlcnRpY2VzIiwiRmxvYXQzMkFycmF5IiwiY2xpcHBlZFRyaWFuZ2xlcyIsImxlbmd0aCIsInJlcXVlc3QiLCJpbmRpY2VPZmZzZXQiLCJ2ZXJ0ZXhPZmZzZXQiLCJieXRlT2Zmc2V0Iiwib2Zmc2V0IiwicmVhbFRpbWVUcmF2ZXJzZSIsIndvcmxkTWF0IiwibG9jU2tlbGV0b24iLCJncmFwaGljcyIsIl9kZWJ1Z1JlbmRlcmVyIiwiX2NsaXBwZXIiLCJhdHRhY2htZW50IiwidHJpYW5nbGVzIiwiaXNSZWdpb24iLCJpc01lc2giLCJpc0NsaXAiLCJ3b3JsZE1hdG0iLCJfc3RhcnRTbG90SW5kZXgiLCJfZW5kU2xvdEluZGV4IiwiZGVidWdTbG90cyIsImRlYnVnQm9uZXMiLCJkZWJ1Z01lc2giLCJjbGVhciIsImxpbmVXaWR0aCIsInNsb3RDb3VudCIsImRyYXdPcmRlciIsInVuZGVmaW5lZCIsImRhdGEiLCJpbmRleCIsImNsaXBFbmRXaXRoU2xvdCIsImdldEF0dGFjaG1lbnQiLCJSZWdpb25BdHRhY2htZW50IiwiTWVzaEF0dGFjaG1lbnQiLCJDbGlwcGluZ0F0dGFjaG1lbnQiLCJjbGlwU3RhcnQiLCJyZWdpb24iLCJ0ZXh0dXJlIiwiX3RleHR1cmUiLCJnZXRIYXNoIiwiX2ZsdXNoIiwibm9kZSIsImNvbXB1dGVXb3JsZFZlcnRpY2VzIiwiYm9uZSIsIl93cml0ZVZlcnRleDJUb1ZlcnRleDNCdWZmZXIiLCJzdHJva2VDb2xvciIsIm1vdmVUbyIsImlpIiwibm4iLCJsaW5lVG8iLCJjbG9zZSIsInN0cm9rZSIsIndvcmxkVmVydGljZXNMZW5ndGgiLCJ2MSIsInYyIiwidjMiLCJ1IiwibSIsImFkanVzdCIsImNsaXBFbmQiLCJmaWxsQ29sb3IiLCJpIiwiYm9uZXMiLCJ3b3JsZFgiLCJjIiwid29ybGRZIiwiY2lyY2xlIiwiTWF0aCIsIlBJIiwiZmlsbCIsInZlcnRleDJBcnJheSIsInZlcnRleDNCdWZmZXIiLCJ2ZXJ0ZXhDb3VudCIsImRzdE9mZnNldCIsInNyY09mZnNldCIsImNhY2hlVHJhdmVyc2UiLCJmcmFtZSIsIl9jdXJGcmFtZSIsInNlZ21lbnRzIiwib2Zmc2V0cyIsInVpbnRidWYiLCJ2ZXJ0aWNlcyIsImluZGljZXMiLCJmcmFtZVZGT2Zmc2V0IiwiZnJhbWVJbmRleE9mZnNldCIsInNlZ1ZGQ291bnQiLCJqdXN0VHJhbnNsYXRlIiwibmVlZEJhdGNoIiwiY2FsY1RyYW5zbGF0ZSIsImNvbG9yT2Zmc2V0IiwiY29sb3JzIiwibm93Q29sb3IiLCJtYXhWRk9mZnNldCIsInZmT2Zmc2V0Iiwic2VnSW5mbyIsImluZGV4Q291bnQiLCJpbCIsInZmQ291bnQiLCJyZW5kZXJWZXJ0ZXhDb3VudCIsImoiLCJsZW4iLCJmcmFtZUNvbG9yT2Zmc2V0IiwiZmlsbEJ1ZmZlcnMiLCJyZW5kZXJlciIsIl9yZW5kZXJGbGFnIiwiRkxBR19VUERBVEVfUkVOREVSX0RBVEEiLCJub2RlQ29sb3IiLCJfY29sb3IiLCJ1c2VUaW50IiwiZ2V0QnVmZmVyIiwiZGVwdGgiLCJwcmVtdWx0aXBsaWVkQWxwaGEiLCJfZWZmZWN0RGVsZWdhdGUiLCJfdmFsIiwiX3dvcmxkTWF0cml4IiwiYmVnaW4iLCJlbmQiLCJ3b3JsZE1hdERpcnR5IiwiYXR0YWNoVXRpbCIsIl9zeW5jQXR0YWNoZWROb2RlIiwicG9zdEZpbGxCdWZmZXJzIiwiQXNzZW1ibGVyIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7Ozs7Ozs7O0FBRUEsSUFBTUEsUUFBUSxHQUFHQyxPQUFPLENBQUMsWUFBRCxDQUF4Qjs7QUFDQSxJQUFNQyxLQUFLLEdBQUdELE9BQU8sQ0FBQyxhQUFELENBQXJCOztBQUNBLElBQU1FLFVBQVUsR0FBR0YsT0FBTyxDQUFDLHlDQUFE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LENBdUR4Qjs7O0FBQ0FiLElBQUFBLFFBQVEsQ0FBQ2MsYUFBVDs7QUFDQXJKLElBQUFBLElBQUksQ0FBQ3NKLFVBQUwsQ0FBZ0JDLGlCQUFoQixHQXpEd0IsQ0EyRHhCOzs7QUFDQWxOLElBQUFBLEtBQUssR0FBR3NILFNBQVI7QUFDQXhILElBQUFBLE9BQU8sR0FBR3dILFNBQVY7QUFDQXZILElBQUFBLFNBQVMsR0FBR3VILFNBQVo7QUFDQXpILElBQUFBLEtBQUssR0FBR3lILFNBQVI7QUFDQXBILElBQUFBLGFBQWEsR0FBRyxJQUFoQjtBQUNIOztTQUVEaU4sa0JBQUEseUJBQWdCeEosSUFBaEIsRUFBc0J1SSxRQUF0QixFQUFnQztBQUM1QkEsSUFBQUEsUUFBUSxDQUFDYyxhQUFUO0FBQ0g7OztFQXJrQnVDSTs7OztBQXdrQjVDQSxzQkFBVUMsUUFBVixDQUFtQm5TLFFBQW5CLEVBQTZCa0ksY0FBN0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgQXNzZW1ibGVyIGZyb20gJy4uLy4uL2NvY29zMmQvY29yZS9yZW5kZXJlci9hc3NlbWJsZXInO1xuXG5jb25zdCBTa2VsZXRvbiA9IHJlcXVpcmUoJy4vU2tlbGV0b24nKTtcbmNvbnN0IHNwaW5lID0gcmVxdWlyZSgnLi9saWIvc3BpbmUnKTtcbmNvbnN0IFJlbmRlckZsb3cgPSByZXF1aXJlKCcuLi8uLi9jb2NvczJkL2NvcmUvcmVuZGVyZXIvcmVuZGVyLWZsb3cnKTtcbmNvbnN0IFZlcnRleEZvcm1hdCA9IHJlcXVpcmUoJy4uLy4uL2NvY29zMmQvY29yZS9yZW5kZXJlci93ZWJnbC92ZXJ0ZXgtZm9ybWF0JylcbmNvbnN0IFZGT25lQ29sb3IgPSBWZXJ0ZXhGb3JtYXQudmZtdDNEO1xuY29uc3QgVkZUd29Db2xvciA9IFZlcnRleEZvcm1hdC52Zm10UG9zM1V2VHdvQ29sb3I7XG5jb25zdCBnZnggPSBjYy5nZng7XG5cbmNvbnN0IEZMQUdfQkFUQ0ggPSAweDEwO1xuY29uc3QgRkxBR19UV09fQ09MT1IgPSAweDAxO1xuXG5sZXQgX2hhbmRsZVZhbCA9IDB4MDA7XG5sZXQgX3F1YWRUcmlhbmdsZXMgPSBbMCwgMSwgMiwgMiwgMywgMF07XG5sZXQgX3Nsb3RDb2xvciA9IGNjLmNvbG9yKDAsIDAsIDI1NSwgMjU1KTtcbmxldCBfYm9uZUNvbG9yID0gY2MuY29sb3IoMjU1LCAwLCAwLCAyNTUpO1xubGV0IF9vcmlnaW5Db2xvciA9IGNjLmNvbG9yKDAsIDI1NSwgMCwgMjU1KTtcbmxldCBfbWVzaENvbG9yID0gY2MuY29sb3IoMjU1LCAyNTUsIDAsIDI1NSk7XG5cbmxldCBfZmluYWxDb2xvciA9IG51bGw7XG5sZXQgX2RhcmtDb2xvciA9IG51bGw7XG5sZXQgX3RlbXBQb3MgPSBudWxsLCBfdGVtcFV2ID0gbnVsbDtcbmlmICghQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICBfZmluYWxDb2xvciA9IG5ldyBzcGluZS5Db2xvcigxLCAxLCAxLCAxKTtcbiAgICBfZGFya0NvbG9yID0gbmV3IHNwaW5lLkNvbG9yKDEsIDEsIDEsIDEpO1xuICAgIF90ZW1wUG9zID0gbmV3IHNwaW5lLlZlY3RvcjIoKTtcbiAgICBfdGVtcFV2ID0gbmV3IHNwaW5lLlZlY3RvcjIoKTtcbn1cblxubGV0IF9wcmVtdWx0aXBsaWVkQWxwaGE7XG5sZXQgX211bHRpcGxpZXI7XG5sZXQgX3Nsb3RSYW5nZVN0YXJ0O1xubGV0IF9zbG90UmFuZ2VFbmQ7XG5sZXQgX3VzZVRpbnQ7XG5sZXQgX2RlYnVnU2xvdHM7XG5sZXQgX2RlYnVnQm9uZXM7XG5sZXQgX2RlYnVnTWVzaDtcbmxldCBfbm9kZVIsXG4gICAgX25vZGVHLFxuICAgIF9ub2RlQixcbiAgICBfbm9kZUE7XG5sZXQgX2ZpbmFsQ29sb3IzMiwgX2RhcmtDb2xvcjMyO1xubGV0IF92ZXJ0ZXhGb3JtYXQ7XG5sZXQgX3BlclZlcnRleFNpemU7XG5sZXQgX3BlckNsaXBWZXJ0ZXhTaXplO1xuXG4vKiog5b2T5YmNc2xvdOeahOmhtueCuea1rueCueaVsOiuoeaVsCAqL1xubGV0IF92ZXJ0ZXhGbG9hdENvdW50ID0gMDtcbmxldCBfdmVydGV4Q291bnQgPSAwO1xubGV0IF92ZXJ0ZXhGbG9hdE9mZnNldCA9IDA7XG4vKiog5q2k5pe255qE6aG254K55ZyodmJv55qE5YGP56e7ICovXG5sZXQgX3ZlcnRleE9mZnNldCA9IDA7XG4vKiog5b2T5YmNc2xvdOeahOmhtueCuee0ouW8leiuoeaVsCAqL1xubGV0IF9pbmRleENvdW50ID0gMDtcbi8qKiDmraTml7bnmoTpobbngrnlnKhpYm/nmoTlgY/np7sgKi9cbmxldCBfaW5kZXhPZmZzZXQgPSAwO1xubGV0IF92Zk9mZnNldCA9IDA7XG5cbmxldCBfdGVtcHIsIF90ZW1wZywgX3RlbXBiO1xubGV0IF9pblJhbmdlO1xubGV0IF9tdXN0Rmx1c2g7XG5sZXQgX3gsIF95LCBfbTAwLCBfbTA0LCBfbTEyLCBfbTAxLCBfbTA1LCBfbTEzO1xubGV0IF9yLCBfZywgX2IsIF9mciwgX2ZnLCBfZmIsIF9mYSwgX2RyLCBfZGcsIF9kYiwgX2RhO1xubGV0IF9jb21wLCBfYnVmZmVyLCBfcmVuZGVyZXIsIF9ub2RlLCBfbmVlZENvbG9yLCBfdmVydGV4RWZmZWN0O1xubGV0IF9kZXB0aDtcbmxldCBfcmVhbHRpbWVWZXJ0aWNlcyA9IFtdO1xuLyoqIOWunuaXtua4suafk+eahOmhtueCueWkp+WwjyjlrZfoioIp77yM6K+75Y+Wc2tlbGV0b27ml7bnlKggKi9cbmxldCBfcmVhbHRpbWVTaXplUGVyVmVydGV4ID0gMDtcblxubGV0IERFUFRIX1JBVEUgPSA1ZS00O1xuXG5mdW5jdGlvbiBfZ2V0U2xvdE1hdGVyaWFsKHRleCwgYmxlbmRNb2RlKSB7XG4gICAgbGV0IHNyYywgZHN0O1xuICAgIHN3aXRjaCAoYmxlbmRNb2RlKSB7XG4gICAgICAgIGNhc2Ugc3BpbmUuQmxlbmRNb2RlLkFkZGl0aXZlOlxuICAgICAgICAgICAgc3JjID0gX3ByZW11bHRpcGxpZWRBbHBoYSA/IGNjLm1hY3JvLk9ORSA6IGNjLm1hY3JvLlNSQ19BTFBIQTtcbiAgICAgICAgICAgIGRzdCA9IGNjLm1hY3JvLk9ORTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHNwaW5lLkJsZW5kTW9kZS5NdWx0aXBseTpcbiAgICAgICAgICAgIHNyYyA9IGNjLm1hY3JvLkRTVF9DT0xPUjtcbiAgICAgICAgICAgIGRzdCA9IGNjLm1hY3JvLk9ORV9NSU5VU19TUkNfQUxQSEE7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBzcGluZS5CbGVuZE1vZGUuU2NyZWVuOlxuICAgICAgICAgICAgc3JjID0gY2MubWFjcm8uT05FO1xuICAgICAgICAgICAgZHN0ID0gY2MubWFjcm8uT05FX01JTlVTX1NSQ19DT0xPUjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHNwaW5lLkJsZW5kTW9kZS5Ob3JtYWw6XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBzcmMgPSBfcHJlbXVsdGlwbGllZEFscGhhID8gY2MubWFjcm8uT05FIDogY2MubWFjcm8uU1JDX0FMUEhBO1xuICAgICAgICAgICAgZHN0ID0gY2MubWFjcm8uT05FX01JTlVTX1NSQ19BTFBIQTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGxldCB1c2VNb2RlbCA9ICFfY29tcC5lbmFibGVCYXRjaDtcbiAgICBsZXQgYmFzZU1hdGVyaWFsID0gX2NvbXAuX21hdGVyaWFsc1swXTtcbiAgICBpZiAoIWJhc2VNYXRlcmlhbCkgcmV0dXJuIG51bGw7XG5cbiAgICAvLyBUaGUga2V5IHVzZSB0byBmaW5kIGNvcnJlc3BvbmRpbmcgbWF0ZXJpYWxcbiAgICBsZXQga2V5ID0gdGV4LmdldElkKCkgKyBzcmMgKyBkc3QgKyBfdXNlVGludCArIHVzZU1vZGVsO1xuICAgIGxldCBtYXRlcmlhbENhY2hlID0gX2NvbXAuX21hdGVyaWFsQ2FjaGU7XG4gICAgbGV0IG1hdGVyaWFsID0gbWF0ZXJpYWxDYWNoZVtrZXldO1xuICAgIGlmICghbWF0ZXJpYWwpIHtcbiAgICAgICAgaWYgKCFtYXRlcmlhbENhY2hlLmJhc2VNYXRlcmlhbCkge1xuICAgICAgICAgICAgbWF0ZXJpYWwgPSBiYXNlTWF0ZXJpYWw7XG4gICAgICAgICAgICBtYXRlcmlhbENhY2hlLmJhc2VNYXRlcmlhbCA9IGJhc2VNYXRlcmlhbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1hdGVyaWFsID0gY2MuTWF0ZXJpYWxWYXJpYW50LmNyZWF0ZShiYXNlTWF0ZXJpYWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgbWF0ZXJpYWwuZGVmaW5lKCdDQ19VU0VfTU9ERUwnLCB1c2VNb2RlbCk7XG4gICAgICAgIG1hdGVyaWFsLmRlZmluZSgnVVNFX1RJTlQnLCBfdXNlVGludCk7XG4gICAgICAgIC8vIHVwZGF0ZSB0ZXh0dXJlXG4gICAgICAgIG1hdGVyaWFsLnNldFByb3BlcnR5KCd0ZXh0dXJlJywgdGV4KTtcblxuICAgICAgICAvLyB1cGRhdGUgYmxlbmQgZnVuY3Rpb25cbiAgICAgICAgbWF0ZXJpYWwuc2V0QmxlbmQoXG4gICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgZ2Z4LkJMRU5EX0ZVTkNfQURELFxuICAgICAgICAgICAgc3JjLCBkc3QsXG4gICAgICAgICAgICBnZnguQkxFTkRfRlVOQ19BREQsXG4gICAgICAgICAgICBzcmMsIGRzdFxuICAgICAgICApO1xuICAgICAgICBtYXRlcmlhbENhY2hlW2tleV0gPSBtYXRlcmlhbDtcbiAgICB9XG4gICAgcmV0dXJuIG1hdGVyaWFsO1xufVxuXG5mdW5jdGlvbiBfaGFuZGxlQ29sb3IoY29sb3IpIHtcbiAgICAvLyB0ZW1wIHJnYiBoYXMgbXVsdGlwbHkgMjU1LCBzbyBuZWVkIGRpdmlkZSAyNTU7XG4gICAgX2ZhID0gY29sb3IuZmEgKiBfbm9kZUE7XG4gICAgX211bHRpcGxpZXIgPSBfcHJlbXVsdGlwbGllZEFscGhhID8gX2ZhIC8gMjU1IDogMTtcbiAgICBfciA9IF9ub2RlUiAqIF9tdWx0aXBsaWVyO1xuICAgIF9nID0gX25vZGVHICogX211bHRpcGxpZXI7XG4gICAgX2IgPSBfbm9kZUIgKiBfbXVsdGlwbGllcjtcblxuICAgIF9mciA9IGNvbG9yLmZyICogX3I7XG4gICAgX2ZnID0gY29sb3IuZmcgKiBfZztcbiAgICBfZmIgPSBjb2xvci5mYiAqIF9iO1xuICAgIF9maW5hbENvbG9yMzIgPSAoKF9mYSA8PCAyNCkgPj4+IDApICsgKF9mYiA8PCAxNikgKyAoX2ZnIDw8IDgpICsgX2ZyO1xuXG4gICAgX2RyID0gY29sb3IuZHIgKiBfcjtcbiAgICBfZGcgPSBjb2xvci5kZyAqIF9nO1xuICAgIF9kYiA9IGNvbG9yLmRiICogX2I7XG4gICAgX2RhID0gX3ByZW11bHRpcGxpZWRBbHBoYSA/IDI1NSA6IDA7XG4gICAgX2RhcmtDb2xvcjMyID0gKChfZGEgPDwgMjQpID4+PiAwKSArIChfZGIgPDwgMTYpICsgKF9kZyA8PCA4KSArIF9kcjtcbn1cblxuZnVuY3Rpb24gX3NwaW5lQ29sb3JUb0ludDMyKHNwaW5lQ29sb3IpIHtcbiAgICByZXR1cm4gKChzcGluZUNvbG9yLmEgPDwgMjQpID4+PiAwKSArIChzcGluZUNvbG9yLmIgPDwgMTYpICsgKHNwaW5lQ29sb3IuZyA8PCA4KSArIHNwaW5lQ29sb3Iucjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3BpbmVBc3NlbWJsZXIgZXh0ZW5kcyBBc3NlbWJsZXIge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGlmIChjYy5zeXMub3MgPT0gY2Muc3lzLk9TX0lPUykge1xuICAgICAgICAgICAgREVQVEhfUkFURSA9IDFlLTY7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coJ3VwZGF0ZSBERVBUSF9SQVRFJywgREVQVEhfUkFURSwgY2Muc3lzLm9zKTtcbiAgICB9XG4gICAgdXBkYXRlUmVuZGVyRGF0YShjb21wKSB7XG4gICAgICAgIGlmIChjb21wLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHJldHVybjtcbiAgICAgICAgbGV0IHNrZWxldG9uID0gY29tcC5fc2tlbGV0b247XG4gICAgICAgIGlmIChza2VsZXRvbikge1xuICAgICAgICAgICAgc2tlbGV0b24udXBkYXRlV29ybGRUcmFuc2Zvcm0oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbGxWZXJ0aWNlcyhza2VsZXRvbkNvbG9yLCBhdHRhY2htZW50Q29sb3IsIHNsb3RDb2xvciwgY2xpcHBlciwgc2xvdCwgc2xvdElkeCkge1xuXG4gICAgICAgIGxldCB2YnVmID0gX2J1ZmZlci5fdkRhdGEsXG4gICAgICAgICAgICBpYnVmID0gX2J1ZmZlci5faURhdGEsXG4gICAgICAgICAgICB1aW50VkRhdGEgPSBfYnVmZmVyLl91aW50VkRhdGE7XG4gICAgICAgIGxldCBvZmZzZXRJbmZvO1xuXG4gICAgICAgIF9maW5hbENvbG9yLmEgPSBzbG90Q29sb3IuYSAqIGF0dGFjaG1lbnRDb2xvci5hICogc2tlbGV0b25Db2xvci5hICogX25vZGVBICogMjU1O1xuICAgICAgICBfbXVsdGlwbGllciA9IF9wcmVtdWx0aXBsaWVkQWxwaGEgPyBfZmluYWxDb2xvci5hIDogMjU1O1xuICAgICAgICBfdGVtcHIgPSBfbm9kZVIgKiBhdHRhY2htZW50Q29sb3IuciAqIHNrZWxldG9uQ29sb3IuciAqIF9tdWx0aXBsaWVyO1xuICAgICAgICBfdGVtcGcgPSBfbm9kZUcgKiBhdHRhY2htZW50Q29sb3IuZyAqIHNrZWxldG9uQ29sb3IuZyAqIF9tdWx0aXBsaWVyO1xuICAgICAgICBfdGVtcGIgPSBfbm9kZUIgKiBhdHRhY2htZW50Q29sb3IuYiAqIHNrZWxldG9uQ29sb3IuYiAqIF9tdWx0aXBsaWVyO1xuXG4gICAgICAgIF9maW5hbENvbG9yLnIgPSBfdGVtcHIgKiBzbG90Q29sb3IucjtcbiAgICAgICAgX2ZpbmFsQ29sb3IuZyA9IF90ZW1wZyAqIHNsb3RDb2xvci5nO1xuICAgICAgICBfZmluYWxDb2xvci5iID0gX3RlbXBiICogc2xvdENvbG9yLmI7XG5cbiAgICAgICAgaWYgKHNsb3QuZGFya0NvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgIF9kYXJrQ29sb3Iuc2V0KDAuMCwgMC4wLCAwLjAsIDEuMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfZGFya0NvbG9yLnIgPSBzbG90LmRhcmtDb2xvci5yICogX3RlbXByO1xuICAgICAgICAgICAgX2RhcmtDb2xvci5nID0gc2xvdC5kYXJrQ29sb3IuZyAqIF90ZW1wZztcbiAgICAgICAgICAgIF9kYXJrQ29sb3IuYiA9IHNsb3QuZGFya0NvbG9yLmIgKiBfdGVtcGI7XG4gICAgICAgIH1cbiAgICAgICAgX2RhcmtDb2xvci5hID0gX3ByZW11bHRpcGxpZWRBbHBoYSA/IDI1NSA6IDA7XG5cbiAgICAgICAgaWYgKC8qKiFjbGlwcGVyLmlzQ2xpcHBpbmcoKSovdHJ1ZSkge1xuICAgICAgICAgICAgaWYgKF92ZXJ0ZXhFZmZlY3QpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB2ID0gX3ZlcnRleEZsb2F0T2Zmc2V0LCBuID0gX3ZlcnRleEZsb2F0T2Zmc2V0ICsgX3ZlcnRleEZsb2F0Q291bnQ7IHYgPCBuOyB2ICs9IF9wZXJWZXJ0ZXhTaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIF90ZW1wUG9zLnggPSB2YnVmW3ZdO1xuICAgICAgICAgICAgICAgICAgICBfdGVtcFBvcy55ID0gdmJ1Zlt2ICsgMV07XG4gICAgICAgICAgICAgICAgICAgIF90ZW1wVXYueCA9IHZidWZbdiArIDNdO1xuICAgICAgICAgICAgICAgICAgICBfdGVtcFV2LnkgPSB2YnVmW3YgKyA0XTtcbiAgICAgICAgICAgICAgICAgICAgX3ZlcnRleEVmZmVjdC50cmFuc2Zvcm0oX3RlbXBQb3MsIF90ZW1wVXYsIF9maW5hbENvbG9yLCBfZGFya0NvbG9yKTtcblxuICAgICAgICAgICAgICAgICAgICB2YnVmW3ZdID0gX3RlbXBQb3MueDsgICAgICAgIC8vIHhcbiAgICAgICAgICAgICAgICAgICAgdmJ1Zlt2ICsgMV0gPSBfdGVtcFBvcy55OyAgICAgICAgLy8geVxuICAgICAgICAgICAgICAgICAgICB2YnVmW3YgKyAzXSA9IF90ZW1wVXYueDsgICAgICAgICAvLyB1XG4gICAgICAgICAgICAgICAgICAgIHZidWZbdiArIDRdID0gX3RlbXBVdi55OyAgICAgICAgIC8vIHZcbiAgICAgICAgICAgICAgICAgICAgdWludFZEYXRhW3YgKyA1XSA9IF9zcGluZUNvbG9yVG9JbnQzMihfZmluYWxDb2xvcik7ICAgICAgICAgICAgICAgICAgLy8gbGlnaHQgY29sb3JcbiAgICAgICAgICAgICAgICAgICAgX3VzZVRpbnQgJiYgKHVpbnRWRGF0YVt2ICsgNl0gPSBfc3BpbmVDb2xvclRvSW50MzIoX2RhcmtDb2xvcikpOyAgICAgIC8vIGRhcmsgY29sb3JcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF9maW5hbENvbG9yMzIgPSBfc3BpbmVDb2xvclRvSW50MzIoX2ZpbmFsQ29sb3IpO1xuICAgICAgICAgICAgICAgIF9kYXJrQ29sb3IzMiA9IF9zcGluZUNvbG9yVG9JbnQzMihfZGFya0NvbG9yKTtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IHYgPSBfdmVydGV4RmxvYXRPZmZzZXQsIG4gPSBfdmVydGV4RmxvYXRPZmZzZXQgKyBfdmVydGV4RmxvYXRDb3VudDsgdiA8IG47IHYgKz0gX3BlclZlcnRleFNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgdWludFZEYXRhW3YgKyA1XSA9IF9maW5hbENvbG9yMzI7ICAgICAgICAgICAgICAgICAgIC8vIGxpZ2h0IGNvbG9yXG4gICAgICAgICAgICAgICAgICAgIF91c2VUaW50ICYmICh1aW50VkRhdGFbdiArIDZdID0gX2RhcmtDb2xvcjMyKTsgICAgICAvLyBkYXJrIGNvbG9yXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHV2cyA9IHZidWYuc3ViYXJyYXkoX3ZlcnRleEZsb2F0T2Zmc2V0ICsgMyk7XG4gICAgICAgICAgICBjbGlwcGVyLmNsaXBUcmlhbmdsZXModmJ1Zi5zdWJhcnJheShfdmVydGV4RmxvYXRPZmZzZXQpLCBfdmVydGV4RmxvYXRDb3VudCwgaWJ1Zi5zdWJhcnJheShfaW5kZXhPZmZzZXQpLCBfaW5kZXhDb3VudCwgdXZzLCBfZmluYWxDb2xvciwgX2RhcmtDb2xvciwgX3VzZVRpbnQsIF9wZXJWZXJ0ZXhTaXplKTtcbiAgICAgICAgICAgIGxldCBjbGlwcGVkVmVydGljZXMgPSBuZXcgRmxvYXQzMkFycmF5KGNsaXBwZXIuY2xpcHBlZFZlcnRpY2VzKTtcbiAgICAgICAgICAgIGxldCBjbGlwcGVkVHJpYW5nbGVzID0gY2xpcHBlci5jbGlwcGVkVHJpYW5nbGVzO1xuXG4gICAgICAgICAgICAvLyBpbnN1cmUgY2FwYWNpdHlcbiAgICAgICAgICAgIF9pbmRleENvdW50ID0gY2xpcHBlZFRyaWFuZ2xlcy5sZW5ndGg7XG4gICAgICAgICAgICBfdmVydGV4RmxvYXRDb3VudCA9IGNsaXBwZWRWZXJ0aWNlcy5sZW5ndGggLyBfcGVyQ2xpcFZlcnRleFNpemUgKiBfcGVyVmVydGV4U2l6ZTtcblxuICAgICAgICAgICAgb2Zmc2V0SW5mbyA9IF9idWZmZXIucmVxdWVzdChfdmVydGV4RmxvYXRDb3VudCAvIF9wZXJWZXJ0ZXhTaXplLCBfaW5kZXhDb3VudCk7XG4gICAgICAgICAgICBfaW5kZXhPZmZzZXQgPSBvZmZzZXRJbmZvLmluZGljZU9mZnNldCxcbiAgICAgICAgICAgICAgICBfdmVydGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby52ZXJ0ZXhPZmZzZXQsXG4gICAgICAgICAgICAgICAgX3ZlcnRleEZsb2F0T2Zmc2V0ID0gb2Zmc2V0SW5mby5ieXRlT2Zmc2V0ID4+IDI7XG4gICAgICAgICAgICB2YnVmID0gX2J1ZmZlci5fdkRhdGEsXG4gICAgICAgICAgICAgICAgaWJ1ZiA9IF9idWZmZXIuX2lEYXRhO1xuICAgICAgICAgICAgdWludFZEYXRhID0gX2J1ZmZlci5fdWludFZEYXRhO1xuXG4gICAgICAgICAgICAvLyBmaWxsIGluZGljZXNcbiAgICAgICAgICAgIGlidWYuc2V0KGNsaXBwZWRUcmlhbmdsZXMsIF9pbmRleE9mZnNldCk7XG5cbiAgICAgICAgICAgIC8vIGZpbGwgdmVydGljZXMgY29udGFpbiB4IHkgdSB2IGxpZ2h0IGNvbG9yIGRhcmsgY29sb3JcbiAgICAgICAgICAgIGlmIChfdmVydGV4RWZmZWN0KSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdiA9IDAsIG4gPSBjbGlwcGVkVmVydGljZXMubGVuZ3RoLCBvZmZzZXQgPSBfdmVydGV4RmxvYXRPZmZzZXQ7IHYgPCBuOyB2ICs9IF9wZXJDbGlwVmVydGV4U2l6ZSwgb2Zmc2V0ICs9IF9wZXJWZXJ0ZXhTaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIF90ZW1wUG9zLnggPSBjbGlwcGVkVmVydGljZXNbdl07XG4gICAgICAgICAgICAgICAgICAgIF90ZW1wUG9zLnkgPSBjbGlwcGVkVmVydGljZXNbdiArIDFdO1xuICAgICAgICAgICAgICAgICAgICBfZmluYWxDb2xvci5zZXQoY2xpcHBlZFZlcnRpY2VzW3YgKyAyXSwgY2xpcHBlZFZlcnRpY2VzW3YgKyAzXSwgY2xpcHBlZFZlcnRpY2VzW3YgKyA0XSwgY2xpcHBlZFZlcnRpY2VzW3YgKyA1XSk7XG4gICAgICAgICAgICAgICAgICAgIF90ZW1wVXYueCA9IGNsaXBwZWRWZXJ0aWNlc1t2ICsgNl07XG4gICAgICAgICAgICAgICAgICAgIF90ZW1wVXYueSA9IGNsaXBwZWRWZXJ0aWNlc1t2ICsgN107XG4gICAgICAgICAgICAgICAgICAgIGlmIChfdXNlVGludCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2RhcmtDb2xvci5zZXQoY2xpcHBlZFZlcnRpY2VzW3YgKyA4XSwgY2xpcHBlZFZlcnRpY2VzW3YgKyA5XSwgY2xpcHBlZFZlcnRpY2VzW3YgKyAxMF0sIGNsaXBwZWRWZXJ0aWNlc1t2ICsgMTFdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kYXJrQ29sb3Iuc2V0KDAsIDAsIDAsIDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF92ZXJ0ZXhFZmZlY3QudHJhbnNmb3JtKF90ZW1wUG9zLCBfdGVtcFV2LCBfZmluYWxDb2xvciwgX2RhcmtDb2xvcik7XG5cbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltvZmZzZXRdID0gX3RlbXBQb3MueDsgICAgICAgICAgICAgLy8geFxuICAgICAgICAgICAgICAgICAgICB2YnVmW29mZnNldCArIDFdID0gX3RlbXBQb3MueTsgICAgICAgICAvLyB5XG4gICAgICAgICAgICAgICAgICAgIHZidWZbb2Zmc2V0ICsgMl0gPSBfdGVtcFV2Lng7ICAgICAgICAgIC8vIHVcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltvZmZzZXQgKyAzXSA9IF90ZW1wVXYueTsgICAgICAgICAgLy8gdlxuICAgICAgICAgICAgICAgICAgICB1aW50VkRhdGFbb2Zmc2V0ICsgNF0gPSBfc3BpbmVDb2xvclRvSW50MzIoX2ZpbmFsQ29sb3IpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoX3VzZVRpbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVpbnRWRGF0YVtvZmZzZXQgKyA1XSA9IF9zcGluZUNvbG9yVG9JbnQzMihfZGFya0NvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdiA9IDAsIG4gPSBjbGlwcGVkVmVydGljZXMubGVuZ3RoLCBvZmZzZXQgPSBfdmVydGV4RmxvYXRPZmZzZXQ7IHYgPCBuOyB2ICs9IF9wZXJDbGlwVmVydGV4U2l6ZSwgb2Zmc2V0ICs9IF9wZXJWZXJ0ZXhTaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIHZidWZbb2Zmc2V0XSA9IGNsaXBwZWRWZXJ0aWNlc1t2XTsgICAgICAgICAvLyB4XG4gICAgICAgICAgICAgICAgICAgIHZidWZbb2Zmc2V0ICsgMV0gPSBjbGlwcGVkVmVydGljZXNbdiArIDFdOyAgICAgLy8geVxuICAgICAgICAgICAgICAgICAgICB2YnVmW29mZnNldCArIDJdID0gY2xpcHBlZFZlcnRpY2VzW3YgKyA2XTsgICAgIC8vIHVcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltvZmZzZXQgKyAzXSA9IGNsaXBwZWRWZXJ0aWNlc1t2ICsgN107ICAgICAvLyB2XG5cbiAgICAgICAgICAgICAgICAgICAgX2ZpbmFsQ29sb3IzMiA9ICgoY2xpcHBlZFZlcnRpY2VzW3YgKyA1XSA8PCAyNCkgPj4+IDApICsgKGNsaXBwZWRWZXJ0aWNlc1t2ICsgNF0gPDwgMTYpICsgKGNsaXBwZWRWZXJ0aWNlc1t2ICsgM10gPDwgOCkgKyBjbGlwcGVkVmVydGljZXNbdiArIDJdO1xuICAgICAgICAgICAgICAgICAgICB1aW50VkRhdGFbb2Zmc2V0ICsgNF0gPSBfZmluYWxDb2xvcjMyO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChfdXNlVGludCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2RhcmtDb2xvcjMyID0gKChjbGlwcGVkVmVydGljZXNbdiArIDExXSA8PCAyNCkgPj4+IDApICsgKGNsaXBwZWRWZXJ0aWNlc1t2ICsgMTBdIDw8IDE2KSArIChjbGlwcGVkVmVydGljZXNbdiArIDldIDw8IDgpICsgY2xpcHBlZFZlcnRpY2VzW3YgKyA4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVpbnRWRGF0YVtvZmZzZXQgKyA1XSA9IF9kYXJrQ29sb3IzMjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlYWxUaW1lVHJhdmVyc2Uod29ybGRNYXQpIHtcbiAgICAgICAgbGV0IHZidWY7XG4gICAgICAgIGxldCBpYnVmO1xuXG4gICAgICAgIGxldCBsb2NTa2VsZXRvbiA9IF9jb21wLl9za2VsZXRvbjtcbiAgICAgICAgbGV0IHNrZWxldG9uQ29sb3IgPSBsb2NTa2VsZXRvbi5jb2xvcjtcbiAgICAgICAgbGV0IGdyYXBoaWNzID0gX2NvbXAuX2RlYnVnUmVuZGVyZXI7XG4gICAgICAgIGxldCBjbGlwcGVyID0gX2NvbXAuX2NsaXBwZXI7XG4gICAgICAgIGxldCBtYXRlcmlhbCA9IG51bGw7XG4gICAgICAgIGxldCBhdHRhY2htZW50LCBhdHRhY2htZW50Q29sb3IsIHNsb3RDb2xvciwgdXZzLCB0cmlhbmdsZXM7XG4gICAgICAgIGxldCBpc1JlZ2lvbiwgaXNNZXNoLCBpc0NsaXA7XG4gICAgICAgIGxldCBvZmZzZXRJbmZvO1xuICAgICAgICBsZXQgc2xvdDtcbiAgICAgICAgbGV0IHdvcmxkTWF0bTtcblxuICAgICAgICBfc2xvdFJhbmdlU3RhcnQgPSBfY29tcC5fc3RhcnRTbG90SW5kZXg7XG4gICAgICAgIF9zbG90UmFuZ2VFbmQgPSBfY29tcC5fZW5kU2xvdEluZGV4O1xuICAgICAgICBfaW5SYW5nZSA9IGZhbHNlO1xuICAgICAgICBpZiAoX3Nsb3RSYW5nZVN0YXJ0ID09IC0xKSBfaW5SYW5nZSA9IHRydWU7XG5cbiAgICAgICAgX2RlYnVnU2xvdHMgPSBfY29tcC5kZWJ1Z1Nsb3RzO1xuICAgICAgICBfZGVidWdCb25lcyA9IF9jb21wLmRlYnVnQm9uZXM7XG4gICAgICAgIF9kZWJ1Z01lc2ggPSBfY29tcC5kZWJ1Z01lc2g7XG4gICAgICAgIGlmIChncmFwaGljcyAmJiAoX2RlYnVnQm9uZXMgfHwgX2RlYnVnU2xvdHMgfHwgX2RlYnVnTWVzaCkpIHtcbiAgICAgICAgICAgIGdyYXBoaWNzLmNsZWFyKCk7XG4gICAgICAgICAgICBncmFwaGljcy5saW5lV2lkdGggPSAyO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8geCB5IHUgdiByMSBnMSBiMSBhMSByMiBnMiBiMiBhMiBvciB4IHkgdSB2IHIgZyBiIGEgXG4gICAgICAgIF9wZXJDbGlwVmVydGV4U2l6ZSA9IF91c2VUaW50ID8gMTIgOiA4O1xuXG4gICAgICAgIF92ZXJ0ZXhGbG9hdENvdW50ID0gMDtcbiAgICAgICAgX3ZlcnRleEZsb2F0T2Zmc2V0ID0gMDtcbiAgICAgICAgX3ZlcnRleE9mZnNldCA9IDA7XG4gICAgICAgIF9pbmRleENvdW50ID0gMDtcbiAgICAgICAgX2luZGV4T2Zmc2V0ID0gMDtcbiAgICAgICAgX3JlYWx0aW1lVmVydGljZXMubGVuZ3RoID0gMDtcblxuICAgICAgICBmb3IgKGxldCBzbG90SWR4ID0gMCwgc2xvdENvdW50ID0gbG9jU2tlbGV0b24uZHJhd09yZGVyLmxlbmd0aDsgc2xvdElkeCA8IHNsb3RDb3VudDsgc2xvdElkeCsrKSB7XG4gICAgICAgICAgICBzbG90ID0gbG9jU2tlbGV0b24uZHJhd09yZGVyW3Nsb3RJZHhdO1xuXG4gICAgICAgICAgICBpZiAoc2xvdCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF9zbG90UmFuZ2VTdGFydCA+PSAwICYmIF9zbG90UmFuZ2VTdGFydCA9PSBzbG90LmRhdGEuaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBfaW5SYW5nZSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghX2luUmFuZ2UpIHtcbiAgICAgICAgICAgICAgICBjbGlwcGVyLmNsaXBFbmRXaXRoU2xvdChzbG90KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF9zbG90UmFuZ2VFbmQgPj0gMCAmJiBfc2xvdFJhbmdlRW5kID09IHNsb3QuZGF0YS5pbmRleCkge1xuICAgICAgICAgICAgICAgIF9pblJhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF92ZXJ0ZXhGbG9hdENvdW50ID0gMDtcbiAgICAgICAgICAgIF9pbmRleENvdW50ID0gMDtcbiAgICAgICAgICAgIF9yZWFsdGltZVZlcnRpY2VzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgICAgIGF0dGFjaG1lbnQgPSBzbG90LmdldEF0dGFjaG1lbnQoKTtcbiAgICAgICAgICAgIGlmICghYXR0YWNobWVudCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpc1JlZ2lvbiA9IGF0dGFjaG1lbnQgaW5zdGFuY2VvZiBzcGluZS5SZWdpb25BdHRhY2htZW50O1xuICAgICAgICAgICAgaXNNZXNoID0gYXR0YWNobWVudCBpbnN0YW5jZW9mIHNwaW5lLk1lc2hBdHRhY2htZW50O1xuICAgICAgICAgICAgaXNDbGlwID0gYXR0YWNobWVudCBpbnN0YW5jZW9mIHNwaW5lLkNsaXBwaW5nQXR0YWNobWVudDtcblxuICAgICAgICAgICAgaWYgKGlzQ2xpcCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcFN0YXJ0KHNsb3QsIGF0dGFjaG1lbnQpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWlzUmVnaW9uICYmICFpc01lc2gpIHtcbiAgICAgICAgICAgICAgICBjbGlwcGVyLmNsaXBFbmRXaXRoU2xvdChzbG90KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0ZXJpYWwgPSBfZ2V0U2xvdE1hdGVyaWFsKGF0dGFjaG1lbnQucmVnaW9uLnRleHR1cmUuX3RleHR1cmUsIHNsb3QuZGF0YS5ibGVuZE1vZGUpO1xuICAgICAgICAgICAgaWYgKCFtYXRlcmlhbCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX211c3RGbHVzaCB8fCBtYXRlcmlhbC5nZXRIYXNoKCkgIT09IF9yZW5kZXJlci5tYXRlcmlhbC5nZXRIYXNoKCkpIHtcbiAgICAgICAgICAgICAgICBfbXVzdEZsdXNoID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgX3JlbmRlcmVyLl9mbHVzaCgpO1xuICAgICAgICAgICAgICAgIF9yZW5kZXJlci5ub2RlID0gX25vZGU7XG4gICAgICAgICAgICAgICAgX3JlbmRlcmVyLm1hdGVyaWFsID0gbWF0ZXJpYWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpc1JlZ2lvbikge1xuXG4gICAgICAgICAgICAgICAgdHJpYW5nbGVzID0gX3F1YWRUcmlhbmdsZXM7XG5cbiAgICAgICAgICAgICAgICAvLyBpbnN1cmUgY2FwYWNpdHlcbiAgICAgICAgICAgICAgICBfdmVydGV4RmxvYXRDb3VudCA9IDQgKiBfcGVyVmVydGV4U2l6ZTtcbiAgICAgICAgICAgICAgICBfaW5kZXhDb3VudCA9IDY7XG5cbiAgICAgICAgICAgICAgICBvZmZzZXRJbmZvID0gX2J1ZmZlci5yZXF1ZXN0KDQsIDYpO1xuICAgICAgICAgICAgICAgIF9pbmRleE9mZnNldCA9IG9mZnNldEluZm8uaW5kaWNlT2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICBfdmVydGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby52ZXJ0ZXhPZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgIF92ZXJ0ZXhGbG9hdE9mZnNldCA9IG9mZnNldEluZm8uYnl0ZU9mZnNldCA+PiAyO1xuICAgICAgICAgICAgICAgIHZidWYgPSBfYnVmZmVyLl92RGF0YSxcbiAgICAgICAgICAgICAgICAgICAgaWJ1ZiA9IF9idWZmZXIuX2lEYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8gY29tcHV0ZSB2ZXJ0ZXggYW5kIGZpbGwgeCB5XG4gICAgICAgICAgICAgICAgLy8gYXR0YWNobWVudC5jb21wdXRlV29ybGRWZXJ0aWNlcyhzbG90LmJvbmUsIHZidWYsIF92ZXJ0ZXhGbG9hdE9mZnNldCwgX3BlclZlcnRleFNpemUpO1xuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnQuY29tcHV0ZVdvcmxkVmVydGljZXMoc2xvdC5ib25lLCBfcmVhbHRpbWVWZXJ0aWNlcywgMCwgX3JlYWx0aW1lU2l6ZVBlclZlcnRleCk7XG5cbiAgICAgICAgICAgICAgICAvL+WwhuatpHNsb3TnmoTpobbngrnlhpnlhaXnvJPlrZjljLpcbiAgICAgICAgICAgICAgICB0aGlzLl93cml0ZVZlcnRleDJUb1ZlcnRleDNCdWZmZXIoX3JlYWx0aW1lVmVydGljZXMsIHZidWYsIF92ZXJ0ZXhGbG9hdE9mZnNldCwgNCwgc2xvdElkeCk7XG5cbiAgICAgICAgICAgICAgICAvLyBkcmF3IGRlYnVnIHNsb3RzIGlmIGVuYWJsZWQgZ3JhcGhpY3NcbiAgICAgICAgICAgICAgICBpZiAoZ3JhcGhpY3MgJiYgX2RlYnVnU2xvdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3Muc3Ryb2tlQ29sb3IgPSBfc2xvdENvbG9yO1xuICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5tb3ZlVG8odmJ1ZltfdmVydGV4RmxvYXRPZmZzZXRdLCB2YnVmW192ZXJ0ZXhGbG9hdE9mZnNldCArIDFdKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaWkgPSBfdmVydGV4RmxvYXRPZmZzZXQgKyBfcGVyVmVydGV4U2l6ZSwgbm4gPSBfdmVydGV4RmxvYXRPZmZzZXQgKyBfdmVydGV4RmxvYXRDb3VudDsgaWkgPCBubjsgaWkgKz0gX3BlclZlcnRleFNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLmxpbmVUbyh2YnVmW2lpXSwgdmJ1ZltpaSArIDFdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5zdHJva2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc01lc2gpIHtcblxuICAgICAgICAgICAgICAgIHRyaWFuZ2xlcyA9IGF0dGFjaG1lbnQudHJpYW5nbGVzO1xuXG4gICAgICAgICAgICAgICAgLy8gaW5zdXJlIGNhcGFjaXR5XG4gICAgICAgICAgICAgICAgX3ZlcnRleEZsb2F0Q291bnQgPSAoYXR0YWNobWVudC53b3JsZFZlcnRpY2VzTGVuZ3RoID4+IDEpICogX3BlclZlcnRleFNpemU7XG4gICAgICAgICAgICAgICAgX2luZGV4Q291bnQgPSB0cmlhbmdsZXMubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgb2Zmc2V0SW5mbyA9IF9idWZmZXIucmVxdWVzdChfdmVydGV4RmxvYXRDb3VudCAvIF9wZXJWZXJ0ZXhTaXplLCBfaW5kZXhDb3VudCk7XG4gICAgICAgICAgICAgICAgX2luZGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby5pbmRpY2VPZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgIF92ZXJ0ZXhPZmZzZXQgPSBvZmZzZXRJbmZvLnZlcnRleE9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgX3ZlcnRleEZsb2F0T2Zmc2V0ID0gb2Zmc2V0SW5mby5ieXRlT2Zmc2V0ID4+IDI7XG4gICAgICAgICAgICAgICAgdmJ1ZiA9IF9idWZmZXIuX3ZEYXRhLFxuICAgICAgICAgICAgICAgICAgICBpYnVmID0gX2J1ZmZlci5faURhdGE7XG5cbiAgICAgICAgICAgICAgICAvLyBjb21wdXRlIHZlcnRleCBhbmQgZmlsbCB4IHlcbiAgICAgICAgICAgICAgICAvLyBhdHRhY2htZW50LmNvbXB1dGVXb3JsZFZlcnRpY2VzKHNsb3QsIDAsIGF0dGFjaG1lbnQud29ybGRWZXJ0aWNlc0xlbmd0aCwgdmJ1ZiwgX3ZlcnRleEZsb2F0T2Zmc2V0LCBfcGVyVmVydGV4U2l6ZSk7XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudC5jb21wdXRlV29ybGRWZXJ0aWNlcyhzbG90LCAwLCBhdHRhY2htZW50LndvcmxkVmVydGljZXNMZW5ndGgsIF9yZWFsdGltZVZlcnRpY2VzLCAwLCBfcmVhbHRpbWVTaXplUGVyVmVydGV4KTtcblxuICAgICAgICAgICAgICAgIC8v5bCG5q2kc2xvdOeahOmhtueCueWGmeWFpee8k+WtmOWMulxuICAgICAgICAgICAgICAgIHRoaXMuX3dyaXRlVmVydGV4MlRvVmVydGV4M0J1ZmZlcihfcmVhbHRpbWVWZXJ0aWNlcywgdmJ1ZiwgX3ZlcnRleEZsb2F0T2Zmc2V0LCBfdmVydGV4RmxvYXRDb3VudCAvIF9wZXJWZXJ0ZXhTaXplLCBzbG90SWR4KTtcblxuICAgICAgICAgICAgICAgIC8vIGRyYXcgZGVidWcgbWVzaCBpZiBlbmFibGVkIGdyYXBoaWNzXG4gICAgICAgICAgICAgICAgaWYgKGdyYXBoaWNzICYmIF9kZWJ1Z01lc2gpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3Muc3Ryb2tlQ29sb3IgPSBfbWVzaENvbG9yO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGlpID0gMCwgbm4gPSB0cmlhbmdsZXMubGVuZ3RoOyBpaSA8IG5uOyBpaSArPSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdjEgPSB0cmlhbmdsZXNbaWldICogX3BlclZlcnRleFNpemUgKyBfdmVydGV4RmxvYXRPZmZzZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdjIgPSB0cmlhbmdsZXNbaWkgKyAxXSAqIF9wZXJWZXJ0ZXhTaXplICsgX3ZlcnRleEZsb2F0T2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHYzID0gdHJpYW5nbGVzW2lpICsgMl0gKiBfcGVyVmVydGV4U2l6ZSArIF92ZXJ0ZXhGbG9hdE9mZnNldDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MubW92ZVRvKHZidWZbdjFdLCB2YnVmW3YxICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MubGluZVRvKHZidWZbdjJdLCB2YnVmW3YyICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MubGluZVRvKHZidWZbdjNdLCB2YnVmW3YzICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLnN0cm9rZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX3ZlcnRleEZsb2F0Q291bnQgPT0gMCB8fCBfaW5kZXhDb3VudCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgY2xpcHBlci5jbGlwRW5kV2l0aFNsb3Qoc2xvdCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGZpbGwgaW5kaWNlc1xuICAgICAgICAgICAgaWJ1Zi5zZXQodHJpYW5nbGVzLCBfaW5kZXhPZmZzZXQpO1xuXG4gICAgICAgICAgICAvLyBmaWxsIHUgdlxuICAgICAgICAgICAgdXZzID0gYXR0YWNobWVudC51dnM7XG4gICAgICAgICAgICBmb3IgKGxldCB2ID0gX3ZlcnRleEZsb2F0T2Zmc2V0LCBuID0gX3ZlcnRleEZsb2F0T2Zmc2V0ICsgX3ZlcnRleEZsb2F0Q291bnQsIHUgPSAwOyB2IDwgbjsgdiArPSBfcGVyVmVydGV4U2l6ZSwgdSArPSAyKSB7XG4gICAgICAgICAgICAgICAgdmJ1Zlt2ICsgM10gPSB1dnNbdV07ICAgICAgICAgICAvLyB1XG4gICAgICAgICAgICAgICAgdmJ1Zlt2ICsgNF0gPSB1dnNbdSArIDFdOyAgICAgICAvLyB2XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF0dGFjaG1lbnRDb2xvciA9IGF0dGFjaG1lbnQuY29sb3IsXG4gICAgICAgICAgICAgICAgc2xvdENvbG9yID0gc2xvdC5jb2xvcjtcblxuICAgICAgICAgICAgdGhpcy5maWxsVmVydGljZXMoc2tlbGV0b25Db2xvciwgYXR0YWNobWVudENvbG9yLCBzbG90Q29sb3IsIGNsaXBwZXIsIHNsb3QsIHNsb3RJZHgpO1xuXG4gICAgICAgICAgICAvLyByZXNldCBidWZmZXIgcG9pbnRlciwgYmVjYXVzZSBjbGlwcGVyIG1heWJlIHJlYWxsb2MgYSBuZXcgYnVmZmVyIGluIGZpbGUgVmVydGljZXMgZnVuY3Rpb24uXG4gICAgICAgICAgICB2YnVmID0gX2J1ZmZlci5fdkRhdGEsXG4gICAgICAgICAgICAgICAgaWJ1ZiA9IF9idWZmZXIuX2lEYXRhO1xuXG4gICAgICAgICAgICBpZiAoX2luZGV4Q291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaWkgPSBfaW5kZXhPZmZzZXQsIG5uID0gX2luZGV4T2Zmc2V0ICsgX2luZGV4Q291bnQ7IGlpIDwgbm47IGlpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWJ1ZltpaV0gKz0gX3ZlcnRleE9mZnNldDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAod29ybGRNYXQpIHtcbiAgICAgICAgICAgICAgICAgICAgd29ybGRNYXRtID0gd29ybGRNYXQubTtcbiAgICAgICAgICAgICAgICAgICAgX20wMCA9IHdvcmxkTWF0bVswXTtcbiAgICAgICAgICAgICAgICAgICAgX20wNCA9IHdvcmxkTWF0bVs0XTtcbiAgICAgICAgICAgICAgICAgICAgX20xMiA9IHdvcmxkTWF0bVsxMl07XG4gICAgICAgICAgICAgICAgICAgIF9tMDEgPSB3b3JsZE1hdG1bMV07XG4gICAgICAgICAgICAgICAgICAgIF9tMDUgPSB3b3JsZE1hdG1bNV07XG4gICAgICAgICAgICAgICAgICAgIF9tMTMgPSB3b3JsZE1hdG1bMTNdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpaSA9IF92ZXJ0ZXhGbG9hdE9mZnNldCwgbm4gPSBfdmVydGV4RmxvYXRPZmZzZXQgKyBfdmVydGV4RmxvYXRDb3VudDsgaWkgPCBubjsgaWkgKz0gX3BlclZlcnRleFNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF94ID0gdmJ1ZltpaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBfeSA9IHZidWZbaWkgKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZidWZbaWldID0gX3ggKiBfbTAwICsgX3kgKiBfbTA0ICsgX20xMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZidWZbaWkgKyAxXSA9IF94ICogX20wMSArIF95ICogX20wNSArIF9tMTM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX2J1ZmZlci5hZGp1c3QoX3ZlcnRleEZsb2F0Q291bnQgLyBfcGVyVmVydGV4U2l6ZSwgX2luZGV4Q291bnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjbGlwcGVyLmNsaXBFbmRXaXRoU2xvdChzbG90KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNsaXBwZXIuY2xpcEVuZCgpO1xuXG4gICAgICAgIGlmIChncmFwaGljcyAmJiBfZGVidWdCb25lcykge1xuICAgICAgICAgICAgbGV0IGJvbmU7XG4gICAgICAgICAgICBncmFwaGljcy5zdHJva2VDb2xvciA9IF9ib25lQ29sb3I7XG4gICAgICAgICAgICBncmFwaGljcy5maWxsQ29sb3IgPSBfc2xvdENvbG9yOyAvLyBSb290IGJvbmUgY29sb3IgaXMgc2FtZSBhcyBzbG90IGNvbG9yLlxuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IGxvY1NrZWxldG9uLmJvbmVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgICAgIGJvbmUgPSBsb2NTa2VsZXRvbi5ib25lc1tpXTtcbiAgICAgICAgICAgICAgICBsZXQgeCA9IGJvbmUuZGF0YS5sZW5ndGggKiBib25lLmEgKyBib25lLndvcmxkWDtcbiAgICAgICAgICAgICAgICBsZXQgeSA9IGJvbmUuZGF0YS5sZW5ndGggKiBib25lLmMgKyBib25lLndvcmxkWTtcblxuICAgICAgICAgICAgICAgIC8vIEJvbmUgbGVuZ3Rocy5cbiAgICAgICAgICAgICAgICBncmFwaGljcy5tb3ZlVG8oYm9uZS53b3JsZFgsIGJvbmUud29ybGRZKTtcbiAgICAgICAgICAgICAgICBncmFwaGljcy5saW5lVG8oeCwgeSk7XG4gICAgICAgICAgICAgICAgZ3JhcGhpY3Muc3Ryb2tlKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBCb25lIG9yaWdpbnMuXG4gICAgICAgICAgICAgICAgZ3JhcGhpY3MuY2lyY2xlKGJvbmUud29ybGRYLCBib25lLndvcmxkWSwgTWF0aC5QSSAqIDEuNSk7XG4gICAgICAgICAgICAgICAgZ3JhcGhpY3MuZmlsbCgpO1xuICAgICAgICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLmZpbGxDb2xvciA9IF9vcmlnaW5Db2xvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfd3JpdGVWZXJ0ZXgyVG9WZXJ0ZXgzQnVmZmVyKHZlcnRleDJBcnJheSwgdmVydGV4M0J1ZmZlciwgb2Zmc2V0LCB2ZXJ0ZXhDb3VudCwgc2xvdElkeCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZlcnRleENvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGxldCBkc3RPZmZzZXQgPSBpICogX3BlclZlcnRleFNpemUgKyBvZmZzZXQ7XG4gICAgICAgICAgICBsZXQgc3JjT2Zmc2V0ID0gaSAqIF9yZWFsdGltZVNpemVQZXJWZXJ0ZXg7XG5cbiAgICAgICAgICAgIHZlcnRleDNCdWZmZXJbZHN0T2Zmc2V0XSA9IHZlcnRleDJBcnJheVtzcmNPZmZzZXRdOyAgICAgICAgIC8veFxuICAgICAgICAgICAgdmVydGV4M0J1ZmZlcltkc3RPZmZzZXQgKyAxXSA9IHZlcnRleDJBcnJheVtzcmNPZmZzZXQgKyAxXTsgLy95XG4gICAgICAgICAgICB2ZXJ0ZXgzQnVmZmVyW2RzdE9mZnNldCArIDJdID0gX2RlcHRoIC0gREVQVEhfUkFURSAqIHNsb3RJZHg7ICAgICAgICAgIC8velxuICAgICAgICAgICAgdmVydGV4M0J1ZmZlcltkc3RPZmZzZXQgKyAzXSA9IHZlcnRleDJBcnJheVtzcmNPZmZzZXQgKyAyXTsgLy91XG4gICAgICAgICAgICB2ZXJ0ZXgzQnVmZmVyW2RzdE9mZnNldCArIDRdID0gdmVydGV4MkFycmF5W3NyY09mZnNldCArIDNdOyAvL3ZcbiAgICAgICAgICAgIHZlcnRleDNCdWZmZXJbZHN0T2Zmc2V0ICsgNV0gPSB2ZXJ0ZXgyQXJyYXlbc3JjT2Zmc2V0ICsgNF07IC8vYzFcbiAgICAgICAgICAgIGlmIChfdXNlVGludCkge1xuICAgICAgICAgICAgICAgIHZlcnRleDNCdWZmZXJbZHN0T2Zmc2V0ICsgNl0gPSB2ZXJ0ZXgyQXJyYXlbc3JjT2Zmc2V0ICsgNV07IC8vYzJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNhY2hlVHJhdmVyc2Uod29ybGRNYXQpIHtcblxuICAgICAgICBsZXQgZnJhbWUgPSBfY29tcC5fY3VyRnJhbWU7XG4gICAgICAgIGlmICghZnJhbWUpIHJldHVybjtcblxuICAgICAgICBsZXQgc2VnbWVudHMgPSBmcmFtZS5zZWdtZW50cztcbiAgICAgICAgaWYgKHNlZ21lbnRzLmxlbmd0aCA9PSAwKSByZXR1cm47XG5cbiAgICAgICAgbGV0IG9mZnNldHMgPSBmcmFtZS5vZmZzZXRzO1xuXG4gICAgICAgIGxldCB2YnVmLCBpYnVmLCB1aW50YnVmO1xuICAgICAgICBsZXQgbWF0ZXJpYWw7XG4gICAgICAgIGxldCBvZmZzZXRJbmZvO1xuICAgICAgICBsZXQgdmVydGljZXMgPSBmcmFtZS52ZXJ0aWNlcztcbiAgICAgICAgbGV0IGluZGljZXMgPSBmcmFtZS5pbmRpY2VzO1xuICAgICAgICBsZXQgd29ybGRNYXRtO1xuXG4gICAgICAgIGxldCBmcmFtZVZGT2Zmc2V0ID0gMCwgZnJhbWVJbmRleE9mZnNldCA9IDAsIHNlZ1ZGQ291bnQgPSAwO1xuICAgICAgICBpZiAod29ybGRNYXQpIHtcbiAgICAgICAgICAgIHdvcmxkTWF0bSA9IHdvcmxkTWF0Lm07XG4gICAgICAgICAgICBfbTAwID0gd29ybGRNYXRtWzBdO1xuICAgICAgICAgICAgX20wMSA9IHdvcmxkTWF0bVsxXTtcbiAgICAgICAgICAgIF9tMDQgPSB3b3JsZE1hdG1bNF07XG4gICAgICAgICAgICBfbTA1ID0gd29ybGRNYXRtWzVdO1xuICAgICAgICAgICAgX20xMiA9IHdvcmxkTWF0bVsxMl07XG4gICAgICAgICAgICBfbTEzID0gd29ybGRNYXRtWzEzXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBqdXN0VHJhbnNsYXRlID0gX20wMCA9PT0gMSAmJiBfbTAxID09PSAwICYmIF9tMDQgPT09IDAgJiYgX20wNSA9PT0gMTtcbiAgICAgICAgbGV0IG5lZWRCYXRjaCA9IChfaGFuZGxlVmFsICYgRkxBR19CQVRDSCk7XG4gICAgICAgIGxldCBjYWxjVHJhbnNsYXRlID0gbmVlZEJhdGNoICYmIGp1c3RUcmFuc2xhdGU7XG5cbiAgICAgICAgbGV0IGNvbG9yT2Zmc2V0ID0gMDtcbiAgICAgICAgbGV0IGNvbG9ycyA9IGZyYW1lLmNvbG9ycztcbiAgICAgICAgbGV0IG5vd0NvbG9yID0gY29sb3JzW2NvbG9yT2Zmc2V0KytdO1xuICAgICAgICBsZXQgbWF4VkZPZmZzZXQgPSBub3dDb2xvci52Zk9mZnNldDtcbiAgICAgICAgX2hhbmRsZUNvbG9yKG5vd0NvbG9yKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IHNlZ21lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgbGV0IHNlZ0luZm8gPSBzZWdtZW50c1tpXTtcbiAgICAgICAgICAgIG1hdGVyaWFsID0gX2dldFNsb3RNYXRlcmlhbChzZWdJbmZvLnRleCwgc2VnSW5mby5ibGVuZE1vZGUpO1xuICAgICAgICAgICAgaWYgKCFtYXRlcmlhbCkgY29udGludWU7XG5cbiAgICAgICAgICAgIGlmIChfbXVzdEZsdXNoIHx8IG1hdGVyaWFsLmdldEhhc2goKSAhPT0gX3JlbmRlcmVyLm1hdGVyaWFsLmdldEhhc2goKSkge1xuICAgICAgICAgICAgICAgIF9tdXN0Rmx1c2ggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBfcmVuZGVyZXIuX2ZsdXNoKCk7XG4gICAgICAgICAgICAgICAgX3JlbmRlcmVyLm5vZGUgPSBfbm9kZTtcbiAgICAgICAgICAgICAgICBfcmVuZGVyZXIubWF0ZXJpYWwgPSBtYXRlcmlhbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX3ZlcnRleENvdW50ID0gc2VnSW5mby52ZXJ0ZXhDb3VudDtcbiAgICAgICAgICAgIF9pbmRleENvdW50ID0gc2VnSW5mby5pbmRleENvdW50O1xuXG4gICAgICAgICAgICBvZmZzZXRJbmZvID0gX2J1ZmZlci5yZXF1ZXN0KF92ZXJ0ZXhDb3VudCwgX2luZGV4Q291bnQpO1xuICAgICAgICAgICAgX2luZGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby5pbmRpY2VPZmZzZXQ7XG4gICAgICAgICAgICBfdmVydGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby52ZXJ0ZXhPZmZzZXQ7XG4gICAgICAgICAgICBfdmZPZmZzZXQgPSBvZmZzZXRJbmZvLmJ5dGVPZmZzZXQgPj4gMjtcbiAgICAgICAgICAgIHZidWYgPSBfYnVmZmVyLl92RGF0YTtcbiAgICAgICAgICAgIGlidWYgPSBfYnVmZmVyLl9pRGF0YTtcbiAgICAgICAgICAgIHVpbnRidWYgPSBfYnVmZmVyLl91aW50VkRhdGE7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGlpID0gX2luZGV4T2Zmc2V0LCBpbCA9IF9pbmRleE9mZnNldCArIF9pbmRleENvdW50OyBpaSA8IGlsOyBpaSsrKSB7XG4gICAgICAgICAgICAgICAgaWJ1ZltpaV0gPSBfdmVydGV4T2Zmc2V0ICsgaW5kaWNlc1tmcmFtZUluZGV4T2Zmc2V0KytdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWdWRkNvdW50ID0gc2VnSW5mby52ZkNvdW50O1xuICAgICAgICAgICAgbGV0IHJlbmRlclZlcnRleENvdW50ID0gX3ZlcnRleENvdW50ICogX3BlclZlcnRleFNpemU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IF92ZXJ0ZXhDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRzdE9mZnNldCA9IF92Zk9mZnNldCArIGkgKiA3O1xuICAgICAgICAgICAgICAgIGxldCBzcmNPZmZzZXQgPSBmcmFtZVZGT2Zmc2V0ICsgaSAqIDY7XG5cbiAgICAgICAgICAgICAgICB2YnVmW2RzdE9mZnNldF0gPSB2ZXJ0aWNlc1tzcmNPZmZzZXRdO1xuICAgICAgICAgICAgICAgIHZidWZbZHN0T2Zmc2V0ICsgMV0gPSB2ZXJ0aWNlc1tzcmNPZmZzZXQgKyAxXTtcbiAgICAgICAgICAgICAgICBsZXQgaiwgbGVuO1xuICAgICAgICAgICAgICAgIGZvciAoaiA9IDAsIGxlbiA9IG9mZnNldHMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNyY09mZnNldCA8PSBvZmZzZXRzW2pdKSBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmJ1Zltkc3RPZmZzZXQgKyAyXSA9IF9kZXB0aCAtIERFUFRIX1JBVEUgKiBqOyAgIC8vdG9kbyBkZXB0aCArIOiHquW3sea3seW6plxuICAgICAgICAgICAgICAgIHZidWZbZHN0T2Zmc2V0ICsgM10gPSB2ZXJ0aWNlc1tzcmNPZmZzZXQgKyAyXTtcbiAgICAgICAgICAgICAgICB2YnVmW2RzdE9mZnNldCArIDRdID0gdmVydGljZXNbc3JjT2Zmc2V0ICsgM107XG4gICAgICAgICAgICAgICAgdmJ1Zltkc3RPZmZzZXQgKyA1XSA9IHZlcnRpY2VzW3NyY09mZnNldCArIDRdO1xuICAgICAgICAgICAgICAgIHZidWZbZHN0T2Zmc2V0ICsgNl0gPSB2ZXJ0aWNlc1tzcmNPZmZzZXQgKyA1XTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdmJ1Zi5zZXQodmVydGljZXMuc3ViYXJyYXkoZnJhbWVWRk9mZnNldCwgZnJhbWVWRk9mZnNldCArIHNlZ1ZGQ291bnQpLCBfdmZPZmZzZXQpO1xuICAgICAgICAgICAgZnJhbWVWRk9mZnNldCArPSBzZWdWRkNvdW50O1xuXG4gICAgICAgICAgICBpZiAoY2FsY1RyYW5zbGF0ZSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGlpID0gX3ZmT2Zmc2V0LCBpbCA9IF92Zk9mZnNldCArIHJlbmRlclZlcnRleENvdW50OyBpaSA8IGlsOyBpaSArPSA3KSB7XG4gICAgICAgICAgICAgICAgICAgIHZidWZbaWldICs9IF9tMTI7XG4gICAgICAgICAgICAgICAgICAgIHZidWZbaWkgKyAxXSArPSBfbTEzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobmVlZEJhdGNoKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaWkgPSBfdmZPZmZzZXQsIGlsID0gX3ZmT2Zmc2V0ICsgcmVuZGVyVmVydGV4Q291bnQ7IGlpIDwgaWw7IGlpICs9IDcpIHtcbiAgICAgICAgICAgICAgICAgICAgX3ggPSB2YnVmW2lpXTtcbiAgICAgICAgICAgICAgICAgICAgX3kgPSB2YnVmW2lpICsgMV07XG4gICAgICAgICAgICAgICAgICAgIHZidWZbaWldID0gX3ggKiBfbTAwICsgX3kgKiBfbTA0ICsgX20xMjtcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltpaSArIDFdID0gX3ggKiBfbTAxICsgX3kgKiBfbTA1ICsgX20xMztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF9idWZmZXIuYWRqdXN0KF92ZXJ0ZXhDb3VudCwgX2luZGV4Q291bnQpO1xuICAgICAgICAgICAgaWYgKCFfbmVlZENvbG9yKSBjb250aW51ZTtcblxuICAgICAgICAgICAgLy8gaGFuZGxlIGNvbG9yXG4gICAgICAgICAgICBsZXQgZnJhbWVDb2xvck9mZnNldCA9IGZyYW1lVkZPZmZzZXQgLSBzZWdWRkNvdW50O1xuICAgICAgICAgICAgZm9yIChsZXQgaWkgPSBfdmZPZmZzZXQgKyA1LCBpbCA9IF92Zk9mZnNldCArIDUgKyBzZWdWRkNvdW50OyBpaSA8IGlsOyBpaSArPSA3LCBmcmFtZUNvbG9yT2Zmc2V0ICs9IDYpIHtcbiAgICAgICAgICAgICAgICBpZiAoZnJhbWVDb2xvck9mZnNldCA+PSBtYXhWRk9mZnNldCkge1xuICAgICAgICAgICAgICAgICAgICBub3dDb2xvciA9IGNvbG9yc1tjb2xvck9mZnNldCsrXTtcbiAgICAgICAgICAgICAgICAgICAgX2hhbmRsZUNvbG9yKG5vd0NvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgbWF4VkZPZmZzZXQgPSBub3dDb2xvci52Zk9mZnNldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdWludGJ1ZltpaV0gPSBfZmluYWxDb2xvcjMyO1xuICAgICAgICAgICAgICAgIHVpbnRidWZbaWkgKyAxXSA9IF9kYXJrQ29sb3IzMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbGxCdWZmZXJzKGNvbXAsIHJlbmRlcmVyKSB7XG5cbiAgICAgICAgbGV0IG5vZGUgPSBjb21wLm5vZGU7XG4gICAgICAgIG5vZGUuX3JlbmRlckZsYWcgfD0gUmVuZGVyRmxvdy5GTEFHX1VQREFURV9SRU5ERVJfREFUQTtcbiAgICAgICAgaWYgKCFjb21wLl9za2VsZXRvbikgcmV0dXJuO1xuXG4gICAgICAgIGxldCBub2RlQ29sb3IgPSBub2RlLl9jb2xvcjtcbiAgICAgICAgX25vZGVSID0gbm9kZUNvbG9yLnIgLyAyNTU7XG4gICAgICAgIF9ub2RlRyA9IG5vZGVDb2xvci5nIC8gMjU1O1xuICAgICAgICBfbm9kZUIgPSBub2RlQ29sb3IuYiAvIDI1NTtcbiAgICAgICAgX25vZGVBID0gbm9kZUNvbG9yLmEgLyAyNTU7XG5cbiAgICAgICAgX3VzZVRpbnQgPSBjb21wLnVzZVRpbnQgfHwgY29tcC5pc0FuaW1hdGlvbkNhY2hlZCgpO1xuICAgICAgICBfdmVydGV4Rm9ybWF0ID0gX3VzZVRpbnQgPyBWRlR3b0NvbG9yIDogVkZPbmVDb2xvcjtcbiAgICAgICAgLy8geCB5IHogdSB2IGNvbG9yMSBjb2xvcjIgb3IgeCB5IHUgdiBjb2xvclxuICAgICAgICBfcGVyVmVydGV4U2l6ZSA9IF91c2VUaW50ID8gNyA6IDY7XG4gICAgICAgIF9yZWFsdGltZVNpemVQZXJWZXJ0ZXggPSBfdXNlVGludCA/IDYgOiA1O1xuXG4gICAgICAgIF9ub2RlID0gY29tcC5ub2RlO1xuICAgICAgICBfYnVmZmVyID0gcmVuZGVyZXIuZ2V0QnVmZmVyKCdzcGluZScsIF92ZXJ0ZXhGb3JtYXQpO1xuICAgICAgICBfcmVuZGVyZXIgPSByZW5kZXJlcjtcbiAgICAgICAgX2NvbXAgPSBjb21wO1xuICAgICAgICBfZGVwdGggPSBfbm9kZS5kZXB0aCB8fCAwO1xuXG4gICAgICAgIF9tdXN0Rmx1c2ggPSB0cnVlO1xuICAgICAgICBfcHJlbXVsdGlwbGllZEFscGhhID0gY29tcC5wcmVtdWx0aXBsaWVkQWxwaGE7XG4gICAgICAgIF9tdWx0aXBsaWVyID0gMS4wO1xuICAgICAgICBfaGFuZGxlVmFsID0gMHgwMDtcbiAgICAgICAgX25lZWRDb2xvciA9IGZhbHNlO1xuICAgICAgICBfdmVydGV4RWZmZWN0ID0gY29tcC5fZWZmZWN0RGVsZWdhdGUgJiYgY29tcC5fZWZmZWN0RGVsZWdhdGUuX3ZlcnRleEVmZmVjdDtcblxuICAgICAgICBpZiAobm9kZUNvbG9yLl92YWwgIT09IDB4ZmZmZmZmZmYgfHwgX3ByZW11bHRpcGxpZWRBbHBoYSkge1xuICAgICAgICAgICAgX25lZWRDb2xvciA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3VzZVRpbnQpIHtcbiAgICAgICAgICAgIF9oYW5kbGVWYWwgfD0gRkxBR19UV09fQ09MT1I7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgd29ybGRNYXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChfY29tcC5lbmFibGVCYXRjaCkge1xuICAgICAgICAgICAgd29ybGRNYXQgPSBfbm9kZS5fd29ybGRNYXRyaXg7XG4gICAgICAgICAgICBfbXVzdEZsdXNoID0gZmFsc2U7XG4gICAgICAgICAgICBfaGFuZGxlVmFsIHw9IEZMQUdfQkFUQ0g7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29tcC5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICAvLyBUcmF2ZXJzZSBpbnB1dCBhc3NlbWJsZXIuXG4gICAgICAgICAgICB0aGlzLmNhY2hlVHJhdmVyc2Uod29ybGRNYXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF92ZXJ0ZXhFZmZlY3QpIF92ZXJ0ZXhFZmZlY3QuYmVnaW4oY29tcC5fc2tlbGV0b24pO1xuICAgICAgICAgICAgdGhpcy5yZWFsVGltZVRyYXZlcnNlKHdvcmxkTWF0KTtcbiAgICAgICAgICAgIGlmIChfdmVydGV4RWZmZWN0KSBfdmVydGV4RWZmZWN0LmVuZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc3luYyBhdHRhY2hlZCBub2RlIG1hdHJpeFxuICAgICAgICByZW5kZXJlci53b3JsZE1hdERpcnR5Kys7XG4gICAgICAgIGNvbXAuYXR0YWNoVXRpbC5fc3luY0F0dGFjaGVkTm9kZSgpO1xuXG4gICAgICAgIC8vIENsZWFyIHRlbXAgdmFyLlxuICAgICAgICBfbm9kZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgX2J1ZmZlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgX3JlbmRlcmVyID0gdW5kZWZpbmVkO1xuICAgICAgICBfY29tcCA9IHVuZGVmaW5lZDtcbiAgICAgICAgX3ZlcnRleEVmZmVjdCA9IG51bGw7XG4gICAgfVxuXG4gICAgcG9zdEZpbGxCdWZmZXJzKGNvbXAsIHJlbmRlcmVyKSB7XG4gICAgICAgIHJlbmRlcmVyLndvcmxkTWF0RGlydHktLTtcbiAgICB9XG59XG5cbkFzc2VtYmxlci5yZWdpc3RlcihTa2VsZXRvbiwgU3BpbmVBc3NlbWJsZXIpO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=