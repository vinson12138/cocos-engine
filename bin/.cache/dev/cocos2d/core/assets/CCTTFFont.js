
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCTTFFont.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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
var Font = require('./CCFont');
/**
 * @module cc
 */

/**
 * !#en Class for TTFFont handling.
 * !#zh TTF 字体资源类。
 * @class TTFFont
 * @extends Font
 *
 */


var TTFFont = cc.Class({
  name: 'cc.TTFFont',
  "extends": Font,
  properties: {
    _fontFamily: null,
    _nativeAsset: {
      type: cc.String,
      get: function get() {
        return this._fontFamily;
      },
      set: function set(value) {
        this._fontFamily = value || 'Arial';
      },
      override: true
    },
    _nativeDep: {
      get: function get() {
        return {
          uuid: this._uuid,
          __nativeName__: this._native,
          ext: cc.path.extname(this._native),
          __isNative__: true
        };
      },
      override: true
    }
  }
});
cc.TTFFont = module.exports = TTFFont;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0cy9DQ1RURkZvbnQuanMiXSwibmFtZXMiOlsiRm9udCIsInJlcXVpcmUiLCJUVEZGb250IiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJwcm9wZXJ0aWVzIiwiX2ZvbnRGYW1pbHkiLCJfbmF0aXZlQXNzZXQiLCJ0eXBlIiwiU3RyaW5nIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJvdmVycmlkZSIsIl9uYXRpdmVEZXAiLCJ1dWlkIiwiX3V1aWQiLCJfX25hdGl2ZU5hbWVfXyIsIl9uYXRpdmUiLCJleHQiLCJwYXRoIiwiZXh0bmFtZSIsIl9faXNOYXRpdmVfXyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLElBQUksR0FBR0MsT0FBTyxDQUFDLFVBQUQsQ0FBcEI7QUFFQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQUlDLE9BQU8sR0FBR0MsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDbkJDLEVBQUFBLElBQUksRUFBRSxZQURhO0FBRW5CLGFBQVNMLElBRlU7QUFJbkJNLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxXQUFXLEVBQUUsSUFETDtBQUVSQyxJQUFBQSxZQUFZLEVBQUU7QUFDVkMsTUFBQUEsSUFBSSxFQUFFTixFQUFFLENBQUNPLE1BREM7QUFFVkMsTUFBQUEsR0FGVSxpQkFFSDtBQUNILGVBQU8sS0FBS0osV0FBWjtBQUNILE9BSlM7QUFLVkssTUFBQUEsR0FMVSxlQUtMQyxLQUxLLEVBS0U7QUFDUixhQUFLTixXQUFMLEdBQW1CTSxLQUFLLElBQUksT0FBNUI7QUFDSCxPQVBTO0FBUVZDLE1BQUFBLFFBQVEsRUFBRTtBQVJBLEtBRk47QUFhUkMsSUFBQUEsVUFBVSxFQUFFO0FBQ1JKLE1BQUFBLEdBRFEsaUJBQ0Q7QUFDSCxlQUFPO0FBQUVLLFVBQUFBLElBQUksRUFBRSxLQUFLQyxLQUFiO0FBQW9CQyxVQUFBQSxjQUFjLEVBQUUsS0FBS0MsT0FBekM7QUFBbURDLFVBQUFBLEdBQUcsRUFBRWpCLEVBQUUsQ0FBQ2tCLElBQUgsQ0FBUUMsT0FBUixDQUFnQixLQUFLSCxPQUFyQixDQUF4RDtBQUF1RkksVUFBQUEsWUFBWSxFQUFFO0FBQXJHLFNBQVA7QUFDSCxPQUhPO0FBSVJULE1BQUFBLFFBQVEsRUFBRTtBQUpGO0FBYko7QUFKTyxDQUFULENBQWQ7QUEwQkFYLEVBQUUsQ0FBQ0QsT0FBSCxHQUFhc0IsTUFBTSxDQUFDQyxPQUFQLEdBQWlCdkIsT0FBOUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IEZvbnQgPSByZXF1aXJlKCcuL0NDRm9udCcpO1xuXG4vKipcbiAqIEBtb2R1bGUgY2NcbiAqL1xuLyoqXG4gKiAhI2VuIENsYXNzIGZvciBUVEZGb250IGhhbmRsaW5nLlxuICogISN6aCBUVEYg5a2X5L2T6LWE5rqQ57G744CCXG4gKiBAY2xhc3MgVFRGRm9udFxuICogQGV4dGVuZHMgRm9udFxuICpcbiAqL1xudmFyIFRURkZvbnQgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlRURkZvbnQnLFxuICAgIGV4dGVuZHM6IEZvbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF9mb250RmFtaWx5OiBudWxsLFxuICAgICAgICBfbmF0aXZlQXNzZXQ6IHtcbiAgICAgICAgICAgIHR5cGU6IGNjLlN0cmluZyxcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRGYW1pbHk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnRGYW1pbHkgPSB2YWx1ZSB8fCAnQXJpYWwnO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG92ZXJyaWRlOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgX25hdGl2ZURlcDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyB1dWlkOiB0aGlzLl91dWlkLCBfX25hdGl2ZU5hbWVfXzogdGhpcy5fbmF0aXZlLCAgZXh0OiBjYy5wYXRoLmV4dG5hbWUodGhpcy5fbmF0aXZlKSwgX19pc05hdGl2ZV9fOiB0cnVlIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3ZlcnJpZGU6IHRydWVcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5UVEZGb250ID0gbW9kdWxlLmV4cG9ydHMgPSBUVEZGb250O1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=