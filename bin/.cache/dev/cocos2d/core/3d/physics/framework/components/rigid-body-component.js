
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/framework/components/rigid-body-component.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.RigidBody3D = void 0;

var _instance = require("../instance");

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _temp;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

var _cc$_decorator = cc._decorator,
    ccclass = _cc$_decorator.ccclass,
    disallowMultiple = _cc$_decorator.disallowMultiple,
    executeInEditMode = _cc$_decorator.executeInEditMode,
    executionOrder = _cc$_decorator.executionOrder,
    menu = _cc$_decorator.menu,
    property = _cc$_decorator.property;
var Vec3 = cc.Vec3;
/**
 * !#en
 * RigidBody is the basic object that make up the physical world, and it can make a node physically affected and react.
 * !#zh
 * 刚体是组成物理世界的基本对象，可以让一个节点受到物理影响并产生反应。该组件在使用 Builtin 物理引擎时无效。
 * @class RigidBody3D
 * @extends Component
 */

var RigidBody3D = (_dec = ccclass('cc.RigidBody3D'), _dec2 = executionOrder(99), _dec3 = menu('i18n:MAIN_MENU.component.physics/Rigid Body 3D'), _dec4 = property({
  displayOrder: 0
}), _dec5 = property({
  displayOrder: 1
}), _dec6 = property({
  displayOrder: 2
}), _dec7 = property({
  displayOrder: 3
}), _dec8 = property({
  displayOrder: 4
}), _dec9 = property({
  displayOrder: 5
}), _dec10 = property({
  displayOrder: 6
}), _dec11 = property({
  displayOrder: 7
}), _dec(_class = _dec2(_class = _dec3(_class = executeInEditMode(_class = disallowMultiple(_class = (_class2 = (_temp = /*#__PURE__*/function (_cc$Component) {
  _inheritsLoose(RigidBody3D, _cc$Component);

  function RigidBody3D() {
    var _this;

    _this = _cc$Component.call(this) || this;
    _this._body = void 0;
    _this._allowSleep = true;

    _initializerDefineProperty(_this, "_mass", _descriptor, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_linearDamping", _descriptor2, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_angularDamping", _descriptor3, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_fixedRotation", _descriptor4, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_isKinematic", _descriptor5, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_useGravity", _descriptor6, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_linearFactor", _descriptor7, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_angularFactor", _descriptor8, _assertThisInitialized(_this));

    if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      _this._body = (0, _instance.createRigidBody)();
    }

    return _this;
  } /// COMPONENT LIFECYCLE ///


  var _proto = RigidBody3D.prototype;

  _proto.__preload = function __preload() {
    if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.__preload(this);
    }
  };

  _proto.onEnable = function onEnable() {
    if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.onEnable();
    }
  };

  _proto.onDisable = function onDisable() {
    if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.onDisable();
    }
  };

  _proto.onDestroy = function onDestroy() {
    if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.onDestroy();
    }
  } /// PUBLIC METHOD ///

  /**
   * !#en
   * A force is applied to a rigid body at a point in world space.
   * !#zh
   * 在世界空间中的某点上对刚体施加一个作用力。
   * @method applyForce
   * @param {Vec3} force
   * @param {Vec3} relativePoint The point of action, relative to the center of the rigid body.
   */
  ;

  _proto.applyForce = function applyForce(force, relativePoint) {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.applyForce(force, relativePoint);
    }
  }
  /**
   * !#en
   * Apply a force on the rigid body at a point in local space.
   * !#zh
   * 在本地空间中的某点上对刚体施加一个作用力。
   * @method applyLocalForce
   * @param {Vec3} force 
   * @param {Vec3} localPoint Point of application
   */
  ;

  _proto.applyLocalForce = function applyLocalForce(force, localPoint) {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.applyLocalForce(force, localPoint);
    }
  }
  /**
   * !#en
   * Apply an impulse to a rigid body at a point in world space.
   * !#zh
   * 在世界空间的某点上对刚体施加一个冲量。
   * @method applyImpulse
   * @param {Vec3} impulse
   * @param {Vec3} relativePoint The point of action, relative to the center of the rigid body.
   */
  ;

  _proto.applyImpulse = function applyImpulse(impulse, relativePoint) {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.applyImpulse(impulse, relativePoint);
    }
  }
  /**
   * !#en
   * Apply an impulse to the rigid body at a point in local space.
   * !#zh
   * 在本地空间的某点上对刚体施加一个冲量。
   * @method applyLocalImpulse
   * @param {Vec3} impulse
   * @param {Vec3} localPoint Point of application
   */
  ;

  _proto.applyLocalImpulse = function applyLocalImpulse(impulse, localPoint) {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.applyLocalImpulse(impulse, localPoint);
    }
  }
  /**
   * !#en
   * Apply a torque to the rigid body.
   * !#zh
   * 对刚体施加扭转力。
   * @method applyTorque
   * @param {Vec3} torque
   */
  ;

  _proto.applyTorque = function applyTorque(torque) {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.applyTorque(torque);
    }
  }
  /**
   * !#en
   * Apply a local torque to the rigid body.
   * !#zh
   * 对刚体施加本地扭转力。
   * @method applyLocalTorque
   * @param {Vec3} torque
   */
  ;

  _proto.applyLocalTorque = function applyLocalTorque(torque) {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.applyLocalTorque(torque);
    }
  }
  /**
   * !#en
   * Awaken the rigid body.
   * !#zh
   * 唤醒刚体。
   * @method wakeUp
   */
  ;

  _proto.wakeUp = function wakeUp() {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.wakeUp();
    }
  }
  /**
   * !#en
   * Dormant rigid body.
   * !#zh
   * 休眠刚体。
   * @method sleep
   */
  ;

  _proto.sleep = function sleep() {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.sleep();
    }
  }
  /**
   * !#en
   * Get linear velocity.
   * !#zh
   * 获取线性速度。
   * @method getLinearVelocity
   * @param {Vec3} out
   */
  ;

  _proto.getLinearVelocity = function getLinearVelocity(out) {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.getLinearVelocity(out);
    }
  }
  /**
   * !#en
   * Set linear speed.
   * !#zh
   * 设置线性速度。
   * @method setLinearVelocity
   * @param {Vec3} value 
   */
  ;

  _proto.setLinearVelocity = function setLinearVelocity(value) {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.setLinearVelocity(value);
    }
  }
  /**
   * !#en
   * Gets the rotation speed.
   * !#zh
   * 获取旋转速度。
   * @method getAngularVelocity
   * @param {Vec3} out 
   */
  ;

  _proto.getAngularVelocity = function getAngularVelocity(out) {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.getAngularVelocity(out);
    }
  }
  /**
   * !#en
   * Set rotation speed.
   * !#zh
   * 设置旋转速度。
   * @method setAngularVelocity
   * @param {Vec3} value 
   */
  ;

  _proto.setAngularVelocity = function setAngularVelocity(value) {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.setAngularVelocity(value);
    }
  };

  _createClass(RigidBody3D, [{
    key: "allowSleep",
    get: /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * !#en
     * Whether sleep is allowed.
     * !#zh
     * 是否允许休眠。
     * @property {boolean} allowSleep
     */
    function get() {
      return this._allowSleep;
    },
    set: function set(v) {
      this._allowSleep = v;

      if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        this._body.allowSleep = v;
      }
    }
    /**
     * !#en
     * The mass of the rigidbody.
     * !#zh
     * 刚体的质量。
     * @property {number} mass
     */

  }, {
    key: "mass",
    get: function get() {
      return this._mass;
    },
    set: function set(value) {
      this._mass = value;

      if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        this._body.mass = value;
      }
    }
    /**
     * !#en
     * Used to reduce the linear rate of rigidbody. The larger the value, the slower the rigidbody moves.
     * !#zh
     * 线性阻尼，用于减小刚体的线性速率，值越大物体移动越慢。
     * @property {number} linearDamping
     */

  }, {
    key: "linearDamping",
    get: function get() {
      return this._linearDamping;
    },
    set: function set(value) {
      this._linearDamping = value;

      if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        this._body.linearDamping = value;
      }
    }
    /**
     * !#en
     * Used to reduce the rotation rate of rigidbody. The larger the value, the slower the rigidbody rotates.
     * !#zh
     * 角阻尼，用于减小刚体的旋转速率，值越大刚体旋转越慢。
     * @property {number} angularDamping
     */

  }, {
    key: "angularDamping",
    get: function get() {
      return this._angularDamping;
    },
    set: function set(value) {
      this._angularDamping = value;

      if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        this._body.angularDamping = value;
      }
    }
    /**
     * !#en
     * If enabled, the developer controls the displacement and rotation of the rigidbody, not the physics engine.
     * !#zh
     * 是否由开发者来控制刚体的位移和旋转，而不是受物理引擎的影响。
     * @property {boolean} isKinematic
     */

  }, {
    key: "isKinematic",
    get: function get() {
      return this._isKinematic;
    },
    set: function set(value) {
      this._isKinematic = value;

      if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        this._body.isKinematic = value;
      }
    }
    /**
     * !#en
     * If enabled, the rigidbody is affected by gravity.
     * !#zh
     * 如果开启，刚体会受到重力影响。
     * @property {boolean} useGravity
     */

  }, {
    key: "useGravity",
    get: function get() {
      return this._useGravity;
    },
    set: function set(value) {
      this._useGravity = value;

      if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        this._body.useGravity = value;
      }
    }
    /**
     * !#en
     * If enabled, the rigidbody will be fixed without rotation during a collision.
     * !#zh
     * 如果开启，发生碰撞时会固定刚体不产生旋转。
     * @property {boolean} fixedRotation
     */

  }, {
    key: "fixedRotation",
    get: function get() {
      return this._fixedRotation;
    },
    set: function set(value) {
      this._fixedRotation = value;

      if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        this._body.fixedRotation = value;
      }
    }
    /**
     * !#en
     * It can affect the linear velocity change of the rigidbody in each axis. The larger the value, the faster the rigidbody moves.
     * !#zh
     * 线性因子，可影响刚体在每个轴向的线性速度变化，值越大刚体移动越快。
     * @property {Vec3} linearFactor
     */

  }, {
    key: "linearFactor",
    get: function get() {
      return this._linearFactor;
    },
    set: function set(value) {
      Vec3.copy(this._linearFactor, value);

      if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        this._body.linearFactor = this._linearFactor;
      }
    }
    /**
     * !#en
     * It can affect the rotation speed change of the rigidbody in each axis. The larger the value, the faster the rigidbody rotates.
     * !#zh
     * 旋转因子，可影响刚体在每个轴向的旋转速度变化，值越大刚体旋转越快。
     * @property {Vec3} angularFactor
     */

  }, {
    key: "angularFactor",
    get: function get() {
      return this._angularFactor;
    },
    set: function set(value) {
      Vec3.copy(this._angularFactor, value);

      if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        this._body.angularFactor = this._angularFactor;
      }
    }
    /**
     * !#en
     * The rigidbody is awake.
     * !#zh
     * 刚体是否为唤醒的状态。
     * @property {boolean} isAwake
     * @readonly
     */

  }, {
    key: "isAwake",
    get: function get() {
      if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        return this._body.isAwake;
      }

      return false;
    }
    /**
     * !#en
     * The rigidbody can enter hibernation.
     * !#zh
     * 刚体是否为可进入休眠的状态。
     * @property {boolean} isSleepy
     * @readonly
     */

  }, {
    key: "isSleepy",
    get: function get() {
      if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        return this._body.isSleepy;
      }

      return false;
    }
    /**
     * !#en
     * The rigidbody is sleeping.
     * !#zh
     * 刚体是否为正在休眠的状态。
     * @property {boolean} isSleeping
     * @readonly
     */

  }, {
    key: "isSleeping",
    get: function get() {
      if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        return this._body.isSleeping;
      }

      return false;
    }
    /**
     * !#en
     * Get the rigidbody object inside the physics engine.
     * !#zh
     * 获得物理引擎内部刚体对象。
     * @property {IRigidBody} rigidBody
     * @readonly
     */

  }, {
    key: "rigidBody",
    get: function get() {
      return this._body;
    }
  }, {
    key: "_assertOnload",
    get: function get() {
      var r = this._isOnLoadCalled == 0;

      if (r) {
        cc.error('Physics Error: Please make sure that the node has been added to the scene');
      }

      return !r;
    }
  }]);

  return RigidBody3D;
}(cc.Component), _temp), (_applyDecoratedDescriptor(_class2.prototype, "mass", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "mass"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "linearDamping", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "linearDamping"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "angularDamping", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "angularDamping"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isKinematic", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "isKinematic"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "useGravity", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "useGravity"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "fixedRotation", [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "fixedRotation"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "linearFactor", [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "linearFactor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "angularFactor", [_dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "angularFactor"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_mass", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 10;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_linearDamping", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0.1;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_angularDamping", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0.1;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_fixedRotation", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_isKinematic", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_useGravity", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "_linearFactor", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Vec3(1, 1, 1);
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "_angularFactor", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Vec3(1, 1, 1);
  }
})), _class2)) || _class) || _class) || _class) || _class) || _class);
exports.RigidBody3D = RigidBody3D;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BoeXNpY3MvZnJhbWV3b3JrL2NvbXBvbmVudHMvcmlnaWQtYm9keS1jb21wb25lbnQudHMiXSwibmFtZXMiOlsiY2MiLCJfZGVjb3JhdG9yIiwiY2NjbGFzcyIsImRpc2FsbG93TXVsdGlwbGUiLCJleGVjdXRlSW5FZGl0TW9kZSIsImV4ZWN1dGlvbk9yZGVyIiwibWVudSIsInByb3BlcnR5IiwiVmVjMyIsIlJpZ2lkQm9keTNEIiwiZGlzcGxheU9yZGVyIiwiX2JvZHkiLCJfYWxsb3dTbGVlcCIsIkNDX0VESVRPUiIsIkNDX1BIWVNJQ1NfQlVJTFRJTiIsIl9fcHJlbG9hZCIsIm9uRW5hYmxlIiwib25EaXNhYmxlIiwib25EZXN0cm95IiwiYXBwbHlGb3JjZSIsImZvcmNlIiwicmVsYXRpdmVQb2ludCIsIl9hc3NlcnRPbmxvYWQiLCJhcHBseUxvY2FsRm9yY2UiLCJsb2NhbFBvaW50IiwiYXBwbHlJbXB1bHNlIiwiaW1wdWxzZSIsImFwcGx5TG9jYWxJbXB1bHNlIiwiYXBwbHlUb3JxdWUiLCJ0b3JxdWUiLCJhcHBseUxvY2FsVG9ycXVlIiwid2FrZVVwIiwic2xlZXAiLCJnZXRMaW5lYXJWZWxvY2l0eSIsIm91dCIsInNldExpbmVhclZlbG9jaXR5IiwidmFsdWUiLCJnZXRBbmd1bGFyVmVsb2NpdHkiLCJzZXRBbmd1bGFyVmVsb2NpdHkiLCJ2IiwiYWxsb3dTbGVlcCIsIl9tYXNzIiwibWFzcyIsIl9saW5lYXJEYW1waW5nIiwibGluZWFyRGFtcGluZyIsIl9hbmd1bGFyRGFtcGluZyIsImFuZ3VsYXJEYW1waW5nIiwiX2lzS2luZW1hdGljIiwiaXNLaW5lbWF0aWMiLCJfdXNlR3Jhdml0eSIsInVzZUdyYXZpdHkiLCJfZml4ZWRSb3RhdGlvbiIsImZpeGVkUm90YXRpb24iLCJfbGluZWFyRmFjdG9yIiwiY29weSIsImxpbmVhckZhY3RvciIsIl9hbmd1bGFyRmFjdG9yIiwiYW5ndWxhckZhY3RvciIsImlzQXdha2UiLCJpc1NsZWVweSIsImlzU2xlZXBpbmciLCJyIiwiX2lzT25Mb2FkQ2FsbGVkIiwiZXJyb3IiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQVNJQSxFQUFFLENBQUNDO0lBTkhDLHlCQUFBQTtJQUNBQyxrQ0FBQUE7SUFDQUMsbUNBQUFBO0lBQ0FDLGdDQUFBQTtJQUNBQyxzQkFBQUE7SUFDQUMsMEJBQUFBO0FBRUosSUFBTUMsSUFBSSxHQUFHUixFQUFFLENBQUNRLElBQWhCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7SUFNYUMsc0JBTFpQLE9BQU8sQ0FBQyxnQkFBRCxXQUNQRyxjQUFjLENBQUMsRUFBRCxXQUNkQyxJQUFJLENBQUMsZ0RBQUQsV0FnQ0FDLFFBQVEsQ0FBQztBQUNORyxFQUFBQSxZQUFZLEVBQUU7QUFEUixDQUFELFdBcUJSSCxRQUFRLENBQUM7QUFDTkcsRUFBQUEsWUFBWSxFQUFFO0FBRFIsQ0FBRCxXQXFCUkgsUUFBUSxDQUFDO0FBQ05HLEVBQUFBLFlBQVksRUFBRTtBQURSLENBQUQsV0FxQlJILFFBQVEsQ0FBQztBQUNORyxFQUFBQSxZQUFZLEVBQUU7QUFEUixDQUFELFdBcUJSSCxRQUFRLENBQUM7QUFDTkcsRUFBQUEsWUFBWSxFQUFFO0FBRFIsQ0FBRCxXQXFCUkgsUUFBUSxDQUFDO0FBQ05HLEVBQUFBLFlBQVksRUFBRTtBQURSLENBQUQsWUFxQlJILFFBQVEsQ0FBQztBQUNORyxFQUFBQSxZQUFZLEVBQUU7QUFEUixDQUFELFlBcUJSSCxRQUFRLENBQUM7QUFDTkcsRUFBQUEsWUFBWSxFQUFFO0FBRFIsQ0FBRCwrQ0FsTFpOLDJCQUNBRDs7O0FBNlJHLHlCQUFlO0FBQUE7O0FBQ1g7QUFEVyxVQXJDUFEsS0FxQ087QUFBQSxVQWhDUEMsV0FnQ08sR0FoQ2dCLElBZ0NoQjs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFB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QUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O1NBQ0ksZUFBa0M7QUFDOUIsVUFBSSxLQUFLckMsYUFBTCxJQUFzQixDQUFDVCxTQUF2QixJQUFvQyxDQUFDQyxrQkFBekMsRUFBNkQ7QUFDekQsZUFBTyxLQUFLSCxLQUFMLENBQVdpRCxVQUFsQjtBQUNIOztBQUNELGFBQU8sS0FBUDtBQUNIO0FBRUQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztTQUNJLGVBQXdCO0FBQ3BCLGFBQU8sS0FBS2pELEtBQVo7QUFDSDs7O1NBaUNELGVBQXdDO0FBQ3BDLFVBQU1rRCxDQUFDLEdBQUcsS0FBS0MsZUFBTCxJQUF3QixDQUFsQzs7QUFDQSxVQUFJRCxDQUFKLEVBQU87QUFBRTdELFFBQUFBLEVBQUUsQ0FBQytELEtBQUgsQ0FBUywyRUFBVDtBQUF3Rjs7QUFDakcsYUFBTyxDQUFDRixDQUFSO0FBQ0g7Ozs7RUExUjRCN0QsRUFBRSxDQUFDZ0UsZzBDQThQL0J6RDs7Ozs7V0FDdUI7O21GQUV2QkE7Ozs7O1dBQ2dDOztvRkFFaENBOzs7OztXQUNpQzs7bUZBRWpDQTs7Ozs7V0FDaUM7O2lGQUVqQ0E7Ozs7O1dBQytCOztnRkFFL0JBOzs7OztXQUM4Qjs7a0ZBRTlCQTs7Ozs7V0FDZ0MsSUFBSUMsSUFBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZjs7bUZBRWhDRDs7Ozs7V0FDaUMsSUFBSUMsSUFBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgeyBJUmlnaWRCb2R5IH0gZnJvbSAnLi4vLi4vc3BlYy9JLXJpZ2lkLWJvZHknO1xuaW1wb3J0IHsgY3JlYXRlUmlnaWRCb2R5IH0gZnJvbSAnLi4vaW5zdGFuY2UnO1xuXG5jb25zdCB7XG4gICAgY2NjbGFzcyxcbiAgICBkaXNhbGxvd011bHRpcGxlLFxuICAgIGV4ZWN1dGVJbkVkaXRNb2RlLFxuICAgIGV4ZWN1dGlvbk9yZGVyLFxuICAgIG1lbnUsXG4gICAgcHJvcGVydHksXG59ID0gY2MuX2RlY29yYXRvcjtcbmNvbnN0IFZlYzMgPSBjYy5WZWMzO1xuXG4vKipcbiAqICEjZW5cbiAqIFJpZ2lkQm9keSBpcyB0aGUgYmFzaWMgb2JqZWN0IHRoYXQgbWFrZSB1cCB0aGUgcGh5c2ljYWwgd29ybGQsIGFuZCBpdCBjYW4gbWFrZSBhIG5vZGUgcGh5c2ljYWxseSBhZmZlY3RlZCBhbmQgcmVhY3QuXG4gKiAhI3poXG4gKiDliJrkvZPmmK/nu4TmiJDniannkIbkuJbnlYznmoTln7rmnKzlr7nosaHvvIzlj6/ku6XorqnkuIDkuKroioLngrnlj5fliLDniannkIblvbHlk43lubbkuqfnlJ/lj43lupTjgILor6Xnu4Tku7blnKjkvb/nlKggQnVpbHRpbiDniannkIblvJXmk47ml7bml6DmlYjjgIJcbiAqIEBjbGFzcyBSaWdpZEJvZHkzRFxuICogQGV4dGVuZHMgQ29tcG9uZW50XG4gKi9cbkBjY2NsYXNzKCdjYy5SaWdpZEJvZHkzRCcpXG5AZXhlY3V0aW9uT3JkZXIoOTkpXG5AbWVudSgnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnBoeXNpY3MvUmlnaWQgQm9keSAzRCcpXG5AZXhlY3V0ZUluRWRpdE1vZGVcbkBkaXNhbGxvd011bHRpcGxlXG5leHBvcnQgY2xhc3MgUmlnaWRCb2R5M0QgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xuXG4gICAgLy8vIFBVQkxJQyBQUk9QRVJUWSBHRVRURVJcXFNFVFRFUiAvLy9cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBXaGV0aGVyIHNsZWVwIGlzIGFsbG93ZWQuXG4gICAgICogISN6aFxuICAgICAqIOaYr+WQpuWFgeiuuOS8keecoOOAglxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gYWxsb3dTbGVlcFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgYWxsb3dTbGVlcCAoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hbGxvd1NsZWVwO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgYWxsb3dTbGVlcCAodjogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9hbGxvd1NsZWVwID0gdjtcbiAgICAgICAgaWYgKCFDQ19FRElUT1IgJiYgIUNDX1BIWVNJQ1NfQlVJTFRJTikge1xuICAgICAgICAgICAgdGhpcy5fYm9keS5hbGxvd1NsZWVwID0gdjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBUaGUgbWFzcyBvZiB0aGUgcmlnaWRib2R5LlxuICAgICAqICEjemhcbiAgICAgKiDliJrkvZPnmoTotKjph4/jgIJcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gbWFzc1xuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIGRpc3BsYXlPcmRlcjogMFxuICAgIH0pXG4gICAgcHVibGljIGdldCBtYXNzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hc3M7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBtYXNzICh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9tYXNzID0gdmFsdWU7XG4gICAgICAgIGlmICghQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkubWFzcyA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFVzZWQgdG8gcmVkdWNlIHRoZSBsaW5lYXIgcmF0ZSBvZiByaWdpZGJvZHkuIFRoZSBsYXJnZXIgdGhlIHZhbHVlLCB0aGUgc2xvd2VyIHRoZSByaWdpZGJvZHkgbW92ZXMuXG4gICAgICogISN6aFxuICAgICAqIOe6v+aAp+mYu+WwvO+8jOeUqOS6juWHj+Wwj+WImuS9k+eahOe6v+aAp+mAn+eOh++8jOWAvOi2iuWkp+eJqeS9k+enu+WKqOi2iuaFouOAglxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsaW5lYXJEYW1waW5nXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgZGlzcGxheU9yZGVyOiAxXG4gICAgfSlcbiAgICBwdWJsaWMgZ2V0IGxpbmVhckRhbXBpbmcgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGluZWFyRGFtcGluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGxpbmVhckRhbXBpbmcgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2xpbmVhckRhbXBpbmcgPSB2YWx1ZTtcbiAgICAgICAgaWYgKCFDQ19FRElUT1IgJiYgIUNDX1BIWVNJQ1NfQlVJTFRJTikge1xuICAgICAgICAgICAgdGhpcy5fYm9keS5saW5lYXJEYW1waW5nID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVXNlZCB0byByZWR1Y2UgdGhlIHJvdGF0aW9uIHJhdGUgb2YgcmlnaWRib2R5LiBUaGUgbGFyZ2VyIHRoZSB2YWx1ZSwgdGhlIHNsb3dlciB0aGUgcmlnaWRib2R5IHJvdGF0ZXMuXG4gICAgICogISN6aFxuICAgICAqIOinkumYu+WwvO+8jOeUqOS6juWHj+Wwj+WImuS9k+eahOaXi+i9rOmAn+eOh++8jOWAvOi2iuWkp+WImuS9k+aXi+i9rOi2iuaFouOAglxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBhbmd1bGFyRGFtcGluZ1xuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIGRpc3BsYXlPcmRlcjogMlxuICAgIH0pXG4gICAgcHVibGljIGdldCBhbmd1bGFyRGFtcGluZyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hbmd1bGFyRGFtcGluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGFuZ3VsYXJEYW1waW5nICh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9hbmd1bGFyRGFtcGluZyA9IHZhbHVlO1xuICAgICAgICBpZiAoIUNDX0VESVRPUiAmJiAhQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2R5LmFuZ3VsYXJEYW1waW5nID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogSWYgZW5hYmxlZCwgdGhlIGRldmVsb3BlciBjb250cm9scyB0aGUgZGlzcGxhY2VtZW50IGFuZCByb3RhdGlvbiBvZiB0aGUgcmlnaWRib2R5LCBub3QgdGhlIHBoeXNpY3MgZW5naW5lLlxuICAgICAqICEjemhcbiAgICAgKiDmmK/lkKbnlLHlvIDlj5HogIXmnaXmjqfliLbliJrkvZPnmoTkvY3np7vlkozml4vovazvvIzogIzkuI3mmK/lj5fniannkIblvJXmk47nmoTlvbHlk43jgIJcbiAgICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzS2luZW1hdGljXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgZGlzcGxheU9yZGVyOiAzXG4gICAgfSlcbiAgICBwdWJsaWMgZ2V0IGlzS2luZW1hdGljICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzS2luZW1hdGljO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgaXNLaW5lbWF0aWMgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2lzS2luZW1hdGljID0gdmFsdWU7XG4gICAgICAgIGlmICghQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkuaXNLaW5lbWF0aWMgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBJZiBlbmFibGVkLCB0aGUgcmlnaWRib2R5IGlzIGFmZmVjdGVkIGJ5IGdyYXZpdHkuXG4gICAgICogISN6aFxuICAgICAqIOWmguaenOW8gOWQr++8jOWImuS9k+S8muWPl+WIsOmHjeWKm+W9seWTjeOAglxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gdXNlR3Jhdml0eVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIGRpc3BsYXlPcmRlcjogNFxuICAgIH0pXG4gICAgcHVibGljIGdldCB1c2VHcmF2aXR5ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VzZUdyYXZpdHk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCB1c2VHcmF2aXR5ICh2YWx1ZSkge1xuICAgICAgICB0aGlzLl91c2VHcmF2aXR5ID0gdmFsdWU7XG4gICAgICAgIGlmICghQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkudXNlR3Jhdml0eSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIElmIGVuYWJsZWQsIHRoZSByaWdpZGJvZHkgd2lsbCBiZSBmaXhlZCB3aXRob3V0IHJvdGF0aW9uIGR1cmluZyBhIGNvbGxpc2lvbi5cbiAgICAgKiAhI3poXG4gICAgICog5aaC5p6c5byA5ZCv77yM5Y+R55Sf56Kw5pKe5pe25Lya5Zu65a6a5Yia5L2T5LiN5Lqn55Sf5peL6L2s44CCXG4gICAgICogQHByb3BlcnR5IHtib29sZWFufSBmaXhlZFJvdGF0aW9uXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgZGlzcGxheU9yZGVyOiA1XG4gICAgfSlcbiAgICBwdWJsaWMgZ2V0IGZpeGVkUm90YXRpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZml4ZWRSb3RhdGlvbjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGZpeGVkUm90YXRpb24gKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2ZpeGVkUm90YXRpb24gPSB2YWx1ZTtcbiAgICAgICAgaWYgKCFDQ19FRElUT1IgJiYgIUNDX1BIWVNJQ1NfQlVJTFRJTikge1xuICAgICAgICAgICAgdGhpcy5fYm9keS5maXhlZFJvdGF0aW9uID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogSXQgY2FuIGFmZmVjdCB0aGUgbGluZWFyIHZlbG9jaXR5IGNoYW5nZSBvZiB0aGUgcmlnaWRib2R5IGluIGVhY2ggYXhpcy4gVGhlIGxhcmdlciB0aGUgdmFsdWUsIHRoZSBmYXN0ZXIgdGhlIHJpZ2lkYm9keSBtb3Zlcy5cbiAgICAgKiAhI3poXG4gICAgICog57q/5oCn5Zug5a2Q77yM5Y+v5b2x5ZON5Yia5L2T5Zyo5q+P5Liq6L205ZCR55qE57q/5oCn6YCf5bqm5Y+Y5YyW77yM5YC86LaK5aSn5Yia5L2T56e75Yqo6LaK5b+r44CCXG4gICAgICogQHByb3BlcnR5IHtWZWMzfSBsaW5lYXJGYWN0b3JcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICBkaXNwbGF5T3JkZXI6IDZcbiAgICB9KVxuICAgIHB1YmxpYyBnZXQgbGluZWFyRmFjdG9yICgpOiBjYy5WZWMzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpbmVhckZhY3RvcjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGxpbmVhckZhY3RvciAodmFsdWU6IGNjLlZlYzMpIHtcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMuX2xpbmVhckZhY3RvciwgdmFsdWUpO1xuICAgICAgICBpZiAoIUNDX0VESVRPUiAmJiAhQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2R5LmxpbmVhckZhY3RvciA9IHRoaXMuX2xpbmVhckZhY3RvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBJdCBjYW4gYWZmZWN0IHRoZSByb3RhdGlvbiBzcGVlZCBjaGFuZ2Ugb2YgdGhlIHJpZ2lkYm9keSBpbiBlYWNoIGF4aXMuIFRoZSBsYXJnZXIgdGhlIHZhbHVlLCB0aGUgZmFzdGVyIHRoZSByaWdpZGJvZHkgcm90YXRlcy5cbiAgICAgKiAhI3poXG4gICAgICog5peL6L2s5Zug5a2Q77yM5Y+v5b2x5ZON5Yia5L2T5Zyo5q+P5Liq6L205ZCR55qE5peL6L2s6YCf5bqm5Y+Y5YyW77yM5YC86LaK5aSn5Yia5L2T5peL6L2s6LaK5b+r44CCXG4gICAgICogQHByb3BlcnR5IHtWZWMzfSBhbmd1bGFyRmFjdG9yXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgZGlzcGxheU9yZGVyOiA3XG4gICAgfSlcbiAgICBwdWJsaWMgZ2V0IGFuZ3VsYXJGYWN0b3IgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYW5ndWxhckZhY3RvcjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGFuZ3VsYXJGYWN0b3IgKHZhbHVlOiBjYy5WZWMzKSB7XG4gICAgICAgIFZlYzMuY29weSh0aGlzLl9hbmd1bGFyRmFjdG9yLCB2YWx1ZSk7XG4gICAgICAgIGlmICghQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkuYW5ndWxhckZhY3RvciA9IHRoaXMuX2FuZ3VsYXJGYWN0b3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVGhlIHJpZ2lkYm9keSBpcyBhd2FrZS5cbiAgICAgKiAhI3poXG4gICAgICog5Yia5L2T5piv5ZCm5Li65ZSk6YaS55qE54q25oCB44CCXG4gICAgICogQHByb3BlcnR5IHtib29sZWFufSBpc0F3YWtlXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgcHVibGljIGdldCBpc0F3YWtlICgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9ubG9hZCAmJiAhQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib2R5LmlzQXdha2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBUaGUgcmlnaWRib2R5IGNhbiBlbnRlciBoaWJlcm5hdGlvbi5cbiAgICAgKiAhI3poXG4gICAgICog5Yia5L2T5piv5ZCm5Li65Y+v6L+b5YWl5LyR55yg55qE54q25oCB44CCXG4gICAgICogQHByb3BlcnR5IHtib29sZWFufSBpc1NsZWVweVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaXNTbGVlcHkgKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25sb2FkICYmICFDQ19FRElUT1IgJiYgIUNDX1BIWVNJQ1NfQlVJTFRJTikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvZHkuaXNTbGVlcHk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBUaGUgcmlnaWRib2R5IGlzIHNsZWVwaW5nLlxuICAgICAqICEjemhcbiAgICAgKiDliJrkvZPmmK/lkKbkuLrmraPlnKjkvJHnnKDnmoTnirbmgIHjgIJcbiAgICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzU2xlZXBpbmdcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGlzU2xlZXBpbmcgKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25sb2FkICYmICFDQ19FRElUT1IgJiYgIUNDX1BIWVNJQ1NfQlVJTFRJTikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvZHkuaXNTbGVlcGluZztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldCB0aGUgcmlnaWRib2R5IG9iamVjdCBpbnNpZGUgdGhlIHBoeXNpY3MgZW5naW5lLlxuICAgICAqICEjemhcbiAgICAgKiDojrflvpfniannkIblvJXmk47lhoXpg6jliJrkvZPlr7nosaHjgIJcbiAgICAgKiBAcHJvcGVydHkge0lSaWdpZEJvZHl9IHJpZ2lkQm9keVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgcmlnaWRCb2R5ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvZHk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfYm9keSE6IElSaWdpZEJvZHk7XG5cbiAgICAvLy8gUFJJVkFURSBQUk9QRVJUWSAvLy9cblxuICAgIC8vIEBwcm9wZXJ0eVxuICAgIHByaXZhdGUgX2FsbG93U2xlZXA6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQHByb3BlcnR5XG4gICAgcHJpdmF0ZSBfbWFzczogbnVtYmVyID0gMTA7XG5cbiAgICBAcHJvcGVydHlcbiAgICBwcml2YXRlIF9saW5lYXJEYW1waW5nOiBudW1iZXIgPSAwLjE7XG5cbiAgICBAcHJvcGVydHlcbiAgICBwcml2YXRlIF9hbmd1bGFyRGFtcGluZzogbnVtYmVyID0gMC4xO1xuXG4gICAgQHByb3BlcnR5XG4gICAgcHJpdmF0ZSBfZml4ZWRSb3RhdGlvbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQHByb3BlcnR5XG4gICAgcHJpdmF0ZSBfaXNLaW5lbWF0aWM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBwcm9wZXJ0eVxuICAgIHByaXZhdGUgX3VzZUdyYXZpdHk6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQHByb3BlcnR5XG4gICAgcHJpdmF0ZSBfbGluZWFyRmFjdG9yOiBjYy5WZWMzID0gbmV3IFZlYzMoMSwgMSwgMSk7XG5cbiAgICBAcHJvcGVydHlcbiAgICBwcml2YXRlIF9hbmd1bGFyRmFjdG9yOiBjYy5WZWMzID0gbmV3IFZlYzMoMSwgMSwgMSk7XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IF9hc3NlcnRPbmxvYWQgKCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCByID0gdGhpcy5faXNPbkxvYWRDYWxsZWQgPT0gMDtcbiAgICAgICAgaWYgKHIpIHsgY2MuZXJyb3IoJ1BoeXNpY3MgRXJyb3I6IFBsZWFzZSBtYWtlIHN1cmUgdGhhdCB0aGUgbm9kZSBoYXMgYmVlbiBhZGRlZCB0byB0aGUgc2NlbmUnKTsgfVxuICAgICAgICByZXR1cm4gIXI7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBpZiAoIUNDX0VESVRPUiAmJiAhQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2R5ID0gY3JlYXRlUmlnaWRCb2R5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLy8gQ09NUE9ORU5UIExJRkVDWUNMRSAvLy9cblxuICAgIHByb3RlY3RlZCBfX3ByZWxvYWQgKCkge1xuICAgICAgICBpZiAoIUNDX0VESVRPUiAmJiAhQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2R5Ll9fcHJlbG9hZCEodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb25FbmFibGUgKCkge1xuICAgICAgICBpZiAoIUNDX0VESVRPUiAmJiAhQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2R5Lm9uRW5hYmxlISgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uRGlzYWJsZSAoKSB7XG4gICAgICAgIGlmICghQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkub25EaXNhYmxlISgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uRGVzdHJveSAoKSB7XG4gICAgICAgIGlmICghQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkub25EZXN0cm95ISgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8vIFBVQkxJQyBNRVRIT0QgLy8vXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQSBmb3JjZSBpcyBhcHBsaWVkIHRvIGEgcmlnaWQgYm9keSBhdCBhIHBvaW50IGluIHdvcmxkIHNwYWNlLlxuICAgICAqICEjemhcbiAgICAgKiDlnKjkuJbnlYznqbrpl7TkuK3nmoTmn5DngrnkuIrlr7nliJrkvZPmlr3liqDkuIDkuKrkvZznlKjlipvjgIJcbiAgICAgKiBAbWV0aG9kIGFwcGx5Rm9yY2VcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IGZvcmNlXG4gICAgICogQHBhcmFtIHtWZWMzfSByZWxhdGl2ZVBvaW50IFRoZSBwb2ludCBvZiBhY3Rpb24sIHJlbGF0aXZlIHRvIHRoZSBjZW50ZXIgb2YgdGhlIHJpZ2lkIGJvZHkuXG4gICAgICovXG4gICAgcHVibGljIGFwcGx5Rm9yY2UgKGZvcmNlOiBjYy5WZWMzLCByZWxhdGl2ZVBvaW50PzogY2MuVmVjMykge1xuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25sb2FkICYmICFDQ19FRElUT1IgJiYgIUNDX1BIWVNJQ1NfQlVJTFRJTikge1xuICAgICAgICAgICAgdGhpcy5fYm9keS5hcHBseUZvcmNlKGZvcmNlLCByZWxhdGl2ZVBvaW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBcHBseSBhIGZvcmNlIG9uIHRoZSByaWdpZCBib2R5IGF0IGEgcG9pbnQgaW4gbG9jYWwgc3BhY2UuXG4gICAgICogISN6aFxuICAgICAqIOWcqOacrOWcsOepuumXtOS4reeahOafkOeCueS4iuWvueWImuS9k+aWveWKoOS4gOS4quS9nOeUqOWKm+OAglxuICAgICAqIEBtZXRob2QgYXBwbHlMb2NhbEZvcmNlXG4gICAgICogQHBhcmFtIHtWZWMzfSBmb3JjZSBcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IGxvY2FsUG9pbnQgUG9pbnQgb2YgYXBwbGljYXRpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgYXBwbHlMb2NhbEZvcmNlIChmb3JjZTogY2MuVmVjMywgbG9jYWxQb2ludD86IGNjLlZlYzMpIHtcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9ubG9hZCAmJiAhQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkuYXBwbHlMb2NhbEZvcmNlKGZvcmNlLCBsb2NhbFBvaW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBcHBseSBhbiBpbXB1bHNlIHRvIGEgcmlnaWQgYm9keSBhdCBhIHBvaW50IGluIHdvcmxkIHNwYWNlLlxuICAgICAqICEjemhcbiAgICAgKiDlnKjkuJbnlYznqbrpl7TnmoTmn5DngrnkuIrlr7nliJrkvZPmlr3liqDkuIDkuKrlhrLph4/jgIJcbiAgICAgKiBAbWV0aG9kIGFwcGx5SW1wdWxzZVxuICAgICAqIEBwYXJhbSB7VmVjM30gaW1wdWxzZVxuICAgICAqIEBwYXJhbSB7VmVjM30gcmVsYXRpdmVQb2ludCBUaGUgcG9pbnQgb2YgYWN0aW9uLCByZWxhdGl2ZSB0byB0aGUgY2VudGVyIG9mIHRoZSByaWdpZCBib2R5LlxuICAgICAqL1xuICAgIHB1YmxpYyBhcHBseUltcHVsc2UgKGltcHVsc2U6IGNjLlZlYzMsIHJlbGF0aXZlUG9pbnQ/OiBjYy5WZWMzKSB7XG4gICAgICAgIGlmICh0aGlzLl9hc3NlcnRPbmxvYWQgJiYgIUNDX0VESVRPUiAmJiAhQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2R5LmFwcGx5SW1wdWxzZShpbXB1bHNlLCByZWxhdGl2ZVBvaW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBcHBseSBhbiBpbXB1bHNlIHRvIHRoZSByaWdpZCBib2R5IGF0IGEgcG9pbnQgaW4gbG9jYWwgc3BhY2UuXG4gICAgICogISN6aFxuICAgICAqIOWcqOacrOWcsOepuumXtOeahOafkOeCueS4iuWvueWImuS9k+aWveWKoOS4gOS4quWGsumHj+OAglxuICAgICAqIEBtZXRob2QgYXBwbHlMb2NhbEltcHVsc2VcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IGltcHVsc2VcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IGxvY2FsUG9pbnQgUG9pbnQgb2YgYXBwbGljYXRpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgYXBwbHlMb2NhbEltcHVsc2UgKGltcHVsc2U6IGNjLlZlYzMsIGxvY2FsUG9pbnQ/OiBjYy5WZWMzKSB7XG4gICAgICAgIGlmICh0aGlzLl9hc3NlcnRPbmxvYWQgJiYgIUNDX0VESVRPUiAmJiAhQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2R5LmFwcGx5TG9jYWxJbXB1bHNlKGltcHVsc2UsIGxvY2FsUG9pbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEFwcGx5IGEgdG9ycXVlIHRvIHRoZSByaWdpZCBib2R5LlxuICAgICAqICEjemhcbiAgICAgKiDlr7nliJrkvZPmlr3liqDmia3ovazlipvjgIJcbiAgICAgKiBAbWV0aG9kIGFwcGx5VG9ycXVlXG4gICAgICogQHBhcmFtIHtWZWMzfSB0b3JxdWVcbiAgICAgKi9cbiAgICBwdWJsaWMgYXBwbHlUb3JxdWUgKHRvcnF1ZTogY2MuVmVjMykge1xuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25sb2FkICYmICFDQ19FRElUT1IgJiYgIUNDX1BIWVNJQ1NfQlVJTFRJTikge1xuICAgICAgICAgICAgdGhpcy5fYm9keS5hcHBseVRvcnF1ZSh0b3JxdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEFwcGx5IGEgbG9jYWwgdG9ycXVlIHRvIHRoZSByaWdpZCBib2R5LlxuICAgICAqICEjemhcbiAgICAgKiDlr7nliJrkvZPmlr3liqDmnKzlnLDmia3ovazlipvjgIJcbiAgICAgKiBAbWV0aG9kIGFwcGx5TG9jYWxUb3JxdWVcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHRvcnF1ZVxuICAgICAqL1xuICAgIHB1YmxpYyBhcHBseUxvY2FsVG9ycXVlICh0b3JxdWU6IGNjLlZlYzMpIHtcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9ubG9hZCAmJiAhQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkuYXBwbHlMb2NhbFRvcnF1ZSh0b3JxdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEF3YWtlbiB0aGUgcmlnaWQgYm9keS5cbiAgICAgKiAhI3poXG4gICAgICog5ZSk6YaS5Yia5L2T44CCXG4gICAgICogQG1ldGhvZCB3YWtlVXBcbiAgICAgKi9cbiAgICBwdWJsaWMgd2FrZVVwICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9ubG9hZCAmJiAhQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkud2FrZVVwKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogRG9ybWFudCByaWdpZCBib2R5LlxuICAgICAqICEjemhcbiAgICAgKiDkvJHnnKDliJrkvZPjgIJcbiAgICAgKiBAbWV0aG9kIHNsZWVwXG4gICAgICovXG4gICAgcHVibGljIHNsZWVwICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9ubG9hZCAmJiAhQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkuc2xlZXAoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgbGluZWFyIHZlbG9jaXR5LlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bnur/mgKfpgJ/luqbjgIJcbiAgICAgKiBAbWV0aG9kIGdldExpbmVhclZlbG9jaXR5XG4gICAgICogQHBhcmFtIHtWZWMzfSBvdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0TGluZWFyVmVsb2NpdHkgKG91dDogY2MuVmVjMykge1xuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25sb2FkICYmICFDQ19FRElUT1IgJiYgIUNDX1BIWVNJQ1NfQlVJTFRJTikge1xuICAgICAgICAgICAgdGhpcy5fYm9keS5nZXRMaW5lYXJWZWxvY2l0eShvdXQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldCBsaW5lYXIgc3BlZWQuXG4gICAgICogISN6aFxuICAgICAqIOiuvue9rue6v+aAp+mAn+W6puOAglxuICAgICAqIEBtZXRob2Qgc2V0TGluZWFyVmVsb2NpdHlcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHZhbHVlIFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRMaW5lYXJWZWxvY2l0eSAodmFsdWU6IGNjLlZlYzMpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9ubG9hZCAmJiAhQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkuc2V0TGluZWFyVmVsb2NpdHkodmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldHMgdGhlIHJvdGF0aW9uIHNwZWVkLlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bml4vovazpgJ/luqbjgIJcbiAgICAgKiBAbWV0aG9kIGdldEFuZ3VsYXJWZWxvY2l0eVxuICAgICAqIEBwYXJhbSB7VmVjM30gb3V0IFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRBbmd1bGFyVmVsb2NpdHkgKG91dDogY2MuVmVjMykge1xuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25sb2FkICYmICFDQ19FRElUT1IgJiYgIUNDX1BIWVNJQ1NfQlVJTFRJTikge1xuICAgICAgICAgICAgdGhpcy5fYm9keS5nZXRBbmd1bGFyVmVsb2NpdHkob3V0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTZXQgcm90YXRpb24gc3BlZWQuXG4gICAgICogISN6aFxuICAgICAqIOiuvue9ruaXi+i9rOmAn+W6puOAglxuICAgICAqIEBtZXRob2Qgc2V0QW5ndWxhclZlbG9jaXR5XG4gICAgICogQHBhcmFtIHtWZWMzfSB2YWx1ZSBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0QW5ndWxhclZlbG9jaXR5ICh2YWx1ZTogY2MuVmVjMyk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25sb2FkICYmICFDQ19FRElUT1IgJiYgIUNDX1BIWVNJQ1NfQlVJTFRJTikge1xuICAgICAgICAgICAgdGhpcy5fYm9keS5zZXRBbmd1bGFyVmVsb2NpdHkodmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvIn0=