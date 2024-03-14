
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

var VFOneColor = VertexFormat.vfmtPosUvColor;
var VFTwoColor = VertexFormat.vfmtPosUvTwoColor;
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

var _vertexFloatCount = 0,
    _vertexCount = 0,
    _vertexFloatOffset = 0,
    _vertexOffset = 0,
    _indexCount = 0,
    _indexOffset = 0,
    _vfOffset = 0;

var _tempr, _tempg, _tempb;

var _inRange;

var _mustFlush;

var _x, _y, _m00, _m04, _m12, _m01, _m05, _m13;

var _r, _g, _b, _fr, _fg, _fb, _fa, _dr, _dg, _db, _da;

var _comp, _buffer, _renderer, _node, _needColor, _vertexEffect;

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

  _proto.fillVertices = function fillVertices(skeletonColor, attachmentColor, slotColor, clipper, slot) {
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

    if (!clipper.isClipping()) {
      if (_vertexEffect) {
        for (var v = _vertexFloatOffset, n = _vertexFloatOffset + _vertexFloatCount; v < n; v += _perVertexSize) {
          _tempPos.x = vbuf[v];
          _tempPos.y = vbuf[v + 1];
          _tempUv.x = vbuf[v + 2];
          _tempUv.y = vbuf[v + 3];

          _vertexEffect.transform(_tempPos, _tempUv, _finalColor, _darkColor);

          vbuf[v] = _tempPos.x; // x

          vbuf[v + 1] = _tempPos.y; // y

          vbuf[v + 2] = _tempUv.x; // u

          vbuf[v + 3] = _tempUv.y; // v

          uintVData[v + 4] = _spineColorToInt32(_finalColor); // light color

          _useTint && (uintVData[v + 5] = _spineColorToInt32(_darkColor)); // dark color
        }
      } else {
        _finalColor32 = _spineColorToInt32(_finalColor);
        _darkColor32 = _spineColorToInt32(_darkColor);

        for (var _v = _vertexFloatOffset, _n = _vertexFloatOffset + _vertexFloatCount; _v < _n; _v += _perVertexSize) {
          uintVData[_v + 4] = _finalColor32; // light color

          _useTint && (uintVData[_v + 5] = _darkColor32); // dark color
        }
      }
    } else {
      var uvs = vbuf.subarray(_vertexFloatOffset + 2);
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

        attachment.computeWorldVertices(slot.bone, vbuf, _vertexFloatOffset, _perVertexSize); // draw debug slots if enabled graphics

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

        attachment.computeWorldVertices(slot, 0, attachment.worldVerticesLength, vbuf, _vertexFloatOffset, _perVertexSize); // draw debug mesh if enabled graphics

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
        vbuf[v + 2] = uvs[u]; // u

        vbuf[v + 3] = uvs[u + 1]; // v
      }

      attachmentColor = attachment.color, slotColor = slot.color;
      this.fillVertices(skeletonColor, attachmentColor, slotColor, clipper, slot); // reset buffer pointer, because clipper maybe realloc a new buffer in file Vertices function.

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

  _proto.cacheTraverse = function cacheTraverse(worldMat) {
    var frame = _comp._curFrame;
    if (!frame) return;
    var segments = frame.segments;
    if (segments.length == 0) return;
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
      vbuf.set(vertices.subarray(frameVFOffset, frameVFOffset + segVFCount), _vfOffset);
      frameVFOffset += segVFCount;

      if (calcTranslate) {
        for (var _ii4 = _vfOffset, _il = _vfOffset + segVFCount; _ii4 < _il; _ii4 += 6) {
          vbuf[_ii4] += _m12;
          vbuf[_ii4 + 1] += _m13;
        }
      } else if (needBatch) {
        for (var _ii5 = _vfOffset, _il2 = _vfOffset + segVFCount; _ii5 < _il2; _ii5 += 6) {
          _x = vbuf[_ii5];
          _y = vbuf[_ii5 + 1];
          vbuf[_ii5] = _x * _m00 + _y * _m04 + _m12;
          vbuf[_ii5 + 1] = _x * _m01 + _y * _m05 + _m13;
        }
      }

      _buffer.adjust(_vertexCount, _indexCount);

      if (!_needColor) continue; // handle color

      var frameColorOffset = frameVFOffset - segVFCount;

      for (var _ii6 = _vfOffset + 4, _il3 = _vfOffset + 4 + segVFCount; _ii6 < _il3; _ii6 += 6, frameColorOffset += 6) {
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
    _vertexFormat = _useTint ? VFTwoColor : VFOneColor; // x y u v color1 color2 or x y u v color

    _perVertexSize = _useTint ? 6 : 5;
    _node = comp.node;
    _buffer = renderer.getBuffer('spine', _vertexFormat);
    _renderer = renderer;
    _comp = comp;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvZXh0ZW5zaW9ucy9zcGluZS9zcGluZS1hc3NlbWJsZXIuanMiXSwibmFtZXMiOlsiU2tlbGV0b24iLCJyZXF1aXJlIiwic3BpbmUiLCJSZW5kZXJGbG93IiwiVmVydGV4Rm9ybWF0IiwiVkZPbmVDb2xvciIsInZmbXRQb3NVdkNvbG9yIiwiVkZUd29Db2xvciIsInZmbXRQb3NVdlR3b0NvbG9yIiwiZ2Z4IiwiY2MiLCJGTEFHX0JBVENIIiwiRkxBR19UV09fQ09MT1IiLCJfaGFuZGxlVmFsIiwiX3F1YWRUcmlhbmdsZXMiLCJfc2xvdENvbG9yIiwiY29sb3IiLCJfYm9uZUNvbG9yIiwiX29yaWdpbkNvbG9yIiwiX21lc2hDb2xvciIsIl9maW5hbENvbG9yIiwiX2RhcmtDb2xvciIsIl90ZW1wUG9zIiwiX3RlbXBVdiIsIkNDX05BVElWRVJFTkRFUkVSIiwiQ29sb3IiLCJWZWN0b3IyIiwiX3ByZW11bHRpcGxpZWRBbHBoYSIsIl9tdWx0aXBsaWVyIiwiX3Nsb3RSYW5nZVN0YXJ0IiwiX3Nsb3RSYW5nZUVuZCIsIl91c2VUaW50IiwiX2RlYnVnU2xvdHMiLCJfZGVidWdCb25lcyIsIl9kZWJ1Z01lc2giLCJfbm9kZVIiLCJfbm9kZUciLCJfbm9kZUIiLCJfbm9kZUEiLCJfZmluYWxDb2xvcjMyIiwiX2RhcmtDb2xvcjMyIiwiX3ZlcnRleEZvcm1hdCIsIl9wZXJWZXJ0ZXhTaXplIiwiX3BlckNsaXBWZXJ0ZXhTaXplIiwiX3ZlcnRleEZsb2F0Q291bnQiLCJfdmVydGV4Q291bnQiLCJfdmVydGV4RmxvYXRPZmZzZXQiLCJfdmVydGV4T2Zmc2V0IiwiX2luZGV4Q291bnQiLCJfaW5kZXhPZmZzZXQiLCJfdmZPZmZzZXQiLCJfdGVtcHIiLCJfdGVtcGciLCJfdGVtcGIiLCJfaW5SYW5nZSIsIl9tdXN0Rmx1c2giLCJfeCIsIl95IiwiX20wMCIsIl9tMDQiLCJfbTEyIiwiX20wMSIsIl9tMDUiLCJfbTEzIiwiX3IiLCJfZyIsIl9iIiwiX2ZyIiwiX2ZnIiwiX2ZiIiwiX2ZhIiwiX2RyIiwiX2RnIiwiX2RiIiwiX2RhIiwiX2NvbXAiLCJfYnVmZmVyIiwiX3JlbmRlcmVyIiwiX25vZGUiLCJfbmVlZENvbG9yIiwiX3ZlcnRleEVmZmVjdCIsIl9nZXRTbG90TWF0ZXJpYWwiLCJ0ZXgiLCJibGVuZE1vZGUiLCJzcmMiLCJkc3QiLCJCbGVuZE1vZGUiLCJBZGRpdGl2ZSIsIm1hY3JvIiwiT05FIiwiU1JDX0FMUEhBIiwiTXVsdGlwbHkiLCJEU1RfQ09MT1IiLCJPTkVfTUlOVVNfU1JDX0FMUEhBIiwiU2NyZWVuIiwiT05FX01JTlVTX1NSQ19DT0xPUiIsIk5vcm1hbCIsInVzZU1vZGVsIiwiZW5hYmxlQmF0Y2giLCJiYXNlTWF0ZXJpYWwiLCJfbWF0ZXJpYWxzIiwia2V5IiwiZ2V0SWQiLCJtYXRlcmlhbENhY2hlIiwiX21hdGVyaWFsQ2FjaGUiLCJtYXRlcmlhbCIsIk1hdGVyaWFsVmFyaWFudCIsImNyZWF0ZSIsImRlZmluZSIsInNldFByb3BlcnR5Iiwic2V0QmxlbmQiLCJCTEVORF9GVU5DX0FERCIsIl9oYW5kbGVDb2xvciIsImZhIiwiZnIiLCJmZyIsImZiIiwiZHIiLCJkZyIsImRiIiwiX3NwaW5lQ29sb3JUb0ludDMyIiwic3BpbmVDb2xvciIsImEiLCJiIiwiZyIsInIiLCJTcGluZUFzc2VtYmxlciIsInVwZGF0ZVJlbmRlckRhdGEiLCJjb21wIiwiaXNBbmltYXRpb25DYWNoZWQiLCJza2VsZXRvbiIsIl9za2VsZXRvbiIsInVwZGF0ZVdvcmxkVHJhbnNmb3JtIiwiZmlsbFZlcnRpY2VzIiwic2tlbGV0b25Db2xvciIsImF0dGFjaG1lbnRDb2xvciIsInNsb3RDb2xvciIsImNsaXBwZXIiLCJzbG90IiwidmJ1ZiIsIl92RGF0YSIsImlidWYiLCJfaURhdGEiLCJ1aW50VkRhdGEiLCJfdWludFZEYXRhIiwib2Zmc2V0SW5mbyIsImRhcmtDb2xvciIsInNldCIsImlzQ2xpcHBpbmciLCJ2IiwibiIsIngiLCJ5IiwidHJhbnNmb3JtIiwidXZzIiwic3ViYXJyYXkiLCJjbGlwVHJpYW5nbGVzIiwiY2xpcHBlZFZlcnRpY2VzIiwiRmxvYXQzMkFycmF5IiwiY2xpcHBlZFRyaWFuZ2xlcyIsImxlbmd0aCIsInJlcXVlc3QiLCJpbmRpY2VPZmZzZXQiLCJ2ZXJ0ZXhPZmZzZXQiLCJieXRlT2Zmc2V0Iiwib2Zmc2V0IiwicmVhbFRpbWVUcmF2ZXJzZSIsIndvcmxkTWF0IiwibG9jU2tlbGV0b24iLCJncmFwaGljcyIsIl9kZWJ1Z1JlbmRlcmVyIiwiX2NsaXBwZXIiLCJhdHRhY2htZW50IiwidHJpYW5nbGVzIiwiaXNSZWdpb24iLCJpc01lc2giLCJpc0NsaXAiLCJ3b3JsZE1hdG0iLCJfc3RhcnRTbG90SW5kZXgiLCJfZW5kU2xvdEluZGV4IiwiZGVidWdTbG90cyIsImRlYnVnQm9uZXMiLCJkZWJ1Z01lc2giLCJjbGVhciIsImxpbmVXaWR0aCIsInNsb3RJZHgiLCJzbG90Q291bnQiLCJkcmF3T3JkZXIiLCJ1bmRlZmluZWQiLCJkYXRhIiwiaW5kZXgiLCJjbGlwRW5kV2l0aFNsb3QiLCJnZXRBdHRhY2htZW50IiwiUmVnaW9uQXR0YWNobWVudCIsIk1lc2hBdHRhY2htZW50IiwiQ2xpcHBpbmdBdHRhY2htZW50IiwiY2xpcFN0YXJ0IiwicmVnaW9uIiwidGV4dHVyZSIsIl90ZXh0dXJlIiwiZ2V0SGFzaCIsIl9mbHVzaCIsIm5vZGUiLCJjb21wdXRlV29ybGRWZXJ0aWNlcyIsImJvbmUiLCJzdHJva2VDb2xvciIsIm1vdmVUbyIsImlpIiwibm4iLCJsaW5lVG8iLCJjbG9zZSIsInN0cm9rZSIsIndvcmxkVmVydGljZXNMZW5ndGgiLCJ2MSIsInYyIiwidjMiLCJ1IiwibSIsImFkanVzdCIsImNsaXBFbmQiLCJmaWxsQ29sb3IiLCJpIiwiYm9uZXMiLCJ3b3JsZFgiLCJjIiwid29ybGRZIiwiY2lyY2xlIiwiTWF0aCIsIlBJIiwiZmlsbCIsImNhY2hlVHJhdmVyc2UiLCJmcmFtZSIsIl9jdXJGcmFtZSIsInNlZ21lbnRzIiwidWludGJ1ZiIsInZlcnRpY2VzIiwiaW5kaWNlcyIsImZyYW1lVkZPZmZzZXQiLCJmcmFtZUluZGV4T2Zmc2V0Iiwic2VnVkZDb3VudCIsImp1c3RUcmFuc2xhdGUiLCJuZWVkQmF0Y2giLCJjYWxjVHJhbnNsYXRlIiwiY29sb3JPZmZzZXQiLCJjb2xvcnMiLCJub3dDb2xvciIsIm1heFZGT2Zmc2V0IiwidmZPZmZzZXQiLCJzZWdJbmZvIiwidmVydGV4Q291bnQiLCJpbmRleENvdW50IiwiaWwiLCJ2ZkNvdW50IiwiZnJhbWVDb2xvck9mZnNldCIsImZpbGxCdWZmZXJzIiwicmVuZGVyZXIiLCJfcmVuZGVyRmxhZyIsIkZMQUdfVVBEQVRFX1JFTkRFUl9EQVRBIiwibm9kZUNvbG9yIiwiX2NvbG9yIiwidXNlVGludCIsImdldEJ1ZmZlciIsInByZW11bHRpcGxpZWRBbHBoYSIsIl9lZmZlY3REZWxlZ2F0ZSIsIl92YWwiLCJfd29ybGRNYXRyaXgiLCJiZWdpbiIsImVuZCIsIndvcmxkTWF0RGlydHkiLCJhdHRhY2hVdGlsIiwiX3N5bmNBdHRhY2hlZE5vZGUiLCJwb3N0RmlsbEJ1ZmZlcnMiLCJBc3NlbWJsZXIiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7Ozs7Ozs7QUFFQSxJQUFNQSxRQUFRLEdBQUdDLE9BQU8sQ0FBQyxZQUFELENBQXhCOztBQUNBLElBQU1DLEtBQUssR0FBR0QsT0FBTyxDQUFDLGFBQUQsQ0FBckI7O0FBQ0EsSUFBTUUsVUFBVSxHQUFHRixPQUFPLENBQUMseUNBQUQsQ0FBMUI7O0FBQ0EsSUFBTUcsWUFBWSxHQUFHSCxPQUFPLENBQUMsaURBQUQsQ0FBNUI7O0FBQ0EsSUFBTUksVUFBVSxHQUFHRCxZQUFZLENBQUNFLGNBQWhDO0FBQ0EsSUFBTUMsVUFBVSxHQUFHSCxZQUFZLENBQUNJLGlCQUFoQztBQUNBLElBQU1DLEdBQUcsR0FBR0MsRUFBRSxDQUFDRCxHQUFmO0FBRUEsSUFBTUUsVUFBVSxHQUFHLElBQW5CO0FBQ0EsSUFBTUMsY0FBYyxHQUFH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Qi9JLElBQWpCLEVBQXVCK0gsUUFBdkIsRUFBaUM7QUFDN0JBLElBQUFBLFFBQVEsQ0FBQ2EsYUFBVDtBQUNIOzs7RUE1Z0J1Q0k7Ozs7QUErZ0I1Q0Esc0JBQVVDLFFBQVYsQ0FBbUJqUixRQUFuQixFQUE2QjhILGNBQTdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IEFzc2VtYmxlciBmcm9tICcuLi8uLi9jb2NvczJkL2NvcmUvcmVuZGVyZXIvYXNzZW1ibGVyJztcblxuY29uc3QgU2tlbGV0b24gPSByZXF1aXJlKCcuL1NrZWxldG9uJyk7XG5jb25zdCBzcGluZSA9IHJlcXVpcmUoJy4vbGliL3NwaW5lJyk7XG5jb25zdCBSZW5kZXJGbG93ID0gcmVxdWlyZSgnLi4vLi4vY29jb3MyZC9jb3JlL3JlbmRlcmVyL3JlbmRlci1mbG93Jyk7XG5jb25zdCBWZXJ0ZXhGb3JtYXQgPSByZXF1aXJlKCcuLi8uLi9jb2NvczJkL2NvcmUvcmVuZGVyZXIvd2ViZ2wvdmVydGV4LWZvcm1hdCcpXG5jb25zdCBWRk9uZUNvbG9yID0gVmVydGV4Rm9ybWF0LnZmbXRQb3NVdkNvbG9yO1xuY29uc3QgVkZUd29Db2xvciA9IFZlcnRleEZvcm1hdC52Zm10UG9zVXZUd29Db2xvcjtcbmNvbnN0IGdmeCA9IGNjLmdmeDtcblxuY29uc3QgRkxBR19CQVRDSCA9IDB4MTA7XG5jb25zdCBGTEFHX1RXT19DT0xPUiA9IDB4MDE7XG5cbmxldCBfaGFuZGxlVmFsID0gMHgwMDtcbmxldCBfcXVhZFRyaWFuZ2xlcyA9IFswLCAxLCAyLCAyLCAzLCAwXTtcbmxldCBfc2xvdENvbG9yID0gY2MuY29sb3IoMCwgMCwgMjU1LCAyNTUpO1xubGV0IF9ib25lQ29sb3IgPSBjYy5jb2xvcigyNTUsIDAsIDAsIDI1NSk7XG5sZXQgX29yaWdpbkNvbG9yID0gY2MuY29sb3IoMCwgMjU1LCAwLCAyNTUpO1xubGV0IF9tZXNoQ29sb3IgPSBjYy5jb2xvcigyNTUsIDI1NSwgMCwgMjU1KTtcblxubGV0IF9maW5hbENvbG9yID0gbnVsbDtcbmxldCBfZGFya0NvbG9yID0gbnVsbDtcbmxldCBfdGVtcFBvcyA9IG51bGwsIF90ZW1wVXYgPSBudWxsO1xuaWYgKCFDQ19OQVRJVkVSRU5ERVJFUikge1xuICAgIF9maW5hbENvbG9yID0gbmV3IHNwaW5lLkNvbG9yKDEsIDEsIDEsIDEpO1xuICAgIF9kYXJrQ29sb3IgPSBuZXcgc3BpbmUuQ29sb3IoMSwgMSwgMSwgMSk7XG4gICAgX3RlbXBQb3MgPSBuZXcgc3BpbmUuVmVjdG9yMigpO1xuICAgIF90ZW1wVXYgPSBuZXcgc3BpbmUuVmVjdG9yMigpO1xufVxuXG5sZXQgX3ByZW11bHRpcGxpZWRBbHBoYTtcbmxldCBfbXVsdGlwbGllcjtcbmxldCBfc2xvdFJhbmdlU3RhcnQ7XG5sZXQgX3Nsb3RSYW5nZUVuZDtcbmxldCBfdXNlVGludDtcbmxldCBfZGVidWdTbG90cztcbmxldCBfZGVidWdCb25lcztcbmxldCBfZGVidWdNZXNoO1xubGV0IF9ub2RlUixcbiAgICBfbm9kZUcsXG4gICAgX25vZGVCLFxuICAgIF9ub2RlQTtcbmxldCBfZmluYWxDb2xvcjMyLCBfZGFya0NvbG9yMzI7XG5sZXQgX3ZlcnRleEZvcm1hdDtcbmxldCBfcGVyVmVydGV4U2l6ZTtcbmxldCBfcGVyQ2xpcFZlcnRleFNpemU7XG5cbmxldCBfdmVydGV4RmxvYXRDb3VudCA9IDAsIF92ZXJ0ZXhDb3VudCA9IDAsIF92ZXJ0ZXhGbG9hdE9mZnNldCA9IDAsIF92ZXJ0ZXhPZmZzZXQgPSAwLFxuICAgIF9pbmRleENvdW50ID0gMCwgX2luZGV4T2Zmc2V0ID0gMCwgX3ZmT2Zmc2V0ID0gMDtcbmxldCBfdGVtcHIsIF90ZW1wZywgX3RlbXBiO1xubGV0IF9pblJhbmdlO1xubGV0IF9tdXN0Rmx1c2g7XG5sZXQgX3gsIF95LCBfbTAwLCBfbTA0LCBfbTEyLCBfbTAxLCBfbTA1LCBfbTEzO1xubGV0IF9yLCBfZywgX2IsIF9mciwgX2ZnLCBfZmIsIF9mYSwgX2RyLCBfZGcsIF9kYiwgX2RhO1xubGV0IF9jb21wLCBfYnVmZmVyLCBfcmVuZGVyZXIsIF9ub2RlLCBfbmVlZENvbG9yLCBfdmVydGV4RWZmZWN0O1xuXG5mdW5jdGlvbiBfZ2V0U2xvdE1hdGVyaWFsICh0ZXgsIGJsZW5kTW9kZSkge1xuICAgIGxldCBzcmMsIGRzdDtcbiAgICBzd2l0Y2ggKGJsZW5kTW9kZSkge1xuICAgICAgICBjYXNlIHNwaW5lLkJsZW5kTW9kZS5BZGRpdGl2ZTpcbiAgICAgICAgICAgIHNyYyA9IF9wcmVtdWx0aXBsaWVkQWxwaGEgPyBjYy5tYWNyby5PTkUgOiBjYy5tYWNyby5TUkNfQUxQSEE7XG4gICAgICAgICAgICBkc3QgPSBjYy5tYWNyby5PTkU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBzcGluZS5CbGVuZE1vZGUuTXVsdGlwbHk6XG4gICAgICAgICAgICBzcmMgPSBjYy5tYWNyby5EU1RfQ09MT1I7XG4gICAgICAgICAgICBkc3QgPSBjYy5tYWNyby5PTkVfTUlOVVNfU1JDX0FMUEhBO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2Ugc3BpbmUuQmxlbmRNb2RlLlNjcmVlbjpcbiAgICAgICAgICAgIHNyYyA9IGNjLm1hY3JvLk9ORTtcbiAgICAgICAgICAgIGRzdCA9IGNjLm1hY3JvLk9ORV9NSU5VU19TUkNfQ09MT1I7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBzcGluZS5CbGVuZE1vZGUuTm9ybWFsOlxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgc3JjID0gX3ByZW11bHRpcGxpZWRBbHBoYSA/IGNjLm1hY3JvLk9ORSA6IGNjLm1hY3JvLlNSQ19BTFBIQTtcbiAgICAgICAgICAgIGRzdCA9IGNjLm1hY3JvLk9ORV9NSU5VU19TUkNfQUxQSEE7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBsZXQgdXNlTW9kZWwgPSAhX2NvbXAuZW5hYmxlQmF0Y2g7XG4gICAgbGV0IGJhc2VNYXRlcmlhbCA9IF9jb21wLl9tYXRlcmlhbHNbMF07XG4gICAgaWYgKCFiYXNlTWF0ZXJpYWwpIHJldHVybiBudWxsO1xuXG4gICAgLy8gVGhlIGtleSB1c2UgdG8gZmluZCBjb3JyZXNwb25kaW5nIG1hdGVyaWFsXG4gICAgbGV0IGtleSA9IHRleC5nZXRJZCgpICsgc3JjICsgZHN0ICsgX3VzZVRpbnQgKyB1c2VNb2RlbDtcbiAgICBsZXQgbWF0ZXJpYWxDYWNoZSA9IF9jb21wLl9tYXRlcmlhbENhY2hlO1xuICAgIGxldCBtYXRlcmlhbCA9IG1hdGVyaWFsQ2FjaGVba2V5XTtcbiAgICBpZiAoIW1hdGVyaWFsKSB7XG4gICAgICAgIGlmICghbWF0ZXJpYWxDYWNoZS5iYXNlTWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIG1hdGVyaWFsID0gYmFzZU1hdGVyaWFsO1xuICAgICAgICAgICAgbWF0ZXJpYWxDYWNoZS5iYXNlTWF0ZXJpYWwgPSBiYXNlTWF0ZXJpYWw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtYXRlcmlhbCA9IGNjLk1hdGVyaWFsVmFyaWFudC5jcmVhdGUoYmFzZU1hdGVyaWFsKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgbWF0ZXJpYWwuZGVmaW5lKCdDQ19VU0VfTU9ERUwnLCB1c2VNb2RlbCk7XG4gICAgICAgIG1hdGVyaWFsLmRlZmluZSgnVVNFX1RJTlQnLCBfdXNlVGludCk7XG4gICAgICAgIC8vIHVwZGF0ZSB0ZXh0dXJlXG4gICAgICAgIG1hdGVyaWFsLnNldFByb3BlcnR5KCd0ZXh0dXJlJywgdGV4KTtcblxuICAgICAgICAvLyB1cGRhdGUgYmxlbmQgZnVuY3Rpb25cbiAgICAgICAgbWF0ZXJpYWwuc2V0QmxlbmQoXG4gICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgZ2Z4LkJMRU5EX0ZVTkNfQURELFxuICAgICAgICAgICAgc3JjLCBkc3QsXG4gICAgICAgICAgICBnZnguQkxFTkRfRlVOQ19BREQsXG4gICAgICAgICAgICBzcmMsIGRzdFxuICAgICAgICApO1xuICAgICAgICBtYXRlcmlhbENhY2hlW2tleV0gPSBtYXRlcmlhbDtcbiAgICB9XG4gICAgcmV0dXJuIG1hdGVyaWFsO1xufVxuXG5mdW5jdGlvbiBfaGFuZGxlQ29sb3IgKGNvbG9yKSB7XG4gICAgLy8gdGVtcCByZ2IgaGFzIG11bHRpcGx5IDI1NSwgc28gbmVlZCBkaXZpZGUgMjU1O1xuICAgIF9mYSA9IGNvbG9yLmZhICogX25vZGVBO1xuICAgIF9tdWx0aXBsaWVyID0gX3ByZW11bHRpcGxpZWRBbHBoYSA/IF9mYSAvIDI1NSA6IDE7XG4gICAgX3IgPSBfbm9kZVIgKiBfbXVsdGlwbGllcjtcbiAgICBfZyA9IF9ub2RlRyAqIF9tdWx0aXBsaWVyO1xuICAgIF9iID0gX25vZGVCICogX211bHRpcGxpZXI7XG5cbiAgICBfZnIgPSBjb2xvci5mciAqIF9yO1xuICAgIF9mZyA9IGNvbG9yLmZnICogX2c7XG4gICAgX2ZiID0gY29sb3IuZmIgKiBfYjtcbiAgICBfZmluYWxDb2xvcjMyID0gKChfZmE8PDI0KSA+Pj4gMCkgKyAoX2ZiPDwxNikgKyAoX2ZnPDw4KSArIF9mcjtcblxuICAgIF9kciA9IGNvbG9yLmRyICogX3I7XG4gICAgX2RnID0gY29sb3IuZGcgKiBfZztcbiAgICBfZGIgPSBjb2xvci5kYiAqIF9iO1xuICAgIF9kYSA9IF9wcmVtdWx0aXBsaWVkQWxwaGEgPyAyNTUgOiAwO1xuICAgIF9kYXJrQ29sb3IzMiA9ICgoX2RhPDwyNCkgPj4+IDApICsgKF9kYjw8MTYpICsgKF9kZzw8OCkgKyBfZHI7XG59XG5cbmZ1bmN0aW9uIF9zcGluZUNvbG9yVG9JbnQzMiAoc3BpbmVDb2xvcikge1xuICAgIHJldHVybiAoKHNwaW5lQ29sb3IuYTw8MjQpID4+PiAwKSArIChzcGluZUNvbG9yLmI8PDE2KSArIChzcGluZUNvbG9yLmc8PDgpICsgc3BpbmVDb2xvci5yO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcGluZUFzc2VtYmxlciBleHRlbmRzIEFzc2VtYmxlciB7XG4gICAgdXBkYXRlUmVuZGVyRGF0YSAoY29tcCkge1xuICAgICAgICBpZiAoY29tcC5pc0FuaW1hdGlvbkNhY2hlZCgpKSByZXR1cm47XG4gICAgICAgIGxldCBza2VsZXRvbiA9IGNvbXAuX3NrZWxldG9uO1xuICAgICAgICBpZiAoc2tlbGV0b24pIHtcbiAgICAgICAgICAgIHNrZWxldG9uLnVwZGF0ZVdvcmxkVHJhbnNmb3JtKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWxsVmVydGljZXMgKHNrZWxldG9uQ29sb3IsIGF0dGFjaG1lbnRDb2xvciwgc2xvdENvbG9yLCBjbGlwcGVyLCBzbG90KSB7XG5cbiAgICAgICAgbGV0IHZidWYgPSBfYnVmZmVyLl92RGF0YSxcbiAgICAgICAgICAgIGlidWYgPSBfYnVmZmVyLl9pRGF0YSxcbiAgICAgICAgICAgIHVpbnRWRGF0YSA9IF9idWZmZXIuX3VpbnRWRGF0YTtcbiAgICAgICAgbGV0IG9mZnNldEluZm87XG5cbiAgICAgICAgX2ZpbmFsQ29sb3IuYSA9IHNsb3RDb2xvci5hICogYXR0YWNobWVudENvbG9yLmEgKiBza2VsZXRvbkNvbG9yLmEgKiBfbm9kZUEgKiAyNTU7XG4gICAgICAgIF9tdWx0aXBsaWVyID0gX3ByZW11bHRpcGxpZWRBbHBoYT8gX2ZpbmFsQ29sb3IuYSA6IDI1NTtcbiAgICAgICAgX3RlbXByID0gX25vZGVSICogYXR0YWNobWVudENvbG9yLnIgKiBza2VsZXRvbkNvbG9yLnIgKiBfbXVsdGlwbGllcjtcbiAgICAgICAgX3RlbXBnID0gX25vZGVHICogYXR0YWNobWVudENvbG9yLmcgKiBza2VsZXRvbkNvbG9yLmcgKiBfbXVsdGlwbGllcjtcbiAgICAgICAgX3RlbXBiID0gX25vZGVCICogYXR0YWNobWVudENvbG9yLmIgKiBza2VsZXRvbkNvbG9yLmIgKiBfbXVsdGlwbGllcjtcbiAgICAgICAgXG4gICAgICAgIF9maW5hbENvbG9yLnIgPSBfdGVtcHIgKiBzbG90Q29sb3IucjtcbiAgICAgICAgX2ZpbmFsQ29sb3IuZyA9IF90ZW1wZyAqIHNsb3RDb2xvci5nO1xuICAgICAgICBfZmluYWxDb2xvci5iID0gX3RlbXBiICogc2xvdENvbG9yLmI7XG5cbiAgICAgICAgaWYgKHNsb3QuZGFya0NvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgIF9kYXJrQ29sb3Iuc2V0KDAuMCwgMC4wLCAwLjAsIDEuMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfZGFya0NvbG9yLnIgPSBzbG90LmRhcmtDb2xvci5yICogX3RlbXByO1xuICAgICAgICAgICAgX2RhcmtDb2xvci5nID0gc2xvdC5kYXJrQ29sb3IuZyAqIF90ZW1wZztcbiAgICAgICAgICAgIF9kYXJrQ29sb3IuYiA9IHNsb3QuZGFya0NvbG9yLmIgKiBfdGVtcGI7XG4gICAgICAgIH1cbiAgICAgICAgX2RhcmtDb2xvci5hID0gX3ByZW11bHRpcGxpZWRBbHBoYSA/IDI1NSA6IDA7XG5cbiAgICAgICAgaWYgKCFjbGlwcGVyLmlzQ2xpcHBpbmcoKSkge1xuICAgICAgICAgICAgaWYgKF92ZXJ0ZXhFZmZlY3QpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB2ID0gX3ZlcnRleEZsb2F0T2Zmc2V0LCBuID0gX3ZlcnRleEZsb2F0T2Zmc2V0ICsgX3ZlcnRleEZsb2F0Q291bnQ7IHYgPCBuOyB2ICs9IF9wZXJWZXJ0ZXhTaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIF90ZW1wUG9zLnggPSB2YnVmW3ZdO1xuICAgICAgICAgICAgICAgICAgICBfdGVtcFBvcy55ID0gdmJ1Zlt2ICsgMV07XG4gICAgICAgICAgICAgICAgICAgIF90ZW1wVXYueCA9IHZidWZbdiArIDJdO1xuICAgICAgICAgICAgICAgICAgICBfdGVtcFV2LnkgPSB2YnVmW3YgKyAzXTtcbiAgICAgICAgICAgICAgICAgICAgX3ZlcnRleEVmZmVjdC50cmFuc2Zvcm0oX3RlbXBQb3MsIF90ZW1wVXYsIF9maW5hbENvbG9yLCBfZGFya0NvbG9yKTtcblxuICAgICAgICAgICAgICAgICAgICB2YnVmW3ZdICAgICA9IF90ZW1wUG9zLng7ICAgICAgICAvLyB4XG4gICAgICAgICAgICAgICAgICAgIHZidWZbdiArIDFdID0gX3RlbXBQb3MueTsgICAgICAgIC8vIHlcbiAgICAgICAgICAgICAgICAgICAgdmJ1Zlt2ICsgMl0gPSBfdGVtcFV2Lng7ICAgICAgICAgLy8gdVxuICAgICAgICAgICAgICAgICAgICB2YnVmW3YgKyAzXSA9IF90ZW1wVXYueTsgICAgICAgICAvLyB2XG4gICAgICAgICAgICAgICAgICAgIHVpbnRWRGF0YVt2ICsgNF0gID0gX3NwaW5lQ29sb3JUb0ludDMyKF9maW5hbENvbG9yKTsgICAgICAgICAgICAgICAgICAvLyBsaWdodCBjb2xvclxuICAgICAgICAgICAgICAgICAgICBfdXNlVGludCAmJiAodWludFZEYXRhW3YgKyA1XSA9IF9zcGluZUNvbG9yVG9JbnQzMihfZGFya0NvbG9yKSk7ICAgICAgLy8gZGFyayBjb2xvclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX2ZpbmFsQ29sb3IzMiA9IF9zcGluZUNvbG9yVG9JbnQzMihfZmluYWxDb2xvcik7XG4gICAgICAgICAgICAgICAgX2RhcmtDb2xvcjMyID0gX3NwaW5lQ29sb3JUb0ludDMyKF9kYXJrQ29sb3IpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGZvciAobGV0IHYgPSBfdmVydGV4RmxvYXRPZmZzZXQsIG4gPSBfdmVydGV4RmxvYXRPZmZzZXQgKyBfdmVydGV4RmxvYXRDb3VudDsgdiA8IG47IHYgKz0gX3BlclZlcnRleFNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgdWludFZEYXRhW3YgKyA0XSAgPSBfZmluYWxDb2xvcjMyOyAgICAgICAgICAgICAgICAgICAvLyBsaWdodCBjb2xvclxuICAgICAgICAgICAgICAgICAgICBfdXNlVGludCAmJiAodWludFZEYXRhW3YgKyA1XSAgPSBfZGFya0NvbG9yMzIpOyAgICAgIC8vIGRhcmsgY29sb3JcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgdXZzID0gdmJ1Zi5zdWJhcnJheShfdmVydGV4RmxvYXRPZmZzZXQgKyAyKTtcbiAgICAgICAgICAgIGNsaXBwZXIuY2xpcFRyaWFuZ2xlcyh2YnVmLnN1YmFycmF5KF92ZXJ0ZXhGbG9hdE9mZnNldCksIF92ZXJ0ZXhGbG9hdENvdW50LCBpYnVmLnN1YmFycmF5KF9pbmRleE9mZnNldCksIF9pbmRleENvdW50LCB1dnMsIF9maW5hbENvbG9yLCBfZGFya0NvbG9yLCBfdXNlVGludCwgX3BlclZlcnRleFNpemUpO1xuICAgICAgICAgICAgbGV0IGNsaXBwZWRWZXJ0aWNlcyA9IG5ldyBGbG9hdDMyQXJyYXkoY2xpcHBlci5jbGlwcGVkVmVydGljZXMpO1xuICAgICAgICAgICAgbGV0IGNsaXBwZWRUcmlhbmdsZXMgPSBjbGlwcGVyLmNsaXBwZWRUcmlhbmdsZXM7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGluc3VyZSBjYXBhY2l0eVxuICAgICAgICAgICAgX2luZGV4Q291bnQgPSBjbGlwcGVkVHJpYW5nbGVzLmxlbmd0aDtcbiAgICAgICAgICAgIF92ZXJ0ZXhGbG9hdENvdW50ID0gY2xpcHBlZFZlcnRpY2VzLmxlbmd0aCAvIF9wZXJDbGlwVmVydGV4U2l6ZSAqIF9wZXJWZXJ0ZXhTaXplO1xuXG4gICAgICAgICAgICBvZmZzZXRJbmZvID0gX2J1ZmZlci5yZXF1ZXN0KF92ZXJ0ZXhGbG9hdENvdW50IC8gX3BlclZlcnRleFNpemUsIF9pbmRleENvdW50KTtcbiAgICAgICAgICAgIF9pbmRleE9mZnNldCA9IG9mZnNldEluZm8uaW5kaWNlT2Zmc2V0LFxuICAgICAgICAgICAgX3ZlcnRleE9mZnNldCA9IG9mZnNldEluZm8udmVydGV4T2Zmc2V0LFxuICAgICAgICAgICAgX3ZlcnRleEZsb2F0T2Zmc2V0ID0gb2Zmc2V0SW5mby5ieXRlT2Zmc2V0ID4+IDI7XG4gICAgICAgICAgICB2YnVmID0gX2J1ZmZlci5fdkRhdGEsXG4gICAgICAgICAgICBpYnVmID0gX2J1ZmZlci5faURhdGE7XG4gICAgICAgICAgICB1aW50VkRhdGEgPSBfYnVmZmVyLl91aW50VkRhdGE7XG5cbiAgICAgICAgICAgIC8vIGZpbGwgaW5kaWNlc1xuICAgICAgICAgICAgaWJ1Zi5zZXQoY2xpcHBlZFRyaWFuZ2xlcywgX2luZGV4T2Zmc2V0KTtcblxuICAgICAgICAgICAgLy8gZmlsbCB2ZXJ0aWNlcyBjb250YWluIHggeSB1IHYgbGlnaHQgY29sb3IgZGFyayBjb2xvclxuICAgICAgICAgICAgaWYgKF92ZXJ0ZXhFZmZlY3QpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB2ID0gMCwgbiA9IGNsaXBwZWRWZXJ0aWNlcy5sZW5ndGgsIG9mZnNldCA9IF92ZXJ0ZXhGbG9hdE9mZnNldDsgdiA8IG47IHYgKz0gX3BlckNsaXBWZXJ0ZXhTaXplLCBvZmZzZXQgKz0gX3BlclZlcnRleFNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RlbXBQb3MueCA9IGNsaXBwZWRWZXJ0aWNlc1t2XTtcbiAgICAgICAgICAgICAgICAgICAgX3RlbXBQb3MueSA9IGNsaXBwZWRWZXJ0aWNlc1t2ICsgMV07XG4gICAgICAgICAgICAgICAgICAgIF9maW5hbENvbG9yLnNldChjbGlwcGVkVmVydGljZXNbdiArIDJdLCBjbGlwcGVkVmVydGljZXNbdiArIDNdLCBjbGlwcGVkVmVydGljZXNbdiArIDRdLCBjbGlwcGVkVmVydGljZXNbdiArIDVdKTtcbiAgICAgICAgICAgICAgICAgICAgX3RlbXBVdi54ID0gY2xpcHBlZFZlcnRpY2VzW3YgKyA2XTtcbiAgICAgICAgICAgICAgICAgICAgX3RlbXBVdi55ID0gY2xpcHBlZFZlcnRpY2VzW3YgKyA3XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF91c2VUaW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfZGFya0NvbG9yLnNldChjbGlwcGVkVmVydGljZXNbdiArIDhdLCBjbGlwcGVkVmVydGljZXNbdiArIDldLCBjbGlwcGVkVmVydGljZXNbdiArIDEwXSwgY2xpcHBlZFZlcnRpY2VzW3YgKyAxMV0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2RhcmtDb2xvci5zZXQoMCwgMCwgMCwgMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgX3ZlcnRleEVmZmVjdC50cmFuc2Zvcm0oX3RlbXBQb3MsIF90ZW1wVXYsIF9maW5hbENvbG9yLCBfZGFya0NvbG9yKTtcblxuICAgICAgICAgICAgICAgICAgICB2YnVmW29mZnNldF0gPSBfdGVtcFBvcy54OyAgICAgICAgICAgICAvLyB4XG4gICAgICAgICAgICAgICAgICAgIHZidWZbb2Zmc2V0ICsgMV0gPSBfdGVtcFBvcy55OyAgICAgICAgIC8vIHlcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltvZmZzZXQgKyAyXSA9IF90ZW1wVXYueDsgICAgICAgICAgLy8gdVxuICAgICAgICAgICAgICAgICAgICB2YnVmW29mZnNldCArIDNdID0gX3RlbXBVdi55OyAgICAgICAgICAvLyB2XG4gICAgICAgICAgICAgICAgICAgIHVpbnRWRGF0YVtvZmZzZXQgKyA0XSA9IF9zcGluZUNvbG9yVG9JbnQzMihfZmluYWxDb2xvcik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfdXNlVGludCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdWludFZEYXRhW29mZnNldCArIDVdID0gX3NwaW5lQ29sb3JUb0ludDMyKF9kYXJrQ29sb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB2ID0gMCwgbiA9IGNsaXBwZWRWZXJ0aWNlcy5sZW5ndGgsIG9mZnNldCA9IF92ZXJ0ZXhGbG9hdE9mZnNldDsgdiA8IG47IHYgKz0gX3BlckNsaXBWZXJ0ZXhTaXplLCBvZmZzZXQgKz0gX3BlclZlcnRleFNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltvZmZzZXRdICAgICA9IGNsaXBwZWRWZXJ0aWNlc1t2XTsgICAgICAgICAvLyB4XG4gICAgICAgICAgICAgICAgICAgIHZidWZbb2Zmc2V0ICsgMV0gPSBjbGlwcGVkVmVydGljZXNbdiArIDFdOyAgICAgLy8geVxuICAgICAgICAgICAgICAgICAgICB2YnVmW29mZnNldCArIDJdID0gY2xpcHBlZFZlcnRpY2VzW3YgKyA2XTsgICAgIC8vIHVcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltvZmZzZXQgKyAzXSA9IGNsaXBwZWRWZXJ0aWNlc1t2ICsgN107ICAgICAvLyB2XG5cbiAgICAgICAgICAgICAgICAgICAgX2ZpbmFsQ29sb3IzMiA9ICgoY2xpcHBlZFZlcnRpY2VzW3YgKyA1XTw8MjQpID4+PiAwKSArIChjbGlwcGVkVmVydGljZXNbdiArIDRdPDwxNikgKyAoY2xpcHBlZFZlcnRpY2VzW3YgKyAzXTw8OCkgKyBjbGlwcGVkVmVydGljZXNbdiArIDJdO1xuICAgICAgICAgICAgICAgICAgICB1aW50VkRhdGFbb2Zmc2V0ICsgNF0gPSBfZmluYWxDb2xvcjMyO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChfdXNlVGludCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2RhcmtDb2xvcjMyID0gKChjbGlwcGVkVmVydGljZXNbdiArIDExXTw8MjQpID4+PiAwKSArIChjbGlwcGVkVmVydGljZXNbdiArIDEwXTw8MTYpICsgKGNsaXBwZWRWZXJ0aWNlc1t2ICsgOV08PDgpICsgY2xpcHBlZFZlcnRpY2VzW3YgKyA4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVpbnRWRGF0YVtvZmZzZXQgKyA1XSA9IF9kYXJrQ29sb3IzMjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlYWxUaW1lVHJhdmVyc2UgKHdvcmxkTWF0KSB7XG4gICAgICAgIGxldCB2YnVmO1xuICAgICAgICBsZXQgaWJ1ZjtcblxuICAgICAgICBsZXQgbG9jU2tlbGV0b24gPSBfY29tcC5fc2tlbGV0b247XG4gICAgICAgIGxldCBza2VsZXRvbkNvbG9yID0gbG9jU2tlbGV0b24uY29sb3I7XG4gICAgICAgIGxldCBncmFwaGljcyA9IF9jb21wLl9kZWJ1Z1JlbmRlcmVyO1xuICAgICAgICBsZXQgY2xpcHBlciA9IF9jb21wLl9jbGlwcGVyO1xuICAgICAgICBsZXQgbWF0ZXJpYWwgPSBudWxsO1xuICAgICAgICBsZXQgYXR0YWNobWVudCwgYXR0YWNobWVudENvbG9yLCBzbG90Q29sb3IsIHV2cywgdHJpYW5nbGVzO1xuICAgICAgICBsZXQgaXNSZWdpb24sIGlzTWVzaCwgaXNDbGlwO1xuICAgICAgICBsZXQgb2Zmc2V0SW5mbztcbiAgICAgICAgbGV0IHNsb3Q7XG4gICAgICAgIGxldCB3b3JsZE1hdG07XG5cbiAgICAgICAgX3Nsb3RSYW5nZVN0YXJ0ID0gX2NvbXAuX3N0YXJ0U2xvdEluZGV4O1xuICAgICAgICBfc2xvdFJhbmdlRW5kID0gX2NvbXAuX2VuZFNsb3RJbmRleDtcbiAgICAgICAgX2luUmFuZ2UgPSBmYWxzZTtcbiAgICAgICAgaWYgKF9zbG90UmFuZ2VTdGFydCA9PSAtMSkgX2luUmFuZ2UgPSB0cnVlO1xuXG4gICAgICAgIF9kZWJ1Z1Nsb3RzID0gX2NvbXAuZGVidWdTbG90cztcbiAgICAgICAgX2RlYnVnQm9uZXMgPSBfY29tcC5kZWJ1Z0JvbmVzO1xuICAgICAgICBfZGVidWdNZXNoID0gX2NvbXAuZGVidWdNZXNoO1xuICAgICAgICBpZiAoZ3JhcGhpY3MgJiYgKF9kZWJ1Z0JvbmVzIHx8IF9kZWJ1Z1Nsb3RzIHx8IF9kZWJ1Z01lc2gpKSB7XG4gICAgICAgICAgICBncmFwaGljcy5jbGVhcigpO1xuICAgICAgICAgICAgZ3JhcGhpY3MubGluZVdpZHRoID0gMjtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICAvLyB4IHkgdSB2IHIxIGcxIGIxIGExIHIyIGcyIGIyIGEyIG9yIHggeSB1IHYgciBnIGIgYSBcbiAgICAgICAgX3BlckNsaXBWZXJ0ZXhTaXplID0gX3VzZVRpbnQgPyAxMiA6IDg7XG4gICAgXG4gICAgICAgIF92ZXJ0ZXhGbG9hdENvdW50ID0gMDtcbiAgICAgICAgX3ZlcnRleEZsb2F0T2Zmc2V0ID0gMDtcbiAgICAgICAgX3ZlcnRleE9mZnNldCA9IDA7XG4gICAgICAgIF9pbmRleENvdW50ID0gMDtcbiAgICAgICAgX2luZGV4T2Zmc2V0ID0gMDtcblxuICAgICAgICBmb3IgKGxldCBzbG90SWR4ID0gMCwgc2xvdENvdW50ID0gbG9jU2tlbGV0b24uZHJhd09yZGVyLmxlbmd0aDsgc2xvdElkeCA8IHNsb3RDb3VudDsgc2xvdElkeCsrKSB7XG4gICAgICAgICAgICBzbG90ID0gbG9jU2tlbGV0b24uZHJhd09yZGVyW3Nsb3RJZHhdO1xuXG4gICAgICAgICAgICBpZihzbG90ID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX3Nsb3RSYW5nZVN0YXJ0ID49IDAgJiYgX3Nsb3RSYW5nZVN0YXJ0ID09IHNsb3QuZGF0YS5pbmRleCkge1xuICAgICAgICAgICAgICAgIF9pblJhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFfaW5SYW5nZSkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgaWYgKF9zbG90UmFuZ2VFbmQgPj0gMCAmJiBfc2xvdFJhbmdlRW5kID09IHNsb3QuZGF0YS5pbmRleCkge1xuICAgICAgICAgICAgICAgIF9pblJhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICBfdmVydGV4RmxvYXRDb3VudCA9IDA7XG4gICAgICAgICAgICBfaW5kZXhDb3VudCA9IDA7XG5cbiAgICAgICAgICAgIGF0dGFjaG1lbnQgPSBzbG90LmdldEF0dGFjaG1lbnQoKTtcbiAgICAgICAgICAgIGlmICghYXR0YWNobWVudCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpc1JlZ2lvbiA9IGF0dGFjaG1lbnQgaW5zdGFuY2VvZiBzcGluZS5SZWdpb25BdHRhY2htZW50O1xuICAgICAgICAgICAgaXNNZXNoID0gYXR0YWNobWVudCBpbnN0YW5jZW9mIHNwaW5lLk1lc2hBdHRhY2htZW50O1xuICAgICAgICAgICAgaXNDbGlwID0gYXR0YWNobWVudCBpbnN0YW5jZW9mIHNwaW5lLkNsaXBwaW5nQXR0YWNobWVudDtcblxuICAgICAgICAgICAgaWYgKGlzQ2xpcCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcFN0YXJ0KHNsb3QsIGF0dGFjaG1lbnQpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWlzUmVnaW9uICYmICFpc01lc2gpIHtcbiAgICAgICAgICAgICAgICBjbGlwcGVyLmNsaXBFbmRXaXRoU2xvdChzbG90KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0ZXJpYWwgPSBfZ2V0U2xvdE1hdGVyaWFsKGF0dGFjaG1lbnQucmVnaW9uLnRleHR1cmUuX3RleHR1cmUsIHNsb3QuZGF0YS5ibGVuZE1vZGUpO1xuICAgICAgICAgICAgaWYgKCFtYXRlcmlhbCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX211c3RGbHVzaCB8fCBtYXRlcmlhbC5nZXRIYXNoKCkgIT09IF9yZW5kZXJlci5tYXRlcmlhbC5nZXRIYXNoKCkpIHtcbiAgICAgICAgICAgICAgICBfbXVzdEZsdXNoID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgX3JlbmRlcmVyLl9mbHVzaCgpO1xuICAgICAgICAgICAgICAgIF9yZW5kZXJlci5ub2RlID0gX25vZGU7XG4gICAgICAgICAgICAgICAgX3JlbmRlcmVyLm1hdGVyaWFsID0gbWF0ZXJpYWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpc1JlZ2lvbikge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRyaWFuZ2xlcyA9IF9xdWFkVHJpYW5nbGVzO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIGluc3VyZSBjYXBhY2l0eVxuICAgICAgICAgICAgICAgIF92ZXJ0ZXhGbG9hdENvdW50ID0gNCAqIF9wZXJWZXJ0ZXhTaXplO1xuICAgICAgICAgICAgICAgIF9pbmRleENvdW50ID0gNjtcblxuICAgICAgICAgICAgICAgIG9mZnNldEluZm8gPSBfYnVmZmVyLnJlcXVlc3QoNCwgNik7XG4gICAgICAgICAgICAgICAgX2luZGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby5pbmRpY2VPZmZzZXQsXG4gICAgICAgICAgICAgICAgX3ZlcnRleE9mZnNldCA9IG9mZnNldEluZm8udmVydGV4T2Zmc2V0LFxuICAgICAgICAgICAgICAgIF92ZXJ0ZXhGbG9hdE9mZnNldCA9IG9mZnNldEluZm8uYnl0ZU9mZnNldCA+PiAyO1xuICAgICAgICAgICAgICAgIHZidWYgPSBfYnVmZmVyLl92RGF0YSxcbiAgICAgICAgICAgICAgICBpYnVmID0gX2J1ZmZlci5faURhdGE7XG4gICAgXG4gICAgICAgICAgICAgICAgLy8gY29tcHV0ZSB2ZXJ0ZXggYW5kIGZpbGwgeCB5XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudC5jb21wdXRlV29ybGRWZXJ0aWNlcyhzbG90LmJvbmUsIHZidWYsIF92ZXJ0ZXhGbG9hdE9mZnNldCwgX3BlclZlcnRleFNpemUpO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIGRyYXcgZGVidWcgc2xvdHMgaWYgZW5hYmxlZCBncmFwaGljc1xuICAgICAgICAgICAgICAgIGlmIChncmFwaGljcyAmJiBfZGVidWdTbG90cykge1xuICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5zdHJva2VDb2xvciA9IF9zbG90Q29sb3I7XG4gICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLm1vdmVUbyh2YnVmW192ZXJ0ZXhGbG9hdE9mZnNldF0sIHZidWZbX3ZlcnRleEZsb2F0T2Zmc2V0ICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpaSA9IF92ZXJ0ZXhGbG9hdE9mZnNldCArIF9wZXJWZXJ0ZXhTaXplLCBubiA9IF92ZXJ0ZXhGbG9hdE9mZnNldCArIF92ZXJ0ZXhGbG9hdENvdW50OyBpaSA8IG5uOyBpaSArPSBfcGVyVmVydGV4U2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MubGluZVRvKHZidWZbaWldLCB2YnVmW2lpICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLnN0cm9rZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzTWVzaCkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRyaWFuZ2xlcyA9IGF0dGFjaG1lbnQudHJpYW5nbGVzO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIGluc3VyZSBjYXBhY2l0eVxuICAgICAgICAgICAgICAgIF92ZXJ0ZXhGbG9hdENvdW50ID0gKGF0dGFjaG1lbnQud29ybGRWZXJ0aWNlc0xlbmd0aCA+PiAxKSAqIF9wZXJWZXJ0ZXhTaXplO1xuICAgICAgICAgICAgICAgIF9pbmRleENvdW50ID0gdHJpYW5nbGVzLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIG9mZnNldEluZm8gPSBfYnVmZmVyLnJlcXVlc3QoX3ZlcnRleEZsb2F0Q291bnQgLyBfcGVyVmVydGV4U2l6ZSwgX2luZGV4Q291bnQpO1xuICAgICAgICAgICAgICAgIF9pbmRleE9mZnNldCA9IG9mZnNldEluZm8uaW5kaWNlT2Zmc2V0LFxuICAgICAgICAgICAgICAgIF92ZXJ0ZXhPZmZzZXQgPSBvZmZzZXRJbmZvLnZlcnRleE9mZnNldCxcbiAgICAgICAgICAgICAgICBfdmVydGV4RmxvYXRPZmZzZXQgPSBvZmZzZXRJbmZvLmJ5dGVPZmZzZXQgPj4gMjtcbiAgICAgICAgICAgICAgICB2YnVmID0gX2J1ZmZlci5fdkRhdGEsXG4gICAgICAgICAgICAgICAgaWJ1ZiA9IF9idWZmZXIuX2lEYXRhO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIGNvbXB1dGUgdmVydGV4IGFuZCBmaWxsIHggeVxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnQuY29tcHV0ZVdvcmxkVmVydGljZXMoc2xvdCwgMCwgYXR0YWNobWVudC53b3JsZFZlcnRpY2VzTGVuZ3RoLCB2YnVmLCBfdmVydGV4RmxvYXRPZmZzZXQsIF9wZXJWZXJ0ZXhTaXplKTtcblxuICAgICAgICAgICAgICAgIC8vIGRyYXcgZGVidWcgbWVzaCBpZiBlbmFibGVkIGdyYXBoaWNzXG4gICAgICAgICAgICAgICAgaWYgKGdyYXBoaWNzICYmIF9kZWJ1Z01lc2gpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3Muc3Ryb2tlQ29sb3IgPSBfbWVzaENvbG9yO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGlpID0gMCwgbm4gPSB0cmlhbmdsZXMubGVuZ3RoOyBpaSA8IG5uOyBpaSArPSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdjEgPSB0cmlhbmdsZXNbaWldICogX3BlclZlcnRleFNpemUgKyBfdmVydGV4RmxvYXRPZmZzZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdjIgPSB0cmlhbmdsZXNbaWkgKyAxXSAqIF9wZXJWZXJ0ZXhTaXplICsgX3ZlcnRleEZsb2F0T2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHYzID0gdHJpYW5nbGVzW2lpICsgMl0gKiBfcGVyVmVydGV4U2l6ZSArIF92ZXJ0ZXhGbG9hdE9mZnNldDtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MubW92ZVRvKHZidWZbdjFdLCB2YnVmW3YxICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MubGluZVRvKHZidWZbdjJdLCB2YnVmW3YyICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MubGluZVRvKHZidWZbdjNdLCB2YnVmW3YzICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLnN0cm9rZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgaWYgKF92ZXJ0ZXhGbG9hdENvdW50ID09IDAgfHwgX2luZGV4Q291bnQgPT0gMCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgLy8gZmlsbCBpbmRpY2VzXG4gICAgICAgICAgICBpYnVmLnNldCh0cmlhbmdsZXMsIF9pbmRleE9mZnNldCk7XG5cbiAgICAgICAgICAgIC8vIGZpbGwgdSB2XG4gICAgICAgICAgICB1dnMgPSBhdHRhY2htZW50LnV2cztcbiAgICAgICAgICAgIGZvciAobGV0IHYgPSBfdmVydGV4RmxvYXRPZmZzZXQsIG4gPSBfdmVydGV4RmxvYXRPZmZzZXQgKyBfdmVydGV4RmxvYXRDb3VudCwgdSA9IDA7IHYgPCBuOyB2ICs9IF9wZXJWZXJ0ZXhTaXplLCB1ICs9IDIpIHtcbiAgICAgICAgICAgICAgICB2YnVmW3YgKyAyXSA9IHV2c1t1XTsgICAgICAgICAgIC8vIHVcbiAgICAgICAgICAgICAgICB2YnVmW3YgKyAzXSA9IHV2c1t1ICsgMV07ICAgICAgIC8vIHZcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXR0YWNobWVudENvbG9yID0gYXR0YWNobWVudC5jb2xvcixcbiAgICAgICAgICAgIHNsb3RDb2xvciA9IHNsb3QuY29sb3I7XG5cbiAgICAgICAgICAgIHRoaXMuZmlsbFZlcnRpY2VzKHNrZWxldG9uQ29sb3IsIGF0dGFjaG1lbnRDb2xvciwgc2xvdENvbG9yLCBjbGlwcGVyLCBzbG90KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gcmVzZXQgYnVmZmVyIHBvaW50ZXIsIGJlY2F1c2UgY2xpcHBlciBtYXliZSByZWFsbG9jIGEgbmV3IGJ1ZmZlciBpbiBmaWxlIFZlcnRpY2VzIGZ1bmN0aW9uLlxuICAgICAgICAgICAgdmJ1ZiA9IF9idWZmZXIuX3ZEYXRhLFxuICAgICAgICAgICAgaWJ1ZiA9IF9idWZmZXIuX2lEYXRhO1xuICAgIFxuICAgICAgICAgICAgaWYgKF9pbmRleENvdW50ID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGlpID0gX2luZGV4T2Zmc2V0LCBubiA9IF9pbmRleE9mZnNldCArIF9pbmRleENvdW50OyBpaSA8IG5uOyBpaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlidWZbaWldICs9IF92ZXJ0ZXhPZmZzZXQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHdvcmxkTWF0KSB7XG4gICAgICAgICAgICAgICAgICAgIHdvcmxkTWF0bSA9IHdvcmxkTWF0Lm07XG4gICAgICAgICAgICAgICAgICAgIF9tMDAgPSB3b3JsZE1hdG1bMF07XG4gICAgICAgICAgICAgICAgICAgIF9tMDQgPSB3b3JsZE1hdG1bNF07XG4gICAgICAgICAgICAgICAgICAgIF9tMTIgPSB3b3JsZE1hdG1bMTJdO1xuICAgICAgICAgICAgICAgICAgICBfbTAxID0gd29ybGRNYXRtWzFdO1xuICAgICAgICAgICAgICAgICAgICBfbTA1ID0gd29ybGRNYXRtWzVdO1xuICAgICAgICAgICAgICAgICAgICBfbTEzID0gd29ybGRNYXRtWzEzXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaWkgPSBfdmVydGV4RmxvYXRPZmZzZXQsIG5uID0gX3ZlcnRleEZsb2F0T2Zmc2V0ICsgX3ZlcnRleEZsb2F0Q291bnQ7IGlpIDwgbm47IGlpICs9IF9wZXJWZXJ0ZXhTaXplKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfeCA9IHZidWZbaWldO1xuICAgICAgICAgICAgICAgICAgICAgICAgX3kgPSB2YnVmW2lpICsgMV07XG4gICAgICAgICAgICAgICAgICAgICAgICB2YnVmW2lpXSA9IF94ICogX20wMCArIF95ICogX20wNCArIF9tMTI7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YnVmW2lpICsgMV0gPSBfeCAqIF9tMDEgKyBfeSAqIF9tMDUgKyBfbTEzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF9idWZmZXIuYWRqdXN0KF92ZXJ0ZXhGbG9hdENvdW50IC8gX3BlclZlcnRleFNpemUsIF9pbmRleENvdW50KTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGNsaXBwZXIuY2xpcEVuZCgpO1xuICAgIFxuICAgICAgICBpZiAoZ3JhcGhpY3MgJiYgX2RlYnVnQm9uZXMpIHtcbiAgICAgICAgICAgIGxldCBib25lO1xuICAgICAgICAgICAgZ3JhcGhpY3Muc3Ryb2tlQ29sb3IgPSBfYm9uZUNvbG9yO1xuICAgICAgICAgICAgZ3JhcGhpY3MuZmlsbENvbG9yID0gX3Nsb3RDb2xvcjsgLy8gUm9vdCBib25lIGNvbG9yIGlzIHNhbWUgYXMgc2xvdCBjb2xvci5cbiAgICBcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBuID0gbG9jU2tlbGV0b24uYm9uZXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYm9uZSA9IGxvY1NrZWxldG9uLmJvbmVzW2ldO1xuICAgICAgICAgICAgICAgIGxldCB4ID0gYm9uZS5kYXRhLmxlbmd0aCAqIGJvbmUuYSArIGJvbmUud29ybGRYO1xuICAgICAgICAgICAgICAgIGxldCB5ID0gYm9uZS5kYXRhLmxlbmd0aCAqIGJvbmUuYyArIGJvbmUud29ybGRZO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIEJvbmUgbGVuZ3Rocy5cbiAgICAgICAgICAgICAgICBncmFwaGljcy5tb3ZlVG8oYm9uZS53b3JsZFgsIGJvbmUud29ybGRZKTtcbiAgICAgICAgICAgICAgICBncmFwaGljcy5saW5lVG8oeCwgeSk7XG4gICAgICAgICAgICAgICAgZ3JhcGhpY3Muc3Ryb2tlKCk7XG4gICAgXG4gICAgICAgICAgICAgICAgLy8gQm9uZSBvcmlnaW5zLlxuICAgICAgICAgICAgICAgIGdyYXBoaWNzLmNpcmNsZShib25lLndvcmxkWCwgYm9uZS53b3JsZFksIE1hdGguUEkgKiAxLjUpO1xuICAgICAgICAgICAgICAgIGdyYXBoaWNzLmZpbGwoKTtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5maWxsQ29sb3IgPSBfb3JpZ2luQ29sb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FjaGVUcmF2ZXJzZSAod29ybGRNYXQpIHtcbiAgICAgICAgXG4gICAgICAgIGxldCBmcmFtZSA9IF9jb21wLl9jdXJGcmFtZTtcbiAgICAgICAgaWYgKCFmcmFtZSkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBzZWdtZW50cyA9IGZyYW1lLnNlZ21lbnRzO1xuICAgICAgICBpZiAoc2VnbWVudHMubGVuZ3RoID09IDApIHJldHVybjtcblxuICAgICAgICBsZXQgdmJ1ZiwgaWJ1ZiwgdWludGJ1ZjtcbiAgICAgICAgbGV0IG1hdGVyaWFsO1xuICAgICAgICBsZXQgb2Zmc2V0SW5mbztcbiAgICAgICAgbGV0IHZlcnRpY2VzID0gZnJhbWUudmVydGljZXM7XG4gICAgICAgIGxldCBpbmRpY2VzID0gZnJhbWUuaW5kaWNlcztcbiAgICAgICAgbGV0IHdvcmxkTWF0bTtcblxuICAgICAgICBsZXQgZnJhbWVWRk9mZnNldCA9IDAsIGZyYW1lSW5kZXhPZmZzZXQgPSAwLCBzZWdWRkNvdW50ID0gMDtcbiAgICAgICAgaWYgKHdvcmxkTWF0KSB7XG4gICAgICAgICAgICB3b3JsZE1hdG0gPSB3b3JsZE1hdC5tO1xuICAgICAgICAgICAgX20wMCA9IHdvcmxkTWF0bVswXTtcbiAgICAgICAgICAgIF9tMDEgPSB3b3JsZE1hdG1bMV07XG4gICAgICAgICAgICBfbTA0ID0gd29ybGRNYXRtWzRdO1xuICAgICAgICAgICAgX20wNSA9IHdvcmxkTWF0bVs1XTtcbiAgICAgICAgICAgIF9tMTIgPSB3b3JsZE1hdG1bMTJdO1xuICAgICAgICAgICAgX20xMyA9IHdvcmxkTWF0bVsxM107XG4gICAgICAgIH1cblxuICAgICAgICBsZXQganVzdFRyYW5zbGF0ZSA9IF9tMDAgPT09IDEgJiYgX20wMSA9PT0gMCAmJiBfbTA0ID09PSAwICYmIF9tMDUgPT09IDE7XG4gICAgICAgIGxldCBuZWVkQmF0Y2ggPSAoX2hhbmRsZVZhbCAmIEZMQUdfQkFUQ0gpO1xuICAgICAgICBsZXQgY2FsY1RyYW5zbGF0ZSA9IG5lZWRCYXRjaCAmJiBqdXN0VHJhbnNsYXRlO1xuXG4gICAgICAgIGxldCBjb2xvck9mZnNldCA9IDA7XG4gICAgICAgIGxldCBjb2xvcnMgPSBmcmFtZS5jb2xvcnM7XG4gICAgICAgIGxldCBub3dDb2xvciA9IGNvbG9yc1tjb2xvck9mZnNldCsrXTtcbiAgICAgICAgbGV0IG1heFZGT2Zmc2V0ID0gbm93Q29sb3IudmZPZmZzZXQ7XG4gICAgICAgIF9oYW5kbGVDb2xvcihub3dDb2xvcik7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSBzZWdtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBzZWdJbmZvID0gc2VnbWVudHNbaV07XG4gICAgICAgICAgICBtYXRlcmlhbCA9IF9nZXRTbG90TWF0ZXJpYWwoc2VnSW5mby50ZXgsIHNlZ0luZm8uYmxlbmRNb2RlKTtcbiAgICAgICAgICAgIGlmICghbWF0ZXJpYWwpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZiAoX211c3RGbHVzaCB8fCBtYXRlcmlhbC5nZXRIYXNoKCkgIT09IF9yZW5kZXJlci5tYXRlcmlhbC5nZXRIYXNoKCkpIHtcbiAgICAgICAgICAgICAgICBfbXVzdEZsdXNoID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgX3JlbmRlcmVyLl9mbHVzaCgpO1xuICAgICAgICAgICAgICAgIF9yZW5kZXJlci5ub2RlID0gX25vZGU7XG4gICAgICAgICAgICAgICAgX3JlbmRlcmVyLm1hdGVyaWFsID0gbWF0ZXJpYWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF92ZXJ0ZXhDb3VudCA9IHNlZ0luZm8udmVydGV4Q291bnQ7XG4gICAgICAgICAgICBfaW5kZXhDb3VudCA9IHNlZ0luZm8uaW5kZXhDb3VudDtcblxuICAgICAgICAgICAgb2Zmc2V0SW5mbyA9IF9idWZmZXIucmVxdWVzdChfdmVydGV4Q291bnQsIF9pbmRleENvdW50KTtcbiAgICAgICAgICAgIF9pbmRleE9mZnNldCA9IG9mZnNldEluZm8uaW5kaWNlT2Zmc2V0O1xuICAgICAgICAgICAgX3ZlcnRleE9mZnNldCA9IG9mZnNldEluZm8udmVydGV4T2Zmc2V0O1xuICAgICAgICAgICAgX3ZmT2Zmc2V0ID0gb2Zmc2V0SW5mby5ieXRlT2Zmc2V0ID4+IDI7XG4gICAgICAgICAgICB2YnVmID0gX2J1ZmZlci5fdkRhdGE7XG4gICAgICAgICAgICBpYnVmID0gX2J1ZmZlci5faURhdGE7XG4gICAgICAgICAgICB1aW50YnVmID0gX2J1ZmZlci5fdWludFZEYXRhO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpaSA9IF9pbmRleE9mZnNldCwgaWwgPSBfaW5kZXhPZmZzZXQgKyBfaW5kZXhDb3VudDsgaWkgPCBpbDsgaWkrKykge1xuICAgICAgICAgICAgICAgIGlidWZbaWldID0gX3ZlcnRleE9mZnNldCArIGluZGljZXNbZnJhbWVJbmRleE9mZnNldCsrXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VnVkZDb3VudCA9IHNlZ0luZm8udmZDb3VudDtcbiAgICAgICAgICAgIHZidWYuc2V0KHZlcnRpY2VzLnN1YmFycmF5KGZyYW1lVkZPZmZzZXQsIGZyYW1lVkZPZmZzZXQgKyBzZWdWRkNvdW50KSwgX3ZmT2Zmc2V0KTtcbiAgICAgICAgICAgIGZyYW1lVkZPZmZzZXQgKz0gc2VnVkZDb3VudDtcblxuICAgICAgICAgICAgaWYgKGNhbGNUcmFuc2xhdGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpaSA9IF92Zk9mZnNldCwgaWwgPSBfdmZPZmZzZXQgKyBzZWdWRkNvdW50OyBpaSA8IGlsOyBpaSArPSA2KSB7XG4gICAgICAgICAgICAgICAgICAgIHZidWZbaWldICs9IF9tMTI7XG4gICAgICAgICAgICAgICAgICAgIHZidWZbaWkgKyAxXSArPSBfbTEzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobmVlZEJhdGNoKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaWkgPSBfdmZPZmZzZXQsIGlsID0gX3ZmT2Zmc2V0ICsgc2VnVkZDb3VudDsgaWkgPCBpbDsgaWkgKz0gNikge1xuICAgICAgICAgICAgICAgICAgICBfeCA9IHZidWZbaWldO1xuICAgICAgICAgICAgICAgICAgICBfeSA9IHZidWZbaWkgKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltpaV0gPSBfeCAqIF9tMDAgKyBfeSAqIF9tMDQgKyBfbTEyO1xuICAgICAgICAgICAgICAgICAgICB2YnVmW2lpICsgMV0gPSBfeCAqIF9tMDEgKyBfeSAqIF9tMDUgKyBfbTEzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX2J1ZmZlci5hZGp1c3QoX3ZlcnRleENvdW50LCBfaW5kZXhDb3VudCk7XG4gICAgICAgICAgICBpZiAoICFfbmVlZENvbG9yICkgY29udGludWU7XG5cbiAgICAgICAgICAgIC8vIGhhbmRsZSBjb2xvclxuICAgICAgICAgICAgbGV0IGZyYW1lQ29sb3JPZmZzZXQgPSBmcmFtZVZGT2Zmc2V0IC0gc2VnVkZDb3VudDtcbiAgICAgICAgICAgIGZvciAobGV0IGlpID0gX3ZmT2Zmc2V0ICsgNCwgaWwgPSBfdmZPZmZzZXQgKyA0ICsgc2VnVkZDb3VudDsgaWkgPCBpbDsgaWkgKz0gNiwgZnJhbWVDb2xvck9mZnNldCArPSA2KSB7XG4gICAgICAgICAgICAgICAgaWYgKGZyYW1lQ29sb3JPZmZzZXQgPj0gbWF4VkZPZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgbm93Q29sb3IgPSBjb2xvcnNbY29sb3JPZmZzZXQrK107XG4gICAgICAgICAgICAgICAgICAgIF9oYW5kbGVDb2xvcihub3dDb2xvcik7XG4gICAgICAgICAgICAgICAgICAgIG1heFZGT2Zmc2V0ID0gbm93Q29sb3IudmZPZmZzZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHVpbnRidWZbaWldID0gX2ZpbmFsQ29sb3IzMjtcbiAgICAgICAgICAgICAgICB1aW50YnVmW2lpICsgMV0gPSBfZGFya0NvbG9yMzI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWxsQnVmZmVycyAoY29tcCwgcmVuZGVyZXIpIHtcbiAgICAgICAgXG4gICAgICAgIGxldCBub2RlID0gY29tcC5ub2RlO1xuICAgICAgICBub2RlLl9yZW5kZXJGbGFnIHw9IFJlbmRlckZsb3cuRkxBR19VUERBVEVfUkVOREVSX0RBVEE7XG4gICAgICAgIGlmICghY29tcC5fc2tlbGV0b24pIHJldHVybjtcblxuICAgICAgICBsZXQgbm9kZUNvbG9yID0gbm9kZS5fY29sb3I7XG4gICAgICAgIF9ub2RlUiA9IG5vZGVDb2xvci5yIC8gMjU1O1xuICAgICAgICBfbm9kZUcgPSBub2RlQ29sb3IuZyAvIDI1NTtcbiAgICAgICAgX25vZGVCID0gbm9kZUNvbG9yLmIgLyAyNTU7XG4gICAgICAgIF9ub2RlQSA9IG5vZGVDb2xvci5hIC8gMjU1O1xuXG4gICAgICAgIF91c2VUaW50ID0gY29tcC51c2VUaW50IHx8IGNvbXAuaXNBbmltYXRpb25DYWNoZWQoKTtcbiAgICAgICAgX3ZlcnRleEZvcm1hdCA9IF91c2VUaW50PyBWRlR3b0NvbG9yIDogVkZPbmVDb2xvcjtcbiAgICAgICAgLy8geCB5IHUgdiBjb2xvcjEgY29sb3IyIG9yIHggeSB1IHYgY29sb3JcbiAgICAgICAgX3BlclZlcnRleFNpemUgPSBfdXNlVGludCA/IDYgOiA1O1xuXG4gICAgICAgIF9ub2RlID0gY29tcC5ub2RlO1xuICAgICAgICBfYnVmZmVyID0gcmVuZGVyZXIuZ2V0QnVmZmVyKCdzcGluZScsIF92ZXJ0ZXhGb3JtYXQpO1xuICAgICAgICBfcmVuZGVyZXIgPSByZW5kZXJlcjtcbiAgICAgICAgX2NvbXAgPSBjb21wO1xuXG4gICAgICAgIF9tdXN0Rmx1c2ggPSB0cnVlO1xuICAgICAgICBfcHJlbXVsdGlwbGllZEFscGhhID0gY29tcC5wcmVtdWx0aXBsaWVkQWxwaGE7XG4gICAgICAgIF9tdWx0aXBsaWVyID0gMS4wO1xuICAgICAgICBfaGFuZGxlVmFsID0gMHgwMDtcbiAgICAgICAgX25lZWRDb2xvciA9IGZhbHNlO1xuICAgICAgICBfdmVydGV4RWZmZWN0ID0gY29tcC5fZWZmZWN0RGVsZWdhdGUgJiYgY29tcC5fZWZmZWN0RGVsZWdhdGUuX3ZlcnRleEVmZmVjdDtcblxuICAgICAgICBpZiAobm9kZUNvbG9yLl92YWwgIT09IDB4ZmZmZmZmZmYgfHwgX3ByZW11bHRpcGxpZWRBbHBoYSkge1xuICAgICAgICAgICAgX25lZWRDb2xvciA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3VzZVRpbnQpIHtcbiAgICAgICAgICAgIF9oYW5kbGVWYWwgfD0gRkxBR19UV09fQ09MT1I7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgd29ybGRNYXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChfY29tcC5lbmFibGVCYXRjaCkge1xuICAgICAgICAgICAgd29ybGRNYXQgPSBfbm9kZS5fd29ybGRNYXRyaXg7XG4gICAgICAgICAgICBfbXVzdEZsdXNoID0gZmFsc2U7XG4gICAgICAgICAgICBfaGFuZGxlVmFsIHw9IEZMQUdfQkFUQ0g7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29tcC5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICAvLyBUcmF2ZXJzZSBpbnB1dCBhc3NlbWJsZXIuXG4gICAgICAgICAgICB0aGlzLmNhY2hlVHJhdmVyc2Uod29ybGRNYXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF92ZXJ0ZXhFZmZlY3QpIF92ZXJ0ZXhFZmZlY3QuYmVnaW4oY29tcC5fc2tlbGV0b24pO1xuICAgICAgICAgICAgdGhpcy5yZWFsVGltZVRyYXZlcnNlKHdvcmxkTWF0KTtcbiAgICAgICAgICAgIGlmIChfdmVydGV4RWZmZWN0KSBfdmVydGV4RWZmZWN0LmVuZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc3luYyBhdHRhY2hlZCBub2RlIG1hdHJpeFxuICAgICAgICByZW5kZXJlci53b3JsZE1hdERpcnR5Kys7XG4gICAgICAgIGNvbXAuYXR0YWNoVXRpbC5fc3luY0F0dGFjaGVkTm9kZSgpO1xuXG4gICAgICAgIC8vIENsZWFyIHRlbXAgdmFyLlxuICAgICAgICBfbm9kZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgX2J1ZmZlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgX3JlbmRlcmVyID0gdW5kZWZpbmVkO1xuICAgICAgICBfY29tcCA9IHVuZGVmaW5lZDtcbiAgICAgICAgX3ZlcnRleEVmZmVjdCA9IG51bGw7XG4gICAgfVxuXG4gICAgcG9zdEZpbGxCdWZmZXJzIChjb21wLCByZW5kZXJlcikge1xuICAgICAgICByZW5kZXJlci53b3JsZE1hdERpcnR5LS07XG4gICAgfVxufVxuXG5Bc3NlbWJsZXIucmVnaXN0ZXIoU2tlbGV0b24sIFNwaW5lQXNzZW1ibGVyKTtcbiJdLCJzb3VyY2VSb290IjoiLyJ9