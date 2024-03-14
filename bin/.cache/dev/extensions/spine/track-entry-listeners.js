
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/spine/track-entry-listeners.js';
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
var TrackEntryListeners = function TrackEntryListeners() {
  this.start = null;
  this.end = null;
  this.complete = null;
  this.event = null;
  this.interrupt = null;
  this.dispose = null;
};

TrackEntryListeners.getListeners = function (entry) {
  if (!entry.listener) {
    entry.listener = new TrackEntryListeners();
  }

  return entry.listener;
};

module.exports = TrackEntryListeners;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvZXh0ZW5zaW9ucy9zcGluZS90cmFjay1lbnRyeS1saXN0ZW5lcnMuanMiXSwibmFtZXMiOlsiVHJhY2tFbnRyeUxpc3RlbmVycyIsInN0YXJ0IiwiZW5kIiwiY29tcGxldGUiLCJldmVudCIsImludGVycnVwdCIsImRpc3Bvc2UiLCJnZXRMaXN0ZW5lcnMiLCJlbnRyeSIsImxpc3RlbmVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQUlBLG1CQUFtQixHQUFHLFNBQXRCQSxtQkFBc0IsR0FBWTtBQUNsQyxPQUFLQyxLQUFMLEdBQWEsSUFBYjtBQUNBLE9BQUtDLEdBQUwsR0FBVyxJQUFYO0FBQ0EsT0FBS0MsUUFBTCxHQUFnQixJQUFoQjtBQUNBLE9BQUtDLEtBQUwsR0FBYSxJQUFiO0FBQ0EsT0FBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUNBLE9BQUtDLE9BQUwsR0FBZSxJQUFmO0FBQ0gsQ0FQRDs7QUFTQU4sbUJBQW1CLENBQUNPLFlBQXBCLEdBQW1DLFVBQVNDLEtBQVQsRUFBZTtBQUM5QyxNQUFJLENBQUNBLEtBQUssQ0FBQ0MsUUFBWCxFQUFxQjtBQUNqQkQsSUFBQUEsS0FBSyxDQUFDQyxRQUFOLEdBQWlCLElBQUlULG1CQUFKLEVBQWpCO0FBQ0g7O0FBQ0QsU0FBT1EsS0FBSyxDQUFDQyxRQUFiO0FBQ0gsQ0FMRDs7QUFPQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCWCxtQkFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5sZXQgVHJhY2tFbnRyeUxpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnN0YXJ0ID0gbnVsbDtcbiAgICB0aGlzLmVuZCA9IG51bGw7XG4gICAgdGhpcy5jb21wbGV0ZSA9IG51bGw7XG4gICAgdGhpcy5ldmVudCA9IG51bGw7XG4gICAgdGhpcy5pbnRlcnJ1cHQgPSBudWxsO1xuICAgIHRoaXMuZGlzcG9zZSA9IG51bGw7XG59O1xuXG5UcmFja0VudHJ5TGlzdGVuZXJzLmdldExpc3RlbmVycyA9IGZ1bmN0aW9uKGVudHJ5KXtcbiAgICBpZiAoIWVudHJ5Lmxpc3RlbmVyKSB7XG4gICAgICAgIGVudHJ5Lmxpc3RlbmVyID0gbmV3IFRyYWNrRW50cnlMaXN0ZW5lcnMoKTtcbiAgICB9XG4gICAgcmV0dXJuIGVudHJ5Lmxpc3RlbmVyO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFja0VudHJ5TGlzdGVuZXJzOyJdLCJzb3VyY2VSb290IjoiLyJ9