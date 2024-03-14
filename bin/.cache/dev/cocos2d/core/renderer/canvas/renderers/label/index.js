
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/canvas/renderers/label/index.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _assembler = _interopRequireDefault(require("../../../assembler"));

var _CCLabel = _interopRequireDefault(require("../../../../components/CCLabel"));

var _ttf = _interopRequireDefault(require("./ttf"));

var _bmfont = _interopRequireDefault(require("./bmfont"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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
var canvasPool = {
  pool: [],
  get: function get() {
    var data = this.pool.pop();

    if (!data) {
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      data = {
        canvas: canvas,
        context: context
      }; // default text info

      context.textBaseline = 'alphabetic';
    }

    return data;
  },
  put: function put(canvas) {
    if (this.pool.length >= 32) {
      return;
    }

    this.pool.push(canvas);
  }
};
_CCLabel["default"]._canvasPool = canvasPool;

_assembler["default"].register(_CCLabel["default"], {
  getConstructor: function getConstructor(label) {
    var ctor = _ttf["default"];

    if (label.font instanceof cc.BitmapFont) {
      ctor = _bmfont["default"];
    } else if (label.cacheMode === _CCLabel["default"].CacheMode.CHAR) {
      cc.warn('sorry, canvas mode does not support CHAR mode currently!');
    }

    return ctor;
  },
  TTF: _ttf["default"],
  Bmfont: _bmfont["default"]
});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL2NhbnZhcy9yZW5kZXJlcnMvbGFiZWwvaW5kZXguanMiXSwibmFtZXMiOlsiY2FudmFzUG9vbCIsInBvb2wiLCJnZXQiLCJkYXRhIiwicG9wIiwiY2FudmFzIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY29udGV4dCIsImdldENvbnRleHQiLCJ0ZXh0QmFzZWxpbmUiLCJwdXQiLCJsZW5ndGgiLCJwdXNoIiwiTGFiZWwiLCJfY2FudmFzUG9vbCIsIkFzc2VtYmxlciIsInJlZ2lzdGVyIiwiZ2V0Q29uc3RydWN0b3IiLCJsYWJlbCIsImN0b3IiLCJUVEYiLCJmb250IiwiY2MiLCJCaXRtYXBGb250IiwiQm1mb250IiwiY2FjaGVNb2RlIiwiQ2FjaGVNb2RlIiwiQ0hBUiIsIndhcm4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUF5QkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUE1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBT0EsSUFBSUEsVUFBVSxHQUFHO0FBQ2JDLEVBQUFBLElBQUksRUFBRSxFQURPO0FBRWJDLEVBQUFBLEdBRmEsaUJBRU47QUFDSCxRQUFJQyxJQUFJLEdBQUcsS0FBS0YsSUFBTCxDQUFVRyxHQUFWLEVBQVg7O0FBRUEsUUFBSSxDQUFDRCxJQUFMLEVBQVc7QUFDUCxVQUFJRSxNQUFNLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixRQUF2QixDQUFiO0FBQ0EsVUFBSUMsT0FBTyxHQUFHSCxNQUFNLENBQUNJLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBZDtBQUNBTixNQUFBQSxJQUFJLEdBQUc7QUFDSEUsUUFBQUEsTUFBTSxFQUFFQSxNQURMO0FBRUhHLFFBQUFBLE9BQU8sRUFBRUE7QUFGTixPQUFQLENBSE8sQ0FRUDs7QUFDQUEsTUFBQUEsT0FBTyxDQUFDRSxZQUFSLEdBQXVCLFlBQXZCO0FBQ0g7O0FBRUQsV0FBT1AsSUFBUDtBQUNILEdBbEJZO0FBbUJiUSxFQUFBQSxHQW5CYSxlQW1CUk4sTUFuQlEsRUFtQkE7QUFDVCxRQUFJLEtBQUtKLElBQUwsQ0FBVVcsTUFBVixJQUFvQixFQUF4QixFQUE0QjtBQUN4QjtBQUNIOztBQUNELFNBQUtYLElBQUwsQ0FBVVksSUFBVixDQUFlUixNQUFmO0FBQ0g7QUF4QlksQ0FBakI7QUEyQkFTLG9CQUFNQyxXQUFOLEdBQW9CZixVQUFwQjs7QUFHQWdCLHNCQUFVQyxRQUFWLENBQW1CSCxtQkFBbkIsRUFBMEI7QUFDdEJJLEVBQUFBLGNBRHNCLDBCQUNQQyxLQURPLEVBQ0E7QUFDbEIsUUFBSUMsSUFBSSxHQUFHQyxlQUFYOztBQUVBLFFBQUlGLEtBQUssQ0FBQ0csSUFBTixZQUFzQkMsRUFBRSxDQUFDQyxVQUE3QixFQUF5QztBQUNyQ0osTUFBQUEsSUFBSSxHQUFHSyxrQkFBUDtBQUNILEtBRkQsTUFFTyxJQUFJTixLQUFLLENBQUNPLFNBQU4sS0FBb0JaLG9CQUFNYSxTQUFOLENBQWdCQyxJQUF4QyxFQUE4QztBQUNqREwsTUFBQUEsRUFBRSxDQUFDTSxJQUFILENBQVEsMERBQVI7QUFDSDs7QUFFRCxXQUFPVCxJQUFQO0FBQ0gsR0FYcUI7QUFhdEJDLEVBQUFBLEdBQUcsRUFBSEEsZUFic0I7QUFjdEJJLEVBQUFBLE1BQU0sRUFBTkE7QUFkc0IsQ0FBMUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IEFzc2VtYmxlciBmcm9tICcuLi8uLi8uLi9hc3NlbWJsZXInO1xuaW1wb3J0IExhYmVsIGZyb20gJy4uLy4uLy4uLy4uL2NvbXBvbmVudHMvQ0NMYWJlbCc7XG5pbXBvcnQgVFRGIGZyb20gJy4vdHRmJztcbmltcG9ydCBCbWZvbnQgZnJvbSAnLi9ibWZvbnQnO1xuXG5sZXQgY2FudmFzUG9vbCA9IHtcbiAgICBwb29sOiBbXSxcbiAgICBnZXQgKCkge1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMucG9vbC5wb3AoKTtcblxuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgICAgICAgbGV0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBjYW52YXM6IGNhbnZhcyxcbiAgICAgICAgICAgICAgICBjb250ZXh0OiBjb250ZXh0XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGRlZmF1bHQgdGV4dCBpbmZvXG4gICAgICAgICAgICBjb250ZXh0LnRleHRCYXNlbGluZSA9ICdhbHBoYWJldGljJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH0sXG4gICAgcHV0IChjYW52YXMpIHtcbiAgICAgICAgaWYgKHRoaXMucG9vbC5sZW5ndGggPj0gMzIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBvb2wucHVzaChjYW52YXMpO1xuICAgIH1cbn07XG5cbkxhYmVsLl9jYW52YXNQb29sID0gY2FudmFzUG9vbDtcblxuXG5Bc3NlbWJsZXIucmVnaXN0ZXIoTGFiZWwsIHtcbiAgICBnZXRDb25zdHJ1Y3RvcihsYWJlbCkge1xuICAgICAgICBsZXQgY3RvciA9IFRURjtcbiAgICAgICAgXG4gICAgICAgIGlmIChsYWJlbC5mb250IGluc3RhbmNlb2YgY2MuQml0bWFwRm9udCkge1xuICAgICAgICAgICAgY3RvciA9IEJtZm9udDtcbiAgICAgICAgfSBlbHNlIGlmIChsYWJlbC5jYWNoZU1vZGUgPT09IExhYmVsLkNhY2hlTW9kZS5DSEFSKSB7XG4gICAgICAgICAgICBjYy53YXJuKCdzb3JyeSwgY2FudmFzIG1vZGUgZG9lcyBub3Qgc3VwcG9ydCBDSEFSIG1vZGUgY3VycmVudGx5IScpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN0b3I7XG4gICAgfSxcblxuICAgIFRURixcbiAgICBCbWZvbnRcbn0pOyJdLCJzb3VyY2VSb290IjoiLyJ9