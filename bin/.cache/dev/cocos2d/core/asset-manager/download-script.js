
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/asset-manager/download-script.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
var _require = require('./utilities'),
    parseParameters = _require.parseParameters;

var downloaded = {};

function downloadScript(url, options, onComplete) {
  var _parseParameters = parseParameters(options, undefined, onComplete),
      options = _parseParameters.options,
      onComplete = _parseParameters.onComplete; // no need to load script again


  if (downloaded[url]) {
    return onComplete && onComplete(null);
  }

  var d = document,
      s = document.createElement('script');

  if (window.location.protocol !== 'file:') {
    s.crossOrigin = 'anonymous';
  }

  s.async = options.async;
  s.src = url;

  function loadHandler() {
    s.parentNode.removeChild(s);
    s.removeEventListener('load', loadHandler, false);
    s.removeEventListener('error', errorHandler, false);
    downloaded[url] = true;
    onComplete && onComplete(null);
  }

  function errorHandler() {
    s.parentNode.removeChild(s);
    s.removeEventListener('load', loadHandler, false);
    s.removeEventListener('error', errorHandler, false);
    onComplete && onComplete(new Error(cc.debug.getError(4928, url)));
  }

  s.addEventListener('load', loadHandler, false);
  s.addEventListener('error', errorHandler, false);
  d.body.appendChild(s);
}

module.exports = downloadScript;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0LW1hbmFnZXIvZG93bmxvYWQtc2NyaXB0LmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJwYXJzZVBhcmFtZXRlcnMiLCJkb3dubG9hZGVkIiwiZG93bmxvYWRTY3JpcHQiLCJ1cmwiLCJvcHRpb25zIiwib25Db21wbGV0ZSIsInVuZGVmaW5lZCIsImQiLCJkb2N1bWVudCIsInMiLCJjcmVhdGVFbGVtZW50Iiwid2luZG93IiwibG9jYXRpb24iLCJwcm90b2NvbCIsImNyb3NzT3JpZ2luIiwiYXN5bmMiLCJzcmMiLCJsb2FkSGFuZGxlciIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJlcnJvckhhbmRsZXIiLCJFcnJvciIsImNjIiwiZGVidWciLCJnZXRFcnJvciIsImFkZEV2ZW50TGlzdGVuZXIiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO2VBQzRCQSxPQUFPLENBQUMsYUFBRDtJQUEzQkMsMkJBQUFBOztBQUVSLElBQU1DLFVBQVUsR0FBRyxFQUFuQjs7QUFFQSxTQUFTQyxjQUFULENBQXlCQyxHQUF6QixFQUE4QkMsT0FBOUIsRUFBdUNDLFVBQXZDLEVBQW1EO0FBQUEseUJBQ2pCTCxlQUFlLENBQUNJLE9BQUQsRUFBVUUsU0FBVixFQUFxQkQsVUFBckIsQ0FERTtBQUFBLE1BQ3pDRCxPQUR5QyxvQkFDekNBLE9BRHlDO0FBQUEsTUFDaENDLFVBRGdDLG9CQUNoQ0EsVUFEZ0MsRUFHL0M7OztBQUNBLE1BQUlKLFVBQVUsQ0FBQ0UsR0FBRCxDQUFkLEVBQXFCO0FBQ2pCLFdBQU9FLFVBQVUsSUFBSUEsVUFBVSxDQUFDLElBQUQsQ0FBL0I7QUFDSDs7QUFFRCxNQUFJRSxDQUFDLEdBQUdDLFFBQVI7QUFBQSxNQUFrQkMsQ0FBQyxHQUFHRCxRQUFRLENBQUNFLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBdEI7O0FBRUEsTUFBSUMsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxRQUFoQixLQUE2QixPQUFqQyxFQUEwQztBQUN0Q0osSUFBQUEsQ0FBQyxDQUFDSyxXQUFGLEdBQWdCLFdBQWhCO0FBQ0g7O0FBRURMLEVBQUFBLENBQUMsQ0FBQ00sS0FBRixHQUFVWCxPQUFPLENBQUNXLEtBQWxCO0FBQ0FOLEVBQUFBLENBQUMsQ0FBQ08sR0FBRixHQUFRYixHQUFSOztBQUNBLFdBQVNjLFdBQVQsR0FBd0I7QUFDcEJSLElBQUFBLENBQUMsQ0FBQ1MsVUFBRixDQUFhQyxXQUFiLENBQXlCVixDQUF6QjtBQUNBQSxJQUFBQSxDQUFDLENBQUNXLG1CQUFGLENBQXNCLE1BQXRCLEVBQThCSCxXQUE5QixFQUEyQyxLQUEzQztBQUNBUixJQUFBQSxDQUFDLENBQUNXLG1CQUFGLENBQXNCLE9BQXRCLEVBQStCQyxZQUEvQixFQUE2QyxLQUE3QztBQUNBcEIsSUFBQUEsVUFBVSxDQUFDRSxHQUFELENBQVYsR0FBa0IsSUFBbEI7QUFDQUUsSUFBQUEsVUFBVSxJQUFJQSxVQUFVLENBQUMsSUFBRCxDQUF4QjtBQUNIOztBQUVELFdBQVNnQixZQUFULEdBQXdCO0FBQ3BCWixJQUFBQSxDQUFDLENBQUNTLFVBQUYsQ0FBYUMsV0FBYixDQUF5QlYsQ0FBekI7QUFDQUEsSUFBQUEsQ0FBQyxDQUFDVyxtQkFBRixDQUFzQixNQUF0QixFQUE4QkgsV0FBOUIsRUFBMkMsS0FBM0M7QUFDQVIsSUFBQUEsQ0FBQyxDQUFDVyxtQkFBRixDQUFzQixPQUF0QixFQUErQkMsWUFBL0IsRUFBNkMsS0FBN0M7QUFDQWhCLElBQUFBLFVBQVUsSUFBSUEsVUFBVSxDQUFDLElBQUlpQixLQUFKLENBQVVDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTQyxRQUFULENBQWtCLElBQWxCLEVBQXdCdEIsR0FBeEIsQ0FBVixDQUFELENBQXhCO0FBQ0g7O0FBRURNLEVBQUFBLENBQUMsQ0FBQ2lCLGdCQUFGLENBQW1CLE1BQW5CLEVBQTJCVCxXQUEzQixFQUF3QyxLQUF4QztBQUNBUixFQUFBQSxDQUFDLENBQUNpQixnQkFBRixDQUFtQixPQUFuQixFQUE0QkwsWUFBNUIsRUFBMEMsS0FBMUM7QUFDQWQsRUFBQUEsQ0FBQyxDQUFDb0IsSUFBRixDQUFPQyxXQUFQLENBQW1CbkIsQ0FBbkI7QUFDSDs7QUFFRG9CLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjVCLGNBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5jb25zdCB7IHBhcnNlUGFyYW1ldGVycyB9ID0gcmVxdWlyZSgnLi91dGlsaXRpZXMnKTtcblxuY29uc3QgZG93bmxvYWRlZCA9IHt9O1xuXG5mdW5jdGlvbiBkb3dubG9hZFNjcmlwdCAodXJsLCBvcHRpb25zLCBvbkNvbXBsZXRlKSB7XG4gICAgdmFyIHsgb3B0aW9ucywgb25Db21wbGV0ZSB9ID0gcGFyc2VQYXJhbWV0ZXJzKG9wdGlvbnMsIHVuZGVmaW5lZCwgb25Db21wbGV0ZSk7XG5cbiAgICAvLyBubyBuZWVkIHRvIGxvYWQgc2NyaXB0IGFnYWluXG4gICAgaWYgKGRvd25sb2FkZWRbdXJsXSkge1xuICAgICAgICByZXR1cm4gb25Db21wbGV0ZSAmJiBvbkNvbXBsZXRlKG51bGwpO1xuICAgIH1cblxuICAgIHZhciBkID0gZG9jdW1lbnQsIHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblxuICAgIGlmICh3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgIT09ICdmaWxlOicpIHtcbiAgICAgICAgcy5jcm9zc09yaWdpbiA9ICdhbm9ueW1vdXMnO1xuICAgIH1cblxuICAgIHMuYXN5bmMgPSBvcHRpb25zLmFzeW5jO1xuICAgIHMuc3JjID0gdXJsO1xuICAgIGZ1bmN0aW9uIGxvYWRIYW5kbGVyICgpIHtcbiAgICAgICAgcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHMpO1xuICAgICAgICBzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBsb2FkSGFuZGxlciwgZmFsc2UpO1xuICAgICAgICBzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3JIYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgIGRvd25sb2FkZWRbdXJsXSA9IHRydWU7XG4gICAgICAgIG9uQ29tcGxldGUgJiYgb25Db21wbGV0ZShudWxsKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlcnJvckhhbmRsZXIoKSB7XG4gICAgICAgIHMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzKTtcbiAgICAgICAgcy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgbG9hZEhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgcy5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9ySGFuZGxlciwgZmFsc2UpO1xuICAgICAgICBvbkNvbXBsZXRlICYmIG9uQ29tcGxldGUobmV3IEVycm9yKGNjLmRlYnVnLmdldEVycm9yKDQ5MjgsIHVybCkpKTtcbiAgICB9XG4gICAgXG4gICAgcy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgbG9hZEhhbmRsZXIsIGZhbHNlKTtcbiAgICBzLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3JIYW5kbGVyLCBmYWxzZSk7XG4gICAgZC5ib2R5LmFwcGVuZENoaWxkKHMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvd25sb2FkU2NyaXB0OyJdLCJzb3VyY2VSb290IjoiLyJ9