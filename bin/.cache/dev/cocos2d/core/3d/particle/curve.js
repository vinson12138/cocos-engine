
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/particle/curve.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.evalOptCurve = evalOptCurve;
exports.AnimationCurve = exports.OptimizedKey = exports.Keyframe = void 0;

var _CCEnum = _interopRequireDefault(require("../../platform/CCEnum"));

var _valueTypes = require("../../value-types");

var _CCClassDecorator = require("../../platform/CCClassDecorator");

var _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp, _dec2, _dec3, _dec4, _dec5, _class4, _class5, _descriptor5, _descriptor6, _descriptor7, _temp2;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

var LOOK_FORWARD = 3;
/**
 * !#en The wrap mode
 * !#zh 循环模式
 * @static
 * @enum AnimationCurve.WrapMode
 */

var WrapMode = (0, _CCEnum["default"])({
  /**
   * !#en Default
   * !#zh 默认模式
   * @property Default
   * @readonly
   * @type {Number}
   */
  Default: 0,

  /**
   * !#en Once Mode
   * !#zh Once 模式
   * @property Once
   * @readonly
   * @type {Number}
   */
  Once: 1,

  /**
   * !#en Loop Mode
   * !#zh Loop 模式
   * @property Loop
   * @readonly
   * @type {Number}
   */
  Loop: 2,

  /**
   * !#en PingPong Mode
   * !#zh PingPong 模式
   * @property PingPong
   * @readonly
   * @type {Number}
   */
  PingPong: 3,

  /**
   * !#en ClampForever Mode
   * !#zh ClampForever 模式
   * @property ClampForever
   * @readonly
   * @type {Number}
   */
  ClampForever: 4
});
var Keyframe = (_dec = (0, _CCClassDecorator.ccclass)('cc.Keyframe'), _dec(_class = (_class2 = (_temp =
/**
 * !#en Time.
 * !#zh 时间。
 * @property {Number} time
 */

/**
 * !#en Key value.
 * !#zh 关键值。
 * @property {Number} value
 */

/**
 * !#en In tangent value.
 * !#zh 左切值。
 * @property {Number} inTangent
 */

/**
 * !#en Out tangent value.
 * !#zh 右切值。
 * @property {Number} outTangent
 */
function Keyframe(time, value, inTangent, outTangent) {
  _initializerDefineProperty(this, "time", _descriptor, this);

  _initializerDefineProperty(this, "value", _descriptor2, this);

  _initializerDefineProperty(this, "inTangent", _descriptor3, this);

  _initializerDefineProperty(this, "outTangent", _descriptor4, this);

  this.time = time || 0;
  this.value = value || 0;
  this.inTangent = inTangent || 0;
  this.outTangent = outTangent || 0;
}, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "time", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "value", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "inTangent", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "outTangent", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
})), _class2)) || _class);
exports.Keyframe = Keyframe;

var OptimizedKey = /*#__PURE__*/function () {
  function OptimizedKey() {
    this.index = 0;
    this.time = 0;
    this.endTime = 0;
    this.coefficient = null;
    this.index = -1;
    this.time = 0;
    this.endTime = 0;
    this.coefficient = new Float32Array(4);
  }

  var _proto = OptimizedKey.prototype;

  _proto.evaluate = function evaluate(T) {
    var t = T - this.time;
    return evalOptCurve(t, this.coefficient);
  };

  return OptimizedKey;
}();

exports.OptimizedKey = OptimizedKey;

function evalOptCurve(t, coefs) {
  return t * (t * (t * coefs[0] + coefs[1]) + coefs[2]) + coefs[3];
}

var defaultKFStart = new Keyframe(0, 1, 0, 0);
var defaultKFEnd = new Keyframe(1, 1, 0, 0);
/**
 * !#en The animation curve of 3d particle.
 * !#zh 3D 粒子动画曲线
 * @class AnimationCurve
 */

var AnimationCurve = (_dec2 = (0, _CCClassDecorator.ccclass)('cc.AnimationCurve'), _dec3 = (0, _CCClassDecorator.property)({
  type: [Keyframe]
}), _dec4 = (0, _CCClassDecorator.property)({
  type: cc.Enum(WrapMode),
  visible: false
}), _dec5 = (0, _CCClassDecorator.property)({
  type: cc.Enum(WrapMode),
  visible: false
}), _dec2(_class4 = (_class5 = (_temp2 = /*#__PURE__*/function () {
  /**
   * !#en Array of key value.
   * !#zh 关键值列表。
   * @property {[Keyframe]} keyFrames
   */

  /**
   * !#en Pre-wrap mode.
   * !#zh 前置循环模式。
   * @property {WrapMode} preWrapMode
   */

  /**
   * !#en Post-wrap mode.
   * !#zh 后置循环模式。
   * @property {WrapMode} postWrapMode
   */
  function AnimationCurve(keyFrames) {
    if (keyFrames === void 0) {
      keyFrames = null;
    }

    _initializerDefineProperty(this, "keyFrames", _descriptor5, this);

    _initializerDefineProperty(this, "preWrapMode", _descriptor6, this);

    _initializerDefineProperty(this, "postWrapMode", _descriptor7, this);

    this.cachedKey = null;

    if (keyFrames) {
      this.keyFrames = keyFrames;
    } else {
      this.keyFrames.push(defaultKFStart);
      this.keyFrames.push(defaultKFEnd);
    }

    this.cachedKey = new OptimizedKey();
  }

  var _proto2 = AnimationCurve.prototype;

  _proto2.addKey = function addKey(keyFrame) {
    if (this.keyFrames == null) {
      this.keyFrames = [];
    }

    this.keyFrames.push(keyFrame);
  } // cubic Hermite spline
  ;

  _proto2.evaluate_slow = function evaluate_slow(time) {
    var wrappedTime = time;
    var wrapMode = time < 0 ? this.preWrapMode : this.postWrapMode;
    var startTime = this.keyFrames[0].time;
    var endTime = this.keyFrames[this.keyFrames.length - 1].time;

    switch (wrapMode) {
      case WrapMode.Loop:
        wrappedTime = (0, _valueTypes.repeat)(time - startTime, endTime - startTime) + startTime;
        break;

      case WrapMode.PingPong:
        wrappedTime = (0, _valueTypes.pingPong)(time - startTime, endTime - startTime) + startTime;
        break;

      case WrapMode.ClampForever:
        wrappedTime = (0, _valueTypes.clamp)(time, startTime, endTime);
        break;
    }

    var preKFIndex = 0;

    if (wrappedTime > this.keyFrames[0].time) {
      if (wrappedTime >= this.keyFrames[this.keyFrames.length - 1].time) {
        preKFIndex = this.keyFrames.length - 2;
      } else {
        for (var i = 0; i < this.keyFrames.length - 1; i++) {
          if (wrappedTime >= this.keyFrames[0].time && wrappedTime <= this.keyFrames[i + 1].time) {
            preKFIndex = i;
            break;
          }
        }
      }
    }

    var keyframe0 = this.keyFrames[preKFIndex];
    var keyframe1 = this.keyFrames[preKFIndex + 1];
    var t = (0, _valueTypes.inverseLerp)(keyframe0.time, keyframe1.time, wrappedTime);
    var dt = keyframe1.time - keyframe0.time;
    var m0 = keyframe0.outTangent * dt;
    var m1 = keyframe1.inTangent * dt;
    var t2 = t * t;
    var t3 = t2 * t;
    var a = 2 * t3 - 3 * t2 + 1;
    var b = t3 - 2 * t2 + t;
    var c = t3 - t2;
    var d = -2 * t3 + 3 * t2;
    return a * keyframe0.value + b * m0 + c * m1 + d * keyframe1.value;
  };

  _proto2.evaluate = function evaluate(time) {
    var wrappedTime = time;
    var wrapMode = time < 0 ? this.preWrapMode : this.postWrapMode;
    var startTime = this.keyFrames[0].time;
    var endTime = this.keyFrames[this.keyFrames.length - 1].time;

    switch (wrapMode) {
      case WrapMode.Loop:
        wrappedTime = (0, _valueTypes.repeat)(time - startTime, endTime - startTime) + startTime;
        break;

      case WrapMode.PingPong:
        wrappedTime = (0, _valueTypes.pingPong)(time - startTime, endTime - startTime) + startTime;
        break;

      case WrapMode.ClampForever:
        wrappedTime = (0, _valueTypes.clamp)(time, startTime, endTime);
        break;
    }

    if (wrappedTime >= this.cachedKey.time && wrappedTime < this.cachedKey.endTime) {
      return this.cachedKey.evaluate(wrappedTime);
    } else {
      var leftIndex = this.findIndex(this.cachedKey, wrappedTime);
      var rightIndex = leftIndex + 1;

      if (rightIndex === this.keyFrames.length) {
        rightIndex -= 1;
      }

      this.calcOptimizedKey(this.cachedKey, leftIndex, rightIndex);
      return this.cachedKey.evaluate(wrappedTime);
    }
  };

  _proto2.calcOptimizedKey = function calcOptimizedKey(optKey, leftIndex, rightIndex) {
    var lhs = this.keyFrames[leftIndex];
    var rhs = this.keyFrames[rightIndex];
    optKey.index = leftIndex;
    optKey.time = lhs.time;
    optKey.endTime = rhs.time;
    var dx = rhs.time - lhs.time;
    var dy = rhs.value - lhs.value;
    var length = 1 / (dx * dx);
    var d1 = lhs.outTangent * dx;
    var d2 = rhs.inTangent * dx;
    optKey.coefficient[0] = (d1 + d2 - dy - dy) * length / dx;
    optKey.coefficient[1] = (dy + dy + dy - d1 - d1 - d2) * length;
    optKey.coefficient[2] = lhs.outTangent;
    optKey.coefficient[3] = lhs.value;
  };

  _proto2.findIndex = function findIndex(optKey, t) {
    var cachedIndex = optKey.index;

    if (cachedIndex !== -1) {
      var cachedTime = this.keyFrames[cachedIndex].time;

      if (t > cachedTime) {
        for (var i = 0; i < LOOK_FORWARD; i++) {
          var currIndex = cachedIndex + i;

          if (currIndex + 1 < this.keyFrames.length && this.keyFrames[currIndex + 1].time > t) {
            return currIndex;
          }
        }
      } else {
        for (var _i = 0; _i < LOOK_FORWARD; _i++) {
          var _currIndex = cachedIndex - _i;

          if (_currIndex >= 0 && this.keyFrames[_currIndex - 1].time <= t) {
            return _currIndex - 1;
          }
        }
      }
    }

    var left = 0;
    var right = this.keyFrames.length;
    var mid = Math.floor((left + right) / 2);

    while (right - left > 1) {
      if (this.keyFrames[mid].time >= t) {
        right = mid;
      } else {
        left = mid + 1;
      }

      mid = Math.floor((left + right) / 2);
    }

    return left;
  };

  return AnimationCurve;
}(), _temp2), (_descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "keyFrames", [_dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Array();
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class5.prototype, "preWrapMode", [_dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return WrapMode.Loop;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class5.prototype, "postWrapMode", [_dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return WrapMode.Loop;
  }
})), _class5)) || _class4);
exports.AnimationCurve = AnimationCurve;
cc.Keyframe = Keyframe;
cc.AnimationCurve = AnimationCurve;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BhcnRpY2xlL2N1cnZlLnRzIl0sIm5hbWVzIjpbIkxPT0tfRk9SV0FSRCIsIldyYXBNb2RlIiwiRGVmYXVsdCIsIk9uY2UiLCJMb29wIiwiUGluZ1BvbmciLCJDbGFtcEZvcmV2ZXIiLCJLZXlmcmFtZSIsInRpbWUiLCJ2YWx1ZSIsImluVGFuZ2VudCIsIm91dFRhbmdlbnQiLCJwcm9wZXJ0eSIsIk9wdGltaXplZEtleSIsImluZGV4IiwiZW5kVGltZSIsImNvZWZmaWNpZW50IiwiRmxvYXQzMkFycmF5IiwiZXZhbHVhdGUiLCJUIiwidCIsImV2YWxPcHRDdXJ2ZSIsImNvZWZzIiwiZGVmYXVsdEtGU3RhcnQiLCJkZWZhdWx0S0ZFbmQiLCJBbmltYXRpb25DdXJ2ZSIsInR5cGUiLCJjYyIsIkVudW0iLCJ2aXNpYmxlIiwia2V5RnJhbWVzIiwiY2FjaGVkS2V5IiwicHVzaCIsImFkZEtleSIsImtleUZyYW1lIiwiZXZhbHVhdGVfc2xvdyIsIndyYXBwZWRUaW1lIiwid3JhcE1vZGUiLCJwcmVXcmFwTW9kZSIsInBvc3RXcmFwTW9kZSIsInN0YXJ0VGltZSIsImxlbmd0aCIsInByZUtGSW5kZXgiLCJpIiwia2V5ZnJhbWUwIiwia2V5ZnJhbWUxIiwiZHQiLCJtMCIsIm0xIiwidDIiLCJ0MyIsImEiLCJiIiwiYyIsImQiLCJsZWZ0SW5kZXgiLCJmaW5kSW5kZXgiLCJyaWdodEluZGV4IiwiY2FsY09wdGltaXplZEtleSIsIm9wdEtleSIsImxocyIsInJocyIsImR4IiwiZHkiLCJkMSIsImQyIiwiY2FjaGVkSW5kZXgiLCJjYWNoZWRUaW1lIiwiY3VyckluZGV4IiwibGVmdCIsInJpZ2h0IiwibWlkIiwiTWF0aCIsImZsb29yIiwiQXJyYXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLFlBQVksR0FBRyxDQUFyQjtBQUVBO0FBQ0E7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QUFTLEdBQUdGLFdBQVcsR0FBR3ZCLEVBQWhDOztBQUNBLGNBQUl5QixVQUFTLElBQUksQ0FBYixJQUFrQixLQUFLdEMsU0FBTCxDQUFlc0MsVUFBUyxHQUFHLENBQTNCLEVBQThCNUQsSUFBOUIsSUFBc0NZLENBQTVELEVBQStEO0FBQzNELG1CQUFPZ0QsVUFBUyxHQUFHLENBQW5CO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7O0FBQ0QsUUFBSUMsSUFBSSxHQUFHLENBQVg7QUFDQSxRQUFJQyxLQUFLLEdBQUcsS0FBS3hDLFNBQUwsQ0FBZVcsTUFBM0I7QUFDQSxRQUFJOEIsR0FBRyxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBVyxDQUFDSixJQUFJLEdBQUdDLEtBQVIsSUFBaUIsQ0FBNUIsQ0FBVjs7QUFDQSxXQUFPQSxLQUFLLEdBQUdELElBQVIsR0FBZSxDQUF0QixFQUF5QjtBQUNyQixVQUFJLEtBQUt2QyxTQUFMLENBQWV5QyxHQUFmLEVBQW9CL0QsSUFBcEIsSUFBNEJZLENBQWhDLEVBQW1DO0FBQy9Ca0QsUUFBQUEsS0FBSyxHQUFHQyxHQUFSO0FBQ0gsT0FGRCxNQUVPO0FBQ0hGLFFBQUFBLElBQUksR0FBR0UsR0FBRyxHQUFHLENBQWI7QUFDSDs7QUFDREEsTUFBQUEsR0FBRyxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBVyxDQUFDSixJQUFJLEdBQUdDLEtBQVIsSUFBaUIsQ0FBNUIsQ0FBTjtBQUNIOztBQUNELFdBQU9ELElBQVA7QUFDSDs7Ozs7Ozs7V0E1S1csSUFBSUssS0FBSjs7Ozs7OztXQVVFekUsUUFBUSxDQUFDRzs7Ozs7OztXQVVSSCxRQUFRLENBQUNHOzs7O0FBMko1QnVCLEVBQUUsQ0FBQ3BCLFFBQUgsR0FBY0EsUUFBZDtBQUNBb0IsRUFBRSxDQUFDRixjQUFILEdBQW9CQSxjQUFwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFbnVtICBmcm9tICcuLi8uLi9wbGF0Zm9ybS9DQ0VudW0nO1xuaW1wb3J0IHsgY2xhbXAsIGludmVyc2VMZXJwLCBwaW5nUG9uZywgcmVwZWF0IH0gZnJvbSAnLi4vLi4vdmFsdWUtdHlwZXMnO1xuaW1wb3J0IHsgY2NjbGFzcyAsIHByb3BlcnR5fSBmcm9tICcuLi8uLi9wbGF0Zm9ybS9DQ0NsYXNzRGVjb3JhdG9yJztcblxuY29uc3QgTE9PS19GT1JXQVJEID0gMztcblxuLyoqXG4gKiAhI2VuIFRoZSB3cmFwIG1vZGVcbiAqICEjemgg5b6q546v5qih5byPXG4gKiBAc3RhdGljXG4gKiBAZW51bSBBbmltYXRpb25DdXJ2ZS5XcmFwTW9kZVxuICovXG5jb25zdCBXcmFwTW9kZSA9IEVudW0oe1xuICAgIC8qKlxuICAgICAqICEjZW4gRGVmYXVsdFxuICAgICAqICEjemgg6buY6K6k5qih5byPXG4gICAgICogQHByb3BlcnR5IERlZmF1bHRcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIERlZmF1bHQ6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBPbmNlIE1vZGVcbiAgICAgKiAhI3poIE9uY2Ug5qih5byPXG4gICAgICogQHByb3BlcnR5IE9uY2VcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIE9uY2U6IDEsXG4gICAgLyoqXG4gICAgICogISNlbiBMb29wIE1vZGVcbiAgICAgKiAhI3poIExvb3Ag5qih5byPXG4gICAgICogQHByb3BlcnR5IExvb3BcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIExvb3A6IDIsXG4gICAgLyoqXG4gICAgICogISNlbiBQaW5nUG9uZyBNb2RlXG4gICAgICogISN6aCBQaW5nUG9uZyDmqKHlvI9cbiAgICAgKiBAcHJvcGVydHkgUGluZ1BvbmdcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFBpbmdQb25nOiAzLFxuICAgIC8qKlxuICAgICAqICEjZW4gQ2xhbXBGb3JldmVyIE1vZGVcbiAgICAgKiAhI3poIENsYW1wRm9yZXZlciDmqKHlvI9cbiAgICAgKiBAcHJvcGVydHkgQ2xhbXBGb3JldmVyXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBDbGFtcEZvcmV2ZXI6IDQsXG59KTtcblxuQGNjY2xhc3MoJ2NjLktleWZyYW1lJylcbmV4cG9ydCBjbGFzcyBLZXlmcmFtZSB7XG4gICAgLyoqXG4gICAgICogISNlbiBUaW1lLlxuICAgICAqICEjemgg5pe26Ze044CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHRpbWVcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICB0aW1lID0gMDtcbiAgICAvKipcbiAgICAgKiAhI2VuIEtleSB2YWx1ZS5cbiAgICAgKiAhI3poIOWFs+mUruWAvOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB2YWx1ZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIHZhbHVlID0gMDtcbiAgICAvKipcbiAgICAgKiAhI2VuIEluIHRhbmdlbnQgdmFsdWUuXG4gICAgICogISN6aCDlt6bliIflgLzjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gaW5UYW5nZW50XG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgaW5UYW5nZW50ID0gMDtcbiAgICAvKipcbiAgICAgKiAhI2VuIE91dCB0YW5nZW50IHZhbHVlLlxuICAgICAqICEjemgg5Y+z5YiH5YC844CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IG91dFRhbmdlbnRcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBvdXRUYW5nZW50ID0gMDtcblxuICAgIGNvbnN0cnVjdG9yICh0aW1lLCB2YWx1ZSwgaW5UYW5nZW50LCBvdXRUYW5nZW50KSB7XG4gICAgICAgIHRoaXMudGltZSA9IHRpbWUgfHwgMDtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlIHx8IDA7XG4gICAgICAgIHRoaXMuaW5UYW5nZW50ID0gaW5UYW5nZW50IHx8IDA7XG4gICAgICAgIHRoaXMub3V0VGFuZ2VudCA9IG91dFRhbmdlbnQgfHwgMDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBPcHRpbWl6ZWRLZXkge1xuICAgIGluZGV4ID0gMDtcbiAgICB0aW1lID0gMDtcbiAgICBlbmRUaW1lID0gMDtcbiAgICBjb2VmZmljaWVudCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHRoaXMuaW5kZXggPSAtMTtcbiAgICAgICAgdGhpcy50aW1lID0gMDtcbiAgICAgICAgdGhpcy5lbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5jb2VmZmljaWVudCA9IG5ldyBGbG9hdDMyQXJyYXkoNCk7XG4gICAgfVxuXG4gICAgZXZhbHVhdGUgKFQpIHtcbiAgICAgICAgY29uc3QgdCA9IFQgLSB0aGlzLnRpbWU7XG4gICAgICAgIHJldHVybiBldmFsT3B0Q3VydmUodCwgdGhpcy5jb2VmZmljaWVudCk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZXZhbE9wdEN1cnZlICh0LCBjb2Vmcykge1xuICAgIHJldHVybiAodCAqICh0ICogKHQgKiBjb2Vmc1swXSArIGNvZWZzWzFdKSArIGNvZWZzWzJdKSkgKyBjb2Vmc1szXTtcbn1cblxuY29uc3QgZGVmYXVsdEtGU3RhcnQgPSBuZXcgS2V5ZnJhbWUoMCwgMSwgMCwgMCk7XG5jb25zdCBkZWZhdWx0S0ZFbmQgPSBuZXcgS2V5ZnJhbWUoMSwgMSwgMCwgMCk7XG5cblxuLyoqXG4gKiAhI2VuIFRoZSBhbmltYXRpb24gY3VydmUgb2YgM2QgcGFydGljbGUuXG4gKiAhI3poIDNEIOeykuWtkOWKqOeUu+absue6v1xuICogQGNsYXNzIEFuaW1hdGlvbkN1cnZlXG4gKi9cbkBjY2NsYXNzKCdjYy5BbmltYXRpb25DdXJ2ZScpXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uQ3VydmUge1xuICAgIC8qKlxuICAgICAqICEjZW4gQXJyYXkgb2Yga2V5IHZhbHVlLlxuICAgICAqICEjemgg5YWz6ZSu5YC85YiX6KGo44CCXG4gICAgICogQHByb3BlcnR5IHtbS2V5ZnJhbWVdfSBrZXlGcmFtZXNcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBbS2V5ZnJhbWVdLFxuICAgIH0pXG4gICAga2V5RnJhbWVzID0gbmV3IEFycmF5KCk7XG4gICAgLyoqXG4gICAgICogISNlbiBQcmUtd3JhcCBtb2RlLlxuICAgICAqICEjemgg5YmN572u5b6q546v5qih5byP44CCXG4gICAgICogQHByb3BlcnR5IHtXcmFwTW9kZX0gcHJlV3JhcE1vZGVcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBjYy5FbnVtKFdyYXBNb2RlKSxcbiAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgfSlcbiAgICBwcmVXcmFwTW9kZSA9IFdyYXBNb2RlLkxvb3A7XG4gICAgLyoqXG4gICAgICogISNlbiBQb3N0LXdyYXAgbW9kZS5cbiAgICAgKiAhI3poIOWQjue9ruW+queOr+aooeW8j+OAglxuICAgICAqIEBwcm9wZXJ0eSB7V3JhcE1vZGV9IHBvc3RXcmFwTW9kZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IGNjLkVudW0oV3JhcE1vZGUpLFxuICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICB9KVxuICAgIHBvc3RXcmFwTW9kZSA9IFdyYXBNb2RlLkxvb3A7XG5cbiAgICBjYWNoZWRLZXkgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IgKGtleUZyYW1lcyA9IG51bGwpIHtcbiAgICAgICAgaWYgKGtleUZyYW1lcykge1xuICAgICAgICAgICAgdGhpcy5rZXlGcmFtZXMgPSBrZXlGcmFtZXNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMua2V5RnJhbWVzLnB1c2goZGVmYXVsdEtGU3RhcnQpO1xuICAgICAgICAgICAgdGhpcy5rZXlGcmFtZXMucHVzaChkZWZhdWx0S0ZFbmQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FjaGVkS2V5ID0gbmV3IE9wdGltaXplZEtleSgpO1xuICAgIH1cblxuICAgIGFkZEtleSAoa2V5RnJhbWUpIHtcbiAgICAgICAgaWYgKHRoaXMua2V5RnJhbWVzID09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMua2V5RnJhbWVzID0gW107XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5rZXlGcmFtZXMucHVzaChrZXlGcmFtZSk7XG4gICAgfVxuXG4gICAgLy8gY3ViaWMgSGVybWl0ZSBzcGxpbmVcbiAgICBldmFsdWF0ZV9zbG93ICh0aW1lKSB7XG4gICAgICAgIGxldCB3cmFwcGVkVGltZSA9IHRpbWU7XG4gICAgICAgIGNvbnN0IHdyYXBNb2RlID0gdGltZSA8IDAgPyB0aGlzLnByZVdyYXBNb2RlIDogdGhpcy5wb3N0V3JhcE1vZGU7XG4gICAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IHRoaXMua2V5RnJhbWVzWzBdLnRpbWU7XG4gICAgICAgIGNvbnN0IGVuZFRpbWUgPSB0aGlzLmtleUZyYW1lc1t0aGlzLmtleUZyYW1lcy5sZW5ndGggLSAxXS50aW1lO1xuICAgICAgICBzd2l0Y2ggKHdyYXBNb2RlKSB7XG4gICAgICAgICAgICBjYXNlIFdyYXBNb2RlLkxvb3A6XG4gICAgICAgICAgICAgICAgd3JhcHBlZFRpbWUgPSByZXBlYXQodGltZSAtIHN0YXJ0VGltZSwgZW5kVGltZSAtIHN0YXJ0VGltZSkgKyBzdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFdyYXBNb2RlLlBpbmdQb25nOlxuICAgICAgICAgICAgICAgIHdyYXBwZWRUaW1lID0gcGluZ1BvbmcodGltZSAtIHN0YXJ0VGltZSwgZW5kVGltZSAtIHN0YXJ0VGltZSkgKyBzdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFdyYXBNb2RlLkNsYW1wRm9yZXZlcjpcbiAgICAgICAgICAgICAgICB3cmFwcGVkVGltZSA9IGNsYW1wKHRpbWUsIHN0YXJ0VGltZSwgZW5kVGltZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHByZUtGSW5kZXggPSAwO1xuICAgICAgICBpZiAod3JhcHBlZFRpbWUgPiB0aGlzLmtleUZyYW1lc1swXS50aW1lKSB7XG4gICAgICAgICAgICBpZiAod3JhcHBlZFRpbWUgPj0gdGhpcy5rZXlGcmFtZXNbdGhpcy5rZXlGcmFtZXMubGVuZ3RoIC0gMV0udGltZSkge1xuICAgICAgICAgICAgICAgIHByZUtGSW5kZXggPSB0aGlzLmtleUZyYW1lcy5sZW5ndGggLSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmtleUZyYW1lcy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdyYXBwZWRUaW1lID49IHRoaXMua2V5RnJhbWVzWzBdLnRpbWUgJiYgd3JhcHBlZFRpbWUgPD0gdGhpcy5rZXlGcmFtZXNbaSArIDFdLnRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZUtGSW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qga2V5ZnJhbWUwID0gdGhpcy5rZXlGcmFtZXNbcHJlS0ZJbmRleF07XG4gICAgICAgIGNvbnN0IGtleWZyYW1lMSA9IHRoaXMua2V5RnJhbWVzW3ByZUtGSW5kZXggKyAxXTtcblxuICAgICAgICBjb25zdCB0ID0gaW52ZXJzZUxlcnAoa2V5ZnJhbWUwLnRpbWUsIGtleWZyYW1lMS50aW1lLCB3cmFwcGVkVGltZSk7XG4gICAgICAgIGNvbnN0IGR0ID0ga2V5ZnJhbWUxLnRpbWUgLSBrZXlmcmFtZTAudGltZTtcblxuICAgICAgICBjb25zdCBtMCA9IGtleWZyYW1lMC5vdXRUYW5nZW50ICogZHQ7XG4gICAgICAgIGNvbnN0IG0xID0ga2V5ZnJhbWUxLmluVGFuZ2VudCAqIGR0O1xuXG4gICAgICAgIGNvbnN0IHQyID0gdCAqIHQ7XG4gICAgICAgIGNvbnN0IHQzID0gdDIgKiB0O1xuXG4gICAgICAgIGNvbnN0IGEgPSAyICogdDMgLSAzICogdDIgKyAxO1xuICAgICAgICBjb25zdCBiID0gdDMgLSAyICogdDIgKyB0O1xuICAgICAgICBjb25zdCBjID0gdDMgLSB0MjtcbiAgICAgICAgY29uc3QgZCA9IC0yICogdDMgKyAzICogdDI7XG5cbiAgICAgICAgcmV0dXJuIGEgKiBrZXlmcmFtZTAudmFsdWUgKyBiICogbTAgKyBjICogbTEgKyBkICoga2V5ZnJhbWUxLnZhbHVlO1xuICAgIH1cblxuICAgIGV2YWx1YXRlICh0aW1lKSB7XG4gICAgICAgIGxldCB3cmFwcGVkVGltZSA9IHRpbWU7XG4gICAgICAgIGNvbnN0IHdyYXBNb2RlID0gdGltZSA8IDAgPyB0aGlzLnByZVdyYXBNb2RlIDogdGhpcy5wb3N0V3JhcE1vZGU7XG4gICAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IHRoaXMua2V5RnJhbWVzWzBdLnRpbWU7XG4gICAgICAgIGNvbnN0IGVuZFRpbWUgPSB0aGlzLmtleUZyYW1lc1t0aGlzLmtleUZyYW1lcy5sZW5ndGggLSAxXS50aW1lO1xuICAgICAgICBzd2l0Y2ggKHdyYXBNb2RlKSB7XG4gICAgICAgICAgICBjYXNlIFdyYXBNb2RlLkxvb3A6XG4gICAgICAgICAgICAgICAgd3JhcHBlZFRpbWUgPSByZXBlYXQodGltZSAtIHN0YXJ0VGltZSwgZW5kVGltZSAtIHN0YXJ0VGltZSkgKyBzdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFdyYXBNb2RlLlBpbmdQb25nOlxuICAgICAgICAgICAgICAgIHdyYXBwZWRUaW1lID0gcGluZ1BvbmcodGltZSAtIHN0YXJ0VGltZSwgZW5kVGltZSAtIHN0YXJ0VGltZSkgKyBzdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFdyYXBNb2RlLkNsYW1wRm9yZXZlcjpcbiAgICAgICAgICAgICAgICB3cmFwcGVkVGltZSA9IGNsYW1wKHRpbWUsIHN0YXJ0VGltZSwgZW5kVGltZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHdyYXBwZWRUaW1lID49IHRoaXMuY2FjaGVkS2V5LnRpbWUgJiYgd3JhcHBlZFRpbWUgPCB0aGlzLmNhY2hlZEtleS5lbmRUaW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYWNoZWRLZXkuZXZhbHVhdGUod3JhcHBlZFRpbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgbGVmdEluZGV4ID0gdGhpcy5maW5kSW5kZXgodGhpcy5jYWNoZWRLZXksIHdyYXBwZWRUaW1lKTtcbiAgICAgICAgICAgIGxldCByaWdodEluZGV4ID0gbGVmdEluZGV4ICsgMTtcbiAgICAgICAgICAgIGlmIChyaWdodEluZGV4ID09PSB0aGlzLmtleUZyYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByaWdodEluZGV4IC09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNhbGNPcHRpbWl6ZWRLZXkodGhpcy5jYWNoZWRLZXksIGxlZnRJbmRleCwgcmlnaHRJbmRleCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYWNoZWRLZXkuZXZhbHVhdGUod3JhcHBlZFRpbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FsY09wdGltaXplZEtleSAob3B0S2V5LCBsZWZ0SW5kZXgsIHJpZ2h0SW5kZXgpIHtcbiAgICAgICAgY29uc3QgbGhzID0gdGhpcy5rZXlGcmFtZXNbbGVmdEluZGV4XTtcbiAgICAgICAgY29uc3QgcmhzID0gdGhpcy5rZXlGcmFtZXNbcmlnaHRJbmRleF07XG4gICAgICAgIG9wdEtleS5pbmRleCA9IGxlZnRJbmRleDtcbiAgICAgICAgb3B0S2V5LnRpbWUgPSBsaHMudGltZTtcbiAgICAgICAgb3B0S2V5LmVuZFRpbWUgPSByaHMudGltZTtcblxuICAgICAgICBjb25zdCBkeCA9IHJocy50aW1lIC0gbGhzLnRpbWU7XG4gICAgICAgIGNvbnN0IGR5ID0gcmhzLnZhbHVlIC0gbGhzLnZhbHVlO1xuICAgICAgICBjb25zdCBsZW5ndGggPSAxIC8gKGR4ICogZHgpO1xuICAgICAgICBjb25zdCBkMSA9IGxocy5vdXRUYW5nZW50ICogZHg7XG4gICAgICAgIGNvbnN0IGQyID0gcmhzLmluVGFuZ2VudCAqIGR4O1xuXG4gICAgICAgIG9wdEtleS5jb2VmZmljaWVudFswXSA9IChkMSArIGQyIC0gZHkgLSBkeSkgKiBsZW5ndGggLyBkeDtcbiAgICAgICAgb3B0S2V5LmNvZWZmaWNpZW50WzFdID0gKGR5ICsgZHkgKyBkeSAtIGQxIC0gZDEgLSBkMikgKiBsZW5ndGg7XG4gICAgICAgIG9wdEtleS5jb2VmZmljaWVudFsyXSA9IGxocy5vdXRUYW5nZW50O1xuICAgICAgICBvcHRLZXkuY29lZmZpY2llbnRbM10gPSBsaHMudmFsdWU7XG4gICAgfVxuXG4gICAgZmluZEluZGV4IChvcHRLZXksIHQpIHtcbiAgICAgICAgY29uc3QgY2FjaGVkSW5kZXggPSBvcHRLZXkuaW5kZXg7XG4gICAgICAgIGlmIChjYWNoZWRJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlZFRpbWUgPSB0aGlzLmtleUZyYW1lc1tjYWNoZWRJbmRleF0udGltZTtcbiAgICAgICAgICAgIGlmICh0ID4gY2FjaGVkVGltZSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTE9PS19GT1JXQVJEOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VyckluZGV4ID0gY2FjaGVkSW5kZXggKyBpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyckluZGV4ICsgMSA8IHRoaXMua2V5RnJhbWVzLmxlbmd0aCAmJiB0aGlzLmtleUZyYW1lc1tjdXJySW5kZXggKyAxXS50aW1lID4gdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBMT09LX0ZPUldBUkQ7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJySW5kZXggPSBjYWNoZWRJbmRleCAtIGk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJySW5kZXggPj0gMCAmJiB0aGlzLmtleUZyYW1lc1tjdXJySW5kZXggLSAxXS50aW1lIDw9IHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJySW5kZXggLSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBsZWZ0ID0gMDtcbiAgICAgICAgbGV0IHJpZ2h0ID0gdGhpcy5rZXlGcmFtZXMubGVuZ3RoO1xuICAgICAgICBsZXQgbWlkID0gTWF0aC5mbG9vcigobGVmdCArIHJpZ2h0KSAvIDIpO1xuICAgICAgICB3aGlsZSAocmlnaHQgLSBsZWZ0ID4gMSkge1xuICAgICAgICAgICAgaWYgKHRoaXMua2V5RnJhbWVzW21pZF0udGltZSA+PSB0KSB7XG4gICAgICAgICAgICAgICAgcmlnaHQgPSBtaWQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxlZnQgPSBtaWQgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWlkID0gTWF0aC5mbG9vcigobGVmdCArIHJpZ2h0KSAvIDIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsZWZ0O1xuICAgIH1cbn1cblxuY2MuS2V5ZnJhbWUgPSBLZXlmcmFtZTtcbmNjLkFuaW1hdGlvbkN1cnZlID0gQW5pbWF0aW9uQ3VydmU7Il0sInNvdXJjZVJvb3QiOiIvIn0=