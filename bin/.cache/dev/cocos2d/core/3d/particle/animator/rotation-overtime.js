
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/particle/animator/rotation-overtime.js';
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

var _curveRange = _interopRequireDefault(require("./curve-range"));

var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

// tslint:disable: max-line-length
var ROTATION_OVERTIME_RAND_OFFSET = 125292;
/**
 * !#en The rotation module of 3d particle.
 * !#zh 3D 粒子的旋转模块
 * @class RotationOvertimeModule
 */

var RotationOvertimeModule = (_dec = (0, _CCClassDecorator.ccclass)('cc.RotationOvertimeModule'), _dec2 = (0, _CCClassDecorator.property)({
  type: _curveRange["default"],
  range: [-1, 1],
  radian: true
}), _dec3 = (0, _CCClassDecorator.property)({
  type: _curveRange["default"],
  range: [-1, 1],
  radian: true
}), _dec4 = (0, _CCClassDecorator.property)({
  type: _curveRange["default"],
  range: [-1, 1],
  radian: true
}), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
  function RotationOvertimeModule() {
    _initializerDefineProperty(this, "enable", _descriptor, this);

    _initializerDefineProperty(this, "_separateAxes", _descriptor2, this);

    _initializerDefineProperty(this, "x", _descriptor3, this);

    _initializerDefineProperty(this, "y", _descriptor4, this);

    _initializerDefineProperty(this, "z", _descriptor5, this);
  }

  var _proto = RotationOvertimeModule.prototype;

  _proto.animate = function animate(p, dt) {
    var normalizedTime = 1 - p.remainingLifetime / p.startLifetime;

    if (!this._separateAxes) {
      p.rotation.x += this.z.evaluate(normalizedTime, (0, _valueTypes.pseudoRandom)(p.randomSeed + ROTATION_OVERTIME_RAND_OFFSET)) * dt;
    } else {
      // TODO: separateAxes is temporarily not supported!
      var rotationRand = (0, _valueTypes.pseudoRandom)(p.randomSeed + ROTATION_OVERTIME_RAND_OFFSET);
      p.rotation.x += this.x.evaluate(normalizedTime, rotationRand) * dt;
      p.rotation.y += this.y.evaluate(normalizedTime, rotationRand) * dt;
      p.rotation.z += this.z.evaluate(normalizedTime, rotationRand) * dt;
    }
  };

  _createClass(RotationOvertimeModule, [{
    key: "separateAxes",
    get:
    /**
     * !#en The enable of RotationOvertimeModule.
     * !#zh 是否启用
     * @property {Boolean} enable
     */

    /**
     * !#en Whether to set the rotation of three axes separately (not currently supported)
     * !#zh 是否三个轴分开设定旋转（暂不支持）。
     * @property {Boolean} separateAxes
     */
    function get() {
      return this._separateAxes;
    },
    set: function set(val) {
      if (!val) {
        this._separateAxes = val;
      } else {
        console.error('rotation overtime separateAxes is not supported!');
      }
    }
    /**
     * !#en Set rotation around X axis.
     * !#zh 绕 X 轴设定旋转。
     * @property {CurveRange} x
     */

  }]);

  return RotationOvertimeModule;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "enable", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_separateAxes", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "separateAxes", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "separateAxes"), _class2.prototype), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "x", [_dec2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "y", [_dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "z", [_dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
})), _class2)) || _class);
exports["default"] = RotationOvertimeModule;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BhcnRpY2xlL2FuaW1hdG9yL3JvdGF0aW9uLW92ZXJ0aW1lLnRzIl0sIm5hbWVzIjpbIlJPVEFUSU9OX09WRVJUSU1FX1JBTkRfT0ZGU0VUIiwiUm90YXRpb25PdmVydGltZU1vZHVsZSIsInR5cGUiLCJDdXJ2ZVJhbmdlIiwicmFuZ2UiLCJyYWRpYW4iLCJhbmltYXRlIiwicCIsImR0Iiwibm9ybWFsaXplZFRpbWUiLCJyZW1haW5pbmdMaWZldGltZSIsInN0YXJ0TGlmZXRpbWUiLCJfc2VwYXJhdGVBeGVzIiwicm90YXRpb24iLCJ4IiwieiIsImV2YWx1YXRlIiwicmFuZG9tU2VlZCIsInJvdGF0aW9uUmFuZCIsInkiLCJ2YWwiLCJjb25zb2xlIiwiZXJyb3IiLCJwcm9wZXJ0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7QUFDQSxJQUFNQSw2QkFBNkIsR0FBRyxNQUF0QztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0lBRXFCQyxpQ0FEcEIsK0JBQVEsMkJBQVIsV0FzQ0ksZ0NBQVM7QUFDTkMsRUFBQUEsSUFBSSxFQUFFQyxzQkFEQTtBQUVOQyxFQUFBQSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUYsRUFBSyxDQUFMLENBRkQ7QUFHTkMsRUFBQUEsTUFBTSxFQUFFO0FBSEYsQ0FBVCxXQVlBLGdDQUFTO0FBQ05ILEVBQUFBLElBQUksRUFBRUMsc0JBREE7QUFFTkMsRUFBQUEsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFGLEVBQUssQ0FBTCxDQUZEO0FBR05DLEVBQUFBLE1BQU0sRUFBRTtBQUhGLENBQVQsV0FZQSxnQ0FBUztBQUNOSCxFQUFBQSxJQUFJLEVBQUVDLHNCQURBO0FBRU5DLEVBQUFBLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBRixFQUFLLENBQUwsQ0FGRDtBQUdOQyxFQUFBQSxNQUFNLEVBQUU7QUFIRixDQUFUO0FBT0Qsb0NBQWU7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTtBQUVkOzs7O1NBRURDLFVBQUEsaUJBQVNDLENBQVQsRUFBWUMsRUFBWixFQUFnQjtBQUNaLFFBQU1DLGNBQWMsR0FBRyxJQUFJRixDQUFDLENBQUNHLGlCQUFGLEdBQXNCSCxDQUFDLENBQUNJLGFBQW5EOztBQUNBLFFBQUksQ0FBQyxLQUFLQyxhQUFWLEVBQXlCO0FBQ3JCTCxNQUFBQSxDQUFDLENBQUNNLFFBQUYsQ0FBV0MsQ0FBWCxJQUFnQixLQUFLQyxDQUFMLENBQU9DLFFBQVAsQ0FBZ0JQLGNBQWhCLEVBQWdDLDhCQUFhRixDQUFDLENBQUNVLFVBQUYsR0FBZWpCLDZCQUE1QixDQUFoQyxJQUE4RlEsRUFBOUc7QUFDSCxLQUZELE1BR0s7QUFDRDtBQUNBLFVBQU1VLFlBQVksR0FBRyw4QkFBYVgsQ0FBQyxDQUFDVSxVQUFGLEdBQWVqQiw2QkFBNUIsQ0FBckI7QUFDQU8sTUFBQUEsQ0FBQyxDQUFDTSxRQUFGLENBQVdDLENBQVgsSUFBZ0IsS0FBS0EsQ0FBTCxDQUFPRSxRQUFQLENBQWdCUCxjQUFoQixFQUFnQ1MsWUFBaEMsSUFBZ0RWLEVBQWhFO0FBQ0FELE1BQUFBLENBQUMsQ0FBQ00sUUFBRixDQUFXTSxDQUFYLElBQWdCLEtBQUtBLENBQUwsQ0FBT0gsUUFBUCxDQUFnQlAsY0FBaEIsRUFBZ0NTLFlBQWhDLElBQWdEVixFQUFoRTtBQUNBRCxNQUFBQSxDQUFDLENBQUNNLFFBQUYsQ0FBV0UsQ0FBWCxJQUFnQixLQUFLQSxDQUFMLENBQU9DLFFBQVAsQ0FBZ0JQLGNBQWhCLEVBQWdDUyxZQUFoQyxJQUFnRFYsRUFBaEU7QUFDSDtBQUNKOzs7OztBQWxGRDtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQU9JO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSSxtQkFDb0I7QUFDaEIsYUFBTyxLQUFLSSxhQUFaO0FBQ0g7U0FFRCxhQUFrQlEsR0FBbEIsRUFBdUI7QUFDbkIsVUFBSSxDQUFDQSxHQUFMLEVBQVU7QUFDTixhQUFLUixhQUFMLEdBQXFCUSxHQUFyQjtBQUNILE9BRkQsTUFHSztBQUNEQyxRQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYyxrREFBZDtBQUNIO0FBQ0o7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBOzs7OztvRkE3QktDOzs7OztXQUNROztrRkFFUkE7Ozs7O1dBQ2U7O2tFQU9mQTs7Ozs7V0F3QkcsSUFBSXBCLHNCQUFKOzs7Ozs7O1dBWUEsSUFBSUEsc0JBQUo7Ozs7Ozs7V0FZQSxJQUFJQSxzQkFBSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNjY2xhc3MsIHByb3BlcnR5IH0gZnJvbSAnLi4vLi4vLi4vcGxhdGZvcm0vQ0NDbGFzc0RlY29yYXRvcic7XG5pbXBvcnQgeyBwc2V1ZG9SYW5kb20gfSBmcm9tICcuLi8uLi8uLi92YWx1ZS10eXBlcyc7XG5pbXBvcnQgQ3VydmVSYW5nZSBmcm9tICcuL2N1cnZlLXJhbmdlJztcblxuLy8gdHNsaW50OmRpc2FibGU6IG1heC1saW5lLWxlbmd0aFxuY29uc3QgUk9UQVRJT05fT1ZFUlRJTUVfUkFORF9PRkZTRVQgPSAxMjUyOTI7XG5cbi8qKlxuICogISNlbiBUaGUgcm90YXRpb24gbW9kdWxlIG9mIDNkIHBhcnRpY2xlLlxuICogISN6aCAzRCDnspLlrZDnmoTml4vovazmqKHlnZdcbiAqIEBjbGFzcyBSb3RhdGlvbk92ZXJ0aW1lTW9kdWxlXG4gKi9cbkBjY2NsYXNzKCdjYy5Sb3RhdGlvbk92ZXJ0aW1lTW9kdWxlJylcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvdGF0aW9uT3ZlcnRpbWVNb2R1bGUge1xuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZW5hYmxlIG9mIFJvdGF0aW9uT3ZlcnRpbWVNb2R1bGUuXG4gICAgICogISN6aCDmmK/lkKblkK/nlKhcbiAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGVuYWJsZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGVuYWJsZSA9IGZhbHNlO1xuXG4gICAgQHByb3BlcnR5XG4gICAgX3NlcGFyYXRlQXhlcyA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBXaGV0aGVyIHRvIHNldCB0aGUgcm90YXRpb24gb2YgdGhyZWUgYXhlcyBzZXBhcmF0ZWx5IChub3QgY3VycmVudGx5IHN1cHBvcnRlZClcbiAgICAgKiAhI3poIOaYr+WQpuS4ieS4qui9tOWIhuW8gOiuvuWumuaXi+i9rO+8iOaaguS4jeaUr+aMge+8ieOAglxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gc2VwYXJhdGVBeGVzXG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgZ2V0IHNlcGFyYXRlQXhlcyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZXBhcmF0ZUF4ZXM7XG4gICAgfVxuXG4gICAgc2V0IHNlcGFyYXRlQXhlcyAodmFsKSB7XG4gICAgICAgIGlmICghdmFsKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXBhcmF0ZUF4ZXMgPSB2YWw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdyb3RhdGlvbiBvdmVydGltZSBzZXBhcmF0ZUF4ZXMgaXMgbm90IHN1cHBvcnRlZCEnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHJvdGF0aW9uIGFyb3VuZCBYIGF4aXMuXG4gICAgICogISN6aCDnu5UgWCDovbTorr7lrprml4vovazjgIJcbiAgICAgKiBAcHJvcGVydHkge0N1cnZlUmFuZ2V9IHhcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBDdXJ2ZVJhbmdlLFxuICAgICAgICByYW5nZTogWy0xLCAxXSxcbiAgICAgICAgcmFkaWFuOiB0cnVlLFxuICAgIH0pXG4gICAgeCA9IG5ldyBDdXJ2ZVJhbmdlKCk7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCByb3RhdGlvbiBhcm91bmQgWSBheGlzLlxuICAgICAqICEjemgg57uVIFkg6L206K6+5a6a5peL6L2s44CCXG4gICAgICogQHByb3BlcnR5IHtDdXJ2ZVJhbmdlfSB5XG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogQ3VydmVSYW5nZSxcbiAgICAgICAgcmFuZ2U6IFstMSwgMV0sXG4gICAgICAgIHJhZGlhbjogdHJ1ZSxcbiAgICB9KVxuICAgIHkgPSBuZXcgQ3VydmVSYW5nZSgpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgcm90YXRpb24gYXJvdW5kIFogYXhpcy5cbiAgICAgKiAhI3poIOe7lSBaIOi9tOiuvuWumuaXi+i9rOOAglxuICAgICAqIEBwcm9wZXJ0eSB7Q3VydmVSYW5nZX0gelxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IEN1cnZlUmFuZ2UsXG4gICAgICAgIHJhbmdlOiBbLTEsIDFdLFxuICAgICAgICByYWRpYW46IHRydWUsXG4gICAgfSlcbiAgICB6ID0gbmV3IEN1cnZlUmFuZ2UoKTtcblxuICAgIGNvbnN0cnVjdG9yICgpIHtcblxuICAgIH1cblxuICAgIGFuaW1hdGUgKHAsIGR0KSB7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRUaW1lID0gMSAtIHAucmVtYWluaW5nTGlmZXRpbWUgLyBwLnN0YXJ0TGlmZXRpbWU7XG4gICAgICAgIGlmICghdGhpcy5fc2VwYXJhdGVBeGVzKSB7XG4gICAgICAgICAgICBwLnJvdGF0aW9uLnggKz0gdGhpcy56LmV2YWx1YXRlKG5vcm1hbGl6ZWRUaW1lLCBwc2V1ZG9SYW5kb20ocC5yYW5kb21TZWVkICsgUk9UQVRJT05fT1ZFUlRJTUVfUkFORF9PRkZTRVQpKSAqIGR0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gVE9ETzogc2VwYXJhdGVBeGVzIGlzIHRlbXBvcmFyaWx5IG5vdCBzdXBwb3J0ZWQhXG4gICAgICAgICAgICBjb25zdCByb3RhdGlvblJhbmQgPSBwc2V1ZG9SYW5kb20ocC5yYW5kb21TZWVkICsgUk9UQVRJT05fT1ZFUlRJTUVfUkFORF9PRkZTRVQpO1xuICAgICAgICAgICAgcC5yb3RhdGlvbi54ICs9IHRoaXMueC5ldmFsdWF0ZShub3JtYWxpemVkVGltZSwgcm90YXRpb25SYW5kKSAqIGR0O1xuICAgICAgICAgICAgcC5yb3RhdGlvbi55ICs9IHRoaXMueS5ldmFsdWF0ZShub3JtYWxpemVkVGltZSwgcm90YXRpb25SYW5kKSAqIGR0O1xuICAgICAgICAgICAgcC5yb3RhdGlvbi56ICs9IHRoaXMuei5ldmFsdWF0ZShub3JtYWxpemVkVGltZSwgcm90YXRpb25SYW5kKSAqIGR0O1xuICAgICAgICB9XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvIn0=