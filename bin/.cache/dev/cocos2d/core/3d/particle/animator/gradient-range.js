
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/particle/animator/gradient-range.js';
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

var _CCEnum = _interopRequireDefault(require("../../../platform/CCEnum"));

var _gradient = require("./gradient");

var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _class3, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

var GRADIENT_MODE_FIX = 0;
var GRADIENT_MODE_BLEND = 1;
var GRADIENT_RANGE_MODE_COLOR = 0;
var GRADIENT_RANGE_MODE_TWO_COLOR = 1;
var GRADIENT_RANGE_MODE_RANDOM_COLOR = 2;
var GRADIENT_RANGE_MODE_GRADIENT = 3;
var GRADIENT_RANGE_MODE_TWO_GRADIENT = 4;
var SerializableTable = CC_EDITOR && [["_mode", "color"], ["_mode", "gradient"], ["_mode", "colorMin", "colorMax"], ["_mode", "gradientMin", "gradientMax"], ["_mode", "gradient"]];
var Mode = (0, _CCEnum["default"])({
  Color: 0,
  Gradient: 1,
  TwoColors: 2,
  TwoGradients: 3,
  RandomColor: 4
});
/**
 * !#en The gradient range of color.
 * !#zh 颜色值的渐变范围
 * @class GradientRange
 */

var GradientRange = (_dec = (0, _CCClassDecorator.ccclass)('cc.GradientRange'), _dec2 = (0, _CCClassDecorator.property)({
  type: Mode
}), _dec3 = (0, _CCClassDecorator.property)({
  type: _gradient.Gradient
}), _dec4 = (0, _CCClassDecorator.property)({
  type: _gradient.Gradient
}), _dec5 = (0, _CCClassDecorator.property)({
  type: _gradient.Gradient
}), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function () {
  function GradientRange() {
    _initializerDefineProperty(this, "_mode", _descriptor, this);

    _initializerDefineProperty(this, "_color", _descriptor2, this);

    _initializerDefineProperty(this, "color", _descriptor3, this);

    _initializerDefineProperty(this, "colorMin", _descriptor4, this);

    _initializerDefineProperty(this, "colorMax", _descriptor5, this);

    _initializerDefineProperty(this, "gradient", _descriptor6, this);

    _initializerDefineProperty(this, "gradientMin", _descriptor7, this);

    _initializerDefineProperty(this, "gradientMax", _descriptor8, this);
  }

  var _proto = GradientRange.prototype;

  _proto.evaluate = function evaluate(time, rndRatio) {
    switch (this._mode) {
      case Mode.Color:
        return this.color;

      case Mode.TwoColors:
        this.colorMin.lerp(this.colorMax, rndRatio, this._color);
        return this._color;

      case Mode.RandomColor:
        return this.gradient.randomColor();

      case Mode.Gradient:
        return this.gradient.evaluate(time);

      case Mode.TwoGradients:
        this.gradientMin.evaluate(time).lerp(this.gradientMax.evaluate(time), rndRatio, this._color);
        return this._color;

      default:
        return this.color;
    }
  };

  _createClass(GradientRange, [{
    key: "mode",
    get:
    /**
     * !#en Gradient type.
     * !#zh 渐变色类型。
     * @property {Mode} mode
     */
    function get() {
      return this._mode;
    },
    set: function set(m) {
      if (CC_EDITOR) {
        if (m === Mode.RandomColor) {
          if (this.gradient.colorKeys.length === 0) {
            this.gradient.colorKeys.push(new _gradient.ColorKey());
          }

          if (this.gradient.alphaKeys.length === 0) {
            this.gradient.alphaKeys.push(new _gradient.AlphaKey());
          }
        }
      }

      this._mode = m;
    }
  }]);

  return GradientRange;
}(), _class3.Mode = Mode, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_mode", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return Mode.Color;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "mode", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "mode"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_color", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return cc.Color.WHITE.clone();
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "color", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return cc.Color.WHITE.clone();
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "colorMin", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return cc.Color.WHITE.clone();
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "colorMax", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return cc.Color.WHITE.clone();
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "gradient", [_dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _gradient.Gradient();
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "gradientMin", [_dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _gradient.Gradient();
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "gradientMax", [_dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _gradient.Gradient();
  }
})), _class2)) || _class);
exports["default"] = GradientRange;
CC_EDITOR && (GradientRange.prototype._onBeforeSerialize = function (props) {
  return SerializableTable[this._mode];
});
cc.GradientRange = GradientRange;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BhcnRpY2xlL2FuaW1hdG9yL2dyYWRpZW50LXJhbmdlLnRzIl0sIm5hbWVzIjpbIkdSQURJRU5UX01PREVfRklYIiwiR1JBRElFTlRfTU9ERV9CTEVORCIsIkdSQURJRU5UX1JBTkdFX01PREVfQ09MT1IiLCJHUkFESUVOVF9SQU5HRV9NT0RFX1RXT19DT0xPUiIsIkdSQURJRU5UX1JBTkdFX01PREVfUkFORE9NX0NPTE9SIiwiR1JBRElFTlRfUkFOR0VfTU9ERV9HUkFESUVOVCIsIkdSQURJRU5UX1JBTkdFX01PREVfVFdPX0dSQURJRU5UIiwiU2VyaWFsaXphYmxlVGFibGUiLCJDQ19FRElUT1IiLCJNb2RlIiwiQ29sb3IiLCJHcmFkaWVudCIsIlR3b0NvbG9ycyIsIlR3b0dyYWRpZW50cyIsIlJhbmRvbUNvbG9yIiwiR3JhZGllbnRSYW5nZSIsInR5cGUiLCJldmFsdWF0ZSIsInRpbWUiLCJybmRSYXRpbyIsIl9tb2RlIiwiY29sb3IiLCJjb2xvck1pbiIsImxlcnAiLCJjb2xvck1heCIsIl9jb2xvciIsImdyYWRpZW50IiwicmFuZG9tQ29sb3IiLCJncmFkaWVudE1pbiIsImdyYWRpZW50TWF4IiwibSIsImNvbG9yS2V5cyIsImxlbmd0aCIsInB1c2giLCJDb2xvcktleSIsImFscGhhS2V5cyIsIkFscGhhS2V5IiwicHJvcGVydHkiLCJjYyIsIldISVRFIiwiY2xvbmUiLCJwcm90b3R5cGUiLCJfb25CZWZvcmVTZXJpYWxpemUiLCJwcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsaUJBQWlCLEdBQUcsQ0FBMUI7QUFDQSxJQUFNQyxtQkFBbUIsR0FBRyxDQUE1QjtBQUVBLElBQU1DLHlCQUF5QixHQUFHLENBQWxDO0FBQ0EsSUFBTUMsNkJBQTZCLEdBQUcsQ0FBdEM7QUFDQSxJQUFNQyxnQ0FBZ0MsR0FBRyxD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RkFFYjRCOzs7OztXQUNPNUIsSUFBSSxDQUFDQzs7eU5BMkJaMkI7Ozs7O1dBQ1FDLEVBQUUsQ0FBQzVCLEtBQUgsQ0FBUzZCLEtBQVQsQ0FBZUMsS0FBZjs7MEVBTVJIOzs7OztXQUNPQyxFQUFFLENBQUM1QixLQUFILENBQVM2QixLQUFULENBQWVDLEtBQWY7OzZFQU9QSDs7Ozs7V0FDVUMsRUFBRSxDQUFDNUIsS0FBSCxDQUFTNkIsS0FBVCxDQUFlQyxLQUFmOzs2RUFPVkg7Ozs7O1dBQ1VDLEVBQUUsQ0FBQzVCLEtBQUgsQ0FBUzZCLEtBQVQsQ0FBZUMsS0FBZjs7Ozs7OztXQVVBLElBQUk3QixrQkFBSjs7Ozs7OztXQVVHLElBQUlBLGtCQUFKOzs7Ozs7O1dBVUEsSUFBSUEsa0JBQUo7Ozs7QUFzQmxCSCxTQUFTLEtBQUtPLGFBQWEsQ0FBQzBCLFNBQWQsQ0FBd0JDLGtCQUF4QixHQUE2QyxVQUFTQyxLQUFULEVBQWU7QUFBQyxTQUFPcEMsaUJBQWlCLENBQUMsS0FBS2EsS0FBTixDQUF4QjtBQUFzQyxDQUF4RyxDQUFUO0FBRUFrQixFQUFFLENBQUN2QixhQUFILEdBQW1CQSxhQUFuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNjY2xhc3MsIHByb3BlcnR5IH0gZnJvbSAnLi4vLi4vLi4vcGxhdGZvcm0vQ0NDbGFzc0RlY29yYXRvcic7XG5pbXBvcnQgRW51bSBmcm9tICcuLi8uLi8uLi9wbGF0Zm9ybS9DQ0VudW0nO1xuaW1wb3J0IHsgQ29sb3IgfSBmcm9tICcuLi8uLi8uLi92YWx1ZS10eXBlcyc7XG5pbXBvcnQgeyBHcmFkaWVudCwgQWxwaGFLZXksIENvbG9yS2V5IH0gZnJvbSAnLi9ncmFkaWVudCc7XG5cbmNvbnN0IEdSQURJRU5UX01PREVfRklYID0gMDtcbmNvbnN0IEdSQURJRU5UX01PREVfQkxFTkQgPSAxO1xuXG5jb25zdCBHUkFESUVOVF9SQU5HRV9NT0RFX0NPTE9SID0gMDtcbmNvbnN0IEdSQURJRU5UX1JBTkdFX01PREVfVFdPX0NPTE9SID0gMTtcbmNvbnN0IEdSQURJRU5UX1JBTkdFX01PREVfUkFORE9NX0NPTE9SID0gMjtcbmNvbnN0IEdSQURJRU5UX1JBTkdFX01PREVfR1JBRElFTlQgPSAzO1xuY29uc3QgR1JBRElFTlRfUkFOR0VfTU9ERV9UV09fR1JBRElFTlQgPSA0O1xuXG5jb25zdCBTZXJpYWxpemFibGVUYWJsZSA9IENDX0VESVRPUiAmJiBbXG4gICAgWyBcIl9tb2RlXCIsIFwiY29sb3JcIiBdLFxuICAgIFsgXCJfbW9kZVwiLCBcImdyYWRpZW50XCIgXSxcbiAgICBbIFwiX21vZGVcIiwgXCJjb2xvck1pblwiLCBcImNvbG9yTWF4XCIgXSxcbiAgICBbIFwiX21vZGVcIiwgXCJncmFkaWVudE1pblwiLCBcImdyYWRpZW50TWF4XCJdLFxuICAgIFsgXCJfbW9kZVwiLCBcImdyYWRpZW50XCIgXVxuXTtcblxuY29uc3QgTW9kZSA9IEVudW0oe1xuICAgIENvbG9yOiAwLFxuICAgIEdyYWRpZW50OiAxLFxuICAgIFR3b0NvbG9yczogMixcbiAgICBUd29HcmFkaWVudHM6IDMsXG4gICAgUmFuZG9tQ29sb3I6IDQsXG59KTtcblxuLyoqXG4gKiAhI2VuIFRoZSBncmFkaWVudCByYW5nZSBvZiBjb2xvci5cbiAqICEjemgg6aKc6Imy5YC855qE5riQ5Y+Y6IyD5Zu0XG4gKiBAY2xhc3MgR3JhZGllbnRSYW5nZVxuICovXG5AY2NjbGFzcygnY2MuR3JhZGllbnRSYW5nZScpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmFkaWVudFJhbmdlIHtcblxuICAgIHN0YXRpYyBNb2RlID0gTW9kZTtcblxuICAgIEBwcm9wZXJ0eVxuICAgIF9tb2RlID0gTW9kZS5Db2xvcjtcbiAgICAvKipcbiAgICAgKiAhI2VuIEdyYWRpZW50IHR5cGUuXG4gICAgICogISN6aCDmuJDlj5joibLnsbvlnovjgIJcbiAgICAgKiBAcHJvcGVydHkge01vZGV9IG1vZGVcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBNb2RlLFxuICAgIH0pXG4gICAgZ2V0IG1vZGUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbW9kZTtcbiAgICB9XG5cbiAgICBzZXQgbW9kZSAobSkge1xuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICBpZiAobSA9PT0gTW9kZS5SYW5kb21Db2xvcikge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdyYWRpZW50LmNvbG9yS2V5cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmFkaWVudC5jb2xvcktleXMucHVzaChuZXcgQ29sb3JLZXkoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdyYWRpZW50LmFscGhhS2V5cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmFkaWVudC5hbHBoYUtleXMucHVzaChuZXcgQWxwaGFLZXkoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21vZGUgPSBtO1xuICAgIH1cblxuICAgIEBwcm9wZXJ0eVxuICAgIF9jb2xvciA9IGNjLkNvbG9yLldISVRFLmNsb25lKCk7XG4gICAgLyoqIFxuICAgICAqICEjZW4gVGhlIGNvbG9yIHdoZW4gbW9kZSBpcyBDb2xvci5cbiAgICAgKiAhI3poIOW9kyBtb2RlIOS4uiBDb2xvciDml7bnmoTpopzoibLjgIJcbiAgICAgKiBAcHJvcGVydHkge0NvbG9yfSBjb2xvclxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGNvbG9yID0gY2MuQ29sb3IuV0hJVEUuY2xvbmUoKTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gTG93ZXIgY29sb3IgbGltaXQgd2hlbiBtb2RlIGlzIFR3b0NvbG9ycy5cbiAgICAgKiAhI3poIOW9kyBtb2RlIOS4uiBUd29Db2xvcnMg5pe255qE6aKc6Imy5LiL6ZmQ44CCXG4gICAgICogQHByb3BlcnR5IHtDb2xvcn0gY29sb3JNaW5cbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBjb2xvck1pbiA9IGNjLkNvbG9yLldISVRFLmNsb25lKCk7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFVwcGVyIGNvbG9yIGxpbWl0IHdoZW4gbW9kZSBpcyBUd29Db2xvcnMuXG4gICAgICogISN6aCDlvZMgbW9kZSDkuLogVHdvQ29sb3JzIOaXtueahOminOiJsuS4iumZkOOAglxuICAgICAqIEBwcm9wZXJ0eSB7Q29sb3J9IGNvbG9yTWF4XG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgY29sb3JNYXggPSBjYy5Db2xvci5XSElURS5jbG9uZSgpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBDb2xvciBncmFkaWVudCB3aGVuIG1vZGUgaXMgR3JhZGllbnRcbiAgICAgKiAhI3poIOW9kyBtb2RlIOS4uiBHcmFkaWVudCDml7bnmoTpopzoibLmuJDlj5jjgIJcbiAgICAgKiBAcHJvcGVydHkge0dyYWRpZW50fSBncmFkaWVudFxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IEdyYWRpZW50LFxuICAgIH0pXG4gICAgZ3JhZGllbnQgPSBuZXcgR3JhZGllbnQoKTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gTG93ZXIgY29sb3IgZ3JhZGllbnQgbGltaXQgd2hlbiBtb2RlIGlzIFR3b0dyYWRpZW50cy5cbiAgICAgKiAhI3poIOW9kyBtb2RlIOS4uiBUd29HcmFkaWVudHMg5pe255qE6aKc6Imy5riQ5Y+Y5LiL6ZmQ44CCXG4gICAgICogQHByb3BlcnR5IHtHcmFkaWVudH0gZ3JhZGllbnRNaW5cbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBHcmFkaWVudCxcbiAgICB9KVxuICAgIGdyYWRpZW50TWluID0gbmV3IEdyYWRpZW50KCk7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFVwcGVyIGNvbG9yIGdyYWRpZW50IGxpbWl0IHdoZW4gbW9kZSBpcyBUd29HcmFkaWVudHMuXG4gICAgICogISN6aCDlvZMgbW9kZSDkuLogVHdvR3JhZGllbnRzIOaXtueahOminOiJsua4kOWPmOS4iumZkOOAglxuICAgICAqIEBwcm9wZXJ0eSB7R3JhZGllbnR9IGdyYWRpZW50TWF4XG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogR3JhZGllbnQsXG4gICAgfSlcbiAgICBncmFkaWVudE1heCA9IG5ldyBHcmFkaWVudCgpO1xuXG4gICAgZXZhbHVhdGUgKHRpbWUsIHJuZFJhdGlvKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5fbW9kZSkge1xuICAgICAgICAgICAgY2FzZSBNb2RlLkNvbG9yOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbG9yO1xuICAgICAgICAgICAgY2FzZSBNb2RlLlR3b0NvbG9yczpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbG9yTWluLmxlcnAodGhpcy5jb2xvck1heCwgcm5kUmF0aW8sIHRoaXMuX2NvbG9yKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29sb3I7XG4gICAgICAgICAgICBjYXNlIE1vZGUuUmFuZG9tQ29sb3I6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ3JhZGllbnQucmFuZG9tQ29sb3IoKTtcbiAgICAgICAgICAgIGNhc2UgTW9kZS5HcmFkaWVudDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ncmFkaWVudC5ldmFsdWF0ZSh0aW1lKTtcbiAgICAgICAgICAgIGNhc2UgTW9kZS5Ud29HcmFkaWVudHM6XG4gICAgICAgICAgICAgICAgdGhpcy5ncmFkaWVudE1pbi5ldmFsdWF0ZSh0aW1lKS5sZXJwKHRoaXMuZ3JhZGllbnRNYXguZXZhbHVhdGUodGltZSksIHJuZFJhdGlvLCB0aGlzLl9jb2xvcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbG9yO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb2xvcjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQ0NfRURJVE9SICYmIChHcmFkaWVudFJhbmdlLnByb3RvdHlwZS5fb25CZWZvcmVTZXJpYWxpemUgPSBmdW5jdGlvbihwcm9wcyl7cmV0dXJuIFNlcmlhbGl6YWJsZVRhYmxlW3RoaXMuX21vZGVdO30pO1xuXG5jYy5HcmFkaWVudFJhbmdlID0gR3JhZGllbnRSYW5nZTtcbiJdLCJzb3VyY2VSb290IjoiLyJ9