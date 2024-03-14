
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/tilemap/tiledmap-buffer.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

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
var TiledMapBuffer = cc.Class({
  name: 'cc.TiledMapBuffer',
  "extends": require('../core/renderer/webgl/quad-buffer'),
  _updateOffset: function _updateOffset() {
    var offsetInfo = this._offsetInfo;
    offsetInfo.vertexOffset = this.vertexOffset;
    offsetInfo.indiceOffset = this.indiceOffset;
    offsetInfo.byteOffset = this.byteOffset;
  },
  adjust: function adjust(vertexCount, indiceCount) {
    this.vertexOffset += vertexCount;
    this.indiceOffset += indiceCount;
    this.indiceStart = this.indiceOffset;
    this.byteOffset = this.byteOffset + vertexCount * this._vertexBytes;
    this._dirty = true;
  }
});
cc.TiledMapBuffer = module.exports = TiledMapBuffer;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC90aWxlbWFwL3RpbGVkbWFwLWJ1ZmZlci5qcyJdLCJuYW1lcyI6WyJUaWxlZE1hcEJ1ZmZlciIsImNjIiwiQ2xhc3MiLCJuYW1lIiwicmVxdWlyZSIsIl91cGRhdGVPZmZzZXQiLCJvZmZzZXRJbmZvIiwiX29mZnNldEluZm8iLCJ2ZXJ0ZXhPZmZzZXQiLCJpbmRpY2VPZmZzZXQiLCJieXRlT2Zmc2V0IiwiYWRqdXN0IiwidmVydGV4Q291bnQiLCJpbmRpY2VDb3VudCIsImluZGljZVN0YXJ0IiwiX3ZlcnRleEJ5dGVzIiwiX2RpcnR5IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUlBLGNBQWMsR0FBR0MsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDMUJDLEVBQUFBLElBQUksRUFBRSxtQkFEb0I7QUFFMUIsYUFBU0MsT0FBTyxDQUFDLG9DQUFELENBRlU7QUFJMUJDLEVBQUFBLGFBSjBCLDJCQUlUO0FBQ2IsUUFBSUMsVUFBVSxHQUFHLEtBQUtDLFdBQXRCO0FBQ0FELElBQUFBLFVBQVUsQ0FBQ0UsWUFBWCxHQUEwQixLQUFLQSxZQUEvQjtBQUNBRixJQUFBQSxVQUFVLENBQUNHLFlBQVgsR0FBMEIsS0FBS0EsWUFBL0I7QUFDQUgsSUFBQUEsVUFBVSxDQUFDSSxVQUFYLEdBQXdCLEtBQUtBLFVBQTdCO0FBQ0gsR0FUeUI7QUFXMUJDLEVBQUFBLE1BWDBCLGtCQVdsQkMsV0FYa0IsRUFXTEMsV0FYSyxFQVdRO0FBQzlCLFNBQUtMLFlBQUwsSUFBcUJJLFdBQXJCO0FBQ0EsU0FBS0gsWUFBTCxJQUFxQkksV0FBckI7QUFDQSxTQUFLQyxXQUFMLEdBQW1CLEtBQUtMLFlBQXhCO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQixLQUFLQSxVQUFMLEdBQWtCRSxXQUFXLEdBQUcsS0FBS0csWUFBdkQ7QUFDQSxTQUFLQyxNQUFMLEdBQWMsSUFBZDtBQUNIO0FBakJ5QixDQUFULENBQXJCO0FBb0JBZixFQUFFLENBQUNELGNBQUgsR0FBb0JpQixNQUFNLENBQUNDLE9BQVAsR0FBaUJsQixjQUFyQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5sZXQgVGlsZWRNYXBCdWZmZXIgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlRpbGVkTWFwQnVmZmVyJyxcbiAgICBleHRlbmRzOiByZXF1aXJlKCcuLi9jb3JlL3JlbmRlcmVyL3dlYmdsL3F1YWQtYnVmZmVyJyksXG5cbiAgICBfdXBkYXRlT2Zmc2V0ICgpIHtcbiAgICAgICAgbGV0IG9mZnNldEluZm8gPSB0aGlzLl9vZmZzZXRJbmZvO1xuICAgICAgICBvZmZzZXRJbmZvLnZlcnRleE9mZnNldCA9IHRoaXMudmVydGV4T2Zmc2V0O1xuICAgICAgICBvZmZzZXRJbmZvLmluZGljZU9mZnNldCA9IHRoaXMuaW5kaWNlT2Zmc2V0O1xuICAgICAgICBvZmZzZXRJbmZvLmJ5dGVPZmZzZXQgPSB0aGlzLmJ5dGVPZmZzZXQ7XG4gICAgfSxcblxuICAgIGFkanVzdCAodmVydGV4Q291bnQsIGluZGljZUNvdW50KSB7XG4gICAgICAgIHRoaXMudmVydGV4T2Zmc2V0ICs9IHZlcnRleENvdW50O1xuICAgICAgICB0aGlzLmluZGljZU9mZnNldCArPSBpbmRpY2VDb3VudDtcbiAgICAgICAgdGhpcy5pbmRpY2VTdGFydCA9IHRoaXMuaW5kaWNlT2Zmc2V0O1xuICAgICAgICB0aGlzLmJ5dGVPZmZzZXQgPSB0aGlzLmJ5dGVPZmZzZXQgKyB2ZXJ0ZXhDb3VudCAqIHRoaXMuX3ZlcnRleEJ5dGVzO1xuICAgICAgICB0aGlzLl9kaXJ0eSA9IHRydWU7XG4gICAgfVxufSk7XG5cbmNjLlRpbGVkTWFwQnVmZmVyID0gbW9kdWxlLmV4cG9ydHMgPSBUaWxlZE1hcEJ1ZmZlcjsiXSwic291cmNlUm9vdCI6Ii8ifQ==