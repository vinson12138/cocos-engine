
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/editbox/EditBoxImplBase.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2012 James Chen
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
var EditBoxImplBase = cc.Class({
  ctor: function ctor() {
    this._delegate = null;
    this._editing = false;
  },
  init: function init(delegate) {},
  enable: function enable() {},
  disable: function disable() {
    if (this._editing) {
      this.endEditing();
    }
  },
  clear: function clear() {},
  update: function update() {},
  setTabIndex: function setTabIndex(index) {},
  setSize: function setSize(width, height) {},
  setFocus: function setFocus(value) {
    if (value) {
      this.beginEditing();
    } else {
      this.endEditing();
    }
  },
  isFocused: function isFocused() {
    return this._editing;
  },
  beginEditing: function beginEditing() {},
  endEditing: function endEditing() {}
});
module.exports = EditBoxImplBase;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvZWRpdGJveC9FZGl0Qm94SW1wbEJhc2UuanMiXSwibmFtZXMiOlsiRWRpdEJveEltcGxCYXNlIiwiY2MiLCJDbGFzcyIsImN0b3IiLCJfZGVsZWdhdGUiLCJfZWRpdGluZyIsImluaXQiLCJkZWxlZ2F0ZSIsImVuYWJsZSIsImRpc2FibGUiLCJlbmRFZGl0aW5nIiwiY2xlYXIiLCJ1cGRhdGUiLCJzZXRUYWJJbmRleCIsImluZGV4Iiwic2V0U2l6ZSIsIndpZHRoIiwiaGVpZ2h0Iiwic2V0Rm9jdXMiLCJ2YWx1ZSIsImJlZ2luRWRpdGluZyIsImlzRm9jdXNlZCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFJQSxlQUFlLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQzNCQyxFQUFBQSxJQUQyQixrQkFDbkI7QUFDSixTQUFLQyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQixLQUFoQjtBQUNILEdBSjBCO0FBTTNCQyxFQUFBQSxJQU4yQixnQkFNckJDLFFBTnFCLEVBTVgsQ0FFZixDQVIwQjtBQVUzQkMsRUFBQUEsTUFWMkIsb0JBVWpCLENBRVQsQ0FaMEI7QUFjM0JDLEVBQUFBLE9BZDJCLHFCQWNoQjtBQUNQLFFBQUksS0FBS0osUUFBVCxFQUFtQjtBQUNmLFdBQUtLLFVBQUw7QUFDSDtBQUNKLEdBbEIwQjtBQW9CM0JDLEVBQUFBLEtBcEIyQixtQkFvQmxCLENBRVIsQ0F0QjBCO0FBd0IzQkMsRUFBQUEsTUF4QjJCLG9CQXdCakIsQ0FFVCxDQTFCMEI7QUE0QjNCQyxFQUFBQSxXQTVCMkIsdUJBNEJkQyxLQTVCYyxFQTRCUCxDQUVuQixDQTlCMEI7QUFnQzNCQyxFQUFBQSxPQWhDMkIsbUJBZ0NsQkMsS0FoQ2tCLEVBZ0NYQyxNQWhDVyxFQWdDSCxDQUV2QixDQWxDMEI7QUFvQzNCQyxFQUFBQSxRQXBDMkIsb0JBb0NqQkMsS0FwQ2lCLEVBb0NWO0FBQ2IsUUFBSUEsS0FBSixFQUFXO0FBQ1AsV0FBS0MsWUFBTDtBQUNILEtBRkQsTUFHSztBQUNELFdBQUtWLFVBQUw7QUFDSDtBQUNKLEdBM0MwQjtBQTZDM0JXLEVBQUFBLFNBN0MyQix1QkE2Q2Q7QUFDVCxXQUFPLEtBQUtoQixRQUFaO0FBQ0gsR0EvQzBCO0FBaUQzQmUsRUFBQUEsWUFqRDJCLDBCQWlEWCxDQUVmLENBbkQwQjtBQXFEM0JWLEVBQUFBLFVBckQyQix3QkFxRGIsQ0FFYjtBQXZEMEIsQ0FBVCxDQUF0QjtBQTBEQVksTUFBTSxDQUFDQyxPQUFQLEdBQWlCdkIsZUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMS0yMDEyIGNvY29zMmQteC5vcmdcbiBDb3B5cmlnaHQgKGMpIDIwMTIgSmFtZXMgQ2hlblxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxubGV0IEVkaXRCb3hJbXBsQmFzZSA9IGNjLkNsYXNzKHtcbiAgICBjdG9yICgpIHtcbiAgICAgICAgdGhpcy5fZGVsZWdhdGUgPSBudWxsO1xuICAgICAgICB0aGlzLl9lZGl0aW5nID0gZmFsc2U7XG4gICAgfSxcblxuICAgIGluaXQgKGRlbGVnYXRlKSB7XG5cbiAgICB9LFxuXG4gICAgZW5hYmxlICgpIHtcbiAgICAgICAgXG4gICAgfSxcblxuICAgIGRpc2FibGUgKCkge1xuICAgICAgICBpZiAodGhpcy5fZWRpdGluZykge1xuICAgICAgICAgICAgdGhpcy5lbmRFZGl0aW5nKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xlYXIgKCkge1xuICAgICAgICBcbiAgICB9LFxuXG4gICAgdXBkYXRlICgpIHtcbiAgICAgICAgXG4gICAgfSxcblxuICAgIHNldFRhYkluZGV4IChpbmRleCkge1xuXG4gICAgfSxcblxuICAgIHNldFNpemUgKHdpZHRoLCBoZWlnaHQpIHtcblxuICAgIH0sXG5cbiAgICBzZXRGb2N1cyAodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLmJlZ2luRWRpdGluZygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbmRFZGl0aW5nKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaXNGb2N1c2VkICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VkaXRpbmc7XG4gICAgfSxcblxuICAgIGJlZ2luRWRpdGluZyAoKSB7XG5cbiAgICB9LFxuICAgIFxuICAgIGVuZEVkaXRpbmcgKCkge1xuXG4gICAgfSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVkaXRCb3hJbXBsQmFzZTtcbiJdLCJzb3VyY2VSb290IjoiLyJ9