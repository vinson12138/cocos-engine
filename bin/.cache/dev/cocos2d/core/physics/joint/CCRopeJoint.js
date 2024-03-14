
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/joint/CCRopeJoint.js';
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
/**
 * !#en
 * A rope joint enforces a maximum distance between two points
 * on two bodies. It has no other effect.
 * Warning: if you attempt to change the maximum length during
 * the simulation you will get some non-physical behavior.
 * !#zh
 * 绳子关节只指定两个刚体间的最大距离，没有其他的效果。
 * 注意：如果你试图动态修改关节的长度，这有可能会得到一些意外的效果。
 * @class RopeJoint
 * @extends Joint
 */


var RopeJoint = cc.Class({
  name: 'cc.RopeJoint',
  "extends": cc.Joint,
  editor: CC_EDITOR && {
    inspector: 'packages://inspector/inspectors/comps/physics/joint.js',
    menu: 'i18n:MAIN_MENU.component.physics/Joint/Rope'
  },
  properties: {
    _maxLength: 1,

    /**
     * !#en
     * The max length.
     * !#zh
     * 最大长度。
     * @property {Number} maxLength
     * @default 1
     */
    maxLength: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.maxLength',
      get: function get() {
        return this._maxLength;
      },
      set: function set(value) {
        this._maxLength = value;

        if (this._joint) {
          this._joint.SetMaxLength(value);
        }
      }
    }
  },
  _createJointDef: function _createJointDef() {
    var def = new b2.RopeJointDef();
    def.localAnchorA = new b2.Vec2(this.anchor.x / PTM_RATIO, this.anchor.y / PTM_RATIO);
    def.localAnchorB = new b2.Vec2(this.connectedAnchor.x / PTM_RATIO, this.connectedAnchor.y / PTM_RATIO);
    def.maxLength = this.maxLength / PTM_RATIO;
    return def;
  }
});
cc.RopeJoint = module.exports = RopeJoint;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BoeXNpY3Mvam9pbnQvQ0NSb3BlSm9pbnQuanMiXSwibmFtZXMiOlsiUFRNX1JBVElPIiwicmVxdWlyZSIsIlJvcGVKb2ludCIsImNjIiwiQ2xhc3MiLCJuYW1lIiwiSm9pbnQiLCJlZGl0b3IiLCJDQ19FRElUT1IiLCJpbnNwZWN0b3IiLCJtZW51IiwicHJvcGVydGllcyIsIl9tYXhMZW5ndGgiLCJtYXhMZW5ndGgiLCJ0b29sdGlwIiwiQ0NfREVWIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJfam9pbnQiLCJTZXRNYXhMZW5ndGgiLCJfY3JlYXRlSm9pbnREZWYiLCJkZWYiLCJiMiIsIlJvcGVKb2ludERlZiIsImxvY2FsQW5jaG9yQSIsIlZlYzIiLCJhbmNob3IiLCJ4IiwieSIsImxvY2FsQW5jaG9yQiIsImNvbm5lY3RlZEFuY2hvciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQUlBLFNBQVMsR0FBR0MsT0FBTyxDQUFDLG1CQUFELENBQVAsQ0FBNkJELFNBQTdDO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFJRSxTQUFTLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ3JCQyxFQUFBQSxJQUFJLEVBQUUsY0FEZTtBQUVyQixhQUFTRixFQUFFLENBQUNHLEtBRlM7QUFJckJDLEVBQUFBLE1BQU0sRUFBRUMsU0FBUyxJQUFJO0FBQ2pCQyxJQUFBQSxTQUFTLEVBQUUsd0RBRE07QUFFakJDLElBQUFBLElBQUksRUFBRTtBQUZXLEdBSkE7QUFTckJDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxVQUFVLEVBQUUsQ0FESjs7QUFHUjtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1FDLElBQUFBLFNBQVMsRUFBRTtBQUNQQyxNQUFBQSxPQUFPLEVBQUVDLE1BQU0sSUFBSSxtREFEWjtBQUVQQyxNQUFBQSxHQUFHLEVBQUUsZUFBWTtBQUNiLGVBQU8sS0FBS0osVUFBWjtBQUNILE9BSk07QUFLUEssTUFBQUEsR0FBRyxFQUFFLGFBQVVDLEtBQVYsRUFBaUI7QUFDbEIsYUFBS04sVUFBTCxHQUFrQk0sS0FBbEI7O0FBQ0EsWUFBSSxLQUFLQyxNQUFULEVBQWlCO0FBQ2IsZUFBS0EsTUFBTCxDQUFZQyxZQUFaLENBQXlCRixLQUF6QjtBQUNIO0FBQ0o7QUFWTTtBQVhILEdBVFM7QUFtQ3JCRyxFQUFBQSxlQUFlLEVBQUUsMkJBQVk7QUFDekIsUUFBSUMsR0FBRyxHQUFHLElBQUlDLEVBQUUsQ0FBQ0MsWUFBUCxFQUFWO0FBQ0FGLElBQUFBLEdBQUcsQ0FBQ0csWUFBSixHQUFtQixJQUFJRixFQUFFLENBQUNHLElBQVAsQ0FBWSxLQUFLQyxNQUFMLENBQVlDLENBQVosR0FBYzVCLFNBQTFCLEVBQXFDLEtBQUsyQixNQUFMLENBQVlFLENBQVosR0FBYzdCLFNBQW5ELENBQW5CO0FBQ0FzQixJQUFBQSxHQUFHLENBQUNRLFlBQUosR0FBbUIsSUFBSVAsRUFBRSxDQUFDRyxJQUFQLENBQVksS0FBS0ssZUFBTCxDQUFxQkgsQ0FBckIsR0FBdUI1QixTQUFuQyxFQUE4QyxLQUFLK0IsZUFBTCxDQUFxQkYsQ0FBckIsR0FBdUI3QixTQUFyRSxDQUFuQjtBQUNBc0IsSUFBQUEsR0FBRyxDQUFDVCxTQUFKLEdBQWdCLEtBQUtBLFNBQUwsR0FBZWIsU0FBL0I7QUFFQSxXQUFPc0IsR0FBUDtBQUNIO0FBMUNvQixDQUFULENBQWhCO0FBNkNBbkIsRUFBRSxDQUFDRCxTQUFILEdBQWU4QixNQUFNLENBQUNDLE9BQVAsR0FBaUIvQixTQUFoQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxudmFyIFBUTV9SQVRJTyA9IHJlcXVpcmUoJy4uL0NDUGh5c2ljc1R5cGVzJykuUFRNX1JBVElPO1xuXG4vKipcbiAqICEjZW5cbiAqIEEgcm9wZSBqb2ludCBlbmZvcmNlcyBhIG1heGltdW0gZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzXG4gKiBvbiB0d28gYm9kaWVzLiBJdCBoYXMgbm8gb3RoZXIgZWZmZWN0LlxuICogV2FybmluZzogaWYgeW91IGF0dGVtcHQgdG8gY2hhbmdlIHRoZSBtYXhpbXVtIGxlbmd0aCBkdXJpbmdcbiAqIHRoZSBzaW11bGF0aW9uIHlvdSB3aWxsIGdldCBzb21lIG5vbi1waHlzaWNhbCBiZWhhdmlvci5cbiAqICEjemhcbiAqIOe7s+WtkOWFs+iKguWPquaMh+WumuS4pOS4quWImuS9k+mXtOeahOacgOWkp+i3neemu++8jOayoeacieWFtuS7lueahOaViOaenOOAglxuICog5rOo5oSP77ya5aaC5p6c5L2g6K+V5Zu+5Yqo5oCB5L+u5pS55YWz6IqC55qE6ZW/5bqm77yM6L+Z5pyJ5Y+v6IO95Lya5b6X5Yiw5LiA5Lqb5oSP5aSW55qE5pWI5p6c44CCXG4gKiBAY2xhc3MgUm9wZUpvaW50XG4gKiBAZXh0ZW5kcyBKb2ludFxuICovXG52YXIgUm9wZUpvaW50ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5Sb3BlSm9pbnQnLFxuICAgIGV4dGVuZHM6IGNjLkpvaW50LFxuICAgIFxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9waHlzaWNzL2pvaW50LmpzJyxcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5waHlzaWNzL0pvaW50L1JvcGUnLFxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF9tYXhMZW5ndGg6IDEsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIG1heCBsZW5ndGguXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5pyA5aSn6ZW/5bqm44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBtYXhMZW5ndGhcbiAgICAgICAgICogQGRlZmF1bHQgMVxuICAgICAgICAgKi9cbiAgICAgICAgbWF4TGVuZ3RoOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5tYXhMZW5ndGgnLFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21heExlbmd0aDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21heExlbmd0aCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9qb2ludCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9qb2ludC5TZXRNYXhMZW5ndGgodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgIH0sXG5cbiAgICBfY3JlYXRlSm9pbnREZWY6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRlZiA9IG5ldyBiMi5Sb3BlSm9pbnREZWYoKTtcbiAgICAgICAgZGVmLmxvY2FsQW5jaG9yQSA9IG5ldyBiMi5WZWMyKHRoaXMuYW5jaG9yLngvUFRNX1JBVElPLCB0aGlzLmFuY2hvci55L1BUTV9SQVRJTyk7XG4gICAgICAgIGRlZi5sb2NhbEFuY2hvckIgPSBuZXcgYjIuVmVjMih0aGlzLmNvbm5lY3RlZEFuY2hvci54L1BUTV9SQVRJTywgdGhpcy5jb25uZWN0ZWRBbmNob3IueS9QVE1fUkFUSU8pO1xuICAgICAgICBkZWYubWF4TGVuZ3RoID0gdGhpcy5tYXhMZW5ndGgvUFRNX1JBVElPO1xuXG4gICAgICAgIHJldHVybiBkZWY7XG4gICAgfVxufSk7XG5cbmNjLlJvcGVKb2ludCA9IG1vZHVsZS5leHBvcnRzID0gUm9wZUpvaW50O1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=