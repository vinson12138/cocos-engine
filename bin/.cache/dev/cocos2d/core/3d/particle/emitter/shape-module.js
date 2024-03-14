
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/particle/emitter/shape-module.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _CCClassDecorator = require("../../../platform/CCClassDecorator");

var _valueTypes = require("../../../value-types");

var _curveRange = _interopRequireDefault(require("../animator/curve-range"));

var _particleGeneralFunction = require("../particle-general-function");

var _enum = require("../enum");

var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

// tslint:disable: max-line-length
var _intermediVec = new _valueTypes.Vec3(0, 0, 0);

var _intermediArr = new Array();

var _unitBoxExtent = new _valueTypes.Vec3(0.5, 0.5, 0.5);
/**
 * !#en The shape module of 3d particle.
 * !#zh 3D 粒子的发射形状模块
 * @class ShapeModule
 */


var ShapeModule = (_dec = (0, _CCClassDecorator.ccclass)('cc.ShapeModule'), _dec2 = (0, _CCClassDecorator.property)({
  type: _enum.ShapeType
}), _dec3 = (0, _CCClassDecorator.property)({
  type: _enum.EmitLocation
}), _dec4 = (0, _CCClassDecorator.property)({
  type: _enum.ArcMode
}), _dec5 = (0, _CCClassDecorator.property)({
  type: _curveRange["default"]
}), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
  function ShapeModule() {
    _initializerDefineProperty(this, "enable", _descriptor, this);

    _initializerDefineProperty(this, "_shapeType", _descriptor2, this);

    _initializerDefineProperty(this, "emitFrom", _descriptor3, this);

    _initializerDefineProperty(this, "radius", _descriptor4, this);

    _initializerDefineProperty(this, "radiusThickness", _descriptor5, this);

    _initializerDefineProperty(this, "_angle", _descriptor6, this);

    _initializerDefineProperty(this, "_arc", _descriptor7, this);

    _initializerDefineProperty(this, "arcMode", _descriptor8, this);

    _initializerDefineProperty(this, "arcSpread", _descriptor9, this);

    _initializerDefineProperty(this, "arcSpeed", _descriptor10, this);

    _initializerDefineProperty(this, "length", _descriptor11, this);

    _initializerDefineProperty(this, "boxThickness", _descriptor12, this);

    _initializerDefineProperty(this, "_position", _descriptor13, this);

    _initializerDefineProperty(this, "_rotation", _descriptor14, this);

    _initializerDefineProperty(this, "_scale", _descriptor15, this);

    _initializerDefineProperty(this, "alignToDirection", _descriptor16, this);

    _initializerDefineProperty(this, "randomDirectionAmount", _descriptor17, this);

    _initializerDefineProperty(this, "sphericalDirectionAmount", _descriptor18, this);

    _initializerDefineProperty(this, "randomPositionAmount", _descriptor19, this);

    this.mat = null;
    this.Quat = null;
    this.particleSystem = null;
    this.lastTime = null;
    this.totalAngle = null;
    this.mat = new _valueTypes.Mat4();
    this.quat = new _valueTypes.Quat();
    this.particleSystem = null;
    this.lastTime = 0;
    this.totalAngle = 0;
  }

  var _proto = ShapeModule.prototype;

  _proto.onInit = function onInit(ps) {
    this.particleSystem = ps;
    this.constructMat();
    this.lastTime = this.particleSystem._time;
  };

  _proto.constructMat = function constructMat() {
    _valueTypes.Quat.fromEuler(this.quat, this._rotation.x, this._rotation.y, this._rotation.z);

    _valueTypes.Mat4.fromRTS(this.mat, this.quat, this._position, this._scale);
  };

  _proto.emit = function emit(p) {
    switch (this.shapeType) {
      case _enum.ShapeType.Box:
        boxEmit(this.emitFrom, this.boxThickness, p.position, p.velocity);
        break;

      case _enum.ShapeType.Circle:
        circleEmit(this.radius, this.radiusThickness, this.generateArcAngle(), p.position, p.velocity);
        break;

      case _enum.ShapeType.Cone:
        coneEmit(this.emitFrom, this.radius, this.radiusThickness, this.generateArcAngle(), this._angle, this.length, p.position, p.velocity);
        break;

      case _enum.ShapeType.Sphere:
        sphereEmit(this.emitFrom, this.radius, this.radiusThickness, p.position, p.velocity);
        break;

      case _enum.ShapeType.Hemisphere:
        hemisphereEmit(this.emitFrom, this.radius, this.radiusThickness, p.position, p.velocity);
        break;

      default:
        console.warn(this.shapeType + ' shapeType is not supported by ShapeModule.');
    }

    if (this.randomPositionAmount > 0) {
      p.position.x += (0, _valueTypes.randomRange)(-this.randomPositionAmount, this.randomPositionAmount);
      p.position.y += (0, _valueTypes.randomRange)(-this.randomPositionAmount, this.randomPositionAmount);
      p.position.z += (0, _valueTypes.randomRange)(-this.randomPositionAmount, this.randomPositionAmount);
    }

    _valueTypes.Vec3.transformQuat(p.velocity, p.velocity, this.quat);

    _valueTypes.Vec3.transformMat4(p.position, p.position, this.mat);

    if (this.sphericalDirectionAmount > 0) {
      var sphericalVel = _valueTypes.Vec3.normalize(_intermediVec, p.position);

      _valueTypes.Vec3.lerp(p.velocity, p.velocity, sphericalVel, this.sphericalDirectionAmount);
    }

    this.lastTime = this.particleSystem._time;
  };

  _proto.generateArcAngle = function generateArcAngle() {
    if (this.arcMode === _enum.ArcMode.Random) {
      return (0, _valueTypes.randomRange)(0, this._arc);
    }

    var angle = this.totalAngle + 2 * Math.PI * this.arcSpeed.evaluate(this.particleSystem._time, 1) * (this.particleSystem._time - this.lastTime);
    this.totalAngle = angle;

    if (this.arcSpread !== 0) {
      angle = Math.floor(angle / (this._arc * this.arcSpread)) * this._arc * this.arcSpread;
    }

    switch (this.arcMode) {
      case _enum.ArcMode.Loop:
        return (0, _valueTypes.repeat)(angle, this._arc);

      case _enum.ArcMode.PingPong:
        return (0, _valueTypes.pingPong)(angle, this._arc);
    }
  };

  _createClass(ShapeModule, [{
    key: "shapeType",
    get:
    /**
     * !#en The enable of shapeModule.
     * !#zh 是否启用
     * @property {Boolean} enable
     */

    /**
     * !#en Particle emitter type.
     * !#zh 粒子发射器类型。
     * @property {ShapeType} shapeType
     */
    function get() {
      return this._shapeType;
    },
    set: function set(val) {
      this._shapeType = val;

      switch (this._shapeType) {
        case _enum.ShapeType.Box:
          if (this.emitFrom === _enum.EmitLocation.Base) {
            this.emitFrom = _enum.EmitLocation.Volume;
          }

          break;

        case _enum.ShapeType.Cone:
          if (this.emitFrom === _enum.EmitLocation.Edge) {
            this.emitFrom = _enum.EmitLocation.Base;
          }

          break;

        case _enum.ShapeType.Sphere:
        case _enum.ShapeType.Hemisphere:
          if (this.emitFrom === _enum.EmitLocation.Base || this.emitFrom === _enum.EmitLocation.Edge) {
            this.emitFrom = _enum.EmitLocation.Volume;
          }

          break;
      }
    }
    /**
     * !#en The emission site of the particle.
     * !#zh 粒子从发射器哪个部位发射。
     * @property {EmitLocation} emitFrom
     */

  }, {
    key: "angle",
    get:
    /**
     * !#en The angle between the axis of the cone and the generatrix<bg>
     * Determines the opening and closing of the cone launcher
     * !#zh 圆锥的轴与母线的夹角<bg>。
     * 决定圆锥发射器的开合程度。
     * @property {Number} angle
     */
    function get() {
      return Math.round((0, _valueTypes.toDegree)(this._angle) * 100) / 100;
    },
    set: function set(val) {
      this._angle = (0, _valueTypes.toRadian)(val);
    }
  }, {
    key: "arc",
    get:
    /**
     * !#en Particle emitters emit in a fan-shaped range.
     * !#zh 粒子发射器在一个扇形范围内发射。
     * @property {Number} arc
     */
    function get() {
      return (0, _valueTypes.toDegree)(this._arc);
    },
    set: function set(val) {
      this._arc = (0, _valueTypes.toRadian)(val);
    }
    /**
     * !#en How particles are emitted in the sector range.
     * !#zh 粒子在扇形范围内的发射方式。
     * @property {ArcMode} arcMode
     */

  }, {
    key: "position",
    get:
    /**
     * !#en Particle Emitter Position
     * !#zh 粒子发射器位置。
     * @property {Vec3} position
     */
    function get() {
      return this._position;
    },
    set: function set(val) {
      this._position = val;
      this.constructMat();
    }
  }, {
    key: "rotation",
    get:
    /**
     * !#en Particle emitter rotation angle.
     * !#zh 粒子发射器旋转角度。
     * @property {Vec3} rotation
     */
    function get() {
      return this._rotation;
    },
    set: function set(val) {
      this._rotation = val;
      this.constructMat();
    }
  }, {
    key: "scale",
    get:
    /**
     * !#en Particle emitter scaling
     * !#zh 粒子发射器缩放比例。
     * @property {Vec3} scale
     */
    function get() {
      return this._scale;
    },
    set: function set(val) {
      this._scale = val;
      this.constructMat();
    }
    /**
     * !#en The direction of particle movement is determined based on the initial direction of the particles.
     * !#zh 根据粒子的初始方向决定粒子的移动方向。
     * @property {Boolean} alignToDirection
     */

  }]);

  return ShapeModule;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "enable", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_shapeType", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return _enum.ShapeType.Cone;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "shapeType", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "shapeType"), _class2.prototype), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "emitFrom", [_dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return _enum.EmitLocation.Volume;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "radius", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "radiusThickness", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_angle", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return (0, _valueTypes.toRadian)(25);
  }
}), _applyDecoratedDescriptor(_class2.prototype, "angle", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "angle"), _class2.prototype), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "_arc", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return (0, _valueTypes.toRadian)(360);
  }
}), _applyDecoratedDescriptor(_class2.prototype, "arc", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "arc"), _class2.prototype), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "arcMode", [_dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return _enum.ArcMode.Random;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "arcSpread", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "arcSpeed", [_dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "length", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 5;
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "boxThickness", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _valueTypes.Vec3(0, 0, 0);
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "_position", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _valueTypes.Vec3(0, 0, 0);
  }
}), _applyDecoratedDescriptor(_class2.prototype, "position", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "position"), _class2.prototype), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "_rotation", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _valueTypes.Vec3(0, 0, 0);
  }
}), _applyDecoratedDescriptor(_class2.prototype, "rotation", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "rotation"), _class2.prototype), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "_scale", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _valueTypes.Vec3(1, 1, 1);
  }
}), _applyDecoratedDescriptor(_class2.prototype, "scale", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "scale"), _class2.prototype), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "alignToDirection", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "randomDirectionAmount", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "sphericalDirectionAmount", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "randomPositionAmount", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
})), _class2)) || _class);
exports["default"] = ShapeModule;

function sphereEmit(emitFrom, radius, radiusThickness, pos, dir) {
  switch (emitFrom) {
    case _enum.EmitLocation.Volume:
      (0, _particleGeneralFunction.randomPointBetweenSphere)(pos, radius * (1 - radiusThickness), radius);

      _valueTypes.Vec3.copy(dir, pos);

      _valueTypes.Vec3.normalize(dir, dir);

      break;

    case _enum.EmitLocation.Shell:
      (0, _particleGeneralFunction.randomUnitVector)(pos);

      _valueTypes.Vec3.scale(pos, pos, radius);

      _valueTypes.Vec3.copy(dir, pos);

      break;

    default:
      console.warn(emitFrom + ' is not supported for sphere emitter.');
  }
}

function hemisphereEmit(emitFrom, radius, radiusThickness, pos, dir) {
  switch (emitFrom) {
    case _enum.EmitLocation.Volume:
      (0, _particleGeneralFunction.randomPointBetweenSphere)(pos, radius * (1 - radiusThickness), radius);

      if (pos.z > 0) {
        pos.z *= -1;
      }

      _valueTypes.Vec3.copy(dir, pos);

      _valueTypes.Vec3.normalize(dir, dir);

      break;

    case _enum.EmitLocation.Shell:
      (0, _particleGeneralFunction.randomUnitVector)(pos);

      _valueTypes.Vec3.scale(pos, pos, radius);

      if (pos.z < 0) {
        pos.z *= -1;
      }

      _valueTypes.Vec3.copy(dir, pos);

      break;

    default:
      console.warn(emitFrom + ' is not supported for hemisphere emitter.');
  }
}

function coneEmit(emitFrom, radius, radiusThickness, theta, angle, length, pos, dir) {
  switch (emitFrom) {
    case _enum.EmitLocation.Base:
      (0, _particleGeneralFunction.randomPointBetweenCircleAtFixedAngle)(pos, radius * (1 - radiusThickness), radius, theta);

      _valueTypes.Vec2.scale(dir, pos, Math.sin(angle));

      dir.z = -Math.cos(angle) * radius;

      _valueTypes.Vec3.normalize(dir, dir);

      pos.z = 0;
      break;

    case _enum.EmitLocation.Shell:
      (0, _particleGeneralFunction.fixedAngleUnitVector2)(pos, theta);

      _valueTypes.Vec2.scale(dir, pos, Math.sin(angle));

      dir.z = -Math.cos(angle);

      _valueTypes.Vec3.normalize(dir, dir);

      _valueTypes.Vec2.scale(pos, pos, radius);

      pos.z = 0;
      break;

    case _enum.EmitLocation.Volume:
      (0, _particleGeneralFunction.randomPointBetweenCircleAtFixedAngle)(pos, radius * (1 - radiusThickness), radius, theta);

      _valueTypes.Vec2.scale(dir, pos, Math.sin(angle));

      dir.z = -Math.cos(angle) * radius;

      _valueTypes.Vec3.normalize(dir, dir);

      pos.z = 0;

      _valueTypes.Vec3.add(pos, pos, _valueTypes.Vec3.scale(_intermediVec, dir, length * (0, _valueTypes.random)() / -dir.z));

      break;

    default:
      console.warn(emitFrom + ' is not supported for cone emitter.');
  }
}

function boxEmit(emitFrom, boxThickness, pos, dir) {
  switch (emitFrom) {
    case _enum.EmitLocation.Volume:
      (0, _particleGeneralFunction.randomPointInCube)(pos, _unitBoxExtent); // randomPointBetweenCube(pos, Vec3.multiply(_intermediVec, _unitBoxExtent, boxThickness), _unitBoxExtent);

      break;

    case _enum.EmitLocation.Shell:
      _intermediArr.splice(0, _intermediArr.length);

      _intermediArr.push((0, _valueTypes.randomRange)(-0.5, 0.5));

      _intermediArr.push((0, _valueTypes.randomRange)(-0.5, 0.5));

      _intermediArr.push((0, _particleGeneralFunction.randomSign)() * 0.5);

      (0, _particleGeneralFunction.randomSortArray)(_intermediArr);
      applyBoxThickness(_intermediArr, boxThickness);

      _valueTypes.Vec3.set(pos, _intermediArr[0], _intermediArr[1], _intermediArr[2]);

      break;

    case _enum.EmitLocation.Edge:
      _intermediArr.splice(0, _intermediArr.length);

      _intermediArr.push((0, _valueTypes.randomRange)(-0.5, 0.5));

      _intermediArr.push((0, _particleGeneralFunction.randomSign)() * 0.5);

      _intermediArr.push((0, _particleGeneralFunction.randomSign)() * 0.5);

      (0, _particleGeneralFunction.randomSortArray)(_intermediArr);
      applyBoxThickness(_intermediArr, boxThickness);

      _valueTypes.Vec3.set(pos, _intermediArr[0], _intermediArr[1], _intermediArr[2]);

      break;

    default:
      console.warn(emitFrom + ' is not supported for box emitter.');
  }

  _valueTypes.Vec3.copy(dir, _particleGeneralFunction.particleEmitZAxis);
}

function circleEmit(radius, radiusThickness, theta, pos, dir) {
  (0, _particleGeneralFunction.randomPointBetweenCircleAtFixedAngle)(pos, radius * (1 - radiusThickness), radius, theta);

  _valueTypes.Vec3.normalize(dir, pos);
}

function applyBoxThickness(pos, thickness) {
  if (thickness.x > 0) {
    pos[0] += 0.5 * (0, _valueTypes.randomRange)(-thickness.x, thickness.x);
    pos[0] = (0, _valueTypes.clamp)(pos[0], -0.5, 0.5);
  }

  if (thickness.y > 0) {
    pos[1] += 0.5 * (0, _valueTypes.randomRange)(-thickness.y, thickness.y);
    pos[1] = (0, _valueTypes.clamp)(pos[1], -0.5, 0.5);
  }

  if (thickness.z > 0) {
    pos[2] += 0.5 * (0, _valueTypes.randomRange)(-thickness.z, thickness.z);
    pos[2] = (0, _valueTypes.clamp)(pos[2], -0.5, 0.5);
  }
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BhcnRpY2xlL2VtaXR0ZXIvc2hhcGUtbW9kdWxlLnRzIl0sIm5hbWVzIjpbIl9pbnRlcm1lZGlWZWMiLCJWZWMzIiwiX2ludGVybWVkaUFyciIsIkFycmF5IiwiX3VuaXRCb3hFeHRlbnQiLCJTaGFwZU1vZHVsZSIsInR5cGUiLCJTaGFwZVR5cGUiLCJFbWl0TG9jYXRpb24iLCJBcmNNb2RlIiwiQ3VydmVSYW5nZSIsIm1hdCIsIlF1YXQiLCJwYXJ0aWNsZVN5c3RlbSIsImxhc3RUaW1lIiwidG90YWxBbmdsZSIsIk1hdDQiLCJxdWF0Iiwib25Jbml0IiwicHMiLCJjb25zdHJ1Y3RNYXQiLCJfdGltZSIsImZyb21FdWxlciIsIl9yb3RhdGlvbiIsIngiLCJ5IiwieiIsImZyb21SVFMiLCJfcG9zaXRpb24iLCJfc2NhbGUiLCJlbWl0IiwicCIsInNoYXBlVHlwZSIsIkJveCIsImJveEVtaXQiLCJlbWl0RnJvbSIsImJveFRoaWNrbmVzcyIsInBvc2l0aW9uIiwidmVsb2NpdHkiLCJDaXJjbGUiLCJjaXJjbGVFbWl0IiwicmFkaXVzIiwicmFkaXVzVGhpY2tuZXNzIiwiZ2VuZXJhdGVBcmNBbmdsZSIsIkNvbmUiLCJjb25lRW1pdCIsIl9hbmdsZSIsImxlbmd0aCIsIlNwaGVyZSIsInNwaGVyZUVtaXQiLCJIZW1pc3BoZXJlIiwiaGVtaXNwaGVyZUVtaXQiLCJjb25zb2xlIiwid2FybiIsInJhbmRvbVBvc2l0aW9uQW1vdW50IiwidHJhbnNmb3JtUXVhdCIsInRyYW5zZm9ybU1hdDQiLCJzcGhlcmljYWxEaXJlY3Rpb25BbW91bnQiLCJzcGhlcmljYWxWZWwiLCJub3JtYWxpemUiLCJsZXJwIiwiYXJjTW9kZSIsIlJhbmRvbSIsIl9hcmMiLCJhbmdsZSIsIk1hdGgiLCJQSSIsImFyY1NwZWVkIiwiZXZhbHVhdGUiLCJhcmNTcHJlYWQiLCJmbG9vciIsIkxvb3AiLCJQaW5nUG9uZyIsIl9zaGFwZVR5cGUiLCJ2YWwiLCJCYXNlIiwiVm9sdW1lIiwiRWRnZSIsInJvdW5kIiwicHJvcGVydHkiLCJwb3MiLCJkaXIiLCJjb3B5IiwiU2hlbGwiLCJzY2FsZSIsInRoZXRhIiwiVmVjMiIsInNpbiIsImNvcyIsImFkZCIsInNwbGljZSIsInB1c2giLCJhcHBseUJveFRoaWNrbmVzcyIsInNldCIsInBhcnRpY2xlRW1pdFpBeGlzIiwidGhpY2tuZXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtBQUNBLElBQU1BLGFBQWEsR0FBRyxJQUFJQyxnQkFBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUF0Qjs7QUFDQSxJQUFNQyxhQUFhLEdBQUcsSUFBSUMsS0FBSixFQUF0Qjs7QUFDQSxJQUFNQyxjQUFjLEdBQUcsSUFBSUgsZ0JBQUosQ0FBUyxHQUFULEVBQWMsR0FBZCxFQUFtQixHQUFuQixDQUF2QjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztJQUVxQkksc0JBRHBCLCtCQUFRLGdCQUFSLFdBbUJJLGdDQUFTO0FBQ05DLEVBQUFBLElBQUksRUFBRUM7QUFEQSxDQUFULFdBa0NBLGdDQUFTO0FBQ05ELEVBQUFBLElBQUksRUFBRUU7QUFEQSxDQUFULFdBb0VBLGdDQUFTO0FBQ05GLEVBQUFBLElBQUksRUFBRUc7QUFEQSxDQUFULFdBa0JBLGdDQUFTO0FBQ05ILEVBQUFBLElBQUksRUFBRUk7QUFEQSxDQUFUO0FBK0dELHlCQUFlO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUEsU0FOZkMsR0FNZSxHQU5ULElBTVM7QUFBQSxTQUxmQyxJQUtlLEdBTFIsSUFLUTtBQUFBLFNBSmZDLGNBSWUsR0FKRSxJQUlGO0FBQUEsU0FIZkMsUUFHZSxH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QUFTLENBQUNyRSxDQUFwQyxDQUFoQjtBQUNBc0QsSUFBQUEsR0FBRyxDQUFDLENBQUQsQ0FBSCxHQUFTLHVCQUFNQSxHQUFHLENBQUMsQ0FBRCxDQUFULEVBQWMsQ0FBQyxHQUFmLEVBQW9CLEdBQXBCLENBQVQ7QUFDSDtBQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2NjbGFzcywgcHJvcGVydHkgfSBmcm9tICcuLi8uLi8uLi9wbGF0Zm9ybS9DQ0NsYXNzRGVjb3JhdG9yJztcbmltcG9ydCB7IGNsYW1wLCBNYXQ0LCBwaW5nUG9uZywgUXVhdCwgcmFuZG9tLCByYW5kb21SYW5nZSwgcmVwZWF0LCB0b0RlZ3JlZSwgdG9SYWRpYW4sIFZlYzIsIFZlYzMgfSBmcm9tICcuLi8uLi8uLi92YWx1ZS10eXBlcyc7XG5pbXBvcnQgQ3VydmVSYW5nZSBmcm9tICcuLi9hbmltYXRvci9jdXJ2ZS1yYW5nZSc7XG5pbXBvcnQgeyBmaXhlZEFuZ2xlVW5pdFZlY3RvcjIsIHBhcnRpY2xlRW1pdFpBeGlzLCByYW5kb21Qb2ludEJldHdlZW5DaXJjbGVBdEZpeGVkQW5nbGUsIHJhbmRvbVBvaW50QmV0d2VlblNwaGVyZSwgcmFuZG9tUG9pbnRJbkN1YmUsIHJhbmRvbVNpZ24sIHJhbmRvbVNvcnRBcnJheSwgcmFuZG9tVW5pdFZlY3RvciB9IGZyb20gJy4uL3BhcnRpY2xlLWdlbmVyYWwtZnVuY3Rpb24nO1xuaW1wb3J0IHsgU2hhcGVUeXBlLCBFbWl0TG9jYXRpb24sIEFyY01vZGUgfSBmcm9tICcuLi9lbnVtJztcblxuLy8gdHNsaW50OmRpc2FibGU6IG1heC1saW5lLWxlbmd0aFxuY29uc3QgX2ludGVybWVkaVZlYyA9IG5ldyBWZWMzKDAsIDAsIDApO1xuY29uc3QgX2ludGVybWVkaUFyciA9IG5ldyBBcnJheSgpO1xuY29uc3QgX3VuaXRCb3hFeHRlbnQgPSBuZXcgVmVjMygwLjUsIDAuNSwgMC41KTtcblxuLyoqXG4gKiAhI2VuIFRoZSBzaGFwZSBtb2R1bGUgb2YgM2QgcGFydGljbGUuXG4gKiAhI3poIDNEIOeykuWtkOeahOWPkeWwhOW9oueKtuaooeWdl1xuICogQGNsYXNzIFNoYXBlTW9kdWxlXG4gKi9cbkBjY2NsYXNzKCdjYy5TaGFwZU1vZHVsZScpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaGFwZU1vZHVsZSB7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBlbmFibGUgb2Ygc2hhcGVNb2R1bGUuXG4gICAgICogISN6aCDmmK/lkKblkK/nlKhcbiAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGVuYWJsZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGVuYWJsZSA9IGZhbHNlO1xuXG4gICAgQHByb3BlcnR5XG4gICAgX3NoYXBlVHlwZSA9IFNoYXBlVHlwZS5Db25lO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXJ0aWNsZSBlbWl0dGVyIHR5cGUuXG4gICAgICogISN6aCDnspLlrZDlj5HlsITlmajnsbvlnovjgIJcbiAgICAgKiBAcHJvcGVydHkge1NoYXBlVHlwZX0gc2hhcGVUeXBlXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogU2hhcGVUeXBlLFxuICAgIH0pXG4gICAgcHVibGljIGdldCBzaGFwZVR5cGUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcGVUeXBlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgc2hhcGVUeXBlICh2YWwpIHtcbiAgICAgICAgdGhpcy5fc2hhcGVUeXBlID0gdmFsO1xuICAgICAgICBzd2l0Y2ggKHRoaXMuX3NoYXBlVHlwZSkge1xuICAgICAgICAgICAgY2FzZSBTaGFwZVR5cGUuQm94OlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVtaXRGcm9tID09PSBFbWl0TG9jYXRpb24uQmFzZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXRGcm9tID0gRW1pdExvY2F0aW9uLlZvbHVtZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFNoYXBlVHlwZS5Db25lOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVtaXRGcm9tID09PSBFbWl0TG9jYXRpb24uRWRnZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXRGcm9tID0gRW1pdExvY2F0aW9uLkJhc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBTaGFwZVR5cGUuU3BoZXJlOlxuICAgICAgICAgICAgY2FzZSBTaGFwZVR5cGUuSGVtaXNwaGVyZTpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lbWl0RnJvbSA9PT0gRW1pdExvY2F0aW9uLkJhc2UgfHwgdGhpcy5lbWl0RnJvbSA9PT0gRW1pdExvY2F0aW9uLkVkZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0RnJvbSA9IEVtaXRMb2NhdGlvbi5Wb2x1bWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZW1pc3Npb24gc2l0ZSBvZiB0aGUgcGFydGljbGUuXG4gICAgICogISN6aCDnspLlrZDku47lj5HlsITlmajlk6rkuKrpg6jkvY3lj5HlsITjgIJcbiAgICAgKiBAcHJvcGVydHkge0VtaXRMb2NhdGlvbn0gZW1pdEZyb21cbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBFbWl0TG9jYXRpb24sXG4gICAgfSlcbiAgICBlbWl0RnJvbSA9IEVtaXRMb2NhdGlvbi5Wb2x1bWU7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBhcnRpY2xlIGVtaXR0ZXIgcmFkaXVzLlxuICAgICAqICEjemgg57KS5a2Q5Y+R5bCE5Zmo5Y2K5b6E44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHJhZGl1c1xuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIHJhZGl1cyA9IDE7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBhcnRpY2xlIGVtaXR0ZXIgZW1pc3Npb24gcG9zaXRpb24gKG5vdCB2YWxpZCBmb3IgQm94IHR5cGUgZW1pdHRlcnMp77yaPGJnPlxuICAgICAqIC0gMCBtZWFucyBlbWl0dGVkIGZyb20gdGhlIHN1cmZhY2U7XG7CoMKgwqDCoMKgKiAtIDEgbWVhbnMgbGF1bmNoIGZyb20gdGhlIGNlbnRlcjtcbsKgwqDCoMKgwqAqIC0gMCB+IDEgaW5kaWNhdGVzIGVtaXNzaW9uIGZyb20gdGhlIGNlbnRlciB0byB0aGUgc3VyZmFjZS5cbiAgICAgKiAhI3poIOeykuWtkOWPkeWwhOWZqOWPkeWwhOS9jee9ru+8iOWvuSBCb3gg57G75Z6L55qE5Y+R5bCE5Zmo5peg5pWI77yJ77yaPGJnPlxuICAgICAqIC0gMCDooajnpLrku47ooajpnaLlj5HlsITvvJtcbiAgICAgKiAtIDEg6KGo56S65LuO5Lit5b+D5Y+R5bCE77ybXG4gICAgICogLSAwIH4gMSDkuYvpl7TooajnpLrlnKjkuK3lv4PliLDooajpnaLkuYvpl7Tlj5HlsITjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gcmFkaXVzVGhpY2tuZXNzXG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgcmFkaXVzVGhpY2tuZXNzID0gMTtcblxuICAgIEBwcm9wZXJ0eVxuICAgIF9hbmdsZSA9IHRvUmFkaWFuKDI1KTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGFuZ2xlIGJldHdlZW4gdGhlIGF4aXMgb2YgdGhlIGNvbmUgYW5kIHRoZSBnZW5lcmF0cml4PGJnPlxuICAgICAqIERldGVybWluZXMgdGhlIG9wZW5pbmcgYW5kIGNsb3Npbmcgb2YgdGhlIGNvbmUgbGF1bmNoZXJcbiAgICAgKiAhI3poIOWchumUpeeahOi9tOS4juavjee6v+eahOWkueinkjxiZz7jgIJcbiAgICAgKiDlhrPlrprlnIbplKXlj5HlsITlmajnmoTlvIDlkIjnqIvluqbjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gYW5nbGVcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBnZXQgYW5nbGUgKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh0b0RlZ3JlZSh0aGlzLl9hbmdsZSkgKiAxMDApIC8gMTAwO1xuICAgIH1cblxuICAgIHNldCBhbmdsZSAodmFsKSB7XG4gICAgICAgIHRoaXMuX2FuZ2xlID0gdG9SYWRpYW4odmFsKTtcbiAgICB9XG5cbiAgICBAcHJvcGVydHlcbiAgICBfYXJjID0gdG9SYWRpYW4oMzYwKTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gUGFydGljbGUgZW1pdHRlcnMgZW1pdCBpbiBhIGZhbi1zaGFwZWQgcmFuZ2UuXG4gICAgICogISN6aCDnspLlrZDlj5HlsITlmajlnKjkuIDkuKrmiYflvaLojIPlm7TlhoXlj5HlsITjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gYXJjXG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgZ2V0IGFyYyAoKSB7XG4gICAgICAgIHJldHVybiB0b0RlZ3JlZSh0aGlzLl9hcmMpO1xuICAgIH1cblxuICAgIHNldCBhcmMgKHZhbCkge1xuICAgICAgICB0aGlzLl9hcmMgPSB0b1JhZGlhbih2YWwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gSG93IHBhcnRpY2xlcyBhcmUgZW1pdHRlZCBpbiB0aGUgc2VjdG9yIHJhbmdlLlxuICAgICAqICEjemgg57KS5a2Q5Zyo5omH5b2i6IyD5Zu05YaF55qE5Y+R5bCE5pa55byP44CCXG4gICAgICogQHByb3BlcnR5IHtBcmNNb2RlfSBhcmNNb2RlXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogQXJjTW9kZSxcbiAgICB9KVxuICAgIGFyY01vZGUgPSBBcmNNb2RlLlJhbmRvbTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ29udHJvbHMgdGhlIGRpc2NyZXRlIGludGVydmFscyBhcm91bmQgdGhlIGFyY3Mgd2hlcmUgcGFydGljbGVzIG1pZ2h0IGJlIGdlbmVyYXRlZC5cbiAgICAgKiAhI3poIOaOp+WItuWPr+iDveS6p+eUn+eykuWtkOeahOW8p+WRqOWbtOeahOemu+aVo+mXtOmalOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBhcmNTcHJlYWRcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBhcmNTcHJlYWQgPSAwO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgc3BlZWQgYXQgd2hpY2ggcGFydGljbGVzIGFyZSBlbWl0dGVkIGFyb3VuZCB0aGUgY2lyY3VtZmVyZW5jZS5cbiAgICAgKiAhI3poIOeykuWtkOayv+WchuWRqOWPkeWwhOeahOmAn+W6puOAglxuICAgICAqIEBwcm9wZXJ0eSB7Q3VydmVSYW5nZX0gYXJjU3BlZWRcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBDdXJ2ZVJhbmdlLFxuICAgIH0pXG4gICAgYXJjU3BlZWQgPSBuZXcgQ3VydmVSYW5nZSgpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBBeGlzIGxlbmd0aCBmcm9tIHRvcCBvZiBjb25lIHRvIGJvdHRvbSBvZiBjb25lIDxiZz4uXG7CoMKgwqDCoMKgKiBEZXRlcm1pbmVzIHRoZSBoZWlnaHQgb2YgdGhlIGNvbmUgZW1pdHRlci5cbiAgICAgKiAhI3poIOWchumUpemhtumDqOaIqumdoui3neemu+W6lemDqOeahOi9tOmVvzxiZz7jgIJcbiAgICAgKiDlhrPlrprlnIbplKXlj5HlsITlmajnmoTpq5jluqbjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbGVuZ3RoXG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgbGVuZ3RoID0gNTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gUGFydGljbGUgZW1pdHRlciBlbWlzc2lvbiBsb2NhdGlvbiAoZm9yIGJveC10eXBlIHBhcnRpY2xlIGVtaXR0ZXJzKS5cbiAgICAgKiAhI3poIOeykuWtkOWPkeWwhOWZqOWPkeWwhOS9jee9ru+8iOmSiOWvuSBCb3gg57G75Z6L55qE57KS5a2Q5Y+R5bCE5Zmo44CCXG4gICAgICogQHByb3BlcnR5IHtWZWMzfSBib3hUaGlja25lc3NcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBib3hUaGlja25lc3MgPSBuZXcgVmVjMygwLCAwLCAwKTtcblxuICAgIEBwcm9wZXJ0eVxuICAgIF9wb3NpdGlvbiA9IG5ldyBWZWMzKDAsIDAsIDApO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXJ0aWNsZSBFbWl0dGVyIFBvc2l0aW9uXG4gICAgICogISN6aCDnspLlrZDlj5HlsITlmajkvY3nva7jgIJcbiAgICAgKiBAcHJvcGVydHkge1ZlYzN9IHBvc2l0aW9uXG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgZ2V0IHBvc2l0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uO1xuICAgIH1cbiAgICBzZXQgcG9zaXRpb24gKHZhbCkge1xuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IHZhbDtcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3RNYXQoKTtcbiAgICB9XG5cbiAgICBAcHJvcGVydHlcbiAgICBfcm90YXRpb24gPSBuZXcgVmVjMygwLCAwLCAwKTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gUGFydGljbGUgZW1pdHRlciByb3RhdGlvbiBhbmdsZS5cbiAgICAgKiAhI3poIOeykuWtkOWPkeWwhOWZqOaXi+i9rOinkuW6puOAglxuICAgICAqIEBwcm9wZXJ0eSB7VmVjM30gcm90YXRpb25cbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBnZXQgcm90YXRpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcm90YXRpb247XG4gICAgfVxuICAgIHNldCByb3RhdGlvbiAodmFsKSB7XG4gICAgICAgIHRoaXMuX3JvdGF0aW9uID0gdmFsO1xuICAgICAgICB0aGlzLmNvbnN0cnVjdE1hdCgpO1xuICAgIH1cblxuICAgIEBwcm9wZXJ0eVxuICAgIF9zY2FsZSA9IG5ldyBWZWMzKDEsIDEsIDEpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXJ0aWNsZSBlbWl0dGVyIHNjYWxpbmdcbiAgICAgKiAhI3poIOeykuWtkOWPkeWwhOWZqOe8qeaUvuavlOS+i+OAglxuICAgICAqIEBwcm9wZXJ0eSB7VmVjM30gc2NhbGVcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBnZXQgc2NhbGUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2NhbGU7XG4gICAgfVxuICAgIHNldCBzY2FsZSAodmFsKSB7XG4gICAgICAgIHRoaXMuX3NjYWxlID0gdmFsO1xuICAgICAgICB0aGlzLmNvbnN0cnVjdE1hdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGRpcmVjdGlvbiBvZiBwYXJ0aWNsZSBtb3ZlbWVudCBpcyBkZXRlcm1pbmVkIGJhc2VkIG9uIHRoZSBpbml0aWFsIGRpcmVjdGlvbiBvZiB0aGUgcGFydGljbGVzLlxuICAgICAqICEjemgg5qC55o2u57KS5a2Q55qE5Yid5aeL5pa55ZCR5Yaz5a6a57KS5a2Q55qE56e75Yqo5pa55ZCR44CCXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBhbGlnblRvRGlyZWN0aW9uXG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgYWxpZ25Ub0RpcmVjdGlvbiA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgcGFydGljbGUgZ2VuZXJhdGlvbiBkaXJlY3Rpb24gcmFuZG9tbHkuXG4gICAgICogISN6aCDnspLlrZDnlJ/miJDmlrnlkJHpmo/mnLrorr7lrprjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gcmFuZG9tRGlyZWN0aW9uQW1vdW50XG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgcmFuZG9tRGlyZWN0aW9uQW1vdW50ID0gMDtcblxuICAgIC8qKlxuICAgICAqICEjZW4gSW50ZXJwb2xhdGlvbiBiZXR3ZWVuIHRoZSBjdXJyZW50IGVtaXNzaW9uIGRpcmVjdGlvbiBhbmQgdGhlIGRpcmVjdGlvbiBmcm9tIHRoZSBjdXJyZW50IHBvc2l0aW9uIHRvIHRoZSBjZW50ZXIgb2YgdGhlIG5vZGUuXG4gICAgICogISN6aCDooajnpLrlvZPliY3lj5HlsITmlrnlkJHkuI7lvZPliY3kvY3nva7liLDnu5PngrnkuK3lv4Pov57nur/mlrnlkJHnmoTmj5LlgLzjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gc3BoZXJpY2FsRGlyZWN0aW9uQW1vdW50XG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgc3BoZXJpY2FsRGlyZWN0aW9uQW1vdW50ID0gMDtcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSBwYXJ0aWNsZSBnZW5lcmF0aW9uIHBvc2l0aW9uIHJhbmRvbWx5IChzZXR0aW5nIHRoaXMgdmFsdWUgdG8gYSB2YWx1ZSBvdGhlciB0aGFuIDAgd2lsbCBjYXVzZSB0aGUgcGFydGljbGUgZ2VuZXJhdGlvbiBwb3NpdGlvbiB0byBleGNlZWQgdGhlIGdlbmVyYXRvciBzaXplIHJhbmdlKVxuICAgICAqICEjemgg57KS5a2Q55Sf5oiQ5L2N572u6ZqP5py66K6+5a6a77yI6K6+5a6a5q2k5YC85Li66Z2eIDAg5Lya5L2/57KS5a2Q55Sf5oiQ5L2N572u6LaF5Ye655Sf5oiQ5Zmo5aSn5bCP6IyD5Zu077yJ44CCXG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgcmFuZG9tUG9zaXRpb25BbW91bnQgPSAwO1xuXG4gICAgbWF0ID0gbnVsbDtcbiAgICBRdWF0ID0gbnVsbDtcbiAgICBwYXJ0aWNsZVN5c3RlbSA9IG51bGw7XG4gICAgbGFzdFRpbWUgPSBudWxsO1xuICAgIHRvdGFsQW5nbGUgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICB0aGlzLm1hdCA9IG5ldyBNYXQ0KCk7XG4gICAgICAgIHRoaXMucXVhdCA9IG5ldyBRdWF0KCk7XG4gICAgICAgIHRoaXMucGFydGljbGVTeXN0ZW0gPSBudWxsO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gMDtcbiAgICAgICAgdGhpcy50b3RhbEFuZ2xlID0gMDtcbiAgICB9XG5cbiAgICBvbkluaXQgKHBzKSB7XG4gICAgICAgIHRoaXMucGFydGljbGVTeXN0ZW0gPSBwcztcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3RNYXQoKTtcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IHRoaXMucGFydGljbGVTeXN0ZW0uX3RpbWU7XG4gICAgfVxuXG4gICAgY29uc3RydWN0TWF0ICgpIHtcbiAgICAgICAgUXVhdC5mcm9tRXVsZXIodGhpcy5xdWF0LCB0aGlzLl9yb3RhdGlvbi54LCB0aGlzLl9yb3RhdGlvbi55LCB0aGlzLl9yb3RhdGlvbi56KTtcbiAgICAgICAgTWF0NC5mcm9tUlRTKHRoaXMubWF0LCB0aGlzLnF1YXQsIHRoaXMuX3Bvc2l0aW9uLCB0aGlzLl9zY2FsZSk7XG4gICAgfVxuXG4gICAgZW1pdCAocCkge1xuICAgICAgICBzd2l0Y2ggKHRoaXMuc2hhcGVUeXBlKSB7XG4gICAgICAgICAgICBjYXNlIFNoYXBlVHlwZS5Cb3g6XG4gICAgICAgICAgICAgICAgYm94RW1pdCh0aGlzLmVtaXRGcm9tLCB0aGlzLmJveFRoaWNrbmVzcywgcC5wb3NpdGlvbiwgcC52ZWxvY2l0eSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFNoYXBlVHlwZS5DaXJjbGU6XG4gICAgICAgICAgICAgICAgY2lyY2xlRW1pdCh0aGlzLnJhZGl1cywgdGhpcy5yYWRpdXNUaGlja25lc3MsIHRoaXMuZ2VuZXJhdGVBcmNBbmdsZSgpLCBwLnBvc2l0aW9uLCBwLnZlbG9jaXR5KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU2hhcGVUeXBlLkNvbmU6XG4gICAgICAgICAgICAgICAgY29uZUVtaXQodGhpcy5lbWl0RnJvbSwgdGhpcy5yYWRpdXMsIHRoaXMucmFkaXVzVGhpY2tuZXNzLCB0aGlzLmdlbmVyYXRlQXJjQW5nbGUoKSwgdGhpcy5fYW5nbGUsIHRoaXMubGVuZ3RoLCBwLnBvc2l0aW9uLCBwLnZlbG9jaXR5KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU2hhcGVUeXBlLlNwaGVyZTpcbiAgICAgICAgICAgICAgICBzcGhlcmVFbWl0KHRoaXMuZW1pdEZyb20sIHRoaXMucmFkaXVzLCB0aGlzLnJhZGl1c1RoaWNrbmVzcywgcC5wb3NpdGlvbiwgcC52ZWxvY2l0eSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFNoYXBlVHlwZS5IZW1pc3BoZXJlOlxuICAgICAgICAgICAgICAgIGhlbWlzcGhlcmVFbWl0KHRoaXMuZW1pdEZyb20sIHRoaXMucmFkaXVzLCB0aGlzLnJhZGl1c1RoaWNrbmVzcywgcC5wb3NpdGlvbiwgcC52ZWxvY2l0eSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybih0aGlzLnNoYXBlVHlwZSArICcgc2hhcGVUeXBlIGlzIG5vdCBzdXBwb3J0ZWQgYnkgU2hhcGVNb2R1bGUuJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmFuZG9tUG9zaXRpb25BbW91bnQgPiAwKSB7XG4gICAgICAgICAgICBwLnBvc2l0aW9uLnggKz0gcmFuZG9tUmFuZ2UoLXRoaXMucmFuZG9tUG9zaXRpb25BbW91bnQsIHRoaXMucmFuZG9tUG9zaXRpb25BbW91bnQpO1xuICAgICAgICAgICAgcC5wb3NpdGlvbi55ICs9IHJhbmRvbVJhbmdlKC10aGlzLnJhbmRvbVBvc2l0aW9uQW1vdW50LCB0aGlzLnJhbmRvbVBvc2l0aW9uQW1vdW50KTtcbiAgICAgICAgICAgIHAucG9zaXRpb24ueiArPSByYW5kb21SYW5nZSgtdGhpcy5yYW5kb21Qb3NpdGlvbkFtb3VudCwgdGhpcy5yYW5kb21Qb3NpdGlvbkFtb3VudCk7XG4gICAgICAgIH1cbiAgICAgICAgVmVjMy50cmFuc2Zvcm1RdWF0KHAudmVsb2NpdHksIHAudmVsb2NpdHksIHRoaXMucXVhdCk7XG4gICAgICAgIFZlYzMudHJhbnNmb3JtTWF0NChwLnBvc2l0aW9uLCBwLnBvc2l0aW9uLCB0aGlzLm1hdCk7XG4gICAgICAgIGlmICh0aGlzLnNwaGVyaWNhbERpcmVjdGlvbkFtb3VudCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHNwaGVyaWNhbFZlbCA9IFZlYzMubm9ybWFsaXplKF9pbnRlcm1lZGlWZWMsIHAucG9zaXRpb24pO1xuICAgICAgICAgICAgVmVjMy5sZXJwKHAudmVsb2NpdHksIHAudmVsb2NpdHksIHNwaGVyaWNhbFZlbCwgdGhpcy5zcGhlcmljYWxEaXJlY3Rpb25BbW91bnQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSB0aGlzLnBhcnRpY2xlU3lzdGVtLl90aW1lO1xuICAgIH1cblxuICAgIGdlbmVyYXRlQXJjQW5nbGUgKCkge1xuICAgICAgICBpZiAodGhpcy5hcmNNb2RlID09PSBBcmNNb2RlLlJhbmRvbSkge1xuICAgICAgICAgICAgcmV0dXJuIHJhbmRvbVJhbmdlKDAsIHRoaXMuX2FyYyk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGFuZ2xlID0gdGhpcy50b3RhbEFuZ2xlICsgMiAqIE1hdGguUEkgKiB0aGlzLmFyY1NwZWVkLmV2YWx1YXRlKHRoaXMucGFydGljbGVTeXN0ZW0uX3RpbWUsIDEpICogKHRoaXMucGFydGljbGVTeXN0ZW0uX3RpbWUgLSB0aGlzLmxhc3RUaW1lKTtcbiAgICAgICAgdGhpcy50b3RhbEFuZ2xlID0gYW5nbGU7XG4gICAgICAgIGlmICh0aGlzLmFyY1NwcmVhZCAhPT0gMCkge1xuICAgICAgICAgICAgYW5nbGUgPSBNYXRoLmZsb29yKGFuZ2xlIC8gKHRoaXMuX2FyYyAqIHRoaXMuYXJjU3ByZWFkKSkgKiB0aGlzLl9hcmMgKiB0aGlzLmFyY1NwcmVhZDtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHRoaXMuYXJjTW9kZSkge1xuICAgICAgICAgICAgY2FzZSBBcmNNb2RlLkxvb3A6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcGVhdChhbmdsZSwgdGhpcy5fYXJjKTtcbiAgICAgICAgICAgIGNhc2UgQXJjTW9kZS5QaW5nUG9uZzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGluZ1BvbmcoYW5nbGUsIHRoaXMuX2FyYyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNwaGVyZUVtaXQgKGVtaXRGcm9tLCByYWRpdXMsIHJhZGl1c1RoaWNrbmVzcywgcG9zLCBkaXIpIHtcbiAgICBzd2l0Y2ggKGVtaXRGcm9tKSB7XG4gICAgICAgIGNhc2UgRW1pdExvY2F0aW9uLlZvbHVtZTpcbiAgICAgICAgICAgIHJhbmRvbVBvaW50QmV0d2VlblNwaGVyZShwb3MsIHJhZGl1cyAqICgxIC0gcmFkaXVzVGhpY2tuZXNzKSwgcmFkaXVzKTtcbiAgICAgICAgICAgIFZlYzMuY29weShkaXIsIHBvcyk7XG4gICAgICAgICAgICBWZWMzLm5vcm1hbGl6ZShkaXIsIGRpcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBFbWl0TG9jYXRpb24uU2hlbGw6XG4gICAgICAgICAgICByYW5kb21Vbml0VmVjdG9yKHBvcyk7XG4gICAgICAgICAgICBWZWMzLnNjYWxlKHBvcywgcG9zLCByYWRpdXMpO1xuICAgICAgICAgICAgVmVjMy5jb3B5KGRpciwgcG9zKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY29uc29sZS53YXJuKGVtaXRGcm9tICsgJyBpcyBub3Qgc3VwcG9ydGVkIGZvciBzcGhlcmUgZW1pdHRlci4nKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGhlbWlzcGhlcmVFbWl0IChlbWl0RnJvbSwgcmFkaXVzLCByYWRpdXNUaGlja25lc3MsIHBvcywgZGlyKSB7XG4gICAgc3dpdGNoIChlbWl0RnJvbSkge1xuICAgICAgICBjYXNlIEVtaXRMb2NhdGlvbi5Wb2x1bWU6XG4gICAgICAgICAgICByYW5kb21Qb2ludEJldHdlZW5TcGhlcmUocG9zLCByYWRpdXMgKiAoMSAtIHJhZGl1c1RoaWNrbmVzcyksIHJhZGl1cyk7XG4gICAgICAgICAgICBpZiAocG9zLnogPiAwKSB7XG4gICAgICAgICAgICAgICAgcG9zLnogKj0gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBWZWMzLmNvcHkoZGlyLCBwb3MpO1xuICAgICAgICAgICAgVmVjMy5ub3JtYWxpemUoZGlyLCBkaXIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgRW1pdExvY2F0aW9uLlNoZWxsOlxuICAgICAgICAgICAgcmFuZG9tVW5pdFZlY3Rvcihwb3MpO1xuICAgICAgICAgICAgVmVjMy5zY2FsZShwb3MsIHBvcywgcmFkaXVzKTtcbiAgICAgICAgICAgIGlmIChwb3MueiA8IDApIHtcbiAgICAgICAgICAgICAgICBwb3MueiAqPSAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFZlYzMuY29weShkaXIsIHBvcyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihlbWl0RnJvbSArICcgaXMgbm90IHN1cHBvcnRlZCBmb3IgaGVtaXNwaGVyZSBlbWl0dGVyLicpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY29uZUVtaXQgKGVtaXRGcm9tLCByYWRpdXMsIHJhZGl1c1RoaWNrbmVzcywgdGhldGEsIGFuZ2xlLCBsZW5ndGgsIHBvcywgZGlyKSB7XG4gICAgc3dpdGNoIChlbWl0RnJvbSkge1xuICAgICAgICBjYXNlIEVtaXRMb2NhdGlvbi5CYXNlOlxuICAgICAgICAgICAgcmFuZG9tUG9pbnRCZXR3ZWVuQ2lyY2xlQXRGaXhlZEFuZ2xlKHBvcywgcmFkaXVzICogKDEgLSByYWRpdXNUaGlja25lc3MpLCByYWRpdXMsIHRoZXRhKTtcbiAgICAgICAgICAgIFZlYzIuc2NhbGUoZGlyLCBwb3MsIE1hdGguc2luKGFuZ2xlKSk7XG4gICAgICAgICAgICBkaXIueiA9IC1NYXRoLmNvcyhhbmdsZSkgKiByYWRpdXM7XG4gICAgICAgICAgICBWZWMzLm5vcm1hbGl6ZShkaXIsIGRpcik7XG4gICAgICAgICAgICBwb3MueiA9IDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBFbWl0TG9jYXRpb24uU2hlbGw6XG4gICAgICAgICAgICBmaXhlZEFuZ2xlVW5pdFZlY3RvcjIocG9zLCB0aGV0YSk7XG4gICAgICAgICAgICBWZWMyLnNjYWxlKGRpciwgcG9zLCBNYXRoLnNpbihhbmdsZSkpO1xuICAgICAgICAgICAgZGlyLnogPSAtTWF0aC5jb3MoYW5nbGUpO1xuICAgICAgICAgICAgVmVjMy5ub3JtYWxpemUoZGlyLCBkaXIpO1xuICAgICAgICAgICAgVmVjMi5zY2FsZShwb3MsIHBvcywgcmFkaXVzKTtcbiAgICAgICAgICAgIHBvcy56ID0gMDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEVtaXRMb2NhdGlvbi5Wb2x1bWU6XG4gICAgICAgICAgICByYW5kb21Qb2ludEJldHdlZW5DaXJjbGVBdEZpeGVkQW5nbGUocG9zLCByYWRpdXMgKiAoMSAtIHJhZGl1c1RoaWNrbmVzcyksIHJhZGl1cywgdGhldGEpO1xuICAgICAgICAgICAgVmVjMi5zY2FsZShkaXIsIHBvcywgTWF0aC5zaW4oYW5nbGUpKTtcbiAgICAgICAgICAgIGRpci56ID0gLU1hdGguY29zKGFuZ2xlKSAqIHJhZGl1cztcbiAgICAgICAgICAgIFZlYzMubm9ybWFsaXplKGRpciwgZGlyKTtcbiAgICAgICAgICAgIHBvcy56ID0gMDtcbiAgICAgICAgICAgIFZlYzMuYWRkKHBvcywgcG9zLCBWZWMzLnNjYWxlKF9pbnRlcm1lZGlWZWMsIGRpciwgbGVuZ3RoICogcmFuZG9tKCkgLyAtZGlyLnopKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY29uc29sZS53YXJuKGVtaXRGcm9tICsgJyBpcyBub3Qgc3VwcG9ydGVkIGZvciBjb25lIGVtaXR0ZXIuJyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBib3hFbWl0IChlbWl0RnJvbSwgYm94VGhpY2tuZXNzLCBwb3MsIGRpcikge1xuICAgIHN3aXRjaCAoZW1pdEZyb20pIHtcbiAgICAgICAgY2FzZSBFbWl0TG9jYXRpb24uVm9sdW1lOlxuICAgICAgICAgICAgcmFuZG9tUG9pbnRJbkN1YmUocG9zLCBfdW5pdEJveEV4dGVudCk7XG4gICAgICAgICAgICAvLyByYW5kb21Qb2ludEJldHdlZW5DdWJlKHBvcywgVmVjMy5tdWx0aXBseShfaW50ZXJtZWRpVmVjLCBfdW5pdEJveEV4dGVudCwgYm94VGhpY2tuZXNzKSwgX3VuaXRCb3hFeHRlbnQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgRW1pdExvY2F0aW9uLlNoZWxsOlxuICAgICAgICAgICAgX2ludGVybWVkaUFyci5zcGxpY2UoMCwgX2ludGVybWVkaUFyci5sZW5ndGgpO1xuICAgICAgICAgICAgX2ludGVybWVkaUFyci5wdXNoKHJhbmRvbVJhbmdlKC0wLjUsIDAuNSkpO1xuICAgICAgICAgICAgX2ludGVybWVkaUFyci5wdXNoKHJhbmRvbVJhbmdlKC0wLjUsIDAuNSkpO1xuICAgICAgICAgICAgX2ludGVybWVkaUFyci5wdXNoKHJhbmRvbVNpZ24oKSAqIDAuNSk7XG4gICAgICAgICAgICByYW5kb21Tb3J0QXJyYXkoX2ludGVybWVkaUFycik7XG4gICAgICAgICAgICBhcHBseUJveFRoaWNrbmVzcyhfaW50ZXJtZWRpQXJyLCBib3hUaGlja25lc3MpO1xuICAgICAgICAgICAgVmVjMy5zZXQocG9zLCBfaW50ZXJtZWRpQXJyWzBdLCBfaW50ZXJtZWRpQXJyWzFdLCBfaW50ZXJtZWRpQXJyWzJdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEVtaXRMb2NhdGlvbi5FZGdlOlxuICAgICAgICAgICAgX2ludGVybWVkaUFyci5zcGxpY2UoMCwgX2ludGVybWVkaUFyci5sZW5ndGgpO1xuICAgICAgICAgICAgX2ludGVybWVkaUFyci5wdXNoKHJhbmRvbVJhbmdlKC0wLjUsIDAuNSkpO1xuICAgICAgICAgICAgX2ludGVybWVkaUFyci5wdXNoKHJhbmRvbVNpZ24oKSAqIDAuNSk7XG4gICAgICAgICAgICBfaW50ZXJtZWRpQXJyLnB1c2gocmFuZG9tU2lnbigpICogMC41KTtcbiAgICAgICAgICAgIHJhbmRvbVNvcnRBcnJheShfaW50ZXJtZWRpQXJyKTtcbiAgICAgICAgICAgIGFwcGx5Qm94VGhpY2tuZXNzKF9pbnRlcm1lZGlBcnIsIGJveFRoaWNrbmVzcyk7XG4gICAgICAgICAgICBWZWMzLnNldChwb3MsIF9pbnRlcm1lZGlBcnJbMF0sIF9pbnRlcm1lZGlBcnJbMV0sIF9pbnRlcm1lZGlBcnJbMl0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oZW1pdEZyb20gKyAnIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIGJveCBlbWl0dGVyLicpO1xuICAgIH1cbiAgICBWZWMzLmNvcHkoZGlyLCBwYXJ0aWNsZUVtaXRaQXhpcyk7XG59XG5cbmZ1bmN0aW9uIGNpcmNsZUVtaXQgKHJhZGl1cywgcmFkaXVzVGhpY2tuZXNzLCB0aGV0YSwgcG9zLCBkaXIpIHtcbiAgICByYW5kb21Qb2ludEJldHdlZW5DaXJjbGVBdEZpeGVkQW5nbGUocG9zLCByYWRpdXMgKiAoMSAtIHJhZGl1c1RoaWNrbmVzcyksIHJhZGl1cywgdGhldGEpO1xuICAgIFZlYzMubm9ybWFsaXplKGRpciwgcG9zKTtcbn1cblxuZnVuY3Rpb24gYXBwbHlCb3hUaGlja25lc3MgKHBvcywgdGhpY2tuZXNzKSB7XG4gICAgaWYgKHRoaWNrbmVzcy54ID4gMCkge1xuICAgICAgICBwb3NbMF0gKz0gMC41ICogcmFuZG9tUmFuZ2UoLXRoaWNrbmVzcy54LCB0aGlja25lc3MueCk7XG4gICAgICAgIHBvc1swXSA9IGNsYW1wKHBvc1swXSwgLTAuNSwgMC41KTtcbiAgICB9XG4gICAgaWYgKHRoaWNrbmVzcy55ID4gMCkge1xuICAgICAgICBwb3NbMV0gKz0gMC41ICogcmFuZG9tUmFuZ2UoLXRoaWNrbmVzcy55LCB0aGlja25lc3MueSk7XG4gICAgICAgIHBvc1sxXSA9IGNsYW1wKHBvc1sxXSwgLTAuNSwgMC41KTtcbiAgICB9XG4gICAgaWYgKHRoaWNrbmVzcy56ID4gMCkge1xuICAgICAgICBwb3NbMl0gKz0gMC41ICogcmFuZG9tUmFuZ2UoLXRoaWNrbmVzcy56LCB0aGlja25lc3Mueik7XG4gICAgICAgIHBvc1syXSA9IGNsYW1wKHBvc1syXSwgLTAuNSwgMC41KTtcbiAgICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==