
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/webgl/assemblers/label/2d/ttf.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _ttf = _interopRequireDefault(require("../../../../utils/label/ttf"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var LabelShadow = require('../../../../../components/CCLabelShadow');

var WHITE = cc.color(255, 255, 255, 255);

var WebglTTFAssembler = /*#__PURE__*/function (_TTFAssembler) {
  _inheritsLoose(WebglTTFAssembler, _TTFAssembler);

  function WebglTTFAssembler() {
    return _TTFAssembler.apply(this, arguments) || this;
  }

  var _proto = WebglTTFAssembler.prototype;

  _proto.updateUVs = function updateUVs(comp) {
    var verts = this._renderData.vDatas[0];
    var uv = comp._frame.uv;
    var uvOffset = this.uvOffset;
    var floatsPerVert = this.floatsPerVert;

    for (var i = 0; i < 4; i++) {
      var srcOffset = i * 2;
      var dstOffset = floatsPerVert * i + uvOffset;
      verts[dstOffset] = uv[srcOffset];
      verts[dstOffset + 1] = uv[srcOffset + 1];
    }
  };

  _proto.updateColor = function updateColor(comp) {
    WHITE._fastSetA(comp.node._color.a);

    var color = WHITE._val;

    _TTFAssembler.prototype.updateColor.call(this, comp, color);
  };

  _proto.updateVerts = function updateVerts(comp) {
    var node = comp.node,
        canvasWidth = comp._ttfTexture.width,
        canvasHeight = comp._ttfTexture.height,
        appx = node.anchorX * node.width,
        appy = node.anchorY * node.height;
    var shadow = LabelShadow && comp.getComponent(LabelShadow);

    if (shadow && shadow._enabled) {
      // adapt size changed caused by shadow
      var offsetX = (canvasWidth - node.width) / 2;
      var offsetY = (canvasHeight - node.height) / 2;
      var shadowOffset = shadow.offset;

      if (-shadowOffset.x > offsetX) {
        // expand to left
        appx += canvasWidth - node.width;
      } else if (offsetX > shadowOffset.x) {
        // expand to left and right
        appx += offsetX - shadowOffset.x;
      } else {// expand to right, no need to change render position
      }

      if (-shadowOffset.y > offsetY) {
        // expand to top
        appy += canvasHeight - node.height;
      } else if (offsetY > shadowOffset.y) {
        // expand to top and bottom
        appy += offsetY - shadowOffset.y;
      } else {// expand to bottom, no need to change render position
      }
    }

    var local = this._local;
    local[0] = -appx;
    local[1] = -appy;
    local[2] = canvasWidth - appx;
    local[3] = canvasHeight - appy;
    this.updateUVs(comp);
    this.updateWorldVerts(comp);
  };

  return WebglTTFAssembler;
}(_ttf["default"]);

exports["default"] = WebglTTFAssembler;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL3dlYmdsL2Fzc2VtYmxlcnMvbGFiZWwvMmQvdHRmLmpzIl0sIm5hbWVzIjpbIkxhYmVsU2hhZG93IiwicmVxdWlyZSIsIldISVRFIiwiY2MiLCJjb2xvciIsIldlYmdsVFRGQXNzZW1ibGVyIiwidXBkYXRlVVZzIiwiY29tcCIsInZlcnRzIiwiX3JlbmRlckRhdGEiLCJ2RGF0YXMiLCJ1diIsIl9mcmFtZSIsInV2T2Zmc2V0IiwiZmxvYXRzUGVyVmVydCIsImkiLCJzcmNPZmZzZXQiLCJkc3RPZmZzZXQiLCJ1cGRhdGVDb2xvciIsIl9mYXN0U2V0QSIsIm5vZGUiLCJfY29sb3IiLCJhIiwiX3ZhbCIsInVwZGF0ZVZlcnRzIiwiY2FudmFzV2lkdGgiLCJfdHRmVGV4dHVyZSIsIndpZHRoIiwiY2FudmFzSGVpZ2h0IiwiaGVpZ2h0IiwiYXBweCIsImFuY2hvclgiLCJhcHB5IiwiYW5jaG9yWSIsInNoYWRvdyIsImdldENvbXBvbmVudCIsIl9lbmFibGVkIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJzaGFkb3dPZmZzZXQiLCJvZmZzZXQiLCJ4IiwieSIsImxvY2FsIiwiX2xvY2FsIiwidXBkYXRlV29ybGRWZXJ0cyIsIlRURkFzc2VtYmxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7Ozs7Ozs7QUFFQSxJQUFNQSxXQUFXLEdBQUdDLE9BQU8sQ0FBQyx5Q0FBRCxDQUEzQjs7QUFDQSxJQUFNQyxLQUFLLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTLEdBQVQsRUFBYyxHQUFkLEVBQW1CLEdBQW5CLEVBQXdCLEdBQXhCLENBQWQ7O0lBRXFCQzs7Ozs7Ozs7O1NBQ2pCQyxZQUFBLG1CQUFXQyxJQUFYLEVBQWlCO0FBQ2IsUUFBSUMsS0FBSyxHQUFHLEtBQUtDLFdBQUwsQ0FBaUJDLE1BQWpCLENBQXdCLENBQXhCLENBQVo7QUFDQSxRQUFJQyxFQUFFLEdBQUdKLElBQUksQ0FBQ0ss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LENBQUQsQ0FBTCxHQUFXLENBQUNYLElBQVo7QUFDQVcsSUFBQUEsS0FBSyxDQUFDLENBQUQsQ0FBTCxHQUFXbEIsV0FBVyxHQUFHSyxJQUF6QjtBQUNBYSxJQUFBQSxLQUFLLENBQUMsQ0FBRCxDQUFMLEdBQVdmLFlBQVksR0FBR0ksSUFBMUI7QUFFQSxTQUFLMUIsU0FBTCxDQUFlQyxJQUFmO0FBQ0EsU0FBS3NDLGdCQUFMLENBQXNCdEMsSUFBdEI7QUFDSDs7O0VBcEUwQ3VDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IFRURkFzc2VtYmxlciBmcm9tICcuLi8uLi8uLi8uLi91dGlscy9sYWJlbC90dGYnO1xuXG5jb25zdCBMYWJlbFNoYWRvdyA9IHJlcXVpcmUoJy4uLy4uLy4uLy4uLy4uL2NvbXBvbmVudHMvQ0NMYWJlbFNoYWRvdycpO1xuY29uc3QgV0hJVEUgPSBjYy5jb2xvcigyNTUsIDI1NSwgMjU1LCAyNTUpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJnbFRURkFzc2VtYmxlciBleHRlbmRzIFRURkFzc2VtYmxlciB7XG4gICAgdXBkYXRlVVZzIChjb21wKSB7XG4gICAgICAgIGxldCB2ZXJ0cyA9IHRoaXMuX3JlbmRlckRhdGEudkRhdGFzWzBdO1xuICAgICAgICBsZXQgdXYgPSBjb21wLl9mcmFtZS51djtcbiAgICAgICAgbGV0IHV2T2Zmc2V0ID0gdGhpcy51dk9mZnNldDtcbiAgICAgICAgbGV0IGZsb2F0c1BlclZlcnQgPSB0aGlzLmZsb2F0c1BlclZlcnQ7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgc3JjT2Zmc2V0ID0gaSAqIDI7XG4gICAgICAgICAgICBsZXQgZHN0T2Zmc2V0ID0gZmxvYXRzUGVyVmVydCAqIGkgKyB1dk9mZnNldDtcbiAgICAgICAgICAgIHZlcnRzW2RzdE9mZnNldF0gPSB1dltzcmNPZmZzZXRdO1xuICAgICAgICAgICAgdmVydHNbZHN0T2Zmc2V0ICsgMV0gPSB1dltzcmNPZmZzZXQgKyAxXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUNvbG9yIChjb21wKSB7XG4gICAgICAgIFdISVRFLl9mYXN0U2V0QShjb21wLm5vZGUuX2NvbG9yLmEpO1xuICAgICAgICBsZXQgY29sb3IgPSBXSElURS5fdmFsO1xuXG4gICAgICAgIHN1cGVyLnVwZGF0ZUNvbG9yKGNvbXAsIGNvbG9yKTtcbiAgICB9XG5cbiAgICB1cGRhdGVWZXJ0cyAoY29tcCkge1xuICAgICAgICBsZXQgbm9kZSA9IGNvbXAubm9kZSxcbiAgICAgICAgICAgIGNhbnZhc1dpZHRoID0gY29tcC5fdHRmVGV4dHVyZS53aWR0aCxcbiAgICAgICAgICAgIGNhbnZhc0hlaWdodCA9IGNvbXAuX3R0ZlRleHR1cmUuaGVpZ2h0LFxuICAgICAgICAgICAgYXBweCA9IG5vZGUuYW5jaG9yWCAqIG5vZGUud2lkdGgsXG4gICAgICAgICAgICBhcHB5ID0gbm9kZS5hbmNob3JZICogbm9kZS5oZWlnaHQ7XG5cbiAgICAgICAgbGV0IHNoYWRvdyA9IExhYmVsU2hhZG93ICYmIGNvbXAuZ2V0Q29tcG9uZW50KExhYmVsU2hhZG93KTtcbiAgICAgICAgaWYgKHNoYWRvdyAmJiBzaGFkb3cuX2VuYWJsZWQpIHtcbiAgICAgICAgICAgIC8vIGFkYXB0IHNpemUgY2hhbmdlZCBjYXVzZWQgYnkgc2hhZG93XG4gICAgICAgICAgICBsZXQgb2Zmc2V0WCA9IChjYW52YXNXaWR0aCAtIG5vZGUud2lkdGgpIC8gMjtcbiAgICAgICAgICAgIGxldCBvZmZzZXRZID0gKGNhbnZhc0hlaWdodCAtIG5vZGUuaGVpZ2h0KSAvIDI7XG5cbiAgICAgICAgICAgIGxldCBzaGFkb3dPZmZzZXQgPSBzaGFkb3cub2Zmc2V0O1xuICAgICAgICAgICAgaWYgKC1zaGFkb3dPZmZzZXQueCA+IG9mZnNldFgpIHtcbiAgICAgICAgICAgICAgICAvLyBleHBhbmQgdG8gbGVmdFxuICAgICAgICAgICAgICAgIGFwcHggKz0gKGNhbnZhc1dpZHRoIC0gbm9kZS53aWR0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChvZmZzZXRYID4gc2hhZG93T2Zmc2V0LngpIHtcbiAgICAgICAgICAgICAgICAvLyBleHBhbmQgdG8gbGVmdCBhbmQgcmlnaHRcbiAgICAgICAgICAgICAgICBhcHB4ICs9IChvZmZzZXRYIC0gc2hhZG93T2Zmc2V0LngpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZXhwYW5kIHRvIHJpZ2h0LCBubyBuZWVkIHRvIGNoYW5nZSByZW5kZXIgcG9zaXRpb25cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKC1zaGFkb3dPZmZzZXQueSA+IG9mZnNldFkpIHtcbiAgICAgICAgICAgICAgICAvLyBleHBhbmQgdG8gdG9wXG4gICAgICAgICAgICAgICAgYXBweSArPSAoY2FudmFzSGVpZ2h0IC0gbm9kZS5oZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAob2Zmc2V0WSA+IHNoYWRvd09mZnNldC55KSB7XG4gICAgICAgICAgICAgICAgLy8gZXhwYW5kIHRvIHRvcCBhbmQgYm90dG9tXG4gICAgICAgICAgICAgICAgYXBweSArPSAob2Zmc2V0WSAtIHNoYWRvd09mZnNldC55KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGV4cGFuZCB0byBib3R0b20sIG5vIG5lZWQgdG8gY2hhbmdlIHJlbmRlciBwb3NpdGlvblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGxvY2FsID0gdGhpcy5fbG9jYWw7XG4gICAgICAgIGxvY2FsWzBdID0gLWFwcHg7XG4gICAgICAgIGxvY2FsWzFdID0gLWFwcHk7XG4gICAgICAgIGxvY2FsWzJdID0gY2FudmFzV2lkdGggLSBhcHB4O1xuICAgICAgICBsb2NhbFszXSA9IGNhbnZhc0hlaWdodCAtIGFwcHk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVVVnMoY29tcCk7XG4gICAgICAgIHRoaXMudXBkYXRlV29ybGRWZXJ0cyhjb21wKTtcbiAgICB9XG59XG5cbiJdLCJzb3VyY2VSb290IjoiLyJ9