
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/framework/components/collider/collider-component.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.Collider3D = void 0;

var _physicsMaterial = require("../../assets/physics-material");

var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

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
    property = _cc$_decorator.property;
var Vec3 = cc.Vec3;
/**
 * !#en
 * The base class of the collider.
 * !#zh
 * 碰撞器的基类。
 * @class Collider3D
 * @extends Component
 * @uses EventTarget
 */

var Collider3D = (_dec = ccclass('cc.Collider3D'), _dec2 = property({
  type: _physicsMaterial.PhysicsMaterial,
  displayName: 'Material',
  displayOrder: -1
}), _dec3 = property({
  displayOrder: 0
}), _dec4 = property({
  type: cc.Vec3,
  displayOrder: 1
}), _dec5 = property({
  type: _physicsMaterial.PhysicsMaterial
}), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_cc$Component) {
  _inheritsLoose(Collider3D, _cc$Component);

  function Collider3D() {
    var _this;

    _this = _cc$Component.call(this) || this;
    _this._shape = void 0;
    _this._isSharedMaterial = true;

    _initializerDefineProperty(_this, "_material", _descriptor, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_isTrigger", _descriptor2, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_center", _descriptor3, _assertThisInitialized(_this));

    cc.EventTarget.call(_assertThisInitialized(_this));
    return _this;
  } /// EVENT INTERFACE ///

  /**
   * !#en
   * Register an callback of a specific event type on the EventTarget.
   * This type of event should be triggered via `emit`.
   * !#zh
   * 注册事件目标的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
   *
   * @method on
   * @param {String} type - The type of collider event can be `trigger-enter`, `trigger-stay`, `trigger-exit` or `collision-enter`, `collision-stay`, `collision-exit`.
   * @param {Function} callback - The callback that will be invoked when the event is dispatched.
   * The callback is ignored if it is a duplicate (the callbacks are unique).
   * @param {ITriggerEvent|ICollisionEvent} callback.event Callback function argument
   * @param {Object} [target] - The target (this object) to invoke the callback, can be null.
   * @return {Function} - Just returns the incoming callback so you can save the anonymous function easier.
   * @typescript
   * on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T
   * @example
   * eventTarget.on('fire', function (event) {
   *     // event is ITriggerEvent or ICollisionEvent
   * }, node);
   */


  var _proto = Collider3D.prototype;

  _proto.on = function on(type, callback, target, useCapture) {}
  /**
   * !#en
   * Removes the listeners previously registered with the same type, callback, target and or useCapture,
   * if only type is passed as parameter, all listeners registered with that type will be removed.
   * !#zh
   * 删除之前用同类型，回调，目标或 useCapture 注册的事件监听器，如果只传递 type，将会删除 type 类型的所有事件监听器。
   *
   * @method off
   * @param {String} type - The type of collider event can be `trigger-enter`, `trigger-stay`, `trigger-exit` or `collision-enter`, `collision-stay`, `collision-exit`.
   * @param {Function} [callback] - The callback to remove.
   * @param {Object} [target] - The target (this object) to invoke the callback, if it's not given, only callback without target will be removed.
   * @example
   * // register fire eventListener
   * var callback = eventTarget.on('fire', function () {
   *     cc.log("fire in the hole");
   * }, target);
   * // remove fire event listener
   * eventTarget.off('fire', callback, target);
   * // remove all fire event listeners
   * eventTarget.off('fire');
   */
  ;

  _proto.off = function off(type, callback, target) {}
  /**
   * !#en
   * Register an callback of a specific event type on the EventTarget,
   * the callback will remove itself after the first time it is triggered.
   * !#zh
   * 注册事件目标的特定事件类型回调，回调会在第一时间被触发后删除自身。
   *
   * @method once
   * @param {String} type - The type of collider event can be `trigger-enter`, `trigger-stay`, `trigger-exit` or `collision-enter`, `collision-stay`, `collision-exit`.
   * @param {Function} callback - The callback that will be invoked when the event is dispatched.
   * The callback is ignored if it is a duplicate (the callbacks are unique).
   * @param {ITriggerEvent|ICollisionEvent} callback.event callback function argument.
   * @param {Object} [target] - The target (this object) to invoke the callback, can be null.
   * @example
   * eventTarget.once('fire', function (event) {
   *     // event is ITriggerEvent or ICollisionEvent
   * }, node);
   */
  ;

  _proto.once = function once(type, callback, target) {}
  /* declare for typescript tip */
  ;

  _proto.emit = function emit(key) {} /// COMPONENT LIFECYCLE ///
  ;

  _proto.__preload = function __preload() {
    if (!CC_EDITOR) {
      this._shape.__preload(this);
    }
  };

  _proto.onLoad = function onLoad() {
    if (!CC_EDITOR) {
      if (!CC_PHYSICS_BUILTIN) {
        this.sharedMaterial = this._material == null ? cc.director.getPhysics3DManager().defaultMaterial : this._material;
      }

      this._shape.onLoad();
    }
  };

  _proto.onEnable = function onEnable() {
    if (!CC_EDITOR) {
      this._shape.onEnable();
    }
  };

  _proto.onDisable = function onDisable() {
    if (!CC_EDITOR) {
      this._shape.onDisable();
    }
  };

  _proto.onDestroy = function onDestroy() {
    if (!CC_EDITOR) {
      if (this._material) {
        this._material.off('physics_material_update', this._updateMaterial, this);
      }

      this._shape.onDestroy();
    }
  };

  _proto._updateMaterial = function _updateMaterial() {
    if (!CC_EDITOR) {
      this._shape.material = this._material;
    }
  };

  _createClass(Collider3D, [{
    key: "sharedMaterial",
    get:
    /**
     * @property {PhysicsMaterial} sharedMaterial
     */
    function get() {
      return this._material;
    },
    set: function set(value) {
      this.material = value;
    }
  }, {
    key: "material",
    get: function get() {
      if (!CC_PHYSICS_BUILTIN) {
        if (this._isSharedMaterial && this._material != null) {
          this._material.off('physics_material_update', this._updateMaterial, this);

          this._material = this._material.clone();

          this._material.on('physics_material_update', this._updateMaterial, this);

          this._isSharedMaterial = false;
        }
      }

      return this._material;
    },
    set: function set(value) {
      if (CC_EDITOR || CC_PHYSICS_BUILTIN) {
        this._material = value;
        return;
      }

      if (value != null && this._material != null) {
        if (this._material._uuid != value._uuid) {
          this._material.off('physics_material_update', this._updateMaterial, this);

          value.on('physics_material_update', this._updateMaterial, this);
          this._isSharedMaterial = false;
          this._material = value;
        }
      } else if (value != null && this._material == null) {
        value.on('physics_material_update', this._updateMaterial, this);
        this._material = value;
      } else if (value == null && this._material != null) {
        this._material.off('physics_material_update', this._updateMaterial, this);

        this._material = value;
      }

      this._updateMaterial();
    }
    /**
     * !#en
     * get or set the collider is trigger, this will be always trigger if using builtin.
     * !#zh
     * 获取或设置碰撞器是否为触发器。
     * @property {Boolean} isTrigger
     */

  }, {
    key: "isTrigger",
    get: function get() {
      return this._isTrigger;
    },
    set: function set(value) {
      this._isTrigger = value;

      if (!CC_EDITOR) {
        this._shape.isTrigger = this._isTrigger;
      }
    }
    /**
     * !#en
     * get or set the center of the collider, in local space.
     * !#zh
     * 获取或设置碰撞器的中心点。
     * @property {Vec3} center
     */

  }, {
    key: "center",
    get: function get() {
      return this._center;
    },
    set: function set(value) {
      Vec3.copy(this._center, value);

      if (!CC_EDITOR) {
        this._shape.center = this._center;
      }
    }
    /**
     * !#en
     * get the collider attached rigidbody, this may be null.
     * !#zh
     * 获取碰撞器所绑定的刚体组件，可能为 null。
     * @property {RigidBody3D|null} attachedRigidbody
     * @readonly
     */

  }, {
    key: "attachedRigidbody",
    get: function get() {
      return this.shape.attachedRigidBody;
    }
    /**
     * !#en
     * get collider shape.
     * !#zh
     * 获取碰撞器形状。
     * @property {IBaseShape} shape
     * @readonly
     */

  }, {
    key: "shape",
    get: function get() {
      return this._shape;
    } /// PRIVATE PROPERTY ///

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

  return Collider3D;
}(cc.Component), _temp), (_applyDecoratedDescriptor(_class2.prototype, "sharedMaterial", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "sharedMaterial"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isTrigger", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "isTrigger"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "center", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "center"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_material", [_dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_isTrigger", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_center", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Vec3();
  }
})), _class2)) || _class);
exports.Collider3D = Collider3D;
cc.js.mixin(Collider3D.prototype, cc.EventTarget.prototype);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BoeXNpY3MvZnJhbWV3b3JrL2NvbXBvbmVudHMvY29sbGlkZXIvY29sbGlkZXItY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbImNjIiwiX2RlY29yYXRvciIsImNjY2xhc3MiLCJwcm9wZXJ0eSIsIlZlYzMiLCJDb2xsaWRlcjNEIiwidHlwZSIsIlBoeXNpY3NNYXRlcmlhbCIsImRpc3BsYXlOYW1lIiwiZGlzcGxheU9yZGVyIiwiX3NoYXBlIiwiX2lzU2hhcmVkTWF0ZXJpYWwiLCJFdmVudFRhcmdldCIsImNhbGwiLCJvbiIsImNhbGxiYWNrIiwidGFyZ2V0IiwidXNlQ2FwdHVyZSIsIm9mZiIsIm9uY2UiLCJlbWl0Iiwia2V5IiwiX19wcmVsb2FkIiwiQ0NfRURJVE9SIiwib25Mb2FkIiwiQ0NfUEhZU0lDU19CVUlMVElOIiwic2hhcmVkTWF0ZXJpYWwiLCJfbWF0ZXJpYWwiLCJkaXJlY3RvciIsImdldFBoeXNpY3MzRE1hbmFnZXIiLCJkZWZhdWx0TWF0ZXJpYWwiLCJvbkVuYWJsZSIsIm9uRGlzYWJsZSIsIm9uRGVzdHJveSIsIl91cGRhdGVNYXRlcmlhbCIsIm1hdGVyaWFsIiwidmFsdWUiLCJjbG9uZSIsIl91dWlkIiwiX2lzVHJpZ2dlciIsImlzVHJpZ2dlciIsIl9jZW50ZXIiLCJjb3B5IiwiY2VudGVyIiwic2hhcGUiLCJhdHRhY2hlZFJpZ2lkQm9keSIsInIiLCJfaXNPbkxvYWRDYWxsZWQiLCJlcnJvciIsIkNvbXBvbmVudCIsImpzIiwibWl4aW4iLCJwcm90b3R5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQUc0QkEsRUFBRSxDQUFDQztJQUF4QkMseUJBQUFBO0lBQVNDLDBCQUFBQTtBQUNoQixJQUFNQyxJQUFJLEdBQUdKLEVBQUUsQ0FBQ0ksSUFBaEI7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QTtBQUNBO0FBQ0E7Ozs7U0FDSSxlQUFvRDtBQUNoRCxhQUFPLEtBQUtHLEtBQUwsQ0FBV0MsaUJBQWxCO0FBQ0g7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O1NBQ0ksZUFBb0I7QUFDaEIsYUFBTyxLQUFLbkMsTUFBWjtBQUNILE1BRUQ7Ozs7U0FlQSxlQUF3QztBQUNwQyxVQUFNb0MsQ0FBQyxHQUFHLEtBQUtDLGVBQUwsSUFBd0IsQ0FBbEM7O0FBQ0EsVUFBSUQsQ0FBSixFQUFPO0FBQUU5QyxRQUFBQSxFQUFFLENBQUNnRCxLQUFILENBQVMsMkVBQVQ7QUFBd0Y7O0FBQ2pHLGFBQU8sQ0FBQ0YsQ0FBUjtBQUNIOzs7O0VBMUkyQjlDLEVBQUUsQ0FBQ2lEOzs7OztXQThIZTs7K0VBRTdDOUM7Ozs7O1dBQytCOzs0RUFFL0JBOzs7OztXQUNxQyxJQUFJQyxJQUFKOzs7O0FBc0kxQ0osRUFBRSxDQUFDa0QsRUFBSCxDQUFNQyxLQUFOLENBQVk5QyxVQUFVLENBQUMrQyxTQUF2QixFQUFrQ3BELEVBQUUsQ0FBQ1ksV0FBSCxDQUFld0MsU0FBakQiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IHsgQ29sbGlzaW9uQ2FsbGJhY2ssIENvbGxpc2lvbkV2ZW50VHlwZSwgVHJpZ2dlckNhbGxiYWNrLCBUcmlnZ2VyRXZlbnRUeXBlLCBJQ29sbGlzaW9uRXZlbnQgfSBmcm9tICcuLi8uLi9waHlzaWNzLWludGVyZmFjZSc7XG5pbXBvcnQgeyBSaWdpZEJvZHkzRCB9IGZyb20gJy4uL3JpZ2lkLWJvZHktY29tcG9uZW50JztcbmltcG9ydCB7IFBoeXNpY3NNYXRlcmlhbCB9IGZyb20gJy4uLy4uL2Fzc2V0cy9waHlzaWNzLW1hdGVyaWFsJztcbmltcG9ydCB7IElCYXNlU2hhcGUgfSBmcm9tICcuLi8uLi8uLi9zcGVjL2ktcGh5c2ljcy1zaGFwZSc7XG5cbmNvbnN0IHtjY2NsYXNzLCBwcm9wZXJ0eX0gPSBjYy5fZGVjb3JhdG9yO1xuY29uc3QgVmVjMyA9IGNjLlZlYzM7XG5cbi8qKlxuICogISNlblxuICogVGhlIGJhc2UgY2xhc3Mgb2YgdGhlIGNvbGxpZGVyLlxuICogISN6aFxuICog56Kw5pKe5Zmo55qE5Z+657G744CCXG4gKiBAY2xhc3MgQ29sbGlkZXIzRFxuICogQGV4dGVuZHMgQ29tcG9uZW50XG4gKiBAdXNlcyBFdmVudFRhcmdldFxuICovXG5AY2NjbGFzcygnY2MuQ29sbGlkZXIzRCcpXG5leHBvcnQgY2xhc3MgQ29sbGlkZXIzRCBleHRlbmRzIGNjLkNvbXBvbmVudCB7XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge1BoeXNpY3NNYXRlcmlhbH0gc2hhcmVkTWF0ZXJpYWxcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBQaHlzaWNzTWF0ZXJpYWwsXG4gICAgICAgIGRpc3BsYXlOYW1lOiAnTWF0ZXJpYWwnLFxuICAgICAgICBkaXNwbGF5T3JkZXI6IC0xXG4gICAgfSlcbiAgICBwdWJsaWMgZ2V0IHNoYXJlZE1hdGVyaWFsICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hdGVyaWFsO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgc2hhcmVkTWF0ZXJpYWwgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMubWF0ZXJpYWwgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG1hdGVyaWFsICgpIHtcbiAgICAgICAgaWYgKCFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc1NoYXJlZE1hdGVyaWFsICYmIHRoaXMuX21hdGVyaWFsICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXRlcmlhbC5vZmYoJ3BoeXNpY3NfbWF0ZXJpYWxfdXBkYXRlJywgdGhpcy5fdXBkYXRlTWF0ZXJpYWwsIHRoaXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsID0gdGhpcy5fbWF0ZXJpYWwuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXRlcmlhbC5vbigncGh5c2ljc19tYXRlcmlhbF91cGRhdGUnLCB0aGlzLl91cGRhdGVNYXRlcmlhbCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5faXNTaGFyZWRNYXRlcmlhbCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXRlcmlhbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IG1hdGVyaWFsICh2YWx1ZSkge1xuICAgICAgICBpZiAoQ0NfRURJVE9SIHx8IENDX1BIWVNJQ1NfQlVJTFRJTikgeyBcbiAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsID0gdmFsdWU7IFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHRoaXMuX21hdGVyaWFsICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9tYXRlcmlhbC5fdXVpZCAhPSB2YWx1ZS5fdXVpZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsLm9mZigncGh5c2ljc19tYXRlcmlhbF91cGRhdGUnLCB0aGlzLl91cGRhdGVNYXRlcmlhbCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgdmFsdWUub24oJ3BoeXNpY3NfbWF0ZXJpYWxfdXBkYXRlJywgdGhpcy5fdXBkYXRlTWF0ZXJpYWwsIHRoaXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2lzU2hhcmVkTWF0ZXJpYWwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXRlcmlhbCA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlICE9IG51bGwgJiYgdGhpcy5fbWF0ZXJpYWwgPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFsdWUub24oJ3BoeXNpY3NfbWF0ZXJpYWxfdXBkYXRlJywgdGhpcy5fdXBkYXRlTWF0ZXJpYWwsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWwgPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PSBudWxsICYmIHRoaXMuX21hdGVyaWFsICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsIS5vZmYoJ3BoeXNpY3NfbWF0ZXJpYWxfdXBkYXRlJywgdGhpcy5fdXBkYXRlTWF0ZXJpYWwsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWwgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl91cGRhdGVNYXRlcmlhbCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBnZXQgb3Igc2V0IHRoZSBjb2xsaWRlciBpcyB0cmlnZ2VyLCB0aGlzIHdpbGwgYmUgYWx3YXlzIHRyaWdnZXIgaWYgdXNpbmcgYnVpbHRpbi5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5oiW6K6+572u56Kw5pKe5Zmo5piv5ZCm5Li66Kem5Y+R5Zmo44CCXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBpc1RyaWdnZXJcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICBkaXNwbGF5T3JkZXI6IDBcbiAgICB9KVxuICAgIHB1YmxpYyBnZXQgaXNUcmlnZ2VyICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVHJpZ2dlcjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGlzVHJpZ2dlciAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5faXNUcmlnZ2VyID0gdmFsdWU7XG4gICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB0aGlzLl9zaGFwZS5pc1RyaWdnZXIgPSB0aGlzLl9pc1RyaWdnZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogZ2V0IG9yIHNldCB0aGUgY2VudGVyIG9mIHRoZSBjb2xsaWRlciwgaW4gbG9jYWwgc3BhY2UuXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluaIluiuvue9rueisOaSnuWZqOeahOS4reW/g+eCueOAglxuICAgICAqIEBwcm9wZXJ0eSB7VmVjM30gY2VudGVyXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogY2MuVmVjMyxcbiAgICAgICAgZGlzcGxheU9yZGVyOiAxXG4gICAgfSlcbiAgICBwdWJsaWMgZ2V0IGNlbnRlciAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jZW50ZXI7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBjZW50ZXIgKHZhbHVlOiBjYy5WZWMzKSB7XG4gICAgICAgIFZlYzMuY29weSh0aGlzLl9jZW50ZXIsIHZhbHVlKTtcbiAgICAgICAgaWYgKCFDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRoaXMuX3NoYXBlLmNlbnRlciA9IHRoaXMuX2NlbnRlcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBnZXQgdGhlIGNvbGxpZGVyIGF0dGFjaGVkIHJpZ2lkYm9keSwgdGhpcyBtYXkgYmUgbnVsbC5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W56Kw5pKe5Zmo5omA57uR5a6a55qE5Yia5L2T57uE5Lu277yM5Y+v6IO95Li6IG51bGzjgIJcbiAgICAgKiBAcHJvcGVydHkge1JpZ2lkQm9keTNEfG51bGx9IGF0dGFjaGVkUmlnaWRib2R5XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgcHVibGljIGdldCBhdHRhY2hlZFJpZ2lkYm9keSAoKTogUmlnaWRCb2R5M0QgfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2hhcGUuYXR0YWNoZWRSaWdpZEJvZHk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIGdldCBjb2xsaWRlciBzaGFwZS5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W56Kw5pKe5Zmo5b2i54q244CCXG4gICAgICogQHByb3BlcnR5IHtJQmFzZVNoYXBlfSBzaGFwZVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgc2hhcGUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcGU7XG4gICAgfVxuXG4gICAgLy8vIFBSSVZBVEUgUFJPUEVSVFkgLy8vXG5cbiAgICBwcm90ZWN0ZWQgX3NoYXBlITogSUJhc2VTaGFwZTtcblxuICAgIHByb3RlY3RlZCBfaXNTaGFyZWRNYXRlcmlhbDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBAcHJvcGVydHkoeyB0eXBlOiBQaHlzaWNzTWF0ZXJpYWwgfSlcbiAgICBwcm90ZWN0ZWQgX21hdGVyaWFsOiBQaHlzaWNzTWF0ZXJpYWwgfCBudWxsID0gbnVsbDtcblxuICAgIEBwcm9wZXJ0eVxuICAgIHByb3RlY3RlZCBfaXNUcmlnZ2VyOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBAcHJvcGVydHlcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgX2NlbnRlcjogY2MuVmVjMyA9IG5ldyBWZWMzKCk7XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IF9hc3NlcnRPbmxvYWQgKCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCByID0gdGhpcy5faXNPbkxvYWRDYWxsZWQgPT0gMDtcbiAgICAgICAgaWYgKHIpIHsgY2MuZXJyb3IoJ1BoeXNpY3MgRXJyb3I6IFBsZWFzZSBtYWtlIHN1cmUgdGhhdCB0aGUgbm9kZSBoYXMgYmVlbiBhZGRlZCB0byB0aGUgc2NlbmUnKTsgfVxuICAgICAgICByZXR1cm4gIXI7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yICgpIHsgXG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgY2MuRXZlbnRUYXJnZXQuY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICAvLy8gRVZFTlQgSU5URVJGQUNFIC8vL1xuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJlZ2lzdGVyIGFuIGNhbGxiYWNrIG9mIGEgc3BlY2lmaWMgZXZlbnQgdHlwZSBvbiB0aGUgRXZlbnRUYXJnZXQuXG4gICAgICogVGhpcyB0eXBlIG9mIGV2ZW50IHNob3VsZCBiZSB0cmlnZ2VyZWQgdmlhIGBlbWl0YC5cbiAgICAgKiAhI3poXG4gICAgICog5rOo5YaM5LqL5Lu255uu5qCH55qE54m55a6a5LqL5Lu257G75Z6L5Zue6LCD44CC6L+Z56eN57G75Z6L55qE5LqL5Lu25bqU6K+l6KKrIGBlbWl0YCDop6blj5HjgIJcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIG9mIGNvbGxpZGVyIGV2ZW50IGNhbiBiZSBgdHJpZ2dlci1lbnRlcmAsIGB0cmlnZ2VyLXN0YXlgLCBgdHJpZ2dlci1leGl0YCBvciBgY29sbGlzaW9uLWVudGVyYCwgYGNvbGxpc2lvbi1zdGF5YCwgYGNvbGxpc2lvbi1leGl0YC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgaW52b2tlZCB3aGVuIHRoZSBldmVudCBpcyBkaXNwYXRjaGVkLlxuICAgICAqIFRoZSBjYWxsYmFjayBpcyBpZ25vcmVkIGlmIGl0IGlzIGEgZHVwbGljYXRlICh0aGUgY2FsbGJhY2tzIGFyZSB1bmlxdWUpLlxuICAgICAqIEBwYXJhbSB7SVRyaWdnZXJFdmVudHxJQ29sbGlzaW9uRXZlbnR9IGNhbGxiYWNrLmV2ZW50IENhbGxiYWNrIGZ1bmN0aW9uIGFyZ3VtZW50XG4gICAgICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXRdIC0gVGhlIHRhcmdldCAodGhpcyBvYmplY3QpIHRvIGludm9rZSB0aGUgY2FsbGJhY2ssIGNhbiBiZSBudWxsLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSAtIEp1c3QgcmV0dXJucyB0aGUgaW5jb21pbmcgY2FsbGJhY2sgc28geW91IGNhbiBzYXZlIHRoZSBhbm9ueW1vdXMgZnVuY3Rpb24gZWFzaWVyLlxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogb248VCBleHRlbmRzIEZ1bmN0aW9uPih0eXBlOiBzdHJpbmcsIGNhbGxiYWNrOiBULCB0YXJnZXQ/OiBhbnksIHVzZUNhcHR1cmU/OiBib29sZWFuKTogVFxuICAgICAqIEBleGFtcGxlXG4gICAgICogZXZlbnRUYXJnZXQub24oJ2ZpcmUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgKiAgICAgLy8gZXZlbnQgaXMgSVRyaWdnZXJFdmVudCBvciBJQ29sbGlzaW9uRXZlbnRcbiAgICAgKiB9LCBub2RlKTtcbiAgICAgKi9cbiAgICBwdWJsaWMgb24gKHR5cGU6IFRyaWdnZXJFdmVudFR5cGUgfCBDb2xsaXNpb25FdmVudFR5cGUsIGNhbGxiYWNrOiBUcmlnZ2VyQ2FsbGJhY2sgfCBDb2xsaXNpb25DYWxsYmFjaywgdGFyZ2V0PzogT2JqZWN0LCB1c2VDYXB0dXJlPzogYW55KTogYW55IHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmVtb3ZlcyB0aGUgbGlzdGVuZXJzIHByZXZpb3VzbHkgcmVnaXN0ZXJlZCB3aXRoIHRoZSBzYW1lIHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQgYW5kIG9yIHVzZUNhcHR1cmUsXG4gICAgICogaWYgb25seSB0eXBlIGlzIHBhc3NlZCBhcyBwYXJhbWV0ZXIsIGFsbCBsaXN0ZW5lcnMgcmVnaXN0ZXJlZCB3aXRoIHRoYXQgdHlwZSB3aWxsIGJlIHJlbW92ZWQuXG4gICAgICogISN6aFxuICAgICAqIOWIoOmZpOS5i+WJjeeUqOWQjOexu+Wei++8jOWbnuiwg++8jOebruagh+aIliB1c2VDYXB0dXJlIOazqOWGjOeahOS6i+S7tuebkeWQrOWZqO+8jOWmguaenOWPquS8oOmAkiB0eXBl77yM5bCG5Lya5Yig6ZmkIHR5cGUg57G75Z6L55qE5omA5pyJ5LqL5Lu255uR5ZCs5Zmo44CCXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIG9mZlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gVGhlIHR5cGUgb2YgY29sbGlkZXIgZXZlbnQgY2FuIGJlIGB0cmlnZ2VyLWVudGVyYCwgYHRyaWdnZXItc3RheWAsIGB0cmlnZ2VyLWV4aXRgIG9yIGBjb2xsaXNpb24tZW50ZXJgLCBgY29sbGlzaW9uLXN0YXlgLCBgY29sbGlzaW9uLWV4aXRgLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gLSBUaGUgY2FsbGJhY2sgdG8gcmVtb3ZlLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbdGFyZ2V0XSAtIFRoZSB0YXJnZXQgKHRoaXMgb2JqZWN0KSB0byBpbnZva2UgdGhlIGNhbGxiYWNrLCBpZiBpdCdzIG5vdCBnaXZlbiwgb25seSBjYWxsYmFjayB3aXRob3V0IHRhcmdldCB3aWxsIGJlIHJlbW92ZWQuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyByZWdpc3RlciBmaXJlIGV2ZW50TGlzdGVuZXJcbiAgICAgKiB2YXIgY2FsbGJhY2sgPSBldmVudFRhcmdldC5vbignZmlyZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgKiAgICAgY2MubG9nKFwiZmlyZSBpbiB0aGUgaG9sZVwiKTtcbiAgICAgKiB9LCB0YXJnZXQpO1xuICAgICAqIC8vIHJlbW92ZSBmaXJlIGV2ZW50IGxpc3RlbmVyXG4gICAgICogZXZlbnRUYXJnZXQub2ZmKCdmaXJlJywgY2FsbGJhY2ssIHRhcmdldCk7XG4gICAgICogLy8gcmVtb3ZlIGFsbCBmaXJlIGV2ZW50IGxpc3RlbmVyc1xuICAgICAqIGV2ZW50VGFyZ2V0Lm9mZignZmlyZScpO1xuICAgICAqL1xuICAgIHB1YmxpYyBvZmYgKHR5cGU6IFRyaWdnZXJFdmVudFR5cGUgfCBDb2xsaXNpb25FdmVudFR5cGUsIGNhbGxiYWNrOiBUcmlnZ2VyQ2FsbGJhY2sgfCBDb2xsaXNpb25DYWxsYmFjaywgdGFyZ2V0PzogYW55KSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJlZ2lzdGVyIGFuIGNhbGxiYWNrIG9mIGEgc3BlY2lmaWMgZXZlbnQgdHlwZSBvbiB0aGUgRXZlbnRUYXJnZXQsXG4gICAgICogdGhlIGNhbGxiYWNrIHdpbGwgcmVtb3ZlIGl0c2VsZiBhZnRlciB0aGUgZmlyc3QgdGltZSBpdCBpcyB0cmlnZ2VyZWQuXG4gICAgICogISN6aFxuICAgICAqIOazqOWGjOS6i+S7tuebruagh+eahOeJueWumuS6i+S7tuexu+Wei+Wbnuiwg++8jOWbnuiwg+S8muWcqOesrOS4gOaXtumXtOiiq+inpuWPkeWQjuWIoOmZpOiHqui6q+OAglxuICAgICAqXG4gICAgICogQG1ldGhvZCBvbmNlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBUaGUgdHlwZSBvZiBjb2xsaWRlciBldmVudCBjYW4gYmUgYHRyaWdnZXItZW50ZXJgLCBgdHJpZ2dlci1zdGF5YCwgYHRyaWdnZXItZXhpdGAgb3IgYGNvbGxpc2lvbi1lbnRlcmAsIGBjb2xsaXNpb24tc3RheWAsIGBjb2xsaXNpb24tZXhpdGAuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnQgaXMgZGlzcGF0Y2hlZC5cbiAgICAgKiBUaGUgY2FsbGJhY2sgaXMgaWdub3JlZCBpZiBpdCBpcyBhIGR1cGxpY2F0ZSAodGhlIGNhbGxiYWNrcyBhcmUgdW5pcXVlKS5cbiAgICAgKiBAcGFyYW0ge0lUcmlnZ2VyRXZlbnR8SUNvbGxpc2lvbkV2ZW50fSBjYWxsYmFjay5ldmVudCBjYWxsYmFjayBmdW5jdGlvbiBhcmd1bWVudC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW3RhcmdldF0gLSBUaGUgdGFyZ2V0ICh0aGlzIG9iamVjdCkgdG8gaW52b2tlIHRoZSBjYWxsYmFjaywgY2FuIGJlIG51bGwuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBldmVudFRhcmdldC5vbmNlKCdmaXJlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICogICAgIC8vIGV2ZW50IGlzIElUcmlnZ2VyRXZlbnQgb3IgSUNvbGxpc2lvbkV2ZW50XG4gICAgICogfSwgbm9kZSk7XG4gICAgICovXG4gICAgcHVibGljIG9uY2UgKHR5cGU6IFRyaWdnZXJFdmVudFR5cGUgfCBDb2xsaXNpb25FdmVudFR5cGUsIGNhbGxiYWNrOiBUcmlnZ2VyQ2FsbGJhY2sgfCBDb2xsaXNpb25DYWxsYmFjaywgdGFyZ2V0PzogT2JqZWN0KSB7XG4gICAgfVxuXG4gICAgLyogZGVjbGFyZSBmb3IgdHlwZXNjcmlwdCB0aXAgKi9cbiAgICBwdWJsaWMgZW1pdCAoa2V5OiBUcmlnZ2VyRXZlbnRUeXBlIHwgQ29sbGlzaW9uRXZlbnRUeXBlLCAuLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xuICAgIH1cblxuICAgIC8vLyBDT01QT05FTlQgTElGRUNZQ0xFIC8vL1xuXG4gICAgcHJvdGVjdGVkIF9fcHJlbG9hZCAoKSB7XG4gICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB0aGlzLl9zaGFwZS5fX3ByZWxvYWQhKHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uTG9hZCAoKSB7XG4gICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICBpZiAoIUNDX1BIWVNJQ1NfQlVJTFRJTikge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hhcmVkTWF0ZXJpYWwgPSB0aGlzLl9tYXRlcmlhbCA9PSBudWxsID8gY2MuZGlyZWN0b3IuZ2V0UGh5c2ljczNETWFuYWdlcigpLmRlZmF1bHRNYXRlcmlhbCA6IHRoaXMuX21hdGVyaWFsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fc2hhcGUub25Mb2FkISgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uRW5hYmxlICgpIHtcbiAgICAgICAgaWYgKCFDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRoaXMuX3NoYXBlLm9uRW5hYmxlISgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uRGlzYWJsZSAoKSB7XG4gICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB0aGlzLl9zaGFwZS5vbkRpc2FibGUhKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb25EZXN0cm95ICgpIHtcbiAgICAgICAgaWYgKCFDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9tYXRlcmlhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsLm9mZigncGh5c2ljc19tYXRlcmlhbF91cGRhdGUnLCB0aGlzLl91cGRhdGVNYXRlcmlhbCwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9zaGFwZS5vbkRlc3Ryb3khKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF91cGRhdGVNYXRlcmlhbCAoKSB7XG4gICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB0aGlzLl9zaGFwZS5tYXRlcmlhbCA9IHRoaXMuX21hdGVyaWFsO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cbmNjLmpzLm1peGluKENvbGxpZGVyM0QucHJvdG90eXBlLCBjYy5FdmVudFRhcmdldC5wcm90b3R5cGUpOyJdLCJzb3VyY2VSb290IjoiLyJ9