
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

var _quadTriangles = [0, 1, 2, 2, 3, 0];

var _offsets; //Cache all frames in an animation


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
    _offsets = [];
    this.frames[index] = this.frames[index] || {
      segments: [],
      colors: [],
      boneInfos: [],
      offsets: null,
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
    frame.offsets = _offsets;
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

    var drawOrder = skeleton.drawOrder; // console.log('------翻转---- depth: ' + skeleton.depth);
    // drawOrder.reverse();

    for (var slotIdx = 0, slotCount = drawOrder.length; slotIdx < slotCount; slotIdx++) {
      slot = drawOrder[slotIdx];
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

        _offsets.push(_vfOffset);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvZXh0ZW5zaW9ucy9zcGluZS9za2VsZXRvbi1jYWNoZS5qcyJdLCJuYW1lcyI6WyJUcmFja0VudHJ5TGlzdGVuZXJzIiwicmVxdWlyZSIsInNwaW5lIiwiTWF4Q2FjaGVUaW1lIiwiRnJhbWVUaW1lIiwiX3ZlcnRpY2VzIiwiX2luZGljZXMiLCJfYm9uZUluZm9PZmZzZXQiLCJfdmVydGV4T2Zmc2V0IiwiX2luZGV4T2Zmc2V0IiwiX3ZmT2Zmc2V0IiwiX3ByZVRleFVybCIsIl9wcmVCbGVuZE1vZGUiLCJfc2VnVkNvdW50IiwiX3NlZ0lDb3VudCIsIl9zZWdPZmZzZXQiLCJfY29sb3JPZmZzZXQiLCJfcHJlRmluYWxDb2xvciIsIl9wcmVEYXJrQ29sb3IiLCJfcGVyVmVydGV4U2l6ZSIsIl9wZXJDbGlwVmVydGV4U2l6ZSIsIl92ZkNvdW50IiwiX2luZGV4Q291bnQiLCJfdGVtcHIiLCJfdGVtcGciLCJfdGVtcGIiLCJfdGVtcGEiLCJfZmluYWxDb2xvcjMyIiwiX2RhcmtDb2xvcjMyIiwiX2ZpbmFsQ29sb3IiLCJDb2xvciIsIl9kYXJrQ29sb3IiLCJfcXVhZFRyaWFuZ2xlcyIsIl9vZmZzZXRzIiwiQW5pbWF0aW9uQ2FjaGUiLCJjYyIsIkNsYXNzIiwiY3RvciIsIl9wcml2YXRlTW9kZSIsIl9pbml0ZWQiLCJfaW52YWxpZCIsIl9lbmFibGVDYWNoZUF0dGFjaGVkSW5mbyIsImZyYW1lcyIsInRvdGFsVGltZSIsIl9mcmFtZUlkeCIsImlzQ29tcGxldGVkIiwiX3NrZWxldG9uSW5mbyIsIl9hbmltYXRpb25OYW1lIiwiX3RlbXBTZWdtZW50cyIsIl90ZW1wQ29sb3JzIiwiX3RlbXBCb25lSW5mb3MiLCJpbml0Iiwic2tlbGV0b25JbmZvIiwiYW5pbWF0aW9uTmFtZSIsImNsZWFyIiwiaSIsIm4iLCJsZW5ndGgiLCJmcmFtZSIsInNlZ21lbnRzIiwiaW52YWxpZEFsbEZyYW1lIiwiYmluZCIsImxpc3RlbmVyIiwiY29tcGxldGVIYW5kbGUiLCJlbnRyeSIsImFuaW1hdGlvbiIsIm5hbWUiLCJjb21wbGV0ZSIsInVuYmluZCIsImJlZ2luIiwicHJlQW5pbWF0aW9uQ2FjaGUiLCJjdXJBbmltYXRpb25DYWNoZSIsInVwZGF0ZVRvRnJhbWUiLCJza2VsZXRvbiIsInN0YXRlIiwiZGF0YSIsImZpbmRBbmltYXRpb24iLCJzZXRBbmltYXRpb25XaXRoIiwiZW5kIiwiX25lZWRUb1VwZGF0ZSIsInRvRnJhbWVJZHgiLCJ1bmRlZmluZWQiLCJjbGlwcGVyIiwidXBkYXRlIiwiYXBwbHkiLCJ1cGRhdGVXb3JsZFRyYW5zZm9ybSIsIl91cGRhdGVGcmFtZSIsImlzSW5pdGVkIiwiaXNJbnZhbGlkIiwidXBkYXRlQWxsRnJhbWUiLCJlbmFibGVDYWNoZUF0dGFjaGVkSW5mbyIsImluZGV4IiwiY29sb3JzIiwiYm9uZUluZm9zIiwib2Zmc2V0cyIsInZlcnRpY2VzIiwidWludFZlcnQiLCJpbmRpY2VzIiwiX3RyYXZlcnNlU2tlbGV0b24iLCJ2Zk9mZnNldCIsInByZVNlZ09mZnNldCIsInByZVNlZ0luZm8iLCJpbmRleENvdW50IiwidmZDb3VudCIsInZlcnRleENvdW50IiwiRmxvYXQzMkFycmF5IiwiVWludDMyQXJyYXkiLCJidWZmZXIiLCJqIiwiVWludDE2QXJyYXkiLCJmaWxsVmVydGljZXMiLCJza2VsZXRvbkNvbG9yIiwiYXR0YWNobWVudENvbG9yIiwic2xvdENvbG9yIiwic2xvdCIsImEiLCJyIiwiZyIsImIiLCJkYXJrQ29sb3IiLCJzZXQiLCJmciIsImZnIiwiZmIiLCJmYSIsImRyIiwiZGciLCJkYiIsImRhIiwiaXNDbGlwcGluZyIsInYiLCJjbGlwVHJpYW5nbGVzIiwiY2xpcHBlZFZlcnRpY2VzIiwiY2xpcHBlZFRyaWFuZ2xlcyIsImlpIiwiamoiLCJubiIsIm9mZnNldCIsImNvbG9yIiwiYXR0YWNobWVudCIsInV2cyIsInRyaWFuZ2xlcyIsImlzUmVnaW9uIiwiaXNNZXNoIiwiaXNDbGlwIiwidGV4dHVyZSIsImJsZW5kTW9kZSIsImJvbmVzIiwibCIsImJvbmUiLCJib25lSW5mbyIsImMiLCJkIiwid29ybGRYIiwid29ybGRZIiwiZHJhd09yZGVyIiwic2xvdElkeCIsInNsb3RDb3VudCIsImdldEF0dGFjaG1lbnQiLCJjbGlwRW5kV2l0aFNsb3QiLCJSZWdpb25BdHRhY2htZW50IiwiTWVzaEF0dGFjaG1lbnQiLCJDbGlwcGluZ0F0dGFjaG1lbnQiLCJjbGlwU3RhcnQiLCJyZWdpb24iLCJfdGV4dHVyZSIsIm5hdGl2ZVVybCIsInRleCIsImNvbXB1dGVXb3JsZFZlcnRpY2VzIiwid29ybGRWZXJ0aWNlc0xlbmd0aCIsInUiLCJwdXNoIiwiY2xpcEVuZCIsIlNrZWxldG9uQ2FjaGUiLCJfYW5pbWF0aW9uUG9vbCIsIl9za2VsZXRvbkNhY2hlIiwiZW5hYmxlUHJpdmF0ZU1vZGUiLCJyZW1vdmVTa2VsZXRvbiIsInV1aWQiLCJrIiwiX3V1aWQiLCJzcGxpdCIsImFuaW1hdGlvbnNDYWNoZSIsImFuaUtleSIsImFuaW1hdGlvbkNhY2hlIiwiZ2V0U2tlbGV0b25DYWNoZSIsInNrZWxldG9uRGF0YSIsIlNrZWxldG9uIiwiU2tlbGV0b25DbGlwcGluZyIsInN0YXRlRGF0YSIsIkFuaW1hdGlvblN0YXRlRGF0YSIsIkFuaW1hdGlvblN0YXRlIiwiYWRkTGlzdGVuZXIiLCJnZXRBbmltYXRpb25DYWNoZSIsImludmFsaWRBbmltYXRpb25DYWNoZSIsImluaXRBbmltYXRpb25DYWNoZSIsInBvb2xLZXkiLCJ1cGRhdGVBbmltYXRpb25DYWNoZSIsInNoYXJlZENhY2hlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU1BLG1CQUFtQixHQUFHQyxPQUFPLENBQUMseUJB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O0FBQ2YsVUFBSW1JLGNBQWMsR0FBRyxLQUFLVyxrQkFBTCxDQUF3QmpCLElBQXhCLEVBQThCN0gsYUFBOUIsQ0FBckI7QUFDQSxVQUFJLENBQUNtSSxjQUFMLEVBQXFCLE9BQU8sSUFBUDtBQUNyQkEsTUFBQUEsY0FBYyxDQUFDL0YsY0FBZjtBQUNILEtBSkQsTUFJTztBQUNILFVBQUlyQyxZQUFZLEdBQUcsS0FBSzJILGNBQUwsQ0FBb0JHLElBQXBCLENBQW5CO0FBQ0EsVUFBSXpHLFFBQVEsR0FBR3JCLFlBQVksSUFBSUEsWUFBWSxDQUFDcUIsUUFBNUM7QUFDQSxVQUFJLENBQUNBLFFBQUwsRUFBZTtBQUVmLFVBQUk2RyxlQUFlLEdBQUdsSSxZQUFZLENBQUNrSSxlQUFuQzs7QUFDQSxXQUFLLElBQUlDLE1BQVQsSUFBbUJELGVBQW5CLEVBQW9DO0FBQ2hDLFlBQUlFLGVBQWMsR0FBR0YsZUFBZSxDQUFDQyxNQUFELENBQXBDOztBQUNBQyxRQUFBQSxlQUFjLENBQUMvRixjQUFmO0FBQ0g7QUFDSjtBQUNKO0FBL0l3QixDQUFULENBQXBCO0FBa0pBb0YsYUFBYSxDQUFDekssU0FBZCxHQUEwQkEsU0FBMUI7QUFDQXlLLGFBQWEsQ0FBQ3lCLFdBQWQsR0FBNEIsSUFBSXpCLGFBQUosRUFBNUI7QUFDQTBCLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjNCLGFBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5jb25zdCBUcmFja0VudHJ5TGlzdGVuZXJzID0gcmVxdWlyZSgnLi90cmFjay1lbnRyeS1saXN0ZW5lcnMnKTtcbmNvbnN0IHNwaW5lID0gcmVxdWlyZSgnLi9saWIvc3BpbmUnKTtcbi8vIFBlcm1pdCBtYXggY2FjaGUgdGltZSwgdW5pdCBpcyBzZWNvbmQuXG5jb25zdCBNYXhDYWNoZVRpbWUgPSAzMDtcbmNvbnN0IEZyYW1lVGltZSA9IDEgLyA2MDtcblxubGV0IF92ZXJ0aWNlcyA9IFtdO1xubGV0IF9pbmRpY2VzID0gW107XG5sZXQgX2JvbmVJbmZvT2Zmc2V0ID0gMDtcbmxldCBfdmVydGV4T2Zmc2V0ID0gMDtcbmxldCBfaW5kZXhPZmZzZXQgPSAwO1xubGV0IF92Zk9mZnNldCA9IDA7XG5sZXQgX3ByZVRleFVybCA9IG51bGw7XG5sZXQgX3ByZUJsZW5kTW9kZSA9IG51bGw7XG5sZXQgX3NlZ1ZDb3VudCA9IDA7XG5sZXQgX3NlZ0lDb3VudCA9IDA7XG5sZXQgX3NlZ09mZnNldCA9IDA7XG5sZXQgX2NvbG9yT2Zmc2V0ID0gMDtcbmxldCBfcHJlRmluYWxDb2xvciA9IG51bGw7XG5sZXQgX3ByZURhcmtDb2xvciA9IG51bGw7XG4vLyB4IHkgdSB2IGMxIGMyXG5sZXQgX3BlclZlcnRleFNpemUgPSA2O1xuLy8geCB5IHUgdiByMSBnMSBiMSBhMSByMiBnMiBiMiBhMlxubGV0IF9wZXJDbGlwVmVydGV4U2l6ZSA9IDEyO1xubGV0IF92ZkNvdW50ID0gMCwgX2luZGV4Q291bnQgPSAwO1xubGV0IF90ZW1wciwgX3RlbXBnLCBfdGVtcGIsIF90ZW1wYTtcbmxldCBfZmluYWxDb2xvcjMyLCBfZGFya0NvbG9yMzI7XG5sZXQgX2ZpbmFsQ29sb3IgPSBuZXcgc3BpbmUuQ29sb3IoMSwgMSwgMSwgMSk7XG5sZXQgX2RhcmtDb2xvciA9IG5ldyBzcGluZS5Db2xvcigxLCAxLCAxLCAxKTtcbmxldCBfcXVhZFRyaWFuZ2xlcyA9IFswLCAxLCAyLCAyLCAzLCAwXTtcbmxldCBfb2Zmc2V0cztcblxuLy9DYWNoZSBhbGwgZnJhbWVzIGluIGFuIGFuaW1hdGlvblxubGV0IEFuaW1hdGlvbkNhY2hlID0gY2MuQ2xhc3Moe1xuICAgIGN0b3IoKSB7XG4gICAgICAgIHRoaXMuX3ByaXZhdGVNb2RlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2luaXRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pbnZhbGlkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fZW5hYmxlQ2FjaGVBdHRhY2hlZEluZm8gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5mcmFtZXMgPSBbXTtcbiAgICAgICAgdGhpcy50b3RhbFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9mcmFtZUlkeCA9IC0xO1xuICAgICAgICB0aGlzLmlzQ29tcGxldGVkID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5fc2tlbGV0b25JbmZvID0gbnVsbDtcbiAgICAgICAgdGhpcy5fYW5pbWF0aW9uTmFtZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX3RlbXBTZWdtZW50cyA9IG51bGw7XG4gICAgICAgIHRoaXMuX3RlbXBDb2xvcnMgPSBudWxsO1xuICAgICAgICB0aGlzLl90ZW1wQm9uZUluZm9zID0gbnVsbDtcbiAgICB9LFxuXG4gICAgaW5pdChza2VsZXRvbkluZm8sIGFuaW1hdGlvbk5hbWUpIHtcbiAgICAgICAgdGhpcy5faW5pdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fYW5pbWF0aW9uTmFtZSA9IGFuaW1hdGlvbk5hbWU7XG4gICAgICAgIHRoaXMuX3NrZWxldG9uSW5mbyA9IHNrZWxldG9uSW5mbztcbiAgICB9LFxuXG4gICAgLy8gQ2xlYXIgdGV4dHVyZSBxdW90ZS5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5faW5pdGVkID0gZmFsc2U7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBuID0gdGhpcy5mcmFtZXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZnJhbWUgPSB0aGlzLmZyYW1lc1tpXTtcbiAgICAgICAgICAgIGZyYW1lLnNlZ21lbnRzLmxlbmd0aCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnZhbGlkQWxsRnJhbWUoKTtcbiAgICB9LFxuXG4gICAgYmluZChsaXN0ZW5lcikge1xuICAgICAgICBsZXQgY29tcGxldGVIYW5kbGUgPSBmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgICAgIGlmIChlbnRyeSAmJiBlbnRyeS5hbmltYXRpb24ubmFtZSA9PT0gdGhpcy5fYW5pbWF0aW9uTmFtZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNDb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgICAgbGlzdGVuZXIuY29tcGxldGUgPSBjb21wbGV0ZUhhbmRsZTtcbiAgICB9LFxuXG4gICAgdW5iaW5kKGxpc3RlbmVyKSB7XG4gICAgICAgIGxpc3RlbmVyLmNvbXBsZXRlID0gbnVsbDtcbiAgICB9LFxuXG4gICAgYmVnaW4oKSB7XG4gICAgICAgIGlmICghdGhpcy5faW52YWxpZCkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBza2VsZXRvbkluZm8gPSB0aGlzLl9za2VsZXRvbkluZm87XG4gICAgICAgIGxldCBwcmVBbmltYXRpb25DYWNoZSA9IHNrZWxldG9uSW5mby5jdXJBbmltYXRpb25DYWNoZTtcblxuICAgICAgICBpZiAocHJlQW5pbWF0aW9uQ2FjaGUgJiYgcHJlQW5pbWF0aW9uQ2FjaGUgIT09IHRoaXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9wcml2YXRlTW9kZSkge1xuICAgICAgICAgICAgICAgIC8vIFByaXZhdGUgY2FjaGUgbW9kZSBqdXN0IGludmFsaWQgcHJlIGFuaW1hdGlvbiBmcmFtZS5cbiAgICAgICAgICAgICAgICBwcmVBbmltYXRpb25DYWNoZS5pbnZhbGlkQWxsRnJhbWUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgcHJlIGFuaW1hdGlvbiBub3QgZmluaXNoZWQsIHBsYXkgaXQgdG8gdGhlIGVuZC5cbiAgICAgICAgICAgICAgICBwcmVBbmltYXRpb25DYWNoZS51cGRhdGVUb0ZyYW1lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2tlbGV0b24gPSBza2VsZXRvbkluZm8uc2tlbGV0b247XG4gICAgICAgIGxldCBsaXN0ZW5lciA9IHNrZWxldG9uSW5mby5saXN0ZW5lcjtcbiAgICAgICAgbGV0IHN0YXRlID0gc2tlbGV0b25JbmZvLnN0YXRlO1xuXG4gICAgICAgIGxldCBhbmltYXRpb24gPSBza2VsZXRvbi5kYXRhLmZpbmRBbmltYXRpb24odGhpcy5fYW5pbWF0aW9uTmFtZSk7XG4gICAgICAgIHN0YXRlLnNldEFuaW1hdGlvbldpdGgoMCwgYW5pbWF0aW9uLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuYmluZChsaXN0ZW5lcik7XG5cbiAgICAgICAgLy8gcmVjb3JkIGN1ciBhbmltYXRpb24gY2FjaGVcbiAgICAgICAgc2tlbGV0b25JbmZvLmN1ckFuaW1hdGlvbkNhY2hlID0gdGhpcztcbiAgICAgICAgdGhpcy5fZnJhbWVJZHggPSAtMTtcbiAgICAgICAgdGhpcy5pc0NvbXBsZXRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnRvdGFsVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2ludmFsaWQgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgZW5kKCkge1xuICAgICAgICBpZiAoIXRoaXMuX25lZWRUb1VwZGF0ZSgpKSB7XG4gICAgICAgICAgICAvLyBjbGVhciBjdXIgYW5pbWF0aW9uIGNhY2hlXG4gICAgICAgICAgICB0aGlzLl9za2VsZXRvbkluZm8uY3VyQW5pbWF0aW9uQ2FjaGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5mcmFtZXMubGVuZ3RoID0gdGhpcy5fZnJhbWVJZHggKyAxO1xuICAgICAgICAgICAgdGhpcy5pc0NvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnVuYmluZCh0aGlzLl9za2VsZXRvbkluZm8ubGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9uZWVkVG9VcGRhdGUodG9GcmFtZUlkeCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuaXNDb21wbGV0ZWQgJiZcbiAgICAgICAgICAgIHRoaXMudG90YWxUaW1lIDwgTWF4Q2FjaGVUaW1lICYmXG4gICAgICAgICAgICAodG9GcmFtZUlkeCA9PSB1bmRlZmluZWQgfHwgdGhpcy5fZnJhbWVJZHggPCB0b0ZyYW1lSWR4KTtcbiAgICB9LFxuXG4gICAgdXBkYXRlVG9GcmFtZSh0b0ZyYW1lSWR4KSB7XG4gICAgICAgIGlmICghdGhpcy5faW5pdGVkKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5iZWdpbigpO1xuXG4gICAgICAgIGlmICghdGhpcy5fbmVlZFRvVXBkYXRlKHRvRnJhbWVJZHgpKSByZXR1cm47XG5cbiAgICAgICAgbGV0IHNrZWxldG9uSW5mbyA9IHRoaXMuX3NrZWxldG9uSW5mbztcbiAgICAgICAgbGV0IHNrZWxldG9uID0gc2tlbGV0b25JbmZvLnNrZWxldG9uO1xuICAgICAgICBsZXQgY2xpcHBlciA9IHNrZWxldG9uSW5mby5jbGlwcGVyO1xuICAgICAgICBsZXQgc3RhdGUgPSBza2VsZXRvbkluZm8uc3RhdGU7XG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgLy8gU29saWQgdXBkYXRlIGZyYW1lIHJhdGUgMS82MC5cbiAgICAgICAgICAgIHNrZWxldG9uLnVwZGF0ZShGcmFtZVRpbWUpO1xuICAgICAgICAgICAgc3RhdGUudXBkYXRlKEZyYW1lVGltZSk7XG4gICAgICAgICAgICBzdGF0ZS5hcHBseShza2VsZXRvbik7XG4gICAgICAgICAgICBza2VsZXRvbi51cGRhdGVXb3JsZFRyYW5zZm9ybSgpO1xuICAgICAgICAgICAgdGhpcy5fZnJhbWVJZHgrKztcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUZyYW1lKHNrZWxldG9uLCBjbGlwcGVyLCB0aGlzLl9mcmFtZUlkeCk7XG4gICAgICAgICAgICB0aGlzLnRvdGFsVGltZSArPSBGcmFtZVRpbWU7XG4gICAgICAgIH0gd2hpbGUgKHRoaXMuX25lZWRUb1VwZGF0ZSh0b0ZyYW1lSWR4KSk7XG5cbiAgICAgICAgdGhpcy5lbmQoKTtcbiAgICB9LFxuXG4gICAgaXNJbml0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbml0ZWQ7XG4gICAgfSxcblxuICAgIGlzSW52YWxpZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludmFsaWQ7XG4gICAgfSxcblxuICAgIGludmFsaWRBbGxGcmFtZSgpIHtcbiAgICAgICAgdGhpcy5pc0NvbXBsZXRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pbnZhbGlkID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgdXBkYXRlQWxsRnJhbWUoKSB7XG4gICAgICAgIHRoaXMuaW52YWxpZEFsbEZyYW1lKCk7XG4gICAgICAgIHRoaXMudXBkYXRlVG9GcmFtZSgpO1xuICAgIH0sXG5cbiAgICBlbmFibGVDYWNoZUF0dGFjaGVkSW5mbygpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9lbmFibGVDYWNoZUF0dGFjaGVkSW5mbykge1xuICAgICAgICAgICAgdGhpcy5fZW5hYmxlQ2FjaGVBdHRhY2hlZEluZm8gPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5pbnZhbGlkQWxsRnJhbWUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXBkYXRlRnJhbWUoc2tlbGV0b24sIGNsaXBwZXIsIGluZGV4KSB7XG4gICAgICAgIF92Zk9mZnNldCA9IDA7XG4gICAgICAgIF9ib25lSW5mb09mZnNldCA9IDA7XG4gICAgICAgIF9pbmRleE9mZnNldCA9IDA7XG4gICAgICAgIF92ZXJ0ZXhPZmZzZXQgPSAwO1xuICAgICAgICBfcHJlVGV4VXJsID0gbnVsbDtcbiAgICAgICAgX3ByZUJsZW5kTW9kZSA9IG51bGw7XG4gICAgICAgIF9zZWdWQ291bnQgPSAwO1xuICAgICAgICBfc2VnSUNvdW50ID0gMDtcbiAgICAgICAgX3NlZ09mZnNldCA9IDA7XG4gICAgICAgIF9jb2xvck9mZnNldCA9IDA7XG4gICAgICAgIF9wcmVGaW5hbENvbG9yID0gbnVsbDtcbiAgICAgICAgX3ByZURhcmtDb2xvciA9IG51bGw7XG4gICAgICAgIF9vZmZzZXRzID0gW107XG5cbiAgICAgICAgdGhpcy5mcmFtZXNbaW5kZXhdID0gdGhpcy5mcmFtZXNbaW5kZXhdIHx8IHtcbiAgICAgICAgICAgIHNlZ21lbnRzOiBbXSxcbiAgICAgICAgICAgIGNvbG9yczogW10sXG4gICAgICAgICAgICBib25lSW5mb3M6IFtdLFxuICAgICAgICAgICAgb2Zmc2V0czogbnVsbCxcbiAgICAgICAgICAgIHZlcnRpY2VzOiBudWxsLFxuICAgICAgICAgICAgdWludFZlcnQ6IG51bGwsXG4gICAgICAgICAgICBpbmRpY2VzOiBudWxsLFxuICAgICAgICB9O1xuICAgICAgICBsZXQgZnJhbWUgPSB0aGlzLmZyYW1lc1tpbmRleF07XG5cbiAgICAgICAgbGV0IHNlZ21lbnRzID0gdGhpcy5fdGVtcFNlZ21lbnRzID0gZnJhbWUuc2VnbWVudHM7XG4gICAgICAgIGxldCBjb2xvcnMgPSB0aGlzLl90ZW1wQ29sb3JzID0gZnJhbWUuY29sb3JzO1xuICAgICAgICBsZXQgYm9uZUluZm9zID0gdGhpcy5fdGVtcEJvbmVJbmZvcyA9IGZyYW1lLmJvbmVJbmZvcztcbiAgICAgICAgdGhpcy5fdHJhdmVyc2VTa2VsZXRvbihza2VsZXRvbiwgY2xpcHBlcik7XG4gICAgICAgIGlmIChfY29sb3JPZmZzZXQgPiAwKSB7XG4gICAgICAgICAgICBjb2xvcnNbX2NvbG9yT2Zmc2V0IC0gMV0udmZPZmZzZXQgPSBfdmZPZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgY29sb3JzLmxlbmd0aCA9IF9jb2xvck9mZnNldDtcbiAgICAgICAgYm9uZUluZm9zLmxlbmd0aCA9IF9ib25lSW5mb09mZnNldDtcbiAgICAgICAgLy8gSGFuZGxlIHByZSBzZWdtZW50LlxuICAgICAgICBsZXQgcHJlU2VnT2Zmc2V0ID0gX3NlZ09mZnNldCAtIDE7XG4gICAgICAgIGlmIChwcmVTZWdPZmZzZXQgPj0gMCkge1xuICAgICAgICAgICAgLy8gSnVkZ2Ugc2VnbWVudCB2ZXJ0ZXggY291bnQgaXMgbm90IGVtcHR5LlxuICAgICAgICAgICAgaWYgKF9zZWdJQ291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IHByZVNlZ0luZm8gPSBzZWdtZW50c1twcmVTZWdPZmZzZXRdO1xuICAgICAgICAgICAgICAgIHByZVNlZ0luZm8uaW5kZXhDb3VudCA9IF9zZWdJQ291bnQ7XG4gICAgICAgICAgICAgICAgcHJlU2VnSW5mby52ZkNvdW50ID0gX3NlZ1ZDb3VudCAqIF9wZXJWZXJ0ZXhTaXplO1xuICAgICAgICAgICAgICAgIHByZVNlZ0luZm8udmVydGV4Q291bnQgPSBfc2VnVkNvdW50O1xuICAgICAgICAgICAgICAgIHNlZ21lbnRzLmxlbmd0aCA9IF9zZWdPZmZzZXQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIERpc2NhcmQgcHJlIHNlZ21lbnQuXG4gICAgICAgICAgICAgICAgc2VnbWVudHMubGVuZ3RoID0gX3NlZ09mZnNldCAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZWdtZW50cyBpcyBlbXB0eSxkaXNjYXJkIGFsbCBzZWdtZW50cy5cbiAgICAgICAgaWYgKHNlZ21lbnRzLmxlbmd0aCA9PSAwKSByZXR1cm47XG5cbiAgICAgICAgLy8gRmlsbCB2ZXJ0aWNlc1xuICAgICAgICBsZXQgdmVydGljZXMgPSBmcmFtZS52ZXJ0aWNlcztcbiAgICAgICAgbGV0IHVpbnRWZXJ0ID0gZnJhbWUudWludFZlcnQ7XG4gICAgICAgIGlmICghdmVydGljZXMgfHwgdmVydGljZXMubGVuZ3RoIDwgX3ZmT2Zmc2V0KSB7XG4gICAgICAgICAgICB2ZXJ0aWNlcyA9IGZyYW1lLnZlcnRpY2VzID0gbmV3IEZsb2F0MzJBcnJheShfdmZPZmZzZXQpO1xuICAgICAgICAgICAgdWludFZlcnQgPSBmcmFtZS51aW50VmVydCA9IG5ldyBVaW50MzJBcnJheSh2ZXJ0aWNlcy5idWZmZXIpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBqID0gMDsgaSA8IF92Zk9mZnNldDspIHtcbiAgICAgICAgICAgIHZlcnRpY2VzW2krK10gPSBfdmVydGljZXNbaisrXTsgLy8geFxuICAgICAgICAgICAgdmVydGljZXNbaSsrXSA9IF92ZXJ0aWNlc1tqKytdOyAvLyB5XG4gICAgICAgICAgICB2ZXJ0aWNlc1tpKytdID0gX3ZlcnRpY2VzW2orK107IC8vIHVcbiAgICAgICAgICAgIHZlcnRpY2VzW2krK10gPSBfdmVydGljZXNbaisrXTsgLy8gdlxuICAgICAgICAgICAgdWludFZlcnRbaSsrXSA9IF92ZXJ0aWNlc1tqKytdOyAvLyBjb2xvcjFcbiAgICAgICAgICAgIHVpbnRWZXJ0W2krK10gPSBfdmVydGljZXNbaisrXTsgLy8gY29sb3IyXG4gICAgICAgIH1cblxuICAgICAgICAvLyBGaWxsIGluZGljZXNcbiAgICAgICAgbGV0IGluZGljZXMgPSBmcmFtZS5pbmRpY2VzO1xuICAgICAgICBpZiAoIWluZGljZXMgfHwgaW5kaWNlcy5sZW5ndGggPCBfaW5kZXhPZmZzZXQpIHtcbiAgICAgICAgICAgIGluZGljZXMgPSBmcmFtZS5pbmRpY2VzID0gbmV3IFVpbnQxNkFycmF5KF9pbmRleE9mZnNldCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IF9pbmRleE9mZnNldDsgaSsrKSB7XG4gICAgICAgICAgICBpbmRpY2VzW2ldID0gX2luZGljZXNbaV07XG4gICAgICAgIH1cblxuICAgICAgICBmcmFtZS52ZXJ0aWNlcyA9IHZlcnRpY2VzO1xuICAgICAgICBmcmFtZS51aW50VmVydCA9IHVpbnRWZXJ0O1xuICAgICAgICBmcmFtZS5pbmRpY2VzID0gaW5kaWNlcztcbiAgICAgICAgZnJhbWUub2Zmc2V0cyA9IF9vZmZzZXRzO1xuICAgIH0sXG5cbiAgICBmaWxsVmVydGljZXMoc2tlbGV0b25Db2xvciwgYXR0YWNobWVudENvbG9yLCBzbG90Q29sb3IsIGNsaXBwZXIsIHNsb3QpIHtcblxuICAgICAgICBfdGVtcGEgPSBzbG90Q29sb3IuYSAqIGF0dGFjaG1lbnRDb2xvci5hICogc2tlbGV0b25Db2xvci5hICogMjU1O1xuICAgICAgICBfdGVtcHIgPSBhdHRhY2htZW50Q29sb3IuciAqIHNrZWxldG9uQ29sb3IuciAqIDI1NTtcbiAgICAgICAgX3RlbXBnID0gYXR0YWNobWVudENvbG9yLmcgKiBza2VsZXRvbkNvbG9yLmcgKiAyNTU7XG4gICAgICAgIF90ZW1wYiA9IGF0dGFjaG1lbnRDb2xvci5iICogc2tlbGV0b25Db2xvci5iICogMjU1O1xuXG4gICAgICAgIF9maW5hbENvbG9yLnIgPSBfdGVtcHIgKiBzbG90Q29sb3IucjtcbiAgICAgICAgX2ZpbmFsQ29sb3IuZyA9IF90ZW1wZyAqIHNsb3RDb2xvci5nO1xuICAgICAgICBfZmluYWxDb2xvci5iID0gX3RlbXBiICogc2xvdENvbG9yLmI7XG4gICAgICAgIF9maW5hbENvbG9yLmEgPSBfdGVtcGE7XG5cbiAgICAgICAgaWYgKHNsb3QuZGFya0NvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgIF9kYXJrQ29sb3Iuc2V0KDAuMCwgMCwgMCwgMS4wKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9kYXJrQ29sb3IuciA9IHNsb3QuZGFya0NvbG9yLnIgKiBfdGVtcHI7XG4gICAgICAgICAgICBfZGFya0NvbG9yLmcgPSBzbG90LmRhcmtDb2xvci5nICogX3RlbXBnO1xuICAgICAgICAgICAgX2RhcmtDb2xvci5iID0gc2xvdC5kYXJrQ29sb3IuYiAqIF90ZW1wYjtcbiAgICAgICAgfVxuICAgICAgICBfZGFya0NvbG9yLmEgPSAwO1xuXG4gICAgICAgIF9maW5hbENvbG9yMzIgPSAoKF9maW5hbENvbG9yLmEgPDwgMjQpID4+PiAwKSArIChfZmluYWxDb2xvci5iIDw8IDE2KSArIChfZmluYWxDb2xvci5nIDw8IDgpICsgX2ZpbmFsQ29sb3IucjtcbiAgICAgICAgX2RhcmtDb2xvcjMyID0gKChfZGFya0NvbG9yLmEgPDwgMjQpID4+PiAwKSArIChfZGFya0NvbG9yLmIgPDwgMTYpICsgKF9kYXJrQ29sb3IuZyA8PCA4KSArIF9kYXJrQ29sb3IucjtcblxuICAgICAgICBpZiAoX3ByZUZpbmFsQ29sb3IgIT09IF9maW5hbENvbG9yMzIgfHwgX3ByZURhcmtDb2xvciAhPT0gX2RhcmtDb2xvcjMyKSB7XG4gICAgICAgICAgICBsZXQgY29sb3JzID0gdGhpcy5fdGVtcENvbG9ycztcbiAgICAgICAgICAgIF9wcmVGaW5hbENvbG9yID0gX2ZpbmFsQ29sb3IzMjtcbiAgICAgICAgICAgIF9wcmVEYXJrQ29sb3IgPSBfZGFya0NvbG9yMzI7XG4gICAgICAgICAgICBpZiAoX2NvbG9yT2Zmc2V0ID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbG9yc1tfY29sb3JPZmZzZXQgLSAxXS52Zk9mZnNldCA9IF92Zk9mZnNldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbG9yc1tfY29sb3JPZmZzZXQrK10gPSB7XG4gICAgICAgICAgICAgICAgZnI6IF9maW5hbENvbG9yLnIsXG4gICAgICAgICAgICAgICAgZmc6IF9maW5hbENvbG9yLmcsXG4gICAgICAgICAgICAgICAgZmI6IF9maW5hbENvbG9yLmIsXG4gICAgICAgICAgICAgICAgZmE6IF9maW5hbENvbG9yLmEsXG4gICAgICAgICAgICAgICAgZHI6IF9kYXJrQ29sb3IucixcbiAgICAgICAgICAgICAgICBkZzogX2RhcmtDb2xvci5nLFxuICAgICAgICAgICAgICAgIGRiOiBfZGFya0NvbG9yLmIsXG4gICAgICAgICAgICAgICAgZGE6IF9kYXJrQ29sb3IuYSxcbiAgICAgICAgICAgICAgICB2Zk9mZnNldDogMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjbGlwcGVyLmlzQ2xpcHBpbmcoKSkge1xuXG4gICAgICAgICAgICBmb3IgKGxldCB2ID0gX3ZmT2Zmc2V0LCBuID0gX3ZmT2Zmc2V0ICsgX3ZmQ291bnQ7IHYgPCBuOyB2ICs9IF9wZXJWZXJ0ZXhTaXplKSB7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzW3YgKyA0XSA9IF9maW5hbENvbG9yMzI7ICAgICAvLyBsaWdodCBjb2xvclxuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1t2ICsgNV0gPSBfZGFya0NvbG9yMzI7ICAgICAgLy8gZGFyayBjb2xvclxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbGlwcGVyLmNsaXBUcmlhbmdsZXMoX3ZlcnRpY2VzLCBfdmZDb3VudCwgX2luZGljZXMsIF9pbmRleENvdW50LCBfdmVydGljZXMsIF9maW5hbENvbG9yLCBfZGFya0NvbG9yLCB0cnVlLCBfcGVyVmVydGV4U2l6ZSwgX2luZGV4T2Zmc2V0LCBfdmZPZmZzZXQsIF92Zk9mZnNldCArIDIpO1xuICAgICAgICAgICAgbGV0IGNsaXBwZWRWZXJ0aWNlcyA9IGNsaXBwZXIuY2xpcHBlZFZlcnRpY2VzO1xuICAgICAgICAgICAgbGV0IGNsaXBwZWRUcmlhbmdsZXMgPSBjbGlwcGVyLmNsaXBwZWRUcmlhbmdsZXM7XG5cbiAgICAgICAgICAgIC8vIGluc3VyZSBjYXBhY2l0eVxuICAgICAgICAgICAgX2luZGV4Q291bnQgPSBjbGlwcGVkVHJpYW5nbGVzLmxlbmd0aDtcbiAgICAgICAgICAgIF92ZkNvdW50ID0gY2xpcHBlZFZlcnRpY2VzLmxlbmd0aCAvIF9wZXJDbGlwVmVydGV4U2l6ZSAqIF9wZXJWZXJ0ZXhTaXplO1xuXG4gICAgICAgICAgICAvLyBmaWxsIGluZGljZXNcbiAgICAgICAgICAgIGZvciAobGV0IGlpID0gMCwgamogPSBfaW5kZXhPZmZzZXQsIG5uID0gY2xpcHBlZFRyaWFuZ2xlcy5sZW5ndGg7IGlpIDwgbm47KSB7XG4gICAgICAgICAgICAgICAgX2luZGljZXNbamorK10gPSBjbGlwcGVkVHJpYW5nbGVzW2lpKytdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmaWxsIHZlcnRpY2VzIGNvbnRhaW4geCB5IHUgdiBsaWdodCBjb2xvciBkYXJrIGNvbG9yXG4gICAgICAgICAgICBmb3IgKGxldCB2ID0gMCwgbiA9IGNsaXBwZWRWZXJ0aWNlcy5sZW5ndGgsIG9mZnNldCA9IF92Zk9mZnNldDsgdiA8IG47IHYgKz0gMTIsIG9mZnNldCArPSBfcGVyVmVydGV4U2l6ZSkge1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1tvZmZzZXRdID0gY2xpcHBlZFZlcnRpY2VzW3ZdOyAgICAgICAgICAgICAgICAgLy8geFxuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1tvZmZzZXQgKyAxXSA9IGNsaXBwZWRWZXJ0aWNlc1t2ICsgMV07ICAgICAgICAgLy8geVxuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1tvZmZzZXQgKyAyXSA9IGNsaXBwZWRWZXJ0aWNlc1t2ICsgNl07ICAgICAgICAgLy8gdVxuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1tvZmZzZXQgKyAzXSA9IGNsaXBwZWRWZXJ0aWNlc1t2ICsgN107ICAgICAgICAgLy8gdlxuXG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzW29mZnNldCArIDRdID0gX2ZpbmFsQ29sb3IzMjtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbb2Zmc2V0ICsgNV0gPSBfZGFya0NvbG9yMzI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3RyYXZlcnNlU2tlbGV0b24oc2tlbGV0b24sIGNsaXBwZXIpIHtcbiAgICAgICAgbGV0IHNlZ21lbnRzID0gdGhpcy5fdGVtcFNlZ21lbnRzO1xuICAgICAgICBsZXQgYm9uZUluZm9zID0gdGhpcy5fdGVtcEJvbmVJbmZvcztcbiAgICAgICAgbGV0IHNrZWxldG9uQ29sb3IgPSBza2VsZXRvbi5jb2xvcjtcbiAgICAgICAgbGV0IGF0dGFjaG1lbnQsIGF0dGFjaG1lbnRDb2xvciwgc2xvdENvbG9yLCB1dnMsIHRyaWFuZ2xlcztcbiAgICAgICAgbGV0IGlzUmVnaW9uLCBpc01lc2gsIGlzQ2xpcDtcbiAgICAgICAgbGV0IHRleHR1cmU7XG4gICAgICAgIGxldCBwcmVTZWdPZmZzZXQsIHByZVNlZ0luZm87XG4gICAgICAgIGxldCBibGVuZE1vZGU7XG4gICAgICAgIGxldCBzbG90O1xuXG4gICAgICAgIGxldCBib25lcyA9IHNrZWxldG9uLmJvbmVzO1xuICAgICAgICBpZiAodGhpcy5fZW5hYmxlQ2FjaGVBdHRhY2hlZEluZm8pIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gYm9uZXMubGVuZ3RoOyBpIDwgbDsgaSsrLCBfYm9uZUluZm9PZmZzZXQrKykge1xuICAgICAgICAgICAgICAgIGxldCBib25lID0gYm9uZXNbaV07XG4gICAgICAgICAgICAgICAgbGV0IGJvbmVJbmZvID0gYm9uZUluZm9zW19ib25lSW5mb09mZnNldF07XG4gICAgICAgICAgICAgICAgaWYgKCFib25lSW5mbykge1xuICAgICAgICAgICAgICAgICAgICBib25lSW5mbyA9IGJvbmVJbmZvc1tfYm9uZUluZm9PZmZzZXRdID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJvbmVJbmZvLmEgPSBib25lLmE7XG4gICAgICAgICAgICAgICAgYm9uZUluZm8uYiA9IGJvbmUuYjtcbiAgICAgICAgICAgICAgICBib25lSW5mby5jID0gYm9uZS5jO1xuICAgICAgICAgICAgICAgIGJvbmVJbmZvLmQgPSBib25lLmQ7XG4gICAgICAgICAgICAgICAgYm9uZUluZm8ud29ybGRYID0gYm9uZS53b3JsZFg7XG4gICAgICAgICAgICAgICAgYm9uZUluZm8ud29ybGRZID0gYm9uZS53b3JsZFk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZHJhd09yZGVyID0gc2tlbGV0b24uZHJhd09yZGVyO1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCctLS0tLS3nv7vovawtLS0tIGRlcHRoOiAnICsgc2tlbGV0b24uZGVwdGgpO1xuICAgICAgICAvLyBkcmF3T3JkZXIucmV2ZXJzZSgpO1xuICAgICAgICBmb3IgKGxldCBzbG90SWR4ID0gMCwgc2xvdENvdW50ID0gZHJhd09yZGVyLmxlbmd0aDsgc2xvdElkeCA8IHNsb3RDb3VudDsgc2xvdElkeCsrKSB7XG4gICAgICAgICAgICBzbG90ID0gZHJhd09yZGVyW3Nsb3RJZHhdO1xuXG4gICAgICAgICAgICBfdmZDb3VudCA9IDA7XG4gICAgICAgICAgICBfaW5kZXhDb3VudCA9IDA7XG5cbiAgICAgICAgICAgIGF0dGFjaG1lbnQgPSBzbG90LmdldEF0dGFjaG1lbnQoKTtcbiAgICAgICAgICAgIGlmICghYXR0YWNobWVudCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpc1JlZ2lvbiA9IGF0dGFjaG1lbnQgaW5zdGFuY2VvZiBzcGluZS5SZWdpb25BdHRhY2htZW50O1xuICAgICAgICAgICAgaXNNZXNoID0gYXR0YWNobWVudCBpbnN0YW5jZW9mIHNwaW5lLk1lc2hBdHRhY2htZW50O1xuICAgICAgICAgICAgaXNDbGlwID0gYXR0YWNobWVudCBpbnN0YW5jZW9mIHNwaW5lLkNsaXBwaW5nQXR0YWNobWVudDtcblxuICAgICAgICAgICAgaWYgKGlzQ2xpcCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcFN0YXJ0KHNsb3QsIGF0dGFjaG1lbnQpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWlzUmVnaW9uICYmICFpc01lc2gpIHtcbiAgICAgICAgICAgICAgICBjbGlwcGVyLmNsaXBFbmRXaXRoU2xvdChzbG90KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGV4dHVyZSA9IGF0dGFjaG1lbnQucmVnaW9uLnRleHR1cmUuX3RleHR1cmU7XG4gICAgICAgICAgICBpZiAoIXRleHR1cmUpIHtcbiAgICAgICAgICAgICAgICBjbGlwcGVyLmNsaXBFbmRXaXRoU2xvdChzbG90KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYmxlbmRNb2RlID0gc2xvdC5kYXRhLmJsZW5kTW9kZTtcbiAgICAgICAgICAgIGlmIChfcHJlVGV4VXJsICE9PSB0ZXh0dXJlLm5hdGl2ZVVybCB8fCBfcHJlQmxlbmRNb2RlICE9PSBibGVuZE1vZGUpIHtcbiAgICAgICAgICAgICAgICBfcHJlVGV4VXJsID0gdGV4dHVyZS5uYXRpdmVVcmw7XG4gICAgICAgICAgICAgICAgX3ByZUJsZW5kTW9kZSA9IGJsZW5kTW9kZTtcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgcHJlIHNlZ21lbnQuXG4gICAgICAgICAgICAgICAgcHJlU2VnT2Zmc2V0ID0gX3NlZ09mZnNldCAtIDE7XG4gICAgICAgICAgICAgICAgaWYgKHByZVNlZ09mZnNldCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfc2VnSUNvdW50ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlU2VnSW5mbyA9IHNlZ21lbnRzW3ByZVNlZ09mZnNldF07XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVTZWdJbmZvLmluZGV4Q291bnQgPSBfc2VnSUNvdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlU2VnSW5mby52ZXJ0ZXhDb3VudCA9IF9zZWdWQ291bnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVTZWdJbmZvLnZmQ291bnQgPSBfc2VnVkNvdW50ICogX3BlclZlcnRleFNpemU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBEaXNjYXJkIHByZSBzZWdtZW50LlxuICAgICAgICAgICAgICAgICAgICAgICAgX3NlZ09mZnNldC0tO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBub3cgc2VnbWVudC5cbiAgICAgICAgICAgICAgICBzZWdtZW50c1tfc2VnT2Zmc2V0XSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdGV4OiB0ZXh0dXJlLFxuICAgICAgICAgICAgICAgICAgICBibGVuZE1vZGU6IGJsZW5kTW9kZSxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhDb3VudDogMCxcbiAgICAgICAgICAgICAgICAgICAgdmVydGV4Q291bnQ6IDAsXG4gICAgICAgICAgICAgICAgICAgIHZmQ291bnQ6IDBcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIF9zZWdPZmZzZXQrKztcbiAgICAgICAgICAgICAgICBfc2VnSUNvdW50ID0gMDtcbiAgICAgICAgICAgICAgICBfc2VnVkNvdW50ID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlzUmVnaW9uKSB7XG5cbiAgICAgICAgICAgICAgICB0cmlhbmdsZXMgPSBfcXVhZFRyaWFuZ2xlcztcblxuICAgICAgICAgICAgICAgIC8vIGluc3VyZSBjYXBhY2l0eVxuICAgICAgICAgICAgICAgIF92ZkNvdW50ID0gNCAqIF9wZXJWZXJ0ZXhTaXplO1xuICAgICAgICAgICAgICAgIF9pbmRleENvdW50ID0gNjtcblxuICAgICAgICAgICAgICAgIC8vIGNvbXB1dGUgdmVydGV4IGFuZCBmaWxsIHggeVxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnQuY29tcHV0ZVdvcmxkVmVydGljZXMoc2xvdC5ib25lLCBfdmVydGljZXMsIF92Zk9mZnNldCwgX3BlclZlcnRleFNpemUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNNZXNoKSB7XG5cbiAgICAgICAgICAgICAgICB0cmlhbmdsZXMgPSBhdHRhY2htZW50LnRyaWFuZ2xlcztcblxuICAgICAgICAgICAgICAgIC8vIGluc3VyZSBjYXBhY2l0eVxuICAgICAgICAgICAgICAgIF92ZkNvdW50ID0gKGF0dGFjaG1lbnQud29ybGRWZXJ0aWNlc0xlbmd0aCA+PiAxKSAqIF9wZXJWZXJ0ZXhTaXplO1xuICAgICAgICAgICAgICAgIF9pbmRleENvdW50ID0gdHJpYW5nbGVzLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIC8vIGNvbXB1dGUgdmVydGV4IGFuZCBmaWxsIHggeVxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnQuY29tcHV0ZVdvcmxkVmVydGljZXMoc2xvdCwgMCwgYXR0YWNobWVudC53b3JsZFZlcnRpY2VzTGVuZ3RoLCBfdmVydGljZXMsIF92Zk9mZnNldCwgX3BlclZlcnRleFNpemUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX3ZmQ291bnQgPT0gMCB8fCBfaW5kZXhDb3VudCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgY2xpcHBlci5jbGlwRW5kV2l0aFNsb3Qoc2xvdCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGZpbGwgaW5kaWNlc1xuICAgICAgICAgICAgZm9yIChsZXQgaWkgPSAwLCBqaiA9IF9pbmRleE9mZnNldCwgbm4gPSB0cmlhbmdsZXMubGVuZ3RoOyBpaSA8IG5uOykge1xuICAgICAgICAgICAgICAgIF9pbmRpY2VzW2pqKytdID0gdHJpYW5nbGVzW2lpKytdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmaWxsIHUgdlxuICAgICAgICAgICAgdXZzID0gYXR0YWNobWVudC51dnM7XG4gICAgICAgICAgICBmb3IgKGxldCB2ID0gX3ZmT2Zmc2V0LCBuID0gX3ZmT2Zmc2V0ICsgX3ZmQ291bnQsIHUgPSAwOyB2IDwgbjsgdiArPSBfcGVyVmVydGV4U2l6ZSwgdSArPSAyKSB7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzW3YgKyAyXSA9IHV2c1t1XTsgICAgICAgICAgIC8vIHVcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbdiArIDNdID0gdXZzW3UgKyAxXTsgICAgICAgLy8gdlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhdHRhY2htZW50Q29sb3IgPSBhdHRhY2htZW50LmNvbG9yO1xuICAgICAgICAgICAgc2xvdENvbG9yID0gc2xvdC5jb2xvcjtcblxuICAgICAgICAgICAgdGhpcy5maWxsVmVydGljZXMoc2tlbGV0b25Db2xvciwgYXR0YWNobWVudENvbG9yLCBzbG90Q29sb3IsIGNsaXBwZXIsIHNsb3QpO1xuXG4gICAgICAgICAgICBpZiAoX2luZGV4Q291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaWkgPSBfaW5kZXhPZmZzZXQsIG5uID0gX2luZGV4T2Zmc2V0ICsgX2luZGV4Q291bnQ7IGlpIDwgbm47IGlpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgX2luZGljZXNbaWldICs9IF9zZWdWQ291bnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF9pbmRleE9mZnNldCArPSBfaW5kZXhDb3VudDtcbiAgICAgICAgICAgICAgICBfdmZPZmZzZXQgKz0gX3ZmQ291bnQ7XG4gICAgICAgICAgICAgICAgX3ZlcnRleE9mZnNldCA9IF92Zk9mZnNldCAvIF9wZXJWZXJ0ZXhTaXplO1xuICAgICAgICAgICAgICAgIF9vZmZzZXRzLnB1c2goX3ZmT2Zmc2V0KTtcbiAgICAgICAgICAgICAgICBfc2VnSUNvdW50ICs9IF9pbmRleENvdW50O1xuICAgICAgICAgICAgICAgIF9zZWdWQ291bnQgKz0gX3ZmQ291bnQgLyBfcGVyVmVydGV4U2l6ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2xpcHBlci5jbGlwRW5kV2l0aFNsb3Qoc2xvdCk7XG4gICAgICAgIH1cblxuICAgICAgICBjbGlwcGVyLmNsaXBFbmQoKTtcbiAgICB9XG59KTtcblxubGV0IFNrZWxldG9uQ2FjaGUgPSBjYy5DbGFzcyh7XG4gICAgY3RvcigpIHtcbiAgICAgICAgdGhpcy5fcHJpdmF0ZU1vZGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fYW5pbWF0aW9uUG9vbCA9IHt9O1xuICAgICAgICB0aGlzLl9za2VsZXRvbkNhY2hlID0ge307XG4gICAgfSxcblxuICAgIGVuYWJsZVByaXZhdGVNb2RlKCkge1xuICAgICAgICB0aGlzLl9wcml2YXRlTW9kZSA9IHRydWU7XG4gICAgfSxcblxuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLl9hbmltYXRpb25Qb29sID0ge307XG4gICAgICAgIHRoaXMuX3NrZWxldG9uQ2FjaGUgPSB7fTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlU2tlbGV0b24odXVpZCkge1xuICAgICAgICAvLyB2YXIgc2tlbGV0b25JbmZvID0gdGhpcy5fc2tlbGV0b25DYWNoZVt1dWlkXTtcbiAgICAgICAgLy8gaWYgKCFza2VsZXRvbkluZm8pIHJldHVybjtcblxuICAgICAgICAvLyBsZXQgYW5pbWF0aW9uc0NhY2hlID0gc2tlbGV0b25JbmZvLmFuaW1hdGlvbnNDYWNoZTtcbiAgICAgICAgLy8gZm9yICh2YXIgYW5pS2V5IGluIGFuaW1hdGlvbnNDYWNoZSkge1xuICAgICAgICAvLyAgICAgLy8gQ2xlYXIgY2FjaGUgdGV4dHVyZSwgYW5kIHB1dCBjYWNoZSBpbnRvIHBvb2wuXG4gICAgICAgIC8vICAgICAvLyBObyBuZWVkIHRvIGNyZWF0ZSBUeXBlZEFycmF5IG5leHQgdGltZS5cbiAgICAgICAgLy8gICAgIGxldCBhbmltYXRpb25DYWNoZSA9IGFuaW1hdGlvbnNDYWNoZVthbmlLZXldO1xuICAgICAgICAvLyAgICAgaWYgKCFhbmltYXRpb25DYWNoZSkgY29udGludWU7XG4gICAgICAgIC8vICAgICB0aGlzLl9hbmltYXRpb25Qb29sW3V1aWQgKyBcIiNcIiArIGFuaUtleV0gPSBhbmltYXRpb25DYWNoZTtcbiAgICAgICAgLy8gICAgIGFuaW1hdGlvbkNhY2hlLmNsZWFyKCk7XG4gICAgICAgIC8vIH1cblxuICAgICAgICAvLyBkZWxldGUgdGhpcy5fc2tlbGV0b25DYWNoZVt1dWlkXTtcbiAgICAgICAgLy8gd2FuZ2NoZW5nIOS/ruWkjeWFseS6q+e8k+WtmOa4heeQhuS4jeW5suWHgOeahOmXrumimFxuICAgICAgICBsZXQgc2tlbGV0b25JbmZvO1xuICAgICAgICBmb3IgKGxldCBrIGluIHRoaXMuX3NrZWxldG9uQ2FjaGUpIHtcbiAgICAgICAgICAgIGxldCBfdXVpZCA9IGsuc3BsaXQoJ18nKVswXTtcbiAgICAgICAgICAgIGlmIChfdXVpZCA9PSB1dWlkKSB7XG4gICAgICAgICAgICAgICAgc2tlbGV0b25JbmZvID0gdGhpcy5fc2tlbGV0b25DYWNoZVtrXTtcbiAgICAgICAgICAgICAgICBpZiAoIXNrZWxldG9uSW5mbykgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICBsZXQgYW5pbWF0aW9uc0NhY2hlID0gc2tlbGV0b25JbmZvLmFuaW1hdGlvbnNDYWNoZTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBhbmlLZXkgaW4gYW5pbWF0aW9uc0NhY2hlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENsZWFyIGNhY2hlIHRleHR1cmUsIGFuZCBwdXQgY2FjaGUgaW50byBwb29sLlxuICAgICAgICAgICAgICAgICAgICAvLyBObyBuZWVkIHRvIGNyZWF0ZSBUeXBlZEFycmF5IG5leHQgdGltZS5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGFuaW1hdGlvbkNhY2hlID0gYW5pbWF0aW9uc0NhY2hlW2FuaUtleV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghYW5pbWF0aW9uQ2FjaGUpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hbmltYXRpb25Qb29sW191dWlkICsgXCIjXCIgKyBhbmlLZXldID0gYW5pbWF0aW9uQ2FjaGU7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbkNhY2hlLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3NrZWxldG9uQ2FjaGVba107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0U2tlbGV0b25DYWNoZSh1dWlkLCBza2VsZXRvbkRhdGEpIHtcbiAgICAgICAgbGV0IHNrZWxldG9uSW5mbyA9IHRoaXMuX3NrZWxldG9uQ2FjaGVbdXVpZF07XG4gICAgICAgIGlmICghc2tlbGV0b25JbmZvKSB7XG4gICAgICAgICAgICBsZXQgc2tlbGV0b24gPSBuZXcgc3BpbmUuU2tlbGV0b24oc2tlbGV0b25EYXRhKTtcbiAgICAgICAgICAgIGxldCBjbGlwcGVyID0gbmV3IHNwaW5lLlNrZWxldG9uQ2xpcHBpbmcoKTtcbiAgICAgICAgICAgIGxldCBzdGF0ZURhdGEgPSBuZXcgc3BpbmUuQW5pbWF0aW9uU3RhdGVEYXRhKHNrZWxldG9uLmRhdGEpO1xuICAgICAgICAgICAgbGV0IHN0YXRlID0gbmV3IHNwaW5lLkFuaW1hdGlvblN0YXRlKHN0YXRlRGF0YSk7XG4gICAgICAgICAgICBsZXQgbGlzdGVuZXIgPSBuZXcgVHJhY2tFbnRyeUxpc3RlbmVycygpO1xuICAgICAgICAgICAgc3RhdGUuYWRkTGlzdGVuZXIobGlzdGVuZXIpO1xuXG4gICAgICAgICAgICB0aGlzLl9za2VsZXRvbkNhY2hlW3V1aWRdID0gc2tlbGV0b25JbmZvID0ge1xuICAgICAgICAgICAgICAgIHNrZWxldG9uOiBza2VsZXRvbixcbiAgICAgICAgICAgICAgICBjbGlwcGVyOiBjbGlwcGVyLFxuICAgICAgICAgICAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcjogbGlzdGVuZXIsXG4gICAgICAgICAgICAgICAgLy8gQ2FjaGUgYWxsIGtpbmRzIG9mIGFuaW1hdGlvbiBmcmFtZS5cbiAgICAgICAgICAgICAgICAvLyBXaGVuIHNrZWxldG9uIGlzIGRpc3Bvc2UsIGNsZWFyIGFsbCBhbmltYXRpb24gY2FjaGUuXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uc0NhY2hlOiB7fSxcbiAgICAgICAgICAgICAgICBjdXJBbmltYXRpb25DYWNoZTogbnVsbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2tlbGV0b25JbmZvO1xuICAgIH0sXG5cbiAgICBnZXRBbmltYXRpb25DYWNoZSh1dWlkLCBhbmltYXRpb25OYW1lKSB7XG4gICAgICAgIGxldCBza2VsZXRvbkluZm8gPSB0aGlzLl9za2VsZXRvbkNhY2hlW3V1aWRdO1xuICAgICAgICBpZiAoIXNrZWxldG9uSW5mbykgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgbGV0IGFuaW1hdGlvbnNDYWNoZSA9IHNrZWxldG9uSW5mby5hbmltYXRpb25zQ2FjaGU7XG4gICAgICAgIHJldHVybiBhbmltYXRpb25zQ2FjaGVbYW5pbWF0aW9uTmFtZV07XG4gICAgfSxcblxuICAgIGludmFsaWRBbmltYXRpb25DYWNoZSh1dWlkKSB7XG4gICAgICAgIGxldCBza2VsZXRvbkluZm8gPSB0aGlzLl9za2VsZXRvbkNhY2hlW3V1aWRdO1xuICAgICAgICBsZXQgc2tlbGV0b24gPSBza2VsZXRvbkluZm8gJiYgc2tlbGV0b25JbmZvLnNrZWxldG9uO1xuICAgICAgICBpZiAoIXNrZWxldG9uKSByZXR1cm47XG5cbiAgICAgICAgbGV0IGFuaW1hdGlvbnNDYWNoZSA9IHNrZWxldG9uSW5mby5hbmltYXRpb25zQ2FjaGU7XG4gICAgICAgIGZvciAodmFyIGFuaUtleSBpbiBhbmltYXRpb25zQ2FjaGUpIHtcbiAgICAgICAgICAgIGxldCBhbmltYXRpb25DYWNoZSA9IGFuaW1hdGlvbnNDYWNoZVthbmlLZXldO1xuICAgICAgICAgICAgYW5pbWF0aW9uQ2FjaGUuaW52YWxpZEFsbEZyYW1lKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaW5pdEFuaW1hdGlvbkNhY2hlKHV1aWQsIGFuaW1hdGlvbk5hbWUpIHtcbiAgICAgICAgaWYgKCFhbmltYXRpb25OYW1lKSByZXR1cm4gbnVsbDtcbiAgICAgICAgbGV0IHNrZWxldG9uSW5mbyA9IHRoaXMuX3NrZWxldG9uQ2FjaGVbdXVpZF07XG4gICAgICAgIGxldCBza2VsZXRvbiA9IHNrZWxldG9uSW5mbyAmJiBza2VsZXRvbkluZm8uc2tlbGV0b247XG4gICAgICAgIGlmICghc2tlbGV0b24pIHJldHVybiBudWxsO1xuXG4gICAgICAgIGxldCBhbmltYXRpb24gPSBza2VsZXRvbi5kYXRhLmZpbmRBbmltYXRpb24oYW5pbWF0aW9uTmFtZSk7XG4gICAgICAgIGlmICghYW5pbWF0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBhbmltYXRpb25zQ2FjaGUgPSBza2VsZXRvbkluZm8uYW5pbWF0aW9uc0NhY2hlO1xuICAgICAgICBsZXQgYW5pbWF0aW9uQ2FjaGUgPSBhbmltYXRpb25zQ2FjaGVbYW5pbWF0aW9uTmFtZV07XG4gICAgICAgIGlmICghYW5pbWF0aW9uQ2FjaGUpIHtcbiAgICAgICAgICAgIC8vIElmIGNhY2hlIGV4aXN0IGluIHBvb2wsIHRoZW4ganVzdCB1c2UgaXQuXG4gICAgICAgICAgICBsZXQgcG9vbEtleSA9IHV1aWQgKyBcIiNcIiArIGFuaW1hdGlvbk5hbWU7XG4gICAgICAgICAgICBhbmltYXRpb25DYWNoZSA9IHRoaXMuX2FuaW1hdGlvblBvb2xbcG9vbEtleV07XG4gICAgICAgICAgICBpZiAoYW5pbWF0aW9uQ2FjaGUpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fYW5pbWF0aW9uUG9vbFtwb29sS2V5XTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uQ2FjaGUgPSBuZXcgQW5pbWF0aW9uQ2FjaGUoKTtcbiAgICAgICAgICAgICAgICBhbmltYXRpb25DYWNoZS5fcHJpdmF0ZU1vZGUgPSB0aGlzLl9wcml2YXRlTW9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFuaW1hdGlvbkNhY2hlLmluaXQoc2tlbGV0b25JbmZvLCBhbmltYXRpb25OYW1lKTtcbiAgICAgICAgICAgIGFuaW1hdGlvbnNDYWNoZVthbmltYXRpb25OYW1lXSA9IGFuaW1hdGlvbkNhY2hlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbmltYXRpb25DYWNoZTtcbiAgICB9LFxuXG4gICAgdXBkYXRlQW5pbWF0aW9uQ2FjaGUodXVpZCwgYW5pbWF0aW9uTmFtZSkge1xuICAgICAgICBpZiAoYW5pbWF0aW9uTmFtZSkge1xuICAgICAgICAgICAgbGV0IGFuaW1hdGlvbkNhY2hlID0gdGhpcy5pbml0QW5pbWF0aW9uQ2FjaGUodXVpZCwgYW5pbWF0aW9uTmFtZSk7XG4gICAgICAgICAgICBpZiAoIWFuaW1hdGlvbkNhY2hlKSByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIGFuaW1hdGlvbkNhY2hlLnVwZGF0ZUFsbEZyYW1lKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgc2tlbGV0b25JbmZvID0gdGhpcy5fc2tlbGV0b25DYWNoZVt1dWlkXTtcbiAgICAgICAgICAgIGxldCBza2VsZXRvbiA9IHNrZWxldG9uSW5mbyAmJiBza2VsZXRvbkluZm8uc2tlbGV0b247XG4gICAgICAgICAgICBpZiAoIXNrZWxldG9uKSByZXR1cm47XG5cbiAgICAgICAgICAgIGxldCBhbmltYXRpb25zQ2FjaGUgPSBza2VsZXRvbkluZm8uYW5pbWF0aW9uc0NhY2hlO1xuICAgICAgICAgICAgZm9yICh2YXIgYW5pS2V5IGluIGFuaW1hdGlvbnNDYWNoZSkge1xuICAgICAgICAgICAgICAgIGxldCBhbmltYXRpb25DYWNoZSA9IGFuaW1hdGlvbnNDYWNoZVthbmlLZXldO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbkNhY2hlLnVwZGF0ZUFsbEZyYW1lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuU2tlbGV0b25DYWNoZS5GcmFtZVRpbWUgPSBGcmFtZVRpbWU7XG5Ta2VsZXRvbkNhY2hlLnNoYXJlZENhY2hlID0gbmV3IFNrZWxldG9uQ2FjaGUoKTtcbm1vZHVsZS5leHBvcnRzID0gU2tlbGV0b25DYWNoZTsiXSwic291cmNlUm9vdCI6Ii8ifQ==