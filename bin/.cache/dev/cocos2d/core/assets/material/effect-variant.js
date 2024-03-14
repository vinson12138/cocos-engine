
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/material/effect-variant.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _murmurhash2_gc = _interopRequireDefault(require("../../../renderer/murmurhash2_gc"));

var _utils = _interopRequireDefault(require("./utils"));

var _effectBase = _interopRequireDefault(require("./effect-base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var gfx = cc.gfx;

var EffectVariant = /*#__PURE__*/function (_EffectBase) {
  _inheritsLoose(EffectVariant, _EffectBase);

  function EffectVariant(effect) {
    var _this;

    _this = _EffectBase.call(this) || this;
    _this._effect = void 0;
    _this._passes = [];
    _this._stagePasses = {};
    _this._hash = 0;

    _this.init(effect);

    return _this;
  }

  var _proto = EffectVariant.prototype;

  _proto._onEffectChanged = function _onEffectChanged() {};

  _proto.init = function init(effect) {
    if (effect instanceof EffectVariant) {
      effect = effect.effect;
    }

    this._effect = effect;
    this._dirty = true;

    if (effect) {
      var passes = effect.passes;
      var variantPasses = this._passes;
      variantPasses.length = 0;
      var stagePasses = this._stagePasses = {};

      for (var i = 0; i < passes.length; i++) {
        var variant = variantPasses[i] = Object.setPrototypeOf({}, passes[i]);
        variant._properties = Object.setPrototypeOf({}, passes[i]._properties);
        variant._defines = Object.setPrototypeOf({}, passes[i]._defines);

        if (!stagePasses[variant._stage]) {
          stagePasses[variant._stage] = [];
        }

        stagePasses[variant._stage].push(variant);
      }
    }
  };

  _proto.updateHash = function updateHash(hash) {};

  _proto.getHash = function getHash() {
    if (!this._dirty) return this._hash;
    this._dirty = false;
    var hash = '';
    hash += _utils["default"].serializePasses(this._passes);
    var effect = this._effect;

    if (effect) {
      hash += _utils["default"].serializePasses(effect.passes);
    }

    this._hash = (0, _murmurhash2_gc["default"])(hash, 666);
    this.updateHash(this._hash);
    return this._hash;
  };

  _createClass(EffectVariant, [{
    key: "effect",
    get: function get() {
      return this._effect;
    }
  }, {
    key: "name",
    get: function get() {
      return this._effect && this._effect.name + ' (variant)';
    }
  }, {
    key: "passes",
    get: function get() {
      return this._passes;
    }
  }, {
    key: "stagePasses",
    get: function get() {
      return this._stagePasses;
    }
  }]);

  return EffectVariant;
}(_effectBase["default"]);

exports["default"] = EffectVariant;
cc.EffectVariant = EffectVariant;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0cy9tYXRlcmlhbC9lZmZlY3QtdmFyaWFudC50cyJdLCJuYW1lcyI6WyJnZngiLCJjYyIsIkVmZmVjdFZhcmlhbnQiLCJlZmZlY3QiLCJfZWZmZWN0IiwiX3Bhc3NlcyIsIl9zdGFnZVBhc3NlcyIsIl9oYXNoIiwiaW5pdCIsIl9vbkVmZmVjdENoYW5nZWQiLCJfZGlydHkiLCJwYXNzZXMiLCJ2YXJpYW50UGFzc2VzIiwibGVuZ3RoIiwic3RhZ2VQYXNzZXMiLCJpIiwidmFyaWFudCIsIk9iamVjdCIsInNldFByb3RvdHlwZU9mIiwiX3Byb3BlcnRpZXMiLCJfZGVmaW5lcyIsIl9zdGFnZSIsInB1c2giLCJ1cGRhdGVIYXNoIiwiaGFzaCIsImdldEhhc2giLCJ1dGlscyIsInNlcmlhbGl6ZVBhc3NlcyIsIm5hbWUiLCJFZmZlY3RCYXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBR0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLEdBQUcsR0FBR0MsRUFBRSxDQUFDRCxHQUFmOztJQUVxQkU7OztBQXNCakIseUJBQWFDLE1BQWIsRUFBNkI7QUFBQTs7QUFDekI7QUFEeUIsVUFyQjdCQyxPQXFCNkI7QUFBQSxVQXBCN0JDLE9Bb0I2QixHQXBCWCxFQW9CVztBQUFBLFVBbkI3QkMsWUFtQjZCLEdBbkJkLEVBbUJjO0FBQUEsVUFsQjdCQyxLQWtCNkIsR0FsQnJCLENBa0JxQjs7QUFFekIsVUFBS0MsSUFBTCxDQUFVTCxNQUFWOztBQUZ5QjtBQUc1Qjs7OztTQUVETSxtQkFBQSw0QkFBb0IsQ0FDbkI7O1NBRURELE9BQUEsY0FBTUwsTUFBTixFQUFzQjtBQUNsQixRQUFJQSxNQUFNLFlBQVlELGFBQXRCLEVBQXFDO0FBQ2pDQyxNQUFBQSxNQUFNLEdBQUdBLE1BQU0sQ0FBQ0EsTUFBaEI7QUFDSDs7QUFFRCxTQUFLQyxPQUFMLEdBQWVELE1BQWY7QUFDQSxTQUFLTyxNQUFMLEdBQWMsSUFBZDs7QUFFQSxRQUFJUCxNQUFKLEVBQVk7QUFDUixVQUFJUSxNQUFNLEdBQUdSLE1BQU0sQ0FBQ1EsTUFBcEI7QUFDQSxVQUFJQyxhQUFhLEdBQUcsS0FBS1AsT0FBekI7QUFDQU8sTUFBQUEsYUFBYSxDQUFDQyxNQUFkLEdBQXVCLENBQXZCO0FBQ0EsVUFBSUMsV0FBVyxHQUFHLEtBQUtSLFlBQUwsR0FBb0IsRUFBdEM7O0FBQ0EsV0FBSyxJQUFJUyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHSixNQUFNLENBQUNFLE1BQTNCLEVBQW1DRSxDQUFDLEVBQXBDLEVBQXdDO0FBQ3BDLFlBQUlDLE9BQU8sR0FBR0osYUFBYSxDQUFDRyxDQUFELENBQWIsR0FBbUJFLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQixFQUF0QixFQUEwQlAsTUFBTSxDQUFDSSxDQUFELENBQWhDLENBQWpDO0FBQ0FDLFFBQUFBLE9BQU8sQ0FBQ0csV0FBUixHQUFzQkYsTUFBTSxDQUFDQyxjQUFQLENBQXNCLEVBQXRCLEVBQTBCUCxNQUFNLENBQUNJLENBQUQsQ0FBTixDQUFVSSxXQUFwQyxDQUF0QjtBQUNBSCxRQUFBQSxPQUFPLENBQUNJLFFBQVIsR0FBbUJILE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQixFQUF0QixFQUEwQlAsTUFBTSxDQUFDSSxDQUFELENBQU4sQ0FBVUssUUFBcEMsQ0FBbkI7O0FBRUEsWUFBSSxDQUFDTixXQUFXLENBQUNFLE9BQU8sQ0FBQ0ssTUFBVCxDQUFoQixFQUFrQztBQUM5QlAsVUFBQUEsV0FBVyxDQUFDRSxPQUFPLENBQUNLLE1BQVQsQ0FBWCxHQUE4QixFQUE5QjtBQUNIOztBQUNEUCxRQUFBQSxXQUFXLENBQUNFLE9BQU8sQ0FBQ0ssTUFBVCxDQUFYLENBQTRCQyxJQUE1QixDQUFpQ04sT0FBakM7QUFDSDtBQUNKO0FBQ0o7O1NBRURPLGFBQUEsb0JBQVlDLElBQVosRUFBMEIsQ0FFekI7O1NBRURDLFVBQUEsbUJBQVc7QUFDUCxRQUFJLENBQUMsS0FBS2YsTUFBVixFQUFrQixPQUFPLEtBQUtILEtBQVo7QUFDbEIsU0FBS0csTUFBTCxHQUFjLEtBQWQ7QUFFQSxRQUFJYyxJQUFJLEdBQUcsRUFBWDtBQUNBQSxJQUFBQSxJQUFJLElBQUlFLGtCQUFNQyxlQUFOLENBQXNCLEtBQUt0QixPQUEzQixDQUFSO0FBRUEsUUFBSUYsTUFBTSxHQUFHLEtBQUtDLE9BQWxCOztBQUNBLFFBQUlELE1BQUosRUFBWTtBQUNScUIsTUFBQUEsSUFBSSxJQUFJRSxrQkFBTUMsZUFBTixDQUFzQnhCLE1BQU0sQ0FBQ1EsTUFBN0IsQ0FBUjtBQUNIOztBQUVELFNBQUtKLEtBQUwsR0FBYSxnQ0FBWWlCLElBQVosRUFBa0IsR0FBbEIsQ0FBYjtBQUVBLFNBQUtELFVBQUwsQ0FBZ0IsS0FBS2hCLEtBQXJCO0FBRUEsV0FBTyxLQUFLQSxLQUFaO0FBQ0g7Ozs7U0F2RUQsZUFBYztBQUNWLGFBQU8sS0FBS0gsT0FBWjtBQUNIOzs7U0FFRCxlQUFZO0FBQ1IsYUFBTyxLQUFLQSxPQUFMLElBQWlCLEtBQUtBLE9BQUwsQ0FBYXdCLElBQWIsR0FBb0IsWUFBNUM7QUFDSDs7O1NBRUQsZUFBYztBQUNWLGFBQU8sS0FBS3ZCLE9BQVo7QUFDSDs7O1NBRUQsZUFBbUI7QUFDZixhQUFPLEtBQUtDLFlBQVo7QUFDSDs7OztFQXBCc0N1Qjs7O0FBZ0YzQzVCLEVBQUUsQ0FBQ0MsYUFBSCxHQUFtQkEsYUFBbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbXVybXVyaGFzaDIgZnJvbSAnLi4vLi4vLi4vcmVuZGVyZXIvbXVybXVyaGFzaDJfZ2MnO1xuaW1wb3J0IHV0aWxzIGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IFBhc3MgZnJvbSAnLi4vLi4vLi4vcmVuZGVyZXIvY29yZS9wYXNzJztcbmltcG9ydCBFZmZlY3QgZnJvbSAnLi9lZmZlY3QnO1xuaW1wb3J0IEVmZmVjdEJhc2UgZnJvbSAnLi9lZmZlY3QtYmFzZSc7XG5cbmNvbnN0IGdmeCA9IGNjLmdmeDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWZmZWN0VmFyaWFudCBleHRlbmRzIEVmZmVjdEJhc2Uge1xuICAgIF9lZmZlY3Q6IEVmZmVjdDtcbiAgICBfcGFzc2VzOiBQYXNzW10gPSBbXTtcbiAgICBfc3RhZ2VQYXNzZXMgPSB7fTtcbiAgICBfaGFzaCA9IDA7XG5cbiAgICBnZXQgZWZmZWN0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VmZmVjdDtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lZmZlY3QgJiYgKHRoaXMuX2VmZmVjdC5uYW1lICsgJyAodmFyaWFudCknKTtcbiAgICB9XG5cbiAgICBnZXQgcGFzc2VzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bhc3NlcztcbiAgICB9XG5cbiAgICBnZXQgc3RhZ2VQYXNzZXMgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3RhZ2VQYXNzZXM7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IgKGVmZmVjdDogRWZmZWN0KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuaW5pdChlZmZlY3QpO1xuICAgIH1cblxuICAgIF9vbkVmZmVjdENoYW5nZWQgKCkge1xuICAgIH1cblxuICAgIGluaXQgKGVmZmVjdDogRWZmZWN0KSB7XG4gICAgICAgIGlmIChlZmZlY3QgaW5zdGFuY2VvZiBFZmZlY3RWYXJpYW50KSB7XG4gICAgICAgICAgICBlZmZlY3QgPSBlZmZlY3QuZWZmZWN0O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZWZmZWN0ID0gZWZmZWN0O1xuICAgICAgICB0aGlzLl9kaXJ0eSA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICBpZiAoZWZmZWN0KSB7XG4gICAgICAgICAgICBsZXQgcGFzc2VzID0gZWZmZWN0LnBhc3NlcztcbiAgICAgICAgICAgIGxldCB2YXJpYW50UGFzc2VzID0gdGhpcy5fcGFzc2VzO1xuICAgICAgICAgICAgdmFyaWFudFBhc3Nlcy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgbGV0IHN0YWdlUGFzc2VzID0gdGhpcy5fc3RhZ2VQYXNzZXMgPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFzc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHZhcmlhbnQgPSB2YXJpYW50UGFzc2VzW2ldID0gT2JqZWN0LnNldFByb3RvdHlwZU9mKHt9LCBwYXNzZXNbaV0pO1xuICAgICAgICAgICAgICAgIHZhcmlhbnQuX3Byb3BlcnRpZXMgPSBPYmplY3Quc2V0UHJvdG90eXBlT2Yoe30sIHBhc3Nlc1tpXS5fcHJvcGVydGllcyk7XG4gICAgICAgICAgICAgICAgdmFyaWFudC5fZGVmaW5lcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZih7fSwgcGFzc2VzW2ldLl9kZWZpbmVzKTtcblxuICAgICAgICAgICAgICAgIGlmICghc3RhZ2VQYXNzZXNbdmFyaWFudC5fc3RhZ2VdKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWdlUGFzc2VzW3ZhcmlhbnQuX3N0YWdlXSA9IFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdGFnZVBhc3Nlc1t2YXJpYW50Ll9zdGFnZV0ucHVzaCh2YXJpYW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUhhc2ggKGhhc2g6IG51bWJlcikge1xuXG4gICAgfVxuXG4gICAgZ2V0SGFzaCAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fZGlydHkpIHJldHVybiB0aGlzLl9oYXNoO1xuICAgICAgICB0aGlzLl9kaXJ0eSA9IGZhbHNlO1xuXG4gICAgICAgIGxldCBoYXNoID0gJyc7XG4gICAgICAgIGhhc2ggKz0gdXRpbHMuc2VyaWFsaXplUGFzc2VzKHRoaXMuX3Bhc3Nlcyk7XG5cbiAgICAgICAgbGV0IGVmZmVjdCA9IHRoaXMuX2VmZmVjdDtcbiAgICAgICAgaWYgKGVmZmVjdCkge1xuICAgICAgICAgICAgaGFzaCArPSB1dGlscy5zZXJpYWxpemVQYXNzZXMoZWZmZWN0LnBhc3Nlcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9oYXNoID0gbXVybXVyaGFzaDIoaGFzaCwgNjY2KTtcblxuICAgICAgICB0aGlzLnVwZGF0ZUhhc2godGhpcy5faGFzaCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2hhc2g7XG4gICAgfVxufVxuXG5jYy5FZmZlY3RWYXJpYW50ID0gRWZmZWN0VmFyaWFudDtcbiJdLCJzb3VyY2VSb290IjoiLyJ9