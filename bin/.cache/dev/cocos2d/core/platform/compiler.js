
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/compiler.js';
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
function deepFlatten(strList, array) {
  for (var i = 0; i < array.length; i++) {
    var item = array[i];

    if (Array.isArray(item)) {
      deepFlatten(strList, item);
    } // else if (item instanceof Declaration) {
    //     strList.push(item.toString());
    // }
    else {
        strList.push(item);
      }
  }
}

function flattenCodeArray(array) {
  var separator = CC_DEV ? '\n' : '';
  var strList = [];
  deepFlatten(strList, array);
  return strList.join(separator);
}

module.exports = {
  flattenCodeArray: flattenCodeArray
};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BsYXRmb3JtL2NvbXBpbGVyLmpzIl0sIm5hbWVzIjpbImRlZXBGbGF0dGVuIiwic3RyTGlzdCIsImFycmF5IiwiaSIsImxlbmd0aCIsIml0ZW0iLCJBcnJheSIsImlzQXJyYXkiLCJwdXNoIiwiZmxhdHRlbkNvZGVBcnJheSIsInNlcGFyYXRvciIsIkNDX0RFViIsImpvaW4iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxTQUFTQSxXQUFULENBQXNCQyxPQUF0QixFQUErQkMsS0FBL0IsRUFBc0M7QUFDbEMsT0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRCxLQUFLLENBQUNFLE1BQTFCLEVBQWtDRCxDQUFDLEVBQW5DLEVBQXVDO0FBQ25DLFFBQUlFLElBQUksR0FBR0gsS0FBSyxDQUFDQyxDQUFELENBQWhCOztBQUNBLFFBQUlHLEtBQUssQ0FBQ0MsT0FBTixDQUFjRixJQUFkLENBQUosRUFBeUI7QUFDckJMLE1BQUFBLFdBQVcsQ0FBQ0MsT0FBRCxFQUFVSSxJQUFWLENBQVg7QUFDSCxLQUZELENBR0E7QUFDQTtBQUNBO0FBTEEsU0FNSztBQUNESixRQUFBQSxPQUFPLENBQUNPLElBQVIsQ0FBYUgsSUFBYjtBQUNIO0FBQ0o7QUFDSjs7QUFFRCxTQUFTSSxnQkFBVCxDQUEyQlAsS0FBM0IsRUFBa0M7QUFDOUIsTUFBSVEsU0FBUyxHQUFHQyxNQUFNLEdBQUcsSUFBSCxHQUFVLEVBQWhDO0FBQ0EsTUFBSVYsT0FBTyxHQUFHLEVBQWQ7QUFDQUQsRUFBQUEsV0FBVyxDQUFDQyxPQUFELEVBQVVDLEtBQVYsQ0FBWDtBQUNBLFNBQU9ELE9BQU8sQ0FBQ1csSUFBUixDQUFhRixTQUFiLENBQVA7QUFDSDs7QUFFREcsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2JMLEVBQUFBLGdCQUFnQixFQUFoQkE7QUFEYSxDQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuZnVuY3Rpb24gZGVlcEZsYXR0ZW4gKHN0ckxpc3QsIGFycmF5KSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgaXRlbSA9IGFycmF5W2ldO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgICAgICAgZGVlcEZsYXR0ZW4oc3RyTGlzdCwgaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZWxzZSBpZiAoaXRlbSBpbnN0YW5jZW9mIERlY2xhcmF0aW9uKSB7XG4gICAgICAgIC8vICAgICBzdHJMaXN0LnB1c2goaXRlbS50b1N0cmluZygpKTtcbiAgICAgICAgLy8gfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHN0ckxpc3QucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZmxhdHRlbkNvZGVBcnJheSAoYXJyYXkpIHtcbiAgICB2YXIgc2VwYXJhdG9yID0gQ0NfREVWID8gJ1xcbicgOiAnJztcbiAgICB2YXIgc3RyTGlzdCA9IFtdO1xuICAgIGRlZXBGbGF0dGVuKHN0ckxpc3QsIGFycmF5KTtcbiAgICByZXR1cm4gc3RyTGlzdC5qb2luKHNlcGFyYXRvcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGZsYXR0ZW5Db2RlQXJyYXlcbn07XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==