
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/canvas/renderers/label/bmfont.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _bmfont = _interopRequireDefault(require("../../../utils/label/bmfont"));

var _renderData = _interopRequireDefault(require("../render-data"));

var _utils = _interopRequireDefault(require("../utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var CanvasBmfontAssembler = /*#__PURE__*/function (_BmfontAssembler) {
  _inheritsLoose(CanvasBmfontAssembler, _BmfontAssembler);

  function CanvasBmfontAssembler() {
    return _BmfontAssembler.apply(this, arguments) || this;
  }

  var _proto = CanvasBmfontAssembler.prototype;

  _proto.init = function init() {
    this._renderData = new _renderData["default"]();
  };

  _proto.updateColor = function updateColor() {};

  _proto.appendQuad = function appendQuad(comp, texture, rect, rotated, x, y, scale) {
    var renderData = this._renderData;
    var dataOffset = renderData.dataLength;
    renderData.dataLength += 2;
    var verts = renderData.vertices;
    var rectWidth = rect.width,
        rectHeight = rect.height;
    var l, b, r, t;

    if (!rotated) {
      l = rect.x;
      r = rect.x + rectWidth;
      b = rect.y;
      t = rect.y + rectHeight;
      verts[dataOffset].u = l;
      verts[dataOffset].v = b;
      verts[dataOffset + 1].u = r;
      verts[dataOffset + 1].v = t;
    } else {
      l = rect.x;
      r = rect.x + rectHeight;
      b = rect.y;
      t = rect.y + rectWidth;
      verts[dataOffset].u = l;
      verts[dataOffset].v = t;
      verts[dataOffset + 1].u = l;
      verts[dataOffset + 1].v = b;
    }

    verts[dataOffset].x = x;
    verts[dataOffset].y = y - rectHeight * scale;
    verts[dataOffset + 1].x = x + rectWidth * scale;
    verts[dataOffset + 1].y = y;
  };

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
    ctx.scale(1, -1); // TODO: handle blend function
    // opacity

    _utils["default"].context.setGlobalAlpha(ctx, node.opacity / 255);

    var tex = comp._frame._texture,
        verts = this._renderData.vertices;

    var image = _utils["default"].getColorizedImage(tex, node._color);

    for (var i = 0, l = verts.length; i < l; i += 2) {
      var x = verts[i].x;
      var y = verts[i].y;
      var w = verts[i + 1].x - x;
      var h = verts[i + 1].y - y;
      y = -y - h;
      var sx = verts[i].u;
      var sy = verts[i].v;
      var sw = verts[i + 1].u - sx;
      var sh = verts[i + 1].v - sy;
      ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
    }

    return 1;
  };

  return CanvasBmfontAssembler;
}(_bmfont["default"]);

exports["default"] = CanvasBmfontAssembler;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL2NhbnZhcy9yZW5kZXJlcnMvbGFiZWwvYm1mb250LmpzIl0sIm5hbWVzIjpbIkNhbnZhc0JtZm9udEFzc2VtYmxlciIsImluaXQiLCJfcmVuZGVyRGF0YSIsIlJlbmRlckRhdGEiLCJ1cGRhdGVDb2xvciIsImFwcGVuZFF1YWQiLCJjb21wIiwidGV4dHVyZSIsInJlY3QiLCJyb3RhdGVkIiwieCIsInkiLCJzY2FsZSIsInJlbmRlckRhdGEiLCJkYXRhT2Zmc2V0IiwiZGF0YUxlbmd0aCIsInZlcnRzIiwidmVydGljZXMiLCJyZWN0V2lkdGgiLCJ3aWR0aCIsInJlY3RIZWlnaHQiLCJoZWlnaHQiLCJsIiwiYiIsInIiLCJ0IiwidSIsInYiLCJkcmF3IiwiY3R4Iiwibm9kZSIsIm1hdHJpeCIsIl93b3JsZE1hdHJpeCIsIm1hdHJpeG0iLCJtIiwiYSIsImMiLCJkIiwidHgiLCJ0eSIsInRyYW5zZm9ybSIsInV0aWxzIiwiY29udGV4dCIsInNldEdsb2JhbEFscGhhIiwib3BhY2l0eSIsInRleCIsIl9mcmFtZSIsIl90ZXh0dXJlIiwiaW1hZ2UiLCJnZXRDb2xvcml6ZWRJbWFnZSIsIl9jb2xvciIsImkiLCJsZW5ndGgiLCJ3IiwiaCIsInN4Iiwic3kiLCJzdyIsInNoIiwiZHJhd0ltYWdlIiwiQm1mb250QXNzZW1ibGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOztBQUNBOztBQUNBOzs7Ozs7OztJQUVxQkE7Ozs7Ozs7OztTQUNqQkMsT0FBQSxnQkFBUTtBQUNKLFNBQUtDLFdBQUwsR0FBbUIsSUFBSUMsc0JBQUosRUFBbkI7QUFDSDs7U0FFREMsY0FBQSx1QkFBZSxDQUFFOztTQUVqQkMsYUFBQSxvQkFBWUMsSUFBWixFQUFrQkMsT0FBbEIsRUFBMkJDLElBQTNCLEVBQWlDQyxPQUFqQyxFQUEwQ0MsQ0FBMUMsRUFBNkNDLENBQTdDLEVBQWdEQyxLQUFoRCxFQUF1RDtBQUNu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LEdBQUd0QyxLQUFLLENBQUNtQyxDQUFDLEdBQUMsQ0FBSCxDQUFMLENBQVd4QyxDQUFYLEdBQWVBLENBQXZCO0FBQ0FBLE1BQUFBLENBQUMsR0FBRyxDQUFFQSxDQUFGLEdBQU0yQyxDQUFWO0FBRUEsVUFBSUMsRUFBRSxHQUFHdkMsS0FBSyxDQUFDbUMsQ0FBRCxDQUFMLENBQVN6QixDQUFsQjtBQUNBLFVBQUk4QixFQUFFLEdBQUd4QyxLQUFLLENBQUNtQyxDQUFELENBQUwsQ0FBU3hCLENBQWxCO0FBQ0EsVUFBSThCLEVBQUUsR0FBR3pDLEtBQUssQ0FBQ21DLENBQUMsR0FBQyxDQUFILENBQUwsQ0FBV3pCLENBQVgsR0FBZTZCLEVBQXhCO0FBQ0EsVUFBSUcsRUFBRSxHQUFHMUMsS0FBSyxDQUFDbUMsQ0FBQyxHQUFDLENBQUgsQ0FBTCxDQUFXeEIsQ0FBWCxHQUFlNkIsRUFBeEI7QUFFQTNCLE1BQUFBLEdBQUcsQ0FBQzhCLFNBQUosQ0FBY1gsS0FBZCxFQUNJTyxFQURKLEVBQ1FDLEVBRFIsRUFDWUMsRUFEWixFQUNnQkMsRUFEaEIsRUFFSWhELENBRkosRUFFT0MsQ0FGUCxFQUVVMEMsQ0FGVixFQUVhQyxDQUZiO0FBR0g7O0FBRUQsV0FBTyxDQUFQO0FBQ0g7OztFQXJGOENNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBCbWZvbnRBc3NlbWJsZXIgZnJvbSAnLi4vLi4vLi4vdXRpbHMvbGFiZWwvYm1mb250JztcbmltcG9ydCBSZW5kZXJEYXRhIGZyb20gJy4uL3JlbmRlci1kYXRhJztcbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhc0JtZm9udEFzc2VtYmxlciBleHRlbmRzIEJtZm9udEFzc2VtYmxlciB7XG4gICAgaW5pdCAoKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlckRhdGEgPSBuZXcgUmVuZGVyRGF0YSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZUNvbG9yICgpIHt9XG5cbiAgICBhcHBlbmRRdWFkIChjb21wLCB0ZXh0dXJlLCByZWN0LCByb3RhdGVkLCB4LCB5LCBzY2FsZSkge1xuICAgICAgICBsZXQgcmVuZGVyRGF0YSA9IHRoaXMuX3JlbmRlckRhdGE7XG4gICAgICAgIGxldCBkYXRhT2Zmc2V0ID0gcmVuZGVyRGF0YS5kYXRhTGVuZ3RoO1xuICAgICAgICBcbiAgICAgICAgcmVuZGVyRGF0YS5kYXRhTGVuZ3RoICs9IDI7XG5cbiAgICAgICAgbGV0IHZlcnRzID0gcmVuZGVyRGF0YS52ZXJ0aWNlcztcblxuICAgICAgICBsZXQgcmVjdFdpZHRoID0gcmVjdC53aWR0aCxcbiAgICAgICAgICAgIHJlY3RIZWlnaHQgPSByZWN0LmhlaWdodDtcblxuICAgICAgICBsZXQgbCwgYiwgciwgdDtcbiAgICAgICAgaWYgKCFyb3RhdGVkKSB7XG4gICAgICAgICAgICBsID0gcmVjdC54O1xuICAgICAgICAgICAgciA9IHJlY3QueCArIHJlY3RXaWR0aDtcbiAgICAgICAgICAgIGIgPSByZWN0Lnk7XG4gICAgICAgICAgICB0ID0gcmVjdC55ICsgcmVjdEhlaWdodDtcblxuICAgICAgICAgICAgdmVydHNbZGF0YU9mZnNldF0udSA9IGw7XG4gICAgICAgICAgICB2ZXJ0c1tkYXRhT2Zmc2V0XS52ID0gYjtcbiAgICAgICAgICAgIHZlcnRzW2RhdGFPZmZzZXQrMV0udSA9IHI7XG4gICAgICAgICAgICB2ZXJ0c1tkYXRhT2Zmc2V0KzFdLnYgPSB0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbCA9IHJlY3QueDtcbiAgICAgICAgICAgIHIgPSByZWN0LnggKyByZWN0SGVpZ2h0O1xuICAgICAgICAgICAgYiA9IHJlY3QueTtcbiAgICAgICAgICAgIHQgPSByZWN0LnkgKyByZWN0V2lkdGg7XG5cbiAgICAgICAgICAgIHZlcnRzW2RhdGFPZmZzZXRdLnUgPSBsO1xuICAgICAgICAgICAgdmVydHNbZGF0YU9mZnNldF0udiA9IHQ7XG4gICAgICAgICAgICB2ZXJ0c1tkYXRhT2Zmc2V0KzFdLnUgPSBsO1xuICAgICAgICAgICAgdmVydHNbZGF0YU9mZnNldCsxXS52ID0gYjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZlcnRzW2RhdGFPZmZzZXRdLnggPSB4O1xuICAgICAgICB2ZXJ0c1tkYXRhT2Zmc2V0XS55ID0geSAtIHJlY3RIZWlnaHQgKiBzY2FsZTtcbiAgICAgICAgdmVydHNbZGF0YU9mZnNldCsxXS54ID0geCArIHJlY3RXaWR0aCAqIHNjYWxlO1xuICAgICAgICB2ZXJ0c1tkYXRhT2Zmc2V0KzFdLnkgPSB5O1xuICAgIH1cblxuICAgIGRyYXcgKGN0eCwgY29tcCkge1xuICAgICAgICBsZXQgbm9kZSA9IGNvbXAubm9kZTtcbiAgICAgICAgLy8gVHJhbnNmb3JtXG4gICAgICAgIGxldCBtYXRyaXggPSBub2RlLl93b3JsZE1hdHJpeDtcbiAgICAgICAgbGV0IG1hdHJpeG0gPSBtYXRyaXgubTtcbiAgICAgICAgbGV0IGEgPSBtYXRyaXhtWzBdLCBiID0gbWF0cml4bVsxXSwgYyA9IG1hdHJpeG1bNF0sIGQgPSBtYXRyaXhtWzVdLFxuICAgICAgICAgICAgdHggPSBtYXRyaXhtWzEyXSwgdHkgPSBtYXRyaXhtWzEzXTtcbiAgICAgICAgY3R4LnRyYW5zZm9ybShhLCBiLCBjLCBkLCB0eCwgdHkpO1xuICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuXG4gICAgICAgIC8vIFRPRE86IGhhbmRsZSBibGVuZCBmdW5jdGlvblxuXG4gICAgICAgIC8vIG9wYWNpdHlcbiAgICAgICAgdXRpbHMuY29udGV4dC5zZXRHbG9iYWxBbHBoYShjdHgsIG5vZGUub3BhY2l0eSAvIDI1NSk7XG5cbiAgICAgICAgbGV0IHRleCA9IGNvbXAuX2ZyYW1lLl90ZXh0dXJlLFxuICAgICAgICAgICAgdmVydHMgPSB0aGlzLl9yZW5kZXJEYXRhLnZlcnRpY2VzO1xuXG4gICAgICAgIGxldCBpbWFnZSA9IHV0aWxzLmdldENvbG9yaXplZEltYWdlKHRleCwgbm9kZS5fY29sb3IpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdmVydHMubGVuZ3RoOyBpIDwgbDsgaSs9Mikge1xuICAgICAgICAgICAgbGV0IHggPSB2ZXJ0c1tpXS54O1xuICAgICAgICAgICAgbGV0IHkgPSB2ZXJ0c1tpXS55O1xuICAgICAgICAgICAgbGV0IHcgPSB2ZXJ0c1tpKzFdLnggLSB4O1xuICAgICAgICAgICAgbGV0IGggPSB2ZXJ0c1tpKzFdLnkgLSB5O1xuICAgICAgICAgICAgeSA9IC0geSAtIGg7XG5cbiAgICAgICAgICAgIGxldCBzeCA9IHZlcnRzW2ldLnU7XG4gICAgICAgICAgICBsZXQgc3kgPSB2ZXJ0c1tpXS52O1xuICAgICAgICAgICAgbGV0IHN3ID0gdmVydHNbaSsxXS51IC0gc3g7XG4gICAgICAgICAgICBsZXQgc2ggPSB2ZXJ0c1tpKzFdLnYgLSBzeTtcblxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWFnZSwgXG4gICAgICAgICAgICAgICAgc3gsIHN5LCBzdywgc2gsXG4gICAgICAgICAgICAgICAgeCwgeSwgdywgaCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cbn1cblxuIl0sInNvdXJjZVJvb3QiOiIvIn0=