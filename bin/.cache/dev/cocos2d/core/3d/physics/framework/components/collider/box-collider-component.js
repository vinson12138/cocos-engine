
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/framework/components/collider/box-collider-component.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.BoxCollider3D = void 0;

var _instance = require("../../instance");

var _colliderComponent = require("./collider-component");

var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _temp;

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
    executeInEditMode = _cc$_decorator.executeInEditMode,
    executionOrder = _cc$_decorator.executionOrder,
    menu = _cc$_decorator.menu,
    property = _cc$_decorator.property;
var Vec3 = cc.Vec3;
/**
 * !#en
 * Physics box collider
 * !#zh
 * 物理盒子碰撞器
 * @class BoxCollider3D
 * @extends Collider3D
 */

var BoxCollider3D = (_dec = ccclass('cc.BoxCollider3D'), _dec2 = executionOrder(98), _dec3 = menu('i18n:MAIN_MENU.component.physics/Collider/Box 3D'), _dec4 = property({
  type: cc.Vec3
}), _dec(_class = _dec2(_class = _dec3(_class = executeInEditMode(_class = (_class2 = (_temp = /*#__PURE__*/function (_Collider3D) {
  _inheritsLoose(BoxCollider3D, _Collider3D);

  function BoxCollider3D() {
    var _this;

    _this = _Collider3D.call(this) || this;

    _initializerDefineProperty(_this, "_size", _descriptor, _assertThisInitialized(_this));

    if (!CC_EDITOR) {
      _this._shape = (0, _instance.createBoxShape)(_this._size);
    }

    return _this;
  }

  _createClass(BoxCollider3D, [{
    key: "size",
    get: /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * !#en
     * Get or set the size of the box, in local space.
     * !#zh
     * 获取或设置盒的大小。
     * @property {Vec3} size
     */
    function get() {
      return this._size;
    },
    set: function set(value) {
      Vec3.copy(this._size, value);

      if (!CC_EDITOR) {
        this.boxShape.size = this._size;
      }
    }
    /**
     * @property {IBoxShape} boxShape
     * @readonly
     */

  }, {
    key: "boxShape",
    get: function get() {
      return this._shape;
    } /// PRIVATE PROPERTY ///

  }]);

  return BoxCollider3D;
}(_colliderComponent.Collider3D), _temp), (_applyDecoratedDescriptor(_class2.prototype, "size", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "size"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_size", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Vec3(1, 1, 1);
  }
})), _class2)) || _class) || _class) || _class) || _class);
exports.BoxCollider3D = BoxCollider3D;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BoeXNpY3MvZnJhbWV3b3JrL2NvbXBvbmVudHMvY29sbGlkZXIvYm94LWNvbGxpZGVyLWNvbXBvbmVudC50cyJdLCJuYW1lcyI6WyJjYyIsIl9kZWNvcmF0b3IiLCJjY2NsYXNzIiwiZXhlY3V0ZUluRWRpdE1vZGUiLCJleGVjdXRpb25PcmRlciIsIm1lbnUiLCJwcm9wZXJ0eSIsIlZlYzMiLCJCb3hDb2xsaWRlcjNEIiwidHlwZSIsIkNDX0VESVRPUiIsIl9zaGFwZSIsIl9zaXplIiwidmFsdWUiLCJjb3B5IiwiYm94U2hhcGUiLCJzaXplIiwiQ29sbGlkZXIzRCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBU0lBLEVBQUUsQ0FBQ0M7SUFMSEMseUJBQUFBO0lBQ0FDLG1DQUFBQTtJQUNBQyxnQ0FBQUE7SUFDQUMsc0JBQUFBO0lBQ0FDLDBCQUFBQTtBQUdKLElBQU1DLElBQUksR0FBR1AsRUFBRSxDQUFDTyxJQUFoQjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0lBS2FDLHdCQUpaTixPQUFPLENBQUMsa0JBQUQsV0FDUEUsY0FBYyxDQUFDLEVBQUQsV0FDZEMsSUFBSSxDQUFDLGtEQUFELFdBYUFDLFFBQVEsQ0FBQztBQUNORyxFQUFBQSxJQUFJLEVBQUVULEVBQUUsQ0FBQ087QUFESCxDQUFELCtDQVpaSjs7O0FBdUNHLDJCQUFlO0FBQUE7O0FBQ1g7O0FBRFc7O0FBRVgsUUFBSSxDQUFDTyxTQUFMLEVBQWdCO0FBQ1osWUFBS0MsTUFBTCxHQUFjLDhCQUFlLE1BQUtDLEtBQXBCLENBQWQ7QUFDSDs7QUFKVTtBQUtkOzs7O1NBekNEOztBQUVBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0ksbUJBR21CO0FBQ2YsYUFBTyxLQUFLQSxLQUFaO0FBQ0g7U0FFRCxhQUFpQkMsS0FBakIsRUFBd0I7QUFDcEJOLE1BQUFBLElBQUksQ0FBQ08sSUFBTCxDQUFVLEtBQUtGLEtBQWYsRUFBc0JDLEtBQXRCOztBQUNBLFVBQUksQ0FBQ0gsU0FBTCxFQUFnQjtBQUNaLGFBQUtLLFFBQUwsQ0FBY0MsSUFBZCxHQUFxQixLQUFLSixLQUExQjtBQUNIO0FBQ0o7QUFFRDtBQUNKO0FBQ0E7QUFDQTs7OztTQUNJLGVBQWtDO0FBQzlCLGFBQU8sS0FBS0QsTUFBWjtBQUNILE1BRUQ7Ozs7O0VBakMrQk0sNFBBbUM5Qlg7Ozs7O1dBQ3dCLElBQUlDLElBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IHsgY3JlYXRlQm94U2hhcGUgfSBmcm9tICcuLi8uLi9pbnN0YW5jZSc7XG5pbXBvcnQgeyBDb2xsaWRlcjNEIH0gZnJvbSAnLi9jb2xsaWRlci1jb21wb25lbnQnO1xuaW1wb3J0IHsgSUJveFNoYXBlIH0gZnJvbSAnLi4vLi4vLi4vc3BlYy9pLXBoeXNpY3Mtc2hhcGUnO1xuXG5jb25zdCB7XG4gICAgY2NjbGFzcyxcbiAgICBleGVjdXRlSW5FZGl0TW9kZSxcbiAgICBleGVjdXRpb25PcmRlcixcbiAgICBtZW51LFxuICAgIHByb3BlcnR5LFxufSA9IGNjLl9kZWNvcmF0b3I7XG5cbmNvbnN0IFZlYzMgPSBjYy5WZWMzO1xuXG4vKipcbiAqICEjZW5cbiAqIFBoeXNpY3MgYm94IGNvbGxpZGVyXG4gKiAhI3poXG4gKiDniannkIbnm5LlrZDnorDmkp7lmahcbiAqIEBjbGFzcyBCb3hDb2xsaWRlcjNEXG4gKiBAZXh0ZW5kcyBDb2xsaWRlcjNEXG4gKi9cbkBjY2NsYXNzKCdjYy5Cb3hDb2xsaWRlcjNEJylcbkBleGVjdXRpb25PcmRlcig5OClcbkBtZW51KCdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQucGh5c2ljcy9Db2xsaWRlci9Cb3ggM0QnKVxuQGV4ZWN1dGVJbkVkaXRNb2RlXG5leHBvcnQgY2xhc3MgQm94Q29sbGlkZXIzRCBleHRlbmRzIENvbGxpZGVyM0Qge1xuXG4gICAgLy8vIFBVQkxJQyBQUk9QRVJUWSBHRVRURVJcXFNFVFRFUiAvLy9cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgb3Igc2V0IHRoZSBzaXplIG9mIHRoZSBib3gsIGluIGxvY2FsIHNwYWNlLlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bmiJborr7nva7nm5LnmoTlpKflsI/jgIJcbiAgICAgKiBAcHJvcGVydHkge1ZlYzN9IHNpemVcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBjYy5WZWMzXG4gICAgfSlcbiAgICBwdWJsaWMgZ2V0IHNpemUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2l6ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHNpemUgKHZhbHVlKSB7XG4gICAgICAgIFZlYzMuY29weSh0aGlzLl9zaXplLCB2YWx1ZSk7XG4gICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB0aGlzLmJveFNoYXBlLnNpemUgPSB0aGlzLl9zaXplO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtJQm94U2hhcGV9IGJveFNoYXBlXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgcHVibGljIGdldCBib3hTaGFwZSAoKTogSUJveFNoYXBlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXBlIGFzIElCb3hTaGFwZTtcbiAgICB9XG5cbiAgICAvLy8gUFJJVkFURSBQUk9QRVJUWSAvLy9cblxuICAgIEBwcm9wZXJ0eVxuICAgIHByaXZhdGUgX3NpemU6IGNjLlZlYzMgPSBuZXcgVmVjMygxLCAxLCAxKTtcblxuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgaWYgKCFDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRoaXMuX3NoYXBlID0gY3JlYXRlQm94U2hhcGUodGhpcy5fc2l6ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiJdLCJzb3VyY2VSb290IjoiLyJ9