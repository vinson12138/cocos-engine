
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/framework/instance.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.createPhysicsWorld = createPhysicsWorld;
exports.createRigidBody = createRigidBody;
exports.createBoxShape = createBoxShape;
exports.createSphereShape = createSphereShape;

var _physicsSelector = require("./physics-selector");

/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
function createPhysicsWorld() {
  return new _physicsSelector.PhysicsWorld();
}

function createRigidBody() {
  return new _physicsSelector.RigidBody();
}

function createBoxShape(size) {
  return new _physicsSelector.BoxShape(size);
}

function createSphereShape(radius) {
  return new _physicsSelector.SphereShape(radius);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BoeXNpY3MvZnJhbWV3b3JrL2luc3RhbmNlLnRzIl0sIm5hbWVzIjpbImNyZWF0ZVBoeXNpY3NXb3JsZCIsIlBoeXNpY3NXb3JsZCIsImNyZWF0ZVJpZ2lkQm9keSIsIlJpZ2lkQm9keSIsImNyZWF0ZUJveFNoYXBlIiwic2l6ZSIsIkJveFNoYXBlIiwiY3JlYXRlU3BoZXJlU2hhcGUiLCJyYWRpdXMiLCJTcGhlcmVTaGFwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7QUF6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBT08sU0FBU0Esa0JBQVQsR0FBOEM7QUFDakQsU0FBTyxJQUFJQyw2QkFBSixFQUFQO0FBQ0g7O0FBRU0sU0FBU0MsZUFBVCxHQUF3QztBQUMzQyxTQUFPLElBQUlDLDBCQUFKLEVBQVA7QUFDSDs7QUFFTSxTQUFTQyxjQUFULENBQXlCQyxJQUF6QixFQUFtRDtBQUN0RCxTQUFPLElBQUlDLHlCQUFKLENBQWFELElBQWIsQ0FBUDtBQUNIOztBQUVNLFNBQVNFLGlCQUFULENBQTRCQyxNQUE1QixFQUEwRDtBQUM3RCxTQUFPLElBQUlDLDRCQUFKLENBQWdCRCxNQUFoQixDQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IHsgQm94U2hhcGUsIFBoeXNpY3NXb3JsZCwgUmlnaWRCb2R5LCBTcGhlcmVTaGFwZSB9IGZyb20gJy4vcGh5c2ljcy1zZWxlY3Rvcic7XG5pbXBvcnQgeyBJUmlnaWRCb2R5IH0gZnJvbSAnLi4vc3BlYy9JLXJpZ2lkLWJvZHknO1xuaW1wb3J0IHsgSUJveFNoYXBlLCBJU3BoZXJlU2hhcGUgfSBmcm9tICcuLi9zcGVjL2ktcGh5c2ljcy1zaGFwZSc7XG5pbXBvcnQgeyBJUGh5c2ljc1dvcmxkIH0gZnJvbSAnLi4vc3BlYy9pLXBoeXNpY3Mtd29ybGQnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUGh5c2ljc1dvcmxkICgpOiBJUGh5c2ljc1dvcmxkIHtcbiAgICByZXR1cm4gbmV3IFBoeXNpY3NXb3JsZCgpIGFzIElQaHlzaWNzV29ybGQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSaWdpZEJvZHkgKCk6IElSaWdpZEJvZHkge1xuICAgIHJldHVybiBuZXcgUmlnaWRCb2R5ISgpIGFzIElSaWdpZEJvZHk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVCb3hTaGFwZSAoc2l6ZTogY2MuVmVjMyk6IElCb3hTaGFwZSB7XG4gICAgcmV0dXJuIG5ldyBCb3hTaGFwZShzaXplKSBhcyBJQm94U2hhcGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTcGhlcmVTaGFwZSAocmFkaXVzOiBudW1iZXIpOiBJU3BoZXJlU2hhcGUge1xuICAgIHJldHVybiBuZXcgU3BoZXJlU2hhcGUocmFkaXVzKSBhcyBJU3BoZXJlU2hhcGU7XG59XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==