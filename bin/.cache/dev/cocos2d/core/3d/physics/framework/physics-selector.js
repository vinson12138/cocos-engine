
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/framework/physics-selector.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.instantiate = instantiate;
exports.PhysicsWorld = exports.RigidBody = exports.SphereShape = exports.BoxShape = void 0;

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
// Cannon
// built-in
var BoxShape;
exports.BoxShape = BoxShape;
var SphereShape;
exports.SphereShape = SphereShape;
var RigidBody;
exports.RigidBody = RigidBody;
var PhysicsWorld;
exports.PhysicsWorld = PhysicsWorld;

function instantiate(boxShape, sphereShape, body, world) {
  exports.BoxShape = BoxShape = boxShape;
  exports.SphereShape = SphereShape = sphereShape;
  exports.RigidBody = RigidBody = body;
  exports.PhysicsWorld = PhysicsWorld = world;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BoeXNpY3MvZnJhbWV3b3JrL3BoeXNpY3Mtc2VsZWN0b3IudHMiXSwibmFtZXMiOlsiQm94U2hhcGUiLCJTcGhlcmVTaGFwZSIsIlJpZ2lkQm9keSIsIlBoeXNpY3NXb3JsZCIsImluc3RhbnRpYXRlIiwiYm94U2hhcGUiLCJzcGhlcmVTaGFwZSIsImJvZHkiLCJ3b3JsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQztBQU1EO0FBS08sSUFBSUEsUUFBSjs7QUFDQSxJQUFJQyxXQUFKOztBQUNBLElBQUlDLFNBQUo7O0FBQ0EsSUFBSUMsWUFBSjs7O0FBRUEsU0FBU0MsV0FBVCxDQUNIQyxRQURHLEVBRUhDLFdBRkcsRUFHSEMsSUFIRyxFQUlIQyxLQUpHLEVBSXlCO0FBQzVCLHFCQUFBUixRQUFRLEdBQUdLLFFBQVg7QUFDQSx3QkFBQUosV0FBVyxHQUFHSyxXQUFkO0FBQ0Esc0JBQUFKLFNBQVMsR0FBR0ssSUFBWjtBQUNBLHlCQUFBSixZQUFZLEdBQUdLLEtBQWY7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gLy8gQ2Fubm9uXG5pbXBvcnQgeyBDYW5ub25SaWdpZEJvZHkgfSBmcm9tICcuLi9jYW5ub24vY2Fubm9uLXJpZ2lkLWJvZHknO1xuaW1wb3J0IHsgQ2Fubm9uV29ybGQgfSBmcm9tICcuLi9jYW5ub24vY2Fubm9uLXdvcmxkJztcbmltcG9ydCB7IENhbm5vbkJveFNoYXBlIH0gZnJvbSAnLi4vY2Fubm9uL3NoYXBlcy9jYW5ub24tYm94LXNoYXBlJztcbmltcG9ydCB7IENhbm5vblNwaGVyZVNoYXBlIH0gZnJvbSAnLi4vY2Fubm9uL3NoYXBlcy9jYW5ub24tc3BoZXJlLXNoYXBlJztcblxuLy8gYnVpbHQtaW5cbmltcG9ydCB7IEJ1aWx0SW5Xb3JsZCB9IGZyb20gJy4uL2NvY29zL2J1aWx0aW4td29ybGQnO1xuaW1wb3J0IHsgQnVpbHRpbkJveFNoYXBlIH0gZnJvbSAnLi4vY29jb3Mvc2hhcGVzL2J1aWx0aW4tYm94LXNoYXBlJztcbmltcG9ydCB7IEJ1aWx0aW5TcGhlcmVTaGFwZSB9IGZyb20gJy4uL2NvY29zL3NoYXBlcy9idWlsdGluLXNwaGVyZS1zaGFwZSc7XG5cbmV4cG9ydCBsZXQgQm94U2hhcGU6IHR5cGVvZiBDYW5ub25Cb3hTaGFwZSB8IHR5cGVvZiBCdWlsdGluQm94U2hhcGU7XG5leHBvcnQgbGV0IFNwaGVyZVNoYXBlOiB0eXBlb2YgQ2Fubm9uU3BoZXJlU2hhcGUgfCB0eXBlb2YgQnVpbHRpblNwaGVyZVNoYXBlO1xuZXhwb3J0IGxldCBSaWdpZEJvZHk6IHR5cGVvZiBDYW5ub25SaWdpZEJvZHkgfCBudWxsO1xuZXhwb3J0IGxldCBQaHlzaWNzV29ybGQ6IHR5cGVvZiBDYW5ub25Xb3JsZCB8IHR5cGVvZiBCdWlsdEluV29ybGQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnN0YW50aWF0ZSAoXG4gICAgYm94U2hhcGU6IHR5cGVvZiBCb3hTaGFwZSxcbiAgICBzcGhlcmVTaGFwZTogdHlwZW9mIFNwaGVyZVNoYXBlLFxuICAgIGJvZHk6IHR5cGVvZiBSaWdpZEJvZHksXG4gICAgd29ybGQ6IHR5cGVvZiBQaHlzaWNzV29ybGQpIHtcbiAgICBCb3hTaGFwZSA9IGJveFNoYXBlO1xuICAgIFNwaGVyZVNoYXBlID0gc3BoZXJlU2hhcGU7XG4gICAgUmlnaWRCb2R5ID0gYm9keTtcbiAgICBQaHlzaWNzV29ybGQgPSB3b3JsZDtcbn1cbiJdLCJzb3VyY2VSb290IjoiLyJ9