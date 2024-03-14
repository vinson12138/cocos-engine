
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/particle/particle-system-3d.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _valueTypes = require("../../value-types");

var _utils = require("../../value-types/utils");

var _CCMaterial = _interopRequireDefault(require("../../assets/material/CCMaterial"));

var _colorOvertime = _interopRequireDefault(require("./animator/color-overtime"));

var _curveRange = _interopRequireWildcard(require("./animator/curve-range"));

var _forceOvertime = _interopRequireDefault(require("./animator/force-overtime"));

var _gradientRange = _interopRequireDefault(require("./animator/gradient-range"));

var _limitVelocityOvertime = _interopRequireDefault(require("./animator/limit-velocity-overtime"));

var _rotationOvertime = _interopRequireDefault(require("./animator/rotation-overtime"));

var _sizeOvertime = _interopRequireDefault(require("./animator/size-overtime"));

var _textureAnimation = _interopRequireDefault(require("./animator/texture-animation"));

var _velocityOvertime = _interopRequireDefault(require("./animator/velocity-overtime"));

var _burst = _interopRequireDefault(require("./burst"));

var _shapeModule = _interopRequireDefault(require("./emitter/shape-module"));

var _enum = require("./enum");

var _particleGeneralFunction = require("./particle-general-function");

var _trail = _interopRequireDefault(require("./renderer/trail"));

var _CCMesh = _interopRequireDefault(require("../../mesh/CCMesh"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _temp;

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } it = o[Symbol.iterator](); return it.next.bind(it); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

var _require = require('../../platform/CCClassDecorator'),
    ccclass = _require.ccclass,
    menu = _require.menu,
    property = _require.property,
    executeInEditMode = _require.executeInEditMode,
    executionOrder = _require.executionOrder;

var RenderComponent = require('../../components/CCRenderComponent');

var _world_mat = new _valueTypes.Mat4();

var _module_props = CC_EDITOR && ["_colorOverLifetimeModule", "_shapeModule", "_sizeOvertimeModule", "_velocityOvertimeModule", "_forceOvertimeModule", "_limitVelocityOvertimeModule", "_rotationOvertimeModule", "_textureAnimationModule", "_trailModule"];
/**
 * !#en The ParticleSystem3D Component.
 * !#zh 3D 粒子组件
 * @class ParticleSystem3D
 * @extends RenderComponent
 */


var ParticleSystem3D = (_dec = ccclass('cc.ParticleSystem3D'), _dec2 = menu('i18n:MAIN_MENU.component.renderers/ParticleSystem3D'), _dec3 = executionOrder(99), _dec4 = property({
  animatable: false
}), _dec5 = property({
  animatable: false
}), _dec6 = property({
  type: _enum.Space,
  animatable: false
}), _dec7 = property({
  type: _curveRange["default"]
}), _dec8 = property({
  type: _curveRange["default"]
}), _dec9 = property({
  type: _gradientRange["default"]
}), _dec10 = property({
  type: _enum.Space
}), _dec11 = property({
  type: _curveRange["default"]
}), _dec12 = property({
  type: _curveRange["default"],
  range: [-1, 1]
}), _dec13 = property({
  type: _curveRange["default"],
  range: [-1, 1],
  radian: true
}), _dec14 = property({
  type: _curveRange["default"],
  range: [-1, 1]
}), _dec15 = property({
  type: _curveRange["default"]
}), _dec16 = property({
  type: _curveRange["default"]
}), _dec17 = property({
  type: [_burst["default"]],
  animatable: false
}), _dec18 = property({
  type: [_CCMaterial["default"]],
  displayName: 'Materials',
  visible: false,
  override: true
}), _dec19 = property({
  type: _shapeModule["default"],
  animatable: false
}), _dec20 = property({
  type: _colorOvertime["default"],
  animatable: false
}), _dec21 = property({
  type: _sizeOvertime["default"],
  animatable: false
}), _dec22 = property({
  type: _velocityOvertime["default"],
  animatable: false
}), _dec23 = property({
  type: _forceOvertime["default"],
  animatable: false
}), _dec24 = property({
  type: _limitVelocityOvertime["default"],
  animatable: false
}), _dec25 = property({
  type: _rotationOvertime["default"],
  animatable: false
}), _dec26 = property({
  type: _textureAnimation["default"],
  animatable: false
}), _dec27 = property({
  type: _trail["default"],
  animatable: false
}), _dec28 = property({
  type: _enum.RenderMode,
  animatable: false
}), _dec29 = property({
  animatable: false
}), _dec30 = property({
  animatable: false
}), _dec31 = property({
  type: _CCMesh["default"],
  animatable: false
}), _dec32 = property({
  type: _CCMaterial["default"],
  animatable: false
}), _dec33 = property({
  type: _CCMaterial["default"],
  animatable: false
}), _dec(_class = _dec2(_class = _dec3(_class = executeInEditMode(_class = (_class2 = (_temp = /*#__PURE__*/function (_RenderComponent) {
  _inheritsLoose(ParticleSystem3D, _RenderComponent);

  // array of { emitter: ParticleSystem3D, type: 'birth', 'collision' or 'death'}
  function ParticleSystem3D() {
    var _this2;

    _this2 = _RenderComponent.call(this) || this;

    _initializerDefineProperty(_this2, "duration", _descriptor, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "_capacity", _descriptor2, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "loop", _descriptor3, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "playOnAwake", _descriptor4, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "_prewarm", _descriptor5, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "_simulationSpace", _descriptor6, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "simulationSpeed", _descriptor7, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "startDelay", _descriptor8, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "startLifetime", _descriptor9, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "startColor", _descriptor10, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "scaleSpace", _descriptor11, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "startSize", _descriptor12, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "startSpeed", _descriptor13, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "startRotation", _descriptor14, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "gravityModifier", _descriptor15, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "rateOverTime", _descriptor16, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "rateOverDistance", _descriptor17, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "bursts", _descriptor18, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "_shapeModule", _descriptor19, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "_colorOverLifetimeModule", _descriptor20, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "_sizeOvertimeModule", _descriptor21, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "_velocityOvertimeModule", _descriptor22, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "_forceOvertimeModule", _descriptor23, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "_limitVelocityOvertimeModule", _descriptor24, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "_rotationOvertimeModule", _descriptor25, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "_textureAnimationModule", _descriptor26, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "_trailModule", _descriptor27, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "_renderMode", _descriptor28, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "_velocityScale", _descriptor29, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "_lengthScale", _descriptor30, _assertThisInitialized(_this2));

    _initializerDefineProperty(_this2, "_mesh", _descriptor31, _assertThisInitialized(_this2));

    _this2._isPlaying = void 0;
    _this2._isPaused = void 0;
    _this2._isStopped = void 0;
    _this2._isEmitting = void 0;
    _this2._time = void 0;
    _this2._emitRateTimeCounter = void 0;
    _this2._emitRateDistanceCounter = void 0;
    _this2._oldWPos = void 0;
    _this2._curWPos = void 0;
    _this2._customData1 = void 0;
    _this2._customData2 = void 0;
    _this2._subEmitters = void 0;
    _this2.rateOverTime.constant = 10;
    _this2.startLifetime.constant = 5;
    _this2.startSize.constant = 1;
    _this2.startSpeed.constant = 5; // internal status

    _this2._isPlaying = false;
    _this2._isPaused = false;
    _this2._isStopped = true;
    _this2._isEmitting = false;
    _this2._time = 0.0; // playback position in seconds.

    _this2._emitRateTimeCounter = 0.0;
    _this2._emitRateDistanceCounter = 0.0;
    _this2._oldWPos = new _valueTypes.Vec3(0, 0, 0);
    _this2._curWPos = new _valueTypes.Vec3(0, 0, 0);
    _this2._customData1 = new _valueTypes.Vec2(0, 0);
    _this2._customData2 = new _valueTypes.Vec2(0, 0);
    _this2._subEmitters = []; // array of { emitter: ParticleSystemComponent, type: 'birth', 'collision' or 'death'}

    return _this2;
  }

  var _proto = ParticleSystem3D.prototype;

  _proto.onLoad = function onLoad() {
    this._assembler.onInit(this);

    this.shapeModule.onInit(this);
    this.trailModule.onInit(this);
    this.textureAnimationModule.onInit(this);

    this._resetPosition(); // this._system.add(this);

  };

  _proto._onMaterialModified = function _onMaterialModified(index, material) {
    this._assembler._onMaterialModified(index, material);
  };

  _proto._onRebuildPSO = function _onRebuildPSO(index, material) {
    this._assembler._onRebuildPSO(index, material);
  } // TODO: fastforward current particle system by simulating particles over given period of time, then pause it.
  // simulate(time, withChildren, restart, fixedTimeStep) {
  // }

  /**
   * !#en Playing particle effects
   * !#zh 播放粒子效果
   * @method play
   */
  ;

  _proto.play = function play() {
    if (this._isPaused) {
      this._isPaused = false;
    }

    if (this._isStopped) {
      this._isStopped = false;
    }

    this._isPlaying = true;
    this._isEmitting = true;

    this._resetPosition(); // prewarm


    if (this._prewarm) {
      this._prewarmSystem();
    }
  }
  /**
   * !#en Pause particle effect
   * !#zh 暂停播放粒子效果
   * @method pause
   */
  ;

  _proto.pause = function pause() {
    if (this._isStopped) {
      console.warn('pause(): particle system is already stopped.');
      return;
    }

    if (this._isPlaying) {
      this._isPlaying = false;
    }

    this._isPaused = true;
  }
  /**
   * !#en Stop particle effect
   * !#zh 停止播放粒子效果
   * @method stop
   */
  ;

  _proto.stop = function stop() {
    if (this._isPlaying || this._isPaused) {
      this.clear();
    }

    if (this._isPlaying) {
      this._isPlaying = false;
    }

    if (this._isPaused) {
      this._isPaused = false;
    }

    this._time = 0.0;
    this._emitRateTimeCounter = 0.0;
    this._emitRateDistanceCounter = 0.0;
    this._isStopped = true;
  } // remove all particles from current particle system.

  /**
   * !#en Remove all particle effect
   * !#zh 将所有粒子从粒子系统中清除
   * @method clear
   */
  ;

  _proto.clear = function clear() {
    if (this.enabledInHierarchy) {
      this._assembler.clear();

      this.trailModule.clear();
    }
  };

  _proto.getParticleCount = function getParticleCount() {
    return this._assembler.getParticleCount();
  };

  _proto.setCustomData1 = function setCustomData1(x, y) {
    _valueTypes.Vec2.set(this._customData1, x, y);
  };

  _proto.setCustomData2 = function setCustomData2(x, y) {
    _valueTypes.Vec2.set(this._customData2, x, y);
  };

  _proto.onDestroy = function onDestroy() {
    // this._system.remove(this);
    this._assembler.onDestroy();

    this.trailModule.destroy();
  };

  _proto.onEnable = function onEnable() {
    _RenderComponent.prototype.onEnable.call(this);

    if (this.playOnAwake) {
      this.play();
    }

    this._assembler.onEnable();

    this.trailModule.onEnable();
  };

  _proto.onDisable = function onDisable() {
    _RenderComponent.prototype.onDisable.call(this);

    this._assembler.onDisable();

    this.trailModule.onDisable();
  };

  _proto.update = function update(dt) {
    var scaledDeltaTime = dt * this.simulationSpeed;

    if (this._isPlaying) {
      this._time += scaledDeltaTime; // excute emission

      this._emit(scaledDeltaTime); // simulation, update particles.


      if (this._assembler._updateParticles(scaledDeltaTime) === 0 && !this._isEmitting) {
        this.stop();
      } // update render data


      this._assembler.updateParticleBuffer(); // update trail


      if (this.trailModule.enable) {
        this.trailModule.updateTrailBuffer();
      }
    }
  };

  _proto.emit = function emit(count, dt) {
    if (this._simulationSpace === _enum.Space.World) {
      this.node.getWorldMatrix(_world_mat);
    }

    for (var i = 0; i < count; ++i) {
      var particle = this._assembler._getFreeParticle();

      if (particle === null) {
        return;
      }

      var rand = (0, _valueTypes.pseudoRandom)((0, _valueTypes.randomRangeInt)(0, _utils.INT_MAX));

      if (this.shapeModule.enable) {
        this.shapeModule.emit(particle);
      } else {
        _valueTypes.Vec3.set(particle.position, 0, 0, 0);

        _valueTypes.Vec3.copy(particle.velocity, _particleGeneralFunction.particleEmitZAxis);
      }

      if (this.textureAnimationModule.enable) {
        this.textureAnimationModule.init(particle);
      }

      _valueTypes.Vec3.scale(particle.velocity, particle.velocity, this.startSpeed.evaluate(this._time / this.duration, rand));

      switch (this._simulationSpace) {
        case _enum.Space.Local:
          break;

        case _enum.Space.World:
          _valueTypes.Vec3.transformMat4(particle.position, particle.position, _world_mat);

          var worldRot = new _valueTypes.Quat();
          this.node.getWorldRotation(worldRot);

          _valueTypes.Vec3.transformQuat(particle.velocity, particle.velocity, worldRot);

          break;

        case _enum.Space.Custom:
          // TODO:
          break;
      }

      _valueTypes.Vec3.copy(particle.ultimateVelocity, particle.velocity); // apply startRotation. now 2D only.


      _valueTypes.Vec3.set(particle.rotation, 0, 0, this.startRotation.evaluate(this._time / this.duration, rand)); // apply startSize. now 2D only.


      _valueTypes.Vec3.set(particle.startSize, this.startSize.evaluate(this._time / this.duration, rand), 1, 1);

      particle.startSize.y = particle.startSize.x;

      _valueTypes.Vec3.copy(particle.size, particle.startSize); // apply startColor.


      particle.startColor.set(this.startColor.evaluate(this._time / this.duration, rand));
      particle.color.set(particle.startColor); // apply startLifetime.

      particle.startLifetime = this.startLifetime.evaluate(this._time / this.duration, rand) + dt;
      particle.remainingLifetime = particle.startLifetime;
      particle.randomSeed = (0, _valueTypes.randomRangeInt)(0, 233280);

      this._assembler._setNewParticle(particle);
    } // end of particles forLoop.

  } // initialize particle system as though it had already completed a full cycle.
  ;

  _proto._prewarmSystem = function _prewarmSystem() {
    this.startDelay.mode = _curveRange.Mode.Constant; // clear startDelay.

    this.startDelay.constant = 0;
    var dt = 1.0; // should use varying value?

    var cnt = this.duration / dt;

    for (var i = 0; i < cnt; ++i) {
      this._time += dt;

      this._emit(dt);

      this._assembler._updateParticles(dt);
    }
  } // internal function
  ;

  _proto._emit = function _emit(dt) {
    // emit particles.
    var startDelay = this.startDelay.evaluate(0, 1);

    if (this._time > startDelay) {
      if (this._time > this.duration + startDelay) {
        // this._time = startDelay; // delay will not be applied from the second loop.(Unity)
        // this._emitRateTimeCounter = 0.0;
        // this._emitRateDistanceCounter = 0.0;
        if (!this.loop) {
          this._isEmitting = false;
          return;
        }
      } // emit by rateOverTime


      this._emitRateTimeCounter += this.rateOverTime.evaluate(this._time / this.duration, 1) * dt;

      if (this._emitRateTimeCounter > 1 && this._isEmitting) {
        var emitNum = Math.floor(this._emitRateTimeCounter);
        this._emitRateTimeCounter -= emitNum;
        this.emit(emitNum, dt);
      } // emit by rateOverDistance


      this.node.getWorldPosition(this._curWPos);

      var distance = _valueTypes.Vec3.distance(this._curWPos, this._oldWPos);

      _valueTypes.Vec3.copy(this._oldWPos, this._curWPos);

      this._emitRateDistanceCounter += distance * this.rateOverDistance.evaluate(this._time / this.duration, 1);

      if (this._emitRateDistanceCounter > 1 && this._isEmitting) {
        var _emitNum = Math.floor(this._emitRateDistanceCounter);

        this._emitRateDistanceCounter -= _emitNum;
        this.emit(_emitNum, dt);
      } // bursts


      for (var _iterator = _createForOfIteratorHelperLoose(this.bursts), _step; !(_step = _iterator()).done;) {
        var burst = _step.value;
        burst.update(this, dt);
      }
    }
  };

  _proto._activateMaterial = function _activateMaterial() {};

  _proto._resetPosition = function _resetPosition() {
    this.node.getWorldPosition(this._oldWPos);

    _valueTypes.Vec3.copy(this._curWPos, this._oldWPos);
  };

  _proto.addSubEmitter = function addSubEmitter(subEmitter) {
    this._subEmitters.push(subEmitter);
  };

  _proto.removeSubEmitter = function removeSubEmitter(idx) {
    this._subEmitters.splice(this._subEmitters.indexOf(idx), 1);
  };

  _proto.addBurst = function addBurst(burst) {
    this.bursts.push(burst);
  };

  _proto.removeBurst = function removeBurst(idx) {
    this.bursts.splice(this.bursts.indexOf(idx), 1);
  };

  _proto._checkBacth = function _checkBacth() {};

  _createClass(ParticleSystem3D, [{
    key: "capacity",
    get:
    /**
     * !#en The run time of particle.
     * !#zh 粒子系统运行时间
     * @property {Number} duration
     */

    /**
     * !#en The maximum number of particles that a particle system can generate.
     * !#zh 粒子系统能生成的最大粒子数量
     * @property {Number} capacity
     */
    function get() {
      return this._capacity;
    },
    set: function set(val) {
      this._capacity = val;

      if (this._assembler) {
        this._assembler.setCapacity(this._capacity);
      }
    }
    /**
     * !#en Whether the particle system loops.
     * !#zh 粒子系统是否循环播放
     * @property {Boolean} loop
     */

  }, {
    key: "prewarm",
    get:
    /**
     * !#en When selected, the particle system will start playing after one round has been played (only effective when loop is enabled).
     * !#zh 选中之后，粒子系统会以已播放完一轮之后的状态开始播放（仅当循环播放启用时有效）
     * @property {Boolean} prewarm
     */
    function get() {
      return this._prewarm;
    },
    set: function set(val) {
      if (val === true && this.loop === false) {// console.warn('prewarm only works if loop is also enabled.');
      }

      this._prewarm = val;
    }
  }, {
    key: "simulationSpace",
    get:
    /**
     * !#en The coordinate system in which the particle system is located.<br>
     * World coordinates (does not change when the position of other objects changes)<br>
     * Local coordinates (moving as the position of the parent node changes)<br>
     * Custom coordinates (moving with the position of a custom node)
     * !#zh 选择粒子系统所在的坐标系<br>
     * 世界坐标（不随其他物体位置改变而变换）<br>
     * 局部坐标（跟随父节点位置改变而移动）<br>
     * 自定坐标（跟随自定义节点的位置改变而移动）
     * @property {Space} simulationSpace
     */
    function get() {
      return this._simulationSpace;
    },
    set: function set(val) {
      if (val !== this._simulationSpace) {
        this._simulationSpace = val;

        this._assembler._updateMaterialParams();

        this._assembler._updateTrailMaterial();
      }
    }
    /**
     * !#en Controlling the update speed of the entire particle system.
     * !#zh 控制整个粒子系统的更新速度。
     * @property {Number} simulationSpeed
     */

  }, {
    key: "materials",
    get: function get() {
      // if we don't create an array copy, the editor will modify the original array directly.
      return this._materials;
    },
    set: function set(val) {
      this._materials = val;

      this._activateMaterial();
    }
  }, {
    key: "shapeModule",
    get:
    /**
     * !#en Particle emitter module
     * !#zh 粒子发射器模块
     * @property {ShapeModule} shapeModule
     */
    function get() {
      return this._shapeModule;
    },
    set: function set(val) {
      this._shapeModule = val;

      this._shapeModule.onInit(this);
    }
  }, {
    key: "colorOverLifetimeModule",
    get:
    /**
     * !#en Color control module
     * !#zh 颜色控制模块
     * @property {ColorOverLifetimeModule} colorOverLifetimeModule
     */
    function get() {
      return this._colorOverLifetimeModule;
    },
    set: function set(val) {
      this._colorOverLifetimeModule = val;
    }
  }, {
    key: "sizeOvertimeModule",
    get:
    /**
     * !#en Particle size module
     * !#zh 粒子大小模块
     * @property {SizeOvertimeModule} sizeOvertimeModule
     */
    function get() {
      return this._sizeOvertimeModule;
    },
    set: function set(val) {
      this._sizeOvertimeModule = val;
    }
  }, {
    key: "velocityOvertimeModule",
    get:
    /**
     * !#en Particle speed module
     * !#zh 粒子速度模块
     * @property {VelocityOvertimeModule} velocityOvertimeModule
     */
    function get() {
      return this._velocityOvertimeModule;
    },
    set: function set(val) {
      this._velocityOvertimeModule = val;
    }
  }, {
    key: "forceOvertimeModule",
    get:
    /**
     * !#en Particle acceleration module
     * !#zh 粒子加速度模块
     * @property {ForceOvertimeModule} forceOvertimeModule
     */
    function get() {
      return this._forceOvertimeModule;
    },
    set: function set(val) {
      this._forceOvertimeModule = val;
    }
  }, {
    key: "limitVelocityOvertimeModule",
    get:
    /**
     * !#en Particle limit speed module (only CPU particles are supported)
     * !#zh 粒子限制速度模块（只支持 CPU 粒子）
     * @property {LimitVelocityOvertimeModule} limitVelocityOvertimeModule
     */
    function get() {
      return this._limitVelocityOvertimeModule;
    },
    set: function set(val) {
      this._limitVelocityOvertimeModule = val;
    }
  }, {
    key: "rotationOvertimeModule",
    get:
    /**
     * !#en Particle rotation module
     * !#zh 粒子旋转模块
     * @property {RotationOvertimeModule} rotationOvertimeModule
     */
    function get() {
      return this._rotationOvertimeModule;
    },
    set: function set(val) {
      this._rotationOvertimeModule = val;
    }
  }, {
    key: "textureAnimationModule",
    get:
    /**
     * !#en Texture Animation Module
     * !#zh 贴图动画模块
     * @property {TextureAnimationModule} textureAnimationModule
     */
    function get() {
      return this._textureAnimationModule;
    },
    set: function set(val) {
      this._textureAnimationModule = val;

      this._textureAnimationModule.onInit(this);
    }
  }, {
    key: "trailModule",
    get:
    /**
     * !#en Particle Trajectory Module
     * !#zh 粒子轨迹模块
     * @property {TrailModule} trailModule
     */
    function get() {
      return this._trailModule;
    },
    set: function set(val) {
      this._trailModule = val;

      this._trailModule.onInit(this);
    }
  }, {
    key: "renderMode",
    get:
    /**
     * !#en Particle generation mode
     * !#zh 设定粒子生成模式
     * @property {RenderMode} renderMode
     */
    function get() {
      return this._renderMode;
    },
    set: function set(val) {
      if (this._renderMode === val) {
        return;
      }

      this._renderMode = val;

      this._assembler._setVertexAttrib();

      this._assembler._updateModel();

      this._assembler._updateMaterialParams();
    }
  }, {
    key: "velocityScale",
    get:
    /**
     * !#en When the particle generation mode is StrecthedBillboard, in the direction of movement of the particles is stretched by velocity magnitude
     * !#zh 在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按速度大小进行拉伸
     * @property {Number} velocityScale
     */
    function get() {
      return this._velocityScale;
    },
    set: function set(val) {
      this._velocityScale = val;

      this._assembler._updateMaterialParams();
    }
  }, {
    key: "lengthScale",
    get:
    /**
     * !#en When the particle generation method is StrecthedBillboard, the particles are stretched according to the particle size in the direction of motion
     * !#zh 在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按粒子大小进行拉伸
     * @property {Number} lengthScale
     */
    function get() {
      return this._lengthScale;
    },
    set: function set(val) {
      this._lengthScale = val;

      this._assembler._updateMaterialParams();
    }
  }, {
    key: "mesh",
    get:
    /**
     * !#en Particle model
     * !#zh 粒子模型
     * @property {Mesh} mesh
     */
    function get() {
      return this._mesh;
    },
    set: function set(val) {
      this._mesh = val;

      this._assembler._updateModel();
    }
    /**
     * !#en Particle material
     * !#zh 粒子材质
     * @property {Material} particleMaterial
     */

  }, {
    key: "particleMaterial",
    get: function get() {
      return this.getMaterial(0);
    },
    set: function set(val) {
      this.setMaterial(0, val);

      this._onMaterialModified(0, val);
    }
    /**
     * !#en Particle trail material
     * !#zh 粒子轨迹材质
     * @property {Material} trailMaterial
     */

  }, {
    key: "trailMaterial",
    get: function get() {
      return this.getMaterial(1);
    },
    set: function set(val) {
      this.setMaterial(1, val);

      this._onMaterialModified(1, val);
    }
  }, {
    key: "isPlaying",
    get: function get() {
      return this._isPlaying;
    }
  }, {
    key: "isPaused",
    get: function get() {
      return this._isPaused;
    }
  }, {
    key: "isStopped",
    get: function get() {
      return this._isStopped;
    }
  }, {
    key: "isEmitting",
    get: function get() {
      return this._isEmitting;
    }
  }, {
    key: "time",
    get: function get() {
      return this._time;
    }
  }]);

  return ParticleSystem3D;
}(RenderComponent), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "duration", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 5.0;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_capacity", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 100;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "capacity", [property], Object.getOwnPropertyDescriptor(_class2.prototype, "capacity"), _class2.prototype), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "loop", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "playOnAwake", [_dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_prewarm", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "prewarm", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "prewarm"), _class2.prototype), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_simulationSpace", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return _enum.Space.Local;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "simulationSpace", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "simulationSpace"), _class2.prototype), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "simulationSpeed", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1.0;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "startDelay", [_dec7], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "startLifetime", [_dec8], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "startColor", [_dec9], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _gradientRange["default"]();
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "scaleSpace", [_dec10], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return _enum.Space.Local;
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "startSize", [_dec11], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "startSpeed", [_dec12], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "startRotation", [_dec13], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "gravityModifier", [_dec14], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "rateOverTime", [_dec15], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "rateOverDistance", [_dec16], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "bursts", [_dec17], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Array();
  }
}), _applyDecoratedDescriptor(_class2.prototype, "materials", [_dec18], Object.getOwnPropertyDescriptor(_class2.prototype, "materials"), _class2.prototype), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "_shapeModule", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _shapeModule["default"]();
  }
}), _applyDecoratedDescriptor(_class2.prototype, "shapeModule", [_dec19], Object.getOwnPropertyDescriptor(_class2.prototype, "shapeModule"), _class2.prototype), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "_colorOverLifetimeModule", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _colorOvertime["default"]();
  }
}), _applyDecoratedDescriptor(_class2.prototype, "colorOverLifetimeModule", [_dec20], Object.getOwnPropertyDescriptor(_class2.prototype, "colorOverLifetimeModule"), _class2.prototype), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "_sizeOvertimeModule", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _sizeOvertime["default"]();
  }
}), _applyDecoratedDescriptor(_class2.prototype, "sizeOvertimeModule", [_dec21], Object.getOwnPropertyDescriptor(_class2.prototype, "sizeOvertimeModule"), _class2.prototype), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "_velocityOvertimeModule", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _velocityOvertime["default"]();
  }
}), _applyDecoratedDescriptor(_class2.prototype, "velocityOvertimeModule", [_dec22], Object.getOwnPropertyDescriptor(_class2.prototype, "velocityOvertimeModule"), _class2.prototype), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "_forceOvertimeModule", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _forceOvertime["default"]();
  }
}), _applyDecoratedDescriptor(_class2.prototype, "forceOvertimeModule", [_dec23], Object.getOwnPropertyDescriptor(_class2.prototype, "forceOvertimeModule"), _class2.prototype), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "_limitVelocityOvertimeModule", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _limitVelocityOvertime["default"]();
  }
}), _applyDecoratedDescriptor(_class2.prototype, "limitVelocityOvertimeModule", [_dec24], Object.getOwnPropertyDescriptor(_class2.prototype, "limitVelocityOvertimeModule"), _class2.prototype), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, "_rotationOvertimeModule", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _rotationOvertime["default"]();
  }
}), _applyDecoratedDescriptor(_class2.prototype, "rotationOvertimeModule", [_dec25], Object.getOwnPropertyDescriptor(_class2.prototype, "rotationOvertimeModule"), _class2.prototype), _descriptor26 = _applyDecoratedDescriptor(_class2.prototype, "_textureAnimationModule", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _textureAnimation["default"]();
  }
}), _applyDecoratedDescriptor(_class2.prototype, "textureAnimationModule", [_dec26], Object.getOwnPropertyDescriptor(_class2.prototype, "textureAnimationModule"), _class2.prototype), _descriptor27 = _applyDecoratedDescriptor(_class2.prototype, "_trailModule", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _trail["default"]();
  }
}), _applyDecoratedDescriptor(_class2.prototype, "trailModule", [_dec27], Object.getOwnPropertyDescriptor(_class2.prototype, "trailModule"), _class2.prototype), _descriptor28 = _applyDecoratedDescriptor(_class2.prototype, "_renderMode", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return _enum.RenderMode.Billboard;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "renderMode", [_dec28], Object.getOwnPropertyDescriptor(_class2.prototype, "renderMode"), _class2.prototype), _descriptor29 = _applyDecoratedDescriptor(_class2.prototype, "_velocityScale", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "velocityScale", [_dec29], Object.getOwnPropertyDescriptor(_class2.prototype, "velocityScale"), _class2.prototype), _descriptor30 = _applyDecoratedDescriptor(_class2.prototype, "_lengthScale", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "lengthScale", [_dec30], Object.getOwnPropertyDescriptor(_class2.prototype, "lengthScale"), _class2.prototype), _descriptor31 = _applyDecoratedDescriptor(_class2.prototype, "_mesh", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "mesh", [_dec31], Object.getOwnPropertyDescriptor(_class2.prototype, "mesh"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "particleMaterial", [_dec32], Object.getOwnPropertyDescriptor(_class2.prototype, "particleMaterial"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "trailMaterial", [_dec33], Object.getOwnPropertyDescriptor(_class2.prototype, "trailMaterial"), _class2.prototype)), _class2)) || _class) || _class) || _class) || _class);
exports["default"] = ParticleSystem3D;
CC_EDITOR && (ParticleSystem3D.prototype._onBeforeSerialize = function (props) {
  var _this = this;

  return props.filter(function (p) {
    return !_module_props.includes(p) || _this[p].enable;
  });
});
cc.ParticleSystem3D = ParticleSystem3D;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BhcnRpY2xlL3BhcnRpY2xlLXN5c3RlbS0zZC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY2NjbGFzcyIsIm1lbnUiLCJwcm9wZXJ0eSIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiZXhlY3V0aW9uT3JkZXIiLCJSZW5kZXJDb21wb25lbnQiLCJfd29ybGRfbWF0IiwiTWF0NCIsIl9tb2R1bGVfcHJvcHMiLCJDQ19FRElUT1IiLCJQYXJ0aWNsZVN5c3RlbTNEIiwiYW5pbWF0YWJsZSIsInR5cGUiLCJTcGFjZSIsIkN1cnZlUmFuZ2UiLCJHcmFkaWVudFJhbmdlIiwicmFuZ2UiLCJyYWRpYW4iLCJCdXJzdCIsIk1hdGVyaWFsIiwiZGlzcGxheU5hbWUiLCJ2aXNpYmxlIiwib3ZlcnJpZGUiLCJTaGFwZU1vZHVsZSIsIkNvbG9yT3ZlckxpZmV0aW1lTW9kdWxlIiwiU2l6ZU92ZXJ0aW1lTW9kdWxlIiwiVmVsb2NpdHlPdmVydGltZU1vZHVsZSIsIkZvcmNlT3ZlcnRpbWVNb2R1bGUiLCJMaW1pdFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUiLCJSb3RhdGlvbk92ZXJ0aW1lTW9kdWxlIiwiVGV4dHVyZUFuaW1hdGlvbk1vZHVsZSIsIlRyYWlsTW9kdWxlIiwiUmVuZGVyTW9kZSIsIk1lc2giLCJfaXNQbGF5aW5nIiwiX2lzUGF1c2VkIiwiX2lzU3RvcHBlZCIsIl9pc0VtaXR0aW5nIiwiX3RpbWUiLCJfZW1pdFJhdGVUaW1lQ291bnRlciIsIl9lbWl0UmF0ZURpc3RhbmNlQ291bnRlciIsIl9vbGRXUG9zIiwiX2N1cldQb3MiLCJfY3VzdG9tRGF0YTEiLCJfY3VzdG9tRGF0YTIiLCJfc3ViRW1pdHRlcnMiLCJyYXRlT3ZlclRpbWUiLCJjb25zdGFudCIsInN0YXJ0TGlmZXRpbWUiLCJzdGFydFNpemUiLCJzdGFydFNwZWVkIiwiVmVjMyIsIlZlYzIiLCJvbkxvYWQiLCJfYXNzZW1ibGVyIiwib25Jbml0Iiwic2hhcGVNb2R1bGUiLCJ0cmFpbE1vZHVsZSIsInRleHR1cmVBbmltYXRpb25Nb2R1bGUiLCJfcmVzZXRQb3NpdGlvbiIsIl9vbk1hdGVyaWFsTW9kaWZpZWQiLCJpbmRleCIsIm1hdGVyaWFsIiwiX29uUmVidWlsZFBTTyIsInBsYXkiLCJfcHJld2FybSIsIl9wcmV3YXJtU3lzdGVtIiwicGF1c2UiLCJjb25zb2xlIiwid2FybiIsInN0b3AiLCJjbGVhciIsImVuYWJsZWRJbkhpZXJhcmNoeSIsImdldFBhcnRpY2xlQ291bnQiLCJzZXRDdXN0b21EYXRhMSIsIngiLCJ5Iiwic2V0Iiwic2V0Q3VzdG9tRGF0YTIiLCJvbkRlc3Ryb3kiLCJkZXN0cm95Iiwib25FbmFibGUiLCJwbGF5T25Bd2FrZSIsIm9uRGlzYWJsZSIsInVwZGF0ZSIsImR0Iiwic2NhbGVkRGVsdGFUaW1lIiwic2ltdWxhdGlvblNwZWVkIiwiX2VtaXQiLCJfdXBkYXRlUGFydGljbGVzIiwidXBkYXRlUGFydGljbGVCdWZmZXIiLCJlbmFibGUiLCJ1cGRhdGVUcmFpbEJ1ZmZlciIsImVtaXQiLCJjb3VudCIsIl9zaW11bGF0aW9uU3BhY2UiLCJXb3JsZCIsIm5vZGUiLCJnZXRXb3JsZE1hdHJpeCIsImkiLCJwYXJ0aWNsZSIsIl9nZXRGcmVlUGFydGljbGUiLCJyYW5kIiwiSU5UX01BWCIsInBvc2l0aW9uIiwiY29weSIsInZlbG9jaXR5IiwicGFydGljbGVFbWl0WkF4aXMiLCJpbml0Iiwic2NhbGUiLCJldmFsdWF0ZSIsImR1cmF0aW9uIiwiTG9jYWwiLCJ0cmFuc2Zvcm1NYXQ0Iiwid29ybGRSb3QiLCJRdWF0IiwiZ2V0V29ybGRSb3RhdGlvbiIsInRyYW5zZm9ybVF1YXQiLCJDdXN0b20iLCJ1bHRpbWF0ZVZlbG9jaXR5Iiwicm90YXRpb24iLCJzdGFydFJvdGF0aW9uIiwic2l6ZSIsInN0YXJ0Q29sb3IiLCJjb2xvciIsInJlbWFpbmluZ0xpZmV0aW1lIiwicmFuZG9tU2VlZCIsIl9zZXROZXdQYXJ0aWNsZSIsInN0YXJ0RGVsYXkiLCJtb2RlIiwiTW9kZSIsIkNvbnN0YW50IiwiY250IiwibG9vcCIsImVtaXROdW0iLCJNYXRoIiwiZmxvb3IiLCJnZXRXb3JsZFBvc2l0aW9uIiwiZGlzdGFuY2UiLCJyYXRlT3ZlckRpc3RhbmNlIiwiYnVyc3RzIiwiYnVyc3QiLCJfYWN0aXZhdGVNYXRlcmlhbCIsImFkZFN1YkVtaXR0ZXIiLCJzdWJFbWl0dGVyIiwicHVzaCIsInJlbW92ZVN1YkVtaXR0ZXIiLCJpZHgiLCJzcGxpY2UiLCJpbmRleE9mIiwiYWRkQnVyc3QiLCJyZW1vdmVCdXJzdCIsIl9jaGVja0JhY3RoIiwiX2NhcGFjaXR5IiwidmFsIiwic2V0Q2FwYWNpdHkiLCJfdXBkYXRlTWF0ZXJpYWxQYXJhbXMiLCJfdXBkYXRlVHJhaWxNYXRlcmlhbCIsIl9tYXRlcmlhbHMiLCJfc2hhcGVNb2R1bGUiLCJfY29sb3JPdmVyTGlmZXRpbWVNb2R1bGUiLCJfc2l6ZU92ZXJ0aW1lTW9kdWxlIiwiX3ZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUiLCJfZm9yY2VPdmVydGltZU1vZHVsZSIsIl9saW1pdFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUiLCJfcm90YXRpb25PdmVydGltZU1vZHVsZSIsIl90ZXh0dXJlQW5pbWF0aW9uTW9kdWxlIiwiX3RyYWlsTW9kdWxlIiwiX3JlbmRlck1vZGUiLCJfc2V0VmVydGV4QXR0cmliIiwiX3VwZGF0ZU1vZGVsIiwiX3ZlbG9jaXR5U2NhbGUiLCJfbGVuZ3RoU2NhbGUiLCJfbWVzaCIsImdldE1hdGVyaWFsIiwic2V0TWF0ZXJpYWwiLCJBcnJheSIsIkJpbGxib2FyZCIsInByb3RvdHlwZSIsIl9vbkJlZm9yZVNlcmlhbGl6ZSIsInByb3BzIiwiZmlsdGVyIiwicCIsImluY2x1ZGVzIiwiY2MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7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UEFtQmhCQTs7Ozs7V0FDYzs7d09Ba0JkQTs7Ozs7V0FDTzs7OztBQW1hWk8sU0FBUyxLQUFLQyxnQkFBZ0IsQ0FBQ3dLLFNBQWpCLENBQTJCQyxrQkFBM0IsR0FBZ0QsVUFBU0MsS0FBVCxFQUFlO0FBQUE7O0FBQUMsU0FBT0EsS0FBSyxDQUFDQyxNQUFOLENBQWEsVUFBQUMsQ0FBQztBQUFBLFdBQUksQ0FBQzlLLGFBQWEsQ0FBQytLLFFBQWQsQ0FBdUJELENBQXZCLENBQUQsSUFBOEIsS0FBSSxDQUFDQSxDQUFELENBQUosQ0FBUTNGLE1BQTFDO0FBQUEsR0FBZCxDQUFQO0FBQXdFLENBQTdJLENBQVQ7QUFFQTZGLEVBQUUsQ0FBQzlLLGdCQUFILEdBQXNCQSxnQkFBdEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCB7IE1hdDQsIHBzZXVkb1JhbmRvbSwgUXVhdCwgcmFuZG9tUmFuZ2VJbnQsIFZlYzIsIFZlYzMgfSBmcm9tICcuLi8uLi92YWx1ZS10eXBlcyc7XG5pbXBvcnQgeyBJTlRfTUFYIH0gZnJvbSAnLi4vLi4vdmFsdWUtdHlwZXMvdXRpbHMnO1xuaW1wb3J0IE1hdGVyaWFsIGZyb20gJy4uLy4uL2Fzc2V0cy9tYXRlcmlhbC9DQ01hdGVyaWFsJztcbmltcG9ydCBDb2xvck92ZXJMaWZldGltZU1vZHVsZSBmcm9tICcuL2FuaW1hdG9yL2NvbG9yLW92ZXJ0aW1lJztcbmltcG9ydCBDdXJ2ZVJhbmdlLCB7IE1vZGUgfWZyb20gJy4vYW5pbWF0b3IvY3VydmUtcmFuZ2UnO1xuaW1wb3J0IEZvcmNlT3ZlcnRpbWVNb2R1bGUgZnJvbSAnLi9hbmltYXRvci9mb3JjZS1vdmVydGltZSc7XG5pbXBvcnQgR3JhZGllbnRSYW5nZSBmcm9tICcuL2FuaW1hdG9yL2dyYWRpZW50LXJhbmdlJztcbmltcG9ydCBMaW1pdFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUgZnJvbSAnLi9hbmltYXRvci9saW1pdC12ZWxvY2l0eS1vdmVydGltZSc7XG5pbXBvcnQgUm90YXRpb25PdmVydGltZU1vZHVsZSBmcm9tICcuL2FuaW1hdG9yL3JvdGF0aW9uLW92ZXJ0aW1lJztcbmltcG9ydCBTaXplT3ZlcnRpbWVNb2R1bGUgZnJvbSAnLi9hbmltYXRvci9zaXplLW92ZXJ0aW1lJztcbmltcG9ydCBUZXh0dXJlQW5pbWF0aW9uTW9kdWxlIGZyb20gJy4vYW5pbWF0b3IvdGV4dHVyZS1hbmltYXRpb24nO1xuaW1wb3J0IFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUgZnJvbSAnLi9hbmltYXRvci92ZWxvY2l0eS1vdmVydGltZSc7XG5pbXBvcnQgQnVyc3QgZnJvbSAnLi9idXJzdCc7XG5pbXBvcnQgU2hhcGVNb2R1bGUgZnJvbSAnLi9lbWl0dGVyL3NoYXBlLW1vZHVsZSc7XG5pbXBvcnQgeyBSZW5kZXJNb2RlLCBTcGFjZSB9IGZyb20gJy4vZW51bSc7XG5pbXBvcnQgeyBwYXJ0aWNsZUVtaXRaQXhpcyB9IGZyb20gJy4vcGFydGljbGUtZ2VuZXJhbC1mdW5jdGlvbic7XG5pbXBvcnQgVHJhaWxNb2R1bGUgZnJvbSAnLi9yZW5kZXJlci90cmFpbCc7XG5pbXBvcnQgTWVzaCBmcm9tICcuLi8uLi9tZXNoL0NDTWVzaCc7XG5cbmNvbnN0IHsgY2NjbGFzcywgbWVudSwgcHJvcGVydHksIGV4ZWN1dGVJbkVkaXRNb2RlLCBleGVjdXRpb25PcmRlcn0gPSByZXF1aXJlKCcuLi8uLi9wbGF0Zm9ybS9DQ0NsYXNzRGVjb3JhdG9yJylcbmNvbnN0IFJlbmRlckNvbXBvbmVudCA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvQ0NSZW5kZXJDb21wb25lbnQnKTtcblxuY29uc3QgX3dvcmxkX21hdCA9IG5ldyBNYXQ0KCk7XG5jb25zdCBfbW9kdWxlX3Byb3BzID0gQ0NfRURJVE9SICYmIFtcbiAgICBcIl9jb2xvck92ZXJMaWZldGltZU1vZHVsZVwiLFxuICAgIFwiX3NoYXBlTW9kdWxlXCIsXG4gICAgXCJfc2l6ZU92ZXJ0aW1lTW9kdWxlXCIsXG4gICAgXCJfdmVsb2NpdHlPdmVydGltZU1vZHVsZVwiLFxuICAgIFwiX2ZvcmNlT3ZlcnRpbWVNb2R1bGVcIixcbiAgICBcIl9saW1pdFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGVcIixcbiAgICBcIl9yb3RhdGlvbk92ZXJ0aW1lTW9kdWxlXCIsXG4gICAgXCJfdGV4dHVyZUFuaW1hdGlvbk1vZHVsZVwiLFxuICAgIFwiX3RyYWlsTW9kdWxlXCJcbl1cblxuLyoqXG4gKiAhI2VuIFRoZSBQYXJ0aWNsZVN5c3RlbTNEIENvbXBvbmVudC5cbiAqICEjemggM0Qg57KS5a2Q57uE5Lu2XG4gKiBAY2xhc3MgUGFydGljbGVTeXN0ZW0zRFxuICogQGV4dGVuZHMgUmVuZGVyQ29tcG9uZW50XG4gKi9cbkBjY2NsYXNzKCdjYy5QYXJ0aWNsZVN5c3RlbTNEJylcbkBtZW51KCdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQucmVuZGVyZXJzL1BhcnRpY2xlU3lzdGVtM0QnKVxuQGV4ZWN1dGlvbk9yZGVyKDk5KVxuQGV4ZWN1dGVJbkVkaXRNb2RlXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJ0aWNsZVN5c3RlbTNEIGV4dGVuZHMgUmVuZGVyQ29tcG9uZW50IHtcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBydW4gdGltZSBvZiBwYXJ0aWNsZS5cbiAgICAgKiAhI3poIOeykuWtkOezu+e7n+i/kOihjOaXtumXtFxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBkdXJhdGlvblxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGR1cmF0aW9uID0gNS4wO1xuXG4gICAgQHByb3BlcnR5XG4gICAgX2NhcGFjaXR5ID0gMTAwO1xuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG1heGltdW0gbnVtYmVyIG9mIHBhcnRpY2xlcyB0aGF0IGEgcGFydGljbGUgc3lzdGVtIGNhbiBnZW5lcmF0ZS5cbiAgICAgKiAhI3poIOeykuWtkOezu+e7n+iDveeUn+aIkOeahOacgOWkp+eykuWtkOaVsOmHj1xuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBjYXBhY2l0eVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGdldCBjYXBhY2l0eSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jYXBhY2l0eTtcbiAgICB9XG5cbiAgICBzZXQgY2FwYWNpdHkgKHZhbCkge1xuICAgICAgICB0aGlzLl9jYXBhY2l0eSA9IHZhbDtcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VtYmxlcikge1xuICAgICAgICAgICAgdGhpcy5fYXNzZW1ibGVyLnNldENhcGFjaXR5KHRoaXMuX2NhcGFjaXR5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gV2hldGhlciB0aGUgcGFydGljbGUgc3lzdGVtIGxvb3BzLlxuICAgICAqICEjemgg57KS5a2Q57O757uf5piv5ZCm5b6q546v5pKt5pS+XG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBsb29wXG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgbG9vcCA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFdoZXRoZXIgdGhlIHBhcnRpY2xlcyBzdGFydCBwbGF5aW5nIGF1dG9tYXRpY2FsbHkgYWZ0ZXIgbG9hZGVkLlxuICAgICAqICEjemgg57KS5a2Q57O757uf5Yqg6L295ZCO5piv5ZCm6Ieq5Yqo5byA5aeL5pKt5pS+XG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBwbGF5T25Bd2FrZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgfSlcbiAgICBwbGF5T25Bd2FrZSA9IHRydWU7XG5cbiAgICBAcHJvcGVydHlcbiAgICBfcHJld2FybSA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqICEjZW4gV2hlbiBzZWxlY3RlZCwgdGhlIHBhcnRpY2xlIHN5c3RlbSB3aWxsIHN0YXJ0IHBsYXlpbmcgYWZ0ZXIgb25lIHJvdW5kIGhhcyBiZWVuIHBsYXllZCAob25seSBlZmZlY3RpdmUgd2hlbiBsb29wIGlzIGVuYWJsZWQpLlxuICAgICAqICEjemgg6YCJ5Lit5LmL5ZCO77yM57KS5a2Q57O757uf5Lya5Lul5bey5pKt5pS+5a6M5LiA6L2u5LmL5ZCO55qE54q25oCB5byA5aeL5pKt5pS+77yI5LuF5b2T5b6q546v5pKt5pS+5ZCv55So5pe25pyJ5pWI77yJXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBwcmV3YXJtXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICB9KVxuICAgIGdldCBwcmV3YXJtICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ByZXdhcm07XG4gICAgfVxuXG4gICAgc2V0IHByZXdhcm0gKHZhbCkge1xuICAgICAgICBpZiAodmFsID09PSB0cnVlICYmIHRoaXMubG9vcCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUud2FybigncHJld2FybSBvbmx5IHdvcmtzIGlmIGxvb3AgaXMgYWxzbyBlbmFibGVkLicpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3ByZXdhcm0gPSB2YWw7XG4gICAgfVxuXG4gICAgQHByb3BlcnR5XG4gICAgX3NpbXVsYXRpb25TcGFjZSA9IFNwYWNlLkxvY2FsO1xuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGNvb3JkaW5hdGUgc3lzdGVtIGluIHdoaWNoIHRoZSBwYXJ0aWNsZSBzeXN0ZW0gaXMgbG9jYXRlZC48YnI+XG4gICAgICogV29ybGQgY29vcmRpbmF0ZXMgKGRvZXMgbm90IGNoYW5nZSB3aGVuIHRoZSBwb3NpdGlvbiBvZiBvdGhlciBvYmplY3RzIGNoYW5nZXMpPGJyPlxuICAgICAqIExvY2FsIGNvb3JkaW5hdGVzIChtb3ZpbmcgYXMgdGhlIHBvc2l0aW9uIG9mIHRoZSBwYXJlbnQgbm9kZSBjaGFuZ2VzKTxicj5cbiAgICAgKiBDdXN0b20gY29vcmRpbmF0ZXMgKG1vdmluZyB3aXRoIHRoZSBwb3NpdGlvbiBvZiBhIGN1c3RvbSBub2RlKVxuICAgICAqICEjemgg6YCJ5oup57KS5a2Q57O757uf5omA5Zyo55qE5Z2Q5qCH57O7PGJyPlxuICAgICAqIOS4lueVjOWdkOagh++8iOS4jemaj+WFtuS7lueJqeS9k+S9jee9ruaUueWPmOiAjOWPmOaNou+8iTxicj5cbiAgICAgKiDlsYDpg6jlnZDmoIfvvIjot5/pmo/niLboioLngrnkvY3nva7mlLnlj5jogIznp7vliqjvvIk8YnI+XG4gICAgICog6Ieq5a6a5Z2Q5qCH77yI6Lef6ZqP6Ieq5a6a5LmJ6IqC54K555qE5L2N572u5pS55Y+Y6ICM56e75Yqo77yJXG4gICAgICogQHByb3BlcnR5IHtTcGFjZX0gc2ltdWxhdGlvblNwYWNlXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogU3BhY2UsXG4gICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgfSlcbiAgICBnZXQgc2ltdWxhdGlvblNwYWNlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NpbXVsYXRpb25TcGFjZTtcbiAgICB9XG5cbiAgICBzZXQgc2ltdWxhdGlvblNwYWNlICh2YWwpIHtcbiAgICAgICAgaWYgKHZhbCAhPT0gdGhpcy5fc2ltdWxhdGlvblNwYWNlKSB7XG4gICAgICAgICAgICB0aGlzLl9zaW11bGF0aW9uU3BhY2UgPSB2YWw7XG4gICAgICAgICAgICB0aGlzLl9hc3NlbWJsZXIuX3VwZGF0ZU1hdGVyaWFsUGFyYW1zKCk7XG4gICAgICAgICAgICB0aGlzLl9hc3NlbWJsZXIuX3VwZGF0ZVRyYWlsTWF0ZXJpYWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQ29udHJvbGxpbmcgdGhlIHVwZGF0ZSBzcGVlZCBvZiB0aGUgZW50aXJlIHBhcnRpY2xlIHN5c3RlbS5cbiAgICAgKiAhI3poIOaOp+WItuaVtOS4queykuWtkOezu+e7n+eahOabtOaWsOmAn+W6puOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBzaW11bGF0aW9uU3BlZWRcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBzaW11bGF0aW9uU3BlZWQgPSAxLjA7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIERlbGF5IHBhcnRpY2xlIGVtaXNzaW9uIHRpbWUgYWZ0ZXIgcGFydGljbGUgc3lzdGVtIHN0YXJ0cyBydW5uaW5nLlxuICAgICAqICEjemgg57KS5a2Q57O757uf5byA5aeL6L+Q6KGM5ZCO77yM5bu26L+f57KS5a2Q5Y+R5bCE55qE5pe26Ze044CCXG4gICAgICogQHByb3BlcnR5IHtDdXJ2ZVJhbmdlfSBzdGFydERlbGF5XG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogQ3VydmVSYW5nZSxcbiAgICB9KVxuICAgIHN0YXJ0RGVsYXkgPSBuZXcgQ3VydmVSYW5nZSgpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXJ0aWNsZSBsaWZlIGN5Y2xl44CCXG4gICAgICogISN6aCDnspLlrZDnlJ/lkb3lkajmnJ/jgIJcbiAgICAgKiBAcHJvcGVydHkge0N1cnZlUmFuZ2V9IHN0YXJ0TGlmZXRpbWVcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBDdXJ2ZVJhbmdlLFxuICAgIH0pXG4gICAgc3RhcnRMaWZldGltZSA9IG5ldyBDdXJ2ZVJhbmdlKCk7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBhcnRpY2xlIGluaXRpYWwgY29sb3JcbiAgICAgKiAhI3poIOeykuWtkOWIneWni+minOiJslxuICAgICAqIEBwcm9wZXJ0eSB7R3JhZGllbnRSYW5nZX0gc3RhcnRDb2xvclxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IEdyYWRpZW50UmFuZ2UsXG4gICAgfSlcbiAgICBzdGFydENvbG9yID0gbmV3IEdyYWRpZW50UmFuZ2UoKTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gUGFydGljbGUgc2NhbGUgc3BhY2VcbiAgICAgKiAhI3poIOe8qeaUvuepuumXtFxuICAgICAqIEBwcm9wZXJ0eSB7U3BhY2V9IHNjYWxlU3BhY2VcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBTcGFjZSxcbiAgICB9KVxuICAgIHNjYWxlU3BhY2UgPSBTcGFjZS5Mb2NhbDtcblxuICAgIC8qKlxuICAgICAqICEjZW4gSW5pdGlhbCBwYXJ0aWNsZSBzaXplXG4gICAgICogISN6aCDnspLlrZDliJ3lp4vlpKflsI9cbiAgICAgKiBAcHJvcGVydHkge0N1cnZlUmFuZ2V9IHN0YXJ0U2l6ZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IEN1cnZlUmFuZ2UsXG4gICAgfSlcbiAgICBzdGFydFNpemUgPSBuZXcgQ3VydmVSYW5nZSgpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBJbml0aWFsIHBhcnRpY2xlIHNwZWVkXG4gICAgICogISN6aCDnspLlrZDliJ3lp4vpgJ/luqZcbiAgICAgKiBAcHJvcGVydHkge0N1cnZlUmFuZ2V9IHN0YXJ0U3BlZWRcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBDdXJ2ZVJhbmdlLFxuICAgICAgICByYW5nZTogWy0xLCAxXSxcbiAgICB9KVxuICAgIHN0YXJ0U3BlZWQgPSBuZXcgQ3VydmVSYW5nZSgpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXJ0aWNsZSBpbml0aWFsIHJvdGF0aW9uIGFuZ2xlXG4gICAgICogISN6aCDnspLlrZDliJ3lp4vml4vovazop5LluqZcbiAgICAgKiBAcHJvcGVydHkge0N1cnZlUmFuZ2V9IHN0YXJ0Um90YXRpb25cbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBDdXJ2ZVJhbmdlLFxuICAgICAgICByYW5nZTogWy0xLCAxXSxcbiAgICAgICAgcmFkaWFuOiB0cnVlLFxuICAgIH0pXG4gICAgc3RhcnRSb3RhdGlvbiA9IG5ldyBDdXJ2ZVJhbmdlKCk7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdyYXZpdHkgY29lZmZpY2llbnQgb2YgcGFydGljbGVzIGFmZmVjdGVkIGJ5IGdyYXZpdHlcbiAgICAgKiAhI3poIOeykuWtkOWPl+mHjeWKm+W9seWTjeeahOmHjeWKm+ezu+aVsFxuICAgICAqIEBwcm9wZXJ0eSB7Q3VydmVSYW5nZX0gZ3Jhdml0eU1vZGlmaWVyXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogQ3VydmVSYW5nZSxcbiAgICAgICAgcmFuZ2U6IFstMSwgMV0sXG4gICAgfSlcbiAgICBncmF2aXR5TW9kaWZpZXIgPSBuZXcgQ3VydmVSYW5nZSgpO1xuXG4gICAgLy8gZW1pc3Npb24gbW9kdWxlXG4gICAgLyoqXG4gICAgICogISNlbiBQYXJ0aWNsZXMgZW1pdHRlZCBwZXIgc2Vjb25kXG4gICAgICogISN6aCDmr4/np5Llj5HlsITnmoTnspLlrZDmlbBcbiAgICAgKiBAcHJvcGVydHkge0N1cnZlUmFuZ2V9IHJhdGVPdmVyVGltZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IEN1cnZlUmFuZ2UsXG4gICAgfSlcbiAgICByYXRlT3ZlclRpbWUgPSBuZXcgQ3VydmVSYW5nZSgpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBOdW1iZXIgb2YgcGFydGljbGVzIGVtaXR0ZWQgcGVyIHVuaXQgZGlzdGFuY2UgbW92ZWRcbiAgICAgKiAhI3poIOavj+enu+WKqOWNleS9jei3neemu+WPkeWwhOeahOeykuWtkOaVsFxuICAgICAqIEBwcm9wZXJ0eSB7Q3VydmVSYW5nZX0gcmF0ZU92ZXJEaXN0YW5jZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IEN1cnZlUmFuZ2UsXG4gICAgfSlcbiAgICByYXRlT3ZlckRpc3RhbmNlID0gbmV3IEN1cnZlUmFuZ2UoKTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG51bWJlciBvZiBCcnVzdHMgdGhhdCBlbWl0IGEgc3BlY2lmaWVkIG51bWJlciBvZiBwYXJ0aWNsZXMgYXQgYSBzcGVjaWZpZWQgdGltZVxuICAgICAqICEjemgg6K6+5a6a5Zyo5oyH5a6a5pe26Ze05Y+R5bCE5oyH5a6a5pWw6YeP55qE57KS5a2Q55qEIEJydXN0IOeahOaVsOmHj1xuICAgICAqIEBwcm9wZXJ0eSB7W0J1cnN0XX0gYnVyc3RzXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogW0J1cnN0XSxcbiAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICB9KVxuICAgIGJ1cnN0cyA9IG5ldyBBcnJheSgpO1xuXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogW01hdGVyaWFsXSxcbiAgICAgICAgZGlzcGxheU5hbWU6ICdNYXRlcmlhbHMnLFxuICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgb3ZlcnJpZGU6IHRydWUsXG4gICAgfSlcbiAgICBnZXQgbWF0ZXJpYWxzICgpIHtcbiAgICAgICAgLy8gaWYgd2UgZG9uJ3QgY3JlYXRlIGFuIGFycmF5IGNvcHksIHRoZSBlZGl0b3Igd2lsbCBtb2RpZnkgdGhlIG9yaWdpbmFsIGFycmF5IGRpcmVjdGx5LlxuICAgICAgICByZXR1cm4gdGhpcy5fbWF0ZXJpYWxzO1xuICAgIH1cblxuICAgIHNldCBtYXRlcmlhbHMgKHZhbCkge1xuICAgICAgICB0aGlzLl9tYXRlcmlhbHMgPSB2YWw7XG4gICAgICAgIHRoaXMuX2FjdGl2YXRlTWF0ZXJpYWwoKTtcbiAgICB9XG5cbiAgICBAcHJvcGVydHlcbiAgICAvLyBzaHBhZSBtb2R1bGVcbiAgICBfc2hhcGVNb2R1bGUgPSBuZXcgU2hhcGVNb2R1bGUoKTtcbiAgICAvKipcbiAgICAgKiAhI2VuIFBhcnRpY2xlIGVtaXR0ZXIgbW9kdWxlXG4gICAgICogISN6aCDnspLlrZDlj5HlsITlmajmqKHlnZdcbiAgICAgKiBAcHJvcGVydHkge1NoYXBlTW9kdWxlfSBzaGFwZU1vZHVsZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IFNoYXBlTW9kdWxlLFxuICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgIH0pXG4gICAgZ2V0IHNoYXBlTW9kdWxlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXBlTW9kdWxlO1xuICAgIH1cbiAgICBzZXQgc2hhcGVNb2R1bGUgKHZhbCkge1xuICAgICAgICB0aGlzLl9zaGFwZU1vZHVsZSA9IHZhbDtcbiAgICAgICAgdGhpcy5fc2hhcGVNb2R1bGUub25Jbml0KHRoaXMpO1xuICAgIH1cblxuICAgIEBwcm9wZXJ0eVxuICAgIC8vIGNvbG9yIG92ZXIgbGlmZXRpbWUgbW9kdWxlXG4gICAgX2NvbG9yT3ZlckxpZmV0aW1lTW9kdWxlID0gbmV3IENvbG9yT3ZlckxpZmV0aW1lTW9kdWxlKCk7XG4gICAgLyoqXG4gICAgICogISNlbiBDb2xvciBjb250cm9sIG1vZHVsZVxuICAgICAqICEjemgg6aKc6Imy5o6n5Yi25qih5Z2XXG4gICAgICogQHByb3BlcnR5IHtDb2xvck92ZXJMaWZldGltZU1vZHVsZX0gY29sb3JPdmVyTGlmZXRpbWVNb2R1bGVcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBDb2xvck92ZXJMaWZldGltZU1vZHVsZSxcbiAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICB9KVxuICAgIGdldCBjb2xvck92ZXJMaWZldGltZU1vZHVsZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb2xvck92ZXJMaWZldGltZU1vZHVsZTtcbiAgICB9XG4gICAgc2V0IGNvbG9yT3ZlckxpZmV0aW1lTW9kdWxlICh2YWwpIHtcbiAgICAgICAgdGhpcy5fY29sb3JPdmVyTGlmZXRpbWVNb2R1bGUgPSB2YWw7XG4gICAgfVxuXG4gICAgQHByb3BlcnR5XG4gICAgLy8gc2l6ZSBvdmVyIGxpZmV0aW1lIG1vZHVsZVxuICAgIF9zaXplT3ZlcnRpbWVNb2R1bGUgPSBuZXcgU2l6ZU92ZXJ0aW1lTW9kdWxlKCk7XG4gICAgLyoqXG4gICAgICogISNlbiBQYXJ0aWNsZSBzaXplIG1vZHVsZVxuICAgICAqICEjemgg57KS5a2Q5aSn5bCP5qih5Z2XXG4gICAgICogQHByb3BlcnR5IHtTaXplT3ZlcnRpbWVNb2R1bGV9IHNpemVPdmVydGltZU1vZHVsZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IFNpemVPdmVydGltZU1vZHVsZSxcbiAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICB9KVxuICAgIGdldCBzaXplT3ZlcnRpbWVNb2R1bGUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2l6ZU92ZXJ0aW1lTW9kdWxlO1xuICAgIH1cbiAgICBzZXQgc2l6ZU92ZXJ0aW1lTW9kdWxlICh2YWwpIHtcbiAgICAgICAgdGhpcy5fc2l6ZU92ZXJ0aW1lTW9kdWxlID0gdmFsO1xuICAgIH1cblxuICAgIEBwcm9wZXJ0eVxuICAgIF92ZWxvY2l0eU92ZXJ0aW1lTW9kdWxlID0gbmV3IFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUoKTtcbiAgICAvKipcbiAgICAgKiAhI2VuIFBhcnRpY2xlIHNwZWVkIG1vZHVsZVxuICAgICAqICEjemgg57KS5a2Q6YCf5bqm5qih5Z2XXG4gICAgICogQHByb3BlcnR5IHtWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlfSB2ZWxvY2l0eU92ZXJ0aW1lTW9kdWxlXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogVmVsb2NpdHlPdmVydGltZU1vZHVsZSxcbiAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICB9KVxuICAgIGdldCB2ZWxvY2l0eU92ZXJ0aW1lTW9kdWxlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZlbG9jaXR5T3ZlcnRpbWVNb2R1bGU7XG4gICAgfVxuXG4gICAgc2V0IHZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUgKHZhbCkge1xuICAgICAgICB0aGlzLl92ZWxvY2l0eU92ZXJ0aW1lTW9kdWxlID0gdmFsO1xuICAgIH1cblxuICAgIEBwcm9wZXJ0eVxuICAgIF9mb3JjZU92ZXJ0aW1lTW9kdWxlID0gbmV3IEZvcmNlT3ZlcnRpbWVNb2R1bGUoKTtcbiAgICAvKipcbiAgICAgKiAhI2VuIFBhcnRpY2xlIGFjY2VsZXJhdGlvbiBtb2R1bGVcbiAgICAgKiAhI3poIOeykuWtkOWKoOmAn+W6puaooeWdl1xuICAgICAqIEBwcm9wZXJ0eSB7Rm9yY2VPdmVydGltZU1vZHVsZX0gZm9yY2VPdmVydGltZU1vZHVsZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IEZvcmNlT3ZlcnRpbWVNb2R1bGUsXG4gICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgfSlcbiAgICBnZXQgZm9yY2VPdmVydGltZU1vZHVsZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mb3JjZU92ZXJ0aW1lTW9kdWxlO1xuICAgIH1cbiAgICBzZXQgZm9yY2VPdmVydGltZU1vZHVsZSAodmFsKSB7XG4gICAgICAgIHRoaXMuX2ZvcmNlT3ZlcnRpbWVNb2R1bGUgPSB2YWw7XG4gICAgfVxuXG4gICAgQHByb3BlcnR5XG4gICAgX2xpbWl0VmVsb2NpdHlPdmVydGltZU1vZHVsZSA9IG5ldyBMaW1pdFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUoKTtcbiAgICAvKipcbiAgICAgKiAhI2VuIFBhcnRpY2xlIGxpbWl0IHNwZWVkIG1vZHVsZSAob25seSBDUFUgcGFydGljbGVzIGFyZSBzdXBwb3J0ZWQpXG4gICAgICogISN6aCDnspLlrZDpmZDliLbpgJ/luqbmqKHlnZfvvIjlj6rmlK/mjIEgQ1BVIOeykuWtkO+8iVxuICAgICAqIEBwcm9wZXJ0eSB7TGltaXRWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlfSBsaW1pdFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGVcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBMaW1pdFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUsXG4gICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgfSlcbiAgICBnZXQgbGltaXRWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpbWl0VmVsb2NpdHlPdmVydGltZU1vZHVsZTtcbiAgICB9XG4gICAgc2V0IGxpbWl0VmVsb2NpdHlPdmVydGltZU1vZHVsZSAodmFsKSB7XG4gICAgICAgIHRoaXMuX2xpbWl0VmVsb2NpdHlPdmVydGltZU1vZHVsZSA9IHZhbDtcbiAgICB9XG5cbiAgICBAcHJvcGVydHlcbiAgICBfcm90YXRpb25PdmVydGltZU1vZHVsZSA9IG5ldyBSb3RhdGlvbk92ZXJ0aW1lTW9kdWxlKCk7XG4gICAgLyoqXG4gICAgICogISNlbiBQYXJ0aWNsZSByb3RhdGlvbiBtb2R1bGVcbiAgICAgKiAhI3poIOeykuWtkOaXi+i9rOaooeWdl1xuICAgICAqIEBwcm9wZXJ0eSB7Um90YXRpb25PdmVydGltZU1vZHVsZX0gcm90YXRpb25PdmVydGltZU1vZHVsZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IFJvdGF0aW9uT3ZlcnRpbWVNb2R1bGUsXG4gICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgfSlcbiAgICBnZXQgcm90YXRpb25PdmVydGltZU1vZHVsZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yb3RhdGlvbk92ZXJ0aW1lTW9kdWxlO1xuICAgIH1cbiAgICBzZXQgcm90YXRpb25PdmVydGltZU1vZHVsZSAodmFsKSB7XG4gICAgICAgIHRoaXMuX3JvdGF0aW9uT3ZlcnRpbWVNb2R1bGUgPSB2YWw7XG4gICAgfVxuXG4gICAgQHByb3BlcnR5XG4gICAgX3RleHR1cmVBbmltYXRpb25Nb2R1bGUgPSBuZXcgVGV4dHVyZUFuaW1hdGlvbk1vZHVsZSgpO1xuICAgIC8qKlxuICAgICAqICEjZW4gVGV4dHVyZSBBbmltYXRpb24gTW9kdWxlXG4gICAgICogISN6aCDotLTlm77liqjnlLvmqKHlnZdcbiAgICAgKiBAcHJvcGVydHkge1RleHR1cmVBbmltYXRpb25Nb2R1bGV9IHRleHR1cmVBbmltYXRpb25Nb2R1bGVcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBUZXh0dXJlQW5pbWF0aW9uTW9kdWxlLFxuICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgIH0pXG4gICAgZ2V0IHRleHR1cmVBbmltYXRpb25Nb2R1bGUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dHVyZUFuaW1hdGlvbk1vZHVsZTtcbiAgICB9XG4gICAgc2V0IHRleHR1cmVBbmltYXRpb25Nb2R1bGUgKHZhbCkge1xuICAgICAgICB0aGlzLl90ZXh0dXJlQW5pbWF0aW9uTW9kdWxlID0gdmFsO1xuICAgICAgICB0aGlzLl90ZXh0dXJlQW5pbWF0aW9uTW9kdWxlLm9uSW5pdCh0aGlzKTtcbiAgICB9XG5cbiAgICBAcHJvcGVydHlcbiAgICBfdHJhaWxNb2R1bGUgPSBuZXcgVHJhaWxNb2R1bGUoKTtcbiAgICAvKipcbiAgICAgKiAhI2VuIFBhcnRpY2xlIFRyYWplY3RvcnkgTW9kdWxlXG4gICAgICogISN6aCDnspLlrZDovajov7nmqKHlnZdcbiAgICAgKiBAcHJvcGVydHkge1RyYWlsTW9kdWxlfSB0cmFpbE1vZHVsZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IFRyYWlsTW9kdWxlLFxuICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgIH0pXG4gICAgZ2V0IHRyYWlsTW9kdWxlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYWlsTW9kdWxlO1xuICAgIH1cbiAgICBzZXQgdHJhaWxNb2R1bGUgKHZhbCkge1xuICAgICAgICB0aGlzLl90cmFpbE1vZHVsZSA9IHZhbDtcbiAgICAgICAgdGhpcy5fdHJhaWxNb2R1bGUub25Jbml0KHRoaXMpO1xuICAgIH1cblxuICAgIEBwcm9wZXJ0eVxuICAgIF9yZW5kZXJNb2RlID0gUmVuZGVyTW9kZS5CaWxsYm9hcmQ7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBhcnRpY2xlIGdlbmVyYXRpb24gbW9kZVxuICAgICAqICEjemgg6K6+5a6a57KS5a2Q55Sf5oiQ5qih5byPXG4gICAgICogQHByb3BlcnR5IHtSZW5kZXJNb2RlfSByZW5kZXJNb2RlXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogUmVuZGVyTW9kZSxcbiAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICB9KVxuICAgIGdldCByZW5kZXJNb2RlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlck1vZGU7XG4gICAgfVxuXG4gICAgc2V0IHJlbmRlck1vZGUgKHZhbCkge1xuICAgICAgICBpZiAodGhpcy5fcmVuZGVyTW9kZSA9PT0gdmFsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcmVuZGVyTW9kZSA9IHZhbDtcbiAgICAgICAgdGhpcy5fYXNzZW1ibGVyLl9zZXRWZXJ0ZXhBdHRyaWIoKTtcbiAgICAgICAgdGhpcy5fYXNzZW1ibGVyLl91cGRhdGVNb2RlbCgpO1xuICAgICAgICB0aGlzLl9hc3NlbWJsZXIuX3VwZGF0ZU1hdGVyaWFsUGFyYW1zKCk7XG4gICAgfVxuXG4gICAgQHByb3BlcnR5XG4gICAgX3ZlbG9jaXR5U2NhbGUgPSAxO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBXaGVuIHRoZSBwYXJ0aWNsZSBnZW5lcmF0aW9uIG1vZGUgaXMgU3RyZWN0aGVkQmlsbGJvYXJkLCBpbiB0aGUgZGlyZWN0aW9uIG9mIG1vdmVtZW50IG9mIHRoZSBwYXJ0aWNsZXMgaXMgc3RyZXRjaGVkIGJ5IHZlbG9jaXR5IG1hZ25pdHVkZVxuICAgICAqICEjemgg5Zyo57KS5a2Q55Sf5oiQ5pa55byP5Li6IFN0cmVjdGhlZEJpbGxib2FyZCDml7Ys5a+557KS5a2Q5Zyo6L+Q5Yqo5pa55ZCR5LiK5oyJ6YCf5bqm5aSn5bCP6L+b6KGM5ouJ5Ly4XG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHZlbG9jaXR5U2NhbGVcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgIH0pXG4gICAgZ2V0IHZlbG9jaXR5U2NhbGUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmVsb2NpdHlTY2FsZTtcbiAgICB9XG5cbiAgICBzZXQgdmVsb2NpdHlTY2FsZSAodmFsKSB7XG4gICAgICAgIHRoaXMuX3ZlbG9jaXR5U2NhbGUgPSB2YWw7XG4gICAgICAgIHRoaXMuX2Fzc2VtYmxlci5fdXBkYXRlTWF0ZXJpYWxQYXJhbXMoKTtcbiAgICB9XG5cbiAgICBAcHJvcGVydHlcbiAgICBfbGVuZ3RoU2NhbGUgPSAxO1xuICAgIC8qKlxuICAgICAqICEjZW4gV2hlbiB0aGUgcGFydGljbGUgZ2VuZXJhdGlvbiBtZXRob2QgaXMgU3RyZWN0aGVkQmlsbGJvYXJkLCB0aGUgcGFydGljbGVzIGFyZSBzdHJldGNoZWQgYWNjb3JkaW5nIHRvIHRoZSBwYXJ0aWNsZSBzaXplIGluIHRoZSBkaXJlY3Rpb24gb2YgbW90aW9uXG4gICAgICogISN6aCDlnKjnspLlrZDnlJ/miJDmlrnlvI/kuLogU3RyZWN0aGVkQmlsbGJvYXJkIOaXtizlr7nnspLlrZDlnKjov5DliqjmlrnlkJHkuIrmjInnspLlrZDlpKflsI/ov5vooYzmi4nkvLhcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbGVuZ3RoU2NhbGVcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgIH0pXG4gICAgZ2V0IGxlbmd0aFNjYWxlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xlbmd0aFNjYWxlO1xuICAgIH1cblxuICAgIHNldCBsZW5ndGhTY2FsZSAodmFsKSB7XG4gICAgICAgIHRoaXMuX2xlbmd0aFNjYWxlID0gdmFsO1xuICAgICAgICB0aGlzLl9hc3NlbWJsZXIuX3VwZGF0ZU1hdGVyaWFsUGFyYW1zKCk7XG4gICAgfVxuXG4gICAgQHByb3BlcnR5XG4gICAgX21lc2ggPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXJ0aWNsZSBtb2RlbFxuICAgICAqICEjemgg57KS5a2Q5qih5Z6LXG4gICAgICogQHByb3BlcnR5IHtNZXNofSBtZXNoXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogTWVzaCxcbiAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICB9KVxuICAgIGdldCBtZXNoICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21lc2g7XG4gICAgfVxuXG4gICAgc2V0IG1lc2ggKHZhbCkge1xuICAgICAgICB0aGlzLl9tZXNoID0gdmFsO1xuICAgICAgICB0aGlzLl9hc3NlbWJsZXIuX3VwZGF0ZU1vZGVsKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXJ0aWNsZSBtYXRlcmlhbFxuICAgICAqICEjemgg57KS5a2Q5p2Q6LSoXG4gICAgICogQHByb3BlcnR5IHtNYXRlcmlhbH0gcGFydGljbGVNYXRlcmlhbFxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IE1hdGVyaWFsLFxuICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgIH0pXG4gICAgZ2V0IHBhcnRpY2xlTWF0ZXJpYWwgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRNYXRlcmlhbCgwKTtcbiAgICB9XG5cbiAgICBzZXQgcGFydGljbGVNYXRlcmlhbCAodmFsKSB7XG4gICAgICAgIHRoaXMuc2V0TWF0ZXJpYWwoMCwgdmFsKTtcbiAgICAgICAgdGhpcy5fb25NYXRlcmlhbE1vZGlmaWVkKDAsIHZhbCk7XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqICEjZW4gUGFydGljbGUgdHJhaWwgbWF0ZXJpYWxcbiAgICAgKiAhI3poIOeykuWtkOi9qOi/ueadkOi0qFxuICAgICAqIEBwcm9wZXJ0eSB7TWF0ZXJpYWx9IHRyYWlsTWF0ZXJpYWxcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBNYXRlcmlhbCxcbiAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICB9KVxuICAgIGdldCB0cmFpbE1hdGVyaWFsICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TWF0ZXJpYWwoMSk7XG4gICAgfVxuXG4gICAgc2V0IHRyYWlsTWF0ZXJpYWwgKHZhbCkge1xuICAgICAgICB0aGlzLnNldE1hdGVyaWFsKDEsIHZhbCk7XG4gICAgICAgIHRoaXMuX29uTWF0ZXJpYWxNb2RpZmllZCgxLCB2YWwpO1xuICAgIH1cblxuICAgIF9pc1BsYXlpbmc7XG4gICAgX2lzUGF1c2VkO1xuICAgIF9pc1N0b3BwZWQ7XG4gICAgX2lzRW1pdHRpbmc7XG4gICAgX3RpbWU7ICAvLyBwbGF5YmFjayBwb3NpdGlvbiBpbiBzZWNvbmRzLlxuICAgIF9lbWl0UmF0ZVRpbWVDb3VudGVyO1xuICAgIF9lbWl0UmF0ZURpc3RhbmNlQ291bnRlcjtcbiAgICBfb2xkV1BvcztcbiAgICBfY3VyV1BvcztcbiAgICBfY3VzdG9tRGF0YTE7XG4gICAgX2N1c3RvbURhdGEyO1xuICAgIF9zdWJFbWl0dGVyczsgLy8gYXJyYXkgb2YgeyBlbWl0dGVyOiBQYXJ0aWNsZVN5c3RlbTNELCB0eXBlOiAnYmlydGgnLCAnY29sbGlzaW9uJyBvciAnZGVhdGgnfVxuXG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMucmF0ZU92ZXJUaW1lLmNvbnN0YW50ID0gMTA7XG4gICAgICAgIHRoaXMuc3RhcnRMaWZldGltZS5jb25zdGFudCA9IDU7XG4gICAgICAgIHRoaXMuc3RhcnRTaXplLmNvbnN0YW50ID0gMTtcbiAgICAgICAgdGhpcy5zdGFydFNwZWVkLmNvbnN0YW50ID0gNTtcblxuICAgICAgICAvLyBpbnRlcm5hbCBzdGF0dXNcbiAgICAgICAgdGhpcy5faXNQbGF5aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2lzUGF1c2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2lzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX2lzRW1pdHRpbmcgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLl90aW1lID0gMC4wOyAgLy8gcGxheWJhY2sgcG9zaXRpb24gaW4gc2Vjb25kcy5cbiAgICAgICAgdGhpcy5fZW1pdFJhdGVUaW1lQ291bnRlciA9IDAuMDtcbiAgICAgICAgdGhpcy5fZW1pdFJhdGVEaXN0YW5jZUNvdW50ZXIgPSAwLjA7XG4gICAgICAgIHRoaXMuX29sZFdQb3MgPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICAgICAgdGhpcy5fY3VyV1BvcyA9IG5ldyBWZWMzKDAsIDAsIDApO1xuXG4gICAgICAgIHRoaXMuX2N1c3RvbURhdGExID0gbmV3IFZlYzIoMCwgMCk7XG4gICAgICAgIHRoaXMuX2N1c3RvbURhdGEyID0gbmV3IFZlYzIoMCwgMCk7XG5cbiAgICAgICAgdGhpcy5fc3ViRW1pdHRlcnMgPSBbXTsgLy8gYXJyYXkgb2YgeyBlbWl0dGVyOiBQYXJ0aWNsZVN5c3RlbUNvbXBvbmVudCwgdHlwZTogJ2JpcnRoJywgJ2NvbGxpc2lvbicgb3IgJ2RlYXRoJ31cbiAgICB9XG5cbiAgICBvbkxvYWQgKCkge1xuICAgICAgICB0aGlzLl9hc3NlbWJsZXIub25Jbml0KHRoaXMpO1xuICAgICAgICB0aGlzLnNoYXBlTW9kdWxlLm9uSW5pdCh0aGlzKTtcbiAgICAgICAgdGhpcy50cmFpbE1vZHVsZS5vbkluaXQodGhpcyk7XG4gICAgICAgIHRoaXMudGV4dHVyZUFuaW1hdGlvbk1vZHVsZS5vbkluaXQodGhpcyk7XG5cbiAgICAgICAgdGhpcy5fcmVzZXRQb3NpdGlvbigpO1xuXG4gICAgICAgIC8vIHRoaXMuX3N5c3RlbS5hZGQodGhpcyk7XG4gICAgfVxuXG4gICAgX29uTWF0ZXJpYWxNb2RpZmllZCAoaW5kZXgsIG1hdGVyaWFsKSB7XG4gICAgICAgIHRoaXMuX2Fzc2VtYmxlci5fb25NYXRlcmlhbE1vZGlmaWVkKGluZGV4LCBtYXRlcmlhbCk7XG4gICAgfVxuXG4gICAgX29uUmVidWlsZFBTTyAoaW5kZXgsIG1hdGVyaWFsKSB7XG4gICAgICAgIHRoaXMuX2Fzc2VtYmxlci5fb25SZWJ1aWxkUFNPKGluZGV4LCBtYXRlcmlhbCk7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogZmFzdGZvcndhcmQgY3VycmVudCBwYXJ0aWNsZSBzeXN0ZW0gYnkgc2ltdWxhdGluZyBwYXJ0aWNsZXMgb3ZlciBnaXZlbiBwZXJpb2Qgb2YgdGltZSwgdGhlbiBwYXVzZSBpdC5cbiAgICAvLyBzaW11bGF0ZSh0aW1lLCB3aXRoQ2hpbGRyZW4sIHJlc3RhcnQsIGZpeGVkVGltZVN0ZXApIHtcblxuICAgIC8vIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gUGxheWluZyBwYXJ0aWNsZSBlZmZlY3RzXG4gICAgICogISN6aCDmkq3mlL7nspLlrZDmlYjmnpxcbiAgICAgKiBAbWV0aG9kIHBsYXlcbiAgICAgKi9cbiAgICBwbGF5ICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzUGF1c2VkKSB7XG4gICAgICAgICAgICB0aGlzLl9pc1BhdXNlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9pc1N0b3BwZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2lzU3RvcHBlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faXNQbGF5aW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5faXNFbWl0dGluZyA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5fcmVzZXRQb3NpdGlvbigpO1xuXG4gICAgICAgIC8vIHByZXdhcm1cbiAgICAgICAgaWYgKHRoaXMuX3ByZXdhcm0pIHtcbiAgICAgICAgICAgIHRoaXMuX3ByZXdhcm1TeXN0ZW0oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gUGF1c2UgcGFydGljbGUgZWZmZWN0XG4gICAgICogISN6aCDmmoLlgZzmkq3mlL7nspLlrZDmlYjmnpxcbiAgICAgKiBAbWV0aG9kIHBhdXNlXG4gICAgICovXG4gICAgcGF1c2UgKCkge1xuICAgICAgICBpZiAodGhpcy5faXNTdG9wcGVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ3BhdXNlKCk6IHBhcnRpY2xlIHN5c3RlbSBpcyBhbHJlYWR5IHN0b3BwZWQuJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2lzUGxheWluZykge1xuICAgICAgICAgICAgdGhpcy5faXNQbGF5aW5nID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9pc1BhdXNlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBTdG9wIHBhcnRpY2xlIGVmZmVjdFxuICAgICAqICEjemgg5YGc5q2i5pKt5pS+57KS5a2Q5pWI5p6cXG4gICAgICogQG1ldGhvZCBzdG9wXG4gICAgICovXG4gICAgc3RvcCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pc1BsYXlpbmcgfHwgdGhpcy5faXNQYXVzZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5faXNQbGF5aW5nKSB7XG4gICAgICAgICAgICB0aGlzLl9pc1BsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5faXNQYXVzZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2lzUGF1c2VkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl90aW1lID0gMC4wO1xuICAgICAgICB0aGlzLl9lbWl0UmF0ZVRpbWVDb3VudGVyID0gMC4wO1xuICAgICAgICB0aGlzLl9lbWl0UmF0ZURpc3RhbmNlQ291bnRlciA9IDAuMDtcblxuICAgICAgICB0aGlzLl9pc1N0b3BwZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSBhbGwgcGFydGljbGVzIGZyb20gY3VycmVudCBwYXJ0aWNsZSBzeXN0ZW0uXG4gICAgLyoqXG4gICAgICogISNlbiBSZW1vdmUgYWxsIHBhcnRpY2xlIGVmZmVjdFxuICAgICAqICEjemgg5bCG5omA5pyJ57KS5a2Q5LuO57KS5a2Q57O757uf5Lit5riF6ZmkXG4gICAgICogQG1ldGhvZCBjbGVhclxuICAgICAqL1xuICAgIGNsZWFyICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlZEluSGllcmFyY2h5KSB7XG4gICAgICAgICAgICB0aGlzLl9hc3NlbWJsZXIuY2xlYXIoKTtcbiAgICAgICAgICAgIHRoaXMudHJhaWxNb2R1bGUuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFBhcnRpY2xlQ291bnQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXNzZW1ibGVyLmdldFBhcnRpY2xlQ291bnQoKTtcbiAgICB9XG5cbiAgICBzZXRDdXN0b21EYXRhMSAoeCwgeSkge1xuICAgICAgICBWZWMyLnNldCh0aGlzLl9jdXN0b21EYXRhMSwgeCwgeSk7XG4gICAgfVxuXG4gICAgc2V0Q3VzdG9tRGF0YTIgKHgsIHkpIHtcbiAgICAgICAgVmVjMi5zZXQodGhpcy5fY3VzdG9tRGF0YTIsIHgsIHkpO1xuICAgIH1cblxuICAgIG9uRGVzdHJveSAoKSB7XG4gICAgICAgIC8vIHRoaXMuX3N5c3RlbS5yZW1vdmUodGhpcyk7XG4gICAgICAgIHRoaXMuX2Fzc2VtYmxlci5vbkRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy50cmFpbE1vZHVsZS5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgb25FbmFibGUgKCkge1xuICAgICAgICBzdXBlci5vbkVuYWJsZSgpO1xuICAgICAgICBpZiAodGhpcy5wbGF5T25Bd2FrZSkge1xuICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fYXNzZW1ibGVyLm9uRW5hYmxlKCk7XG4gICAgICAgIHRoaXMudHJhaWxNb2R1bGUub25FbmFibGUoKTtcbiAgICB9XG5cbiAgICBvbkRpc2FibGUgKCkge1xuICAgICAgICBzdXBlci5vbkRpc2FibGUoKTtcbiAgICAgICAgdGhpcy5fYXNzZW1ibGVyLm9uRGlzYWJsZSgpO1xuICAgICAgICB0aGlzLnRyYWlsTW9kdWxlLm9uRGlzYWJsZSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZSAoZHQpIHtcbiAgICAgICAgY29uc3Qgc2NhbGVkRGVsdGFUaW1lID0gZHQgKiB0aGlzLnNpbXVsYXRpb25TcGVlZDtcbiAgICAgICAgaWYgKHRoaXMuX2lzUGxheWluZykge1xuICAgICAgICAgICAgdGhpcy5fdGltZSArPSBzY2FsZWREZWx0YVRpbWU7XG5cbiAgICAgICAgICAgIC8vIGV4Y3V0ZSBlbWlzc2lvblxuICAgICAgICAgICAgdGhpcy5fZW1pdChzY2FsZWREZWx0YVRpbWUpO1xuXG4gICAgICAgICAgICAvLyBzaW11bGF0aW9uLCB1cGRhdGUgcGFydGljbGVzLlxuICAgICAgICAgICAgaWYgKHRoaXMuX2Fzc2VtYmxlci5fdXBkYXRlUGFydGljbGVzKHNjYWxlZERlbHRhVGltZSkgPT09IDAgJiYgIXRoaXMuX2lzRW1pdHRpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdXBkYXRlIHJlbmRlciBkYXRhXG4gICAgICAgICAgICB0aGlzLl9hc3NlbWJsZXIudXBkYXRlUGFydGljbGVCdWZmZXIoKTtcblxuICAgICAgICAgICAgLy8gdXBkYXRlIHRyYWlsXG4gICAgICAgICAgICBpZiAodGhpcy50cmFpbE1vZHVsZS5lbmFibGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYWlsTW9kdWxlLnVwZGF0ZVRyYWlsQnVmZmVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlbWl0IChjb3VudCwgZHQpIHtcblxuICAgICAgICBpZiAodGhpcy5fc2ltdWxhdGlvblNwYWNlID09PSBTcGFjZS5Xb3JsZCkge1xuICAgICAgICAgICAgdGhpcy5ub2RlLmdldFdvcmxkTWF0cml4KF93b3JsZF9tYXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJ0aWNsZSA9IHRoaXMuX2Fzc2VtYmxlci5fZ2V0RnJlZVBhcnRpY2xlKCk7XG4gICAgICAgICAgICBpZiAocGFydGljbGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCByYW5kID0gcHNldWRvUmFuZG9tKHJhbmRvbVJhbmdlSW50KDAsIElOVF9NQVgpKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuc2hhcGVNb2R1bGUuZW5hYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaGFwZU1vZHVsZS5lbWl0KHBhcnRpY2xlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIFZlYzMuc2V0KHBhcnRpY2xlLnBvc2l0aW9uLCAwLCAwLCAwKTtcbiAgICAgICAgICAgICAgICBWZWMzLmNvcHkocGFydGljbGUudmVsb2NpdHksIHBhcnRpY2xlRW1pdFpBeGlzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMudGV4dHVyZUFuaW1hdGlvbk1vZHVsZS5lbmFibGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRleHR1cmVBbmltYXRpb25Nb2R1bGUuaW5pdChwYXJ0aWNsZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFZlYzMuc2NhbGUocGFydGljbGUudmVsb2NpdHksIHBhcnRpY2xlLnZlbG9jaXR5LCB0aGlzLnN0YXJ0U3BlZWQuZXZhbHVhdGUodGhpcy5fdGltZSAvIHRoaXMuZHVyYXRpb24sIHJhbmQpKTtcblxuICAgICAgICAgICAgc3dpdGNoICh0aGlzLl9zaW11bGF0aW9uU3BhY2UpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFNwYWNlLkxvY2FsOlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFNwYWNlLldvcmxkOlxuICAgICAgICAgICAgICAgICAgICBWZWMzLnRyYW5zZm9ybU1hdDQocGFydGljbGUucG9zaXRpb24sIHBhcnRpY2xlLnBvc2l0aW9uLCBfd29ybGRfbWF0KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgd29ybGRSb3QgPSBuZXcgUXVhdCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuZ2V0V29ybGRSb3RhdGlvbih3b3JsZFJvdCk7XG4gICAgICAgICAgICAgICAgICAgIFZlYzMudHJhbnNmb3JtUXVhdChwYXJ0aWNsZS52ZWxvY2l0eSwgcGFydGljbGUudmVsb2NpdHksIHdvcmxkUm90KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBTcGFjZS5DdXN0b206XG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE86XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgVmVjMy5jb3B5KHBhcnRpY2xlLnVsdGltYXRlVmVsb2NpdHksIHBhcnRpY2xlLnZlbG9jaXR5KTtcbiAgICAgICAgICAgIC8vIGFwcGx5IHN0YXJ0Um90YXRpb24uIG5vdyAyRCBvbmx5LlxuICAgICAgICAgICAgVmVjMy5zZXQocGFydGljbGUucm90YXRpb24sIDAsIDAsIHRoaXMuc3RhcnRSb3RhdGlvbi5ldmFsdWF0ZSh0aGlzLl90aW1lIC8gdGhpcy5kdXJhdGlvbiwgcmFuZCkpO1xuXG4gICAgICAgICAgICAvLyBhcHBseSBzdGFydFNpemUuIG5vdyAyRCBvbmx5LlxuICAgICAgICAgICAgVmVjMy5zZXQocGFydGljbGUuc3RhcnRTaXplLCB0aGlzLnN0YXJ0U2l6ZS5ldmFsdWF0ZSh0aGlzLl90aW1lIC8gdGhpcy5kdXJhdGlvbiwgcmFuZCksIDEsIDEpO1xuICAgICAgICAgICAgcGFydGljbGUuc3RhcnRTaXplLnkgPSBwYXJ0aWNsZS5zdGFydFNpemUueDtcbiAgICAgICAgICAgIFZlYzMuY29weShwYXJ0aWNsZS5zaXplLCBwYXJ0aWNsZS5zdGFydFNpemUpO1xuXG4gICAgICAgICAgICAvLyBhcHBseSBzdGFydENvbG9yLlxuICAgICAgICAgICAgcGFydGljbGUuc3RhcnRDb2xvci5zZXQodGhpcy5zdGFydENvbG9yLmV2YWx1YXRlKHRoaXMuX3RpbWUgLyB0aGlzLmR1cmF0aW9uLCByYW5kKSk7XG4gICAgICAgICAgICBwYXJ0aWNsZS5jb2xvci5zZXQocGFydGljbGUuc3RhcnRDb2xvcik7XG5cbiAgICAgICAgICAgIC8vIGFwcGx5IHN0YXJ0TGlmZXRpbWUuXG4gICAgICAgICAgICBwYXJ0aWNsZS5zdGFydExpZmV0aW1lID0gdGhpcy5zdGFydExpZmV0aW1lLmV2YWx1YXRlKHRoaXMuX3RpbWUgLyB0aGlzLmR1cmF0aW9uLCByYW5kKSArIGR0O1xuICAgICAgICAgICAgcGFydGljbGUucmVtYWluaW5nTGlmZXRpbWUgPSBwYXJ0aWNsZS5zdGFydExpZmV0aW1lO1xuXG4gICAgICAgICAgICBwYXJ0aWNsZS5yYW5kb21TZWVkID0gcmFuZG9tUmFuZ2VJbnQoMCwgMjMzMjgwKTtcblxuICAgICAgICAgICAgdGhpcy5fYXNzZW1ibGVyLl9zZXROZXdQYXJ0aWNsZShwYXJ0aWNsZSk7XG5cbiAgICAgICAgfSAvLyBlbmQgb2YgcGFydGljbGVzIGZvckxvb3AuXG4gICAgfVxuXG4gICAgLy8gaW5pdGlhbGl6ZSBwYXJ0aWNsZSBzeXN0ZW0gYXMgdGhvdWdoIGl0IGhhZCBhbHJlYWR5IGNvbXBsZXRlZCBhIGZ1bGwgY3ljbGUuXG4gICAgX3ByZXdhcm1TeXN0ZW0gKCkge1xuICAgICAgICB0aGlzLnN0YXJ0RGVsYXkubW9kZSA9IE1vZGUuQ29uc3RhbnQ7IC8vIGNsZWFyIHN0YXJ0RGVsYXkuXG4gICAgICAgIHRoaXMuc3RhcnREZWxheS5jb25zdGFudCA9IDA7XG4gICAgICAgIGNvbnN0IGR0ID0gMS4wOyAvLyBzaG91bGQgdXNlIHZhcnlpbmcgdmFsdWU/XG4gICAgICAgIGNvbnN0IGNudCA9IHRoaXMuZHVyYXRpb24gLyBkdDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbnQ7ICsraSkge1xuICAgICAgICAgICAgdGhpcy5fdGltZSArPSBkdDtcbiAgICAgICAgICAgIHRoaXMuX2VtaXQoZHQpO1xuICAgICAgICAgICAgdGhpcy5fYXNzZW1ibGVyLl91cGRhdGVQYXJ0aWNsZXMoZHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gaW50ZXJuYWwgZnVuY3Rpb25cbiAgICBfZW1pdCAoZHQpIHtcbiAgICAgICAgLy8gZW1pdCBwYXJ0aWNsZXMuXG4gICAgICAgIGNvbnN0IHN0YXJ0RGVsYXkgPSB0aGlzLnN0YXJ0RGVsYXkuZXZhbHVhdGUoMCwgMSk7XG4gICAgICAgIGlmICh0aGlzLl90aW1lID4gc3RhcnREZWxheSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3RpbWUgPiAodGhpcy5kdXJhdGlvbiArIHN0YXJ0RGVsYXkpKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5fdGltZSA9IHN0YXJ0RGVsYXk7IC8vIGRlbGF5IHdpbGwgbm90IGJlIGFwcGxpZWQgZnJvbSB0aGUgc2Vjb25kIGxvb3AuKFVuaXR5KVxuICAgICAgICAgICAgICAgIC8vIHRoaXMuX2VtaXRSYXRlVGltZUNvdW50ZXIgPSAwLjA7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5fZW1pdFJhdGVEaXN0YW5jZUNvdW50ZXIgPSAwLjA7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmxvb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faXNFbWl0dGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBlbWl0IGJ5IHJhdGVPdmVyVGltZVxuICAgICAgICAgICAgdGhpcy5fZW1pdFJhdGVUaW1lQ291bnRlciArPSB0aGlzLnJhdGVPdmVyVGltZS5ldmFsdWF0ZSh0aGlzLl90aW1lIC8gdGhpcy5kdXJhdGlvbiwgMSkgKiBkdDtcbiAgICAgICAgICAgIGlmICh0aGlzLl9lbWl0UmF0ZVRpbWVDb3VudGVyID4gMSAmJiB0aGlzLl9pc0VtaXR0aW5nKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW1pdE51bSA9IE1hdGguZmxvb3IodGhpcy5fZW1pdFJhdGVUaW1lQ291bnRlcik7XG4gICAgICAgICAgICAgICAgdGhpcy5fZW1pdFJhdGVUaW1lQ291bnRlciAtPSBlbWl0TnVtO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChlbWl0TnVtLCBkdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBlbWl0IGJ5IHJhdGVPdmVyRGlzdGFuY2VcbiAgICAgICAgICAgIHRoaXMubm9kZS5nZXRXb3JsZFBvc2l0aW9uKHRoaXMuX2N1cldQb3MpO1xuICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBWZWMzLmRpc3RhbmNlKHRoaXMuX2N1cldQb3MsIHRoaXMuX29sZFdQb3MpO1xuICAgICAgICAgICAgVmVjMy5jb3B5KHRoaXMuX29sZFdQb3MsIHRoaXMuX2N1cldQb3MpO1xuICAgICAgICAgICAgdGhpcy5fZW1pdFJhdGVEaXN0YW5jZUNvdW50ZXIgKz0gZGlzdGFuY2UgKiB0aGlzLnJhdGVPdmVyRGlzdGFuY2UuZXZhbHVhdGUodGhpcy5fdGltZSAvIHRoaXMuZHVyYXRpb24sIDEpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2VtaXRSYXRlRGlzdGFuY2VDb3VudGVyID4gMSAmJiB0aGlzLl9pc0VtaXR0aW5nKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW1pdE51bSA9IE1hdGguZmxvb3IodGhpcy5fZW1pdFJhdGVEaXN0YW5jZUNvdW50ZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2VtaXRSYXRlRGlzdGFuY2VDb3VudGVyIC09IGVtaXROdW07XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KGVtaXROdW0sIGR0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gYnVyc3RzXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJ1cnN0IG9mIHRoaXMuYnVyc3RzKSB7XG4gICAgICAgICAgICAgICAgYnVyc3QudXBkYXRlKHRoaXMsIGR0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9hY3RpdmF0ZU1hdGVyaWFsICgpIHtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgX3Jlc2V0UG9zaXRpb24gKCkge1xuICAgICAgICB0aGlzLm5vZGUuZ2V0V29ybGRQb3NpdGlvbih0aGlzLl9vbGRXUG9zKTtcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMuX2N1cldQb3MsIHRoaXMuX29sZFdQb3MpO1xuICAgIH1cblxuICAgIGFkZFN1YkVtaXR0ZXIgKHN1YkVtaXR0ZXIpIHtcbiAgICAgICAgdGhpcy5fc3ViRW1pdHRlcnMucHVzaChzdWJFbWl0dGVyKTtcbiAgICB9XG5cbiAgICByZW1vdmVTdWJFbWl0dGVyIChpZHgpIHtcbiAgICAgICAgdGhpcy5fc3ViRW1pdHRlcnMuc3BsaWNlKHRoaXMuX3N1YkVtaXR0ZXJzLmluZGV4T2YoaWR4KSwgMSk7XG4gICAgfVxuXG4gICAgYWRkQnVyc3QgKGJ1cnN0KSB7XG4gICAgICAgIHRoaXMuYnVyc3RzLnB1c2goYnVyc3QpO1xuICAgIH1cblxuICAgIHJlbW92ZUJ1cnN0IChpZHgpIHtcbiAgICAgICAgdGhpcy5idXJzdHMuc3BsaWNlKHRoaXMuYnVyc3RzLmluZGV4T2YoaWR4KSwgMSk7XG4gICAgfVxuXG4gICAgX2NoZWNrQmFjdGggKCkge1xuICAgICAgICBcbiAgICB9XG5cbiAgICBnZXQgaXNQbGF5aW5nICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzUGxheWluZztcbiAgICB9XG5cbiAgICBnZXQgaXNQYXVzZWQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNQYXVzZWQ7XG4gICAgfVxuXG4gICAgZ2V0IGlzU3RvcHBlZCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1N0b3BwZWQ7XG4gICAgfVxuXG4gICAgZ2V0IGlzRW1pdHRpbmcgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNFbWl0dGluZztcbiAgICB9XG5cbiAgICBnZXQgdGltZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90aW1lO1xuICAgIH1cbn1cblxuQ0NfRURJVE9SICYmIChQYXJ0aWNsZVN5c3RlbTNELnByb3RvdHlwZS5fb25CZWZvcmVTZXJpYWxpemUgPSBmdW5jdGlvbihwcm9wcyl7cmV0dXJuIHByb3BzLmZpbHRlcihwID0+ICFfbW9kdWxlX3Byb3BzLmluY2x1ZGVzKHApIHx8IHRoaXNbcF0uZW5hYmxlKTt9KTtcblxuY2MuUGFydGljbGVTeXN0ZW0zRCA9IFBhcnRpY2xlU3lzdGVtM0Q7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==