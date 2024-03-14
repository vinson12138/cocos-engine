
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/canvas/render-component-handle.js';
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
var utils = require('./renderers/utils');

var RenderComponentHandle = function RenderComponentHandle(device, defaultCamera) {
  this._device = device; // let vx = this._device._vx;
  // let vy = this._device._vy;
  // let vh = this._device._vh;

  this._camera = defaultCamera;
  this.parentOpacity = 1;
  this.parentOpacityDirty = 0;
  this.worldMatDirty = 0;
  this.walking = false;
};

RenderComponentHandle.prototype = {
  constructor: RenderComponentHandle,
  reset: function reset() {
    var ctx = this._device._ctx;
    var canvas = this._device._canvas;
    var color = cc.Camera.main ? cc.Camera.main.backgroundColor : cc.color();
    var rgba = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a / 255 + ")";
    ctx.fillStyle = rgba;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this._device._stats.drawcalls = 0; //reset cache data

    utils.context.reset();
  },
  terminate: function terminate() {}
};
module.exports = RenderComponentHandle;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL2NhbnZhcy9yZW5kZXItY29tcG9uZW50LWhhbmRsZS5qcyJdLCJuYW1lcyI6WyJ1dGlscyIsInJlcXVpcmUiLCJSZW5kZXJDb21wb25lbnRIYW5kbGUiLCJkZXZpY2UiLCJkZWZhdWx0Q2FtZXJhIiwiX2RldmljZSIsIl9jYW1lcmEiLCJwYXJlbnRPcGFjaXR5IiwicGFyZW50T3BhY2l0eURpcnR5Iiwid29ybGRNYXREaXJ0eSIsIndhbGtpbmciLCJwcm90b3R5cGUiLCJjb25zdHJ1Y3RvciIsInJlc2V0IiwiY3R4IiwiX2N0eCIsImNhbnZhcyIsIl9jYW52YXMiLCJjb2xvciIsImNjIiwiQ2FtZXJhIiwibWFpbiIsImJhY2tncm91bmRDb2xvciIsInJnYmEiLCJyIiwiZyIsImIiLCJhIiwiZmlsbFN0eWxlIiwic2V0VHJhbnNmb3JtIiwiY2xlYXJSZWN0Iiwid2lkdGgiLCJoZWlnaHQiLCJmaWxsUmVjdCIsIl9zdGF0cyIsImRyYXdjYWxscyIsImNvbnRleHQiLCJ0ZXJtaW5hdGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsS0FBSyxHQUFHQyxPQUFPLENBQUMsbUJBQUQsQ0FBckI7O0FBRUEsSUFBSUMscUJBQXFCLEdBQUcsU0FBeEJBLHFCQUF3QixDQUFVQyxNQUFWLEVBQWtCQyxhQUFsQixFQUFpQztBQUN6RCxPQUFLQyxPQUFMLEdBQWVGLE1BQWYsQ0FEeUQsQ0FFekQ7QUFDQTtBQUNBOztBQUNBLE9BQUtHLE9BQUwsR0FBZUYsYUFBZjtBQUVBLE9BQUtHLGFBQUwsR0FBcUIsQ0FBckI7QUFDQSxPQUFLQyxrQkFBTCxHQUEwQixDQUExQjtBQUNBLE9BQUtDLGFBQUwsR0FBcUIsQ0FBckI7QUFDQSxPQUFLQyxPQUFMLEdBQWUsS0FBZjtBQUNILENBWEQ7O0FBYUFSLHFCQUFxQixDQUFDUyxTQUF0QixHQUFrQztBQUM5QkMsRUFBQUEsV0FBVyxFQUFFVixxQkFEaUI7QUFHOUJXLEVBQUFBLEtBSDhCLG1CQUd0QjtBQUNKLFFBQUlDLEdBQUcsR0FBRyxLQUFLVCxPQUFMLENBQWFVLElBQXZCO0FBQ0EsUUFBSUMsTUFBTSxHQUFHLEtBQUtYLE9BQUwsQ0FBYVksT0FBMUI7QUFDQSxRQUFJQyxLQUFLLEdBQUdDLEVBQUUsQ0FBQ0MsTUFBSCxDQUFVQyxJQUFWLEdBQWlCRixFQUFFLENBQUNDLE1BQUgsQ0FBVUMsSUFBVixDQUFlQyxlQUFoQyxHQUFrREgsRUFBRSxDQUFDRCxLQUFILEVBQTlEO0FBQ0EsUUFBSUssSUFBSSxhQUFXTCxLQUFLLENBQUNNLENBQWpCLFVBQXVCTixLQUFLLENBQUNPLENBQTdCLFVBQW1DUCxLQUFLLENBQUNRLENBQXpDLFVBQStDUixLQUFLLENBQUNTLENBQU4sR0FBUSxHQUF2RCxNQUFSO0FBQ0FiLElBQUFBLEdBQUcsQ0FBQ2MsU0FBSixHQUFnQkwsSUFBaEI7QUFDQVQsSUFBQUEsR0FBRyxDQUFDZSxZQUFKLENBQWlCLENBQWpCLEVBQW9CLENBQXBCLEVBQXVCLENBQXZCLEVBQTBCLENBQTFCLEVBQTZCLENBQTdCLEVBQWdDLENBQWhDO0FBQ0FmLElBQUFBLEdBQUcsQ0FBQ2dCLFNBQUosQ0FBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CZCxNQUFNLENBQUNlLEtBQTNCLEVBQWtDZixNQUFNLENBQUNnQixNQUF6QztBQUNBbEIsSUFBQUEsR0FBRyxDQUFDbUIsUUFBSixDQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUJqQixNQUFNLENBQUNlLEtBQTFCLEVBQWlDZixNQUFNLENBQUNnQixNQUF4QztBQUNBLFNBQUszQixPQUFMLENBQWE2QixNQUFiLENBQW9CQyxTQUFwQixHQUFnQyxDQUFoQyxDQVRJLENBVUo7O0FBQ0FuQyxJQUFBQSxLQUFLLENBQUNvQyxPQUFOLENBQWN2QixLQUFkO0FBQ0gsR0FmNkI7QUFpQjlCd0IsRUFBQUEsU0FqQjhCLHVCQWlCakIsQ0FFWjtBQW5CNkIsQ0FBbEM7QUFzQkFDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnJDLHFCQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi9yZW5kZXJlcnMvdXRpbHMnKVxuXG5sZXQgUmVuZGVyQ29tcG9uZW50SGFuZGxlID0gZnVuY3Rpb24gKGRldmljZSwgZGVmYXVsdENhbWVyYSkge1xuICAgIHRoaXMuX2RldmljZSA9IGRldmljZTtcbiAgICAvLyBsZXQgdnggPSB0aGlzLl9kZXZpY2UuX3Z4O1xuICAgIC8vIGxldCB2eSA9IHRoaXMuX2RldmljZS5fdnk7XG4gICAgLy8gbGV0IHZoID0gdGhpcy5fZGV2aWNlLl92aDtcbiAgICB0aGlzLl9jYW1lcmEgPSBkZWZhdWx0Q2FtZXJhO1xuXG4gICAgdGhpcy5wYXJlbnRPcGFjaXR5ID0gMTtcbiAgICB0aGlzLnBhcmVudE9wYWNpdHlEaXJ0eSA9IDA7XG4gICAgdGhpcy53b3JsZE1hdERpcnR5ID0gMDtcbiAgICB0aGlzLndhbGtpbmcgPSBmYWxzZTtcbn07XG5cblJlbmRlckNvbXBvbmVudEhhbmRsZS5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IFJlbmRlckNvbXBvbmVudEhhbmRsZSxcbiAgICBcbiAgICByZXNldCgpIHtcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuX2RldmljZS5fY3R4O1xuICAgICAgICBsZXQgY2FudmFzID0gdGhpcy5fZGV2aWNlLl9jYW52YXM7XG4gICAgICAgIHZhciBjb2xvciA9IGNjLkNhbWVyYS5tYWluID8gY2MuQ2FtZXJhLm1haW4uYmFja2dyb3VuZENvbG9yIDogY2MuY29sb3IoKTtcbiAgICAgICAgbGV0IHJnYmEgPSBgcmdiYSgke2NvbG9yLnJ9LCAke2NvbG9yLmd9LCAke2NvbG9yLmJ9LCAke2NvbG9yLmEvMjU1fSlgO1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gcmdiYTtcbiAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTtcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgICAgICBjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgdGhpcy5fZGV2aWNlLl9zdGF0cy5kcmF3Y2FsbHMgPSAwO1xuICAgICAgICAvL3Jlc2V0IGNhY2hlIGRhdGFcbiAgICAgICAgdXRpbHMuY29udGV4dC5yZXNldCgpO1xuICAgIH0sXG5cbiAgICB0ZXJtaW5hdGUgKCkge1xuXG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJDb21wb25lbnRIYW5kbGU7Il0sInNvdXJjZVJvb3QiOiIvIn0=