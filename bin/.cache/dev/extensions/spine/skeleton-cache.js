
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
    var skeletonInfo;

    for (var k in this._skeletonCache) {
      console.log('', k);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvZXh0ZW5zaW9ucy9zcGluZS9za2VsZXRvbi1jYWNoZS5qcyJdLCJuYW1lcyI6WyJUcmFja0VudHJ5TGlzdGVuZXJzIiwicmVxdWlyZSIsInNwaW5lIiwiTWF4Q2FjaGVUaW1lIiwiRnJhbWVUaW1lIiwiX3ZlcnRpY2VzIiwiX2luZGljZXMiLCJfYm9uZUluZm9PZmZzZXQiLCJfdmVydGV4T2Zmc2V0IiwiX2luZGV4T2Zmc2V0IiwiX3ZmT2Zmc2V0IiwiX3ByZVRleFVybCIsIl9wcmVCbGVuZE1vZGUiLCJfc2VnVkNvdW50IiwiX3NlZ0lDb3VudCIsIl9zZWdPZmZzZXQiLCJfY29sb3JPZmZzZXQiLCJfcHJlRmluYWxDb2xvciIsIl9wcmVEYXJrQ29sb3IiLCJfcGVyVmVydGV4U2l6ZSIsIl9wZXJDbGlwVmVydGV4U2l6ZSIsIl92ZkNvdW50IiwiX2luZGV4Q291bnQiLCJfdGVtcHIiLCJfdGVtcGciLCJfdGVtcGIiLCJfdGVtcGEiLCJfZmluYWxDb2xvcjMyIiwiX2RhcmtDb2xvcjMyIiwiX2ZpbmFsQ29sb3IiLCJDb2xvciIsIl9kYXJrQ29sb3IiLCJfcXVhZFRyaWFuZ2xlcyIsIkFuaW1hdGlvbkNhY2hlIiwiY2MiLCJDbGFzcyIsImN0b3IiLCJfcHJpdmF0ZU1vZGUiLCJfaW5pdGVkIiwiX2ludmFsaWQiLCJfZW5hYmxlQ2FjaGVBdHRhY2hlZEluZm8iLCJmcmFtZXMiLCJ0b3RhbFRpbWUiLCJfZnJhbWVJZHgiLCJpc0NvbXBsZXRlZCIsIl9za2VsZXRvbkluZm8iLCJfYW5pbWF0aW9uTmFtZSIsIl90ZW1wU2VnbWVudHMiLCJfdGVtcENvbG9ycyIsIl90ZW1wQm9uZUluZm9zIiwiaW5pdCIsInNrZWxldG9uSW5mbyIsImFuaW1hdGlvbk5hbWUiLCJjbGVhciIsImkiLCJuIiwibGVuZ3RoIiwiZnJhbWUiLCJzZWdtZW50cyIsImludmFsaWRBbGxGcmFtZSIsImJpbmQiLCJsaXN0ZW5lciIsImNvbXBsZXRlSGFuZGxlIiwiZW50cnkiLCJhbmltYXRpb24iLCJuYW1lIiwiY29tcGxldGUiLCJ1bmJpbmQiLCJiZWdpbiIsInByZUFuaW1hdGlvbkNhY2hlIiwiY3VyQW5pbWF0aW9uQ2FjaGUiLCJ1cGRhdGVUb0ZyYW1lIiwic2tlbGV0b24iLCJzdGF0ZSIsImRhdGEiLCJmaW5kQW5pbWF0aW9uIiwic2V0QW5pbWF0aW9uV2l0aCIsImVuZCIsIl9uZWVkVG9VcGRhdGUiLCJ0b0ZyYW1lSWR4IiwidW5kZWZpbmVkIiwiY2xpcHBlciIsInVwZGF0ZSIsImFwcGx5IiwidXBkYXRlV29ybGRUcmFuc2Zvcm0iLCJfdXBkYXRlRnJhbWUiLCJpc0luaXRlZCIsImlzSW52YWxpZCIsInVwZGF0ZUFsbEZyYW1lIiwiZW5hYmxlQ2FjaGVBdHRhY2hlZEluZm8iLCJpbmRleCIsImNvbG9ycyIsImJvbmVJbmZvcyIsInZlcnRpY2VzIiwidWludFZlcnQiLCJpbmRpY2VzIiwiX3RyYXZlcnNlU2tlbGV0b24iLCJ2Zk9mZnNldCIsInByZVNlZ09mZnNldCIsInByZVNlZ0luZm8iLCJpbmRleENvdW50IiwidmZDb3VudCIsInZlcnRleENvdW50IiwiRmxvYXQzMkFycmF5IiwiVWludDMyQXJyYXkiLCJidWZmZXIiLCJqIiwiVWludDE2QXJyYXkiLCJmaWxsVmVydGljZXMiLCJza2VsZXRvbkNvbG9yIiwiYXR0YWNobWVudENvbG9yIiwic2xvdENvbG9yIiwic2xvdCIsImEiLCJyIiwiZyIsImIiLCJkYXJrQ29sb3IiLCJzZXQiLCJmciIsImZnIiwiZmIiLCJmYSIsImRyIiwiZGciLCJkYiIsImRhIiwiaXNDbGlwcGluZyIsInYiLCJjbGlwVHJpYW5nbGVzIiwiY2xpcHBlZFZlcnRpY2VzIiwiY2xpcHBlZFRyaWFuZ2xlcyIsImlpIiwiamoiLCJubiIsIm9mZnNldCIsImNvbG9yIiwiYXR0YWNobWVudCIsInV2cyIsInRyaWFuZ2xlcyIsImlzUmVnaW9uIiwiaXNNZXNoIiwiaXNDbGlwIiwidGV4dHVyZSIsImJsZW5kTW9kZSIsImJvbmVzIiwibCIsImJvbmUiLCJib25lSW5mbyIsImMiLCJkIiwid29ybGRYIiwid29ybGRZIiwic2xvdElkeCIsInNsb3RDb3VudCIsImRyYXdPcmRlciIsImdldEF0dGFjaG1lbnQiLCJjbGlwRW5kV2l0aFNsb3QiLCJSZWdpb25BdHRhY2htZW50IiwiTWVzaEF0dGFjaG1lbnQiLCJDbGlwcGluZ0F0dGFjaG1lbnQiLCJjbGlwU3RhcnQiLCJyZWdpb24iLCJfdGV4dHVyZSIsIm5hdGl2ZVVybCIsInRleCIsImNvbXB1dGVXb3JsZFZlcnRpY2VzIiwid29ybGRWZXJ0aWNlc0xlbmd0aCIsInUiLCJjbGlwRW5kIiwiU2tlbGV0b25DYWNoZSIsIl9hbmltYXRpb25Qb29sIiwiX3NrZWxldG9uQ2FjaGUiLCJlbmFibGVQcml2YXRlTW9kZSIsInJlbW92ZVNrZWxldG9uIiwidXVpZCIsImsiLCJjb25zb2xlIiwibG9nIiwiX3V1aWQiLCJzcGxpdCIsImFuaW1hdGlvbnNDYWNoZSIsImFuaUtleSIsImFuaW1hdGlvbkNhY2hlIiwiZ2V0U2tlbGV0b25DYWNoZSIsInNrZWxldG9uRGF0YSIsIlNrZWxldG9uIiwiU2tlbGV0b25DbGlwcGluZyIsInN0YXRlRGF0YSIsIkFuaW1hdGlvblN0YXRlRGF0YSIsIkFuaW1hdGlvblN0YXRlIiwiYWRkTGlzdGVuZXIiLCJnZXRBbmltYXRpb25DYWNoZSIsImludmFsaWRBbmltYXRpb25DYWNoZSIsImluaXRBbmltYXRpb25DYWNoZSIsInBvb2xLZXkiLCJ1cGRhdGVBbmltYXRpb25DYWNoZSIsInNoYXJlZENhY2hlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU1BLG1CQUFtQixHQUFHQyxPQUFPLENBQUMseUJBQUQsQ0FBbkM7O0FB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SXJDLFlBQVksR0FBRyxLQUFLeUgsY0FBTCxDQUFvQkcsSUFBcEIsQ0FBbkI7QUFDQSxVQUFJdkcsUUFBUSxHQUFHckIsWUFBWSxJQUFJQSxZQUFZLENBQUNxQixRQUE1QztBQUNBLFVBQUksQ0FBQ0EsUUFBTCxFQUFlO0FBRWYsVUFBSTZHLGVBQWUsR0FBR2xJLFlBQVksQ0FBQ2tJLGVBQW5DOztBQUNBLFdBQUssSUFBSUMsTUFBVCxJQUFtQkQsZUFBbkIsRUFBb0M7QUFDaEMsWUFBSUUsZUFBYyxHQUFHRixlQUFlLENBQUNDLE1BQUQsQ0FBcEM7O0FBQ0FDLFFBQUFBLGVBQWMsQ0FBQy9GLGNBQWY7QUFDSDtBQUNKO0FBQ0o7QUFoSndCLENBQVQsQ0FBcEI7QUFtSkFrRixhQUFhLENBQUN0SyxTQUFkLEdBQTBCQSxTQUExQjtBQUNBc0ssYUFBYSxDQUFDMkIsV0FBZCxHQUE0QixJQUFJM0IsYUFBSixFQUE1QjtBQUNBNEIsTUFBTSxDQUFDQyxPQUFQLEdBQWlCN0IsYUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmNvbnN0IFRyYWNrRW50cnlMaXN0ZW5lcnMgPSByZXF1aXJlKCcuL3RyYWNrLWVudHJ5LWxpc3RlbmVycycpO1xuY29uc3Qgc3BpbmUgPSByZXF1aXJlKCcuL2xpYi9zcGluZScpO1xuLy8gUGVybWl0IG1heCBjYWNoZSB0aW1lLCB1bml0IGlzIHNlY29uZC5cbmNvbnN0IE1heENhY2hlVGltZSA9IDMwO1xuY29uc3QgRnJhbWVUaW1lID0gMSAvIDYwO1xuXG5sZXQgX3ZlcnRpY2VzID0gW107XG5sZXQgX2luZGljZXMgPSBbXTtcbmxldCBfYm9uZUluZm9PZmZzZXQgPSAwO1xubGV0IF92ZXJ0ZXhPZmZzZXQgPSAwO1xubGV0IF9pbmRleE9mZnNldCA9IDA7XG5sZXQgX3ZmT2Zmc2V0ID0gMDtcbmxldCBfcHJlVGV4VXJsID0gbnVsbDtcbmxldCBfcHJlQmxlbmRNb2RlID0gbnVsbDtcbmxldCBfc2VnVkNvdW50ID0gMDtcbmxldCBfc2VnSUNvdW50ID0gMDtcbmxldCBfc2VnT2Zmc2V0ID0gMDtcbmxldCBfY29sb3JPZmZzZXQgPSAwO1xubGV0IF9wcmVGaW5hbENvbG9yID0gbnVsbDtcbmxldCBfcHJlRGFya0NvbG9yID0gbnVsbDtcbi8vIHggeSB1IHYgYzEgYzJcbmxldCBfcGVyVmVydGV4U2l6ZSA9IDY7XG4vLyB4IHkgdSB2IHIxIGcxIGIxIGExIHIyIGcyIGIyIGEyXG5sZXQgX3BlckNsaXBWZXJ0ZXhTaXplID0gMTI7XG5sZXQgX3ZmQ291bnQgPSAwLCBfaW5kZXhDb3VudCA9IDA7XG5sZXQgX3RlbXByLCBfdGVtcGcsIF90ZW1wYiwgX3RlbXBhO1xubGV0IF9maW5hbENvbG9yMzIsIF9kYXJrQ29sb3IzMjtcbmxldCBfZmluYWxDb2xvciA9IG5ldyBzcGluZS5Db2xvcigxLCAxLCAxLCAxKTtcbmxldCBfZGFya0NvbG9yID0gbmV3IHNwaW5lLkNvbG9yKDEsIDEsIDEsIDEpO1xubGV0IF9xdWFkVHJpYW5nbGVzID0gWzAsIDEsIDIsIDIsIDMsIDBdO1xuXG4vL0NhY2hlIGFsbCBmcmFtZXMgaW4gYW4gYW5pbWF0aW9uXG5sZXQgQW5pbWF0aW9uQ2FjaGUgPSBjYy5DbGFzcyh7XG4gICAgY3RvcigpIHtcbiAgICAgICAgdGhpcy5fcHJpdmF0ZU1vZGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faW5pdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2ludmFsaWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9lbmFibGVDYWNoZUF0dGFjaGVkSW5mbyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmZyYW1lcyA9IFtdO1xuICAgICAgICB0aGlzLnRvdGFsVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2ZyYW1lSWR4ID0gLTE7XG4gICAgICAgIHRoaXMuaXNDb21wbGV0ZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLl9za2VsZXRvbkluZm8gPSBudWxsO1xuICAgICAgICB0aGlzLl9hbmltYXRpb25OYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5fdGVtcFNlZ21lbnRzID0gbnVsbDtcbiAgICAgICAgdGhpcy5fdGVtcENvbG9ycyA9IG51bGw7XG4gICAgICAgIHRoaXMuX3RlbXBCb25lSW5mb3MgPSBudWxsO1xuICAgIH0sXG5cbiAgICBpbml0KHNrZWxldG9uSW5mbywgYW5pbWF0aW9uTmFtZSkge1xuICAgICAgICB0aGlzLl9pbml0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9hbmltYXRpb25OYW1lID0gYW5pbWF0aW9uTmFtZTtcbiAgICAgICAgdGhpcy5fc2tlbGV0b25JbmZvID0gc2tlbGV0b25JbmZvO1xuICAgIH0sXG5cbiAgICAvLyBDbGVhciB0ZXh0dXJlIHF1b3RlLlxuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLl9pbml0ZWQgPSBmYWxzZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSB0aGlzLmZyYW1lcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBmcmFtZSA9IHRoaXMuZnJhbWVzW2ldO1xuICAgICAgICAgICAgZnJhbWUuc2VnbWVudHMubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmludmFsaWRBbGxGcmFtZSgpO1xuICAgIH0sXG5cbiAgICBiaW5kKGxpc3RlbmVyKSB7XG4gICAgICAgIGxldCBjb21wbGV0ZUhhbmRsZSA9IGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICAgICAgaWYgKGVudHJ5ICYmIGVudHJ5LmFuaW1hdGlvbi5uYW1lID09PSB0aGlzLl9hbmltYXRpb25OYW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0NvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgICBsaXN0ZW5lci5jb21wbGV0ZSA9IGNvbXBsZXRlSGFuZGxlO1xuICAgIH0sXG5cbiAgICB1bmJpbmQobGlzdGVuZXIpIHtcbiAgICAgICAgbGlzdGVuZXIuY29tcGxldGUgPSBudWxsO1xuICAgIH0sXG5cbiAgICBiZWdpbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pbnZhbGlkKSByZXR1cm47XG5cbiAgICAgICAgbGV0IHNrZWxldG9uSW5mbyA9IHRoaXMuX3NrZWxldG9uSW5mbztcbiAgICAgICAgbGV0IHByZUFuaW1hdGlvbkNhY2hlID0gc2tlbGV0b25JbmZvLmN1ckFuaW1hdGlvbkNhY2hlO1xuXG4gICAgICAgIGlmIChwcmVBbmltYXRpb25DYWNoZSAmJiBwcmVBbmltYXRpb25DYWNoZSAhPT0gdGhpcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3ByaXZhdGVNb2RlKSB7XG4gICAgICAgICAgICAgICAgLy8gUHJpdmF0ZSBjYWNoZSBtb2RlIGp1c3QgaW52YWxpZCBwcmUgYW5pbWF0aW9uIGZyYW1lLlxuICAgICAgICAgICAgICAgIHByZUFuaW1hdGlvbkNhY2hlLmludmFsaWRBbGxGcmFtZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBwcmUgYW5pbWF0aW9uIG5vdCBmaW5pc2hlZCwgcGxheSBpdCB0byB0aGUgZW5kLlxuICAgICAgICAgICAgICAgIHByZUFuaW1hdGlvbkNhY2hlLnVwZGF0ZVRvRnJhbWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBza2VsZXRvbiA9IHNrZWxldG9uSW5mby5za2VsZXRvbjtcbiAgICAgICAgbGV0IGxpc3RlbmVyID0gc2tlbGV0b25JbmZvLmxpc3RlbmVyO1xuICAgICAgICBsZXQgc3RhdGUgPSBza2VsZXRvbkluZm8uc3RhdGU7XG5cbiAgICAgICAgbGV0IGFuaW1hdGlvbiA9IHNrZWxldG9uLmRhdGEuZmluZEFuaW1hdGlvbih0aGlzLl9hbmltYXRpb25OYW1lKTtcbiAgICAgICAgc3RhdGUuc2V0QW5pbWF0aW9uV2l0aCgwLCBhbmltYXRpb24sIGZhbHNlKTtcbiAgICAgICAgdGhpcy5iaW5kKGxpc3RlbmVyKTtcblxuICAgICAgICAvLyByZWNvcmQgY3VyIGFuaW1hdGlvbiBjYWNoZVxuICAgICAgICBza2VsZXRvbkluZm8uY3VyQW5pbWF0aW9uQ2FjaGUgPSB0aGlzO1xuICAgICAgICB0aGlzLl9mcmFtZUlkeCA9IC0xO1xuICAgICAgICB0aGlzLmlzQ29tcGxldGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMudG90YWxUaW1lID0gMDtcbiAgICAgICAgdGhpcy5faW52YWxpZCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBlbmQoKSB7XG4gICAgICAgIGlmICghdGhpcy5fbmVlZFRvVXBkYXRlKCkpIHtcbiAgICAgICAgICAgIC8vIGNsZWFyIGN1ciBhbmltYXRpb24gY2FjaGVcbiAgICAgICAgICAgIHRoaXMuX3NrZWxldG9uSW5mby5jdXJBbmltYXRpb25DYWNoZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmZyYW1lcy5sZW5ndGggPSB0aGlzLl9mcmFtZUlkeCArIDE7XG4gICAgICAgICAgICB0aGlzLmlzQ29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMudW5iaW5kKHRoaXMuX3NrZWxldG9uSW5mby5saXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX25lZWRUb1VwZGF0ZSh0b0ZyYW1lSWR4KSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5pc0NvbXBsZXRlZCAmJlxuICAgICAgICAgICAgdGhpcy50b3RhbFRpbWUgPCBNYXhDYWNoZVRpbWUgJiZcbiAgICAgICAgICAgICh0b0ZyYW1lSWR4ID09IHVuZGVmaW5lZCB8fCB0aGlzLl9mcmFtZUlkeCA8IHRvRnJhbWVJZHgpO1xuICAgIH0sXG5cbiAgICB1cGRhdGVUb0ZyYW1lKHRvRnJhbWVJZHgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pbml0ZWQpIHJldHVybjtcblxuICAgICAgICB0aGlzLmJlZ2luKCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9uZWVkVG9VcGRhdGUodG9GcmFtZUlkeCkpIHJldHVybjtcblxuICAgICAgICBsZXQgc2tlbGV0b25JbmZvID0gdGhpcy5fc2tlbGV0b25JbmZvO1xuICAgICAgICBsZXQgc2tlbGV0b24gPSBza2VsZXRvbkluZm8uc2tlbGV0b247XG4gICAgICAgIGxldCBjbGlwcGVyID0gc2tlbGV0b25JbmZvLmNsaXBwZXI7XG4gICAgICAgIGxldCBzdGF0ZSA9IHNrZWxldG9uSW5mby5zdGF0ZTtcblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICAvLyBTb2xpZCB1cGRhdGUgZnJhbWUgcmF0ZSAxLzYwLlxuICAgICAgICAgICAgc2tlbGV0b24udXBkYXRlKEZyYW1lVGltZSk7XG4gICAgICAgICAgICBzdGF0ZS51cGRhdGUoRnJhbWVUaW1lKTtcbiAgICAgICAgICAgIHN0YXRlLmFwcGx5KHNrZWxldG9uKTtcbiAgICAgICAgICAgIHNrZWxldG9uLnVwZGF0ZVdvcmxkVHJhbnNmb3JtKCk7XG4gICAgICAgICAgICB0aGlzLl9mcmFtZUlkeCsrO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlRnJhbWUoc2tlbGV0b24sIGNsaXBwZXIsIHRoaXMuX2ZyYW1lSWR4KTtcbiAgICAgICAgICAgIHRoaXMudG90YWxUaW1lICs9IEZyYW1lVGltZTtcbiAgICAgICAgfSB3aGlsZSAodGhpcy5fbmVlZFRvVXBkYXRlKHRvRnJhbWVJZHgpKTtcblxuICAgICAgICB0aGlzLmVuZCgpO1xuICAgIH0sXG5cbiAgICBpc0luaXRlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luaXRlZDtcbiAgICB9LFxuXG4gICAgaXNJbnZhbGlkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52YWxpZDtcbiAgICB9LFxuXG4gICAgaW52YWxpZEFsbEZyYW1lKCkge1xuICAgICAgICB0aGlzLmlzQ29tcGxldGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2ludmFsaWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICB1cGRhdGVBbGxGcmFtZSgpIHtcbiAgICAgICAgdGhpcy5pbnZhbGlkQWxsRnJhbWUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVUb0ZyYW1lKCk7XG4gICAgfSxcblxuICAgIGVuYWJsZUNhY2hlQXR0YWNoZWRJbmZvKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2VuYWJsZUNhY2hlQXR0YWNoZWRJbmZvKSB7XG4gICAgICAgICAgICB0aGlzLl9lbmFibGVDYWNoZUF0dGFjaGVkSW5mbyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmludmFsaWRBbGxGcmFtZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVGcmFtZShza2VsZXRvbiwgY2xpcHBlciwgaW5kZXgpIHtcbiAgICAgICAgX3ZmT2Zmc2V0ID0gMDtcbiAgICAgICAgX2JvbmVJbmZvT2Zmc2V0ID0gMDtcbiAgICAgICAgX2luZGV4T2Zmc2V0ID0gMDtcbiAgICAgICAgX3ZlcnRleE9mZnNldCA9IDA7XG4gICAgICAgIF9wcmVUZXhVcmwgPSBudWxsO1xuICAgICAgICBfcHJlQmxlbmRNb2RlID0gbnVsbDtcbiAgICAgICAgX3NlZ1ZDb3VudCA9IDA7XG4gICAgICAgIF9zZWdJQ291bnQgPSAwO1xuICAgICAgICBfc2VnT2Zmc2V0ID0gMDtcbiAgICAgICAgX2NvbG9yT2Zmc2V0ID0gMDtcbiAgICAgICAgX3ByZUZpbmFsQ29sb3IgPSBudWxsO1xuICAgICAgICBfcHJlRGFya0NvbG9yID0gbnVsbDtcblxuICAgICAgICB0aGlzLmZyYW1lc1tpbmRleF0gPSB0aGlzLmZyYW1lc1tpbmRleF0gfHwge1xuICAgICAgICAgICAgc2VnbWVudHM6IFtdLFxuICAgICAgICAgICAgY29sb3JzOiBbXSxcbiAgICAgICAgICAgIGJvbmVJbmZvczogW10sXG4gICAgICAgICAgICB2ZXJ0aWNlczogbnVsbCxcbiAgICAgICAgICAgIHVpbnRWZXJ0OiBudWxsLFxuICAgICAgICAgICAgaW5kaWNlczogbnVsbCxcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGZyYW1lID0gdGhpcy5mcmFtZXNbaW5kZXhdO1xuXG4gICAgICAgIGxldCBzZWdtZW50cyA9IHRoaXMuX3RlbXBTZWdtZW50cyA9IGZyYW1lLnNlZ21lbnRzO1xuICAgICAgICBsZXQgY29sb3JzID0gdGhpcy5fdGVtcENvbG9ycyA9IGZyYW1lLmNvbG9ycztcbiAgICAgICAgbGV0IGJvbmVJbmZvcyA9IHRoaXMuX3RlbXBCb25lSW5mb3MgPSBmcmFtZS5ib25lSW5mb3M7XG4gICAgICAgIHRoaXMuX3RyYXZlcnNlU2tlbGV0b24oc2tlbGV0b24sIGNsaXBwZXIpO1xuICAgICAgICBpZiAoX2NvbG9yT2Zmc2V0ID4gMCkge1xuICAgICAgICAgICAgY29sb3JzW19jb2xvck9mZnNldCAtIDFdLnZmT2Zmc2V0ID0gX3ZmT2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIGNvbG9ycy5sZW5ndGggPSBfY29sb3JPZmZzZXQ7XG4gICAgICAgIGJvbmVJbmZvcy5sZW5ndGggPSBfYm9uZUluZm9PZmZzZXQ7XG4gICAgICAgIC8vIEhhbmRsZSBwcmUgc2VnbWVudC5cbiAgICAgICAgbGV0IHByZVNlZ09mZnNldCA9IF9zZWdPZmZzZXQgLSAxO1xuICAgICAgICBpZiAocHJlU2VnT2Zmc2V0ID49IDApIHtcbiAgICAgICAgICAgIC8vIEp1ZGdlIHNlZ21lbnQgdmVydGV4IGNvdW50IGlzIG5vdCBlbXB0eS5cbiAgICAgICAgICAgIGlmIChfc2VnSUNvdW50ID4gMCkge1xuICAgICAgICAgICAgICAgIGxldCBwcmVTZWdJbmZvID0gc2VnbWVudHNbcHJlU2VnT2Zmc2V0XTtcbiAgICAgICAgICAgICAgICBwcmVTZWdJbmZvLmluZGV4Q291bnQgPSBfc2VnSUNvdW50O1xuICAgICAgICAgICAgICAgIHByZVNlZ0luZm8udmZDb3VudCA9IF9zZWdWQ291bnQgKiBfcGVyVmVydGV4U2l6ZTtcbiAgICAgICAgICAgICAgICBwcmVTZWdJbmZvLnZlcnRleENvdW50ID0gX3NlZ1ZDb3VudDtcbiAgICAgICAgICAgICAgICBzZWdtZW50cy5sZW5ndGggPSBfc2VnT2Zmc2V0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBEaXNjYXJkIHByZSBzZWdtZW50LlxuICAgICAgICAgICAgICAgIHNlZ21lbnRzLmxlbmd0aCA9IF9zZWdPZmZzZXQgLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2VnbWVudHMgaXMgZW1wdHksZGlzY2FyZCBhbGwgc2VnbWVudHMuXG4gICAgICAgIGlmIChzZWdtZW50cy5sZW5ndGggPT0gMCkgcmV0dXJuO1xuXG4gICAgICAgIC8vIEZpbGwgdmVydGljZXNcbiAgICAgICAgbGV0IHZlcnRpY2VzID0gZnJhbWUudmVydGljZXM7XG4gICAgICAgIGxldCB1aW50VmVydCA9IGZyYW1lLnVpbnRWZXJ0O1xuICAgICAgICBpZiAoIXZlcnRpY2VzIHx8IHZlcnRpY2VzLmxlbmd0aCA8IF92Zk9mZnNldCkge1xuICAgICAgICAgICAgdmVydGljZXMgPSBmcmFtZS52ZXJ0aWNlcyA9IG5ldyBGbG9hdDMyQXJyYXkoX3ZmT2Zmc2V0KTtcbiAgICAgICAgICAgIHVpbnRWZXJ0ID0gZnJhbWUudWludFZlcnQgPSBuZXcgVWludDMyQXJyYXkodmVydGljZXMuYnVmZmVyKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaiA9IDA7IGkgPCBfdmZPZmZzZXQ7KSB7XG4gICAgICAgICAgICB2ZXJ0aWNlc1tpKytdID0gX3ZlcnRpY2VzW2orK107IC8vIHhcbiAgICAgICAgICAgIHZlcnRpY2VzW2krK10gPSBfdmVydGljZXNbaisrXTsgLy8geVxuICAgICAgICAgICAgdmVydGljZXNbaSsrXSA9IF92ZXJ0aWNlc1tqKytdOyAvLyB1XG4gICAgICAgICAgICB2ZXJ0aWNlc1tpKytdID0gX3ZlcnRpY2VzW2orK107IC8vIHZcbiAgICAgICAgICAgIHVpbnRWZXJ0W2krK10gPSBfdmVydGljZXNbaisrXTsgLy8gY29sb3IxXG4gICAgICAgICAgICB1aW50VmVydFtpKytdID0gX3ZlcnRpY2VzW2orK107IC8vIGNvbG9yMlxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmlsbCBpbmRpY2VzXG4gICAgICAgIGxldCBpbmRpY2VzID0gZnJhbWUuaW5kaWNlcztcbiAgICAgICAgaWYgKCFpbmRpY2VzIHx8IGluZGljZXMubGVuZ3RoIDwgX2luZGV4T2Zmc2V0KSB7XG4gICAgICAgICAgICBpbmRpY2VzID0gZnJhbWUuaW5kaWNlcyA9IG5ldyBVaW50MTZBcnJheShfaW5kZXhPZmZzZXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfaW5kZXhPZmZzZXQ7IGkrKykge1xuICAgICAgICAgICAgaW5kaWNlc1tpXSA9IF9pbmRpY2VzW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgZnJhbWUudmVydGljZXMgPSB2ZXJ0aWNlcztcbiAgICAgICAgZnJhbWUudWludFZlcnQgPSB1aW50VmVydDtcbiAgICAgICAgZnJhbWUuaW5kaWNlcyA9IGluZGljZXM7XG4gICAgfSxcblxuICAgIGZpbGxWZXJ0aWNlcyhza2VsZXRvbkNvbG9yLCBhdHRhY2htZW50Q29sb3IsIHNsb3RDb2xvciwgY2xpcHBlciwgc2xvdCkge1xuXG4gICAgICAgIF90ZW1wYSA9IHNsb3RDb2xvci5hICogYXR0YWNobWVudENvbG9yLmEgKiBza2VsZXRvbkNvbG9yLmEgKiAyNTU7XG4gICAgICAgIF90ZW1wciA9IGF0dGFjaG1lbnRDb2xvci5yICogc2tlbGV0b25Db2xvci5yICogMjU1O1xuICAgICAgICBfdGVtcGcgPSBhdHRhY2htZW50Q29sb3IuZyAqIHNrZWxldG9uQ29sb3IuZyAqIDI1NTtcbiAgICAgICAgX3RlbXBiID0gYXR0YWNobWVudENvbG9yLmIgKiBza2VsZXRvbkNvbG9yLmIgKiAyNTU7XG5cbiAgICAgICAgX2ZpbmFsQ29sb3IuciA9IF90ZW1wciAqIHNsb3RDb2xvci5yO1xuICAgICAgICBfZmluYWxDb2xvci5nID0gX3RlbXBnICogc2xvdENvbG9yLmc7XG4gICAgICAgIF9maW5hbENvbG9yLmIgPSBfdGVtcGIgKiBzbG90Q29sb3IuYjtcbiAgICAgICAgX2ZpbmFsQ29sb3IuYSA9IF90ZW1wYTtcblxuICAgICAgICBpZiAoc2xvdC5kYXJrQ29sb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgX2RhcmtDb2xvci5zZXQoMC4wLCAwLCAwLCAxLjApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX2RhcmtDb2xvci5yID0gc2xvdC5kYXJrQ29sb3IuciAqIF90ZW1wcjtcbiAgICAgICAgICAgIF9kYXJrQ29sb3IuZyA9IHNsb3QuZGFya0NvbG9yLmcgKiBfdGVtcGc7XG4gICAgICAgICAgICBfZGFya0NvbG9yLmIgPSBzbG90LmRhcmtDb2xvci5iICogX3RlbXBiO1xuICAgICAgICB9XG4gICAgICAgIF9kYXJrQ29sb3IuYSA9IDA7XG5cbiAgICAgICAgX2ZpbmFsQ29sb3IzMiA9ICgoX2ZpbmFsQ29sb3IuYSA8PCAyNCkgPj4+IDApICsgKF9maW5hbENvbG9yLmIgPDwgMTYpICsgKF9maW5hbENvbG9yLmcgPDwgOCkgKyBfZmluYWxDb2xvci5yO1xuICAgICAgICBfZGFya0NvbG9yMzIgPSAoKF9kYXJrQ29sb3IuYSA8PCAyNCkgPj4+IDApICsgKF9kYXJrQ29sb3IuYiA8PCAxNikgKyAoX2RhcmtDb2xvci5nIDw8IDgpICsgX2RhcmtDb2xvci5yO1xuXG4gICAgICAgIGlmIChfcHJlRmluYWxDb2xvciAhPT0gX2ZpbmFsQ29sb3IzMiB8fCBfcHJlRGFya0NvbG9yICE9PSBfZGFya0NvbG9yMzIpIHtcbiAgICAgICAgICAgIGxldCBjb2xvcnMgPSB0aGlzLl90ZW1wQ29sb3JzO1xuICAgICAgICAgICAgX3ByZUZpbmFsQ29sb3IgPSBfZmluYWxDb2xvcjMyO1xuICAgICAgICAgICAgX3ByZURhcmtDb2xvciA9IF9kYXJrQ29sb3IzMjtcbiAgICAgICAgICAgIGlmIChfY29sb3JPZmZzZXQgPiAwKSB7XG4gICAgICAgICAgICAgICAgY29sb3JzW19jb2xvck9mZnNldCAtIDFdLnZmT2Zmc2V0ID0gX3ZmT2Zmc2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29sb3JzW19jb2xvck9mZnNldCsrXSA9IHtcbiAgICAgICAgICAgICAgICBmcjogX2ZpbmFsQ29sb3IucixcbiAgICAgICAgICAgICAgICBmZzogX2ZpbmFsQ29sb3IuZyxcbiAgICAgICAgICAgICAgICBmYjogX2ZpbmFsQ29sb3IuYixcbiAgICAgICAgICAgICAgICBmYTogX2ZpbmFsQ29sb3IuYSxcbiAgICAgICAgICAgICAgICBkcjogX2RhcmtDb2xvci5yLFxuICAgICAgICAgICAgICAgIGRnOiBfZGFya0NvbG9yLmcsXG4gICAgICAgICAgICAgICAgZGI6IF9kYXJrQ29sb3IuYixcbiAgICAgICAgICAgICAgICBkYTogX2RhcmtDb2xvci5hLFxuICAgICAgICAgICAgICAgIHZmT2Zmc2V0OiAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNsaXBwZXIuaXNDbGlwcGluZygpKSB7XG5cbiAgICAgICAgICAgIGZvciAobGV0IHYgPSBfdmZPZmZzZXQsIG4gPSBfdmZPZmZzZXQgKyBfdmZDb3VudDsgdiA8IG47IHYgKz0gX3BlclZlcnRleFNpemUpIHtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbdiArIDRdID0gX2ZpbmFsQ29sb3IzMjsgICAgIC8vIGxpZ2h0IGNvbG9yXG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzW3YgKyA1XSA9IF9kYXJrQ29sb3IzMjsgICAgICAvLyBkYXJrIGNvbG9yXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNsaXBwZXIuY2xpcFRyaWFuZ2xlcyhfdmVydGljZXMsIF92ZkNvdW50LCBfaW5kaWNlcywgX2luZGV4Q291bnQsIF92ZXJ0aWNlcywgX2ZpbmFsQ29sb3IsIF9kYXJrQ29sb3IsIHRydWUsIF9wZXJWZXJ0ZXhTaXplLCBfaW5kZXhPZmZzZXQsIF92Zk9mZnNldCwgX3ZmT2Zmc2V0ICsgMik7XG4gICAgICAgICAgICBsZXQgY2xpcHBlZFZlcnRpY2VzID0gY2xpcHBlci5jbGlwcGVkVmVydGljZXM7XG4gICAgICAgICAgICBsZXQgY2xpcHBlZFRyaWFuZ2xlcyA9IGNsaXBwZXIuY2xpcHBlZFRyaWFuZ2xlcztcblxuICAgICAgICAgICAgLy8gaW5zdXJlIGNhcGFjaXR5XG4gICAgICAgICAgICBfaW5kZXhDb3VudCA9IGNsaXBwZWRUcmlhbmdsZXMubGVuZ3RoO1xuICAgICAgICAgICAgX3ZmQ291bnQgPSBjbGlwcGVkVmVydGljZXMubGVuZ3RoIC8gX3BlckNsaXBWZXJ0ZXhTaXplICogX3BlclZlcnRleFNpemU7XG5cbiAgICAgICAgICAgIC8vIGZpbGwgaW5kaWNlc1xuICAgICAgICAgICAgZm9yIChsZXQgaWkgPSAwLCBqaiA9IF9pbmRleE9mZnNldCwgbm4gPSBjbGlwcGVkVHJpYW5nbGVzLmxlbmd0aDsgaWkgPCBubjspIHtcbiAgICAgICAgICAgICAgICBfaW5kaWNlc1tqaisrXSA9IGNsaXBwZWRUcmlhbmdsZXNbaWkrK107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGZpbGwgdmVydGljZXMgY29udGFpbiB4IHkgdSB2IGxpZ2h0IGNvbG9yIGRhcmsgY29sb3JcbiAgICAgICAgICAgIGZvciAobGV0IHYgPSAwLCBuID0gY2xpcHBlZFZlcnRpY2VzLmxlbmd0aCwgb2Zmc2V0ID0gX3ZmT2Zmc2V0OyB2IDwgbjsgdiArPSAxMiwgb2Zmc2V0ICs9IF9wZXJWZXJ0ZXhTaXplKSB7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzW29mZnNldF0gPSBjbGlwcGVkVmVydGljZXNbdl07ICAgICAgICAgICAgICAgICAvLyB4XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzW29mZnNldCArIDFdID0gY2xpcHBlZFZlcnRpY2VzW3YgKyAxXTsgICAgICAgICAvLyB5XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzW29mZnNldCArIDJdID0gY2xpcHBlZFZlcnRpY2VzW3YgKyA2XTsgICAgICAgICAvLyB1XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzW29mZnNldCArIDNdID0gY2xpcHBlZFZlcnRpY2VzW3YgKyA3XTsgICAgICAgICAvLyB2XG5cbiAgICAgICAgICAgICAgICBfdmVydGljZXNbb2Zmc2V0ICsgNF0gPSBfZmluYWxDb2xvcjMyO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1tvZmZzZXQgKyA1XSA9IF9kYXJrQ29sb3IzMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdHJhdmVyc2VTa2VsZXRvbihza2VsZXRvbiwgY2xpcHBlcikge1xuICAgICAgICBsZXQgc2VnbWVudHMgPSB0aGlzLl90ZW1wU2VnbWVudHM7XG4gICAgICAgIGxldCBib25lSW5mb3MgPSB0aGlzLl90ZW1wQm9uZUluZm9zO1xuICAgICAgICBsZXQgc2tlbGV0b25Db2xvciA9IHNrZWxldG9uLmNvbG9yO1xuICAgICAgICBsZXQgYXR0YWNobWVudCwgYXR0YWNobWVudENvbG9yLCBzbG90Q29sb3IsIHV2cywgdHJpYW5nbGVzO1xuICAgICAgICBsZXQgaXNSZWdpb24sIGlzTWVzaCwgaXNDbGlwO1xuICAgICAgICBsZXQgdGV4dHVyZTtcbiAgICAgICAgbGV0IHByZVNlZ09mZnNldCwgcHJlU2VnSW5mbztcbiAgICAgICAgbGV0IGJsZW5kTW9kZTtcbiAgICAgICAgbGV0IHNsb3Q7XG5cbiAgICAgICAgbGV0IGJvbmVzID0gc2tlbGV0b24uYm9uZXM7XG4gICAgICAgIGlmICh0aGlzLl9lbmFibGVDYWNoZUF0dGFjaGVkSW5mbykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBib25lcy5sZW5ndGg7IGkgPCBsOyBpKyssIF9ib25lSW5mb09mZnNldCsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGJvbmUgPSBib25lc1tpXTtcbiAgICAgICAgICAgICAgICBsZXQgYm9uZUluZm8gPSBib25lSW5mb3NbX2JvbmVJbmZvT2Zmc2V0XTtcbiAgICAgICAgICAgICAgICBpZiAoIWJvbmVJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIGJvbmVJbmZvID0gYm9uZUluZm9zW19ib25lSW5mb09mZnNldF0gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYm9uZUluZm8uYSA9IGJvbmUuYTtcbiAgICAgICAgICAgICAgICBib25lSW5mby5iID0gYm9uZS5iO1xuICAgICAgICAgICAgICAgIGJvbmVJbmZvLmMgPSBib25lLmM7XG4gICAgICAgICAgICAgICAgYm9uZUluZm8uZCA9IGJvbmUuZDtcbiAgICAgICAgICAgICAgICBib25lSW5mby53b3JsZFggPSBib25lLndvcmxkWDtcbiAgICAgICAgICAgICAgICBib25lSW5mby53b3JsZFkgPSBib25lLndvcmxkWTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IHNsb3RJZHggPSAwLCBzbG90Q291bnQgPSBza2VsZXRvbi5kcmF3T3JkZXIubGVuZ3RoOyBzbG90SWR4IDwgc2xvdENvdW50OyBzbG90SWR4KyspIHtcbiAgICAgICAgICAgIHNsb3QgPSBza2VsZXRvbi5kcmF3T3JkZXJbc2xvdElkeF07XG5cbiAgICAgICAgICAgIF92ZkNvdW50ID0gMDtcbiAgICAgICAgICAgIF9pbmRleENvdW50ID0gMDtcblxuICAgICAgICAgICAgYXR0YWNobWVudCA9IHNsb3QuZ2V0QXR0YWNobWVudCgpO1xuICAgICAgICAgICAgaWYgKCFhdHRhY2htZW50KSB7XG4gICAgICAgICAgICAgICAgY2xpcHBlci5jbGlwRW5kV2l0aFNsb3Qoc2xvdCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlzUmVnaW9uID0gYXR0YWNobWVudCBpbnN0YW5jZW9mIHNwaW5lLlJlZ2lvbkF0dGFjaG1lbnQ7XG4gICAgICAgICAgICBpc01lc2ggPSBhdHRhY2htZW50IGluc3RhbmNlb2Ygc3BpbmUuTWVzaEF0dGFjaG1lbnQ7XG4gICAgICAgICAgICBpc0NsaXAgPSBhdHRhY2htZW50IGluc3RhbmNlb2Ygc3BpbmUuQ2xpcHBpbmdBdHRhY2htZW50O1xuXG4gICAgICAgICAgICBpZiAoaXNDbGlwKSB7XG4gICAgICAgICAgICAgICAgY2xpcHBlci5jbGlwU3RhcnQoc2xvdCwgYXR0YWNobWVudCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaXNSZWdpb24gJiYgIWlzTWVzaCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0ZXh0dXJlID0gYXR0YWNobWVudC5yZWdpb24udGV4dHVyZS5fdGV4dHVyZTtcbiAgICAgICAgICAgIGlmICghdGV4dHVyZSkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBibGVuZE1vZGUgPSBzbG90LmRhdGEuYmxlbmRNb2RlO1xuICAgICAgICAgICAgaWYgKF9wcmVUZXhVcmwgIT09IHRleHR1cmUubmF0aXZlVXJsIHx8IF9wcmVCbGVuZE1vZGUgIT09IGJsZW5kTW9kZSkge1xuICAgICAgICAgICAgICAgIF9wcmVUZXhVcmwgPSB0ZXh0dXJlLm5hdGl2ZVVybDtcbiAgICAgICAgICAgICAgICBfcHJlQmxlbmRNb2RlID0gYmxlbmRNb2RlO1xuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBwcmUgc2VnbWVudC5cbiAgICAgICAgICAgICAgICBwcmVTZWdPZmZzZXQgPSBfc2VnT2Zmc2V0IC0gMTtcbiAgICAgICAgICAgICAgICBpZiAocHJlU2VnT2Zmc2V0ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9zZWdJQ291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVTZWdJbmZvID0gc2VnbWVudHNbcHJlU2VnT2Zmc2V0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZVNlZ0luZm8uaW5kZXhDb3VudCA9IF9zZWdJQ291bnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVTZWdJbmZvLnZlcnRleENvdW50ID0gX3NlZ1ZDb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZVNlZ0luZm8udmZDb3VudCA9IF9zZWdWQ291bnQgKiBfcGVyVmVydGV4U2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIERpc2NhcmQgcHJlIHNlZ21lbnQuXG4gICAgICAgICAgICAgICAgICAgICAgICBfc2VnT2Zmc2V0LS07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIG5vdyBzZWdtZW50LlxuICAgICAgICAgICAgICAgIHNlZ21lbnRzW19zZWdPZmZzZXRdID0ge1xuICAgICAgICAgICAgICAgICAgICB0ZXg6IHRleHR1cmUsXG4gICAgICAgICAgICAgICAgICAgIGJsZW5kTW9kZTogYmxlbmRNb2RlLFxuICAgICAgICAgICAgICAgICAgICBpbmRleENvdW50OiAwLFxuICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhDb3VudDogMCxcbiAgICAgICAgICAgICAgICAgICAgdmZDb3VudDogMFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgX3NlZ09mZnNldCsrO1xuICAgICAgICAgICAgICAgIF9zZWdJQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgIF9zZWdWQ291bnQgPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaXNSZWdpb24pIHtcblxuICAgICAgICAgICAgICAgIHRyaWFuZ2xlcyA9IF9xdWFkVHJpYW5nbGVzO1xuXG4gICAgICAgICAgICAgICAgLy8gaW5zdXJlIGNhcGFjaXR5XG4gICAgICAgICAgICAgICAgX3ZmQ291bnQgPSA0ICogX3BlclZlcnRleFNpemU7XG4gICAgICAgICAgICAgICAgX2luZGV4Q291bnQgPSA2O1xuXG4gICAgICAgICAgICAgICAgLy8gY29tcHV0ZSB2ZXJ0ZXggYW5kIGZpbGwgeCB5XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudC5jb21wdXRlV29ybGRWZXJ0aWNlcyhzbG90LmJvbmUsIF92ZXJ0aWNlcywgX3ZmT2Zmc2V0LCBfcGVyVmVydGV4U2l6ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc01lc2gpIHtcblxuICAgICAgICAgICAgICAgIHRyaWFuZ2xlcyA9IGF0dGFjaG1lbnQudHJpYW5nbGVzO1xuXG4gICAgICAgICAgICAgICAgLy8gaW5zdXJlIGNhcGFjaXR5XG4gICAgICAgICAgICAgICAgX3ZmQ291bnQgPSAoYXR0YWNobWVudC53b3JsZFZlcnRpY2VzTGVuZ3RoID4+IDEpICogX3BlclZlcnRleFNpemU7XG4gICAgICAgICAgICAgICAgX2luZGV4Q291bnQgPSB0cmlhbmdsZXMubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgLy8gY29tcHV0ZSB2ZXJ0ZXggYW5kIGZpbGwgeCB5XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudC5jb21wdXRlV29ybGRWZXJ0aWNlcyhzbG90LCAwLCBhdHRhY2htZW50LndvcmxkVmVydGljZXNMZW5ndGgsIF92ZXJ0aWNlcywgX3ZmT2Zmc2V0LCBfcGVyVmVydGV4U2l6ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfdmZDb3VudCA9PSAwIHx8IF9pbmRleENvdW50ID09IDApIHtcbiAgICAgICAgICAgICAgICBjbGlwcGVyLmNsaXBFbmRXaXRoU2xvdChzbG90KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZmlsbCBpbmRpY2VzXG4gICAgICAgICAgICBmb3IgKGxldCBpaSA9IDAsIGpqID0gX2luZGV4T2Zmc2V0LCBubiA9IHRyaWFuZ2xlcy5sZW5ndGg7IGlpIDwgbm47KSB7XG4gICAgICAgICAgICAgICAgX2luZGljZXNbamorK10gPSB0cmlhbmdsZXNbaWkrK107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGZpbGwgdSB2XG4gICAgICAgICAgICB1dnMgPSBhdHRhY2htZW50LnV2cztcbiAgICAgICAgICAgIGZvciAobGV0IHYgPSBfdmZPZmZzZXQsIG4gPSBfdmZPZmZzZXQgKyBfdmZDb3VudCwgdSA9IDA7IHYgPCBuOyB2ICs9IF9wZXJWZXJ0ZXhTaXplLCB1ICs9IDIpIHtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbdiArIDJdID0gdXZzW3VdOyAgICAgICAgICAgLy8gdVxuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1t2ICsgM10gPSB1dnNbdSArIDFdOyAgICAgICAvLyB2XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF0dGFjaG1lbnRDb2xvciA9IGF0dGFjaG1lbnQuY29sb3I7XG4gICAgICAgICAgICBzbG90Q29sb3IgPSBzbG90LmNvbG9yO1xuXG4gICAgICAgICAgICB0aGlzLmZpbGxWZXJ0aWNlcyhza2VsZXRvbkNvbG9yLCBhdHRhY2htZW50Q29sb3IsIHNsb3RDb2xvciwgY2xpcHBlciwgc2xvdCk7XG5cbiAgICAgICAgICAgIGlmIChfaW5kZXhDb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpaSA9IF9pbmRleE9mZnNldCwgbm4gPSBfaW5kZXhPZmZzZXQgKyBfaW5kZXhDb3VudDsgaWkgPCBubjsgaWkrKykge1xuICAgICAgICAgICAgICAgICAgICBfaW5kaWNlc1tpaV0gKz0gX3NlZ1ZDb3VudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX2luZGV4T2Zmc2V0ICs9IF9pbmRleENvdW50O1xuICAgICAgICAgICAgICAgIF92Zk9mZnNldCArPSBfdmZDb3VudDtcbiAgICAgICAgICAgICAgICBfdmVydGV4T2Zmc2V0ID0gX3ZmT2Zmc2V0IC8gX3BlclZlcnRleFNpemU7XG4gICAgICAgICAgICAgICAgX3NlZ0lDb3VudCArPSBfaW5kZXhDb3VudDtcbiAgICAgICAgICAgICAgICBfc2VnVkNvdW50ICs9IF92ZkNvdW50IC8gX3BlclZlcnRleFNpemU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xpcHBlci5jbGlwRW5kKCk7XG4gICAgfVxufSk7XG5cbmxldCBTa2VsZXRvbkNhY2hlID0gY2MuQ2xhc3Moe1xuICAgIGN0b3IoKSB7XG4gICAgICAgIHRoaXMuX3ByaXZhdGVNb2RlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2FuaW1hdGlvblBvb2wgPSB7fTtcbiAgICAgICAgdGhpcy5fc2tlbGV0b25DYWNoZSA9IHt9O1xuICAgIH0sXG5cbiAgICBlbmFibGVQcml2YXRlTW9kZSgpIHtcbiAgICAgICAgdGhpcy5fcHJpdmF0ZU1vZGUgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5fYW5pbWF0aW9uUG9vbCA9IHt9O1xuICAgICAgICB0aGlzLl9za2VsZXRvbkNhY2hlID0ge307XG4gICAgfSxcblxuICAgIHJlbW92ZVNrZWxldG9uKHV1aWQpIHtcbiAgICAgICAgLy8gdmFyIHNrZWxldG9uSW5mbyA9IHRoaXMuX3NrZWxldG9uQ2FjaGVbdXVpZF07XG4gICAgICAgIC8vIGlmICghc2tlbGV0b25JbmZvKSByZXR1cm47XG5cbiAgICAgICAgLy8gbGV0IGFuaW1hdGlvbnNDYWNoZSA9IHNrZWxldG9uSW5mby5hbmltYXRpb25zQ2FjaGU7XG4gICAgICAgIC8vIGZvciAodmFyIGFuaUtleSBpbiBhbmltYXRpb25zQ2FjaGUpIHtcbiAgICAgICAgLy8gICAgIC8vIENsZWFyIGNhY2hlIHRleHR1cmUsIGFuZCBwdXQgY2FjaGUgaW50byBwb29sLlxuICAgICAgICAvLyAgICAgLy8gTm8gbmVlZCB0byBjcmVhdGUgVHlwZWRBcnJheSBuZXh0IHRpbWUuXG4gICAgICAgIC8vICAgICBsZXQgYW5pbWF0aW9uQ2FjaGUgPSBhbmltYXRpb25zQ2FjaGVbYW5pS2V5XTtcbiAgICAgICAgLy8gICAgIGlmICghYW5pbWF0aW9uQ2FjaGUpIGNvbnRpbnVlO1xuICAgICAgICAvLyAgICAgdGhpcy5fYW5pbWF0aW9uUG9vbFt1dWlkICsgXCIjXCIgKyBhbmlLZXldID0gYW5pbWF0aW9uQ2FjaGU7XG4gICAgICAgIC8vICAgICBhbmltYXRpb25DYWNoZS5jbGVhcigpO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gZGVsZXRlIHRoaXMuX3NrZWxldG9uQ2FjaGVbdXVpZF07XG5cbiAgICAgICAgbGV0IHNrZWxldG9uSW5mbztcbiAgICAgICAgZm9yIChsZXQgayBpbiB0aGlzLl9za2VsZXRvbkNhY2hlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJywgayk7XG4gICAgICAgICAgICBsZXQgX3V1aWQgPSBrLnNwbGl0KCdfJylbMF07XG4gICAgICAgICAgICBpZiAoX3V1aWQgPT0gdXVpZCkge1xuICAgICAgICAgICAgICAgIHNrZWxldG9uSW5mbyA9IHRoaXMuX3NrZWxldG9uQ2FjaGVba107XG4gICAgICAgICAgICAgICAgaWYgKCFza2VsZXRvbkluZm8pIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgbGV0IGFuaW1hdGlvbnNDYWNoZSA9IHNrZWxldG9uSW5mby5hbmltYXRpb25zQ2FjaGU7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYW5pS2V5IGluIGFuaW1hdGlvbnNDYWNoZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBDbGVhciBjYWNoZSB0ZXh0dXJlLCBhbmQgcHV0IGNhY2hlIGludG8gcG9vbC5cbiAgICAgICAgICAgICAgICAgICAgLy8gTm8gbmVlZCB0byBjcmVhdGUgVHlwZWRBcnJheSBuZXh0IHRpbWUuXG4gICAgICAgICAgICAgICAgICAgIGxldCBhbmltYXRpb25DYWNoZSA9IGFuaW1hdGlvbnNDYWNoZVthbmlLZXldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWFuaW1hdGlvbkNhY2hlKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYW5pbWF0aW9uUG9vbFtfdXVpZCArIFwiI1wiICsgYW5pS2V5XSA9IGFuaW1hdGlvbkNhY2hlO1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25DYWNoZS5jbGVhcigpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9za2VsZXRvbkNhY2hlW2tdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGdldFNrZWxldG9uQ2FjaGUodXVpZCwgc2tlbGV0b25EYXRhKSB7XG4gICAgICAgIGxldCBza2VsZXRvbkluZm8gPSB0aGlzLl9za2VsZXRvbkNhY2hlW3V1aWRdO1xuICAgICAgICBpZiAoIXNrZWxldG9uSW5mbykge1xuICAgICAgICAgICAgbGV0IHNrZWxldG9uID0gbmV3IHNwaW5lLlNrZWxldG9uKHNrZWxldG9uRGF0YSk7XG4gICAgICAgICAgICBsZXQgY2xpcHBlciA9IG5ldyBzcGluZS5Ta2VsZXRvbkNsaXBwaW5nKCk7XG4gICAgICAgICAgICBsZXQgc3RhdGVEYXRhID0gbmV3IHNwaW5lLkFuaW1hdGlvblN0YXRlRGF0YShza2VsZXRvbi5kYXRhKTtcbiAgICAgICAgICAgIGxldCBzdGF0ZSA9IG5ldyBzcGluZS5BbmltYXRpb25TdGF0ZShzdGF0ZURhdGEpO1xuICAgICAgICAgICAgbGV0IGxpc3RlbmVyID0gbmV3IFRyYWNrRW50cnlMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIHN0YXRlLmFkZExpc3RlbmVyKGxpc3RlbmVyKTtcblxuICAgICAgICAgICAgdGhpcy5fc2tlbGV0b25DYWNoZVt1dWlkXSA9IHNrZWxldG9uSW5mbyA9IHtcbiAgICAgICAgICAgICAgICBza2VsZXRvbjogc2tlbGV0b24sXG4gICAgICAgICAgICAgICAgY2xpcHBlcjogY2xpcHBlcixcbiAgICAgICAgICAgICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICAgICAgICAgICAgbGlzdGVuZXI6IGxpc3RlbmVyLFxuICAgICAgICAgICAgICAgIC8vIENhY2hlIGFsbCBraW5kcyBvZiBhbmltYXRpb24gZnJhbWUuXG4gICAgICAgICAgICAgICAgLy8gV2hlbiBza2VsZXRvbiBpcyBkaXNwb3NlLCBjbGVhciBhbGwgYW5pbWF0aW9uIGNhY2hlLlxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbnNDYWNoZToge30sXG4gICAgICAgICAgICAgICAgY3VyQW5pbWF0aW9uQ2FjaGU6IG51bGxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNrZWxldG9uSW5mbztcbiAgICB9LFxuXG4gICAgZ2V0QW5pbWF0aW9uQ2FjaGUodXVpZCwgYW5pbWF0aW9uTmFtZSkge1xuICAgICAgICBsZXQgc2tlbGV0b25JbmZvID0gdGhpcy5fc2tlbGV0b25DYWNoZVt1dWlkXTtcbiAgICAgICAgaWYgKCFza2VsZXRvbkluZm8pIHJldHVybiBudWxsO1xuXG4gICAgICAgIGxldCBhbmltYXRpb25zQ2FjaGUgPSBza2VsZXRvbkluZm8uYW5pbWF0aW9uc0NhY2hlO1xuICAgICAgICByZXR1cm4gYW5pbWF0aW9uc0NhY2hlW2FuaW1hdGlvbk5hbWVdO1xuICAgIH0sXG5cbiAgICBpbnZhbGlkQW5pbWF0aW9uQ2FjaGUodXVpZCkge1xuICAgICAgICBsZXQgc2tlbGV0b25JbmZvID0gdGhpcy5fc2tlbGV0b25DYWNoZVt1dWlkXTtcbiAgICAgICAgbGV0IHNrZWxldG9uID0gc2tlbGV0b25JbmZvICYmIHNrZWxldG9uSW5mby5za2VsZXRvbjtcbiAgICAgICAgaWYgKCFza2VsZXRvbikgcmV0dXJuO1xuXG4gICAgICAgIGxldCBhbmltYXRpb25zQ2FjaGUgPSBza2VsZXRvbkluZm8uYW5pbWF0aW9uc0NhY2hlO1xuICAgICAgICBmb3IgKHZhciBhbmlLZXkgaW4gYW5pbWF0aW9uc0NhY2hlKSB7XG4gICAgICAgICAgICBsZXQgYW5pbWF0aW9uQ2FjaGUgPSBhbmltYXRpb25zQ2FjaGVbYW5pS2V5XTtcbiAgICAgICAgICAgIGFuaW1hdGlvbkNhY2hlLmludmFsaWRBbGxGcmFtZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGluaXRBbmltYXRpb25DYWNoZSh1dWlkLCBhbmltYXRpb25OYW1lKSB7XG4gICAgICAgIGlmICghYW5pbWF0aW9uTmFtZSkgcmV0dXJuIG51bGw7XG4gICAgICAgIGxldCBza2VsZXRvbkluZm8gPSB0aGlzLl9za2VsZXRvbkNhY2hlW3V1aWRdO1xuICAgICAgICBsZXQgc2tlbGV0b24gPSBza2VsZXRvbkluZm8gJiYgc2tlbGV0b25JbmZvLnNrZWxldG9uO1xuICAgICAgICBpZiAoIXNrZWxldG9uKSByZXR1cm4gbnVsbDtcblxuICAgICAgICBsZXQgYW5pbWF0aW9uID0gc2tlbGV0b24uZGF0YS5maW5kQW5pbWF0aW9uKGFuaW1hdGlvbk5hbWUpO1xuICAgICAgICBpZiAoIWFuaW1hdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYW5pbWF0aW9uc0NhY2hlID0gc2tlbGV0b25JbmZvLmFuaW1hdGlvbnNDYWNoZTtcbiAgICAgICAgbGV0IGFuaW1hdGlvbkNhY2hlID0gYW5pbWF0aW9uc0NhY2hlW2FuaW1hdGlvbk5hbWVdO1xuICAgICAgICBpZiAoIWFuaW1hdGlvbkNhY2hlKSB7XG4gICAgICAgICAgICAvLyBJZiBjYWNoZSBleGlzdCBpbiBwb29sLCB0aGVuIGp1c3QgdXNlIGl0LlxuICAgICAgICAgICAgbGV0IHBvb2xLZXkgPSB1dWlkICsgXCIjXCIgKyBhbmltYXRpb25OYW1lO1xuICAgICAgICAgICAgYW5pbWF0aW9uQ2FjaGUgPSB0aGlzLl9hbmltYXRpb25Qb29sW3Bvb2xLZXldO1xuICAgICAgICAgICAgaWYgKGFuaW1hdGlvbkNhY2hlKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2FuaW1hdGlvblBvb2xbcG9vbEtleV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbkNhY2hlID0gbmV3IEFuaW1hdGlvbkNhY2hlKCk7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uQ2FjaGUuX3ByaXZhdGVNb2RlID0gdGhpcy5fcHJpdmF0ZU1vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhbmltYXRpb25DYWNoZS5pbml0KHNrZWxldG9uSW5mbywgYW5pbWF0aW9uTmFtZSk7XG4gICAgICAgICAgICBhbmltYXRpb25zQ2FjaGVbYW5pbWF0aW9uTmFtZV0gPSBhbmltYXRpb25DYWNoZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYW5pbWF0aW9uQ2FjaGU7XG4gICAgfSxcblxuICAgIHVwZGF0ZUFuaW1hdGlvbkNhY2hlKHV1aWQsIGFuaW1hdGlvbk5hbWUpIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbk5hbWUpIHtcbiAgICAgICAgICAgIGxldCBhbmltYXRpb25DYWNoZSA9IHRoaXMuaW5pdEFuaW1hdGlvbkNhY2hlKHV1aWQsIGFuaW1hdGlvbk5hbWUpO1xuICAgICAgICAgICAgaWYgKCFhbmltYXRpb25DYWNoZSkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBhbmltYXRpb25DYWNoZS51cGRhdGVBbGxGcmFtZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHNrZWxldG9uSW5mbyA9IHRoaXMuX3NrZWxldG9uQ2FjaGVbdXVpZF07XG4gICAgICAgICAgICBsZXQgc2tlbGV0b24gPSBza2VsZXRvbkluZm8gJiYgc2tlbGV0b25JbmZvLnNrZWxldG9uO1xuICAgICAgICAgICAgaWYgKCFza2VsZXRvbikgcmV0dXJuO1xuXG4gICAgICAgICAgICBsZXQgYW5pbWF0aW9uc0NhY2hlID0gc2tlbGV0b25JbmZvLmFuaW1hdGlvbnNDYWNoZTtcbiAgICAgICAgICAgIGZvciAodmFyIGFuaUtleSBpbiBhbmltYXRpb25zQ2FjaGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgYW5pbWF0aW9uQ2FjaGUgPSBhbmltYXRpb25zQ2FjaGVbYW5pS2V5XTtcbiAgICAgICAgICAgICAgICBhbmltYXRpb25DYWNoZS51cGRhdGVBbGxGcmFtZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cblNrZWxldG9uQ2FjaGUuRnJhbWVUaW1lID0gRnJhbWVUaW1lO1xuU2tlbGV0b25DYWNoZS5zaGFyZWRDYWNoZSA9IG5ldyBTa2VsZXRvbkNhY2hlKCk7XG5tb2R1bGUuZXhwb3J0cyA9IFNrZWxldG9uQ2FjaGU7Il0sInNvdXJjZVJvb3QiOiIvIn0=