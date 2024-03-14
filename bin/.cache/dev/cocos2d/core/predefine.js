
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/predefine.js';
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
// predefine some modules for cocos
require('./platform/js');

require('./value-types');

require('./utils');

require('./platform/CCInputManager');

require('./platform/CCInputExtension');

require('./event');

require('./platform/CCSys');

require('./platform/CCMacro');

require('./asset-manager');

require('./CCDirector');

require('./renderer');

if (!(CC_EDITOR && Editor.isMainProcess)) {
  require('./platform/CCView');

  require('./platform/CCScreen');

  require('./CCScheduler');

  require('./event-manager');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3ByZWRlZmluZS5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiQ0NfRURJVE9SIiwiRWRpdG9yIiwiaXNNYWluUHJvY2VzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQUEsT0FBTyxDQUFDLGVBQUQsQ0FBUDs7QUFDQUEsT0FBTyxDQUFDLGVBQUQsQ0FBUDs7QUFDQUEsT0FBTyxDQUFDLFNBQUQsQ0FBUDs7QUFDQUEsT0FBTyxDQUFDLDJCQUFELENBQVA7O0FBQ0FBLE9BQU8sQ0FBQyw2QkFBRCxDQUFQOztBQUNBQSxPQUFPLENBQUMsU0FBRCxDQUFQOztBQUNBQSxPQUFPLENBQUMsa0JBQUQsQ0FBUDs7QUFDQUEsT0FBTyxDQUFDLG9CQUFELENBQVA7O0FBQ0FBLE9BQU8sQ0FBQyxpQkFBRCxDQUFQOztBQUNBQSxPQUFPLENBQUMsY0FBRCxDQUFQOztBQUNBQSxPQUFPLENBQUMsWUFBRCxDQUFQOztBQUVBLElBQUksRUFBRUMsU0FBUyxJQUFJQyxNQUFNLENBQUNDLGFBQXRCLENBQUosRUFBMEM7QUFDdENILEVBQUFBLE9BQU8sQ0FBQyxtQkFBRCxDQUFQOztBQUNBQSxFQUFBQSxPQUFPLENBQUMscUJBQUQsQ0FBUDs7QUFDQUEsRUFBQUEsT0FBTyxDQUFDLGVBQUQsQ0FBUDs7QUFDQUEsRUFBQUEsT0FBTyxDQUFDLGlCQUFELENBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gcHJlZGVmaW5lIHNvbWUgbW9kdWxlcyBmb3IgY29jb3NcbnJlcXVpcmUoJy4vcGxhdGZvcm0vanMnKTtcbnJlcXVpcmUoJy4vdmFsdWUtdHlwZXMnKTtcbnJlcXVpcmUoJy4vdXRpbHMnKTtcbnJlcXVpcmUoJy4vcGxhdGZvcm0vQ0NJbnB1dE1hbmFnZXInKTtcbnJlcXVpcmUoJy4vcGxhdGZvcm0vQ0NJbnB1dEV4dGVuc2lvbicpO1xucmVxdWlyZSgnLi9ldmVudCcpO1xucmVxdWlyZSgnLi9wbGF0Zm9ybS9DQ1N5cycpO1xucmVxdWlyZSgnLi9wbGF0Zm9ybS9DQ01hY3JvJyk7XG5yZXF1aXJlKCcuL2Fzc2V0LW1hbmFnZXInKTtcbnJlcXVpcmUoJy4vQ0NEaXJlY3RvcicpO1xucmVxdWlyZSgnLi9yZW5kZXJlcicpO1xuXG5pZiAoIShDQ19FRElUT1IgJiYgRWRpdG9yLmlzTWFpblByb2Nlc3MpKSB7XG4gICAgcmVxdWlyZSgnLi9wbGF0Zm9ybS9DQ1ZpZXcnKTtcbiAgICByZXF1aXJlKCcuL3BsYXRmb3JtL0NDU2NyZWVuJyk7XG4gICAgcmVxdWlyZSgnLi9DQ1NjaGVkdWxlcicpO1xuICAgIHJlcXVpcmUoJy4vZXZlbnQtbWFuYWdlcicpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIvIn0=