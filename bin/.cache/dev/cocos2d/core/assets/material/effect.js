
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/material/effect.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _effectBase = _interopRequireDefault(require("./effect-base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Effect = /*#__PURE__*/function (_EffectBase) {
  _inheritsLoose(Effect, _EffectBase);

  /**
   * @param {Array} techniques
   */
  function Effect(name, techniques, techniqueIndex, asset) {
    var _this;

    _this = _EffectBase.call(this) || this;
    _this._techniques = [];
    _this._asset = null;

    _this.init(name, techniques, techniqueIndex, asset, true);

    return _this;
  }

  var _proto = Effect.prototype;

  _proto.init = function init(name, techniques, techniqueIndex, asset, createNative) {
    this._name = name;
    this._techniques = techniques;
    this._technique = techniques[techniqueIndex];
    this._asset = asset;
  };

  _proto.switchTechnique = function switchTechnique(index) {
    if (index >= this._techniques.length) {
      cc.warn("Can not switch to technique with index [" + index + "]");
      return;
    }

    this._technique = this._techniques[index];
  };

  _proto.clear = function clear() {
    this._techniques = [];
  };

  _proto.clone = function clone() {
    var techniques = [];

    for (var i = 0; i < this._techniques.length; i++) {
      techniques.push(this._techniques[i].clone());
    }

    var techniqueIndex = this._techniques.indexOf(this._technique);

    return new Effect(this._name, techniques, techniqueIndex, this._asset);
  };

  _createClass(Effect, [{
    key: "technique",
    get: function get() {
      return this._technique;
    }
  }, {
    key: "passes",
    get: function get() {
      return this._technique.passes;
    }
  }]);

  return Effect;
}(_effectBase["default"]);

exports["default"] = Effect;
cc.Effect = Effect;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0cy9tYXRlcmlhbC9lZmZlY3QudHMiXSwibmFtZXMiOlsiRWZmZWN0IiwibmFtZSIsInRlY2huaXF1ZXMiLCJ0ZWNobmlxdWVJbmRleCIsImFzc2V0IiwiX3RlY2huaXF1ZXMiLCJfYXNzZXQiLCJpbml0IiwiY3JlYXRlTmF0aXZlIiwiX25hbWUiLCJfdGVjaG5pcXVlIiwic3dpdGNoVGVjaG5pcXVlIiwiaW5kZXgiLCJsZW5ndGgiLCJjYyIsIndhcm4iLCJjbGVhciIsImNsb25lIiwiaSIsInB1c2giLCJpbmRleE9mIiwicGFzc2VzIiwiRWZmZWN0QmFzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUdBOzs7Ozs7Ozs7Ozs7SUFFcUJBOzs7QUFhakI7QUFDSjtBQUNBO0FBQ0ksa0JBQWFDLElBQWIsRUFBbUJDLFVBQW5CLEVBQStCQyxjQUEvQixFQUErQ0MsS0FBL0MsRUFBc0Q7QUFBQTs7QUFDbEQ7QUFEa0QsVUFkdERDLFdBY3NELEdBZDNCLEVBYzJCO0FBQUEsVUFidERDLE1BYXNELEdBYjdDLElBYTZDOztBQUVsRCxVQUFLQyxJQUFMLENBQVVOLElBQVYsRUFBZ0JDLFVBQWhCLEVBQTRCQyxjQUE1QixFQUE0Q0MsS0FBNUMsRUFBbUQsSUFBbkQ7O0FBRmtEO0FBR3JEOzs7O1NBRURHLE9BQUEsY0FBTU4sSUFBTixFQUFZQyxVQUFaLEVBQXdCQyxjQUF4QixFQUF3Q0MsS0FBeEMsRUFBK0NJLFlBQS9DLEVBQTZEO0FBQ3pELFNBQUtDLEtBQUwsR0FBYVIsSUFBYjtBQUNBLFNBQUtJLFdBQUwsR0FBbUJILFVBQW5CO0FBQ0EsU0FBS1EsVUFBTCxHQUFrQlIsVUFBVSxDQUFDQyxjQUFELENBQTVCO0FBQ0EsU0FBS0csTUFBTCxHQUFjRixLQUFkO0FBQ0g7O1NBRURPLGtCQUFBLHlCQUFpQkMsS0FBakIsRUFBd0I7QUFDcEIsUUFBSUEsS0FBSyxJQUFJLEtBQUtQLFdBQUwsQ0FBaUJRLE1BQTlCLEVBQXNDO0FBQ2xDQyxNQUFBQSxFQUFFLENBQUNDLElBQUgsOENBQW1ESCxLQUFuRDtBQUNBO0FBQ0g7O0FBRUQsU0FBS0YsVUFBTCxHQUFrQixLQUFLTCxXQUFMLENBQWlCTyxLQUFqQixDQUFsQjtBQUNIOztTQUVESSxRQUFBLGlCQUFTO0FBQ0wsU0FBS1gsV0FBTCxHQUFtQixFQUFuQjtBQUNIOztTQUVEWSxRQUFBLGlCQUFTO0FBQ0wsUUFBSWYsVUFBVSxHQUFHLEVBQWpCOztBQUNBLFNBQUssSUFBSWdCLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS2IsV0FBTCxDQUFpQlEsTUFBckMsRUFBNkNLLENBQUMsRUFBOUMsRUFBa0Q7QUFDOUNoQixNQUFBQSxVQUFVLENBQUNpQixJQUFYLENBQWdCLEtBQUtkLFdBQUwsQ0FBaUJhLENBQWpCLEVBQW9CRCxLQUFwQixFQUFoQjtBQUNIOztBQUVELFFBQUlkLGNBQWMsR0FBRyxLQUFLRSxXQUFMLENBQWlCZSxPQUFqQixDQUF5QixLQUFLVixVQUE5QixDQUFyQjs7QUFDQSxXQUFPLElBQUlWLE1BQUosQ0FBVyxLQUFLUyxLQUFoQixFQUF1QlAsVUFBdkIsRUFBbUNDLGNBQW5DLEVBQW1ELEtBQUtHLE1BQXhELENBQVA7QUFDSDs7OztTQTVDRCxlQUFpQjtBQUNiLGFBQU8sS0FBS0ksVUFBWjtBQUNIOzs7U0FFRCxlQUFjO0FBQ1YsYUFBTyxLQUFLQSxVQUFMLENBQWdCVyxNQUF2QjtBQUNIOzs7O0VBWCtCQzs7O0FBb0RwQ1IsRUFBRSxDQUFDZCxNQUFILEdBQVlBLE1BQVoiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuaW1wb3J0IFRlY2huaXF1ZSBmcm9tICcuLi8uLi8uLi9yZW5kZXJlci9jb3JlL3RlY2huaXF1ZSc7XG5pbXBvcnQgRWZmZWN0QmFzZSBmcm9tICcuL2VmZmVjdC1iYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWZmZWN0IGV4dGVuZHMgRWZmZWN0QmFzZSB7XG5cbiAgICBfdGVjaG5pcXVlczogVGVjaG5pcXVlW10gPSBbXTtcbiAgICBfYXNzZXQgPSBudWxsO1xuICAgIFxuICAgIGdldCB0ZWNobmlxdWUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGVjaG5pcXVlO1xuICAgIH1cblxuICAgIGdldCBwYXNzZXMgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGVjaG5pcXVlLnBhc3NlcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0FycmF5fSB0ZWNobmlxdWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKG5hbWUsIHRlY2huaXF1ZXMsIHRlY2huaXF1ZUluZGV4LCBhc3NldCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmluaXQobmFtZSwgdGVjaG5pcXVlcywgdGVjaG5pcXVlSW5kZXgsIGFzc2V0LCB0cnVlKTtcbiAgICB9XG5cbiAgICBpbml0IChuYW1lLCB0ZWNobmlxdWVzLCB0ZWNobmlxdWVJbmRleCwgYXNzZXQsIGNyZWF0ZU5hdGl2ZSkge1xuICAgICAgICB0aGlzLl9uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5fdGVjaG5pcXVlcyA9IHRlY2huaXF1ZXM7XG4gICAgICAgIHRoaXMuX3RlY2huaXF1ZSA9IHRlY2huaXF1ZXNbdGVjaG5pcXVlSW5kZXhdO1xuICAgICAgICB0aGlzLl9hc3NldCA9IGFzc2V0O1xuICAgIH1cblxuICAgIHN3aXRjaFRlY2huaXF1ZSAoaW5kZXgpIHtcbiAgICAgICAgaWYgKGluZGV4ID49IHRoaXMuX3RlY2huaXF1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjYy53YXJuKGBDYW4gbm90IHN3aXRjaCB0byB0ZWNobmlxdWUgd2l0aCBpbmRleCBbJHtpbmRleH1dYCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl90ZWNobmlxdWUgPSB0aGlzLl90ZWNobmlxdWVzW2luZGV4XTtcbiAgICB9XG5cbiAgICBjbGVhciAoKSB7XG4gICAgICAgIHRoaXMuX3RlY2huaXF1ZXMgPSBbXTtcbiAgICB9XG5cbiAgICBjbG9uZSAoKSB7XG4gICAgICAgIGxldCB0ZWNobmlxdWVzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdGVjaG5pcXVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGVjaG5pcXVlcy5wdXNoKHRoaXMuX3RlY2huaXF1ZXNbaV0uY2xvbmUoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdGVjaG5pcXVlSW5kZXggPSB0aGlzLl90ZWNobmlxdWVzLmluZGV4T2YodGhpcy5fdGVjaG5pcXVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBFZmZlY3QodGhpcy5fbmFtZSwgdGVjaG5pcXVlcywgdGVjaG5pcXVlSW5kZXgsIHRoaXMuX2Fzc2V0KTtcbiAgICB9XG59XG5cbmNjLkVmZmVjdCA9IEVmZmVjdDtcbiJdLCJzb3VyY2VSb290IjoiLyJ9