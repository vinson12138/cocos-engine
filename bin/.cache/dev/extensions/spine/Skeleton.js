
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/spine/Skeleton.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

var RenderComponent = require('../../cocos2d/core/components/CCRenderComponent');

var spine = require('./lib/spine');

var Graphics = require('../../cocos2d/core/graphics/graphics');

var RenderFlow = require('../../cocos2d/core/renderer/render-flow');

var FLAG_POST_RENDER = RenderFlow.FLAG_POST_RENDER;

var SkeletonCache = require('./skeleton-cache');

var AttachUtil = require('./AttachUtil');
/**
 * @module sp
 */


var DefaultSkinsEnum = cc.Enum({
  'default': -1
});
var DefaultAnimsEnum = cc.Enum({
  '<None>': 0
});
/**
 * !#en Enum for animation cache mode type.
 * !#zh Spine动画缓存类型
 * @enum Skeleton.AnimationCacheMode
 */

var AnimationCacheMode = cc.Enum({
  /**
   * !#en The realtime mode.
   * !#zh 实时计算模式。
   * @property {Number} REALTIME
   */
  REALTIME: 0,

  /**
   * !#en The shared cache mode.
   * !#zh 共享缓存模式。
   * @property {Number} SHARED_CACHE
   */
  SHARED_CACHE: 1,

  /**
   * !#en The private cache mode.
   * !#zh 私有缓存模式。
   * @property {Number} PRIVATE_CACHE
   */
  PRIVATE_CACHE: 2
});

function setEnumAttr(obj, propName, enumDef) {
  cc.Class.Attr.setClassAttr(obj, propName, 'type', 'Enum');
  cc.Class.Attr.setClassAttr(obj, propName, 'enumList', cc.Enum.getList(enumDef));
}
/**
 * !#en
 * The skeleton of Spine <br/>
 * <br/>
 * (Skeleton has a reference to a SkeletonData and stores the state for skeleton instance,
 * which consists of the current pose's bone SRT, slot colors, and which slot attachments are visible. <br/>
 * Multiple skeletons can use the same SkeletonData which includes all animations, skins, and attachments.) <br/>
 * !#zh
 * Spine 骨骼动画 <br/>
 * <br/>
 * (Skeleton 具有对骨骼数据的引用并且存储了骨骼实例的状态，
 * 它由当前的骨骼动作，slot 颜色，和可见的 slot attachments 组成。<br/>
 * 多个 Skeleton 可以使用相同的骨骼数据，其中包括所有的动画，皮肤和 attachments。
 *
 * @class Skeleton
 * @extends RenderComponent
 */


sp.Skeleton = cc.Class({
  name: 'sp.Skeleton',
  "extends": RenderComponent,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.renderers/Spine Skeleton',
    help: 'app://docs/html/components/spine.html',
    inspector: 'packages://inspector/inspectors/comps/skeleton2d.js'
  },
  statics: {
    AnimationCacheMode: AnimationCacheMode
  },
  properties: {
    /**
     * !#en The skeletal animation is paused?
     * !#zh 该骨骼动画是否暂停。
     * @property paused
     * @type {Boolean}
     * @readOnly
     * @default false
     */
    paused: {
      "default": false,
      visible: false
    },

    /**
     * !#en
     * The skeleton data contains the skeleton information (bind pose bones, slots, draw order,
     * attachments, skins, etc) and animations but does not hold any state.<br/>
     * Multiple skeletons can share the same skeleton data.
     * !#zh
     * 骨骼数据包含了骨骼信息（绑定骨骼动作，slots，渲染顺序，
     * attachments，皮肤等等）和动画但不持有任何状态。<br/>
     * 多个 Skeleton 可以共用相同的骨骼数据。
     * @property {sp.SkeletonData} skeletonData
     */
    skeletonData: {
      "default": null,
      type: sp.SkeletonData,
      notify: function notify() {
        this.defaultSkin = '';
        this.defaultAnimation = '';

        if (CC_EDITOR) {
          this._refreshInspector();
        }

        this._updateSkeletonData();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.skeleton_data'
    },
    // 由于 spine 的 skin 是无法二次替换的，所以只能设置默认的 skin

    /**
     * !#en The name of default skin.
     * !#zh 默认的皮肤名称。
     * @property {String} defaultSkin
     */
    defaultSkin: {
      "default": '',
      visible: false
    },

    /**
     * !#en The name of default animation.
     * !#zh 默认的动画名称。
     * @property {String} defaultAnimation
     */
    defaultAnimation: {
      "default": '',
      visible: false
    },

    /**
     * !#en The name of current playing animation.
     * !#zh 当前播放的动画名称。
     * @property {String} animation
     */
    animation: {
      get: function get() {
        if (this.isAnimationCached()) {
          return this._animationName;
        } else {
          var entry = this.getCurrent(0);
          return entry && entry.animation.name || "";
        }
      },
      set: function set(value) {
        this.defaultAnimation = value;

        if (value) {
          this.setAnimation(0, value, this.loop);
        } else if (!this.isAnimationCached()) {
          this.clearTrack(0);
          this.setToSetupPose();
        }
      },
      visible: false
    },

    /**
     * @property {Number} _defaultSkinIndex
     */
    _defaultSkinIndex: {
      get: function get() {
        if (this.skeletonData) {
          var skinsEnum = this.skeletonData.getSkinsEnum();

          if (skinsEnum) {
            if (this.defaultSkin === "") {
              if (skinsEnum.hasOwnProperty(0)) {
                this._defaultSkinIndex = 0;
                return 0;
              }
            } else {
              var skinIndex = skinsEnum[this.defaultSkin];

              if (skinIndex !== undefined) {
                return skinIndex;
              }
            }
          }
        }

        return 0;
      },
      set: function set(value) {
        var skinsEnum;

        if (this.skeletonData) {
          skinsEnum = this.skeletonData.getSkinsEnum();
        }

        if (!skinsEnum) {
          return cc.errorID('', this.name);
        }

        var skinName = skinsEnum[value];

        if (skinName !== undefined) {
          this.defaultSkin = skinName;
          this.setSkin(this.defaultSkin);

          if (CC_EDITOR && !cc.engine.isPlaying) {
            this._refreshInspector();
          }
        } else {
          cc.errorID(7501, this.name);
        }
      },
      type: DefaultSkinsEnum,
      visible: true,
      animatable: false,
      displayName: "Default Skin",
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.default_skin'
    },
    // value of 0 represents no animation
    _animationIndex: {
      get: function get() {
        var animationName = !CC_EDITOR || cc.engine.isPlaying ? this.animation : this.defaultAnimation;

        if (this.skeletonData && animationName) {
          var animsEnum = this.skeletonData.getAnimsEnum();

          if (animsEnum) {
            var animIndex = animsEnum[animationName];

            if (animIndex !== undefined) {
              return animIndex;
            }
          }
        }

        return 0;
      },
      set: function set(value) {
        if (value === 0) {
          this.animation = '';
          return;
        }

        var animsEnum;

        if (this.skeletonData) {
          animsEnum = this.skeletonData.getAnimsEnum();
        }

        if (!animsEnum) {
          return cc.errorID(7502, this.name);
        }

        var animName = animsEnum[value];

        if (animName !== undefined) {
          this.animation = animName;
        } else {
          cc.errorID(7503, this.name);
        }
      },
      type: DefaultAnimsEnum,
      visible: true,
      animatable: false,
      displayName: 'Animation',
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.animation'
    },
    // Record pre cache mode.
    _preCacheMode: -1,
    _cacheMode: AnimationCacheMode.REALTIME,
    _defaultCacheMode: {
      "default": 0,
      type: AnimationCacheMode,
      notify: function notify() {
        this.setAnimationCacheMode(this._defaultCacheMode);
      },
      editorOnly: true,
      visible: true,
      animatable: false,
      displayName: "Animation Cache Mode",
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.animation_cache_mode'
    },

    /**
     * !#en TODO
     * !#zh 是否循环播放当前骨骼动画。
     * @property {Boolean} loop
     * @default true
     */
    loop: {
      "default": true,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.loop'
    },

    /**
     * !#en Indicates whether to enable premultiplied alpha.
     * You should disable this option when image's transparent area appears to have opaque pixels,
     * or enable this option when image's half transparent area appears to be darken.
     * !#zh 是否启用贴图预乘。
     * 当图片的透明区域出现色块时需要关闭该选项，当图片的半透明区域颜色变黑时需要启用该选项。
     * @property {Boolean} premultipliedAlpha
     * @default true
     */
    premultipliedAlpha: {
      "default": true,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.premultipliedAlpha'
    },

    /**
     * !#en The time scale of this skeleton.
     * !#zh 当前骨骼中所有动画的时间缩放率。
     * @property {Number} timeScale
     * @default 1
     */
    timeScale: {
      "default": 1,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.time_scale'
    },

    /**
     * !#en Indicates whether open debug slots.
     * !#zh 是否显示 slot 的 debug 信息。
     * @property {Boolean} debugSlots
     * @default false
     */
    debugSlots: {
      "default": false,
      editorOnly: true,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.debug_slots',
      notify: function notify() {
        this._updateDebugDraw();
      }
    },

    /**
     * !#en Indicates whether open debug bones.
     * !#zh 是否显示 bone 的 debug 信息。
     * @property {Boolean} debugBones
     * @default false
     */
    debugBones: {
      "default": false,
      editorOnly: true,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.debug_bones',
      notify: function notify() {
        this._updateDebugDraw();
      }
    },

    /**
     * !#en Indicates whether open debug mesh.
     * !#zh 是否显示 mesh 的 debug 信息。
     * @property {Boolean} debugMesh
     * @default false
     */
    debugMesh: {
      "default": false,
      editorOnly: true,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.debug_mesh',
      notify: function notify() {
        this._updateDebugDraw();
      }
    },

    /**
     * !#en Enabled two color tint.
     * !#zh 是否启用染色效果。
     * @property {Boolean} useTint
     * @default false
     */
    useTint: {
      "default": false,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.use_tint',
      notify: function notify() {
        this._updateUseTint();
      }
    },

    /**
     * !#en Enabled batch model, if skeleton is complex, do not enable batch, or will lower performance.
     * !#zh 开启合批，如果渲染大量相同纹理，且结构简单的骨骼动画，开启合批可以降低drawcall，否则请不要开启，cpu消耗会上升。
     * @property {Boolean} enableBatch
     * @default false
     */
    enableBatch: {
      "default": false,
      notify: function notify() {
        this._updateBatch();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.enabled_batch'
    },
    // Below properties will effect when cache mode is SHARED_CACHE or PRIVATE_CACHE.
    // accumulate time
    _accTime: 0,
    // Play times counter
    _playCount: 0,
    // Frame cache
    _frameCache: null,
    // Cur frame
    _curFrame: null,
    // Skeleton cache
    _skeletonCache: null,
    // Aimation name
    _animationName: "",
    // Animation queue
    _animationQueue: [],
    // Head animation info of 
    _headAniInfo: null,
    // Play times
    _playTimes: 0,
    // Is animation complete.
    _isAniComplete: true
  },
  // CONSTRUCTOR
  ctor: function ctor() {
    this._effectDelegate = null;
    this._skeleton = null;
    this._rootBone = null;
    this._listener = null;
    this._materialCache = {};
    this._debugRenderer = null;
    this._startSlotIndex = -1;
    this._endSlotIndex = -1;
    this._startEntry = {
      animation: {
        name: ""
      },
      trackIndex: 0
    };
    this._endEntry = {
      animation: {
        name: ""
      },
      trackIndex: 0
    };
    this.attachUtil = new AttachUtil();
  },
  // override base class _getDefaultMaterial to modify default material
  _getDefaultMaterial: function _getDefaultMaterial() {
    return cc.Material.getBuiltinMaterial('2d-spine');
  },
  // override base class _updateMaterial to set define value and clear material cache
  _updateMaterial: function _updateMaterial() {
    var useTint = this.useTint || this.isAnimationCached() && !CC_NATIVERENDERER;
    var baseMaterial = this.getMaterial(0);

    if (baseMaterial) {
      baseMaterial.define('USE_TINT', useTint);
      baseMaterial.define('CC_USE_MODEL', !this.enableBatch);
      var srcBlendFactor = this.premultipliedAlpha ? cc.gfx.BLEND_ONE : cc.gfx.BLEND_SRC_ALPHA;
      var dstBlendFactor = cc.gfx.BLEND_ONE_MINUS_SRC_ALPHA;
      baseMaterial.setBlend(true, cc.gfx.BLEND_FUNC_ADD, srcBlendFactor, srcBlendFactor, cc.gfx.BLEND_FUNC_ADD, dstBlendFactor, dstBlendFactor);
    }

    this._materialCache = {};
  },
  // override base class disableRender to clear post render flag
  disableRender: function disableRender() {
    this._super();

    this.node._renderFlag &= ~FLAG_POST_RENDER;
  },
  // override base class disableRender to add post render flag
  markForRender: function markForRender(enable) {
    this._super(enable);

    if (enable) {
      this.node._renderFlag |= FLAG_POST_RENDER;
    } else {
      this.node._renderFlag &= ~FLAG_POST_RENDER;
    }
  },
  // if change use tint mode, just clear material cache
  _updateUseTint: function _updateUseTint() {
    var baseMaterial = this.getMaterial(0);

    if (baseMaterial) {
      var useTint = this.useTint || this.isAnimationCached() && !CC_NATIVERENDERER;
      baseMaterial.define('USE_TINT', useTint);
    }

    this._materialCache = {};
  },
  // if change use batch mode, just clear material cache
  _updateBatch: function _updateBatch() {
    var baseMaterial = this.getMaterial(0);

    if (baseMaterial) {
      baseMaterial.define('CC_USE_MODEL', !this.enableBatch);
    }

    this._materialCache = {};
  },
  _validateRender: function _validateRender() {
    var skeletonData = this.skeletonData;

    if (!skeletonData || !skeletonData.isTexturesLoaded()) {
      this.disableRender();
      return;
    }

    this._super();
  },

  /**
   * !#en
   * Sets runtime skeleton data to sp.Skeleton.<br>
   * This method is different from the `skeletonData` property. This method is passed in the raw data provided by the Spine runtime, and the skeletonData type is the asset type provided by Creator.
   * !#zh
   * 设置底层运行时用到的 SkeletonData。<br>
   * 这个接口有别于 `skeletonData` 属性，这个接口传入的是 Spine runtime 提供的原始数据，而 skeletonData 的类型是 Creator 提供的资源类型。
   * @method setSkeletonData
   * @param {sp.spine.SkeletonData} skeletonData
   */
  setSkeletonData: function setSkeletonData(skeletonData) {
    if (skeletonData.width != null && skeletonData.height != null) {
      this.node.setContentSize(skeletonData.width, skeletonData.height);
    }

    if (!CC_EDITOR) {
      if (this._cacheMode === AnimationCacheMode.SHARED_CACHE) {
        this._skeletonCache = SkeletonCache.sharedCache;
      } else if (this._cacheMode === AnimationCacheMode.PRIVATE_CACHE) {
        this._skeletonCache = new SkeletonCache();

        this._skeletonCache.enablePrivateMode();
      }
    }

    if (this.isAnimationCached()) {
      if (this.debugBones || this.debugSlots) {
        cc.warn("Debug bones or slots is invalid in cached mode");
      } //wangcheng


      var cacheKey = this.getCacheKey();

      var skeletonInfo = this._skeletonCache.getSkeletonCache(cacheKey, skeletonData); // let skeletonInfo = this._skeletonCache.getSkeletonCache(skeletonData._uuid, skeletonData);


      this._skeleton = skeletonInfo.skeleton;
      this._clipper = skeletonInfo.clipper;
      this._rootBone = this._skeleton.getRootBone();
    } else {
      this._skeleton = new spine.Skeleton(skeletonData);
      this._clipper = new spine.SkeletonClipping();
      this._rootBone = this._skeleton.getRootBone();
    }

    this.markForRender(true);
  },
  //wangcheng
  getCacheKey: function getCacheKey() {
    if (this._cacheMode === AnimationCacheMode.SHARED_CACHE) {
      var skin;
      if (this._skeleton && this._skeleton.skin) skin = this._skeleton.skin.name;else skin = this.defaultSkin;
      return this.skeletonData._uuid + "_" + skin;
    } else if (this._cacheMode === AnimationCacheMode.PRIVATE_CACHE) {
      return this.skeletonData._uuid;
    }
  },

  /**
   * !#en Sets slots visible range.
   * !#zh 设置骨骼插槽可视范围。
   * @method setSlotsRange
   * @param {Number} startSlotIndex
   * @param {Number} endSlotIndex
   */
  setSlotsRange: function setSlotsRange(startSlotIndex, endSlotIndex) {
    if (this.isAnimationCached()) {
      cc.warn("Slots visible range can not be modified in cached mode.");
    } else {
      this._startSlotIndex = startSlotIndex;
      this._endSlotIndex = endSlotIndex;
    }
  },

  /**
   * !#en Sets animation state data.<br>
   * The parameter type is {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.AnimationStateData.
   * !#zh 设置动画状态数据。<br>
   * 参数是 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.AnimationStateData。
   * @method setAnimationStateData
   * @param {sp.spine.AnimationStateData} stateData
   */
  setAnimationStateData: function setAnimationStateData(stateData) {
    if (this.isAnimationCached()) {
      cc.warn("'setAnimationStateData' interface can not be invoked in cached mode.");
    } else {
      var state = new spine.AnimationState(stateData);

      if (this._listener) {
        if (this._state) {
          this._state.removeListener(this._listener);
        }

        state.addListener(this._listener);
      }

      this._state = state;
    }
  },
  // IMPLEMENT
  __preload: function __preload() {
    this._super();

    if (CC_EDITOR) {
      var Flags = cc.Object.Flags;
      this._objFlags |= Flags.IsAnchorLocked | Flags.IsSizeLocked;

      this._refreshInspector();
    }

    var children = this.node.children;

    for (var i = 0, n = children.length; i < n; i++) {
      var child = children[i];

      if (child && child._name === "DEBUG_DRAW_NODE") {
        child.destroy();
      }
    }

    this._updateSkeletonData();

    this._updateDebugDraw();

    this._updateUseTint();

    this._updateBatch();
  },

  /**
   * !#en
   * It's best to set cache mode before set property 'dragonAsset', or will waste some cpu time.
   * If set the mode in editor, then no need to worry about order problem.
   * !#zh 
   * 若想切换渲染模式，最好在设置'dragonAsset'之前，先设置好渲染模式，否则有运行时开销。
   * 若在编辑中设置渲染模式，则无需担心设置次序的问题。
   * 
   * @method setAnimationCacheMode
   * @param {AnimationCacheMode} cacheMode
   * @example
   * skeleton.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.SHARED_CACHE);
   */
  setAnimationCacheMode: function setAnimationCacheMode(cacheMode) {
    if (this._preCacheMode !== cacheMode) {
      this._cacheMode = cacheMode;

      this._updateSkeletonData();

      this._updateUseTint();
    }
  },

  /**
   * !#en Whether in cached mode.
   * !#zh 当前是否处于缓存模式。
   * @method isAnimationCached
   * @return {Boolean}
   */
  isAnimationCached: function isAnimationCached() {
    if (CC_EDITOR) return false;
    return this._cacheMode !== AnimationCacheMode.REALTIME;
  },
  update: function update(dt) {
    if (CC_EDITOR) return;
    if (this.paused) return;
    dt *= this.timeScale * sp.timeScale;

    if (this.isAnimationCached()) {
      // Cache mode and has animation queue.
      if (this._isAniComplete) {
        if (this._animationQueue.length === 0 && !this._headAniInfo) {
          var frameCache = this._frameCache;

          if (frameCache && frameCache.isInvalid()) {
            frameCache.updateToFrame();
            var frames = frameCache.frames;
            this._curFrame = frames[frames.length - 1];
          }

          return;
        }

        if (!this._headAniInfo) {
          this._headAniInfo = this._animationQueue.shift();
        }

        this._accTime += dt;

        if (this._accTime > this._headAniInfo.delay) {
          var aniInfo = this._headAniInfo;
          this._headAniInfo = null;
          this.setAnimation(0, aniInfo.animationName, aniInfo.loop);
        }

        return;
      }

      this._updateCache(dt);
    } else {
      this._updateRealtime(dt);
    }
  },
  _emitCacheCompleteEvent: function _emitCacheCompleteEvent() {
    if (!this._listener) return;
    this._endEntry.animation.name = this._animationName;
    this._listener.complete && this._listener.complete(this._endEntry);
    this._listener.end && this._listener.end(this._endEntry);
  },
  _updateCache: function _updateCache(dt) {
    var frameCache = this._frameCache;

    if (!frameCache.isInited()) {
      return;
    }

    var frames = frameCache.frames;
    var frameTime = SkeletonCache.FrameTime; // Animation Start, the event diffrent from dragonbones inner event,
    // It has no event object.

    if (this._accTime == 0 && this._playCount == 0) {
      this._startEntry.animation.name = this._animationName;
      this._listener && this._listener.start && this._listener.start(this._startEntry);
    }

    this._accTime += dt;
    var frameIdx = Math.floor(this._accTime / frameTime);

    if (!frameCache.isCompleted) {
      frameCache.updateToFrame(frameIdx);
    }

    if (frameCache.isCompleted && frameIdx >= frames.length) {
      this._playCount++;

      if (this._playTimes > 0 && this._playCount >= this._playTimes) {
        // set frame to end frame.
        this._curFrame = frames[frames.length - 1];
        this._accTime = 0;
        this._playCount = 0;
        this._isAniComplete = true;

        this._emitCacheCompleteEvent();

        return;
      }

      this._accTime = 0;
      frameIdx = 0;

      this._emitCacheCompleteEvent();
    }

    this._curFrame = frames[frameIdx];
  },
  _updateRealtime: function _updateRealtime(dt) {
    var skeleton = this._skeleton;
    var state = this._state;

    if (skeleton) {
      skeleton.update(dt);

      if (state) {
        state.update(dt);
        state.apply(skeleton);
      }
    }
  },

  /**
   * !#en Sets vertex effect delegate.
   * !#zh 设置顶点动画代理
   * @method setVertexEffectDelegate
   * @param {sp.VertexEffectDelegate} effectDelegate
   */
  setVertexEffectDelegate: function setVertexEffectDelegate(effectDelegate) {
    this._effectDelegate = effectDelegate;
  },
  // RENDERER

  /**
   * !#en Computes the world SRT from the local SRT for each bone.
   * !#zh 重新更新所有骨骼的世界 Transform，
   * 当获取 bone 的数值未更新时，即可使用该函数进行更新数值。
   * @method updateWorldTransform
   * @example
   * var bone = spine.findBone('head');
   * cc.log(bone.worldX); // return 0;
   * spine.updateWorldTransform();
   * bone = spine.findBone('head');
   * cc.log(bone.worldX); // return -23.12;
   */
  updateWorldTransform: function updateWorldTransform() {
    if (!this.isAnimationCached()) return;

    if (this._skeleton) {
      this._skeleton.updateWorldTransform();
    }
  },

  /**
   * !#en Sets the bones and slots to the setup pose.
   * !#zh 还原到起始动作
   * @method setToSetupPose
   */
  setToSetupPose: function setToSetupPose() {
    if (this._skeleton) {
      this._skeleton.setToSetupPose();
    }
  },

  /**
   * !#en
   * Sets the bones to the setup pose,
   * using the values from the `BoneData` list in the `SkeletonData`.
   * !#zh
   * 设置 bone 到起始动作
   * 使用 SkeletonData 中的 BoneData 列表中的值。
   * @method setBonesToSetupPose
   */
  setBonesToSetupPose: function setBonesToSetupPose() {
    if (this._skeleton) {
      this._skeleton.setBonesToSetupPose();
    }
  },

  /**
   * !#en
   * Sets the slots to the setup pose,
   * using the values from the `SlotData` list in the `SkeletonData`.
   * !#zh
   * 设置 slot 到起始动作。
   * 使用 SkeletonData 中的 SlotData 列表中的值。
   * @method setSlotsToSetupPose
   */
  setSlotsToSetupPose: function setSlotsToSetupPose() {
    if (this._skeleton) {
      this._skeleton.setSlotsToSetupPose();
    }
  },

  /**
   * !#en
   * Updating an animation cache to calculate all frame data in the animation is a cost in 
   * performance due to calculating all data in a single frame.
   * To update the cache, use the invalidAnimationCache method with high performance.
   * !#zh
   * 更新某个动画缓存, 预计算动画中所有帧数据，由于在单帧计算所有数据，所以较消耗性能。
   * 若想更新缓存，可使用 invalidAnimationCache 方法，具有较高性能。
   * @method updateAnimationCache
   * @param {String} animName
   */
  updateAnimationCache: function updateAnimationCache(animName) {
    if (!this.isAnimationCached()) return; //wangcheng
    // let uuid = this.skeletonData._uuid;

    var uuid = this.getCacheKey();

    if (this._skeletonCache) {
      this._skeletonCache.updateAnimationCache(uuid, animName);
    }
  },

  /**
   * !#en
   * Invalidates the animation cache, which is then recomputed on each frame..
   * !#zh
   * 使动画缓存失效，之后会在每帧重新计算。
   * @method invalidAnimationCache
   */
  invalidAnimationCache: function invalidAnimationCache() {
    if (!this.isAnimationCached()) return; //wangcheng

    var uuid = this.getCacheKey(); // let uuid = this.skeletonData._uuid;

    if (this._skeletonCache) {
      this._skeletonCache.invalidAnimationCache(uuid);
    }
  },

  /**
   * !#en
   * Finds a bone by name.
   * This does a string comparison for every bone.<br>
   * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Bone object.
   * !#zh
   * 通过名称查找 bone。
   * 这里对每个 bone 的名称进行了对比。<br>
   * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Bone 对象。
   *
   * @method findBone
   * @param {String} boneName
   * @return {sp.spine.Bone}
   */
  findBone: function findBone(boneName) {
    if (this._skeleton) {
      return this._skeleton.findBone(boneName);
    }

    return null;
  },

  /**
   * !#en
   * Finds a slot by name. This does a string comparison for every slot.<br>
   * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Slot object.
   * !#zh
   * 通过名称查找 slot。这里对每个 slot 的名称进行了比较。<br>
   * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Slot 对象。
   *
   * @method findSlot
   * @param {String} slotName
   * @return {sp.spine.Slot}
   */
  findSlot: function findSlot(slotName) {
    if (this._skeleton) {
      return this._skeleton.findSlot(slotName);
    }

    return null;
  },

  /**
   * !#en
   * Finds a skin by name and makes it the active skin.
   * This does a string comparison for every skin.<br>
   * Note that setting the skin does not change which attachments are visible.<br>
   * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Skin object.
   * !#zh
   * 按名称查找皮肤，激活该皮肤。这里对每个皮肤的名称进行了比较。<br>
   * 注意：设置皮肤不会改变 attachment 的可见性。<br>
   * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Skin 对象。
   *
   * @method setSkin
   * @param {String} skinName
   */
  setSkin: function setSkin(skinName) {
    if (this._skeleton) {
      var skin = this._skeleton.skin; //wangcheng

      if (this._cacheMode == AnimationCacheMode.SHARED_CACHE) {
        if (skin && skin.name != skinName || !skin && skinName != this.defaultSkin) {
          var skeletonInfo = this._skeletonCache.getSkeletonCache(this.skeletonData._uuid + '_' + skinName, this._skeleton.data);

          this._skeleton = skeletonInfo.skeleton;
          this._clipper = skeletonInfo.clipper;
          this._rootBone = this._skeleton.getRootBone();
        }
      }

      this._skeleton.setSkinByName(skinName);

      this._skeleton.setSlotsToSetupPose();
    }

    this.invalidAnimationCache();
  },

  /**
   * !#en
   * Returns the attachment for the slot and attachment name.
   * The skeleton looks first in its skin, then in the skeleton data’s default skin.<br>
   * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Attachment object.
   * !#zh
   * 通过 slot 和 attachment 的名称获取 attachment。Skeleton 优先查找它的皮肤，然后才是 Skeleton Data 中默认的皮肤。<br>
   * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Attachment 对象。
   *
   * @method getAttachment
   * @param {String} slotName
   * @param {String} attachmentName
   * @return {sp.spine.Attachment}
   */
  getAttachment: function getAttachment(slotName, attachmentName) {
    if (this._skeleton) {
      return this._skeleton.getAttachmentByName(slotName, attachmentName);
    }

    return null;
  },

  /**
   * !#en
   * Sets the attachment for the slot and attachment name.
   * The skeleton looks first in its skin, then in the skeleton data’s default skin.
   * !#zh
   * 通过 slot 和 attachment 的名字来设置 attachment。
   * Skeleton 优先查找它的皮肤，然后才是 Skeleton Data 中默认的皮肤。
   * @method setAttachment
   * @param {String} slotName
   * @param {String} attachmentName
   */
  setAttachment: function setAttachment(slotName, attachmentName) {
    if (this._skeleton) {
      this._skeleton.setAttachment(slotName, attachmentName);
    }

    this.invalidAnimationCache();
  },

  /**
  * Return the renderer of attachment.
  * @method getTextureAtlas
  * @param {sp.spine.RegionAttachment|spine.BoundingBoxAttachment} regionAttachment
  * @return {sp.spine.TextureAtlasRegion}
  */
  getTextureAtlas: function getTextureAtlas(regionAttachment) {
    return regionAttachment.region;
  },
  // ANIMATION

  /**
   * !#en
   * Mix applies all keyframe values,
   * interpolated for the specified time and mixed with the current values.
   * !#zh 为所有关键帧设定混合及混合时间（从当前值开始差值）。
   * @method setMix
   * @param {String} fromAnimation
   * @param {String} toAnimation
   * @param {Number} duration
   */
  setMix: function setMix(fromAnimation, toAnimation, duration) {
    if (this._state) {
      this._state.data.setMix(fromAnimation, toAnimation, duration);
    }
  },

  /**
   * !#en Set the current animation. Any queued animations are cleared.<br>
   * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry object.
   * !#zh 设置当前动画。队列中的任何的动画将被清除。<br>
   * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry 对象。
   * @method setAnimation
   * @param {Number} trackIndex
   * @param {String} name
   * @param {Boolean} loop
   * @return {sp.spine.TrackEntry}
   */
  setAnimation: function setAnimation(trackIndex, name, loop) {
    this._playTimes = loop ? 0 : 1;
    this._animationName = name;

    if (this.isAnimationCached()) {
      if (trackIndex !== 0) {
        cc.warn("Track index can not greater than 0 in cached mode.");
      }

      if (!this._skeletonCache) return null; //wangcheng

      var uuid = this.getCacheKey(); // let uuid = this.skeletonData._uuid;

      var cache = this._skeletonCache.getAnimationCache(uuid, name);

      if (!cache) {
        cache = this._skeletonCache.initAnimationCache(uuid, name);
      }

      if (cache) {
        this._isAniComplete = false;
        this._accTime = 0;
        this._playCount = 0;
        this._frameCache = cache;

        if (this.attachUtil._hasAttachedNode()) {
          this._frameCache.enableCacheAttachedInfo();
        }

        this._frameCache.updateToFrame(0);

        this._curFrame = this._frameCache.frames[0];
      }
    } else {
      if (this._skeleton) {
        var animation = this._skeleton.data.findAnimation(name);

        if (!animation) {
          cc.logID(7509, name);
          return null;
        }

        var res = this._state.setAnimationWith(trackIndex, animation, loop);

        this._state.apply(this._skeleton);

        return res;
      }
    }

    return null;
  },

  /**
   * !#en Adds an animation to be played delay seconds after the current or last queued animation.<br>
   * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry object.
   * !#zh 添加一个动画到动画队列尾部，还可以延迟指定的秒数。<br>
   * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry 对象。
   * @method addAnimation
   * @param {Number} trackIndex
   * @param {String} name
   * @param {Boolean} loop
   * @param {Number} [delay=0]
   * @return {sp.spine.TrackEntry}
   */
  addAnimation: function addAnimation(trackIndex, name, loop, delay) {
    delay = delay || 0;

    if (this.isAnimationCached()) {
      if (trackIndex !== 0) {
        cc.warn("Track index can not greater than 0 in cached mode.");
      }

      this._animationQueue.push({
        animationName: name,
        loop: loop,
        delay: delay
      });
    } else {
      if (this._skeleton) {
        var animation = this._skeleton.data.findAnimation(name);

        if (!animation) {
          cc.logID(7510, name);
          return null;
        }

        return this._state.addAnimationWith(trackIndex, animation, loop, delay);
      }
    }

    return null;
  },

  /**
   * !#en Find animation with specified name.
   * !#zh 查找指定名称的动画
   * @method findAnimation
   * @param {String} name
   * @returns {sp.spine.Animation}
   */
  findAnimation: function findAnimation(name) {
    if (this._skeleton) {
      return this._skeleton.data.findAnimation(name);
    }

    return null;
  },

  /**
   * !#en Returns track entry by trackIndex.<br>
   * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry object.
   * !#zh 通过 track 索引获取 TrackEntry。<br>
   * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry 对象。
   * @method getCurrent
   * @param trackIndex
   * @return {sp.spine.TrackEntry}
   */
  getCurrent: function getCurrent(trackIndex) {
    if (this.isAnimationCached()) {
      cc.warn("'getCurrent' interface can not be invoked in cached mode.");
    } else {
      if (this._state) {
        return this._state.getCurrent(trackIndex);
      }
    }

    return null;
  },

  /**
   * !#en Clears all tracks of animation state.
   * !#zh 清除所有 track 的动画状态。
   * @method clearTracks
   */
  clearTracks: function clearTracks() {
    if (this.isAnimationCached()) {
      cc.warn("'clearTracks' interface can not be invoked in cached mode.");
    } else {
      if (this._state) {
        this._state.clearTracks();
      }
    }
  },

  /**
   * !#en Clears track of animation state by trackIndex.
   * !#zh 清除出指定 track 的动画状态。
   * @method clearTrack
   * @param {number} trackIndex
   */
  clearTrack: function clearTrack(trackIndex) {
    if (this.isAnimationCached()) {
      cc.warn("'clearTrack' interface can not be invoked in cached mode.");
    } else {
      if (this._state) {
        this._state.clearTrack(trackIndex);

        if (CC_EDITOR && !cc.engine.isPlaying) {
          this._state.update(0);
        }
      }
    }
  },

  /**
   * !#en Set the start event listener.
   * !#zh 用来设置开始播放动画的事件监听。
   * @method setStartListener
   * @param {function} listener
   */
  setStartListener: function setStartListener(listener) {
    this._ensureListener();

    this._listener.start = listener;
  },

  /**
   * !#en Set the interrupt event listener.
   * !#zh 用来设置动画被打断的事件监听。
   * @method setInterruptListener
   * @param {function} listener
   */
  setInterruptListener: function setInterruptListener(listener) {
    this._ensureListener();

    this._listener.interrupt = listener;
  },

  /**
   * !#en Set the end event listener.
   * !#zh 用来设置动画播放完后的事件监听。
   * @method setEndListener
   * @param {function} listener
   */
  setEndListener: function setEndListener(listener) {
    this._ensureListener();

    this._listener.end = listener;
  },

  /**
   * !#en Set the dispose event listener.
   * !#zh 用来设置动画将被销毁的事件监听。
   * @method setDisposeListener
   * @param {function} listener
   */
  setDisposeListener: function setDisposeListener(listener) {
    this._ensureListener();

    this._listener.dispose = listener;
  },

  /**
   * !#en Set the complete event listener.
   * !#zh 用来设置动画播放一次循环结束后的事件监听。
   * @method setCompleteListener
   * @param {function} listener
   */
  setCompleteListener: function setCompleteListener(listener) {
    this._ensureListener();

    this._listener.complete = listener;
  },

  /**
   * !#en Set the animation event listener.
   * !#zh 用来设置动画播放过程中帧事件的监听。
   * @method setEventListener
   * @param {function} listener
   */
  setEventListener: function setEventListener(listener) {
    this._ensureListener();

    this._listener.event = listener;
  },

  /**
   * !#en Set the start event listener for specified TrackEntry.
   * !#zh 用来为指定的 TrackEntry 设置动画开始播放的事件监听。
   * @method setTrackStartListener
   * @param {sp.spine.TrackEntry} entry
   * @param {function} listener
   */
  setTrackStartListener: function setTrackStartListener(entry, listener) {
    TrackEntryListeners.getListeners(entry).start = listener;
  },

  /**
   * !#en Set the interrupt event listener for specified TrackEntry.
   * !#zh 用来为指定的 TrackEntry 设置动画被打断的事件监听。
   * @method setTrackInterruptListener
   * @param {sp.spine.TrackEntry} entry
   * @param {function} listener
   */
  setTrackInterruptListener: function setTrackInterruptListener(entry, listener) {
    TrackEntryListeners.getListeners(entry).interrupt = listener;
  },

  /**
   * !#en Set the end event listener for specified TrackEntry.
   * !#zh 用来为指定的 TrackEntry 设置动画播放结束的事件监听。
   * @method setTrackEndListener
   * @param {sp.spine.TrackEntry} entry
   * @param {function} listener
   */
  setTrackEndListener: function setTrackEndListener(entry, listener) {
    TrackEntryListeners.getListeners(entry).end = listener;
  },

  /**
   * !#en Set the dispose event listener for specified TrackEntry.
   * !#zh 用来为指定的 TrackEntry 设置动画即将被销毁的事件监听。
   * @method setTrackDisposeListener
   * @param {sp.spine.TrackEntry} entry
   * @param {function} listener
   */
  setTrackDisposeListener: function setTrackDisposeListener(entry, listener) {
    TrackEntryListeners.getListeners(entry).dispose = listener;
  },

  /**
   * !#en Set the complete event listener for specified TrackEntry.
   * !#zh 用来为指定的 TrackEntry 设置动画一次循环播放结束的事件监听。
   * @method setTrackCompleteListener
   * @param {sp.spine.TrackEntry} entry
   * @param {function} listener
   * @param {sp.spine.TrackEntry} listener.entry
   * @param {Number} listener.loopCount
   */
  setTrackCompleteListener: function setTrackCompleteListener(entry, listener) {
    TrackEntryListeners.getListeners(entry).complete = function (trackEntry) {
      var loopCount = Math.floor(trackEntry.trackTime / trackEntry.animationEnd);
      listener(trackEntry, loopCount);
    };
  },

  /**
   * !#en Set the event listener for specified TrackEntry.
   * !#zh 用来为指定的 TrackEntry 设置动画帧事件的监听。
   * @method setTrackEventListener
   * @param {sp.spine.TrackEntry} entry
   * @param {function} listener
   */
  setTrackEventListener: function setTrackEventListener(entry, listener) {
    TrackEntryListeners.getListeners(entry).event = listener;
  },

  /**
   * !#en Get the animation state object
   * !#zh 获取动画状态
   * @method getState
   * @return {sp.spine.AnimationState} state
   */
  getState: function getState() {
    return this._state;
  },
  // update animation list for editor
  _updateAnimEnum: CC_EDITOR && function () {
    var animEnum;

    if (this.skeletonData) {
      animEnum = this.skeletonData.getAnimsEnum();
    } // change enum


    setEnumAttr(this, '_animationIndex', animEnum || DefaultAnimsEnum);
  },
  // update skin list for editor
  _updateSkinEnum: CC_EDITOR && function () {
    var skinEnum;

    if (this.skeletonData) {
      skinEnum = this.skeletonData.getSkinsEnum();
    } // change enum


    setEnumAttr(this, '_defaultSkinIndex', skinEnum || DefaultSkinsEnum);
  },
  _ensureListener: function _ensureListener() {
    if (!this._listener) {
      this._listener = new TrackEntryListeners();

      if (this._state) {
        this._state.addListener(this._listener);
      }
    }
  },
  _updateSkeletonData: function _updateSkeletonData() {
    if (!this.skeletonData) {
      this.disableRender();
      return;
    }

    var data = this.skeletonData.getRuntimeData();

    if (!data) {
      this.disableRender();
      return;
    }

    try {
      this.setSkeletonData(data);

      if (!this.isAnimationCached()) {
        this.setAnimationStateData(new spine.AnimationStateData(this._skeleton.data));
      }

      this.defaultSkin && this.setSkin(this.defaultSkin);
    } catch (e) {
      cc.warn(e);
    }

    this.attachUtil.init(this);

    this.attachUtil._associateAttachedNode();

    this._preCacheMode = this._cacheMode;
    this.animation = this.defaultAnimation;
  },
  _refreshInspector: function _refreshInspector() {
    // update inspector
    this._updateAnimEnum();

    this._updateSkinEnum();

    Editor.Utils.refreshSelectedInspector('node', this.node.uuid);
  },
  _updateDebugDraw: function _updateDebugDraw() {
    if (this.debugBones || this.debugSlots) {
      if (!this._debugRenderer) {
        var debugDrawNode = new cc.PrivateNode();
        debugDrawNode.name = 'DEBUG_DRAW_NODE';
        var debugDraw = debugDrawNode.addComponent(Graphics);
        debugDraw.lineWidth = 1;
        debugDraw.strokeColor = cc.color(255, 0, 0, 255);
        this._debugRenderer = debugDraw;
      }

      this._debugRenderer.node.parent = this.node;

      if (this.isAnimationCached()) {
        cc.warn("Debug bones or slots is invalid in cached mode");
      }
    } else if (this._debugRenderer) {
      this._debugRenderer.node.parent = null;
    }
  }
});
module.exports = sp.Skeleton;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvZXh0ZW5zaW9ucy9zcGluZS9Ta2VsZXRvbi5qcyJdLCJuYW1lcyI6WyJUcmFja0VudHJ5TGlzdGVuZXJzIiwicmVxdWlyZSIsIlJlbmRlckNvbXBvbmVudCIsInNwaW5lIiwiR3JhcGhpY3MiLCJSZW5kZXJGbG93IiwiRkxBR19QT1NUX1JFTkRFUiIsIlNrZWxldG9uQ2FjaGUiLCJBdHRhY2hVdGlsIiwiRGVmYXVsdFNraW5zRW51bSIsImNjIiwiRW51bSIsIkRlZmF1bHRBbmltc0VudW0iLCJBbmltYXRpb25DYWNoZU1vZGUiLCJSRUFMVElNRSIsIlNIQVJFRF9DQUNIRSIsIlBSSVZBVEVfQ0FDSEUiLCJzZXRFbnVtQXR0ciIsIm9iaiIsInByb3BOYW1lIiwiZW51bURlZiIsIkNsYXNzIiwiQXR0ciIsInNldENsYXNzQXR0ciIsImdldExpc3QiLCJzcCIsIlNrZWxldG9uIiwibmFtZSIsImVkaXRvciIsIkNDX0VESVRPUiIsIm1lbnUiLCJoZWxwIiwiaW5zcGVjdG9yIiwic3RhdGljcyIsInByb3BlcnRpZXMiLCJwYXVzZWQiLCJ2aXNpYmxlIiwic2tlbGV0b25EYXRhIiwidHlwZSIsIlNrZWxldG9uRGF0YSIsIm5vdGlmeSIsImRlZmF1bHRTa2luIiwiZGVmYXVsdEFuaW1hdGlvbiIsIl9yZWZyZXNoSW5zcGVjdG9yIiwiX3VwZGF0ZVNrZWxldG9uRGF0YSIsInRvb2x0aXAiLCJDQ19ERVYiLCJhbmltYXRpb24iLCJnZXQiLCJpc0FuaW1hdGlvbkNhY2hlZCIsIl9hbmltYXRpb25OYW1lIiwiZW50cnkiLCJnZXRDdXJyZW50Iiwic2V0IiwidmFsdWUiLCJzZXRBbmltYXRpb24iLCJsb29wIiwiY2xlYXJUcmFjayIsInNldFRvU2V0dXBQb3NlIiwiX2RlZmF1bHRTa2luSW5kZXgiLCJza2luc0VudW0iLCJnZXRTa2luc0VudW0iLCJoYXNPd25Qcm9wZXJ0eSIsInNraW5JbmRleCIsInVuZGVmaW5lZCIsImVycm9ySUQiLCJza2luTmFtZSIsInNldFNraW4iLCJlbmdpbmUiLCJpc1BsYXlpbmciLCJhbmltYXRhYmxlIiwiZGlzcGxheU5hbWUiLCJfYW5pbWF0aW9uSW5kZXgiLCJhbmltYXRpb25OYW1lIiwiYW5pbXNFbnVtIiwiZ2V0QW5pbXNFbnVtIiwiYW5pbUluZGV4IiwiYW5pbU5hbWUiLCJfcHJlQ2FjaGVNb2RlIiwiX2NhY2hlTW9kZSIsIl9kZWZhdWx0Q2FjaGVNb2RlIiwic2V0QW5pbWF0aW9uQ2FjaGVNb2RlIiwiZWRpdG9yT25seSIsInByZW11bHRpcGxpZWRBbHBoYSIsInRpbWVTY2FsZSIsImRlYnVnU2xvdHMiLCJfdXBkYXRlRGVidWdEcmF3IiwiZGVidWdCb25lcyIsImRlYnVnTWVzaCIsInVzZVRpbnQiLCJfdXBkYXRlVXNlVGludCIsImVuYWJsZUJhdGNoIiwiX3VwZGF0ZUJhdGNoIiwiX2FjY1RpbWUiLCJfcGxheUNvdW50IiwiX2ZyYW1lQ2FjaGUiLCJfY3VyRnJhbWUiLCJfc2tlbGV0b25DYWNoZSIsIl9hbmltYXRpb25RdWV1ZSIsIl9oZWFkQW5pSW5mbyIsIl9wbGF5VGltZXMiLCJfaXNBbmlDb21wbGV0ZSIsImN0b3IiLCJfZWZmZWN0RGVsZWdhdGUiLCJfc2tlbGV0b24iLCJfcm9vdEJvbmUiLCJfbGlzdGVuZXIiLCJfbWF0ZXJpYWxDYWNoZSIsIl9kZWJ1Z1JlbmRlcmVyIiwiX3N0YXJ0U2xvdEluZGV4IiwiX2VuZFNsb3RJbmRleCIsIl9zdGFydEVudHJ5IiwidHJhY2tJbmRleCIsIl9lbmRFbnRyeSIsImF0dGFjaFV0aWwiLCJfZ2V0RGVmYXVsdE1hdGVyaWFsIiwiTWF0ZXJpYWwiLCJnZXRCdWlsdGluTWF0ZXJpYWwiLCJfdXBkYXRlTWF0ZXJpYWwiLCJDQ19OQVRJVkVSRU5ERVJFUiIsImJhc2VNYXRlcmlhbCIsImdldE1hdGVyaWFsIiwiZGVmaW5lIiwic3JjQmxlbmRGYWN0b3IiLCJnZngiLCJCTEVORF9PTkUiLCJCTEVORF9TUkNfQUxQSEEiLCJkc3RCbGVuZEZhY3RvciIsIkJMRU5EX09ORV9NSU5VU19TUkNfQUxQSEEiLCJzZXRCbGVuZCIsIkJMRU5EX0ZVTkNfQUREIiwiZGlzYWJsZVJlbmRlciIsIl9zdXBlciIsIm5vZGUiLCJfcmVuZGVyRmxhZyIsIm1hcmtGb3JSZW5kZXIiLCJlbmFibGUiLCJfdmFsaWRhdGVSZW5kZXIiLCJpc1RleHR1cmVzTG9hZGVkIiwic2V0U2tlbGV0b25EYXRhIiwid2lkdGgiLCJoZWlnaHQiLCJzZXRDb250ZW50U2l6ZSIsInNoYXJlZENhY2hlIiwiZW5hYmxlUHJpdmF0ZU1vZGUiLCJ3YXJuIiwiY2FjaGVLZXkiLCJnZXRDYWNoZUtleSIsInNrZWxldG9uSW5mbyIsImdldFNrZWxldG9uQ2FjaGUiLCJza2VsZXRvbiIsIl9jbGlwcGVyIiwiY2xpcHBlciIsImdldFJvb3RCb25lIiwiU2tlbGV0b25DbGlwcGluZyIsInNraW4iLCJfdXVpZCIsInNldFNsb3RzUmFuZ2UiLCJzdGFydFNsb3RJbmRleCIsImVuZFNsb3RJbmRleCIsInNldEFuaW1hdGlvblN0YXRlRGF0YSIsInN0YXRlRGF0YSIsInN0YXRlIiwiQW5pbWF0aW9uU3RhdGUiLCJfc3RhdGUiLCJyZW1vdmVMaXN0ZW5lciIsImFkZExpc3RlbmVyIiwiX19wcmVsb2FkIiwiRmxhZ3MiLCJPYmplY3QiLCJfb2JqRmxhZ3MiLCJJc0FuY2hvckxvY2tlZCIsIklzU2l6ZUxvY2tlZCIsImNoaWxkcmVuIiwiaSIsIm4iLCJsZW5ndGgiLCJjaGlsZCIsIl9uYW1lIiwiZGVzdHJveSIsImNhY2hlTW9kZSIsInVwZGF0ZSIsImR0IiwiZnJhbWVDYWNoZSIsImlzSW52YWxpZCIsInVwZGF0ZVRvRnJhbWUiLCJmcmFtZXMiLCJzaGlmdCIsImRlbGF5IiwiYW5pSW5mbyIsIl91cGRhdGVDYWNoZSIsIl91cGRhdGVSZWFsdGltZSIsIl9lbWl0Q2FjaGVDb21wbGV0ZUV2ZW50IiwiY29tcGxldGUiLCJlbmQiLCJpc0luaXRlZCIsImZyYW1lVGltZSIsIkZyYW1lVGltZSIsInN0YXJ0IiwiZnJhbWVJZHgiLCJNYXRoIiwiZmxvb3IiLCJpc0NvbXBsZXRlZCIsImFwcGx5Iiwic2V0VmVydGV4RWZmZWN0RGVsZWdhdGUiLCJlZmZlY3REZWxlZ2F0ZSIsInVwZGF0ZVdvcmxkVHJhbnNmb3JtIiwic2V0Qm9uZXNUb1NldHVwUG9zZSIsInNldFNsb3RzVG9TZXR1cFBvc2UiLCJ1cGRhdGVBbmltYXRpb25DYWNoZSIsInV1aWQiLCJpbnZhbGlkQW5pbWF0aW9uQ2FjaGUiLCJmaW5kQm9uZSIsImJvbmVOYW1lIiwiZmluZFNsb3QiLCJzbG90TmFtZSIsImRhdGEiLCJzZXRTa2luQnlOYW1lIiwiZ2V0QXR0YWNobWVudCIsImF0dGFjaG1lbnROYW1lIiwiZ2V0QXR0YWNobWVudEJ5TmFtZSIsInNldEF0dGFjaG1lbnQiLCJnZXRUZXh0dXJlQXRsYXMiLCJyZWdpb25BdHRhY2htZW50IiwicmVnaW9uIiwic2V0TWl4IiwiZnJvbUFuaW1hdGlvbiIsInRvQW5pbWF0aW9uIiwiZHVyYXRpb24iLCJjYWNoZSIsImdldEFuaW1hdGlvbkNhY2hlIiwiaW5pdEFuaW1hdGlvbkNhY2hlIiwiX2hhc0F0dGFjaGVkTm9kZSIsImVuYWJsZUNhY2hlQXR0YWNoZWRJbmZvIiwiZmluZEFuaW1hdGlvbiIsImxvZ0lEIiwicmVzIiwic2V0QW5pbWF0aW9uV2l0aCIsImFkZEFuaW1hdGlvbiIsInB1c2giLCJhZGRBbmltYXRpb25XaXRoIiwiY2xlYXJUcmFja3MiLCJzZXRTdGFydExpc3RlbmVyIiwibGlzdGVuZXIiLCJfZW5zdXJlTGlzdGVuZXIiLCJzZXRJbnRlcnJ1cHRMaXN0ZW5lciIsImludGVycnVwdCIsInNldEVuZExpc3RlbmVyIiwic2V0RGlzcG9zZUxpc3RlbmVyIiwiZGlzcG9zZSIsInNldENvbXBsZXRlTGlzdGVuZXIiLCJzZXRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJzZXRUcmFja1N0YXJ0TGlzdGVuZXIiLCJnZXRMaXN0ZW5lcnMiLCJzZXRUcmFja0ludGVycnVwdExpc3RlbmVyIiwic2V0VHJhY2tFbmRMaXN0ZW5lciIsInNldFRyYWNrRGlzcG9zZUxpc3RlbmVyIiwic2V0VHJhY2tDb21wbGV0ZUxpc3RlbmVyIiwidHJhY2tFbnRyeSIsImxvb3BDb3VudCIsInRyYWNrVGltZSIsImFuaW1hdGlvbkVuZCIsInNldFRyYWNrRXZlbnRMaXN0ZW5lciIsImdldFN0YXRlIiwiX3VwZGF0ZUFuaW1FbnVtIiwiYW5pbUVudW0iLCJfdXBkYXRlU2tpbkVudW0iLCJza2luRW51bSIsImdldFJ1bnRpbWVEYXRhIiwiQW5pbWF0aW9uU3RhdGVEYXRhIiwiZSIsImluaXQiLCJfYXNzb2NpYXRlQXR0YWNoZWROb2RlIiwiRWRpdG9yIiwiVXRpbHMiLCJyZWZyZXNoU2VsZWN0ZWRJbnNwZWN0b3IiLCJkZWJ1Z0RyYXdOb2RlIiwiUHJpdmF0ZU5vZGUiLCJkZWJ1Z0RyYXciLCJhZGRDb21wb25lbnQiLCJsaW5lV2lkdGgiLCJzdHJva2VDb2xvciIsImNvbG9yIiwicGFyZW50IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsbUJBQW1CLEdBQUdDLE9BQU8sQ0FBQyx5QkFBRCxDQUFuQzs7QUFDQSxJQUFNQyxlQUFlLEdBQUdELE9BQU8sQ0FBQyxpREFBRCxDQUEvQjs7QUFDQSxJQUFNRSxLQUFLLEdBQUdGLE9BQU8sQ0FBQyxhQUFELENBQXJCOztBQUNBLElBQU1HLFFBQVEsR0FBR0gsT0FBTyxDQUFDLHNDQUFELENBQXhCOztBQUNBLElBQU1JLFVBQVUsR0FBR0osT0FBTyxDQUFDLHlDQUFELENBQTFCOztBQUNBLElBQU1LLGdCQUFnQixHQUFHRCxVQUFVLENBQUNDLGdCQUFwQzs7QUFFQSxJQUFJQyxhQUFhLEdBQUdOLE9BQU8sQ0FBQyxrQkFBRCxDQUEzQjs7QUFDQSxJ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Q0FBdEI7QUFDQUYsUUFBQUEsU0FBUyxDQUFDRyxXQUFWLEdBQXdCaFIsRUFBRSxDQUFDaVIsS0FBSCxDQUFTLEdBQVQsRUFBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CLEdBQXBCLENBQXhCO0FBRUEsYUFBSy9LLGNBQUwsR0FBc0IySyxTQUF0QjtBQUNIOztBQUVELFdBQUszSyxjQUFMLENBQW9CeUIsSUFBcEIsQ0FBeUJ1SixNQUF6QixHQUFrQyxLQUFLdkosSUFBdkM7O0FBQ0EsVUFBSSxLQUFLcEYsaUJBQUwsRUFBSixFQUE4QjtBQUMxQnZDLFFBQUFBLEVBQUUsQ0FBQ3VJLElBQUgsQ0FBUSxnREFBUjtBQUNIO0FBQ0osS0FmRCxNQWdCSyxJQUFJLEtBQUtyQyxjQUFULEVBQXlCO0FBQzFCLFdBQUtBLGNBQUwsQ0FBb0J5QixJQUFwQixDQUF5QnVKLE1BQXpCLEdBQWtDLElBQWxDO0FBQ0g7QUFDSjtBQTF5Q2tCLENBQVQsQ0FBZDtBQTZ5Q0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnJRLEVBQUUsQ0FBQ0MsUUFBcEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IFRyYWNrRW50cnlMaXN0ZW5lcnMgPSByZXF1aXJlKCcuL3RyYWNrLWVudHJ5LWxpc3RlbmVycycpO1xuY29uc3QgUmVuZGVyQ29tcG9uZW50ID0gcmVxdWlyZSgnLi4vLi4vY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvQ0NSZW5kZXJDb21wb25lbnQnKTtcbmNvbnN0IHNwaW5lID0gcmVxdWlyZSgnLi9saWIvc3BpbmUnKTtcbmNvbnN0IEdyYXBoaWNzID0gcmVxdWlyZSgnLi4vLi4vY29jb3MyZC9jb3JlL2dyYXBoaWNzL2dyYXBoaWNzJyk7XG5jb25zdCBSZW5kZXJGbG93ID0gcmVxdWlyZSgnLi4vLi4vY29jb3MyZC9jb3JlL3JlbmRlcmVyL3JlbmRlci1mbG93Jyk7XG5jb25zdCBGTEFHX1BPU1RfUkVOREVSID0gUmVuZGVyRmxvdy5GTEFHX1BPU1RfUkVOREVSO1xuXG5sZXQgU2tlbGV0b25DYWNoZSA9IHJlcXVpcmUoJy4vc2tlbGV0b24tY2FjaGUnKTtcbmxldCBBdHRhY2hVdGlsID0gcmVxdWlyZSgnLi9BdHRhY2hVdGlsJyk7XG5cbi8qKlxuICogQG1vZHVsZSBzcFxuICovXG5sZXQgRGVmYXVsdFNraW5zRW51bSA9IGNjLkVudW0oeyAnZGVmYXVsdCc6IC0xIH0pO1xubGV0IERlZmF1bHRBbmltc0VudW0gPSBjYy5FbnVtKHsgJzxOb25lPic6IDAgfSk7XG5cbi8qKlxuICogISNlbiBFbnVtIGZvciBhbmltYXRpb24gY2FjaGUgbW9kZSB0eXBlLlxuICogISN6aCBTcGluZeWKqOeUu+e8k+WtmOexu+Wei1xuICogQGVudW0gU2tlbGV0b24uQW5pbWF0aW9uQ2FjaGVNb2RlXG4gKi9cbmxldCBBbmltYXRpb25DYWNoZU1vZGUgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSByZWFsdGltZSBtb2RlLlxuICAgICAqICEjemgg5a6e5pe26K6h566X5qih5byP44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFJFQUxUSU1FXG4gICAgICovXG4gICAgUkVBTFRJTUU6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgc2hhcmVkIGNhY2hlIG1vZGUuXG4gICAgICogISN6aCDlhbHkuqvnvJPlrZjmqKHlvI/jgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU0hBUkVEX0NBQ0hFXG4gICAgICovXG4gICAgU0hBUkVEX0NBQ0hFOiAxLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHByaXZhdGUgY2FjaGUgbW9kZS5cbiAgICAgKiAhI3poIOengeaciee8k+WtmOaooeW8j+OAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBQUklWQVRFX0NBQ0hFXG4gICAgICovXG4gICAgUFJJVkFURV9DQUNIRTogMlxufSk7XG5cbmZ1bmN0aW9uIHNldEVudW1BdHRyKG9iaiwgcHJvcE5hbWUsIGVudW1EZWYpIHtcbiAgICBjYy5DbGFzcy5BdHRyLnNldENsYXNzQXR0cihvYmosIHByb3BOYW1lLCAndHlwZScsICdFbnVtJyk7XG4gICAgY2MuQ2xhc3MuQXR0ci5zZXRDbGFzc0F0dHIob2JqLCBwcm9wTmFtZSwgJ2VudW1MaXN0JywgY2MuRW51bS5nZXRMaXN0KGVudW1EZWYpKTtcbn1cblxuLyoqXG4gKiAhI2VuXG4gKiBUaGUgc2tlbGV0b24gb2YgU3BpbmUgPGJyLz5cbiAqIDxici8+XG4gKiAoU2tlbGV0b24gaGFzIGEgcmVmZXJlbmNlIHRvIGEgU2tlbGV0b25EYXRhIGFuZCBzdG9yZXMgdGhlIHN0YXRlIGZvciBza2VsZXRvbiBpbnN0YW5jZSxcbiAqIHdoaWNoIGNvbnNpc3RzIG9mIHRoZSBjdXJyZW50IHBvc2UncyBib25lIFNSVCwgc2xvdCBjb2xvcnMsIGFuZCB3aGljaCBzbG90IGF0dGFjaG1lbnRzIGFyZSB2aXNpYmxlLiA8YnIvPlxuICogTXVsdGlwbGUgc2tlbGV0b25zIGNhbiB1c2UgdGhlIHNhbWUgU2tlbGV0b25EYXRhIHdoaWNoIGluY2x1ZGVzIGFsbCBhbmltYXRpb25zLCBza2lucywgYW5kIGF0dGFjaG1lbnRzLikgPGJyLz5cbiAqICEjemhcbiAqIFNwaW5lIOmqqOmqvOWKqOeUuyA8YnIvPlxuICogPGJyLz5cbiAqIChTa2VsZXRvbiDlhbfmnInlr7npqqjpqrzmlbDmja7nmoTlvJXnlKjlubbkuJTlrZjlgqjkuobpqqjpqrzlrp7kvovnmoTnirbmgIHvvIxcbiAqIOWug+eUseW9k+WJjeeahOmqqOmqvOWKqOS9nO+8jHNsb3Qg6aKc6Imy77yM5ZKM5Y+v6KeB55qEIHNsb3QgYXR0YWNobWVudHMg57uE5oiQ44CCPGJyLz5cbiAqIOWkmuS4qiBTa2VsZXRvbiDlj6/ku6Xkvb/nlKjnm7jlkIznmoTpqqjpqrzmlbDmja7vvIzlhbbkuK3ljIXmi6zmiYDmnInnmoTliqjnlLvvvIznmq7ogqTlkowgYXR0YWNobWVudHPjgIJcbiAqXG4gKiBAY2xhc3MgU2tlbGV0b25cbiAqIEBleHRlbmRzIFJlbmRlckNvbXBvbmVudFxuICovXG5zcC5Ta2VsZXRvbiA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnc3AuU2tlbGV0b24nLFxuICAgIGV4dGVuZHM6IFJlbmRlckNvbXBvbmVudCxcbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQucmVuZGVyZXJzL1NwaW5lIFNrZWxldG9uJyxcbiAgICAgICAgaGVscDogJ2FwcDovL2RvY3MvaHRtbC9jb21wb25lbnRzL3NwaW5lLmh0bWwnLFxuICAgICAgICBpbnNwZWN0b3I6ICdwYWNrYWdlczovL2luc3BlY3Rvci9pbnNwZWN0b3JzL2NvbXBzL3NrZWxldG9uMmQuanMnLFxuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIEFuaW1hdGlvbkNhY2hlTW9kZTogQW5pbWF0aW9uQ2FjaGVNb2RlLFxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBza2VsZXRhbCBhbmltYXRpb24gaXMgcGF1c2VkP1xuICAgICAgICAgKiAhI3poIOivpemqqOmqvOWKqOeUu+aYr+WQpuaaguWBnOOAglxuICAgICAgICAgKiBAcHJvcGVydHkgcGF1c2VkXG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKiBAcmVhZE9ubHlcbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIHBhdXNlZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBza2VsZXRvbiBkYXRhIGNvbnRhaW5zIHRoZSBza2VsZXRvbiBpbmZvcm1hdGlvbiAoYmluZCBwb3NlIGJvbmVzLCBzbG90cywgZHJhdyBvcmRlcixcbiAgICAgICAgICogYXR0YWNobWVudHMsIHNraW5zLCBldGMpIGFuZCBhbmltYXRpb25zIGJ1dCBkb2VzIG5vdCBob2xkIGFueSBzdGF0ZS48YnIvPlxuICAgICAgICAgKiBNdWx0aXBsZSBza2VsZXRvbnMgY2FuIHNoYXJlIHRoZSBzYW1lIHNrZWxldG9uIGRhdGEuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog6aqo6aq85pWw5o2u5YyF5ZCr5LqG6aqo6aq85L+h5oGv77yI57uR5a6a6aqo6aq85Yqo5L2c77yMc2xvdHPvvIzmuLLmn5Ppobrluo/vvIxcbiAgICAgICAgICogYXR0YWNobWVudHPvvIznmq7ogqTnrYnnrYnvvInlkozliqjnlLvkvYbkuI3mjIHmnInku7vkvZXnirbmgIHjgII8YnIvPlxuICAgICAgICAgKiDlpJrkuKogU2tlbGV0b24g5Y+v5Lul5YWx55So55u45ZCM55qE6aqo6aq85pWw5o2u44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7c3AuU2tlbGV0b25EYXRhfSBza2VsZXRvbkRhdGFcbiAgICAgICAgICovXG4gICAgICAgIHNrZWxldG9uRGF0YToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IHNwLlNrZWxldG9uRGF0YSxcbiAgICAgICAgICAgIG5vdGlmeSgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRTa2luID0gJyc7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0QW5pbWF0aW9uID0gJyc7XG4gICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWZyZXNoSW5zcGVjdG9yKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVNrZWxldG9uRGF0YSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuc2tlbGV0b24uc2tlbGV0b25fZGF0YSdcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDnlLHkuo4gc3BpbmUg55qEIHNraW4g5piv5peg5rOV5LqM5qyh5pu/5o2i55qE77yM5omA5Lul5Y+q6IO96K6+572u6buY6K6k55qEIHNraW5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIG5hbWUgb2YgZGVmYXVsdCBza2luLlxuICAgICAgICAgKiAhI3poIOm7mOiupOeahOearuiCpOWQjeensOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gZGVmYXVsdFNraW5cbiAgICAgICAgICovXG4gICAgICAgIGRlZmF1bHRTa2luOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAnJyxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIG5hbWUgb2YgZGVmYXVsdCBhbmltYXRpb24uXG4gICAgICAgICAqICEjemgg6buY6K6k55qE5Yqo55S75ZCN56ew44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBkZWZhdWx0QW5pbWF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBkZWZhdWx0QW5pbWF0aW9uOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAnJyxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIG5hbWUgb2YgY3VycmVudCBwbGF5aW5nIGFuaW1hdGlvbi5cbiAgICAgICAgICogISN6aCDlvZPliY3mkq3mlL7nmoTliqjnlLvlkI3np7DjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtTdHJpbmd9IGFuaW1hdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgYW5pbWF0aW9uOiB7XG4gICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYW5pbWF0aW9uTmFtZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZW50cnkgPSB0aGlzLmdldEN1cnJlbnQoMCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoZW50cnkgJiYgZW50cnkuYW5pbWF0aW9uLm5hbWUpIHx8IFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdEFuaW1hdGlvbiA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFuaW1hdGlvbigwLCB2YWx1ZSwgdGhpcy5sb29wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIXRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsZWFyVHJhY2soMCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VG9TZXR1cFBvc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IF9kZWZhdWx0U2tpbkluZGV4XG4gICAgICAgICAqL1xuICAgICAgICBfZGVmYXVsdFNraW5JbmRleDoge1xuICAgICAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNrZWxldG9uRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2tpbnNFbnVtID0gdGhpcy5za2VsZXRvbkRhdGEuZ2V0U2tpbnNFbnVtKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChza2luc0VudW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlZmF1bHRTa2luID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNraW5zRW51bS5oYXNPd25Qcm9wZXJ0eSgwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWZhdWx0U2tpbkluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2tpbkluZGV4ID0gc2tpbnNFbnVtW3RoaXMuZGVmYXVsdFNraW5dO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChza2luSW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2tpbkluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2tpbnNFbnVtO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNrZWxldG9uRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBza2luc0VudW0gPSB0aGlzLnNrZWxldG9uRGF0YS5nZXRTa2luc0VudW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFza2luc0VudW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNjLmVycm9ySUQoJycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgc2tpbk5hbWUgPSBza2luc0VudW1bdmFsdWVdO1xuICAgICAgICAgICAgICAgIGlmIChza2luTmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdFNraW4gPSBza2luTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTa2luKHRoaXMuZGVmYXVsdFNraW4pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SICYmICFjYy5lbmdpbmUuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWZyZXNoSW5zcGVjdG9yKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoNzUwMSwgdGhpcy5uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogRGVmYXVsdFNraW5zRW51bSxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBcIkRlZmF1bHQgU2tpblwiLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5za2VsZXRvbi5kZWZhdWx0X3NraW4nXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gdmFsdWUgb2YgMCByZXByZXNlbnRzIG5vIGFuaW1hdGlvblxuICAgICAgICBfYW5pbWF0aW9uSW5kZXg6IHtcbiAgICAgICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYW5pbWF0aW9uTmFtZSA9ICghQ0NfRURJVE9SIHx8IGNjLmVuZ2luZS5pc1BsYXlpbmcpID8gdGhpcy5hbmltYXRpb24gOiB0aGlzLmRlZmF1bHRBbmltYXRpb247XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2tlbGV0b25EYXRhICYmIGFuaW1hdGlvbk5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuaW1zRW51bSA9IHRoaXMuc2tlbGV0b25EYXRhLmdldEFuaW1zRW51bSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5pbXNFbnVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYW5pbUluZGV4ID0gYW5pbXNFbnVtW2FuaW1hdGlvbk5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuaW1JbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFuaW1JbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb24gPSAnJztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgYW5pbXNFbnVtO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNrZWxldG9uRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBhbmltc0VudW0gPSB0aGlzLnNrZWxldG9uRGF0YS5nZXRBbmltc0VudW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFhbmltc0VudW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNjLmVycm9ySUQoNzUwMiwgdGhpcy5uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGFuaW1OYW1lID0gYW5pbXNFbnVtW3ZhbHVlXTtcbiAgICAgICAgICAgICAgICBpZiAoYW5pbU5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IGFuaW1OYW1lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3JJRCg3NTAzLCB0aGlzLm5hbWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IERlZmF1bHRBbmltc0VudW0sXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogJ0FuaW1hdGlvbicsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNrZWxldG9uLmFuaW1hdGlvbidcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBSZWNvcmQgcHJlIGNhY2hlIG1vZGUuXG4gICAgICAgIF9wcmVDYWNoZU1vZGU6IC0xLFxuICAgICAgICBfY2FjaGVNb2RlOiBBbmltYXRpb25DYWNoZU1vZGUuUkVBTFRJTUUsXG4gICAgICAgIF9kZWZhdWx0Q2FjaGVNb2RlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgdHlwZTogQW5pbWF0aW9uQ2FjaGVNb2RlLFxuICAgICAgICAgICAgbm90aWZ5KCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uQ2FjaGVNb2RlKHRoaXMuX2RlZmF1bHRDYWNoZU1vZGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVkaXRvck9ubHk6IHRydWUsXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogXCJBbmltYXRpb24gQ2FjaGUgTW9kZVwiLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5za2VsZXRvbi5hbmltYXRpb25fY2FjaGVfbW9kZSdcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUT0RPXG4gICAgICAgICAqICEjemgg5piv5ZCm5b6q546v5pKt5pS+5b2T5YmN6aqo6aq85Yqo55S744CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbG9vcFxuICAgICAgICAgKiBAZGVmYXVsdCB0cnVlXG4gICAgICAgICAqL1xuICAgICAgICBsb29wOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5za2VsZXRvbi5sb29wJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEluZGljYXRlcyB3aGV0aGVyIHRvIGVuYWJsZSBwcmVtdWx0aXBsaWVkIGFscGhhLlxuICAgICAgICAgKiBZb3Ugc2hvdWxkIGRpc2FibGUgdGhpcyBvcHRpb24gd2hlbiBpbWFnZSdzIHRyYW5zcGFyZW50IGFyZWEgYXBwZWFycyB0byBoYXZlIG9wYXF1ZSBwaXhlbHMsXG4gICAgICAgICAqIG9yIGVuYWJsZSB0aGlzIG9wdGlvbiB3aGVuIGltYWdlJ3MgaGFsZiB0cmFuc3BhcmVudCBhcmVhIGFwcGVhcnMgdG8gYmUgZGFya2VuLlxuICAgICAgICAgKiAhI3poIOaYr+WQpuWQr+eUqOi0tOWbvumihOS5mOOAglxuICAgICAgICAgKiDlvZPlm77niYfnmoTpgI/mmI7ljLrln5/lh7rnjrDoibLlnZfml7bpnIDopoHlhbPpl63or6XpgInpobnvvIzlvZPlm77niYfnmoTljYrpgI/mmI7ljLrln5/popzoibLlj5jpu5Hml7bpnIDopoHlkK/nlKjor6XpgInpobnjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBwcmVtdWx0aXBsaWVkQWxwaGFcbiAgICAgICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAgICAgKi9cbiAgICAgICAgcHJlbXVsdGlwbGllZEFscGhhOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5za2VsZXRvbi5wcmVtdWx0aXBsaWVkQWxwaGEnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHRpbWUgc2NhbGUgb2YgdGhpcyBza2VsZXRvbi5cbiAgICAgICAgICogISN6aCDlvZPliY3pqqjpqrzkuK3miYDmnInliqjnlLvnmoTml7bpl7TnvKnmlL7njofjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHRpbWVTY2FsZVxuICAgICAgICAgKiBAZGVmYXVsdCAxXG4gICAgICAgICAqL1xuICAgICAgICB0aW1lU2NhbGU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDEsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNrZWxldG9uLnRpbWVfc2NhbGUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSW5kaWNhdGVzIHdoZXRoZXIgb3BlbiBkZWJ1ZyBzbG90cy5cbiAgICAgICAgICogISN6aCDmmK/lkKbmmL7npLogc2xvdCDnmoQgZGVidWcg5L+h5oGv44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZGVidWdTbG90c1xuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgZGVidWdTbG90czoge1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgICBlZGl0b3JPbmx5OiB0cnVlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5za2VsZXRvbi5kZWJ1Z19zbG90cycsXG4gICAgICAgICAgICBub3RpZnkoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlRGVidWdEcmF3KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSW5kaWNhdGVzIHdoZXRoZXIgb3BlbiBkZWJ1ZyBib25lcy5cbiAgICAgICAgICogISN6aCDmmK/lkKbmmL7npLogYm9uZSDnmoQgZGVidWcg5L+h5oGv44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZGVidWdCb25lc1xuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgZGVidWdCb25lczoge1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgICBlZGl0b3JPbmx5OiB0cnVlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5za2VsZXRvbi5kZWJ1Z19ib25lcycsXG4gICAgICAgICAgICBub3RpZnkoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlRGVidWdEcmF3KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSW5kaWNhdGVzIHdoZXRoZXIgb3BlbiBkZWJ1ZyBtZXNoLlxuICAgICAgICAgKiAhI3poIOaYr+WQpuaYvuekuiBtZXNoIOeahCBkZWJ1ZyDkv6Hmga/jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBkZWJ1Z01lc2hcbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIGRlYnVnTWVzaDoge1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgICBlZGl0b3JPbmx5OiB0cnVlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5za2VsZXRvbi5kZWJ1Z19tZXNoJyxcbiAgICAgICAgICAgIG5vdGlmeSgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVEZWJ1Z0RyYXcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBFbmFibGVkIHR3byBjb2xvciB0aW50LlxuICAgICAgICAgKiAhI3poIOaYr+WQpuWQr+eUqOafk+iJsuaViOaenOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IHVzZVRpbnRcbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIHVzZVRpbnQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5za2VsZXRvbi51c2VfdGludCcsXG4gICAgICAgICAgICBub3RpZnkoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlVXNlVGludCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEVuYWJsZWQgYmF0Y2ggbW9kZWwsIGlmIHNrZWxldG9uIGlzIGNvbXBsZXgsIGRvIG5vdCBlbmFibGUgYmF0Y2gsIG9yIHdpbGwgbG93ZXIgcGVyZm9ybWFuY2UuXG4gICAgICAgICAqICEjemgg5byA5ZCv5ZCI5om577yM5aaC5p6c5riy5p+T5aSn6YeP55u45ZCM57q555CG77yM5LiU57uT5p6E566A5Y2V55qE6aqo6aq85Yqo55S777yM5byA5ZCv5ZCI5om55Y+v5Lul6ZmN5L2OZHJhd2NhbGzvvIzlkKbliJnor7fkuI3opoHlvIDlkK/vvIxjcHXmtojogJfkvJrkuIrljYfjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBlbmFibGVCYXRjaFxuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgZW5hYmxlQmF0Y2g6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgbm90aWZ5KCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUJhdGNoKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5za2VsZXRvbi5lbmFibGVkX2JhdGNoJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIEJlbG93IHByb3BlcnRpZXMgd2lsbCBlZmZlY3Qgd2hlbiBjYWNoZSBtb2RlIGlzIFNIQVJFRF9DQUNIRSBvciBQUklWQVRFX0NBQ0hFLlxuICAgICAgICAvLyBhY2N1bXVsYXRlIHRpbWVcbiAgICAgICAgX2FjY1RpbWU6IDAsXG4gICAgICAgIC8vIFBsYXkgdGltZXMgY291bnRlclxuICAgICAgICBfcGxheUNvdW50OiAwLFxuICAgICAgICAvLyBGcmFtZSBjYWNoZVxuICAgICAgICBfZnJhbWVDYWNoZTogbnVsbCxcbiAgICAgICAgLy8gQ3VyIGZyYW1lXG4gICAgICAgIF9jdXJGcmFtZTogbnVsbCxcbiAgICAgICAgLy8gU2tlbGV0b24gY2FjaGVcbiAgICAgICAgX3NrZWxldG9uQ2FjaGU6IG51bGwsXG4gICAgICAgIC8vIEFpbWF0aW9uIG5hbWVcbiAgICAgICAgX2FuaW1hdGlvbk5hbWU6IFwiXCIsXG4gICAgICAgIC8vIEFuaW1hdGlvbiBxdWV1ZVxuICAgICAgICBfYW5pbWF0aW9uUXVldWU6IFtdLFxuICAgICAgICAvLyBIZWFkIGFuaW1hdGlvbiBpbmZvIG9mIFxuICAgICAgICBfaGVhZEFuaUluZm86IG51bGwsXG4gICAgICAgIC8vIFBsYXkgdGltZXNcbiAgICAgICAgX3BsYXlUaW1lczogMCxcbiAgICAgICAgLy8gSXMgYW5pbWF0aW9uIGNvbXBsZXRlLlxuICAgICAgICBfaXNBbmlDb21wbGV0ZTogdHJ1ZSxcbiAgICB9LFxuXG4gICAgLy8gQ09OU1RSVUNUT1JcbiAgICBjdG9yKCkge1xuICAgICAgICB0aGlzLl9lZmZlY3REZWxlZ2F0ZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX3NrZWxldG9uID0gbnVsbDtcbiAgICAgICAgdGhpcy5fcm9vdEJvbmUgPSBudWxsO1xuICAgICAgICB0aGlzLl9saXN0ZW5lciA9IG51bGw7XG4gICAgICAgIHRoaXMuX21hdGVyaWFsQ2FjaGUgPSB7fTtcbiAgICAgICAgdGhpcy5fZGVidWdSZW5kZXJlciA9IG51bGw7XG4gICAgICAgIHRoaXMuX3N0YXJ0U2xvdEluZGV4ID0gLTE7XG4gICAgICAgIHRoaXMuX2VuZFNsb3RJbmRleCA9IC0xO1xuICAgICAgICB0aGlzLl9zdGFydEVudHJ5ID0geyBhbmltYXRpb246IHsgbmFtZTogXCJcIiB9LCB0cmFja0luZGV4OiAwIH07XG4gICAgICAgIHRoaXMuX2VuZEVudHJ5ID0geyBhbmltYXRpb246IHsgbmFtZTogXCJcIiB9LCB0cmFja0luZGV4OiAwIH07XG4gICAgICAgIHRoaXMuYXR0YWNoVXRpbCA9IG5ldyBBdHRhY2hVdGlsKCk7XG4gICAgfSxcblxuICAgIC8vIG92ZXJyaWRlIGJhc2UgY2xhc3MgX2dldERlZmF1bHRNYXRlcmlhbCB0byBtb2RpZnkgZGVmYXVsdCBtYXRlcmlhbFxuICAgIF9nZXREZWZhdWx0TWF0ZXJpYWwoKSB7XG4gICAgICAgIHJldHVybiBjYy5NYXRlcmlhbC5nZXRCdWlsdGluTWF0ZXJpYWwoJzJkLXNwaW5lJyk7XG4gICAgfSxcblxuICAgIC8vIG92ZXJyaWRlIGJhc2UgY2xhc3MgX3VwZGF0ZU1hdGVyaWFsIHRvIHNldCBkZWZpbmUgdmFsdWUgYW5kIGNsZWFyIG1hdGVyaWFsIGNhY2hlXG4gICAgX3VwZGF0ZU1hdGVyaWFsKCkge1xuICAgICAgICBsZXQgdXNlVGludCA9IHRoaXMudXNlVGludCB8fCAodGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpICYmICFDQ19OQVRJVkVSRU5ERVJFUik7XG4gICAgICAgIGxldCBiYXNlTWF0ZXJpYWwgPSB0aGlzLmdldE1hdGVyaWFsKDApO1xuICAgICAgICBpZiAoYmFzZU1hdGVyaWFsKSB7XG4gICAgICAgICAgICBiYXNlTWF0ZXJpYWwuZGVmaW5lKCdVU0VfVElOVCcsIHVzZVRpbnQpO1xuICAgICAgICAgICAgYmFzZU1hdGVyaWFsLmRlZmluZSgnQ0NfVVNFX01PREVMJywgIXRoaXMuZW5hYmxlQmF0Y2gpO1xuXG4gICAgICAgICAgICBsZXQgc3JjQmxlbmRGYWN0b3IgPSB0aGlzLnByZW11bHRpcGxpZWRBbHBoYSA/IGNjLmdmeC5CTEVORF9PTkUgOiBjYy5nZnguQkxFTkRfU1JDX0FMUEhBO1xuICAgICAgICAgICAgbGV0IGRzdEJsZW5kRmFjdG9yID0gY2MuZ2Z4LkJMRU5EX09ORV9NSU5VU19TUkNfQUxQSEE7XG5cbiAgICAgICAgICAgIGJhc2VNYXRlcmlhbC5zZXRCbGVuZChcbiAgICAgICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgICAgIGNjLmdmeC5CTEVORF9GVU5DX0FERCxcbiAgICAgICAgICAgICAgICBzcmNCbGVuZEZhY3Rvciwgc3JjQmxlbmRGYWN0b3IsXG4gICAgICAgICAgICAgICAgY2MuZ2Z4LkJMRU5EX0ZVTkNfQURELFxuICAgICAgICAgICAgICAgIGRzdEJsZW5kRmFjdG9yLCBkc3RCbGVuZEZhY3RvclxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tYXRlcmlhbENhY2hlID0ge307XG4gICAgfSxcblxuICAgIC8vIG92ZXJyaWRlIGJhc2UgY2xhc3MgZGlzYWJsZVJlbmRlciB0byBjbGVhciBwb3N0IHJlbmRlciBmbGFnXG4gICAgZGlzYWJsZVJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgdGhpcy5ub2RlLl9yZW5kZXJGbGFnICY9IH5GTEFHX1BPU1RfUkVOREVSO1xuICAgIH0sXG5cbiAgICAvLyBvdmVycmlkZSBiYXNlIGNsYXNzIGRpc2FibGVSZW5kZXIgdG8gYWRkIHBvc3QgcmVuZGVyIGZsYWdcbiAgICBtYXJrRm9yUmVuZGVyKGVuYWJsZSkge1xuICAgICAgICB0aGlzLl9zdXBlcihlbmFibGUpO1xuICAgICAgICBpZiAoZW5hYmxlKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUuX3JlbmRlckZsYWcgfD0gRkxBR19QT1NUX1JFTkRFUjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5fcmVuZGVyRmxhZyAmPSB+RkxBR19QT1NUX1JFTkRFUjtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBpZiBjaGFuZ2UgdXNlIHRpbnQgbW9kZSwganVzdCBjbGVhciBtYXRlcmlhbCBjYWNoZVxuICAgIF91cGRhdGVVc2VUaW50KCkge1xuICAgICAgICBsZXQgYmFzZU1hdGVyaWFsID0gdGhpcy5nZXRNYXRlcmlhbCgwKTtcbiAgICAgICAgaWYgKGJhc2VNYXRlcmlhbCkge1xuICAgICAgICAgICAgbGV0IHVzZVRpbnQgPSB0aGlzLnVzZVRpbnQgfHwgKHRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSAmJiAhQ0NfTkFUSVZFUkVOREVSRVIpO1xuICAgICAgICAgICAgYmFzZU1hdGVyaWFsLmRlZmluZSgnVVNFX1RJTlQnLCB1c2VUaW50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tYXRlcmlhbENhY2hlID0ge307XG4gICAgfSxcblxuICAgIC8vIGlmIGNoYW5nZSB1c2UgYmF0Y2ggbW9kZSwganVzdCBjbGVhciBtYXRlcmlhbCBjYWNoZVxuICAgIF91cGRhdGVCYXRjaCgpIHtcbiAgICAgICAgbGV0IGJhc2VNYXRlcmlhbCA9IHRoaXMuZ2V0TWF0ZXJpYWwoMCk7XG4gICAgICAgIGlmIChiYXNlTWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIGJhc2VNYXRlcmlhbC5kZWZpbmUoJ0NDX1VTRV9NT0RFTCcsICF0aGlzLmVuYWJsZUJhdGNoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tYXRlcmlhbENhY2hlID0ge307XG4gICAgfSxcblxuICAgIF92YWxpZGF0ZVJlbmRlcigpIHtcbiAgICAgICAgbGV0IHNrZWxldG9uRGF0YSA9IHRoaXMuc2tlbGV0b25EYXRhO1xuICAgICAgICBpZiAoIXNrZWxldG9uRGF0YSB8fCAhc2tlbGV0b25EYXRhLmlzVGV4dHVyZXNMb2FkZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlUmVuZGVyKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldHMgcnVudGltZSBza2VsZXRvbiBkYXRhIHRvIHNwLlNrZWxldG9uLjxicj5cbiAgICAgKiBUaGlzIG1ldGhvZCBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgYHNrZWxldG9uRGF0YWAgcHJvcGVydHkuIFRoaXMgbWV0aG9kIGlzIHBhc3NlZCBpbiB0aGUgcmF3IGRhdGEgcHJvdmlkZWQgYnkgdGhlIFNwaW5lIHJ1bnRpbWUsIGFuZCB0aGUgc2tlbGV0b25EYXRhIHR5cGUgaXMgdGhlIGFzc2V0IHR5cGUgcHJvdmlkZWQgYnkgQ3JlYXRvci5cbiAgICAgKiAhI3poXG4gICAgICog6K6+572u5bqV5bGC6L+Q6KGM5pe255So5Yiw55qEIFNrZWxldG9uRGF0YeOAgjxicj5cbiAgICAgKiDov5nkuKrmjqXlj6PmnInliKvkuo4gYHNrZWxldG9uRGF0YWAg5bGe5oCn77yM6L+Z5Liq5o6l5Y+j5Lyg5YWl55qE5pivIFNwaW5lIHJ1bnRpbWUg5o+Q5L6b55qE5Y6f5aeL5pWw5o2u77yM6ICMIHNrZWxldG9uRGF0YSDnmoTnsbvlnovmmK8gQ3JlYXRvciDmj5DkvpvnmoTotYTmupDnsbvlnovjgIJcbiAgICAgKiBAbWV0aG9kIHNldFNrZWxldG9uRGF0YVxuICAgICAqIEBwYXJhbSB7c3Auc3BpbmUuU2tlbGV0b25EYXRhfSBza2VsZXRvbkRhdGFcbiAgICAgKi9cbiAgICBzZXRTa2VsZXRvbkRhdGEoc2tlbGV0b25EYXRhKSB7XG4gICAgICAgIGlmIChza2VsZXRvbkRhdGEud2lkdGggIT0gbnVsbCAmJiBza2VsZXRvbkRhdGEuaGVpZ2h0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5zZXRDb250ZW50U2l6ZShza2VsZXRvbkRhdGEud2lkdGgsIHNrZWxldG9uRGF0YS5oZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jYWNoZU1vZGUgPT09IEFuaW1hdGlvbkNhY2hlTW9kZS5TSEFSRURfQ0FDSEUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9za2VsZXRvbkNhY2hlID0gU2tlbGV0b25DYWNoZS5zaGFyZWRDYWNoZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fY2FjaGVNb2RlID09PSBBbmltYXRpb25DYWNoZU1vZGUuUFJJVkFURV9DQUNIRSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NrZWxldG9uQ2FjaGUgPSBuZXcgU2tlbGV0b25DYWNoZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9za2VsZXRvbkNhY2hlLmVuYWJsZVByaXZhdGVNb2RlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kZWJ1Z0JvbmVzIHx8IHRoaXMuZGVidWdTbG90cykge1xuICAgICAgICAgICAgICAgIGNjLndhcm4oXCJEZWJ1ZyBib25lcyBvciBzbG90cyBpcyBpbnZhbGlkIGluIGNhY2hlZCBtb2RlXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL3dhbmdjaGVuZ1xuICAgICAgICAgICAgbGV0IGNhY2hlS2V5ID0gdGhpcy5nZXRDYWNoZUtleSgpO1xuICAgICAgICAgICAgbGV0IHNrZWxldG9uSW5mbyA9IHRoaXMuX3NrZWxldG9uQ2FjaGUuZ2V0U2tlbGV0b25DYWNoZShjYWNoZUtleSwgc2tlbGV0b25EYXRhKTtcbiAgICAgICAgICAgIC8vIGxldCBza2VsZXRvbkluZm8gPSB0aGlzLl9za2VsZXRvbkNhY2hlLmdldFNrZWxldG9uQ2FjaGUoc2tlbGV0b25EYXRhLl91dWlkLCBza2VsZXRvbkRhdGEpO1xuXG4gICAgICAgICAgICB0aGlzLl9za2VsZXRvbiA9IHNrZWxldG9uSW5mby5za2VsZXRvbjtcbiAgICAgICAgICAgIHRoaXMuX2NsaXBwZXIgPSBza2VsZXRvbkluZm8uY2xpcHBlcjtcbiAgICAgICAgICAgIHRoaXMuX3Jvb3RCb25lID0gdGhpcy5fc2tlbGV0b24uZ2V0Um9vdEJvbmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3NrZWxldG9uID0gbmV3IHNwaW5lLlNrZWxldG9uKHNrZWxldG9uRGF0YSk7XG4gICAgICAgICAgICB0aGlzLl9jbGlwcGVyID0gbmV3IHNwaW5lLlNrZWxldG9uQ2xpcHBpbmcoKTtcbiAgICAgICAgICAgIHRoaXMuX3Jvb3RCb25lID0gdGhpcy5fc2tlbGV0b24uZ2V0Um9vdEJvbmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWFya0ZvclJlbmRlcih0cnVlKTtcbiAgICB9LFxuXG4gICAgLy93YW5nY2hlbmdcbiAgICBnZXRDYWNoZUtleSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NhY2hlTW9kZSA9PT0gQW5pbWF0aW9uQ2FjaGVNb2RlLlNIQVJFRF9DQUNIRSkge1xuICAgICAgICAgICAgbGV0IHNraW47XG4gICAgICAgICAgICBpZiAodGhpcy5fc2tlbGV0b24gJiYgdGhpcy5fc2tlbGV0b24uc2tpbikgc2tpbiA9IHRoaXMuX3NrZWxldG9uLnNraW4ubmFtZTtcbiAgICAgICAgICAgIGVsc2Ugc2tpbiA9IHRoaXMuZGVmYXVsdFNraW47XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNrZWxldG9uRGF0YS5fdXVpZCArIFwiX1wiICsgc2tpbjtcblxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2NhY2hlTW9kZSA9PT0gQW5pbWF0aW9uQ2FjaGVNb2RlLlBSSVZBVEVfQ0FDSEUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNrZWxldG9uRGF0YS5fdXVpZDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgc2xvdHMgdmlzaWJsZSByYW5nZS5cbiAgICAgKiAhI3poIOiuvue9rumqqOmqvOaPkuanveWPr+inhuiMg+WbtOOAglxuICAgICAqIEBtZXRob2Qgc2V0U2xvdHNSYW5nZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydFNsb3RJbmRleFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBlbmRTbG90SW5kZXhcbiAgICAgKi9cbiAgICBzZXRTbG90c1JhbmdlKHN0YXJ0U2xvdEluZGV4LCBlbmRTbG90SW5kZXgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkge1xuICAgICAgICAgICAgY2Mud2FybihcIlNsb3RzIHZpc2libGUgcmFuZ2UgY2FuIG5vdCBiZSBtb2RpZmllZCBpbiBjYWNoZWQgbW9kZS5cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9zdGFydFNsb3RJbmRleCA9IHN0YXJ0U2xvdEluZGV4O1xuICAgICAgICAgICAgdGhpcy5fZW5kU2xvdEluZGV4ID0gZW5kU2xvdEluZGV4O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0cyBhbmltYXRpb24gc3RhdGUgZGF0YS48YnI+XG4gICAgICogVGhlIHBhcmFtZXRlciB0eXBlIGlzIHt7I2Nyb3NzTGlua01vZHVsZSBcInNwLnNwaW5lXCJ9fXNwLnNwaW5le3svY3Jvc3NMaW5rTW9kdWxlfX0uQW5pbWF0aW9uU3RhdGVEYXRhLlxuICAgICAqICEjemgg6K6+572u5Yqo55S754q25oCB5pWw5o2u44CCPGJyPlxuICAgICAqIOWPguaVsOaYryB7eyNjcm9zc0xpbmtNb2R1bGUgXCJzcC5zcGluZVwifX1zcC5zcGluZXt7L2Nyb3NzTGlua01vZHVsZX19LkFuaW1hdGlvblN0YXRlRGF0YeOAglxuICAgICAqIEBtZXRob2Qgc2V0QW5pbWF0aW9uU3RhdGVEYXRhXG4gICAgICogQHBhcmFtIHtzcC5zcGluZS5BbmltYXRpb25TdGF0ZURhdGF9IHN0YXRlRGF0YVxuICAgICAqL1xuICAgIHNldEFuaW1hdGlvblN0YXRlRGF0YShzdGF0ZURhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkge1xuICAgICAgICAgICAgY2Mud2FybihcIidzZXRBbmltYXRpb25TdGF0ZURhdGEnIGludGVyZmFjZSBjYW4gbm90IGJlIGludm9rZWQgaW4gY2FjaGVkIG1vZGUuXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHN0YXRlID0gbmV3IHNwaW5lLkFuaW1hdGlvblN0YXRlKHN0YXRlRGF0YSk7XG4gICAgICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUucmVtb3ZlTGlzdGVuZXIodGhpcy5fbGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRMaXN0ZW5lcih0aGlzLl9saXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gSU1QTEVNRU5UXG4gICAgX19wcmVsb2FkKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB2YXIgRmxhZ3MgPSBjYy5PYmplY3QuRmxhZ3M7XG4gICAgICAgICAgICB0aGlzLl9vYmpGbGFncyB8PSAoRmxhZ3MuSXNBbmNob3JMb2NrZWQgfCBGbGFncy5Jc1NpemVMb2NrZWQpO1xuXG4gICAgICAgICAgICB0aGlzLl9yZWZyZXNoSW5zcGVjdG9yKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLm5vZGUuY2hpbGRyZW47XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChjaGlsZCAmJiBjaGlsZC5fbmFtZSA9PT0gXCJERUJVR19EUkFXX05PREVcIikge1xuICAgICAgICAgICAgICAgIGNoaWxkLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3VwZGF0ZVNrZWxldG9uRGF0YSgpO1xuICAgICAgICB0aGlzLl91cGRhdGVEZWJ1Z0RyYXcoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlVXNlVGludCgpO1xuICAgICAgICB0aGlzLl91cGRhdGVCYXRjaCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogSXQncyBiZXN0IHRvIHNldCBjYWNoZSBtb2RlIGJlZm9yZSBzZXQgcHJvcGVydHkgJ2RyYWdvbkFzc2V0Jywgb3Igd2lsbCB3YXN0ZSBzb21lIGNwdSB0aW1lLlxuICAgICAqIElmIHNldCB0aGUgbW9kZSBpbiBlZGl0b3IsIHRoZW4gbm8gbmVlZCB0byB3b3JyeSBhYm91dCBvcmRlciBwcm9ibGVtLlxuICAgICAqICEjemggXG4gICAgICog6Iul5oOz5YiH5o2i5riy5p+T5qih5byP77yM5pyA5aW95Zyo6K6+572uJ2RyYWdvbkFzc2V0J+S5i+WJje+8jOWFiOiuvue9ruWlvea4suafk+aooeW8j++8jOWQpuWImeaciei/kOihjOaXtuW8gOmUgOOAglxuICAgICAqIOiLpeWcqOe8lui+keS4reiuvue9rua4suafk+aooeW8j++8jOWImeaXoOmcgOaLheW/g+iuvue9ruasoeW6j+eahOmXrumimOOAglxuICAgICAqIFxuICAgICAqIEBtZXRob2Qgc2V0QW5pbWF0aW9uQ2FjaGVNb2RlXG4gICAgICogQHBhcmFtIHtBbmltYXRpb25DYWNoZU1vZGV9IGNhY2hlTW9kZVxuICAgICAqIEBleGFtcGxlXG4gICAgICogc2tlbGV0b24uc2V0QW5pbWF0aW9uQ2FjaGVNb2RlKHNwLlNrZWxldG9uLkFuaW1hdGlvbkNhY2hlTW9kZS5TSEFSRURfQ0FDSEUpO1xuICAgICAqL1xuICAgIHNldEFuaW1hdGlvbkNhY2hlTW9kZShjYWNoZU1vZGUpIHtcbiAgICAgICAgaWYgKHRoaXMuX3ByZUNhY2hlTW9kZSAhPT0gY2FjaGVNb2RlKSB7XG4gICAgICAgICAgICB0aGlzLl9jYWNoZU1vZGUgPSBjYWNoZU1vZGU7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVTa2VsZXRvbkRhdGEoKTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVVzZVRpbnQoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFdoZXRoZXIgaW4gY2FjaGVkIG1vZGUuXG4gICAgICogISN6aCDlvZPliY3mmK/lkKblpITkuo7nvJPlrZjmqKHlvI/jgIJcbiAgICAgKiBAbWV0aG9kIGlzQW5pbWF0aW9uQ2FjaGVkXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpc0FuaW1hdGlvbkNhY2hlZCgpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUikgcmV0dXJuIGZhbHNlO1xuICAgICAgICByZXR1cm4gdGhpcy5fY2FjaGVNb2RlICE9PSBBbmltYXRpb25DYWNoZU1vZGUuUkVBTFRJTUU7XG4gICAgfSxcblxuICAgIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAoQ0NfRURJVE9SKSByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLnBhdXNlZCkgcmV0dXJuO1xuXG4gICAgICAgIGR0ICo9IHRoaXMudGltZVNjYWxlICogc3AudGltZVNjYWxlO1xuXG4gICAgICAgIGlmICh0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHtcblxuICAgICAgICAgICAgLy8gQ2FjaGUgbW9kZSBhbmQgaGFzIGFuaW1hdGlvbiBxdWV1ZS5cbiAgICAgICAgICAgIGlmICh0aGlzLl9pc0FuaUNvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2FuaW1hdGlvblF1ZXVlLmxlbmd0aCA9PT0gMCAmJiAhdGhpcy5faGVhZEFuaUluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZyYW1lQ2FjaGUgPSB0aGlzLl9mcmFtZUNhY2hlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZnJhbWVDYWNoZSAmJiBmcmFtZUNhY2hlLmlzSW52YWxpZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcmFtZUNhY2hlLnVwZGF0ZVRvRnJhbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmcmFtZXMgPSBmcmFtZUNhY2hlLmZyYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1ckZyYW1lID0gZnJhbWVzW2ZyYW1lcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5faGVhZEFuaUluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faGVhZEFuaUluZm8gPSB0aGlzLl9hbmltYXRpb25RdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9hY2NUaW1lICs9IGR0O1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hY2NUaW1lID4gdGhpcy5faGVhZEFuaUluZm8uZGVsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFuaUluZm8gPSB0aGlzLl9oZWFkQW5pSW5mbztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faGVhZEFuaUluZm8gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFuaW1hdGlvbigwLCBhbmlJbmZvLmFuaW1hdGlvbk5hbWUsIGFuaUluZm8ubG9vcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ2FjaGUoZHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmVhbHRpbWUoZHQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9lbWl0Q2FjaGVDb21wbGV0ZUV2ZW50KCkge1xuICAgICAgICBpZiAoIXRoaXMuX2xpc3RlbmVyKSByZXR1cm47XG4gICAgICAgIHRoaXMuX2VuZEVudHJ5LmFuaW1hdGlvbi5uYW1lID0gdGhpcy5fYW5pbWF0aW9uTmFtZTtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIuY29tcGxldGUgJiYgdGhpcy5fbGlzdGVuZXIuY29tcGxldGUodGhpcy5fZW5kRW50cnkpO1xuICAgICAgICB0aGlzLl9saXN0ZW5lci5lbmQgJiYgdGhpcy5fbGlzdGVuZXIuZW5kKHRoaXMuX2VuZEVudHJ5KTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZUNhY2hlKGR0KSB7XG4gICAgICAgIGxldCBmcmFtZUNhY2hlID0gdGhpcy5fZnJhbWVDYWNoZTtcbiAgICAgICAgaWYgKCFmcmFtZUNhY2hlLmlzSW5pdGVkKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZnJhbWVzID0gZnJhbWVDYWNoZS5mcmFtZXM7XG4gICAgICAgIGxldCBmcmFtZVRpbWUgPSBTa2VsZXRvbkNhY2hlLkZyYW1lVGltZTtcblxuICAgICAgICAvLyBBbmltYXRpb24gU3RhcnQsIHRoZSBldmVudCBkaWZmcmVudCBmcm9tIGRyYWdvbmJvbmVzIGlubmVyIGV2ZW50LFxuICAgICAgICAvLyBJdCBoYXMgbm8gZXZlbnQgb2JqZWN0LlxuICAgICAgICBpZiAodGhpcy5fYWNjVGltZSA9PSAwICYmIHRoaXMuX3BsYXlDb3VudCA9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGFydEVudHJ5LmFuaW1hdGlvbi5uYW1lID0gdGhpcy5fYW5pbWF0aW9uTmFtZTtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyICYmIHRoaXMuX2xpc3RlbmVyLnN0YXJ0ICYmIHRoaXMuX2xpc3RlbmVyLnN0YXJ0KHRoaXMuX3N0YXJ0RW50cnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fYWNjVGltZSArPSBkdDtcbiAgICAgICAgbGV0IGZyYW1lSWR4ID0gTWF0aC5mbG9vcih0aGlzLl9hY2NUaW1lIC8gZnJhbWVUaW1lKTtcbiAgICAgICAgaWYgKCFmcmFtZUNhY2hlLmlzQ29tcGxldGVkKSB7XG4gICAgICAgICAgICBmcmFtZUNhY2hlLnVwZGF0ZVRvRnJhbWUoZnJhbWVJZHgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZyYW1lQ2FjaGUuaXNDb21wbGV0ZWQgJiYgZnJhbWVJZHggPj0gZnJhbWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5fcGxheUNvdW50Kys7XG4gICAgICAgICAgICBpZiAodGhpcy5fcGxheVRpbWVzID4gMCAmJiB0aGlzLl9wbGF5Q291bnQgPj0gdGhpcy5fcGxheVRpbWVzKSB7XG4gICAgICAgICAgICAgICAgLy8gc2V0IGZyYW1lIHRvIGVuZCBmcmFtZS5cbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJGcmFtZSA9IGZyYW1lc1tmcmFtZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgdGhpcy5fYWNjVGltZSA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGxheUNvdW50ID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0FuaUNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbWl0Q2FjaGVDb21wbGV0ZUV2ZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fYWNjVGltZSA9IDA7XG4gICAgICAgICAgICBmcmFtZUlkeCA9IDA7XG4gICAgICAgICAgICB0aGlzLl9lbWl0Q2FjaGVDb21wbGV0ZUV2ZW50KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY3VyRnJhbWUgPSBmcmFtZXNbZnJhbWVJZHhdO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlUmVhbHRpbWUoZHQpIHtcbiAgICAgICAgbGV0IHNrZWxldG9uID0gdGhpcy5fc2tlbGV0b247XG4gICAgICAgIGxldCBzdGF0ZSA9IHRoaXMuX3N0YXRlO1xuICAgICAgICBpZiAoc2tlbGV0b24pIHtcbiAgICAgICAgICAgIHNrZWxldG9uLnVwZGF0ZShkdCk7XG4gICAgICAgICAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS51cGRhdGUoZHQpO1xuICAgICAgICAgICAgICAgIHN0YXRlLmFwcGx5KHNrZWxldG9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgdmVydGV4IGVmZmVjdCBkZWxlZ2F0ZS5cbiAgICAgKiAhI3poIOiuvue9rumhtueCueWKqOeUu+S7o+eQhlxuICAgICAqIEBtZXRob2Qgc2V0VmVydGV4RWZmZWN0RGVsZWdhdGVcbiAgICAgKiBAcGFyYW0ge3NwLlZlcnRleEVmZmVjdERlbGVnYXRlfSBlZmZlY3REZWxlZ2F0ZVxuICAgICAqL1xuICAgIHNldFZlcnRleEVmZmVjdERlbGVnYXRlKGVmZmVjdERlbGVnYXRlKSB7XG4gICAgICAgIHRoaXMuX2VmZmVjdERlbGVnYXRlID0gZWZmZWN0RGVsZWdhdGU7XG4gICAgfSxcblxuICAgIC8vIFJFTkRFUkVSXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENvbXB1dGVzIHRoZSB3b3JsZCBTUlQgZnJvbSB0aGUgbG9jYWwgU1JUIGZvciBlYWNoIGJvbmUuXG4gICAgICogISN6aCDph43mlrDmm7TmlrDmiYDmnInpqqjpqrznmoTkuJbnlYwgVHJhbnNmb3Jt77yMXG4gICAgICog5b2T6I635Y+WIGJvbmUg55qE5pWw5YC85pyq5pu05paw5pe277yM5Y2z5Y+v5L2/55So6K+l5Ye95pWw6L+b6KGM5pu05paw5pWw5YC844CCXG4gICAgICogQG1ldGhvZCB1cGRhdGVXb3JsZFRyYW5zZm9ybVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGJvbmUgPSBzcGluZS5maW5kQm9uZSgnaGVhZCcpO1xuICAgICAqIGNjLmxvZyhib25lLndvcmxkWCk7IC8vIHJldHVybiAwO1xuICAgICAqIHNwaW5lLnVwZGF0ZVdvcmxkVHJhbnNmb3JtKCk7XG4gICAgICogYm9uZSA9IHNwaW5lLmZpbmRCb25lKCdoZWFkJyk7XG4gICAgICogY2MubG9nKGJvbmUud29ybGRYKTsgLy8gcmV0dXJuIC0yMy4xMjtcbiAgICAgKi9cbiAgICB1cGRhdGVXb3JsZFRyYW5zZm9ybSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHJldHVybjtcblxuICAgICAgICBpZiAodGhpcy5fc2tlbGV0b24pIHtcbiAgICAgICAgICAgIHRoaXMuX3NrZWxldG9uLnVwZGF0ZVdvcmxkVHJhbnNmb3JtKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXRzIHRoZSBib25lcyBhbmQgc2xvdHMgdG8gdGhlIHNldHVwIHBvc2UuXG4gICAgICogISN6aCDov5jljp/liLDotbflp4vliqjkvZxcbiAgICAgKiBAbWV0aG9kIHNldFRvU2V0dXBQb3NlXG4gICAgICovXG4gICAgc2V0VG9TZXR1cFBvc2UoKSB7XG4gICAgICAgIGlmICh0aGlzLl9za2VsZXRvbikge1xuICAgICAgICAgICAgdGhpcy5fc2tlbGV0b24uc2V0VG9TZXR1cFBvc2UoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0cyB0aGUgYm9uZXMgdG8gdGhlIHNldHVwIHBvc2UsXG4gICAgICogdXNpbmcgdGhlIHZhbHVlcyBmcm9tIHRoZSBgQm9uZURhdGFgIGxpc3QgaW4gdGhlIGBTa2VsZXRvbkRhdGFgLlxuICAgICAqICEjemhcbiAgICAgKiDorr7nva4gYm9uZSDliLDotbflp4vliqjkvZxcbiAgICAgKiDkvb/nlKggU2tlbGV0b25EYXRhIOS4reeahCBCb25lRGF0YSDliJfooajkuK3nmoTlgLzjgIJcbiAgICAgKiBAbWV0aG9kIHNldEJvbmVzVG9TZXR1cFBvc2VcbiAgICAgKi9cbiAgICBzZXRCb25lc1RvU2V0dXBQb3NlKCkge1xuICAgICAgICBpZiAodGhpcy5fc2tlbGV0b24pIHtcbiAgICAgICAgICAgIHRoaXMuX3NrZWxldG9uLnNldEJvbmVzVG9TZXR1cFBvc2UoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0cyB0aGUgc2xvdHMgdG8gdGhlIHNldHVwIHBvc2UsXG4gICAgICogdXNpbmcgdGhlIHZhbHVlcyBmcm9tIHRoZSBgU2xvdERhdGFgIGxpc3QgaW4gdGhlIGBTa2VsZXRvbkRhdGFgLlxuICAgICAqICEjemhcbiAgICAgKiDorr7nva4gc2xvdCDliLDotbflp4vliqjkvZzjgIJcbiAgICAgKiDkvb/nlKggU2tlbGV0b25EYXRhIOS4reeahCBTbG90RGF0YSDliJfooajkuK3nmoTlgLzjgIJcbiAgICAgKiBAbWV0aG9kIHNldFNsb3RzVG9TZXR1cFBvc2VcbiAgICAgKi9cbiAgICBzZXRTbG90c1RvU2V0dXBQb3NlKCkge1xuICAgICAgICBpZiAodGhpcy5fc2tlbGV0b24pIHtcbiAgICAgICAgICAgIHRoaXMuX3NrZWxldG9uLnNldFNsb3RzVG9TZXR1cFBvc2UoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVXBkYXRpbmcgYW4gYW5pbWF0aW9uIGNhY2hlIHRvIGNhbGN1bGF0ZSBhbGwgZnJhbWUgZGF0YSBpbiB0aGUgYW5pbWF0aW9uIGlzIGEgY29zdCBpbiBcbiAgICAgKiBwZXJmb3JtYW5jZSBkdWUgdG8gY2FsY3VsYXRpbmcgYWxsIGRhdGEgaW4gYSBzaW5nbGUgZnJhbWUuXG4gICAgICogVG8gdXBkYXRlIHRoZSBjYWNoZSwgdXNlIHRoZSBpbnZhbGlkQW5pbWF0aW9uQ2FjaGUgbWV0aG9kIHdpdGggaGlnaCBwZXJmb3JtYW5jZS5cbiAgICAgKiAhI3poXG4gICAgICog5pu05paw5p+Q5Liq5Yqo55S757yT5a2YLCDpooTorqHnrpfliqjnlLvkuK3miYDmnInluKfmlbDmja7vvIznlLHkuo7lnKjljZXluKforqHnrpfmiYDmnInmlbDmja7vvIzmiYDku6XovoPmtojogJfmgKfog73jgIJcbiAgICAgKiDoi6Xmg7Pmm7TmlrDnvJPlrZjvvIzlj6/kvb/nlKggaW52YWxpZEFuaW1hdGlvbkNhY2hlIOaWueazle+8jOWFt+aciei+g+mrmOaAp+iDveOAglxuICAgICAqIEBtZXRob2QgdXBkYXRlQW5pbWF0aW9uQ2FjaGVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYW5pbU5hbWVcbiAgICAgKi9cbiAgICB1cGRhdGVBbmltYXRpb25DYWNoZShhbmltTmFtZSkge1xuICAgICAgICBpZiAoIXRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkgcmV0dXJuO1xuXG4gICAgICAgIC8vd2FuZ2NoZW5nXG4gICAgICAgIC8vIGxldCB1dWlkID0gdGhpcy5za2VsZXRvbkRhdGEuX3V1aWQ7XG4gICAgICAgIGxldCB1dWlkID0gdGhpcy5nZXRDYWNoZUtleSgpO1xuXG4gICAgICAgIGlmICh0aGlzLl9za2VsZXRvbkNhY2hlKSB7XG4gICAgICAgICAgICB0aGlzLl9za2VsZXRvbkNhY2hlLnVwZGF0ZUFuaW1hdGlvbkNhY2hlKHV1aWQsIGFuaW1OYW1lKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogSW52YWxpZGF0ZXMgdGhlIGFuaW1hdGlvbiBjYWNoZSwgd2hpY2ggaXMgdGhlbiByZWNvbXB1dGVkIG9uIGVhY2ggZnJhbWUuLlxuICAgICAqICEjemhcbiAgICAgKiDkvb/liqjnlLvnvJPlrZjlpLHmlYjvvIzkuYvlkI7kvJrlnKjmr4/luKfph43mlrDorqHnrpfjgIJcbiAgICAgKiBAbWV0aG9kIGludmFsaWRBbmltYXRpb25DYWNoZVxuICAgICAqL1xuICAgIGludmFsaWRBbmltYXRpb25DYWNoZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHJldHVybjtcblxuICAgICAgICAvL3dhbmdjaGVuZ1xuICAgICAgICBsZXQgdXVpZCA9IHRoaXMuZ2V0Q2FjaGVLZXkoKTtcbiAgICAgICAgLy8gbGV0IHV1aWQgPSB0aGlzLnNrZWxldG9uRGF0YS5fdXVpZDtcblxuICAgICAgICBpZiAodGhpcy5fc2tlbGV0b25DYWNoZSkge1xuICAgICAgICAgICAgdGhpcy5fc2tlbGV0b25DYWNoZS5pbnZhbGlkQW5pbWF0aW9uQ2FjaGUodXVpZCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEZpbmRzIGEgYm9uZSBieSBuYW1lLlxuICAgICAqIFRoaXMgZG9lcyBhIHN0cmluZyBjb21wYXJpc29uIGZvciBldmVyeSBib25lLjxicj5cbiAgICAgKiBSZXR1cm5zIGEge3sjY3Jvc3NMaW5rTW9kdWxlIFwic3Auc3BpbmVcIn19c3Auc3BpbmV7ey9jcm9zc0xpbmtNb2R1bGV9fS5Cb25lIG9iamVjdC5cbiAgICAgKiAhI3poXG4gICAgICog6YCa6L+H5ZCN56ew5p+l5om+IGJvbmXjgIJcbiAgICAgKiDov5nph4zlr7nmr4/kuKogYm9uZSDnmoTlkI3np7Dov5vooYzkuoblr7nmr5TjgII8YnI+XG4gICAgICog6L+U5Zue5LiA5LiqIHt7I2Nyb3NzTGlua01vZHVsZSBcInNwLnNwaW5lXCJ9fXNwLnNwaW5le3svY3Jvc3NMaW5rTW9kdWxlfX0uQm9uZSDlr7nosaHjgIJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZmluZEJvbmVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYm9uZU5hbWVcbiAgICAgKiBAcmV0dXJuIHtzcC5zcGluZS5Cb25lfVxuICAgICAqL1xuICAgIGZpbmRCb25lKGJvbmVOYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLl9za2VsZXRvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NrZWxldG9uLmZpbmRCb25lKGJvbmVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEZpbmRzIGEgc2xvdCBieSBuYW1lLiBUaGlzIGRvZXMgYSBzdHJpbmcgY29tcGFyaXNvbiBmb3IgZXZlcnkgc2xvdC48YnI+XG4gICAgICogUmV0dXJucyBhIHt7I2Nyb3NzTGlua01vZHVsZSBcInNwLnNwaW5lXCJ9fXNwLnNwaW5le3svY3Jvc3NMaW5rTW9kdWxlfX0uU2xvdCBvYmplY3QuXG4gICAgICogISN6aFxuICAgICAqIOmAmui/h+WQjeensOafpeaJviBzbG9044CC6L+Z6YeM5a+55q+P5LiqIHNsb3Qg55qE5ZCN56ew6L+b6KGM5LqG5q+U6L6D44CCPGJyPlxuICAgICAqIOi/lOWbnuS4gOS4qiB7eyNjcm9zc0xpbmtNb2R1bGUgXCJzcC5zcGluZVwifX1zcC5zcGluZXt7L2Nyb3NzTGlua01vZHVsZX19LlNsb3Qg5a+56LGh44CCXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGZpbmRTbG90XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNsb3ROYW1lXG4gICAgICogQHJldHVybiB7c3Auc3BpbmUuU2xvdH1cbiAgICAgKi9cbiAgICBmaW5kU2xvdChzbG90TmFtZSkge1xuICAgICAgICBpZiAodGhpcy5fc2tlbGV0b24pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9za2VsZXRvbi5maW5kU2xvdChzbG90TmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBGaW5kcyBhIHNraW4gYnkgbmFtZSBhbmQgbWFrZXMgaXQgdGhlIGFjdGl2ZSBza2luLlxuICAgICAqIFRoaXMgZG9lcyBhIHN0cmluZyBjb21wYXJpc29uIGZvciBldmVyeSBza2luLjxicj5cbiAgICAgKiBOb3RlIHRoYXQgc2V0dGluZyB0aGUgc2tpbiBkb2VzIG5vdCBjaGFuZ2Ugd2hpY2ggYXR0YWNobWVudHMgYXJlIHZpc2libGUuPGJyPlxuICAgICAqIFJldHVybnMgYSB7eyNjcm9zc0xpbmtNb2R1bGUgXCJzcC5zcGluZVwifX1zcC5zcGluZXt7L2Nyb3NzTGlua01vZHVsZX19LlNraW4gb2JqZWN0LlxuICAgICAqICEjemhcbiAgICAgKiDmjInlkI3np7Dmn6Xmib7nmq7ogqTvvIzmv4DmtLvor6Xnmq7ogqTjgILov5nph4zlr7nmr4/kuKrnmq7ogqTnmoTlkI3np7Dov5vooYzkuobmr5TovoPjgII8YnI+XG4gICAgICog5rOo5oSP77ya6K6+572u55qu6IKk5LiN5Lya5pS55Y+YIGF0dGFjaG1lbnQg55qE5Y+v6KeB5oCn44CCPGJyPlxuICAgICAqIOi/lOWbnuS4gOS4qiB7eyNjcm9zc0xpbmtNb2R1bGUgXCJzcC5zcGluZVwifX1zcC5zcGluZXt7L2Nyb3NzTGlua01vZHVsZX19LlNraW4g5a+56LGh44CCXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNldFNraW5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2tpbk5hbWVcbiAgICAgKi9cbiAgICBzZXRTa2luKHNraW5OYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLl9za2VsZXRvbikge1xuICAgICAgICAgICAgbGV0IHNraW4gPSB0aGlzLl9za2VsZXRvbi5za2luO1xuXG4gICAgICAgICAgICAvL3dhbmdjaGVuZ1xuICAgICAgICAgICAgaWYgKHRoaXMuX2NhY2hlTW9kZSA9PSBBbmltYXRpb25DYWNoZU1vZGUuU0hBUkVEX0NBQ0hFKSB7XG4gICAgICAgICAgICAgICAgaWYgKChza2luICYmIHNraW4ubmFtZSAhPSBza2luTmFtZSkgfHwgKCFza2luICYmIHNraW5OYW1lICE9IHRoaXMuZGVmYXVsdFNraW4pKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHNrZWxldG9uSW5mbyA9IHRoaXMuX3NrZWxldG9uQ2FjaGUuZ2V0U2tlbGV0b25DYWNoZSh0aGlzLnNrZWxldG9uRGF0YS5fdXVpZCArICdfJyArIHNraW5OYW1lLCB0aGlzLl9za2VsZXRvbi5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2tlbGV0b24gPSBza2VsZXRvbkluZm8uc2tlbGV0b247XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NsaXBwZXIgPSBza2VsZXRvbkluZm8uY2xpcHBlcjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcm9vdEJvbmUgPSB0aGlzLl9za2VsZXRvbi5nZXRSb290Qm9uZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fc2tlbGV0b24uc2V0U2tpbkJ5TmFtZShza2luTmFtZSk7XG4gICAgICAgICAgICB0aGlzLl9za2VsZXRvbi5zZXRTbG90c1RvU2V0dXBQb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnZhbGlkQW5pbWF0aW9uQ2FjaGUoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgdGhlIGF0dGFjaG1lbnQgZm9yIHRoZSBzbG90IGFuZCBhdHRhY2htZW50IG5hbWUuXG4gICAgICogVGhlIHNrZWxldG9uIGxvb2tzIGZpcnN0IGluIGl0cyBza2luLCB0aGVuIGluIHRoZSBza2VsZXRvbiBkYXRh4oCZcyBkZWZhdWx0IHNraW4uPGJyPlxuICAgICAqIFJldHVybnMgYSB7eyNjcm9zc0xpbmtNb2R1bGUgXCJzcC5zcGluZVwifX1zcC5zcGluZXt7L2Nyb3NzTGlua01vZHVsZX19LkF0dGFjaG1lbnQgb2JqZWN0LlxuICAgICAqICEjemhcbiAgICAgKiDpgJrov4cgc2xvdCDlkowgYXR0YWNobWVudCDnmoTlkI3np7Dojrflj5YgYXR0YWNobWVudOOAglNrZWxldG9uIOS8mOWFiOafpeaJvuWug+eahOearuiCpO+8jOeEtuWQjuaJjeaYryBTa2VsZXRvbiBEYXRhIOS4rem7mOiupOeahOearuiCpOOAgjxicj5cbiAgICAgKiDov5Tlm57kuIDkuKoge3sjY3Jvc3NMaW5rTW9kdWxlIFwic3Auc3BpbmVcIn19c3Auc3BpbmV7ey9jcm9zc0xpbmtNb2R1bGV9fS5BdHRhY2htZW50IOWvueixoeOAglxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXRBdHRhY2htZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNsb3ROYW1lXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dGFjaG1lbnROYW1lXG4gICAgICogQHJldHVybiB7c3Auc3BpbmUuQXR0YWNobWVudH1cbiAgICAgKi9cbiAgICBnZXRBdHRhY2htZW50KHNsb3ROYW1lLCBhdHRhY2htZW50TmFtZSkge1xuICAgICAgICBpZiAodGhpcy5fc2tlbGV0b24pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9za2VsZXRvbi5nZXRBdHRhY2htZW50QnlOYW1lKHNsb3ROYW1lLCBhdHRhY2htZW50TmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTZXRzIHRoZSBhdHRhY2htZW50IGZvciB0aGUgc2xvdCBhbmQgYXR0YWNobWVudCBuYW1lLlxuICAgICAqIFRoZSBza2VsZXRvbiBsb29rcyBmaXJzdCBpbiBpdHMgc2tpbiwgdGhlbiBpbiB0aGUgc2tlbGV0b24gZGF0YeKAmXMgZGVmYXVsdCBza2luLlxuICAgICAqICEjemhcbiAgICAgKiDpgJrov4cgc2xvdCDlkowgYXR0YWNobWVudCDnmoTlkI3lrZfmnaXorr7nva4gYXR0YWNobWVudOOAglxuICAgICAqIFNrZWxldG9uIOS8mOWFiOafpeaJvuWug+eahOearuiCpO+8jOeEtuWQjuaJjeaYryBTa2VsZXRvbiBEYXRhIOS4rem7mOiupOeahOearuiCpOOAglxuICAgICAqIEBtZXRob2Qgc2V0QXR0YWNobWVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzbG90TmFtZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRhY2htZW50TmFtZVxuICAgICAqL1xuICAgIHNldEF0dGFjaG1lbnQoc2xvdE5hbWUsIGF0dGFjaG1lbnROYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLl9za2VsZXRvbikge1xuICAgICAgICAgICAgdGhpcy5fc2tlbGV0b24uc2V0QXR0YWNobWVudChzbG90TmFtZSwgYXR0YWNobWVudE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW52YWxpZEFuaW1hdGlvbkNhY2hlKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICogUmV0dXJuIHRoZSByZW5kZXJlciBvZiBhdHRhY2htZW50LlxuICAgICogQG1ldGhvZCBnZXRUZXh0dXJlQXRsYXNcbiAgICAqIEBwYXJhbSB7c3Auc3BpbmUuUmVnaW9uQXR0YWNobWVudHxzcGluZS5Cb3VuZGluZ0JveEF0dGFjaG1lbnR9IHJlZ2lvbkF0dGFjaG1lbnRcbiAgICAqIEByZXR1cm4ge3NwLnNwaW5lLlRleHR1cmVBdGxhc1JlZ2lvbn1cbiAgICAqL1xuICAgIGdldFRleHR1cmVBdGxhcyhyZWdpb25BdHRhY2htZW50KSB7XG4gICAgICAgIHJldHVybiByZWdpb25BdHRhY2htZW50LnJlZ2lvbjtcbiAgICB9LFxuXG4gICAgLy8gQU5JTUFUSU9OXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIE1peCBhcHBsaWVzIGFsbCBrZXlmcmFtZSB2YWx1ZXMsXG4gICAgICogaW50ZXJwb2xhdGVkIGZvciB0aGUgc3BlY2lmaWVkIHRpbWUgYW5kIG1peGVkIHdpdGggdGhlIGN1cnJlbnQgdmFsdWVzLlxuICAgICAqICEjemgg5Li65omA5pyJ5YWz6ZSu5bin6K6+5a6a5re35ZCI5Y+K5re35ZCI5pe26Ze077yI5LuO5b2T5YmN5YC85byA5aeL5beu5YC877yJ44CCXG4gICAgICogQG1ldGhvZCBzZXRNaXhcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZnJvbUFuaW1hdGlvblxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0b0FuaW1hdGlvblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvblxuICAgICAqL1xuICAgIHNldE1peChmcm9tQW5pbWF0aW9uLCB0b0FuaW1hdGlvbiwgZHVyYXRpb24pIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZS5kYXRhLnNldE1peChmcm9tQW5pbWF0aW9uLCB0b0FuaW1hdGlvbiwgZHVyYXRpb24pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSBjdXJyZW50IGFuaW1hdGlvbi4gQW55IHF1ZXVlZCBhbmltYXRpb25zIGFyZSBjbGVhcmVkLjxicj5cbiAgICAgKiBSZXR1cm5zIGEge3sjY3Jvc3NMaW5rTW9kdWxlIFwic3Auc3BpbmVcIn19c3Auc3BpbmV7ey9jcm9zc0xpbmtNb2R1bGV9fS5UcmFja0VudHJ5IG9iamVjdC5cbiAgICAgKiAhI3poIOiuvue9ruW9k+WJjeWKqOeUu+OAgumYn+WIl+S4reeahOS7u+S9leeahOWKqOeUu+Wwhuiiq+a4hemZpOOAgjxicj5cbiAgICAgKiDov5Tlm57kuIDkuKoge3sjY3Jvc3NMaW5rTW9kdWxlIFwic3Auc3BpbmVcIn19c3Auc3BpbmV7ey9jcm9zc0xpbmtNb2R1bGV9fS5UcmFja0VudHJ5IOWvueixoeOAglxuICAgICAqIEBtZXRob2Qgc2V0QW5pbWF0aW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRyYWNrSW5kZXhcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gbG9vcFxuICAgICAqIEByZXR1cm4ge3NwLnNwaW5lLlRyYWNrRW50cnl9XG4gICAgICovXG4gICAgc2V0QW5pbWF0aW9uKHRyYWNrSW5kZXgsIG5hbWUsIGxvb3ApIHtcblxuICAgICAgICB0aGlzLl9wbGF5VGltZXMgPSBsb29wID8gMCA6IDE7XG4gICAgICAgIHRoaXMuX2FuaW1hdGlvbk5hbWUgPSBuYW1lO1xuXG4gICAgICAgIGlmICh0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHtcbiAgICAgICAgICAgIGlmICh0cmFja0luZGV4ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybihcIlRyYWNrIGluZGV4IGNhbiBub3QgZ3JlYXRlciB0aGFuIDAgaW4gY2FjaGVkIG1vZGUuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLl9za2VsZXRvbkNhY2hlKSByZXR1cm4gbnVsbDtcblxuICAgICAgICAgICAgLy93YW5nY2hlbmdcbiAgICAgICAgICAgIGxldCB1dWlkID0gdGhpcy5nZXRDYWNoZUtleSgpO1xuICAgICAgICAgICAgLy8gbGV0IHV1aWQgPSB0aGlzLnNrZWxldG9uRGF0YS5fdXVpZDtcblxuICAgICAgICAgICAgbGV0IGNhY2hlID0gdGhpcy5fc2tlbGV0b25DYWNoZS5nZXRBbmltYXRpb25DYWNoZSh1dWlkLCBuYW1lKTtcbiAgICAgICAgICAgIGlmICghY2FjaGUpIHtcbiAgICAgICAgICAgICAgICBjYWNoZSA9IHRoaXMuX3NrZWxldG9uQ2FjaGUuaW5pdEFuaW1hdGlvbkNhY2hlKHV1aWQsIG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNhY2hlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faXNBbmlDb21wbGV0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2FjY1RpbWUgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuX3BsYXlDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5fZnJhbWVDYWNoZSA9IGNhY2hlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmF0dGFjaFV0aWwuX2hhc0F0dGFjaGVkTm9kZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZyYW1lQ2FjaGUuZW5hYmxlQ2FjaGVBdHRhY2hlZEluZm8oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fZnJhbWVDYWNoZS51cGRhdGVUb0ZyYW1lKDApO1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1ckZyYW1lID0gdGhpcy5fZnJhbWVDYWNoZS5mcmFtZXNbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fc2tlbGV0b24pIHtcbiAgICAgICAgICAgICAgICB2YXIgYW5pbWF0aW9uID0gdGhpcy5fc2tlbGV0b24uZGF0YS5maW5kQW5pbWF0aW9uKG5hbWUpO1xuICAgICAgICAgICAgICAgIGlmICghYW5pbWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZ0lEKDc1MDksIG5hbWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHJlcyA9IHRoaXMuX3N0YXRlLnNldEFuaW1hdGlvbldpdGgodHJhY2tJbmRleCwgYW5pbWF0aW9uLCBsb29wKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZS5hcHBseSh0aGlzLl9za2VsZXRvbik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBBZGRzIGFuIGFuaW1hdGlvbiB0byBiZSBwbGF5ZWQgZGVsYXkgc2Vjb25kcyBhZnRlciB0aGUgY3VycmVudCBvciBsYXN0IHF1ZXVlZCBhbmltYXRpb24uPGJyPlxuICAgICAqIFJldHVybnMgYSB7eyNjcm9zc0xpbmtNb2R1bGUgXCJzcC5zcGluZVwifX1zcC5zcGluZXt7L2Nyb3NzTGlua01vZHVsZX19LlRyYWNrRW50cnkgb2JqZWN0LlxuICAgICAqICEjemgg5re75Yqg5LiA5Liq5Yqo55S75Yiw5Yqo55S76Zif5YiX5bC+6YOo77yM6L+Y5Y+v5Lul5bu26L+f5oyH5a6a55qE56eS5pWw44CCPGJyPlxuICAgICAqIOi/lOWbnuS4gOS4qiB7eyNjcm9zc0xpbmtNb2R1bGUgXCJzcC5zcGluZVwifX1zcC5zcGluZXt7L2Nyb3NzTGlua01vZHVsZX19LlRyYWNrRW50cnkg5a+56LGh44CCXG4gICAgICogQG1ldGhvZCBhZGRBbmltYXRpb25cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdHJhY2tJbmRleFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBsb29wXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtkZWxheT0wXVxuICAgICAqIEByZXR1cm4ge3NwLnNwaW5lLlRyYWNrRW50cnl9XG4gICAgICovXG4gICAgYWRkQW5pbWF0aW9uKHRyYWNrSW5kZXgsIG5hbWUsIGxvb3AsIGRlbGF5KSB7XG4gICAgICAgIGRlbGF5ID0gZGVsYXkgfHwgMDtcbiAgICAgICAgaWYgKHRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkge1xuICAgICAgICAgICAgaWYgKHRyYWNrSW5kZXggIT09IDApIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuKFwiVHJhY2sgaW5kZXggY2FuIG5vdCBncmVhdGVyIHRoYW4gMCBpbiBjYWNoZWQgbW9kZS5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9hbmltYXRpb25RdWV1ZS5wdXNoKHsgYW5pbWF0aW9uTmFtZTogbmFtZSwgbG9vcDogbG9vcCwgZGVsYXk6IGRlbGF5IH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3NrZWxldG9uKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFuaW1hdGlvbiA9IHRoaXMuX3NrZWxldG9uLmRhdGEuZmluZEFuaW1hdGlvbihuYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoIWFuaW1hdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBjYy5sb2dJRCg3NTEwLCBuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZS5hZGRBbmltYXRpb25XaXRoKHRyYWNrSW5kZXgsIGFuaW1hdGlvbiwgbG9vcCwgZGVsYXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEZpbmQgYW5pbWF0aW9uIHdpdGggc3BlY2lmaWVkIG5hbWUuXG4gICAgICogISN6aCDmn6Xmib7mjIflrprlkI3np7DnmoTliqjnlLtcbiAgICAgKiBAbWV0aG9kIGZpbmRBbmltYXRpb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgICAqIEByZXR1cm5zIHtzcC5zcGluZS5BbmltYXRpb259XG4gICAgICovXG4gICAgZmluZEFuaW1hdGlvbihuYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLl9za2VsZXRvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NrZWxldG9uLmRhdGEuZmluZEFuaW1hdGlvbihuYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRyYWNrIGVudHJ5IGJ5IHRyYWNrSW5kZXguPGJyPlxuICAgICAqIFJldHVybnMgYSB7eyNjcm9zc0xpbmtNb2R1bGUgXCJzcC5zcGluZVwifX1zcC5zcGluZXt7L2Nyb3NzTGlua01vZHVsZX19LlRyYWNrRW50cnkgb2JqZWN0LlxuICAgICAqICEjemgg6YCa6L+HIHRyYWNrIOe0ouW8leiOt+WPliBUcmFja0VudHJ544CCPGJyPlxuICAgICAqIOi/lOWbnuS4gOS4qiB7eyNjcm9zc0xpbmtNb2R1bGUgXCJzcC5zcGluZVwifX1zcC5zcGluZXt7L2Nyb3NzTGlua01vZHVsZX19LlRyYWNrRW50cnkg5a+56LGh44CCXG4gICAgICogQG1ldGhvZCBnZXRDdXJyZW50XG4gICAgICogQHBhcmFtIHRyYWNrSW5kZXhcbiAgICAgKiBAcmV0dXJuIHtzcC5zcGluZS5UcmFja0VudHJ5fVxuICAgICAqL1xuICAgIGdldEN1cnJlbnQodHJhY2tJbmRleCkge1xuICAgICAgICBpZiAodGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICBjYy53YXJuKFwiJ2dldEN1cnJlbnQnIGludGVyZmFjZSBjYW4gbm90IGJlIGludm9rZWQgaW4gY2FjaGVkIG1vZGUuXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3N0YXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlLmdldEN1cnJlbnQodHJhY2tJbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2xlYXJzIGFsbCB0cmFja3Mgb2YgYW5pbWF0aW9uIHN0YXRlLlxuICAgICAqICEjemgg5riF6Zmk5omA5pyJIHRyYWNrIOeahOWKqOeUu+eKtuaAgeOAglxuICAgICAqIEBtZXRob2QgY2xlYXJUcmFja3NcbiAgICAgKi9cbiAgICBjbGVhclRyYWNrcygpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkge1xuICAgICAgICAgICAgY2Mud2FybihcIidjbGVhclRyYWNrcycgaW50ZXJmYWNlIGNhbiBub3QgYmUgaW52b2tlZCBpbiBjYWNoZWQgbW9kZS5cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fc3RhdGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZS5jbGVhclRyYWNrcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2xlYXJzIHRyYWNrIG9mIGFuaW1hdGlvbiBzdGF0ZSBieSB0cmFja0luZGV4LlxuICAgICAqICEjemgg5riF6Zmk5Ye65oyH5a6aIHRyYWNrIOeahOWKqOeUu+eKtuaAgeOAglxuICAgICAqIEBtZXRob2QgY2xlYXJUcmFja1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0cmFja0luZGV4XG4gICAgICovXG4gICAgY2xlYXJUcmFjayh0cmFja0luZGV4KSB7XG4gICAgICAgIGlmICh0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHtcbiAgICAgICAgICAgIGNjLndhcm4oXCInY2xlYXJUcmFjaycgaW50ZXJmYWNlIGNhbiBub3QgYmUgaW52b2tlZCBpbiBjYWNoZWQgbW9kZS5cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fc3RhdGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZS5jbGVhclRyYWNrKHRyYWNrSW5kZXgpO1xuICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IgJiYgIWNjLmVuZ2luZS5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUudXBkYXRlKDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCB0aGUgc3RhcnQgZXZlbnQgbGlzdGVuZXIuXG4gICAgICogISN6aCDnlKjmnaXorr7nva7lvIDlp4vmkq3mlL7liqjnlLvnmoTkuovku7bnm5HlkKzjgIJcbiAgICAgKiBAbWV0aG9kIHNldFN0YXJ0TGlzdGVuZXJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgICAqL1xuICAgIHNldFN0YXJ0TGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgICAgICAgdGhpcy5fZW5zdXJlTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIuc3RhcnQgPSBsaXN0ZW5lcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIGludGVycnVwdCBldmVudCBsaXN0ZW5lci5cbiAgICAgKiAhI3poIOeUqOadpeiuvue9ruWKqOeUu+iiq+aJk+aWreeahOS6i+S7tuebkeWQrOOAglxuICAgICAqIEBtZXRob2Qgc2V0SW50ZXJydXB0TGlzdGVuZXJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgICAqL1xuICAgIHNldEludGVycnVwdExpc3RlbmVyKGxpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMuX2Vuc3VyZUxpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVyLmludGVycnVwdCA9IGxpc3RlbmVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCB0aGUgZW5kIGV2ZW50IGxpc3RlbmVyLlxuICAgICAqICEjemgg55So5p2l6K6+572u5Yqo55S75pKt5pS+5a6M5ZCO55qE5LqL5Lu255uR5ZCs44CCXG4gICAgICogQG1ldGhvZCBzZXRFbmRMaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyXG4gICAgICovXG4gICAgc2V0RW5kTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgICAgICAgdGhpcy5fZW5zdXJlTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIuZW5kID0gbGlzdGVuZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSBkaXNwb3NlIGV2ZW50IGxpc3RlbmVyLlxuICAgICAqICEjemgg55So5p2l6K6+572u5Yqo55S75bCG6KKr6ZSA5q+B55qE5LqL5Lu255uR5ZCs44CCXG4gICAgICogQG1ldGhvZCBzZXREaXNwb3NlTGlzdGVuZXJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgICAqL1xuICAgIHNldERpc3Bvc2VMaXN0ZW5lcihsaXN0ZW5lcikge1xuICAgICAgICB0aGlzLl9lbnN1cmVMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLl9saXN0ZW5lci5kaXNwb3NlID0gbGlzdGVuZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSBjb21wbGV0ZSBldmVudCBsaXN0ZW5lci5cbiAgICAgKiAhI3poIOeUqOadpeiuvue9ruWKqOeUu+aSreaUvuS4gOasoeW+queOr+e7k+adn+WQjueahOS6i+S7tuebkeWQrOOAglxuICAgICAqIEBtZXRob2Qgc2V0Q29tcGxldGVMaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyXG4gICAgICovXG4gICAgc2V0Q29tcGxldGVMaXN0ZW5lcihsaXN0ZW5lcikge1xuICAgICAgICB0aGlzLl9lbnN1cmVMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLl9saXN0ZW5lci5jb21wbGV0ZSA9IGxpc3RlbmVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCB0aGUgYW5pbWF0aW9uIGV2ZW50IGxpc3RlbmVyLlxuICAgICAqICEjemgg55So5p2l6K6+572u5Yqo55S75pKt5pS+6L+H56iL5Lit5bin5LqL5Lu255qE55uR5ZCs44CCXG4gICAgICogQG1ldGhvZCBzZXRFdmVudExpc3RlbmVyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXJcbiAgICAgKi9cbiAgICBzZXRFdmVudExpc3RlbmVyKGxpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMuX2Vuc3VyZUxpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVyLmV2ZW50ID0gbGlzdGVuZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSBzdGFydCBldmVudCBsaXN0ZW5lciBmb3Igc3BlY2lmaWVkIFRyYWNrRW50cnkuXG4gICAgICogISN6aCDnlKjmnaXkuLrmjIflrprnmoQgVHJhY2tFbnRyeSDorr7nva7liqjnlLvlvIDlp4vmkq3mlL7nmoTkuovku7bnm5HlkKzjgIJcbiAgICAgKiBAbWV0aG9kIHNldFRyYWNrU3RhcnRMaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7c3Auc3BpbmUuVHJhY2tFbnRyeX0gZW50cnlcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgICAqL1xuICAgIHNldFRyYWNrU3RhcnRMaXN0ZW5lcihlbnRyeSwgbGlzdGVuZXIpIHtcbiAgICAgICAgVHJhY2tFbnRyeUxpc3RlbmVycy5nZXRMaXN0ZW5lcnMoZW50cnkpLnN0YXJ0ID0gbGlzdGVuZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSBpbnRlcnJ1cHQgZXZlbnQgbGlzdGVuZXIgZm9yIHNwZWNpZmllZCBUcmFja0VudHJ5LlxuICAgICAqICEjemgg55So5p2l5Li65oyH5a6a55qEIFRyYWNrRW50cnkg6K6+572u5Yqo55S76KKr5omT5pat55qE5LqL5Lu255uR5ZCs44CCXG4gICAgICogQG1ldGhvZCBzZXRUcmFja0ludGVycnVwdExpc3RlbmVyXG4gICAgICogQHBhcmFtIHtzcC5zcGluZS5UcmFja0VudHJ5fSBlbnRyeVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyXG4gICAgICovXG4gICAgc2V0VHJhY2tJbnRlcnJ1cHRMaXN0ZW5lcihlbnRyeSwgbGlzdGVuZXIpIHtcbiAgICAgICAgVHJhY2tFbnRyeUxpc3RlbmVycy5nZXRMaXN0ZW5lcnMoZW50cnkpLmludGVycnVwdCA9IGxpc3RlbmVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCB0aGUgZW5kIGV2ZW50IGxpc3RlbmVyIGZvciBzcGVjaWZpZWQgVHJhY2tFbnRyeS5cbiAgICAgKiAhI3poIOeUqOadpeS4uuaMh+WumueahCBUcmFja0VudHJ5IOiuvue9ruWKqOeUu+aSreaUvue7k+adn+eahOS6i+S7tuebkeWQrOOAglxuICAgICAqIEBtZXRob2Qgc2V0VHJhY2tFbmRMaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7c3Auc3BpbmUuVHJhY2tFbnRyeX0gZW50cnlcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgICAqL1xuICAgIHNldFRyYWNrRW5kTGlzdGVuZXIoZW50cnksIGxpc3RlbmVyKSB7XG4gICAgICAgIFRyYWNrRW50cnlMaXN0ZW5lcnMuZ2V0TGlzdGVuZXJzKGVudHJ5KS5lbmQgPSBsaXN0ZW5lcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIGRpc3Bvc2UgZXZlbnQgbGlzdGVuZXIgZm9yIHNwZWNpZmllZCBUcmFja0VudHJ5LlxuICAgICAqICEjemgg55So5p2l5Li65oyH5a6a55qEIFRyYWNrRW50cnkg6K6+572u5Yqo55S75Y2z5bCG6KKr6ZSA5q+B55qE5LqL5Lu255uR5ZCs44CCXG4gICAgICogQG1ldGhvZCBzZXRUcmFja0Rpc3Bvc2VMaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7c3Auc3BpbmUuVHJhY2tFbnRyeX0gZW50cnlcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgICAqL1xuICAgIHNldFRyYWNrRGlzcG9zZUxpc3RlbmVyKGVudHJ5LCBsaXN0ZW5lcikge1xuICAgICAgICBUcmFja0VudHJ5TGlzdGVuZXJzLmdldExpc3RlbmVycyhlbnRyeSkuZGlzcG9zZSA9IGxpc3RlbmVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCB0aGUgY29tcGxldGUgZXZlbnQgbGlzdGVuZXIgZm9yIHNwZWNpZmllZCBUcmFja0VudHJ5LlxuICAgICAqICEjemgg55So5p2l5Li65oyH5a6a55qEIFRyYWNrRW50cnkg6K6+572u5Yqo55S75LiA5qyh5b6q546v5pKt5pS+57uT5p2f55qE5LqL5Lu255uR5ZCs44CCXG4gICAgICogQG1ldGhvZCBzZXRUcmFja0NvbXBsZXRlTGlzdGVuZXJcbiAgICAgKiBAcGFyYW0ge3NwLnNwaW5lLlRyYWNrRW50cnl9IGVudHJ5XG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXJcbiAgICAgKiBAcGFyYW0ge3NwLnNwaW5lLlRyYWNrRW50cnl9IGxpc3RlbmVyLmVudHJ5XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGxpc3RlbmVyLmxvb3BDb3VudFxuICAgICAqL1xuICAgIHNldFRyYWNrQ29tcGxldGVMaXN0ZW5lcihlbnRyeSwgbGlzdGVuZXIpIHtcbiAgICAgICAgVHJhY2tFbnRyeUxpc3RlbmVycy5nZXRMaXN0ZW5lcnMoZW50cnkpLmNvbXBsZXRlID0gZnVuY3Rpb24gKHRyYWNrRW50cnkpIHtcbiAgICAgICAgICAgIHZhciBsb29wQ291bnQgPSBNYXRoLmZsb29yKHRyYWNrRW50cnkudHJhY2tUaW1lIC8gdHJhY2tFbnRyeS5hbmltYXRpb25FbmQpO1xuICAgICAgICAgICAgbGlzdGVuZXIodHJhY2tFbnRyeSwgbG9vcENvdW50KTtcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIGV2ZW50IGxpc3RlbmVyIGZvciBzcGVjaWZpZWQgVHJhY2tFbnRyeS5cbiAgICAgKiAhI3poIOeUqOadpeS4uuaMh+WumueahCBUcmFja0VudHJ5IOiuvue9ruWKqOeUu+W4p+S6i+S7tueahOebkeWQrOOAglxuICAgICAqIEBtZXRob2Qgc2V0VHJhY2tFdmVudExpc3RlbmVyXG4gICAgICogQHBhcmFtIHtzcC5zcGluZS5UcmFja0VudHJ5fSBlbnRyeVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyXG4gICAgICovXG4gICAgc2V0VHJhY2tFdmVudExpc3RlbmVyKGVudHJ5LCBsaXN0ZW5lcikge1xuICAgICAgICBUcmFja0VudHJ5TGlzdGVuZXJzLmdldExpc3RlbmVycyhlbnRyeSkuZXZlbnQgPSBsaXN0ZW5lcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBHZXQgdGhlIGFuaW1hdGlvbiBzdGF0ZSBvYmplY3RcbiAgICAgKiAhI3poIOiOt+WPluWKqOeUu+eKtuaAgVxuICAgICAqIEBtZXRob2QgZ2V0U3RhdGVcbiAgICAgKiBAcmV0dXJuIHtzcC5zcGluZS5BbmltYXRpb25TdGF0ZX0gc3RhdGVcbiAgICAgKi9cbiAgICBnZXRTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICAgIH0sXG5cbiAgICAvLyB1cGRhdGUgYW5pbWF0aW9uIGxpc3QgZm9yIGVkaXRvclxuICAgIF91cGRhdGVBbmltRW51bTogQ0NfRURJVE9SICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFuaW1FbnVtO1xuICAgICAgICBpZiAodGhpcy5za2VsZXRvbkRhdGEpIHtcbiAgICAgICAgICAgIGFuaW1FbnVtID0gdGhpcy5za2VsZXRvbkRhdGEuZ2V0QW5pbXNFbnVtKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hhbmdlIGVudW1cbiAgICAgICAgc2V0RW51bUF0dHIodGhpcywgJ19hbmltYXRpb25JbmRleCcsIGFuaW1FbnVtIHx8IERlZmF1bHRBbmltc0VudW0pO1xuICAgIH0sXG4gICAgLy8gdXBkYXRlIHNraW4gbGlzdCBmb3IgZWRpdG9yXG4gICAgX3VwZGF0ZVNraW5FbnVtOiBDQ19FRElUT1IgJiYgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc2tpbkVudW07XG4gICAgICAgIGlmICh0aGlzLnNrZWxldG9uRGF0YSkge1xuICAgICAgICAgICAgc2tpbkVudW0gPSB0aGlzLnNrZWxldG9uRGF0YS5nZXRTa2luc0VudW0oKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjaGFuZ2UgZW51bVxuICAgICAgICBzZXRFbnVtQXR0cih0aGlzLCAnX2RlZmF1bHRTa2luSW5kZXgnLCBza2luRW51bSB8fCBEZWZhdWx0U2tpbnNFbnVtKTtcbiAgICB9LFxuXG4gICAgX2Vuc3VyZUxpc3RlbmVyKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lciA9IG5ldyBUcmFja0VudHJ5TGlzdGVuZXJzKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5fc3RhdGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZS5hZGRMaXN0ZW5lcih0aGlzLl9saXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VwZGF0ZVNrZWxldG9uRGF0YSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNrZWxldG9uRGF0YSkge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlUmVuZGVyKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuc2tlbGV0b25EYXRhLmdldFJ1bnRpbWVEYXRhKCk7XG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlUmVuZGVyKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5zZXRTa2VsZXRvbkRhdGEoZGF0YSk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uU3RhdGVEYXRhKG5ldyBzcGluZS5BbmltYXRpb25TdGF0ZURhdGEodGhpcy5fc2tlbGV0b24uZGF0YSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kZWZhdWx0U2tpbiAmJiB0aGlzLnNldFNraW4odGhpcy5kZWZhdWx0U2tpbik7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNjLndhcm4oZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmF0dGFjaFV0aWwuaW5pdCh0aGlzKTtcbiAgICAgICAgdGhpcy5hdHRhY2hVdGlsLl9hc3NvY2lhdGVBdHRhY2hlZE5vZGUoKTtcbiAgICAgICAgdGhpcy5fcHJlQ2FjaGVNb2RlID0gdGhpcy5fY2FjaGVNb2RlO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IHRoaXMuZGVmYXVsdEFuaW1hdGlvbjtcbiAgICB9LFxuXG4gICAgX3JlZnJlc2hJbnNwZWN0b3IoKSB7XG4gICAgICAgIC8vIHVwZGF0ZSBpbnNwZWN0b3JcbiAgICAgICAgdGhpcy5fdXBkYXRlQW5pbUVudW0oKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlU2tpbkVudW0oKTtcbiAgICAgICAgRWRpdG9yLlV0aWxzLnJlZnJlc2hTZWxlY3RlZEluc3BlY3Rvcignbm9kZScsIHRoaXMubm9kZS51dWlkKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZURlYnVnRHJhdzogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5kZWJ1Z0JvbmVzIHx8IHRoaXMuZGVidWdTbG90cykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9kZWJ1Z1JlbmRlcmVyKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRlYnVnRHJhd05vZGUgPSBuZXcgY2MuUHJpdmF0ZU5vZGUoKTtcbiAgICAgICAgICAgICAgICBkZWJ1Z0RyYXdOb2RlLm5hbWUgPSAnREVCVUdfRFJBV19OT0RFJztcbiAgICAgICAgICAgICAgICBsZXQgZGVidWdEcmF3ID0gZGVidWdEcmF3Tm9kZS5hZGRDb21wb25lbnQoR3JhcGhpY3MpO1xuICAgICAgICAgICAgICAgIGRlYnVnRHJhdy5saW5lV2lkdGggPSAxO1xuICAgICAgICAgICAgICAgIGRlYnVnRHJhdy5zdHJva2VDb2xvciA9IGNjLmNvbG9yKDI1NSwgMCwgMCwgMjU1KTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX2RlYnVnUmVuZGVyZXIgPSBkZWJ1Z0RyYXc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2RlYnVnUmVuZGVyZXIubm9kZS5wYXJlbnQgPSB0aGlzLm5vZGU7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybihcIkRlYnVnIGJvbmVzIG9yIHNsb3RzIGlzIGludmFsaWQgaW4gY2FjaGVkIG1vZGVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5fZGVidWdSZW5kZXJlcikge1xuICAgICAgICAgICAgdGhpcy5fZGVidWdSZW5kZXJlci5ub2RlLnBhcmVudCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3AuU2tlbGV0b247XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==