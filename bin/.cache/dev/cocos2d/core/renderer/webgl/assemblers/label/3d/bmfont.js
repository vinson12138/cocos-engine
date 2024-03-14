
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/webgl/assemblers/label/3d/bmfont.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _vec = _interopRequireDefault(require("../../../../../value-types/vec3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Assembler3D = require('../../../../assembler-3d');

var WebglBmfontAssembler = require('../2d/bmfont');

var vec3_temp_local = new _vec["default"]();
var vec3_temp_world = new _vec["default"]();

var WebglBmfontAssembler3D = /*#__PURE__*/function (_WebglBmfontAssembler) {
  _inheritsLoose(WebglBmfontAssembler3D, _WebglBmfontAssembler);

  function WebglBmfontAssembler3D() {
    return _WebglBmfontAssembler.apply(this, arguments) || this;
  }

  return WebglBmfontAssembler3D;
}(WebglBmfontAssembler);

exports["default"] = WebglBmfontAssembler3D;
cc.js.mixin(WebglBmfontAssembler3D.prototype, Assembler3D, {
  updateWorldVerts: function updateWorldVerts(comp) {
    var matrix = comp.node._worldMatrix;
    var local = this._local;
    var world = this._renderData.vDatas[0];
    var floatsPerVert = this.floatsPerVert;

    for (var offset = 0; offset < world.length; offset += floatsPerVert) {
      _vec["default"].set(vec3_temp_local, local[offset], local[offset + 1], 0);

      _vec["default"].transformMat4(vec3_temp_world, vec3_temp_local, matrix);

      world[offset] = vec3_temp_world.x;
      world[offset + 1] = vec3_temp_world.y;
      world[offset + 2] = vec3_temp_world.z;
    }
  }
});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL3dlYmdsL2Fzc2VtYmxlcnMvbGFiZWwvM2QvYm1mb250LmpzIl0sIm5hbWVzIjpbIkFzc2VtYmxlcjNEIiwicmVxdWlyZSIsIldlYmdsQm1mb250QXNzZW1ibGVyIiwidmVjM190ZW1wX2xvY2FsIiwiVmVjMyIsInZlYzNfdGVtcF93b3JsZCIsIldlYmdsQm1mb250QXNzZW1ibGVyM0QiLCJjYyIsImpzIiwibWl4aW4iLCJwcm90b3R5cGUiLCJ1cGRhdGVXb3JsZFZlcnRzIiwiY29tcCIsIm1hdHJpeCIsIm5vZGUiLCJfd29ybGRNYXRyaXgiLCJsb2NhbCIsIl9sb2NhbCIsIndvcmxkIiwiX3JlbmRlckRhdGEiLCJ2RGF0YXMiLCJmbG9hdHNQZXJWZXJ0Iiwib2Zmc2V0IiwibGVuZ3RoIiwic2V0IiwidHJhbnNmb3JtTWF0NCIsIngiLCJ5IiwieiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7Ozs7Ozs7QUFDQSxJQUFNQSxXQUFXLEdBQUdDLE9BQU8sQ0FBQywwQkFBRCxDQUEzQjs7QUFDQSxJQUFNQyxvQkFBb0IsR0FBR0QsT0FBTyxDQUFDLGNBQUQsQ0FBcEM7O0FBRUEsSUFBTUUsZUFBZSxHQUFHLElBQUlDLGVBQUosRUFBeEI7QUFDQSxJQUFNQyxlQUFlLEdBQUcsSUFBSUQsZUFBSixFQUF4Qjs7SUFFcUJFOzs7Ozs7OztFQUErQko7OztBQUlwREssRUFBRSxDQUFDQyxFQUFILENBQU1DLEtBQU4sQ0FBWUgsc0JBQXNCLENBQUNJLFNBQW5DLEVBQThDVixXQUE5QyxFQUEyRDtBQUN2RFcsRUFBQUEsZ0JBRHVELDRCQUNyQ0MsSUFEcUMsRUFDL0I7QUFDcEIsUUFBSUMsTUFBTSxHQUFHRCxJQUFJLENBQUNFLElBQUwsQ0FBVUMsWUFBdkI7QUFDQSxRQUFJQyxLQUFLLEdBQUcsS0FBS0MsTUFBakI7QUFDQSxRQUFJQyxLQUFLLEdBQUcsS0FBS0MsV0FBTCxDQUFpQkMsTUFBakIsQ0FBd0IsQ0FBeEIsQ0FBWjtBQUVBLFFBQUlDLGFBQWEsR0FBRyxLQUFLQSxhQUF6Qjs7QUFDQSxTQUFLLElBQUlDLE1BQU0sR0FBRyxDQUFsQixFQUFxQkEsTUFBTSxHQUFHSixLQUFLLENBQUNLLE1BQXBDLEVBQTRDRCxNQUFNLElBQUlELGFBQXRELEVBQXFFO0FBQ2pFakIsc0JBQUtvQixHQUFMLENBQVNyQixlQUFULEVBQTBCYSxLQUFLLENBQUNNLE1BQUQsQ0FBL0IsRUFBeUNOLEtBQUssQ0FBQ00sTUFBTSxHQUFDLENBQVIsQ0FBOUMsRUFBMEQsQ0FBMUQ7O0FBQ0FsQixzQkFBS3FCLGFBQUwsQ0FBbUJwQixlQUFuQixFQUFvQ0YsZUFBcEMsRUFBcURVLE1BQXJEOztBQUVBSyxNQUFBQSxLQUFLLENBQUNJLE1BQUQsQ0FBTCxHQUFnQmpCLGVBQWUsQ0FBQ3FCLENBQWhDO0FBQ0FSLE1BQUFBLEtBQUssQ0FBQ0ksTUFBTSxHQUFDLENBQVIsQ0FBTCxHQUFrQmpCLGVBQWUsQ0FBQ3NCLENBQWxDO0FBQ0FULE1BQUFBLEtBQUssQ0FBQ0ksTUFBTSxHQUFDLENBQVIsQ0FBTCxHQUFrQmpCLGVBQWUsQ0FBQ3VCLENBQWxDO0FBQ0g7QUFDSjtBQWZzRCxDQUEzRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBWZWMzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3ZhbHVlLXR5cGVzL3ZlYzMnO1xuY29uc3QgQXNzZW1ibGVyM0QgPSByZXF1aXJlKCcuLi8uLi8uLi8uLi9hc3NlbWJsZXItM2QnKTtcbmNvbnN0IFdlYmdsQm1mb250QXNzZW1ibGVyID0gcmVxdWlyZSgnLi4vMmQvYm1mb250Jyk7XG5cbmNvbnN0IHZlYzNfdGVtcF9sb2NhbCA9IG5ldyBWZWMzKCk7XG5jb25zdCB2ZWMzX3RlbXBfd29ybGQgPSBuZXcgVmVjMygpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJnbEJtZm9udEFzc2VtYmxlcjNEIGV4dGVuZHMgV2ViZ2xCbWZvbnRBc3NlbWJsZXIge1xuXG59XG5cbmNjLmpzLm1peGluKFdlYmdsQm1mb250QXNzZW1ibGVyM0QucHJvdG90eXBlLCBBc3NlbWJsZXIzRCwge1xuICAgIHVwZGF0ZVdvcmxkVmVydHMgKGNvbXApIHtcbiAgICAgICAgbGV0IG1hdHJpeCA9IGNvbXAubm9kZS5fd29ybGRNYXRyaXg7XG4gICAgICAgIGxldCBsb2NhbCA9IHRoaXMuX2xvY2FsO1xuICAgICAgICBsZXQgd29ybGQgPSB0aGlzLl9yZW5kZXJEYXRhLnZEYXRhc1swXTtcblxuICAgICAgICBsZXQgZmxvYXRzUGVyVmVydCA9IHRoaXMuZmxvYXRzUGVyVmVydDtcbiAgICAgICAgZm9yIChsZXQgb2Zmc2V0ID0gMDsgb2Zmc2V0IDwgd29ybGQubGVuZ3RoOyBvZmZzZXQgKz0gZmxvYXRzUGVyVmVydCkge1xuICAgICAgICAgICAgVmVjMy5zZXQodmVjM190ZW1wX2xvY2FsLCBsb2NhbFtvZmZzZXRdLCBsb2NhbFtvZmZzZXQrMV0sIDApO1xuICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KHZlYzNfdGVtcF93b3JsZCwgdmVjM190ZW1wX2xvY2FsLCBtYXRyaXgpO1xuXG4gICAgICAgICAgICB3b3JsZFtvZmZzZXRdID0gdmVjM190ZW1wX3dvcmxkLng7XG4gICAgICAgICAgICB3b3JsZFtvZmZzZXQrMV0gPSB2ZWMzX3RlbXBfd29ybGQueTtcbiAgICAgICAgICAgIHdvcmxkW29mZnNldCsyXSA9IHZlYzNfdGVtcF93b3JsZC56O1xuICAgICAgICB9XG4gICAgfVxufSk7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==