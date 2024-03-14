
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/utils/binary-search.js';
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
var EPSILON = 1e-6;
/**
 * Searches the entire sorted Array for an element and returns the index of the element.
 *
 * @method binarySearch
 * @param {number[]} array
 * @param {number} value
 * @return {number} The index of item in the sorted Array, if item is found; otherwise, a negative number that is the bitwise complement of the index of the next element that is larger than item or, if there is no larger element, the bitwise complement of array's length.
 */
// function binarySearch (array, value) {
//     for (var l = 0, h = array.length - 1, m = h >>> 1;
//          l <= h;
//          m = (l + h) >>> 1
//     ) {
//         var test = array[m];
//         if (test > value) {
//             h = m - 1;
//         }
//         else if (test < value) {
//             l = m + 1;
//         }
//         else {
//             return m;
//         }
//     }
//     return ~l;
// }

/**
 * Searches the entire sorted Array for an element and returns the index of the element.
 * It accepts iteratee which is invoked for value and each element of array to compute their sort ranking.
 * The iteratee is invoked with one argument: (value).
 *
 * @method binarySearchBy
 * @param {number[]} array
 * @param {number} value
 * @param {function} iteratee - the iteratee invoked per element
 * @return {number} The index of item in the sorted Array, if item is found; otherwise, a negative number that is the bitwise complement of the index of the next element that is larger than item or, if there is no larger element, the bitwise complement of array's length.
 */
// function binarySearchBy (array, value, iteratee) {
//     for (var l = 0, h = array.length - 1, m = h >>> 1;
//          l <= h;
//          m = (l + h) >>> 1
//     ) {
//         var test = iteratee(array[m]);
//         if (test > value) {
//             h = m - 1;
//         }
//         else if (test < value) {
//             l = m + 1;
//         }
//         else {
//             return m;
//         }
//     }
//     return ~l;
// }

function binarySearchEpsilon(array, value) {
  for (var l = 0, h = array.length - 1, m = h >>> 1; l <= h; m = l + h >>> 1) {
    var test = array[m];

    if (test > value + EPSILON) {
      h = m - 1;
    } else if (test < value - EPSILON) {
      l = m + 1;
    } else {
      return m;
    }
  }

  return ~l;
}

module.exports = {
  binarySearchEpsilon: binarySearchEpsilon
};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3V0aWxzL2JpbmFyeS1zZWFyY2guanMiXSwibmFtZXMiOlsiRVBTSUxPTiIsImJpbmFyeVNlYXJjaEVwc2lsb24iLCJhcnJheSIsInZhbHVlIiwibCIsImgiLCJsZW5ndGgiLCJtIiwidGVzdCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQUlBLE9BQU8sR0FBRyxJQUFkO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVNDLG1CQUFULENBQThCQyxLQUE5QixFQUFxQ0MsS0FBckMsRUFBNEM7QUFDeEMsT0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBUixFQUFXQyxDQUFDLEdBQUdILEtBQUssQ0FBQ0ksTUFBTixHQUFlLENBQTlCLEVBQWlDQyxDQUFDLEdBQUdGLENBQUMsS0FBSyxDQUFoRCxFQUNLRCxDQUFDLElBQUlDLENBRFYsRUFFS0UsQ0FBQyxHQUFJSCxDQUFDLEdBQUdDLENBQUwsS0FBWSxDQUZyQixFQUdFO0FBQ0UsUUFBSUcsSUFBSSxHQUFHTixLQUFLLENBQUNLLENBQUQsQ0FBaEI7O0FBQ0EsUUFBSUMsSUFBSSxHQUFHTCxLQUFLLEdBQUdILE9BQW5CLEVBQTRCO0FBQ3hCSyxNQUFBQSxDQUFDLEdBQUdFLENBQUMsR0FBRyxDQUFSO0FBQ0gsS0FGRCxNQUdLLElBQUlDLElBQUksR0FBR0wsS0FBSyxHQUFHSCxPQUFuQixFQUE0QjtBQUM3QkksTUFBQUEsQ0FBQyxHQUFHRyxDQUFDLEdBQUcsQ0FBUjtBQUNILEtBRkksTUFHQTtBQUNELGFBQU9BLENBQVA7QUFDSDtBQUNKOztBQUNELFNBQU8sQ0FBQ0gsQ0FBUjtBQUNIOztBQUdESyxNQUFNLENBQUNDLE9BQVAsR0FBaUI7QUFDYlQsRUFBQUEsbUJBQW1CLEVBQW5CQTtBQURhLENBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBFUFNJTE9OID0gMWUtNjtcblxuLyoqXG4gKiBTZWFyY2hlcyB0aGUgZW50aXJlIHNvcnRlZCBBcnJheSBmb3IgYW4gZWxlbWVudCBhbmQgcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGVsZW1lbnQuXG4gKlxuICogQG1ldGhvZCBiaW5hcnlTZWFyY2hcbiAqIEBwYXJhbSB7bnVtYmVyW119IGFycmF5XG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWVcbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIGluZGV4IG9mIGl0ZW0gaW4gdGhlIHNvcnRlZCBBcnJheSwgaWYgaXRlbSBpcyBmb3VuZDsgb3RoZXJ3aXNlLCBhIG5lZ2F0aXZlIG51bWJlciB0aGF0IGlzIHRoZSBiaXR3aXNlIGNvbXBsZW1lbnQgb2YgdGhlIGluZGV4IG9mIHRoZSBuZXh0IGVsZW1lbnQgdGhhdCBpcyBsYXJnZXIgdGhhbiBpdGVtIG9yLCBpZiB0aGVyZSBpcyBubyBsYXJnZXIgZWxlbWVudCwgdGhlIGJpdHdpc2UgY29tcGxlbWVudCBvZiBhcnJheSdzIGxlbmd0aC5cbiAqL1xuLy8gZnVuY3Rpb24gYmluYXJ5U2VhcmNoIChhcnJheSwgdmFsdWUpIHtcbi8vICAgICBmb3IgKHZhciBsID0gMCwgaCA9IGFycmF5Lmxlbmd0aCAtIDEsIG0gPSBoID4+PiAxO1xuLy8gICAgICAgICAgbCA8PSBoO1xuLy8gICAgICAgICAgbSA9IChsICsgaCkgPj4+IDFcbi8vICAgICApIHtcbi8vICAgICAgICAgdmFyIHRlc3QgPSBhcnJheVttXTtcbi8vICAgICAgICAgaWYgKHRlc3QgPiB2YWx1ZSkge1xuLy8gICAgICAgICAgICAgaCA9IG0gLSAxO1xuLy8gICAgICAgICB9XG4vLyAgICAgICAgIGVsc2UgaWYgKHRlc3QgPCB2YWx1ZSkge1xuLy8gICAgICAgICAgICAgbCA9IG0gKyAxO1xuLy8gICAgICAgICB9XG4vLyAgICAgICAgIGVsc2Uge1xuLy8gICAgICAgICAgICAgcmV0dXJuIG07XG4vLyAgICAgICAgIH1cbi8vICAgICB9XG4vLyAgICAgcmV0dXJuIH5sO1xuLy8gfVxuXG4vKipcbiAqIFNlYXJjaGVzIHRoZSBlbnRpcmUgc29ydGVkIEFycmF5IGZvciBhbiBlbGVtZW50IGFuZCByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZWxlbWVudC5cbiAqIEl0IGFjY2VwdHMgaXRlcmF0ZWUgd2hpY2ggaXMgaW52b2tlZCBmb3IgdmFsdWUgYW5kIGVhY2ggZWxlbWVudCBvZiBhcnJheSB0byBjb21wdXRlIHRoZWlyIHNvcnQgcmFua2luZy5cbiAqIFRoZSBpdGVyYXRlZSBpcyBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50OiAodmFsdWUpLlxuICpcbiAqIEBtZXRob2QgYmluYXJ5U2VhcmNoQnlcbiAqIEBwYXJhbSB7bnVtYmVyW119IGFycmF5XG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGl0ZXJhdGVlIC0gdGhlIGl0ZXJhdGVlIGludm9rZWQgcGVyIGVsZW1lbnRcbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIGluZGV4IG9mIGl0ZW0gaW4gdGhlIHNvcnRlZCBBcnJheSwgaWYgaXRlbSBpcyBmb3VuZDsgb3RoZXJ3aXNlLCBhIG5lZ2F0aXZlIG51bWJlciB0aGF0IGlzIHRoZSBiaXR3aXNlIGNvbXBsZW1lbnQgb2YgdGhlIGluZGV4IG9mIHRoZSBuZXh0IGVsZW1lbnQgdGhhdCBpcyBsYXJnZXIgdGhhbiBpdGVtIG9yLCBpZiB0aGVyZSBpcyBubyBsYXJnZXIgZWxlbWVudCwgdGhlIGJpdHdpc2UgY29tcGxlbWVudCBvZiBhcnJheSdzIGxlbmd0aC5cbiAqL1xuLy8gZnVuY3Rpb24gYmluYXJ5U2VhcmNoQnkgKGFycmF5LCB2YWx1ZSwgaXRlcmF0ZWUpIHtcbi8vICAgICBmb3IgKHZhciBsID0gMCwgaCA9IGFycmF5Lmxlbmd0aCAtIDEsIG0gPSBoID4+PiAxO1xuLy8gICAgICAgICAgbCA8PSBoO1xuLy8gICAgICAgICAgbSA9IChsICsgaCkgPj4+IDFcbi8vICAgICApIHtcbi8vICAgICAgICAgdmFyIHRlc3QgPSBpdGVyYXRlZShhcnJheVttXSk7XG4vLyAgICAgICAgIGlmICh0ZXN0ID4gdmFsdWUpIHtcbi8vICAgICAgICAgICAgIGggPSBtIC0gMTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICBlbHNlIGlmICh0ZXN0IDwgdmFsdWUpIHtcbi8vICAgICAgICAgICAgIGwgPSBtICsgMTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICBlbHNlIHtcbi8vICAgICAgICAgICAgIHJldHVybiBtO1xuLy8gICAgICAgICB9XG4vLyAgICAgfVxuLy8gICAgIHJldHVybiB+bDtcbi8vIH1cblxuZnVuY3Rpb24gYmluYXJ5U2VhcmNoRXBzaWxvbiAoYXJyYXksIHZhbHVlKSB7XG4gICAgZm9yICh2YXIgbCA9IDAsIGggPSBhcnJheS5sZW5ndGggLSAxLCBtID0gaCA+Pj4gMTtcbiAgICAgICAgIGwgPD0gaDtcbiAgICAgICAgIG0gPSAobCArIGgpID4+PiAxXG4gICAgKSB7XG4gICAgICAgIHZhciB0ZXN0ID0gYXJyYXlbbV07XG4gICAgICAgIGlmICh0ZXN0ID4gdmFsdWUgKyBFUFNJTE9OKSB7XG4gICAgICAgICAgICBoID0gbSAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGVzdCA8IHZhbHVlIC0gRVBTSUxPTikge1xuICAgICAgICAgICAgbCA9IG0gKyAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIH5sO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGJpbmFyeVNlYXJjaEVwc2lsb25cbn07XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==