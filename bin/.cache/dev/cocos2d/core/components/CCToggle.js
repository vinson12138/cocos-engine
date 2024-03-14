
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCToggle.js';
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
var GraySpriteState = require('../utils/gray-sprite-state');
/**
 * !#en The toggle component is a CheckBox, when it used together with a ToggleGroup, it
 * could be treated as a RadioButton.
 * !#zh Toggle 是一个 CheckBox，当它和 ToggleGroup 一起使用的时候，可以变成 RadioButton。
 * @class Toggle
 * @extends Button
 * @uses GraySpriteState
 */


var Toggle = cc.Class({
  name: 'cc.Toggle',
  "extends": require('./CCButton'),
  mixins: [GraySpriteState],
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.ui/Toggle',
    help: 'i18n:COMPONENT.help_url.toggle',
    inspector: 'packages://inspector/inspectors/comps/toggle.js'
  },
  properties: {
    /**
     * !#en When this value is true, the check mark component will be enabled, otherwise
     * the check mark component will be disabled.
     * !#zh 如果这个设置为 true，则 check mark 组件会处于 enabled 状态，否则处于 disabled 状态。
     * @property {Boolean} isChecked
     */
    _N$isChecked: true,
    isChecked: {
      get: function get() {
        return this._N$isChecked;
      },
      set: function set(value) {
        if (value === this._N$isChecked) {
          return;
        }

        var group = this.toggleGroup || this._toggleContainer;

        if (group && group.enabled && this._N$isChecked) {
          if (!group.allowSwitchOff) {
            return;
          }
        }

        this._N$isChecked = value;

        this._updateCheckMark();

        if (group && group.enabled) {
          group.updateToggles(this);
        }

        if (cc.Toggle._triggerEventInScript_isChecked) {
          this._emitToggleEvents();
        }
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.toggle.isChecked'
    },

    /**
     * !#en The toggle group which the toggle belongs to, when it is null, the toggle is a CheckBox.
     * Otherwise, the toggle is a RadioButton.
     * !#zh Toggle 所属的 ToggleGroup，这个属性是可选的。如果这个属性为 null，则 Toggle 是一个 CheckBox，
     * 否则，Toggle 是一个 RadioButton。
     * @property {ToggleGroup} toggleGroup
     */
    toggleGroup: {
      "default": null,
      tooltip: CC_DEV && 'i18n:COMPONENT.toggle.toggleGroup',
      type: require('./CCToggleGroup')
    },

    /**
     * !#en The image used for the checkmark.
     * !#zh Toggle 处于选中状态时显示的图片
     * @property {Sprite} checkMark
     */
    checkMark: {
      "default": null,
      type: cc.Sprite,
      tooltip: CC_DEV && 'i18n:COMPONENT.toggle.checkMark'
    },

    /**
     * !#en If Toggle is clicked, it will trigger event's handler
     * !#zh Toggle 按钮的点击事件列表。
     * @property {Component.EventHandler[]} checkEvents
     */
    checkEvents: {
      "default": [],
      type: cc.Component.EventHandler
    },
    _resizeToTarget: {
      animatable: false,
      set: function set(value) {
        if (value) {
          this._resizeNodeToTargetNode();
        }
      }
    }
  },
  statics: {
    _triggerEventInScript_check: false,
    _triggerEventInScript_isChecked: false
  },
  onEnable: function onEnable() {
    this._super();

    if (!CC_EDITOR) {
      this._registerToggleEvent();
    }

    if (this.toggleGroup && this.toggleGroup.enabledInHierarchy) {
      this.toggleGroup.addToggle(this);
    }
  },
  onDisable: function onDisable() {
    this._super();

    if (!CC_EDITOR) {
      this._unregisterToggleEvent();
    }

    if (this.toggleGroup && this.toggleGroup.enabledInHierarchy) {
      this.toggleGroup.removeToggle(this);
    }
  },
  _hideCheckMark: function _hideCheckMark() {
    this._N$isChecked = false;

    this._updateCheckMark();
  },
  toggle: function toggle(event) {
    this.isChecked = !this.isChecked;

    if (!cc.Toggle._triggerEventInScript_isChecked && (cc.Toggle._triggerEventInScript_check || event)) {
      this._emitToggleEvents();
    }
  },

  /**
   * !#en Make the toggle button checked.
   * !#zh 使 toggle 按钮处于选中状态
   * @method check
   */
  check: function check() {
    this.isChecked = true;

    if (!cc.Toggle._triggerEventInScript_isChecked && cc.Toggle._triggerEventInScript_check) {
      this._emitToggleEvents();
    }
  },

  /**
   * !#en Make the toggle button unchecked.
   * !#zh 使 toggle 按钮处于未选中状态
   * @method uncheck
   */
  uncheck: function uncheck() {
    this.isChecked = false;

    if (!cc.Toggle._triggerEventInScript_isChecked && cc.Toggle._triggerEventInScript_check) {
      this._emitToggleEvents();
    }
  },
  _updateCheckMark: function _updateCheckMark() {
    if (this.checkMark) {
      this.checkMark.node.active = !!this.isChecked;
    }
  },
  _updateDisabledState: function _updateDisabledState() {
    this._super();

    if (this.enableAutoGrayEffect && this.checkMark) {
      var useGrayMaterial = !this.interactable;

      this._switchGrayMaterial(useGrayMaterial, this.checkMark);
    }
  },
  _registerToggleEvent: function _registerToggleEvent() {
    this.node.on('click', this.toggle, this);
  },
  _unregisterToggleEvent: function _unregisterToggleEvent() {
    this.node.off('click', this.toggle, this);
  },
  _emitToggleEvents: function _emitToggleEvents() {
    this.node.emit('toggle', this);

    if (this.checkEvents) {
      cc.Component.EventHandler.emitEvents(this.checkEvents, this);
    }
  }
});
cc.Toggle = module.exports = Toggle;

var js = require('../platform/js');

js.get(Toggle.prototype, '_toggleContainer', function () {
  var parent = this.node.parent;

  if (cc.Node.isNode(parent)) {
    return parent.getComponent(cc.ToggleContainer);
  }

  return null;
});
/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event toggle
 * @param {Event.EventCustom} event
 * @param {Toggle} toggle - The Toggle component.
 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvQ0NUb2dnbGUuanMiXSwibmFtZXMiOlsiR3JheVNwcml0ZVN0YXRlIiwicmVxdWlyZSIsIlRvZ2dsZSIsImNjIiwiQ2xhc3MiLCJuYW1lIiwibWl4aW5zIiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwibWVudSIsImhlbHAiLCJpbnNwZWN0b3IiLCJwcm9wZXJ0aWVzIiwiX04kaXNDaGVja2VkIiwiaXNDaGVja2VkIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJncm91cCIsInRvZ2dsZUdyb3VwIiwiX3RvZ2dsZUNvbnRhaW5lciIsImVuYWJsZWQiLCJhbGxvd1N3aXRjaE9mZiIsIl91cGRhdGVDaGVja01hcmsiLCJ1cGRhdGVUb2dnbGVzIiwiX3RyaWdnZXJFdmVudEluU2NyaXB0X2lzQ2hlY2tlZCIsIl9lbWl0VG9nZ2xlRXZlbnRzIiwidG9vbHRpcCIsIkNDX0RFViIsInR5cGUiLCJjaGVja01hcmsiLCJTcHJpdGUiLCJjaGVja0V2ZW50cyIsIkNvbXBvbmVudCIsIkV2ZW50SGFuZGxlciIsIl9yZXNpemVUb1RhcmdldCIsImFuaW1hdGFibGUiLCJfcmVzaXplTm9kZVRvVGFyZ2V0Tm9kZSIsInN0YXRpY3MiLCJfdHJpZ2dlckV2ZW50SW5TY3JpcHRfY2hlY2siLCJvbkVuYWJsZSIsIl9zdXBlciIsIl9yZWdpc3RlclRvZ2dsZUV2ZW50IiwiZW5hYmxlZEluSGllcmFyY2h5IiwiYWRkVG9nZ2xlIiwib25EaXNhYmxlIiwiX3VucmVnaXN0ZXJUb2dnbGVFdmVudCIsInJlbW92ZVRvZ2dsZSIsIl9oaWRlQ2hlY2tNYXJrIiwidG9nZ2xlIiwiZXZlbnQiLCJjaGVjayIsInVuY2hlY2siLCJub2RlIiwiYWN0aXZlIiwiX3VwZGF0ZURpc2FibGVkU3RhdGUiLCJlbmFibGVBdXRvR3JheUVmZmVjdCIsInVzZUdyYXlNYXRlcmlhbCIsImludGVyYWN0YWJsZSIsIl9zd2l0Y2hHcmF5TWF0ZXJpYWwiLCJvbiIsIm9mZiIsImVtaXQiLCJlbWl0RXZlbnRzIiwibW9kdWxlIiwiZXhwb3J0cyIsImpzIiwicHJvdG90eXBlIiwicGFyZW50IiwiTm9kZSIsImlzTm9kZSIsImdldENvbXBvbmVudCIsIlRvZ2dsZUNvbnRhaW5lciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsZUFBZSxHQUFHQyxPQUFPLENBQUMsNEJBQUQsQ0FBL0I7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFJQyxNQUFNLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ2xCQyxFQUFBQSxJQUFJLEVBQUUsV0FEWTtBQUVsQixhQUFTSixPQUFPLENBQUMsWUFBRCxDQUZFO0FBR2xCSyxFQUFBQSxNQUFNLEVBQUUsQ0FBQ04sZUFBRCxDQUhVO0FBSWxCTyxFQUFBQSxNQUFNLEVBQUVDLFNBQVMsSUFBSTtBQUNqQkMsSUFBQUEsSUFBSSxFQUFFLG9DQURXO0FBRWpCQyxJQUFBQSxJQUFJLEVBQUUsZ0NBRlc7QUFHakJDLElBQUFBLFNBQVMsRUFBRTtBQUhNLEdBSkg7QUFVbEJDLEVBQUFBLFVBQVUsRUFBRTtBQUNSO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNRQyxJQUFBQSxZQUFZLEVBQUUsSUFQTjtBQVFSQyxJQUFBQSxTQUFTLEVBQUU7QUFDUEMsTUFBQUEsR0FBRyxFQUFFLGVBQVk7QUFDYixlQUFPLEtBQUtGLFlBQVo7QUFDSCxPQUhNO0FBSVBHLE1BQUFBLEdBQUcsRUFBRSxhQUFVQyxLQUFWLEVBQWlCO0FBQ2xCLFlBQUlBLEtBQUssS0FBSyxLQUFLSixZQUFuQixFQUFpQztBQUM3QjtBQUNIOztBQUVELFlBQUlLLEtBQUssR0FBRyxLQUFLQyxXQUFMLElBQW9CLEtBQUtDLGdCQUFyQzs7QUFDQSxZQUFJRixLQUFLLElBQUlBLEtBQUssQ0FBQ0csT0FBZixJQUEwQixLQUFLUixZQUFuQyxFQUFpRDtBQUM3QyxjQUFJLENBQUNLLEtBQUssQ0FBQ0ksY0FBWCxFQUEyQjtBQUN2QjtBQUNIO0FBRUo7O0FBRUQsYUFBS1QsWUFBTCxHQUFvQkksS0FBcEI7O0FBQ0EsYUFBS00sZ0JBQUw7O0FBRUEsWUFBSUwsS0FBSyxJQUFJQSxLQUFLLENBQUNHLE9BQW5CLEVBQTRCO0FBQ3hCSCxVQUFBQSxLQUFLLENBQUNNLGFBQU4sQ0FBb0IsSUFBcEI7QUFDSDs7QUFFRCxZQUFJckIsRUFBRSxDQUFDRCxNQUFILENBQVV1QiwrQkFBZCxFQUErQztBQUMzQyxlQUFLQyxpQkFBTDtBQUNIO0FBQ0osT0EzQk07QUE0QlBDLE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxJQUFJO0FBNUJaLEtBUkg7O0FBdUNSO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1FULElBQUFBLFdBQVcsRUFBRTtBQUNULGlCQUFTLElBREE7QUFFVFEsTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUksbUNBRlY7QUFHVEMsTUFBQUEsSUFBSSxFQUFFNUIsT0FBTyxDQUFDLGlCQUFEO0FBSEosS0E5Q0w7O0FBb0RSO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDUTZCLElBQUFBLFNBQVMsRUFBRTtBQUNQLGlCQUFTLElBREY7QUFFUEQsTUFBQUEsSUFBSSxFQUFFMUIsRUFBRSxDQUFDNEIsTUFGRjtBQUdQSixNQUFBQSxPQUFPLEVBQUVDLE1BQU0sSUFBSTtBQUhaLEtBekRIOztBQStEUjtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ1FJLElBQUFBLFdBQVcsRUFBRTtBQUNULGlCQUFTLEVBREE7QUFFVEgsTUFBQUEsSUFBSSxFQUFFMUIsRUFBRSxDQUFDOEIsU0FBSCxDQUFhQztBQUZWLEtBcEVMO0FBeUVSQyxJQUFBQSxlQUFlLEVBQUU7QUFDYkMsTUFBQUEsVUFBVSxFQUFFLEtBREM7QUFFYnBCLE1BQUFBLEdBQUcsRUFBRSxhQUFVQyxLQUFWLEVBQWlCO0FBQ2xCLFlBQUlBLEtBQUosRUFBVztBQUNQLGVBQUtvQix1QkFBTDtBQUNIO0FBQ0o7QUFOWTtBQXpFVCxHQVZNO0FBOEZsQkMsRUFBQUEsT0FBTyxFQUFFO0FBQ0xDLElBQUFBLDJCQUEyQixFQUFFLEtBRHhCO0FBRUxkLElBQUFBLCtCQUErQixFQUFFO0FBRjVCLEdBOUZTO0FBbUdsQmUsRUFBQUEsUUFBUSxFQUFFLG9CQUFZO0FBQ2xCLFNBQUtDLE1BQUw7O0FBQ0EsUUFBSSxDQUFDakMsU0FBTCxFQUFnQjtBQUNaLFdBQUtrQyxvQkFBTDtBQUNIOztBQUNELFFBQUksS0FBS3ZCLFdBQUwsSUFBb0IsS0FBS0EsV0FBTCxDQUFpQndCLGtCQUF6QyxFQUE2RDtBQUN6RCxXQUFLeEIsV0FBTCxDQUFpQnlCLFNBQWpCLENBQTJCLElBQTNCO0FBQ0g7QUFDSixHQTNHaUI7QUE2R2xCQyxFQUFBQSxTQUFTLEVBQUUscUJBQVk7QUFDbkIsU0FBS0osTUFBTDs7QUFDQSxRQUFJLENBQUNqQyxTQUFMLEVBQWdCO0FBQ1osV0FBS3NDLHNCQUFMO0FBQ0g7O0FBQ0QsUUFBSSxLQUFLM0IsV0FBTCxJQUFvQixLQUFLQSxXQUFMLENBQWlCd0Isa0JBQXpDLEVBQTZEO0FBQ3pELFdBQUt4QixXQUFMLENBQWlCNEIsWUFBakIsQ0FBOEIsSUFBOUI7QUFDSDtBQUNKLEdBckhpQjtBQXVIbEJDLEVBQUFBLGNBdkhrQiw0QkF1SEE7QUFDZCxTQUFLbkMsWUFBTCxHQUFvQixLQUFwQjs7QUFDQSxTQUFLVSxnQkFBTDtBQUNILEdBMUhpQjtBQTRIbEIwQixFQUFBQSxNQUFNLEVBQUUsZ0JBQVVDLEtBQVYsRUFBaUI7QUFDckIsU0FBS3BDLFNBQUwsR0FBaUIsQ0FBQyxLQUFLQSxTQUF2Qjs7QUFDQSxRQUFJLENBQUNYLEVBQUUsQ0FBQ0QsTUFBSCxDQUFVdUIsK0JBQVgsS0FBK0N0QixFQUFFLENBQUNELE1BQUgsQ0FBVXFDLDJCQUFWLElBQXlDVyxLQUF4RixDQUFKLEVBQW9HO0FBQ2hHLFdBQUt4QixpQkFBTDtBQUNIO0FBQ0osR0FqSWlCOztBQW1JbEI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNJeUIsRUFBQUEsS0FBSyxFQUFFLGlCQUFZO0FBQ2YsU0FBS3JDLFNBQUwsR0FBaUIsSUFBakI7O0FBQ0EsUUFBSSxDQUFDWCxFQUFFLENBQUNELE1BQUgsQ0FBVXVCLCtCQUFYLElBQThDdEIsRUFBRSxDQUFDRCxNQUFILENBQVVxQywyQkFBNUQsRUFBeUY7QUFDckYsV0FBS2IsaUJBQUw7QUFDSDtBQUNKLEdBN0lpQjs7QUErSWxCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSTBCLEVBQUFBLE9BQU8sRUFBRSxtQkFBWTtBQUNqQixTQUFLdEMsU0FBTCxHQUFpQixLQUFqQjs7QUFDQSxRQUFJLENBQUNYLEVBQUUsQ0FBQ0QsTUFBSCxDQUFVdUIsK0JBQVgsSUFBOEN0QixFQUFFLENBQUNELE1BQUgsQ0FBVXFDLDJCQUE1RCxFQUF5RjtBQUNyRixXQUFLYixpQkFBTDtBQUNIO0FBQ0osR0F6SmlCO0FBMkpsQkgsRUFBQUEsZ0JBQWdCLEVBQUUsNEJBQVk7QUFDMUIsUUFBSSxLQUFLTyxTQUFULEVBQW9CO0FBQ2hCLFdBQUtBLFNBQUwsQ0FBZXVCLElBQWYsQ0FBb0JDLE1BQXBCLEdBQTZCLENBQUMsQ0FBQyxLQUFLeEMsU0FBcEM7QUFDSDtBQUNKLEdBL0ppQjtBQWlLbEJ5QyxFQUFBQSxvQkFBb0IsRUFBRSxnQ0FBWTtBQUM5QixTQUFLZCxNQUFMOztBQUVBLFFBQUksS0FBS2Usb0JBQUwsSUFBNkIsS0FBSzFCLFNBQXRDLEVBQWlEO0FBQzdDLFVBQUkyQixlQUFlLEdBQUcsQ0FBQyxLQUFLQyxZQUE1Qjs7QUFDQSxXQUFLQyxtQkFBTCxDQUF5QkYsZUFBekIsRUFBMEMsS0FBSzNCLFNBQS9DO0FBQ0g7QUFDSixHQXhLaUI7QUEwS2xCWSxFQUFBQSxvQkFBb0IsRUFBRSxnQ0FBWTtBQUM5QixTQUFLVyxJQUFMLENBQVVPLEVBQVYsQ0FBYSxPQUFiLEVBQXNCLEtBQUtYLE1BQTNCLEVBQW1DLElBQW5DO0FBQ0gsR0E1S2lCO0FBOEtsQkgsRUFBQUEsc0JBQXNCLEVBQUUsa0NBQVk7QUFDaEMsU0FBS08sSUFBTCxDQUFVUSxHQUFWLENBQWMsT0FBZCxFQUF1QixLQUFLWixNQUE1QixFQUFvQyxJQUFwQztBQUNILEdBaExpQjtBQWtMbEJ2QixFQUFBQSxpQkFBaUIsRUFBRSw2QkFBWTtBQUMzQixTQUFLMkIsSUFBTCxDQUFVUyxJQUFWLENBQWUsUUFBZixFQUF5QixJQUF6Qjs7QUFDQSxRQUFJLEtBQUs5QixXQUFULEVBQXNCO0FBQ2xCN0IsTUFBQUEsRUFBRSxDQUFDOEIsU0FBSCxDQUFhQyxZQUFiLENBQTBCNkIsVUFBMUIsQ0FBcUMsS0FBSy9CLFdBQTFDLEVBQXVELElBQXZEO0FBQ0g7QUFDSjtBQXZMaUIsQ0FBVCxDQUFiO0FBMkxBN0IsRUFBRSxDQUFDRCxNQUFILEdBQVk4RCxNQUFNLENBQUNDLE9BQVAsR0FBaUIvRCxNQUE3Qjs7QUFFQSxJQUFNZ0UsRUFBRSxHQUFHakUsT0FBTyxDQUFDLGdCQUFELENBQWxCOztBQUVBaUUsRUFBRSxDQUFDbkQsR0FBSCxDQUFPYixNQUFNLENBQUNpRSxTQUFkLEVBQXlCLGtCQUF6QixFQUNJLFlBQVk7QUFDUixNQUFJQyxNQUFNLEdBQUcsS0FBS2YsSUFBTCxDQUFVZSxNQUF2Qjs7QUFDQSxNQUFJakUsRUFBRSxDQUFDa0UsSUFBSCxDQUFRQyxNQUFSLENBQWVGLE1BQWYsQ0FBSixFQUE0QjtBQUN4QixXQUFPQSxNQUFNLENBQUNHLFlBQVAsQ0FBb0JwRSxFQUFFLENBQUNxRSxlQUF2QixDQUFQO0FBQ0g7O0FBQ0QsU0FBTyxJQUFQO0FBQ0gsQ0FQTDtBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3QgR3JheVNwcml0ZVN0YXRlID0gcmVxdWlyZSgnLi4vdXRpbHMvZ3JheS1zcHJpdGUtc3RhdGUnKTtcblxuLyoqXG4gKiAhI2VuIFRoZSB0b2dnbGUgY29tcG9uZW50IGlzIGEgQ2hlY2tCb3gsIHdoZW4gaXQgdXNlZCB0b2dldGhlciB3aXRoIGEgVG9nZ2xlR3JvdXAsIGl0XG4gKiBjb3VsZCBiZSB0cmVhdGVkIGFzIGEgUmFkaW9CdXR0b24uXG4gKiAhI3poIFRvZ2dsZSDmmK/kuIDkuKogQ2hlY2tCb3jvvIzlvZPlroPlkowgVG9nZ2xlR3JvdXAg5LiA6LW35L2/55So55qE5pe25YCZ77yM5Y+v5Lul5Y+Y5oiQIFJhZGlvQnV0dG9u44CCXG4gKiBAY2xhc3MgVG9nZ2xlXG4gKiBAZXh0ZW5kcyBCdXR0b25cbiAqIEB1c2VzIEdyYXlTcHJpdGVTdGF0ZVxuICovXG5sZXQgVG9nZ2xlID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5Ub2dnbGUnLFxuICAgIGV4dGVuZHM6IHJlcXVpcmUoJy4vQ0NCdXR0b24nKSxcbiAgICBtaXhpbnM6IFtHcmF5U3ByaXRlU3RhdGVdLFxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC51aS9Ub2dnbGUnLFxuICAgICAgICBoZWxwOiAnaTE4bjpDT01QT05FTlQuaGVscF91cmwudG9nZ2xlJyxcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy90b2dnbGUuanMnLFxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFdoZW4gdGhpcyB2YWx1ZSBpcyB0cnVlLCB0aGUgY2hlY2sgbWFyayBjb21wb25lbnQgd2lsbCBiZSBlbmFibGVkLCBvdGhlcndpc2VcbiAgICAgICAgICogdGhlIGNoZWNrIG1hcmsgY29tcG9uZW50IHdpbGwgYmUgZGlzYWJsZWQuXG4gICAgICAgICAqICEjemgg5aaC5p6c6L+Z5Liq6K6+572u5Li6IHRydWXvvIzliJkgY2hlY2sgbWFyayDnu4Tku7bkvJrlpITkuo4gZW5hYmxlZCDnirbmgIHvvIzlkKbliJnlpITkuo4gZGlzYWJsZWQg54q25oCB44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gaXNDaGVja2VkXG4gICAgICAgICAqL1xuICAgICAgICBfTiRpc0NoZWNrZWQ6IHRydWUsXG4gICAgICAgIGlzQ2hlY2tlZDoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX04kaXNDaGVja2VkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLl9OJGlzQ2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwID0gdGhpcy50b2dnbGVHcm91cCB8fCB0aGlzLl90b2dnbGVDb250YWluZXI7XG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwICYmIGdyb3VwLmVuYWJsZWQgJiYgdGhpcy5fTiRpc0NoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFncm91cC5hbGxvd1N3aXRjaE9mZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9OJGlzQ2hlY2tlZCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUNoZWNrTWFyaygpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwICYmIGdyb3VwLmVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAudXBkYXRlVG9nZ2xlcyh0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoY2MuVG9nZ2xlLl90cmlnZ2VyRXZlbnRJblNjcmlwdF9pc0NoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZW1pdFRvZ2dsZUV2ZW50cygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnRvZ2dsZS5pc0NoZWNrZWQnLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSB0b2dnbGUgZ3JvdXAgd2hpY2ggdGhlIHRvZ2dsZSBiZWxvbmdzIHRvLCB3aGVuIGl0IGlzIG51bGwsIHRoZSB0b2dnbGUgaXMgYSBDaGVja0JveC5cbiAgICAgICAgICogT3RoZXJ3aXNlLCB0aGUgdG9nZ2xlIGlzIGEgUmFkaW9CdXR0b24uXG4gICAgICAgICAqICEjemggVG9nZ2xlIOaJgOWxnueahCBUb2dnbGVHcm91cO+8jOi/meS4quWxnuaAp+aYr+WPr+mAieeahOOAguWmguaenOi/meS4quWxnuaAp+S4uiBudWxs77yM5YiZIFRvZ2dsZSDmmK/kuIDkuKogQ2hlY2tCb3jvvIxcbiAgICAgICAgICog5ZCm5YiZ77yMVG9nZ2xlIOaYr+S4gOS4qiBSYWRpb0J1dHRvbuOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1RvZ2dsZUdyb3VwfSB0b2dnbGVHcm91cFxuICAgICAgICAgKi9cbiAgICAgICAgdG9nZ2xlR3JvdXA6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnRvZ2dsZS50b2dnbGVHcm91cCcsXG4gICAgICAgICAgICB0eXBlOiByZXF1aXJlKCcuL0NDVG9nZ2xlR3JvdXAnKVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBpbWFnZSB1c2VkIGZvciB0aGUgY2hlY2ttYXJrLlxuICAgICAgICAgKiAhI3poIFRvZ2dsZSDlpITkuo7pgInkuK3nirbmgIHml7bmmL7npLrnmoTlm77niYdcbiAgICAgICAgICogQHByb3BlcnR5IHtTcHJpdGV9IGNoZWNrTWFya1xuICAgICAgICAgKi9cbiAgICAgICAgY2hlY2tNYXJrOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC50b2dnbGUuY2hlY2tNYXJrJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIElmIFRvZ2dsZSBpcyBjbGlja2VkLCBpdCB3aWxsIHRyaWdnZXIgZXZlbnQncyBoYW5kbGVyXG4gICAgICAgICAqICEjemggVG9nZ2xlIOaMiemSrueahOeCueWHu+S6i+S7tuWIl+ihqOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0NvbXBvbmVudC5FdmVudEhhbmRsZXJbXX0gY2hlY2tFdmVudHNcbiAgICAgICAgICovXG4gICAgICAgIGNoZWNrRXZlbnRzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXJcbiAgICAgICAgfSxcblxuICAgICAgICBfcmVzaXplVG9UYXJnZXQ6IHtcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTm9kZVRvVGFyZ2V0Tm9kZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIF90cmlnZ2VyRXZlbnRJblNjcmlwdF9jaGVjazogZmFsc2UsXG4gICAgICAgIF90cmlnZ2VyRXZlbnRJblNjcmlwdF9pc0NoZWNrZWQ6IGZhbHNlLFxuICAgIH0sXG5cbiAgICBvbkVuYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICBpZiAoIUNDX0VESVRPUikge1xuICAgICAgICAgICAgdGhpcy5fcmVnaXN0ZXJUb2dnbGVFdmVudCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnRvZ2dsZUdyb3VwICYmIHRoaXMudG9nZ2xlR3JvdXAuZW5hYmxlZEluSGllcmFyY2h5KSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUdyb3VwLmFkZFRvZ2dsZSh0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgaWYgKCFDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRoaXMuX3VucmVnaXN0ZXJUb2dnbGVFdmVudCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnRvZ2dsZUdyb3VwICYmIHRoaXMudG9nZ2xlR3JvdXAuZW5hYmxlZEluSGllcmFyY2h5KSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUdyb3VwLnJlbW92ZVRvZ2dsZSh0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfaGlkZUNoZWNrTWFyayAoKSB7XG4gICAgICAgIHRoaXMuX04kaXNDaGVja2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUNoZWNrTWFyaygpO1xuICAgIH0sXG5cbiAgICB0b2dnbGU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB0aGlzLmlzQ2hlY2tlZCA9ICF0aGlzLmlzQ2hlY2tlZDtcbiAgICAgICAgaWYgKCFjYy5Ub2dnbGUuX3RyaWdnZXJFdmVudEluU2NyaXB0X2lzQ2hlY2tlZCAmJiAoY2MuVG9nZ2xlLl90cmlnZ2VyRXZlbnRJblNjcmlwdF9jaGVjayB8fCBldmVudCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2VtaXRUb2dnbGVFdmVudHMoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIE1ha2UgdGhlIHRvZ2dsZSBidXR0b24gY2hlY2tlZC5cbiAgICAgKiAhI3poIOS9vyB0b2dnbGUg5oyJ6ZKu5aSE5LqO6YCJ5Lit54q25oCBXG4gICAgICogQG1ldGhvZCBjaGVja1xuICAgICAqL1xuICAgIGNoZWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaXNDaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgaWYgKCFjYy5Ub2dnbGUuX3RyaWdnZXJFdmVudEluU2NyaXB0X2lzQ2hlY2tlZCAmJiBjYy5Ub2dnbGUuX3RyaWdnZXJFdmVudEluU2NyaXB0X2NoZWNrKSB7XG4gICAgICAgICAgICB0aGlzLl9lbWl0VG9nZ2xlRXZlbnRzKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBNYWtlIHRoZSB0b2dnbGUgYnV0dG9uIHVuY2hlY2tlZC5cbiAgICAgKiAhI3poIOS9vyB0b2dnbGUg5oyJ6ZKu5aSE5LqO5pyq6YCJ5Lit54q25oCBXG4gICAgICogQG1ldGhvZCB1bmNoZWNrXG4gICAgICovXG4gICAgdW5jaGVjazogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmlzQ2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoIWNjLlRvZ2dsZS5fdHJpZ2dlckV2ZW50SW5TY3JpcHRfaXNDaGVja2VkICYmIGNjLlRvZ2dsZS5fdHJpZ2dlckV2ZW50SW5TY3JpcHRfY2hlY2spIHtcbiAgICAgICAgICAgIHRoaXMuX2VtaXRUb2dnbGVFdmVudHMoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXBkYXRlQ2hlY2tNYXJrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrTWFyaykge1xuICAgICAgICAgICAgdGhpcy5jaGVja01hcmsubm9kZS5hY3RpdmUgPSAhIXRoaXMuaXNDaGVja2VkO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVEaXNhYmxlZFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlQXV0b0dyYXlFZmZlY3QgJiYgdGhpcy5jaGVja01hcmspIHtcbiAgICAgICAgICAgIGxldCB1c2VHcmF5TWF0ZXJpYWwgPSAhdGhpcy5pbnRlcmFjdGFibGU7XG4gICAgICAgICAgICB0aGlzLl9zd2l0Y2hHcmF5TWF0ZXJpYWwodXNlR3JheU1hdGVyaWFsLCB0aGlzLmNoZWNrTWFyayk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3JlZ2lzdGVyVG9nZ2xlRXZlbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdjbGljaycsIHRoaXMudG9nZ2xlLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX3VucmVnaXN0ZXJUb2dnbGVFdmVudDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm5vZGUub2ZmKCdjbGljaycsIHRoaXMudG9nZ2xlLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX2VtaXRUb2dnbGVFdmVudHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLmVtaXQoJ3RvZ2dsZScsIHRoaXMpO1xuICAgICAgICBpZiAodGhpcy5jaGVja0V2ZW50cykge1xuICAgICAgICAgICAgY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlci5lbWl0RXZlbnRzKHRoaXMuY2hlY2tFdmVudHMsIHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG59KTtcblxuY2MuVG9nZ2xlID0gbW9kdWxlLmV4cG9ydHMgPSBUb2dnbGU7XG5cbmNvbnN0IGpzID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vanMnKTtcblxuanMuZ2V0KFRvZ2dsZS5wcm90b3R5cGUsICdfdG9nZ2xlQ29udGFpbmVyJyxcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLm5vZGUucGFyZW50O1xuICAgICAgICBpZiAoY2MuTm9kZS5pc05vZGUocGFyZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcmVudC5nZXRDb21wb25lbnQoY2MuVG9nZ2xlQ29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4pO1xuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IHRvZ2dsZVxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqIEBwYXJhbSB7VG9nZ2xlfSB0b2dnbGUgLSBUaGUgVG9nZ2xlIGNvbXBvbmVudC5cbiAqL1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=