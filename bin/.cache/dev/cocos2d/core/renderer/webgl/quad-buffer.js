
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/webgl/quad-buffer.js';
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
var MeshBuffer = require('./mesh-buffer');

var QuadBuffer = cc.Class({
  name: 'cc.QuadBuffer',
  "extends": MeshBuffer,
  _fillQuadBuffer: function _fillQuadBuffer() {
    var count = this._initIDataCount / 6;
    var buffer = this._iData;

    for (var i = 0, idx = 0; i < count; i++) {
      var vertextID = i * 4;
      buffer[idx++] = vertextID;
      buffer[idx++] = vertextID + 1;
      buffer[idx++] = vertextID + 2;
      buffer[idx++] = vertextID + 1;
      buffer[idx++] = vertextID + 3;
      buffer[idx++] = vertextID + 2;
    }

    var indicesData = new Uint16Array(this._iData.buffer, 0, count * 6);

    this._ib.update(0, indicesData);
  },
  uploadData: function uploadData() {
    if (this.byteOffset === 0 || !this._dirty) {
      return;
    } // update vertext data


    var vertexsData = new Float32Array(this._vData.buffer, 0, this.byteOffset >> 2);

    this._vb.update(0, vertexsData);

    this._dirty = false;
  },
  switchBuffer: function switchBuffer() {
    this._super(); // upload index buffer data


    var indicesData = new Uint16Array(this._iData.buffer, 0, this._initIDataCount);

    this._ib.update(0, indicesData);
  },
  _reallocBuffer: function _reallocBuffer() {
    this._reallocVData(true);

    this._reallocIData();

    this._fillQuadBuffer();
  }
});
cc.QuadBuffer = module.exports = QuadBuffer;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL3dlYmdsL3F1YWQtYnVmZmVyLmpzIl0sIm5hbWVzIjpbIk1lc2hCdWZmZXIiLCJyZXF1aXJlIiwiUXVhZEJ1ZmZlciIsImNjIiwiQ2xhc3MiLCJuYW1lIiwiX2ZpbGxRdWFkQnVmZmVyIiwiY291bnQiLCJfaW5pdElEYXRhQ291bnQiLCJidWZmZXIiLCJfaURhdGEiLCJpIiwiaWR4IiwidmVydGV4dElEIiwiaW5kaWNlc0RhdGEiLCJVaW50MTZBcnJheSIsIl9pYiIsInVwZGF0ZSIsInVwbG9hZERhdGEiLCJieXRlT2Zmc2V0IiwiX2RpcnR5IiwidmVydGV4c0RhdGEiLCJGbG9hdDMyQXJyYXkiLCJfdkRhdGEiLCJfdmIiLCJzd2l0Y2hCdWZmZXIiLCJfc3VwZXIiLCJfcmVhbGxvY0J1ZmZlciIsIl9yZWFsbG9jVkRhdGEiLCJfcmVhbGxvY0lEYXRhIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLFVBQVUsR0FBR0MsT0FBTyxDQUFDLGVBQUQsQ0FBMUI7O0FBRUEsSUFBSUMsVUFBVSxHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUN0QkMsRUFBQUEsSUFBSSxFQUFFLGVBRGdCO0FBRXRCLGFBQVNMLFVBRmE7QUFJdEJNLEVBQUFBLGVBSnNCLDZCQUlIO0FBQ2YsUUFBSUMsS0FBSyxHQUFHLEtBQUtDLGVBQUwsR0FBdUIsQ0FBbkM7QUFDQSxRQUFJQyxNQUFNLEdBQUcsS0FBS0MsTUFBbEI7O0FBQ0EsU0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBUixFQUFXQyxHQUFHLEdBQUcsQ0FBdEIsRUFBeUJELENBQUMsR0FBR0osS0FBN0IsRUFBb0NJLENBQUMsRUFBckMsRUFBeUM7QUFDckMsVUFBSUUsU0FBUyxHQUFHRixDQUFDLEdBQUcsQ0FBcEI7QUFDQUYsTUFBQUEsTUFBTSxDQUFDRyxHQUFHLEVBQUosQ0FBTixHQUFnQkMsU0FBaEI7QUFDQUosTUFBQUEsTUFBTSxDQUFDRyxHQUFHLEVBQUosQ0FBTixHQUFnQkMsU0FBUyxHQUFDLENBQTFCO0FBQ0FKLE1BQUFBLE1BQU0sQ0FBQ0csR0FBRyxFQUFKLENBQU4sR0FBZ0JDLFNBQVMsR0FBQyxDQUExQjtBQUNBSixNQUFBQSxNQUFNLENBQUNHLEdBQUcsRUFBSixDQUFOLEdBQWdCQyxTQUFTLEdBQUMsQ0FBMUI7QUFDQUosTUFBQUEsTUFBTSxDQUFDRyxHQUFHLEVBQUosQ0FBTixHQUFnQkMsU0FBUyxHQUFDLENBQTFCO0FBQ0FKLE1BQUFBLE1BQU0sQ0FBQ0csR0FBRyxFQUFKLENBQU4sR0FBZ0JDLFNBQVMsR0FBQyxDQUExQjtBQUNIOztBQUVELFFBQUlDLFdBQVcsR0FBRyxJQUFJQyxXQUFKLENBQWdCLEtBQUtMLE1BQUwsQ0FBWUQsTUFBNUIsRUFBb0MsQ0FBcEMsRUFBdUNGLEtBQUssR0FBRyxDQUEvQyxDQUFsQjs7QUFDQSxTQUFLUyxHQUFMLENBQVNDLE1BQVQsQ0FBZ0IsQ0FBaEIsRUFBbUJILFdBQW5CO0FBQ0gsR0FuQnFCO0FBcUJ0QkksRUFBQUEsVUFyQnNCLHdCQXFCUjtBQUNWLFFBQUksS0FBS0MsVUFBTCxLQUFvQixDQUFwQixJQUF5QixDQUFDLEtBQUtDLE1BQW5DLEVBQTJDO0FBQ3ZDO0FBQ0gsS0FIUyxDQUtWOzs7QUFDQSxRQUFJQyxXQUFXLEdBQUcsSUFBSUMsWUFBSixDQUFpQixLQUFLQyxNQUFMLENBQVlkLE1BQTdCLEVBQXFDLENBQXJDLEVBQXdDLEtBQUtVLFVBQUwsSUFBbUIsQ0FBM0QsQ0FBbEI7O0FBQ0EsU0FBS0ssR0FBTCxDQUFTUCxNQUFULENBQWdCLENBQWhCLEVBQW1CSSxXQUFuQjs7QUFFQSxTQUFLRCxNQUFMLEdBQWMsS0FBZDtBQUNILEdBL0JxQjtBQWlDdEJLLEVBQUFBLFlBakNzQiwwQkFpQ047QUFDWixTQUFLQyxNQUFMLEdBRFksQ0FFWjs7O0FBQ0EsUUFBSVosV0FBVyxHQUFHLElBQUlDLFdBQUosQ0FBZ0IsS0FBS0wsTUFBTCxDQUFZRCxNQUE1QixFQUFvQyxDQUFwQyxFQUF1QyxLQUFLRCxlQUE1QyxDQUFsQjs7QUFDQSxTQUFLUSxHQUFMLENBQVNDLE1BQVQsQ0FBZ0IsQ0FBaEIsRUFBbUJILFdBQW5CO0FBQ0gsR0F0Q3FCO0FBd0N0QmEsRUFBQUEsY0F4Q3NCLDRCQXdDSjtBQUNkLFNBQUtDLGFBQUwsQ0FBbUIsSUFBbkI7O0FBQ0EsU0FBS0MsYUFBTDs7QUFDQSxTQUFLdkIsZUFBTDtBQUNIO0FBNUNxQixDQUFULENBQWpCO0FBK0NBSCxFQUFFLENBQUNELFVBQUgsR0FBZ0I0QixNQUFNLENBQUNDLE9BQVAsR0FBaUI3QixVQUFqQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IE1lc2hCdWZmZXIgPSByZXF1aXJlKCcuL21lc2gtYnVmZmVyJyk7XG5cbmxldCBRdWFkQnVmZmVyID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5RdWFkQnVmZmVyJyxcbiAgICBleHRlbmRzOiBNZXNoQnVmZmVyLFxuICAgIFxuICAgIF9maWxsUXVhZEJ1ZmZlciAoKSB7XG4gICAgICAgIGxldCBjb3VudCA9IHRoaXMuX2luaXRJRGF0YUNvdW50IC8gNjtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IHRoaXMuX2lEYXRhO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWR4ID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGxldCB2ZXJ0ZXh0SUQgPSBpICogNDtcbiAgICAgICAgICAgIGJ1ZmZlcltpZHgrK10gPSB2ZXJ0ZXh0SUQ7XG4gICAgICAgICAgICBidWZmZXJbaWR4KytdID0gdmVydGV4dElEKzE7XG4gICAgICAgICAgICBidWZmZXJbaWR4KytdID0gdmVydGV4dElEKzI7XG4gICAgICAgICAgICBidWZmZXJbaWR4KytdID0gdmVydGV4dElEKzE7XG4gICAgICAgICAgICBidWZmZXJbaWR4KytdID0gdmVydGV4dElEKzM7XG4gICAgICAgICAgICBidWZmZXJbaWR4KytdID0gdmVydGV4dElEKzI7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaW5kaWNlc0RhdGEgPSBuZXcgVWludDE2QXJyYXkodGhpcy5faURhdGEuYnVmZmVyLCAwLCBjb3VudCAqIDYpO1xuICAgICAgICB0aGlzLl9pYi51cGRhdGUoMCwgaW5kaWNlc0RhdGEpO1xuICAgIH0sXG5cbiAgICB1cGxvYWREYXRhICgpIHtcbiAgICAgICAgaWYgKHRoaXMuYnl0ZU9mZnNldCA9PT0gMCB8fCAhdGhpcy5fZGlydHkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSB2ZXJ0ZXh0IGRhdGFcbiAgICAgICAgbGV0IHZlcnRleHNEYXRhID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLl92RGF0YS5idWZmZXIsIDAsIHRoaXMuYnl0ZU9mZnNldCA+PiAyKTtcbiAgICAgICAgdGhpcy5fdmIudXBkYXRlKDAsIHZlcnRleHNEYXRhKTtcblxuICAgICAgICB0aGlzLl9kaXJ0eSA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBzd2l0Y2hCdWZmZXIgKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICAvLyB1cGxvYWQgaW5kZXggYnVmZmVyIGRhdGFcbiAgICAgICAgbGV0IGluZGljZXNEYXRhID0gbmV3IFVpbnQxNkFycmF5KHRoaXMuX2lEYXRhLmJ1ZmZlciwgMCwgdGhpcy5faW5pdElEYXRhQ291bnQpO1xuICAgICAgICB0aGlzLl9pYi51cGRhdGUoMCwgaW5kaWNlc0RhdGEpO1xuICAgIH0sXG5cbiAgICBfcmVhbGxvY0J1ZmZlciAoKSB7XG4gICAgICAgIHRoaXMuX3JlYWxsb2NWRGF0YSh0cnVlKTtcbiAgICAgICAgdGhpcy5fcmVhbGxvY0lEYXRhKCk7XG4gICAgICAgIHRoaXMuX2ZpbGxRdWFkQnVmZmVyKCk7XG4gICAgfVxufSk7XG5cbmNjLlF1YWRCdWZmZXIgPSBtb2R1bGUuZXhwb3J0cyA9IFF1YWRCdWZmZXI7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==