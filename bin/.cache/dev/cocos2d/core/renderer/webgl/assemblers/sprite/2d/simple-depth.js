
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/webgl/assemblers/sprite/2d/simple-depth.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _simple = _interopRequireDefault(require("./simple"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SimpleDepthSpriteAssembler = /*#__PURE__*/function (_SimpleSpriteAssemble) {
  _inheritsLoose(SimpleDepthSpriteAssembler, _SimpleSpriteAssemble);

  function SimpleDepthSpriteAssembler() {
    return _SimpleSpriteAssemble.apply(this, arguments) || this;
  }

  var _proto = SimpleDepthSpriteAssembler.prototype;

  _proto.initData = function initData(sprite) {
    this.floatsPerVert = 6;
    this.uvOffset = 3;
    this.colorOffset = 5;

    _SimpleSpriteAssemble.prototype.initData.call(this);
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
        vt = local[3]; //wangcheng

    var depth = comp.node.depth;
    var floatsPerVert = this.floatsPerVert;
    var vertexOffset = 0;
    var justTranslate = a === 1 && b === 0 && c === 0 && d === 1;

    if (justTranslate) {
      // left bottom
      verts[vertexOffset] = vl + tx;
      verts[vertexOffset + 1] = vb + ty;
      verts[vertexOffset + 2] = depth;
      vertexOffset += floatsPerVert; // right bottom

      verts[vertexOffset] = vr + tx;
      verts[vertexOffset + 1] = vb + ty;
      verts[vertexOffset + 2] = depth;
      vertexOffset += floatsPerVert; // left top

      verts[vertexOffset] = vl + tx;
      verts[vertexOffset + 1] = vt + ty;
      verts[vertexOffset + 2] = depth;
      vertexOffset += floatsPerVert; // right top

      verts[vertexOffset] = vr + tx;
      verts[vertexOffset + 1] = vt + ty;
      verts[vertexOffset + 2] = depth;
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
      verts[vertexOffset + 2] = depth;
      vertexOffset += floatsPerVert; // right bottom

      verts[vertexOffset] = ar + cb + tx;
      verts[vertexOffset + 1] = br + db + ty;
      verts[vertexOffset + 2] = depth;
      vertexOffset += floatsPerVert; // left top

      verts[vertexOffset] = al + ct + tx;
      verts[vertexOffset + 1] = bl + dt + ty;
      verts[vertexOffset + 2] = depth;
      vertexOffset += floatsPerVert; // right top

      verts[vertexOffset] = ar + ct + tx;
      verts[vertexOffset + 1] = br + dt + ty;
      verts[vertexOffset + 2] = depth;
    }
  };

  _proto.getBuffer = function getBuffer() {
    return cc.renderer._handle._meshBuffer3D;
  };

  return SimpleDepthSpriteAssembler;
}(_simple["default"]);

exports["default"] = SimpleDepthSpriteAssembler;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL3dlYmdsL2Fzc2VtYmxlcnMvc3ByaXRlLzJkL3NpbXBsZS1kZXB0aC5qcyJdLCJuYW1lcyI6WyJTaW1wbGVEZXB0aFNwcml0ZUFzc2VtYmxlciIsImluaXREYXRhIiwic3ByaXRlIiwiZmxvYXRzUGVyVmVydCIsInV2T2Zmc2V0IiwiY29sb3JPZmZzZXQiLCJ1cGRhdGVXb3JsZFZlcnRzIiwiY29tcCIsImxvY2FsIiwiX2xvY2FsIiwidmVydHMiLCJfcmVuZGVyRGF0YSIsInZEYXRhcyIsIm1hdHJpeCIsIm5vZGUiLCJfd29ybGRNYXRyaXgiLCJtYXRyaXhtIiwibSIsImEiLCJiIiwiYyIsImQiLCJ0eCIsInR5IiwidmwiLCJ2ciIsInZiIiwidnQiLCJkZXB0aCIsInZlcnRleE9mZnNldCIsImp1c3RUcmFuc2xhdGUiLCJhbCIsImFyIiwiYmwiLCJiciIsImNiIiwiY3QiLCJkYiIsImR0IiwiZ2V0QnVmZmVyIiwiY2MiLCJyZW5kZXJlciIsIl9oYW5kbGUiLCJfbWVzaEJ1ZmZlcjNEIiwiU2ltcGxlU3ByaXRlQXNzZW1ibGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOzs7Ozs7OztJQUVxQkE7Ozs7Ozs7OztTQUVqQkMsV0FBQSxrQkFBU0MsTUFBVCxFQUFpQjtBQUNiLFNBQUtDLGFBQUwsR0FBcUIsQ0FBckI7QUFDQSxTQUFLQyxRQUFMLEdBQWdCLENBQWhCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixDQUFuQjs7QUFDQSxvQ0FBTUosUUFBTjtBQUNIOztTQUVESyxtQkFBQSwwQkFBaUJDLElBQWpCLEVBQXVCO0FBQ25CLFFBQUlDLEtBQUssR0FBRyxLQUFLQyxNQUFqQjtBQUNBLFFBQUlDLEtBQUssR0FBRyxLQUFLQyxXQUFMLENBQWlCQyxNQUFqQixDQUF3QixDQUF4QixDQUFaO0FBRUEsUUFBSUMsTUFBTSxHQUFHTixJQUFJLENBQUNPLElBQUwsQ0FBVUMsWUFBdkI7QUFD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QUFBLEtBQUssQ0FBQ21CLFlBQUQsQ0FBTCxHQUFzQkcsRUFBRSxHQUFHSSxFQUFMLEdBQVVkLEVBQWhDO0FBQ0FaLE1BQUFBLEtBQUssQ0FBQ21CLFlBQVksR0FBRyxDQUFoQixDQUFMLEdBQTBCSyxFQUFFLEdBQUdJLEVBQUwsR0FBVWYsRUFBcEM7QUFDQWIsTUFBQUEsS0FBSyxDQUFDbUIsWUFBWSxHQUFHLENBQWhCLENBQUwsR0FBMEJELEtBQTFCO0FBQ0g7QUFDSjs7U0FFRFcsWUFBQSxxQkFBWTtBQUNSLFdBQU9DLEVBQUUsQ0FBQ0MsUUFBSCxDQUFZQyxPQUFaLENBQW9CQyxhQUEzQjtBQUNIOzs7RUE5RW1EQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBTaW1wbGVTcHJpdGVBc3NlbWJsZXIgZnJvbSBcIi4vc2ltcGxlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpbXBsZURlcHRoU3ByaXRlQXNzZW1ibGVyIGV4dGVuZHMgU2ltcGxlU3ByaXRlQXNzZW1ibGVyIHtcblxuICAgIGluaXREYXRhKHNwcml0ZSkge1xuICAgICAgICB0aGlzLmZsb2F0c1BlclZlcnQgPSA2O1xuICAgICAgICB0aGlzLnV2T2Zmc2V0ID0gMztcbiAgICAgICAgdGhpcy5jb2xvck9mZnNldCA9IDU7XG4gICAgICAgIHN1cGVyLmluaXREYXRhKCk7XG4gICAgfVxuXG4gICAgdXBkYXRlV29ybGRWZXJ0cyhjb21wKSB7XG4gICAgICAgIGxldCBsb2NhbCA9IHRoaXMuX2xvY2FsO1xuICAgICAgICBsZXQgdmVydHMgPSB0aGlzLl9yZW5kZXJEYXRhLnZEYXRhc1swXTtcblxuICAgICAgICBsZXQgbWF0cml4ID0gY29tcC5ub2RlLl93b3JsZE1hdHJpeDtcbiAgICAgICAgbGV0IG1hdHJpeG0gPSBtYXRyaXgubSxcbiAgICAgICAgICAgIGEgPSBtYXRyaXhtWzBdLCBiID0gbWF0cml4bVsxXSwgYyA9IG1hdHJpeG1bNF0sIGQgPSBtYXRyaXhtWzVdLFxuICAgICAgICAgICAgdHggPSBtYXRyaXhtWzEyXSwgdHkgPSBtYXRyaXhtWzEzXTtcblxuICAgICAgICBsZXQgdmwgPSBsb2NhbFswXSwgdnIgPSBsb2NhbFsyXSxcbiAgICAgICAgICAgIHZiID0gbG9jYWxbMV0sIHZ0ID0gbG9jYWxbM107XG5cbiAgICAgICAgLy93YW5nY2hlbmdcbiAgICAgICAgbGV0IGRlcHRoID0gY29tcC5ub2RlLmRlcHRoO1xuXG4gICAgICAgIGxldCBmbG9hdHNQZXJWZXJ0ID0gdGhpcy5mbG9hdHNQZXJWZXJ0O1xuICAgICAgICBsZXQgdmVydGV4T2Zmc2V0ID0gMDtcbiAgICAgICAgbGV0IGp1c3RUcmFuc2xhdGUgPSBhID09PSAxICYmIGIgPT09IDAgJiYgYyA9PT0gMCAmJiBkID09PSAxO1xuXG4gICAgICAgIGlmIChqdXN0VHJhbnNsYXRlKSB7XG4gICAgICAgICAgICAvLyBsZWZ0IGJvdHRvbVxuICAgICAgICAgICAgdmVydHNbdmVydGV4T2Zmc2V0XSA9IHZsICsgdHg7XG4gICAgICAgICAgICB2ZXJ0c1t2ZXJ0ZXhPZmZzZXQgKyAxXSA9IHZiICsgdHk7XG4gICAgICAgICAgICB2ZXJ0c1t2ZXJ0ZXhPZmZzZXQgKyAyXSA9IGRlcHRoO1xuICAgICAgICAgICAgdmVydGV4T2Zmc2V0ICs9IGZsb2F0c1BlclZlcnQ7XG4gICAgICAgICAgICAvLyByaWdodCBib3R0b21cbiAgICAgICAgICAgIHZlcnRzW3ZlcnRleE9mZnNldF0gPSB2ciArIHR4O1xuICAgICAgICAgICAgdmVydHNbdmVydGV4T2Zmc2V0ICsgMV0gPSB2YiArIHR5O1xuICAgICAgICAgICAgdmVydHNbdmVydGV4T2Zmc2V0ICsgMl0gPSBkZXB0aDtcbiAgICAgICAgICAgIHZlcnRleE9mZnNldCArPSBmbG9hdHNQZXJWZXJ0O1xuICAgICAgICAgICAgLy8gbGVmdCB0b3BcbiAgICAgICAgICAgIHZlcnRzW3ZlcnRleE9mZnNldF0gPSB2bCArIHR4O1xuICAgICAgICAgICAgdmVydHNbdmVydGV4T2Zmc2V0ICsgMV0gPSB2dCArIHR5O1xuICAgICAgICAgICAgdmVydHNbdmVydGV4T2Zmc2V0ICsgMl0gPSBkZXB0aDtcbiAgICAgICAgICAgIHZlcnRleE9mZnNldCArPSBmbG9hdHNQZXJWZXJ0O1xuICAgICAgICAgICAgLy8gcmlnaHQgdG9wXG4gICAgICAgICAgICB2ZXJ0c1t2ZXJ0ZXhPZmZzZXRdID0gdnIgKyB0eDtcbiAgICAgICAgICAgIHZlcnRzW3ZlcnRleE9mZnNldCArIDFdID0gdnQgKyB0eTtcbiAgICAgICAgICAgIHZlcnRzW3ZlcnRleE9mZnNldCArIDJdID0gZGVwdGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgYWwgPSBhICogdmwsIGFyID0gYSAqIHZyLFxuICAgICAgICAgICAgICAgIGJsID0gYiAqIHZsLCBiciA9IGIgKiB2cixcbiAgICAgICAgICAgICAgICBjYiA9IGMgKiB2YiwgY3QgPSBjICogdnQsXG4gICAgICAgICAgICAgICAgZGIgPSBkICogdmIsIGR0ID0gZCAqIHZ0O1xuXG4gICAgICAgICAgICAvLyBsZWZ0IGJvdHRvbVxuICAgICAgICAgICAgdmVydHNbdmVydGV4T2Zmc2V0XSA9IGFsICsgY2IgKyB0eDtcbiAgICAgICAgICAgIHZlcnRzW3ZlcnRleE9mZnNldCArIDFdID0gYmwgKyBkYiArIHR5O1xuICAgICAgICAgICAgdmVydHNbdmVydGV4T2Zmc2V0ICsgMl0gPSBkZXB0aDtcbiAgICAgICAgICAgIHZlcnRleE9mZnNldCArPSBmbG9hdHNQZXJWZXJ0O1xuICAgICAgICAgICAgLy8gcmlnaHQgYm90dG9tXG4gICAgICAgICAgICB2ZXJ0c1t2ZXJ0ZXhPZmZzZXRdID0gYXIgKyBjYiArIHR4O1xuICAgICAgICAgICAgdmVydHNbdmVydGV4T2Zmc2V0ICsgMV0gPSBiciArIGRiICsgdHk7XG4gICAgICAgICAgICB2ZXJ0c1t2ZXJ0ZXhPZmZzZXQgKyAyXSA9IGRlcHRoO1xuICAgICAgICAgICAgdmVydGV4T2Zmc2V0ICs9IGZsb2F0c1BlclZlcnQ7XG4gICAgICAgICAgICAvLyBsZWZ0IHRvcFxuICAgICAgICAgICAgdmVydHNbdmVydGV4T2Zmc2V0XSA9IGFsICsgY3QgKyB0eDtcbiAgICAgICAgICAgIHZlcnRzW3ZlcnRleE9mZnNldCArIDFdID0gYmwgKyBkdCArIHR5O1xuICAgICAgICAgICAgdmVydHNbdmVydGV4T2Zmc2V0ICsgMl0gPSBkZXB0aDtcbiAgICAgICAgICAgIHZlcnRleE9mZnNldCArPSBmbG9hdHNQZXJWZXJ0O1xuICAgICAgICAgICAgLy8gcmlnaHQgdG9wXG4gICAgICAgICAgICB2ZXJ0c1t2ZXJ0ZXhPZmZzZXRdID0gYXIgKyBjdCArIHR4O1xuICAgICAgICAgICAgdmVydHNbdmVydGV4T2Zmc2V0ICsgMV0gPSBiciArIGR0ICsgdHk7XG4gICAgICAgICAgICB2ZXJ0c1t2ZXJ0ZXhPZmZzZXQgKyAyXSA9IGRlcHRoO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QnVmZmVyKCkge1xuICAgICAgICByZXR1cm4gY2MucmVuZGVyZXIuX2hhbmRsZS5fbWVzaEJ1ZmZlcjNEO1xuICAgIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiLyJ9