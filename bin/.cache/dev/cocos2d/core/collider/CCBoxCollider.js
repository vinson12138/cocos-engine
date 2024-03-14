
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/collider/CCBoxCollider.js';
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
 * !#en Defines a Box Collider .
 * !#zh 用来定义包围盒碰撞体
 * @class Collider.Box
 */
cc.Collider.Box = cc.Class({
  properties: {
    _offset: cc.v2(0, 0),
    _size: cc.size(100, 100),

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
     * !#en Box size
     * !#zh 包围盒大小
     * @property size
     * @type {Size}
     */
    size: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.size',
      get: function get() {
        return this._size;
      },
      set: function set(value) {
        this._size.width = value.width < 0 ? 0 : value.width;
        this._size.height = value.height < 0 ? 0 : value.height;
      },
      type: cc.Size
    }
  },
  resetInEditor: CC_EDITOR && function (didResetToDefault) {
    if (didResetToDefault) {
      var size = this.node.getContentSize();

      if (size.width !== 0 && size.height !== 0) {
        this.size = cc.size(size);
        this.offset.x = (0.5 - this.node.anchorX) * size.width;
        this.offset.y = (0.5 - this.node.anchorY) * size.height;
      }
    }
  }
});
/**
 * !#en Box Collider.
 * !#zh 包围盒碰撞组件
 * @class BoxCollider
 * @extends Collider
 * @uses Collider.Box
 */

/**
 * !#en
 * Collider info in world coordinate.
 * !#zh
 * 碰撞体的世界坐标系下的信息。
 * @property {ColliderInfo} world
 */

var BoxCollider = cc.Class({
  name: 'cc.BoxCollider',
  "extends": cc.Collider,
  mixins: [cc.Collider.Box],
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.collider/Box Collider'
  }
});
cc.BoxCollider = module.exports = BoxCollider;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbGxpZGVyL0NDQm94Q29sbGlkZXIuanMiXSwibmFtZXMiOlsiY2MiLCJDb2xsaWRlciIsIkJveCIsIkNsYXNzIiwicHJvcGVydGllcyIsIl9vZmZzZXQiLCJ2MiIsIl9zaXplIiwic2l6ZSIsIm9mZnNldCIsInRvb2x0aXAiLCJDQ19ERVYiLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsInR5cGUiLCJWZWMyIiwid2lkdGgiLCJoZWlnaHQiLCJTaXplIiwicmVzZXRJbkVkaXRvciIsIkNDX0VESVRPUiIsImRpZFJlc2V0VG9EZWZhdWx0Iiwibm9kZSIsImdldENvbnRlbnRTaXplIiwieCIsImFuY2hvclgiLCJ5IiwiYW5jaG9yWSIsIkJveENvbGxpZGVyIiwibmFtZSIsIm1peGlucyIsImVkaXRvciIsIm1lbnUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBQSxFQUFFLENBQUNDLFFBQUgsQ0FBWUMsR0FBWixHQUFrQkYsRUFBRSxDQUFDRyxLQUFILENBQVM7QUFDdkJDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxPQUFPLEVBQUVMLEVBQUUsQ0FBQ00sRUFBSCxDQUFNLENBQU4sRUFBUyxDQUFULENBREQ7QUFFUkMsSUFBQUEsS0FBSyxFQUFFUCxFQUFFLENBQUNRLElBQUgsQ0FBUSxHQUFSLEVBQWEsR0FBYixDQUZDOztBQUlSO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNRQyxJQUFBQSxNQUFNLEVBQUU7QUFDSkMsTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUksZ0RBRGY7QUFFSkMsTUFBQUEsR0FBRyxFQUFFLGVBQVk7QUFDYixlQUFPLEtBQUtQLE9BQVo7QUFDSCxPQUpHO0FBS0pRLE1BQUFBLEdBQUcsRUFBRSxhQUFVQyxLQUFWLEVBQWlCO0FBQ2xCLGFBQUtULE9BQUwsR0FBZVMsS0FBZjtBQUNILE9BUEc7QUFRSkMsTUFBQUEsSUFBSSxFQUFFZixFQUFFLENBQUNnQjtBQVJMLEtBVkE7O0FBcUJSO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNRUixJQUFBQSxJQUFJLEVBQUU7QUFDRkUsTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUksOENBRGpCO0FBRUZDLE1BQUFBLEdBQUcsRUFBRSxlQUFZO0FBQ2IsZUFBTyxLQUFLTCxLQUFaO0FBQ0gsT0FKQztBQUtGTSxNQUFBQSxHQUFHLEVBQUUsYUFBVUMsS0FBVixFQUFpQjtBQUNsQixhQUFLUCxLQUFMLENBQVdVLEtBQVgsR0FBbUJILEtBQUssQ0FBQ0csS0FBTixHQUFjLENBQWQsR0FBa0IsQ0FBbEIsR0FBc0JILEtBQUssQ0FBQ0csS0FBL0M7QUFDQSxhQUFLVixLQUFMLENBQVdXLE1BQVgsR0FBb0JKLEtBQUssQ0FBQ0ksTUFBTixHQUFlLENBQWYsR0FBbUIsQ0FBbkIsR0FBdUJKLEtBQUssQ0FBQ0ksTUFBakQ7QUFDSCxPQVJDO0FBU0ZILE1BQUFBLElBQUksRUFBRWYsRUFBRSxDQUFDbUI7QUFUUDtBQTNCRSxHQURXO0FBeUN2QkMsRUFBQUEsYUFBYSxFQUFFQyxTQUFTLElBQUksVUFBVUMsaUJBQVYsRUFBNkI7QUFDckQsUUFBSUEsaUJBQUosRUFBdUI7QUFDbkIsVUFBSWQsSUFBSSxHQUFHLEtBQUtlLElBQUwsQ0FBVUMsY0FBVixFQUFYOztBQUNBLFVBQUloQixJQUFJLENBQUNTLEtBQUwsS0FBZSxDQUFmLElBQW9CVCxJQUFJLENBQUNVLE1BQUwsS0FBZ0IsQ0FBeEMsRUFBMkM7QUFDdkMsYUFBS1YsSUFBTCxHQUFZUixFQUFFLENBQUNRLElBQUgsQ0FBU0EsSUFBVCxDQUFaO0FBQ0EsYUFBS0MsTUFBTCxDQUFZZ0IsQ0FBWixHQUFnQixDQUFDLE1BQU0sS0FBS0YsSUFBTCxDQUFVRyxPQUFqQixJQUE0QmxCLElBQUksQ0FBQ1MsS0FBakQ7QUFDQSxhQUFLUixNQUFMLENBQVlrQixDQUFaLEdBQWdCLENBQUMsTUFBTSxLQUFLSixJQUFMLENBQVVLLE9BQWpCLElBQTRCcEIsSUFBSSxDQUFDVSxNQUFqRDtBQUNIO0FBQ0o7QUFDSjtBQWxEc0IsQ0FBVCxDQUFsQjtBQXFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFJVyxXQUFXLEdBQUc3QixFQUFFLENBQUNHLEtBQUgsQ0FBUztBQUN2QjJCLEVBQUFBLElBQUksRUFBRSxnQkFEaUI7QUFFdkIsYUFBUzlCLEVBQUUsQ0FBQ0MsUUFGVztBQUd2QjhCLEVBQUFBLE1BQU0sRUFBRSxDQUFDL0IsRUFBRSxDQUFDQyxRQUFILENBQVlDLEdBQWIsQ0FIZTtBQUt2QjhCLEVBQUFBLE1BQU0sRUFBRVgsU0FBUyxJQUFJO0FBQ2pCWSxJQUFBQSxJQUFJLEVBQUU7QUFEVztBQUxFLENBQVQsQ0FBbEI7QUFVQWpDLEVBQUUsQ0FBQzZCLFdBQUgsR0FBaUJLLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQk4sV0FBbEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuLyoqXG4gKiAhI2VuIERlZmluZXMgYSBCb3ggQ29sbGlkZXIgLlxuICogISN6aCDnlKjmnaXlrprkuYnljIXlm7Tnm5LnorDmkp7kvZNcbiAqIEBjbGFzcyBDb2xsaWRlci5Cb3hcbiAqL1xuY2MuQ29sbGlkZXIuQm94ID0gY2MuQ2xhc3Moe1xuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX29mZnNldDogY2MudjIoMCwgMCksXG4gICAgICAgIF9zaXplOiBjYy5zaXplKDEwMCwgMTAwKSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBQb3NpdGlvbiBvZmZzZXRcbiAgICAgICAgICogISN6aCDkvY3nva7lgY/np7vph49cbiAgICAgICAgICogQHByb3BlcnR5IG9mZnNldFxuICAgICAgICAgKiBAdHlwZSB7VmVjMn1cbiAgICAgICAgICovXG4gICAgICAgIG9mZnNldDoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnBoeXNpY3NfY29sbGlkZXIub2Zmc2V0JyxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9vZmZzZXQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vZmZzZXQgPSB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBjYy5WZWMyXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gQm94IHNpemVcbiAgICAgICAgICogISN6aCDljIXlm7Tnm5LlpKflsI9cbiAgICAgICAgICogQHByb3BlcnR5IHNpemVcbiAgICAgICAgICogQHR5cGUge1NpemV9XG4gICAgICAgICAqL1xuICAgICAgICBzaXplOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5zaXplJywgICAgICAgICAgICBcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zaXplO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2l6ZS53aWR0aCA9IHZhbHVlLndpZHRoIDwgMCA/IDAgOiB2YWx1ZS53aWR0aDtcbiAgICAgICAgICAgICAgICB0aGlzLl9zaXplLmhlaWdodCA9IHZhbHVlLmhlaWdodCA8IDAgPyAwIDogdmFsdWUuaGVpZ2h0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNpemVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZXNldEluRWRpdG9yOiBDQ19FRElUT1IgJiYgZnVuY3Rpb24gKGRpZFJlc2V0VG9EZWZhdWx0KSB7XG4gICAgICAgIGlmIChkaWRSZXNldFRvRGVmYXVsdCkge1xuICAgICAgICAgICAgdmFyIHNpemUgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKTtcbiAgICAgICAgICAgIGlmIChzaXplLndpZHRoICE9PSAwICYmIHNpemUuaGVpZ2h0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaXplID0gY2Muc2l6ZSggc2l6ZSApO1xuICAgICAgICAgICAgICAgIHRoaXMub2Zmc2V0LnggPSAoMC41IC0gdGhpcy5ub2RlLmFuY2hvclgpICogc2l6ZS53aWR0aDtcbiAgICAgICAgICAgICAgICB0aGlzLm9mZnNldC55ID0gKDAuNSAtIHRoaXMubm9kZS5hbmNob3JZKSAqIHNpemUuaGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlbiBCb3ggQ29sbGlkZXIuXG4gKiAhI3poIOWMheWbtOebkueisOaSnue7hOS7tlxuICogQGNsYXNzIEJveENvbGxpZGVyXG4gKiBAZXh0ZW5kcyBDb2xsaWRlclxuICogQHVzZXMgQ29sbGlkZXIuQm94XG4gKi9cbi8qKlxuICogISNlblxuICogQ29sbGlkZXIgaW5mbyBpbiB3b3JsZCBjb29yZGluYXRlLlxuICogISN6aFxuICog56Kw5pKe5L2T55qE5LiW55WM5Z2Q5qCH57O75LiL55qE5L+h5oGv44CCXG4gKiBAcHJvcGVydHkge0NvbGxpZGVySW5mb30gd29ybGRcbiAqL1xudmFyIEJveENvbGxpZGVyID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5Cb3hDb2xsaWRlcicsXG4gICAgZXh0ZW5kczogY2MuQ29sbGlkZXIsXG4gICAgbWl4aW5zOiBbY2MuQ29sbGlkZXIuQm94XSxcblxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5jb2xsaWRlci9Cb3ggQ29sbGlkZXInLFxuICAgIH1cbn0pO1xuXG5jYy5Cb3hDb2xsaWRlciA9IG1vZHVsZS5leHBvcnRzID0gQm94Q29sbGlkZXI7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==