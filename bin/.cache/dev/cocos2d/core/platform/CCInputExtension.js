
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCInputExtension.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var eventManager = require('../event-manager');

var inputManager = require("./CCInputManager");

var PORTRAIT = 0;
var LANDSCAPE_LEFT = -90;
var PORTRAIT_UPSIDE_DOWN = 180;
var LANDSCAPE_RIGHT = 90;

var _didAccelerateFun;
/**
 * !#en the device accelerometer reports values for each axis in units of g-force.
 * !#zh 设备重力传感器传递的各个轴的数据。
 * @class Acceleration
 * @method constructor
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Number} timestamp
 */


cc.Acceleration = function (x, y, z, timestamp) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
  this.timestamp = timestamp || 0;
};
/**
 * whether enable accelerometer event
 * @method setAccelerometerEnabled
 * @param {Boolean} isEnable
 */


inputManager.setAccelerometerEnabled = function (isEnable) {
  var _t = this;

  if (_t._accelEnabled === isEnable) return;
  _t._accelEnabled = isEnable;
  var scheduler = cc.director.getScheduler();
  scheduler.enableForTarget(_t);

  if (_t._accelEnabled) {
    _t._registerAccelerometerEvent();

    _t._accelCurTime = 0;
    scheduler.scheduleUpdate(_t);
  } else {
    _t._unregisterAccelerometerEvent();

    _t._accelCurTime = 0;
    scheduler.unscheduleUpdate(_t);
  }

  if (CC_JSB || CC_RUNTIME) {
    jsb.device.setMotionEnabled(isEnable);
  }
};
/**
 * set accelerometer interval value
 * @method setAccelerometerInterval
 * @param {Number} interval
 */


inputManager.setAccelerometerInterval = function (interval) {
  if (this._accelInterval !== interval) {
    this._accelInterval = interval;

    if (CC_JSB || CC_RUNTIME) {
      jsb.device.setMotionInterval(interval);
    }
  }
};

inputManager._registerKeyboardEvent = function () {
  cc.game.canvas.addEventListener("keydown", function (e) {
    eventManager.dispatchEvent(new cc.Event.EventKeyboard(e.keyCode, true));
    e.stopPropagation();
    e.preventDefault();
  }, false);
  cc.game.canvas.addEventListener("keyup", function (e) {
    eventManager.dispatchEvent(new cc.Event.EventKeyboard(e.keyCode, false));
    e.stopPropagation();
    e.preventDefault();
  }, false);
};

inputManager._registerAccelerometerEvent = function () {
  var w = window,
      _t = this;

  _t._acceleration = new cc.Acceleration();
  _t._accelDeviceEvent = w.DeviceMotionEvent || w.DeviceOrientationEvent; //TODO fix DeviceMotionEvent bug on QQ Browser version 4.1 and below.

  if (cc.sys.browserType === cc.sys.BROWSER_TYPE_MOBILE_QQ) _t._accelDeviceEvent = window.DeviceOrientationEvent;

  var _deviceEventType = _t._accelDeviceEvent === w.DeviceMotionEvent ? "devicemotion" : "deviceorientation";

  var ua = navigator.userAgent;

  if (/Android/.test(ua) || /Adr/.test(ua) && cc.sys.browserType === cc.BROWSER_TYPE_UC) {
    _t._minus = -1;
  }

  _didAccelerateFun = _t.didAccelerate.bind(_t);
  w.addEventListener(_deviceEventType, _didAccelerateFun, false);
};

inputManager._unregisterAccelerometerEvent = function () {
  var w = window,
      _t = this;

  var _deviceEventType = _t._accelDeviceEvent === w.DeviceMotionEvent ? "devicemotion" : "deviceorientation";

  if (_didAccelerateFun) {
    w.removeEventListener(_deviceEventType, _didAccelerateFun, false);
  }
};

inputManager.didAccelerate = function (eventData) {
  var _t = this,
      w = window;

  if (!_t._accelEnabled) return;
  var mAcceleration = _t._acceleration;
  var x, y, z;

  if (_t._accelDeviceEvent === window.DeviceMotionEvent) {
    var eventAcceleration = eventData["accelerationIncludingGravity"];
    x = _t._accelMinus * eventAcceleration.x * 0.1;
    y = _t._accelMinus * eventAcceleration.y * 0.1;
    z = eventAcceleration.z * 0.1;
  } else {
    x = eventData["gamma"] / 90 * 0.981;
    y = -(eventData["beta"] / 90) * 0.981;
    z = eventData["alpha"] / 90 * 0.981;
  }

  if (cc.view._isRotated) {
    var tmp = x;
    x = -y;
    y = tmp;
  }

  mAcceleration.x = x;
  mAcceleration.y = y;
  mAcceleration.z = z;
  mAcceleration.timestamp = eventData.timeStamp || Date.now();
  var tmpX = mAcceleration.x;

  if (w.orientation === LANDSCAPE_RIGHT) {
    mAcceleration.x = -mAcceleration.y;
    mAcceleration.y = tmpX;
  } else if (w.orientation === LANDSCAPE_LEFT) {
    mAcceleration.x = mAcceleration.y;
    mAcceleration.y = -tmpX;
  } else if (w.orientation === PORTRAIT_UPSIDE_DOWN) {
    mAcceleration.x = -mAcceleration.x;
    mAcceleration.y = -mAcceleration.y;
  } // fix android acc values are opposite


  if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.browserType !== cc.sys.BROWSER_TYPE_MOBILE_QQ) {
    mAcceleration.x = -mAcceleration.x;
    mAcceleration.y = -mAcceleration.y;
  }
};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BsYXRmb3JtL0NDSW5wdXRFeHRlbnNpb24uanMiXSwibmFtZXMiOlsiZXZlbnRNYW5hZ2VyIiwicmVxdWlyZSIsImlucHV0TWFuYWdlciIsIlBPUlRSQUlUIiwiTEFORFNDQVBFX0xFRlQiLCJQT1JUUkFJVF9VUFNJREVfRE9XTiIsIkxBTkRTQ0FQRV9SSUdIVCIsIl9kaWRBY2NlbGVyYXRlRnVuIiwiY2MiLCJBY2NlbGVyYXRpb24iLCJ4IiwieSIsInoiLCJ0aW1lc3RhbXAiLCJzZXRBY2NlbGVyb21ldGVyRW5hYmxlZCIsImlzRW5hYmxlIiwiX3QiLCJfYWNjZWxFbmFibGVkIiwic2NoZWR1bGVyIiwiZGlyZWN0b3IiLCJnZXRTY2hlZHVsZXIiLCJlbmFibGVGb3JUYXJnZXQiLCJfcmVnaXN0ZXJBY2NlbGVyb21ldGVyRXZlbnQiLCJfYWNjZWxDdXJUaW1lIiwic2NoZWR1bGVVcGRhdGUiLCJfdW5yZWdpc3RlckFjY2VsZXJvbWV0ZXJFdmVudCIsInVuc2NoZWR1bGVVcGRhdGUiLCJDQ19KU0IiLCJDQ19SVU5USU1FIiwianNiIiwiZGV2aWNlIiwic2V0TW90aW9uRW5hYmxlZCIsInNldEFjY2VsZXJvbWV0ZXJJbnRlcnZhbCIsImludGVydmFsIiwiX2FjY2VsSW50ZXJ2YWwiLCJzZXRNb3Rpb25JbnRlcnZhbCIsIl9yZWdpc3RlcktleWJvYXJkRXZlbnQiLCJnYW1lIiwiY2FudmFzIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJkaXNwYXRjaEV2ZW50IiwiRXZlbnQiLCJFdmVudEtleWJvYXJkIiwia2V5Q29kZSIsInN0b3BQcm9wYWdhdGlvbiIsInByZXZlbnREZWZhdWx0IiwidyIsIndpbmRvdyIsIl9hY2NlbGVyYXRpb24iLCJfYWNjZWxEZXZpY2VFdmVudCIsIkRldmljZU1vdGlvbkV2ZW50IiwiRGV2aWNlT3JpZW50YXRpb25FdmVudCIsInN5cyIsImJyb3dzZXJUeXBlIiwiQlJPV1NFUl9UWVBFX01PQklMRV9RUSIsIl9kZXZpY2VFdmVudFR5cGUiLCJ1YSIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInRlc3QiLCJCUk9XU0VSX1RZUEVfVUMiLCJfbWludXMiLCJkaWRBY2NlbGVyYXRlIiwiYmluZCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJldmVudERhdGEiLCJtQWNjZWxlcmF0aW9uIiwiZXZlbnRBY2NlbGVyYXRpb24iLCJfYWNjZWxNaW51cyIsInZpZXciLCJfaXNSb3RhdGVkIiwidG1wIiwidGltZVN0YW1wIiwiRGF0ZSIsIm5vdyIsInRtcFgiLCJvcmllbnRhdGlvbiIsIm9zIiwiT1NfQU5EUk9JRCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsWUFBWSxHQUFHQyxPQUFPLENBQUMsa0JBQUQsQ0FBNUI7O0FBQ0EsSUFBTUMsWUFBWSxHQUFHRCxPQUFPLENBQUMsa0JBQUQsQ0FBNUI7O0FBRUEsSUFBTUUsUUFBUSxHQUFHLENBQWpCO0FBQ0EsSUFBTUMsY0FBYyxHQUFHLENBQUMsRUFBeEI7QUFDQSxJQUFNQyxvQkFBb0IsR0FBRyxHQUE3QjtBQUNBLElBQU1DLGVBQWUsR0FBRyxFQUF4Qjs7QUFFQSxJQUFJQyxpQkFBSjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQUMsRUFBRSxDQUFDQyxZQUFILEdBQWtCLFVBQVVDLENBQVYsRUFBYUMsQ0FBYixFQUFnQkMsQ0FBaEIsRUFBbUJDLFNBQW5CLEVBQThCO0FBQzVDLE9BQUtILENBQUwsR0FBU0EsQ0FBQyxJQUFJLENBQWQ7QUFDQSxPQUFLQyxDQUFMLEdBQVNBLENBQUMsSUFBSSxDQUFkO0FBQ0EsT0FBS0MsQ0FBTCxHQUFTQSxDQUFDLElB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QUFPMEIsVUFBckIsSUFDQXZFLEVBQUUsQ0FBQzZDLEdBQUgsQ0FBT0MsV0FBUCxLQUF1QjlDLEVBQUUsQ0FBQzZDLEdBQUgsQ0FBT0Usc0JBRGxDLEVBQzBEO0FBQ3REWSxJQUFBQSxhQUFhLENBQUN6RCxDQUFkLEdBQWtCLENBQUN5RCxhQUFhLENBQUN6RCxDQUFqQztBQUNBeUQsSUFBQUEsYUFBYSxDQUFDeEQsQ0FBZCxHQUFrQixDQUFDd0QsYUFBYSxDQUFDeEQsQ0FBakM7QUFDSDtBQUNKLENBaEREIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxMiBjb2NvczJkLXgub3JnXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBldmVudE1hbmFnZXIgPSByZXF1aXJlKCcuLi9ldmVudC1tYW5hZ2VyJyk7XG5jb25zdCBpbnB1dE1hbmFnZXIgPSByZXF1aXJlKFwiLi9DQ0lucHV0TWFuYWdlclwiKTtcblxuY29uc3QgUE9SVFJBSVQgPSAwO1xuY29uc3QgTEFORFNDQVBFX0xFRlQgPSAtOTA7XG5jb25zdCBQT1JUUkFJVF9VUFNJREVfRE9XTiA9IDE4MDtcbmNvbnN0IExBTkRTQ0FQRV9SSUdIVCA9IDkwO1xuXG5sZXQgX2RpZEFjY2VsZXJhdGVGdW47XG5cbi8qKlxuICogISNlbiB0aGUgZGV2aWNlIGFjY2VsZXJvbWV0ZXIgcmVwb3J0cyB2YWx1ZXMgZm9yIGVhY2ggYXhpcyBpbiB1bml0cyBvZiBnLWZvcmNlLlxuICogISN6aCDorr7lpIfph43lipvkvKDmhJ/lmajkvKDpgJLnmoTlkITkuKrovbTnmoTmlbDmja7jgIJcbiAqIEBjbGFzcyBBY2NlbGVyYXRpb25cbiAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gKiBAcGFyYW0ge051bWJlcn0geVxuICogQHBhcmFtIHtOdW1iZXJ9IHpcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lc3RhbXBcbiAqL1xuY2MuQWNjZWxlcmF0aW9uID0gZnVuY3Rpb24gKHgsIHksIHosIHRpbWVzdGFtcCkge1xuICAgIHRoaXMueCA9IHggfHwgMDtcbiAgICB0aGlzLnkgPSB5IHx8IDA7XG4gICAgdGhpcy56ID0geiB8fCAwO1xuICAgIHRoaXMudGltZXN0YW1wID0gdGltZXN0YW1wIHx8IDA7XG59O1xuXG4vKipcbiAqIHdoZXRoZXIgZW5hYmxlIGFjY2VsZXJvbWV0ZXIgZXZlbnRcbiAqIEBtZXRob2Qgc2V0QWNjZWxlcm9tZXRlckVuYWJsZWRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNFbmFibGVcbiAqL1xuaW5wdXRNYW5hZ2VyLnNldEFjY2VsZXJvbWV0ZXJFbmFibGVkID0gZnVuY3Rpb24gKGlzRW5hYmxlKSB7XG4gICAgbGV0IF90ID0gdGhpcztcbiAgICBpZihfdC5fYWNjZWxFbmFibGVkID09PSBpc0VuYWJsZSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgX3QuX2FjY2VsRW5hYmxlZCA9IGlzRW5hYmxlO1xuICAgIGxldCBzY2hlZHVsZXIgPSBjYy5kaXJlY3Rvci5nZXRTY2hlZHVsZXIoKTtcbiAgICBzY2hlZHVsZXIuZW5hYmxlRm9yVGFyZ2V0KF90KTtcbiAgICBpZiAoX3QuX2FjY2VsRW5hYmxlZCkge1xuICAgICAgICBfdC5fcmVnaXN0ZXJBY2NlbGVyb21ldGVyRXZlbnQoKTtcbiAgICAgICAgX3QuX2FjY2VsQ3VyVGltZSA9IDA7XG4gICAgICAgIHNjaGVkdWxlci5zY2hlZHVsZVVwZGF0ZShfdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgX3QuX3VucmVnaXN0ZXJBY2NlbGVyb21ldGVyRXZlbnQoKTtcbiAgICAgICAgX3QuX2FjY2VsQ3VyVGltZSA9IDA7XG4gICAgICAgIHNjaGVkdWxlci51bnNjaGVkdWxlVXBkYXRlKF90KTtcbiAgICB9XG5cbiAgICBpZiAoQ0NfSlNCIHx8IENDX1JVTlRJTUUpIHtcbiAgICAgICAganNiLmRldmljZS5zZXRNb3Rpb25FbmFibGVkKGlzRW5hYmxlKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIHNldCBhY2NlbGVyb21ldGVyIGludGVydmFsIHZhbHVlXG4gKiBAbWV0aG9kIHNldEFjY2VsZXJvbWV0ZXJJbnRlcnZhbFxuICogQHBhcmFtIHtOdW1iZXJ9IGludGVydmFsXG4gKi9cbmlucHV0TWFuYWdlci5zZXRBY2NlbGVyb21ldGVySW50ZXJ2YWwgPSBmdW5jdGlvbiAoaW50ZXJ2YWwpIHtcbiAgICBpZiAodGhpcy5fYWNjZWxJbnRlcnZhbCAhPT0gaW50ZXJ2YWwpIHtcbiAgICAgICAgdGhpcy5fYWNjZWxJbnRlcnZhbCA9IGludGVydmFsO1xuXG4gICAgICAgIGlmIChDQ19KU0IgfHwgQ0NfUlVOVElNRSkge1xuICAgICAgICAgICAganNiLmRldmljZS5zZXRNb3Rpb25JbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5pbnB1dE1hbmFnZXIuX3JlZ2lzdGVyS2V5Ym9hcmRFdmVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjYy5nYW1lLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBldmVudE1hbmFnZXIuZGlzcGF0Y2hFdmVudChuZXcgY2MuRXZlbnQuRXZlbnRLZXlib2FyZChlLmtleUNvZGUsIHRydWUpKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0sIGZhbHNlKTtcbiAgICBjYy5nYW1lLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZXZlbnRNYW5hZ2VyLmRpc3BhdGNoRXZlbnQobmV3IGNjLkV2ZW50LkV2ZW50S2V5Ym9hcmQoZS5rZXlDb2RlLCBmYWxzZSkpO1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSwgZmFsc2UpO1xufTtcblxuaW5wdXRNYW5hZ2VyLl9yZWdpc3RlckFjY2VsZXJvbWV0ZXJFdmVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgdyA9IHdpbmRvdywgX3QgPSB0aGlzO1xuICAgIF90Ll9hY2NlbGVyYXRpb24gPSBuZXcgY2MuQWNjZWxlcmF0aW9uKCk7XG4gICAgX3QuX2FjY2VsRGV2aWNlRXZlbnQgPSB3LkRldmljZU1vdGlvbkV2ZW50IHx8IHcuRGV2aWNlT3JpZW50YXRpb25FdmVudDtcblxuICAgIC8vVE9ETyBmaXggRGV2aWNlTW90aW9uRXZlbnQgYnVnIG9uIFFRIEJyb3dzZXIgdmVyc2lvbiA0LjEgYW5kIGJlbG93LlxuICAgIGlmIChjYy5zeXMuYnJvd3NlclR5cGUgPT09IGNjLnN5cy5CUk9XU0VSX1RZUEVfTU9CSUxFX1FRKVxuICAgICAgICBfdC5fYWNjZWxEZXZpY2VFdmVudCA9IHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50O1xuXG4gICAgbGV0IF9kZXZpY2VFdmVudFR5cGUgPSAoX3QuX2FjY2VsRGV2aWNlRXZlbnQgPT09IHcuRGV2aWNlTW90aW9uRXZlbnQpID8gXCJkZXZpY2Vtb3Rpb25cIiA6IFwiZGV2aWNlb3JpZW50YXRpb25cIjtcbiAgICBsZXQgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuICAgIGlmICgvQW5kcm9pZC8udGVzdCh1YSkgfHwgKC9BZHIvLnRlc3QodWEpICYmIGNjLnN5cy5icm93c2VyVHlwZSA9PT0gY2MuQlJPV1NFUl9UWVBFX1VDKSkge1xuICAgICAgICBfdC5fbWludXMgPSAtMTtcbiAgICB9XG5cbiAgICBfZGlkQWNjZWxlcmF0ZUZ1biA9IF90LmRpZEFjY2VsZXJhdGUuYmluZChfdCk7XG4gICAgdy5hZGRFdmVudExpc3RlbmVyKF9kZXZpY2VFdmVudFR5cGUsIF9kaWRBY2NlbGVyYXRlRnVuLCBmYWxzZSk7XG59O1xuXG5pbnB1dE1hbmFnZXIuX3VucmVnaXN0ZXJBY2NlbGVyb21ldGVyRXZlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHcgPSB3aW5kb3csIF90ID0gdGhpcztcbiAgICBsZXQgX2RldmljZUV2ZW50VHlwZSA9IChfdC5fYWNjZWxEZXZpY2VFdmVudCA9PT0gdy5EZXZpY2VNb3Rpb25FdmVudCkgPyBcImRldmljZW1vdGlvblwiIDogXCJkZXZpY2VvcmllbnRhdGlvblwiO1xuICAgIGlmIChfZGlkQWNjZWxlcmF0ZUZ1bikge1xuICAgICAgICB3LnJlbW92ZUV2ZW50TGlzdGVuZXIoX2RldmljZUV2ZW50VHlwZSwgX2RpZEFjY2VsZXJhdGVGdW4sIGZhbHNlKTtcbiAgICB9XG59O1xuXG5pbnB1dE1hbmFnZXIuZGlkQWNjZWxlcmF0ZSA9IGZ1bmN0aW9uIChldmVudERhdGEpIHtcbiAgICBsZXQgX3QgPSB0aGlzLCB3ID0gd2luZG93O1xuICAgIGlmICghX3QuX2FjY2VsRW5hYmxlZClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IG1BY2NlbGVyYXRpb24gPSBfdC5fYWNjZWxlcmF0aW9uO1xuXG4gICAgbGV0IHgsIHksIHo7XG5cbiAgICBpZiAoX3QuX2FjY2VsRGV2aWNlRXZlbnQgPT09IHdpbmRvdy5EZXZpY2VNb3Rpb25FdmVudCkge1xuICAgICAgICBsZXQgZXZlbnRBY2NlbGVyYXRpb24gPSBldmVudERhdGFbXCJhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5XCJdO1xuICAgICAgICB4ID0gX3QuX2FjY2VsTWludXMgKiBldmVudEFjY2VsZXJhdGlvbi54ICogMC4xO1xuICAgICAgICB5ID0gX3QuX2FjY2VsTWludXMgKiBldmVudEFjY2VsZXJhdGlvbi55ICogMC4xO1xuICAgICAgICB6ID0gZXZlbnRBY2NlbGVyYXRpb24ueiAqIDAuMTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB4ID0gKGV2ZW50RGF0YVtcImdhbW1hXCJdIC8gOTApICogMC45ODE7XG4gICAgICAgIHkgPSAtKGV2ZW50RGF0YVtcImJldGFcIl0gLyA5MCkgKiAwLjk4MTtcbiAgICAgICAgeiA9IChldmVudERhdGFbXCJhbHBoYVwiXSAvIDkwKSAqIDAuOTgxO1xuICAgIH1cblxuICAgIGlmIChjYy52aWV3Ll9pc1JvdGF0ZWQpIHtcbiAgICAgICAgbGV0IHRtcCA9IHg7XG4gICAgICAgIHggPSAteTtcbiAgICAgICAgeSA9IHRtcDtcbiAgICB9XG4gICAgbUFjY2VsZXJhdGlvbi54ID0geDtcbiAgICBtQWNjZWxlcmF0aW9uLnkgPSB5O1xuICAgIG1BY2NlbGVyYXRpb24ueiA9IHo7XG5cbiAgICBtQWNjZWxlcmF0aW9uLnRpbWVzdGFtcCA9IGV2ZW50RGF0YS50aW1lU3RhbXAgfHwgRGF0ZS5ub3coKTtcblxuICAgIGxldCB0bXBYID0gbUFjY2VsZXJhdGlvbi54O1xuICAgIGlmICh3Lm9yaWVudGF0aW9uID09PSBMQU5EU0NBUEVfUklHSFQpIHtcbiAgICAgICAgbUFjY2VsZXJhdGlvbi54ID0gLW1BY2NlbGVyYXRpb24ueTtcbiAgICAgICAgbUFjY2VsZXJhdGlvbi55ID0gdG1wWDtcbiAgICB9IGVsc2UgaWYgKHcub3JpZW50YXRpb24gPT09IExBTkRTQ0FQRV9MRUZUKSB7XG4gICAgICAgIG1BY2NlbGVyYXRpb24ueCA9IG1BY2NlbGVyYXRpb24ueTtcbiAgICAgICAgbUFjY2VsZXJhdGlvbi55ID0gLXRtcFg7XG4gICAgfSBlbHNlIGlmICh3Lm9yaWVudGF0aW9uID09PSBQT1JUUkFJVF9VUFNJREVfRE9XTikge1xuICAgICAgICBtQWNjZWxlcmF0aW9uLnggPSAtbUFjY2VsZXJhdGlvbi54O1xuICAgICAgICBtQWNjZWxlcmF0aW9uLnkgPSAtbUFjY2VsZXJhdGlvbi55O1xuICAgIH1cbiAgICAvLyBmaXggYW5kcm9pZCBhY2MgdmFsdWVzIGFyZSBvcHBvc2l0ZVxuICAgIGlmIChjYy5zeXMub3MgPT09IGNjLnN5cy5PU19BTkRST0lEICYmXG4gICAgICAgIGNjLnN5cy5icm93c2VyVHlwZSAhPT0gY2Muc3lzLkJST1dTRVJfVFlQRV9NT0JJTEVfUVEpIHtcbiAgICAgICAgbUFjY2VsZXJhdGlvbi54ID0gLW1BY2NlbGVyYXRpb24ueDtcbiAgICAgICAgbUFjY2VsZXJhdGlvbi55ID0gLW1BY2NlbGVyYXRpb24ueTtcbiAgICB9XG59OyJdLCJzb3VyY2VSb290IjoiLyJ9