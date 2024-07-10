
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
    // var skeletonInfo = this._skeletonCache[uuid];
    // if (!skeletonInfo) return;
    // let animationsCache = skeletonInfo.animationsCache;
    // for (var aniKey in animationsCache) {
    //     // Clear cache texture, and put cache into pool.
    //     // No need to create TypedArray next time.
    //     let animationCache = animationsCache[aniKey];
    //     if (!animationCache) continue;
    //     this._animationPool[uuid + "#" + aniKey] = animationCache;
    //     animationCache.clear();
    // }
    // delete this._skeletonCache[uuid];
    // wangcheng 修复共享缓存清理不干净的问题
    var skeletonInfo;

    for (var k in this._skeletonCache) {
      var _uuid = k.split('_')[0];

      if (_uuid == uuid) {
        skeletonInfo = this._skeletonCache[k];
        if (!skeletonInfo) continue;
        var animationsCache = skeletonInfo.animationsCache;

        for (var aniKey in animationsCache) {
          // Clear cache texture, and put cache into pool.
          // No need to create TypedArray next time.
          var animationCache = animationsCache[aniKey];
          if (!animationCache) continue;
          this._animationPool[_uuid + "#" + aniKey] = animationCache;
          animationCache.clear();
        }

        delete this._skeletonCache[k];
      }
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvZXh0ZW5zaW9ucy9zcGluZS9za2VsZXRvbi1jYWNoZS5qcyJdLCJuYW1lcyI6WyJUcmFja0VudHJ5TGlzdGVuZXJzIiwicmVxdWlyZSIsInNwaW5lIiwiTWF4Q2FjaGVUaW1lIiwiRnJhbWVUaW1lIiwiX3ZlcnRpY2VzIiwiX2luZGljZXMiLCJfYm9uZUluZm9PZmZzZXQiLCJfdmVydGV4T2Zmc2V0IiwiX2luZGV4T2Zmc2V0IiwiX3ZmT2Zmc2V0IiwiX3ByZVRleFVybCIsIl9wcmVCbGVuZE1vZGUiLCJfc2VnVkNvdW50IiwiX3NlZ0lDb3VudCIsIl9zZWdPZmZzZXQiLCJfY29sb3JPZmZzZXQiLCJfcHJlRmluYWxDb2xvciIsIl9wcmVEYXJrQ29sb3IiLCJfcGVyVmVydGV4U2l6ZSIsIl9wZXJDbGlwVmVydGV4U2l6ZSIsIl92ZkNvdW50IiwiX2luZGV4Q291bnQiLCJfdGVtcHIiLCJfdGVtcGciLCJfdGVtcGIiLCJfdGVtcGEiLCJfZmluYWxDb2xvcjMyIiwiX2RhcmtDb2xvcjMyIiwiX2ZpbmFsQ29sb3IiLCJDb2xvciIsIl9kYXJrQ29sb3IiLCJfcXVhZFRyaWFuZ2xlcyIsIkFuaW1hdGlvbkNhY2hlIiwiY2MiLCJDbGFzcyIsImN0b3IiLCJfcHJpdmF0ZU1vZGUiLCJfaW5pdGVkIiwiX2ludmFsaWQiLCJfZW5hYmxlQ2FjaGVBdHRhY2hlZEluZm8iLCJmcmFtZXMiLCJ0b3RhbFRpbWUiLCJfZnJhbWVJZHgiLCJpc0NvbXBsZXRlZCIsIl9za2VsZXRvbkluZm8iLCJfYW5pbWF0aW9uTmFtZSIsIl90ZW1wU2VnbWVudHMiLCJfdGVtcENvbG9ycyIsIl90ZW1wQm9uZUluZm9zIiwiaW5pdCIsInNrZWxldG9uSW5mbyIsImFuaW1hdGlvbk5hbWUiLCJjbGVhciIsImkiLCJuIiwibGVuZ3RoIiwiZnJhbWUiLCJzZWdtZW50cyIsImludmFsaWRBbGxGcmFtZSIsImJpbmQiLCJsaXN0ZW5lciIsImNvbXBsZXRlSGFuZGxlIiwiZW50cnkiLCJhbmltYXRpb24iLCJuYW1lIiwiY29tcGxldGUiLCJ1bmJpbmQiLCJiZWdpbiIsInByZUFuaW1hdGlvbkNhY2hlIiwiY3VyQW5pbWF0aW9uQ2FjaGUiLCJ1cGRhdGVUb0ZyYW1lIiwic2tlbGV0b24iLCJzdGF0ZSIsImRhdGEiLCJmaW5kQW5pbWF0aW9uIiwic2V0QW5pbWF0aW9uV2l0aCIsImVuZCIsIl9uZWVkVG9VcGRhdGUiLCJ0b0ZyYW1lSWR4IiwidW5kZWZpbmVkIiwiY2xpcHBlciIsInVwZGF0ZSIsImFwcGx5IiwidXBkYXRlV29ybGRUcmFuc2Zvcm0iLCJfdXBkYXRlRnJhbWUiLCJpc0luaXRlZCIsImlzSW52YWxpZCIsInVwZGF0ZUFsbEZyYW1lIiwiZW5hYmxlQ2FjaGVBdHRhY2hlZEluZm8iLCJpbmRleCIsImNvbG9ycyIsImJvbmVJbmZvcyIsInZlcnRpY2VzIiwidWludFZlcnQiLCJpbmRpY2VzIiwiX3RyYXZlcnNlU2tlbGV0b24iLCJ2Zk9mZnNldCIsInByZVNlZ09mZnNldCIsInByZVNlZ0luZm8iLCJpbmRleENvdW50IiwidmZDb3VudCIsInZlcnRleENvdW50IiwiRmxvYXQzMkFycmF5IiwiVWludDMyQXJyYXkiLCJidWZmZXIiLCJqIiwiVWludDE2QXJyYXkiLCJmaWxsVmVydGljZXMiLCJza2VsZXRvbkNvbG9yIiwiYXR0YWNobWVudENvbG9yIiwic2xvdENvbG9yIiwic2xvdCIsImEiLCJyIiwiZyIsImIiLCJkYXJrQ29sb3IiLCJzZXQiLCJmciIsImZnIiwiZmIiLCJmYSIsImRyIiwiZGciLCJkYiIsImRhIiwiaXNDbGlwcGluZyIsInYiLCJjbGlwVHJpYW5nbGVzIiwiY2xpcHBlZFZlcnRpY2VzIiwiY2xpcHBlZFRyaWFuZ2xlcyIsImlpIiwiamoiLCJubiIsIm9mZnNldCIsImNvbG9yIiwiYXR0YWNobWVudCIsInV2cyIsInRyaWFuZ2xlcyIsImlzUmVnaW9uIiwiaXNNZXNoIiwiaXNDbGlwIiwidGV4dHVyZSIsImJsZW5kTW9kZSIsImJvbmVzIiwibCIsImJvbmUiLCJib25lSW5mbyIsImMiLCJkIiwid29ybGRYIiwid29ybGRZIiwic2xvdElkeCIsInNsb3RDb3VudCIsImRyYXdPcmRlciIsImdldEF0dGFjaG1lbnQiLCJjbGlwRW5kV2l0aFNsb3QiLCJSZWdpb25BdHRhY2htZW50IiwiTWVzaEF0dGFjaG1lbnQiLCJDbGlwcGluZ0F0dGFjaG1lbnQiLCJjbGlwU3RhcnQiLCJyZWdpb24iLCJfdGV4dHVyZSIsIm5hdGl2ZVVybCIsInRleCIsImNvbXB1dGVXb3JsZFZlcnRpY2VzIiwid29ybGRWZXJ0aWNlc0xlbmd0aCIsInUiLCJjbGlwRW5kIiwiU2tlbGV0b25DYWNoZSIsIl9hbmltYXRpb25Qb29sIiwiX3NrZWxldG9uQ2FjaGUiLCJlbmFibGVQcml2YXRlTW9kZSIsInJlbW92ZVNrZWxldG9uIiwidXVpZCIsImsiLCJfdXVpZCIsInNwbGl0IiwiYW5pbWF0aW9uc0NhY2hlIiwiYW5pS2V5IiwiYW5pbWF0aW9uQ2FjaGUiLCJnZXRTa2VsZXRvbkNhY2hlIiwic2tlbGV0b25EYXRhIiwiU2tlbGV0b24iLCJTa2VsZXRvbkNsaXBwaW5nIiwic3RhdGVEYXRhIiwiQW5pbWF0aW9uU3RhdGVEYXRhIiwiQW5pbWF0aW9uU3RhdGUiLCJhZGRMaXN0ZW5lciIsImdldEFuaW1hdGlvbkNhY2hlIiwiaW52YWxpZEFuaW1hdGlvbkNhY2hlIiwiaW5pdEFuaW1hdGlvbkNhY2hlIiwicG9vbEtleSIsInVwZGF0ZUFuaW1hdGlvbkNhY2hlIiwic2hhcmVkQ2FjaGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTUEsbUJBQW1CLEdBQUdDLE9BQU8sQ0FBQyx5QkFBRCxDQUFuQzs7QUFDQSxJQUFNQyxLQUFLLEdB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QUFHckIsWUFBWSxJQUFJQSxZQUFZLENBQUNxQixRQUE1QztBQUNBLFVBQUksQ0FBQ0EsUUFBTCxFQUFlO0FBRWYsVUFBSTJHLGVBQWUsR0FBR2hJLFlBQVksQ0FBQ2dJLGVBQW5DOztBQUNBLFdBQUssSUFBSUMsTUFBVCxJQUFtQkQsZUFBbkIsRUFBb0M7QUFDaEMsWUFBSUUsZUFBYyxHQUFHRixlQUFlLENBQUNDLE1BQUQsQ0FBcEM7O0FBQ0FDLFFBQUFBLGVBQWMsQ0FBQzdGLGNBQWY7QUFDSDtBQUNKO0FBQ0o7QUEvSXdCLENBQVQsQ0FBcEI7QUFrSkFrRixhQUFhLENBQUN0SyxTQUFkLEdBQTBCQSxTQUExQjtBQUNBc0ssYUFBYSxDQUFDeUIsV0FBZCxHQUE0QixJQUFJekIsYUFBSixFQUE1QjtBQUNBMEIsTUFBTSxDQUFDQyxPQUFQLEdBQWlCM0IsYUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmNvbnN0IFRyYWNrRW50cnlMaXN0ZW5lcnMgPSByZXF1aXJlKCcuL3RyYWNrLWVudHJ5LWxpc3RlbmVycycpO1xuY29uc3Qgc3BpbmUgPSByZXF1aXJlKCcuL2xpYi9zcGluZScpO1xuLy8gUGVybWl0IG1heCBjYWNoZSB0aW1lLCB1bml0IGlzIHNlY29uZC5cbmNvbnN0IE1heENhY2hlVGltZSA9IDMwO1xuY29uc3QgRnJhbWVUaW1lID0gMSAvIDYwO1xuXG5sZXQgX3ZlcnRpY2VzID0gW107XG5sZXQgX2luZGljZXMgPSBbXTtcbmxldCBfYm9uZUluZm9PZmZzZXQgPSAwO1xubGV0IF92ZXJ0ZXhPZmZzZXQgPSAwO1xubGV0IF9pbmRleE9mZnNldCA9IDA7XG5sZXQgX3ZmT2Zmc2V0ID0gMDtcbmxldCBfcHJlVGV4VXJsID0gbnVsbDtcbmxldCBfcHJlQmxlbmRNb2RlID0gbnVsbDtcbmxldCBfc2VnVkNvdW50ID0gMDtcbmxldCBfc2VnSUNvdW50ID0gMDtcbmxldCBfc2VnT2Zmc2V0ID0gMDtcbmxldCBfY29sb3JPZmZzZXQgPSAwO1xubGV0IF9wcmVGaW5hbENvbG9yID0gbnVsbDtcbmxldCBfcHJlRGFya0NvbG9yID0gbnVsbDtcbi8vIHggeSB1IHYgYzEgYzJcbmxldCBfcGVyVmVydGV4U2l6ZSA9IDY7XG4vLyB4IHkgdSB2IHIxIGcxIGIxIGExIHIyIGcyIGIyIGEyXG5sZXQgX3BlckNsaXBWZXJ0ZXhTaXplID0gMTI7XG5sZXQgX3ZmQ291bnQgPSAwLCBfaW5kZXhDb3VudCA9IDA7XG5sZXQgX3RlbXByLCBfdGVtcGcsIF90ZW1wYiwgX3RlbXBhO1xubGV0IF9maW5hbENvbG9yMzIsIF9kYXJrQ29sb3IzMjtcbmxldCBfZmluYWxDb2xvciA9IG5ldyBzcGluZS5Db2xvcigxLCAxLCAxLCAxKTtcbmxldCBfZGFya0NvbG9yID0gbmV3IHNwaW5lLkNvbG9yKDEsIDEsIDEsIDEpO1xubGV0IF9xdWFkVHJpYW5nbGVzID0gWzAsIDEsIDIsIDIsIDMsIDBdO1xuXG4vL0NhY2hlIGFsbCBmcmFtZXMgaW4gYW4gYW5pbWF0aW9uXG5sZXQgQW5pbWF0aW9uQ2FjaGUgPSBjYy5DbGFzcyh7XG4gICAgY3RvcigpIHtcbiAgICAgICAgdGhpcy5fcHJpdmF0ZU1vZGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faW5pdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2ludmFsaWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9lbmFibGVDYWNoZUF0dGFjaGVkSW5mbyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmZyYW1lcyA9IFtdO1xuICAgICAgICB0aGlzLnRvdGFsVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2ZyYW1lSWR4ID0gLTE7XG4gICAgICAgIHRoaXMuaXNDb21wbGV0ZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLl9za2VsZXRvbkluZm8gPSBudWxsO1xuICAgICAgICB0aGlzLl9hbmltYXRpb25OYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5fdGVtcFNlZ21lbnRzID0gbnVsbDtcbiAgICAgICAgdGhpcy5fdGVtcENvbG9ycyA9IG51bGw7XG4gICAgICAgIHRoaXMuX3RlbXBCb25lSW5mb3MgPSBudWxsO1xuICAgIH0sXG5cbiAgICBpbml0KHNrZWxldG9uSW5mbywgYW5pbWF0aW9uTmFtZSkge1xuICAgICAgICB0aGlzLl9pbml0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9hbmltYXRpb25OYW1lID0gYW5pbWF0aW9uTmFtZTtcbiAgICAgICAgdGhpcy5fc2tlbGV0b25JbmZvID0gc2tlbGV0b25JbmZvO1xuICAgIH0sXG5cbiAgICAvLyBDbGVhciB0ZXh0dXJlIHF1b3RlLlxuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLl9pbml0ZWQgPSBmYWxzZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSB0aGlzLmZyYW1lcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBmcmFtZSA9IHRoaXMuZnJhbWVzW2ldO1xuICAgICAgICAgICAgZnJhbWUuc2VnbWVudHMubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmludmFsaWRBbGxGcmFtZSgpO1xuICAgIH0sXG5cbiAgICBiaW5kKGxpc3RlbmVyKSB7XG4gICAgICAgIGxldCBjb21wbGV0ZUhhbmRsZSA9IGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICAgICAgaWYgKGVudHJ5ICYmIGVudHJ5LmFuaW1hdGlvbi5uYW1lID09PSB0aGlzLl9hbmltYXRpb25OYW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0NvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgICBsaXN0ZW5lci5jb21wbGV0ZSA9IGNvbXBsZXRlSGFuZGxlO1xuICAgIH0sXG5cbiAgICB1bmJpbmQobGlzdGVuZXIpIHtcbiAgICAgICAgbGlzdGVuZXIuY29tcGxldGUgPSBudWxsO1xuICAgIH0sXG5cbiAgICBiZWdpbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pbnZhbGlkKSByZXR1cm47XG5cbiAgICAgICAgbGV0IHNrZWxldG9uSW5mbyA9IHRoaXMuX3NrZWxldG9uSW5mbztcbiAgICAgICAgbGV0IHByZUFuaW1hdGlvbkNhY2hlID0gc2tlbGV0b25JbmZvLmN1ckFuaW1hdGlvbkNhY2hlO1xuXG4gICAgICAgIGlmIChwcmVBbmltYXRpb25DYWNoZSAmJiBwcmVBbmltYXRpb25DYWNoZSAhPT0gdGhpcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3ByaXZhdGVNb2RlKSB7XG4gICAgICAgICAgICAgICAgLy8gUHJpdmF0ZSBjYWNoZSBtb2RlIGp1c3QgaW52YWxpZCBwcmUgYW5pbWF0aW9uIGZyYW1lLlxuICAgICAgICAgICAgICAgIHByZUFuaW1hdGlvbkNhY2hlLmludmFsaWRBbGxGcmFtZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBwcmUgYW5pbWF0aW9uIG5vdCBmaW5pc2hlZCwgcGxheSBpdCB0byB0aGUgZW5kLlxuICAgICAgICAgICAgICAgIHByZUFuaW1hdGlvbkNhY2hlLnVwZGF0ZVRvRnJhbWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBza2VsZXRvbiA9IHNrZWxldG9uSW5mby5za2VsZXRvbjtcbiAgICAgICAgbGV0IGxpc3RlbmVyID0gc2tlbGV0b25JbmZvLmxpc3RlbmVyO1xuICAgICAgICBsZXQgc3RhdGUgPSBza2VsZXRvbkluZm8uc3RhdGU7XG5cbiAgICAgICAgbGV0IGFuaW1hdGlvbiA9IHNrZWxldG9uLmRhdGEuZmluZEFuaW1hdGlvbih0aGlzLl9hbmltYXRpb25OYW1lKTtcbiAgICAgICAgc3RhdGUuc2V0QW5pbWF0aW9uV2l0aCgwLCBhbmltYXRpb24sIGZhbHNlKTtcbiAgICAgICAgdGhpcy5iaW5kKGxpc3RlbmVyKTtcblxuICAgICAgICAvLyByZWNvcmQgY3VyIGFuaW1hdGlvbiBjYWNoZVxuICAgICAgICBza2VsZXRvbkluZm8uY3VyQW5pbWF0aW9uQ2FjaGUgPSB0aGlzO1xuICAgICAgICB0aGlzLl9mcmFtZUlkeCA9IC0xO1xuICAgICAgICB0aGlzLmlzQ29tcGxldGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMudG90YWxUaW1lID0gMDtcbiAgICAgICAgdGhpcy5faW52YWxpZCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBlbmQoKSB7XG4gICAgICAgIGlmICghdGhpcy5fbmVlZFRvVXBkYXRlKCkpIHtcbiAgICAgICAgICAgIC8vIGNsZWFyIGN1ciBhbmltYXRpb24gY2FjaGVcbiAgICAgICAgICAgIHRoaXMuX3NrZWxldG9uSW5mby5jdXJBbmltYXRpb25DYWNoZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmZyYW1lcy5sZW5ndGggPSB0aGlzLl9mcmFtZUlkeCArIDE7XG4gICAgICAgICAgICB0aGlzLmlzQ29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMudW5iaW5kKHRoaXMuX3NrZWxldG9uSW5mby5saXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX25lZWRUb1VwZGF0ZSh0b0ZyYW1lSWR4KSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5pc0NvbXBsZXRlZCAmJlxuICAgICAgICAgICAgdGhpcy50b3RhbFRpbWUgPCBNYXhDYWNoZVRpbWUgJiZcbiAgICAgICAgICAgICh0b0ZyYW1lSWR4ID09IHVuZGVmaW5lZCB8fCB0aGlzLl9mcmFtZUlkeCA8IHRvRnJhbWVJZHgpO1xuICAgIH0sXG5cbiAgICB1cGRhdGVUb0ZyYW1lKHRvRnJhbWVJZHgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pbml0ZWQpIHJldHVybjtcblxuICAgICAgICB0aGlzLmJlZ2luKCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9uZWVkVG9VcGRhdGUodG9GcmFtZUlkeCkpIHJldHVybjtcblxuICAgICAgICBsZXQgc2tlbGV0b25JbmZvID0gdGhpcy5fc2tlbGV0b25JbmZvO1xuICAgICAgICBsZXQgc2tlbGV0b24gPSBza2VsZXRvbkluZm8uc2tlbGV0b247XG4gICAgICAgIGxldCBjbGlwcGVyID0gc2tlbGV0b25JbmZvLmNsaXBwZXI7XG4gICAgICAgIGxldCBzdGF0ZSA9IHNrZWxldG9uSW5mby5zdGF0ZTtcblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICAvLyBTb2xpZCB1cGRhdGUgZnJhbWUgcmF0ZSAxLzYwLlxuICAgICAgICAgICAgc2tlbGV0b24udXBkYXRlKEZyYW1lVGltZSk7XG4gICAgICAgICAgICBzdGF0ZS51cGRhdGUoRnJhbWVUaW1lKTtcbiAgICAgICAgICAgIHN0YXRlLmFwcGx5KHNrZWxldG9uKTtcbiAgICAgICAgICAgIHNrZWxldG9uLnVwZGF0ZVdvcmxkVHJhbnNmb3JtKCk7XG4gICAgICAgICAgICB0aGlzLl9mcmFtZUlkeCsrO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlRnJhbWUoc2tlbGV0b24sIGNsaXBwZXIsIHRoaXMuX2ZyYW1lSWR4KTtcbiAgICAgICAgICAgIHRoaXMudG90YWxUaW1lICs9IEZyYW1lVGltZTtcbiAgICAgICAgfSB3aGlsZSAodGhpcy5fbmVlZFRvVXBkYXRlKHRvRnJhbWVJZHgpKTtcblxuICAgICAgICB0aGlzLmVuZCgpO1xuICAgIH0sXG5cbiAgICBpc0luaXRlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luaXRlZDtcbiAgICB9LFxuXG4gICAgaXNJbnZhbGlkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52YWxpZDtcbiAgICB9LFxuXG4gICAgaW52YWxpZEFsbEZyYW1lKCkge1xuICAgICAgICB0aGlzLmlzQ29tcGxldGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2ludmFsaWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICB1cGRhdGVBbGxGcmFtZSgpIHtcbiAgICAgICAgdGhpcy5pbnZhbGlkQWxsRnJhbWUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVUb0ZyYW1lKCk7XG4gICAgfSxcblxuICAgIGVuYWJsZUNhY2hlQXR0YWNoZWRJbmZvKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2VuYWJsZUNhY2hlQXR0YWNoZWRJbmZvKSB7XG4gICAgICAgICAgICB0aGlzLl9lbmFibGVDYWNoZUF0dGFjaGVkSW5mbyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmludmFsaWRBbGxGcmFtZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVGcmFtZShza2VsZXRvbiwgY2xpcHBlciwgaW5kZXgpIHtcbiAgICAgICAgX3ZmT2Zmc2V0ID0gMDtcbiAgICAgICAgX2JvbmVJbmZvT2Zmc2V0ID0gMDtcbiAgICAgICAgX2luZGV4T2Zmc2V0ID0gMDtcbiAgICAgICAgX3ZlcnRleE9mZnNldCA9IDA7XG4gICAgICAgIF9wcmVUZXhVcmwgPSBudWxsO1xuICAgICAgICBfcHJlQmxlbmRNb2RlID0gbnVsbDtcbiAgICAgICAgX3NlZ1ZDb3VudCA9IDA7XG4gICAgICAgIF9zZWdJQ291bnQgPSAwO1xuICAgICAgICBfc2VnT2Zmc2V0ID0gMDtcbiAgICAgICAgX2NvbG9yT2Zmc2V0ID0gMDtcbiAgICAgICAgX3ByZUZpbmFsQ29sb3IgPSBudWxsO1xuICAgICAgICBfcHJlRGFya0NvbG9yID0gbnVsbDtcblxuICAgICAgICB0aGlzLmZyYW1lc1tpbmRleF0gPSB0aGlzLmZyYW1lc1tpbmRleF0gfHwge1xuICAgICAgICAgICAgc2VnbWVudHM6IFtdLFxuICAgICAgICAgICAgY29sb3JzOiBbXSxcbiAgICAgICAgICAgIGJvbmVJbmZvczogW10sXG4gICAgICAgICAgICB2ZXJ0aWNlczogbnVsbCxcbiAgICAgICAgICAgIHVpbnRWZXJ0OiBudWxsLFxuICAgICAgICAgICAgaW5kaWNlczogbnVsbCxcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGZyYW1lID0gdGhpcy5mcmFtZXNbaW5kZXhdO1xuXG4gICAgICAgIGxldCBzZWdtZW50cyA9IHRoaXMuX3RlbXBTZWdtZW50cyA9IGZyYW1lLnNlZ21lbnRzO1xuICAgICAgICBsZXQgY29sb3JzID0gdGhpcy5fdGVtcENvbG9ycyA9IGZyYW1lLmNvbG9ycztcbiAgICAgICAgbGV0IGJvbmVJbmZvcyA9IHRoaXMuX3RlbXBCb25lSW5mb3MgPSBmcmFtZS5ib25lSW5mb3M7XG4gICAgICAgIHRoaXMuX3RyYXZlcnNlU2tlbGV0b24oc2tlbGV0b24sIGNsaXBwZXIpO1xuICAgICAgICBpZiAoX2NvbG9yT2Zmc2V0ID4gMCkge1xuICAgICAgICAgICAgY29sb3JzW19jb2xvck9mZnNldCAtIDFdLnZmT2Zmc2V0ID0gX3ZmT2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIGNvbG9ycy5sZW5ndGggPSBfY29sb3JPZmZzZXQ7XG4gICAgICAgIGJvbmVJbmZvcy5sZW5ndGggPSBfYm9uZUluZm9PZmZzZXQ7XG4gICAgICAgIC8vIEhhbmRsZSBwcmUgc2VnbWVudC5cbiAgICAgICAgbGV0IHByZVNlZ09mZnNldCA9IF9zZWdPZmZzZXQgLSAxO1xuICAgICAgICBpZiAocHJlU2VnT2Zmc2V0ID49IDApIHtcbiAgICAgICAgICAgIC8vIEp1ZGdlIHNlZ21lbnQgdmVydGV4IGNvdW50IGlzIG5vdCBlbXB0eS5cbiAgICAgICAgICAgIGlmIChfc2VnSUNvdW50ID4gMCkge1xuICAgICAgICAgICAgICAgIGxldCBwcmVTZWdJbmZvID0gc2VnbWVudHNbcHJlU2VnT2Zmc2V0XTtcbiAgICAgICAgICAgICAgICBwcmVTZWdJbmZvLmluZGV4Q291bnQgPSBfc2VnSUNvdW50O1xuICAgICAgICAgICAgICAgIHByZVNlZ0luZm8udmZDb3VudCA9IF9zZWdWQ291bnQgKiBfcGVyVmVydGV4U2l6ZTtcbiAgICAgICAgICAgICAgICBwcmVTZWdJbmZvLnZlcnRleENvdW50ID0gX3NlZ1ZDb3VudDtcbiAgICAgICAgICAgICAgICBzZWdtZW50cy5sZW5ndGggPSBfc2VnT2Zmc2V0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBEaXNjYXJkIHByZSBzZWdtZW50LlxuICAgICAgICAgICAgICAgIHNlZ21lbnRzLmxlbmd0aCA9IF9zZWdPZmZzZXQgLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2VnbWVudHMgaXMgZW1wdHksZGlzY2FyZCBhbGwgc2VnbWVudHMuXG4gICAgICAgIGlmIChzZWdtZW50cy5sZW5ndGggPT0gMCkgcmV0dXJuO1xuXG4gICAgICAgIC8vIEZpbGwgdmVydGljZXNcbiAgICAgICAgbGV0IHZlcnRpY2VzID0gZnJhbWUudmVydGljZXM7XG4gICAgICAgIGxldCB1aW50VmVydCA9IGZyYW1lLnVpbnRWZXJ0O1xuICAgICAgICBpZiAoIXZlcnRpY2VzIHx8IHZlcnRpY2VzLmxlbmd0aCA8IF92Zk9mZnNldCkge1xuICAgICAgICAgICAgdmVydGljZXMgPSBmcmFtZS52ZXJ0aWNlcyA9IG5ldyBGbG9hdDMyQXJyYXkoX3ZmT2Zmc2V0KTtcbiAgICAgICAgICAgIHVpbnRWZXJ0ID0gZnJhbWUudWludFZlcnQgPSBuZXcgVWludDMyQXJyYXkodmVydGljZXMuYnVmZmVyKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaiA9IDA7IGkgPCBfdmZPZmZzZXQ7KSB7XG4gICAgICAgICAgICB2ZXJ0aWNlc1tpKytdID0gX3ZlcnRpY2VzW2orK107IC8vIHhcbiAgICAgICAgICAgIHZlcnRpY2VzW2krK10gPSBfdmVydGljZXNbaisrXTsgLy8geVxuICAgICAgICAgICAgdmVydGljZXNbaSsrXSA9IF92ZXJ0aWNlc1tqKytdOyAvLyB1XG4gICAgICAgICAgICB2ZXJ0aWNlc1tpKytdID0gX3ZlcnRpY2VzW2orK107IC8vIHZcbiAgICAgICAgICAgIHVpbnRWZXJ0W2krK10gPSBfdmVydGljZXNbaisrXTsgLy8gY29sb3IxXG4gICAgICAgICAgICB1aW50VmVydFtpKytdID0gX3ZlcnRpY2VzW2orK107IC8vIGNvbG9yMlxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmlsbCBpbmRpY2VzXG4gICAgICAgIGxldCBpbmRpY2VzID0gZnJhbWUuaW5kaWNlcztcbiAgICAgICAgaWYgKCFpbmRpY2VzIHx8IGluZGljZXMubGVuZ3RoIDwgX2luZGV4T2Zmc2V0KSB7XG4gICAgICAgICAgICBpbmRpY2VzID0gZnJhbWUuaW5kaWNlcyA9IG5ldyBVaW50MTZBcnJheShfaW5kZXhPZmZzZXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfaW5kZXhPZmZzZXQ7IGkrKykge1xuICAgICAgICAgICAgaW5kaWNlc1tpXSA9IF9pbmRpY2VzW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgZnJhbWUudmVydGljZXMgPSB2ZXJ0aWNlcztcbiAgICAgICAgZnJhbWUudWludFZlcnQgPSB1aW50VmVydDtcbiAgICAgICAgZnJhbWUuaW5kaWNlcyA9IGluZGljZXM7XG4gICAgfSxcblxuICAgIGZpbGxWZXJ0aWNlcyhza2VsZXRvbkNvbG9yLCBhdHRhY2htZW50Q29sb3IsIHNsb3RDb2xvciwgY2xpcHBlciwgc2xvdCkge1xuXG4gICAgICAgIF90ZW1wYSA9IHNsb3RDb2xvci5hICogYXR0YWNobWVudENvbG9yLmEgKiBza2VsZXRvbkNvbG9yLmEgKiAyNTU7XG4gICAgICAgIF90ZW1wciA9IGF0dGFjaG1lbnRDb2xvci5yICogc2tlbGV0b25Db2xvci5yICogMjU1O1xuICAgICAgICBfdGVtcGcgPSBhdHRhY2htZW50Q29sb3IuZyAqIHNrZWxldG9uQ29sb3IuZyAqIDI1NTtcbiAgICAgICAgX3RlbXBiID0gYXR0YWNobWVudENvbG9yLmIgKiBza2VsZXRvbkNvbG9yLmIgKiAyNTU7XG5cbiAgICAgICAgX2ZpbmFsQ29sb3IuciA9IF90ZW1wciAqIHNsb3RDb2xvci5yO1xuICAgICAgICBfZmluYWxDb2xvci5nID0gX3RlbXBnICogc2xvdENvbG9yLmc7XG4gICAgICAgIF9maW5hbENvbG9yLmIgPSBfdGVtcGIgKiBzbG90Q29sb3IuYjtcbiAgICAgICAgX2ZpbmFsQ29sb3IuYSA9IF90ZW1wYTtcblxuICAgICAgICBpZiAoc2xvdC5kYXJrQ29sb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgX2RhcmtDb2xvci5zZXQoMC4wLCAwLCAwLCAxLjApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX2RhcmtDb2xvci5yID0gc2xvdC5kYXJrQ29sb3IuciAqIF90ZW1wcjtcbiAgICAgICAgICAgIF9kYXJrQ29sb3IuZyA9IHNsb3QuZGFya0NvbG9yLmcgKiBfdGVtcGc7XG4gICAgICAgICAgICBfZGFya0NvbG9yLmIgPSBzbG90LmRhcmtDb2xvci5iICogX3RlbXBiO1xuICAgICAgICB9XG4gICAgICAgIF9kYXJrQ29sb3IuYSA9IDA7XG5cbiAgICAgICAgX2ZpbmFsQ29sb3IzMiA9ICgoX2ZpbmFsQ29sb3IuYSA8PCAyNCkgPj4+IDApICsgKF9maW5hbENvbG9yLmIgPDwgMTYpICsgKF9maW5hbENvbG9yLmcgPDwgOCkgKyBfZmluYWxDb2xvci5yO1xuICAgICAgICBfZGFya0NvbG9yMzIgPSAoKF9kYXJrQ29sb3IuYSA8PCAyNCkgPj4+IDApICsgKF9kYXJrQ29sb3IuYiA8PCAxNikgKyAoX2RhcmtDb2xvci5nIDw8IDgpICsgX2RhcmtDb2xvci5yO1xuXG4gICAgICAgIGlmIChfcHJlRmluYWxDb2xvciAhPT0gX2ZpbmFsQ29sb3IzMiB8fCBfcHJlRGFya0NvbG9yICE9PSBfZGFya0NvbG9yMzIpIHtcbiAgICAgICAgICAgIGxldCBjb2xvcnMgPSB0aGlzLl90ZW1wQ29sb3JzO1xuICAgICAgICAgICAgX3ByZUZpbmFsQ29sb3IgPSBfZmluYWxDb2xvcjMyO1xuICAgICAgICAgICAgX3ByZURhcmtDb2xvciA9IF9kYXJrQ29sb3IzMjtcbiAgICAgICAgICAgIGlmIChfY29sb3JPZmZzZXQgPiAwKSB7XG4gICAgICAgICAgICAgICAgY29sb3JzW19jb2xvck9mZnNldCAtIDFdLnZmT2Zmc2V0ID0gX3ZmT2Zmc2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29sb3JzW19jb2xvck9mZnNldCsrXSA9IHtcbiAgICAgICAgICAgICAgICBmcjogX2ZpbmFsQ29sb3IucixcbiAgICAgICAgICAgICAgICBmZzogX2ZpbmFsQ29sb3IuZyxcbiAgICAgICAgICAgICAgICBmYjogX2ZpbmFsQ29sb3IuYixcbiAgICAgICAgICAgICAgICBmYTogX2ZpbmFsQ29sb3IuYSxcbiAgICAgICAgICAgICAgICBkcjogX2RhcmtDb2xvci5yLFxuICAgICAgICAgICAgICAgIGRnOiBfZGFya0NvbG9yLmcsXG4gICAgICAgICAgICAgICAgZGI6IF9kYXJrQ29sb3IuYixcbiAgICAgICAgICAgICAgICBkYTogX2RhcmtDb2xvci5hLFxuICAgICAgICAgICAgICAgIHZmT2Zmc2V0OiAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNsaXBwZXIuaXNDbGlwcGluZygpKSB7XG5cbiAgICAgICAgICAgIGZvciAobGV0IHYgPSBfdmZPZmZzZXQsIG4gPSBfdmZPZmZzZXQgKyBfdmZDb3VudDsgdiA8IG47IHYgKz0gX3BlclZlcnRleFNpemUpIHtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbdiArIDRdID0gX2ZpbmFsQ29sb3IzMjsgICAgIC8vIGxpZ2h0IGNvbG9yXG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzW3YgKyA1XSA9IF9kYXJrQ29sb3IzMjsgICAgICAvLyBkYXJrIGNvbG9yXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNsaXBwZXIuY2xpcFRyaWFuZ2xlcyhfdmVydGljZXMsIF92ZkNvdW50LCBfaW5kaWNlcywgX2luZGV4Q291bnQsIF92ZXJ0aWNlcywgX2ZpbmFsQ29sb3IsIF9kYXJrQ29sb3IsIHRydWUsIF9wZXJWZXJ0ZXhTaXplLCBfaW5kZXhPZmZzZXQsIF92Zk9mZnNldCwgX3ZmT2Zmc2V0ICsgMik7XG4gICAgICAgICAgICBsZXQgY2xpcHBlZFZlcnRpY2VzID0gY2xpcHBlci5jbGlwcGVkVmVydGljZXM7XG4gICAgICAgICAgICBsZXQgY2xpcHBlZFRyaWFuZ2xlcyA9IGNsaXBwZXIuY2xpcHBlZFRyaWFuZ2xlcztcblxuICAgICAgICAgICAgLy8gaW5zdXJlIGNhcGFjaXR5XG4gICAgICAgICAgICBfaW5kZXhDb3VudCA9IGNsaXBwZWRUcmlhbmdsZXMubGVuZ3RoO1xuICAgICAgICAgICAgX3ZmQ291bnQgPSBjbGlwcGVkVmVydGljZXMubGVuZ3RoIC8gX3BlckNsaXBWZXJ0ZXhTaXplICogX3BlclZlcnRleFNpemU7XG5cbiAgICAgICAgICAgIC8vIGZpbGwgaW5kaWNlc1xuICAgICAgICAgICAgZm9yIChsZXQgaWkgPSAwLCBqaiA9IF9pbmRleE9mZnNldCwgbm4gPSBjbGlwcGVkVHJpYW5nbGVzLmxlbmd0aDsgaWkgPCBubjspIHtcbiAgICAgICAgICAgICAgICBfaW5kaWNlc1tqaisrXSA9IGNsaXBwZWRUcmlhbmdsZXNbaWkrK107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGZpbGwgdmVydGljZXMgY29udGFpbiB4IHkgdSB2IGxpZ2h0IGNvbG9yIGRhcmsgY29sb3JcbiAgICAgICAgICAgIGZvciAobGV0IHYgPSAwLCBuID0gY2xpcHBlZFZlcnRpY2VzLmxlbmd0aCwgb2Zmc2V0ID0gX3ZmT2Zmc2V0OyB2IDwgbjsgdiArPSAxMiwgb2Zmc2V0ICs9IF9wZXJWZXJ0ZXhTaXplKSB7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzW29mZnNldF0gPSBjbGlwcGVkVmVydGljZXNbdl07ICAgICAgICAgICAgICAgICAvLyB4XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzW29mZnNldCArIDFdID0gY2xpcHBlZFZlcnRpY2VzW3YgKyAxXTsgICAgICAgICAvLyB5XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzW29mZnNldCArIDJdID0gY2xpcHBlZFZlcnRpY2VzW3YgKyA2XTsgICAgICAgICAvLyB1XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzW29mZnNldCArIDNdID0gY2xpcHBlZFZlcnRpY2VzW3YgKyA3XTsgICAgICAgICAvLyB2XG5cbiAgICAgICAgICAgICAgICBfdmVydGljZXNbb2Zmc2V0ICsgNF0gPSBfZmluYWxDb2xvcjMyO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1tvZmZzZXQgKyA1XSA9IF9kYXJrQ29sb3IzMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdHJhdmVyc2VTa2VsZXRvbihza2VsZXRvbiwgY2xpcHBlcikge1xuICAgICAgICBsZXQgc2VnbWVudHMgPSB0aGlzLl90ZW1wU2VnbWVudHM7XG4gICAgICAgIGxldCBib25lSW5mb3MgPSB0aGlzLl90ZW1wQm9uZUluZm9zO1xuICAgICAgICBsZXQgc2tlbGV0b25Db2xvciA9IHNrZWxldG9uLmNvbG9yO1xuICAgICAgICBsZXQgYXR0YWNobWVudCwgYXR0YWNobWVudENvbG9yLCBzbG90Q29sb3IsIHV2cywgdHJpYW5nbGVzO1xuICAgICAgICBsZXQgaXNSZWdpb24sIGlzTWVzaCwgaXNDbGlwO1xuICAgICAgICBsZXQgdGV4dHVyZTtcbiAgICAgICAgbGV0IHByZVNlZ09mZnNldCwgcHJlU2VnSW5mbztcbiAgICAgICAgbGV0IGJsZW5kTW9kZTtcbiAgICAgICAgbGV0IHNsb3Q7XG5cbiAgICAgICAgbGV0IGJvbmVzID0gc2tlbGV0b24uYm9uZXM7XG4gICAgICAgIGlmICh0aGlzLl9lbmFibGVDYWNoZUF0dGFjaGVkSW5mbykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBib25lcy5sZW5ndGg7IGkgPCBsOyBpKyssIF9ib25lSW5mb09mZnNldCsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGJvbmUgPSBib25lc1tpXTtcbiAgICAgICAgICAgICAgICBsZXQgYm9uZUluZm8gPSBib25lSW5mb3NbX2JvbmVJbmZvT2Zmc2V0XTtcbiAgICAgICAgICAgICAgICBpZiAoIWJvbmVJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIGJvbmVJbmZvID0gYm9uZUluZm9zW19ib25lSW5mb09mZnNldF0gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYm9uZUluZm8uYSA9IGJvbmUuYTtcbiAgICAgICAgICAgICAgICBib25lSW5mby5iID0gYm9uZS5iO1xuICAgICAgICAgICAgICAgIGJvbmVJbmZvLmMgPSBib25lLmM7XG4gICAgICAgICAgICAgICAgYm9uZUluZm8uZCA9IGJvbmUuZDtcbiAgICAgICAgICAgICAgICBib25lSW5mby53b3JsZFggPSBib25lLndvcmxkWDtcbiAgICAgICAgICAgICAgICBib25lSW5mby53b3JsZFkgPSBib25lLndvcmxkWTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IHNsb3RJZHggPSAwLCBzbG90Q291bnQgPSBza2VsZXRvbi5kcmF3T3JkZXIubGVuZ3RoOyBzbG90SWR4IDwgc2xvdENvdW50OyBzbG90SWR4KyspIHtcbiAgICAgICAgICAgIHNsb3QgPSBza2VsZXRvbi5kcmF3T3JkZXJbc2xvdElkeF07XG5cbiAgICAgICAgICAgIF92ZkNvdW50ID0gMDtcbiAgICAgICAgICAgIF9pbmRleENvdW50ID0gMDtcblxuICAgICAgICAgICAgYXR0YWNobWVudCA9IHNsb3QuZ2V0QXR0YWNobWVudCgpO1xuICAgICAgICAgICAgaWYgKCFhdHRhY2htZW50KSB7XG4gICAgICAgICAgICAgICAgY2xpcHBlci5jbGlwRW5kV2l0aFNsb3Qoc2xvdCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlzUmVnaW9uID0gYXR0YWNobWVudCBpbnN0YW5jZW9mIHNwaW5lLlJlZ2lvbkF0dGFjaG1lbnQ7XG4gICAgICAgICAgICBpc01lc2ggPSBhdHRhY2htZW50IGluc3RhbmNlb2Ygc3BpbmUuTWVzaEF0dGFjaG1lbnQ7XG4gICAgICAgICAgICBpc0NsaXAgPSBhdHRhY2htZW50IGluc3RhbmNlb2Ygc3BpbmUuQ2xpcHBpbmdBdHRhY2htZW50O1xuXG4gICAgICAgICAgICBpZiAoaXNDbGlwKSB7XG4gICAgICAgICAgICAgICAgY2xpcHBlci5jbGlwU3RhcnQoc2xvdCwgYXR0YWNobWVudCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaXNSZWdpb24gJiYgIWlzTWVzaCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0ZXh0dXJlID0gYXR0YWNobWVudC5yZWdpb24udGV4dHVyZS5fdGV4dHVyZTtcbiAgICAgICAgICAgIGlmICghdGV4dHVyZSkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBibGVuZE1vZGUgPSBzbG90LmRhdGEuYmxlbmRNb2RlO1xuICAgICAgICAgICAgaWYgKF9wcmVUZXhVcmwgIT09IHRleHR1cmUubmF0aXZlVXJsIHx8IF9wcmVCbGVuZE1vZGUgIT09IGJsZW5kTW9kZSkge1xuICAgICAgICAgICAgICAgIF9wcmVUZXhVcmwgPSB0ZXh0dXJlLm5hdGl2ZVVybDtcbiAgICAgICAgICAgICAgICBfcHJlQmxlbmRNb2RlID0gYmxlbmRNb2RlO1xuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBwcmUgc2VnbWVudC5cbiAgICAgICAgICAgICAgICBwcmVTZWdPZmZzZXQgPSBfc2VnT2Zmc2V0IC0gMTtcbiAgICAgICAgICAgICAgICBpZiAocHJlU2VnT2Zmc2V0ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9zZWdJQ291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVTZWdJbmZvID0gc2VnbWVudHNbcHJlU2VnT2Zmc2V0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZVNlZ0luZm8uaW5kZXhDb3VudCA9IF9zZWdJQ291bnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVTZWdJbmZvLnZlcnRleENvdW50ID0gX3NlZ1ZDb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZVNlZ0luZm8udmZDb3VudCA9IF9zZWdWQ291bnQgKiBfcGVyVmVydGV4U2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIERpc2NhcmQgcHJlIHNlZ21lbnQuXG4gICAgICAgICAgICAgICAgICAgICAgICBfc2VnT2Zmc2V0LS07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIG5vdyBzZWdtZW50LlxuICAgICAgICAgICAgICAgIHNlZ21lbnRzW19zZWdPZmZzZXRdID0ge1xuICAgICAgICAgICAgICAgICAgICB0ZXg6IHRleHR1cmUsXG4gICAgICAgICAgICAgICAgICAgIGJsZW5kTW9kZTogYmxlbmRNb2RlLFxuICAgICAgICAgICAgICAgICAgICBpbmRleENvdW50OiAwLFxuICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhDb3VudDogMCxcbiAgICAgICAgICAgICAgICAgICAgdmZDb3VudDogMFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgX3NlZ09mZnNldCsrO1xuICAgICAgICAgICAgICAgIF9zZWdJQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgIF9zZWdWQ291bnQgPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaXNSZWdpb24pIHtcblxuICAgICAgICAgICAgICAgIHRyaWFuZ2xlcyA9IF9xdWFkVHJpYW5nbGVzO1xuXG4gICAgICAgICAgICAgICAgLy8gaW5zdXJlIGNhcGFjaXR5XG4gICAgICAgICAgICAgICAgX3ZmQ291bnQgPSA0ICogX3BlclZlcnRleFNpemU7XG4gICAgICAgICAgICAgICAgX2luZGV4Q291bnQgPSA2O1xuXG4gICAgICAgICAgICAgICAgLy8gY29tcHV0ZSB2ZXJ0ZXggYW5kIGZpbGwgeCB5XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudC5jb21wdXRlV29ybGRWZXJ0aWNlcyhzbG90LmJvbmUsIF92ZXJ0aWNlcywgX3ZmT2Zmc2V0LCBfcGVyVmVydGV4U2l6ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc01lc2gpIHtcblxuICAgICAgICAgICAgICAgIHRyaWFuZ2xlcyA9IGF0dGFjaG1lbnQudHJpYW5nbGVzO1xuXG4gICAgICAgICAgICAgICAgLy8gaW5zdXJlIGNhcGFjaXR5XG4gICAgICAgICAgICAgICAgX3ZmQ291bnQgPSAoYXR0YWNobWVudC53b3JsZFZlcnRpY2VzTGVuZ3RoID4+IDEpICogX3BlclZlcnRleFNpemU7XG4gICAgICAgICAgICAgICAgX2luZGV4Q291bnQgPSB0cmlhbmdsZXMubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgLy8gY29tcHV0ZSB2ZXJ0ZXggYW5kIGZpbGwgeCB5XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudC5jb21wdXRlV29ybGRWZXJ0aWNlcyhzbG90LCAwLCBhdHRhY2htZW50LndvcmxkVmVydGljZXNMZW5ndGgsIF92ZXJ0aWNlcywgX3ZmT2Zmc2V0LCBfcGVyVmVydGV4U2l6ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfdmZDb3VudCA9PSAwIHx8IF9pbmRleENvdW50ID09IDApIHtcbiAgICAgICAgICAgICAgICBjbGlwcGVyLmNsaXBFbmRXaXRoU2xvdChzbG90KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZmlsbCBpbmRpY2VzXG4gICAgICAgICAgICBmb3IgKGxldCBpaSA9IDAsIGpqID0gX2luZGV4T2Zmc2V0LCBubiA9IHRyaWFuZ2xlcy5sZW5ndGg7IGlpIDwgbm47KSB7XG4gICAgICAgICAgICAgICAgX2luZGljZXNbamorK10gPSB0cmlhbmdsZXNbaWkrK107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGZpbGwgdSB2XG4gICAgICAgICAgICB1dnMgPSBhdHRhY2htZW50LnV2cztcbiAgICAgICAgICAgIGZvciAobGV0IHYgPSBfdmZPZmZzZXQsIG4gPSBfdmZPZmZzZXQgKyBfdmZDb3VudCwgdSA9IDA7IHYgPCBuOyB2ICs9IF9wZXJWZXJ0ZXhTaXplLCB1ICs9IDIpIHtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbdiArIDJdID0gdXZzW3VdOyAgICAgICAgICAgLy8gdVxuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1t2ICsgM10gPSB1dnNbdSArIDFdOyAgICAgICAvLyB2XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF0dGFjaG1lbnRDb2xvciA9IGF0dGFjaG1lbnQuY29sb3I7XG4gICAgICAgICAgICBzbG90Q29sb3IgPSBzbG90LmNvbG9yO1xuXG4gICAgICAgICAgICB0aGlzLmZpbGxWZXJ0aWNlcyhza2VsZXRvbkNvbG9yLCBhdHRhY2htZW50Q29sb3IsIHNsb3RDb2xvciwgY2xpcHBlciwgc2xvdCk7XG5cbiAgICAgICAgICAgIGlmIChfaW5kZXhDb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpaSA9IF9pbmRleE9mZnNldCwgbm4gPSBfaW5kZXhPZmZzZXQgKyBfaW5kZXhDb3VudDsgaWkgPCBubjsgaWkrKykge1xuICAgICAgICAgICAgICAgICAgICBfaW5kaWNlc1tpaV0gKz0gX3NlZ1ZDb3VudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX2luZGV4T2Zmc2V0ICs9IF9pbmRleENvdW50O1xuICAgICAgICAgICAgICAgIF92Zk9mZnNldCArPSBfdmZDb3VudDtcbiAgICAgICAgICAgICAgICBfdmVydGV4T2Zmc2V0ID0gX3ZmT2Zmc2V0IC8gX3BlclZlcnRleFNpemU7XG4gICAgICAgICAgICAgICAgX3NlZ0lDb3VudCArPSBfaW5kZXhDb3VudDtcbiAgICAgICAgICAgICAgICBfc2VnVkNvdW50ICs9IF92ZkNvdW50IC8gX3BlclZlcnRleFNpemU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xpcHBlci5jbGlwRW5kKCk7XG4gICAgfVxufSk7XG5cbmxldCBTa2VsZXRvbkNhY2hlID0gY2MuQ2xhc3Moe1xuICAgIGN0b3IoKSB7XG4gICAgICAgIHRoaXMuX3ByaXZhdGVNb2RlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2FuaW1hdGlvblBvb2wgPSB7fTtcbiAgICAgICAgdGhpcy5fc2tlbGV0b25DYWNoZSA9IHt9O1xuICAgIH0sXG5cbiAgICBlbmFibGVQcml2YXRlTW9kZSgpIHtcbiAgICAgICAgdGhpcy5fcHJpdmF0ZU1vZGUgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5fYW5pbWF0aW9uUG9vbCA9IHt9O1xuICAgICAgICB0aGlzLl9za2VsZXRvbkNhY2hlID0ge307XG4gICAgfSxcblxuICAgIHJlbW92ZVNrZWxldG9uKHV1aWQpIHtcbiAgICAgICAgLy8gdmFyIHNrZWxldG9uSW5mbyA9IHRoaXMuX3NrZWxldG9uQ2FjaGVbdXVpZF07XG4gICAgICAgIC8vIGlmICghc2tlbGV0b25JbmZvKSByZXR1cm47XG5cbiAgICAgICAgLy8gbGV0IGFuaW1hdGlvbnNDYWNoZSA9IHNrZWxldG9uSW5mby5hbmltYXRpb25zQ2FjaGU7XG4gICAgICAgIC8vIGZvciAodmFyIGFuaUtleSBpbiBhbmltYXRpb25zQ2FjaGUpIHtcbiAgICAgICAgLy8gICAgIC8vIENsZWFyIGNhY2hlIHRleHR1cmUsIGFuZCBwdXQgY2FjaGUgaW50byBwb29sLlxuICAgICAgICAvLyAgICAgLy8gTm8gbmVlZCB0byBjcmVhdGUgVHlwZWRBcnJheSBuZXh0IHRpbWUuXG4gICAgICAgIC8vICAgICBsZXQgYW5pbWF0aW9uQ2FjaGUgPSBhbmltYXRpb25zQ2FjaGVbYW5pS2V5XTtcbiAgICAgICAgLy8gICAgIGlmICghYW5pbWF0aW9uQ2FjaGUpIGNvbnRpbnVlO1xuICAgICAgICAvLyAgICAgdGhpcy5fYW5pbWF0aW9uUG9vbFt1dWlkICsgXCIjXCIgKyBhbmlLZXldID0gYW5pbWF0aW9uQ2FjaGU7XG4gICAgICAgIC8vICAgICBhbmltYXRpb25DYWNoZS5jbGVhcigpO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gZGVsZXRlIHRoaXMuX3NrZWxldG9uQ2FjaGVbdXVpZF07XG4gICAgICAgIC8vIHdhbmdjaGVuZyDkv67lpI3lhbHkuqvnvJPlrZjmuIXnkIbkuI3lubLlh4DnmoTpl67pophcbiAgICAgICAgbGV0IHNrZWxldG9uSW5mbztcbiAgICAgICAgZm9yIChsZXQgayBpbiB0aGlzLl9za2VsZXRvbkNhY2hlKSB7XG4gICAgICAgICAgICBsZXQgX3V1aWQgPSBrLnNwbGl0KCdfJylbMF07XG4gICAgICAgICAgICBpZiAoX3V1aWQgPT0gdXVpZCkge1xuICAgICAgICAgICAgICAgIHNrZWxldG9uSW5mbyA9IHRoaXMuX3NrZWxldG9uQ2FjaGVba107XG4gICAgICAgICAgICAgICAgaWYgKCFza2VsZXRvbkluZm8pIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgbGV0IGFuaW1hdGlvbnNDYWNoZSA9IHNrZWxldG9uSW5mby5hbmltYXRpb25zQ2FjaGU7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYW5pS2V5IGluIGFuaW1hdGlvbnNDYWNoZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBDbGVhciBjYWNoZSB0ZXh0dXJlLCBhbmQgcHV0IGNhY2hlIGludG8gcG9vbC5cbiAgICAgICAgICAgICAgICAgICAgLy8gTm8gbmVlZCB0byBjcmVhdGUgVHlwZWRBcnJheSBuZXh0IHRpbWUuXG4gICAgICAgICAgICAgICAgICAgIGxldCBhbmltYXRpb25DYWNoZSA9IGFuaW1hdGlvbnNDYWNoZVthbmlLZXldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWFuaW1hdGlvbkNhY2hlKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYW5pbWF0aW9uUG9vbFtfdXVpZCArIFwiI1wiICsgYW5pS2V5XSA9IGFuaW1hdGlvbkNhY2hlO1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25DYWNoZS5jbGVhcigpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9za2VsZXRvbkNhY2hlW2tdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGdldFNrZWxldG9uQ2FjaGUodXVpZCwgc2tlbGV0b25EYXRhKSB7XG4gICAgICAgIGxldCBza2VsZXRvbkluZm8gPSB0aGlzLl9za2VsZXRvbkNhY2hlW3V1aWRdO1xuICAgICAgICBpZiAoIXNrZWxldG9uSW5mbykge1xuICAgICAgICAgICAgbGV0IHNrZWxldG9uID0gbmV3IHNwaW5lLlNrZWxldG9uKHNrZWxldG9uRGF0YSk7XG4gICAgICAgICAgICBsZXQgY2xpcHBlciA9IG5ldyBzcGluZS5Ta2VsZXRvbkNsaXBwaW5nKCk7XG4gICAgICAgICAgICBsZXQgc3RhdGVEYXRhID0gbmV3IHNwaW5lLkFuaW1hdGlvblN0YXRlRGF0YShza2VsZXRvbi5kYXRhKTtcbiAgICAgICAgICAgIGxldCBzdGF0ZSA9IG5ldyBzcGluZS5BbmltYXRpb25TdGF0ZShzdGF0ZURhdGEpO1xuICAgICAgICAgICAgbGV0IGxpc3RlbmVyID0gbmV3IFRyYWNrRW50cnlMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIHN0YXRlLmFkZExpc3RlbmVyKGxpc3RlbmVyKTtcblxuICAgICAgICAgICAgdGhpcy5fc2tlbGV0b25DYWNoZVt1dWlkXSA9IHNrZWxldG9uSW5mbyA9IHtcbiAgICAgICAgICAgICAgICBza2VsZXRvbjogc2tlbGV0b24sXG4gICAgICAgICAgICAgICAgY2xpcHBlcjogY2xpcHBlcixcbiAgICAgICAgICAgICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICAgICAgICAgICAgbGlzdGVuZXI6IGxpc3RlbmVyLFxuICAgICAgICAgICAgICAgIC8vIENhY2hlIGFsbCBraW5kcyBvZiBhbmltYXRpb24gZnJhbWUuXG4gICAgICAgICAgICAgICAgLy8gV2hlbiBza2VsZXRvbiBpcyBkaXNwb3NlLCBjbGVhciBhbGwgYW5pbWF0aW9uIGNhY2hlLlxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbnNDYWNoZToge30sXG4gICAgICAgICAgICAgICAgY3VyQW5pbWF0aW9uQ2FjaGU6IG51bGxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNrZWxldG9uSW5mbztcbiAgICB9LFxuXG4gICAgZ2V0QW5pbWF0aW9uQ2FjaGUodXVpZCwgYW5pbWF0aW9uTmFtZSkge1xuICAgICAgICBsZXQgc2tlbGV0b25JbmZvID0gdGhpcy5fc2tlbGV0b25DYWNoZVt1dWlkXTtcbiAgICAgICAgaWYgKCFza2VsZXRvbkluZm8pIHJldHVybiBudWxsO1xuXG4gICAgICAgIGxldCBhbmltYXRpb25zQ2FjaGUgPSBza2VsZXRvbkluZm8uYW5pbWF0aW9uc0NhY2hlO1xuICAgICAgICByZXR1cm4gYW5pbWF0aW9uc0NhY2hlW2FuaW1hdGlvbk5hbWVdO1xuICAgIH0sXG5cbiAgICBpbnZhbGlkQW5pbWF0aW9uQ2FjaGUodXVpZCkge1xuICAgICAgICBsZXQgc2tlbGV0b25JbmZvID0gdGhpcy5fc2tlbGV0b25DYWNoZVt1dWlkXTtcbiAgICAgICAgbGV0IHNrZWxldG9uID0gc2tlbGV0b25JbmZvICYmIHNrZWxldG9uSW5mby5za2VsZXRvbjtcbiAgICAgICAgaWYgKCFza2VsZXRvbikgcmV0dXJuO1xuXG4gICAgICAgIGxldCBhbmltYXRpb25zQ2FjaGUgPSBza2VsZXRvbkluZm8uYW5pbWF0aW9uc0NhY2hlO1xuICAgICAgICBmb3IgKHZhciBhbmlLZXkgaW4gYW5pbWF0aW9uc0NhY2hlKSB7XG4gICAgICAgICAgICBsZXQgYW5pbWF0aW9uQ2FjaGUgPSBhbmltYXRpb25zQ2FjaGVbYW5pS2V5XTtcbiAgICAgICAgICAgIGFuaW1hdGlvbkNhY2hlLmludmFsaWRBbGxGcmFtZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGluaXRBbmltYXRpb25DYWNoZSh1dWlkLCBhbmltYXRpb25OYW1lKSB7XG4gICAgICAgIGlmICghYW5pbWF0aW9uTmFtZSkgcmV0dXJuIG51bGw7XG4gICAgICAgIGxldCBza2VsZXRvbkluZm8gPSB0aGlzLl9za2VsZXRvbkNhY2hlW3V1aWRdO1xuICAgICAgICBsZXQgc2tlbGV0b24gPSBza2VsZXRvbkluZm8gJiYgc2tlbGV0b25JbmZvLnNrZWxldG9uO1xuICAgICAgICBpZiAoIXNrZWxldG9uKSByZXR1cm4gbnVsbDtcblxuICAgICAgICBsZXQgYW5pbWF0aW9uID0gc2tlbGV0b24uZGF0YS5maW5kQW5pbWF0aW9uKGFuaW1hdGlvbk5hbWUpO1xuICAgICAgICBpZiAoIWFuaW1hdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYW5pbWF0aW9uc0NhY2hlID0gc2tlbGV0b25JbmZvLmFuaW1hdGlvbnNDYWNoZTtcbiAgICAgICAgbGV0IGFuaW1hdGlvbkNhY2hlID0gYW5pbWF0aW9uc0NhY2hlW2FuaW1hdGlvbk5hbWVdO1xuICAgICAgICBpZiAoIWFuaW1hdGlvbkNhY2hlKSB7XG4gICAgICAgICAgICAvLyBJZiBjYWNoZSBleGlzdCBpbiBwb29sLCB0aGVuIGp1c3QgdXNlIGl0LlxuICAgICAgICAgICAgbGV0IHBvb2xLZXkgPSB1dWlkICsgXCIjXCIgKyBhbmltYXRpb25OYW1lO1xuICAgICAgICAgICAgYW5pbWF0aW9uQ2FjaGUgPSB0aGlzLl9hbmltYXRpb25Qb29sW3Bvb2xLZXldO1xuICAgICAgICAgICAgaWYgKGFuaW1hdGlvbkNhY2hlKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2FuaW1hdGlvblBvb2xbcG9vbEtleV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbkNhY2hlID0gbmV3IEFuaW1hdGlvbkNhY2hlKCk7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uQ2FjaGUuX3ByaXZhdGVNb2RlID0gdGhpcy5fcHJpdmF0ZU1vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhbmltYXRpb25DYWNoZS5pbml0KHNrZWxldG9uSW5mbywgYW5pbWF0aW9uTmFtZSk7XG4gICAgICAgICAgICBhbmltYXRpb25zQ2FjaGVbYW5pbWF0aW9uTmFtZV0gPSBhbmltYXRpb25DYWNoZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYW5pbWF0aW9uQ2FjaGU7XG4gICAgfSxcblxuICAgIHVwZGF0ZUFuaW1hdGlvbkNhY2hlKHV1aWQsIGFuaW1hdGlvbk5hbWUpIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbk5hbWUpIHtcbiAgICAgICAgICAgIGxldCBhbmltYXRpb25DYWNoZSA9IHRoaXMuaW5pdEFuaW1hdGlvbkNhY2hlKHV1aWQsIGFuaW1hdGlvbk5hbWUpO1xuICAgICAgICAgICAgaWYgKCFhbmltYXRpb25DYWNoZSkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBhbmltYXRpb25DYWNoZS51cGRhdGVBbGxGcmFtZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHNrZWxldG9uSW5mbyA9IHRoaXMuX3NrZWxldG9uQ2FjaGVbdXVpZF07XG4gICAgICAgICAgICBsZXQgc2tlbGV0b24gPSBza2VsZXRvbkluZm8gJiYgc2tlbGV0b25JbmZvLnNrZWxldG9uO1xuICAgICAgICAgICAgaWYgKCFza2VsZXRvbikgcmV0dXJuO1xuXG4gICAgICAgICAgICBsZXQgYW5pbWF0aW9uc0NhY2hlID0gc2tlbGV0b25JbmZvLmFuaW1hdGlvbnNDYWNoZTtcbiAgICAgICAgICAgIGZvciAodmFyIGFuaUtleSBpbiBhbmltYXRpb25zQ2FjaGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgYW5pbWF0aW9uQ2FjaGUgPSBhbmltYXRpb25zQ2FjaGVbYW5pS2V5XTtcbiAgICAgICAgICAgICAgICBhbmltYXRpb25DYWNoZS51cGRhdGVBbGxGcmFtZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cblNrZWxldG9uQ2FjaGUuRnJhbWVUaW1lID0gRnJhbWVUaW1lO1xuU2tlbGV0b25DYWNoZS5zaGFyZWRDYWNoZSA9IG5ldyBTa2VsZXRvbkNhY2hlKCk7XG5tb2R1bGUuZXhwb3J0cyA9IFNrZWxldG9uQ2FjaGU7Il0sInNvdXJjZVJvb3QiOiIvIn0=