
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/canvas/renderers/sprite/sliced.js';
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

var _renderData = _interopRequireDefault(require("../render-data"));

var _simple = _interopRequireDefault(require("./simple"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var utils = require('../utils');

var CanvasSlicedSprite = /*#__PURE__*/function (_CanvasSimpleSprite) {
  _inheritsLoose(CanvasSlicedSprite, _CanvasSimpleSprite);

  function CanvasSlicedSprite() {
    return _CanvasSimpleSprite.apply(this, arguments) || this;
  }

  var _proto = CanvasSlicedSprite.prototype;

  _proto.init = function init() {
    this._renderData = new _renderData["default"]();
    this._renderData.dataLength = 4;
  };

  _proto.updateUVs = function updateUVs(sprite) {
    var frame = sprite.spriteFrame;
    var renderData = this._renderData;
    var rect = frame._rect; // caculate texture coordinate

    var leftWidth = frame.insetLeft;
    var rightWidth = frame.insetRight;
    var centerWidth = rect.width - leftWidth - rightWidth;
    var topHeight = frame.insetTop;
    var bottomHeight = frame.insetBottom;
    var centerHeight = rect.height - topHeight - bottomHeight; // uv computation should take spritesheet into account.

    var verts = renderData.vertices;

    if (frame._rotated) {
      verts[0].u = rect.x;
      verts[1].u = bottomHeight + rect.x;
      verts[2].u = bottomHeight + centerHeight + rect.x;
      verts[3].u = rect.x + rect.height;
      verts[3].v = rect.y;
      verts[2].v = leftWidth + rect.y;
      verts[1].v = leftWidth + centerWidth + rect.y;
      verts[0].v = rect.y + rect.width;
    } else {
      verts[0].u = rect.x;
      verts[1].u = leftWidth + rect.x;
      verts[2].u = leftWidth + centerWidth + rect.x;
      verts[3].u = rect.x + rect.width;
      verts[3].v = rect.y;
      verts[2].v = topHeight + rect.y;
      verts[1].v = topHeight + centerHeight + rect.y;
      verts[0].v = rect.y + rect.height;
    }
  };

  _proto.updateVerts = function updateVerts(sprite) {
    var renderData = this._renderData,
        verts = renderData.vertices,
        node = sprite.node,
        width = node.width,
        height = node.height,
        appx = node.anchorX * width,
        appy = node.anchorY * height;
    var frame = sprite.spriteFrame;
    var leftWidth = frame.insetLeft;
    var rightWidth = frame.insetRight;
    var topHeight = frame.insetTop;
    var bottomHeight = frame.insetBottom;
    var sizableWidth = width - leftWidth - rightWidth;
    var sizableHeight = height - topHeight - bottomHeight;
    var xScale = width / (leftWidth + rightWidth);
    var yScale = height / (topHeight + bottomHeight);
    xScale = isNaN(xScale) || xScale > 1 ? 1 : xScale;
    yScale = isNaN(yScale) || yScale > 1 ? 1 : yScale;
    sizableWidth = sizableWidth < 0 ? 0 : sizableWidth;
    sizableHeight = sizableHeight < 0 ? 0 : sizableHeight;

    if (frame._rotated) {
      verts[0].y = -appx;
      verts[0].x = -appy;
      verts[1].y = rightWidth * xScale - appx;
      verts[1].x = bottomHeight * yScale - appy;
      verts[2].y = verts[1].y + sizableWidth;
      verts[2].x = verts[1].x + sizableHeight;
      verts[3].y = width - appx;
      verts[3].x = height - appy;
    } else {
      verts[0].x = -appx;
      verts[0].y = -appy;
      verts[1].x = leftWidth * xScale - appx;
      verts[1].y = bottomHeight * yScale - appy;
      verts[2].x = verts[1].x + sizableWidth;
      verts[2].y = verts[1].y + sizableHeight;
      verts[3].x = width - appx;
      verts[3].y = height - appy;
    }

    sprite._vertsDirty = false;
  };

  _proto.draw = function draw(ctx, comp) {
    var node = comp.node;
    var frame = comp._spriteFrame; // Transform

    var matrix = node._worldMatrix;
    var matrixm = matrix.m;
    var a = matrixm[0],
        b = matrixm[1],
        c = matrixm[4],
        d = matrixm[5],
        tx = matrixm[12],
        ty = matrixm[13];
    ctx.transform(a, b, c, d, tx, ty);
    ctx.scale(1, -1);

    if (frame._rotated) {
      ctx.rotate(-Math.PI / 2);
    } // TODO: handle blend function
    // opacity


    utils.context.setGlobalAlpha(ctx, node.opacity / 255);
    var tex = frame._texture,
        verts = this._renderData.vertices;
    var image = utils.getColorizedImage(tex, node._color);
    var drawCall = 0;
    var off, ld, rd, td, bd, x, y, w, h, sx, sy, sw, sh;

    for (var r = 0; r < 3; ++r) {
      bd = verts[r];
      td = verts[r + 1];

      for (var _c = 0; _c < 3; ++_c) {
        ld = verts[_c];
        rd = verts[_c + 1];
        x = ld.x;
        y = bd.y;
        w = rd.x - x;
        h = td.y - y;
        y = -y - h;
        sx = ld.u; // invert texture because texture uv is in UI coordinates (origin at top left)

        sy = td.v;
        sw = rd.u - sx;
        sh = bd.v - sy;

        if (sw > 0 && sh > 0 && w > 0 && h > 0) {
          ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
          drawCall++;
        }
      }
    }

    return drawCall;
  };

  return CanvasSlicedSprite;
}(_simple["default"]);

exports["default"] = CanvasSlicedSprite;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL2NhbnZhcy9yZW5kZXJlcnMvc3ByaXRlL3NsaWNlZC5qcyJdLCJuYW1lcyI6WyJ1dGlscyIsInJlcXVpcmUiLCJDYW52YXNTbGljZWRTcHJpdGUiLCJpbml0IiwiX3JlbmRlckRhdGEiLCJSZW5kZXJEYXRhIiwiZGF0YUxlbmd0aCIsInVwZGF0ZVVWcyIsInNwcml0ZSIsImZyYW1lIiwic3ByaXRlRnJhbWUiLCJyZW5kZXJEYXRhIiwicmVjdCIsIl9yZWN0IiwibGVmdFdpZHRoIiwiaW5zZXRMZWZ0IiwicmlnaHRXaWR0aCIsImluc2V0UmlnaHQiLCJjZW50ZXJXaWR0aCIsIndpZHRoIiwidG9wSGVpZ2h0IiwiaW5zZXRUb3AiLCJib3R0b21IZWlnaHQiLCJpbnNldEJvdHRvbSIsImNlbnRlckhlaWdodCIsImhlaWdodCIsInZlcnRzIiwidmVydGljZXMiLCJfcm90YXRlZCIsInUiLCJ4IiwidiIsInkiLCJ1cGRhdGVWZXJ0cyIsIm5vZGUiLCJhcHB4IiwiYW5jaG9yWCIsImFwcHkiLCJhbmNob3JZIiwic2l6YWJsZVdpZHRoIiwic2l6YWJsZUhlaWdodCIsInhTY2FsZSIsInlTY2FsZSIsImlzTmFOIiwiX3ZlcnRzRGlydHkiLCJkcmF3IiwiY3R4IiwiY29tcCIsIl9zcHJpdGVGcmFtZSIsIm1hdHJpeCIsIl93b3JsZE1hdHJpeCIsIm1hdHJpeG0iLCJtIiwiYSIsImIiLCJjIiwiZCIsInR4IiwidHkiLCJ0cmFuc2Zvcm0iLCJzY2FsZSIsInJvdGF0ZSIsIk1hdGgiLCJQSSIsImNvbnRleHQiLCJzZXRHbG9iYWxBbHBoYSIsIm9wYWNpdHkiLCJ0ZXgiLCJfdGV4dHVyZSIsImltYWdlIiwiZ2V0Q29sb3JpemVkSW1hZ2UiLCJfY29sb3IiLCJkcmF3Q2FsbCIsIm9mZiIsImxkIiwicmQiLCJ0ZCIsImJkIiwidyIsImgiLCJzeCIsInN5Iiwic3ciLCJzaCIsInIiLCJkcmF3SW1hZ2UiLCJDYW52YXNT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QSxFQUFFLEdBQUdMLEVBQUUsQ0FBQzdDLENBQVI7QUFDQW1ELFFBQUFBLEVBQUUsR0FBR1AsRUFBRSxDQUFDOUMsQ0FBSCxHQUFPbUQsRUFBWjtBQUNBRyxRQUFBQSxFQUFFLEdBQUdOLEVBQUUsQ0FBQzlDLENBQUgsR0FBT2tELEVBQVo7O0FBRUEsWUFBSUMsRUFBRSxHQUFHLENBQUwsSUFBVUMsRUFBRSxHQUFHLENBQWYsSUFBb0JMLENBQUMsR0FBRyxDQUF4QixJQUE2QkMsQ0FBQyxHQUFHLENBQXJDLEVBQXdDO0FBQ3BDakMsVUFBQUEsR0FBRyxDQUFDdUMsU0FBSixDQUFjaEIsS0FBZCxFQUNJVyxFQURKLEVBQ1FDLEVBRFIsRUFDWUMsRUFEWixFQUNnQkMsRUFEaEIsRUFFSXJELENBRkosRUFFT0UsQ0FGUCxFQUVVOEMsQ0FGVixFQUVhQyxDQUZiO0FBR0FQLFVBQUFBLFFBQVE7QUFDWDtBQUNKO0FBQ0o7O0FBQ0QsV0FBT0EsUUFBUDtBQUNIOzs7RUE5STJDYyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgQXNzZW1ibGVyIGZyb20gJy4uLy4uLy4uL2Fzc2VtYmxlcic7XG5pbXBvcnQgUmVuZGVyRGF0YSBmcm9tICcuLi9yZW5kZXItZGF0YSc7XG5pbXBvcnQgQ2FudmFzU2ltcGxlU3ByaXRlIGZyb20gJy4vc2ltcGxlJztcblxuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXNTbGljZWRTcHJpdGUgZXh0ZW5kcyBDYW52YXNTaW1wbGVTcHJpdGUge1xuICAgIGluaXQgKCkge1xuICAgICAgICB0aGlzLl9yZW5kZXJEYXRhID0gbmV3IFJlbmRlckRhdGEoKTtcbiAgICAgICAgdGhpcy5fcmVuZGVyRGF0YS5kYXRhTGVuZ3RoID0gNDtcbiAgICB9XG5cbiAgICB1cGRhdGVVVnMgKHNwcml0ZSkge1xuICAgICAgICBsZXQgZnJhbWUgPSBzcHJpdGUuc3ByaXRlRnJhbWU7XG4gICAgICAgIGxldCByZW5kZXJEYXRhID0gdGhpcy5fcmVuZGVyRGF0YTtcbiAgICAgICAgbGV0IHJlY3QgPSBmcmFtZS5fcmVjdDtcbiAgICBcbiAgICAgICAgLy8gY2FjdWxhdGUgdGV4dHVyZSBjb29yZGluYXRlXG4gICAgICAgIGxldCBsZWZ0V2lkdGggPSBmcmFtZS5pbnNldExlZnQ7XG4gICAgICAgIGxldCByaWdodFdpZHRoID0gZnJhbWUuaW5zZXRSaWdodDtcbiAgICAgICAgbGV0IGNlbnRlcldpZHRoID0gcmVjdC53aWR0aCAtIGxlZnRXaWR0aCAtIHJpZ2h0V2lkdGg7XG4gICAgICAgIGxldCB0b3BIZWlnaHQgPSBmcmFtZS5pbnNldFRvcDtcbiAgICAgICAgbGV0IGJvdHRvbUhlaWdodCA9IGZyYW1lLmluc2V0Qm90dG9tO1xuICAgICAgICBsZXQgY2VudGVySGVpZ2h0ID0gcmVjdC5oZWlnaHQgLSB0b3BIZWlnaHQgLSBib3R0b21IZWlnaHQ7XG4gICAgXG4gICAgICAgIC8vIHV2IGNvbXB1dGF0aW9uIHNob3VsZCB0YWtlIHNwcml0ZXNoZWV0IGludG8gYWNjb3VudC5cbiAgICAgICAgbGV0IHZlcnRzID0gcmVuZGVyRGF0YS52ZXJ0aWNlcztcbiAgICAgICAgaWYgKGZyYW1lLl9yb3RhdGVkKSB7XG4gICAgICAgICAgICB2ZXJ0c1swXS51ID0gcmVjdC54O1xuICAgICAgICAgICAgdmVydHNbMV0udSA9IGJvdHRvbUhlaWdodCArIHJlY3QueDtcbiAgICAgICAgICAgIHZlcnRzWzJdLnUgPSBib3R0b21IZWlnaHQgKyBjZW50ZXJIZWlnaHQgKyByZWN0Lng7XG4gICAgICAgICAgICB2ZXJ0c1szXS51ID0gcmVjdC54ICsgcmVjdC5oZWlnaHQ7XG4gICAgICAgICAgICB2ZXJ0c1szXS52ID0gcmVjdC55O1xuICAgICAgICAgICAgdmVydHNbMl0udiA9IGxlZnRXaWR0aCArIHJlY3QueTtcbiAgICAgICAgICAgIHZlcnRzWzFdLnYgPSBsZWZ0V2lkdGggKyBjZW50ZXJXaWR0aCArIHJlY3QueTtcbiAgICAgICAgICAgIHZlcnRzWzBdLnYgPSByZWN0LnkgKyByZWN0LndpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmVydHNbMF0udSA9IHJlY3QueDtcbiAgICAgICAgICAgIHZlcnRzWzFdLnUgPSBsZWZ0V2lkdGggKyByZWN0Lng7XG4gICAgICAgICAgICB2ZXJ0c1syXS51ID0gbGVmdFdpZHRoICsgY2VudGVyV2lkdGggKyByZWN0Lng7XG4gICAgICAgICAgICB2ZXJ0c1szXS51ID0gcmVjdC54ICsgcmVjdC53aWR0aDtcbiAgICAgICAgICAgIHZlcnRzWzNdLnYgPSByZWN0Lnk7XG4gICAgICAgICAgICB2ZXJ0c1syXS52ID0gdG9wSGVpZ2h0ICsgcmVjdC55O1xuICAgICAgICAgICAgdmVydHNbMV0udiA9IHRvcEhlaWdodCArIGNlbnRlckhlaWdodCArIHJlY3QueTtcbiAgICAgICAgICAgIHZlcnRzWzBdLnYgPSByZWN0LnkgKyByZWN0LmhlaWdodDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICB1cGRhdGVWZXJ0cyAoc3ByaXRlKSB7XG4gICAgICAgIGxldCByZW5kZXJEYXRhID0gdGhpcy5fcmVuZGVyRGF0YSxcbiAgICAgICAgICAgIHZlcnRzID0gcmVuZGVyRGF0YS52ZXJ0aWNlcyxcbiAgICAgICAgICAgIG5vZGUgPSBzcHJpdGUubm9kZSxcbiAgICAgICAgICAgIHdpZHRoID0gbm9kZS53aWR0aCwgaGVpZ2h0ID0gbm9kZS5oZWlnaHQsXG4gICAgICAgICAgICBhcHB4ID0gbm9kZS5hbmNob3JYICogd2lkdGgsIGFwcHkgPSBub2RlLmFuY2hvclkgKiBoZWlnaHQ7XG4gICAgXG4gICAgICAgIGxldCBmcmFtZSA9IHNwcml0ZS5zcHJpdGVGcmFtZTtcbiAgICAgICAgbGV0IGxlZnRXaWR0aCA9IGZyYW1lLmluc2V0TGVmdDtcbiAgICAgICAgbGV0IHJpZ2h0V2lkdGggPSBmcmFtZS5pbnNldFJpZ2h0O1xuICAgICAgICBsZXQgdG9wSGVpZ2h0ID0gZnJhbWUuaW5zZXRUb3A7XG4gICAgICAgIGxldCBib3R0b21IZWlnaHQgPSBmcmFtZS5pbnNldEJvdHRvbTtcbiAgICBcbiAgICAgICAgbGV0IHNpemFibGVXaWR0aCA9IHdpZHRoIC0gbGVmdFdpZHRoIC0gcmlnaHRXaWR0aDtcbiAgICAgICAgbGV0IHNpemFibGVIZWlnaHQgPSBoZWlnaHQgLSB0b3BIZWlnaHQgLSBib3R0b21IZWlnaHQ7XG4gICAgICAgIGxldCB4U2NhbGUgPSB3aWR0aCAvIChsZWZ0V2lkdGggKyByaWdodFdpZHRoKTtcbiAgICAgICAgbGV0IHlTY2FsZSA9IGhlaWdodCAvICh0b3BIZWlnaHQgKyBib3R0b21IZWlnaHQpO1xuICAgICAgICB4U2NhbGUgPSAoaXNOYU4oeFNjYWxlKSB8fCB4U2NhbGUgPiAxKSA/IDEgOiB4U2NhbGU7XG4gICAgICAgIHlTY2FsZSA9IChpc05hTih5U2NhbGUpIHx8IHlTY2FsZSA+IDEpID8gMSA6IHlTY2FsZTtcbiAgICAgICAgc2l6YWJsZVdpZHRoID0gc2l6YWJsZVdpZHRoIDwgMCA/IDAgOiBzaXphYmxlV2lkdGg7XG4gICAgICAgIHNpemFibGVIZWlnaHQgPSBzaXphYmxlSGVpZ2h0IDwgMCA/IDAgOiBzaXphYmxlSGVpZ2h0O1xuICAgICAgICBcbiAgICAgICAgaWYgKGZyYW1lLl9yb3RhdGVkKSB7XG4gICAgICAgICAgICB2ZXJ0c1swXS55ID0gLWFwcHg7XG4gICAgICAgICAgICB2ZXJ0c1swXS54ID0gLWFwcHk7XG4gICAgICAgICAgICB2ZXJ0c1sxXS55ID0gcmlnaHRXaWR0aCAqIHhTY2FsZSAtIGFwcHg7XG4gICAgICAgICAgICB2ZXJ0c1sxXS54ID0gYm90dG9tSGVpZ2h0ICogeVNjYWxlIC0gYXBweTtcbiAgICAgICAgICAgIHZlcnRzWzJdLnkgPSB2ZXJ0c1sxXS55ICsgc2l6YWJsZVdpZHRoO1xuICAgICAgICAgICAgdmVydHNbMl0ueCA9IHZlcnRzWzFdLnggKyBzaXphYmxlSGVpZ2h0O1xuICAgICAgICAgICAgdmVydHNbM10ueSA9IHdpZHRoIC0gYXBweDtcbiAgICAgICAgICAgIHZlcnRzWzNdLnggPSBoZWlnaHQgLSBhcHB5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmVydHNbMF0ueCA9IC1hcHB4O1xuICAgICAgICAgICAgdmVydHNbMF0ueSA9IC1hcHB5O1xuICAgICAgICAgICAgdmVydHNbMV0ueCA9IGxlZnRXaWR0aCAqIHhTY2FsZSAtIGFwcHg7XG4gICAgICAgICAgICB2ZXJ0c1sxXS55ID0gYm90dG9tSGVpZ2h0ICogeVNjYWxlIC0gYXBweTtcbiAgICAgICAgICAgIHZlcnRzWzJdLnggPSB2ZXJ0c1sxXS54ICsgc2l6YWJsZVdpZHRoO1xuICAgICAgICAgICAgdmVydHNbMl0ueSA9IHZlcnRzWzFdLnkgKyBzaXphYmxlSGVpZ2h0O1xuICAgICAgICAgICAgdmVydHNbM10ueCA9IHdpZHRoIC0gYXBweDtcbiAgICAgICAgICAgIHZlcnRzWzNdLnkgPSBoZWlnaHQgLSBhcHB5O1xuICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgc3ByaXRlLl92ZXJ0c0RpcnR5ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZHJhdyAoY3R4LCBjb21wKSB7XG4gICAgICAgIGxldCBub2RlID0gY29tcC5ub2RlO1xuICAgICAgICBsZXQgZnJhbWUgPSBjb21wLl9zcHJpdGVGcmFtZTtcbiAgICAgICAgLy8gVHJhbnNmb3JtXG4gICAgICAgIGxldCBtYXRyaXggPSBub2RlLl93b3JsZE1hdHJpeDtcbiAgICAgICAgbGV0IG1hdHJpeG0gPSBtYXRyaXgubTtcbiAgICAgICAgbGV0IGEgPSBtYXRyaXhtWzBdLCBiID0gbWF0cml4bVsxXSwgYyA9IG1hdHJpeG1bNF0sIGQgPSBtYXRyaXhtWzVdLFxuICAgICAgICAgICAgdHggPSBtYXRyaXhtWzEyXSwgdHkgPSBtYXRyaXhtWzEzXTtcbiAgICAgICAgY3R4LnRyYW5zZm9ybShhLCBiLCBjLCBkLCB0eCwgdHkpO1xuICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICBpZiAoZnJhbWUuX3JvdGF0ZWQpIHtcbiAgICAgICAgICAgIGN0eC5yb3RhdGUoLSBNYXRoLlBJIC8gMik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETzogaGFuZGxlIGJsZW5kIGZ1bmN0aW9uXG5cbiAgICAgICAgLy8gb3BhY2l0eVxuICAgICAgICB1dGlscy5jb250ZXh0LnNldEdsb2JhbEFscGhhKGN0eCwgbm9kZS5vcGFjaXR5IC8gMjU1KTtcblxuICAgICAgICBsZXQgdGV4ID0gZnJhbWUuX3RleHR1cmUsXG4gICAgICAgICAgICB2ZXJ0cyA9IHRoaXMuX3JlbmRlckRhdGEudmVydGljZXM7XG5cbiAgICAgICAgbGV0IGltYWdlID0gdXRpbHMuZ2V0Q29sb3JpemVkSW1hZ2UodGV4LCBub2RlLl9jb2xvcik7XG5cbiAgICAgICAgbGV0IGRyYXdDYWxsID0gMDtcbiAgICAgICAgbGV0IG9mZiwgbGQsIHJkLCB0ZCwgYmQsXG4gICAgICAgICAgICB4LCB5LCB3LCBoLFxuICAgICAgICAgICAgc3gsIHN5LCBzdywgc2g7XG4gICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgMzsgKytyKSB7XG4gICAgICAgICAgICBiZCA9IHZlcnRzW3JdO1xuICAgICAgICAgICAgdGQgPSB2ZXJ0c1tyKzFdO1xuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCAzOyArK2MpIHtcbiAgICAgICAgICAgICAgICBsZCA9IHZlcnRzW2NdO1xuICAgICAgICAgICAgICAgIHJkID0gdmVydHNbYysxXTtcbiAgICAgICAgICAgICAgICB4ID0gbGQueDtcbiAgICAgICAgICAgICAgICB5ID0gYmQueTtcbiAgICAgICAgICAgICAgICB3ID0gcmQueCAtIHg7XG4gICAgICAgICAgICAgICAgaCA9IHRkLnkgLSB5O1xuICAgICAgICAgICAgICAgIHkgPSAtIHkgLSBoO1xuXG4gICAgICAgICAgICAgICAgc3ggPSBsZC51O1xuICAgICAgICAgICAgICAgIC8vIGludmVydCB0ZXh0dXJlIGJlY2F1c2UgdGV4dHVyZSB1diBpcyBpbiBVSSBjb29yZGluYXRlcyAob3JpZ2luIGF0IHRvcCBsZWZ0KVxuICAgICAgICAgICAgICAgIHN5ID0gdGQudjtcbiAgICAgICAgICAgICAgICBzdyA9IHJkLnUgLSBzeDtcbiAgICAgICAgICAgICAgICBzaCA9IGJkLnYgLSBzeTtcblxuICAgICAgICAgICAgICAgIGlmIChzdyA+IDAgJiYgc2ggPiAwICYmIHcgPiAwICYmIGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1hZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzeCwgc3ksIHN3LCBzaCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHgsIHksIHcsIGgpO1xuICAgICAgICAgICAgICAgICAgICBkcmF3Q2FsbCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZHJhd0NhbGw7XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvIn0=