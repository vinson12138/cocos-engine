
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/value-types/color.js';
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

var _misc = _interopRequireDefault(require("../utils/misc"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * !#en
 * Representation of RGBA colors.
 *
 * Each color component is a floating point value with a range from 0 to 255.
 *
 * You can also use the convenience method {{#crossLink "cc/color:method"}}cc.color{{/crossLink}} to create a new Color.
 *
 * !#zh
 * cc.Color 用于表示颜色。
 *
 * 它包含 RGBA 四个以浮点数保存的颜色分量，每个的值都在 0 到 255 之间。
 *
 * 您也可以通过使用 {{#crossLink "cc/color:method"}}cc.color{{/crossLink}} 的便捷方法来创建一个新的 Color。
 *
 * @class Color
 * @extends ValueType
 */
var Color = /*#__PURE__*/function (_ValueType) {
  _inheritsLoose(Color, _ValueType);

  /**
   * Copy content of a color into another.
   * @method copy
   * @typescript
   * copy (out: Color, a: Color): Color
   * @static
   */
  Color.copy = function copy(out, a) {
    out.r = a.r;
    out.g = a.g;
    out.b = a.b;
    out.a = a.a;
    return out;
  }
  /**
   * Clone a new color.
   * @method clone
   * @typescript
   * clone (a: Color): Color
   * @static
   */
  ;

  Color.clone = function clone(a) {
    return new Color(a.r, a.g, a.b, a.a);
  }
  /**
   * Set the components of a color to the given values.
   * @method set
   * @typescript
   * set (out: Color, r?: number, g?: number, b?: number, a?: number): Color
   * @static
   */
  ;

  Color.set = function set(out, r, g, b, a) {
    if (r === void 0) {
      r = 255;
    }

    if (g === void 0) {
      g = 255;
    }

    if (b === void 0) {
      b = 255;
    }

    if (a === void 0) {
      a = 255;
    }

    out.r = r;
    out.g = g;
    out.b = b;
    out.a = a;
    return out;
  }
  /**
   * Converts the hexadecimal formal color into rgb formal.
   * @method fromHex
   * @typescript
   * fromHex (out: Color, hex: number): Color
   * @static
   * @deprecated
   */
  ;

  Color.fromHex = function fromHex(out, hex) {
    var r = (hex >> 24) / 255.0;
    var g = (hex >> 16 & 0xff) / 255.0;
    var b = (hex >> 8 & 0xff) / 255.0;
    var a = (hex & 0xff) / 255.0;
    out.r = r;
    out.g = g;
    out.b = b;
    out.a = a;
    return out;
  }
  /**
   * Converts the hexadecimal formal color into rgb formal.
   * @method fromHEX
   * @typescript
   * fromHEX (out: Color, hex: string): Color
   * @static
   */
  ;

  Color.fromHEX = function fromHEX(out, hexString) {
    hexString = hexString.indexOf('#') === 0 ? hexString.substring(1) : hexString;
    out.r = parseInt(hexString.substr(0, 2), 16) || 0;
    out.g = parseInt(hexString.substr(2, 2), 16) || 0;
    out.b = parseInt(hexString.substr(4, 2), 16) || 0;
    out.a = parseInt(hexString.substr(6, 2), 16) || 255;
    out._val = (out.a << 24 >>> 0) + (out.b << 16) + (out.g << 8) + out.r;
    return out;
  }
  /**
   * Add components of two colors, respectively.
   * @method add
   * @typescript
   * add (out: Color, a: Color, b: Color): Color
   * @static
   */
  ;

  Color.add = function add(out, a, b) {
    out.r = a.r + b.r;
    out.g = a.g + b.g;
    out.b = a.b + b.b;
    out.a = a.a + b.a;
    return out;
  }
  /**
   * Subtract components of color b from components of color a, respectively.
   * @method subtract
   * @typescript
   * subtract (out: Color, a: Color, b: Color): Color
   * @static
   */
  ;

  Color.subtract = function subtract(out, a, b) {
    out.r = a.r - b.r;
    out.g = a.g - b.g;
    out.b = a.b - b.b;
    out.a = a.a - b.a;
    return out;
  }
  /**
   * Multiply components of two colors, respectively.
   * @method multiply
   * @typescript
   * multiply (out: Color, a: Color, b: Color): Color
   * @static
   */
  ;

  Color.multiply = function multiply(out, a, b) {
    out.r = a.r * b.r;
    out.g = a.g * b.g;
    out.b = a.b * b.b;
    out.a = a.a * b.a;
    return out;
  }
  /**
   * Divide components of color a by components of color b, respectively.
   * @method divide
   * @typescript
   * divide (out: Color, a: Color, b: Color): Color
   * @static
   */
  ;

  Color.divide = function divide(out, a, b) {
    out.r = a.r / b.r;
    out.g = a.g / b.g;
    out.b = a.b / b.b;
    out.a = a.a / b.a;
    return out;
  }
  /**
   * Scales a color by a number.
   * @method scale
   * @typescript
   * scale (out: Color, a: Color, b: number): Color
   * @static
   */
  ;

  Color.scale = function scale(out, a, b) {
    out.r = a.r * b;
    out.g = a.g * b;
    out.b = a.b * b;
    out.a = a.a * b;
    return out;
  }
  /**
   * Performs a linear interpolation between two colors.
   * @method lerp
   * @typescript
   * lerp (out: Color, a: Color, b: Color, t: number): Color
   * @static
   */
  ;

  Color.lerp = function lerp(out, a, b, t) {
    var ar = a.r,
        ag = a.g,
        ab = a.b,
        aa = a.a;
    out.r = ar + t * (b.r - ar);
    out.g = ag + t * (b.g - ag);
    out.b = ab + t * (b.b - ab);
    out.a = aa + t * (b.a - aa);
    return out;
  }
  /**
   * !#zh 颜色转数组
   * !#en Turn an array of colors
   * @method toArray
   * @typescript
   * toArray <Out extends IWritableArrayLike<number>> (out: Out, a: IColorLike, ofs?: number): Out
   * @param ofs 数组起始偏移量
   * @static
   */
  ;

  Color.toArray = function toArray(out, a, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    var scale = a instanceof Color || a.a > 1 ? 1 / 255 : 1;
    out[ofs + 0] = a.r * scale;
    out[ofs + 1] = a.g * scale;
    out[ofs + 2] = a.b * scale;
    out[ofs + 3] = a.a * scale;
    return out;
  }
  /**
   * !#zh 数组转颜色
   * !#en An array of colors turn
   * @method fromArray
   * @typescript
   * fromArray <Out extends IColorLike> (arr: IWritableArrayLike<number>, out: Out, ofs?: number): Out
   * @param ofs 数组起始偏移量
   * @static
   */
  ;

  Color.fromArray = function fromArray(arr, out, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    out.r = arr[ofs + 0] * 255;
    out.g = arr[ofs + 1] * 255;
    out.b = arr[ofs + 2] * 255;
    out.a = arr[ofs + 3] * 255;
    return out;
  }
  /**
   * !#zh 颜色 RGB 预乘 Alpha 通道
   * !#en RGB premultiply alpha channel
   * @method premultiplyAlpha
   * @typescript
   * premultiplyAlpha <Out extends IColorLike> (out: Out, a: IColorLike)
   * @param out 返回颜色
   * @param color 预乘处理的目标颜色
   * @static
   */
  ;

  Color.premultiplyAlpha = function premultiplyAlpha(out, color) {
    var alpha = color.a / 255.0;
    out.r = color.r * alpha;
    out.g = color.g * alpha;
    out.b = color.b * alpha;

    out._fastSetA(color.a);

    return out;
  };

  /**
   * @method constructor
   * @param {Number} [r=0] - red component of the color, default value is 0.
   * @param {Number} [g=0] - green component of the color, defualt value is 0.
   * @param {Number} [b=0] - blue component of the color, default value is 0.
   * @param {Number} [a=255] - alpha component of the color, default value is 255.
   */
  function Color(r, g, b, a) {
    var _this;

    if (r === void 0) {
      r = 0;
    }

    if (g === void 0) {
      g = 0;
    }

    if (b === void 0) {
      b = 0;
    }

    if (a === void 0) {
      a = 255;
    }

    _this = _ValueType.call(this) || this;
    _this._val = 0;

    if (typeof r === 'object') {
      g = r.g;
      b = r.b;
      a = r.a;
      r = r.r;
    }

    _this._val = (a << 24 >>> 0) + (b << 16) + (g << 8) + (r | 0);
    return _this;
  }
  /**
   * !#en Clone a new color from the current color.
   * !#zh 克隆当前颜色。
   * @method clone
   * @return {Color} Newly created color.
   * @example
   * var color = new cc.Color();
   * var newColor = color.clone();// Color {r: 0, g: 0, b: 0, a: 255}
   */


  var _proto = Color.prototype;

  _proto.clone = function clone() {
    var ret = new Color();
    ret._val = this._val;
    return ret;
  }
  /**
   * !#en TODO
   * !#zh 判断两个颜色是否相等。
   * @method equals
   * @param {Color} other
   * @return {Boolean}
   * @example
   * var color1 = cc.Color.WHITE;
   * var color2 = new cc.Color(255, 255, 255);
   * cc.log(color1.equals(color2)); // true;
   * color2 = cc.Color.RED;
   * cc.log(color2.equals(color1)); // false;
   */
  ;

  _proto.equals = function equals(other) {
    return other && this._val === other._val;
  }
  /**
   * !#en TODO
   * !#zh 线性插值
   * @method lerp
   * @param {Color} to
   * @param {number} ratio - the interpolation coefficient.
   * @param {Color} [out] - optional, the receiving vector.
   * @return {Color}
   * @example {@link cocos2d/core/value-types/CCColor/lerp.js}
   */
  ;

  _proto.lerp = function lerp(to, ratio, out) {
    out = out || new Color();
    var r = this.r;
    var g = this.g;
    var b = this.b;
    var a = this.a;
    out.r = r + (to.r - r) * ratio;
    out.g = g + (to.g - g) * ratio;
    out.b = b + (to.b - b) * ratio;
    out.a = a + (to.a - a) * ratio;
    return out;
  };

  /**
   * !#en TODO
   * !#zh 转换为方便阅读的字符串。
   * @method toString
   * @return {String}
   * @example
   * var color = cc.Color.WHITE;
   * color.toString(); // "rgba(255, 255, 255, 255)"
   */
  _proto.toString = function toString() {
    return "rgba(" + this.r.toFixed() + ", " + this.g.toFixed() + ", " + this.b.toFixed() + ", " + this.a.toFixed() + ")";
  };

  /**
   * !#en Gets red channel value
   * !#zh 获取当前颜色的红色值。
   * @method getR
   * @return {Number} red value.
   */
  _proto.getR = function getR() {
    return this._val & 0x000000ff;
  }
  /**
   * !#en Sets red value and return the current color object
   * !#zh 设置当前的红色值，并返回当前对象。
   * @method setR
   * @param {Number} red - the new Red component.
   * @return {Color} this color.
   * @example
   * var color = new cc.Color();
   * color.setR(255); // Color {r: 255, g: 0, b: 0, a: 255}
   */
  ;

  _proto.setR = function setR(red) {
    red = ~~_misc["default"].clampf(red, 0, 255);
    this._val = (this._val & 0xffffff00 | red) >>> 0;
    return this;
  }
  /**
   * !#en Gets green channel value
   * !#zh 获取当前颜色的绿色值。
   * @method getG
   * @return {Number} green value.
   */
  ;

  _proto.getG = function getG() {
    return (this._val & 0x0000ff00) >> 8;
  }
  /**
   * !#en Sets green value and return the current color object
   * !#zh 设置当前的绿色值，并返回当前对象。
   * @method setG
   * @param {Number} green - the new Green component.
   * @return {Color} this color.
   * @example
   * var color = new cc.Color();
   * color.setG(255); // Color {r: 0, g: 255, b: 0, a: 255}
   */
  ;

  _proto.setG = function setG(green) {
    green = ~~_misc["default"].clampf(green, 0, 255);
    this._val = (this._val & 0xffff00ff | green << 8) >>> 0;
    return this;
  }
  /**
   * !#en Gets blue channel value
   * !#zh 获取当前颜色的蓝色值。
   * @method getB
   * @return {Number} blue value.
   */
  ;

  _proto.getB = function getB() {
    return (this._val & 0x00ff0000) >> 16;
  }
  /**
   * !#en Sets blue value and return the current color object
   * !#zh 设置当前的蓝色值，并返回当前对象。
   * @method setB
   * @param {Number} blue - the new Blue component.
   * @return {Color} this color.
   * @example
   * var color = new cc.Color();
   * color.setB(255); // Color {r: 0, g: 0, b: 255, a: 255}
   */
  ;

  _proto.setB = function setB(blue) {
    blue = ~~_misc["default"].clampf(blue, 0, 255);
    this._val = (this._val & 0xff00ffff | blue << 16) >>> 0;
    return this;
  }
  /**
   * !#en Gets alpha channel value
   * !#zh 获取当前颜色的透明度值。
   * @method getA
   * @return {Number} alpha value.
   */
  ;

  _proto.getA = function getA() {
    return (this._val & 0xff000000) >>> 24;
  }
  /**
   * !#en Sets alpha value and return the current color object
   * !#zh 设置当前的透明度，并返回当前对象。
   * @method setA
   * @param {Number} alpha - the new Alpha component.
   * @return {Color} this color.
   * @example
   * var color = new cc.Color();
   * color.setA(0); // Color {r: 0, g: 0, b: 0, a: 0}
   */
  ;

  _proto.setA = function setA(alpha) {
    alpha = ~~_misc["default"].clampf(alpha, 0, 255);
    this._val = (this._val & 0x00ffffff | alpha << 24) >>> 0;
    return this;
  }
  /**
   * !#en Convert color to css format.
   * !#zh 转换为 CSS 格式。
   * @method toCSS
   * @param {String} [opt="rgba"] - "rgba", "rgb", "#rgb" or "#rrggbb".
   * @return {String}
   * @example
   * var color = cc.Color.BLACK;
   * color.toCSS();          // "rgba(0,0,0,1.00)";
   * color.toCSS("rgba");    // "rgba(0,0,0,1.00)";
   * color.toCSS("rgb");     // "rgba(0,0,0)";
   * color.toCSS("#rgb");    // "#000";
   * color.toCSS("#rrggbb"); // "#000000";
   */
  ;

  _proto.toCSS = function toCSS(opt) {
    if (!opt || opt === 'rgba') {
      return "rgba(" + this.r + "," + this.g + "," + this.b + "," + (this.a / 255).toFixed(2) + ")";
    } else if (opt === 'rgb') {
      return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    } else {
      return '#' + this.toHEX(opt);
    }
  }
  /**
   * !#en Read hex string and store color data into the current color object, the hex string must be formated as rgba or rgb.
   * !#zh 读取 16 进制颜色。
   * @method fromHEX
   * @param {String} hexString
   * @return {Color}
   * @chainable
   * @example
   * var color = cc.Color.BLACK;
   * color.fromHEX("#FFFF33"); // Color {r: 255, g: 255, b: 51, a: 255};
   */
  ;

  _proto.fromHEX = function fromHEX(hexString) {
    hexString = hexString.indexOf('#') === 0 ? hexString.substring(1) : hexString;
    var r = parseInt(hexString.substr(0, 2), 16) || 0;
    var g = parseInt(hexString.substr(2, 2), 16) || 0;
    var b = parseInt(hexString.substr(4, 2), 16) || 0;
    var a = parseInt(hexString.substr(6, 2), 16) || 255;
    this._val = (a << 24 >>> 0) + (b << 16) + (g << 8) + r;
    return this;
  }
  /**
   * !#en convert Color to HEX color string.
   * !#zh 转换为 16 进制。
   * @method toHEX
   * @param {String} [fmt="#rrggbb"] - "#rgb", "#rrggbb" or "#rrggbbaa".
   * @return {String}
   * @example
   * var color = cc.Color.BLACK;
   * color.toHEX("#rgb");     // "000";
   * color.toHEX("#rrggbb");  // "000000";
   */
  ;

  _proto.toHEX = function toHEX(fmt) {
    var prefix = '0'; // #rrggbb

    var hex = [(this.r < 16 ? prefix : '') + this.r.toString(16), (this.g < 16 ? prefix : '') + this.g.toString(16), (this.b < 16 ? prefix : '') + this.b.toString(16)];

    if (fmt === '#rgb') {
      hex[0] = hex[0][0];
      hex[1] = hex[1][0];
      hex[2] = hex[2][0];
    } else if (fmt === '#rrggbbaa') {
      hex.push((this.a < 16 ? prefix : '') + this.a.toString(16));
    }

    return hex.join('');
  };

  /**
   * !#en Convert to 24bit rgb value.
   * !#zh 转换为 24bit 的 RGB 值。
   * @method toRGBValue
   * @return {Number}
   * @example
   * var color = cc.Color.YELLOW;
   * color.toRGBValue(); // 16771844;
   */
  _proto.toRGBValue = function toRGBValue() {
    return this._val & 0x00ffffff;
  }
  /**
   * !#en Read HSV model color and convert to RGB color
   * !#zh 读取 HSV（色彩模型）格式。
   * @method fromHSV
   * @param {Number} h
   * @param {Number} s
   * @param {Number} v
   * @return {Color}
   * @chainable
   * @example
   * var color = cc.Color.YELLOW;
   * color.fromHSV(0, 0, 1); // Color {r: 255, g: 255, b: 255, a: 255};
   */
  ;

  _proto.fromHSV = function fromHSV(h, s, v) {
    var r, g, b;

    if (s === 0) {
      r = g = b = v;
    } else {
      if (v === 0) {
        r = g = b = 0;
      } else {
        if (h === 1) h = 0;
        h *= 6;
        var i = Math.floor(h);
        var f = h - i;
        var p = v * (1 - s);
        var q = v * (1 - s * f);
        var t = v * (1 - s * (1 - f));

        switch (i) {
          case 0:
            r = v;
            g = t;
            b = p;
            break;

          case 1:
            r = q;
            g = v;
            b = p;
            break;

          case 2:
            r = p;
            g = v;
            b = t;
            break;

          case 3:
            r = p;
            g = q;
            b = v;
            break;

          case 4:
            r = t;
            g = p;
            b = v;
            break;

          case 5:
            r = v;
            g = p;
            b = q;
            break;
        }
      }
    }

    r *= 255;
    g *= 255;
    b *= 255;
    this._val = (this.a << 24 >>> 0) + (b << 16) + (g << 8) + (r | 0);
    return this;
  }
  /**
   * !#en Transform to HSV model color
   * !#zh 转换为 HSV（色彩模型）格式。
   * @method toHSV
   * @return {Object} - {h: number, s: number, v: number}.
   * @example
   * var color = cc.Color.YELLOW;
   * color.toHSV(); // Object {h: 0.1533864541832669, s: 0.9843137254901961, v: 1};
   */
  ;

  _proto.toHSV = function toHSV() {
    var r = this.r / 255;
    var g = this.g / 255;
    var b = this.b / 255;
    var hsv = {
      h: 0,
      s: 0,
      v: 0
    };
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var delta = 0;
    hsv.v = max;
    hsv.s = max ? (max - min) / max : 0;
    if (!hsv.s) hsv.h = 0;else {
      delta = max - min;
      if (r === max) hsv.h = (g - b) / delta;else if (g === max) hsv.h = 2 + (b - r) / delta;else hsv.h = 4 + (r - g) / delta;
      hsv.h /= 6;
      if (hsv.h < 0) hsv.h += 1.0;
    }
    return hsv;
  }
  /**
   * !#en Set the color
   * !#zh 设置颜色
   * @method set
   * @typescript
   * set (color: Color): Color
   * @param {Color} color
   */
  ;

  _proto.set = function set(color) {
    if (color._val) {
      this._val = color._val;
    } else {
      this.r = color.r;
      this.g = color.g;
      this.b = color.b;
      this.a = color.a;
    }

    return this;
  };

  _proto._fastSetA = function _fastSetA(alpha) {
    this._val = (this._val & 0x00ffffff | alpha << 24) >>> 0;
  }
  /**
   * !#en Multiplies the current color by the specified color
   * !#zh 将当前颜色乘以与指定颜色
   * @method multiply
   * @return {Color}
   * @param {Color} other
   */
  ;

  _proto.multiply = function multiply(other) {
    var r = (this._val & 0x000000ff) * other.r >> 8;
    var g = (this._val & 0x0000ff00) * other.g >> 8;
    var b = (this._val & 0x00ff0000) * other.b >> 8;
    var a = ((this._val & 0xff000000) >>> 8) * other.a;
    this._val = a & 0xff000000 | b & 0x00ff0000 | g & 0x0000ff00 | r & 0x000000ff;
    return this;
  };

  _createClass(Color, [{
    key: "r",
    get:
    /**
     * !#en Get or set red channel value
     * !#zh 获取或者设置红色通道
     * @property {number} r
     */
    function get() {
      return this.getR();
    },
    set: function set(v) {
      this.setR(v);
    }
    /**
     * !#en Get or set green channel value
     * !#zh 获取或者设置绿色通道
     * @property {number} g
     */

  }, {
    key: "g",
    get: function get() {
      return this.getG();
    },
    set: function set(v) {
      this.setG(v);
    }
    /**
     * !#en Get or set blue channel value
     * !#zh 获取或者设置蓝色通道
     * @property {number} b
     */

  }, {
    key: "b",
    get: function get() {
      return this.getB();
    },
    set: function set(v) {
      this.setB(v);
    }
    /**
     * !#en Get or set alpha channel value
     * !#zh 获取或者设置透明通道
     * @property {number} a
     */

  }, {
    key: "a",
    get: function get() {
      return this.getA();
    },
    set: function set(v) {
      this.setA(v);
    }
  }], [{
    key: "WHITE",
    get:
    /**
     * !#en Solid white, RGBA is [255, 255, 255, 255].
     * !#zh 纯白色，RGBA 是 [255, 255, 255, 255]。
     * @property WHITE
     * @type {Color}
     * @static
     */
    function get() {
      return new Color(255, 255, 255, 255);
    }
  }, {
    key: "BLACK",
    get:
    /**
     * !#en Solid black, RGBA is [0, 0, 0, 255].
     * !#zh 纯黑色，RGBA 是 [0, 0, 0, 255]。
     * @property BLACK
     * @type {Color}
     * @static
     */
    function get() {
      return new Color(0, 0, 0, 255);
    }
  }, {
    key: "TRANSPARENT",
    get:
    /**
     * !#en Transparent, RGBA is [0, 0, 0, 0].
     * !#zh 透明，RGBA 是 [0, 0, 0, 0]。
     * @property TRANSPARENT
     * @type {Color}
     * @static
     */
    function get() {
      return new Color(0, 0, 0, 0);
    }
  }, {
    key: "GRAY",
    get:
    /**
     * !#en Grey, RGBA is [127.5, 127.5, 127.5].
     * !#zh 灰色，RGBA 是 [127.5, 127.5, 127.5]。
     * @property GRAY
     * @type {Color}
     * @static
     */
    function get() {
      return new Color(127.5, 127.5, 127.5);
    }
  }, {
    key: "RED",
    get:
    /**
     * !#en Solid red, RGBA is [255, 0, 0].
     * !#zh 纯红色，RGBA 是 [255, 0, 0]。
     * @property RED
     * @type {Color}
     * @static
     */
    function get() {
      return new Color(255, 0, 0);
    }
  }, {
    key: "GREEN",
    get:
    /**
     * !#en Solid green, RGBA is [0, 255, 0].
     * !#zh 纯绿色，RGBA 是 [0, 255, 0]。
     * @property GREEN
     * @type {Color}
     * @static
     */
    function get() {
      return new Color(0, 255, 0);
    }
  }, {
    key: "BLUE",
    get:
    /**
     * !#en Solid blue, RGBA is [0, 0, 255].
     * !#zh 纯蓝色，RGBA 是 [0, 0, 255]。
     * @property BLUE
     * @type {Color}
     * @static
     */
    function get() {
      return new Color(0, 0, 255);
    }
  }, {
    key: "YELLOW",
    get:
    /**
     * !#en Yellow, RGBA is [255, 235, 4].
     * !#zh 黄色，RGBA 是 [255, 235, 4]。
     * @property YELLOW
     * @type {Color}
     * @static
     */
    function get() {
      return new Color(255, 235, 4);
    }
  }, {
    key: "ORANGE",
    get:
    /**
     * !#en Orange, RGBA is [255, 127, 0].
     * !#zh 橙色，RGBA 是 [255, 127, 0]。
     * @property ORANGE
     * @type {Color}
     * @static
     */
    function get() {
      return new Color(255, 127, 0);
    }
  }, {
    key: "CYAN",
    get:
    /**
     * !#en Cyan, RGBA is [0, 255, 255].
     * !#zh 青色，RGBA 是 [0, 255, 255]。
     * @property CYAN
     * @type {Color}
     * @static
     */
    function get() {
      return new Color(0, 255, 255);
    }
  }, {
    key: "MAGENTA",
    get:
    /**
     * !#en Magenta, RGBA is [255, 0, 255].
     * !#zh 洋红色（品红色），RGBA 是 [255, 0, 255]。
     * @property MAGENTA
     * @type {Color}
     * @static
     */
    function get() {
      return new Color(255, 0, 255);
    }
  }]);

  return Color;
}(_valueType["default"]);

exports["default"] = Color;
Color.div = Color.divide;
Color.sub = Color.subtract;
Color.mul = Color.multiply;
Color.WHITE_R = Color.WHITE;
Color.BLACK_R = Color.BLACK;
Color.TRANSPARENT_R = Color.TRANSPARENT;
Color.GRAY_R = Color.GRAY;
Color.RED_R = Color.RED;
Color.GREEN_R = Color.GREEN;
Color.BLUE_R = Color.BLUE;
Color.YELLOW_R = Color.YELLOW;
Color.ORANGE_R = Color.ORANGE;
Color.CYAN_R = Color.CYAN;
Color.MAGENTA_R = Color.MAGENTA;

_CCClass["default"].fastDefine('cc.Color', Color, {
  r: 0,
  g: 0,
  b: 0,
  a: 255
});

cc.Color = Color;
/**
 * @module cc
 */

/**
 * !#en
 * The convenience method to create a new {{#crossLink "Color/Color:method"}}cc.Color{{/crossLink}}
 * Alpha channel is optional. Default value is 255.
 *
 * !#zh
 * 通过该方法来创建一个新的 {{#crossLink "Color/Color:method"}}cc.Color{{/crossLink}} 对象。
 * Alpha 通道是可选的。默认值是 255。
 *
 * @method color
 * @param {Number} [r=0]
 * @param {Number} [g=0]
 * @param {Number} [b=0]
 * @param {Number} [a=255]
 * @return {Color}
 * @example {@link cocos2d/core/value-types/CCColor/color.js}
 */

cc.color = function color(r, g, b, a) {
  if (typeof r === 'string') {
    var result = new Color();
    return result.fromHEX(r);
  }

  if (typeof r === 'object') {
    return new Color(r.r, r.g, r.b, r.a);
  }

  return new Color(r, g, b, a);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3ZhbHVlLXR5cGVzL2NvbG9yLnRzIl0sIm5hbWVzIjpbIkNvbG9yIiwiY29weSIsIm91dCIsImEiLCJyIiwiZyIsImIiLCJjbG9uZSIsInNldCIsImZyb21IZXgiLCJoZXgiLCJmcm9tSEVYIiwiaGV4U3RyaW5nIiwiaW5kZXhPZiIsInN1YnN0cmluZyIsInBhcnNlSW50Iiwic3Vic3RyIiwiX3ZhbCIsImFkZCIsInN1YnRyYWN0IiwibXVsdGlwbHkiLCJkaXZpZGUiLCJzY2FsZSIsImxlcnAiLCJ0IiwiYXIiLCJhZyIsImFiIiwiYWEiLCJ0b0FycmF5Iiwib2ZzIiwiZnJvbUFycmF5IiwiYXJyIiwicHJlbXVsdGlwbHlBbHBoYSIsImNvbG9yIiwiYWxwaGEiLCJfZmFzdFNldEEiLCJyZXQiLCJlcXVhbHMiLCJvdGhlciIsInRvIiwicmF0aW8iLCJ0b1N0cmluZyIsInRvRml4ZWQiLCJnZXRSIiwic2V0UiIsInJlZCIsIm1pc2MiLCJjbGFtcGYiLCJnZXRHIiwic2V0RyIsImdyZWVuIiwiZ2V0QiIsInNldEIiLCJibHVlIiwiZ2V0QSIsInNldEEiLCJ0b0NTUyIsIm9wdCIsInRvSEVYIiwiZm10IiwicHJlZml4IiwicHVzaCIsImpvaW4iLCJ0b1JHQlZhbHVlIiwiZnJvbUhTViIsImgiLCJzIiwidiIsImkiLCJNYXRoIiwiZmxvb3IiLCJmIiwicCIsInEiLCJ0b0hTViIsImhzdiIsIm1heCIsIm1pbiIsImRlbHRhIiwiVmFsdWVUeXBlIiwiZGl2Iiwic3ViIiwibXVsIiwiV0hJVEVfUiIsIldISVRFIiwiQkxBQ0tfUiIsIkJMQUNLIiwiVFJBTlNQQVJFTlRfUiIsIlRSQU5TUEFSRU5UIiwiR1JBWV9SIiwiR1JBWSIsIlJFRF9SIiwiUkVEIiwiR1JFRU5fUiIsIkdSRUVOIiwiQkxVRV9SIiwiQkxVRSIsIllFTExPV19SIiwiWUVMTE9XIiwiT1JBTkdFX1IiLCJPUkFOR0UiLCJDWUFOX1IiLCJDWUFOIiwiTUFHRU5UQV9SIiwiTUFHRU5UQSIsIkNDQ2xhc3MiLCJmYXN0RGVmaW5lIiwiY2MiLCJyZXN1bHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUNxQkE7OztBQTZHakI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7UUFDV0MsT0FBUCxjQUFhQyxHQUFiLEVBQXlCQyxDQUF6QixFQUEwQztBQUN0Q0QsSUFBQUEsR0FBRyxDQUFDRSxDQUFKLEdBQVFELENBQUMsQ0FBQ0MsQ0FBVjtBQUNBRixJQUFBQSxHQUFHLENBQUNHLENBQUosR0FBUUYsQ0FBQyxDQUFDRSxDQUFWO0FBQ0FILElBQUFBLEdBQUcsQ0FBQ0ksQ0FBSixHQUFRSCxDQUFDLENBQUNHLENBQVY7QUFDQUosSUFBQUEsR0FBRyxDQUFDQyxDQUFKLEdBQVFBLENBQUMsQ0FBQ0EsQ0FBVjtBQUNBLFdBQU9ELEdBQVA7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7UUFDV0ssUUFBUCxlQUFjSixDQUFkLEVBQStCO0FBQzNCLFdBQU8sSUFBSUgsS0FBSixDQUFVRyxDQUFDLENBQUNDLENBQVosRUFBZUQsQ0FBQyxDQUFDRSxDQUFqQixFQUFvQkYsQ0FBQyxDQUFDRyxDQUF0QixFQUF5QkgsQ0FBQyxDQUFDQSxDQUEzQixDQUFQO0FBQ0g7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O1FBQ1dLLE1BQVAsYUFBWU4sR0FBWixFQUF3QkUsQ0FBeEIsRUFBaUNDLENBQWpDLEVBQTBDQyxDQUExQyxFQUFtREgsQ0FBbkQsRUFBbUU7QUFBQSxRQUEzQ0MsQ0FBMkM7QUFBM0NBLE1BQUFBLENBQTJDLEdBQXZDLEdBQXVDO0FBQUE7O0FBQUEsUUFBbENDLENBQWtDO0FBQWxDQSxNQUFBQSxDQUFrQyxHQUE5QixHQUE4QjtBQUFBOztBQUFBLFFBQXpCQyxDQUF5QjtBQUF6QkEsTUFBQUEsQ0FBeUIsR0FBckIsR0FBcUI7QUFBQTs7QUFBQSxRQUFoQkgsQ0FBZ0I7QUFBaEJBLE1BQUFBLENBQWdCLEdBQVosR0FBWTtBQUFBOztBQUMvREQsSUFBQUEsR0FBRyxDQUFDRSxDQUFKLEdBQVFBLENBQVI7QUFDQUYsSUFBQUEsR0FBRyxDQUFDRyxDQUFKLEdBQVFBLENBQVI7QUFDQUgsSUFBQUEsR0FBRyxDQUFDSSxDQUFKLEdBQVFBLENBQVI7QUFDQUosSUFBQUEsR0FBRyxDQUFDQyxDQUFKLEdBQVFBLENBQVI7QUFDQSxXQUFPRCxHQUFQO0FBQ0g7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7UUFDV08sVUFBUCxpQkFBZ0JQLEdBQWhCLEVBQTRCUSxHQUE1QixFQUFnRDtBQUM1QyxRQUFJTixDQUFDLEdBQUcsQ0FBRU0sR0FBRyxJQUFJLEVBQVQsSUFBZ0IsS0FBeEI7QUFDQSxRQUFJTCxDQUFDLEdBQUcsQ0FBRUssR0FBRyxJQUFJLEVBQVIsR0FBYyxJQUFmLElBQXVCLEtBQS9CO0FBQ0EsUUFBSUosQ0FBQyxHQUFHLENBQUVJLEdBQUcsSUFBSSxDQUFSLEdBQWEsSUFBZCxJQUFzQixLQUE5QjtBQUNBLFFBQUlQLENBQUMsR0FBRyxDQUFFTyxHQUFELEdBQVEsSUFBVCxJQUFpQixLQUF6QjtBQUVBUixJQUFBQSxHQUFHLENBQUNFLENBQUosR0FBUUEsQ0FBUjtBQUNBRixJQUFBQSxHQUFHLENBQUNHLENBQUosR0FBUUEsQ0FBUjtBQUNBSCxJQUFBQSxHQUFHLENBQUNJLENBQUosR0FBUUEsQ0FBUjtBQUNBSixJQUFBQSxHQUFHLENBQUNDLENBQUosR0FBUUEsQ0FBUjtBQUNBLFdBQU9ELEdBQVA7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7UUFDV1MsVUFBUCxpQkFBZ0JULEdBQWhCLEVBQTRCVSxTQUE1QixFQUFzRDtBQUNsREEsSUFBQUEsU0FBUyxHQUFJQSxTQUFTLENBQUNDLE9BQVYsQ0FBa0IsR0FBbEIsTUFBMkIsQ0FBNUIsR0FBaUNELFNBQVMsQ0FBQ0UsU0FBVixDQUFvQixDQUFwQixDQUFqQyxHQUEwREYsU0FBdEU7QUFDQVYsSUFBQUEsR0FBRyxDQUFDRSxDQUFKLEdBQVFXLFFBQVEsQ0FBQ0gsU0FBUyxDQUFDSSxNQUFWLENBQWlCLENBQWpCLEVBQW9CLENBQXBCLENBQUQsRUFBeUIsRUFBekIsQ0FBUixJQUF3QyxDQUFoRDtBQUNBZCxJQUFBQSxHQUFHLENBQUNHLENBQUosR0FBUVUsUUFBUSxDQUFDSCxTQUFTLENBQUNJLE1BQVYsQ0FBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsQ0FBRCxFQUF5QixFQUF6QixDQUFSLElBQXdDLENBQWhEO0FBQ0FkLElBQUFBLEdBQUcsQ0FBQ0ksQ0FBSixHQUFRUyxRQUFRLENBQUNILFNBQVMsQ0FBQ0ksTUFBVixDQUFpQixDQUFqQixFQUFvQixDQUFwQixDQUFELEVBQXlCLEVBQXpCLENBQVIsSUFBd0MsQ0FBaEQ7QUFDQWQsSUFBQUEsR0FBRyxDQUFDQyxDQUFKLEdBQVFZLFFBQVEsQ0FBQ0gsU0FBUyxDQUFDSSxNQUFWLENBQWlCLENBQWpCLEVBQW9CLENBQXBCLENBQUQsRUFBeUIsRUFBekIsQ0FBUixJQUF3QyxHQUFoRDtBQUNBZCxJQUFBQSxHQUFHLENBQUNlLElBQUosR0FBVyxDQUFFZixHQUFHLENBQUNDLENBQUosSUFBUyxFQUFWLEtBQWtCLENBQW5CLEtBQXlCRCxHQUFHLENBQUNJLENBQUosSUFBUyxFQUFsQyxLQUF5Q0osR0FBRyxDQUFDRyxDQUFKLElBQVMsQ0FBbEQsSUFBdURILEdBQUcsQ0FBQ0UsQ0FBdEU7QUFDQSxXQUFPRixHQUFQO0FBQ0g7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O1FBQ1dnQixNQUFQLGFBQVloQixHQUFaLEVBQXdCQyxDQUF4QixFQUFrQ0csQ0FBbEMsRUFBbUQ7QUFDL0NKLElBQUFBLEdBQUcsQ0FBQ0UsQ0FBSixHQUFRRCxDQUFDLENBQUNDLENBQUYsR0FBTUUsQ0FBQyxDQUFDRixDQUFoQjtBQUNBRixJQUFBQSxHQUFHLENBQUNHLENBQUosR0FBUUYsQ0FBQyxDQUFDRSxDQUFGLEdBQU1DLENBQUMsQ0FBQ0QsQ0FBaEI7QUFDQUgsSUFBQUEsR0FBRyxDQUFDSSxDQUFKLEdBQVFILENBQUMsQ0FBQ0csQ0FBRixHQUFNQSxDQUFDLENBQUNBLENBQWhCO0FBQ0FKLElBQUFBLEdBQUcsQ0FBQ0MsQ0FBSixHQUFRQSxDQUFDLENBQUNBLENBQUYsR0FBTUcsQ0FBQyxDQUFDSCxDQUFoQjtBQUNBLFdBQU9ELEdBQVA7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7UUFDV2lCLFdBQVAsa0JBQWlCakIsR0FBakIsRUFBNkJDLENBQTdCLEVBQXVDRyxDQUF2QyxFQUF3RDtBQUNwREosSUFBQUEsR0FBRyxDQUFDRSxDQUFKLEdBQVFELENBQUMsQ0FBQ0MsQ0FBRixHQUFNRSxDQUFDLENBQUNGLENBQWhCO0FBQ0FGLElBQUFBLEdBQUcsQ0FBQ0csQ0FBSixHQUFRRixDQUFDLENBQUNFLENBQUYsR0FBTUMsQ0FBQyxDQUFDRCxDQUFoQjtBQUNBSCxJQUFBQSxHQUFHLENBQUNJLENBQUosR0FBUUgsQ0FBQyxDQUFDRyxDQUFGLEdBQU1BLENBQUMsQ0FBQ0EsQ0FBaEI7QUFDQUosSUFBQUEsR0FBRyxDQUFDQyxDQUFKLEdBQVFBLENBQUMsQ0FBQ0EsQ0FBRixHQUFNRyxDQUFDLENBQUNILENBQWhCO0FBQ0EsV0FBT0QsR0FBUDtBQUNIO0FBRUQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztRQUNXa0IsV0FBUCxrQkFBaUJsQixHQUFqQixFQUE2QkMsQ0FBN0IsRUFBdUNHLENBQXZDLEVBQXdEO0FBQ3BESixJQUFBQSxHQUFHLENBQUNFLENBQUosR0FBUUQsQ0FBQyxDQUFDQyxDQUFGLEdBQU1FLENBQUMsQ0FBQ0YsQ0FBaEI7QUFDQUYsSUFBQUEsR0FBRyxDQUFDRyxDQUFKLEdBQVFGLENBQUMsQ0FBQ0UsQ0FBRixHQUFNQyxDQUFDLENBQUNELENBQWhCO0FBQ0FILElBQUFBLEdBQUcsQ0FBQ0ksQ0FBSixHQUFRSCxDQUFDLENBQUNHLENBQUYsR0FBTUEsQ0FBQyxDQUFDQSxDQUFoQjtBQUNBSixJQUFBQSxHQUFHLENBQUNDLENBQUosR0FBUUEsQ0FBQyxDQUFDQSxDQUFGLEdBQU1HLENBQUMsQ0FBQ0gsQ0FBaEI7QUFDQSxXQUFPRCxHQUFQO0FBQ0g7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O1FBQ1dtQixTQUFQLGdCQUFlbkIsR0FBZixFQUEyQkMsQ0FBM0IsRUFBcUNHLENBQXJDLEVBQXNEO0FBQ2xESixJQUFBQSxHQUFHLENBQUNFLENBQUosR0FBUUQsQ0FBQyxDQUFDQyxDQUFGLEdBQU1FLENBQUMsQ0FBQ0YsQ0FBaEI7QUFDQUYsSUFBQUEsR0FBRyxDQUFDRyxDQUFKLEdBQVFGLENBQUMsQ0FBQ0UsQ0FBRixHQUFNQyxDQUFDLENBQUNELENBQWhCO0FBQ0FILElBQUFBLEdBQUcsQ0FBQ0ksQ0FBSixHQUFRSCxDQUFDLENBQUNHLENBQUYsR0FBTUEsQ0FBQyxDQUFDQSxDQUFoQjtBQUNBSixJQUFBQSxHQUFHLENBQUNDLENBQUosR0FBUUEsQ0FBQyxDQUFDQSxDQUFGLEdBQU1HLENBQUMsQ0FBQ0gsQ0FBaEI7QUFDQSxXQUFPRCxHQUFQO0FBQ0g7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O1FBQ1dvQixRQUFQLGVBQWNwQixHQUFkLEVBQTBCQyxDQUExQixFQUFvQ0csQ0FBcEMsRUFBc0Q7QUFDbERKLElBQUFBLEdBQUcsQ0FBQ0UsQ0FBSixHQUFRRCxDQUFDLENBQUNDLENBQUYsR0FBTUUsQ0FBZDtBQUNBSixJQUFBQSxHQUFHLENBQUNHLENBQUosR0FBUUYsQ0FBQyxDQUFDRSxDQUFGLEdBQU1DLENBQWQ7QUFDQUosSUFBQUEsR0FBRyxDQUFDSSxDQUFKLEdBQVFILENBQUMsQ0FBQ0csQ0FBRixHQUFNQSxDQUFkO0FBQ0FKLElBQUFBLEdBQUcsQ0FBQ0MsQ0FBSixHQUFRQSxDQUFDLENBQUNBLENBQUYsR0FBTUcsQ0FBZDtBQUNBLFdBQU9KLEdBQVA7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7UUFDV3FCLE9BQVAsY0FBYXJCLEdBQWIsRUFBeUJDLENBQXpCLEVBQW1DRyxDQUFuQyxFQUE2Q2tCLENBQTdDLEVBQStEO0FBQzNELFFBQUlDLEVBQUUsR0FBR3RCLENBQUMsQ0FBQ0MsQ0FBWDtBQUFBLFFBQ0lzQixFQUFFLEdBQUd2QixDQUFDLENBQUNFLENBRFg7QUFBQSxRQUVJc0IsRUFBRSxHQUFHeEIsQ0FBQyxDQUFDRyxDQUZYO0FBQUEsUUFHSXNCLEVBQUUsR0FBR3pCLENBQUMsQ0FBQ0EsQ0FIWDtBQUlBRCxJQUFBQSxHQUFHLENBQUNFLENBQUosR0FBUXFCLEVBQUUsR0FBR0QsQ0FBQyxJQUFJbEIsQ0FBQyxDQUFDRixDQUFGLEdBQU1xQixFQUFWLENBQWQ7QUFDQXZCLElBQUFBLEdBQUcsQ0FBQ0csQ0FBSixHQUFRcUIsRUFBRSxHQUFHRixDQUFDLElBQUlsQixDQUFDLENBQUNELENBQUYsR0FBTXFCLEVBQVYsQ0FBZDtBQUNBeEIsSUFBQUEsR0FBRyxDQUFDSSxDQUFKLEdBQVFxQixFQUFFLEdBQUdILENBQUMsSUFBSWxCLENBQUMsQ0FBQ0EsQ0FBRixHQUFNcUIsRUFBVixDQUFkO0FBQ0F6QixJQUFBQSxHQUFHLENBQUNDLENBQUosR0FBUXlCLEVBQUUsR0FBR0osQ0FBQyxJQUFJbEIsQ0FBQyxDQUFDSCxDQUFGLEdBQU15QixFQUFWLENBQWQ7QUFDQSxXQUFPMUIsR0FBUDtBQUNIO0FBRUQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7UUFDVzJCLFVBQVAsaUJBQXdEM0IsR0FBeEQsRUFBa0VDLENBQWxFLEVBQWlGMkIsR0FBakYsRUFBMEY7QUFBQSxRQUFUQSxHQUFTO0FBQVRBLE1BQUFBLEdBQVMsR0FBSCxDQUFHO0FBQUE7O0FBQ3RGLFFBQU1SLEtBQUssR0FBSW5CLENBQUMsWUFBWUgsS0FBYixJQUFzQkcsQ0FBQyxDQUFDQSxDQUFGLEdBQU0sQ0FBN0IsR0FBa0MsSUFBSSxHQUF0QyxHQUE0QyxDQUExRDtBQUNBRCxJQUFBQSxHQUFHLENBQUM0QixHQUFHLEdBQUcsQ0FBUCxDQUFILEdBQWUzQixDQUFDLENBQUNDLENBQUYsR0FBTWtCLEtBQXJCO0FBQ0FwQixJQUFBQSxHQUFHLENBQUM0QixHQUFHLEdBQUcsQ0FBUCxDQUFILEdBQWUzQixDQUFDLENBQUNFLENBQUYsR0FBTWlCLEtBQXJCO0FBQ0FwQixJQUFBQSxHQUFHLENBQUM0QixHQUFHLEdBQUcsQ0FBUCxDQUFILEdBQWUzQixDQUFDLENBQUNHLENBQUYsR0FBTWdCLEtBQXJCO0FBQ0FwQixJQUFBQSxHQUFHLENBQUM0QixHQUFHLEdBQUcsQ0FBUCxDQUFILEdBQWUzQixDQUFDLENBQUNBLENBQUYsR0FBTW1CLEtBQXJCO0FBQ0EsV0FBT3BCLEdBQVA7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O1FBQ1c2QixZQUFQLG1CQUEwQ0MsR0FBMUMsRUFBMkU5QixHQUEzRSxFQUFxRjRCLEdBQXJGLEVBQThGO0FBQUEsUUFBVEEsR0FBUztBQUFUQSxNQUFBQSxHQUFTLEdBQUgsQ0FBRztBQUFBOztBQUMxRjVCLElBQUFBLEdBQUcsQ0FBQ0UsQ0FBSixHQUFRNEIsR0FBRyxDQUFDRixHQUFHLEdBQUcsQ0FBUCxDQUFILEdBQWUsR0FBdkI7QUFDQTVCLElBQUFBLEdBQUcsQ0FBQ0csQ0FBSixHQUFRMkIsR0FBRyxDQUFDRixHQUFHLEdBQUcsQ0FBUCxDQUFILEdBQWUsR0FBdkI7QUFDQTVCLElBQUFBLEdBQUcsQ0FBQ0ksQ0FBSixHQUFRMEIsR0FBRyxDQUFDRixHQUFHLEdBQUcsQ0FBUCxDQUFILEdBQWUsR0FBdkI7QUFDQTVCLElBQUFBLEdBQUcsQ0FBQ0MsQ0FBSixHQUFRNkIsR0FBRyxDQUFDRixHQUFHLEdBQUcsQ0FBUCxDQUFILEdBQWUsR0FBdkI7QUFDQSxXQUFPNUIsR0FBUDtBQUNIO0FBRUQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztRQUNXK0IsbUJBQVAsMEJBQXlCL0IsR0FBekIsRUFBOEJnQyxLQUE5QixFQUFxQztBQUNqQyxRQUFJQyxLQUFLLEdBQUdELEtBQUssQ0FBQy9CLENBQU4sR0FBVSxLQUF0QjtBQUNBRCxJQUFBQSxHQUFHLENBQUNFLENBQUosR0FBUThCLEtBQUssQ0FBQzlCLENBQU4sR0FBVStCLEtBQWxCO0FBQ0FqQyxJQUFBQSxHQUFHLENBQUNHLENBQUosR0FBUTZCLEtBQUssQ0FBQzdCLENBQU4sR0FBVThCLEtBQWxCO0FBQ0FqQyxJQUFBQSxHQUFHLENBQUNJLENBQUosR0FBUTRCLEtBQUssQ0FBQzVCLENBQU4sR0FBVTZCLEtBQWxCOztBQUVBakMsSUFBQUEsR0FBRyxDQUFDa0MsU0FBSixDQUFjRixLQUFLLENBQUMvQixDQUFwQjs7QUFFQSxXQUFPRCxHQUFQO0FBQ0g7O0FBSUQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSSxpQkFBYUUsQ0FBYixFQUFvQ0MsQ0FBcEMsRUFBbURDLENBQW5ELEVBQWtFSCxDQUFsRSxFQUFtRjtBQUFBOztBQUFBLFFBQXRFQyxDQUFzRTtBQUF0RUEsTUFBQUEsQ0FBc0UsR0FBbEQsQ0FBa0Q7QUFBQTs7QUFBQSxRQUEvQ0MsQ0FBK0M7QUFBL0NBLE1BQUFBLENBQStDLEdBQW5DLENBQW1DO0FBQUE7O0FBQUEsUUFBaENDLENBQWdDO0FBQWhDQSxNQUFBQSxDQUFnQyxHQUFwQixDQUFvQjtBQUFBOztBQUFBLFFBQWpCSCxDQUFpQjtBQUFqQkEsTUFBQUEsQ0FBaUIsR0FBTCxHQUFLO0FBQUE7O0FBQy9FO0FBRCtFLFVBVG5GYyxJQVNtRixHQVRwRSxDQVNvRTs7QUFFL0UsUUFBSSxPQUFPYixDQUFQLEtBQWEsUUFBakIsRUFBMkI7QUFDdkJDLE1BQUFBLENBQUMsR0FBR0QsQ0FBQyxDQUFDQyxDQUFOO0FBQ0FDLE1BQUFBLENBQUMsR0FBR0YsQ0FBQyxDQUFDRSxDQUFOO0FBQ0FILE1BQUFBLENBQUMsR0FBR0MsQ0FBQyxDQUFDRCxDQUFOO0FBQ0FDLE1BQUFBLENBQUMsR0FBR0EsQ0FBQyxDQUFDQSxDQUFOO0FBQ0g7O0FBRUQsVUFBS2EsSUFBTCxHQUFZLENBQUVkLENBQUMsSUFBSSxFQUFOLEtBQWMsQ0FBZixLQUFxQkcsQ0FBQyxJQUFJLEVBQTFCLEtBQWlDRCxDQUFDLElBQUksQ0FBdEMsS0FBNENELENBQUMsR0FBQyxDQUE5QyxDQUFaO0FBVCtFO0FBVWxGO0FBRUQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztTQUNJRyxRQUFBLGlCQUFnQjtBQUNaLFFBQUk4QixHQUFHLEdBQUcsSUFBSXJDLEtBQUosRUFBVjtBQUNBcUMsSUFBQUEsR0FBRyxDQUFDcEIsSUFBSixHQUFXLEtBQUtBLElBQWhCO0FBQ0EsV0FBT29CLEdBQVA7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7U0FDSUMsU0FBQSxnQkFBUUMsS0FBUixFQUErQjtBQUMzQixXQUFPQSxLQUFLLElBQUksS0FBS3RCLElBQUwsS0FBY3NCLEtBQUssQ0FBQ3RCLElBQXBDO0FBQ0g7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O1NBQ0lNLE9BQUEsY0FBTWlCLEVBQU4sRUFBaUJDLEtBQWpCLEVBQWdDdkMsR0FBaEMsRUFBb0Q7QUFDaERBLElBQUFBLEdBQUcsR0FBR0EsR0FBRyxJQUFJLElBQUlGLEtBQUosRUFBYjtBQUNBLFFBQUlJLENBQUMsR0FBRyxLQUFLQSxDQUFiO0FBQ0EsUUFBSUMsQ0FBQyxHQUFHLEtBQUtBLENBQWI7QUFDQSxRQUFJQyxDQUFDLEdBQUcsS0FBS0EsQ0FBYjtBQUNBLFFBQUlILENBQUMsR0FBRyxLQUFLQSxDQUFiO0FBQ0FELElBQUFBLEdBQUcsQ0FBQ0UsQ0FBSixHQUFRQSxDQUFDLEdBQUcsQ0FBQ29DLEVBQUUsQ0FBQ3BDLENBQUgsR0FBT0EsQ0FBUixJQUFhcUMsS0FBekI7QUFDQXZDLElBQUFBLEdBQUcsQ0FBQ0csQ0FBSixHQUFRQSxDQUFDLEdBQUcsQ0FBQ21DLEVBQUUsQ0FBQ25DLENBQUgsR0FBT0EsQ0FBUixJQUFhb0MsS0FBekI7QUFDQXZDLElBQUFBLEdBQUcsQ0FBQ0ksQ0FBSixHQUFRQSxDQUFDLEdBQUcsQ0FBQ2tDLEVBQUUsQ0FBQ2xDLENBQUgsR0FBT0EsQ0FBUixJQUFhbUMsS0FBekI7QUFDQXZDLElBQUFBLEdBQUcsQ0FBQ0MsQ0FBSixHQUFRQSxDQUFDLEdBQUcsQ0FBQ3FDLEVBQUUsQ0FBQ3JDLENBQUgsR0FBT0EsQ0FBUixJQUFhc0MsS0FBekI7QUFDQSxXQUFPdkMsR0FBUDtBQUNIOztBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtTQUNJd0MsV0FBQSxvQkFBb0I7QUFDaEIsV0FBTyxVQUNILEtBQUt0QyxDQUFMLENBQU91QyxPQUFQLEVBREcsR0FDZ0IsSUFEaEIsR0FFSCxLQUFLdEMsQ0FBTCxDQUFPc0MsT0FBUCxFQUZHLEdBRWdCLElBRmhCLEdBR0gsS0FBS3JDLENBQUwsQ0FBT3FDLE9BQVAsRUFIRyxHQUdnQixJQUhoQixHQUlILEtBQUt4QyxDQUFMLENBQU93QyxPQUFQLEVBSkcsR0FJZ0IsR0FKdkI7QUFLSDs7QUFrREQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO1NBQ0lDLE9BQUEsZ0JBQWdCO0FBQ1osV0FBTyxLQUFLM0IsSUFBTCxHQUFZLFVBQW5CO0FBQ0g7QUFDRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O1NBQ0k0QixPQUFBLGNBQU1DLEdBQU4sRUFBaUI7QUFDYkEsSUFBQUEsR0FBRyxHQUFHLENBQUMsQ0FBQ0MsaUJBQUtDLE1BQUwsQ0FBWUYsR0FBWixFQUFpQixDQUFqQixFQUFvQixHQUFwQixDQUFSO0FBQ0EsU0FBSzdCLElBQUwsR0FBWSxDQUFFLEtBQUtBLElBQUwsR0FBWSxVQUFiLEdBQTJCNkIsR0FBNUIsTUFBcUMsQ0FBakQ7QUFDQSxXQUFPLElBQVA7QUFDSDtBQUNEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O1NBQ0lHLE9BQUEsZ0JBQWdCO0FBQ1osV0FBTyxDQUFDLEtBQUtoQyxJQUFMLEdBQVksVUFBYixLQUE0QixDQUFuQztBQUNIO0FBQ0Q7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUNJaUMsT0FBQSxjQUFNQyxLQUFOLEVBQW1CO0FBQ2ZBLElBQUFBLEtBQUssR0FBRyxDQUFDLENBQUNKLGlCQUFLQyxNQUFMLENBQVlHLEtBQVosRUFBbUIsQ0FBbkIsRUFBc0IsR0FBdEIsQ0FBVjtBQUNBLFNBQUtsQyxJQUFMLEdBQVksQ0FBRSxLQUFLQSxJQUFMLEdBQVksVUFBYixHQUE0QmtDLEtBQUssSUFBSSxDQUF0QyxNQUE4QyxDQUExRDtBQUNBLFdBQU8sSUFBUDtBQUNIO0FBQ0Q7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7U0FDSUMsT0FBQSxnQkFBZ0I7QUFDWixXQUFPLENBQUMsS0FBS25DLElBQUwsR0FBWSxVQUFiLEtBQTRCLEVBQW5DO0FBQ0g7QUFDRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O1NBQ0lvQyxPQUFBLGNBQU1DLElBQU4sRUFBa0I7QUFDZEEsSUFBQUEsSUFBSSxHQUFHLENBQUMsQ0FBQ1AsaUJBQUtDLE1BQUwsQ0FBWU0sSUFBWixFQUFrQixDQUFsQixFQUFxQixHQUFyQixDQUFUO0FBQ0EsU0FBS3JDLElBQUwsR0FBWSxDQUFFLEtBQUtBLElBQUwsR0FBWSxVQUFiLEdBQTRCcUMsSUFBSSxJQUFJLEVBQXJDLE1BQThDLENBQTFEO0FBQ0EsV0FBTyxJQUFQO0FBQ0g7QUFDRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUNJQyxPQUFBLGdCQUFnQjtBQUNaLFdBQU8sQ0FBQyxLQUFLdEMsSUFBTCxHQUFZLFVBQWIsTUFBNkIsRUFBcEM7QUFDSDtBQUNEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7U0FDSXVDLE9BQUEsY0FBTXJCLEtBQU4sRUFBbUI7QUFDZkEsSUFBQUEsS0FBSyxHQUFHLENBQUMsQ0FBQ1ksaUJBQUtDLE1BQUwsQ0FBWWIsS0FBWixFQUFtQixDQUFuQixFQUFzQixHQUF0QixDQUFWO0FBQ0EsU0FBS2xCLElBQUwsR0FBWSxDQUFFLEtBQUtBLElBQUwsR0FBWSxVQUFiLEdBQTRCa0IsS0FBSyxJQUFJLEVBQXRDLE1BQStDLENBQTNEO0FBQ0EsV0FBTyxJQUFQO0FBQ0g7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7U0FDSXNCLFFBQUEsZUFBT0MsR0FBUCxFQUE0QjtBQUN4QixRQUFJLENBQUNBLEdBQUQsSUFBUUEsR0FBRyxLQUFLLE1BQXBCLEVBQTRCO0FBQ3hCLGFBQU8sVUFDSCxLQUFLdEQsQ0FERixHQUNNLEdBRE4sR0FFSCxLQUFLQyxDQUZGLEdBRU0sR0FGTixHQUdILEtBQUtDLENBSEYsR0FHTSxHQUhOLEdBSUgsQ0FBQyxLQUFLSCxDQUFMLEdBQVMsR0FBVixFQUFld0MsT0FBZixDQUF1QixDQUF2QixDQUpHLEdBSXlCLEdBSmhDO0FBTUgsS0FQRCxNQVFLLElBQUllLEdBQUcsS0FBSyxLQUFaLEVBQW1CO0FBQ3BCLGFBQU8sU0FDSCxLQUFLdEQsQ0FERixHQUNNLEdBRE4sR0FFSCxLQUFLQyxDQUZGLEdBRU0sR0FGTixHQUdILEtBQUtDLENBSEYsR0FHTSxHQUhiO0FBS0gsS0FOSSxNQU9BO0FBQ0QsYUFBTyxNQUFNLEtBQUtxRCxLQUFMLENBQVdELEdBQVgsQ0FBYjtBQUNIO0FBQ0o7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7U0FDSS9DLFVBQUEsaUJBQVNDLFNBQVQsRUFBa0M7QUFDOUJBLElBQUFBLFNBQVMsR0FBSUEsU0FBUyxDQUFDQyxPQUFWLENBQWtCLEdBQWxCLE1BQTJCLENBQTVCLEdBQWlDRCxTQUFTLENBQUNFLFNBQVYsQ0FBb0IsQ0FBcEIsQ0FBakMsR0FBMERGLFNBQXRFO0FBQ0EsUUFBSVIsQ0FBQyxHQUFHVyxRQUFRLENBQUNILFNBQVMsQ0FBQ0ksTUFBVixDQUFpQixDQUFqQixFQUFvQixDQUFwQixDQUFELEVBQXlCLEVBQXpCLENBQVIsSUFBd0MsQ0FBaEQ7QUFDQSxRQUFJWCxDQUFDLEdBQUdVLFFBQVEsQ0FBQ0gsU0FBUyxDQUFDSSxNQUFWLENBQWlCLENBQWpCLEVBQW9CLENBQXBCLENBQUQsRUFBeUIsRUFBekIsQ0FBUixJQUF3QyxDQUFoRDtBQUNBLFFBQUlWLENBQUMsR0FBR1MsUUFBUSxDQUFDSCxTQUFTLENBQUNJLE1BQVYsQ0FBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsQ0FBRCxFQUF5QixFQUF6QixDQUFSLElBQXdDLENBQWhEO0FBQ0EsUUFBSWIsQ0FBQyxHQUFHWSxRQUFRLENBQUNILFNBQVMsQ0FBQ0ksTUFBVixDQUFpQixDQUFqQixFQUFvQixDQUFwQixDQUFELEVBQXlCLEVBQXpCLENBQVIsSUFBd0MsR0FBaEQ7QUFDQSxTQUFLQyxJQUFMLEdBQVksQ0FBRWQsQ0FBQyxJQUFJLEVBQU4sS0FBYyxDQUFmLEtBQXFCRyxDQUFDLElBQUksRUFBMUIsS0FBaUNELENBQUMsSUFBSSxDQUF0QyxJQUEyQ0QsQ0FBdkQ7QUFDQSxXQUFPLElBQVA7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUNJdUQsUUFBQSxlQUFPQyxHQUFQLEVBQW9CO0FBQ2hCLFFBQU1DLE1BQU0sR0FBRyxHQUFmLENBRGdCLENBRWhCOztBQUNBLFFBQUluRCxHQUFHLEdBQUcsQ0FDTixDQUFDLEtBQUtOLENBQUwsR0FBUyxFQUFULEdBQWN5RCxNQUFkLEdBQXVCLEVBQXhCLElBQStCLEtBQUt6RCxDQUFOLENBQVNzQyxRQUFULENBQWtCLEVBQWxCLENBRHhCLEVBRU4sQ0FBQyxLQUFLckMsQ0FBTCxHQUFTLEVBQVQsR0FBY3dELE1BQWQsR0FBdUIsRUFBeEIsSUFBK0IsS0FBS3hELENBQU4sQ0FBU3FDLFFBQVQsQ0FBa0IsRUFBbEIsQ0FGeEIsRUFHTixDQUFDLEtBQUtwQyxDQUFMLEdBQVMsRUFBVCxHQUFjdUQsTUFBZCxHQUF1QixFQUF4QixJQUErQixLQUFLdkQsQ0FBTixDQUFTb0MsUUFBVCxDQUFrQixFQUFsQixDQUh4QixDQUFWOztBQUtBLFFBQUlrQixHQUFHLEtBQUssTUFBWixFQUFvQjtBQUNoQmxELE1BQUFBLEdBQUcsQ0FBQyxDQUFELENBQUgsR0FBU0EsR0FBRyxDQUFDLENBQUQsQ0FBSCxDQUFPLENBQVAsQ0FBVDtBQUNBQSxNQUFBQSxHQUFHLENBQUMsQ0FBRCxDQUFILEdBQVNBLEdBQUcsQ0FBQyxDQUFELENBQUgsQ0FBTyxDQUFQLENBQVQ7QUFDQUEsTUFBQUEsR0FBRyxDQUFDLENBQUQsQ0FBSCxHQUFTQSxHQUFHLENBQUMsQ0FBRCxDQUFILENBQU8sQ0FBUCxDQUFUO0FBQ0gsS0FKRCxNQUtLLElBQUlrRCxHQUFHLEtBQUssV0FBWixFQUF5QjtBQUMxQmxELE1BQUFBLEdBQUcsQ0FBQ29ELElBQUosQ0FBUyxDQUFDLEtBQUszRCxDQUFMLEdBQVMsRUFBVCxHQUFjMEQsTUFBZCxHQUF1QixFQUF4QixJQUErQixLQUFLMUQsQ0FBTixDQUFTdUMsUUFBVCxDQUFrQixFQUFsQixDQUF2QztBQUNIOztBQUNELFdBQU9oQyxHQUFHLENBQUNxRCxJQUFKLENBQVMsRUFBVCxDQUFQO0FBQ0g7O0FBRUQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO1NBQ0lDLGFBQUEsc0JBQXNCO0FBQ2xCLFdBQU8sS0FBSy9DLElBQUwsR0FBWSxVQUFuQjtBQUNIO0FBRUQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUNJZ0QsVUFBQSxpQkFBU0MsQ0FBVCxFQUFZQyxDQUFaLEVBQWVDLENBQWYsRUFBd0I7QUFDcEIsUUFBSWhFLENBQUosRUFBT0MsQ0FBUCxFQUFVQyxDQUFWOztBQUNBLFFBQUk2RCxDQUFDLEtBQUssQ0FBVixFQUFhO0FBQ1QvRCxNQUFBQSxDQUFDLEdBQUdDLENBQUMsR0FBR0MsQ0FBQyxHQUFHOEQsQ0FBWjtBQUNILEtBRkQsTUFHSztBQUNELFVBQUlBLENBQUMsS0FBSyxDQUFWLEVBQWE7QUFDVGhFLFFBQUFBLENBQUMsR0FBR0MsQ0FBQyxHQUFHQyxDQUFDLEdBQUcsQ0FBWjtBQUNILE9BRkQsTUFHSztBQUNELFlBQUk0RCxDQUFDLEtBQUssQ0FBVixFQUFhQSxDQUFDLEdBQUcsQ0FBSjtBQUNiQSxRQUFBQSxDQUFDLElBQUksQ0FBTDtBQUNBLFlBQUlHLENBQUMsR0FBR0MsSUFBSSxDQUFDQyxLQUFMLENBQVdMLENBQVgsQ0FBUjtBQUNBLFlBQUlNLENBQUMsR0FBR04sQ0FBQyxHQUFHRyxDQUFaO0FBQ0EsWUFBSUksQ0FBQyxHQUFHTCxDQUFDLElBQUksSUFBSUQsQ0FBUixDQUFUO0FBQ0EsWUFBSU8sQ0FBQyxHQUFHTixDQUFDLElBQUksSUFBS0QsQ0FBQyxHQUFHSyxDQUFiLENBQVQ7QUFDQSxZQUFJaEQsQ0FBQyxHQUFHNEMsQ0FBQyxJQUFJLElBQUtELENBQUMsSUFBSSxJQUFJSyxDQUFSLENBQVYsQ0FBVDs7QUFDQSxnQkFBUUgsQ0FBUjtBQUNJLGVBQUssQ0FBTDtBQUNJakUsWUFBQUEsQ0FBQyxHQUFHZ0UsQ0FBSjtBQUNBL0QsWUFBQUEsQ0FBQyxHQUFHbUIsQ0FBSjtBQUNBbEIsWUFBQUEsQ0FBQyxHQUFHbUUsQ0FBSjtBQUNBOztBQUVKLGVBQUssQ0FBTDtBQUNJckUsWUFBQUEsQ0FBQyxHQUFHc0UsQ0FBSjtBQUNBckUsWUFBQUEsQ0FBQyxHQUFHK0QsQ0FBSjtBQUNBOUQsWUFBQUEsQ0FBQyxHQUFHbUUsQ0FBSjtBQUNBOztBQUVKLGVBQUssQ0FBTDtBQUNJckUsWUFBQUEsQ0FBQyxHQUFHcUUsQ0FBSjtBQUNBcEUsWUFBQUEsQ0FBQyxHQUFHK0QsQ0FBSjtBQUNBOUQsWUFBQUEsQ0FBQyxHQUFHa0IsQ0FBSjtBQUNBOztBQUVKLGVBQUssQ0FBTDtBQUNJcEIsWUFBQUEsQ0FBQyxHQUFHcUUsQ0FBSjtBQUNBcEUsWUFBQUEsQ0FBQyxHQUFHcUUsQ0FBSjtBQUNBcEUsWUFBQUEsQ0FBQyxHQUFHOEQsQ0FBSjtBQUNBOztBQUVKLGVBQUssQ0FBTDtBQUNJaEUsWUFBQUEsQ0FBQyxHQUFHb0IsQ0FBSjtBQUNBbkIsWUFBQUEsQ0FBQyxHQUFHb0UsQ0FBSjtBQUNBbkUsWUFBQUEsQ0FBQyxHQUFHOEQsQ0FBSjtBQUNBOztBQUVKLGVBQUssQ0FBTDtBQUNJaEUsWUFBQUEsQ0FBQyxHQUFHZ0UsQ0FBSjtBQUNBL0QsWUFBQUEsQ0FBQyxHQUFHb0UsQ0FBSjtBQUNBbkUsWUFBQUEsQ0FBQyxHQUFHb0UsQ0FBSjtBQUNBO0FBbkNSO0FBcUNIO0FBQ0o7O0FBQ0R0RSxJQUFBQSxDQUFDLElBQUksR0FBTDtBQUNBQyxJQUFBQSxDQUFDLElBQUksR0FBTDtBQUNBQyxJQUFBQSxDQUFDLElBQUksR0FBTDtBQUNBLFNBQUtXLElBQUwsR0FBWSxDQUFFLEtBQUtkLENBQUwsSUFBVSxFQUFYLEtBQW1CLENBQXBCLEtBQTBCRyxDQUFDLElBQUksRUFBL0IsS0FBc0NELENBQUMsSUFBSSxDQUEzQyxLQUFpREQsQ0FBQyxHQUFDLENBQW5ELENBQVo7QUFDQSxXQUFPLElBQVA7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O1NBQ0l1RSxRQUFBLGlCQUFTO0FBQ0wsUUFBSXZFLENBQUMsR0FBRyxLQUFLQSxDQUFMLEdBQVMsR0FBakI7QUFDQSxRQUFJQyxDQUFDLEdBQUcsS0FBS0EsQ0FBTCxHQUFTLEdBQWpCO0FBQ0EsUUFBSUMsQ0FBQyxHQUFHLEtBQUtBLENBQUwsR0FBUyxHQUFqQjtBQUNBLFFBQUlzRSxHQUFHLEdBQUc7QUFBRVYsTUFBQUEsQ0FBQyxFQUFFLENBQUw7QUFBUUMsTUFBQUEsQ0FBQyxFQUFFLENBQVg7QUFBY0MsTUFBQUEsQ0FBQyxFQUFFO0FBQWpCLEtBQVY7QUFDQSxRQUFJUyxHQUFHLEdBQUdQLElBQUksQ0FBQ08sR0FBTCxDQUFTekUsQ0FBVCxFQUFZQyxDQUFaLEVBQWVDLENBQWYsQ0FBVjtBQUNBLFFBQUl3RSxHQUFHLEdBQUdSLElBQUksQ0FBQ1EsR0FBTCxDQUFTMUUsQ0FBVCxFQUFZQyxDQUFaLEVBQWVDLENBQWYsQ0FBVjtBQUNBLFFBQUl5RSxLQUFLLEdBQUcsQ0FBWjtBQUNBSCxJQUFBQSxHQUFHLENBQUNSLENBQUosR0FBUVMsR0FBUjtBQUNBRCxJQUFBQSxHQUFHLENBQUNULENBQUosR0FBUVUsR0FBRyxHQUFHLENBQUNBLEdBQUcsR0FBR0MsR0FBUCxJQUFjRCxHQUFqQixHQUF1QixDQUFsQztBQUNBLFFBQUksQ0FBQ0QsR0FBRyxDQUFDVCxDQUFULEVBQVlTLEdBQUcsQ0FBQ1YsQ0FBSixHQUFRLENBQVIsQ0FBWixLQUNLO0FBQ0RhLE1BQUFBLEtBQUssR0FBR0YsR0FBRyxHQUFHQyxHQUFkO0FBQ0EsVUFBSTFFLENBQUMsS0FBS3lFLEdBQVYsRUFBZUQsR0FBRyxDQUFDVixDQUFKLEdBQVEsQ0FBQzdELENBQUMsR0FBR0MsQ0FBTCxJQUFVeUUsS0FBbEIsQ0FBZixLQUNLLElBQUkxRSxDQUFDLEtBQUt3RSxHQUFWLEVBQWVELEdBQUcsQ0FBQ1YsQ0FBSixHQUFRLElBQUksQ0FBQzVELENBQUMsR0FBR0YsQ0FBTCxJQUFVMkUsS0FBdEIsQ0FBZixLQUNBSCxHQUFHLENBQUNWLENBQUosR0FBUSxJQUFJLENBQUM5RCxDQUFDLEdBQUdDLENBQUwsSUFBVTBFLEtBQXRCO0FBQ0xILE1BQUFBLEdBQUcsQ0FBQ1YsQ0FBSixJQUFTLENBQVQ7QUFDQSxVQUFJVSxHQUFHLENBQUNWLENBQUosR0FBUSxDQUFaLEVBQWVVLEdBQUcsQ0FBQ1YsQ0FBSixJQUFTLEdBQVQ7QUFDbEI7QUFDRCxXQUFPVSxHQUFQO0FBQ0g7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7U0FDSXBFLE1BQUEsYUFBSzBCLEtBQUwsRUFBeUI7QUFDckIsUUFBSUEsS0FBSyxDQUFDakIsSUFBVixFQUFnQjtBQUNaLFdBQUtBLElBQUwsR0FBWWlCLEtBQUssQ0FBQ2pCLElBQWxCO0FBQ0gsS0FGRCxNQUdLO0FBQ0QsV0FBS2IsQ0FBTCxHQUFTOEIsS0FBSyxDQUFDOUIsQ0FBZjtBQUNBLFdBQUtDLENBQUwsR0FBUzZCLEtBQUssQ0FBQzdCLENBQWY7QUFDQSxXQUFLQyxDQUFMLEdBQVM0QixLQUFLLENBQUM1QixDQUFmO0FBQ0EsV0FBS0gsQ0FBTCxHQUFTK0IsS0FBSyxDQUFDL0IsQ0FBZjtBQUNIOztBQUNELFdBQU8sSUFBUDtBQUNIOztTQUVEaUMsWUFBQSxtQkFBV0QsS0FBWCxFQUFrQjtBQUNkLFNBQUtsQixJQUFMLEdBQVksQ0FBRSxLQUFLQSxJQUFMLEdBQVksVUFBYixHQUE0QmtCLEtBQUssSUFBSSxFQUF0QyxNQUErQyxDQUEzRDtBQUNIO0FBRUQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUNJZixXQUFBLGtCQUFVbUIsS0FBVixFQUF3QjtBQUNwQixRQUFJbkMsQ0FBQyxHQUFJLENBQUMsS0FBS2EsSUFBTCxHQUFZLFVBQWIsSUFBMkJzQixLQUFLLENBQUNuQyxDQUFsQyxJQUF3QyxDQUFoRDtBQUNBLFFBQUlDLENBQUMsR0FBSSxDQUFDLEtBQUtZLElBQUwsR0FBWSxVQUFiLElBQTJCc0IsS0FBSyxDQUFDbEMsQ0FBbEMsSUFBd0MsQ0FBaEQ7QUFDQSxRQUFJQyxDQUFDLEdBQUksQ0FBQyxLQUFLVyxJQUFMLEdBQVksVUFBYixJQUEyQnNCLEtBQUssQ0FBQ2pDLENBQWxDLElBQXdDLENBQWhEO0FBQ0EsUUFBSUgsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLYyxJQUFMLEdBQVksVUFBYixNQUE2QixDQUE5QixJQUFtQ3NCLEtBQUssQ0FBQ3BDLENBQWpEO0FBQ0EsU0FBS2MsSUFBTCxHQUFhZCxDQUFDLEdBQUcsVUFBTCxHQUFvQkcsQ0FBQyxHQUFHLFVBQXhCLEdBQXVDRCxDQUFDLEdBQUcsVUFBM0MsR0FBMERELENBQUMsR0FBRyxVQUExRTtBQUNBLFdBQU8sSUFBUDtBQUNIOzs7OztBQXRZRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0ksbUJBQWlCO0FBQ2IsYUFBTyxLQUFLd0MsSUFBTCxFQUFQO0FBQ0g7U0FDRCxhQUFPd0IsQ0FBUCxFQUFrQjtBQUNkLFdBQUt2QixJQUFMLENBQVV1QixDQUFWO0FBQ0g7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBOzs7O1NBQ0ksZUFBaUI7QUFDYixhQUFPLEtBQUtuQixJQUFMLEVBQVA7QUFDSDtTQUNELGFBQU9tQixDQUFQLEVBQWtCO0FBQ2QsV0FBS2xCLElBQUwsQ0FBVWtCLENBQVY7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7Ozs7U0FDSSxlQUFpQjtBQUNiLGFBQU8sS0FBS2hCLElBQUwsRUFBUDtBQUNIO1NBQ0QsYUFBT2dCLENBQVAsRUFBa0I7QUFDZCxXQUFLZixJQUFMLENBQVVlLENBQVY7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7Ozs7U0FDSSxlQUFpQjtBQUNiLGFBQU8sS0FBS2IsSUFBTCxFQUFQO0FBQ0g7U0FDRCxhQUFPYSxDQUFQLEVBQWtCO0FBQ2QsV0FBS1osSUFBTCxDQUFVWSxDQUFWO0FBQ0g7Ozs7QUF4ZEQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSSxtQkFBb0I7QUFBRSxhQUFPLElBQUlwRSxLQUFKLENBQVUsR0FBVixFQUFlLEdBQWYsRUFBb0IsR0FBcEIsRUFBeUIsR0FBekIsQ0FBUDtBQUF1Qzs7OztBQUc3RDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJLG1CQUFvQjtBQUFFLGFBQU8sSUFBSUEsS0FBSixDQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLEdBQW5CLENBQVA7QUFBaUM7Ozs7QUFHdkQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSSxtQkFBMEI7QUFBRSxhQUFPLElBQUlBLEtBQUosQ0FBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQixDQUFuQixDQUFQO0FBQStCOzs7O0FBRzNEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0ksbUJBQW1CO0FBQUUsYUFBTyxJQUFJQSxLQUFKLENBQVUsS0FBVixFQUFpQixLQUFqQixFQUF3QixLQUF4QixDQUFQO0FBQXdDOzs7O0FBRzdEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0ksbUJBQWtCO0FBQUUsYUFBTyxJQUFJQSxLQUFKLENBQVUsR0FBVixFQUFlLENBQWYsRUFBa0IsQ0FBbEIsQ0FBUDtBQUE4Qjs7OztBQUVsRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJLG1CQUFvQjtBQUFFLGFBQU8sSUFBSUEsS0FBSixDQUFVLENBQVYsRUFBYSxHQUFiLEVBQWtCLENBQWxCLENBQVA7QUFBOEI7Ozs7QUFFcEQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSSxtQkFBbUI7QUFBRSxhQUFPLElBQUlBLEtBQUosQ0FBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixHQUFoQixDQUFQO0FBQThCOzs7O0FBRW5EO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0ksbUJBQXFCO0FBQUUsYUFBTyxJQUFJQSxLQUFKLENBQVUsR0FBVixFQUFlLEdBQWYsRUFBb0IsQ0FBcEIsQ0FBUDtBQUFnQzs7OztBQUV2RDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJLG1CQUFxQjtBQUFFLGFBQU8sSUFBSUEsS0FBSixDQUFVLEdBQVYsRUFBZSxHQUFmLEVBQW9CLENBQXBCLENBQVA7QUFBZ0M7Ozs7QUFFdkQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSSxtQkFBbUI7QUFBRSxhQUFPLElBQUlBLEtBQUosQ0FBVSxDQUFWLEVBQWEsR0FBYixFQUFrQixHQUFsQixDQUFQO0FBQWdDOzs7O0FBRXJEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0ksbUJBQXNCO0FBQUUsYUFBTyxJQUFJQSxLQUFKLENBQVUsR0FBVixFQUFlLENBQWYsRUFBa0IsR0FBbEIsQ0FBUDtBQUFnQzs7OztFQTFHekJnRjs7O0FBQWRoRixNQUNWaUYsTUFBTWpGLEtBQUssQ0FBQ3FCO0FBREZyQixNQUVWa0YsTUFBTWxGLEtBQUssQ0FBQ21CO0FBRkZuQixNQUdWbUYsTUFBTW5GLEtBQUssQ0FBQ29CO0FBSEZwQixNQWFEb0YsVUFBaUJwRixLQUFLLENBQUNxRjtBQWJ0QnJGLE1BdUJEc0YsVUFBaUJ0RixLQUFLLENBQUN1RjtBQXZCdEJ2RixNQWlDRHdGLGdCQUF1QnhGLEtBQUssQ0FBQ3lGO0FBakM1QnpGLE1BMkNEMEYsU0FBZ0IxRixLQUFLLENBQUMyRjtBQTNDckIzRixNQXFERDRGLFFBQWU1RixLQUFLLENBQUM2RjtBQXJEcEI3RixNQThERDhGLFVBQWlCOUYsS0FBSyxDQUFDK0Y7QUE5RHRCL0YsTUF1RURnRyxTQUFnQmhHLEtBQUssQ0FBQ2lHO0FBdkVyQmpHLE1BZ0ZEa0csV0FBa0JsRyxLQUFLLENBQUNtRztBQWhGdkJuRyxNQXlGRG9HLFdBQWtCcEcsS0FBSyxDQUFDcUc7QUF6RnZCckcsTUFrR0RzRyxTQUFnQnRHLEtBQUssQ0FBQ3VHO0FBbEdyQnZHLE1BMkdEd0csWUFBbUJ4RyxLQUFLLENBQUN5Rzs7QUE2c0I3Q0Msb0JBQVFDLFVBQVIsQ0FBbUIsVUFBbkIsRUFBK0IzRyxLQUEvQixFQUFzQztBQUFFSSxFQUFBQSxDQUFDLEVBQUUsQ0FBTDtBQUFRQyxFQUFBQSxDQUFDLEVBQUUsQ0FBWDtBQUFjQyxFQUFBQSxDQUFDLEVBQUUsQ0FBakI7QUFBb0JILEVBQUFBLENBQUMsRUFBRTtBQUF2QixDQUF0Qzs7QUFHQXlHLEVBQUUsQ0FBQzVHLEtBQUgsR0FBV0EsS0FBWDtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBNEcsRUFBRSxDQUFDMUUsS0FBSCxHQUFXLFNBQVNBLEtBQVQsQ0FBZ0I5QixDQUFoQixFQUFtQkMsQ0FBbkIsRUFBc0JDLENBQXRCLEVBQXlCSCxDQUF6QixFQUE0QjtBQUNuQyxNQUFJLE9BQU9DLENBQVAsS0FBYSxRQUFqQixFQUEyQjtBQUN2QixRQUFJeUcsTUFBTSxHQUFHLElBQUk3RyxLQUFKLEVBQWI7QUFDQSxXQUFPNkcsTUFBTSxDQUFDbEcsT0FBUCxDQUFlUCxDQUFmLENBQVA7QUFDSDs7QUFDRCxNQUFJLE9BQU9BLENBQVAsS0FBYSxRQUFqQixFQUEyQjtBQUN2QixXQUFPLElBQUlKLEtBQUosQ0FBVUksQ0FBQyxDQUFDQSxDQUFaLEVBQWVBLENBQUMsQ0FBQ0MsQ0FBakIsRUFBb0JELENBQUMsQ0FBQ0UsQ0FBdEIsRUFBeUJGLENBQUMsQ0FBQ0QsQ0FBM0IsQ0FBUDtBQUNIOztBQUNELFNBQU8sSUFBSUgsS0FBSixDQUFVSSxDQUFWLEVBQWFDLENBQWIsRUFBZ0JDLENBQWhCLEVBQW1CSCxDQUFuQixDQUFQO0FBQ0gsQ0FURCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IFZhbHVlVHlwZSBmcm9tICcuL3ZhbHVlLXR5cGUnO1xuaW1wb3J0IENDQ2xhc3MgZnJvbSAnLi4vcGxhdGZvcm0vQ0NDbGFzcyc7XG5pbXBvcnQgbWlzYyBmcm9tICcuLi91dGlscy9taXNjJztcblxuLyoqXG4gKiAhI2VuXG4gKiBSZXByZXNlbnRhdGlvbiBvZiBSR0JBIGNvbG9ycy5cbiAqXG4gKiBFYWNoIGNvbG9yIGNvbXBvbmVudCBpcyBhIGZsb2F0aW5nIHBvaW50IHZhbHVlIHdpdGggYSByYW5nZSBmcm9tIDAgdG8gMjU1LlxuICpcbiAqIFlvdSBjYW4gYWxzbyB1c2UgdGhlIGNvbnZlbmllbmNlIG1ldGhvZCB7eyNjcm9zc0xpbmsgXCJjYy9jb2xvcjptZXRob2RcIn19Y2MuY29sb3J7ey9jcm9zc0xpbmt9fSB0byBjcmVhdGUgYSBuZXcgQ29sb3IuXG4gKlxuICogISN6aFxuICogY2MuQ29sb3Ig55So5LqO6KGo56S66aKc6Imy44CCXG4gKlxuICog5a6D5YyF5ZCrIFJHQkEg5Zub5Liq5Lul5rWu54K55pWw5L+d5a2Y55qE6aKc6Imy5YiG6YeP77yM5q+P5Liq55qE5YC86YO95ZyoIDAg5YiwIDI1NSDkuYvpl7TjgIJcbiAqXG4gKiDmgqjkuZ/lj6/ku6XpgJrov4fkvb/nlKgge3sjY3Jvc3NMaW5rIFwiY2MvY29sb3I6bWV0aG9kXCJ9fWNjLmNvbG9ye3svY3Jvc3NMaW5rfX0g55qE5L6/5o235pa55rOV5p2l5Yib5bu65LiA5Liq5paw55qEIENvbG9y44CCXG4gKlxuICogQGNsYXNzIENvbG9yXG4gKiBAZXh0ZW5kcyBWYWx1ZVR5cGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29sb3IgZXh0ZW5kcyBWYWx1ZVR5cGUge1xuICAgIHN0YXRpYyBkaXYgPSBDb2xvci5kaXZpZGU7XG4gICAgc3RhdGljIHN1YiA9IENvbG9yLnN1YnRyYWN0O1xuICAgIHN0YXRpYyBtdWwgPSBDb2xvci5tdWx0aXBseTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gU29saWQgd2hpdGUsIFJHQkEgaXMgWzI1NSwgMjU1LCAyNTUsIDI1NV0uXG4gICAgICogISN6aCDnuq/nmb3oibLvvIxSR0JBIOaYryBbMjU1LCAyNTUsIDI1NSwgMjU1XeOAglxuICAgICAqIEBwcm9wZXJ0eSBXSElURVxuICAgICAqIEB0eXBlIHtDb2xvcn1cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGdldCBXSElURSAoKSB7IHJldHVybiBuZXcgQ29sb3IoMjU1LCAyNTUsIDI1NSwgMjU1KTsgfVxuICAgIHN0YXRpYyByZWFkb25seSBXSElURV9SOiBDb2xvciA9IENvbG9yLldISVRFO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBTb2xpZCBibGFjaywgUkdCQSBpcyBbMCwgMCwgMCwgMjU1XS5cbiAgICAgKiAhI3poIOe6r+m7keiJsu+8jFJHQkEg5pivIFswLCAwLCAwLCAyNTVd44CCXG4gICAgICogQHByb3BlcnR5IEJMQUNLXG4gICAgICogQHR5cGUge0NvbG9yfVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IEJMQUNLICgpIHsgcmV0dXJuIG5ldyBDb2xvcigwLCAwLCAwLCAyNTUpOyB9XG4gICAgc3RhdGljIHJlYWRvbmx5IEJMQUNLX1I6IENvbG9yID0gQ29sb3IuQkxBQ0s7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRyYW5zcGFyZW50LCBSR0JBIGlzIFswLCAwLCAwLCAwXS5cbiAgICAgKiAhI3poIOmAj+aYju+8jFJHQkEg5pivIFswLCAwLCAwLCAwXeOAglxuICAgICAqIEBwcm9wZXJ0eSBUUkFOU1BBUkVOVFxuICAgICAqIEB0eXBlIHtDb2xvcn1cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGdldCBUUkFOU1BBUkVOVCAoKSB7IHJldHVybiBuZXcgQ29sb3IoMCwgMCwgMCwgMCk7IH1cbiAgICBzdGF0aWMgcmVhZG9ubHkgVFJBTlNQQVJFTlRfUjogQ29sb3IgPSBDb2xvci5UUkFOU1BBUkVOVDtcblxuICAgIC8qKlxuICAgICAqICEjZW4gR3JleSwgUkdCQSBpcyBbMTI3LjUsIDEyNy41LCAxMjcuNV0uXG4gICAgICogISN6aCDngbDoibLvvIxSR0JBIOaYryBbMTI3LjUsIDEyNy41LCAxMjcuNV3jgIJcbiAgICAgKiBAcHJvcGVydHkgR1JBWVxuICAgICAqIEB0eXBlIHtDb2xvcn1cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGdldCBHUkFZICgpIHsgcmV0dXJuIG5ldyBDb2xvcigxMjcuNSwgMTI3LjUsIDEyNy41KTsgfVxuICAgIHN0YXRpYyByZWFkb25seSBHUkFZX1I6IENvbG9yID0gQ29sb3IuR1JBWTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gU29saWQgcmVkLCBSR0JBIGlzIFsyNTUsIDAsIDBdLlxuICAgICAqICEjemgg57qv57qi6Imy77yMUkdCQSDmmK8gWzI1NSwgMCwgMF3jgIJcbiAgICAgKiBAcHJvcGVydHkgUkVEXG4gICAgICogQHR5cGUge0NvbG9yfVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IFJFRCAoKSB7IHJldHVybiBuZXcgQ29sb3IoMjU1LCAwLCAwKTsgfVxuICAgIHN0YXRpYyByZWFkb25seSBSRURfUjogQ29sb3IgPSBDb2xvci5SRUQ7XG4gICAgLyoqXG4gICAgICogISNlbiBTb2xpZCBncmVlbiwgUkdCQSBpcyBbMCwgMjU1LCAwXS5cbiAgICAgKiAhI3poIOe6r+e7v+iJsu+8jFJHQkEg5pivIFswLCAyNTUsIDBd44CCXG4gICAgICogQHByb3BlcnR5IEdSRUVOXG4gICAgICogQHR5cGUge0NvbG9yfVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IEdSRUVOICgpIHsgcmV0dXJuIG5ldyBDb2xvcigwLCAyNTUsIDApOyB9XG4gICAgc3RhdGljIHJlYWRvbmx5IEdSRUVOX1I6IENvbG9yID0gQ29sb3IuR1JFRU47XG4gICAgLyoqXG4gICAgICogISNlbiBTb2xpZCBibHVlLCBSR0JBIGlzIFswLCAwLCAyNTVdLlxuICAgICAqICEjemgg57qv6JOd6Imy77yMUkdCQSDmmK8gWzAsIDAsIDI1NV3jgIJcbiAgICAgKiBAcHJvcGVydHkgQkxVRVxuICAgICAqIEB0eXBlIHtDb2xvcn1cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGdldCBCTFVFICgpIHsgcmV0dXJuIG5ldyBDb2xvcigwLCAwLCAyNTUpOyB9XG4gICAgc3RhdGljIHJlYWRvbmx5IEJMVUVfUjogQ29sb3IgPSBDb2xvci5CTFVFO1xuICAgIC8qKlxuICAgICAqICEjZW4gWWVsbG93LCBSR0JBIGlzIFsyNTUsIDIzNSwgNF0uXG4gICAgICogISN6aCDpu4ToibLvvIxSR0JBIOaYryBbMjU1LCAyMzUsIDRd44CCXG4gICAgICogQHByb3BlcnR5IFlFTExPV1xuICAgICAqIEB0eXBlIHtDb2xvcn1cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGdldCBZRUxMT1cgKCkgeyByZXR1cm4gbmV3IENvbG9yKDI1NSwgMjM1LCA0KTsgfVxuICAgIHN0YXRpYyByZWFkb25seSBZRUxMT1dfUjogQ29sb3IgPSBDb2xvci5ZRUxMT1c7XG4gICAgLyoqXG4gICAgICogISNlbiBPcmFuZ2UsIFJHQkEgaXMgWzI1NSwgMTI3LCAwXS5cbiAgICAgKiAhI3poIOapmeiJsu+8jFJHQkEg5pivIFsyNTUsIDEyNywgMF3jgIJcbiAgICAgKiBAcHJvcGVydHkgT1JBTkdFXG4gICAgICogQHR5cGUge0NvbG9yfVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IE9SQU5HRSAoKSB7IHJldHVybiBuZXcgQ29sb3IoMjU1LCAxMjcsIDApOyB9XG4gICAgc3RhdGljIHJlYWRvbmx5IE9SQU5HRV9SOiBDb2xvciA9IENvbG9yLk9SQU5HRTtcbiAgICAvKipcbiAgICAgKiAhI2VuIEN5YW4sIFJHQkEgaXMgWzAsIDI1NSwgMjU1XS5cbiAgICAgKiAhI3poIOmdkuiJsu+8jFJHQkEg5pivIFswLCAyNTUsIDI1NV3jgIJcbiAgICAgKiBAcHJvcGVydHkgQ1lBTlxuICAgICAqIEB0eXBlIHtDb2xvcn1cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGdldCBDWUFOICgpIHsgcmV0dXJuIG5ldyBDb2xvcigwLCAyNTUsIDI1NSk7IH1cbiAgICBzdGF0aWMgcmVhZG9ubHkgQ1lBTl9SOiBDb2xvciA9IENvbG9yLkNZQU47XG4gICAgLyoqXG4gICAgICogISNlbiBNYWdlbnRhLCBSR0JBIGlzIFsyNTUsIDAsIDI1NV0uXG4gICAgICogISN6aCDmtIvnuqLoibLvvIjlk4HnuqLoibLvvInvvIxSR0JBIOaYryBbMjU1LCAwLCAyNTVd44CCXG4gICAgICogQHByb3BlcnR5IE1BR0VOVEFcbiAgICAgKiBAdHlwZSB7Q29sb3J9XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgTUFHRU5UQSAoKSB7IHJldHVybiBuZXcgQ29sb3IoMjU1LCAwLCAyNTUpOyB9XG4gICAgc3RhdGljIHJlYWRvbmx5IE1BR0VOVEFfUjogQ29sb3IgPSBDb2xvci5NQUdFTlRBO1xuXG4gICAgLyoqXG4gICAgICogQ29weSBjb250ZW50IG9mIGEgY29sb3IgaW50byBhbm90aGVyLlxuICAgICAqIEBtZXRob2QgY29weVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogY29weSAob3V0OiBDb2xvciwgYTogQ29sb3IpOiBDb2xvclxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgY29weSAob3V0OiBDb2xvciwgYTogQ29sb3IpOiBDb2xvciB7XG4gICAgICAgIG91dC5yID0gYS5yO1xuICAgICAgICBvdXQuZyA9IGEuZztcbiAgICAgICAgb3V0LmIgPSBhLmI7XG4gICAgICAgIG91dC5hID0gYS5hO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsb25lIGEgbmV3IGNvbG9yLlxuICAgICAqIEBtZXRob2QgY2xvbmVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGNsb25lIChhOiBDb2xvcik6IENvbG9yXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBjbG9uZSAoYTogQ29sb3IpOiBDb2xvciB7XG4gICAgICAgIHJldHVybiBuZXcgQ29sb3IoYS5yLCBhLmcsIGEuYiwgYS5hKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIGNvbXBvbmVudHMgb2YgYSBjb2xvciB0byB0aGUgZ2l2ZW4gdmFsdWVzLlxuICAgICAqIEBtZXRob2Qgc2V0XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzZXQgKG91dDogQ29sb3IsIHI/OiBudW1iZXIsIGc/OiBudW1iZXIsIGI/OiBudW1iZXIsIGE/OiBudW1iZXIpOiBDb2xvclxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgc2V0IChvdXQ6IENvbG9yLCByID0gMjU1LCBnID0gMjU1LCBiID0gMjU1LCBhID0gMjU1KTogQ29sb3Ige1xuICAgICAgICBvdXQuciA9IHI7XG4gICAgICAgIG91dC5nID0gZztcbiAgICAgICAgb3V0LmIgPSBiO1xuICAgICAgICBvdXQuYSA9IGE7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgdGhlIGhleGFkZWNpbWFsIGZvcm1hbCBjb2xvciBpbnRvIHJnYiBmb3JtYWwuXG4gICAgICogQG1ldGhvZCBmcm9tSGV4XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBmcm9tSGV4IChvdXQ6IENvbG9yLCBoZXg6IG51bWJlcik6IENvbG9yXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBkZXByZWNhdGVkXG4gICAgICovXG4gICAgc3RhdGljIGZyb21IZXggKG91dDogQ29sb3IsIGhleDogbnVtYmVyKTogQ29sb3Ige1xuICAgICAgICBsZXQgciA9ICgoaGV4ID4+IDI0KSkgLyAyNTUuMDtcbiAgICAgICAgbGV0IGcgPSAoKGhleCA+PiAxNikgJiAweGZmKSAvIDI1NS4wO1xuICAgICAgICBsZXQgYiA9ICgoaGV4ID4+IDgpICYgMHhmZikgLyAyNTUuMDtcbiAgICAgICAgbGV0IGEgPSAoKGhleCkgJiAweGZmKSAvIDI1NS4wO1xuXG4gICAgICAgIG91dC5yID0gcjtcbiAgICAgICAgb3V0LmcgPSBnO1xuICAgICAgICBvdXQuYiA9IGI7XG4gICAgICAgIG91dC5hID0gYTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyB0aGUgaGV4YWRlY2ltYWwgZm9ybWFsIGNvbG9yIGludG8gcmdiIGZvcm1hbC5cbiAgICAgKiBAbWV0aG9kIGZyb21IRVhcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGZyb21IRVggKG91dDogQ29sb3IsIGhleDogc3RyaW5nKTogQ29sb3JcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGZyb21IRVggKG91dDogQ29sb3IsIGhleFN0cmluZzogc3RyaW5nKTogQ29sb3Ige1xuICAgICAgICBoZXhTdHJpbmcgPSAoaGV4U3RyaW5nLmluZGV4T2YoJyMnKSA9PT0gMCkgPyBoZXhTdHJpbmcuc3Vic3RyaW5nKDEpIDogaGV4U3RyaW5nO1xuICAgICAgICBvdXQuciA9IHBhcnNlSW50KGhleFN0cmluZy5zdWJzdHIoMCwgMiksIDE2KSB8fCAwO1xuICAgICAgICBvdXQuZyA9IHBhcnNlSW50KGhleFN0cmluZy5zdWJzdHIoMiwgMiksIDE2KSB8fCAwO1xuICAgICAgICBvdXQuYiA9IHBhcnNlSW50KGhleFN0cmluZy5zdWJzdHIoNCwgMiksIDE2KSB8fCAwO1xuICAgICAgICBvdXQuYSA9IHBhcnNlSW50KGhleFN0cmluZy5zdWJzdHIoNiwgMiksIDE2KSB8fCAyNTU7XG4gICAgICAgIG91dC5fdmFsID0gKChvdXQuYSA8PCAyNCkgPj4+IDApICsgKG91dC5iIDw8IDE2KSArIChvdXQuZyA8PCA4KSArIG91dC5yO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBjb21wb25lbnRzIG9mIHR3byBjb2xvcnMsIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAbWV0aG9kIGFkZFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogYWRkIChvdXQ6IENvbG9yLCBhOiBDb2xvciwgYjogQ29sb3IpOiBDb2xvclxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgYWRkIChvdXQ6IENvbG9yLCBhOiBDb2xvciwgYjogQ29sb3IpOiBDb2xvciB7XG4gICAgICAgIG91dC5yID0gYS5yICsgYi5yO1xuICAgICAgICBvdXQuZyA9IGEuZyArIGIuZztcbiAgICAgICAgb3V0LmIgPSBhLmIgKyBiLmI7XG4gICAgICAgIG91dC5hID0gYS5hICsgYi5hO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN1YnRyYWN0IGNvbXBvbmVudHMgb2YgY29sb3IgYiBmcm9tIGNvbXBvbmVudHMgb2YgY29sb3IgYSwgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBtZXRob2Qgc3VidHJhY3RcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN1YnRyYWN0IChvdXQ6IENvbG9yLCBhOiBDb2xvciwgYjogQ29sb3IpOiBDb2xvclxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgc3VidHJhY3QgKG91dDogQ29sb3IsIGE6IENvbG9yLCBiOiBDb2xvcik6IENvbG9yIHtcbiAgICAgICAgb3V0LnIgPSBhLnIgLSBiLnI7XG4gICAgICAgIG91dC5nID0gYS5nIC0gYi5nO1xuICAgICAgICBvdXQuYiA9IGEuYiAtIGIuYjtcbiAgICAgICAgb3V0LmEgPSBhLmEgLSBiLmE7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTXVsdGlwbHkgY29tcG9uZW50cyBvZiB0d28gY29sb3JzLCByZXNwZWN0aXZlbHkuXG4gICAgICogQG1ldGhvZCBtdWx0aXBseVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbXVsdGlwbHkgKG91dDogQ29sb3IsIGE6IENvbG9yLCBiOiBDb2xvcik6IENvbG9yXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBtdWx0aXBseSAob3V0OiBDb2xvciwgYTogQ29sb3IsIGI6IENvbG9yKTogQ29sb3Ige1xuICAgICAgICBvdXQuciA9IGEuciAqIGIucjtcbiAgICAgICAgb3V0LmcgPSBhLmcgKiBiLmc7XG4gICAgICAgIG91dC5iID0gYS5iICogYi5iO1xuICAgICAgICBvdXQuYSA9IGEuYSAqIGIuYTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEaXZpZGUgY29tcG9uZW50cyBvZiBjb2xvciBhIGJ5IGNvbXBvbmVudHMgb2YgY29sb3IgYiwgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBtZXRob2QgZGl2aWRlXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBkaXZpZGUgKG91dDogQ29sb3IsIGE6IENvbG9yLCBiOiBDb2xvcik6IENvbG9yXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBkaXZpZGUgKG91dDogQ29sb3IsIGE6IENvbG9yLCBiOiBDb2xvcik6IENvbG9yIHtcbiAgICAgICAgb3V0LnIgPSBhLnIgLyBiLnI7XG4gICAgICAgIG91dC5nID0gYS5nIC8gYi5nO1xuICAgICAgICBvdXQuYiA9IGEuYiAvIGIuYjtcbiAgICAgICAgb3V0LmEgPSBhLmEgLyBiLmE7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2NhbGVzIGEgY29sb3IgYnkgYSBudW1iZXIuXG4gICAgICogQG1ldGhvZCBzY2FsZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc2NhbGUgKG91dDogQ29sb3IsIGE6IENvbG9yLCBiOiBudW1iZXIpOiBDb2xvclxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgc2NhbGUgKG91dDogQ29sb3IsIGE6IENvbG9yLCBiOiBudW1iZXIpOiBDb2xvciB7XG4gICAgICAgIG91dC5yID0gYS5yICogYjtcbiAgICAgICAgb3V0LmcgPSBhLmcgKiBiO1xuICAgICAgICBvdXQuYiA9IGEuYiAqIGI7XG4gICAgICAgIG91dC5hID0gYS5hICogYjtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtcyBhIGxpbmVhciBpbnRlcnBvbGF0aW9uIGJldHdlZW4gdHdvIGNvbG9ycy5cbiAgICAgKiBAbWV0aG9kIGxlcnBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGxlcnAgKG91dDogQ29sb3IsIGE6IENvbG9yLCBiOiBDb2xvciwgdDogbnVtYmVyKTogQ29sb3JcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGxlcnAgKG91dDogQ29sb3IsIGE6IENvbG9yLCBiOiBDb2xvciwgdDogbnVtYmVyKTogQ29sb3Ige1xuICAgICAgICBsZXQgYXIgPSBhLnIsXG4gICAgICAgICAgICBhZyA9IGEuZyxcbiAgICAgICAgICAgIGFiID0gYS5iLFxuICAgICAgICAgICAgYWEgPSBhLmE7XG4gICAgICAgIG91dC5yID0gYXIgKyB0ICogKGIuciAtIGFyKTtcbiAgICAgICAgb3V0LmcgPSBhZyArIHQgKiAoYi5nIC0gYWcpO1xuICAgICAgICBvdXQuYiA9IGFiICsgdCAqIChiLmIgLSBhYik7XG4gICAgICAgIG91dC5hID0gYWEgKyB0ICogKGIuYSAtIGFhKTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOminOiJsui9rOaVsOe7hFxuICAgICAqICEjZW4gVHVybiBhbiBhcnJheSBvZiBjb2xvcnNcbiAgICAgKiBAbWV0aG9kIHRvQXJyYXlcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHRvQXJyYXkgPE91dCBleHRlbmRzIElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+PiAob3V0OiBPdXQsIGE6IElDb2xvckxpa2UsIG9mcz86IG51bWJlcik6IE91dFxuICAgICAqIEBwYXJhbSBvZnMg5pWw57uE6LW35aeL5YGP56e76YePXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyB0b0FycmF5PE91dCBleHRlbmRzIElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+PiAob3V0OiBPdXQsIGE6IElDb2xvckxpa2UsIG9mcyA9IDApIHtcbiAgICAgICAgY29uc3Qgc2NhbGUgPSAoYSBpbnN0YW5jZW9mIENvbG9yIHx8IGEuYSA+IDEpID8gMSAvIDI1NSA6IDE7XG4gICAgICAgIG91dFtvZnMgKyAwXSA9IGEuciAqIHNjYWxlO1xuICAgICAgICBvdXRbb2ZzICsgMV0gPSBhLmcgKiBzY2FsZTtcbiAgICAgICAgb3V0W29mcyArIDJdID0gYS5iICogc2NhbGU7XG4gICAgICAgIG91dFtvZnMgKyAzXSA9IGEuYSAqIHNjYWxlO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5pWw57uE6L2s6aKc6ImyXG4gICAgICogISNlbiBBbiBhcnJheSBvZiBjb2xvcnMgdHVyblxuICAgICAqIEBtZXRob2QgZnJvbUFycmF5XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBmcm9tQXJyYXkgPE91dCBleHRlbmRzIElDb2xvckxpa2U+IChhcnI6IElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+LCBvdXQ6IE91dCwgb2ZzPzogbnVtYmVyKTogT3V0XG4gICAgICogQHBhcmFtIG9mcyDmlbDnu4Totbflp4vlgY/np7vph49cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGZyb21BcnJheTxPdXQgZXh0ZW5kcyBJQ29sb3JMaWtlPiAoYXJyOiBJV3JpdGFibGVBcnJheUxpa2U8bnVtYmVyPiwgb3V0OiBPdXQsIG9mcyA9IDApIHtcbiAgICAgICAgb3V0LnIgPSBhcnJbb2ZzICsgMF0gKiAyNTU7XG4gICAgICAgIG91dC5nID0gYXJyW29mcyArIDFdICogMjU1O1xuICAgICAgICBvdXQuYiA9IGFycltvZnMgKyAyXSAqIDI1NTtcbiAgICAgICAgb3V0LmEgPSBhcnJbb2ZzICsgM10gKiAyNTU7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpopzoibIgUkdCIOmihOS5mCBBbHBoYSDpgJrpgZNcbiAgICAgKiAhI2VuIFJHQiBwcmVtdWx0aXBseSBhbHBoYSBjaGFubmVsXG4gICAgICogQG1ldGhvZCBwcmVtdWx0aXBseUFscGhhXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBwcmVtdWx0aXBseUFscGhhIDxPdXQgZXh0ZW5kcyBJQ29sb3JMaWtlPiAob3V0OiBPdXQsIGE6IElDb2xvckxpa2UpXG4gICAgICogQHBhcmFtIG91dCDov5Tlm57popzoibJcbiAgICAgKiBAcGFyYW0gY29sb3Ig6aKE5LmY5aSE55CG55qE55uu5qCH6aKc6ImyXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBwcmVtdWx0aXBseUFscGhhIChvdXQsIGNvbG9yKSB7XG4gICAgICAgIGxldCBhbHBoYSA9IGNvbG9yLmEgLyAyNTUuMDtcbiAgICAgICAgb3V0LnIgPSBjb2xvci5yICogYWxwaGE7XG4gICAgICAgIG91dC5nID0gY29sb3IuZyAqIGFscGhhO1xuICAgICAgICBvdXQuYiA9IGNvbG9yLmIgKiBhbHBoYTtcblxuICAgICAgICBvdXQuX2Zhc3RTZXRBKGNvbG9yLmEpO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgX3ZhbDogbnVtYmVyID0gMDtcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3I9MF0gLSByZWQgY29tcG9uZW50IG9mIHRoZSBjb2xvciwgZGVmYXVsdCB2YWx1ZSBpcyAwLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbZz0wXSAtIGdyZWVuIGNvbXBvbmVudCBvZiB0aGUgY29sb3IsIGRlZnVhbHQgdmFsdWUgaXMgMC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW2I9MF0gLSBibHVlIGNvbXBvbmVudCBvZiB0aGUgY29sb3IsIGRlZmF1bHQgdmFsdWUgaXMgMC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW2E9MjU1XSAtIGFscGhhIGNvbXBvbmVudCBvZiB0aGUgY29sb3IsIGRlZmF1bHQgdmFsdWUgaXMgMjU1LlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yIChyOiBDb2xvciB8IG51bWJlciA9IDAsIGc6IG51bWJlciA9IDAsIGI6IG51bWJlciA9IDAsIGE6IG51bWJlciA9IDI1NSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBpZiAodHlwZW9mIHIgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBnID0gci5nO1xuICAgICAgICAgICAgYiA9IHIuYjtcbiAgICAgICAgICAgIGEgPSByLmE7XG4gICAgICAgICAgICByID0gci5yO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdmFsID0gKChhIDw8IDI0KSA+Pj4gMCkgKyAoYiA8PCAxNikgKyAoZyA8PCA4KSArIChyfDApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2xvbmUgYSBuZXcgY29sb3IgZnJvbSB0aGUgY3VycmVudCBjb2xvci5cbiAgICAgKiAhI3poIOWFi+mahuW9k+WJjeminOiJsuOAglxuICAgICAqIEBtZXRob2QgY2xvbmVcbiAgICAgKiBAcmV0dXJuIHtDb2xvcn0gTmV3bHkgY3JlYXRlZCBjb2xvci5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBjb2xvciA9IG5ldyBjYy5Db2xvcigpO1xuICAgICAqIHZhciBuZXdDb2xvciA9IGNvbG9yLmNsb25lKCk7Ly8gQ29sb3Ige3I6IDAsIGc6IDAsIGI6IDAsIGE6IDI1NX1cbiAgICAgKi9cbiAgICBjbG9uZSAoKTogQ29sb3Ige1xuICAgICAgICB2YXIgcmV0ID0gbmV3IENvbG9yKCk7XG4gICAgICAgIHJldC5fdmFsID0gdGhpcy5fdmFsO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gVE9ET1xuICAgICAqICEjemgg5Yik5pat5Lik5Liq6aKc6Imy5piv5ZCm55u4562J44CCXG4gICAgICogQG1ldGhvZCBlcXVhbHNcbiAgICAgKiBAcGFyYW0ge0NvbG9yfSBvdGhlclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgY29sb3IxID0gY2MuQ29sb3IuV0hJVEU7XG4gICAgICogdmFyIGNvbG9yMiA9IG5ldyBjYy5Db2xvcigyNTUsIDI1NSwgMjU1KTtcbiAgICAgKiBjYy5sb2coY29sb3IxLmVxdWFscyhjb2xvcjIpKTsgLy8gdHJ1ZTtcbiAgICAgKiBjb2xvcjIgPSBjYy5Db2xvci5SRUQ7XG4gICAgICogY2MubG9nKGNvbG9yMi5lcXVhbHMoY29sb3IxKSk7IC8vIGZhbHNlO1xuICAgICAqL1xuICAgIGVxdWFscyAob3RoZXI6IENvbG9yKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBvdGhlciAmJiB0aGlzLl92YWwgPT09IG90aGVyLl92YWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBUT0RPXG4gICAgICogISN6aCDnur/mgKfmj5LlgLxcbiAgICAgKiBAbWV0aG9kIGxlcnBcbiAgICAgKiBAcGFyYW0ge0NvbG9yfSB0b1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByYXRpbyAtIHRoZSBpbnRlcnBvbGF0aW9uIGNvZWZmaWNpZW50LlxuICAgICAqIEBwYXJhbSB7Q29sb3J9IFtvdXRdIC0gb3B0aW9uYWwsIHRoZSByZWNlaXZpbmcgdmVjdG9yLlxuICAgICAqIEByZXR1cm4ge0NvbG9yfVxuICAgICAqIEBleGFtcGxlIHtAbGluayBjb2NvczJkL2NvcmUvdmFsdWUtdHlwZXMvQ0NDb2xvci9sZXJwLmpzfVxuICAgICAqL1xuICAgIGxlcnAgKHRvOiBDb2xvciwgcmF0aW86IG51bWJlciwgb3V0PzogQ29sb3IpOiBDb2xvciB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgQ29sb3IoKTtcbiAgICAgICAgdmFyIHIgPSB0aGlzLnI7XG4gICAgICAgIHZhciBnID0gdGhpcy5nO1xuICAgICAgICB2YXIgYiA9IHRoaXMuYjtcbiAgICAgICAgdmFyIGEgPSB0aGlzLmE7XG4gICAgICAgIG91dC5yID0gciArICh0by5yIC0gcikgKiByYXRpbztcbiAgICAgICAgb3V0LmcgPSBnICsgKHRvLmcgLSBnKSAqIHJhdGlvO1xuICAgICAgICBvdXQuYiA9IGIgKyAodG8uYiAtIGIpICogcmF0aW87XG4gICAgICAgIG91dC5hID0gYSArICh0by5hIC0gYSkgKiByYXRpbztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogISNlbiBUT0RPXG4gICAgICogISN6aCDovazmjaLkuLrmlrnkvr/pmIXor7vnmoTlrZfnrKbkuLLjgIJcbiAgICAgKiBAbWV0aG9kIHRvU3RyaW5nXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGNvbG9yID0gY2MuQ29sb3IuV0hJVEU7XG4gICAgICogY29sb3IudG9TdHJpbmcoKTsgLy8gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDI1NSlcIlxuICAgICAqL1xuICAgIHRvU3RyaW5nICgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gXCJyZ2JhKFwiICtcbiAgICAgICAgICAgIHRoaXMuci50b0ZpeGVkKCkgKyBcIiwgXCIgK1xuICAgICAgICAgICAgdGhpcy5nLnRvRml4ZWQoKSArIFwiLCBcIiArXG4gICAgICAgICAgICB0aGlzLmIudG9GaXhlZCgpICsgXCIsIFwiICtcbiAgICAgICAgICAgIHRoaXMuYS50b0ZpeGVkKCkgKyBcIilcIjtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogISNlbiBHZXQgb3Igc2V0IHJlZCBjaGFubmVsIHZhbHVlXG4gICAgICogISN6aCDojrflj5bmiJbogIXorr7nva7nuqLoibLpgJrpgZNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gclxuICAgICAqL1xuICAgIGdldCByICgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRSKCk7XG4gICAgfVxuICAgIHNldCByICh2OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5zZXRSKHYpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0IG9yIHNldCBncmVlbiBjaGFubmVsIHZhbHVlXG4gICAgICogISN6aCDojrflj5bmiJbogIXorr7nva7nu7/oibLpgJrpgZNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gZ1xuICAgICAqL1xuICAgIGdldCBnICgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRHKCk7XG4gICAgfVxuICAgIHNldCBnICh2OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5zZXRHKHYpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0IG9yIHNldCBibHVlIGNoYW5uZWwgdmFsdWVcbiAgICAgKiAhI3poIOiOt+WPluaIluiAheiuvue9ruiTneiJsumAmumBk1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBiXG4gICAgICovXG4gICAgZ2V0IGIgKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEIoKTtcbiAgICB9XG4gICAgc2V0IGIgKHY6IG51bWJlcikge1xuICAgICAgICB0aGlzLnNldEIodik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBHZXQgb3Igc2V0IGFscGhhIGNoYW5uZWwgdmFsdWVcbiAgICAgKiAhI3poIOiOt+WPluaIluiAheiuvue9rumAj+aYjumAmumBk1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBhXG4gICAgICovXG4gICAgZ2V0IGEgKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEEoKTtcbiAgICB9XG4gICAgc2V0IGEgKHY6IG51bWJlcikge1xuICAgICAgICB0aGlzLnNldEEodik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBHZXRzIHJlZCBjaGFubmVsIHZhbHVlXG4gICAgICogISN6aCDojrflj5blvZPliY3popzoibLnmoTnuqLoibLlgLzjgIJcbiAgICAgKiBAbWV0aG9kIGdldFJcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IHJlZCB2YWx1ZS5cbiAgICAgKi9cbiAgICBnZXRSICgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsICYgMHgwMDAwMDBmZjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogISNlbiBTZXRzIHJlZCB2YWx1ZSBhbmQgcmV0dXJuIHRoZSBjdXJyZW50IGNvbG9yIG9iamVjdFxuICAgICAqICEjemgg6K6+572u5b2T5YmN55qE57qi6Imy5YC877yM5bm26L+U5Zue5b2T5YmN5a+56LGh44CCXG4gICAgICogQG1ldGhvZCBzZXRSXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJlZCAtIHRoZSBuZXcgUmVkIGNvbXBvbmVudC5cbiAgICAgKiBAcmV0dXJuIHtDb2xvcn0gdGhpcyBjb2xvci5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBjb2xvciA9IG5ldyBjYy5Db2xvcigpO1xuICAgICAqIGNvbG9yLnNldFIoMjU1KTsgLy8gQ29sb3Ige3I6IDI1NSwgZzogMCwgYjogMCwgYTogMjU1fVxuICAgICAqL1xuICAgIHNldFIgKHJlZCk6IHRoaXMge1xuICAgICAgICByZWQgPSB+fm1pc2MuY2xhbXBmKHJlZCwgMCwgMjU1KTtcbiAgICAgICAgdGhpcy5fdmFsID0gKCh0aGlzLl92YWwgJiAweGZmZmZmZjAwKSB8IHJlZCkgPj4+IDA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldHMgZ3JlZW4gY2hhbm5lbCB2YWx1ZVxuICAgICAqICEjemgg6I635Y+W5b2T5YmN6aKc6Imy55qE57u/6Imy5YC844CCXG4gICAgICogQG1ldGhvZCBnZXRHXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBncmVlbiB2YWx1ZS5cbiAgICAgKi9cbiAgICBnZXRHICgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gKHRoaXMuX3ZhbCAmIDB4MDAwMGZmMDApID4+IDg7XG4gICAgfVxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0cyBncmVlbiB2YWx1ZSBhbmQgcmV0dXJuIHRoZSBjdXJyZW50IGNvbG9yIG9iamVjdFxuICAgICAqICEjemgg6K6+572u5b2T5YmN55qE57u/6Imy5YC877yM5bm26L+U5Zue5b2T5YmN5a+56LGh44CCXG4gICAgICogQG1ldGhvZCBzZXRHXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGdyZWVuIC0gdGhlIG5ldyBHcmVlbiBjb21wb25lbnQuXG4gICAgICogQHJldHVybiB7Q29sb3J9IHRoaXMgY29sb3IuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgY29sb3IgPSBuZXcgY2MuQ29sb3IoKTtcbiAgICAgKiBjb2xvci5zZXRHKDI1NSk7IC8vIENvbG9yIHtyOiAwLCBnOiAyNTUsIGI6IDAsIGE6IDI1NX1cbiAgICAgKi9cbiAgICBzZXRHIChncmVlbik6IHRoaXMge1xuICAgICAgICBncmVlbiA9IH5+bWlzYy5jbGFtcGYoZ3JlZW4sIDAsIDI1NSk7XG4gICAgICAgIHRoaXMuX3ZhbCA9ICgodGhpcy5fdmFsICYgMHhmZmZmMDBmZikgfCAoZ3JlZW4gPDwgOCkpID4+PiAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogISNlbiBHZXRzIGJsdWUgY2hhbm5lbCB2YWx1ZVxuICAgICAqICEjemgg6I635Y+W5b2T5YmN6aKc6Imy55qE6JOd6Imy5YC844CCXG4gICAgICogQG1ldGhvZCBnZXRCXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBibHVlIHZhbHVlLlxuICAgICAqL1xuICAgIGdldEIgKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiAodGhpcy5fdmFsICYgMHgwMGZmMDAwMCkgPj4gMTY7XG4gICAgfVxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0cyBibHVlIHZhbHVlIGFuZCByZXR1cm4gdGhlIGN1cnJlbnQgY29sb3Igb2JqZWN0XG4gICAgICogISN6aCDorr7nva7lvZPliY3nmoTok53oibLlgLzvvIzlubbov5Tlm57lvZPliY3lr7nosaHjgIJcbiAgICAgKiBAbWV0aG9kIHNldEJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYmx1ZSAtIHRoZSBuZXcgQmx1ZSBjb21wb25lbnQuXG4gICAgICogQHJldHVybiB7Q29sb3J9IHRoaXMgY29sb3IuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgY29sb3IgPSBuZXcgY2MuQ29sb3IoKTtcbiAgICAgKiBjb2xvci5zZXRCKDI1NSk7IC8vIENvbG9yIHtyOiAwLCBnOiAwLCBiOiAyNTUsIGE6IDI1NX1cbiAgICAgKi9cbiAgICBzZXRCIChibHVlKTogdGhpcyB7XG4gICAgICAgIGJsdWUgPSB+fm1pc2MuY2xhbXBmKGJsdWUsIDAsIDI1NSk7XG4gICAgICAgIHRoaXMuX3ZhbCA9ICgodGhpcy5fdmFsICYgMHhmZjAwZmZmZikgfCAoYmx1ZSA8PCAxNikpID4+PiAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogISNlbiBHZXRzIGFscGhhIGNoYW5uZWwgdmFsdWVcbiAgICAgKiAhI3poIOiOt+WPluW9k+WJjeminOiJsueahOmAj+aYjuW6puWAvOOAglxuICAgICAqIEBtZXRob2QgZ2V0QVxuICAgICAqIEByZXR1cm4ge051bWJlcn0gYWxwaGEgdmFsdWUuXG4gICAgICovXG4gICAgZ2V0QSAoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLl92YWwgJiAweGZmMDAwMDAwKSA+Pj4gMjQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0cyBhbHBoYSB2YWx1ZSBhbmQgcmV0dXJuIHRoZSBjdXJyZW50IGNvbG9yIG9iamVjdFxuICAgICAqICEjemgg6K6+572u5b2T5YmN55qE6YCP5piO5bqm77yM5bm26L+U5Zue5b2T5YmN5a+56LGh44CCXG4gICAgICogQG1ldGhvZCBzZXRBXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGFscGhhIC0gdGhlIG5ldyBBbHBoYSBjb21wb25lbnQuXG4gICAgICogQHJldHVybiB7Q29sb3J9IHRoaXMgY29sb3IuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgY29sb3IgPSBuZXcgY2MuQ29sb3IoKTtcbiAgICAgKiBjb2xvci5zZXRBKDApOyAvLyBDb2xvciB7cjogMCwgZzogMCwgYjogMCwgYTogMH1cbiAgICAgKi9cbiAgICBzZXRBIChhbHBoYSk6IHRoaXMge1xuICAgICAgICBhbHBoYSA9IH5+bWlzYy5jbGFtcGYoYWxwaGEsIDAsIDI1NSk7XG4gICAgICAgIHRoaXMuX3ZhbCA9ICgodGhpcy5fdmFsICYgMHgwMGZmZmZmZikgfCAoYWxwaGEgPDwgMjQpKSA+Pj4gMDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDb252ZXJ0IGNvbG9yIHRvIGNzcyBmb3JtYXQuXG4gICAgICogISN6aCDovazmjaLkuLogQ1NTIOagvOW8j+OAglxuICAgICAqIEBtZXRob2QgdG9DU1NcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdD1cInJnYmFcIl0gLSBcInJnYmFcIiwgXCJyZ2JcIiwgXCIjcmdiXCIgb3IgXCIjcnJnZ2JiXCIuXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGNvbG9yID0gY2MuQ29sb3IuQkxBQ0s7XG4gICAgICogY29sb3IudG9DU1MoKTsgICAgICAgICAgLy8gXCJyZ2JhKDAsMCwwLDEuMDApXCI7XG4gICAgICogY29sb3IudG9DU1MoXCJyZ2JhXCIpOyAgICAvLyBcInJnYmEoMCwwLDAsMS4wMClcIjtcbiAgICAgKiBjb2xvci50b0NTUyhcInJnYlwiKTsgICAgIC8vIFwicmdiYSgwLDAsMClcIjtcbiAgICAgKiBjb2xvci50b0NTUyhcIiNyZ2JcIik7ICAgIC8vIFwiIzAwMFwiO1xuICAgICAqIGNvbG9yLnRvQ1NTKFwiI3JyZ2diYlwiKTsgLy8gXCIjMDAwMDAwXCI7XG4gICAgICovXG4gICAgdG9DU1MgKG9wdDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCFvcHQgfHwgb3B0ID09PSAncmdiYScpIHtcbiAgICAgICAgICAgIHJldHVybiBcInJnYmEoXCIgK1xuICAgICAgICAgICAgICAgIHRoaXMuciArIFwiLFwiICtcbiAgICAgICAgICAgICAgICB0aGlzLmcgKyBcIixcIiArXG4gICAgICAgICAgICAgICAgdGhpcy5iICsgXCIsXCIgK1xuICAgICAgICAgICAgICAgICh0aGlzLmEgLyAyNTUpLnRvRml4ZWQoMikgKyBcIilcIlxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChvcHQgPT09ICdyZ2InKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJyZ2IoXCIgK1xuICAgICAgICAgICAgICAgIHRoaXMuciArIFwiLFwiICtcbiAgICAgICAgICAgICAgICB0aGlzLmcgKyBcIixcIiArXG4gICAgICAgICAgICAgICAgdGhpcy5iICsgXCIpXCJcbiAgICAgICAgICAgICAgICA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJyMnICsgdGhpcy50b0hFWChvcHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZWFkIGhleCBzdHJpbmcgYW5kIHN0b3JlIGNvbG9yIGRhdGEgaW50byB0aGUgY3VycmVudCBjb2xvciBvYmplY3QsIHRoZSBoZXggc3RyaW5nIG11c3QgYmUgZm9ybWF0ZWQgYXMgcmdiYSBvciByZ2IuXG4gICAgICogISN6aCDor7vlj5YgMTYg6L+b5Yi26aKc6Imy44CCXG4gICAgICogQG1ldGhvZCBmcm9tSEVYXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGhleFN0cmluZ1xuICAgICAqIEByZXR1cm4ge0NvbG9yfVxuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBjb2xvciA9IGNjLkNvbG9yLkJMQUNLO1xuICAgICAqIGNvbG9yLmZyb21IRVgoXCIjRkZGRjMzXCIpOyAvLyBDb2xvciB7cjogMjU1LCBnOiAyNTUsIGI6IDUxLCBhOiAyNTV9O1xuICAgICAqL1xuICAgIGZyb21IRVggKGhleFN0cmluZzogc3RyaW5nKTogdGhpcyB7XG4gICAgICAgIGhleFN0cmluZyA9IChoZXhTdHJpbmcuaW5kZXhPZignIycpID09PSAwKSA/IGhleFN0cmluZy5zdWJzdHJpbmcoMSkgOiBoZXhTdHJpbmc7XG4gICAgICAgIGxldCByID0gcGFyc2VJbnQoaGV4U3RyaW5nLnN1YnN0cigwLCAyKSwgMTYpIHx8IDA7XG4gICAgICAgIGxldCBnID0gcGFyc2VJbnQoaGV4U3RyaW5nLnN1YnN0cigyLCAyKSwgMTYpIHx8IDA7XG4gICAgICAgIGxldCBiID0gcGFyc2VJbnQoaGV4U3RyaW5nLnN1YnN0cig0LCAyKSwgMTYpIHx8IDA7XG4gICAgICAgIGxldCBhID0gcGFyc2VJbnQoaGV4U3RyaW5nLnN1YnN0cig2LCAyKSwgMTYpIHx8IDI1NTtcbiAgICAgICAgdGhpcy5fdmFsID0gKChhIDw8IDI0KSA+Pj4gMCkgKyAoYiA8PCAxNikgKyAoZyA8PCA4KSArIHI7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gY29udmVydCBDb2xvciB0byBIRVggY29sb3Igc3RyaW5nLlxuICAgICAqICEjemgg6L2s5o2i5Li6IDE2IOi/m+WItuOAglxuICAgICAqIEBtZXRob2QgdG9IRVhcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW2ZtdD1cIiNycmdnYmJcIl0gLSBcIiNyZ2JcIiwgXCIjcnJnZ2JiXCIgb3IgXCIjcnJnZ2JiYWFcIi5cbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgY29sb3IgPSBjYy5Db2xvci5CTEFDSztcbiAgICAgKiBjb2xvci50b0hFWChcIiNyZ2JcIik7ICAgICAvLyBcIjAwMFwiO1xuICAgICAqIGNvbG9yLnRvSEVYKFwiI3JyZ2diYlwiKTsgIC8vIFwiMDAwMDAwXCI7XG4gICAgICovXG4gICAgdG9IRVggKGZtdCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHByZWZpeCA9ICcwJztcbiAgICAgICAgLy8gI3JyZ2diYlxuICAgICAgICBsZXQgaGV4ID0gW1xuICAgICAgICAgICAgKHRoaXMuciA8IDE2ID8gcHJlZml4IDogJycpICsgKHRoaXMucikudG9TdHJpbmcoMTYpLFxuICAgICAgICAgICAgKHRoaXMuZyA8IDE2ID8gcHJlZml4IDogJycpICsgKHRoaXMuZykudG9TdHJpbmcoMTYpLFxuICAgICAgICAgICAgKHRoaXMuYiA8IDE2ID8gcHJlZml4IDogJycpICsgKHRoaXMuYikudG9TdHJpbmcoMTYpLFxuICAgICAgICBdO1xuICAgICAgICBpZiAoZm10ID09PSAnI3JnYicpIHtcbiAgICAgICAgICAgIGhleFswXSA9IGhleFswXVswXTtcbiAgICAgICAgICAgIGhleFsxXSA9IGhleFsxXVswXTtcbiAgICAgICAgICAgIGhleFsyXSA9IGhleFsyXVswXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmbXQgPT09ICcjcnJnZ2JiYWEnKSB7XG4gICAgICAgICAgICBoZXgucHVzaCgodGhpcy5hIDwgMTYgPyBwcmVmaXggOiAnJykgKyAodGhpcy5hKS50b1N0cmluZygxNikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoZXguam9pbignJyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ29udmVydCB0byAyNGJpdCByZ2IgdmFsdWUuXG4gICAgICogISN6aCDovazmjaLkuLogMjRiaXQg55qEIFJHQiDlgLzjgIJcbiAgICAgKiBAbWV0aG9kIHRvUkdCVmFsdWVcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgY29sb3IgPSBjYy5Db2xvci5ZRUxMT1c7XG4gICAgICogY29sb3IudG9SR0JWYWx1ZSgpOyAvLyAxNjc3MTg0NDtcbiAgICAgKi9cbiAgICB0b1JHQlZhbHVlICgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsICYgMHgwMGZmZmZmZjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJlYWQgSFNWIG1vZGVsIGNvbG9yIGFuZCBjb252ZXJ0IHRvIFJHQiBjb2xvclxuICAgICAqICEjemgg6K+75Y+WIEhTVu+8iOiJsuW9qeaooeWei++8ieagvOW8j+OAglxuICAgICAqIEBtZXRob2QgZnJvbUhTVlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdlxuICAgICAqIEByZXR1cm4ge0NvbG9yfVxuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBjb2xvciA9IGNjLkNvbG9yLllFTExPVztcbiAgICAgKiBjb2xvci5mcm9tSFNWKDAsIDAsIDEpOyAvLyBDb2xvciB7cjogMjU1LCBnOiAyNTUsIGI6IDI1NSwgYTogMjU1fTtcbiAgICAgKi9cbiAgICBmcm9tSFNWIChoLCBzLCB2KTogdGhpcyB7XG4gICAgICAgIHZhciByLCBnLCBiO1xuICAgICAgICBpZiAocyA9PT0gMCkge1xuICAgICAgICAgICAgciA9IGcgPSBiID0gdjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh2ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgciA9IGcgPSBiID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChoID09PSAxKSBoID0gMDtcbiAgICAgICAgICAgICAgICBoICo9IDY7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKGgpO1xuICAgICAgICAgICAgICAgIHZhciBmID0gaCAtIGk7XG4gICAgICAgICAgICAgICAgdmFyIHAgPSB2ICogKDEgLSBzKTtcbiAgICAgICAgICAgICAgICB2YXIgcSA9IHYgKiAoMSAtIChzICogZikpO1xuICAgICAgICAgICAgICAgIHZhciB0ID0gdiAqICgxIC0gKHMgKiAoMSAtIGYpKSk7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHIgPSB2O1xuICAgICAgICAgICAgICAgICAgICAgICAgZyA9IHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBiID0gcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHIgPSBxO1xuICAgICAgICAgICAgICAgICAgICAgICAgZyA9IHY7XG4gICAgICAgICAgICAgICAgICAgICAgICBiID0gcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHIgPSBwO1xuICAgICAgICAgICAgICAgICAgICAgICAgZyA9IHY7XG4gICAgICAgICAgICAgICAgICAgICAgICBiID0gdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHIgPSBwO1xuICAgICAgICAgICAgICAgICAgICAgICAgZyA9IHE7XG4gICAgICAgICAgICAgICAgICAgICAgICBiID0gdjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHIgPSB0O1xuICAgICAgICAgICAgICAgICAgICAgICAgZyA9IHA7XG4gICAgICAgICAgICAgICAgICAgICAgICBiID0gdjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHIgPSB2O1xuICAgICAgICAgICAgICAgICAgICAgICAgZyA9IHA7XG4gICAgICAgICAgICAgICAgICAgICAgICBiID0gcTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByICo9IDI1NTtcbiAgICAgICAgZyAqPSAyNTU7XG4gICAgICAgIGIgKj0gMjU1O1xuICAgICAgICB0aGlzLl92YWwgPSAoKHRoaXMuYSA8PCAyNCkgPj4+IDApICsgKGIgPDwgMTYpICsgKGcgPDwgOCkgKyAocnwwKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBUcmFuc2Zvcm0gdG8gSFNWIG1vZGVsIGNvbG9yXG4gICAgICogISN6aCDovazmjaLkuLogSFNW77yI6Imy5b2p5qih5Z6L77yJ5qC85byP44CCXG4gICAgICogQG1ldGhvZCB0b0hTVlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gLSB7aDogbnVtYmVyLCBzOiBudW1iZXIsIHY6IG51bWJlcn0uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgY29sb3IgPSBjYy5Db2xvci5ZRUxMT1c7XG4gICAgICogY29sb3IudG9IU1YoKTsgLy8gT2JqZWN0IHtoOiAwLjE1MzM4NjQ1NDE4MzI2NjksIHM6IDAuOTg0MzEzNzI1NDkwMTk2MSwgdjogMX07XG4gICAgICovXG4gICAgdG9IU1YgKCkge1xuICAgICAgICB2YXIgciA9IHRoaXMuciAvIDI1NTtcbiAgICAgICAgdmFyIGcgPSB0aGlzLmcgLyAyNTU7XG4gICAgICAgIHZhciBiID0gdGhpcy5iIC8gMjU1O1xuICAgICAgICB2YXIgaHN2ID0geyBoOiAwLCBzOiAwLCB2OiAwIH07XG4gICAgICAgIHZhciBtYXggPSBNYXRoLm1heChyLCBnLCBiKTtcbiAgICAgICAgdmFyIG1pbiA9IE1hdGgubWluKHIsIGcsIGIpO1xuICAgICAgICB2YXIgZGVsdGEgPSAwO1xuICAgICAgICBoc3YudiA9IG1heDtcbiAgICAgICAgaHN2LnMgPSBtYXggPyAobWF4IC0gbWluKSAvIG1heCA6IDA7XG4gICAgICAgIGlmICghaHN2LnMpIGhzdi5oID0gMDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkZWx0YSA9IG1heCAtIG1pbjtcbiAgICAgICAgICAgIGlmIChyID09PSBtYXgpIGhzdi5oID0gKGcgLSBiKSAvIGRlbHRhO1xuICAgICAgICAgICAgZWxzZSBpZiAoZyA9PT0gbWF4KSBoc3YuaCA9IDIgKyAoYiAtIHIpIC8gZGVsdGE7XG4gICAgICAgICAgICBlbHNlIGhzdi5oID0gNCArIChyIC0gZykgLyBkZWx0YTtcbiAgICAgICAgICAgIGhzdi5oIC89IDY7XG4gICAgICAgICAgICBpZiAoaHN2LmggPCAwKSBoc3YuaCArPSAxLjA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhzdjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCB0aGUgY29sb3JcbiAgICAgKiAhI3poIOiuvue9ruminOiJslxuICAgICAqIEBtZXRob2Qgc2V0XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzZXQgKGNvbG9yOiBDb2xvcik6IENvbG9yXG4gICAgICogQHBhcmFtIHtDb2xvcn0gY29sb3JcbiAgICAgKi9cbiAgICBzZXQgKGNvbG9yOiBDb2xvcik6IHRoaXMge1xuICAgICAgICBpZiAoY29sb3IuX3ZhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmFsID0gY29sb3IuX3ZhbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuciA9IGNvbG9yLnI7XG4gICAgICAgICAgICB0aGlzLmcgPSBjb2xvci5nO1xuICAgICAgICAgICAgdGhpcy5iID0gY29sb3IuYjtcbiAgICAgICAgICAgIHRoaXMuYSA9IGNvbG9yLmE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgX2Zhc3RTZXRBIChhbHBoYSkge1xuICAgICAgICB0aGlzLl92YWwgPSAoKHRoaXMuX3ZhbCAmIDB4MDBmZmZmZmYpIHwgKGFscGhhIDw8IDI0KSkgPj4+IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBNdWx0aXBsaWVzIHRoZSBjdXJyZW50IGNvbG9yIGJ5IHRoZSBzcGVjaWZpZWQgY29sb3JcbiAgICAgKiAhI3poIOWwhuW9k+WJjeminOiJsuS5mOS7peS4juaMh+WumuminOiJslxuICAgICAqIEBtZXRob2QgbXVsdGlwbHlcbiAgICAgKiBAcmV0dXJuIHtDb2xvcn1cbiAgICAgKiBAcGFyYW0ge0NvbG9yfSBvdGhlclxuICAgICAqL1xuICAgIG11bHRpcGx5IChvdGhlcjogQ29sb3IpIHtcbiAgICAgICAgbGV0IHIgPSAoKHRoaXMuX3ZhbCAmIDB4MDAwMDAwZmYpICogb3RoZXIucikgPj4gODtcbiAgICAgICAgbGV0IGcgPSAoKHRoaXMuX3ZhbCAmIDB4MDAwMGZmMDApICogb3RoZXIuZykgPj4gODtcbiAgICAgICAgbGV0IGIgPSAoKHRoaXMuX3ZhbCAmIDB4MDBmZjAwMDApICogb3RoZXIuYikgPj4gODtcbiAgICAgICAgbGV0IGEgPSAoKHRoaXMuX3ZhbCAmIDB4ZmYwMDAwMDApID4+PiA4KSAqIG90aGVyLmE7XG4gICAgICAgIHRoaXMuX3ZhbCA9IChhICYgMHhmZjAwMDAwMCkgfCAoYiAmIDB4MDBmZjAwMDApIHwgKGcgJiAweDAwMDBmZjAwKSB8IChyICYgMHgwMDAwMDBmZik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cblxuQ0NDbGFzcy5mYXN0RGVmaW5lKCdjYy5Db2xvcicsIENvbG9yLCB7IHI6IDAsIGc6IDAsIGI6IDAsIGE6IDI1NSB9KTtcblxuXG5jYy5Db2xvciA9IENvbG9yO1xuXG4vKipcbiAqIEBtb2R1bGUgY2NcbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIFRoZSBjb252ZW5pZW5jZSBtZXRob2QgdG8gY3JlYXRlIGEgbmV3IHt7I2Nyb3NzTGluayBcIkNvbG9yL0NvbG9yOm1ldGhvZFwifX1jYy5Db2xvcnt7L2Nyb3NzTGlua319XG4gKiBBbHBoYSBjaGFubmVsIGlzIG9wdGlvbmFsLiBEZWZhdWx0IHZhbHVlIGlzIDI1NS5cbiAqXG4gKiAhI3poXG4gKiDpgJrov4for6Xmlrnms5XmnaXliJvlu7rkuIDkuKrmlrDnmoQge3sjY3Jvc3NMaW5rIFwiQ29sb3IvQ29sb3I6bWV0aG9kXCJ9fWNjLkNvbG9ye3svY3Jvc3NMaW5rfX0g5a+56LGh44CCXG4gKiBBbHBoYSDpgJrpgZPmmK/lj6/pgInnmoTjgILpu5jorqTlgLzmmK8gMjU144CCXG4gKlxuICogQG1ldGhvZCBjb2xvclxuICogQHBhcmFtIHtOdW1iZXJ9IFtyPTBdXG4gKiBAcGFyYW0ge051bWJlcn0gW2c9MF1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbYj0wXVxuICogQHBhcmFtIHtOdW1iZXJ9IFthPTI1NV1cbiAqIEByZXR1cm4ge0NvbG9yfVxuICogQGV4YW1wbGUge0BsaW5rIGNvY29zMmQvY29yZS92YWx1ZS10eXBlcy9DQ0NvbG9yL2NvbG9yLmpzfVxuICovXG5jYy5jb2xvciA9IGZ1bmN0aW9uIGNvbG9yIChyLCBnLCBiLCBhKSB7XG4gICAgaWYgKHR5cGVvZiByID09PSAnc3RyaW5nJykge1xuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IENvbG9yKCk7XG4gICAgICAgIHJldHVybiByZXN1bHQuZnJvbUhFWChyKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiByID09PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IENvbG9yKHIuciwgci5nLCByLmIsIHIuYSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQ29sb3IociwgZywgYiwgYSk7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=