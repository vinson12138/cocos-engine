
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/framework/index.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;

var _physicsManager = require("./physics-manager");

exports.Physics3DManager = _physicsManager.Physics3DManager;

var _physicsRayResult = require("./physics-ray-result");

exports.PhysicsRayResult = _physicsRayResult.PhysicsRayResult;

var _boxColliderComponent = require("./components/collider/box-collider-component");

exports.BoxCollider3D = _boxColliderComponent.BoxCollider3D;

var _colliderComponent = require("./components/collider/collider-component");

exports.Collider3D = _colliderComponent.Collider3D;

var _sphereColliderComponent = require("./components/collider/sphere-collider-component");

exports.SphereCollider3D = _sphereColliderComponent.SphereCollider3D;

var _rigidBodyComponent = require("./components/rigid-body-component");

exports.RigidBody3D = _rigidBodyComponent.RigidBody3D;

var _constantForce = require("./components/constant-force");

var _physicsMaterial = require("./assets/physics-material");

exports.PhysicsMaterial = _physicsMaterial.PhysicsMaterial;

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
cc.Physics3DManager = _physicsManager.Physics3DManager;
cc.Collider3D = _colliderComponent.Collider3D;
cc.BoxCollider3D = _boxColliderComponent.BoxCollider3D;
cc.SphereCollider3D = _sphereColliderComponent.SphereCollider3D;
cc.RigidBody3D = _rigidBodyComponent.RigidBody3D;
cc.PhysicsRayResult = _physicsRayResult.PhysicsRayResult;
cc.ConstantForce = _constantForce.ConstantForce;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BoeXNpY3MvZnJhbWV3b3JrL2luZGV4LnRzIl0sIm5hbWVzIjpbImNjIiwiUGh5c2ljczNETWFuYWdlciIsIkNvbGxpZGVyM0QiLCJCb3hDb2xsaWRlcjNEIiwiU3BoZXJlQ29sbGlkZXIzRCIsIlJpZ2lkQm9keTNEIiwiUGh5c2ljc1JheVJlc3VsdCIsIkNvbnN0YW50Rm9yY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQWhDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFzQkFBLEVBQUUsQ0FBQ0MsZ0JBQUgsR0FBc0JBLGdDQUF0QjtBQUNBRCxFQUFFLENBQUNFLFVBQUgsR0FBZ0JBLDZCQUFoQjtBQUNBRixFQUFFLENBQUNHLGFBQUgsR0FBbUJBLG1DQUFuQjtBQUNBSCxFQUFFLENBQUNJLGdCQUFILEdBQXNCQSx5Q0FBdEI7QUFDQUosRUFBRSxDQUFDSyxXQUFILEdBQWlCQSwrQkFBakI7QUFDQUwsRUFBRSxDQUFDTSxnQkFBSCxHQUFzQkEsa0NBQXRCO0FBQ0FOLEVBQUUsQ0FBQ08sYUFBSCxHQUFtQkEsNEJBQW5CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCB7IFBoeXNpY3MzRE1hbmFnZXIgfSBmcm9tICcuL3BoeXNpY3MtbWFuYWdlcic7XG5pbXBvcnQgeyBQaHlzaWNzUmF5UmVzdWx0IH0gZnJvbSAnLi9waHlzaWNzLXJheS1yZXN1bHQnO1xuaW1wb3J0IHsgQm94Q29sbGlkZXIzRCB9IGZyb20gJy4vY29tcG9uZW50cy9jb2xsaWRlci9ib3gtY29sbGlkZXItY29tcG9uZW50JztcbmltcG9ydCB7IENvbGxpZGVyM0QgfSBmcm9tICcuL2NvbXBvbmVudHMvY29sbGlkZXIvY29sbGlkZXItY29tcG9uZW50JztcbmltcG9ydCB7IFNwaGVyZUNvbGxpZGVyM0QgfSBmcm9tICcuL2NvbXBvbmVudHMvY29sbGlkZXIvc3BoZXJlLWNvbGxpZGVyLWNvbXBvbmVudCc7XG5pbXBvcnQgeyBSaWdpZEJvZHkzRCB9IGZyb20gJy4vY29tcG9uZW50cy9yaWdpZC1ib2R5LWNvbXBvbmVudCc7XG5pbXBvcnQgeyBDb25zdGFudEZvcmNlIH0gZnJvbSAnLi9jb21wb25lbnRzL2NvbnN0YW50LWZvcmNlJztcbmltcG9ydCB7IFBoeXNpY3NNYXRlcmlhbCB9IGZyb20gJy4vYXNzZXRzL3BoeXNpY3MtbWF0ZXJpYWwnO1xuXG5leHBvcnQge1xuICAgIFBoeXNpY3MzRE1hbmFnZXIsXG4gICAgUGh5c2ljc1JheVJlc3VsdCxcbiAgICBQaHlzaWNzTWF0ZXJpYWwsXG5cbiAgICBDb2xsaWRlcjNELFxuICAgIEJveENvbGxpZGVyM0QsXG4gICAgU3BoZXJlQ29sbGlkZXIzRCxcbiAgICBSaWdpZEJvZHkzRCxcbn07XG5cbmNjLlBoeXNpY3MzRE1hbmFnZXIgPSBQaHlzaWNzM0RNYW5hZ2VyO1xuY2MuQ29sbGlkZXIzRCA9IENvbGxpZGVyM0Q7XG5jYy5Cb3hDb2xsaWRlcjNEID0gQm94Q29sbGlkZXIzRDtcbmNjLlNwaGVyZUNvbGxpZGVyM0QgPSBTcGhlcmVDb2xsaWRlcjNEO1xuY2MuUmlnaWRCb2R5M0QgPSBSaWdpZEJvZHkzRDtcbmNjLlBoeXNpY3NSYXlSZXN1bHQgPSBQaHlzaWNzUmF5UmVzdWx0O1xuY2MuQ29uc3RhbnRGb3JjZSA9IENvbnN0YW50Rm9yY2U7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==