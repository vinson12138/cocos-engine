
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCView.js';
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
var EventTarget = require('../event/event-target');

var js = require('../platform/js');

var renderer = require('../renderer');

require('../platform/CCClass');

var __BrowserGetter = {
  init: function init() {
    this.html = document.getElementsByTagName("html")[0];
  },
  availWidth: function availWidth(frame) {
    if (!frame || frame === this.html) return window.innerWidth;else return frame.clientWidth;
  },
  availHeight: function availHeight(frame) {
    if (!frame || frame === this.html) return window.innerHeight;else return frame.clientHeight;
  },
  meta: {
    "width": "device-width"
  },
  adaptationType: cc.sys.browserType
};
if (cc.sys.os === cc.sys.OS_IOS) // All browsers are WebView
  __BrowserGetter.adaptationType = cc.sys.BROWSER_TYPE_SAFARI;

switch (__BrowserGetter.adaptationType) {
  case cc.sys.BROWSER_TYPE_SAFARI:
  case cc.sys.BROWSER_TYPE_SOUGOU:
  case cc.sys.BROWSER_TYPE_UC:
    __BrowserGetter.meta["minimal-ui"] = "true";

    __BrowserGetter.availWidth = function (frame) {
      return frame.clientWidth;
    };

    __BrowserGetter.availHeight = function (frame) {
      return frame.clientHeight;
    };

    break;
}

var _scissorRect = null;
/**
 * cc.view is the singleton object which represents the game window.<br/>
 * It's main task include: <br/>
 *  - Apply the design resolution policy<br/>
 *  - Provide interaction with the window, like resize event on web, retina display support, etc...<br/>
 *  - Manage the game view port which can be different with the window<br/>
 *  - Manage the content scale and translation<br/>
 * <br/>
 * Since the cc.view is a singleton, you don't need to call any constructor or create functions,<br/>
 * the standard way to use it is by calling:<br/>
 *  - cc.view.methodName(); <br/>
 *
 * @class View
 * @extends EventTarget
 */

var View = function View() {
  EventTarget.call(this);

  var _t = this,
      _strategyer = cc.ContainerStrategy,
      _strategy = cc.ContentStrategy;

  __BrowserGetter.init(this); // Size of parent node that contains cc.game.container and cc.game.canvas


  _t._frameSize = cc.size(0, 0); // resolution size, it is the size appropriate for the app resources.

  _t._designResolutionSize = cc.size(0, 0);
  _t._originalDesignResolutionSize = cc.size(0, 0);
  _t._scaleX = 1;
  _t._scaleY = 1; // Viewport is the container's rect related to content's coordinates in pixel

  _t._viewportRect = cc.rect(0, 0, 0, 0); // The visible rect in content's coordinate in point

  _t._visibleRect = cc.rect(0, 0, 0, 0); // Auto full screen disabled by default

  _t._autoFullScreen = false; // The device's pixel ratio (for retina displays)

  _t._devicePixelRatio = 1;

  if (CC_JSB) {
    _t._maxPixelRatio = 4;
  } else {
    _t._maxPixelRatio = 2;
  } // Retina disabled by default


  _t._retinaEnabled = false; // Custom callback for resize event

  _t._resizeCallback = null;
  _t._resizing = false;
  _t._resizeWithBrowserSize = false;
  _t._orientationChanging = true;
  _t._isRotated = false;
  _t._orientation = cc.macro.ORIENTATION_AUTO;
  _t._isAdjustViewport = true;
  _t._antiAliasEnabled = false; // Setup system default resolution policies

  _t._resolutionPolicy = null;
  _t._rpExactFit = new cc.ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.EXACT_FIT);
  _t._rpShowAll = new cc.ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.SHOW_ALL);
  _t._rpNoBorder = new cc.ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.NO_BORDER);
  _t._rpFixedHeight = new cc.ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.FIXED_HEIGHT);
  _t._rpFixedWidth = new cc.ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.FIXED_WIDTH);
  cc.game.once(cc.game.EVENT_ENGINE_INITED, this.init, this);
};

cc.js.extend(View, EventTarget);
cc.js.mixin(View.prototype, {
  init: function init() {
    this._initFrameSize();

    var w = cc.game.canvas.width,
        h = cc.game.canvas.height;
    this._designResolutionSize.width = w;
    this._designResolutionSize.height = h;
    this._originalDesignResolutionSize.width = w;
    this._originalDesignResolutionSize.height = h;
    this._viewportRect.width = w;
    this._viewportRect.height = h;
    this._visibleRect.width = w;
    this._visibleRect.height = h;
    cc.winSize.width = this._visibleRect.width;
    cc.winSize.height = this._visibleRect.height;
    cc.visibleRect && cc.visibleRect.init(this._visibleRect);
  },
  // Resize helper functions
  _resizeEvent: function _resizeEvent(forceOrEvent) {
    var view;

    if (this.setDesignResolutionSize) {
      view = this;
    } else {
      view = cc.view;
    } // HACK: some browsers can't update window size immediately
    // need to handle resize event callback on the next tick


    var sys = cc.sys;

    if (sys.browserType === sys.BROWSER_TYPE_UC && sys.os === sys.OS_IOS) {
      setTimeout(function () {
        view._resizeEvent(forceOrEvent);
      }, 0);
      return;
    } // Check frame size changed or not


    var prevFrameW = view._frameSize.width,
        prevFrameH = view._frameSize.height,
        prevRotated = view._isRotated;

    if (cc.sys.isMobile) {
      var containerStyle = cc.game.container.style,
          margin = containerStyle.margin;
      containerStyle.margin = '0';
      containerStyle.display = 'none';

      view._initFrameSize();

      containerStyle.margin = margin;
      containerStyle.display = 'block';
    } else {
      view._initFrameSize();
    }

    if (forceOrEvent !== true && view._isRotated === prevRotated && view._frameSize.width === prevFrameW && view._frameSize.height === prevFrameH) return; // Frame size changed, do resize works

    var width = view._originalDesignResolutionSize.width;
    var height = view._originalDesignResolutionSize.height;
    view._resizing = true;
    if (width > 0) view.setDesignResolutionSize(width, height, view._resolutionPolicy);
    view._resizing = false;
    view.emit('canvas-resize');

    if (view._resizeCallback) {
      view._resizeCallback.call();
    }
  },
  _orientationChange: function _orientationChange() {
    cc.view._orientationChanging = true;

    cc.view._resizeEvent(); // HACK: show nav bar on iOS safari
    // safari will enter fullscreen when rotate to landscape
    // need to exit fullscreen when rotate back to portrait, scrollTo(0, 1) works.


    if (cc.sys.browserType === cc.sys.BROWSER_TYPE_SAFARI && cc.sys.isMobile) {
      setTimeout(function () {
        if (window.innerHeight > window.innerWidth) {
          window.scrollTo(0, 1);
        }
      }, 500);
    }
  },
  _resize: function _resize() {
    //force resize when size is changed at native
    cc.view._resizeEvent(CC_JSB);
  },

  /**
   * !#en
   * Sets view's target-densitydpi for android mobile browser. it can be set to:           <br/>
   *   1. cc.macro.DENSITYDPI_DEVICE, value is "device-dpi"                                      <br/>
   *   2. cc.macro.DENSITYDPI_HIGH, value is "high-dpi"  (default value)                         <br/>
   *   3. cc.macro.DENSITYDPI_MEDIUM, value is "medium-dpi" (browser's default value)            <br/>
   *   4. cc.macro.DENSITYDPI_LOW, value is "low-dpi"                                            <br/>
   *   5. Custom value, e.g: "480"                                                         <br/>
   * !#zh 设置目标内容的每英寸像素点密度。
   *
   * @method setTargetDensityDPI
   * @param {String} densityDPI
   * @deprecated since v2.0
   */

  /**
   * !#en
   * Returns the current target-densitydpi value of cc.view.
   * !#zh 获取目标内容的每英寸像素点密度。
   * @method getTargetDensityDPI
   * @returns {String}
   * @deprecated since v2.0
   */

  /**
   * !#en
   * Sets whether resize canvas automatically when browser's size changed.<br/>
   * Useful only on web.
   * !#zh 设置当发现浏览器的尺寸改变时，是否自动调整 canvas 尺寸大小。
   * 仅在 Web 模式下有效。
   * @method resizeWithBrowserSize
   * @param {Boolean} enabled - Whether enable automatic resize with browser's resize event
   */
  resizeWithBrowserSize: function resizeWithBrowserSize(enabled) {
    if (enabled) {
      //enable
      if (!this._resizeWithBrowserSize) {
        this._resizeWithBrowserSize = true;
        window.addEventListener('resize', this._resize);
        window.addEventListener('orientationchange', this._orientationChange);
      }
    } else {
      //disable
      if (this._resizeWithBrowserSize) {
        this._resizeWithBrowserSize = false;
        window.removeEventListener('resize', this._resize);
        window.removeEventListener('orientationchange', this._orientationChange);
      }
    }
  },

  /**
   * !#en
   * Sets the callback function for cc.view's resize action,<br/>
   * this callback will be invoked before applying resolution policy, <br/>
   * so you can do any additional modifications within the callback.<br/>
   * Useful only on web.
   * !#zh 设置 cc.view 调整视窗尺寸行为的回调函数，
   * 这个回调函数会在应用适配模式之前被调用，
   * 因此你可以在这个回调函数内添加任意附加改变，
   * 仅在 Web 平台下有效。
   * @method setResizeCallback
   * @param {Function|Null} callback - The callback function
   */
  setResizeCallback: function setResizeCallback(callback) {
    if (CC_EDITOR) return;

    if (typeof callback === 'function' || callback == null) {
      this._resizeCallback = callback;
    }
  },

  /**
   * !#en
   * Sets the orientation of the game, it can be landscape, portrait or auto.
   * When set it to landscape or portrait, and screen w/h ratio doesn't fit, 
   * cc.view will automatically rotate the game canvas using CSS.
   * Note that this function doesn't have any effect in native, 
   * in native, you need to set the application orientation in native project settings
   * !#zh 设置游戏屏幕朝向，它能够是横版，竖版或自动。
   * 当设置为横版或竖版，并且屏幕的宽高比例不匹配时，
   * cc.view 会自动用 CSS 旋转游戏场景的 canvas，
   * 这个方法不会对 native 部分产生任何影响，对于 native 而言，你需要在应用设置中的设置排版。
   * @method setOrientation
   * @param {Number} orientation - Possible values: cc.macro.ORIENTATION_LANDSCAPE | cc.macro.ORIENTATION_PORTRAIT | cc.macro.ORIENTATION_AUTO
   */
  setOrientation: function setOrientation(orientation) {
    orientation = orientation & cc.macro.ORIENTATION_AUTO;

    if (orientation && this._orientation !== orientation) {
      this._orientation = orientation;
      var designWidth = this._originalDesignResolutionSize.width;
      var designHeight = this._originalDesignResolutionSize.height;
      this.setDesignResolutionSize(designWidth, designHeight, this._resolutionPolicy);
    }
  },
  _initFrameSize: function _initFrameSize() {
    var locFrameSize = this._frameSize;

    var w = __BrowserGetter.availWidth(cc.game.frame);

    var h = __BrowserGetter.availHeight(cc.game.frame);

    var isLandscape = w >= h;

    if (CC_EDITOR || !cc.sys.isMobile || isLandscape && this._orientation & cc.macro.ORIENTATION_LANDSCAPE || !isLandscape && this._orientation & cc.macro.ORIENTATION_PORTRAIT) {
      locFrameSize.width = w;
      locFrameSize.height = h;
      cc.game.container.style['-webkit-transform'] = 'rotate(0deg)';
      cc.game.container.style.transform = 'rotate(0deg)';
      this._isRotated = false;
    } else {
      locFrameSize.width = h;
      locFrameSize.height = w;
      cc.game.container.style['-webkit-transform'] = 'rotate(90deg)';
      cc.game.container.style.transform = 'rotate(90deg)';
      cc.game.container.style['-webkit-transform-origin'] = '0px 0px 0px';
      cc.game.container.style.transformOrigin = '0px 0px 0px';
      this._isRotated = true;
    }

    if (this._orientationChanging) {
      setTimeout(function () {
        cc.view._orientationChanging = false;
      }, 1000);
    }
  },
  _setViewportMeta: function _setViewportMeta(metas, overwrite) {
    var vp = document.getElementById("cocosMetaElement");

    if (vp && overwrite) {
      document.head.removeChild(vp);
    }

    var elems = document.getElementsByName("viewport"),
        currentVP = elems ? elems[0] : null,
        content,
        key,
        pattern;
    content = currentVP ? currentVP.content : "";
    vp = vp || document.createElement("meta");
    vp.id = "cocosMetaElement";
    vp.name = "viewport";
    vp.content = "";

    for (key in metas) {
      if (content.indexOf(key) == -1) {
        content += "," + key + "=" + metas[key];
      } else if (overwrite) {
        pattern = new RegExp(key + "\s*=\s*[^,]+");
        content = content.replace(pattern, key + "=" + metas[key]);
      }
    }

    if (/^,/.test(content)) content = content.substr(1);
    vp.content = content; // For adopting certain android devices which don't support second viewport

    if (currentVP) currentVP.content = content;
    document.head.appendChild(vp);
  },
  _adjustViewportMeta: function _adjustViewportMeta() {
    if (this._isAdjustViewport && !CC_JSB && !CC_RUNTIME) {
      this._setViewportMeta(__BrowserGetter.meta, false);

      this._isAdjustViewport = false;
    }
  },

  /**
   * !#en
   * Sets whether the engine modify the "viewport" meta in your web page.<br/>
   * It's enabled by default, we strongly suggest you not to disable it.<br/>
   * And even when it's enabled, you can still set your own "viewport" meta, it won't be overridden<br/>
   * Only useful on web
   * !#zh 设置引擎是否调整 viewport meta 来配合屏幕适配。
   * 默认设置为启动，我们强烈建议你不要将它设置为关闭。
   * 即使当它启动时，你仍然能够设置你的 viewport meta，它不会被覆盖。
   * 仅在 Web 模式下有效
   * @method adjustViewportMeta
   * @param {Boolean} enabled - Enable automatic modification to "viewport" meta
   */
  adjustViewportMeta: function adjustViewportMeta(enabled) {
    this._isAdjustViewport = enabled;
  },

  /**
   * !#en
   * Retina support is enabled by default for Apple device but disabled for other devices,<br/>
   * it takes effect only when you called setDesignResolutionPolicy<br/>
   * Only useful on web
   * !#zh 对于 Apple 这种支持 Retina 显示的设备上默认进行优化而其他类型设备默认不进行优化，
   * 它仅会在你调用 setDesignResolutionPolicy 方法时有影响。
   * 仅在 Web 模式下有效。
   * @method enableRetina
   * @param {Boolean} enabled - Enable or disable retina display
   */
  enableRetina: function enableRetina(enabled) {
    if (CC_EDITOR && enabled) {
      cc.warn('Can not enable retina in Editor.');
      return;
    }

    this._retinaEnabled = !!enabled;
  },

  /**
   * !#en
   * Check whether retina display is enabled.<br/>
   * Only useful on web
   * !#zh 检查是否对 Retina 显示设备进行优化。
   * 仅在 Web 模式下有效。
   * @method isRetinaEnabled
   * @return {Boolean}
   */
  isRetinaEnabled: function isRetinaEnabled() {
    if (CC_EDITOR) {
      return false;
    }

    return this._retinaEnabled;
  },

  /**
   * !#en Whether to Enable on anti-alias
   * !#zh 控制抗锯齿是否开启
   * @method enableAntiAlias
   * @param {Boolean} enabled - Enable or not anti-alias
   * @deprecated cc.view.enableAntiAlias is deprecated, please use cc.Texture2D.setFilters instead
   * @since v2.3.0
   */
  enableAntiAlias: function enableAntiAlias(enabled) {
    cc.warnID(9200);

    if (this._antiAliasEnabled === enabled) {
      return;
    }

    this._antiAliasEnabled = enabled;

    if (cc.game.renderType === cc.game.RENDER_TYPE_WEBGL) {
      var cache = cc.assetManager.assets;
      cache.forEach(function (asset) {
        if (asset instanceof cc.Texture2D) {
          var Filter = cc.Texture2D.Filter;

          if (enabled) {
            asset.setFilters(Filter.LINEAR, Filter.LINEAR);
          } else {
            asset.setFilters(Filter.NEAREST, Filter.NEAREST);
          }
        }
      });
    } else if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
      var ctx = cc.game.canvas.getContext('2d');
      ctx.imageSmoothingEnabled = enabled;
      ctx.mozImageSmoothingEnabled = enabled;
    }
  },

  /**
   * !#en Returns whether the current enable on anti-alias
   * !#zh 返回当前是否抗锯齿
   * @method isAntiAliasEnabled
   * @return {Boolean}
   */
  isAntiAliasEnabled: function isAntiAliasEnabled() {
    return this._antiAliasEnabled;
  },

  /**
   * !#en
   * If enabled, the application will try automatically to enter full screen mode on mobile devices<br/>
   * You can pass true as parameter to enable it and disable it by passing false.<br/>
   * Only useful on web
   * !#zh 启动时，移动端游戏会在移动端自动尝试进入全屏模式。
   * 你能够传入 true 为参数去启动它，用 false 参数来关闭它。
   * @method enableAutoFullScreen
   * @param {Boolean} enabled - Enable or disable auto full screen on mobile devices
   */
  enableAutoFullScreen: function enableAutoFullScreen(enabled) {
    if (enabled && enabled !== this._autoFullScreen && cc.sys.isMobile) {
      // Automatically full screen when user touches on mobile version
      this._autoFullScreen = true;
      cc.screen.autoFullScreen(cc.game.frame);
    } else {
      this._autoFullScreen = false;
      cc.screen.disableAutoFullScreen(cc.game.frame);
    }
  },

  /**
   * !#en
   * Check whether auto full screen is enabled.<br/>
   * Only useful on web
   * !#zh 检查自动进入全屏模式是否启动。
   * 仅在 Web 模式下有效。
   * @method isAutoFullScreenEnabled
   * @return {Boolean} Auto full screen enabled or not
   */
  isAutoFullScreenEnabled: function isAutoFullScreenEnabled() {
    return this._autoFullScreen;
  },

  /*
   * Not support on native.<br/>
   * On web, it sets the size of the canvas.
   * !#zh 这个方法并不支持 native 平台，在 Web 平台下，可以用来设置 canvas 尺寸。
   * @method setCanvasSize
   * @param {Number} width
   * @param {Number} height
   */
  setCanvasSize: function setCanvasSize(width, height) {
    var canvas = cc.game.canvas;
    var container = cc.game.container;
    canvas.width = width * this._devicePixelRatio;
    canvas.height = height * this._devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    container.style.width = width + 'px';
    container.style.height = height + 'px';

    this._resizeEvent();
  },

  /**
   * !#en
   * Returns the canvas size of the view.<br/>
   * On native platforms, it returns the screen size since the view is a fullscreen view.<br/>
   * On web, it returns the size of the canvas element.
   * !#zh 返回视图中 canvas 的尺寸。
   * 在 native 平台下，它返回全屏视图下屏幕的尺寸。
   * 在 Web 平台下，它返回 canvas 元素尺寸。
   * @method getCanvasSize
   * @return {Size}
   */
  getCanvasSize: function getCanvasSize() {
    return cc.size(cc.game.canvas.width, cc.game.canvas.height);
  },

  /**
   * !#en
   * Returns the frame size of the view.<br/>
   * On native platforms, it returns the screen size since the view is a fullscreen view.<br/>
   * On web, it returns the size of the canvas's outer DOM element.
   * !#zh 返回视图中边框尺寸。
   * 在 native 平台下，它返回全屏视图下屏幕的尺寸。
   * 在 web 平台下，它返回 canvas 元素的外层 DOM 元素尺寸。
   * @method getFrameSize
   * @return {Size}
   */
  getFrameSize: function getFrameSize() {
    return cc.size(this._frameSize.width, this._frameSize.height);
  },

  /**
   * !#en
   * On native, it sets the frame size of view.<br/>
   * On web, it sets the size of the canvas's outer DOM element.
   * !#zh 在 native 平台下，设置视图框架尺寸。
   * 在 web 平台下，设置 canvas 外层 DOM 元素尺寸。
   * @method setFrameSize
   * @param {Number} width
   * @param {Number} height
   */
  setFrameSize: function setFrameSize(width, height) {
    this._frameSize.width = width;
    this._frameSize.height = height;
    cc.game.frame.style.width = width + "px";
    cc.game.frame.style.height = height + "px";

    this._resizeEvent(true);
  },

  /**
   * !#en
   * Returns the visible area size of the view port.
   * !#zh 返回视图窗口可见区域尺寸。
   * @method getVisibleSize
   * @return {Size}
   */
  getVisibleSize: function getVisibleSize() {
    return cc.size(this._visibleRect.width, this._visibleRect.height);
  },

  /**
   * !#en
   * Returns the visible area size of the view port.
   * !#zh 返回视图窗口可见区域像素尺寸。
   * @method getVisibleSizeInPixel
   * @return {Size}
   */
  getVisibleSizeInPixel: function getVisibleSizeInPixel() {
    return cc.size(this._visibleRect.width * this._scaleX, this._visibleRect.height * this._scaleY);
  },

  /**
   * !#en
   * Returns the visible origin of the view port.
   * !#zh 返回视图窗口可见区域原点。
   * @method getVisibleOrigin
   * @return {Vec2}
   */
  getVisibleOrigin: function getVisibleOrigin() {
    return cc.v2(this._visibleRect.x, this._visibleRect.y);
  },

  /**
   * !#en
   * Returns the visible origin of the view port.
   * !#zh 返回视图窗口可见区域像素原点。
   * @method getVisibleOriginInPixel
   * @return {Vec2}
   */
  getVisibleOriginInPixel: function getVisibleOriginInPixel() {
    return cc.v2(this._visibleRect.x * this._scaleX, this._visibleRect.y * this._scaleY);
  },

  /**
   * !#en
   * Returns the current resolution policy
   * !#zh 返回当前分辨率方案
   * @see cc.ResolutionPolicy
   * @method getResolutionPolicy
   * @return {ResolutionPolicy}
   */
  getResolutionPolicy: function getResolutionPolicy() {
    return this._resolutionPolicy;
  },

  /**
   * !#en
   * Sets the current resolution policy
   * !#zh 设置当前分辨率模式
   * @see cc.ResolutionPolicy
   * @method setResolutionPolicy
   * @param {ResolutionPolicy|Number} resolutionPolicy
   */
  setResolutionPolicy: function setResolutionPolicy(resolutionPolicy) {
    var _t = this;

    if (resolutionPolicy instanceof cc.ResolutionPolicy) {
      _t._resolutionPolicy = resolutionPolicy;
    } // Ensure compatibility with JSB
    else {
        var _locPolicy = cc.ResolutionPolicy;
        if (resolutionPolicy === _locPolicy.EXACT_FIT) _t._resolutionPolicy = _t._rpExactFit;
        if (resolutionPolicy === _locPolicy.SHOW_ALL) _t._resolutionPolicy = _t._rpShowAll;
        if (resolutionPolicy === _locPolicy.NO_BORDER) _t._resolutionPolicy = _t._rpNoBorder;
        if (resolutionPolicy === _locPolicy.FIXED_HEIGHT) _t._resolutionPolicy = _t._rpFixedHeight;
        if (resolutionPolicy === _locPolicy.FIXED_WIDTH) _t._resolutionPolicy = _t._rpFixedWidth;
      }
  },

  /**
   * !#en
   * Sets the resolution policy with designed view size in points.<br/>
   * The resolution policy include: <br/>
   * [1] ResolutionExactFit       Fill screen by stretch-to-fit: if the design resolution ratio of width to height is different from the screen resolution ratio, your game view will be stretched.<br/>
   * [2] ResolutionNoBorder       Full screen without black border: if the design resolution ratio of width to height is different from the screen resolution ratio, two areas of your game view will be cut.<br/>
   * [3] ResolutionShowAll        Full screen with black border: if the design resolution ratio of width to height is different from the screen resolution ratio, two black borders will be shown.<br/>
   * [4] ResolutionFixedHeight    Scale the content's height to screen's height and proportionally scale its width<br/>
   * [5] ResolutionFixedWidth     Scale the content's width to screen's width and proportionally scale its height<br/>
   * [cc.ResolutionPolicy]        [Web only feature] Custom resolution policy, constructed by cc.ResolutionPolicy<br/>
   * !#zh 通过设置设计分辨率和匹配模式来进行游戏画面的屏幕适配。
   * @method setDesignResolutionSize
   * @param {Number} width Design resolution width.
   * @param {Number} height Design resolution height.
   * @param {ResolutionPolicy|Number} resolutionPolicy The resolution policy desired
   */
  setDesignResolutionSize: function setDesignResolutionSize(width, height, resolutionPolicy) {
    // Defensive code
    if (!(width > 0 && height > 0)) {
      cc.errorID(2200);
      return;
    }

    this.setResolutionPolicy(resolutionPolicy);
    var policy = this._resolutionPolicy;

    if (policy) {
      policy.preApply(this);
    } // Reinit frame size


    if (cc.sys.isMobile) this._adjustViewportMeta(); // Permit to re-detect the orientation of device.

    this._orientationChanging = true; // If resizing, then frame size is already initialized, this logic should be improved

    if (!this._resizing) this._initFrameSize();

    if (!policy) {
      cc.logID(2201);
      return;
    }

    this._originalDesignResolutionSize.width = this._designResolutionSize.width = width;
    this._originalDesignResolutionSize.height = this._designResolutionSize.height = height;
    var result = policy.apply(this, this._designResolutionSize);

    if (result.scale && result.scale.length === 2) {
      this._scaleX = result.scale[0];
      this._scaleY = result.scale[1];
    }

    if (result.viewport) {
      var vp = this._viewportRect,
          vb = this._visibleRect,
          rv = result.viewport;
      vp.x = rv.x;
      vp.y = rv.y;
      vp.width = rv.width;
      vp.height = rv.height;
      vb.x = 0;
      vb.y = 0;
      vb.width = rv.width / this._scaleX;
      vb.height = rv.height / this._scaleY;
    }

    policy.postApply(this);
    cc.winSize.width = this._visibleRect.width;
    cc.winSize.height = this._visibleRect.height;
    cc.visibleRect && cc.visibleRect.init(this._visibleRect);
    renderer.updateCameraViewport();

    cc.internal.inputManager._updateCanvasBoundingRect();

    this.emit('design-resolution-changed');
  },

  /**
   * !#en
   * Returns the designed size for the view.
   * Default resolution size is the same as 'getFrameSize'.
   * !#zh 返回视图的设计分辨率。
   * 默认下分辨率尺寸同 `getFrameSize` 方法相同
   * @method getDesignResolutionSize
   * @return {Size}
   */
  getDesignResolutionSize: function getDesignResolutionSize() {
    return cc.size(this._designResolutionSize.width, this._designResolutionSize.height);
  },

  /**
   * !#en
   * Sets the container to desired pixel resolution and fit the game content to it.
   * This function is very useful for adaptation in mobile browsers.
   * In some HD android devices, the resolution is very high, but its browser performance may not be very good.
   * In this case, enabling retina display is very costy and not suggested, and if retina is disabled, the image may be blurry.
   * But this API can be helpful to set a desired pixel resolution which is in between.
   * This API will do the following:
   *     1. Set viewport's width to the desired width in pixel
   *     2. Set body width to the exact pixel resolution
   *     3. The resolution policy will be reset with designed view size in points.
   * !#zh 设置容器（container）需要的像素分辨率并且适配相应分辨率的游戏内容。
   * @method setRealPixelResolution
   * @param {Number} width Design resolution width.
   * @param {Number} height Design resolution height.
   * @param {ResolutionPolicy|Number} resolutionPolicy The resolution policy desired
   */
  setRealPixelResolution: function setRealPixelResolution(width, height, resolutionPolicy) {
    if (!CC_JSB && !CC_RUNTIME) {
      // Set viewport's width
      this._setViewportMeta({
        "width": width
      }, true); // Set body width to the exact pixel resolution


      document.documentElement.style.width = width + "px";
      document.body.style.width = width + "px";
      document.body.style.left = "0px";
      document.body.style.top = "0px";
    } // Reset the resolution size and policy


    this.setDesignResolutionSize(width, height, resolutionPolicy);
  },

  /**
   * !#en
   * Sets view port rectangle with points.
   * !#zh 用设计分辨率下的点尺寸来设置视窗。
   * @method setViewportInPoints
   * @deprecated since v2.0
   * @param {Number} x
   * @param {Number} y
   * @param {Number} w width
   * @param {Number} h height
   */
  setViewportInPoints: function setViewportInPoints(x, y, w, h) {
    var locScaleX = this._scaleX,
        locScaleY = this._scaleY;

    cc.game._renderContext.viewport(x * locScaleX + this._viewportRect.x, y * locScaleY + this._viewportRect.y, w * locScaleX, h * locScaleY);
  },

  /**
   * !#en
   * Sets Scissor rectangle with points.
   * !#zh 用设计分辨率下的点的尺寸来设置 scissor 剪裁区域。
   * @method setScissorInPoints
   * @deprecated since v2.0
   * @param {Number} x
   * @param {Number} y
   * @param {Number} w
   * @param {Number} h
   */
  setScissorInPoints: function setScissorInPoints(x, y, w, h) {
    var scaleX = this._scaleX,
        scaleY = this._scaleY;
    var sx = Math.ceil(x * scaleX + this._viewportRect.x);
    var sy = Math.ceil(y * scaleY + this._viewportRect.y);
    var sw = Math.ceil(w * scaleX);
    var sh = Math.ceil(h * scaleY);
    var gl = cc.game._renderContext;

    if (!_scissorRect) {
      var boxArr = gl.getParameter(gl.SCISSOR_BOX);
      _scissorRect = cc.rect(boxArr[0], boxArr[1], boxArr[2], boxArr[3]);
    }

    if (_scissorRect.x !== sx || _scissorRect.y !== sy || _scissorRect.width !== sw || _scissorRect.height !== sh) {
      _scissorRect.x = sx;
      _scissorRect.y = sy;
      _scissorRect.width = sw;
      _scissorRect.height = sh;
      gl.scissor(sx, sy, sw, sh);
    }
  },

  /**
   * !#en
   * Returns whether GL_SCISSOR_TEST is enable
   * !#zh 检查 scissor 是否生效。
   * @method isScissorEnabled
   * @deprecated since v2.0
   * @return {Boolean}
   */
  isScissorEnabled: function isScissorEnabled() {
    return cc.game._renderContext.isEnabled(gl.SCISSOR_TEST);
  },

  /**
   * !#en
   * Returns the current scissor rectangle
   * !#zh 返回当前的 scissor 剪裁区域。
   * @method getScissorRect
   * @deprecated since v2.0
   * @return {Rect}
   */
  getScissorRect: function getScissorRect() {
    if (!_scissorRect) {
      var boxArr = gl.getParameter(gl.SCISSOR_BOX);
      _scissorRect = cc.rect(boxArr[0], boxArr[1], boxArr[2], boxArr[3]);
    }

    var scaleXFactor = 1 / this._scaleX;
    var scaleYFactor = 1 / this._scaleY;
    return cc.rect((_scissorRect.x - this._viewportRect.x) * scaleXFactor, (_scissorRect.y - this._viewportRect.y) * scaleYFactor, _scissorRect.width * scaleXFactor, _scissorRect.height * scaleYFactor);
  },

  /**
   * !#en
   * Returns the view port rectangle.
   * !#zh 返回视窗剪裁区域。
   * @method getViewportRect
   * @return {Rect}
   */
  getViewportRect: function getViewportRect() {
    return this._viewportRect;
  },

  /**
   * !#en
   * Returns scale factor of the horizontal direction (X axis).
   * !#zh 返回横轴的缩放比，这个缩放比是将画布像素分辨率放到设计分辨率的比例。
   * @method getScaleX
   * @return {Number}
   */
  getScaleX: function getScaleX() {
    return this._scaleX;
  },

  /**
   * !#en
   * Returns scale factor of the vertical direction (Y axis).
   * !#zh 返回纵轴的缩放比，这个缩放比是将画布像素分辨率缩放到设计分辨率的比例。
   * @method getScaleY
   * @return {Number}
   */
  getScaleY: function getScaleY() {
    return this._scaleY;
  },

  /**
   * !#en
   * Returns device pixel ratio for retina display.
   * !#zh 返回设备或浏览器像素比例。
   * @method getDevicePixelRatio
   * @return {Number}
   */
  getDevicePixelRatio: function getDevicePixelRatio() {
    return this._devicePixelRatio;
  },

  /**
   * !#en
   * Returns the real location in view for a translation based on a related position
   * !#zh 将屏幕坐标转换为游戏视图下的坐标。
   * @method convertToLocationInView
   * @param {Number} tx - The X axis translation
   * @param {Number} ty - The Y axis translation
   * @param {Object} relatedPos - The related position object including "left", "top", "width", "height" informations
   * @return {Vec2}
   */
  convertToLocationInView: function convertToLocationInView(tx, ty, relatedPos, out) {
    var result = out || cc.v2();
    var posLeft = relatedPos.adjustedLeft ? relatedPos.adjustedLeft : relatedPos.left;
    var posTop = relatedPos.adjustedTop ? relatedPos.adjustedTop : relatedPos.top;
    var x = this._devicePixelRatio * (tx - posLeft);
    var y = this._devicePixelRatio * (posTop + relatedPos.height - ty);

    if (this._isRotated) {
      result.x = cc.game.canvas.width - y;
      result.y = x;
    } else {
      result.x = x;
      result.y = y;
    }

    return result;
  },
  _convertMouseToLocationInView: function _convertMouseToLocationInView(in_out_point, relatedPos) {
    var viewport = this._viewportRect,
        _t = this;

    in_out_point.x = (_t._devicePixelRatio * (in_out_point.x - relatedPos.left) - viewport.x) / _t._scaleX;
    in_out_point.y = (_t._devicePixelRatio * (relatedPos.top + relatedPos.height - in_out_point.y) - viewport.y) / _t._scaleY;
  },
  _convertPointWithScale: function _convertPointWithScale(point) {
    var viewport = this._viewportRect;
    point.x = (point.x - viewport.x) / this._scaleX;
    point.y = (point.y - viewport.y) / this._scaleY;
  },
  _convertTouchesWithScale: function _convertTouchesWithScale(touches) {
    var viewport = this._viewportRect,
        scaleX = this._scaleX,
        scaleY = this._scaleY,
        selTouch,
        selPoint,
        selPrePoint;

    for (var i = 0; i < touches.length; i++) {
      selTouch = touches[i];
      selPoint = selTouch._point;
      selPrePoint = selTouch._prevPoint;
      selPoint.x = (selPoint.x - viewport.x) / scaleX;
      selPoint.y = (selPoint.y - viewport.y) / scaleY;
      selPrePoint.x = (selPrePoint.x - viewport.x) / scaleX;
      selPrePoint.y = (selPrePoint.y - viewport.y) / scaleY;
    }
  }
});
/**
 * !#en
 * Emit when design resolution changed.
 * !#zh
 * 当设计分辨率改变时发送。
 * @event design-resolution-changed
 */

/**
* !#en
* Emit when canvas resize.
* !#zh
* 当画布大小改变时发送。
* @event canvas-resize
*/

/**
 * <p>cc.game.containerStrategy class is the root strategy class of container's scale strategy,
 * it controls the behavior of how to scale the cc.game.container and cc.game.canvas object</p>
 *
 * @class ContainerStrategy
 */

cc.ContainerStrategy = cc.Class({
  name: "ContainerStrategy",

  /**
   * !#en
   * Manipulation before appling the strategy
   * !#zh 在应用策略之前的操作
   * @method preApply
   * @param {View} view - The target view
   */
  preApply: function preApply(view) {},

  /**
   * !#en
   * Function to apply this strategy
   * !#zh 策略应用方法
   * @method apply
   * @param {View} view
   * @param {Size} designedResolution
   */
  apply: function apply(view, designedResolution) {},

  /**
   * !#en
   * Manipulation after applying the strategy
   * !#zh 策略调用之后的操作
   * @method postApply
   * @param {View} view  The target view
   */
  postApply: function postApply(view) {},
  _setupContainer: function _setupContainer(view, w, h) {
    var locCanvas = cc.game.canvas;

    this._setupStyle(view, w, h); // Setup pixel ratio for retina display


    var devicePixelRatio = view._devicePixelRatio = 1;

    if (CC_JSB) {
      // view.isRetinaEnabled only work on web. 
      devicePixelRatio = view._devicePixelRatio = window.devicePixelRatio;
    } else if (view.isRetinaEnabled()) {
      devicePixelRatio = view._devicePixelRatio = Math.min(view._maxPixelRatio, window.devicePixelRatio || 1);
    } // Setup canvas


    locCanvas.width = w * devicePixelRatio;
    locCanvas.height = h * devicePixelRatio;
  },
  _setupStyle: function _setupStyle(view, w, h) {
    var locCanvas = cc.game.canvas;
    var locContainer = cc.game.container;

    if (cc.sys.os === cc.sys.OS_ANDROID) {
      document.body.style.width = (view._isRotated ? h : w) + 'px';
      document.body.style.height = (view._isRotated ? w : h) + 'px';
    } // Setup style


    locContainer.style.width = locCanvas.style.width = w + 'px';
    locContainer.style.height = locCanvas.style.height = h + 'px';
  },
  _fixContainer: function _fixContainer() {
    // Add container to document body
    document.body.insertBefore(cc.game.container, document.body.firstChild); // Set body's width height to window's size, and forbid overflow, so that game will be centered

    var bs = document.body.style;
    bs.width = window.innerWidth + "px";
    bs.height = window.innerHeight + "px";
    bs.overflow = "hidden"; // Body size solution doesn't work on all mobile browser so this is the aleternative: fixed container

    var contStyle = cc.game.container.style;
    contStyle.position = "fixed";
    contStyle.left = contStyle.top = "0px"; // Reposition body

    document.body.scrollTop = 0;
  }
});
/**
 * <p>cc.ContentStrategy class is the root strategy class of content's scale strategy,
 * it controls the behavior of how to scale the scene and setup the viewport for the game</p>
 *
 * @class ContentStrategy
 */

cc.ContentStrategy = cc.Class({
  name: "ContentStrategy",
  ctor: function ctor() {
    this._result = {
      scale: [1, 1],
      viewport: null
    };
  },
  _buildResult: function _buildResult(containerW, containerH, contentW, contentH, scaleX, scaleY) {
    // Makes content fit better the canvas
    Math.abs(containerW - contentW) < 2 && (contentW = containerW);
    Math.abs(containerH - contentH) < 2 && (contentH = containerH);
    var viewport = cc.rect((containerW - contentW) / 2, (containerH - contentH) / 2, contentW, contentH); // Translate the content

    if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {//TODO: modify something for setTransform
      //cc.game._renderContext.translate(viewport.x, viewport.y + contentH);
    }

    this._result.scale = [scaleX, scaleY];
    this._result.viewport = viewport;
    return this._result;
  },

  /**
   * !#en
   * Manipulation before applying the strategy
   * !#zh 策略应用前的操作
   * @method preApply
   * @param {View} view - The target view
   */
  preApply: function preApply(view) {},

  /**
   * !#en Function to apply this strategy
   * The return value is {scale: [scaleX, scaleY], viewport: {cc.Rect}},
   * The target view can then apply these value to itself, it's preferred not to modify directly its private variables
   * !#zh 调用策略方法
   * @method apply
   * @param {View} view
   * @param {Size} designedResolution
   * @return {Object} scaleAndViewportRect
   */
  apply: function apply(view, designedResolution) {
    return {
      "scale": [1, 1]
    };
  },

  /**
   * !#en
   * Manipulation after applying the strategy
   * !#zh 策略调用之后的操作
   * @method postApply
   * @param {View} view - The target view
   */
  postApply: function postApply(view) {}
});

(function () {
  // Container scale strategys

  /**
   * @class EqualToFrame
   * @extends ContainerStrategy
   */
  var EqualToFrame = cc.Class({
    name: "EqualToFrame",
    "extends": cc.ContainerStrategy,
    apply: function apply(view) {
      var frameH = view._frameSize.height,
          containerStyle = cc.game.container.style;

      this._setupContainer(view, view._frameSize.width, view._frameSize.height); // Setup container's margin and padding


      if (view._isRotated) {
        containerStyle.margin = '0 0 0 ' + frameH + 'px';
      } else {
        containerStyle.margin = '0px';
      }

      containerStyle.padding = "0px";
    }
  });
  /**
   * @class ProportionalToFrame
   * @extends ContainerStrategy
   */

  var ProportionalToFrame = cc.Class({
    name: "ProportionalToFrame",
    "extends": cc.ContainerStrategy,
    apply: function apply(view, designedResolution) {
      var frameW = view._frameSize.width,
          frameH = view._frameSize.height,
          containerStyle = cc.game.container.style,
          designW = designedResolution.width,
          designH = designedResolution.height,
          scaleX = frameW / designW,
          scaleY = frameH / designH,
          containerW,
          containerH;
      scaleX < scaleY ? (containerW = frameW, containerH = designH * scaleX) : (containerW = designW * scaleY, containerH = frameH); // Adjust container size with integer value

      var offx = Math.round((frameW - containerW) / 2);
      var offy = Math.round((frameH - containerH) / 2);
      containerW = frameW - 2 * offx;
      containerH = frameH - 2 * offy;

      this._setupContainer(view, containerW, containerH);

      if (!CC_EDITOR) {
        // Setup container's margin and padding
        if (view._isRotated) {
          containerStyle.margin = '0 0 0 ' + frameH + 'px';
        } else {
          containerStyle.margin = '0px';
        }

        containerStyle.paddingLeft = offx + "px";
        containerStyle.paddingRight = offx + "px";
        containerStyle.paddingTop = offy + "px";
        containerStyle.paddingBottom = offy + "px";
      }
    }
  });
  /**
   * @class EqualToWindow
   * @extends EqualToFrame
   */

  var EqualToWindow = cc.Class({
    name: "EqualToWindow",
    "extends": EqualToFrame,
    preApply: function preApply(view) {
      this._super(view);

      cc.game.frame = document.documentElement;
    },
    apply: function apply(view) {
      this._super(view);

      this._fixContainer();
    }
  });
  /**
   * @class ProportionalToWindow
   * @extends ProportionalToFrame
   */

  var ProportionalToWindow = cc.Class({
    name: "ProportionalToWindow",
    "extends": ProportionalToFrame,
    preApply: function preApply(view) {
      this._super(view);

      cc.game.frame = document.documentElement;
    },
    apply: function apply(view, designedResolution) {
      this._super(view, designedResolution);

      this._fixContainer();
    }
  });
  /**
   * @class OriginalContainer
   * @extends ContainerStrategy
   */

  var OriginalContainer = cc.Class({
    name: "OriginalContainer",
    "extends": cc.ContainerStrategy,
    apply: function apply(view) {
      this._setupContainer(view, cc.game.canvas.width, cc.game.canvas.height);
    }
  }); // need to adapt prototype before instantiating

  var _global = typeof window === 'undefined' ? global : window;

  var globalAdapter = _global.__globalAdapter;

  if (globalAdapter) {
    if (globalAdapter.adaptContainerStrategy) {
      globalAdapter.adaptContainerStrategy(cc.ContainerStrategy.prototype);
    }

    if (globalAdapter.adaptView) {
      globalAdapter.adaptView(View.prototype);
    }
  } // #NOT STABLE on Android# Alias: Strategy that makes the container's size equals to the window's size
  //    cc.ContainerStrategy.EQUAL_TO_WINDOW = new EqualToWindow();
  // #NOT STABLE on Android# Alias: Strategy that scale proportionally the container's size to window's size
  //    cc.ContainerStrategy.PROPORTION_TO_WINDOW = new ProportionalToWindow();
  // Alias: Strategy that makes the container's size equals to the frame's size


  cc.ContainerStrategy.EQUAL_TO_FRAME = new EqualToFrame(); // Alias: Strategy that scale proportionally the container's size to frame's size

  cc.ContainerStrategy.PROPORTION_TO_FRAME = new ProportionalToFrame(); // Alias: Strategy that keeps the original container's size

  cc.ContainerStrategy.ORIGINAL_CONTAINER = new OriginalContainer(); // Content scale strategys

  var ExactFit = cc.Class({
    name: "ExactFit",
    "extends": cc.ContentStrategy,
    apply: function apply(view, designedResolution) {
      var containerW = cc.game.canvas.width,
          containerH = cc.game.canvas.height,
          scaleX = containerW / designedResolution.width,
          scaleY = containerH / designedResolution.height;
      return this._buildResult(containerW, containerH, containerW, containerH, scaleX, scaleY);
    }
  });
  var ShowAll = cc.Class({
    name: "ShowAll",
    "extends": cc.ContentStrategy,
    apply: function apply(view, designedResolution) {
      var containerW = cc.game.canvas.width,
          containerH = cc.game.canvas.height,
          designW = designedResolution.width,
          designH = designedResolution.height,
          scaleX = containerW / designW,
          scaleY = containerH / designH,
          scale = 0,
          contentW,
          contentH;
      scaleX < scaleY ? (scale = scaleX, contentW = containerW, contentH = designH * scale) : (scale = scaleY, contentW = designW * scale, contentH = containerH);
      return this._buildResult(containerW, containerH, contentW, contentH, scale, scale);
    }
  });
  var NoBorder = cc.Class({
    name: "NoBorder",
    "extends": cc.ContentStrategy,
    apply: function apply(view, designedResolution) {
      var containerW = cc.game.canvas.width,
          containerH = cc.game.canvas.height,
          designW = designedResolution.width,
          designH = designedResolution.height,
          scaleX = containerW / designW,
          scaleY = containerH / designH,
          scale,
          contentW,
          contentH;
      scaleX < scaleY ? (scale = scaleY, contentW = designW * scale, contentH = containerH) : (scale = scaleX, contentW = containerW, contentH = designH * scale);
      return this._buildResult(containerW, containerH, contentW, contentH, scale, scale);
    }
  });
  var FixedHeight = cc.Class({
    name: "FixedHeight",
    "extends": cc.ContentStrategy,
    apply: function apply(view, designedResolution) {
      var containerW = cc.game.canvas.width,
          containerH = cc.game.canvas.height,
          designH = designedResolution.height,
          scale = containerH / designH,
          contentW = containerW,
          contentH = containerH;
      return this._buildResult(containerW, containerH, contentW, contentH, scale, scale);
    }
  });
  var FixedWidth = cc.Class({
    name: "FixedWidth",
    "extends": cc.ContentStrategy,
    apply: function apply(view, designedResolution) {
      var containerW = cc.game.canvas.width,
          containerH = cc.game.canvas.height,
          designW = designedResolution.width,
          scale = containerW / designW,
          contentW = containerW,
          contentH = containerH;
      return this._buildResult(containerW, containerH, contentW, contentH, scale, scale);
    }
  }); // Alias: Strategy to scale the content's size to container's size, non proportional

  cc.ContentStrategy.EXACT_FIT = new ExactFit(); // Alias: Strategy to scale the content's size proportionally to maximum size and keeps the whole content area to be visible

  cc.ContentStrategy.SHOW_ALL = new ShowAll(); // Alias: Strategy to scale the content's size proportionally to fill the whole container area

  cc.ContentStrategy.NO_BORDER = new NoBorder(); // Alias: Strategy to scale the content's height to container's height and proportionally scale its width

  cc.ContentStrategy.FIXED_HEIGHT = new FixedHeight(); // Alias: Strategy to scale the content's width to container's width and proportionally scale its height

  cc.ContentStrategy.FIXED_WIDTH = new FixedWidth();
})();
/**
 * <p>cc.ResolutionPolicy class is the root strategy class of scale strategy,
 * its main task is to maintain the compatibility with Cocos2d-x</p>
 *
 * @class ResolutionPolicy
 */

/**
 * @method constructor
 * @param {ContainerStrategy} containerStg The container strategy
 * @param {ContentStrategy} contentStg The content strategy
 */


cc.ResolutionPolicy = cc.Class({
  name: "cc.ResolutionPolicy",

  /**
   * Constructor of cc.ResolutionPolicy
   * @param {ContainerStrategy} containerStg
   * @param {ContentStrategy} contentStg
   */
  ctor: function ctor(containerStg, contentStg) {
    this._containerStrategy = null;
    this._contentStrategy = null;
    this.setContainerStrategy(containerStg);
    this.setContentStrategy(contentStg);
  },

  /**
   * !#en Manipulation before applying the resolution policy
   * !#zh 策略应用前的操作
   * @method preApply
   * @param {View} view The target view
   */
  preApply: function preApply(view) {
    this._containerStrategy.preApply(view);

    this._contentStrategy.preApply(view);
  },

  /**
   * !#en Function to apply this resolution policy
   * The return value is {scale: [scaleX, scaleY], viewport: {cc.Rect}},
   * The target view can then apply these value to itself, it's preferred not to modify directly its private variables
   * !#zh 调用策略方法
   * @method apply
   * @param {View} view - The target view
   * @param {Size} designedResolution - The user defined design resolution
   * @return {Object} An object contains the scale X/Y values and the viewport rect
   */
  apply: function apply(view, designedResolution) {
    this._containerStrategy.apply(view, designedResolution);

    return this._contentStrategy.apply(view, designedResolution);
  },

  /**
   * !#en Manipulation after appyling the strategy
   * !#zh 策略应用之后的操作
   * @method postApply
   * @param {View} view - The target view
   */
  postApply: function postApply(view) {
    this._containerStrategy.postApply(view);

    this._contentStrategy.postApply(view);
  },

  /**
   * !#en
   * Setup the container's scale strategy
   * !#zh 设置容器的适配策略
   * @method setContainerStrategy
   * @param {ContainerStrategy} containerStg
   */
  setContainerStrategy: function setContainerStrategy(containerStg) {
    if (containerStg instanceof cc.ContainerStrategy) this._containerStrategy = containerStg;
  },

  /**
   * !#en
   * Setup the content's scale strategy
   * !#zh 设置内容的适配策略
   * @method setContentStrategy
   * @param {ContentStrategy} contentStg
   */
  setContentStrategy: function setContentStrategy(contentStg) {
    if (contentStg instanceof cc.ContentStrategy) this._contentStrategy = contentStg;
  }
});
js.get(cc.ResolutionPolicy.prototype, "canvasSize", function () {
  return cc.v2(cc.game.canvas.width, cc.game.canvas.height);
});
/**
 * The entire application is visible in the specified area without trying to preserve the original aspect ratio.<br/>
 * Distortion can occur, and the application may appear stretched or compressed.
 * @property {Number} EXACT_FIT
 * @readonly
 * @static
 */

cc.ResolutionPolicy.EXACT_FIT = 0;
/**
 * The entire application fills the specified area, without distortion but possibly with some cropping,<br/>
 * while maintaining the original aspect ratio of the application.
 * @property {Number} NO_BORDER
 * @readonly
 * @static
 */

cc.ResolutionPolicy.NO_BORDER = 1;
/**
 * The entire application is visible in the specified area without distortion while maintaining the original<br/>
 * aspect ratio of the application. Borders can appear on two sides of the application.
 * @property {Number} SHOW_ALL
 * @readonly
 * @static
 */

cc.ResolutionPolicy.SHOW_ALL = 2;
/**
 * The application takes the height of the design resolution size and modifies the width of the internal<br/>
 * canvas so that it fits the aspect ratio of the device<br/>
 * no distortion will occur however you must make sure your application works on different<br/>
 * aspect ratios
 * @property {Number} FIXED_HEIGHT
 * @readonly
 * @static
 */

cc.ResolutionPolicy.FIXED_HEIGHT = 3;
/**
 * The application takes the width of the design resolution size and modifies the height of the internal<br/>
 * canvas so that it fits the aspect ratio of the device<br/>
 * no distortion will occur however you must make sure your application works on different<br/>
 * aspect ratios
 * @property {Number} FIXED_WIDTH
 * @readonly
 * @static
 */

cc.ResolutionPolicy.FIXED_WIDTH = 4;
/**
 * Unknow policy
 * @property {Number} UNKNOWN
 * @readonly
 * @static
 */

cc.ResolutionPolicy.UNKNOWN = 5;
/**
 * @module cc
 */

/**
 * !#en cc.view is the shared view object.
 * !#zh cc.view 是全局的视图对象。
 * @property view
 * @static
 * @type {View}
 */

cc.view = new View();
/**
 * !#en cc.winSize is the alias object for the size of the current game window.
 * !#zh cc.winSize 为当前的游戏窗口的大小。
 * @property winSize
 * @type Size
 */

cc.winSize = cc.size();
module.exports = cc.view;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BsYXRmb3JtL0NDVmlldy5qcyJdLCJuYW1lcyI6WyJFdmVudFRhcmdldCIsInJlcXVpcmUiLCJqcyIsInJlbmRlcmVyIiwiX19Ccm93c2VyR2V0dGVyIiwiaW5pdCIsImh0bWwiLCJkb2N1bWVudCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiYXZhaWxXaWR0aCIsImZyYW1lIiwid2luZG93IiwiaW5uZXJXaWR0aCIsImNsaWVudFdpZHRoIiwiYXZhaWxIZWlnaHQiLCJpbm5lckhlaWdodCIsImNsaWVudEhlaWdodCIsIm1ldGEiLCJhZGFwdGF0aW9uVHlwZSIsImNjIiwic3lzIiwiYnJvd3NlclR5cGUiLCJvcyIsIk9TX0lPUyIsIkJST1dTRVJfVFlQRV9TQUZBUkkiLCJCUk9XU0VSX1RZUEVfU09VR09VIiwiQlJPV1NFUl9UWVBFX1VDIiwiX3NjaXNzb3JSZWN0IiwiVmlldyIsImNhbGwiLCJfdCIsIl9zdHJhdGVneWVyIiwiQ29udGFpbmVyU3RyYXRlZ3kiLCJfc3RyYXRlZ3kiLCJDb250ZW50U3RyYXRlZ3kiLCJfZnJhbWVTaXplIiwic2l6ZSIsIl9kZXNpZ25SZXNvbHV0aW9uU2l6ZSIsIl9vcmlnaW5hbERlc2lnblJlc29sdXRpb25TaXplIiwiX3NjYWxlWCIsIl9zY2FsZVkiLCJfdmlld3BvcnRSZWN0IiwicmVjdCIsIl92aXNpYmxlUmVjdCIsIl9hdXRvRnVsbFNjcmVlbiIsIl9kZXZpY2VQaXhlbFJhdGlvIiwiQ0NfSlNCIiwiX21heFBpeGVsUmF0aW8iLCJfcmV0aW5hRW5hYmxlZCIsIl9yZXNpemVDYWxsYmFjayIsIl9yZXNpemluZyIsIl9yZXNpemVXaXRoQnJvd3NlclNpemUiLCJfb3JpZW50YXRpb25DaGFuZ2luZyIsIl9pc1JvdGF0ZWQiLCJfb3JpZW50YXRpb24iLCJtYWNybyIsIk9SSUVOVEFUSU9OX0FVVE8iLCJfaXNBZGp1c3RWaWV3cG9ydCIsIl9hbnRpQWxpYXNFbmFibGVkIiwiX3Jlc29sdXRpb25Qb2xpY3kiLCJfcnBFeGFjdEZpdCIsIlJlc29sdXRpb25Qb2xpY3kiLCJFUVVBTF9UT19GUkFNRSIsIkVYQUNUX0ZJVCIsIl9ycFNob3dBbGwiLCJTSE9XX0FMTCIsIl9ycE5vQm9yZGVyIiwiTk9fQk9SREVSIiwiX3JwRml4ZWRIZWlnaHQiLCJGSVhFRF9IRUlHSFQiLCJfcnBGaXhlZFdpZHRoIiwiRklYRURfV0lEVEgiLCJnYW1lIiwib25jZSIsIkVWRU5UX0VOR0lORV9JTklURUQiLCJleHRlbmQiLCJtaXhpbiIsInByb3RvdHlwZSIsIl9pbml0RnJhbWVTaXplIiwidyIsImNhbnZhcyIsIndpZHRoIiwiaCIsImhlaWdodCIsIndpblNpemUiLCJ2aXNpYmxlUmVjdCIsIl9yZXNpemVFdmVudCIsImZvcmNlT3JFdmVudCIsInZpZXciLCJzZXREZXNpZ25SZXNvbHV0aW9uU2l6ZSIsInNldFRpbWVvdXQiLCJwcmV2RnJhbWVXIiwicHJldkZyYW1lSCIsInByZXZSb3RhdGVkIiwiaXNNb2JpbGUiLCJjb250YWluZXJTdHlsZSIsImNvbnRhaW5lciIsInN0eWxlIiwibWFyZ2luIiwiZGlzcGxheSIsImVtaXQiLCJfb3JpZW50YXRpb25DaGFuZ2UiLCJzY3JvbGxUbyIsIl9yZXNpemUiLCJyZXNpemVXaXRoQnJvd3NlclNpemUiLCJlbmFibGVkIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJzZXRSZXNpemVDYWxsYmFjayIsImNhbGxiYWNrIiwiQ0NfRURJVE9SIiwic2V0T3JpZW50YXRpb24iLCJvcmllbnRhdGlvbiIsImRlc2lnbldpZHRoIiwiZGVzaWduSGVpZ2h0IiwibG9jRnJhbWVTaXplIiwiaXNMYW5kc2NhcGUiLCJPUklFTlRBVElPTl9MQU5EU0NBUEUiLCJPUklFTlRBVElPTl9QT1JUUkFJVCIsInRyYW5zZm9ybSIsInRyYW5zZm9ybU9yaWdpbiIsIl9zZXRWaWV3cG9ydE1ldGEiLCJtZXRhcyIsIm92ZXJ3cml0ZSIsInZwIiwiZ2V0RWxlbWVudEJ5SWQiLCJoZWFkIiwicmVtb3ZlQ2hpbGQiLCJlbGVtcyIsImdldEVsZW1lbnRzQnlOYW1lIiwiY3VycmVudFZQIiwiY29udGVudCIsImtleSIsInBhdHRlcm4iLCJjcmVhdGVFbGVtZW50IiwiaWQiLCJuYW1lIiwiaW5kZXhPZiIsIlJlZ0V4cCIsInJlcGxhY2UiLCJ0ZXN0Iiwic3Vic3RyIiwiYXBwZW5kQ2hpbGQiLCJfYWRqdXN0Vmlld3BvcnRNZXRhIiwiQ0NfUlVOVElNRSIsImFkanVzdFZpZXdwb3J0TWV0YSIsImVuYWJsZVJldGluYSIsIndhcm4iLCJpc1JldGluYUVuYWJsZWQiLCJlbmFibGVBbnRpQWxpYXMiLCJ3YXJuSUQiLCJyZW5kZXJUeXBlIiwiUkVOREVSX1RZUEVfV0VCR0wiLCJjYWNoZSIsImFzc2V0TWFuYWdlciIsImFzc2V0cyIsImZvckVhY2giLCJhc3NldCIsIlRleHR1cmUyRCIsIkZpbHRlciIsInNldEZpbHRlcnMiLCJMSU5FQVIiLCJORUFSRVNUIiwiUkVOREVSX1RZUEVfQ0FOVkFTIiwiY3R4IiwiZ2V0Q29udGV4dCIsImltYWdlU21vb3RoaW5nRW5hYmxlZCIsIm1vekltYWdlU21vb3RoaW5nRW5hYmxlZCIsImlzQW50aUFsaWFzRW5hYmxlZCIsImVuYWJsZUF1dG9GdWxsU2NyZWVuIiwic2NyZWVuIiwiYXV0b0Z1bGxTY3JlZW4iLCJkaXNhYmxlQXV0b0Z1bGxTY3JlZW4iLCJpc0F1dG9GdWxsU2NyZWVuRW5hYmxlZCIsInNldENhbnZhc1NpemUiLCJnZXRDYW52YXNTaXplIiwiZ2V0RnJhbWVTaXplIiwic2V0RnJhbWVTaXplIiwiZ2V0VmlzaWJsZVNpemUiLCJnZXRWaXNpYmxlU2l6ZUluUGl4ZWwiLCJnZXRWaXNpYmxlT3JpZ2luIiwidjIiLCJ4IiwieSIsImdldFZpc2libGVPcmlnaW5JblBpeGVsIiwiZ2V0UmVzb2x1dGlvblBvbGljeSIsInNldFJlc29sdXRpb25Qb2xpY3kiLCJyZXNvbHV0aW9uUG9saWN5IiwiX2xvY1BvbGljeSIsImVycm9ySUQiLCJwb2xpY3kiLCJwcmVBcHBseSIsImxvZ0lEIiwicmVzdWx0IiwiYXBwbHkiLCJzY2FsZSIsImxlbmd0aCIsInZpZXdwb3J0IiwidmIiLCJydiIsInBvc3RBcHBseSIsInVwZGF0ZUNhbWVyYVZpZXdwb3J0IiwiaW50ZXJuYWwiLCJpbnB1dE1hbmFnZXIiLCJfdXBkYXRlQ2FudmFzQm91bmRpbmdSZWN0IiwiZ2V0RGVzaWduUmVzb2x1dGlvblNpemUiLCJzZXRSZWFsUGl4ZWxSZXNvbHV0aW9uIiwiZG9jdW1lbnRFbGVtZW50IiwiYm9keSIsImxlZnQiLCJ0b3AiLCJzZXRWaWV3cG9ydEluUG9pbnRzIiwibG9jU2NhbGVYIiwibG9jU2NhbGVZIiwiX3JlbmRlckNvbnRleHQiLCJzZXRTY2lzc29ySW5Qb2ludHMiLCJzY2FsZVgiLCJzY2FsZVkiLCJzeCIsIk1hdGgiLCJjZWlsIiwic3kiLCJzdyIsInNoIiwiZ2wiLCJib3hBcnIiLCJnZXRQYXJhbWV0ZXIiLCJTQ0lTU09SX0JPWCIsInNjaXNzb3IiLCJpc1NjaXNzb3JFbmFibGVkIiwiaXNFbmFibGVkIiwiU0NJU1NPUl9URVNUIiwiZ2V0U2Npc3NvclJlY3QiLCJzY2FsZVhGYWN0b3IiLCJzY2FsZVlGYWN0b3IiLCJnZXRWaWV3cG9ydFJlY3QiLCJnZXRTY2FsZVgiLCJnZXRTY2FsZVkiLCJnZXREZXZpY2VQaXhlbFJhdGlvIiwiY29udmVydFRvTG9jYXRpb25JblZpZXciLCJ0eCIsInR5IiwicmVsYXRlZFBvcyIsIm91dCIsInBvc0xlZnQiLCJhZGp1c3RlZExlZnQiLCJwb3NUb3AiLCJhZGp1c3RlZFRvcCIsIl9jb252ZXJ0TW91c2VUb0xvY2F0aW9uSW5WaWV3IiwiaW5fb3V0X3BvaW50IiwiX2NvbnZlcnRQb2ludFdpdGhTY2FsZSIsInBvaW50IiwiX2NvbnZlcnRUb3VjaGVzV2l0aFNjYWxlIiwidG91Y2hlcyIsInNlbFRvdWNoIiwic2VsUG9pbnQiLCJzZWxQcmVQb2ludCIsImkiLCJfcG9pbnQiLCJfcHJldlBvaW50IiwiQ2xhc3MiLCJkZXNpZ25lZFJlc29sdXRpb24iLCJfc2V0dXBDb250YWluZXIiLCJsb2NDYW52YXMiLCJfc2V0dXBTdHlsZSIsImRldmljZVBpeGVsUmF0aW8iLCJtaW4iLCJsb2NDb250YWluZXIiLCJPU19BTkRST0lEIiwiX2ZpeENvbnRhaW5lciIsImluc2VydEJlZm9yZSIsImZpcnN0Q2hpbGQiLCJicyIsIm92ZXJmbG93IiwiY29udFN0eWxlIiwicG9zaXRpb24iLCJzY3JvbGxUb3AiLCJjdG9yIiwiX3Jlc3VsdCIsIl9idWlsZFJlc3VsdCIsImNvbnRhaW5lclciLCJjb250YWluZXJIIiwiY29udGVudFciLCJjb250ZW50SCIsImFicyIsIkVxdWFsVG9GcmFtZSIsImZyYW1lSCIsInBhZGRpbmciLCJQcm9wb3J0aW9uYWxUb0ZyYW1lIiwiZnJhbWVXIiwiZGVzaWduVyIsImRlc2lnbkgiLCJvZmZ4Iiwicm91bmQiLCJvZmZ5IiwicGFkZGluZ0xlZnQiLCJwYWRkaW5nUmlnaHQiLCJwYWRkaW5nVG9wIiwicGFkZGluZ0JvdHRvbSIsIkVxdWFsVG9XaW5kb3ciLCJfc3VwZXIiLCJQcm9wb3J0aW9uYWxUb1dpbmRvdyIsIk9yaWdpbmFsQ29udGFpbmVyIiwiX2dsb2JhbCIsImdsb2JhbCIsImdsb2JhbEFkYXB0ZXIiLCJfX2dsb2JhbEFkYXB0ZXIiLCJhZGFwdENvbnRhaW5lclN0cmF0ZWd5IiwiYWRhcHRWaWV3IiwiUFJPUE9SVElPTl9UT19GUkFNRSIsIk9SSUdJTkFMX0NPTlRBSU5FUiIsIkV4YWN0Rml0IiwiU2hvd0FsbCIsIk5vQm9yZGVyIiwiRml4ZWRIZWlnaHQiLCJGaXhlZFdpZHRoIiwiY29udGFpbmVyU3RnIiwiY29udGVudFN0ZyIsIl9jb250YWluZXJTdHJhdGVneSIsIl9jb250ZW50U3RyYXRlZ3kiLCJzZXRDb250YWluZXJTdHJhdGVneSIsInNldENvbnRlbnRTdHJhdGVneSIsImdldCIsIlVOS05PV04iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFD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QUFDSCxDQUZEO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0FoRSxFQUFFLENBQUMwQyxnQkFBSCxDQUFvQkUsU0FBcEIsR0FBZ0MsQ0FBaEM7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTVDLEVBQUUsQ0FBQzBDLGdCQUFILENBQW9CTSxTQUFwQixHQUFnQyxDQUFoQztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBaEQsRUFBRSxDQUFDMEMsZ0JBQUgsQ0FBb0JJLFFBQXBCLEdBQStCLENBQS9CO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBOUMsRUFBRSxDQUFDMEMsZ0JBQUgsQ0FBb0JRLFlBQXBCLEdBQW1DLENBQW5DO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBbEQsRUFBRSxDQUFDMEMsZ0JBQUgsQ0FBb0JVLFdBQXBCLEdBQWtDLENBQWxDO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBcEQsRUFBRSxDQUFDMEMsZ0JBQUgsQ0FBb0JzUSxPQUFwQixHQUE4QixDQUE5QjtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQWhULEVBQUUsQ0FBQ3FFLElBQUgsR0FBVSxJQUFJNUQsSUFBSixFQUFWO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBVCxFQUFFLENBQUNpRSxPQUFILEdBQWFqRSxFQUFFLENBQUNpQixJQUFILEVBQWI7QUFFQWdTLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmxULEVBQUUsQ0FBQ3FFLElBQXBCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMDgtMjAxMCBSaWNhcmRvIFF1ZXNhZGFcbiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxMiBjb2NvczJkLXgub3JnXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBFdmVudFRhcmdldCA9IHJlcXVpcmUoJy4uL2V2ZW50L2V2ZW50LXRhcmdldCcpO1xuY29uc3QganMgPSByZXF1aXJlKCcuLi9wbGF0Zm9ybS9qcycpO1xuY29uc3QgcmVuZGVyZXIgPSByZXF1aXJlKCcuLi9yZW5kZXJlcicpO1xucmVxdWlyZSgnLi4vcGxhdGZvcm0vQ0NDbGFzcycpO1xuXG52YXIgX19Ccm93c2VyR2V0dGVyID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuaHRtbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaHRtbFwiKVswXTtcbiAgICB9LFxuICAgIGF2YWlsV2lkdGg6IGZ1bmN0aW9uKGZyYW1lKXtcbiAgICAgICAgaWYgKCFmcmFtZSB8fCBmcmFtZSA9PT0gdGhpcy5odG1sKVxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gZnJhbWUuY2xpZW50V2lkdGg7XG4gICAgfSxcbiAgICBhdmFpbEhlaWdodDogZnVuY3Rpb24oZnJhbWUpe1xuICAgICAgICBpZiAoIWZyYW1lIHx8IGZyYW1lID09PSB0aGlzLmh0bWwpXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gZnJhbWUuY2xpZW50SGVpZ2h0O1xuICAgIH0sXG4gICAgbWV0YToge1xuICAgICAgICBcIndpZHRoXCI6IFwiZGV2aWNlLXdpZHRoXCJcbiAgICB9LFxuICAgIGFkYXB0YXRpb25UeXBlOiBjYy5zeXMuYnJvd3NlclR5cGVcbn07XG5cbmlmIChjYy5zeXMub3MgPT09IGNjLnN5cy5PU19JT1MpIC8vIEFsbCBicm93c2VycyBhcmUgV2ViVmlld1xuICAgIF9fQnJvd3NlckdldHRlci5hZGFwdGF0aW9uVHlwZSA9IGNjLnN5cy5CUk9XU0VSX1RZUEVfU0FGQVJJO1xuXG5zd2l0Y2ggKF9fQnJvd3NlckdldHRlci5hZGFwdGF0aW9uVHlwZSkge1xuICAgIGNhc2UgY2Muc3lzLkJST1dTRVJfVFlQRV9TQUZBUkk6XG4gICAgY2FzZSBjYy5zeXMuQlJPV1NFUl9UWVBFX1NPVUdPVTpcbiAgICBjYXNlIGNjLnN5cy5CUk9XU0VSX1RZUEVfVUM6XG4gICAgICAgIF9fQnJvd3NlckdldHRlci5tZXRhW1wibWluaW1hbC11aVwiXSA9IFwidHJ1ZVwiO1xuICAgICAgICBfX0Jyb3dzZXJHZXR0ZXIuYXZhaWxXaWR0aCA9IGZ1bmN0aW9uKGZyYW1lKXtcbiAgICAgICAgICAgIHJldHVybiBmcmFtZS5jbGllbnRXaWR0aDtcbiAgICAgICAgfTtcbiAgICAgICAgX19Ccm93c2VyR2V0dGVyLmF2YWlsSGVpZ2h0ID0gZnVuY3Rpb24oZnJhbWUpe1xuICAgICAgICAgICAgcmV0dXJuIGZyYW1lLmNsaWVudEhlaWdodDtcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG59XG5cbnZhciBfc2Npc3NvclJlY3QgPSBudWxsO1xuXG4vKipcbiAqIGNjLnZpZXcgaXMgdGhlIHNpbmdsZXRvbiBvYmplY3Qgd2hpY2ggcmVwcmVzZW50cyB0aGUgZ2FtZSB3aW5kb3cuPGJyLz5cbiAqIEl0J3MgbWFpbiB0YXNrIGluY2x1ZGU6IDxici8+XG4gKiAgLSBBcHBseSB0aGUgZGVzaWduIHJlc29sdXRpb24gcG9saWN5PGJyLz5cbiAqICAtIFByb3ZpZGUgaW50ZXJhY3Rpb24gd2l0aCB0aGUgd2luZG93LCBsaWtlIHJlc2l6ZSBldmVudCBvbiB3ZWIsIHJldGluYSBkaXNwbGF5IHN1cHBvcnQsIGV0Yy4uLjxici8+XG4gKiAgLSBNYW5hZ2UgdGhlIGdhbWUgdmlldyBwb3J0IHdoaWNoIGNhbiBiZSBkaWZmZXJlbnQgd2l0aCB0aGUgd2luZG93PGJyLz5cbiAqICAtIE1hbmFnZSB0aGUgY29udGVudCBzY2FsZSBhbmQgdHJhbnNsYXRpb248YnIvPlxuICogPGJyLz5cbiAqIFNpbmNlIHRoZSBjYy52aWV3IGlzIGEgc2luZ2xldG9uLCB5b3UgZG9uJ3QgbmVlZCB0byBjYWxsIGFueSBjb25zdHJ1Y3RvciBvciBjcmVhdGUgZnVuY3Rpb25zLDxici8+XG4gKiB0aGUgc3RhbmRhcmQgd2F5IHRvIHVzZSBpdCBpcyBieSBjYWxsaW5nOjxici8+XG4gKiAgLSBjYy52aWV3Lm1ldGhvZE5hbWUoKTsgPGJyLz5cbiAqXG4gKiBAY2xhc3MgVmlld1xuICogQGV4dGVuZHMgRXZlbnRUYXJnZXRcbiAqL1xudmFyIFZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgRXZlbnRUYXJnZXQuY2FsbCh0aGlzKTtcblxuICAgIHZhciBfdCA9IHRoaXMsIF9zdHJhdGVneWVyID0gY2MuQ29udGFpbmVyU3RyYXRlZ3ksIF9zdHJhdGVneSA9IGNjLkNvbnRlbnRTdHJhdGVneTtcblxuICAgIF9fQnJvd3NlckdldHRlci5pbml0KHRoaXMpO1xuXG4gICAgLy8gU2l6ZSBvZiBwYXJlbnQgbm9kZSB0aGF0IGNvbnRhaW5zIGNjLmdhbWUuY29udGFpbmVyIGFuZCBjYy5nYW1lLmNhbnZhc1xuICAgIF90Ll9mcmFtZVNpemUgPSBjYy5zaXplKDAsIDApO1xuXG4gICAgLy8gcmVzb2x1dGlvbiBzaXplLCBpdCBpcyB0aGUgc2l6ZSBhcHByb3ByaWF0ZSBmb3IgdGhlIGFwcCByZXNvdXJjZXMuXG4gICAgX3QuX2Rlc2lnblJlc29sdXRpb25TaXplID0gY2Muc2l6ZSgwLCAwKTtcbiAgICBfdC5fb3JpZ2luYWxEZXNpZ25SZXNvbHV0aW9uU2l6ZSA9IGNjLnNpemUoMCwgMCk7XG4gICAgX3QuX3NjYWxlWCA9IDE7XG4gICAgX3QuX3NjYWxlWSA9IDE7XG4gICAgLy8gVmlld3BvcnQgaXMgdGhlIGNvbnRhaW5lcidzIHJlY3QgcmVsYXRlZCB0byBjb250ZW50J3MgY29vcmRpbmF0ZXMgaW4gcGl4ZWxcbiAgICBfdC5fdmlld3BvcnRSZWN0ID0gY2MucmVjdCgwLCAwLCAwLCAwKTtcbiAgICAvLyBUaGUgdmlzaWJsZSByZWN0IGluIGNvbnRlbnQncyBjb29yZGluYXRlIGluIHBvaW50XG4gICAgX3QuX3Zpc2libGVSZWN0ID0gY2MucmVjdCgwLCAwLCAwLCAwKTtcbiAgICAvLyBBdXRvIGZ1bGwgc2NyZWVuIGRpc2FibGVkIGJ5IGRlZmF1bHRcbiAgICBfdC5fYXV0b0Z1bGxTY3JlZW4gPSBmYWxzZTtcbiAgICAvLyBUaGUgZGV2aWNlJ3MgcGl4ZWwgcmF0aW8gKGZvciByZXRpbmEgZGlzcGxheXMpXG4gICAgX3QuX2RldmljZVBpeGVsUmF0aW8gPSAxO1xuICAgIGlmKENDX0pTQikge1xuICAgICAgICBfdC5fbWF4UGl4ZWxSYXRpbyA9IDQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgX3QuX21heFBpeGVsUmF0aW8gPSAyO1xuICAgIH1cbiAgICAvLyBSZXRpbmEgZGlzYWJsZWQgYnkgZGVmYXVsdFxuICAgIF90Ll9yZXRpbmFFbmFibGVkID0gZmFsc2U7XG4gICAgLy8gQ3VzdG9tIGNhbGxiYWNrIGZvciByZXNpemUgZXZlbnRcbiAgICBfdC5fcmVzaXplQ2FsbGJhY2sgPSBudWxsO1xuICAgIF90Ll9yZXNpemluZyA9IGZhbHNlO1xuICAgIF90Ll9yZXNpemVXaXRoQnJvd3NlclNpemUgPSBmYWxzZTtcbiAgICBfdC5fb3JpZW50YXRpb25DaGFuZ2luZyA9IHRydWU7XG4gICAgX3QuX2lzUm90YXRlZCA9IGZhbHNlO1xuICAgIF90Ll9vcmllbnRhdGlvbiA9IGNjLm1hY3JvLk9SSUVOVEFUSU9OX0FVVE87XG4gICAgX3QuX2lzQWRqdXN0Vmlld3BvcnQgPSB0cnVlO1xuICAgIF90Ll9hbnRpQWxpYXNFbmFibGVkID0gZmFsc2U7XG5cbiAgICAvLyBTZXR1cCBzeXN0ZW0gZGVmYXVsdCByZXNvbHV0aW9uIHBvbGljaWVzXG4gICAgX3QuX3Jlc29sdXRpb25Qb2xpY3kgPSBudWxsO1xuICAgIF90Ll9ycEV4YWN0Rml0ID0gbmV3IGNjLlJlc29sdXRpb25Qb2xpY3koX3N0cmF0ZWd5ZXIuRVFVQUxfVE9fRlJBTUUsIF9zdHJhdGVneS5FWEFDVF9GSVQpO1xuICAgIF90Ll9ycFNob3dBbGwgPSBuZXcgY2MuUmVzb2x1dGlvblBvbGljeShfc3RyYXRlZ3llci5FUVVBTF9UT19GUkFNRSwgX3N0cmF0ZWd5LlNIT1dfQUxMKTtcbiAgICBfdC5fcnBOb0JvcmRlciA9IG5ldyBjYy5SZXNvbHV0aW9uUG9saWN5KF9zdHJhdGVneWVyLkVRVUFMX1RPX0ZSQU1FLCBfc3RyYXRlZ3kuTk9fQk9SREVSKTtcbiAgICBfdC5fcnBGaXhlZEhlaWdodCA9IG5ldyBjYy5SZXNvbHV0aW9uUG9saWN5KF9zdHJhdGVneWVyLkVRVUFMX1RPX0ZSQU1FLCBfc3RyYXRlZ3kuRklYRURfSEVJR0hUKTtcbiAgICBfdC5fcnBGaXhlZFdpZHRoID0gbmV3IGNjLlJlc29sdXRpb25Qb2xpY3koX3N0cmF0ZWd5ZXIuRVFVQUxfVE9fRlJBTUUsIF9zdHJhdGVneS5GSVhFRF9XSURUSCk7XG5cbiAgICBjYy5nYW1lLm9uY2UoY2MuZ2FtZS5FVkVOVF9FTkdJTkVfSU5JVEVELCB0aGlzLmluaXQsIHRoaXMpO1xufTtcblxuY2MuanMuZXh0ZW5kKFZpZXcsIEV2ZW50VGFyZ2V0KTtcblxuY2MuanMubWl4aW4oVmlldy5wcm90b3R5cGUsIHtcbiAgICBpbml0ICgpIHtcbiAgICAgICAgdGhpcy5faW5pdEZyYW1lU2l6ZSgpO1xuXG4gICAgICAgIHZhciB3ID0gY2MuZ2FtZS5jYW52YXMud2lkdGgsIGggPSBjYy5nYW1lLmNhbnZhcy5oZWlnaHQ7XG4gICAgICAgIHRoaXMuX2Rlc2lnblJlc29sdXRpb25TaXplLndpZHRoID0gdztcbiAgICAgICAgdGhpcy5fZGVzaWduUmVzb2x1dGlvblNpemUuaGVpZ2h0ID0gaDtcbiAgICAgICAgdGhpcy5fb3JpZ2luYWxEZXNpZ25SZXNvbHV0aW9uU2l6ZS53aWR0aCA9IHc7XG4gICAgICAgIHRoaXMuX29yaWdpbmFsRGVzaWduUmVzb2x1dGlvblNpemUuaGVpZ2h0ID0gaDtcbiAgICAgICAgdGhpcy5fdmlld3BvcnRSZWN0LndpZHRoID0gdztcbiAgICAgICAgdGhpcy5fdmlld3BvcnRSZWN0LmhlaWdodCA9IGg7XG4gICAgICAgIHRoaXMuX3Zpc2libGVSZWN0LndpZHRoID0gdztcbiAgICAgICAgdGhpcy5fdmlzaWJsZVJlY3QuaGVpZ2h0ID0gaDtcblxuICAgICAgICBjYy53aW5TaXplLndpZHRoID0gdGhpcy5fdmlzaWJsZVJlY3Qud2lkdGg7XG4gICAgICAgIGNjLndpblNpemUuaGVpZ2h0ID0gdGhpcy5fdmlzaWJsZVJlY3QuaGVpZ2h0O1xuICAgICAgICBjYy52aXNpYmxlUmVjdCAmJiBjYy52aXNpYmxlUmVjdC5pbml0KHRoaXMuX3Zpc2libGVSZWN0KTtcbiAgICB9LFxuXG4gICAgLy8gUmVzaXplIGhlbHBlciBmdW5jdGlvbnNcbiAgICBfcmVzaXplRXZlbnQ6IGZ1bmN0aW9uIChmb3JjZU9yRXZlbnQpIHtcbiAgICAgICAgdmFyIHZpZXc7XG4gICAgICAgIGlmICh0aGlzLnNldERlc2lnblJlc29sdXRpb25TaXplKSB7XG4gICAgICAgICAgICB2aWV3ID0gdGhpcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZpZXcgPSBjYy52aWV3O1xuICAgICAgICB9XG4gICAgICAgIC8vIEhBQ0s6IHNvbWUgYnJvd3NlcnMgY2FuJ3QgdXBkYXRlIHdpbmRvdyBzaXplIGltbWVkaWF0ZWx5XG4gICAgICAgIC8vIG5lZWQgdG8gaGFuZGxlIHJlc2l6ZSBldmVudCBjYWxsYmFjayBvbiB0aGUgbmV4dCB0aWNrXG4gICAgICAgIGxldCBzeXMgPSBjYy5zeXM7XG4gICAgICAgIGlmIChzeXMuYnJvd3NlclR5cGUgPT09IHN5cy5CUk9XU0VSX1RZUEVfVUMgJiYgc3lzLm9zID09PSBzeXMuT1NfSU9TKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2aWV3Ll9yZXNpemVFdmVudChmb3JjZU9yRXZlbnQpO1xuICAgICAgICAgICAgfSwgMClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGZyYW1lIHNpemUgY2hhbmdlZCBvciBub3RcbiAgICAgICAgdmFyIHByZXZGcmFtZVcgPSB2aWV3Ll9mcmFtZVNpemUud2lkdGgsIHByZXZGcmFtZUggPSB2aWV3Ll9mcmFtZVNpemUuaGVpZ2h0LCBwcmV2Um90YXRlZCA9IHZpZXcuX2lzUm90YXRlZDtcbiAgICAgICAgaWYgKGNjLnN5cy5pc01vYmlsZSkge1xuICAgICAgICAgICAgdmFyIGNvbnRhaW5lclN0eWxlID0gY2MuZ2FtZS5jb250YWluZXIuc3R5bGUsXG4gICAgICAgICAgICAgICAgbWFyZ2luID0gY29udGFpbmVyU3R5bGUubWFyZ2luO1xuICAgICAgICAgICAgY29udGFpbmVyU3R5bGUubWFyZ2luID0gJzAnO1xuICAgICAgICAgICAgY29udGFpbmVyU3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIHZpZXcuX2luaXRGcmFtZVNpemUoKTtcbiAgICAgICAgICAgIGNvbnRhaW5lclN0eWxlLm1hcmdpbiA9IG1hcmdpbjtcbiAgICAgICAgICAgIGNvbnRhaW5lclN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmlldy5faW5pdEZyYW1lU2l6ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JjZU9yRXZlbnQgIT09IHRydWUgJiYgdmlldy5faXNSb3RhdGVkID09PSBwcmV2Um90YXRlZCAmJiB2aWV3Ll9mcmFtZVNpemUud2lkdGggPT09IHByZXZGcmFtZVcgJiYgdmlldy5fZnJhbWVTaXplLmhlaWdodCA9PT0gcHJldkZyYW1lSClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAvLyBGcmFtZSBzaXplIGNoYW5nZWQsIGRvIHJlc2l6ZSB3b3Jrc1xuICAgICAgICB2YXIgd2lkdGggPSB2aWV3Ll9vcmlnaW5hbERlc2lnblJlc29sdXRpb25TaXplLndpZHRoO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gdmlldy5fb3JpZ2luYWxEZXNpZ25SZXNvbHV0aW9uU2l6ZS5oZWlnaHQ7XG4gICAgICAgIHZpZXcuX3Jlc2l6aW5nID0gdHJ1ZTtcbiAgICAgICAgaWYgKHdpZHRoID4gMClcbiAgICAgICAgICAgIHZpZXcuc2V0RGVzaWduUmVzb2x1dGlvblNpemUod2lkdGgsIGhlaWdodCwgdmlldy5fcmVzb2x1dGlvblBvbGljeSk7XG4gICAgICAgIHZpZXcuX3Jlc2l6aW5nID0gZmFsc2U7XG5cbiAgICAgICAgdmlldy5lbWl0KCdjYW52YXMtcmVzaXplJyk7XG4gICAgICAgIGlmICh2aWV3Ll9yZXNpemVDYWxsYmFjaykge1xuICAgICAgICAgICAgdmlldy5fcmVzaXplQ2FsbGJhY2suY2FsbCgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9vcmllbnRhdGlvbkNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy52aWV3Ll9vcmllbnRhdGlvbkNoYW5naW5nID0gdHJ1ZTtcbiAgICAgICAgY2Mudmlldy5fcmVzaXplRXZlbnQoKTtcbiAgICAgICAgLy8gSEFDSzogc2hvdyBuYXYgYmFyIG9uIGlPUyBzYWZhcmlcbiAgICAgICAgLy8gc2FmYXJpIHdpbGwgZW50ZXIgZnVsbHNjcmVlbiB3aGVuIHJvdGF0ZSB0byBsYW5kc2NhcGVcbiAgICAgICAgLy8gbmVlZCB0byBleGl0IGZ1bGxzY3JlZW4gd2hlbiByb3RhdGUgYmFjayB0byBwb3J0cmFpdCwgc2Nyb2xsVG8oMCwgMSkgd29ya3MuXG4gICAgICAgIGlmIChjYy5zeXMuYnJvd3NlclR5cGUgPT09IGNjLnN5cy5CUk9XU0VSX1RZUEVfU0FGQVJJICYmIGNjLnN5cy5pc01vYmlsZSkge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5pbm5lckhlaWdodCA+IHdpbmRvdy5pbm5lcldpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9yZXNpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvL2ZvcmNlIHJlc2l6ZSB3aGVuIHNpemUgaXMgY2hhbmdlZCBhdCBuYXRpdmVcbiAgICAgICAgY2Mudmlldy5fcmVzaXplRXZlbnQoQ0NfSlNCKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldHMgdmlldydzIHRhcmdldC1kZW5zaXR5ZHBpIGZvciBhbmRyb2lkIG1vYmlsZSBicm93c2VyLiBpdCBjYW4gYmUgc2V0IHRvOiAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgIDEuIGNjLm1hY3JvLkRFTlNJVFlEUElfREVWSUNFLCB2YWx1ZSBpcyBcImRldmljZS1kcGlcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgIDIuIGNjLm1hY3JvLkRFTlNJVFlEUElfSElHSCwgdmFsdWUgaXMgXCJoaWdoLWRwaVwiICAoZGVmYXVsdCB2YWx1ZSkgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgIDMuIGNjLm1hY3JvLkRFTlNJVFlEUElfTUVESVVNLCB2YWx1ZSBpcyBcIm1lZGl1bS1kcGlcIiAoYnJvd3NlcidzIGRlZmF1bHQgdmFsdWUpICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgIDQuIGNjLm1hY3JvLkRFTlNJVFlEUElfTE9XLCB2YWx1ZSBpcyBcImxvdy1kcGlcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgIDUuIEN1c3RvbSB2YWx1ZSwgZS5nOiBcIjQ4MFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAhI3poIOiuvue9ruebruagh+WGheWuueeahOavj+iLseWvuOWDj+e0oOeCueWvhuW6puOAglxuICAgICAqXG4gICAgICogQG1ldGhvZCBzZXRUYXJnZXREZW5zaXR5RFBJXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGRlbnNpdHlEUElcbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyB0aGUgY3VycmVudCB0YXJnZXQtZGVuc2l0eWRwaSB2YWx1ZSBvZiBjYy52aWV3LlxuICAgICAqICEjemgg6I635Y+W55uu5qCH5YaF5a6555qE5q+P6Iux5a+45YOP57Sg54K55a+G5bqm44CCXG4gICAgICogQG1ldGhvZCBnZXRUYXJnZXREZW5zaXR5RFBJXG4gICAgICogQHJldHVybnMge1N0cmluZ31cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0cyB3aGV0aGVyIHJlc2l6ZSBjYW52YXMgYXV0b21hdGljYWxseSB3aGVuIGJyb3dzZXIncyBzaXplIGNoYW5nZWQuPGJyLz5cbiAgICAgKiBVc2VmdWwgb25seSBvbiB3ZWIuXG4gICAgICogISN6aCDorr7nva7lvZPlj5HnjrDmtY/op4jlmajnmoTlsLrlr7jmlLnlj5jml7bvvIzmmK/lkKboh6rliqjosIPmlbQgY2FudmFzIOWwuuWvuOWkp+Wwj+OAglxuICAgICAqIOS7heWcqCBXZWIg5qih5byP5LiL5pyJ5pWI44CCXG4gICAgICogQG1ldGhvZCByZXNpemVXaXRoQnJvd3NlclNpemVcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGVuYWJsZWQgLSBXaGV0aGVyIGVuYWJsZSBhdXRvbWF0aWMgcmVzaXplIHdpdGggYnJvd3NlcidzIHJlc2l6ZSBldmVudFxuICAgICAqL1xuICAgIHJlc2l6ZVdpdGhCcm93c2VyU2l6ZTogZnVuY3Rpb24gKGVuYWJsZWQpIHtcbiAgICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgICAgIC8vZW5hYmxlXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3Jlc2l6ZVdpdGhCcm93c2VyU2l6ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZVdpdGhCcm93c2VyU2l6ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZSk7XG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgdGhpcy5fb3JpZW50YXRpb25DaGFuZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9kaXNhYmxlXG4gICAgICAgICAgICBpZiAodGhpcy5fcmVzaXplV2l0aEJyb3dzZXJTaXplKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplV2l0aEJyb3dzZXJTaXplID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZSk7XG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgdGhpcy5fb3JpZW50YXRpb25DaGFuZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTZXRzIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBmb3IgY2MudmlldydzIHJlc2l6ZSBhY3Rpb24sPGJyLz5cbiAgICAgKiB0aGlzIGNhbGxiYWNrIHdpbGwgYmUgaW52b2tlZCBiZWZvcmUgYXBwbHlpbmcgcmVzb2x1dGlvbiBwb2xpY3ksIDxici8+XG4gICAgICogc28geW91IGNhbiBkbyBhbnkgYWRkaXRpb25hbCBtb2RpZmljYXRpb25zIHdpdGhpbiB0aGUgY2FsbGJhY2suPGJyLz5cbiAgICAgKiBVc2VmdWwgb25seSBvbiB3ZWIuXG4gICAgICogISN6aCDorr7nva4gY2MudmlldyDosIPmlbTop4bnqpflsLrlr7jooYzkuLrnmoTlm57osIPlh73mlbDvvIxcbiAgICAgKiDov5nkuKrlm57osIPlh73mlbDkvJrlnKjlupTnlKjpgILphY3mqKHlvI/kuYvliY3ooqvosIPnlKjvvIxcbiAgICAgKiDlm6DmraTkvaDlj6/ku6XlnKjov5nkuKrlm57osIPlh73mlbDlhoXmt7vliqDku7vmhI/pmYTliqDmlLnlj5jvvIxcbiAgICAgKiDku4XlnKggV2ViIOW5s+WPsOS4i+acieaViOOAglxuICAgICAqIEBtZXRob2Qgc2V0UmVzaXplQ2FsbGJhY2tcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE51bGx9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICovXG4gICAgc2V0UmVzaXplQ2FsbGJhY2s6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICBpZiAoQ0NfRURJVE9SKSByZXR1cm47XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicgfHwgY2FsbGJhY2sgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fcmVzaXplQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0cyB0aGUgb3JpZW50YXRpb24gb2YgdGhlIGdhbWUsIGl0IGNhbiBiZSBsYW5kc2NhcGUsIHBvcnRyYWl0IG9yIGF1dG8uXG4gICAgICogV2hlbiBzZXQgaXQgdG8gbGFuZHNjYXBlIG9yIHBvcnRyYWl0LCBhbmQgc2NyZWVuIHcvaCByYXRpbyBkb2Vzbid0IGZpdCwgXG4gICAgICogY2MudmlldyB3aWxsIGF1dG9tYXRpY2FsbHkgcm90YXRlIHRoZSBnYW1lIGNhbnZhcyB1c2luZyBDU1MuXG4gICAgICogTm90ZSB0aGF0IHRoaXMgZnVuY3Rpb24gZG9lc24ndCBoYXZlIGFueSBlZmZlY3QgaW4gbmF0aXZlLCBcbiAgICAgKiBpbiBuYXRpdmUsIHlvdSBuZWVkIHRvIHNldCB0aGUgYXBwbGljYXRpb24gb3JpZW50YXRpb24gaW4gbmF0aXZlIHByb2plY3Qgc2V0dGluZ3NcbiAgICAgKiAhI3poIOiuvue9rua4uOaIj+Wxj+W5leacneWQke+8jOWug+iDveWkn+aYr+aoqueJiO+8jOerlueJiOaIluiHquWKqOOAglxuICAgICAqIOW9k+iuvue9ruS4uuaoqueJiOaIluerlueJiO+8jOW5tuS4lOWxj+W5leeahOWuvemrmOavlOS+i+S4jeWMuemFjeaXtu+8jFxuICAgICAqIGNjLnZpZXcg5Lya6Ieq5Yqo55SoIENTUyDml4vovazmuLjmiI/lnLrmma/nmoQgY2FudmFz77yMXG4gICAgICog6L+Z5Liq5pa55rOV5LiN5Lya5a+5IG5hdGl2ZSDpg6jliIbkuqfnlJ/ku7vkvZXlvbHlk43vvIzlr7nkuo4gbmF0aXZlIOiAjOiogO+8jOS9oOmcgOimgeWcqOW6lOeUqOiuvue9ruS4reeahOiuvue9ruaOkueJiOOAglxuICAgICAqIEBtZXRob2Qgc2V0T3JpZW50YXRpb25cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb3JpZW50YXRpb24gLSBQb3NzaWJsZSB2YWx1ZXM6IGNjLm1hY3JvLk9SSUVOVEFUSU9OX0xBTkRTQ0FQRSB8IGNjLm1hY3JvLk9SSUVOVEFUSU9OX1BPUlRSQUlUIHwgY2MubWFjcm8uT1JJRU5UQVRJT05fQVVUT1xuICAgICAqL1xuICAgIHNldE9yaWVudGF0aW9uOiBmdW5jdGlvbiAob3JpZW50YXRpb24pIHtcbiAgICAgICAgb3JpZW50YXRpb24gPSBvcmllbnRhdGlvbiAmIGNjLm1hY3JvLk9SSUVOVEFUSU9OX0FVVE87XG4gICAgICAgIGlmIChvcmllbnRhdGlvbiAmJiB0aGlzLl9vcmllbnRhdGlvbiAhPT0gb3JpZW50YXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX29yaWVudGF0aW9uID0gb3JpZW50YXRpb247XG4gICAgICAgICAgICB2YXIgZGVzaWduV2lkdGggPSB0aGlzLl9vcmlnaW5hbERlc2lnblJlc29sdXRpb25TaXplLndpZHRoO1xuICAgICAgICAgICAgdmFyIGRlc2lnbkhlaWdodCA9IHRoaXMuX29yaWdpbmFsRGVzaWduUmVzb2x1dGlvblNpemUuaGVpZ2h0O1xuICAgICAgICAgICAgdGhpcy5zZXREZXNpZ25SZXNvbHV0aW9uU2l6ZShkZXNpZ25XaWR0aCwgZGVzaWduSGVpZ2h0LCB0aGlzLl9yZXNvbHV0aW9uUG9saWN5KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfaW5pdEZyYW1lU2l6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbG9jRnJhbWVTaXplID0gdGhpcy5fZnJhbWVTaXplO1xuICAgICAgICB2YXIgdyA9IF9fQnJvd3NlckdldHRlci5hdmFpbFdpZHRoKGNjLmdhbWUuZnJhbWUpO1xuICAgICAgICB2YXIgaCA9IF9fQnJvd3NlckdldHRlci5hdmFpbEhlaWdodChjYy5nYW1lLmZyYW1lKTtcbiAgICAgICAgdmFyIGlzTGFuZHNjYXBlID0gdyA+PSBoO1xuXG4gICAgICAgIGlmIChDQ19FRElUT1IgfHwgIWNjLnN5cy5pc01vYmlsZSB8fFxuICAgICAgICAgICAgKGlzTGFuZHNjYXBlICYmIHRoaXMuX29yaWVudGF0aW9uICYgY2MubWFjcm8uT1JJRU5UQVRJT05fTEFORFNDQVBFKSB8fCBcbiAgICAgICAgICAgICghaXNMYW5kc2NhcGUgJiYgdGhpcy5fb3JpZW50YXRpb24gJiBjYy5tYWNyby5PUklFTlRBVElPTl9QT1JUUkFJVCkpIHtcbiAgICAgICAgICAgIGxvY0ZyYW1lU2l6ZS53aWR0aCA9IHc7XG4gICAgICAgICAgICBsb2NGcmFtZVNpemUuaGVpZ2h0ID0gaDtcbiAgICAgICAgICAgIGNjLmdhbWUuY29udGFpbmVyLnN0eWxlWyctd2Via2l0LXRyYW5zZm9ybSddID0gJ3JvdGF0ZSgwZGVnKSc7XG4gICAgICAgICAgICBjYy5nYW1lLmNvbnRhaW5lci5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKDBkZWcpJztcbiAgICAgICAgICAgIHRoaXMuX2lzUm90YXRlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbG9jRnJhbWVTaXplLndpZHRoID0gaDtcbiAgICAgICAgICAgIGxvY0ZyYW1lU2l6ZS5oZWlnaHQgPSB3O1xuICAgICAgICAgICAgY2MuZ2FtZS5jb250YWluZXIuc3R5bGVbJy13ZWJraXQtdHJhbnNmb3JtJ10gPSAncm90YXRlKDkwZGVnKSc7XG4gICAgICAgICAgICBjYy5nYW1lLmNvbnRhaW5lci5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKDkwZGVnKSc7XG4gICAgICAgICAgICBjYy5nYW1lLmNvbnRhaW5lci5zdHlsZVsnLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luJ10gPSAnMHB4IDBweCAwcHgnO1xuICAgICAgICAgICAgY2MuZ2FtZS5jb250YWluZXIuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gJzBweCAwcHggMHB4JztcbiAgICAgICAgICAgIHRoaXMuX2lzUm90YXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX29yaWVudGF0aW9uQ2hhbmdpbmcpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNjLnZpZXcuX29yaWVudGF0aW9uQ2hhbmdpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9zZXRWaWV3cG9ydE1ldGE6IGZ1bmN0aW9uIChtZXRhcywgb3ZlcndyaXRlKSB7XG4gICAgICAgIHZhciB2cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29jb3NNZXRhRWxlbWVudFwiKTtcbiAgICAgICAgaWYodnAgJiYgb3ZlcndyaXRlKXtcbiAgICAgICAgICAgIGRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQodnApO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGVsZW1zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoXCJ2aWV3cG9ydFwiKSxcbiAgICAgICAgICAgIGN1cnJlbnRWUCA9IGVsZW1zID8gZWxlbXNbMF0gOiBudWxsLFxuICAgICAgICAgICAgY29udGVudCwga2V5LCBwYXR0ZXJuO1xuXG4gICAgICAgIGNvbnRlbnQgPSBjdXJyZW50VlAgPyBjdXJyZW50VlAuY29udGVudCA6IFwiXCI7XG4gICAgICAgIHZwID0gdnAgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm1ldGFcIik7XG4gICAgICAgIHZwLmlkID0gXCJjb2Nvc01ldGFFbGVtZW50XCI7XG4gICAgICAgIHZwLm5hbWUgPSBcInZpZXdwb3J0XCI7XG4gICAgICAgIHZwLmNvbnRlbnQgPSBcIlwiO1xuXG4gICAgICAgIGZvciAoa2V5IGluIG1ldGFzKSB7XG4gICAgICAgICAgICBpZiAoY29udGVudC5pbmRleE9mKGtleSkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBjb250ZW50ICs9IFwiLFwiICsga2V5ICsgXCI9XCIgKyBtZXRhc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAob3ZlcndyaXRlKSB7XG4gICAgICAgICAgICAgICAgcGF0dGVybiA9IG5ldyBSZWdFeHAoa2V5K1wiXFxzKj1cXHMqW14sXStcIik7XG4gICAgICAgICAgICAgICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZShwYXR0ZXJuLCBrZXkgKyBcIj1cIiArIG1ldGFzW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmKC9eLC8udGVzdChjb250ZW50KSlcbiAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnN1YnN0cigxKTtcblxuICAgICAgICB2cC5jb250ZW50ID0gY29udGVudDtcbiAgICAgICAgLy8gRm9yIGFkb3B0aW5nIGNlcnRhaW4gYW5kcm9pZCBkZXZpY2VzIHdoaWNoIGRvbid0IHN1cHBvcnQgc2Vjb25kIHZpZXdwb3J0XG4gICAgICAgIGlmIChjdXJyZW50VlApXG4gICAgICAgICAgICBjdXJyZW50VlAuY29udGVudCA9IGNvbnRlbnQ7XG5cbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZCh2cCk7XG4gICAgfSxcblxuICAgIF9hZGp1c3RWaWV3cG9ydE1ldGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzQWRqdXN0Vmlld3BvcnQgJiYgIUNDX0pTQiAmJiAhQ0NfUlVOVElNRSkge1xuICAgICAgICAgICAgdGhpcy5fc2V0Vmlld3BvcnRNZXRhKF9fQnJvd3NlckdldHRlci5tZXRhLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLl9pc0FkanVzdFZpZXdwb3J0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldHMgd2hldGhlciB0aGUgZW5naW5lIG1vZGlmeSB0aGUgXCJ2aWV3cG9ydFwiIG1ldGEgaW4geW91ciB3ZWIgcGFnZS48YnIvPlxuICAgICAqIEl0J3MgZW5hYmxlZCBieSBkZWZhdWx0LCB3ZSBzdHJvbmdseSBzdWdnZXN0IHlvdSBub3QgdG8gZGlzYWJsZSBpdC48YnIvPlxuICAgICAqIEFuZCBldmVuIHdoZW4gaXQncyBlbmFibGVkLCB5b3UgY2FuIHN0aWxsIHNldCB5b3VyIG93biBcInZpZXdwb3J0XCIgbWV0YSwgaXQgd29uJ3QgYmUgb3ZlcnJpZGRlbjxici8+XG4gICAgICogT25seSB1c2VmdWwgb24gd2ViXG4gICAgICogISN6aCDorr7nva7lvJXmk47mmK/lkKbosIPmlbQgdmlld3BvcnQgbWV0YSDmnaXphY3lkIjlsY/luZXpgILphY3jgIJcbiAgICAgKiDpu5jorqTorr7nva7kuLrlkK/liqjvvIzmiJHku6zlvLrng4jlu7rorq7kvaDkuI3opoHlsIblroPorr7nva7kuLrlhbPpl63jgIJcbiAgICAgKiDljbPkvb/lvZPlroPlkK/liqjml7bvvIzkvaDku43nhLbog73lpJ/orr7nva7kvaDnmoQgdmlld3BvcnQgbWV0Ye+8jOWug+S4jeS8muiiq+imhuebluOAglxuICAgICAqIOS7heWcqCBXZWIg5qih5byP5LiL5pyJ5pWIXG4gICAgICogQG1ldGhvZCBhZGp1c3RWaWV3cG9ydE1ldGFcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGVuYWJsZWQgLSBFbmFibGUgYXV0b21hdGljIG1vZGlmaWNhdGlvbiB0byBcInZpZXdwb3J0XCIgbWV0YVxuICAgICAqL1xuICAgIGFkanVzdFZpZXdwb3J0TWV0YTogZnVuY3Rpb24gKGVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5faXNBZGp1c3RWaWV3cG9ydCA9IGVuYWJsZWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXRpbmEgc3VwcG9ydCBpcyBlbmFibGVkIGJ5IGRlZmF1bHQgZm9yIEFwcGxlIGRldmljZSBidXQgZGlzYWJsZWQgZm9yIG90aGVyIGRldmljZXMsPGJyLz5cbiAgICAgKiBpdCB0YWtlcyBlZmZlY3Qgb25seSB3aGVuIHlvdSBjYWxsZWQgc2V0RGVzaWduUmVzb2x1dGlvblBvbGljeTxici8+XG4gICAgICogT25seSB1c2VmdWwgb24gd2ViXG4gICAgICogISN6aCDlr7nkuo4gQXBwbGUg6L+Z56eN5pSv5oyBIFJldGluYSDmmL7npLrnmoTorr7lpIfkuIrpu5jorqTov5vooYzkvJjljJbogIzlhbbku5bnsbvlnovorr7lpIfpu5jorqTkuI3ov5vooYzkvJjljJbvvIxcbiAgICAgKiDlroPku4XkvJrlnKjkvaDosIPnlKggc2V0RGVzaWduUmVzb2x1dGlvblBvbGljeSDmlrnms5Xml7bmnInlvbHlk43jgIJcbiAgICAgKiDku4XlnKggV2ViIOaooeW8j+S4i+acieaViOOAglxuICAgICAqIEBtZXRob2QgZW5hYmxlUmV0aW5hXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBlbmFibGVkIC0gRW5hYmxlIG9yIGRpc2FibGUgcmV0aW5hIGRpc3BsYXlcbiAgICAgKi9cbiAgICBlbmFibGVSZXRpbmE6IGZ1bmN0aW9uKGVuYWJsZWQpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUiAmJiBlbmFibGVkKSB7XG4gICAgICAgICAgICBjYy53YXJuKCdDYW4gbm90IGVuYWJsZSByZXRpbmEgaW4gRWRpdG9yLicpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3JldGluYUVuYWJsZWQgPSAhIWVuYWJsZWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDaGVjayB3aGV0aGVyIHJldGluYSBkaXNwbGF5IGlzIGVuYWJsZWQuPGJyLz5cbiAgICAgKiBPbmx5IHVzZWZ1bCBvbiB3ZWJcbiAgICAgKiAhI3poIOajgOafpeaYr+WQpuWvuSBSZXRpbmEg5pi+56S66K6+5aSH6L+b6KGM5LyY5YyW44CCXG4gICAgICog5LuF5ZyoIFdlYiDmqKHlvI/kuIvmnInmlYjjgIJcbiAgICAgKiBAbWV0aG9kIGlzUmV0aW5hRW5hYmxlZFxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaXNSZXRpbmFFbmFibGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXRpbmFFbmFibGVkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFdoZXRoZXIgdG8gRW5hYmxlIG9uIGFudGktYWxpYXNcbiAgICAgKiAhI3poIOaOp+WItuaKl+mUr+m9v+aYr+WQpuW8gOWQr1xuICAgICAqIEBtZXRob2QgZW5hYmxlQW50aUFsaWFzXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBlbmFibGVkIC0gRW5hYmxlIG9yIG5vdCBhbnRpLWFsaWFzXG4gICAgICogQGRlcHJlY2F0ZWQgY2Mudmlldy5lbmFibGVBbnRpQWxpYXMgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSBjYy5UZXh0dXJlMkQuc2V0RmlsdGVycyBpbnN0ZWFkXG4gICAgICogQHNpbmNlIHYyLjMuMFxuICAgICAqL1xuICAgIGVuYWJsZUFudGlBbGlhczogZnVuY3Rpb24gKGVuYWJsZWQpIHtcbiAgICAgICAgY2Mud2FybklEKDkyMDApO1xuICAgICAgICBpZiAodGhpcy5fYW50aUFsaWFzRW5hYmxlZCA9PT0gZW5hYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2FudGlBbGlhc0VuYWJsZWQgPSBlbmFibGVkO1xuICAgICAgICBpZihjYy5nYW1lLnJlbmRlclR5cGUgPT09IGNjLmdhbWUuUkVOREVSX1RZUEVfV0VCR0wpIHtcbiAgICAgICAgICAgIHZhciBjYWNoZSA9IGNjLmFzc2V0TWFuYWdlci5hc3NldHM7XG4gICAgICAgICAgICBjYWNoZS5mb3JFYWNoKGZ1bmN0aW9uIChhc3NldCkge1xuICAgICAgICAgICAgICAgIGlmIChhc3NldCBpbnN0YW5jZW9mIGNjLlRleHR1cmUyRCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgRmlsdGVyID0gY2MuVGV4dHVyZTJELkZpbHRlcjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0LnNldEZpbHRlcnMoRmlsdGVyLkxJTkVBUiwgRmlsdGVyLkxJTkVBUik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhc3NldC5zZXRGaWx0ZXJzKEZpbHRlci5ORUFSRVNULCBGaWx0ZXIuTkVBUkVTVCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGNjLmdhbWUucmVuZGVyVHlwZSA9PT0gY2MuZ2FtZS5SRU5ERVJfVFlQRV9DQU5WQVMpIHtcbiAgICAgICAgICAgIHZhciBjdHggPSBjYy5nYW1lLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAgICAgY3R4LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgICAgICAgICBjdHgubW96SW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZW5hYmxlZDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgd2hldGhlciB0aGUgY3VycmVudCBlbmFibGUgb24gYW50aS1hbGlhc1xuICAgICAqICEjemgg6L+U5Zue5b2T5YmN5piv5ZCm5oqX6ZSv6b2/XG4gICAgICogQG1ldGhvZCBpc0FudGlBbGlhc0VuYWJsZWRcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGlzQW50aUFsaWFzRW5hYmxlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYW50aUFsaWFzRW5hYmxlZDtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBJZiBlbmFibGVkLCB0aGUgYXBwbGljYXRpb24gd2lsbCB0cnkgYXV0b21hdGljYWxseSB0byBlbnRlciBmdWxsIHNjcmVlbiBtb2RlIG9uIG1vYmlsZSBkZXZpY2VzPGJyLz5cbiAgICAgKiBZb3UgY2FuIHBhc3MgdHJ1ZSBhcyBwYXJhbWV0ZXIgdG8gZW5hYmxlIGl0IGFuZCBkaXNhYmxlIGl0IGJ5IHBhc3NpbmcgZmFsc2UuPGJyLz5cbiAgICAgKiBPbmx5IHVzZWZ1bCBvbiB3ZWJcbiAgICAgKiAhI3poIOWQr+WKqOaXtu+8jOenu+WKqOerr+a4uOaIj+S8muWcqOenu+WKqOerr+iHquWKqOWwneivlei/m+WFpeWFqOWxj+aooeW8j+OAglxuICAgICAqIOS9oOiDveWkn+S8oOWFpSB0cnVlIOS4uuWPguaVsOWOu+WQr+WKqOWug++8jOeUqCBmYWxzZSDlj4LmlbDmnaXlhbPpl63lroPjgIJcbiAgICAgKiBAbWV0aG9kIGVuYWJsZUF1dG9GdWxsU2NyZWVuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBlbmFibGVkIC0gRW5hYmxlIG9yIGRpc2FibGUgYXV0byBmdWxsIHNjcmVlbiBvbiBtb2JpbGUgZGV2aWNlc1xuICAgICAqL1xuICAgIGVuYWJsZUF1dG9GdWxsU2NyZWVuOiBmdW5jdGlvbihlbmFibGVkKSB7XG4gICAgICAgIGlmIChlbmFibGVkICYmIFxuICAgICAgICAgICAgZW5hYmxlZCAhPT0gdGhpcy5fYXV0b0Z1bGxTY3JlZW4gJiYgXG4gICAgICAgICAgICBjYy5zeXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgIC8vIEF1dG9tYXRpY2FsbHkgZnVsbCBzY3JlZW4gd2hlbiB1c2VyIHRvdWNoZXMgb24gbW9iaWxlIHZlcnNpb25cbiAgICAgICAgICAgIHRoaXMuX2F1dG9GdWxsU2NyZWVuID0gdHJ1ZTtcbiAgICAgICAgICAgIGNjLnNjcmVlbi5hdXRvRnVsbFNjcmVlbihjYy5nYW1lLmZyYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2F1dG9GdWxsU2NyZWVuID0gZmFsc2U7XG4gICAgICAgICAgICBjYy5zY3JlZW4uZGlzYWJsZUF1dG9GdWxsU2NyZWVuKGNjLmdhbWUuZnJhbWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDaGVjayB3aGV0aGVyIGF1dG8gZnVsbCBzY3JlZW4gaXMgZW5hYmxlZC48YnIvPlxuICAgICAqIE9ubHkgdXNlZnVsIG9uIHdlYlxuICAgICAqICEjemgg5qOA5p+l6Ieq5Yqo6L+b5YWl5YWo5bGP5qih5byP5piv5ZCm5ZCv5Yqo44CCXG4gICAgICog5LuF5ZyoIFdlYiDmqKHlvI/kuIvmnInmlYjjgIJcbiAgICAgKiBAbWV0aG9kIGlzQXV0b0Z1bGxTY3JlZW5FbmFibGVkXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gQXV0byBmdWxsIHNjcmVlbiBlbmFibGVkIG9yIG5vdFxuICAgICAqL1xuICAgIGlzQXV0b0Z1bGxTY3JlZW5FbmFibGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F1dG9GdWxsU2NyZWVuO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIE5vdCBzdXBwb3J0IG9uIG5hdGl2ZS48YnIvPlxuICAgICAqIE9uIHdlYiwgaXQgc2V0cyB0aGUgc2l6ZSBvZiB0aGUgY2FudmFzLlxuICAgICAqICEjemgg6L+Z5Liq5pa55rOV5bm25LiN5pSv5oyBIG5hdGl2ZSDlubPlj7DvvIzlnKggV2ViIOW5s+WPsOS4i++8jOWPr+S7peeUqOadpeiuvue9riBjYW52YXMg5bC65a+444CCXG4gICAgICogQG1ldGhvZCBzZXRDYW52YXNTaXplXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodFxuICAgICAqL1xuICAgIHNldENhbnZhc1NpemU6IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHZhciBjYW52YXMgPSBjYy5nYW1lLmNhbnZhcztcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IGNjLmdhbWUuY29udGFpbmVyO1xuXG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoICogdGhpcy5fZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodCAqIHRoaXMuX2RldmljZVBpeGVsUmF0aW87XG5cbiAgICAgICAgY2FudmFzLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcblxuICAgICAgICBjb250YWluZXIuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG4gICAgICAgIGNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuXG4gICAgICAgIHRoaXMuX3Jlc2l6ZUV2ZW50KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIHRoZSBjYW52YXMgc2l6ZSBvZiB0aGUgdmlldy48YnIvPlxuICAgICAqIE9uIG5hdGl2ZSBwbGF0Zm9ybXMsIGl0IHJldHVybnMgdGhlIHNjcmVlbiBzaXplIHNpbmNlIHRoZSB2aWV3IGlzIGEgZnVsbHNjcmVlbiB2aWV3Ljxici8+XG4gICAgICogT24gd2ViLCBpdCByZXR1cm5zIHRoZSBzaXplIG9mIHRoZSBjYW52YXMgZWxlbWVudC5cbiAgICAgKiAhI3poIOi/lOWbnuinhuWbvuS4rSBjYW52YXMg55qE5bC65a+444CCXG4gICAgICog5ZyoIG5hdGl2ZSDlubPlj7DkuIvvvIzlroPov5Tlm57lhajlsY/op4blm77kuIvlsY/luZXnmoTlsLrlr7jjgIJcbiAgICAgKiDlnKggV2ViIOW5s+WPsOS4i++8jOWug+i/lOWbniBjYW52YXMg5YWD57Sg5bC65a+444CCXG4gICAgICogQG1ldGhvZCBnZXRDYW52YXNTaXplXG4gICAgICogQHJldHVybiB7U2l6ZX1cbiAgICAgKi9cbiAgICBnZXRDYW52YXNTaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjYy5zaXplKGNjLmdhbWUuY2FudmFzLndpZHRoLCBjYy5nYW1lLmNhbnZhcy5oZWlnaHQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyB0aGUgZnJhbWUgc2l6ZSBvZiB0aGUgdmlldy48YnIvPlxuICAgICAqIE9uIG5hdGl2ZSBwbGF0Zm9ybXMsIGl0IHJldHVybnMgdGhlIHNjcmVlbiBzaXplIHNpbmNlIHRoZSB2aWV3IGlzIGEgZnVsbHNjcmVlbiB2aWV3Ljxici8+XG4gICAgICogT24gd2ViLCBpdCByZXR1cm5zIHRoZSBzaXplIG9mIHRoZSBjYW52YXMncyBvdXRlciBET00gZWxlbWVudC5cbiAgICAgKiAhI3poIOi/lOWbnuinhuWbvuS4rei+ueahhuWwuuWvuOOAglxuICAgICAqIOWcqCBuYXRpdmUg5bmz5Y+w5LiL77yM5a6D6L+U5Zue5YWo5bGP6KeG5Zu+5LiL5bGP5bmV55qE5bC65a+444CCXG4gICAgICog5ZyoIHdlYiDlubPlj7DkuIvvvIzlroPov5Tlm54gY2FudmFzIOWFg+e0oOeahOWkluWxgiBET00g5YWD57Sg5bC65a+444CCXG4gICAgICogQG1ldGhvZCBnZXRGcmFtZVNpemVcbiAgICAgKiBAcmV0dXJuIHtTaXplfVxuICAgICAqL1xuICAgIGdldEZyYW1lU2l6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2Muc2l6ZSh0aGlzLl9mcmFtZVNpemUud2lkdGgsIHRoaXMuX2ZyYW1lU2l6ZS5oZWlnaHQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogT24gbmF0aXZlLCBpdCBzZXRzIHRoZSBmcmFtZSBzaXplIG9mIHZpZXcuPGJyLz5cbiAgICAgKiBPbiB3ZWIsIGl0IHNldHMgdGhlIHNpemUgb2YgdGhlIGNhbnZhcydzIG91dGVyIERPTSBlbGVtZW50LlxuICAgICAqICEjemgg5ZyoIG5hdGl2ZSDlubPlj7DkuIvvvIzorr7nva7op4blm77moYbmnrblsLrlr7jjgIJcbiAgICAgKiDlnKggd2ViIOW5s+WPsOS4i++8jOiuvue9riBjYW52YXMg5aSW5bGCIERPTSDlhYPntKDlsLrlr7jjgIJcbiAgICAgKiBAbWV0aG9kIHNldEZyYW1lU2l6ZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiAgICAgKi9cbiAgICBzZXRGcmFtZVNpemU6IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuX2ZyYW1lU2l6ZS53aWR0aCA9IHdpZHRoO1xuICAgICAgICB0aGlzLl9mcmFtZVNpemUuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICBjYy5nYW1lLmZyYW1lLnN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCI7XG4gICAgICAgIGNjLmdhbWUuZnJhbWUuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICB0aGlzLl9yZXNpemVFdmVudCh0cnVlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgdGhlIHZpc2libGUgYXJlYSBzaXplIG9mIHRoZSB2aWV3IHBvcnQuXG4gICAgICogISN6aCDov5Tlm57op4blm77nqpflj6Plj6/op4HljLrln5/lsLrlr7jjgIJcbiAgICAgKiBAbWV0aG9kIGdldFZpc2libGVTaXplXG4gICAgICogQHJldHVybiB7U2l6ZX1cbiAgICAgKi9cbiAgICBnZXRWaXNpYmxlU2l6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2Muc2l6ZSh0aGlzLl92aXNpYmxlUmVjdC53aWR0aCx0aGlzLl92aXNpYmxlUmVjdC5oZWlnaHQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyB0aGUgdmlzaWJsZSBhcmVhIHNpemUgb2YgdGhlIHZpZXcgcG9ydC5cbiAgICAgKiAhI3poIOi/lOWbnuinhuWbvueql+WPo+WPr+ingeWMuuWfn+WDj+e0oOWwuuWvuOOAglxuICAgICAqIEBtZXRob2QgZ2V0VmlzaWJsZVNpemVJblBpeGVsXG4gICAgICogQHJldHVybiB7U2l6ZX1cbiAgICAgKi9cbiAgICBnZXRWaXNpYmxlU2l6ZUluUGl4ZWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNjLnNpemUoIHRoaXMuX3Zpc2libGVSZWN0LndpZHRoICogdGhpcy5fc2NhbGVYLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlzaWJsZVJlY3QuaGVpZ2h0ICogdGhpcy5fc2NhbGVZICk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIHRoZSB2aXNpYmxlIG9yaWdpbiBvZiB0aGUgdmlldyBwb3J0LlxuICAgICAqICEjemgg6L+U5Zue6KeG5Zu+56qX5Y+j5Y+v6KeB5Yy65Z+f5Y6f54K544CCXG4gICAgICogQG1ldGhvZCBnZXRWaXNpYmxlT3JpZ2luXG4gICAgICogQHJldHVybiB7VmVjMn1cbiAgICAgKi9cbiAgICBnZXRWaXNpYmxlT3JpZ2luOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjYy52Mih0aGlzLl92aXNpYmxlUmVjdC54LHRoaXMuX3Zpc2libGVSZWN0LnkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyB0aGUgdmlzaWJsZSBvcmlnaW4gb2YgdGhlIHZpZXcgcG9ydC5cbiAgICAgKiAhI3poIOi/lOWbnuinhuWbvueql+WPo+WPr+ingeWMuuWfn+WDj+e0oOWOn+eCueOAglxuICAgICAqIEBtZXRob2QgZ2V0VmlzaWJsZU9yaWdpbkluUGl4ZWxcbiAgICAgKiBAcmV0dXJuIHtWZWMyfVxuICAgICAqL1xuICAgIGdldFZpc2libGVPcmlnaW5JblBpeGVsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjYy52Mih0aGlzLl92aXNpYmxlUmVjdC54ICogdGhpcy5fc2NhbGVYLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl92aXNpYmxlUmVjdC55ICogdGhpcy5fc2NhbGVZKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgdGhlIGN1cnJlbnQgcmVzb2x1dGlvbiBwb2xpY3lcbiAgICAgKiAhI3poIOi/lOWbnuW9k+WJjeWIhui+qOeOh+aWueahiFxuICAgICAqIEBzZWUgY2MuUmVzb2x1dGlvblBvbGljeVxuICAgICAqIEBtZXRob2QgZ2V0UmVzb2x1dGlvblBvbGljeVxuICAgICAqIEByZXR1cm4ge1Jlc29sdXRpb25Qb2xpY3l9XG4gICAgICovXG4gICAgZ2V0UmVzb2x1dGlvblBvbGljeTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzb2x1dGlvblBvbGljeTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldHMgdGhlIGN1cnJlbnQgcmVzb2x1dGlvbiBwb2xpY3lcbiAgICAgKiAhI3poIOiuvue9ruW9k+WJjeWIhui+qOeOh+aooeW8j1xuICAgICAqIEBzZWUgY2MuUmVzb2x1dGlvblBvbGljeVxuICAgICAqIEBtZXRob2Qgc2V0UmVzb2x1dGlvblBvbGljeVxuICAgICAqIEBwYXJhbSB7UmVzb2x1dGlvblBvbGljeXxOdW1iZXJ9IHJlc29sdXRpb25Qb2xpY3lcbiAgICAgKi9cbiAgICBzZXRSZXNvbHV0aW9uUG9saWN5OiBmdW5jdGlvbiAocmVzb2x1dGlvblBvbGljeSkge1xuICAgICAgICB2YXIgX3QgPSB0aGlzO1xuICAgICAgICBpZiAocmVzb2x1dGlvblBvbGljeSBpbnN0YW5jZW9mIGNjLlJlc29sdXRpb25Qb2xpY3kpIHtcbiAgICAgICAgICAgIF90Ll9yZXNvbHV0aW9uUG9saWN5ID0gcmVzb2x1dGlvblBvbGljeTtcbiAgICAgICAgfVxuICAgICAgICAvLyBFbnN1cmUgY29tcGF0aWJpbGl0eSB3aXRoIEpTQlxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBfbG9jUG9saWN5ID0gY2MuUmVzb2x1dGlvblBvbGljeTtcbiAgICAgICAgICAgIGlmKHJlc29sdXRpb25Qb2xpY3kgPT09IF9sb2NQb2xpY3kuRVhBQ1RfRklUKVxuICAgICAgICAgICAgICAgIF90Ll9yZXNvbHV0aW9uUG9saWN5ID0gX3QuX3JwRXhhY3RGaXQ7XG4gICAgICAgICAgICBpZihyZXNvbHV0aW9uUG9saWN5ID09PSBfbG9jUG9saWN5LlNIT1dfQUxMKVxuICAgICAgICAgICAgICAgIF90Ll9yZXNvbHV0aW9uUG9saWN5ID0gX3QuX3JwU2hvd0FsbDtcbiAgICAgICAgICAgIGlmKHJlc29sdXRpb25Qb2xpY3kgPT09IF9sb2NQb2xpY3kuTk9fQk9SREVSKVxuICAgICAgICAgICAgICAgIF90Ll9yZXNvbHV0aW9uUG9saWN5ID0gX3QuX3JwTm9Cb3JkZXI7XG4gICAgICAgICAgICBpZihyZXNvbHV0aW9uUG9saWN5ID09PSBfbG9jUG9saWN5LkZJWEVEX0hFSUdIVClcbiAgICAgICAgICAgICAgICBfdC5fcmVzb2x1dGlvblBvbGljeSA9IF90Ll9ycEZpeGVkSGVpZ2h0O1xuICAgICAgICAgICAgaWYocmVzb2x1dGlvblBvbGljeSA9PT0gX2xvY1BvbGljeS5GSVhFRF9XSURUSClcbiAgICAgICAgICAgICAgICBfdC5fcmVzb2x1dGlvblBvbGljeSA9IF90Ll9ycEZpeGVkV2lkdGg7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldHMgdGhlIHJlc29sdXRpb24gcG9saWN5IHdpdGggZGVzaWduZWQgdmlldyBzaXplIGluIHBvaW50cy48YnIvPlxuICAgICAqIFRoZSByZXNvbHV0aW9uIHBvbGljeSBpbmNsdWRlOiA8YnIvPlxuICAgICAqIFsxXSBSZXNvbHV0aW9uRXhhY3RGaXQgICAgICAgRmlsbCBzY3JlZW4gYnkgc3RyZXRjaC10by1maXQ6IGlmIHRoZSBkZXNpZ24gcmVzb2x1dGlvbiByYXRpbyBvZiB3aWR0aCB0byBoZWlnaHQgaXMgZGlmZmVyZW50IGZyb20gdGhlIHNjcmVlbiByZXNvbHV0aW9uIHJhdGlvLCB5b3VyIGdhbWUgdmlldyB3aWxsIGJlIHN0cmV0Y2hlZC48YnIvPlxuICAgICAqIFsyXSBSZXNvbHV0aW9uTm9Cb3JkZXIgICAgICAgRnVsbCBzY3JlZW4gd2l0aG91dCBibGFjayBib3JkZXI6IGlmIHRoZSBkZXNpZ24gcmVzb2x1dGlvbiByYXRpbyBvZiB3aWR0aCB0byBoZWlnaHQgaXMgZGlmZmVyZW50IGZyb20gdGhlIHNjcmVlbiByZXNvbHV0aW9uIHJhdGlvLCB0d28gYXJlYXMgb2YgeW91ciBnYW1lIHZpZXcgd2lsbCBiZSBjdXQuPGJyLz5cbiAgICAgKiBbM10gUmVzb2x1dGlvblNob3dBbGwgICAgICAgIEZ1bGwgc2NyZWVuIHdpdGggYmxhY2sgYm9yZGVyOiBpZiB0aGUgZGVzaWduIHJlc29sdXRpb24gcmF0aW8gb2Ygd2lkdGggdG8gaGVpZ2h0IGlzIGRpZmZlcmVudCBmcm9tIHRoZSBzY3JlZW4gcmVzb2x1dGlvbiByYXRpbywgdHdvIGJsYWNrIGJvcmRlcnMgd2lsbCBiZSBzaG93bi48YnIvPlxuICAgICAqIFs0XSBSZXNvbHV0aW9uRml4ZWRIZWlnaHQgICAgU2NhbGUgdGhlIGNvbnRlbnQncyBoZWlnaHQgdG8gc2NyZWVuJ3MgaGVpZ2h0IGFuZCBwcm9wb3J0aW9uYWxseSBzY2FsZSBpdHMgd2lkdGg8YnIvPlxuICAgICAqIFs1XSBSZXNvbHV0aW9uRml4ZWRXaWR0aCAgICAgU2NhbGUgdGhlIGNvbnRlbnQncyB3aWR0aCB0byBzY3JlZW4ncyB3aWR0aCBhbmQgcHJvcG9ydGlvbmFsbHkgc2NhbGUgaXRzIGhlaWdodDxici8+XG4gICAgICogW2NjLlJlc29sdXRpb25Qb2xpY3ldICAgICAgICBbV2ViIG9ubHkgZmVhdHVyZV0gQ3VzdG9tIHJlc29sdXRpb24gcG9saWN5LCBjb25zdHJ1Y3RlZCBieSBjYy5SZXNvbHV0aW9uUG9saWN5PGJyLz5cbiAgICAgKiAhI3poIOmAmui/h+iuvue9ruiuvuiuoeWIhui+qOeOh+WSjOWMuemFjeaooeW8j+adpei/m+ihjOa4uOaIj+eUu+mdoueahOWxj+W5lemAgumFjeOAglxuICAgICAqIEBtZXRob2Qgc2V0RGVzaWduUmVzb2x1dGlvblNpemVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gd2lkdGggRGVzaWduIHJlc29sdXRpb24gd2lkdGguXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodCBEZXNpZ24gcmVzb2x1dGlvbiBoZWlnaHQuXG4gICAgICogQHBhcmFtIHtSZXNvbHV0aW9uUG9saWN5fE51bWJlcn0gcmVzb2x1dGlvblBvbGljeSBUaGUgcmVzb2x1dGlvbiBwb2xpY3kgZGVzaXJlZFxuICAgICAqL1xuICAgIHNldERlc2lnblJlc29sdXRpb25TaXplOiBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgcmVzb2x1dGlvblBvbGljeSkge1xuICAgICAgICAvLyBEZWZlbnNpdmUgY29kZVxuICAgICAgICBpZiggISh3aWR0aCA+IDAgJiYgaGVpZ2h0ID4gMCkgKXtcbiAgICAgICAgICAgIGNjLmVycm9ySUQoMjIwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFJlc29sdXRpb25Qb2xpY3kocmVzb2x1dGlvblBvbGljeSk7XG4gICAgICAgIHZhciBwb2xpY3kgPSB0aGlzLl9yZXNvbHV0aW9uUG9saWN5O1xuICAgICAgICBpZiAocG9saWN5KSB7XG4gICAgICAgICAgICBwb2xpY3kucHJlQXBwbHkodGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZWluaXQgZnJhbWUgc2l6ZVxuICAgICAgICBpZiAoY2Muc3lzLmlzTW9iaWxlKVxuICAgICAgICAgICAgdGhpcy5fYWRqdXN0Vmlld3BvcnRNZXRhKCk7XG5cbiAgICAgICAgLy8gUGVybWl0IHRvIHJlLWRldGVjdCB0aGUgb3JpZW50YXRpb24gb2YgZGV2aWNlLlxuICAgICAgICB0aGlzLl9vcmllbnRhdGlvbkNoYW5naW5nID0gdHJ1ZTtcbiAgICAgICAgLy8gSWYgcmVzaXppbmcsIHRoZW4gZnJhbWUgc2l6ZSBpcyBhbHJlYWR5IGluaXRpYWxpemVkLCB0aGlzIGxvZ2ljIHNob3VsZCBiZSBpbXByb3ZlZFxuICAgICAgICBpZiAoIXRoaXMuX3Jlc2l6aW5nKVxuICAgICAgICAgICAgdGhpcy5faW5pdEZyYW1lU2l6ZSgpO1xuXG4gICAgICAgIGlmICghcG9saWN5KSB7XG4gICAgICAgICAgICBjYy5sb2dJRCgyMjAxKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX29yaWdpbmFsRGVzaWduUmVzb2x1dGlvblNpemUud2lkdGggPSB0aGlzLl9kZXNpZ25SZXNvbHV0aW9uU2l6ZS53aWR0aCA9IHdpZHRoO1xuICAgICAgICB0aGlzLl9vcmlnaW5hbERlc2lnblJlc29sdXRpb25TaXplLmhlaWdodCA9IHRoaXMuX2Rlc2lnblJlc29sdXRpb25TaXplLmhlaWdodCA9IGhlaWdodDtcblxuICAgICAgICB2YXIgcmVzdWx0ID0gcG9saWN5LmFwcGx5KHRoaXMsIHRoaXMuX2Rlc2lnblJlc29sdXRpb25TaXplKTtcblxuICAgICAgICBpZihyZXN1bHQuc2NhbGUgJiYgcmVzdWx0LnNjYWxlLmxlbmd0aCA9PT0gMil7XG4gICAgICAgICAgICB0aGlzLl9zY2FsZVggPSByZXN1bHQuc2NhbGVbMF07XG4gICAgICAgICAgICB0aGlzLl9zY2FsZVkgPSByZXN1bHQuc2NhbGVbMV07XG4gICAgICAgIH1cblxuICAgICAgICBpZihyZXN1bHQudmlld3BvcnQpe1xuICAgICAgICAgICAgdmFyIHZwID0gdGhpcy5fdmlld3BvcnRSZWN0LFxuICAgICAgICAgICAgICAgIHZiID0gdGhpcy5fdmlzaWJsZVJlY3QsXG4gICAgICAgICAgICAgICAgcnYgPSByZXN1bHQudmlld3BvcnQ7XG5cbiAgICAgICAgICAgIHZwLnggPSBydi54O1xuICAgICAgICAgICAgdnAueSA9IHJ2Lnk7XG4gICAgICAgICAgICB2cC53aWR0aCA9IHJ2LndpZHRoO1xuICAgICAgICAgICAgdnAuaGVpZ2h0ID0gcnYuaGVpZ2h0O1xuXG4gICAgICAgICAgICB2Yi54ID0gMDtcbiAgICAgICAgICAgIHZiLnkgPSAwO1xuICAgICAgICAgICAgdmIud2lkdGggPSBydi53aWR0aCAvIHRoaXMuX3NjYWxlWDtcbiAgICAgICAgICAgIHZiLmhlaWdodCA9IHJ2LmhlaWdodCAvIHRoaXMuX3NjYWxlWTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBvbGljeS5wb3N0QXBwbHkodGhpcyk7XG4gICAgICAgIGNjLndpblNpemUud2lkdGggPSB0aGlzLl92aXNpYmxlUmVjdC53aWR0aDtcbiAgICAgICAgY2Mud2luU2l6ZS5oZWlnaHQgPSB0aGlzLl92aXNpYmxlUmVjdC5oZWlnaHQ7XG5cbiAgICAgICAgY2MudmlzaWJsZVJlY3QgJiYgY2MudmlzaWJsZVJlY3QuaW5pdCh0aGlzLl92aXNpYmxlUmVjdCk7XG5cbiAgICAgICAgcmVuZGVyZXIudXBkYXRlQ2FtZXJhVmlld3BvcnQoKTtcbiAgICAgICAgY2MuaW50ZXJuYWwuaW5wdXRNYW5hZ2VyLl91cGRhdGVDYW52YXNCb3VuZGluZ1JlY3QoKTtcbiAgICAgICAgdGhpcy5lbWl0KCdkZXNpZ24tcmVzb2x1dGlvbi1jaGFuZ2VkJyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIHRoZSBkZXNpZ25lZCBzaXplIGZvciB0aGUgdmlldy5cbiAgICAgKiBEZWZhdWx0IHJlc29sdXRpb24gc2l6ZSBpcyB0aGUgc2FtZSBhcyAnZ2V0RnJhbWVTaXplJy5cbiAgICAgKiAhI3poIOi/lOWbnuinhuWbvueahOiuvuiuoeWIhui+qOeOh+OAglxuICAgICAqIOm7mOiupOS4i+WIhui+qOeOh+WwuuWvuOWQjCBgZ2V0RnJhbWVTaXplYCDmlrnms5Xnm7jlkIxcbiAgICAgKiBAbWV0aG9kIGdldERlc2lnblJlc29sdXRpb25TaXplXG4gICAgICogQHJldHVybiB7U2l6ZX1cbiAgICAgKi9cbiAgICBnZXREZXNpZ25SZXNvbHV0aW9uU2l6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2Muc2l6ZSh0aGlzLl9kZXNpZ25SZXNvbHV0aW9uU2l6ZS53aWR0aCwgdGhpcy5fZGVzaWduUmVzb2x1dGlvblNpemUuaGVpZ2h0KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldHMgdGhlIGNvbnRhaW5lciB0byBkZXNpcmVkIHBpeGVsIHJlc29sdXRpb24gYW5kIGZpdCB0aGUgZ2FtZSBjb250ZW50IHRvIGl0LlxuICAgICAqIFRoaXMgZnVuY3Rpb24gaXMgdmVyeSB1c2VmdWwgZm9yIGFkYXB0YXRpb24gaW4gbW9iaWxlIGJyb3dzZXJzLlxuICAgICAqIEluIHNvbWUgSEQgYW5kcm9pZCBkZXZpY2VzLCB0aGUgcmVzb2x1dGlvbiBpcyB2ZXJ5IGhpZ2gsIGJ1dCBpdHMgYnJvd3NlciBwZXJmb3JtYW5jZSBtYXkgbm90IGJlIHZlcnkgZ29vZC5cbiAgICAgKiBJbiB0aGlzIGNhc2UsIGVuYWJsaW5nIHJldGluYSBkaXNwbGF5IGlzIHZlcnkgY29zdHkgYW5kIG5vdCBzdWdnZXN0ZWQsIGFuZCBpZiByZXRpbmEgaXMgZGlzYWJsZWQsIHRoZSBpbWFnZSBtYXkgYmUgYmx1cnJ5LlxuICAgICAqIEJ1dCB0aGlzIEFQSSBjYW4gYmUgaGVscGZ1bCB0byBzZXQgYSBkZXNpcmVkIHBpeGVsIHJlc29sdXRpb24gd2hpY2ggaXMgaW4gYmV0d2Vlbi5cbiAgICAgKiBUaGlzIEFQSSB3aWxsIGRvIHRoZSBmb2xsb3dpbmc6XG4gICAgICogICAgIDEuIFNldCB2aWV3cG9ydCdzIHdpZHRoIHRvIHRoZSBkZXNpcmVkIHdpZHRoIGluIHBpeGVsXG4gICAgICogICAgIDIuIFNldCBib2R5IHdpZHRoIHRvIHRoZSBleGFjdCBwaXhlbCByZXNvbHV0aW9uXG4gICAgICogICAgIDMuIFRoZSByZXNvbHV0aW9uIHBvbGljeSB3aWxsIGJlIHJlc2V0IHdpdGggZGVzaWduZWQgdmlldyBzaXplIGluIHBvaW50cy5cbiAgICAgKiAhI3poIOiuvue9ruWuueWZqO+8iGNvbnRhaW5lcu+8iemcgOimgeeahOWDj+e0oOWIhui+qOeOh+W5tuS4lOmAgumFjeebuOW6lOWIhui+qOeOh+eahOa4uOaIj+WGheWuueOAglxuICAgICAqIEBtZXRob2Qgc2V0UmVhbFBpeGVsUmVzb2x1dGlvblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aCBEZXNpZ24gcmVzb2x1dGlvbiB3aWR0aC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0IERlc2lnbiByZXNvbHV0aW9uIGhlaWdodC5cbiAgICAgKiBAcGFyYW0ge1Jlc29sdXRpb25Qb2xpY3l8TnVtYmVyfSByZXNvbHV0aW9uUG9saWN5IFRoZSByZXNvbHV0aW9uIHBvbGljeSBkZXNpcmVkXG4gICAgICovXG4gICAgc2V0UmVhbFBpeGVsUmVzb2x1dGlvbjogZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIHJlc29sdXRpb25Qb2xpY3kpIHtcbiAgICAgICAgaWYgKCFDQ19KU0IgJiYgIUNDX1JVTlRJTUUpIHtcbiAgICAgICAgICAgIC8vIFNldCB2aWV3cG9ydCdzIHdpZHRoXG4gICAgICAgICAgICB0aGlzLl9zZXRWaWV3cG9ydE1ldGEoe1wid2lkdGhcIjogd2lkdGh9LCB0cnVlKTtcblxuICAgICAgICAgICAgLy8gU2V0IGJvZHkgd2lkdGggdG8gdGhlIGV4YWN0IHBpeGVsIHJlc29sdXRpb25cbiAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS53aWR0aCA9IHdpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS53aWR0aCA9IHdpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gXCIwcHhcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlc2V0IHRoZSByZXNvbHV0aW9uIHNpemUgYW5kIHBvbGljeVxuICAgICAgICB0aGlzLnNldERlc2lnblJlc29sdXRpb25TaXplKHdpZHRoLCBoZWlnaHQsIHJlc29sdXRpb25Qb2xpY3kpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0cyB2aWV3IHBvcnQgcmVjdGFuZ2xlIHdpdGggcG9pbnRzLlxuICAgICAqICEjemgg55So6K6+6K6h5YiG6L6o546H5LiL55qE54K55bC65a+45p2l6K6+572u6KeG56qX44CCXG4gICAgICogQG1ldGhvZCBzZXRWaWV3cG9ydEluUG9pbnRzXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdyB3aWR0aFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoIGhlaWdodFxuICAgICAqL1xuICAgIHNldFZpZXdwb3J0SW5Qb2ludHM6IGZ1bmN0aW9uICh4LCB5LCB3LCBoKSB7XG4gICAgICAgIHZhciBsb2NTY2FsZVggPSB0aGlzLl9zY2FsZVgsIGxvY1NjYWxlWSA9IHRoaXMuX3NjYWxlWTtcbiAgICAgICAgY2MuZ2FtZS5fcmVuZGVyQ29udGV4dC52aWV3cG9ydCgoeCAqIGxvY1NjYWxlWCArIHRoaXMuX3ZpZXdwb3J0UmVjdC54KSxcbiAgICAgICAgICAgICh5ICogbG9jU2NhbGVZICsgdGhpcy5fdmlld3BvcnRSZWN0LnkpLFxuICAgICAgICAgICAgKHcgKiBsb2NTY2FsZVgpLFxuICAgICAgICAgICAgKGggKiBsb2NTY2FsZVkpKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldHMgU2Npc3NvciByZWN0YW5nbGUgd2l0aCBwb2ludHMuXG4gICAgICogISN6aCDnlKjorr7orqHliIbovqjnjofkuIvnmoTngrnnmoTlsLrlr7jmnaXorr7nva4gc2Npc3NvciDliaroo4HljLrln5/jgIJcbiAgICAgKiBAbWV0aG9kIHNldFNjaXNzb3JJblBvaW50c1xuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHdcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaFxuICAgICAqL1xuICAgIHNldFNjaXNzb3JJblBvaW50czogZnVuY3Rpb24gKHgsIHksIHcsIGgpIHtcbiAgICAgICAgbGV0IHNjYWxlWCA9IHRoaXMuX3NjYWxlWCwgc2NhbGVZID0gdGhpcy5fc2NhbGVZO1xuICAgICAgICBsZXQgc3ggPSBNYXRoLmNlaWwoeCAqIHNjYWxlWCArIHRoaXMuX3ZpZXdwb3J0UmVjdC54KTtcbiAgICAgICAgbGV0IHN5ID0gTWF0aC5jZWlsKHkgKiBzY2FsZVkgKyB0aGlzLl92aWV3cG9ydFJlY3QueSk7XG4gICAgICAgIGxldCBzdyA9IE1hdGguY2VpbCh3ICogc2NhbGVYKTtcbiAgICAgICAgbGV0IHNoID0gTWF0aC5jZWlsKGggKiBzY2FsZVkpO1xuICAgICAgICBsZXQgZ2wgPSBjYy5nYW1lLl9yZW5kZXJDb250ZXh0O1xuXG4gICAgICAgIGlmICghX3NjaXNzb3JSZWN0KSB7XG4gICAgICAgICAgICB2YXIgYm94QXJyID0gZ2wuZ2V0UGFyYW1ldGVyKGdsLlNDSVNTT1JfQk9YKTtcbiAgICAgICAgICAgIF9zY2lzc29yUmVjdCA9IGNjLnJlY3QoYm94QXJyWzBdLCBib3hBcnJbMV0sIGJveEFyclsyXSwgYm94QXJyWzNdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfc2Npc3NvclJlY3QueCAhPT0gc3ggfHwgX3NjaXNzb3JSZWN0LnkgIT09IHN5IHx8IF9zY2lzc29yUmVjdC53aWR0aCAhPT0gc3cgfHwgX3NjaXNzb3JSZWN0LmhlaWdodCAhPT0gc2gpIHtcbiAgICAgICAgICAgIF9zY2lzc29yUmVjdC54ID0gc3g7XG4gICAgICAgICAgICBfc2Npc3NvclJlY3QueSA9IHN5O1xuICAgICAgICAgICAgX3NjaXNzb3JSZWN0LndpZHRoID0gc3c7XG4gICAgICAgICAgICBfc2Npc3NvclJlY3QuaGVpZ2h0ID0gc2g7XG4gICAgICAgICAgICBnbC5zY2lzc29yKHN4LCBzeSwgc3csIHNoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyB3aGV0aGVyIEdMX1NDSVNTT1JfVEVTVCBpcyBlbmFibGVcbiAgICAgKiAhI3poIOajgOafpSBzY2lzc29yIOaYr+WQpueUn+aViOOAglxuICAgICAqIEBtZXRob2QgaXNTY2lzc29yRW5hYmxlZFxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGlzU2Npc3NvckVuYWJsZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNjLmdhbWUuX3JlbmRlckNvbnRleHQuaXNFbmFibGVkKGdsLlNDSVNTT1JfVEVTVCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IHNjaXNzb3IgcmVjdGFuZ2xlXG4gICAgICogISN6aCDov5Tlm57lvZPliY3nmoQgc2Npc3NvciDliaroo4HljLrln5/jgIJcbiAgICAgKiBAbWV0aG9kIGdldFNjaXNzb3JSZWN0XG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICAgICAqIEByZXR1cm4ge1JlY3R9XG4gICAgICovXG4gICAgZ2V0U2Npc3NvclJlY3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFfc2Npc3NvclJlY3QpIHtcbiAgICAgICAgICAgIHZhciBib3hBcnIgPSBnbC5nZXRQYXJhbWV0ZXIoZ2wuU0NJU1NPUl9CT1gpO1xuICAgICAgICAgICAgX3NjaXNzb3JSZWN0ID0gY2MucmVjdChib3hBcnJbMF0sIGJveEFyclsxXSwgYm94QXJyWzJdLCBib3hBcnJbM10pO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzY2FsZVhGYWN0b3IgPSAxIC8gdGhpcy5fc2NhbGVYO1xuICAgICAgICB2YXIgc2NhbGVZRmFjdG9yID0gMSAvIHRoaXMuX3NjYWxlWTtcbiAgICAgICAgcmV0dXJuIGNjLnJlY3QoXG4gICAgICAgICAgICAoX3NjaXNzb3JSZWN0LnggLSB0aGlzLl92aWV3cG9ydFJlY3QueCkgKiBzY2FsZVhGYWN0b3IsXG4gICAgICAgICAgICAoX3NjaXNzb3JSZWN0LnkgLSB0aGlzLl92aWV3cG9ydFJlY3QueSkgKiBzY2FsZVlGYWN0b3IsXG4gICAgICAgICAgICBfc2Npc3NvclJlY3Qud2lkdGggKiBzY2FsZVhGYWN0b3IsXG4gICAgICAgICAgICBfc2Npc3NvclJlY3QuaGVpZ2h0ICogc2NhbGVZRmFjdG9yXG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIHRoZSB2aWV3IHBvcnQgcmVjdGFuZ2xlLlxuICAgICAqICEjemgg6L+U5Zue6KeG56qX5Ymq6KOB5Yy65Z+f44CCXG4gICAgICogQG1ldGhvZCBnZXRWaWV3cG9ydFJlY3RcbiAgICAgKiBAcmV0dXJuIHtSZWN0fVxuICAgICAqL1xuICAgIGdldFZpZXdwb3J0UmVjdDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmlld3BvcnRSZWN0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyBzY2FsZSBmYWN0b3Igb2YgdGhlIGhvcml6b250YWwgZGlyZWN0aW9uIChYIGF4aXMpLlxuICAgICAqICEjemgg6L+U5Zue5qiq6L2055qE57yp5pS+5q+U77yM6L+Z5Liq57yp5pS+5q+U5piv5bCG55S75biD5YOP57Sg5YiG6L6o546H5pS+5Yiw6K6+6K6h5YiG6L6o546H55qE5q+U5L6L44CCXG4gICAgICogQG1ldGhvZCBnZXRTY2FsZVhcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0U2NhbGVYOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zY2FsZVg7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIHNjYWxlIGZhY3RvciBvZiB0aGUgdmVydGljYWwgZGlyZWN0aW9uIChZIGF4aXMpLlxuICAgICAqICEjemgg6L+U5Zue57q16L2055qE57yp5pS+5q+U77yM6L+Z5Liq57yp5pS+5q+U5piv5bCG55S75biD5YOP57Sg5YiG6L6o546H57yp5pS+5Yiw6K6+6K6h5YiG6L6o546H55qE5q+U5L6L44CCXG4gICAgICogQG1ldGhvZCBnZXRTY2FsZVlcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0U2NhbGVZOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zY2FsZVk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIGRldmljZSBwaXhlbCByYXRpbyBmb3IgcmV0aW5hIGRpc3BsYXkuXG4gICAgICogISN6aCDov5Tlm57orr7lpIfmiJbmtY/op4jlmajlg4/ntKDmr5TkvovjgIJcbiAgICAgKiBAbWV0aG9kIGdldERldmljZVBpeGVsUmF0aW9cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0RGV2aWNlUGl4ZWxSYXRpbzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZXZpY2VQaXhlbFJhdGlvO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyB0aGUgcmVhbCBsb2NhdGlvbiBpbiB2aWV3IGZvciBhIHRyYW5zbGF0aW9uIGJhc2VkIG9uIGEgcmVsYXRlZCBwb3NpdGlvblxuICAgICAqICEjemgg5bCG5bGP5bmV5Z2Q5qCH6L2s5o2i5Li65ri45oiP6KeG5Zu+5LiL55qE5Z2Q5qCH44CCXG4gICAgICogQG1ldGhvZCBjb252ZXJ0VG9Mb2NhdGlvbkluVmlld1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0eCAtIFRoZSBYIGF4aXMgdHJhbnNsYXRpb25cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdHkgLSBUaGUgWSBheGlzIHRyYW5zbGF0aW9uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlbGF0ZWRQb3MgLSBUaGUgcmVsYXRlZCBwb3NpdGlvbiBvYmplY3QgaW5jbHVkaW5nIFwibGVmdFwiLCBcInRvcFwiLCBcIndpZHRoXCIsIFwiaGVpZ2h0XCIgaW5mb3JtYXRpb25zXG4gICAgICogQHJldHVybiB7VmVjMn1cbiAgICAgKi9cbiAgICBjb252ZXJ0VG9Mb2NhdGlvbkluVmlldzogZnVuY3Rpb24gKHR4LCB0eSwgcmVsYXRlZFBvcywgb3V0KSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBvdXQgfHwgY2MudjIoKTtcbiAgICAgICAgbGV0IHBvc0xlZnQgPSByZWxhdGVkUG9zLmFkanVzdGVkTGVmdCA/IHJlbGF0ZWRQb3MuYWRqdXN0ZWRMZWZ0IDogcmVsYXRlZFBvcy5sZWZ0O1xuICAgICAgICBsZXQgcG9zVG9wID0gcmVsYXRlZFBvcy5hZGp1c3RlZFRvcCA/IHJlbGF0ZWRQb3MuYWRqdXN0ZWRUb3AgOiByZWxhdGVkUG9zLnRvcDtcbiAgICAgICAgbGV0IHggPSB0aGlzLl9kZXZpY2VQaXhlbFJhdGlvICogKHR4IC0gcG9zTGVmdCk7XG4gICAgICAgIGxldCB5ID0gdGhpcy5fZGV2aWNlUGl4ZWxSYXRpbyAqIChwb3NUb3AgKyByZWxhdGVkUG9zLmhlaWdodCAtIHR5KTtcbiAgICAgICAgaWYgKHRoaXMuX2lzUm90YXRlZCkge1xuICAgICAgICAgICAgcmVzdWx0LnggPSBjYy5nYW1lLmNhbnZhcy53aWR0aCAtIHk7XG4gICAgICAgICAgICByZXN1bHQueSA9IHg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQueCA9IHg7XG4gICAgICAgICAgICByZXN1bHQueSA9IHk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgX2NvbnZlcnRNb3VzZVRvTG9jYXRpb25JblZpZXc6IGZ1bmN0aW9uIChpbl9vdXRfcG9pbnQsIHJlbGF0ZWRQb3MpIHtcbiAgICAgICAgdmFyIHZpZXdwb3J0ID0gdGhpcy5fdmlld3BvcnRSZWN0LCBfdCA9IHRoaXM7XG4gICAgICAgIGluX291dF9wb2ludC54ID0gKChfdC5fZGV2aWNlUGl4ZWxSYXRpbyAqIChpbl9vdXRfcG9pbnQueCAtIHJlbGF0ZWRQb3MubGVmdCkpIC0gdmlld3BvcnQueCkgLyBfdC5fc2NhbGVYO1xuICAgICAgICBpbl9vdXRfcG9pbnQueSA9IChfdC5fZGV2aWNlUGl4ZWxSYXRpbyAqIChyZWxhdGVkUG9zLnRvcCArIHJlbGF0ZWRQb3MuaGVpZ2h0IC0gaW5fb3V0X3BvaW50LnkpIC0gdmlld3BvcnQueSkgLyBfdC5fc2NhbGVZO1xuICAgIH0sXG5cbiAgICBfY29udmVydFBvaW50V2l0aFNjYWxlOiBmdW5jdGlvbiAocG9pbnQpIHtcbiAgICAgICAgdmFyIHZpZXdwb3J0ID0gdGhpcy5fdmlld3BvcnRSZWN0O1xuICAgICAgICBwb2ludC54ID0gKHBvaW50LnggLSB2aWV3cG9ydC54KSAvIHRoaXMuX3NjYWxlWDtcbiAgICAgICAgcG9pbnQueSA9IChwb2ludC55IC0gdmlld3BvcnQueSkgLyB0aGlzLl9zY2FsZVk7XG4gICAgfSxcblxuICAgIF9jb252ZXJ0VG91Y2hlc1dpdGhTY2FsZTogZnVuY3Rpb24gKHRvdWNoZXMpIHtcbiAgICAgICAgdmFyIHZpZXdwb3J0ID0gdGhpcy5fdmlld3BvcnRSZWN0LCBzY2FsZVggPSB0aGlzLl9zY2FsZVgsIHNjYWxlWSA9IHRoaXMuX3NjYWxlWSxcbiAgICAgICAgICAgIHNlbFRvdWNoLCBzZWxQb2ludCwgc2VsUHJlUG9pbnQ7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc2VsVG91Y2ggPSB0b3VjaGVzW2ldO1xuICAgICAgICAgICAgc2VsUG9pbnQgPSBzZWxUb3VjaC5fcG9pbnQ7XG4gICAgICAgICAgICBzZWxQcmVQb2ludCA9IHNlbFRvdWNoLl9wcmV2UG9pbnQ7XG5cbiAgICAgICAgICAgIHNlbFBvaW50LnggPSAoc2VsUG9pbnQueCAtIHZpZXdwb3J0LngpIC8gc2NhbGVYO1xuICAgICAgICAgICAgc2VsUG9pbnQueSA9IChzZWxQb2ludC55IC0gdmlld3BvcnQueSkgLyBzY2FsZVk7XG4gICAgICAgICAgICBzZWxQcmVQb2ludC54ID0gKHNlbFByZVBvaW50LnggLSB2aWV3cG9ydC54KSAvIHNjYWxlWDtcbiAgICAgICAgICAgIHNlbFByZVBvaW50LnkgPSAoc2VsUHJlUG9pbnQueSAtIHZpZXdwb3J0LnkpIC8gc2NhbGVZO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlblxuICogRW1pdCB3aGVuIGRlc2lnbiByZXNvbHV0aW9uIGNoYW5nZWQuXG4gKiAhI3poXG4gKiDlvZPorr7orqHliIbovqjnjofmlLnlj5jml7blj5HpgIHjgIJcbiAqIEBldmVudCBkZXNpZ24tcmVzb2x1dGlvbi1jaGFuZ2VkXG4gKi9cbiAvKipcbiAqICEjZW5cbiAqIEVtaXQgd2hlbiBjYW52YXMgcmVzaXplLlxuICogISN6aFxuICog5b2T55S75biD5aSn5bCP5pS55Y+Y5pe25Y+R6YCB44CCXG4gKiBAZXZlbnQgY2FudmFzLXJlc2l6ZVxuICovXG5cblxuLyoqXG4gKiA8cD5jYy5nYW1lLmNvbnRhaW5lclN0cmF0ZWd5IGNsYXNzIGlzIHRoZSByb290IHN0cmF0ZWd5IGNsYXNzIG9mIGNvbnRhaW5lcidzIHNjYWxlIHN0cmF0ZWd5LFxuICogaXQgY29udHJvbHMgdGhlIGJlaGF2aW9yIG9mIGhvdyB0byBzY2FsZSB0aGUgY2MuZ2FtZS5jb250YWluZXIgYW5kIGNjLmdhbWUuY2FudmFzIG9iamVjdDwvcD5cbiAqXG4gKiBAY2xhc3MgQ29udGFpbmVyU3RyYXRlZ3lcbiAqL1xuY2MuQ29udGFpbmVyU3RyYXRlZ3kgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogXCJDb250YWluZXJTdHJhdGVneVwiLFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBNYW5pcHVsYXRpb24gYmVmb3JlIGFwcGxpbmcgdGhlIHN0cmF0ZWd5XG4gICAgICogISN6aCDlnKjlupTnlKjnrZbnlaXkuYvliY3nmoTmk43kvZxcbiAgICAgKiBAbWV0aG9kIHByZUFwcGx5XG4gICAgICogQHBhcmFtIHtWaWV3fSB2aWV3IC0gVGhlIHRhcmdldCB2aWV3XG4gICAgICovXG4gICAgcHJlQXBwbHk6IGZ1bmN0aW9uICh2aWV3KSB7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBGdW5jdGlvbiB0byBhcHBseSB0aGlzIHN0cmF0ZWd5XG4gICAgICogISN6aCDnrZbnlaXlupTnlKjmlrnms5VcbiAgICAgKiBAbWV0aG9kIGFwcGx5XG4gICAgICogQHBhcmFtIHtWaWV3fSB2aWV3XG4gICAgICogQHBhcmFtIHtTaXplfSBkZXNpZ25lZFJlc29sdXRpb25cbiAgICAgKi9cbiAgICBhcHBseTogZnVuY3Rpb24gKHZpZXcsIGRlc2lnbmVkUmVzb2x1dGlvbikge1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogTWFuaXB1bGF0aW9uIGFmdGVyIGFwcGx5aW5nIHRoZSBzdHJhdGVneVxuICAgICAqICEjemgg562W55Wl6LCD55So5LmL5ZCO55qE5pON5L2cXG4gICAgICogQG1ldGhvZCBwb3N0QXBwbHlcbiAgICAgKiBAcGFyYW0ge1ZpZXd9IHZpZXcgIFRoZSB0YXJnZXQgdmlld1xuICAgICAqL1xuICAgIHBvc3RBcHBseTogZnVuY3Rpb24gKHZpZXcpIHtcblxuICAgIH0sXG5cbiAgICBfc2V0dXBDb250YWluZXI6IGZ1bmN0aW9uICh2aWV3LCB3LCBoKSB7XG4gICAgICAgIHZhciBsb2NDYW52YXMgPSBjYy5nYW1lLmNhbnZhcztcblxuICAgICAgICB0aGlzLl9zZXR1cFN0eWxlKHZpZXcsIHcsIGgpO1xuICAgICAgICBcbiAgICAgICAgLy8gU2V0dXAgcGl4ZWwgcmF0aW8gZm9yIHJldGluYSBkaXNwbGF5XG4gICAgICAgIHZhciBkZXZpY2VQaXhlbFJhdGlvID0gdmlldy5fZGV2aWNlUGl4ZWxSYXRpbyA9IDE7XG4gICAgICAgIGlmKENDX0pTQil7XG4gICAgICAgICAgICAvLyB2aWV3LmlzUmV0aW5hRW5hYmxlZCBvbmx5IHdvcmsgb24gd2ViLiBcbiAgICAgICAgICAgIGRldmljZVBpeGVsUmF0aW8gPSB2aWV3Ll9kZXZpY2VQaXhlbFJhdGlvID0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgICAgIH1lbHNlIGlmICh2aWV3LmlzUmV0aW5hRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICBkZXZpY2VQaXhlbFJhdGlvID0gdmlldy5fZGV2aWNlUGl4ZWxSYXRpbyA9IE1hdGgubWluKHZpZXcuX21heFBpeGVsUmF0aW8sIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNldHVwIGNhbnZhc1xuICAgICAgICBsb2NDYW52YXMud2lkdGggPSB3ICogZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgbG9jQ2FudmFzLmhlaWdodCA9IGggKiBkZXZpY2VQaXhlbFJhdGlvO1xuICAgIH0sXG5cbiAgICBfc2V0dXBTdHlsZTogZnVuY3Rpb24gKHZpZXcsIHcsIGgpIHtcbiAgICAgICAgbGV0IGxvY0NhbnZhcyA9IGNjLmdhbWUuY2FudmFzO1xuICAgICAgICBsZXQgbG9jQ29udGFpbmVyID0gY2MuZ2FtZS5jb250YWluZXI7XG4gICAgICAgIGlmIChjYy5zeXMub3MgPT09IGNjLnN5cy5PU19BTkRST0lEKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLndpZHRoID0gKHZpZXcuX2lzUm90YXRlZCA/IGggOiB3KSArICdweCc7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmhlaWdodCA9ICh2aWV3Ll9pc1JvdGF0ZWQgPyB3IDogaCkgKyAncHgnO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNldHVwIHN0eWxlXG4gICAgICAgIGxvY0NvbnRhaW5lci5zdHlsZS53aWR0aCA9IGxvY0NhbnZhcy5zdHlsZS53aWR0aCA9IHcgKyAncHgnO1xuICAgICAgICBsb2NDb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gbG9jQ2FudmFzLnN0eWxlLmhlaWdodCA9IGggKyAncHgnO1xuICAgIH0sXG5cbiAgICBfZml4Q29udGFpbmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIEFkZCBjb250YWluZXIgdG8gZG9jdW1lbnQgYm9keVxuICAgICAgICBkb2N1bWVudC5ib2R5Lmluc2VydEJlZm9yZShjYy5nYW1lLmNvbnRhaW5lciwgZG9jdW1lbnQuYm9keS5maXJzdENoaWxkKTtcbiAgICAgICAgLy8gU2V0IGJvZHkncyB3aWR0aCBoZWlnaHQgdG8gd2luZG93J3Mgc2l6ZSwgYW5kIGZvcmJpZCBvdmVyZmxvdywgc28gdGhhdCBnYW1lIHdpbGwgYmUgY2VudGVyZWRcbiAgICAgICAgdmFyIGJzID0gZG9jdW1lbnQuYm9keS5zdHlsZTtcbiAgICAgICAgYnMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCArIFwicHhcIjtcbiAgICAgICAgYnMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICBicy5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgICAgIC8vIEJvZHkgc2l6ZSBzb2x1dGlvbiBkb2Vzbid0IHdvcmsgb24gYWxsIG1vYmlsZSBicm93c2VyIHNvIHRoaXMgaXMgdGhlIGFsZXRlcm5hdGl2ZTogZml4ZWQgY29udGFpbmVyXG4gICAgICAgIHZhciBjb250U3R5bGUgPSBjYy5nYW1lLmNvbnRhaW5lci5zdHlsZTtcbiAgICAgICAgY29udFN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xuICAgICAgICBjb250U3R5bGUubGVmdCA9IGNvbnRTdHlsZS50b3AgPSBcIjBweFwiO1xuICAgICAgICAvLyBSZXBvc2l0aW9uIGJvZHlcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSAwO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIDxwPmNjLkNvbnRlbnRTdHJhdGVneSBjbGFzcyBpcyB0aGUgcm9vdCBzdHJhdGVneSBjbGFzcyBvZiBjb250ZW50J3Mgc2NhbGUgc3RyYXRlZ3ksXG4gKiBpdCBjb250cm9scyB0aGUgYmVoYXZpb3Igb2YgaG93IHRvIHNjYWxlIHRoZSBzY2VuZSBhbmQgc2V0dXAgdGhlIHZpZXdwb3J0IGZvciB0aGUgZ2FtZTwvcD5cbiAqXG4gKiBAY2xhc3MgQ29udGVudFN0cmF0ZWd5XG4gKi9cbmNjLkNvbnRlbnRTdHJhdGVneSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiBcIkNvbnRlbnRTdHJhdGVneVwiLFxuXG4gICAgY3RvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9yZXN1bHQgPSB7XG4gICAgICAgICAgICBzY2FsZTogWzEsIDFdLFxuICAgICAgICAgICAgdmlld3BvcnQ6IG51bGxcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgX2J1aWxkUmVzdWx0OiBmdW5jdGlvbiAoY29udGFpbmVyVywgY29udGFpbmVySCwgY29udGVudFcsIGNvbnRlbnRILCBzY2FsZVgsIHNjYWxlWSkge1xuICAgICAgICAvLyBNYWtlcyBjb250ZW50IGZpdCBiZXR0ZXIgdGhlIGNhbnZhc1xuICAgICAgICBNYXRoLmFicyhjb250YWluZXJXIC0gY29udGVudFcpIDwgMiAmJiAoY29udGVudFcgPSBjb250YWluZXJXKTtcbiAgICAgICAgTWF0aC5hYnMoY29udGFpbmVySCAtIGNvbnRlbnRIKSA8IDIgJiYgKGNvbnRlbnRIID0gY29udGFpbmVySCk7XG5cbiAgICAgICAgdmFyIHZpZXdwb3J0ID0gY2MucmVjdCgoY29udGFpbmVyVyAtIGNvbnRlbnRXKSAvIDIsIChjb250YWluZXJIIC0gY29udGVudEgpIC8gMiwgY29udGVudFcsIGNvbnRlbnRIKTtcblxuICAgICAgICAvLyBUcmFuc2xhdGUgdGhlIGNvbnRlbnRcbiAgICAgICAgaWYgKGNjLmdhbWUucmVuZGVyVHlwZSA9PT0gY2MuZ2FtZS5SRU5ERVJfVFlQRV9DQU5WQVMpe1xuICAgICAgICAgICAgLy9UT0RPOiBtb2RpZnkgc29tZXRoaW5nIGZvciBzZXRUcmFuc2Zvcm1cbiAgICAgICAgICAgIC8vY2MuZ2FtZS5fcmVuZGVyQ29udGV4dC50cmFuc2xhdGUodmlld3BvcnQueCwgdmlld3BvcnQueSArIGNvbnRlbnRIKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3Jlc3VsdC5zY2FsZSA9IFtzY2FsZVgsIHNjYWxlWV07XG4gICAgICAgIHRoaXMuX3Jlc3VsdC52aWV3cG9ydCA9IHZpZXdwb3J0O1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzdWx0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogTWFuaXB1bGF0aW9uIGJlZm9yZSBhcHBseWluZyB0aGUgc3RyYXRlZ3lcbiAgICAgKiAhI3poIOetlueVpeW6lOeUqOWJjeeahOaTjeS9nFxuICAgICAqIEBtZXRob2QgcHJlQXBwbHlcbiAgICAgKiBAcGFyYW0ge1ZpZXd9IHZpZXcgLSBUaGUgdGFyZ2V0IHZpZXdcbiAgICAgKi9cbiAgICBwcmVBcHBseTogZnVuY3Rpb24gKHZpZXcpIHtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBGdW5jdGlvbiB0byBhcHBseSB0aGlzIHN0cmF0ZWd5XG4gICAgICogVGhlIHJldHVybiB2YWx1ZSBpcyB7c2NhbGU6IFtzY2FsZVgsIHNjYWxlWV0sIHZpZXdwb3J0OiB7Y2MuUmVjdH19LFxuICAgICAqIFRoZSB0YXJnZXQgdmlldyBjYW4gdGhlbiBhcHBseSB0aGVzZSB2YWx1ZSB0byBpdHNlbGYsIGl0J3MgcHJlZmVycmVkIG5vdCB0byBtb2RpZnkgZGlyZWN0bHkgaXRzIHByaXZhdGUgdmFyaWFibGVzXG4gICAgICogISN6aCDosIPnlKjnrZbnlaXmlrnms5VcbiAgICAgKiBAbWV0aG9kIGFwcGx5XG4gICAgICogQHBhcmFtIHtWaWV3fSB2aWV3XG4gICAgICogQHBhcmFtIHtTaXplfSBkZXNpZ25lZFJlc29sdXRpb25cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHNjYWxlQW5kVmlld3BvcnRSZWN0XG4gICAgICovXG4gICAgYXBwbHk6IGZ1bmN0aW9uICh2aWV3LCBkZXNpZ25lZFJlc29sdXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcInNjYWxlXCI6IFsxLCAxXX07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBNYW5pcHVsYXRpb24gYWZ0ZXIgYXBwbHlpbmcgdGhlIHN0cmF0ZWd5XG4gICAgICogISN6aCDnrZbnlaXosIPnlKjkuYvlkI7nmoTmk43kvZxcbiAgICAgKiBAbWV0aG9kIHBvc3RBcHBseVxuICAgICAqIEBwYXJhbSB7Vmlld30gdmlldyAtIFRoZSB0YXJnZXQgdmlld1xuICAgICAqL1xuICAgIHBvc3RBcHBseTogZnVuY3Rpb24gKHZpZXcpIHtcbiAgICB9XG59KTtcblxuKGZ1bmN0aW9uICgpIHtcblxuLy8gQ29udGFpbmVyIHNjYWxlIHN0cmF0ZWd5c1xuICAgIC8qKlxuICAgICAqIEBjbGFzcyBFcXVhbFRvRnJhbWVcbiAgICAgKiBAZXh0ZW5kcyBDb250YWluZXJTdHJhdGVneVxuICAgICAqL1xuICAgIHZhciBFcXVhbFRvRnJhbWUgPSBjYy5DbGFzcyh7XG4gICAgICAgIG5hbWU6IFwiRXF1YWxUb0ZyYW1lXCIsXG4gICAgICAgIGV4dGVuZHM6IGNjLkNvbnRhaW5lclN0cmF0ZWd5LFxuICAgICAgICBhcHBseTogZnVuY3Rpb24gKHZpZXcpIHtcbiAgICAgICAgICAgIHZhciBmcmFtZUggPSB2aWV3Ll9mcmFtZVNpemUuaGVpZ2h0LCBjb250YWluZXJTdHlsZSA9IGNjLmdhbWUuY29udGFpbmVyLnN0eWxlO1xuICAgICAgICAgICAgdGhpcy5fc2V0dXBDb250YWluZXIodmlldywgdmlldy5fZnJhbWVTaXplLndpZHRoLCB2aWV3Ll9mcmFtZVNpemUuaGVpZ2h0KTtcbiAgICAgICAgICAgIC8vIFNldHVwIGNvbnRhaW5lcidzIG1hcmdpbiBhbmQgcGFkZGluZ1xuICAgICAgICAgICAgaWYgKHZpZXcuX2lzUm90YXRlZCkge1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lclN0eWxlLm1hcmdpbiA9ICcwIDAgMCAnICsgZnJhbWVIICsgJ3B4JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lclN0eWxlLm1hcmdpbiA9ICcwcHgnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGFpbmVyU3R5bGUucGFkZGluZyA9IFwiMHB4XCI7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBQcm9wb3J0aW9uYWxUb0ZyYW1lXG4gICAgICogQGV4dGVuZHMgQ29udGFpbmVyU3RyYXRlZ3lcbiAgICAgKi9cbiAgICB2YXIgUHJvcG9ydGlvbmFsVG9GcmFtZSA9IGNjLkNsYXNzKHtcbiAgICAgICAgbmFtZTogXCJQcm9wb3J0aW9uYWxUb0ZyYW1lXCIsXG4gICAgICAgIGV4dGVuZHM6IGNjLkNvbnRhaW5lclN0cmF0ZWd5LFxuICAgICAgICBhcHBseTogZnVuY3Rpb24gKHZpZXcsIGRlc2lnbmVkUmVzb2x1dGlvbikge1xuICAgICAgICAgICAgdmFyIGZyYW1lVyA9IHZpZXcuX2ZyYW1lU2l6ZS53aWR0aCwgZnJhbWVIID0gdmlldy5fZnJhbWVTaXplLmhlaWdodCwgY29udGFpbmVyU3R5bGUgPSBjYy5nYW1lLmNvbnRhaW5lci5zdHlsZSxcbiAgICAgICAgICAgICAgICBkZXNpZ25XID0gZGVzaWduZWRSZXNvbHV0aW9uLndpZHRoLCBkZXNpZ25IID0gZGVzaWduZWRSZXNvbHV0aW9uLmhlaWdodCxcbiAgICAgICAgICAgICAgICBzY2FsZVggPSBmcmFtZVcgLyBkZXNpZ25XLCBzY2FsZVkgPSBmcmFtZUggLyBkZXNpZ25ILFxuICAgICAgICAgICAgICAgIGNvbnRhaW5lclcsIGNvbnRhaW5lckg7XG5cbiAgICAgICAgICAgIHNjYWxlWCA8IHNjYWxlWSA/IChjb250YWluZXJXID0gZnJhbWVXLCBjb250YWluZXJIID0gZGVzaWduSCAqIHNjYWxlWCkgOiAoY29udGFpbmVyVyA9IGRlc2lnblcgKiBzY2FsZVksIGNvbnRhaW5lckggPSBmcmFtZUgpO1xuXG4gICAgICAgICAgICAvLyBBZGp1c3QgY29udGFpbmVyIHNpemUgd2l0aCBpbnRlZ2VyIHZhbHVlXG4gICAgICAgICAgICB2YXIgb2ZmeCA9IE1hdGgucm91bmQoKGZyYW1lVyAtIGNvbnRhaW5lclcpIC8gMik7XG4gICAgICAgICAgICB2YXIgb2ZmeSA9IE1hdGgucm91bmQoKGZyYW1lSCAtIGNvbnRhaW5lckgpIC8gMik7XG4gICAgICAgICAgICBjb250YWluZXJXID0gZnJhbWVXIC0gMiAqIG9mZng7XG4gICAgICAgICAgICBjb250YWluZXJIID0gZnJhbWVIIC0gMiAqIG9mZnk7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldHVwQ29udGFpbmVyKHZpZXcsIGNvbnRhaW5lclcsIGNvbnRhaW5lckgpO1xuICAgICAgICAgICAgaWYgKCFDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAvLyBTZXR1cCBjb250YWluZXIncyBtYXJnaW4gYW5kIHBhZGRpbmdcbiAgICAgICAgICAgICAgICBpZiAodmlldy5faXNSb3RhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lclN0eWxlLm1hcmdpbiA9ICcwIDAgMCAnICsgZnJhbWVIICsgJ3B4JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lclN0eWxlLm1hcmdpbiA9ICcwcHgnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb250YWluZXJTdHlsZS5wYWRkaW5nTGVmdCA9IG9mZnggKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyU3R5bGUucGFkZGluZ1JpZ2h0ID0gb2ZmeCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBjb250YWluZXJTdHlsZS5wYWRkaW5nVG9wID0gb2ZmeSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBjb250YWluZXJTdHlsZS5wYWRkaW5nQm90dG9tID0gb2ZmeSArIFwicHhcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIEVxdWFsVG9XaW5kb3dcbiAgICAgKiBAZXh0ZW5kcyBFcXVhbFRvRnJhbWVcbiAgICAgKi9cbiAgICB2YXIgRXF1YWxUb1dpbmRvdyA9IGNjLkNsYXNzKHtcbiAgICAgICAgbmFtZTogXCJFcXVhbFRvV2luZG93XCIsXG4gICAgICAgIGV4dGVuZHM6IEVxdWFsVG9GcmFtZSxcbiAgICAgICAgcHJlQXBwbHk6IGZ1bmN0aW9uICh2aWV3KSB7XG4gICAgICAgICAgICB0aGlzLl9zdXBlcih2aWV3KTtcbiAgICAgICAgICAgIGNjLmdhbWUuZnJhbWUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXBwbHk6IGZ1bmN0aW9uICh2aWV3KSB7XG4gICAgICAgICAgICB0aGlzLl9zdXBlcih2aWV3KTtcbiAgICAgICAgICAgIHRoaXMuX2ZpeENvbnRhaW5lcigpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgUHJvcG9ydGlvbmFsVG9XaW5kb3dcbiAgICAgKiBAZXh0ZW5kcyBQcm9wb3J0aW9uYWxUb0ZyYW1lXG4gICAgICovXG4gICAgdmFyIFByb3BvcnRpb25hbFRvV2luZG93ID0gY2MuQ2xhc3Moe1xuICAgICAgICBuYW1lOiBcIlByb3BvcnRpb25hbFRvV2luZG93XCIsXG4gICAgICAgIGV4dGVuZHM6IFByb3BvcnRpb25hbFRvRnJhbWUsXG4gICAgICAgIHByZUFwcGx5OiBmdW5jdGlvbiAodmlldykge1xuICAgICAgICAgICAgdGhpcy5fc3VwZXIodmlldyk7XG4gICAgICAgICAgICBjYy5nYW1lLmZyYW1lID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICB9LFxuXG4gICAgICAgIGFwcGx5OiBmdW5jdGlvbiAodmlldywgZGVzaWduZWRSZXNvbHV0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9zdXBlcih2aWV3LCBkZXNpZ25lZFJlc29sdXRpb24pO1xuICAgICAgICAgICAgdGhpcy5fZml4Q29udGFpbmVyKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBPcmlnaW5hbENvbnRhaW5lclxuICAgICAqIEBleHRlbmRzIENvbnRhaW5lclN0cmF0ZWd5XG4gICAgICovXG4gICAgdmFyIE9yaWdpbmFsQ29udGFpbmVyID0gY2MuQ2xhc3Moe1xuICAgICAgICBuYW1lOiBcIk9yaWdpbmFsQ29udGFpbmVyXCIsXG4gICAgICAgIGV4dGVuZHM6IGNjLkNvbnRhaW5lclN0cmF0ZWd5LFxuICAgICAgICBhcHBseTogZnVuY3Rpb24gKHZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldHVwQ29udGFpbmVyKHZpZXcsIGNjLmdhbWUuY2FudmFzLndpZHRoLCBjYy5nYW1lLmNhbnZhcy5oZWlnaHQpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBuZWVkIHRvIGFkYXB0IHByb3RvdHlwZSBiZWZvcmUgaW5zdGFudGlhdGluZ1xuICAgIGxldCBfZ2xvYmFsID0gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB3aW5kb3c7XG4gICAgbGV0IGdsb2JhbEFkYXB0ZXIgPSBfZ2xvYmFsLl9fZ2xvYmFsQWRhcHRlcjtcbiAgICBpZiAoZ2xvYmFsQWRhcHRlcikge1xuICAgICAgICBpZiAoZ2xvYmFsQWRhcHRlci5hZGFwdENvbnRhaW5lclN0cmF0ZWd5KSB7XG4gICAgICAgICAgICBnbG9iYWxBZGFwdGVyLmFkYXB0Q29udGFpbmVyU3RyYXRlZ3koY2MuQ29udGFpbmVyU3RyYXRlZ3kucHJvdG90eXBlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ2xvYmFsQWRhcHRlci5hZGFwdFZpZXcpIHtcbiAgICAgICAgICAgIGdsb2JhbEFkYXB0ZXIuYWRhcHRWaWV3KFZpZXcucHJvdG90eXBlKTtcbiAgICAgICAgfVxuICAgIH1cblxuLy8gI05PVCBTVEFCTEUgb24gQW5kcm9pZCMgQWxpYXM6IFN0cmF0ZWd5IHRoYXQgbWFrZXMgdGhlIGNvbnRhaW5lcidzIHNpemUgZXF1YWxzIHRvIHRoZSB3aW5kb3cncyBzaXplXG4vLyAgICBjYy5Db250YWluZXJTdHJhdGVneS5FUVVBTF9UT19XSU5ET1cgPSBuZXcgRXF1YWxUb1dpbmRvdygpO1xuLy8gI05PVCBTVEFCTEUgb24gQW5kcm9pZCMgQWxpYXM6IFN0cmF0ZWd5IHRoYXQgc2NhbGUgcHJvcG9ydGlvbmFsbHkgdGhlIGNvbnRhaW5lcidzIHNpemUgdG8gd2luZG93J3Mgc2l6ZVxuLy8gICAgY2MuQ29udGFpbmVyU3RyYXRlZ3kuUFJPUE9SVElPTl9UT19XSU5ET1cgPSBuZXcgUHJvcG9ydGlvbmFsVG9XaW5kb3coKTtcbi8vIEFsaWFzOiBTdHJhdGVneSB0aGF0IG1ha2VzIHRoZSBjb250YWluZXIncyBzaXplIGVxdWFscyB0byB0aGUgZnJhbWUncyBzaXplXG4gICAgY2MuQ29udGFpbmVyU3RyYXRlZ3kuRVFVQUxfVE9fRlJBTUUgPSBuZXcgRXF1YWxUb0ZyYW1lKCk7XG4vLyBBbGlhczogU3RyYXRlZ3kgdGhhdCBzY2FsZSBwcm9wb3J0aW9uYWxseSB0aGUgY29udGFpbmVyJ3Mgc2l6ZSB0byBmcmFtZSdzIHNpemVcbiAgICBjYy5Db250YWluZXJTdHJhdGVneS5QUk9QT1JUSU9OX1RPX0ZSQU1FID0gbmV3IFByb3BvcnRpb25hbFRvRnJhbWUoKTtcbi8vIEFsaWFzOiBTdHJhdGVneSB0aGF0IGtlZXBzIHRoZSBvcmlnaW5hbCBjb250YWluZXIncyBzaXplXG4gICAgY2MuQ29udGFpbmVyU3RyYXRlZ3kuT1JJR0lOQUxfQ09OVEFJTkVSID0gbmV3IE9yaWdpbmFsQ29udGFpbmVyKCk7XG5cbi8vIENvbnRlbnQgc2NhbGUgc3RyYXRlZ3lzXG4gICAgdmFyIEV4YWN0Rml0ID0gY2MuQ2xhc3Moe1xuICAgICAgICBuYW1lOiBcIkV4YWN0Rml0XCIsXG4gICAgICAgIGV4dGVuZHM6IGNjLkNvbnRlbnRTdHJhdGVneSxcbiAgICAgICAgYXBwbHk6IGZ1bmN0aW9uICh2aWV3LCBkZXNpZ25lZFJlc29sdXRpb24pIHtcbiAgICAgICAgICAgIHZhciBjb250YWluZXJXID0gY2MuZ2FtZS5jYW52YXMud2lkdGgsIGNvbnRhaW5lckggPSBjYy5nYW1lLmNhbnZhcy5oZWlnaHQsXG4gICAgICAgICAgICAgICAgc2NhbGVYID0gY29udGFpbmVyVyAvIGRlc2lnbmVkUmVzb2x1dGlvbi53aWR0aCwgc2NhbGVZID0gY29udGFpbmVySCAvIGRlc2lnbmVkUmVzb2x1dGlvbi5oZWlnaHQ7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9idWlsZFJlc3VsdChjb250YWluZXJXLCBjb250YWluZXJILCBjb250YWluZXJXLCBjb250YWluZXJILCBzY2FsZVgsIHNjYWxlWSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBTaG93QWxsID0gY2MuQ2xhc3Moe1xuICAgICAgICBuYW1lOiBcIlNob3dBbGxcIixcbiAgICAgICAgZXh0ZW5kczogY2MuQ29udGVudFN0cmF0ZWd5LFxuICAgICAgICBhcHBseTogZnVuY3Rpb24gKHZpZXcsIGRlc2lnbmVkUmVzb2x1dGlvbikge1xuICAgICAgICAgICAgdmFyIGNvbnRhaW5lclcgPSBjYy5nYW1lLmNhbnZhcy53aWR0aCwgY29udGFpbmVySCA9IGNjLmdhbWUuY2FudmFzLmhlaWdodCxcbiAgICAgICAgICAgICAgICBkZXNpZ25XID0gZGVzaWduZWRSZXNvbHV0aW9uLndpZHRoLCBkZXNpZ25IID0gZGVzaWduZWRSZXNvbHV0aW9uLmhlaWdodCxcbiAgICAgICAgICAgICAgICBzY2FsZVggPSBjb250YWluZXJXIC8gZGVzaWduVywgc2NhbGVZID0gY29udGFpbmVySCAvIGRlc2lnbkgsIHNjYWxlID0gMCxcbiAgICAgICAgICAgICAgICBjb250ZW50VywgY29udGVudEg7XG5cbiAgICAgICAgICAgIHNjYWxlWCA8IHNjYWxlWSA/IChzY2FsZSA9IHNjYWxlWCwgY29udGVudFcgPSBjb250YWluZXJXLCBjb250ZW50SCA9IGRlc2lnbkggKiBzY2FsZSlcbiAgICAgICAgICAgICAgICA6IChzY2FsZSA9IHNjYWxlWSwgY29udGVudFcgPSBkZXNpZ25XICogc2NhbGUsIGNvbnRlbnRIID0gY29udGFpbmVySCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9idWlsZFJlc3VsdChjb250YWluZXJXLCBjb250YWluZXJILCBjb250ZW50VywgY29udGVudEgsIHNjYWxlLCBzY2FsZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBOb0JvcmRlciA9IGNjLkNsYXNzKHtcbiAgICAgICAgbmFtZTogXCJOb0JvcmRlclwiLFxuICAgICAgICBleHRlbmRzOiBjYy5Db250ZW50U3RyYXRlZ3ksXG4gICAgICAgIGFwcGx5OiBmdW5jdGlvbiAodmlldywgZGVzaWduZWRSZXNvbHV0aW9uKSB7XG4gICAgICAgICAgICB2YXIgY29udGFpbmVyVyA9IGNjLmdhbWUuY2FudmFzLndpZHRoLCBjb250YWluZXJIID0gY2MuZ2FtZS5jYW52YXMuaGVpZ2h0LFxuICAgICAgICAgICAgICAgIGRlc2lnblcgPSBkZXNpZ25lZFJlc29sdXRpb24ud2lkdGgsIGRlc2lnbkggPSBkZXNpZ25lZFJlc29sdXRpb24uaGVpZ2h0LFxuICAgICAgICAgICAgICAgIHNjYWxlWCA9IGNvbnRhaW5lclcgLyBkZXNpZ25XLCBzY2FsZVkgPSBjb250YWluZXJIIC8gZGVzaWduSCwgc2NhbGUsXG4gICAgICAgICAgICAgICAgY29udGVudFcsIGNvbnRlbnRIO1xuXG4gICAgICAgICAgICBzY2FsZVggPCBzY2FsZVkgPyAoc2NhbGUgPSBzY2FsZVksIGNvbnRlbnRXID0gZGVzaWduVyAqIHNjYWxlLCBjb250ZW50SCA9IGNvbnRhaW5lckgpXG4gICAgICAgICAgICAgICAgOiAoc2NhbGUgPSBzY2FsZVgsIGNvbnRlbnRXID0gY29udGFpbmVyVywgY29udGVudEggPSBkZXNpZ25IICogc2NhbGUpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYnVpbGRSZXN1bHQoY29udGFpbmVyVywgY29udGFpbmVySCwgY29udGVudFcsIGNvbnRlbnRILCBzY2FsZSwgc2NhbGUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgRml4ZWRIZWlnaHQgPSBjYy5DbGFzcyh7XG4gICAgICAgIG5hbWU6IFwiRml4ZWRIZWlnaHRcIixcbiAgICAgICAgZXh0ZW5kczogY2MuQ29udGVudFN0cmF0ZWd5LFxuICAgICAgICBhcHBseTogZnVuY3Rpb24gKHZpZXcsIGRlc2lnbmVkUmVzb2x1dGlvbikge1xuICAgICAgICAgICAgdmFyIGNvbnRhaW5lclcgPSBjYy5nYW1lLmNhbnZhcy53aWR0aCwgY29udGFpbmVySCA9IGNjLmdhbWUuY2FudmFzLmhlaWdodCxcbiAgICAgICAgICAgICAgICBkZXNpZ25IID0gZGVzaWduZWRSZXNvbHV0aW9uLmhlaWdodCwgc2NhbGUgPSBjb250YWluZXJIIC8gZGVzaWduSCxcbiAgICAgICAgICAgICAgICBjb250ZW50VyA9IGNvbnRhaW5lclcsIGNvbnRlbnRIID0gY29udGFpbmVySDtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2J1aWxkUmVzdWx0KGNvbnRhaW5lclcsIGNvbnRhaW5lckgsIGNvbnRlbnRXLCBjb250ZW50SCwgc2NhbGUsIHNjYWxlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIEZpeGVkV2lkdGggPSBjYy5DbGFzcyh7XG4gICAgICAgIG5hbWU6IFwiRml4ZWRXaWR0aFwiLFxuICAgICAgICBleHRlbmRzOiBjYy5Db250ZW50U3RyYXRlZ3ksXG4gICAgICAgIGFwcGx5OiBmdW5jdGlvbiAodmlldywgZGVzaWduZWRSZXNvbHV0aW9uKSB7XG4gICAgICAgICAgICB2YXIgY29udGFpbmVyVyA9IGNjLmdhbWUuY2FudmFzLndpZHRoLCBjb250YWluZXJIID0gY2MuZ2FtZS5jYW52YXMuaGVpZ2h0LFxuICAgICAgICAgICAgICAgIGRlc2lnblcgPSBkZXNpZ25lZFJlc29sdXRpb24ud2lkdGgsIHNjYWxlID0gY29udGFpbmVyVyAvIGRlc2lnblcsXG4gICAgICAgICAgICAgICAgY29udGVudFcgPSBjb250YWluZXJXLCBjb250ZW50SCA9IGNvbnRhaW5lckg7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9idWlsZFJlc3VsdChjb250YWluZXJXLCBjb250YWluZXJILCBjb250ZW50VywgY29udGVudEgsIHNjYWxlLCBzY2FsZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuLy8gQWxpYXM6IFN0cmF0ZWd5IHRvIHNjYWxlIHRoZSBjb250ZW50J3Mgc2l6ZSB0byBjb250YWluZXIncyBzaXplLCBub24gcHJvcG9ydGlvbmFsXG4gICAgY2MuQ29udGVudFN0cmF0ZWd5LkVYQUNUX0ZJVCA9IG5ldyBFeGFjdEZpdCgpO1xuLy8gQWxpYXM6IFN0cmF0ZWd5IHRvIHNjYWxlIHRoZSBjb250ZW50J3Mgc2l6ZSBwcm9wb3J0aW9uYWxseSB0byBtYXhpbXVtIHNpemUgYW5kIGtlZXBzIHRoZSB3aG9sZSBjb250ZW50IGFyZWEgdG8gYmUgdmlzaWJsZVxuICAgIGNjLkNvbnRlbnRTdHJhdGVneS5TSE9XX0FMTCA9IG5ldyBTaG93QWxsKCk7XG4vLyBBbGlhczogU3RyYXRlZ3kgdG8gc2NhbGUgdGhlIGNvbnRlbnQncyBzaXplIHByb3BvcnRpb25hbGx5IHRvIGZpbGwgdGhlIHdob2xlIGNvbnRhaW5lciBhcmVhXG4gICAgY2MuQ29udGVudFN0cmF0ZWd5Lk5PX0JPUkRFUiA9IG5ldyBOb0JvcmRlcigpO1xuLy8gQWxpYXM6IFN0cmF0ZWd5IHRvIHNjYWxlIHRoZSBjb250ZW50J3MgaGVpZ2h0IHRvIGNvbnRhaW5lcidzIGhlaWdodCBhbmQgcHJvcG9ydGlvbmFsbHkgc2NhbGUgaXRzIHdpZHRoXG4gICAgY2MuQ29udGVudFN0cmF0ZWd5LkZJWEVEX0hFSUdIVCA9IG5ldyBGaXhlZEhlaWdodCgpO1xuLy8gQWxpYXM6IFN0cmF0ZWd5IHRvIHNjYWxlIHRoZSBjb250ZW50J3Mgd2lkdGggdG8gY29udGFpbmVyJ3Mgd2lkdGggYW5kIHByb3BvcnRpb25hbGx5IHNjYWxlIGl0cyBoZWlnaHRcbiAgICBjYy5Db250ZW50U3RyYXRlZ3kuRklYRURfV0lEVEggPSBuZXcgRml4ZWRXaWR0aCgpO1xuXG59KSgpO1xuXG4vKipcbiAqIDxwPmNjLlJlc29sdXRpb25Qb2xpY3kgY2xhc3MgaXMgdGhlIHJvb3Qgc3RyYXRlZ3kgY2xhc3Mgb2Ygc2NhbGUgc3RyYXRlZ3ksXG4gKiBpdHMgbWFpbiB0YXNrIGlzIHRvIG1haW50YWluIHRoZSBjb21wYXRpYmlsaXR5IHdpdGggQ29jb3MyZC14PC9wPlxuICpcbiAqIEBjbGFzcyBSZXNvbHV0aW9uUG9saWN5XG4gKi9cbi8qKlxuICogQG1ldGhvZCBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtDb250YWluZXJTdHJhdGVneX0gY29udGFpbmVyU3RnIFRoZSBjb250YWluZXIgc3RyYXRlZ3lcbiAqIEBwYXJhbSB7Q29udGVudFN0cmF0ZWd5fSBjb250ZW50U3RnIFRoZSBjb250ZW50IHN0cmF0ZWd5XG4gKi9cbmNjLlJlc29sdXRpb25Qb2xpY3kgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogXCJjYy5SZXNvbHV0aW9uUG9saWN5XCIsXG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0b3Igb2YgY2MuUmVzb2x1dGlvblBvbGljeVxuICAgICAqIEBwYXJhbSB7Q29udGFpbmVyU3RyYXRlZ3l9IGNvbnRhaW5lclN0Z1xuICAgICAqIEBwYXJhbSB7Q29udGVudFN0cmF0ZWd5fSBjb250ZW50U3RnXG4gICAgICovXG4gICAgY3RvcjogZnVuY3Rpb24gKGNvbnRhaW5lclN0ZywgY29udGVudFN0Zykge1xuICAgICAgICB0aGlzLl9jb250YWluZXJTdHJhdGVneSA9IG51bGw7XG4gICAgICAgIHRoaXMuX2NvbnRlbnRTdHJhdGVneSA9IG51bGw7XG4gICAgICAgIHRoaXMuc2V0Q29udGFpbmVyU3RyYXRlZ3koY29udGFpbmVyU3RnKTtcbiAgICAgICAgdGhpcy5zZXRDb250ZW50U3RyYXRlZ3koY29udGVudFN0Zyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gTWFuaXB1bGF0aW9uIGJlZm9yZSBhcHBseWluZyB0aGUgcmVzb2x1dGlvbiBwb2xpY3lcbiAgICAgKiAhI3poIOetlueVpeW6lOeUqOWJjeeahOaTjeS9nFxuICAgICAqIEBtZXRob2QgcHJlQXBwbHlcbiAgICAgKiBAcGFyYW0ge1ZpZXd9IHZpZXcgVGhlIHRhcmdldCB2aWV3XG4gICAgICovXG4gICAgcHJlQXBwbHk6IGZ1bmN0aW9uICh2aWV3KSB7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lclN0cmF0ZWd5LnByZUFwcGx5KHZpZXcpO1xuICAgICAgICB0aGlzLl9jb250ZW50U3RyYXRlZ3kucHJlQXBwbHkodmlldyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gRnVuY3Rpb24gdG8gYXBwbHkgdGhpcyByZXNvbHV0aW9uIHBvbGljeVxuICAgICAqIFRoZSByZXR1cm4gdmFsdWUgaXMge3NjYWxlOiBbc2NhbGVYLCBzY2FsZVldLCB2aWV3cG9ydDoge2NjLlJlY3R9fSxcbiAgICAgKiBUaGUgdGFyZ2V0IHZpZXcgY2FuIHRoZW4gYXBwbHkgdGhlc2UgdmFsdWUgdG8gaXRzZWxmLCBpdCdzIHByZWZlcnJlZCBub3QgdG8gbW9kaWZ5IGRpcmVjdGx5IGl0cyBwcml2YXRlIHZhcmlhYmxlc1xuICAgICAqICEjemgg6LCD55So562W55Wl5pa55rOVXG4gICAgICogQG1ldGhvZCBhcHBseVxuICAgICAqIEBwYXJhbSB7Vmlld30gdmlldyAtIFRoZSB0YXJnZXQgdmlld1xuICAgICAqIEBwYXJhbSB7U2l6ZX0gZGVzaWduZWRSZXNvbHV0aW9uIC0gVGhlIHVzZXIgZGVmaW5lZCBkZXNpZ24gcmVzb2x1dGlvblxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQW4gb2JqZWN0IGNvbnRhaW5zIHRoZSBzY2FsZSBYL1kgdmFsdWVzIGFuZCB0aGUgdmlld3BvcnQgcmVjdFxuICAgICAqL1xuICAgIGFwcGx5OiBmdW5jdGlvbiAodmlldywgZGVzaWduZWRSZXNvbHV0aW9uKSB7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lclN0cmF0ZWd5LmFwcGx5KHZpZXcsIGRlc2lnbmVkUmVzb2x1dGlvbik7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50U3RyYXRlZ3kuYXBwbHkodmlldywgZGVzaWduZWRSZXNvbHV0aW9uKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBNYW5pcHVsYXRpb24gYWZ0ZXIgYXBweWxpbmcgdGhlIHN0cmF0ZWd5XG4gICAgICogISN6aCDnrZbnlaXlupTnlKjkuYvlkI7nmoTmk43kvZxcbiAgICAgKiBAbWV0aG9kIHBvc3RBcHBseVxuICAgICAqIEBwYXJhbSB7Vmlld30gdmlldyAtIFRoZSB0YXJnZXQgdmlld1xuICAgICAqL1xuICAgIHBvc3RBcHBseTogZnVuY3Rpb24gKHZpZXcpIHtcbiAgICAgICAgdGhpcy5fY29udGFpbmVyU3RyYXRlZ3kucG9zdEFwcGx5KHZpZXcpO1xuICAgICAgICB0aGlzLl9jb250ZW50U3RyYXRlZ3kucG9zdEFwcGx5KHZpZXcpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0dXAgdGhlIGNvbnRhaW5lcidzIHNjYWxlIHN0cmF0ZWd5XG4gICAgICogISN6aCDorr7nva7lrrnlmajnmoTpgILphY3nrZbnlaVcbiAgICAgKiBAbWV0aG9kIHNldENvbnRhaW5lclN0cmF0ZWd5XG4gICAgICogQHBhcmFtIHtDb250YWluZXJTdHJhdGVneX0gY29udGFpbmVyU3RnXG4gICAgICovXG4gICAgc2V0Q29udGFpbmVyU3RyYXRlZ3k6IGZ1bmN0aW9uIChjb250YWluZXJTdGcpIHtcbiAgICAgICAgaWYgKGNvbnRhaW5lclN0ZyBpbnN0YW5jZW9mIGNjLkNvbnRhaW5lclN0cmF0ZWd5KVxuICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyU3RyYXRlZ3kgPSBjb250YWluZXJTdGc7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTZXR1cCB0aGUgY29udGVudCdzIHNjYWxlIHN0cmF0ZWd5XG4gICAgICogISN6aCDorr7nva7lhoXlrrnnmoTpgILphY3nrZbnlaVcbiAgICAgKiBAbWV0aG9kIHNldENvbnRlbnRTdHJhdGVneVxuICAgICAqIEBwYXJhbSB7Q29udGVudFN0cmF0ZWd5fSBjb250ZW50U3RnXG4gICAgICovXG4gICAgc2V0Q29udGVudFN0cmF0ZWd5OiBmdW5jdGlvbiAoY29udGVudFN0Zykge1xuICAgICAgICBpZiAoY29udGVudFN0ZyBpbnN0YW5jZW9mIGNjLkNvbnRlbnRTdHJhdGVneSlcbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRTdHJhdGVneSA9IGNvbnRlbnRTdGc7XG4gICAgfVxufSk7XG5cbmpzLmdldChjYy5SZXNvbHV0aW9uUG9saWN5LnByb3RvdHlwZSwgXCJjYW52YXNTaXplXCIsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2MudjIoY2MuZ2FtZS5jYW52YXMud2lkdGgsIGNjLmdhbWUuY2FudmFzLmhlaWdodCk7XG59KTtcblxuLyoqXG4gKiBUaGUgZW50aXJlIGFwcGxpY2F0aW9uIGlzIHZpc2libGUgaW4gdGhlIHNwZWNpZmllZCBhcmVhIHdpdGhvdXQgdHJ5aW5nIHRvIHByZXNlcnZlIHRoZSBvcmlnaW5hbCBhc3BlY3QgcmF0aW8uPGJyLz5cbiAqIERpc3RvcnRpb24gY2FuIG9jY3VyLCBhbmQgdGhlIGFwcGxpY2F0aW9uIG1heSBhcHBlYXIgc3RyZXRjaGVkIG9yIGNvbXByZXNzZWQuXG4gKiBAcHJvcGVydHkge051bWJlcn0gRVhBQ1RfRklUXG4gKiBAcmVhZG9ubHlcbiAqIEBzdGF0aWNcbiAqL1xuY2MuUmVzb2x1dGlvblBvbGljeS5FWEFDVF9GSVQgPSAwO1xuXG4vKipcbiAqIFRoZSBlbnRpcmUgYXBwbGljYXRpb24gZmlsbHMgdGhlIHNwZWNpZmllZCBhcmVhLCB3aXRob3V0IGRpc3RvcnRpb24gYnV0IHBvc3NpYmx5IHdpdGggc29tZSBjcm9wcGluZyw8YnIvPlxuICogd2hpbGUgbWFpbnRhaW5pbmcgdGhlIG9yaWdpbmFsIGFzcGVjdCByYXRpbyBvZiB0aGUgYXBwbGljYXRpb24uXG4gKiBAcHJvcGVydHkge051bWJlcn0gTk9fQk9SREVSXG4gKiBAcmVhZG9ubHlcbiAqIEBzdGF0aWNcbiAqL1xuY2MuUmVzb2x1dGlvblBvbGljeS5OT19CT1JERVIgPSAxO1xuXG4vKipcbiAqIFRoZSBlbnRpcmUgYXBwbGljYXRpb24gaXMgdmlzaWJsZSBpbiB0aGUgc3BlY2lmaWVkIGFyZWEgd2l0aG91dCBkaXN0b3J0aW9uIHdoaWxlIG1haW50YWluaW5nIHRoZSBvcmlnaW5hbDxici8+XG4gKiBhc3BlY3QgcmF0aW8gb2YgdGhlIGFwcGxpY2F0aW9uLiBCb3JkZXJzIGNhbiBhcHBlYXIgb24gdHdvIHNpZGVzIG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTSE9XX0FMTFxuICogQHJlYWRvbmx5XG4gKiBAc3RhdGljXG4gKi9cbmNjLlJlc29sdXRpb25Qb2xpY3kuU0hPV19BTEwgPSAyO1xuXG4vKipcbiAqIFRoZSBhcHBsaWNhdGlvbiB0YWtlcyB0aGUgaGVpZ2h0IG9mIHRoZSBkZXNpZ24gcmVzb2x1dGlvbiBzaXplIGFuZCBtb2RpZmllcyB0aGUgd2lkdGggb2YgdGhlIGludGVybmFsPGJyLz5cbiAqIGNhbnZhcyBzbyB0aGF0IGl0IGZpdHMgdGhlIGFzcGVjdCByYXRpbyBvZiB0aGUgZGV2aWNlPGJyLz5cbiAqIG5vIGRpc3RvcnRpb24gd2lsbCBvY2N1ciBob3dldmVyIHlvdSBtdXN0IG1ha2Ugc3VyZSB5b3VyIGFwcGxpY2F0aW9uIHdvcmtzIG9uIGRpZmZlcmVudDxici8+XG4gKiBhc3BlY3QgcmF0aW9zXG4gKiBAcHJvcGVydHkge051bWJlcn0gRklYRURfSEVJR0hUXG4gKiBAcmVhZG9ubHlcbiAqIEBzdGF0aWNcbiAqL1xuY2MuUmVzb2x1dGlvblBvbGljeS5GSVhFRF9IRUlHSFQgPSAzO1xuXG4vKipcbiAqIFRoZSBhcHBsaWNhdGlvbiB0YWtlcyB0aGUgd2lkdGggb2YgdGhlIGRlc2lnbiByZXNvbHV0aW9uIHNpemUgYW5kIG1vZGlmaWVzIHRoZSBoZWlnaHQgb2YgdGhlIGludGVybmFsPGJyLz5cbiAqIGNhbnZhcyBzbyB0aGF0IGl0IGZpdHMgdGhlIGFzcGVjdCByYXRpbyBvZiB0aGUgZGV2aWNlPGJyLz5cbiAqIG5vIGRpc3RvcnRpb24gd2lsbCBvY2N1ciBob3dldmVyIHlvdSBtdXN0IG1ha2Ugc3VyZSB5b3VyIGFwcGxpY2F0aW9uIHdvcmtzIG9uIGRpZmZlcmVudDxici8+XG4gKiBhc3BlY3QgcmF0aW9zXG4gKiBAcHJvcGVydHkge051bWJlcn0gRklYRURfV0lEVEhcbiAqIEByZWFkb25seVxuICogQHN0YXRpY1xuICovXG5jYy5SZXNvbHV0aW9uUG9saWN5LkZJWEVEX1dJRFRIID0gNDtcblxuLyoqXG4gKiBVbmtub3cgcG9saWN5XG4gKiBAcHJvcGVydHkge051bWJlcn0gVU5LTk9XTlxuICogQHJlYWRvbmx5XG4gKiBAc3RhdGljXG4gKi9cbmNjLlJlc29sdXRpb25Qb2xpY3kuVU5LTk9XTiA9IDU7XG5cbi8qKlxuICogQG1vZHVsZSBjY1xuICovXG5cbi8qKlxuICogISNlbiBjYy52aWV3IGlzIHRoZSBzaGFyZWQgdmlldyBvYmplY3QuXG4gKiAhI3poIGNjLnZpZXcg5piv5YWo5bGA55qE6KeG5Zu+5a+56LGh44CCXG4gKiBAcHJvcGVydHkgdmlld1xuICogQHN0YXRpY1xuICogQHR5cGUge1ZpZXd9XG4gKi9cbmNjLnZpZXcgPSBuZXcgVmlldygpO1xuXG4vKipcbiAqICEjZW4gY2Mud2luU2l6ZSBpcyB0aGUgYWxpYXMgb2JqZWN0IGZvciB0aGUgc2l6ZSBvZiB0aGUgY3VycmVudCBnYW1lIHdpbmRvdy5cbiAqICEjemggY2Mud2luU2l6ZSDkuLrlvZPliY3nmoTmuLjmiI/nqpflj6PnmoTlpKflsI/jgIJcbiAqIEBwcm9wZXJ0eSB3aW5TaXplXG4gKiBAdHlwZSBTaXplXG4gKi9cbmNjLndpblNpemUgPSBjYy5zaXplKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gY2MudmlldztcbiJdLCJzb3VyY2VSb290IjoiLyJ9