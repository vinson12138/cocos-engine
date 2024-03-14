
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/particle/animator/size-overtime.js';
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

var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

// tslint:disable: max-line-length
var SIZE_OVERTIME_RAND_OFFSET = 39825;
/**
 * !#en The size module of 3d particle.
 * !#zh 3D 粒子的大小模块
 * @class SizeOvertimeModule
 */

var SizeOvertimeModule = (_dec = (0, _CCClassDecorator.ccclass)('cc.SizeOvertimeModule'), _dec2 = (0, _CCClassDecorator.property)({
  type: _curveRange["default"]
}), _dec3 = (0, _CCClassDecorator.property)({
  type: _curveRange["default"]
}), _dec4 = (0, _CCClassDecorator.property)({
  type: _curveRange["default"]
}), _dec5 = (0, _CCClassDecorator.property)({
  type: _curveRange["default"]
}), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
  function SizeOvertimeModule() {
    _initializerDefineProperty(this, "enable", _descriptor, this);

    _initializerDefineProperty(this, "separateAxes", _descriptor2, this);

    _initializerDefineProperty(this, "size", _descriptor3, this);

    _initializerDefineProperty(this, "x", _descriptor4, this);

    _initializerDefineProperty(this, "y", _descriptor5, this);

    _initializerDefineProperty(this, "z", _descriptor6, this);
  }

  var _proto = SizeOvertimeModule.prototype;

  _proto.animate = function animate(particle) {
    if (!this.separateAxes) {
      _valueTypes.Vec3.scale(particle.size, particle.startSize, this.size.evaluate(1 - particle.remainingLifetime / particle.startLifetime, (0, _valueTypes.pseudoRandom)(particle.randomSeed + SIZE_OVERTIME_RAND_OFFSET)));
    } else {
      var currLifetime = 1 - particle.remainingLifetime / particle.startLifetime;
      var sizeRand = (0, _valueTypes.pseudoRandom)(particle.randomSeed + SIZE_OVERTIME_RAND_OFFSET);
      particle.size.x = particle.startSize.x * this.x.evaluate(currLifetime, sizeRand);
      particle.size.y = particle.startSize.y * this.y.evaluate(currLifetime, sizeRand);
      particle.size.z = particle.startSize.z * this.z.evaluate(currLifetime, sizeRand);
    }
  };

  return SizeOvertimeModule;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "enable", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "separateAxes", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "size", [_dec2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "x", [_dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "y", [_dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "z", [_dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
})), _class2)) || _class);
exports["default"] = SizeOvertimeModule;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BhcnRpY2xlL2FuaW1hdG9yL3NpemUtb3ZlcnRpbWUudHMiXSwibmFtZXMiOlsiU0laRV9PVkVSVElNRV9SQU5EX09GRlNFVCIsIlNpemVPdmVydGltZU1vZHVsZSIsInR5cGUiLCJDdXJ2ZVJhbmdlIiwiYW5pbWF0ZSIsInBhcnRpY2xlIiwic2VwYXJhdGVBeGVzIiwiVmVjMyIsInNjYWxlIiwic2l6ZSIsInN0YXJ0U2l6ZSIsImV2YWx1YXRlIiwicmVtYWluaW5nTGlmZXRpbWUiLCJzdGFydExpZmV0aW1lIiwicmFuZG9tU2VlZCIsImN1cnJMaWZldGltZSIsInNpemVSYW5kIiwieCIsInkiLCJ6IiwicHJvcGVydHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7QUFDQSxJQUFNQSx5QkFBeUIsR0FBRyxLQUFsQztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0lBRXFCQyw2QkFEcEIsK0JBQVEsdUJBQVIsV0F3QkksZ0NBQVM7QUFDTkMsRUFBQUEsSUFBSSxFQUFFQztBQURBLENBQVQsV0FVQSxnQ0FBUztBQUNORCxFQUFBQSxJQUFJLEVBQUVDO0FBREEsQ0FBVCxXQVVBLGdDQUFTO0FBQ05ELEVBQUFBLElBQUksRUFBRUM7QUFEQSxDQUFULFdBVUEsZ0NBQVM7QUFDTkQsRUFBQUEsSUFBSSxFQUFFQztBQURBLENBQVQ7Ozs7Ozs7Ozs7Ozs7Ozs7O1NBS0RDLFVBQUEsaUJBQVNDLFFBQVQsRUFBbUI7QUFDZixRQUFJLENBQUMsS0FBS0MsWUFBVixFQUF3QjtBQUNwQkMsdUJBQUtDLEtBQUwsQ0FBV0gsUUFBUSxDQUFDSSxJQUFwQixFQUEwQkosUUFBUSxDQUFDSyxTQUFuQyxFQUE4QyxLQUFLRCxJQUFMLENBQVVFLFFBQVYsQ0FBbUIsSUFBSU4sUUFBUSxDQUFDTyxpQkFBVCxHQUE2QlAsUUFBUSxDQUFDUSxhQUE3RCxFQUE0RSw4QkFBYVIsUUFBUSxDQUFDUyxVQUFULEdBQXNCZCx5QkFBbkMsQ0FBNUUsQ0FBOUM7QUFDSCxLQUZELE1BRU87QUFDSCxVQUFNZSxZQUFZLEdBQUcsSUFBSVYsUUFBUSxDQUFDTyxpQkFBVCxHQUE2QlAsUUFBUSxDQUFDUSxhQUEvRDtBQUNBLFVBQU1HLFFBQVEsR0FBRyw4QkFBYVgsUUFBUSxDQUFDUyxVQUFULEdBQXNCZCx5QkFBbkMsQ0FBakI7QUFDQUssTUFBQUEsUUFBUSxDQUFDSSxJQUFULENBQWNRLENBQWQsR0FBa0JaLFFBQVEsQ0FBQ0ssU0FBVCxDQUFtQk8sQ0FBbkIsR0FBdUIsS0FBS0EsQ0FBTCxDQUFPTixRQUFQLENBQWdCSSxZQUFoQixFQUE4QkMsUUFBOUIsQ0FBekM7QUFDQVgsTUFBQUEsUUFBUSxDQUFDSSxJQUFULENBQWNTLENBQWQsR0FBa0JiLFFBQVEsQ0FBQ0ssU0FBVCxDQUFtQlEsQ0FBbkIsR0FBdUIsS0FBS0EsQ0FBTCxDQUFPUCxRQUFQLENBQWdCSSxZQUFoQixFQUE4QkMsUUFBOUIsQ0FBekM7QUFDQVgsTUFBQUEsUUFBUSxDQUFDSSxJQUFULENBQWNVLENBQWQsR0FBa0JkLFFBQVEsQ0FBQ0ssU0FBVCxDQUFtQlMsQ0FBbkIsR0FBdUIsS0FBS0EsQ0FBTCxDQUFPUixRQUFQLENBQWdCSSxZQUFoQixFQUE4QkMsUUFBOUIsQ0FBekM7QUFDSDtBQUNKOzs7b0ZBN0RBSTs7Ozs7V0FDUTs7aUZBT1JBOzs7OztXQUNjOzs7Ozs7O1dBVVIsSUFBSWpCLHNCQUFKOzs7Ozs7O1dBVUgsSUFBSUEsc0JBQUo7Ozs7Ozs7V0FVQSxJQUFJQSxzQkFBSjs7Ozs7OztXQVVBLElBQUlBLHNCQUFKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2NjbGFzcywgcHJvcGVydHkgfSBmcm9tICcuLi8uLi8uLi9wbGF0Zm9ybS9DQ0NsYXNzRGVjb3JhdG9yJztcbmltcG9ydCB7IHBzZXVkb1JhbmRvbSwgVmVjMyB9IGZyb20gJy4uLy4uLy4uL3ZhbHVlLXR5cGVzJztcbmltcG9ydCBDdXJ2ZVJhbmdlIGZyb20gJy4vY3VydmUtcmFuZ2UnO1xuXG4vLyB0c2xpbnQ6ZGlzYWJsZTogbWF4LWxpbmUtbGVuZ3RoXG5jb25zdCBTSVpFX09WRVJUSU1FX1JBTkRfT0ZGU0VUID0gMzk4MjU7XG5cbi8qKlxuICogISNlbiBUaGUgc2l6ZSBtb2R1bGUgb2YgM2QgcGFydGljbGUuXG4gKiAhI3poIDNEIOeykuWtkOeahOWkp+Wwj+aooeWdl1xuICogQGNsYXNzIFNpemVPdmVydGltZU1vZHVsZVxuICovXG5AY2NjbGFzcygnY2MuU2l6ZU92ZXJ0aW1lTW9kdWxlJylcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpemVPdmVydGltZU1vZHVsZSB7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBlbmFibGUgb2YgU2l6ZU92ZXJ0aW1lTW9kdWxlLlxuICAgICAqICEjemgg5piv5ZCm5ZCv55SoXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBlbmFibGVcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBlbmFibGUgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gRGVjaWRlIHdoZXRoZXIgdG8gY29udHJvbCBwYXJ0aWNsZSBzaXplIGluZGVwZW5kZW50bHkgb24gZWFjaCBheGlzLlxuICAgICAqICEjemgg5Yaz5a6a5piv5ZCm5Zyo5q+P5Liq6L205LiK54us56uL5o6n5Yi257KS5a2Q5aSn5bCP44CCXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBzZXBhcmF0ZUF4ZXNcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBzZXBhcmF0ZUF4ZXMgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gRGVmaW5lIGEgY3VydmUgdG8gZGV0ZXJtaW5lIHRoZSBzaXplIGNoYW5nZSBvZiBwYXJ0aWNsZXMgZHVyaW5nIHRoZWlyIGxpZmUgY3ljbGUuXG4gICAgICogISN6aCDlrprkuYnkuIDmnaHmm7Lnur/mnaXlhrPlrprnspLlrZDlnKjlhbbnlJ/lkb3lkajmnJ/kuK3nmoTlpKflsI/lj5jljJbjgIJcbiAgICAgKiBAcHJvcGVydHkge0N1cnZlUmFuZ2V9IHNpemVcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBDdXJ2ZVJhbmdlLFxuICAgIH0pXG4gICAgc2l6ZSA9IG5ldyBDdXJ2ZVJhbmdlKCk7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIERlZmluZXMgYSBjdXJ2ZSB0byBkZXRlcm1pbmUgdGhlIHNpemUgY2hhbmdlIG9mIHBhcnRpY2xlcyBpbiB0aGUgWC1heGlzIGRpcmVjdGlvbiBkdXJpbmcgdGhlaXIgbGlmZSBjeWNsZS5cbiAgICAgKiAhI3poIOWumuS5ieS4gOadoeabsue6v+adpeWGs+WumueykuWtkOWcqOWFtueUn+WRveWRqOacn+S4rSBYIOi9tOaWueWQkeS4iueahOWkp+Wwj+WPmOWMluOAglxuICAgICAqIEBwcm9wZXJ0eSB7Q3VydmVSYW5nZX0geFxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IEN1cnZlUmFuZ2UsXG4gICAgfSlcbiAgICB4ID0gbmV3IEN1cnZlUmFuZ2UoKTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gRGVmaW5lcyBhIGN1cnZlIHRvIGRldGVybWluZSB0aGUgc2l6ZSBjaGFuZ2Ugb2YgcGFydGljbGVzIGluIHRoZSBZLWF4aXMgZGlyZWN0aW9uIGR1cmluZyB0aGVpciBsaWZlIGN5Y2xlLlxuICAgICAqICEjemgg5a6a5LmJ5LiA5p2h5puy57q/5p2l5Yaz5a6a57KS5a2Q5Zyo5YW255Sf5ZG95ZGo5pyf5LitIFkg6L205pa55ZCR5LiK55qE5aSn5bCP5Y+Y5YyW44CCXG4gICAgICogQHByb3BlcnR5IHtDdXJ2ZVJhbmdlfSB5XG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogQ3VydmVSYW5nZSxcbiAgICB9KVxuICAgIHkgPSBuZXcgQ3VydmVSYW5nZSgpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBEZWZpbmVzIGEgY3VydmUgdG8gZGV0ZXJtaW5lIHRoZSBzaXplIGNoYW5nZSBvZiBwYXJ0aWNsZXMgaW4gdGhlIFotYXhpcyBkaXJlY3Rpb24gZHVyaW5nIHRoZWlyIGxpZmUgY3ljbGUuXG4gICAgICogISN6aCDlrprkuYnkuIDmnaHmm7Lnur/mnaXlhrPlrprnspLlrZDlnKjlhbbnlJ/lkb3lkajmnJ/kuK0gWiDovbTmlrnlkJHkuIrnmoTlpKflsI/lj5jljJbjgIJcbiAgICAgKiBAcHJvcGVydHkge0N1cnZlUmFuZ2V9IHpcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBDdXJ2ZVJhbmdlLFxuICAgIH0pXG4gICAgeiA9IG5ldyBDdXJ2ZVJhbmdlKCk7XG5cbiAgICBhbmltYXRlIChwYXJ0aWNsZSkge1xuICAgICAgICBpZiAoIXRoaXMuc2VwYXJhdGVBeGVzKSB7XG4gICAgICAgICAgICBWZWMzLnNjYWxlKHBhcnRpY2xlLnNpemUsIHBhcnRpY2xlLnN0YXJ0U2l6ZSwgdGhpcy5zaXplLmV2YWx1YXRlKDEgLSBwYXJ0aWNsZS5yZW1haW5pbmdMaWZldGltZSAvIHBhcnRpY2xlLnN0YXJ0TGlmZXRpbWUsIHBzZXVkb1JhbmRvbShwYXJ0aWNsZS5yYW5kb21TZWVkICsgU0laRV9PVkVSVElNRV9SQU5EX09GRlNFVCkpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJMaWZldGltZSA9IDEgLSBwYXJ0aWNsZS5yZW1haW5pbmdMaWZldGltZSAvIHBhcnRpY2xlLnN0YXJ0TGlmZXRpbWU7XG4gICAgICAgICAgICBjb25zdCBzaXplUmFuZCA9IHBzZXVkb1JhbmRvbShwYXJ0aWNsZS5yYW5kb21TZWVkICsgU0laRV9PVkVSVElNRV9SQU5EX09GRlNFVCk7XG4gICAgICAgICAgICBwYXJ0aWNsZS5zaXplLnggPSBwYXJ0aWNsZS5zdGFydFNpemUueCAqIHRoaXMueC5ldmFsdWF0ZShjdXJyTGlmZXRpbWUsIHNpemVSYW5kKTtcbiAgICAgICAgICAgIHBhcnRpY2xlLnNpemUueSA9IHBhcnRpY2xlLnN0YXJ0U2l6ZS55ICogdGhpcy55LmV2YWx1YXRlKGN1cnJMaWZldGltZSwgc2l6ZVJhbmQpO1xuICAgICAgICAgICAgcGFydGljbGUuc2l6ZS56ID0gcGFydGljbGUuc3RhcnRTaXplLnogKiB0aGlzLnouZXZhbHVhdGUoY3VyckxpZmV0aW1lLCBzaXplUmFuZCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==