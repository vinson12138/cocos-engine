
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/material/material-variant.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _CCMaterial = _interopRequireDefault(require("./CCMaterial"));

var _effectVariant = _interopRequireDefault(require("./effect-variant"));

var _materialPool = _interopRequireDefault(require("./material-pool"));

var _dec, _class, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ccclass = cc._decorator.ccclass;
/**
 * !#en
 * Material Variant is an extension of the Material Asset.
 * Changes to Material Variant do not affect other Material Variant or Material Asset,
 * and changes to Material Asset are synchronized to the Material Variant.
 * However, when a Material Variant had already modifies a state, the Material Asset state is not synchronized to the Material Variant.
 * !#zh
 * 材质变体是材质资源的一个延伸。
 * 材质变体的修改不会影响到其他的材质变体或者材质资源，而材质资源的修改会同步体现到材质变体上，
 * 但是当材质变体对一个状态修改后，材质资源再对这个状态修改是不会同步到材质变体上的。
 * @class MaterialVariant
 * @extends Material
 */

var MaterialVariant = (_dec = ccclass('cc.MaterialVariant'), _dec(_class = (_temp = /*#__PURE__*/function (_Material) {
  _inheritsLoose(MaterialVariant, _Material);

  /**
   * @method createWithBuiltin
   * @param {Material.BUILTIN_NAME} materialName
   * @param {RenderComponent} [owner]
   * @typescript
   * static createWithBuiltin (materialName: string, owner: cc.RenderComponent): MaterialVariant | null
   */
  MaterialVariant.createWithBuiltin = function createWithBuiltin(materialName, owner) {
    return MaterialVariant.create(_CCMaterial["default"].getBuiltinMaterial(materialName), owner);
  }
  /**
   * @method create
   * @param {Material} material
   * @param {RenderComponent} [owner]
   * @typescript
   * static create (material: Material, owner: cc.RenderComponent): MaterialVariant | null
   */
  ;

  MaterialVariant.create = function create(material, owner) {
    if (!material) return null;
    return _materialPool["default"].get(material, owner);
  };

  function MaterialVariant(material) {
    var _this;

    _this = _Material.call(this) || this;
    _this._owner = null;
    _this._material = null;

    _this.init(material);

    return _this;
  }

  var _proto = MaterialVariant.prototype;

  _proto.init = function init(material) {
    this._effect = new _effectVariant["default"](material.effect);
    this._effectAsset = material._effectAsset;
    this._material = material;
  };

  _createClass(MaterialVariant, [{
    key: "uuid",
    get: function get() {
      return this._material._uuid;
    }
  }, {
    key: "owner",
    get: function get() {
      return this._owner;
    }
  }, {
    key: "material",
    get: function get() {
      return this._material;
    }
  }]);

  return MaterialVariant;
}(_CCMaterial["default"]), _temp)) || _class);
exports["default"] = MaterialVariant;
cc.MaterialVariant = MaterialVariant;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0cy9tYXRlcmlhbC9tYXRlcmlhbC12YXJpYW50LnRzIl0sIm5hbWVzIjpbImNjY2xhc3MiLCJjYyIsIl9kZWNvcmF0b3IiLCJNYXRlcmlhbFZhcmlhbnQiLCJjcmVhdGVXaXRoQnVpbHRpbiIsIm1hdGVyaWFsTmFtZSIsIm93bmVyIiwiY3JlYXRlIiwiTWF0ZXJpYWwiLCJnZXRCdWlsdGluTWF0ZXJpYWwiLCJtYXRlcmlhbCIsIk1hdGVyaWFsUG9vbCIsImdldCIsIl9vd25lciIsIl9tYXRlcmlhbCIsImluaXQiLCJfZWZmZWN0IiwiRWZmZWN0VmFyaWFudCIsImVmZmVjdCIsIl9lZmZlY3RBc3NldCIsIl91dWlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0lBRU1BLFVBQWFDLEVBQUUsQ0FBQ0MsV0FBaEJGO0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0lBRXFCRywwQkFEcEJILE9BQU8sQ0FBQyxvQkFBRDs7O0FBS0o7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7a0JBQ1dJLG9CQUFQLDJCQUEwQkMsWUFBMUIsRUFBZ0RDLEtBQWhELEVBQW1HO0FBQy9GLFdBQU9ILGVBQWUsQ0FBQ0ksTUFBaEIsQ0FBdUJDLHVCQUFTQyxrQkFBVCxDQUE0QkosWUFBNUIsQ0FBdkIsRUFBa0VDLEtBQWxFLENBQVA7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7a0JBQ1dDLFNBQVAsZ0JBQWVHLFFBQWYsRUFBbUNKLEtBQW5DLEVBQXNGO0FBQ2xGLFFBQUksQ0FBQ0ksUUFBTCxFQUFlLE9BQU8sSUFBUDtBQUNmLFdBQU9DLHlCQUFhQyxHQUFiLENBQWlCRixRQUFqQixFQUEyQkosS0FBM0IsQ0FBUDtBQUNIOztBQWNELDJCQUFhSSxRQUFiLEVBQWlDO0FBQUE7O0FBQzdCO0FBRDZCLFVBdENqQ0csTUFzQ2lDLEdBdENKLElBc0NJO0FBQUEsVUFyQ2pDQyxTQXFDaUMsR0FyQ1gsSUFxQ1c7O0FBRTdCLFVBQUtDLElBQUwsQ0FBVUwsUUFBVjs7QUFGNkI7QUFHaEM7Ozs7U0FFREssT0FBQSxjQUFNTCxRQUFOLEVBQWdCO0FBQ1osU0FBS00sT0FBTCxHQUFlLElBQUlDLHlCQUFKLENBQWtCUCxRQUFRLENBQUNRLE1BQTNCLENBQWY7QUFDQSxTQUFLQyxZQUFMLEdBQW9CVCxRQUFRLENBQUNTLFlBQTdCO0FBQ0EsU0FBS0wsU0FBTCxHQUFpQkosUUFBakI7QUFDSDs7OztTQXJCRCxlQUFZO0FBQ1IsYUFBTyxLQUFLSSxTQUFMLENBQWVNLEtBQXRCO0FBQ0g7OztTQUVELGVBQWE7QUFDVCxhQUFPLEtBQUtQLE1BQVo7QUFDSDs7O1NBRUQsZUFBZ0I7QUFDWixhQUFPLEtBQUtDLFNBQVo7QUFDSDs7OztFQXJDd0NOOztBQW1EN0NQLEVBQUUsQ0FBQ0UsZUFBSCxHQUFxQkEsZUFBckIiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBNYXRlcmlhbCBmcm9tICcuL0NDTWF0ZXJpYWwnO1xuaW1wb3J0IEVmZmVjdFZhcmlhbnQgZnJvbSAnLi9lZmZlY3QtdmFyaWFudCc7XG5pbXBvcnQgTWF0ZXJpYWxQb29sIGZyb20gJy4vbWF0ZXJpYWwtcG9vbCc7XG5cbmxldCB7IGNjY2xhc3MsIH0gPSBjYy5fZGVjb3JhdG9yO1xuXG4vKipcbiAqICEjZW5cbiAqIE1hdGVyaWFsIFZhcmlhbnQgaXMgYW4gZXh0ZW5zaW9uIG9mIHRoZSBNYXRlcmlhbCBBc3NldC5cbiAqIENoYW5nZXMgdG8gTWF0ZXJpYWwgVmFyaWFudCBkbyBub3QgYWZmZWN0IG90aGVyIE1hdGVyaWFsIFZhcmlhbnQgb3IgTWF0ZXJpYWwgQXNzZXQsXG4gKiBhbmQgY2hhbmdlcyB0byBNYXRlcmlhbCBBc3NldCBhcmUgc3luY2hyb25pemVkIHRvIHRoZSBNYXRlcmlhbCBWYXJpYW50LlxuICogSG93ZXZlciwgd2hlbiBhIE1hdGVyaWFsIFZhcmlhbnQgaGFkIGFscmVhZHkgbW9kaWZpZXMgYSBzdGF0ZSwgdGhlIE1hdGVyaWFsIEFzc2V0IHN0YXRlIGlzIG5vdCBzeW5jaHJvbml6ZWQgdG8gdGhlIE1hdGVyaWFsIFZhcmlhbnQuXG4gKiAhI3poXG4gKiDmnZDotKjlj5jkvZPmmK/mnZDotKjotYTmupDnmoTkuIDkuKrlu7bkvLjjgIJcbiAqIOadkOi0qOWPmOS9k+eahOS/ruaUueS4jeS8muW9seWTjeWIsOWFtuS7lueahOadkOi0qOWPmOS9k+aIluiAheadkOi0qOi1hOa6kO+8jOiAjOadkOi0qOi1hOa6kOeahOS/ruaUueS8muWQjOatpeS9k+eOsOWIsOadkOi0qOWPmOS9k+S4iu+8jFxuICog5L2G5piv5b2T5p2Q6LSo5Y+Y5L2T5a+55LiA5Liq54q25oCB5L+u5pS55ZCO77yM5p2Q6LSo6LWE5rqQ5YaN5a+56L+Z5Liq54q25oCB5L+u5pS55piv5LiN5Lya5ZCM5q2l5Yiw5p2Q6LSo5Y+Y5L2T5LiK55qE44CCXG4gKiBAY2xhc3MgTWF0ZXJpYWxWYXJpYW50XG4gKiBAZXh0ZW5kcyBNYXRlcmlhbFxuICovXG5AY2NjbGFzcygnY2MuTWF0ZXJpYWxWYXJpYW50JylcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdGVyaWFsVmFyaWFudCBleHRlbmRzIE1hdGVyaWFsIHtcbiAgICBfb3duZXI6IGNjLlJlbmRlckNvbXBvbmVudCA9IG51bGw7XG4gICAgX21hdGVyaWFsOiBNYXRlcmlhbCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGNyZWF0ZVdpdGhCdWlsdGluXG4gICAgICogQHBhcmFtIHtNYXRlcmlhbC5CVUlMVElOX05BTUV9IG1hdGVyaWFsTmFtZVxuICAgICAqIEBwYXJhbSB7UmVuZGVyQ29tcG9uZW50fSBbb3duZXJdXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgY3JlYXRlV2l0aEJ1aWx0aW4gKG1hdGVyaWFsTmFtZTogc3RyaW5nLCBvd25lcjogY2MuUmVuZGVyQ29tcG9uZW50KTogTWF0ZXJpYWxWYXJpYW50IHwgbnVsbFxuICAgICAqL1xuICAgIHN0YXRpYyBjcmVhdGVXaXRoQnVpbHRpbiAobWF0ZXJpYWxOYW1lOiBzdHJpbmcsIG93bmVyOiBjYy5SZW5kZXJDb21wb25lbnQpOiBNYXRlcmlhbFZhcmlhbnQgfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIE1hdGVyaWFsVmFyaWFudC5jcmVhdGUoTWF0ZXJpYWwuZ2V0QnVpbHRpbk1hdGVyaWFsKG1hdGVyaWFsTmFtZSksIG93bmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGNyZWF0ZVxuICAgICAqIEBwYXJhbSB7TWF0ZXJpYWx9IG1hdGVyaWFsXG4gICAgICogQHBhcmFtIHtSZW5kZXJDb21wb25lbnR9IFtvd25lcl1cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBjcmVhdGUgKG1hdGVyaWFsOiBNYXRlcmlhbCwgb3duZXI6IGNjLlJlbmRlckNvbXBvbmVudCk6IE1hdGVyaWFsVmFyaWFudCB8IG51bGxcbiAgICAgKi9cbiAgICBzdGF0aWMgY3JlYXRlIChtYXRlcmlhbDogTWF0ZXJpYWwsIG93bmVyOiBjYy5SZW5kZXJDb21wb25lbnQpOiBNYXRlcmlhbFZhcmlhbnQgfCBudWxsIHtcbiAgICAgICAgaWYgKCFtYXRlcmlhbCkgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiBNYXRlcmlhbFBvb2wuZ2V0KG1hdGVyaWFsLCBvd25lcik7XG4gICAgfVxuXG4gICAgZ2V0IHV1aWQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWF0ZXJpYWwuX3V1aWQ7XG4gICAgfVxuXG4gICAgZ2V0IG93bmVyICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX293bmVyO1xuICAgIH1cblxuICAgIGdldCBtYXRlcmlhbCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXRlcmlhbDtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvciAobWF0ZXJpYWw6IE1hdGVyaWFsKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuaW5pdChtYXRlcmlhbCk7XG4gICAgfVxuXG4gICAgaW5pdCAobWF0ZXJpYWwpIHtcbiAgICAgICAgdGhpcy5fZWZmZWN0ID0gbmV3IEVmZmVjdFZhcmlhbnQobWF0ZXJpYWwuZWZmZWN0KTtcbiAgICAgICAgdGhpcy5fZWZmZWN0QXNzZXQgPSBtYXRlcmlhbC5fZWZmZWN0QXNzZXQ7XG4gICAgICAgIHRoaXMuX21hdGVyaWFsID0gbWF0ZXJpYWw7XG4gICAgfVxufVxuXG5jYy5NYXRlcmlhbFZhcmlhbnQgPSBNYXRlcmlhbFZhcmlhbnQ7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==