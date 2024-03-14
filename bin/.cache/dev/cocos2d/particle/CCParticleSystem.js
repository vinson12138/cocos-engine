
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/particle/CCParticleSystem.js';
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
var macro = require('../core/platform/CCMacro');

var ParticleAsset = require('./CCParticleAsset');

var RenderComponent = require('../core/components/CCRenderComponent');

var codec = require('../compression/ZipUtils');

var PNGReader = require('./CCPNGReader');

var tiffReader = require('./CCTIFFReader');

var textureUtil = require('../core/utils/texture-util');

var RenderFlow = require('../core/renderer/render-flow');

var ParticleSimulator = require('./particle-simulator');

var Material = require('../core/assets/material/CCMaterial');

var BlendFunc = require('../core/utils/blend-func');

function getImageFormatByData(imgData) {
  // if it is a png file buffer.
  if (imgData.length > 8 && imgData[0] === 0x89 && imgData[1] === 0x50 && imgData[2] === 0x4E && imgData[3] === 0x47 && imgData[4] === 0x0D && imgData[5] === 0x0A && imgData[6] === 0x1A && imgData[7] === 0x0A) {
    return macro.ImageFormat.PNG;
  } // if it is a tiff file buffer.


  if (imgData.length > 2 && (imgData[0] === 0x49 && imgData[1] === 0x49 || imgData[0] === 0x4d && imgData[1] === 0x4d || imgData[0] === 0xff && imgData[1] === 0xd8)) {
    return macro.ImageFormat.TIFF;
  }

  return macro.ImageFormat.UNKNOWN;
} //


function getParticleComponents(node) {
  var parent = node.parent,
      comp = node.getComponent(cc.ParticleSystem);

  if (!parent || !comp) {
    return node.getComponentsInChildren(cc.ParticleSystem);
  }

  return getParticleComponents(parent);
}
/**
 * !#en Enum for emitter modes
 * !#zh 发射模式
 * @enum ParticleSystem.EmitterMode
 */


var EmitterMode = cc.Enum({
  /**
   * !#en Uses gravity, speed, radial and tangential acceleration.
   * !#zh 重力模式，模拟重力，可让粒子围绕一个中心点移近或移远。
   * @property {Number} GRAVITY
   */
  GRAVITY: 0,

  /**
   * !#en Uses radius movement + rotation.
   * !#zh 半径模式，可以使粒子以圆圈方式旋转，它也可以创造螺旋效果让粒子急速前进或后退。
   * @property {Number} RADIUS - Uses radius movement + rotation.
   */
  RADIUS: 1
});
/**
 * !#en Enum for particles movement type.
 * !#zh 粒子位置类型
 * @enum ParticleSystem.PositionType
 */

var PositionType = cc.Enum({
  /**
   * !#en
   * Living particles are attached to the world and are unaffected by emitter repositioning.
   * !#zh
   * 自由模式，相对于世界坐标，不会随粒子节点移动而移动。（可产生火焰、蒸汽等效果）
   * @property {Number} FREE
   */
  FREE: 0,

  /**
   * !#en
   * In the relative mode, the particle will move with the parent node, but not with the node where the particle is. 
   * For example, the coffee in the cup is steaming. Then the steam moves (forward) with the train, rather than moves with the cup.
   * !#zh
   * 相对模式，粒子会跟随父节点移动，但不跟随粒子所在节点移动，例如在一列行进火车中，杯中的咖啡飘起雾气，
   * 杯子移动，雾气整体并不会随着杯子移动，但从火车整体的角度来看，雾气整体会随着火车移动。
   * @property {Number} RELATIVE
   */
  RELATIVE: 1,

  /**
   * !#en
   * Living particles are attached to the emitter and are translated along with it.
   * !#zh
   * 整组模式，粒子跟随发射器移动。（不会发生拖尾）
   * @property {Number} GROUPED
   */
  GROUPED: 2
});
/**
 * @class ParticleSystem
 */

var properties = {
  /**
   * !#en Play particle in edit mode.
   * !#zh 在编辑器模式下预览粒子，启用后选中粒子时，粒子将自动播放。
   * @property {Boolean} preview
   * @default false
   */
  preview: {
    "default": true,
    editorOnly: true,
    notify: CC_EDITOR && function () {
      this.resetSystem();

      if (!this.preview) {
        this.stopSystem();
        this.disableRender();
      }

      cc.engine.repaintInEditMode();
    },
    animatable: false,
    tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.preview'
  },

  /**
   * !#en
   * If set custom to true, then use custom properties insteadof read particle file.
   * !#zh 是否自定义粒子属性。
   * @property {Boolean} custom
   * @default false
   */
  _custom: false,
  custom: {
    get: function get() {
      return this._custom;
    },
    set: function set(value) {
      if (CC_EDITOR && !value && !this._file) {
        return cc.warnID(6000);
      }

      if (this._custom !== value) {
        this._custom = value;

        this._applyFile();

        if (CC_EDITOR) {
          cc.engine.repaintInEditMode();
        }
      }
    },
    animatable: false,
    tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.custom'
  },

  /**
   * !#en The plist file.
   * !#zh plist 格式的粒子配置文件。
   * @property {ParticleAsset} file
   * @default null
   */
  _file: {
    "default": null,
    type: ParticleAsset
  },
  file: {
    get: function get() {
      return this._file;
    },
    set: function set(value, force) {
      if (this._file !== value || CC_EDITOR && force) {
        this._file = value;

        if (value) {
          this._applyFile();

          if (CC_EDITOR) {
            cc.engine.repaintInEditMode();
          }
        } else {
          this.custom = true;
        }
      }
    },
    animatable: false,
    type: ParticleAsset,
    tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.file'
  },

  /**
   * !#en SpriteFrame used for particles display
   * !#zh 用于粒子呈现的 SpriteFrame
   * @property spriteFrame
   * @type {SpriteFrame}
   */
  _spriteFrame: {
    "default": null,
    type: cc.SpriteFrame
  },
  spriteFrame: {
    get: function get() {
      return this._spriteFrame;
    },
    set: function set(value, force) {
      var lastSprite = this._renderSpriteFrame;

      if (CC_EDITOR) {
        if (!force && lastSprite === value) {
          return;
        }
      } else {
        if (lastSprite === value) {
          return;
        }
      }

      this._renderSpriteFrame = value;

      if (!value || value._uuid) {
        this._spriteFrame = value;
      }

      this._applySpriteFrame(lastSprite);

      if (CC_EDITOR) {
        this.node.emit('spriteframe-changed', this);
      }
    },
    type: cc.SpriteFrame,
    tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.spriteFrame'
  },
  // just used to read data from 1.x
  _texture: {
    "default": null,
    type: cc.Texture2D,
    editorOnly: true
  },

  /**
   * !#en Texture of Particle System, readonly, please use spriteFrame to setup new texture。
   * !#zh 粒子贴图，只读属性，请使用 spriteFrame 属性来替换贴图。
   * @property texture
   * @type {String}
   * @readonly
   */
  texture: {
    get: function get() {
      return this._getTexture();
    },
    set: function set(value) {
      if (value) {
        cc.warnID(6017);
      }
    },
    type: cc.Texture2D,
    tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.texture',
    readonly: true,
    visible: false,
    animatable: false
  },

  /**
   * !#en Current quantity of particles that are being simulated.
   * !#zh 当前播放的粒子数量。
   * @property {Number} particleCount
   * @readonly
   */
  particleCount: {
    visible: false,
    get: function get() {
      return this._simulator.particles.length;
    },
    readonly: true
  },

  /**
   * !#en Indicate whether the system simulation have stopped.
   * !#zh 指示粒子播放是否完毕。
   * @property {Boolean} stopped
   */
  _stopped: true,
  stopped: {
    get: function get() {
      return this._stopped;
    },
    animatable: false,
    visible: false
  },

  /**
   * !#en If set to true, the particle system will automatically start playing on onLoad.
   * !#zh 如果设置为 true 运行时会自动发射粒子。
   * @property playOnLoad
   * @type {boolean}
   * @default true
   */
  playOnLoad: true,

  /**
   * !#en Indicate whether the owner node will be auto-removed when it has no particles left.
   * !#zh 粒子播放完毕后自动销毁所在的节点。
   * @property {Boolean} autoRemoveOnFinish
   */
  autoRemoveOnFinish: {
    "default": false,
    animatable: false,
    tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.autoRemoveOnFinish'
  },

  /**
   * !#en Indicate whether the particle system is activated.
   * !#zh 是否激活粒子。
   * @property {Boolean} active
   * @readonly
   */
  active: {
    get: function get() {
      return this._simulator.active;
    },
    visible: false
  },

  /**
   * !#en Maximum particles of the system.
   * !#zh 粒子最大数量。
   * @property {Number} totalParticles
   * @default 150
   */
  totalParticles: 150,

  /**
   * !#en How many seconds the emitter wil run. -1 means 'forever'.
   * !#zh 发射器生存时间，单位秒，-1表示持续发射。
   * @property {Number} duration
   * @default ParticleSystem.DURATION_INFINITY
   */
  duration: -1,

  /**
   * !#en Emission rate of the particles.
   * !#zh 每秒发射的粒子数目。
   * @property {Number} emissionRate
   * @default 10
   */
  emissionRate: 10,

  /**
   * !#en Life of each particle setter.
   * !#zh 粒子的运行时间。
   * @property {Number} life
   * @default 1
   */
  life: 1,

  /**
   * !#en Variation of life.
   * !#zh 粒子的运行时间变化范围。
   * @property {Number} lifeVar
   * @default 0
   */
  lifeVar: 0,

  /**
   * !#en Start color of each particle.
   * !#zh 粒子初始颜色。
   * @property {cc.Color} startColor
   * @default {r: 255, g: 255, b: 255, a: 255}
   */
  _startColor: null,
  startColor: {
    type: cc.Color,
    get: function get() {
      return this._startColor;
    },
    set: function set(val) {
      this._startColor.r = val.r;
      this._startColor.g = val.g;
      this._startColor.b = val.b;
      this._startColor.a = val.a;
    }
  },

  /**
   * !#en Variation of the start color.
   * !#zh 粒子初始颜色变化范围。
   * @property {cc.Color} startColorVar
   * @default {r: 0, g: 0, b: 0, a: 0}
   */
  _startColorVar: null,
  startColorVar: {
    type: cc.Color,
    get: function get() {
      return this._startColorVar;
    },
    set: function set(val) {
      this._startColorVar.r = val.r;
      this._startColorVar.g = val.g;
      this._startColorVar.b = val.b;
      this._startColorVar.a = val.a;
    }
  },

  /**
   * !#en Ending color of each particle.
   * !#zh 粒子结束颜色。
   * @property {cc.Color} endColor
   * @default {r: 255, g: 255, b: 255, a: 0}
   */
  _endColor: null,
  endColor: {
    type: cc.Color,
    get: function get() {
      return this._endColor;
    },
    set: function set(val) {
      this._endColor.r = val.r;
      this._endColor.g = val.g;
      this._endColor.b = val.b;
      this._endColor.a = val.a;
    }
  },

  /**
   * !#en Variation of the end color.
   * !#zh 粒子结束颜色变化范围。
   * @property {cc.Color} endColorVar
   * @default {r: 0, g: 0, b: 0, a: 0}
   */
  _endColorVar: null,
  endColorVar: {
    type: cc.Color,
    get: function get() {
      return this._endColorVar;
    },
    set: function set(val) {
      this._endColorVar.r = val.r;
      this._endColorVar.g = val.g;
      this._endColorVar.b = val.b;
      this._endColorVar.a = val.a;
    }
  },

  /**
   * !#en Angle of each particle setter.
   * !#zh 粒子角度。
   * @property {Number} angle
   * @default 90
   */
  angle: 90,

  /**
   * !#en Variation of angle of each particle setter.
   * !#zh 粒子角度变化范围。
   * @property {Number} angleVar
   * @default 20
   */
  angleVar: 20,

  /**
   * !#en Start size in pixels of each particle.
   * !#zh 粒子的初始大小。
   * @property {Number} startSize
   * @default 50
   */
  startSize: 50,

  /**
   * !#en Variation of start size in pixels.
   * !#zh 粒子初始大小的变化范围。
   * @property {Number} startSizeVar
   * @default 0
   */
  startSizeVar: 0,

  /**
   * !#en End size in pixels of each particle.
   * !#zh 粒子结束时的大小。
   * @property {Number} endSize
   * @default 0
   */
  endSize: 0,

  /**
   * !#en Variation of end size in pixels.
   * !#zh 粒子结束大小的变化范围。
   * @property {Number} endSizeVar
   * @default 0
   */
  endSizeVar: 0,

  /**
   * !#en Start angle of each particle.
   * !#zh 粒子开始自旋角度。
   * @property {Number} startSpin
   * @default 0
   */
  startSpin: 0,

  /**
   * !#en Variation of start angle.
   * !#zh 粒子开始自旋角度变化范围。
   * @property {Number} startSpinVar
   * @default 0
   */
  startSpinVar: 0,

  /**
   * !#en End angle of each particle.
   * !#zh 粒子结束自旋角度。
   * @property {Number} endSpin
   * @default 0
   */
  endSpin: 0,

  /**
   * !#en Variation of end angle.
   * !#zh 粒子结束自旋角度变化范围。
   * @property {Number} endSpinVar
   * @default 0
   */
  endSpinVar: 0,

  /**
   * !#en Source position of the emitter.
   * !#zh 发射器位置。
   * @property {Vec2} sourcePos
   * @default cc.Vec2.ZERO
   */
  sourcePos: cc.Vec2.ZERO,

  /**
   * !#en Variation of source position.
   * !#zh 发射器位置的变化范围。（横向和纵向）
   * @property {Vec2} posVar
   * @default cc.Vec2.ZERO
   */
  posVar: cc.Vec2.ZERO,

  /**
   * !#en Particles movement type.
   * !#zh 粒子位置类型。
   * @property {ParticleSystem.PositionType} positionType
   * @default ParticleSystem.PositionType.FREE
   */
  _positionType: {
    "default": PositionType.FREE,
    formerlySerializedAs: "positionType"
  },
  positionType: {
    type: PositionType,
    get: function get() {
      return this._positionType;
    },
    set: function set(val) {
      this._positionType = val;

      this._updateMaterial();
    }
  },

  /**
   * !#en Particles emitter modes.
   * !#zh 发射器类型。
   * @property {ParticleSystem.EmitterMode} emitterMode
   * @default ParticleSystem.EmitterMode.GRAVITY
   */
  emitterMode: {
    "default": EmitterMode.GRAVITY,
    type: EmitterMode
  },
  // GRAVITY MODE

  /**
   * !#en Gravity of the emitter.
   * !#zh 重力。
   * @property {Vec2} gravity
   * @default cc.Vec2.ZERO
   */
  gravity: cc.Vec2.ZERO,

  /**
   * !#en Speed of the emitter.
   * !#zh 速度。
   * @property {Number} speed
   * @default 180
   */
  speed: 180,

  /**
   * !#en Variation of the speed.
   * !#zh 速度变化范围。
   * @property {Number} speedVar
   * @default 50
   */
  speedVar: 50,

  /**
   * !#en Tangential acceleration of each particle. Only available in 'Gravity' mode.
   * !#zh 每个粒子的切向加速度，即垂直于重力方向的加速度，只有在重力模式下可用。
   * @property {Number} tangentialAccel
   * @default 80
   */
  tangentialAccel: 80,

  /**
   * !#en Variation of the tangential acceleration.
   * !#zh 每个粒子的切向加速度变化范围。
   * @property {Number} tangentialAccelVar
   * @default 0
   */
  tangentialAccelVar: 0,

  /**
   * !#en Acceleration of each particle. Only available in 'Gravity' mode.
   * !#zh 粒子径向加速度，即平行于重力方向的加速度，只有在重力模式下可用。
   * @property {Number} radialAccel
   * @default 0
   */
  radialAccel: 0,

  /**
   * !#en Variation of the radial acceleration.
   * !#zh 粒子径向加速度变化范围。
   * @property {Number} radialAccelVar
   * @default 0
   */
  radialAccelVar: 0,

  /**
   * !#en Indicate whether the rotation of each particle equals to its direction. Only available in 'Gravity' mode.
   * !#zh 每个粒子的旋转是否等于其方向，只有在重力模式下可用。
   * @property {Boolean} rotationIsDir
   * @default false
   */
  rotationIsDir: false,
  // RADIUS MODE

  /**
   * !#en Starting radius of the particles. Only available in 'Radius' mode.
   * !#zh 初始半径，表示粒子出生时相对发射器的距离，只有在半径模式下可用。
   * @property {Number} startRadius
   * @default 0
   */
  startRadius: 0,

  /**
   * !#en Variation of the starting radius.
   * !#zh 初始半径变化范围。
   * @property {Number} startRadiusVar
   * @default 0
   */
  startRadiusVar: 0,

  /**
   * !#en Ending radius of the particles. Only available in 'Radius' mode.
   * !#zh 结束半径，只有在半径模式下可用。
   * @property {Number} endRadius
   * @default 0
   */
  endRadius: 0,

  /**
   * !#en Variation of the ending radius.
   * !#zh 结束半径变化范围。
   * @property {Number} endRadiusVar
   * @default 0
   */
  endRadiusVar: 0,

  /**
   * !#en Number of degress to rotate a particle around the source pos per second. Only available in 'Radius' mode.
   * !#zh 粒子每秒围绕起始点的旋转角度，只有在半径模式下可用。
   * @property {Number} rotatePerS
   * @default 0
   */
  rotatePerS: 0,

  /**
   * !#en Variation of the degress to rotate a particle around the source pos per second.
   * !#zh 粒子每秒围绕起始点的旋转角度变化范围。
   * @property {Number} rotatePerSVar
   * @default 0
   */
  rotatePerSVar: 0
};
/**
 * Particle System base class. <br/>
 * Attributes of a Particle System:<br/>
 *  - emmision rate of the particles<br/>
 *  - Gravity Mode (Mode A): <br/>
 *  - gravity <br/>
 *  - direction <br/>
 *  - speed +-  variance <br/>
 *  - tangential acceleration +- variance<br/>
 *  - radial acceleration +- variance<br/>
 *  - Radius Mode (Mode B):      <br/>
 *  - startRadius +- variance    <br/>
 *  - endRadius +- variance      <br/>
 *  - rotate +- variance         <br/>
 *  - Properties common to all modes: <br/>
 *  - life +- life variance      <br/>
 *  - start spin +- variance     <br/>
 *  - end spin +- variance       <br/>
 *  - start size +- variance     <br/>
 *  - end size +- variance       <br/>
 *  - start color +- variance    <br/>
 *  - end color +- variance      <br/>
 *  - life +- variance           <br/>
 *  - blending function          <br/>
 *  - texture                    <br/>
 * <br/>
 * cocos2d also supports particles generated by Particle Designer (http://particledesigner.71squared.com/).<br/>
 * 'Radius Mode' in Particle Designer uses a fixed emit rate of 30 hz. Since that can't be guarateed in cocos2d,  <br/>
 * cocos2d uses a another approach, but the results are almost identical.<br/>
 * cocos2d supports all the variables used by Particle Designer plus a bit more:  <br/>
 *  - spinning particles (supported when using ParticleSystem)       <br/>
 *  - tangential acceleration (Gravity mode)                               <br/>
 *  - radial acceleration (Gravity mode)                                   <br/>
 *  - radius direction (Radius mode) (Particle Designer supports outwards to inwards direction only) <br/>
 * It is possible to customize any of the above mentioned properties in runtime. Example:   <br/>
 *
 * @example
 * emitter.radialAccel = 15;
 * emitter.startSpin = 0;
 *
 * @class ParticleSystem
 * @extends RenderComponent
 * @uses BlendFunc
 */

var ParticleSystem = cc.Class({
  name: 'cc.ParticleSystem',
  "extends": RenderComponent,
  mixins: [BlendFunc],
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.renderers/ParticleSystem',
    inspector: 'packages://inspector/inspectors/comps/particle-system.js',
    playOnFocus: true,
    executeInEditMode: true
  },
  ctor: function ctor() {
    this.initProperties();
  },
  initProperties: function initProperties() {
    this._previewTimer = null;
    this._focused = false;
    this._aspectRatio = 1;
    this._simulator = new ParticleSimulator(this); // colors

    this._startColor = cc.color(255, 255, 255, 255);
    this._startColorVar = cc.color(0, 0, 0, 0);
    this._endColor = cc.color(255, 255, 255, 0);
    this._endColorVar = cc.color(0, 0, 0, 0); // The temporary SpriteFrame object used for the renderer. Because there is no corresponding asset, it can't be serialized.

    this._renderSpriteFrame = null;
  },
  properties: properties,
  statics: {
    /**
     * !#en The Particle emitter lives forever.
     * !#zh 表示发射器永久存在
     * @property {Number} DURATION_INFINITY
     * @default -1
     * @static
     * @readonly
     */
    DURATION_INFINITY: -1,

    /**
     * !#en The starting size of the particle is equal to the ending size.
     * !#zh 表示粒子的起始大小等于结束大小。
     * @property {Number} START_SIZE_EQUAL_TO_END_SIZE
     * @default -1
     * @static
     * @readonly
     */
    START_SIZE_EQUAL_TO_END_SIZE: -1,

    /**
     * !#en The starting radius of the particle is equal to the ending radius.
     * !#zh 表示粒子的起始半径等于结束半径。
     * @property {Number} START_RADIUS_EQUAL_TO_END_RADIUS
     * @default -1
     * @static
     * @readonly
     */
    START_RADIUS_EQUAL_TO_END_RADIUS: -1,
    EmitterMode: EmitterMode,
    PositionType: PositionType,
    _PNGReader: PNGReader,
    _TIFFReader: tiffReader
  },
  // EDITOR RELATED METHODS
  onFocusInEditor: CC_EDITOR && function () {
    this._focused = true;
    var components = getParticleComponents(this.node);

    for (var i = 0; i < components.length; ++i) {
      components[i]._startPreview();
    }
  },
  onLostFocusInEditor: CC_EDITOR && function () {
    this._focused = false;
    var components = getParticleComponents(this.node);

    for (var i = 0; i < components.length; ++i) {
      components[i]._stopPreview();
    }
  },
  _startPreview: CC_EDITOR && function () {
    if (this.preview) {
      this.resetSystem();
    }
  },
  _stopPreview: CC_EDITOR && function () {
    if (this.preview) {
      this.resetSystem();
      this.stopSystem();
      this.disableRender();
      cc.engine.repaintInEditMode();
    }

    if (this._previewTimer) {
      clearInterval(this._previewTimer);
    }
  },
  // LIFE-CYCLE METHODS
  // just used to read data from 1.x
  _convertTextureToSpriteFrame: CC_EDITOR && function () {
    if (this._spriteFrame) {
      return;
    }

    var texture = this.texture;

    if (!texture || !texture._uuid) {
      return;
    }

    var _this = this;

    Editor.assetdb.queryMetaInfoByUuid(texture._uuid, function (err, metaInfo) {
      if (err) return Editor.error(err);
      var meta = JSON.parse(metaInfo.json);

      if (meta.type === 'raw') {
        var NodeUtils = Editor.require('app://editor/page/scene-utils/utils/node');

        var nodePath = NodeUtils.getNodePath(_this.node);
        return Editor.warn("The texture " + metaInfo.assetUrl + " used by particle " + nodePath + " does not contain any SpriteFrame, please set the texture type to Sprite and reassign the SpriteFrame to the particle component.");
      } else {
        var Url = require('fire-url');

        var name = Url.basenameNoExt(metaInfo.assetPath);
        var uuid = meta.subMetas[name].uuid;
        cc.assetManager.loadAny(uuid, function (err, sp) {
          if (err) return Editor.error(err);
          _this.spriteFrame = sp;
        });
      }
    });
  },
  __preload: function __preload() {
    this._super();

    if (CC_EDITOR) {
      this._convertTextureToSpriteFrame();
    }

    if (this._custom && this.spriteFrame && !this._renderSpriteFrame) {
      this._applySpriteFrame(this.spriteFrame);
    } else if (this._file) {
      if (this._custom) {
        var missCustomTexture = !this._getTexture();

        if (missCustomTexture) {
          this._applyFile();
        }
      } else {
        this._applyFile();
      }
    } // auto play


    if (!CC_EDITOR || cc.engine.isPlaying) {
      if (this.playOnLoad) {
        this.resetSystem();
      }
    } // Upgrade color type from v2.0.0


    if (CC_EDITOR && !(this._startColor instanceof cc.Color)) {
      this._startColor = cc.color(this._startColor);
      this._startColorVar = cc.color(this._startColorVar);
      this._endColor = cc.color(this._endColor);
      this._endColorVar = cc.color(this._endColorVar);
    }
  },
  onDestroy: function onDestroy() {
    if (this.autoRemoveOnFinish) {
      this.autoRemoveOnFinish = false; // already removed
    }

    if (this._buffer) {
      this._buffer.destroy();

      this._buffer = null;
    } // reset uv data so next time simulator will refill buffer uv info when exit edit mode from prefab.


    this._simulator._uvFilled = 0;

    this._super();
  },
  lateUpdate: function lateUpdate(dt) {
    if (!this._simulator.finished) {
      this._simulator.step(dt);
    }
  },
  // APIS

  /*
   * !#en Add a particle to the emitter.
   * !#zh 添加一个粒子到发射器中。
   * @method addParticle
   * @return {Boolean}
   */
  addParticle: function addParticle() {// Not implemented
  },

  /**
   * !#en Stop emitting particles. Running particles will continue to run until they die.
   * !#zh 停止发射器发射粒子，发射出去的粒子将继续运行，直至粒子生命结束。
   * @method stopSystem
   * @example
   * // stop particle system.
   * myParticleSystem.stopSystem();
   */
  stopSystem: function stopSystem() {
    this._stopped = true;

    this._simulator.stop();
  },

  /**
   * !#en Kill all living particles.
   * !#zh 杀死所有存在的粒子，然后重新启动粒子发射器。
   * @method resetSystem
   * @example
   * // play particle system.
   * myParticleSystem.resetSystem();
   */
  resetSystem: function resetSystem() {
    this._stopped = false;

    this._simulator.reset();

    this.markForRender(true);
  },

  /**
   * !#en Whether or not the system is full.
   * !#zh 发射器中粒子是否大于等于设置的总粒子数量。
   * @method isFull
   * @return {Boolean}
   */
  isFull: function isFull() {
    return this.particleCount >= this.totalParticles;
  },

  /**
   * !#en Sets a new texture with a rect. The rect is in texture position and size.
   * Please use spriteFrame property instead, this function is deprecated since v1.9
   * !#zh 设置一张新贴图和关联的矩形。
   * 请直接设置 spriteFrame 属性，这个函数从 v1.9 版本开始已经被废弃
   * @method setTextureWithRect
   * @param {Texture2D} texture
   * @param {Rect} rect
   * @deprecated since v1.9
   */
  setTextureWithRect: function setTextureWithRect(texture, rect) {
    if (texture instanceof cc.Texture2D) {
      this.spriteFrame = new cc.SpriteFrame(texture, rect);
    }
  },
  // PRIVATE METHODS
  _applyFile: function _applyFile() {
    var file = this._file;

    if (file) {
      var self = this;
      cc.assetManager.postLoadNative(file, function (err) {
        if (err || !file._nativeAsset) {
          cc.errorID(6029);
          return;
        }

        if (!self.isValid) {
          return;
        }

        self._plistFile = file.nativeUrl;

        if (!self._custom) {
          var isDiffFrame = self._spriteFrame !== file.spriteFrame;
          if (isDiffFrame) self.spriteFrame = file.spriteFrame;

          self._initWithDictionary(file._nativeAsset);
        }

        if (!self._spriteFrame) {
          if (file.spriteFrame) {
            self.spriteFrame = file.spriteFrame;
          } else if (self._custom) {
            self._initTextureWithDictionary(file._nativeAsset);
          }
        } else if (!self._renderSpriteFrame && self._spriteFrame) {
          self._applySpriteFrame(self.spriteFrame);
        }
      });
    }
  },
  _initTextureWithDictionary: function _initTextureWithDictionary(dict) {
    var imgPath = cc.path.changeBasename(this._plistFile, dict["textureFileName"] || ''); // texture

    if (dict["textureFileName"]) {
      // Try to get the texture from the cache
      textureUtil.loadImage(imgPath, function (error, texture) {
        if (error) {
          dict["textureFileName"] = undefined;

          this._initTextureWithDictionary(dict);
        } else {
          cc.assetManager.assets.add(imgPath, texture);
          this.spriteFrame = new cc.SpriteFrame(texture);
        }
      }, this);
    } else if (dict["textureImageData"]) {
      var textureData = dict["textureImageData"];

      if (textureData && textureData.length > 0) {
        var tex = cc.assetManager.assets.get(imgPath);

        if (!tex) {
          var buffer = codec.unzipBase64AsArray(textureData, 1);

          if (!buffer) {
            cc.warnID(6030, this._file.name);
            return false;
          }

          var imageFormat = getImageFormatByData(buffer);

          if (imageFormat !== macro.ImageFormat.TIFF && imageFormat !== macro.ImageFormat.PNG) {
            cc.warnID(6031, this._file.name);
            return false;
          }

          var canvasObj = document.createElement("canvas");

          if (imageFormat === macro.ImageFormat.PNG) {
            var myPngObj = new PNGReader(buffer);
            myPngObj.render(canvasObj);
          } else {
            tiffReader.parseTIFF(buffer, canvasObj);
          }

          tex = textureUtil.cacheImage(imgPath, canvasObj);
        }

        if (!tex) cc.warnID(6032, this._file.name); // TODO: Use cc.assetManager to load asynchronously the SpriteFrame object, avoid using textureUtil

        this.spriteFrame = new cc.SpriteFrame(tex);
      } else {
        return false;
      }
    }

    return true;
  },
  // parsing process
  _initWithDictionary: function _initWithDictionary(dict) {
    this.totalParticles = parseInt(dict["maxParticles"] || 0); // life span

    this.life = parseFloat(dict["particleLifespan"] || 0);
    this.lifeVar = parseFloat(dict["particleLifespanVariance"] || 0); // emission Rate

    var _tempEmissionRate = dict["emissionRate"];

    if (_tempEmissionRate) {
      this.emissionRate = _tempEmissionRate;
    } else {
      this.emissionRate = Math.min(this.totalParticles / this.life, Number.MAX_VALUE);
    } // duration


    this.duration = parseFloat(dict["duration"] || 0); // blend function

    this.srcBlendFactor = parseInt(dict["blendFuncSource"] || macro.SRC_ALPHA);
    this.dstBlendFactor = parseInt(dict["blendFuncDestination"] || macro.ONE_MINUS_SRC_ALPHA); // color

    var locStartColor = this._startColor;
    locStartColor.r = parseFloat(dict["startColorRed"] || 0) * 255;
    locStartColor.g = parseFloat(dict["startColorGreen"] || 0) * 255;
    locStartColor.b = parseFloat(dict["startColorBlue"] || 0) * 255;
    locStartColor.a = parseFloat(dict["startColorAlpha"] || 0) * 255;
    var locStartColorVar = this._startColorVar;
    locStartColorVar.r = parseFloat(dict["startColorVarianceRed"] || 0) * 255;
    locStartColorVar.g = parseFloat(dict["startColorVarianceGreen"] || 0) * 255;
    locStartColorVar.b = parseFloat(dict["startColorVarianceBlue"] || 0) * 255;
    locStartColorVar.a = parseFloat(dict["startColorVarianceAlpha"] || 0) * 255;
    var locEndColor = this._endColor;
    locEndColor.r = parseFloat(dict["finishColorRed"] || 0) * 255;
    locEndColor.g = parseFloat(dict["finishColorGreen"] || 0) * 255;
    locEndColor.b = parseFloat(dict["finishColorBlue"] || 0) * 255;
    locEndColor.a = parseFloat(dict["finishColorAlpha"] || 0) * 255;
    var locEndColorVar = this._endColorVar;
    locEndColorVar.r = parseFloat(dict["finishColorVarianceRed"] || 0) * 255;
    locEndColorVar.g = parseFloat(dict["finishColorVarianceGreen"] || 0) * 255;
    locEndColorVar.b = parseFloat(dict["finishColorVarianceBlue"] || 0) * 255;
    locEndColorVar.a = parseFloat(dict["finishColorVarianceAlpha"] || 0) * 255; // particle size

    this.startSize = parseFloat(dict["startParticleSize"] || 0);
    this.startSizeVar = parseFloat(dict["startParticleSizeVariance"] || 0);
    this.endSize = parseFloat(dict["finishParticleSize"] || 0);
    this.endSizeVar = parseFloat(dict["finishParticleSizeVariance"] || 0); // position
    // Make empty positionType value and old version compatible

    this.positionType = parseFloat(dict['positionType'] !== undefined ? dict['positionType'] : PositionType.RELATIVE); // for

    this.sourcePos.x = 0;
    this.sourcePos.y = 0;
    this.posVar.x = parseFloat(dict["sourcePositionVariancex"] || 0);
    this.posVar.y = parseFloat(dict["sourcePositionVariancey"] || 0); // angle

    this.angle = parseFloat(dict["angle"] || 0);
    this.angleVar = parseFloat(dict["angleVariance"] || 0); // Spinning

    this.startSpin = parseFloat(dict["rotationStart"] || 0);
    this.startSpinVar = parseFloat(dict["rotationStartVariance"] || 0);
    this.endSpin = parseFloat(dict["rotationEnd"] || 0);
    this.endSpinVar = parseFloat(dict["rotationEndVariance"] || 0);
    this.emitterMode = parseInt(dict["emitterType"] || EmitterMode.GRAVITY); // Mode A: Gravity + tangential accel + radial accel

    if (this.emitterMode === EmitterMode.GRAVITY) {
      // gravity
      this.gravity.x = parseFloat(dict["gravityx"] || 0);
      this.gravity.y = parseFloat(dict["gravityy"] || 0); // speed

      this.speed = parseFloat(dict["speed"] || 0);
      this.speedVar = parseFloat(dict["speedVariance"] || 0); // radial acceleration

      this.radialAccel = parseFloat(dict["radialAcceleration"] || 0);
      this.radialAccelVar = parseFloat(dict["radialAccelVariance"] || 0); // tangential acceleration

      this.tangentialAccel = parseFloat(dict["tangentialAcceleration"] || 0);
      this.tangentialAccelVar = parseFloat(dict["tangentialAccelVariance"] || 0); // rotation is dir

      var locRotationIsDir = dict["rotationIsDir"] || "";

      if (locRotationIsDir !== null) {
        locRotationIsDir = locRotationIsDir.toString().toLowerCase();
        this.rotationIsDir = locRotationIsDir === "true" || locRotationIsDir === "1";
      } else {
        this.rotationIsDir = false;
      }
    } else if (this.emitterMode === EmitterMode.RADIUS) {
      // or Mode B: radius movement
      this.startRadius = parseFloat(dict["maxRadius"] || 0);
      this.startRadiusVar = parseFloat(dict["maxRadiusVariance"] || 0);
      this.endRadius = parseFloat(dict["minRadius"] || 0);
      this.endRadiusVar = parseFloat(dict["minRadiusVariance"] || 0);
      this.rotatePerS = parseFloat(dict["rotatePerSecond"] || 0);
      this.rotatePerSVar = parseFloat(dict["rotatePerSecondVariance"] || 0);
    } else {
      cc.warnID(6009);
      return false;
    }

    this._initTextureWithDictionary(dict);

    return true;
  },
  _validateRender: function _validateRender() {
    var texture = this._getTexture();

    if (!texture || !texture.loaded) {
      this.disableRender();
      return;
    }

    this._super();
  },
  _onTextureLoaded: function _onTextureLoaded() {
    this._simulator.updateUVs(true);

    this._syncAspect();

    this._updateMaterial();

    this.markForRender(true);
  },
  _syncAspect: function _syncAspect() {
    var frameRect = this._renderSpriteFrame._rect;
    this._aspectRatio = frameRect.width / frameRect.height;
  },
  _applySpriteFrame: function _applySpriteFrame() {
    this._renderSpriteFrame = this._renderSpriteFrame || this._spriteFrame;

    if (this._renderSpriteFrame) {
      if (this._renderSpriteFrame.textureLoaded()) {
        this._onTextureLoaded();
      } else {
        this._renderSpriteFrame.onTextureLoaded(this._onTextureLoaded, this);
      }
    }
  },
  _getTexture: function _getTexture() {
    return this._renderSpriteFrame && this._renderSpriteFrame.getTexture() || this._texture;
  },
  _updateMaterial: function _updateMaterial() {
    var material = this.getMaterial(0);
    if (!material) return;
    material.define('CC_USE_MODEL', this._positionType !== PositionType.FREE);
    material.setProperty('texture', this._getTexture());

    BlendFunc.prototype._updateMaterial.call(this);
  },
  _finishedSimulation: function _finishedSimulation() {
    if (CC_EDITOR) {
      if (this.preview && this._focused && !this.active && !cc.engine.isPlaying) {
        this.resetSystem();
      }

      return;
    }

    this.resetSystem();
    this.stopSystem();
    this.disableRender();

    if (this.autoRemoveOnFinish && this._stopped) {
      this.node.destroy();
    }
  }
});
cc.ParticleSystem = module.exports = ParticleSystem;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9wYXJ0aWNsZS9DQ1BhcnRpY2xlU3lzdGVtLmpzIl0sIm5hbWVzIjpbIm1hY3JvIiwicmVxdWlyZSIsIlBhcnRpY2xlQXNzZXQiLCJSZW5kZXJDb21wb25lbnQiLCJjb2RlYyIsIlBOR1JlYWRlciIsInRpZmZSZWFkZXIiLCJ0ZXh0dXJlVXRpbCIsIlJlbmRlckZsb3ciLCJQYXJ0aWNsZVNpbXVsYXRvciIsIk1hdGVyaWFsIiwiQmxlbmRGdW5jIiwiZ2V0SW1hZ2VGb3JtYXRCeURhdGEiLCJpbWdEYXRhIiwibGVuZ3RoIiwiSW1hZ2VGb3JtYXQiLCJQTkciLCJUSUZGIiwiVU5LTk9XTiIsImdldFBhcnRpY2xlQ29tcG9uZW50cyIsIm5vZGUiLCJwYXJlbnQiLCJjb21wIiwiZ2V0Q29tcG9uZW50IiwiY2MiLCJQYXJ0aWNsZVN5c3RlbSIsImdldENvbXBvbmVudHNJbkNoaWxkcmVuIiwiRW1pdHRlck1vZGUiLCJFbnVtIiwiR1JBVklUWSIsIlJBRElVUyIsIlBvc2l0aW9uVHlwZSIsIkZSRUUiLCJSRUxBVElWRSIsIkdST1VQRUQiLCJwcm9wZXJ0aWVzIiwicHJldmlldyIsImVkaXRvck9ubHkiLCJub3RpZnkiLCJDQ19FRElUT1IiLCJyZXNldFN5c3RlbSIsInN0b3BTeXN0ZW0iLCJkaXNhYmxlUmVuZGVyIiwiZW5naW5lIiwicmVwYWludEluRWRpdE1vZGUiLCJhbmltYXRhYmxlIiwidG9vbHRpcCIsIkNDX0RFViIsIl9jdXN0b20iLCJjdXN0b20iLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsIl9maWxlIiwid2FybklEIiwiX2FwcGx5RmlsZSIsInR5cGUiLCJmaWxlIiwiZm9yY2UiLCJfc3ByaXRlRnJhbWUiLCJTcHJpdGVGcmFtZSIsInNwcml0ZUZyYW1lIiwibGFzdFNwcml0ZSIsIl9yZW5kZXJTcHJpdGVGcmFtZSIsIl91dWlkIiwiX2FwcGx5U3ByaXRlRnJhbWUiLCJlbWl0IiwiX3RleHR1cmUiLCJUZXh0dXJlMkQiLCJ0ZXh0dXJlIiwiX2dldFRleHR1cmUiLCJyZWFkb25seSIsInZpc2libGUiLCJwYXJ0aWNsZUNvdW50IiwiX3NpbXVsYXRvciIsInBhcnRpY2xlcyIsIl9zdG9wcGVkIiwic3RvcHBlZCIsInBsYXlPbkxvYWQiLCJhdXRvUmVtb3ZlT25GaW5pc2giLCJhY3RpdmUiLCJ0b3RhbFBhcnRpY2xlcyIsImR1cmF0aW9uIiwiZW1pc3Npb25SYXRlIiwibGlmZSIsImxpZmVWYXIiLCJfc3RhcnRDb2xvciIsInN0YXJ0Q29sb3IiLCJDb2xvciIsInZhbCIsInIiLCJnIiwiYiIsImEiLCJfc3RhcnRDb2xvclZhciIsInN0YXJ0Q29sb3JWYXIiLCJfZW5kQ29sb3IiLCJlbmRDb2xvciIsIl9lbmRDb2xvclZhciIsImVuZENvbG9yVmFyIiwiYW5nbGUiLCJhbmdsZVZhciIsInN0YXJ0U2l6ZSIsInN0YXJ0U2l6ZVZhciIsImVuZFNpemUiLCJlbmRTaXplVmFyIiwic3RhcnRTcGluIiwic3RhcnRTcGluVmFyIiwiZW5kU3BpbiIsImVuZFNwaW5WYXIiLCJzb3VyY2VQb3MiLCJWZWMyIiwiWkVSTyIsInBvc1ZhciIsIl9wb3NpdGlvblR5cGUiLCJmb3JtZXJseVNlcmlhbGl6ZWRBcyIsInBvc2l0aW9uVHlwZSIsIl91cGRhdGVNYXRlcmlhbCIsImVtaXR0ZXJNb2RlIiwiZ3Jhdml0eSIsInNwZWVkIiwic3BlZWRWYXIiLCJ0YW5nZW50aWFsQWNjZWwiLCJ0YW5nZW50aWFsQWNjZWxWYXIiLCJyYWRpYWxBY2NlbCIsInJhZGlhbEFjY2VsVmFyIiwicm90YXRpb25Jc0RpciIsInN0YXJ0UmFkaXVzIiwic3RhcnRSYWRpdXNWYXIiLCJlbmRSYWRpdXMiLCJlbmRSYWRpdXNWYXIiLCJyb3RhdGVQZXJTIiwicm90YXRlUGVyU1ZhciIsIkNsYXNzIiwibmFtZSIsIm1peGlucyIsImVkaXRvciIsIm1lbnUiLCJpbnNwZWN0b3IiLCJwbGF5T25Gb2N1cyIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiY3RvciIsImluaXRQcm9wZXJ0aWVzIiwiX3ByZXZpZXdUaW1lciIsIl9mb2N1c2VkIiwiX2FzcGVjdFJhdGlvIiwiY29sb3IiLCJzdGF0aWNzIiwiRFVSQVRJT05fSU5GSU5JVFkiLCJTVEFSVF9TSVpFX0VRVUFMX1RPX0VORF9TSVpFIiwiU1RBUlRfUkFESVVTX0VRVUFMX1RPX0VORF9SQURJVVMiLCJfUE5HUmVhZGVyIiwiX1RJRkZSZWFkZXIiLCJvbkZvY3VzSW5FZGl0b3IiLCJjb21wb25lbnRzIiwiaSIsIl9zdGFydFByZXZpZXciLCJvbkxvc3RGb2N1c0luRWRpdG9yIiwiX3N0b3BQcmV2aWV3IiwiY2xlYXJJbnRlcnZhbCIsIl9jb252ZXJ0VGV4dHVyZVRvU3ByaXRlRnJhbWUiLCJfdGhpcyIsIkVkaXRvciIsImFzc2V0ZGIiLCJxdWVyeU1ldGFJbmZvQnlVdWlkIiwiZXJyIiwibWV0YUluZm8iLCJlcnJvciIsIm1ldGEiLCJKU09OIiwicGFyc2UiLCJqc29uIiwiTm9kZVV0aWxzIiwibm9kZVBhdGgiLCJnZXROb2RlUGF0aCIsIndhcm4iLCJhc3NldFVybCIsIlVybCIsImJhc2VuYW1lTm9FeHQiLCJhc3NldFBhdGgiLCJ1dWlkIiwic3ViTWV0YXMiLCJhc3NldE1hbmFnZXIiLCJsb2FkQW55Iiwic3AiLCJfX3ByZWxvYWQiLCJfc3VwZXIiLCJtaXNzQ3VzdG9tVGV4dHVyZSIsImlzUGxheWluZyIsIm9uRGVzdHJveSIsIl9idWZmZXIiLCJkZXN0cm95IiwiX3V2RmlsbGVkIiwibGF0ZVVwZGF0ZSIsImR0IiwiZmluaXNoZWQiLCJzdGVwIiwiYWRkUGFydGljbGUiLCJzdG9wIiwicmVzZXQiLCJtYXJrRm9yUmVuZGVyIiwiaXNGdWxsIiwic2V0VGV4dHVyZVdpdGhSZWN0IiwicmVjdCIsInNlbGYiLCJwb3N0TG9hZE5hdGl2ZSIsIl9uYXRpdmVBc3NldCIsImVycm9ySUQiLCJpc1ZhbGlkIiwiX3BsaXN0RmlsZSIsIm5hdGl2ZVVybCIsImlzRGlmZkZyYW1lIiwiX2luaXRXaXRoRGljdGlvbmFyeSIsIl9pbml0VGV4dHVyZVdpdGhEaWN0aW9uYXJ5IiwiZGljdCIsImltZ1BhdGgiLCJwYXRoIiwiY2hhbmdlQmFzZW5hbWUiLCJsb2FkSW1hZ2UiLCJ1bmRlZmluZWQiLCJhc3NldHMiLCJhZGQiLCJ0ZXh0dXJlRGF0YSIsInRleCIsImJ1ZmZlciIsInVuemlwQmFzZTY0QXNBcnJheSIsImltYWdlRm9ybWF0IiwiY2FudmFzT2JqIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwibXlQbmdPYmoiLCJyZW5kZXIiLCJwYXJzZVRJRkYiLCJjYWNoZUltYWdlIiwicGFyc2VJbnQiLCJwYXJzZUZsb2F0IiwiX3RlbXBFbWlzc2lvblJhdGUiLCJNYXRoIiwibWluIiwiTnVtYmVyIiwiTUFYX1ZBTFVFIiwic3JjQmxlbmRGYWN0b3IiLCJTUkNfQUxQSEEiLCJkc3RCbGVuZEZhY3RvciIsIk9ORV9NSU5VU19TUkNfQUxQSEEiLCJsb2NTdGFydENvbG9yIiwibG9jU3RhcnRDb2xvclZhciIsImxvY0VuZENvbG9yIiwibG9jRW5kQ29sb3JWYXIiLCJ4IiwieSIsImxvY1JvdGF0aW9uSXNEaXIiLCJ0b1N0cmluZyIsInRvTG93ZXJDYXNlIiwiX3ZhbGlkYXRlUmVuZGVyIiwibG9hZGVkIiwiX29uVGV4dHVyZUxvYWRlZCIsInVwZGF0ZVVWcyIsIl9zeW5jQXNwZWN0IiwiZnJhbWVSZWN0IiwiX3JlY3QiLCJ3aWR0aCIsImhlaWdodCIsInRleHR1cmVMb2FkZWQiLCJvblRleHR1cmVMb2FkZWQiLCJnZXRUZXh0dXJlIiwibWF0ZXJpYWwiLCJnZXRNYXRlcmlhbCIsImRlZmluZSIsInNldFByb3BlcnR5IiwicHJvdG90eXBlIiwiY2FsbCIsIl9maW5pc2hlZFNpbXVsYXRpb24iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QSxRQUFRLENBQUNHLFdBQVQsQ0FBcUIsU0FBckIsRUFBZ0MsS0FBS3ZNLFdBQUwsRUFBaEM7O0FBRUEzRCxJQUFBQSxTQUFTLENBQUNtUSxTQUFWLENBQW9CekosZUFBcEIsQ0FBb0MwSixJQUFwQyxDQUF5QyxJQUF6QztBQUNILEdBMWdCeUI7QUE0Z0IxQkMsRUFBQUEsbUJBQW1CLEVBQUUsK0JBQVk7QUFDN0IsUUFBSXpPLFNBQUosRUFBZTtBQUNYLFVBQUksS0FBS0gsT0FBTCxJQUFnQixLQUFLNEcsUUFBckIsSUFBaUMsQ0FBQyxLQUFLaEUsTUFBdkMsSUFBaUQsQ0FBQ3hELEVBQUUsQ0FBQ21CLE1BQUgsQ0FBVWlKLFNBQWhFLEVBQTJFO0FBQ3ZFLGFBQUtwSixXQUFMO0FBQ0g7O0FBQ0Q7QUFDSDs7QUFDRCxTQUFLQSxXQUFMO0FBQ0EsU0FBS0MsVUFBTDtBQUNBLFNBQUtDLGFBQUw7O0FBQ0EsUUFBSSxLQUFLcUMsa0JBQUwsSUFBMkIsS0FBS0gsUUFBcEMsRUFBOEM7QUFDMUMsV0FBS3hELElBQUwsQ0FBVTJLLE9BQVY7QUFDSDtBQUNKO0FBemhCeUIsQ0FBVCxDQUFyQjtBQTRoQkF2SyxFQUFFLENBQUNDLGNBQUgsR0FBb0J3UCxNQUFNLENBQUNDLE9BQVAsR0FBaUJ6UCxjQUFyQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3QgbWFjcm8gPSByZXF1aXJlKCcuLi9jb3JlL3BsYXRmb3JtL0NDTWFjcm8nKTtcbmNvbnN0IFBhcnRpY2xlQXNzZXQgPSByZXF1aXJlKCcuL0NDUGFydGljbGVBc3NldCcpO1xuY29uc3QgUmVuZGVyQ29tcG9uZW50ID0gcmVxdWlyZSgnLi4vY29yZS9jb21wb25lbnRzL0NDUmVuZGVyQ29tcG9uZW50Jyk7XG5jb25zdCBjb2RlYyA9IHJlcXVpcmUoJy4uL2NvbXByZXNzaW9uL1ppcFV0aWxzJyk7XG5jb25zdCBQTkdSZWFkZXIgPSByZXF1aXJlKCcuL0NDUE5HUmVhZGVyJyk7XG5jb25zdCB0aWZmUmVhZGVyID0gcmVxdWlyZSgnLi9DQ1RJRkZSZWFkZXInKTtcbmNvbnN0IHRleHR1cmVVdGlsID0gcmVxdWlyZSgnLi4vY29yZS91dGlscy90ZXh0dXJlLXV0aWwnKTtcbmNvbnN0IFJlbmRlckZsb3cgPSByZXF1aXJlKCcuLi9jb3JlL3JlbmRlcmVyL3JlbmRlci1mbG93Jyk7XG5jb25zdCBQYXJ0aWNsZVNpbXVsYXRvciA9IHJlcXVpcmUoJy4vcGFydGljbGUtc2ltdWxhdG9yJyk7XG5jb25zdCBNYXRlcmlhbCA9IHJlcXVpcmUoJy4uL2NvcmUvYXNzZXRzL21hdGVyaWFsL0NDTWF0ZXJpYWwnKTtcbmNvbnN0IEJsZW5kRnVuYyA9IHJlcXVpcmUoJy4uL2NvcmUvdXRpbHMvYmxlbmQtZnVuYycpO1xuXG5mdW5jdGlvbiBnZXRJbWFnZUZvcm1hdEJ5RGF0YSAoaW1nRGF0YSkge1xuICAgIC8vIGlmIGl0IGlzIGEgcG5nIGZpbGUgYnVmZmVyLlxuICAgIGlmIChpbWdEYXRhLmxlbmd0aCA+IDggJiYgaW1nRGF0YVswXSA9PT0gMHg4OVxuICAgICAgICAmJiBpbWdEYXRhWzFdID09PSAweDUwXG4gICAgICAgICYmIGltZ0RhdGFbMl0gPT09IDB4NEVcbiAgICAgICAgJiYgaW1nRGF0YVszXSA9PT0gMHg0N1xuICAgICAgICAmJiBpbWdEYXRhWzRdID09PSAweDBEXG4gICAgICAgICYmIGltZ0RhdGFbNV0gPT09IDB4MEFcbiAgICAgICAgJiYgaW1nRGF0YVs2XSA9PT0gMHgxQVxuICAgICAgICAmJiBpbWdEYXRhWzddID09PSAweDBBKSB7XG4gICAgICAgIHJldHVybiBtYWNyby5JbWFnZUZvcm1hdC5QTkc7XG4gICAgfVxuXG4gICAgLy8gaWYgaXQgaXMgYSB0aWZmIGZpbGUgYnVmZmVyLlxuICAgIGlmIChpbWdEYXRhLmxlbmd0aCA+IDIgJiYgKChpbWdEYXRhWzBdID09PSAweDQ5ICYmIGltZ0RhdGFbMV0gPT09IDB4NDkpXG4gICAgICAgIHx8IChpbWdEYXRhWzBdID09PSAweDRkICYmIGltZ0RhdGFbMV0gPT09IDB4NGQpXG4gICAgICAgIHx8IChpbWdEYXRhWzBdID09PSAweGZmICYmIGltZ0RhdGFbMV0gPT09IDB4ZDgpKSkge1xuICAgICAgICByZXR1cm4gbWFjcm8uSW1hZ2VGb3JtYXQuVElGRjtcbiAgICB9XG4gICAgcmV0dXJuIG1hY3JvLkltYWdlRm9ybWF0LlVOS05PV047XG59XG5cbi8vXG5mdW5jdGlvbiBnZXRQYXJ0aWNsZUNvbXBvbmVudHMgKG5vZGUpIHtcbiAgICBsZXQgcGFyZW50ID0gbm9kZS5wYXJlbnQsIGNvbXAgPSBub2RlLmdldENvbXBvbmVudChjYy5QYXJ0aWNsZVN5c3RlbSk7XG4gICAgaWYgKCFwYXJlbnQgfHwgIWNvbXApIHtcbiAgICAgICAgcmV0dXJuIG5vZGUuZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4oY2MuUGFydGljbGVTeXN0ZW0pO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0UGFydGljbGVDb21wb25lbnRzKHBhcmVudCk7XG59XG5cblxuLyoqXG4gKiAhI2VuIEVudW0gZm9yIGVtaXR0ZXIgbW9kZXNcbiAqICEjemgg5Y+R5bCE5qih5byPXG4gKiBAZW51bSBQYXJ0aWNsZVN5c3RlbS5FbWl0dGVyTW9kZVxuICovXG52YXIgRW1pdHRlck1vZGUgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIFVzZXMgZ3Jhdml0eSwgc3BlZWQsIHJhZGlhbCBhbmQgdGFuZ2VudGlhbCBhY2NlbGVyYXRpb24uXG4gICAgICogISN6aCDph43lipvmqKHlvI/vvIzmqKHmi5/ph43lipvvvIzlj6/orqnnspLlrZDlm7Tnu5XkuIDkuKrkuK3lv4Pngrnnp7vov5HmiJbnp7vov5zjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gR1JBVklUWVxuICAgICAqL1xuICAgIEdSQVZJVFk6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBVc2VzIHJhZGl1cyBtb3ZlbWVudCArIHJvdGF0aW9uLlxuICAgICAqICEjemgg5Y2K5b6E5qih5byP77yM5Y+v5Lul5L2/57KS5a2Q5Lul5ZyG5ZyI5pa55byP5peL6L2s77yM5a6D5Lmf5Y+v5Lul5Yib6YCg6J665peL5pWI5p6c6K6p57KS5a2Q5oCl6YCf5YmN6L+b5oiW5ZCO6YCA44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFJBRElVUyAtIFVzZXMgcmFkaXVzIG1vdmVtZW50ICsgcm90YXRpb24uXG4gICAgICovXG4gICAgUkFESVVTOiAxXG59KTtcblxuLyoqXG4gKiAhI2VuIEVudW0gZm9yIHBhcnRpY2xlcyBtb3ZlbWVudCB0eXBlLlxuICogISN6aCDnspLlrZDkvY3nva7nsbvlnotcbiAqIEBlbnVtIFBhcnRpY2xlU3lzdGVtLlBvc2l0aW9uVHlwZVxuICovXG52YXIgUG9zaXRpb25UeXBlID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIExpdmluZyBwYXJ0aWNsZXMgYXJlIGF0dGFjaGVkIHRvIHRoZSB3b3JsZCBhbmQgYXJlIHVuYWZmZWN0ZWQgYnkgZW1pdHRlciByZXBvc2l0aW9uaW5nLlxuICAgICAqICEjemhcbiAgICAgKiDoh6rnlLHmqKHlvI/vvIznm7jlr7nkuo7kuJbnlYzlnZDmoIfvvIzkuI3kvJrpmo/nspLlrZDoioLngrnnp7vliqjogIznp7vliqjjgILvvIjlj6/kuqfnlJ/ngavnhLDjgIHokrjmsb3nrYnmlYjmnpzvvIlcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gRlJFRVxuICAgICAqL1xuICAgIEZSRUU6IDAsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogSW4gdGhlIHJlbGF0aXZlIG1vZGUsIHRoZSBwYXJ0aWNsZSB3aWxsIG1vdmUgd2l0aCB0aGUgcGFyZW50IG5vZGUsIGJ1dCBub3Qgd2l0aCB0aGUgbm9kZSB3aGVyZSB0aGUgcGFydGljbGUgaXMuIFxuICAgICAqIEZvciBleGFtcGxlLCB0aGUgY29mZmVlIGluIHRoZSBjdXAgaXMgc3RlYW1pbmcuIFRoZW4gdGhlIHN0ZWFtIG1vdmVzIChmb3J3YXJkKSB3aXRoIHRoZSB0cmFpbiwgcmF0aGVyIHRoYW4gbW92ZXMgd2l0aCB0aGUgY3VwLlxuICAgICAqICEjemhcbiAgICAgKiDnm7jlr7nmqKHlvI/vvIznspLlrZDkvJrot5/pmo/niLboioLngrnnp7vliqjvvIzkvYbkuI3ot5/pmo/nspLlrZDmiYDlnKjoioLngrnnp7vliqjvvIzkvovlpoLlnKjkuIDliJfooYzov5vngavovabkuK3vvIzmna/kuK3nmoTlkpbllaHpo5jotbfpm77msJTvvIxcbiAgICAgKiDmna/lrZDnp7vliqjvvIzpm77msJTmlbTkvZPlubbkuI3kvJrpmo/nnYDmna/lrZDnp7vliqjvvIzkvYbku47ngavovabmlbTkvZPnmoTop5LluqbmnaXnnIvvvIzpm77msJTmlbTkvZPkvJrpmo/nnYDngavovabnp7vliqjjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUkVMQVRJVkVcbiAgICAgKi9cbiAgICBSRUxBVElWRTogMSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBMaXZpbmcgcGFydGljbGVzIGFyZSBhdHRhY2hlZCB0byB0aGUgZW1pdHRlciBhbmQgYXJlIHRyYW5zbGF0ZWQgYWxvbmcgd2l0aCBpdC5cbiAgICAgKiAhI3poXG4gICAgICog5pW057uE5qih5byP77yM57KS5a2Q6Lef6ZqP5Y+R5bCE5Zmo56e75Yqo44CC77yI5LiN5Lya5Y+R55Sf5ouW5bC+77yJXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEdST1VQRURcbiAgICAgKi9cbiAgICBHUk9VUEVEOiAyXG59KTtcblxuLyoqXG4gKiBAY2xhc3MgUGFydGljbGVTeXN0ZW1cbiAqL1xuXG52YXIgcHJvcGVydGllcyA9IHtcbiAgICAvKipcbiAgICAgKiAhI2VuIFBsYXkgcGFydGljbGUgaW4gZWRpdCBtb2RlLlxuICAgICAqICEjemgg5Zyo57yW6L6R5Zmo5qih5byP5LiL6aKE6KeI57KS5a2Q77yM5ZCv55So5ZCO6YCJ5Lit57KS5a2Q5pe277yM57KS5a2Q5bCG6Ieq5Yqo5pKt5pS+44CCXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBwcmV2aWV3XG4gICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgKi9cbiAgICBwcmV2aWV3OiB7XG4gICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgIGVkaXRvck9ubHk6IHRydWUsXG4gICAgICAgIG5vdGlmeTogQ0NfRURJVE9SICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRTeXN0ZW0oKTtcbiAgICAgICAgICAgIGlmICggIXRoaXMucHJldmlldyApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3BTeXN0ZW0oKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc2FibGVSZW5kZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNjLmVuZ2luZS5yZXBhaW50SW5FZGl0TW9kZSgpO1xuICAgICAgICB9LFxuICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5wYXJ0aWNsZV9zeXN0ZW0ucHJldmlldydcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIElmIHNldCBjdXN0b20gdG8gdHJ1ZSwgdGhlbiB1c2UgY3VzdG9tIHByb3BlcnRpZXMgaW5zdGVhZG9mIHJlYWQgcGFydGljbGUgZmlsZS5cbiAgICAgKiAhI3poIOaYr+WQpuiHquWumuS5ieeykuWtkOWxnuaAp+OAglxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gY3VzdG9tXG4gICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgKi9cbiAgICBfY3VzdG9tOiBmYWxzZSxcbiAgICBjdXN0b206IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY3VzdG9tO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKENDX0VESVRPUiAmJiAhdmFsdWUgJiYgIXRoaXMuX2ZpbGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2Mud2FybklEKDYwMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX2N1c3RvbSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXN0b20gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9hcHBseUZpbGUoKTtcbiAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmVuZ2luZS5yZXBhaW50SW5FZGl0TW9kZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGFydGljbGVfc3lzdGVtLmN1c3RvbSdcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgcGxpc3QgZmlsZS5cbiAgICAgKiAhI3poIHBsaXN0IOagvOW8j+eahOeykuWtkOmFjee9ruaWh+S7tuOAglxuICAgICAqIEBwcm9wZXJ0eSB7UGFydGljbGVBc3NldH0gZmlsZVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKi9cbiAgICBfZmlsZToge1xuICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICB0eXBlOiBQYXJ0aWNsZUFzc2V0XG4gICAgfSxcbiAgICBmaWxlOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZpbGU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlLCBmb3JjZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2ZpbGUgIT09IHZhbHVlIHx8IChDQ19FRElUT1IgJiYgZm9yY2UpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZmlsZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hcHBseUZpbGUoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZW5naW5lLnJlcGFpbnRJbkVkaXRNb2RlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VzdG9tID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICB0eXBlOiBQYXJ0aWNsZUFzc2V0LFxuICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBhcnRpY2xlX3N5c3RlbS5maWxlJ1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNwcml0ZUZyYW1lIHVzZWQgZm9yIHBhcnRpY2xlcyBkaXNwbGF5XG4gICAgICogISN6aCDnlKjkuo7nspLlrZDlkYjnjrDnmoQgU3ByaXRlRnJhbWVcbiAgICAgKiBAcHJvcGVydHkgc3ByaXRlRnJhbWVcbiAgICAgKiBAdHlwZSB7U3ByaXRlRnJhbWV9XG4gICAgICovXG4gICAgX3Nwcml0ZUZyYW1lOiB7XG4gICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIHR5cGU6IGNjLlNwcml0ZUZyYW1lXG4gICAgfSxcbiAgICBzcHJpdGVGcmFtZToge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zcHJpdGVGcmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUsIGZvcmNlKSB7XG4gICAgICAgICAgICB2YXIgbGFzdFNwcml0ZSA9IHRoaXMuX3JlbmRlclNwcml0ZUZyYW1lO1xuICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgIGlmICghZm9yY2UgJiYgbGFzdFNwcml0ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChsYXN0U3ByaXRlID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyU3ByaXRlRnJhbWUgPSB2YWx1ZTtcblxuICAgICAgICAgICAgaWYgKCF2YWx1ZSB8fCB2YWx1ZS5fdXVpZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Nwcml0ZUZyYW1lID0gdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2FwcGx5U3ByaXRlRnJhbWUobGFzdFNwcml0ZSk7XG4gICAgICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLmVtaXQoJ3Nwcml0ZWZyYW1lLWNoYW5nZWQnLCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdHlwZTogY2MuU3ByaXRlRnJhbWUsXG4gICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGFydGljbGVfc3lzdGVtLnNwcml0ZUZyYW1lJ1xuICAgIH0sXG5cblxuICAgIC8vIGp1c3QgdXNlZCB0byByZWFkIGRhdGEgZnJvbSAxLnhcbiAgICBfdGV4dHVyZToge1xuICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICB0eXBlOiBjYy5UZXh0dXJlMkQsXG4gICAgICAgIGVkaXRvck9ubHk6IHRydWUsXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGV4dHVyZSBvZiBQYXJ0aWNsZSBTeXN0ZW0sIHJlYWRvbmx5LCBwbGVhc2UgdXNlIHNwcml0ZUZyYW1lIHRvIHNldHVwIG5ldyB0ZXh0dXJl44CCXG4gICAgICogISN6aCDnspLlrZDotLTlm77vvIzlj6ror7vlsZ7mgKfvvIzor7fkvb/nlKggc3ByaXRlRnJhbWUg5bGe5oCn5p2l5pu/5o2i6LS05Zu+44CCXG4gICAgICogQHByb3BlcnR5IHRleHR1cmVcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRleHR1cmU6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0VGV4dHVyZSgpO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybklEKDYwMTcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0eXBlOiBjYy5UZXh0dXJlMkQsXG4gICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGFydGljbGVfc3lzdGVtLnRleHR1cmUnLFxuICAgICAgICByZWFkb25seTogdHJ1ZSxcbiAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ3VycmVudCBxdWFudGl0eSBvZiBwYXJ0aWNsZXMgdGhhdCBhcmUgYmVpbmcgc2ltdWxhdGVkLlxuICAgICAqICEjemgg5b2T5YmN5pKt5pS+55qE57KS5a2Q5pWw6YeP44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHBhcnRpY2xlQ291bnRcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBwYXJ0aWNsZUNvdW50OiB7XG4gICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NpbXVsYXRvci5wYXJ0aWNsZXMubGVuZ3RoO1xuICAgICAgICB9LFxuICAgICAgICByZWFkb25seTogdHJ1ZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEluZGljYXRlIHdoZXRoZXIgdGhlIHN5c3RlbSBzaW11bGF0aW9uIGhhdmUgc3RvcHBlZC5cbiAgICAgKiAhI3poIOaMh+ekuueykuWtkOaSreaUvuaYr+WQpuWujOavleOAglxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gc3RvcHBlZFxuICAgICAqL1xuICAgIF9zdG9wcGVkOiB0cnVlLFxuICAgIHN0b3BwZWQ6IHtcbiAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdG9wcGVkO1xuICAgICAgICB9LFxuICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBJZiBzZXQgdG8gdHJ1ZSwgdGhlIHBhcnRpY2xlIHN5c3RlbSB3aWxsIGF1dG9tYXRpY2FsbHkgc3RhcnQgcGxheWluZyBvbiBvbkxvYWQuXG4gICAgICogISN6aCDlpoLmnpzorr7nva7kuLogdHJ1ZSDov5DooYzml7bkvJroh6rliqjlj5HlsITnspLlrZDjgIJcbiAgICAgKiBAcHJvcGVydHkgcGxheU9uTG9hZFxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgKi9cbiAgICBwbGF5T25Mb2FkOiB0cnVlLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBJbmRpY2F0ZSB3aGV0aGVyIHRoZSBvd25lciBub2RlIHdpbGwgYmUgYXV0by1yZW1vdmVkIHdoZW4gaXQgaGFzIG5vIHBhcnRpY2xlcyBsZWZ0LlxuICAgICAqICEjemgg57KS5a2Q5pKt5pS+5a6M5q+V5ZCO6Ieq5Yqo6ZSA5q+B5omA5Zyo55qE6IqC54K544CCXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBhdXRvUmVtb3ZlT25GaW5pc2hcbiAgICAgKi9cbiAgICBhdXRvUmVtb3ZlT25GaW5pc2g6IHtcbiAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBhcnRpY2xlX3N5c3RlbS5hdXRvUmVtb3ZlT25GaW5pc2gnXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gSW5kaWNhdGUgd2hldGhlciB0aGUgcGFydGljbGUgc3lzdGVtIGlzIGFjdGl2YXRlZC5cbiAgICAgKiAhI3poIOaYr+WQpua/gOa0u+eykuWtkOOAglxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gYWN0aXZlXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgYWN0aXZlOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NpbXVsYXRvci5hY3RpdmU7XG4gICAgICAgIH0sXG4gICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gTWF4aW11bSBwYXJ0aWNsZXMgb2YgdGhlIHN5c3RlbS5cbiAgICAgKiAhI3poIOeykuWtkOacgOWkp+aVsOmHj+OAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB0b3RhbFBhcnRpY2xlc1xuICAgICAqIEBkZWZhdWx0IDE1MFxuICAgICAqL1xuICAgIHRvdGFsUGFydGljbGVzOiAxNTAsXG4gICAgLyoqXG4gICAgICogISNlbiBIb3cgbWFueSBzZWNvbmRzIHRoZSBlbWl0dGVyIHdpbCBydW4uIC0xIG1lYW5zICdmb3JldmVyJy5cbiAgICAgKiAhI3poIOWPkeWwhOWZqOeUn+WtmOaXtumXtO+8jOWNleS9jeenku+8jC0x6KGo56S65oyB57ut5Y+R5bCE44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGR1cmF0aW9uXG4gICAgICogQGRlZmF1bHQgUGFydGljbGVTeXN0ZW0uRFVSQVRJT05fSU5GSU5JVFlcbiAgICAgKi9cbiAgICBkdXJhdGlvbjogLTEsXG4gICAgLyoqXG4gICAgICogISNlbiBFbWlzc2lvbiByYXRlIG9mIHRoZSBwYXJ0aWNsZXMuXG4gICAgICogISN6aCDmr4/np5Llj5HlsITnmoTnspLlrZDmlbDnm67jgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZW1pc3Npb25SYXRlXG4gICAgICogQGRlZmF1bHQgMTBcbiAgICAgKi9cbiAgICBlbWlzc2lvblJhdGU6IDEwLFxuICAgIC8qKlxuICAgICAqICEjZW4gTGlmZSBvZiBlYWNoIHBhcnRpY2xlIHNldHRlci5cbiAgICAgKiAhI3poIOeykuWtkOeahOi/kOihjOaXtumXtOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBsaWZlXG4gICAgICogQGRlZmF1bHQgMVxuICAgICAqL1xuICAgIGxpZmU6IDEsXG4gICAgLyoqXG4gICAgICogISNlbiBWYXJpYXRpb24gb2YgbGlmZS5cbiAgICAgKiAhI3poIOeykuWtkOeahOi/kOihjOaXtumXtOWPmOWMluiMg+WbtOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBsaWZlVmFyXG4gICAgICogQGRlZmF1bHQgMFxuICAgICAqL1xuICAgIGxpZmVWYXI6IDAsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFN0YXJ0IGNvbG9yIG9mIGVhY2ggcGFydGljbGUuXG4gICAgICogISN6aCDnspLlrZDliJ3lp4vpopzoibLjgIJcbiAgICAgKiBAcHJvcGVydHkge2NjLkNvbG9yfSBzdGFydENvbG9yXG4gICAgICogQGRlZmF1bHQge3I6IDI1NSwgZzogMjU1LCBiOiAyNTUsIGE6IDI1NX1cbiAgICAgKi9cbiAgICBfc3RhcnRDb2xvcjogbnVsbCxcbiAgICBzdGFydENvbG9yOiB7XG4gICAgICAgIHR5cGU6IGNjLkNvbG9yLFxuICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXJ0Q29sb3I7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCAodmFsKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGFydENvbG9yLnIgPSB2YWwucjtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0Q29sb3IuZyA9IHZhbC5nO1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRDb2xvci5iID0gdmFsLmI7XG4gICAgICAgICAgICB0aGlzLl9zdGFydENvbG9yLmEgPSB2YWwuYTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogISNlbiBWYXJpYXRpb24gb2YgdGhlIHN0YXJ0IGNvbG9yLlxuICAgICAqICEjemgg57KS5a2Q5Yid5aeL6aKc6Imy5Y+Y5YyW6IyD5Zu044CCXG4gICAgICogQHByb3BlcnR5IHtjYy5Db2xvcn0gc3RhcnRDb2xvclZhclxuICAgICAqIEBkZWZhdWx0IHtyOiAwLCBnOiAwLCBiOiAwLCBhOiAwfVxuICAgICAqL1xuICAgIF9zdGFydENvbG9yVmFyOiBudWxsLFxuICAgIHN0YXJ0Q29sb3JWYXI6IHtcbiAgICAgICAgdHlwZTogY2MuQ29sb3IsXG4gICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhcnRDb2xvclZhcjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0ICh2YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0Q29sb3JWYXIuciA9IHZhbC5yO1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRDb2xvclZhci5nID0gdmFsLmc7XG4gICAgICAgICAgICB0aGlzLl9zdGFydENvbG9yVmFyLmIgPSB2YWwuYjtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0Q29sb3JWYXIuYSA9IHZhbC5hO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiAhI2VuIEVuZGluZyBjb2xvciBvZiBlYWNoIHBhcnRpY2xlLlxuICAgICAqICEjemgg57KS5a2Q57uT5p2f6aKc6Imy44CCXG4gICAgICogQHByb3BlcnR5IHtjYy5Db2xvcn0gZW5kQ29sb3JcbiAgICAgKiBAZGVmYXVsdCB7cjogMjU1LCBnOiAyNTUsIGI6IDI1NSwgYTogMH1cbiAgICAgKi9cbiAgICBfZW5kQ29sb3I6IG51bGwsXG4gICAgZW5kQ29sb3I6IHtcbiAgICAgICAgdHlwZTogY2MuQ29sb3IsXG4gICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZW5kQ29sb3I7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCAodmFsKSB7XG4gICAgICAgICAgICB0aGlzLl9lbmRDb2xvci5yID0gdmFsLnI7XG4gICAgICAgICAgICB0aGlzLl9lbmRDb2xvci5nID0gdmFsLmc7XG4gICAgICAgICAgICB0aGlzLl9lbmRDb2xvci5iID0gdmFsLmI7XG4gICAgICAgICAgICB0aGlzLl9lbmRDb2xvci5hID0gdmFsLmE7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqICEjZW4gVmFyaWF0aW9uIG9mIHRoZSBlbmQgY29sb3IuXG4gICAgICogISN6aCDnspLlrZDnu5PmnZ/popzoibLlj5jljJbojIPlm7TjgIJcbiAgICAgKiBAcHJvcGVydHkge2NjLkNvbG9yfSBlbmRDb2xvclZhclxuICAgICAqIEBkZWZhdWx0IHtyOiAwLCBnOiAwLCBiOiAwLCBhOiAwfVxuICAgICAqL1xuICAgIF9lbmRDb2xvclZhcjogbnVsbCxcbiAgICBlbmRDb2xvclZhcjoge1xuICAgICAgICB0eXBlOiBjYy5Db2xvcixcbiAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbmRDb2xvclZhcjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0ICh2YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX2VuZENvbG9yVmFyLnIgPSB2YWwucjtcbiAgICAgICAgICAgIHRoaXMuX2VuZENvbG9yVmFyLmcgPSB2YWwuZztcbiAgICAgICAgICAgIHRoaXMuX2VuZENvbG9yVmFyLmIgPSB2YWwuYjtcbiAgICAgICAgICAgIHRoaXMuX2VuZENvbG9yVmFyLmEgPSB2YWwuYTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEFuZ2xlIG9mIGVhY2ggcGFydGljbGUgc2V0dGVyLlxuICAgICAqICEjemgg57KS5a2Q6KeS5bqm44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGFuZ2xlXG4gICAgICogQGRlZmF1bHQgOTBcbiAgICAgKi9cbiAgICBhbmdsZTogOTAsXG4gICAgLyoqXG4gICAgICogISNlbiBWYXJpYXRpb24gb2YgYW5nbGUgb2YgZWFjaCBwYXJ0aWNsZSBzZXR0ZXIuXG4gICAgICogISN6aCDnspLlrZDop5Lluqblj5jljJbojIPlm7TjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gYW5nbGVWYXJcbiAgICAgKiBAZGVmYXVsdCAyMFxuICAgICAqL1xuICAgIGFuZ2xlVmFyOiAyMCxcbiAgICAvKipcbiAgICAgKiAhI2VuIFN0YXJ0IHNpemUgaW4gcGl4ZWxzIG9mIGVhY2ggcGFydGljbGUuXG4gICAgICogISN6aCDnspLlrZDnmoTliJ3lp4vlpKflsI/jgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gc3RhcnRTaXplXG4gICAgICogQGRlZmF1bHQgNTBcbiAgICAgKi9cbiAgICBzdGFydFNpemU6IDUwLFxuICAgIC8qKlxuICAgICAqICEjZW4gVmFyaWF0aW9uIG9mIHN0YXJ0IHNpemUgaW4gcGl4ZWxzLlxuICAgICAqICEjemgg57KS5a2Q5Yid5aeL5aSn5bCP55qE5Y+Y5YyW6IyD5Zu044CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHN0YXJ0U2l6ZVZhclxuICAgICAqIEBkZWZhdWx0IDBcbiAgICAgKi9cbiAgICBzdGFydFNpemVWYXI6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBFbmQgc2l6ZSBpbiBwaXhlbHMgb2YgZWFjaCBwYXJ0aWNsZS5cbiAgICAgKiAhI3poIOeykuWtkOe7k+adn+aXtueahOWkp+Wwj+OAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBlbmRTaXplXG4gICAgICogQGRlZmF1bHQgMFxuICAgICAqL1xuICAgIGVuZFNpemU6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBWYXJpYXRpb24gb2YgZW5kIHNpemUgaW4gcGl4ZWxzLlxuICAgICAqICEjemgg57KS5a2Q57uT5p2f5aSn5bCP55qE5Y+Y5YyW6IyD5Zu044CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGVuZFNpemVWYXJcbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgZW5kU2l6ZVZhcjogMCxcbiAgICAvKipcbiAgICAgKiAhI2VuIFN0YXJ0IGFuZ2xlIG9mIGVhY2ggcGFydGljbGUuXG4gICAgICogISN6aCDnspLlrZDlvIDlp4voh6rml4vop5LluqbjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gc3RhcnRTcGluXG4gICAgICogQGRlZmF1bHQgMFxuICAgICAqL1xuICAgIHN0YXJ0U3BpbjogMCxcbiAgICAvKipcbiAgICAgKiAhI2VuIFZhcmlhdGlvbiBvZiBzdGFydCBhbmdsZS5cbiAgICAgKiAhI3poIOeykuWtkOW8gOWni+iHquaXi+inkuW6puWPmOWMluiMg+WbtOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBzdGFydFNwaW5WYXJcbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgc3RhcnRTcGluVmFyOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gRW5kIGFuZ2xlIG9mIGVhY2ggcGFydGljbGUuXG4gICAgICogISN6aCDnspLlrZDnu5PmnZ/oh6rml4vop5LluqbjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZW5kU3BpblxuICAgICAqIEBkZWZhdWx0IDBcbiAgICAgKi9cbiAgICBlbmRTcGluOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gVmFyaWF0aW9uIG9mIGVuZCBhbmdsZS5cbiAgICAgKiAhI3poIOeykuWtkOe7k+adn+iHquaXi+inkuW6puWPmOWMluiMg+WbtOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBlbmRTcGluVmFyXG4gICAgICogQGRlZmF1bHQgMFxuICAgICAqL1xuICAgIGVuZFNwaW5WYXI6IDAsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNvdXJjZSBwb3NpdGlvbiBvZiB0aGUgZW1pdHRlci5cbiAgICAgKiAhI3poIOWPkeWwhOWZqOS9jee9ruOAglxuICAgICAqIEBwcm9wZXJ0eSB7VmVjMn0gc291cmNlUG9zXG4gICAgICogQGRlZmF1bHQgY2MuVmVjMi5aRVJPXG4gICAgICovXG4gICAgc291cmNlUG9zOiBjYy5WZWMyLlpFUk8sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFZhcmlhdGlvbiBvZiBzb3VyY2UgcG9zaXRpb24uXG4gICAgICogISN6aCDlj5HlsITlmajkvY3nva7nmoTlj5jljJbojIPlm7TjgILvvIjmqKrlkJHlkoznurXlkJHvvIlcbiAgICAgKiBAcHJvcGVydHkge1ZlYzJ9IHBvc1ZhclxuICAgICAqIEBkZWZhdWx0IGNjLlZlYzIuWkVST1xuICAgICAqL1xuICAgIHBvc1ZhcjogY2MuVmVjMi5aRVJPLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXJ0aWNsZXMgbW92ZW1lbnQgdHlwZS5cbiAgICAgKiAhI3poIOeykuWtkOS9jee9ruexu+Wei+OAglxuICAgICAqIEBwcm9wZXJ0eSB7UGFydGljbGVTeXN0ZW0uUG9zaXRpb25UeXBlfSBwb3NpdGlvblR5cGVcbiAgICAgKiBAZGVmYXVsdCBQYXJ0aWNsZVN5c3RlbS5Qb3NpdGlvblR5cGUuRlJFRVxuICAgICAqL1xuICAgIF9wb3NpdGlvblR5cGU6IHtcbiAgICAgICAgZGVmYXVsdDogUG9zaXRpb25UeXBlLkZSRUUsXG4gICAgICAgIGZvcm1lcmx5U2VyaWFsaXplZEFzOiBcInBvc2l0aW9uVHlwZVwiXG4gICAgfSxcblxuICAgIHBvc2l0aW9uVHlwZToge1xuICAgICAgICB0eXBlOiBQb3NpdGlvblR5cGUsXG4gICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcG9zaXRpb25UeXBlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgKHZhbCkge1xuICAgICAgICAgICAgdGhpcy5fcG9zaXRpb25UeXBlID0gdmFsO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlTWF0ZXJpYWwoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBhcnRpY2xlcyBlbWl0dGVyIG1vZGVzLlxuICAgICAqICEjemgg5Y+R5bCE5Zmo57G75Z6L44CCXG4gICAgICogQHByb3BlcnR5IHtQYXJ0aWNsZVN5c3RlbS5FbWl0dGVyTW9kZX0gZW1pdHRlck1vZGVcbiAgICAgKiBAZGVmYXVsdCBQYXJ0aWNsZVN5c3RlbS5FbWl0dGVyTW9kZS5HUkFWSVRZXG4gICAgICovXG4gICAgZW1pdHRlck1vZGU6IHtcbiAgICAgICAgZGVmYXVsdDogRW1pdHRlck1vZGUuR1JBVklUWSxcbiAgICAgICAgdHlwZTogRW1pdHRlck1vZGVcbiAgICB9LFxuXG4gICAgLy8gR1JBVklUWSBNT0RFXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdyYXZpdHkgb2YgdGhlIGVtaXR0ZXIuXG4gICAgICogISN6aCDph43lipvjgIJcbiAgICAgKiBAcHJvcGVydHkge1ZlYzJ9IGdyYXZpdHlcbiAgICAgKiBAZGVmYXVsdCBjYy5WZWMyLlpFUk9cbiAgICAgKi9cbiAgICBncmF2aXR5OiBjYy5WZWMyLlpFUk8sXG4gICAgLyoqXG4gICAgICogISNlbiBTcGVlZCBvZiB0aGUgZW1pdHRlci5cbiAgICAgKiAhI3poIOmAn+W6puOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBzcGVlZFxuICAgICAqIEBkZWZhdWx0IDE4MFxuICAgICAqL1xuICAgIHNwZWVkOiAxODAsXG4gICAgLyoqXG4gICAgICogISNlbiBWYXJpYXRpb24gb2YgdGhlIHNwZWVkLlxuICAgICAqICEjemgg6YCf5bqm5Y+Y5YyW6IyD5Zu044CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHNwZWVkVmFyXG4gICAgICogQGRlZmF1bHQgNTBcbiAgICAgKi9cbiAgICBzcGVlZFZhcjogNTAsXG4gICAgLyoqXG4gICAgICogISNlbiBUYW5nZW50aWFsIGFjY2VsZXJhdGlvbiBvZiBlYWNoIHBhcnRpY2xlLiBPbmx5IGF2YWlsYWJsZSBpbiAnR3Jhdml0eScgbW9kZS5cbiAgICAgKiAhI3poIOavj+S4queykuWtkOeahOWIh+WQkeWKoOmAn+W6pu+8jOWNs+WeguebtOS6jumHjeWKm+aWueWQkeeahOWKoOmAn+W6pu+8jOWPquacieWcqOmHjeWKm+aooeW8j+S4i+WPr+eUqOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB0YW5nZW50aWFsQWNjZWxcbiAgICAgKiBAZGVmYXVsdCA4MFxuICAgICAqL1xuICAgIHRhbmdlbnRpYWxBY2NlbDogODAsXG4gICAgLyoqXG4gICAgICogISNlbiBWYXJpYXRpb24gb2YgdGhlIHRhbmdlbnRpYWwgYWNjZWxlcmF0aW9uLlxuICAgICAqICEjemgg5q+P5Liq57KS5a2Q55qE5YiH5ZCR5Yqg6YCf5bqm5Y+Y5YyW6IyD5Zu044CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHRhbmdlbnRpYWxBY2NlbFZhclxuICAgICAqIEBkZWZhdWx0IDBcbiAgICAgKi9cbiAgICB0YW5nZW50aWFsQWNjZWxWYXI6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBBY2NlbGVyYXRpb24gb2YgZWFjaCBwYXJ0aWNsZS4gT25seSBhdmFpbGFibGUgaW4gJ0dyYXZpdHknIG1vZGUuXG4gICAgICogISN6aCDnspLlrZDlvoTlkJHliqDpgJ/luqbvvIzljbPlubPooYzkuo7ph43lipvmlrnlkJHnmoTliqDpgJ/luqbvvIzlj6rmnInlnKjph43lipvmqKHlvI/kuIvlj6/nlKjjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gcmFkaWFsQWNjZWxcbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgcmFkaWFsQWNjZWw6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBWYXJpYXRpb24gb2YgdGhlIHJhZGlhbCBhY2NlbGVyYXRpb24uXG4gICAgICogISN6aCDnspLlrZDlvoTlkJHliqDpgJ/luqblj5jljJbojIPlm7TjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gcmFkaWFsQWNjZWxWYXJcbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgcmFkaWFsQWNjZWxWYXI6IDAsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEluZGljYXRlIHdoZXRoZXIgdGhlIHJvdGF0aW9uIG9mIGVhY2ggcGFydGljbGUgZXF1YWxzIHRvIGl0cyBkaXJlY3Rpb24uIE9ubHkgYXZhaWxhYmxlIGluICdHcmF2aXR5JyBtb2RlLlxuICAgICAqICEjemgg5q+P5Liq57KS5a2Q55qE5peL6L2s5piv5ZCm562J5LqO5YW25pa55ZCR77yM5Y+q5pyJ5Zyo6YeN5Yqb5qih5byP5LiL5Y+v55So44CCXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSByb3RhdGlvbklzRGlyXG4gICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgKi9cbiAgICByb3RhdGlvbklzRGlyOiBmYWxzZSxcblxuICAgIC8vIFJBRElVUyBNT0RFXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFN0YXJ0aW5nIHJhZGl1cyBvZiB0aGUgcGFydGljbGVzLiBPbmx5IGF2YWlsYWJsZSBpbiAnUmFkaXVzJyBtb2RlLlxuICAgICAqICEjemgg5Yid5aeL5Y2K5b6E77yM6KGo56S657KS5a2Q5Ye655Sf5pe255u45a+55Y+R5bCE5Zmo55qE6Led56a777yM5Y+q5pyJ5Zyo5Y2K5b6E5qih5byP5LiL5Y+v55So44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHN0YXJ0UmFkaXVzXG4gICAgICogQGRlZmF1bHQgMFxuICAgICAqL1xuICAgIHN0YXJ0UmFkaXVzOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gVmFyaWF0aW9uIG9mIHRoZSBzdGFydGluZyByYWRpdXMuXG4gICAgICogISN6aCDliJ3lp4vljYrlvoTlj5jljJbojIPlm7TjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gc3RhcnRSYWRpdXNWYXJcbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgc3RhcnRSYWRpdXNWYXI6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBFbmRpbmcgcmFkaXVzIG9mIHRoZSBwYXJ0aWNsZXMuIE9ubHkgYXZhaWxhYmxlIGluICdSYWRpdXMnIG1vZGUuXG4gICAgICogISN6aCDnu5PmnZ/ljYrlvoTvvIzlj6rmnInlnKjljYrlvoTmqKHlvI/kuIvlj6/nlKjjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZW5kUmFkaXVzXG4gICAgICogQGRlZmF1bHQgMFxuICAgICAqL1xuICAgIGVuZFJhZGl1czogMCxcbiAgICAvKipcbiAgICAgKiAhI2VuIFZhcmlhdGlvbiBvZiB0aGUgZW5kaW5nIHJhZGl1cy5cbiAgICAgKiAhI3poIOe7k+adn+WNiuW+hOWPmOWMluiMg+WbtOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBlbmRSYWRpdXNWYXJcbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgZW5kUmFkaXVzVmFyOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gTnVtYmVyIG9mIGRlZ3Jlc3MgdG8gcm90YXRlIGEgcGFydGljbGUgYXJvdW5kIHRoZSBzb3VyY2UgcG9zIHBlciBzZWNvbmQuIE9ubHkgYXZhaWxhYmxlIGluICdSYWRpdXMnIG1vZGUuXG4gICAgICogISN6aCDnspLlrZDmr4/np5Llm7Tnu5Xotbflp4vngrnnmoTml4vovazop5LluqbvvIzlj6rmnInlnKjljYrlvoTmqKHlvI/kuIvlj6/nlKjjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gcm90YXRlUGVyU1xuICAgICAqIEBkZWZhdWx0IDBcbiAgICAgKi9cbiAgICByb3RhdGVQZXJTOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gVmFyaWF0aW9uIG9mIHRoZSBkZWdyZXNzIHRvIHJvdGF0ZSBhIHBhcnRpY2xlIGFyb3VuZCB0aGUgc291cmNlIHBvcyBwZXIgc2Vjb25kLlxuICAgICAqICEjemgg57KS5a2Q5q+P56eS5Zu057uV6LW35aeL54K555qE5peL6L2s6KeS5bqm5Y+Y5YyW6IyD5Zu044CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHJvdGF0ZVBlclNWYXJcbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgcm90YXRlUGVyU1ZhcjogMFxuXG59O1xuXG4vKipcbiAqIFBhcnRpY2xlIFN5c3RlbSBiYXNlIGNsYXNzLiA8YnIvPlxuICogQXR0cmlidXRlcyBvZiBhIFBhcnRpY2xlIFN5c3RlbTo8YnIvPlxuICogIC0gZW1taXNpb24gcmF0ZSBvZiB0aGUgcGFydGljbGVzPGJyLz5cbiAqICAtIEdyYXZpdHkgTW9kZSAoTW9kZSBBKTogPGJyLz5cbiAqICAtIGdyYXZpdHkgPGJyLz5cbiAqICAtIGRpcmVjdGlvbiA8YnIvPlxuICogIC0gc3BlZWQgKy0gIHZhcmlhbmNlIDxici8+XG4gKiAgLSB0YW5nZW50aWFsIGFjY2VsZXJhdGlvbiArLSB2YXJpYW5jZTxici8+XG4gKiAgLSByYWRpYWwgYWNjZWxlcmF0aW9uICstIHZhcmlhbmNlPGJyLz5cbiAqICAtIFJhZGl1cyBNb2RlIChNb2RlIEIpOiAgICAgIDxici8+XG4gKiAgLSBzdGFydFJhZGl1cyArLSB2YXJpYW5jZSAgICA8YnIvPlxuICogIC0gZW5kUmFkaXVzICstIHZhcmlhbmNlICAgICAgPGJyLz5cbiAqICAtIHJvdGF0ZSArLSB2YXJpYW5jZSAgICAgICAgIDxici8+XG4gKiAgLSBQcm9wZXJ0aWVzIGNvbW1vbiB0byBhbGwgbW9kZXM6IDxici8+XG4gKiAgLSBsaWZlICstIGxpZmUgdmFyaWFuY2UgICAgICA8YnIvPlxuICogIC0gc3RhcnQgc3BpbiArLSB2YXJpYW5jZSAgICAgPGJyLz5cbiAqICAtIGVuZCBzcGluICstIHZhcmlhbmNlICAgICAgIDxici8+XG4gKiAgLSBzdGFydCBzaXplICstIHZhcmlhbmNlICAgICA8YnIvPlxuICogIC0gZW5kIHNpemUgKy0gdmFyaWFuY2UgICAgICAgPGJyLz5cbiAqICAtIHN0YXJ0IGNvbG9yICstIHZhcmlhbmNlICAgIDxici8+XG4gKiAgLSBlbmQgY29sb3IgKy0gdmFyaWFuY2UgICAgICA8YnIvPlxuICogIC0gbGlmZSArLSB2YXJpYW5jZSAgICAgICAgICAgPGJyLz5cbiAqICAtIGJsZW5kaW5nIGZ1bmN0aW9uICAgICAgICAgIDxici8+XG4gKiAgLSB0ZXh0dXJlICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICogPGJyLz5cbiAqIGNvY29zMmQgYWxzbyBzdXBwb3J0cyBwYXJ0aWNsZXMgZ2VuZXJhdGVkIGJ5IFBhcnRpY2xlIERlc2lnbmVyIChodHRwOi8vcGFydGljbGVkZXNpZ25lci43MXNxdWFyZWQuY29tLykuPGJyLz5cbiAqICdSYWRpdXMgTW9kZScgaW4gUGFydGljbGUgRGVzaWduZXIgdXNlcyBhIGZpeGVkIGVtaXQgcmF0ZSBvZiAzMCBoei4gU2luY2UgdGhhdCBjYW4ndCBiZSBndWFyYXRlZWQgaW4gY29jb3MyZCwgIDxici8+XG4gKiBjb2NvczJkIHVzZXMgYSBhbm90aGVyIGFwcHJvYWNoLCBidXQgdGhlIHJlc3VsdHMgYXJlIGFsbW9zdCBpZGVudGljYWwuPGJyLz5cbiAqIGNvY29zMmQgc3VwcG9ydHMgYWxsIHRoZSB2YXJpYWJsZXMgdXNlZCBieSBQYXJ0aWNsZSBEZXNpZ25lciBwbHVzIGEgYml0IG1vcmU6ICA8YnIvPlxuICogIC0gc3Bpbm5pbmcgcGFydGljbGVzIChzdXBwb3J0ZWQgd2hlbiB1c2luZyBQYXJ0aWNsZVN5c3RlbSkgICAgICAgPGJyLz5cbiAqICAtIHRhbmdlbnRpYWwgYWNjZWxlcmF0aW9uIChHcmF2aXR5IG1vZGUpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gKiAgLSByYWRpYWwgYWNjZWxlcmF0aW9uIChHcmF2aXR5IG1vZGUpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICogIC0gcmFkaXVzIGRpcmVjdGlvbiAoUmFkaXVzIG1vZGUpIChQYXJ0aWNsZSBEZXNpZ25lciBzdXBwb3J0cyBvdXR3YXJkcyB0byBpbndhcmRzIGRpcmVjdGlvbiBvbmx5KSA8YnIvPlxuICogSXQgaXMgcG9zc2libGUgdG8gY3VzdG9taXplIGFueSBvZiB0aGUgYWJvdmUgbWVudGlvbmVkIHByb3BlcnRpZXMgaW4gcnVudGltZS4gRXhhbXBsZTogICA8YnIvPlxuICpcbiAqIEBleGFtcGxlXG4gKiBlbWl0dGVyLnJhZGlhbEFjY2VsID0gMTU7XG4gKiBlbWl0dGVyLnN0YXJ0U3BpbiA9IDA7XG4gKlxuICogQGNsYXNzIFBhcnRpY2xlU3lzdGVtXG4gKiBAZXh0ZW5kcyBSZW5kZXJDb21wb25lbnRcbiAqIEB1c2VzIEJsZW5kRnVuY1xuICovXG52YXIgUGFydGljbGVTeXN0ZW0gPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlBhcnRpY2xlU3lzdGVtJyxcbiAgICBleHRlbmRzOiBSZW5kZXJDb21wb25lbnQsXG4gICAgbWl4aW5zOiBbQmxlbmRGdW5jXSxcbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQucmVuZGVyZXJzL1BhcnRpY2xlU3lzdGVtJyxcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9wYXJ0aWNsZS1zeXN0ZW0uanMnLFxuICAgICAgICBwbGF5T25Gb2N1czogdHJ1ZSxcbiAgICAgICAgZXhlY3V0ZUluRWRpdE1vZGU6IHRydWVcbiAgICB9LFxuXG4gICAgY3RvciAoKSB7XG4gICAgICAgIHRoaXMuaW5pdFByb3BlcnRpZXMoKTtcbiAgICB9LFxuXG4gICAgaW5pdFByb3BlcnRpZXMgKCkge1xuICAgICAgICB0aGlzLl9wcmV2aWV3VGltZXIgPSBudWxsO1xuICAgICAgICB0aGlzLl9mb2N1c2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2FzcGVjdFJhdGlvID0gMTtcblxuICAgICAgICB0aGlzLl9zaW11bGF0b3IgPSBuZXcgUGFydGljbGVTaW11bGF0b3IodGhpcyk7XG5cbiAgICAgICAgLy8gY29sb3JzXG4gICAgICAgIHRoaXMuX3N0YXJ0Q29sb3IgPSBjYy5jb2xvcigyNTUsIDI1NSwgMjU1LCAyNTUpO1xuICAgICAgICB0aGlzLl9zdGFydENvbG9yVmFyID0gY2MuY29sb3IoMCwgMCwgMCwgMCk7XG4gICAgICAgIHRoaXMuX2VuZENvbG9yID0gY2MuY29sb3IoMjU1LCAyNTUsIDI1NSwgMCk7XG4gICAgICAgIHRoaXMuX2VuZENvbG9yVmFyID0gY2MuY29sb3IoMCwgMCwgMCwgMCk7XG5cbiAgICAgICAgLy8gVGhlIHRlbXBvcmFyeSBTcHJpdGVGcmFtZSBvYmplY3QgdXNlZCBmb3IgdGhlIHJlbmRlcmVyLiBCZWNhdXNlIHRoZXJlIGlzIG5vIGNvcnJlc3BvbmRpbmcgYXNzZXQsIGl0IGNhbid0IGJlIHNlcmlhbGl6ZWQuXG4gICAgICAgIHRoaXMuX3JlbmRlclNwcml0ZUZyYW1lID0gbnVsbDtcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczogcHJvcGVydGllcyxcblxuICAgIHN0YXRpY3M6IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgUGFydGljbGUgZW1pdHRlciBsaXZlcyBmb3JldmVyLlxuICAgICAgICAgKiAhI3poIOihqOekuuWPkeWwhOWZqOawuOS5heWtmOWcqFxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gRFVSQVRJT05fSU5GSU5JVFlcbiAgICAgICAgICogQGRlZmF1bHQgLTFcbiAgICAgICAgICogQHN0YXRpY1xuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgIERVUkFUSU9OX0lORklOSVRZOiAtMSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgc3RhcnRpbmcgc2l6ZSBvZiB0aGUgcGFydGljbGUgaXMgZXF1YWwgdG8gdGhlIGVuZGluZyBzaXplLlxuICAgICAgICAgKiAhI3poIOihqOekuueykuWtkOeahOi1t+Wni+Wkp+Wwj+etieS6jue7k+adn+Wkp+Wwj+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU1RBUlRfU0laRV9FUVVBTF9UT19FTkRfU0laRVxuICAgICAgICAgKiBAZGVmYXVsdCAtMVxuICAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgU1RBUlRfU0laRV9FUVVBTF9UT19FTkRfU0laRTogLTEsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHN0YXJ0aW5nIHJhZGl1cyBvZiB0aGUgcGFydGljbGUgaXMgZXF1YWwgdG8gdGhlIGVuZGluZyByYWRpdXMuXG4gICAgICAgICAqICEjemgg6KGo56S657KS5a2Q55qE6LW35aeL5Y2K5b6E562J5LqO57uT5p2f5Y2K5b6E44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTVEFSVF9SQURJVVNfRVFVQUxfVE9fRU5EX1JBRElVU1xuICAgICAgICAgKiBAZGVmYXVsdCAtMVxuICAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgU1RBUlRfUkFESVVTX0VRVUFMX1RPX0VORF9SQURJVVM6IC0xLFxuXG4gICAgICAgIEVtaXR0ZXJNb2RlOiBFbWl0dGVyTW9kZSxcbiAgICAgICAgUG9zaXRpb25UeXBlOiBQb3NpdGlvblR5cGUsXG5cblxuICAgICAgICBfUE5HUmVhZGVyOiBQTkdSZWFkZXIsXG4gICAgICAgIF9USUZGUmVhZGVyOiB0aWZmUmVhZGVyLFxuICAgIH0sXG5cbiAgICAvLyBFRElUT1IgUkVMQVRFRCBNRVRIT0RTXG5cbiAgICBvbkZvY3VzSW5FZGl0b3I6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2ZvY3VzZWQgPSB0cnVlO1xuICAgICAgICBsZXQgY29tcG9uZW50cyA9IGdldFBhcnRpY2xlQ29tcG9uZW50cyh0aGlzLm5vZGUpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbXBvbmVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudHNbaV0uX3N0YXJ0UHJldmlldygpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uTG9zdEZvY3VzSW5FZGl0b3I6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2ZvY3VzZWQgPSBmYWxzZTtcbiAgICAgICAgbGV0IGNvbXBvbmVudHMgPSBnZXRQYXJ0aWNsZUNvbXBvbmVudHModGhpcy5ub2RlKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb21wb25lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBjb21wb25lbnRzW2ldLl9zdG9wUHJldmlldygpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9zdGFydFByZXZpZXc6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnByZXZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRTeXN0ZW0oKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfc3RvcFByZXZpZXc6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnByZXZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRTeXN0ZW0oKTtcbiAgICAgICAgICAgIHRoaXMuc3RvcFN5c3RlbSgpO1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlUmVuZGVyKCk7XG4gICAgICAgICAgICBjYy5lbmdpbmUucmVwYWludEluRWRpdE1vZGUoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fcHJldmlld1RpbWVyKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuX3ByZXZpZXdUaW1lcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gTElGRS1DWUNMRSBNRVRIT0RTXG5cbiAgICAvLyBqdXN0IHVzZWQgdG8gcmVhZCBkYXRhIGZyb20gMS54XG4gICAgX2NvbnZlcnRUZXh0dXJlVG9TcHJpdGVGcmFtZTogQ0NfRURJVE9SICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3Nwcml0ZUZyYW1lKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHRleHR1cmUgPSB0aGlzLnRleHR1cmU7XG4gICAgICAgIGlmICghdGV4dHVyZSB8fCAhdGV4dHVyZS5fdXVpZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcbiAgICAgICAgRWRpdG9yLmFzc2V0ZGIucXVlcnlNZXRhSW5mb0J5VXVpZCh0ZXh0dXJlLl91dWlkLCBmdW5jdGlvbiAoZXJyLCBtZXRhSW5mbykge1xuICAgICAgICAgICAgaWYgKGVycikgcmV0dXJuIEVkaXRvci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgbGV0IG1ldGEgPSBKU09OLnBhcnNlKG1ldGFJbmZvLmpzb24pO1xuICAgICAgICAgICAgaWYgKG1ldGEudHlwZSA9PT0gJ3JhdycpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBOb2RlVXRpbHMgPSBFZGl0b3IucmVxdWlyZSgnYXBwOi8vZWRpdG9yL3BhZ2Uvc2NlbmUtdXRpbHMvdXRpbHMvbm9kZScpO1xuICAgICAgICAgICAgICAgIGxldCBub2RlUGF0aCA9IE5vZGVVdGlscy5nZXROb2RlUGF0aChfdGhpcy5ub2RlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gRWRpdG9yLndhcm4oYFRoZSB0ZXh0dXJlICR7bWV0YUluZm8uYXNzZXRVcmx9IHVzZWQgYnkgcGFydGljbGUgJHtub2RlUGF0aH0gZG9lcyBub3QgY29udGFpbiBhbnkgU3ByaXRlRnJhbWUsIHBsZWFzZSBzZXQgdGhlIHRleHR1cmUgdHlwZSB0byBTcHJpdGUgYW5kIHJlYXNzaWduIHRoZSBTcHJpdGVGcmFtZSB0byB0aGUgcGFydGljbGUgY29tcG9uZW50LmApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IFVybCA9IHJlcXVpcmUoJ2ZpcmUtdXJsJyk7XG4gICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBVcmwuYmFzZW5hbWVOb0V4dChtZXRhSW5mby5hc3NldFBhdGgpO1xuICAgICAgICAgICAgICAgIGxldCB1dWlkID0gbWV0YS5zdWJNZXRhc1tuYW1lXS51dWlkO1xuICAgICAgICAgICAgICAgIGNjLmFzc2V0TWFuYWdlci5sb2FkQW55KHV1aWQsIGZ1bmN0aW9uIChlcnIsIHNwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHJldHVybiBFZGl0b3IuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuc3ByaXRlRnJhbWUgPSBzcDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIF9fcHJlbG9hZCAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG5cbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgdGhpcy5fY29udmVydFRleHR1cmVUb1Nwcml0ZUZyYW1lKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fY3VzdG9tICYmIHRoaXMuc3ByaXRlRnJhbWUgJiYgIXRoaXMuX3JlbmRlclNwcml0ZUZyYW1lKSB7XG4gICAgICAgICAgICB0aGlzLl9hcHBseVNwcml0ZUZyYW1lKHRoaXMuc3ByaXRlRnJhbWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX2ZpbGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXN0b20pIHtcbiAgICAgICAgICAgICAgICBsZXQgbWlzc0N1c3RvbVRleHR1cmUgPSAhdGhpcy5fZ2V0VGV4dHVyZSgpO1xuICAgICAgICAgICAgICAgIGlmIChtaXNzQ3VzdG9tVGV4dHVyZSkgeyBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXBwbHlGaWxlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXBwbHlGaWxlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gYXV0byBwbGF5XG4gICAgICAgIGlmICghQ0NfRURJVE9SIHx8IGNjLmVuZ2luZS5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXlPbkxvYWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0U3lzdGVtKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gVXBncmFkZSBjb2xvciB0eXBlIGZyb20gdjIuMC4wXG4gICAgICAgIGlmIChDQ19FRElUT1IgJiYgISh0aGlzLl9zdGFydENvbG9yIGluc3RhbmNlb2YgY2MuQ29sb3IpKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGFydENvbG9yID0gY2MuY29sb3IodGhpcy5fc3RhcnRDb2xvcik7XG4gICAgICAgICAgICB0aGlzLl9zdGFydENvbG9yVmFyID0gY2MuY29sb3IodGhpcy5fc3RhcnRDb2xvclZhcik7XG4gICAgICAgICAgICB0aGlzLl9lbmRDb2xvciA9IGNjLmNvbG9yKHRoaXMuX2VuZENvbG9yKTtcbiAgICAgICAgICAgIHRoaXMuX2VuZENvbG9yVmFyID0gY2MuY29sb3IodGhpcy5fZW5kQ29sb3JWYXIpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRGVzdHJveSAoKSB7XG4gICAgICAgIGlmICh0aGlzLmF1dG9SZW1vdmVPbkZpbmlzaCkge1xuICAgICAgICAgICAgdGhpcy5hdXRvUmVtb3ZlT25GaW5pc2ggPSBmYWxzZTsgICAgLy8gYWxyZWFkeSByZW1vdmVkXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2J1ZmZlcikge1xuICAgICAgICAgICAgdGhpcy5fYnVmZmVyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuX2J1ZmZlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVzZXQgdXYgZGF0YSBzbyBuZXh0IHRpbWUgc2ltdWxhdG9yIHdpbGwgcmVmaWxsIGJ1ZmZlciB1diBpbmZvIHdoZW4gZXhpdCBlZGl0IG1vZGUgZnJvbSBwcmVmYWIuXG4gICAgICAgIHRoaXMuX3NpbXVsYXRvci5fdXZGaWxsZWQgPSAwO1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG4gICAgXG4gICAgbGF0ZVVwZGF0ZSAoZHQpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zaW11bGF0b3IuZmluaXNoZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3NpbXVsYXRvci5zdGVwKGR0KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBBUElTXG5cbiAgICAvKlxuICAgICAqICEjZW4gQWRkIGEgcGFydGljbGUgdG8gdGhlIGVtaXR0ZXIuXG4gICAgICogISN6aCDmt7vliqDkuIDkuKrnspLlrZDliLDlj5HlsITlmajkuK3jgIJcbiAgICAgKiBAbWV0aG9kIGFkZFBhcnRpY2xlXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBhZGRQYXJ0aWNsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBOb3QgaW1wbGVtZW50ZWRcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTdG9wIGVtaXR0aW5nIHBhcnRpY2xlcy4gUnVubmluZyBwYXJ0aWNsZXMgd2lsbCBjb250aW51ZSB0byBydW4gdW50aWwgdGhleSBkaWUuXG4gICAgICogISN6aCDlgZzmraLlj5HlsITlmajlj5HlsITnspLlrZDvvIzlj5HlsITlh7rljrvnmoTnspLlrZDlsIbnu6fnu63ov5DooYzvvIznm7Toh7PnspLlrZDnlJ/lkb3nu5PmnZ/jgIJcbiAgICAgKiBAbWV0aG9kIHN0b3BTeXN0ZW1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vIHN0b3AgcGFydGljbGUgc3lzdGVtLlxuICAgICAqIG15UGFydGljbGVTeXN0ZW0uc3RvcFN5c3RlbSgpO1xuICAgICAqL1xuICAgIHN0b3BTeXN0ZW06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fc3RvcHBlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX3NpbXVsYXRvci5zdG9wKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gS2lsbCBhbGwgbGl2aW5nIHBhcnRpY2xlcy5cbiAgICAgKiAhI3poIOadgOatu+aJgOacieWtmOWcqOeahOeykuWtkO+8jOeEtuWQjumHjeaWsOWQr+WKqOeykuWtkOWPkeWwhOWZqOOAglxuICAgICAqIEBtZXRob2QgcmVzZXRTeXN0ZW1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vIHBsYXkgcGFydGljbGUgc3lzdGVtLlxuICAgICAqIG15UGFydGljbGVTeXN0ZW0ucmVzZXRTeXN0ZW0oKTtcbiAgICAgKi9cbiAgICByZXNldFN5c3RlbTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9zdG9wcGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3NpbXVsYXRvci5yZXNldCgpO1xuICAgICAgICB0aGlzLm1hcmtGb3JSZW5kZXIodHJ1ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gV2hldGhlciBvciBub3QgdGhlIHN5c3RlbSBpcyBmdWxsLlxuICAgICAqICEjemgg5Y+R5bCE5Zmo5Lit57KS5a2Q5piv5ZCm5aSn5LqO562J5LqO6K6+572u55qE5oC757KS5a2Q5pWw6YeP44CCXG4gICAgICogQG1ldGhvZCBpc0Z1bGxcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGlzRnVsbDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMucGFydGljbGVDb3VudCA+PSB0aGlzLnRvdGFsUGFydGljbGVzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXRzIGEgbmV3IHRleHR1cmUgd2l0aCBhIHJlY3QuIFRoZSByZWN0IGlzIGluIHRleHR1cmUgcG9zaXRpb24gYW5kIHNpemUuXG4gICAgICogUGxlYXNlIHVzZSBzcHJpdGVGcmFtZSBwcm9wZXJ0eSBpbnN0ZWFkLCB0aGlzIGZ1bmN0aW9uIGlzIGRlcHJlY2F0ZWQgc2luY2UgdjEuOVxuICAgICAqICEjemgg6K6+572u5LiA5byg5paw6LS05Zu+5ZKM5YWz6IGU55qE55+p5b2i44CCXG4gICAgICog6K+355u05o6l6K6+572uIHNwcml0ZUZyYW1lIOWxnuaAp++8jOi/meS4quWHveaVsOS7jiB2MS45IOeJiOacrOW8gOWni+W3sue7j+iiq+W6n+W8g1xuICAgICAqIEBtZXRob2Qgc2V0VGV4dHVyZVdpdGhSZWN0XG4gICAgICogQHBhcmFtIHtUZXh0dXJlMkR9IHRleHR1cmVcbiAgICAgKiBAcGFyYW0ge1JlY3R9IHJlY3RcbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2MS45XG4gICAgICovXG4gICAgc2V0VGV4dHVyZVdpdGhSZWN0OiBmdW5jdGlvbiAodGV4dHVyZSwgcmVjdCkge1xuICAgICAgICBpZiAodGV4dHVyZSBpbnN0YW5jZW9mIGNjLlRleHR1cmUyRCkge1xuICAgICAgICAgICAgdGhpcy5zcHJpdGVGcmFtZSA9IG5ldyBjYy5TcHJpdGVGcmFtZSh0ZXh0dXJlLCByZWN0KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBQUklWQVRFIE1FVEhPRFNcblxuICAgIF9hcHBseUZpbGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IGZpbGUgPSB0aGlzLl9maWxlO1xuICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgY2MuYXNzZXRNYW5hZ2VyLnBvc3RMb2FkTmF0aXZlKGZpbGUsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyIHx8ICFmaWxlLl9uYXRpdmVBc3NldCkge1xuICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDYwMjkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghc2VsZi5pc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzZWxmLl9wbGlzdEZpbGUgPSBmaWxlLm5hdGl2ZVVybDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYuX2N1c3RvbSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXNEaWZmRnJhbWUgPSBzZWxmLl9zcHJpdGVGcmFtZSAhPT0gZmlsZS5zcHJpdGVGcmFtZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzRGlmZkZyYW1lKSBzZWxmLnNwcml0ZUZyYW1lID0gZmlsZS5zcHJpdGVGcmFtZTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5faW5pdFdpdGhEaWN0aW9uYXJ5KGZpbGUuX25hdGl2ZUFzc2V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCFzZWxmLl9zcHJpdGVGcmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsZS5zcHJpdGVGcmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zcHJpdGVGcmFtZSA9IGZpbGUuc3ByaXRlRnJhbWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoc2VsZi5fY3VzdG9tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9pbml0VGV4dHVyZVdpdGhEaWN0aW9uYXJ5KGZpbGUuX25hdGl2ZUFzc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICghc2VsZi5fcmVuZGVyU3ByaXRlRnJhbWUgJiYgc2VsZi5fc3ByaXRlRnJhbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fYXBwbHlTcHJpdGVGcmFtZShzZWxmLnNwcml0ZUZyYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfaW5pdFRleHR1cmVXaXRoRGljdGlvbmFyeTogZnVuY3Rpb24gKGRpY3QpIHtcbiAgICAgICAgbGV0IGltZ1BhdGggPSBjYy5wYXRoLmNoYW5nZUJhc2VuYW1lKHRoaXMuX3BsaXN0RmlsZSwgZGljdFtcInRleHR1cmVGaWxlTmFtZVwiXSB8fCAnJyk7XG4gICAgICAgIC8vIHRleHR1cmVcbiAgICAgICAgaWYgKGRpY3RbXCJ0ZXh0dXJlRmlsZU5hbWVcIl0pIHtcbiAgICAgICAgICAgIC8vIFRyeSB0byBnZXQgdGhlIHRleHR1cmUgZnJvbSB0aGUgY2FjaGVcbiAgICAgICAgICAgIHRleHR1cmVVdGlsLmxvYWRJbWFnZShpbWdQYXRoLCBmdW5jdGlvbiAoZXJyb3IsIHRleHR1cmUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZGljdFtcInRleHR1cmVGaWxlTmFtZVwiXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5pdFRleHR1cmVXaXRoRGljdGlvbmFyeShkaWN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmFzc2V0TWFuYWdlci5hc3NldHMuYWRkKGltZ1BhdGgsIHRleHR1cmUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZUZyYW1lID0gbmV3IGNjLlNwcml0ZUZyYW1lKHRleHR1cmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9IGVsc2UgaWYgKGRpY3RbXCJ0ZXh0dXJlSW1hZ2VEYXRhXCJdKSB7XG4gICAgICAgICAgICBsZXQgdGV4dHVyZURhdGEgPSBkaWN0W1widGV4dHVyZUltYWdlRGF0YVwiXTtcblxuICAgICAgICAgICAgaWYgKHRleHR1cmVEYXRhICYmIHRleHR1cmVEYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBsZXQgdGV4ID0gY2MuYXNzZXRNYW5hZ2VyLmFzc2V0cy5nZXQoaW1nUGF0aCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCF0ZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IGNvZGVjLnVuemlwQmFzZTY0QXNBcnJheSh0ZXh0dXJlRGF0YSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghYnVmZmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy53YXJuSUQoNjAzMCwgdGhpcy5fZmlsZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbWFnZUZvcm1hdCA9IGdldEltYWdlRm9ybWF0QnlEYXRhKGJ1ZmZlcik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbWFnZUZvcm1hdCAhPT0gbWFjcm8uSW1hZ2VGb3JtYXQuVElGRiAmJiBpbWFnZUZvcm1hdCAhPT0gbWFjcm8uSW1hZ2VGb3JtYXQuUE5HKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy53YXJuSUQoNjAzMSwgdGhpcy5fZmlsZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldCBjYW52YXNPYmogPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgICAgICAgICAgICAgICBpZihpbWFnZUZvcm1hdCA9PT0gbWFjcm8uSW1hZ2VGb3JtYXQuUE5HKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBteVBuZ09iaiA9IG5ldyBQTkdSZWFkZXIoYnVmZmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG15UG5nT2JqLnJlbmRlcihjYW52YXNPYmopO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlmZlJlYWRlci5wYXJzZVRJRkYoYnVmZmVyLGNhbnZhc09iaik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGV4ID0gdGV4dHVyZVV0aWwuY2FjaGVJbWFnZShpbWdQYXRoLCBjYW52YXNPYmopO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIXRleClcbiAgICAgICAgICAgICAgICAgICAgY2Mud2FybklEKDYwMzIsIHRoaXMuX2ZpbGUubmFtZSk7XG4gICAgICAgICAgICAgICAgLy8gVE9ETzogVXNlIGNjLmFzc2V0TWFuYWdlciB0byBsb2FkIGFzeW5jaHJvbm91c2x5IHRoZSBTcHJpdGVGcmFtZSBvYmplY3QsIGF2b2lkIHVzaW5nIHRleHR1cmVVdGlsXG4gICAgICAgICAgICAgICAgdGhpcy5zcHJpdGVGcmFtZSA9IG5ldyBjYy5TcHJpdGVGcmFtZSh0ZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICAvLyBwYXJzaW5nIHByb2Nlc3NcbiAgICBfaW5pdFdpdGhEaWN0aW9uYXJ5OiBmdW5jdGlvbiAoZGljdCkge1xuICAgICAgICB0aGlzLnRvdGFsUGFydGljbGVzID0gcGFyc2VJbnQoZGljdFtcIm1heFBhcnRpY2xlc1wiXSB8fCAwKTtcblxuICAgICAgICAvLyBsaWZlIHNwYW5cbiAgICAgICAgdGhpcy5saWZlID0gcGFyc2VGbG9hdChkaWN0W1wicGFydGljbGVMaWZlc3BhblwiXSB8fCAwKTtcbiAgICAgICAgdGhpcy5saWZlVmFyID0gcGFyc2VGbG9hdChkaWN0W1wicGFydGljbGVMaWZlc3BhblZhcmlhbmNlXCJdIHx8IDApO1xuXG4gICAgICAgIC8vIGVtaXNzaW9uIFJhdGVcbiAgICAgICAgbGV0IF90ZW1wRW1pc3Npb25SYXRlID0gZGljdFtcImVtaXNzaW9uUmF0ZVwiXTtcbiAgICAgICAgaWYgKF90ZW1wRW1pc3Npb25SYXRlKSB7XG4gICAgICAgICAgICB0aGlzLmVtaXNzaW9uUmF0ZSA9IF90ZW1wRW1pc3Npb25SYXRlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbWlzc2lvblJhdGUgPSBNYXRoLm1pbih0aGlzLnRvdGFsUGFydGljbGVzIC8gdGhpcy5saWZlLCBOdW1iZXIuTUFYX1ZBTFVFKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGR1cmF0aW9uXG4gICAgICAgIHRoaXMuZHVyYXRpb24gPSBwYXJzZUZsb2F0KGRpY3RbXCJkdXJhdGlvblwiXSB8fCAwKTtcblxuICAgICAgICAvLyBibGVuZCBmdW5jdGlvblxuICAgICAgICB0aGlzLnNyY0JsZW5kRmFjdG9yID0gcGFyc2VJbnQoZGljdFtcImJsZW5kRnVuY1NvdXJjZVwiXSB8fCBtYWNyby5TUkNfQUxQSEEpO1xuICAgICAgICB0aGlzLmRzdEJsZW5kRmFjdG9yID0gcGFyc2VJbnQoZGljdFtcImJsZW5kRnVuY0Rlc3RpbmF0aW9uXCJdIHx8IG1hY3JvLk9ORV9NSU5VU19TUkNfQUxQSEEpO1xuXG4gICAgICAgIC8vIGNvbG9yXG4gICAgICAgIGxldCBsb2NTdGFydENvbG9yID0gdGhpcy5fc3RhcnRDb2xvcjtcbiAgICAgICAgbG9jU3RhcnRDb2xvci5yID0gcGFyc2VGbG9hdChkaWN0W1wic3RhcnRDb2xvclJlZFwiXSB8fCAwKSAqIDI1NTtcbiAgICAgICAgbG9jU3RhcnRDb2xvci5nID0gcGFyc2VGbG9hdChkaWN0W1wic3RhcnRDb2xvckdyZWVuXCJdIHx8IDApICogMjU1O1xuICAgICAgICBsb2NTdGFydENvbG9yLmIgPSBwYXJzZUZsb2F0KGRpY3RbXCJzdGFydENvbG9yQmx1ZVwiXSB8fCAwKSAqIDI1NTtcbiAgICAgICAgbG9jU3RhcnRDb2xvci5hID0gcGFyc2VGbG9hdChkaWN0W1wic3RhcnRDb2xvckFscGhhXCJdIHx8IDApICogMjU1O1xuXG4gICAgICAgIGxldCBsb2NTdGFydENvbG9yVmFyID0gdGhpcy5fc3RhcnRDb2xvclZhcjtcbiAgICAgICAgbG9jU3RhcnRDb2xvclZhci5yID0gcGFyc2VGbG9hdChkaWN0W1wic3RhcnRDb2xvclZhcmlhbmNlUmVkXCJdIHx8IDApICogMjU1O1xuICAgICAgICBsb2NTdGFydENvbG9yVmFyLmcgPSBwYXJzZUZsb2F0KGRpY3RbXCJzdGFydENvbG9yVmFyaWFuY2VHcmVlblwiXSB8fCAwKSAqIDI1NTtcbiAgICAgICAgbG9jU3RhcnRDb2xvclZhci5iID0gcGFyc2VGbG9hdChkaWN0W1wic3RhcnRDb2xvclZhcmlhbmNlQmx1ZVwiXSB8fCAwKSAqIDI1NTtcbiAgICAgICAgbG9jU3RhcnRDb2xvclZhci5hID0gcGFyc2VGbG9hdChkaWN0W1wic3RhcnRDb2xvclZhcmlhbmNlQWxwaGFcIl0gfHwgMCkgKiAyNTU7XG5cbiAgICAgICAgbGV0IGxvY0VuZENvbG9yID0gdGhpcy5fZW5kQ29sb3I7XG4gICAgICAgIGxvY0VuZENvbG9yLnIgPSBwYXJzZUZsb2F0KGRpY3RbXCJmaW5pc2hDb2xvclJlZFwiXSB8fCAwKSAqIDI1NTtcbiAgICAgICAgbG9jRW5kQ29sb3IuZyA9IHBhcnNlRmxvYXQoZGljdFtcImZpbmlzaENvbG9yR3JlZW5cIl0gfHwgMCkgKiAyNTU7XG4gICAgICAgIGxvY0VuZENvbG9yLmIgPSBwYXJzZUZsb2F0KGRpY3RbXCJmaW5pc2hDb2xvckJsdWVcIl0gfHwgMCkgKiAyNTU7XG4gICAgICAgIGxvY0VuZENvbG9yLmEgPSBwYXJzZUZsb2F0KGRpY3RbXCJmaW5pc2hDb2xvckFscGhhXCJdIHx8IDApICogMjU1O1xuXG4gICAgICAgIGxldCBsb2NFbmRDb2xvclZhciA9IHRoaXMuX2VuZENvbG9yVmFyO1xuICAgICAgICBsb2NFbmRDb2xvclZhci5yID0gcGFyc2VGbG9hdChkaWN0W1wiZmluaXNoQ29sb3JWYXJpYW5jZVJlZFwiXSB8fCAwKSAqIDI1NTtcbiAgICAgICAgbG9jRW5kQ29sb3JWYXIuZyA9IHBhcnNlRmxvYXQoZGljdFtcImZpbmlzaENvbG9yVmFyaWFuY2VHcmVlblwiXSB8fCAwKSAqIDI1NTtcbiAgICAgICAgbG9jRW5kQ29sb3JWYXIuYiA9IHBhcnNlRmxvYXQoZGljdFtcImZpbmlzaENvbG9yVmFyaWFuY2VCbHVlXCJdIHx8IDApICogMjU1O1xuICAgICAgICBsb2NFbmRDb2xvclZhci5hID0gcGFyc2VGbG9hdChkaWN0W1wiZmluaXNoQ29sb3JWYXJpYW5jZUFscGhhXCJdIHx8IDApICogMjU1O1xuXG4gICAgICAgIC8vIHBhcnRpY2xlIHNpemVcbiAgICAgICAgdGhpcy5zdGFydFNpemUgPSBwYXJzZUZsb2F0KGRpY3RbXCJzdGFydFBhcnRpY2xlU2l6ZVwiXSB8fCAwKTtcbiAgICAgICAgdGhpcy5zdGFydFNpemVWYXIgPSBwYXJzZUZsb2F0KGRpY3RbXCJzdGFydFBhcnRpY2xlU2l6ZVZhcmlhbmNlXCJdIHx8IDApO1xuICAgICAgICB0aGlzLmVuZFNpemUgPSBwYXJzZUZsb2F0KGRpY3RbXCJmaW5pc2hQYXJ0aWNsZVNpemVcIl0gfHwgMCk7XG4gICAgICAgIHRoaXMuZW5kU2l6ZVZhciA9IHBhcnNlRmxvYXQoZGljdFtcImZpbmlzaFBhcnRpY2xlU2l6ZVZhcmlhbmNlXCJdIHx8IDApO1xuXG4gICAgICAgIC8vIHBvc2l0aW9uXG4gICAgICAgIC8vIE1ha2UgZW1wdHkgcG9zaXRpb25UeXBlIHZhbHVlIGFuZCBvbGQgdmVyc2lvbiBjb21wYXRpYmxlXG4gICAgICAgIHRoaXMucG9zaXRpb25UeXBlID0gcGFyc2VGbG9hdChkaWN0Wydwb3NpdGlvblR5cGUnXSAhPT0gdW5kZWZpbmVkID8gZGljdFsncG9zaXRpb25UeXBlJ10gOiBQb3NpdGlvblR5cGUuUkVMQVRJVkUpO1xuICAgICAgICAvLyBmb3JcbiAgICAgICAgdGhpcy5zb3VyY2VQb3MueCA9IDA7XG4gICAgICAgIHRoaXMuc291cmNlUG9zLnkgPSAwO1xuICAgICAgICB0aGlzLnBvc1Zhci54ID0gcGFyc2VGbG9hdChkaWN0W1wic291cmNlUG9zaXRpb25WYXJpYW5jZXhcIl0gfHwgMCk7XG4gICAgICAgIHRoaXMucG9zVmFyLnkgPSBwYXJzZUZsb2F0KGRpY3RbXCJzb3VyY2VQb3NpdGlvblZhcmlhbmNleVwiXSB8fCAwKTtcblxuICAgICAgICAvLyBhbmdsZVxuICAgICAgICB0aGlzLmFuZ2xlID0gcGFyc2VGbG9hdChkaWN0W1wiYW5nbGVcIl0gfHwgMCk7XG4gICAgICAgIHRoaXMuYW5nbGVWYXIgPSBwYXJzZUZsb2F0KGRpY3RbXCJhbmdsZVZhcmlhbmNlXCJdIHx8IDApO1xuXG4gICAgICAgIC8vIFNwaW5uaW5nXG4gICAgICAgIHRoaXMuc3RhcnRTcGluID0gcGFyc2VGbG9hdChkaWN0W1wicm90YXRpb25TdGFydFwiXSB8fCAwKTtcbiAgICAgICAgdGhpcy5zdGFydFNwaW5WYXIgPSBwYXJzZUZsb2F0KGRpY3RbXCJyb3RhdGlvblN0YXJ0VmFyaWFuY2VcIl0gfHwgMCk7XG4gICAgICAgIHRoaXMuZW5kU3BpbiA9IHBhcnNlRmxvYXQoZGljdFtcInJvdGF0aW9uRW5kXCJdIHx8IDApO1xuICAgICAgICB0aGlzLmVuZFNwaW5WYXIgPSBwYXJzZUZsb2F0KGRpY3RbXCJyb3RhdGlvbkVuZFZhcmlhbmNlXCJdIHx8IDApO1xuXG4gICAgICAgIHRoaXMuZW1pdHRlck1vZGUgPSBwYXJzZUludChkaWN0W1wiZW1pdHRlclR5cGVcIl0gfHwgRW1pdHRlck1vZGUuR1JBVklUWSk7XG5cbiAgICAgICAgLy8gTW9kZSBBOiBHcmF2aXR5ICsgdGFuZ2VudGlhbCBhY2NlbCArIHJhZGlhbCBhY2NlbFxuICAgICAgICBpZiAodGhpcy5lbWl0dGVyTW9kZSA9PT0gRW1pdHRlck1vZGUuR1JBVklUWSkge1xuICAgICAgICAgICAgLy8gZ3Jhdml0eVxuICAgICAgICAgICAgdGhpcy5ncmF2aXR5LnggPSBwYXJzZUZsb2F0KGRpY3RbXCJncmF2aXR5eFwiXSB8fCAwKTtcbiAgICAgICAgICAgIHRoaXMuZ3Jhdml0eS55ID0gcGFyc2VGbG9hdChkaWN0W1wiZ3Jhdml0eXlcIl0gfHwgMCk7XG5cbiAgICAgICAgICAgIC8vIHNwZWVkXG4gICAgICAgICAgICB0aGlzLnNwZWVkID0gcGFyc2VGbG9hdChkaWN0W1wic3BlZWRcIl0gfHwgMCk7XG4gICAgICAgICAgICB0aGlzLnNwZWVkVmFyID0gcGFyc2VGbG9hdChkaWN0W1wic3BlZWRWYXJpYW5jZVwiXSB8fCAwKTtcblxuICAgICAgICAgICAgLy8gcmFkaWFsIGFjY2VsZXJhdGlvblxuICAgICAgICAgICAgdGhpcy5yYWRpYWxBY2NlbCA9IHBhcnNlRmxvYXQoZGljdFtcInJhZGlhbEFjY2VsZXJhdGlvblwiXSB8fCAwKTtcbiAgICAgICAgICAgIHRoaXMucmFkaWFsQWNjZWxWYXIgPSBwYXJzZUZsb2F0KGRpY3RbXCJyYWRpYWxBY2NlbFZhcmlhbmNlXCJdIHx8IDApO1xuXG4gICAgICAgICAgICAvLyB0YW5nZW50aWFsIGFjY2VsZXJhdGlvblxuICAgICAgICAgICAgdGhpcy50YW5nZW50aWFsQWNjZWwgPSBwYXJzZUZsb2F0KGRpY3RbXCJ0YW5nZW50aWFsQWNjZWxlcmF0aW9uXCJdIHx8IDApO1xuICAgICAgICAgICAgdGhpcy50YW5nZW50aWFsQWNjZWxWYXIgPSBwYXJzZUZsb2F0KGRpY3RbXCJ0YW5nZW50aWFsQWNjZWxWYXJpYW5jZVwiXSB8fCAwKTtcblxuICAgICAgICAgICAgLy8gcm90YXRpb24gaXMgZGlyXG4gICAgICAgICAgICBsZXQgbG9jUm90YXRpb25Jc0RpciA9IGRpY3RbXCJyb3RhdGlvbklzRGlyXCJdIHx8IFwiXCI7XG4gICAgICAgICAgICBpZiAobG9jUm90YXRpb25Jc0RpciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGxvY1JvdGF0aW9uSXNEaXIgPSBsb2NSb3RhdGlvbklzRGlyLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJvdGF0aW9uSXNEaXIgPSAobG9jUm90YXRpb25Jc0RpciA9PT0gXCJ0cnVlXCIgfHwgbG9jUm90YXRpb25Jc0RpciA9PT0gXCIxXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3RhdGlvbklzRGlyID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5lbWl0dGVyTW9kZSA9PT0gRW1pdHRlck1vZGUuUkFESVVTKSB7XG4gICAgICAgICAgICAvLyBvciBNb2RlIEI6IHJhZGl1cyBtb3ZlbWVudFxuICAgICAgICAgICAgdGhpcy5zdGFydFJhZGl1cyA9IHBhcnNlRmxvYXQoZGljdFtcIm1heFJhZGl1c1wiXSB8fCAwKTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRSYWRpdXNWYXIgPSBwYXJzZUZsb2F0KGRpY3RbXCJtYXhSYWRpdXNWYXJpYW5jZVwiXSB8fCAwKTtcbiAgICAgICAgICAgIHRoaXMuZW5kUmFkaXVzID0gcGFyc2VGbG9hdChkaWN0W1wibWluUmFkaXVzXCJdIHx8IDApO1xuICAgICAgICAgICAgdGhpcy5lbmRSYWRpdXNWYXIgPSBwYXJzZUZsb2F0KGRpY3RbXCJtaW5SYWRpdXNWYXJpYW5jZVwiXSB8fCAwKTtcbiAgICAgICAgICAgIHRoaXMucm90YXRlUGVyUyA9IHBhcnNlRmxvYXQoZGljdFtcInJvdGF0ZVBlclNlY29uZFwiXSB8fCAwKTtcbiAgICAgICAgICAgIHRoaXMucm90YXRlUGVyU1ZhciA9IHBhcnNlRmxvYXQoZGljdFtcInJvdGF0ZVBlclNlY29uZFZhcmlhbmNlXCJdIHx8IDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2Mud2FybklEKDYwMDkpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faW5pdFRleHR1cmVXaXRoRGljdGlvbmFyeShkaWN0KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIF92YWxpZGF0ZVJlbmRlciAoKSB7XG4gICAgICAgIGxldCB0ZXh0dXJlID0gdGhpcy5fZ2V0VGV4dHVyZSgpO1xuICAgICAgICBpZiAoIXRleHR1cmUgfHwgIXRleHR1cmUubG9hZGVkKSB7XG4gICAgICAgICAgICB0aGlzLmRpc2FibGVSZW5kZXIoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG5cbiAgICBfb25UZXh0dXJlTG9hZGVkICgpIHtcbiAgICAgICAgdGhpcy5fc2ltdWxhdG9yLnVwZGF0ZVVWcyh0cnVlKTtcbiAgICAgICAgdGhpcy5fc3luY0FzcGVjdCgpO1xuICAgICAgICB0aGlzLl91cGRhdGVNYXRlcmlhbCgpO1xuICAgICAgICB0aGlzLm1hcmtGb3JSZW5kZXIodHJ1ZSk7XG4gICAgfSxcblxuICAgIF9zeW5jQXNwZWN0ICgpIHtcbiAgICAgICAgbGV0IGZyYW1lUmVjdCA9IHRoaXMuX3JlbmRlclNwcml0ZUZyYW1lLl9yZWN0O1xuICAgICAgICB0aGlzLl9hc3BlY3RSYXRpbyA9IGZyYW1lUmVjdC53aWR0aCAvIGZyYW1lUmVjdC5oZWlnaHQ7XG4gICAgfSxcblxuICAgIF9hcHBseVNwcml0ZUZyYW1lICgpIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyU3ByaXRlRnJhbWUgPSB0aGlzLl9yZW5kZXJTcHJpdGVGcmFtZSB8fCB0aGlzLl9zcHJpdGVGcmFtZTtcbiAgICAgICAgaWYgKHRoaXMuX3JlbmRlclNwcml0ZUZyYW1lKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcmVuZGVyU3ByaXRlRnJhbWUudGV4dHVyZUxvYWRlZCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25UZXh0dXJlTG9hZGVkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW5kZXJTcHJpdGVGcmFtZS5vblRleHR1cmVMb2FkZWQodGhpcy5fb25UZXh0dXJlTG9hZGVkLCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZ2V0VGV4dHVyZSAoKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5fcmVuZGVyU3ByaXRlRnJhbWUgJiYgdGhpcy5fcmVuZGVyU3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpKSB8fCB0aGlzLl90ZXh0dXJlO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlTWF0ZXJpYWwgKCkge1xuICAgICAgICBsZXQgbWF0ZXJpYWwgPSB0aGlzLmdldE1hdGVyaWFsKDApO1xuICAgICAgICBpZiAoIW1hdGVyaWFsKSByZXR1cm47XG5cbiAgICAgICAgbWF0ZXJpYWwuZGVmaW5lKCdDQ19VU0VfTU9ERUwnLCB0aGlzLl9wb3NpdGlvblR5cGUgIT09IFBvc2l0aW9uVHlwZS5GUkVFKTtcbiAgICAgICAgbWF0ZXJpYWwuc2V0UHJvcGVydHkoJ3RleHR1cmUnLCB0aGlzLl9nZXRUZXh0dXJlKCkpO1xuXG4gICAgICAgIEJsZW5kRnVuYy5wcm90b3R5cGUuX3VwZGF0ZU1hdGVyaWFsLmNhbGwodGhpcyk7XG4gICAgfSxcblxuICAgIF9maW5pc2hlZFNpbXVsYXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldmlldyAmJiB0aGlzLl9mb2N1c2VkICYmICF0aGlzLmFjdGl2ZSAmJiAhY2MuZW5naW5lLmlzUGxheWluZykge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRTeXN0ZW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlc2V0U3lzdGVtKCk7XG4gICAgICAgIHRoaXMuc3RvcFN5c3RlbSgpO1xuICAgICAgICB0aGlzLmRpc2FibGVSZW5kZXIoKTtcbiAgICAgICAgaWYgKHRoaXMuYXV0b1JlbW92ZU9uRmluaXNoICYmIHRoaXMuX3N0b3BwZWQpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuUGFydGljbGVTeXN0ZW0gPSBtb2R1bGUuZXhwb3J0cyA9IFBhcnRpY2xlU3lzdGVtO1xuXG4iXSwic291cmNlUm9vdCI6Ii8ifQ==