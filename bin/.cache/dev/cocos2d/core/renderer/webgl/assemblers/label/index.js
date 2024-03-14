
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/webgl/assemblers/label/index.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _assembler = _interopRequireDefault(require("../../../assembler"));

var _CCLabel = _interopRequireDefault(require("../../../../components/CCLabel"));

var _ttf = _interopRequireDefault(require("./2d/ttf"));

var _bmfont = _interopRequireDefault(require("./2d/bmfont"));

var _letter = _interopRequireDefault(require("./2d/letter"));

var _ttf2 = _interopRequireDefault(require("./3d/ttf"));

var _bmfont2 = _interopRequireDefault(require("./3d/bmfont"));

var _letter2 = _interopRequireDefault(require("./3d/letter"));

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
var NativeTTF = undefined;

if (CC_JSB) {
  NativeTTF = require("./2d/nativeTTF");
}

_CCLabel["default"]._canvasPool = {
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

_assembler["default"].register(cc.Label, {
  getConstructor: function getConstructor(label) {
    var is3DNode = label.node.is3DNode;
    var ctor = is3DNode ? _ttf2["default"] : _ttf["default"];

    if (label.font instanceof cc.BitmapFont) {
      ctor = is3DNode ? _bmfont2["default"] : _bmfont["default"];
    } else if (label.cacheMode === _CCLabel["default"].CacheMode.CHAR) {
      if (CC_JSB && !is3DNode && !!jsb.LabelRenderer && label.font instanceof cc.TTFFont && label._useNativeTTF()) {
        ctor = NativeTTF;
      } else if (cc.sys.platform === cc.sys.WECHAT_GAME_SUB) {
        cc.warn('sorry, subdomain does not support CHAR mode currently!');
      } else {
        ctor = is3DNode ? _letter2["default"] : _letter["default"];
      }
    }

    return ctor;
  },
  TTF: _ttf["default"],
  Bmfont: _bmfont["default"],
  Letter: _letter["default"],
  TTF3D: _ttf2["default"],
  Bmfont3D: _bmfont2["default"],
  Letter3D: _letter2["default"],
  NativeTTF: NativeTTF
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL3dlYmdsL2Fzc2VtYmxlcnMvbGFiZWwvaW5kZXguanMiXSwibmFtZXMiOlsiTmF0aXZlVFRGIiwidW5kZWZpbmVkIiwiQ0NfSlNCIiwicmVxdWlyZSIsIkxhYmVsIiwiX2NhbnZhc1Bvb2wiLCJwb29sIiwiZ2V0IiwiZGF0YSIsInBvcCIsImNhbnZhcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNvbnRleHQiLCJnZXRDb250ZXh0IiwidGV4dEJhc2VsaW5lIiwicHV0IiwibGVuZ3RoIiwicHVzaCIsIkFzc2VtYmxlciIsInJlZ2lzdGVyIiwiY2MiLCJnZXRDb25zdHJ1Y3RvciIsImxhYmVsIiwiaXMzRE5vZGUiLCJub2RlIiwiY3RvciIsIlRURjNEIiwiVFRGIiwiZm9udCIsIkJpdG1hcEZvbnQiLCJCbWZvbnQzRCIsIkJtZm9udCIsImNhY2hlTW9kZSIsIkNhY2hlTW9kZSIsIkNIQVIiLCJqc2IiLCJMYWJlbFJlbmRlcmVyIiwiVFRGRm9udCIsIl91c2VOYXRpdmVUVEYiLCJzeXMiLCJwbGF0Zm9ybSIsIldFQ0hBVF9HQU1FX1NVQiIsIndhcm4iLCJMZXR0ZXIzRCIsIkxldHRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQXlCQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7OztBQWxDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFhQSxJQUFJQSxTQUFTLEdBQUdDLFNBQWhCOztBQUNBLElBQUdDLE1BQUgsRUFBVztBQUNQRixFQUFBQSxTQUFTLEdBQUdHLE9BQU8sQ0FBQyxnQkFBRCxDQUFuQjtBQUNIOztBQUVEQyxvQkFBTUMsV0FBTixHQUFvQjtBQUNoQkMsRUFBQUEsSUFBSSxFQUFFLEVBRFU7QUFFaEJDLEVBQUFBLEdBRmdCLGlCQUVUO0FBQ0gsUUFBSUMsSUFBSSxHQUFHLEtBQUtGLElBQUwsQ0FBVUcsR0FBVixFQUFYOztBQUVBLFFBQUksQ0FBQ0QsSUFBTCxFQUFXO0FBQ1AsVUFBSUUsTUFBTSxHQUFHQyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBYjtBQUNBLFVBQUlDLE9BQU8sR0FBR0gsTUFBTSxDQUFDSSxVQUFQLENBQWtCLElBQWxCLENBQWQ7QUFDQU4sTUFBQUEsSUFBSSxHQUFHO0FBQ0hFLFFBQUFBLE1BQU0sRUFBRUEsTUFETDtBQUVIRyxRQUFBQSxPQUFPLEVBQUVBO0FBRk4sT0FBUCxDQUhPLENBUVA7O0FBQ0FBLE1BQUFBLE9BQU8sQ0FBQ0UsWUFBUixHQUF1QixZQUF2QjtBQUNIOztBQUVELFdBQU9QLElBQVA7QUFDSCxHQWxCZTtBQW1CaEJRLEVBQUFBLEdBbkJnQixlQW1CWE4sTUFuQlcsRUFtQkg7QUFDVCxRQUFJLEtBQUtKLElBQUwsQ0FBVVcsTUFBVixJQUFvQixFQUF4QixFQUE0QjtBQUN4QjtBQUNIOztBQUNELFNBQUtYLElBQUwsQ0FBVVksSUFBVixDQUFlUixNQUFmO0FBQ0g7QUF4QmUsQ0FBcEI7O0FBMkJBUyxzQkFBVUMsUUFBVixDQUFtQkMsRUFBRSxDQUFDakIsS0FBdEIsRUFBNkI7QUFDekJrQixFQUFBQSxjQUR5QiwwQkFDVkMsS0FEVSxFQUNIO0FBQ2xCLFFBQUlDLFFBQVEsR0FBR0QsS0FBSyxDQUFDRSxJQUFOLENBQVdELFFBQTFCO0FBQ0EsUUFBSUUsSUFBSSxHQUFHRixRQUFRLEdBQUdHLGdCQUFILEdBQVdDLGVBQTlCOztBQUVBLFFBQUlMLEtBQUssQ0FBQ00sSUFBTixZQUFzQlIsRUFBRSxDQUFDUyxVQUE3QixFQUF5QztBQUNyQ0osTUFBQUEsSUFBSSxHQUFHRixRQUFRLEdBQUdPLG1CQUFILEdBQWNDLGtCQUE3QjtBQUNILEtBRkQsTUFFTyxJQUFJVCxLQUFLLENBQUNVLFNBQU4sS0FBb0I3QixvQkFBTThCLFNBQU4sQ0FBZ0JDLElBQXhDLEVBQThDO0FBRWpELFVBQUdqQyxNQUFNLElBQUksQ0FBQ3NCLFFBQVgsSUFBdUIsQ0FBQyxDQUFDWSxHQUFHLENBQUNDLGFBQTdCLElBQThDZCxLQUFLLENBQUNNLElBQU4sWUFBc0JSLEVBQUUsQ0FBQ2lCLE9BQXZFLElBQWtGZixLQUFLLENBQUNnQixhQUFOLEVBQXJGLEVBQTJHO0FBQ3ZHYixRQUFBQSxJQUFJLEdBQUcxQixTQUFQO0FBQ0gsT0FGRCxNQUVPLElBQUlxQixFQUFFLENBQUNtQixHQUFILENBQU9DLFFBQVAsS0FBb0JwQixFQUFFLENBQUNtQixHQUFILENBQU9FLGVBQS9CLEVBQWdEO0FBQ25EckIsUUFBQUEsRUFBRSxDQUFDc0IsSUFBSCxDQUFRLHdEQUFSO0FBQ0gsT0FGTSxNQUVBO0FBQ0hqQixRQUFBQSxJQUFJLEdBQUdGLFFBQVEsR0FBR29CLG1CQUFILEdBQWNDLGtCQUE3QjtBQUNIO0FBQ0o7O0FBRUQsV0FBT25CLElBQVA7QUFDSCxHQW5Cd0I7QUFxQnpCRSxFQUFBQSxHQUFHLEVBQUhBLGVBckJ5QjtBQXNCekJJLEVBQUFBLE1BQU0sRUFBTkEsa0JBdEJ5QjtBQXVCekJhLEVBQUFBLE1BQU0sRUFBTkEsa0JBdkJ5QjtBQXlCekJsQixFQUFBQSxLQUFLLEVBQUxBLGdCQXpCeUI7QUEwQnpCSSxFQUFBQSxRQUFRLEVBQVJBLG1CQTFCeUI7QUEyQnpCYSxFQUFBQSxRQUFRLEVBQVJBLG1CQTNCeUI7QUE0QnpCNUMsRUFBQUEsU0FBUyxFQUFUQTtBQTVCeUIsQ0FBN0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgQXNzZW1ibGVyIGZyb20gJy4uLy4uLy4uL2Fzc2VtYmxlcic7XG5pbXBvcnQgTGFiZWwgZnJvbSAnLi4vLi4vLi4vLi4vY29tcG9uZW50cy9DQ0xhYmVsJztcblxuaW1wb3J0IFRURiBmcm9tICcuLzJkL3R0Zic7XG5pbXBvcnQgQm1mb250IGZyb20gJy4vMmQvYm1mb250JztcbmltcG9ydCBMZXR0ZXIgZnJvbSAnLi8yZC9sZXR0ZXInO1xuXG5pbXBvcnQgVFRGM0QgZnJvbSAnLi8zZC90dGYnO1xuaW1wb3J0IEJtZm9udDNEIGZyb20gJy4vM2QvYm1mb250JztcbmltcG9ydCBMZXR0ZXIzRCBmcm9tICcuLzNkL2xldHRlcic7XG5cbmxldCBOYXRpdmVUVEYgPSB1bmRlZmluZWQ7XG5pZihDQ19KU0IpIHtcbiAgICBOYXRpdmVUVEYgPSByZXF1aXJlKFwiLi8yZC9uYXRpdmVUVEZcIik7XG59XG5cbkxhYmVsLl9jYW52YXNQb29sID0ge1xuICAgIHBvb2w6IFtdLFxuICAgIGdldCAoKSB7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5wb29sLnBvcCgpO1xuXG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICAgICAgICBsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgICAgIGNhbnZhczogY2FudmFzLFxuICAgICAgICAgICAgICAgIGNvbnRleHQ6IGNvbnRleHRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZGVmYXVsdCB0ZXh0IGluZm9cbiAgICAgICAgICAgIGNvbnRleHQudGV4dEJhc2VsaW5lID0gJ2FscGhhYmV0aWMnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSxcbiAgICBwdXQgKGNhbnZhcykge1xuICAgICAgICBpZiAodGhpcy5wb29sLmxlbmd0aCA+PSAzMikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucG9vbC5wdXNoKGNhbnZhcyk7XG4gICAgfVxufTtcblxuQXNzZW1ibGVyLnJlZ2lzdGVyKGNjLkxhYmVsLCB7XG4gICAgZ2V0Q29uc3RydWN0b3IobGFiZWwpIHtcbiAgICAgICAgbGV0IGlzM0ROb2RlID0gbGFiZWwubm9kZS5pczNETm9kZTtcbiAgICAgICAgbGV0IGN0b3IgPSBpczNETm9kZSA/IFRURjNEIDogVFRGO1xuICAgICAgICBcbiAgICAgICAgaWYgKGxhYmVsLmZvbnQgaW5zdGFuY2VvZiBjYy5CaXRtYXBGb250KSB7XG4gICAgICAgICAgICBjdG9yID0gaXMzRE5vZGUgPyBCbWZvbnQzRCA6IEJtZm9udDtcbiAgICAgICAgfSBlbHNlIGlmIChsYWJlbC5jYWNoZU1vZGUgPT09IExhYmVsLkNhY2hlTW9kZS5DSEFSKSB7XG5cbiAgICAgICAgICAgIGlmKENDX0pTQiAmJiAhaXMzRE5vZGUgJiYgISFqc2IuTGFiZWxSZW5kZXJlciAmJiBsYWJlbC5mb250IGluc3RhbmNlb2YgY2MuVFRGRm9udCAmJiBsYWJlbC5fdXNlTmF0aXZlVFRGKCkpe1xuICAgICAgICAgICAgICAgIGN0b3IgPSBOYXRpdmVUVEY7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PT0gY2Muc3lzLldFQ0hBVF9HQU1FX1NVQikge1xuICAgICAgICAgICAgICAgIGNjLndhcm4oJ3NvcnJ5LCBzdWJkb21haW4gZG9lcyBub3Qgc3VwcG9ydCBDSEFSIG1vZGUgY3VycmVudGx5IScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjdG9yID0gaXMzRE5vZGUgPyBMZXR0ZXIzRCA6IExldHRlcjtcbiAgICAgICAgICAgIH0gIFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN0b3I7XG4gICAgfSxcblxuICAgIFRURixcbiAgICBCbWZvbnQsXG4gICAgTGV0dGVyLFxuXG4gICAgVFRGM0QsXG4gICAgQm1mb250M0QsXG4gICAgTGV0dGVyM0QsXG4gICAgTmF0aXZlVFRGXG59KTtcbiJdLCJzb3VyY2VSb290IjoiLyJ9