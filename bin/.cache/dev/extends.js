
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extends.js';
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
require('./cocos2d/core');

require('./cocos2d/animation');

if (CC_EDITOR && Editor.isMainProcess) {
  require('./cocos2d/particle/CCParticleAsset');

  require('./cocos2d/tilemap/CCTiledMapAsset');
} else {
  require('./cocos2d/particle');

  require('./cocos2d/tilemap');

  require('./cocos2d/videoplayer/CCVideoPlayer');

  require('./cocos2d/webview/CCWebView');

  require('./cocos2d/core/components/CCStudioComponent');

  require('./extensions/ccpool/CCNodePool');

  require('./cocos2d/actions');
}

require('./extensions/spine');

require('./extensions/dragonbones');

if (!CC_EDITOR || !Editor.isMainProcess) {
  require('./cocos2d/deprecated');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvZXh0ZW5kcy5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiQ0NfRURJVE9SIiwiRWRpdG9yIiwiaXNNYWluUHJvY2VzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQOztBQUNBQSxPQUFPLENBQUMscUJBQUQsQ0FBUDs7QUFFQSxJQUFJQyxTQUFTLElBQUlDLE1BQU0sQ0FBQ0MsYUFBeEIsRUFBdUM7QUFDbkNILEVBQUFBLE9BQU8sQ0FBQyxvQ0FBRCxDQUFQOztBQUNBQSxFQUFBQSxPQUFPLENBQUMsbUNBQUQsQ0FBUDtBQUNILENBSEQsTUFJSztBQUNEQSxFQUFBQSxPQUFPLENBQUMsb0JBQUQsQ0FBUDs7QUFDQUEsRUFBQUEsT0FBTyxDQUFDLG1CQUFELENBQVA7O0FBQ0FBLEVBQUFBLE9BQU8sQ0FBQyxxQ0FBRCxDQUFQOztBQUNBQSxFQUFBQSxPQUFPLENBQUMsNkJBQUQsQ0FBUDs7QUFDQUEsRUFBQUEsT0FBTyxDQUFDLDZDQUFELENBQVA7O0FBQ0FBLEVBQUFBLE9BQU8sQ0FBQyxnQ0FBRCxDQUFQOztBQUNBQSxFQUFBQSxPQUFPLENBQUMsbUJBQUQsQ0FBUDtBQUNIOztBQUVEQSxPQUFPLENBQUMsb0JBQUQsQ0FBUDs7QUFDQUEsT0FBTyxDQUFDLDBCQUFELENBQVA7O0FBRUEsSUFBSSxDQUFDQyxTQUFELElBQWMsQ0FBQ0MsTUFBTSxDQUFDQyxhQUExQixFQUF5QztBQUNyQ0gsRUFBQUEsT0FBTyxDQUFDLHNCQUFELENBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxucmVxdWlyZSgnLi9jb2NvczJkL2NvcmUnKTtcbnJlcXVpcmUoJy4vY29jb3MyZC9hbmltYXRpb24nKTtcblxuaWYgKENDX0VESVRPUiAmJiBFZGl0b3IuaXNNYWluUHJvY2Vzcykge1xuICAgIHJlcXVpcmUoJy4vY29jb3MyZC9wYXJ0aWNsZS9DQ1BhcnRpY2xlQXNzZXQnKTtcbiAgICByZXF1aXJlKCcuL2NvY29zMmQvdGlsZW1hcC9DQ1RpbGVkTWFwQXNzZXQnKTtcbn1cbmVsc2Uge1xuICAgIHJlcXVpcmUoJy4vY29jb3MyZC9wYXJ0aWNsZScpO1xuICAgIHJlcXVpcmUoJy4vY29jb3MyZC90aWxlbWFwJyk7XG4gICAgcmVxdWlyZSgnLi9jb2NvczJkL3ZpZGVvcGxheWVyL0NDVmlkZW9QbGF5ZXInKTtcbiAgICByZXF1aXJlKCcuL2NvY29zMmQvd2Vidmlldy9DQ1dlYlZpZXcnKTtcbiAgICByZXF1aXJlKCcuL2NvY29zMmQvY29yZS9jb21wb25lbnRzL0NDU3R1ZGlvQ29tcG9uZW50Jyk7XG4gICAgcmVxdWlyZSgnLi9leHRlbnNpb25zL2NjcG9vbC9DQ05vZGVQb29sJyk7XG4gICAgcmVxdWlyZSgnLi9jb2NvczJkL2FjdGlvbnMnKTtcbn1cblxucmVxdWlyZSgnLi9leHRlbnNpb25zL3NwaW5lJyk7XG5yZXF1aXJlKCcuL2V4dGVuc2lvbnMvZHJhZ29uYm9uZXMnKTtcblxuaWYgKCFDQ19FRElUT1IgfHwgIUVkaXRvci5pc01haW5Qcm9jZXNzKSB7XG4gICAgcmVxdWlyZSgnLi9jb2NvczJkL2RlcHJlY2F0ZWQnKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiLyJ9