
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/particle/burst.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _CCClassDecorator = require("../../platform/CCClassDecorator");

var _valueTypes = require("../../value-types");

var _curveRange = _interopRequireDefault(require("./animator/curve-range"));

var _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

var Burst = (
/**
 * !#en The burst of 3d particle.
 * !#zh 3D 粒子发射时的爆发个数
 * @class Burst
 */
_dec = (0, _CCClassDecorator.ccclass)('cc.Burst'), _dec2 = (0, _CCClassDecorator.property)({
  type: _curveRange["default"]
}), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
  function Burst() {
    _initializerDefineProperty(this, "_time", _descriptor, this);

    _initializerDefineProperty(this, "minCount", _descriptor2, this);

    _initializerDefineProperty(this, "maxCount", _descriptor3, this);

    _initializerDefineProperty(this, "_repeatCount", _descriptor4, this);

    _initializerDefineProperty(this, "repeatInterval", _descriptor5, this);

    _initializerDefineProperty(this, "count", _descriptor6, this);

    this._remainingCount = 0;
    this._curTime = 0;
    this._remainingCount = 0;
    this._curTime = 0.0;
  }

  var _proto = Burst.prototype;

  _proto.update = function update(psys, dt) {
    if (this._remainingCount === 0) {
      this._remainingCount = this._repeatCount;
      this._curTime = this._time;
    }

    if (this._remainingCount > 0) {
      var preFrameTime = (0, _valueTypes.repeat)(psys._time - psys.startDelay.evaluate(0, 1), psys.duration) - dt;
      preFrameTime = preFrameTime > 0.0 ? preFrameTime : 0.0;
      var curFrameTime = (0, _valueTypes.repeat)(psys.time - psys.startDelay.evaluate(0, 1), psys.duration);

      if (this._curTime >= preFrameTime && this._curTime < curFrameTime) {
        psys.emit(this.count.evaluate(this._curTime / psys.duration, 1), dt - (curFrameTime - this._curTime));
        this._curTime += this.repeatInterval;
        --this._remainingCount;
      }
    }
  };

  _proto.getMaxCount = function getMaxCount(psys) {
    return this.count.getMax() * Math.min(Math.ceil(psys.duration / this.repeatInterval), this.repeatCount);
  };

  _createClass(Burst, [{
    key: "time",
    get:
    /**
     * !#en Time between the start of the particle system and the trigger of this Brust
     * !#zh 粒子系统开始运行到触发此次 Brust 的时间
     * @property {Number} time
     */
    function get() {
      return this._time;
    },
    set: function set(val) {
      this._time = val;
      this._curTime = val;
    }
    /**
     * !#en Minimum number of emitted particles
     * !#zh 发射粒子的最小数量
     * @property {Number} minCount
     */

  }, {
    key: "repeatCount",
    get:
    /**
     * !#en The number of times Burst was triggered.
     * !#zh Burst 的触发次数
     * @property {Number} repeatCount
     */
    function get() {
      return this._repeatCount;
    },
    set: function set(val) {
      this._repeatCount = val;
      this._remainingCount = val;
    }
    /**
     * !#en Interval of each trigger
     * !#zh 每次触发的间隔时间
     * @property {Number} repeatInterval
     */

  }]);

  return Burst;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_time", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "time", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "time"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "minCount", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 30;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "maxCount", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 30;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_repeatCount", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "repeatCount", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "repeatCount"), _class2.prototype), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "repeatInterval", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "count", [_dec2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
})), _class2)) || _class);
exports["default"] = Burst;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BhcnRpY2xlL2J1cnN0LnRzIl0sIm5hbWVzIjpbIkJ1cnN0IiwidHlwZSIsIkN1cnZlUmFuZ2UiLCJfcmVtYWluaW5nQ291bnQiLCJfY3VyVGltZSIsInVwZGF0ZSIsInBzeXMiLCJkdCIsIl9yZXBlYXRDb3VudCIsIl90aW1lIiwicHJlRnJhbWVUaW1lIiwic3RhcnREZWxheSIsImV2YWx1YXRlIiwiZHVyYXRpb24iLCJjdXJGcmFtZVRpbWUiLCJ0aW1lIiwiZW1pdCIsImNvdW50IiwicmVwZWF0SW50ZXJ2YWwiLCJnZXRNYXhDb3VudCIsImdldE1heCIsIk1hdGgiLCJtaW4iLCJjZWlsIiwicmVwZWF0Q291bnQiLCJ2YWwiLCJwcm9wZXJ0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0lBUXFCQTtBQU5yQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO09BQ0MsK0JBQVEsVUFBUixXQW9FSSxnQ0FBUztBQUNOQyxFQUFBQSxJQUFJLEVBQUVDO0FBREEsQ0FBVDtBQVFELG1CQUFlO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUEsU0FIZkMsZUFHZSxHQUhHLENBR0g7QUFBQSxTQUZmQyxRQUVlLEdBRkosQ0FFSTtBQUNYLFNBQUtELGVBQUwsR0FBdUIsQ0FBdkI7QUFDQSxTQUFLQyxRQUFMLEdBQWdCLEdBQWhCO0FBQ0g7Ozs7U0FFREMsU0FBQSxnQkFBUUMsSUFBUixFQUFjQyxFQUFkLEVBQWtCO0FBQ2QsUUFBSSxLQUFLSixlQUFMLEtBQXlCLENBQTdCLEVBQWdDO0FBQzVCLFdBQUtBLGVBQUwsR0FBdUIsS0FBS0ssWUFBNUI7QUFDQSxXQUFLSixRQUFMLEdBQWdCLEtBQUtLLEtBQXJCO0FBQ0g7O0FBQ0QsUUFBSSxLQUFLTixlQUFMLEdBQXVCLENBQTNCLEVBQThCO0FBQzFCLFVBQUlPLFlBQVksR0FBRyx3QkFBT0osSUFBSSxDQUFDRyxLQUFMLEdBQWFILElBQUksQ0FBQ0ssVUFBTCxDQUFnQkMsUUFBaEIsQ0FBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsQ0FBcEIsRUFBb0ROLElBQUksQ0FBQ08sUUFBekQsSUFBcUVOLEVBQXhGO0FBQ0FHLE1BQUFBLFlBQVksR0FBSUEsWUFBWSxHQUFHLEdBQWhCLEdBQXVCQSxZQUF2QixHQUFzQyxHQUFyRDtBQUNBLFVBQU1JLFlBQVksR0FBRyx3QkFBT1IsSUFBSSxDQUFDUyxJQUFMLEdBQVlULElBQUksQ0FBQ0ssVUFBTCxDQUFnQkMsUUFBaEIsQ0FBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsQ0FBbkIsRUFBbUROLElBQUksQ0FBQ08sUUFBeEQsQ0FBckI7O0FBQ0EsVUFBSSxLQUFLVCxRQUFMLElBQWlCTSxZQUFqQixJQUFpQyxLQUFLTixRQUFMLEdBQWdCVSxZQUFyRCxFQUFtRTtBQUMvRFIsUUFBQUEsSUFBSSxDQUFDVSxJQUFMLENBQVUsS0FBS0MsS0FBTCxDQUFXTCxRQUFYLENBQW9CLEtBQUtSLFFBQUwsR0FBZ0JFLElBQUksQ0FBQ08sUUFBekMsRUFBbUQsQ0FBbkQsQ0FBVixFQUFpRU4sRUFBRSxJQUFJTyxZQUFZLEdBQUcsS0FBS1YsUUFBeEIsQ0FBbkU7QUFDQSxhQUFLQSxRQUFMLElBQWlCLEtBQUtjLGNBQXRCO0FBQ0EsVUFBRSxLQUFLZixlQUFQO0FBQ0g7QUFDSjtBQUNKOztTQUVEZ0IsY0FBQSxxQkFBYWIsSUFBYixFQUFtQjtBQUNmLFdBQU8sS0FBS1csS0FBTCxDQUFXRyxNQUFYLEtBQXNCQyxJQUFJLENBQUNDLEdBQUwsQ0FBU0QsSUFBSSxDQUFDRSxJQUFMLENBQVVqQixJQUFJLENBQUNPLFFBQUwsR0FBZ0IsS0FBS0ssY0FBL0IsQ0FBVCxFQUF5RCxLQUFLTSxXQUE5RCxDQUE3QjtBQUNIOzs7OztBQTlGRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0ksbUJBQ1k7QUFDUixhQUFPLEtBQUtmLEtBQVo7QUFDSDtTQUVELGFBQVVnQixHQUFWLEVBQWU7QUFDWCxXQUFLaEIsS0FBTCxHQUFhZ0IsR0FBYjtBQUNBLFdBQUtyQixRQUFMLEdBQWdCcUIsR0FBaEI7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBZUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNJLG1CQUNtQjtBQUNmLGFBQU8sS0FBS2pCLFlBQVo7QUFDSDtTQUVELGFBQWlCaUIsR0FBakIsRUFBc0I7QUFDbEIsV0FBS2pCLFlBQUwsR0FBb0JpQixHQUFwQjtBQUNBLFdBQUt0QixlQUFMLEdBQXVCc0IsR0FBdkI7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7Ozs7O21GQXhES0M7Ozs7O1dBQ087OzBEQU9QQSxzTEFlQUE7Ozs7O1dBQ1U7OzZFQU9WQTs7Ozs7V0FDVTs7aUZBRVZBOzs7OztXQUNjOztpRUFPZEEsbU1BZUFBOzs7OztXQUNnQjs7Ozs7OztXQVVULElBQUl4QixzQkFBSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNjY2xhc3MsIHByb3BlcnR5IH0gZnJvbSAnLi4vLi4vcGxhdGZvcm0vQ0NDbGFzc0RlY29yYXRvcic7XG5pbXBvcnQgeyByZXBlYXQgfSBmcm9tICcuLi8uLi92YWx1ZS10eXBlcyc7XG5pbXBvcnQgQ3VydmVSYW5nZSBmcm9tICcuL2FuaW1hdG9yL2N1cnZlLXJhbmdlJztcblxuLyoqXG4gKiAhI2VuIFRoZSBidXJzdCBvZiAzZCBwYXJ0aWNsZS5cbiAqICEjemggM0Qg57KS5a2Q5Y+R5bCE5pe255qE54iG5Y+R5Liq5pWwXG4gKiBAY2xhc3MgQnVyc3RcbiAqL1xuQGNjY2xhc3MoJ2NjLkJ1cnN0JylcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1cnN0IHtcblxuICAgIEBwcm9wZXJ0eVxuICAgIF90aW1lID0gMDtcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGltZSBiZXR3ZWVuIHRoZSBzdGFydCBvZiB0aGUgcGFydGljbGUgc3lzdGVtIGFuZCB0aGUgdHJpZ2dlciBvZiB0aGlzIEJydXN0XG4gICAgICogISN6aCDnspLlrZDns7vnu5/lvIDlp4vov5DooYzliLDop6blj5HmraTmrKEgQnJ1c3Qg55qE5pe26Ze0XG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHRpbWVcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBnZXQgdGltZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90aW1lO1xuICAgIH1cblxuICAgIHNldCB0aW1lICh2YWwpIHtcbiAgICAgICAgdGhpcy5fdGltZSA9IHZhbDtcbiAgICAgICAgdGhpcy5fY3VyVGltZSA9IHZhbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIE1pbmltdW0gbnVtYmVyIG9mIGVtaXR0ZWQgcGFydGljbGVzXG4gICAgICogISN6aCDlj5HlsITnspLlrZDnmoTmnIDlsI/mlbDph49cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbWluQ291bnRcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBtaW5Db3VudCA9IDMwO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBNYXhpbXVtIG51bWJlciBvZiBlbWl0dGVkIHBhcnRpY2xlc1xuICAgICAqICEjemgg5Y+R5bCE57KS5a2Q55qE5pyA5aSn5pWw6YePXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IG1heENvdW50XG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgbWF4Q291bnQgPSAzMDtcblxuICAgIEBwcm9wZXJ0eVxuICAgIF9yZXBlYXRDb3VudCA9IDE7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBudW1iZXIgb2YgdGltZXMgQnVyc3Qgd2FzIHRyaWdnZXJlZC5cbiAgICAgKiAhI3poIEJ1cnN0IOeahOinpuWPkeasoeaVsFxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSByZXBlYXRDb3VudFxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGdldCByZXBlYXRDb3VudCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXBlYXRDb3VudDtcbiAgICB9XG5cbiAgICBzZXQgcmVwZWF0Q291bnQgKHZhbCkge1xuICAgICAgICB0aGlzLl9yZXBlYXRDb3VudCA9IHZhbDtcbiAgICAgICAgdGhpcy5fcmVtYWluaW5nQ291bnQgPSB2YWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBJbnRlcnZhbCBvZiBlYWNoIHRyaWdnZXJcbiAgICAgKiAhI3poIOavj+asoeinpuWPkeeahOmXtOmalOaXtumXtFxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSByZXBlYXRJbnRlcnZhbFxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIHJlcGVhdEludGVydmFsID0gMTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gTnVtYmVyIG9mIHBhcnRpY2xlcyBlbWl0dGVkXG4gICAgICogISN6aCDlj5HlsITnmoTnspLlrZDnmoTmlbDph49cbiAgICAgKiBAcHJvcGVydHkge0N1cnZlUmFuZ2V9IGNvdW50XG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogQ3VydmVSYW5nZSxcbiAgICB9KVxuICAgIGNvdW50ID0gbmV3IEN1cnZlUmFuZ2UoKTtcblxuICAgIF9yZW1haW5pbmdDb3VudCA9IDA7XG4gICAgX2N1clRpbWUgPSAwO1xuXG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICB0aGlzLl9yZW1haW5pbmdDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuX2N1clRpbWUgPSAwLjA7XG4gICAgfVxuXG4gICAgdXBkYXRlIChwc3lzLCBkdCkge1xuICAgICAgICBpZiAodGhpcy5fcmVtYWluaW5nQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX3JlbWFpbmluZ0NvdW50ID0gdGhpcy5fcmVwZWF0Q291bnQ7XG4gICAgICAgICAgICB0aGlzLl9jdXJUaW1lID0gdGhpcy5fdGltZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fcmVtYWluaW5nQ291bnQgPiAwKSB7XG4gICAgICAgICAgICBsZXQgcHJlRnJhbWVUaW1lID0gcmVwZWF0KHBzeXMuX3RpbWUgLSBwc3lzLnN0YXJ0RGVsYXkuZXZhbHVhdGUoMCwgMSksIHBzeXMuZHVyYXRpb24pIC0gZHQ7XG4gICAgICAgICAgICBwcmVGcmFtZVRpbWUgPSAocHJlRnJhbWVUaW1lID4gMC4wKSA/IHByZUZyYW1lVGltZSA6IDAuMDtcbiAgICAgICAgICAgIGNvbnN0IGN1ckZyYW1lVGltZSA9IHJlcGVhdChwc3lzLnRpbWUgLSBwc3lzLnN0YXJ0RGVsYXkuZXZhbHVhdGUoMCwgMSksIHBzeXMuZHVyYXRpb24pO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2N1clRpbWUgPj0gcHJlRnJhbWVUaW1lICYmIHRoaXMuX2N1clRpbWUgPCBjdXJGcmFtZVRpbWUpIHtcbiAgICAgICAgICAgICAgICBwc3lzLmVtaXQodGhpcy5jb3VudC5ldmFsdWF0ZSh0aGlzLl9jdXJUaW1lIC8gcHN5cy5kdXJhdGlvbiwgMSksIGR0IC0gKGN1ckZyYW1lVGltZSAtIHRoaXMuX2N1clRpbWUpKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJUaW1lICs9IHRoaXMucmVwZWF0SW50ZXJ2YWw7XG4gICAgICAgICAgICAgICAgLS10aGlzLl9yZW1haW5pbmdDb3VudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldE1heENvdW50IChwc3lzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvdW50LmdldE1heCgpICogTWF0aC5taW4oTWF0aC5jZWlsKHBzeXMuZHVyYXRpb24gLyB0aGlzLnJlcGVhdEludGVydmFsKSwgdGhpcy5yZXBlYXRDb3VudCk7XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvIn0=