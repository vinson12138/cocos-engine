
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/CCLightComponent.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _enums = _interopRequireDefault(require("../../renderer/enums"));

var _color = _interopRequireDefault(require("../value-types/color"));

var _valueTypes = require("../value-types");

var _index = _interopRequireDefault(require("../renderer/index"));

var _CCEnum = _interopRequireDefault(require("../platform/CCEnum"));

var _CCComponent2 = _interopRequireDefault(require("../components/CCComponent"));

var _CCClassDecorator = require("../platform/CCClassDecorator");

var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _class3, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

var RendererLight = null;

if (CC_JSB && CC_NATIVERENDERER) {
  // @ts-ignore
  RendererLight = window.renderer.Light;
} else {
  // @ts-ignore
  RendererLight = require('../../renderer/scene/light');
}

/**
 * !#en The light source type
 *
 * !#zh 光源类型
 * @static
 * @enum Light.Type
 */
var LightType = (0, _CCEnum["default"])({
  /**
   * !#en The direction of light
   *
   * !#zh 平行光
   * @property {Number} DIRECTIONAL
   * @readonly
   */
  DIRECTIONAL: 0,

  /**
   * !#en The point of light
   *
   * !#zh 点光源
   * @property {Number} POINT
   * @readonly
   */
  POINT: 1,

  /**
   * !#en The spot of light
   *
   * !#zh 聚光灯
   * @property {Number} SPOT
   * @readonly
   */
  SPOT: 2,

  /**
   * !#en The ambient light
   * !#zh 环境光
   * @property {Number} AMBIENT
   * @readonly
   */
  AMBIENT: 3
});
/**
 * !#en The shadow type
 *
 * !#zh 阴影类型
 * @static
 * @enum Light.ShadowType
 */

var LightShadowType = (0, _CCEnum["default"])({
  /**
   * !#en No shadows
   *
   * !#zh 阴影关闭
   * @property NONE
   * @readonly
   * @type {Number}
   */
  NONE: 0,

  /**
   * !#en Hard shadows
   *
   * !#zh 阴硬影
   * @property HARD
   * @readonly
   * @type {Number}
   */
  HARD: 2,

  /**
   * !#en Soft PCF 3x3 shadows
   *
   * !#zh PCF 3x3 软阴影
   * @property SOFT_PCF3X3
   * @readonly
   * @type {Number}
   */
  SOFT_PCF3X3: 3,

  /**
   * !#en Soft PCF 5x5 shadows
   *
   * !#zh PCF 5x5 软阴影
   * @property SOFT_PCF5X5
   * @readonly
   * @type {Number}
   */
  SOFT_PCF5X5: 4
});
/**
 * !#en The Light Component
 *
 * !#zh 光源组件
 * @class Light
 * @extends Component
 */

var Light = (_dec = (0, _CCClassDecorator.ccclass)('cc.Light'), _dec2 = (0, _CCClassDecorator.menu)('i18n:MAIN_MENU.component.renderers/Light'), _dec3 = (0, _CCClassDecorator.inspector)('packages://inspector/inspectors/comps/light.js'), _dec4 = (0, _CCClassDecorator.property)({
  type: LightType
}), _dec5 = (0, _CCClassDecorator.property)({
  type: LightShadowType
}), _dec(_class = _dec2(_class = (0, _CCClassDecorator.executeInEditMode)(_class = _dec3(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_CCComponent) {
  _inheritsLoose(Light, _CCComponent);

  function Light() {
    var _this;

    _this = _CCComponent.call(this) || this;

    _initializerDefineProperty(_this, "_type", _descriptor, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_color", _descriptor2, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_intensity", _descriptor3, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_range", _descriptor4, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_spotAngle", _descriptor5, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_spotExp", _descriptor6, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_shadowType", _descriptor7, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_shadowResolution", _descriptor8, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_shadowDarkness", _descriptor9, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_shadowMinDepth", _descriptor10, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_shadowMaxDepth", _descriptor11, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_shadowFrustumSize", _descriptor12, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_shadowBias", _descriptor13, _assertThisInitialized(_this));

    _this._light = new RendererLight();
    return _this;
  }

  var _proto = Light.prototype;

  _proto.onLoad = function onLoad() {
    this._light.setNode(this.node);

    this.type = this._type;
    this.color = this._color;
    this.intensity = this._intensity;
    this.range = this._range;
    this.spotAngle = this._spotAngle;
    this.spotExp = this._spotExp;
    this.shadowType = this._shadowType;
    this.shadowResolution = this._shadowResolution;
    this.shadowDarkness = this._shadowDarkness;
    this.shadowMaxDepth = this._shadowMaxDepth;
    this.shadowFrustumSize = this._shadowFrustumSize;
    this.shadowBias = this._shadowBias;
  };

  _proto.onEnable = function onEnable() {
    _index["default"].scene.addLight(this._light);
  };

  _proto.onDisable = function onDisable() {
    _index["default"].scene.removeLight(this._light);
  };

  _createClass(Light, [{
    key: "type",
    get:
    /**
     * !#en The light source type，currently we have directional, point, spot three type.
     * !#zh 光源类型，目前有 平行光，聚光灯，点光源 三种类型
     * @type {LightType}
     */
    function get() {
      return this._type;
    },
    set: function set(val) {
      this._type = val;
      var type = _enums["default"].LIGHT_DIRECTIONAL;

      if (val === LightType.POINT) {
        type = _enums["default"].LIGHT_POINT;
      } else if (val === LightType.SPOT) {
        type = _enums["default"].LIGHT_SPOT;
      } else if (val === LightType.AMBIENT) {
        type = _enums["default"].LIGHT_AMBIENT;
      }

      this._light.setType(type);
    }
    /**
     * !#en The light source color
     * !#zh 光源颜色
     * @type {Color}
     */

  }, {
    key: "color",
    get: function get() {
      return this._color;
    },
    set: function set(val) {
      if (!this._color.equals(val)) {
        this._color.set(val);
      }

      this._light.setColor(val.r / 255, val.g / 255, val.b / 255);
    }
    /**
     * !#en The light source intensity
     *
     * !#zh 光源强度
     * @type {Number}
     */

  }, {
    key: "intensity",
    get: function get() {
      return this._intensity;
    },
    set: function set(val) {
      this._intensity = val;

      this._light.setIntensity(val);
    }
    /**
     * !#en The light range, used for spot and point light
     *
     * !#zh 针对聚光灯和点光源设置光源范围
     * @type {Number}
     */

  }, {
    key: "range",
    get: function get() {
      return this._range;
    },
    set: function set(val) {
      this._range = val;

      this._light.setRange(val);
    }
    /**
     * !#en The spot light cone angle
     *
     * !#zh 聚光灯锥角
     * @type {Number}
     */

  }, {
    key: "spotAngle",
    get: function get() {
      return this._spotAngle;
    },
    set: function set(val) {
      this._spotAngle = val;

      this._light.setSpotAngle((0, _valueTypes.toRadian)(val));
    }
    /**
     * !#en The spot light exponential
     *
     * !#zh 聚光灯指数
     * @type {Number}
     */

  }, {
    key: "spotExp",
    get: function get() {
      return this._spotExp;
    },
    set: function set(val) {
      this._spotExp = val;

      this._light.setSpotExp(val);
    }
    /**
     * !#en The shadow type
     *
     * !#zh 阴影类型
     * @type {Number} shadowType
     */

  }, {
    key: "shadowType",
    get: function get() {
      return this._shadowType;
    },
    set: function set(val) {
      this._shadowType = val;

      this._light.setShadowType(val);
    }
    /**
     * !#en The shadow resolution
     *
     * !#zh 阴影分辨率
     *
     * @type {Number}
     */

  }, {
    key: "shadowResolution",
    get: function get() {
      return this._shadowResolution;
    },
    set: function set(val) {
      this._shadowResolution = val;

      this._light.setShadowResolution(val);
    }
    /**
     * !#en The shadow darkness
     *
     * !#zh 阴影灰度值
     *
     * @type {Number}
     */

  }, {
    key: "shadowDarkness",
    get: function get() {
      return this._shadowDarkness;
    },
    set: function set(val) {
      this._shadowDarkness = val;

      this._light.setShadowDarkness(val);
    }
    /**
     * !#en The shadow min depth
     *
     * !#zh 阴影最小深度
     *
     * @type {Number}
     */

  }, {
    key: "shadowMinDepth",
    get: function get() {
      return this._shadowMinDepth;
    },
    set: function set(val) {
      this._shadowMinDepth = val;

      this._light.setShadowMinDepth(val);
    }
    /**
     * !#en The shadow max depth
     *
     * !#zh 阴影最大深度
     *
     * @type {Number}
     */

  }, {
    key: "shadowMaxDepth",
    get: function get() {
      return this._shadowMaxDepth;
    },
    set: function set(val) {
      this._shadowMaxDepth = val;

      this._light.setShadowMaxDepth(val);
    }
    /**
     * !#en The shadow frustum size
     *
     * !#zh 阴影截锥体大小
     *
     * @type {Number}
     */

  }, {
    key: "shadowFrustumSize",
    get: function get() {
      return this._shadowFrustumSize;
    },
    set: function set(val) {
      this._shadowFrustumSize = val;

      this._light.setShadowFrustumSize(val);
    } // /**
    //  * !#en The shadow bias
    //  *
    //  * !#zh 阴影偏移量
    //  *
    //  * @type {Number}
    //  */
    // @property
    // get shadowBias() {
    //     return this._shadowBias;
    // }
    // set shadowBias(val) {
    //     this._shadowBias = val;
    //     this._light.setShadowBias(val);
    // }

  }]);

  return Light;
}(_CCComponent2["default"]), _class3.Type = LightType, _class3.ShadowType = LightShadowType, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_type", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return LightType.DIRECTIONAL;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_color", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return _color["default"].WHITE;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_intensity", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_range", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1000;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_spotAngle", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 60;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_spotExp", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "_shadowType", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return LightShadowType.NONE;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "_shadowResolution", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1024;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "_shadowDarkness", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0.5;
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "_shadowMinDepth", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1;
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "_shadowMaxDepth", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 4096;
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "_shadowFrustumSize", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1024;
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "_shadowBias", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0.0005;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "type", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "type"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "color", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "color"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "intensity", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "intensity"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "range", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "range"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "spotAngle", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "spotAngle"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "spotExp", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "spotExp"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "shadowType", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "shadowType"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "shadowResolution", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "shadowResolution"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "shadowDarkness", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "shadowDarkness"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "shadowMinDepth", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "shadowMinDepth"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "shadowMaxDepth", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "shadowMaxDepth"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "shadowFrustumSize", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "shadowFrustumSize"), _class2.prototype)), _class2)) || _class) || _class) || _class) || _class);
exports["default"] = Light;
cc.Light = Light;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL0NDTGlnaHRDb21wb25lbnQuanMiXSwibmFtZXMiOlsiUmVuZGVyZXJMaWdodCIsIkNDX0pTQiIsIkNDX05BVElWRVJFTkRFUkVSIiwid2luZG93IiwicmVuZGVyZXIiLCJMaWdodCIsInJlcXVpcmUiLCJMaWdodFR5cGUiLCJESVJFQ1RJT05BTCIsIlBPSU5UIiwiU1BPVCIsIkFNQklFTlQiLCJMaWdodFNoYWRvd1R5cGUiLCJOT05FIiwiSEFSRCIsIlNPRlRfUENGM1gzIiwiU09GVF9QQ0Y1WDUiLCJ0eXBlIiwiZXhlY3V0ZUluRWRpdE1vZGUiLCJfbGlnaHQiLCJvbkxvYWQiLCJzZXROb2RlIiwibm9kZSIsIl90eXBlIiwiY29sb3IiLCJfY29sb3IiLCJpbnRlbnNpdHkiLCJfaW50ZW5zaXR5IiwicmFuZ2UiLCJfcmFuZ2UiLCJzcG90QW5nbGUiLCJfc3BvdEFuZ2xlIiwic3BvdEV4cCIsIl9zcG90RXhwIiwic2hhZG93VHlwZSIsIl9zaGFkb3dUeXBlIiwic2hhZG93UmVzb2x1dGlvbiIsIl9zaGFkb3dSZXNvbHV0aW9uIiwic2hhZG93RGFya25lc3MiLCJfc2hhZG93RGFya25lc3MiLCJzaGFkb3dNYXhEZXB0aCIsIl9zaGFkb3dNYXhEZXB0aCIsInNoYWRvd0ZydXN0dW1TaXplIiwiX3NoYWRvd0ZydXN0dW1TaXplIiwic2hhZG93QmlhcyIsIl9zaGFkb3dCaWFzIiwib25FbmFibGUiLCJzY2VuZSIsImFkZExpZ2h0Iiwib25EaXNhYmxlIiwicmVtb3ZlTGlnaHQiLCJ2YWwiLCJlbnVtcyIsIkxJR0hUX0RJUkVDVElPTkFMIiwiTElHSFRfUE9JTlQiLCJMSUdIVF9TUE9UIiwiTElHSFRfQU1CSUVOVCIsInNldFR5cGUiLCJlcXVhbHMiLCJzZXQiLCJzZXRDb2xvciIsInIiLCJnIiwiYiIsInNldEludGVuc2l0eSIsInNldFJhbmdlIiwic2V0U3BvdEFuZ2xlIiwic2V0U3BvdEV4cCIsInNldFNoYWRvd1R5cGUiLCJzZXRTaGFkb3dSZXNvbHV0aW9uIiwic2V0U2hhZG93RGFya25lc3MiLCJfc2hhZG93TWluRGVwdGgiLCJzZXRTaGFkb3dNaW5EZXB0aCIsInNldFNoYWRvd01heERlcHRoIiwic2V0U2hhZG93RnJ1c3R1bVNpemUiLCJDQ0NvbXBvbmVudCIsIlR5cGUiLCJTaGFkb3dUeXBlIiwicHJvcGVydHkiLCJDb2xvciIsIldISVRFIiwiY2MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7O0FBQ0E7O0FBQ0E7O0FBV0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFaQSxJQUFJQSxhQUFhLEdBQUcsSUFBcEI7O0FBQ0EsSUFBSUMsTUFBTSxJQUFJQyxpQkFBZCxFQUFpQztBQUM3QjtBQUNBRixFQUFBQSxhQUFhLEdBQUdHLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsS0FBaEM7QUFDSCxDQUhELE1BR087QUFDSDtBQUNBTCxFQUFBQSxhQUFhLEdBQUdNLE9BQU8sQ0FBQyw0QkFBRCxDQUF2QjtBQUNIOztBQU9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTUMsU0FBUyxHQUFHLHdCQUFLO0FBQ25CO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLEVBQUFBLFdBQVcsRUFBRSxDQVJNOztBQVNuQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJQyxFQUFBQSxLQUFLLEVBQUUsQ0FoQlk7O0FBaUJuQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJQyxFQUFBQSxJQUFJLEVBQUUsQ0F4QmE7O0FBMEJuQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsT0FBTyxFQUFFO0FBaENVLENBQUwsQ0FBbEI7QUFtQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBTUMsZUFBZSxHQUFHLHdCQUFLO0FBQ3pCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFD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OztBQUNBLFdBQUtoQyxNQUFMLENBQVlzRCxpQkFBWixDQUE4QnRCLEdBQTlCO0FBQ0g7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztTQUNJLGVBQ3dCO0FBQ3BCLGFBQU8sS0FBS1Isa0JBQVo7QUFDSDtTQUVELGFBQXNCUSxHQUF0QixFQUEyQjtBQUN2QixXQUFLUixrQkFBTCxHQUEwQlEsR0FBMUI7O0FBQ0EsV0FBS2hDLE1BQUwsQ0FBWXVELG9CQUFaLENBQWlDdkIsR0FBakM7QUFDSCxNQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7RUExUStCd0IsbUNBNFF4QkMsT0FBT3JFLG1CQUVQc0UsYUFBYWpFLCtGQTdRbkJrRTs7Ozs7V0FDT3ZFLFNBQVMsQ0FBQ0M7OzJFQUVqQnNFOzs7OztXQUNRQyxrQkFBTUM7OytFQUVkRjs7Ozs7V0FDWTs7MkVBRVpBOzs7OztXQUNROzsrRUFFUkE7Ozs7O1dBQ1k7OzZFQUVaQTs7Ozs7V0FDVTs7Z0ZBRVZBOzs7OztXQUNhbEUsZUFBZSxDQUFDQzs7c0ZBRTdCaUU7Ozs7O1dBQ21COztvRkFFbkJBOzs7OztXQUNpQjs7cUZBRWpCQTs7Ozs7V0FDaUI7O3FGQUVqQkE7Ozs7O1dBQ2lCOzt3RkFFakJBOzs7OztXQUNvQjs7aUZBRXBCQTs7Ozs7V0FDYTs7eU1Ba0NiQSx5S0FrQkFBLHlLQWdCQUEseUtBZ0JBQSwyS0FnQkFBLDRVQW1DQUEseUxBaUJBQSx1TEFpQkFBLHVMQWlCQUEsMExBaUJBQTs7QUE4RExHLEVBQUUsQ0FBQzVFLEtBQUgsR0FBV0EsS0FBWCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgZW51bXMgZnJvbSAnLi4vLi4vcmVuZGVyZXIvZW51bXMnO1xuaW1wb3J0IENvbG9yIGZyb20gJy4uL3ZhbHVlLXR5cGVzL2NvbG9yJztcbmltcG9ydCB7IHRvUmFkaWFuIH0gZnJvbSAnLi4vdmFsdWUtdHlwZXMnO1xuXG5sZXQgUmVuZGVyZXJMaWdodCA9IG51bGw7XG5pZiAoQ0NfSlNCICYmIENDX05BVElWRVJFTkRFUkVSKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIFJlbmRlcmVyTGlnaHQgPSB3aW5kb3cucmVuZGVyZXIuTGlnaHQ7XG59IGVsc2Uge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBSZW5kZXJlckxpZ2h0ID0gcmVxdWlyZSgnLi4vLi4vcmVuZGVyZXIvc2NlbmUvbGlnaHQnKTtcbn1cblxuaW1wb3J0IHJlbmRlcmVyIGZyb20gJy4uL3JlbmRlcmVyL2luZGV4JztcbmltcG9ydCBFbnVtIGZyb20gJy4uL3BsYXRmb3JtL0NDRW51bSc7XG5pbXBvcnQgQ0NDb21wb25lbnQgZnJvbSAnLi4vY29tcG9uZW50cy9DQ0NvbXBvbmVudCc7XG5pbXBvcnQgeyBjY2NsYXNzLCBtZW51LCBpbnNwZWN0b3IsIHByb3BlcnR5LCBleGVjdXRlSW5FZGl0TW9kZSB9IGZyb20gJy4uL3BsYXRmb3JtL0NDQ2xhc3NEZWNvcmF0b3InO1xuXG4vKipcbiAqICEjZW4gVGhlIGxpZ2h0IHNvdXJjZSB0eXBlXG4gKlxuICogISN6aCDlhYnmupDnsbvlnotcbiAqIEBzdGF0aWNcbiAqIEBlbnVtIExpZ2h0LlR5cGVcbiAqL1xuY29uc3QgTGlnaHRUeXBlID0gRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZGlyZWN0aW9uIG9mIGxpZ2h0XG4gICAgICpcbiAgICAgKiAhI3poIOW5s+ihjOWFiVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBESVJFQ1RJT05BTFxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIERJUkVDVElPTkFMOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHBvaW50IG9mIGxpZ2h0XG4gICAgICpcbiAgICAgKiAhI3poIOeCueWFiea6kFxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBQT0lOVFxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIFBPSU5UOiAxLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHNwb3Qgb2YgbGlnaHRcbiAgICAgKlxuICAgICAqICEjemgg6IGa5YWJ54GvXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFNQT1RcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBTUE9UOiAyLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgYW1iaWVudCBsaWdodFxuICAgICAqICEjemgg546v5aKD5YWJXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEFNQklFTlRcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBBTUJJRU5UOiAzXG59KTtcblxuLyoqXG4gKiAhI2VuIFRoZSBzaGFkb3cgdHlwZVxuICpcbiAqICEjemgg6Zi05b2x57G75Z6LXG4gKiBAc3RhdGljXG4gKiBAZW51bSBMaWdodC5TaGFkb3dUeXBlXG4gKi9cbmNvbnN0IExpZ2h0U2hhZG93VHlwZSA9IEVudW0oe1xuICAgIC8qKlxuICAgICAqICEjZW4gTm8gc2hhZG93c1xuICAgICAqXG4gICAgICogISN6aCDpmLTlvbHlhbPpl61cbiAgICAgKiBAcHJvcGVydHkgTk9ORVxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgTk9ORTogMCxcbiAgICAvKipcbiAgICAgKiAhI2VuIEhhcmQgc2hhZG93c1xuICAgICAqXG4gICAgICogISN6aCDpmLTnoazlvbFcbiAgICAgKiBAcHJvcGVydHkgSEFSRFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgSEFSRDogMixcbiAgICAvKipcbiAgICAgKiAhI2VuIFNvZnQgUENGIDN4MyBzaGFkb3dzXG4gICAgICpcbiAgICAgKiAhI3poIFBDRiAzeDMg6L2v6Zi05b2xXG4gICAgICogQHByb3BlcnR5IFNPRlRfUENGM1gzXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBTT0ZUX1BDRjNYMzogMyxcbiAgICAvKipcbiAgICAgKiAhI2VuIFNvZnQgUENGIDV4NSBzaGFkb3dzXG4gICAgICpcbiAgICAgKiAhI3poIFBDRiA1eDUg6L2v6Zi05b2xXG4gICAgICogQHByb3BlcnR5IFNPRlRfUENGNVg1XG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBTT0ZUX1BDRjVYNTogNCxcbn0pO1xuXG4vKipcbiAqICEjZW4gVGhlIExpZ2h0IENvbXBvbmVudFxuICpcbiAqICEjemgg5YWJ5rqQ57uE5Lu2XG4gKiBAY2xhc3MgTGlnaHRcbiAqIEBleHRlbmRzIENvbXBvbmVudFxuICovXG5AY2NjbGFzcygnY2MuTGlnaHQnKVxuQG1lbnUoJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5yZW5kZXJlcnMvTGlnaHQnKVxuQGV4ZWN1dGVJbkVkaXRNb2RlXG5AaW5zcGVjdG9yKCdwYWNrYWdlczovL2luc3BlY3Rvci9pbnNwZWN0b3JzL2NvbXBzL2xpZ2h0LmpzJylcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpZ2h0IGV4dGVuZHMgQ0NDb21wb25lbnQge1xuICAgIEBwcm9wZXJ0eVxuICAgIF90eXBlID0gTGlnaHRUeXBlLkRJUkVDVElPTkFMO1xuXG4gICAgQHByb3BlcnR5XG4gICAgX2NvbG9yID0gQ29sb3IuV0hJVEU7XG5cbiAgICBAcHJvcGVydHlcbiAgICBfaW50ZW5zaXR5ID0gMTtcblxuICAgIEBwcm9wZXJ0eVxuICAgIF9yYW5nZSA9IDEwMDA7XG5cbiAgICBAcHJvcGVydHlcbiAgICBfc3BvdEFuZ2xlID0gNjA7XG5cbiAgICBAcHJvcGVydHlcbiAgICBfc3BvdEV4cCA9IDE7XG5cbiAgICBAcHJvcGVydHlcbiAgICBfc2hhZG93VHlwZSA9IExpZ2h0U2hhZG93VHlwZS5OT05FO1xuXG4gICAgQHByb3BlcnR5XG4gICAgX3NoYWRvd1Jlc29sdXRpb24gPSAxMDI0O1xuXG4gICAgQHByb3BlcnR5XG4gICAgX3NoYWRvd0RhcmtuZXNzID0gMC41O1xuXG4gICAgQHByb3BlcnR5XG4gICAgX3NoYWRvd01pbkRlcHRoID0gMTtcblxuICAgIEBwcm9wZXJ0eVxuICAgIF9zaGFkb3dNYXhEZXB0aCA9IDQwOTY7XG5cbiAgICBAcHJvcGVydHlcbiAgICBfc2hhZG93RnJ1c3R1bVNpemUgPSAxMDI0O1xuXG4gICAgQHByb3BlcnR5XG4gICAgX3NoYWRvd0JpYXMgPSAwLjAwMDU7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBsaWdodCBzb3VyY2UgdHlwZe+8jGN1cnJlbnRseSB3ZSBoYXZlIGRpcmVjdGlvbmFsLCBwb2ludCwgc3BvdCB0aHJlZSB0eXBlLlxuICAgICAqICEjemgg5YWJ5rqQ57G75Z6L77yM55uu5YmN5pyJIOW5s+ihjOWFie+8jOiBmuWFieeBr++8jOeCueWFiea6kCDkuInnp43nsbvlnotcbiAgICAgKiBAdHlwZSB7TGlnaHRUeXBlfVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IExpZ2h0VHlwZVxuICAgIH0pXG4gICAgZ2V0IHR5cGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xuICAgIH1cblxuICAgIHNldCB0eXBlKHZhbCkge1xuICAgICAgICB0aGlzLl90eXBlID0gdmFsO1xuXG4gICAgICAgIGxldCB0eXBlID0gZW51bXMuTElHSFRfRElSRUNUSU9OQUw7XG4gICAgICAgIGlmICh2YWwgPT09IExpZ2h0VHlwZS5QT0lOVCkge1xuICAgICAgICAgICAgdHlwZSA9IGVudW1zLkxJR0hUX1BPSU5UO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbCA9PT0gTGlnaHRUeXBlLlNQT1QpIHtcbiAgICAgICAgICAgIHR5cGUgPSBlbnVtcy5MSUdIVF9TUE9UO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHZhbCA9PT0gTGlnaHRUeXBlLkFNQklFTlQpIHtcbiAgICAgICAgICAgIHR5cGUgPSBlbnVtcy5MSUdIVF9BTUJJRU5UO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2xpZ2h0LnNldFR5cGUodHlwZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbGlnaHQgc291cmNlIGNvbG9yXG4gICAgICogISN6aCDlhYnmupDpopzoibJcbiAgICAgKiBAdHlwZSB7Q29sb3J9XG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgZ2V0IGNvbG9yKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29sb3I7XG4gICAgfVxuXG4gICAgc2V0IGNvbG9yKHZhbCkge1xuICAgICAgICBpZiAoIXRoaXMuX2NvbG9yLmVxdWFscyh2YWwpKSB7XG4gICAgICAgICAgICB0aGlzLl9jb2xvci5zZXQodmFsKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9saWdodC5zZXRDb2xvcih2YWwuciAvIDI1NSwgdmFsLmcgLyAyNTUsIHZhbC5iIC8gMjU1KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBsaWdodCBzb3VyY2UgaW50ZW5zaXR5XG4gICAgICpcbiAgICAgKiAhI3poIOWFiea6kOW8uuW6plxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgZ2V0IGludGVuc2l0eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludGVuc2l0eTtcbiAgICB9XG5cbiAgICBzZXQgaW50ZW5zaXR5KHZhbCkge1xuICAgICAgICB0aGlzLl9pbnRlbnNpdHkgPSB2YWw7XG4gICAgICAgIHRoaXMuX2xpZ2h0LnNldEludGVuc2l0eSh2YWwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGxpZ2h0IHJhbmdlLCB1c2VkIGZvciBzcG90IGFuZCBwb2ludCBsaWdodFxuICAgICAqXG4gICAgICogISN6aCDpkojlr7nogZrlhYnnga/lkozngrnlhYnmupDorr7nva7lhYnmupDojIPlm7RcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGdldCByYW5nZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JhbmdlO1xuICAgIH1cblxuICAgIHNldCByYW5nZSh2YWwpIHtcbiAgICAgICAgdGhpcy5fcmFuZ2UgPSB2YWw7XG4gICAgICAgIHRoaXMuX2xpZ2h0LnNldFJhbmdlKHZhbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgc3BvdCBsaWdodCBjb25lIGFuZ2xlXG4gICAgICpcbiAgICAgKiAhI3poIOiBmuWFieeBr+mUpeinklxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgZ2V0IHNwb3RBbmdsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Nwb3RBbmdsZTtcbiAgICB9XG5cbiAgICBzZXQgc3BvdEFuZ2xlKHZhbCkge1xuICAgICAgICB0aGlzLl9zcG90QW5nbGUgPSB2YWw7XG4gICAgICAgIHRoaXMuX2xpZ2h0LnNldFNwb3RBbmdsZSh0b1JhZGlhbih2YWwpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBzcG90IGxpZ2h0IGV4cG9uZW50aWFsXG4gICAgICpcbiAgICAgKiAhI3poIOiBmuWFieeBr+aMh+aVsFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgZ2V0IHNwb3RFeHAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zcG90RXhwO1xuICAgIH1cblxuICAgIHNldCBzcG90RXhwKHZhbCkge1xuICAgICAgICB0aGlzLl9zcG90RXhwID0gdmFsO1xuICAgICAgICB0aGlzLl9saWdodC5zZXRTcG90RXhwKHZhbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgc2hhZG93IHR5cGVcbiAgICAgKlxuICAgICAqICEjemgg6Zi05b2x57G75Z6LXG4gICAgICogQHR5cGUge051bWJlcn0gc2hhZG93VHlwZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IExpZ2h0U2hhZG93VHlwZVxuICAgIH0pXG4gICAgZ2V0IHNoYWRvd1R5cGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFkb3dUeXBlO1xuICAgIH1cblxuICAgIHNldCBzaGFkb3dUeXBlKHZhbCkge1xuICAgICAgICB0aGlzLl9zaGFkb3dUeXBlID0gdmFsO1xuICAgICAgICB0aGlzLl9saWdodC5zZXRTaGFkb3dUeXBlKHZhbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgc2hhZG93IHJlc29sdXRpb25cbiAgICAgKlxuICAgICAqICEjemgg6Zi05b2x5YiG6L6o546HXG4gICAgICpcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGdldCBzaGFkb3dSZXNvbHV0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2hhZG93UmVzb2x1dGlvbjtcbiAgICB9XG5cbiAgICBzZXQgc2hhZG93UmVzb2x1dGlvbih2YWwpIHtcbiAgICAgICAgdGhpcy5fc2hhZG93UmVzb2x1dGlvbiA9IHZhbDtcbiAgICAgICAgdGhpcy5fbGlnaHQuc2V0U2hhZG93UmVzb2x1dGlvbih2YWwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHNoYWRvdyBkYXJrbmVzc1xuICAgICAqXG4gICAgICogISN6aCDpmLTlvbHngbDluqblgLxcbiAgICAgKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgZ2V0IHNoYWRvd0RhcmtuZXNzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2hhZG93RGFya25lc3M7XG4gICAgfVxuXG4gICAgc2V0IHNoYWRvd0RhcmtuZXNzKHZhbCkge1xuICAgICAgICB0aGlzLl9zaGFkb3dEYXJrbmVzcyA9IHZhbDtcbiAgICAgICAgdGhpcy5fbGlnaHQuc2V0U2hhZG93RGFya25lc3ModmFsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBzaGFkb3cgbWluIGRlcHRoXG4gICAgICpcbiAgICAgKiAhI3poIOmYtOW9seacgOWwj+a3seW6plxuICAgICAqXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBnZXQgc2hhZG93TWluRGVwdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFkb3dNaW5EZXB0aDtcbiAgICB9XG5cbiAgICBzZXQgc2hhZG93TWluRGVwdGgodmFsKSB7XG4gICAgICAgIHRoaXMuX3NoYWRvd01pbkRlcHRoID0gdmFsO1xuICAgICAgICB0aGlzLl9saWdodC5zZXRTaGFkb3dNaW5EZXB0aCh2YWwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHNoYWRvdyBtYXggZGVwdGhcbiAgICAgKlxuICAgICAqICEjemgg6Zi05b2x5pyA5aSn5rex5bqmXG4gICAgICpcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGdldCBzaGFkb3dNYXhEZXB0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYWRvd01heERlcHRoO1xuICAgIH1cblxuICAgIHNldCBzaGFkb3dNYXhEZXB0aCh2YWwpIHtcbiAgICAgICAgdGhpcy5fc2hhZG93TWF4RGVwdGggPSB2YWw7XG4gICAgICAgIHRoaXMuX2xpZ2h0LnNldFNoYWRvd01heERlcHRoKHZhbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgc2hhZG93IGZydXN0dW0gc2l6ZVxuICAgICAqXG4gICAgICogISN6aCDpmLTlvbHmiKrplKXkvZPlpKflsI9cbiAgICAgKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgZ2V0IHNoYWRvd0ZydXN0dW1TaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2hhZG93RnJ1c3R1bVNpemU7XG4gICAgfVxuXG4gICAgc2V0IHNoYWRvd0ZydXN0dW1TaXplKHZhbCkge1xuICAgICAgICB0aGlzLl9zaGFkb3dGcnVzdHVtU2l6ZSA9IHZhbDtcbiAgICAgICAgdGhpcy5fbGlnaHQuc2V0U2hhZG93RnJ1c3R1bVNpemUodmFsKTtcbiAgICB9XG5cbiAgICAvLyAvKipcbiAgICAvLyAgKiAhI2VuIFRoZSBzaGFkb3cgYmlhc1xuICAgIC8vICAqXG4gICAgLy8gICogISN6aCDpmLTlvbHlgY/np7vph49cbiAgICAvLyAgKlxuICAgIC8vICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgLy8gICovXG4gICAgLy8gQHByb3BlcnR5XG4gICAgLy8gZ2V0IHNoYWRvd0JpYXMoKSB7XG4gICAgLy8gICAgIHJldHVybiB0aGlzLl9zaGFkb3dCaWFzO1xuICAgIC8vIH1cblxuICAgIC8vIHNldCBzaGFkb3dCaWFzKHZhbCkge1xuICAgIC8vICAgICB0aGlzLl9zaGFkb3dCaWFzID0gdmFsO1xuICAgIC8vICAgICB0aGlzLl9saWdodC5zZXRTaGFkb3dCaWFzKHZhbCk7XG4gICAgLy8gfVxuXG4gICAgc3RhdGljIFR5cGUgPSBMaWdodFR5cGU7XG5cbiAgICBzdGF0aWMgU2hhZG93VHlwZSA9IExpZ2h0U2hhZG93VHlwZTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuX2xpZ2h0ID0gbmV3IFJlbmRlcmVyTGlnaHQoKTtcbiAgICB9XG5cbiAgICBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX2xpZ2h0LnNldE5vZGUodGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy50eXBlID0gdGhpcy5fdHlwZTtcbiAgICAgICAgdGhpcy5jb2xvciA9IHRoaXMuX2NvbG9yO1xuICAgICAgICB0aGlzLmludGVuc2l0eSA9IHRoaXMuX2ludGVuc2l0eTtcbiAgICAgICAgdGhpcy5yYW5nZSA9IHRoaXMuX3JhbmdlO1xuICAgICAgICB0aGlzLnNwb3RBbmdsZSA9IHRoaXMuX3Nwb3RBbmdsZTtcbiAgICAgICAgdGhpcy5zcG90RXhwID0gdGhpcy5fc3BvdEV4cDtcbiAgICAgICAgdGhpcy5zaGFkb3dUeXBlID0gdGhpcy5fc2hhZG93VHlwZTtcbiAgICAgICAgdGhpcy5zaGFkb3dSZXNvbHV0aW9uID0gdGhpcy5fc2hhZG93UmVzb2x1dGlvbjtcbiAgICAgICAgdGhpcy5zaGFkb3dEYXJrbmVzcyA9IHRoaXMuX3NoYWRvd0RhcmtuZXNzO1xuICAgICAgICB0aGlzLnNoYWRvd01heERlcHRoID0gdGhpcy5fc2hhZG93TWF4RGVwdGg7XG4gICAgICAgIHRoaXMuc2hhZG93RnJ1c3R1bVNpemUgPSB0aGlzLl9zaGFkb3dGcnVzdHVtU2l6ZTtcbiAgICAgICAgdGhpcy5zaGFkb3dCaWFzID0gdGhpcy5fc2hhZG93QmlhcztcbiAgICB9XG5cbiAgICBvbkVuYWJsZSgpIHtcbiAgICAgICAgcmVuZGVyZXIuc2NlbmUuYWRkTGlnaHQodGhpcy5fbGlnaHQpO1xuICAgIH1cblxuICAgIG9uRGlzYWJsZSgpIHtcbiAgICAgICAgcmVuZGVyZXIuc2NlbmUucmVtb3ZlTGlnaHQodGhpcy5fbGlnaHQpO1xuICAgIH1cbn1cblxuY2MuTGlnaHQgPSBMaWdodDtcbiJdLCJzb3VyY2VSb290IjoiLyJ9