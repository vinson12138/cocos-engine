
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/memop/recycle-pool.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _timsort = _interopRequireDefault(require("./timsort"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Recycle Pool
 * @class RecyclePool
 */
var RecyclePool = /*#__PURE__*/function () {
  function RecyclePool(fn, size) {
    this._fn = fn;
    this._count = 0;
    this._data = new Array(size);

    for (var i = 0; i < size; ++i) {
      this._data[i] = fn();
    }
  }

  var _proto = RecyclePool.prototype;

  _proto.reset = function reset() {
    this._count = 0;
  };

  _proto.resize = function resize(size) {
    if (size > this._data.length) {
      for (var i = this._data.length; i < size; ++i) {
        this._data[i] = this._fn();
      }
    }
  };

  _proto.add = function add() {
    if (this._count >= this._data.length) {
      this.resize(this._data.length * 2);
    }

    return this._data[this._count++];
  };

  _proto.remove = function remove(idx) {
    if (idx >= this._count) {
      return;
    }

    var last = this._count - 1;
    var tmp = this._data[idx];
    this._data[idx] = this._data[last];
    this._data[last] = tmp;
    this._count -= 1;
  };

  _proto.sort = function sort(cmp) {
    return (0, _timsort["default"])(this._data, 0, this._count, cmp);
  };

  _createClass(RecyclePool, [{
    key: "length",
    get: function get() {
      return this._count;
    }
  }, {
    key: "data",
    get: function get() {
      return this._data;
    }
  }]);

  return RecyclePool;
}();

exports["default"] = RecyclePool;
cc.RecyclePool = RecyclePool;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9yZW5kZXJlci9tZW1vcC9yZWN5Y2xlLXBvb2wuanMiXSwibmFtZXMiOlsiUmVjeWNsZVBvb2wiLCJmbiIsInNpemUiLCJfZm4iLCJfY291bnQiLCJfZGF0YSIsIkFycmF5IiwiaSIsInJlc2V0IiwicmVzaXplIiwibGVuZ3RoIiwiYWRkIiwicmVtb3ZlIiwiaWR4IiwibGFzdCIsInRtcCIsInNvcnQiLCJjbXAiLCJjYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0lBQ3FCQTtBQUNuQix1QkFBWUMsRUFBWixFQUFnQkMsSUFBaEIsRUFBc0I7QUFDcEIsU0FBS0MsR0FBTCxHQUFXRixFQUFYO0FBQ0EsU0FBS0csTUFBTCxHQUFjLENBQWQ7QUFDQSxTQUFLQyxLQUFMLEdBQWEsSUFBSUMsS0FBSixDQUFVSixJQUFWLENBQWI7O0FBRUEsU0FBSyxJQUFJSyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHTCxJQUFwQixFQUEwQixFQUFFSyxDQUE1QixFQUErQjtBQUM3QixXQUFLRixLQUFMLENBQVdFLENBQVgsSUFBZ0JOLEVBQUUsRUFBbEI7QUFDRDtBQUNGOzs7O1NBVURPLFFBQUEsaUJBQVE7QUFDTixTQUFLSixNQUFMLEdBQWMsQ0FBZDtBQUNEOztTQUVESyxTQUFBLGdCQUFPUCxJQUFQLEVBQWE7QUFDWCxRQUFJQSxJQUFJLEdBQUcsS0FBS0csS0FBTCxDQUFXSyxNQUF0QixFQUE4QjtBQUM1QixXQUFLLElBQUlILENBQUMsR0FBRyxLQUFLRixLQUFMLENBQVdLLE1BQXhCLEVBQWdDSCxDQUFDLEdBQUdMLElBQXBDLEVBQTBDLEVBQUVLLENBQTVDLEVBQStDO0FBQzdDLGFBQUtGLEtBQUwsQ0FBV0UsQ0FBWCxJQUFnQixLQUFLSixHQUFMLEVBQWhCO0FBQ0Q7QUFDRjtBQUNGOztTQUVEUSxNQUFBLGVBQU07QUFDSixRQUFJLEtBQUtQLE1BQUwsSUFBZSxLQUFLQyxLQUFMLENBQVdLLE1BQTlCLEVBQXNDO0FBQ3BDLFdBQUtELE1BQUwsQ0FBWSxLQUFLSixLQUFMLENBQVdLLE1BQVgsR0FBb0IsQ0FBaEM7QUFDRDs7QUFFRCxXQUFPLEtBQUtMLEtBQUwsQ0FBVyxLQUFLRCxNQUFMLEVBQVgsQ0FBUDtBQUNEOztTQUVEUSxTQUFBLGdCQUFPQyxHQUFQLEVBQVk7QUFDVixRQUFJQSxHQUFHLElBQUksS0FBS1QsTUFBaEIsRUFBd0I7QUFDdEI7QUFDRDs7QUFFRCxRQUFJVSxJQUFJLEdBQUcsS0FBS1YsTUFBTCxHQUFjLENBQXpCO0FBQ0EsUUFBSVcsR0FBRyxHQUFHLEtBQUtWLEtBQUwsQ0FBV1EsR0FBWCxDQUFWO0FBQ0EsU0FBS1IsS0FBTCxDQUFXUSxHQUFYLElBQWtCLEtBQUtSLEtBQUwsQ0FBV1MsSUFBWCxDQUFsQjtBQUNBLFNBQUtULEtBQUwsQ0FBV1MsSUFBWCxJQUFtQkMsR0FBbkI7QUFDQSxTQUFLWCxNQUFMLElBQWUsQ0FBZjtBQUNEOztTQUVEWSxPQUFBLGNBQUtDLEdBQUwsRUFBVTtBQUNSLFdBQU8seUJBQUssS0FBS1osS0FBVixFQUFpQixDQUFqQixFQUFvQixLQUFLRCxNQUF6QixFQUFpQ2EsR0FBakMsQ0FBUDtBQUNEOzs7O1NBMUNELGVBQWE7QUFDWCxhQUFPLEtBQUtiLE1BQVo7QUFDRDs7O1NBRUQsZUFBVztBQUNULGFBQU8sS0FBS0MsS0FBWjtBQUNEOzs7Ozs7O0FBdUNIYSxFQUFFLENBQUNsQixXQUFILEdBQWlCQSxXQUFqQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzb3J0IGZyb20gJy4vdGltc29ydCc7XG5cbi8qKlxuICogUmVjeWNsZSBQb29sXG4gKiBAY2xhc3MgUmVjeWNsZVBvb2xcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjeWNsZVBvb2wge1xuICBjb25zdHJ1Y3Rvcihmbiwgc2l6ZSkge1xuICAgIHRoaXMuX2ZuID0gZm47XG4gICAgdGhpcy5fY291bnQgPSAwO1xuICAgIHRoaXMuX2RhdGEgPSBuZXcgQXJyYXkoc2l6ZSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7ICsraSkge1xuICAgICAgdGhpcy5fZGF0YVtpXSA9IGZuKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY291bnQ7XG4gIH1cblxuICBnZXQgZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuX2NvdW50ID0gMDtcbiAgfVxuXG4gIHJlc2l6ZShzaXplKSB7XG4gICAgaWYgKHNpemUgPiB0aGlzLl9kYXRhLmxlbmd0aCkge1xuICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX2RhdGEubGVuZ3RoOyBpIDwgc2l6ZTsgKytpKSB7XG4gICAgICAgIHRoaXMuX2RhdGFbaV0gPSB0aGlzLl9mbigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFkZCgpIHtcbiAgICBpZiAodGhpcy5fY291bnQgPj0gdGhpcy5fZGF0YS5sZW5ndGgpIHtcbiAgICAgIHRoaXMucmVzaXplKHRoaXMuX2RhdGEubGVuZ3RoICogMik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2RhdGFbdGhpcy5fY291bnQrK107XG4gIH1cblxuICByZW1vdmUoaWR4KSB7XG4gICAgaWYgKGlkeCA+PSB0aGlzLl9jb3VudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBsYXN0ID0gdGhpcy5fY291bnQgLSAxO1xuICAgIGxldCB0bXAgPSB0aGlzLl9kYXRhW2lkeF07XG4gICAgdGhpcy5fZGF0YVtpZHhdID0gdGhpcy5fZGF0YVtsYXN0XTtcbiAgICB0aGlzLl9kYXRhW2xhc3RdID0gdG1wO1xuICAgIHRoaXMuX2NvdW50IC09IDE7XG4gIH1cblxuICBzb3J0KGNtcCkge1xuICAgIHJldHVybiBzb3J0KHRoaXMuX2RhdGEsIDAsIHRoaXMuX2NvdW50LCBjbXApO1xuICB9XG59XG5cbmNjLlJlY3ljbGVQb29sID0gUmVjeWNsZVBvb2w7Il0sInNvdXJjZVJvb3QiOiIvIn0=