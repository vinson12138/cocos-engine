
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/assembler-2d.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _assembler = _interopRequireDefault(require("./assembler"));

var _manager = _interopRequireDefault(require("./utils/dynamic-atlas/manager"));

var _renderData = _interopRequireDefault(require("./webgl/render-data"));

var _valueTypes = require("../value-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Assembler2D = /*#__PURE__*/function (_Assembler) {
  _inheritsLoose(Assembler2D, _Assembler);

  function Assembler2D() {
    var _this;

    _this = _Assembler.call(this) || this;
    _this._renderData = new _renderData["default"]();

    _this._renderData.init(_assertThisInitialized(_this));

    _this.initData();

    _this.initLocal();

    return _this;
  }

  var _proto = Assembler2D.prototype;

  _proto.initData = function initData() {
    var data = this._renderData;
    data.createQuadData(0, this.verticesFloats, this.indicesCount);
  };

  _proto.initLocal = function initLocal() {
    this._local = [];
    this._local.length = 4;
  };

  _proto.updateColor = function updateColor(comp, color) {
    var uintVerts = this._renderData.uintVDatas[0];
    if (!uintVerts) return;
    color = color != null ? color : comp.node.color._val;
    var floatsPerVert = this.floatsPerVert;
    var colorOffset = this.colorOffset;

    for (var i = colorOffset, l = uintVerts.length; i < l; i += floatsPerVert) {
      uintVerts[i] = color;
    }
  };

  _proto.getBuffer = function getBuffer() {
    return cc.renderer._handle._meshBuffer;
  };

  _proto.updateWorldVerts = function updateWorldVerts(comp) {
    var local = this._local;
    var verts = this._renderData.vDatas[0];
    var matrix = comp.node._worldMatrix;
    var matrixm = matrix.m,
        a = matrixm[0],
        b = matrixm[1],
        c = matrixm[4],
        d = matrixm[5],
        tx = matrixm[12],
        ty = matrixm[13];
    var vl = local[0],
        vr = local[2],
        vb = local[1],
        vt = local[3];
    var floatsPerVert = this.floatsPerVert;
    var vertexOffset = 0;
    var justTranslate = a === 1 && b === 0 && c === 0 && d === 1;

    if (justTranslate) {
      // left bottom
      verts[vertexOffset] = vl + tx;
      verts[vertexOffset + 1] = vb + ty;
      vertexOffset += floatsPerVert; // right bottom

      verts[vertexOffset] = vr + tx;
      verts[vertexOffset + 1] = vb + ty;
      vertexOffset += floatsPerVert; // left top

      verts[vertexOffset] = vl + tx;
      verts[vertexOffset + 1] = vt + ty;
      vertexOffset += floatsPerVert; // right top

      verts[vertexOffset] = vr + tx;
      verts[vertexOffset + 1] = vt + ty;
    } else {
      var al = a * vl,
          ar = a * vr,
          bl = b * vl,
          br = b * vr,
          cb = c * vb,
          ct = c * vt,
          db = d * vb,
          dt = d * vt; // left bottom

      verts[vertexOffset] = al + cb + tx;
      verts[vertexOffset + 1] = bl + db + ty;
      vertexOffset += floatsPerVert; // right bottom

      verts[vertexOffset] = ar + cb + tx;
      verts[vertexOffset + 1] = br + db + ty;
      vertexOffset += floatsPerVert; // left top

      verts[vertexOffset] = al + ct + tx;
      verts[vertexOffset + 1] = bl + dt + ty;
      vertexOffset += floatsPerVert; // right top

      verts[vertexOffset] = ar + ct + tx;
      verts[vertexOffset + 1] = br + dt + ty;
    }
  };

  _proto.fillBuffers = function fillBuffers(comp, renderer) {
    if (renderer.worldMatDirty) {
      this.updateWorldVerts(comp);
    }

    var renderData = this._renderData;
    var vData = renderData.vDatas[0];
    var iData = renderData.iDatas[0];
    var buffer = this.getBuffer(renderer);
    var offsetInfo = buffer.request(this.verticesCount, this.indicesCount); // buffer data may be realloc, need get reference after request.
    // fill vertices

    var vertexOffset = offsetInfo.byteOffset >> 2,
        vbuf = buffer._vData;

    if (vData.length + vertexOffset > vbuf.length) {
      vbuf.set(vData.subarray(0, vbuf.length - vertexOffset), vertexOffset);
    } else {
      vbuf.set(vData, vertexOffset);
    } // fill indices


    var ibuf = buffer._iData,
        indiceOffset = offsetInfo.indiceOffset,
        vertexId = offsetInfo.vertexOffset;

    for (var i = 0, l = iData.length; i < l; i++) {
      ibuf[indiceOffset++] = vertexId + iData[i];
    }
  };

  _proto.packToDynamicAtlas = function packToDynamicAtlas(comp, frame) {
    if (CC_TEST) return;

    if (!frame._original && _manager["default"] && frame._texture.packable) {
      var packedFrame = _manager["default"].insertSpriteFrame(frame);

      if (packedFrame) {
        frame._setDynamicAtlasFrame(packedFrame);
      }
    }

    var material = comp._materials[0];
    if (!material) return;

    if (material.getProperty('texture') !== frame._texture) {
      // texture was packed to dynamic atlas, should update uvs
      comp._vertsDirty = true;

      comp._updateMaterial();
    }
  };

  _createClass(Assembler2D, [{
    key: "verticesFloats",
    get: function get() {
      return this.verticesCount * this.floatsPerVert;
    }
  }]);

  return Assembler2D;
}(_assembler["default"]);

exports["default"] = Assembler2D;
cc.js.addon(Assembler2D.prototype, {
  floatsPerVert: 5,
  verticesCount: 4,
  indicesCount: 6,
  uvOffset: 2,
  colorOffset: 4
});
cc.Assembler2D = Assembler2D;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL2Fzc2VtYmxlci0yZC5qcyJdLCJuYW1lcyI6WyJBc3NlbWJsZXIyRCIsIl9yZW5kZXJEYXRhIiwiUmVuZGVyRGF0YSIsImluaXQiLCJpbml0RGF0YSIsImluaXRMb2NhbCIsImRhdGEiLCJjcmVhdGVRdWFkRGF0YSIsInZlcnRpY2VzRmxvYXRzIiwiaW5kaWNlc0NvdW50IiwiX2xvY2FsIiwibGVuZ3RoIiwidXBkYXRlQ29sb3IiLCJjb21wIiwiY29sb3IiLCJ1aW50VmVydHMiLCJ1aW50VkRhdGFzIiwibm9kZSIsIl92YWwiLCJmbG9hdHNQZXJWZXJ0IiwiY29sb3JPZmZzZXQiLCJpIiwibCIsImdldEJ1ZmZlciIsImNjIiwicmVuZGVyZXIiLCJfaGFuZGxlIiwiX21lc2hCdWZmZXIiLCJ1cGRhdGVXb3JsZFZlcnRzIiwibG9jYWwiLCJ2ZXJ0cyIsInZEYXRhcyIsIm1hdHJpeCIsIl93b3JsZE1hdHJpeCIsIm1hdHJpeG0iLCJtIiwiYSIsImIiLCJjIiwiZCIsInR4IiwidHkiLCJ2bCIsInZyIiwidmIiLCJ2dCIsInZlcnRleE9mZnNldCIsImp1c3RUcmFuc2xhdGUiLCJhbCIsImFyIiwiYmwiLCJiciIsImNiIiwiY3QiLCJkYiIsImR0IiwiZmlsbEJ1ZmZlcnMiLCJ3b3JsZE1hdERpcnR5IiwicmVuZGVyRGF0YSIsInZEYXRhIiwiaURhdGEiLCJpRGF0YXMiLCJidWZmZXIiLCJvZmZzZXRJbmZvIiwicmVxdWVzdCIsInZlcnRpY2VzQ291bnQiLCJieXRlT2Zmc2V0IiwidmJ1ZiIsIl92RGF0YSIsInNldCIsInN1YmFycmF5IiwiaWJ1ZiIsIl9pRGF0YSIsImluZGljZU9mZnNldCIsInZlcnRleElkIiwicGFja1RvRHluYW1pY0F0bGFzIiwiZnJhbWUiLCJDQ19URVNUIiwiX29yaWdpbmFsIiwiZHluYW1pY0F0bGFzTWFuYWdlciIsIl90ZXh0dXJlIiwicGFja2FibGUiLCJwYWNrZWRGcmFtZSIsImluc2VydFNwcml0ZUZyYW1lIiwiX3NldER5bmFtaWNBdGxhc0ZyYW1lIiwibWF0ZXJpYWwiLCJfbWF0ZXJpYWxzIiwiZ2V0UHJvcGVydHkiLCJfdmVydHNEaXJ0eSIsIl91cGRhdGVNYXRlcmlhbCIsIkFzc2VtYmxlciIsImpzIiwiYWRkb24iLCJwcm90b3R5cGUiLCJ1dk9mZnNldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7OztJQUVxQkE7OztBQUNqQix5QkFBZTtBQUFBOztBQUNYO0FBRUEsVUFBS0MsV0FBTCxHQUFtQixJQUFJQyxzQkFBSixFQUFuQjs7QUFDQSxVQUFLRCxXQUFMLENBQWlCRSxJQUFqQjs7QUFFQSxVQUFLQyxRQUFMOztBQUNBLFVBQUtDLFNBQUw7O0FBUFc7QUFRZDs7OztTQU1ERCxXQUFBLG9CQUFZO0FBQ1IsUUFBSUUsSUFBSSxHQUFHLEtBQUtMLFdBQWhCO0FBQ0FLLElBQUFBLElBQUksQ0FBQ0MsY0FBTCxDQUFvQixDQUFwQixFQUF1QixLQUFLQyxjQUE1QixFQUE0QyxLQUFLQyxZQUFqRDtBQUNIOztTQUNESixZQUFBLHFCQUFhO0FBQ1QsU0FBS0ssTUFBTCxHQUFjLEVBQWQ7QUFDQSxTQUFLQSxNQUFMLENBQVlDLE1BQVosR0FBcUIsQ0FBckI7QUFDSDs7U0FFREMsY0FBQSxxQkFBYUMsSUFBYixFQUFtQkMsS0FBbkIsRUFBMEI7QUFDdEIsUUFBSUMsU0FBUyxHQUFHLEtBQUtkLFdBQUwsQ0FBaUJlLFVBQWpCLENBQTRCLENBQTVCLENBQWhCO0FBQ0EsUUFBSSxDQUFDRCxTQUFMLEVBQWdCO0FBQ2hCRCxJQUFBQSxLQUFLLEdBQUdBLEtBQUssSUFBSSxJQUFULEdBQWdCQSxLQUFoQixHQUF3QkQsSUFBSSxDQUFDSSxJQUFMLENBQVVILEtBQVYsQ0FBZ0JJLElBQWhEO0FBQ0EsUUFBSUMsYUFBYSxHQUFHLEtBQUtBLGFBQXpCO0FBQ0EsUUFBSUMsV0FBVyxHQUFHLEtBQUtBLFdBQXZCOztBQUNB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QztBQUNIOzs7O0VBYm9DdUU7OztBQW9KekNsRSxFQUFFLENBQUNtRSxFQUFILENBQU1DLEtBQU4sQ0FBWTVGLFdBQVcsQ0FBQzZGLFNBQXhCLEVBQW1DO0FBQy9CMUUsRUFBQUEsYUFBYSxFQUFFLENBRGdCO0FBRy9COEMsRUFBQUEsYUFBYSxFQUFFLENBSGdCO0FBSS9CeEQsRUFBQUEsWUFBWSxFQUFFLENBSmlCO0FBTS9CcUYsRUFBQUEsUUFBUSxFQUFFLENBTnFCO0FBTy9CMUUsRUFBQUEsV0FBVyxFQUFFO0FBUGtCLENBQW5DO0FBVUFJLEVBQUUsQ0FBQ3hCLFdBQUgsR0FBaUJBLFdBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFzc2VtYmxlciBmcm9tICcuL2Fzc2VtYmxlcic7XG5pbXBvcnQgZHluYW1pY0F0bGFzTWFuYWdlciBmcm9tICcuL3V0aWxzL2R5bmFtaWMtYXRsYXMvbWFuYWdlcic7XG5pbXBvcnQgUmVuZGVyRGF0YSBmcm9tICcuL3dlYmdsL3JlbmRlci1kYXRhJztcbmltcG9ydCB7IENvbG9yIH0gZnJvbSAnLi4vdmFsdWUtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBc3NlbWJsZXIyRCBleHRlbmRzIEFzc2VtYmxlciB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuX3JlbmRlckRhdGEgPSBuZXcgUmVuZGVyRGF0YSgpO1xuICAgICAgICB0aGlzLl9yZW5kZXJEYXRhLmluaXQodGhpcyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXREYXRhKCk7XG4gICAgICAgIHRoaXMuaW5pdExvY2FsKCk7XG4gICAgfVxuXG4gICAgZ2V0IHZlcnRpY2VzRmxvYXRzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmVydGljZXNDb3VudCAqIHRoaXMuZmxvYXRzUGVyVmVydDtcbiAgICB9XG5cbiAgICBpbml0RGF0YSAoKSB7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5fcmVuZGVyRGF0YTtcbiAgICAgICAgZGF0YS5jcmVhdGVRdWFkRGF0YSgwLCB0aGlzLnZlcnRpY2VzRmxvYXRzLCB0aGlzLmluZGljZXNDb3VudCk7XG4gICAgfVxuICAgIGluaXRMb2NhbCAoKSB7XG4gICAgICAgIHRoaXMuX2xvY2FsID0gW107XG4gICAgICAgIHRoaXMuX2xvY2FsLmxlbmd0aCA9IDQ7XG4gICAgfVxuXG4gICAgdXBkYXRlQ29sb3IgKGNvbXAsIGNvbG9yKSB7XG4gICAgICAgIGxldCB1aW50VmVydHMgPSB0aGlzLl9yZW5kZXJEYXRhLnVpbnRWRGF0YXNbMF07XG4gICAgICAgIGlmICghdWludFZlcnRzKSByZXR1cm47XG4gICAgICAgIGNvbG9yID0gY29sb3IgIT0gbnVsbCA/IGNvbG9yIDogY29tcC5ub2RlLmNvbG9yLl92YWw7XG4gICAgICAgIGxldCBmbG9hdHNQZXJWZXJ0ID0gdGhpcy5mbG9hdHNQZXJWZXJ0O1xuICAgICAgICBsZXQgY29sb3JPZmZzZXQgPSB0aGlzLmNvbG9yT2Zmc2V0O1xuICAgICAgICBmb3IgKGxldCBpID0gY29sb3JPZmZzZXQsIGwgPSB1aW50VmVydHMubGVuZ3RoOyBpIDwgbDsgaSArPSBmbG9hdHNQZXJWZXJ0KSB7XG4gICAgICAgICAgICB1aW50VmVydHNbaV0gPSBjb2xvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEJ1ZmZlciAoKSB7XG4gICAgICAgIHJldHVybiBjYy5yZW5kZXJlci5faGFuZGxlLl9tZXNoQnVmZmVyO1xuICAgIH1cblxuICAgIHVwZGF0ZVdvcmxkVmVydHMgKGNvbXApIHtcbiAgICAgICAgbGV0IGxvY2FsID0gdGhpcy5fbG9jYWw7XG4gICAgICAgIGxldCB2ZXJ0cyA9IHRoaXMuX3JlbmRlckRhdGEudkRhdGFzWzBdO1xuXG4gICAgICAgIGxldCBtYXRyaXggPSBjb21wLm5vZGUuX3dvcmxkTWF0cml4O1xuICAgICAgICBsZXQgbWF0cml4bSA9IG1hdHJpeC5tLFxuICAgICAgICAgICAgYSA9IG1hdHJpeG1bMF0sIGIgPSBtYXRyaXhtWzFdLCBjID0gbWF0cml4bVs0XSwgZCA9IG1hdHJpeG1bNV0sXG4gICAgICAgICAgICB0eCA9IG1hdHJpeG1bMTJdLCB0eSA9IG1hdHJpeG1bMTNdO1xuXG4gICAgICAgIGxldCB2bCA9IGxvY2FsWzBdLCB2ciA9IGxvY2FsWzJdLFxuICAgICAgICAgICAgdmIgPSBsb2NhbFsxXSwgdnQgPSBsb2NhbFszXTtcbiAgICAgICAgXG4gICAgICAgIGxldCBmbG9hdHNQZXJWZXJ0ID0gdGhpcy5mbG9hdHNQZXJWZXJ0O1xuICAgICAgICBsZXQgdmVydGV4T2Zmc2V0ID0gMDtcbiAgICAgICAgbGV0IGp1c3RUcmFuc2xhdGUgPSBhID09PSAxICYmIGIgPT09IDAgJiYgYyA9PT0gMCAmJiBkID09PSAxO1xuXG4gICAgICAgIGlmIChqdXN0VHJhbnNsYXRlKSB7XG4gICAgICAgICAgICAvLyBsZWZ0IGJvdHRvbVxuICAgICAgICAgICAgdmVydHNbdmVydGV4T2Zmc2V0XSA9IHZsICsgdHg7XG4gICAgICAgICAgICB2ZXJ0c1t2ZXJ0ZXhPZmZzZXQgKyAxXSA9IHZiICsgdHk7XG4gICAgICAgICAgICB2ZXJ0ZXhPZmZzZXQgKz0gZmxvYXRzUGVyVmVydDtcbiAgICAgICAgICAgIC8vIHJpZ2h0IGJvdHRvbVxuICAgICAgICAgICAgdmVydHNbdmVydGV4T2Zmc2V0XSA9IHZyICsgdHg7XG4gICAgICAgICAgICB2ZXJ0c1t2ZXJ0ZXhPZmZzZXQgKyAxXSA9IHZiICsgdHk7XG4gICAgICAgICAgICB2ZXJ0ZXhPZmZzZXQgKz0gZmxvYXRzUGVyVmVydDtcbiAgICAgICAgICAgIC8vIGxlZnQgdG9wXG4gICAgICAgICAgICB2ZXJ0c1t2ZXJ0ZXhPZmZzZXRdID0gdmwgKyB0eDtcbiAgICAgICAgICAgIHZlcnRzW3ZlcnRleE9mZnNldCArIDFdID0gdnQgKyB0eTtcbiAgICAgICAgICAgIHZlcnRleE9mZnNldCArPSBmbG9hdHNQZXJWZXJ0O1xuICAgICAgICAgICAgLy8gcmlnaHQgdG9wXG4gICAgICAgICAgICB2ZXJ0c1t2ZXJ0ZXhPZmZzZXRdID0gdnIgKyB0eDtcbiAgICAgICAgICAgIHZlcnRzW3ZlcnRleE9mZnNldCArIDFdID0gdnQgKyB0eTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBhbCA9IGEgKiB2bCwgYXIgPSBhICogdnIsXG4gICAgICAgICAgICBibCA9IGIgKiB2bCwgYnIgPSBiICogdnIsXG4gICAgICAgICAgICBjYiA9IGMgKiB2YiwgY3QgPSBjICogdnQsXG4gICAgICAgICAgICBkYiA9IGQgKiB2YiwgZHQgPSBkICogdnQ7XG5cbiAgICAgICAgICAgIC8vIGxlZnQgYm90dG9tXG4gICAgICAgICAgICB2ZXJ0c1t2ZXJ0ZXhPZmZzZXRdID0gYWwgKyBjYiArIHR4O1xuICAgICAgICAgICAgdmVydHNbdmVydGV4T2Zmc2V0ICsgMV0gPSBibCArIGRiICsgdHk7XG4gICAgICAgICAgICB2ZXJ0ZXhPZmZzZXQgKz0gZmxvYXRzUGVyVmVydDtcbiAgICAgICAgICAgIC8vIHJpZ2h0IGJvdHRvbVxuICAgICAgICAgICAgdmVydHNbdmVydGV4T2Zmc2V0XSA9IGFyICsgY2IgKyB0eDtcbiAgICAgICAgICAgIHZlcnRzW3ZlcnRleE9mZnNldCArIDFdID0gYnIgKyBkYiArIHR5O1xuICAgICAgICAgICAgdmVydGV4T2Zmc2V0ICs9IGZsb2F0c1BlclZlcnQ7XG4gICAgICAgICAgICAvLyBsZWZ0IHRvcFxuICAgICAgICAgICAgdmVydHNbdmVydGV4T2Zmc2V0XSA9IGFsICsgY3QgKyB0eDtcbiAgICAgICAgICAgIHZlcnRzW3ZlcnRleE9mZnNldCArIDFdID0gYmwgKyBkdCArIHR5O1xuICAgICAgICAgICAgdmVydGV4T2Zmc2V0ICs9IGZsb2F0c1BlclZlcnQ7XG4gICAgICAgICAgICAvLyByaWdodCB0b3BcbiAgICAgICAgICAgIHZlcnRzW3ZlcnRleE9mZnNldF0gPSBhciArIGN0ICsgdHg7XG4gICAgICAgICAgICB2ZXJ0c1t2ZXJ0ZXhPZmZzZXQgKyAxXSA9IGJyICsgZHQgKyB0eTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbGxCdWZmZXJzIChjb21wLCByZW5kZXJlcikge1xuICAgICAgICBpZiAocmVuZGVyZXIud29ybGRNYXREaXJ0eSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVXb3JsZFZlcnRzKGNvbXApO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlbmRlckRhdGEgPSB0aGlzLl9yZW5kZXJEYXRhO1xuICAgICAgICBsZXQgdkRhdGEgPSByZW5kZXJEYXRhLnZEYXRhc1swXTtcbiAgICAgICAgbGV0IGlEYXRhID0gcmVuZGVyRGF0YS5pRGF0YXNbMF07XG5cbiAgICAgICAgbGV0IGJ1ZmZlciA9IHRoaXMuZ2V0QnVmZmVyKHJlbmRlcmVyKTtcbiAgICAgICAgbGV0IG9mZnNldEluZm8gPSBidWZmZXIucmVxdWVzdCh0aGlzLnZlcnRpY2VzQ291bnQsIHRoaXMuaW5kaWNlc0NvdW50KTtcblxuICAgICAgICAvLyBidWZmZXIgZGF0YSBtYXkgYmUgcmVhbGxvYywgbmVlZCBnZXQgcmVmZXJlbmNlIGFmdGVyIHJlcXVlc3QuXG5cbiAgICAgICAgLy8gZmlsbCB2ZXJ0aWNlc1xuICAgICAgICBsZXQgdmVydGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby5ieXRlT2Zmc2V0ID4+IDIsXG4gICAgICAgICAgICB2YnVmID0gYnVmZmVyLl92RGF0YTtcblxuICAgICAgICBpZiAodkRhdGEubGVuZ3RoICsgdmVydGV4T2Zmc2V0ID4gdmJ1Zi5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZidWYuc2V0KHZEYXRhLnN1YmFycmF5KDAsIHZidWYubGVuZ3RoIC0gdmVydGV4T2Zmc2V0KSwgdmVydGV4T2Zmc2V0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZidWYuc2V0KHZEYXRhLCB2ZXJ0ZXhPZmZzZXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZmlsbCBpbmRpY2VzXG4gICAgICAgIGxldCBpYnVmID0gYnVmZmVyLl9pRGF0YSxcbiAgICAgICAgICAgIGluZGljZU9mZnNldCA9IG9mZnNldEluZm8uaW5kaWNlT2Zmc2V0LFxuICAgICAgICAgICAgdmVydGV4SWQgPSBvZmZzZXRJbmZvLnZlcnRleE9mZnNldDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBpRGF0YS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGlidWZbaW5kaWNlT2Zmc2V0KytdID0gdmVydGV4SWQgKyBpRGF0YVtpXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBhY2tUb0R5bmFtaWNBdGxhcyAoY29tcCwgZnJhbWUpIHtcbiAgICAgICAgaWYgKENDX1RFU1QpIHJldHVybjtcbiAgICAgICAgXG4gICAgICAgIGlmICghZnJhbWUuX29yaWdpbmFsICYmIGR5bmFtaWNBdGxhc01hbmFnZXIgJiYgZnJhbWUuX3RleHR1cmUucGFja2FibGUpIHtcbiAgICAgICAgICAgIGxldCBwYWNrZWRGcmFtZSA9IGR5bmFtaWNBdGxhc01hbmFnZXIuaW5zZXJ0U3ByaXRlRnJhbWUoZnJhbWUpO1xuICAgICAgICAgICAgaWYgKHBhY2tlZEZyYW1lKSB7XG4gICAgICAgICAgICAgICAgZnJhbWUuX3NldER5bmFtaWNBdGxhc0ZyYW1lKHBhY2tlZEZyYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgbWF0ZXJpYWwgPSBjb21wLl9tYXRlcmlhbHNbMF07XG4gICAgICAgIGlmICghbWF0ZXJpYWwpIHJldHVybjtcbiAgICAgICAgXG4gICAgICAgIGlmIChtYXRlcmlhbC5nZXRQcm9wZXJ0eSgndGV4dHVyZScpICE9PSBmcmFtZS5fdGV4dHVyZSkge1xuICAgICAgICAgICAgLy8gdGV4dHVyZSB3YXMgcGFja2VkIHRvIGR5bmFtaWMgYXRsYXMsIHNob3VsZCB1cGRhdGUgdXZzXG4gICAgICAgICAgICBjb21wLl92ZXJ0c0RpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbXAuX3VwZGF0ZU1hdGVyaWFsKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNjLmpzLmFkZG9uKEFzc2VtYmxlcjJELnByb3RvdHlwZSwge1xuICAgIGZsb2F0c1BlclZlcnQ6IDUsXG5cbiAgICB2ZXJ0aWNlc0NvdW50OiA0LFxuICAgIGluZGljZXNDb3VudDogNixcblxuICAgIHV2T2Zmc2V0OiAyLFxuICAgIGNvbG9yT2Zmc2V0OiA0LFxufSk7XG5cbmNjLkFzc2VtYmxlcjJEID0gQXNzZW1ibGVyMkQ7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==