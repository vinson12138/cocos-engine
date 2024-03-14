
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/collider/CCCircleCollider.js';
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
 * !#en Defines a Circle Collider .
 * !#zh 用来定义圆形碰撞体
 * @class Collider.Circle
 */
cc.Collider.Circle = cc.Class({
  properties: {
    _offset: cc.v2(0, 0),
    _radius: 50,

    /**
     * !#en Position offset
     * !#zh 位置偏移量
     * @property offset
     * @type {Vec2}
     */
    offset: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.offset',
      get: function get() {
        return this._offset;
      },
      set: function set(value) {
        this._offset = value;
      },
      type: cc.Vec2
    },

    /**
     * !#en Circle radius
     * !#zh 圆形半径
     * @property radius
     * @type {Number}
     */
    radius: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.radius',
      get: function get() {
        return this._radius;
      },
      set: function set(value) {
        this._radius = value < 0 ? 0 : value;
      }
    }
  },
  resetInEditor: CC_EDITOR && function (didResetToDefault) {
    if (didResetToDefault) {
      var size = this.node.getContentSize();
      var radius = Math.max(size.width, size.height);

      if (radius !== 0) {
        this.radius = radius;
      }
    }
  }
});
/**
 * !#en Circle Collider.
 * !#zh 圆形碰撞组件
 * @class CircleCollider
 * @extends Collider
 * @uses Collider.Circle
 */

/**
 * !#en
 * Collider info in world coordinate.
 * !#zh
 * 碰撞体的世界坐标系下的信息。
 * @property {ColliderInfo} world
 */

var CircleCollider = cc.Class({
  name: 'cc.CircleCollider',
  "extends": cc.Collider,
  mixins: [cc.Collider.Circle],
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.collider/Circle Collider'
  }
});
cc.CircleCollider = module.exports = CircleCollider;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbGxpZGVyL0NDQ2lyY2xlQ29sbGlkZXIuanMiXSwibmFtZXMiOlsiY2MiLCJDb2xsaWRlciIsIkNpcmNsZSIsIkNsYXNzIiwicHJvcGVydGllcyIsIl9vZmZzZXQiLCJ2MiIsIl9yYWRpdXMiLCJvZmZzZXQiLCJ0b29sdGlwIiwiQ0NfREVWIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJ0eXBlIiwiVmVjMiIsInJhZGl1cyIsInJlc2V0SW5FZGl0b3IiLCJDQ19FRElUT1IiLCJkaWRSZXNldFRvRGVmYXVsdCIsInNpemUiLCJub2RlIiwiZ2V0Q29udGVudFNpemUiLCJNYXRoIiwibWF4Iiwid2lkdGgiLCJoZWlnaHQiLCJDaXJjbGVDb2xsaWRlciIsIm5hbWUiLCJtaXhpbnMiLCJlZGl0b3IiLCJtZW51IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUEsRUFBRSxDQUFDQyxRQUFILENBQVlDLE1BQVosR0FBcUJGLEVBQUUsQ0FBQ0csS0FBSCxDQUFTO0FBQzFCQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsT0FBTyxFQUFFTCxFQUFFLENBQUNNLEVBQUgsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUREO0FBRVJDLElBQUFBLE9BQU8sRUFBRSxFQUZEOztBQUlSO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNRQyxJQUFBQSxNQUFNLEVBQUU7QUFDSkMsTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUksZ0RBRGY7QUFFSkMsTUFBQUEsR0FBRyxFQUFFLGVBQVk7QUFDYixlQUFPLEtBQUtOLE9BQVo7QUFDSCxPQUpHO0FBS0pPLE1BQUFBLEdBQUcsRUFBRSxhQUFVQyxLQUFWLEVBQWlCO0FBQ2xCLGFBQUtSLE9BQUwsR0FBZVEsS0FBZjtBQUNILE9BUEc7QUFRSkMsTUFBQUEsSUFBSSxFQUFFZCxFQUFFLENBQUNlO0FBUkwsS0FWQTs7QUFxQlI7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1FDLElBQUFBLE1BQU0sRUFBRTtBQUNKUCxNQUFBQSxPQUFPLEVBQUVDLE1BQU0sSUFBSSxnREFEZjtBQUVKQyxNQUFBQSxHQUFHLEVBQUUsZUFBWTtBQUNiLGVBQU8sS0FBS0osT0FBWjtBQUNILE9BSkc7QUFLSkssTUFBQUEsR0FBRyxFQUFFLGFBQVVDLEtBQVYsRUFBaUI7QUFDbEIsYUFBS04sT0FBTCxHQUFlTSxLQUFLLEdBQUcsQ0FBUixHQUFZLENBQVosR0FBZ0JBLEtBQS9CO0FBQ0g7QUFQRztBQTNCQSxHQURjO0FBdUMxQkksRUFBQUEsYUFBYSxFQUFFQyxTQUFTLElBQUksVUFBVUMsaUJBQVYsRUFBNkI7QUFDckQsUUFBSUEsaUJBQUosRUFBdUI7QUFDbkIsVUFBSUMsSUFBSSxHQUFHLEtBQUtDLElBQUwsQ0FBVUMsY0FBVixFQUFYO0FBQ0EsVUFBSU4sTUFBTSxHQUFHTyxJQUFJLENBQUNDLEdBQUwsQ0FBU0osSUFBSSxDQUFDSyxLQUFkLEVBQXFCTCxJQUFJLENBQUNNLE1BQTFCLENBQWI7O0FBQ0EsVUFBSVYsTUFBTSxLQUFLLENBQWYsRUFBa0I7QUFDZCxhQUFLQSxNQUFMLEdBQWNBLE1BQWQ7QUFDSDtBQUNKO0FBQ0o7QUEvQ3lCLENBQVQsQ0FBckI7QUFrREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBSVcsY0FBYyxHQUFHM0IsRUFBRSxDQUFDRyxLQUFILENBQVM7QUFDMUJ5QixFQUFBQSxJQUFJLEVBQUUsbUJBRG9CO0FBRTFCLGFBQVM1QixFQUFFLENBQUNDLFFBRmM7QUFHMUI0QixFQUFBQSxNQUFNLEVBQUUsQ0FBQzdCLEVBQUUsQ0FBQ0MsUUFBSCxDQUFZQyxNQUFiLENBSGtCO0FBSzFCNEIsRUFBQUEsTUFBTSxFQUFFWixTQUFTLElBQUk7QUFDakJhLElBQUFBLElBQUksRUFBRTtBQURXO0FBTEssQ0FBVCxDQUFyQjtBQVVBL0IsRUFBRSxDQUFDMkIsY0FBSCxHQUFvQkssTUFBTSxDQUFDQyxPQUFQLEdBQWlCTixjQUFyQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqXG4gKiAhI2VuIERlZmluZXMgYSBDaXJjbGUgQ29sbGlkZXIgLlxuICogISN6aCDnlKjmnaXlrprkuYnlnIblvaLnorDmkp7kvZNcbiAqIEBjbGFzcyBDb2xsaWRlci5DaXJjbGVcbiAqL1xuY2MuQ29sbGlkZXIuQ2lyY2xlID0gY2MuQ2xhc3Moe1xuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX29mZnNldDogY2MudjIoMCwgMCksXG4gICAgICAgIF9yYWRpdXM6IDUwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFBvc2l0aW9uIG9mZnNldFxuICAgICAgICAgKiAhI3poIOS9jee9ruWBj+enu+mHj1xuICAgICAgICAgKiBAcHJvcGVydHkgb2Zmc2V0XG4gICAgICAgICAqIEB0eXBlIHtWZWMyfVxuICAgICAgICAgKi9cbiAgICAgICAgb2Zmc2V0OiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5vZmZzZXQnLFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29mZnNldDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX29mZnNldCA9IHZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IGNjLlZlYzJcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBDaXJjbGUgcmFkaXVzXG4gICAgICAgICAqICEjemgg5ZyG5b2i5Y2K5b6EXG4gICAgICAgICAqIEBwcm9wZXJ0eSByYWRpdXNcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIHJhZGl1czoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnBoeXNpY3NfY29sbGlkZXIucmFkaXVzJyxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yYWRpdXM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yYWRpdXMgPSB2YWx1ZSA8IDAgPyAwIDogdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVzZXRJbkVkaXRvcjogQ0NfRURJVE9SICYmIGZ1bmN0aW9uIChkaWRSZXNldFRvRGVmYXVsdCkge1xuICAgICAgICBpZiAoZGlkUmVzZXRUb0RlZmF1bHQpIHtcbiAgICAgICAgICAgIHZhciBzaXplID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCk7XG4gICAgICAgICAgICB2YXIgcmFkaXVzID0gTWF0aC5tYXgoc2l6ZS53aWR0aCwgc2l6ZS5oZWlnaHQpO1xuICAgICAgICAgICAgaWYgKHJhZGl1cyAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlbiBDaXJjbGUgQ29sbGlkZXIuXG4gKiAhI3poIOWchuW9oueisOaSnue7hOS7tlxuICogQGNsYXNzIENpcmNsZUNvbGxpZGVyXG4gKiBAZXh0ZW5kcyBDb2xsaWRlclxuICogQHVzZXMgQ29sbGlkZXIuQ2lyY2xlXG4gKi9cbi8qKlxuICogISNlblxuICogQ29sbGlkZXIgaW5mbyBpbiB3b3JsZCBjb29yZGluYXRlLlxuICogISN6aFxuICog56Kw5pKe5L2T55qE5LiW55WM5Z2Q5qCH57O75LiL55qE5L+h5oGv44CCXG4gKiBAcHJvcGVydHkge0NvbGxpZGVySW5mb30gd29ybGRcbiAqL1xudmFyIENpcmNsZUNvbGxpZGVyID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5DaXJjbGVDb2xsaWRlcicsXG4gICAgZXh0ZW5kczogY2MuQ29sbGlkZXIsXG4gICAgbWl4aW5zOiBbY2MuQ29sbGlkZXIuQ2lyY2xlXSxcblxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5jb2xsaWRlci9DaXJjbGUgQ29sbGlkZXInXG4gICAgfSxcbn0pO1xuXG5jYy5DaXJjbGVDb2xsaWRlciA9IG1vZHVsZS5leHBvcnRzID0gQ2lyY2xlQ29sbGlkZXI7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==