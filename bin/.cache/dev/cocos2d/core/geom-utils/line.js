
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/geom-utils/line.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _valueTypes = require("../value-types");

var _enums = _interopRequireDefault(require("./enums"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * !#en 
 * line
 * !#zh
 * 直线
 * @class geomUtils.Line
 */
var line = /*#__PURE__*/function () {
  /**
   * !#en
   * create a new line
   * !#zh
   * 创建一个新的 line。
   * @method create
   * @param {Number} sx The x part of the starting point.
   * @param {Number} sy The y part of the starting point.
   * @param {Number} sz The z part of the starting point.
   * @param {Number} ex The x part of the end point.
   * @param {Number} ey The y part of the end point.
   * @param {Number} ez The z part of the end point.
   * @return {Line}
   */
  line.create = function create(sx, sy, sz, ex, ey, ez) {
    return new line(sx, sy, sz, ex, ey, ez);
  }
  /**
   * !#en
   * Creates a new line initialized with values from an existing line
   * !#zh
   * 克隆一个新的 line。
   * @method clone
   * @param {Line} a The source of cloning.
   * @return {Line} The cloned object.
   */
  ;

  line.clone = function clone(a) {
    return new line(a.s.x, a.s.y, a.s.z, a.e.x, a.e.y, a.e.z);
  }
  /**
   * !#en
   * Copy the values from one line to another
   * !#zh
   * 复制一个线的值到另一个。
   * @method copy
   * @param {Line} out The object that accepts the action.
   * @param {Line} a The source of the copy.
   * @return {Line} The object that accepts the action.
   */
  ;

  line.copy = function copy(out, a) {
    _valueTypes.Vec3.copy(out.s, a.s);

    _valueTypes.Vec3.copy(out.e, a.e);

    return out;
  }
  /**
   * !#en
   * create a line from two points
   * !#zh
   * 用两个点创建一个线。
   * @method fromPoints
   * @param {Line} out The object that accepts the action.
   * @param {Vec3} start The starting point.
   * @param {Vec3} end At the end.
   * @return {Line} out The object that accepts the action.
   */
  ;

  line.fromPoints = function fromPoints(out, start, end) {
    _valueTypes.Vec3.copy(out.s, start);

    _valueTypes.Vec3.copy(out.e, end);

    return out;
  }
  /**
   * !#en
   * Set the components of a Vec3 to the given values
   * !#zh
   * 将给定线的属性设置为给定值。
   * @method set
   * @param {Line} out The object that accepts the action.
   * @param {Number} sx The x part of the starting point.
   * @param {Number} sy The y part of the starting point.
   * @param {Number} sz The z part of the starting point.
   * @param {Number} ex The x part of the end point.
   * @param {Number} ey The y part of the end point.
   * @param {Number} ez The z part of the end point.
   * @return {Line} out The object that accepts the action.
   */
  ;

  line.set = function set(out, sx, sy, sz, ex, ey, ez) {
    out.s.x = sx;
    out.s.y = sy;
    out.s.z = sz;
    out.e.x = ex;
    out.e.y = ey;
    out.e.z = ez;
    return out;
  }
  /**
   * !#en
   * Calculate the length of the line.
   * !#zh
   * 计算线的长度。
   * @method len
   * @param {Line} a The line to calculate.
   * @return {Number} Length.
   */
  ;

  line.len = function len(a) {
    return _valueTypes.Vec3.distance(a.s, a.e);
  }
  /**
   * !#en
   * Start points.
   * !#zh
   * 起点。
   * @property {Vec3} s
   */
  ;

  /**
   * !#en Construct a line.
   * !#zh 构造一条线。
   * @constructor
   * @param {Number} sx The x part of the starting point.
   * @param {Number} sy The y part of the starting point.
   * @param {Number} sz The z part of the starting point.
   * @param {Number} ex The x part of the end point.
   * @param {Number} ey The y part of the end point.
   * @param {Number} ez The z part of the end point.
   */
  function line(sx, sy, sz, ex, ey, ez) {
    if (sx === void 0) {
      sx = 0;
    }

    if (sy === void 0) {
      sy = 0;
    }

    if (sz === void 0) {
      sz = 0;
    }

    if (ex === void 0) {
      ex = 0;
    }

    if (ey === void 0) {
      ey = 0;
    }

    if (ez === void 0) {
      ez = -1;
    }

    this.s = void 0;
    this.e = void 0;
    this._type = void 0;
    this._type = _enums["default"].SHAPE_LINE;
    this.s = new _valueTypes.Vec3(sx, sy, sz);
    this.e = new _valueTypes.Vec3(ex, ey, ez);
  }
  /**
   * !#en
   * Calculate the length of the line.
   * !#zh
   * 计算线的长度。
   * @method length
   * @return {Number} Length.
   */


  var _proto = line.prototype;

  _proto.length = function length() {
    return _valueTypes.Vec3.distance(this.s, this.e);
  };

  return line;
}();

exports["default"] = line;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2dlb20tdXRpbHMvbGluZS50cyJdLCJuYW1lcyI6WyJsaW5lIiwiY3JlYXRlIiwic3giLCJzeSIsInN6IiwiZXgiLCJleSIsImV6IiwiY2xvbmUiLCJhIiwicyIsIngiLCJ5IiwieiIsImUiLCJjb3B5Iiwib3V0IiwiVmVjMyIsImZyb21Qb2ludHMiLCJzdGFydCIsImVuZCIsInNldCIsImxlbiIsImRpc3RhbmNlIiwiX3R5cGUiLCJlbnVtcyIsIlNIQVBFX0xJTkUiLCJsZW5ndGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3QkE7O0FBQ0E7Ozs7QUF6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBQ3FCQTtBQUVqQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO09BQ2tCQyxTQUFkLGdCQUFzQkMsRUFBdEIsRUFBa0NDLEVBQWxDLEVBQThDQyxFQUE5QyxFQUEwREMsRUFBMUQsRUFBc0VDLEVBQXRFLEVBQWtGQyxFQUFsRixFQUE4RjtBQUMxRixXQUFPLElBQUlQLElBQUosQ0FBU0UsRUFBVCxFQUFhQyxFQUFiLEVBQWlCQyxFQUFqQixFQUFxQkMsRUFBckIsRUFBeUJDLEVBQXpCLEVBQTZCQyxFQUE3QixDQUFQO0FBQ0g7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztPQUNrQkMsUUFBZCxlQUFxQkMsQ0FBckIsRUFBOEI7QUFDMUIsV0FBTyxJQUFJVCxJQUFKLENBQ0hTLENBQUMsQ0FBQ0MsQ0FBRixDQUFJQyxDQURELEVBQ0lGLENBQUMsQ0FBQ0MsQ0FB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LEdBQUosQ0FBQyxDQUFHO0FBQUE7O0FBQUEsU0F4QnZERyxDQXdCdUQ7QUFBQSxTQWZ2REksQ0FldUQ7QUFBQSxTQWJ0RFUsS0Fhc0Q7QUFDMUQsU0FBS0EsS0FBTCxHQUFhQyxrQkFBTUMsVUFBbkI7QUFDQSxTQUFLaEIsQ0FBTCxHQUFTLElBQUlPLGdCQUFKLENBQVNmLEVBQVQsRUFBYUMsRUFBYixFQUFpQkMsRUFBakIsQ0FBVDtBQUNBLFNBQUtVLENBQUwsR0FBUyxJQUFJRyxnQkFBSixDQUFTWixFQUFULEVBQWFDLEVBQWIsRUFBaUJDLEVBQWpCLENBQVQ7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O1NBQ1dvQixTQUFQLGtCQUFpQjtBQUNiLFdBQU9WLGlCQUFLTSxRQUFMLENBQWMsS0FBS2IsQ0FBbkIsRUFBc0IsS0FBS0ksQ0FBM0IsQ0FBUDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5pbXBvcnQgeyBWZWMzIH0gZnJvbSAnLi4vdmFsdWUtdHlwZXMnO1xuaW1wb3J0IGVudW1zIGZyb20gJy4vZW51bXMnO1xuXG4vKipcbiAqICEjZW4gXG4gKiBsaW5lXG4gKiAhI3poXG4gKiDnm7Tnur9cbiAqIEBjbGFzcyBnZW9tVXRpbHMuTGluZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBsaW5lIHtcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBjcmVhdGUgYSBuZXcgbGluZVxuICAgICAqICEjemhcbiAgICAgKiDliJvlu7rkuIDkuKrmlrDnmoQgbGluZeOAglxuICAgICAqIEBtZXRob2QgY3JlYXRlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHN4IFRoZSB4IHBhcnQgb2YgdGhlIHN0YXJ0aW5nIHBvaW50LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzeSBUaGUgeSBwYXJ0IG9mIHRoZSBzdGFydGluZyBwb2ludC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc3ogVGhlIHogcGFydCBvZiB0aGUgc3RhcnRpbmcgcG9pbnQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGV4IFRoZSB4IHBhcnQgb2YgdGhlIGVuZCBwb2ludC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZXkgVGhlIHkgcGFydCBvZiB0aGUgZW5kIHBvaW50LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBleiBUaGUgeiBwYXJ0IG9mIHRoZSBlbmQgcG9pbnQuXG4gICAgICogQHJldHVybiB7TGluZX1cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZSAoc3g6IG51bWJlciwgc3k6IG51bWJlciwgc3o6IG51bWJlciwgZXg6IG51bWJlciwgZXk6IG51bWJlciwgZXo6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gbmV3IGxpbmUoc3gsIHN5LCBzeiwgZXgsIGV5LCBleik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIENyZWF0ZXMgYSBuZXcgbGluZSBpbml0aWFsaXplZCB3aXRoIHZhbHVlcyBmcm9tIGFuIGV4aXN0aW5nIGxpbmVcbiAgICAgKiAhI3poXG4gICAgICog5YWL6ZqG5LiA5Liq5paw55qEIGxpbmXjgIJcbiAgICAgKiBAbWV0aG9kIGNsb25lXG4gICAgICogQHBhcmFtIHtMaW5lfSBhIFRoZSBzb3VyY2Ugb2YgY2xvbmluZy5cbiAgICAgKiBAcmV0dXJuIHtMaW5lfSBUaGUgY2xvbmVkIG9iamVjdC5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGNsb25lIChhOiBsaW5lKSB7XG4gICAgICAgIHJldHVybiBuZXcgbGluZShcbiAgICAgICAgICAgIGEucy54LCBhLnMueSwgYS5zLnosXG4gICAgICAgICAgICBhLmUueCwgYS5lLnksIGEuZS56LFxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgbGluZSB0byBhbm90aGVyXG4gICAgICogISN6aFxuICAgICAqIOWkjeWItuS4gOS4que6v+eahOWAvOWIsOWPpuS4gOS4quOAglxuICAgICAqIEBtZXRob2QgY29weVxuICAgICAqIEBwYXJhbSB7TGluZX0gb3V0IFRoZSBvYmplY3QgdGhhdCBhY2NlcHRzIHRoZSBhY3Rpb24uXG4gICAgICogQHBhcmFtIHtMaW5lfSBhIFRoZSBzb3VyY2Ugb2YgdGhlIGNvcHkuXG4gICAgICogQHJldHVybiB7TGluZX0gVGhlIG9iamVjdCB0aGF0IGFjY2VwdHMgdGhlIGFjdGlvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGNvcHkgKG91dDogbGluZSwgYTogbGluZSkge1xuICAgICAgICBWZWMzLmNvcHkob3V0LnMsIGEucyk7XG4gICAgICAgIFZlYzMuY29weShvdXQuZSwgYS5lKTtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBjcmVhdGUgYSBsaW5lIGZyb20gdHdvIHBvaW50c1xuICAgICAqICEjemhcbiAgICAgKiDnlKjkuKTkuKrngrnliJvlu7rkuIDkuKrnur/jgIJcbiAgICAgKiBAbWV0aG9kIGZyb21Qb2ludHNcbiAgICAgKiBAcGFyYW0ge0xpbmV9IG91dCBUaGUgb2JqZWN0IHRoYXQgYWNjZXB0cyB0aGUgYWN0aW9uLlxuICAgICAqIEBwYXJhbSB7VmVjM30gc3RhcnQgVGhlIHN0YXJ0aW5nIHBvaW50LlxuICAgICAqIEBwYXJhbSB7VmVjM30gZW5kIEF0IHRoZSBlbmQuXG4gICAgICogQHJldHVybiB7TGluZX0gb3V0IFRoZSBvYmplY3QgdGhhdCBhY2NlcHRzIHRoZSBhY3Rpb24uXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBmcm9tUG9pbnRzIChvdXQ6IGxpbmUsIHN0YXJ0OiBWZWMzLCBlbmQ6IFZlYzMpIHtcbiAgICAgICAgVmVjMy5jb3B5KG91dC5zLCBzdGFydCk7XG4gICAgICAgIFZlYzMuY29weShvdXQuZSwgZW5kKTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0IHRoZSBjb21wb25lbnRzIG9mIGEgVmVjMyB0byB0aGUgZ2l2ZW4gdmFsdWVzXG4gICAgICogISN6aFxuICAgICAqIOWwhue7meWumue6v+eahOWxnuaAp+iuvue9ruS4uue7meWumuWAvOOAglxuICAgICAqIEBtZXRob2Qgc2V0XG4gICAgICogQHBhcmFtIHtMaW5lfSBvdXQgVGhlIG9iamVjdCB0aGF0IGFjY2VwdHMgdGhlIGFjdGlvbi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc3ggVGhlIHggcGFydCBvZiB0aGUgc3RhcnRpbmcgcG9pbnQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHN5IFRoZSB5IHBhcnQgb2YgdGhlIHN0YXJ0aW5nIHBvaW50LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzeiBUaGUgeiBwYXJ0IG9mIHRoZSBzdGFydGluZyBwb2ludC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZXggVGhlIHggcGFydCBvZiB0aGUgZW5kIHBvaW50LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBleSBUaGUgeSBwYXJ0IG9mIHRoZSBlbmQgcG9pbnQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGV6IFRoZSB6IHBhcnQgb2YgdGhlIGVuZCBwb2ludC5cbiAgICAgKiBAcmV0dXJuIHtMaW5lfSBvdXQgVGhlIG9iamVjdCB0aGF0IGFjY2VwdHMgdGhlIGFjdGlvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNldCAob3V0OiBsaW5lLCBzeDogbnVtYmVyLCBzeTogbnVtYmVyLCBzejogbnVtYmVyLCBleDogbnVtYmVyLCBleTogbnVtYmVyLCBlejogbnVtYmVyKSB7XG4gICAgICAgIG91dC5zLnggPSBzeDtcbiAgICAgICAgb3V0LnMueSA9IHN5O1xuICAgICAgICBvdXQucy56ID0gc3o7XG4gICAgICAgIG91dC5lLnggPSBleDtcbiAgICAgICAgb3V0LmUueSA9IGV5O1xuICAgICAgICBvdXQuZS56ID0gZXo7XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ2FsY3VsYXRlIHRoZSBsZW5ndGggb2YgdGhlIGxpbmUuXG4gICAgICogISN6aFxuICAgICAqIOiuoeeul+e6v+eahOmVv+W6puOAglxuICAgICAqIEBtZXRob2QgbGVuXG4gICAgICogQHBhcmFtIHtMaW5lfSBhIFRoZSBsaW5lIHRvIGNhbGN1bGF0ZS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IExlbmd0aC5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGxlbiAoYTogbGluZSkge1xuICAgICAgICByZXR1cm4gVmVjMy5kaXN0YW5jZShhLnMsIGEuZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFN0YXJ0IHBvaW50cy5cbiAgICAgKiAhI3poXG4gICAgICog6LW354K544CCXG4gICAgICogQHByb3BlcnR5IHtWZWMzfSBzXG4gICAgICovXG4gICAgcHVibGljIHM6IFZlYzM7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogRW5kIHBvaW50cy5cbiAgICAgKiAhI3poXG4gICAgICog57uI54K544CCXG4gICAgICogQHByb3BlcnR5IHtWZWMzfSBlXG4gICAgICovXG4gICAgcHVibGljIGU6IFZlYzM7XG5cbiAgICBwcml2YXRlIF90eXBlOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENvbnN0cnVjdCBhIGxpbmUuXG4gICAgICogISN6aCDmnoTpgKDkuIDmnaHnur/jgIJcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc3ggVGhlIHggcGFydCBvZiB0aGUgc3RhcnRpbmcgcG9pbnQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHN5IFRoZSB5IHBhcnQgb2YgdGhlIHN0YXJ0aW5nIHBvaW50LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzeiBUaGUgeiBwYXJ0IG9mIHRoZSBzdGFydGluZyBwb2ludC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZXggVGhlIHggcGFydCBvZiB0aGUgZW5kIHBvaW50LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBleSBUaGUgeSBwYXJ0IG9mIHRoZSBlbmQgcG9pbnQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGV6IFRoZSB6IHBhcnQgb2YgdGhlIGVuZCBwb2ludC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAoc3ggPSAwLCBzeSA9IDAsIHN6ID0gMCwgZXggPSAwLCBleSA9IDAsIGV6ID0gLTEpIHtcbiAgICAgICAgdGhpcy5fdHlwZSA9IGVudW1zLlNIQVBFX0xJTkU7XG4gICAgICAgIHRoaXMucyA9IG5ldyBWZWMzKHN4LCBzeSwgc3opO1xuICAgICAgICB0aGlzLmUgPSBuZXcgVmVjMyhleCwgZXksIGV6KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ2FsY3VsYXRlIHRoZSBsZW5ndGggb2YgdGhlIGxpbmUuXG4gICAgICogISN6aFxuICAgICAqIOiuoeeul+e6v+eahOmVv+W6puOAglxuICAgICAqIEBtZXRob2QgbGVuZ3RoXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBMZW5ndGguXG4gICAgICovXG4gICAgcHVibGljIGxlbmd0aCAoKSB7XG4gICAgICAgIHJldHVybiBWZWMzLmRpc3RhbmNlKHRoaXMucywgdGhpcy5lKTtcbiAgICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==