
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCScreen.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
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

/**
 * The fullscreen API provides an easy way for web content to be presented using the user's entire screen.
 * It's invalid on safari, QQbrowser and android browser
 * @class screen
 */
cc.screen =
/** @lends cc.screen# */
{
  _supportsFullScreen: false,
  _onfullscreenchange: null,
  _onfullscreenerror: null,
  // the pre fullscreenchange function
  _preOnFullScreenChange: null,
  _preOnFullScreenError: null,
  _preOnTouch: null,
  _touchEvent: "",
  _fn: null,
  // Function mapping for cross browser support
  _fnMap: [['requestFullscreen', 'exitFullscreen', 'fullscreenchange', 'fullscreenEnabled', 'fullscreenElement', 'fullscreenerror'], ['requestFullScreen', 'exitFullScreen', 'fullScreenchange', 'fullScreenEnabled', 'fullScreenElement', 'fullscreenerror'], ['webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitfullscreenchange', 'webkitIsFullScreen', 'webkitCurrentFullScreenElement', 'webkitfullscreenerror'], ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozfullscreenchange', 'mozFullScreen', 'mozFullScreenElement', 'mozfullscreenerror'], ['msRequestFullscreen', 'msExitFullscreen', 'MSFullscreenChange', 'msFullscreenEnabled', 'msFullscreenElement', 'msfullscreenerror']],

  /**
   * initialize
   * @method init
   */
  init: function init() {
    this._fn = {};
    var i,
        l,
        val,
        map = this._fnMap,
        valL;

    for (i = 0, l = map.length; i < l; i++) {
      val = map[i];

      if (val && typeof document[val[1]] !== 'undefined') {
        for (i = 0, valL = val.length; i < valL; i++) {
          this._fn[map[0][i]] = val[i];
        }

        break;
      }
    }

    this._supportsFullScreen = this._fn.requestFullscreen !== undefined; // Bug fix only for v2.1, don't merge into v2.0
    // In v2.0, screen touchend events conflict with editBox touchend events if it's not stayOnTop.
    // While in v2.1, editBox always keep stayOnTop and it doesn't support touchend events.

    this._touchEvent = 'ontouchend' in window ? 'touchend' : 'mousedown';
  },

  /**
   * return true if it's full now.
   * @method fullScreen
   * @returns {Boolean}
   */
  fullScreen: function fullScreen() {
    if (!this._supportsFullScreen) return false;else if (!document[this._fn.fullscreenElement] && !document[this._fn.webkitFullscreenElement] && !document[this._fn.mozFullScreenElement]) {
      return false;
    } else {
      return true;
    }
  },

  /**
   * change the screen to full mode.
   * @method requestFullScreen
   * @param {Element} element
   * @param {Function} onFullScreenChange
   * @param {Function} onFullScreenError
   */
  requestFullScreen: function requestFullScreen(element, onFullScreenChange, onFullScreenError) {
    if (element && element.tagName.toLowerCase() === "video") {
      if (cc.sys.os === cc.sys.OS_IOS && cc.sys.isBrowser && element.readyState > 0) {
        element.webkitEnterFullscreen && element.webkitEnterFullscreen();
        return;
      } else {
        element.setAttribute("x5-video-player-fullscreen", "true");
      }
    }

    if (!this._supportsFullScreen) {
      return;
    }

    element = element || document.documentElement;

    if (onFullScreenChange) {
      var eventName = this._fn.fullscreenchange;

      if (this._onfullscreenchange) {
        document.removeEventListener(eventName, this._onfullscreenchange);
      }

      this._onfullscreenchange = onFullScreenChange;
      document.addEventListener(eventName, onFullScreenChange, false);
    }

    if (onFullScreenError) {
      var _eventName = this._fn.fullscreenerror;

      if (this._onfullscreenerror) {
        document.removeEventListener(_eventName, this._onfullscreenerror);
      }

      this._onfullscreenerror = onFullScreenError;
      document.addEventListener(_eventName, onFullScreenError, {
        once: true
      });
    }

    var requestPromise = element[this._fn.requestFullscreen](); // the requestFullscreen API can only be initiated by user gesture.


    if (typeof document[this._fn.fullscreenerror] === 'undefined' && window.Promise && requestPromise instanceof Promise) {
      requestPromise["catch"](function (err) {// do nothing ... 
      });
    }
  },

  /**
   * exit the full mode.
   * @method exitFullScreen
   * @return {Boolean}
   */
  exitFullScreen: function exitFullScreen(element) {
    if (element && element.tagName.toLowerCase() === "video") {
      if (cc.sys.os === cc.sys.OS_IOS && cc.sys.isBrowser) {
        element.webkitExitFullscreen && element.webkitExitFullscreen();
        return;
      } else {
        element.setAttribute("x5-video-player-fullscreen", "false");
      }
    }

    return this._supportsFullScreen ? document[this._fn.exitFullscreen]() : true;
  },

  /**
   * Automatically request full screen with a touch/click event
   * @method autoFullScreen
   * @param {Element} element
   * @param {Function} onFullScreenChange
   */
  autoFullScreen: function autoFullScreen(element, onFullScreenChange) {
    element = element || document.body;

    this._ensureFullScreen(element, onFullScreenChange);

    this.requestFullScreen(element, onFullScreenChange);
  },
  disableAutoFullScreen: function disableAutoFullScreen(element) {
    var touchTarget = cc.game.canvas || element;
    var touchEventName = this._touchEvent;

    if (this._preOnTouch) {
      touchTarget.removeEventListener(touchEventName, this._preOnTouch);
      this._preOnTouch = null;
    }
  },
  // Register touch event if request full screen failed
  _ensureFullScreen: function _ensureFullScreen(element, onFullScreenChange) {
    var self = this;
    var touchTarget = cc.game.canvas || element;
    var fullScreenErrorEventName = this._fn.fullscreenerror;
    var touchEventName = this._touchEvent;

    function onFullScreenError() {
      self._preOnFullScreenError = null; // handle touch event listener

      function onTouch() {
        self._preOnTouch = null;
        self.requestFullScreen(element, onFullScreenChange);
      }

      if (self._preOnTouch) {
        touchTarget.removeEventListener(touchEventName, self._preOnTouch);
      }

      self._preOnTouch = onTouch;
      touchTarget.addEventListener(touchEventName, self._preOnTouch, {
        once: true
      });
    } // handle full screen error


    if (this._preOnFullScreenError) {
      element.removeEventListener(fullScreenErrorEventName, this._preOnFullScreenError);
    }

    this._preOnFullScreenError = onFullScreenError;
    element.addEventListener(fullScreenErrorEventName, onFullScreenError, {
      once: true
    });
  }
};
cc.screen.init();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BsYXRmb3JtL0NDU2NyZWVuLmpzIl0sIm5hbWVzIjpbImNjIiwic2NyZWVuIiwiX3N1cHBvcnRzRnVsbFNjcmVlbiIsIl9vbmZ1bGxzY3JlZW5jaGFuZ2UiLCJfb25mdWxsc2NyZWVuZXJyb3IiLCJfcHJlT25GdWxsU2NyZWVuQ2hhbmdlIiwiX3ByZU9uRnVsbFNjcmVlbkVycm9yIiwiX3ByZU9uVG91Y2giLCJfdG91Y2hFdmVudCIsIl9mbiIsIl9mbk1hcCIsImluaXQiLCJpIiwibCIsInZhbCIsIm1hcCIsInZhbEwiLCJsZW5ndGgiLCJkb2N1bWVudCIsInJlcXVlc3RGdWxsc2NyZWVuIiwidW5kZWZpbmVkIiwid2luZG93IiwiZnVsbFNjcmVlbiIsImZ1bGxzY3JlZW5FbGVtZW50Iiwid2Via2l0RnVsbHNjcmVlbkVsZW1lbnQiLCJtb3pGdWxsU2NyZWVuRWxlbWVudCIsInJlcXVlc3RGdWxsU2NyZWVuIiwiZWxlbWVudCIsIm9uRnVsbFNjcmVlbkNoYW5nZSIsIm9uRnVsbFNjcmVlbkVycm9yIiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwic3lzIiwib3MiLCJPU19JT1MiLCJpc0Jyb3dzZXIiLCJyZWFkeVN0YXRlIiwid2Via2l0RW50ZXJGdWxsc2NyZWVuIiwic2V0QXR0cmlidXRlIiwiZG9jdW1lbnRFbGVtZW50IiwiZXZlbnROYW1lIiwiZnVsbHNjcmVlbmNoYW5nZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJhZGRFdmVudExpc3RlbmVyIiwiZnVsbHNjcmVlbmVycm9yIiwib25jZSIsInJlcXVlc3RQcm9taXNlIiwiUHJvbWlzZSIsImVyciIsImV4aXRGdWxsU2NyZWVuIiwid2Via2l0RXhpdEZ1bGxzY3JlZW4iLCJleGl0RnVsbHNjcmVlbiIsImF1dG9GdWxsU2NyZWVuIiwiYm9keSIsIl9lbnN1cmVGdWxsU2NyZWVuIiwiZGlzYWJsZUF1dG9GdWxsU2NyZWVuIiwidG91Y2hUYXJnZXQiLCJnYW1lIiwiY2FudmFzIiwidG91Y2hFdmVudE5hbWUiLCJzZWxmIiwiZnVsbFNjcmVlbkVycm9yRXZlbnROYW1lIiwib25Ub3VjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBQSxFQUFFLENBQUNDLE1BQUg7QUFBWTtBQUF3QjtBQUNoQ0MsRUFBQUEsbUJBQW1CLEVBQUUsS0FEVztBQUVoQ0MsRUFBQUEsbUJBQW1CLEVBQUUsSUFGVztBQUdoQ0MsRUFBQUEsa0JBQWtCLEVBQUUsSUFIWTtBQUloQztBQUNBQyxFQUFBQSxzQkFBc0IsRUFBRSxJQUxRO0FBTWhDQyxFQUFBQSxxQkFBcUIsRUFBRSxJQU5TO0FBT2hDQyxFQUFBQSxXQUFXLEVBQUUsSUFQbUI7QUFRaENDLEVBQUFBLFdBQVcsRUFBRSxFQVJtQjtBQVNoQ0MsRUFBQUEsR0FBRyxFQUFFLElBVDJCO0FBVWhDO0FBQ0FDLEVBQUFBLE1BQU0sRUFBRSxDQUNKLENBQ0ksbUJBREosRUFFSSxnQkFGSixFQUdJLGtCQUhKLEVBSUksbUJBSkosRUFLSSxtQkFMSixFQU1JLGlCQU5KLENBREksRUFTSixDQUNJLG1CQURKLEVBRUksZ0JBRkosRUFHSSxrQkFISixFQUlJLG1CQUpKLEVBS0ksbUJBTEosRUFNSSxpQkFOSixDQVRJLEVBaUJKLENBQ0kseUJBREosRUFFSSx3QkFGSixFQUdJLHdCQUhKLEVBSUksb0JBSkosRUFLSSxnQ0FMSixFQU1JLHVCQU5KLENBakJJLEVBeUJKLENBQ0ksc0JBREosRUFFSSxxQkFGSixFQUdJLHFCQUhKLEVBSUksZUFKSixFQUtJLHNCQUxKLEVBTUksb0JBTkosQ0F6QkksRUFpQ0osQ0FDSSxxQkFESixFQUVJLGtCQUZKLEVBR0ksb0JB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aUJBQTdCO0FBQ0FGLElBQUFBLE9BQU8sQ0FBQ2dCLGdCQUFSLENBQXlCa0Isd0JBQXpCLEVBQW1EaEMsaUJBQW5ELEVBQXNFO0FBQUVnQixNQUFBQSxJQUFJLEVBQUU7QUFBUixLQUF0RTtBQUNIO0FBck4rQixDQUFwQztBQXVOQTdDLEVBQUUsQ0FBQ0MsTUFBSCxDQUFVVSxJQUFWIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMDgtMjAxMCBSaWNhcmRvIFF1ZXNhZGFcbiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxMiBjb2NvczJkLXgub3JnXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuIFxuIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZ1xuIFxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuIFxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqXG4gKiBUaGUgZnVsbHNjcmVlbiBBUEkgcHJvdmlkZXMgYW4gZWFzeSB3YXkgZm9yIHdlYiBjb250ZW50IHRvIGJlIHByZXNlbnRlZCB1c2luZyB0aGUgdXNlcidzIGVudGlyZSBzY3JlZW4uXG4gKiBJdCdzIGludmFsaWQgb24gc2FmYXJpLCBRUWJyb3dzZXIgYW5kIGFuZHJvaWQgYnJvd3NlclxuICogQGNsYXNzIHNjcmVlblxuICovXG5jYy5zY3JlZW4gPSAvKiogQGxlbmRzIGNjLnNjcmVlbiMgKi97XG4gICAgX3N1cHBvcnRzRnVsbFNjcmVlbjogZmFsc2UsXG4gICAgX29uZnVsbHNjcmVlbmNoYW5nZTogbnVsbCxcbiAgICBfb25mdWxsc2NyZWVuZXJyb3I6IG51bGwsXG4gICAgLy8gdGhlIHByZSBmdWxsc2NyZWVuY2hhbmdlIGZ1bmN0aW9uXG4gICAgX3ByZU9uRnVsbFNjcmVlbkNoYW5nZTogbnVsbCxcbiAgICBfcHJlT25GdWxsU2NyZWVuRXJyb3I6IG51bGwsXG4gICAgX3ByZU9uVG91Y2g6IG51bGwsXG4gICAgX3RvdWNoRXZlbnQ6IFwiXCIsXG4gICAgX2ZuOiBudWxsLFxuICAgIC8vIEZ1bmN0aW9uIG1hcHBpbmcgZm9yIGNyb3NzIGJyb3dzZXIgc3VwcG9ydFxuICAgIF9mbk1hcDogW1xuICAgICAgICBbXG4gICAgICAgICAgICAncmVxdWVzdEZ1bGxzY3JlZW4nLFxuICAgICAgICAgICAgJ2V4aXRGdWxsc2NyZWVuJyxcbiAgICAgICAgICAgICdmdWxsc2NyZWVuY2hhbmdlJyxcbiAgICAgICAgICAgICdmdWxsc2NyZWVuRW5hYmxlZCcsXG4gICAgICAgICAgICAnZnVsbHNjcmVlbkVsZW1lbnQnLFxuICAgICAgICAgICAgJ2Z1bGxzY3JlZW5lcnJvcicsXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAgICdyZXF1ZXN0RnVsbFNjcmVlbicsXG4gICAgICAgICAgICAnZXhpdEZ1bGxTY3JlZW4nLFxuICAgICAgICAgICAgJ2Z1bGxTY3JlZW5jaGFuZ2UnLFxuICAgICAgICAgICAgJ2Z1bGxTY3JlZW5FbmFibGVkJyxcbiAgICAgICAgICAgICdmdWxsU2NyZWVuRWxlbWVudCcsXG4gICAgICAgICAgICAnZnVsbHNjcmVlbmVycm9yJyxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgICAgJ3dlYmtpdFJlcXVlc3RGdWxsU2NyZWVuJyxcbiAgICAgICAgICAgICd3ZWJraXRDYW5jZWxGdWxsU2NyZWVuJyxcbiAgICAgICAgICAgICd3ZWJraXRmdWxsc2NyZWVuY2hhbmdlJyxcbiAgICAgICAgICAgICd3ZWJraXRJc0Z1bGxTY3JlZW4nLFxuICAgICAgICAgICAgJ3dlYmtpdEN1cnJlbnRGdWxsU2NyZWVuRWxlbWVudCcsXG4gICAgICAgICAgICAnd2Via2l0ZnVsbHNjcmVlbmVycm9yJyxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgICAgJ21velJlcXVlc3RGdWxsU2NyZWVuJyxcbiAgICAgICAgICAgICdtb3pDYW5jZWxGdWxsU2NyZWVuJyxcbiAgICAgICAgICAgICdtb3pmdWxsc2NyZWVuY2hhbmdlJyxcbiAgICAgICAgICAgICdtb3pGdWxsU2NyZWVuJyxcbiAgICAgICAgICAgICdtb3pGdWxsU2NyZWVuRWxlbWVudCcsXG4gICAgICAgICAgICAnbW96ZnVsbHNjcmVlbmVycm9yJyxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgICAgJ21zUmVxdWVzdEZ1bGxzY3JlZW4nLFxuICAgICAgICAgICAgJ21zRXhpdEZ1bGxzY3JlZW4nLFxuICAgICAgICAgICAgJ01TRnVsbHNjcmVlbkNoYW5nZScsXG4gICAgICAgICAgICAnbXNGdWxsc2NyZWVuRW5hYmxlZCcsXG4gICAgICAgICAgICAnbXNGdWxsc2NyZWVuRWxlbWVudCcsXG4gICAgICAgICAgICAnbXNmdWxsc2NyZWVuZXJyb3InLFxuICAgICAgICBdXG4gICAgXSxcbiAgICBcbiAgICAvKipcbiAgICAgKiBpbml0aWFsaXplXG4gICAgICogQG1ldGhvZCBpbml0XG4gICAgICovXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9mbiA9IHt9O1xuICAgICAgICB2YXIgaSwgbCwgdmFsLCBtYXAgPSB0aGlzLl9mbk1hcCwgdmFsTDtcbiAgICAgICAgZm9yIChpID0gMCwgbCA9IG1hcC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIHZhbCA9IG1hcFtpXTtcbiAgICAgICAgICAgIGlmICh2YWwgJiYgKHR5cGVvZiBkb2N1bWVudFt2YWxbMV1dICE9PSAndW5kZWZpbmVkJykpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCB2YWxMID0gdmFsLmxlbmd0aDsgaSA8IHZhbEw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mblttYXBbMF1baV1dID0gdmFsW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3N1cHBvcnRzRnVsbFNjcmVlbiA9ICh0aGlzLl9mbi5yZXF1ZXN0RnVsbHNjcmVlbiAhPT0gdW5kZWZpbmVkKTtcblxuICAgICAgICAvLyBCdWcgZml4IG9ubHkgZm9yIHYyLjEsIGRvbid0IG1lcmdlIGludG8gdjIuMFxuICAgICAgICAvLyBJbiB2Mi4wLCBzY3JlZW4gdG91Y2hlbmQgZXZlbnRzIGNvbmZsaWN0IHdpdGggZWRpdEJveCB0b3VjaGVuZCBldmVudHMgaWYgaXQncyBub3Qgc3RheU9uVG9wLlxuICAgICAgICAvLyBXaGlsZSBpbiB2Mi4xLCBlZGl0Qm94IGFsd2F5cyBrZWVwIHN0YXlPblRvcCBhbmQgaXQgZG9lc24ndCBzdXBwb3J0IHRvdWNoZW5kIGV2ZW50cy5cbiAgICAgICAgdGhpcy5fdG91Y2hFdmVudCA9ICgnb250b3VjaGVuZCcgaW4gd2luZG93KSA/ICd0b3VjaGVuZCcgOiAnbW91c2Vkb3duJztcbiAgICB9LFxuICAgIFxuICAgIC8qKlxuICAgICAqIHJldHVybiB0cnVlIGlmIGl0J3MgZnVsbCBub3cuXG4gICAgICogQG1ldGhvZCBmdWxsU2NyZWVuXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICovXG4gICAgZnVsbFNjcmVlbjogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuX3N1cHBvcnRzRnVsbFNjcmVlbikgcmV0dXJuIGZhbHNlO1xuICAgICAgICBlbHNlIGlmICghZG9jdW1lbnRbdGhpcy5fZm4uZnVsbHNjcmVlbkVsZW1lbnRdICYmICFkb2N1bWVudFt0aGlzLl9mbi53ZWJraXRGdWxsc2NyZWVuRWxlbWVudF0gJiYgIWRvY3VtZW50W3RoaXMuX2ZuLm1vekZ1bGxTY3JlZW5FbGVtZW50XSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIFxuICAgIC8qKlxuICAgICAqIGNoYW5nZSB0aGUgc2NyZWVuIHRvIGZ1bGwgbW9kZS5cbiAgICAgKiBAbWV0aG9kIHJlcXVlc3RGdWxsU2NyZWVuXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25GdWxsU2NyZWVuQ2hhbmdlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25GdWxsU2NyZWVuRXJyb3JcbiAgICAgKi9cbiAgICByZXF1ZXN0RnVsbFNjcmVlbjogZnVuY3Rpb24gKGVsZW1lbnQsIG9uRnVsbFNjcmVlbkNoYW5nZSwgb25GdWxsU2NyZWVuRXJyb3IpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwidmlkZW9cIikge1xuICAgICAgICAgICAgaWYgKGNjLnN5cy5vcyA9PT0gY2Muc3lzLk9TX0lPUyAmJiBjYy5zeXMuaXNCcm93c2VyICYmIGVsZW1lbnQucmVhZHlTdGF0ZSA+IDApIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LndlYmtpdEVudGVyRnVsbHNjcmVlbiAmJiBlbGVtZW50LndlYmtpdEVudGVyRnVsbHNjcmVlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwieDUtdmlkZW8tcGxheWVyLWZ1bGxzY3JlZW5cIiwgXCJ0cnVlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLl9zdXBwb3J0c0Z1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblxuICAgICAgICBpZiAob25GdWxsU2NyZWVuQ2hhbmdlKSB7XG4gICAgICAgICAgICBsZXQgZXZlbnROYW1lID0gdGhpcy5fZm4uZnVsbHNjcmVlbmNoYW5nZTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9vbmZ1bGxzY3JlZW5jaGFuZ2UpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpcy5fb25mdWxsc2NyZWVuY2hhbmdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX29uZnVsbHNjcmVlbmNoYW5nZSA9IG9uRnVsbFNjcmVlbkNoYW5nZTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBvbkZ1bGxTY3JlZW5DaGFuZ2UsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob25GdWxsU2NyZWVuRXJyb3IpIHtcbiAgICAgICAgICAgIGxldCBldmVudE5hbWUgPSB0aGlzLl9mbi5mdWxsc2NyZWVuZXJyb3I7XG4gICAgICAgICAgICBpZiAodGhpcy5fb25mdWxsc2NyZWVuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpcy5fb25mdWxsc2NyZWVuZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fb25mdWxsc2NyZWVuZXJyb3IgPSBvbkZ1bGxTY3JlZW5FcnJvcjtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBvbkZ1bGxTY3JlZW5FcnJvciwgeyBvbmNlOiB0cnVlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlcXVlc3RQcm9taXNlID0gZWxlbWVudFt0aGlzLl9mbi5yZXF1ZXN0RnVsbHNjcmVlbl0oKTtcbiAgICAgICAgLy8gdGhlIHJlcXVlc3RGdWxsc2NyZWVuIEFQSSBjYW4gb25seSBiZSBpbml0aWF0ZWQgYnkgdXNlciBnZXN0dXJlLlxuICAgICAgICBpZiAodHlwZW9mIGRvY3VtZW50W3RoaXMuX2ZuLmZ1bGxzY3JlZW5lcnJvcl0gPT09ICd1bmRlZmluZWQnIFxuICAgICAgICAgICAgJiYgd2luZG93LlByb21pc2UgJiYgcmVxdWVzdFByb21pc2UgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICByZXF1ZXN0UHJvbWlzZS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZyAuLi4gXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXG4gICAgLyoqXG4gICAgICogZXhpdCB0aGUgZnVsbCBtb2RlLlxuICAgICAqIEBtZXRob2QgZXhpdEZ1bGxTY3JlZW5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGV4aXRGdWxsU2NyZWVuOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBpZiAoZWxlbWVudCAmJiBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJ2aWRlb1wiKSB7XG4gICAgICAgICAgICBpZiAoY2Muc3lzLm9zID09PSBjYy5zeXMuT1NfSU9TICYmIGNjLnN5cy5pc0Jyb3dzZXIpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LndlYmtpdEV4aXRGdWxsc2NyZWVuICYmIGVsZW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcIng1LXZpZGVvLXBsYXllci1mdWxsc2NyZWVuXCIsIFwiZmFsc2VcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1cHBvcnRzRnVsbFNjcmVlbiA/IGRvY3VtZW50W3RoaXMuX2ZuLmV4aXRGdWxsc2NyZWVuXSgpIDogdHJ1ZTtcbiAgICB9LFxuICAgIFxuICAgIC8qKlxuICAgICAqIEF1dG9tYXRpY2FsbHkgcmVxdWVzdCBmdWxsIHNjcmVlbiB3aXRoIGEgdG91Y2gvY2xpY2sgZXZlbnRcbiAgICAgKiBAbWV0aG9kIGF1dG9GdWxsU2NyZWVuXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25GdWxsU2NyZWVuQ2hhbmdlXG4gICAgICovXG4gICAgYXV0b0Z1bGxTY3JlZW46IGZ1bmN0aW9uIChlbGVtZW50LCBvbkZ1bGxTY3JlZW5DaGFuZ2UpIHtcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQgfHwgZG9jdW1lbnQuYm9keTtcblxuICAgICAgICB0aGlzLl9lbnN1cmVGdWxsU2NyZWVuKGVsZW1lbnQsIG9uRnVsbFNjcmVlbkNoYW5nZSk7XG4gICAgICAgIHRoaXMucmVxdWVzdEZ1bGxTY3JlZW4oZWxlbWVudCwgb25GdWxsU2NyZWVuQ2hhbmdlKTtcbiAgICB9LFxuXG4gICAgZGlzYWJsZUF1dG9GdWxsU2NyZWVuIChlbGVtZW50KSB7XG4gICAgICAgIGxldCB0b3VjaFRhcmdldCA9IGNjLmdhbWUuY2FudmFzIHx8IGVsZW1lbnQ7XG4gICAgICAgIGxldCB0b3VjaEV2ZW50TmFtZSA9IHRoaXMuX3RvdWNoRXZlbnQ7XG4gICAgICAgIGlmICh0aGlzLl9wcmVPblRvdWNoKSB7XG4gICAgICAgICAgICB0b3VjaFRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKHRvdWNoRXZlbnROYW1lLCB0aGlzLl9wcmVPblRvdWNoKTtcbiAgICAgICAgICAgIHRoaXMuX3ByZU9uVG91Y2ggPSBudWxsO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIFJlZ2lzdGVyIHRvdWNoIGV2ZW50IGlmIHJlcXVlc3QgZnVsbCBzY3JlZW4gZmFpbGVkXG4gICAgX2Vuc3VyZUZ1bGxTY3JlZW4gKGVsZW1lbnQsIG9uRnVsbFNjcmVlbkNoYW5nZSkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGxldCB0b3VjaFRhcmdldCA9IGNjLmdhbWUuY2FudmFzIHx8IGVsZW1lbnQ7XG4gICAgICAgIGxldCBmdWxsU2NyZWVuRXJyb3JFdmVudE5hbWUgPSB0aGlzLl9mbi5mdWxsc2NyZWVuZXJyb3I7XG4gICAgICAgIGxldCB0b3VjaEV2ZW50TmFtZSA9IHRoaXMuX3RvdWNoRXZlbnQ7XG4gICAgICAgIFxuICAgICAgICBmdW5jdGlvbiBvbkZ1bGxTY3JlZW5FcnJvciAoKSB7XG4gICAgICAgICAgICBzZWxmLl9wcmVPbkZ1bGxTY3JlZW5FcnJvciA9IG51bGw7XG5cbiAgICAgICAgICAgIC8vIGhhbmRsZSB0b3VjaCBldmVudCBsaXN0ZW5lclxuICAgICAgICAgICAgZnVuY3Rpb24gb25Ub3VjaCgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9wcmVPblRvdWNoID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzZWxmLnJlcXVlc3RGdWxsU2NyZWVuKGVsZW1lbnQsIG9uRnVsbFNjcmVlbkNoYW5nZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5fcHJlT25Ub3VjaCkge1xuICAgICAgICAgICAgICAgIHRvdWNoVGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIodG91Y2hFdmVudE5hbWUsIHNlbGYuX3ByZU9uVG91Y2gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5fcHJlT25Ub3VjaCA9IG9uVG91Y2g7XG4gICAgICAgICAgICB0b3VjaFRhcmdldC5hZGRFdmVudExpc3RlbmVyKHRvdWNoRXZlbnROYW1lLCBzZWxmLl9wcmVPblRvdWNoLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBoYW5kbGUgZnVsbCBzY3JlZW4gZXJyb3JcbiAgICAgICAgaWYgKHRoaXMuX3ByZU9uRnVsbFNjcmVlbkVycm9yKSB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZnVsbFNjcmVlbkVycm9yRXZlbnROYW1lLCB0aGlzLl9wcmVPbkZ1bGxTY3JlZW5FcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcHJlT25GdWxsU2NyZWVuRXJyb3IgPSBvbkZ1bGxTY3JlZW5FcnJvcjtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGZ1bGxTY3JlZW5FcnJvckV2ZW50TmFtZSwgb25GdWxsU2NyZWVuRXJyb3IsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICB9LFxufTtcbmNjLnNjcmVlbi5pbml0KCk7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==