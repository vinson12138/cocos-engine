
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/canvas/render-flow.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _renderFlow = _interopRequireDefault(require("../render-flow"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/****************************************************************************
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
_renderFlow["default"].prototype._draw = function (node, func) {
  var batcher = _renderFlow["default"].getBachther();

  var ctx = batcher._device._ctx;
  var cam = batcher._camera;
  ctx.setTransform(cam.a, cam.b, cam.c, cam.d, cam.tx, cam.ty);
  ctx.scale(1, -1);
  var comp = node._renderComponent;

  comp._assembler[func](ctx, comp);

  this._next._func(node);
};

_renderFlow["default"].prototype._render = function (node) {
  this._draw(node, 'draw');
};

_renderFlow["default"].prototype._postRender = function (node) {
  this._draw(node, 'postDraw');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL2NhbnZhcy9yZW5kZXItZmxvdy5qcyJdLCJuYW1lcyI6WyJSZW5kZXJGbG93IiwicHJvdG90eXBlIiwiX2RyYXciLCJub2RlIiwiZnVuYyIsImJhdGNoZXIiLCJnZXRCYWNodGhlciIsImN0eCIsIl9kZXZpY2UiLCJfY3R4IiwiY2FtIiwiX2NhbWVyYSIsInNldFRyYW5zZm9ybSIsImEiLCJiIiwiYyIsImQiLCJ0eCIsInR5Iiwic2NhbGUiLCJjb21wIiwiX3JlbmRlckNvbXBvbmVudCIsIl9hc3NlbWJsZXIiLCJfbmV4dCIsIl9mdW5jIiwiX3JlbmRlciIsIl9wb3N0UmVuZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBeUJBOzs7O0FBekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBQSx1QkFBV0MsU0FBWCxDQUFxQkMsS0FBckIsR0FBNkIsVUFBVUMsSUFBVixFQUFnQkMsSUFBaEIsRUFBc0I7QUFDL0MsTUFBSUMsT0FBTyxHQUFHTCx1QkFBV00sV0FBWCxFQUFkOztBQUNBLE1BQUlDLEdBQUcsR0FBR0YsT0FBTyxDQUFDRyxPQUFSLENBQWdCQyxJQUExQjtBQUNBLE1BQUlDLEdBQUcsR0FBR0wsT0FBTyxDQUFDTSxPQUFsQjtBQUNBSixFQUFBQSxHQUFHLENBQUNLLFlBQUosQ0FBaUJGLEdBQUcsQ0FBQ0csQ0FBckIsRUFBd0JILEdBQUcsQ0FBQ0ksQ0FBNUIsRUFBK0JKLEdBQUcsQ0FBQ0ssQ0FBbkMsRUFBc0NMLEdBQUcsQ0FBQ00sQ0FBMUMsRUFBNkNOLEdBQUcsQ0FBQ08sRUFBakQsRUFBcURQLEdBQUcsQ0FBQ1EsRUFBekQ7QUFDQVgsRUFBQUEsR0FBRyxDQUFDWSxLQUFKLENBQVUsQ0FBVixFQUFhLENBQUMsQ0FBZDtBQUVBLE1BQUlDLElBQUksR0FBR2pCLElBQUksQ0FBQ2tCLGdCQUFoQjs7QUFDQUQsRUFBQUEsSUFBSSxDQUFDRSxVQUFMLENBQWdCbEIsSUFBaEIsRUFBc0JHLEdBQXRCLEVBQTJCYSxJQUEzQjs7QUFDQSxPQUFLRyxLQUFMLENBQVdDLEtBQVgsQ0FBaUJyQixJQUFqQjtBQUNILENBVkQ7O0FBWUFILHVCQUFXQyxTQUFYLENBQXFCd0IsT0FBckIsR0FBK0IsVUFBVXRCLElBQVYsRUFBZ0I7QUFDM0MsT0FBS0QsS0FBTCxDQUFXQyxJQUFYLEVBQWlCLE1BQWpCO0FBQ0gsQ0FGRDs7QUFJQUgsdUJBQVdDLFNBQVgsQ0FBcUJ5QixXQUFyQixHQUFtQyxVQUFVdkIsSUFBVixFQUFnQjtBQUMvQyxPQUFLRCxLQUFMLENBQVdDLElBQVgsRUFBaUIsVUFBakI7QUFDSCxDQUZEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IFJlbmRlckZsb3cgZnJvbSAnLi4vcmVuZGVyLWZsb3cnO1xuXG5SZW5kZXJGbG93LnByb3RvdHlwZS5fZHJhdyA9IGZ1bmN0aW9uIChub2RlLCBmdW5jKSB7XG4gICAgbGV0IGJhdGNoZXIgPSBSZW5kZXJGbG93LmdldEJhY2h0aGVyKCk7XG4gICAgbGV0IGN0eCA9IGJhdGNoZXIuX2RldmljZS5fY3R4O1xuICAgIGxldCBjYW0gPSBiYXRjaGVyLl9jYW1lcmE7XG4gICAgY3R4LnNldFRyYW5zZm9ybShjYW0uYSwgY2FtLmIsIGNhbS5jLCBjYW0uZCwgY2FtLnR4LCBjYW0udHkpO1xuICAgIGN0eC5zY2FsZSgxLCAtMSk7XG5cbiAgICBsZXQgY29tcCA9IG5vZGUuX3JlbmRlckNvbXBvbmVudDtcbiAgICBjb21wLl9hc3NlbWJsZXJbZnVuY10oY3R4LCBjb21wKTtcbiAgICB0aGlzLl9uZXh0Ll9mdW5jKG5vZGUpO1xufVxuXG5SZW5kZXJGbG93LnByb3RvdHlwZS5fcmVuZGVyID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICB0aGlzLl9kcmF3KG5vZGUsICdkcmF3Jyk7XG59XG5cblJlbmRlckZsb3cucHJvdG90eXBlLl9wb3N0UmVuZGVyID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICB0aGlzLl9kcmF3KG5vZGUsICdwb3N0RHJhdycpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIvIn0=