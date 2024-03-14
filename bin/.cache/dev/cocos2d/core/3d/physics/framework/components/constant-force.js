
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/framework/components/constant-force.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.ConstantForce = void 0;

var _rigidBodyComponent = require("./rigid-body-component");

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

var _cc$_decorator = cc._decorator,
    ccclass = _cc$_decorator.ccclass,
    executeInEditMode = _cc$_decorator.executeInEditMode,
    executionOrder = _cc$_decorator.executionOrder,
    menu = _cc$_decorator.menu,
    property = _cc$_decorator.property,
    requireComponent = _cc$_decorator.requireComponent,
    disallowMultiple = _cc$_decorator.disallowMultiple;
var Vec3 = cc.Vec3;
/**
 * !#en
 * Each frame applies a constant force to a rigid body, depending on the RigidBody3D
 * !#zh
 * 在每帧对一个刚体施加持续的力，依赖 RigidBody3D 组件
 * @class ConstantForce
 * @extends Component
 */

var ConstantForce = (_dec = ccclass('cc.ConstantForce'), _dec2 = executionOrder(98), _dec3 = requireComponent(_rigidBodyComponent.RigidBody3D), _dec4 = menu('i18n:MAIN_MENU.component.physics/Constant Force 3D'), _dec5 = property({
  displayOrder: 0
}), _dec6 = property({
  displayOrder: 1
}), _dec7 = property({
  displayOrder: 2
}), _dec8 = property({
  displayOrder: 3
}), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = disallowMultiple(_class = executeInEditMode(_class = (_class2 = (_temp = /*#__PURE__*/function (_cc$Component) {
  _inheritsLoose(ConstantForce, _cc$Component);

  function ConstantForce() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _cc$Component.call.apply(_cc$Component, [this].concat(args)) || this;
    _this._rigidbody = null;

    _initializerDefineProperty(_this, "_force", _descriptor, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_localForce", _descriptor2, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_torque", _descriptor3, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_localTorque", _descriptor4, _assertThisInitialized(_this));

    _this._mask = 0;
    return _this;
  }

  var _proto = ConstantForce.prototype;

  _proto.onLoad = function onLoad() {
    if (!CC_PHYSICS_BUILTIN) {
      this._rigidbody = this.node.getComponent(_rigidBodyComponent.RigidBody3D);

      this._maskUpdate(this._force, 1);

      this._maskUpdate(this._localForce, 2);

      this._maskUpdate(this._torque, 4);

      this._maskUpdate(this._localTorque, 8);
    }
  };

  _proto.lateUpdate = function lateUpdate(dt) {
    if (!CC_PHYSICS_BUILTIN) {
      if (this._rigidbody != null && this._mask != 0) {
        if (this._mask & 1) {
          this._rigidbody.applyForce(this._force);
        }

        if (this._mask & 2) {
          this._rigidbody.applyLocalForce(this.localForce);
        }

        if (this._mask & 4) {
          this._rigidbody.applyTorque(this._torque);
        }

        if (this._mask & 8) {
          this._rigidbody.applyLocalTorque(this._localTorque);
        }
      }
    }
  };

  _proto._maskUpdate = function _maskUpdate(t, m) {
    if (Vec3.strictEquals(t, Vec3.ZERO)) {
      this._mask &= ~m;
    } else {
      this._mask |= m;
    }
  };

  _createClass(ConstantForce, [{
    key: "force",
    get:
    /**
     * !#en
     * Set the force used in the world coordinate system, use `this.force = otherVec3`.
     * !#zh
     * 设置世界坐标系中使用的力，设置时请用 `this.force = otherVec3` 的方式。
     * @property {Vec3} force
     */
    function get() {
      return this._force;
    },
    set: function set(value) {
      Vec3.copy(this._force, value);

      this._maskUpdate(this._force, 1);
    }
    /**
     * !#en
     * Set the force used in the local coordinate system, using `this.localforce = otherVec3`.
     * !#zh
     * 获取和设置本地坐标系中使用的力，设置时请用 `this.localForce = otherVec3` 的方式。
     * @property {Vec3} localForce
     */

  }, {
    key: "localForce",
    get: function get() {
      return this._localForce;
    },
    set: function set(value) {
      Vec3.copy(this._localForce, value);

      this._maskUpdate(this.localForce, 2);
    }
    /**
     * !#en
     * Torque applied to the world orientation
     * !#zh
     * 对世界朝向施加的扭矩
     * @note
     * 设置时请用 this.torque = otherVec3 的方式
     * @property {Vec3} torque
     */

  }, {
    key: "torque",
    get: function get() {
      return this._torque;
    },
    set: function set(value) {
      Vec3.copy(this._torque, value);

      this._maskUpdate(this._torque, 4);
    }
    /**
     * !#en
     * Torque applied to local orientation, using `this.localtorque = otherVec3`.
     * !#zh
     * 对本地朝向施加的扭矩，设置时请用 `this.localTorque = otherVec3` 的方式。
     * @property {Vec3} localTorque
     */

  }, {
    key: "localTorque",
    get: function get() {
      return this._localTorque;
    },
    set: function set(value) {
      Vec3.copy(this._localTorque, value);

      this._maskUpdate(this._localTorque, 8);
    }
  }]);

  return ConstantForce;
}(cc.Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_force", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Vec3();
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_localForce", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Vec3();
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_torque", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Vec3();
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_localTorque", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Vec3();
  }
}), _applyDecoratedDescriptor(_class2.prototype, "force", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "force"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "localForce", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "localForce"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "torque", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "torque"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "localTorque", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "localTorque"), _class2.prototype)), _class2)) || _class) || _class) || _class) || _class) || _class) || _class);
exports.ConstantForce = ConstantForce;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BoeXNpY3MvZnJhbWV3b3JrL2NvbXBvbmVudHMvY29uc3RhbnQtZm9yY2UudHMiXSwibmFtZXMiOlsiY2MiLCJfZGVjb3JhdG9yIiwiY2NjbGFzcyIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiZXhlY3V0aW9uT3JkZXIiLCJtZW51IiwicHJvcGVydHkiLCJyZXF1aXJlQ29tcG9uZW50IiwiZGlzYWxsb3dNdWx0aXBsZSIsIlZlYzMiLCJDb25zdGFudEZvcmNlIiwiUmlnaWRCb2R5M0QiLCJkaXNwbGF5T3JkZXIiLCJfcmlnaWRib2R5IiwiX21hc2siLCJvbkxvYWQiLCJDQ19QSFlTSUNTX0JVSUxUSU4iLCJub2RlIiwiZ2V0Q29tcG9uZW50IiwiX21hc2tVcGRhdGUiLCJfZm9yY2UiLCJfbG9jYWxGb3JjZSIsIl90b3JxdWUiLCJfbG9jYWxUb3JxdWUiLCJsYXRlVXBkYXRlIiwiZHQiLCJhcHBseUZvcmNlIiwiYXBwbHlMb2NhbEZvcmNlIiwibG9jYWxGb3JjZSIsImFwcGx5VG9ycXVlIiwiYXBwbHlMb2NhbFRvcnF1ZSIsInQiLCJtIiwic3RyaWN0RXF1YWxzIiwiWkVSTyIsInZhbHVlIiwiY29weSIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBVUlBLEVBQUUsQ0FBQ0M7SUFQSEMseUJBQUFBO0lBQ0FDLG1DQUFBQTtJQUNBQyxnQ0FBQUE7SUFDQUMsc0JBQUFBO0lBQ0FDLDBCQUFBQTtJQUNBQyxrQ0FBQUE7SUFDQUMsa0NBQUFBO0FBRUosSUFBTUMsSUFBSSxHQUFHVCxFQUFFLENBQUNTLElBQWhCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7SUFPYUMsd0JBTlpSLE9BQU8sQ0FBQyxrQkFBRCxXQUNQRSxjQUFjLENBQUMsRUFBRCxXQUNkRyxnQkFBZ0IsQ0FBQ0ksK0JBQUQsV0FDaEJOLElBQUks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QUFDakIsYUFBTyxLQUFLTixPQUFaO0FBQ0g7U0FFRCxhQUFtQmEsS0FBbkIsRUFBbUM7QUFDL0IxQixNQUFBQSxJQUFJLENBQUMyQixJQUFMLENBQVUsS0FBS2QsT0FBZixFQUF3QmEsS0FBeEI7O0FBQ0EsV0FBS2hCLFdBQUwsQ0FBaUIsS0FBS0csT0FBdEIsRUFBK0IsQ0FBL0I7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O1NBQ0ksZUFHMEI7QUFDdEIsYUFBTyxLQUFLQyxZQUFaO0FBQ0g7U0FFRCxhQUF3QlksS0FBeEIsRUFBd0M7QUFDcEMxQixNQUFBQSxJQUFJLENBQUMyQixJQUFMLENBQVUsS0FBS2IsWUFBZixFQUE2QlksS0FBN0I7O0FBQ0EsV0FBS2hCLFdBQUwsQ0FBaUIsS0FBS0ksWUFBdEIsRUFBb0MsQ0FBcEM7QUFDSDs7OztFQTlGOEJ2QixFQUFFLENBQUNxQywyRkFJakMvQjs7Ozs7V0FDa0MsSUFBSUcsSUFBSjs7Z0ZBRWxDSDs7Ozs7V0FDdUMsSUFBSUcsSUFBSjs7NEVBRXZDSDs7Ozs7V0FDbUMsSUFBSUcsSUFBSjs7aUZBRW5DSDs7Ozs7V0FDd0MsSUFBSUcsSUFBSiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgeyBSaWdpZEJvZHkzRCB9IGZyb20gJy4vcmlnaWQtYm9keS1jb21wb25lbnQnO1xuXG5jb25zdCB7XG4gICAgY2NjbGFzcyxcbiAgICBleGVjdXRlSW5FZGl0TW9kZSxcbiAgICBleGVjdXRpb25PcmRlcixcbiAgICBtZW51LFxuICAgIHByb3BlcnR5LFxuICAgIHJlcXVpcmVDb21wb25lbnQsXG4gICAgZGlzYWxsb3dNdWx0aXBsZSxcbn0gPSBjYy5fZGVjb3JhdG9yO1xuY29uc3QgVmVjMyA9IGNjLlZlYzM7XG5cbi8qKlxuICogISNlblxuICogRWFjaCBmcmFtZSBhcHBsaWVzIGEgY29uc3RhbnQgZm9yY2UgdG8gYSByaWdpZCBib2R5LCBkZXBlbmRpbmcgb24gdGhlIFJpZ2lkQm9keTNEXG4gKiAhI3poXG4gKiDlnKjmr4/luKflr7nkuIDkuKrliJrkvZPmlr3liqDmjIHnu63nmoTlipvvvIzkvp3otZYgUmlnaWRCb2R5M0Qg57uE5Lu2XG4gKiBAY2xhc3MgQ29uc3RhbnRGb3JjZVxuICogQGV4dGVuZHMgQ29tcG9uZW50XG4gKi9cbkBjY2NsYXNzKCdjYy5Db25zdGFudEZvcmNlJylcbkBleGVjdXRpb25PcmRlcig5OClcbkByZXF1aXJlQ29tcG9uZW50KFJpZ2lkQm9keTNEKVxuQG1lbnUoJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5waHlzaWNzL0NvbnN0YW50IEZvcmNlIDNEJylcbkBkaXNhbGxvd011bHRpcGxlXG5AZXhlY3V0ZUluRWRpdE1vZGVcbmV4cG9ydCBjbGFzcyBDb25zdGFudEZvcmNlIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcblxuICAgIHByaXZhdGUgX3JpZ2lkYm9keTogUmlnaWRCb2R5M0QgfCBudWxsID0gbnVsbDtcblxuICAgIEBwcm9wZXJ0eVxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZvcmNlOiBjYy5WZWMzID0gbmV3IFZlYzMoKTtcblxuICAgIEBwcm9wZXJ0eVxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2xvY2FsRm9yY2U6IGNjLlZlYzMgPSBuZXcgVmVjMygpO1xuXG4gICAgQHByb3BlcnR5XG4gICAgcHJpdmF0ZSByZWFkb25seSBfdG9ycXVlOiBjYy5WZWMzID0gbmV3IFZlYzMoKTtcblxuICAgIEBwcm9wZXJ0eVxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2xvY2FsVG9ycXVlOiBjYy5WZWMzID0gbmV3IFZlYzMoKTtcblxuICAgIHByaXZhdGUgX21hc2s6IG51bWJlciA9IDA7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0IHRoZSBmb3JjZSB1c2VkIGluIHRoZSB3b3JsZCBjb29yZGluYXRlIHN5c3RlbSwgdXNlIGB0aGlzLmZvcmNlID0gb3RoZXJWZWMzYC5cbiAgICAgKiAhI3poXG4gICAgICog6K6+572u5LiW55WM5Z2Q5qCH57O75Lit5L2/55So55qE5Yqb77yM6K6+572u5pe26K+355SoIGB0aGlzLmZvcmNlID0gb3RoZXJWZWMzYCDnmoTmlrnlvI/jgIJcbiAgICAgKiBAcHJvcGVydHkge1ZlYzN9IGZvcmNlXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgZGlzcGxheU9yZGVyOiAwXG4gICAgfSlcbiAgICBwdWJsaWMgZ2V0IGZvcmNlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZvcmNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgZm9yY2UgKHZhbHVlOiBjYy5WZWMzKSB7XG4gICAgICAgIFZlYzMuY29weSh0aGlzLl9mb3JjZSwgdmFsdWUpO1xuICAgICAgICB0aGlzLl9tYXNrVXBkYXRlKHRoaXMuX2ZvcmNlLCAxKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0IHRoZSBmb3JjZSB1c2VkIGluIHRoZSBsb2NhbCBjb29yZGluYXRlIHN5c3RlbSwgdXNpbmcgYHRoaXMubG9jYWxmb3JjZSA9IG90aGVyVmVjM2AuXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluWSjOiuvue9ruacrOWcsOWdkOagh+ezu+S4reS9v+eUqOeahOWKm++8jOiuvue9ruaXtuivt+eUqCBgdGhpcy5sb2NhbEZvcmNlID0gb3RoZXJWZWMzYCDnmoTmlrnlvI/jgIJcbiAgICAgKiBAcHJvcGVydHkge1ZlYzN9IGxvY2FsRm9yY2VcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICBkaXNwbGF5T3JkZXI6IDFcbiAgICB9KVxuICAgIHB1YmxpYyBnZXQgbG9jYWxGb3JjZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NhbEZvcmNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgbG9jYWxGb3JjZSAodmFsdWU6IGNjLlZlYzMpIHtcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMuX2xvY2FsRm9yY2UsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5fbWFza1VwZGF0ZSh0aGlzLmxvY2FsRm9yY2UsIDIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBUb3JxdWUgYXBwbGllZCB0byB0aGUgd29ybGQgb3JpZW50YXRpb25cbiAgICAgKiAhI3poXG4gICAgICog5a+55LiW55WM5pyd5ZCR5pa95Yqg55qE5omt55+pXG4gICAgICogQG5vdGVcbiAgICAgKiDorr7nva7ml7bor7fnlKggdGhpcy50b3JxdWUgPSBvdGhlclZlYzMg55qE5pa55byPXG4gICAgICogQHByb3BlcnR5IHtWZWMzfSB0b3JxdWVcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICBkaXNwbGF5T3JkZXI6IDJcbiAgICB9KVxuICAgIHB1YmxpYyBnZXQgdG9ycXVlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RvcnF1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHRvcnF1ZSAodmFsdWU6IGNjLlZlYzMpIHtcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMuX3RvcnF1ZSwgdmFsdWUpO1xuICAgICAgICB0aGlzLl9tYXNrVXBkYXRlKHRoaXMuX3RvcnF1ZSwgNCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFRvcnF1ZSBhcHBsaWVkIHRvIGxvY2FsIG9yaWVudGF0aW9uLCB1c2luZyBgdGhpcy5sb2NhbHRvcnF1ZSA9IG90aGVyVmVjM2AuXG4gICAgICogISN6aFxuICAgICAqIOWvueacrOWcsOacneWQkeaWveWKoOeahOaJreefqe+8jOiuvue9ruaXtuivt+eUqCBgdGhpcy5sb2NhbFRvcnF1ZSA9IG90aGVyVmVjM2Ag55qE5pa55byP44CCXG4gICAgICogQHByb3BlcnR5IHtWZWMzfSBsb2NhbFRvcnF1ZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIGRpc3BsYXlPcmRlcjogM1xuICAgIH0pXG4gICAgcHVibGljIGdldCBsb2NhbFRvcnF1ZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NhbFRvcnF1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGxvY2FsVG9ycXVlICh2YWx1ZTogY2MuVmVjMykge1xuICAgICAgICBWZWMzLmNvcHkodGhpcy5fbG9jYWxUb3JxdWUsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5fbWFza1VwZGF0ZSh0aGlzLl9sb2NhbFRvcnF1ZSwgOCk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uTG9hZCAoKSB7XG4gICAgICAgIGlmICghQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLl9yaWdpZGJvZHkgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KFJpZ2lkQm9keTNEKTtcbiAgICAgICAgICAgIHRoaXMuX21hc2tVcGRhdGUodGhpcy5fZm9yY2UsIDEpO1xuICAgICAgICAgICAgdGhpcy5fbWFza1VwZGF0ZSh0aGlzLl9sb2NhbEZvcmNlLCAyKTtcbiAgICAgICAgICAgIHRoaXMuX21hc2tVcGRhdGUodGhpcy5fdG9ycXVlLCA0KTtcbiAgICAgICAgICAgIHRoaXMuX21hc2tVcGRhdGUodGhpcy5fbG9jYWxUb3JxdWUsIDgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGxhdGVVcGRhdGUgKGR0OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKCFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9yaWdpZGJvZHkgIT0gbnVsbCAmJiB0aGlzLl9tYXNrICE9IDApIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbWFzayAmIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmlnaWRib2R5LmFwcGx5Rm9yY2UodGhpcy5fZm9yY2UpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9tYXNrICYgMikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yaWdpZGJvZHkuYXBwbHlMb2NhbEZvcmNlKHRoaXMubG9jYWxGb3JjZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21hc2sgJiA0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JpZ2lkYm9keS5hcHBseVRvcnF1ZSh0aGlzLl90b3JxdWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9tYXNrICYgOCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yaWdpZGJvZHkuYXBwbHlMb2NhbFRvcnF1ZSh0aGlzLl9sb2NhbFRvcnF1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfbWFza1VwZGF0ZSAodDogY2MuVmVjMywgbTogbnVtYmVyKSB7XG4gICAgICAgIGlmIChWZWMzLnN0cmljdEVxdWFscyh0LCBWZWMzLlpFUk8pKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXNrICY9IH5tO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbWFzayB8PSBtO1xuICAgICAgICB9XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvIn0=