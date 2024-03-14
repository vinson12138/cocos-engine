
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/event-manager/CCEventListener.js';
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
var js = require('../platform/js');
/**
 * !#en
 * <p>
 *     The base class of event listener.                                                                        <br/>
 *     If you need custom listener which with different callback, you need to inherit this class.               <br/>
 *     For instance, you could refer to EventListenerAcceleration, EventListenerKeyboard,                       <br/>
 *      EventListenerTouchOneByOne, EventListenerCustom.
 * </p>
 *
 * !#zh
 * 封装用户的事件处理逻辑。
 * 注意：这是一个抽象类，开发者不应该直接实例化这个类，请参考 {{#crossLink "EventListener/create:method"}}cc.EventListener.create{{/crossLink}}。
 *
 * @class EventListener
 */

/**
 * Constructor
 * @method constructor
 * @param {Number} type
 * @param {Number} listenerID
 * @param {Number} callback
 */


cc.EventListener = function (type, listenerID, callback) {
  this._onEvent = callback; // Event callback function

  this._type = type || 0; // Event listener type

  this._listenerID = listenerID || ""; // Event listener ID

  this._registered = false; // Whether the listener has been added to dispatcher.

  this._fixedPriority = 0; // The higher the number, the higher the priority, 0 is for scene graph base priority.

  this._node = null; // scene graph based priority

  this._target = null;
  this._paused = true; // Whether the listener is paused

  this._isEnabled = true; // Whether the listener is enabled
};

cc.EventListener.prototype = {
  constructor: cc.EventListener,

  /*
   * <p>
   *     Sets paused state for the listener
   *     The paused state is only used for scene graph priority listeners.
   *     `EventDispatcher::resumeAllEventListenersForTarget(node)` will set the paused state to `true`,
   *     while `EventDispatcher::pauseAllEventListenersForTarget(node)` will set it to `false`.
   *     @note 1) Fixed priority listeners will never get paused. If a fixed priority doesn't want to receive events,
   *              call `setEnabled(false)` instead.
   *            2) In `Node`'s onEnter and onExit, the `paused state` of the listeners which associated with that node will be automatically updated.
   * </p>
   * @param {Boolean} paused
   * @private
   */
  _setPaused: function _setPaused(paused) {
    this._paused = paused;
  },

  /*
   * Checks whether the listener is paused.
   * @returns {Boolean}
   * @private
   */
  _isPaused: function _isPaused() {
    return this._paused;
  },

  /*
   * Marks the listener was registered by EventDispatcher.
   * @param {Boolean} registered
   * @private
   */
  _setRegistered: function _setRegistered(registered) {
    this._registered = registered;
  },

  /*
   * Checks whether the listener was registered by EventDispatcher
   * @returns {Boolean}
   * @private
   */
  _isRegistered: function _isRegistered() {
    return this._registered;
  },

  /*
   * Gets the type of this listener
   * @note It's different from `EventType`, e.g. TouchEvent has two kinds of event listeners - EventListenerOneByOne, EventListenerAllAtOnce
   * @returns {Number}
   * @private
   */
  _getType: function _getType() {
    return this._type;
  },

  /*
   *  Gets the listener ID of this listener
   *  When event is being dispatched, listener ID is used as key for searching listeners according to event type.
   * @returns {String}
   * @private
   */
  _getListenerID: function _getListenerID() {
    return this._listenerID;
  },

  /*
   * Sets the fixed priority for this listener
   *  @note This method is only used for `fixed priority listeners`, it needs to access a non-zero value. 0 is reserved for scene graph priority listeners
   * @param {Number} fixedPriority
   * @private
   */
  _setFixedPriority: function _setFixedPriority(fixedPriority) {
    this._fixedPriority = fixedPriority;
  },

  /*
   * Gets the fixed priority of this listener
   * @returns {Number} 0 if it's a scene graph priority listener, non-zero for fixed priority listener
   * @private
   */
  _getFixedPriority: function _getFixedPriority() {
    return this._fixedPriority;
  },

  /*
   * Sets scene graph priority for this listener
   * @param {cc.Node} node
   * @private
   */
  _setSceneGraphPriority: function _setSceneGraphPriority(node) {
    this._target = node;
    this._node = node;
  },

  /*
   * Gets scene graph priority of this listener
   * @returns {cc.Node} if it's a fixed priority listener, non-null for scene graph priority listener
   * @private
   */
  _getSceneGraphPriority: function _getSceneGraphPriority() {
    return this._node;
  },

  /**
   * !#en Checks whether the listener is available.
   * !#zh 检测监听器是否有效
   * @method checkAvailable
   * @returns {Boolean}
   */
  checkAvailable: function checkAvailable() {
    return this._onEvent !== null;
  },

  /**
   * !#en Clones the listener, its subclasses have to override this method.
   * !#zh 克隆监听器,它的子类必须重写此方法。
   * @method clone
   * @returns {EventListener}
   */
  clone: function clone() {
    return null;
  },

  /**
   *  !#en Enables or disables the listener
   *  !#zh 启用或禁用监听器。
   *  @method setEnabled
   *  @param {Boolean} enabled
   *  @note Only listeners with `enabled` state will be able to receive events.
   *          When an listener was initialized, it's enabled by default.
   *          An event listener can receive events when it is enabled and is not paused.
   *          paused state is always false when it is a fixed priority listener.
   */
  setEnabled: function setEnabled(enabled) {
    this._isEnabled = enabled;
  },

  /**
   * !#en Checks whether the listener is enabled
   * !#zh 检查监听器是否可用。
   * @method isEnabled
   * @returns {Boolean}
   */
  isEnabled: function isEnabled() {
    return this._isEnabled;
  },

  /*
   * <p>Currently JavaScript Bindings (JSB), in some cases, needs to use retain and release. This is a bug in JSB,
   * and the ugly workaround is to use retain/release. So, these 2 methods were added to be compatible with JSB.
   * This is a hack, and should be removed once JSB fixes the retain/release bug<br/>
   * You will need to retain an object if you created a listener and haven't added it any target node during the same frame.<br/>
   * Otherwise, JSB's native autorelease pool will consider this object a useless one and release it directly,<br/>
   * when you want to use it later, a "Invalid Native Object" error will be raised.<br/>
   * The retain function can increase a reference count for the native object to avoid it being released,<br/>
   * you need to manually invoke release function when you think this object is no longer needed, otherwise, there will be memory learks.<br/>
   * retain and release function call should be paired in developer's game code.</p>
   *
   * @method retain
   * @see cc.EventListener#release
   */
  retain: function retain() {},

  /*
   * <p>Currently JavaScript Bindings (JSB), in some cases, needs to use retain and release. This is a bug in JSB,
   * and the ugly workaround is to use retain/release. So, these 2 methods were added to be compatible with JSB.
   * This is a hack, and should be removed once JSB fixes the retain/release bug<br/>
   * You will need to retain an object if you created a listener and haven't added it any target node during the same frame.<br/>
   * Otherwise, JSB's native autorelease pool will consider this object a useless one and release it directly,<br/>
   * when you want to use it later, a "Invalid Native Object" error will be raised.<br/>
   * The retain function can increase a reference count for the native object to avoid it being released,<br/>
   * you need to manually invoke release function when you think this object is no longer needed, otherwise, there will be memory learks.<br/>
   * retain and release function call should be paired in developer's game code.</p>
   *
   * @method release
   * @see cc.EventListener#retain
   */
  release: function release() {}
}; // event listener type

/**
 * !#en The type code of unknown event listener.
 * !#zh 未知的事件监听器类型
 * @property UNKNOWN
 * @type {Number}
 * @static
 */

cc.EventListener.UNKNOWN = 0;
/*
 * !#en The type code of one by one touch event listener.
 * !#zh 触摸事件监听器类型，触点会一个一个得分开被派发
 * @property TOUCH_ONE_BY_ONE
 * @type {Number}
 * @static
 */

cc.EventListener.TOUCH_ONE_BY_ONE = 1;
/*
 * !#en The type code of all at once touch event listener.
 * !#zh 触摸事件监听器类型，触点会被一次性全部派发
 * @property TOUCH_ALL_AT_ONCE
 * @type {Number}
 * @static
 */

cc.EventListener.TOUCH_ALL_AT_ONCE = 2;
/**
 * !#en The type code of keyboard event listener.
 * !#zh 键盘事件监听器类型
 * @property KEYBOARD
 * @type {Number}
 * @static
 */

cc.EventListener.KEYBOARD = 3;
/*
 * !#en The type code of mouse event listener.
 * !#zh 鼠标事件监听器类型
 * @property MOUSE
 * @type {Number}
 * @static
 */

cc.EventListener.MOUSE = 4;
/**
 * !#en The type code of acceleration event listener.
 * !#zh 加速器事件监听器类型
 * @property ACCELERATION
 * @type {Number}
 * @static
 */

cc.EventListener.ACCELERATION = 6;
/*
 * !#en The type code of custom event listener.
 * !#zh 自定义事件监听器类型
 * @property CUSTOM
 * @type {Number}
 * @static
 */

cc.EventListener.CUSTOM = 8;
var ListenerID = cc.EventListener.ListenerID = {
  MOUSE: '__cc_mouse',
  TOUCH_ONE_BY_ONE: '__cc_touch_one_by_one',
  TOUCH_ALL_AT_ONCE: '__cc_touch_all_at_once',
  KEYBOARD: '__cc_keyboard',
  ACCELERATION: '__cc_acceleration'
};

var Custom = function Custom(listenerId, callback) {
  this._onCustomEvent = callback;
  cc.EventListener.call(this, cc.EventListener.CUSTOM, listenerId, this._callback);
};

js.extend(Custom, cc.EventListener);
js.mixin(Custom.prototype, {
  _onCustomEvent: null,
  _callback: function _callback(event) {
    if (this._onCustomEvent !== null) this._onCustomEvent(event);
  },
  checkAvailable: function checkAvailable() {
    return cc.EventListener.prototype.checkAvailable.call(this) && this._onCustomEvent !== null;
  },
  clone: function clone() {
    return new Custom(this._listenerID, this._onCustomEvent);
  }
});

var Mouse = function Mouse() {
  cc.EventListener.call(this, cc.EventListener.MOUSE, ListenerID.MOUSE, this._callback);
};

js.extend(Mouse, cc.EventListener);
js.mixin(Mouse.prototype, {
  onMouseDown: null,
  onMouseUp: null,
  onMouseMove: null,
  onMouseScroll: null,
  _callback: function _callback(event) {
    var eventType = cc.Event.EventMouse;

    switch (event._eventType) {
      case eventType.DOWN:
        if (this.onMouseDown) this.onMouseDown(event);
        break;

      case eventType.UP:
        if (this.onMouseUp) this.onMouseUp(event);
        break;

      case eventType.MOVE:
        if (this.onMouseMove) this.onMouseMove(event);
        break;

      case eventType.SCROLL:
        if (this.onMouseScroll) this.onMouseScroll(event);
        break;

      default:
        break;
    }
  },
  clone: function clone() {
    var eventListener = new Mouse();
    eventListener.onMouseDown = this.onMouseDown;
    eventListener.onMouseUp = this.onMouseUp;
    eventListener.onMouseMove = this.onMouseMove;
    eventListener.onMouseScroll = this.onMouseScroll;
    return eventListener;
  },
  checkAvailable: function checkAvailable() {
    return true;
  }
});

var TouchOneByOne = function TouchOneByOne() {
  cc.EventListener.call(this, cc.EventListener.TOUCH_ONE_BY_ONE, ListenerID.TOUCH_ONE_BY_ONE, null);
  this._claimedTouches = [];
};

js.extend(TouchOneByOne, cc.EventListener);
js.mixin(TouchOneByOne.prototype, {
  constructor: TouchOneByOne,
  _claimedTouches: null,
  swallowTouches: false,
  onTouchBegan: null,
  onTouchMoved: null,
  onTouchEnded: null,
  onTouchCancelled: null,
  setSwallowTouches: function setSwallowTouches(needSwallow) {
    this.swallowTouches = needSwallow;
  },
  isSwallowTouches: function isSwallowTouches() {
    return this.swallowTouches;
  },
  clone: function clone() {
    var eventListener = new TouchOneByOne();
    eventListener.onTouchBegan = this.onTouchBegan;
    eventListener.onTouchMoved = this.onTouchMoved;
    eventListener.onTouchEnded = this.onTouchEnded;
    eventListener.onTouchCancelled = this.onTouchCancelled;
    eventListener.swallowTouches = this.swallowTouches;
    return eventListener;
  },
  checkAvailable: function checkAvailable() {
    if (!this.onTouchBegan) {
      cc.logID(1801);
      return false;
    }

    return true;
  }
});

var TouchAllAtOnce = function TouchAllAtOnce() {
  cc.EventListener.call(this, cc.EventListener.TOUCH_ALL_AT_ONCE, ListenerID.TOUCH_ALL_AT_ONCE, null);
};

js.extend(TouchAllAtOnce, cc.EventListener);
js.mixin(TouchAllAtOnce.prototype, {
  constructor: TouchAllAtOnce,
  onTouchesBegan: null,
  onTouchesMoved: null,
  onTouchesEnded: null,
  onTouchesCancelled: null,
  clone: function clone() {
    var eventListener = new TouchAllAtOnce();
    eventListener.onTouchesBegan = this.onTouchesBegan;
    eventListener.onTouchesMoved = this.onTouchesMoved;
    eventListener.onTouchesEnded = this.onTouchesEnded;
    eventListener.onTouchesCancelled = this.onTouchesCancelled;
    return eventListener;
  },
  checkAvailable: function checkAvailable() {
    if (this.onTouchesBegan === null && this.onTouchesMoved === null && this.onTouchesEnded === null && this.onTouchesCancelled === null) {
      cc.logID(1802);
      return false;
    }

    return true;
  }
}); //Acceleration

var Acceleration = function Acceleration(callback) {
  this._onAccelerationEvent = callback;
  cc.EventListener.call(this, cc.EventListener.ACCELERATION, ListenerID.ACCELERATION, this._callback);
};

js.extend(Acceleration, cc.EventListener);
js.mixin(Acceleration.prototype, {
  constructor: Acceleration,
  _onAccelerationEvent: null,
  _callback: function _callback(event) {
    this._onAccelerationEvent(event.acc, event);
  },
  checkAvailable: function checkAvailable() {
    cc.assertID(this._onAccelerationEvent, 1803);
    return true;
  },
  clone: function clone() {
    return new Acceleration(this._onAccelerationEvent);
  }
}); //Keyboard

var Keyboard = function Keyboard() {
  cc.EventListener.call(this, cc.EventListener.KEYBOARD, ListenerID.KEYBOARD, this._callback);
};

js.extend(Keyboard, cc.EventListener);
js.mixin(Keyboard.prototype, {
  constructor: Keyboard,
  onKeyPressed: null,
  onKeyReleased: null,
  _callback: function _callback(event) {
    if (event.isPressed) {
      if (this.onKeyPressed) this.onKeyPressed(event.keyCode, event);
    } else {
      if (this.onKeyReleased) this.onKeyReleased(event.keyCode, event);
    }
  },
  clone: function clone() {
    var eventListener = new Keyboard();
    eventListener.onKeyPressed = this.onKeyPressed;
    eventListener.onKeyReleased = this.onKeyReleased;
    return eventListener;
  },
  checkAvailable: function checkAvailable() {
    if (this.onKeyPressed === null && this.onKeyReleased === null) {
      cc.logID(1800);
      return false;
    }

    return true;
  }
});
/**
 * !#en
 * Create a EventListener object with configuration including the event type, handlers and other parameters.
 * In handlers, this refer to the event listener object itself.
 * You can also pass custom parameters in the configuration object,
 * all custom parameters will be polyfilled into the event listener object and can be accessed in handlers.
 * !#zh 通过指定不同的 Event 对象来设置想要创建的事件监听器。
 * @method create
 * @param {Object} argObj a json object
 * @returns {EventListener}
 * @static
 * @example {@link cocos2d/core/event-manager/CCEventListener/create.js}
 */

cc.EventListener.create = function (argObj) {
  cc.assertID(argObj && argObj.event, 1900);
  var listenerType = argObj.event;
  delete argObj.event;
  var listener = null;
  if (listenerType === cc.EventListener.TOUCH_ONE_BY_ONE) listener = new TouchOneByOne();else if (listenerType === cc.EventListener.TOUCH_ALL_AT_ONCE) listener = new TouchAllAtOnce();else if (listenerType === cc.EventListener.MOUSE) listener = new Mouse();else if (listenerType === cc.EventListener.CUSTOM) {
    listener = new Custom(argObj.eventName, argObj.callback);
    delete argObj.eventName;
    delete argObj.callback;
  } else if (listenerType === cc.EventListener.KEYBOARD) listener = new Keyboard();else if (listenerType === cc.EventListener.ACCELERATION) {
    listener = new Acceleration(argObj.callback);
    delete argObj.callback;
  }

  for (var key in argObj) {
    listener[key] = argObj[key];
  }

  return listener;
};

module.exports = cc.EventListener;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2V2ZW50LW1hbmFnZXIvQ0NFdmVudExpc3RlbmVyLmpzIl0sIm5hbWVzIjpbImpzIiwicmVxdWlyZSIsImNjIiwiRXZlbnRMaXN0ZW5lciIsInR5cGUiLCJsaXN0ZW5lcklEIiwiY2FsbGJhY2siLCJfb25FdmVudCIsIl90eXBlIiwiX2xpc3RlbmVySUQiLCJfcmVnaXN0ZXJlZCIsIl9maXhlZFByaW9yaXR5IiwiX25vZGUiLCJfdGFyZ2V0IiwiX3BhdXNlZCIsIl9pc0VuYWJsZWQiLCJwcm90b3R5cGUiLCJjb25zdHJ1Y3RvciIsIl9zZXRQYXVzZWQiLCJwYXVzZWQiLCJfaXNQYXVzZWQiLCJfc2V0UmVnaXN0ZXJlZCIsInJlZ2lzdGVyZWQiLCJfaXNSZWdpc3RlcmVkIiwiX2dldFR5cGUiLCJfZ2V0TGlzdGVuZXJJRCIsIl9zZXRGaXhlZFByaW9yaXR5IiwiZml4ZWRQcmlvcml0eSIsIl9nZXRGaXhlZFByaW9yaXR5IiwiX3NldFNjZW5lR3JhcGhQcmlvcml0eSIsIm5vZGUiLCJfZ2V0U2NlbmVHcmFwaFByaW9yaXR5IiwiY2hlY2tBdmFpbGFibGUiLCJjbG9uZSIsInNldEVuYWJsZWQiLCJlbmFibGVkIiwiaXNFbmFibGVkIiwicmV0YWluIiwicmVsZWFzZSIsIlVOS05PV04iLCJUT1VDSF9PTkVfQllfT05FIiwiVE9VQ0hfQUxMX0FUX09OQ0UiLCJLRVlCT0FSRCIsIk1PVVNFIiwiQUNDRUxFUkFUSU9OIiwiQ1VTVE9NIiwiTGlzdGVuZXJJRCIsIkN1c3RvbSIsImxpc3RlbmVySWQiLCJfb25DdXN0b21FdmVudCIsImNhbGwiLCJfY2FsbGJhY2siLCJleHRlbmQiLCJtaXhpbiIsImV2ZW50IiwiTW91c2UiLCJvbk1vdXNlRG93biIsIm9uTW91c2VVcCIsIm9uTW91c2VNb3ZlIiwib25Nb3VzZVNjcm9sbCIsImV2ZW50VHlwZSIsIkV2ZW50IiwiRXZlbnRNb3VzZSIsIl9ldmVudFR5cGUiLCJET1dOIiwiVVAiLCJNT1ZFIiwiU0NST0xMIiwiZXZlbnRMaXN0ZW5lciIsIlRvdWNoT25lQnlPbmUiLCJfY2xhaW1lZFRvdWNoZXMiLCJzd2FsbG93VG91Y2hlcyIsIm9uVG91Y2hCZWdhbiIsIm9uVG91Y2hNb3ZlZCIsIm9uVG91Y2hFbmRlZCIsIm9uVG91Y2hDYW5jZWxsZWQiLCJzZXRTd2FsbG93VG91Y2hlcyIsIm5lZWRTd2FsbG93IiwiaXNTd2FsbG93VG91Y2hlcyIsImxvZ0lEIiwiVG91Y2hBbGxBdE9uY2UiLCJvblRvdWNoZXNCZWdhbiIsIm9uVG91Y2hlc01vdmVkIiwib25Ub3VjaGVzRW5kZWQiLCJvblRvdWNoZXNDYW5jZWxsZWQiLCJBY2NlbGVyYXRpb24iLCJfb25BY2NlbGVyYXRpb25FdmVudCIsImFjYyIsImFzc2VydElEIiwiS2V5Ym9hcmQiLCJvbktleVByZXNzZWQiLCJvbktleVJlbGVhc2VkIiwiaXNQcmVzc2VkIiwia2V5Q29kZSIsImNyZWF0ZSIsImFyZ09iaiIsImxpc3RlbmVyVHlwZSIsImxpc3RlbmVyIiwiZXZlbnROYW1lIiwia2V5IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBSUEsRUFBRSxHQUFHQyxPQUFPLENBQUMsZ0JBQUQsQ0FBaEI7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBQyxFQUFFLENBQUNDLGFBQUgsR0FBbUIsVUFBVUMsSUFBVixFQUFnQkMsVUFBaEIsRUFBNEJDLFFBQTVCLEVBQXNDO0FBQ3JELE9BQUtDLFFBQUwsR0FBZ0JE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USxHQUFHLElBQUlaLFlBQUosQ0FBaUJVLE1BQU0sQ0FBQ3pGLFFBQXhCLENBQVg7QUFDQSxXQUFPeUYsTUFBTSxDQUFDekYsUUFBZDtBQUNIOztBQUVELE9BQUksSUFBSTZGLEdBQVIsSUFBZUosTUFBZixFQUF1QjtBQUNuQkUsSUFBQUEsUUFBUSxDQUFDRSxHQUFELENBQVIsR0FBZ0JKLE1BQU0sQ0FBQ0ksR0FBRCxDQUF0QjtBQUNIOztBQUNELFNBQU9GLFFBQVA7QUFDSCxDQTVCRDs7QUE4QkFHLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQm5HLEVBQUUsQ0FBQ0MsYUFBcEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBqcyA9IHJlcXVpcmUoJy4uL3BsYXRmb3JtL2pzJyk7XG5cbi8qKlxuICogISNlblxuICogPHA+XG4gKiAgICAgVGhlIGJhc2UgY2xhc3Mgb2YgZXZlbnQgbGlzdGVuZXIuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAqICAgICBJZiB5b3UgbmVlZCBjdXN0b20gbGlzdGVuZXIgd2hpY2ggd2l0aCBkaWZmZXJlbnQgY2FsbGJhY2ssIHlvdSBuZWVkIHRvIGluaGVyaXQgdGhpcyBjbGFzcy4gICAgICAgICAgICAgICA8YnIvPlxuICogICAgIEZvciBpbnN0YW5jZSwgeW91IGNvdWxkIHJlZmVyIHRvIEV2ZW50TGlzdGVuZXJBY2NlbGVyYXRpb24sIEV2ZW50TGlzdGVuZXJLZXlib2FyZCwgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gKiAgICAgIEV2ZW50TGlzdGVuZXJUb3VjaE9uZUJ5T25lLCBFdmVudExpc3RlbmVyQ3VzdG9tLlxuICogPC9wPlxuICpcbiAqICEjemhcbiAqIOWwgeijheeUqOaIt+eahOS6i+S7tuWkhOeQhumAu+i+keOAglxuICog5rOo5oSP77ya6L+Z5piv5LiA5Liq5oq96LGh57G777yM5byA5Y+R6ICF5LiN5bqU6K+l55u05o6l5a6e5L6L5YyW6L+Z5Liq57G777yM6K+35Y+C6ICDIHt7I2Nyb3NzTGluayBcIkV2ZW50TGlzdGVuZXIvY3JlYXRlOm1ldGhvZFwifX1jYy5FdmVudExpc3RlbmVyLmNyZWF0ZXt7L2Nyb3NzTGlua31944CCXG4gKlxuICogQGNsYXNzIEV2ZW50TGlzdGVuZXJcbiAqL1xuXG4vKipcbiAqIENvbnN0cnVjdG9yXG4gKiBAbWV0aG9kIGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge051bWJlcn0gdHlwZVxuICogQHBhcmFtIHtOdW1iZXJ9IGxpc3RlbmVySURcbiAqIEBwYXJhbSB7TnVtYmVyfSBjYWxsYmFja1xuICovXG5jYy5FdmVudExpc3RlbmVyID0gZnVuY3Rpb24gKHR5cGUsIGxpc3RlbmVySUQsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fb25FdmVudCA9IGNhbGxiYWNrOyAgIC8vIEV2ZW50IGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgdGhpcy5fdHlwZSA9IHR5cGUgfHwgMDsgICAgIC8vIEV2ZW50IGxpc3RlbmVyIHR5cGVcbiAgICB0aGlzLl9saXN0ZW5lcklEID0gbGlzdGVuZXJJRCB8fCBcIlwiOyAgICAvLyBFdmVudCBsaXN0ZW5lciBJRFxuICAgIHRoaXMuX3JlZ2lzdGVyZWQgPSBmYWxzZTsgICAvLyBXaGV0aGVyIHRoZSBsaXN0ZW5lciBoYXMgYmVlbiBhZGRlZCB0byBkaXNwYXRjaGVyLlxuXG4gICAgdGhpcy5fZml4ZWRQcmlvcml0eSA9IDA7ICAgIC8vIFRoZSBoaWdoZXIgdGhlIG51bWJlciwgdGhlIGhpZ2hlciB0aGUgcHJpb3JpdHksIDAgaXMgZm9yIHNjZW5lIGdyYXBoIGJhc2UgcHJpb3JpdHkuXG4gICAgdGhpcy5fbm9kZSA9IG51bGw7ICAgICAgICAgIC8vIHNjZW5lIGdyYXBoIGJhc2VkIHByaW9yaXR5XG4gICAgdGhpcy5fdGFyZ2V0ID0gbnVsbDtcbiAgICB0aGlzLl9wYXVzZWQgPSB0cnVlOyAgICAgICAgLy8gV2hldGhlciB0aGUgbGlzdGVuZXIgaXMgcGF1c2VkXG4gICAgdGhpcy5faXNFbmFibGVkID0gdHJ1ZTsgICAgIC8vIFdoZXRoZXIgdGhlIGxpc3RlbmVyIGlzIGVuYWJsZWRcbn07XG5cbmNjLkV2ZW50TGlzdGVuZXIucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBjYy5FdmVudExpc3RlbmVyLFxuICAgIC8qXG4gICAgICogPHA+XG4gICAgICogICAgIFNldHMgcGF1c2VkIHN0YXRlIGZvciB0aGUgbGlzdGVuZXJcbiAgICAgKiAgICAgVGhlIHBhdXNlZCBzdGF0ZSBpcyBvbmx5IHVzZWQgZm9yIHNjZW5lIGdyYXBoIHByaW9yaXR5IGxpc3RlbmVycy5cbiAgICAgKiAgICAgYEV2ZW50RGlzcGF0Y2hlcjo6cmVzdW1lQWxsRXZlbnRMaXN0ZW5lcnNGb3JUYXJnZXQobm9kZSlgIHdpbGwgc2V0IHRoZSBwYXVzZWQgc3RhdGUgdG8gYHRydWVgLFxuICAgICAqICAgICB3aGlsZSBgRXZlbnREaXNwYXRjaGVyOjpwYXVzZUFsbEV2ZW50TGlzdGVuZXJzRm9yVGFyZ2V0KG5vZGUpYCB3aWxsIHNldCBpdCB0byBgZmFsc2VgLlxuICAgICAqICAgICBAbm90ZSAxKSBGaXhlZCBwcmlvcml0eSBsaXN0ZW5lcnMgd2lsbCBuZXZlciBnZXQgcGF1c2VkLiBJZiBhIGZpeGVkIHByaW9yaXR5IGRvZXNuJ3Qgd2FudCB0byByZWNlaXZlIGV2ZW50cyxcbiAgICAgKiAgICAgICAgICAgICAgY2FsbCBgc2V0RW5hYmxlZChmYWxzZSlgIGluc3RlYWQuXG4gICAgICogICAgICAgICAgICAyKSBJbiBgTm9kZWAncyBvbkVudGVyIGFuZCBvbkV4aXQsIHRoZSBgcGF1c2VkIHN0YXRlYCBvZiB0aGUgbGlzdGVuZXJzIHdoaWNoIGFzc29jaWF0ZWQgd2l0aCB0aGF0IG5vZGUgd2lsbCBiZSBhdXRvbWF0aWNhbGx5IHVwZGF0ZWQuXG4gICAgICogPC9wPlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gcGF1c2VkXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0UGF1c2VkOiBmdW5jdGlvbiAocGF1c2VkKSB7XG4gICAgICAgIHRoaXMuX3BhdXNlZCA9IHBhdXNlZDtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBDaGVja3Mgd2hldGhlciB0aGUgbGlzdGVuZXIgaXMgcGF1c2VkLlxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2lzUGF1c2VkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXVzZWQ7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogTWFya3MgdGhlIGxpc3RlbmVyIHdhcyByZWdpc3RlcmVkIGJ5IEV2ZW50RGlzcGF0Y2hlci5cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHJlZ2lzdGVyZWRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRSZWdpc3RlcmVkOiBmdW5jdGlvbiAocmVnaXN0ZXJlZCkge1xuICAgICAgICB0aGlzLl9yZWdpc3RlcmVkID0gcmVnaXN0ZXJlZDtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBDaGVja3Mgd2hldGhlciB0aGUgbGlzdGVuZXIgd2FzIHJlZ2lzdGVyZWQgYnkgRXZlbnREaXNwYXRjaGVyXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaXNSZWdpc3RlcmVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWdpc3RlcmVkO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEdldHMgdGhlIHR5cGUgb2YgdGhpcyBsaXN0ZW5lclxuICAgICAqIEBub3RlIEl0J3MgZGlmZmVyZW50IGZyb20gYEV2ZW50VHlwZWAsIGUuZy4gVG91Y2hFdmVudCBoYXMgdHdvIGtpbmRzIG9mIGV2ZW50IGxpc3RlbmVycyAtIEV2ZW50TGlzdGVuZXJPbmVCeU9uZSwgRXZlbnRMaXN0ZW5lckFsbEF0T25jZVxuICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0VHlwZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiAgR2V0cyB0aGUgbGlzdGVuZXIgSUQgb2YgdGhpcyBsaXN0ZW5lclxuICAgICAqICBXaGVuIGV2ZW50IGlzIGJlaW5nIGRpc3BhdGNoZWQsIGxpc3RlbmVyIElEIGlzIHVzZWQgYXMga2V5IGZvciBzZWFyY2hpbmcgbGlzdGVuZXJzIGFjY29yZGluZyB0byBldmVudCB0eXBlLlxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0TGlzdGVuZXJJRDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdGVuZXJJRDtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBTZXRzIHRoZSBmaXhlZCBwcmlvcml0eSBmb3IgdGhpcyBsaXN0ZW5lclxuICAgICAqICBAbm90ZSBUaGlzIG1ldGhvZCBpcyBvbmx5IHVzZWQgZm9yIGBmaXhlZCBwcmlvcml0eSBsaXN0ZW5lcnNgLCBpdCBuZWVkcyB0byBhY2Nlc3MgYSBub24temVybyB2YWx1ZS4gMCBpcyByZXNlcnZlZCBmb3Igc2NlbmUgZ3JhcGggcHJpb3JpdHkgbGlzdGVuZXJzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGZpeGVkUHJpb3JpdHlcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRGaXhlZFByaW9yaXR5OiBmdW5jdGlvbiAoZml4ZWRQcmlvcml0eSkge1xuICAgICAgICB0aGlzLl9maXhlZFByaW9yaXR5ID0gZml4ZWRQcmlvcml0eTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBHZXRzIHRoZSBmaXhlZCBwcmlvcml0eSBvZiB0aGlzIGxpc3RlbmVyXG4gICAgICogQHJldHVybnMge051bWJlcn0gMCBpZiBpdCdzIGEgc2NlbmUgZ3JhcGggcHJpb3JpdHkgbGlzdGVuZXIsIG5vbi16ZXJvIGZvciBmaXhlZCBwcmlvcml0eSBsaXN0ZW5lclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2dldEZpeGVkUHJpb3JpdHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpeGVkUHJpb3JpdHk7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogU2V0cyBzY2VuZSBncmFwaCBwcmlvcml0eSBmb3IgdGhpcyBsaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7Y2MuTm9kZX0gbm9kZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldFNjZW5lR3JhcGhQcmlvcml0eTogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgdGhpcy5fdGFyZ2V0ID0gbm9kZTtcbiAgICAgICAgdGhpcy5fbm9kZSA9IG5vZGU7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogR2V0cyBzY2VuZSBncmFwaCBwcmlvcml0eSBvZiB0aGlzIGxpc3RlbmVyXG4gICAgICogQHJldHVybnMge2NjLk5vZGV9IGlmIGl0J3MgYSBmaXhlZCBwcmlvcml0eSBsaXN0ZW5lciwgbm9uLW51bGwgZm9yIHNjZW5lIGdyYXBoIHByaW9yaXR5IGxpc3RlbmVyXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0U2NlbmVHcmFwaFByaW9yaXR5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ub2RlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENoZWNrcyB3aGV0aGVyIHRoZSBsaXN0ZW5lciBpcyBhdmFpbGFibGUuXG4gICAgICogISN6aCDmo4DmtYvnm5HlkKzlmajmmK/lkKbmnInmlYhcbiAgICAgKiBAbWV0aG9kIGNoZWNrQXZhaWxhYmxlXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICovXG4gICAgY2hlY2tBdmFpbGFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uRXZlbnQgIT09IG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2xvbmVzIHRoZSBsaXN0ZW5lciwgaXRzIHN1YmNsYXNzZXMgaGF2ZSB0byBvdmVycmlkZSB0aGlzIG1ldGhvZC5cbiAgICAgKiAhI3poIOWFi+mahuebkeWQrOWZqCzlroPnmoTlrZDnsbvlv4Xpobvph43lhpnmraTmlrnms5XjgIJcbiAgICAgKiBAbWV0aG9kIGNsb25lXG4gICAgICogQHJldHVybnMge0V2ZW50TGlzdGVuZXJ9XG4gICAgICovXG4gICAgY2xvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICAhI2VuIEVuYWJsZXMgb3IgZGlzYWJsZXMgdGhlIGxpc3RlbmVyXG4gICAgICogICEjemgg5ZCv55So5oiW56aB55So55uR5ZCs5Zmo44CCXG4gICAgICogIEBtZXRob2Qgc2V0RW5hYmxlZFxuICAgICAqICBAcGFyYW0ge0Jvb2xlYW59IGVuYWJsZWRcbiAgICAgKiAgQG5vdGUgT25seSBsaXN0ZW5lcnMgd2l0aCBgZW5hYmxlZGAgc3RhdGUgd2lsbCBiZSBhYmxlIHRvIHJlY2VpdmUgZXZlbnRzLlxuICAgICAqICAgICAgICAgIFdoZW4gYW4gbGlzdGVuZXIgd2FzIGluaXRpYWxpemVkLCBpdCdzIGVuYWJsZWQgYnkgZGVmYXVsdC5cbiAgICAgKiAgICAgICAgICBBbiBldmVudCBsaXN0ZW5lciBjYW4gcmVjZWl2ZSBldmVudHMgd2hlbiBpdCBpcyBlbmFibGVkIGFuZCBpcyBub3QgcGF1c2VkLlxuICAgICAqICAgICAgICAgIHBhdXNlZCBzdGF0ZSBpcyBhbHdheXMgZmFsc2Ugd2hlbiBpdCBpcyBhIGZpeGVkIHByaW9yaXR5IGxpc3RlbmVyLlxuICAgICAqL1xuICAgIHNldEVuYWJsZWQ6IGZ1bmN0aW9uKGVuYWJsZWQpe1xuICAgICAgICB0aGlzLl9pc0VuYWJsZWQgPSBlbmFibGVkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENoZWNrcyB3aGV0aGVyIHRoZSBsaXN0ZW5lciBpcyBlbmFibGVkXG4gICAgICogISN6aCDmo4Dmn6Xnm5HlkKzlmajmmK/lkKblj6/nlKjjgIJcbiAgICAgKiBAbWV0aG9kIGlzRW5hYmxlZFxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgICAqL1xuICAgIGlzRW5hYmxlZDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzRW5hYmxlZDtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiA8cD5DdXJyZW50bHkgSmF2YVNjcmlwdCBCaW5kaW5ncyAoSlNCKSwgaW4gc29tZSBjYXNlcywgbmVlZHMgdG8gdXNlIHJldGFpbiBhbmQgcmVsZWFzZS4gVGhpcyBpcyBhIGJ1ZyBpbiBKU0IsXG4gICAgICogYW5kIHRoZSB1Z2x5IHdvcmthcm91bmQgaXMgdG8gdXNlIHJldGFpbi9yZWxlYXNlLiBTbywgdGhlc2UgMiBtZXRob2RzIHdlcmUgYWRkZWQgdG8gYmUgY29tcGF0aWJsZSB3aXRoIEpTQi5cbiAgICAgKiBUaGlzIGlzIGEgaGFjaywgYW5kIHNob3VsZCBiZSByZW1vdmVkIG9uY2UgSlNCIGZpeGVzIHRoZSByZXRhaW4vcmVsZWFzZSBidWc8YnIvPlxuICAgICAqIFlvdSB3aWxsIG5lZWQgdG8gcmV0YWluIGFuIG9iamVjdCBpZiB5b3UgY3JlYXRlZCBhIGxpc3RlbmVyIGFuZCBoYXZlbid0IGFkZGVkIGl0IGFueSB0YXJnZXQgbm9kZSBkdXJpbmcgdGhlIHNhbWUgZnJhbWUuPGJyLz5cbiAgICAgKiBPdGhlcndpc2UsIEpTQidzIG5hdGl2ZSBhdXRvcmVsZWFzZSBwb29sIHdpbGwgY29uc2lkZXIgdGhpcyBvYmplY3QgYSB1c2VsZXNzIG9uZSBhbmQgcmVsZWFzZSBpdCBkaXJlY3RseSw8YnIvPlxuICAgICAqIHdoZW4geW91IHdhbnQgdG8gdXNlIGl0IGxhdGVyLCBhIFwiSW52YWxpZCBOYXRpdmUgT2JqZWN0XCIgZXJyb3Igd2lsbCBiZSByYWlzZWQuPGJyLz5cbiAgICAgKiBUaGUgcmV0YWluIGZ1bmN0aW9uIGNhbiBpbmNyZWFzZSBhIHJlZmVyZW5jZSBjb3VudCBmb3IgdGhlIG5hdGl2ZSBvYmplY3QgdG8gYXZvaWQgaXQgYmVpbmcgcmVsZWFzZWQsPGJyLz5cbiAgICAgKiB5b3UgbmVlZCB0byBtYW51YWxseSBpbnZva2UgcmVsZWFzZSBmdW5jdGlvbiB3aGVuIHlvdSB0aGluayB0aGlzIG9iamVjdCBpcyBubyBsb25nZXIgbmVlZGVkLCBvdGhlcndpc2UsIHRoZXJlIHdpbGwgYmUgbWVtb3J5IGxlYXJrcy48YnIvPlxuICAgICAqIHJldGFpbiBhbmQgcmVsZWFzZSBmdW5jdGlvbiBjYWxsIHNob3VsZCBiZSBwYWlyZWQgaW4gZGV2ZWxvcGVyJ3MgZ2FtZSBjb2RlLjwvcD5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmV0YWluXG4gICAgICogQHNlZSBjYy5FdmVudExpc3RlbmVyI3JlbGVhc2VcbiAgICAgKi9cbiAgICByZXRhaW46ZnVuY3Rpb24gKCkge1xuICAgIH0sXG4gICAgLypcbiAgICAgKiA8cD5DdXJyZW50bHkgSmF2YVNjcmlwdCBCaW5kaW5ncyAoSlNCKSwgaW4gc29tZSBjYXNlcywgbmVlZHMgdG8gdXNlIHJldGFpbiBhbmQgcmVsZWFzZS4gVGhpcyBpcyBhIGJ1ZyBpbiBKU0IsXG4gICAgICogYW5kIHRoZSB1Z2x5IHdvcmthcm91bmQgaXMgdG8gdXNlIHJldGFpbi9yZWxlYXNlLiBTbywgdGhlc2UgMiBtZXRob2RzIHdlcmUgYWRkZWQgdG8gYmUgY29tcGF0aWJsZSB3aXRoIEpTQi5cbiAgICAgKiBUaGlzIGlzIGEgaGFjaywgYW5kIHNob3VsZCBiZSByZW1vdmVkIG9uY2UgSlNCIGZpeGVzIHRoZSByZXRhaW4vcmVsZWFzZSBidWc8YnIvPlxuICAgICAqIFlvdSB3aWxsIG5lZWQgdG8gcmV0YWluIGFuIG9iamVjdCBpZiB5b3UgY3JlYXRlZCBhIGxpc3RlbmVyIGFuZCBoYXZlbid0IGFkZGVkIGl0IGFueSB0YXJnZXQgbm9kZSBkdXJpbmcgdGhlIHNhbWUgZnJhbWUuPGJyLz5cbiAgICAgKiBPdGhlcndpc2UsIEpTQidzIG5hdGl2ZSBhdXRvcmVsZWFzZSBwb29sIHdpbGwgY29uc2lkZXIgdGhpcyBvYmplY3QgYSB1c2VsZXNzIG9uZSBhbmQgcmVsZWFzZSBpdCBkaXJlY3RseSw8YnIvPlxuICAgICAqIHdoZW4geW91IHdhbnQgdG8gdXNlIGl0IGxhdGVyLCBhIFwiSW52YWxpZCBOYXRpdmUgT2JqZWN0XCIgZXJyb3Igd2lsbCBiZSByYWlzZWQuPGJyLz5cbiAgICAgKiBUaGUgcmV0YWluIGZ1bmN0aW9uIGNhbiBpbmNyZWFzZSBhIHJlZmVyZW5jZSBjb3VudCBmb3IgdGhlIG5hdGl2ZSBvYmplY3QgdG8gYXZvaWQgaXQgYmVpbmcgcmVsZWFzZWQsPGJyLz5cbiAgICAgKiB5b3UgbmVlZCB0byBtYW51YWxseSBpbnZva2UgcmVsZWFzZSBmdW5jdGlvbiB3aGVuIHlvdSB0aGluayB0aGlzIG9iamVjdCBpcyBubyBsb25nZXIgbmVlZGVkLCBvdGhlcndpc2UsIHRoZXJlIHdpbGwgYmUgbWVtb3J5IGxlYXJrcy48YnIvPlxuICAgICAqIHJldGFpbiBhbmQgcmVsZWFzZSBmdW5jdGlvbiBjYWxsIHNob3VsZCBiZSBwYWlyZWQgaW4gZGV2ZWxvcGVyJ3MgZ2FtZSBjb2RlLjwvcD5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmVsZWFzZVxuICAgICAqIEBzZWUgY2MuRXZlbnRMaXN0ZW5lciNyZXRhaW5cbiAgICAgKi9cbiAgICByZWxlYXNlOmZ1bmN0aW9uICgpIHtcbiAgICB9XG59O1xuXG4vLyBldmVudCBsaXN0ZW5lciB0eXBlXG4vKipcbiAqICEjZW4gVGhlIHR5cGUgY29kZSBvZiB1bmtub3duIGV2ZW50IGxpc3RlbmVyLlxuICogISN6aCDmnKrnn6XnmoTkuovku7bnm5HlkKzlmajnsbvlnotcbiAqIEBwcm9wZXJ0eSBVTktOT1dOXG4gKiBAdHlwZSB7TnVtYmVyfVxuICogQHN0YXRpY1xuICovXG5jYy5FdmVudExpc3RlbmVyLlVOS05PV04gPSAwO1xuLypcbiAqICEjZW4gVGhlIHR5cGUgY29kZSBvZiBvbmUgYnkgb25lIHRvdWNoIGV2ZW50IGxpc3RlbmVyLlxuICogISN6aCDop6bmkbjkuovku7bnm5HlkKzlmajnsbvlnovvvIzop6bngrnkvJrkuIDkuKrkuIDkuKrlvpfliIblvIDooqvmtL7lj5FcbiAqIEBwcm9wZXJ0eSBUT1VDSF9PTkVfQllfT05FXG4gKiBAdHlwZSB7TnVtYmVyfVxuICogQHN0YXRpY1xuICovXG5jYy5FdmVudExpc3RlbmVyLlRPVUNIX09ORV9CWV9PTkUgPSAxO1xuLypcbiAqICEjZW4gVGhlIHR5cGUgY29kZSBvZiBhbGwgYXQgb25jZSB0b3VjaCBldmVudCBsaXN0ZW5lci5cbiAqICEjemgg6Kem5pG45LqL5Lu255uR5ZCs5Zmo57G75Z6L77yM6Kem54K55Lya6KKr5LiA5qyh5oCn5YWo6YOo5rS+5Y+RXG4gKiBAcHJvcGVydHkgVE9VQ0hfQUxMX0FUX09OQ0VcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKiBAc3RhdGljXG4gKi9cbmNjLkV2ZW50TGlzdGVuZXIuVE9VQ0hfQUxMX0FUX09OQ0UgPSAyO1xuLyoqXG4gKiAhI2VuIFRoZSB0eXBlIGNvZGUgb2Yga2V5Ym9hcmQgZXZlbnQgbGlzdGVuZXIuXG4gKiAhI3poIOmUruebmOS6i+S7tuebkeWQrOWZqOexu+Wei1xuICogQHByb3BlcnR5IEtFWUJPQVJEXG4gKiBAdHlwZSB7TnVtYmVyfVxuICogQHN0YXRpY1xuICovXG5jYy5FdmVudExpc3RlbmVyLktFWUJPQVJEID0gMztcbi8qXG4gKiAhI2VuIFRoZSB0eXBlIGNvZGUgb2YgbW91c2UgZXZlbnQgbGlzdGVuZXIuXG4gKiAhI3poIOm8oOagh+S6i+S7tuebkeWQrOWZqOexu+Wei1xuICogQHByb3BlcnR5IE1PVVNFXG4gKiBAdHlwZSB7TnVtYmVyfVxuICogQHN0YXRpY1xuICovXG5jYy5FdmVudExpc3RlbmVyLk1PVVNFID0gNDtcbi8qKlxuICogISNlbiBUaGUgdHlwZSBjb2RlIG9mIGFjY2VsZXJhdGlvbiBldmVudCBsaXN0ZW5lci5cbiAqICEjemgg5Yqg6YCf5Zmo5LqL5Lu255uR5ZCs5Zmo57G75Z6LXG4gKiBAcHJvcGVydHkgQUNDRUxFUkFUSU9OXG4gKiBAdHlwZSB7TnVtYmVyfVxuICogQHN0YXRpY1xuICovXG5jYy5FdmVudExpc3RlbmVyLkFDQ0VMRVJBVElPTiA9IDY7XG4vKlxuICogISNlbiBUaGUgdHlwZSBjb2RlIG9mIGN1c3RvbSBldmVudCBsaXN0ZW5lci5cbiAqICEjemgg6Ieq5a6a5LmJ5LqL5Lu255uR5ZCs5Zmo57G75Z6LXG4gKiBAcHJvcGVydHkgQ1VTVE9NXG4gKiBAdHlwZSB7TnVtYmVyfVxuICogQHN0YXRpY1xuICovXG5jYy5FdmVudExpc3RlbmVyLkNVU1RPTSA9IDg7XG5cbnZhciBMaXN0ZW5lcklEID0gY2MuRXZlbnRMaXN0ZW5lci5MaXN0ZW5lcklEID0ge1xuICAgIE1PVVNFOiAnX19jY19tb3VzZScsXG4gICAgVE9VQ0hfT05FX0JZX09ORTogJ19fY2NfdG91Y2hfb25lX2J5X29uZScsXG4gICAgVE9VQ0hfQUxMX0FUX09OQ0U6ICdfX2NjX3RvdWNoX2FsbF9hdF9vbmNlJyxcbiAgICBLRVlCT0FSRDogJ19fY2Nfa2V5Ym9hcmQnLFxuICAgIEFDQ0VMRVJBVElPTjogJ19fY2NfYWNjZWxlcmF0aW9uJyxcbn07XG5cbnZhciBDdXN0b20gPSBmdW5jdGlvbiAobGlzdGVuZXJJZCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLl9vbkN1c3RvbUV2ZW50ID0gY2FsbGJhY2s7XG4gICAgY2MuRXZlbnRMaXN0ZW5lci5jYWxsKHRoaXMsIGNjLkV2ZW50TGlzdGVuZXIuQ1VTVE9NLCBsaXN0ZW5lcklkLCB0aGlzLl9jYWxsYmFjayk7XG59O1xuanMuZXh0ZW5kKEN1c3RvbSwgY2MuRXZlbnRMaXN0ZW5lcik7XG5qcy5taXhpbihDdXN0b20ucHJvdG90eXBlLCB7XG4gICAgX29uQ3VzdG9tRXZlbnQ6IG51bGwsXG4gICAgXG4gICAgX2NhbGxiYWNrOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuX29uQ3VzdG9tRXZlbnQgIT09IG51bGwpXG4gICAgICAgICAgICB0aGlzLl9vbkN1c3RvbUV2ZW50KGV2ZW50KTtcbiAgICB9LFxuXG4gICAgY2hlY2tBdmFpbGFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIChjYy5FdmVudExpc3RlbmVyLnByb3RvdHlwZS5jaGVja0F2YWlsYWJsZS5jYWxsKHRoaXMpICYmIHRoaXMuX29uQ3VzdG9tRXZlbnQgIT09IG51bGwpO1xuICAgIH0sXG5cbiAgICBjbG9uZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IEN1c3RvbSh0aGlzLl9saXN0ZW5lcklELCB0aGlzLl9vbkN1c3RvbUV2ZW50KTtcbiAgICB9XG59KTtcblxudmFyIE1vdXNlID0gZnVuY3Rpb24gKCkge1xuICAgIGNjLkV2ZW50TGlzdGVuZXIuY2FsbCh0aGlzLCBjYy5FdmVudExpc3RlbmVyLk1PVVNFLCBMaXN0ZW5lcklELk1PVVNFLCB0aGlzLl9jYWxsYmFjayk7XG59O1xuanMuZXh0ZW5kKE1vdXNlLCBjYy5FdmVudExpc3RlbmVyKTtcbmpzLm1peGluKE1vdXNlLnByb3RvdHlwZSwge1xuICAgIG9uTW91c2VEb3duOiBudWxsLFxuICAgIG9uTW91c2VVcDogbnVsbCxcbiAgICBvbk1vdXNlTW92ZTogbnVsbCxcbiAgICBvbk1vdXNlU2Nyb2xsOiBudWxsLFxuXG4gICAgX2NhbGxiYWNrOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIGV2ZW50VHlwZSA9IGNjLkV2ZW50LkV2ZW50TW91c2U7XG4gICAgICAgIHN3aXRjaCAoZXZlbnQuX2V2ZW50VHlwZSkge1xuICAgICAgICAgICAgY2FzZSBldmVudFR5cGUuRE9XTjpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vbk1vdXNlRG93bilcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk1vdXNlRG93bihldmVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGV2ZW50VHlwZS5VUDpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vbk1vdXNlVXApXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Nb3VzZVVwKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgZXZlbnRUeXBlLk1PVkU6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub25Nb3VzZU1vdmUpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZXZlbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBldmVudFR5cGUuU0NST0xMOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9uTW91c2VTY3JvbGwpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Nb3VzZVNjcm9sbChldmVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNsb25lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBldmVudExpc3RlbmVyID0gbmV3IE1vdXNlKCk7XG4gICAgICAgIGV2ZW50TGlzdGVuZXIub25Nb3VzZURvd24gPSB0aGlzLm9uTW91c2VEb3duO1xuICAgICAgICBldmVudExpc3RlbmVyLm9uTW91c2VVcCA9IHRoaXMub25Nb3VzZVVwO1xuICAgICAgICBldmVudExpc3RlbmVyLm9uTW91c2VNb3ZlID0gdGhpcy5vbk1vdXNlTW92ZTtcbiAgICAgICAgZXZlbnRMaXN0ZW5lci5vbk1vdXNlU2Nyb2xsID0gdGhpcy5vbk1vdXNlU2Nyb2xsO1xuICAgICAgICByZXR1cm4gZXZlbnRMaXN0ZW5lcjtcbiAgICB9LFxuXG4gICAgY2hlY2tBdmFpbGFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufSk7XG5cbnZhciBUb3VjaE9uZUJ5T25lID0gZnVuY3Rpb24gKCkge1xuICAgIGNjLkV2ZW50TGlzdGVuZXIuY2FsbCh0aGlzLCBjYy5FdmVudExpc3RlbmVyLlRPVUNIX09ORV9CWV9PTkUsIExpc3RlbmVySUQuVE9VQ0hfT05FX0JZX09ORSwgbnVsbCk7XG4gICAgdGhpcy5fY2xhaW1lZFRvdWNoZXMgPSBbXTtcbn07XG5qcy5leHRlbmQoVG91Y2hPbmVCeU9uZSwgY2MuRXZlbnRMaXN0ZW5lcik7XG5qcy5taXhpbihUb3VjaE9uZUJ5T25lLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiBUb3VjaE9uZUJ5T25lLFxuICAgIF9jbGFpbWVkVG91Y2hlczogbnVsbCxcbiAgICBzd2FsbG93VG91Y2hlczogZmFsc2UsXG4gICAgb25Ub3VjaEJlZ2FuOiBudWxsLFxuICAgIG9uVG91Y2hNb3ZlZDogbnVsbCxcbiAgICBvblRvdWNoRW5kZWQ6IG51bGwsXG4gICAgb25Ub3VjaENhbmNlbGxlZDogbnVsbCxcblxuICAgIHNldFN3YWxsb3dUb3VjaGVzOiBmdW5jdGlvbiAobmVlZFN3YWxsb3cpIHtcbiAgICAgICAgdGhpcy5zd2FsbG93VG91Y2hlcyA9IG5lZWRTd2FsbG93O1xuICAgIH0sXG5cbiAgICBpc1N3YWxsb3dUb3VjaGVzOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5zd2FsbG93VG91Y2hlcztcbiAgICB9LFxuXG4gICAgY2xvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGV2ZW50TGlzdGVuZXIgPSBuZXcgVG91Y2hPbmVCeU9uZSgpO1xuICAgICAgICBldmVudExpc3RlbmVyLm9uVG91Y2hCZWdhbiA9IHRoaXMub25Ub3VjaEJlZ2FuO1xuICAgICAgICBldmVudExpc3RlbmVyLm9uVG91Y2hNb3ZlZCA9IHRoaXMub25Ub3VjaE1vdmVkO1xuICAgICAgICBldmVudExpc3RlbmVyLm9uVG91Y2hFbmRlZCA9IHRoaXMub25Ub3VjaEVuZGVkO1xuICAgICAgICBldmVudExpc3RlbmVyLm9uVG91Y2hDYW5jZWxsZWQgPSB0aGlzLm9uVG91Y2hDYW5jZWxsZWQ7XG4gICAgICAgIGV2ZW50TGlzdGVuZXIuc3dhbGxvd1RvdWNoZXMgPSB0aGlzLnN3YWxsb3dUb3VjaGVzO1xuICAgICAgICByZXR1cm4gZXZlbnRMaXN0ZW5lcjtcbiAgICB9LFxuXG4gICAgY2hlY2tBdmFpbGFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYoIXRoaXMub25Ub3VjaEJlZ2FuKXtcbiAgICAgICAgICAgIGNjLmxvZ0lEKDE4MDEpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn0pO1xuXG52YXIgVG91Y2hBbGxBdE9uY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgY2MuRXZlbnRMaXN0ZW5lci5jYWxsKHRoaXMsIGNjLkV2ZW50TGlzdGVuZXIuVE9VQ0hfQUxMX0FUX09OQ0UsIExpc3RlbmVySUQuVE9VQ0hfQUxMX0FUX09OQ0UsIG51bGwpO1xufTtcbmpzLmV4dGVuZChUb3VjaEFsbEF0T25jZSwgY2MuRXZlbnRMaXN0ZW5lcik7XG5qcy5taXhpbihUb3VjaEFsbEF0T25jZS5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3RvcjogVG91Y2hBbGxBdE9uY2UsXG4gICAgb25Ub3VjaGVzQmVnYW46IG51bGwsXG4gICAgb25Ub3VjaGVzTW92ZWQ6IG51bGwsXG4gICAgb25Ub3VjaGVzRW5kZWQ6IG51bGwsXG4gICAgb25Ub3VjaGVzQ2FuY2VsbGVkOiBudWxsLFxuXG4gICAgY2xvbmU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBldmVudExpc3RlbmVyID0gbmV3IFRvdWNoQWxsQXRPbmNlKCk7XG4gICAgICAgIGV2ZW50TGlzdGVuZXIub25Ub3VjaGVzQmVnYW4gPSB0aGlzLm9uVG91Y2hlc0JlZ2FuO1xuICAgICAgICBldmVudExpc3RlbmVyLm9uVG91Y2hlc01vdmVkID0gdGhpcy5vblRvdWNoZXNNb3ZlZDtcbiAgICAgICAgZXZlbnRMaXN0ZW5lci5vblRvdWNoZXNFbmRlZCA9IHRoaXMub25Ub3VjaGVzRW5kZWQ7XG4gICAgICAgIGV2ZW50TGlzdGVuZXIub25Ub3VjaGVzQ2FuY2VsbGVkID0gdGhpcy5vblRvdWNoZXNDYW5jZWxsZWQ7XG4gICAgICAgIHJldHVybiBldmVudExpc3RlbmVyO1xuICAgIH0sXG5cbiAgICBjaGVja0F2YWlsYWJsZTogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKHRoaXMub25Ub3VjaGVzQmVnYW4gPT09IG51bGwgJiYgdGhpcy5vblRvdWNoZXNNb3ZlZCA9PT0gbnVsbFxuICAgICAgICAgICAgJiYgdGhpcy5vblRvdWNoZXNFbmRlZCA9PT0gbnVsbCAmJiB0aGlzLm9uVG91Y2hlc0NhbmNlbGxlZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgY2MubG9nSUQoMTgwMik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufSk7XG5cbi8vQWNjZWxlcmF0aW9uXG52YXIgQWNjZWxlcmF0aW9uID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fb25BY2NlbGVyYXRpb25FdmVudCA9IGNhbGxiYWNrO1xuICAgIGNjLkV2ZW50TGlzdGVuZXIuY2FsbCh0aGlzLCBjYy5FdmVudExpc3RlbmVyLkFDQ0VMRVJBVElPTiwgTGlzdGVuZXJJRC5BQ0NFTEVSQVRJT04sIHRoaXMuX2NhbGxiYWNrKTtcbn07XG5qcy5leHRlbmQoQWNjZWxlcmF0aW9uLCBjYy5FdmVudExpc3RlbmVyKTtcbmpzLm1peGluKEFjY2VsZXJhdGlvbi5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3RvcjogQWNjZWxlcmF0aW9uLFxuICAgIF9vbkFjY2VsZXJhdGlvbkV2ZW50OiBudWxsLFxuXG4gICAgX2NhbGxiYWNrOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5fb25BY2NlbGVyYXRpb25FdmVudChldmVudC5hY2MsIGV2ZW50KTtcbiAgICB9LFxuXG4gICAgY2hlY2tBdmFpbGFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuYXNzZXJ0SUQodGhpcy5fb25BY2NlbGVyYXRpb25FdmVudCwgMTgwMyk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIGNsb25lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgQWNjZWxlcmF0aW9uKHRoaXMuX29uQWNjZWxlcmF0aW9uRXZlbnQpO1xuICAgIH1cbn0pO1xuXG5cbi8vS2V5Ym9hcmRcbnZhciBLZXlib2FyZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjYy5FdmVudExpc3RlbmVyLmNhbGwodGhpcywgY2MuRXZlbnRMaXN0ZW5lci5LRVlCT0FSRCwgTGlzdGVuZXJJRC5LRVlCT0FSRCwgdGhpcy5fY2FsbGJhY2spO1xufTtcbmpzLmV4dGVuZChLZXlib2FyZCwgY2MuRXZlbnRMaXN0ZW5lcik7XG5qcy5taXhpbihLZXlib2FyZC5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3RvcjogS2V5Ym9hcmQsXG4gICAgb25LZXlQcmVzc2VkOiBudWxsLFxuICAgIG9uS2V5UmVsZWFzZWQ6IG51bGwsXG5cbiAgICBfY2FsbGJhY2s6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQuaXNQcmVzc2VkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vbktleVByZXNzZWQpXG4gICAgICAgICAgICAgICAgdGhpcy5vbktleVByZXNzZWQoZXZlbnQua2V5Q29kZSwgZXZlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMub25LZXlSZWxlYXNlZClcbiAgICAgICAgICAgICAgICB0aGlzLm9uS2V5UmVsZWFzZWQoZXZlbnQua2V5Q29kZSwgZXZlbnQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNsb25lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBldmVudExpc3RlbmVyID0gbmV3IEtleWJvYXJkKCk7XG4gICAgICAgIGV2ZW50TGlzdGVuZXIub25LZXlQcmVzc2VkID0gdGhpcy5vbktleVByZXNzZWQ7XG4gICAgICAgIGV2ZW50TGlzdGVuZXIub25LZXlSZWxlYXNlZCA9IHRoaXMub25LZXlSZWxlYXNlZDtcbiAgICAgICAgcmV0dXJuIGV2ZW50TGlzdGVuZXI7XG4gICAgfSxcblxuICAgIGNoZWNrQXZhaWxhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLm9uS2V5UHJlc3NlZCA9PT0gbnVsbCAmJiB0aGlzLm9uS2V5UmVsZWFzZWQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNjLmxvZ0lEKDE4MDApO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqICEjZW5cbiAqIENyZWF0ZSBhIEV2ZW50TGlzdGVuZXIgb2JqZWN0IHdpdGggY29uZmlndXJhdGlvbiBpbmNsdWRpbmcgdGhlIGV2ZW50IHR5cGUsIGhhbmRsZXJzIGFuZCBvdGhlciBwYXJhbWV0ZXJzLlxuICogSW4gaGFuZGxlcnMsIHRoaXMgcmVmZXIgdG8gdGhlIGV2ZW50IGxpc3RlbmVyIG9iamVjdCBpdHNlbGYuXG4gKiBZb3UgY2FuIGFsc28gcGFzcyBjdXN0b20gcGFyYW1ldGVycyBpbiB0aGUgY29uZmlndXJhdGlvbiBvYmplY3QsXG4gKiBhbGwgY3VzdG9tIHBhcmFtZXRlcnMgd2lsbCBiZSBwb2x5ZmlsbGVkIGludG8gdGhlIGV2ZW50IGxpc3RlbmVyIG9iamVjdCBhbmQgY2FuIGJlIGFjY2Vzc2VkIGluIGhhbmRsZXJzLlxuICogISN6aCDpgJrov4fmjIflrprkuI3lkIznmoQgRXZlbnQg5a+56LGh5p2l6K6+572u5oOz6KaB5Yib5bu655qE5LqL5Lu255uR5ZCs5Zmo44CCXG4gKiBAbWV0aG9kIGNyZWF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGFyZ09iaiBhIGpzb24gb2JqZWN0XG4gKiBAcmV0dXJucyB7RXZlbnRMaXN0ZW5lcn1cbiAqIEBzdGF0aWNcbiAqIEBleGFtcGxlIHtAbGluayBjb2NvczJkL2NvcmUvZXZlbnQtbWFuYWdlci9DQ0V2ZW50TGlzdGVuZXIvY3JlYXRlLmpzfVxuICovXG5jYy5FdmVudExpc3RlbmVyLmNyZWF0ZSA9IGZ1bmN0aW9uIChhcmdPYmopIHtcbiAgICBjYy5hc3NlcnRJRChhcmdPYmomJmFyZ09iai5ldmVudCwgMTkwMCk7XG5cbiAgICB2YXIgbGlzdGVuZXJUeXBlID0gYXJnT2JqLmV2ZW50O1xuICAgIGRlbGV0ZSBhcmdPYmouZXZlbnQ7XG5cbiAgICB2YXIgbGlzdGVuZXIgPSBudWxsO1xuICAgIGlmKGxpc3RlbmVyVHlwZSA9PT0gY2MuRXZlbnRMaXN0ZW5lci5UT1VDSF9PTkVfQllfT05FKVxuICAgICAgICBsaXN0ZW5lciA9IG5ldyBUb3VjaE9uZUJ5T25lKCk7XG4gICAgZWxzZSBpZihsaXN0ZW5lclR5cGUgPT09IGNjLkV2ZW50TGlzdGVuZXIuVE9VQ0hfQUxMX0FUX09OQ0UpXG4gICAgICAgIGxpc3RlbmVyID0gbmV3IFRvdWNoQWxsQXRPbmNlKCk7XG4gICAgZWxzZSBpZihsaXN0ZW5lclR5cGUgPT09IGNjLkV2ZW50TGlzdGVuZXIuTU9VU0UpXG4gICAgICAgIGxpc3RlbmVyID0gbmV3IE1vdXNlKCk7XG4gICAgZWxzZSBpZihsaXN0ZW5lclR5cGUgPT09IGNjLkV2ZW50TGlzdGVuZXIuQ1VTVE9NKXtcbiAgICAgICAgbGlzdGVuZXIgPSBuZXcgQ3VzdG9tKGFyZ09iai5ldmVudE5hbWUsIGFyZ09iai5jYWxsYmFjayk7XG4gICAgICAgIGRlbGV0ZSBhcmdPYmouZXZlbnROYW1lO1xuICAgICAgICBkZWxldGUgYXJnT2JqLmNhbGxiYWNrO1xuICAgIH0gZWxzZSBpZihsaXN0ZW5lclR5cGUgPT09IGNjLkV2ZW50TGlzdGVuZXIuS0VZQk9BUkQpXG4gICAgICAgIGxpc3RlbmVyID0gbmV3IEtleWJvYXJkKCk7XG4gICAgZWxzZSBpZihsaXN0ZW5lclR5cGUgPT09IGNjLkV2ZW50TGlzdGVuZXIuQUNDRUxFUkFUSU9OKXtcbiAgICAgICAgbGlzdGVuZXIgPSBuZXcgQWNjZWxlcmF0aW9uKGFyZ09iai5jYWxsYmFjayk7XG4gICAgICAgIGRlbGV0ZSBhcmdPYmouY2FsbGJhY2s7XG4gICAgfVxuXG4gICAgZm9yKHZhciBrZXkgaW4gYXJnT2JqKSB7XG4gICAgICAgIGxpc3RlbmVyW2tleV0gPSBhcmdPYmpba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIGxpc3RlbmVyO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjYy5FdmVudExpc3RlbmVyOyJdLCJzb3VyY2VSb290IjoiLyJ9