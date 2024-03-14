
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/canvas/renderers/graphics/index.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _assembler = _interopRequireDefault(require("../../../assembler"));

var _impl = _interopRequireDefault(require("./impl"));

var _graphics = _interopRequireDefault(require("../../../../graphics/graphics"));

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
var CanvasGraphicsAssembler = /*#__PURE__*/function () {
  function CanvasGraphicsAssembler() {}

  var _proto = CanvasGraphicsAssembler.prototype;

  _proto.init = function init() {};

  _proto.updateRenderData = function updateRenderData() {};

  _proto.draw = function draw(ctx, comp) {
    var node = comp.node; // Transform

    var matrix = node._worldMatrix;
    var matrixm = matrix.m;
    var a = matrixm[0],
        b = matrixm[1],
        c = matrixm[4],
        d = matrixm[5],
        tx = matrixm[12],
        ty = matrixm[13];
    ctx.transform(a, b, c, d, tx, ty);
    ctx.save(); // TODO: handle blend function
    // opacity

    ctx.globalAlpha = node.opacity / 255;
    var style = comp._impl.style;
    ctx.strokeStyle = style.strokeStyle;
    ctx.fillStyle = style.fillStyle;
    ctx.lineWidth = style.lineWidth;
    ctx.lineJoin = style.lineJoin;
    ctx.miterLimit = style.miterLimit;
    var endPath = true;
    var cmds = comp._impl.cmds;

    for (var i = 0, l = cmds.length; i < l; i++) {
      var cmd = cmds[i];
      var ctxCmd = cmd[0],
          args = cmd[1];

      if (ctxCmd === 'moveTo' && endPath) {
        ctx.beginPath();
        endPath = false;
      } else if (ctxCmd === 'fill' || ctxCmd === 'stroke' || ctxCmd === 'fillRect') {
        endPath = true;
      }

      if (typeof ctx[ctxCmd] === 'function') {
        ctx[ctxCmd].apply(ctx, args);
      } else {
        ctx[ctxCmd] = args;
      }
    }

    ctx.restore();
    return 1;
  };

  _proto.stroke = function stroke(comp) {
    comp._impl.stroke();
  };

  _proto.fill = function fill(comp) {
    comp._impl.fill();
  };

  _proto.clear = function clear() {};

  return CanvasGraphicsAssembler;
}();

exports["default"] = CanvasGraphicsAssembler;

_assembler["default"].register(_graphics["default"], CanvasGraphicsAssembler);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL2NhbnZhcy9yZW5kZXJlcnMvZ3JhcGhpY3MvaW5kZXguanMiXSwibmFtZXMiOlsiQ2FudmFzR3JhcGhpY3NBc3NlbWJsZXIiLCJpbml0IiwidXBkYXRlUmVuZGVyRGF0YSIsImRyYXciLCJjdHgiLCJjb21wIiwibm9kZSIsIm1hdHJpeCIsIl93b3JsZE1hdHJpeCIsIm1hdHJpeG0iLCJtIiwiYSIsImIiLCJjIiwiZCIsInR4IiwidHkiLCJ0cmFuc2Zvcm0iLCJzYXZlIiwiZ2xvYmFsQWxwaGEiLCJvcGFjaXR5Iiwic3R5bGUiLCJfaW1wbCIsInN0cm9rZVN0eWxlIiwiZmlsbFN0eWxlIiwibGluZVdpZHRoIiwibGluZUpvaW4iLCJtaXRlckxpbWl0IiwiZW5kUGF0aCIsImNtZHMiLCJpIiwibCIsImxlbmd0aCIsImNtZCIsImN0eENtZCIsImFyZ3MiLCJiZWdpblBhdGgiLCJhcHBseSIsInJlc3RvcmUiLCJzdHJva2UiLCJmaWxsIiwiY2xlYXIiLCJBc3NlbWJsZXIiLCJyZWdpc3RlciIsIkdyYXBoaWNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBd0JBOztBQUNBOztBQUNBOzs7O0FBMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUtxQkE7Ozs7O1NBQ2pCQyxPQUFBLGdCQUFRLENBQUU7O1NBRVZDLG1CQUFBLDRCQUFvQixDQUFFOztTQUV0QkMsT0FBQSxjQUFNQyxHQUFOLEVBQVdDLElBQVgsRUFBaUI7QUFDYixRQUFJQyxJQUFJLEdBQUdELElBQUksQ0FBQ0MsSUFBaEIsQ0FEYSxDQUViOztBQUNBLFFBQUlDLE1BQU0sR0FBR0QsSUFBSSxDQUFDRSxZQUFsQjtBQUNBLFFBQUlDLE9BQU8sR0FBR0YsTUFBTSxD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QUFWLENBQW1CQyxvQkFBbkIsRUFBNkI1Qyx1QkFBN0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmltcG9ydCBBc3NlbWJsZXIgZnJvbSAnLi4vLi4vLi4vYXNzZW1ibGVyJztcbmltcG9ydCBJbXBsIGZyb20gJy4vaW1wbCc7XG5pbXBvcnQgR3JhcGhpY3MgZnJvbSAnLi4vLi4vLi4vLi4vZ3JhcGhpY3MvZ3JhcGhpY3MnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXNHcmFwaGljc0Fzc2VtYmxlciB7XG4gICAgaW5pdCAoKSB7fVxuXG4gICAgdXBkYXRlUmVuZGVyRGF0YSAoKSB7fVxuXG4gICAgZHJhdyAoY3R4LCBjb21wKSB7XG4gICAgICAgIGxldCBub2RlID0gY29tcC5ub2RlO1xuICAgICAgICAvLyBUcmFuc2Zvcm1cbiAgICAgICAgbGV0IG1hdHJpeCA9IG5vZGUuX3dvcmxkTWF0cml4O1xuICAgICAgICBsZXQgbWF0cml4bSA9IG1hdHJpeC5tO1xuICAgICAgICBsZXQgYSA9IG1hdHJpeG1bMF0sIGIgPSBtYXRyaXhtWzFdLCBjID0gbWF0cml4bVs0XSwgZCA9IG1hdHJpeG1bNV0sXG4gICAgICAgICAgICB0eCA9IG1hdHJpeG1bMTJdLCB0eSA9IG1hdHJpeG1bMTNdO1xuICAgICAgICBjdHgudHJhbnNmb3JtKGEsIGIsIGMsIGQsIHR4LCB0eSk7XG4gICAgICAgIGN0eC5zYXZlKCk7XG5cbiAgICAgICAgLy8gVE9ETzogaGFuZGxlIGJsZW5kIGZ1bmN0aW9uXG5cbiAgICAgICAgLy8gb3BhY2l0eVxuICAgICAgICBjdHguZ2xvYmFsQWxwaGEgPSBub2RlLm9wYWNpdHkgLyAyNTU7XG5cbiAgICAgICAgbGV0IHN0eWxlID0gY29tcC5faW1wbC5zdHlsZTtcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gc3R5bGUuc3Ryb2tlU3R5bGU7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBzdHlsZS5maWxsU3R5bGU7XG4gICAgICAgIGN0eC5saW5lV2lkdGggPSBzdHlsZS5saW5lV2lkdGg7XG4gICAgICAgIGN0eC5saW5lSm9pbiA9IHN0eWxlLmxpbmVKb2luO1xuICAgICAgICBjdHgubWl0ZXJMaW1pdCA9IHN0eWxlLm1pdGVyTGltaXQ7XG5cbiAgICAgICAgbGV0IGVuZFBhdGggPSB0cnVlO1xuICAgICAgICBsZXQgY21kcyA9IGNvbXAuX2ltcGwuY21kcztcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBjbWRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbGV0IGNtZCA9IGNtZHNbaV07XG4gICAgICAgICAgICBsZXQgY3R4Q21kID0gY21kWzBdLCBhcmdzID0gY21kWzFdO1xuXG4gICAgICAgICAgICBpZiAoY3R4Q21kID09PSAnbW92ZVRvJyAmJiBlbmRQYXRoKSB7XG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgIGVuZFBhdGggPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGN0eENtZCA9PT0gJ2ZpbGwnIHx8IGN0eENtZCA9PT0gJ3N0cm9rZScgfHwgY3R4Q21kID09PSAnZmlsbFJlY3QnKSB7XG4gICAgICAgICAgICAgICAgZW5kUGF0aCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY3R4W2N0eENtZF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBjdHhbY3R4Q21kXS5hcHBseShjdHgsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY3R4W2N0eENtZF0gPSBhcmdzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcblxuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICBzdHJva2UgKGNvbXApIHtcbiAgICAgICAgY29tcC5faW1wbC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBmaWxsIChjb21wKSB7XG4gICAgICAgIGNvbXAuX2ltcGwuZmlsbCgpO1xuICAgIH1cblxuICAgIGNsZWFyICgpIHt9XG59XG5cbkFzc2VtYmxlci5yZWdpc3RlcihHcmFwaGljcywgQ2FudmFzR3JhcGhpY3NBc3NlbWJsZXIpO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=