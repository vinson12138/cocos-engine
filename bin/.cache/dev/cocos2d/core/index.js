
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/index.js';
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
require('./platform');

require('./assets');

if (!CC_EDITOR || !Editor.isMainProcess) {
  require('./CCNode');

  require('./CCPrivateNode');

  require('./CCScene');

  require('./components');

  require('./graphics');

  require('./collider'); // CCIntersection can be used separately.


  require('./collider/CCIntersection');

  require('./physics');

  require('./camera/CCCamera');

  require('./geom-utils');
}

require('./mesh');

require('./3d');

require('./base-ui/CCWidgetManager');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2luZGV4LmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJDQ19FRElUT1IiLCJFZGl0b3IiLCJpc01haW5Qcm9jZXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsT0FBTyxDQUFDLFlBQUQsQ0FBUDs7QUFDQUEsT0FBTyxDQUFDLFVBQUQsQ0FBUDs7QUFFQSxJQUFJLENBQUNDLFNBQUQsSUFBYyxDQUFDQyxNQUFNLENBQUNDLGFBQTFCLEVBQXlDO0FBQ3JDSCxFQUFBQSxPQUFPLENBQUMsVUFBRCxDQUFQOztBQUNBQSxFQUFBQSxPQUFPLENBQUMsaUJBQUQsQ0FBUDs7QUFDQUEsRUFBQUEsT0FBTyxDQUFDLFdBQUQsQ0FBUDs7QUFFQUEsRUFBQUEsT0FBTyxDQUFDLGNBQUQsQ0FBUDs7QUFDQUEsRUFBQUEsT0FBTyxDQUFDLFlBQUQsQ0FBUDs7QUFDQUEsRUFBQUEsT0FBTyxDQUFDLFlBQUQsQ0FBUCxDQVBxQyxDQVFyQzs7O0FBQ0FBLEVBQUFBLE9BQU8sQ0FBQywyQkFBRCxDQUFQOztBQUNBQSxFQUFBQSxPQUFPLENBQUMsV0FBRCxDQUFQOztBQUNBQSxFQUFBQSxPQUFPLENBQUMsbUJBQUQsQ0FBUDs7QUFDQUEsRUFBQUEsT0FBTyxDQUFDLGNBQUQsQ0FBUDtBQUNIOztBQUVEQSxPQUFPLENBQUMsUUFBRCxDQUFQOztBQUNBQSxPQUFPLENBQUMsTUFBRCxDQUFQOztBQUVBQSxPQUFPLENBQUMsMkJBQUQsQ0FBUCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxucmVxdWlyZSgnLi9wbGF0Zm9ybScpO1xucmVxdWlyZSgnLi9hc3NldHMnKTtcblxuaWYgKCFDQ19FRElUT1IgfHwgIUVkaXRvci5pc01haW5Qcm9jZXNzKSB7XG4gICAgcmVxdWlyZSgnLi9DQ05vZGUnKTtcbiAgICByZXF1aXJlKCcuL0NDUHJpdmF0ZU5vZGUnKTtcbiAgICByZXF1aXJlKCcuL0NDU2NlbmUnKTtcblxuICAgIHJlcXVpcmUoJy4vY29tcG9uZW50cycpO1xuICAgIHJlcXVpcmUoJy4vZ3JhcGhpY3MnKTtcbiAgICByZXF1aXJlKCcuL2NvbGxpZGVyJyk7XG4gICAgLy8gQ0NJbnRlcnNlY3Rpb24gY2FuIGJlIHVzZWQgc2VwYXJhdGVseS5cbiAgICByZXF1aXJlKCcuL2NvbGxpZGVyL0NDSW50ZXJzZWN0aW9uJyk7XG4gICAgcmVxdWlyZSgnLi9waHlzaWNzJyk7XG4gICAgcmVxdWlyZSgnLi9jYW1lcmEvQ0NDYW1lcmEnKTtcbiAgICByZXF1aXJlKCcuL2dlb20tdXRpbHMnKTtcbn1cblxucmVxdWlyZSgnLi9tZXNoJyk7XG5yZXF1aXJlKCcuLzNkJyk7XG5cbnJlcXVpcmUoJy4vYmFzZS11aS9DQ1dpZGdldE1hbmFnZXInKTtcbiJdLCJzb3VyY2VSb290IjoiLyJ9