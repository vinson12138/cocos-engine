
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/deprecated.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
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
var js = cc.js;

if (CC_DEBUG) {
  var deprecateEnum = function deprecateEnum(obj, oldPath, newPath, hasTypePrefixBefore) {
    if (!CC_SUPPORT_JIT) {
      return;
    }

    hasTypePrefixBefore = hasTypePrefixBefore !== false;
    var enumDef = Function('return ' + newPath)();
    var entries = cc.Enum.getList(enumDef);
    var delimiter = hasTypePrefixBefore ? '_' : '.';

    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i].name;
      var oldPropName;

      if (hasTypePrefixBefore) {
        var oldTypeName = oldPath.split('.').slice(-1)[0];
        oldPropName = oldTypeName + '_' + entry;
      } else {
        oldPropName = entry;
      }

      js.get(obj, oldPropName, function (entry) {
        cc.errorID(1400, oldPath + delimiter + entry, newPath + '.' + entry);
        return enumDef[entry];
      }.bind(null, entry));
    }
  };

  var markAsRemoved = function markAsRemoved(ownerCtor, removedProps, ownerName) {
    if (!ownerCtor) {
      // 可能被裁剪了
      return;
    }

    ownerName = ownerName || js.getClassName(ownerCtor);
    removedProps.forEach(function (prop) {
      function error() {
        cc.errorID(1406, ownerName, prop);
      }

      js.getset(ownerCtor.prototype, prop, error, error);
    });
  };

  var markAsDeprecated = function markAsDeprecated(ownerCtor, deprecatedProps, ownerName) {
    if (!ownerCtor) {
      return;
    }

    ownerName = ownerName || js.getClassName(ownerCtor);
    var descriptors = Object.getOwnPropertyDescriptors(ownerCtor.prototype);
    deprecatedProps.forEach(function (prop) {
      var deprecatedProp = prop[0];
      var newProp = prop[1];
      var descriptor = descriptors[deprecatedProp];
      js.getset(ownerCtor.prototype, deprecatedProp, function () {
        cc.warnID(1400, ownerName + "." + deprecatedProp, ownerName + "." + newProp);
        return descriptor.get.call(this);
      }, function (v) {
        cc.warnID(1400, ownerName + "." + deprecatedProp, ownerName + "." + newProp);
        descriptor.set.call(this, v);
      });
    });
  };

  var markAsRemovedInObject = function markAsRemovedInObject(ownerObj, removedProps, ownerName) {
    if (!ownerObj) {
      // 可能被裁剪了
      return;
    }

    removedProps.forEach(function (prop) {
      function error() {
        cc.errorID(1406, ownerName, prop);
      }

      js.getset(ownerObj, prop, error);
    });
  };

  var provideClearError = function provideClearError(owner, obj, ownerName) {
    if (!owner) {
      // 可能被裁剪了
      return;
    }

    var className = ownerName || cc.js.getClassName(owner);
    var Info = 'Sorry, ' + className + '.%s is removed, please use %s instead.';

    var _loop = function _loop() {
      function define(prop, getset) {
        function accessor(newProp) {
          cc.error(Info, prop, newProp);
        }

        if (!Array.isArray(getset)) {
          getset = getset.split(',').map(function (x) {
            return x.trim();
          });
        }

        try {
          js.getset(owner, prop, accessor.bind(null, getset[0]), getset[1] && accessor.bind(null, getset[1]));
        } catch (e) {}
      }

      getset = obj[prop];

      if (prop[0] === '*') {
        // get set
        etProp = prop.slice(1);
        define('g' + etProp, getset);
        define('s' + etProp, getset);
      } else {
        prop.split(',').map(function (x) {
          return x.trim();
        }).forEach(function (x) {
          define(x, getset);
        });
      }
    };

    for (var prop in obj) {
      var getset;
      var etProp;

      _loop();
    }
  };

  var markFunctionWarning = function markFunctionWarning(ownerCtor, obj, ownerName) {
    if (!ownerCtor) {
      // 可能被裁剪了
      return;
    }

    ownerName = ownerName || js.getClassName(ownerCtor);

    for (var prop in obj) {
      (function () {
        var propName = prop;
        var originFunc = ownerCtor[propName];
        if (!originFunc) return;

        function warn() {
          cc.warn('Sorry, %s.%s is deprecated. Please use %s instead', ownerName, propName, obj[propName]);
          return originFunc.apply(this, arguments);
        }

        ownerCtor[propName] = warn;
      })();
    }
  }; // remove cc.info


  js.get(cc, 'info', function () {
    cc.errorID(1400, 'cc.info', 'cc.log');
    return cc.log;
  }); // cc.spriteFrameCache

  js.get(cc, "spriteFrameCache", function () {
    cc.errorID(1404);
  }); // cc.vmath

  js.get(cc, 'vmath', function () {
    cc.warnID(1400, 'cc.vmath', 'cc.math');
    return cc.math;
  });
  js.get(cc.math, 'vec2', function () {
    cc.warnID(1400, 'cc.vmath.vec2', 'cc.Vec2');
    return cc.Vec2;
  });
  js.get(cc.math, 'vec3', function () {
    cc.warnID(1400, 'cc.vmath.vec3', 'cc.Vec3');
    return cc.Vec3;
  });
  js.get(cc.math, 'vec4', function () {
    cc.warnID(1400, 'cc.vmath.vec4', 'cc.Vec4');
    return cc.Vec4;
  });
  js.get(cc.math, 'mat4', function () {
    cc.warnID(1400, 'cc.vmath.mat4', 'cc.Mat4');
    return cc.Mat4;
  });
  js.get(cc.math, 'mat3', function () {
    cc.warnID(1400, 'cc.vmath.mat3', 'cc.Mat3');
    return cc.Mat3;
  });
  js.get(cc.math, 'quat', function () {
    cc.warnID(1400, 'cc.vmath.quat', 'cc.Quat');
    return cc.Quat;
  }); // SpriteFrame

  js.get(cc.SpriteFrame.prototype, '_textureLoaded', function () {
    cc.errorID(1400, 'spriteFrame._textureLoaded', 'spriteFrame.textureLoaded()');
    return this.textureLoaded();
  });
  markAsRemoved(cc.SpriteFrame, ['addLoadedEventListener']);
  markFunctionWarning(cc.Sprite.prototype, {
    setState: 'cc.Sprite.setMaterial',
    getState: 'cc.Sprite.getMaterial'
  }, 'cc.Sprite');
  js.get(cc.SpriteFrame.prototype, 'clearTexture', function () {
    cc.errorID(1406, 'cc.SpriteFrame', 'clearTexture');
    return function () {};
  }); // cc.textureCache

  js.get(cc, 'textureCache', function () {
    cc.errorID(1406, 'cc', 'textureCache');
  }); // Texture

  var Texture2D = cc.Texture2D;
  js.get(Texture2D.prototype, 'releaseTexture', function () {
    cc.errorID(1400, 'texture.releaseTexture()', 'texture.destroy()');
    return this.destroy;
  });
  js.get(Texture2D.prototype, 'getName', function () {
    cc.errorID(1400, 'texture.getName()', 'texture._glID');
    return function () {
      return this._glID || null;
    };
  });
  js.get(Texture2D.prototype, 'isLoaded', function () {
    cc.errorID(1400, 'texture.isLoaded function', 'texture.loaded property');
    return function () {
      return this.loaded;
    };
  });
  js.get(Texture2D.prototype, 'setAntiAliasTexParameters', function () {
    cc.errorID(1400, 'texture.setAntiAliasTexParameters()', 'texture.setFilters(cc.Texture2D.Filter.LINEAR, cc.Texture2D.Filter.LINEAR)');
    return function () {
      this.setFilters(Texture2D.Filter.LINEAR, Texture2D.Filter.LINEAR);
    };
  });
  js.get(Texture2D.prototype, 'setAliasTexParameters', function () {
    cc.errorID(1400, 'texture.setAntiAliasTexParameters()', 'texture.setFilters(cc.Texture2D.Filter.NEAREST, cc.Texture2D.Filter.NEAREST)');
    return function () {
      this.setFilters(Texture2D.Filter.NEAREST, Texture2D.Filter.NEAREST);
    };
  }); // cc.macro

  markAsRemovedInObject(cc.macro, ['ENABLE_GL_STATE_CACHE', 'FIX_ARTIFACTS_BY_STRECHING_TEXEL'], 'cc.macro');
  provideClearError(cc.macro, {
    PI: 'Math.PI',
    PI2: 'Math.PI * 2',
    FLT_MAX: 'Number.MAX_VALUE',
    FLT_MIN: 'Number.MIN_VALUE',
    UINT_MAX: 'Number.MAX_SAFE_INTEGER'
  }, 'cc.macro'); // cc.game

  markAsRemovedInObject(cc.game, ['CONFIG_KEY'], 'cc.game'); // cc.sys

  markAsRemovedInObject(cc.sys, ['dumpRoot', 'cleanScript', 'BROWSER_TYPE_WECHAT_GAME', 'BROWSER_TYPE_WECHAT_GAME_SUB', 'BROWSER_TYPE_BAIDU_GAME', 'BROWSER_TYPE_BAIDU_GAME_SUB', 'BROWSER_TYPE_XIAOMI_GAME', 'BROWSER_TYPE_ALIPAY_GAME'], 'cc.sys'); // cc.Director

  provideClearError(cc.Director, {
    EVENT_PROJECTION_CHANGED: '',
    EVENT_BEFORE_VISIT: 'EVENT_AFTER_UPDATE',
    EVENT_AFTER_VISIT: 'EVENT_BEFORE_DRAW'
  }, 'cc.Director');
  markFunctionWarning(cc.Director.prototype, {
    convertToGL: 'cc.view.convertToLocationInView',
    convertToUI: '',
    getWinSize: 'cc.winSize',
    getWinSizeInPixels: 'cc.winSize',
    getVisibleSize: 'cc.view.getVisibleSize',
    getVisibleOrigin: 'cc.view.getVisibleOrigin',
    purgeCachedData: 'cc.assetManager.releaseAll',
    setDepthTest: 'cc.Camera.main.depth',
    setClearColor: 'cc.Camera.main.backgroundColor',
    getRunningScene: 'cc.director.getScene',
    getAnimationInterval: 'cc.game.getFrameRate',
    setAnimationInterval: 'cc.game.setFrameRate',
    isDisplayStats: 'cc.debug.isDisplayStats',
    setDisplayStats: 'cc.debug.setDisplayStats',
    stopAnimation: 'cc.game.pause',
    startAnimation: 'cc.game.resume'
  }, 'cc.Director');
  markAsRemoved(cc.Director, ['pushScene', 'popScene', 'popToRootScene', 'popToSceneStackLevel', 'setProjection', 'getProjection'], 'cc.Director'); // Scheduler

  provideClearError(cc.Scheduler, {
    scheduleCallbackForTarget: 'schedule',
    scheduleUpdateForTarget: 'scheduleUpdate',
    unscheduleCallbackForTarget: 'unschedule',
    unscheduleUpdateForTarget: 'unscheduleUpdate',
    unscheduleAllCallbacksForTarget: 'unscheduleAllForTarget',
    unscheduleAllCallbacks: 'unscheduleAll',
    unscheduleAllCallbacksWithMinPriority: 'unscheduleAllWithMinPriority'
  }, 'cc.Scheduler'); // cc.view

  provideClearError(cc.view, {
    adjustViewPort: 'adjustViewportMeta',
    setViewPortInPoints: 'setViewportInPoints',
    getViewPortRect: 'getViewportRect'
  }, 'cc.view');
  markAsRemovedInObject(cc.view, ['isViewReady', 'setTargetDensityDPI', 'getTargetDensityDPI', 'setFrameZoomFactor', 'canSetContentScaleFactor', 'setContentTranslateLeftTop', 'getContentTranslateLeftTop', 'setViewName', 'getViewName'], 'cc.view'); // cc.PhysicsManager

  markAsRemoved(cc.PhysicsManager, ['attachDebugDrawToCamera', 'detachDebugDrawFromCamera']); // cc.CollisionManager

  markAsRemoved(cc.CollisionManager, ['attachDebugDrawToCamera', 'detachDebugDrawFromCamera']); // cc.Node

  provideClearError(cc._BaseNode.prototype, {
    'tag': 'name',
    'getTag': 'name',
    'setTag': 'name',
    'getChildByTag': 'getChildByName',
    'removeChildByTag': 'getChildByName(name).destroy()'
  });
  markAsRemoved(cc.Node, ['_cascadeColorEnabled', 'cascadeColor', 'isCascadeColorEnabled', 'setCascadeColorEnabled', '_cascadeOpacityEnabled', 'cascadeOpacity', 'isCascadeOpacityEnabled', 'setCascadeOpacityEnabled', 'opacityModifyRGB', 'isOpacityModifyRGB', 'setOpacityModifyRGB', 'ignoreAnchor', 'isIgnoreAnchorPointForPosition', 'ignoreAnchorPointForPosition', 'isRunning', '_sgNode']);
  markFunctionWarning(cc.Node.prototype, {
    getNodeToParentTransform: 'getLocalMatrix',
    getNodeToParentTransformAR: 'getLocalMatrix',
    getNodeToWorldTransform: 'getWorldMatrix',
    getNodeToWorldTransformAR: 'getWorldMatrix',
    getParentToNodeTransform: 'getLocalMatrix',
    getWorldToNodeTransform: 'getWorldMatrix',
    convertTouchToNodeSpace: 'convertToNodeSpaceAR',
    convertTouchToNodeSpaceAR: 'convertToNodeSpaceAR',
    convertToWorldSpace: 'convertToWorldSpaceAR',
    convertToNodeSpace: 'convertToNodeSpaceAR'
  });
  provideClearError(cc.Node.prototype, {
    getRotationX: 'rotationX',
    setRotationX: 'rotationX',
    getRotationY: 'rotationY',
    setRotationY: 'rotationY',
    getPositionX: 'x',
    setPositionX: 'x',
    getPositionY: 'y',
    setPositionY: 'y',
    getSkewX: 'skewX',
    setSkewX: 'skewX',
    getSkewY: 'skewY',
    setSkewY: 'skewY',
    getScaleX: 'scaleX',
    setScaleX: 'scaleX',
    getScaleY: 'scaleY',
    setScaleY: 'scaleY',
    getOpacity: 'opacity',
    setOpacity: 'opacity',
    getColor: 'color',
    setColor: 'color',
    getLocalZOrder: 'zIndex',
    setLocalZOrder: 'zIndex'
  });
  provideClearError(cc.Sprite.prototype, {
    setInsetLeft: 'cc.SpriteFrame insetLeft',
    setInsetRight: 'cc.SpriteFrame insetRight',
    setInsetTop: 'cc.SpriteFrame insetTop',
    setInsetBottom: 'cc.SpriteFrame insetBottom'
  }); // cc.Material

  cc.Material.getInstantiatedBuiltinMaterial = cc.MaterialVariant.createWithBuiltin;
  cc.Material.getInstantiatedMaterial = cc.MaterialVariant.create;
  markFunctionWarning(cc.Material, {
    getInstantiatedBuiltinMaterial: 'cc.MaterialVariant.createWithBuiltin',
    getInstantiatedMaterial: 'cc.MaterialVariant.create'
  }); // cc.RenderComponent

  cc.js.getset(cc.RenderComponent.prototype, 'sharedMaterials', function () {
    cc.warnID(1400, 'sharedMaterials', 'getMaterials');
    return this.materials;
  }, function (v) {
    cc.warnID(1400, 'sharedMaterials', 'setMaterial');
    this.materials = v;
  }); // cc.Camera

  markFunctionWarning(cc.Camera.prototype, {
    getNodeToCameraTransform: 'getWorldToScreenMatrix2D',
    getCameraToWorldPoint: 'getScreenToWorldPoint',
    getWorldToCameraPoint: 'getWorldToScreenPoint',
    getCameraToWorldMatrix: 'getScreenToWorldMatrix2D',
    getWorldToCameraMatrix: 'getWorldToScreenMatrix2D'
  });
  markAsRemoved(cc.Camera, ['addTarget', 'removeTarget', 'getTargets']); // SCENE

  var ERR = '"%s" is not defined in the Scene, it is only defined in normal nodes.';
  CC_EDITOR || Object.defineProperties(cc.Scene.prototype, {
    active: {
      get: function get() {
        cc.error(ERR, 'active');
        return true;
      },
      set: function set() {
        cc.error(ERR, 'active');
      }
    },
    activeInHierarchy: {
      get: function get() {
        cc.error(ERR, 'activeInHierarchy');
        return true;
      }
    },
    getComponent: {
      get: function get() {
        cc.error(ERR, 'getComponent');
        return function () {
          return null;
        };
      }
    },
    addComponent: {
      get: function get() {
        cc.error(ERR, 'addComponent');
        return function () {
          return null;
        };
      }
    }
  }); // cc.dynamicAtlasManager

  markAsRemovedInObject(cc.dynamicAtlasManager, ['minFrameSize'], 'cc.dynamicAtlasManager'); // light component

  if (cc.Light) {
    markAsRemovedInObject(cc.Light.prototype, ['shadowDepthScale'], 'cc.Light.prototype');
  } // Value types


  provideClearError(cc, {
    // AffineTransform
    affineTransformMake: 'cc.AffineTransform.create',
    affineTransformMakeIdentity: 'cc.AffineTransform.identity',
    affineTransformClone: 'cc.AffineTransform.clone',
    affineTransformConcat: 'cc.AffineTransform.concat',
    affineTransformConcatIn: 'cc.AffineTransform.concat',
    affineTransformInvert: 'cc.AffineTransform.invert',
    affineTransformInvertIn: 'cc.AffineTransform.invert',
    affineTransformInvertOut: 'cc.AffineTransform.invert',
    affineTransformEqualToTransform: 'cc.AffineTransform.equal',
    pointApplyAffineTransform: 'cc.AffineTransform.transformVec2',
    sizeApplyAffineTransform: 'cc.AffineTransform.transformSize',
    rectApplyAffineTransform: 'cc.AffineTransform.transformRect',
    obbApplyAffineTransform: 'cc.AffineTransform.transformObb',
    // Vec2
    pointEqualToPoint: 'cc.Vec2 equals',
    // Size
    sizeEqualToSize: 'cc.Size equals',
    // Rect
    rectEqualToRect: 'rectA.equals(rectB)',
    rectContainsRect: 'rectA.containsRect(rectB)',
    rectContainsPoint: 'rect.contains(vec2)',
    rectOverlapsRect: 'rectA.intersects(rectB)',
    rectIntersectsRect: 'rectA.intersects(rectB)',
    rectIntersection: 'rectA.intersection(intersection, rectB)',
    rectUnion: 'rectA.union(union, rectB)',
    rectGetMaxX: 'rect.xMax',
    rectGetMidX: 'rect.center.x',
    rectGetMinX: 'rect.xMin',
    rectGetMaxY: 'rect.yMax',
    rectGetMidY: 'rect.center.y',
    rectGetMinY: 'rect.yMin',
    // Color
    colorEqual: 'colorA.equals(colorB)',
    hexToColor: 'color.fromHEX(hexColor)',
    colorToHex: 'color.toHEX()',
    // Enums
    TextAlignment: 'cc.macro.TextAlignment',
    VerticalTextAlignment: 'cc.macro.VerticalTextAlignment',
    // Point Extensions
    pNeg: 'p.neg()',
    pAdd: 'p1.add(p2)',
    pSub: 'p1.sub(p2)',
    pMult: 'p.mul(factor)',
    pMidpoint: 'p1.add(p2).mul(0.5)',
    pDot: 'p1.dot(p2)',
    pCross: 'p1.cross(p2)',
    pPerp: 'p.rotate(-90 * Math.PI / 180)',
    pRPerp: 'p.rotate(90 * Math.PI / 180)',
    pProject: 'p1.project(p2)',
    pLengthSQ: 'p.magSqr()',
    pDistanceSQ: 'p1.sub(p2).magSqr()',
    pLength: 'p.mag()',
    pDistance: 'p1.sub(p2).mag()',
    pNormalize: 'p.normalize()',
    pForAngle: 'cc.v2(Math.cos(a), Math.sin(a))',
    pToAngle: 'Math.atan2(v.y, v.x)',
    pZeroIn: 'p.x = p.y = 0',
    pIn: 'p1.set(p2)',
    pMultIn: 'p.mulSelf(factor)',
    pSubIn: 'p1.subSelf(p2)',
    pAddIn: 'p1.addSelf(p2)',
    pNormalizeIn: 'p.normalizeSelf()',
    pSameAs: 'p1.equals(p2)',
    pAngle: 'v1.angle(v2)',
    pAngleSigned: 'v1.signAngle(v2)',
    pRotateByAngle: 'p.rotate(radians)',
    pCompMult: 'v1.multiply(v2)',
    pFuzzyEqual: 'v1.fuzzyEquals(v2, tolerance)',
    pLerp: 'p.lerp(endPoint, ratio)',
    pClamp: 'p.clampf(min_inclusive, max_inclusive)',
    rand: 'Math.random() * 0xffffff',
    randomMinus1To1: '(Math.random() - 0.5) * 2',
    container: 'cc.game.container',
    _canvas: 'cc.game.canvas',
    _renderType: 'cc.game.renderType',
    _getError: 'cc.debug.getError',
    _initDebugSetting: 'cc.debug._resetDebugSetting',
    DebugMode: 'cc.debug.DebugMode'
  }, 'cc');
  markAsRemovedInObject(cc, ['blendFuncDisable', 'pFromSize', 'pCompOp', 'pIntersectPoint', 'pSegmentIntersect', 'pLineIntersect', 'obbApplyMatrix', 'getImageFormatByData', 'initEngine'], 'cc');
  markFunctionWarning(cc, {
    // cc.p
    p: 'cc.v2'
  }, 'cc'); // cc.Rect

  provideClearError(cc.Rect, {
    contain: 'rectA.contains(rectB)',
    transformMat4: 'rect.transformMat4(out, mat4)'
  }); // cc.Color

  provideClearError(cc.Color, {
    rgb2hsv: 'color.toHSV()',
    hsv2rgb: 'color.fromHSV(h, s, v)'
  });
  markFunctionWarning(cc.Color, {
    fromHex: 'cc.Color.fromHEX'
  }); // macro functions

  js.get(cc, 'lerp', function () {
    cc.errorID(1400, 'cc.lerp', 'cc.misc.lerp');
    return cc.misc.lerp;
  });
  js.get(cc, 'random0To1', function () {
    cc.errorID(1400, 'cc.random0To1', 'Math.random');
    return Math.random;
  });
  js.get(cc, 'degreesToRadians', function () {
    cc.errorID(1400, 'cc.degreesToRadians', 'cc.misc.degreesToRadians');
    return cc.misc.degreesToRadians;
  });
  js.get(cc, 'radiansToDegrees', function () {
    cc.errorID(1400, 'cc.radiansToDegrees', 'cc.misc.radiansToDegrees');
    return cc.misc.radiansToDegrees;
  });
  js.get(cc, 'clampf', function () {
    cc.errorID(1400, 'cc.clampf', 'cc.misc.clampf');
    return cc.misc.clampf;
  });
  js.get(cc, 'clamp01', function () {
    cc.errorID(1400, 'cc.clamp01', 'cc.misc.clamp01');
    return cc.misc.clamp01;
  });
  js.get(cc, 'ImageFormat', function () {
    cc.errorID(1400, 'cc.ImageFormat', 'cc.macro.ImageFormat');
    return cc.macro.ImageFormat;
  });
  js.get(cc, 'KEY', function () {
    cc.errorID(1400, 'cc.KEY', 'cc.macro.KEY');
    return cc.macro.KEY;
  });
  js.get(cc, 'Easing', function () {
    cc.errorID(1400, 'cc.Easing', 'cc.easing');
    return cc.easing;
  }); // cc.isChildClassOf

  js.get(cc, 'isChildClassOf', function () {
    cc.errorID(1400, 'cc.isChildClassOf', 'cc.js.isChildClassOf');
    return cc.js.isChildClassOf;
  }); // dragon bones

  if (typeof dragonBones !== 'undefined') {
    js.get(dragonBones.CCFactory, 'getFactory', function () {
      cc.errorID(1400, 'dragonBones.CCFactory.getFactory', 'dragonBones.CCFactory.getInstance');
      return dragonBones.CCFactory.getInstance;
    });
  } // renderEngine


  cc.renderer.renderEngine = {
    get gfx() {
      cc.warnID(1400, 'cc.renderer.renderEngine.gfx', 'cc.gfx');
      return cc.gfx;
    },

    get math() {
      cc.warnID(1400, 'cc.renderer.renderEngine.math', 'cc.math');
      return cc.vmath;
    },

    get InputAssembler() {
      cc.warnID(1400, 'cc.renderer.renderEngine.InputAssembler', 'cc.renderer.InputAssembler');
      return cc.renderer.InputAssembler;
    }

  }; // audio

  markAsRemovedInObject(cc.audioEngine, ['getProfile', 'preload', 'setMaxWebAudioSize'], 'cc.audioEngine');
}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9kZXByZWNhdGVkLmpzIl0sIm5hbWVzIjpbImpzIiwiY2MiLCJDQ19ERUJVRyIsImRlcHJlY2F0ZUVudW0iLCJvYmoiLCJvbGRQYXRoIiwibmV3UGF0aCIsImhhc1R5cGVQcmVmaXhCZWZvcmUiLCJDQ19TVVBQT1JUX0pJVCIsImVudW1EZWYiLCJGdW5jdGlvbiIsImVudHJpZXMiLCJFbnVtIiwiZ2V0TGlzdCIsImRlbGltaXRlciIsImkiLCJsZW5ndGgiLCJlbnRyeSIsIm5hbWUiLCJvbGRQcm9wTmFtZSIsIm9sZFR5cGVOYW1lIiwic3BsaXQiLCJzbGljZSIsImdldCIsImVycm9ySUQiLCJiaW5kIiwibWFya0FzUmVtb3ZlZCIsIm93bmVyQ3RvciIsInJlbW92ZWRQcm9wcyIsIm93bmVyTmFtZSIsImdldENsYXNzTmFtZSIsImZvckVhY2giLCJwcm9wIiwiZXJyb3IiLCJnZXRzZXQiLCJwcm90b3R5cGUiLCJtYXJrQXNEZXByZWNhdGVkIiwiZGVwcmVjYXRlZFByb3BzIiwiZGVzY3JpcHRvcnMiLCJPYmplY3QiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIiwiZGVwcmVjYXRlZFByb3AiLCJuZXdQcm9wIiwiZGVzY3JpcHRvciIsIndhcm5JRCIsImNhbGwiLCJ2Iiwic2V0IiwibWFya0FzUmVtb3ZlZEluT2JqZWN0Iiwib3duZXJPYmoiLCJwcm92aWRlQ2xlYXJFcnJvciIsIm93bmVyIiwiY2xhc3NOYW1lIiwiSW5mbyIsImRlZmluZSIsImFjY2Vzc29yIiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwieCIsInRyaW0iLCJlIiwiZXRQcm9wIiwibWFya0Z1bmN0aW9uV2FybmluZyIsInByb3BOYW1lIiwib3JpZ2luRnVuYyIsIndhcm4iLCJhcHBseSIsImFyZ3VtZW50cyIsImxvZyIsIm1hdGgiLCJWZWMyIiwiVmVjMyIsIlZlYzQiLCJNYXQ0IiwiTWF0MyIsIlF1YXQiLCJTcHJpdGVGcmFtZSIsInRleHR1cmVMb2FkZWQiLCJTcHJpdGUiLCJzZXRTdGF0ZSIsImdldFN0YXRlIiwiVGV4dHVyZTJEIiwiZGVzdHJveSIsIl9nbElEIiwibG9hZGVkIiwic2V0RmlsdGVycyIsIkZpbHRlciIsIkxJTkVBUiIsIk5FQVJFU1QiLCJtYWNybyIsIlBJIiwiUEkyIiwiRkxUX01BWCIsIkZMVF9NSU4iLCJVSU5UX01BWCIsImdhbWUiLCJzeXMiLCJEaXJlY3RvciIsIkVWRU5UX1BST0pFQ1RJT05fQ0hBTkdFRCIsIkVWRU5UX0JFRk9SRV9WSVNJVCIsIkVWRU5UX0FGVEVSX1ZJU0lUIiwiY29udmVydFRvR0wiLCJjb252ZXJ0VG9VSSIsImdldFdpblNpemUiLCJnZXRXaW5TaXplSW5QaXhlbHMiLCJnZXRWaXNpYmxlU2l6ZSIsImdldFZpc2libGVPcmlnaW4iLCJwdXJnZUNhY2hlZERhdGEiLCJzZXREZXB0aFRlc3QiLCJzZXRDbGVhckNvbG9yIiwiZ2V0UnVubmluZ1NjZW5lIiwiZ2V0QW5pbWF0aW9uSW50ZXJ2YWwiLCJzZXRBbmltYXRpb25JbnRlcnZhbCIsImlzRGlzcGxheVN0YXRzIiwic2V0RGlzcGxheVN0YXRzIiwic3RvcEFuaW1hdGlvbiIsInN0YXJ0QW5pbWF0aW9uIiwiU2NoZWR1bGVyIiwic2NoZWR1bGVDYWxsYmFja0ZvclRhcmdldCIsInNjaGVkdWxlVXBkYXRlRm9yVGFyZ2V0IiwidW5zY2hlZHVsZUNhbGxiYWNrRm9yVGFyZ2V0IiwidW5zY2hlZHVsZVVwZGF0ZUZvclRhcmdldCIsInVuc2NoZWR1bGVBbGxDYWxsYmFja3NGb3JUYXJnZXQiLCJ1bnNjaGVkdWxlQWxsQ2FsbGJhY2tzIiwidW5zY2hlZHVsZUFsbENhbGxiYWNrc1dpdGhNaW5Qcmlvcml0eSIsInZpZXciLCJhZGp1c3RWaWV3UG9ydCIsInNldFZpZXdQb3J0SW5Qb2ludHMiLCJnZXRWaWV3UG9ydFJlY3QiLCJQaHlzaWNzTWFuYWdlciIsIkNvbGxpc2lvbk1hbmFnZXIiLCJfQmFzZU5vZGUiLCJOb2RlIiwiZ2V0Tm9kZVRvUGFyZW50VHJhbnNmb3JtIiwiZ2V0Tm9kZVRvUGFyZW50VHJhbnNmb3JtQVIiLCJnZXROb2RlVG9Xb3JsZFRyYW5zZm9ybSIsImdldE5vZGVUb1dvcmxkVHJhbnNmb3JtQVIiLCJnZXRQYXJlbnRUb05vZGVUcmFuc2Zvcm0iLCJnZXRXb3JsZFRvTm9kZVRyYW5zZm9ybSIsImNvbnZlcnRUb3VjaFRvTm9kZVNwYWNlIiwiY29udmVydFRvdWNoVG9Ob2RlU3BhY2VBUiIsImNvbnZlcnRUb1dvcmxkU3BhY2UiLCJjb252ZXJ0VG9Ob2RlU3BhY2UiLCJnZXRSb3RhdGlvblgiLCJzZXRSb3RhdGlvblgiLCJnZXRSb3RhdGlvblkiLCJzZXRSb3RhdGlvblkiLCJnZXRQb3NpdGlvblgiLCJzZXRQb3NpdGlvblgiLCJnZXRQb3NpdGlvblkiLCJzZXRQb3NpdGlvblkiLCJnZXRTa2V3WCIsInNldFNrZXdYIiwiZ2V0U2tld1kiLCJzZXRTa2V3WSIsImdldFNjYWxlWCIsInNldFNjYWxlWCIsImdldFNjYWxlWSIsInNldFNjYWxlWSIsImdldE9wYWNpdHkiLCJzZXRPcGFjaXR5IiwiZ2V0Q29sb3IiLCJzZXRDb2xvciIsImdldExvY2FsWk9yZGVyIiwic2V0TG9jYWxaT3JkZXIiLCJzZXRJbnNldExlZnQiLCJzZXRJbnNldFJpZ2h0Iiwic2V0SW5zZXRUb3AiLCJzZXRJbnNldEJvdHRvbSIsIk1hdGVyaWFsIiwiZ2V0SW5zdGFudGlhdGVkQnVpbHRpbk1hdGVyaWFsIiwiTWF0ZXJpYWxWYXJpYW50IiwiY3JlYXRlV2l0aEJ1aWx0aW4iLCJnZXRJbnN0YW50aWF0ZWRNYXRlcmlhbCIsImNyZWF0ZSIsIlJlbmRlckNvbXBvbmVudCIsIm1hdGVyaWFscyIsIkNhbWVyYSIsImdldE5vZGVUb0NhbWVyYVRyYW5zZm9ybSIsImdldENhbWVyYVRvV29ybGRQb2ludCIsImdldFdvcmxkVG9DYW1lcmFQb2ludCIsImdldENhbWVyYVRvV29ybGRNYXRyaXgiLCJnZXRXb3JsZFRvQ2FtZXJhTWF0cml4IiwiRVJSIiwiQ0NfRURJVE9SIiwiZGVmaW5lUHJvcGVydGllcyIsIlNjZW5lIiwiYWN0aXZlIiwiYWN0aXZlSW5IaWVyYXJjaHkiLCJnZXRDb21wb25lbnQiLCJhZGRDb21wb25lbnQiLCJkeW5hbWljQXRsYXNNYW5hZ2VyIiwiTGlnaHQiLCJhZmZpbmVUcmFuc2Zvcm1NYWtlIiwiYWZmaW5lVHJhbnNmb3JtTWFrZUlkZW50aXR5IiwiYWZmaW5lVHJhbnNmb3JtQ2xvbmUiLCJhZmZpbmVUcmFuc2Zvcm1Db25jYXQiLCJhZmZpbmVUcmFuc2Zvcm1Db25jYXRJbiIsImFmZmluZVRyYW5zZm9ybUludmVydCIsImFmZmluZVRyYW5zZm9ybUludmVydEluIiwiYWZmaW5lVHJhbnNmb3JtSW52ZXJ0T3V0IiwiYWZmaW5lVHJhbnNmb3JtRXF1YWxUb1RyYW5zZm9ybSIsInBvaW50QXBwbHlBZmZpbmVUcmFuc2Zvcm0iLCJzaXplQXBwbHlBZmZpbmVUcmFuc2Zvcm0iLCJyZWN0QXBwbHlBZmZpbmVUcmFuc2Zvcm0iLCJvYmJBcHBseUFmZmluZVRyYW5zZm9ybSIsInBvaW50RXF1YWxUb1BvaW50Iiwic2l6ZUVxdWFsVG9TaXplIiwicmVjdEVxdWFsVG9SZWN0IiwicmVjdENvbnRhaW5zUmVjdCIsInJlY3RDb250YWluc1BvaW50IiwicmVjdE92ZXJsYXBzUmVjdCIsInJlY3RJbnRlcnNlY3RzUmVjdCIsInJlY3RJbnRlcnNlY3Rpb24iLCJyZWN0VW5pb24iLCJyZWN0R2V0TWF4WCIsInJlY3RHZXRNaWRYIiwicmVjdEdldE1pblgiLCJyZWN0R2V0TWF4WSIsInJlY3RHZXRNaWRZIiwicmVjdEdldE1pblkiLCJjb2xvckVxdWFsIiwiaGV4VG9Db2xvciIsImNvbG9yVG9IZXgiLCJUZXh0QWxpZ25tZW50IiwiVmVydGljYWxUZXh0QWxpZ25tZW50IiwicE5lZyIsInBBZGQiLCJwU3ViIiwicE11bHQiLCJwTWlkcG9pbnQiLCJwRG90IiwicENyb3NzIiwicFBlcnAiLCJwUlBlcnAiLCJwUHJvamVjdCIsInBMZW5ndGhTUSIsInBEaXN0YW5jZVNRIiwicExlbmd0aCIsInBEaXN0YW5jZSIsInBOb3JtYWxpemUiLCJwRm9yQW5nbGUiLCJwVG9BbmdsZSIsInBaZXJvSW4iLCJwSW4iLCJwTXVsdEluIiwicFN1YkluIiwicEFkZEluIiwicE5vcm1hbGl6ZUluIiwicFNhbWVBcyIsInBBbmdsZSIsInBBbmdsZVNpZ25lZCIsInBSb3RhdGVCeUFuZ2xlIiwicENvbXBNdWx0IiwicEZ1enp5RXF1YWwiLCJwTGVycCIsInBDbGFtcCIsInJhbmQiLCJyYW5kb21NaW51czFUbzEiLCJjb250YWluZXIiLCJfY2FudmFzIiwiX3JlbmRlclR5cGUiLCJfZ2V0RXJyb3IiLCJfaW5pdERlYnVnU2V0dGluZyIsIkRlYnVnTW9kZSIsInAiLCJSZWN0IiwiY29udGFpbiIsInRyYW5zZm9ybU1hdDQiLCJDb2xvciIsInJnYjJoc3YiLCJoc3YycmdiIiwiZnJvbUhleCIsIm1pc2MiLCJsZXJwIiwiTWF0aCIsInJhbmRvbSIsImRlZ3JlZXNUb1JhZGlhbnMiLCJyYWRpYW5zVG9EZWdyZWVzIiwiY2xhbXBmIiwiY2xhbXAwMSIsIkltYWdlRm9ybWF0IiwiS0VZIiwiZWFzaW5nIiwiaXNDaGlsZENsYXNzT2YiLCJkcmFnb25Cb25lcyIsIkNDRmFjdG9yeSIsImdldEluc3RhbmNlIiwicmVuZGVyZXIiLCJyZW5kZXJFbmdpbmUiLCJnZngiLCJ2bWF0aCIsIklucHV0QXNzZW1ibGVyIiwiYXVkaW9FbmdpbmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQSxJQUFJQSxFQUFFLEdBQUdDLEVBQUUsQ0FBQ0QsRUFBWjs7QUFFQSxJQUFJRSxRQUFKLEVBQWM7QUFBQSxNQUVEQyxhQUZDLEdBRVYsU0FBU0EsYUFBVCxDQUF3QkMsR0FBeEIsRUFBNkJDLE9BQTdCLEVBQXNDQyxP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QnBTLE1BQUFBLEVBQUUsQ0FBQzJDLE1BQUgsQ0FBVSxJQUFWLEVBQWdCLHlDQUFoQixFQUEyRCw0QkFBM0Q7QUFDQSxhQUFPM0MsRUFBRSxDQUFDZ1MsUUFBSCxDQUFZSSxjQUFuQjtBQUNIOztBQVpzQixHQUEzQixDQTlwQlUsQ0E2cUJWOztBQUNBclAsRUFBQUEscUJBQXFCLENBQUMvQyxFQUFFLENBQUNxUyxXQUFKLEVBQWlCLENBQ2xDLFlBRGtDLEVBRWxDLFNBRmtDLEVBR2xDLG9CQUhrQyxDQUFqQixFQUlsQixnQkFKa0IsQ0FBckI7QUFLSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxudmFyIGpzID0gY2MuanM7XG5cbmlmIChDQ19ERUJVRykge1xuXG4gICAgZnVuY3Rpb24gZGVwcmVjYXRlRW51bSAob2JqLCBvbGRQYXRoLCBuZXdQYXRoLCBoYXNUeXBlUHJlZml4QmVmb3JlKSB7XG4gICAgICAgIGlmICghQ0NfU1VQUE9SVF9KSVQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBoYXNUeXBlUHJlZml4QmVmb3JlID0gaGFzVHlwZVByZWZpeEJlZm9yZSAhPT0gZmFsc2U7XG4gICAgICAgIHZhciBlbnVtRGVmID0gRnVuY3Rpb24oJ3JldHVybiAnICsgbmV3UGF0aCkoKTtcbiAgICAgICAgdmFyIGVudHJpZXMgPSBjYy5FbnVtLmdldExpc3QoZW51bURlZik7XG4gICAgICAgIHZhciBkZWxpbWl0ZXIgPSBoYXNUeXBlUHJlZml4QmVmb3JlID8gJ18nIDogJy4nO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaV0ubmFtZTtcbiAgICAgICAgICAgIHZhciBvbGRQcm9wTmFtZTtcbiAgICAgICAgICAgIGlmIChoYXNUeXBlUHJlZml4QmVmb3JlKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9sZFR5cGVOYW1lID0gb2xkUGF0aC5zcGxpdCgnLicpLnNsaWNlKC0xKVswXTtcbiAgICAgICAgICAgICAgICBvbGRQcm9wTmFtZSA9IG9sZFR5cGVOYW1lICsgJ18nICsgZW50cnk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBvbGRQcm9wTmFtZSA9IGVudHJ5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAganMuZ2V0KG9iaiwgb2xkUHJvcE5hbWUsIGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMTQwMCwgb2xkUGF0aCArIGRlbGltaXRlciArIGVudHJ5LCBuZXdQYXRoICsgJy4nICsgZW50cnkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBlbnVtRGVmW2VudHJ5XTtcbiAgICAgICAgICAgIH0uYmluZChudWxsLCBlbnRyeSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFya0FzUmVtb3ZlZCAob3duZXJDdG9yLCByZW1vdmVkUHJvcHMsIG93bmVyTmFtZSkge1xuICAgICAgICBpZiAoIW93bmVyQ3Rvcikge1xuICAgICAgICAgICAgLy8g5Y+v6IO96KKr6KOB5Ymq5LqGXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgb3duZXJOYW1lID0gb3duZXJOYW1lIHx8IGpzLmdldENsYXNzTmFtZShvd25lckN0b3IpO1xuICAgICAgICByZW1vdmVkUHJvcHMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gZXJyb3IgKCkge1xuICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMTQwNiwgb3duZXJOYW1lLCBwcm9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGpzLmdldHNldChvd25lckN0b3IucHJvdG90eXBlLCBwcm9wLCBlcnJvciwgZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXJrQXNEZXByZWNhdGVkIChvd25lckN0b3IsIGRlcHJlY2F0ZWRQcm9wcywgb3duZXJOYW1lKSB7XG4gICAgICAgIGlmICghb3duZXJDdG9yKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgb3duZXJOYW1lID0gb3duZXJOYW1lIHx8IGpzLmdldENsYXNzTmFtZShvd25lckN0b3IpO1xuICAgICAgICBsZXQgZGVzY3JpcHRvcnMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvd25lckN0b3IucHJvdG90eXBlKTtcbiAgICAgICAgZGVwcmVjYXRlZFByb3BzLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgICAgICAgIGxldCBkZXByZWNhdGVkUHJvcCA9IHByb3BbMF07XG4gICAgICAgICAgICBsZXQgbmV3UHJvcCA9IHByb3BbMV07XG4gICAgICAgICAgICBsZXQgZGVzY3JpcHRvciA9IGRlc2NyaXB0b3JzW2RlcHJlY2F0ZWRQcm9wXTtcbiAgICAgICAgICAgIGpzLmdldHNldChvd25lckN0b3IucHJvdG90eXBlLCBkZXByZWNhdGVkUHJvcCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCgxNDAwLCBgJHtvd25lck5hbWV9LiR7ZGVwcmVjYXRlZFByb3B9YCwgYCR7b3duZXJOYW1lfS4ke25ld1Byb3B9YCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IuZ2V0LmNhbGwodGhpcyk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCgxNDAwLCBgJHtvd25lck5hbWV9LiR7ZGVwcmVjYXRlZFByb3B9YCwgYCR7b3duZXJOYW1lfS4ke25ld1Byb3B9YCk7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRvci5zZXQuY2FsbCh0aGlzLCB2KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1hcmtBc1JlbW92ZWRJbk9iamVjdCAob3duZXJPYmosIHJlbW92ZWRQcm9wcywgb3duZXJOYW1lKSB7XG4gICAgICAgIGlmICghb3duZXJPYmopIHtcbiAgICAgICAgICAgIC8vIOWPr+iDveiiq+ijgeWJquS6hlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlbW92ZWRQcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBlcnJvciAoKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgxNDA2LCBvd25lck5hbWUsIHByb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAganMuZ2V0c2V0KG93bmVyT2JqLCBwcm9wLCBlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByb3ZpZGVDbGVhckVycm9yIChvd25lciwgb2JqLCBvd25lck5hbWUpIHtcbiAgICAgICAgaWYgKCFvd25lcikge1xuICAgICAgICAgICAgLy8g5Y+v6IO96KKr6KOB5Ymq5LqGXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNsYXNzTmFtZSA9IG93bmVyTmFtZSB8fCBjYy5qcy5nZXRDbGFzc05hbWUob3duZXIpO1xuICAgICAgICB2YXIgSW5mbyA9ICdTb3JyeSwgJyArIGNsYXNzTmFtZSArICcuJXMgaXMgcmVtb3ZlZCwgcGxlYXNlIHVzZSAlcyBpbnN0ZWFkLic7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBkZWZpbmUgKHByb3AsIGdldHNldCkge1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGFjY2Vzc29yIChuZXdQcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmVycm9yKEluZm8sIHByb3AsIG5ld1Byb3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZ2V0c2V0KSkge1xuICAgICAgICAgICAgICAgICAgICBnZXRzZXQgPSBnZXRzZXQuc3BsaXQoJywnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4LnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBqcy5nZXRzZXQob3duZXIsIHByb3AsIGFjY2Vzc29yLmJpbmQobnVsbCwgZ2V0c2V0WzBdKSwgZ2V0c2V0WzFdICYmIGFjY2Vzc29yLmJpbmQobnVsbCwgZ2V0c2V0WzFdKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7fVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGdldHNldCA9IG9ialtwcm9wXTtcbiAgICAgICAgICAgIGlmIChwcm9wWzBdID09PSAnKicpIHtcbiAgICAgICAgICAgICAgICAvLyBnZXQgc2V0XG4gICAgICAgICAgICAgICAgdmFyIGV0UHJvcCA9IHByb3Auc2xpY2UoMSk7XG4gICAgICAgICAgICAgICAgZGVmaW5lKCdnJyArIGV0UHJvcCwgZ2V0c2V0KTtcbiAgICAgICAgICAgICAgICBkZWZpbmUoJ3MnICsgZXRQcm9wLCBnZXRzZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJvcC5zcGxpdCgnLCcpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4LnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmluZSh4LCBnZXRzZXQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1hcmtGdW5jdGlvbldhcm5pbmcgKG93bmVyQ3Rvciwgb2JqLCBvd25lck5hbWUpIHtcbiAgICAgICAgaWYgKCFvd25lckN0b3IpIHtcbiAgICAgICAgICAgIC8vIOWPr+iDveiiq+ijgeWJquS6hlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG93bmVyTmFtZSA9IG93bmVyTmFtZSB8fCBqcy5nZXRDbGFzc05hbWUob3duZXJDdG9yKTtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcbiAgICAgICAgICAgIChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBwcm9wTmFtZSA9IHByb3A7XG4gICAgICAgICAgICAgICAgdmFyIG9yaWdpbkZ1bmMgPSBvd25lckN0b3JbcHJvcE5hbWVdO1xuICAgICAgICAgICAgICAgIGlmICghb3JpZ2luRnVuYykgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gd2FybiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm4oJ1NvcnJ5LCAlcy4lcyBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlICVzIGluc3RlYWQnLCBvd25lck5hbWUsIHByb3BOYW1lLCBvYmpbcHJvcE5hbWVdKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbkZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBvd25lckN0b3JbcHJvcE5hbWVdID0gd2FybjtcbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gcmVtb3ZlIGNjLmluZm9cbiAgICBqcy5nZXQoY2MsICdpbmZvJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5lcnJvcklEKDE0MDAsICdjYy5pbmZvJywgJ2NjLmxvZycpO1xuICAgICAgICByZXR1cm4gY2MubG9nO1xuICAgIH0pO1xuICAgIC8vIGNjLnNwcml0ZUZyYW1lQ2FjaGVcbiAgICBqcy5nZXQoY2MsIFwic3ByaXRlRnJhbWVDYWNoZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmVycm9ySUQoMTQwNCk7XG4gICAgfSk7XG5cbiAgICAvLyBjYy52bWF0aFxuICAgIGpzLmdldChjYywgJ3ZtYXRoJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy53YXJuSUQoMTQwMCwgJ2NjLnZtYXRoJywgJ2NjLm1hdGgnKTtcbiAgICAgICAgcmV0dXJuIGNjLm1hdGg7XG4gICAgfSk7XG4gICAganMuZ2V0KGNjLm1hdGgsICd2ZWMyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy53YXJuSUQoMTQwMCwgJ2NjLnZtYXRoLnZlYzInLCAnY2MuVmVjMicpO1xuICAgICAgICByZXR1cm4gY2MuVmVjMjtcbiAgICB9KVxuICAgIGpzLmdldChjYy5tYXRoLCAndmVjMycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Mud2FybklEKDE0MDAsICdjYy52bWF0aC52ZWMzJywgJ2NjLlZlYzMnKTtcbiAgICAgICAgcmV0dXJuIGNjLlZlYzM7XG4gICAgfSlcbiAgICBqcy5nZXQoY2MubWF0aCwgJ3ZlYzQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLndhcm5JRCgxNDAwLCAnY2Mudm1hdGgudmVjNCcsICdjYy5WZWM0Jyk7XG4gICAgICAgIHJldHVybiBjYy5WZWM0O1xuICAgIH0pXG4gICAganMuZ2V0KGNjLm1hdGgsICdtYXQ0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy53YXJuSUQoMTQwMCwgJ2NjLnZtYXRoLm1hdDQnLCAnY2MuTWF0NCcpO1xuICAgICAgICByZXR1cm4gY2MuTWF0NDtcbiAgICB9KVxuICAgIGpzLmdldChjYy5tYXRoLCAnbWF0MycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Mud2FybklEKDE0MDAsICdjYy52bWF0aC5tYXQzJywgJ2NjLk1hdDMnKTtcbiAgICAgICAgcmV0dXJuIGNjLk1hdDM7XG4gICAgfSlcbiAgICBqcy5nZXQoY2MubWF0aCwgJ3F1YXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLndhcm5JRCgxNDAwLCAnY2Mudm1hdGgucXVhdCcsICdjYy5RdWF0Jyk7XG4gICAgICAgIHJldHVybiBjYy5RdWF0O1xuICAgIH0pXG5cbiAgICAvLyBTcHJpdGVGcmFtZVxuICAgIGpzLmdldChjYy5TcHJpdGVGcmFtZS5wcm90b3R5cGUsICdfdGV4dHVyZUxvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuZXJyb3JJRCgxNDAwLCAnc3ByaXRlRnJhbWUuX3RleHR1cmVMb2FkZWQnLCAnc3ByaXRlRnJhbWUudGV4dHVyZUxvYWRlZCgpJyk7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHR1cmVMb2FkZWQoKTtcbiAgICB9KTtcbiAgICBtYXJrQXNSZW1vdmVkKGNjLlNwcml0ZUZyYW1lLCBbXG4gICAgICAgICdhZGRMb2FkZWRFdmVudExpc3RlbmVyJ1xuICAgIF0pO1xuICAgIG1hcmtGdW5jdGlvbldhcm5pbmcoY2MuU3ByaXRlLnByb3RvdHlwZSwge1xuICAgICAgICBzZXRTdGF0ZTogJ2NjLlNwcml0ZS5zZXRNYXRlcmlhbCcsXG4gICAgICAgIGdldFN0YXRlOiAnY2MuU3ByaXRlLmdldE1hdGVyaWFsJ1xuICAgIH0sICdjYy5TcHJpdGUnKTtcblxuICAgIGpzLmdldChjYy5TcHJpdGVGcmFtZS5wcm90b3R5cGUsICdjbGVhclRleHR1cmUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmVycm9ySUQoMTQwNiwgJ2NjLlNwcml0ZUZyYW1lJywgJ2NsZWFyVGV4dHVyZScpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge307XG4gICAgfSk7XG5cbiAgICAvLyBjYy50ZXh0dXJlQ2FjaGVcbiAgICBqcy5nZXQoY2MsICd0ZXh0dXJlQ2FjaGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmVycm9ySUQoMTQwNiwgJ2NjJywgJ3RleHR1cmVDYWNoZScpO1xuICAgIH0pO1xuXG4gICAgLy8gVGV4dHVyZVxuICAgIGxldCBUZXh0dXJlMkQgPSBjYy5UZXh0dXJlMkQ7XG4gICAganMuZ2V0KFRleHR1cmUyRC5wcm90b3R5cGUsICdyZWxlYXNlVGV4dHVyZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuZXJyb3JJRCgxNDAwLCAndGV4dHVyZS5yZWxlYXNlVGV4dHVyZSgpJywgJ3RleHR1cmUuZGVzdHJveSgpJyk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlc3Ryb3k7XG4gICAgfSk7XG5cbiAgICBqcy5nZXQoVGV4dHVyZTJELnByb3RvdHlwZSwgJ2dldE5hbWUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmVycm9ySUQoMTQwMCwgJ3RleHR1cmUuZ2V0TmFtZSgpJywgJ3RleHR1cmUuX2dsSUQnKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9nbElEIHx8IG51bGw7XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBqcy5nZXQoVGV4dHVyZTJELnByb3RvdHlwZSwgJ2lzTG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5lcnJvcklEKDE0MDAsICd0ZXh0dXJlLmlzTG9hZGVkIGZ1bmN0aW9uJywgJ3RleHR1cmUubG9hZGVkIHByb3BlcnR5Jyk7XG4gICAgICAgIHJldHVybiAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9hZGVkO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGpzLmdldChUZXh0dXJlMkQucHJvdG90eXBlLCAnc2V0QW50aUFsaWFzVGV4UGFyYW1ldGVycycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuZXJyb3JJRCgxNDAwLCAndGV4dHVyZS5zZXRBbnRpQWxpYXNUZXhQYXJhbWV0ZXJzKCknLCAndGV4dHVyZS5zZXRGaWx0ZXJzKGNjLlRleHR1cmUyRC5GaWx0ZXIuTElORUFSLCBjYy5UZXh0dXJlMkQuRmlsdGVyLkxJTkVBUiknKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RmlsdGVycyhUZXh0dXJlMkQuRmlsdGVyLkxJTkVBUiwgVGV4dHVyZTJELkZpbHRlci5MSU5FQVIpO1xuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAganMuZ2V0KFRleHR1cmUyRC5wcm90b3R5cGUsICdzZXRBbGlhc1RleFBhcmFtZXRlcnMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmVycm9ySUQoMTQwMCwgJ3RleHR1cmUuc2V0QW50aUFsaWFzVGV4UGFyYW1ldGVycygpJywgJ3RleHR1cmUuc2V0RmlsdGVycyhjYy5UZXh0dXJlMkQuRmlsdGVyLk5FQVJFU1QsIGNjLlRleHR1cmUyRC5GaWx0ZXIuTkVBUkVTVCknKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RmlsdGVycyhUZXh0dXJlMkQuRmlsdGVyLk5FQVJFU1QsIFRleHR1cmUyRC5GaWx0ZXIuTkVBUkVTVCk7XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvLyBjYy5tYWNyb1xuICAgIG1hcmtBc1JlbW92ZWRJbk9iamVjdChjYy5tYWNybywgW1xuICAgICAgICAnRU5BQkxFX0dMX1NUQVRFX0NBQ0hFJyxcbiAgICAgICAgJ0ZJWF9BUlRJRkFDVFNfQllfU1RSRUNISU5HX1RFWEVMJyxcbiAgICBdLCAnY2MubWFjcm8nKTtcblxuICAgIHByb3ZpZGVDbGVhckVycm9yKGNjLm1hY3JvLCB7XG4gICAgICAgIFBJOiAnTWF0aC5QSScsXG4gICAgICAgIFBJMjogJ01hdGguUEkgKiAyJyxcbiAgICAgICAgRkxUX01BWDogJ051bWJlci5NQVhfVkFMVUUnLFxuICAgICAgICBGTFRfTUlOOiAnTnVtYmVyLk1JTl9WQUxVRScsXG4gICAgICAgIFVJTlRfTUFYOiAnTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVInXG4gICAgfSwgJ2NjLm1hY3JvJyk7XG5cbiAgICAvLyBjYy5nYW1lXG4gICAgbWFya0FzUmVtb3ZlZEluT2JqZWN0KGNjLmdhbWUsIFtcbiAgICAgICAgJ0NPTkZJR19LRVknLFxuICAgIF0sICdjYy5nYW1lJyk7XG5cbiAgICAvLyBjYy5zeXNcbiAgICBtYXJrQXNSZW1vdmVkSW5PYmplY3QoY2Muc3lzLCBbXG4gICAgICAgICdkdW1wUm9vdCcsXG4gICAgICAgICdjbGVhblNjcmlwdCcsXG4gICAgICAgICdCUk9XU0VSX1RZUEVfV0VDSEFUX0dBTUUnLFxuICAgICAgICAnQlJPV1NFUl9UWVBFX1dFQ0hBVF9HQU1FX1NVQicsXG4gICAgICAgICdCUk9XU0VSX1RZUEVfQkFJRFVfR0FNRScsXG4gICAgICAgICdCUk9XU0VSX1RZUEVfQkFJRFVfR0FNRV9TVUInLFxuICAgICAgICAnQlJPV1NFUl9UWVBFX1hJQU9NSV9HQU1FJyxcbiAgICAgICAgJ0JST1dTRVJfVFlQRV9BTElQQVlfR0FNRScsXG4gICAgXSwgJ2NjLnN5cycpO1xuXG4gICAgLy8gY2MuRGlyZWN0b3JcbiAgICBwcm92aWRlQ2xlYXJFcnJvcihjYy5EaXJlY3Rvciwge1xuICAgICAgICBFVkVOVF9QUk9KRUNUSU9OX0NIQU5HRUQ6ICcnLFxuICAgICAgICBFVkVOVF9CRUZPUkVfVklTSVQ6ICdFVkVOVF9BRlRFUl9VUERBVEUnLFxuICAgICAgICBFVkVOVF9BRlRFUl9WSVNJVDogJ0VWRU5UX0JFRk9SRV9EUkFXJyxcbiAgICB9LCAnY2MuRGlyZWN0b3InKTtcbiAgICBtYXJrRnVuY3Rpb25XYXJuaW5nKGNjLkRpcmVjdG9yLnByb3RvdHlwZSwge1xuICAgICAgICBjb252ZXJ0VG9HTDogJ2NjLnZpZXcuY29udmVydFRvTG9jYXRpb25JblZpZXcnLFxuICAgICAgICBjb252ZXJ0VG9VSTogJycsXG4gICAgICAgIGdldFdpblNpemU6ICdjYy53aW5TaXplJyxcbiAgICAgICAgZ2V0V2luU2l6ZUluUGl4ZWxzOiAnY2Mud2luU2l6ZScsXG4gICAgICAgIGdldFZpc2libGVTaXplOiAnY2Mudmlldy5nZXRWaXNpYmxlU2l6ZScsXG4gICAgICAgIGdldFZpc2libGVPcmlnaW46ICdjYy52aWV3LmdldFZpc2libGVPcmlnaW4nLFxuICAgICAgICBwdXJnZUNhY2hlZERhdGE6ICdjYy5hc3NldE1hbmFnZXIucmVsZWFzZUFsbCcsXG4gICAgICAgIHNldERlcHRoVGVzdDogJ2NjLkNhbWVyYS5tYWluLmRlcHRoJyxcbiAgICAgICAgc2V0Q2xlYXJDb2xvcjogJ2NjLkNhbWVyYS5tYWluLmJhY2tncm91bmRDb2xvcicsXG4gICAgICAgIGdldFJ1bm5pbmdTY2VuZTogJ2NjLmRpcmVjdG9yLmdldFNjZW5lJyxcbiAgICAgICAgZ2V0QW5pbWF0aW9uSW50ZXJ2YWw6ICdjYy5nYW1lLmdldEZyYW1lUmF0ZScsXG4gICAgICAgIHNldEFuaW1hdGlvbkludGVydmFsOiAnY2MuZ2FtZS5zZXRGcmFtZVJhdGUnLFxuICAgICAgICBpc0Rpc3BsYXlTdGF0czogJ2NjLmRlYnVnLmlzRGlzcGxheVN0YXRzJyxcbiAgICAgICAgc2V0RGlzcGxheVN0YXRzOiAnY2MuZGVidWcuc2V0RGlzcGxheVN0YXRzJyxcbiAgICAgICAgc3RvcEFuaW1hdGlvbjogJ2NjLmdhbWUucGF1c2UnLFxuICAgICAgICBzdGFydEFuaW1hdGlvbjogJ2NjLmdhbWUucmVzdW1lJyxcbiAgICB9LCAnY2MuRGlyZWN0b3InKTtcbiAgICBtYXJrQXNSZW1vdmVkKGNjLkRpcmVjdG9yLCBbXG4gICAgICAgICdwdXNoU2NlbmUnLFxuICAgICAgICAncG9wU2NlbmUnLFxuICAgICAgICAncG9wVG9Sb290U2NlbmUnLFxuICAgICAgICAncG9wVG9TY2VuZVN0YWNrTGV2ZWwnLFxuICAgICAgICAnc2V0UHJvamVjdGlvbicsXG4gICAgICAgICdnZXRQcm9qZWN0aW9uJyxcbiAgICBdLCAnY2MuRGlyZWN0b3InKTtcblxuICAgIC8vIFNjaGVkdWxlclxuICAgIHByb3ZpZGVDbGVhckVycm9yKGNjLlNjaGVkdWxlciwge1xuICAgICAgICBzY2hlZHVsZUNhbGxiYWNrRm9yVGFyZ2V0OiAnc2NoZWR1bGUnLFxuICAgICAgICBzY2hlZHVsZVVwZGF0ZUZvclRhcmdldDogJ3NjaGVkdWxlVXBkYXRlJyxcbiAgICAgICAgdW5zY2hlZHVsZUNhbGxiYWNrRm9yVGFyZ2V0OiAndW5zY2hlZHVsZScsXG4gICAgICAgIHVuc2NoZWR1bGVVcGRhdGVGb3JUYXJnZXQ6ICd1bnNjaGVkdWxlVXBkYXRlJyxcbiAgICAgICAgdW5zY2hlZHVsZUFsbENhbGxiYWNrc0ZvclRhcmdldDogJ3Vuc2NoZWR1bGVBbGxGb3JUYXJnZXQnLFxuICAgICAgICB1bnNjaGVkdWxlQWxsQ2FsbGJhY2tzOiAndW5zY2hlZHVsZUFsbCcsXG4gICAgICAgIHVuc2NoZWR1bGVBbGxDYWxsYmFja3NXaXRoTWluUHJpb3JpdHk6ICd1bnNjaGVkdWxlQWxsV2l0aE1pblByaW9yaXR5J1xuICAgIH0sICdjYy5TY2hlZHVsZXInKTtcblxuICAgIC8vIGNjLnZpZXdcbiAgICBwcm92aWRlQ2xlYXJFcnJvcihjYy52aWV3LCB7XG4gICAgICAgIGFkanVzdFZpZXdQb3J0OiAnYWRqdXN0Vmlld3BvcnRNZXRhJyxcbiAgICAgICAgc2V0Vmlld1BvcnRJblBvaW50czogJ3NldFZpZXdwb3J0SW5Qb2ludHMnLFxuICAgICAgICBnZXRWaWV3UG9ydFJlY3Q6ICdnZXRWaWV3cG9ydFJlY3QnXG4gICAgfSwgJ2NjLnZpZXcnKTtcbiAgICBtYXJrQXNSZW1vdmVkSW5PYmplY3QoY2MudmlldywgW1xuICAgICAgICAnaXNWaWV3UmVhZHknLFxuICAgICAgICAnc2V0VGFyZ2V0RGVuc2l0eURQSScsXG4gICAgICAgICdnZXRUYXJnZXREZW5zaXR5RFBJJyxcbiAgICAgICAgJ3NldEZyYW1lWm9vbUZhY3RvcicsXG4gICAgICAgICdjYW5TZXRDb250ZW50U2NhbGVGYWN0b3InLFxuICAgICAgICAnc2V0Q29udGVudFRyYW5zbGF0ZUxlZnRUb3AnLFxuICAgICAgICAnZ2V0Q29udGVudFRyYW5zbGF0ZUxlZnRUb3AnLFxuICAgICAgICAnc2V0Vmlld05hbWUnLFxuICAgICAgICAnZ2V0Vmlld05hbWUnXG4gICAgXSwgJ2NjLnZpZXcnKTtcblxuICAgIC8vIGNjLlBoeXNpY3NNYW5hZ2VyXG4gICAgbWFya0FzUmVtb3ZlZChjYy5QaHlzaWNzTWFuYWdlciwgW1xuICAgICAgICAnYXR0YWNoRGVidWdEcmF3VG9DYW1lcmEnLFxuICAgICAgICAnZGV0YWNoRGVidWdEcmF3RnJvbUNhbWVyYScsXG4gICAgXSk7XG5cbiAgICAvLyBjYy5Db2xsaXNpb25NYW5hZ2VyXG4gICAgbWFya0FzUmVtb3ZlZChjYy5Db2xsaXNpb25NYW5hZ2VyLCBbXG4gICAgICAgICdhdHRhY2hEZWJ1Z0RyYXdUb0NhbWVyYScsXG4gICAgICAgICdkZXRhY2hEZWJ1Z0RyYXdGcm9tQ2FtZXJhJyxcbiAgICBdKTtcblxuICAgIC8vIGNjLk5vZGVcbiAgICBwcm92aWRlQ2xlYXJFcnJvcihjYy5fQmFzZU5vZGUucHJvdG90eXBlLCB7XG4gICAgICAgICd0YWcnOiAnbmFtZScsXG4gICAgICAgICdnZXRUYWcnOiAnbmFtZScsXG4gICAgICAgICdzZXRUYWcnOiAnbmFtZScsXG4gICAgICAgICdnZXRDaGlsZEJ5VGFnJzogJ2dldENoaWxkQnlOYW1lJyxcbiAgICAgICAgJ3JlbW92ZUNoaWxkQnlUYWcnOiAnZ2V0Q2hpbGRCeU5hbWUobmFtZSkuZGVzdHJveSgpJ1xuICAgIH0pO1xuXG4gICAgbWFya0FzUmVtb3ZlZChjYy5Ob2RlLCBbXG4gICAgICAgICdfY2FzY2FkZUNvbG9yRW5hYmxlZCcsXG4gICAgICAgICdjYXNjYWRlQ29sb3InLFxuICAgICAgICAnaXNDYXNjYWRlQ29sb3JFbmFibGVkJyxcbiAgICAgICAgJ3NldENhc2NhZGVDb2xvckVuYWJsZWQnLFxuICAgICAgICAnX2Nhc2NhZGVPcGFjaXR5RW5hYmxlZCcsXG4gICAgICAgICdjYXNjYWRlT3BhY2l0eScsXG4gICAgICAgICdpc0Nhc2NhZGVPcGFjaXR5RW5hYmxlZCcsXG4gICAgICAgICdzZXRDYXNjYWRlT3BhY2l0eUVuYWJsZWQnLFxuICAgICAgICAnb3BhY2l0eU1vZGlmeVJHQicsXG4gICAgICAgICdpc09wYWNpdHlNb2RpZnlSR0InLFxuICAgICAgICAnc2V0T3BhY2l0eU1vZGlmeVJHQicsXG4gICAgICAgICdpZ25vcmVBbmNob3InLFxuICAgICAgICAnaXNJZ25vcmVBbmNob3JQb2ludEZvclBvc2l0aW9uJyxcbiAgICAgICAgJ2lnbm9yZUFuY2hvclBvaW50Rm9yUG9zaXRpb24nLFxuICAgICAgICAnaXNSdW5uaW5nJyxcbiAgICAgICAgJ19zZ05vZGUnLFxuICAgIF0pO1xuXG4gICAgbWFya0Z1bmN0aW9uV2FybmluZyhjYy5Ob2RlLnByb3RvdHlwZSwge1xuICAgICAgICBnZXROb2RlVG9QYXJlbnRUcmFuc2Zvcm06ICdnZXRMb2NhbE1hdHJpeCcsXG4gICAgICAgIGdldE5vZGVUb1BhcmVudFRyYW5zZm9ybUFSOiAnZ2V0TG9jYWxNYXRyaXgnLFxuICAgICAgICBnZXROb2RlVG9Xb3JsZFRyYW5zZm9ybTogJ2dldFdvcmxkTWF0cml4JyxcbiAgICAgICAgZ2V0Tm9kZVRvV29ybGRUcmFuc2Zvcm1BUjogJ2dldFdvcmxkTWF0cml4JyxcbiAgICAgICAgZ2V0UGFyZW50VG9Ob2RlVHJhbnNmb3JtOiAnZ2V0TG9jYWxNYXRyaXgnLFxuICAgICAgICBnZXRXb3JsZFRvTm9kZVRyYW5zZm9ybTogJ2dldFdvcmxkTWF0cml4JyxcbiAgICAgICAgY29udmVydFRvdWNoVG9Ob2RlU3BhY2U6ICdjb252ZXJ0VG9Ob2RlU3BhY2VBUicsXG4gICAgICAgIGNvbnZlcnRUb3VjaFRvTm9kZVNwYWNlQVI6ICdjb252ZXJ0VG9Ob2RlU3BhY2VBUicsXG4gICAgICAgIGNvbnZlcnRUb1dvcmxkU3BhY2U6ICdjb252ZXJ0VG9Xb3JsZFNwYWNlQVInLFxuICAgICAgICBjb252ZXJ0VG9Ob2RlU3BhY2U6ICdjb252ZXJ0VG9Ob2RlU3BhY2VBUidcbiAgICB9KTtcblxuICAgIHByb3ZpZGVDbGVhckVycm9yKGNjLk5vZGUucHJvdG90eXBlLCB7XG4gICAgICAgIGdldFJvdGF0aW9uWDogJ3JvdGF0aW9uWCcsXG4gICAgICAgIHNldFJvdGF0aW9uWDogJ3JvdGF0aW9uWCcsXG4gICAgICAgIGdldFJvdGF0aW9uWTogJ3JvdGF0aW9uWScsXG4gICAgICAgIHNldFJvdGF0aW9uWTogJ3JvdGF0aW9uWScsXG4gICAgICAgIGdldFBvc2l0aW9uWDogJ3gnLFxuICAgICAgICBzZXRQb3NpdGlvblg6ICd4JyxcbiAgICAgICAgZ2V0UG9zaXRpb25ZOiAneScsXG4gICAgICAgIHNldFBvc2l0aW9uWTogJ3knLFxuICAgICAgICBnZXRTa2V3WDogJ3NrZXdYJyxcbiAgICAgICAgc2V0U2tld1g6ICdza2V3WCcsXG4gICAgICAgIGdldFNrZXdZOiAnc2tld1knLFxuICAgICAgICBzZXRTa2V3WTogJ3NrZXdZJyxcbiAgICAgICAgZ2V0U2NhbGVYOiAnc2NhbGVYJyxcbiAgICAgICAgc2V0U2NhbGVYOiAnc2NhbGVYJyxcbiAgICAgICAgZ2V0U2NhbGVZOiAnc2NhbGVZJyxcbiAgICAgICAgc2V0U2NhbGVZOiAnc2NhbGVZJyxcbiAgICAgICAgZ2V0T3BhY2l0eTogJ29wYWNpdHknLFxuICAgICAgICBzZXRPcGFjaXR5OiAnb3BhY2l0eScsXG4gICAgICAgIGdldENvbG9yOiAnY29sb3InLFxuICAgICAgICBzZXRDb2xvcjogJ2NvbG9yJyxcbiAgICAgICAgZ2V0TG9jYWxaT3JkZXI6ICd6SW5kZXgnLFxuICAgICAgICBzZXRMb2NhbFpPcmRlcjogJ3pJbmRleCcsXG4gICAgfSk7XG5cbiAgICBwcm92aWRlQ2xlYXJFcnJvcihjYy5TcHJpdGUucHJvdG90eXBlLCB7XG4gICAgICAgIHNldEluc2V0TGVmdDogJ2NjLlNwcml0ZUZyYW1lIGluc2V0TGVmdCcsXG4gICAgICAgIHNldEluc2V0UmlnaHQ6ICdjYy5TcHJpdGVGcmFtZSBpbnNldFJpZ2h0JyxcbiAgICAgICAgc2V0SW5zZXRUb3A6ICdjYy5TcHJpdGVGcmFtZSBpbnNldFRvcCcsXG4gICAgICAgIHNldEluc2V0Qm90dG9tOiAnY2MuU3ByaXRlRnJhbWUgaW5zZXRCb3R0b20nLFxuICAgIH0pO1xuXG4gICAgLy8gY2MuTWF0ZXJpYWxcbiAgICBjYy5NYXRlcmlhbC5nZXRJbnN0YW50aWF0ZWRCdWlsdGluTWF0ZXJpYWwgPSBjYy5NYXRlcmlhbFZhcmlhbnQuY3JlYXRlV2l0aEJ1aWx0aW47XG4gICAgY2MuTWF0ZXJpYWwuZ2V0SW5zdGFudGlhdGVkTWF0ZXJpYWwgPSBjYy5NYXRlcmlhbFZhcmlhbnQuY3JlYXRlO1xuICAgIG1hcmtGdW5jdGlvbldhcm5pbmcoY2MuTWF0ZXJpYWwsIHtcbiAgICAgICAgZ2V0SW5zdGFudGlhdGVkQnVpbHRpbk1hdGVyaWFsOiAnY2MuTWF0ZXJpYWxWYXJpYW50LmNyZWF0ZVdpdGhCdWlsdGluJyxcbiAgICAgICAgZ2V0SW5zdGFudGlhdGVkTWF0ZXJpYWw6ICdjYy5NYXRlcmlhbFZhcmlhbnQuY3JlYXRlJ1xuICAgIH0pO1xuXG4gICAgLy8gY2MuUmVuZGVyQ29tcG9uZW50XG4gICAgY2MuanMuZ2V0c2V0KGNjLlJlbmRlckNvbXBvbmVudC5wcm90b3R5cGUsICdzaGFyZWRNYXRlcmlhbHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLndhcm5JRCgxNDAwLCAnc2hhcmVkTWF0ZXJpYWxzJywgJ2dldE1hdGVyaWFscycpO1xuICAgICAgICByZXR1cm4gdGhpcy5tYXRlcmlhbHM7XG4gICAgfSwgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgY2Mud2FybklEKDE0MDAsICdzaGFyZWRNYXRlcmlhbHMnLCAnc2V0TWF0ZXJpYWwnKTtcbiAgICAgICAgdGhpcy5tYXRlcmlhbHMgPSB2O1xuICAgIH0pXG5cbiAgICAvLyBjYy5DYW1lcmFcbiAgICBtYXJrRnVuY3Rpb25XYXJuaW5nKGNjLkNhbWVyYS5wcm90b3R5cGUsIHtcbiAgICAgICAgZ2V0Tm9kZVRvQ2FtZXJhVHJhbnNmb3JtOiAnZ2V0V29ybGRUb1NjcmVlbk1hdHJpeDJEJyxcbiAgICAgICAgZ2V0Q2FtZXJhVG9Xb3JsZFBvaW50OiAnZ2V0U2NyZWVuVG9Xb3JsZFBvaW50JyxcbiAgICAgICAgZ2V0V29ybGRUb0NhbWVyYVBvaW50OiAnZ2V0V29ybGRUb1NjcmVlblBvaW50JyxcbiAgICAgICAgZ2V0Q2FtZXJhVG9Xb3JsZE1hdHJpeDogJ2dldFNjcmVlblRvV29ybGRNYXRyaXgyRCcsXG4gICAgICAgIGdldFdvcmxkVG9DYW1lcmFNYXRyaXg6ICdnZXRXb3JsZFRvU2NyZWVuTWF0cml4MkQnXG4gICAgfSk7XG5cbiAgICBtYXJrQXNSZW1vdmVkKGNjLkNhbWVyYSwgW1xuICAgICAgICAnYWRkVGFyZ2V0JyxcbiAgICAgICAgJ3JlbW92ZVRhcmdldCcsXG4gICAgICAgICdnZXRUYXJnZXRzJ1xuICAgIF0pO1xuXG4gICAgLy8gU0NFTkVcbiAgICB2YXIgRVJSID0gJ1wiJXNcIiBpcyBub3QgZGVmaW5lZCBpbiB0aGUgU2NlbmUsIGl0IGlzIG9ubHkgZGVmaW5lZCBpbiBub3JtYWwgbm9kZXMuJztcbiAgICBDQ19FRElUT1IgfHwgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoY2MuU2NlbmUucHJvdG90eXBlLCB7XG4gICAgICAgIGFjdGl2ZToge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3IoRVJSLCAnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3IoRVJSLCAnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGFjdGl2ZUluSGllcmFyY2h5OiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcihFUlIsICdhY3RpdmVJbkhpZXJhcmNoeScpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Q29tcG9uZW50OiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcihFUlIsICdnZXRDb21wb25lbnQnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBhZGRDb21wb25lbnQ6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNjLmVycm9yKEVSUiwgJ2FkZENvbXBvbmVudCcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBjYy5keW5hbWljQXRsYXNNYW5hZ2VyXG4gICAgbWFya0FzUmVtb3ZlZEluT2JqZWN0KGNjLmR5bmFtaWNBdGxhc01hbmFnZXIsIFtcbiAgICAgICAgJ21pbkZyYW1lU2l6ZSdcbiAgICBdLCAnY2MuZHluYW1pY0F0bGFzTWFuYWdlcicpXG5cbiAgICAvLyBsaWdodCBjb21wb25lbnRcbiAgICBpZiAoY2MuTGlnaHQpIHtcbiAgICAgICAgbWFya0FzUmVtb3ZlZEluT2JqZWN0KGNjLkxpZ2h0LnByb3RvdHlwZSwgW1xuICAgICAgICAgICAgJ3NoYWRvd0RlcHRoU2NhbGUnLFxuICAgICAgICBdLCAnY2MuTGlnaHQucHJvdG90eXBlJyk7XG4gICAgfVxuXG4gICAgLy8gVmFsdWUgdHlwZXNcbiAgICBwcm92aWRlQ2xlYXJFcnJvcihjYywge1xuICAgICAgICAvLyBBZmZpbmVUcmFuc2Zvcm1cbiAgICAgICAgYWZmaW5lVHJhbnNmb3JtTWFrZTogJ2NjLkFmZmluZVRyYW5zZm9ybS5jcmVhdGUnLFxuICAgICAgICBhZmZpbmVUcmFuc2Zvcm1NYWtlSWRlbnRpdHk6ICdjYy5BZmZpbmVUcmFuc2Zvcm0uaWRlbnRpdHknLFxuICAgICAgICBhZmZpbmVUcmFuc2Zvcm1DbG9uZTogJ2NjLkFmZmluZVRyYW5zZm9ybS5jbG9uZScsXG4gICAgICAgIGFmZmluZVRyYW5zZm9ybUNvbmNhdDogJ2NjLkFmZmluZVRyYW5zZm9ybS5jb25jYXQnLFxuICAgICAgICBhZmZpbmVUcmFuc2Zvcm1Db25jYXRJbjogJ2NjLkFmZmluZVRyYW5zZm9ybS5jb25jYXQnLFxuICAgICAgICBhZmZpbmVUcmFuc2Zvcm1JbnZlcnQ6ICdjYy5BZmZpbmVUcmFuc2Zvcm0uaW52ZXJ0JyxcbiAgICAgICAgYWZmaW5lVHJhbnNmb3JtSW52ZXJ0SW46ICdjYy5BZmZpbmVUcmFuc2Zvcm0uaW52ZXJ0JyxcbiAgICAgICAgYWZmaW5lVHJhbnNmb3JtSW52ZXJ0T3V0OiAnY2MuQWZmaW5lVHJhbnNmb3JtLmludmVydCcsXG4gICAgICAgIGFmZmluZVRyYW5zZm9ybUVxdWFsVG9UcmFuc2Zvcm06ICdjYy5BZmZpbmVUcmFuc2Zvcm0uZXF1YWwnLFxuICAgICAgICBwb2ludEFwcGx5QWZmaW5lVHJhbnNmb3JtOiAnY2MuQWZmaW5lVHJhbnNmb3JtLnRyYW5zZm9ybVZlYzInLFxuICAgICAgICBzaXplQXBwbHlBZmZpbmVUcmFuc2Zvcm06ICdjYy5BZmZpbmVUcmFuc2Zvcm0udHJhbnNmb3JtU2l6ZScsXG4gICAgICAgIHJlY3RBcHBseUFmZmluZVRyYW5zZm9ybTogJ2NjLkFmZmluZVRyYW5zZm9ybS50cmFuc2Zvcm1SZWN0JyxcbiAgICAgICAgb2JiQXBwbHlBZmZpbmVUcmFuc2Zvcm06ICdjYy5BZmZpbmVUcmFuc2Zvcm0udHJhbnNmb3JtT2JiJyxcblxuICAgICAgICAvLyBWZWMyXG4gICAgICAgIHBvaW50RXF1YWxUb1BvaW50OiAnY2MuVmVjMiBlcXVhbHMnLFxuXG4gICAgICAgIC8vIFNpemVcbiAgICAgICAgc2l6ZUVxdWFsVG9TaXplOiAnY2MuU2l6ZSBlcXVhbHMnLFxuXG4gICAgICAgIC8vIFJlY3RcbiAgICAgICAgcmVjdEVxdWFsVG9SZWN0OiAncmVjdEEuZXF1YWxzKHJlY3RCKScsXG4gICAgICAgIHJlY3RDb250YWluc1JlY3Q6ICdyZWN0QS5jb250YWluc1JlY3QocmVjdEIpJyxcbiAgICAgICAgcmVjdENvbnRhaW5zUG9pbnQ6ICdyZWN0LmNvbnRhaW5zKHZlYzIpJyxcbiAgICAgICAgcmVjdE92ZXJsYXBzUmVjdDogJ3JlY3RBLmludGVyc2VjdHMocmVjdEIpJyxcbiAgICAgICAgcmVjdEludGVyc2VjdHNSZWN0OiAncmVjdEEuaW50ZXJzZWN0cyhyZWN0QiknLFxuICAgICAgICByZWN0SW50ZXJzZWN0aW9uOiAncmVjdEEuaW50ZXJzZWN0aW9uKGludGVyc2VjdGlvbiwgcmVjdEIpJyxcbiAgICAgICAgcmVjdFVuaW9uOiAncmVjdEEudW5pb24odW5pb24sIHJlY3RCKScsXG4gICAgICAgIHJlY3RHZXRNYXhYOiAncmVjdC54TWF4JyxcbiAgICAgICAgcmVjdEdldE1pZFg6ICdyZWN0LmNlbnRlci54JyxcbiAgICAgICAgcmVjdEdldE1pblg6ICdyZWN0LnhNaW4nLFxuICAgICAgICByZWN0R2V0TWF4WTogJ3JlY3QueU1heCcsXG4gICAgICAgIHJlY3RHZXRNaWRZOiAncmVjdC5jZW50ZXIueScsXG4gICAgICAgIHJlY3RHZXRNaW5ZOiAncmVjdC55TWluJyxcblxuICAgICAgICAvLyBDb2xvclxuICAgICAgICBjb2xvckVxdWFsOiAnY29sb3JBLmVxdWFscyhjb2xvckIpJyxcbiAgICAgICAgaGV4VG9Db2xvcjogJ2NvbG9yLmZyb21IRVgoaGV4Q29sb3IpJyxcbiAgICAgICAgY29sb3JUb0hleDogJ2NvbG9yLnRvSEVYKCknLFxuXG4gICAgICAgIC8vIEVudW1zXG4gICAgICAgIFRleHRBbGlnbm1lbnQ6ICdjYy5tYWNyby5UZXh0QWxpZ25tZW50JyxcbiAgICAgICAgVmVydGljYWxUZXh0QWxpZ25tZW50OiAnY2MubWFjcm8uVmVydGljYWxUZXh0QWxpZ25tZW50JyxcblxuICAgICAgICAvLyBQb2ludCBFeHRlbnNpb25zXG4gICAgICAgIHBOZWc6ICdwLm5lZygpJyxcbiAgICAgICAgcEFkZDogJ3AxLmFkZChwMiknLFxuICAgICAgICBwU3ViOiAncDEuc3ViKHAyKScsXG4gICAgICAgIHBNdWx0OiAncC5tdWwoZmFjdG9yKScsXG4gICAgICAgIHBNaWRwb2ludDogJ3AxLmFkZChwMikubXVsKDAuNSknLFxuICAgICAgICBwRG90OiAncDEuZG90KHAyKScsXG4gICAgICAgIHBDcm9zczogJ3AxLmNyb3NzKHAyKScsXG4gICAgICAgIHBQZXJwOiAncC5yb3RhdGUoLTkwICogTWF0aC5QSSAvIDE4MCknLFxuICAgICAgICBwUlBlcnA6ICdwLnJvdGF0ZSg5MCAqIE1hdGguUEkgLyAxODApJyxcbiAgICAgICAgcFByb2plY3Q6ICdwMS5wcm9qZWN0KHAyKScsXG4gICAgICAgIHBMZW5ndGhTUTogJ3AubWFnU3FyKCknLFxuICAgICAgICBwRGlzdGFuY2VTUTogJ3AxLnN1YihwMikubWFnU3FyKCknLFxuICAgICAgICBwTGVuZ3RoOiAncC5tYWcoKScsXG4gICAgICAgIHBEaXN0YW5jZTogJ3AxLnN1YihwMikubWFnKCknLFxuICAgICAgICBwTm9ybWFsaXplOiAncC5ub3JtYWxpemUoKScsXG4gICAgICAgIHBGb3JBbmdsZTogJ2NjLnYyKE1hdGguY29zKGEpLCBNYXRoLnNpbihhKSknLFxuICAgICAgICBwVG9BbmdsZTogJ01hdGguYXRhbjIodi55LCB2LngpJyxcbiAgICAgICAgcFplcm9JbjogJ3AueCA9IHAueSA9IDAnLFxuICAgICAgICBwSW46ICdwMS5zZXQocDIpJyxcbiAgICAgICAgcE11bHRJbjogJ3AubXVsU2VsZihmYWN0b3IpJyxcbiAgICAgICAgcFN1YkluOiAncDEuc3ViU2VsZihwMiknLFxuICAgICAgICBwQWRkSW46ICdwMS5hZGRTZWxmKHAyKScsXG4gICAgICAgIHBOb3JtYWxpemVJbjogJ3Aubm9ybWFsaXplU2VsZigpJyxcbiAgICAgICAgcFNhbWVBczogJ3AxLmVxdWFscyhwMiknLFxuICAgICAgICBwQW5nbGU6ICd2MS5hbmdsZSh2MiknLFxuICAgICAgICBwQW5nbGVTaWduZWQ6ICd2MS5zaWduQW5nbGUodjIpJyxcbiAgICAgICAgcFJvdGF0ZUJ5QW5nbGU6ICdwLnJvdGF0ZShyYWRpYW5zKScsXG4gICAgICAgIHBDb21wTXVsdDogJ3YxLm11bHRpcGx5KHYyKScsXG4gICAgICAgIHBGdXp6eUVxdWFsOiAndjEuZnV6enlFcXVhbHModjIsIHRvbGVyYW5jZSknLFxuICAgICAgICBwTGVycDogJ3AubGVycChlbmRQb2ludCwgcmF0aW8pJyxcbiAgICAgICAgcENsYW1wOiAncC5jbGFtcGYobWluX2luY2x1c2l2ZSwgbWF4X2luY2x1c2l2ZSknLFxuXG4gICAgICAgIHJhbmQ6ICdNYXRoLnJhbmRvbSgpICogMHhmZmZmZmYnLFxuICAgICAgICByYW5kb21NaW51czFUbzE6ICcoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyJyxcblxuICAgICAgICBjb250YWluZXI6ICdjYy5nYW1lLmNvbnRhaW5lcicsXG4gICAgICAgIF9jYW52YXM6ICdjYy5nYW1lLmNhbnZhcycsXG4gICAgICAgIF9yZW5kZXJUeXBlOiAnY2MuZ2FtZS5yZW5kZXJUeXBlJyxcblxuICAgICAgICBfZ2V0RXJyb3I6ICdjYy5kZWJ1Zy5nZXRFcnJvcicsXG4gICAgICAgIF9pbml0RGVidWdTZXR0aW5nOiAnY2MuZGVidWcuX3Jlc2V0RGVidWdTZXR0aW5nJyxcbiAgICAgICAgRGVidWdNb2RlOiAnY2MuZGVidWcuRGVidWdNb2RlJyxcbiAgICB9LCAnY2MnKTtcbiAgICBtYXJrQXNSZW1vdmVkSW5PYmplY3QoY2MsIFtcbiAgICAgICAgJ2JsZW5kRnVuY0Rpc2FibGUnLFxuXG4gICAgICAgICdwRnJvbVNpemUnLFxuICAgICAgICAncENvbXBPcCcsXG4gICAgICAgICdwSW50ZXJzZWN0UG9pbnQnLFxuICAgICAgICAncFNlZ21lbnRJbnRlcnNlY3QnLFxuICAgICAgICAncExpbmVJbnRlcnNlY3QnLFxuXG4gICAgICAgICdvYmJBcHBseU1hdHJpeCcsXG5cbiAgICAgICAgJ2dldEltYWdlRm9ybWF0QnlEYXRhJyxcblxuICAgICAgICAnaW5pdEVuZ2luZScsXG4gICAgXSwgJ2NjJyk7XG4gICAgbWFya0Z1bmN0aW9uV2FybmluZyhjYywge1xuICAgICAgICAvLyBjYy5wXG4gICAgICAgIHA6ICdjYy52MidcbiAgICB9LCAnY2MnKTtcbiAgICAvLyBjYy5SZWN0XG4gICAgcHJvdmlkZUNsZWFyRXJyb3IoY2MuUmVjdCwge1xuICAgICAgICBjb250YWluOiAncmVjdEEuY29udGFpbnMocmVjdEIpJyxcbiAgICAgICAgdHJhbnNmb3JtTWF0NDogJ3JlY3QudHJhbnNmb3JtTWF0NChvdXQsIG1hdDQpJ1xuICAgIH0pO1xuICAgIC8vIGNjLkNvbG9yXG4gICAgcHJvdmlkZUNsZWFyRXJyb3IoY2MuQ29sb3IsIHtcbiAgICAgICAgcmdiMmhzdjogJ2NvbG9yLnRvSFNWKCknLFxuICAgICAgICBoc3YycmdiOiAnY29sb3IuZnJvbUhTVihoLCBzLCB2KSdcbiAgICB9KTtcbiAgICBtYXJrRnVuY3Rpb25XYXJuaW5nKGNjLkNvbG9yLCB7XG4gICAgICAgIGZyb21IZXg6ICdjYy5Db2xvci5mcm9tSEVYJyxcbiAgICB9KVxuXG4gICAgLy8gbWFjcm8gZnVuY3Rpb25zXG4gICAganMuZ2V0KGNjLCAnbGVycCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuZXJyb3JJRCgxNDAwLCAnY2MubGVycCcsICdjYy5taXNjLmxlcnAnKTtcbiAgICAgICAgcmV0dXJuIGNjLm1pc2MubGVycDtcbiAgICB9KTtcbiAgICBqcy5nZXQoY2MsICdyYW5kb20wVG8xJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5lcnJvcklEKDE0MDAsICdjYy5yYW5kb20wVG8xJywgJ01hdGgucmFuZG9tJyk7XG4gICAgICAgIHJldHVybiBNYXRoLnJhbmRvbTtcbiAgICB9KTtcbiAgICBqcy5nZXQoY2MsICdkZWdyZWVzVG9SYWRpYW5zJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5lcnJvcklEKDE0MDAsICdjYy5kZWdyZWVzVG9SYWRpYW5zJywgJ2NjLm1pc2MuZGVncmVlc1RvUmFkaWFucycpO1xuICAgICAgICByZXR1cm4gY2MubWlzYy5kZWdyZWVzVG9SYWRpYW5zO1xuICAgIH0pO1xuICAgIGpzLmdldChjYywgJ3JhZGlhbnNUb0RlZ3JlZXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmVycm9ySUQoMTQwMCwgJ2NjLnJhZGlhbnNUb0RlZ3JlZXMnLCAnY2MubWlzYy5yYWRpYW5zVG9EZWdyZWVzJyk7XG4gICAgICAgIHJldHVybiBjYy5taXNjLnJhZGlhbnNUb0RlZ3JlZXM7XG4gICAgfSk7XG4gICAganMuZ2V0KGNjLCAnY2xhbXBmJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5lcnJvcklEKDE0MDAsICdjYy5jbGFtcGYnLCAnY2MubWlzYy5jbGFtcGYnKTtcbiAgICAgICAgcmV0dXJuIGNjLm1pc2MuY2xhbXBmO1xuICAgIH0pO1xuICAgIGpzLmdldChjYywgJ2NsYW1wMDEnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmVycm9ySUQoMTQwMCwgJ2NjLmNsYW1wMDEnLCAnY2MubWlzYy5jbGFtcDAxJyk7XG4gICAgICAgIHJldHVybiBjYy5taXNjLmNsYW1wMDE7XG4gICAgfSk7XG4gICAganMuZ2V0KGNjLCAnSW1hZ2VGb3JtYXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmVycm9ySUQoMTQwMCwgJ2NjLkltYWdlRm9ybWF0JywgJ2NjLm1hY3JvLkltYWdlRm9ybWF0Jyk7XG4gICAgICAgIHJldHVybiBjYy5tYWNyby5JbWFnZUZvcm1hdDtcbiAgICB9KTtcbiAgICBqcy5nZXQoY2MsICdLRVknLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmVycm9ySUQoMTQwMCwgJ2NjLktFWScsICdjYy5tYWNyby5LRVknKTtcbiAgICAgICAgcmV0dXJuIGNjLm1hY3JvLktFWTtcbiAgICB9KTtcbiAgICBqcy5nZXQoY2MsICdFYXNpbmcnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmVycm9ySUQoMTQwMCwgJ2NjLkVhc2luZycsICdjYy5lYXNpbmcnKTtcbiAgICAgICAgcmV0dXJuIGNjLmVhc2luZztcbiAgICB9KTtcblxuICAgIC8vIGNjLmlzQ2hpbGRDbGFzc09mXG4gICAganMuZ2V0KGNjLCAnaXNDaGlsZENsYXNzT2YnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmVycm9ySUQoMTQwMCwgJ2NjLmlzQ2hpbGRDbGFzc09mJywgJ2NjLmpzLmlzQ2hpbGRDbGFzc09mJyk7XG4gICAgICAgIHJldHVybiBjYy5qcy5pc0NoaWxkQ2xhc3NPZjtcbiAgICB9KTtcblxuICAgIC8vIGRyYWdvbiBib25lc1xuICAgIGlmICh0eXBlb2YgZHJhZ29uQm9uZXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGpzLmdldChkcmFnb25Cb25lcy5DQ0ZhY3RvcnksICdnZXRGYWN0b3J5JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgxNDAwLCAnZHJhZ29uQm9uZXMuQ0NGYWN0b3J5LmdldEZhY3RvcnknLCAnZHJhZ29uQm9uZXMuQ0NGYWN0b3J5LmdldEluc3RhbmNlJyk7XG4gICAgICAgICAgICByZXR1cm4gZHJhZ29uQm9uZXMuQ0NGYWN0b3J5LmdldEluc3RhbmNlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyByZW5kZXJFbmdpbmVcbiAgICBjYy5yZW5kZXJlci5yZW5kZXJFbmdpbmUgPSB7XG4gICAgICAgIGdldCBnZnggKCkge1xuICAgICAgICAgICAgY2Mud2FybklEKDE0MDAsICdjYy5yZW5kZXJlci5yZW5kZXJFbmdpbmUuZ2Z4JywgJ2NjLmdmeCcpO1xuICAgICAgICAgICAgcmV0dXJuIGNjLmdmeDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IG1hdGggKCkge1xuICAgICAgICAgICAgY2Mud2FybklEKDE0MDAsICdjYy5yZW5kZXJlci5yZW5kZXJFbmdpbmUubWF0aCcsICdjYy5tYXRoJyk7XG4gICAgICAgICAgICByZXR1cm4gY2Mudm1hdGg7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBJbnB1dEFzc2VtYmxlciAoKSB7XG4gICAgICAgICAgICBjYy53YXJuSUQoMTQwMCwgJ2NjLnJlbmRlcmVyLnJlbmRlckVuZ2luZS5JbnB1dEFzc2VtYmxlcicsICdjYy5yZW5kZXJlci5JbnB1dEFzc2VtYmxlcicpO1xuICAgICAgICAgICAgcmV0dXJuIGNjLnJlbmRlcmVyLklucHV0QXNzZW1ibGVyO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBcbiAgICAvLyBhdWRpb1xuICAgIG1hcmtBc1JlbW92ZWRJbk9iamVjdChjYy5hdWRpb0VuZ2luZSwgW1xuICAgICAgICAnZ2V0UHJvZmlsZScsXG4gICAgICAgICdwcmVsb2FkJyxcbiAgICAgICAgJ3NldE1heFdlYkF1ZGlvU2l6ZScsXG4gICAgXSwgJ2NjLmF1ZGlvRW5naW5lJyk7XG59XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==