
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/canvas/renderers/label/ttf.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _ttf = _interopRequireDefault(require("../../../utils/label/ttf"));

var _renderData = _interopRequireDefault(require("../render-data"));

var _utils = _interopRequireDefault(require("../utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var CanvasTTFAssembler = /*#__PURE__*/function (_TTFAssembler) {
  _inheritsLoose(CanvasTTFAssembler, _TTFAssembler);

  function CanvasTTFAssembler() {
    return _TTFAssembler.apply(this, arguments) || this;
  }

  var _proto = CanvasTTFAssembler.prototype;

  _proto.init = function init() {
    this._renderData = new _renderData["default"]();
    this._renderData.dataLength = 2;
  };

  _proto.updateColor = function updateColor() {};

  _proto.updateVerts = function updateVerts(comp) {
    var renderData = this._renderData;
    var node = comp.node,
        width = node.width,
        height = node.height,
        appx = node.anchorX * width,
        appy = node.anchorY * height;
    var verts = renderData.vertices;
    verts[0].x = -appx;
    verts[0].y = -appy;
    verts[1].x = width - appx;
    verts[1].y = height - appy;
  };

  _proto._updateTexture = function _updateTexture(comp) {
    _ttf["default"].prototype._updateTexture.call(this, comp);

    var texture = comp._frame._texture;

    _utils["default"].dropColorizedImage(texture, comp.node.color);
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
    var image = tex.getHtmlElementObj();
    var x = verts[0].x;
    var y = verts[0].y;
    var w = verts[1].x - x;
    var h = verts[1].y - y;
    y = -y - h;
    ctx.drawImage(image, x, y, w, h);
    return 1;
  };

  return CanvasTTFAssembler;
}(_ttf["default"]);

exports["default"] = CanvasTTFAssembler;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL2NhbnZhcy9yZW5kZXJlcnMvbGFiZWwvdHRmLmpzIl0sIm5hbWVzIjpbIkNhbnZhc1RURkFzc2VtYmxlciIsImluaXQiLCJfcmVuZGVyRGF0YSIsIlJlbmRlckRhdGEiLCJkYXRhTGVuZ3RoIiwidXBkYXRlQ29sb3IiLCJ1cGRhdGVWZXJ0cyIsImNvbXAiLCJyZW5kZXJEYXRhIiwibm9kZSIsIndpZHRoIiwiaGVpZ2h0IiwiYXBweCIsImFuY2hvclgiLCJhcHB5IiwiYW5jaG9yWSIsInZlcnRzIiwidmVydGljZXMiLCJ4IiwieSIsIl91cGRhdGVUZXh0dXJlIiwiVFRGQXNzZW1ibGVyIiwicHJvdG90eXBlIiwiY2FsbCIsInRleHR1cmUiLCJfZnJhbWUiLCJfdGV4dHVyZSIsInV0aWxzIiwiZHJvcENvbG9yaXplZEltYWdlIiwiY29sb3IiLCJkcmF3IiwiY3R4IiwibWF0cml4IiwiX3dvcmxkTWF0cml4IiwibWF0cml4bSIsIm0iLCJhIiwiYiIsImMiLCJkIiwidHgiLCJ0eSIsInRyYW5zZm9ybSIsInNjYWxlIiwiY29udGV4dCIsInNldEdsb2JhbEFscGhhIiwib3BhY2l0eSIsInRleCIsImltYWdlIiwiZ2V0SHRtbEVsZW1lbnRPYmoiLCJ3IiwiaCIsImRyYXdJbWFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7SUFFcUJBOzs7Ozs7Ozs7U0FDakJDLE9BQUEsZ0JBQVE7QUFDSixTQUFLQyxXQUFMLEdBQW1CLElBQUlDLHNCQUFKLEVBQW5CO0FBQ0EsU0FBS0QsV0FBTCxDQUFpQkUsVUFBakIsR0FBOEIsQ0FBOUI7QUFDSDs7U0FFREMsY0FBQSx1QkFBZSxDQUNkOztTQUVEQyxjQUFBLHFCQUFhQyxJQUFiLEVBQW1CO0FBQ2YsUUFBSUMsVUFBVSxHQUFHLEtBQUtOLFdBQXRCO0FBRUEsUUFBSU8sSUFBSSxHQUFHRixJQUFJLENBQUNFLElB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QUcsQ0FBRUEsQ0FBRixHQUFNZ0MsQ0FBVjtBQUVBcEIsSUFBQUEsR0FBRyxDQUFDcUIsU0FBSixDQUFjSixLQUFkLEVBQXFCOUIsQ0FBckIsRUFBd0JDLENBQXhCLEVBQTJCK0IsQ0FBM0IsRUFBOEJDLENBQTlCO0FBQ0EsV0FBTyxDQUFQO0FBQ0g7OztFQTNEMkM5QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgVFRGQXNzZW1ibGVyIGZyb20gJy4uLy4uLy4uL3V0aWxzL2xhYmVsL3R0Zic7XG5pbXBvcnQgUmVuZGVyRGF0YSBmcm9tICcuLi9yZW5kZXItZGF0YSc7XG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXNUVEZBc3NlbWJsZXIgZXh0ZW5kcyBUVEZBc3NlbWJsZXIge1xuICAgIGluaXQgKCkge1xuICAgICAgICB0aGlzLl9yZW5kZXJEYXRhID0gbmV3IFJlbmRlckRhdGEoKTtcbiAgICAgICAgdGhpcy5fcmVuZGVyRGF0YS5kYXRhTGVuZ3RoID0gMjtcbiAgICB9XG5cbiAgICB1cGRhdGVDb2xvciAoKSB7XG4gICAgfVxuXG4gICAgdXBkYXRlVmVydHMgKGNvbXApIHtcbiAgICAgICAgbGV0IHJlbmRlckRhdGEgPSB0aGlzLl9yZW5kZXJEYXRhO1xuXG4gICAgICAgIGxldCBub2RlID0gY29tcC5ub2RlLFxuICAgICAgICAgICAgd2lkdGggPSBub2RlLndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0ID0gbm9kZS5oZWlnaHQsXG4gICAgICAgICAgICBhcHB4ID0gbm9kZS5hbmNob3JYICogd2lkdGgsXG4gICAgICAgICAgICBhcHB5ID0gbm9kZS5hbmNob3JZICogaGVpZ2h0O1xuXG4gICAgICAgIGxldCB2ZXJ0cyA9IHJlbmRlckRhdGEudmVydGljZXM7XG4gICAgICAgIHZlcnRzWzBdLnggPSAtYXBweDtcbiAgICAgICAgdmVydHNbMF0ueSA9IC1hcHB5O1xuICAgICAgICB2ZXJ0c1sxXS54ID0gd2lkdGggLSBhcHB4O1xuICAgICAgICB2ZXJ0c1sxXS55ID0gaGVpZ2h0IC0gYXBweTtcbiAgICB9XG5cbiAgICBfdXBkYXRlVGV4dHVyZSAoY29tcCkge1xuICAgICAgICBUVEZBc3NlbWJsZXIucHJvdG90eXBlLl91cGRhdGVUZXh0dXJlLmNhbGwodGhpcywgY29tcCk7XG4gICAgICAgIGxldCB0ZXh0dXJlID0gY29tcC5fZnJhbWUuX3RleHR1cmU7XG4gICAgICAgIHV0aWxzLmRyb3BDb2xvcml6ZWRJbWFnZSh0ZXh0dXJlLCBjb21wLm5vZGUuY29sb3IpO1xuICAgIH1cblxuICAgIGRyYXcgKGN0eCwgY29tcCkge1xuICAgICAgICBsZXQgbm9kZSA9IGNvbXAubm9kZTtcbiAgICAgICAgLy8gVHJhbnNmb3JtXG4gICAgICAgIGxldCBtYXRyaXggPSBub2RlLl93b3JsZE1hdHJpeDtcbiAgICAgICAgbGV0IG1hdHJpeG0gPSBtYXRyaXgubTtcbiAgICAgICAgbGV0IGEgPSBtYXRyaXhtWzBdLCBiID0gbWF0cml4bVsxXSwgYyA9IG1hdHJpeG1bNF0sIGQgPSBtYXRyaXhtWzVdLFxuICAgICAgICAgICAgdHggPSBtYXRyaXhtWzEyXSwgdHkgPSBtYXRyaXhtWzEzXTtcbiAgICAgICAgY3R4LnRyYW5zZm9ybShhLCBiLCBjLCBkLCB0eCwgdHkpO1xuICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuXG4gICAgICAgIC8vIFRPRE86IGhhbmRsZSBibGVuZCBmdW5jdGlvblxuXG4gICAgICAgIC8vIG9wYWNpdHlcbiAgICAgICAgdXRpbHMuY29udGV4dC5zZXRHbG9iYWxBbHBoYShjdHgsIG5vZGUub3BhY2l0eSAvIDI1NSk7XG5cbiAgICAgICAgbGV0IHRleCA9IGNvbXAuX2ZyYW1lLl90ZXh0dXJlLFxuICAgICAgICAgICAgdmVydHMgPSB0aGlzLl9yZW5kZXJEYXRhLnZlcnRpY2VzO1xuXG4gICAgICAgIGxldCBpbWFnZSA9IHRleC5nZXRIdG1sRWxlbWVudE9iaigpO1xuXG4gICAgICAgIGxldCB4ID0gdmVydHNbMF0ueDtcbiAgICAgICAgbGV0IHkgPSB2ZXJ0c1swXS55O1xuICAgICAgICBsZXQgdyA9IHZlcnRzWzFdLnggLSB4O1xuICAgICAgICBsZXQgaCA9IHZlcnRzWzFdLnkgLSB5O1xuICAgICAgICB5ID0gLSB5IC0gaDtcblxuICAgICAgICBjdHguZHJhd0ltYWdlKGltYWdlLCB4LCB5LCB3LCBoKTtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvIn0=