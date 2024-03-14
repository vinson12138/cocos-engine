
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/value-types/rect.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _valueType = _interopRequireDefault(require("./value-type"));

var _CCClass = _interopRequireDefault(require("../platform/CCClass"));

var _vec = _interopRequireDefault(require("./vec2"));

var _size = _interopRequireDefault(require("./size"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * !#en A 2D rectangle defined by x, y position and width, height.
 * !#zh 通过位置和宽高定义的 2D 矩形。
 * @class Rect
 * @extends ValueType
 */

/**
 * !#en
 * Constructor of Rect class.
 * see {{#crossLink "cc/rect:method"}} cc.rect {{/crossLink}} for convenience method.
 * !#zh
 * Rect类的构造函数。可以通过 {{#crossLink "cc/rect:method"}} cc.rect {{/crossLink}} 简便方法进行创建。
 *
 * @method constructor
 * @param {Number} [x=0]
 * @param {Number} [y=0]
 * @param {Number} [w=0]
 * @param {Number} [h=0]
 */
var Rect = /*#__PURE__*/function (_ValueType) {
  _inheritsLoose(Rect, _ValueType);

  /**
   * !#en Creates a rectangle from two coordinate values.
   * !#zh 根据指定 2 个坐标创建出一个矩形区域。
   * @static
   * @method fromMinMax
   * @param {Vec2} v1
   * @param {Vec2} v2
   * @return {Rect}
   * @example
   * cc.Rect.fromMinMax(cc.v2(10, 10), cc.v2(20, 20)); // Rect {x: 10, y: 10, width: 10, height: 10};
   */
  Rect.fromMinMax = function fromMinMax(v1, v2) {
    var min_x = Math.min(v1.x, v2.x);
    var min_y = Math.min(v1.y, v2.y);
    var max_x = Math.max(v1.x, v2.x);
    var max_y = Math.max(v1.y, v2.y);
    return new Rect(min_x, min_y, max_x - min_x, max_y - min_y);
  }
  /**
   * @property {Number} x
   */
  ;

  function Rect(x, y, w, h) {
    var _this;

    if (x === void 0) {
      x = 0;
    }

    if (y === void 0) {
      y = 0;
    }

    if (w === void 0) {
      w = 0;
    }

    if (h === void 0) {
      h = 0;
    }

    _this = _ValueType.call(this) || this;
    _this.x = void 0;
    _this.y = void 0;
    _this.width = void 0;
    _this.height = void 0;

    if (x && typeof x === 'object') {
      y = x.y;
      w = x.width;
      h = x.height;
      x = x.x;
    }

    _this.x = x || 0;
    _this.y = y || 0;
    _this.width = w || 0;
    _this.height = h || 0;
    return _this;
  }
  /**
   * !#en TODO
   * !#zh 克隆一个新的 Rect。
   * @method clone
   * @return {Rect}
   * @example
   * var a = new cc.Rect(0, 0, 10, 10);
   * a.clone();// Rect {x: 0, y: 0, width: 10, height: 10}
   */


  var _proto = Rect.prototype;

  _proto.clone = function clone() {
    return new Rect(this.x, this.y, this.width, this.height);
  }
  /**
   * !#en TODO
   * !#zh 是否等于指定的矩形。
   * @method equals
   * @param {Rect} other
   * @return {Boolean}
   * @example
   * var a = new cc.Rect(0, 0, 10, 10);
   * var b = new cc.Rect(0, 0, 10, 10);
   * a.equals(b);// true;
   */
  ;

  _proto.equals = function equals(other) {
    return other && this.x === other.x && this.y === other.y && this.width === other.width && this.height === other.height;
  };

  /**
   * !#en TODO
   * !#zh 线性插值
   * @method lerp
   * @param {Rect} to
   * @param {Number} ratio - the interpolation coefficient.
   * @param {Rect} [out] - optional, the receiving vector.
   * @return {Rect}
   * @example
   * var a = new cc.Rect(0, 0, 10, 10);
   * var b = new cc.Rect(50, 50, 100, 100);
   * update (dt) {
   *    // method 1;
   *    var c = a.lerp(b, dt * 0.1);
   *    // method 2;
   *    a.lerp(b, dt * 0.1, c);
   * }
   */
  _proto.lerp = function lerp(to, ratio, out) {
    out = out || new Rect();
    var x = this.x;
    var y = this.y;
    var width = this.width;
    var height = this.height;
    out.x = x + (to.x - x) * ratio;
    out.y = y + (to.y - y) * ratio;
    out.width = width + (to.width - width) * ratio;
    out.height = height + (to.height - height) * ratio;
    return out;
  };

  _proto.set = function set(source) {
    this.x = source.x;
    this.y = source.y;
    this.width = source.width;
    this.height = source.height;
    return this;
  }
  /**
   * !#en Check whether the current rectangle intersects with the given one
   * !#zh 当前矩形与指定矩形是否相交。
   * @method intersects
   * @param {Rect} rect
   * @return {Boolean}
   * @example
   * var a = new cc.Rect(0, 0, 10, 10);
   * var b = new cc.Rect(0, 0, 20, 20);
   * a.intersects(b);// true
   */
  ;

  _proto.intersects = function intersects(rect) {
    var maxax = this.x + this.width,
        maxay = this.y + this.height,
        maxbx = rect.x + rect.width,
        maxby = rect.y + rect.height;
    return !(maxax < rect.x || maxbx < this.x || maxay < rect.y || maxby < this.y);
  }
  /**
   * !#en Returns the overlapping portion of 2 rectangles.
   * !#zh 返回 2 个矩形重叠的部分。
   * @method intersection
   * @param {Rect} out Stores the result
   * @param {Rect} rectB
   * @return {Rect} Returns the out parameter
   * @example
   * var a = new cc.Rect(0, 10, 20, 20);
   * var b = new cc.Rect(0, 10, 10, 10);
   * var intersection = new cc.Rect();
   * a.intersection(intersection, b); // intersection {x: 0, y: 10, width: 10, height: 10};
   */
  ;

  _proto.intersection = function intersection(out, rectB) {
    var axMin = this.x,
        ayMin = this.y,
        axMax = this.x + this.width,
        ayMax = this.y + this.height;
    var bxMin = rectB.x,
        byMin = rectB.y,
        bxMax = rectB.x + rectB.width,
        byMax = rectB.y + rectB.height;
    out.x = Math.max(axMin, bxMin);
    out.y = Math.max(ayMin, byMin);
    out.width = Math.min(axMax, bxMax) - out.x;
    out.height = Math.min(ayMax, byMax) - out.y;
    return out;
  }
  /**
   * !#en Check whether the current rect contains the given point
   * !#zh 当前矩形是否包含指定坐标点。
   * Returns true if the point inside this rectangle.
   * @method contains
   * @param {Vec2} point
   * @return {Boolean}
   * @example
   * var a = new cc.Rect(0, 0, 10, 10);
   * var b = new cc.Vec2(0, 5);
   * a.contains(b);// true
   */
  ;

  _proto.contains = function contains(point) {
    return this.x <= point.x && this.x + this.width >= point.x && this.y <= point.y && this.y + this.height >= point.y;
  }
  /**
   * !#en Returns true if the other rect totally inside this rectangle.
   * !#zh 当前矩形是否包含指定矩形。
   * @method containsRect
   * @param {Rect} rect
   * @return {Boolean}
   * @example
   * var a = new cc.Rect(0, 0, 20, 20);
   * var b = new cc.Rect(0, 0, 10, 10);
   * a.containsRect(b);// true
   */
  ;

  _proto.containsRect = function containsRect(rect) {
    return this.x <= rect.x && this.x + this.width >= rect.x + rect.width && this.y <= rect.y && this.y + this.height >= rect.y + rect.height;
  }
  /**
   * !#en Returns the smallest rectangle that contains the current rect and the given rect.
   * !#zh 返回一个包含当前矩形和指定矩形的最小矩形。
   * @method union
   * @param {Rect} out Stores the result
   * @param {Rect} rectB
   * @return {Rect} Returns the out parameter
   * @example
   * var a = new cc.Rect(0, 10, 20, 20);
   * var b = new cc.Rect(0, 10, 10, 10);
   * var union = new cc.Rect();
   * a.union(union, b); // union {x: 0, y: 10, width: 20, height: 20};
   */
  ;

  _proto.union = function union(out, rectB) {
    var ax = this.x,
        ay = this.y,
        aw = this.width,
        ah = this.height;
    var bx = rectB.x,
        by = rectB.y,
        bw = rectB.width,
        bh = rectB.height;
    out.x = Math.min(ax, bx);
    out.y = Math.min(ay, by);
    out.width = Math.max(ax + aw, bx + bw) - out.x;
    out.height = Math.max(ay + ah, by + bh) - out.y;
    return out;
  }
  /**
   * !#en Apply matrix4 to the rect.
   * !#zh 使用 mat4 对矩形进行矩阵转换。
   * @method transformMat4
   * @param out {Rect} The output rect
   * @param mat {Mat4} The matrix4
   */
  ;

  _proto.transformMat4 = function transformMat4(out, mat) {
    var ol = this.x;
    var ob = this.y;
    var or = ol + this.width;
    var ot = ob + this.height;
    var matm = mat.m;
    var lbx = matm[0] * ol + matm[4] * ob + matm[12];
    var lby = matm[1] * ol + matm[5] * ob + matm[13];
    var rbx = matm[0] * or + matm[4] * ob + matm[12];
    var rby = matm[1] * or + matm[5] * ob + matm[13];
    var ltx = matm[0] * ol + matm[4] * ot + matm[12];
    var lty = matm[1] * ol + matm[5] * ot + matm[13];
    var rtx = matm[0] * or + matm[4] * ot + matm[12];
    var rty = matm[1] * or + matm[5] * ot + matm[13];
    var minX = Math.min(lbx, rbx, ltx, rtx);
    var maxX = Math.max(lbx, rbx, ltx, rtx);
    var minY = Math.min(lby, rby, lty, rty);
    var maxY = Math.max(lby, rby, lty, rty);
    out.x = minX;
    out.y = minY;
    out.width = maxX - minX;
    out.height = maxY - minY;
    return out;
  }
  /**
   * !#en Output rect informations to string
   * !#zh 转换为方便阅读的字符串
   * @method toString
   * @return {String}
   * @example
   * var a = new cc.Rect(0, 0, 10, 10);
   * a.toString();// "(0.00, 0.00, 10.00, 10.00)";
   */
  ;

  _proto.toString = function toString() {
    return '(' + this.x.toFixed(2) + ', ' + this.y.toFixed(2) + ', ' + this.width.toFixed(2) + ', ' + this.height.toFixed(2) + ')';
  }
  /**
   * !#en The minimum x value, equals to rect.x
   * !#zh 矩形 x 轴上的最小值，等价于 rect.x。
   * @property xMin
   * @type {Number}
   */
  ;

  _createClass(Rect, [{
    key: "xMin",
    get: function get() {
      return this.x;
    },
    set: function set(v) {
      this.width += this.x - v;
      this.x = v;
    }
    /**
    * !#en The minimum y value, equals to rect.y
    * !#zh 矩形 y 轴上的最小值。
    * @property yMin
    * @type {Number}
    */

  }, {
    key: "yMin",
    get: function get() {
      return this.y;
    },
    set: function set(v) {
      this.height += this.y - v;
      this.y = v;
    }
    /**
    * !#en The maximum x value.
    * !#zh 矩形 x 轴上的最大值。
    * @property xMax
    * @type {Number}
    */

  }, {
    key: "xMax",
    get: function get() {
      return this.x + this.width;
    },
    set: function set(value) {
      this.width = value - this.x;
    }
    /**
    * !#en The maximum y value.
    * !#zh 矩形 y 轴上的最大值。
    * @property yMax
    * @type {Number}
    */

  }, {
    key: "yMax",
    get: function get() {
      return this.y + this.height;
    },
    set: function set(value) {
      this.height = value - this.y;
    }
    /**
    * !#en The position of the center of the rectangle.
    * !#zh 矩形的中心点。
    * @property {Vec2} center
    */

  }, {
    key: "center",
    get: function get() {
      return new _vec["default"](this.x + this.width * 0.5, this.y + this.height * 0.5);
    },
    set: function set(value) {
      this.x = value.x - this.width * 0.5;
      this.y = value.y - this.height * 0.5;
    }
    /**
    * !#en The X and Y position of the rectangle.
    * !#zh 矩形的 x 和 y 坐标。
    * @property {Vec2} origin
    */

  }, {
    key: "origin",
    get: function get() {
      return new _vec["default"](this.x, this.y);
    },
    set: function set(value) {
      this.x = value.x;
      this.y = value.y;
    }
    /**
    * !#en Width and height of the rectangle.
    * !#zh 矩形的大小。
    * @property {Size} size
    */

  }, {
    key: "size",
    get: function get() {
      return new _size["default"](this.width, this.height);
    },
    set: function set(value) {
      this.width = value.width;
      this.height = value.height;
    }
  }]);

  return Rect;
}(_valueType["default"]);

exports["default"] = Rect;

_CCClass["default"].fastDefine('cc.Rect', Rect, {
  x: 0,
  y: 0,
  width: 0,
  height: 0
});

cc.Rect = Rect;
/**
 * @module cc
 */

/**
 * !#en
 * The convenience method to create a new Rect.
 * see {{#crossLink "Rect/Rect:method"}}cc.Rect{{/crossLink}}
 * !#zh
 * 该方法用来快速创建一个新的矩形。{{#crossLink "Rect/Rect:method"}}cc.Rect{{/crossLink}}
 * @method rect
 * @param {Number} [x=0]
 * @param {Number} [y=0]
 * @param {Number} [w=0]
 * @param {Number} [h=0]
 * @return {Rect}
 * @example
 * var a = new cc.Rect(0 , 0, 10, 0);
 */

cc.rect = function rect(x, y, w, h) {
  return new Rect(x, y, w, h);
};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3ZhbHVlLXR5cGVzL3JlY3QudHMiXSwibmFtZXMiOlsiUmVjdCIsImZyb21NaW5NYXgiLCJ2MSIsInYyIiwibWluX3giLCJNYXRoIiwibWluIiwieCIsIm1pbl95IiwieSIsIm1heF94IiwibWF4IiwibWF4X3kiLCJ3IiwiaCIsIndpZHRoIiwiaGVpZ2h0IiwiY2xvbmUiLCJlcXVhbHMiLCJvdGhlciIsImxlcnAiLCJ0byIsInJhdGlvIiwib3V0Iiwic2V0Iiwic291cmNlIiwiaW50ZXJzZWN0cyIsInJlY3QiLCJtYXhheCIsIm1heGF5IiwibWF4YngiLCJtYXhieSIsImludGVyc2VjdGlvbiIsInJlY3RCIiwiYXhNaW4iLCJheU1pbiIsImF4TWF4IiwiYXlNYXgiLCJieE1pbiIsImJ5TWluIiwiYnhNYXgiLCJieU1heCIsImNvbnRhaW5zIiwicG9pbnQiLCJjb250YWluc1JlY3QiLCJ1bmlvbiIsImF4IiwiYXkiLCJhdyIsImFoIiwiYngiLCJieSIsImJ3IiwiYmgiLCJ0cmFuc2Zvcm1NYXQ0IiwibWF0Iiwib2wiLCJvYiIsIm9yIiwib3QiLCJtYXRtIiwibSIsImxieCIsImxieSIsInJieCIsInJieSIsImx0eCIsImx0eSIsInJ0eCIsInJ0eSIsIm1pblgiLCJtYXhYIiwibWluWSIsIm1heFkiLCJ0b1N0cmluZyIsInRvRml4ZWQiLCJ2IiwidmFsdWUiLCJWZWMyIiwiU2l6ZSIsIlZhbHVlVHlwZSIsIkNDQ2xhc3MiLCJmYXN0RGVmaW5lIiwiY2MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkE7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUNxQkE7OztBQUVqQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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N0QsTUFBcEI7QUFDSDs7OztFQS9XNkJnRTs7OztBQWtYbENDLG9CQUFRQyxVQUFSLENBQW1CLFNBQW5CLEVBQThCbEYsSUFBOUIsRUFBb0M7QUFBRU8sRUFBQUEsQ0FBQyxFQUFFLENBQUw7QUFBUUUsRUFBQUEsQ0FBQyxFQUFFLENBQVg7QUFBY00sRUFBQUEsS0FBSyxFQUFFLENBQXJCO0FBQXdCQyxFQUFBQSxNQUFNLEVBQUU7QUFBaEMsQ0FBcEM7O0FBQ0FtRSxFQUFFLENBQUNuRixJQUFILEdBQVVBLElBQVY7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBbUYsRUFBRSxDQUFDeEQsSUFBSCxHQUFVLFNBQVNBLElBQVQsQ0FBZXBCLENBQWYsRUFBa0JFLENBQWxCLEVBQXFCSSxDQUFyQixFQUF3QkMsQ0FBeEIsRUFBMkI7QUFDakMsU0FBTyxJQUFJZCxJQUFKLENBQVNPLENBQVQsRUFBWUUsQ0FBWixFQUFlSSxDQUFmLEVBQWtCQyxDQUFsQixDQUFQO0FBQ0gsQ0FGRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IFZhbHVlVHlwZSBmcm9tICcuL3ZhbHVlLXR5cGUnO1xuaW1wb3J0IENDQ2xhc3MgZnJvbSAnLi4vcGxhdGZvcm0vQ0NDbGFzcyc7XG5pbXBvcnQgVmVjMiBmcm9tICcuL3ZlYzInO1xuaW1wb3J0IE1hdDQgZnJvbSAnLi9tYXQ0JztcbmltcG9ydCBTaXplIGZyb20gJy4vc2l6ZSc7XG5cbi8qKlxuICogISNlbiBBIDJEIHJlY3RhbmdsZSBkZWZpbmVkIGJ5IHgsIHkgcG9zaXRpb24gYW5kIHdpZHRoLCBoZWlnaHQuXG4gKiAhI3poIOmAmui/h+S9jee9ruWSjOWuvemrmOWumuS5ieeahCAyRCDnn6nlvaLjgIJcbiAqIEBjbGFzcyBSZWN0XG4gKiBAZXh0ZW5kcyBWYWx1ZVR5cGVcbiAqL1xuLyoqXG4gKiAhI2VuXG4gKiBDb25zdHJ1Y3RvciBvZiBSZWN0IGNsYXNzLlxuICogc2VlIHt7I2Nyb3NzTGluayBcImNjL3JlY3Q6bWV0aG9kXCJ9fSBjYy5yZWN0IHt7L2Nyb3NzTGlua319IGZvciBjb252ZW5pZW5jZSBtZXRob2QuXG4gKiAhI3poXG4gKiBSZWN057G755qE5p6E6YCg5Ye95pWw44CC5Y+v5Lul6YCa6L+HIHt7I2Nyb3NzTGluayBcImNjL3JlY3Q6bWV0aG9kXCJ9fSBjYy5yZWN0IHt7L2Nyb3NzTGlua319IOeugOS+v+aWueazlei/m+ihjOWIm+W7uuOAglxuICpcbiAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7TnVtYmVyfSBbeD0wXVxuICogQHBhcmFtIHtOdW1iZXJ9IFt5PTBdXG4gKiBAcGFyYW0ge051bWJlcn0gW3c9MF1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbaD0wXVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0IGV4dGVuZHMgVmFsdWVUeXBlIHtcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ3JlYXRlcyBhIHJlY3RhbmdsZSBmcm9tIHR3byBjb29yZGluYXRlIHZhbHVlcy5cbiAgICAgKiAhI3poIOagueaNruaMh+WumiAyIOS4quWdkOagh+WIm+W7uuWHuuS4gOS4quefqeW9ouWMuuWfn+OAglxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWV0aG9kIGZyb21NaW5NYXhcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHYxXG4gICAgICogQHBhcmFtIHtWZWMyfSB2MlxuICAgICAqIEByZXR1cm4ge1JlY3R9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjYy5SZWN0LmZyb21NaW5NYXgoY2MudjIoMTAsIDEwKSwgY2MudjIoMjAsIDIwKSk7IC8vIFJlY3Qge3g6IDEwLCB5OiAxMCwgd2lkdGg6IDEwLCBoZWlnaHQ6IDEwfTtcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbU1pbk1heCAodjE6IFZlYzIsIHYyOiBWZWMyKSB7XG4gICAgICAgIHZhciBtaW5feCA9IE1hdGgubWluKHYxLngsIHYyLngpO1xuICAgICAgICB2YXIgbWluX3kgPSBNYXRoLm1pbih2MS55LCB2Mi55KTtcbiAgICAgICAgdmFyIG1heF94ID0gTWF0aC5tYXgodjEueCwgdjIueCk7XG4gICAgICAgIHZhciBtYXhfeSA9IE1hdGgubWF4KHYxLnksIHYyLnkpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUmVjdChtaW5feCwgbWluX3ksIG1heF94IC0gbWluX3gsIG1heF95IC0gbWluX3kpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB4XG4gICAgICovXG4gICAgeDogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB5XG4gICAgICovXG4gICAgeTogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB3aWR0aFxuICAgICAqL1xuICAgIHdpZHRoOiBudW1iZXI7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGhlaWdodFxuICAgICAqL1xuICAgIGhlaWdodDogbnVtYmVyO1xuICAgIGNvbnN0cnVjdG9yICh4OiBSZWN0IHwgbnVtYmVyID0gMCwgeTogbnVtYmVyID0gMCwgdzogbnVtYmVyID0gMCwgaDogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBpZiAoeCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHkgPSB4Lnk7XG4gICAgICAgICAgICB3ID0geC53aWR0aDtcbiAgICAgICAgICAgIGggPSB4LmhlaWdodDtcbiAgICAgICAgICAgIHggPSB4Lng7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy54ID0geCBhcyBudW1iZXIgfHwgMDtcbiAgICAgICAgdGhpcy55ID0geSB8fCAwO1xuICAgICAgICB0aGlzLndpZHRoID0gdyB8fCAwO1xuICAgICAgICB0aGlzLmhlaWdodCA9IGggfHwgMDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqICEjZW4gVE9ET1xuICAgICAqICEjemgg5YWL6ZqG5LiA5Liq5paw55qEIFJlY3TjgIJcbiAgICAgKiBAbWV0aG9kIGNsb25lXG4gICAgICogQHJldHVybiB7UmVjdH1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBhID0gbmV3IGNjLlJlY3QoMCwgMCwgMTAsIDEwKTtcbiAgICAgKiBhLmNsb25lKCk7Ly8gUmVjdCB7eDogMCwgeTogMCwgd2lkdGg6IDEwLCBoZWlnaHQ6IDEwfVxuICAgICAqL1xuICAgIGNsb25lICgpOiBSZWN0IHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBUT0RPXG4gICAgICogISN6aCDmmK/lkKbnrYnkuo7mjIflrprnmoTnn6nlvaLjgIJcbiAgICAgKiBAbWV0aG9kIGVxdWFsc1xuICAgICAqIEBwYXJhbSB7UmVjdH0gb3RoZXJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGEgPSBuZXcgY2MuUmVjdCgwLCAwLCAxMCwgMTApO1xuICAgICAqIHZhciBiID0gbmV3IGNjLlJlY3QoMCwgMCwgMTAsIDEwKTtcbiAgICAgKiBhLmVxdWFscyhiKTsvLyB0cnVlO1xuICAgICAqL1xuICAgIGVxdWFscyAob3RoZXI6IFJlY3QpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIG90aGVyICYmXG4gICAgICAgICAgICB0aGlzLnggPT09IG90aGVyLnggJiZcbiAgICAgICAgICAgIHRoaXMueSA9PT0gb3RoZXIueSAmJlxuICAgICAgICAgICAgdGhpcy53aWR0aCA9PT0gb3RoZXIud2lkdGggJiZcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID09PSBvdGhlci5oZWlnaHQ7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gVE9ET1xuICAgICAqICEjemgg57q/5oCn5o+S5YC8XG4gICAgICogQG1ldGhvZCBsZXJwXG4gICAgICogQHBhcmFtIHtSZWN0fSB0b1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYXRpbyAtIHRoZSBpbnRlcnBvbGF0aW9uIGNvZWZmaWNpZW50LlxuICAgICAqIEBwYXJhbSB7UmVjdH0gW291dF0gLSBvcHRpb25hbCwgdGhlIHJlY2VpdmluZyB2ZWN0b3IuXG4gICAgICogQHJldHVybiB7UmVjdH1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBhID0gbmV3IGNjLlJlY3QoMCwgMCwgMTAsIDEwKTtcbiAgICAgKiB2YXIgYiA9IG5ldyBjYy5SZWN0KDUwLCA1MCwgMTAwLCAxMDApO1xuICAgICAqIHVwZGF0ZSAoZHQpIHtcbiAgICAgKiAgICAvLyBtZXRob2QgMTtcbiAgICAgKiAgICB2YXIgYyA9IGEubGVycChiLCBkdCAqIDAuMSk7XG4gICAgICogICAgLy8gbWV0aG9kIDI7XG4gICAgICogICAgYS5sZXJwKGIsIGR0ICogMC4xLCBjKTtcbiAgICAgKiB9XG4gICAgICovXG4gICAgbGVycCAodG86IFJlY3QsIHJhdGlvOiBudW1iZXIsIG91dD86IFJlY3QpOiBSZWN0IHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBSZWN0KCk7XG4gICAgICAgIHZhciB4ID0gdGhpcy54O1xuICAgICAgICB2YXIgeSA9IHRoaXMueTtcbiAgICAgICAgdmFyIHdpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgdmFyIGhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgICBvdXQueCA9IHggKyAodG8ueCAtIHgpICogcmF0aW87XG4gICAgICAgIG91dC55ID0geSArICh0by55IC0geSkgKiByYXRpbztcbiAgICAgICAgb3V0LndpZHRoID0gd2lkdGggKyAodG8ud2lkdGggLSB3aWR0aCkgKiByYXRpbztcbiAgICAgICAgb3V0LmhlaWdodCA9IGhlaWdodCArICh0by5oZWlnaHQgLSBoZWlnaHQpICogcmF0aW87XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfTtcblxuICAgIHNldCAoc291cmNlOiBSZWN0KTogUmVjdCB7XG4gICAgICAgIHRoaXMueCA9IHNvdXJjZS54O1xuICAgICAgICB0aGlzLnkgPSBzb3VyY2UueTtcbiAgICAgICAgdGhpcy53aWR0aCA9IHNvdXJjZS53aWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBzb3VyY2UuaGVpZ2h0O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENoZWNrIHdoZXRoZXIgdGhlIGN1cnJlbnQgcmVjdGFuZ2xlIGludGVyc2VjdHMgd2l0aCB0aGUgZ2l2ZW4gb25lXG4gICAgICogISN6aCDlvZPliY3nn6nlvaLkuI7mjIflrprnn6nlvaLmmK/lkKbnm7jkuqTjgIJcbiAgICAgKiBAbWV0aG9kIGludGVyc2VjdHNcbiAgICAgKiBAcGFyYW0ge1JlY3R9IHJlY3RcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGEgPSBuZXcgY2MuUmVjdCgwLCAwLCAxMCwgMTApO1xuICAgICAqIHZhciBiID0gbmV3IGNjLlJlY3QoMCwgMCwgMjAsIDIwKTtcbiAgICAgKiBhLmludGVyc2VjdHMoYik7Ly8gdHJ1ZVxuICAgICAqL1xuICAgIGludGVyc2VjdHMgKHJlY3Q6IFJlY3QpOiBib29sZWFuIHtcbiAgICAgICAgdmFyIG1heGF4ID0gdGhpcy54ICsgdGhpcy53aWR0aCxcbiAgICAgICAgICAgIG1heGF5ID0gdGhpcy55ICsgdGhpcy5oZWlnaHQsXG4gICAgICAgICAgICBtYXhieCA9IHJlY3QueCArIHJlY3Qud2lkdGgsXG4gICAgICAgICAgICBtYXhieSA9IHJlY3QueSArIHJlY3QuaGVpZ2h0O1xuICAgICAgICByZXR1cm4gIShtYXhheCA8IHJlY3QueCB8fCBtYXhieCA8IHRoaXMueCB8fCBtYXhheSA8IHJlY3QueSB8fCBtYXhieSA8IHRoaXMueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBvdmVybGFwcGluZyBwb3J0aW9uIG9mIDIgcmVjdGFuZ2xlcy5cbiAgICAgKiAhI3poIOi/lOWbniAyIOS4quefqeW9oumHjeWPoOeahOmDqOWIhuOAglxuICAgICAqIEBtZXRob2QgaW50ZXJzZWN0aW9uXG4gICAgICogQHBhcmFtIHtSZWN0fSBvdXQgU3RvcmVzIHRoZSByZXN1bHRcbiAgICAgKiBAcGFyYW0ge1JlY3R9IHJlY3RCXG4gICAgICogQHJldHVybiB7UmVjdH0gUmV0dXJucyB0aGUgb3V0IHBhcmFtZXRlclxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGEgPSBuZXcgY2MuUmVjdCgwLCAxMCwgMjAsIDIwKTtcbiAgICAgKiB2YXIgYiA9IG5ldyBjYy5SZWN0KDAsIDEwLCAxMCwgMTApO1xuICAgICAqIHZhciBpbnRlcnNlY3Rpb24gPSBuZXcgY2MuUmVjdCgpO1xuICAgICAqIGEuaW50ZXJzZWN0aW9uKGludGVyc2VjdGlvbiwgYik7IC8vIGludGVyc2VjdGlvbiB7eDogMCwgeTogMTAsIHdpZHRoOiAxMCwgaGVpZ2h0OiAxMH07XG4gICAgICovXG4gICAgaW50ZXJzZWN0aW9uIChvdXQ6IFJlY3QsIHJlY3RCOiBSZWN0KTogUmVjdCB7XG4gICAgICAgIHZhciBheE1pbiA9IHRoaXMueCwgYXlNaW4gPSB0aGlzLnksIGF4TWF4ID0gdGhpcy54ICsgdGhpcy53aWR0aCwgYXlNYXggPSB0aGlzLnkgKyB0aGlzLmhlaWdodDtcbiAgICAgICAgdmFyIGJ4TWluID0gcmVjdEIueCwgYnlNaW4gPSByZWN0Qi55LCBieE1heCA9IHJlY3RCLnggKyByZWN0Qi53aWR0aCwgYnlNYXggPSByZWN0Qi55ICsgcmVjdEIuaGVpZ2h0O1xuICAgICAgICBvdXQueCA9IE1hdGgubWF4KGF4TWluLCBieE1pbik7XG4gICAgICAgIG91dC55ID0gTWF0aC5tYXgoYXlNaW4sIGJ5TWluKTtcbiAgICAgICAgb3V0LndpZHRoID0gTWF0aC5taW4oYXhNYXgsIGJ4TWF4KSAtIG91dC54O1xuICAgICAgICBvdXQuaGVpZ2h0ID0gTWF0aC5taW4oYXlNYXgsIGJ5TWF4KSAtIG91dC55O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2hlY2sgd2hldGhlciB0aGUgY3VycmVudCByZWN0IGNvbnRhaW5zIHRoZSBnaXZlbiBwb2ludFxuICAgICAqICEjemgg5b2T5YmN55+p5b2i5piv5ZCm5YyF5ZCr5oyH5a6a5Z2Q5qCH54K544CCXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBwb2ludCBpbnNpZGUgdGhpcyByZWN0YW5nbGUuXG4gICAgICogQG1ldGhvZCBjb250YWluc1xuICAgICAqIEBwYXJhbSB7VmVjMn0gcG9pbnRcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGEgPSBuZXcgY2MuUmVjdCgwLCAwLCAxMCwgMTApO1xuICAgICAqIHZhciBiID0gbmV3IGNjLlZlYzIoMCwgNSk7XG4gICAgICogYS5jb250YWlucyhiKTsvLyB0cnVlXG4gICAgICovXG4gICAgY29udGFpbnMgKHBvaW50OiBWZWMyKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAodGhpcy54IDw9IHBvaW50LnggJiZcbiAgICAgICAgICAgIHRoaXMueCArIHRoaXMud2lkdGggPj0gcG9pbnQueCAmJlxuICAgICAgICAgICAgdGhpcy55IDw9IHBvaW50LnkgJiZcbiAgICAgICAgICAgIHRoaXMueSArIHRoaXMuaGVpZ2h0ID49IHBvaW50LnkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0cnVlIGlmIHRoZSBvdGhlciByZWN0IHRvdGFsbHkgaW5zaWRlIHRoaXMgcmVjdGFuZ2xlLlxuICAgICAqICEjemgg5b2T5YmN55+p5b2i5piv5ZCm5YyF5ZCr5oyH5a6a55+p5b2i44CCXG4gICAgICogQG1ldGhvZCBjb250YWluc1JlY3RcbiAgICAgKiBAcGFyYW0ge1JlY3R9IHJlY3RcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGEgPSBuZXcgY2MuUmVjdCgwLCAwLCAyMCwgMjApO1xuICAgICAqIHZhciBiID0gbmV3IGNjLlJlY3QoMCwgMCwgMTAsIDEwKTtcbiAgICAgKiBhLmNvbnRhaW5zUmVjdChiKTsvLyB0cnVlXG4gICAgICovXG4gICAgY29udGFpbnNSZWN0IChyZWN0OiBSZWN0KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAodGhpcy54IDw9IHJlY3QueCAmJlxuICAgICAgICAgICAgdGhpcy54ICsgdGhpcy53aWR0aCA+PSByZWN0LnggKyByZWN0LndpZHRoICYmXG4gICAgICAgICAgICB0aGlzLnkgPD0gcmVjdC55ICYmXG4gICAgICAgICAgICB0aGlzLnkgKyB0aGlzLmhlaWdodCA+PSByZWN0LnkgKyByZWN0LmhlaWdodCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBzbWFsbGVzdCByZWN0YW5nbGUgdGhhdCBjb250YWlucyB0aGUgY3VycmVudCByZWN0IGFuZCB0aGUgZ2l2ZW4gcmVjdC5cbiAgICAgKiAhI3poIOi/lOWbnuS4gOS4quWMheWQq+W9k+WJjeefqeW9ouWSjOaMh+WumuefqeW9oueahOacgOWwj+efqeW9ouOAglxuICAgICAqIEBtZXRob2QgdW5pb25cbiAgICAgKiBAcGFyYW0ge1JlY3R9IG91dCBTdG9yZXMgdGhlIHJlc3VsdFxuICAgICAqIEBwYXJhbSB7UmVjdH0gcmVjdEJcbiAgICAgKiBAcmV0dXJuIHtSZWN0fSBSZXR1cm5zIHRoZSBvdXQgcGFyYW1ldGVyXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgYSA9IG5ldyBjYy5SZWN0KDAsIDEwLCAyMCwgMjApO1xuICAgICAqIHZhciBiID0gbmV3IGNjLlJlY3QoMCwgMTAsIDEwLCAxMCk7XG4gICAgICogdmFyIHVuaW9uID0gbmV3IGNjLlJlY3QoKTtcbiAgICAgKiBhLnVuaW9uKHVuaW9uLCBiKTsgLy8gdW5pb24ge3g6IDAsIHk6IDEwLCB3aWR0aDogMjAsIGhlaWdodDogMjB9O1xuICAgICAqL1xuICAgIHVuaW9uIChvdXQ6IFJlY3QsIHJlY3RCOiBSZWN0KTogUmVjdCB7XG4gICAgICAgIHZhciBheCA9IHRoaXMueCwgYXkgPSB0aGlzLnksIGF3ID0gdGhpcy53aWR0aCwgYWggPSB0aGlzLmhlaWdodDtcbiAgICAgICAgdmFyIGJ4ID0gcmVjdEIueCwgYnkgPSByZWN0Qi55LCBidyA9IHJlY3RCLndpZHRoLCBiaCA9IHJlY3RCLmhlaWdodDtcbiAgICAgICAgb3V0LnggPSBNYXRoLm1pbihheCwgYngpO1xuICAgICAgICBvdXQueSA9IE1hdGgubWluKGF5LCBieSk7XG4gICAgICAgIG91dC53aWR0aCA9IE1hdGgubWF4KGF4ICsgYXcsIGJ4ICsgYncpIC0gb3V0Lng7XG4gICAgICAgIG91dC5oZWlnaHQgPSBNYXRoLm1heChheSArIGFoLCBieSArIGJoKSAtIG91dC55O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQXBwbHkgbWF0cml4NCB0byB0aGUgcmVjdC5cbiAgICAgKiAhI3poIOS9v+eUqCBtYXQ0IOWvueefqeW9oui/m+ihjOefqemYtei9rOaNouOAglxuICAgICAqIEBtZXRob2QgdHJhbnNmb3JtTWF0NFxuICAgICAqIEBwYXJhbSBvdXQge1JlY3R9IFRoZSBvdXRwdXQgcmVjdFxuICAgICAqIEBwYXJhbSBtYXQge01hdDR9IFRoZSBtYXRyaXg0XG4gICAgICovXG4gICAgdHJhbnNmb3JtTWF0NCAob3V0OiBSZWN0LCBtYXQ6IE1hdDQpOiBSZWN0IHtcbiAgICAgICAgbGV0IG9sID0gdGhpcy54O1xuICAgICAgICBsZXQgb2IgPSB0aGlzLnk7XG4gICAgICAgIGxldCBvciA9IG9sICsgdGhpcy53aWR0aDtcbiAgICAgICAgbGV0IG90ID0gb2IgKyB0aGlzLmhlaWdodDtcbiAgICAgICAgbGV0IG1hdG0gPSBtYXQubTtcbiAgICAgICAgbGV0IGxieCA9IG1hdG1bMF0gKiBvbCArIG1hdG1bNF0gKiBvYiArIG1hdG1bMTJdO1xuICAgICAgICBsZXQgbGJ5ID0gbWF0bVsxXSAqIG9sICsgbWF0bVs1XSAqIG9iICsgbWF0bVsxM107XG4gICAgICAgIGxldCByYnggPSBtYXRtWzBdICogb3IgKyBtYXRtWzRdICogb2IgKyBtYXRtWzEyXTtcbiAgICAgICAgbGV0IHJieSA9IG1hdG1bMV0gKiBvciArIG1hdG1bNV0gKiBvYiArIG1hdG1bMTNdO1xuICAgICAgICBsZXQgbHR4ID0gbWF0bVswXSAqIG9sICsgbWF0bVs0XSAqIG90ICsgbWF0bVsxMl07XG4gICAgICAgIGxldCBsdHkgPSBtYXRtWzFdICogb2wgKyBtYXRtWzVdICogb3QgKyBtYXRtWzEzXTtcbiAgICAgICAgbGV0IHJ0eCA9IG1hdG1bMF0gKiBvciArIG1hdG1bNF0gKiBvdCArIG1hdG1bMTJdO1xuICAgICAgICBsZXQgcnR5ID0gbWF0bVsxXSAqIG9yICsgbWF0bVs1XSAqIG90ICsgbWF0bVsxM107XG5cbiAgICAgICAgbGV0IG1pblggPSBNYXRoLm1pbihsYngsIHJieCwgbHR4LCBydHgpO1xuICAgICAgICBsZXQgbWF4WCA9IE1hdGgubWF4KGxieCwgcmJ4LCBsdHgsIHJ0eCk7XG4gICAgICAgIGxldCBtaW5ZID0gTWF0aC5taW4obGJ5LCByYnksIGx0eSwgcnR5KTtcbiAgICAgICAgbGV0IG1heFkgPSBNYXRoLm1heChsYnksIHJieSwgbHR5LCBydHkpO1xuXG4gICAgICAgIG91dC54ID0gbWluWDtcbiAgICAgICAgb3V0LnkgPSBtaW5ZO1xuICAgICAgICBvdXQud2lkdGggPSBtYXhYIC0gbWluWDtcbiAgICAgICAgb3V0LmhlaWdodCA9IG1heFkgLSBtaW5ZO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gT3V0cHV0IHJlY3QgaW5mb3JtYXRpb25zIHRvIHN0cmluZ1xuICAgICAqICEjemgg6L2s5o2i5Li65pa55L6/6ZiF6K+755qE5a2X56ym5LiyXG4gICAgICogQG1ldGhvZCB0b1N0cmluZ1xuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBhID0gbmV3IGNjLlJlY3QoMCwgMCwgMTAsIDEwKTtcbiAgICAgKiBhLnRvU3RyaW5nKCk7Ly8gXCIoMC4wMCwgMC4wMCwgMTAuMDAsIDEwLjAwKVwiO1xuICAgICAqL1xuICAgIHRvU3RyaW5nICgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJygnICsgdGhpcy54LnRvRml4ZWQoMikgKyAnLCAnICsgdGhpcy55LnRvRml4ZWQoMikgKyAnLCAnICsgdGhpcy53aWR0aC50b0ZpeGVkKDIpICtcbiAgICAgICAgICAgICcsICcgKyB0aGlzLmhlaWdodC50b0ZpeGVkKDIpICsgJyknO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG1pbmltdW0geCB2YWx1ZSwgZXF1YWxzIHRvIHJlY3QueFxuICAgICAqICEjemgg55+p5b2iIHgg6L205LiK55qE5pyA5bCP5YC877yM562J5Lu35LqOIHJlY3QueOOAglxuICAgICAqIEBwcm9wZXJ0eSB4TWluXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXQgeE1pbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLng7XG4gICAgfVxuICAgIHNldCB4TWluICh2KSB7XG4gICAgICAgIHRoaXMud2lkdGggKz0gdGhpcy54IC0gdjtcbiAgICAgICAgdGhpcy54ID0gdjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqICEjZW4gVGhlIG1pbmltdW0geSB2YWx1ZSwgZXF1YWxzIHRvIHJlY3QueVxuICAgICogISN6aCDnn6nlvaIgeSDovbTkuIrnmoTmnIDlsI/lgLzjgIJcbiAgICAqIEBwcm9wZXJ0eSB5TWluXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICovXG4gICAgZ2V0IHlNaW4gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy55O1xuICAgIH1cbiAgICBzZXQgeU1pbiAodikge1xuICAgICAgICB0aGlzLmhlaWdodCArPSB0aGlzLnkgLSB2O1xuICAgICAgICB0aGlzLnkgPSB2O1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgKiAhI2VuIFRoZSBtYXhpbXVtIHggdmFsdWUuXG4gICAgKiAhI3poIOefqeW9oiB4IOi9tOS4iueahOacgOWkp+WAvOOAglxuICAgICogQHByb3BlcnR5IHhNYXhcbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKi9cbiAgICBnZXQgeE1heCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKyB0aGlzLndpZHRoO1xuICAgIH1cbiAgICBzZXQgeE1heCAodmFsdWUpIHtcbiAgICAgICAgdGhpcy53aWR0aCA9IHZhbHVlIC0gdGhpcy54O1xuICAgIH1cblxuICAgIC8qKlxuICAgICogISNlbiBUaGUgbWF4aW11bSB5IHZhbHVlLlxuICAgICogISN6aCDnn6nlvaIgeSDovbTkuIrnmoTmnIDlpKflgLzjgIJcbiAgICAqIEBwcm9wZXJ0eSB5TWF4XG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICovXG4gICAgZ2V0IHlNYXggKCkge1xuICAgICAgICByZXR1cm4gdGhpcy55ICsgdGhpcy5oZWlnaHQ7XG4gICAgfVxuICAgIHNldCB5TWF4ICh2YWx1ZSkge1xuICAgICAgICB0aGlzLmhlaWdodCA9IHZhbHVlIC0gdGhpcy55O1xuICAgIH1cblxuICAgIC8qKlxuICAgICogISNlbiBUaGUgcG9zaXRpb24gb2YgdGhlIGNlbnRlciBvZiB0aGUgcmVjdGFuZ2xlLlxuICAgICogISN6aCDnn6nlvaLnmoTkuK3lv4PngrnjgIJcbiAgICAqIEBwcm9wZXJ0eSB7VmVjMn0gY2VudGVyXG4gICAgKi9cbiAgICBnZXQgY2VudGVyICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCArIHRoaXMud2lkdGggKiAwLjUsXG4gICAgICAgICAgICB0aGlzLnkgKyB0aGlzLmhlaWdodCAqIDAuNSk7XG4gICAgfVxuICAgIHNldCBjZW50ZXIgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMueCA9IHZhbHVlLnggLSB0aGlzLndpZHRoICogMC41O1xuICAgICAgICB0aGlzLnkgPSB2YWx1ZS55IC0gdGhpcy5oZWlnaHQgKiAwLjU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiAhI2VuIFRoZSBYIGFuZCBZIHBvc2l0aW9uIG9mIHRoZSByZWN0YW5nbGUuXG4gICAgKiAhI3poIOefqeW9oueahCB4IOWSjCB5IOWdkOagh+OAglxuICAgICogQHByb3BlcnR5IHtWZWMyfSBvcmlnaW5cbiAgICAqL1xuICAgIGdldCBvcmlnaW4gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy54LCB0aGlzLnkpO1xuICAgIH1cbiAgICBzZXQgb3JpZ2luICh2YWx1ZSkge1xuICAgICAgICB0aGlzLnggPSB2YWx1ZS54O1xuICAgICAgICB0aGlzLnkgPSB2YWx1ZS55O1xuICAgIH1cblxuICAgIC8qKlxuICAgICogISNlbiBXaWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSByZWN0YW5nbGUuXG4gICAgKiAhI3poIOefqeW9oueahOWkp+Wwj+OAglxuICAgICogQHByb3BlcnR5IHtTaXplfSBzaXplXG4gICAgKi9cbiAgICBnZXQgc2l6ZSAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgU2l6ZSh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgfVxuICAgIHNldCBzaXplICh2YWx1ZSkge1xuICAgICAgICB0aGlzLndpZHRoID0gdmFsdWUud2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gdmFsdWUuaGVpZ2h0O1xuICAgIH1cbn1cblxuQ0NDbGFzcy5mYXN0RGVmaW5lKCdjYy5SZWN0JywgUmVjdCwgeyB4OiAwLCB5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwIH0pO1xuY2MuUmVjdCA9IFJlY3Q7XG5cblxuLyoqXG4gKiBAbW9kdWxlIGNjXG4gKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBUaGUgY29udmVuaWVuY2UgbWV0aG9kIHRvIGNyZWF0ZSBhIG5ldyBSZWN0LlxuICogc2VlIHt7I2Nyb3NzTGluayBcIlJlY3QvUmVjdDptZXRob2RcIn19Y2MuUmVjdHt7L2Nyb3NzTGlua319XG4gKiAhI3poXG4gKiDor6Xmlrnms5XnlKjmnaXlv6vpgJ/liJvlu7rkuIDkuKrmlrDnmoTnn6nlvaLjgIJ7eyNjcm9zc0xpbmsgXCJSZWN0L1JlY3Q6bWV0aG9kXCJ9fWNjLlJlY3R7ey9jcm9zc0xpbmt9fVxuICogQG1ldGhvZCByZWN0XG4gKiBAcGFyYW0ge051bWJlcn0gW3g9MF1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbeT0wXVxuICogQHBhcmFtIHtOdW1iZXJ9IFt3PTBdXG4gKiBAcGFyYW0ge051bWJlcn0gW2g9MF1cbiAqIEByZXR1cm4ge1JlY3R9XG4gKiBAZXhhbXBsZVxuICogdmFyIGEgPSBuZXcgY2MuUmVjdCgwICwgMCwgMTAsIDApO1xuICovXG5jYy5yZWN0ID0gZnVuY3Rpb24gcmVjdCAoeCwgeSwgdywgaCkge1xuICAgIHJldHVybiBuZXcgUmVjdCh4LCB5LCB3LCBoKTtcbn07XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==