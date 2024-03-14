
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/utils/mutable-forward-iterator.js';
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

/**
 * @example
 * var array = [0, 1, 2, 3, 4];
 * var iterator = new cc.js.array.MutableForwardIterator(array);
 * for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
 *     var item = array[iterator.i];
 *     ...
 * }
 */
function MutableForwardIterator(array) {
  this.i = 0;
  this.array = array;
}

var proto = MutableForwardIterator.prototype;

proto.remove = function (value) {
  var index = this.array.indexOf(value);

  if (index >= 0) {
    this.removeAt(index);
  }
};

proto.removeAt = function (i) {
  this.array.splice(i, 1);

  if (i <= this.i) {
    --this.i;
  }
};

proto.fastRemove = function (value) {
  var index = this.array.indexOf(value);

  if (index >= 0) {
    this.fastRemoveAt(index);
  }
};

proto.fastRemoveAt = function (i) {
  var array = this.array;
  array[i] = array[array.length - 1];
  --array.length;

  if (i <= this.i) {
    --this.i;
  }
};

proto.push = function (item) {
  this.array.push(item);
}; //js.getset(proto, 'length',
//    function () {
//        return this.array.length;
//    },
//    function (len) {
//        this.array.length = len;
//        if (this.i >= len) {
//            this.i = len - 1;
//        }
//    }
//);


module.exports = MutableForwardIterator;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3V0aWxzL211dGFibGUtZm9yd2FyZC1pdGVyYXRvci5qcyJdLCJuYW1lcyI6WyJNdXRhYmxlRm9yd2FyZEl0ZXJhdG9yIiwiYXJyYXkiLCJpIiwicHJvdG8iLCJwcm90b3R5cGUiLCJyZW1vdmUiLCJ2YWx1ZSIsImluZGV4IiwiaW5kZXhPZiIsInJlbW92ZUF0Iiwic3BsaWNlIiwiZmFzdFJlbW92ZSIsImZhc3RSZW1vdmVBdCIsImxlbmd0aCIsInB1c2giLCJpdGVtIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVNBLHNCQUFULENBQWlDQyxLQUFqQyxFQUF3QztBQUNwQyxPQUFLQyxDQUFMLEdBQVMsQ0FBVDtBQUNBLE9BQUtELEtBQUwsR0FBYUEsS0FBYjtBQUNIOztBQUVELElBQUlFLEtBQUssR0FBR0gsc0JBQXNCLENBQUNJLFNBQW5DOztBQUVBRCxLQUFLLENBQUNFLE1BQU4sR0FBZSxVQUFVQyxLQUFWLEVBQWlCO0FBQzVCLE1BQUlDLEtBQUssR0FBRyxLQUFLTixLQUFMLENBQVdPLE9BQVgsQ0FBbUJGLEtBQW5CLENBQVo7O0FBQ0EsTUFBSUMsS0FBSyxJQUFJLENBQWIsRUFBZ0I7QUFDWixTQUFLRSxRQUFMLENBQWNGLEtBQWQ7QUFDSDtBQUNKLENBTEQ7O0FBTUFKLEtBQUssQ0FBQ00sUUFBTixHQUFpQixVQUFVUCxDQUFWLEVBQWE7QUFDMUIsT0FBS0QsS0FBTCxDQUFXUyxNQUFYLENBQWtCUixDQUFsQixFQUFxQixDQUFyQjs7QUFFQSxNQUFJQSxDQUFDLElBQUksS0FBS0EsQ0FBZCxFQUFpQjtBQUNiLE1BQUUsS0FBS0EsQ0FBUDtBQUNIO0FBQ0osQ0FORDs7QUFPQUMsS0FBSyxDQUFDUSxVQUFOLEdBQW1CLFVBQVVMLEtBQVYsRUFBaUI7QUFDaEMsTUFBSUMsS0FBSyxHQUFHLEtBQUtOLEtBQUwsQ0FBV08sT0FBWCxDQUFtQkYsS0FBbkIsQ0FBWjs7QUFDQSxNQUFJQyxLQUFLLElBQUksQ0FBYixFQUFnQjtBQUNaLFNBQUtLLFlBQUwsQ0FBa0JMLEtBQWxCO0FBQ0g7QUFDSixDQUxEOztBQU1BSixLQUFLLENBQUNTLFlBQU4sR0FBcUIsVUFBVVYsQ0FBVixFQUFhO0FBQzlCLE1BQUlELEtBQUssR0FBRyxLQUFLQSxLQUFqQjtBQUNBQSxFQUFBQSxLQUFLLENBQUNDLENBQUQsQ0FBTCxHQUFXRCxLQUFLLENBQUNBLEtBQUssQ0FBQ1ksTUFBTixHQUFlLENBQWhCLENBQWhCO0FBQ0EsSUFBRVosS0FBSyxDQUFDWSxNQUFSOztBQUVBLE1BQUlYLENBQUMsSUFBSSxLQUFLQSxDQUFkLEVBQWlCO0FBQ2IsTUFBRSxLQUFLQSxDQUFQO0FBQ0g7QUFDSixDQVJEOztBQVVBQyxLQUFLLENBQUNXLElBQU4sR0FBYSxVQUFVQyxJQUFWLEVBQWdCO0FBQ3pCLE9BQUtkLEtBQUwsQ0FBV2EsSUFBWCxDQUFnQkMsSUFBaEI7QUFDSCxDQUZELEVBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUFDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmpCLHNCQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKipcbiAqIEBleGFtcGxlXG4gKiB2YXIgYXJyYXkgPSBbMCwgMSwgMiwgMywgNF07XG4gKiB2YXIgaXRlcmF0b3IgPSBuZXcgY2MuanMuYXJyYXkuTXV0YWJsZUZvcndhcmRJdGVyYXRvcihhcnJheSk7XG4gKiBmb3IgKGl0ZXJhdG9yLmkgPSAwOyBpdGVyYXRvci5pIDwgYXJyYXkubGVuZ3RoOyArK2l0ZXJhdG9yLmkpIHtcbiAqICAgICB2YXIgaXRlbSA9IGFycmF5W2l0ZXJhdG9yLmldO1xuICogICAgIC4uLlxuICogfVxuICovXG5mdW5jdGlvbiBNdXRhYmxlRm9yd2FyZEl0ZXJhdG9yIChhcnJheSkge1xuICAgIHRoaXMuaSA9IDA7XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuXG52YXIgcHJvdG8gPSBNdXRhYmxlRm9yd2FyZEl0ZXJhdG9yLnByb3RvdHlwZTtcblxucHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIGluZGV4ID0gdGhpcy5hcnJheS5pbmRleE9mKHZhbHVlKTtcbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICB0aGlzLnJlbW92ZUF0KGluZGV4KTtcbiAgICB9XG59O1xucHJvdG8ucmVtb3ZlQXQgPSBmdW5jdGlvbiAoaSkge1xuICAgIHRoaXMuYXJyYXkuc3BsaWNlKGksIDEpO1xuXG4gICAgaWYgKGkgPD0gdGhpcy5pKSB7XG4gICAgICAgIC0tdGhpcy5pO1xuICAgIH1cbn07XG5wcm90by5mYXN0UmVtb3ZlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIGluZGV4ID0gdGhpcy5hcnJheS5pbmRleE9mKHZhbHVlKTtcbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICB0aGlzLmZhc3RSZW1vdmVBdChpbmRleCk7XG4gICAgfVxufTtcbnByb3RvLmZhc3RSZW1vdmVBdCA9IGZ1bmN0aW9uIChpKSB7XG4gICAgdmFyIGFycmF5ID0gdGhpcy5hcnJheTtcbiAgICBhcnJheVtpXSA9IGFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgIC0tYXJyYXkubGVuZ3RoO1xuXG4gICAgaWYgKGkgPD0gdGhpcy5pKSB7XG4gICAgICAgIC0tdGhpcy5pO1xuICAgIH1cbn07XG5cbnByb3RvLnB1c2ggPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIHRoaXMuYXJyYXkucHVzaChpdGVtKTtcbn07XG5cbi8vanMuZ2V0c2V0KHByb3RvLCAnbGVuZ3RoJyxcbi8vICAgIGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICByZXR1cm4gdGhpcy5hcnJheS5sZW5ndGg7XG4vLyAgICB9LFxuLy8gICAgZnVuY3Rpb24gKGxlbikge1xuLy8gICAgICAgIHRoaXMuYXJyYXkubGVuZ3RoID0gbGVuO1xuLy8gICAgICAgIGlmICh0aGlzLmkgPj0gbGVuKSB7XG4vLyAgICAgICAgICAgIHRoaXMuaSA9IGxlbiAtIDE7XG4vLyAgICAgICAgfVxuLy8gICAgfVxuLy8pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE11dGFibGVGb3J3YXJkSXRlcmF0b3I7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==