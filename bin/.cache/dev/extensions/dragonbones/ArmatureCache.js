
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/dragonbones/ArmatureCache.js';
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
var _preColor = null;

var _x, _y; //Cache all frames in an animation


var AnimationCache = cc.Class({
  ctor: function ctor() {
    this._privateMode = false;
    this._inited = false;
    this._invalid = true;
    this._enableCacheAttachedInfo = false;
    this.frames = [];
    this.totalTime = 0;
    this.isCompleted = false;
    this._frameIdx = -1;
    this._armatureInfo = null;
    this._animationName = null;
    this._tempSegments = null;
    this._tempColors = null;
    this._tempBoneInfos = null;
  },
  init: function init(armatureInfo, animationName) {
    this._inited = true;
    this._armatureInfo = armatureInfo;
    this._animationName = animationName;
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
  begin: function begin() {
    if (!this._invalid) return;
    var armatureInfo = this._armatureInfo;
    var curAnimationCache = armatureInfo.curAnimationCache;

    if (curAnimationCache && curAnimationCache != this) {
      if (this._privateMode) {
        curAnimationCache.invalidAllFrame();
      } else {
        curAnimationCache.updateToFrame();
      }
    }

    var armature = armatureInfo.armature;
    var animation = armature.animation;
    animation.play(this._animationName, 1);
    armatureInfo.curAnimationCache = this;
    this._invalid = false;
    this._frameIdx = -1;
    this.totalTime = 0;
    this.isCompleted = false;
  },
  end: function end() {
    if (!this._needToUpdate()) {
      this._armatureInfo.curAnimationCache = null;
      this.frames.length = this._frameIdx + 1;
      this.isCompleted = true;
    }
  },
  _needToUpdate: function _needToUpdate(toFrameIdx) {
    var armatureInfo = this._armatureInfo;
    var armature = armatureInfo.armature;
    var animation = armature.animation;
    return !animation.isCompleted && this.totalTime < MaxCacheTime && (toFrameIdx == undefined || this._frameIdx < toFrameIdx);
  },
  updateToFrame: function updateToFrame(toFrameIdx) {
    if (!this._inited) return;
    this.begin();
    if (!this._needToUpdate(toFrameIdx)) return;
    var armatureInfo = this._armatureInfo;
    var armature = armatureInfo.armature;

    do {
      // Solid update frame rate 1/60.
      armature.advanceTime(FrameTime);
      this._frameIdx++;

      this._updateFrame(armature, this._frameIdx);

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
  _updateFrame: function _updateFrame(armature, index) {
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
    _preColor = null;
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

    this._traverseArmature(armature, 1.0); // At last must handle pre color and segment.
    // Because vertex count will right at the end.
    // Handle pre color.


    if (_colorOffset > 0) {
      colors[_colorOffset - 1].vfOffset = _vfOffset;
    }

    colors.length = _colorOffset;
    boneInfos.length = _boneInfoOffset; // Handle pre segment

    var preSegOffset = _segOffset - 1;

    if (preSegOffset >= 0) {
      if (_segICount > 0) {
        var preSegInfo = segments[preSegOffset];
        preSegInfo.indexCount = _segICount;
        preSegInfo.vfCount = _segVCount * 5;
        preSegInfo.vertexCount = _segVCount;
        segments.length = _segOffset;
      } else {
        segments.length = _segOffset - 1;
      }
    } // Discard all segments.


    if (segments.length === 0) return; // Fill vertices

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

      uintVert[i++] = _vertices[j++]; // color
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
  _traverseArmature: function _traverseArmature(armature, parentOpacity) {
    var colors = this._tempColors;
    var segments = this._tempSegments;
    var boneInfos = this._tempBoneInfos;
    var gVertices = _vertices;
    var gIndices = _indices;
    var slotVertices, slotIndices;
    var slots = armature._slots,
        slot,
        slotMatrix,
        slotMatrixm,
        slotColor,
        colorVal;
    var texture;
    var preSegOffset, preSegInfo;
    var bones = armature._bones;

    if (this._enableCacheAttachedInfo) {
      for (var i = 0, l = bones.length; i < l; i++, _boneInfoOffset++) {
        var bone = bones[i];
        var boneInfo = boneInfos[_boneInfoOffset];

        if (!boneInfo) {
          boneInfo = boneInfos[_boneInfoOffset] = {
            globalTransformMatrix: new dragonBones.Matrix()
          };
        }

        var boneMat = bone.globalTransformMatrix;
        var cacheBoneMat = boneInfo.globalTransformMatrix;
        cacheBoneMat.copyFrom(boneMat);
      }
    }

    for (var _i2 = 0, _l = slots.length; _i2 < _l; _i2++) {
      slot = slots[_i2];
      if (!slot._visible || !slot._displayData) continue;
      slot.updateWorldMatrix();
      slotColor = slot._color;

      if (slot.childArmature) {
        this._traverseArmature(slot.childArmature, parentOpacity * slotColor.a / 255);

        continue;
      }

      texture = slot.getTexture();
      if (!texture) continue;

      if (_preTexUrl !== texture.nativeUrl || _preBlendMode !== slot._blendMode) {
        _preTexUrl = texture.nativeUrl;
        _preBlendMode = slot._blendMode; // Handle pre segment.

        preSegOffset = _segOffset - 1;

        if (preSegOffset >= 0) {
          if (_segICount > 0) {
            preSegInfo = segments[preSegOffset];
            preSegInfo.indexCount = _segICount;
            preSegInfo.vertexCount = _segVCount;
            preSegInfo.vfCount = _segVCount * 5;
          } else {
            // Discard pre segment.
            _segOffset--;
          }
        } // Handle now segment.


        segments[_segOffset] = {
          tex: texture,
          blendMode: slot._blendMode,
          indexCount: 0,
          vertexCount: 0,
          vfCount: 0
        };
        _segOffset++;
        _segICount = 0;
        _segVCount = 0;
      }

      colorVal = (slotColor.a * parentOpacity << 24 >>> 0) + (slotColor.b << 16) + (slotColor.g << 8) + slotColor.r;

      if (_preColor !== colorVal) {
        _preColor = colorVal;

        if (_colorOffset > 0) {
          colors[_colorOffset - 1].vfOffset = _vfOffset;
        }

        colors[_colorOffset++] = {
          r: slotColor.r,
          g: slotColor.g,
          b: slotColor.b,
          a: slotColor.a * parentOpacity,
          vfOffset: 0
        };
      }

      slotVertices = slot._localVertices;
      slotIndices = slot._indices;
      slotMatrix = slot._worldMatrix;
      slotMatrixm = slotMatrix.m;

      for (var j = 0, vl = slotVertices.length; j < vl;) {
        _x = slotVertices[j++];
        _y = slotVertices[j++];
        gVertices[_vfOffset++] = _x * slotMatrixm[0] + _y * slotMatrixm[4] + slotMatrixm[12];
        gVertices[_vfOffset++] = _x * slotMatrixm[1] + _y * slotMatrixm[5] + slotMatrixm[13];
        gVertices[_vfOffset++] = slotVertices[j++];
        gVertices[_vfOffset++] = slotVertices[j++];
        gVertices[_vfOffset++] = colorVal;
      } // This place must use segment vertex count to calculate vertex offset.
      // Assembler will calculate vertex offset again for different segment.


      for (var ii = 0, il = slotIndices.length; ii < il; ii++) {
        gIndices[_indexOffset++] = _segVCount + slotIndices[ii];
      }

      _vertexOffset = _vfOffset / 5;
      _segICount += slotIndices.length;
      _segVCount += slotVertices.length / 4;
    }
  }
});
var ArmatureCache = cc.Class({
  ctor: function ctor() {
    this._privateMode = false;
    this._animationPool = {};
    this._armatureCache = {};
  },
  enablePrivateMode: function enablePrivateMode() {
    this._privateMode = true;
  },
  // If cache is private, cache will be destroy when dragonbones node destroy.
  dispose: function dispose() {
    for (var key in this._armatureCache) {
      var armatureInfo = this._armatureCache[key];

      if (armatureInfo) {
        var armature = armatureInfo.armature;
        armature && armature.dispose();
      }
    }

    this._armatureCache = null;
    this._animationPool = null;
  },
  _removeArmature: function _removeArmature(armatureKey) {
    var armatureInfo = this._armatureCache[armatureKey];
    var animationsCache = armatureInfo.animationsCache;

    for (var aniKey in animationsCache) {
      // Clear cache texture, and put cache into pool.
      // No need to create TypedArray next time.
      var animationCache = animationsCache[aniKey];
      if (!animationCache) continue;
      this._animationPool[armatureKey + "#" + aniKey] = animationCache;
      animationCache.clear();
    }

    var armature = armatureInfo.armature;
    armature && armature.dispose();
    delete this._armatureCache[armatureKey];
  },
  // When db assets be destroy, remove armature from db cache.
  resetArmature: function resetArmature(uuid) {
    for (var armatureKey in this._armatureCache) {
      if (armatureKey.indexOf(uuid) == -1) continue;

      this._removeArmature(armatureKey);
    }
  },
  getArmatureCache: function getArmatureCache(armatureName, armatureKey, atlasUUID) {
    var armatureInfo = this._armatureCache[armatureKey];
    var armature;

    if (!armatureInfo) {
      var factory = dragonBones.CCFactory.getInstance();
      var proxy = factory.buildArmatureDisplay(armatureName, armatureKey, "", atlasUUID);
      if (!proxy || !proxy._armature) return;
      armature = proxy._armature; // If armature has child armature, can not be cache, because it's
      // animation data can not be precompute.

      if (!ArmatureCache.canCache(armature)) {
        armature.dispose();
        return;
      }

      this._armatureCache[armatureKey] = {
        armature: armature,
        // Cache all kinds of animation frame.
        // When armature is dispose, clear all animation cache.
        animationsCache: {},
        curAnimationCache: null
      };
    } else {
      armature = armatureInfo.armature;
    }

    return armature;
  },
  getAnimationCache: function getAnimationCache(armatureKey, animationName) {
    var armatureInfo = this._armatureCache[armatureKey];
    if (!armatureInfo) return null;
    var animationsCache = armatureInfo.animationsCache;
    return animationsCache[animationName];
  },
  initAnimationCache: function initAnimationCache(armatureKey, animationName) {
    if (!animationName) return null;
    var armatureInfo = this._armatureCache[armatureKey];
    var armature = armatureInfo && armatureInfo.armature;
    if (!armature) return null;
    var animation = armature.animation;
    var hasAni = animation.hasAnimation(animationName);
    if (!hasAni) return null;
    var animationsCache = armatureInfo.animationsCache;
    var animationCache = animationsCache[animationName];

    if (!animationCache) {
      // If cache exist in pool, then just use it.
      var poolKey = armatureKey + "#" + animationName;
      animationCache = this._animationPool[poolKey];

      if (animationCache) {
        delete this._animationPool[poolKey];
      } else {
        animationCache = new AnimationCache();
        animationCache._privateMode = this._privateMode;
      }

      animationCache.init(armatureInfo, animationName);
      animationsCache[animationName] = animationCache;
    }

    return animationCache;
  },
  invalidAnimationCache: function invalidAnimationCache(armatureKey) {
    var armatureInfo = this._armatureCache[armatureKey];
    var armature = armatureInfo && armatureInfo.armature;
    if (!armature) return null;
    var animationsCache = armatureInfo.animationsCache;

    for (var aniKey in animationsCache) {
      var animationCache = animationsCache[aniKey];
      animationCache.invalidAllFrame();
    }
  },
  updateAnimationCache: function updateAnimationCache(armatureKey, animationName) {
    if (animationName) {
      var animationCache = this.initAnimationCache(armatureKey, animationName);
      if (!animationCache) return;
      animationCache.updateAllFrame();
    } else {
      var armatureInfo = this._armatureCache[armatureKey];
      var armature = armatureInfo && armatureInfo.armature;
      if (!armature) return null;
      var animationsCache = armatureInfo.animationsCache;

      for (var aniKey in animationsCache) {
        var _animationCache = animationsCache[aniKey];

        _animationCache.updateAllFrame();
      }
    }
  }
});
ArmatureCache.FrameTime = FrameTime;
ArmatureCache.sharedCache = new ArmatureCache();
ArmatureCache.canCache = function (armature) {
  var slots = armature._slots;

  for (var i = 0, l = slots.length; i < l; i++) {
    var slot = slots[i];

    if (slot.childArmature) {
      return false;
    }
  }

  return true;
}, module.exports = ArmatureCache;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvZXh0ZW5zaW9ucy9kcmFnb25ib25lcy9Bcm1hdHVyZUNhY2hlLmpzIl0sIm5hbWVzIjpbIk1heENhY2hlVGltZSIsIkZyYW1lVGltZSIsIl92ZXJ0aWNlcyIsIl9pbmRpY2VzIiwiX2JvbmVJbmZvT2Zmc2V0IiwiX3ZlcnRleE9mZnNldCIsIl9pbmRleE9mZnNldCIsIl92Zk9mZnNldCIsIl9wcmVUZXhVcmwiLCJfcHJlQmxlbmRNb2RlIiwiX3NlZ1ZDb3VudCIsIl9zZWdJQ291bnQiLCJfc2VnT2Zmc2V0IiwiX2NvbG9yT2Zmc2V0IiwiX3ByZUNvbG9yIiwiX3giLCJfeSIsIkFuaW1hdGlvbkNhY2hlIiwiY2MiLCJDbGFzcyIsImN0b3IiLCJfcHJpdmF0ZU1vZGUiLCJfaW5pdGVkIiwiX2ludmFsaWQiLCJfZW5hYmxlQ2FjaGVBdHRhY2hlZEluZm8iLCJmcmFtZXMiLCJ0b3RhbFRpbWUiLCJpc0NvbXBsZXRlZCIsIl9mcmFtZUlkeCIsIl9hcm1hdHVyZUluZm8iLCJfYW5pbWF0aW9uTmFtZSIsIl90ZW1wU2VnbWVudHMiLCJfdGVtcENvbG9ycyIsIl90ZW1wQm9uZUluZm9zIiwiaW5pdCIsImFybWF0dXJlSW5mbyIsImFuaW1hdGlvbk5hbWUiLCJjbGVhciIsImkiLCJuIiwibGVuZ3RoIiwiZnJhbWUiLCJzZWdtZW50cyIsImludmFsaWRBbGxGcmFtZSIsImJlZ2luIiwiY3VyQW5pbWF0aW9uQ2FjaGUiLCJ1cGRhdGVUb0ZyYW1lIiwiYXJtYXR1cmUiLCJhbmltYXRpb24iLCJwbGF5IiwiZW5kIiwiX25lZWRUb1VwZGF0ZSIsInRvRnJhbWVJZHgiLCJ1bmRlZmluZWQiLCJhZHZhbmNlVGltZSIsIl91cGRhdGVGcmFtZSIsImlzSW5pdGVkIiwiaXNJbnZhbGlkIiwidXBkYXRlQWxsRnJhbWUiLCJlbmFibGVDYWNoZUF0dGFjaGVkSW5mbyIsImluZGV4IiwiY29sb3JzIiwiYm9uZUluZm9zIiwidmVydGljZXMiLCJ1aW50VmVydCIsImluZGljZXMiLCJfdHJhdmVyc2VBcm1hdHVyZSIsInZmT2Zmc2V0IiwicHJlU2VnT2Zmc2V0IiwicHJlU2VnSW5mbyIsImluZGV4Q291bnQiLCJ2ZkNvdW50IiwidmVydGV4Q291bnQiLCJGbG9hdDMyQXJyYXkiLCJVaW50MzJBcnJheSIsImJ1ZmZlciIsImoiLCJVaW50MTZBcnJheSIsInBhcmVudE9wYWNpdHkiLCJnVmVydGljZXMiLCJnSW5kaWNlcyIsInNsb3RWZXJ0aWNlcyIsInNsb3RJbmRpY2VzIiwic2xvdHMiLCJfc2xvdHMiLCJzbG90Iiwic2xvdE1hdHJpeCIsInNsb3RNYXRyaXhtIiwic2xvdENvbG9yIiwiY29sb3JWYWwiLCJ0ZXh0dXJlIiwiYm9uZXMiLCJfYm9uZXMiLCJsIiwiYm9uZSIsImJvbmVJbmZvIiwiZ2xvYmFsVHJhbnNmb3JtTWF0cml4IiwiZHJhZ29uQm9uZXMiLCJNYXRyaXgiLCJib25lTWF0IiwiY2FjaGVCb25lTWF0IiwiY29weUZyb20iLCJfdmlzaWJsZSIsIl9kaXNwbGF5RGF0YSIsInVwZGF0ZVdvcmxkTWF0cml4IiwiX2NvbG9yIiwiY2hpbGRBcm1hdHVyZSIsImEiLCJnZXRUZXh0dXJlIiwibmF0aXZlVXJsIiwiX2JsZW5kTW9kZSIsInRleCIsImJsZW5kTW9kZSIsImIiLCJnIiwiciIsIl9sb2NhbFZlcnRpY2VzIiwiX3dvcmxkTWF0cml4IiwibSIsInZsIiwiaWkiLCJpbCIsIkFybWF0dXJlQ2FjaGUiLCJfYW5pbWF0aW9uUG9vbCIsIl9hcm1hdHVyZUNhY2hlIiwiZW5hYmxlUHJpdmF0ZU1vZGUiLCJkaXNwb3NlIiwia2V5IiwiX3JlbW92ZUFybWF0dXJlIiwiYXJtYXR1cmVLZXkiLCJhbmltYXRpb25zQ2FjaGUiLCJhbmlLZXkiLCJhbmltYXRpb25DYWNoZSIsInJlc2V0QXJtYXR1cmUiLCJ1dWlkIiwiaW5kZXhPZiIsImdldEFybWF0dXJlQ2FjaGUiLCJhcm1hdHVyZU5hbWUiLCJhdGxhc1VVSUQiLCJmYWN0b3J5IiwiQ0NGYWN0b3J5IiwiZ2V0SW5zdGFuY2UiLCJwcm94eSIsImJ1aWxkQXJtYXR1cmVEaXNwbGF5IiwiX2FybWF0dXJlIiwiY2FuQ2FjaGUiLCJnZXRBbmltYXRpb25DYWNoZSIsImluaXRBbmltYXRpb25DYWNoZSIsImhhc0FuaSIsImhhc0FuaW1hdGlvbiIsInBvb2xLZXkiLCJpbnZhbGlkQW5pbWF0aW9uQ2FjaGUiLCJ1cGRhdGVBbmltYXRpb25DYWNoZSIsInNoYXJlZENhY2hlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU1BLFlBQVksR0FBRyxFQUFyQjtBQUNBLElBQU1DLFNBQVMsR0FBRyxJQUFJLEVBQXRCO0FBRUEsSUFBSUMsU0FBUyxHQUFHLEVBQWhCO0FBQ0EsSUFBSUMsUUFBUSxHQUFHLEVBQWY7QUFDQSxJQUFJQyxlQUFlLEdBQUcsQ0FBdEI7QUFDQSxJQUFJQyxhQUFhLEdBQUcsQ0FBcEI7QUFDQSxJQUFJQyxZQUFZLEdBQUcsQ0FBbkI7QUFDQSxJQUFJQyxTQUFTLEdBQUcsQ0FBaEI7QUFDQSxJQUFJQyxVQUFVLEdBQUcsSUFBakI7QUFDQSxJQUFJQyxhQUFhLEdBQUcsSUFBcEI7QUFDQSxJQUFJQyxVQUFVLEdBQUcsQ0FBakI7QUFDQSxJQUFJQyxVQUFVLEdBQUcsQ0FBakI7QUFDQSxJQUFJQyxVQUFVLEdBQUcsQ0FBakI7QUFDQSxJQUFJQyxZQUFZLEdBQUcsQ0FBbkI7QUFDQSxJQUFJQyxTQUFTLEdBQUcsSUFBaEI7O0FBQ0EsSUFBSUMsRUFBSixFQUFRQyxFQUFSLEVBRUE7OztBQUNBLElBQUlDLGNBQWMsR0FBR0MsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDMUJDLEVBQUFBLElBRDBCLGtCQUNsQjtBQUNKLFNBQUtDLFlBQUwsR0FBb0IsS0FBcEI7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QyxFQUExQyxFQUE4QztBQUMxQyxRQUFJK0MsSUFBSSxHQUFHRixLQUFLLENBQUM3QyxDQUFELENBQWhCOztBQUNBLFFBQUkrQyxJQUFJLENBQUNxQixhQUFULEVBQXdCO0FBQ3BCLGFBQU8sS0FBUDtBQUNIO0FBQ0o7O0FBQ0QsU0FBTyxJQUFQO0FBQ0gsQ0FURCxFQVdBZ0QsTUFBTSxDQUFDQyxPQUFQLEdBQWlCakMsYUFYakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmNvbnN0IE1heENhY2hlVGltZSA9IDMwO1xuY29uc3QgRnJhbWVUaW1lID0gMSAvIDYwOyBcblxubGV0IF92ZXJ0aWNlcyA9IFtdO1xubGV0IF9pbmRpY2VzID0gW107XG5sZXQgX2JvbmVJbmZvT2Zmc2V0ID0gMDtcbmxldCBfdmVydGV4T2Zmc2V0ID0gMDtcbmxldCBfaW5kZXhPZmZzZXQgPSAwO1xubGV0IF92Zk9mZnNldCA9IDA7XG5sZXQgX3ByZVRleFVybCA9IG51bGw7XG5sZXQgX3ByZUJsZW5kTW9kZSA9IG51bGw7XG5sZXQgX3NlZ1ZDb3VudCA9IDA7XG5sZXQgX3NlZ0lDb3VudCA9IDA7XG5sZXQgX3NlZ09mZnNldCA9IDA7XG5sZXQgX2NvbG9yT2Zmc2V0ID0gMDtcbmxldCBfcHJlQ29sb3IgPSBudWxsO1xubGV0IF94LCBfeTtcblxuLy9DYWNoZSBhbGwgZnJhbWVzIGluIGFuIGFuaW1hdGlvblxubGV0IEFuaW1hdGlvbkNhY2hlID0gY2MuQ2xhc3Moe1xuICAgIGN0b3IgKCkge1xuICAgICAgICB0aGlzLl9wcml2YXRlTW9kZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pbml0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faW52YWxpZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX2VuYWJsZUNhY2hlQXR0YWNoZWRJbmZvID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZnJhbWVzID0gW107XG4gICAgICAgIHRoaXMudG90YWxUaW1lID0gMDtcbiAgICAgICAgdGhpcy5pc0NvbXBsZXRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9mcmFtZUlkeCA9IC0xO1xuXG4gICAgICAgIHRoaXMuX2FybWF0dXJlSW5mbyA9IG51bGw7XG4gICAgICAgIHRoaXMuX2FuaW1hdGlvbk5hbWUgPSBudWxsO1xuICAgICAgICB0aGlzLl90ZW1wU2VnbWVudHMgPSBudWxsO1xuICAgICAgICB0aGlzLl90ZW1wQ29sb3JzID0gbnVsbDtcbiAgICAgICAgdGhpcy5fdGVtcEJvbmVJbmZvcyA9IG51bGw7XG4gICAgfSxcblxuICAgIGluaXQgKGFybWF0dXJlSW5mbywgYW5pbWF0aW9uTmFtZSkge1xuICAgICAgICB0aGlzLl9pbml0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9hcm1hdHVyZUluZm8gPSBhcm1hdHVyZUluZm87XG4gICAgICAgIHRoaXMuX2FuaW1hdGlvbk5hbWUgPSBhbmltYXRpb25OYW1lO1xuICAgIH0sXG5cbiAgICAvLyBDbGVhciB0ZXh0dXJlIHF1b3RlLlxuICAgIGNsZWFyICgpIHtcbiAgICAgICAgdGhpcy5faW5pdGVkID0gZmFsc2U7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBuID0gdGhpcy5mcmFtZXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZnJhbWUgPSB0aGlzLmZyYW1lc1tpXTtcbiAgICAgICAgICAgIGZyYW1lLnNlZ21lbnRzLmxlbmd0aCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnZhbGlkQWxsRnJhbWUoKTtcbiAgICB9LFxuXG4gICAgYmVnaW4gKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2ludmFsaWQpIHJldHVybjtcblxuICAgICAgICBsZXQgYXJtYXR1cmVJbmZvID0gdGhpcy5fYXJtYXR1cmVJbmZvO1xuICAgICAgICBsZXQgY3VyQW5pbWF0aW9uQ2FjaGUgPSBhcm1hdHVyZUluZm8uY3VyQW5pbWF0aW9uQ2FjaGU7XG4gICAgICAgIGlmIChjdXJBbmltYXRpb25DYWNoZSAmJiBjdXJBbmltYXRpb25DYWNoZSAhPSB0aGlzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcHJpdmF0ZU1vZGUpIHtcbiAgICAgICAgICAgICAgICBjdXJBbmltYXRpb25DYWNoZS5pbnZhbGlkQWxsRnJhbWUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY3VyQW5pbWF0aW9uQ2FjaGUudXBkYXRlVG9GcmFtZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBhcm1hdHVyZSA9IGFybWF0dXJlSW5mby5hcm1hdHVyZTtcbiAgICAgICAgbGV0IGFuaW1hdGlvbiA9IGFybWF0dXJlLmFuaW1hdGlvbjtcbiAgICAgICAgYW5pbWF0aW9uLnBsYXkodGhpcy5fYW5pbWF0aW9uTmFtZSwgMSk7XG5cbiAgICAgICAgYXJtYXR1cmVJbmZvLmN1ckFuaW1hdGlvbkNhY2hlID0gdGhpcztcbiAgICAgICAgdGhpcy5faW52YWxpZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9mcmFtZUlkeCA9IC0xO1xuICAgICAgICB0aGlzLnRvdGFsVGltZSA9IDA7XG4gICAgICAgIHRoaXMuaXNDb21wbGV0ZWQgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgZW5kICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9uZWVkVG9VcGRhdGUoKSkge1xuICAgICAgICAgICAgdGhpcy5fYXJtYXR1cmVJbmZvLmN1ckFuaW1hdGlvbkNhY2hlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZnJhbWVzLmxlbmd0aCA9IHRoaXMuX2ZyYW1lSWR4ICsgMTtcbiAgICAgICAgICAgIHRoaXMuaXNDb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9uZWVkVG9VcGRhdGUgKHRvRnJhbWVJZHgpIHtcbiAgICAgICAgbGV0IGFybWF0dXJlSW5mbyA9IHRoaXMuX2FybWF0dXJlSW5mbztcbiAgICAgICAgbGV0IGFybWF0dXJlID0gYXJtYXR1cmVJbmZvLmFybWF0dXJlO1xuICAgICAgICBsZXQgYW5pbWF0aW9uID0gYXJtYXR1cmUuYW5pbWF0aW9uO1xuICAgICAgICByZXR1cm4gIWFuaW1hdGlvbi5pc0NvbXBsZXRlZCAmJiBcbiAgICAgICAgICAgICAgICB0aGlzLnRvdGFsVGltZSA8IE1heENhY2hlVGltZSAmJiBcbiAgICAgICAgICAgICAgICAodG9GcmFtZUlkeCA9PSB1bmRlZmluZWQgfHwgdGhpcy5fZnJhbWVJZHggPCB0b0ZyYW1lSWR4KTtcbiAgICB9LFxuXG4gICAgdXBkYXRlVG9GcmFtZSAodG9GcmFtZUlkeCkge1xuICAgICAgICBpZiAoIXRoaXMuX2luaXRlZCkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuYmVnaW4oKTtcblxuICAgICAgICBpZiAoIXRoaXMuX25lZWRUb1VwZGF0ZSh0b0ZyYW1lSWR4KSkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBhcm1hdHVyZUluZm8gPSB0aGlzLl9hcm1hdHVyZUluZm87XG4gICAgICAgIGxldCBhcm1hdHVyZSA9IGFybWF0dXJlSW5mby5hcm1hdHVyZTtcblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICAvLyBTb2xpZCB1cGRhdGUgZnJhbWUgcmF0ZSAxLzYwLlxuICAgICAgICAgICAgYXJtYXR1cmUuYWR2YW5jZVRpbWUoRnJhbWVUaW1lKTtcbiAgICAgICAgICAgIHRoaXMuX2ZyYW1lSWR4Kys7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVGcmFtZShhcm1hdHVyZSwgdGhpcy5fZnJhbWVJZHgpO1xuICAgICAgICAgICAgdGhpcy50b3RhbFRpbWUgKz0gRnJhbWVUaW1lO1xuICAgICAgICB9IHdoaWxlICh0aGlzLl9uZWVkVG9VcGRhdGUodG9GcmFtZUlkeCkpO1xuICAgICAgIFxuICAgICAgICB0aGlzLmVuZCgpO1xuICAgIH0sXG5cbiAgICBpc0luaXRlZCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbml0ZWQ7XG4gICAgfSxcblxuICAgIGlzSW52YWxpZCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZhbGlkO1xuICAgIH0sXG5cbiAgICBpbnZhbGlkQWxsRnJhbWUgKCkge1xuICAgICAgICB0aGlzLmlzQ29tcGxldGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2ludmFsaWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICB1cGRhdGVBbGxGcmFtZSAoKSB7XG4gICAgICAgIHRoaXMuaW52YWxpZEFsbEZyYW1lKCk7XG4gICAgICAgIHRoaXMudXBkYXRlVG9GcmFtZSgpO1xuICAgIH0sXG5cbiAgICBlbmFibGVDYWNoZUF0dGFjaGVkSW5mbyAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fZW5hYmxlQ2FjaGVBdHRhY2hlZEluZm8pIHtcbiAgICAgICAgICAgIHRoaXMuX2VuYWJsZUNhY2hlQXR0YWNoZWRJbmZvID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZEFsbEZyYW1lKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VwZGF0ZUZyYW1lIChhcm1hdHVyZSwgaW5kZXgpIHtcbiAgICAgICAgX3ZmT2Zmc2V0ID0gMDtcbiAgICAgICAgX2JvbmVJbmZvT2Zmc2V0ID0gMDtcbiAgICAgICAgX2luZGV4T2Zmc2V0ID0gMDtcbiAgICAgICAgX3ZlcnRleE9mZnNldCA9IDA7XG4gICAgICAgIF9wcmVUZXhVcmwgPSBudWxsO1xuICAgICAgICBfcHJlQmxlbmRNb2RlID0gbnVsbDtcbiAgICAgICAgX3NlZ1ZDb3VudCA9IDA7XG4gICAgICAgIF9zZWdJQ291bnQgPSAwO1xuICAgICAgICBfc2VnT2Zmc2V0ID0gMDtcbiAgICAgICAgX2NvbG9yT2Zmc2V0ID0gMDtcbiAgICAgICAgX3ByZUNvbG9yID0gbnVsbDtcblxuICAgICAgICB0aGlzLmZyYW1lc1tpbmRleF0gPSB0aGlzLmZyYW1lc1tpbmRleF0gfHwge1xuICAgICAgICAgICAgc2VnbWVudHMgOiBbXSxcbiAgICAgICAgICAgIGNvbG9ycyA6IFtdLFxuICAgICAgICAgICAgYm9uZUluZm9zIDogW10sXG4gICAgICAgICAgICB2ZXJ0aWNlcyA6IG51bGwsXG4gICAgICAgICAgICB1aW50VmVydCA6IG51bGwsXG4gICAgICAgICAgICBpbmRpY2VzIDogbnVsbCxcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGZyYW1lID0gdGhpcy5mcmFtZXNbaW5kZXhdO1xuXG4gICAgICAgIGxldCBzZWdtZW50cyA9IHRoaXMuX3RlbXBTZWdtZW50cyA9IGZyYW1lLnNlZ21lbnRzO1xuICAgICAgICBsZXQgY29sb3JzID0gdGhpcy5fdGVtcENvbG9ycyA9IGZyYW1lLmNvbG9ycztcbiAgICAgICAgbGV0IGJvbmVJbmZvcyA9IHRoaXMuX3RlbXBCb25lSW5mb3MgPSBmcmFtZS5ib25lSW5mb3M7XG4gICAgICAgIHRoaXMuX3RyYXZlcnNlQXJtYXR1cmUoYXJtYXR1cmUsIDEuMCk7XG4gICAgICAgIC8vIEF0IGxhc3QgbXVzdCBoYW5kbGUgcHJlIGNvbG9yIGFuZCBzZWdtZW50LlxuICAgICAgICAvLyBCZWNhdXNlIHZlcnRleCBjb3VudCB3aWxsIHJpZ2h0IGF0IHRoZSBlbmQuXG4gICAgICAgIC8vIEhhbmRsZSBwcmUgY29sb3IuXG4gICAgICAgIGlmIChfY29sb3JPZmZzZXQgPiAwKSB7XG4gICAgICAgICAgICBjb2xvcnNbX2NvbG9yT2Zmc2V0IC0gMV0udmZPZmZzZXQgPSBfdmZPZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgY29sb3JzLmxlbmd0aCA9IF9jb2xvck9mZnNldDtcbiAgICAgICAgYm9uZUluZm9zLmxlbmd0aCA9IF9ib25lSW5mb09mZnNldDtcbiAgICAgICAgXG4gICAgICAgIC8vIEhhbmRsZSBwcmUgc2VnbWVudFxuICAgICAgICBsZXQgcHJlU2VnT2Zmc2V0ID0gX3NlZ09mZnNldCAtIDE7XG4gICAgICAgIGlmIChwcmVTZWdPZmZzZXQgPj0gMCkge1xuICAgICAgICAgICAgaWYgKF9zZWdJQ291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IHByZVNlZ0luZm8gPSBzZWdtZW50c1twcmVTZWdPZmZzZXRdO1xuICAgICAgICAgICAgICAgIHByZVNlZ0luZm8uaW5kZXhDb3VudCA9IF9zZWdJQ291bnQ7XG4gICAgICAgICAgICAgICAgcHJlU2VnSW5mby52ZkNvdW50ID0gX3NlZ1ZDb3VudCAqIDU7XG4gICAgICAgICAgICAgICAgcHJlU2VnSW5mby52ZXJ0ZXhDb3VudCA9IF9zZWdWQ291bnQ7XG4gICAgICAgICAgICAgICAgc2VnbWVudHMubGVuZ3RoID0gX3NlZ09mZnNldDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VnbWVudHMubGVuZ3RoID0gX3NlZ09mZnNldCAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEaXNjYXJkIGFsbCBzZWdtZW50cy5cbiAgICAgICAgaWYgKHNlZ21lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgICAgIC8vIEZpbGwgdmVydGljZXNcbiAgICAgICAgbGV0IHZlcnRpY2VzID0gZnJhbWUudmVydGljZXM7XG4gICAgICAgIGxldCB1aW50VmVydCA9IGZyYW1lLnVpbnRWZXJ0O1xuICAgICAgICBpZiAoIXZlcnRpY2VzIHx8IHZlcnRpY2VzLmxlbmd0aCA8IF92Zk9mZnNldCkge1xuICAgICAgICAgICAgdmVydGljZXMgPSBmcmFtZS52ZXJ0aWNlcyA9IG5ldyBGbG9hdDMyQXJyYXkoX3ZmT2Zmc2V0KTtcbiAgICAgICAgICAgIHVpbnRWZXJ0ID0gZnJhbWUudWludFZlcnQgPSBuZXcgVWludDMyQXJyYXkodmVydGljZXMuYnVmZmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBqID0gMDsgaSA8IF92Zk9mZnNldDspIHtcbiAgICAgICAgICAgIHZlcnRpY2VzW2krK10gPSBfdmVydGljZXNbaisrXTsgLy8geFxuICAgICAgICAgICAgdmVydGljZXNbaSsrXSA9IF92ZXJ0aWNlc1tqKytdOyAvLyB5XG4gICAgICAgICAgICB2ZXJ0aWNlc1tpKytdID0gX3ZlcnRpY2VzW2orK107IC8vIHVcbiAgICAgICAgICAgIHZlcnRpY2VzW2krK10gPSBfdmVydGljZXNbaisrXTsgLy8gdlxuICAgICAgICAgICAgdWludFZlcnRbaSsrXSA9IF92ZXJ0aWNlc1tqKytdOyAvLyBjb2xvclxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmlsbCBpbmRpY2VzXG4gICAgICAgIGxldCBpbmRpY2VzID0gZnJhbWUuaW5kaWNlcztcbiAgICAgICAgaWYgKCFpbmRpY2VzIHx8IGluZGljZXMubGVuZ3RoIDwgX2luZGV4T2Zmc2V0KSB7XG4gICAgICAgICAgICBpbmRpY2VzID0gZnJhbWUuaW5kaWNlcyA9IG5ldyBVaW50MTZBcnJheShfaW5kZXhPZmZzZXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfaW5kZXhPZmZzZXQ7IGkrKykge1xuICAgICAgICAgICAgaW5kaWNlc1tpXSA9IF9pbmRpY2VzW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgZnJhbWUudmVydGljZXMgPSB2ZXJ0aWNlcztcbiAgICAgICAgZnJhbWUudWludFZlcnQgPSB1aW50VmVydDtcbiAgICAgICAgZnJhbWUuaW5kaWNlcyA9IGluZGljZXM7XG4gICAgfSxcblxuICAgIF90cmF2ZXJzZUFybWF0dXJlIChhcm1hdHVyZSwgcGFyZW50T3BhY2l0eSkge1xuICAgICAgICBsZXQgY29sb3JzID0gdGhpcy5fdGVtcENvbG9ycztcbiAgICAgICAgbGV0IHNlZ21lbnRzID0gdGhpcy5fdGVtcFNlZ21lbnRzO1xuICAgICAgICBsZXQgYm9uZUluZm9zID0gdGhpcy5fdGVtcEJvbmVJbmZvcztcbiAgICAgICAgbGV0IGdWZXJ0aWNlcyA9IF92ZXJ0aWNlcztcbiAgICAgICAgbGV0IGdJbmRpY2VzID0gX2luZGljZXM7XG4gICAgICAgIGxldCBzbG90VmVydGljZXMsIHNsb3RJbmRpY2VzO1xuICAgICAgICBsZXQgc2xvdHMgPSBhcm1hdHVyZS5fc2xvdHMsIHNsb3QsIHNsb3RNYXRyaXgsIHNsb3RNYXRyaXhtLCBzbG90Q29sb3IsIGNvbG9yVmFsO1xuICAgICAgICBsZXQgdGV4dHVyZTtcbiAgICAgICAgbGV0IHByZVNlZ09mZnNldCwgcHJlU2VnSW5mbztcbiAgICAgICAgbGV0IGJvbmVzID0gYXJtYXR1cmUuX2JvbmVzO1xuXG4gICAgICAgIGlmICh0aGlzLl9lbmFibGVDYWNoZUF0dGFjaGVkSW5mbykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBib25lcy5sZW5ndGg7IGkgPCBsOyBpKyssIF9ib25lSW5mb09mZnNldCsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGJvbmUgPSBib25lc1tpXTtcbiAgICAgICAgICAgICAgICBsZXQgYm9uZUluZm8gPSBib25lSW5mb3NbX2JvbmVJbmZvT2Zmc2V0XTtcbiAgICAgICAgICAgICAgICBpZiAoIWJvbmVJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIGJvbmVJbmZvID0gYm9uZUluZm9zW19ib25lSW5mb09mZnNldF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxUcmFuc2Zvcm1NYXRyaXg6IG5ldyBkcmFnb25Cb25lcy5NYXRyaXgoKSxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IGJvbmVNYXQgPSBib25lLmdsb2JhbFRyYW5zZm9ybU1hdHJpeDtcbiAgICAgICAgICAgICAgICBsZXQgY2FjaGVCb25lTWF0ID0gYm9uZUluZm8uZ2xvYmFsVHJhbnNmb3JtTWF0cml4O1xuICAgICAgICAgICAgICAgIGNhY2hlQm9uZU1hdC5jb3B5RnJvbShib25lTWF0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gc2xvdHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBzbG90ID0gc2xvdHNbaV07XG4gICAgICAgICAgICBpZiAoIXNsb3QuX3Zpc2libGUgfHwgIXNsb3QuX2Rpc3BsYXlEYXRhKSBjb250aW51ZTtcblxuICAgICAgICAgICAgc2xvdC51cGRhdGVXb3JsZE1hdHJpeCgpO1xuICAgICAgICAgICAgc2xvdENvbG9yID0gc2xvdC5fY29sb3I7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChzbG90LmNoaWxkQXJtYXR1cmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90cmF2ZXJzZUFybWF0dXJlKHNsb3QuY2hpbGRBcm1hdHVyZSwgcGFyZW50T3BhY2l0eSAqIHNsb3RDb2xvci5hIC8gMjU1KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGV4dHVyZSA9IHNsb3QuZ2V0VGV4dHVyZSgpO1xuICAgICAgICAgICAgaWYgKCF0ZXh0dXJlKSBjb250aW51ZTtcblxuICAgICAgICAgICAgaWYgKF9wcmVUZXhVcmwgIT09IHRleHR1cmUubmF0aXZlVXJsIHx8IF9wcmVCbGVuZE1vZGUgIT09IHNsb3QuX2JsZW5kTW9kZSkge1xuICAgICAgICAgICAgICAgIF9wcmVUZXhVcmwgPSB0ZXh0dXJlLm5hdGl2ZVVybDtcbiAgICAgICAgICAgICAgICBfcHJlQmxlbmRNb2RlID0gc2xvdC5fYmxlbmRNb2RlO1xuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBwcmUgc2VnbWVudC5cbiAgICAgICAgICAgICAgICBwcmVTZWdPZmZzZXQgPSBfc2VnT2Zmc2V0IC0gMTtcbiAgICAgICAgICAgICAgICBpZiAocHJlU2VnT2Zmc2V0ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9zZWdJQ291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVTZWdJbmZvID0gc2VnbWVudHNbcHJlU2VnT2Zmc2V0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZVNlZ0luZm8uaW5kZXhDb3VudCA9IF9zZWdJQ291bnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVTZWdJbmZvLnZlcnRleENvdW50ID0gX3NlZ1ZDb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZVNlZ0luZm8udmZDb3VudCA9IF9zZWdWQ291bnQgKiA1O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGlzY2FyZCBwcmUgc2VnbWVudC5cbiAgICAgICAgICAgICAgICAgICAgICAgIF9zZWdPZmZzZXQtLTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgbm93IHNlZ21lbnQuXG4gICAgICAgICAgICAgICAgc2VnbWVudHNbX3NlZ09mZnNldF0gPSB7XG4gICAgICAgICAgICAgICAgICAgIHRleCA6IHRleHR1cmUsXG4gICAgICAgICAgICAgICAgICAgIGJsZW5kTW9kZSA6IHNsb3QuX2JsZW5kTW9kZSxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhDb3VudCA6IDAsXG4gICAgICAgICAgICAgICAgICAgIHZlcnRleENvdW50IDogMCxcbiAgICAgICAgICAgICAgICAgICAgdmZDb3VudCA6IDBcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIF9zZWdPZmZzZXQrKztcbiAgICAgICAgICAgICAgICBfc2VnSUNvdW50ID0gMDtcbiAgICAgICAgICAgICAgICBfc2VnVkNvdW50ID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29sb3JWYWwgPSAoKHNsb3RDb2xvci5hICogcGFyZW50T3BhY2l0eSA8PCAyNCkgPj4+IDApICsgKHNsb3RDb2xvci5iIDw8IDE2KSArIChzbG90Q29sb3IuZyA8PCA4KSArIHNsb3RDb2xvci5yO1xuXG4gICAgICAgICAgICBpZiAoX3ByZUNvbG9yICE9PSBjb2xvclZhbCkge1xuICAgICAgICAgICAgICAgIF9wcmVDb2xvciA9IGNvbG9yVmFsO1xuICAgICAgICAgICAgICAgIGlmIChfY29sb3JPZmZzZXQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yc1tfY29sb3JPZmZzZXQgLSAxXS52Zk9mZnNldCA9IF92Zk9mZnNldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29sb3JzW19jb2xvck9mZnNldCsrXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgciA6IHNsb3RDb2xvci5yLFxuICAgICAgICAgICAgICAgICAgICBnIDogc2xvdENvbG9yLmcsXG4gICAgICAgICAgICAgICAgICAgIGIgOiBzbG90Q29sb3IuYixcbiAgICAgICAgICAgICAgICAgICAgYSA6IHNsb3RDb2xvci5hICogcGFyZW50T3BhY2l0eSxcbiAgICAgICAgICAgICAgICAgICAgdmZPZmZzZXQgOiAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzbG90VmVydGljZXMgPSBzbG90Ll9sb2NhbFZlcnRpY2VzO1xuICAgICAgICAgICAgc2xvdEluZGljZXMgPSBzbG90Ll9pbmRpY2VzO1xuXG4gICAgICAgICAgICBzbG90TWF0cml4ID0gc2xvdC5fd29ybGRNYXRyaXg7XG4gICAgICAgICAgICBzbG90TWF0cml4bSA9IHNsb3RNYXRyaXgubTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIHZsID0gc2xvdFZlcnRpY2VzLmxlbmd0aDsgaiA8IHZsOykge1xuICAgICAgICAgICAgICAgIF94ID0gc2xvdFZlcnRpY2VzW2orK107XG4gICAgICAgICAgICAgICAgX3kgPSBzbG90VmVydGljZXNbaisrXTtcbiAgICAgICAgICAgICAgICBnVmVydGljZXNbX3ZmT2Zmc2V0KytdID0gX3ggKiBzbG90TWF0cml4bVswXSArIF95ICogc2xvdE1hdHJpeG1bNF0gKyBzbG90TWF0cml4bVsxMl07XG4gICAgICAgICAgICAgICAgZ1ZlcnRpY2VzW192Zk9mZnNldCsrXSA9IF94ICogc2xvdE1hdHJpeG1bMV0gKyBfeSAqIHNsb3RNYXRyaXhtWzVdICsgc2xvdE1hdHJpeG1bMTNdO1xuICAgICAgICAgICAgICAgIGdWZXJ0aWNlc1tfdmZPZmZzZXQrK10gPSBzbG90VmVydGljZXNbaisrXTtcbiAgICAgICAgICAgICAgICBnVmVydGljZXNbX3ZmT2Zmc2V0KytdID0gc2xvdFZlcnRpY2VzW2orK107XG4gICAgICAgICAgICAgICAgZ1ZlcnRpY2VzW192Zk9mZnNldCsrXSA9IGNvbG9yVmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBUaGlzIHBsYWNlIG11c3QgdXNlIHNlZ21lbnQgdmVydGV4IGNvdW50IHRvIGNhbGN1bGF0ZSB2ZXJ0ZXggb2Zmc2V0LlxuICAgICAgICAgICAgLy8gQXNzZW1ibGVyIHdpbGwgY2FsY3VsYXRlIHZlcnRleCBvZmZzZXQgYWdhaW4gZm9yIGRpZmZlcmVudCBzZWdtZW50LlxuICAgICAgICAgICAgZm9yIChsZXQgaWkgPSAwLCBpbCA9IHNsb3RJbmRpY2VzLmxlbmd0aDsgaWkgPCBpbDsgaWkgKyspIHtcbiAgICAgICAgICAgICAgICBnSW5kaWNlc1tfaW5kZXhPZmZzZXQrK10gPSBfc2VnVkNvdW50ICsgc2xvdEluZGljZXNbaWldO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfdmVydGV4T2Zmc2V0ID0gX3ZmT2Zmc2V0IC8gNTtcbiAgICAgICAgICAgIF9zZWdJQ291bnQgKz0gc2xvdEluZGljZXMubGVuZ3RoO1xuICAgICAgICAgICAgX3NlZ1ZDb3VudCArPSBzbG90VmVydGljZXMubGVuZ3RoIC8gNDtcbiAgICAgICAgfVxuICAgIH0sXG59KTtcblxubGV0IEFybWF0dXJlQ2FjaGUgPSBjYy5DbGFzcyh7XG4gICAgY3RvciAoKSB7XG4gICAgICAgIHRoaXMuX3ByaXZhdGVNb2RlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2FuaW1hdGlvblBvb2wgPSB7fTtcbiAgICAgICAgdGhpcy5fYXJtYXR1cmVDYWNoZSA9IHt9O1xuICAgIH0sXG5cbiAgICBlbmFibGVQcml2YXRlTW9kZSAoKSB7XG4gICAgICAgIHRoaXMuX3ByaXZhdGVNb2RlID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLy8gSWYgY2FjaGUgaXMgcHJpdmF0ZSwgY2FjaGUgd2lsbCBiZSBkZXN0cm95IHdoZW4gZHJhZ29uYm9uZXMgbm9kZSBkZXN0cm95LlxuICAgIGRpc3Bvc2UgKCkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5fYXJtYXR1cmVDYWNoZSkge1xuICAgICAgICAgICAgdmFyIGFybWF0dXJlSW5mbyA9IHRoaXMuX2FybWF0dXJlQ2FjaGVba2V5XTtcbiAgICAgICAgICAgIGlmIChhcm1hdHVyZUluZm8pIHtcbiAgICAgICAgICAgICAgICBsZXQgYXJtYXR1cmUgPSBhcm1hdHVyZUluZm8uYXJtYXR1cmU7XG4gICAgICAgICAgICAgICAgYXJtYXR1cmUgJiYgYXJtYXR1cmUuZGlzcG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2FybWF0dXJlQ2FjaGUgPSBudWxsO1xuICAgICAgICB0aGlzLl9hbmltYXRpb25Qb29sID0gbnVsbDtcbiAgICB9LFxuXG4gICAgX3JlbW92ZUFybWF0dXJlIChhcm1hdHVyZUtleSkge1xuICAgICAgICB2YXIgYXJtYXR1cmVJbmZvID0gdGhpcy5fYXJtYXR1cmVDYWNoZVthcm1hdHVyZUtleV07XG4gICAgICAgIGxldCBhbmltYXRpb25zQ2FjaGUgPSBhcm1hdHVyZUluZm8uYW5pbWF0aW9uc0NhY2hlO1xuICAgICAgICBmb3IgKHZhciBhbmlLZXkgaW4gYW5pbWF0aW9uc0NhY2hlKSB7XG4gICAgICAgICAgICAvLyBDbGVhciBjYWNoZSB0ZXh0dXJlLCBhbmQgcHV0IGNhY2hlIGludG8gcG9vbC5cbiAgICAgICAgICAgIC8vIE5vIG5lZWQgdG8gY3JlYXRlIFR5cGVkQXJyYXkgbmV4dCB0aW1lLlxuICAgICAgICAgICAgbGV0IGFuaW1hdGlvbkNhY2hlID0gYW5pbWF0aW9uc0NhY2hlW2FuaUtleV07XG4gICAgICAgICAgICBpZiAoIWFuaW1hdGlvbkNhY2hlKSBjb250aW51ZTtcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hdGlvblBvb2xbYXJtYXR1cmVLZXkgKyBcIiNcIiArIGFuaUtleV0gPSBhbmltYXRpb25DYWNoZTtcbiAgICAgICAgICAgIGFuaW1hdGlvbkNhY2hlLmNsZWFyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYXJtYXR1cmUgPSBhcm1hdHVyZUluZm8uYXJtYXR1cmU7XG4gICAgICAgIGFybWF0dXJlICYmIGFybWF0dXJlLmRpc3Bvc2UoKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2FybWF0dXJlQ2FjaGVbYXJtYXR1cmVLZXldO1xuICAgIH0sXG5cbiAgICAvLyBXaGVuIGRiIGFzc2V0cyBiZSBkZXN0cm95LCByZW1vdmUgYXJtYXR1cmUgZnJvbSBkYiBjYWNoZS5cbiAgICByZXNldEFybWF0dXJlICh1dWlkKSB7XG4gICAgICAgIGZvciAodmFyIGFybWF0dXJlS2V5IGluIHRoaXMuX2FybWF0dXJlQ2FjaGUpIHtcbiAgICAgICAgICAgIGlmIChhcm1hdHVyZUtleS5pbmRleE9mKHV1aWQpID09IC0xKSBjb250aW51ZTtcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZUFybWF0dXJlKGFybWF0dXJlS2V5KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBnZXRBcm1hdHVyZUNhY2hlIChhcm1hdHVyZU5hbWUsIGFybWF0dXJlS2V5LCBhdGxhc1VVSUQpIHtcbiAgICAgICAgbGV0IGFybWF0dXJlSW5mbyA9IHRoaXMuX2FybWF0dXJlQ2FjaGVbYXJtYXR1cmVLZXldO1xuICAgICAgICBsZXQgYXJtYXR1cmU7XG4gICAgICAgIGlmICghYXJtYXR1cmVJbmZvKSB7XG4gICAgICAgICAgICBsZXQgZmFjdG9yeSA9IGRyYWdvbkJvbmVzLkNDRmFjdG9yeS5nZXRJbnN0YW5jZSgpO1xuICAgICAgICAgICAgbGV0IHByb3h5ID0gZmFjdG9yeS5idWlsZEFybWF0dXJlRGlzcGxheShhcm1hdHVyZU5hbWUsIGFybWF0dXJlS2V5LCBcIlwiLCBhdGxhc1VVSUQpO1xuICAgICAgICAgICAgaWYgKCFwcm94eSB8fCAhcHJveHkuX2FybWF0dXJlKSByZXR1cm47XG4gICAgICAgICAgICBhcm1hdHVyZSA9IHByb3h5Ll9hcm1hdHVyZTtcbiAgICAgICAgICAgIC8vIElmIGFybWF0dXJlIGhhcyBjaGlsZCBhcm1hdHVyZSwgY2FuIG5vdCBiZSBjYWNoZSwgYmVjYXVzZSBpdCdzXG4gICAgICAgICAgICAvLyBhbmltYXRpb24gZGF0YSBjYW4gbm90IGJlIHByZWNvbXB1dGUuXG4gICAgICAgICAgICBpZiAoIUFybWF0dXJlQ2FjaGUuY2FuQ2FjaGUoYXJtYXR1cmUpKSB7XG4gICAgICAgICAgICAgICAgYXJtYXR1cmUuZGlzcG9zZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fYXJtYXR1cmVDYWNoZVthcm1hdHVyZUtleV0gPSB7XG4gICAgICAgICAgICAgICAgYXJtYXR1cmUgOiBhcm1hdHVyZSxcbiAgICAgICAgICAgICAgICAvLyBDYWNoZSBhbGwga2luZHMgb2YgYW5pbWF0aW9uIGZyYW1lLlxuICAgICAgICAgICAgICAgIC8vIFdoZW4gYXJtYXR1cmUgaXMgZGlzcG9zZSwgY2xlYXIgYWxsIGFuaW1hdGlvbiBjYWNoZS5cbiAgICAgICAgICAgICAgICBhbmltYXRpb25zQ2FjaGUgOiB7fSxcbiAgICAgICAgICAgICAgICBjdXJBbmltYXRpb25DYWNoZTogbnVsbCxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcm1hdHVyZSA9IGFybWF0dXJlSW5mby5hcm1hdHVyZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJtYXR1cmU7XG4gICAgfSxcblxuICAgIGdldEFuaW1hdGlvbkNhY2hlIChhcm1hdHVyZUtleSwgYW5pbWF0aW9uTmFtZSkge1xuICAgICAgICBsZXQgYXJtYXR1cmVJbmZvID0gdGhpcy5fYXJtYXR1cmVDYWNoZVthcm1hdHVyZUtleV07XG4gICAgICAgIGlmICghYXJtYXR1cmVJbmZvKSByZXR1cm4gbnVsbDtcblxuICAgICAgICBsZXQgYW5pbWF0aW9uc0NhY2hlID0gYXJtYXR1cmVJbmZvLmFuaW1hdGlvbnNDYWNoZTtcbiAgICAgICAgcmV0dXJuIGFuaW1hdGlvbnNDYWNoZVthbmltYXRpb25OYW1lXTtcbiAgICB9LFxuXG4gICAgaW5pdEFuaW1hdGlvbkNhY2hlIChhcm1hdHVyZUtleSwgYW5pbWF0aW9uTmFtZSkge1xuICAgICAgICBpZiAoIWFuaW1hdGlvbk5hbWUpIHJldHVybiBudWxsO1xuXG4gICAgICAgIGxldCBhcm1hdHVyZUluZm8gPSB0aGlzLl9hcm1hdHVyZUNhY2hlW2FybWF0dXJlS2V5XTtcbiAgICAgICAgbGV0IGFybWF0dXJlID0gYXJtYXR1cmVJbmZvICYmIGFybWF0dXJlSW5mby5hcm1hdHVyZTtcbiAgICAgICAgaWYgKCFhcm1hdHVyZSkgcmV0dXJuIG51bGw7XG4gICAgICAgIGxldCBhbmltYXRpb24gPSBhcm1hdHVyZS5hbmltYXRpb247XG4gICAgICAgIGxldCBoYXNBbmkgPSBhbmltYXRpb24uaGFzQW5pbWF0aW9uKGFuaW1hdGlvbk5hbWUpO1xuICAgICAgICBpZiAoIWhhc0FuaSkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgbGV0IGFuaW1hdGlvbnNDYWNoZSA9IGFybWF0dXJlSW5mby5hbmltYXRpb25zQ2FjaGU7XG4gICAgICAgIGxldCBhbmltYXRpb25DYWNoZSA9IGFuaW1hdGlvbnNDYWNoZVthbmltYXRpb25OYW1lXTtcbiAgICAgICAgaWYgKCFhbmltYXRpb25DYWNoZSkge1xuICAgICAgICAgICAgLy8gSWYgY2FjaGUgZXhpc3QgaW4gcG9vbCwgdGhlbiBqdXN0IHVzZSBpdC5cbiAgICAgICAgICAgIGxldCBwb29sS2V5ID0gYXJtYXR1cmVLZXkgKyBcIiNcIiArIGFuaW1hdGlvbk5hbWU7XG4gICAgICAgICAgICBhbmltYXRpb25DYWNoZSA9IHRoaXMuX2FuaW1hdGlvblBvb2xbcG9vbEtleV07XG4gICAgICAgICAgICBpZiAoYW5pbWF0aW9uQ2FjaGUpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fYW5pbWF0aW9uUG9vbFtwb29sS2V5XTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uQ2FjaGUgPSBuZXcgQW5pbWF0aW9uQ2FjaGUoKTtcbiAgICAgICAgICAgICAgICBhbmltYXRpb25DYWNoZS5fcHJpdmF0ZU1vZGUgPSB0aGlzLl9wcml2YXRlTW9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFuaW1hdGlvbkNhY2hlLmluaXQoYXJtYXR1cmVJbmZvLCBhbmltYXRpb25OYW1lKTtcbiAgICAgICAgICAgIGFuaW1hdGlvbnNDYWNoZVthbmltYXRpb25OYW1lXSA9IGFuaW1hdGlvbkNhY2hlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbmltYXRpb25DYWNoZTtcbiAgICB9LFxuXG4gICAgaW52YWxpZEFuaW1hdGlvbkNhY2hlIChhcm1hdHVyZUtleSkge1xuICAgICAgICBsZXQgYXJtYXR1cmVJbmZvID0gdGhpcy5fYXJtYXR1cmVDYWNoZVthcm1hdHVyZUtleV07XG4gICAgICAgIGxldCBhcm1hdHVyZSA9IGFybWF0dXJlSW5mbyAmJiBhcm1hdHVyZUluZm8uYXJtYXR1cmU7XG4gICAgICAgIGlmICghYXJtYXR1cmUpIHJldHVybiBudWxsO1xuXG4gICAgICAgIGxldCBhbmltYXRpb25zQ2FjaGUgPSBhcm1hdHVyZUluZm8uYW5pbWF0aW9uc0NhY2hlO1xuICAgICAgICBmb3IgKHZhciBhbmlLZXkgaW4gYW5pbWF0aW9uc0NhY2hlKSB7XG4gICAgICAgICAgICBsZXQgYW5pbWF0aW9uQ2FjaGUgPSBhbmltYXRpb25zQ2FjaGVbYW5pS2V5XTtcbiAgICAgICAgICAgIGFuaW1hdGlvbkNhY2hlLmludmFsaWRBbGxGcmFtZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZUFuaW1hdGlvbkNhY2hlIChhcm1hdHVyZUtleSwgYW5pbWF0aW9uTmFtZSkge1xuICAgICAgICBpZiAoYW5pbWF0aW9uTmFtZSkge1xuICAgICAgICAgICAgbGV0IGFuaW1hdGlvbkNhY2hlID0gdGhpcy5pbml0QW5pbWF0aW9uQ2FjaGUoYXJtYXR1cmVLZXksIGFuaW1hdGlvbk5hbWUpO1xuICAgICAgICAgICAgaWYgKCFhbmltYXRpb25DYWNoZSkgcmV0dXJuO1xuICAgICAgICAgICAgYW5pbWF0aW9uQ2FjaGUudXBkYXRlQWxsRnJhbWUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBhcm1hdHVyZUluZm8gPSB0aGlzLl9hcm1hdHVyZUNhY2hlW2FybWF0dXJlS2V5XTtcbiAgICAgICAgICAgIGxldCBhcm1hdHVyZSA9IGFybWF0dXJlSW5mbyAmJiBhcm1hdHVyZUluZm8uYXJtYXR1cmU7XG4gICAgICAgICAgICBpZiAoIWFybWF0dXJlKSByZXR1cm4gbnVsbDtcblxuICAgICAgICAgICAgbGV0IGFuaW1hdGlvbnNDYWNoZSA9IGFybWF0dXJlSW5mby5hbmltYXRpb25zQ2FjaGU7XG4gICAgICAgICAgICBmb3IgKHZhciBhbmlLZXkgaW4gYW5pbWF0aW9uc0NhY2hlKSB7XG4gICAgICAgICAgICAgICAgbGV0IGFuaW1hdGlvbkNhY2hlID0gYW5pbWF0aW9uc0NhY2hlW2FuaUtleV07XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uQ2FjaGUudXBkYXRlQWxsRnJhbWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG59KTtcblxuQXJtYXR1cmVDYWNoZS5GcmFtZVRpbWUgPSBGcmFtZVRpbWU7XG5Bcm1hdHVyZUNhY2hlLnNoYXJlZENhY2hlID0gbmV3IEFybWF0dXJlQ2FjaGUoKTtcbkFybWF0dXJlQ2FjaGUuY2FuQ2FjaGUgPSBmdW5jdGlvbiAoYXJtYXR1cmUpIHtcbiAgICBsZXQgc2xvdHMgPSBhcm1hdHVyZS5fc2xvdHM7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBzbG90cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgbGV0IHNsb3QgPSBzbG90c1tpXTtcbiAgICAgICAgaWYgKHNsb3QuY2hpbGRBcm1hdHVyZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufSxcblxubW9kdWxlLmV4cG9ydHMgPSBBcm1hdHVyZUNhY2hlOyJdLCJzb3VyY2VSb290IjoiLyJ9