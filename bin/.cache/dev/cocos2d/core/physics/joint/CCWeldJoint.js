
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/joint/CCWeldJoint.js';
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
 * A weld joint essentially glues two bodies together. A weld joint may
 * distort somewhat because the island constraint solver is approximate.
 * !#zh
 * 熔接关节相当于将两个刚体粘在了一起。
 * 熔接关节可能会使某些东西失真，因为约束求解器算出的都是近似值。
 * @class WeldJoint
 * @extends Joint
 */


var WeldJoint = cc.Class({
  name: 'cc.WeldJoint',
  "extends": cc.Joint,
  editor: CC_EDITOR && {
    inspector: 'packages://inspector/inspectors/comps/physics/joint.js',
    menu: 'i18n:MAIN_MENU.component.physics/Joint/Weld'
  },
  properties: {
    /**
     * !#en
     * The reference angle.
     * !#zh
     * 相对角度。
     * @property {Number} referenceAngle
     * @default 0
     */
    referenceAngle: {
      "default": 0,
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.referenceAngle'
    },
    _frequency: 0,
    _dampingRatio: 0,

    /**
     * !#en
     * The frequency.
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
          this._joint.SetFrequency(value);
        }
      }
    },

    /**
     * !#en
     * The damping ratio.
     * !#zh
     * 阻尼，表示关节变形后，恢复到初始状态受到的阻力。
     * @property {Number} dampingRatio
     * @property 0
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
    var def = new b2.WeldJointDef();
    def.localAnchorA = new b2.Vec2(this.anchor.x / PTM_RATIO, this.anchor.y / PTM_RATIO);
    def.localAnchorB = new b2.Vec2(this.connectedAnchor.x / PTM_RATIO, this.connectedAnchor.y / PTM_RATIO);
    def.referenceAngle = this.referenceAngle * ANGLE_TO_PHYSICS_ANGLE;
    def.frequencyHz = this.frequency;
    def.dampingRatio = this.dampingRatio;
    return def;
  }
});
cc.WeldJoint = module.exports = WeldJoint;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BoeXNpY3Mvam9pbnQvQ0NXZWxkSm9pbnQuanMiXSwibmFtZXMiOlsiUFRNX1JBVElPIiwicmVxdWlyZSIsIkFOR0xFX1RPX1BIWVNJQ1NfQU5HTEUiLCJXZWxkSm9pbnQiLCJjYyIsIkNsYXNzIiwibmFtZSIsIkpvaW50IiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwiaW5zcGVjdG9yIiwibWVudSIsInByb3BlcnRpZXMiLCJyZWZlcmVuY2VBbmdsZSIsInRvb2x0aXAiLCJDQ19ERVYiLCJfZnJlcXVlbmN5IiwiX2RhbXBpbmdSYXRpbyIsImZyZXF1ZW5jeSIsImdldCIsInNldCIsInZhbHVlIiwiX2pvaW50IiwiU2V0RnJlcXVlbmN5IiwiZGFtcGluZ1JhdGlvIiwiU2V0RGFtcGluZ1JhdGlvIiwiX2NyZWF0ZUpvaW50RGVmIiwiZGVmIiwiYjIiLCJXZWxkSm9pbnREZWYiLCJsb2NhbEFuY2hvckEiLCJWZWMyIiwiYW5jaG9yIiwieCIsInkiLCJsb2NhbEFuY2hvckIiLCJjb25uZWN0ZWRBbmNob3IiLCJmcmVxdWVuY3lIeiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQUlBLFNBQVMsR0FBR0MsT0FBTyxDQUFDLG1CQUFELENBQVAsQ0FBNkJELFNBQTdDOztBQUNBLElBQUlFLHNCQUFzQixHQUFHRCxPQUFPLENBQUMsbUJBQUQsQ0FBUCxDQUE2QkMsc0JBQTFEO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQUlDLFNBQVMsR0FBR0MsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDckJDLEVBQUFBLElBQUksRUFBRSxjQURlO0FBRXJCLGFBQVNGLEVBQUUsQ0FBQ0csS0FGUztBQUlyQkMsRUFBQUEsTUFBTSxFQUFFQyxTQUFTLElBQUk7QUFDakJDLElBQUFBLFNBQVMsRUFBRSx3REFETTtBQUVqQkMsSUFBQUEsSUFBSSxFQUFFO0FBRlcsR0FKQTtBQVNyQkMsRUFBQUEsVUFBVSxFQUFFO0FBQ1I7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNRQyxJQUFBQSxjQUFjLEVBQUU7QUFDWixpQkFBUyxDQURHO0FBRVpDLE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxJQUFJO0FBRlAsS0FUUjtBQWNSQyxJQUFBQSxVQUFVLEVBQUUsQ0FkSjtBQWVSQyxJQUFBQSxhQUFhLEVBQUUsQ0FmUDs7QUFpQlI7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNRQyxJQUFBQSxTQUFTLEVBQUU7QUFDUEosTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUksbURBRFo7QUFFUEksTUFBQUEsR0FBRyxFQUFFLGVBQVk7QUFDYixlQUFPLEtBQUtILFVBQVo7QUFDSCxPQUpNO0FBS1BJLE1BQUFBLEdBQUcsRUFBRSxhQUFVQyxLQUFWLEVBQWlCO0FBQ2xCLGFBQUtMLFVBQUwsR0FBa0JLLEtBQWxCOztBQUNBLFlBQUksS0FBS0MsTUFBVCxFQUFpQjtBQUNiLGVBQUtBLE1BQUwsQ0FBWUMsWUFBWixDQUF5QkYsS0FBekI7QUFDSDtBQUNKO0FBVk0sS0F6Qkg7O0FBc0NSO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDUUcsSUFBQUEsWUFBWSxFQUFFO0FBQ1ZWLE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxJQUFJLHNEQURUO0FBRVZJLE1BQUFBLEdBQUcsRUFBRSxlQUFZO0FBQ2IsZUFBTyxLQUFLRixhQUFaO0FBQ0gsT0FKUztBQUtWRyxNQUFBQSxHQUFHLEVBQUUsYUFBVUMsS0FBVixFQUFpQjtBQUNsQixhQUFLSixhQUFMLEdBQXFCSSxLQUFyQjs7QUFDQSxZQUFJLEtBQUtDLE1BQVQsRUFBaUI7QUFDYixlQUFLQSxNQUFMLENBQVlHLGVBQVosQ0FBNEJKLEtBQTVCO0FBQ0g7QUFDSjtBQVZTO0FBOUNOLEdBVFM7QUFxRXJCSyxFQUFBQSxlQUFlLEVBQUUsMkJBQVk7QUFDekIsUUFBSUMsR0FBRyxHQUFHLElBQUlDLEVBQUUsQ0FBQ0MsWUFBUCxFQUFWO0FBQ0FGLElBQUFBLEdBQUcsQ0FBQ0csWUFBSixHQUFtQixJQUFJRixFQUFFLENBQUNHLElBQVAsQ0FBWSxLQUFLQyxNQUFMLENBQVlDLENBQVosR0FBY2pDLFNBQTFCLEVBQXFDLEtBQUtnQyxNQUFMLENBQVlFLENBQVosR0FBY2xDLFNBQW5ELENBQW5CO0FBQ0EyQixJQUFBQSxHQUFHLENBQUNRLFlBQUosR0FBbUIsSUFBSVAsRUFBRSxDQUFDRyxJQUFQLENBQVksS0FBS0ssZUFBTCxDQUFxQkgsQ0FBckIsR0FBdUJqQyxTQUFuQyxFQUE4QyxLQUFLb0MsZUFBTCxDQUFxQkYsQ0FBckIsR0FBdUJsQyxTQUFyRSxDQUFuQjtBQUNBMkIsSUFBQUEsR0FBRyxDQUFDZCxjQUFKLEdBQXFCLEtBQUtBLGNBQUwsR0FBc0JYLHNCQUEzQztBQUVBeUIsSUFBQUEsR0FBRyxDQUFDVSxXQUFKLEdBQWtCLEtBQUtuQixTQUF2QjtBQUNBUyxJQUFBQSxHQUFHLENBQUNILFlBQUosR0FBbUIsS0FBS0EsWUFBeEI7QUFFQSxXQUFPRyxHQUFQO0FBQ0g7QUEvRW9CLENBQVQsQ0FBaEI7QUFrRkF2QixFQUFFLENBQUNELFNBQUgsR0FBZW1DLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnBDLFNBQWhDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG52YXIgUFRNX1JBVElPID0gcmVxdWlyZSgnLi4vQ0NQaHlzaWNzVHlwZXMnKS5QVE1fUkFUSU87XG52YXIgQU5HTEVfVE9fUEhZU0lDU19BTkdMRSA9IHJlcXVpcmUoJy4uL0NDUGh5c2ljc1R5cGVzJykuQU5HTEVfVE9fUEhZU0lDU19BTkdMRTtcblxuLyoqXG4gKiAhI2VuXG4gKiBBIHdlbGQgam9pbnQgZXNzZW50aWFsbHkgZ2x1ZXMgdHdvIGJvZGllcyB0b2dldGhlci4gQSB3ZWxkIGpvaW50IG1heVxuICogZGlzdG9ydCBzb21ld2hhdCBiZWNhdXNlIHRoZSBpc2xhbmQgY29uc3RyYWludCBzb2x2ZXIgaXMgYXBwcm94aW1hdGUuXG4gKiAhI3poXG4gKiDnhpTmjqXlhbPoioLnm7jlvZPkuo7lsIbkuKTkuKrliJrkvZPnspjlnKjkuobkuIDotbfjgIJcbiAqIOeGlOaOpeWFs+iKguWPr+iDveS8muS9v+afkOS6m+S4nOilv+Wkseecn++8jOWboOS4uue6puadn+axguino+WZqOeul+WHuueahOmDveaYr+i/keS8vOWAvOOAglxuICogQGNsYXNzIFdlbGRKb2ludFxuICogQGV4dGVuZHMgSm9pbnRcbiAqL1xudmFyIFdlbGRKb2ludCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuV2VsZEpvaW50JyxcbiAgICBleHRlbmRzOiBjYy5Kb2ludCxcbiAgICBcbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIGluc3BlY3RvcjogJ3BhY2thZ2VzOi8vaW5zcGVjdG9yL2luc3BlY3RvcnMvY29tcHMvcGh5c2ljcy9qb2ludC5qcycsXG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQucGh5c2ljcy9Kb2ludC9XZWxkJyxcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgcmVmZXJlbmNlIGFuZ2xlLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOebuOWvueinkuW6puOAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gcmVmZXJlbmNlQW5nbGVcbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgcmVmZXJlbmNlQW5nbGU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5yZWZlcmVuY2VBbmdsZScgICAgICAgICAgICBcbiAgICAgICAgfSxcblxuICAgICAgICBfZnJlcXVlbmN5OiAwLFxuICAgICAgICBfZGFtcGluZ1JhdGlvOiAwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBmcmVxdWVuY3kuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5by55oCn57O75pWw44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBmcmVxdWVuY3lcbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgZnJlcXVlbmN5OiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5mcmVxdWVuY3knLFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZyZXF1ZW5jeTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZyZXF1ZW5jeSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9qb2ludCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9qb2ludC5TZXRGcmVxdWVuY3kodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgZGFtcGluZyByYXRpby5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDpmLvlsLzvvIzooajnpLrlhbPoioLlj5jlvaLlkI7vvIzmgaLlpI3liLDliJ3lp4vnirbmgIHlj5fliLDnmoTpmLvlipvjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGRhbXBpbmdSYXRpb1xuICAgICAgICAgKiBAcHJvcGVydHkgMFxuICAgICAgICAgKi9cbiAgICAgICAgZGFtcGluZ1JhdGlvOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5kYW1waW5nUmF0aW8nLCAgICAgICAgICAgIFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhbXBpbmdSYXRpbztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RhbXBpbmdSYXRpbyA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9qb2ludCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9qb2ludC5TZXREYW1waW5nUmF0aW8odmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfY3JlYXRlSm9pbnREZWY6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRlZiA9IG5ldyBiMi5XZWxkSm9pbnREZWYoKTtcbiAgICAgICAgZGVmLmxvY2FsQW5jaG9yQSA9IG5ldyBiMi5WZWMyKHRoaXMuYW5jaG9yLngvUFRNX1JBVElPLCB0aGlzLmFuY2hvci55L1BUTV9SQVRJTyk7XG4gICAgICAgIGRlZi5sb2NhbEFuY2hvckIgPSBuZXcgYjIuVmVjMih0aGlzLmNvbm5lY3RlZEFuY2hvci54L1BUTV9SQVRJTywgdGhpcy5jb25uZWN0ZWRBbmNob3IueS9QVE1fUkFUSU8pO1xuICAgICAgICBkZWYucmVmZXJlbmNlQW5nbGUgPSB0aGlzLnJlZmVyZW5jZUFuZ2xlICogQU5HTEVfVE9fUEhZU0lDU19BTkdMRTtcblxuICAgICAgICBkZWYuZnJlcXVlbmN5SHogPSB0aGlzLmZyZXF1ZW5jeTtcbiAgICAgICAgZGVmLmRhbXBpbmdSYXRpbyA9IHRoaXMuZGFtcGluZ1JhdGlvO1xuXG4gICAgICAgIHJldHVybiBkZWY7XG4gICAgfVxufSk7XG5cbmNjLldlbGRKb2ludCA9IG1vZHVsZS5leHBvcnRzID0gV2VsZEpvaW50O1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=