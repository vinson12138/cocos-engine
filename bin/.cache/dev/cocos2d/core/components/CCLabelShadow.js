
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCLabelShadow.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2019 Xiamen Yaji Software Co., Ltd.

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
 * !#en Shadow effect for Label component, only for system fonts or TTF fonts
 * !#zh 用于给 Label 组件添加阴影效果，只能用于系统字体或 ttf 字体
 * @class LabelShadow
 * @extends Component
 * @example
 *  // Create a new node and add label components.
 *  var node = new cc.Node("New Label");
 *  var label = node.addComponent(cc.Label);
 *  label.string = "hello world";
 *  var labelShadow = node.addComponent(cc.LabelShadow);
 *  node.parent = this.node;
 */
var LabelShadow = cc.Class({
  name: 'cc.LabelShadow',
  "extends": require('./CCComponent'),
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.renderers/LabelShadow',
    executeInEditMode: true,
    requireComponent: cc.Label
  },
  properties: {
    _color: cc.Color.WHITE,
    _offset: cc.v2(2, 2),
    _blur: 2,

    /**
     * !#en The shadow color
     * !#zh 阴影的颜色
     * @property color
     * @type {Color}
     * @example
     * labelShadow.color = cc.Color.YELLOW;
     */
    color: {
      tooltip: CC_DEV && 'i18n:COMPONENT.shadow.color',
      get: function get() {
        return this._color.clone();
      },
      set: function set(value) {
        if (!this._color.equals(value)) {
          this._color.set(value);
        }

        this._updateRenderData();
      }
    },

    /**
     * !#en Offset between font and shadow
     * !#zh 字体与阴影的偏移
     * @property offset
     * @type {Vec2}
     * @example
     * labelShadow.offset = new cc.Vec2(2, 2);
     */
    offset: {
      tooltip: CC_DEV && 'i18n:COMPONENT.shadow.offset',
      get: function get() {
        return this._offset;
      },
      set: function set(value) {
        this._offset = value;

        this._updateRenderData();
      }
    },

    /**
     * !#en A non-negative float specifying the level of shadow blur
     * !#zh 阴影的模糊程度
     * @property blur
     * @type {Number}
     * @example
     * labelShadow.blur = 2;
     */
    blur: {
      tooltip: CC_DEV && 'i18n:COMPONENT.shadow.blur',
      get: function get() {
        return this._blur;
      },
      set: function set(value) {
        this._blur = value;

        this._updateRenderData();
      },
      range: [0, 1024]
    }
  },
  onEnable: function onEnable() {
    this._updateRenderData();
  },
  onDisable: function onDisable() {
    this._updateRenderData();
  },
  _updateRenderData: function _updateRenderData() {
    var label = this.node.getComponent(cc.Label);

    if (label) {
      label.markForRender(true);
    }
  }
});
cc.LabelShadow = module.exports = LabelShadow;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvQ0NMYWJlbFNoYWRvdy5qcyJdLCJuYW1lcyI6WyJMYWJlbFNoYWRvdyIsImNjIiwiQ2xhc3MiLCJuYW1lIiwicmVxdWlyZSIsImVkaXRvciIsIkNDX0VESVRPUiIsIm1lbnUiLCJleGVjdXRlSW5FZGl0TW9kZSIsInJlcXVpcmVDb21wb25lbnQiLCJMYWJlbCIsInByb3BlcnRpZXMiLCJfY29sb3IiLCJDb2xvciIsIldISVRFIiwiX29mZnNldCIsInYyIiwiX2JsdXIiLCJjb2xvciIsInRvb2x0aXAiLCJDQ19ERVYiLCJnZXQiLCJjbG9uZSIsInNldCIsInZhbHVlIiwiZXF1YWxzIiwiX3VwZGF0ZVJlbmRlckRhdGEiLCJvZmZzZXQiLCJibHVyIiwicmFuZ2UiLCJvbkVuYWJsZSIsIm9uRGlzYWJsZSIsImxhYmVsIiwibm9kZSIsImdldENvbXBvbmVudCIsIm1hcmtGb3JSZW5kZXIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFJQSxXQUFXLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ3ZCQyxFQUFBQSxJQUFJLEVBQUUsZ0JBRGlCO0FBRXZCLGFBQVNDLE9BQU8sQ0FBQyxlQUFELENBRk87QUFHdkJDLEVBQUFBLE1BQU0sRUFBRUMsU0FBUyxJQUFJO0FBQ2pCQyxJQUFBQSxJQUFJLEVBQUUsZ0RBRFc7QUFFakJDLElBQUFBLGlCQUFpQixFQUFFLElBRkY7QUFHakJDLElBQUFBLGdCQUFnQixFQUFFUixFQUFFLENBQUNTO0FBSEosR0FIRTtBQVN2QkMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLE1BQU0sRUFBRVgsRUFBRSxDQUFDWSxLQUFILENBQVNDLEtBRFQ7QUFFUkMsSUFBQUEsT0FBTyxFQUFFZCxFQUFFLENBQUNlLEVBQUgsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUZEO0FBR1JDLElBQUFBLEtBQUssRUFBRSxDQUhDOztBQUtSO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDUUMsSUFBQUEsS0FBSyxFQUFFO0FBQ0hDLE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxJQUFJLDZCQURoQjtBQUVIQyxNQUFBQSxHQUFHLEVBQUUsZUFBWTtBQUNiLGVBQU8sS0FBS1QsTUFBTCxDQUFZVSxLQUFaLEVBQVA7QUFDSCxPQUpFO0FBS0hDLE1BQUFBLEdBQUcsRUFBRSxhQUFVQyxLQUFWLEVBQWlCO0FBQ2xCLFlBQUksQ0FBQyxLQUFLWixNQUFMLENBQVlhLE1BQVosQ0FBbUJELEtBQW5CLENBQUwsRUFBZ0M7QUFDNUIsZUFBS1osTUFBTCxDQUFZVyxHQUFaLENBQWdCQyxLQUFoQjtBQUNIOztBQUNELGFBQUtFLGlCQUFMO0FBQ0g7QUFWRSxLQWJDOztBQTBCUjtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1FDLElBQUFBLE1BQU0sRUFBRTtBQUNKUixNQUFBQSxPQUFPLEVBQUVDLE1BQU0sSUFBSSw4QkFEZjtBQUVKQyxNQUFBQSxHQUFHLEVBQUUsZUFBWTtBQUNiLGVBQU8sS0FBS04sT0FBWjtBQUNILE9BSkc7QUFLSlEsTUFBQUEsR0FBRyxFQUFFLGFBQVVDLEtBQVYsRUFBaUI7QUFDbEIsYUFBS1QsT0FBTCxHQUFlUyxLQUFmOztBQUNBLGFBQUtFLGlCQUFMO0FBQ0g7QUFSRyxLQWxDQTs7QUE2Q1I7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNRRSxJQUFBQSxJQUFJLEVBQUU7QUFDRlQsTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUksNEJBRGpCO0FBRUZDLE1BQUFBLEdBQUcsRUFBRSxlQUFZO0FBQ2IsZUFBTyxLQUFLSixLQUFaO0FBQ0gsT0FKQztBQUtGTSxNQUFBQSxHQUFHLEVBQUUsYUFBVUMsS0FBVixFQUFpQjtBQUNsQixhQUFLUCxLQUFMLEdBQWFPLEtBQWI7O0FBQ0EsYUFBS0UsaUJBQUw7QUFDSCxPQVJDO0FBU0ZHLE1BQUFBLEtBQUssRUFBRSxDQUFDLENBQUQsRUFBSSxJQUFKO0FBVEw7QUFyREUsR0FUVztBQTJFdkJDLEVBQUFBLFFBM0V1QixzQkEyRVg7QUFDUixTQUFLSixpQkFBTDtBQUNILEdBN0VzQjtBQStFdkJLLEVBQUFBLFNBL0V1Qix1QkErRVY7QUFDVCxTQUFLTCxpQkFBTDtBQUNILEdBakZzQjtBQW1GdkJBLEVBQUFBLGlCQW5GdUIsK0JBbUZGO0FBQ2pCLFFBQUlNLEtBQUssR0FBRyxLQUFLQyxJQUFMLENBQVVDLFlBQVYsQ0FBdUJqQyxFQUFFLENBQUNTLEtBQTFCLENBQVo7O0FBQ0EsUUFBSXNCLEtBQUosRUFBVztBQUNQQSxNQUFBQSxLQUFLLENBQUNHLGFBQU4sQ0FBb0IsSUFBcEI7QUFDSDtBQUNKO0FBeEZzQixDQUFULENBQWxCO0FBNEZBbEMsRUFBRSxDQUFDRCxXQUFILEdBQWlCb0MsTUFBTSxDQUFDQyxPQUFQLEdBQWlCckMsV0FBbEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqXG4gKiAhI2VuIFNoYWRvdyBlZmZlY3QgZm9yIExhYmVsIGNvbXBvbmVudCwgb25seSBmb3Igc3lzdGVtIGZvbnRzIG9yIFRURiBmb250c1xuICogISN6aCDnlKjkuo7nu5kgTGFiZWwg57uE5Lu25re75Yqg6Zi05b2x5pWI5p6c77yM5Y+q6IO955So5LqO57O757uf5a2X5L2T5oiWIHR0ZiDlrZfkvZNcbiAqIEBjbGFzcyBMYWJlbFNoYWRvd1xuICogQGV4dGVuZHMgQ29tcG9uZW50XG4gKiBAZXhhbXBsZVxuICogIC8vIENyZWF0ZSBhIG5ldyBub2RlIGFuZCBhZGQgbGFiZWwgY29tcG9uZW50cy5cbiAqICB2YXIgbm9kZSA9IG5ldyBjYy5Ob2RlKFwiTmV3IExhYmVsXCIpO1xuICogIHZhciBsYWJlbCA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLkxhYmVsKTtcbiAqICBsYWJlbC5zdHJpbmcgPSBcImhlbGxvIHdvcmxkXCI7XG4gKiAgdmFyIGxhYmVsU2hhZG93ID0gbm9kZS5hZGRDb21wb25lbnQoY2MuTGFiZWxTaGFkb3cpO1xuICogIG5vZGUucGFyZW50ID0gdGhpcy5ub2RlO1xuICovXG5cbmxldCBMYWJlbFNoYWRvdyA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuTGFiZWxTaGFkb3cnLFxuICAgIGV4dGVuZHM6IHJlcXVpcmUoJy4vQ0NDb21wb25lbnQnKSxcbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQucmVuZGVyZXJzL0xhYmVsU2hhZG93JyxcbiAgICAgICAgZXhlY3V0ZUluRWRpdE1vZGU6IHRydWUsXG4gICAgICAgIHJlcXVpcmVDb21wb25lbnQ6IGNjLkxhYmVsLFxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF9jb2xvcjogY2MuQ29sb3IuV0hJVEUsXG4gICAgICAgIF9vZmZzZXQ6IGNjLnYyKDIsIDIpLFxuICAgICAgICBfYmx1cjogMixcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgc2hhZG93IGNvbG9yXG4gICAgICAgICAqICEjemgg6Zi05b2x55qE6aKc6ImyXG4gICAgICAgICAqIEBwcm9wZXJ0eSBjb2xvclxuICAgICAgICAgKiBAdHlwZSB7Q29sb3J9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIGxhYmVsU2hhZG93LmNvbG9yID0gY2MuQ29sb3IuWUVMTE9XO1xuICAgICAgICAgKi9cbiAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuc2hhZG93LmNvbG9yJyxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb2xvci5jbG9uZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9jb2xvci5lcXVhbHModmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbG9yLnNldCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVJlbmRlckRhdGEoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBPZmZzZXQgYmV0d2VlbiBmb250IGFuZCBzaGFkb3dcbiAgICAgICAgICogISN6aCDlrZfkvZPkuI7pmLTlvbHnmoTlgY/np7tcbiAgICAgICAgICogQHByb3BlcnR5IG9mZnNldFxuICAgICAgICAgKiBAdHlwZSB7VmVjMn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbGFiZWxTaGFkb3cub2Zmc2V0ID0gbmV3IGNjLlZlYzIoMiwgMik7XG4gICAgICAgICAqL1xuICAgICAgICBvZmZzZXQ6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuc2hhZG93Lm9mZnNldCcsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb2Zmc2V0ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmVuZGVyRGF0YSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEEgbm9uLW5lZ2F0aXZlIGZsb2F0IHNwZWNpZnlpbmcgdGhlIGxldmVsIG9mIHNoYWRvdyBibHVyXG4gICAgICAgICAqICEjemgg6Zi05b2x55qE5qih57OK56iL5bqmXG4gICAgICAgICAqIEBwcm9wZXJ0eSBibHVyXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIGxhYmVsU2hhZG93LmJsdXIgPSAyO1xuICAgICAgICAgKi9cbiAgICAgICAgYmx1cjoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zaGFkb3cuYmx1cicsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYmx1cjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2JsdXIgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVSZW5kZXJEYXRhKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmFuZ2U6IFswLCAxMDI0XSxcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgb25FbmFibGUgKCkge1xuICAgICAgICB0aGlzLl91cGRhdGVSZW5kZXJEYXRhKCk7XG4gICAgfSxcblxuICAgIG9uRGlzYWJsZSAoKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVJlbmRlckRhdGEoKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZVJlbmRlckRhdGEgKCkge1xuICAgICAgICBsZXQgbGFiZWwgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKTtcbiAgICAgICAgaWYgKGxhYmVsKSB7XG4gICAgICAgICAgICBsYWJlbC5tYXJrRm9yUmVuZGVyKHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuXG59KTtcblxuY2MuTGFiZWxTaGFkb3cgPSBtb2R1bGUuZXhwb3J0cyA9IExhYmVsU2hhZG93O1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=