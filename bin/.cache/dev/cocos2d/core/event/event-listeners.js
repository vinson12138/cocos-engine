
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/event/event-listeners.js';
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
var js = cc.js;

var CallbacksInvoker = require('../platform/callbacks-invoker'); // Extends CallbacksInvoker to handle and invoke event callbacks.


function EventListeners() {
  CallbacksInvoker.call(this);
}

js.extend(EventListeners, CallbacksInvoker);

EventListeners.prototype.emit = function (event, captureListeners) {
  var key = event.type;
  var list = this._callbackTable[key];

  if (list) {
    var rootInvoker = !list.isInvoking;
    list.isInvoking = true;
    var infos = list.callbackInfos;

    for (var i = 0, len = infos.length; i < len; ++i) {
      var info = infos[i];

      if (info && info.callback) {
        info.callback.call(info.target, event, captureListeners);

        if (event._propagationImmediateStopped) {
          break;
        }
      }
    }

    if (rootInvoker) {
      list.isInvoking = false;

      if (list.containCanceled) {
        list.purgeCanceled();
      }
    }
  }
};

module.exports = EventListeners;

if (CC_TEST) {
  cc._Test.EventListeners = EventListeners;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2V2ZW50L2V2ZW50LWxpc3RlbmVycy5qcyJdLCJuYW1lcyI6WyJqcyIsImNjIiwiQ2FsbGJhY2tzSW52b2tlciIsInJlcXVpcmUiLCJFdmVudExpc3RlbmVycyIsImNhbGwiLCJleHRlbmQiLCJwcm90b3R5cGUiLCJlbWl0IiwiZXZlbnQiLCJjYXB0dXJlTGlzdGVuZXJzIiwia2V5IiwidHlwZSIsImxpc3QiLCJfY2FsbGJhY2tUYWJsZSIsInJvb3RJbnZva2VyIiwiaXNJbnZva2luZyIsImluZm9zIiwiY2FsbGJhY2tJbmZvcyIsImkiLCJsZW4iLCJsZW5ndGgiLCJpbmZvIiwiY2FsbGJhY2siLCJ0YXJnZXQiLCJfcHJvcGFnYXRpb25JbW1lZGlhdGVTdG9wcGVkIiwiY29udGFpbkNhbmNlbGVkIiwicHVyZ2VDYW5jZWxlZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJDQ19URVNUIiwiX1Rlc3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLEVBQUUsR0FBR0MsRUFBRSxDQUFDRCxFQUFkOztBQUNBLElBQU1FLGdCQUFnQixHQUFHQyxPQUFPLENBQUMsK0JBQUQsQ0FBaEMsRUFFQTs7O0FBQ0EsU0FBU0MsY0FBVCxHQUEyQjtBQUN2QkYsRUFBQUEsZ0JBQWdCLENBQUNHLElBQWpCLENBQXNCLElBQXRCO0FBQ0g7O0FBQ0RMLEVBQUUsQ0FBQ00sTUFBSCxDQUFVRixjQUFWLEVBQTBCRixnQkFBMUI7O0FBRUFFLGNBQWMsQ0FBQ0csU0FBZixDQUF5QkMsSUFBekIsR0FBZ0MsVUFBVUMsS0FBVixFQUFpQkMsZ0JBQWpCLEVBQW1DO0FBQy9ELE1BQUlDLEdBQUcsR0FBR0YsS0FBSyxDQUFDRyxJQUFoQjtBQUNBLE1BQU1DLElBQUksR0FBRyxLQUFLQyxjQUFMLENBQW9CSCxHQUFwQixDQUFiOztBQUNBLE1BQUlFLElBQUosRUFBVTtBQUNOLFFBQUlFLFdBQVcsR0FBRyxDQUFDRixJQUFJLENBQUNHLFVBQXhCO0FBQ0FILElBQUFBLElBQUksQ0FBQ0csVUFBTCxHQUFrQixJQUFsQjtBQUVBLFFBQU1DLEtBQUssR0FBR0osSUFBSSxDQUFDSyxhQUFuQjs7QUFDQSxTQUFLLElBQUlDLENBQUMsR0FBRyxDQUFSLEVBQVdDLEdBQUcsR0FBR0gsS0FBSyxDQUFDSSxNQUE1QixFQUFvQ0YsQ0FBQyxHQUFHQyxHQUF4QyxFQUE2QyxFQUFFRCxDQUEvQyxFQUFrRDtBQUM5QyxVQUFNRyxJQUFJLEdBQUdMLEtBQUssQ0FBQ0UsQ0FBRCxDQUFsQjs7QUFDQSxVQUFJRyxJQUFJLElBQUlBLElBQUksQ0FBQ0MsUUFBakIsRUFBMkI7QUFDdkJELFFBQUFBLElBQUksQ0FBQ0MsUUFBTCxDQUFjbEIsSUFBZCxDQUFtQmlCLElBQUksQ0FBQ0UsTUFBeEIsRUFBZ0NmLEtBQWhDLEVBQXVDQyxnQkFBdkM7O0FBQ0EsWUFBSUQsS0FBSyxDQUFDZ0IsNEJBQVYsRUFBd0M7QUFDcEM7QUFDSDtBQUNKO0FBQ0o7O0FBRUQsUUFBSVYsV0FBSixFQUFpQjtBQUNiRixNQUFBQSxJQUFJLENBQUNHLFVBQUwsR0FBa0IsS0FBbEI7O0FBQ0EsVUFBSUgsSUFBSSxDQUFDYSxlQUFULEVBQTBCO0FBQ3RCYixRQUFBQSxJQUFJLENBQUNjLGFBQUw7QUFDSDtBQUNKO0FBQ0o7QUFDSixDQXpCRDs7QUEyQkFDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnpCLGNBQWpCOztBQUNBLElBQUkwQixPQUFKLEVBQWE7QUFDVDdCLEVBQUFBLEVBQUUsQ0FBQzhCLEtBQUgsQ0FBUzNCLGNBQVQsR0FBMEJBLGNBQTFCO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IGpzID0gY2MuanM7XG5jb25zdCBDYWxsYmFja3NJbnZva2VyID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vY2FsbGJhY2tzLWludm9rZXInKTtcblxuLy8gRXh0ZW5kcyBDYWxsYmFja3NJbnZva2VyIHRvIGhhbmRsZSBhbmQgaW52b2tlIGV2ZW50IGNhbGxiYWNrcy5cbmZ1bmN0aW9uIEV2ZW50TGlzdGVuZXJzICgpIHtcbiAgICBDYWxsYmFja3NJbnZva2VyLmNhbGwodGhpcyk7XG59XG5qcy5leHRlbmQoRXZlbnRMaXN0ZW5lcnMsIENhbGxiYWNrc0ludm9rZXIpO1xuXG5FdmVudExpc3RlbmVycy5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIChldmVudCwgY2FwdHVyZUxpc3RlbmVycykge1xuICAgIGxldCBrZXkgPSBldmVudC50eXBlO1xuICAgIGNvbnN0IGxpc3QgPSB0aGlzLl9jYWxsYmFja1RhYmxlW2tleV07XG4gICAgaWYgKGxpc3QpIHtcbiAgICAgICAgbGV0IHJvb3RJbnZva2VyID0gIWxpc3QuaXNJbnZva2luZztcbiAgICAgICAgbGlzdC5pc0ludm9raW5nID0gdHJ1ZTtcblxuICAgICAgICBjb25zdCBpbmZvcyA9IGxpc3QuY2FsbGJhY2tJbmZvcztcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGluZm9zLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBpbmZvID0gaW5mb3NbaV07XG4gICAgICAgICAgICBpZiAoaW5mbyAmJiBpbmZvLmNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaW5mby5jYWxsYmFjay5jYWxsKGluZm8udGFyZ2V0LCBldmVudCwgY2FwdHVyZUxpc3RlbmVycyk7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50Ll9wcm9wYWdhdGlvbkltbWVkaWF0ZVN0b3BwZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJvb3RJbnZva2VyKSB7XG4gICAgICAgICAgICBsaXN0LmlzSW52b2tpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChsaXN0LmNvbnRhaW5DYW5jZWxlZCkge1xuICAgICAgICAgICAgICAgIGxpc3QucHVyZ2VDYW5jZWxlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudExpc3RlbmVycztcbmlmIChDQ19URVNUKSB7XG4gICAgY2MuX1Rlc3QuRXZlbnRMaXN0ZW5lcnMgPSBFdmVudExpc3RlbmVycztcbn1cbiJdLCJzb3VyY2VSb290IjoiLyJ9