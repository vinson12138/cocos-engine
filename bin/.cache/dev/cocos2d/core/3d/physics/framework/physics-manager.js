
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/framework/physics-manager.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.Physics3DManager = void 0;

var _instance = require("./instance");

var _physicsMaterial = require("./assets/physics-material");

var _physicsRayResult = require("./physics-ray-result");

var _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _temp;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

var _cc$_decorator = cc._decorator,
    property = _cc$_decorator.property,
    ccclass = _cc$_decorator.ccclass;
/**
 * !#en
 * Physical systems manager.
 * !#zh
 * 物理系统管理器。
 * @class Physics3DManager
 */

var Physics3DManager = (_dec = ccclass("cc.Physics3DManager"), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
  function Physics3DManager() {
    this.physicsWorld = void 0;
    this.raycastClosestResult = new _physicsRayResult.PhysicsRayResult();
    this.raycastResults = [];

    _initializerDefineProperty(this, "_enabled", _descriptor, this);

    _initializerDefineProperty(this, "_allowSleep", _descriptor2, this);

    _initializerDefineProperty(this, "_gravity", _descriptor3, this);

    _initializerDefineProperty(this, "_maxSubStep", _descriptor4, this);

    _initializerDefineProperty(this, "_fixedTime", _descriptor5, this);

    _initializerDefineProperty(this, "_useFixedTime", _descriptor6, this);

    this.useAccumulator = false;
    this._accumulator = 0;
    this.useFixedDigit = false;
    this.useInternalTime = false;
    this.fixDigits = {
      position: 5,
      rotation: 12,
      timeNow: 3
    };
    this._deltaTime = 0;
    this._lastTime = 0;
    this._material = null;
    this.raycastOptions = {
      'groupIndex': -1,
      'queryTrigger': true,
      'maxDistance': Infinity
    };
    this.raycastResultPool = new cc.RecyclePool(function () {
      return new _physicsRayResult.PhysicsRayResult();
    }, 1);
    cc.director._scheduler && cc.director._scheduler.enableForTarget(this);
    this.physicsWorld = (0, _instance.createPhysicsWorld)();
    this._lastTime = performance.now();

    if (!CC_PHYSICS_BUILTIN) {
      this.gravity = this._gravity;
      this.allowSleep = this._allowSleep;
      this._material = new _physicsMaterial.PhysicsMaterial();
      this._material.friction = 0.1;
      this._material.restitution = 0.1;

      this._material.on('physics_material_update', this._updateMaterial, this);

      this.physicsWorld.defaultMaterial = this._material;
    }
  }
  /**
   * !#en
   * A physical system simulation is performed once and will now be performed automatically once per frame.
   * !#zh
   * 执行一次物理系统的模拟，目前将在每帧自动执行一次。
   * @method update
   * @param {number} deltaTime The time difference from the last execution is currently elapsed per frame
   */


  var _proto = Physics3DManager.prototype;

  _proto.update = function update(deltaTime) {
    if (CC_EDITOR) {
      return;
    }

    if (!this._enabled) {
      return;
    }

    if (this.useInternalTime) {
      var now = parseFloat(performance.now().toFixed(this.fixDigits.timeNow));
      this._deltaTime = now > this._lastTime ? (now - this._lastTime) / 1000 : 0;
      this._lastTime = now;
    } else {
      this._deltaTime = deltaTime;
    }

    cc.director.emit(cc.Director.EVENT_BEFORE_PHYSICS);

    if (CC_PHYSICS_BUILTIN) {
      this.physicsWorld.step(this._fixedTime);
    } else {
      if (this._useFixedTime) {
        this.physicsWorld.step(this._fixedTime);
      } else {
        if (this.useAccumulator) {
          var i = 0;
          this._accumulator += this._deltaTime;

          while (i < this._maxSubStep && this._accumulator > this._fixedTime) {
            this.physicsWorld.step(this._fixedTime);
            this._accumulator -= this._fixedTime;
            i++;
          }
        } else {
          this.physicsWorld.step(this._fixedTime, this._deltaTime, this._maxSubStep);
        }
      }
    }

    cc.director.emit(cc.Director.EVENT_AFTER_PHYSICS);
  }
  /**
   * !#en Detect all collision boxes and return all detected results, or null if none is detected. Note that the return value is taken from the object pool, so do not save the result reference or modify the result.
   * !#zh 检测所有的碰撞盒，并返回所有被检测到的结果，若没有检测到，则返回空值。注意返回值是从对象池中取的，所以请不要保存结果引用或者修改结果。
   * @method raycast
   * @param {Ray} worldRay A ray in world space
   * @param {number|string} groupIndexOrName Collision group index or group name
   * @param {number} maxDistance Maximum detection distance
   * @param {boolean} queryTrigger Detect trigger or not
   * @return {PhysicsRayResult[] | null} Detected result
   */
  ;

  _proto.raycast = function raycast(worldRay, groupIndexOrName, maxDistance, queryTrigger) {
    if (groupIndexOrName === void 0) {
      groupIndexOrName = 0;
    }

    if (maxDistance === void 0) {
      maxDistance = Infinity;
    }

    if (queryTrigger === void 0) {
      queryTrigger = true;
    }

    this.raycastResultPool.reset();
    this.raycastResults.length = 0;

    if (typeof groupIndexOrName == "string") {
      var groupIndex = cc.game.groupList.indexOf(groupIndexOrName);
      if (groupIndex == -1) groupIndex = 0;
      this.raycastOptions.groupIndex = groupIndex;
    } else {
      this.raycastOptions.groupIndex = groupIndexOrName;
    }

    this.raycastOptions.maxDistance = maxDistance;
    this.raycastOptions.queryTrigger = queryTrigger;
    var result = this.physicsWorld.raycast(worldRay, this.raycastOptions, this.raycastResultPool, this.raycastResults);
    if (result) return this.raycastResults;
    return null;
  }
  /**
   * !#en Detect all collision boxes and return the detection result with the shortest ray distance. If not, return null value. Note that the return value is taken from the object pool, so do not save the result reference or modify the result.
   * !#zh 检测所有的碰撞盒，并返回射线距离最短的检测结果，若没有，则返回空值。注意返回值是从对象池中取的，所以请不要保存结果引用或者修改结果。
   * @method raycastClosest
   * @param {Ray} worldRay A ray in world space
   * @param {number|string} groupIndexOrName Collision group index or group name
   * @param {number} maxDistance Maximum detection distance
   * @param {boolean} queryTrigger Detect trigger or not
   * @return {PhysicsRayResult|null} Detected result
   */
  ;

  _proto.raycastClosest = function raycastClosest(worldRay, groupIndexOrName, maxDistance, queryTrigger) {
    if (groupIndexOrName === void 0) {
      groupIndexOrName = 0;
    }

    if (maxDistance === void 0) {
      maxDistance = Infinity;
    }

    if (queryTrigger === void 0) {
      queryTrigger = true;
    }

    if (typeof groupIndexOrName == "string") {
      var groupIndex = cc.game.groupList.indexOf(groupIndexOrName);
      if (groupIndex == -1) groupIndex = 0;
      this.raycastOptions.groupIndex = groupIndex;
    } else {
      this.raycastOptions.groupIndex = groupIndexOrName;
    }

    this.raycastOptions.maxDistance = maxDistance;
    this.raycastOptions.queryTrigger = queryTrigger;
    var result = this.physicsWorld.raycastClosest(worldRay, this.raycastOptions, this.raycastClosestResult);
    if (result) return this.raycastClosestResult;
    return null;
  };

  _proto._updateMaterial = function _updateMaterial() {
    if (!CC_PHYSICS_BUILTIN) {
      this.physicsWorld.defaultMaterial = this._material;
    }
  };

  _createClass(Physics3DManager, [{
    key: "enabled",
    get:
    /**
     * !#en
     * Whether to enable the physics system, default is false.
     * !#zh
     * 是否启用物理系统，默认不启用。
     * @property {boolean} enabled
     */
    function get() {
      return this._enabled;
    },
    set: function set(value) {
      this._enabled = value;
    }
    /**
     * !#en
     * Whether to allow the physics system to automatically hibernate, default is true.
     * !#zh
     * 物理系统是否允许自动休眠，默认为 true。
     * @property {boolean} allowSleep
     */

  }, {
    key: "allowSleep",
    get: function get() {
      return this._allowSleep;
    },
    set: function set(v) {
      this._allowSleep = v;

      if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        this.physicsWorld.allowSleep = this._allowSleep;
      }
    }
    /**
     * !#en
     * The maximum number of sub-steps a full step is permitted to be broken into, default is 2.
     * !#zh
     * 物理每帧模拟的最大子步数，默认为 2。
     * @property {number} maxSubStep
     */

  }, {
    key: "maxSubStep",
    get: function get() {
      return this._maxSubStep;
    },
    set: function set(value) {
      this._maxSubStep = value;
    }
    /**
     * !#en
     * Time spent in each simulation of physics, default is 1/60s.
     * !#zh
     * 物理每步模拟消耗的固定时间，默认为 1/60 秒。
     * @property {number} deltaTime
     */

  }, {
    key: "deltaTime",
    get: function get() {
      return this._fixedTime;
    },
    set: function set(value) {
      this._fixedTime = value;
    }
    /**
     * !#en
     * Whether to use a fixed time step.
     * !#zh
     * 是否使用固定的时间步长。
     * @property {boolean} useFixedTime
     */

  }, {
    key: "useFixedTime",
    get: function get() {
      return this._useFixedTime;
    },
    set: function set(value) {
      this._useFixedTime = value;
    }
    /**
     * !#en
     * Gravity value of the physics simulation, default is (0, -10, 0).
     * !#zh
     * 物理世界的重力数值，默认为 (0, -10, 0)。
     * @property {Vec3} gravity
     */

  }, {
    key: "gravity",
    get: function get() {
      return this._gravity;
    },
    set: function set(gravity) {
      this._gravity.set(gravity);

      if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        this.physicsWorld.gravity = gravity;
      }
    }
    /**
     * !#en
     * Gets the global default physical material. Note that builtin is null.
     * !#zh
     * 获取全局的默认物理材质，注意：builtin 时为 null。
     * @property {PhysicsMaterial | null} defaultMaterial
     * @readonly
     */

  }, {
    key: "defaultMaterial",
    get: function get() {
      return this._material;
    }
  }]);

  return Physics3DManager;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_enabled", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_allowSleep", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_gravity", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new cc.Vec3(0, -10, 0);
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_maxSubStep", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_fixedTime", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1.0 / 60.0;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_useFixedTime", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return true;
  }
})), _class2)) || _class);
exports.Physics3DManager = Physics3DManager;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BoeXNpY3MvZnJhbWV3b3JrL3BoeXNpY3MtbWFuYWdlci50cyJdLCJuYW1lcyI6WyJjYyIsIl9kZWNvcmF0b3IiLCJwcm9wZXJ0eSIsImNjY2xhc3MiLCJQaHlzaWNzM0RNYW5hZ2VyIiwicGh5c2ljc1dvcmxkIiwicmF5Y2FzdENsb3Nlc3RSZXN1bHQiLCJQaHlzaWNzUmF5UmVzdWx0IiwicmF5Y2FzdFJlc3VsdHMiLCJ1c2VBY2N1bXVsYXRvciIsIl9hY2N1bXVsYXRvciIsInVzZUZpeGVkRGlnaXQiLCJ1c2VJbnRlcm5hbFRpbWUiLCJmaXhEaWdpdHMiLCJwb3NpdGlvbiIsInJvdGF0aW9uIiwidGltZU5vdyIsIl9kZWx0YVRpbWUiLCJfbGFzdFRpbWUiLCJfbWF0ZXJpYWwiLCJyYXljYXN0T3B0aW9ucyIsIkluZmluaXR5IiwicmF5Y2FzdFJlc3VsdFBvb2wiLCJSZWN5Y2xlUG9vbCIsImRpcmVjdG9yIiwiX3NjaGVkdWxlciIsImVuYWJsZUZvclRhcmdldCIsInBlcmZvcm1hbmNlIiwibm93IiwiQ0NfUEhZU0lDU19CVUlMVElOIiwiZ3Jhdml0eSIsIl9ncmF2aXR5IiwiYWxsb3dTbGVlcCIsIl9hbGxvd1NsZWVwIiwiUGh5c2ljc01hdGVyaWFsIiwiZnJpY3Rpb24iLCJyZXN0aXR1dGlvbiIsIm9uIiwiX3VwZGF0ZU1hdGVyaWFsIiwiZGVmYXVsdE1hdGVyaWFsIiwidXBkYXRlIiwiZGVsdGFUaW1lIiwiQ0NfRURJVE9SIiwiX2VuYWJsZWQiLCJwYXJzZUZsb2F0IiwidG9GaXhlZCIsImVtaXQiLCJEaXJlY3RvciIsIkVWRU5UX0JFRk9SRV9QSFlTSUNTIiwic3RlcCIsIl9maXhlZFRpbWUiLCJfdXNlRml4ZWRUaW1lIiwiaSIsIl9tYXhTdWJTdGVwIiwiRVZFTlRfQUZURVJfUEhZU0lDUyIsInJheWNhc3QiLCJ3b3JsZFJheSIsImdyb3VwSW5kZXhPck5hbWUiLCJtYXhEaXN0YW5jZSIsInF1ZXJ5VHJpZ2dlciIsInJlc2V0IiwibGVuZ3RoIiwiZ3JvdXBJbmRleCIsImdhbWUiLCJncm91cExpc3QiLCJpbmRleE9mIiwicmVzdWx0IiwicmF5Y2FzdENsb3Nlc3QiLCJ2YWx1ZSIsInYiLCJzZXQiLCJWZWMzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7OztxQkFFOEJBLEVBQUUsQ0FBQ0M7SUFBekJDLDBCQUFBQTtJQUFVQyx5QkFBQUE7QUFFbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0lBRWFDLDJCQURaRCxPQUFPLENBQUMscUJBQUQ7QUF3SkosOEJBQXVCO0FBQUEsU0EvQ2RFLFlBK0NjO0FBQUEsU0E5Q2RDLG9CQThDYyxHQTlDUyxJQUFJQyxrQ0FBSixFQThDVDtBQUFBLFNBN0NkQyxjQTZDYyxHQTdDdUIsRUE2Q3ZCOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBLFNBekJ2QkMsY0F5QnVCLEdBekJOLEtBeUJNO0FBQUEsU0F4QmZDLFlBd0JlLEdBeEJBLENBd0JBO0FBQUEsU0F0QnZCQyxhQXNCdUIsR0F0QlAsS0FzQk87QUFBQSxTQXJCdkJDLGVBcUJ1QixHQXJCTCxLQXFCSztBQUFBLFNBbkJkQyxTQW1CYyxHQW5CRjtBQUNqQkMsTUFBQUEsUUFBUSxFQUFFLENBRE87QUFFakJDLE1BQUFBLFFBQVEsRUFBRSxFQUZPO0FBR2pCQyxNQUFBQSxPQUFPLEVBQUU7QUFIUSxLQW1CRTtBQUFBLFNBZGZDLFVBY2UsR0FkRixDQWNFO0FBQUEsU0FiZkMsU0FhZSxHQWJILENBYUc7QUFBQSxTQVpOQyxTQVlNLEdBWmlDLElBWWpDO0FBQUEsU0FWTkMsY0FVTSxHQVY0QjtBQUMvQyxvQkFBYyxDQUFDLENBRGdDO0FBRS9DLHNCQUFnQixJQUYrQjtBQUcvQyxxQkFBZUM7QUFIZ0MsS0FVNUI7QUFBQSxTQUpOQyxpQkFJTSxHQUpjLElBQUl0QixFQUFFLENBQUN1QixXQUFQLENBQW1CLFlBQU07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O0FBQ0E7Ozs7U0FDSSxlQUF3QjtBQUNwQixhQUFPLEtBQUtyQyxRQUFaO0FBQ0g7U0FDRCxhQUFhRCxPQUFiLEVBQStCO0FBQzNCLFdBQUtDLFFBQUwsQ0FBY3VDLEdBQWQsQ0FBa0J4QyxPQUFsQjs7QUFDQSxVQUFJLENBQUNZLFNBQUQsSUFBYyxDQUFDYixrQkFBbkIsRUFBdUM7QUFDbkMsYUFBS3hCLFlBQUwsQ0FBa0J5QixPQUFsQixHQUE0QkEsT0FBNUI7QUFDSDtBQUNKO0FBRUQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztTQUNJLGVBQStDO0FBQzNDLGFBQU8sS0FBS1gsU0FBWjtBQUNIOzs7O3NGQU1BakI7Ozs7O1dBQ2tCOztnRkFFbEJBOzs7OztXQUNxQjs7NkVBRXJCQTs7Ozs7V0FDMkIsSUFBSUYsRUFBRSxDQUFDdUUsSUFBUCxDQUFZLENBQVosRUFBZSxDQUFDLEVBQWhCLEVBQW9CLENBQXBCOztnRkFFM0JyRTs7Ozs7V0FDcUI7OytFQUVyQkE7Ozs7O1dBQ29CLE1BQU07O2tGQUUxQkE7Ozs7O1dBQ3VCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCB7IElQaHlzaWNzV29ybGQsIElSYXljYXN0T3B0aW9ucyB9IGZyb20gJy4uL3NwZWMvaS1waHlzaWNzLXdvcmxkJztcbmltcG9ydCB7IGNyZWF0ZVBoeXNpY3NXb3JsZCB9IGZyb20gJy4vaW5zdGFuY2UnO1xuaW1wb3J0IHsgUGh5c2ljc01hdGVyaWFsIH0gZnJvbSAnLi9hc3NldHMvcGh5c2ljcy1tYXRlcmlhbCc7XG5pbXBvcnQgeyBQaHlzaWNzUmF5UmVzdWx0IH0gZnJvbSAnLi9waHlzaWNzLXJheS1yZXN1bHQnO1xuXG5jb25zdCB7IHByb3BlcnR5LCBjY2NsYXNzIH0gPSBjYy5fZGVjb3JhdG9yO1xuXG4vKipcbiAqICEjZW5cbiAqIFBoeXNpY2FsIHN5c3RlbXMgbWFuYWdlci5cbiAqICEjemhcbiAqIOeJqeeQhuezu+e7n+euoeeQhuWZqOOAglxuICogQGNsYXNzIFBoeXNpY3MzRE1hbmFnZXJcbiAqL1xuQGNjY2xhc3MoXCJjYy5QaHlzaWNzM0RNYW5hZ2VyXCIpXG5leHBvcnQgY2xhc3MgUGh5c2ljczNETWFuYWdlciB7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogV2hldGhlciB0byBlbmFibGUgdGhlIHBoeXNpY3Mgc3lzdGVtLCBkZWZhdWx0IGlzIGZhbHNlLlxuICAgICAqICEjemhcbiAgICAgKiDmmK/lkKblkK/nlKjniannkIbns7vnu5/vvIzpu5jorqTkuI3lkK/nlKjjgIJcbiAgICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IGVuYWJsZWRcbiAgICAgKi9cbiAgICBnZXQgZW5hYmxlZCAoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbmFibGVkO1xuICAgIH1cbiAgICBzZXQgZW5hYmxlZCAodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fZW5hYmxlZCA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBXaGV0aGVyIHRvIGFsbG93IHRoZSBwaHlzaWNzIHN5c3RlbSB0byBhdXRvbWF0aWNhbGx5IGhpYmVybmF0ZSwgZGVmYXVsdCBpcyB0cnVlLlxuICAgICAqICEjemhcbiAgICAgKiDniannkIbns7vnu5/mmK/lkKblhYHorrjoh6rliqjkvJHnnKDvvIzpu5jorqTkuLogdHJ1ZeOAglxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gYWxsb3dTbGVlcFxuICAgICAqL1xuICAgIGdldCBhbGxvd1NsZWVwICgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FsbG93U2xlZXA7XG4gICAgfVxuICAgIHNldCBhbGxvd1NsZWVwICh2OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2FsbG93U2xlZXAgPSB2O1xuICAgICAgICBpZiAoIUNDX0VESVRPUiAmJiAhQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLnBoeXNpY3NXb3JsZC5hbGxvd1NsZWVwID0gdGhpcy5fYWxsb3dTbGVlcDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBUaGUgbWF4aW11bSBudW1iZXIgb2Ygc3ViLXN0ZXBzIGEgZnVsbCBzdGVwIGlzIHBlcm1pdHRlZCB0byBiZSBicm9rZW4gaW50bywgZGVmYXVsdCBpcyAyLlxuICAgICAqICEjemhcbiAgICAgKiDniannkIbmr4/luKfmqKHmi5/nmoTmnIDlpKflrZDmraXmlbDvvIzpu5jorqTkuLogMuOAglxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtYXhTdWJTdGVwXG4gICAgICovXG4gICAgZ2V0IG1heFN1YlN0ZXAgKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXhTdWJTdGVwO1xuICAgIH1cbiAgICBzZXQgbWF4U3ViU3RlcCAodmFsdWU6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9tYXhTdWJTdGVwID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFRpbWUgc3BlbnQgaW4gZWFjaCBzaW11bGF0aW9uIG9mIHBoeXNpY3MsIGRlZmF1bHQgaXMgMS82MHMuXG4gICAgICogISN6aFxuICAgICAqIOeJqeeQhuavj+atpeaooeaLn+a2iOiAl+eahOWbuuWumuaXtumXtO+8jOm7mOiupOS4uiAxLzYwIOenkuOAglxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkZWx0YVRpbWVcbiAgICAgKi9cbiAgICBnZXQgZGVsdGFUaW1lICgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fZml4ZWRUaW1lO1xuICAgIH1cbiAgICBzZXQgZGVsdGFUaW1lICh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX2ZpeGVkVGltZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBXaGV0aGVyIHRvIHVzZSBhIGZpeGVkIHRpbWUgc3RlcC5cbiAgICAgKiAhI3poXG4gICAgICog5piv5ZCm5L2/55So5Zu65a6a55qE5pe26Ze05q2l6ZW/44CCXG4gICAgICogQHByb3BlcnR5IHtib29sZWFufSB1c2VGaXhlZFRpbWVcbiAgICAgKi9cbiAgICBnZXQgdXNlRml4ZWRUaW1lICgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VzZUZpeGVkVGltZTtcbiAgICB9XG4gICAgc2V0IHVzZUZpeGVkVGltZSAodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fdXNlRml4ZWRUaW1lID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdyYXZpdHkgdmFsdWUgb2YgdGhlIHBoeXNpY3Mgc2ltdWxhdGlvbiwgZGVmYXVsdCBpcyAoMCwgLTEwLCAwKS5cbiAgICAgKiAhI3poXG4gICAgICog54mp55CG5LiW55WM55qE6YeN5Yqb5pWw5YC877yM6buY6K6k5Li6ICgwLCAtMTAsIDAp44CCXG4gICAgICogQHByb3BlcnR5IHtWZWMzfSBncmF2aXR5XG4gICAgICovXG4gICAgZ2V0IGdyYXZpdHkgKCk6IGNjLlZlYzMge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ3Jhdml0eTtcbiAgICB9XG4gICAgc2V0IGdyYXZpdHkgKGdyYXZpdHk6IGNjLlZlYzMpIHtcbiAgICAgICAgdGhpcy5fZ3Jhdml0eS5zZXQoZ3Jhdml0eSk7XG4gICAgICAgIGlmICghQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMucGh5c2ljc1dvcmxkLmdyYXZpdHkgPSBncmF2aXR5O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldHMgdGhlIGdsb2JhbCBkZWZhdWx0IHBoeXNpY2FsIG1hdGVyaWFsLiBOb3RlIHRoYXQgYnVpbHRpbiBpcyBudWxsLlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5blhajlsYDnmoTpu5jorqTniannkIbmnZDotKjvvIzms6jmhI/vvJpidWlsdGluIOaXtuS4uiBudWxs44CCXG4gICAgICogQHByb3BlcnR5IHtQaHlzaWNzTWF0ZXJpYWwgfCBudWxsfSBkZWZhdWx0TWF0ZXJpYWxcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBnZXQgZGVmYXVsdE1hdGVyaWFsICgpOiBQaHlzaWNzTWF0ZXJpYWwgfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hdGVyaWFsO1xuICAgIH1cblxuICAgIHJlYWRvbmx5IHBoeXNpY3NXb3JsZDogSVBoeXNpY3NXb3JsZDtcbiAgICByZWFkb25seSByYXljYXN0Q2xvc2VzdFJlc3VsdCA9IG5ldyBQaHlzaWNzUmF5UmVzdWx0KCk7XG4gICAgcmVhZG9ubHkgcmF5Y2FzdFJlc3VsdHM6IFBoeXNpY3NSYXlSZXN1bHRbXSA9IFtdO1xuXG4gICAgQHByb3BlcnR5XG4gICAgcHJpdmF0ZSBfZW5hYmxlZCA9IGZhbHNlO1xuXG4gICAgQHByb3BlcnR5XG4gICAgcHJpdmF0ZSBfYWxsb3dTbGVlcCA9IHRydWU7XG5cbiAgICBAcHJvcGVydHlcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9ncmF2aXR5ID0gbmV3IGNjLlZlYzMoMCwgLTEwLCAwKTtcblxuICAgIEBwcm9wZXJ0eVxuICAgIHByaXZhdGUgX21heFN1YlN0ZXAgPSAxO1xuXG4gICAgQHByb3BlcnR5XG4gICAgcHJpdmF0ZSBfZml4ZWRUaW1lID0gMS4wIC8gNjAuMDtcblxuICAgIEBwcm9wZXJ0eVxuICAgIHByaXZhdGUgX3VzZUZpeGVkVGltZSA9IHRydWU7XG5cbiAgICB1c2VBY2N1bXVsYXRvciA9IGZhbHNlO1xuICAgIHByaXZhdGUgX2FjY3VtdWxhdG9yID0gMDtcblxuICAgIHVzZUZpeGVkRGlnaXQgPSBmYWxzZTtcbiAgICB1c2VJbnRlcm5hbFRpbWUgPSBmYWxzZTtcblxuICAgIHJlYWRvbmx5IGZpeERpZ2l0cyA9IHtcbiAgICAgICAgcG9zaXRpb246IDUsXG4gICAgICAgIHJvdGF0aW9uOiAxMixcbiAgICAgICAgdGltZU5vdzogMyxcbiAgICB9XG4gICAgcHJpdmF0ZSBfZGVsdGFUaW1lID0gMDtcbiAgICBwcml2YXRlIF9sYXN0VGltZSA9IDA7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfbWF0ZXJpYWw6IGNjLlBoeXNpY3NNYXRlcmlhbCB8IG51bGwgPSBudWxsO1xuXG4gICAgcHJpdmF0ZSByZWFkb25seSByYXljYXN0T3B0aW9uczogSVJheWNhc3RPcHRpb25zID0ge1xuICAgICAgICAnZ3JvdXBJbmRleCc6IC0xLFxuICAgICAgICAncXVlcnlUcmlnZ2VyJzogdHJ1ZSxcbiAgICAgICAgJ21heERpc3RhbmNlJzogSW5maW5pdHlcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IHJheWNhc3RSZXN1bHRQb29sID0gbmV3IGNjLlJlY3ljbGVQb29sKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQaHlzaWNzUmF5UmVzdWx0KCk7XG4gICAgfSwgMSk7XG5cbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IuX3NjaGVkdWxlciAmJiBjYy5kaXJlY3Rvci5fc2NoZWR1bGVyLmVuYWJsZUZvclRhcmdldCh0aGlzKTtcbiAgICAgICAgdGhpcy5waHlzaWNzV29ybGQgPSBjcmVhdGVQaHlzaWNzV29ybGQoKTtcbiAgICAgICAgdGhpcy5fbGFzdFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgaWYgKCFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMuZ3Jhdml0eSA9IHRoaXMuX2dyYXZpdHk7XG4gICAgICAgICAgICB0aGlzLmFsbG93U2xlZXAgPSB0aGlzLl9hbGxvd1NsZWVwO1xuICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWwgPSBuZXcgUGh5c2ljc01hdGVyaWFsKCk7XG4gICAgICAgICAgICB0aGlzLl9tYXRlcmlhbC5mcmljdGlvbiA9IDAuMTtcbiAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsLnJlc3RpdHV0aW9uID0gMC4xO1xuICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWwub24oJ3BoeXNpY3NfbWF0ZXJpYWxfdXBkYXRlJywgdGhpcy5fdXBkYXRlTWF0ZXJpYWwsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5waHlzaWNzV29ybGQuZGVmYXVsdE1hdGVyaWFsID0gdGhpcy5fbWF0ZXJpYWw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQSBwaHlzaWNhbCBzeXN0ZW0gc2ltdWxhdGlvbiBpcyBwZXJmb3JtZWQgb25jZSBhbmQgd2lsbCBub3cgYmUgcGVyZm9ybWVkIGF1dG9tYXRpY2FsbHkgb25jZSBwZXIgZnJhbWUuXG4gICAgICogISN6aFxuICAgICAqIOaJp+ihjOS4gOasoeeJqeeQhuezu+e7n+eahOaooeaLn++8jOebruWJjeWwhuWcqOavj+W4p+iHquWKqOaJp+ihjOS4gOasoeOAglxuICAgICAqIEBtZXRob2QgdXBkYXRlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRlbHRhVGltZSBUaGUgdGltZSBkaWZmZXJlbmNlIGZyb20gdGhlIGxhc3QgZXhlY3V0aW9uIGlzIGN1cnJlbnRseSBlbGFwc2VkIHBlciBmcmFtZVxuICAgICAqL1xuICAgIHVwZGF0ZSAoZGVsdGFUaW1lOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fZW5hYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudXNlSW50ZXJuYWxUaW1lKSB7XG4gICAgICAgICAgICB2YXIgbm93ID0gcGFyc2VGbG9hdChwZXJmb3JtYW5jZS5ub3coKS50b0ZpeGVkKHRoaXMuZml4RGlnaXRzLnRpbWVOb3cpKTtcbiAgICAgICAgICAgIHRoaXMuX2RlbHRhVGltZSA9IG5vdyA+IHRoaXMuX2xhc3RUaW1lID8gKG5vdyAtIHRoaXMuX2xhc3RUaW1lKSAvIDEwMDAgOiAwO1xuICAgICAgICAgICAgdGhpcy5fbGFzdFRpbWUgPSBub3c7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9kZWx0YVRpbWUgPSBkZWx0YVRpbWU7XG4gICAgICAgIH1cblxuICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9QSFlTSUNTKTtcblxuICAgICAgICBpZiAoQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLnBoeXNpY3NXb3JsZC5zdGVwKHRoaXMuX2ZpeGVkVGltZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fdXNlRml4ZWRUaW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5waHlzaWNzV29ybGQuc3RlcCh0aGlzLl9maXhlZFRpbWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy51c2VBY2N1bXVsYXRvcikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FjY3VtdWxhdG9yICs9IHRoaXMuX2RlbHRhVGltZTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGkgPCB0aGlzLl9tYXhTdWJTdGVwICYmIHRoaXMuX2FjY3VtdWxhdG9yID4gdGhpcy5fZml4ZWRUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBoeXNpY3NXb3JsZC5zdGVwKHRoaXMuX2ZpeGVkVGltZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9hY2N1bXVsYXRvciAtPSB0aGlzLl9maXhlZFRpbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBoeXNpY3NXb3JsZC5zdGVwKHRoaXMuX2ZpeGVkVGltZSwgdGhpcy5fZGVsdGFUaW1lLCB0aGlzLl9tYXhTdWJTdGVwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KGNjLkRpcmVjdG9yLkVWRU5UX0FGVEVSX1BIWVNJQ1MpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gRGV0ZWN0IGFsbCBjb2xsaXNpb24gYm94ZXMgYW5kIHJldHVybiBhbGwgZGV0ZWN0ZWQgcmVzdWx0cywgb3IgbnVsbCBpZiBub25lIGlzIGRldGVjdGVkLiBOb3RlIHRoYXQgdGhlIHJldHVybiB2YWx1ZSBpcyB0YWtlbiBmcm9tIHRoZSBvYmplY3QgcG9vbCwgc28gZG8gbm90IHNhdmUgdGhlIHJlc3VsdCByZWZlcmVuY2Ugb3IgbW9kaWZ5IHRoZSByZXN1bHQuXG4gICAgICogISN6aCDmo4DmtYvmiYDmnInnmoTnorDmkp7nm5LvvIzlubbov5Tlm57miYDmnInooqvmo4DmtYvliLDnmoTnu5PmnpzvvIzoi6XmsqHmnInmo4DmtYvliLDvvIzliJnov5Tlm57nqbrlgLzjgILms6jmhI/ov5Tlm57lgLzmmK/ku47lr7nosaHmsaDkuK3lj5bnmoTvvIzmiYDku6Xor7fkuI3opoHkv53lrZjnu5PmnpzlvJXnlKjmiJbogIXkv67mlLnnu5PmnpzjgIJcbiAgICAgKiBAbWV0aG9kIHJheWNhc3RcbiAgICAgKiBAcGFyYW0ge1JheX0gd29ybGRSYXkgQSByYXkgaW4gd29ybGQgc3BhY2VcbiAgICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd9IGdyb3VwSW5kZXhPck5hbWUgQ29sbGlzaW9uIGdyb3VwIGluZGV4IG9yIGdyb3VwIG5hbWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4RGlzdGFuY2UgTWF4aW11bSBkZXRlY3Rpb24gZGlzdGFuY2VcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHF1ZXJ5VHJpZ2dlciBEZXRlY3QgdHJpZ2dlciBvciBub3RcbiAgICAgKiBAcmV0dXJuIHtQaHlzaWNzUmF5UmVzdWx0W10gfCBudWxsfSBEZXRlY3RlZCByZXN1bHRcbiAgICAgKi9cbiAgICByYXljYXN0ICh3b3JsZFJheTogY2MuZ2VvbVV0aWxzLlJheSwgZ3JvdXBJbmRleE9yTmFtZTogbnVtYmVyIHwgc3RyaW5nID0gMCwgbWF4RGlzdGFuY2UgPSBJbmZpbml0eSwgcXVlcnlUcmlnZ2VyID0gdHJ1ZSk6IFBoeXNpY3NSYXlSZXN1bHRbXSB8IG51bGwge1xuICAgICAgICB0aGlzLnJheWNhc3RSZXN1bHRQb29sLnJlc2V0KCk7XG4gICAgICAgIHRoaXMucmF5Y2FzdFJlc3VsdHMubGVuZ3RoID0gMDtcbiAgICAgICAgaWYgKHR5cGVvZiBncm91cEluZGV4T3JOYW1lID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGxldCBncm91cEluZGV4ID0gY2MuZ2FtZS5ncm91cExpc3QuaW5kZXhPZihncm91cEluZGV4T3JOYW1lKTtcbiAgICAgICAgICAgIGlmIChncm91cEluZGV4ID09IC0xKSBncm91cEluZGV4ID0gMDtcbiAgICAgICAgICAgIHRoaXMucmF5Y2FzdE9wdGlvbnMuZ3JvdXBJbmRleCA9IGdyb3VwSW5kZXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJheWNhc3RPcHRpb25zLmdyb3VwSW5kZXggPSBncm91cEluZGV4T3JOYW1lO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmF5Y2FzdE9wdGlvbnMubWF4RGlzdGFuY2UgPSBtYXhEaXN0YW5jZTtcbiAgICAgICAgdGhpcy5yYXljYXN0T3B0aW9ucy5xdWVyeVRyaWdnZXIgPSBxdWVyeVRyaWdnZXI7XG4gICAgICAgIGxldCByZXN1bHQgPSB0aGlzLnBoeXNpY3NXb3JsZC5yYXljYXN0KHdvcmxkUmF5LCB0aGlzLnJheWNhc3RPcHRpb25zLCB0aGlzLnJheWNhc3RSZXN1bHRQb29sLCB0aGlzLnJheWNhc3RSZXN1bHRzKTtcbiAgICAgICAgaWYgKHJlc3VsdCkgcmV0dXJuIHRoaXMucmF5Y2FzdFJlc3VsdHM7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gRGV0ZWN0IGFsbCBjb2xsaXNpb24gYm94ZXMgYW5kIHJldHVybiB0aGUgZGV0ZWN0aW9uIHJlc3VsdCB3aXRoIHRoZSBzaG9ydGVzdCByYXkgZGlzdGFuY2UuIElmIG5vdCwgcmV0dXJuIG51bGwgdmFsdWUuIE5vdGUgdGhhdCB0aGUgcmV0dXJuIHZhbHVlIGlzIHRha2VuIGZyb20gdGhlIG9iamVjdCBwb29sLCBzbyBkbyBub3Qgc2F2ZSB0aGUgcmVzdWx0IHJlZmVyZW5jZSBvciBtb2RpZnkgdGhlIHJlc3VsdC5cbiAgICAgKiAhI3poIOajgOa1i+aJgOacieeahOeisOaSnuebku+8jOW5tui/lOWbnuWwhOe6v+i3neemu+acgOefreeahOajgOa1i+e7k+aenO+8jOiLpeayoeacie+8jOWImei/lOWbnuepuuWAvOOAguazqOaEj+i/lOWbnuWAvOaYr+S7juWvueixoeaxoOS4reWPlueahO+8jOaJgOS7peivt+S4jeimgeS/neWtmOe7k+aenOW8leeUqOaIluiAheS/ruaUuee7k+aenOOAglxuICAgICAqIEBtZXRob2QgcmF5Y2FzdENsb3Nlc3RcbiAgICAgKiBAcGFyYW0ge1JheX0gd29ybGRSYXkgQSByYXkgaW4gd29ybGQgc3BhY2VcbiAgICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd9IGdyb3VwSW5kZXhPck5hbWUgQ29sbGlzaW9uIGdyb3VwIGluZGV4IG9yIGdyb3VwIG5hbWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4RGlzdGFuY2UgTWF4aW11bSBkZXRlY3Rpb24gZGlzdGFuY2VcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHF1ZXJ5VHJpZ2dlciBEZXRlY3QgdHJpZ2dlciBvciBub3RcbiAgICAgKiBAcmV0dXJuIHtQaHlzaWNzUmF5UmVzdWx0fG51bGx9IERldGVjdGVkIHJlc3VsdFxuICAgICAqL1xuICAgIHJheWNhc3RDbG9zZXN0ICh3b3JsZFJheTogY2MuZ2VvbVV0aWxzLlJheSwgZ3JvdXBJbmRleE9yTmFtZTogbnVtYmVyIHwgc3RyaW5nID0gMCwgbWF4RGlzdGFuY2UgPSBJbmZpbml0eSwgcXVlcnlUcmlnZ2VyID0gdHJ1ZSk6IFBoeXNpY3NSYXlSZXN1bHQgfCBudWxsIHtcbiAgICAgICAgaWYgKHR5cGVvZiBncm91cEluZGV4T3JOYW1lID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGxldCBncm91cEluZGV4ID0gY2MuZ2FtZS5ncm91cExpc3QuaW5kZXhPZihncm91cEluZGV4T3JOYW1lKTtcbiAgICAgICAgICAgIGlmIChncm91cEluZGV4ID09IC0xKSBncm91cEluZGV4ID0gMDtcbiAgICAgICAgICAgIHRoaXMucmF5Y2FzdE9wdGlvbnMuZ3JvdXBJbmRleCA9IGdyb3VwSW5kZXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJheWNhc3RPcHRpb25zLmdyb3VwSW5kZXggPSBncm91cEluZGV4T3JOYW1lO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmF5Y2FzdE9wdGlvbnMubWF4RGlzdGFuY2UgPSBtYXhEaXN0YW5jZTtcbiAgICAgICAgdGhpcy5yYXljYXN0T3B0aW9ucy5xdWVyeVRyaWdnZXIgPSBxdWVyeVRyaWdnZXI7XG4gICAgICAgIGxldCByZXN1bHQgPSB0aGlzLnBoeXNpY3NXb3JsZC5yYXljYXN0Q2xvc2VzdCh3b3JsZFJheSwgdGhpcy5yYXljYXN0T3B0aW9ucywgdGhpcy5yYXljYXN0Q2xvc2VzdFJlc3VsdCk7XG4gICAgICAgIGlmIChyZXN1bHQpIHJldHVybiB0aGlzLnJheWNhc3RDbG9zZXN0UmVzdWx0O1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF91cGRhdGVNYXRlcmlhbCAoKSB7XG4gICAgICAgIGlmICghQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLnBoeXNpY3NXb3JsZC5kZWZhdWx0TWF0ZXJpYWwgPSB0aGlzLl9tYXRlcmlhbDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiLyJ9