
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCLabelOutline.js';
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
 * !#en Outline effect used to change the display, only for system fonts or TTF fonts
 * !#zh 描边效果组件,用于字体描边,只能用于系统字体
 * @class LabelOutline
 * @extends Component
 * @example
 *  // Create a new node and add label components.
 *  var node = new cc.Node("New Label");
 *  var label = node.addComponent(cc.Label);
 *  label.string = "hello world";
 *  var outline = node.addComponent(cc.LabelOutline);
 *  node.parent = this.node;
 */
var LabelOutline = cc.Class({
  name: 'cc.LabelOutline',
  "extends": require('./CCComponent'),
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.renderers/LabelOutline',
    executeInEditMode: true,
    requireComponent: cc.Label
  },
  properties: {
    _color: cc.Color.WHITE,
    _width: 1,

    /**
     * !#en outline color
     * !#zh 改变描边的颜色
     * @property color
     * @type {Color}
     * @example
     * outline.color = cc.Color.BLACK;
     */
    color: {
      tooltip: CC_DEV && 'i18n:COMPONENT.outline.color',
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
     * !#en Change the outline width
     * !#zh 改变描边的宽度
     * @property width
     * @type {Number}
     * @example
     * outline.width = 3;
     */
    width: {
      tooltip: CC_DEV && 'i18n:COMPONENT.outline.width',
      get: function get() {
        return this._width;
      },
      set: function set(value) {
        if (this._width === value) return;
        this._width = value;

        this._updateRenderData();
      },
      range: [0, 512]
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
      label.setVertsDirty();
    }
  }
});
cc.LabelOutline = module.exports = LabelOutline;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvQ0NMYWJlbE91dGxpbmUuanMiXSwibmFtZXMiOlsiTGFiZWxPdXRsaW5lIiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJyZXF1aXJlIiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwibWVudSIsImV4ZWN1dGVJbkVkaXRNb2RlIiwicmVxdWlyZUNvbXBvbmVudCIsIkxhYmVsIiwicHJvcGVydGllcyIsIl9jb2xvciIsIkNvbG9yIiwiV0hJVEUiLCJfd2lkdGgiLCJjb2xvciIsInRvb2x0aXAiLCJDQ19ERVYiLCJnZXQiLCJjbG9uZSIsInNldCIsInZhbHVlIiwiZXF1YWxzIiwiX3VwZGF0ZVJlbmRlckRhdGEiLCJ3aWR0aCIsInJhbmdlIiwib25FbmFibGUiLCJvbkRpc2FibGUiLCJsYWJlbCIsIm5vZGUiLCJnZXRDb21wb25lbnQiLCJzZXRWZXJ0c0RpcnR5IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBSUEsWUFBWSxHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUN4QkMsRUFBQUEsSUFBSSxFQUFFLGlCQURrQjtBQUV4QixhQUFTQyxPQUFPLENBQUMsZUFBRCxDQUZRO0FBR3hCQyxFQUFBQSxNQUFNLEVBQUVDLFNBQVMsSUFBSTtBQUNqQkMsSUFBQUEsSUFBSSxFQUFFLGlEQURXO0FBRWpCQyxJQUFBQSxpQkFBaUIsRUFBRSxJQUZGO0FBR2pCQyxJQUFBQSxnQkFBZ0IsRUFBRVIsRUFBRSxDQUFDUztBQUhKLEdBSEc7QUFTeEJDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxNQUFNLEVBQUVYLEVBQUUsQ0FBQ1ksS0FBSCxDQUFTQyxLQURUO0FBRVJDLElBQUFBLE1BQU0sRUFBRSxDQUZBOztBQUlSO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDUUMsSUFBQUEsS0FBSyxFQUFFO0FBQ0hDLE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxJQUFJLDhCQURoQjtBQUVIQyxNQUFBQSxHQUFHLEVBQUUsZUFBWTtBQUNiLGVBQU8sS0FBS1AsTUFBTCxDQUFZUSxLQUFaLEVBQVA7QUFDSCxPQUpFO0FBS0hDLE1BQUFBLEdBQUcsRUFBRSxhQUFVQyxLQUFWLEVBQWlCO0FBQ2xCLFlBQUksQ0FBQyxLQUFLVixNQUFMLENBQVlXLE1BQVosQ0FBbUJELEtBQW5CLENBQUwsRUFBZ0M7QUFDNUIsZUFBS1YsTUFBTCxDQUFZUyxHQUFaLENBQWdCQyxLQUFoQjtBQUNIOztBQUNELGFBQUtFLGlCQUFMO0FBQ0g7QUFWRSxLQVpDOztBQXlCUjtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1FDLElBQUFBLEtBQUssRUFBRTtBQUNIUixNQUFBQSxPQUFPLEVBQUVDLE1BQU0sSUFBSSw4QkFEaEI7QUFFSEMsTUFBQUEsR0FBRyxFQUFFLGVBQVk7QUFDYixlQUFPLEtBQUtKLE1BQVo7QUFDSCxPQUpFO0FBS0hNLE1BQUFBLEdBQUcsRUFBRSxhQUFVQyxLQUFWLEVBQWlCO0FBQ2xCLFlBQUksS0FBS1AsTUFBTCxLQUFnQk8sS0FBcEIsRUFBMkI7QUFFM0IsYUFBS1AsTUFBTCxHQUFjTyxLQUFkOztBQUNBLGFBQUtFLGlCQUFMO0FBQ0gsT0FWRTtBQVdIRSxNQUFBQSxLQUFLLEVBQUUsQ0FBQyxDQUFELEVBQUksR0FBSjtBQVhKO0FBakNDLEdBVFk7QUF5RHhCQyxFQUFBQSxRQXpEd0Isc0JBeURaO0FBQ1IsU0FBS0gsaUJBQUw7QUFDSCxHQTNEdUI7QUE2RHhCSSxFQUFBQSxTQTdEd0IsdUJBNkRYO0FBQ1QsU0FBS0osaUJBQUw7QUFDSCxHQS9EdUI7QUFpRXhCQSxFQUFBQSxpQkFqRXdCLCtCQWlFSDtBQUNqQixRQUFJSyxLQUFLLEdBQUcsS0FBS0MsSUFBTCxDQUFVQyxZQUFWLENBQXVCOUIsRUFBRSxDQUFDUyxLQUExQixDQUFaOztBQUNBLFFBQUltQixLQUFKLEVBQVc7QUFDUEEsTUFBQUEsS0FBSyxDQUFDRyxhQUFOO0FBQ0g7QUFDSjtBQXRFdUIsQ0FBVCxDQUFuQjtBQTBFQS9CLEVBQUUsQ0FBQ0QsWUFBSCxHQUFrQmlDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmxDLFlBQW5DIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogISNlbiBPdXRsaW5lIGVmZmVjdCB1c2VkIHRvIGNoYW5nZSB0aGUgZGlzcGxheSwgb25seSBmb3Igc3lzdGVtIGZvbnRzIG9yIFRURiBmb250c1xuICogISN6aCDmj4/ovrnmlYjmnpznu4Tku7Ys55So5LqO5a2X5L2T5o+P6L65LOWPquiDveeUqOS6juezu+e7n+Wtl+S9k1xuICogQGNsYXNzIExhYmVsT3V0bGluZVxuICogQGV4dGVuZHMgQ29tcG9uZW50XG4gKiBAZXhhbXBsZVxuICogIC8vIENyZWF0ZSBhIG5ldyBub2RlIGFuZCBhZGQgbGFiZWwgY29tcG9uZW50cy5cbiAqICB2YXIgbm9kZSA9IG5ldyBjYy5Ob2RlKFwiTmV3IExhYmVsXCIpO1xuICogIHZhciBsYWJlbCA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLkxhYmVsKTtcbiAqICBsYWJlbC5zdHJpbmcgPSBcImhlbGxvIHdvcmxkXCI7XG4gKiAgdmFyIG91dGxpbmUgPSBub2RlLmFkZENvbXBvbmVudChjYy5MYWJlbE91dGxpbmUpO1xuICogIG5vZGUucGFyZW50ID0gdGhpcy5ub2RlO1xuICovXG5cbmxldCBMYWJlbE91dGxpbmUgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkxhYmVsT3V0bGluZScsXG4gICAgZXh0ZW5kczogcmVxdWlyZSgnLi9DQ0NvbXBvbmVudCcpLFxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5yZW5kZXJlcnMvTGFiZWxPdXRsaW5lJyxcbiAgICAgICAgZXhlY3V0ZUluRWRpdE1vZGU6IHRydWUsXG4gICAgICAgIHJlcXVpcmVDb21wb25lbnQ6IGNjLkxhYmVsLFxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF9jb2xvcjogY2MuQ29sb3IuV0hJVEUsXG4gICAgICAgIF93aWR0aDogMSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBvdXRsaW5lIGNvbG9yXG4gICAgICAgICAqICEjemgg5pS55Y+Y5o+P6L6555qE6aKc6ImyXG4gICAgICAgICAqIEBwcm9wZXJ0eSBjb2xvclxuICAgICAgICAgKiBAdHlwZSB7Q29sb3J9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIG91dGxpbmUuY29sb3IgPSBjYy5Db2xvci5CTEFDSztcbiAgICAgICAgICovXG4gICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULm91dGxpbmUuY29sb3InLFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbG9yLmNsb25lKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2NvbG9yLmVxdWFscyh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29sb3Iuc2V0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmVuZGVyRGF0YSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIENoYW5nZSB0aGUgb3V0bGluZSB3aWR0aFxuICAgICAgICAgKiAhI3poIOaUueWPmOaPj+i+ueeahOWuveW6plxuICAgICAgICAgKiBAcHJvcGVydHkgd2lkdGhcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogb3V0bGluZS53aWR0aCA9IDM7XG4gICAgICAgICAqL1xuICAgICAgICB3aWR0aDoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5vdXRsaW5lLndpZHRoJyxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl93aWR0aCA9PT0gdmFsdWUpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3dpZHRoID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmVuZGVyRGF0YSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJhbmdlOiBbMCwgNTEyXSxcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkVuYWJsZSAoKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVJlbmRlckRhdGEoKTtcbiAgICB9LFxuXG4gICAgb25EaXNhYmxlICgpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlUmVuZGVyRGF0YSgpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlUmVuZGVyRGF0YSAoKSB7XG4gICAgICAgIGxldCBsYWJlbCA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuTGFiZWwpO1xuICAgICAgICBpZiAobGFiZWwpIHtcbiAgICAgICAgICAgIGxhYmVsLnNldFZlcnRzRGlydHkoKTtcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG5cbmNjLkxhYmVsT3V0bGluZSA9IG1vZHVsZS5leHBvcnRzID0gTGFiZWxPdXRsaW5lO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=