
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCToggleGroup.js';
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
 * !#en ToggleGroup is not a visiable UI component but a way to modify the behavior of a set of Toggles.
 * Toggles that belong to the same group could only have one of them to be switched on at a time.
 * !#zh ToggleGroup 不是一个可见的 UI 组件，它可以用来修改一组 Toggle  组件的行为。当一组 Toggle 属于同一个 ToggleGroup 的时候，
 * 任何时候只能有一个 Toggle 处于选中状态。
 * @class ToggleGroup
 * @extends Component
 */
var ToggleGroup = cc.Class({
  name: 'cc.ToggleGroup',
  "extends": cc.Component,
  ctor: function ctor() {
    this._toggleItems = [];
  },
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.ui/ToggleGroup (Legacy)',
    help: 'i18n:COMPONENT.help_url.toggleGroup'
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
     * !#en Read only property, return the toggle items array reference managed by toggleGroup.
     * !#zh 只读属性，返回 toggleGroup 管理的 toggle 数组引用
     * @property {Array} toggleItems
     */
    toggleItems: {
      get: function get() {
        return this._toggleItems;
      }
    }
  },
  updateToggles: function updateToggles(toggle) {
    if (!this.enabledInHierarchy) return;

    this._toggleItems.forEach(function (item) {
      if (toggle.isChecked) {
        if (item !== toggle && item.isChecked && item.enabled) {
          item._hideCheckMark();
        }
      }
    });
  },
  addToggle: function addToggle(toggle) {
    var index = this._toggleItems.indexOf(toggle);

    if (index === -1) {
      this._toggleItems.push(toggle);
    }

    this._allowOnlyOneToggleChecked();
  },
  removeToggle: function removeToggle(toggle) {
    var index = this._toggleItems.indexOf(toggle);

    if (index > -1) {
      this._toggleItems.splice(index, 1);
    }

    this._makeAtLeastOneToggleChecked();
  },
  _allowOnlyOneToggleChecked: function _allowOnlyOneToggleChecked() {
    var isChecked = false;

    this._toggleItems.forEach(function (item) {
      if (isChecked && item.enabled) {
        item._hideCheckMark();
      }

      if (item.isChecked && item.enabled) {
        isChecked = true;
      }
    });

    return isChecked;
  },
  _makeAtLeastOneToggleChecked: function _makeAtLeastOneToggleChecked() {
    var isChecked = this._allowOnlyOneToggleChecked();

    if (!isChecked && !this.allowSwitchOff) {
      if (this._toggleItems.length > 0) {
        this._toggleItems[0].isChecked = true;
      }
    }
  },
  start: function start() {
    this._makeAtLeastOneToggleChecked();
  }
});

var js = require('../platform/js');

var showed = false;
js.get(cc, 'ToggleGroup', function () {
  if (!showed) {
    cc.errorID(1405, 'cc.ToggleGroup', 'cc.ToggleContainer');
    showed = true;
  }

  return ToggleGroup;
});
module.exports = ToggleGroup;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvQ0NUb2dnbGVHcm91cC5qcyJdLCJuYW1lcyI6WyJUb2dnbGVHcm91cCIsImNjIiwiQ2xhc3MiLCJuYW1lIiwiQ29tcG9uZW50IiwiY3RvciIsIl90b2dnbGVJdGVtcyIsImVkaXRvciIsIkNDX0VESVRPUiIsIm1lbnUiLCJoZWxwIiwicHJvcGVydGllcyIsImFsbG93U3dpdGNoT2ZmIiwidG9vbHRpcCIsIkNDX0RFViIsInRvZ2dsZUl0ZW1zIiwiZ2V0IiwidXBkYXRlVG9nZ2xlcyIsInRvZ2dsZSIsImVuYWJsZWRJbkhpZXJhcmNoeSIsImZvckVhY2giLCJpdGVtIiwiaXNDaGVja2VkIiwiZW5hYmxlZCIsIl9oaWRlQ2hlY2tNYXJrIiwiYWRkVG9nZ2xlIiwiaW5kZXgiLCJpbmRleE9mIiwicHVzaCIsIl9hbGxvd09ubHlPbmVUb2dnbGVDaGVja2VkIiwicmVtb3ZlVG9nZ2xlIiwic3BsaWNlIiwiX21ha2VBdExlYXN0T25lVG9nZ2xlQ2hlY2tlZCIsImxlbmd0aCIsInN0YXJ0IiwianMiLCJyZXF1aXJlIiwic2hvd2VkIiwiZXJyb3JJRCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSUEsV0FBVyxHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUN2QkMsRUFBQUEsSUFBSSxFQUFFLGdCQURpQjtBQUV2QixhQUFTRixFQUFFLENBQUNHLFNBRlc7QUFHdkJDLEVBQUFBLElBQUksRUFBRSxnQkFBWTtBQUNkLFNBQUtDLFlBQUwsR0FBb0IsRUFB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R0FBR0MsT0FBTyxDQUFDLGdCQUFELENBQWhCOztBQUNBLElBQUlDLE1BQU0sR0FBRyxLQUFiO0FBQ0FGLEVBQUUsQ0FBQ25CLEdBQUgsQ0FBT2YsRUFBUCxFQUFXLGFBQVgsRUFBMEIsWUFBWTtBQUNsQyxNQUFJLENBQUNvQyxNQUFMLEVBQWE7QUFDVHBDLElBQUFBLEVBQUUsQ0FBQ3FDLE9BQUgsQ0FBVyxJQUFYLEVBQWlCLGdCQUFqQixFQUFtQyxvQkFBbkM7QUFDQUQsSUFBQUEsTUFBTSxHQUFHLElBQVQ7QUFDSDs7QUFDRCxTQUFPckMsV0FBUDtBQUNILENBTkQ7QUFRQXVDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnhDLFdBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKipcbiAqICEjZW4gVG9nZ2xlR3JvdXAgaXMgbm90IGEgdmlzaWFibGUgVUkgY29tcG9uZW50IGJ1dCBhIHdheSB0byBtb2RpZnkgdGhlIGJlaGF2aW9yIG9mIGEgc2V0IG9mIFRvZ2dsZXMuXG4gKiBUb2dnbGVzIHRoYXQgYmVsb25nIHRvIHRoZSBzYW1lIGdyb3VwIGNvdWxkIG9ubHkgaGF2ZSBvbmUgb2YgdGhlbSB0byBiZSBzd2l0Y2hlZCBvbiBhdCBhIHRpbWUuXG4gKiAhI3poIFRvZ2dsZUdyb3VwIOS4jeaYr+S4gOS4quWPr+ingeeahCBVSSDnu4Tku7bvvIzlroPlj6/ku6XnlKjmnaXkv67mlLnkuIDnu4QgVG9nZ2xlICDnu4Tku7bnmoTooYzkuLrjgILlvZPkuIDnu4QgVG9nZ2xlIOWxnuS6juWQjOS4gOS4qiBUb2dnbGVHcm91cCDnmoTml7blgJnvvIxcbiAqIOS7u+S9leaXtuWAmeWPquiDveacieS4gOS4qiBUb2dnbGUg5aSE5LqO6YCJ5Lit54q25oCB44CCXG4gKiBAY2xhc3MgVG9nZ2xlR3JvdXBcbiAqIEBleHRlbmRzIENvbXBvbmVudFxuICovXG52YXIgVG9nZ2xlR3JvdXAgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlRvZ2dsZUdyb3VwJyxcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgY3RvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl90b2dnbGVJdGVtcyA9IFtdO1xuICAgIH0sXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnVpL1RvZ2dsZUdyb3VwIChMZWdhY3kpJyxcbiAgICAgICAgaGVscDogJ2kxOG46Q09NUE9ORU5ULmhlbHBfdXJsLnRvZ2dsZUdyb3VwJ1xuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIElmIHRoaXMgc2V0dGluZyBpcyB0cnVlLCBhIHRvZ2dsZSBjb3VsZCBiZSBzd2l0Y2hlZCBvZmYgYW5kIG9uIHdoZW4gcHJlc3NlZC5cbiAgICAgICAgICogSWYgaXQgaXMgZmFsc2UsIGl0IHdpbGwgbWFrZSBzdXJlIHRoZXJlIGlzIGFsd2F5cyBvbmx5IG9uZSB0b2dnbGUgY291bGQgYmUgc3dpdGNoZWQgb25cbiAgICAgICAgICogYW5kIHRoZSBhbHJlYWR5IHN3aXRjaGVkIG9uIHRvZ2dsZSBjYW4ndCBiZSBzd2l0Y2hlZCBvZmYuXG4gICAgICAgICAqICEjemgg5aaC5p6c6L+Z5Liq6K6+572u5Li6IHRydWXvvIwg6YKj5LmIIHRvZ2dsZSDmjInpkq7lnKjooqvngrnlh7vnmoTml7blgJnlj6/ku6Xlj43lpI3lnLDooqvpgInkuK3lkozmnKrpgInkuK3jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBhbGxvd1N3aXRjaE9mZlxuICAgICAgICAgKi9cbiAgICAgICAgYWxsb3dTd2l0Y2hPZmY6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQudG9nZ2xlX2dyb3VwLmFsbG93U3dpdGNoT2ZmJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gUmVhZCBvbmx5IHByb3BlcnR5LCByZXR1cm4gdGhlIHRvZ2dsZSBpdGVtcyBhcnJheSByZWZlcmVuY2UgbWFuYWdlZCBieSB0b2dnbGVHcm91cC5cbiAgICAgICAgICogISN6aCDlj6ror7vlsZ7mgKfvvIzov5Tlm54gdG9nZ2xlR3JvdXAg566h55CG55qEIHRvZ2dsZSDmlbDnu4TlvJXnlKhcbiAgICAgICAgICogQHByb3BlcnR5IHtBcnJheX0gdG9nZ2xlSXRlbXNcbiAgICAgICAgICovXG4gICAgICAgIHRvZ2dsZUl0ZW1zOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdG9nZ2xlSXRlbXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlVG9nZ2xlczogZnVuY3Rpb24gKHRvZ2dsZSkge1xuICAgICAgICBpZighdGhpcy5lbmFibGVkSW5IaWVyYXJjaHkpIHJldHVybjtcblxuICAgICAgICB0aGlzLl90b2dnbGVJdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKXtcbiAgICAgICAgICAgIGlmKHRvZ2dsZS5pc0NoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSAhPT0gdG9nZ2xlICYmIGl0ZW0uaXNDaGVja2VkICYmIGl0ZW0uZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLl9oaWRlQ2hlY2tNYXJrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgYWRkVG9nZ2xlOiBmdW5jdGlvbiAodG9nZ2xlKSB7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuX3RvZ2dsZUl0ZW1zLmluZGV4T2YodG9nZ2xlKTtcbiAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5fdG9nZ2xlSXRlbXMucHVzaCh0b2dnbGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2FsbG93T25seU9uZVRvZ2dsZUNoZWNrZWQoKTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlVG9nZ2xlOiBmdW5jdGlvbiAodG9nZ2xlKSB7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuX3RvZ2dsZUl0ZW1zLmluZGV4T2YodG9nZ2xlKTtcbiAgICAgICAgaWYoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5fdG9nZ2xlSXRlbXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tYWtlQXRMZWFzdE9uZVRvZ2dsZUNoZWNrZWQoKTtcbiAgICB9LFxuXG4gICAgX2FsbG93T25seU9uZVRvZ2dsZUNoZWNrZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlzQ2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl90b2dnbGVJdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICBpZihpc0NoZWNrZWQgJiYgaXRlbS5lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5faGlkZUNoZWNrTWFyaygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaXRlbS5pc0NoZWNrZWQgJiYgaXRlbS5lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgaXNDaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGlzQ2hlY2tlZDtcbiAgICB9LFxuXG4gICAgX21ha2VBdExlYXN0T25lVG9nZ2xlQ2hlY2tlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaXNDaGVja2VkID0gdGhpcy5fYWxsb3dPbmx5T25lVG9nZ2xlQ2hlY2tlZCgpO1xuXG4gICAgICAgIGlmKCFpc0NoZWNrZWQgJiYgIXRoaXMuYWxsb3dTd2l0Y2hPZmYpIHtcbiAgICAgICAgICAgIGlmKHRoaXMuX3RvZ2dsZUl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90b2dnbGVJdGVtc1swXS5pc0NoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX21ha2VBdExlYXN0T25lVG9nZ2xlQ2hlY2tlZCgpO1xuICAgIH1cbn0pO1xuXG52YXIganMgPSByZXF1aXJlKCcuLi9wbGF0Zm9ybS9qcycpO1xudmFyIHNob3dlZCA9IGZhbHNlO1xuanMuZ2V0KGNjLCAnVG9nZ2xlR3JvdXAnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFzaG93ZWQpIHtcbiAgICAgICAgY2MuZXJyb3JJRCgxNDA1LCAnY2MuVG9nZ2xlR3JvdXAnLCAnY2MuVG9nZ2xlQ29udGFpbmVyJyk7XG4gICAgICAgIHNob3dlZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBUb2dnbGVHcm91cDtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRvZ2dsZUdyb3VwO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=