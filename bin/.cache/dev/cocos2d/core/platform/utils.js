
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/utils.js';
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
// TODO - merge with misc.js
var js = require('./js');

module.exports = {
  contains: function contains(refNode, otherNode) {
    if (typeof refNode.contains == 'function') {
      return refNode.contains(otherNode);
    } else if (typeof refNode.compareDocumentPosition == 'function') {
      return !!(refNode.compareDocumentPosition(otherNode) & 16);
    } else {
      var node = otherNode.parentNode;

      if (node) {
        do {
          if (node === refNode) {
            return true;
          } else {
            node = node.parentNode;
          }
        } while (node !== null);
      }

      return false;
    }
  },
  isDomNode: typeof window === 'object' && (typeof Node === 'function' ? function (obj) {
    // If "TypeError: Right-hand side of 'instanceof' is not callback" is thrown,
    // it should because window.Node was overwritten.
    return obj instanceof Node;
  } : function (obj) {
    return obj && typeof obj === 'object' && typeof obj.nodeType === 'number' && typeof obj.nodeName === 'string';
  }),
  callInNextTick: CC_EDITOR ? function (callback, p1, p2) {
    if (callback) {
      process.nextTick(function () {
        callback(p1, p2);
      });
    }
  } : function (callback, p1, p2) {
    if (callback) {
      setTimeout(function () {
        callback(p1, p2);
      }, 0);
    }
  }
};

if (CC_DEV) {
  ///**
  // * @param {Object} obj
  // * @return {Boolean} is {} ?
  // */
  module.exports.isPlainEmptyObj_DEV = function (obj) {
    if (!obj || obj.constructor !== Object) {
      return false;
    }

    return js.isEmptyObject(obj);
  };

  module.exports.cloneable_DEV = function (obj) {
    return obj && typeof obj.clone === 'function' && (obj.constructor && obj.constructor.prototype.hasOwnProperty('clone') || obj.hasOwnProperty('clone'));
  };
}

if (CC_TEST) {
  // editor mocks using in unit tests
  if (typeof Editor === 'undefined') {
    window.Editor = {
      UuidUtils: {
        NonUuidMark: '.',
        uuid: function uuid() {
          return '' + (new Date().getTime() + Math.random());
        }
      }
    };
  }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BsYXRmb3JtL3V0aWxzLmpzIl0sIm5hbWVzIjpbImpzIiwicmVxdWlyZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJjb250YWlucyIsInJlZk5vZGUiLCJvdGhlck5vZGUiLCJjb21wYXJlRG9jdW1lbnRQb3NpdGlvbiIsIm5vZGUiLCJwYXJlbnROb2RlIiwiaXNEb21Ob2RlIiwid2luZG93IiwiTm9kZSIsIm9iaiIsIm5vZGVUeXBlIiwibm9kZU5hbWUiLCJjYWxsSW5OZXh0VGljayIsIkNDX0VESVRPUiIsImNhbGxiYWNrIiwicDEiLCJwMiIsInByb2Nlc3MiLCJuZXh0VGljayIsInNldFRpbWVvdXQiLCJDQ19ERVYiLCJpc1BsYWluRW1wdHlPYmpfREVWIiwiY29uc3RydWN0b3IiLCJPYmplY3QiLCJpc0VtcHR5T2JqZWN0IiwiY2xvbmVhYmxlX0RFViIsImNsb25lIiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJDQ19URVNUIiwiRWRpdG9yIiwiVXVpZFV0aWxzIiwiTm9uVXVpZE1hcmsiLCJ1dWlkIiwiRGF0ZSIsImdldFRpbWUiLCJNYXRoIiwicmFuZG9tIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBLElBQU1BLEVBQUUsR0FBR0MsT0FBTyxDQUFDLE1BQUQsQ0FBbEI7O0FBRUFDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQUNiQyxFQUFBQSxRQUFRLEVBQUUsa0JBQVVDLE9BQVYsRUFBbUJDLFNBQW5CLEVBQThCO0FBQ3BDLFFBQUcsT0FBT0QsT0FBTyxDQUFDRCxRQUFmLElBQTJCLFVBQTlCLEVBQXlDO0FBQ3JDLGFBQU9DLE9BQU8sQ0FBQ0QsUUFBUixD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QSxJQUFJLEVBQUUsZ0JBQVk7QUFDZCxpQkFBTyxNQUFPLElBQUlDLElBQUosRUFBRCxDQUFhQyxPQUFiLEtBQXlCQyxJQUFJLENBQUNDLE1BQUwsRUFBL0IsQ0FBUDtBQUNIO0FBSk07QUFEQyxLQUFoQjtBQVFIO0FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIFRPRE8gLSBtZXJnZSB3aXRoIG1pc2MuanNcbmNvbnN0IGpzID0gcmVxdWlyZSgnLi9qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjb250YWluczogZnVuY3Rpb24gKHJlZk5vZGUsIG90aGVyTm9kZSkge1xuICAgICAgICBpZih0eXBlb2YgcmVmTm9kZS5jb250YWlucyA9PSAnZnVuY3Rpb24nKXtcbiAgICAgICAgICAgIHJldHVybiByZWZOb2RlLmNvbnRhaW5zKG90aGVyTm9kZSk7XG4gICAgICAgIH1lbHNlIGlmKHR5cGVvZiByZWZOb2RlLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uID09ICdmdW5jdGlvbicgKSB7XG4gICAgICAgICAgICByZXR1cm4gISEocmVmTm9kZS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihvdGhlck5vZGUpICYgMTYpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IG90aGVyTm9kZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlID09PSByZWZOb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IHdoaWxlIChub2RlICE9PW51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGlzRG9tTm9kZTogdHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcgJiYgKHR5cGVvZiBOb2RlID09PSAnZnVuY3Rpb24nID9cbiAgICAgICAgZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgLy8gSWYgXCJUeXBlRXJyb3I6IFJpZ2h0LWhhbmQgc2lkZSBvZiAnaW5zdGFuY2VvZicgaXMgbm90IGNhbGxiYWNrXCIgaXMgdGhyb3duLFxuICAgICAgICAgICAgLy8gaXQgc2hvdWxkIGJlY2F1c2Ugd2luZG93Lk5vZGUgd2FzIG92ZXJ3cml0dGVuLlxuICAgICAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIE5vZGU7XG4gICAgICAgIH0gOlxuICAgICAgICBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqICYmXG4gICAgICAgICAgICAgICAgICAgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAgICAgICAgICB0eXBlb2Ygb2JqLm5vZGVUeXBlID09PSAnbnVtYmVyJyAmJlxuICAgICAgICAgICAgICAgICAgIHR5cGVvZiBvYmoubm9kZU5hbWUgPT09ICdzdHJpbmcnO1xuICAgICAgICB9XG4gICAgKSxcblxuICAgIGNhbGxJbk5leHRUaWNrOiBDQ19FRElUT1IgP1xuICAgICAgICBmdW5jdGlvbiAoY2FsbGJhY2ssIHAxLCBwMikge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHAxLCBwMik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgOlxuICAgICAgICAoXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZ1bmN0aW9uIChjYWxsYmFjaywgcDEsIHAyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2socDEsIHAyKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApXG59O1xuXG5pZiAoQ0NfREVWKSB7XG4gICAgLy8vKipcbiAgICAvLyAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAgICAvLyAqIEByZXR1cm4ge0Jvb2xlYW59IGlzIHt9ID9cbiAgICAvLyAqL1xuICAgIG1vZHVsZS5leHBvcnRzLmlzUGxhaW5FbXB0eU9ial9ERVYgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIGlmICghb2JqIHx8IG9iai5jb25zdHJ1Y3RvciAhPT0gT2JqZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICBcbiAgICAgICAgcmV0dXJuIGpzLmlzRW1wdHlPYmplY3Qob2JqKTtcbiAgICB9O1xuICAgIG1vZHVsZS5leHBvcnRzLmNsb25lYWJsZV9ERVYgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogJiZcbiAgICAgICAgICAgICAgIHR5cGVvZiBvYmouY2xvbmUgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgICAgICAgICggKG9iai5jb25zdHJ1Y3RvciAmJiBvYmouY29uc3RydWN0b3IucHJvdG90eXBlLmhhc093blByb3BlcnR5KCdjbG9uZScpKSB8fCBvYmouaGFzT3duUHJvcGVydHkoJ2Nsb25lJykgKTtcbiAgICB9O1xufVxuXG5pZiAoQ0NfVEVTVCkge1xuICAgIC8vIGVkaXRvciBtb2NrcyB1c2luZyBpbiB1bml0IHRlc3RzXG4gICAgaWYgKHR5cGVvZiBFZGl0b3IgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHdpbmRvdy5FZGl0b3IgPSB7XG4gICAgICAgICAgICBVdWlkVXRpbHM6IHtcbiAgICAgICAgICAgICAgICBOb25VdWlkTWFyazogJy4nLFxuICAgICAgICAgICAgICAgIHV1aWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnICsgKChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgKyBNYXRoLnJhbmRvbSgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvIn0=