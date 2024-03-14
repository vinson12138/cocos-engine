
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/asset-manager/download-dom-audio.js';
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
var __audioSupport = cc.sys.__audioSupport;

var _require = require('./utilities'),
    parseParameters = _require.parseParameters;

function downloadDomAudio(url, options, onComplete) {
  var _parseParameters = parseParameters(options, undefined, onComplete),
      options = _parseParameters.options,
      onComplete = _parseParameters.onComplete;

  var dom = document.createElement('audio');
  dom.src = url;

  var clearEvent = function clearEvent() {
    clearTimeout(timer);
    dom.removeEventListener("canplaythrough", success, false);
    dom.removeEventListener("error", failure, false);
    if (__audioSupport.USE_LOADER_EVENT) dom.removeEventListener(__audioSupport.USE_LOADER_EVENT, success, false);
  };

  var timer = setTimeout(function () {
    if (dom.readyState === 0) failure();else success();
  }, 8000);

  var success = function success() {
    clearEvent();
    onComplete && onComplete(null, dom);
  };

  var failure = function failure() {
    clearEvent();
    var message = 'load audio failure - ' + url;
    cc.log(message);
    onComplete && onComplete(new Error(message));
  };

  dom.addEventListener("canplaythrough", success, false);
  dom.addEventListener("error", failure, false);
  if (__audioSupport.USE_LOADER_EVENT) dom.addEventListener(__audioSupport.USE_LOADER_EVENT, success, false);
  return dom;
}

module.exports = downloadDomAudio;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0LW1hbmFnZXIvZG93bmxvYWQtZG9tLWF1ZGlvLmpzIl0sIm5hbWVzIjpbIl9fYXVkaW9TdXBwb3J0IiwiY2MiLCJzeXMiLCJyZXF1aXJlIiwicGFyc2VQYXJhbWV0ZXJzIiwiZG93bmxvYWREb21BdWRpbyIsInVybCIsIm9wdGlvbnMiLCJvbkNvbXBsZXRlIiwidW5kZWZpbmVkIiwiZG9tIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic3JjIiwiY2xlYXJFdmVudCIsImNsZWFyVGltZW91dCIsInRpbWVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInN1Y2Nlc3MiLCJmYWlsdXJlIiwiVVNFX0xPQURFUl9FVkVOVCIsInNldFRpbWVvdXQiLCJyZWFkeVN0YXRlIiwibWVzc2FnZSIsImxvZyIsIkVycm9yIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJQSxjQUFjLEdBQUdDLEVBQUUsQ0FBQ0MsR0FBSCxDQUFPRixjQUE1Qjs7ZUFDNEJHLE9BQU8sQ0FBQyxhQUFEO0lBQTNCQywyQkFBQUE7O0FBRVIsU0FBU0MsZ0JBQVQsQ0FBMkJDLEdBQTNCLEVBQWdDQyxPQUFoQyxFQUF5Q0MsVUFBekMsRUFBcUQ7QUFBQSx5QkFDbkJKLGVBQWUsQ0FBQ0csT0FBRCxFQUFVRSxTQUFWLEVBQXFCRCxVQUFyQixDQURJO0FBQUEsTUFDM0NELE9BRDJDLG9CQUMzQ0EsT0FEMkM7QUFBQSxNQUNsQ0MsVUFEa0Msb0JBQ2xDQSxVQURrQzs7QUFHakQsTUFBSUUsR0FBRyxHQUFHQyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBVjtBQUNBRixFQUFBQSxHQUFHLENBQUNHLEdBQUosR0FBVVAsR0FBVjs7QUFFQSxNQUFJUSxVQUFVLEdBQUcsU0FBYkEsVUFBYSxHQUFZO0FBQ3pCQyxJQUFBQSxZQUFZLENBQUNDLEtBQUQsQ0FBWjtBQUNBTixJQUFBQSxHQUFHLENBQUNPLG1CQUFKLENBQXdCLGdCQUF4QixFQUEwQ0MsT0FBMUMsRUFBbUQsS0FBbkQ7QUFDQVIsSUFBQUEsR0FBRyxDQUFDTyxtQkFBSixDQUF3QixPQUF4QixFQUFpQ0UsT0FBakMsRUFBMEMsS0FBMUM7QUFDQSxRQUFHbkIsY0FBYyxDQUFDb0IsZ0JBQWxCLEVBQ0lWLEdBQUcsQ0FBQ08sbUJBQUosQ0FBd0JqQixjQUFjLENBQUNvQixnQkFBdkMsRUFBeURGLE9BQXpELEVBQWtFLEtBQWxFO0FBQ1AsR0FORDs7QUFRQSxNQUFJRixLQUFLLEdBQUdLLFVBQVUsQ0FBQyxZQUFZO0FBQy9CLFFBQUlYLEdBQUcsQ0FBQ1ksVUFBSixLQUFtQixDQUF2QixFQUNJSCxPQUFPLEdBRFgsS0FHSUQsT0FBTztBQUNkLEdBTHFCLEVBS25CLElBTG1CLENBQXRCOztBQU9BLE1BQUlBLE9BQU8sR0FBRyxTQUFWQSxPQUFVLEdBQVk7QUFDdEJKLElBQUFBLFVBQVU7QUFDVk4sSUFBQUEsVUFBVSxJQUFJQSxVQUFVLENBQUMsSUFBRCxFQUFPRSxHQUFQLENBQXhCO0FBQ0gsR0FIRDs7QUFLQSxNQUFJUyxPQUFPLEdBQUcsU0FBVkEsT0FBVSxHQUFZO0FBQ3RCTCxJQUFBQSxVQUFVO0FBQ1YsUUFBSVMsT0FBTyxHQUFHLDBCQUEwQmpCLEdBQXhDO0FBQ0FMLElBQUFBLEVBQUUsQ0FBQ3VCLEdBQUgsQ0FBT0QsT0FBUDtBQUNBZixJQUFBQSxVQUFVLElBQUlBLFVBQVUsQ0FBQyxJQUFJaUIsS0FBSixDQUFVRixPQUFWLENBQUQsQ0FBeEI7QUFDSCxHQUxEOztBQU9BYixFQUFBQSxHQUFHLENBQUNnQixnQkFBSixDQUFxQixnQkFBckIsRUFBdUNSLE9BQXZDLEVBQWdELEtBQWhEO0FBQ0FSLEVBQUFBLEdBQUcsQ0FBQ2dCLGdCQUFKLENBQXFCLE9BQXJCLEVBQThCUCxPQUE5QixFQUF1QyxLQUF2QztBQUNBLE1BQUduQixjQUFjLENBQUNvQixnQkFBbEIsRUFDSVYsR0FBRyxDQUFDZ0IsZ0JBQUosQ0FBcUIxQixjQUFjLENBQUNvQixnQkFBcEMsRUFBc0RGLE9BQXRELEVBQStELEtBQS9EO0FBQ0osU0FBT1IsR0FBUDtBQUNIOztBQUVEaUIsTUFBTSxDQUFDQyxPQUFQLEdBQWlCdkIsZ0JBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xudmFyIF9fYXVkaW9TdXBwb3J0ID0gY2Muc3lzLl9fYXVkaW9TdXBwb3J0O1xuY29uc3QgeyBwYXJzZVBhcmFtZXRlcnMgfSA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzJyk7XG5cbmZ1bmN0aW9uIGRvd25sb2FkRG9tQXVkaW8gKHVybCwgb3B0aW9ucywgb25Db21wbGV0ZSkge1xuICAgIHZhciB7IG9wdGlvbnMsIG9uQ29tcGxldGUgfSA9IHBhcnNlUGFyYW1ldGVycyhvcHRpb25zLCB1bmRlZmluZWQsIG9uQ29tcGxldGUpO1xuXG4gICAgdmFyIGRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG4gICAgZG9tLnNyYyA9IHVybDtcblxuICAgIHZhciBjbGVhckV2ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICBkb20ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNhbnBsYXl0aHJvdWdoXCIsIHN1Y2Nlc3MsIGZhbHNlKTtcbiAgICAgICAgZG9tLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBmYWlsdXJlLCBmYWxzZSk7XG4gICAgICAgIGlmKF9fYXVkaW9TdXBwb3J0LlVTRV9MT0FERVJfRVZFTlQpXG4gICAgICAgICAgICBkb20ucmVtb3ZlRXZlbnRMaXN0ZW5lcihfX2F1ZGlvU3VwcG9ydC5VU0VfTE9BREVSX0VWRU5ULCBzdWNjZXNzLCBmYWxzZSk7XG4gICAgfTtcblxuICAgIHZhciB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoZG9tLnJlYWR5U3RhdGUgPT09IDApXG4gICAgICAgICAgICBmYWlsdXJlKCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN1Y2Nlc3MoKTtcbiAgICB9LCA4MDAwKTtcblxuICAgIHZhciBzdWNjZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjbGVhckV2ZW50KCk7XG4gICAgICAgIG9uQ29tcGxldGUgJiYgb25Db21wbGV0ZShudWxsLCBkb20pO1xuICAgIH07XG4gICAgXG4gICAgdmFyIGZhaWx1cmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNsZWFyRXZlbnQoKTtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSAnbG9hZCBhdWRpbyBmYWlsdXJlIC0gJyArIHVybDtcbiAgICAgICAgY2MubG9nKG1lc3NhZ2UpO1xuICAgICAgICBvbkNvbXBsZXRlICYmIG9uQ29tcGxldGUobmV3IEVycm9yKG1lc3NhZ2UpKTtcbiAgICB9O1xuXG4gICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJjYW5wbGF5dGhyb3VnaFwiLCBzdWNjZXNzLCBmYWxzZSk7XG4gICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBmYWlsdXJlLCBmYWxzZSk7XG4gICAgaWYoX19hdWRpb1N1cHBvcnQuVVNFX0xPQURFUl9FVkVOVClcbiAgICAgICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoX19hdWRpb1N1cHBvcnQuVVNFX0xPQURFUl9FVkVOVCwgc3VjY2VzcywgZmFsc2UpO1xuICAgIHJldHVybiBkb207XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZG93bmxvYWREb21BdWRpbzsiXSwic291cmNlUm9vdCI6Ii8ifQ==