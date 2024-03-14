
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCInputManager.js';
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
var macro = require('./CCMacro');

var sys = require('./CCSys');

var eventManager = require('../event-manager');

var TOUCH_TIMEOUT = macro.TOUCH_TIMEOUT;

var _vec2 = cc.v2();
/**
 *  This class manages all events of input. include: touch, mouse, accelerometer, keyboard
 */


var inputManager = {
  _mousePressed: false,
  _isRegisterEvent: false,
  _preTouchPoint: cc.v2(0, 0),
  _prevMousePoint: cc.v2(0, 0),
  _preTouchPool: [],
  _preTouchPoolPointer: 0,
  _touches: [],
  _touchesIntegerDict: {},
  _indexBitsUsed: 0,
  _maxTouches: 8,
  _accelEnabled: false,
  _accelInterval: 1 / 5,
  _accelMinus: 1,
  _accelCurTime: 0,
  _acceleration: null,
  _accelDeviceEvent: null,
  _canvasBoundingRect: {
    left: 0,
    top: 0,
    adjustedLeft: 0,
    adjustedTop: 0,
    width: 0,
    height: 0
  },
  _getUnUsedIndex: function _getUnUsedIndex() {
    var temp = this._indexBitsUsed;
    var now = cc.sys.now();

    for (var i = 0; i < this._maxTouches; i++) {
      if (!(temp & 0x00000001)) {
        this._indexBitsUsed |= 1 << i;
        return i;
      } else {
        var touch = this._touches[i];

        if (now - touch._lastModified > TOUCH_TIMEOUT) {
          this._removeUsedIndexBit(i);

          delete this._touchesIntegerDict[touch.getID()];
          return i;
        }
      }

      temp >>= 1;
    } // all bits are used


    return -1;
  },
  _removeUsedIndexBit: function _removeUsedIndexBit(index) {
    if (index < 0 || index >= this._maxTouches) return;
    var temp = 1 << index;
    temp = ~temp;
    this._indexBitsUsed &= temp;
  },
  _glView: null,
  _updateCanvasBoundingRect: function _updateCanvasBoundingRect() {
    var element = cc.game.canvas;
    var canvasBoundingRect = this._canvasBoundingRect;
    var docElem = document.documentElement;
    var leftOffset = window.pageXOffset - docElem.clientLeft;
    var topOffset = window.pageYOffset - docElem.clientTop;

    if (element.getBoundingClientRect) {
      var box = element.getBoundingClientRect();
      canvasBoundingRect.left = box.left + leftOffset;
      canvasBoundingRect.top = box.top + topOffset;
      canvasBoundingRect.width = box.width;
      canvasBoundingRect.height = box.height;
    } else if (element instanceof HTMLCanvasElement) {
      canvasBoundingRect.left = leftOffset;
      canvasBoundingRect.top = topOffset;
      canvasBoundingRect.width = element.width;
      canvasBoundingRect.height = element.height;
    } else {
      canvasBoundingRect.left = leftOffset;
      canvasBoundingRect.top = topOffset;
      canvasBoundingRect.width = parseInt(element.style.width);
      canvasBoundingRect.height = parseInt(element.style.height);
    }
  },

  /**
   * @method handleTouchesBegin
   * @param {Array} touches
   */
  handleTouchesBegin: function handleTouchesBegin(touches) {
    var selTouch,
        index,
        curTouch,
        touchID,
        handleTouches = [],
        locTouchIntDict = this._touchesIntegerDict,
        now = sys.now();

    for (var i = 0, len = touches.length; i < len; i++) {
      selTouch = touches[i];
      touchID = selTouch.getID();
      index = locTouchIntDict[touchID];

      if (index == null) {
        var unusedIndex = this._getUnUsedIndex();

        if (unusedIndex === -1) {
          cc.logID(2300, unusedIndex);
          continue;
        } //curTouch = this._touches[unusedIndex] = selTouch;


        curTouch = this._touches[unusedIndex] = new cc.Touch(selTouch._point.x, selTouch._point.y, selTouch.getID());
        curTouch._lastModified = now;

        curTouch._setPrevPoint(selTouch._prevPoint);

        locTouchIntDict[touchID] = unusedIndex;
        handleTouches.push(curTouch);
      }
    }

    if (handleTouches.length > 0) {
      this._glView._convertTouchesWithScale(handleTouches);

      var touchEvent = new cc.Event.EventTouch(handleTouches);
      touchEvent._eventCode = cc.Event.EventTouch.BEGAN;
      eventManager.dispatchEvent(touchEvent);
    }
  },

  /**
   * @method handleTouchesMove
   * @param {Array} touches
   */
  handleTouchesMove: function handleTouchesMove(touches) {
    var selTouch,
        index,
        touchID,
        handleTouches = [],
        locTouches = this._touches,
        now = sys.now();

    for (var i = 0, len = touches.length; i < len; i++) {
      selTouch = touches[i];
      touchID = selTouch.getID();
      index = this._touchesIntegerDict[touchID];

      if (index == null) {
        //cc.log("if the index doesn't exist, it is an error");
        continue;
      }

      if (locTouches[index]) {
        locTouches[index]._setPoint(selTouch._point);

        locTouches[index]._setPrevPoint(selTouch._prevPoint);

        locTouches[index]._lastModified = now;
        handleTouches.push(locTouches[index]);
      }
    }

    if (handleTouches.length > 0) {
      this._glView._convertTouchesWithScale(handleTouches);

      var touchEvent = new cc.Event.EventTouch(handleTouches);
      touchEvent._eventCode = cc.Event.EventTouch.MOVED;
      eventManager.dispatchEvent(touchEvent);
    }
  },

  /**
   * @method handleTouchesEnd
   * @param {Array} touches
   */
  handleTouchesEnd: function handleTouchesEnd(touches) {
    var handleTouches = this.getSetOfTouchesEndOrCancel(touches);

    if (handleTouches.length > 0) {
      this._glView._convertTouchesWithScale(handleTouches);

      var touchEvent = new cc.Event.EventTouch(handleTouches);
      touchEvent._eventCode = cc.Event.EventTouch.ENDED;
      eventManager.dispatchEvent(touchEvent);
    }

    this._preTouchPool.length = 0;
  },

  /**
   * @method handleTouchesCancel
   * @param {Array} touches
   */
  handleTouchesCancel: function handleTouchesCancel(touches) {
    var handleTouches = this.getSetOfTouchesEndOrCancel(touches);

    if (handleTouches.length > 0) {
      this._glView._convertTouchesWithScale(handleTouches);

      var touchEvent = new cc.Event.EventTouch(handleTouches);
      touchEvent._eventCode = cc.Event.EventTouch.CANCELED;
      eventManager.dispatchEvent(touchEvent);
    }

    this._preTouchPool.length = 0;
  },

  /**
   * @method getSetOfTouchesEndOrCancel
   * @param {Array} touches
   * @returns {Array}
   */
  getSetOfTouchesEndOrCancel: function getSetOfTouchesEndOrCancel(touches) {
    var selTouch,
        index,
        touchID,
        handleTouches = [],
        locTouches = this._touches,
        locTouchesIntDict = this._touchesIntegerDict;

    for (var i = 0, len = touches.length; i < len; i++) {
      selTouch = touches[i];
      touchID = selTouch.getID();
      index = locTouchesIntDict[touchID];

      if (index == null) {
        continue; //cc.log("if the index doesn't exist, it is an error");
      }

      if (locTouches[index]) {
        locTouches[index]._setPoint(selTouch._point);

        locTouches[index]._setPrevPoint(selTouch._prevPoint);

        handleTouches.push(locTouches[index]);

        this._removeUsedIndexBit(index);

        delete locTouchesIntDict[touchID];
      }
    }

    return handleTouches;
  },

  /**
   * @method getPreTouch
   * @param {Touch} touch
   * @return {Touch}
   */
  getPreTouch: function getPreTouch(touch) {
    var preTouch = null;
    var locPreTouchPool = this._preTouchPool;
    var id = touch.getID();

    for (var i = locPreTouchPool.length - 1; i >= 0; i--) {
      if (locPreTouchPool[i].getID() === id) {
        preTouch = locPreTouchPool[i];
        break;
      }
    }

    if (!preTouch) preTouch = touch;
    return preTouch;
  },

  /**
   * @method setPreTouch
   * @param {Touch} touch
   */
  setPreTouch: function setPreTouch(touch) {
    var find = false;
    var locPreTouchPool = this._preTouchPool;
    var id = touch.getID();

    for (var i = locPreTouchPool.length - 1; i >= 0; i--) {
      if (locPreTouchPool[i].getID() === id) {
        locPreTouchPool[i] = touch;
        find = true;
        break;
      }
    }

    if (!find) {
      if (locPreTouchPool.length <= 50) {
        locPreTouchPool.push(touch);
      } else {
        locPreTouchPool[this._preTouchPoolPointer] = touch;
        this._preTouchPoolPointer = (this._preTouchPoolPointer + 1) % 50;
      }
    }
  },

  /**
   * @method getTouchByXY
   * @param {Number} tx
   * @param {Number} ty
   * @param {Vec2} pos
   * @return {Touch}
   */
  getTouchByXY: function getTouchByXY(tx, ty, pos) {
    var locPreTouch = this._preTouchPoint;

    var location = this._glView.convertToLocationInView(tx, ty, pos);

    var touch = new cc.Touch(location.x, location.y, 0);

    touch._setPrevPoint(locPreTouch.x, locPreTouch.y);

    locPreTouch.x = location.x;
    locPreTouch.y = location.y;
    return touch;
  },

  /**
   * @method getMouseEvent
   * @param {Vec2} location
   * @param {Vec2} pos
   * @param {Number} eventType
   * @returns {Event.EventMouse}
   */
  getMouseEvent: function getMouseEvent(location, pos, eventType) {
    var locPreMouse = this._prevMousePoint;
    var mouseEvent = new cc.Event.EventMouse(eventType);

    mouseEvent._setPrevCursor(locPreMouse.x, locPreMouse.y);

    locPreMouse.x = location.x;
    locPreMouse.y = location.y;

    this._glView._convertMouseToLocationInView(locPreMouse, pos);

    mouseEvent.setLocation(locPreMouse.x, locPreMouse.y);
    return mouseEvent;
  },

  /**
   * @method getPointByEvent
   * @param {Touch} event
   * @param {Vec2} pos
   * @return {Vec2}
   */
  getPointByEvent: function getPointByEvent(event, pos) {
    // qq , uc and safari browser can't calculate pageY correctly, need to refresh canvas bounding rect
    if (cc.sys.browserType === cc.sys.BROWSER_TYPE_QQ || cc.sys.browserType === cc.sys.BROWSER_TYPE_UC || cc.sys.browserType === cc.sys.BROWSER_TYPE_SAFARI) {
      this._updateCanvasBoundingRect();
    }

    if (event.pageX != null) //not avalable in <= IE8
      return {
        x: event.pageX,
        y: event.pageY
      };
    pos.left -= document.body.scrollLeft;
    pos.top -= document.body.scrollTop;
    return {
      x: event.clientX,
      y: event.clientY
    };
  },

  /**
   * @method getTouchesByEvent
   * @param {Touch} event
   * @param {Vec2} pos
   * @returns {Array}
   */
  getTouchesByEvent: function getTouchesByEvent(event, pos) {
    var touchArr = [],
        locView = this._glView;
    var touch_event, touch, preLocation;
    var locPreTouch = this._preTouchPoint;
    var length = event.changedTouches.length;

    for (var i = 0; i < length; i++) {
      touch_event = event.changedTouches[i];

      if (touch_event) {
        var location = void 0;
        if (sys.BROWSER_TYPE_FIREFOX === sys.browserType) location = locView.convertToLocationInView(touch_event.pageX, touch_event.pageY, pos, _vec2);else location = locView.convertToLocationInView(touch_event.clientX, touch_event.clientY, pos, _vec2);

        if (touch_event.identifier != null) {
          touch = new cc.Touch(location.x, location.y, touch_event.identifier); //use Touch Pool

          preLocation = this.getPreTouch(touch).getLocation();

          touch._setPrevPoint(preLocation.x, preLocation.y);

          this.setPreTouch(touch);
        } else {
          touch = new cc.Touch(location.x, location.y);

          touch._setPrevPoint(locPreTouch.x, locPreTouch.y);
        }

        locPreTouch.x = location.x;
        locPreTouch.y = location.y;
        touchArr.push(touch);
      }
    }

    return touchArr;
  },

  /**
   * @method registerSystemEvent
   * @param {HTMLElement} element
   */
  registerSystemEvent: function registerSystemEvent(element) {
    if (this._isRegisterEvent) return;
    this._glView = cc.view;
    var selfPointer = this;
    var canvasBoundingRect = this._canvasBoundingRect;
    window.addEventListener('resize', this._updateCanvasBoundingRect.bind(this));
    var prohibition = sys.isMobile;
    var supportMouse = ('mouse' in sys.capabilities);
    var supportTouches = ('touches' in sys.capabilities);

    if (supportMouse) {
      //HACK
      //  - At the same time to trigger the ontouch event and onmouse event
      //  - The function will execute 2 times
      //The known browser:
      //  liebiao
      //  miui
      //  WECHAT
      if (!prohibition) {
        window.addEventListener('mousedown', function () {
          selfPointer._mousePressed = true;
        }, false);
        window.addEventListener('mouseup', function (event) {
          if (!selfPointer._mousePressed) return;
          selfPointer._mousePressed = false;
          var location = selfPointer.getPointByEvent(event, canvasBoundingRect);

          if (!cc.rect(canvasBoundingRect.left, canvasBoundingRect.top, canvasBoundingRect.width, canvasBoundingRect.height).contains(location)) {
            selfPointer.handleTouchesEnd([selfPointer.getTouchByXY(location.x, location.y, canvasBoundingRect)]);
            var mouseEvent = selfPointer.getMouseEvent(location, canvasBoundingRect, cc.Event.EventMouse.UP);
            mouseEvent.setButton(event.button);
            eventManager.dispatchEvent(mouseEvent);
          }
        }, false);
      } // register canvas mouse event


      var EventMouse = cc.Event.EventMouse;
      var _mouseEventsOnElement = [!prohibition && ["mousedown", EventMouse.DOWN, function (event, mouseEvent, location, canvasBoundingRect) {
        selfPointer._mousePressed = true;
        selfPointer.handleTouchesBegin([selfPointer.getTouchByXY(location.x, location.y, canvasBoundingRect)]);
        element.focus();
      }], !prohibition && ["mouseup", EventMouse.UP, function (event, mouseEvent, location, canvasBoundingRect) {
        selfPointer._mousePressed = false;
        selfPointer.handleTouchesEnd([selfPointer.getTouchByXY(location.x, location.y, canvasBoundingRect)]);
      }], !prohibition && ["mousemove", EventMouse.MOVE, function (event, mouseEvent, location, canvasBoundingRect) {
        selfPointer.handleTouchesMove([selfPointer.getTouchByXY(location.x, location.y, canvasBoundingRect)]);

        if (!selfPointer._mousePressed) {
          mouseEvent.setButton(null);
        }
      }], ["mousewheel", EventMouse.SCROLL, function (event, mouseEvent) {
        mouseEvent.setScrollData(0, event.wheelDelta);
      }],
      /* firefox fix */
      ["DOMMouseScroll", EventMouse.SCROLL, function (event, mouseEvent) {
        mouseEvent.setScrollData(0, event.detail * -120);
      }]];

      for (var i = 0; i < _mouseEventsOnElement.length; ++i) {
        var entry = _mouseEventsOnElement[i];

        if (entry) {
          (function () {
            var name = entry[0];
            var type = entry[1];
            var handler = entry[2];
            element.addEventListener(name, function (event) {
              var location = selfPointer.getPointByEvent(event, canvasBoundingRect);
              var mouseEvent = selfPointer.getMouseEvent(location, canvasBoundingRect, type);
              mouseEvent.setButton(event.button);
              handler(event, mouseEvent, location, canvasBoundingRect);
              eventManager.dispatchEvent(mouseEvent);
              event.stopPropagation();
              event.preventDefault();
            }, false);
          })();
        }
      }
    }

    if (window.navigator.msPointerEnabled) {
      var _pointerEventsMap = {
        "MSPointerDown": selfPointer.handleTouchesBegin,
        "MSPointerMove": selfPointer.handleTouchesMove,
        "MSPointerUp": selfPointer.handleTouchesEnd,
        "MSPointerCancel": selfPointer.handleTouchesCancel
      };

      var _loop = function _loop(eventName) {
        var touchEvent = _pointerEventsMap[eventName];
        element.addEventListener(eventName, function (event) {
          var documentElement = document.documentElement;
          canvasBoundingRect.adjustedLeft = canvasBoundingRect.left - documentElement.scrollLeft;
          canvasBoundingRect.adjustedTop = canvasBoundingRect.top - documentElement.scrollTop;
          touchEvent.call(selfPointer, [selfPointer.getTouchByXY(event.clientX, event.clientY, canvasBoundingRect)]);
          event.stopPropagation();
        }, false);
      };

      for (var eventName in _pointerEventsMap) {
        _loop(eventName);
      }
    } //register touch event


    if (supportTouches) {
      var _touchEventsMap = {
        "touchstart": function touchstart(touchesToHandle) {
          selfPointer.handleTouchesBegin(touchesToHandle);
          element.focus();
        },
        "touchmove": function touchmove(touchesToHandle) {
          selfPointer.handleTouchesMove(touchesToHandle);
        },
        "touchend": function touchend(touchesToHandle) {
          selfPointer.handleTouchesEnd(touchesToHandle);
        },
        "touchcancel": function touchcancel(touchesToHandle) {
          selfPointer.handleTouchesCancel(touchesToHandle);
        }
      };

      var registerTouchEvent = function registerTouchEvent(eventName) {
        var handler = _touchEventsMap[eventName];
        element.addEventListener(eventName, function (event) {
          if (!event.changedTouches) return;
          var body = document.body;
          canvasBoundingRect.adjustedLeft = canvasBoundingRect.left - (body.scrollLeft || window.scrollX || 0);
          canvasBoundingRect.adjustedTop = canvasBoundingRect.top - (body.scrollTop || window.scrollY || 0);
          handler(selfPointer.getTouchesByEvent(event, canvasBoundingRect));
          event.stopPropagation();
          event.preventDefault();
        }, false);
      };

      for (var _eventName in _touchEventsMap) {
        registerTouchEvent(_eventName);
      }
    }

    this._registerKeyboardEvent();

    this._isRegisterEvent = true;
  },
  _registerKeyboardEvent: function _registerKeyboardEvent() {},
  _registerAccelerometerEvent: function _registerAccelerometerEvent() {},

  /**
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    if (this._accelCurTime > this._accelInterval) {
      this._accelCurTime -= this._accelInterval;
      eventManager.dispatchEvent(new cc.Event.EventAcceleration(this._acceleration));
    }

    this._accelCurTime += dt;
  }
};
module.exports = cc.internal.inputManager = inputManager;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BsYXRmb3JtL0NDSW5wdXRNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbIm1hY3JvIiwicmVxdWlyZSIsInN5cyIsImV2ZW50TWFuYWdlciIsIlRPVUNIX1RJTUVPVVQiLCJfdmVjMiIsImNjIiwidjIiLCJpbnB1dE1hbmFnZXIiLCJfbW91c2VQcmVzc2VkIiwiX2lzUmVnaXN0ZXJFdmVudCIsIl9wcmVUb3VjaFBvaW50IiwiX3ByZXZNb3VzZVBvaW50IiwiX3ByZVRvdWNoUG9vbCIsIl9wcmVUb3VjaFBvb2xQb2ludGVyIiwiX3RvdWNoZXMiLCJfdG91Y2hlc0ludGVnZXJEaWN0IiwiX2luZGV4Qml0c1VzZWQiLCJfbWF4VG91Y2hlcyIsIl9hY2NlbEVuYWJsZWQiLCJfYWNjZWxJbnRlcnZhbCIsIl9hY2NlbE1pbnVzIiwiX2FjY2VsQ3VyVGltZSIsIl9hY2NlbGVyYXRpb24iLCJfYWNjZWxEZXZpY2VFdmVudCIsIl9jYW52YXNCb3VuZGluZ1JlY3QiLCJsZWZ0IiwidG9wIiwiYWRqdXN0ZWRMZWZ0IiwiYWRqdXN0ZWRUb3AiLCJ3aWR0aCIsImhlaWdodCIsIl9nZXRVblVzZWRJbmRleCIsInRlbXAiLCJub3ciLCJpIiwidG91Y2giLCJfbGFzdE1vZGlmaWVkIiwiX3JlbW92ZVVzZWRJbmRleEJpdCIsImdldElEIiwiaW5kZXgiLCJfZ2xWaWV3IiwiX3VwZGF0ZUNhbnZhc0JvdW5kaW5nUmVjdCIsImVsZW1lbnQiLCJnYW1lIiwiY2FudmFzIiwiY2FudmFzQm91bmRpbmdSZWN0IiwiZG9jRWxlbSIsImRvY3VtZW50IiwiZG9jdW1lbnRFbGVtZW50IiwibGVmdE9mZnNldCIsIndpbmRvdyIsInBhZ2VYT2Zmc2V0IiwiY2xpZW50TGVmdCIsInRvcE9mZnNldCIsInBhZ2VZT2Zmc2V0IiwiY2xpZW50VG9wIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiYm94IiwiSFRNTENhbnZhc0VsZW1lbnQiLCJwYXJzZUludCIsInN0eWxlIiwiaGFuZGxlVG91Y2hlc0JlZ2luIiwidG91Y2hlcyIsInNlbFRvdWNoIiwiY3VyVG91Y2giLCJ0b3VjaElEIiwiaGFuZGxlVG91Y2hlcyIsImxvY1RvdWNoSW50RGljdCIsImxlbiIsImxlbmd0aCIsInVudXNlZEluZGV4IiwibG9nSUQiLCJUb3VjaCIsIl9wb2ludCIsIngiLCJ5IiwiX3NldFByZXZQb2ludCIsIl9wcmV2UG9pbnQiLCJwdXNoIiwiX2NvbnZlcnRUb3VjaGVzV2l0aFNjYWxlIiwidG91Y2hFdmVudCIsIkV2ZW50IiwiRXZlbnRUb3VjaCIsIl9ldmVudENvZGUiLCJCRUdBTiIsImRpc3BhdGNoRXZlbnQiLCJoYW5kbGVUb3VjaGVzTW92ZSIsImxvY1RvdWNoZXMiLCJfc2V0UG9pbnQiLCJNT1ZFRCIsImhhbmRsZVRvdWNoZXNFbmQiLCJnZXRTZXRPZlRvdWNoZXNFbmRPckNhbmNlbCIsIkVOREVEIiwiaGFuZGxlVG91Y2hlc0NhbmNlbCIsIkNBTkNFTEVEIiwibG9jVG91Y2hlc0ludERpY3QiLCJnZXRQcmVUb3VjaCIsInByZVRvdWNoIiwibG9jUHJlVG91Y2hQb29sIiwiaWQiLCJzZXRQcmVUb3VjaCIsImZpbmQiLCJnZXRUb3VjaEJ5WFkiLCJ0eCIsInR5IiwicG9zIiwibG9jUHJlVG91Y2giLCJsb2NhdGlvbiIsImNvbnZlcnRUb0xvY2F0aW9uSW5WaWV3IiwiZ2V0TW91c2VFdmVudCIsImV2ZW50VHlwZSIsImxvY1ByZU1vdXNlIiwibW91c2VFdmVudCIsIkV2ZW50TW91c2UiLCJfc2V0UHJldkN1cnNvciIsIl9jb252ZXJ0TW91c2VUb0xvY2F0aW9uSW5WaWV3Iiwic2V0TG9jYXRpb24iLCJnZXRQb2ludEJ5RXZlbnQiLCJldmVudCIsImJyb3dzZXJUeXBlIiwiQlJPV1NFUl9UWVBFX1FRIiwiQlJPV1NFUl9UWVBFX1VDIiwiQlJPV1NFUl9UWVBFX1NBRkFSSSIsInBhZ2VYIiwicGFnZVkiLCJib2R5Iiwic2Nyb2xsTGVmdCIsInNjcm9sbFRvcCIsImNsaWVudFgiLCJjbGllbnRZIiwiZ2V0VG91Y2hlc0J5RXZlbnQiLCJ0b3VjaEFyciIsImxvY1ZpZXciLCJ0b3VjaF9ldmVudCIsInByZUxvY2F0aW9uIiwiY2hhbmdlZFRvdWNoZXMiLCJCUk9XU0VSX1RZUEVfRklSRUZPWCIsImlkZW50aWZpZXIiLCJnZXRMb2NhdGlvbiIsInJlZ2lzdGVyU3lzdGVtRXZlbnQiLCJ2aWV3Iiwic2VsZlBvaW50ZXIiLCJhZGRFdmVudExpc3RlbmVyIiwiYmluZCIsInByb2hpYml0aW9uIiwiaXNNb2JpbGUiLCJzdXBwb3J0TW91c2UiLCJjYXBhYmlsaXRpZXMiLCJzdXBwb3J0VG91Y2hlcyIsInJlY3QiLCJjb250YWlucyIsIlVQIiwic2V0QnV0dG9uIiwiYnV0dG9uIiwiX21vdXNlRXZlbnRzT25FbGVtZW50IiwiRE9XTiIsImZvY3VzIiwiTU9WRSIsIlNDUk9MTCIsInNldFNjcm9sbERhdGEiLCJ3aGVlbERlbHRhIiwiZGV0YWlsIiwiZW50cnkiLCJuYW1lIiwidHlwZSIsImhhbmRsZXIiLCJzdG9wUHJvcGFnYXRpb24iLCJwcmV2ZW50RGVmYXVsdCIsIm5hdmlnYXRvciIsIm1zUG9pbnRlckVuYWJsZWQiLCJfcG9pbnRlckV2ZW50c01hcCIsImV2ZW50TmFtZSIsImNhbGwiLCJfdG91Y2hFdmVudHNNYXAiLCJ0b3VjaGVzVG9IYW5kbGUiLCJyZWdpc3RlclRvdWNoRXZlbnQiLCJzY3JvbGxYIiwic2Nyb2xsWSIsIl9yZWdpc3RlcktleWJvYXJkRXZlbnQiLCJfcmVnaXN0ZXJBY2NlbGVyb21ldGVyRXZlbnQiLCJ1cGRhdGUiLCJkdCIsIkV2ZW50QWNjZWxlcmF0aW9uIiwibW9kdWxlIiwiZXhwb3J0cyIsImludGVybmFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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LGFBQUwsR0FBcUIsS0FBS0YsY0FBOUIsRUFBOEM7QUFDMUMsV0FBS0UsYUFBTCxJQUFzQixLQUFLRixjQUEzQjtBQUNBakIsTUFBQUEsWUFBWSxDQUFDbUYsYUFBYixDQUEyQixJQUFJaEYsRUFBRSxDQUFDNEUsS0FBSCxDQUFTcUcsaUJBQWIsQ0FBK0IsS0FBS2hLLGFBQXBDLENBQTNCO0FBQ0g7O0FBQ0QsU0FBS0QsYUFBTCxJQUFzQmdLLEVBQXRCO0FBQ0g7QUFqaEJjLENBQW5CO0FBb2hCQUUsTUFBTSxDQUFDQyxPQUFQLEdBQWlCbkwsRUFBRSxDQUFDb0wsUUFBSCxDQUFZbEwsWUFBWixHQUEyQkEsWUFBNUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMS0yMDEyIGNvY29zMmQteC5vcmdcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwOi8vd3d3LmNvY29zMmQteC5vcmdcblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IG1hY3JvID0gcmVxdWlyZSgnLi9DQ01hY3JvJyk7XG5jb25zdCBzeXMgPSByZXF1aXJlKCcuL0NDU3lzJyk7XG5jb25zdCBldmVudE1hbmFnZXIgPSByZXF1aXJlKCcuLi9ldmVudC1tYW5hZ2VyJyk7XG5cbmNvbnN0IFRPVUNIX1RJTUVPVVQgPSBtYWNyby5UT1VDSF9USU1FT1VUO1xuXG5sZXQgX3ZlYzIgPSBjYy52MigpO1xuXG4vKipcbiAqICBUaGlzIGNsYXNzIG1hbmFnZXMgYWxsIGV2ZW50cyBvZiBpbnB1dC4gaW5jbHVkZTogdG91Y2gsIG1vdXNlLCBhY2NlbGVyb21ldGVyLCBrZXlib2FyZFxuICovXG5sZXQgaW5wdXRNYW5hZ2VyID0ge1xuICAgIF9tb3VzZVByZXNzZWQ6IGZhbHNlLFxuXG4gICAgX2lzUmVnaXN0ZXJFdmVudDogZmFsc2UsXG5cbiAgICBfcHJlVG91Y2hQb2ludDogY2MudjIoMCwwKSxcbiAgICBfcHJldk1vdXNlUG9pbnQ6IGNjLnYyKDAsMCksXG5cbiAgICBfcHJlVG91Y2hQb29sOiBbXSxcbiAgICBfcHJlVG91Y2hQb29sUG9pbnRlcjogMCxcblxuICAgIF90b3VjaGVzOiBbXSxcbiAgICBfdG91Y2hlc0ludGVnZXJEaWN0Ont9LFxuXG4gICAgX2luZGV4Qml0c1VzZWQ6IDAsXG4gICAgX21heFRvdWNoZXM6IDgsXG5cbiAgICBfYWNjZWxFbmFibGVkOiBmYWxzZSxcbiAgICBfYWNjZWxJbnRlcnZhbDogMS81LFxuICAgIF9hY2NlbE1pbnVzOiAxLFxuICAgIF9hY2NlbEN1clRpbWU6IDAsXG4gICAgX2FjY2VsZXJhdGlvbjogbnVsbCxcbiAgICBfYWNjZWxEZXZpY2VFdmVudDogbnVsbCxcblxuICAgIF9jYW52YXNCb3VuZGluZ1JlY3Q6IHtcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICBhZGp1c3RlZExlZnQ6IDAsXG4gICAgICAgIGFkanVzdGVkVG9wOiAwLFxuICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgaGVpZ2h0OiAwLFxuICAgIH0sXG5cbiAgICBfZ2V0VW5Vc2VkSW5kZXggKCkge1xuICAgICAgICBsZXQgdGVtcCA9IHRoaXMuX2luZGV4Qml0c1VzZWQ7XG4gICAgICAgIGxldCBub3cgPSBjYy5zeXMubm93KCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9tYXhUb3VjaGVzOyBpKyspIHtcbiAgICAgICAgICAgIGlmICghKHRlbXAgJiAweDAwMDAwMDAxKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2luZGV4Qml0c1VzZWQgfD0gKDEgPDwgaSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgdG91Y2ggPSB0aGlzLl90b3VjaGVzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChub3cgLSB0b3VjaC5fbGFzdE1vZGlmaWVkID4gVE9VQ0hfVElNRU9VVCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVVc2VkSW5kZXhCaXQoaSk7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl90b3VjaGVzSW50ZWdlckRpY3RbdG91Y2guZ2V0SUQoKV07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlbXAgPj49IDE7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhbGwgYml0cyBhcmUgdXNlZFxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfSxcblxuICAgIF9yZW1vdmVVc2VkSW5kZXhCaXQgKGluZGV4KSB7XG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5fbWF4VG91Y2hlcylcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBsZXQgdGVtcCA9IDEgPDwgaW5kZXg7XG4gICAgICAgIHRlbXAgPSB+dGVtcDtcbiAgICAgICAgdGhpcy5faW5kZXhCaXRzVXNlZCAmPSB0ZW1wO1xuICAgIH0sXG5cbiAgICBfZ2xWaWV3OiBudWxsLFxuXG4gICAgX3VwZGF0ZUNhbnZhc0JvdW5kaW5nUmVjdCAoKSB7XG4gICAgICAgIGxldCBlbGVtZW50ID0gY2MuZ2FtZS5jYW52YXM7XG4gICAgICAgIGxldCBjYW52YXNCb3VuZGluZ1JlY3QgPSB0aGlzLl9jYW52YXNCb3VuZGluZ1JlY3Q7XG5cbiAgICAgICAgbGV0IGRvY0VsZW0gPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIGxldCBsZWZ0T2Zmc2V0ID0gd2luZG93LnBhZ2VYT2Zmc2V0IC0gZG9jRWxlbS5jbGllbnRMZWZ0O1xuICAgICAgICBsZXQgdG9wT2Zmc2V0ID0gd2luZG93LnBhZ2VZT2Zmc2V0IC0gZG9jRWxlbS5jbGllbnRUb3A7XG4gICAgICAgIGlmIChlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCkge1xuICAgICAgICAgICAgbGV0IGJveCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBjYW52YXNCb3VuZGluZ1JlY3QubGVmdCA9IGJveC5sZWZ0ICsgbGVmdE9mZnNldDtcbiAgICAgICAgICAgIGNhbnZhc0JvdW5kaW5nUmVjdC50b3AgPSBib3gudG9wICsgdG9wT2Zmc2V0O1xuICAgICAgICAgICAgY2FudmFzQm91bmRpbmdSZWN0LndpZHRoID0gYm94LndpZHRoO1xuICAgICAgICAgICAgY2FudmFzQm91bmRpbmdSZWN0LmhlaWdodCA9IGJveC5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxDYW52YXNFbGVtZW50KSB7XG4gICAgICAgICAgICBjYW52YXNCb3VuZGluZ1JlY3QubGVmdCA9IGxlZnRPZmZzZXQ7XG4gICAgICAgICAgICBjYW52YXNCb3VuZGluZ1JlY3QudG9wID0gdG9wT2Zmc2V0O1xuICAgICAgICAgICAgY2FudmFzQm91bmRpbmdSZWN0LndpZHRoID0gZWxlbWVudC53aWR0aDtcbiAgICAgICAgICAgIGNhbnZhc0JvdW5kaW5nUmVjdC5oZWlnaHQgPSBlbGVtZW50LmhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNhbnZhc0JvdW5kaW5nUmVjdC5sZWZ0ID0gbGVmdE9mZnNldDtcbiAgICAgICAgICAgIGNhbnZhc0JvdW5kaW5nUmVjdC50b3AgPSB0b3BPZmZzZXQ7XG4gICAgICAgICAgICBjYW52YXNCb3VuZGluZ1JlY3Qud2lkdGggPSBwYXJzZUludChlbGVtZW50LnN0eWxlLndpZHRoKTtcbiAgICAgICAgICAgIGNhbnZhc0JvdW5kaW5nUmVjdC5oZWlnaHQgPSBwYXJzZUludChlbGVtZW50LnN0eWxlLmhlaWdodCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBoYW5kbGVUb3VjaGVzQmVnaW5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSB0b3VjaGVzXG4gICAgICovXG4gICAgaGFuZGxlVG91Y2hlc0JlZ2luICh0b3VjaGVzKSB7XG4gICAgICAgIGxldCBzZWxUb3VjaCwgaW5kZXgsIGN1clRvdWNoLCB0b3VjaElELFxuICAgICAgICAgICAgaGFuZGxlVG91Y2hlcyA9IFtdLCBsb2NUb3VjaEludERpY3QgPSB0aGlzLl90b3VjaGVzSW50ZWdlckRpY3QsXG4gICAgICAgICAgICBub3cgPSBzeXMubm93KCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0b3VjaGVzLmxlbmd0aDsgaSA8IGxlbjsgaSArKykge1xuICAgICAgICAgICAgc2VsVG91Y2ggPSB0b3VjaGVzW2ldO1xuICAgICAgICAgICAgdG91Y2hJRCA9IHNlbFRvdWNoLmdldElEKCk7XG4gICAgICAgICAgICBpbmRleCA9IGxvY1RvdWNoSW50RGljdFt0b3VjaElEXTtcblxuICAgICAgICAgICAgaWYgKGluZGV4ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgdW51c2VkSW5kZXggPSB0aGlzLl9nZXRVblVzZWRJbmRleCgpO1xuICAgICAgICAgICAgICAgIGlmICh1bnVzZWRJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgY2MubG9nSUQoMjMwMCwgdW51c2VkSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9jdXJUb3VjaCA9IHRoaXMuX3RvdWNoZXNbdW51c2VkSW5kZXhdID0gc2VsVG91Y2g7XG4gICAgICAgICAgICAgICAgY3VyVG91Y2ggPSB0aGlzLl90b3VjaGVzW3VudXNlZEluZGV4XSA9IG5ldyBjYy5Ub3VjaChzZWxUb3VjaC5fcG9pbnQueCwgc2VsVG91Y2guX3BvaW50LnksIHNlbFRvdWNoLmdldElEKCkpO1xuICAgICAgICAgICAgICAgIGN1clRvdWNoLl9sYXN0TW9kaWZpZWQgPSBub3c7XG4gICAgICAgICAgICAgICAgY3VyVG91Y2guX3NldFByZXZQb2ludChzZWxUb3VjaC5fcHJldlBvaW50KTtcbiAgICAgICAgICAgICAgICBsb2NUb3VjaEludERpY3RbdG91Y2hJRF0gPSB1bnVzZWRJbmRleDtcbiAgICAgICAgICAgICAgICBoYW5kbGVUb3VjaGVzLnB1c2goY3VyVG91Y2gpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChoYW5kbGVUb3VjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2dsVmlldy5fY29udmVydFRvdWNoZXNXaXRoU2NhbGUoaGFuZGxlVG91Y2hlcyk7XG4gICAgICAgICAgICBsZXQgdG91Y2hFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudFRvdWNoKGhhbmRsZVRvdWNoZXMpO1xuICAgICAgICAgICAgdG91Y2hFdmVudC5fZXZlbnRDb2RlID0gY2MuRXZlbnQuRXZlbnRUb3VjaC5CRUdBTjtcbiAgICAgICAgICAgIGV2ZW50TWFuYWdlci5kaXNwYXRjaEV2ZW50KHRvdWNoRXZlbnQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgaGFuZGxlVG91Y2hlc01vdmVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSB0b3VjaGVzXG4gICAgICovXG4gICAgaGFuZGxlVG91Y2hlc01vdmUgKHRvdWNoZXMpIHtcbiAgICAgICAgbGV0IHNlbFRvdWNoLCBpbmRleCwgdG91Y2hJRCxcbiAgICAgICAgICAgIGhhbmRsZVRvdWNoZXMgPSBbXSwgbG9jVG91Y2hlcyA9IHRoaXMuX3RvdWNoZXMsXG4gICAgICAgICAgICBub3cgPSBzeXMubm93KCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0b3VjaGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBzZWxUb3VjaCA9IHRvdWNoZXNbaV07XG4gICAgICAgICAgICB0b3VjaElEID0gc2VsVG91Y2guZ2V0SUQoKTtcbiAgICAgICAgICAgIGluZGV4ID0gdGhpcy5fdG91Y2hlc0ludGVnZXJEaWN0W3RvdWNoSURdO1xuXG4gICAgICAgICAgICBpZiAoaW5kZXggPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vY2MubG9nKFwiaWYgdGhlIGluZGV4IGRvZXNuJ3QgZXhpc3QsIGl0IGlzIGFuIGVycm9yXCIpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxvY1RvdWNoZXNbaW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgbG9jVG91Y2hlc1tpbmRleF0uX3NldFBvaW50KHNlbFRvdWNoLl9wb2ludCk7XG4gICAgICAgICAgICAgICAgbG9jVG91Y2hlc1tpbmRleF0uX3NldFByZXZQb2ludChzZWxUb3VjaC5fcHJldlBvaW50KTtcbiAgICAgICAgICAgICAgICBsb2NUb3VjaGVzW2luZGV4XS5fbGFzdE1vZGlmaWVkID0gbm93O1xuICAgICAgICAgICAgICAgIGhhbmRsZVRvdWNoZXMucHVzaChsb2NUb3VjaGVzW2luZGV4XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhhbmRsZVRvdWNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5fZ2xWaWV3Ll9jb252ZXJ0VG91Y2hlc1dpdGhTY2FsZShoYW5kbGVUb3VjaGVzKTtcbiAgICAgICAgICAgIGxldCB0b3VjaEV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50VG91Y2goaGFuZGxlVG91Y2hlcyk7XG4gICAgICAgICAgICB0b3VjaEV2ZW50Ll9ldmVudENvZGUgPSBjYy5FdmVudC5FdmVudFRvdWNoLk1PVkVEO1xuICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLmRpc3BhdGNoRXZlbnQodG91Y2hFdmVudCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBoYW5kbGVUb3VjaGVzRW5kXG4gICAgICogQHBhcmFtIHtBcnJheX0gdG91Y2hlc1xuICAgICAqL1xuICAgIGhhbmRsZVRvdWNoZXNFbmQgKHRvdWNoZXMpIHtcbiAgICAgICAgbGV0IGhhbmRsZVRvdWNoZXMgPSB0aGlzLmdldFNldE9mVG91Y2hlc0VuZE9yQ2FuY2VsKHRvdWNoZXMpO1xuICAgICAgICBpZiAoaGFuZGxlVG91Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLl9nbFZpZXcuX2NvbnZlcnRUb3VjaGVzV2l0aFNjYWxlKGhhbmRsZVRvdWNoZXMpO1xuICAgICAgICAgICAgbGV0IHRvdWNoRXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRUb3VjaChoYW5kbGVUb3VjaGVzKTtcbiAgICAgICAgICAgIHRvdWNoRXZlbnQuX2V2ZW50Q29kZSA9IGNjLkV2ZW50LkV2ZW50VG91Y2guRU5ERUQ7XG4gICAgICAgICAgICBldmVudE1hbmFnZXIuZGlzcGF0Y2hFdmVudCh0b3VjaEV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9wcmVUb3VjaFBvb2wubGVuZ3RoID0gMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBoYW5kbGVUb3VjaGVzQ2FuY2VsXG4gICAgICogQHBhcmFtIHtBcnJheX0gdG91Y2hlc1xuICAgICAqL1xuICAgIGhhbmRsZVRvdWNoZXNDYW5jZWwgKHRvdWNoZXMpIHtcbiAgICAgICAgbGV0IGhhbmRsZVRvdWNoZXMgPSB0aGlzLmdldFNldE9mVG91Y2hlc0VuZE9yQ2FuY2VsKHRvdWNoZXMpO1xuICAgICAgICBpZiAoaGFuZGxlVG91Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLl9nbFZpZXcuX2NvbnZlcnRUb3VjaGVzV2l0aFNjYWxlKGhhbmRsZVRvdWNoZXMpO1xuICAgICAgICAgICAgbGV0IHRvdWNoRXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRUb3VjaChoYW5kbGVUb3VjaGVzKTtcbiAgICAgICAgICAgIHRvdWNoRXZlbnQuX2V2ZW50Q29kZSA9IGNjLkV2ZW50LkV2ZW50VG91Y2guQ0FOQ0VMRUQ7XG4gICAgICAgICAgICBldmVudE1hbmFnZXIuZGlzcGF0Y2hFdmVudCh0b3VjaEV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9wcmVUb3VjaFBvb2wubGVuZ3RoID0gMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBnZXRTZXRPZlRvdWNoZXNFbmRPckNhbmNlbFxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHRvdWNoZXNcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICovXG4gICAgZ2V0U2V0T2ZUb3VjaGVzRW5kT3JDYW5jZWwgKHRvdWNoZXMpIHtcbiAgICAgICAgbGV0IHNlbFRvdWNoLCBpbmRleCwgdG91Y2hJRCwgaGFuZGxlVG91Y2hlcyA9IFtdLCBsb2NUb3VjaGVzID0gdGhpcy5fdG91Y2hlcywgbG9jVG91Y2hlc0ludERpY3QgPSB0aGlzLl90b3VjaGVzSW50ZWdlckRpY3Q7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0b3VjaGVzLmxlbmd0aDsgaTwgbGVuOyBpICsrKSB7XG4gICAgICAgICAgICBzZWxUb3VjaCA9IHRvdWNoZXNbaV07XG4gICAgICAgICAgICB0b3VjaElEID0gc2VsVG91Y2guZ2V0SUQoKTtcbiAgICAgICAgICAgIGluZGV4ID0gbG9jVG91Y2hlc0ludERpY3RbdG91Y2hJRF07XG5cbiAgICAgICAgICAgIGlmIChpbmRleCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7ICAvL2NjLmxvZyhcImlmIHRoZSBpbmRleCBkb2Vzbid0IGV4aXN0LCBpdCBpcyBhbiBlcnJvclwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsb2NUb3VjaGVzW2luZGV4XSkge1xuICAgICAgICAgICAgICAgIGxvY1RvdWNoZXNbaW5kZXhdLl9zZXRQb2ludChzZWxUb3VjaC5fcG9pbnQpO1xuICAgICAgICAgICAgICAgIGxvY1RvdWNoZXNbaW5kZXhdLl9zZXRQcmV2UG9pbnQoc2VsVG91Y2guX3ByZXZQb2ludCk7XG4gICAgICAgICAgICAgICAgaGFuZGxlVG91Y2hlcy5wdXNoKGxvY1RvdWNoZXNbaW5kZXhdKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVVc2VkSW5kZXhCaXQoaW5kZXgpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBsb2NUb3VjaGVzSW50RGljdFt0b3VjaElEXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFuZGxlVG91Y2hlcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBnZXRQcmVUb3VjaFxuICAgICAqIEBwYXJhbSB7VG91Y2h9IHRvdWNoXG4gICAgICogQHJldHVybiB7VG91Y2h9XG4gICAgICovXG4gICAgZ2V0UHJlVG91Y2ggKHRvdWNoKSB7XG4gICAgICAgIGxldCBwcmVUb3VjaCA9IG51bGw7XG4gICAgICAgIGxldCBsb2NQcmVUb3VjaFBvb2wgPSB0aGlzLl9wcmVUb3VjaFBvb2w7XG4gICAgICAgIGxldCBpZCA9IHRvdWNoLmdldElEKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSBsb2NQcmVUb3VjaFBvb2wubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmIChsb2NQcmVUb3VjaFBvb2xbaV0uZ2V0SUQoKSA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICBwcmVUb3VjaCA9IGxvY1ByZVRvdWNoUG9vbFtpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIXByZVRvdWNoKVxuICAgICAgICAgICAgcHJlVG91Y2ggPSB0b3VjaDtcbiAgICAgICAgcmV0dXJuIHByZVRvdWNoO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIHNldFByZVRvdWNoXG4gICAgICogQHBhcmFtIHtUb3VjaH0gdG91Y2hcbiAgICAgKi9cbiAgICBzZXRQcmVUb3VjaCAodG91Y2gpIHtcbiAgICAgICAgbGV0IGZpbmQgPSBmYWxzZTtcbiAgICAgICAgbGV0IGxvY1ByZVRvdWNoUG9vbCA9IHRoaXMuX3ByZVRvdWNoUG9vbDtcbiAgICAgICAgbGV0IGlkID0gdG91Y2guZ2V0SUQoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IGxvY1ByZVRvdWNoUG9vbC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgaWYgKGxvY1ByZVRvdWNoUG9vbFtpXS5nZXRJRCgpID09PSBpZCkge1xuICAgICAgICAgICAgICAgIGxvY1ByZVRvdWNoUG9vbFtpXSA9IHRvdWNoO1xuICAgICAgICAgICAgICAgIGZpbmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghZmluZCkge1xuICAgICAgICAgICAgaWYgKGxvY1ByZVRvdWNoUG9vbC5sZW5ndGggPD0gNTApIHtcbiAgICAgICAgICAgICAgICBsb2NQcmVUb3VjaFBvb2wucHVzaCh0b3VjaCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvY1ByZVRvdWNoUG9vbFt0aGlzLl9wcmVUb3VjaFBvb2xQb2ludGVyXSA9IHRvdWNoO1xuICAgICAgICAgICAgICAgIHRoaXMuX3ByZVRvdWNoUG9vbFBvaW50ZXIgPSAodGhpcy5fcHJlVG91Y2hQb29sUG9pbnRlciArIDEpICUgNTA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBnZXRUb3VjaEJ5WFlcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdHhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdHlcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHBvc1xuICAgICAqIEByZXR1cm4ge1RvdWNofVxuICAgICAqL1xuICAgIGdldFRvdWNoQnlYWSAodHgsIHR5LCBwb3MpIHtcbiAgICAgICAgbGV0IGxvY1ByZVRvdWNoID0gdGhpcy5fcHJlVG91Y2hQb2ludDtcbiAgICAgICAgbGV0IGxvY2F0aW9uID0gdGhpcy5fZ2xWaWV3LmNvbnZlcnRUb0xvY2F0aW9uSW5WaWV3KHR4LCB0eSwgcG9zKTtcbiAgICAgICAgbGV0IHRvdWNoID0gbmV3IGNjLlRvdWNoKGxvY2F0aW9uLngsIGxvY2F0aW9uLnksIDApO1xuICAgICAgICB0b3VjaC5fc2V0UHJldlBvaW50KGxvY1ByZVRvdWNoLngsIGxvY1ByZVRvdWNoLnkpO1xuICAgICAgICBsb2NQcmVUb3VjaC54ID0gbG9jYXRpb24ueDtcbiAgICAgICAgbG9jUHJlVG91Y2gueSA9IGxvY2F0aW9uLnk7XG4gICAgICAgIHJldHVybiB0b3VjaDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBnZXRNb3VzZUV2ZW50XG4gICAgICogQHBhcmFtIHtWZWMyfSBsb2NhdGlvblxuICAgICAqIEBwYXJhbSB7VmVjMn0gcG9zXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGV2ZW50VHlwZVxuICAgICAqIEByZXR1cm5zIHtFdmVudC5FdmVudE1vdXNlfVxuICAgICAqL1xuICAgIGdldE1vdXNlRXZlbnQgKGxvY2F0aW9uLCBwb3MsIGV2ZW50VHlwZSkge1xuICAgICAgICBsZXQgbG9jUHJlTW91c2UgPSB0aGlzLl9wcmV2TW91c2VQb2ludDtcbiAgICAgICAgbGV0IG1vdXNlRXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRNb3VzZShldmVudFR5cGUpO1xuICAgICAgICBtb3VzZUV2ZW50Ll9zZXRQcmV2Q3Vyc29yKGxvY1ByZU1vdXNlLngsIGxvY1ByZU1vdXNlLnkpO1xuICAgICAgICBsb2NQcmVNb3VzZS54ID0gbG9jYXRpb24ueDtcbiAgICAgICAgbG9jUHJlTW91c2UueSA9IGxvY2F0aW9uLnk7XG4gICAgICAgIHRoaXMuX2dsVmlldy5fY29udmVydE1vdXNlVG9Mb2NhdGlvbkluVmlldyhsb2NQcmVNb3VzZSwgcG9zKTtcbiAgICAgICAgbW91c2VFdmVudC5zZXRMb2NhdGlvbihsb2NQcmVNb3VzZS54LCBsb2NQcmVNb3VzZS55KTtcbiAgICAgICAgcmV0dXJuIG1vdXNlRXZlbnQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgZ2V0UG9pbnRCeUV2ZW50XG4gICAgICogQHBhcmFtIHtUb3VjaH0gZXZlbnRcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHBvc1xuICAgICAqIEByZXR1cm4ge1ZlYzJ9XG4gICAgICovXG4gICAgZ2V0UG9pbnRCeUV2ZW50IChldmVudCwgcG9zKSB7XG4gICAgICAgIC8vIHFxICwgdWMgYW5kIHNhZmFyaSBicm93c2VyIGNhbid0IGNhbGN1bGF0ZSBwYWdlWSBjb3JyZWN0bHksIG5lZWQgdG8gcmVmcmVzaCBjYW52YXMgYm91bmRpbmcgcmVjdFxuICAgICAgICBpZiAoY2Muc3lzLmJyb3dzZXJUeXBlID09PSBjYy5zeXMuQlJPV1NFUl9UWVBFX1FRIFxuICAgICAgICAgICAgfHwgY2Muc3lzLmJyb3dzZXJUeXBlID09PSBjYy5zeXMuQlJPV1NFUl9UWVBFX1VDXG4gICAgICAgICAgICB8fCBjYy5zeXMuYnJvd3NlclR5cGUgPT09IGNjLnN5cy5CUk9XU0VSX1RZUEVfU0FGQVJJKSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVDYW52YXNCb3VuZGluZ1JlY3QoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKGV2ZW50LnBhZ2VYICE9IG51bGwpICAvL25vdCBhdmFsYWJsZSBpbiA8PSBJRThcbiAgICAgICAgICAgIHJldHVybiB7eDogZXZlbnQucGFnZVgsIHk6IGV2ZW50LnBhZ2VZfTtcblxuICAgICAgICBwb3MubGVmdCAtPSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQ7XG4gICAgICAgIHBvcy50b3AgLT0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XG5cbiAgICAgICAgcmV0dXJuIHt4OiBldmVudC5jbGllbnRYLCB5OiBldmVudC5jbGllbnRZfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBnZXRUb3VjaGVzQnlFdmVudFxuICAgICAqIEBwYXJhbSB7VG91Y2h9IGV2ZW50XG4gICAgICogQHBhcmFtIHtWZWMyfSBwb3NcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICovXG4gICAgZ2V0VG91Y2hlc0J5RXZlbnQgKGV2ZW50LCBwb3MpIHtcbiAgICAgICAgbGV0IHRvdWNoQXJyID0gW10sIGxvY1ZpZXcgPSB0aGlzLl9nbFZpZXc7XG4gICAgICAgIGxldCB0b3VjaF9ldmVudCwgdG91Y2gsIHByZUxvY2F0aW9uO1xuICAgICAgICBsZXQgbG9jUHJlVG91Y2ggPSB0aGlzLl9wcmVUb3VjaFBvaW50O1xuXG4gICAgICAgIGxldCBsZW5ndGggPSBldmVudC5jaGFuZ2VkVG91Y2hlcy5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRvdWNoX2V2ZW50ID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbaV07XG4gICAgICAgICAgICBpZiAodG91Y2hfZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBsZXQgbG9jYXRpb247XG4gICAgICAgICAgICAgICAgaWYgKHN5cy5CUk9XU0VSX1RZUEVfRklSRUZPWCA9PT0gc3lzLmJyb3dzZXJUeXBlKVxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbiA9IGxvY1ZpZXcuY29udmVydFRvTG9jYXRpb25JblZpZXcodG91Y2hfZXZlbnQucGFnZVgsIHRvdWNoX2V2ZW50LnBhZ2VZLCBwb3MsIF92ZWMyKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uID0gbG9jVmlldy5jb252ZXJ0VG9Mb2NhdGlvbkluVmlldyh0b3VjaF9ldmVudC5jbGllbnRYLCB0b3VjaF9ldmVudC5jbGllbnRZLCBwb3MsIF92ZWMyKTtcbiAgICAgICAgICAgICAgICBpZiAodG91Y2hfZXZlbnQuaWRlbnRpZmllciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvdWNoID0gbmV3IGNjLlRvdWNoKGxvY2F0aW9uLngsIGxvY2F0aW9uLnksIHRvdWNoX2V2ZW50LmlkZW50aWZpZXIpO1xuICAgICAgICAgICAgICAgICAgICAvL3VzZSBUb3VjaCBQb29sXG4gICAgICAgICAgICAgICAgICAgIHByZUxvY2F0aW9uID0gdGhpcy5nZXRQcmVUb3VjaCh0b3VjaCkuZ2V0TG9jYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgdG91Y2guX3NldFByZXZQb2ludChwcmVMb2NhdGlvbi54LCBwcmVMb2NhdGlvbi55KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRQcmVUb3VjaCh0b3VjaCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdG91Y2ggPSBuZXcgY2MuVG91Y2gobG9jYXRpb24ueCwgbG9jYXRpb24ueSk7XG4gICAgICAgICAgICAgICAgICAgIHRvdWNoLl9zZXRQcmV2UG9pbnQobG9jUHJlVG91Y2gueCwgbG9jUHJlVG91Y2gueSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxvY1ByZVRvdWNoLnggPSBsb2NhdGlvbi54O1xuICAgICAgICAgICAgICAgIGxvY1ByZVRvdWNoLnkgPSBsb2NhdGlvbi55O1xuICAgICAgICAgICAgICAgIHRvdWNoQXJyLnB1c2godG91Y2gpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0b3VjaEFycjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCByZWdpc3RlclN5c3RlbUV2ZW50XG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAqL1xuICAgIHJlZ2lzdGVyU3lzdGVtRXZlbnQgKGVsZW1lbnQpIHtcbiAgICAgICAgaWYodGhpcy5faXNSZWdpc3RlckV2ZW50KSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5fZ2xWaWV3ID0gY2MudmlldztcbiAgICAgICAgbGV0IHNlbGZQb2ludGVyID0gdGhpcztcbiAgICAgICAgbGV0IGNhbnZhc0JvdW5kaW5nUmVjdCA9IHRoaXMuX2NhbnZhc0JvdW5kaW5nUmVjdDtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fdXBkYXRlQ2FudmFzQm91bmRpbmdSZWN0LmJpbmQodGhpcykpO1xuXG4gICAgICAgIGxldCBwcm9oaWJpdGlvbiA9IHN5cy5pc01vYmlsZTtcbiAgICAgICAgbGV0IHN1cHBvcnRNb3VzZSA9ICgnbW91c2UnIGluIHN5cy5jYXBhYmlsaXRpZXMpO1xuICAgICAgICBsZXQgc3VwcG9ydFRvdWNoZXMgPSAoJ3RvdWNoZXMnIGluIHN5cy5jYXBhYmlsaXRpZXMpO1xuXG4gICAgICAgIGlmIChzdXBwb3J0TW91c2UpIHtcbiAgICAgICAgICAgIC8vSEFDS1xuICAgICAgICAgICAgLy8gIC0gQXQgdGhlIHNhbWUgdGltZSB0byB0cmlnZ2VyIHRoZSBvbnRvdWNoIGV2ZW50IGFuZCBvbm1vdXNlIGV2ZW50XG4gICAgICAgICAgICAvLyAgLSBUaGUgZnVuY3Rpb24gd2lsbCBleGVjdXRlIDIgdGltZXNcbiAgICAgICAgICAgIC8vVGhlIGtub3duIGJyb3dzZXI6XG4gICAgICAgICAgICAvLyAgbGllYmlhb1xuICAgICAgICAgICAgLy8gIG1pdWlcbiAgICAgICAgICAgIC8vICBXRUNIQVRcbiAgICAgICAgICAgIGlmICghcHJvaGliaXRpb24pIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmUG9pbnRlci5fbW91c2VQcmVzc2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9LCBmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXNlbGZQb2ludGVyLl9tb3VzZVByZXNzZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBzZWxmUG9pbnRlci5fbW91c2VQcmVzc2VkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGxvY2F0aW9uID0gc2VsZlBvaW50ZXIuZ2V0UG9pbnRCeUV2ZW50KGV2ZW50LCBjYW52YXNCb3VuZGluZ1JlY3QpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNjLnJlY3QoY2FudmFzQm91bmRpbmdSZWN0LmxlZnQsIGNhbnZhc0JvdW5kaW5nUmVjdC50b3AsIGNhbnZhc0JvdW5kaW5nUmVjdC53aWR0aCwgY2FudmFzQm91bmRpbmdSZWN0LmhlaWdodCkuY29udGFpbnMobG9jYXRpb24pKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGZQb2ludGVyLmhhbmRsZVRvdWNoZXNFbmQoW3NlbGZQb2ludGVyLmdldFRvdWNoQnlYWShsb2NhdGlvbi54LCBsb2NhdGlvbi55LCBjYW52YXNCb3VuZGluZ1JlY3QpXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtb3VzZUV2ZW50ID0gc2VsZlBvaW50ZXIuZ2V0TW91c2VFdmVudChsb2NhdGlvbiwgY2FudmFzQm91bmRpbmdSZWN0LCBjYy5FdmVudC5FdmVudE1vdXNlLlVQKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdXNlRXZlbnQuc2V0QnV0dG9uKGV2ZW50LmJ1dHRvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudE1hbmFnZXIuZGlzcGF0Y2hFdmVudChtb3VzZUV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcmVnaXN0ZXIgY2FudmFzIG1vdXNlIGV2ZW50XG4gICAgICAgICAgICBsZXQgRXZlbnRNb3VzZSA9IGNjLkV2ZW50LkV2ZW50TW91c2U7XG4gICAgICAgICAgICBsZXQgX21vdXNlRXZlbnRzT25FbGVtZW50ID0gW1xuICAgICAgICAgICAgICAgICFwcm9oaWJpdGlvbiAmJiBbXCJtb3VzZWRvd25cIiwgRXZlbnRNb3VzZS5ET1dOLCBmdW5jdGlvbiAoZXZlbnQsIG1vdXNlRXZlbnQsIGxvY2F0aW9uLCBjYW52YXNCb3VuZGluZ1JlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZlBvaW50ZXIuX21vdXNlUHJlc3NlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHNlbGZQb2ludGVyLmhhbmRsZVRvdWNoZXNCZWdpbihbc2VsZlBvaW50ZXIuZ2V0VG91Y2hCeVhZKGxvY2F0aW9uLngsIGxvY2F0aW9uLnksIGNhbnZhc0JvdW5kaW5nUmVjdCldKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgICFwcm9oaWJpdGlvbiAmJiBbXCJtb3VzZXVwXCIsIEV2ZW50TW91c2UuVVAsIGZ1bmN0aW9uIChldmVudCwgbW91c2VFdmVudCwgbG9jYXRpb24sIGNhbnZhc0JvdW5kaW5nUmVjdCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmUG9pbnRlci5fbW91c2VQcmVzc2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHNlbGZQb2ludGVyLmhhbmRsZVRvdWNoZXNFbmQoW3NlbGZQb2ludGVyLmdldFRvdWNoQnlYWShsb2NhdGlvbi54LCBsb2NhdGlvbi55LCBjYW52YXNCb3VuZGluZ1JlY3QpXSk7XG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgIXByb2hpYml0aW9uICYmIFtcIm1vdXNlbW92ZVwiLCBFdmVudE1vdXNlLk1PVkUsIGZ1bmN0aW9uIChldmVudCwgbW91c2VFdmVudCwgbG9jYXRpb24sIGNhbnZhc0JvdW5kaW5nUmVjdCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmUG9pbnRlci5oYW5kbGVUb3VjaGVzTW92ZShbc2VsZlBvaW50ZXIuZ2V0VG91Y2hCeVhZKGxvY2F0aW9uLngsIGxvY2F0aW9uLnksIGNhbnZhc0JvdW5kaW5nUmVjdCldKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWxmUG9pbnRlci5fbW91c2VQcmVzc2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb3VzZUV2ZW50LnNldEJ1dHRvbihudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgIFtcIm1vdXNld2hlZWxcIiwgRXZlbnRNb3VzZS5TQ1JPTEwsIGZ1bmN0aW9uIChldmVudCwgbW91c2VFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICBtb3VzZUV2ZW50LnNldFNjcm9sbERhdGEoMCwgZXZlbnQud2hlZWxEZWx0YSk7XG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgLyogZmlyZWZveCBmaXggKi9cbiAgICAgICAgICAgICAgICBbXCJET01Nb3VzZVNjcm9sbFwiLCBFdmVudE1vdXNlLlNDUk9MTCwgZnVuY3Rpb24gKGV2ZW50LCBtb3VzZUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdXNlRXZlbnQuc2V0U2Nyb2xsRGF0YSgwLCBldmVudC5kZXRhaWwgKiAtMTIwKTtcbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgX21vdXNlRXZlbnRzT25FbGVtZW50Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGVudHJ5ID0gX21vdXNlRXZlbnRzT25FbGVtZW50W2ldO1xuICAgICAgICAgICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGVudHJ5WzBdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdHlwZSA9IGVudHJ5WzFdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgaGFuZGxlciA9IGVudHJ5WzJdO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbG9jYXRpb24gPSBzZWxmUG9pbnRlci5nZXRQb2ludEJ5RXZlbnQoZXZlbnQsIGNhbnZhc0JvdW5kaW5nUmVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbW91c2VFdmVudCA9IHNlbGZQb2ludGVyLmdldE1vdXNlRXZlbnQobG9jYXRpb24sIGNhbnZhc0JvdW5kaW5nUmVjdCwgdHlwZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb3VzZUV2ZW50LnNldEJ1dHRvbihldmVudC5idXR0b24pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGV2ZW50LCBtb3VzZUV2ZW50LCBsb2NhdGlvbiwgY2FudmFzQm91bmRpbmdSZWN0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLmRpc3BhdGNoRXZlbnQobW91c2VFdmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkKSB7XG4gICAgICAgICAgICBsZXQgX3BvaW50ZXJFdmVudHNNYXAgPSB7XG4gICAgICAgICAgICAgICAgXCJNU1BvaW50ZXJEb3duXCIgICAgIDogc2VsZlBvaW50ZXIuaGFuZGxlVG91Y2hlc0JlZ2luLFxuICAgICAgICAgICAgICAgIFwiTVNQb2ludGVyTW92ZVwiICAgICA6IHNlbGZQb2ludGVyLmhhbmRsZVRvdWNoZXNNb3ZlLFxuICAgICAgICAgICAgICAgIFwiTVNQb2ludGVyVXBcIiAgICAgICA6IHNlbGZQb2ludGVyLmhhbmRsZVRvdWNoZXNFbmQsXG4gICAgICAgICAgICAgICAgXCJNU1BvaW50ZXJDYW5jZWxcIiAgIDogc2VsZlBvaW50ZXIuaGFuZGxlVG91Y2hlc0NhbmNlbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZvciAobGV0IGV2ZW50TmFtZSBpbiBfcG9pbnRlckV2ZW50c01hcCkge1xuICAgICAgICAgICAgICAgIGxldCB0b3VjaEV2ZW50ID0gX3BvaW50ZXJFdmVudHNNYXBbZXZlbnROYW1lXTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBmdW5jdGlvbiAoZXZlbnQpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgZG9jdW1lbnRFbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICBjYW52YXNCb3VuZGluZ1JlY3QuYWRqdXN0ZWRMZWZ0ID0gY2FudmFzQm91bmRpbmdSZWN0LmxlZnQgLSBkb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdDtcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzQm91bmRpbmdSZWN0LmFkanVzdGVkVG9wID0gY2FudmFzQm91bmRpbmdSZWN0LnRvcCAtIGRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG5cbiAgICAgICAgICAgICAgICAgICAgdG91Y2hFdmVudC5jYWxsKHNlbGZQb2ludGVyLCBbc2VsZlBvaW50ZXIuZ2V0VG91Y2hCeVhZKGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFksIGNhbnZhc0JvdW5kaW5nUmVjdCldKTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9yZWdpc3RlciB0b3VjaCBldmVudFxuICAgICAgICBpZiAoc3VwcG9ydFRvdWNoZXMpIHtcbiAgICAgICAgICAgIGxldCBfdG91Y2hFdmVudHNNYXAgPSB7XG4gICAgICAgICAgICAgICAgXCJ0b3VjaHN0YXJ0XCI6IGZ1bmN0aW9uICh0b3VjaGVzVG9IYW5kbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZlBvaW50ZXIuaGFuZGxlVG91Y2hlc0JlZ2luKHRvdWNoZXNUb0hhbmRsZSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwidG91Y2htb3ZlXCI6IGZ1bmN0aW9uICh0b3VjaGVzVG9IYW5kbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZlBvaW50ZXIuaGFuZGxlVG91Y2hlc01vdmUodG91Y2hlc1RvSGFuZGxlKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwidG91Y2hlbmRcIjogZnVuY3Rpb24gKHRvdWNoZXNUb0hhbmRsZSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmUG9pbnRlci5oYW5kbGVUb3VjaGVzRW5kKHRvdWNoZXNUb0hhbmRsZSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcInRvdWNoY2FuY2VsXCI6IGZ1bmN0aW9uICh0b3VjaGVzVG9IYW5kbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZlBvaW50ZXIuaGFuZGxlVG91Y2hlc0NhbmNlbCh0b3VjaGVzVG9IYW5kbGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxldCByZWdpc3RlclRvdWNoRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgbGV0IGhhbmRsZXIgPSBfdG91Y2hFdmVudHNNYXBbZXZlbnROYW1lXTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCAoZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFldmVudC5jaGFuZ2VkVG91Y2hlcykgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYm9keSA9IGRvY3VtZW50LmJvZHk7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FudmFzQm91bmRpbmdSZWN0LmFkanVzdGVkTGVmdCA9IGNhbnZhc0JvdW5kaW5nUmVjdC5sZWZ0IC0gKGJvZHkuc2Nyb2xsTGVmdCB8fCB3aW5kb3cuc2Nyb2xsWCB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzQm91bmRpbmdSZWN0LmFkanVzdGVkVG9wID0gY2FudmFzQm91bmRpbmdSZWN0LnRvcCAtIChib2R5LnNjcm9sbFRvcCB8fCB3aW5kb3cuc2Nyb2xsWSB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihzZWxmUG9pbnRlci5nZXRUb3VjaGVzQnlFdmVudChldmVudCwgY2FudmFzQm91bmRpbmdSZWN0KSk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH0pLCBmYWxzZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZm9yIChsZXQgZXZlbnROYW1lIGluIF90b3VjaEV2ZW50c01hcCkge1xuICAgICAgICAgICAgICAgIHJlZ2lzdGVyVG91Y2hFdmVudChldmVudE5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fcmVnaXN0ZXJLZXlib2FyZEV2ZW50KCk7XG5cbiAgICAgICAgdGhpcy5faXNSZWdpc3RlckV2ZW50ID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgX3JlZ2lzdGVyS2V5Ym9hcmRFdmVudCAoKSB7fSxcblxuICAgIF9yZWdpc3RlckFjY2VsZXJvbWV0ZXJFdmVudCAoKSB7fSxcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgdXBkYXRlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR0XG4gICAgICovXG4gICAgdXBkYXRlIChkdCkge1xuICAgICAgICBpZiAodGhpcy5fYWNjZWxDdXJUaW1lID4gdGhpcy5fYWNjZWxJbnRlcnZhbCkge1xuICAgICAgICAgICAgdGhpcy5fYWNjZWxDdXJUaW1lIC09IHRoaXMuX2FjY2VsSW50ZXJ2YWw7XG4gICAgICAgICAgICBldmVudE1hbmFnZXIuZGlzcGF0Y2hFdmVudChuZXcgY2MuRXZlbnQuRXZlbnRBY2NlbGVyYXRpb24odGhpcy5fYWNjZWxlcmF0aW9uKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fYWNjZWxDdXJUaW1lICs9IGR0O1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY2MuaW50ZXJuYWwuaW5wdXRNYW5hZ2VyID0gaW5wdXRNYW5hZ2VyO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=