
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/event-manager/CCEvent.js';
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
var js = cc.js;

require('../event/event');
/**
 * !#en The mouse event
 * !#zh 鼠标事件类型
 * @class Event.EventMouse
 *
 * @extends Event
 * @param {Number} eventType - The mouse event type, UP, DOWN, MOVE, CANCELED
 * @param {Boolean} [bubbles=false] - A boolean indicating whether the event bubbles up through the tree or not
 */


var EventMouse = function EventMouse(eventType, bubbles) {
  cc.Event.call(this, cc.Event.MOUSE, bubbles);
  this._eventType = eventType;
  this._button = 0;
  this._x = 0;
  this._y = 0;
  this._prevX = 0;
  this._prevY = 0;
  this._scrollX = 0;
  this._scrollY = 0;
};

js.extend(EventMouse, cc.Event);
var proto = EventMouse.prototype;
/**
 * !#en Sets scroll data.
 * !#zh 设置鼠标的滚动数据。
 * @method setScrollData
 * @param {Number} scrollX
 * @param {Number} scrollY
 */

proto.setScrollData = function (scrollX, scrollY) {
  this._scrollX = scrollX;
  this._scrollY = scrollY;
};
/**
 * !#en Returns the x axis scroll value.
 * !#zh 获取鼠标滚动的X轴距离，只有滚动时才有效。
 * @method getScrollX
 * @returns {Number}
 */


proto.getScrollX = function () {
  return this._scrollX;
};
/**
 * !#en Returns the y axis scroll value.
 * !#zh 获取滚轮滚动的 Y 轴距离，只有滚动时才有效。
 * @method getScrollY
 * @returns {Number}
 */


proto.getScrollY = function () {
  return this._scrollY;
};
/**
 * !#en Sets cursor location.
 * !#zh 设置当前鼠标位置。
 * @method setLocation
 * @param {Number} x
 * @param {Number} y
 */


proto.setLocation = function (x, y) {
  this._x = x;
  this._y = y;
};
/**
 * !#en Returns cursor location.
 * !#zh 获取鼠标位置对象，对象包含 x 和 y 属性。
 * @method getLocation
 * @return {Vec2} location
 */


proto.getLocation = function () {
  return cc.v2(this._x, this._y);
};
/**
 * !#en Returns the current cursor location in screen coordinates.
 * !#zh 获取当前事件在游戏窗口内的坐标位置对象，对象包含 x 和 y 属性。
 * @method getLocationInView
 * @return {Vec2}
 */


proto.getLocationInView = function () {
  return cc.v2(this._x, cc.view._designResolutionSize.height - this._y);
};

proto._setPrevCursor = function (x, y) {
  this._prevX = x;
  this._prevY = y;
};
/**
 * !#en Returns the previous touch location.
 * !#zh 获取鼠标点击在上一次事件时的位置对象，对象包含 x 和 y 属性。
 * @method getPreviousLocation
 * @return {Vec2}
 */


proto.getPreviousLocation = function () {
  return cc.v2(this._prevX, this._prevY);
};
/**
 * !#en Returns the delta distance from the previous location to current location.
 * !#zh 获取鼠标距离上一次事件移动的距离对象，对象包含 x 和 y 属性。
 * @method getDelta
 * @return {Vec2}
 */


proto.getDelta = function () {
  return cc.v2(this._x - this._prevX, this._y - this._prevY);
};
/**
 * !#en Returns the X axis delta distance from the previous location to current location.
 * !#zh 获取鼠标距离上一次事件移动的 X 轴距离。
 * @method getDeltaX
 * @return {Number}
 */


proto.getDeltaX = function () {
  return this._x - this._prevX;
};
/**
 * !#en Returns the Y axis delta distance from the previous location to current location.
 * !#zh 获取鼠标距离上一次事件移动的 Y 轴距离。
 * @method getDeltaY
 * @return {Number}
 */


proto.getDeltaY = function () {
  return this._y - this._prevY;
};
/**
 * !#en Sets mouse button.
 * !#zh 设置鼠标按键。
 * @method setButton
 * @param {Number} button
 */


proto.setButton = function (button) {
  this._button = button;
};
/**
 * !#en Returns mouse button.
 * !#zh 获取鼠标按键。
 * @method getButton
 * @returns {Number}
 */


proto.getButton = function () {
  return this._button;
};
/**
 * !#en Returns location X axis data.
 * !#zh 获取鼠标当前位置 X 轴。
 * @method getLocationX
 * @returns {Number}
 */


proto.getLocationX = function () {
  return this._x;
};
/**
 * !#en Returns location Y axis data.
 * !#zh 获取鼠标当前位置 Y 轴。
 * @method getLocationY
 * @returns {Number}
 */


proto.getLocationY = function () {
  return this._y;
}; //Inner event types of MouseEvent

/**
 * !#en The none event code of mouse event.
 * !#zh 无。
 * @property NONE
 * @static
 * @type {Number}
 */


EventMouse.NONE = 0;
/**
 * !#en The event type code of mouse down event.
 * !#zh 鼠标按下事件。
 * @property DOWN
 * @static
 * @type {Number}
 */

EventMouse.DOWN = 1;
/**
 * !#en The event type code of mouse up event.
 * !#zh 鼠标按下后释放事件。
 * @property UP
 * @static
 * @type {Number}
 */

EventMouse.UP = 2;
/**
 * !#en The event type code of mouse move event.
 * !#zh 鼠标移动事件。
 * @property MOVE
 * @static
 * @type {Number}
 */

EventMouse.MOVE = 3;
/**
 * !#en The event type code of mouse scroll event.
 * !#zh 鼠标滚轮事件。
 * @property SCROLL
 * @static
 * @type {Number}
 */

EventMouse.SCROLL = 4;
/**
 * !#en The tag of Mouse left button.
 * !#zh 鼠标左键的标签。
 * @property BUTTON_LEFT
 * @static
 * @type {Number}
 */

EventMouse.BUTTON_LEFT = 0;
/**
 * !#en The tag of Mouse right button  (The right button number is 2 on browser).
 * !#zh 鼠标右键的标签。
 * @property BUTTON_RIGHT
 * @static
 * @type {Number}
 */

EventMouse.BUTTON_RIGHT = 2;
/**
 * !#en The tag of Mouse middle button  (The right button number is 1 on browser).
 * !#zh 鼠标中键的标签。
 * @property BUTTON_MIDDLE
 * @static
 * @type {Number}
 */

EventMouse.BUTTON_MIDDLE = 1;
/**
 * !#en The tag of Mouse button 4.
 * !#zh 鼠标按键 4 的标签。
 * @property BUTTON_4
 * @static
 * @type {Number}
 */

EventMouse.BUTTON_4 = 3;
/**
 * !#en The tag of Mouse button 5.
 * !#zh 鼠标按键 5 的标签。
 * @property BUTTON_5
 * @static
 * @type {Number}
 */

EventMouse.BUTTON_5 = 4;
/**
 * !#en The tag of Mouse button 6.
 * !#zh 鼠标按键 6 的标签。
 * @property BUTTON_6
 * @static
 * @type {Number}
 */

EventMouse.BUTTON_6 = 5;
/**
 * !#en The tag of Mouse button 7.
 * !#zh 鼠标按键 7 的标签。
 * @property BUTTON_7
 * @static
 * @type {Number}
 */

EventMouse.BUTTON_7 = 6;
/**
 * !#en The tag of Mouse button 8.
 * !#zh 鼠标按键 8 的标签。
 * @property BUTTON_8
 * @static
 * @type {Number}
 */

EventMouse.BUTTON_8 = 7;
/**
 * !#en The touch event
 * !#zh 触摸事件
 * @class Event.EventTouch
 * @constructor
 * @extends Event
 */

/**
 * @method constructor
 * @param {Array} touchArr - The array of the touches
 * @param {Boolean} bubbles - A boolean indicating whether the event bubbles up through the tree or not
 */

var EventTouch = function EventTouch(touchArr, bubbles) {
  cc.Event.call(this, cc.Event.TOUCH, bubbles);
  this._eventCode = 0;
  this._touches = touchArr || [];
  /**
   * !#en The current touch object
   * !#zh 当前触点对象
   * @property touch
   * @type {Touch}
   */

  this.touch = null; // Actually duplicated, because of history issue, currentTouch was in the original design, touch was added in creator engine
  // They should point to the same object

  this.currentTouch = null;
};

js.extend(EventTouch, cc.Event);
proto = EventTouch.prototype;
/**
 * !#en Returns event code.
 * !#zh 获取事件类型。
 * @method getEventCode
 * @returns {Number}
 */

proto.getEventCode = function () {
  return this._eventCode;
};
/**
 * !#en Returns touches of event.
 * !#zh 获取触摸点的列表。
 * @method getTouches
 * @returns {Array}
 */


proto.getTouches = function () {
  return this._touches;
};

proto._setEventCode = function (eventCode) {
  this._eventCode = eventCode;
};

proto._setTouches = function (touches) {
  this._touches = touches;
};
/**
 * !#en Sets touch location.
 * !#zh 设置当前触点位置
 * @method setLocation
 * @param {Number} x
 * @param {Number} y
 */


proto.setLocation = function (x, y) {
  this.touch && this.touch.setTouchInfo(this.touch.getID(), x, y);
};
/**
 * !#en Returns touch location.
 * !#zh 获取触点位置。
 * @method getLocation
 * @return {Vec2} location
 */


proto.getLocation = function () {
  return this.touch ? this.touch.getLocation() : cc.v2();
};
/**
 * !#en Returns the current touch location in screen coordinates.
 * !#zh 获取当前触点在游戏窗口中的位置。
 * @method getLocationInView
 * @return {Vec2}
 */


proto.getLocationInView = function () {
  return this.touch ? this.touch.getLocationInView() : cc.v2();
};
/**
 * !#en Returns the previous touch location.
 * !#zh 获取触点在上一次事件时的位置对象，对象包含 x 和 y 属性。
 * @method getPreviousLocation
 * @return {Vec2}
 */


proto.getPreviousLocation = function () {
  return this.touch ? this.touch.getPreviousLocation() : cc.v2();
};
/**
 * !#en Returns the start touch location.
 * !#zh 获取触点落下时的位置对象，对象包含 x 和 y 属性。
 * @method getStartLocation
 * @returns {Vec2}
 */


proto.getStartLocation = function () {
  return this.touch ? this.touch.getStartLocation() : cc.v2();
};
/**
 * !#en Returns the id of cc.Touch.
 * !#zh 触点的标识 ID，可以用来在多点触摸中跟踪触点。
 * @method getID
 * @return {Number}
 */


proto.getID = function () {
  return this.touch ? this.touch.getID() : null;
};
/**
 * !#en Returns the delta distance from the previous location to current location.
 * !#zh 获取触点距离上一次事件移动的距离对象，对象包含 x 和 y 属性。
 * @method getDelta
 * @return {Vec2}
 */


proto.getDelta = function () {
  return this.touch ? this.touch.getDelta() : cc.v2();
};
/**
 * !#en Returns the X axis delta distance from the previous location to current location.
 * !#zh 获取触点距离上一次事件移动的 x 轴距离。
 * @method getDeltaX
 * @return {Number}
 */


proto.getDeltaX = function () {
  return this.touch ? this.touch.getDelta().x : 0;
};
/**
 * !#en Returns the Y axis delta distance from the previous location to current location.
 * !#zh 获取触点距离上一次事件移动的 y 轴距离。
 * @method getDeltaY
 * @return {Number}
 */


proto.getDeltaY = function () {
  return this.touch ? this.touch.getDelta().y : 0;
};
/**
 * !#en Returns location X axis data.
 * !#zh 获取当前触点 X 轴位置。
 * @method getLocationX
 * @returns {Number}
 */


proto.getLocationX = function () {
  return this.touch ? this.touch.getLocationX() : 0;
};
/**
 * !#en Returns location Y axis data.
 * !#zh 获取当前触点 Y 轴位置。
 * @method getLocationY
 * @returns {Number}
 */


proto.getLocationY = function () {
  return this.touch ? this.touch.getLocationY() : 0;
};
/**
 * !#en The maximum touch numbers
 * !#zh 最大触摸数量。
 * @constant
 * @type {Number}
 */


EventTouch.MAX_TOUCHES = 5;
/**
 * !#en The event type code of touch began event.
 * !#zh 开始触摸事件
 * @constant
 * @type {Number}
 */

EventTouch.BEGAN = 0;
/**
 * !#en The event type code of touch moved event.
 * !#zh 触摸后移动事件
 * @constant
 * @type {Number}
 */

EventTouch.MOVED = 1;
/**
 * !#en The event type code of touch ended event.
 * !#zh 结束触摸事件
 * @constant
 * @type {Number}
 */

EventTouch.ENDED = 2;
/**
 * !#en The event type code of touch cancelled event.
 * !#zh 取消触摸事件
 * @constant
 * @type {Number}
 */

EventTouch.CANCELED = 3;
/**
 * !#en The acceleration event
 * !#zh 加速度事件
 * @class Event.EventAcceleration
 * @extends Event
 *
 * @param {Object} acc - The acceleration
 * @param {Boolean} bubbles - A boolean indicating whether the event bubbles up through the tree or not
 */

var EventAcceleration = function EventAcceleration(acc, bubbles) {
  cc.Event.call(this, cc.Event.ACCELERATION, bubbles);
  this.acc = acc;
};

js.extend(EventAcceleration, cc.Event);
/**
 * !#en The keyboard event
 * !#zh 键盘事件
 * @class Event.EventKeyboard
 * @extends Event
 *
 * @param {Number} keyCode - The key code of which triggered this event
 * @param {Boolean} isPressed - A boolean indicating whether the key have been pressed
 * @param {Boolean} bubbles - A boolean indicating whether the event bubbles up through the tree or not
 */

var EventKeyboard = function EventKeyboard(keyCode, isPressed, bubbles) {
  cc.Event.call(this, cc.Event.KEYBOARD, bubbles);
  /**
   * !#en
   * The keyCode read-only property represents a system and implementation dependent numerical code identifying the unmodified value of the pressed key.
   * This is usually the decimal ASCII (RFC 20) or Windows 1252 code corresponding to the key.
   * If the key can't be identified, this value is 0.
   *
   * !#zh
   * keyCode 是只读属性它表示一个系统和依赖于实现的数字代码，可以识别按键的未修改值。
   * 这通常是十进制 ASCII (RFC20) 或者 Windows 1252 代码，所对应的密钥。
   * 如果无法识别该键，则该值为 0。
   *
   * @property keyCode
   * @type {Number}
   */

  this.keyCode = keyCode;
  this.isPressed = isPressed;
};

js.extend(EventKeyboard, cc.Event);
cc.Event.EventMouse = EventMouse;
cc.Event.EventTouch = EventTouch;
cc.Event.EventAcceleration = EventAcceleration;
cc.Event.EventKeyboard = EventKeyboard;
module.exports = cc.Event;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2V2ZW50LW1hbmFnZXIvQ0NFdmVudC5qcyJdLCJuYW1lcyI6WyJqcyIsImNjIiwicmVxdWlyZSIsIkV2ZW50TW91c2UiLCJldmVudFR5cGUiLCJidWJibGVzIiwiRXZlbnQiLCJjYWxsIiwiTU9VU0UiLCJfZXZlbnRUeXBlIiwiX2J1dHRvbiIsIl94IiwiX3kiLCJfcHJldlgiLCJfcHJldlkiLCJfc2Nyb2xsWCIsIl9zY3JvbGxZIiwiZXh0ZW5kIiwicHJvdG8iLCJwcm90b3R5cGUiLCJzZXRTY3JvbGxEYXRhIiwic2Nyb2xsWCIsInNjcm9sbFkiLCJnZXRTY3JvbGxYIiwiZ2V0U2Nyb2xsWSIsInNldExvY2F0aW9uIiwieCIsInkiLCJnZXRMb2NhdGlvbiIsInYyIiwiZ2V0TG9jYXRpb25JblZpZXciLCJ2aWV3IiwiX2Rlc2lnblJlc29sdXRpb25TaXplIiwiaGVpZ2h0IiwiX3NldFByZXZDdXJzb3IiLCJnZXRQcmV2aW91c0xvY2F0aW9uIiwiZ2V0RGVsdGEiLCJnZXREZWx0YVgiLCJnZXREZWx0YVkiLCJzZXRCdXR0b24iLCJidXR0b24iLCJnZXRCdXR0b24iLCJnZXRMb2NhdGlvblgiLCJnZXRMb2NhdGlvblkiLCJOT05FIiwiRE9XTiIsIlVQIiwiTU9WRSIsIlNDUk9MTCIsIkJVVFRPTl9MRUZUIiwiQlVUVE9OX1JJR0hUIiwiQlVUVE9OX01JRERMRSIsIkJVVFRPTl80IiwiQlVUVE9OXzUiLCJCVVRUT05fNiIsIkJVVFRPTl83IiwiQlVUVE9OXzgiLCJFdmVudFRvdWNoIiwidG91Y2hBcnIiLCJUT1VDSCIsIl9ldmVudENvZGUiLCJfdG91Y2hlcyIsInRvdWNoIiwiY3VycmVudFRvdWNoIiwiZ2V0RXZlbnRDb2RlIiwiZ2V0VG91Y2hlcyIsIl9zZXRFdmVudENvZGUiLCJldmVudENvZGUiLCJfc2V0VG91Y2hlcyIsInRvdWNoZXMiLCJzZXRUb3VjaEluZm8iLCJnZXRJRCIsImdldFN0YXJ0TG9jYXRpb24iLCJNQVhfVE9VQ0hFUyIsIkJFR0FOIiwiTU9WRUQiLCJFTkRFRCIsIkNBTkNFTEVEIiwiRXZlbnRBY2NlbGVyYXRpb24iLCJhY2MiLCJBQ0NFTEVSQVRJT04iLCJFdmVudEtleWJvYXJkIiwia2V5Q29kZSIsImlzUHJlc3NlZCIsIktFWUJPQVJEIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBSUEsRUFBRSxHQUFHQyxFQUFFLENBQUNELEVBQVo7O0FBRUFFLE9BQU8sQ0FBQyxnQkFBRCxDQUFQO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFJQyxVQUFVLEdBQUcsU0FBYkEsVUFBYSxDQUFVQyxTQUFWLEVBQXFCQyxPQUFyQixFQUE4QjtBQUMzQ0osRUFBQUEsRUFBRSxDQUFDSyxLQUFILENBQVNDLElBQVQsQ0FBYyxJQUFkLEVBQW9CTixFQUFFLENBQUNLLEtBQUgsQ0FBU0UsS0FBN0IsRUFBb0NILE9BQXBDO0FBQ0EsT0FBS0ksVUFBTCxHQUFrQkwsU0FBbEI7QUFDQSxPQUFLTSxPQUFMLEdBQWUsQ0FBZjtBQUNBLE9BQUtDLEVBQUwsR0FBVSxDQUFWO0FBQ0EsT0FBS0MsRUFBTCxHQUFVLENBQVY7QUFDQSxPQUFLQyxNQUFMLEdBQWMsQ0FBZDtBQUNBLE9BQUtDLE1BQUwsR0FBYyxDQUFkO0FBQ0EsT0FBS0MsUUFBTCxHQUFnQixDQUFoQjtBQUNBLE9BQUtDLFFBQUwsR0FBZ0IsQ0FBaEI7QUFDSCxDQVZEOztBQVlBaEIsRUFBRSxDQUFDaUIsTUFBSCxDQUFVZCxVQUFWLEVBQXNCRixFQUFFLENBQUNLLEtBQXpCO0FBQ0EsSUFBSVksS0FBSyxHQUFHZixVQUFVLENBQUNn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QW5CLEVBQThCOUUsT0FBOUIsRUFBdUM7QUFDdkRKLEVBQUFBLEVBQUUsQ0FBQ0ssS0FBSCxDQUFTQyxJQUFULENBQWMsSUFBZCxFQUFvQk4sRUFBRSxDQUFDSyxLQUFILENBQVM4RSxRQUE3QixFQUF1Qy9FLE9BQXZDO0FBQ0E7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDSSxPQUFLNkUsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsT0FBS0MsU0FBTCxHQUFpQkEsU0FBakI7QUFDSCxDQWxCRDs7QUFtQkFuRixFQUFFLENBQUNpQixNQUFILENBQVVnRSxhQUFWLEVBQXlCaEYsRUFBRSxDQUFDSyxLQUE1QjtBQUVBTCxFQUFFLENBQUNLLEtBQUgsQ0FBU0gsVUFBVCxHQUFzQkEsVUFBdEI7QUFDQUYsRUFBRSxDQUFDSyxLQUFILENBQVNtRCxVQUFULEdBQXNCQSxVQUF0QjtBQUNBeEQsRUFBRSxDQUFDSyxLQUFILENBQVN3RSxpQkFBVCxHQUE2QkEsaUJBQTdCO0FBQ0E3RSxFQUFFLENBQUNLLEtBQUgsQ0FBUzJFLGFBQVQsR0FBeUJBLGFBQXpCO0FBRUFJLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnJGLEVBQUUsQ0FBQ0ssS0FBcEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxudmFyIGpzID0gY2MuanM7XG5cbnJlcXVpcmUoJy4uL2V2ZW50L2V2ZW50Jyk7XG5cbi8qKlxuICogISNlbiBUaGUgbW91c2UgZXZlbnRcbiAqICEjemgg6byg5qCH5LqL5Lu257G75Z6LXG4gKiBAY2xhc3MgRXZlbnQuRXZlbnRNb3VzZVxuICpcbiAqIEBleHRlbmRzIEV2ZW50XG4gKiBAcGFyYW0ge051bWJlcn0gZXZlbnRUeXBlIC0gVGhlIG1vdXNlIGV2ZW50IHR5cGUsIFVQLCBET1dOLCBNT1ZFLCBDQU5DRUxFRFxuICogQHBhcmFtIHtCb29sZWFufSBbYnViYmxlcz1mYWxzZV0gLSBBIGJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBldmVudCBidWJibGVzIHVwIHRocm91Z2ggdGhlIHRyZWUgb3Igbm90XG4gKi9cbnZhciBFdmVudE1vdXNlID0gZnVuY3Rpb24gKGV2ZW50VHlwZSwgYnViYmxlcykge1xuICAgIGNjLkV2ZW50LmNhbGwodGhpcywgY2MuRXZlbnQuTU9VU0UsIGJ1YmJsZXMpO1xuICAgIHRoaXMuX2V2ZW50VHlwZSA9IGV2ZW50VHlwZTtcbiAgICB0aGlzLl9idXR0b24gPSAwO1xuICAgIHRoaXMuX3ggPSAwO1xuICAgIHRoaXMuX3kgPSAwO1xuICAgIHRoaXMuX3ByZXZYID0gMDtcbiAgICB0aGlzLl9wcmV2WSA9IDA7XG4gICAgdGhpcy5fc2Nyb2xsWCA9IDA7XG4gICAgdGhpcy5fc2Nyb2xsWSA9IDA7XG59O1xuXG5qcy5leHRlbmQoRXZlbnRNb3VzZSwgY2MuRXZlbnQpO1xudmFyIHByb3RvID0gRXZlbnRNb3VzZS5wcm90b3R5cGU7XG5cbi8qKlxuICogISNlbiBTZXRzIHNjcm9sbCBkYXRhLlxuICogISN6aCDorr7nva7pvKDmoIfnmoTmu5rliqjmlbDmja7jgIJcbiAqIEBtZXRob2Qgc2V0U2Nyb2xsRGF0YVxuICogQHBhcmFtIHtOdW1iZXJ9IHNjcm9sbFhcbiAqIEBwYXJhbSB7TnVtYmVyfSBzY3JvbGxZXG4gKi9cbnByb3RvLnNldFNjcm9sbERhdGEgPSBmdW5jdGlvbiAoc2Nyb2xsWCwgc2Nyb2xsWSkge1xuICAgIHRoaXMuX3Njcm9sbFggPSBzY3JvbGxYO1xuICAgIHRoaXMuX3Njcm9sbFkgPSBzY3JvbGxZO1xufTtcblxuLyoqXG4gKiAhI2VuIFJldHVybnMgdGhlIHggYXhpcyBzY3JvbGwgdmFsdWUuXG4gKiAhI3poIOiOt+WPlum8oOagh+a7muWKqOeahFjovbTot53nprvvvIzlj6rmnInmu5rliqjml7bmiY3mnInmlYjjgIJcbiAqIEBtZXRob2QgZ2V0U2Nyb2xsWFxuICogQHJldHVybnMge051bWJlcn1cbiAqL1xucHJvdG8uZ2V0U2Nyb2xsWCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2Nyb2xsWDtcbn07XG5cbi8qKlxuICogISNlbiBSZXR1cm5zIHRoZSB5IGF4aXMgc2Nyb2xsIHZhbHVlLlxuICogISN6aCDojrflj5bmu5rova7mu5rliqjnmoQgWSDovbTot53nprvvvIzlj6rmnInmu5rliqjml7bmiY3mnInmlYjjgIJcbiAqIEBtZXRob2QgZ2V0U2Nyb2xsWVxuICogQHJldHVybnMge051bWJlcn1cbiAqL1xucHJvdG8uZ2V0U2Nyb2xsWSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2Nyb2xsWTtcbn07XG5cbi8qKlxuICogISNlbiBTZXRzIGN1cnNvciBsb2NhdGlvbi5cbiAqICEjemgg6K6+572u5b2T5YmN6byg5qCH5L2N572u44CCXG4gKiBAbWV0aG9kIHNldExvY2F0aW9uXG4gKiBAcGFyYW0ge051bWJlcn0geFxuICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAqL1xucHJvdG8uc2V0TG9jYXRpb24gPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgIHRoaXMuX3ggPSB4O1xuICAgIHRoaXMuX3kgPSB5O1xufTtcblxuLyoqXG4gKiAhI2VuIFJldHVybnMgY3Vyc29yIGxvY2F0aW9uLlxuICogISN6aCDojrflj5bpvKDmoIfkvY3nva7lr7nosaHvvIzlr7nosaHljIXlkKsgeCDlkowgeSDlsZ7mgKfjgIJcbiAqIEBtZXRob2QgZ2V0TG9jYXRpb25cbiAqIEByZXR1cm4ge1ZlYzJ9IGxvY2F0aW9uXG4gKi9cbnByb3RvLmdldExvY2F0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjYy52Mih0aGlzLl94LCB0aGlzLl95KTtcbn07XG5cbi8qKlxuICogISNlbiBSZXR1cm5zIHRoZSBjdXJyZW50IGN1cnNvciBsb2NhdGlvbiBpbiBzY3JlZW4gY29vcmRpbmF0ZXMuXG4gKiAhI3poIOiOt+WPluW9k+WJjeS6i+S7tuWcqOa4uOaIj+eql+WPo+WGheeahOWdkOagh+S9jee9ruWvueixoe+8jOWvueixoeWMheWQqyB4IOWSjCB5IOWxnuaAp+OAglxuICogQG1ldGhvZCBnZXRMb2NhdGlvbkluVmlld1xuICogQHJldHVybiB7VmVjMn1cbiAqL1xucHJvdG8uZ2V0TG9jYXRpb25JblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gY2MudjIodGhpcy5feCwgY2Mudmlldy5fZGVzaWduUmVzb2x1dGlvblNpemUuaGVpZ2h0IC0gdGhpcy5feSk7XG59O1xuXG5wcm90by5fc2V0UHJldkN1cnNvciA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgdGhpcy5fcHJldlggPSB4O1xuICAgIHRoaXMuX3ByZXZZID0geTtcbn07XG5cbi8qKlxuICogISNlbiBSZXR1cm5zIHRoZSBwcmV2aW91cyB0b3VjaCBsb2NhdGlvbi5cbiAqICEjemgg6I635Y+W6byg5qCH54K55Ye75Zyo5LiK5LiA5qyh5LqL5Lu25pe255qE5L2N572u5a+56LGh77yM5a+56LGh5YyF5ZCrIHgg5ZKMIHkg5bGe5oCn44CCXG4gKiBAbWV0aG9kIGdldFByZXZpb3VzTG9jYXRpb25cbiAqIEByZXR1cm4ge1ZlYzJ9XG4gKi9cbnByb3RvLmdldFByZXZpb3VzTG9jYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNjLnYyKHRoaXMuX3ByZXZYLCB0aGlzLl9wcmV2WSk7XG59O1xuXG4vKipcbiAqICEjZW4gUmV0dXJucyB0aGUgZGVsdGEgZGlzdGFuY2UgZnJvbSB0aGUgcHJldmlvdXMgbG9jYXRpb24gdG8gY3VycmVudCBsb2NhdGlvbi5cbiAqICEjemgg6I635Y+W6byg5qCH6Led56a75LiK5LiA5qyh5LqL5Lu256e75Yqo55qE6Led56a75a+56LGh77yM5a+56LGh5YyF5ZCrIHgg5ZKMIHkg5bGe5oCn44CCXG4gKiBAbWV0aG9kIGdldERlbHRhXG4gKiBAcmV0dXJuIHtWZWMyfVxuICovXG5wcm90by5nZXREZWx0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2MudjIodGhpcy5feCAtIHRoaXMuX3ByZXZYLCB0aGlzLl95IC0gdGhpcy5fcHJldlkpO1xufTtcblxuLyoqXG4gKiAhI2VuIFJldHVybnMgdGhlIFggYXhpcyBkZWx0YSBkaXN0YW5jZSBmcm9tIHRoZSBwcmV2aW91cyBsb2NhdGlvbiB0byBjdXJyZW50IGxvY2F0aW9uLlxuICogISN6aCDojrflj5bpvKDmoIfot53nprvkuIrkuIDmrKHkuovku7bnp7vliqjnmoQgWCDovbTot53nprvjgIJcbiAqIEBtZXRob2QgZ2V0RGVsdGFYXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbnByb3RvLmdldERlbHRhWCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5feCAtIHRoaXMuX3ByZXZYO1xufTtcblxuLyoqXG4gKiAhI2VuIFJldHVybnMgdGhlIFkgYXhpcyBkZWx0YSBkaXN0YW5jZSBmcm9tIHRoZSBwcmV2aW91cyBsb2NhdGlvbiB0byBjdXJyZW50IGxvY2F0aW9uLlxuICogISN6aCDojrflj5bpvKDmoIfot53nprvkuIrkuIDmrKHkuovku7bnp7vliqjnmoQgWSDovbTot53nprvjgIJcbiAqIEBtZXRob2QgZ2V0RGVsdGFZXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbnByb3RvLmdldERlbHRhWSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5feSAtIHRoaXMuX3ByZXZZO1xufTtcblxuLyoqXG4gKiAhI2VuIFNldHMgbW91c2UgYnV0dG9uLlxuICogISN6aCDorr7nva7pvKDmoIfmjInplK7jgIJcbiAqIEBtZXRob2Qgc2V0QnV0dG9uXG4gKiBAcGFyYW0ge051bWJlcn0gYnV0dG9uXG4gKi9cbnByb3RvLnNldEJ1dHRvbiA9IGZ1bmN0aW9uIChidXR0b24pIHtcbiAgICB0aGlzLl9idXR0b24gPSBidXR0b247XG59O1xuXG4vKipcbiAqICEjZW4gUmV0dXJucyBtb3VzZSBidXR0b24uXG4gKiAhI3poIOiOt+WPlum8oOagh+aMiemUruOAglxuICogQG1ldGhvZCBnZXRCdXR0b25cbiAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gKi9cbnByb3RvLmdldEJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fYnV0dG9uO1xufTtcblxuLyoqXG4gKiAhI2VuIFJldHVybnMgbG9jYXRpb24gWCBheGlzIGRhdGEuXG4gKiAhI3poIOiOt+WPlum8oOagh+W9k+WJjeS9jee9riBYIOi9tOOAglxuICogQG1ldGhvZCBnZXRMb2NhdGlvblhcbiAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gKi9cbnByb3RvLmdldExvY2F0aW9uWCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5feDtcbn07XG5cbi8qKlxuICogISNlbiBSZXR1cm5zIGxvY2F0aW9uIFkgYXhpcyBkYXRhLlxuICogISN6aCDojrflj5bpvKDmoIflvZPliY3kvY3nva4gWSDovbTjgIJcbiAqIEBtZXRob2QgZ2V0TG9jYXRpb25ZXG4gKiBAcmV0dXJucyB7TnVtYmVyfVxuICovXG5wcm90by5nZXRMb2NhdGlvblkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3k7XG59O1xuXG4vL0lubmVyIGV2ZW50IHR5cGVzIG9mIE1vdXNlRXZlbnRcbi8qKlxuICogISNlbiBUaGUgbm9uZSBldmVudCBjb2RlIG9mIG1vdXNlIGV2ZW50LlxuICogISN6aCDml6DjgIJcbiAqIEBwcm9wZXJ0eSBOT05FXG4gKiBAc3RhdGljXG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5FdmVudE1vdXNlLk5PTkUgPSAwO1xuLyoqXG4gKiAhI2VuIFRoZSBldmVudCB0eXBlIGNvZGUgb2YgbW91c2UgZG93biBldmVudC5cbiAqICEjemgg6byg5qCH5oyJ5LiL5LqL5Lu244CCXG4gKiBAcHJvcGVydHkgRE9XTlxuICogQHN0YXRpY1xuICogQHR5cGUge051bWJlcn1cbiAqL1xuRXZlbnRNb3VzZS5ET1dOID0gMTtcbi8qKlxuICogISNlbiBUaGUgZXZlbnQgdHlwZSBjb2RlIG9mIG1vdXNlIHVwIGV2ZW50LlxuICogISN6aCDpvKDmoIfmjInkuIvlkI7ph4rmlL7kuovku7bjgIJcbiAqIEBwcm9wZXJ0eSBVUFxuICogQHN0YXRpY1xuICogQHR5cGUge051bWJlcn1cbiAqL1xuRXZlbnRNb3VzZS5VUCA9IDI7XG4vKipcbiAqICEjZW4gVGhlIGV2ZW50IHR5cGUgY29kZSBvZiBtb3VzZSBtb3ZlIGV2ZW50LlxuICogISN6aCDpvKDmoIfnp7vliqjkuovku7bjgIJcbiAqIEBwcm9wZXJ0eSBNT1ZFXG4gKiBAc3RhdGljXG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5FdmVudE1vdXNlLk1PVkUgPSAzO1xuLyoqXG4gKiAhI2VuIFRoZSBldmVudCB0eXBlIGNvZGUgb2YgbW91c2Ugc2Nyb2xsIGV2ZW50LlxuICogISN6aCDpvKDmoIfmu5rova7kuovku7bjgIJcbiAqIEBwcm9wZXJ0eSBTQ1JPTExcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKi9cbkV2ZW50TW91c2UuU0NST0xMID0gNDtcblxuLyoqXG4gKiAhI2VuIFRoZSB0YWcgb2YgTW91c2UgbGVmdCBidXR0b24uXG4gKiAhI3poIOm8oOagh+W3pumUrueahOagh+etvuOAglxuICogQHByb3BlcnR5IEJVVFRPTl9MRUZUXG4gKiBAc3RhdGljXG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5FdmVudE1vdXNlLkJVVFRPTl9MRUZUID0gMDtcblxuLyoqXG4gKiAhI2VuIFRoZSB0YWcgb2YgTW91c2UgcmlnaHQgYnV0dG9uICAoVGhlIHJpZ2h0IGJ1dHRvbiBudW1iZXIgaXMgMiBvbiBicm93c2VyKS5cbiAqICEjemgg6byg5qCH5Y+z6ZSu55qE5qCH562+44CCXG4gKiBAcHJvcGVydHkgQlVUVE9OX1JJR0hUXG4gKiBAc3RhdGljXG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5FdmVudE1vdXNlLkJVVFRPTl9SSUdIVCA9IDI7XG5cbi8qKlxuICogISNlbiBUaGUgdGFnIG9mIE1vdXNlIG1pZGRsZSBidXR0b24gIChUaGUgcmlnaHQgYnV0dG9uIG51bWJlciBpcyAxIG9uIGJyb3dzZXIpLlxuICogISN6aCDpvKDmoIfkuK3plK7nmoTmoIfnrb7jgIJcbiAqIEBwcm9wZXJ0eSBCVVRUT05fTUlERExFXG4gKiBAc3RhdGljXG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5FdmVudE1vdXNlLkJVVFRPTl9NSURETEUgPSAxO1xuXG4vKipcbiAqICEjZW4gVGhlIHRhZyBvZiBNb3VzZSBidXR0b24gNC5cbiAqICEjemgg6byg5qCH5oyJ6ZSuIDQg55qE5qCH562+44CCXG4gKiBAcHJvcGVydHkgQlVUVE9OXzRcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKi9cbkV2ZW50TW91c2UuQlVUVE9OXzQgPSAzO1xuXG4vKipcbiAqICEjZW4gVGhlIHRhZyBvZiBNb3VzZSBidXR0b24gNS5cbiAqICEjemgg6byg5qCH5oyJ6ZSuIDUg55qE5qCH562+44CCXG4gKiBAcHJvcGVydHkgQlVUVE9OXzVcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKi9cbkV2ZW50TW91c2UuQlVUVE9OXzUgPSA0O1xuXG4vKipcbiAqICEjZW4gVGhlIHRhZyBvZiBNb3VzZSBidXR0b24gNi5cbiAqICEjemgg6byg5qCH5oyJ6ZSuIDYg55qE5qCH562+44CCXG4gKiBAcHJvcGVydHkgQlVUVE9OXzZcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKi9cbkV2ZW50TW91c2UuQlVUVE9OXzYgPSA1O1xuXG4vKipcbiAqICEjZW4gVGhlIHRhZyBvZiBNb3VzZSBidXR0b24gNy5cbiAqICEjemgg6byg5qCH5oyJ6ZSuIDcg55qE5qCH562+44CCXG4gKiBAcHJvcGVydHkgQlVUVE9OXzdcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKi9cbkV2ZW50TW91c2UuQlVUVE9OXzcgPSA2O1xuXG4vKipcbiAqICEjZW4gVGhlIHRhZyBvZiBNb3VzZSBidXR0b24gOC5cbiAqICEjemgg6byg5qCH5oyJ6ZSuIDgg55qE5qCH562+44CCXG4gKiBAcHJvcGVydHkgQlVUVE9OXzhcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKi9cbkV2ZW50TW91c2UuQlVUVE9OXzggPSA3O1xuXG4vKipcbiAqICEjZW4gVGhlIHRvdWNoIGV2ZW50XG4gKiAhI3poIOinpuaRuOS6i+S7tlxuICogQGNsYXNzIEV2ZW50LkV2ZW50VG91Y2hcbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgRXZlbnRcbiAqL1xuLyoqXG4gKiBAbWV0aG9kIGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSB0b3VjaEFyciAtIFRoZSBhcnJheSBvZiB0aGUgdG91Y2hlc1xuICogQHBhcmFtIHtCb29sZWFufSBidWJibGVzIC0gQSBib29sZWFuIGluZGljYXRpbmcgd2hldGhlciB0aGUgZXZlbnQgYnViYmxlcyB1cCB0aHJvdWdoIHRoZSB0cmVlIG9yIG5vdFxuICovXG52YXIgRXZlbnRUb3VjaCA9IGZ1bmN0aW9uICh0b3VjaEFyciwgYnViYmxlcykge1xuICAgIGNjLkV2ZW50LmNhbGwodGhpcywgY2MuRXZlbnQuVE9VQ0gsIGJ1YmJsZXMpO1xuICAgIHRoaXMuX2V2ZW50Q29kZSA9IDA7XG4gICAgdGhpcy5fdG91Y2hlcyA9IHRvdWNoQXJyIHx8IFtdO1xuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGN1cnJlbnQgdG91Y2ggb2JqZWN0XG4gICAgICogISN6aCDlvZPliY3op6bngrnlr7nosaFcbiAgICAgKiBAcHJvcGVydHkgdG91Y2hcbiAgICAgKiBAdHlwZSB7VG91Y2h9XG4gICAgICovXG4gICAgdGhpcy50b3VjaCA9IG51bGw7XG4gICAgLy8gQWN0dWFsbHkgZHVwbGljYXRlZCwgYmVjYXVzZSBvZiBoaXN0b3J5IGlzc3VlLCBjdXJyZW50VG91Y2ggd2FzIGluIHRoZSBvcmlnaW5hbCBkZXNpZ24sIHRvdWNoIHdhcyBhZGRlZCBpbiBjcmVhdG9yIGVuZ2luZVxuICAgIC8vIFRoZXkgc2hvdWxkIHBvaW50IHRvIHRoZSBzYW1lIG9iamVjdFxuICAgIHRoaXMuY3VycmVudFRvdWNoID0gbnVsbDtcbn07XG5cbmpzLmV4dGVuZChFdmVudFRvdWNoLCBjYy5FdmVudCk7XG5wcm90byA9IEV2ZW50VG91Y2gucHJvdG90eXBlO1xuXG4vKipcbiAqICEjZW4gUmV0dXJucyBldmVudCBjb2RlLlxuICogISN6aCDojrflj5bkuovku7bnsbvlnovjgIJcbiAqIEBtZXRob2QgZ2V0RXZlbnRDb2RlXG4gKiBAcmV0dXJucyB7TnVtYmVyfVxuICovXG5wcm90by5nZXRFdmVudENvZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2V2ZW50Q29kZTtcbn07XG5cbi8qKlxuICogISNlbiBSZXR1cm5zIHRvdWNoZXMgb2YgZXZlbnQuXG4gKiAhI3poIOiOt+WPluinpuaRuOeCueeahOWIl+ihqOOAglxuICogQG1ldGhvZCBnZXRUb3VjaGVzXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKi9cbnByb3RvLmdldFRvdWNoZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RvdWNoZXM7XG59O1xuXG5wcm90by5fc2V0RXZlbnRDb2RlID0gZnVuY3Rpb24gKGV2ZW50Q29kZSkge1xuICAgIHRoaXMuX2V2ZW50Q29kZSA9IGV2ZW50Q29kZTtcbn07XG5cbnByb3RvLl9zZXRUb3VjaGVzID0gZnVuY3Rpb24gKHRvdWNoZXMpIHtcbiAgICB0aGlzLl90b3VjaGVzID0gdG91Y2hlcztcbn07XG5cbi8qKlxuICogISNlbiBTZXRzIHRvdWNoIGxvY2F0aW9uLlxuICogISN6aCDorr7nva7lvZPliY3op6bngrnkvY3nva5cbiAqIEBtZXRob2Qgc2V0TG9jYXRpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gKiBAcGFyYW0ge051bWJlcn0geVxuICovXG5wcm90by5zZXRMb2NhdGlvbiA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgdGhpcy50b3VjaCAmJiB0aGlzLnRvdWNoLnNldFRvdWNoSW5mbyh0aGlzLnRvdWNoLmdldElEKCksIHgsIHkpO1xufTtcblxuLyoqXG4gKiAhI2VuIFJldHVybnMgdG91Y2ggbG9jYXRpb24uXG4gKiAhI3poIOiOt+WPluinpueCueS9jee9ruOAglxuICogQG1ldGhvZCBnZXRMb2NhdGlvblxuICogQHJldHVybiB7VmVjMn0gbG9jYXRpb25cbiAqL1xucHJvdG8uZ2V0TG9jYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMudG91Y2ggPyB0aGlzLnRvdWNoLmdldExvY2F0aW9uKCkgOiBjYy52MigpO1xufTtcblxuLyoqXG4gKiAhI2VuIFJldHVybnMgdGhlIGN1cnJlbnQgdG91Y2ggbG9jYXRpb24gaW4gc2NyZWVuIGNvb3JkaW5hdGVzLlxuICogISN6aCDojrflj5blvZPliY3op6bngrnlnKjmuLjmiI/nqpflj6PkuK3nmoTkvY3nva7jgIJcbiAqIEBtZXRob2QgZ2V0TG9jYXRpb25JblZpZXdcbiAqIEByZXR1cm4ge1ZlYzJ9XG4gKi9cbnByb3RvLmdldExvY2F0aW9uSW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudG91Y2ggPyB0aGlzLnRvdWNoLmdldExvY2F0aW9uSW5WaWV3KCkgOiBjYy52MigpO1xufTtcblxuLyoqXG4gKiAhI2VuIFJldHVybnMgdGhlIHByZXZpb3VzIHRvdWNoIGxvY2F0aW9uLlxuICogISN6aCDojrflj5bop6bngrnlnKjkuIrkuIDmrKHkuovku7bml7bnmoTkvY3nva7lr7nosaHvvIzlr7nosaHljIXlkKsgeCDlkowgeSDlsZ7mgKfjgIJcbiAqIEBtZXRob2QgZ2V0UHJldmlvdXNMb2NhdGlvblxuICogQHJldHVybiB7VmVjMn1cbiAqL1xucHJvdG8uZ2V0UHJldmlvdXNMb2NhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy50b3VjaCA/IHRoaXMudG91Y2guZ2V0UHJldmlvdXNMb2NhdGlvbigpIDogY2MudjIoKTtcbn07XG5cbi8qKlxuICogISNlbiBSZXR1cm5zIHRoZSBzdGFydCB0b3VjaCBsb2NhdGlvbi5cbiAqICEjemgg6I635Y+W6Kem54K56JC95LiL5pe255qE5L2N572u5a+56LGh77yM5a+56LGh5YyF5ZCrIHgg5ZKMIHkg5bGe5oCn44CCXG4gKiBAbWV0aG9kIGdldFN0YXJ0TG9jYXRpb25cbiAqIEByZXR1cm5zIHtWZWMyfVxuICovXG5wcm90by5nZXRTdGFydExvY2F0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudG91Y2ggPyB0aGlzLnRvdWNoLmdldFN0YXJ0TG9jYXRpb24oKSA6IGNjLnYyKCk7XG59O1xuXG4vKipcbiAqICEjZW4gUmV0dXJucyB0aGUgaWQgb2YgY2MuVG91Y2guXG4gKiAhI3poIOinpueCueeahOagh+ivhiBJRO+8jOWPr+S7peeUqOadpeWcqOWkmueCueinpuaRuOS4rei3n+i4quinpueCueOAglxuICogQG1ldGhvZCBnZXRJRFxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5wcm90by5nZXRJRCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy50b3VjaCA/IHRoaXMudG91Y2guZ2V0SUQoKSA6IG51bGw7XG59O1xuXG4vKipcbiAqICEjZW4gUmV0dXJucyB0aGUgZGVsdGEgZGlzdGFuY2UgZnJvbSB0aGUgcHJldmlvdXMgbG9jYXRpb24gdG8gY3VycmVudCBsb2NhdGlvbi5cbiAqICEjemgg6I635Y+W6Kem54K56Led56a75LiK5LiA5qyh5LqL5Lu256e75Yqo55qE6Led56a75a+56LGh77yM5a+56LGh5YyF5ZCrIHgg5ZKMIHkg5bGe5oCn44CCXG4gKiBAbWV0aG9kIGdldERlbHRhXG4gKiBAcmV0dXJuIHtWZWMyfVxuICovXG5wcm90by5nZXREZWx0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy50b3VjaCA/IHRoaXMudG91Y2guZ2V0RGVsdGEoKSA6IGNjLnYyKCk7XG59O1xuXG4vKipcbiAqICEjZW4gUmV0dXJucyB0aGUgWCBheGlzIGRlbHRhIGRpc3RhbmNlIGZyb20gdGhlIHByZXZpb3VzIGxvY2F0aW9uIHRvIGN1cnJlbnQgbG9jYXRpb24uXG4gKiAhI3poIOiOt+WPluinpueCuei3neemu+S4iuS4gOasoeS6i+S7tuenu+WKqOeahCB4IOi9tOi3neemu+OAglxuICogQG1ldGhvZCBnZXREZWx0YVhcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xucHJvdG8uZ2V0RGVsdGFYID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnRvdWNoID8gdGhpcy50b3VjaC5nZXREZWx0YSgpLnggOiAwO1xufTtcblxuLyoqXG4gKiAhI2VuIFJldHVybnMgdGhlIFkgYXhpcyBkZWx0YSBkaXN0YW5jZSBmcm9tIHRoZSBwcmV2aW91cyBsb2NhdGlvbiB0byBjdXJyZW50IGxvY2F0aW9uLlxuICogISN6aCDojrflj5bop6bngrnot53nprvkuIrkuIDmrKHkuovku7bnp7vliqjnmoQgeSDovbTot53nprvjgIJcbiAqIEBtZXRob2QgZ2V0RGVsdGFZXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbnByb3RvLmdldERlbHRhWSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy50b3VjaCA/IHRoaXMudG91Y2guZ2V0RGVsdGEoKS55IDogMDtcbn07XG5cbi8qKlxuICogISNlbiBSZXR1cm5zIGxvY2F0aW9uIFggYXhpcyBkYXRhLlxuICogISN6aCDojrflj5blvZPliY3op6bngrkgWCDovbTkvY3nva7jgIJcbiAqIEBtZXRob2QgZ2V0TG9jYXRpb25YXG4gKiBAcmV0dXJucyB7TnVtYmVyfVxuICovXG5wcm90by5nZXRMb2NhdGlvblggPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMudG91Y2ggPyB0aGlzLnRvdWNoLmdldExvY2F0aW9uWCgpIDogMDtcbn07XG5cbi8qKlxuICogISNlbiBSZXR1cm5zIGxvY2F0aW9uIFkgYXhpcyBkYXRhLlxuICogISN6aCDojrflj5blvZPliY3op6bngrkgWSDovbTkvY3nva7jgIJcbiAqIEBtZXRob2QgZ2V0TG9jYXRpb25ZXG4gKiBAcmV0dXJucyB7TnVtYmVyfVxuICovXG5wcm90by5nZXRMb2NhdGlvblkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMudG91Y2ggPyB0aGlzLnRvdWNoLmdldExvY2F0aW9uWSgpIDogMDtcbn07XG5cbi8qKlxuICogISNlbiBUaGUgbWF4aW11bSB0b3VjaCBudW1iZXJzXG4gKiAhI3poIOacgOWkp+inpuaRuOaVsOmHj+OAglxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5FdmVudFRvdWNoLk1BWF9UT1VDSEVTID0gNTtcblxuLyoqXG4gKiAhI2VuIFRoZSBldmVudCB0eXBlIGNvZGUgb2YgdG91Y2ggYmVnYW4gZXZlbnQuXG4gKiAhI3poIOW8gOWni+inpuaRuOS6i+S7tlxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5FdmVudFRvdWNoLkJFR0FOID0gMDtcbi8qKlxuICogISNlbiBUaGUgZXZlbnQgdHlwZSBjb2RlIG9mIHRvdWNoIG1vdmVkIGV2ZW50LlxuICogISN6aCDop6bmkbjlkI7np7vliqjkuovku7ZcbiAqIEBjb25zdGFudFxuICogQHR5cGUge051bWJlcn1cbiAqL1xuRXZlbnRUb3VjaC5NT1ZFRCA9IDE7XG4vKipcbiAqICEjZW4gVGhlIGV2ZW50IHR5cGUgY29kZSBvZiB0b3VjaCBlbmRlZCBldmVudC5cbiAqICEjemgg57uT5p2f6Kem5pG45LqL5Lu2XG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKi9cbkV2ZW50VG91Y2guRU5ERUQgPSAyO1xuLyoqXG4gKiAhI2VuIFRoZSBldmVudCB0eXBlIGNvZGUgb2YgdG91Y2ggY2FuY2VsbGVkIGV2ZW50LlxuICogISN6aCDlj5bmtojop6bmkbjkuovku7ZcbiAqIEBjb25zdGFudFxuICogQHR5cGUge051bWJlcn1cbiAqL1xuRXZlbnRUb3VjaC5DQU5DRUxFRCA9IDM7XG5cbi8qKlxuICogISNlbiBUaGUgYWNjZWxlcmF0aW9uIGV2ZW50XG4gKiAhI3poIOWKoOmAn+W6puS6i+S7tlxuICogQGNsYXNzIEV2ZW50LkV2ZW50QWNjZWxlcmF0aW9uXG4gKiBAZXh0ZW5kcyBFdmVudFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhY2MgLSBUaGUgYWNjZWxlcmF0aW9uXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGJ1YmJsZXMgLSBBIGJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBldmVudCBidWJibGVzIHVwIHRocm91Z2ggdGhlIHRyZWUgb3Igbm90XG4gKi9cbnZhciBFdmVudEFjY2VsZXJhdGlvbiA9IGZ1bmN0aW9uIChhY2MsIGJ1YmJsZXMpIHtcbiAgICBjYy5FdmVudC5jYWxsKHRoaXMsIGNjLkV2ZW50LkFDQ0VMRVJBVElPTiwgYnViYmxlcyk7XG4gICAgdGhpcy5hY2MgPSBhY2M7XG59O1xuanMuZXh0ZW5kKEV2ZW50QWNjZWxlcmF0aW9uLCBjYy5FdmVudCk7XG5cbi8qKlxuICogISNlbiBUaGUga2V5Ym9hcmQgZXZlbnRcbiAqICEjemgg6ZSu55uY5LqL5Lu2XG4gKiBAY2xhc3MgRXZlbnQuRXZlbnRLZXlib2FyZFxuICogQGV4dGVuZHMgRXZlbnRcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0ga2V5Q29kZSAtIFRoZSBrZXkgY29kZSBvZiB3aGljaCB0cmlnZ2VyZWQgdGhpcyBldmVudFxuICogQHBhcmFtIHtCb29sZWFufSBpc1ByZXNzZWQgLSBBIGJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBrZXkgaGF2ZSBiZWVuIHByZXNzZWRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gYnViYmxlcyAtIEEgYm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIGV2ZW50IGJ1YmJsZXMgdXAgdGhyb3VnaCB0aGUgdHJlZSBvciBub3RcbiAqL1xudmFyIEV2ZW50S2V5Ym9hcmQgPSBmdW5jdGlvbiAoa2V5Q29kZSwgaXNQcmVzc2VkLCBidWJibGVzKSB7XG4gICAgY2MuRXZlbnQuY2FsbCh0aGlzLCBjYy5FdmVudC5LRVlCT0FSRCwgYnViYmxlcyk7XG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFRoZSBrZXlDb2RlIHJlYWQtb25seSBwcm9wZXJ0eSByZXByZXNlbnRzIGEgc3lzdGVtIGFuZCBpbXBsZW1lbnRhdGlvbiBkZXBlbmRlbnQgbnVtZXJpY2FsIGNvZGUgaWRlbnRpZnlpbmcgdGhlIHVubW9kaWZpZWQgdmFsdWUgb2YgdGhlIHByZXNzZWQga2V5LlxuICAgICAqIFRoaXMgaXMgdXN1YWxseSB0aGUgZGVjaW1hbCBBU0NJSSAoUkZDIDIwKSBvciBXaW5kb3dzIDEyNTIgY29kZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBrZXkuXG4gICAgICogSWYgdGhlIGtleSBjYW4ndCBiZSBpZGVudGlmaWVkLCB0aGlzIHZhbHVlIGlzIDAuXG4gICAgICpcbiAgICAgKiAhI3poXG4gICAgICoga2V5Q29kZSDmmK/lj6ror7vlsZ7mgKflroPooajnpLrkuIDkuKrns7vnu5/lkozkvp3otZbkuo7lrp7njrDnmoTmlbDlrZfku6PnoIHvvIzlj6/ku6Xor4bliKvmjInplK7nmoTmnKrkv67mlLnlgLzjgIJcbiAgICAgKiDov5npgJrluLjmmK/ljYHov5vliLYgQVNDSUkgKFJGQzIwKSDmiJbogIUgV2luZG93cyAxMjUyIOS7o+egge+8jOaJgOWvueW6lOeahOWvhumSpeOAglxuICAgICAqIOWmguaenOaXoOazleivhuWIq+ivpemUru+8jOWImeivpeWAvOS4uiAw44CCXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkga2V5Q29kZVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5rZXlDb2RlID0ga2V5Q29kZTtcbiAgICB0aGlzLmlzUHJlc3NlZCA9IGlzUHJlc3NlZDtcbn07XG5qcy5leHRlbmQoRXZlbnRLZXlib2FyZCwgY2MuRXZlbnQpO1xuXG5jYy5FdmVudC5FdmVudE1vdXNlID0gRXZlbnRNb3VzZTtcbmNjLkV2ZW50LkV2ZW50VG91Y2ggPSBFdmVudFRvdWNoO1xuY2MuRXZlbnQuRXZlbnRBY2NlbGVyYXRpb24gPSBFdmVudEFjY2VsZXJhdGlvbjtcbmNjLkV2ZW50LkV2ZW50S2V5Ym9hcmQgPSBFdmVudEtleWJvYXJkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNjLkV2ZW50O1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=