
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCToggleContainer.js';
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
 * !#en ToggleContainer is not a visiable UI component but a way to modify the behavior of a set of Toggles. <br/>
 * Toggles that belong to the same group could only have one of them to be switched on at a time.<br/>
 * Note: All the first layer child node containing the toggle component will auto be added to the container
 * !#zh ToggleContainer 不是一个可见的 UI 组件，它可以用来修改一组 Toggle 组件的行为。<br/>
 * 当一组 Toggle 属于同一个 ToggleContainer 的时候，任何时候只能有一个 Toggle 处于选中状态。<br/>
 * 注意：所有包含 Toggle 组件的一级子节点都会自动被添加到该容器中
 * @class ToggleContainer
 * @extends Component
 */
var ToggleContainer = cc.Class({
  name: 'cc.ToggleContainer',
  "extends": cc.Component,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.ui/ToggleContainer',
    help: 'i18n:COMPONENT.help_url.toggleContainer',
    executeInEditMode: true
  },
  properties: {
    /**
     * !#en If this setting is true, a toggle could be switched off and on when pressed.
     * If it is false, it will make sure there is always only one toggle could be switched on
     * and the already switched on toggle can't be switched off.
     * !#zh 如果这个设置为 true， 那么 toggle 按钮在被点击的时候可以反复地被选中和未选中。
     * @property {Boolean} allowSwitchOff
     */
    allowSwitchOff: {
      tooltip: CC_DEV && 'i18n:COMPONENT.toggle_group.allowSwitchOff',
      "default": false
    },

    /**
     * !#en If Toggle is clicked, it will trigger event's handler
     * !#zh Toggle 按钮的点击事件列表。
     * @property {Component.EventHandler[]} checkEvents
     */
    checkEvents: {
      "default": [],
      type: cc.Component.EventHandler
    }
  },
  updateToggles: function updateToggles(toggle) {
    if (!this.enabledInHierarchy) return;

    if (toggle.isChecked) {
      this.toggleItems.forEach(function (item) {
        if (item !== toggle && item.isChecked && item.enabled) {
          item._hideCheckMark();
        }
      });

      if (this.checkEvents) {
        cc.Component.EventHandler.emitEvents(this.checkEvents, toggle);
      }
    }
  },
  _allowOnlyOneToggleChecked: function _allowOnlyOneToggleChecked() {
    var isChecked = false;
    this.toggleItems.forEach(function (item) {
      if (isChecked) {
        item._hideCheckMark();
      } else if (item.isChecked) {
        isChecked = true;
      }
    });
    return isChecked;
  },
  _makeAtLeastOneToggleChecked: function _makeAtLeastOneToggleChecked() {
    var isChecked = this._allowOnlyOneToggleChecked();

    if (!isChecked && !this.allowSwitchOff) {
      var toggleItems = this.toggleItems;

      if (toggleItems.length > 0) {
        toggleItems[0].check();
      }
    }
  },
  onEnable: function onEnable() {
    this._makeAtLeastOneToggleChecked();

    this.node.on('child-added', this._allowOnlyOneToggleChecked, this);
    this.node.on('child-removed', this._makeAtLeastOneToggleChecked, this);
  },
  onDisable: function onDisable() {
    this.node.off('child-added', this._allowOnlyOneToggleChecked, this);
    this.node.off('child-removed', this._makeAtLeastOneToggleChecked, this);
  }
});
/**
 * !#en Read only property, return the toggle items array reference managed by ToggleContainer.
 * !#zh 只读属性，返回 ToggleContainer 管理的 toggle 数组引用
 * @property {Toggle[]} toggleItems
 */

var js = require('../platform/js');

js.get(ToggleContainer.prototype, 'toggleItems', function () {
  return this.node._children.map(function (item) {
    return item.getComponent(cc.Toggle);
  }).filter(Boolean);
});
cc.ToggleContainer = module.exports = ToggleContainer;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvQ0NUb2dnbGVDb250YWluZXIuanMiXSwibmFtZXMiOlsiVG9nZ2xlQ29udGFpbmVyIiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJDb21wb25lbnQiLCJlZGl0b3IiLCJDQ19FRElUT1IiLCJtZW51IiwiaGVscCIsImV4ZWN1dGVJbkVkaXRNb2RlIiwicHJvcGVydGllcyIsImFsbG93U3dpdGNoT2ZmIiwidG9vbHRpcCIsIkNDX0RFViIsImNoZWNrRXZlbnRzIiwidHlwZSIsIkV2ZW50SGFuZGxlciIsInVwZGF0ZVRvZ2dsZXMiLCJ0b2dnbGUiLCJlbmFibGVkSW5IaWVyYXJjaHkiLCJpc0NoZWNrZWQiLCJ0b2dnbGVJdGVtcyIsImZvckVhY2giLCJpdGVtIiwiZW5hYmxlZCIsIl9oaWRlQ2hlY2tNYXJrIiwiZW1pdEV2ZW50cyIsIl9hbGxvd09ubHlPbmVUb2dnbGVDaGVja2VkIiwiX21ha2VBdExlYXN0T25lVG9nZ2xlQ2hlY2tlZCIsImxlbmd0aCIsImNoZWNrIiwib25FbmFibGUiLCJub2RlIiwib24iLCJvbkRpc2FibGUiLCJvZmYiLCJqcyIsInJlcXVpcmUiLCJnZXQiLCJwcm90b3R5cGUiLCJfY2hpbGRyZW4iLCJtYXAiLCJnZXRDb21wb25lbnQiLCJUb2dnbGUiLCJmaWx0ZXIiLCJCb29sZWFuIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSUEsZUFBZSxHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUMzQkMsRUFBQUEs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Q0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBSVEsRUFBRSxHQUFHQyxPQUFPLENBQUMsZ0JBQUQsQ0FBaEI7O0FBQ0FELEVBQUUsQ0FBQ0UsR0FBSCxDQUFPdEMsZUFBZSxDQUFDdUMsU0FBdkIsRUFBa0MsYUFBbEMsRUFDSSxZQUFZO0FBQ1IsU0FBTyxLQUFLUCxJQUFMLENBQVVRLFNBQVYsQ0FBb0JDLEdBQXBCLENBQXdCLFVBQVVsQixJQUFWLEVBQWdCO0FBQzNDLFdBQU9BLElBQUksQ0FBQ21CLFlBQUwsQ0FBa0J6QyxFQUFFLENBQUMwQyxNQUFyQixDQUFQO0FBQ0gsR0FGTSxFQUVKQyxNQUZJLENBRUdDLE9BRkgsQ0FBUDtBQUdILENBTEw7QUFRQTVDLEVBQUUsQ0FBQ0QsZUFBSCxHQUFxQjhDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQi9DLGVBQXRDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKipcbiAqICEjZW4gVG9nZ2xlQ29udGFpbmVyIGlzIG5vdCBhIHZpc2lhYmxlIFVJIGNvbXBvbmVudCBidXQgYSB3YXkgdG8gbW9kaWZ5IHRoZSBiZWhhdmlvciBvZiBhIHNldCBvZiBUb2dnbGVzLiA8YnIvPlxuICogVG9nZ2xlcyB0aGF0IGJlbG9uZyB0byB0aGUgc2FtZSBncm91cCBjb3VsZCBvbmx5IGhhdmUgb25lIG9mIHRoZW0gdG8gYmUgc3dpdGNoZWQgb24gYXQgYSB0aW1lLjxici8+XG4gKiBOb3RlOiBBbGwgdGhlIGZpcnN0IGxheWVyIGNoaWxkIG5vZGUgY29udGFpbmluZyB0aGUgdG9nZ2xlIGNvbXBvbmVudCB3aWxsIGF1dG8gYmUgYWRkZWQgdG8gdGhlIGNvbnRhaW5lclxuICogISN6aCBUb2dnbGVDb250YWluZXIg5LiN5piv5LiA5Liq5Y+v6KeB55qEIFVJIOe7hOS7tu+8jOWug+WPr+S7peeUqOadpeS/ruaUueS4gOe7hCBUb2dnbGUg57uE5Lu255qE6KGM5Li644CCPGJyLz5cbiAqIOW9k+S4gOe7hCBUb2dnbGUg5bGe5LqO5ZCM5LiA5LiqIFRvZ2dsZUNvbnRhaW5lciDnmoTml7blgJnvvIzku7vkvZXml7blgJnlj6rog73mnInkuIDkuKogVG9nZ2xlIOWkhOS6jumAieS4reeKtuaAgeOAgjxici8+XG4gKiDms6jmhI/vvJrmiYDmnInljIXlkKsgVG9nZ2xlIOe7hOS7tueahOS4gOe6p+WtkOiKgueCuemDveS8muiHquWKqOiiq+a3u+WKoOWIsOivpeWuueWZqOS4rVxuICogQGNsYXNzIFRvZ2dsZUNvbnRhaW5lclxuICogQGV4dGVuZHMgQ29tcG9uZW50XG4gKi9cbnZhciBUb2dnbGVDb250YWluZXIgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlRvZ2dsZUNvbnRhaW5lcicsXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC51aS9Ub2dnbGVDb250YWluZXInLFxuICAgICAgICBoZWxwOiAnaTE4bjpDT01QT05FTlQuaGVscF91cmwudG9nZ2xlQ29udGFpbmVyJyxcbiAgICAgICAgZXhlY3V0ZUluRWRpdE1vZGU6IHRydWVcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBJZiB0aGlzIHNldHRpbmcgaXMgdHJ1ZSwgYSB0b2dnbGUgY291bGQgYmUgc3dpdGNoZWQgb2ZmIGFuZCBvbiB3aGVuIHByZXNzZWQuXG4gICAgICAgICAqIElmIGl0IGlzIGZhbHNlLCBpdCB3aWxsIG1ha2Ugc3VyZSB0aGVyZSBpcyBhbHdheXMgb25seSBvbmUgdG9nZ2xlIGNvdWxkIGJlIHN3aXRjaGVkIG9uXG4gICAgICAgICAqIGFuZCB0aGUgYWxyZWFkeSBzd2l0Y2hlZCBvbiB0b2dnbGUgY2FuJ3QgYmUgc3dpdGNoZWQgb2ZmLlxuICAgICAgICAgKiAhI3poIOWmguaenOi/meS4quiuvue9ruS4uiB0cnVl77yMIOmCo+S5iCB0b2dnbGUg5oyJ6ZKu5Zyo6KKr54K55Ye755qE5pe25YCZ5Y+v5Lul5Y+N5aSN5Zyw6KKr6YCJ5Lit5ZKM5pyq6YCJ5Lit44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gYWxsb3dTd2l0Y2hPZmZcbiAgICAgICAgICovXG4gICAgICAgIGFsbG93U3dpdGNoT2ZmOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnRvZ2dsZV9ncm91cC5hbGxvd1N3aXRjaE9mZicsXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIElmIFRvZ2dsZSBpcyBjbGlja2VkLCBpdCB3aWxsIHRyaWdnZXIgZXZlbnQncyBoYW5kbGVyXG4gICAgICAgICAqICEjemggVG9nZ2xlIOaMiemSrueahOeCueWHu+S6i+S7tuWIl+ihqOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0NvbXBvbmVudC5FdmVudEhhbmRsZXJbXX0gY2hlY2tFdmVudHNcbiAgICAgICAgICovXG4gICAgICAgIGNoZWNrRXZlbnRzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXJcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgdXBkYXRlVG9nZ2xlczogZnVuY3Rpb24gKHRvZ2dsZSkge1xuICAgICAgICBpZighdGhpcy5lbmFibGVkSW5IaWVyYXJjaHkpIHJldHVybjtcblxuICAgICAgICBpZiAodG9nZ2xlLmlzQ2hlY2tlZCkge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVJdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0gIT09IHRvZ2dsZSAmJiBpdGVtLmlzQ2hlY2tlZCAmJiBpdGVtLmVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5faGlkZUNoZWNrTWFyaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0V2ZW50cykge1xuICAgICAgICAgICAgICAgIGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIuZW1pdEV2ZW50cyh0aGlzLmNoZWNrRXZlbnRzLCB0b2dnbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9hbGxvd09ubHlPbmVUb2dnbGVDaGVja2VkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpc0NoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50b2dnbGVJdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICBpZiAoaXNDaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5faGlkZUNoZWNrTWFyaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXRlbS5pc0NoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICBpc0NoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gaXNDaGVja2VkO1xuICAgIH0sXG5cbiAgICBfbWFrZUF0TGVhc3RPbmVUb2dnbGVDaGVja2VkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpc0NoZWNrZWQgPSB0aGlzLl9hbGxvd09ubHlPbmVUb2dnbGVDaGVja2VkKCk7XG5cbiAgICAgICAgaWYgKCFpc0NoZWNrZWQgJiYgIXRoaXMuYWxsb3dTd2l0Y2hPZmYpIHtcbiAgICAgICAgICAgIHZhciB0b2dnbGVJdGVtcyA9IHRoaXMudG9nZ2xlSXRlbXM7XG4gICAgICAgICAgICBpZiAodG9nZ2xlSXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRvZ2dsZUl0ZW1zWzBdLmNoZWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fbWFrZUF0TGVhc3RPbmVUb2dnbGVDaGVja2VkKCk7XG4gICAgICAgIHRoaXMubm9kZS5vbignY2hpbGQtYWRkZWQnLCB0aGlzLl9hbGxvd09ubHlPbmVUb2dnbGVDaGVja2VkLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdjaGlsZC1yZW1vdmVkJywgdGhpcy5fbWFrZUF0TGVhc3RPbmVUb2dnbGVDaGVja2VkLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoJ2NoaWxkLWFkZGVkJywgdGhpcy5fYWxsb3dPbmx5T25lVG9nZ2xlQ2hlY2tlZCwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoJ2NoaWxkLXJlbW92ZWQnLCB0aGlzLl9tYWtlQXRMZWFzdE9uZVRvZ2dsZUNoZWNrZWQsIHRoaXMpO1xuICAgIH0sXG59KTtcblxuLyoqXG4gKiAhI2VuIFJlYWQgb25seSBwcm9wZXJ0eSwgcmV0dXJuIHRoZSB0b2dnbGUgaXRlbXMgYXJyYXkgcmVmZXJlbmNlIG1hbmFnZWQgYnkgVG9nZ2xlQ29udGFpbmVyLlxuICogISN6aCDlj6ror7vlsZ7mgKfvvIzov5Tlm54gVG9nZ2xlQ29udGFpbmVyIOeuoeeQhueahCB0b2dnbGUg5pWw57uE5byV55SoXG4gKiBAcHJvcGVydHkge1RvZ2dsZVtdfSB0b2dnbGVJdGVtc1xuICovXG52YXIganMgPSByZXF1aXJlKCcuLi9wbGF0Zm9ybS9qcycpO1xuanMuZ2V0KFRvZ2dsZUNvbnRhaW5lci5wcm90b3R5cGUsICd0b2dnbGVJdGVtcycsXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ub2RlLl9jaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLmdldENvbXBvbmVudChjYy5Ub2dnbGUpO1xuICAgICAgICB9KS5maWx0ZXIoQm9vbGVhbik7XG4gICAgfVxuKTtcblxuY2MuVG9nZ2xlQ29udGFpbmVyID0gbW9kdWxlLmV4cG9ydHMgPSBUb2dnbGVDb250YWluZXI7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==