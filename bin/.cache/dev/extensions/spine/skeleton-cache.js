
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/spine/skeleton-cache.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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
var TrackEntryListeners = require('./track-entry-listeners');

var spine = require('./lib/spine'); // Permit max cache time, unit is second.


var MaxCacheTime = 30;
var FrameTime = 1 / 60;
var _vertices = [];
var _indices = [];
var _boneInfoOffset = 0;
var _vertexOffset = 0;
var _indexOffset = 0;
var _vfOffset = 0;
var _preTexUrl = null;
var _preBlendMode = null;
var _segVCount = 0;
var _segICount = 0;
var _segOffset = 0;
var _colorOffset = 0;
var _preFinalColor = null;
var _preDarkColor = null; // x y u v c1 c2

var _perVertexSize = 6; // x y u v r1 g1 b1 a1 r2 g2 b2 a2

var _perClipVertexSize = 12;
var _vfCount = 0,
    _indexCount = 0;

var _tempr, _tempg, _tempb, _tempa;

var _finalColor32, _darkColor32;

var _finalColor = new spine.Color(1, 1, 1, 1);

var _darkColor = new spine.Color(1, 1, 1, 1);

var _quadTriangles = [0, 1, 2, 2, 3, 0]; //Cache all frames in an animation

var AnimationCache = cc.Class({
  ctor: function ctor() {
    this._privateMode = false;
    this._inited = false;
    this._invalid = true;
    this._enableCacheAttachedInfo = false;
    this.frames = [];
    this.totalTime = 0;
    this._frameIdx = -1;
    this.isCompleted = false;
    this._skeletonInfo = null;
    this._animationName = null;
    this._tempSegments = null;
    this._tempColors = null;
    this._tempBoneInfos = null;
  },
  init: function init(skeletonInfo, animationName) {
    this._inited = true;
    this._animationName = animationName;
    this._skeletonInfo = skeletonInfo;
  },
  // Clear texture quote.
  clear: function clear() {
    this._inited = false;

    for (var i = 0, n = this.frames.length; i < n; i++) {
      var frame = this.frames[i];
      frame.segments.length = 0;
    }

    this.invalidAllFrame();
  },
  bind: function bind(listener) {
    var completeHandle = function (entry) {
      if (entry && entry.animation.name === this._animationName) {
        this.isCompleted = true;
      }
    }.bind(this);

    listener.complete = completeHandle;
  },
  unbind: function unbind(listener) {
    listener.complete = null;
  },
  begin: function begin() {
    if (!this._invalid) return;
    var skeletonInfo = this._skeletonInfo;
    var preAnimationCache = skeletonInfo.curAnimationCache;

    if (preAnimationCache && preAnimationCache !== this) {
      if (this._privateMode) {
        // Private cache mode just invalid pre animation frame.
        preAnimationCache.invalidAllFrame();
      } else {
        // If pre animation not finished, play it to the end.
        preAnimationCache.updateToFrame();
      }
    }

    var skeleton = skeletonInfo.skeleton;
    var listener = skeletonInfo.listener;
    var state = skeletonInfo.state;
    var animation = skeleton.data.findAnimation(this._animationName);
    state.setAnimationWith(0, animation, false);
    this.bind(listener); // record cur animation cache

    skeletonInfo.curAnimationCache = this;
    this._frameIdx = -1;
    this.isCompleted = false;
    this.totalTime = 0;
    this._invalid = false;
  },
  end: function end() {
    if (!this._needToUpdate()) {
      // clear cur animation cache
      this._skeletonInfo.curAnimationCache = null;
      this.frames.length = this._frameIdx + 1;
      this.isCompleted = true;
      this.unbind(this._skeletonInfo.listener);
    }
  },
  _needToUpdate: function _needToUpdate(toFrameIdx) {
    return !this.isCompleted && this.totalTime < MaxCacheTime && (toFrameIdx == undefined || this._frameIdx < toFrameIdx);
  },
  updateToFrame: function updateToFrame(toFrameIdx) {
    if (!this._inited) return;
    this.begin();
    if (!this._needToUpdate(toFrameIdx)) return;
    var skeletonInfo = this._skeletonInfo;
    var skeleton = skeletonInfo.skeleton;
    var clipper = skeletonInfo.clipper;
    var state = skeletonInfo.state;

    do {
      // Solid update frame rate 1/60.
      skeleton.update(FrameTime);
      state.update(FrameTime);
      state.apply(skeleton);
      skeleton.updateWorldTransform();
      this._frameIdx++;

      this._updateFrame(skeleton, clipper, this._frameIdx);

      this.totalTime += FrameTime;
    } while (this._needToUpdate(toFrameIdx));

    this.end();
  },
  isInited: function isInited() {
    return this._inited;
  },
  isInvalid: function isInvalid() {
    return this._invalid;
  },
  invalidAllFrame: function invalidAllFrame() {
    this.isCompleted = false;
    this._invalid = true;
  },
  updateAllFrame: function updateAllFrame() {
    this.invalidAllFrame();
    this.updateToFrame();
  },
  enableCacheAttachedInfo: function enableCacheAttachedInfo() {
    if (!this._enableCacheAttachedInfo) {
      this._enableCacheAttachedInfo = true;
      this.invalidAllFrame();
    }
  },
  _updateFrame: function _updateFrame(skeleton, clipper, index) {
    _vfOffset = 0;
    _boneInfoOffset = 0;
    _indexOffset = 0;
    _vertexOffset = 0;
    _preTexUrl = null;
    _preBlendMode = null;
    _segVCount = 0;
    _segICount = 0;
    _segOffset = 0;
    _colorOffset = 0;
    _preFinalColor = null;
    _preDarkColor = null;
    this.frames[index] = this.frames[index] || {
      segments: [],
      colors: [],
      boneInfos: [],
      vertices: null,
      uintVert: null,
      indices: null
    };
    var frame = this.frames[index];
    var segments = this._tempSegments = frame.segments;
    var colors = this._tempColors = frame.colors;
    var boneInfos = this._tempBoneInfos = frame.boneInfos;

    this._traverseSkeleton(skeleton, clipper);

    if (_colorOffset > 0) {
      colors[_colorOffset - 1].vfOffset = _vfOffset;
    }

    colors.length = _colorOffset;
    boneInfos.length = _boneInfoOffset; // Handle pre segment.

    var preSegOffset = _segOffset - 1;

    if (preSegOffset >= 0) {
      // Judge segment vertex count is not empty.
      if (_segICount > 0) {
        var preSegInfo = segments[preSegOffset];
        preSegInfo.indexCount = _segICount;
        preSegInfo.vfCount = _segVCount * _perVertexSize;
        preSegInfo.vertexCount = _segVCount;
        segments.length = _segOffset;
      } else {
        // Discard pre segment.
        segments.length = _segOffset - 1;
      }
    } // Segments is empty,discard all segments.


    if (segments.length == 0) return; // Fill vertices

    var vertices = frame.vertices;
    var uintVert = frame.uintVert;

    if (!vertices || vertices.length < _vfOffset) {
      vertices = frame.vertices = new Float32Array(_vfOffset);
      uintVert = frame.uintVert = new Uint32Array(vertices.buffer);
    }

    for (var i = 0, j = 0; i < _vfOffset;) {
      vertices[i++] = _vertices[j++]; // x

      vertices[i++] = _vertices[j++]; // y

      vertices[i++] = _vertices[j++]; // u

      vertices[i++] = _vertices[j++]; // v

      uintVert[i++] = _vertices[j++]; // color1

      uintVert[i++] = _vertices[j++]; // color2
    } // Fill indices


    var indices = frame.indices;

    if (!indices || indices.length < _indexOffset) {
      indices = frame.indices = new Uint16Array(_indexOffset);
    }

    for (var _i = 0; _i < _indexOffset; _i++) {
      indices[_i] = _indices[_i];
    }

    frame.vertices = vertices;
    frame.uintVert = uintVert;
    frame.indices = indices;
  },
  fillVertices: function fillVertices(skeletonColor, attachmentColor, slotColor, clipper, slot) {
    _tempa = slotColor.a * attachmentColor.a * skeletonColor.a * 255;
    _tempr = attachmentColor.r * skeletonColor.r * 255;
    _tempg = attachmentColor.g * skeletonColor.g * 255;
    _tempb = attachmentColor.b * skeletonColor.b * 255;
    _finalColor.r = _tempr * slotColor.r;
    _finalColor.g = _tempg * slotColor.g;
    _finalColor.b = _tempb * slotColor.b;
    _finalColor.a = _tempa;

    if (slot.darkColor == null) {
      _darkColor.set(0.0, 0, 0, 1.0);
    } else {
      _darkColor.r = slot.darkColor.r * _tempr;
      _darkColor.g = slot.darkColor.g * _tempg;
      _darkColor.b = slot.darkColor.b * _tempb;
    }

    _darkColor.a = 0;
    _finalColor32 = (_finalColor.a << 24 >>> 0) + (_finalColor.b << 16) + (_finalColor.g << 8) + _finalColor.r;
    _darkColor32 = (_darkColor.a << 24 >>> 0) + (_darkColor.b << 16) + (_darkColor.g << 8) + _darkColor.r;

    if (_preFinalColor !== _finalColor32 || _preDarkColor !== _darkColor32) {
      var colors = this._tempColors;
      _preFinalColor = _finalColor32;
      _preDarkColor = _darkColor32;

      if (_colorOffset > 0) {
        colors[_colorOffset - 1].vfOffset = _vfOffset;
      }

      colors[_colorOffset++] = {
        fr: _finalColor.r,
        fg: _finalColor.g,
        fb: _finalColor.b,
        fa: _finalColor.a,
        dr: _darkColor.r,
        dg: _darkColor.g,
        db: _darkColor.b,
        da: _darkColor.a,
        vfOffset: 0
      };
    }

    if (!clipper.isClipping()) {
      for (var v = _vfOffset, n = _vfOffset + _vfCount; v < n; v += _perVertexSize) {
        _vertices[v + 4] = _finalColor32; // light color

        _vertices[v + 5] = _darkColor32; // dark color
      }
    } else {
      clipper.clipTriangles(_vertices, _vfCount, _indices, _indexCount, _vertices, _finalColor, _darkColor, true, _perVertexSize, _indexOffset, _vfOffset, _vfOffset + 2);
      var clippedVertices = clipper.clippedVertices;
      var clippedTriangles = clipper.clippedTriangles; // insure capacity

      _indexCount = clippedTriangles.length;
      _vfCount = clippedVertices.length / _perClipVertexSize * _perVertexSize; // fill indices

      for (var ii = 0, jj = _indexOffset, nn = clippedTriangles.length; ii < nn;) {
        _indices[jj++] = clippedTriangles[ii++];
      } // fill vertices contain x y u v light color dark color


      for (var _v = 0, _n = clippedVertices.length, offset = _vfOffset; _v < _n; _v += 12, offset += _perVertexSize) {
        _vertices[offset] = clippedVertices[_v]; // x

        _vertices[offset + 1] = clippedVertices[_v + 1]; // y

        _vertices[offset + 2] = clippedVertices[_v + 6]; // u

        _vertices[offset + 3] = clippedVertices[_v + 7]; // v

        _vertices[offset + 4] = _finalColor32;
        _vertices[offset + 5] = _darkColor32;
      }
    }
  },
  _traverseSkeleton: function _traverseSkeleton(skeleton, clipper) {
    var segments = this._tempSegments;
    var boneInfos = this._tempBoneInfos;
    var skeletonColor = skeleton.color;
    var attachment, attachmentColor, slotColor, uvs, triangles;
    var isRegion, isMesh, isClip;
    var texture;
    var preSegOffset, preSegInfo;
    var blendMode;
    var slot;
    var bones = skeleton.bones;

    if (this._enableCacheAttachedInfo) {
      for (var i = 0, l = bones.length; i < l; i++, _boneInfoOffset++) {
        var bone = bones[i];
        var boneInfo = boneInfos[_boneInfoOffset];

        if (!boneInfo) {
          boneInfo = boneInfos[_boneInfoOffset] = {};
        }

        boneInfo.a = bone.a;
        boneInfo.b = bone.b;
        boneInfo.c = bone.c;
        boneInfo.d = bone.d;
        boneInfo.worldX = bone.worldX;
        boneInfo.worldY = bone.worldY;
      }
    }

    for (var slotIdx = 0, slotCount = skeleton.drawOrder.length; slotIdx < slotCount; slotIdx++) {
      slot = skeleton.drawOrder[slotIdx];
      _vfCount = 0;
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

      texture = attachment.region.texture._texture;

      if (!texture) {
        clipper.clipEndWithSlot(slot);
        continue;
      }

      blendMode = slot.data.blendMode;

      if (_preTexUrl !== texture.nativeUrl || _preBlendMode !== blendMode) {
        _preTexUrl = texture.nativeUrl;
        _preBlendMode = blendMode; // Handle pre segment.

        preSegOffset = _segOffset - 1;

        if (preSegOffset >= 0) {
          if (_segICount > 0) {
            preSegInfo = segments[preSegOffset];
            preSegInfo.indexCount = _segICount;
            preSegInfo.vertexCount = _segVCount;
            preSegInfo.vfCount = _segVCount * _perVertexSize;
          } else {
            // Discard pre segment.
            _segOffset--;
          }
        } // Handle now segment.


        segments[_segOffset] = {
          tex: texture,
          blendMode: blendMode,
          indexCount: 0,
          vertexCount: 0,
          vfCount: 0
        };
        _segOffset++;
        _segICount = 0;
        _segVCount = 0;
      }

      if (isRegion) {
        triangles = _quadTriangles; // insure capacity

        _vfCount = 4 * _perVertexSize;
        _indexCount = 6; // compute vertex and fill x y

        attachment.computeWorldVertices(slot.bone, _vertices, _vfOffset, _perVertexSize);
      } else if (isMesh) {
        triangles = attachment.triangles; // insure capacity

        _vfCount = (attachment.worldVerticesLength >> 1) * _perVertexSize;
        _indexCount = triangles.length; // compute vertex and fill x y

        attachment.computeWorldVertices(slot, 0, attachment.worldVerticesLength, _vertices, _vfOffset, _perVertexSize);
      }

      if (_vfCount == 0 || _indexCount == 0) {
        clipper.clipEndWithSlot(slot);
        continue;
      } // fill indices


      for (var ii = 0, jj = _indexOffset, nn = triangles.length; ii < nn;) {
        _indices[jj++] = triangles[ii++];
      } // fill u v


      uvs = attachment.uvs;

      for (var v = _vfOffset, n = _vfOffset + _vfCount, u = 0; v < n; v += _perVertexSize, u += 2) {
        _vertices[v + 2] = uvs[u]; // u

        _vertices[v + 3] = uvs[u + 1]; // v
      }

      attachmentColor = attachment.color;
      slotColor = slot.color;
      this.fillVertices(skeletonColor, attachmentColor, slotColor, clipper, slot);

      if (_indexCount > 0) {
        for (var _ii = _indexOffset, _nn = _indexOffset + _indexCount; _ii < _nn; _ii++) {
          _indices[_ii] += _segVCount;
        }

        _indexOffset += _indexCount;
        _vfOffset += _vfCount;
        _vertexOffset = _vfOffset / _perVertexSize;
        _segICount += _indexCount;
        _segVCount += _vfCount / _perVertexSize;
      }

      clipper.clipEndWithSlot(slot);
    }

    clipper.clipEnd();
  }
});
var SkeletonCache = cc.Class({
  ctor: function ctor() {
    this._privateMode = false;
    this._animationPool = {};
    this._skeletonCache = {};
  },
  enablePrivateMode: function enablePrivateMode() {
    this._privateMode = true;
  },
  clear: function clear() {
    this._animationPool = {};
    this._skeletonCache = {};
  },
  removeSkeleton: function removeSkeleton(uuid) {
    var skeletonInfo = this._skeletonCache[uuid];
    if (!skeletonInfo) return;
    var animationsCache = skeletonInfo.animationsCache;

    for (var aniKey in animationsCache) {
      // Clear cache texture, and put cache into pool.
      // No need to create TypedArray next time.
      var animationCache = animationsCache[aniKey];
      if (!animationCache) continue;
      this._animationPool[uuid + "#" + aniKey] = animationCache;
      animationCache.clear();
    }

    delete this._skeletonCache[uuid];
  },
  getSkeletonCache: function getSkeletonCache(uuid, skeletonData) {
    var skeletonInfo = this._skeletonCache[uuid];

    if (!skeletonInfo) {
      var skeleton = new spine.Skeleton(skeletonData);
      var clipper = new spine.SkeletonClipping();
      var stateData = new spine.AnimationStateData(skeleton.data);
      var state = new spine.AnimationState(stateData);
      var listener = new TrackEntryListeners();
      state.addListener(listener);
      this._skeletonCache[uuid] = skeletonInfo = {
        skeleton: skeleton,
        clipper: clipper,
        state: state,
        listener: listener,
        // Cache all kinds of animation frame.
        // When skeleton is dispose, clear all animation cache.
        animationsCache: {},
        curAnimationCache: null
      };
    }

    return skeletonInfo;
  },
  getAnimationCache: function getAnimationCache(uuid, animationName) {
    var skeletonInfo = this._skeletonCache[uuid];
    if (!skeletonInfo) return null;
    var animationsCache = skeletonInfo.animationsCache;
    return animationsCache[animationName];
  },
  invalidAnimationCache: function invalidAnimationCache(uuid) {
    var skeletonInfo = this._skeletonCache[uuid];
    var skeleton = skeletonInfo && skeletonInfo.skeleton;
    if (!skeleton) return;
    var animationsCache = skeletonInfo.animationsCache;

    for (var aniKey in animationsCache) {
      var animationCache = animationsCache[aniKey];
      animationCache.invalidAllFrame();
    }
  },
  initAnimationCache: function initAnimationCache(uuid, animationName) {
    if (!animationName) return null;
    var skeletonInfo = this._skeletonCache[uuid];
    var skeleton = skeletonInfo && skeletonInfo.skeleton;
    if (!skeleton) return null;
    var animation = skeleton.data.findAnimation(animationName);

    if (!animation) {
      return null;
    }

    var animationsCache = skeletonInfo.animationsCache;
    var animationCache = animationsCache[animationName];

    if (!animationCache) {
      // If cache exist in pool, then just use it.
      var poolKey = uuid + "#" + animationName;
      animationCache = this._animationPool[poolKey];

      if (animationCache) {
        delete this._animationPool[poolKey];
      } else {
        animationCache = new AnimationCache();
        animationCache._privateMode = this._privateMode;
      }

      animationCache.init(skeletonInfo, animationName);
      animationsCache[animationName] = animationCache;
    }

    return animationCache;
  },
  updateAnimationCache: function updateAnimationCache(uuid, animationName) {
    if (animationName) {
      var animationCache = this.initAnimationCache(uuid, animationName);
      if (!animationCache) return null;
      animationCache.updateAllFrame();
    } else {
      var skeletonInfo = this._skeletonCache[uuid];
      var skeleton = skeletonInfo && skeletonInfo.skeleton;
      if (!skeleton) return;
      var animationsCache = skeletonInfo.animationsCache;

      for (var aniKey in animationsCache) {
        var _animationCache = animationsCache[aniKey];

        _animationCache.updateAllFrame();
      }
    }
  }
});
SkeletonCache.FrameTime = FrameTime;
SkeletonCache.sharedCache = new SkeletonCache();
module.exports = SkeletonCache;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvZXh0ZW5zaW9ucy9zcGluZS9za2VsZXRvbi1jYWNoZS5qcyJdLCJuYW1lcyI6WyJUcmFja0VudHJ5TGlzdGVuZXJzIiwicmVxdWlyZSIsInNwaW5lIiwiTWF4Q2FjaGVUaW1lIiwiRnJhbWVUaW1lIiwiX3ZlcnRpY2VzIiwiX2luZGljZXMiLCJfYm9uZUluZm9PZmZzZXQiLCJfdmVydGV4T2Zmc2V0IiwiX2luZGV4T2Zmc2V0IiwiX3ZmT2Zmc2V0IiwiX3ByZVRleFVybCIsIl9wcmVCbGVuZE1vZGUiLCJfc2VnVkNvdW50IiwiX3NlZ0lDb3VudCIsIl9zZWdPZmZzZXQiLCJfY29sb3JPZmZzZXQiLCJfcHJlRmluYWxDb2xvciIsIl9wcmVEYXJrQ29sb3IiLCJfcGVyVmVydGV4U2l6ZSIsIl9wZXJDbGlwVmVydGV4U2l6ZSIsIl92ZkNvdW50IiwiX2luZGV4Q291bnQiLCJfdGVtcHIiLCJfdGVtcGciLCJfdGVtcGIiLCJfdGVtcGEiLCJfZmluYWxDb2xvcjMyIiwiX2RhcmtDb2xvcjMyIiwiX2ZpbmFsQ29sb3IiLCJDb2xvciIsIl9kYXJrQ29sb3IiLCJfcXVhZFRyaWFuZ2xlcyIsIkFuaW1hdGlvbkNhY2hlIiwiY2MiLCJDbGFzcyIsImN0b3IiLCJfcHJpdmF0ZU1vZGUiLCJfaW5pdGVkIiwiX2ludmFsaWQiLCJfZW5hYmxlQ2FjaGVBdHRhY2hlZEluZm8iLCJmcmFtZXMiLCJ0b3RhbFRpbWUiLCJfZnJhbWVJZHgiLCJpc0NvbXBsZXRlZCIsIl9za2VsZXRvbkluZm8iLCJfYW5pbWF0aW9uTmFtZSIsIl90ZW1wU2VnbWVudHMiLCJfdGVtcENvbG9ycyIsIl90ZW1wQm9uZUluZm9zIiwiaW5pdCIsInNrZWxldG9uSW5mbyIsImFuaW1hdGlvbk5hbWUiLCJjbGVhciIsImkiLCJuIiwibGVuZ3RoIiwiZnJhbWUiLCJzZWdtZW50cyIsImludmFsaWRBbGxGcmFtZSIsImJpbmQiLCJsaXN0ZW5lciIsImNvbXBsZXRlSGFuZGxlIiwiZW50cnkiLCJhbmltYXRpb24iLCJuYW1lIiwiY29tcGxldGUiLCJ1bmJpbmQiLCJiZWdpbiIsInByZUFuaW1hdGlvbkNhY2hlIiwiY3VyQW5pbWF0aW9uQ2FjaGUiLCJ1cGRhdGVUb0ZyYW1lIiwic2tlbGV0b24iLCJzdGF0ZSIsImRhdGEiLCJmaW5kQW5pbWF0aW9uIiwic2V0QW5pbWF0aW9uV2l0aCIsImVuZCIsIl9uZWVkVG9VcGRhdGUiLCJ0b0ZyYW1lSWR4IiwidW5kZWZpbmVkIiwiY2xpcHBlciIsInVwZGF0ZSIsImFwcGx5IiwidXBkYXRlV29ybGRUcmFuc2Zvcm0iLCJfdXBkYXRlRnJhbWUiLCJpc0luaXRlZCIsImlzSW52YWxpZCIsInVwZGF0ZUFsbEZyYW1lIiwiZW5hYmxlQ2FjaGVBdHRhY2hlZEluZm8iLCJpbmRleCIsImNvbG9ycyIsImJvbmVJbmZvcyIsInZlcnRpY2VzIiwidWludFZlcnQiLCJpbmRpY2VzIiwiX3RyYXZlcnNlU2tlbGV0b24iLCJ2Zk9mZnNldCIsInByZVNlZ09mZnNldCIsInByZVNlZ0luZm8iLCJpbmRleENvdW50IiwidmZDb3VudCIsInZlcnRleENvdW50IiwiRmxvYXQzMkFycmF5IiwiVWludDMyQXJyYXkiLCJidWZmZXIiLCJqIiwiVWludDE2QXJyYXkiLCJmaWxsVmVydGljZXMiLCJza2VsZXRvbkNvbG9yIiwiYXR0YWNobWVudENvbG9yIiwic2xvdENvbG9yIiwic2xvdCIsImEiLCJyIiwiZyIsImIiLCJkYXJrQ29sb3IiLCJzZXQiLCJmciIsImZnIiwiZmIiLCJmYSIsImRyIiwiZGciLCJkYiIsImRhIiwiaXNDbGlwcGluZyIsInYiLCJjbGlwVHJpYW5nbGVzIiwiY2xpcHBlZFZlcnRpY2VzIiwiY2xpcHBlZFRyaWFuZ2xlcyIsImlpIiwiamoiLCJubiIsIm9mZnNldCIsImNvbG9yIiwiYXR0YWNobWVudCIsInV2cyIsInRyaWFuZ2xlcyIsImlzUmVnaW9uIiwiaXNNZXNoIiwiaXNDbGlwIiwidGV4dHVyZSIsImJsZW5kTW9kZSIsImJvbmVzIiwibCIsImJvbmUiLCJib25lSW5mbyIsImMiLCJkIiwid29ybGRYIiwid29ybGRZIiwic2xvdElkeCIsInNsb3RDb3VudCIsImRyYXdPcmRlciIsImdldEF0dGFjaG1lbnQiLCJjbGlwRW5kV2l0aFNsb3QiLCJSZWdpb25BdHRhY2htZW50IiwiTWVzaEF0dGFjaG1lbnQiLCJDbGlwcGluZ0F0dGFjaG1lbnQiLCJjbGlwU3RhcnQiLCJyZWdpb24iLCJfdGV4dHVyZSIsIm5hdGl2ZVVybCIsInRleCIsImNvbXB1dGVXb3JsZFZlcnRpY2VzIiwid29ybGRWZXJ0aWNlc0xlbmd0aCIsInUiLCJjbGlwRW5kIiwiU2tlbGV0b25DYWNoZSIsIl9hbmltYXRpb25Qb29sIiwiX3NrZWxldG9uQ2FjaGUiLCJlbmFibGVQcml2YXRlTW9kZSIsInJlbW92ZVNrZWxldG9uIiwidXVpZCIsImFuaW1hdGlvbnNDYWNoZSIsImFuaUtleSIsImFuaW1hdGlvbkNhY2hlIiwiZ2V0U2tlbGV0b25DYWNoZSIsInNrZWxldG9uRGF0YSIsIlNrZWxldG9uIiwiU2tlbGV0b25DbGlwcGluZyIsInN0YXRlRGF0YSIsIkFuaW1hdGlvblN0YXRlRGF0YSIsIkFuaW1hdGlvblN0YXRlIiwiYWRkTGlzdGVuZXIiLCJnZXRBbmltYXRpb25DYWNoZSIsImludmFsaWRBbmltYXRpb25DYWNoZSIsImluaXRBbmltYXRpb25DYWNoZSIsInBvb2xLZXkiLCJ1cGRhdGVBbmltYXRpb25DYWNoZSIsInNoYXJlZENhY2hlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU1BLG1CQUFtQixHQUFHQyxPQUFPLENBQUMseUJBQUQsQ0FBbkM7O0FBQ0EsSUFBTUMsS0FBSyxHQUFHRCxPQUFPLENBQUMsYUFBRCxD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Q0FBQ3RLLFNBQWQsR0FBMEJBLFNBQTFCO0FBQ0FzSyxhQUFhLENBQUNzQixXQUFkLEdBQTRCLElBQUl0QixhQUFKLEVBQTVCO0FBQ0F1QixNQUFNLENBQUNDLE9BQVAsR0FBaUJ4QixhQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuY29uc3QgVHJhY2tFbnRyeUxpc3RlbmVycyA9IHJlcXVpcmUoJy4vdHJhY2stZW50cnktbGlzdGVuZXJzJyk7XG5jb25zdCBzcGluZSA9IHJlcXVpcmUoJy4vbGliL3NwaW5lJyk7XG4vLyBQZXJtaXQgbWF4IGNhY2hlIHRpbWUsIHVuaXQgaXMgc2Vjb25kLlxuY29uc3QgTWF4Q2FjaGVUaW1lID0gMzA7XG5jb25zdCBGcmFtZVRpbWUgPSAxIC8gNjA7XG5cbmxldCBfdmVydGljZXMgPSBbXTtcbmxldCBfaW5kaWNlcyA9IFtdO1xubGV0IF9ib25lSW5mb09mZnNldCA9IDA7XG5sZXQgX3ZlcnRleE9mZnNldCA9IDA7XG5sZXQgX2luZGV4T2Zmc2V0ID0gMDtcbmxldCBfdmZPZmZzZXQgPSAwO1xubGV0IF9wcmVUZXhVcmwgPSBudWxsO1xubGV0IF9wcmVCbGVuZE1vZGUgPSBudWxsO1xubGV0IF9zZWdWQ291bnQgPSAwO1xubGV0IF9zZWdJQ291bnQgPSAwO1xubGV0IF9zZWdPZmZzZXQgPSAwO1xubGV0IF9jb2xvck9mZnNldCA9IDA7XG5sZXQgX3ByZUZpbmFsQ29sb3IgPSBudWxsO1xubGV0IF9wcmVEYXJrQ29sb3IgPSBudWxsO1xuLy8geCB5IHUgdiBjMSBjMlxubGV0IF9wZXJWZXJ0ZXhTaXplID0gNjtcbi8vIHggeSB1IHYgcjEgZzEgYjEgYTEgcjIgZzIgYjIgYTJcbmxldCBfcGVyQ2xpcFZlcnRleFNpemUgPSAxMjtcbmxldCBfdmZDb3VudCA9IDAsIF9pbmRleENvdW50ID0gMDtcbmxldCBfdGVtcHIsIF90ZW1wZywgX3RlbXBiLCBfdGVtcGE7XG5sZXQgX2ZpbmFsQ29sb3IzMiwgX2RhcmtDb2xvcjMyO1xubGV0IF9maW5hbENvbG9yID0gbmV3IHNwaW5lLkNvbG9yKDEsIDEsIDEsIDEpO1xubGV0IF9kYXJrQ29sb3IgPSBuZXcgc3BpbmUuQ29sb3IoMSwgMSwgMSwgMSk7XG5sZXQgX3F1YWRUcmlhbmdsZXMgPSBbMCwgMSwgMiwgMiwgMywgMF07XG5cbi8vQ2FjaGUgYWxsIGZyYW1lcyBpbiBhbiBhbmltYXRpb25cbmxldCBBbmltYXRpb25DYWNoZSA9IGNjLkNsYXNzKHtcbiAgICBjdG9yICgpIHtcbiAgICAgICAgdGhpcy5fcHJpdmF0ZU1vZGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faW5pdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2ludmFsaWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9lbmFibGVDYWNoZUF0dGFjaGVkSW5mbyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmZyYW1lcyA9IFtdO1xuICAgICAgICB0aGlzLnRvdGFsVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2ZyYW1lSWR4ID0gLTE7XG4gICAgICAgIHRoaXMuaXNDb21wbGV0ZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLl9za2VsZXRvbkluZm8gPSBudWxsO1xuICAgICAgICB0aGlzLl9hbmltYXRpb25OYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5fdGVtcFNlZ21lbnRzID0gbnVsbDtcbiAgICAgICAgdGhpcy5fdGVtcENvbG9ycyA9IG51bGw7XG4gICAgICAgIHRoaXMuX3RlbXBCb25lSW5mb3MgPSBudWxsO1xuICAgIH0sXG5cbiAgICBpbml0IChza2VsZXRvbkluZm8sIGFuaW1hdGlvbk5hbWUpIHtcbiAgICAgICAgdGhpcy5faW5pdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fYW5pbWF0aW9uTmFtZSA9IGFuaW1hdGlvbk5hbWU7XG4gICAgICAgIHRoaXMuX3NrZWxldG9uSW5mbyA9IHNrZWxldG9uSW5mbztcbiAgICB9LFxuXG4gICAgLy8gQ2xlYXIgdGV4dHVyZSBxdW90ZS5cbiAgICBjbGVhciAoKSB7XG4gICAgICAgIHRoaXMuX2luaXRlZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IHRoaXMuZnJhbWVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgbGV0IGZyYW1lID0gdGhpcy5mcmFtZXNbaV07XG4gICAgICAgICAgICBmcmFtZS5zZWdtZW50cy5sZW5ndGggPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW52YWxpZEFsbEZyYW1lKCk7XG4gICAgfSxcblxuICAgIGJpbmQgKGxpc3RlbmVyKSB7XG4gICAgICAgIGxldCBjb21wbGV0ZUhhbmRsZSA9IGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICAgICAgaWYgKGVudHJ5ICYmIGVudHJ5LmFuaW1hdGlvbi5uYW1lID09PSB0aGlzLl9hbmltYXRpb25OYW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0NvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgICBsaXN0ZW5lci5jb21wbGV0ZSA9IGNvbXBsZXRlSGFuZGxlO1xuICAgIH0sXG5cbiAgICB1bmJpbmQgKGxpc3RlbmVyKSB7XG4gICAgICAgIGxpc3RlbmVyLmNvbXBsZXRlID0gbnVsbDtcbiAgICB9LFxuXG4gICAgYmVnaW4gKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2ludmFsaWQpIHJldHVybjtcblxuICAgICAgICBsZXQgc2tlbGV0b25JbmZvID0gdGhpcy5fc2tlbGV0b25JbmZvO1xuICAgICAgICBsZXQgcHJlQW5pbWF0aW9uQ2FjaGUgPSBza2VsZXRvbkluZm8uY3VyQW5pbWF0aW9uQ2FjaGU7XG4gICAgICAgIFxuICAgICAgICBpZiAocHJlQW5pbWF0aW9uQ2FjaGUgJiYgcHJlQW5pbWF0aW9uQ2FjaGUgIT09IHRoaXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9wcml2YXRlTW9kZSkge1xuICAgICAgICAgICAgICAgIC8vIFByaXZhdGUgY2FjaGUgbW9kZSBqdXN0IGludmFsaWQgcHJlIGFuaW1hdGlvbiBmcmFtZS5cbiAgICAgICAgICAgICAgICBwcmVBbmltYXRpb25DYWNoZS5pbnZhbGlkQWxsRnJhbWUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgcHJlIGFuaW1hdGlvbiBub3QgZmluaXNoZWQsIHBsYXkgaXQgdG8gdGhlIGVuZC5cbiAgICAgICAgICAgICAgICBwcmVBbmltYXRpb25DYWNoZS51cGRhdGVUb0ZyYW1lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2tlbGV0b24gPSBza2VsZXRvbkluZm8uc2tlbGV0b247XG4gICAgICAgIGxldCBsaXN0ZW5lciA9IHNrZWxldG9uSW5mby5saXN0ZW5lcjtcbiAgICAgICAgbGV0IHN0YXRlID0gc2tlbGV0b25JbmZvLnN0YXRlO1xuXG4gICAgICAgIGxldCBhbmltYXRpb24gPSBza2VsZXRvbi5kYXRhLmZpbmRBbmltYXRpb24odGhpcy5fYW5pbWF0aW9uTmFtZSk7XG4gICAgICAgIHN0YXRlLnNldEFuaW1hdGlvbldpdGgoMCwgYW5pbWF0aW9uLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuYmluZChsaXN0ZW5lcik7XG5cbiAgICAgICAgLy8gcmVjb3JkIGN1ciBhbmltYXRpb24gY2FjaGVcbiAgICAgICAgc2tlbGV0b25JbmZvLmN1ckFuaW1hdGlvbkNhY2hlID0gdGhpcztcbiAgICAgICAgdGhpcy5fZnJhbWVJZHggPSAtMTtcbiAgICAgICAgdGhpcy5pc0NvbXBsZXRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnRvdGFsVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2ludmFsaWQgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgZW5kICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9uZWVkVG9VcGRhdGUoKSkge1xuICAgICAgICAgICAgLy8gY2xlYXIgY3VyIGFuaW1hdGlvbiBjYWNoZVxuICAgICAgICAgICAgdGhpcy5fc2tlbGV0b25JbmZvLmN1ckFuaW1hdGlvbkNhY2hlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZnJhbWVzLmxlbmd0aCA9IHRoaXMuX2ZyYW1lSWR4ICsgMTtcbiAgICAgICAgICAgIHRoaXMuaXNDb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy51bmJpbmQodGhpcy5fc2tlbGV0b25JbmZvLmxpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfbmVlZFRvVXBkYXRlICh0b0ZyYW1lSWR4KSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5pc0NvbXBsZXRlZCAmJiBcbiAgICAgICAgICAgICAgICB0aGlzLnRvdGFsVGltZSA8IE1heENhY2hlVGltZSAmJiBcbiAgICAgICAgICAgICAgICAodG9GcmFtZUlkeCA9PSB1bmRlZmluZWQgfHwgdGhpcy5fZnJhbWVJZHggPCB0b0ZyYW1lSWR4KTtcbiAgICB9LFxuXG4gICAgdXBkYXRlVG9GcmFtZSAodG9GcmFtZUlkeCkge1xuICAgICAgICBpZiAoIXRoaXMuX2luaXRlZCkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuYmVnaW4oKTtcblxuICAgICAgICBpZiAoIXRoaXMuX25lZWRUb1VwZGF0ZSh0b0ZyYW1lSWR4KSkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBza2VsZXRvbkluZm8gPSB0aGlzLl9za2VsZXRvbkluZm87XG4gICAgICAgIGxldCBza2VsZXRvbiA9IHNrZWxldG9uSW5mby5za2VsZXRvbjtcbiAgICAgICAgbGV0IGNsaXBwZXIgPSBza2VsZXRvbkluZm8uY2xpcHBlcjtcbiAgICAgICAgbGV0IHN0YXRlID0gc2tlbGV0b25JbmZvLnN0YXRlO1xuXG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIC8vIFNvbGlkIHVwZGF0ZSBmcmFtZSByYXRlIDEvNjAuXG4gICAgICAgICAgICBza2VsZXRvbi51cGRhdGUoRnJhbWVUaW1lKTtcbiAgICAgICAgICAgIHN0YXRlLnVwZGF0ZShGcmFtZVRpbWUpO1xuICAgICAgICAgICAgc3RhdGUuYXBwbHkoc2tlbGV0b24pO1xuICAgICAgICAgICAgc2tlbGV0b24udXBkYXRlV29ybGRUcmFuc2Zvcm0oKTtcbiAgICAgICAgICAgIHRoaXMuX2ZyYW1lSWR4Kys7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVGcmFtZShza2VsZXRvbiwgY2xpcHBlciwgdGhpcy5fZnJhbWVJZHgpO1xuICAgICAgICAgICAgdGhpcy50b3RhbFRpbWUgKz0gRnJhbWVUaW1lO1xuICAgICAgICB9IHdoaWxlICh0aGlzLl9uZWVkVG9VcGRhdGUodG9GcmFtZUlkeCkpO1xuXG4gICAgICAgIHRoaXMuZW5kKCk7XG4gICAgfSxcblxuICAgIGlzSW5pdGVkICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luaXRlZDtcbiAgICB9LFxuXG4gICAgaXNJbnZhbGlkICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludmFsaWQ7XG4gICAgfSxcblxuICAgIGludmFsaWRBbGxGcmFtZSAoKSB7XG4gICAgICAgIHRoaXMuaXNDb21wbGV0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faW52YWxpZCA9IHRydWU7XG4gICAgfSxcblxuICAgIHVwZGF0ZUFsbEZyYW1lICgpIHtcbiAgICAgICAgdGhpcy5pbnZhbGlkQWxsRnJhbWUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVUb0ZyYW1lKCk7XG4gICAgfSxcblxuICAgIGVuYWJsZUNhY2hlQXR0YWNoZWRJbmZvICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9lbmFibGVDYWNoZUF0dGFjaGVkSW5mbykge1xuICAgICAgICAgICAgdGhpcy5fZW5hYmxlQ2FjaGVBdHRhY2hlZEluZm8gPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5pbnZhbGlkQWxsRnJhbWUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXBkYXRlRnJhbWUgKHNrZWxldG9uLCBjbGlwcGVyLCBpbmRleCkge1xuICAgICAgICBfdmZPZmZzZXQgPSAwO1xuICAgICAgICBfYm9uZUluZm9PZmZzZXQgPSAwO1xuICAgICAgICBfaW5kZXhPZmZzZXQgPSAwO1xuICAgICAgICBfdmVydGV4T2Zmc2V0ID0gMDtcbiAgICAgICAgX3ByZVRleFVybCA9IG51bGw7XG4gICAgICAgIF9wcmVCbGVuZE1vZGUgPSBudWxsO1xuICAgICAgICBfc2VnVkNvdW50ID0gMDtcbiAgICAgICAgX3NlZ0lDb3VudCA9IDA7XG4gICAgICAgIF9zZWdPZmZzZXQgPSAwO1xuICAgICAgICBfY29sb3JPZmZzZXQgPSAwO1xuICAgICAgICBfcHJlRmluYWxDb2xvciA9IG51bGw7XG4gICAgICAgIF9wcmVEYXJrQ29sb3IgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuZnJhbWVzW2luZGV4XSA9IHRoaXMuZnJhbWVzW2luZGV4XSB8fCB7XG4gICAgICAgICAgICBzZWdtZW50cyA6IFtdLFxuICAgICAgICAgICAgY29sb3JzIDogW10sXG4gICAgICAgICAgICBib25lSW5mb3MgOiBbXSxcbiAgICAgICAgICAgIHZlcnRpY2VzIDogbnVsbCxcbiAgICAgICAgICAgIHVpbnRWZXJ0IDogbnVsbCxcbiAgICAgICAgICAgIGluZGljZXMgOiBudWxsLFxuICAgICAgICB9O1xuICAgICAgICBsZXQgZnJhbWUgPSB0aGlzLmZyYW1lc1tpbmRleF07XG5cbiAgICAgICAgbGV0IHNlZ21lbnRzID0gdGhpcy5fdGVtcFNlZ21lbnRzID0gZnJhbWUuc2VnbWVudHM7XG4gICAgICAgIGxldCBjb2xvcnMgPSB0aGlzLl90ZW1wQ29sb3JzID0gZnJhbWUuY29sb3JzO1xuICAgICAgICBsZXQgYm9uZUluZm9zID0gdGhpcy5fdGVtcEJvbmVJbmZvcyA9IGZyYW1lLmJvbmVJbmZvcztcbiAgICAgICAgdGhpcy5fdHJhdmVyc2VTa2VsZXRvbihza2VsZXRvbiwgY2xpcHBlcik7XG4gICAgICAgIGlmIChfY29sb3JPZmZzZXQgPiAwKSB7XG4gICAgICAgICAgICBjb2xvcnNbX2NvbG9yT2Zmc2V0IC0gMV0udmZPZmZzZXQgPSBfdmZPZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgY29sb3JzLmxlbmd0aCA9IF9jb2xvck9mZnNldDtcbiAgICAgICAgYm9uZUluZm9zLmxlbmd0aCA9IF9ib25lSW5mb09mZnNldDtcbiAgICAgICAgLy8gSGFuZGxlIHByZSBzZWdtZW50LlxuICAgICAgICBsZXQgcHJlU2VnT2Zmc2V0ID0gX3NlZ09mZnNldCAtIDE7XG4gICAgICAgIGlmIChwcmVTZWdPZmZzZXQgPj0gMCkge1xuICAgICAgICAgICAgLy8gSnVkZ2Ugc2VnbWVudCB2ZXJ0ZXggY291bnQgaXMgbm90IGVtcHR5LlxuICAgICAgICAgICAgaWYgKF9zZWdJQ291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IHByZVNlZ0luZm8gPSBzZWdtZW50c1twcmVTZWdPZmZzZXRdO1xuICAgICAgICAgICAgICAgIHByZVNlZ0luZm8uaW5kZXhDb3VudCA9IF9zZWdJQ291bnQ7XG4gICAgICAgICAgICAgICAgcHJlU2VnSW5mby52ZkNvdW50ID0gX3NlZ1ZDb3VudCAqIF9wZXJWZXJ0ZXhTaXplO1xuICAgICAgICAgICAgICAgIHByZVNlZ0luZm8udmVydGV4Q291bnQgPSBfc2VnVkNvdW50O1xuICAgICAgICAgICAgICAgIHNlZ21lbnRzLmxlbmd0aCA9IF9zZWdPZmZzZXQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIERpc2NhcmQgcHJlIHNlZ21lbnQuXG4gICAgICAgICAgICAgICAgc2VnbWVudHMubGVuZ3RoID0gX3NlZ09mZnNldCAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZWdtZW50cyBpcyBlbXB0eSxkaXNjYXJkIGFsbCBzZWdtZW50cy5cbiAgICAgICAgaWYgKHNlZ21lbnRzLmxlbmd0aCA9PSAwKSByZXR1cm47XG5cbiAgICAgICAgLy8gRmlsbCB2ZXJ0aWNlc1xuICAgICAgICBsZXQgdmVydGljZXMgPSBmcmFtZS52ZXJ0aWNlcztcbiAgICAgICAgbGV0IHVpbnRWZXJ0ID0gZnJhbWUudWludFZlcnQ7XG4gICAgICAgIGlmICghdmVydGljZXMgfHwgdmVydGljZXMubGVuZ3RoIDwgX3ZmT2Zmc2V0KSB7XG4gICAgICAgICAgICB2ZXJ0aWNlcyA9IGZyYW1lLnZlcnRpY2VzID0gbmV3IEZsb2F0MzJBcnJheShfdmZPZmZzZXQpO1xuICAgICAgICAgICAgdWludFZlcnQgPSBmcmFtZS51aW50VmVydCA9IG5ldyBVaW50MzJBcnJheSh2ZXJ0aWNlcy5idWZmZXIpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBqID0gMDsgaSA8IF92Zk9mZnNldDspIHtcbiAgICAgICAgICAgIHZlcnRpY2VzW2krK10gPSBfdmVydGljZXNbaisrXTsgLy8geFxuICAgICAgICAgICAgdmVydGljZXNbaSsrXSA9IF92ZXJ0aWNlc1tqKytdOyAvLyB5XG4gICAgICAgICAgICB2ZXJ0aWNlc1tpKytdID0gX3ZlcnRpY2VzW2orK107IC8vIHVcbiAgICAgICAgICAgIHZlcnRpY2VzW2krK10gPSBfdmVydGljZXNbaisrXTsgLy8gdlxuICAgICAgICAgICAgdWludFZlcnRbaSsrXSA9IF92ZXJ0aWNlc1tqKytdOyAvLyBjb2xvcjFcbiAgICAgICAgICAgIHVpbnRWZXJ0W2krK10gPSBfdmVydGljZXNbaisrXTsgLy8gY29sb3IyXG4gICAgICAgIH1cblxuICAgICAgICAvLyBGaWxsIGluZGljZXNcbiAgICAgICAgbGV0IGluZGljZXMgPSBmcmFtZS5pbmRpY2VzO1xuICAgICAgICBpZiAoIWluZGljZXMgfHwgaW5kaWNlcy5sZW5ndGggPCBfaW5kZXhPZmZzZXQpIHtcbiAgICAgICAgICAgIGluZGljZXMgPSBmcmFtZS5pbmRpY2VzID0gbmV3IFVpbnQxNkFycmF5KF9pbmRleE9mZnNldCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IF9pbmRleE9mZnNldDsgaSsrKSB7XG4gICAgICAgICAgICBpbmRpY2VzW2ldID0gX2luZGljZXNbaV07XG4gICAgICAgIH1cblxuICAgICAgICBmcmFtZS52ZXJ0aWNlcyA9IHZlcnRpY2VzO1xuICAgICAgICBmcmFtZS51aW50VmVydCA9IHVpbnRWZXJ0O1xuICAgICAgICBmcmFtZS5pbmRpY2VzID0gaW5kaWNlcztcbiAgICB9LFxuXG4gICAgZmlsbFZlcnRpY2VzIChza2VsZXRvbkNvbG9yLCBhdHRhY2htZW50Q29sb3IsIHNsb3RDb2xvciwgY2xpcHBlciwgc2xvdCkge1xuXG4gICAgICAgIF90ZW1wYSA9IHNsb3RDb2xvci5hICogYXR0YWNobWVudENvbG9yLmEgKiBza2VsZXRvbkNvbG9yLmEgKiAyNTU7XG4gICAgICAgIF90ZW1wciA9IGF0dGFjaG1lbnRDb2xvci5yICogc2tlbGV0b25Db2xvci5yICogMjU1O1xuICAgICAgICBfdGVtcGcgPSBhdHRhY2htZW50Q29sb3IuZyAqIHNrZWxldG9uQ29sb3IuZyAqIDI1NTtcbiAgICAgICAgX3RlbXBiID0gYXR0YWNobWVudENvbG9yLmIgKiBza2VsZXRvbkNvbG9yLmIgKiAyNTU7XG4gICAgICAgIFxuICAgICAgICBfZmluYWxDb2xvci5yID0gX3RlbXByICogc2xvdENvbG9yLnI7XG4gICAgICAgIF9maW5hbENvbG9yLmcgPSBfdGVtcGcgKiBzbG90Q29sb3IuZztcbiAgICAgICAgX2ZpbmFsQ29sb3IuYiA9IF90ZW1wYiAqIHNsb3RDb2xvci5iO1xuICAgICAgICBfZmluYWxDb2xvci5hID0gX3RlbXBhO1xuXG4gICAgICAgIGlmIChzbG90LmRhcmtDb2xvciA9PSBudWxsKSB7XG4gICAgICAgICAgICBfZGFya0NvbG9yLnNldCgwLjAsIDAsIDAsIDEuMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfZGFya0NvbG9yLnIgPSBzbG90LmRhcmtDb2xvci5yICogX3RlbXByO1xuICAgICAgICAgICAgX2RhcmtDb2xvci5nID0gc2xvdC5kYXJrQ29sb3IuZyAqIF90ZW1wZztcbiAgICAgICAgICAgIF9kYXJrQ29sb3IuYiA9IHNsb3QuZGFya0NvbG9yLmIgKiBfdGVtcGI7XG4gICAgICAgIH1cbiAgICAgICAgX2RhcmtDb2xvci5hID0gMDtcblxuICAgICAgICBfZmluYWxDb2xvcjMyID0gKChfZmluYWxDb2xvci5hPDwyNCkgPj4+IDApICsgKF9maW5hbENvbG9yLmI8PDE2KSArIChfZmluYWxDb2xvci5nPDw4KSArIF9maW5hbENvbG9yLnI7XG4gICAgICAgIF9kYXJrQ29sb3IzMiA9ICgoX2RhcmtDb2xvci5hPDwyNCkgPj4+IDApICsgKF9kYXJrQ29sb3IuYjw8MTYpICsgKF9kYXJrQ29sb3IuZzw8OCkgKyBfZGFya0NvbG9yLnI7XG5cbiAgICAgICAgaWYgKF9wcmVGaW5hbENvbG9yICE9PSBfZmluYWxDb2xvcjMyIHx8IF9wcmVEYXJrQ29sb3IgIT09IF9kYXJrQ29sb3IzMikge1xuICAgICAgICAgICAgbGV0IGNvbG9ycyA9IHRoaXMuX3RlbXBDb2xvcnM7XG4gICAgICAgICAgICBfcHJlRmluYWxDb2xvciA9IF9maW5hbENvbG9yMzI7XG4gICAgICAgICAgICBfcHJlRGFya0NvbG9yID0gX2RhcmtDb2xvcjMyO1xuICAgICAgICAgICAgaWYgKF9jb2xvck9mZnNldCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb2xvcnNbX2NvbG9yT2Zmc2V0IC0gMV0udmZPZmZzZXQgPSBfdmZPZmZzZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb2xvcnNbX2NvbG9yT2Zmc2V0KytdID0ge1xuICAgICAgICAgICAgICAgIGZyIDogX2ZpbmFsQ29sb3IucixcbiAgICAgICAgICAgICAgICBmZyA6IF9maW5hbENvbG9yLmcsXG4gICAgICAgICAgICAgICAgZmIgOiBfZmluYWxDb2xvci5iLFxuICAgICAgICAgICAgICAgIGZhIDogX2ZpbmFsQ29sb3IuYSxcbiAgICAgICAgICAgICAgICBkciA6IF9kYXJrQ29sb3IucixcbiAgICAgICAgICAgICAgICBkZyA6IF9kYXJrQ29sb3IuZyxcbiAgICAgICAgICAgICAgICBkYiA6IF9kYXJrQ29sb3IuYixcbiAgICAgICAgICAgICAgICBkYSA6IF9kYXJrQ29sb3IuYSxcbiAgICAgICAgICAgICAgICB2Zk9mZnNldCA6IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY2xpcHBlci5pc0NsaXBwaW5nKCkpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yIChsZXQgdiA9IF92Zk9mZnNldCwgbiA9IF92Zk9mZnNldCArIF92ZkNvdW50OyB2IDwgbjsgdiArPSBfcGVyVmVydGV4U2l6ZSkge1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1t2ICsgNF0gID0gX2ZpbmFsQ29sb3IzMjsgICAgIC8vIGxpZ2h0IGNvbG9yXG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzW3YgKyA1XSAgPSBfZGFya0NvbG9yMzI7ICAgICAgLy8gZGFyayBjb2xvclxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbGlwcGVyLmNsaXBUcmlhbmdsZXMoX3ZlcnRpY2VzLCBfdmZDb3VudCwgX2luZGljZXMsIF9pbmRleENvdW50LCBfdmVydGljZXMsIF9maW5hbENvbG9yLCBfZGFya0NvbG9yLCB0cnVlLCBfcGVyVmVydGV4U2l6ZSwgX2luZGV4T2Zmc2V0LCBfdmZPZmZzZXQsIF92Zk9mZnNldCArIDIpO1xuICAgICAgICAgICAgbGV0IGNsaXBwZWRWZXJ0aWNlcyA9IGNsaXBwZXIuY2xpcHBlZFZlcnRpY2VzO1xuICAgICAgICAgICAgbGV0IGNsaXBwZWRUcmlhbmdsZXMgPSBjbGlwcGVyLmNsaXBwZWRUcmlhbmdsZXM7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGluc3VyZSBjYXBhY2l0eVxuICAgICAgICAgICAgX2luZGV4Q291bnQgPSBjbGlwcGVkVHJpYW5nbGVzLmxlbmd0aDtcbiAgICAgICAgICAgIF92ZkNvdW50ID0gY2xpcHBlZFZlcnRpY2VzLmxlbmd0aCAvIF9wZXJDbGlwVmVydGV4U2l6ZSAqIF9wZXJWZXJ0ZXhTaXplO1xuXG4gICAgICAgICAgICAvLyBmaWxsIGluZGljZXNcbiAgICAgICAgICAgIGZvciAobGV0IGlpID0gMCwgamogPSBfaW5kZXhPZmZzZXQsIG5uID0gY2xpcHBlZFRyaWFuZ2xlcy5sZW5ndGg7IGlpIDwgbm47KSB7XG4gICAgICAgICAgICAgICAgX2luZGljZXNbamorK10gPSBjbGlwcGVkVHJpYW5nbGVzW2lpKytdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmaWxsIHZlcnRpY2VzIGNvbnRhaW4geCB5IHUgdiBsaWdodCBjb2xvciBkYXJrIGNvbG9yXG4gICAgICAgICAgICBmb3IgKGxldCB2ID0gMCwgbiA9IGNsaXBwZWRWZXJ0aWNlcy5sZW5ndGgsIG9mZnNldCA9IF92Zk9mZnNldDsgdiA8IG47IHYgKz0gMTIsIG9mZnNldCArPSBfcGVyVmVydGV4U2l6ZSkge1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1tvZmZzZXRdID0gY2xpcHBlZFZlcnRpY2VzW3ZdOyAgICAgICAgICAgICAgICAgLy8geFxuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1tvZmZzZXQgKyAxXSA9IGNsaXBwZWRWZXJ0aWNlc1t2ICsgMV07ICAgICAgICAgLy8geVxuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1tvZmZzZXQgKyAyXSA9IGNsaXBwZWRWZXJ0aWNlc1t2ICsgNl07ICAgICAgICAgLy8gdVxuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1tvZmZzZXQgKyAzXSA9IGNsaXBwZWRWZXJ0aWNlc1t2ICsgN107ICAgICAgICAgLy8gdlxuXG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzW29mZnNldCArIDRdID0gX2ZpbmFsQ29sb3IzMjtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbb2Zmc2V0ICsgNV0gPSBfZGFya0NvbG9yMzI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3RyYXZlcnNlU2tlbGV0b24gKHNrZWxldG9uLCBjbGlwcGVyKSB7XG4gICAgICAgIGxldCBzZWdtZW50cyA9IHRoaXMuX3RlbXBTZWdtZW50cztcbiAgICAgICAgbGV0IGJvbmVJbmZvcyA9IHRoaXMuX3RlbXBCb25lSW5mb3M7XG4gICAgICAgIGxldCBza2VsZXRvbkNvbG9yID0gc2tlbGV0b24uY29sb3I7XG4gICAgICAgIGxldCBhdHRhY2htZW50LCBhdHRhY2htZW50Q29sb3IsIHNsb3RDb2xvciwgdXZzLCB0cmlhbmdsZXM7XG4gICAgICAgIGxldCBpc1JlZ2lvbiwgaXNNZXNoLCBpc0NsaXA7XG4gICAgICAgIGxldCB0ZXh0dXJlO1xuICAgICAgICBsZXQgcHJlU2VnT2Zmc2V0LCBwcmVTZWdJbmZvO1xuICAgICAgICBsZXQgYmxlbmRNb2RlO1xuICAgICAgICBsZXQgc2xvdDtcblxuICAgICAgICBsZXQgYm9uZXMgPSBza2VsZXRvbi5ib25lcztcbiAgICAgICAgaWYgKHRoaXMuX2VuYWJsZUNhY2hlQXR0YWNoZWRJbmZvKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGJvbmVzLmxlbmd0aDsgaSA8IGw7IGkrKywgX2JvbmVJbmZvT2Zmc2V0KyspIHtcbiAgICAgICAgICAgICAgICBsZXQgYm9uZSA9IGJvbmVzW2ldO1xuICAgICAgICAgICAgICAgIGxldCBib25lSW5mbyA9IGJvbmVJbmZvc1tfYm9uZUluZm9PZmZzZXRdO1xuICAgICAgICAgICAgICAgIGlmICghYm9uZUluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgYm9uZUluZm8gPSBib25lSW5mb3NbX2JvbmVJbmZvT2Zmc2V0XSA9IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBib25lSW5mby5hID0gYm9uZS5hO1xuICAgICAgICAgICAgICAgIGJvbmVJbmZvLmIgPSBib25lLmI7XG4gICAgICAgICAgICAgICAgYm9uZUluZm8uYyA9IGJvbmUuYztcbiAgICAgICAgICAgICAgICBib25lSW5mby5kID0gYm9uZS5kO1xuICAgICAgICAgICAgICAgIGJvbmVJbmZvLndvcmxkWCA9IGJvbmUud29ybGRYO1xuICAgICAgICAgICAgICAgIGJvbmVJbmZvLndvcmxkWSA9IGJvbmUud29ybGRZO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgc2xvdElkeCA9IDAsIHNsb3RDb3VudCA9IHNrZWxldG9uLmRyYXdPcmRlci5sZW5ndGg7IHNsb3RJZHggPCBzbG90Q291bnQ7IHNsb3RJZHgrKykge1xuICAgICAgICAgICAgc2xvdCA9IHNrZWxldG9uLmRyYXdPcmRlcltzbG90SWR4XTtcbiAgICBcbiAgICAgICAgICAgIF92ZkNvdW50ID0gMDtcbiAgICAgICAgICAgIF9pbmRleENvdW50ID0gMDtcblxuICAgICAgICAgICAgYXR0YWNobWVudCA9IHNsb3QuZ2V0QXR0YWNobWVudCgpO1xuICAgICAgICAgICAgaWYgKCFhdHRhY2htZW50KSB7XG4gICAgICAgICAgICAgICAgY2xpcHBlci5jbGlwRW5kV2l0aFNsb3Qoc2xvdCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlzUmVnaW9uID0gYXR0YWNobWVudCBpbnN0YW5jZW9mIHNwaW5lLlJlZ2lvbkF0dGFjaG1lbnQ7XG4gICAgICAgICAgICBpc01lc2ggPSBhdHRhY2htZW50IGluc3RhbmNlb2Ygc3BpbmUuTWVzaEF0dGFjaG1lbnQ7XG4gICAgICAgICAgICBpc0NsaXAgPSBhdHRhY2htZW50IGluc3RhbmNlb2Ygc3BpbmUuQ2xpcHBpbmdBdHRhY2htZW50O1xuXG4gICAgICAgICAgICBpZiAoaXNDbGlwKSB7XG4gICAgICAgICAgICAgICAgY2xpcHBlci5jbGlwU3RhcnQoc2xvdCwgYXR0YWNobWVudCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaXNSZWdpb24gJiYgIWlzTWVzaCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0ZXh0dXJlID0gYXR0YWNobWVudC5yZWdpb24udGV4dHVyZS5fdGV4dHVyZTtcbiAgICAgICAgICAgIGlmICghdGV4dHVyZSkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgYmxlbmRNb2RlID0gc2xvdC5kYXRhLmJsZW5kTW9kZTtcbiAgICAgICAgICAgIGlmIChfcHJlVGV4VXJsICE9PSB0ZXh0dXJlLm5hdGl2ZVVybCB8fCBfcHJlQmxlbmRNb2RlICE9PSBibGVuZE1vZGUpIHtcbiAgICAgICAgICAgICAgICBfcHJlVGV4VXJsID0gdGV4dHVyZS5uYXRpdmVVcmw7XG4gICAgICAgICAgICAgICAgX3ByZUJsZW5kTW9kZSA9IGJsZW5kTW9kZTtcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgcHJlIHNlZ21lbnQuXG4gICAgICAgICAgICAgICAgcHJlU2VnT2Zmc2V0ID0gX3NlZ09mZnNldCAtIDE7XG4gICAgICAgICAgICAgICAgaWYgKHByZVNlZ09mZnNldCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfc2VnSUNvdW50ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlU2VnSW5mbyA9IHNlZ21lbnRzW3ByZVNlZ09mZnNldF07XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVTZWdJbmZvLmluZGV4Q291bnQgPSBfc2VnSUNvdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlU2VnSW5mby52ZXJ0ZXhDb3VudCA9IF9zZWdWQ291bnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVTZWdJbmZvLnZmQ291bnQgPSBfc2VnVkNvdW50ICogX3BlclZlcnRleFNpemU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBEaXNjYXJkIHByZSBzZWdtZW50LlxuICAgICAgICAgICAgICAgICAgICAgICAgX3NlZ09mZnNldC0tO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBub3cgc2VnbWVudC5cbiAgICAgICAgICAgICAgICBzZWdtZW50c1tfc2VnT2Zmc2V0XSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdGV4IDogdGV4dHVyZSxcbiAgICAgICAgICAgICAgICAgICAgYmxlbmRNb2RlIDogYmxlbmRNb2RlLFxuICAgICAgICAgICAgICAgICAgICBpbmRleENvdW50IDogMCxcbiAgICAgICAgICAgICAgICAgICAgdmVydGV4Q291bnQgOiAwLFxuICAgICAgICAgICAgICAgICAgICB2ZkNvdW50IDogMFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgX3NlZ09mZnNldCsrO1xuICAgICAgICAgICAgICAgIF9zZWdJQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgIF9zZWdWQ291bnQgPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaXNSZWdpb24pIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0cmlhbmdsZXMgPSBfcXVhZFRyaWFuZ2xlcztcbiAgICBcbiAgICAgICAgICAgICAgICAvLyBpbnN1cmUgY2FwYWNpdHlcbiAgICAgICAgICAgICAgICBfdmZDb3VudCA9IDQgKiBfcGVyVmVydGV4U2l6ZTtcbiAgICAgICAgICAgICAgICBfaW5kZXhDb3VudCA9IDY7XG4gICAgXG4gICAgICAgICAgICAgICAgLy8gY29tcHV0ZSB2ZXJ0ZXggYW5kIGZpbGwgeCB5XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudC5jb21wdXRlV29ybGRWZXJ0aWNlcyhzbG90LmJvbmUsIF92ZXJ0aWNlcywgX3ZmT2Zmc2V0LCBfcGVyVmVydGV4U2l6ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc01lc2gpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0cmlhbmdsZXMgPSBhdHRhY2htZW50LnRyaWFuZ2xlcztcbiAgICBcbiAgICAgICAgICAgICAgICAvLyBpbnN1cmUgY2FwYWNpdHlcbiAgICAgICAgICAgICAgICBfdmZDb3VudCA9IChhdHRhY2htZW50LndvcmxkVmVydGljZXNMZW5ndGggPj4gMSkgKiBfcGVyVmVydGV4U2l6ZTtcbiAgICAgICAgICAgICAgICBfaW5kZXhDb3VudCA9IHRyaWFuZ2xlcy5sZW5ndGg7XG4gICAgXG4gICAgICAgICAgICAgICAgLy8gY29tcHV0ZSB2ZXJ0ZXggYW5kIGZpbGwgeCB5XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudC5jb21wdXRlV29ybGRWZXJ0aWNlcyhzbG90LCAwLCBhdHRhY2htZW50LndvcmxkVmVydGljZXNMZW5ndGgsIF92ZXJ0aWNlcywgX3ZmT2Zmc2V0LCBfcGVyVmVydGV4U2l6ZSk7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICBpZiAoX3ZmQ291bnQgPT0gMCB8fCBfaW5kZXhDb3VudCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgY2xpcHBlci5jbGlwRW5kV2l0aFNsb3Qoc2xvdCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICAvLyBmaWxsIGluZGljZXNcbiAgICAgICAgICAgIGZvciAobGV0IGlpID0gMCwgamogPSBfaW5kZXhPZmZzZXQsIG5uID0gdHJpYW5nbGVzLmxlbmd0aDsgaWkgPCBubjspIHtcbiAgICAgICAgICAgICAgICBfaW5kaWNlc1tqaisrXSA9IHRyaWFuZ2xlc1tpaSsrXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZmlsbCB1IHZcbiAgICAgICAgICAgIHV2cyA9IGF0dGFjaG1lbnQudXZzO1xuICAgICAgICAgICAgZm9yIChsZXQgdiA9IF92Zk9mZnNldCwgbiA9IF92Zk9mZnNldCArIF92ZkNvdW50LCB1ID0gMDsgdiA8IG47IHYgKz0gX3BlclZlcnRleFNpemUsIHUgKz0gMikge1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1t2ICsgMl0gPSB1dnNbdV07ICAgICAgICAgICAvLyB1XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzW3YgKyAzXSA9IHV2c1t1ICsgMV07ICAgICAgIC8vIHZcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXR0YWNobWVudENvbG9yID0gYXR0YWNobWVudC5jb2xvcjtcbiAgICAgICAgICAgIHNsb3RDb2xvciA9IHNsb3QuY29sb3I7XG5cbiAgICAgICAgICAgIHRoaXMuZmlsbFZlcnRpY2VzKHNrZWxldG9uQ29sb3IsIGF0dGFjaG1lbnRDb2xvciwgc2xvdENvbG9yLCBjbGlwcGVyLCBzbG90KTtcbiAgICBcbiAgICAgICAgICAgIGlmIChfaW5kZXhDb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpaSA9IF9pbmRleE9mZnNldCwgbm4gPSBfaW5kZXhPZmZzZXQgKyBfaW5kZXhDb3VudDsgaWkgPCBubjsgaWkrKykge1xuICAgICAgICAgICAgICAgICAgICBfaW5kaWNlc1tpaV0gKz0gX3NlZ1ZDb3VudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX2luZGV4T2Zmc2V0ICs9IF9pbmRleENvdW50O1xuICAgICAgICAgICAgICAgIF92Zk9mZnNldCArPSBfdmZDb3VudDtcbiAgICAgICAgICAgICAgICBfdmVydGV4T2Zmc2V0ID0gX3ZmT2Zmc2V0IC8gX3BlclZlcnRleFNpemU7XG4gICAgICAgICAgICAgICAgX3NlZ0lDb3VudCArPSBfaW5kZXhDb3VudDtcbiAgICAgICAgICAgICAgICBfc2VnVkNvdW50ICs9IF92ZkNvdW50IC8gX3BlclZlcnRleFNpemU7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICBjbGlwcGVyLmNsaXBFbmRXaXRoU2xvdChzbG90KTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBjbGlwcGVyLmNsaXBFbmQoKTtcbiAgICB9XG59KTtcblxubGV0IFNrZWxldG9uQ2FjaGUgPSBjYy5DbGFzcyh7XG4gICAgY3RvciAoKSB7XG4gICAgICAgIHRoaXMuX3ByaXZhdGVNb2RlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2FuaW1hdGlvblBvb2wgPSB7fTtcbiAgICAgICAgdGhpcy5fc2tlbGV0b25DYWNoZSA9IHt9O1xuICAgIH0sXG5cbiAgICBlbmFibGVQcml2YXRlTW9kZSAoKSB7XG4gICAgICAgIHRoaXMuX3ByaXZhdGVNb2RlID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgY2xlYXIgKCkge1xuICAgICAgICB0aGlzLl9hbmltYXRpb25Qb29sID0ge307XG4gICAgICAgIHRoaXMuX3NrZWxldG9uQ2FjaGUgPSB7fTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlU2tlbGV0b24gKHV1aWQpIHtcbiAgICAgICAgdmFyIHNrZWxldG9uSW5mbyA9IHRoaXMuX3NrZWxldG9uQ2FjaGVbdXVpZF07XG4gICAgICAgIGlmICghc2tlbGV0b25JbmZvKSByZXR1cm47XG4gICAgICAgIGxldCBhbmltYXRpb25zQ2FjaGUgPSBza2VsZXRvbkluZm8uYW5pbWF0aW9uc0NhY2hlO1xuICAgICAgICBmb3IgKHZhciBhbmlLZXkgaW4gYW5pbWF0aW9uc0NhY2hlKSB7XG4gICAgICAgICAgICAvLyBDbGVhciBjYWNoZSB0ZXh0dXJlLCBhbmQgcHV0IGNhY2hlIGludG8gcG9vbC5cbiAgICAgICAgICAgIC8vIE5vIG5lZWQgdG8gY3JlYXRlIFR5cGVkQXJyYXkgbmV4dCB0aW1lLlxuICAgICAgICAgICAgbGV0IGFuaW1hdGlvbkNhY2hlID0gYW5pbWF0aW9uc0NhY2hlW2FuaUtleV07XG4gICAgICAgICAgICBpZiAoIWFuaW1hdGlvbkNhY2hlKSBjb250aW51ZTtcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hdGlvblBvb2xbdXVpZCArIFwiI1wiICsgYW5pS2V5XSA9IGFuaW1hdGlvbkNhY2hlO1xuICAgICAgICAgICAgYW5pbWF0aW9uQ2FjaGUuY2xlYXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9za2VsZXRvbkNhY2hlW3V1aWRdO1xuICAgIH0sXG5cbiAgICBnZXRTa2VsZXRvbkNhY2hlICh1dWlkLCBza2VsZXRvbkRhdGEpIHtcbiAgICAgICAgbGV0IHNrZWxldG9uSW5mbyA9IHRoaXMuX3NrZWxldG9uQ2FjaGVbdXVpZF07XG4gICAgICAgIGlmICghc2tlbGV0b25JbmZvKSB7XG4gICAgICAgICAgICBsZXQgc2tlbGV0b24gPSBuZXcgc3BpbmUuU2tlbGV0b24oc2tlbGV0b25EYXRhKTtcbiAgICAgICAgICAgIGxldCBjbGlwcGVyID0gbmV3IHNwaW5lLlNrZWxldG9uQ2xpcHBpbmcoKTtcbiAgICAgICAgICAgIGxldCBzdGF0ZURhdGEgPSBuZXcgc3BpbmUuQW5pbWF0aW9uU3RhdGVEYXRhKHNrZWxldG9uLmRhdGEpO1xuICAgICAgICAgICAgbGV0IHN0YXRlID0gbmV3IHNwaW5lLkFuaW1hdGlvblN0YXRlKHN0YXRlRGF0YSk7XG4gICAgICAgICAgICBsZXQgbGlzdGVuZXIgPSBuZXcgVHJhY2tFbnRyeUxpc3RlbmVycygpO1xuICAgICAgICAgICAgc3RhdGUuYWRkTGlzdGVuZXIobGlzdGVuZXIpO1xuXG4gICAgICAgICAgICB0aGlzLl9za2VsZXRvbkNhY2hlW3V1aWRdID0gc2tlbGV0b25JbmZvID0ge1xuICAgICAgICAgICAgICAgIHNrZWxldG9uIDogc2tlbGV0b24sXG4gICAgICAgICAgICAgICAgY2xpcHBlciA6IGNsaXBwZXIsXG4gICAgICAgICAgICAgICAgc3RhdGUgOiBzdGF0ZSxcbiAgICAgICAgICAgICAgICBsaXN0ZW5lciA6IGxpc3RlbmVyLFxuICAgICAgICAgICAgICAgIC8vIENhY2hlIGFsbCBraW5kcyBvZiBhbmltYXRpb24gZnJhbWUuXG4gICAgICAgICAgICAgICAgLy8gV2hlbiBza2VsZXRvbiBpcyBkaXNwb3NlLCBjbGVhciBhbGwgYW5pbWF0aW9uIGNhY2hlLlxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbnNDYWNoZSA6IHt9LFxuICAgICAgICAgICAgICAgIGN1ckFuaW1hdGlvbkNhY2hlOiBudWxsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBza2VsZXRvbkluZm87XG4gICAgfSxcblxuICAgIGdldEFuaW1hdGlvbkNhY2hlICh1dWlkLCBhbmltYXRpb25OYW1lKSB7XG4gICAgICAgIGxldCBza2VsZXRvbkluZm8gPSB0aGlzLl9za2VsZXRvbkNhY2hlW3V1aWRdO1xuICAgICAgICBpZiAoIXNrZWxldG9uSW5mbykgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgbGV0IGFuaW1hdGlvbnNDYWNoZSA9IHNrZWxldG9uSW5mby5hbmltYXRpb25zQ2FjaGU7XG4gICAgICAgIHJldHVybiBhbmltYXRpb25zQ2FjaGVbYW5pbWF0aW9uTmFtZV07XG4gICAgfSxcblxuICAgIGludmFsaWRBbmltYXRpb25DYWNoZSAodXVpZCkge1xuICAgICAgICBsZXQgc2tlbGV0b25JbmZvID0gdGhpcy5fc2tlbGV0b25DYWNoZVt1dWlkXTtcbiAgICAgICAgbGV0IHNrZWxldG9uID0gc2tlbGV0b25JbmZvICYmIHNrZWxldG9uSW5mby5za2VsZXRvbjtcbiAgICAgICAgaWYgKCFza2VsZXRvbikgcmV0dXJuO1xuXG4gICAgICAgIGxldCBhbmltYXRpb25zQ2FjaGUgPSBza2VsZXRvbkluZm8uYW5pbWF0aW9uc0NhY2hlO1xuICAgICAgICBmb3IgKHZhciBhbmlLZXkgaW4gYW5pbWF0aW9uc0NhY2hlKSB7XG4gICAgICAgICAgICBsZXQgYW5pbWF0aW9uQ2FjaGUgPSBhbmltYXRpb25zQ2FjaGVbYW5pS2V5XTtcbiAgICAgICAgICAgIGFuaW1hdGlvbkNhY2hlLmludmFsaWRBbGxGcmFtZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGluaXRBbmltYXRpb25DYWNoZSAodXVpZCwgYW5pbWF0aW9uTmFtZSkge1xuICAgICAgICBpZiAoIWFuaW1hdGlvbk5hbWUpIHJldHVybiBudWxsO1xuICAgICAgICBsZXQgc2tlbGV0b25JbmZvID0gdGhpcy5fc2tlbGV0b25DYWNoZVt1dWlkXTtcbiAgICAgICAgbGV0IHNrZWxldG9uID0gc2tlbGV0b25JbmZvICYmIHNrZWxldG9uSW5mby5za2VsZXRvbjtcbiAgICAgICAgaWYgKCFza2VsZXRvbikgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgbGV0IGFuaW1hdGlvbiA9IHNrZWxldG9uLmRhdGEuZmluZEFuaW1hdGlvbihhbmltYXRpb25OYW1lKTtcbiAgICAgICAgaWYgKCFhbmltYXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGFuaW1hdGlvbnNDYWNoZSA9IHNrZWxldG9uSW5mby5hbmltYXRpb25zQ2FjaGU7XG4gICAgICAgIGxldCBhbmltYXRpb25DYWNoZSA9IGFuaW1hdGlvbnNDYWNoZVthbmltYXRpb25OYW1lXTtcbiAgICAgICAgaWYgKCFhbmltYXRpb25DYWNoZSkge1xuICAgICAgICAgICAgLy8gSWYgY2FjaGUgZXhpc3QgaW4gcG9vbCwgdGhlbiBqdXN0IHVzZSBpdC5cbiAgICAgICAgICAgIGxldCBwb29sS2V5ID0gdXVpZCArIFwiI1wiICsgYW5pbWF0aW9uTmFtZTtcbiAgICAgICAgICAgIGFuaW1hdGlvbkNhY2hlID0gdGhpcy5fYW5pbWF0aW9uUG9vbFtwb29sS2V5XTtcbiAgICAgICAgICAgIGlmIChhbmltYXRpb25DYWNoZSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9hbmltYXRpb25Qb29sW3Bvb2xLZXldO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb25DYWNoZSA9IG5ldyBBbmltYXRpb25DYWNoZSgpO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbkNhY2hlLl9wcml2YXRlTW9kZSA9IHRoaXMuX3ByaXZhdGVNb2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYW5pbWF0aW9uQ2FjaGUuaW5pdChza2VsZXRvbkluZm8sIGFuaW1hdGlvbk5hbWUpO1xuICAgICAgICAgICAgYW5pbWF0aW9uc0NhY2hlW2FuaW1hdGlvbk5hbWVdID0gYW5pbWF0aW9uQ2FjaGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFuaW1hdGlvbkNhY2hlO1xuICAgIH0sXG5cbiAgICB1cGRhdGVBbmltYXRpb25DYWNoZSAodXVpZCwgYW5pbWF0aW9uTmFtZSkge1xuICAgICAgICBpZiAoYW5pbWF0aW9uTmFtZSkge1xuICAgICAgICAgICAgbGV0IGFuaW1hdGlvbkNhY2hlID0gdGhpcy5pbml0QW5pbWF0aW9uQ2FjaGUodXVpZCwgYW5pbWF0aW9uTmFtZSk7XG4gICAgICAgICAgICBpZiAoIWFuaW1hdGlvbkNhY2hlKSByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIGFuaW1hdGlvbkNhY2hlLnVwZGF0ZUFsbEZyYW1lKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgc2tlbGV0b25JbmZvID0gdGhpcy5fc2tlbGV0b25DYWNoZVt1dWlkXTtcbiAgICAgICAgICAgIGxldCBza2VsZXRvbiA9IHNrZWxldG9uSW5mbyAmJiBza2VsZXRvbkluZm8uc2tlbGV0b247XG4gICAgICAgICAgICBpZiAoIXNrZWxldG9uKSByZXR1cm47XG5cbiAgICAgICAgICAgIGxldCBhbmltYXRpb25zQ2FjaGUgPSBza2VsZXRvbkluZm8uYW5pbWF0aW9uc0NhY2hlO1xuICAgICAgICAgICAgZm9yICh2YXIgYW5pS2V5IGluIGFuaW1hdGlvbnNDYWNoZSkge1xuICAgICAgICAgICAgICAgIGxldCBhbmltYXRpb25DYWNoZSA9IGFuaW1hdGlvbnNDYWNoZVthbmlLZXldO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbkNhY2hlLnVwZGF0ZUFsbEZyYW1lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuU2tlbGV0b25DYWNoZS5GcmFtZVRpbWUgPSBGcmFtZVRpbWU7XG5Ta2VsZXRvbkNhY2hlLnNoYXJlZENhY2hlID0gbmV3IFNrZWxldG9uQ2FjaGUoKTtcbm1vZHVsZS5leHBvcnRzID0gU2tlbGV0b25DYWNoZTsiXSwic291cmNlUm9vdCI6Ii8ifQ==