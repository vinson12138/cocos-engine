
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/event/system-event.js';
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
var EventTarget = require('../event/event-target');

var eventManager = require('../event-manager');

var inputManger = require('../platform/CCInputManager');

;
/**
 * !#en The event type supported by SystemEvent
 * !#zh SystemEvent 支持的事件类型
 * @class SystemEvent.EventType
 * @static
 * @namespace SystemEvent
 */

var EventType = cc.Enum({
  /**
   * !#en The event type for press the key down event, you can use its value directly: 'keydown'
   * !#zh 当按下按键时触发的事件
   * @property KEY_DOWN
   * @type {String}
   * @static
   */
  KEY_DOWN: 'keydown',

  /**
   * !#en The event type for press the key up event, you can use its value directly: 'keyup'
   * !#zh 当松开按键时触发的事件
   * @property KEY_UP
   * @type {String}
   * @static
   */
  KEY_UP: 'keyup',

  /**
   * !#en The event type for press the devicemotion event, you can use its value directly: 'devicemotion'
   * !#zh 重力感应
   * @property DEVICEMOTION
   * @type {String}
   * @static
   */
  DEVICEMOTION: 'devicemotion'
});
/**
 * !#en
 * The System event, it currently supports keyboard events and accelerometer events.<br>
 * You can get the SystemEvent instance with cc.systemEvent.<br>
 * !#zh
 * 系统事件，它目前支持按键事件和重力感应事件。<br>
 * 你可以通过 cc.systemEvent 获取到 SystemEvent 的实例。<br>
 * @class SystemEvent
 * @extends EventTarget
 * @example
 * cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
 * cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
 */

var keyboardListener = null;
var accelerationListener = null;
var SystemEvent = cc.Class({
  name: 'SystemEvent',
  "extends": EventTarget,
  statics: {
    EventType: EventType
  },

  /**
   * !#en whether enable accelerometer event
   * !#zh 是否启用加速度计事件
   * @method setAccelerometerEnabled
   * @param {Boolean} isEnable
   */
  setAccelerometerEnabled: function setAccelerometerEnabled(isEnable) {
    if (CC_EDITOR) {
      return;
    } // for iOS 13+


    if (isEnable && window.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission().then(function (response) {
        console.log("Device Motion Event request permission: " + response);
        inputManger.setAccelerometerEnabled(response === 'granted');
      });
    } else {
      inputManger.setAccelerometerEnabled(isEnable);
    }
  },

  /**
   * !#en set accelerometer interval value
   * !#zh 设置加速度计间隔值
   * @method setAccelerometerInterval
   * @param {Number} interval
   */
  setAccelerometerInterval: function setAccelerometerInterval(interval) {
    if (CC_EDITOR) {
      return;
    }

    inputManger.setAccelerometerInterval(interval);
  },
  on: function on(type, callback, target, once) {
    if (CC_EDITOR) {
      return;
    }

    this._super(type, callback, target, once); // Keyboard


    if (type === EventType.KEY_DOWN || type === EventType.KEY_UP) {
      if (!keyboardListener) {
        keyboardListener = cc.EventListener.create({
          event: cc.EventListener.KEYBOARD,
          onKeyPressed: function onKeyPressed(keyCode, event) {
            event.type = EventType.KEY_DOWN;
            cc.systemEvent.dispatchEvent(event);
          },
          onKeyReleased: function onKeyReleased(keyCode, event) {
            event.type = EventType.KEY_UP;
            cc.systemEvent.dispatchEvent(event);
          }
        });
      }

      if (!eventManager.hasEventListener(cc.EventListener.ListenerID.KEYBOARD)) {
        eventManager.addListener(keyboardListener, 1);
      }
    } // Acceleration


    if (type === EventType.DEVICEMOTION) {
      if (!accelerationListener) {
        accelerationListener = cc.EventListener.create({
          event: cc.EventListener.ACCELERATION,
          callback: function callback(acc, event) {
            event.type = EventType.DEVICEMOTION;
            cc.systemEvent.dispatchEvent(event);
          }
        });
      }

      if (!eventManager.hasEventListener(cc.EventListener.ListenerID.ACCELERATION)) {
        eventManager.addListener(accelerationListener, 1);
      }
    }
  },
  off: function off(type, callback, target) {
    if (CC_EDITOR) {
      return;
    }

    this._super(type, callback, target); // Keyboard


    if (keyboardListener && (type === EventType.KEY_DOWN || type === EventType.KEY_UP)) {
      var hasKeyDownEventListener = this.hasEventListener(EventType.KEY_DOWN);
      var hasKeyUpEventListener = this.hasEventListener(EventType.KEY_UP);

      if (!hasKeyDownEventListener && !hasKeyUpEventListener) {
        eventManager.removeListener(keyboardListener);
      }
    } // Acceleration


    if (accelerationListener && type === EventType.DEVICEMOTION) {
      eventManager.removeListener(accelerationListener);
    }
  }
});
cc.SystemEvent = module.exports = SystemEvent;
/**
 * @module cc
 */

/**
 * !#en The System event singleton for global usage
 * !#zh 系统事件单例，方便全局使用
 * @property systemEvent
 * @type {SystemEvent}
 */

cc.systemEvent = new cc.SystemEvent();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2V2ZW50L3N5c3RlbS1ldmVudC5qcyJdLCJuYW1lcyI6WyJFdmVudFRhcmdldCIsInJlcXVpcmUiLCJldmVudE1hbmFnZXIiLCJpbnB1dE1hbmdlciIsIkV2ZW50VHlwZSIsImNjIiwiRW51bSIsIktFWV9ET1dOIiwiS0VZX1VQIiwiREVWSUNFTU9USU9OIiwia2V5Ym9hcmRMaXN0ZW5lciIsImFjY2VsZXJhdGlvbkxpc3RlbmVyIiwiU3lzdGVtRXZlbnQiLCJDbGFzcyIsIm5hbWUiLCJzdGF0aWNzIiwic2V0QWNjZWxlcm9tZXRlckVuYWJsZWQiLCJpc0VuYWJsZSIsIkNDX0VESVRPUiIsIndpbmRvdyIsIkRldmljZU1vdGlvbkV2ZW50IiwicmVxdWVzdFBlcm1pc3Npb24iLCJ0aGVuIiwicmVzcG9uc2UiLCJjb25zb2xlIiwibG9nIiwic2V0QWNjZWxlcm9tZXRlckludGVydmFsIiwiaW50ZXJ2YWwiLCJvbiIsInR5cGUiLCJjYWxsYmFjayIsInRhcmdldCIsIm9uY2UiLCJfc3VwZXIiLCJFdmVudExpc3RlbmVyIiwiY3JlYXRlIiwiZXZlbnQiLCJLRVlCT0FSRCIsIm9uS2V5UHJlc3NlZCIsImtleUNvZGUiLCJzeXN0ZW1FdmVudCIsImRpc3BhdGNoRXZlbnQiLCJvbktleVJlbGVhc2VkIiwiaGFzRXZlbnRMaXN0ZW5lciIsIkxpc3RlbmVySUQiLCJhZGRMaXN0ZW5lciIsIkFDQ0VMRVJBVElPTiIsImFjYyIsIm9mZiIsImhhc0tleURvd25FdmVudExpc3RlbmVyIiwiaGFzS2V5VXBFdmVudExpc3RlbmVyIiwicmVtb3ZlTGlzdGVuZXIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0FQLEVBQUUsQ0FBQ21DLFdBQUgsR0FBaUIsSUFBSW5DLEVBQUUsQ0FBQ08sV0FBUCxFQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxudmFyIEV2ZW50VGFyZ2V0ID0gcmVxdWlyZSgnLi4vZXZlbnQvZXZlbnQtdGFyZ2V0Jyk7XG52YXIgZXZlbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi4vZXZlbnQtbWFuYWdlcicpO1xudmFyIGlucHV0TWFuZ2VyID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vQ0NJbnB1dE1hbmFnZXInKTs7XG5cbi8qKlxuICogISNlbiBUaGUgZXZlbnQgdHlwZSBzdXBwb3J0ZWQgYnkgU3lzdGVtRXZlbnRcbiAqICEjemggU3lzdGVtRXZlbnQg5pSv5oyB55qE5LqL5Lu257G75Z6LXG4gKiBAY2xhc3MgU3lzdGVtRXZlbnQuRXZlbnRUeXBlXG4gKiBAc3RhdGljXG4gKiBAbmFtZXNwYWNlIFN5c3RlbUV2ZW50XG4gKi9cbnZhciBFdmVudFR5cGUgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCB0eXBlIGZvciBwcmVzcyB0aGUga2V5IGRvd24gZXZlbnQsIHlvdSBjYW4gdXNlIGl0cyB2YWx1ZSBkaXJlY3RseTogJ2tleWRvd24nXG4gICAgICogISN6aCDlvZPmjInkuIvmjInplK7ml7bop6blj5HnmoTkuovku7ZcbiAgICAgKiBAcHJvcGVydHkgS0VZX0RPV05cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBLRVlfRE9XTjogJ2tleWRvd24nLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IHR5cGUgZm9yIHByZXNzIHRoZSBrZXkgdXAgZXZlbnQsIHlvdSBjYW4gdXNlIGl0cyB2YWx1ZSBkaXJlY3RseTogJ2tleXVwJ1xuICAgICAqICEjemgg5b2T5p2+5byA5oyJ6ZSu5pe26Kem5Y+R55qE5LqL5Lu2XG4gICAgICogQHByb3BlcnR5IEtFWV9VUFxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIEtFWV9VUDogJ2tleXVwJyxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCB0eXBlIGZvciBwcmVzcyB0aGUgZGV2aWNlbW90aW9uIGV2ZW50LCB5b3UgY2FuIHVzZSBpdHMgdmFsdWUgZGlyZWN0bHk6ICdkZXZpY2Vtb3Rpb24nXG4gICAgICogISN6aCDph43lipvmhJ/lupRcbiAgICAgKiBAcHJvcGVydHkgREVWSUNFTU9USU9OXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgREVWSUNFTU9USU9OOiAnZGV2aWNlbW90aW9uJ1xuXG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBUaGUgU3lzdGVtIGV2ZW50LCBpdCBjdXJyZW50bHkgc3VwcG9ydHMga2V5Ym9hcmQgZXZlbnRzIGFuZCBhY2NlbGVyb21ldGVyIGV2ZW50cy48YnI+XG4gKiBZb3UgY2FuIGdldCB0aGUgU3lzdGVtRXZlbnQgaW5zdGFuY2Ugd2l0aCBjYy5zeXN0ZW1FdmVudC48YnI+XG4gKiAhI3poXG4gKiDns7vnu5/kuovku7bvvIzlroPnm67liY3mlK/mjIHmjInplK7kuovku7blkozph43lipvmhJ/lupTkuovku7bjgII8YnI+XG4gKiDkvaDlj6/ku6XpgJrov4cgY2Muc3lzdGVtRXZlbnQg6I635Y+W5YiwIFN5c3RlbUV2ZW50IOeahOWunuS+i+OAgjxicj5cbiAqIEBjbGFzcyBTeXN0ZW1FdmVudFxuICogQGV4dGVuZHMgRXZlbnRUYXJnZXRcbiAqIEBleGFtcGxlXG4gKiBjYy5zeXN0ZW1FdmVudC5vbihjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuREVWSUNFTU9USU9OLCB0aGlzLm9uRGV2aWNlTW90aW9uRXZlbnQsIHRoaXMpO1xuICogY2Muc3lzdGVtRXZlbnQub2ZmKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5ERVZJQ0VNT1RJT04sIHRoaXMub25EZXZpY2VNb3Rpb25FdmVudCwgdGhpcyk7XG4gKi9cblxudmFyIGtleWJvYXJkTGlzdGVuZXIgPSBudWxsO1xudmFyIGFjY2VsZXJhdGlvbkxpc3RlbmVyID0gbnVsbDtcbnZhciBTeXN0ZW1FdmVudCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnU3lzdGVtRXZlbnQnLFxuICAgIGV4dGVuZHM6IEV2ZW50VGFyZ2V0LFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICBFdmVudFR5cGU6IEV2ZW50VHlwZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIHdoZXRoZXIgZW5hYmxlIGFjY2VsZXJvbWV0ZXIgZXZlbnRcbiAgICAgKiAhI3poIOaYr+WQpuWQr+eUqOWKoOmAn+W6puiuoeS6i+S7tlxuICAgICAqIEBtZXRob2Qgc2V0QWNjZWxlcm9tZXRlckVuYWJsZWRcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGlzRW5hYmxlXG4gICAgICovXG4gICAgc2V0QWNjZWxlcm9tZXRlckVuYWJsZWQ6IGZ1bmN0aW9uIChpc0VuYWJsZSkge1xuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmb3IgaU9TIDEzK1xuICAgICAgICBpZiAoaXNFbmFibGUgJiYgd2luZG93LkRldmljZU1vdGlvbkV2ZW50ICYmIHR5cGVvZiBEZXZpY2VNb3Rpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgRGV2aWNlTW90aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24oKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRGV2aWNlIE1vdGlvbiBFdmVudCByZXF1ZXN0IHBlcm1pc3Npb246ICR7cmVzcG9uc2V9YCk7XG4gICAgICAgICAgICAgICAgaW5wdXRNYW5nZXIuc2V0QWNjZWxlcm9tZXRlckVuYWJsZWQocmVzcG9uc2UgPT09ICdncmFudGVkJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlucHV0TWFuZ2VyLnNldEFjY2VsZXJvbWV0ZXJFbmFibGVkKGlzRW5hYmxlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIHNldCBhY2NlbGVyb21ldGVyIGludGVydmFsIHZhbHVlXG4gICAgICogISN6aCDorr7nva7liqDpgJ/luqborqHpl7TpmpTlgLxcbiAgICAgKiBAbWV0aG9kIHNldEFjY2VsZXJvbWV0ZXJJbnRlcnZhbFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbnRlcnZhbFxuICAgICAqL1xuICAgIHNldEFjY2VsZXJvbWV0ZXJJbnRlcnZhbDogZnVuY3Rpb24oaW50ZXJ2YWwpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlucHV0TWFuZ2VyLnNldEFjY2VsZXJvbWV0ZXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgfSxcblxuICAgIG9uOiBmdW5jdGlvbiAodHlwZSwgY2FsbGJhY2ssIHRhcmdldCwgb25jZSkge1xuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc3VwZXIodHlwZSwgY2FsbGJhY2ssIHRhcmdldCwgb25jZSk7XG5cbiAgICAgICAgLy8gS2V5Ym9hcmRcbiAgICAgICAgaWYgKHR5cGUgPT09IEV2ZW50VHlwZS5LRVlfRE9XTiB8fCB0eXBlID09PSBFdmVudFR5cGUuS0VZX1VQKSB7XG4gICAgICAgICAgICBpZiAoIWtleWJvYXJkTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBrZXlib2FyZExpc3RlbmVyID0gY2MuRXZlbnRMaXN0ZW5lci5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5LRVlCT0FSRCxcbiAgICAgICAgICAgICAgICAgICAgb25LZXlQcmVzc2VkOiBmdW5jdGlvbiAoa2V5Q29kZSwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnR5cGUgPSBFdmVudFR5cGUuS0VZX0RPV047XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5zeXN0ZW1FdmVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgb25LZXlSZWxlYXNlZDogZnVuY3Rpb24gKGtleUNvZGUsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC50eXBlID0gRXZlbnRUeXBlLktFWV9VUDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLnN5c3RlbUV2ZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWV2ZW50TWFuYWdlci5oYXNFdmVudExpc3RlbmVyKGNjLkV2ZW50TGlzdGVuZXIuTGlzdGVuZXJJRC5LRVlCT0FSRCkpIHtcbiAgICAgICAgICAgICAgICBldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIoa2V5Ym9hcmRMaXN0ZW5lciwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBY2NlbGVyYXRpb25cbiAgICAgICAgaWYgKHR5cGUgPT09IEV2ZW50VHlwZS5ERVZJQ0VNT1RJT04pIHtcbiAgICAgICAgICAgIGlmICghYWNjZWxlcmF0aW9uTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBhY2NlbGVyYXRpb25MaXN0ZW5lciA9IGNjLkV2ZW50TGlzdGVuZXIuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuQUNDRUxFUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gKGFjYywgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnR5cGUgPSBFdmVudFR5cGUuREVWSUNFTU9USU9OO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2Muc3lzdGVtRXZlbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghZXZlbnRNYW5hZ2VyLmhhc0V2ZW50TGlzdGVuZXIoY2MuRXZlbnRMaXN0ZW5lci5MaXN0ZW5lcklELkFDQ0VMRVJBVElPTikpIHtcbiAgICAgICAgICAgICAgICBldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIoYWNjZWxlcmF0aW9uTGlzdGVuZXIsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuXG4gICAgb2ZmOiBmdW5jdGlvbiAodHlwZSwgY2FsbGJhY2ssIHRhcmdldCkge1xuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc3VwZXIodHlwZSwgY2FsbGJhY2ssIHRhcmdldCk7XG5cbiAgICAgICAgLy8gS2V5Ym9hcmRcbiAgICAgICAgaWYgKGtleWJvYXJkTGlzdGVuZXIgJiYgKHR5cGUgPT09IEV2ZW50VHlwZS5LRVlfRE9XTiB8fCB0eXBlID09PSBFdmVudFR5cGUuS0VZX1VQKSkge1xuICAgICAgICAgICAgdmFyIGhhc0tleURvd25FdmVudExpc3RlbmVyID0gdGhpcy5oYXNFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5LRVlfRE9XTik7XG4gICAgICAgICAgICB2YXIgaGFzS2V5VXBFdmVudExpc3RlbmVyID0gdGhpcy5oYXNFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5LRVlfVVApO1xuICAgICAgICAgICAgaWYgKCFoYXNLZXlEb3duRXZlbnRMaXN0ZW5lciAmJiAhaGFzS2V5VXBFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLnJlbW92ZUxpc3RlbmVyKGtleWJvYXJkTGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWNjZWxlcmF0aW9uXG4gICAgICAgIGlmIChhY2NlbGVyYXRpb25MaXN0ZW5lciAmJiB0eXBlID09PSBFdmVudFR5cGUuREVWSUNFTU9USU9OKSB7XG4gICAgICAgICAgICBldmVudE1hbmFnZXIucmVtb3ZlTGlzdGVuZXIoYWNjZWxlcmF0aW9uTGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG59KTtcblxuY2MuU3lzdGVtRXZlbnQgPSBtb2R1bGUuZXhwb3J0cyA9IFN5c3RlbUV2ZW50O1xuLyoqXG4gKiBAbW9kdWxlIGNjXG4gKi9cblxuLyoqXG4gKiAhI2VuIFRoZSBTeXN0ZW0gZXZlbnQgc2luZ2xldG9uIGZvciBnbG9iYWwgdXNhZ2VcbiAqICEjemgg57O757uf5LqL5Lu25Y2V5L6L77yM5pa55L6/5YWo5bGA5L2/55SoXG4gKiBAcHJvcGVydHkgc3lzdGVtRXZlbnRcbiAqIEB0eXBlIHtTeXN0ZW1FdmVudH1cbiAqL1xuY2Muc3lzdGVtRXZlbnQgPSBuZXcgY2MuU3lzdGVtRXZlbnQoKTtcbiJdLCJzb3VyY2VSb290IjoiLyJ9