
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCButton.js';
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
var Component = require('./CCComponent');

var GraySpriteState = require('../utils/gray-sprite-state');
/**
 * !#en Enum for transition type.
 * !#zh 过渡类型
 * @enum Button.Transition
 */


var Transition = cc.Enum({
  /**
   * !#en The none type.
   * !#zh 不做任何过渡
   * @property {Number} NONE
   */
  NONE: 0,

  /**
   * !#en The color type.
   * !#zh 颜色过渡
   * @property {Number} COLOR
   */
  COLOR: 1,

  /**
   * !#en The sprite type.
   * !#zh 精灵过渡
   * @property {Number} SPRITE
   */
  SPRITE: 2,

  /**
   * !#en The scale type
   * !#zh 缩放过渡
   * @property {Number} SCALE
   */
  SCALE: 3
});
var State = cc.Enum({
  NORMAL: 0,
  HOVER: 1,
  PRESSED: 2,
  DISABLED: 3
});
/**
 * !#en
 * Button component. Can be pressed or clicked. Button has 4 Transition types:
 * 
 *   - Button.Transition.NONE   // Button will do nothing
 *   - Button.Transition.COLOR  // Button will change target's color
 *   - Button.Transition.SPRITE // Button will change target Sprite's sprite
 *   - Button.Transition.SCALE // Button will change target node's scale
 *
 * The button can bind events (but you must be on the button's node to bind events).<br/>
 * The following events can be triggered on all platforms.
 * 
 *  - cc.Node.EventType.TOUCH_START  // Press
 *  - cc.Node.EventType.TOUCH_MOVE   // After pressing and moving
 *  - cc.Node.EventType.TOUCH_END    // After pressing and releasing
 *  - cc.Node.EventType.TOUCH_CANCEL // Press to cancel
 * 
 * The following events are only triggered on the PC platform:
 *
 *   - cc.Node.EventType.MOUSE_DOWN
 *   - cc.Node.EventType.MOUSE_MOVE
 *   - cc.Node.EventType.MOUSE_ENTER
 *   - cc.Node.EventType.MOUSE_LEAVE
 *   - cc.Node.EventType.MOUSE_UP
 *   - cc.Node.EventType.MOUSE_WHEEL
 *
 * User can get the current clicked node with 'event.target' from event object which is passed as parameter in the callback function of click event.
 *
 * !#zh
 * 按钮组件。可以被按下，或者点击。
 *
 * 按钮可以通过修改 Transition 来设置按钮状态过渡的方式：
 * 
 *   - Button.Transition.NONE   // 不做任何过渡
 *   - Button.Transition.COLOR  // 进行颜色之间过渡
 *   - Button.Transition.SPRITE // 进行精灵之间过渡
 *   - Button.Transition.SCALE // 进行缩放过渡
 *
 * 按钮可以绑定事件（但是必须要在按钮的 Node 上才能绑定事件）：<br/>
 * 以下事件可以在全平台上都触发：
 * 
 *   - cc.Node.EventType.TOUCH_START  // 按下时事件
 *   - cc.Node.EventType.TOUCH_MOVE   // 按住移动后事件
 *   - cc.Node.EventType.TOUCH_END    // 按下后松开后事件
 *   - cc.Node.EventType.TOUCH_CANCEL // 按下取消事件
 * 
 * 以下事件只在 PC 平台上触发：
 * 
 *   - cc.Node.EventType.MOUSE_DOWN  // 鼠标按下时事件
 *   - cc.Node.EventType.MOUSE_MOVE  // 鼠标按住移动后事件
 *   - cc.Node.EventType.MOUSE_ENTER // 鼠标进入目标事件
 *   - cc.Node.EventType.MOUSE_LEAVE // 鼠标离开目标事件
 *   - cc.Node.EventType.MOUSE_UP    // 鼠标松开事件
 *   - cc.Node.EventType.MOUSE_WHEEL // 鼠标滚轮事件
 * 
 * 用户可以通过获取 __点击事件__ 回调函数的参数 event 的 target 属性获取当前点击对象。
 * @class Button
 * @extends Component
 * @uses GraySpriteState
 * @example
 *
 * // Add an event to the button.
 * button.node.on(cc.Node.EventType.TOUCH_START, function (event) {
 *     cc.log("This is a callback after the trigger event");
 * });

 * // You could also add a click event
 * //Note: In this way, you can't get the touch event info, so use it wisely.
 * button.node.on('click', function (button) {
 *    //The event is a custom event, you could get the Button component via first argument
 * })
 *
 */

var Button = cc.Class({
  name: 'cc.Button',
  "extends": Component,
  mixins: [GraySpriteState],
  ctor: function ctor() {
    this._pressed = false;
    this._hovered = false;
    this._fromColor = null;
    this._toColor = null;
    this._time = 0;
    this._transitionFinished = true; // init _originalScale in __preload()

    this._fromScale = cc.Vec2.ZERO;
    this._toScale = cc.Vec2.ZERO;
    this._originalScale = null;
    this._graySpriteMaterial = null;
    this._spriteMaterial = null;
    this._sprite = null;
  },
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.ui/Button',
    help: 'i18n:COMPONENT.help_url.button',
    inspector: 'packages://inspector/inspectors/comps/button.js',
    executeInEditMode: true
  },
  properties: {
    /**
     * !#en
     * Whether the Button is disabled.
     * If true, the Button will trigger event and do transition.
     * !#zh
     * 按钮事件是否被响应，如果为 false，则按钮将被禁用。
     * @property {Boolean} interactable
     * @default true
     */
    interactable: {
      "default": true,
      tooltip: CC_DEV && 'i18n:COMPONENT.button.interactable',
      notify: function notify() {
        this._updateState();

        if (!this.interactable) {
          this._resetState();
        }
      },
      animatable: false
    },
    _resizeToTarget: {
      animatable: false,
      set: function set(value) {
        if (value) {
          this._resizeNodeToTargetNode();
        }
      }
    },

    /**
     * !#en When this flag is true, Button target sprite will turn gray when interactable is false.
     * !#zh 如果这个标记为 true，当 button 的 interactable 属性为 false 的时候，会使用内置 shader 让 button 的 target 节点的 sprite 组件变灰
     * @property {Boolean} enableAutoGrayEffect
     */
    enableAutoGrayEffect: {
      "default": false,
      tooltip: CC_DEV && 'i18n:COMPONENT.button.auto_gray_effect',
      notify: function notify() {
        this._updateDisabledState(true);
      }
    },

    /**
     * !#en Transition type
     * !#zh 按钮状态改变时过渡方式。
     * @property {Button.Transition} transition
     * @default Button.Transition.Node
     */
    transition: {
      "default": Transition.NONE,
      tooltip: CC_DEV && 'i18n:COMPONENT.button.transition',
      type: Transition,
      animatable: false,
      notify: function notify(oldValue) {
        this._updateTransition(oldValue);
      },
      formerlySerializedAs: 'transition'
    },
    // color transition

    /**
     * !#en Normal state color.
     * !#zh 普通状态下按钮所显示的颜色。
     * @property {Color} normalColor
     */
    normalColor: {
      "default": cc.Color.WHITE,
      displayName: 'Normal',
      tooltip: CC_DEV && 'i18n:COMPONENT.button.normal_color',
      notify: function notify() {
        if (this.transition === Transition.Color && this._getButtonState() === State.NORMAL) {
          this._getTarget().opacity = this.normalColor.a;
        }

        this._updateState();
      }
    },

    /**
     * !#en Pressed state color
     * !#zh 按下状态时按钮所显示的颜色。
     * @property {Color} pressedColor
     */
    pressedColor: {
      "default": cc.color(211, 211, 211),
      displayName: 'Pressed',
      tooltip: CC_DEV && 'i18n:COMPONENT.button.pressed_color',
      notify: function notify() {
        if (this.transition === Transition.Color && this._getButtonState() === State.PRESSED) {
          this._getTarget().opacity = this.pressedColor.a;
        }

        this._updateState();
      },
      formerlySerializedAs: 'pressedColor'
    },

    /**
     * !#en Hover state color
     * !#zh 悬停状态下按钮所显示的颜色。
     * @property {Color} hoverColor
     */
    hoverColor: {
      "default": cc.Color.WHITE,
      displayName: 'Hover',
      tooltip: CC_DEV && 'i18n:COMPONENT.button.hover_color',
      notify: function notify() {
        if (this.transition === Transition.Color && this._getButtonState() === State.HOVER) {
          this._getTarget().opacity = this.hoverColor.a;
        }

        this._updateState();
      },
      formerlySerializedAs: 'hoverColor'
    },

    /**
     * !#en Disabled state color
     * !#zh 禁用状态下按钮所显示的颜色。
     * @property {Color} disabledColor
     */
    disabledColor: {
      "default": cc.color(124, 124, 124),
      displayName: 'Disabled',
      tooltip: CC_DEV && 'i18n:COMPONENT.button.disabled_color',
      notify: function notify() {
        if (this.transition === Transition.Color && this._getButtonState() === State.DISABLED) {
          this._getTarget().opacity = this.disabledColor.a;
        }

        this._updateState();
      }
    },

    /**
     * !#en Color and Scale transition duration
     * !#zh 颜色过渡和缩放过渡时所需时间
     * @property {Number} duration
     */
    duration: {
      "default": 0.1,
      range: [0, 10],
      tooltip: CC_DEV && 'i18n:COMPONENT.button.duration'
    },

    /**
     * !#en  When user press the button, the button will zoom to a scale.
     * The final scale of the button  equals (button original scale * zoomScale)
     * !#zh 当用户点击按钮后，按钮会缩放到一个值，这个值等于 Button 原始 scale * zoomScale
     * @property {Number} zoomScale
     */
    zoomScale: {
      "default": 1.2,
      tooltip: CC_DEV && 'i18n:COMPONENT.button.zoom_scale'
    },
    // sprite transition

    /**
     * !#en Normal state sprite
     * !#zh 普通状态下按钮所显示的 Sprite 。
     * @property {SpriteFrame} normalSprite
     */
    normalSprite: {
      "default": null,
      type: cc.SpriteFrame,
      displayName: 'Normal',
      tooltip: CC_DEV && 'i18n:COMPONENT.button.normal_sprite',
      notify: function notify() {
        this._updateState();
      }
    },

    /**
     * !#en Pressed state sprite
     * !#zh 按下状态时按钮所显示的 Sprite 。
     * @property {SpriteFrame} pressedSprite
     */
    pressedSprite: {
      "default": null,
      type: cc.SpriteFrame,
      displayName: 'Pressed',
      tooltip: CC_DEV && 'i18n:COMPONENT.button.pressed_sprite',
      formerlySerializedAs: 'pressedSprite',
      notify: function notify() {
        this._updateState();
      }
    },

    /**
     * !#en Hover state sprite
     * !#zh 悬停状态下按钮所显示的 Sprite 。
     * @property {SpriteFrame} hoverSprite
     */
    hoverSprite: {
      "default": null,
      type: cc.SpriteFrame,
      displayName: 'Hover',
      tooltip: CC_DEV && 'i18n:COMPONENT.button.hover_sprite',
      formerlySerializedAs: 'hoverSprite',
      notify: function notify() {
        this._updateState();
      }
    },

    /**
     * !#en Disabled state sprite
     * !#zh 禁用状态下按钮所显示的 Sprite 。
     * @property {SpriteFrame} disabledSprite
     */
    disabledSprite: {
      "default": null,
      type: cc.SpriteFrame,
      displayName: 'Disabled',
      tooltip: CC_DEV && 'i18n:COMPONENT.button.disabled_sprite',
      notify: function notify() {
        this._updateState();
      }
    },

    /**
     * !#en
     * Transition target.
     * When Button state changed:
     *  If Transition type is Button.Transition.NONE, Button will do nothing
     *  If Transition type is Button.Transition.COLOR, Button will change target's color
     *  If Transition type is Button.Transition.SPRITE, Button will change target Sprite's sprite
     * !#zh
     * 需要过渡的目标。
     * 当前按钮状态改变规则：
     * -如果 Transition type 选择 Button.Transition.NONE，按钮不做任何过渡。
     * -如果 Transition type 选择 Button.Transition.COLOR，按钮会对目标颜色进行颜色之间的过渡。
     * -如果 Transition type 选择 Button.Transition.Sprite，按钮会对目标 Sprite 进行 Sprite 之间的过渡。
     * @property {Node} target
     */
    target: {
      "default": null,
      type: cc.Node,
      tooltip: CC_DEV && "i18n:COMPONENT.button.target",
      notify: function notify(oldValue) {
        this._applyTarget();

        if (oldValue && this.target !== oldValue) {
          this._unregisterTargetEvent(oldValue);
        }
      }
    },

    /**
     * !#en If Button is clicked, it will trigger event's handler
     * !#zh 按钮的点击事件列表。
     * @property {Component.EventHandler[]} clickEvents
     */
    clickEvents: {
      "default": [],
      type: cc.Component.EventHandler,
      tooltip: CC_DEV && 'i18n:COMPONENT.button.click_events'
    }
  },
  statics: {
    Transition: Transition
  },
  __preload: function __preload() {
    this._applyTarget();

    this._resetState();
  },
  _resetState: function _resetState() {
    this._pressed = false;
    this._hovered = false; // // Restore button status

    var target = this._getTarget();

    var transition = this.transition;
    var originalScale = this._originalScale;

    if (transition === Transition.COLOR && this.interactable) {
      this._setTargetColor(this.normalColor);
    } else if (transition === Transition.SCALE && originalScale) {
      target.setScale(originalScale.x, originalScale.y);
    }

    this._transitionFinished = true;
  },
  onEnable: function onEnable() {
    // check sprite frames
    if (this.normalSprite) {
      this.normalSprite.ensureLoadTexture();
    }

    if (this.hoverSprite) {
      this.hoverSprite.ensureLoadTexture();
    }

    if (this.pressedSprite) {
      this.pressedSprite.ensureLoadTexture();
    }

    if (this.disabledSprite) {
      this.disabledSprite.ensureLoadTexture();
    }

    if (!CC_EDITOR) {
      this._registerNodeEvent();
    }

    this._updateState();
  },
  onDisable: function onDisable() {
    this._resetState();

    if (!CC_EDITOR) {
      this._unregisterNodeEvent();
    }
  },
  _getTarget: function _getTarget() {
    return this.target ? this.target : this.node;
  },
  _onTargetSpriteFrameChanged: function _onTargetSpriteFrameChanged(comp) {
    if (this.transition === Transition.SPRITE) {
      this._setCurrentStateSprite(comp.spriteFrame);
    }
  },
  _onTargetColorChanged: function _onTargetColorChanged(color) {
    if (this.transition === Transition.COLOR) {
      this._setCurrentStateColor(color);
    }
  },
  _onTargetScaleChanged: function _onTargetScaleChanged() {
    var target = this._getTarget(); // update _originalScale if target scale changed


    if (this._originalScale) {
      if (this.transition !== Transition.SCALE || this._transitionFinished) {
        this._originalScale.x = target.scaleX;
        this._originalScale.y = target.scaleY;
      }
    }
  },
  _setTargetColor: function _setTargetColor(color) {
    var target = this._getTarget();

    var cloneColor = color.clone();
    target.opacity = cloneColor.a;
    cloneColor.a = 255; // don't set node opacity via node.color.a

    target.color = cloneColor;
  },
  _getStateColor: function _getStateColor(state) {
    switch (state) {
      case State.NORMAL:
        return this.normalColor;

      case State.HOVER:
        return this.hoverColor;

      case State.PRESSED:
        return this.pressedColor;

      case State.DISABLED:
        return this.disabledColor;
    }
  },
  _getStateSprite: function _getStateSprite(state) {
    switch (state) {
      case State.NORMAL:
        return this.normalSprite;

      case State.HOVER:
        return this.hoverSprite;

      case State.PRESSED:
        return this.pressedSprite;

      case State.DISABLED:
        return this.disabledSprite;
    }
  },
  _setCurrentStateColor: function _setCurrentStateColor(color) {
    switch (this._getButtonState()) {
      case State.NORMAL:
        this.normalColor = color;
        break;

      case State.HOVER:
        this.hoverColor = color;
        break;

      case State.PRESSED:
        this.pressedColor = color;
        break;

      case State.DISABLED:
        this.disabledColor = color;
        break;
    }
  },
  _setCurrentStateSprite: function _setCurrentStateSprite(spriteFrame) {
    switch (this._getButtonState()) {
      case State.NORMAL:
        this.normalSprite = spriteFrame;
        break;

      case State.HOVER:
        this.hoverSprite = spriteFrame;
        break;

      case State.PRESSED:
        this.pressedSprite = spriteFrame;
        break;

      case State.DISABLED:
        this.disabledSprite = spriteFrame;
        break;
    }
  },
  update: function update(dt) {
    var target = this._getTarget();

    if (this._transitionFinished) return;
    if (this.transition !== Transition.COLOR && this.transition !== Transition.SCALE) return;
    this.time += dt;
    var ratio = 1.0;

    if (this.duration > 0) {
      ratio = this.time / this.duration;
    } // clamp ratio


    if (ratio >= 1) {
      ratio = 1;
    }

    if (this.transition === Transition.COLOR) {
      var color = this._fromColor.lerp(this._toColor, ratio);

      this._setTargetColor(color);
    } // Skip if _originalScale is invalid
    else if (this.transition === Transition.SCALE && this._originalScale) {
        target.scale = this._fromScale.lerp(this._toScale, ratio);
      }

    if (ratio === 1) {
      this._transitionFinished = true;
    }
  },
  _registerNodeEvent: function _registerNodeEvent() {
    this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    this.node.on(cc.Node.EventType.MOUSE_ENTER, this._onMouseMoveIn, this);
    this.node.on(cc.Node.EventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
  },
  _unregisterNodeEvent: function _unregisterNodeEvent() {
    this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    this.node.off(cc.Node.EventType.MOUSE_ENTER, this._onMouseMoveIn, this);
    this.node.off(cc.Node.EventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
  },
  _registerTargetEvent: function _registerTargetEvent(target) {
    if (CC_EDITOR) {
      target.on('spriteframe-changed', this._onTargetSpriteFrameChanged, this);
      target.on(cc.Node.EventType.COLOR_CHANGED, this._onTargetColorChanged, this);
    }

    target.on(cc.Node.EventType.SCALE_CHANGED, this._onTargetScaleChanged, this);
  },
  _unregisterTargetEvent: function _unregisterTargetEvent(target) {
    if (CC_EDITOR) {
      target.off('spriteframe-changed', this._onTargetSpriteFrameChanged, this);
      target.off(cc.Node.EventType.COLOR_CHANGED, this._onTargetColorChanged, this);
    }

    target.off(cc.Node.EventType.SCALE_CHANGED, this._onTargetScaleChanged, this);
  },
  _getTargetSprite: function _getTargetSprite(target) {
    var sprite = null;

    if (target) {
      sprite = target.getComponent(cc.Sprite);
    }

    return sprite;
  },
  _applyTarget: function _applyTarget() {
    var target = this._getTarget();

    this._sprite = this._getTargetSprite(target);

    if (!this._originalScale) {
      this._originalScale = cc.Vec2.ZERO;
    }

    this._originalScale.x = target.scaleX;
    this._originalScale.y = target.scaleY;

    this._registerTargetEvent(target);
  },
  // touch event handler
  _onTouchBegan: function _onTouchBegan(event) {
    if (!this.interactable || !this.enabledInHierarchy) return;
    this._pressed = true;

    this._updateState();

    event.stopPropagation();
  },
  _onTouchMove: function _onTouchMove(event) {
    if (!this.interactable || !this.enabledInHierarchy || !this._pressed) return; // mobile phone will not emit _onMouseMoveOut,
    // so we have to do hit test when touch moving

    var touch = event.touch;

    var hit = this.node._hitTest(touch.getLocation());

    var target = this._getTarget();

    var originalScale = this._originalScale;

    if (this.transition === Transition.SCALE && originalScale) {
      if (hit) {
        this._fromScale.x = originalScale.x;
        this._fromScale.y = originalScale.y;
        this._toScale.x = originalScale.x * this.zoomScale;
        this._toScale.y = originalScale.y * this.zoomScale;
        this._transitionFinished = false;
      } else {
        this.time = 0;
        this._transitionFinished = true;
        target.setScale(originalScale.x, originalScale.y);
      }
    } else {
      var state;

      if (hit) {
        state = State.PRESSED;
      } else {
        state = State.NORMAL;
      }

      this._applyTransition(state);
    }

    event.stopPropagation();
  },
  _onTouchEnded: function _onTouchEnded(event) {
    if (!this.interactable || !this.enabledInHierarchy) return;

    if (this._pressed) {
      cc.Component.EventHandler.emitEvents(this.clickEvents, event);
      this.node.emit('click', this);
    }

    this._pressed = false;

    this._updateState();

    event.stopPropagation();
  },
  _onTouchCancel: function _onTouchCancel() {
    if (!this.interactable || !this.enabledInHierarchy) return;
    this._pressed = false;

    this._updateState();
  },
  _onMouseMoveIn: function _onMouseMoveIn() {
    if (this._pressed || !this.interactable || !this.enabledInHierarchy) return;
    if (this.transition === Transition.SPRITE && !this.hoverSprite) return;

    if (!this._hovered) {
      this._hovered = true;

      this._updateState();
    }
  },
  _onMouseMoveOut: function _onMouseMoveOut() {
    if (this._hovered) {
      this._hovered = false;

      this._updateState();
    }
  },
  // state handler
  _updateState: function _updateState() {
    var state = this._getButtonState();

    this._applyTransition(state);

    this._updateDisabledState();
  },
  _getButtonState: function _getButtonState() {
    var state;

    if (!this.interactable) {
      state = State.DISABLED;
    } else if (this._pressed) {
      state = State.PRESSED;
    } else if (this._hovered) {
      state = State.HOVER;
    } else {
      state = State.NORMAL;
    }

    return state;
  },
  _updateColorTransitionImmediately: function _updateColorTransitionImmediately(state) {
    var color = this._getStateColor(state);

    this._setTargetColor(color);

    this._fromColor = color.clone();
    this._toColor = color;
  },
  _updateColorTransition: function _updateColorTransition(state) {
    if (CC_EDITOR || state === State.DISABLED) {
      this._updateColorTransitionImmediately(state);
    } else {
      var target = this._getTarget();

      var color = this._getStateColor(state);

      this._fromColor = target.color.clone();
      this._toColor = color;
      this.time = 0;
      this._transitionFinished = false;
    }
  },
  _updateSpriteTransition: function _updateSpriteTransition(state) {
    var sprite = this._getStateSprite(state);

    if (this._sprite && sprite) {
      this._sprite.spriteFrame = sprite;
    }
  },
  _updateScaleTransition: function _updateScaleTransition(state) {
    if (state === State.PRESSED) {
      this._zoomUp();
    } else {
      this._zoomBack();
    }
  },
  _zoomUp: function _zoomUp() {
    // skip before __preload()
    if (!this._originalScale) {
      return;
    }

    this._fromScale.x = this._originalScale.x;
    this._fromScale.y = this._originalScale.y;
    this._toScale.x = this._originalScale.x * this.zoomScale;
    this._toScale.y = this._originalScale.y * this.zoomScale;
    this.time = 0;
    this._transitionFinished = false;
  },
  _zoomBack: function _zoomBack() {
    // skip before __preload()
    if (!this._originalScale) {
      return;
    }

    var target = this._getTarget();

    this._fromScale.x = target.scaleX;
    this._fromScale.y = target.scaleY;
    this._toScale.x = this._originalScale.x;
    this._toScale.y = this._originalScale.y;
    this.time = 0;
    this._transitionFinished = false;
  },
  _updateTransition: function _updateTransition(oldTransition) {
    // Reset to normal data when change transition.
    if (oldTransition === Transition.COLOR) {
      this._updateColorTransitionImmediately(State.NORMAL);
    } else if (oldTransition === Transition.SPRITE) {
      this._updateSpriteTransition(State.NORMAL);
    }

    this._updateState();
  },
  _applyTransition: function _applyTransition(state) {
    var transition = this.transition;

    if (transition === Transition.COLOR) {
      this._updateColorTransition(state);
    } else if (transition === Transition.SPRITE) {
      this._updateSpriteTransition(state);
    } else if (transition === Transition.SCALE) {
      this._updateScaleTransition(state);
    }
  },
  _resizeNodeToTargetNode: CC_EDITOR && function () {
    this.node.setContentSize(this._getTarget().getContentSize());
  },
  _updateDisabledState: function _updateDisabledState(force) {
    if (!this._sprite) return;

    if (this.enableAutoGrayEffect || force) {
      var useGrayMaterial = false;

      if (!(this.transition === Transition.SPRITE && this.disabledSprite)) {
        useGrayMaterial = this.enableAutoGrayEffect && !this.interactable;
      }

      this._switchGrayMaterial(useGrayMaterial, this._sprite);
    }
  }
});
cc.Button = module.exports = Button;
/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event click
 * @param {Event.EventCustom} event
 * @param {Button} button - The Button component.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvQ0NCdXR0b24uanMiXSwibmFtZXMiOlsiQ29tcG9uZW50IiwicmVxdWlyZSIsIkdyYXlTcHJpdGVTdGF0ZSIsIlRyYW5zaXRpb24iLCJjYyIsIkVudW0iLCJOT05FIiwiQ09MT1IiLCJTUFJJVEUiLCJTQ0FMRSIsIlN0YXRlIiwiTk9STUFMIiwiSE9WRVIiLCJQUkVTU0VEIiwiRElTQUJMRUQiLCJCdXR0b24iLCJDbGFzcyIsIm5hbWUiLCJtaXhpbnMiLCJjdG9yIiwiX3ByZXNzZWQiLCJfaG92ZXJlZCIsIl9mcm9tQ29sb3IiLCJfdG9Db2xvciIsIl90aW1lIiwiX3RyYW5zaXRpb25GaW5pc2hlZCIsIl9mcm9tU2NhbGUiLCJWZWMyIiwiWkVSTyIsIl90b1NjYWxlIiwiX29yaWdpbmFsU2NhbGUiLCJfZ3JheVNwcml0ZU1hdGVyaWFsIiwiX3Nwcml0ZU1hdGVyaWFsIiwiX3Nwcml0ZSIsImVkaXRvciIsIkNDX0VESVRPUiIsIm1lbnUiLCJoZWxwIiwiaW5zcGVjdG9yIiwiZXhlY3V0ZUluRWRpdE1vZGUiLCJwcm9wZXJ0aWVzIiwiaW50ZXJhY3RhYmxlIiwidG9vbHRpcCIsIkNDX0RFViIsIm5vdGlmeSIsIl91cGRhdGVTdGF0ZSIsIl9yZXNldFN0YXRlIiwiYW5pbWF0YWJsZSIsIl9yZXNpemVUb1RhcmdldCIsInNldCIsInZhbHVlIiwiX3Jlc2l6ZU5vZGVUb1RhcmdldE5vZGUiLCJlbmFibGVBdXRvR3JheUVmZmVjdCIsIl91cGRhdGVEaXNhYmxlZFN0YXRlIiwidHJhbnNpdGlvbiIsInR5cGUiLCJvbGRWYWx1ZSIsIl91cGRhdGVUcmFuc2l0aW9uIiwiZm9ybWVybHlTZXJpYWxpemVkQXMiLCJub3JtYWxDb2xvciIsIkNvbG9yIiwiV0hJVEUiLCJkaXNwbGF5TmFtZSIsIl9nZXRCdXR0b25TdGF0ZSIsIl9nZXRUYXJnZXQiLCJvcGFjaXR5IiwiYSIsInByZXNzZWRDb2xvciIsImNvbG9yIiwiaG92ZXJDb2xvciIsImRpc2FibGVkQ29sb3IiLCJkdXJhdGlvbiIsInJhbmdlIiwiem9vbVNjYWxlIiwibm9ybWFsU3ByaXRlIiwiU3ByaXRlRnJhbWUiLCJwcmVzc2VkU3ByaXRlIiwiaG92ZXJTcHJpdGUiLCJkaXNhYmxlZFNwcml0ZSIsInRhcmdldCIsIk5vZGUiLCJfYXBwbHlUYXJnZXQiLCJfdW5yZWdpc3RlclRhcmdldEV2ZW50IiwiY2xpY2tFdmVudHMiLCJFdmVudEhhbmRsZXIiLCJzdGF0aWNzIiwiX19wcmVsb2FkIiwib3JpZ2luYWxTY2FsZSIsIl9zZXRUYXJnZXRDb2xvciIsInNldFNjYWxlIiwieCIsInkiLCJvbkVuYWJsZSIsImVuc3VyZUxvYWRUZXh0dXJlIiwiX3JlZ2lzdGVyTm9kZUV2ZW50Iiwib25EaXNhYmxlIiwiX3VucmVnaXN0ZXJOb2RlRXZlbnQiLCJub2RlIiwiX29uVGFyZ2V0U3ByaXRlRnJhbWVDaGFuZ2VkIiwiY29tcCIsIl9zZXRDdXJyZW50U3RhdGVTcHJpdGUiLCJzcHJpdGVGcmFtZSIsIl9vblRhcmdldENvbG9yQ2hhbmdlZCIsIl9zZXRDdXJyZW50U3RhdGVDb2xvciIsIl9vblRhcmdldFNjYWxlQ2hhbmdlZCIsInNjYWxlWCIsInNjYWxlWSIsImNsb25lQ29sb3IiLCJjbG9uZSIsIl9nZXRTdGF0ZUNvbG9yIiwic3RhdGUiLCJfZ2V0U3RhdGVTcHJpdGUiLCJ1cGRhdGUiLCJkdCIsInRpbWUiLCJyYXRpbyIsImxlcnAiLCJzY2FsZSIsIm9uIiwiRXZlbnRUeXBlIiwiVE9VQ0hfU1RBUlQiLCJfb25Ub3VjaEJlZ2FuIiwiVE9VQ0hfTU9WRSIsIl9vblRvdWNoTW92ZSIsIlRPVUNIX0VORCIsIl9vblRvdWNoRW5kZWQiLCJUT1VDSF9DQU5DRUwiLCJfb25Ub3VjaENhbmNlbCIsIk1PVVNFX0VOVEVSIiwiX29uTW91c2VNb3ZlSW4iLCJNT1VTRV9MRUFWRSIsIl9vbk1vdXNlTW92ZU91dCIsIm9mZiIsIl9yZWdpc3RlclRhcmdldEV2ZW50IiwiQ09MT1JfQ0hBTkdFRCIsIlNDQUxFX0NIQU5HRUQiLCJfZ2V0VGFyZ2V0U3ByaXRlIiwic3ByaXRlIiwiZ2V0Q29tcG9uZW50IiwiU3ByaXRlIiwiZXZlbnQiLCJlbmFibGVkSW5IaWVyYXJjaHkiLCJzdG9wUHJvcGFnYXRpb24iLCJ0b3VjaCIsImhpdCIsIl9oaXRUZXN0IiwiZ2V0TG9jYXRpb24iLCJfYXBwbHlUcmFuc2l0aW9uIiwiZW1pdEV2ZW50cyIsImVtaXQiLCJfdXBkYXRlQ29sb3JUcmFuc2l0aW9uSW1tZWRpYXRlbHkiLCJfdXBkYXRlQ29sb3JUcmFuc2l0aW9uIiwiX3VwZGF0ZVNwcml0ZVRyYW5zaXRpb24iLCJfdXBkYXRlU2NhbGVUcmFuc2l0aW9uIiwiX3pvb21VcCIsIl96b29tQmFjayIsIm9sZFRyYW5zaXRpb24iLCJzZXRDb250ZW50U2l6ZSIsImdldENvbnRlbnRTaXplIiwiZm9yY2UiLCJ1c2VHcmF5TWF0ZXJpYWwiLCJfc3dpdGNoR3JheU1hdGVyaWFsIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsU0FBUyxHQUFHQyxPQUFPLENBQUMsZUFBRCxDQUF6Qjs7QUFDQSxJQUFNQyxlQUFlLEdBQUdELE9BQU8sQ0FBQyw0QkFBRCxDQUEvQjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQUlFLFVBQVUsR0FBR0MsRUFBRSxDQUFDQyxJQUFILENBQVE7QUFDckI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNJQyxFQUFBQSxJQUFJLEVBQUUsQ0FOZTs7QUFRckI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNJQyxFQUFBQSxLQUFLLEVBQUUsQ0FiYzs7QUFlckI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNJ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QUFsQixFQUF6QjtBQUNILEdBNXNCaUI7QUE4c0JsQnpHLEVBQUFBLG9CQTlzQmtCLGdDQThzQkkwRyxLQTlzQkosRUE4c0JXO0FBQ3pCLFFBQUksQ0FBQyxLQUFLOUgsT0FBVixFQUFtQjs7QUFFbkIsUUFBSSxLQUFLbUIsb0JBQUwsSUFBNkIyRyxLQUFqQyxFQUF3QztBQUNwQyxVQUFJQyxlQUFlLEdBQUcsS0FBdEI7O0FBRUEsVUFBSSxFQUFFLEtBQUsxRyxVQUFMLEtBQW9CbkQsVUFBVSxDQUFDSyxNQUEvQixJQUF5QyxLQUFLc0UsY0FBaEQsQ0FBSixFQUFxRTtBQUNqRWtGLFFBQUFBLGVBQWUsR0FBRyxLQUFLNUcsb0JBQUwsSUFBNkIsQ0FBQyxLQUFLWCxZQUFyRDtBQUNIOztBQUNELFdBQUt3SCxtQkFBTCxDQUF5QkQsZUFBekIsRUFBMEMsS0FBSy9ILE9BQS9DO0FBQ0g7QUFDSjtBQXp0QmlCLENBQVQsQ0FBYjtBQTR0QkE3QixFQUFFLENBQUNXLE1BQUgsR0FBWW1KLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnBKLE1BQTdCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCcuL0NDQ29tcG9uZW50Jyk7XG5jb25zdCBHcmF5U3ByaXRlU3RhdGUgPSByZXF1aXJlKCcuLi91dGlscy9ncmF5LXNwcml0ZS1zdGF0ZScpO1xuXG4vKipcbiAqICEjZW4gRW51bSBmb3IgdHJhbnNpdGlvbiB0eXBlLlxuICogISN6aCDov4fmuKHnsbvlnotcbiAqIEBlbnVtIEJ1dHRvbi5UcmFuc2l0aW9uXG4gKi9cbmxldCBUcmFuc2l0aW9uID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbm9uZSB0eXBlLlxuICAgICAqICEjemgg5LiN5YGa5Lu75L2V6L+H5rihXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IE5PTkVcbiAgICAgKi9cbiAgICBOT05FOiAwLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgY29sb3IgdHlwZS5cbiAgICAgKiAhI3poIOminOiJsui/h+a4oVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBDT0xPUlxuICAgICAqL1xuICAgIENPTE9SOiAxLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgc3ByaXRlIHR5cGUuXG4gICAgICogISN6aCDnsr7ngbXov4fmuKFcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU1BSSVRFXG4gICAgICovXG4gICAgU1BSSVRFOiAyLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHNjYWxlIHR5cGVcbiAgICAgKiAhI3poIOe8qeaUvui/h+a4oVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTQ0FMRVxuICAgICAqL1xuICAgIFNDQUxFOiAzXG59KTtcblxuY29uc3QgU3RhdGUgPSBjYy5FbnVtKHtcbiAgICBOT1JNQUw6IDAsXG4gICAgSE9WRVI6IDEsXG4gICAgUFJFU1NFRDogMixcbiAgICBESVNBQkxFRDogMyxcbn0pO1xuXG4vKipcbiAqICEjZW5cbiAqIEJ1dHRvbiBjb21wb25lbnQuIENhbiBiZSBwcmVzc2VkIG9yIGNsaWNrZWQuIEJ1dHRvbiBoYXMgNCBUcmFuc2l0aW9uIHR5cGVzOlxuICogXG4gKiAgIC0gQnV0dG9uLlRyYW5zaXRpb24uTk9ORSAgIC8vIEJ1dHRvbiB3aWxsIGRvIG5vdGhpbmdcbiAqICAgLSBCdXR0b24uVHJhbnNpdGlvbi5DT0xPUiAgLy8gQnV0dG9uIHdpbGwgY2hhbmdlIHRhcmdldCdzIGNvbG9yXG4gKiAgIC0gQnV0dG9uLlRyYW5zaXRpb24uU1BSSVRFIC8vIEJ1dHRvbiB3aWxsIGNoYW5nZSB0YXJnZXQgU3ByaXRlJ3Mgc3ByaXRlXG4gKiAgIC0gQnV0dG9uLlRyYW5zaXRpb24uU0NBTEUgLy8gQnV0dG9uIHdpbGwgY2hhbmdlIHRhcmdldCBub2RlJ3Mgc2NhbGVcbiAqXG4gKiBUaGUgYnV0dG9uIGNhbiBiaW5kIGV2ZW50cyAoYnV0IHlvdSBtdXN0IGJlIG9uIHRoZSBidXR0b24ncyBub2RlIHRvIGJpbmQgZXZlbnRzKS48YnIvPlxuICogVGhlIGZvbGxvd2luZyBldmVudHMgY2FuIGJlIHRyaWdnZXJlZCBvbiBhbGwgcGxhdGZvcm1zLlxuICogXG4gKiAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCAgLy8gUHJlc3NcbiAqICAtIGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUgICAvLyBBZnRlciBwcmVzc2luZyBhbmQgbW92aW5nXG4gKiAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQgICAgLy8gQWZ0ZXIgcHJlc3NpbmcgYW5kIHJlbGVhc2luZ1xuICogIC0gY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMIC8vIFByZXNzIHRvIGNhbmNlbFxuICogXG4gKiBUaGUgZm9sbG93aW5nIGV2ZW50cyBhcmUgb25seSB0cmlnZ2VyZWQgb24gdGhlIFBDIHBsYXRmb3JtOlxuICpcbiAqICAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9ET1dOXG4gKiAgIC0gY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTU9WRVxuICogICAtIGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX0VOVEVSXG4gKiAgIC0gY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTEVBVkVcbiAqICAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9VUFxuICogICAtIGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX1dIRUVMXG4gKlxuICogVXNlciBjYW4gZ2V0IHRoZSBjdXJyZW50IGNsaWNrZWQgbm9kZSB3aXRoICdldmVudC50YXJnZXQnIGZyb20gZXZlbnQgb2JqZWN0IHdoaWNoIGlzIHBhc3NlZCBhcyBwYXJhbWV0ZXIgaW4gdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIG9mIGNsaWNrIGV2ZW50LlxuICpcbiAqICEjemhcbiAqIOaMiemSrue7hOS7tuOAguWPr+S7peiiq+aMieS4i++8jOaIluiAheeCueWHu+OAglxuICpcbiAqIOaMiemSruWPr+S7pemAmui/h+S/ruaUuSBUcmFuc2l0aW9uIOadpeiuvue9ruaMiemSrueKtuaAgei/h+a4oeeahOaWueW8j++8mlxuICogXG4gKiAgIC0gQnV0dG9uLlRyYW5zaXRpb24uTk9ORSAgIC8vIOS4jeWBmuS7u+S9lei/h+a4oVxuICogICAtIEJ1dHRvbi5UcmFuc2l0aW9uLkNPTE9SICAvLyDov5vooYzpopzoibLkuYvpl7Tov4fmuKFcbiAqICAgLSBCdXR0b24uVHJhbnNpdGlvbi5TUFJJVEUgLy8g6L+b6KGM57K+54G15LmL6Ze06L+H5rihXG4gKiAgIC0gQnV0dG9uLlRyYW5zaXRpb24uU0NBTEUgLy8g6L+b6KGM57yp5pS+6L+H5rihXG4gKlxuICog5oyJ6ZKu5Y+v5Lul57uR5a6a5LqL5Lu277yI5L2G5piv5b+F6aG76KaB5Zyo5oyJ6ZKu55qEIE5vZGUg5LiK5omN6IO957uR5a6a5LqL5Lu277yJ77yaPGJyLz5cbiAqIOS7peS4i+S6i+S7tuWPr+S7peWcqOWFqOW5s+WPsOS4iumDveinpuWPke+8mlxuICogXG4gKiAgIC0gY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQgIC8vIOaMieS4i+aXtuS6i+S7tlxuICogICAtIGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUgICAvLyDmjInkvY/np7vliqjlkI7kuovku7ZcbiAqICAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQgICAgLy8g5oyJ5LiL5ZCO5p2+5byA5ZCO5LqL5Lu2XG4gKiAgIC0gY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMIC8vIOaMieS4i+WPlua2iOS6i+S7tlxuICogXG4gKiDku6XkuIvkuovku7blj6rlnKggUEMg5bmz5Y+w5LiK6Kem5Y+R77yaXG4gKiBcbiAqICAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9ET1dOICAvLyDpvKDmoIfmjInkuIvml7bkuovku7ZcbiAqICAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9NT1ZFICAvLyDpvKDmoIfmjInkvY/np7vliqjlkI7kuovku7ZcbiAqICAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9FTlRFUiAvLyDpvKDmoIfov5vlhaXnm67moIfkuovku7ZcbiAqICAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9MRUFWRSAvLyDpvKDmoIfnprvlvIDnm67moIfkuovku7ZcbiAqICAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9VUCAgICAvLyDpvKDmoIfmnb7lvIDkuovku7ZcbiAqICAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9XSEVFTCAvLyDpvKDmoIfmu5rova7kuovku7ZcbiAqIFxuICog55So5oi35Y+v5Lul6YCa6L+H6I635Y+WIF9f54K55Ye75LqL5Lu2X18g5Zue6LCD5Ye95pWw55qE5Y+C5pWwIGV2ZW50IOeahCB0YXJnZXQg5bGe5oCn6I635Y+W5b2T5YmN54K55Ye75a+56LGh44CCXG4gKiBAY2xhc3MgQnV0dG9uXG4gKiBAZXh0ZW5kcyBDb21wb25lbnRcbiAqIEB1c2VzIEdyYXlTcHJpdGVTdGF0ZVxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBZGQgYW4gZXZlbnQgdG8gdGhlIGJ1dHRvbi5cbiAqIGJ1dHRvbi5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAqICAgICBjYy5sb2coXCJUaGlzIGlzIGEgY2FsbGJhY2sgYWZ0ZXIgdGhlIHRyaWdnZXIgZXZlbnRcIik7XG4gKiB9KTtcblxuICogLy8gWW91IGNvdWxkIGFsc28gYWRkIGEgY2xpY2sgZXZlbnRcbiAqIC8vTm90ZTogSW4gdGhpcyB3YXksIHlvdSBjYW4ndCBnZXQgdGhlIHRvdWNoIGV2ZW50IGluZm8sIHNvIHVzZSBpdCB3aXNlbHkuXG4gKiBidXR0b24ubm9kZS5vbignY2xpY2snLCBmdW5jdGlvbiAoYnV0dG9uKSB7XG4gKiAgICAvL1RoZSBldmVudCBpcyBhIGN1c3RvbSBldmVudCwgeW91IGNvdWxkIGdldCB0aGUgQnV0dG9uIGNvbXBvbmVudCB2aWEgZmlyc3QgYXJndW1lbnRcbiAqIH0pXG4gKlxuICovXG5sZXQgQnV0dG9uID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5CdXR0b24nLFxuICAgIGV4dGVuZHM6IENvbXBvbmVudCxcbiAgICBtaXhpbnM6IFtHcmF5U3ByaXRlU3RhdGVdLFxuXG4gICAgY3RvciAoKSB7XG4gICAgICAgIHRoaXMuX3ByZXNzZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faG92ZXJlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9mcm9tQ29sb3IgPSBudWxsO1xuICAgICAgICB0aGlzLl90b0NvbG9yID0gbnVsbDtcbiAgICAgICAgdGhpcy5fdGltZSA9IDA7XG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb25GaW5pc2hlZCA9IHRydWU7XG4gICAgICAgIC8vIGluaXQgX29yaWdpbmFsU2NhbGUgaW4gX19wcmVsb2FkKClcbiAgICAgICAgdGhpcy5fZnJvbVNjYWxlID0gY2MuVmVjMi5aRVJPO1xuICAgICAgICB0aGlzLl90b1NjYWxlID0gY2MuVmVjMi5aRVJPO1xuICAgICAgICB0aGlzLl9vcmlnaW5hbFNjYWxlID0gbnVsbDtcblxuICAgICAgICB0aGlzLl9ncmF5U3ByaXRlTWF0ZXJpYWwgPSBudWxsO1xuICAgICAgICB0aGlzLl9zcHJpdGVNYXRlcmlhbCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5fc3ByaXRlID0gbnVsbDtcbiAgICB9LFxuXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnVpL0J1dHRvbicsXG4gICAgICAgIGhlbHA6ICdpMThuOkNPTVBPTkVOVC5oZWxwX3VybC5idXR0b24nLFxuICAgICAgICBpbnNwZWN0b3I6ICdwYWNrYWdlczovL2luc3BlY3Rvci9pbnNwZWN0b3JzL2NvbXBzL2J1dHRvbi5qcycsXG4gICAgICAgIGV4ZWN1dGVJbkVkaXRNb2RlOiB0cnVlXG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogV2hldGhlciB0aGUgQnV0dG9uIGlzIGRpc2FibGVkLlxuICAgICAgICAgKiBJZiB0cnVlLCB0aGUgQnV0dG9uIHdpbGwgdHJpZ2dlciBldmVudCBhbmQgZG8gdHJhbnNpdGlvbi5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDmjInpkq7kuovku7bmmK/lkKbooqvlk43lupTvvIzlpoLmnpzkuLogZmFsc2XvvIzliJnmjInpkq7lsIbooqvnpoHnlKjjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBpbnRlcmFjdGFibGVcbiAgICAgICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAgICAgKi9cbiAgICAgICAgaW50ZXJhY3RhYmxlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5idXR0b24uaW50ZXJhY3RhYmxlJyxcbiAgICAgICAgICAgIG5vdGlmeSAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlU3RhdGUoKTtcblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pbnRlcmFjdGFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzZXRTdGF0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIF9yZXNpemVUb1RhcmdldDoge1xuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZU5vZGVUb1RhcmdldE5vZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gV2hlbiB0aGlzIGZsYWcgaXMgdHJ1ZSwgQnV0dG9uIHRhcmdldCBzcHJpdGUgd2lsbCB0dXJuIGdyYXkgd2hlbiBpbnRlcmFjdGFibGUgaXMgZmFsc2UuXG4gICAgICAgICAqICEjemgg5aaC5p6c6L+Z5Liq5qCH6K6w5Li6IHRydWXvvIzlvZMgYnV0dG9uIOeahCBpbnRlcmFjdGFibGUg5bGe5oCn5Li6IGZhbHNlIOeahOaXtuWAme+8jOS8muS9v+eUqOWGhee9riBzaGFkZXIg6K6pIGJ1dHRvbiDnmoQgdGFyZ2V0IOiKgueCueeahCBzcHJpdGUg57uE5Lu25Y+Y54GwXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZW5hYmxlQXV0b0dyYXlFZmZlY3RcbiAgICAgICAgICovXG4gICAgICAgIGVuYWJsZUF1dG9HcmF5RWZmZWN0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuYnV0dG9uLmF1dG9fZ3JheV9lZmZlY3QnLFxuICAgICAgICAgICAgbm90aWZ5ICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVEaXNhYmxlZFN0YXRlKHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRyYW5zaXRpb24gdHlwZVxuICAgICAgICAgKiAhI3poIOaMiemSrueKtuaAgeaUueWPmOaXtui/h+a4oeaWueW8j+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0J1dHRvbi5UcmFuc2l0aW9ufSB0cmFuc2l0aW9uXG4gICAgICAgICAqIEBkZWZhdWx0IEJ1dHRvbi5UcmFuc2l0aW9uLk5vZGVcbiAgICAgICAgICovXG4gICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFRyYW5zaXRpb24uTk9ORSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuYnV0dG9uLnRyYW5zaXRpb24nLFxuICAgICAgICAgICAgdHlwZTogVHJhbnNpdGlvbixcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgbm90aWZ5IChvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVRyYW5zaXRpb24ob2xkVmFsdWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvcm1lcmx5U2VyaWFsaXplZEFzOiAndHJhbnNpdGlvbidcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBjb2xvciB0cmFuc2l0aW9uXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gTm9ybWFsIHN0YXRlIGNvbG9yLlxuICAgICAgICAgKiAhI3poIOaZrumAmueKtuaAgeS4i+aMiemSruaJgOaYvuekuueahOminOiJsuOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0NvbG9yfSBub3JtYWxDb2xvclxuICAgICAgICAgKi9cbiAgICAgICAgbm9ybWFsQ29sb3I6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGNjLkNvbG9yLldISVRFLFxuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdOb3JtYWwnLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5idXR0b24ubm9ybWFsX2NvbG9yJyxcbiAgICAgICAgICAgIG5vdGlmeSAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5Db2xvciAmJiB0aGlzLl9nZXRCdXR0b25TdGF0ZSgpID09PSBTdGF0ZS5OT1JNQUwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2V0VGFyZ2V0KCkub3BhY2l0eSA9IHRoaXMubm9ybWFsQ29sb3IuYTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlU3RhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBQcmVzc2VkIHN0YXRlIGNvbG9yXG4gICAgICAgICAqICEjemgg5oyJ5LiL54q25oCB5pe25oyJ6ZKu5omA5pi+56S655qE6aKc6Imy44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Q29sb3J9IHByZXNzZWRDb2xvclxuICAgICAgICAgKi9cbiAgICAgICAgcHJlc3NlZENvbG9yOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBjYy5jb2xvcigyMTEsIDIxMSwgMjExKSxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnUHJlc3NlZCcsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmJ1dHRvbi5wcmVzc2VkX2NvbG9yJyxcbiAgICAgICAgICAgIG5vdGlmeSAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5Db2xvciAmJiB0aGlzLl9nZXRCdXR0b25TdGF0ZSgpID09PSBTdGF0ZS5QUkVTU0VEKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dldFRhcmdldCgpLm9wYWNpdHkgPSB0aGlzLnByZXNzZWRDb2xvci5hO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVTdGF0ZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvcm1lcmx5U2VyaWFsaXplZEFzOiAncHJlc3NlZENvbG9yJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEhvdmVyIHN0YXRlIGNvbG9yXG4gICAgICAgICAqICEjemgg5oKs5YGc54q25oCB5LiL5oyJ6ZKu5omA5pi+56S655qE6aKc6Imy44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Q29sb3J9IGhvdmVyQ29sb3JcbiAgICAgICAgICovXG4gICAgICAgIGhvdmVyQ29sb3I6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGNjLkNvbG9yLldISVRFLFxuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdIb3ZlcicsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmJ1dHRvbi5ob3Zlcl9jb2xvcicsXG4gICAgICAgICAgICBub3RpZnkgKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRyYW5zaXRpb24gPT09IFRyYW5zaXRpb24uQ29sb3IgJiYgdGhpcy5fZ2V0QnV0dG9uU3RhdGUoKSA9PT0gU3RhdGUuSE9WRVIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2V0VGFyZ2V0KCkub3BhY2l0eSA9IHRoaXMuaG92ZXJDb2xvci5hO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVTdGF0ZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvcm1lcmx5U2VyaWFsaXplZEFzOiAnaG92ZXJDb2xvcidcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBEaXNhYmxlZCBzdGF0ZSBjb2xvclxuICAgICAgICAgKiAhI3poIOemgeeUqOeKtuaAgeS4i+aMiemSruaJgOaYvuekuueahOminOiJsuOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0NvbG9yfSBkaXNhYmxlZENvbG9yXG4gICAgICAgICAqL1xuICAgICAgICBkaXNhYmxlZENvbG9yOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBjYy5jb2xvcigxMjQsIDEyNCwgMTI0KSxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnRGlzYWJsZWQnLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5idXR0b24uZGlzYWJsZWRfY29sb3InLFxuICAgICAgICAgICAgbm90aWZ5ICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uID09PSBUcmFuc2l0aW9uLkNvbG9yICYmIHRoaXMuX2dldEJ1dHRvblN0YXRlKCkgPT09IFN0YXRlLkRJU0FCTEVEKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dldFRhcmdldCgpLm9wYWNpdHkgPSB0aGlzLmRpc2FibGVkQ29sb3IuYTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlU3RhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBDb2xvciBhbmQgU2NhbGUgdHJhbnNpdGlvbiBkdXJhdGlvblxuICAgICAgICAgKiAhI3poIOminOiJsui/h+a4oeWSjOe8qeaUvui/h+a4oeaXtuaJgOmcgOaXtumXtFxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZHVyYXRpb25cbiAgICAgICAgICovXG4gICAgICAgIGR1cmF0aW9uOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAwLjEsXG4gICAgICAgICAgICByYW5nZTogWzAsIDEwXSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuYnV0dG9uLmR1cmF0aW9uJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiAgV2hlbiB1c2VyIHByZXNzIHRoZSBidXR0b24sIHRoZSBidXR0b24gd2lsbCB6b29tIHRvIGEgc2NhbGUuXG4gICAgICAgICAqIFRoZSBmaW5hbCBzY2FsZSBvZiB0aGUgYnV0dG9uICBlcXVhbHMgKGJ1dHRvbiBvcmlnaW5hbCBzY2FsZSAqIHpvb21TY2FsZSlcbiAgICAgICAgICogISN6aCDlvZPnlKjmiLfngrnlh7vmjInpkq7lkI7vvIzmjInpkq7kvJrnvKnmlL7liLDkuIDkuKrlgLzvvIzov5nkuKrlgLznrYnkuo4gQnV0dG9uIOWOn+WniyBzY2FsZSAqIHpvb21TY2FsZVxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gem9vbVNjYWxlXG4gICAgICAgICAqL1xuICAgICAgICB6b29tU2NhbGU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDEuMixcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuYnV0dG9uLnpvb21fc2NhbGUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gc3ByaXRlIHRyYW5zaXRpb25cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gTm9ybWFsIHN0YXRlIHNwcml0ZVxuICAgICAgICAgKiAhI3poIOaZrumAmueKtuaAgeS4i+aMiemSruaJgOaYvuekuueahCBTcHJpdGUg44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3ByaXRlRnJhbWV9IG5vcm1hbFNwcml0ZVxuICAgICAgICAgKi9cbiAgICAgICAgbm9ybWFsU3ByaXRlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlRnJhbWUsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogJ05vcm1hbCcsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmJ1dHRvbi5ub3JtYWxfc3ByaXRlJyxcbiAgICAgICAgICAgIG5vdGlmeSAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlU3RhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBQcmVzc2VkIHN0YXRlIHNwcml0ZVxuICAgICAgICAgKiAhI3poIOaMieS4i+eKtuaAgeaXtuaMiemSruaJgOaYvuekuueahCBTcHJpdGUg44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3ByaXRlRnJhbWV9IHByZXNzZWRTcHJpdGVcbiAgICAgICAgICovXG4gICAgICAgIHByZXNzZWRTcHJpdGU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVGcmFtZSxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnUHJlc3NlZCcsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmJ1dHRvbi5wcmVzc2VkX3Nwcml0ZScsXG4gICAgICAgICAgICBmb3JtZXJseVNlcmlhbGl6ZWRBczogJ3ByZXNzZWRTcHJpdGUnLFxuICAgICAgICAgICAgbm90aWZ5ICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVTdGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEhvdmVyIHN0YXRlIHNwcml0ZVxuICAgICAgICAgKiAhI3poIOaCrOWBnOeKtuaAgeS4i+aMiemSruaJgOaYvuekuueahCBTcHJpdGUg44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3ByaXRlRnJhbWV9IGhvdmVyU3ByaXRlXG4gICAgICAgICAqL1xuICAgICAgICBob3ZlclNwcml0ZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUZyYW1lLFxuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdIb3ZlcicsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmJ1dHRvbi5ob3Zlcl9zcHJpdGUnLFxuICAgICAgICAgICAgZm9ybWVybHlTZXJpYWxpemVkQXM6ICdob3ZlclNwcml0ZScsXG4gICAgICAgICAgICBub3RpZnkgKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVN0YXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gRGlzYWJsZWQgc3RhdGUgc3ByaXRlXG4gICAgICAgICAqICEjemgg56aB55So54q25oCB5LiL5oyJ6ZKu5omA5pi+56S655qEIFNwcml0ZSDjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtTcHJpdGVGcmFtZX0gZGlzYWJsZWRTcHJpdGVcbiAgICAgICAgICovXG4gICAgICAgIGRpc2FibGVkU3ByaXRlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlRnJhbWUsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogJ0Rpc2FibGVkJyxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuYnV0dG9uLmRpc2FibGVkX3Nwcml0ZScsXG4gICAgICAgICAgICBub3RpZnkgKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVN0YXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVHJhbnNpdGlvbiB0YXJnZXQuXG4gICAgICAgICAqIFdoZW4gQnV0dG9uIHN0YXRlIGNoYW5nZWQ6XG4gICAgICAgICAqICBJZiBUcmFuc2l0aW9uIHR5cGUgaXMgQnV0dG9uLlRyYW5zaXRpb24uTk9ORSwgQnV0dG9uIHdpbGwgZG8gbm90aGluZ1xuICAgICAgICAgKiAgSWYgVHJhbnNpdGlvbiB0eXBlIGlzIEJ1dHRvbi5UcmFuc2l0aW9uLkNPTE9SLCBCdXR0b24gd2lsbCBjaGFuZ2UgdGFyZ2V0J3MgY29sb3JcbiAgICAgICAgICogIElmIFRyYW5zaXRpb24gdHlwZSBpcyBCdXR0b24uVHJhbnNpdGlvbi5TUFJJVEUsIEJ1dHRvbiB3aWxsIGNoYW5nZSB0YXJnZXQgU3ByaXRlJ3Mgc3ByaXRlXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog6ZyA6KaB6L+H5rih55qE55uu5qCH44CCXG4gICAgICAgICAqIOW9k+WJjeaMiemSrueKtuaAgeaUueWPmOinhOWIme+8mlxuICAgICAgICAgKiAt5aaC5p6cIFRyYW5zaXRpb24gdHlwZSDpgInmi6kgQnV0dG9uLlRyYW5zaXRpb24uTk9ORe+8jOaMiemSruS4jeWBmuS7u+S9lei/h+a4oeOAglxuICAgICAgICAgKiAt5aaC5p6cIFRyYW5zaXRpb24gdHlwZSDpgInmi6kgQnV0dG9uLlRyYW5zaXRpb24uQ09MT1LvvIzmjInpkq7kvJrlr7nnm67moIfpopzoibLov5vooYzpopzoibLkuYvpl7TnmoTov4fmuKHjgIJcbiAgICAgICAgICogLeWmguaenCBUcmFuc2l0aW9uIHR5cGUg6YCJ5oupIEJ1dHRvbi5UcmFuc2l0aW9uLlNwcml0Ze+8jOaMiemSruS8muWvueebruaghyBTcHJpdGUg6L+b6KGMIFNwcml0ZSDkuYvpl7TnmoTov4fmuKHjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOb2RlfSB0YXJnZXRcbiAgICAgICAgICovXG4gICAgICAgIHRhcmdldDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGUsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgXCJpMThuOkNPTVBPTkVOVC5idXR0b24udGFyZ2V0XCIsXG4gICAgICAgICAgICBub3RpZnkgKG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXBwbHlUYXJnZXQoKTtcbiAgICAgICAgICAgICAgICBpZiAob2xkVmFsdWUgJiYgdGhpcy50YXJnZXQgIT09IG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VucmVnaXN0ZXJUYXJnZXRFdmVudChvbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIElmIEJ1dHRvbiBpcyBjbGlja2VkLCBpdCB3aWxsIHRyaWdnZXIgZXZlbnQncyBoYW5kbGVyXG4gICAgICAgICAqICEjemgg5oyJ6ZKu55qE54K55Ye75LqL5Lu25YiX6KGo44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Q29tcG9uZW50LkV2ZW50SGFuZGxlcltdfSBjbGlja0V2ZW50c1xuICAgICAgICAgKi9cbiAgICAgICAgY2xpY2tFdmVudHM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlcixcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuYnV0dG9uLmNsaWNrX2V2ZW50cycsXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICBUcmFuc2l0aW9uOiBUcmFuc2l0aW9uLFxuICAgIH0sXG5cbiAgICBfX3ByZWxvYWQgKCkge1xuICAgICAgICB0aGlzLl9hcHBseVRhcmdldCgpO1xuICAgICAgICB0aGlzLl9yZXNldFN0YXRlKCk7XG4gICAgfSxcblxuICAgIF9yZXNldFN0YXRlICgpIHtcbiAgICAgICAgdGhpcy5fcHJlc3NlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9ob3ZlcmVkID0gZmFsc2U7XG4gICAgICAgIC8vIC8vIFJlc3RvcmUgYnV0dG9uIHN0YXR1c1xuICAgICAgICBsZXQgdGFyZ2V0ID0gdGhpcy5fZ2V0VGFyZ2V0KCk7XG4gICAgICAgIGxldCB0cmFuc2l0aW9uID0gdGhpcy50cmFuc2l0aW9uO1xuICAgICAgICBsZXQgb3JpZ2luYWxTY2FsZSA9IHRoaXMuX29yaWdpbmFsU2NhbGU7XG5cbiAgICAgICAgaWYgKHRyYW5zaXRpb24gPT09IFRyYW5zaXRpb24uQ09MT1IgJiYgdGhpcy5pbnRlcmFjdGFibGUpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldFRhcmdldENvbG9yKHRoaXMubm9ybWFsQ29sb3IpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRyYW5zaXRpb24gPT09IFRyYW5zaXRpb24uU0NBTEUgJiYgb3JpZ2luYWxTY2FsZSkge1xuICAgICAgICAgICAgdGFyZ2V0LnNldFNjYWxlKG9yaWdpbmFsU2NhbGUueCwgb3JpZ2luYWxTY2FsZS55KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl90cmFuc2l0aW9uRmluaXNoZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBvbkVuYWJsZSAoKSB7XG4gICAgICAgIC8vIGNoZWNrIHNwcml0ZSBmcmFtZXNcbiAgICAgICAgaWYgKHRoaXMubm9ybWFsU3ByaXRlKSB7XG4gICAgICAgICAgICB0aGlzLm5vcm1hbFNwcml0ZS5lbnN1cmVMb2FkVGV4dHVyZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmhvdmVyU3ByaXRlKSB7XG4gICAgICAgICAgICB0aGlzLmhvdmVyU3ByaXRlLmVuc3VyZUxvYWRUZXh0dXJlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucHJlc3NlZFNwcml0ZSkge1xuICAgICAgICAgICAgdGhpcy5wcmVzc2VkU3ByaXRlLmVuc3VyZUxvYWRUZXh0dXJlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWRTcHJpdGUpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZWRTcHJpdGUuZW5zdXJlTG9hZFRleHR1cmUoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKCFDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlZ2lzdGVyTm9kZUV2ZW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl91cGRhdGVTdGF0ZSgpO1xuICAgIH0sXG5cbiAgICBvbkRpc2FibGUgKCkge1xuICAgICAgICB0aGlzLl9yZXNldFN0YXRlKCk7XG5cbiAgICAgICAgaWYgKCFDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRoaXMuX3VucmVnaXN0ZXJOb2RlRXZlbnQoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZ2V0VGFyZ2V0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0ID8gdGhpcy50YXJnZXQgOiB0aGlzLm5vZGU7XG4gICAgfSxcblxuICAgIF9vblRhcmdldFNwcml0ZUZyYW1lQ2hhbmdlZCAoY29tcCkge1xuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uID09PSBUcmFuc2l0aW9uLlNQUklURSkge1xuICAgICAgICAgICAgdGhpcy5fc2V0Q3VycmVudFN0YXRlU3ByaXRlKGNvbXAuc3ByaXRlRnJhbWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9vblRhcmdldENvbG9yQ2hhbmdlZCAoY29sb3IpIHtcbiAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5DT0xPUikge1xuICAgICAgICAgICAgdGhpcy5fc2V0Q3VycmVudFN0YXRlQ29sb3IoY29sb3IpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9vblRhcmdldFNjYWxlQ2hhbmdlZCAoKSB7XG4gICAgICAgIGxldCB0YXJnZXQgPSB0aGlzLl9nZXRUYXJnZXQoKTtcbiAgICAgICAgLy8gdXBkYXRlIF9vcmlnaW5hbFNjYWxlIGlmIHRhcmdldCBzY2FsZSBjaGFuZ2VkXG4gICAgICAgIGlmICh0aGlzLl9vcmlnaW5hbFNjYWxlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uICE9PSBUcmFuc2l0aW9uLlNDQUxFIHx8IHRoaXMuX3RyYW5zaXRpb25GaW5pc2hlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX29yaWdpbmFsU2NhbGUueCA9IHRhcmdldC5zY2FsZVg7XG4gICAgICAgICAgICAgICAgdGhpcy5fb3JpZ2luYWxTY2FsZS55ID0gdGFyZ2V0LnNjYWxlWTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfc2V0VGFyZ2V0Q29sb3IgKGNvbG9yKSB7XG4gICAgICAgIGxldCB0YXJnZXQgPSB0aGlzLl9nZXRUYXJnZXQoKTtcbiAgICAgICAgbGV0IGNsb25lQ29sb3IgPSBjb2xvci5jbG9uZSgpO1xuICAgICAgICB0YXJnZXQub3BhY2l0eSA9IGNsb25lQ29sb3IuYTtcbiAgICAgICAgY2xvbmVDb2xvci5hID0gMjU1OyAgLy8gZG9uJ3Qgc2V0IG5vZGUgb3BhY2l0eSB2aWEgbm9kZS5jb2xvci5hXG4gICAgICAgIHRhcmdldC5jb2xvciA9IGNsb25lQ29sb3I7XG4gICAgfSxcblxuICAgIF9nZXRTdGF0ZUNvbG9yIChzdGF0ZSkge1xuICAgICAgICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgICAgICAgICBjYXNlIFN0YXRlLk5PUk1BTDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ub3JtYWxDb2xvcjtcbiAgICAgICAgICAgIGNhc2UgU3RhdGUuSE9WRVI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaG92ZXJDb2xvcjtcbiAgICAgICAgICAgIGNhc2UgU3RhdGUuUFJFU1NFRDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcmVzc2VkQ29sb3I7XG4gICAgICAgICAgICBjYXNlIFN0YXRlLkRJU0FCTEVEOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkQ29sb3I7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2dldFN0YXRlU3ByaXRlIChzdGF0ZSkge1xuICAgICAgICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgICAgICAgICBjYXNlIFN0YXRlLk5PUk1BTDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ub3JtYWxTcHJpdGU7XG4gICAgICAgICAgICBjYXNlIFN0YXRlLkhPVkVSOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhvdmVyU3ByaXRlO1xuICAgICAgICAgICAgY2FzZSBTdGF0ZS5QUkVTU0VEOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXNzZWRTcHJpdGU7XG4gICAgICAgICAgICBjYXNlIFN0YXRlLkRJU0FCTEVEOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkU3ByaXRlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9zZXRDdXJyZW50U3RhdGVDb2xvciAoY29sb3IpIHtcbiAgICAgICAgc3dpdGNoICggdGhpcy5fZ2V0QnV0dG9uU3RhdGUoKSApIHtcbiAgICAgICAgICAgIGNhc2UgU3RhdGUuTk9STUFMOlxuICAgICAgICAgICAgICAgIHRoaXMubm9ybWFsQ29sb3IgPSBjb2xvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU3RhdGUuSE9WRVI6XG4gICAgICAgICAgICAgICAgdGhpcy5ob3ZlckNvbG9yID0gY29sb3I7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFN0YXRlLlBSRVNTRUQ6XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVzc2VkQ29sb3IgPSBjb2xvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU3RhdGUuRElTQUJMRUQ6XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNhYmxlZENvbG9yID0gY29sb3I7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3NldEN1cnJlbnRTdGF0ZVNwcml0ZSAoc3ByaXRlRnJhbWUpIHtcbiAgICAgICAgc3dpdGNoICggdGhpcy5fZ2V0QnV0dG9uU3RhdGUoKSApIHtcbiAgICAgICAgICAgIGNhc2UgU3RhdGUuTk9STUFMOlxuICAgICAgICAgICAgICAgIHRoaXMubm9ybWFsU3ByaXRlID0gc3ByaXRlRnJhbWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFN0YXRlLkhPVkVSOlxuICAgICAgICAgICAgICAgIHRoaXMuaG92ZXJTcHJpdGUgPSBzcHJpdGVGcmFtZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU3RhdGUuUFJFU1NFRDpcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNzZWRTcHJpdGUgPSBzcHJpdGVGcmFtZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU3RhdGUuRElTQUJMRUQ6XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNhYmxlZFNwcml0ZSA9IHNwcml0ZUZyYW1lO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZSAoZHQpIHtcbiAgICAgICAgbGV0IHRhcmdldCA9IHRoaXMuX2dldFRhcmdldCgpO1xuICAgICAgICBpZiAodGhpcy5fdHJhbnNpdGlvbkZpbmlzaGVkKSByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLnRyYW5zaXRpb24gIT09IFRyYW5zaXRpb24uQ09MT1IgJiYgdGhpcy50cmFuc2l0aW9uICE9PSBUcmFuc2l0aW9uLlNDQUxFKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy50aW1lICs9IGR0O1xuICAgICAgICBsZXQgcmF0aW8gPSAxLjA7XG4gICAgICAgIGlmICh0aGlzLmR1cmF0aW9uID4gMCkge1xuICAgICAgICAgICAgcmF0aW8gPSB0aGlzLnRpbWUgLyB0aGlzLmR1cmF0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2xhbXAgcmF0aW9cbiAgICAgICAgaWYgKHJhdGlvID49IDEpIHtcbiAgICAgICAgICAgIHJhdGlvID0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnRyYW5zaXRpb24gPT09IFRyYW5zaXRpb24uQ09MT1IpIHtcbiAgICAgICAgICAgIGxldCBjb2xvciA9IHRoaXMuX2Zyb21Db2xvci5sZXJwKHRoaXMuX3RvQ29sb3IsIHJhdGlvKTtcbiAgICAgICAgICAgIHRoaXMuX3NldFRhcmdldENvbG9yKGNvbG9yKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTa2lwIGlmIF9vcmlnaW5hbFNjYWxlIGlzIGludmFsaWRcbiAgICAgICAgZWxzZSBpZiAodGhpcy50cmFuc2l0aW9uID09PSBUcmFuc2l0aW9uLlNDQUxFICYmIHRoaXMuX29yaWdpbmFsU2NhbGUpIHtcbiAgICAgICAgICAgIHRhcmdldC5zY2FsZSA9IHRoaXMuX2Zyb21TY2FsZS5sZXJwKHRoaXMuX3RvU2NhbGUsIHJhdGlvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyYXRpbyA9PT0gMSkge1xuICAgICAgICAgICAgdGhpcy5fdHJhbnNpdGlvbkZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIF9yZWdpc3Rlck5vZGVFdmVudCAoKSB7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5fb25Ub3VjaEJlZ2FuLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMuX29uVG91Y2hNb3ZlLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5fb25Ub3VjaEVuZGVkLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0NBTkNFTCwgdGhpcy5fb25Ub3VjaENhbmNlbCwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX0VOVEVSLCB0aGlzLl9vbk1vdXNlTW92ZUluLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX0xFQVZFLCB0aGlzLl9vbk1vdXNlTW92ZU91dCwgdGhpcyk7XG4gICAgfSxcblxuICAgIF91bnJlZ2lzdGVyTm9kZUV2ZW50ICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5fb25Ub3VjaEJlZ2FuLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLl9vblRvdWNoTW92ZSwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLl9vblRvdWNoRW5kZWQsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0NBTkNFTCwgdGhpcy5fb25Ub3VjaENhbmNlbCwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9FTlRFUiwgdGhpcy5fb25Nb3VzZU1vdmVJbiwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTEVBVkUsIHRoaXMuX29uTW91c2VNb3ZlT3V0LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX3JlZ2lzdGVyVGFyZ2V0RXZlbnQgKHRhcmdldCkge1xuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB0YXJnZXQub24oJ3Nwcml0ZWZyYW1lLWNoYW5nZWQnLCB0aGlzLl9vblRhcmdldFNwcml0ZUZyYW1lQ2hhbmdlZCwgdGhpcyk7XG4gICAgICAgICAgICB0YXJnZXQub24oY2MuTm9kZS5FdmVudFR5cGUuQ09MT1JfQ0hBTkdFRCwgdGhpcy5fb25UYXJnZXRDb2xvckNoYW5nZWQsIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHRhcmdldC5vbihjYy5Ob2RlLkV2ZW50VHlwZS5TQ0FMRV9DSEFOR0VELCB0aGlzLl9vblRhcmdldFNjYWxlQ2hhbmdlZCwgdGhpcyk7XG4gICAgfSxcblxuICAgIF91bnJlZ2lzdGVyVGFyZ2V0RXZlbnQgKHRhcmdldCkge1xuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB0YXJnZXQub2ZmKCdzcHJpdGVmcmFtZS1jaGFuZ2VkJywgdGhpcy5fb25UYXJnZXRTcHJpdGVGcmFtZUNoYW5nZWQsIHRoaXMpO1xuICAgICAgICAgICAgdGFyZ2V0Lm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5DT0xPUl9DSEFOR0VELCB0aGlzLl9vblRhcmdldENvbG9yQ2hhbmdlZCwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGFyZ2V0Lm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5TQ0FMRV9DSEFOR0VELCB0aGlzLl9vblRhcmdldFNjYWxlQ2hhbmdlZCwgdGhpcyk7XG4gICAgfSxcblxuICAgIF9nZXRUYXJnZXRTcHJpdGUgKHRhcmdldCkge1xuICAgICAgICBsZXQgc3ByaXRlID0gbnVsbDtcbiAgICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICAgICAgc3ByaXRlID0gdGFyZ2V0LmdldENvbXBvbmVudChjYy5TcHJpdGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzcHJpdGU7XG4gICAgfSxcblxuICAgIF9hcHBseVRhcmdldCAoKSB7XG4gICAgICAgIGxldCB0YXJnZXQgPSB0aGlzLl9nZXRUYXJnZXQoKTtcbiAgICAgICAgdGhpcy5fc3ByaXRlID0gdGhpcy5fZ2V0VGFyZ2V0U3ByaXRlKHRhcmdldCk7XG4gICAgICAgIGlmICghdGhpcy5fb3JpZ2luYWxTY2FsZSkge1xuICAgICAgICAgICAgdGhpcy5fb3JpZ2luYWxTY2FsZSA9IGNjLlZlYzIuWkVSTztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9vcmlnaW5hbFNjYWxlLnggPSB0YXJnZXQuc2NhbGVYO1xuICAgICAgICB0aGlzLl9vcmlnaW5hbFNjYWxlLnkgPSB0YXJnZXQuc2NhbGVZO1xuXG4gICAgICAgIHRoaXMuX3JlZ2lzdGVyVGFyZ2V0RXZlbnQodGFyZ2V0KTtcbiAgICB9LFxuXG4gICAgLy8gdG91Y2ggZXZlbnQgaGFuZGxlclxuICAgIF9vblRvdWNoQmVnYW4gKGV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5pbnRlcmFjdGFibGUgfHwgIXRoaXMuZW5hYmxlZEluSGllcmFyY2h5KSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5fcHJlc3NlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVN0YXRlKCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0sXG5cbiAgICBfb25Ub3VjaE1vdmUgKGV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5pbnRlcmFjdGFibGUgfHwgIXRoaXMuZW5hYmxlZEluSGllcmFyY2h5IHx8ICF0aGlzLl9wcmVzc2VkKSByZXR1cm47XG4gICAgICAgIC8vIG1vYmlsZSBwaG9uZSB3aWxsIG5vdCBlbWl0IF9vbk1vdXNlTW92ZU91dCxcbiAgICAgICAgLy8gc28gd2UgaGF2ZSB0byBkbyBoaXQgdGVzdCB3aGVuIHRvdWNoIG1vdmluZ1xuICAgICAgICBsZXQgdG91Y2ggPSBldmVudC50b3VjaDtcbiAgICAgICAgbGV0IGhpdCA9IHRoaXMubm9kZS5faGl0VGVzdCh0b3VjaC5nZXRMb2NhdGlvbigpKTtcbiAgICAgICAgbGV0IHRhcmdldCA9IHRoaXMuX2dldFRhcmdldCgpO1xuICAgICAgICBsZXQgb3JpZ2luYWxTY2FsZSA9IHRoaXMuX29yaWdpbmFsU2NhbGU7XG5cbiAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5TQ0FMRSAmJiBvcmlnaW5hbFNjYWxlKSB7XG4gICAgICAgICAgICBpZiAoaGl0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZnJvbVNjYWxlLnggPSBvcmlnaW5hbFNjYWxlLng7XG4gICAgICAgICAgICAgICAgdGhpcy5fZnJvbVNjYWxlLnkgPSBvcmlnaW5hbFNjYWxlLnk7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG9TY2FsZS54ID0gb3JpZ2luYWxTY2FsZS54ICogdGhpcy56b29tU2NhbGU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG9TY2FsZS55ID0gb3JpZ2luYWxTY2FsZS55ICogdGhpcy56b29tU2NhbGU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdHJhbnNpdGlvbkZpbmlzaGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGltZSA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5fdHJhbnNpdGlvbkZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuc2V0U2NhbGUob3JpZ2luYWxTY2FsZS54LCBvcmlnaW5hbFNjYWxlLnkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHN0YXRlO1xuICAgICAgICAgICAgaWYgKGhpdCkge1xuICAgICAgICAgICAgICAgIHN0YXRlID0gU3RhdGUuUFJFU1NFRDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RhdGUgPSBTdGF0ZS5OT1JNQUw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9hcHBseVRyYW5zaXRpb24oc3RhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0sXG5cbiAgICBfb25Ub3VjaEVuZGVkIChldmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuaW50ZXJhY3RhYmxlIHx8ICF0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLl9wcmVzc2VkKSB7XG4gICAgICAgICAgICBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyLmVtaXRFdmVudHModGhpcy5jbGlja0V2ZW50cywgZXZlbnQpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmVtaXQoJ2NsaWNrJywgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcHJlc3NlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl91cGRhdGVTdGF0ZSgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9LFxuXG4gICAgX29uVG91Y2hDYW5jZWwgKCkge1xuICAgICAgICBpZiAoIXRoaXMuaW50ZXJhY3RhYmxlIHx8ICF0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuX3ByZXNzZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fdXBkYXRlU3RhdGUoKTtcbiAgICB9LFxuXG4gICAgX29uTW91c2VNb3ZlSW4gKCkge1xuICAgICAgICBpZiAodGhpcy5fcHJlc3NlZCB8fCAhdGhpcy5pbnRlcmFjdGFibGUgfHwgIXRoaXMuZW5hYmxlZEluSGllcmFyY2h5KSByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLnRyYW5zaXRpb24gPT09IFRyYW5zaXRpb24uU1BSSVRFICYmICF0aGlzLmhvdmVyU3ByaXRlKSByZXR1cm47XG5cbiAgICAgICAgaWYgKCF0aGlzLl9ob3ZlcmVkKSB7XG4gICAgICAgICAgICB0aGlzLl9ob3ZlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVN0YXRlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX29uTW91c2VNb3ZlT3V0ICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2hvdmVyZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2hvdmVyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVN0YXRlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gc3RhdGUgaGFuZGxlclxuICAgIF91cGRhdGVTdGF0ZSAoKSB7XG4gICAgICAgIGxldCBzdGF0ZSA9IHRoaXMuX2dldEJ1dHRvblN0YXRlKCk7XG4gICAgICAgIHRoaXMuX2FwcGx5VHJhbnNpdGlvbihzdGF0ZSk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZURpc2FibGVkU3RhdGUoKTtcbiAgICB9LFxuXG4gICAgX2dldEJ1dHRvblN0YXRlICgpIHtcbiAgICAgICAgbGV0IHN0YXRlO1xuICAgICAgICBpZiAoIXRoaXMuaW50ZXJhY3RhYmxlKSB7XG4gICAgICAgICAgICBzdGF0ZSA9IFN0YXRlLkRJU0FCTEVEO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX3ByZXNzZWQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gU3RhdGUuUFJFU1NFRDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLl9ob3ZlcmVkKSB7XG4gICAgICAgICAgICBzdGF0ZSA9IFN0YXRlLkhPVkVSO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUgPSBTdGF0ZS5OT1JNQUw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlQ29sb3JUcmFuc2l0aW9uSW1tZWRpYXRlbHkgKHN0YXRlKSB7XG4gICAgICAgIGxldCBjb2xvciA9IHRoaXMuX2dldFN0YXRlQ29sb3Ioc3RhdGUpO1xuICAgICAgICB0aGlzLl9zZXRUYXJnZXRDb2xvcihjb2xvcik7XG4gICAgICAgIHRoaXMuX2Zyb21Db2xvciA9IGNvbG9yLmNsb25lKCk7XG4gICAgICAgIHRoaXMuX3RvQ29sb3IgPSBjb2xvcjtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZUNvbG9yVHJhbnNpdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUiB8fCBzdGF0ZSA9PT0gU3RhdGUuRElTQUJMRUQpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUNvbG9yVHJhbnNpdGlvbkltbWVkaWF0ZWx5KHN0YXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCB0YXJnZXQgPSB0aGlzLl9nZXRUYXJnZXQoKTtcbiAgICAgICAgICAgIGxldCBjb2xvciA9IHRoaXMuX2dldFN0YXRlQ29sb3Ioc3RhdGUpO1xuICAgICAgICAgICAgdGhpcy5fZnJvbUNvbG9yID0gdGFyZ2V0LmNvbG9yLmNsb25lKCk7XG4gICAgICAgICAgICB0aGlzLl90b0NvbG9yID0gY29sb3I7XG4gICAgICAgICAgICB0aGlzLnRpbWUgPSAwO1xuICAgICAgICAgICAgdGhpcy5fdHJhbnNpdGlvbkZpbmlzaGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VwZGF0ZVNwcml0ZVRyYW5zaXRpb24gKHN0YXRlKSB7XG4gICAgICAgIGxldCBzcHJpdGUgPSB0aGlzLl9nZXRTdGF0ZVNwcml0ZShzdGF0ZSk7XG4gICAgICAgIGlmICh0aGlzLl9zcHJpdGUgJiYgc3ByaXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9zcHJpdGUuc3ByaXRlRnJhbWUgPSBzcHJpdGU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VwZGF0ZVNjYWxlVHJhbnNpdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgaWYgKHN0YXRlID09PSBTdGF0ZS5QUkVTU0VEKSB7XG4gICAgICAgICAgICB0aGlzLl96b29tVXAoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3pvb21CYWNrKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3pvb21VcCAoKSB7XG4gICAgICAgIC8vIHNraXAgYmVmb3JlIF9fcHJlbG9hZCgpXG4gICAgICAgIGlmICghdGhpcy5fb3JpZ2luYWxTY2FsZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZnJvbVNjYWxlLnggPSB0aGlzLl9vcmlnaW5hbFNjYWxlLng7XG4gICAgICAgIHRoaXMuX2Zyb21TY2FsZS55ID0gdGhpcy5fb3JpZ2luYWxTY2FsZS55O1xuICAgICAgICB0aGlzLl90b1NjYWxlLnggPSB0aGlzLl9vcmlnaW5hbFNjYWxlLnggKiB0aGlzLnpvb21TY2FsZTtcbiAgICAgICAgdGhpcy5fdG9TY2FsZS55ID0gdGhpcy5fb3JpZ2luYWxTY2FsZS55ICogdGhpcy56b29tU2NhbGU7XG4gICAgICAgIHRoaXMudGltZSA9IDA7XG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb25GaW5pc2hlZCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBfem9vbUJhY2sgKCkge1xuICAgICAgICAvLyBza2lwIGJlZm9yZSBfX3ByZWxvYWQoKVxuICAgICAgICBpZiAoIXRoaXMuX29yaWdpbmFsU2NhbGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB0YXJnZXQgPSB0aGlzLl9nZXRUYXJnZXQoKTtcbiAgICAgICAgdGhpcy5fZnJvbVNjYWxlLnggPSB0YXJnZXQuc2NhbGVYO1xuICAgICAgICB0aGlzLl9mcm9tU2NhbGUueSA9IHRhcmdldC5zY2FsZVk7XG4gICAgICAgIHRoaXMuX3RvU2NhbGUueCA9IHRoaXMuX29yaWdpbmFsU2NhbGUueDtcbiAgICAgICAgdGhpcy5fdG9TY2FsZS55ID0gdGhpcy5fb3JpZ2luYWxTY2FsZS55O1xuICAgICAgICB0aGlzLnRpbWUgPSAwO1xuICAgICAgICB0aGlzLl90cmFuc2l0aW9uRmluaXNoZWQgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZVRyYW5zaXRpb24gKG9sZFRyYW5zaXRpb24pIHtcbiAgICAgICAgLy8gUmVzZXQgdG8gbm9ybWFsIGRhdGEgd2hlbiBjaGFuZ2UgdHJhbnNpdGlvbi5cbiAgICAgICAgaWYgKG9sZFRyYW5zaXRpb24gPT09IFRyYW5zaXRpb24uQ09MT1IpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUNvbG9yVHJhbnNpdGlvbkltbWVkaWF0ZWx5KFN0YXRlLk5PUk1BTCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob2xkVHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5TUFJJVEUpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVNwcml0ZVRyYW5zaXRpb24oU3RhdGUuTk9STUFMKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl91cGRhdGVTdGF0ZSgpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlUcmFuc2l0aW9uIChzdGF0ZSkge1xuICAgICAgICBsZXQgdHJhbnNpdGlvbiA9IHRoaXMudHJhbnNpdGlvbjtcbiAgICAgICAgaWYgKHRyYW5zaXRpb24gPT09IFRyYW5zaXRpb24uQ09MT1IpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUNvbG9yVHJhbnNpdGlvbihzdGF0ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5TUFJJVEUpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVNwcml0ZVRyYW5zaXRpb24oc3RhdGUpO1xuICAgICAgICB9IGVsc2UgaWYgKHRyYW5zaXRpb24gPT09IFRyYW5zaXRpb24uU0NBTEUpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVNjYWxlVHJhbnNpdGlvbihzdGF0ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3Jlc2l6ZU5vZGVUb1RhcmdldE5vZGU6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubm9kZS5zZXRDb250ZW50U2l6ZSh0aGlzLl9nZXRUYXJnZXQoKS5nZXRDb250ZW50U2l6ZSgpKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZURpc2FibGVkU3RhdGUgKGZvcmNlKSB7XG4gICAgICAgIGlmICghdGhpcy5fc3ByaXRlKSByZXR1cm47XG5cbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlQXV0b0dyYXlFZmZlY3QgfHwgZm9yY2UpIHtcbiAgICAgICAgICAgIGxldCB1c2VHcmF5TWF0ZXJpYWwgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKCEodGhpcy50cmFuc2l0aW9uID09PSBUcmFuc2l0aW9uLlNQUklURSAmJiB0aGlzLmRpc2FibGVkU3ByaXRlKSkge1xuICAgICAgICAgICAgICAgIHVzZUdyYXlNYXRlcmlhbCA9IHRoaXMuZW5hYmxlQXV0b0dyYXlFZmZlY3QgJiYgIXRoaXMuaW50ZXJhY3RhYmxlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fc3dpdGNoR3JheU1hdGVyaWFsKHVzZUdyYXlNYXRlcmlhbCwgdGhpcy5fc3ByaXRlKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5CdXR0b24gPSBtb2R1bGUuZXhwb3J0cyA9IEJ1dHRvbjtcblxuLyoqXG4gKiAhI2VuXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXG4gKiAhI3poXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcbiAqIEBldmVudCBjbGlja1xuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqIEBwYXJhbSB7QnV0dG9ufSBidXR0b24gLSBUaGUgQnV0dG9uIGNvbXBvbmVudC5cbiAqL1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=