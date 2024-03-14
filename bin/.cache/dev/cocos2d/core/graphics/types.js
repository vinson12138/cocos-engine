
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/graphics/types.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
'use strict';
/**
 * !#en Enum for LineCap.
 * !#zh 线段末端属性
 * @enum Graphics.LineCap
 */

var LineCap = cc.Enum({
  /**
   * !#en The ends of lines are squared off at the endpoints.
   * !#zh 线段末端以方形结束。
   * @property {Number} BUTT
   */
  BUTT: 0,

  /**
   * !#en The ends of lines are rounded.
   * !#zh 线段末端以圆形结束。
   * @property {Number} ROUND
   */
  ROUND: 1,

  /**
   * !#en The ends of lines are squared off by adding a box with an equal width and half the height of the line's thickness.
   * !#zh 线段末端以方形结束，但是增加了一个宽度和线段相同，高度是线段厚度一半的矩形区域。
   * @property {Number} SQUARE
   */
  SQUARE: 2
});
/**
 * !#en Enum for LineJoin.
 * !#zh 线段拐角属性
 * @enum Graphics.LineJoin
 */

var LineJoin = cc.Enum({
  /**
   * !#en Fills an additional triangular area between the common endpoint of connected segments, and the separate outside rectangular corners of each segment.
   * !#zh 在相连部分的末端填充一个额外的以三角形为底的区域， 每个部分都有各自独立的矩形拐角。
   * @property {Number} BEVEL
   */
  BEVEL: 0,

  /**
   * !#en Rounds off the corners of a shape by filling an additional sector of disc centered at the common endpoint of connected segments. The radius for these rounded corners is equal to the line width.
   * !#zh 通过填充一个额外的，圆心在相连部分末端的扇形，绘制拐角的形状。 圆角的半径是线段的宽度。
   * @property {Number} ROUND
   */
  ROUND: 1,

  /**
   * !#en Connected segments are joined by extending their outside edges to connect at a single point, with the effect of filling an additional lozenge-shaped area.
   * !#zh 通过延伸相连部分的外边缘，使其相交于一点，形成一个额外的菱形区域。
   * @property {Number} MITER
   */
  MITER: 2
}); // PointFlags

var PointFlags = cc.Enum({
  PT_CORNER: 0x01,
  PT_LEFT: 0x02,
  PT_BEVEL: 0x04,
  PT_INNERBEVEL: 0x08
});
module.exports = {
  LineCap: LineCap,
  LineJoin: LineJoin,
  PointFlags: PointFlags
};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2dyYXBoaWNzL3R5cGVzLmpzIl0sIm5hbWVzIjpbIkxpbmVDYXAiLCJjYyIsIkVudW0iLCJCVVRUIiwiUk9VTkQiLCJTUVVBUkUiLCJMaW5lSm9pbiIsIkJFVkVMIiwiTUlURVIiLCJQb2ludEZsYWdzIiwiUFRfQ09STkVSIiwiUFRfTEVGVCIsIlBUX0JFVkVMIiwiUFRfSU5ORVJCRVZFTCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBSUEsT0FBTyxHQUFHQyxFQUFFLENBQUNDLElBQUgsQ0FBUTtBQUNsQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLEVBQUFBLElBQUksRUFBRSxDQU5ZOztBQVFsQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLEVBQUFBLEtBQUssRUFBRSxDQWJXOztBQWVsQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLEVBQUFBLE1BQU0sRUFBRTtBQXBCVSxDQUFSLENBQWQ7QUF1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFJQyxRQUFRLEdBQUdMLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQ25CO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSUssRUFBQUEsS0FBSyxFQUFFLENBTlk7O0FBUW5CO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSUgsRUFBQUEsS0FBSyxFQUFFLENBYlk7O0FBZW5CO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSUksRUFBQUEsS0FBSyxFQUFFO0FBcEJZLENBQVIsQ0FBZixFQXdCQTs7QUFDQSxJQUFJQyxVQUFVLEdBQUlSLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQ3RCUSxFQUFBQSxTQUFTLEVBQUUsSUFEVztBQUV0QkMsRUFBQUEsT0FBTyxFQUFFLElBRmE7QUFHdEJDLEVBQUFBLFFBQVEsRUFBRSxJQUhZO0FBSXRCQyxFQUFBQSxhQUFhLEVBQUU7QUFKTyxDQUFSLENBQWxCO0FBT0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQUNiZixFQUFBQSxPQUFPLEVBQUtBLE9BREM7QUFFYk0sRUFBQUEsUUFBUSxFQUFJQSxRQUZDO0FBR2JHLEVBQUFBLFVBQVUsRUFBRUE7QUFIQyxDQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiBcbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiAhI2VuIEVudW0gZm9yIExpbmVDYXAuXG4gKiAhI3poIOe6v+auteacq+err+WxnuaAp1xuICogQGVudW0gR3JhcGhpY3MuTGluZUNhcFxuICovXG52YXIgTGluZUNhcCA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGVuZHMgb2YgbGluZXMgYXJlIHNxdWFyZWQgb2ZmIGF0IHRoZSBlbmRwb2ludHMuXG4gICAgICogISN6aCDnur/mrrXmnKvnq6/ku6XmlrnlvaLnu5PmnZ/jgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gQlVUVFxuICAgICAqL1xuICAgIEJVVFQ6IDAsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBlbmRzIG9mIGxpbmVzIGFyZSByb3VuZGVkLlxuICAgICAqICEjemgg57q/5q615pyr56uv5Lul5ZyG5b2i57uT5p2f44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFJPVU5EXG4gICAgICovXG4gICAgUk9VTkQ6IDEsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBlbmRzIG9mIGxpbmVzIGFyZSBzcXVhcmVkIG9mZiBieSBhZGRpbmcgYSBib3ggd2l0aCBhbiBlcXVhbCB3aWR0aCBhbmQgaGFsZiB0aGUgaGVpZ2h0IG9mIHRoZSBsaW5lJ3MgdGhpY2tuZXNzLlxuICAgICAqICEjemgg57q/5q615pyr56uv5Lul5pa55b2i57uT5p2f77yM5L2G5piv5aKe5Yqg5LqG5LiA5Liq5a695bqm5ZKM57q/5q6155u45ZCM77yM6auY5bqm5piv57q/5q615Y6a5bqm5LiA5Y2K55qE55+p5b2i5Yy65Z+f44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFNRVUFSRVxuICAgICAqL1xuICAgIFNRVUFSRTogMixcbn0pO1xuXG4vKipcbiAqICEjZW4gRW51bSBmb3IgTGluZUpvaW4uXG4gKiAhI3poIOe6v+auteaLkOinkuWxnuaAp1xuICogQGVudW0gR3JhcGhpY3MuTGluZUpvaW5cbiAqL1xudmFyIExpbmVKb2luID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBGaWxscyBhbiBhZGRpdGlvbmFsIHRyaWFuZ3VsYXIgYXJlYSBiZXR3ZWVuIHRoZSBjb21tb24gZW5kcG9pbnQgb2YgY29ubmVjdGVkIHNlZ21lbnRzLCBhbmQgdGhlIHNlcGFyYXRlIG91dHNpZGUgcmVjdGFuZ3VsYXIgY29ybmVycyBvZiBlYWNoIHNlZ21lbnQuXG4gICAgICogISN6aCDlnKjnm7jov57pg6jliIbnmoTmnKvnq6/loavlhYXkuIDkuKrpop3lpJbnmoTku6XkuInop5LlvaLkuLrlupXnmoTljLrln5/vvIwg5q+P5Liq6YOo5YiG6YO95pyJ5ZCE6Ieq54us56uL55qE55+p5b2i5ouQ6KeS44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEJFVkVMXG4gICAgICovXG4gICAgQkVWRUw6IDAsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJvdW5kcyBvZmYgdGhlIGNvcm5lcnMgb2YgYSBzaGFwZSBieSBmaWxsaW5nIGFuIGFkZGl0aW9uYWwgc2VjdG9yIG9mIGRpc2MgY2VudGVyZWQgYXQgdGhlIGNvbW1vbiBlbmRwb2ludCBvZiBjb25uZWN0ZWQgc2VnbWVudHMuIFRoZSByYWRpdXMgZm9yIHRoZXNlIHJvdW5kZWQgY29ybmVycyBpcyBlcXVhbCB0byB0aGUgbGluZSB3aWR0aC5cbiAgICAgKiAhI3poIOmAmui/h+Whq+WFheS4gOS4qumineWklueahO+8jOWchuW/g+WcqOebuOi/numDqOWIhuacq+err+eahOaJh+W9ou+8jOe7mOWItuaLkOinkueahOW9oueKtuOAgiDlnIbop5LnmoTljYrlvoTmmK/nur/mrrXnmoTlrr3luqbjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUk9VTkRcbiAgICAgKi9cbiAgICBST1VORDogMSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ29ubmVjdGVkIHNlZ21lbnRzIGFyZSBqb2luZWQgYnkgZXh0ZW5kaW5nIHRoZWlyIG91dHNpZGUgZWRnZXMgdG8gY29ubmVjdCBhdCBhIHNpbmdsZSBwb2ludCwgd2l0aCB0aGUgZWZmZWN0IG9mIGZpbGxpbmcgYW4gYWRkaXRpb25hbCBsb3plbmdlLXNoYXBlZCBhcmVhLlxuICAgICAqICEjemgg6YCa6L+H5bu25Ly455u46L+e6YOo5YiG55qE5aSW6L6557yY77yM5L2/5YW255u45Lqk5LqO5LiA54K577yM5b2i5oiQ5LiA5Liq6aKd5aSW55qE6I+x5b2i5Yy65Z+f44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IE1JVEVSXG4gICAgICovXG4gICAgTUlURVI6IDJcbn0pO1xuXG5cbi8vIFBvaW50RmxhZ3NcbnZhciBQb2ludEZsYWdzID0gIGNjLkVudW0oe1xuICAgIFBUX0NPUk5FUjogMHgwMSxcbiAgICBQVF9MRUZUOiAweDAyLFxuICAgIFBUX0JFVkVMOiAweDA0LFxuICAgIFBUX0lOTkVSQkVWRUw6IDB4MDgsXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgTGluZUNhcDogICAgTGluZUNhcCxcbiAgICBMaW5lSm9pbjogICBMaW5lSm9pbixcbiAgICBQb2ludEZsYWdzOiBQb2ludEZsYWdzXG59O1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=