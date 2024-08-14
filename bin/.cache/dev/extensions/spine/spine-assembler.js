
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
    return _Assembler.apply(this, arguments) || this;
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

      vertex3Buffer[dstOffset + 2] = _depth - 1e-6 * slotIdx; //z

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

        vbuf[dstOffset + 2] = _depth - 1e-6 * j; //todo depth + 自己深度

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvZXh0ZW5zaW9ucy9zcGluZS9zcGluZS1hc3NlbWJsZXIuanMiXSwibmFtZXMiOlsiU2tlbGV0b24iLCJyZXF1aXJlIiwic3BpbmUiLCJSZW5kZXJGbG93IiwiVmVydGV4Rm9ybWF0IiwiVkZPbmVDb2xvciIsInZmbXQzRCIsIlZGVHdvQ29sb3IiLCJ2Zm10UG9zM1V2VHdvQ29sb3IiLCJnZngiLCJjYyIsIkZMQUdfQkFUQ0giLCJGTEFHX1RXT19DT0xPUiIsIl9oYW5kbGVWYWwiLCJfcXVhZFRyaWFuZ2xlcyIsIl9zbG90Q29sb3IiLCJjb2xvciIsIl9ib25lQ29sb3IiLCJfb3JpZ2luQ29sb3IiLCJfbWVzaENvbG9yIiwiX2ZpbmFsQ29sb3IiLCJfZGFya0NvbG9yIiwiX3RlbXBQb3MiLCJfdGVtcFV2IiwiQ0NfTkFUSVZFUkVOREVSRVIiLCJDb2xvciIsIlZlY3RvcjIiLCJfcHJlbXVsdGlwbGllZEFscGhhIiwiX211bHRpcGxpZXIiLCJfc2xvdFJhbmdlU3RhcnQiLCJfc2xvdFJhbmdlRW5kIiwiX3VzZVRpbnQiLCJfZGVidWdTbG90cyIsIl9kZWJ1Z0JvbmVzIiwiX2RlYnVnTWVzaCIsIl9ub2RlUiIsIl9ub2RlRyIsIl9ub2RlQiIsIl9ub2RlQSIsIl9maW5hbENvbG9yMzIiLCJfZGFya0NvbG9yMzIiLCJfdmVydGV4Rm9ybWF0IiwiX3BlclZlcnRleFNpemUiLCJfcGVyQ2xpcFZlcnRleFNpemUiLCJfdmVydGV4RmxvYXRDb3VudCIsIl92ZXJ0ZXhDb3VudCIsIl92ZXJ0ZXhGbG9hdE9mZnNldCIsIl92ZXJ0ZXhPZmZzZXQiLCJfaW5kZXhDb3VudCIsIl9pbmRleE9mZnNldCIsIl92Zk9mZnNldCIsIl90ZW1wciIsIl90ZW1wZyIsIl90ZW1wYiIsIl9pblJhbmdlIiwiX211c3RGbHVzaCIsIl94IiwiX3kiLCJfbTAwIiwiX20wNCIsIl9tMTIiLCJfbTAxIiwiX20wNSIsIl9tMTMiLCJfciIsIl9nIiwiX2IiLCJfZnIiLCJfZmciLCJfZmIiLCJfZmEiLCJfZHIiLCJfZGciLCJfZGIiLCJfZGEiLCJfY29tcCIsIl9idWZmZXIiLCJfcmVuZGVyZXIiLCJfbm9kZSIsIl9uZWVkQ29sb3IiLCJfdmVydGV4RWZmZWN0IiwiX2RlcHRoIiwiX3JlYWx0aW1lVmVydGljZXMiLCJfcmVhbHRpbWVTaXplUGVyVmVydGV4IiwiX2dldFNsb3RNYXRlcmlhbCIsInRleCIsImJsZW5kTW9kZSIsInNyYyIsImRzdCIsIkJsZW5kTW9kZSIsIkFkZGl0aXZlIiwibWFjcm8iLCJPTkUiLCJTUkNfQUxQSEEiLCJNdWx0aXBseSIsIkRTVF9DT0xPUiIsIk9ORV9NSU5VU19TUkNfQUxQSEEiLCJTY3JlZW4iLCJPTkVfTUlOVVNfU1JDX0NPTE9SIiwiTm9ybWFsIiwidXNlTW9kZWwiLCJlbmFibGVCYXRjaCIsImJhc2VNYXRlcmlhbCIsIl9tYXRlcmlhbHMiLCJrZXkiLCJnZXRJZCIsIm1hdGVyaWFsQ2FjaGUiLCJfbWF0ZXJpYWxDYWNoZSIsIm1hdGVyaWFsIiwiTWF0ZXJpYWxWYXJpYW50IiwiY3JlYXRlIiwiZGVmaW5lIiwic2V0UHJvcGVydHkiLCJzZXRCbGVuZCIsIkJMRU5EX0ZVTkNfQUREIiwiX2hhbmRsZUNvbG9yIiwiZmEiLCJmciIsImZnIiwiZmIiLCJkciIsImRnIiwiZGIiLCJfc3BpbmVDb2xvclRvSW50MzIiLCJzcGluZUNvbG9yIiwiYSIsImIiLCJnIiwiciIsIlNwaW5lQXNzZW1ibGVyIiwidXBkYXRlUmVuZGVyRGF0YSIsImNvbXAiLCJpc0FuaW1hdGlvbkNhY2hlZCIsInNrZWxldG9uIiwiX3NrZWxldG9uIiwidXBkYXRlV29ybGRUcmFuc2Zvcm0iLCJmaWxsVmVydGljZXMiLCJza2VsZXRvbkNvbG9yIiwiYXR0YWNobWVudENvbG9yIiwic2xvdENvbG9yIiwiY2xpcHBlciIsInNsb3QiLCJzbG90SWR4IiwidmJ1ZiIsIl92RGF0YSIsImlidWYiLCJfaURhdGEiLCJ1aW50VkRhdGEiLCJfdWludFZEYXRhIiwib2Zmc2V0SW5mbyIsImRhcmtDb2xvciIsInNldCIsInYiLCJuIiwieCIsInkiLCJ0cmFuc2Zvcm0iLCJ1dnMiLCJzdWJhcnJheSIsImNsaXBUcmlhbmdsZXMiLCJjbGlwcGVkVmVydGljZXMiLCJGbG9hdDMyQXJyYXkiLCJjbGlwcGVkVHJpYW5nbGVzIiwibGVuZ3RoIiwicmVxdWVzdCIsImluZGljZU9mZnNldCIsInZlcnRleE9mZnNldCIsImJ5dGVPZmZzZXQiLCJvZmZzZXQiLCJyZWFsVGltZVRyYXZlcnNlIiwid29ybGRNYXQiLCJsb2NTa2VsZXRvbiIsImdyYXBoaWNzIiwiX2RlYnVnUmVuZGVyZXIiLCJfY2xpcHBlciIsImF0dGFjaG1lbnQiLCJ0cmlhbmdsZXMiLCJpc1JlZ2lvbiIsImlzTWVzaCIsImlzQ2xpcCIsIndvcmxkTWF0bSIsIl9zdGFydFNsb3RJbmRleCIsIl9lbmRTbG90SW5kZXgiLCJkZWJ1Z1Nsb3RzIiwiZGVidWdCb25lcyIsImRlYnVnTWVzaCIsImNsZWFyIiwibGluZVdpZHRoIiwic2xvdENvdW50IiwiZHJhd09yZGVyIiwidW5kZWZpbmVkIiwiZGF0YSIsImluZGV4IiwiY2xpcEVuZFdpdGhTbG90IiwiZ2V0QXR0YWNobWVudCIsIlJlZ2lvbkF0dGFjaG1lbnQiLCJNZXNoQXR0YWNobWVudCIsIkNsaXBwaW5nQXR0YWNobWVudCIsImNsaXBTdGFydCIsInJlZ2lvbiIsInRleHR1cmUiLCJfdGV4dHVyZSIsImdldEhhc2giLCJfZmx1c2giLCJub2RlIiwiY29tcHV0ZVdvcmxkVmVydGljZXMiLCJib25lIiwiX3dyaXRlVmVydGV4MlRvVmVydGV4M0J1ZmZlciIsInN0cm9rZUNvbG9yIiwibW92ZVRvIiwiaWkiLCJubiIsImxpbmVUbyIsImNsb3NlIiwic3Ryb2tlIiwid29ybGRWZXJ0aWNlc0xlbmd0aCIsInYxIiwidjIiLCJ2MyIsInUiLCJtIiwiYWRqdXN0IiwiY2xpcEVuZCIsImZpbGxDb2xvciIsImkiLCJib25lcyIsIndvcmxkWCIsImMiLCJ3b3JsZFkiLCJjaXJjbGUiLCJNYXRoIiwiUEkiLCJmaWxsIiwidmVydGV4MkFycmF5IiwidmVydGV4M0J1ZmZlciIsInZlcnRleENvdW50IiwiZHN0T2Zmc2V0Iiwic3JjT2Zmc2V0IiwiY2FjaGVUcmF2ZXJzZSIsImZyYW1lIiwiX2N1ckZyYW1lIiwic2VnbWVudHMiLCJvZmZzZXRzIiwidWludGJ1ZiIsInZlcnRpY2VzIiwiaW5kaWNlcyIsImZyYW1lVkZPZmZzZXQiLCJmcmFtZUluZGV4T2Zmc2V0Iiwic2VnVkZDb3VudCIsImp1c3RUcmFuc2xhdGUiLCJuZWVkQmF0Y2giLCJjYWxjVHJhbnNsYXRlIiwiY29sb3JPZmZzZXQiLCJjb2xvcnMiLCJub3dDb2xvciIsIm1heFZGT2Zmc2V0IiwidmZPZmZzZXQiLCJzZWdJbmZvIiwiaW5kZXhDb3VudCIsImlsIiwidmZDb3VudCIsInJlbmRlclZlcnRleENvdW50IiwiaiIsImxlbiIsImZyYW1lQ29sb3JPZmZzZXQiLCJmaWxsQnVmZmVycyIsInJlbmRlcmVyIiwiX3JlbmRlckZsYWciLCJGTEFHX1VQREFURV9SRU5ERVJfREFUQSIsIm5vZGVDb2xvciIsIl9jb2xvciIsInVzZVRpbnQiLCJnZXRCdWZmZXIiLCJkZXB0aCIsInByZW11bHRpcGxpZWRBbHBoYSIsIl9lZmZlY3REZWxlZ2F0ZSIsIl92YWwiLCJfd29ybGRNYXRyaXgiLCJiZWdpbiIsImVuZCIsIndvcmxkTWF0RGlydHkiLCJhdHRhY2hVdGlsIiwiX3N5bmNBdHRhY2hlZE5vZGUiLCJwb3N0RmlsbEJ1ZmZlcnMiLCJBc3NlbWJsZXIiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7Ozs7Ozs7QUFFQSxJQUFNQSxRQUFRLEdBQUdDLE9BQU8sQ0FBQyxZQUFELENBQXhCOztBQUNBLElBQU1DLEtBQUssR0FBR0QsT0FBTyxDQUFDLGFBQUQsQ0FBckI7O0FBQ0EsSUFBTUUsVUFBVSxHQUFHRixPQUFPLENBQUMseUNBQUQsQ0FBMUI7O0FBQ0EsSUFBTUcsWUFBWSxHQUFHSCxPQUFPLENBQUMsaURBQUQsQ0FBNUI7O0FBQ0EsSUFBTUksVUFBVSxHQUFHRCxZQUFZLENBQUNFLE1BQWhDO0FBQ0EsSUFBTUMsVUFBVSxHQUFHSCxZQUFZLENBQUNJLGtCQUFoQztBQUNBLElBQU1DLEdBQUcsR0FBR0MsRUFBRSxDQUFDRCxHQUFmO0FBRUEsSUFBTUUsVUFBVSxHQUFHLElBQW5CO0FBQ0EsSUFBTUMsY0FBYyxHQUFHLElBQXZCO0FBRUEsSUFBSUMsVUFBVSxHQUFHLElBQWpCO0FBQ0EsSUFBSUMsY0FBYyxHQUFHLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsQ0FBckI7O0FBQ0EsSUFBSUMsVUFBVSxHQUFHTCxFQUFFLENBQUNNLEtBQUgsQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLEdBQWYsRUFBb0IsR0FBcEIsQ0FBakI7O0FBQ0EsSUFBSUMsVUFBVSxHQUFHUCxFQUFFLENBQUNNLEtBQUgsQ0FBUyxHQUFULEVBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixHQUFwQixDQUFqQjs7QUFDQSxJQUFJRSxZQUFZLEdBQUdSLEVBQUUsQ0FBQ00sS0FBSCxDQUFTLENBQVQsRUFBWSxHQUFaLEVBQWlCLENBQWpCLEVBQW9CLEdBQXBCLENBQW5COztBQUNBLElBQUlHLFVBQVUsR0FBR1QsRUFBRSxDQUFDTSxLQUFILENBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUIsQ0FBbkIsRUFBc0IsR0FBdEIsQ0FBakI7O0FBRUEsSUFBSUksV0FBVyxHQUFHLElBQWxCO0FBQ0EsSUFBSUMsVUFBVSxHQUFHLElBQWpCO0FBQ0EsSUFBSUMsUUFBUSxHQUFHLElBQWY7QUFBQSxJQUFxQkMsT0FBTyxHQUFHLElBQS9COztBQUNBLElBQUksQ0FBQ0MsaUJBQUwsRUFBd0I7QUFDcEJKLEVBQUFBLFdBQVcsR0FBRyxJQUFJbEIsS0FBSyxDQUFDdUIsS0FBVixDQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUF5QixDQUF6QixDQUFkO0FBQ0FKLEVBQUFBLFVBQVUsR0FBRyxJQUFJbkIsS0FBSyxDQUFDdUIsS0FBVixDQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUF5QixDQUF6QixDQUFiO0FBQ0FILEVBQUFBLFFBQVEsR0FBRyxJQUFJcEIsS0FBSyxDQUFDd0IsT0FBVixFQUFYO0FBQ0FILEVBQUFBLE9BQU8sR0FBRyxJQUFJckIsS0FBSyxDQUFDd0IsT0FBVixFQUFWO0FBQ0g7O0FBRUQsSUFBSUMsbUJBQUo7O0FBQ0EsSUFBSUMsV0FBSjs7QUFDQSxJQUFJQyxlQUFKOztBQUNBLElBQUlDLGFBQUo7O0FBQ0EsSUFBSUMsUUFBSjs7QUFDQSxJQUFJQyxXQUFKOztBQUNBLElBQUlDLFdBQUo7O0FBQ0EsSUFBSUMsVUFBSjs7QUFDQSxJQUFJQyxNQUFKLEVBQ0lDLE1BREosRUFFSUMsTUFGSixFQUdJQyxNQUhKOztBQUlBLElBQUlDLGFBQUosRUFBbUJDLFlBQW5COztBQUNBLElBQUlDLGFBQUo7O0FBQ0EsSUFBSUMsY0FBSjs7QUFDQSxJQUFJQyxrQkFBSjtBQUVBOzs7QUFDQSxJQUFJQyxpQkFBaUIsR0FBRyxDQUF4QjtBQUNBLElBQUlDLFlBQVksR0FBRyxDQUFuQjtBQUNBLElBQUlDLGtCQUFrQixHQUFHLENBQXpCO0FBQ0E7O0FBQ0EsSUFBSUMsYUFBYSxHQUFHLENBQXBCO0FBQ0E7O0FBQ0EsSUFBSUMsV0FBVyxHQUFHLENBQWxCO0FBQ0E7O0FBQ0EsSUFBSUMsWUFBWSxHQUFHLENBQW5CO0FBQ0EsSUFBSUMsU0FBUyxHQUFHLENBQWhCOztBQUVBLElBQUlDLE1BQUosRUFBWUMsTUFBWixFQUFvQkMsTUFBcEI7O0FBQ0EsSUFBSUMsUUFBSjs7QUFDQSxJQUFJQyxVQUFKOztBQUNBLElBQUlDLEVBQUosRUFBUUMsRUFBUixFQUFZQyxJQUFaLEVBQWtCQyxJQUFsQixFQUF3QkMsSUFBeEIsRUFBOEJDLElBQTlCLEVBQW9DQyxJQUFwQyxFQUEwQ0MsSUFBMUM7O0FBQ0EsSUFBSUMsRUFBSixFQUFRQyxFQUFSLEVBQVlDLEVBQVosRUFBZ0JDLEdBQWhCLEVBQXFCQyxHQUFyQixFQUEwQkMsR0FBMUIsRUFBK0JDLEdBQS9CLEVBQW9DQyxHQUFwQyxFQUF5Q0MsR0FBekMsRUFBOENDLEdBQTlDLEVBQW1EQyxHQUFuRDs7QUFDQSxJQUFJQyxLQUFKLEVBQVdDLE9BQVgsRUFBb0JDLFNBQXBCLEVBQStCQyxLQUEvQixFQUFzQ0MsVUFBdEMsRUFBa0RDLGFBQWxEOztBQUNBLElBQUlDLE1BQUo7O0FBQ0EsSUFBSUMsaUJBQWlCLEdBQUcsRUFBeEI7QUFDQTs7QUFDQSxJQUFJQyxzQkFBc0IsR0FBRyxDQUE3Qjs7QUFFQSxTQUFTQyxnQkFBVCxDQUEwQkMsR0FBMUIsRUFBK0JDLFNBQS9CLEVBQTBDO0FBQ3RDLE1BQUlDLEdBQUosRUFBU0MsR0FBVDs7QUFDQSxVQUFRRixTQUFSO0FBQ0ksU0FBS3BGLEtBQUssQ0FBQ3VGLFNBQU4sQ0FBZ0JDLFFBQXJCO0FBQ0lILE1BQUFBLEdBQUcsR0FBRzVELG1CQUFtQixHQUFHakIsRUFBRSxDQUFDaUYsS0FBSCxDQUFTQyxHQUFaLEdBQWtCbEYsRUFBRSxDQUFDaUYsS0FBSCxDQUFTRSxTQUFwRDtBQUNBTCxNQUFBQSxHQUFHLEdBQUc5RSxFQUFFLENBQUNpRixLQUFILENBQVNDLEdBQWY7QUFDQTs7QUFDSixTQUFLMUYsS0FBSyxDQUFDdUYsU0FBTixDQUFnQkssUUFBckI7QUFDSVAsTUFBQUEsR0FBRyxHQUFHN0UsRUFBRSxDQUFDaUYsS0FBSCxDQUFTSSxTQUFmO0FBQ0FQLE1BQUFBLEdBQUcsR0FBRzlFLEVBQUUsQ0FBQ2lGLEtBQUgsQ0FBU0ssbUJBQWY7QUFDQTs7QUFDSixTQUFLOUYsS0FBSyxDQUFDdUYsU0FBTixDQUFnQlEsTUFBckI7QUFDSVYsTUFBQUEsR0FBRyxHQUFHN0UsRUFBRSxDQUFDaUYsS0FBSCxDQUFTQyxHQUFmO0FBQ0FKLE1BQUFBLEdBQUcsR0FBRzlFLEVBQUUsQ0FBQ2lGLEtBQUgsQ0FBU08sbUJBQWY7QUFDQTs7QUFDSixTQUFLaEcsS0FBSyxDQUFDdUYsU0FBTixDQUFnQlUsTUFBckI7QUFDQTtBQUNJWixNQUFBQSxHQUFHLEdBQUc1RCxtQkFBbUIsR0FBR2pCLEVBQUUsQ0FBQ2lGLEtBQUgsQ0FBU0MsR0FBWixHQUFrQmxGLEVBQUUsQ0FBQ2lGLEtBQUgsQ0FBU0UsU0FBcEQ7QUFDQUwsTUFBQUEsR0FBRyxHQUFHOUUsRUFBRSxDQUFDaUYsS0FBSCxDQUFTSyxtQkFBZjtBQUNBO0FBakJSOztBQW9CQSxNQUFJSSxRQUFRLEdBQUcsQ0FBQ3pCLEtBQUssQ0FBQzBCLFdBQXRCO0FBQ0EsTUFBSUMsWUFBWSxHQUFHM0IsS0FBSyxDQUFDNEIsVUFBTixDQUFpQixDQUFqQixDQUFuQjtBQUNBLE1BQUksQ0FBQ0QsWUFBTCxFQUFtQixPQUFPLElBQVAsQ0F4Qm1CLENBMEJ0Qzs7QUFDQSxNQUFJRSxHQUFHLEdBQUduQixHQUFHLENBQUNvQixLQUFKLEtBQWNsQixHQUFkLEdBQW9CQyxHQUFwQixHQUEwQnpELFFBQTFCLEdBQXFDcUUsUUFBL0M7QUFDQSxNQUFJTSxhQUFhLEdBQUcvQixLQUFLLENBQUNnQyxjQUExQjtBQUNBLE1BQUlDLFFBQVEsR0FBR0YsYUFBYSxDQUFDRixHQUFELENBQTVCOztBQUNBLE1BQUksQ0FBQ0ksUUFBTCxFQUFlO0FBQ1gsUUFBSSxDQUFDRixhQUFhLENBQUNKLFlBQW5CLEVBQWlDO0FBQzdCTSxNQUFBQSxRQUFRLEdBQUdOLFlBQVg7QUFDQUksTUFBQUEsYUFBYSxDQUFDSixZQUFkLEdBQTZCQSxZQUE3QjtBQUNILEtBSEQsTUFHTztBQUNITSxNQUFBQSxRQUFRLEdBQUdsRyxFQUFFLENBQUNtRyxlQUFILENBQW1CQyxNQUFuQixDQUEwQlIsWUFBMUIsQ0FBWDtBQUNIOztBQUVETSxJQUFBQSxRQUFRLENBQUNHLE1BQVQsQ0FBZ0IsY0FBaEIsRUFBZ0NYLFFBQWhDO0FBQ0FRLElBQUFBLFFBQVEsQ0FBQ0csTUFBVCxDQUFnQixVQUFoQixFQUE0QmhGLFFBQTVCLEVBVFcsQ0FVWDs7QUFDQTZFLElBQUFBLFFBQVEsQ0FBQ0ksV0FBVCxDQUFxQixTQUFyQixFQUFnQzNCLEdBQWhDLEVBWFcsQ0FhWDs7QUFDQXVCLElBQUFBLFFBQVEsQ0FBQ0ssUUFBVCxDQUNJLElBREosRUFFSXhHLEdBQUcsQ0FBQ3lHLGNBRlIsRUFHSTNCLEdBSEosRUFHU0MsR0FIVCxFQUlJL0UsR0FBRyxDQUFDeUcsY0FKUixFQUtJM0IsR0FMSixFQUtTQyxHQUxUO0FBT0FrQixJQUFBQSxhQUFhLENBQUNGLEdBQUQsQ0FBYixHQUFxQkksUUFBckI7QUFDSDs7QUFDRCxTQUFPQSxRQUFQO0FBQ0g7O0FBRUQsU0FBU08sWUFBVCxDQUFzQm5HLEtBQXRCLEVBQTZCO0FBQ3pCO0FBQ0FzRCxFQUFBQSxHQUFHLEdBQUd0RCxLQUFLLENBQUNvRyxFQUFOLEdBQVc5RSxNQUFqQjtBQUNBVixFQUFBQSxXQUFXLEdBQUdELG1CQUFtQixHQUFHMkMsR0FBRyxHQUFHLEdBQVQsR0FBZSxDQUFoRDtBQUNBTixFQUFBQSxFQUFFLEdBQUc3QixNQUFNLEdBQUdQLFdBQWQ7QUFDQXFDLEVBQUFBLEVBQUUsR0FBRzdCLE1BQU0sR0FBR1IsV0FBZDtBQUNBc0MsRUFBQUEsRUFBRSxHQUFHN0IsTUFBTSxHQUFHVCxXQUFkO0FBRUF1QyxFQUFBQSxHQUFHLEdBQUduRCxLQUFLLENBQUNxRyxFQUFOLEdBQVdyRCxFQUFqQjtBQUNBSSxFQUFBQSxHQUFHLEdBQUdwRCxLQUFLLENBQUNzRyxFQUFOLEdBQVdyRCxFQUFqQjtBQUNBSSxFQUFBQSxHQUFHLEdBQUdyRCxLQUFLLENBQUN1RyxFQUFOLEdBQVdyRCxFQUFqQjtBQUNBM0IsRUFBQUEsYUFBYSxHQUFHLENBQUUrQixHQUFHLElBQUksRUFBUixLQUFnQixDQUFqQixLQUF1QkQsR0FBRyxJQUFJLEVBQTlCLEtBQXFDRCxHQUFHLElBQUksQ0FBNUMsSUFBaURELEdBQWpFO0FBRUFJLEVBQUFBLEdBQUcsR0FBR3ZELEtBQUssQ0FBQ3dHLEVBQU4sR0FBV3hELEVBQWpCO0FBQ0FRLEVBQUFBLEdBQUcsR0FBR3hELEtBQUssQ0FBQ3lHLEVBQU4sR0FBV3hELEVBQWpCO0FBQ0FRLEVBQUFBLEdBQUcsR0FBR3pELEtBQUssQ0FBQzBHLEVBQU4sR0FBV3hELEVBQWpCO0FBQ0FRLEVBQUFBLEdBQUcsR0FBRy9DLG1CQUFtQixHQUFHLEdBQUgsR0FBUyxDQUFsQztBQUNBYSxFQUFBQSxZQUFZLEdBQUcsQ0FBRWtDLEdBQUcsSUFBSSxFQUFSLEtBQWdCLENBQWpCLEtBQXVCRCxHQUFHLElBQUksRUFBOUIsS0FBcUNELEdBQUcsSUFBSSxDQUE1QyxJQUFpREQsR0FBaEU7QUFDSDs7QUFFRCxTQUFTb0Qsa0JBQVQsQ0FBNEJDLFVBQTVCLEVBQXdDO0FBQ3BDLFNBQU8sQ0FBRUEsVUFBVSxDQUFDQyxDQUFYLElBQWdCLEVBQWpCLEtBQXlCLENBQTFCLEtBQWdDRCxVQUFVLENBQUNFLENBQVgsSUFBZ0IsRUFBaEQsS0FBdURGLFVBQVUsQ0FBQ0csQ0FBWCxJQUFnQixDQUF2RSxJQUE0RUgsVUFBVSxDQUFDSSxDQUE5RjtBQUNIOztJQUVvQkM7Ozs7Ozs7OztTQUNqQkMsbUJBQUEsMEJBQWlCQyxJQUFqQixFQUF1QjtBQUNuQixRQUFJQSxJQUFJLENBQUNDLGlCQUFMLEVBQUosRUFBOEI7QUFDOUIsUUFBSUMsUUFBUSxHQUFHRixJQUFJLENBQUNHLFNBQXBCOztBQUNBLFFBQUlELFFBQUosRUFBYztBQUNWQSxNQUFBQSxRQUFRLENBQUNFLG9CQUFUO0FBQ0g7QUFDSjs7U0FFREMsZUFBQSxzQkFBYUMsYUFBYixFQUE0QkMsZUFBNUIsRUFBNkNDLFNBQTdDLEVBQXdEQyxPQUF4RCxFQUFpRUMsSUFBakUsRUFBdUVDLE9BQXZFLEVBQWdGO0FBRTVFLFFBQUlDLElBQUksR0FBR25FLE9BQU8sQ0FBQ29FLE1BQW5CO0FBQUEsUUFDSUMsSUFBSSxHQUFHckUsT0FBTyxDQUFDc0UsTUFEbkI7QUFBQSxRQUVJQyxTQUFTLEdBQUd2RSxPQUFPLENBQUN3RSxVQUZ4QjtBQUdBLFFBQUlDLFVBQUo7QUFFQWpJLElBQUFBLFdBQVcsQ0FBQ3lHLENBQVosR0FBZ0JjLFNBQVMsQ0FBQ2QsQ0FBVixHQUFjYSxlQUFlLENBQUNiLENBQTlCLEdBQWtDWSxhQUFhLENBQUNaLENBQWhELEdBQW9EdkYsTUFBcEQsR0FBNkQsR0FBN0U7QUFDQVYsSUFBQUEsV0FBVyxHQUFHRCxtQkFBbUIsR0FBR1AsV0FBVyxDQUFDeUcsQ0FBZixHQUFtQixHQUFwRDtBQUNBMUUsSUFBQUEsTUFBTSxHQUFHaEIsTUFBTSxHQUFHdUcsZUFBZSxDQUFDVixDQUF6QixHQUE2QlMsYUFBYSxDQUFDVCxDQUEzQyxHQUErQ3BHLFdBQXhEO0FBQ0F3QixJQUFBQSxNQUFNLEdBQUdoQixNQUFNLEdBQUdzRyxlQUFlLENBQUNYLENBQXpCLEdBQTZCVSxhQUFhLENBQUNWLENBQTNDLEdBQStDbkcsV0FBeEQ7QUFDQXlCLElBQUFBLE1BQU0sR0FBR2hCLE1BQU0sR0FBR3FHLGVBQWUsQ0FBQ1osQ0FBekIsR0FBNkJXLGFBQWEsQ0FBQ1gsQ0FBM0MsR0FBK0NsRyxXQUF4RDtBQUVBUixJQUFBQSxXQUFXLENBQUM0RyxDQUFaLEdBQWdCN0UsTUFBTSxHQUFHd0YsU0FBUyxDQUFDWCxDQUFuQztBQUNBNUcsSUFBQUEsV0FBVyxDQUFDMkcsQ0FBWixHQUFnQjNFLE1BQU0sR0FBR3VGLFNBQVMsQ0FBQ1osQ0FBbkM7QUFDQTNHLElBQUFBLFdBQVcsQ0FBQzBHLENBQVosR0FBZ0J6RSxNQUFNLEdBQUdzRixTQUFTLENBQUNiLENBQW5DOztBQUVBLFFBQUllLElBQUksQ0FBQ1MsU0FBTCxJQUFrQixJQUF0QixFQUE0QjtBQUN4QmpJLE1BQUFBLFVBQVUsQ0FBQ2tJLEdBQVgsQ0FBZSxHQUFmLEVBQW9CLEdBQXBCLEVBQXlCLEdBQXpCLEVBQThCLEdBQTlCO0FBQ0gsS0FGRCxNQUVPO0FBQ0hsSSxNQUFBQSxVQUFVLENBQUMyRyxDQUFYLEdBQWVhLElBQUksQ0FBQ1MsU0FBTCxDQUFldEIsQ0FBZixHQUFtQjdFLE1BQWxDO0FBQ0E5QixNQUFBQSxVQUFVLENBQUMwRyxDQUFYLEdBQWVjLElBQUksQ0FBQ1MsU0FBTCxDQUFldkIsQ0FBZixHQUFtQjNFLE1BQWxDO0FBQ0EvQixNQUFBQSxVQUFVLENBQUN5RyxDQUFYLEdBQWVlLElBQUksQ0FBQ1MsU0FBTCxDQUFleEIsQ0FBZixHQUFtQnpFLE1BQWxDO0FBQ0g7O0FBQ0RoQyxJQUFBQSxVQUFVLENBQUN3RyxDQUFYLEdBQWVsRyxtQkFBbUIsR0FBRyxHQUFILEdBQVMsQ0FBM0M7O0FBRUE7QUFBSTtBQUEwQixRQUE5QixFQUFvQztBQUNoQyxVQUFJcUQsYUFBSixFQUFtQjtBQUNmLGFBQUssSUFBSXdFLENBQUMsR0FBRzFHLGtCQUFSLEVBQTRCMkcsQ0FBQyxHQUFHM0csa0JBQWtCLEdBQUdGLGlCQUExRCxFQUE2RTRHLENBQUMsR0FBR0MsQ0FBakYsRUFBb0ZELENBQUMsSUFBSTlHLGNBQXpGLEVBQXlHO0FBQ3JHcEIsVUFBQUEsUUFBUSxDQUFDb0ksQ0FBVCxHQUFhWCxJQUFJLENBQUNTLENBQUQsQ0FBakI7QUFDQWxJLFVBQUFBLFFBQVEsQ0FBQ3FJLENBQVQsR0FBYVosSUFBSSxDQUFDUyxDQUFDLEdBQUcsQ0FBTCxDQUFqQjtBQUNBakksVUFBQUEsT0FBTyxDQUFDbUksQ0FBUixHQUFZWCxJQUFJLENBQUNTLENBQUMsR0FBRyxDQUFMLENBQWhCO0FBQ0FqSSxVQUFBQSxPQUFPLENBQUNvSSxDQUFSLEdBQVlaLElBQUksQ0FBQ1MsQ0FBQyxHQUFHLENBQUwsQ0FBaEI7O0FBQ0F4RSxVQUFBQSxhQUFhLENBQUM0RSxTQUFkLENBQXdCdEksUUFBeEIsRUFBa0NDLE9BQWxDLEVBQTJDSCxXQUEzQyxFQUF3REMsVUFBeEQ7O0FBRUEwSCxVQUFBQSxJQUFJLENBQUNTLENBQUQsQ0FBSixHQUFVbEksUUFBUSxDQUFDb0ksQ0FBbkIsQ0FQcUcsQ0FPeEU7O0FBQzdCWCxVQUFBQSxJQUFJLENBQUNTLENBQUMsR0FBRyxDQUFMLENBQUosR0FBY2xJLFFBQVEsQ0FBQ3FJLENBQXZCLENBUnFHLENBUXBFOztBQUNqQ1osVUFBQUEsSUFBSSxDQUFDUyxDQUFDLEdBQUcsQ0FBTCxDQUFKLEdBQWNqSSxPQUFPLENBQUNtSSxDQUF0QixDQVRxRyxDQVNwRTs7QUFDakNYLFVBQUFBLElBQUksQ0FBQ1MsQ0FBQyxHQUFHLENBQUwsQ0FBSixHQUFjakksT0FBTyxDQUFDb0ksQ0FBdEIsQ0FWcUcsQ0FVcEU7O0FBQ2pDUixVQUFBQSxTQUFTLENBQUNLLENBQUMsR0FBRyxDQUFMLENBQVQsR0FBbUI3QixrQkFBa0IsQ0FBQ3ZHLFdBQUQsQ0FBckMsQ0FYcUcsQ0FXaEM7O0FBQ3JFVyxVQUFBQSxRQUFRLEtBQUtvSCxTQUFTLENBQUNLLENBQUMsR0FBRyxDQUFMLENBQVQsR0FBbUI3QixrQkFBa0IsQ0FBQ3RHLFVBQUQsQ0FBMUMsQ0FBUixDQVpxRyxDQVkvQjtBQUN6RTtBQUNKLE9BZkQsTUFlTztBQUNIa0IsUUFBQUEsYUFBYSxHQUFHb0Ysa0JBQWtCLENBQUN2RyxXQUFELENBQWxDO0FBQ0FvQixRQUFBQSxZQUFZLEdBQUdtRixrQkFBa0IsQ0FBQ3RHLFVBQUQsQ0FBakM7O0FBRUEsYUFBSyxJQUFJbUksRUFBQyxHQUFHMUcsa0JBQVIsRUFBNEIyRyxFQUFDLEdBQUczRyxrQkFBa0IsR0FBR0YsaUJBQTFELEVBQTZFNEcsRUFBQyxHQUFHQyxFQUFqRixFQUFvRkQsRUFBQyxJQUFJOUcsY0FBekYsRUFBeUc7QUFDckd5RyxVQUFBQSxTQUFTLENBQUNLLEVBQUMsR0FBRyxDQUFMLENBQVQsR0FBbUJqSCxhQUFuQixDQURxRyxDQUNqRDs7QUFDcERSLFVBQUFBLFFBQVEsS0FBS29ILFNBQVMsQ0FBQ0ssRUFBQyxHQUFHLENBQUwsQ0FBVCxHQUFtQmhILFlBQXhCLENBQVIsQ0FGcUcsQ0FFakQ7QUFDdkQ7QUFDSjtBQUNKLEtBekJELE1BeUJPO0FBQ0gsVUFBSXFILEdBQUcsR0FBR2QsSUFBSSxDQUFDZSxRQUFMLENBQWNoSCxrQkFBa0IsR0FBRyxDQUFuQyxDQUFWO0FBQ0E4RixNQUFBQSxPQUFPLENBQUNtQixhQUFSLENBQXNCaEIsSUFBSSxDQUFDZSxRQUFMLENBQWNoSCxrQkFBZCxDQUF0QixFQUF5REYsaUJBQXpELEVBQTRFcUcsSUFBSSxDQUFDYSxRQUFMLENBQWM3RyxZQUFkLENBQTVFLEVBQXlHRCxXQUF6RyxFQUFzSDZHLEdBQXRILEVBQTJIekksV0FBM0gsRUFBd0lDLFVBQXhJLEVBQW9KVSxRQUFwSixFQUE4SlcsY0FBOUo7QUFDQSxVQUFJc0gsZUFBZSxHQUFHLElBQUlDLFlBQUosQ0FBaUJyQixPQUFPLENBQUNvQixlQUF6QixDQUF0QjtBQUNBLFVBQUlFLGdCQUFnQixHQUFHdEIsT0FBTyxDQUFDc0IsZ0JBQS9CLENBSkcsQ0FNSDs7QUFDQWxILE1BQUFBLFdBQVcsR0FBR2tILGdCQUFnQixDQUFDQyxNQUEvQjtBQUNBdkgsTUFBQUEsaUJBQWlCLEdBQUdvSCxlQUFlLENBQUNHLE1BQWhCLEdBQXlCeEgsa0JBQXpCLEdBQThDRCxjQUFsRTtBQUVBMkcsTUFBQUEsVUFBVSxHQUFHekUsT0FBTyxDQUFDd0YsT0FBUixDQUFnQnhILGlCQUFpQixHQUFHRixjQUFwQyxFQUFvRE0sV0FBcEQsQ0FBYjtBQUNBQyxNQUFBQSxZQUFZLEdBQUdvRyxVQUFVLENBQUNnQixZQUExQixFQUNJdEgsYUFBYSxHQUFHc0csVUFBVSxDQUFDaUIsWUFEL0IsRUFFSXhILGtCQUFrQixHQUFHdUcsVUFBVSxDQUFDa0IsVUFBWCxJQUF5QixDQUZsRDtBQUdBeEIsTUFBQUEsSUFBSSxHQUFHbkUsT0FBTyxDQUFDb0UsTUFBZixFQUNJQyxJQUFJLEdBQUdyRSxPQUFPLENBQUNzRSxNQURuQjtBQUVBQyxNQUFBQSxTQUFTLEdBQUd2RSxPQUFPLENBQUN3RSxVQUFwQixDQWhCRyxDQWtCSDs7QUFDQUgsTUFBQUEsSUFBSSxDQUFDTSxHQUFMLENBQVNXLGdCQUFULEVBQTJCakgsWUFBM0IsRUFuQkcsQ0FxQkg7O0FBQ0EsVUFBSStCLGFBQUosRUFBbUI7QUFDZixhQUFLLElBQUl3RSxHQUFDLEdBQUcsQ0FBUixFQUFXQyxHQUFDLEdBQUdPLGVBQWUsQ0FBQ0csTUFBL0IsRUFBdUNLLE1BQU0sR0FBRzFILGtCQUFyRCxFQUF5RTBHLEdBQUMsR0FBR0MsR0FBN0UsRUFBZ0ZELEdBQUMsSUFBSTdHLGtCQUFMLEVBQXlCNkgsTUFBTSxJQUFJOUgsY0FBbkgsRUFBbUk7QUFDL0hwQixVQUFBQSxRQUFRLENBQUNvSSxDQUFULEdBQWFNLGVBQWUsQ0FBQ1IsR0FBRCxDQUE1QjtBQUNBbEksVUFBQUEsUUFBUSxDQUFDcUksQ0FBVCxHQUFhSyxlQUFlLENBQUNSLEdBQUMsR0FBRyxDQUFMLENBQTVCOztBQUNBcEksVUFBQUEsV0FBVyxDQUFDbUksR0FBWixDQUFnQlMsZUFBZSxDQUFDUixHQUFDLEdBQUcsQ0FBTCxDQUEvQixFQUF3Q1EsZUFBZSxDQUFDUixHQUFDLEdBQUcsQ0FBTCxDQUF2RCxFQUFnRVEsZUFBZSxDQUFDUixHQUFDLEdBQUcsQ0FBTCxDQUEvRSxFQUF3RlEsZUFBZSxDQUFDUixHQUFDLEdBQUcsQ0FBTCxDQUF2Rzs7QUFDQWpJLFVBQUFBLE9BQU8sQ0FBQ21JLENBQVIsR0FBWU0sZUFBZSxDQUFDUixHQUFDLEdBQUcsQ0FBTCxDQUEzQjtBQUNBakksVUFBQUEsT0FBTyxDQUFDb0ksQ0FBUixHQUFZSyxlQUFlLENBQUNSLEdBQUMsR0FBRyxDQUFMLENBQTNCOztBQUNBLGNBQUl6SCxRQUFKLEVBQWM7QUFDVlYsWUFBQUEsVUFBVSxDQUFDa0ksR0FBWCxDQUFlUyxlQUFlLENBQUNSLEdBQUMsR0FBRyxDQUFMLENBQTlCLEVBQXVDUSxlQUFlLENBQUNSLEdBQUMsR0FBRyxDQUFMLENBQXRELEVBQStEUSxlQUFlLENBQUNSLEdBQUMsR0FBRyxFQUFMLENBQTlFLEVBQXdGUSxlQUFlLENBQUNSLEdBQUMsR0FBRyxFQUFMLENBQXZHO0FBQ0gsV0FGRCxNQUVPO0FBQ0huSSxZQUFBQSxVQUFVLENBQUNrSSxHQUFYLENBQWUsQ0FBZixFQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF3QixDQUF4QjtBQUNIOztBQUNEdkUsVUFBQUEsYUFBYSxDQUFDNEUsU0FBZCxDQUF3QnRJLFFBQXhCLEVBQWtDQyxPQUFsQyxFQUEyQ0gsV0FBM0MsRUFBd0RDLFVBQXhEOztBQUVBMEgsVUFBQUEsSUFBSSxDQUFDeUIsTUFBRCxDQUFKLEdBQWVsSixRQUFRLENBQUNvSSxDQUF4QixDQWIrSCxDQWF4Rjs7QUFDdkNYLFVBQUFBLElBQUksQ0FBQ3lCLE1BQU0sR0FBRyxDQUFWLENBQUosR0FBbUJsSixRQUFRLENBQUNxSSxDQUE1QixDQWQrSCxDQWN4Rjs7QUFDdkNaLFVBQUFBLElBQUksQ0FBQ3lCLE1BQU0sR0FBRyxDQUFWLENBQUosR0FBbUJqSixPQUFPLENBQUNtSSxDQUEzQixDQWYrSCxDQWV4Rjs7QUFDdkNYLFVBQUFBLElBQUksQ0FBQ3lCLE1BQU0sR0FBRyxDQUFWLENBQUosR0FBbUJqSixPQUFPLENBQUNvSSxDQUEzQixDQWhCK0gsQ0FnQnhGOztBQUN2Q1IsVUFBQUEsU0FBUyxDQUFDcUIsTUFBTSxHQUFHLENBQVYsQ0FBVCxHQUF3QjdDLGtCQUFrQixDQUFDdkcsV0FBRCxDQUExQzs7QUFDQSxjQUFJVyxRQUFKLEVBQWM7QUFDVm9ILFlBQUFBLFNBQVMsQ0FBQ3FCLE1BQU0sR0FBRyxDQUFWLENBQVQsR0FBd0I3QyxrQkFBa0IsQ0FBQ3RHLFVBQUQsQ0FBMUM7QUFDSDtBQUNKO0FBQ0osT0F2QkQsTUF1Qk87QUFDSCxhQUFLLElBQUltSSxHQUFDLEdBQUcsQ0FBUixFQUFXQyxHQUFDLEdBQUdPLGVBQWUsQ0FBQ0csTUFBL0IsRUFBdUNLLE9BQU0sR0FBRzFILGtCQUFyRCxFQUF5RTBHLEdBQUMsR0FBR0MsR0FBN0UsRUFBZ0ZELEdBQUMsSUFBSTdHLGtCQUFMLEVBQXlCNkgsT0FBTSxJQUFJOUgsY0FBbkgsRUFBbUk7QUFDL0hxRyxVQUFBQSxJQUFJLENBQUN5QixPQUFELENBQUosR0FBZVIsZUFBZSxDQUFDUixHQUFELENBQTlCLENBRCtILENBQ3BGOztBQUMzQ1QsVUFBQUEsSUFBSSxDQUFDeUIsT0FBTSxHQUFHLENBQVYsQ0FBSixHQUFtQlIsZUFBZSxDQUFDUixHQUFDLEdBQUcsQ0FBTCxDQUFsQyxDQUYrSCxDQUVoRjs7QUFDL0NULFVBQUFBLElBQUksQ0FBQ3lCLE9BQU0sR0FBRyxDQUFWLENBQUosR0FBbUJSLGVBQWUsQ0FBQ1IsR0FBQyxHQUFHLENBQUwsQ0FBbEMsQ0FIK0gsQ0FHaEY7O0FBQy9DVCxVQUFBQSxJQUFJLENBQUN5QixPQUFNLEdBQUcsQ0FBVixDQUFKLEdBQW1CUixlQUFlLENBQUNSLEdBQUMsR0FBRyxDQUFMLENBQWxDLENBSitILENBSWhGOztBQUUvQ2pILFVBQUFBLGFBQWEsR0FBRyxDQUFFeUgsZUFBZSxDQUFDUixHQUFDLEdBQUcsQ0FBTCxDQUFmLElBQTBCLEVBQTNCLEtBQW1DLENBQXBDLEtBQTBDUSxlQUFlLENBQUNSLEdBQUMsR0FBRyxDQUFMLENBQWYsSUFBMEIsRUFBcEUsS0FBMkVRLGVBQWUsQ0FBQ1IsR0FBQyxHQUFHLENBQUwsQ0FBZixJQUEwQixDQUFyRyxJQUEwR1EsZUFBZSxDQUFDUixHQUFDLEdBQUcsQ0FBTCxDQUF6STtBQUNBTCxVQUFBQSxTQUFTLENBQUNxQixPQUFNLEdBQUcsQ0FBVixDQUFULEdBQXdCakksYUFBeEI7O0FBRUEsY0FBSVIsUUFBSixFQUFjO0FBQ1ZTLFlBQUFBLFlBQVksR0FBRyxDQUFFd0gsZUFBZSxDQUFDUixHQUFDLEdBQUcsRUFBTCxDQUFmLElBQTJCLEVBQTVCLEtBQW9DLENBQXJDLEtBQTJDUSxlQUFlLENBQUNSLEdBQUMsR0FBRyxFQUFMLENBQWYsSUFBMkIsRUFBdEUsS0FBNkVRLGVBQWUsQ0FBQ1IsR0FBQyxHQUFHLENBQUwsQ0FBZixJQUEwQixDQUF2RyxJQUE0R1EsZUFBZSxDQUFDUixHQUFDLEdBQUcsQ0FBTCxDQUExSTtBQUNBTCxZQUFBQSxTQUFTLENBQUNxQixPQUFNLEdBQUcsQ0FBVixDQUFULEdBQXdCaEksWUFBeEI7QUFDSDtBQUNKO0FBQ0o7QUFDSjtBQUNKOztTQUVEaUksbUJBQUEsMEJBQWlCQyxRQUFqQixFQUEyQjtBQUN2QixRQUFJM0IsSUFBSjtBQUNBLFFBQUlFLElBQUo7QUFFQSxRQUFJMEIsV0FBVyxHQUFHaEcsS0FBSyxDQUFDMkQsU0FBeEI7QUFDQSxRQUFJRyxhQUFhLEdBQUdrQyxXQUFXLENBQUMzSixLQUFoQztBQUNBLFFBQUk0SixRQUFRLEdBQUdqRyxLQUFLLENBQUNrRyxjQUFyQjtBQUNBLFFBQUlqQyxPQUFPLEdBQUdqRSxLQUFLLENBQUNtRyxRQUFwQjtBQUNBLFFBQUlsRSxRQUFRLEdBQUcsSUFBZjtBQUNBLFFBQUltRSxVQUFKLEVBQWdCckMsZUFBaEIsRUFBaUNDLFNBQWpDLEVBQTRDa0IsR0FBNUMsRUFBaURtQixTQUFqRDtBQUNBLFFBQUlDLFFBQUosRUFBY0MsTUFBZCxFQUFzQkMsTUFBdEI7QUFDQSxRQUFJOUIsVUFBSjtBQUNBLFFBQUlSLElBQUo7QUFDQSxRQUFJdUMsU0FBSjtBQUVBdkosSUFBQUEsZUFBZSxHQUFHOEMsS0FBSyxDQUFDMEcsZUFBeEI7QUFDQXZKLElBQUFBLGFBQWEsR0FBRzZDLEtBQUssQ0FBQzJHLGFBQXRCO0FBQ0FoSSxJQUFBQSxRQUFRLEdBQUcsS0FBWDtBQUNBLFFBQUl6QixlQUFlLElBQUksQ0FBQyxDQUF4QixFQUEyQnlCLFFBQVEsR0FBRyxJQUFYO0FBRTNCdEIsSUFBQUEsV0FBVyxHQUFHMkMsS0FBSyxDQUFDNEcsVUFBcEI7QUFDQXRKLElBQUFBLFdBQVcsR0FBRzBDLEtBQUssQ0FBQzZHLFVBQXBCO0FBQ0F0SixJQUFBQSxVQUFVLEdBQUd5QyxLQUFLLENBQUM4RyxTQUFuQjs7QUFDQSxRQUFJYixRQUFRLEtBQUszSSxXQUFXLElBQUlELFdBQWYsSUFBOEJFLFVBQW5DLENBQVosRUFBNEQ7QUFDeEQwSSxNQUFBQSxRQUFRLENBQUNjLEtBQVQ7QUFDQWQsTUFBQUEsUUFBUSxDQUFDZSxTQUFULEdBQXFCLENBQXJCO0FBQ0gsS0ExQnNCLENBNEJ2Qjs7O0FBQ0FoSixJQUFBQSxrQkFBa0IsR0FBR1osUUFBUSxHQUFHLEVBQUgsR0FBUSxDQUFyQztBQUVBYSxJQUFBQSxpQkFBaUIsR0FBRyxDQUFwQjtBQUNBRSxJQUFBQSxrQkFBa0IsR0FBRyxDQUFyQjtBQUNBQyxJQUFBQSxhQUFhLEdBQUcsQ0FBaEI7QUFDQUMsSUFBQUEsV0FBVyxHQUFHLENBQWQ7QUFDQUMsSUFBQUEsWUFBWSxHQUFHLENBQWY7QUFDQWlDLElBQUFBLGlCQUFpQixDQUFDaUYsTUFBbEIsR0FBMkIsQ0FBM0I7O0FBRUEsU0FBSyxJQUFJckIsT0FBTyxHQUFHLENBQWQsRUFBaUI4QyxTQUFTLEdBQUdqQixXQUFXLENBQUNrQixTQUFaLENBQXNCMUIsTUFBeEQsRUFBZ0VyQixPQUFPLEdBQUc4QyxTQUExRSxFQUFxRjlDLE9BQU8sRUFBNUYsRUFBZ0c7QUFDNUZELE1BQUFBLElBQUksR0FBRzhCLFdBQVcsQ0FBQ2tCLFNBQVosQ0FBc0IvQyxPQUF0QixDQUFQOztBQUVBLFVBQUlELElBQUksSUFBSWlELFNBQVosRUFBdUI7QUFDbkI7QUFDSDs7QUFFRCxVQUFJakssZUFBZSxJQUFJLENBQW5CLElBQXdCQSxlQUFlLElBQUlnSCxJQUFJLENBQUNrRCxJQUFMLENBQVVDLEtBQXpELEVBQWdFO0FBQzVEMUksUUFBQUEsUUFBUSxHQUFHLElBQVg7QUFDSDs7QUFFRCxVQUFJLENBQUNBLFFBQUwsRUFBZTtBQUNYc0YsUUFBQUEsT0FBTyxDQUFDcUQsZUFBUixDQUF3QnBELElBQXhCO0FBQ0E7QUFDSDs7QUFFRCxVQUFJL0csYUFBYSxJQUFJLENBQWpCLElBQXNCQSxhQUFhLElBQUkrRyxJQUFJLENBQUNrRCxJQUFMLENBQVVDLEtBQXJELEVBQTREO0FBQ3hEMUksUUFBQUEsUUFBUSxHQUFHLEtBQVg7QUFDSDs7QUFFRFYsTUFBQUEsaUJBQWlCLEdBQUcsQ0FBcEI7QUFDQUksTUFBQUEsV0FBVyxHQUFHLENBQWQ7QUFDQWtDLE1BQUFBLGlCQUFpQixDQUFDaUYsTUFBbEIsR0FBMkIsQ0FBM0I7QUFFQVksTUFBQUEsVUFBVSxHQUFHbEMsSUFBSSxDQUFDcUQsYUFBTCxFQUFiOztBQUNBLFVBQUksQ0FBQ25CLFVBQUwsRUFBaUI7QUFDYm5DLFFBQUFBLE9BQU8sQ0FBQ3FELGVBQVIsQ0FBd0JwRCxJQUF4QjtBQUNBO0FBQ0g7O0FBRURvQyxNQUFBQSxRQUFRLEdBQUdGLFVBQVUsWUFBWTdLLEtBQUssQ0FBQ2lNLGdCQUF2QztBQUNBakIsTUFBQUEsTUFBTSxHQUFHSCxVQUFVLFlBQVk3SyxLQUFLLENBQUNrTSxjQUFyQztBQUNBakIsTUFBQUEsTUFBTSxHQUFHSixVQUFVLFlBQVk3SyxLQUFLLENBQUNtTSxrQkFBckM7O0FBRUEsVUFBSWxCLE1BQUosRUFBWTtBQUNSdkMsUUFBQUEsT0FBTyxDQUFDMEQsU0FBUixDQUFrQnpELElBQWxCLEVBQXdCa0MsVUFBeEI7QUFDQTtBQUNIOztBQUVELFVBQUksQ0FBQ0UsUUFBRCxJQUFhLENBQUNDLE1BQWxCLEVBQTBCO0FBQ3RCdEMsUUFBQUEsT0FBTyxDQUFDcUQsZUFBUixDQUF3QnBELElBQXhCO0FBQ0E7QUFDSDs7QUFFRGpDLE1BQUFBLFFBQVEsR0FBR3hCLGdCQUFnQixDQUFDMkYsVUFBVSxDQUFDd0IsTUFBWCxDQUFrQkMsT0FBbEIsQ0FBMEJDLFFBQTNCLEVBQXFDNUQsSUFBSSxDQUFDa0QsSUFBTCxDQUFVekcsU0FBL0MsQ0FBM0I7O0FBQ0EsVUFBSSxDQUFDc0IsUUFBTCxFQUFlO0FBQ1hnQyxRQUFBQSxPQUFPLENBQUNxRCxlQUFSLENBQXdCcEQsSUFBeEI7QUFDQTtBQUNIOztBQUVELFVBQUl0RixVQUFVLElBQUlxRCxRQUFRLENBQUM4RixPQUFULE9BQXVCN0gsU0FBUyxDQUFDK0IsUUFBVixDQUFtQjhGLE9BQW5CLEVBQXpDLEVBQXVFO0FBQ25FbkosUUFBQUEsVUFBVSxHQUFHLEtBQWI7O0FBQ0FzQixRQUFBQSxTQUFTLENBQUM4SCxNQUFWOztBQUNBOUgsUUFBQUEsU0FBUyxDQUFDK0gsSUFBVixHQUFpQjlILEtBQWpCO0FBQ0FELFFBQUFBLFNBQVMsQ0FBQytCLFFBQVYsR0FBcUJBLFFBQXJCO0FBQ0g7O0FBRUQsVUFBSXFFLFFBQUosRUFBYztBQUVWRCxRQUFBQSxTQUFTLEdBQUdsSyxjQUFaLENBRlUsQ0FJVjs7QUFDQThCLFFBQUFBLGlCQUFpQixHQUFHLElBQUlGLGNBQXhCO0FBQ0FNLFFBQUFBLFdBQVcsR0FBRyxDQUFkO0FBRUFxRyxRQUFBQSxVQUFVLEdBQUd6RSxPQUFPLENBQUN3RixPQUFSLENBQWdCLENBQWhCLEVBQW1CLENBQW5CLENBQWI7QUFDQW5ILFFBQUFBLFlBQVksR0FBR29HLFVBQVUsQ0FBQ2dCLFlBQTFCLEVBQ0l0SCxhQUFhLEdBQUdzRyxVQUFVLENBQUNpQixZQUQvQixFQUVJeEgsa0JBQWtCLEdBQUd1RyxVQUFVLENBQUNrQixVQUFYLElBQXlCLENBRmxEO0FBR0F4QixRQUFBQSxJQUFJLEdBQUduRSxPQUFPLENBQUNvRSxNQUFmLEVBQ0lDLElBQUksR0FBR3JFLE9BQU8sQ0FBQ3NFLE1BRG5CLENBWlUsQ0FlVjtBQUNBOztBQUNBNkIsUUFBQUEsVUFBVSxDQUFDOEIsb0JBQVgsQ0FBZ0NoRSxJQUFJLENBQUNpRSxJQUFyQyxFQUEyQzVILGlCQUEzQyxFQUE4RCxDQUE5RCxFQUFpRUMsc0JBQWpFLEVBakJVLENBbUJWOztBQUNBLGFBQUs0SCw0QkFBTCxDQUFrQzdILGlCQUFsQyxFQUFxRDZELElBQXJELEVBQTJEakcsa0JBQTNELEVBQStFLENBQS9FLEVBQWtGZ0csT0FBbEYsRUFwQlUsQ0FzQlY7OztBQUNBLFlBQUk4QixRQUFRLElBQUk1SSxXQUFoQixFQUE2QjtBQUN6QjRJLFVBQUFBLFFBQVEsQ0FBQ29DLFdBQVQsR0FBdUJqTSxVQUF2QjtBQUNBNkosVUFBQUEsUUFBUSxDQUFDcUMsTUFBVCxDQUFnQmxFLElBQUksQ0FBQ2pHLGtCQUFELENBQXBCLEVBQTBDaUcsSUFBSSxDQUFDakcsa0JBQWtCLEdBQUcsQ0FBdEIsQ0FBOUM7O0FBQ0EsZUFBSyxJQUFJb0ssRUFBRSxHQUFHcEssa0JBQWtCLEdBQUdKLGNBQTlCLEVBQThDeUssRUFBRSxHQUFHckssa0JBQWtCLEdBQUdGLGlCQUE3RSxFQUFnR3NLLEVBQUUsR0FBR0MsRUFBckcsRUFBeUdELEVBQUUsSUFBSXhLLGNBQS9HLEVBQStIO0FBQzNIa0ksWUFBQUEsUUFBUSxDQUFDd0MsTUFBVCxDQUFnQnJFLElBQUksQ0FBQ21FLEVBQUQsQ0FBcEIsRUFBMEJuRSxJQUFJLENBQUNtRSxFQUFFLEdBQUcsQ0FBTixDQUE5QjtBQUNIOztBQUNEdEMsVUFBQUEsUUFBUSxDQUFDeUMsS0FBVDtBQUNBekMsVUFBQUEsUUFBUSxDQUFDMEMsTUFBVDtBQUNIO0FBQ0osT0FoQ0QsTUFpQ0ssSUFBSXBDLE1BQUosRUFBWTtBQUViRixRQUFBQSxTQUFTLEdBQUdELFVBQVUsQ0FBQ0MsU0FBdkIsQ0FGYSxDQUliOztBQUNBcEksUUFBQUEsaUJBQWlCLEdBQUcsQ0FBQ21JLFVBQVUsQ0FBQ3dDLG1CQUFYLElBQWtDLENBQW5DLElBQXdDN0ssY0FBNUQ7QUFDQU0sUUFBQUEsV0FBVyxHQUFHZ0ksU0FBUyxDQUFDYixNQUF4QjtBQUVBZCxRQUFBQSxVQUFVLEdBQUd6RSxPQUFPLENBQUN3RixPQUFSLENBQWdCeEgsaUJBQWlCLEdBQUdGLGNBQXBDLEVBQW9ETSxXQUFwRCxDQUFiO0FBQ0FDLFFBQUFBLFlBQVksR0FBR29HLFVBQVUsQ0FBQ2dCLFlBQTFCLEVBQ0l0SCxhQUFhLEdBQUdzRyxVQUFVLENBQUNpQixZQUQvQixFQUVJeEgsa0JBQWtCLEdBQUd1RyxVQUFVLENBQUNrQixVQUFYLElBQXlCLENBRmxEO0FBR0F4QixRQUFBQSxJQUFJLEdBQUduRSxPQUFPLENBQUNvRSxNQUFmLEVBQ0lDLElBQUksR0FBR3JFLE9BQU8sQ0FBQ3NFLE1BRG5CLENBWmEsQ0FlYjtBQUNBOztBQUNBNkIsUUFBQUEsVUFBVSxDQUFDOEIsb0JBQVgsQ0FBZ0NoRSxJQUFoQyxFQUFzQyxDQUF0QyxFQUF5Q2tDLFVBQVUsQ0FBQ3dDLG1CQUFwRCxFQUF5RXJJLGlCQUF6RSxFQUE0RixDQUE1RixFQUErRkMsc0JBQS9GLEVBakJhLENBbUJiOztBQUNBLGFBQUs0SCw0QkFBTCxDQUFrQzdILGlCQUFsQyxFQUFxRDZELElBQXJELEVBQTJEakcsa0JBQTNELEVBQStFRixpQkFBaUIsR0FBR0YsY0FBbkcsRUFBbUhvRyxPQUFuSCxFQXBCYSxDQXNCYjs7O0FBQ0EsWUFBSThCLFFBQVEsSUFBSTFJLFVBQWhCLEVBQTRCO0FBQ3hCMEksVUFBQUEsUUFBUSxDQUFDb0MsV0FBVCxHQUF1QjdMLFVBQXZCOztBQUVBLGVBQUssSUFBSStMLEdBQUUsR0FBRyxDQUFULEVBQVlDLEdBQUUsR0FBR25DLFNBQVMsQ0FBQ2IsTUFBaEMsRUFBd0MrQyxHQUFFLEdBQUdDLEdBQTdDLEVBQWlERCxHQUFFLElBQUksQ0FBdkQsRUFBMEQ7QUFDdEQsZ0JBQUlNLEVBQUUsR0FBR3hDLFNBQVMsQ0FBQ2tDLEdBQUQsQ0FBVCxHQUFnQnhLLGNBQWhCLEdBQWlDSSxrQkFBMUM7QUFDQSxnQkFBSTJLLEVBQUUsR0FBR3pDLFNBQVMsQ0FBQ2tDLEdBQUUsR0FBRyxDQUFOLENBQVQsR0FBb0J4SyxjQUFwQixHQUFxQ0ksa0JBQTlDO0FBQ0EsZ0JBQUk0SyxFQUFFLEdBQUcxQyxTQUFTLENBQUNrQyxHQUFFLEdBQUcsQ0FBTixDQUFULEdBQW9CeEssY0FBcEIsR0FBcUNJLGtCQUE5QztBQUVBOEgsWUFBQUEsUUFBUSxDQUFDcUMsTUFBVCxDQUFnQmxFLElBQUksQ0FBQ3lFLEVBQUQsQ0FBcEIsRUFBMEJ6RSxJQUFJLENBQUN5RSxFQUFFLEdBQUcsQ0FBTixDQUE5QjtBQUNBNUMsWUFBQUEsUUFBUSxDQUFDd0MsTUFBVCxDQUFnQnJFLElBQUksQ0FBQzBFLEVBQUQsQ0FBcEIsRUFBMEIxRSxJQUFJLENBQUMwRSxFQUFFLEdBQUcsQ0FBTixDQUE5QjtBQUNBN0MsWUFBQUEsUUFBUSxDQUFDd0MsTUFBVCxDQUFnQnJFLElBQUksQ0FBQzJFLEVBQUQsQ0FBcEIsRUFBMEIzRSxJQUFJLENBQUMyRSxFQUFFLEdBQUcsQ0FBTixDQUE5QjtBQUNBOUMsWUFBQUEsUUFBUSxDQUFDeUMsS0FBVDtBQUNBekMsWUFBQUEsUUFBUSxDQUFDMEMsTUFBVDtBQUNIO0FBQ0o7QUFDSjs7QUFFRCxVQUFJMUssaUJBQWlCLElBQUksQ0FBckIsSUFBMEJJLFdBQVcsSUFBSSxDQUE3QyxFQUFnRDtBQUM1QzRGLFFBQUFBLE9BQU8sQ0FBQ3FELGVBQVIsQ0FBd0JwRCxJQUF4QjtBQUNBO0FBQ0gsT0FySTJGLENBdUk1Rjs7O0FBQ0FJLE1BQUFBLElBQUksQ0FBQ00sR0FBTCxDQUFTeUIsU0FBVCxFQUFvQi9ILFlBQXBCLEVBeEk0RixDQTBJNUY7O0FBQ0E0RyxNQUFBQSxHQUFHLEdBQUdrQixVQUFVLENBQUNsQixHQUFqQjs7QUFDQSxXQUFLLElBQUlMLENBQUMsR0FBRzFHLGtCQUFSLEVBQTRCMkcsQ0FBQyxHQUFHM0csa0JBQWtCLEdBQUdGLGlCQUFyRCxFQUF3RStLLENBQUMsR0FBRyxDQUFqRixFQUFvRm5FLENBQUMsR0FBR0MsQ0FBeEYsRUFBMkZELENBQUMsSUFBSTlHLGNBQUwsRUFBcUJpTCxDQUFDLElBQUksQ0FBckgsRUFBd0g7QUFDcEg1RSxRQUFBQSxJQUFJLENBQUNTLENBQUMsR0FBRyxDQUFMLENBQUosR0FBY0ssR0FBRyxDQUFDOEQsQ0FBRCxDQUFqQixDQURvSCxDQUNwRjs7QUFDaEM1RSxRQUFBQSxJQUFJLENBQUNTLENBQUMsR0FBRyxDQUFMLENBQUosR0FBY0ssR0FBRyxDQUFDOEQsQ0FBQyxHQUFHLENBQUwsQ0FBakIsQ0FGb0gsQ0FFcEY7QUFDbkM7O0FBRURqRixNQUFBQSxlQUFlLEdBQUdxQyxVQUFVLENBQUMvSixLQUE3QixFQUNJMkgsU0FBUyxHQUFHRSxJQUFJLENBQUM3SCxLQURyQjtBQUdBLFdBQUt3SCxZQUFMLENBQWtCQyxhQUFsQixFQUFpQ0MsZUFBakMsRUFBa0RDLFNBQWxELEVBQTZEQyxPQUE3RCxFQUFzRUMsSUFBdEUsRUFBNEVDLE9BQTVFLEVBcEo0RixDQXNKNUY7O0FBQ0FDLE1BQUFBLElBQUksR0FBR25FLE9BQU8sQ0FBQ29FLE1BQWYsRUFDSUMsSUFBSSxHQUFHckUsT0FBTyxDQUFDc0UsTUFEbkI7O0FBR0EsVUFBSWxHLFdBQVcsR0FBRyxDQUFsQixFQUFxQjtBQUNqQixhQUFLLElBQUlrSyxJQUFFLEdBQUdqSyxZQUFULEVBQXVCa0ssSUFBRSxHQUFHbEssWUFBWSxHQUFHRCxXQUFoRCxFQUE2RGtLLElBQUUsR0FBR0MsSUFBbEUsRUFBc0VELElBQUUsRUFBeEUsRUFBNEU7QUFDeEVqRSxVQUFBQSxJQUFJLENBQUNpRSxJQUFELENBQUosSUFBWW5LLGFBQVo7QUFDSDs7QUFFRCxZQUFJMkgsUUFBSixFQUFjO0FBQ1ZVLFVBQUFBLFNBQVMsR0FBR1YsUUFBUSxDQUFDa0QsQ0FBckI7QUFDQWxLLFVBQUFBLElBQUksR0FBRzBILFNBQVMsQ0FBQyxDQUFELENBQWhCO0FBQ0F6SCxVQUFBQSxJQUFJLEdBQUd5SCxTQUFTLENBQUMsQ0FBRCxDQUFoQjtBQUNBeEgsVUFBQUEsSUFBSSxHQUFHd0gsU0FBUyxDQUFDLEVBQUQsQ0FBaEI7QUFDQXZILFVBQUFBLElBQUksR0FBR3VILFNBQVMsQ0FBQyxDQUFELENBQWhCO0FBQ0F0SCxVQUFBQSxJQUFJLEdBQUdzSCxTQUFTLENBQUMsQ0FBRCxDQUFoQjtBQUNBckgsVUFBQUEsSUFBSSxHQUFHcUgsU0FBUyxDQUFDLEVBQUQsQ0FBaEI7O0FBQ0EsZUFBSyxJQUFJOEIsSUFBRSxHQUFHcEssa0JBQVQsRUFBNkJxSyxJQUFFLEdBQUdySyxrQkFBa0IsR0FBR0YsaUJBQTVELEVBQStFc0ssSUFBRSxHQUFHQyxJQUFwRixFQUF3RkQsSUFBRSxJQUFJeEssY0FBOUYsRUFBOEc7QUFDMUdjLFlBQUFBLEVBQUUsR0FBR3VGLElBQUksQ0FBQ21FLElBQUQsQ0FBVDtBQUNBekosWUFBQUEsRUFBRSxHQUFHc0YsSUFBSSxDQUFDbUUsSUFBRSxHQUFHLENBQU4sQ0FBVDtBQUNBbkUsWUFBQUEsSUFBSSxDQUFDbUUsSUFBRCxDQUFKLEdBQVcxSixFQUFFLEdBQUdFLElBQUwsR0FBWUQsRUFBRSxHQUFHRSxJQUFqQixHQUF3QkMsSUFBbkM7QUFDQW1GLFlBQUFBLElBQUksQ0FBQ21FLElBQUUsR0FBRyxDQUFOLENBQUosR0FBZTFKLEVBQUUsR0FBR0ssSUFBTCxHQUFZSixFQUFFLEdBQUdLLElBQWpCLEdBQXdCQyxJQUF2QztBQUNIO0FBQ0o7O0FBQ0RhLFFBQUFBLE9BQU8sQ0FBQ2lKLE1BQVIsQ0FBZWpMLGlCQUFpQixHQUFHRixjQUFuQyxFQUFtRE0sV0FBbkQ7QUFDSDs7QUFFRDRGLE1BQUFBLE9BQU8sQ0FBQ3FELGVBQVIsQ0FBd0JwRCxJQUF4QjtBQUNIOztBQUVERCxJQUFBQSxPQUFPLENBQUNrRixPQUFSOztBQUVBLFFBQUlsRCxRQUFRLElBQUkzSSxXQUFoQixFQUE2QjtBQUN6QixVQUFJNkssSUFBSjtBQUNBbEMsTUFBQUEsUUFBUSxDQUFDb0MsV0FBVCxHQUF1Qi9MLFVBQXZCO0FBQ0EySixNQUFBQSxRQUFRLENBQUNtRCxTQUFULEdBQXFCaE4sVUFBckIsQ0FIeUIsQ0FHUTs7QUFFakMsV0FBSyxJQUFJaU4sQ0FBQyxHQUFHLENBQVIsRUFBV3ZFLEdBQUMsR0FBR2tCLFdBQVcsQ0FBQ3NELEtBQVosQ0FBa0I5RCxNQUF0QyxFQUE4QzZELENBQUMsR0FBR3ZFLEdBQWxELEVBQXFEdUUsQ0FBQyxFQUF0RCxFQUEwRDtBQUN0RGxCLFFBQUFBLElBQUksR0FBR25DLFdBQVcsQ0FBQ3NELEtBQVosQ0FBa0JELENBQWxCLENBQVA7QUFDQSxZQUFJdEUsQ0FBQyxHQUFHb0QsSUFBSSxDQUFDZixJQUFMLENBQVU1QixNQUFWLEdBQW1CMkMsSUFBSSxDQUFDakYsQ0FBeEIsR0FBNEJpRixJQUFJLENBQUNvQixNQUF6QztBQUNBLFlBQUl2RSxDQUFDLEdBQUdtRCxJQUFJLENBQUNmLElBQUwsQ0FBVTVCLE1BQVYsR0FBbUIyQyxJQUFJLENBQUNxQixDQUF4QixHQUE0QnJCLElBQUksQ0FBQ3NCLE1BQXpDLENBSHNELENBS3REOztBQUNBeEQsUUFBQUEsUUFBUSxDQUFDcUMsTUFBVCxDQUFnQkgsSUFBSSxDQUFDb0IsTUFBckIsRUFBNkJwQixJQUFJLENBQUNzQixNQUFsQztBQUNBeEQsUUFBQUEsUUFBUSxDQUFDd0MsTUFBVCxDQUFnQjFELENBQWhCLEVBQW1CQyxDQUFuQjtBQUNBaUIsUUFBQUEsUUFBUSxDQUFDMEMsTUFBVCxHQVJzRCxDQVV0RDs7QUFDQTFDLFFBQUFBLFFBQVEsQ0FBQ3lELE1BQVQsQ0FBZ0J2QixJQUFJLENBQUNvQixNQUFyQixFQUE2QnBCLElBQUksQ0FBQ3NCLE1BQWxDLEVBQTBDRSxJQUFJLENBQUNDLEVBQUwsR0FBVSxHQUFwRDtBQUNBM0QsUUFBQUEsUUFBUSxDQUFDNEQsSUFBVDs7QUFDQSxZQUFJUixDQUFDLEtBQUssQ0FBVixFQUFhO0FBQ1RwRCxVQUFBQSxRQUFRLENBQUNtRCxTQUFULEdBQXFCN00sWUFBckI7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7U0FFRDZMLCtCQUFBLHNDQUE2QjBCLFlBQTdCLEVBQTJDQyxhQUEzQyxFQUEwRGxFLE1BQTFELEVBQWtFbUUsV0FBbEUsRUFBK0U3RixPQUEvRSxFQUF3RjtBQUNwRixTQUFLLElBQUlrRixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHVyxXQUFwQixFQUFpQ1gsQ0FBQyxFQUFsQyxFQUFzQztBQUNsQyxVQUFJWSxTQUFTLEdBQUdaLENBQUMsR0FBR3RMLGNBQUosR0FBcUI4SCxNQUFyQztBQUNBLFVBQUlxRSxTQUFTLEdBQUdiLENBQUMsR0FBRzdJLHNCQUFwQjtBQUVBdUosTUFBQUEsYUFBYSxDQUFDRSxTQUFELENBQWIsR0FBMkJILFlBQVksQ0FBQ0ksU0FBRCxDQUF2QyxDQUprQyxDQUkwQjs7QUFDNURILE1BQUFBLGFBQWEsQ0FBQ0UsU0FBUyxHQUFHLENBQWIsQ0FBYixHQUErQkgsWUFBWSxDQUFDSSxTQUFTLEdBQUcsQ0FBYixDQUEzQyxDQUxrQyxDQUswQjs7QUFDNURILE1BQUFBLGFBQWEsQ0FBQ0UsU0FBUyxHQUFHLENBQWIsQ0FBYixHQUErQjNKLE1BQU0sR0FBRyxPQUFPNkQsT0FBL0MsQ0FOa0MsQ0FNK0I7O0FBQ2pFNEYsTUFBQUEsYUFBYSxDQUFDRSxTQUFTLEdBQUcsQ0FBYixDQUFiLEdBQStCSCxZQUFZLENBQUNJLFNBQVMsR0FBRyxDQUFiLENBQTNDLENBUGtDLENBTzBCOztBQUM1REgsTUFBQUEsYUFBYSxDQUFDRSxTQUFTLEdBQUcsQ0FBYixDQUFiLEdBQStCSCxZQUFZLENBQUNJLFNBQVMsR0FBRyxDQUFiLENBQTNDLENBUmtDLENBUTBCOztBQUM1REgsTUFBQUEsYUFBYSxDQUFDRSxTQUFTLEdBQUcsQ0FBYixDQUFiLEdBQStCSCxZQUFZLENBQUNJLFNBQVMsR0FBRyxDQUFiLENBQTNDLENBVGtDLENBUzBCOztBQUM1RCxVQUFJOU0sUUFBSixFQUFjO0FBQ1YyTSxRQUFBQSxhQUFhLENBQUNFLFNBQVMsR0FBRyxDQUFiLENBQWIsR0FBK0JILFlBQVksQ0FBQ0ksU0FBUyxHQUFHLENBQWIsQ0FBM0MsQ0FEVSxDQUNrRDtBQUMvRDtBQUNKO0FBQ0o7O1NBRURDLGdCQUFBLHVCQUFjcEUsUUFBZCxFQUF3QjtBQUVwQixRQUFJcUUsS0FBSyxHQUFHcEssS0FBSyxDQUFDcUssU0FBbEI7QUFDQSxRQUFJLENBQUNELEtBQUwsRUFBWTtBQUVaLFFBQUlFLFFBQVEsR0FBR0YsS0FBSyxDQUFDRSxRQUFyQjtBQUNBLFFBQUlBLFFBQVEsQ0FBQzlFLE1BQVQsSUFBbUIsQ0FBdkIsRUFBMEI7QUFFMUIsUUFBSStFLE9BQU8sR0FBR0gsS0FBSyxDQUFDRyxPQUFwQjtBQUVBLFFBQUluRyxJQUFKLEVBQVVFLElBQVYsRUFBZ0JrRyxPQUFoQjtBQUNBLFFBQUl2SSxRQUFKO0FBQ0EsUUFBSXlDLFVBQUo7QUFDQSxRQUFJK0YsUUFBUSxHQUFHTCxLQUFLLENBQUNLLFFBQXJCO0FBQ0EsUUFBSUMsT0FBTyxHQUFHTixLQUFLLENBQUNNLE9BQXBCO0FBQ0EsUUFBSWpFLFNBQUo7QUFFQSxRQUFJa0UsYUFBYSxHQUFHLENBQXBCO0FBQUEsUUFBdUJDLGdCQUFnQixHQUFHLENBQTFDO0FBQUEsUUFBNkNDLFVBQVUsR0FBRyxDQUExRDs7QUFDQSxRQUFJOUUsUUFBSixFQUFjO0FBQ1ZVLE1BQUFBLFNBQVMsR0FBR1YsUUFBUSxDQUFDa0QsQ0FBckI7QUFDQWxLLE1BQUFBLElBQUksR0FBRzBILFNBQVMsQ0FBQyxDQUFELENBQWhCO0FBQ0F2SCxNQUFBQSxJQUFJLEdBQUd1SCxTQUFTLENBQUMsQ0FBRCxDQUFoQjtBQUNBekgsTUFBQUEsSUFBSSxHQUFHeUgsU0FBUyxDQUFDLENBQUQsQ0FBaEI7QUFDQXRILE1BQUFBLElBQUksR0FBR3NILFNBQVMsQ0FBQyxDQUFELENBQWhCO0FBQ0F4SCxNQUFBQSxJQUFJLEdBQUd3SCxTQUFTLENBQUMsRUFBRCxDQUFoQjtBQUNBckgsTUFBQUEsSUFBSSxHQUFHcUgsU0FBUyxDQUFDLEVBQUQsQ0FBaEI7QUFDSDs7QUFFRCxRQUFJcUUsYUFBYSxHQUFHL0wsSUFBSSxLQUFLLENBQVQsSUFBY0csSUFBSSxLQUFLLENBQXZCLElBQTRCRixJQUFJLEtBQUssQ0FBckMsSUFBMENHLElBQUksS0FBSyxDQUF2RTtBQUNBLFFBQUk0TCxTQUFTLEdBQUk3TyxVQUFVLEdBQUdGLFVBQTlCO0FBQ0EsUUFBSWdQLGFBQWEsR0FBR0QsU0FBUyxJQUFJRCxhQUFqQztBQUVBLFFBQUlHLFdBQVcsR0FBRyxDQUFsQjtBQUNBLFFBQUlDLE1BQU0sR0FBR2QsS0FBSyxDQUFDYyxNQUFuQjtBQUNBLFFBQUlDLFFBQVEsR0FBR0QsTUFBTSxDQUFDRCxXQUFXLEVBQVosQ0FBckI7QUFDQSxRQUFJRyxXQUFXLEdBQUdELFFBQVEsQ0FBQ0UsUUFBM0I7O0FBQ0E3SSxJQUFBQSxZQUFZLENBQUMySSxRQUFELENBQVo7O0FBRUEsU0FBSyxJQUFJOUIsQ0FBQyxHQUFHLENBQVIsRUFBV3ZFLENBQUMsR0FBR3dGLFFBQVEsQ0FBQzlFLE1BQTdCLEVBQXFDNkQsQ0FBQyxHQUFHdkUsQ0FBekMsRUFBNEN1RSxDQUFDLEVBQTdDLEVBQWlEO0FBQzdDLFVBQUlpQyxPQUFPLEdBQUdoQixRQUFRLENBQUNqQixDQUFELENBQXRCO0FBQ0FwSCxNQUFBQSxRQUFRLEdBQUd4QixnQkFBZ0IsQ0FBQzZLLE9BQU8sQ0FBQzVLLEdBQVQsRUFBYzRLLE9BQU8sQ0FBQzNLLFNBQXRCLENBQTNCO0FBQ0EsVUFBSSxDQUFDc0IsUUFBTCxFQUFlOztBQUVmLFVBQUlyRCxVQUFVLElBQUlxRCxRQUFRLENBQUM4RixPQUFULE9BQXVCN0gsU0FBUyxDQUFDK0IsUUFBVixDQUFtQjhGLE9BQW5CLEVBQXpDLEVBQXVFO0FBQ25FbkosUUFBQUEsVUFBVSxHQUFHLEtBQWI7O0FBQ0FzQixRQUFBQSxTQUFTLENBQUM4SCxNQUFWOztBQUNBOUgsUUFBQUEsU0FBUyxDQUFDK0gsSUFBVixHQUFpQjlILEtBQWpCO0FBQ0FELFFBQUFBLFNBQVMsQ0FBQytCLFFBQVYsR0FBcUJBLFFBQXJCO0FBQ0g7O0FBRUQvRCxNQUFBQSxZQUFZLEdBQUdvTixPQUFPLENBQUN0QixXQUF2QjtBQUNBM0wsTUFBQUEsV0FBVyxHQUFHaU4sT0FBTyxDQUFDQyxVQUF0QjtBQUVBN0csTUFBQUEsVUFBVSxHQUFHekUsT0FBTyxDQUFDd0YsT0FBUixDQUFnQnZILFlBQWhCLEVBQThCRyxXQUE5QixDQUFiO0FBQ0FDLE1BQUFBLFlBQVksR0FBR29HLFVBQVUsQ0FBQ2dCLFlBQTFCO0FBQ0F0SCxNQUFBQSxhQUFhLEdBQUdzRyxVQUFVLENBQUNpQixZQUEzQjtBQUNBcEgsTUFBQUEsU0FBUyxHQUFHbUcsVUFBVSxDQUFDa0IsVUFBWCxJQUF5QixDQUFyQztBQUNBeEIsTUFBQUEsSUFBSSxHQUFHbkUsT0FBTyxDQUFDb0UsTUFBZjtBQUNBQyxNQUFBQSxJQUFJLEdBQUdyRSxPQUFPLENBQUNzRSxNQUFmO0FBQ0FpRyxNQUFBQSxPQUFPLEdBQUd2SyxPQUFPLENBQUN3RSxVQUFsQjs7QUFFQSxXQUFLLElBQUk4RCxFQUFFLEdBQUdqSyxZQUFULEVBQXVCa04sRUFBRSxHQUFHbE4sWUFBWSxHQUFHRCxXQUFoRCxFQUE2RGtLLEVBQUUsR0FBR2lELEVBQWxFLEVBQXNFakQsRUFBRSxFQUF4RSxFQUE0RTtBQUN4RWpFLFFBQUFBLElBQUksQ0FBQ2lFLEVBQUQsQ0FBSixHQUFXbkssYUFBYSxHQUFHc00sT0FBTyxDQUFDRSxnQkFBZ0IsRUFBakIsQ0FBbEM7QUFDSDs7QUFFREMsTUFBQUEsVUFBVSxHQUFHUyxPQUFPLENBQUNHLE9BQXJCO0FBQ0EsVUFBSUMsaUJBQWlCLEdBQUd4TixZQUFZLEdBQUdILGNBQXZDOztBQUNBLFdBQUssSUFBSXNMLEVBQUMsR0FBRyxDQUFiLEVBQWdCQSxFQUFDLEdBQUduTCxZQUFwQixFQUFrQ21MLEVBQUMsRUFBbkMsRUFBdUM7QUFDbkMsWUFBSVksU0FBUyxHQUFHMUwsU0FBUyxHQUFHOEssRUFBQyxHQUFHLENBQWhDO0FBQ0EsWUFBSWEsU0FBUyxHQUFHUyxhQUFhLEdBQUd0QixFQUFDLEdBQUcsQ0FBcEM7QUFFQWpGLFFBQUFBLElBQUksQ0FBQzZGLFNBQUQsQ0FBSixHQUFrQlEsUUFBUSxDQUFDUCxTQUFELENBQTFCO0FBQ0E5RixRQUFBQSxJQUFJLENBQUM2RixTQUFTLEdBQUcsQ0FBYixDQUFKLEdBQXNCUSxRQUFRLENBQUNQLFNBQVMsR0FBRyxDQUFiLENBQTlCO0FBQ0EsWUFBSXlCLENBQUMsU0FBTDtBQUFBLFlBQU9DLEdBQUcsU0FBVjs7QUFDQSxhQUFLRCxDQUFDLEdBQUcsQ0FBSixFQUFPQyxHQUFHLEdBQUdyQixPQUFPLENBQUMvRSxNQUExQixFQUFrQ21HLENBQUMsR0FBR0MsR0FBdEMsRUFBMkNELENBQUMsRUFBNUMsRUFBZ0Q7QUFDNUMsY0FBSXpCLFNBQVMsSUFBSUssT0FBTyxDQUFDb0IsQ0FBRCxDQUF4QixFQUE2QjtBQUNoQzs7QUFDRHZILFFBQUFBLElBQUksQ0FBQzZGLFNBQVMsR0FBRyxDQUFiLENBQUosR0FBc0IzSixNQUFNLEdBQUcsT0FBT3FMLENBQXRDLENBVm1DLENBVVE7O0FBQzNDdkgsUUFBQUEsSUFBSSxDQUFDNkYsU0FBUyxHQUFHLENBQWIsQ0FBSixHQUFzQlEsUUFBUSxDQUFDUCxTQUFTLEdBQUcsQ0FBYixDQUE5QjtBQUNBOUYsUUFBQUEsSUFBSSxDQUFDNkYsU0FBUyxHQUFHLENBQWIsQ0FBSixHQUFzQlEsUUFBUSxDQUFDUCxTQUFTLEdBQUcsQ0FBYixDQUE5QjtBQUNBOUYsUUFBQUEsSUFBSSxDQUFDNkYsU0FBUyxHQUFHLENBQWIsQ0FBSixHQUFzQlEsUUFBUSxDQUFDUCxTQUFTLEdBQUcsQ0FBYixDQUE5QjtBQUNBOUYsUUFBQUEsSUFBSSxDQUFDNkYsU0FBUyxHQUFHLENBQWIsQ0FBSixHQUFzQlEsUUFBUSxDQUFDUCxTQUFTLEdBQUcsQ0FBYixDQUE5QjtBQUNILE9BNUM0QyxDQThDN0M7OztBQUNBUyxNQUFBQSxhQUFhLElBQUlFLFVBQWpCOztBQUVBLFVBQUlHLGFBQUosRUFBbUI7QUFDZixhQUFLLElBQUl6QyxJQUFFLEdBQUdoSyxTQUFULEVBQW9CaU4sR0FBRSxHQUFHak4sU0FBUyxHQUFHbU4saUJBQTFDLEVBQTZEbkQsSUFBRSxHQUFHaUQsR0FBbEUsRUFBc0VqRCxJQUFFLElBQUksQ0FBNUUsRUFBK0U7QUFDM0VuRSxVQUFBQSxJQUFJLENBQUNtRSxJQUFELENBQUosSUFBWXRKLElBQVo7QUFDQW1GLFVBQUFBLElBQUksQ0FBQ21FLElBQUUsR0FBRyxDQUFOLENBQUosSUFBZ0JuSixJQUFoQjtBQUNIO0FBQ0osT0FMRCxNQUtPLElBQUkyTCxTQUFKLEVBQWU7QUFDbEIsYUFBSyxJQUFJeEMsSUFBRSxHQUFHaEssU0FBVCxFQUFvQmlOLElBQUUsR0FBR2pOLFNBQVMsR0FBR21OLGlCQUExQyxFQUE2RG5ELElBQUUsR0FBR2lELElBQWxFLEVBQXNFakQsSUFBRSxJQUFJLENBQTVFLEVBQStFO0FBQzNFMUosVUFBQUEsRUFBRSxHQUFHdUYsSUFBSSxDQUFDbUUsSUFBRCxDQUFUO0FBQ0F6SixVQUFBQSxFQUFFLEdBQUdzRixJQUFJLENBQUNtRSxJQUFFLEdBQUcsQ0FBTixDQUFUO0FBQ0FuRSxVQUFBQSxJQUFJLENBQUNtRSxJQUFELENBQUosR0FBVzFKLEVBQUUsR0FBR0UsSUFBTCxHQUFZRCxFQUFFLEdBQUdFLElBQWpCLEdBQXdCQyxJQUFuQztBQUNBbUYsVUFBQUEsSUFBSSxDQUFDbUUsSUFBRSxHQUFHLENBQU4sQ0FBSixHQUFlMUosRUFBRSxHQUFHSyxJQUFMLEdBQVlKLEVBQUUsR0FBR0ssSUFBakIsR0FBd0JDLElBQXZDO0FBQ0g7QUFDSjs7QUFFRGEsTUFBQUEsT0FBTyxDQUFDaUosTUFBUixDQUFlaEwsWUFBZixFQUE2QkcsV0FBN0I7O0FBQ0EsVUFBSSxDQUFDK0IsVUFBTCxFQUFpQixTQWhFNEIsQ0FrRTdDOztBQUNBLFVBQUl5TCxnQkFBZ0IsR0FBR2xCLGFBQWEsR0FBR0UsVUFBdkM7O0FBQ0EsV0FBSyxJQUFJdEMsSUFBRSxHQUFHaEssU0FBUyxHQUFHLENBQXJCLEVBQXdCaU4sSUFBRSxHQUFHak4sU0FBUyxHQUFHLENBQVosR0FBZ0JzTSxVQUFsRCxFQUE4RHRDLElBQUUsR0FBR2lELElBQW5FLEVBQXVFakQsSUFBRSxJQUFJLENBQU4sRUFBU3NELGdCQUFnQixJQUFJLENBQXBHLEVBQXVHO0FBQ25HLFlBQUlBLGdCQUFnQixJQUFJVCxXQUF4QixFQUFxQztBQUNqQ0QsVUFBQUEsUUFBUSxHQUFHRCxNQUFNLENBQUNELFdBQVcsRUFBWixDQUFqQjs7QUFDQXpJLFVBQUFBLFlBQVksQ0FBQzJJLFFBQUQsQ0FBWjs7QUFDQUMsVUFBQUEsV0FBVyxHQUFHRCxRQUFRLENBQUNFLFFBQXZCO0FBQ0g7O0FBQ0RiLFFBQUFBLE9BQU8sQ0FBQ2pDLElBQUQsQ0FBUCxHQUFjM0ssYUFBZDtBQUNBNE0sUUFBQUEsT0FBTyxDQUFDakMsSUFBRSxHQUFHLENBQU4sQ0FBUCxHQUFrQjFLLFlBQWxCO0FBQ0g7QUFDSjtBQUNKOztTQUVEaU8sY0FBQSxxQkFBWXRJLElBQVosRUFBa0J1SSxRQUFsQixFQUE0QjtBQUV4QixRQUFJOUQsSUFBSSxHQUFHekUsSUFBSSxDQUFDeUUsSUFBaEI7QUFDQUEsSUFBQUEsSUFBSSxDQUFDK0QsV0FBTCxJQUFvQnhRLFVBQVUsQ0FBQ3lRLHVCQUEvQjtBQUNBLFFBQUksQ0FBQ3pJLElBQUksQ0FBQ0csU0FBVixFQUFxQjtBQUVyQixRQUFJdUksU0FBUyxHQUFHakUsSUFBSSxDQUFDa0UsTUFBckI7QUFDQTNPLElBQUFBLE1BQU0sR0FBRzBPLFNBQVMsQ0FBQzdJLENBQVYsR0FBYyxHQUF2QjtBQUNBNUYsSUFBQUEsTUFBTSxHQUFHeU8sU0FBUyxDQUFDOUksQ0FBVixHQUFjLEdBQXZCO0FBQ0ExRixJQUFBQSxNQUFNLEdBQUd3TyxTQUFTLENBQUMvSSxDQUFWLEdBQWMsR0FBdkI7QUFDQXhGLElBQUFBLE1BQU0sR0FBR3VPLFNBQVMsQ0FBQ2hKLENBQVYsR0FBYyxHQUF2QjtBQUVBOUYsSUFBQUEsUUFBUSxHQUFHb0csSUFBSSxDQUFDNEksT0FBTCxJQUFnQjVJLElBQUksQ0FBQ0MsaUJBQUwsRUFBM0I7QUFDQTNGLElBQUFBLGFBQWEsR0FBR1YsUUFBUSxHQUFHeEIsVUFBSCxHQUFnQkYsVUFBeEMsQ0Fid0IsQ0FjeEI7O0FBQ0FxQyxJQUFBQSxjQUFjLEdBQUdYLFFBQVEsR0FBRyxDQUFILEdBQU8sQ0FBaEM7QUFDQW9ELElBQUFBLHNCQUFzQixHQUFHcEQsUUFBUSxHQUFHLENBQUgsR0FBTyxDQUF4QztBQUVBK0MsSUFBQUEsS0FBSyxHQUFHcUQsSUFBSSxDQUFDeUUsSUFBYjtBQUNBaEksSUFBQUEsT0FBTyxHQUFHOEwsUUFBUSxDQUFDTSxTQUFULENBQW1CLE9BQW5CLEVBQTRCdk8sYUFBNUIsQ0FBVjtBQUNBb0MsSUFBQUEsU0FBUyxHQUFHNkwsUUFBWjtBQUNBL0wsSUFBQUEsS0FBSyxHQUFHd0QsSUFBUjtBQUNBbEQsSUFBQUEsTUFBTSxHQUFHSCxLQUFLLENBQUNtTSxLQUFOLElBQWUsQ0FBeEI7QUFFQTFOLElBQUFBLFVBQVUsR0FBRyxJQUFiO0FBQ0E1QixJQUFBQSxtQkFBbUIsR0FBR3dHLElBQUksQ0FBQytJLGtCQUEzQjtBQUNBdFAsSUFBQUEsV0FBVyxHQUFHLEdBQWQ7QUFDQWYsSUFBQUEsVUFBVSxHQUFHLElBQWI7QUFDQWtFLElBQUFBLFVBQVUsR0FBRyxLQUFiO0FBQ0FDLElBQUFBLGFBQWEsR0FBR21ELElBQUksQ0FBQ2dKLGVBQUwsSUFBd0JoSixJQUFJLENBQUNnSixlQUFMLENBQXFCbk0sYUFBN0Q7O0FBRUEsUUFBSTZMLFNBQVMsQ0FBQ08sSUFBVixLQUFtQixVQUFuQixJQUFpQ3pQLG1CQUFyQyxFQUEwRDtBQUN0RG9ELE1BQUFBLFVBQVUsR0FBRyxJQUFiO0FBQ0g7O0FBRUQsUUFBSWhELFFBQUosRUFBYztBQUNWbEIsTUFBQUEsVUFBVSxJQUFJRCxjQUFkO0FBQ0g7O0FBRUQsUUFBSThKLFFBQVEsR0FBR29CLFNBQWY7O0FBQ0EsUUFBSW5ILEtBQUssQ0FBQzBCLFdBQVYsRUFBdUI7QUFDbkJxRSxNQUFBQSxRQUFRLEdBQUc1RixLQUFLLENBQUN1TSxZQUFqQjtBQUNBOU4sTUFBQUEsVUFBVSxHQUFHLEtBQWI7QUFDQTFDLE1BQUFBLFVBQVUsSUFBSUYsVUFBZDtBQUNIOztBQUVELFFBQUl3SCxJQUFJLENBQUNDLGlCQUFMLEVBQUosRUFBOEI7QUFDMUI7QUFDQSxXQUFLMEcsYUFBTCxDQUFtQnBFLFFBQW5CO0FBQ0gsS0FIRCxNQUdPO0FBQ0gsVUFBSTFGLGFBQUosRUFBbUJBLGFBQWEsQ0FBQ3NNLEtBQWQsQ0FBb0JuSixJQUFJLENBQUNHLFNBQXpCO0FBQ25CLFdBQUttQyxnQkFBTCxDQUFzQkMsUUFBdEI7QUFDQSxVQUFJMUYsYUFBSixFQUFtQkEsYUFBYSxDQUFDdU0sR0FBZDtBQUN0QixLQXJEdUIsQ0F1RHhCOzs7QUFDQWIsSUFBQUEsUUFBUSxDQUFDYyxhQUFUOztBQUNBckosSUFBQUEsSUFBSSxDQUFDc0osVUFBTCxDQUFnQkMsaUJBQWhCLEdBekR3QixDQTJEeEI7OztBQUNBNU0sSUFBQUEsS0FBSyxHQUFHZ0gsU0FBUjtBQUNBbEgsSUFBQUEsT0FBTyxHQUFHa0gsU0FBVjtBQUNBakgsSUFBQUEsU0FBUyxHQUFHaUgsU0FBWjtBQUNBbkgsSUFBQUEsS0FBSyxHQUFHbUgsU0FBUjtBQUNBOUcsSUFBQUEsYUFBYSxHQUFHLElBQWhCO0FBQ0g7O1NBRUQyTSxrQkFBQSx5QkFBZ0J4SixJQUFoQixFQUFzQnVJLFFBQXRCLEVBQWdDO0FBQzVCQSxJQUFBQSxRQUFRLENBQUNjLGFBQVQ7QUFDSDs7O0VBN2pCdUNJOzs7O0FBZ2tCNUNBLHNCQUFVQyxRQUFWLENBQW1CN1IsUUFBbkIsRUFBNkJpSSxjQUE3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBBc3NlbWJsZXIgZnJvbSAnLi4vLi4vY29jb3MyZC9jb3JlL3JlbmRlcmVyL2Fzc2VtYmxlcic7XG5cbmNvbnN0IFNrZWxldG9uID0gcmVxdWlyZSgnLi9Ta2VsZXRvbicpO1xuY29uc3Qgc3BpbmUgPSByZXF1aXJlKCcuL2xpYi9zcGluZScpO1xuY29uc3QgUmVuZGVyRmxvdyA9IHJlcXVpcmUoJy4uLy4uL2NvY29zMmQvY29yZS9yZW5kZXJlci9yZW5kZXItZmxvdycpO1xuY29uc3QgVmVydGV4Rm9ybWF0ID0gcmVxdWlyZSgnLi4vLi4vY29jb3MyZC9jb3JlL3JlbmRlcmVyL3dlYmdsL3ZlcnRleC1mb3JtYXQnKVxuY29uc3QgVkZPbmVDb2xvciA9IFZlcnRleEZvcm1hdC52Zm10M0Q7XG5jb25zdCBWRlR3b0NvbG9yID0gVmVydGV4Rm9ybWF0LnZmbXRQb3MzVXZUd29Db2xvcjtcbmNvbnN0IGdmeCA9IGNjLmdmeDtcblxuY29uc3QgRkxBR19CQVRDSCA9IDB4MTA7XG5jb25zdCBGTEFHX1RXT19DT0xPUiA9IDB4MDE7XG5cbmxldCBfaGFuZGxlVmFsID0gMHgwMDtcbmxldCBfcXVhZFRyaWFuZ2xlcyA9IFswLCAxLCAyLCAyLCAzLCAwXTtcbmxldCBfc2xvdENvbG9yID0gY2MuY29sb3IoMCwgMCwgMjU1LCAyNTUpO1xubGV0IF9ib25lQ29sb3IgPSBjYy5jb2xvcigyNTUsIDAsIDAsIDI1NSk7XG5sZXQgX29yaWdpbkNvbG9yID0gY2MuY29sb3IoMCwgMjU1LCAwLCAyNTUpO1xubGV0IF9tZXNoQ29sb3IgPSBjYy5jb2xvcigyNTUsIDI1NSwgMCwgMjU1KTtcblxubGV0IF9maW5hbENvbG9yID0gbnVsbDtcbmxldCBfZGFya0NvbG9yID0gbnVsbDtcbmxldCBfdGVtcFBvcyA9IG51bGwsIF90ZW1wVXYgPSBudWxsO1xuaWYgKCFDQ19OQVRJVkVSRU5ERVJFUikge1xuICAgIF9maW5hbENvbG9yID0gbmV3IHNwaW5lLkNvbG9yKDEsIDEsIDEsIDEpO1xuICAgIF9kYXJrQ29sb3IgPSBuZXcgc3BpbmUuQ29sb3IoMSwgMSwgMSwgMSk7XG4gICAgX3RlbXBQb3MgPSBuZXcgc3BpbmUuVmVjdG9yMigpO1xuICAgIF90ZW1wVXYgPSBuZXcgc3BpbmUuVmVjdG9yMigpO1xufVxuXG5sZXQgX3ByZW11bHRpcGxpZWRBbHBoYTtcbmxldCBfbXVsdGlwbGllcjtcbmxldCBfc2xvdFJhbmdlU3RhcnQ7XG5sZXQgX3Nsb3RSYW5nZUVuZDtcbmxldCBfdXNlVGludDtcbmxldCBfZGVidWdTbG90cztcbmxldCBfZGVidWdCb25lcztcbmxldCBfZGVidWdNZXNoO1xubGV0IF9ub2RlUixcbiAgICBfbm9kZUcsXG4gICAgX25vZGVCLFxuICAgIF9ub2RlQTtcbmxldCBfZmluYWxDb2xvcjMyLCBfZGFya0NvbG9yMzI7XG5sZXQgX3ZlcnRleEZvcm1hdDtcbmxldCBfcGVyVmVydGV4U2l6ZTtcbmxldCBfcGVyQ2xpcFZlcnRleFNpemU7XG5cbi8qKiDlvZPliY1zbG9055qE6aG254K55rWu54K55pWw6K6h5pWwICovXG5sZXQgX3ZlcnRleEZsb2F0Q291bnQgPSAwO1xubGV0IF92ZXJ0ZXhDb3VudCA9IDA7XG5sZXQgX3ZlcnRleEZsb2F0T2Zmc2V0ID0gMDtcbi8qKiDmraTml7bnmoTpobbngrnlnKh2Ym/nmoTlgY/np7sgKi9cbmxldCBfdmVydGV4T2Zmc2V0ID0gMDtcbi8qKiDlvZPliY1zbG9055qE6aG254K557Si5byV6K6h5pWwICovXG5sZXQgX2luZGV4Q291bnQgPSAwO1xuLyoqIOatpOaXtueahOmhtueCueWcqGlib+eahOWBj+enuyAqL1xubGV0IF9pbmRleE9mZnNldCA9IDA7XG5sZXQgX3ZmT2Zmc2V0ID0gMDtcblxubGV0IF90ZW1wciwgX3RlbXBnLCBfdGVtcGI7XG5sZXQgX2luUmFuZ2U7XG5sZXQgX211c3RGbHVzaDtcbmxldCBfeCwgX3ksIF9tMDAsIF9tMDQsIF9tMTIsIF9tMDEsIF9tMDUsIF9tMTM7XG5sZXQgX3IsIF9nLCBfYiwgX2ZyLCBfZmcsIF9mYiwgX2ZhLCBfZHIsIF9kZywgX2RiLCBfZGE7XG5sZXQgX2NvbXAsIF9idWZmZXIsIF9yZW5kZXJlciwgX25vZGUsIF9uZWVkQ29sb3IsIF92ZXJ0ZXhFZmZlY3Q7XG5sZXQgX2RlcHRoO1xubGV0IF9yZWFsdGltZVZlcnRpY2VzID0gW107XG4vKiog5a6e5pe25riy5p+T55qE6aG254K55aSn5bCPKOWtl+iKginvvIzor7vlj5Zza2VsZXRvbuaXtueUqCAqL1xubGV0IF9yZWFsdGltZVNpemVQZXJWZXJ0ZXggPSAwO1xuXG5mdW5jdGlvbiBfZ2V0U2xvdE1hdGVyaWFsKHRleCwgYmxlbmRNb2RlKSB7XG4gICAgbGV0IHNyYywgZHN0O1xuICAgIHN3aXRjaCAoYmxlbmRNb2RlKSB7XG4gICAgICAgIGNhc2Ugc3BpbmUuQmxlbmRNb2RlLkFkZGl0aXZlOlxuICAgICAgICAgICAgc3JjID0gX3ByZW11bHRpcGxpZWRBbHBoYSA/IGNjLm1hY3JvLk9ORSA6IGNjLm1hY3JvLlNSQ19BTFBIQTtcbiAgICAgICAgICAgIGRzdCA9IGNjLm1hY3JvLk9ORTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHNwaW5lLkJsZW5kTW9kZS5NdWx0aXBseTpcbiAgICAgICAgICAgIHNyYyA9IGNjLm1hY3JvLkRTVF9DT0xPUjtcbiAgICAgICAgICAgIGRzdCA9IGNjLm1hY3JvLk9ORV9NSU5VU19TUkNfQUxQSEE7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBzcGluZS5CbGVuZE1vZGUuU2NyZWVuOlxuICAgICAgICAgICAgc3JjID0gY2MubWFjcm8uT05FO1xuICAgICAgICAgICAgZHN0ID0gY2MubWFjcm8uT05FX01JTlVTX1NSQ19DT0xPUjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHNwaW5lLkJsZW5kTW9kZS5Ob3JtYWw6XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBzcmMgPSBfcHJlbXVsdGlwbGllZEFscGhhID8gY2MubWFjcm8uT05FIDogY2MubWFjcm8uU1JDX0FMUEhBO1xuICAgICAgICAgICAgZHN0ID0gY2MubWFjcm8uT05FX01JTlVTX1NSQ19BTFBIQTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGxldCB1c2VNb2RlbCA9ICFfY29tcC5lbmFibGVCYXRjaDtcbiAgICBsZXQgYmFzZU1hdGVyaWFsID0gX2NvbXAuX21hdGVyaWFsc1swXTtcbiAgICBpZiAoIWJhc2VNYXRlcmlhbCkgcmV0dXJuIG51bGw7XG5cbiAgICAvLyBUaGUga2V5IHVzZSB0byBmaW5kIGNvcnJlc3BvbmRpbmcgbWF0ZXJpYWxcbiAgICBsZXQga2V5ID0gdGV4LmdldElkKCkgKyBzcmMgKyBkc3QgKyBfdXNlVGludCArIHVzZU1vZGVsO1xuICAgIGxldCBtYXRlcmlhbENhY2hlID0gX2NvbXAuX21hdGVyaWFsQ2FjaGU7XG4gICAgbGV0IG1hdGVyaWFsID0gbWF0ZXJpYWxDYWNoZVtrZXldO1xuICAgIGlmICghbWF0ZXJpYWwpIHtcbiAgICAgICAgaWYgKCFtYXRlcmlhbENhY2hlLmJhc2VNYXRlcmlhbCkge1xuICAgICAgICAgICAgbWF0ZXJpYWwgPSBiYXNlTWF0ZXJpYWw7XG4gICAgICAgICAgICBtYXRlcmlhbENhY2hlLmJhc2VNYXRlcmlhbCA9IGJhc2VNYXRlcmlhbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1hdGVyaWFsID0gY2MuTWF0ZXJpYWxWYXJpYW50LmNyZWF0ZShiYXNlTWF0ZXJpYWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgbWF0ZXJpYWwuZGVmaW5lKCdDQ19VU0VfTU9ERUwnLCB1c2VNb2RlbCk7XG4gICAgICAgIG1hdGVyaWFsLmRlZmluZSgnVVNFX1RJTlQnLCBfdXNlVGludCk7XG4gICAgICAgIC8vIHVwZGF0ZSB0ZXh0dXJlXG4gICAgICAgIG1hdGVyaWFsLnNldFByb3BlcnR5KCd0ZXh0dXJlJywgdGV4KTtcblxuICAgICAgICAvLyB1cGRhdGUgYmxlbmQgZnVuY3Rpb25cbiAgICAgICAgbWF0ZXJpYWwuc2V0QmxlbmQoXG4gICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgZ2Z4LkJMRU5EX0ZVTkNfQURELFxuICAgICAgICAgICAgc3JjLCBkc3QsXG4gICAgICAgICAgICBnZnguQkxFTkRfRlVOQ19BREQsXG4gICAgICAgICAgICBzcmMsIGRzdFxuICAgICAgICApO1xuICAgICAgICBtYXRlcmlhbENhY2hlW2tleV0gPSBtYXRlcmlhbDtcbiAgICB9XG4gICAgcmV0dXJuIG1hdGVyaWFsO1xufVxuXG5mdW5jdGlvbiBfaGFuZGxlQ29sb3IoY29sb3IpIHtcbiAgICAvLyB0ZW1wIHJnYiBoYXMgbXVsdGlwbHkgMjU1LCBzbyBuZWVkIGRpdmlkZSAyNTU7XG4gICAgX2ZhID0gY29sb3IuZmEgKiBfbm9kZUE7XG4gICAgX211bHRpcGxpZXIgPSBfcHJlbXVsdGlwbGllZEFscGhhID8gX2ZhIC8gMjU1IDogMTtcbiAgICBfciA9IF9ub2RlUiAqIF9tdWx0aXBsaWVyO1xuICAgIF9nID0gX25vZGVHICogX211bHRpcGxpZXI7XG4gICAgX2IgPSBfbm9kZUIgKiBfbXVsdGlwbGllcjtcblxuICAgIF9mciA9IGNvbG9yLmZyICogX3I7XG4gICAgX2ZnID0gY29sb3IuZmcgKiBfZztcbiAgICBfZmIgPSBjb2xvci5mYiAqIF9iO1xuICAgIF9maW5hbENvbG9yMzIgPSAoKF9mYSA8PCAyNCkgPj4+IDApICsgKF9mYiA8PCAxNikgKyAoX2ZnIDw8IDgpICsgX2ZyO1xuXG4gICAgX2RyID0gY29sb3IuZHIgKiBfcjtcbiAgICBfZGcgPSBjb2xvci5kZyAqIF9nO1xuICAgIF9kYiA9IGNvbG9yLmRiICogX2I7XG4gICAgX2RhID0gX3ByZW11bHRpcGxpZWRBbHBoYSA/IDI1NSA6IDA7XG4gICAgX2RhcmtDb2xvcjMyID0gKChfZGEgPDwgMjQpID4+PiAwKSArIChfZGIgPDwgMTYpICsgKF9kZyA8PCA4KSArIF9kcjtcbn1cblxuZnVuY3Rpb24gX3NwaW5lQ29sb3JUb0ludDMyKHNwaW5lQ29sb3IpIHtcbiAgICByZXR1cm4gKChzcGluZUNvbG9yLmEgPDwgMjQpID4+PiAwKSArIChzcGluZUNvbG9yLmIgPDwgMTYpICsgKHNwaW5lQ29sb3IuZyA8PCA4KSArIHNwaW5lQ29sb3Iucjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3BpbmVBc3NlbWJsZXIgZXh0ZW5kcyBBc3NlbWJsZXIge1xuICAgIHVwZGF0ZVJlbmRlckRhdGEoY29tcCkge1xuICAgICAgICBpZiAoY29tcC5pc0FuaW1hdGlvbkNhY2hlZCgpKSByZXR1cm47XG4gICAgICAgIGxldCBza2VsZXRvbiA9IGNvbXAuX3NrZWxldG9uO1xuICAgICAgICBpZiAoc2tlbGV0b24pIHtcbiAgICAgICAgICAgIHNrZWxldG9uLnVwZGF0ZVdvcmxkVHJhbnNmb3JtKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWxsVmVydGljZXMoc2tlbGV0b25Db2xvciwgYXR0YWNobWVudENvbG9yLCBzbG90Q29sb3IsIGNsaXBwZXIsIHNsb3QsIHNsb3RJZHgpIHtcblxuICAgICAgICBsZXQgdmJ1ZiA9IF9idWZmZXIuX3ZEYXRhLFxuICAgICAgICAgICAgaWJ1ZiA9IF9idWZmZXIuX2lEYXRhLFxuICAgICAgICAgICAgdWludFZEYXRhID0gX2J1ZmZlci5fdWludFZEYXRhO1xuICAgICAgICBsZXQgb2Zmc2V0SW5mbztcblxuICAgICAgICBfZmluYWxDb2xvci5hID0gc2xvdENvbG9yLmEgKiBhdHRhY2htZW50Q29sb3IuYSAqIHNrZWxldG9uQ29sb3IuYSAqIF9ub2RlQSAqIDI1NTtcbiAgICAgICAgX211bHRpcGxpZXIgPSBfcHJlbXVsdGlwbGllZEFscGhhID8gX2ZpbmFsQ29sb3IuYSA6IDI1NTtcbiAgICAgICAgX3RlbXByID0gX25vZGVSICogYXR0YWNobWVudENvbG9yLnIgKiBza2VsZXRvbkNvbG9yLnIgKiBfbXVsdGlwbGllcjtcbiAgICAgICAgX3RlbXBnID0gX25vZGVHICogYXR0YWNobWVudENvbG9yLmcgKiBza2VsZXRvbkNvbG9yLmcgKiBfbXVsdGlwbGllcjtcbiAgICAgICAgX3RlbXBiID0gX25vZGVCICogYXR0YWNobWVudENvbG9yLmIgKiBza2VsZXRvbkNvbG9yLmIgKiBfbXVsdGlwbGllcjtcblxuICAgICAgICBfZmluYWxDb2xvci5yID0gX3RlbXByICogc2xvdENvbG9yLnI7XG4gICAgICAgIF9maW5hbENvbG9yLmcgPSBfdGVtcGcgKiBzbG90Q29sb3IuZztcbiAgICAgICAgX2ZpbmFsQ29sb3IuYiA9IF90ZW1wYiAqIHNsb3RDb2xvci5iO1xuXG4gICAgICAgIGlmIChzbG90LmRhcmtDb2xvciA9PSBudWxsKSB7XG4gICAgICAgICAgICBfZGFya0NvbG9yLnNldCgwLjAsIDAuMCwgMC4wLCAxLjApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX2RhcmtDb2xvci5yID0gc2xvdC5kYXJrQ29sb3IuciAqIF90ZW1wcjtcbiAgICAgICAgICAgIF9kYXJrQ29sb3IuZyA9IHNsb3QuZGFya0NvbG9yLmcgKiBfdGVtcGc7XG4gICAgICAgICAgICBfZGFya0NvbG9yLmIgPSBzbG90LmRhcmtDb2xvci5iICogX3RlbXBiO1xuICAgICAgICB9XG4gICAgICAgIF9kYXJrQ29sb3IuYSA9IF9wcmVtdWx0aXBsaWVkQWxwaGEgPyAyNTUgOiAwO1xuXG4gICAgICAgIGlmICgvKiohY2xpcHBlci5pc0NsaXBwaW5nKCkqL3RydWUpIHtcbiAgICAgICAgICAgIGlmIChfdmVydGV4RWZmZWN0KSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdiA9IF92ZXJ0ZXhGbG9hdE9mZnNldCwgbiA9IF92ZXJ0ZXhGbG9hdE9mZnNldCArIF92ZXJ0ZXhGbG9hdENvdW50OyB2IDwgbjsgdiArPSBfcGVyVmVydGV4U2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICBfdGVtcFBvcy54ID0gdmJ1Zlt2XTtcbiAgICAgICAgICAgICAgICAgICAgX3RlbXBQb3MueSA9IHZidWZbdiArIDFdO1xuICAgICAgICAgICAgICAgICAgICBfdGVtcFV2LnggPSB2YnVmW3YgKyAzXTtcbiAgICAgICAgICAgICAgICAgICAgX3RlbXBVdi55ID0gdmJ1Zlt2ICsgNF07XG4gICAgICAgICAgICAgICAgICAgIF92ZXJ0ZXhFZmZlY3QudHJhbnNmb3JtKF90ZW1wUG9zLCBfdGVtcFV2LCBfZmluYWxDb2xvciwgX2RhcmtDb2xvcik7XG5cbiAgICAgICAgICAgICAgICAgICAgdmJ1Zlt2XSA9IF90ZW1wUG9zLng7ICAgICAgICAvLyB4XG4gICAgICAgICAgICAgICAgICAgIHZidWZbdiArIDFdID0gX3RlbXBQb3MueTsgICAgICAgIC8vIHlcbiAgICAgICAgICAgICAgICAgICAgdmJ1Zlt2ICsgM10gPSBfdGVtcFV2Lng7ICAgICAgICAgLy8gdVxuICAgICAgICAgICAgICAgICAgICB2YnVmW3YgKyA0XSA9IF90ZW1wVXYueTsgICAgICAgICAvLyB2XG4gICAgICAgICAgICAgICAgICAgIHVpbnRWRGF0YVt2ICsgNV0gPSBfc3BpbmVDb2xvclRvSW50MzIoX2ZpbmFsQ29sb3IpOyAgICAgICAgICAgICAgICAgIC8vIGxpZ2h0IGNvbG9yXG4gICAgICAgICAgICAgICAgICAgIF91c2VUaW50ICYmICh1aW50VkRhdGFbdiArIDZdID0gX3NwaW5lQ29sb3JUb0ludDMyKF9kYXJrQ29sb3IpKTsgICAgICAvLyBkYXJrIGNvbG9yXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfZmluYWxDb2xvcjMyID0gX3NwaW5lQ29sb3JUb0ludDMyKF9maW5hbENvbG9yKTtcbiAgICAgICAgICAgICAgICBfZGFya0NvbG9yMzIgPSBfc3BpbmVDb2xvclRvSW50MzIoX2RhcmtDb2xvcik7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCB2ID0gX3ZlcnRleEZsb2F0T2Zmc2V0LCBuID0gX3ZlcnRleEZsb2F0T2Zmc2V0ICsgX3ZlcnRleEZsb2F0Q291bnQ7IHYgPCBuOyB2ICs9IF9wZXJWZXJ0ZXhTaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIHVpbnRWRGF0YVt2ICsgNV0gPSBfZmluYWxDb2xvcjMyOyAgICAgICAgICAgICAgICAgICAvLyBsaWdodCBjb2xvclxuICAgICAgICAgICAgICAgICAgICBfdXNlVGludCAmJiAodWludFZEYXRhW3YgKyA2XSA9IF9kYXJrQ29sb3IzMik7ICAgICAgLy8gZGFyayBjb2xvclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCB1dnMgPSB2YnVmLnN1YmFycmF5KF92ZXJ0ZXhGbG9hdE9mZnNldCArIDMpO1xuICAgICAgICAgICAgY2xpcHBlci5jbGlwVHJpYW5nbGVzKHZidWYuc3ViYXJyYXkoX3ZlcnRleEZsb2F0T2Zmc2V0KSwgX3ZlcnRleEZsb2F0Q291bnQsIGlidWYuc3ViYXJyYXkoX2luZGV4T2Zmc2V0KSwgX2luZGV4Q291bnQsIHV2cywgX2ZpbmFsQ29sb3IsIF9kYXJrQ29sb3IsIF91c2VUaW50LCBfcGVyVmVydGV4U2l6ZSk7XG4gICAgICAgICAgICBsZXQgY2xpcHBlZFZlcnRpY2VzID0gbmV3IEZsb2F0MzJBcnJheShjbGlwcGVyLmNsaXBwZWRWZXJ0aWNlcyk7XG4gICAgICAgICAgICBsZXQgY2xpcHBlZFRyaWFuZ2xlcyA9IGNsaXBwZXIuY2xpcHBlZFRyaWFuZ2xlcztcblxuICAgICAgICAgICAgLy8gaW5zdXJlIGNhcGFjaXR5XG4gICAgICAgICAgICBfaW5kZXhDb3VudCA9IGNsaXBwZWRUcmlhbmdsZXMubGVuZ3RoO1xuICAgICAgICAgICAgX3ZlcnRleEZsb2F0Q291bnQgPSBjbGlwcGVkVmVydGljZXMubGVuZ3RoIC8gX3BlckNsaXBWZXJ0ZXhTaXplICogX3BlclZlcnRleFNpemU7XG5cbiAgICAgICAgICAgIG9mZnNldEluZm8gPSBfYnVmZmVyLnJlcXVlc3QoX3ZlcnRleEZsb2F0Q291bnQgLyBfcGVyVmVydGV4U2l6ZSwgX2luZGV4Q291bnQpO1xuICAgICAgICAgICAgX2luZGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby5pbmRpY2VPZmZzZXQsXG4gICAgICAgICAgICAgICAgX3ZlcnRleE9mZnNldCA9IG9mZnNldEluZm8udmVydGV4T2Zmc2V0LFxuICAgICAgICAgICAgICAgIF92ZXJ0ZXhGbG9hdE9mZnNldCA9IG9mZnNldEluZm8uYnl0ZU9mZnNldCA+PiAyO1xuICAgICAgICAgICAgdmJ1ZiA9IF9idWZmZXIuX3ZEYXRhLFxuICAgICAgICAgICAgICAgIGlidWYgPSBfYnVmZmVyLl9pRGF0YTtcbiAgICAgICAgICAgIHVpbnRWRGF0YSA9IF9idWZmZXIuX3VpbnRWRGF0YTtcblxuICAgICAgICAgICAgLy8gZmlsbCBpbmRpY2VzXG4gICAgICAgICAgICBpYnVmLnNldChjbGlwcGVkVHJpYW5nbGVzLCBfaW5kZXhPZmZzZXQpO1xuXG4gICAgICAgICAgICAvLyBmaWxsIHZlcnRpY2VzIGNvbnRhaW4geCB5IHUgdiBsaWdodCBjb2xvciBkYXJrIGNvbG9yXG4gICAgICAgICAgICBpZiAoX3ZlcnRleEVmZmVjdCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHYgPSAwLCBuID0gY2xpcHBlZFZlcnRpY2VzLmxlbmd0aCwgb2Zmc2V0ID0gX3ZlcnRleEZsb2F0T2Zmc2V0OyB2IDwgbjsgdiArPSBfcGVyQ2xpcFZlcnRleFNpemUsIG9mZnNldCArPSBfcGVyVmVydGV4U2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICBfdGVtcFBvcy54ID0gY2xpcHBlZFZlcnRpY2VzW3ZdO1xuICAgICAgICAgICAgICAgICAgICBfdGVtcFBvcy55ID0gY2xpcHBlZFZlcnRpY2VzW3YgKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgX2ZpbmFsQ29sb3Iuc2V0KGNsaXBwZWRWZXJ0aWNlc1t2ICsgMl0sIGNsaXBwZWRWZXJ0aWNlc1t2ICsgM10sIGNsaXBwZWRWZXJ0aWNlc1t2ICsgNF0sIGNsaXBwZWRWZXJ0aWNlc1t2ICsgNV0pO1xuICAgICAgICAgICAgICAgICAgICBfdGVtcFV2LnggPSBjbGlwcGVkVmVydGljZXNbdiArIDZdO1xuICAgICAgICAgICAgICAgICAgICBfdGVtcFV2LnkgPSBjbGlwcGVkVmVydGljZXNbdiArIDddO1xuICAgICAgICAgICAgICAgICAgICBpZiAoX3VzZVRpbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kYXJrQ29sb3Iuc2V0KGNsaXBwZWRWZXJ0aWNlc1t2ICsgOF0sIGNsaXBwZWRWZXJ0aWNlc1t2ICsgOV0sIGNsaXBwZWRWZXJ0aWNlc1t2ICsgMTBdLCBjbGlwcGVkVmVydGljZXNbdiArIDExXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfZGFya0NvbG9yLnNldCgwLCAwLCAwLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfdmVydGV4RWZmZWN0LnRyYW5zZm9ybShfdGVtcFBvcywgX3RlbXBVdiwgX2ZpbmFsQ29sb3IsIF9kYXJrQ29sb3IpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZidWZbb2Zmc2V0XSA9IF90ZW1wUG9zLng7ICAgICAgICAgICAgIC8vIHhcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltvZmZzZXQgKyAxXSA9IF90ZW1wUG9zLnk7ICAgICAgICAgLy8geVxuICAgICAgICAgICAgICAgICAgICB2YnVmW29mZnNldCArIDJdID0gX3RlbXBVdi54OyAgICAgICAgICAvLyB1XG4gICAgICAgICAgICAgICAgICAgIHZidWZbb2Zmc2V0ICsgM10gPSBfdGVtcFV2Lnk7ICAgICAgICAgIC8vIHZcbiAgICAgICAgICAgICAgICAgICAgdWludFZEYXRhW29mZnNldCArIDRdID0gX3NwaW5lQ29sb3JUb0ludDMyKF9maW5hbENvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF91c2VUaW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1aW50VkRhdGFbb2Zmc2V0ICsgNV0gPSBfc3BpbmVDb2xvclRvSW50MzIoX2RhcmtDb2xvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHYgPSAwLCBuID0gY2xpcHBlZFZlcnRpY2VzLmxlbmd0aCwgb2Zmc2V0ID0gX3ZlcnRleEZsb2F0T2Zmc2V0OyB2IDwgbjsgdiArPSBfcGVyQ2xpcFZlcnRleFNpemUsIG9mZnNldCArPSBfcGVyVmVydGV4U2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YnVmW29mZnNldF0gPSBjbGlwcGVkVmVydGljZXNbdl07ICAgICAgICAgLy8geFxuICAgICAgICAgICAgICAgICAgICB2YnVmW29mZnNldCArIDFdID0gY2xpcHBlZFZlcnRpY2VzW3YgKyAxXTsgICAgIC8vIHlcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltvZmZzZXQgKyAyXSA9IGNsaXBwZWRWZXJ0aWNlc1t2ICsgNl07ICAgICAvLyB1XG4gICAgICAgICAgICAgICAgICAgIHZidWZbb2Zmc2V0ICsgM10gPSBjbGlwcGVkVmVydGljZXNbdiArIDddOyAgICAgLy8gdlxuXG4gICAgICAgICAgICAgICAgICAgIF9maW5hbENvbG9yMzIgPSAoKGNsaXBwZWRWZXJ0aWNlc1t2ICsgNV0gPDwgMjQpID4+PiAwKSArIChjbGlwcGVkVmVydGljZXNbdiArIDRdIDw8IDE2KSArIChjbGlwcGVkVmVydGljZXNbdiArIDNdIDw8IDgpICsgY2xpcHBlZFZlcnRpY2VzW3YgKyAyXTtcbiAgICAgICAgICAgICAgICAgICAgdWludFZEYXRhW29mZnNldCArIDRdID0gX2ZpbmFsQ29sb3IzMjtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoX3VzZVRpbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kYXJrQ29sb3IzMiA9ICgoY2xpcHBlZFZlcnRpY2VzW3YgKyAxMV0gPDwgMjQpID4+PiAwKSArIChjbGlwcGVkVmVydGljZXNbdiArIDEwXSA8PCAxNikgKyAoY2xpcHBlZFZlcnRpY2VzW3YgKyA5XSA8PCA4KSArIGNsaXBwZWRWZXJ0aWNlc1t2ICsgOF07XG4gICAgICAgICAgICAgICAgICAgICAgICB1aW50VkRhdGFbb2Zmc2V0ICsgNV0gPSBfZGFya0NvbG9yMzI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWFsVGltZVRyYXZlcnNlKHdvcmxkTWF0KSB7XG4gICAgICAgIGxldCB2YnVmO1xuICAgICAgICBsZXQgaWJ1ZjtcblxuICAgICAgICBsZXQgbG9jU2tlbGV0b24gPSBfY29tcC5fc2tlbGV0b247XG4gICAgICAgIGxldCBza2VsZXRvbkNvbG9yID0gbG9jU2tlbGV0b24uY29sb3I7XG4gICAgICAgIGxldCBncmFwaGljcyA9IF9jb21wLl9kZWJ1Z1JlbmRlcmVyO1xuICAgICAgICBsZXQgY2xpcHBlciA9IF9jb21wLl9jbGlwcGVyO1xuICAgICAgICBsZXQgbWF0ZXJpYWwgPSBudWxsO1xuICAgICAgICBsZXQgYXR0YWNobWVudCwgYXR0YWNobWVudENvbG9yLCBzbG90Q29sb3IsIHV2cywgdHJpYW5nbGVzO1xuICAgICAgICBsZXQgaXNSZWdpb24sIGlzTWVzaCwgaXNDbGlwO1xuICAgICAgICBsZXQgb2Zmc2V0SW5mbztcbiAgICAgICAgbGV0IHNsb3Q7XG4gICAgICAgIGxldCB3b3JsZE1hdG07XG5cbiAgICAgICAgX3Nsb3RSYW5nZVN0YXJ0ID0gX2NvbXAuX3N0YXJ0U2xvdEluZGV4O1xuICAgICAgICBfc2xvdFJhbmdlRW5kID0gX2NvbXAuX2VuZFNsb3RJbmRleDtcbiAgICAgICAgX2luUmFuZ2UgPSBmYWxzZTtcbiAgICAgICAgaWYgKF9zbG90UmFuZ2VTdGFydCA9PSAtMSkgX2luUmFuZ2UgPSB0cnVlO1xuXG4gICAgICAgIF9kZWJ1Z1Nsb3RzID0gX2NvbXAuZGVidWdTbG90cztcbiAgICAgICAgX2RlYnVnQm9uZXMgPSBfY29tcC5kZWJ1Z0JvbmVzO1xuICAgICAgICBfZGVidWdNZXNoID0gX2NvbXAuZGVidWdNZXNoO1xuICAgICAgICBpZiAoZ3JhcGhpY3MgJiYgKF9kZWJ1Z0JvbmVzIHx8IF9kZWJ1Z1Nsb3RzIHx8IF9kZWJ1Z01lc2gpKSB7XG4gICAgICAgICAgICBncmFwaGljcy5jbGVhcigpO1xuICAgICAgICAgICAgZ3JhcGhpY3MubGluZVdpZHRoID0gMjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHggeSB1IHYgcjEgZzEgYjEgYTEgcjIgZzIgYjIgYTIgb3IgeCB5IHUgdiByIGcgYiBhIFxuICAgICAgICBfcGVyQ2xpcFZlcnRleFNpemUgPSBfdXNlVGludCA/IDEyIDogODtcblxuICAgICAgICBfdmVydGV4RmxvYXRDb3VudCA9IDA7XG4gICAgICAgIF92ZXJ0ZXhGbG9hdE9mZnNldCA9IDA7XG4gICAgICAgIF92ZXJ0ZXhPZmZzZXQgPSAwO1xuICAgICAgICBfaW5kZXhDb3VudCA9IDA7XG4gICAgICAgIF9pbmRleE9mZnNldCA9IDA7XG4gICAgICAgIF9yZWFsdGltZVZlcnRpY2VzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgZm9yIChsZXQgc2xvdElkeCA9IDAsIHNsb3RDb3VudCA9IGxvY1NrZWxldG9uLmRyYXdPcmRlci5sZW5ndGg7IHNsb3RJZHggPCBzbG90Q291bnQ7IHNsb3RJZHgrKykge1xuICAgICAgICAgICAgc2xvdCA9IGxvY1NrZWxldG9uLmRyYXdPcmRlcltzbG90SWR4XTtcblxuICAgICAgICAgICAgaWYgKHNsb3QgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfc2xvdFJhbmdlU3RhcnQgPj0gMCAmJiBfc2xvdFJhbmdlU3RhcnQgPT0gc2xvdC5kYXRhLmluZGV4KSB7XG4gICAgICAgICAgICAgICAgX2luUmFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIV9pblJhbmdlKSB7XG4gICAgICAgICAgICAgICAgY2xpcHBlci5jbGlwRW5kV2l0aFNsb3Qoc2xvdCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfc2xvdFJhbmdlRW5kID49IDAgJiYgX3Nsb3RSYW5nZUVuZCA9PSBzbG90LmRhdGEuaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBfaW5SYW5nZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfdmVydGV4RmxvYXRDb3VudCA9IDA7XG4gICAgICAgICAgICBfaW5kZXhDb3VudCA9IDA7XG4gICAgICAgICAgICBfcmVhbHRpbWVWZXJ0aWNlcy5sZW5ndGggPSAwO1xuXG4gICAgICAgICAgICBhdHRhY2htZW50ID0gc2xvdC5nZXRBdHRhY2htZW50KCk7XG4gICAgICAgICAgICBpZiAoIWF0dGFjaG1lbnQpIHtcbiAgICAgICAgICAgICAgICBjbGlwcGVyLmNsaXBFbmRXaXRoU2xvdChzbG90KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaXNSZWdpb24gPSBhdHRhY2htZW50IGluc3RhbmNlb2Ygc3BpbmUuUmVnaW9uQXR0YWNobWVudDtcbiAgICAgICAgICAgIGlzTWVzaCA9IGF0dGFjaG1lbnQgaW5zdGFuY2VvZiBzcGluZS5NZXNoQXR0YWNobWVudDtcbiAgICAgICAgICAgIGlzQ2xpcCA9IGF0dGFjaG1lbnQgaW5zdGFuY2VvZiBzcGluZS5DbGlwcGluZ0F0dGFjaG1lbnQ7XG5cbiAgICAgICAgICAgIGlmIChpc0NsaXApIHtcbiAgICAgICAgICAgICAgICBjbGlwcGVyLmNsaXBTdGFydChzbG90LCBhdHRhY2htZW50KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFpc1JlZ2lvbiAmJiAhaXNNZXNoKSB7XG4gICAgICAgICAgICAgICAgY2xpcHBlci5jbGlwRW5kV2l0aFNsb3Qoc2xvdCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdGVyaWFsID0gX2dldFNsb3RNYXRlcmlhbChhdHRhY2htZW50LnJlZ2lvbi50ZXh0dXJlLl90ZXh0dXJlLCBzbG90LmRhdGEuYmxlbmRNb2RlKTtcbiAgICAgICAgICAgIGlmICghbWF0ZXJpYWwpIHtcbiAgICAgICAgICAgICAgICBjbGlwcGVyLmNsaXBFbmRXaXRoU2xvdChzbG90KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF9tdXN0Rmx1c2ggfHwgbWF0ZXJpYWwuZ2V0SGFzaCgpICE9PSBfcmVuZGVyZXIubWF0ZXJpYWwuZ2V0SGFzaCgpKSB7XG4gICAgICAgICAgICAgICAgX211c3RGbHVzaCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIF9yZW5kZXJlci5fZmx1c2goKTtcbiAgICAgICAgICAgICAgICBfcmVuZGVyZXIubm9kZSA9IF9ub2RlO1xuICAgICAgICAgICAgICAgIF9yZW5kZXJlci5tYXRlcmlhbCA9IG1hdGVyaWFsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaXNSZWdpb24pIHtcblxuICAgICAgICAgICAgICAgIHRyaWFuZ2xlcyA9IF9xdWFkVHJpYW5nbGVzO1xuXG4gICAgICAgICAgICAgICAgLy8gaW5zdXJlIGNhcGFjaXR5XG4gICAgICAgICAgICAgICAgX3ZlcnRleEZsb2F0Q291bnQgPSA0ICogX3BlclZlcnRleFNpemU7XG4gICAgICAgICAgICAgICAgX2luZGV4Q291bnQgPSA2O1xuXG4gICAgICAgICAgICAgICAgb2Zmc2V0SW5mbyA9IF9idWZmZXIucmVxdWVzdCg0LCA2KTtcbiAgICAgICAgICAgICAgICBfaW5kZXhPZmZzZXQgPSBvZmZzZXRJbmZvLmluZGljZU9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgX3ZlcnRleE9mZnNldCA9IG9mZnNldEluZm8udmVydGV4T2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICBfdmVydGV4RmxvYXRPZmZzZXQgPSBvZmZzZXRJbmZvLmJ5dGVPZmZzZXQgPj4gMjtcbiAgICAgICAgICAgICAgICB2YnVmID0gX2J1ZmZlci5fdkRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGlidWYgPSBfYnVmZmVyLl9pRGF0YTtcblxuICAgICAgICAgICAgICAgIC8vIGNvbXB1dGUgdmVydGV4IGFuZCBmaWxsIHggeVxuICAgICAgICAgICAgICAgIC8vIGF0dGFjaG1lbnQuY29tcHV0ZVdvcmxkVmVydGljZXMoc2xvdC5ib25lLCB2YnVmLCBfdmVydGV4RmxvYXRPZmZzZXQsIF9wZXJWZXJ0ZXhTaXplKTtcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50LmNvbXB1dGVXb3JsZFZlcnRpY2VzKHNsb3QuYm9uZSwgX3JlYWx0aW1lVmVydGljZXMsIDAsIF9yZWFsdGltZVNpemVQZXJWZXJ0ZXgpO1xuXG4gICAgICAgICAgICAgICAgLy/lsIbmraRzbG9055qE6aG254K55YaZ5YWl57yT5a2Y5Yy6XG4gICAgICAgICAgICAgICAgdGhpcy5fd3JpdGVWZXJ0ZXgyVG9WZXJ0ZXgzQnVmZmVyKF9yZWFsdGltZVZlcnRpY2VzLCB2YnVmLCBfdmVydGV4RmxvYXRPZmZzZXQsIDQsIHNsb3RJZHgpO1xuXG4gICAgICAgICAgICAgICAgLy8gZHJhdyBkZWJ1ZyBzbG90cyBpZiBlbmFibGVkIGdyYXBoaWNzXG4gICAgICAgICAgICAgICAgaWYgKGdyYXBoaWNzICYmIF9kZWJ1Z1Nsb3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLnN0cm9rZUNvbG9yID0gX3Nsb3RDb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MubW92ZVRvKHZidWZbX3ZlcnRleEZsb2F0T2Zmc2V0XSwgdmJ1ZltfdmVydGV4RmxvYXRPZmZzZXQgKyAxXSk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGlpID0gX3ZlcnRleEZsb2F0T2Zmc2V0ICsgX3BlclZlcnRleFNpemUsIG5uID0gX3ZlcnRleEZsb2F0T2Zmc2V0ICsgX3ZlcnRleEZsb2F0Q291bnQ7IGlpIDwgbm47IGlpICs9IF9wZXJWZXJ0ZXhTaXplKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5saW5lVG8odmJ1ZltpaV0sIHZidWZbaWkgKyAxXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3Muc3Ryb2tlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNNZXNoKSB7XG5cbiAgICAgICAgICAgICAgICB0cmlhbmdsZXMgPSBhdHRhY2htZW50LnRyaWFuZ2xlcztcblxuICAgICAgICAgICAgICAgIC8vIGluc3VyZSBjYXBhY2l0eVxuICAgICAgICAgICAgICAgIF92ZXJ0ZXhGbG9hdENvdW50ID0gKGF0dGFjaG1lbnQud29ybGRWZXJ0aWNlc0xlbmd0aCA+PiAxKSAqIF9wZXJWZXJ0ZXhTaXplO1xuICAgICAgICAgICAgICAgIF9pbmRleENvdW50ID0gdHJpYW5nbGVzLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIG9mZnNldEluZm8gPSBfYnVmZmVyLnJlcXVlc3QoX3ZlcnRleEZsb2F0Q291bnQgLyBfcGVyVmVydGV4U2l6ZSwgX2luZGV4Q291bnQpO1xuICAgICAgICAgICAgICAgIF9pbmRleE9mZnNldCA9IG9mZnNldEluZm8uaW5kaWNlT2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICBfdmVydGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby52ZXJ0ZXhPZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgIF92ZXJ0ZXhGbG9hdE9mZnNldCA9IG9mZnNldEluZm8uYnl0ZU9mZnNldCA+PiAyO1xuICAgICAgICAgICAgICAgIHZidWYgPSBfYnVmZmVyLl92RGF0YSxcbiAgICAgICAgICAgICAgICAgICAgaWJ1ZiA9IF9idWZmZXIuX2lEYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8gY29tcHV0ZSB2ZXJ0ZXggYW5kIGZpbGwgeCB5XG4gICAgICAgICAgICAgICAgLy8gYXR0YWNobWVudC5jb21wdXRlV29ybGRWZXJ0aWNlcyhzbG90LCAwLCBhdHRhY2htZW50LndvcmxkVmVydGljZXNMZW5ndGgsIHZidWYsIF92ZXJ0ZXhGbG9hdE9mZnNldCwgX3BlclZlcnRleFNpemUpO1xuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnQuY29tcHV0ZVdvcmxkVmVydGljZXMoc2xvdCwgMCwgYXR0YWNobWVudC53b3JsZFZlcnRpY2VzTGVuZ3RoLCBfcmVhbHRpbWVWZXJ0aWNlcywgMCwgX3JlYWx0aW1lU2l6ZVBlclZlcnRleCk7XG5cbiAgICAgICAgICAgICAgICAvL+WwhuatpHNsb3TnmoTpobbngrnlhpnlhaXnvJPlrZjljLpcbiAgICAgICAgICAgICAgICB0aGlzLl93cml0ZVZlcnRleDJUb1ZlcnRleDNCdWZmZXIoX3JlYWx0aW1lVmVydGljZXMsIHZidWYsIF92ZXJ0ZXhGbG9hdE9mZnNldCwgX3ZlcnRleEZsb2F0Q291bnQgLyBfcGVyVmVydGV4U2l6ZSwgc2xvdElkeCk7XG5cbiAgICAgICAgICAgICAgICAvLyBkcmF3IGRlYnVnIG1lc2ggaWYgZW5hYmxlZCBncmFwaGljc1xuICAgICAgICAgICAgICAgIGlmIChncmFwaGljcyAmJiBfZGVidWdNZXNoKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLnN0cm9rZUNvbG9yID0gX21lc2hDb2xvcjtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpaSA9IDAsIG5uID0gdHJpYW5nbGVzLmxlbmd0aDsgaWkgPCBubjsgaWkgKz0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHYxID0gdHJpYW5nbGVzW2lpXSAqIF9wZXJWZXJ0ZXhTaXplICsgX3ZlcnRleEZsb2F0T2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHYyID0gdHJpYW5nbGVzW2lpICsgMV0gKiBfcGVyVmVydGV4U2l6ZSArIF92ZXJ0ZXhGbG9hdE9mZnNldDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2MyA9IHRyaWFuZ2xlc1tpaSArIDJdICogX3BlclZlcnRleFNpemUgKyBfdmVydGV4RmxvYXRPZmZzZXQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLm1vdmVUbyh2YnVmW3YxXSwgdmJ1Zlt2MSArIDFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLmxpbmVUbyh2YnVmW3YyXSwgdmJ1Zlt2MiArIDFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLmxpbmVUbyh2YnVmW3YzXSwgdmJ1Zlt2MyArIDFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5zdHJva2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF92ZXJ0ZXhGbG9hdENvdW50ID09IDAgfHwgX2luZGV4Q291bnQgPT0gMCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmaWxsIGluZGljZXNcbiAgICAgICAgICAgIGlidWYuc2V0KHRyaWFuZ2xlcywgX2luZGV4T2Zmc2V0KTtcblxuICAgICAgICAgICAgLy8gZmlsbCB1IHZcbiAgICAgICAgICAgIHV2cyA9IGF0dGFjaG1lbnQudXZzO1xuICAgICAgICAgICAgZm9yIChsZXQgdiA9IF92ZXJ0ZXhGbG9hdE9mZnNldCwgbiA9IF92ZXJ0ZXhGbG9hdE9mZnNldCArIF92ZXJ0ZXhGbG9hdENvdW50LCB1ID0gMDsgdiA8IG47IHYgKz0gX3BlclZlcnRleFNpemUsIHUgKz0gMikge1xuICAgICAgICAgICAgICAgIHZidWZbdiArIDNdID0gdXZzW3VdOyAgICAgICAgICAgLy8gdVxuICAgICAgICAgICAgICAgIHZidWZbdiArIDRdID0gdXZzW3UgKyAxXTsgICAgICAgLy8gdlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhdHRhY2htZW50Q29sb3IgPSBhdHRhY2htZW50LmNvbG9yLFxuICAgICAgICAgICAgICAgIHNsb3RDb2xvciA9IHNsb3QuY29sb3I7XG5cbiAgICAgICAgICAgIHRoaXMuZmlsbFZlcnRpY2VzKHNrZWxldG9uQ29sb3IsIGF0dGFjaG1lbnRDb2xvciwgc2xvdENvbG9yLCBjbGlwcGVyLCBzbG90LCBzbG90SWR4KTtcblxuICAgICAgICAgICAgLy8gcmVzZXQgYnVmZmVyIHBvaW50ZXIsIGJlY2F1c2UgY2xpcHBlciBtYXliZSByZWFsbG9jIGEgbmV3IGJ1ZmZlciBpbiBmaWxlIFZlcnRpY2VzIGZ1bmN0aW9uLlxuICAgICAgICAgICAgdmJ1ZiA9IF9idWZmZXIuX3ZEYXRhLFxuICAgICAgICAgICAgICAgIGlidWYgPSBfYnVmZmVyLl9pRGF0YTtcblxuICAgICAgICAgICAgaWYgKF9pbmRleENvdW50ID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGlpID0gX2luZGV4T2Zmc2V0LCBubiA9IF9pbmRleE9mZnNldCArIF9pbmRleENvdW50OyBpaSA8IG5uOyBpaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlidWZbaWldICs9IF92ZXJ0ZXhPZmZzZXQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHdvcmxkTWF0KSB7XG4gICAgICAgICAgICAgICAgICAgIHdvcmxkTWF0bSA9IHdvcmxkTWF0Lm07XG4gICAgICAgICAgICAgICAgICAgIF9tMDAgPSB3b3JsZE1hdG1bMF07XG4gICAgICAgICAgICAgICAgICAgIF9tMDQgPSB3b3JsZE1hdG1bNF07XG4gICAgICAgICAgICAgICAgICAgIF9tMTIgPSB3b3JsZE1hdG1bMTJdO1xuICAgICAgICAgICAgICAgICAgICBfbTAxID0gd29ybGRNYXRtWzFdO1xuICAgICAgICAgICAgICAgICAgICBfbTA1ID0gd29ybGRNYXRtWzVdO1xuICAgICAgICAgICAgICAgICAgICBfbTEzID0gd29ybGRNYXRtWzEzXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaWkgPSBfdmVydGV4RmxvYXRPZmZzZXQsIG5uID0gX3ZlcnRleEZsb2F0T2Zmc2V0ICsgX3ZlcnRleEZsb2F0Q291bnQ7IGlpIDwgbm47IGlpICs9IF9wZXJWZXJ0ZXhTaXplKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfeCA9IHZidWZbaWldO1xuICAgICAgICAgICAgICAgICAgICAgICAgX3kgPSB2YnVmW2lpICsgMV07XG4gICAgICAgICAgICAgICAgICAgICAgICB2YnVmW2lpXSA9IF94ICogX20wMCArIF95ICogX20wNCArIF9tMTI7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YnVmW2lpICsgMV0gPSBfeCAqIF9tMDEgKyBfeSAqIF9tMDUgKyBfbTEzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF9idWZmZXIuYWRqdXN0KF92ZXJ0ZXhGbG9hdENvdW50IC8gX3BlclZlcnRleFNpemUsIF9pbmRleENvdW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2xpcHBlci5jbGlwRW5kV2l0aFNsb3Qoc2xvdCk7XG4gICAgICAgIH1cblxuICAgICAgICBjbGlwcGVyLmNsaXBFbmQoKTtcblxuICAgICAgICBpZiAoZ3JhcGhpY3MgJiYgX2RlYnVnQm9uZXMpIHtcbiAgICAgICAgICAgIGxldCBib25lO1xuICAgICAgICAgICAgZ3JhcGhpY3Muc3Ryb2tlQ29sb3IgPSBfYm9uZUNvbG9yO1xuICAgICAgICAgICAgZ3JhcGhpY3MuZmlsbENvbG9yID0gX3Nsb3RDb2xvcjsgLy8gUm9vdCBib25lIGNvbG9yIGlzIHNhbWUgYXMgc2xvdCBjb2xvci5cblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSBsb2NTa2VsZXRvbi5ib25lcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBib25lID0gbG9jU2tlbGV0b24uYm9uZXNbaV07XG4gICAgICAgICAgICAgICAgbGV0IHggPSBib25lLmRhdGEubGVuZ3RoICogYm9uZS5hICsgYm9uZS53b3JsZFg7XG4gICAgICAgICAgICAgICAgbGV0IHkgPSBib25lLmRhdGEubGVuZ3RoICogYm9uZS5jICsgYm9uZS53b3JsZFk7XG5cbiAgICAgICAgICAgICAgICAvLyBCb25lIGxlbmd0aHMuXG4gICAgICAgICAgICAgICAgZ3JhcGhpY3MubW92ZVRvKGJvbmUud29ybGRYLCBib25lLndvcmxkWSk7XG4gICAgICAgICAgICAgICAgZ3JhcGhpY3MubGluZVRvKHgsIHkpO1xuICAgICAgICAgICAgICAgIGdyYXBoaWNzLnN0cm9rZSgpO1xuXG4gICAgICAgICAgICAgICAgLy8gQm9uZSBvcmlnaW5zLlxuICAgICAgICAgICAgICAgIGdyYXBoaWNzLmNpcmNsZShib25lLndvcmxkWCwgYm9uZS53b3JsZFksIE1hdGguUEkgKiAxLjUpO1xuICAgICAgICAgICAgICAgIGdyYXBoaWNzLmZpbGwoKTtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5maWxsQ29sb3IgPSBfb3JpZ2luQ29sb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3dyaXRlVmVydGV4MlRvVmVydGV4M0J1ZmZlcih2ZXJ0ZXgyQXJyYXksIHZlcnRleDNCdWZmZXIsIG9mZnNldCwgdmVydGV4Q291bnQsIHNsb3RJZHgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0ZXhDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZHN0T2Zmc2V0ID0gaSAqIF9wZXJWZXJ0ZXhTaXplICsgb2Zmc2V0O1xuICAgICAgICAgICAgbGV0IHNyY09mZnNldCA9IGkgKiBfcmVhbHRpbWVTaXplUGVyVmVydGV4O1xuXG4gICAgICAgICAgICB2ZXJ0ZXgzQnVmZmVyW2RzdE9mZnNldF0gPSB2ZXJ0ZXgyQXJyYXlbc3JjT2Zmc2V0XTsgICAgICAgICAvL3hcbiAgICAgICAgICAgIHZlcnRleDNCdWZmZXJbZHN0T2Zmc2V0ICsgMV0gPSB2ZXJ0ZXgyQXJyYXlbc3JjT2Zmc2V0ICsgMV07IC8veVxuICAgICAgICAgICAgdmVydGV4M0J1ZmZlcltkc3RPZmZzZXQgKyAyXSA9IF9kZXB0aCAtIDFlLTYgKiBzbG90SWR4OyAgICAgICAgICAvL3pcbiAgICAgICAgICAgIHZlcnRleDNCdWZmZXJbZHN0T2Zmc2V0ICsgM10gPSB2ZXJ0ZXgyQXJyYXlbc3JjT2Zmc2V0ICsgMl07IC8vdVxuICAgICAgICAgICAgdmVydGV4M0J1ZmZlcltkc3RPZmZzZXQgKyA0XSA9IHZlcnRleDJBcnJheVtzcmNPZmZzZXQgKyAzXTsgLy92XG4gICAgICAgICAgICB2ZXJ0ZXgzQnVmZmVyW2RzdE9mZnNldCArIDVdID0gdmVydGV4MkFycmF5W3NyY09mZnNldCArIDRdOyAvL2MxXG4gICAgICAgICAgICBpZiAoX3VzZVRpbnQpIHtcbiAgICAgICAgICAgICAgICB2ZXJ0ZXgzQnVmZmVyW2RzdE9mZnNldCArIDZdID0gdmVydGV4MkFycmF5W3NyY09mZnNldCArIDVdOyAvL2MyXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjYWNoZVRyYXZlcnNlKHdvcmxkTWF0KSB7XG5cbiAgICAgICAgbGV0IGZyYW1lID0gX2NvbXAuX2N1ckZyYW1lO1xuICAgICAgICBpZiAoIWZyYW1lKSByZXR1cm47XG5cbiAgICAgICAgbGV0IHNlZ21lbnRzID0gZnJhbWUuc2VnbWVudHM7XG4gICAgICAgIGlmIChzZWdtZW50cy5sZW5ndGggPT0gMCkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBvZmZzZXRzID0gZnJhbWUub2Zmc2V0cztcblxuICAgICAgICBsZXQgdmJ1ZiwgaWJ1ZiwgdWludGJ1ZjtcbiAgICAgICAgbGV0IG1hdGVyaWFsO1xuICAgICAgICBsZXQgb2Zmc2V0SW5mbztcbiAgICAgICAgbGV0IHZlcnRpY2VzID0gZnJhbWUudmVydGljZXM7XG4gICAgICAgIGxldCBpbmRpY2VzID0gZnJhbWUuaW5kaWNlcztcbiAgICAgICAgbGV0IHdvcmxkTWF0bTtcblxuICAgICAgICBsZXQgZnJhbWVWRk9mZnNldCA9IDAsIGZyYW1lSW5kZXhPZmZzZXQgPSAwLCBzZWdWRkNvdW50ID0gMDtcbiAgICAgICAgaWYgKHdvcmxkTWF0KSB7XG4gICAgICAgICAgICB3b3JsZE1hdG0gPSB3b3JsZE1hdC5tO1xuICAgICAgICAgICAgX20wMCA9IHdvcmxkTWF0bVswXTtcbiAgICAgICAgICAgIF9tMDEgPSB3b3JsZE1hdG1bMV07XG4gICAgICAgICAgICBfbTA0ID0gd29ybGRNYXRtWzRdO1xuICAgICAgICAgICAgX20wNSA9IHdvcmxkTWF0bVs1XTtcbiAgICAgICAgICAgIF9tMTIgPSB3b3JsZE1hdG1bMTJdO1xuICAgICAgICAgICAgX20xMyA9IHdvcmxkTWF0bVsxM107XG4gICAgICAgIH1cblxuICAgICAgICBsZXQganVzdFRyYW5zbGF0ZSA9IF9tMDAgPT09IDEgJiYgX20wMSA9PT0gMCAmJiBfbTA0ID09PSAwICYmIF9tMDUgPT09IDE7XG4gICAgICAgIGxldCBuZWVkQmF0Y2ggPSAoX2hhbmRsZVZhbCAmIEZMQUdfQkFUQ0gpO1xuICAgICAgICBsZXQgY2FsY1RyYW5zbGF0ZSA9IG5lZWRCYXRjaCAmJiBqdXN0VHJhbnNsYXRlO1xuXG4gICAgICAgIGxldCBjb2xvck9mZnNldCA9IDA7XG4gICAgICAgIGxldCBjb2xvcnMgPSBmcmFtZS5jb2xvcnM7XG4gICAgICAgIGxldCBub3dDb2xvciA9IGNvbG9yc1tjb2xvck9mZnNldCsrXTtcbiAgICAgICAgbGV0IG1heFZGT2Zmc2V0ID0gbm93Q29sb3IudmZPZmZzZXQ7XG4gICAgICAgIF9oYW5kbGVDb2xvcihub3dDb2xvcik7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSBzZWdtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBzZWdJbmZvID0gc2VnbWVudHNbaV07XG4gICAgICAgICAgICBtYXRlcmlhbCA9IF9nZXRTbG90TWF0ZXJpYWwoc2VnSW5mby50ZXgsIHNlZ0luZm8uYmxlbmRNb2RlKTtcbiAgICAgICAgICAgIGlmICghbWF0ZXJpYWwpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZiAoX211c3RGbHVzaCB8fCBtYXRlcmlhbC5nZXRIYXNoKCkgIT09IF9yZW5kZXJlci5tYXRlcmlhbC5nZXRIYXNoKCkpIHtcbiAgICAgICAgICAgICAgICBfbXVzdEZsdXNoID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgX3JlbmRlcmVyLl9mbHVzaCgpO1xuICAgICAgICAgICAgICAgIF9yZW5kZXJlci5ub2RlID0gX25vZGU7XG4gICAgICAgICAgICAgICAgX3JlbmRlcmVyLm1hdGVyaWFsID0gbWF0ZXJpYWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF92ZXJ0ZXhDb3VudCA9IHNlZ0luZm8udmVydGV4Q291bnQ7XG4gICAgICAgICAgICBfaW5kZXhDb3VudCA9IHNlZ0luZm8uaW5kZXhDb3VudDtcblxuICAgICAgICAgICAgb2Zmc2V0SW5mbyA9IF9idWZmZXIucmVxdWVzdChfdmVydGV4Q291bnQsIF9pbmRleENvdW50KTtcbiAgICAgICAgICAgIF9pbmRleE9mZnNldCA9IG9mZnNldEluZm8uaW5kaWNlT2Zmc2V0O1xuICAgICAgICAgICAgX3ZlcnRleE9mZnNldCA9IG9mZnNldEluZm8udmVydGV4T2Zmc2V0O1xuICAgICAgICAgICAgX3ZmT2Zmc2V0ID0gb2Zmc2V0SW5mby5ieXRlT2Zmc2V0ID4+IDI7XG4gICAgICAgICAgICB2YnVmID0gX2J1ZmZlci5fdkRhdGE7XG4gICAgICAgICAgICBpYnVmID0gX2J1ZmZlci5faURhdGE7XG4gICAgICAgICAgICB1aW50YnVmID0gX2J1ZmZlci5fdWludFZEYXRhO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpaSA9IF9pbmRleE9mZnNldCwgaWwgPSBfaW5kZXhPZmZzZXQgKyBfaW5kZXhDb3VudDsgaWkgPCBpbDsgaWkrKykge1xuICAgICAgICAgICAgICAgIGlidWZbaWldID0gX3ZlcnRleE9mZnNldCArIGluZGljZXNbZnJhbWVJbmRleE9mZnNldCsrXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VnVkZDb3VudCA9IHNlZ0luZm8udmZDb3VudDtcbiAgICAgICAgICAgIGxldCByZW5kZXJWZXJ0ZXhDb3VudCA9IF92ZXJ0ZXhDb3VudCAqIF9wZXJWZXJ0ZXhTaXplO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfdmVydGV4Q291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBkc3RPZmZzZXQgPSBfdmZPZmZzZXQgKyBpICogNztcbiAgICAgICAgICAgICAgICBsZXQgc3JjT2Zmc2V0ID0gZnJhbWVWRk9mZnNldCArIGkgKiA2O1xuXG4gICAgICAgICAgICAgICAgdmJ1Zltkc3RPZmZzZXRdID0gdmVydGljZXNbc3JjT2Zmc2V0XTtcbiAgICAgICAgICAgICAgICB2YnVmW2RzdE9mZnNldCArIDFdID0gdmVydGljZXNbc3JjT2Zmc2V0ICsgMV07XG4gICAgICAgICAgICAgICAgbGV0IGosIGxlbjtcbiAgICAgICAgICAgICAgICBmb3IgKGogPSAwLCBsZW4gPSBvZmZzZXRzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzcmNPZmZzZXQgPD0gb2Zmc2V0c1tqXSkgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZidWZbZHN0T2Zmc2V0ICsgMl0gPSBfZGVwdGggLSAxZS02ICogajsgICAvL3RvZG8gZGVwdGggKyDoh6rlt7Hmt7HluqZcbiAgICAgICAgICAgICAgICB2YnVmW2RzdE9mZnNldCArIDNdID0gdmVydGljZXNbc3JjT2Zmc2V0ICsgMl07XG4gICAgICAgICAgICAgICAgdmJ1Zltkc3RPZmZzZXQgKyA0XSA9IHZlcnRpY2VzW3NyY09mZnNldCArIDNdO1xuICAgICAgICAgICAgICAgIHZidWZbZHN0T2Zmc2V0ICsgNV0gPSB2ZXJ0aWNlc1tzcmNPZmZzZXQgKyA0XTtcbiAgICAgICAgICAgICAgICB2YnVmW2RzdE9mZnNldCArIDZdID0gdmVydGljZXNbc3JjT2Zmc2V0ICsgNV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHZidWYuc2V0KHZlcnRpY2VzLnN1YmFycmF5KGZyYW1lVkZPZmZzZXQsIGZyYW1lVkZPZmZzZXQgKyBzZWdWRkNvdW50KSwgX3ZmT2Zmc2V0KTtcbiAgICAgICAgICAgIGZyYW1lVkZPZmZzZXQgKz0gc2VnVkZDb3VudDtcblxuICAgICAgICAgICAgaWYgKGNhbGNUcmFuc2xhdGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpaSA9IF92Zk9mZnNldCwgaWwgPSBfdmZPZmZzZXQgKyByZW5kZXJWZXJ0ZXhDb3VudDsgaWkgPCBpbDsgaWkgKz0gNykge1xuICAgICAgICAgICAgICAgICAgICB2YnVmW2lpXSArPSBfbTEyO1xuICAgICAgICAgICAgICAgICAgICB2YnVmW2lpICsgMV0gKz0gX20xMztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5lZWRCYXRjaCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGlpID0gX3ZmT2Zmc2V0LCBpbCA9IF92Zk9mZnNldCArIHJlbmRlclZlcnRleENvdW50OyBpaSA8IGlsOyBpaSArPSA3KSB7XG4gICAgICAgICAgICAgICAgICAgIF94ID0gdmJ1ZltpaV07XG4gICAgICAgICAgICAgICAgICAgIF95ID0gdmJ1ZltpaSArIDFdO1xuICAgICAgICAgICAgICAgICAgICB2YnVmW2lpXSA9IF94ICogX20wMCArIF95ICogX20wNCArIF9tMTI7XG4gICAgICAgICAgICAgICAgICAgIHZidWZbaWkgKyAxXSA9IF94ICogX20wMSArIF95ICogX20wNSArIF9tMTM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfYnVmZmVyLmFkanVzdChfdmVydGV4Q291bnQsIF9pbmRleENvdW50KTtcbiAgICAgICAgICAgIGlmICghX25lZWRDb2xvcikgY29udGludWU7XG5cbiAgICAgICAgICAgIC8vIGhhbmRsZSBjb2xvclxuICAgICAgICAgICAgbGV0IGZyYW1lQ29sb3JPZmZzZXQgPSBmcmFtZVZGT2Zmc2V0IC0gc2VnVkZDb3VudDtcbiAgICAgICAgICAgIGZvciAobGV0IGlpID0gX3ZmT2Zmc2V0ICsgNSwgaWwgPSBfdmZPZmZzZXQgKyA1ICsgc2VnVkZDb3VudDsgaWkgPCBpbDsgaWkgKz0gNywgZnJhbWVDb2xvck9mZnNldCArPSA2KSB7XG4gICAgICAgICAgICAgICAgaWYgKGZyYW1lQ29sb3JPZmZzZXQgPj0gbWF4VkZPZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgbm93Q29sb3IgPSBjb2xvcnNbY29sb3JPZmZzZXQrK107XG4gICAgICAgICAgICAgICAgICAgIF9oYW5kbGVDb2xvcihub3dDb2xvcik7XG4gICAgICAgICAgICAgICAgICAgIG1heFZGT2Zmc2V0ID0gbm93Q29sb3IudmZPZmZzZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHVpbnRidWZbaWldID0gX2ZpbmFsQ29sb3IzMjtcbiAgICAgICAgICAgICAgICB1aW50YnVmW2lpICsgMV0gPSBfZGFya0NvbG9yMzI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWxsQnVmZmVycyhjb21wLCByZW5kZXJlcikge1xuXG4gICAgICAgIGxldCBub2RlID0gY29tcC5ub2RlO1xuICAgICAgICBub2RlLl9yZW5kZXJGbGFnIHw9IFJlbmRlckZsb3cuRkxBR19VUERBVEVfUkVOREVSX0RBVEE7XG4gICAgICAgIGlmICghY29tcC5fc2tlbGV0b24pIHJldHVybjtcblxuICAgICAgICBsZXQgbm9kZUNvbG9yID0gbm9kZS5fY29sb3I7XG4gICAgICAgIF9ub2RlUiA9IG5vZGVDb2xvci5yIC8gMjU1O1xuICAgICAgICBfbm9kZUcgPSBub2RlQ29sb3IuZyAvIDI1NTtcbiAgICAgICAgX25vZGVCID0gbm9kZUNvbG9yLmIgLyAyNTU7XG4gICAgICAgIF9ub2RlQSA9IG5vZGVDb2xvci5hIC8gMjU1O1xuXG4gICAgICAgIF91c2VUaW50ID0gY29tcC51c2VUaW50IHx8IGNvbXAuaXNBbmltYXRpb25DYWNoZWQoKTtcbiAgICAgICAgX3ZlcnRleEZvcm1hdCA9IF91c2VUaW50ID8gVkZUd29Db2xvciA6IFZGT25lQ29sb3I7XG4gICAgICAgIC8vIHggeSB6IHUgdiBjb2xvcjEgY29sb3IyIG9yIHggeSB1IHYgY29sb3JcbiAgICAgICAgX3BlclZlcnRleFNpemUgPSBfdXNlVGludCA/IDcgOiA2O1xuICAgICAgICBfcmVhbHRpbWVTaXplUGVyVmVydGV4ID0gX3VzZVRpbnQgPyA2IDogNTtcblxuICAgICAgICBfbm9kZSA9IGNvbXAubm9kZTtcbiAgICAgICAgX2J1ZmZlciA9IHJlbmRlcmVyLmdldEJ1ZmZlcignc3BpbmUnLCBfdmVydGV4Rm9ybWF0KTtcbiAgICAgICAgX3JlbmRlcmVyID0gcmVuZGVyZXI7XG4gICAgICAgIF9jb21wID0gY29tcDtcbiAgICAgICAgX2RlcHRoID0gX25vZGUuZGVwdGggfHwgMDtcblxuICAgICAgICBfbXVzdEZsdXNoID0gdHJ1ZTtcbiAgICAgICAgX3ByZW11bHRpcGxpZWRBbHBoYSA9IGNvbXAucHJlbXVsdGlwbGllZEFscGhhO1xuICAgICAgICBfbXVsdGlwbGllciA9IDEuMDtcbiAgICAgICAgX2hhbmRsZVZhbCA9IDB4MDA7XG4gICAgICAgIF9uZWVkQ29sb3IgPSBmYWxzZTtcbiAgICAgICAgX3ZlcnRleEVmZmVjdCA9IGNvbXAuX2VmZmVjdERlbGVnYXRlICYmIGNvbXAuX2VmZmVjdERlbGVnYXRlLl92ZXJ0ZXhFZmZlY3Q7XG5cbiAgICAgICAgaWYgKG5vZGVDb2xvci5fdmFsICE9PSAweGZmZmZmZmZmIHx8IF9wcmVtdWx0aXBsaWVkQWxwaGEpIHtcbiAgICAgICAgICAgIF9uZWVkQ29sb3IgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF91c2VUaW50KSB7XG4gICAgICAgICAgICBfaGFuZGxlVmFsIHw9IEZMQUdfVFdPX0NPTE9SO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHdvcmxkTWF0ID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAoX2NvbXAuZW5hYmxlQmF0Y2gpIHtcbiAgICAgICAgICAgIHdvcmxkTWF0ID0gX25vZGUuX3dvcmxkTWF0cml4O1xuICAgICAgICAgICAgX211c3RGbHVzaCA9IGZhbHNlO1xuICAgICAgICAgICAgX2hhbmRsZVZhbCB8PSBGTEFHX0JBVENIO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbXAuaXNBbmltYXRpb25DYWNoZWQoKSkge1xuICAgICAgICAgICAgLy8gVHJhdmVyc2UgaW5wdXQgYXNzZW1ibGVyLlxuICAgICAgICAgICAgdGhpcy5jYWNoZVRyYXZlcnNlKHdvcmxkTWF0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChfdmVydGV4RWZmZWN0KSBfdmVydGV4RWZmZWN0LmJlZ2luKGNvbXAuX3NrZWxldG9uKTtcbiAgICAgICAgICAgIHRoaXMucmVhbFRpbWVUcmF2ZXJzZSh3b3JsZE1hdCk7XG4gICAgICAgICAgICBpZiAoX3ZlcnRleEVmZmVjdCkgX3ZlcnRleEVmZmVjdC5lbmQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHN5bmMgYXR0YWNoZWQgbm9kZSBtYXRyaXhcbiAgICAgICAgcmVuZGVyZXIud29ybGRNYXREaXJ0eSsrO1xuICAgICAgICBjb21wLmF0dGFjaFV0aWwuX3N5bmNBdHRhY2hlZE5vZGUoKTtcblxuICAgICAgICAvLyBDbGVhciB0ZW1wIHZhci5cbiAgICAgICAgX25vZGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIF9idWZmZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIF9yZW5kZXJlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgX2NvbXAgPSB1bmRlZmluZWQ7XG4gICAgICAgIF92ZXJ0ZXhFZmZlY3QgPSBudWxsO1xuICAgIH1cblxuICAgIHBvc3RGaWxsQnVmZmVycyhjb21wLCByZW5kZXJlcikge1xuICAgICAgICByZW5kZXJlci53b3JsZE1hdERpcnR5LS07XG4gICAgfVxufVxuXG5Bc3NlbWJsZXIucmVnaXN0ZXIoU2tlbGV0b24sIFNwaW5lQXNzZW1ibGVyKTtcbiJdLCJzb3VyY2VSb290IjoiLyJ9