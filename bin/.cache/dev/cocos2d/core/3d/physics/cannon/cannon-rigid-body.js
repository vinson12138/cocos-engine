
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/cannon/cannon-rigid-body.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.CannonRigidBody = void 0;

var _cannon = _interopRequireDefault(require("../../../../../external/cannon/cannon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var v3_cannon0 = new _cannon["default"].Vec3();
var v3_cannon1 = new _cannon["default"].Vec3();
var Vec3 = cc.Vec3;
/**
 * wraped shared body
 * dynamic
 * kinematic
 */

var CannonRigidBody = /*#__PURE__*/function () {
  function CannonRigidBody() {
    this._rigidBody = void 0;
    this._sharedBody = void 0;
    this._isEnabled = false;
  }

  var _proto = CannonRigidBody.prototype;

  /** LIFECYCLE */
  _proto.__preload = function __preload(com) {
    this._rigidBody = com;
    this._sharedBody = cc.director.getPhysics3DManager().physicsWorld.getSharedBody(this._rigidBody.node);
    this._sharedBody.reference = true;
    this._sharedBody.wrappedBody = this;
  };

  _proto.onLoad = function onLoad() {};

  _proto.onEnable = function onEnable() {
    this._isEnabled = true;
    this.mass = this._rigidBody.mass;
    this.allowSleep = this._rigidBody.allowSleep;
    this.linearDamping = this._rigidBody.linearDamping;
    this.angularDamping = this._rigidBody.angularDamping;
    this.useGravity = this._rigidBody.useGravity;
    this.isKinematic = this._rigidBody.isKinematic;
    this.fixedRotation = this._rigidBody.fixedRotation;
    this.linearFactor = this._rigidBody.linearFactor;
    this.angularFactor = this._rigidBody.angularFactor;
    this._sharedBody.enabled = true;
  };

  _proto.onDisable = function onDisable() {
    this._isEnabled = false;
    this._sharedBody.enabled = false;
  };

  _proto.onDestroy = function onDestroy() {
    this._sharedBody.reference = false;
    this._rigidBody = null;
    this._sharedBody = null;
  }
  /** INTERFACE */
  ;

  _proto.wakeUp = function wakeUp() {
    return this._sharedBody.body.wakeUp();
  };

  _proto.sleep = function sleep() {
    return this._sharedBody.body.sleep();
  };

  _proto.getLinearVelocity = function getLinearVelocity(out) {
    Vec3.copy(out, this._sharedBody.body.velocity);
    return out;
  };

  _proto.setLinearVelocity = function setLinearVelocity(value) {
    var body = this._sharedBody.body;

    if (body.isSleeping()) {
      body.wakeUp();
    }

    Vec3.copy(body.velocity, value);
  };

  _proto.getAngularVelocity = function getAngularVelocity(out) {
    Vec3.copy(out, this._sharedBody.body.angularVelocity);
    return out;
  };

  _proto.setAngularVelocity = function setAngularVelocity(value) {
    var body = this._sharedBody.body;

    if (body.isSleeping()) {
      body.wakeUp();
    }

    Vec3.copy(body.angularVelocity, value);
  };

  _proto.applyForce = function applyForce(force, worldPoint) {
    if (worldPoint == null) {
      worldPoint = Vec3.ZERO;
    }

    var body = this._sharedBody.body;

    if (body.isSleeping()) {
      body.wakeUp();
    }

    body.applyForce(Vec3.copy(v3_cannon0, force), Vec3.copy(v3_cannon1, worldPoint));
  };

  _proto.applyImpulse = function applyImpulse(impulse, worldPoint) {
    if (worldPoint == null) {
      worldPoint = Vec3.ZERO;
    }

    var body = this._sharedBody.body;

    if (body.isSleeping()) {
      body.wakeUp();
    }

    body.applyImpulse(Vec3.copy(v3_cannon0, impulse), Vec3.copy(v3_cannon1, worldPoint));
  };

  _proto.applyLocalForce = function applyLocalForce(force, localPoint) {
    if (localPoint == null) {
      localPoint = Vec3.ZERO;
    }

    var body = this._sharedBody.body;

    if (body.isSleeping()) {
      body.wakeUp();
    }

    body.applyLocalForce(Vec3.copy(v3_cannon0, force), Vec3.copy(v3_cannon1, localPoint));
  };

  _proto.applyLocalImpulse = function applyLocalImpulse(impulse, localPoint) {
    if (localPoint == null) {
      localPoint = Vec3.ZERO;
    }

    var body = this._sharedBody.body;

    if (body.isSleeping()) {
      body.wakeUp();
    }

    body.applyLocalImpulse(Vec3.copy(v3_cannon0, impulse), Vec3.copy(v3_cannon1, localPoint));
  };

  _proto.applyTorque = function applyTorque(torque) {
    var body = this._sharedBody.body;

    if (body.isSleeping()) {
      body.wakeUp();
    }

    body.torque.x += torque.x;
    body.torque.y += torque.y;
    body.torque.z += torque.z;
  };

  _proto.applyLocalTorque = function applyLocalTorque(torque) {
    var body = this._sharedBody.body;

    if (body.isSleeping()) {
      body.wakeUp();
    }

    Vec3.copy(v3_cannon0, torque);
    body.vectorToWorldFrame(v3_cannon0, v3_cannon0);
    body.torque.x += v3_cannon0.x;
    body.torque.y += v3_cannon0.y;
    body.torque.z += v3_cannon0.z;
  };

  _createClass(CannonRigidBody, [{
    key: "isAwake",
    get: function get() {
      return this._sharedBody.body.isAwake();
    }
  }, {
    key: "isSleepy",
    get: function get() {
      return this._sharedBody.body.isSleepy();
    }
  }, {
    key: "isSleeping",
    get: function get() {
      return this._sharedBody.body.isSleeping();
    }
  }, {
    key: "allowSleep",
    set: function set(v) {
      var body = this._sharedBody.body;

      if (body.isSleeping()) {
        body.wakeUp();
      }

      body.allowSleep = v;
    }
  }, {
    key: "mass",
    set: function set(value) {
      var body = this._sharedBody.body;
      body.mass = value;

      if (body.mass == 0) {
        body.type = _cannon["default"].Body.STATIC;
      } else {
        body.type = this._rigidBody.isKinematic ? _cannon["default"].Body.KINEMATIC : _cannon["default"].Body.DYNAMIC;
      }

      body.updateMassProperties();

      if (body.isSleeping()) {
        body.wakeUp();
      }
    }
  }, {
    key: "isKinematic",
    set: function set(value) {
      var body = this._sharedBody.body;

      if (body.mass == 0) {
        body.type = _cannon["default"].Body.STATIC;
      } else {
        if (value) {
          body.type = _cannon["default"].Body.KINEMATIC;
        } else {
          body.type = _cannon["default"].Body.DYNAMIC;
        }
      }
    }
  }, {
    key: "fixedRotation",
    set: function set(value) {
      var body = this._sharedBody.body;

      if (body.isSleeping()) {
        body.wakeUp();
      }

      body.fixedRotation = value;
      body.updateMassProperties();
    }
  }, {
    key: "linearDamping",
    set: function set(value) {
      this._sharedBody.body.linearDamping = value;
    }
  }, {
    key: "angularDamping",
    set: function set(value) {
      this._sharedBody.body.angularDamping = value;
    }
  }, {
    key: "useGravity",
    set: function set(value) {
      var body = this._sharedBody.body;

      if (body.isSleeping()) {
        body.wakeUp();
      }

      body.useGravity = value;
    }
  }, {
    key: "linearFactor",
    set: function set(value) {
      var body = this._sharedBody.body;

      if (body.isSleeping()) {
        body.wakeUp();
      }

      Vec3.copy(body.linearFactor, value);
    }
  }, {
    key: "angularFactor",
    set: function set(value) {
      var body = this._sharedBody.body;

      if (body.isSleeping()) {
        body.wakeUp();
      }

      Vec3.copy(body.angularFactor, value);
    }
  }, {
    key: "rigidBody",
    get: function get() {
      return this._rigidBody;
    }
  }, {
    key: "sharedBody",
    get: function get() {
      return this._sharedBody;
    }
  }, {
    key: "isEnabled",
    get: function get() {
      return this._isEnabled;
    }
  }]);

  return CannonRigidBody;
}();

exports.CannonRigidBody = CannonRigidBody;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BoeXNpY3MvY2Fubm9uL2Nhbm5vbi1yaWdpZC1ib2R5LnRzIl0sIm5hbWVzIjpbInYzX2Nhbm5vbjAiLCJDQU5OT04iLCJWZWMzIiwidjNfY2Fubm9uMSIsImNjIiwiQ2Fubm9uUmlnaWRCb2R5IiwiX3JpZ2lkQm9keSIsIl9zaGFyZWRCb2R5IiwiX2lzRW5hYmxlZCIsIl9fcHJlbG9hZCIsImNvbSIsImRpcmVjdG9yIiwiZ2V0UGh5c2ljczNETWFuYWdlciIsInBoeXNpY3NXb3JsZCIsImdldFNoYXJlZEJvZHkiLCJub2RlIiwicmVmZXJlbmNlIiwid3JhcHBlZEJvZHkiLCJvbkxvYWQiLCJvbkVuYWJsZSIsIm1hc3MiLCJhbGxvd1NsZWVwIiwibGluZWFyRGFtcGluZyIsImFuZ3VsYXJEYW1waW5nIiwidXNlR3Jhdml0eSIsImlzS2luZW1hdGljIiwiZml4ZWRSb3RhdGlvbiIsImxpbmVhckZhY3RvciIsImFuZ3VsYXJGYWN0b3IiLCJlbmFibGVkIiwib25EaXNhYmxlIiwib25EZXN0cm95Iiwid2FrZVVwIiwiYm9keSIsInNsZWVwIiwiZ2V0TGluZWFyVmVsb2NpdHkiLCJvdXQiLCJjb3B5IiwidmVsb2NpdHkiLCJzZXRMaW5lYXJWZWxvY2l0eSIsInZhbHVlIiwiaXNTbGVlcGluZyIsImdldEFuZ3VsYXJWZWxvY2l0eSIsImFuZ3VsYXJWZWxvY2l0eSIsInNldEFuZ3VsYXJWZWxvY2l0eSIsImFwcGx5Rm9yY2UiLCJmb3JjZSIsIndvcmxkUG9pbnQiLCJaRVJPIiwiYXBwbHlJbXB1bHNlIiwiaW1wdWxzZSIsImFwcGx5TG9jYWxGb3JjZSIsImxvY2FsUG9pbnQiLCJhcHBseUxvY2FsSW1wdWxzZSIsImFwcGx5VG9ycXVlIiwidG9ycXVlIiwieCIsInkiLCJ6IiwiYXBwbHlMb2NhbFRvcnF1ZSIsInZlY3RvclRvV29ybGRGcmFtZSIsImlzQXdha2UiLCJpc1NsZWVweSIsInYiLCJ0eXBlIiwiQm9keSIs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QWdCQSxLQUFoQixFQUFnQztBQUM1QixVQUFJUCxJQUFJLEdBQUcsS0FBSzFCLFdBQUwsQ0FBaUIwQixJQUE1Qjs7QUFDQSxVQUFJQSxJQUFJLENBQUNRLFVBQUwsRUFBSixFQUF1QjtBQUNuQlIsUUFBQUEsSUFBSSxDQUFDRCxNQUFMO0FBQ0g7O0FBQ0RDLE1BQUFBLElBQUksQ0FBQ1QsVUFBTCxHQUFrQmdCLEtBQWxCO0FBQ0g7OztTQUVELGFBQWtCQSxLQUFsQixFQUFrQztBQUM5QixVQUFJUCxJQUFJLEdBQUcsS0FBSzFCLFdBQUwsQ0FBaUIwQixJQUE1Qjs7QUFDQSxVQUFJQSxJQUFJLENBQUNRLFVBQUwsRUFBSixFQUF1QjtBQUNuQlIsUUFBQUEsSUFBSSxDQUFDRCxNQUFMO0FBQ0g7O0FBQ0Q5QixNQUFBQSxJQUFJLENBQUNtQyxJQUFMLENBQVVKLElBQUksQ0FBQ04sWUFBZixFQUE2QmEsS0FBN0I7QUFDSDs7O1NBRUQsYUFBbUJBLEtBQW5CLEVBQW1DO0FBQy9CLFVBQUlQLElBQUksR0FBRyxLQUFLMUIsV0FBTCxDQUFpQjBCLElBQTVCOztBQUNBLFVBQUlBLElBQUksQ0FBQ1EsVUFBTCxFQUFKLEVBQXVCO0FBQ25CUixRQUFBQSxJQUFJLENBQUNELE1BQUw7QUFDSDs7QUFDRDlCLE1BQUFBLElBQUksQ0FBQ21DLElBQUwsQ0FBVUosSUFBSSxDQUFDTCxhQUFmLEVBQThCWSxLQUE5QjtBQUNIOzs7U0FFRCxlQUFpQjtBQUNiLGFBQU8sS0FBS2xDLFVBQVo7QUFDSDs7O1NBRUQsZUFBa0I7QUFDZCxhQUFPLEtBQUtDLFdBQVo7QUFDSDs7O1NBRUQsZUFBaUI7QUFDYixhQUFPLEtBQUtDLFVBQVo7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgQ0FOTk9OIGZyb20gJy4uLy4uLy4uLy4uLy4uL2V4dGVybmFsL2Nhbm5vbi9jYW5ub24nO1xuaW1wb3J0IHsgSVJpZ2lkQm9keSB9IGZyb20gJy4uL3NwZWMvSS1yaWdpZC1ib2R5JztcbmltcG9ydCB7IENhbm5vblNoYXJlZEJvZHkgfSBmcm9tICcuL2Nhbm5vbi1zaGFyZWQtYm9keSc7XG5pbXBvcnQgeyBDYW5ub25Xb3JsZCB9IGZyb20gJy4vY2Fubm9uLXdvcmxkJztcbmltcG9ydCB7IFJpZ2lkQm9keTNEIH0gZnJvbSAnLi4vZnJhbWV3b3JrJztcblxuY29uc3QgdjNfY2Fubm9uMCA9IG5ldyBDQU5OT04uVmVjMygpO1xuY29uc3QgdjNfY2Fubm9uMSA9IG5ldyBDQU5OT04uVmVjMygpO1xuY29uc3QgVmVjMyA9IGNjLlZlYzM7XG5cbi8qKlxuICogd3JhcGVkIHNoYXJlZCBib2R5XG4gKiBkeW5hbWljXG4gKiBraW5lbWF0aWNcbiAqL1xuZXhwb3J0IGNsYXNzIENhbm5vblJpZ2lkQm9keSBpbXBsZW1lbnRzIElSaWdpZEJvZHkge1xuXG4gICAgZ2V0IGlzQXdha2UgKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcmVkQm9keS5ib2R5LmlzQXdha2UoKTtcbiAgICB9XG5cbiAgICBnZXQgaXNTbGVlcHkgKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcmVkQm9keS5ib2R5LmlzU2xlZXB5KCk7XG4gICAgfVxuXG4gICAgZ2V0IGlzU2xlZXBpbmcgKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcmVkQm9keS5ib2R5LmlzU2xlZXBpbmcoKTtcbiAgICB9XG5cbiAgICBzZXQgYWxsb3dTbGVlcCAodjogYm9vbGVhbikge1xuICAgICAgICBsZXQgYm9keSA9IHRoaXMuX3NoYXJlZEJvZHkuYm9keTtcbiAgICAgICAgaWYgKGJvZHkuaXNTbGVlcGluZygpKSB7XG4gICAgICAgICAgICBib2R5Lndha2VVcCgpO1xuICAgICAgICB9XG4gICAgICAgIGJvZHkuYWxsb3dTbGVlcCA9IHY7XG4gICAgfVxuXG4gICAgc2V0IG1hc3MgKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IGJvZHkgPSB0aGlzLl9zaGFyZWRCb2R5LmJvZHk7XG4gICAgICAgIGJvZHkubWFzcyA9IHZhbHVlO1xuICAgICAgICBpZiAoYm9keS5tYXNzID09IDApIHtcbiAgICAgICAgICAgIGJvZHkudHlwZSA9IENBTk5PTi5Cb2R5LlNUQVRJQztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJvZHkudHlwZSA9IHRoaXMuX3JpZ2lkQm9keS5pc0tpbmVtYXRpYyA/IENBTk5PTi5Cb2R5LktJTkVNQVRJQyA6IENBTk5PTi5Cb2R5LkRZTkFNSUM7XG4gICAgICAgIH1cblxuICAgICAgICBib2R5LnVwZGF0ZU1hc3NQcm9wZXJ0aWVzKCk7XG4gICAgICAgIGlmIChib2R5LmlzU2xlZXBpbmcoKSkge1xuICAgICAgICAgICAgYm9keS53YWtlVXAoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldCBpc0tpbmVtYXRpYyAodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgbGV0IGJvZHkgPSB0aGlzLl9zaGFyZWRCb2R5LmJvZHk7XG4gICAgICAgIGlmIChib2R5Lm1hc3MgPT0gMCkge1xuICAgICAgICAgICAgYm9keS50eXBlID0gQ0FOTk9OLkJvZHkuU1RBVElDO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgYm9keS50eXBlID0gQ0FOTk9OLkJvZHkuS0lORU1BVElDO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBib2R5LnR5cGUgPSBDQU5OT04uQm9keS5EWU5BTUlDO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0IGZpeGVkUm90YXRpb24gKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIGxldCBib2R5ID0gdGhpcy5fc2hhcmVkQm9keS5ib2R5O1xuICAgICAgICBpZiAoYm9keS5pc1NsZWVwaW5nKCkpIHtcbiAgICAgICAgICAgIGJvZHkud2FrZVVwKCk7XG4gICAgICAgIH1cbiAgICAgICAgYm9keS5maXhlZFJvdGF0aW9uID0gdmFsdWU7XG4gICAgICAgIGJvZHkudXBkYXRlTWFzc1Byb3BlcnRpZXMoKTtcbiAgICB9XG5cbiAgICBzZXQgbGluZWFyRGFtcGluZyAodmFsdWU6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LmJvZHkubGluZWFyRGFtcGluZyA9IHZhbHVlO1xuICAgIH1cblxuICAgIHNldCBhbmd1bGFyRGFtcGluZyAodmFsdWU6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LmJvZHkuYW5ndWxhckRhbXBpbmcgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBzZXQgdXNlR3Jhdml0eSAodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgbGV0IGJvZHkgPSB0aGlzLl9zaGFyZWRCb2R5LmJvZHk7XG4gICAgICAgIGlmIChib2R5LmlzU2xlZXBpbmcoKSkge1xuICAgICAgICAgICAgYm9keS53YWtlVXAoKTtcbiAgICAgICAgfVxuICAgICAgICBib2R5LnVzZUdyYXZpdHkgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBzZXQgbGluZWFyRmFjdG9yICh2YWx1ZTogY2MuVmVjMykge1xuICAgICAgICBsZXQgYm9keSA9IHRoaXMuX3NoYXJlZEJvZHkuYm9keTtcbiAgICAgICAgaWYgKGJvZHkuaXNTbGVlcGluZygpKSB7XG4gICAgICAgICAgICBib2R5Lndha2VVcCgpO1xuICAgICAgICB9XG4gICAgICAgIFZlYzMuY29weShib2R5LmxpbmVhckZhY3RvciwgdmFsdWUpO1xuICAgIH1cblxuICAgIHNldCBhbmd1bGFyRmFjdG9yICh2YWx1ZTogY2MuVmVjMykge1xuICAgICAgICBsZXQgYm9keSA9IHRoaXMuX3NoYXJlZEJvZHkuYm9keTtcbiAgICAgICAgaWYgKGJvZHkuaXNTbGVlcGluZygpKSB7XG4gICAgICAgICAgICBib2R5Lndha2VVcCgpO1xuICAgICAgICB9XG4gICAgICAgIFZlYzMuY29weShib2R5LmFuZ3VsYXJGYWN0b3IsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBnZXQgcmlnaWRCb2R5ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JpZ2lkQm9keTtcbiAgICB9XG5cbiAgICBnZXQgc2hhcmVkQm9keSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFyZWRCb2R5O1xuICAgIH1cblxuICAgIGdldCBpc0VuYWJsZWQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNFbmFibGVkO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3JpZ2lkQm9keSE6IFJpZ2lkQm9keTNEO1xuICAgIHByaXZhdGUgX3NoYXJlZEJvZHkhOiBDYW5ub25TaGFyZWRCb2R5O1xuICAgIHByaXZhdGUgX2lzRW5hYmxlZCA9IGZhbHNlO1xuXG4gICAgLyoqIExJRkVDWUNMRSAqL1xuXG4gICAgX19wcmVsb2FkIChjb206IFJpZ2lkQm9keTNEKSB7XG4gICAgICAgIHRoaXMuX3JpZ2lkQm9keSA9IGNvbTtcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keSA9IChjYy5kaXJlY3Rvci5nZXRQaHlzaWNzM0RNYW5hZ2VyKCkucGh5c2ljc1dvcmxkIGFzIENhbm5vbldvcmxkKS5nZXRTaGFyZWRCb2R5KHRoaXMuX3JpZ2lkQm9keS5ub2RlKTtcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5yZWZlcmVuY2UgPSB0cnVlO1xuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LndyYXBwZWRCb2R5ID0gdGhpcztcbiAgICB9XG5cbiAgICBvbkxvYWQgKCkge1xuICAgIH1cblxuICAgIG9uRW5hYmxlICgpIHtcbiAgICAgICAgdGhpcy5faXNFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tYXNzID0gdGhpcy5fcmlnaWRCb2R5Lm1hc3M7XG4gICAgICAgIHRoaXMuYWxsb3dTbGVlcCA9IHRoaXMuX3JpZ2lkQm9keS5hbGxvd1NsZWVwO1xuICAgICAgICB0aGlzLmxpbmVhckRhbXBpbmcgPSB0aGlzLl9yaWdpZEJvZHkubGluZWFyRGFtcGluZztcbiAgICAgICAgdGhpcy5hbmd1bGFyRGFtcGluZyA9IHRoaXMuX3JpZ2lkQm9keS5hbmd1bGFyRGFtcGluZztcbiAgICAgICAgdGhpcy51c2VHcmF2aXR5ID0gdGhpcy5fcmlnaWRCb2R5LnVzZUdyYXZpdHk7XG4gICAgICAgIHRoaXMuaXNLaW5lbWF0aWMgPSB0aGlzLl9yaWdpZEJvZHkuaXNLaW5lbWF0aWM7XG4gICAgICAgIHRoaXMuZml4ZWRSb3RhdGlvbiA9IHRoaXMuX3JpZ2lkQm9keS5maXhlZFJvdGF0aW9uO1xuICAgICAgICB0aGlzLmxpbmVhckZhY3RvciA9IHRoaXMuX3JpZ2lkQm9keS5saW5lYXJGYWN0b3I7XG4gICAgICAgIHRoaXMuYW5ndWxhckZhY3RvciA9IHRoaXMuX3JpZ2lkQm9keS5hbmd1bGFyRmFjdG9yO1xuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LmVuYWJsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIG9uRGlzYWJsZSAoKSB7XG4gICAgICAgIHRoaXMuX2lzRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LmVuYWJsZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBvbkRlc3Ryb3kgKCkge1xuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LnJlZmVyZW5jZSA9IGZhbHNlO1xuICAgICAgICAodGhpcy5fcmlnaWRCb2R5IGFzIGFueSkgPSBudWxsO1xuICAgICAgICAodGhpcy5fc2hhcmVkQm9keSBhcyBhbnkpID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKiogSU5URVJGQUNFICovXG5cbiAgICB3YWtlVXAgKCk6IHZvaWQge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcmVkQm9keS5ib2R5Lndha2VVcCgpO1xuICAgIH1cblxuICAgIHNsZWVwICgpOiB2b2lkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXJlZEJvZHkuYm9keS5zbGVlcCgpO1xuICAgIH1cblxuICAgIGdldExpbmVhclZlbG9jaXR5IChvdXQ6IGNjLlZlYzMpOiBjYy5WZWMzIHtcbiAgICAgICAgVmVjMy5jb3B5KG91dCwgdGhpcy5fc2hhcmVkQm9keS5ib2R5LnZlbG9jaXR5KTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICBzZXRMaW5lYXJWZWxvY2l0eSAodmFsdWU6IGNjLlZlYzMpOiB2b2lkIHtcbiAgICAgICAgbGV0IGJvZHkgPSB0aGlzLl9zaGFyZWRCb2R5LmJvZHk7XG4gICAgICAgIGlmIChib2R5LmlzU2xlZXBpbmcoKSkge1xuICAgICAgICAgICAgYm9keS53YWtlVXAoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIFZlYzMuY29weShib2R5LnZlbG9jaXR5LCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgZ2V0QW5ndWxhclZlbG9jaXR5IChvdXQ6IGNjLlZlYzMpOiBjYy5WZWMzIHtcbiAgICAgICAgVmVjMy5jb3B5KG91dCwgdGhpcy5fc2hhcmVkQm9keS5ib2R5LmFuZ3VsYXJWZWxvY2l0eSk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgc2V0QW5ndWxhclZlbG9jaXR5ICh2YWx1ZTogY2MuVmVjMyk6IHZvaWQge1xuICAgICAgICBsZXQgYm9keSA9IHRoaXMuX3NoYXJlZEJvZHkuYm9keTtcbiAgICAgICAgaWYgKGJvZHkuaXNTbGVlcGluZygpKSB7XG4gICAgICAgICAgICBib2R5Lndha2VVcCgpO1xuICAgICAgICB9XG4gICAgICAgIFZlYzMuY29weShib2R5LmFuZ3VsYXJWZWxvY2l0eSwgdmFsdWUpO1xuICAgIH1cblxuICAgIGFwcGx5Rm9yY2UgKGZvcmNlOiBjYy5WZWMzLCB3b3JsZFBvaW50PzogY2MuVmVjMykge1xuICAgICAgICBpZiAod29ybGRQb2ludCA9PSBudWxsKSB7XG4gICAgICAgICAgICB3b3JsZFBvaW50ID0gVmVjMy5aRVJPO1xuICAgICAgICB9XG4gICAgICAgIGxldCBib2R5ID0gdGhpcy5fc2hhcmVkQm9keS5ib2R5O1xuICAgICAgICBpZiAoYm9keS5pc1NsZWVwaW5nKCkpIHtcbiAgICAgICAgICAgIGJvZHkud2FrZVVwKCk7XG4gICAgICAgIH1cbiAgICAgICAgYm9keS5hcHBseUZvcmNlKFZlYzMuY29weSh2M19jYW5ub24wLCBmb3JjZSksIFZlYzMuY29weSh2M19jYW5ub24xLCB3b3JsZFBvaW50KSk7XG4gICAgfVxuXG4gICAgYXBwbHlJbXB1bHNlIChpbXB1bHNlOiBjYy5WZWMzLCB3b3JsZFBvaW50PzogY2MuVmVjMykge1xuICAgICAgICBpZiAod29ybGRQb2ludCA9PSBudWxsKSB7XG4gICAgICAgICAgICB3b3JsZFBvaW50ID0gVmVjMy5aRVJPO1xuICAgICAgICB9XG4gICAgICAgIGxldCBib2R5ID0gdGhpcy5fc2hhcmVkQm9keS5ib2R5O1xuICAgICAgICBpZiAoYm9keS5pc1NsZWVwaW5nKCkpIHtcbiAgICAgICAgICAgIGJvZHkud2FrZVVwKCk7XG4gICAgICAgIH1cbiAgICAgICAgYm9keS5hcHBseUltcHVsc2UoVmVjMy5jb3B5KHYzX2Nhbm5vbjAsIGltcHVsc2UpLCBWZWMzLmNvcHkodjNfY2Fubm9uMSwgd29ybGRQb2ludCkpO1xuICAgIH1cblxuICAgIGFwcGx5TG9jYWxGb3JjZSAoZm9yY2U6IGNjLlZlYzMsIGxvY2FsUG9pbnQ/OiBjYy5WZWMzKTogdm9pZCB7XG4gICAgICAgIGlmIChsb2NhbFBvaW50ID09IG51bGwpIHtcbiAgICAgICAgICAgIGxvY2FsUG9pbnQgPSBWZWMzLlpFUk87XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGJvZHkgPSB0aGlzLl9zaGFyZWRCb2R5LmJvZHk7XG4gICAgICAgIGlmIChib2R5LmlzU2xlZXBpbmcoKSkge1xuICAgICAgICAgICAgYm9keS53YWtlVXAoKTtcbiAgICAgICAgfVxuICAgICAgICBib2R5LmFwcGx5TG9jYWxGb3JjZShWZWMzLmNvcHkodjNfY2Fubm9uMCwgZm9yY2UpLCBWZWMzLmNvcHkodjNfY2Fubm9uMSwgbG9jYWxQb2ludCkpO1xuICAgIH1cblxuICAgIGFwcGx5TG9jYWxJbXB1bHNlIChpbXB1bHNlOiBjYy5WZWMzLCBsb2NhbFBvaW50PzogY2MuVmVjMyk6IHZvaWQge1xuICAgICAgICBpZiAobG9jYWxQb2ludCA9PSBudWxsKSB7XG4gICAgICAgICAgICBsb2NhbFBvaW50ID0gVmVjMy5aRVJPO1xuICAgICAgICB9XG4gICAgICAgIGxldCBib2R5ID0gdGhpcy5fc2hhcmVkQm9keS5ib2R5O1xuICAgICAgICBpZiAoYm9keS5pc1NsZWVwaW5nKCkpIHtcbiAgICAgICAgICAgIGJvZHkud2FrZVVwKCk7XG4gICAgICAgIH1cbiAgICAgICAgYm9keS5hcHBseUxvY2FsSW1wdWxzZShWZWMzLmNvcHkodjNfY2Fubm9uMCwgaW1wdWxzZSksIFZlYzMuY29weSh2M19jYW5ub24xLCBsb2NhbFBvaW50KSk7XG4gICAgfVxuXG4gICAgYXBwbHlUb3JxdWUgKHRvcnF1ZTogY2MuVmVjMyk6IHZvaWQge1xuICAgICAgICBsZXQgYm9keSA9IHRoaXMuX3NoYXJlZEJvZHkuYm9keTtcbiAgICAgICAgaWYgKGJvZHkuaXNTbGVlcGluZygpKSB7XG4gICAgICAgICAgICBib2R5Lndha2VVcCgpO1xuICAgICAgICB9XG4gICAgICAgIGJvZHkudG9ycXVlLnggKz0gdG9ycXVlLng7XG4gICAgICAgIGJvZHkudG9ycXVlLnkgKz0gdG9ycXVlLnk7XG4gICAgICAgIGJvZHkudG9ycXVlLnogKz0gdG9ycXVlLno7XG4gICAgfVxuXG4gICAgYXBwbHlMb2NhbFRvcnF1ZSAodG9ycXVlOiBjYy5WZWMzKTogdm9pZCB7XG4gICAgICAgIGxldCBib2R5ID0gdGhpcy5fc2hhcmVkQm9keS5ib2R5O1xuICAgICAgICBpZiAoYm9keS5pc1NsZWVwaW5nKCkpIHtcbiAgICAgICAgICAgIGJvZHkud2FrZVVwKCk7XG4gICAgICAgIH1cbiAgICAgICAgVmVjMy5jb3B5KHYzX2Nhbm5vbjAsIHRvcnF1ZSk7XG4gICAgICAgIGJvZHkudmVjdG9yVG9Xb3JsZEZyYW1lKHYzX2Nhbm5vbjAsIHYzX2Nhbm5vbjApO1xuICAgICAgICBib2R5LnRvcnF1ZS54ICs9IHYzX2Nhbm5vbjAueDtcbiAgICAgICAgYm9keS50b3JxdWUueSArPSB2M19jYW5ub24wLnk7XG4gICAgICAgIGJvZHkudG9ycXVlLnogKz0gdjNfY2Fubm9uMC56O1xuICAgIH1cbn0iXSwic291cmNlUm9vdCI6Ii8ifQ==