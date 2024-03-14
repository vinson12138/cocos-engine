
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/joint/CCWheelJoint.js';
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
var PTM_RATIO = require('../CCPhysicsTypes').PTM_RATIO;

var ANGLE_TO_PHYSICS_ANGLE = require('../CCPhysicsTypes').ANGLE_TO_PHYSICS_ANGLE;
/**
 * !#en
 * A wheel joint. This joint provides two degrees of freedom: translation
 * along an axis fixed in bodyA and rotation in the plane. You can use a joint motor to drive
 * the rotation or to model rotational friction.
 * This joint is designed for vehicle suspensions.
 * !#zh
 * 轮子关节提供两个维度的自由度：旋转和沿着指定方向上位置的移动。
 * 你可以通过开启关节马达来使用马达驱动刚体的旋转。
 * 轮组关节是专门为机动车类型设计的。
 * @class WheelJoint
 * @extends Joint
 */


var WheelJoint = cc.Class({
  name: 'cc.WheelJoint',
  "extends": cc.Joint,
  editor: CC_EDITOR && {
    inspector: 'packages://inspector/inspectors/comps/physics/joint.js',
    menu: 'i18n:MAIN_MENU.component.physics/Joint/Wheel'
  },
  properties: {
    _maxMotorTorque: 0,
    _motorSpeed: 0,
    _enableMotor: false,
    _frequency: 2,
    _dampingRatio: 0.7,

    /**
     * !#en
     * The local joint axis relative to rigidbody.
     * !#zh
     * 指定刚体可以移动的方向。
     * @property {Vec2} localAxisA
     * @default cc.v2(1, 0)
     */
    localAxisA: {
      "default": cc.v2(1, 0),
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.localAxisA'
    },

    /**
     * !#en
     * The maxium torque can be applied to rigidbody to rearch the target motor speed.
     * !#zh
     * 可以施加到刚体的最大扭矩。
     * @property {Number} maxMotorTorque
     * @default 0
     */
    maxMotorTorque: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.maxMotorTorque',
      get: function get() {
        return this._maxMotorTorque;
      },
      set: function set(value) {
        this._maxMotorTorque = value;

        if (this._joint) {
          this._joint.SetMaxMotorTorque(value);
        }
      }
    },

    /**
     * !#en
     * The expected motor speed.
     * !#zh
     * 期望的马达速度。
     * @property {Number} motorSpeed
     * @default 0
     */
    motorSpeed: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.motorSpeed',
      get: function get() {
        return this._motorSpeed;
      },
      set: function set(value) {
        this._motorSpeed = value;

        if (this._joint) {
          this._joint.SetMotorSpeed(value * ANGLE_TO_PHYSICS_ANGLE);
        }
      }
    },

    /**
     * !#en
     * Enable joint motor?
     * !#zh
     * 是否开启关节马达？
     * @property {Boolean} enableMotor
     * @default false
     */
    enableMotor: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.enableMotor',
      get: function get() {
        return this._enableMotor;
      },
      set: function set(value) {
        this._enableMotor = value;

        if (this._joint) {
          this._joint.EnableMotor(value);
        }
      }
    },

    /**
     * !#en
     * The spring frequency.
     * !#zh
     * 弹性系数。
     * @property {Number} frequency
     * @default 0
     */
    frequency: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.frequency',
      get: function get() {
        return this._frequency;
      },
      set: function set(value) {
        this._frequency = value;

        if (this._joint) {
          this._joint.SetSpringFrequencyHz(value);
        }
      }
    },

    /**
     * !#en
     * The damping ratio.
     * !#zh
     * 阻尼，表示关节变形后，恢复到初始状态受到的阻力。
     * @property {Number} dampingRatio
     * @default 0
     */
    dampingRatio: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.dampingRatio',
      get: function get() {
        return this._dampingRatio;
      },
      set: function set(value) {
        this._dampingRatio = value;

        if (this._joint) {
          this._joint.SetDampingRatio(value);
        }
      }
    }
  },
  _createJointDef: function _createJointDef() {
    var def = new b2.WheelJointDef();
    def.localAnchorA = new b2.Vec2(this.anchor.x / PTM_RATIO, this.anchor.y / PTM_RATIO);
    def.localAnchorB = new b2.Vec2(this.connectedAnchor.x / PTM_RATIO, this.connectedAnchor.y / PTM_RATIO);
    def.localAxisA = new b2.Vec2(this.localAxisA.x, this.localAxisA.y);
    def.maxMotorTorque = this.maxMotorTorque;
    def.motorSpeed = this.motorSpeed * ANGLE_TO_PHYSICS_ANGLE;
    def.enableMotor = this.enableMotor;
    def.dampingRatio = this.dampingRatio;
    def.frequencyHz = this.frequency;
    return def;
  }
});
cc.WheelJoint = module.exports = WheelJoint;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BoeXNpY3Mvam9pbnQvQ0NXaGVlbEpvaW50LmpzIl0sIm5hbWVzIjpbIlBUTV9SQVRJTyIsInJlcXVpcmUiLCJBTkdMRV9UT19QSFlTSUNTX0FOR0xFIiwiV2hlZWxKb2ludCIsImNjIiwiQ2xhc3MiLCJuYW1lIiwiSm9pbnQiLCJlZGl0b3IiLCJDQ19FRElUT1IiLCJpbnNwZWN0b3IiLCJtZW51IiwicHJvcGVydGllcyIsIl9tYXhNb3RvclRvcnF1ZSIsIl9tb3RvclNwZWVkIiwiX2VuYWJsZU1vdG9yIiwiX2ZyZXF1ZW5jeSIsIl9kYW1waW5nUmF0aW8iLCJsb2NhbEF4aXNBIiwidjIiLCJ0b29sdGlwIiwiQ0NfREVWIiwibWF4TW90b3JUb3JxdWUiLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsIl9qb2ludCIsIlNldE1heE1vdG9yVG9ycXVlIiwibW90b3JTcGVlZCIsIlNldE1vdG9yU3BlZWQiLCJlbmFibGVNb3RvciIsIkVuYWJsZU1vdG9yIiwiZnJlcXVlbmN5IiwiU2V0U3ByaW5nRnJlcXVlbmN5SHoiLCJkYW1waW5nUmF0aW8iLCJTZXREYW1waW5nUmF0aW8iLCJfY3JlYXRlSm9pbnREZWYiLCJkZWYiLCJiMiIsIldoZWVsSm9pbnREZWYiLCJsb2NhbEFuY2hvckEiLCJWZWMyIiwiYW5jaG9yIiwieCIsInkiLCJsb2NhbEFuY2hvckIiLCJjb25uZWN0ZWRBbmNob3IiLCJmcmVxdWVuY3lIeiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQUlBLFNBQVMsR0FBR0MsT0FBTyxDQUFDLG1CQUFELENBQVAsQ0FBNkJELFNBQTdDOztBQUNBLElB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QUFnQnlCLENBQTVCLEVBQStCLEtBQUt6QixVQUFMLENBQWdCMEIsQ0FBL0MsQ0FBakI7QUFFQVAsSUFBQUEsR0FBRyxDQUFDZixjQUFKLEdBQXFCLEtBQUtBLGNBQTFCO0FBQ0FlLElBQUFBLEdBQUcsQ0FBQ1QsVUFBSixHQUFpQixLQUFLQSxVQUFMLEdBQWtCMUIsc0JBQW5DO0FBQ0FtQyxJQUFBQSxHQUFHLENBQUNQLFdBQUosR0FBa0IsS0FBS0EsV0FBdkI7QUFFQU8sSUFBQUEsR0FBRyxDQUFDSCxZQUFKLEdBQW1CLEtBQUtBLFlBQXhCO0FBQ0FHLElBQUFBLEdBQUcsQ0FBQ1UsV0FBSixHQUFrQixLQUFLZixTQUF2QjtBQUVBLFdBQU9LLEdBQVA7QUFDSDtBQXZKcUIsQ0FBVCxDQUFqQjtBQTBKQWpDLEVBQUUsQ0FBQ0QsVUFBSCxHQUFnQjZDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjlDLFVBQWpDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG52YXIgUFRNX1JBVElPID0gcmVxdWlyZSgnLi4vQ0NQaHlzaWNzVHlwZXMnKS5QVE1fUkFUSU87XG52YXIgQU5HTEVfVE9fUEhZU0lDU19BTkdMRSA9IHJlcXVpcmUoJy4uL0NDUGh5c2ljc1R5cGVzJykuQU5HTEVfVE9fUEhZU0lDU19BTkdMRTtcblxuLyoqXG4gKiAhI2VuXG4gKiBBIHdoZWVsIGpvaW50LiBUaGlzIGpvaW50IHByb3ZpZGVzIHR3byBkZWdyZWVzIG9mIGZyZWVkb206IHRyYW5zbGF0aW9uXG4gKiBhbG9uZyBhbiBheGlzIGZpeGVkIGluIGJvZHlBIGFuZCByb3RhdGlvbiBpbiB0aGUgcGxhbmUuIFlvdSBjYW4gdXNlIGEgam9pbnQgbW90b3IgdG8gZHJpdmVcbiAqIHRoZSByb3RhdGlvbiBvciB0byBtb2RlbCByb3RhdGlvbmFsIGZyaWN0aW9uLlxuICogVGhpcyBqb2ludCBpcyBkZXNpZ25lZCBmb3IgdmVoaWNsZSBzdXNwZW5zaW9ucy5cbiAqICEjemhcbiAqIOi9ruWtkOWFs+iKguaPkOS+m+S4pOS4que7tOW6pueahOiHqueUseW6pu+8muaXi+i9rOWSjOayv+edgOaMh+WumuaWueWQkeS4iuS9jee9rueahOenu+WKqOOAglxuICog5L2g5Y+v5Lul6YCa6L+H5byA5ZCv5YWz6IqC6ams6L6+5p2l5L2/55So6ams6L6+6amx5Yqo5Yia5L2T55qE5peL6L2s44CCXG4gKiDova7nu4TlhbPoioLmmK/kuJPpl6jkuLrmnLrliqjovabnsbvlnovorr7orqHnmoTjgIJcbiAqIEBjbGFzcyBXaGVlbEpvaW50XG4gKiBAZXh0ZW5kcyBKb2ludFxuICovXG52YXIgV2hlZWxKb2ludCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuV2hlZWxKb2ludCcsXG4gICAgZXh0ZW5kczogY2MuSm9pbnQsXG4gICAgXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBpbnNwZWN0b3I6ICdwYWNrYWdlczovL2luc3BlY3Rvci9pbnNwZWN0b3JzL2NvbXBzL3BoeXNpY3Mvam9pbnQuanMnLFxuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnBoeXNpY3MvSm9pbnQvV2hlZWwnLFxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF9tYXhNb3RvclRvcnF1ZTogMCxcbiAgICAgICAgX21vdG9yU3BlZWQ6IDAsXG4gICAgICAgIF9lbmFibGVNb3RvcjogZmFsc2UsXG4gICAgICAgIFxuICAgICAgICBfZnJlcXVlbmN5OiAyLFxuICAgICAgICBfZGFtcGluZ1JhdGlvOiAwLjcsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIGxvY2FsIGpvaW50IGF4aXMgcmVsYXRpdmUgdG8gcmlnaWRib2R5LlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOaMh+WumuWImuS9k+WPr+S7peenu+WKqOeahOaWueWQkeOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1ZlYzJ9IGxvY2FsQXhpc0FcbiAgICAgICAgICogQGRlZmF1bHQgY2MudjIoMSwgMClcbiAgICAgICAgICovXG4gICAgICAgIGxvY2FsQXhpc0E6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGNjLnYyKDEsIDApLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnBoeXNpY3NfY29sbGlkZXIubG9jYWxBeGlzQSdcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgbWF4aXVtIHRvcnF1ZSBjYW4gYmUgYXBwbGllZCB0byByaWdpZGJvZHkgdG8gcmVhcmNoIHRoZSB0YXJnZXQgbW90b3Igc3BlZWQuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5Y+v5Lul5pa95Yqg5Yiw5Yia5L2T55qE5pyA5aSn5omt55+p44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBtYXhNb3RvclRvcnF1ZVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICBtYXhNb3RvclRvcnF1ZToge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnBoeXNpY3NfY29sbGlkZXIubWF4TW90b3JUb3JxdWUnLCAgICAgICAgICAgIFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21heE1vdG9yVG9ycXVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWF4TW90b3JUb3JxdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fam9pbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fam9pbnQuU2V0TWF4TW90b3JUb3JxdWUodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgZXhwZWN0ZWQgbW90b3Igc3BlZWQuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5pyf5pyb55qE6ams6L6+6YCf5bqm44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBtb3RvclNwZWVkXG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIG1vdG9yU3BlZWQ6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLm1vdG9yU3BlZWQnLFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vdG9yU3BlZWQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3RvclNwZWVkID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2pvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2pvaW50LlNldE1vdG9yU3BlZWQodmFsdWUgKiBBTkdMRV9UT19QSFlTSUNTX0FOR0xFKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogRW5hYmxlIGpvaW50IG1vdG9yP1xuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOaYr+WQpuW8gOWQr+WFs+iKgumprOi+vu+8n1xuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGVuYWJsZU1vdG9yXG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICBlbmFibGVNb3Rvcjoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnBoeXNpY3NfY29sbGlkZXIuZW5hYmxlTW90b3InLCAgICAgICAgICAgIFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2VuYWJsZU1vdG9yO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZW5hYmxlTW90b3IgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fam9pbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fam9pbnQuRW5hYmxlTW90b3IodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgc3ByaW5nIGZyZXF1ZW5jeS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDlvLnmgKfns7vmlbDjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGZyZXF1ZW5jeVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICBmcmVxdWVuY3k6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLmZyZXF1ZW5jeScsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZnJlcXVlbmN5O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZnJlcXVlbmN5ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2pvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2pvaW50LlNldFNwcmluZ0ZyZXF1ZW5jeUh6KHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIGRhbXBpbmcgcmF0aW8uXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog6Zi75bC877yM6KGo56S65YWz6IqC5Y+Y5b2i5ZCO77yM5oGi5aSN5Yiw5Yid5aeL54q25oCB5Y+X5Yiw55qE6Zi75Yqb44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBkYW1waW5nUmF0aW9cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgZGFtcGluZ1JhdGlvOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5kYW1waW5nUmF0aW8nLCAgICAgICAgICAgIFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhbXBpbmdSYXRpbztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RhbXBpbmdSYXRpbyA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9qb2ludCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9qb2ludC5TZXREYW1waW5nUmF0aW8odmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfY3JlYXRlSm9pbnREZWY6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRlZiA9IG5ldyBiMi5XaGVlbEpvaW50RGVmKCk7XG4gICAgICAgIGRlZi5sb2NhbEFuY2hvckEgPSBuZXcgYjIuVmVjMih0aGlzLmFuY2hvci54L1BUTV9SQVRJTywgdGhpcy5hbmNob3IueS9QVE1fUkFUSU8pO1xuICAgICAgICBkZWYubG9jYWxBbmNob3JCID0gbmV3IGIyLlZlYzIodGhpcy5jb25uZWN0ZWRBbmNob3IueC9QVE1fUkFUSU8sIHRoaXMuY29ubmVjdGVkQW5jaG9yLnkvUFRNX1JBVElPKTtcbiAgICAgICAgXG4gICAgICAgIGRlZi5sb2NhbEF4aXNBID0gbmV3IGIyLlZlYzIodGhpcy5sb2NhbEF4aXNBLngsIHRoaXMubG9jYWxBeGlzQS55KTtcbiAgICAgICAgXG4gICAgICAgIGRlZi5tYXhNb3RvclRvcnF1ZSA9IHRoaXMubWF4TW90b3JUb3JxdWU7XG4gICAgICAgIGRlZi5tb3RvclNwZWVkID0gdGhpcy5tb3RvclNwZWVkICogQU5HTEVfVE9fUEhZU0lDU19BTkdMRTtcbiAgICAgICAgZGVmLmVuYWJsZU1vdG9yID0gdGhpcy5lbmFibGVNb3RvcjtcblxuICAgICAgICBkZWYuZGFtcGluZ1JhdGlvID0gdGhpcy5kYW1waW5nUmF0aW87XG4gICAgICAgIGRlZi5mcmVxdWVuY3lIeiA9IHRoaXMuZnJlcXVlbmN5O1xuXG4gICAgICAgIHJldHVybiBkZWY7XG4gICAgfVxufSk7XG5cbmNjLldoZWVsSm9pbnQgPSBtb2R1bGUuZXhwb3J0cyA9IFdoZWVsSm9pbnQ7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==