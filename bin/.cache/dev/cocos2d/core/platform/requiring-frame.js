
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/requiring-frame.js';
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
var requiringFrames = []; // the requiring frame infos

cc._RF = {
  push: function push(module, uuid, script) {
    if (script === undefined) {
      script = uuid;
      uuid = '';
    }

    requiringFrames.push({
      uuid: uuid,
      script: script,
      module: module,
      exports: module.exports,
      // original exports
      beh: null
    });
  },
  pop: function pop() {
    var frameInfo = requiringFrames.pop(); // check exports

    var module = frameInfo.module;
    var exports = module.exports;

    if (exports === frameInfo.exports) {
      for (var anyKey in exports) {
        // exported
        return;
      } // auto export component


      module.exports = exports = frameInfo.cls;
    }
  },
  peek: function peek() {
    return requiringFrames[requiringFrames.length - 1];
  }
};

if (CC_EDITOR) {
  cc._RF.reset = function () {
    requiringFrames = [];
  };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BsYXRmb3JtL3JlcXVpcmluZy1mcmFtZS5qcyJdLCJuYW1lcyI6WyJyZXF1aXJpbmdGcmFtZXMiLCJjYyIsIl9SRiIsInB1c2giLCJtb2R1bGUiLCJ1dWlkIiwic2NyaXB0IiwidW5kZWZpbmVkIiwiZXhwb3J0cyIsImJlaCIsInBvcCIsImZyYW1lSW5mbyIsImFueUtleSIsImNscyIsInBlZWsiLCJsZW5ndGgiLCJDQ19FRElUT1IiLCJyZXNldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBSUEsZUFBZSxHQUFHLEVBQXRCLEVBQTJCOztBQUUzQkMsRUFBRSxDQUFDQyxHQUFILEdBQVM7QUFDTEMsRUFBQUEsSUFBSSxFQUFFLGNBQVVDLE1BQVYsRUFBa0JDLElBQWxCLEVBQXdCQyxNQUF4QixFQUFnQztBQUNsQyxRQUFJQSxNQUFNLEtBQUtDLFNBQWYsRUFBMEI7QUFDdEJELE1BQUFBLE1BQU0sR0FBR0QsSUFBVDtBQUNBQSxNQUFBQSxJQUFJLEdBQUcsRUFBUDtBQUNIOztBQUNETCxJQUFBQSxlQUFlLENBQUNHLElBQWhCLENBQXFCO0FBQ2pCRSxNQUFBQSxJQUFJLEVBQUVBLElBRFc7QUFFakJDLE1BQUFBLE1BQU0sRUFBRUEsTUFGUztBQUdqQkYsTUFBQUEsTUFBTSxFQUFFQSxNQUhTO0FBSWpCSSxNQUFBQSxPQUFPLEVBQUVKLE1BQU0sQ0FBQ0ksT0FKQztBQUlXO0FBQzVCQyxNQUFBQSxHQUFHLEVBQUU7QUFMWSxLQUFyQjtBQU9ILEdBYkk7QUFjTEMsRUFBQUEsR0FBRyxFQUFFLGVBQVk7QUFDYixRQUFJQyxTQUFTLEdBQUdYLGVBQWUsQ0FBQ1UsR0FBaEIsRUFBaEIsQ0FEYSxDQUViOztBQUNBLFFBQUlOLE1BQU0sR0FBR08sU0FBUyxDQUFDUCxNQUF2QjtBQUNBLFFBQUlJLE9BQU8sR0FBR0osTUFBTSxDQUFDSSxPQUFyQjs7QUFDQSxRQUFJQSxPQUFPLEtBQUtHLFNBQVMsQ0FBQ0gsT0FBMUIsRUFBbUM7QUFDL0IsV0FBSyxJQUFJSSxNQUFULElBQW1CSixPQUFuQixFQUE0QjtBQUN4QjtBQUNBO0FBQ0gsT0FKOEIsQ0FLL0I7OztBQUNBSixNQUFBQSxNQUFNLENBQUNJLE9BQVAsR0FBaUJBLE9BQU8sR0FBR0csU0FBUyxDQUFDRSxHQUFyQztBQUNIO0FBQ0osR0EzQkk7QUE0QkxDLEVBQUFBLElBQUksRUFBRSxnQkFBWTtBQUNkLFdBQU9kLGVBQWUsQ0FBQ0EsZUFBZSxDQUFDZSxNQUFoQixHQUF5QixDQUExQixDQUF0QjtBQUNIO0FBOUJJLENBQVQ7O0FBaUNBLElBQUlDLFNBQUosRUFBZTtBQUNYZixFQUFBQSxFQUFFLENBQUNDLEdBQUgsQ0FBT2UsS0FBUCxHQUFlLFlBQVk7QUFDdkJqQixJQUFBQSxlQUFlLEdBQUcsRUFBbEI7QUFDSCxHQUZEO0FBR0giLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciByZXF1aXJpbmdGcmFtZXMgPSBbXTsgIC8vIHRoZSByZXF1aXJpbmcgZnJhbWUgaW5mb3NcblxuY2MuX1JGID0ge1xuICAgIHB1c2g6IGZ1bmN0aW9uIChtb2R1bGUsIHV1aWQsIHNjcmlwdCkge1xuICAgICAgICBpZiAoc2NyaXB0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHNjcmlwdCA9IHV1aWQ7XG4gICAgICAgICAgICB1dWlkID0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmVxdWlyaW5nRnJhbWVzLnB1c2goe1xuICAgICAgICAgICAgdXVpZDogdXVpZCxcbiAgICAgICAgICAgIHNjcmlwdDogc2NyaXB0LFxuICAgICAgICAgICAgbW9kdWxlOiBtb2R1bGUsXG4gICAgICAgICAgICBleHBvcnRzOiBtb2R1bGUuZXhwb3J0cywgICAgLy8gb3JpZ2luYWwgZXhwb3J0c1xuICAgICAgICAgICAgYmVoOiBudWxsXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgcG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmcmFtZUluZm8gPSByZXF1aXJpbmdGcmFtZXMucG9wKCk7XG4gICAgICAgIC8vIGNoZWNrIGV4cG9ydHNcbiAgICAgICAgdmFyIG1vZHVsZSA9IGZyYW1lSW5mby5tb2R1bGU7XG4gICAgICAgIHZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHM7XG4gICAgICAgIGlmIChleHBvcnRzID09PSBmcmFtZUluZm8uZXhwb3J0cykge1xuICAgICAgICAgICAgZm9yICh2YXIgYW55S2V5IGluIGV4cG9ydHMpIHtcbiAgICAgICAgICAgICAgICAvLyBleHBvcnRlZFxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGF1dG8gZXhwb3J0IGNvbXBvbmVudFxuICAgICAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZnJhbWVJbmZvLmNscztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcGVlazogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcmVxdWlyaW5nRnJhbWVzW3JlcXVpcmluZ0ZyYW1lcy5sZW5ndGggLSAxXTtcbiAgICB9XG59O1xuXG5pZiAoQ0NfRURJVE9SKSB7XG4gICAgY2MuX1JGLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXF1aXJpbmdGcmFtZXMgPSBbXTtcbiAgICB9O1xufVxuIl0sInNvdXJjZVJvb3QiOiIvIn0=