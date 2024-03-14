
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/utils/decode-uuid.js';
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
var Base64Values = require('./misc').BASE64_VALUES;

var HexChars = '0123456789abcdef'.split('');
var _t = ['', '', '', ''];

var UuidTemplate = _t.concat(_t, '-', _t, '-', _t, '-', _t, '-', _t, _t, _t);

var Indices = UuidTemplate.map(function (x, i) {
  return x === '-' ? NaN : i;
}).filter(isFinite); // fcmR3XADNLgJ1ByKhqcC5Z -> fc991dd7-0033-4b80-9d41-c8a86a702e59

module.exports = function (base64) {
  if (base64.length !== 22) {
    return base64;
  }

  UuidTemplate[0] = base64[0];
  UuidTemplate[1] = base64[1];

  for (var i = 2, j = 2; i < 22; i += 2) {
    var lhs = Base64Values[base64.charCodeAt(i)];
    var rhs = Base64Values[base64.charCodeAt(i + 1)];
    UuidTemplate[Indices[j++]] = HexChars[lhs >> 2];
    UuidTemplate[Indices[j++]] = HexChars[(lhs & 3) << 2 | rhs >> 4];
    UuidTemplate[Indices[j++]] = HexChars[rhs & 0xF];
  }

  return UuidTemplate.join('');
};

if (CC_TEST) {
  cc._Test.decodeUuid = module.exports;
}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3V0aWxzL2RlY29kZS11dWlkLmpzIl0sIm5hbWVzIjpbIkJhc2U2NFZhbHVlcyIsInJlcXVpcmUiLCJCQVNFNjRfVkFMVUVTIiwiSGV4Q2hhcnMiLCJzcGxpdCIsIl90IiwiVXVpZFRlbXBsYXRlIiwiY29uY2F0IiwiSW5kaWNlcyIsIm1hcCIsIngiLCJpIiwiTmFOIiwiZmlsdGVyIiwiaXNGaW5pdGUiLCJtb2R1bGUiLCJleHBvcnRzIiwiYmFzZTY0IiwibGVuZ3RoIiwiaiIsImxocyIsImNoYXJDb2RlQXQiLCJyaHMiLCJqb2luIiwiQ0NfVEVTVCIsImNjIiwiX1Rlc3QiLCJkZWNvZGVVdWlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFJQSxZQUFZLEdBQUdDLE9BQU8sQ0FBQyxRQUFELENBQVAsQ0FBa0JDLGFBQXJDOztBQUVBLElBQUlDLFFBQVEsR0FBRyxtQkFBbUJDLEtBQW5CLENBQXlCLEVBQXpCLENBQWY7QUFFQSxJQUFJQyxFQUFFLEdBQUcsQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQsRUFBYSxFQUFiLENBQVQ7O0FBQ0EsSUFBSUMsWUFBWSxHQUFHRCxFQUFFLENBQUNFLE1BQUgsQ0FBVUYsRUFBVixFQUFjLEdBQWQsRUFBbUJBLEVBQW5CLEVBQXVCLEdBQXZCLEVBQTRCQSxFQUE1QixFQUFnQyxHQUFoQyxFQUFxQ0EsRUFBckMsRUFBeUMsR0FBekMsRUFBOENBLEVBQTlDLEVBQWtEQSxFQUFsRCxFQUFzREEsRUFBdEQsQ0FBbkI7O0FBQ0EsSUFBSUcsT0FBTyxHQUFHRixZQUFZLENBQUNHLEdBQWIsQ0FBaUIsVUFBVUMsQ0FBVixFQUFhQyxDQUFiLEVBQWdCO0FBQUUsU0FBT0QsQ0FBQyxLQUFLLEdBQU4sR0FBWUUsR0FBWixHQUFrQkQsQ0FBekI7QUFBNkIsQ0FBaEUsRUFBa0VFLE1BQWxFLENBQXlFQyxRQUF6RSxDQUFkLEVBRUE7O0FBQ0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQixVQUFVQyxNQUFWLEVBQWtCO0FBQy9CLE1BQUlBLE1BQU0sQ0FBQ0MsTUFBUCxLQUFrQixFQUF0QixFQUEwQjtBQUN0QixXQUFPRCxNQUFQO0FBQ0g7O0FBQ0RYLEVBQUFBLFlBQVksQ0FBQyxDQUFELENBQVosR0FBa0JXLE1BQU0sQ0FBQyxDQUFELENBQXhCO0FBQ0FYLEVBQUFBLFlBQVksQ0FBQyxDQUFELENBQVosR0FBa0JXLE1BQU0sQ0FBQyxDQUFELENBQXhCOztBQUNBLE9BQUssSUFBSU4sQ0FBQyxHQUFHLENBQVIsRUFBV1EsQ0FBQyxHQUFHLENBQXBCLEVBQXVCUixDQUFDLEdBQUcsRUFBM0IsRUFBK0JBLENBQUMsSUFBSSxDQUFwQyxFQUF1QztBQUNuQyxRQUFJUyxHQUFHLEdBQUdwQixZQUFZLENBQUNpQixNQUFNLENBQUNJLFVBQVAsQ0FBa0JWLENBQWxCLENBQUQsQ0FBdEI7QUFDQSxRQUFJVyxHQUFHLEdBQUd0QixZQUFZLENBQUNpQixNQUFNLENBQUNJLFVBQVAsQ0FBa0JWLENBQUMsR0FBRyxDQUF0QixDQUFELENBQXRCO0FBQ0FMLElBQUFBLFlBQVksQ0FBQ0UsT0FBTyxDQUFDVyxDQUFDLEVBQUYsQ0FBUixDQUFaLEdBQTZCaEIsUUFBUSxDQUFDaUIsR0FBRyxJQUFJLENBQVIsQ0FBckM7QUFDQWQsSUFBQUEsWUFBWSxDQUFDRSxPQUFPLENBQUNXLENBQUMsRUFBRixDQUFSLENBQVosR0FBNkJoQixRQUFRLENBQUUsQ0FBQ2lCLEdBQUcsR0FBRyxDQUFQLEtBQWEsQ0FBZCxHQUFtQkUsR0FBRyxJQUFJLENBQTNCLENBQXJDO0FBQ0FoQixJQUFBQSxZQUFZLENBQUNFLE9BQU8sQ0FBQ1csQ0FBQyxFQUFGLENBQVIsQ0FBWixHQUE2QmhCLFFBQVEsQ0FBQ21CLEdBQUcsR0FBRyxHQUFQLENBQXJDO0FBQ0g7O0FBQ0QsU0FBT2hCLFlBQVksQ0FBQ2lCLElBQWIsQ0FBa0IsRUFBbEIsQ0FBUDtBQUNILENBZEQ7O0FBZ0JBLElBQUlDLE9BQUosRUFBYTtBQUNUQyxFQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBU0MsVUFBVCxHQUFzQlosTUFBTSxDQUFDQyxPQUE3QjtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG52YXIgQmFzZTY0VmFsdWVzID0gcmVxdWlyZSgnLi9taXNjJykuQkFTRTY0X1ZBTFVFUztcblxudmFyIEhleENoYXJzID0gJzAxMjM0NTY3ODlhYmNkZWYnLnNwbGl0KCcnKTtcblxudmFyIF90ID0gWycnLCAnJywgJycsICcnXTtcbnZhciBVdWlkVGVtcGxhdGUgPSBfdC5jb25jYXQoX3QsICctJywgX3QsICctJywgX3QsICctJywgX3QsICctJywgX3QsIF90LCBfdCk7XG52YXIgSW5kaWNlcyA9IFV1aWRUZW1wbGF0ZS5tYXAoZnVuY3Rpb24gKHgsIGkpIHsgcmV0dXJuIHggPT09ICctJyA/IE5hTiA6IGk7IH0pLmZpbHRlcihpc0Zpbml0ZSk7XG5cbi8vIGZjbVIzWEFETkxnSjFCeUtocWNDNVogLT4gZmM5OTFkZDctMDAzMy00YjgwLTlkNDEtYzhhODZhNzAyZTU5XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChiYXNlNjQpIHtcbiAgICBpZiAoYmFzZTY0Lmxlbmd0aCAhPT0gMjIpIHtcbiAgICAgICAgcmV0dXJuIGJhc2U2NDtcbiAgICB9XG4gICAgVXVpZFRlbXBsYXRlWzBdID0gYmFzZTY0WzBdO1xuICAgIFV1aWRUZW1wbGF0ZVsxXSA9IGJhc2U2NFsxXTtcbiAgICBmb3IgKHZhciBpID0gMiwgaiA9IDI7IGkgPCAyMjsgaSArPSAyKSB7XG4gICAgICAgIHZhciBsaHMgPSBCYXNlNjRWYWx1ZXNbYmFzZTY0LmNoYXJDb2RlQXQoaSldO1xuICAgICAgICB2YXIgcmhzID0gQmFzZTY0VmFsdWVzW2Jhc2U2NC5jaGFyQ29kZUF0KGkgKyAxKV07XG4gICAgICAgIFV1aWRUZW1wbGF0ZVtJbmRpY2VzW2orK11dID0gSGV4Q2hhcnNbbGhzID4+IDJdO1xuICAgICAgICBVdWlkVGVtcGxhdGVbSW5kaWNlc1tqKytdXSA9IEhleENoYXJzWygobGhzICYgMykgPDwgMikgfCByaHMgPj4gNF07XG4gICAgICAgIFV1aWRUZW1wbGF0ZVtJbmRpY2VzW2orK11dID0gSGV4Q2hhcnNbcmhzICYgMHhGXTtcbiAgICB9XG4gICAgcmV0dXJuIFV1aWRUZW1wbGF0ZS5qb2luKCcnKTtcbn07XG5cbmlmIChDQ19URVNUKSB7XG4gICAgY2MuX1Rlc3QuZGVjb2RlVXVpZCA9IG1vZHVsZS5leHBvcnRzO1xufVxuIl0sInNvdXJjZVJvb3QiOiIvIn0=