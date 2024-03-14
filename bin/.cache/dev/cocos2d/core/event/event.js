
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/event/event.js';
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
var js = require("../platform/js");
/**
 * !#en Base class of all kinds of events.
 * !#zh 包含事件相关信息的对象。
 * @class Event
 */

/**
 * @method constructor
 * @param {String} type - The name of the event (case-sensitive), e.g. "click", "fire", or "submit"
 * @param {Boolean} bubbles - A boolean indicating whether the event bubbles up through the tree or not
 */


cc.Event = function (type, bubbles) {
  /**
   * !#en The name of the event (case-sensitive), e.g. "click", "fire", or "submit".
   * !#zh 事件类型。
   * @property type
   * @type {String}
   */
  this.type = type;
  /**
   * !#en Indicate whether the event bubbles up through the tree or not.
   * !#zh 表示该事件是否进行冒泡。
   * @property bubbles
   * @type {Boolean}
   */

  this.bubbles = !!bubbles;
  /**
   * !#en A reference to the target to which the event was originally dispatched.
   * !#zh 最初事件触发的目标
   * @property target
   * @type {Object}
   */

  this.target = null;
  /**
   * !#en A reference to the currently registered target for the event.
   * !#zh 当前目标
   * @property currentTarget
   * @type {Object}
   */

  this.currentTarget = null;
  /**
   * !#en
   * Indicates which phase of the event flow is currently being evaluated.
   * Returns an integer value represented by 4 constants:
   *  - Event.NONE = 0
   *  - Event.CAPTURING_PHASE = 1
   *  - Event.AT_TARGET = 2
   *  - Event.BUBBLING_PHASE = 3
   * The phases are explained in the [section 3.1, Event dispatch and DOM event flow]
   * (http://www.w3.org/TR/DOM-Level-3-Events/#event-flow), of the DOM Level 3 Events specification.
   * !#zh 事件阶段
   * @property eventPhase
   * @type {Number}
   */

  this.eventPhase = 0;
  /*
   * Indicates whether or not event.stopPropagation() has been called on the event.
   * @property _propagationStopped
   * @type {Boolean}
   * @private
   */

  this._propagationStopped = false;
  /*
   * Indicates whether or not event.stopPropagationImmediate() has been called on the event.
   * @property _propagationImmediateStopped
   * @type {Boolean}
   * @private
   */

  this._propagationImmediateStopped = false;
};

cc.Event.prototype = {
  constructor: cc.Event,

  /**
   * !#en Reset the event for being stored in the object pool.
   * !#zh 重置对象池中存储的事件。
   * @method unuse
   * @returns {String}
   */
  unuse: function unuse() {
    this.type = cc.Event.NO_TYPE;
    this.target = null;
    this.currentTarget = null;
    this.eventPhase = cc.Event.NONE;
    this._propagationStopped = false;
    this._propagationImmediateStopped = false;
  },

  /**
   * !#en Reuse the event for being used again by the object pool.
   * !#zh 用于对象池再次使用的事件。
   * @method reuse
   * @returns {String}
   */
  reuse: function reuse(type, bubbles) {
    this.type = type;
    this.bubbles = bubbles || false;
  },

  /**
   * !#en Stops propagation for current event.
   * !#zh 停止传递当前事件。
   * @method stopPropagation
   */
  stopPropagation: function stopPropagation() {
    this._propagationStopped = true;
  },

  /**
   * !#en Stops propagation for current event immediately,
   * the event won't even be dispatched to the listeners attached in the current target.
   * !#zh 立即停止当前事件的传递，事件甚至不会被分派到所连接的当前目标。
   * @method stopPropagationImmediate
   */
  stopPropagationImmediate: function stopPropagationImmediate() {
    this._propagationImmediateStopped = true;
  },

  /**
   * !#en Checks whether the event has been stopped.
   * !#zh 检查该事件是否已经停止传递.
   * @method isStopped
   * @returns {Boolean}
   */
  isStopped: function isStopped() {
    return this._propagationStopped || this._propagationImmediateStopped;
  },

  /**
   * !#en
   * <p>
   *     Gets current target of the event                                                            <br/>
   *     note: It only be available when the event listener is associated with node.                <br/>
   *          It returns 0 when the listener is associated with fixed priority.
   * </p>
   * !#zh 获取当前目标节点
   * @method getCurrentTarget
   * @returns {Node}  The target with which the event associates.
   */
  getCurrentTarget: function getCurrentTarget() {
    return this.currentTarget;
  },

  /**
   * !#en Gets the event type.
   * !#zh 获取事件类型
   * @method getType
   * @returns {String}
   */
  getType: function getType() {
    return this.type;
  }
}; //event type

/**
 * !#en Code for event without type.
 * !#zh 没有类型的事件
 * @property NO_TYPE
 * @static
 * @type {string}
 */

cc.Event.NO_TYPE = 'no_type';
/**
 * !#en The type code of Touch event.
 * !#zh 触摸事件类型
 * @property TOUCH
 * @static
 * @type {String}
 */

cc.Event.TOUCH = 'touch';
/**
 * !#en The type code of Mouse event.
 * !#zh 鼠标事件类型
 * @property MOUSE
 * @static
 * @type {String}
 */

cc.Event.MOUSE = 'mouse';
/**
 * !#en The type code of Keyboard event.
 * !#zh 键盘事件类型
 * @property KEYBOARD
 * @static
 * @type {String}
 */

cc.Event.KEYBOARD = 'keyboard';
/**
 * !#en The type code of Acceleration event.
 * !#zh 加速器事件类型
 * @property ACCELERATION
 * @static
 * @type {String}
 */

cc.Event.ACCELERATION = 'acceleration'; //event phase

/**
 * !#en Events not currently dispatched are in this phase
 * !#zh 尚未派发事件阶段
 * @property NONE
 * @type {Number}
 * @static
 */

cc.Event.NONE = 0;
/**
 * !#en
 * The capturing phase comprises the journey from the root to the last node before the event target's node
 * see http://www.w3.org/TR/DOM-Level-3-Events/#event-flow
 * !#zh 捕获阶段，包括事件目标节点之前从根节点到最后一个节点的过程。
 * @property CAPTURING_PHASE
 * @type {Number}
 * @static
 */

cc.Event.CAPTURING_PHASE = 1;
/**
 * !#en
 * The target phase comprises only the event target node
 * see http://www.w3.org/TR/DOM-Level-3-Events/#event-flow
 * !#zh 目标阶段仅包括事件目标节点。
 * @property AT_TARGET
 * @type {Number}
 * @static
 */

cc.Event.AT_TARGET = 2;
/**
 * !#en
 * The bubbling phase comprises any subsequent nodes encountered on the return trip to the root of the hierarchy
 * see http://www.w3.org/TR/DOM-Level-3-Events/#event-flow
 * !#zh 冒泡阶段， 包括回程遇到到层次根节点的任何后续节点。
 * @property BUBBLING_PHASE
 * @type {Number}
 * @static
 */

cc.Event.BUBBLING_PHASE = 3;
/**
 * !#en The Custom event
 * !#zh 自定义事件
 * @class Event.EventCustom
 *
 * @extends Event
 */

/**
 * @method constructor
 * @param {String} type - The name of the event (case-sensitive), e.g. "click", "fire", or "submit"
 * @param {Boolean} bubbles - A boolean indicating whether the event bubbles up through the tree or not
 */

var EventCustom = function EventCustom(type, bubbles) {
  cc.Event.call(this, type, bubbles);
  /**
   * !#en A reference to the detailed data of the event
   * !#zh 事件的详细数据
   * @property detail
   * @type {Object}
   */

  this.detail = null;
};

js.extend(EventCustom, cc.Event);
EventCustom.prototype.reset = EventCustom;
/**
 * !#en Sets user data
 * !#zh 设置用户数据
 * @method setUserData
 * @param {*} data
 */

EventCustom.prototype.setUserData = function (data) {
  this.detail = data;
};
/**
 * !#en Gets user data
 * !#zh 获取用户数据
 * @method getUserData
 * @returns {*}
 */


EventCustom.prototype.getUserData = function () {
  return this.detail;
};
/**
 * !#en Gets event name
 * !#zh 获取事件名称
 * @method getEventName
 * @returns {String}
 */


EventCustom.prototype.getEventName = cc.Event.prototype.getType;
var MAX_POOL_SIZE = 10;

var _eventPool = new js.Pool(MAX_POOL_SIZE);

EventCustom.put = function (event) {
  _eventPool.put(event);
};

EventCustom.get = function (type, bubbles) {
  var event = _eventPool._get();

  if (event) {
    event.reset(type, bubbles);
  } else {
    event = new EventCustom(type, bubbles);
  }

  return event;
};

cc.Event.EventCustom = EventCustom;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2V2ZW50L2V2ZW50LmpzIl0sIm5hbWVzIjpbImpzIiwicmVxdWlyZSIsImNjIiwiRXZlbnQiLCJ0eXBlIiwiYnViYmxlcyIsInRhcmdldCIsImN1cnJlbnRUYXJnZXQiLCJldmVudFBoYXNlIiwiX3Byb3BhZ2F0aW9uU3RvcHBlZCIsIl9wcm9wYWdhdGlvbkltbWVkaWF0ZVN0b3BwZWQiLCJwcm90b3R5cGUiLCJjb25zdHJ1Y3RvciIsInVudXNlIiwiTk9fVFlQRSIsIk5PTkUiLCJyZXVzZSIsInN0b3BQcm9wYWdhdGlvbiIsInN0b3BQcm9wYWdhdGlvbkltbWVkaWF0ZSIsImlzU3RvcHBlZCIsImdldEN1cnJlbnRUYXJnZXQiLCJnZXRUeXBlIiwiVE9VQ0giLCJNT1VTRSIsIktFWUJPQVJEIiwiQUNDRUxFUkFUSU9OIiwiQ0FQVFVSSU5HX1BIQVNFIiwiQVRfVEFSR0VUIiwiQlVCQkxJTkdfUEhBU0UiLCJFdmVudEN1c3RvbSIsImNhbGwiLCJkZXRhaWwiLCJleHRlbmQiLCJyZXNldCIsInNldFVzZXJEYXRhIiwiZGF0YSIsImdldFVzZXJEYXRhIiwiZ2V0RXZlbnROYW1lIiwiTUFYX1BPT0xfU0laRSIsIl9ldmVudFBvb2wiLCJQb29sIiwicHV0IiwiZXZlbnQiLCJnZXQiLCJfZ2V0IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBSUEsRUFBRSxHQUFHQyxPQUFPLENBQUMsZ0JBQUQsQ0FBaEI7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBQyxFQUFFLENBQUNDLEtBQUgsR0FBVyxV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SCxDQUFTMEIsV0FBVCxHQUF1QkEsV0FBdkI7QUFFQWdCLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjVDLEVBQUUsQ0FBQ0MsS0FBcEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBqcyA9IHJlcXVpcmUoXCIuLi9wbGF0Zm9ybS9qc1wiKTtcblxuLyoqXG4gKiAhI2VuIEJhc2UgY2xhc3Mgb2YgYWxsIGtpbmRzIG9mIGV2ZW50cy5cbiAqICEjemgg5YyF5ZCr5LqL5Lu255u45YWz5L+h5oGv55qE5a+56LGh44CCXG4gKiBAY2xhc3MgRXZlbnRcbiAqL1xuXG4vKipcbiAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gVGhlIG5hbWUgb2YgdGhlIGV2ZW50IChjYXNlLXNlbnNpdGl2ZSksIGUuZy4gXCJjbGlja1wiLCBcImZpcmVcIiwgb3IgXCJzdWJtaXRcIlxuICogQHBhcmFtIHtCb29sZWFufSBidWJibGVzIC0gQSBib29sZWFuIGluZGljYXRpbmcgd2hldGhlciB0aGUgZXZlbnQgYnViYmxlcyB1cCB0aHJvdWdoIHRoZSB0cmVlIG9yIG5vdFxuICovXG5jYy5FdmVudCA9IGZ1bmN0aW9uKHR5cGUsIGJ1YmJsZXMpIHtcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBuYW1lIG9mIHRoZSBldmVudCAoY2FzZS1zZW5zaXRpdmUpLCBlLmcuIFwiY2xpY2tcIiwgXCJmaXJlXCIsIG9yIFwic3VibWl0XCIuXG4gICAgICogISN6aCDkuovku7bnsbvlnovjgIJcbiAgICAgKiBAcHJvcGVydHkgdHlwZVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy50eXBlID0gdHlwZTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gSW5kaWNhdGUgd2hldGhlciB0aGUgZXZlbnQgYnViYmxlcyB1cCB0aHJvdWdoIHRoZSB0cmVlIG9yIG5vdC5cbiAgICAgKiAhI3poIOihqOekuuivpeS6i+S7tuaYr+WQpui/m+ihjOWGkuazoeOAglxuICAgICAqIEBwcm9wZXJ0eSBidWJibGVzXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5idWJibGVzID0gISFidWJibGVzO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBBIHJlZmVyZW5jZSB0byB0aGUgdGFyZ2V0IHRvIHdoaWNoIHRoZSBldmVudCB3YXMgb3JpZ2luYWxseSBkaXNwYXRjaGVkLlxuICAgICAqICEjemgg5pyA5Yid5LqL5Lu26Kem5Y+R55qE55uu5qCHXG4gICAgICogQHByb3BlcnR5IHRhcmdldFxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy50YXJnZXQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBBIHJlZmVyZW5jZSB0byB0aGUgY3VycmVudGx5IHJlZ2lzdGVyZWQgdGFyZ2V0IGZvciB0aGUgZXZlbnQuXG4gICAgICogISN6aCDlvZPliY3nm67moIdcbiAgICAgKiBAcHJvcGVydHkgY3VycmVudFRhcmdldFxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBJbmRpY2F0ZXMgd2hpY2ggcGhhc2Ugb2YgdGhlIGV2ZW50IGZsb3cgaXMgY3VycmVudGx5IGJlaW5nIGV2YWx1YXRlZC5cbiAgICAgKiBSZXR1cm5zIGFuIGludGVnZXIgdmFsdWUgcmVwcmVzZW50ZWQgYnkgNCBjb25zdGFudHM6XG4gICAgICogIC0gRXZlbnQuTk9ORSA9IDBcbiAgICAgKiAgLSBFdmVudC5DQVBUVVJJTkdfUEhBU0UgPSAxXG4gICAgICogIC0gRXZlbnQuQVRfVEFSR0VUID0gMlxuICAgICAqICAtIEV2ZW50LkJVQkJMSU5HX1BIQVNFID0gM1xuICAgICAqIFRoZSBwaGFzZXMgYXJlIGV4cGxhaW5lZCBpbiB0aGUgW3NlY3Rpb24gMy4xLCBFdmVudCBkaXNwYXRjaCBhbmQgRE9NIGV2ZW50IGZsb3ddXG4gICAgICogKGh0dHA6Ly93d3cudzMub3JnL1RSL0RPTS1MZXZlbC0zLUV2ZW50cy8jZXZlbnQtZmxvdyksIG9mIHRoZSBET00gTGV2ZWwgMyBFdmVudHMgc3BlY2lmaWNhdGlvbi5cbiAgICAgKiAhI3poIOS6i+S7tumYtuautVxuICAgICAqIEBwcm9wZXJ0eSBldmVudFBoYXNlXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50UGhhc2UgPSAwO1xuXG4gICAgLypcbiAgICAgKiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3QgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCkgaGFzIGJlZW4gY2FsbGVkIG9uIHRoZSBldmVudC5cbiAgICAgKiBAcHJvcGVydHkgX3Byb3BhZ2F0aW9uU3RvcHBlZFxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fcHJvcGFnYXRpb25TdG9wcGVkID0gZmFsc2U7XG5cbiAgICAvKlxuICAgICAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCBldmVudC5zdG9wUHJvcGFnYXRpb25JbW1lZGlhdGUoKSBoYXMgYmVlbiBjYWxsZWQgb24gdGhlIGV2ZW50LlxuICAgICAqIEBwcm9wZXJ0eSBfcHJvcGFnYXRpb25JbW1lZGlhdGVTdG9wcGVkXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9wcm9wYWdhdGlvbkltbWVkaWF0ZVN0b3BwZWQgPSBmYWxzZTtcbn07XG5jYy5FdmVudC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IGNjLkV2ZW50LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXNldCB0aGUgZXZlbnQgZm9yIGJlaW5nIHN0b3JlZCBpbiB0aGUgb2JqZWN0IHBvb2wuXG4gICAgICogISN6aCDph43nva7lr7nosaHmsaDkuK3lrZjlgqjnmoTkuovku7bjgIJcbiAgICAgKiBAbWV0aG9kIHVudXNlXG4gICAgICogQHJldHVybnMge1N0cmluZ31cbiAgICAgKi9cbiAgICB1bnVzZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnR5cGUgPSBjYy5FdmVudC5OT19UWVBFO1xuICAgICAgICB0aGlzLnRhcmdldCA9IG51bGw7XG4gICAgICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XG4gICAgICAgIHRoaXMuZXZlbnRQaGFzZSA9IGNjLkV2ZW50Lk5PTkU7XG4gICAgICAgIHRoaXMuX3Byb3BhZ2F0aW9uU3RvcHBlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9wcm9wYWdhdGlvbkltbWVkaWF0ZVN0b3BwZWQgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXVzZSB0aGUgZXZlbnQgZm9yIGJlaW5nIHVzZWQgYWdhaW4gYnkgdGhlIG9iamVjdCBwb29sLlxuICAgICAqICEjemgg55So5LqO5a+56LGh5rGg5YaN5qyh5L2/55So55qE5LqL5Lu244CCXG4gICAgICogQG1ldGhvZCByZXVzZVxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAgICovXG4gICAgcmV1c2U6IGZ1bmN0aW9uICh0eXBlLCBidWJibGVzKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMuYnViYmxlcyA9IGJ1YmJsZXMgfHwgZmFsc2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU3RvcHMgcHJvcGFnYXRpb24gZm9yIGN1cnJlbnQgZXZlbnQuXG4gICAgICogISN6aCDlgZzmraLkvKDpgJLlvZPliY3kuovku7bjgIJcbiAgICAgKiBAbWV0aG9kIHN0b3BQcm9wYWdhdGlvblxuICAgICAqL1xuICAgIHN0b3BQcm9wYWdhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9wcm9wYWdhdGlvblN0b3BwZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFN0b3BzIHByb3BhZ2F0aW9uIGZvciBjdXJyZW50IGV2ZW50IGltbWVkaWF0ZWx5LFxuICAgICAqIHRoZSBldmVudCB3b24ndCBldmVuIGJlIGRpc3BhdGNoZWQgdG8gdGhlIGxpc3RlbmVycyBhdHRhY2hlZCBpbiB0aGUgY3VycmVudCB0YXJnZXQuXG4gICAgICogISN6aCDnq4vljbPlgZzmraLlvZPliY3kuovku7bnmoTkvKDpgJLvvIzkuovku7bnlJroh7PkuI3kvJrooqvliIbmtL7liLDmiYDov57mjqXnmoTlvZPliY3nm67moIfjgIJcbiAgICAgKiBAbWV0aG9kIHN0b3BQcm9wYWdhdGlvbkltbWVkaWF0ZVxuICAgICAqL1xuICAgIHN0b3BQcm9wYWdhdGlvbkltbWVkaWF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9wcm9wYWdhdGlvbkltbWVkaWF0ZVN0b3BwZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENoZWNrcyB3aGV0aGVyIHRoZSBldmVudCBoYXMgYmVlbiBzdG9wcGVkLlxuICAgICAqICEjemgg5qOA5p+l6K+l5LqL5Lu25piv5ZCm5bey57uP5YGc5q2i5Lyg6YCSLlxuICAgICAqIEBtZXRob2QgaXNTdG9wcGVkXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICovXG4gICAgaXNTdG9wcGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9wYWdhdGlvblN0b3BwZWQgfHwgdGhpcy5fcHJvcGFnYXRpb25JbW1lZGlhdGVTdG9wcGVkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogPHA+XG4gICAgICogICAgIEdldHMgY3VycmVudCB0YXJnZXQgb2YgdGhlIGV2ZW50ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgbm90ZTogSXQgb25seSBiZSBhdmFpbGFibGUgd2hlbiB0aGUgZXZlbnQgbGlzdGVuZXIgaXMgYXNzb2NpYXRlZCB3aXRoIG5vZGUuICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogICAgICAgICAgSXQgcmV0dXJucyAwIHdoZW4gdGhlIGxpc3RlbmVyIGlzIGFzc29jaWF0ZWQgd2l0aCBmaXhlZCBwcmlvcml0eS5cbiAgICAgKiA8L3A+XG4gICAgICogISN6aCDojrflj5blvZPliY3nm67moIfoioLngrlcbiAgICAgKiBAbWV0aG9kIGdldEN1cnJlbnRUYXJnZXRcbiAgICAgKiBAcmV0dXJucyB7Tm9kZX0gIFRoZSB0YXJnZXQgd2l0aCB3aGljaCB0aGUgZXZlbnQgYXNzb2NpYXRlcy5cbiAgICAgKi9cbiAgICBnZXRDdXJyZW50VGFyZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUYXJnZXQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0cyB0aGUgZXZlbnQgdHlwZS5cbiAgICAgKiAhI3poIOiOt+WPluS6i+S7tuexu+Wei1xuICAgICAqIEBtZXRob2QgZ2V0VHlwZVxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAgICovXG4gICAgZ2V0VHlwZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50eXBlO1xuICAgIH1cbn07XG5cbi8vZXZlbnQgdHlwZVxuLyoqXG4gKiAhI2VuIENvZGUgZm9yIGV2ZW50IHdpdGhvdXQgdHlwZS5cbiAqICEjemgg5rKh5pyJ57G75Z6L55qE5LqL5Lu2XG4gKiBAcHJvcGVydHkgTk9fVFlQRVxuICogQHN0YXRpY1xuICogQHR5cGUge3N0cmluZ31cbiAqL1xuY2MuRXZlbnQuTk9fVFlQRSA9ICdub190eXBlJztcblxuLyoqXG4gKiAhI2VuIFRoZSB0eXBlIGNvZGUgb2YgVG91Y2ggZXZlbnQuXG4gKiAhI3poIOinpuaRuOS6i+S7tuexu+Wei1xuICogQHByb3BlcnR5IFRPVUNIXG4gKiBAc3RhdGljXG4gKiBAdHlwZSB7U3RyaW5nfVxuICovXG5jYy5FdmVudC5UT1VDSCA9ICd0b3VjaCc7XG4vKipcbiAqICEjZW4gVGhlIHR5cGUgY29kZSBvZiBNb3VzZSBldmVudC5cbiAqICEjemgg6byg5qCH5LqL5Lu257G75Z6LXG4gKiBAcHJvcGVydHkgTU9VU0VcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKi9cbmNjLkV2ZW50Lk1PVVNFID0gJ21vdXNlJztcbi8qKlxuICogISNlbiBUaGUgdHlwZSBjb2RlIG9mIEtleWJvYXJkIGV2ZW50LlxuICogISN6aCDplK7nm5jkuovku7bnsbvlnotcbiAqIEBwcm9wZXJ0eSBLRVlCT0FSRFxuICogQHN0YXRpY1xuICogQHR5cGUge1N0cmluZ31cbiAqL1xuY2MuRXZlbnQuS0VZQk9BUkQgPSAna2V5Ym9hcmQnO1xuLyoqXG4gKiAhI2VuIFRoZSB0eXBlIGNvZGUgb2YgQWNjZWxlcmF0aW9uIGV2ZW50LlxuICogISN6aCDliqDpgJ/lmajkuovku7bnsbvlnotcbiAqIEBwcm9wZXJ0eSBBQ0NFTEVSQVRJT05cbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKi9cbmNjLkV2ZW50LkFDQ0VMRVJBVElPTiA9ICdhY2NlbGVyYXRpb24nO1xuXG4vL2V2ZW50IHBoYXNlXG4vKipcbiAqICEjZW4gRXZlbnRzIG5vdCBjdXJyZW50bHkgZGlzcGF0Y2hlZCBhcmUgaW4gdGhpcyBwaGFzZVxuICogISN6aCDlsJrmnKrmtL7lj5Hkuovku7bpmLbmrrVcbiAqIEBwcm9wZXJ0eSBOT05FXG4gKiBAdHlwZSB7TnVtYmVyfVxuICogQHN0YXRpY1xuICovXG5jYy5FdmVudC5OT05FID0gMDtcbi8qKlxuICogISNlblxuICogVGhlIGNhcHR1cmluZyBwaGFzZSBjb21wcmlzZXMgdGhlIGpvdXJuZXkgZnJvbSB0aGUgcm9vdCB0byB0aGUgbGFzdCBub2RlIGJlZm9yZSB0aGUgZXZlbnQgdGFyZ2V0J3Mgbm9kZVxuICogc2VlIGh0dHA6Ly93d3cudzMub3JnL1RSL0RPTS1MZXZlbC0zLUV2ZW50cy8jZXZlbnQtZmxvd1xuICogISN6aCDmjZXojrfpmLbmrrXvvIzljIXmi6zkuovku7bnm67moIfoioLngrnkuYvliY3ku47moLnoioLngrnliLDmnIDlkI7kuIDkuKroioLngrnnmoTov4fnqIvjgIJcbiAqIEBwcm9wZXJ0eSBDQVBUVVJJTkdfUEhBU0VcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKiBAc3RhdGljXG4gKi9cbmNjLkV2ZW50LkNBUFRVUklOR19QSEFTRSA9IDE7XG4vKipcbiAqICEjZW5cbiAqIFRoZSB0YXJnZXQgcGhhc2UgY29tcHJpc2VzIG9ubHkgdGhlIGV2ZW50IHRhcmdldCBub2RlXG4gKiBzZWUgaHR0cDovL3d3dy53My5vcmcvVFIvRE9NLUxldmVsLTMtRXZlbnRzLyNldmVudC1mbG93XG4gKiAhI3poIOebruagh+mYtuauteS7heWMheaLrOS6i+S7tuebruagh+iKgueCueOAglxuICogQHByb3BlcnR5IEFUX1RBUkdFVFxuICogQHR5cGUge051bWJlcn1cbiAqIEBzdGF0aWNcbiAqL1xuY2MuRXZlbnQuQVRfVEFSR0VUID0gMjtcbi8qKlxuICogISNlblxuICogVGhlIGJ1YmJsaW5nIHBoYXNlIGNvbXByaXNlcyBhbnkgc3Vic2VxdWVudCBub2RlcyBlbmNvdW50ZXJlZCBvbiB0aGUgcmV0dXJuIHRyaXAgdG8gdGhlIHJvb3Qgb2YgdGhlIGhpZXJhcmNoeVxuICogc2VlIGh0dHA6Ly93d3cudzMub3JnL1RSL0RPTS1MZXZlbC0zLUV2ZW50cy8jZXZlbnQtZmxvd1xuICogISN6aCDlhpLms6HpmLbmrrXvvIwg5YyF5ous5Zue56iL6YGH5Yiw5Yiw5bGC5qyh5qC56IqC54K555qE5Lu75L2V5ZCO57ut6IqC54K544CCXG4gKiBAcHJvcGVydHkgQlVCQkxJTkdfUEhBU0VcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKiBAc3RhdGljXG4gKi9cbmNjLkV2ZW50LkJVQkJMSU5HX1BIQVNFID0gMztcblxuLyoqXG4gKiAhI2VuIFRoZSBDdXN0b20gZXZlbnRcbiAqICEjemgg6Ieq5a6a5LmJ5LqL5Lu2XG4gKiBAY2xhc3MgRXZlbnQuRXZlbnRDdXN0b21cbiAqXG4gKiBAZXh0ZW5kcyBFdmVudFxuICovXG5cbi8qKlxuICogQG1ldGhvZCBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgKGNhc2Utc2Vuc2l0aXZlKSwgZS5nLiBcImNsaWNrXCIsIFwiZmlyZVwiLCBvciBcInN1Ym1pdFwiXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGJ1YmJsZXMgLSBBIGJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBldmVudCBidWJibGVzIHVwIHRocm91Z2ggdGhlIHRyZWUgb3Igbm90XG4gKi9cbnZhciBFdmVudEN1c3RvbSA9IGZ1bmN0aW9uICh0eXBlLCBidWJibGVzKSB7XG4gICAgY2MuRXZlbnQuY2FsbCh0aGlzLCB0eXBlLCBidWJibGVzKTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gQSByZWZlcmVuY2UgdG8gdGhlIGRldGFpbGVkIGRhdGEgb2YgdGhlIGV2ZW50XG4gICAgICogISN6aCDkuovku7bnmoTor6bnu4bmlbDmja5cbiAgICAgKiBAcHJvcGVydHkgZGV0YWlsXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmRldGFpbCA9IG51bGw7XG59O1xuXG5qcy5leHRlbmQoRXZlbnRDdXN0b20sIGNjLkV2ZW50KTtcblxuRXZlbnRDdXN0b20ucHJvdG90eXBlLnJlc2V0ID0gRXZlbnRDdXN0b207XG5cbi8qKlxuICogISNlbiBTZXRzIHVzZXIgZGF0YVxuICogISN6aCDorr7nva7nlKjmiLfmlbDmja5cbiAqIEBtZXRob2Qgc2V0VXNlckRhdGFcbiAqIEBwYXJhbSB7Kn0gZGF0YVxuICovXG5FdmVudEN1c3RvbS5wcm90b3R5cGUuc2V0VXNlckRhdGEgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuZGV0YWlsID0gZGF0YTtcbn07XG5cbi8qKlxuICogISNlbiBHZXRzIHVzZXIgZGF0YVxuICogISN6aCDojrflj5bnlKjmiLfmlbDmja5cbiAqIEBtZXRob2QgZ2V0VXNlckRhdGFcbiAqIEByZXR1cm5zIHsqfVxuICovXG5FdmVudEN1c3RvbS5wcm90b3R5cGUuZ2V0VXNlckRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGV0YWlsO1xufTtcblxuLyoqXG4gKiAhI2VuIEdldHMgZXZlbnQgbmFtZVxuICogISN6aCDojrflj5bkuovku7blkI3np7BcbiAqIEBtZXRob2QgZ2V0RXZlbnROYW1lXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5FdmVudEN1c3RvbS5wcm90b3R5cGUuZ2V0RXZlbnROYW1lID0gY2MuRXZlbnQucHJvdG90eXBlLmdldFR5cGU7XG5cbnZhciBNQVhfUE9PTF9TSVpFID0gMTA7XG52YXIgX2V2ZW50UG9vbCA9IG5ldyBqcy5Qb29sKE1BWF9QT09MX1NJWkUpO1xuRXZlbnRDdXN0b20ucHV0ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgX2V2ZW50UG9vbC5wdXQoZXZlbnQpO1xufTtcbkV2ZW50Q3VzdG9tLmdldCA9IGZ1bmN0aW9uICh0eXBlLCBidWJibGVzKSB7XG4gICAgdmFyIGV2ZW50ID0gX2V2ZW50UG9vbC5fZ2V0KCk7XG4gICAgaWYgKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnJlc2V0KHR5cGUsIGJ1YmJsZXMpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZXZlbnQgPSBuZXcgRXZlbnRDdXN0b20odHlwZSwgYnViYmxlcyk7XG4gICAgfVxuICAgIHJldHVybiBldmVudDtcbn07XG5cbmNjLkV2ZW50LkV2ZW50Q3VzdG9tID0gRXZlbnRDdXN0b207XG5cbm1vZHVsZS5leHBvcnRzID0gY2MuRXZlbnQ7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==