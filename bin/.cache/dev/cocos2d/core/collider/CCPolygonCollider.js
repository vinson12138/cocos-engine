
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/collider/CCPolygonCollider.js';
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

/**
 * !#en Defines a Polygon Collider .
 * !#zh 用来定义多边形碰撞体
 * @class Collider.Polygon
 */
cc.Collider.Polygon = cc.Class({
  properties: {
    threshold: {
      "default": 1,
      serializable: false,
      visible: false
    },
    _offset: cc.v2(0, 0),

    /**
     * !#en Position offset
     * !#zh 位置偏移量
     * @property offset
     * @type {Vec2}
     */
    offset: {
      get: function get() {
        return this._offset;
      },
      set: function set(value) {
        this._offset = value;
      },
      type: cc.Vec2
    },

    /**
     * !#en Polygon points
     * !#zh 多边形顶点数组
     * @property points
     * @type {Vec2[]}
     */
    points: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.points',
      "default": function _default() {
        return [cc.v2(-50, -50), cc.v2(50, -50), cc.v2(50, 50), cc.v2(-50, 50)];
      },
      type: [cc.Vec2]
    }
  },
  resetPointsByContour: CC_EDITOR && function () {
    var PhysicsUtils = Editor.require('scene://utils/physics');

    PhysicsUtils.resetPoints(this, {
      threshold: this.threshold
    });
  }
});
/**
 * !#en Polygon Collider.
 * !#zh 多边形碰撞组件
 * @class PolygonCollider
 * @extends Collider
 * @uses Collider.Polygon
 */

/**
 * !#en
 * Collider info in world coordinate.
 * !#zh
 * 碰撞体的世界坐标系下的信息。
 * @property {ColliderInfo} world
 */

var PolygonCollider = cc.Class({
  name: 'cc.PolygonCollider',
  "extends": cc.Collider,
  mixins: [cc.Collider.Polygon],
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.collider/Polygon Collider',
    inspector: 'packages://inspector/inspectors/comps/physics/points-base-collider.js'
  }
});
cc.PolygonCollider = module.exports = PolygonCollider;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbGxpZGVyL0NDUG9seWdvbkNvbGxpZGVyLmpzIl0sIm5hbWVzIjpbImNjIiwiQ29sbGlkZXIiLCJQb2x5Z29uIiwiQ2xhc3MiLCJwcm9wZXJ0aWVzIiwidGhyZXNob2xkIiwic2VyaWFsaXphYmxlIiwidmlzaWJsZSIsIl9vZmZzZXQiLCJ2MiIsIm9mZnNldCIsImdldCIsInNldCIsInZhbHVlIiwidHlwZSIsIlZlYzIiLCJwb2ludHMiLCJ0b29sdGlwIiwiQ0NfREVWIiwicmVzZXRQb2ludHNCeUNvbnRvdXIiLCJDQ19FRElUT1IiLCJQaHlzaWNzVXRpbHMiLCJFZGl0b3IiLCJyZXF1aXJlIiwicmVzZXRQb2ludHMiLCJQb2x5Z29uQ29sbGlkZXIiLCJuYW1lIiwibWl4aW5zIiwiZWRpdG9yIiwibWVudSIsImluc3BlY3RvciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FBLEVBQUUsQ0FBQ0MsUUFBSCxDQUFZQyxPQUFaLEdBQXNCRixFQUFFLENBQUNHLEtBQUgsQ0FBUztBQUMzQkMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLFNBQVMsRUFBRTtBQUNQLGlCQUFTLENBREY7QUFFUEMsTUFBQUEsWUFBWSxFQUFFLEtBRlA7QUFHUEMsTUFBQUEsT0FBTyxFQUFFO0FBSEYsS0FESDtBQU9SQyxJQUFBQSxPQUFPLEVBQUVSLEVBQUUsQ0FBQ1MsRUFBSCxDQUFNLENBQU4sRUFBUyxDQUFULENBUEQ7O0FBU1I7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1FDLElBQUFBLE1BQU0sRUFBRTtBQUNKQyxNQUFBQSxHQUFHLEVBQUUsZUFBWTtBQUNiLGVBQU8sS0FBS0gsT0FBWjtBQUNILE9BSEc7QUFJSkksTUFBQUEsR0FBRyxFQUFFLGFBQVVDLEtBQVYsRUFBaUI7QUFDbEIsYUFBS0wsT0FBTCxHQUFlSyxLQUFmO0FBQ0gsT0FORztBQU9KQyxNQUFBQSxJQUFJLEVBQUVkLEVBQUUsQ0FBQ2U7QUFQTCxLQWZBOztBQXlCUjtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDUUMsSUFBQUEsTUFBTSxFQUFFO0FBQ0pDLE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxJQUFJLGdEQURmO0FBRUosaUJBQVMsb0JBQVk7QUFDaEIsZUFBTyxDQUFDbEIsRUFBRSxDQUFDUyxFQUFILENBQU0sQ0FBQyxFQUFQLEVBQVUsQ0FBQyxFQUFYLENBQUQsRUFBaUJULEVBQUUsQ0FBQ1MsRUFBSCxDQUFNLEVBQU4sRUFBVSxDQUFDLEVBQVgsQ0FBakIsRUFBaUNULEVBQUUsQ0FBQ1MsRUFBSCxDQUFNLEVBQU4sRUFBUyxFQUFULENBQWpDLEVBQStDVCxFQUFFLENBQUNTLEVBQUgsQ0FBTSxDQUFDLEVBQVAsRUFBVSxFQUFWLENBQS9DLENBQVA7QUFDSixPQUpHO0FBS0pLLE1BQUFBLElBQUksRUFBRSxDQUFDZCxFQUFFLENBQUNlLElBQUo7QUFMRjtBQS9CQSxHQURlO0FBeUMzQkksRUFBQUEsb0JBQW9CLEVBQUVDLFNBQVMsSUFBSSxZQUFZO0FBQzNDLFFBQUlDLFlBQVksR0FBR0MsTUFBTSxDQUFDQyxPQUFQLENBQWUsdUJBQWYsQ0FBbkI7O0FBQ0FGLElBQUFBLFlBQVksQ0FBQ0csV0FBYixDQUF5QixJQUF6QixFQUErQjtBQUFDbkIsTUFBQUEsU0FBUyxFQUFFLEtBQUtBO0FBQWpCLEtBQS9CO0FBQ0g7QUE1QzBCLENBQVQsQ0FBdEI7QUFnREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBSW9CLGVBQWUsR0FBR3pCLEVBQUUsQ0FBQ0csS0FBSCxDQUFTO0FBQzNCdUIsRUFBQUEsSUFBSSxFQUFFLG9CQURxQjtBQUUzQixhQUFTMUIsRUFBRSxDQUFDQyxRQUZlO0FBRzNCMEIsRUFBQUEsTUFBTSxFQUFFLENBQUMzQixFQUFFLENBQUNDLFFBQUgsQ0FBWUMsT0FBYixDQUhtQjtBQUszQjBCLEVBQUFBLE1BQU0sRUFBRVIsU0FBUyxJQUFJO0FBQ2pCUyxJQUFBQSxJQUFJLEVBQUUsb0RBRFc7QUFFakJDLElBQUFBLFNBQVMsRUFBRTtBQUZNO0FBTE0sQ0FBVCxDQUF0QjtBQVdBOUIsRUFBRSxDQUFDeUIsZUFBSCxHQUFxQk0sTUFBTSxDQUFDQyxPQUFQLEdBQWlCUCxlQUF0QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqXG4gKiAhI2VuIERlZmluZXMgYSBQb2x5Z29uIENvbGxpZGVyIC5cbiAqICEjemgg55So5p2l5a6a5LmJ5aSa6L655b2i56Kw5pKe5L2TXG4gKiBAY2xhc3MgQ29sbGlkZXIuUG9seWdvblxuICovXG5jYy5Db2xsaWRlci5Qb2x5Z29uID0gY2MuQ2xhc3Moe1xuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdGhyZXNob2xkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAxLFxuICAgICAgICAgICAgc2VyaWFsaXphYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgX29mZnNldDogY2MudjIoMCwgMCksXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gUG9zaXRpb24gb2Zmc2V0XG4gICAgICAgICAqICEjemgg5L2N572u5YGP56e76YePXG4gICAgICAgICAqIEBwcm9wZXJ0eSBvZmZzZXRcbiAgICAgICAgICogQHR5cGUge1ZlYzJ9XG4gICAgICAgICAqL1xuICAgICAgICBvZmZzZXQ6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9vZmZzZXQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vZmZzZXQgPSB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBjYy5WZWMyXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gUG9seWdvbiBwb2ludHNcbiAgICAgICAgICogISN6aCDlpJrovrnlvaLpobbngrnmlbDnu4RcbiAgICAgICAgICogQHByb3BlcnR5IHBvaW50c1xuICAgICAgICAgKiBAdHlwZSB7VmVjMltdfVxuICAgICAgICAgKi9cbiAgICAgICAgcG9pbnRzOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5wb2ludHMnLFxuICAgICAgICAgICAgZGVmYXVsdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICByZXR1cm4gW2NjLnYyKC01MCwtNTApLCBjYy52Mig1MCwgLTUwKSwgY2MudjIoNTAsNTApLCBjYy52MigtNTAsNTApXTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBbY2MuVmVjMl1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZXNldFBvaW50c0J5Q29udG91cjogQ0NfRURJVE9SICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIFBoeXNpY3NVdGlscyA9IEVkaXRvci5yZXF1aXJlKCdzY2VuZTovL3V0aWxzL3BoeXNpY3MnKTtcbiAgICAgICAgUGh5c2ljc1V0aWxzLnJlc2V0UG9pbnRzKHRoaXMsIHt0aHJlc2hvbGQ6IHRoaXMudGhyZXNob2xkfSk7XG4gICAgfVxufSk7XG5cblxuLyoqXG4gKiAhI2VuIFBvbHlnb24gQ29sbGlkZXIuXG4gKiAhI3poIOWkmui+ueW9oueisOaSnue7hOS7tlxuICogQGNsYXNzIFBvbHlnb25Db2xsaWRlclxuICogQGV4dGVuZHMgQ29sbGlkZXJcbiAqIEB1c2VzIENvbGxpZGVyLlBvbHlnb25cbiAqL1xuLyoqXG4gKiAhI2VuXG4gKiBDb2xsaWRlciBpbmZvIGluIHdvcmxkIGNvb3JkaW5hdGUuXG4gKiAhI3poXG4gKiDnorDmkp7kvZPnmoTkuJbnlYzlnZDmoIfns7vkuIvnmoTkv6Hmga/jgIJcbiAqIEBwcm9wZXJ0eSB7Q29sbGlkZXJJbmZvfSB3b3JsZFxuICovXG52YXIgUG9seWdvbkNvbGxpZGVyID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5Qb2x5Z29uQ29sbGlkZXInLFxuICAgIGV4dGVuZHM6IGNjLkNvbGxpZGVyLFxuICAgIG1peGluczogW2NjLkNvbGxpZGVyLlBvbHlnb25dLFxuXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LmNvbGxpZGVyL1BvbHlnb24gQ29sbGlkZXInLFxuICAgICAgICBpbnNwZWN0b3I6ICdwYWNrYWdlczovL2luc3BlY3Rvci9pbnNwZWN0b3JzL2NvbXBzL3BoeXNpY3MvcG9pbnRzLWJhc2UtY29sbGlkZXIuanMnLFxuICAgIH0sXG59KTtcblxuY2MuUG9seWdvbkNvbGxpZGVyID0gbW9kdWxlLmV4cG9ydHMgPSBQb2x5Z29uQ29sbGlkZXI7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==