
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/animation/animation-manager.js';
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
var js = cc.js;
var AnimationManager = cc.Class({
  ctor: function ctor() {
    this._anims = new js.array.MutableForwardIterator([]);
    this._delayEvents = [];
    cc.director._scheduler && cc.director._scheduler.enableForTarget(this);
  },
  // for manager
  update: function update(dt) {
    var iterator = this._anims;
    var array = iterator.array;

    for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
      var anim = array[iterator.i];

      if (anim._isPlaying && !anim._isPaused) {
        anim.update(dt);
      }
    }

    var events = this._delayEvents;

    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      event.target[event.func].apply(event.target, event.args);
    }

    events.length = 0;
  },
  destruct: function destruct() {},

  /**
   * @param {AnimationState} anim
   */
  addAnimation: function addAnimation(anim) {
    var index = this._anims.array.indexOf(anim);

    if (index === -1) {
      this._anims.push(anim);
    }
  },

  /**
   * @param {AnimationState} anim
   */
  removeAnimation: function removeAnimation(anim) {
    var index = this._anims.array.indexOf(anim);

    if (index >= 0) {
      this._anims.fastRemoveAt(index);
    } else {
      cc.errorID(3907);
    }
  },
  pushDelayEvent: function pushDelayEvent(target, func, args) {
    this._delayEvents.push({
      target: target,
      func: func,
      args: args
    });
  }
});
cc.AnimationManager = module.exports = AnimationManager;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9hbmltYXRpb24vYW5pbWF0aW9uLW1hbmFnZXIuanMiXSwibmFtZXMiOlsianMiLCJjYyIsIkFuaW1hdGlvbk1hbmFnZXIiLCJDbGFzcyIsImN0b3IiLCJfYW5pbXMiLCJhcnJheSIsIk11dGFibGVGb3J3YXJkSXRlcmF0b3IiLCJfZGVsYXlFdmVudHMiLCJkaXJlY3RvciIsIl9zY2hlZHVsZXIiLCJlbmFibGVGb3JUYXJnZXQiLCJ1cGRhdGUiLCJkdCIsIml0ZXJhdG9yIiwiaSIsImxlbmd0aCIsImFuaW0iLCJfaXNQbGF5aW5nIiwiX2lzUGF1c2VkIiwiZXZlbnRzIiwiZXZlbnQiLCJ0YXJnZXQiLCJmdW5jIiwiYXBwbHkiLCJhcmdzIiwiZGVzdHJ1Y3QiLCJhZGRBbmltYXRpb24iLCJpbmRleCIsImluZGV4T2YiLCJwdXNoIiwicmVtb3ZlQW5pbWF0aW9uIiwiZmFzdFJlbW92ZUF0IiwiZXJyb3JJRCIsInB1c2hEZWxheUV2ZW50IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQUlBLEVBQUUsR0FBR0MsRUFBRSxDQUFDRCxFQUFaO0FBRUEsSUFBSUUsZ0JBQWdCLEdBQUdELEVBQUUsQ0FBQ0UsS0FBSCxDQUFTO0FBQzVCQyxFQUFBQSxJQUFJLEVBQUUsZ0JBQVk7QUFDZCxTQUFLQyxNQUFMLEdBQWMsSUFBSUwsRUFBRSxDQUFDTSxLQUFILENBQVNDLHNCQUFiLENBQW9DLEVBQXBDLENBQWQ7QUFDQSxTQUFLQyxZQUFMLEdBQW9CLEVBQXBCO0FBRUFQLElBQUFBLEVBQUUsQ0FBQ1EsUUFBSCxDQUFZQyxVQUFaLElBQTBCVCxFQUFFLENBQUNRLFFBQUgsQ0FBWUMsVUFBWixDQUF1QkMsZUFBdkIsQ0FBdUMsSUFBdkMsQ0FBMUI7QUFDSCxHQU4yQjtBQVE1QjtBQUVBQyxFQUFBQSxNQUFNLEVBQUUsZ0JBQVVDLEVBQVYsRUFBYztBQUNsQixRQUFJQyxRQUFRLEdBQUcsS0FBS1QsTUFBcEI7QUFDQSxRQUFJQyxLQUFLLEdBQUdRLFFBQVEsQ0FBQ1IsS0FBckI7O0FBQ0EsU0FBS1EsUUFBUSxDQUFDQyxDQUFULEdBQWEsQ0FBbEIsRUFBcUJELFFBQVEsQ0FBQ0MsQ0FBVCxHQUFhVCxLQUFLLENBQUNVLE1BQXhDLEVBQWdELEVBQUVGLFFBQVEsQ0FBQ0MsQ0FBM0QsRUFBOEQ7QUFDMUQsVUFBSUUsSUFBSSxHQUFHWCxLQUFLLENBQUNRLFFBQVEsQ0FBQ0MsQ0FBVixDQUFoQjs7QUFDQSxVQUFJRSxJQUFJLENBQUNDLFVBQUwsSUFBbUIsQ0FBQ0QsSUFBSSxDQUFDRSxTQUE3QixFQUF3QztBQUNwQ0YsUUFBQUEsSUFBSSxDQUFDTCxNQUFMLENBQVlDLEVBQVo7QUFDSDtBQUNKOztBQUVELFFBQUlPLE1BQU0sR0FBRyxLQUFLWixZQUFsQjs7QUFDQSxTQUFLLElBQUlPLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdLLE1BQU0sQ0FBQ0osTUFBM0IsRUFBbUNELENBQUMsRUFBcEMsRUFBd0M7QUFDcEMsVUFBSU0sS0FBSyxHQUFHRCxNQUFNLENBQUNMLENBQUQsQ0FBbEI7QUFDQU0sTUFBQUEsS0FBSyxDQUFDQyxNQUFOLENBQWFELEtBQUssQ0FBQ0UsSUFBbkIsRUFBeUJDLEtBQXpCLENBQStCSCxLQUFLLENBQUNDLE1BQXJDLEVBQTZDRCxLQUFLLENBQUNJLElBQW5EO0FBQ0g7O0FBQ0RMLElBQUFBLE1BQU0sQ0FBQ0osTUFBUCxHQUFnQixDQUFoQjtBQUVILEdBM0IyQjtBQTZCNUJVLEVBQUFBLFFBQVEsRUFBRSxvQkFBWSxDQUFFLENBN0JJOztBQWdDNUI7QUFDSjtBQUNBO0FBQ0lDLEVBQUFBLFlBQVksRUFBRSxzQkFBVVYsSUFBVixFQUFnQjtBQUMxQixRQUFJVyxLQUFLLEdBQUcsS0FBS3ZCLE1BQUwsQ0FBWUMsS0FBWixDQUFrQnVCLE9BQWxCLENBQTBCWixJQUExQixDQUFaOztBQUNBLFFBQUlXLEtBQUssS0FBSyxDQUFDLENBQWYsRUFBa0I7QUFDZCxXQUFLdkIsTUFBTCxDQUFZeUIsSUFBWixDQUFpQmIsSUFBakI7QUFDSDtBQUNKLEdBeEMyQjs7QUEwQzVCO0FBQ0o7QUFDQTtBQUNJYyxFQUFBQSxlQUFlLEVBQUUseUJBQVVkLElBQVYsRUFBZ0I7QUFDN0IsUUFBSVcsS0FBSyxHQUFHLEtBQUt2QixNQUFMLENBQVlDLEtBQVosQ0FBa0J1QixPQUFsQixDQUEwQlosSUFBMUIsQ0FBWjs7QUFDQSxRQUFJVyxLQUFLLElBQUksQ0FBYixFQUFnQjtBQUNaLFdBQUt2QixNQUFMLENBQVkyQixZQUFaLENBQXlCSixLQUF6QjtBQUNILEtBRkQsTUFHSztBQUNEM0IsTUFBQUEsRUFBRSxDQUFDZ0MsT0FBSCxDQUFXLElBQVg7QUFDSDtBQUNKLEdBckQyQjtBQXVENUJDLEVBQUFBLGNBQWMsRUFBRSx3QkFBVVosTUFBVixFQUFrQkMsSUFBbEIsRUFBd0JFLElBQXhCLEVBQThCO0FBQzFDLFNBQUtqQixZQUFMLENBQWtCc0IsSUFBbEIsQ0FBdUI7QUFDbkJSLE1BQUFBLE1BQU0sRUFBRUEsTUFEVztBQUVuQkMsTUFBQUEsSUFBSSxFQUFFQSxJQUZhO0FBR25CRSxNQUFBQSxJQUFJLEVBQUVBO0FBSGEsS0FBdkI7QUFLSDtBQTdEMkIsQ0FBVCxDQUF2QjtBQWlFQXhCLEVBQUUsQ0FBQ0MsZ0JBQUgsR0FBc0JpQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJsQyxnQkFBdkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG52YXIganMgPSBjYy5qcztcblxudmFyIEFuaW1hdGlvbk1hbmFnZXIgPSBjYy5DbGFzcyh7XG4gICAgY3RvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9hbmltcyA9IG5ldyBqcy5hcnJheS5NdXRhYmxlRm9yd2FyZEl0ZXJhdG9yKFtdKTtcbiAgICAgICAgdGhpcy5fZGVsYXlFdmVudHMgPSBbXTtcblxuICAgICAgICBjYy5kaXJlY3Rvci5fc2NoZWR1bGVyICYmIGNjLmRpcmVjdG9yLl9zY2hlZHVsZXIuZW5hYmxlRm9yVGFyZ2V0KHRoaXMpO1xuICAgIH0sXG5cbiAgICAvLyBmb3IgbWFuYWdlclxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5fYW5pbXM7XG4gICAgICAgIHZhciBhcnJheSA9IGl0ZXJhdG9yLmFycmF5O1xuICAgICAgICBmb3IgKGl0ZXJhdG9yLmkgPSAwOyBpdGVyYXRvci5pIDwgYXJyYXkubGVuZ3RoOyArK2l0ZXJhdG9yLmkpIHtcbiAgICAgICAgICAgIHZhciBhbmltID0gYXJyYXlbaXRlcmF0b3IuaV07XG4gICAgICAgICAgICBpZiAoYW5pbS5faXNQbGF5aW5nICYmICFhbmltLl9pc1BhdXNlZCkge1xuICAgICAgICAgICAgICAgIGFuaW0udXBkYXRlKGR0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLl9kZWxheUV2ZW50cztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBldmVudCA9IGV2ZW50c1tpXTtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldFtldmVudC5mdW5jXS5hcHBseShldmVudC50YXJnZXQsIGV2ZW50LmFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50cy5sZW5ndGggPSAwO1xuICAgICAgICBcbiAgICB9LFxuXG4gICAgZGVzdHJ1Y3Q6IGZ1bmN0aW9uICgpIHt9LFxuXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0FuaW1hdGlvblN0YXRlfSBhbmltXG4gICAgICovXG4gICAgYWRkQW5pbWF0aW9uOiBmdW5jdGlvbiAoYW5pbSkge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9hbmltcy5hcnJheS5pbmRleE9mKGFuaW0pO1xuICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9hbmltcy5wdXNoKGFuaW0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7QW5pbWF0aW9uU3RhdGV9IGFuaW1cbiAgICAgKi9cbiAgICByZW1vdmVBbmltYXRpb246IGZ1bmN0aW9uIChhbmltKSB7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuX2FuaW1zLmFycmF5LmluZGV4T2YoYW5pbSk7XG4gICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9hbmltcy5mYXN0UmVtb3ZlQXQoaW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgzOTA3KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBwdXNoRGVsYXlFdmVudDogZnVuY3Rpb24gKHRhcmdldCwgZnVuYywgYXJncykge1xuICAgICAgICB0aGlzLl9kZWxheUV2ZW50cy5wdXNoKHtcbiAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICAgICAgZnVuYzogZnVuYyxcbiAgICAgICAgICAgIGFyZ3M6IGFyZ3NcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5cblxuY2MuQW5pbWF0aW9uTWFuYWdlciA9IG1vZHVsZS5leHBvcnRzID0gQW5pbWF0aW9uTWFuYWdlcjtcbiJdLCJzb3VyY2VSb290IjoiLyJ9