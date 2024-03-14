
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/asset-manager/download-file.js';
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

function downloadFile(url, options, onProgress, onComplete) {
  var _parseParameters = parseParameters(options, onProgress, onComplete),
      options = _parseParameters.options,
      onProgress = _parseParameters.onProgress,
      onComplete = _parseParameters.onComplete;

  var xhr = new XMLHttpRequest(),
      errInfo = 'download failed: ' + url + ', status: ';
  xhr.open('GET', url, true);
  if (options.responseType !== undefined) xhr.responseType = options.responseType;
  if (options.withCredentials !== undefined) xhr.withCredentials = options.withCredentials;
  if (options.mimeType !== undefined && xhr.overrideMimeType) xhr.overrideMimeType(options.mimeType);
  if (options.timeout !== undefined) xhr.timeout = options.timeout;

  if (options.header) {
    for (var header in options.header) {
      xhr.setRequestHeader(header, options.header[header]);
    }
  }

  xhr.onload = function () {
    if (xhr.status === 200 || xhr.status === 0) {
      onComplete && onComplete(null, xhr.response);
    } else {
      onComplete && onComplete(new Error(errInfo + xhr.status + '(no response)'));
    }
  };

  if (onProgress) {
    xhr.onprogress = function (e) {
      if (e.lengthComputable) {
        onProgress(e.loaded, e.total);
      }
    };
  }

  xhr.onerror = function () {
    onComplete && onComplete(new Error(errInfo + xhr.status + '(error)'));
  };

  xhr.ontimeout = function () {
    onComplete && onComplete(new Error(errInfo + xhr.status + '(time out)'));
  };

  xhr.onabort = function () {
    onComplete && onComplete(new Error(errInfo + xhr.status + '(abort)'));
  };

  xhr.send(null);
  return xhr;
}

module.exports = downloadFile;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0LW1hbmFnZXIvZG93bmxvYWQtZmlsZS5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwicGFyc2VQYXJhbWV0ZXJzIiwiZG93bmxvYWRGaWxlIiwidXJsIiwib3B0aW9ucyIsIm9uUHJvZ3Jlc3MiLCJvbkNvbXBsZXRlIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJlcnJJbmZvIiwib3BlbiIsInJlc3BvbnNlVHlwZSIsInVuZGVmaW5lZCIsIndpdGhDcmVkZW50aWFscyIsIm1pbWVUeXBlIiwib3ZlcnJpZGVNaW1lVHlwZSIsInRpbWVvdXQiLCJoZWFkZXIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwib25sb2FkIiwic3RhdHVzIiwicmVzcG9uc2UiLCJFcnJvciIsIm9ucHJvZ3Jlc3MiLCJlIiwibGVuZ3RoQ29tcHV0YWJsZSIsImxvYWRlZCIsInRvdGFsIiwib25lcnJvciIsIm9udGltZW91dCIsIm9uYWJvcnQiLCJzZW5kIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtlQUM0QkEsT0FBTyxDQUFDLGFBQUQ7SUFBM0JDLDJCQUFBQTs7QUFFUixTQUFTQyxZQUFULENBQXVCQyxHQUF2QixFQUE0QkMsT0FBNUIsRUFBcUNDLFVBQXJDLEVBQWlEQyxVQUFqRCxFQUE2RDtBQUFBLHlCQUNmTCxlQUFlLENBQUNHLE9BQUQsRUFBVUMsVUFBVixFQUFzQkMsVUFBdEIsQ0FEQTtBQUFBLE1BQ25ERixPQURtRCxvQkFDbkRBLE9BRG1EO0FBQUEsTUFDMUNDLFVBRDBDLG9CQUMxQ0EsVUFEMEM7QUFBQSxNQUM5QkMsVUFEOEIsb0JBQzlCQSxVQUQ4Qjs7QUFHekQsTUFBSUMs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KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5jb25zdCB7IHBhcnNlUGFyYW1ldGVycyB9ID0gcmVxdWlyZSgnLi91dGlsaXRpZXMnKTtcblxuZnVuY3Rpb24gZG93bmxvYWRGaWxlICh1cmwsIG9wdGlvbnMsIG9uUHJvZ3Jlc3MsIG9uQ29tcGxldGUpIHtcbiAgICB2YXIgeyBvcHRpb25zLCBvblByb2dyZXNzLCBvbkNvbXBsZXRlIH0gPSBwYXJzZVBhcmFtZXRlcnMob3B0aW9ucywgb25Qcm9ncmVzcywgb25Db21wbGV0ZSk7XG5cbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCksIGVyckluZm8gPSAnZG93bmxvYWQgZmFpbGVkOiAnICsgdXJsICsgJywgc3RhdHVzOiAnO1xuXG4gICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG5cbiAgICBpZiAob3B0aW9ucy5yZXNwb25zZVR5cGUgIT09IHVuZGVmaW5lZCkgeGhyLnJlc3BvbnNlVHlwZSA9IG9wdGlvbnMucmVzcG9uc2VUeXBlO1xuICAgIGlmIChvcHRpb25zLndpdGhDcmVkZW50aWFscyAhPT0gdW5kZWZpbmVkKSB4aHIud2l0aENyZWRlbnRpYWxzID0gb3B0aW9ucy53aXRoQ3JlZGVudGlhbHM7XG4gICAgaWYgKG9wdGlvbnMubWltZVR5cGUgIT09IHVuZGVmaW5lZCAmJiB4aHIub3ZlcnJpZGVNaW1lVHlwZSApIHhoci5vdmVycmlkZU1pbWVUeXBlKG9wdGlvbnMubWltZVR5cGUpO1xuICAgIGlmIChvcHRpb25zLnRpbWVvdXQgIT09IHVuZGVmaW5lZCkgeGhyLnRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQ7XG5cbiAgICBpZiAob3B0aW9ucy5oZWFkZXIpIHtcbiAgICAgICAgZm9yICh2YXIgaGVhZGVyIGluIG9wdGlvbnMuaGVhZGVyKSB7XG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIG9wdGlvbnMuaGVhZGVyW2hlYWRlcl0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCB4aHIuc3RhdHVzID09PSAyMDAgfHwgeGhyLnN0YXR1cyA9PT0gMCApIHtcbiAgICAgICAgICAgIG9uQ29tcGxldGUgJiYgb25Db21wbGV0ZShudWxsLCB4aHIucmVzcG9uc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb25Db21wbGV0ZSAmJiBvbkNvbXBsZXRlKG5ldyBFcnJvcihlcnJJbmZvICsgeGhyLnN0YXR1cyArICcobm8gcmVzcG9uc2UpJykpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgaWYgKG9uUHJvZ3Jlc3MpIHtcbiAgICAgICAgeGhyLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgaWYgKGUubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgICAgICAgICAgIG9uUHJvZ3Jlc3MoZS5sb2FkZWQsIGUudG90YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKXtcbiAgICAgICAgb25Db21wbGV0ZSAmJiBvbkNvbXBsZXRlKG5ldyBFcnJvcihlcnJJbmZvICsgeGhyLnN0YXR1cyArICcoZXJyb3IpJykpO1xuICAgIH07XG5cbiAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgb25Db21wbGV0ZSAmJiBvbkNvbXBsZXRlKG5ldyBFcnJvcihlcnJJbmZvICsgeGhyLnN0YXR1cyArICcodGltZSBvdXQpJykpO1xuICAgIH07XG5cbiAgICB4aHIub25hYm9ydCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIG9uQ29tcGxldGUgJiYgb25Db21wbGV0ZShuZXcgRXJyb3IoZXJySW5mbyArIHhoci5zdGF0dXMgKyAnKGFib3J0KScpKTtcbiAgICB9O1xuXG4gICAgeGhyLnNlbmQobnVsbCk7XG4gICAgXG4gICAgcmV0dXJuIHhocjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb3dubG9hZEZpbGU7Il0sInNvdXJjZVJvb3QiOiIvIn0=