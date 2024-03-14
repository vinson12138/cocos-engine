
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCSys.js';
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
var settingPlatform;

if (!CC_EDITOR) {
  settingPlatform = window._CCSettings ? _CCSettings.platform : undefined;
}

var isVivoGame = settingPlatform === 'qgame';
var isOppoGame = settingPlatform === 'quickgame';
var isHuaweiGame = settingPlatform === 'huawei';
var isJKWGame = settingPlatform === 'jkw-game';
var isQttGame = settingPlatform === 'qtt-game';
var isLinkSure = settingPlatform === 'link-sure';

var _global = typeof window === 'undefined' ? global : window;

function initSys() {
  /**
   * System variables
   * @class sys
   * @main
   * @static
   */
  cc.sys = {};
  var sys = cc.sys;
  /**
   * English language code
   * @property {String} LANGUAGE_ENGLISH
   * @readOnly
   */

  sys.LANGUAGE_ENGLISH = "en";
  /**
   * Chinese language code
   * @property {String} LANGUAGE_CHINESE
   * @readOnly
   */

  sys.LANGUAGE_CHINESE = "zh";
  /**
   * French language code
   * @property {String} LANGUAGE_FRENCH
   * @readOnly
   */

  sys.LANGUAGE_FRENCH = "fr";
  /**
   * Italian language code
   * @property {String} LANGUAGE_ITALIAN
   * @readOnly
   */

  sys.LANGUAGE_ITALIAN = "it";
  /**
   * German language code
   * @property {String} LANGUAGE_GERMAN
   * @readOnly
   */

  sys.LANGUAGE_GERMAN = "de";
  /**
   * Spanish language code
   * @property {String} LANGUAGE_SPANISH
   * @readOnly
   */

  sys.LANGUAGE_SPANISH = "es";
  /**
   * Spanish language code
   * @property {String} LANGUAGE_DUTCH
   * @readOnly
   */

  sys.LANGUAGE_DUTCH = "du";
  /**
   * Russian language code
   * @property {String} LANGUAGE_RUSSIAN
   * @readOnly
   */

  sys.LANGUAGE_RUSSIAN = "ru";
  /**
   * Korean language code
   * @property {String} LANGUAGE_KOREAN
   * @readOnly
   */

  sys.LANGUAGE_KOREAN = "ko";
  /**
   * Japanese language code
   * @property {String} LANGUAGE_JAPANESE
   * @readOnly
   */

  sys.LANGUAGE_JAPANESE = "ja";
  /**
   * Hungarian language code
   * @property {String} LANGUAGE_HUNGARIAN
   * @readonly
   */

  sys.LANGUAGE_HUNGARIAN = "hu";
  /**
   * Portuguese language code
   * @property {String} LANGUAGE_PORTUGUESE
   * @readOnly
   */

  sys.LANGUAGE_PORTUGUESE = "pt";
  /**
   * Arabic language code
   * @property {String} LANGUAGE_ARABIC
   * @readOnly
   */

  sys.LANGUAGE_ARABIC = "ar";
  /**
   * Norwegian language code
   * @property {String} LANGUAGE_NORWEGIAN
   * @readOnly
   */

  sys.LANGUAGE_NORWEGIAN = "no";
  /**
   * Polish language code
   * @property {String} LANGUAGE_POLISH
   * @readOnly
   */

  sys.LANGUAGE_POLISH = "pl";
  /**
   * Turkish language code
   * @property {String} LANGUAGE_TURKISH
   * @readOnly
   */

  sys.LANGUAGE_TURKISH = "tr";
  /**
   * Ukrainian language code
   * @property {String} LANGUAGE_UKRAINIAN
   * @readOnly
   */

  sys.LANGUAGE_UKRAINIAN = "uk";
  /**
   * Romanian language code
   * @property {String} LANGUAGE_ROMANIAN
   * @readOnly
   */

  sys.LANGUAGE_ROMANIAN = "ro";
  /**
   * Bulgarian language code
   * @property {String} LANGUAGE_BULGARIAN
   * @readOnly
   */

  sys.LANGUAGE_BULGARIAN = "bg";
  /**
   * Unknown language code
   * @property {String} LANGUAGE_UNKNOWN
   * @readOnly
   */

  sys.LANGUAGE_UNKNOWN = "unknown";
  /**
   * @property {String} OS_IOS
   * @readOnly
   */

  sys.OS_IOS = "iOS";
  /**
   * @property {String} OS_ANDROID
   * @readOnly
   */

  sys.OS_ANDROID = "Android";
  /**
   * @property {String} OS_WINDOWS
   * @readOnly
   */

  sys.OS_WINDOWS = "Windows";
  /**
   * @property {String} OS_MARMALADE
   * @readOnly
   */

  sys.OS_MARMALADE = "Marmalade";
  /**
   * @property {String} OS_LINUX
   * @readOnly
   */

  sys.OS_LINUX = "Linux";
  /**
   * @property {String} OS_BADA
   * @readOnly
   */

  sys.OS_BADA = "Bada";
  /**
   * @property {String} OS_BLACKBERRY
   * @readOnly
   */

  sys.OS_BLACKBERRY = "Blackberry";
  /**
   * @property {String} OS_OSX
   * @readOnly
   */

  sys.OS_OSX = "OS X";
  /**
   * @property {String} OS_WP8
   * @readOnly
   */

  sys.OS_WP8 = "WP8";
  /**
   * @property {String} OS_WINRT
   * @readOnly
   */

  sys.OS_WINRT = "WINRT";
  /**
   * @property {String} OS_UNKNOWN
   * @readOnly
   */

  sys.OS_UNKNOWN = "Unknown";
  /**
   * @property {Number} UNKNOWN
   * @readOnly
   * @default -1
   */

  sys.UNKNOWN = -1;
  /**
   * @property {Number} WIN32
   * @readOnly
   * @default 0
   */

  sys.WIN32 = 0;
  /**
   * @property {Number} LINUX
   * @readOnly
   * @default 1
   */

  sys.LINUX = 1;
  /**
   * @property {Number} MACOS
   * @readOnly
   * @default 2
   */

  sys.MACOS = 2;
  /**
   * @property {Number} ANDROID
   * @readOnly
   * @default 3
   */

  sys.ANDROID = 3;
  /**
   * @property {Number} IPHONE
   * @readOnly
   * @default 4
   */

  sys.IPHONE = 4;
  /**
   * @property {Number} IPAD
   * @readOnly
   * @default 5
   */

  sys.IPAD = 5;
  /**
   * @property {Number} BLACKBERRY
   * @readOnly
   * @default 6
   */

  sys.BLACKBERRY = 6;
  /**
   * @property {Number} NACL
   * @readOnly
   * @default 7
   */

  sys.NACL = 7;
  /**
   * @property {Number} EMSCRIPTEN
   * @readOnly
   * @default 8
   */

  sys.EMSCRIPTEN = 8;
  /**
   * @property {Number} TIZEN
   * @readOnly
   * @default 9
   */

  sys.TIZEN = 9;
  /**
   * @property {Number} WINRT
   * @readOnly
   * @default 10
   */

  sys.WINRT = 10;
  /**
   * @property {Number} WP8
   * @readOnly
   * @default 11
   */

  sys.WP8 = 11;
  /**
   * @property {Number} MOBILE_BROWSER
   * @readOnly
   * @default 100
   */

  sys.MOBILE_BROWSER = 100;
  /**
   * @property {Number} DESKTOP_BROWSER
   * @readOnly
   * @default 101
   */

  sys.DESKTOP_BROWSER = 101;
  /**
   * Indicates whether executes in editor's window process (Electron's renderer context)
   * @property {Number} EDITOR_PAGE
   * @readOnly
   * @default 102
   */

  sys.EDITOR_PAGE = 102;
  /**
   * Indicates whether executes in editor's main process (Electron's browser context)
   * @property {Number} EDITOR_CORE
   * @readOnly
   * @default 103
   */

  sys.EDITOR_CORE = 103;
  /**
   * @property {Number} WECHAT_GAME
   * @readOnly
   * @default 104
   */

  sys.WECHAT_GAME = 104;
  /**
   * @property {Number} QQ_PLAY
   * @readOnly
   * @default 105
   */

  sys.QQ_PLAY = 105;
  /**
   * @property {Number} FB_PLAYABLE_ADS
   * @readOnly
   * @default 106
   */

  sys.FB_PLAYABLE_ADS = 106;
  /**
   * @property {Number} BAIDU_GAME
   * @readOnly
   * @default 107
   */

  sys.BAIDU_GAME = 107;
  /**
   * @property {Number} VIVO_GAME
   * @readOnly
   * @default 108
   */

  sys.VIVO_GAME = 108;
  /**
   * @property {Number} OPPO_GAME
   * @readOnly
   * @default 109
   */

  sys.OPPO_GAME = 109;
  /**
   * @property {Number} HUAWEI_GAME
   * @readOnly
   * @default 110
   */

  sys.HUAWEI_GAME = 110;
  /**
   * @property {Number} XIAOMI_GAME
   * @readOnly
   * @default 111
   */

  sys.XIAOMI_GAME = 111;
  /**
   * @property {Number} JKW_GAME
   * @readOnly
   * @default 112
   */

  sys.JKW_GAME = 112;
  /**
   * @property {Number} ALIPAY_GAME
   * @readOnly
   * @default 113
   */

  sys.ALIPAY_GAME = 113;
  /**
   * @property {Number} WECHAT_GAME_SUB
   * @readOnly
   * @default 114
   */

  sys.WECHAT_GAME_SUB = 114;
  /**
   * @property {Number} BAIDU_GAME_SUB
   * @readOnly
   * @default 115
   */

  sys.BAIDU_GAME_SUB = 115;
  /**
   * @property {Number} QTT_GAME
   * @readOnly
   * @default 116
   */

  sys.QTT_GAME = 116;
  /**
   * @property {Number} BYTEDANCE_GAME
   * @readOnly
   * @default 117
   */

  sys.BYTEDANCE_GAME = 117;
  /**
   * @property {Number} BYTEDANCE_GAME_SUB
   * @readOnly
   * @default 118
   */

  sys.BYTEDANCE_GAME_SUB = 118;
  /**
   * @property {Number} LINKSURE
   * @readOnly
   * @default 119
   */

  sys.LINKSURE = 119;
  /**
   * BROWSER_TYPE_WECHAT
   * @property {String} BROWSER_TYPE_WECHAT
   * @readOnly
   * @default "wechat"
   */

  sys.BROWSER_TYPE_WECHAT = "wechat";
  /**
   *
   * @property {String} BROWSER_TYPE_ANDROID
   * @readOnly
   * @default "androidbrowser"
   */

  sys.BROWSER_TYPE_ANDROID = "androidbrowser";
  /**
   *
   * @property {String} BROWSER_TYPE_IE
   * @readOnly
   * @default "ie"
   */

  sys.BROWSER_TYPE_IE = "ie";
  /**
   *
   * @property {String} BROWSER_TYPE_EDGE
   * @readOnly
   * @default "edge"
   */

  sys.BROWSER_TYPE_EDGE = "edge";
  /**
   *
   * @property {String} BROWSER_TYPE_QQ
   * @readOnly
   * @default "qqbrowser"
   */

  sys.BROWSER_TYPE_QQ = "qqbrowser";
  /**
   *
   * @property {String} BROWSER_TYPE_MOBILE_QQ
   * @readOnly
   * @default "mqqbrowser"
   */

  sys.BROWSER_TYPE_MOBILE_QQ = "mqqbrowser";
  /**
   *
   * @property {String} BROWSER_TYPE_UC
   * @readOnly
   * @default "ucbrowser"
   */

  sys.BROWSER_TYPE_UC = "ucbrowser";
  /**
   * uc third party integration.
   * @property {String} BROWSER_TYPE_UCBS
   * @readOnly
   * @default "ucbs"
   */

  sys.BROWSER_TYPE_UCBS = "ucbs";
  /**
   *
   * @property {String} BROWSER_TYPE_360
   * @readOnly
   * @default "360browser"
   */

  sys.BROWSER_TYPE_360 = "360browser";
  /**
   *
   * @property {String} BROWSER_TYPE_BAIDU_APP
   * @readOnly
   * @default "baiduboxapp"
   */

  sys.BROWSER_TYPE_BAIDU_APP = "baiduboxapp";
  /**
   *
   * @property {String} BROWSER_TYPE_BAIDU
   * @readOnly
   * @default "baidubrowser"
   */

  sys.BROWSER_TYPE_BAIDU = "baidubrowser";
  /**
   *
   * @property {String} BROWSER_TYPE_MAXTHON
   * @readOnly
   * @default "maxthon"
   */

  sys.BROWSER_TYPE_MAXTHON = "maxthon";
  /**
   *
   * @property {String} BROWSER_TYPE_OPERA
   * @readOnly
   * @default "opera"
   */

  sys.BROWSER_TYPE_OPERA = "opera";
  /**
   *
   * @property {String} BROWSER_TYPE_OUPENG
   * @readOnly
   * @default "oupeng"
   */

  sys.BROWSER_TYPE_OUPENG = "oupeng";
  /**
   *
   * @property {String} BROWSER_TYPE_MIUI
   * @readOnly
   * @default "miuibrowser"
   */

  sys.BROWSER_TYPE_MIUI = "miuibrowser";
  /**
   *
   * @property {String} BROWSER_TYPE_FIREFOX
   * @readOnly
   * @default "firefox"
   */

  sys.BROWSER_TYPE_FIREFOX = "firefox";
  /**
   *
   * @property {String} BROWSER_TYPE_SAFARI
   * @readOnly
   * @default "safari"
   */

  sys.BROWSER_TYPE_SAFARI = "safari";
  /**
   *
   * @property {String} BROWSER_TYPE_CHROME
   * @readOnly
   * @default "chrome"
   */

  sys.BROWSER_TYPE_CHROME = "chrome";
  /**
   *
   * @property {String} BROWSER_TYPE_LIEBAO
   * @readOnly
   * @default "liebao"
   */

  sys.BROWSER_TYPE_LIEBAO = "liebao";
  /**
   *
   * @property {String} BROWSER_TYPE_QZONE
   * @readOnly
   * @default "qzone"
   */

  sys.BROWSER_TYPE_QZONE = "qzone";
  /**
   *
   * @property {String} BROWSER_TYPE_SOUGOU
   * @readOnly
   * @default "sogou"
   */

  sys.BROWSER_TYPE_SOUGOU = "sogou";
  /**
   *
   * @property {String} BROWSER_TYPE_HUAWEI
   * @readOnly
   * @default "huawei"
   */

  sys.BROWSER_TYPE_HUAWEI = "huawei";
  /**
   *
   * @property {String} BROWSER_TYPE_UNKNOWN
   * @readOnly
   * @default "unknown"
   */

  sys.BROWSER_TYPE_UNKNOWN = "unknown";
  /**
   * Is native ? This is set to be true in jsb auto.
   * @property {Boolean} isNative
   */

  sys.isNative = CC_JSB || CC_RUNTIME;
  /**
   * Is web browser ?
   * @property {Boolean} isBrowser
   */

  sys.isBrowser = typeof window === 'object' && typeof document === 'object' && !CC_JSB && !CC_RUNTIME;
  /**
   * Is webgl extension support?
   * @method glExtension
   * @param name
   * @return {Boolean}
   */

  sys.glExtension = function (name) {
    return !!cc.renderer.device.ext(name);
  };
  /**
   * Get max joint matrix size for skinned mesh renderer.
   * @method getMaxJointMatrixSize
   */


  sys.getMaxJointMatrixSize = function () {
    if (!sys._maxJointMatrixSize) {
      var JOINT_MATRICES_SIZE = 50;
      var LEFT_UNIFORM_SIZE = 10;
      var gl = cc.game._renderContext;
      var maxUniforms = Math.floor(gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS) / 4) - LEFT_UNIFORM_SIZE;

      if (maxUniforms < JOINT_MATRICES_SIZE) {
        sys._maxJointMatrixSize = 0;
      } else {
        sys._maxJointMatrixSize = JOINT_MATRICES_SIZE;
      }
    }

    return sys._maxJointMatrixSize;
  };
  /**
   * !#en
   * Returns the safe area of the screen (in design resolution). If the screen is not notched, the visibleRect will be returned by default.
   * Currently supports Android, iOS and WeChat Mini Game platform.
   * !#zh
   * 返回手机屏幕安全区域（设计分辨率为单位），如果不是异形屏将默认返回 visibleRect。目前支持安卓、iOS 原生平台和微信小游戏平台。
   * @method getSafeAreaRect
   * @return {Rect}
  */


  sys.getSafeAreaRect = function () {
    var visibleSize = cc.view.getVisibleSize();
    return cc.rect(0, 0, visibleSize.width, visibleSize.height);
  };

  if (_global.__globalAdapter && _global.__globalAdapter.adaptSys) {
    // init sys info in adapter
    _global.__globalAdapter.adaptSys(sys);
  } else if (CC_EDITOR && Editor.isMainProcess) {
    sys.isMobile = false;
    sys.platform = sys.EDITOR_CORE;
    sys.language = sys.LANGUAGE_UNKNOWN;
    sys.languageCode = undefined;
    sys.os = {
      darwin: sys.OS_OSX,
      win32: sys.OS_WINDOWS,
      linux: sys.OS_LINUX
    }[process.platform] || sys.OS_UNKNOWN;
    sys.browserType = null;
    sys.browserVersion = null;
    sys.windowPixelResolution = {
      width: 0,
      height: 0
    };
    sys.capabilities = {
      'imageBitmap': false
    };
    sys.__audioSupport = {};
  } else if (CC_JSB || CC_RUNTIME) {
    var platform;

    if (isVivoGame) {
      platform = sys.VIVO_GAME;
    } else if (isOppoGame) {
      platform = sys.OPPO_GAME;
    } else if (isHuaweiGame) {
      platform = sys.HUAWEI_GAME;
    } else if (isJKWGame) {
      platform = sys.JKW_GAME;
    } else if (isQttGame) {
      platform = sys.QTT_GAME;
    } else if (isLinkSure) {
      platform = sys.LINKSURE;
    } else {
      platform = __getPlatform();
    }

    sys.platform = platform;
    sys.isMobile = platform === sys.ANDROID || platform === sys.IPAD || platform === sys.IPHONE || platform === sys.WP8 || platform === sys.TIZEN || platform === sys.BLACKBERRY || platform === sys.XIAOMI_GAME || isVivoGame || isOppoGame || isHuaweiGame || isJKWGame || isQttGame;
    sys.os = __getOS();
    sys.language = __getCurrentLanguage();
    var languageCode;

    if (CC_JSB) {
      languageCode = __getCurrentLanguageCode();
    }

    sys.languageCode = languageCode ? languageCode.toLowerCase() : undefined;
    sys.osVersion = __getOSVersion();
    sys.osMainVersion = parseInt(sys.osVersion);
    sys.browserType = null;
    sys.browserVersion = null;
    var w = window.innerWidth;
    var h = window.innerHeight;
    var ratio = window.devicePixelRatio || 1;
    sys.windowPixelResolution = {
      width: ratio * w,
      height: ratio * h
    };
    sys.localStorage = window.localStorage;
    var capabilities;
    capabilities = sys.capabilities = {
      "canvas": false,
      "opengl": true,
      "webp": true
    };

    if (sys.isMobile) {
      capabilities["accelerometer"] = true;
      capabilities["touches"] = true;
    } else {
      // desktop
      capabilities["keyboard"] = true;
      capabilities["mouse"] = true;
      capabilities["touches"] = false;
    }

    capabilities['imageBitmap'] = false;
    sys.__audioSupport = {
      ONLY_ONE: false,
      WEB_AUDIO: false,
      DELAY_CREATE_CTX: false,
      format: ['.mp3']
    };
  } else {
    // browser or runtime
    var win = window,
        nav = win.navigator,
        doc = document,
        docEle = doc.documentElement;
    var ua = nav.userAgent.toLowerCase();

    if (CC_EDITOR) {
      sys.isMobile = false;
      sys.platform = sys.EDITOR_PAGE;
    } else {
      /**
       * Indicate whether system is mobile system
       * @property {Boolean} isMobile
       */
      sys.isMobile = /mobile|android|iphone|ipad/.test(ua);
      /**
       * Indicate the running platform
       * @property {Number} platform
       */

      if (typeof FbPlayableAd !== "undefined") {
        sys.platform = sys.FB_PLAYABLE_ADS;
      } else {
        sys.platform = sys.isMobile ? sys.MOBILE_BROWSER : sys.DESKTOP_BROWSER;
      }
    }

    var currLanguage = nav.language;
    currLanguage = currLanguage ? currLanguage : nav.browserLanguage;
    /**
     * Get current language iso 639-1 code.
     * Examples of valid language codes include "zh-tw", "en", "en-us", "fr", "fr-fr", "es-es", etc.
     * The actual value totally depends on results provided by destination platform.
     * @property {String} languageCode
     */

    sys.languageCode = currLanguage.toLowerCase();
    currLanguage = currLanguage ? currLanguage.split("-")[0] : sys.LANGUAGE_ENGLISH;
    /**
     * Indicate the current language of the running system
     * @property {String} language
     */

    sys.language = currLanguage; // Get the os of system

    var isAndroid = false,
        iOS = false,
        osVersion = '',
        osMainVersion = 0;
    var uaResult = /android\s*(\d+(?:\.\d+)*)/i.exec(ua) || /android\s*(\d+(?:\.\d+)*)/i.exec(nav.platform);

    if (uaResult) {
      isAndroid = true;
      osVersion = uaResult[1] || '';
      osMainVersion = parseInt(osVersion) || 0;
    }

    uaResult = /(iPad|iPhone|iPod).*OS ((\d+_?){2,3})/i.exec(ua);

    if (uaResult) {
      iOS = true;
      osVersion = uaResult[2] || '';
      osMainVersion = parseInt(osVersion) || 0;
    } // refer to https://github.com/cocos-creator/engine/pull/5542 , thanks for contribition from @krapnikkk
    // ipad OS 13 safari identifies itself as "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko)" 
    // so use maxTouchPoints to check whether it's desktop safari or not. 
    // reference: https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
    // FIXME: should remove it when touch-enabled macs are available
    else if (/(iPhone|iPad|iPod)/.exec(nav.platform) || nav.platform === 'MacIntel' && nav.maxTouchPoints && nav.maxTouchPoints > 1) {
        iOS = true;
        osVersion = '';
        osMainVersion = 0;
      }

    var osName = sys.OS_UNKNOWN;
    if (nav.appVersion.indexOf("Win") !== -1) osName = sys.OS_WINDOWS;else if (iOS) osName = sys.OS_IOS;else if (nav.appVersion.indexOf("Mac") !== -1) osName = sys.OS_OSX;else if (nav.appVersion.indexOf("X11") !== -1 && nav.appVersion.indexOf("Linux") === -1) osName = sys.OS_UNIX;else if (isAndroid) osName = sys.OS_ANDROID;else if (nav.appVersion.indexOf("Linux") !== -1 || ua.indexOf("ubuntu") !== -1) osName = sys.OS_LINUX;
    /**
     * Indicate the running os name
     * @property {String} os
     */

    sys.os = osName;
    /**
     * Indicate the running os version
     * @property {String} osVersion
     */

    sys.osVersion = osVersion;
    /**
     * Indicate the running os main version
     * @property {Number} osMainVersion
     */

    sys.osMainVersion = osMainVersion;
    /**
     * Indicate the running browser type
     * @property {String | null} browserType
     */

    sys.browserType = sys.BROWSER_TYPE_UNKNOWN;
    /* Determine the browser type */

    (function () {
      var typeReg1 = /mqqbrowser|micromessenger|qqbrowser|sogou|qzone|liebao|maxthon|ucbs|360 aphone|360browser|baiduboxapp|baidubrowser|maxthon|mxbrowser|miuibrowser/i;
      var typeReg2 = /qq|ucbrowser|ubrowser|edge|HuaweiBrowser/i;
      var typeReg3 = /chrome|safari|firefox|trident|opera|opr\/|oupeng/i;
      var browserTypes = typeReg1.exec(ua) || typeReg2.exec(ua) || typeReg3.exec(ua);
      var browserType = browserTypes ? browserTypes[0].toLowerCase() : sys.BROWSER_TYPE_UNKNOWN;
      if (browserType === "safari" && isAndroid) browserType = sys.BROWSER_TYPE_ANDROID;else if (browserType === "qq" && ua.match(/android.*applewebkit/i)) browserType = sys.BROWSER_TYPE_ANDROID;
      var typeMap = {
        'micromessenger': sys.BROWSER_TYPE_WECHAT,
        'trident': sys.BROWSER_TYPE_IE,
        'edge': sys.BROWSER_TYPE_EDGE,
        '360 aphone': sys.BROWSER_TYPE_360,
        'mxbrowser': sys.BROWSER_TYPE_MAXTHON,
        'opr/': sys.BROWSER_TYPE_OPERA,
        'ubrowser': sys.BROWSER_TYPE_UC,
        'huaweibrowser': sys.BROWSER_TYPE_HUAWEI
      };

      if (browserType === "qqbrowser" || browserType === "mqqbrowser") {
        if (ua.match(/wechat|micromessenger/i)) {
          browserType = sys.BROWSER_TYPE_WECHAT;
        }
      }

      sys.browserType = typeMap[browserType] || browserType;
    })();
    /**
     * Indicate the running browser version
     * @property {String | null} browserVersion
     */


    sys.browserVersion = "";
    /* Determine the browser version number */

    (function () {
      var versionReg1 = /(mqqbrowser|micromessenger|qqbrowser|sogou|qzone|liebao|maxthon|uc|ucbs|360 aphone|360|baiduboxapp|baidu|maxthon|mxbrowser|miui(?:.hybrid)?)(mobile)?(browser)?\/?([\d.]+)/i;
      var versionReg2 = /(qq|chrome|safari|firefox|trident|opera|opr\/|oupeng)(mobile)?(browser)?\/?([\d.]+)/i;
      var tmp = ua.match(versionReg1);
      if (!tmp) tmp = ua.match(versionReg2);
      sys.browserVersion = tmp ? tmp[4] : "";
    })();

    var w = window.innerWidth || document.documentElement.clientWidth;
    var h = window.innerHeight || document.documentElement.clientHeight;
    var ratio = window.devicePixelRatio || 1;
    /**
     * Indicate the real pixel resolution of the whole game window
     * @property {Size} windowPixelResolution
     */

    sys.windowPixelResolution = {
      width: ratio * w,
      height: ratio * h
    };

    sys._checkWebGLRenderMode = function () {
      if (cc.game.renderType !== cc.game.RENDER_TYPE_WEBGL) throw new Error("This feature supports WebGL render mode only.");
    };

    var _tmpCanvas1 = document.createElement("canvas");

    var create3DContext = function create3DContext(canvas, opt_attribs, opt_contextType) {
      if (opt_contextType) {
        try {
          return canvas.getContext(opt_contextType, opt_attribs);
        } catch (e) {
          return null;
        }
      } else {
        return create3DContext(canvas, opt_attribs, "webgl") || create3DContext(canvas, opt_attribs, "experimental-webgl") || create3DContext(canvas, opt_attribs, "webkit-3d") || create3DContext(canvas, opt_attribs, "moz-webgl") || null;
      }
    };
    /**
     * cc.sys.localStorage is a local storage component.
     * @property {Object} localStorage
     */


    try {
      var localStorage = sys.localStorage = win.localStorage;
      localStorage.setItem("storage", "");
      localStorage.removeItem("storage");
      localStorage = null;
    } catch (e) {
      var warn = function warn() {
        cc.warnID(5200);
      };

      sys.localStorage = {
        getItem: warn,
        setItem: warn,
        removeItem: warn,
        clear: warn
      };
    }

    var _supportWebp = _tmpCanvas1.toDataURL('image/webp').startsWith('data:image/webp');

    var _supportCanvas = !!_tmpCanvas1.getContext("2d");

    var _supportWebGL = false;

    if (CC_TEST) {
      _supportWebGL = false;
    } else if (win.WebGLRenderingContext) {
      _supportWebGL = true;
    }
    /**
     * The capabilities of the current platform
     * @property {Object} capabilities
     */


    var capabilities = sys.capabilities = {
      "canvas": _supportCanvas,
      "opengl": _supportWebGL,
      "webp": _supportWebp,
      'imageBitmap': false
    };

    if (typeof createImageBitmap !== 'undefined' && typeof Blob !== 'undefined') {
      _tmpCanvas1.width = _tmpCanvas1.height = 2;
      createImageBitmap(_tmpCanvas1, {}).then(function (imageBitmap) {
        capabilities.imageBitmap = true;
        imageBitmap.close && imageBitmap.close();
      })["catch"](function (err) {});
    }

    if (docEle['ontouchstart'] !== undefined || doc['ontouchstart'] !== undefined || nav.msPointerEnabled) capabilities["touches"] = true;
    if (docEle['onmouseup'] !== undefined) capabilities["mouse"] = true;
    if (docEle['onkeyup'] !== undefined) capabilities["keyboard"] = true;
    if (win.DeviceMotionEvent || win.DeviceOrientationEvent) capabilities["accelerometer"] = true;

    var __audioSupport;
    /**
     * Audio support in the browser
     *
     * MULTI_CHANNEL        : Multiple audio while playing - If it doesn't, you can only play background music
     * WEB_AUDIO            : Support for WebAudio - Support W3C WebAudio standards, all of the audio can be played
     * AUTOPLAY             : Supports auto-play audio - if Don‘t support it, On a touch detecting background music canvas, and then replay
     * REPLAY_AFTER_TOUCH   : The first music will fail, must be replay after touchstart
     * USE_EMPTIED_EVENT    : Whether to use the emptied event to replace load callback
     * DELAY_CREATE_CTX     : delay created the context object - only webAudio
     * NEED_MANUAL_LOOP     : loop attribute failure, need to perform loop manually
     *
     * May be modifications for a few browser version
     */


    (function () {
      var DEBUG = false;
      var version = sys.browserVersion; // check if browser supports Web Audio
      // check Web Audio's context

      var supportWebAudio = !!(window.AudioContext || window.webkitAudioContext || window.mozAudioContext);
      __audioSupport = {
        ONLY_ONE: false,
        WEB_AUDIO: supportWebAudio,
        DELAY_CREATE_CTX: false
      };

      if (sys.os === sys.OS_IOS) {
        // IOS no event that used to parse completed callback
        // this time is not complete, can not play
        //
        __audioSupport.USE_LOADER_EVENT = 'loadedmetadata';
      }

      if (sys.browserType === sys.BROWSER_TYPE_FIREFOX) {
        __audioSupport.DELAY_CREATE_CTX = true;
        __audioSupport.USE_LOADER_EVENT = 'canplay';
      }

      if (sys.os === sys.OS_ANDROID) {
        if (sys.browserType === sys.BROWSER_TYPE_UC) {
          __audioSupport.ONE_SOURCE = true;
        }
      }

      if (DEBUG) {
        setTimeout(function () {
          cc.log('browse type: ' + sys.browserType);
          cc.log('browse version: ' + version);
          cc.log('MULTI_CHANNEL: ' + __audioSupport.MULTI_CHANNEL);
          cc.log('WEB_AUDIO: ' + __audioSupport.WEB_AUDIO);
          cc.log('AUTOPLAY: ' + __audioSupport.AUTOPLAY);
        }, 0);
      }
    })();

    try {
      if (__audioSupport.WEB_AUDIO) {
        __audioSupport.context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();

        if (__audioSupport.DELAY_CREATE_CTX) {
          setTimeout(function () {
            __audioSupport.context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();
          }, 0);
        }
      }
    } catch (error) {
      __audioSupport.WEB_AUDIO = false;
      cc.logID(5201);
    }

    var formatSupport = [];

    (function () {
      var audio = document.createElement('audio');

      if (audio.canPlayType) {
        var ogg = audio.canPlayType('audio/ogg; codecs="vorbis"');
        if (ogg) formatSupport.push('.ogg');
        var mp3 = audio.canPlayType('audio/mpeg');
        if (mp3) formatSupport.push('.mp3');
        var wav = audio.canPlayType('audio/wav; codecs="1"');
        if (wav) formatSupport.push('.wav');
        var mp4 = audio.canPlayType('audio/mp4');
        if (mp4) formatSupport.push('.mp4');
        var m4a = audio.canPlayType('audio/x-m4a');
        if (m4a) formatSupport.push('.m4a');
      }
    })();

    __audioSupport.format = formatSupport;
    sys.__audioSupport = __audioSupport;
  }
  /**
   * !#en
   * Network type enumeration
   * !#zh
   * 网络类型枚举
   *
   * @enum sys.NetworkType
   */


  sys.NetworkType = {
    /**
     * !#en
     * Network is unreachable.
     * !#zh
     * 网络不通
     *
     * @property {Number} NONE
     */
    NONE: 0,

    /**
     * !#en
     * Network is reachable via WiFi or cable.
     * !#zh
     * 通过无线或者有线本地网络连接因特网
     *
     * @property {Number} LAN
     */
    LAN: 1,

    /**
     * !#en
     * Network is reachable via Wireless Wide Area Network
     * !#zh
     * 通过蜂窝移动网络连接因特网
     *
     * @property {Number} WWAN
     */
    WWAN: 2
  };
  /**
   * @class sys
   */

  /**
   * !#en
   * Get the network type of current device, return cc.sys.NetworkType.LAN if failure.
   * !#zh
   * 获取当前设备的网络类型, 如果网络类型无法获取，默认将返回 cc.sys.NetworkType.LAN
   *
   * @method getNetworkType
   * @return {sys.NetworkType}
   */

  sys.getNetworkType = function () {
    // TODO: need to implement this for mobile phones.
    return sys.NetworkType.LAN;
  };
  /**
   * !#en
   * Get the battery level of current device, return 1.0 if failure.
   * !#zh
   * 获取当前设备的电池电量，如果电量无法获取，默认将返回 1
   *
   * @method getBatteryLevel
   * @return {Number} - 0.0 ~ 1.0
   */


  sys.getBatteryLevel = function () {
    // TODO: need to implement this for mobile phones.
    return 1.0;
  };
  /**
   * Forces the garbage collection, only available in JSB
   * @method garbageCollect
   */


  sys.garbageCollect = function () {// N/A in web
  };
  /**
   * Restart the JS VM, only available in JSB
   * @method restartVM
   */


  sys.restartVM = function () {// N/A in web
  };
  /**
   * Check whether an object is valid,
   * In web engine, it will return true if the object exist
   * In native engine, it will return true if the JS object and the correspond native object are both valid
   * @method isObjectValid
   * @param {Object} obj
   * @return {Boolean} Validity of the object
   */


  sys.isObjectValid = function (obj) {
    if (obj) {
      return true;
    }

    return false;
  };
  /**
   * Dump system informations
   * @method dump
   */


  sys.dump = function () {
    var self = this;
    var str = "";
    str += "isMobile : " + self.isMobile + "\r\n";
    str += "language : " + self.language + "\r\n";
    str += "browserType : " + self.browserType + "\r\n";
    str += "browserVersion : " + self.browserVersion + "\r\n";
    str += "capabilities : " + JSON.stringify(self.capabilities) + "\r\n";
    str += "os : " + self.os + "\r\n";
    str += "osVersion : " + self.osVersion + "\r\n";
    str += "platform : " + self.platform + "\r\n";
    str += "Using " + (cc.game.renderType === cc.game.RENDER_TYPE_WEBGL ? "WEBGL" : "CANVAS") + " renderer." + "\r\n";
    cc.log(str);
  };
  /**
   * Open a url in browser
   * @method openURL
   * @param {String} url
   */


  sys.openURL = function (url) {
    if (CC_JSB || CC_RUNTIME) {
      jsb.openURL(url);
    } else {
      window.open(url);
    }
  };
  /**
   * Get the number of milliseconds elapsed since 1 January 1970 00:00:00 UTC.
   * @method now
   * @return {Number}
   */


  sys.now = function () {
    if (Date.now) {
      return Date.now();
    } else {
      return +new Date();
    }
  };

  return sys;
}

var sys = cc && cc.sys ? cc.sys : initSys();
module.exports = sys;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BsYXRmb3JtL0NDU3lzLmpzIl0sIm5hbWVzIjpbInNldHRpbmdQbGF0Zm9ybSIsIkNDX0VESVRPUiIsIndpbmRvdyIsIl9DQ1NldHRpbmdzIiwicGxhdGZvcm0iLCJ1bmRlZmluZWQiLCJpc1Zpdm9HYW1lIiwiaXNPcHBvR2FtZSIsImlzSHVhd2VpR2FtZSIsImlzSktXR2FtZSIsImlzUXR0R2FtZSIsImlzTGlua1N1cmUiLCJfZ2xvYmFsIiwiZ2xvYmFsIiwiaW5pdFN5cyIsImNjIiwic3lzIiwiTEFOR1VBR0VfRU5HTElTSCIsIkxBTkdVQUdFX0NISU5FU0UiLCJMQU5HVUFHRV9GUkVOQ0giLCJMQU5HVUFHRV9JVEFMSUFOIiwiTEFOR1VBR0VfR0VSTUFOIiwiTEFOR1VBR0VfU1BBTklTSCIsIkxBTkdVQUdFX0RVVENIIiwiTEFOR1VBR0VfUlVTU0lBTiIsIkxBTkdVQUdFX0tPUkVBTiIsIkxBTkdVQUdFX0pBUEFORVNFIiwiTEFOR1VBR0VfSFVOR0FSSUFOIiwiTEFOR1VBR0VfUE9SVFVHVUVTRSIsIkxBTkdVQUdFX0FSQUJJQyIsIkxBTkdVQUdFX05PUldFR0lBTiIsIkxBTkdVQUdFX1BPTElTSCIsIkxBTkdVQUdFX1RVUktJU0giLCJMQU5HVUFHRV9VS1JBSU5JQU4iLCJMQU5HVUFHRV9ST01BTklBTiIsIkxBTkdVQUdFX0JVTEdBUklBTiIsIkxBTkdVQUdFX1VOS05PV04iLCJPU19JT1MiLCJPU19BTkRST0lEIiwiT1NfV0lORE9XUyIsIk9TX01BUk1BTEFERSIsIk9TX0xJTlVYIiwiT1NfQkFEQSIsIk9TX0JMQUNLQkVSUlkiLCJPU19PU1giLCJPU19XUDgiLCJPU19XSU5SVCIsIk9TX1VOS05PV04iLCJVTktOT1dOIiwiV0lOMzIiLCJMSU5VWCIsIk1BQ09TIiwiQU5EUk9JRCIsIklQSE9ORSIsIklQQUQiLCJCTEFDS0JFUlJZIiwiTkFDTCIsIkVNU0NSSVBURU4iLCJUSVpFTiIsIldJTlJUIiwiV1A4IiwiTU9CSUxFX0JST1dTRVIiLCJERVNLVE9QX0JST1dTRVIiLCJFRElUT1JfUEFHRSIsIkVESVRPUl9DT1JFIiwiV0VDSEFUX0dBTUUiLCJRUV9QTEFZIiwiRkJfUExBWUFCTEVfQURTIiwiQkFJRFVfR0FNRSIsIlZJVk9fR0FNRSIsIk9QUE9fR0FNRSIsIkhVQVdFSV9HQU1FIiwiWElBT01JX0dBTUUiLCJKS1dfR0FNRSIsIkFMSVBBWV9HQU1FIiwiV0VDSEFUX0dBTUVfU1VCIiwiQkFJRFVfR0FNRV9TVUIiLCJRVFRfR0FNRSIsIkJZVEVEQU5DRV9HQU1FIiwiQllURURBTkNFX0dBTUVfU1VCIiwiTElOS1NVUkUiLCJCUk9XU0VSX1RZUEVfV0VDSEFUIiwiQlJPV1NFUl9UWVBFX0FORFJPSUQiLCJCUk9XU0VSX1RZUEVfSUUiLCJCUk9XU0VSX1RZUEVfRURHRSIsIkJST1dTRVJfVFlQRV9RUSIsIkJST1dTRVJfVFlQRV9NT0JJTEVfUVEiLCJCUk9XU0VSX1RZUEVfVUMiLCJCUk9XU0VSX1RZUEVfVUNCUyIsIkJST1dTRVJfVFlQRV8zNjAiLCJCUk9XU0VSX1RZUEVfQkFJRFVfQVBQIiwiQlJPV1NFUl9UWVBFX0JBSURVIiwiQlJPV1NFUl9UWVBFX01BWFRIT04iLCJCUk9XU0VSX1RZUEVfT1BFUkEiLCJCUk9XU0VSX1RZUEVfT1VQRU5HIiwiQlJPV1NFUl9UWVBFX01JVUkiLCJCUk9XU0VSX1RZUEVfRklSRUZPWCIsIkJST1dTRVJfVFlQRV9TQUZBUkkiLCJCUk9XU0VSX1RZUEVfQ0hST01FIiwiQlJPV1NFUl9UWVBFX0xJRUJBTyIsIkJST1dTRVJfVFlQRV9RWk9ORSIsIkJST1dTRVJfVFlQRV9TT1VHT1UiLCJCUk9XU0VSX1RZUEVfSFVBV0VJIiwiQlJPV1NFUl9UWVBFX1VOS05PV04iLCJpc05hdGl2ZSIsIkNDX0pTQiIsIkNDX1JVTlRJTUUiLCJpc0Jyb3dzZXIiLCJkb2N1bWVudCIsImdsRXh0ZW5zaW9uIiwibmFtZSIsInJlbmRlcmVyIiwiZGV2aWNlIiwiZXh0IiwiZ2V0TWF4Sm9pbnRNYXRyaXhTaXplIiwiX21heEpvaW50TWF0cml4U2l6ZSIsIkpPSU5UX01BVFJJQ0VTX1NJWkUiLCJMRUZUX1VOSUZPUk1fU0laRSIsImdsIiwiZ2FtZSIsIl9yZW5kZXJDb250ZXh0IiwibWF4VW5pZm9ybXMiLCJNYXRoIiwiZmxvb3IiLCJnZXRQYXJhbWV0ZXIiLCJNQVhfVkVSVEVYX1VOSUZPUk1fVkVDVE9SUyIsImdldFNhZmVBcmVhUmVjdCIsInZpc2libGVTaXplIiwidmlldyIsImdldFZpc2libGVTaXplIiwicmVjdCIsIndpZHRoIiwiaGVpZ2h0IiwiX19nbG9iYWxBZGFwdGVyIiwiYWRhcHRTeXMiLCJFZGl0b3IiLCJpc01haW5Qcm9jZXNzIiwiaXNNb2JpbGUiLCJsYW5ndWFnZSIsImxhbmd1YWdlQ29kZSIsIm9zIiwiZGFyd2luIiwid2luMzIiLCJsaW51eCIsInByb2Nlc3MiLCJicm93c2VyVHlwZSIsImJyb3dzZXJWZXJzaW9uIiwid2luZG93UGl4ZWxSZXNvbHV0aW9uIiwiY2FwYWJpbGl0aWVzIiwiX19hdWRpb1N1cHBvcnQiLCJfX2dldFBsYXRmb3JtIiwiX19nZXRPUyIsIl9fZ2V0Q3VycmVudExhbmd1YWdlIiwiX19nZXRDdXJyZW50TGFuZ3VhZ2VDb2RlIiwidG9Mb3dlckNhc2UiLCJvc1ZlcnNpb24iLCJfX2dldE9TVmVyc2lvbiIsIm9zTWFpblZlcnNpb24iLCJwYXJzZUludCIsInciLCJpbm5lcldpZHRoIiwiaCIsImlubmVySGVpZ2h0IiwicmF0aW8iLCJkZXZpY2VQaXhlbFJhdGlvIiwibG9jYWxTdG9yYWdlIiwiT05MWV9PTkUiLCJXRUJfQVVESU8iLCJERUxBWV9DUkVBVEVfQ1RYIiwiZm9ybWF0Iiwid2luIiwibmF2IiwibmF2aWdhdG9yIiwiZG9jIiwiZG9jRWxlIiwiZG9jdW1lbnRFbGVtZW50IiwidWEiLCJ1c2VyQWdlbnQiLCJ0ZXN0IiwiRmJQbGF5YWJsZUFkIiwiY3Vyckxhbmd1YWdlIiwiYnJvd3Nlckxhbmd1YWdlIiwic3BsaXQiLCJpc0FuZHJvaWQiLCJpT1MiLCJ1YVJlc3VsdCIsImV4ZWMiLCJtYXhUb3VjaFBvaW50cyIsIm9zTmFtZSIsImFwcFZlcnNpb24iLCJpbmRleE9mIiwiT1NfVU5JWCIsInR5cGVSZWcxIiwidHlwZVJlZzIiLCJ0eXBlUmVnMyIsImJyb3dzZXJUeXBlcyIsIm1hdGNoIiwidHlwZU1hcCIsInZlcnNpb25SZWcxIiwidmVyc2lvblJlZzIiLCJ0bXAiLCJjbGllbnRXaWR0aCIsImNsaWVudEhlaWdodCIsIl9jaGVja1dlYkdMUmVuZGVyTW9kZSIsInJlbmRlclR5cGUiLCJSRU5ERVJfVFlQRV9XRUJHTCIsIkVycm9yIiwiX3RtcENhbnZhczEiLCJjcmVhdGVFbGVtZW50IiwiY3JlYXRlM0RDb250ZXh0IiwiY2FudmFzIiwib3B0X2F0dHJpYnMiLCJvcHRfY29udGV4dFR5cGUiLCJnZXRDb250ZXh0IiwiZSIsInNldEl0ZW0iLCJyZW1vdmVJdGVtIiwid2FybiIsIndhcm5JRCIsImdldEl0ZW0iLCJjbGVhciIsIl9zdXBwb3J0V2VicCIsInRvRGF0YVVSTCIsInN0YXJ0c1dpdGgiLCJfc3VwcG9ydENhbnZhcyIsIl9zdXBwb3J0V2ViR0wiLCJDQ19URVNUIiwiV2ViR0xSZW5kZXJpbmdDb250ZXh0IiwiY3JlYXRlSW1hZ2VCaXRtYXAiLCJCbG9iIiwidGhlbiIsImltYWdlQml0bWFwIiwiY2xvc2UiLCJlcnIiLCJtc1BvaW50ZXJFbmFibGVkIiwiRGV2aWNlTW90aW9uRXZlbnQiLCJEZXZpY2VPcmllbnRhdGlvbkV2ZW50IiwiREVCVUciLCJ2ZXJzaW9uIiwic3VwcG9ydFdlYkF1ZGlvIiwiQXVkaW9Db250ZXh0Iiwid2Via2l0QXVkaW9Db250ZXh0IiwibW96QXVkaW9Db250ZXh0IiwiVVNFX0xPQURFUl9FVkVOVCIsIk9ORV9TT1VSQ0UiLCJzZXRUaW1lb3V0IiwibG9nIiwiTVVMVElfQ0hBTk5FTCIsIkFVVE9QTEFZIiwiY29udGV4dCIsImVycm9yIiwibG9nSUQiLCJmb3JtYXRTdXBwb3J0IiwiYXVkaW8iLCJjYW5QbGF5VHlwZSIsIm9nZyIsInB1c2giLCJtcDMiLCJ3YXYiLCJtcDQiLCJtNGEiLCJOZXR3b3JrVHlwZSIsIk5PTkUiLCJMQU4iLCJXV0FOIiwiZ2V0TmV0d29ya1R5cGUiLCJnZXRCYXR0ZXJ5TGV2ZWwiLCJnYXJiYWdlQ29sbGVjdCIsInJlc3RhcnRWTSIsImlzT2JqZWN0VmFsaWQiLCJvYmoiLCJkdW1wIiwic2VsZiIsInN0ciIsIkpTT04iLCJzdHJpbmdpZnkiLCJvcGVuVVJMIiwidXJsIiwianNiIiwib3BlbiIsIm5vdyIsIkRhdGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFJQSxlQUFKOztBQUNDLElBQUksQ0FBQ0MsU0FBTCxFQUFnQjtBQUNiRCxFQUFBQSxlQUFlLEdBQUdFLE1BQU0sQ0FBQ0MsV0FBUCxHQUFxQkEsV0FBVyxDQUFDQyxRQUFqQyxHQUEyQ0MsU0FBN0Q7QUFDRjs7QUFDRixJQUFNQyxVQUFVLEdBQUlOLGVBQWUsS0FBSyxPQUF4QztBQUNBLElBQU1PLFVBQVUsR0FBSVAsZUFBZSxLQUFLLFdBQXhDO0FBQ0EsSUFBTVEsWUFBWSxHQUFJUixlQUFlLEtBQUssUUFBMUM7QUFDQSxJQUFNUyxTQUFTLEdBQUlULGVBQWUsS0FBSyxVQUF2QztBQUNBLElBQU1VLFNBQVMsR0FBSVYsZUFBZSxLQUFLLFVBQXZDO0FBQ0EsSUFBTVcsVUFBVSxHQUFJWCxlQUFlLEtBQUssV0FBeEM7O0FBRUEsSUFBTVksT0FBTyxHQUFHLE9BQU9WLE1BQVAsS0FBa0IsV0FBbEIsR0FBZ0NXLE1BQWhDLEdBQXlDWCxNQUF6RDs7QUFFQSxTQUFTWSxPQUFULEdBQW9CO0FBQ2hCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJQyxFQUFB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TUFBdkM7QUFDQTZRLElBQUFBLEdBQUcsSUFBSSxZQUFZbFEsRUFBRSxDQUFDd0csSUFBSCxDQUFRcUYsVUFBUixLQUF1QjdMLEVBQUUsQ0FBQ3dHLElBQUgsQ0FBUXNGLGlCQUEvQixHQUFtRCxPQUFuRCxHQUE2RCxRQUF6RSxJQUFxRixZQUFyRixHQUFvRyxNQUEzRztBQUNBOUwsSUFBQUEsRUFBRSxDQUFDdU8sR0FBSCxDQUFPMkIsR0FBUDtBQUNILEdBYkQ7QUFlQTtBQUNKO0FBQ0E7QUFDQTtBQUNBOzs7QUFDSWpRLEVBQUFBLEdBQUcsQ0FBQ29RLE9BQUosR0FBYyxVQUFVQyxHQUFWLEVBQWU7QUFDekIsUUFBSTVLLE1BQU0sSUFBSUMsVUFBZCxFQUEwQjtBQUN0QjRLLE1BQUFBLEdBQUcsQ0FBQ0YsT0FBSixDQUFZQyxHQUFaO0FBQ0gsS0FGRCxNQUdLO0FBQ0RuUixNQUFBQSxNQUFNLENBQUNxUixJQUFQLENBQVlGLEdBQVo7QUFDSDtBQUNKLEdBUEQ7QUFTQTtBQUNKO0FBQ0E7QUFDQTtBQUNBOzs7QUFDSXJRLEVBQUFBLEdBQUcsQ0FBQ3dRLEdBQUosR0FBVSxZQUFZO0FBQ2xCLFFBQUlDLElBQUksQ0FBQ0QsR0FBVCxFQUFjO0FBQ1YsYUFBT0MsSUFBSSxDQUFDRCxHQUFMLEVBQVA7QUFDSCxLQUZELE1BR0s7QUFDRCxhQUFPLENBQUUsSUFBSUMsSUFBSixFQUFUO0FBQ0g7QUFDSixHQVBEOztBQVNBLFNBQU96USxHQUFQO0FBQ0g7O0FBRUQsSUFBSUEsR0FBRyxHQUFHRCxFQUFFLElBQUlBLEVBQUUsQ0FBQ0MsR0FBVCxHQUFlRCxFQUFFLENBQUNDLEdBQWxCLEdBQXdCRixPQUFPLEVBQXpDO0FBRUE0USxNQUFNLENBQUNDLE9BQVAsR0FBaUIzUSxHQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxubGV0IHNldHRpbmdQbGF0Zm9ybTtcbiBpZiAoIUNDX0VESVRPUikge1xuICAgIHNldHRpbmdQbGF0Zm9ybSA9IHdpbmRvdy5fQ0NTZXR0aW5ncyA/IF9DQ1NldHRpbmdzLnBsYXRmb3JtOiB1bmRlZmluZWQ7XG4gfVxuY29uc3QgaXNWaXZvR2FtZSA9IChzZXR0aW5nUGxhdGZvcm0gPT09ICdxZ2FtZScpO1xuY29uc3QgaXNPcHBvR2FtZSA9IChzZXR0aW5nUGxhdGZvcm0gPT09ICdxdWlja2dhbWUnKTtcbmNvbnN0IGlzSHVhd2VpR2FtZSA9IChzZXR0aW5nUGxhdGZvcm0gPT09ICdodWF3ZWknKTtcbmNvbnN0IGlzSktXR2FtZSA9IChzZXR0aW5nUGxhdGZvcm0gPT09ICdqa3ctZ2FtZScpO1xuY29uc3QgaXNRdHRHYW1lID0gKHNldHRpbmdQbGF0Zm9ybSA9PT0gJ3F0dC1nYW1lJyk7XG5jb25zdCBpc0xpbmtTdXJlID0gKHNldHRpbmdQbGF0Zm9ybSA9PT0gJ2xpbmstc3VyZScpO1xuXG5jb25zdCBfZ2xvYmFsID0gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB3aW5kb3c7XG4gXG5mdW5jdGlvbiBpbml0U3lzICgpIHtcbiAgICAvKipcbiAgICAgKiBTeXN0ZW0gdmFyaWFibGVzXG4gICAgICogQGNsYXNzIHN5c1xuICAgICAqIEBtYWluXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIGNjLnN5cyA9IHt9O1xuICAgIHZhciBzeXMgPSBjYy5zeXM7XG5cbiAgICAvKipcbiAgICAgKiBFbmdsaXNoIGxhbmd1YWdlIGNvZGVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gTEFOR1VBR0VfRU5HTElTSFxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5MQU5HVUFHRV9FTkdMSVNIID0gXCJlblwiO1xuXG4gICAgLyoqXG4gICAgICogQ2hpbmVzZSBsYW5ndWFnZSBjb2RlXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IExBTkdVQUdFX0NISU5FU0VcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuTEFOR1VBR0VfQ0hJTkVTRSA9IFwiemhcIjtcblxuICAgIC8qKlxuICAgICAqIEZyZW5jaCBsYW5ndWFnZSBjb2RlXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IExBTkdVQUdFX0ZSRU5DSFxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5MQU5HVUFHRV9GUkVOQ0ggPSBcImZyXCI7XG5cbiAgICAvKipcbiAgICAgKiBJdGFsaWFuIGxhbmd1YWdlIGNvZGVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gTEFOR1VBR0VfSVRBTElBTlxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5MQU5HVUFHRV9JVEFMSUFOID0gXCJpdFwiO1xuXG4gICAgLyoqXG4gICAgICogR2VybWFuIGxhbmd1YWdlIGNvZGVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gTEFOR1VBR0VfR0VSTUFOXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLkxBTkdVQUdFX0dFUk1BTiA9IFwiZGVcIjtcblxuICAgIC8qKlxuICAgICAqIFNwYW5pc2ggbGFuZ3VhZ2UgY29kZVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMQU5HVUFHRV9TUEFOSVNIXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLkxBTkdVQUdFX1NQQU5JU0ggPSBcImVzXCI7XG5cbiAgICAvKipcbiAgICAgKiBTcGFuaXNoIGxhbmd1YWdlIGNvZGVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gTEFOR1VBR0VfRFVUQ0hcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuTEFOR1VBR0VfRFVUQ0ggPSBcImR1XCI7XG5cbiAgICAvKipcbiAgICAgKiBSdXNzaWFuIGxhbmd1YWdlIGNvZGVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gTEFOR1VBR0VfUlVTU0lBTlxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5MQU5HVUFHRV9SVVNTSUFOID0gXCJydVwiO1xuXG4gICAgLyoqXG4gICAgICogS29yZWFuIGxhbmd1YWdlIGNvZGVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gTEFOR1VBR0VfS09SRUFOXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLkxBTkdVQUdFX0tPUkVBTiA9IFwia29cIjtcblxuICAgIC8qKlxuICAgICAqIEphcGFuZXNlIGxhbmd1YWdlIGNvZGVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gTEFOR1VBR0VfSkFQQU5FU0VcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuTEFOR1VBR0VfSkFQQU5FU0UgPSBcImphXCI7XG5cbiAgICAvKipcbiAgICAgKiBIdW5nYXJpYW4gbGFuZ3VhZ2UgY29kZVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMQU5HVUFHRV9IVU5HQVJJQU5cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBzeXMuTEFOR1VBR0VfSFVOR0FSSUFOID0gXCJodVwiO1xuXG4gICAgLyoqXG4gICAgICogUG9ydHVndWVzZSBsYW5ndWFnZSBjb2RlXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IExBTkdVQUdFX1BPUlRVR1VFU0VcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuTEFOR1VBR0VfUE9SVFVHVUVTRSA9IFwicHRcIjtcblxuICAgIC8qKlxuICAgICAqIEFyYWJpYyBsYW5ndWFnZSBjb2RlXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IExBTkdVQUdFX0FSQUJJQ1xuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5MQU5HVUFHRV9BUkFCSUMgPSBcImFyXCI7XG5cbiAgICAvKipcbiAgICAgKiBOb3J3ZWdpYW4gbGFuZ3VhZ2UgY29kZVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMQU5HVUFHRV9OT1JXRUdJQU5cbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuTEFOR1VBR0VfTk9SV0VHSUFOID0gXCJub1wiO1xuXG4gICAgLyoqXG4gICAgICogUG9saXNoIGxhbmd1YWdlIGNvZGVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gTEFOR1VBR0VfUE9MSVNIXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLkxBTkdVQUdFX1BPTElTSCA9IFwicGxcIjtcblxuICAgIC8qKlxuICAgICAqIFR1cmtpc2ggbGFuZ3VhZ2UgY29kZVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMQU5HVUFHRV9UVVJLSVNIXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLkxBTkdVQUdFX1RVUktJU0ggPSBcInRyXCI7XG5cbiAgICAvKipcbiAgICAgKiBVa3JhaW5pYW4gbGFuZ3VhZ2UgY29kZVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMQU5HVUFHRV9VS1JBSU5JQU5cbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuTEFOR1VBR0VfVUtSQUlOSUFOID0gXCJ1a1wiO1xuXG4gICAgLyoqXG4gICAgICogUm9tYW5pYW4gbGFuZ3VhZ2UgY29kZVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMQU5HVUFHRV9ST01BTklBTlxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5MQU5HVUFHRV9ST01BTklBTiA9IFwicm9cIjtcblxuICAgIC8qKlxuICAgICAqIEJ1bGdhcmlhbiBsYW5ndWFnZSBjb2RlXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IExBTkdVQUdFX0JVTEdBUklBTlxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5MQU5HVUFHRV9CVUxHQVJJQU4gPSBcImJnXCI7XG5cbiAgICAvKipcbiAgICAgKiBVbmtub3duIGxhbmd1YWdlIGNvZGVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gTEFOR1VBR0VfVU5LTk9XTlxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5MQU5HVUFHRV9VTktOT1dOID0gXCJ1bmtub3duXCI7XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gT1NfSU9TXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLk9TX0lPUyA9IFwiaU9TXCI7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IE9TX0FORFJPSURcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuT1NfQU5EUk9JRCA9IFwiQW5kcm9pZFwiO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBPU19XSU5ET1dTXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLk9TX1dJTkRPV1MgPSBcIldpbmRvd3NcIjtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gT1NfTUFSTUFMQURFXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLk9TX01BUk1BTEFERSA9IFwiTWFybWFsYWRlXCI7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IE9TX0xJTlVYXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLk9TX0xJTlVYID0gXCJMaW51eFwiO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBPU19CQURBXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLk9TX0JBREEgPSBcIkJhZGFcIjtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gT1NfQkxBQ0tCRVJSWVxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5PU19CTEFDS0JFUlJZID0gXCJCbGFja2JlcnJ5XCI7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IE9TX09TWFxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5PU19PU1ggPSBcIk9TIFhcIjtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gT1NfV1A4XG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLk9TX1dQOCA9IFwiV1A4XCI7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IE9TX1dJTlJUXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLk9TX1dJTlJUID0gXCJXSU5SVFwiO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBPU19VTktOT1dOXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLk9TX1VOS05PV04gPSBcIlVua25vd25cIjtcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBVTktOT1dOXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgLTFcbiAgICAgKi9cbiAgICBzeXMuVU5LTk9XTiA9IC0xO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBXSU4zMlxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDBcbiAgICAgKi9cbiAgICBzeXMuV0lOMzIgPSAwO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBMSU5VWFxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDFcbiAgICAgKi9cbiAgICBzeXMuTElOVVggPSAxO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBNQUNPU1xuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDJcbiAgICAgKi9cbiAgICBzeXMuTUFDT1MgPSAyO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBBTkRST0lEXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgM1xuICAgICAqL1xuICAgIHN5cy5BTkRST0lEID0gMztcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gSVBIT05FXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgNFxuICAgICAqL1xuICAgIHN5cy5JUEhPTkUgPSA0O1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBJUEFEXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgNVxuICAgICAqL1xuICAgIHN5cy5JUEFEID0gNTtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gQkxBQ0tCRVJSWVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDZcbiAgICAgKi9cbiAgICBzeXMuQkxBQ0tCRVJSWSA9IDY7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IE5BQ0xcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCA3XG4gICAgICovXG4gICAgc3lzLk5BQ0wgPSA3O1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBFTVNDUklQVEVOXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgOFxuICAgICAqL1xuICAgIHN5cy5FTVNDUklQVEVOID0gODtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gVElaRU5cbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCA5XG4gICAgICovXG4gICAgc3lzLlRJWkVOID0gOTtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gV0lOUlRcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAxMFxuICAgICAqL1xuICAgIHN5cy5XSU5SVCA9IDEwO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBXUDhcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAxMVxuICAgICAqL1xuICAgIHN5cy5XUDggPSAxMTtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gTU9CSUxFX0JST1dTRVJcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAxMDBcbiAgICAgKi9cbiAgICBzeXMuTU9CSUxFX0JST1dTRVIgPSAxMDA7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IERFU0tUT1BfQlJPV1NFUlxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDEwMVxuICAgICAqL1xuICAgIHN5cy5ERVNLVE9QX0JST1dTRVIgPSAxMDE7XG5cbiAgICAvKipcbiAgICAgKiBJbmRpY2F0ZXMgd2hldGhlciBleGVjdXRlcyBpbiBlZGl0b3IncyB3aW5kb3cgcHJvY2VzcyAoRWxlY3Ryb24ncyByZW5kZXJlciBjb250ZXh0KVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBFRElUT1JfUEFHRVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDEwMlxuICAgICAqL1xuICAgIHN5cy5FRElUT1JfUEFHRSA9IDEwMjtcbiAgICAvKipcbiAgICAgKiBJbmRpY2F0ZXMgd2hldGhlciBleGVjdXRlcyBpbiBlZGl0b3IncyBtYWluIHByb2Nlc3MgKEVsZWN0cm9uJ3MgYnJvd3NlciBjb250ZXh0KVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBFRElUT1JfQ09SRVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDEwM1xuICAgICAqL1xuICAgIHN5cy5FRElUT1JfQ09SRSA9IDEwMztcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gV0VDSEFUX0dBTUVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAxMDRcbiAgICAgKi9cbiAgICBzeXMuV0VDSEFUX0dBTUUgPSAxMDQ7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFFRX1BMQVlcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAxMDVcbiAgICAgKi9cbiAgICBzeXMuUVFfUExBWSA9IDEwNTtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gRkJfUExBWUFCTEVfQURTXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMTA2XG4gICAgICovXG4gICAgc3lzLkZCX1BMQVlBQkxFX0FEUyA9IDEwNjtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gQkFJRFVfR0FNRVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDEwN1xuICAgICAqL1xuICAgIHN5cy5CQUlEVV9HQU1FID0gMTA3O1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBWSVZPX0dBTUVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAxMDhcbiAgICAgKi9cbiAgICBzeXMuVklWT19HQU1FID0gMTA4O1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBPUFBPX0dBTUVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAxMDlcbiAgICAgKi9cbiAgICBzeXMuT1BQT19HQU1FID0gMTA5O1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBIVUFXRUlfR0FNRVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDExMFxuICAgICAqL1xuICAgIHN5cy5IVUFXRUlfR0FNRSA9IDExMDtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gWElBT01JX0dBTUVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAxMTFcbiAgICAgKi9cbiAgICBzeXMuWElBT01JX0dBTUUgPSAxMTE7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEpLV19HQU1FXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMTEyXG4gICAgICovXG4gICAgc3lzLkpLV19HQU1FID0gMTEyO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBBTElQQVlfR0FNRVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDExM1xuICAgICAqL1xuICAgIHN5cy5BTElQQVlfR0FNRSA9IDExMztcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gV0VDSEFUX0dBTUVfU1VCXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMTE0XG4gICAgICovXG4gICAgc3lzLldFQ0hBVF9HQU1FX1NVQiA9IDExNDtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gQkFJRFVfR0FNRV9TVUJcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAxMTVcbiAgICAgKi9cbiAgICBzeXMuQkFJRFVfR0FNRV9TVUIgPSAxMTU7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFFUVF9HQU1FXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMTE2XG4gICAgICovXG4gICAgc3lzLlFUVF9HQU1FID0gMTE2O1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBCWVRFREFOQ0VfR0FNRVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDExN1xuICAgICAqL1xuICAgIHN5cy5CWVRFREFOQ0VfR0FNRSA9IDExNztcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gQllURURBTkNFX0dBTUVfU1VCXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMTE4XG4gICAgICovXG4gICAgc3lzLkJZVEVEQU5DRV9HQU1FX1NVQiA9IDExODtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gTElOS1NVUkVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAxMTlcbiAgICAgKi9cbiAgICBzeXMuTElOS1NVUkUgPSAxMTk7XG4gICAgLyoqXG4gICAgICogQlJPV1NFUl9UWVBFX1dFQ0hBVFxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfV0VDSEFUXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJ3ZWNoYXRcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfV0VDSEFUID0gXCJ3ZWNoYXRcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfQU5EUk9JRFxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IFwiYW5kcm9pZGJyb3dzZXJcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfQU5EUk9JRCA9IFwiYW5kcm9pZGJyb3dzZXJcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfSUVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcImllXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX0lFID0gXCJpZVwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9FREdFXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJlZGdlXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX0VER0UgPSBcImVkZ2VcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfUVFcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcInFxYnJvd3NlclwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9RUSA9IFwicXFicm93c2VyXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX01PQklMRV9RUVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IFwibXFxYnJvd3NlclwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9NT0JJTEVfUVEgPSBcIm1xcWJyb3dzZXJcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfVUNcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcInVjYnJvd3NlclwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9VQyA9IFwidWNicm93c2VyXCI7XG4gICAgLyoqXG4gICAgICogdWMgdGhpcmQgcGFydHkgaW50ZWdyYXRpb24uXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9VQ0JTXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJ1Y2JzXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX1VDQlMgPSBcInVjYnNcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfMzYwXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCIzNjBicm93c2VyXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFXzM2MCA9IFwiMzYwYnJvd3NlclwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9CQUlEVV9BUFBcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcImJhaWR1Ym94YXBwXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX0JBSURVX0FQUCA9IFwiYmFpZHVib3hhcHBcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfQkFJRFVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcImJhaWR1YnJvd3NlclwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9CQUlEVSA9IFwiYmFpZHVicm93c2VyXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX01BWFRIT05cbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcIm1heHRob25cIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfTUFYVEhPTiA9IFwibWF4dGhvblwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9PUEVSQVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IFwib3BlcmFcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfT1BFUkEgPSBcIm9wZXJhXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX09VUEVOR1xuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IFwib3VwZW5nXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX09VUEVORyA9IFwib3VwZW5nXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX01JVUlcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcIm1pdWlicm93c2VyXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX01JVUkgPSBcIm1pdWlicm93c2VyXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX0ZJUkVGT1hcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcImZpcmVmb3hcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfRklSRUZPWCA9IFwiZmlyZWZveFwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9TQUZBUklcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcInNhZmFyaVwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9TQUZBUkkgPSBcInNhZmFyaVwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9DSFJPTUVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcImNocm9tZVwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9DSFJPTUUgPSBcImNocm9tZVwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9MSUVCQU9cbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcImxpZWJhb1wiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9MSUVCQU8gPSBcImxpZWJhb1wiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9RWk9ORVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IFwicXpvbmVcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfUVpPTkUgPSBcInF6b25lXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX1NPVUdPVVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IFwic29nb3VcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfU09VR09VID0gXCJzb2dvdVwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9IVUFXRUlcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcImh1YXdlaVwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9IVUFXRUkgPSBcImh1YXdlaVwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9VTktOT1dOXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJ1bmtub3duXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX1VOS05PV04gPSBcInVua25vd25cIjtcblxuICAgIC8qKlxuICAgICAqIElzIG5hdGl2ZSA/IFRoaXMgaXMgc2V0IHRvIGJlIHRydWUgaW4ganNiIGF1dG8uXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBpc05hdGl2ZVxuICAgICAqL1xuICAgIHN5cy5pc05hdGl2ZSA9IENDX0pTQiB8fCBDQ19SVU5USU1FO1xuXG4gICAgLyoqXG4gICAgICogSXMgd2ViIGJyb3dzZXIgP1xuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gaXNCcm93c2VyXG4gICAgICovXG4gICAgc3lzLmlzQnJvd3NlciA9IHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnICYmIHR5cGVvZiBkb2N1bWVudCA9PT0gJ29iamVjdCcgJiYgIUNDX0pTQiAmJiAhQ0NfUlVOVElNRTtcblxuICAgIC8qKlxuICAgICAqIElzIHdlYmdsIGV4dGVuc2lvbiBzdXBwb3J0P1xuICAgICAqIEBtZXRob2QgZ2xFeHRlbnNpb25cbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgc3lzLmdsRXh0ZW5zaW9uID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuICEhY2MucmVuZGVyZXIuZGV2aWNlLmV4dChuYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgbWF4IGpvaW50IG1hdHJpeCBzaXplIGZvciBza2lubmVkIG1lc2ggcmVuZGVyZXIuXG4gICAgICogQG1ldGhvZCBnZXRNYXhKb2ludE1hdHJpeFNpemVcbiAgICAgKi9cbiAgICBzeXMuZ2V0TWF4Sm9pbnRNYXRyaXhTaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXN5cy5fbWF4Sm9pbnRNYXRyaXhTaXplKSB7XG4gICAgICAgICAgICBjb25zdCBKT0lOVF9NQVRSSUNFU19TSVpFID0gNTA7XG4gICAgICAgICAgICBjb25zdCBMRUZUX1VOSUZPUk1fU0laRSA9IDEwO1xuXG4gICAgICAgICAgICBsZXQgZ2wgPSBjYy5nYW1lLl9yZW5kZXJDb250ZXh0O1xuICAgICAgICAgICAgbGV0IG1heFVuaWZvcm1zID0gTWF0aC5mbG9vcihnbC5nZXRQYXJhbWV0ZXIoZ2wuTUFYX1ZFUlRFWF9VTklGT1JNX1ZFQ1RPUlMpIC8gNCkgLSBMRUZUX1VOSUZPUk1fU0laRTtcbiAgICAgICAgICAgIGlmIChtYXhVbmlmb3JtcyA8IEpPSU5UX01BVFJJQ0VTX1NJWkUpIHtcbiAgICAgICAgICAgICAgICBzeXMuX21heEpvaW50TWF0cml4U2l6ZSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzeXMuX21heEpvaW50TWF0cml4U2l6ZSA9IEpPSU5UX01BVFJJQ0VTX1NJWkU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN5cy5fbWF4Sm9pbnRNYXRyaXhTaXplO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyB0aGUgc2FmZSBhcmVhIG9mIHRoZSBzY3JlZW4gKGluIGRlc2lnbiByZXNvbHV0aW9uKS4gSWYgdGhlIHNjcmVlbiBpcyBub3Qgbm90Y2hlZCwgdGhlIHZpc2libGVSZWN0IHdpbGwgYmUgcmV0dXJuZWQgYnkgZGVmYXVsdC5cbiAgICAgKiBDdXJyZW50bHkgc3VwcG9ydHMgQW5kcm9pZCwgaU9TIGFuZCBXZUNoYXQgTWluaSBHYW1lIHBsYXRmb3JtLlxuICAgICAqICEjemhcbiAgICAgKiDov5Tlm57miYvmnLrlsY/luZXlronlhajljLrln5/vvIjorr7orqHliIbovqjnjofkuLrljZXkvY3vvInvvIzlpoLmnpzkuI3mmK/lvILlvaLlsY/lsIbpu5jorqTov5Tlm54gdmlzaWJsZVJlY3TjgILnm67liY3mlK/mjIHlronljZPjgIFpT1Mg5Y6f55Sf5bmz5Y+w5ZKM5b6u5L+h5bCP5ri45oiP5bmz5Y+w44CCXG4gICAgICogQG1ldGhvZCBnZXRTYWZlQXJlYVJlY3RcbiAgICAgKiBAcmV0dXJuIHtSZWN0fVxuICAgICovXG4gICBzeXMuZ2V0U2FmZUFyZWFSZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgdmlzaWJsZVNpemUgPSBjYy52aWV3LmdldFZpc2libGVTaXplKCk7XG4gICAgICAgIHJldHVybiBjYy5yZWN0KDAsIDAsIHZpc2libGVTaXplLndpZHRoLCB2aXNpYmxlU2l6ZS5oZWlnaHQpO1xuICAgIH07XG5cbiAgICBpZiAoX2dsb2JhbC5fX2dsb2JhbEFkYXB0ZXIgJiYgX2dsb2JhbC5fX2dsb2JhbEFkYXB0ZXIuYWRhcHRTeXMpIHtcbiAgICAgICAgLy8gaW5pdCBzeXMgaW5mbyBpbiBhZGFwdGVyXG4gICAgICAgIF9nbG9iYWwuX19nbG9iYWxBZGFwdGVyLmFkYXB0U3lzKHN5cyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKENDX0VESVRPUiAmJiBFZGl0b3IuaXNNYWluUHJvY2Vzcykge1xuICAgICAgICBzeXMuaXNNb2JpbGUgPSBmYWxzZTtcbiAgICAgICAgc3lzLnBsYXRmb3JtID0gc3lzLkVESVRPUl9DT1JFO1xuICAgICAgICBzeXMubGFuZ3VhZ2UgPSBzeXMuTEFOR1VBR0VfVU5LTk9XTjtcbiAgICAgICAgc3lzLmxhbmd1YWdlQ29kZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgc3lzLm9zID0gKHtcbiAgICAgICAgICAgIGRhcndpbjogc3lzLk9TX09TWCxcbiAgICAgICAgICAgIHdpbjMyOiBzeXMuT1NfV0lORE9XUyxcbiAgICAgICAgICAgIGxpbnV4OiBzeXMuT1NfTElOVVhcbiAgICAgICAgfSlbcHJvY2Vzcy5wbGF0Zm9ybV0gfHwgc3lzLk9TX1VOS05PV047XG4gICAgICAgIHN5cy5icm93c2VyVHlwZSA9IG51bGw7XG4gICAgICAgIHN5cy5icm93c2VyVmVyc2lvbiA9IG51bGw7XG4gICAgICAgIHN5cy53aW5kb3dQaXhlbFJlc29sdXRpb24gPSB7XG4gICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgIGhlaWdodDogMFxuICAgICAgICB9O1xuICAgICAgICBzeXMuY2FwYWJpbGl0aWVzID0ge1xuICAgICAgICAgICAgJ2ltYWdlQml0bWFwJzogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgICAgc3lzLl9fYXVkaW9TdXBwb3J0ID0ge307XG4gICAgfVxuICAgIGVsc2UgaWYgKENDX0pTQiB8fCBDQ19SVU5USU1FKSB7XG4gICAgICAgIGxldCBwbGF0Zm9ybTtcbiAgICAgICAgaWYgKGlzVml2b0dhbWUpIHtcbiAgICAgICAgICAgIHBsYXRmb3JtID0gc3lzLlZJVk9fR0FNRTtcbiAgICAgICAgfSBlbHNlIGlmIChpc09wcG9HYW1lKSB7XG4gICAgICAgICAgICBwbGF0Zm9ybSA9IHN5cy5PUFBPX0dBTUU7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNIdWF3ZWlHYW1lKSB7XG4gICAgICAgICAgICBwbGF0Zm9ybSA9IHN5cy5IVUFXRUlfR0FNRTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0pLV0dhbWUpIHtcbiAgICAgICAgICAgIHBsYXRmb3JtID0gc3lzLkpLV19HQU1FO1xuICAgICAgICB9IGVsc2UgaWYgKGlzUXR0R2FtZSkge1xuICAgICAgICAgICAgcGxhdGZvcm0gPSBzeXMuUVRUX0dBTUU7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNMaW5rU3VyZSkge1xuICAgICAgICAgICAgcGxhdGZvcm0gPSBzeXMuTElOS1NVUkU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwbGF0Zm9ybSA9IF9fZ2V0UGxhdGZvcm0oKTtcbiAgICAgICAgfVxuICAgICAgICBzeXMucGxhdGZvcm0gPSBwbGF0Zm9ybTtcbiAgICAgICAgc3lzLmlzTW9iaWxlID0gKHBsYXRmb3JtID09PSBzeXMuQU5EUk9JRCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhdGZvcm0gPT09IHN5cy5JUEFEIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF0Zm9ybSA9PT0gc3lzLklQSE9ORSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhdGZvcm0gPT09IHN5cy5XUDggfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXRmb3JtID09PSBzeXMuVElaRU4gfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXRmb3JtID09PSBzeXMuQkxBQ0tCRVJSWSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhdGZvcm0gPT09IHN5cy5YSUFPTUlfR0FNRSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNWaXZvR2FtZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNPcHBvR2FtZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNIdWF3ZWlHYW1lIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0pLV0dhbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUXR0R2FtZSk7XG5cbiAgICAgICAgc3lzLm9zID0gX19nZXRPUygpO1xuICAgICAgICBzeXMubGFuZ3VhZ2UgPSBfX2dldEN1cnJlbnRMYW5ndWFnZSgpO1xuICAgICAgICB2YXIgbGFuZ3VhZ2VDb2RlOyBcbiAgICAgICAgaWYgKENDX0pTQikge1xuICAgICAgICAgICAgbGFuZ3VhZ2VDb2RlID0gX19nZXRDdXJyZW50TGFuZ3VhZ2VDb2RlKCk7XG4gICAgICAgIH1cbiAgICAgICAgc3lzLmxhbmd1YWdlQ29kZSA9IGxhbmd1YWdlQ29kZSA/IGxhbmd1YWdlQ29kZS50b0xvd2VyQ2FzZSgpIDogdW5kZWZpbmVkO1xuICAgICAgICBzeXMub3NWZXJzaW9uID0gX19nZXRPU1ZlcnNpb24oKTtcbiAgICAgICAgc3lzLm9zTWFpblZlcnNpb24gPSBwYXJzZUludChzeXMub3NWZXJzaW9uKTtcbiAgICAgICAgc3lzLmJyb3dzZXJUeXBlID0gbnVsbDtcbiAgICAgICAgc3lzLmJyb3dzZXJWZXJzaW9uID0gbnVsbDtcblxuICAgICAgICB2YXIgdyA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICB2YXIgaCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgdmFyIHJhdGlvID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiAgICAgICAgc3lzLndpbmRvd1BpeGVsUmVzb2x1dGlvbiA9IHtcbiAgICAgICAgICAgIHdpZHRoOiByYXRpbyAqIHcsXG4gICAgICAgICAgICBoZWlnaHQ6IHJhdGlvICogaFxuICAgICAgICB9O1xuXG4gICAgICAgIHN5cy5sb2NhbFN0b3JhZ2UgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xuXG4gICAgICAgIHZhciBjYXBhYmlsaXRpZXM7XG4gICAgICAgIGNhcGFiaWxpdGllcyA9IHN5cy5jYXBhYmlsaXRpZXMgPSB7XG4gICAgICAgICAgICBcImNhbnZhc1wiOiBmYWxzZSxcbiAgICAgICAgICAgIFwib3BlbmdsXCI6IHRydWUsXG4gICAgICAgICAgICBcIndlYnBcIjogdHJ1ZSxcbiAgICAgICAgfTtcblxuICAgICAgIGlmIChzeXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgIGNhcGFiaWxpdGllc1tcImFjY2VsZXJvbWV0ZXJcIl0gPSB0cnVlO1xuICAgICAgICAgICAgY2FwYWJpbGl0aWVzW1widG91Y2hlc1wiXSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBkZXNrdG9wXG4gICAgICAgICAgICBjYXBhYmlsaXRpZXNbXCJrZXlib2FyZFwiXSA9IHRydWU7XG4gICAgICAgICAgICBjYXBhYmlsaXRpZXNbXCJtb3VzZVwiXSA9IHRydWU7XG4gICAgICAgICAgICBjYXBhYmlsaXRpZXNbXCJ0b3VjaGVzXCJdID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjYXBhYmlsaXRpZXNbJ2ltYWdlQml0bWFwJ10gPSBmYWxzZTtcblxuICAgICAgICBzeXMuX19hdWRpb1N1cHBvcnQgPSB7XG4gICAgICAgICAgICBPTkxZX09ORTogZmFsc2UsXG4gICAgICAgICAgICBXRUJfQVVESU86IGZhbHNlLFxuICAgICAgICAgICAgREVMQVlfQ1JFQVRFX0NUWDogZmFsc2UsXG4gICAgICAgICAgICBmb3JtYXQ6IFsnLm1wMyddXG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBicm93c2VyIG9yIHJ1bnRpbWVcbiAgICAgICAgdmFyIHdpbiA9IHdpbmRvdywgbmF2ID0gd2luLm5hdmlnYXRvciwgZG9jID0gZG9jdW1lbnQsIGRvY0VsZSA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHZhciB1YSA9IG5hdi51c2VyQWdlbnQudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICBzeXMuaXNNb2JpbGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHN5cy5wbGF0Zm9ybSA9IHN5cy5FRElUT1JfUEFHRTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSW5kaWNhdGUgd2hldGhlciBzeXN0ZW0gaXMgbW9iaWxlIHN5c3RlbVxuICAgICAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBpc01vYmlsZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBzeXMuaXNNb2JpbGUgPSAvbW9iaWxlfGFuZHJvaWR8aXBob25lfGlwYWQvLnRlc3QodWEpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEluZGljYXRlIHRoZSBydW5uaW5nIHBsYXRmb3JtXG4gICAgICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gcGxhdGZvcm1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBGYlBsYXlhYmxlQWQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICBzeXMucGxhdGZvcm0gPSBzeXMuRkJfUExBWUFCTEVfQURTO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc3lzLnBsYXRmb3JtID0gc3lzLmlzTW9iaWxlID8gc3lzLk1PQklMRV9CUk9XU0VSIDogc3lzLkRFU0tUT1BfQlJPV1NFUjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjdXJyTGFuZ3VhZ2UgPSBuYXYubGFuZ3VhZ2U7XG4gICAgICAgIGN1cnJMYW5ndWFnZSA9IGN1cnJMYW5ndWFnZSA/IGN1cnJMYW5ndWFnZSA6IG5hdi5icm93c2VyTGFuZ3VhZ2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCBjdXJyZW50IGxhbmd1YWdlIGlzbyA2MzktMSBjb2RlLlxuICAgICAgICAgKiBFeGFtcGxlcyBvZiB2YWxpZCBsYW5ndWFnZSBjb2RlcyBpbmNsdWRlIFwiemgtdHdcIiwgXCJlblwiLCBcImVuLXVzXCIsIFwiZnJcIiwgXCJmci1mclwiLCBcImVzLWVzXCIsIGV0Yy5cbiAgICAgICAgICogVGhlIGFjdHVhbCB2YWx1ZSB0b3RhbGx5IGRlcGVuZHMgb24gcmVzdWx0cyBwcm92aWRlZCBieSBkZXN0aW5hdGlvbiBwbGF0Zm9ybS5cbiAgICAgICAgICogQHByb3BlcnR5IHtTdHJpbmd9IGxhbmd1YWdlQ29kZVxuICAgICAgICAgKi9cbiAgICAgICAgc3lzLmxhbmd1YWdlQ29kZSA9IGN1cnJMYW5ndWFnZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgIGN1cnJMYW5ndWFnZSA9IGN1cnJMYW5ndWFnZSA/IGN1cnJMYW5ndWFnZS5zcGxpdChcIi1cIilbMF0gOiBzeXMuTEFOR1VBR0VfRU5HTElTSDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5kaWNhdGUgdGhlIGN1cnJlbnQgbGFuZ3VhZ2Ugb2YgdGhlIHJ1bm5pbmcgc3lzdGVtXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBsYW5ndWFnZVxuICAgICAgICAgKi9cbiAgICAgICAgc3lzLmxhbmd1YWdlID0gY3Vyckxhbmd1YWdlO1xuXG4gICAgICAgIC8vIEdldCB0aGUgb3Mgb2Ygc3lzdGVtXG4gICAgICAgIHZhciBpc0FuZHJvaWQgPSBmYWxzZSwgaU9TID0gZmFsc2UsIG9zVmVyc2lvbiA9ICcnLCBvc01haW5WZXJzaW9uID0gMDtcbiAgICAgICAgdmFyIHVhUmVzdWx0ID0gL2FuZHJvaWRcXHMqKFxcZCsoPzpcXC5cXGQrKSopL2kuZXhlYyh1YSkgfHwgL2FuZHJvaWRcXHMqKFxcZCsoPzpcXC5cXGQrKSopL2kuZXhlYyhuYXYucGxhdGZvcm0pO1xuICAgICAgICBpZiAodWFSZXN1bHQpIHtcbiAgICAgICAgICAgIGlzQW5kcm9pZCA9IHRydWU7XG4gICAgICAgICAgICBvc1ZlcnNpb24gPSB1YVJlc3VsdFsxXSB8fCAnJztcbiAgICAgICAgICAgIG9zTWFpblZlcnNpb24gPSBwYXJzZUludChvc1ZlcnNpb24pIHx8IDA7XG4gICAgICAgIH1cbiAgICAgICAgdWFSZXN1bHQgPSAvKGlQYWR8aVBob25lfGlQb2QpLipPUyAoKFxcZCtfPyl7MiwzfSkvaS5leGVjKHVhKTtcbiAgICAgICAgaWYgKHVhUmVzdWx0KSB7XG4gICAgICAgICAgICBpT1MgPSB0cnVlO1xuICAgICAgICAgICAgb3NWZXJzaW9uID0gdWFSZXN1bHRbMl0gfHwgJyc7XG4gICAgICAgICAgICBvc01haW5WZXJzaW9uID0gcGFyc2VJbnQob3NWZXJzaW9uKSB8fCAwO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJlZmVyIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9jb2Nvcy1jcmVhdG9yL2VuZ2luZS9wdWxsLzU1NDIgLCB0aGFua3MgZm9yIGNvbnRyaWJpdGlvbiBmcm9tIEBrcmFwbmlra2tcbiAgICAgICAgLy8gaXBhZCBPUyAxMyBzYWZhcmkgaWRlbnRpZmllcyBpdHNlbGYgYXMgXCJNb3ppbGxhLzUuMCAoTWFjaW50b3NoOyBJbnRlbCBNYWMgT1MgWCAxMF8xNSkgQXBwbGVXZWJLaXQvNjA1LjEuMTUgKEtIVE1MLCBsaWtlIEdlY2tvKVwiIFxuICAgICAgICAvLyBzbyB1c2UgbWF4VG91Y2hQb2ludHMgdG8gY2hlY2sgd2hldGhlciBpdCdzIGRlc2t0b3Agc2FmYXJpIG9yIG5vdC4gXG4gICAgICAgIC8vIHJlZmVyZW5jZTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTgwMTk0NjMvaG93LXRvLWRldGVjdC1kZXZpY2UtbmFtZS1pbi1zYWZhcmktb24taW9zLTEzLXdoaWxlLWl0LWRvZXNudC1zaG93LXRoZS1jb3JyZWN0XG4gICAgICAgIC8vIEZJWE1FOiBzaG91bGQgcmVtb3ZlIGl0IHdoZW4gdG91Y2gtZW5hYmxlZCBtYWNzIGFyZSBhdmFpbGFibGVcbiAgICAgICAgZWxzZSBpZiAoLyhpUGhvbmV8aVBhZHxpUG9kKS8uZXhlYyhuYXYucGxhdGZvcm0pIHx8IChuYXYucGxhdGZvcm0gPT09ICdNYWNJbnRlbCcgJiYgbmF2Lm1heFRvdWNoUG9pbnRzICYmIG5hdi5tYXhUb3VjaFBvaW50cyA+IDEpKSB7IFxuICAgICAgICAgICAgaU9TID0gdHJ1ZTtcbiAgICAgICAgICAgIG9zVmVyc2lvbiA9ICcnO1xuICAgICAgICAgICAgb3NNYWluVmVyc2lvbiA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb3NOYW1lID0gc3lzLk9TX1VOS05PV047XG4gICAgICAgIGlmIChuYXYuYXBwVmVyc2lvbi5pbmRleE9mKFwiV2luXCIpICE9PSAtMSkgb3NOYW1lID0gc3lzLk9TX1dJTkRPV1M7XG4gICAgICAgIGVsc2UgaWYgKGlPUykgb3NOYW1lID0gc3lzLk9TX0lPUztcbiAgICAgICAgZWxzZSBpZiAobmF2LmFwcFZlcnNpb24uaW5kZXhPZihcIk1hY1wiKSAhPT0gLTEpIG9zTmFtZSA9IHN5cy5PU19PU1g7XG4gICAgICAgIGVsc2UgaWYgKG5hdi5hcHBWZXJzaW9uLmluZGV4T2YoXCJYMTFcIikgIT09IC0xICYmIG5hdi5hcHBWZXJzaW9uLmluZGV4T2YoXCJMaW51eFwiKSA9PT0gLTEpIG9zTmFtZSA9IHN5cy5PU19VTklYO1xuICAgICAgICBlbHNlIGlmIChpc0FuZHJvaWQpIG9zTmFtZSA9IHN5cy5PU19BTkRST0lEO1xuICAgICAgICBlbHNlIGlmIChuYXYuYXBwVmVyc2lvbi5pbmRleE9mKFwiTGludXhcIikgIT09IC0xIHx8IHVhLmluZGV4T2YoXCJ1YnVudHVcIikgIT09IC0xKSBvc05hbWUgPSBzeXMuT1NfTElOVVg7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluZGljYXRlIHRoZSBydW5uaW5nIG9zIG5hbWVcbiAgICAgICAgICogQHByb3BlcnR5IHtTdHJpbmd9IG9zXG4gICAgICAgICAqL1xuICAgICAgICBzeXMub3MgPSBvc05hbWU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbmRpY2F0ZSB0aGUgcnVubmluZyBvcyB2ZXJzaW9uXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBvc1ZlcnNpb25cbiAgICAgICAgICovXG4gICAgICAgIHN5cy5vc1ZlcnNpb24gPSBvc1ZlcnNpb247XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbmRpY2F0ZSB0aGUgcnVubmluZyBvcyBtYWluIHZlcnNpb25cbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IG9zTWFpblZlcnNpb25cbiAgICAgICAgICovXG4gICAgICAgIHN5cy5vc01haW5WZXJzaW9uID0gb3NNYWluVmVyc2lvbjtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5kaWNhdGUgdGhlIHJ1bm5pbmcgYnJvd3NlciB0eXBlXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nIHwgbnVsbH0gYnJvd3NlclR5cGVcbiAgICAgICAgICovXG4gICAgICAgIHN5cy5icm93c2VyVHlwZSA9IHN5cy5CUk9XU0VSX1RZUEVfVU5LTk9XTjtcbiAgICAgICAgLyogRGV0ZXJtaW5lIHRoZSBicm93c2VyIHR5cGUgKi9cbiAgICAgICAgKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgdHlwZVJlZzEgPSAvbXFxYnJvd3NlcnxtaWNyb21lc3NlbmdlcnxxcWJyb3dzZXJ8c29nb3V8cXpvbmV8bGllYmFvfG1heHRob258dWNic3wzNjAgYXBob25lfDM2MGJyb3dzZXJ8YmFpZHVib3hhcHB8YmFpZHVicm93c2VyfG1heHRob258bXhicm93c2VyfG1pdWlicm93c2VyL2k7XG4gICAgICAgICAgICB2YXIgdHlwZVJlZzIgPSAvcXF8dWNicm93c2VyfHVicm93c2VyfGVkZ2V8SHVhd2VpQnJvd3Nlci9pO1xuICAgICAgICAgICAgdmFyIHR5cGVSZWczID0gL2Nocm9tZXxzYWZhcml8ZmlyZWZveHx0cmlkZW50fG9wZXJhfG9wclxcL3xvdXBlbmcvaTtcbiAgICAgICAgICAgIHZhciBicm93c2VyVHlwZXMgPSB0eXBlUmVnMS5leGVjKHVhKSB8fCB0eXBlUmVnMi5leGVjKHVhKSB8fCB0eXBlUmVnMy5leGVjKHVhKTtcblxuICAgICAgICAgICAgdmFyIGJyb3dzZXJUeXBlID0gYnJvd3NlclR5cGVzID8gYnJvd3NlclR5cGVzWzBdLnRvTG93ZXJDYXNlKCkgOiBzeXMuQlJPV1NFUl9UWVBFX1VOS05PV047XG5cbiAgICAgICAgICAgIGlmIChicm93c2VyVHlwZSA9PT0gXCJzYWZhcmlcIiAmJiBpc0FuZHJvaWQpXG4gICAgICAgICAgICAgICAgYnJvd3NlclR5cGUgPSBzeXMuQlJPV1NFUl9UWVBFX0FORFJPSUQ7XG4gICAgICAgICAgICBlbHNlIGlmIChicm93c2VyVHlwZSA9PT0gXCJxcVwiICYmIHVhLm1hdGNoKC9hbmRyb2lkLiphcHBsZXdlYmtpdC9pKSlcbiAgICAgICAgICAgICAgICBicm93c2VyVHlwZSA9IHN5cy5CUk9XU0VSX1RZUEVfQU5EUk9JRDtcbiAgICAgICAgICAgIGxldCB0eXBlTWFwID0ge1xuICAgICAgICAgICAgICAgICdtaWNyb21lc3Nlbmdlcic6IHN5cy5CUk9XU0VSX1RZUEVfV0VDSEFULFxuICAgICAgICAgICAgICAgICd0cmlkZW50Jzogc3lzLkJST1dTRVJfVFlQRV9JRSxcbiAgICAgICAgICAgICAgICAnZWRnZSc6IHN5cy5CUk9XU0VSX1RZUEVfRURHRSxcbiAgICAgICAgICAgICAgICAnMzYwIGFwaG9uZSc6IHN5cy5CUk9XU0VSX1RZUEVfMzYwLFxuICAgICAgICAgICAgICAgICdteGJyb3dzZXInOiBzeXMuQlJPV1NFUl9UWVBFX01BWFRIT04sXG4gICAgICAgICAgICAgICAgJ29wci8nOiBzeXMuQlJPV1NFUl9UWVBFX09QRVJBLFxuICAgICAgICAgICAgICAgICd1YnJvd3Nlcic6IHN5cy5CUk9XU0VSX1RZUEVfVUMsXG4gICAgICAgICAgICAgICAgJ2h1YXdlaWJyb3dzZXInOiBzeXMuQlJPV1NFUl9UWVBFX0hVQVdFSSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKGJyb3dzZXJUeXBlID09PSBcInFxYnJvd3NlclwiIHx8IGJyb3dzZXJUeXBlID09PSBcIm1xcWJyb3dzZXJcIil7XG4gICAgICAgICAgICAgICAgaWYodWEubWF0Y2goL3dlY2hhdHxtaWNyb21lc3Nlbmdlci9pKSl7XG4gICAgICAgICAgICAgICAgICAgIGJyb3dzZXJUeXBlID0gc3lzLkJST1dTRVJfVFlQRV9XRUNIQVQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzeXMuYnJvd3NlclR5cGUgPSB0eXBlTWFwW2Jyb3dzZXJUeXBlXSB8fCBicm93c2VyVHlwZTtcbiAgICAgICAgfSkoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5kaWNhdGUgdGhlIHJ1bm5pbmcgYnJvd3NlciB2ZXJzaW9uXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nIHwgbnVsbH0gYnJvd3NlclZlcnNpb25cbiAgICAgICAgICovXG4gICAgICAgIHN5cy5icm93c2VyVmVyc2lvbiA9IFwiXCI7XG4gICAgICAgIC8qIERldGVybWluZSB0aGUgYnJvd3NlciB2ZXJzaW9uIG51bWJlciAqL1xuICAgICAgICAoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciB2ZXJzaW9uUmVnMSA9IC8obXFxYnJvd3NlcnxtaWNyb21lc3NlbmdlcnxxcWJyb3dzZXJ8c29nb3V8cXpvbmV8bGllYmFvfG1heHRob258dWN8dWNic3wzNjAgYXBob25lfDM2MHxiYWlkdWJveGFwcHxiYWlkdXxtYXh0aG9ufG14YnJvd3NlcnxtaXVpKD86Lmh5YnJpZCk/KShtb2JpbGUpPyhicm93c2VyKT9cXC8/KFtcXGQuXSspL2k7XG4gICAgICAgICAgICB2YXIgdmVyc2lvblJlZzIgPSAvKHFxfGNocm9tZXxzYWZhcml8ZmlyZWZveHx0cmlkZW50fG9wZXJhfG9wclxcL3xvdXBlbmcpKG1vYmlsZSk/KGJyb3dzZXIpP1xcLz8oW1xcZC5dKykvaTtcbiAgICAgICAgICAgIHZhciB0bXAgPSB1YS5tYXRjaCh2ZXJzaW9uUmVnMSk7XG4gICAgICAgICAgICBpZighdG1wKSB0bXAgPSB1YS5tYXRjaCh2ZXJzaW9uUmVnMik7XG4gICAgICAgICAgICBzeXMuYnJvd3NlclZlcnNpb24gPSB0bXAgPyB0bXBbNF0gOiBcIlwiO1xuICAgICAgICB9KSgpO1xuXG4gICAgICAgIHZhciB3ID0gd2luZG93LmlubmVyV2lkdGggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoO1xuICAgICAgICB2YXIgaCA9IHdpbmRvdy5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICB2YXIgcmF0aW8gPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbmRpY2F0ZSB0aGUgcmVhbCBwaXhlbCByZXNvbHV0aW9uIG9mIHRoZSB3aG9sZSBnYW1lIHdpbmRvd1xuICAgICAgICAgKiBAcHJvcGVydHkge1NpemV9IHdpbmRvd1BpeGVsUmVzb2x1dGlvblxuICAgICAgICAgKi9cbiAgICAgICAgc3lzLndpbmRvd1BpeGVsUmVzb2x1dGlvbiA9IHtcbiAgICAgICAgICAgIHdpZHRoOiByYXRpbyAqIHcsXG4gICAgICAgICAgICBoZWlnaHQ6IHJhdGlvICogaFxuICAgICAgICB9O1xuXG4gICAgICAgIHN5cy5fY2hlY2tXZWJHTFJlbmRlck1vZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoY2MuZ2FtZS5yZW5kZXJUeXBlICE9PSBjYy5nYW1lLlJFTkRFUl9UWVBFX1dFQkdMKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoaXMgZmVhdHVyZSBzdXBwb3J0cyBXZWJHTCByZW5kZXIgbW9kZSBvbmx5LlwiKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX3RtcENhbnZhczEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuXG4gICAgICAgIHZhciBjcmVhdGUzRENvbnRleHQgPSBmdW5jdGlvbiAoY2FudmFzLCBvcHRfYXR0cmlicywgb3B0X2NvbnRleHRUeXBlKSB7XG4gICAgICAgICAgICBpZiAob3B0X2NvbnRleHRUeXBlKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbnZhcy5nZXRDb250ZXh0KG9wdF9jb250ZXh0VHlwZSwgb3B0X2F0dHJpYnMpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZTNEQ29udGV4dChjYW52YXMsIG9wdF9hdHRyaWJzLCBcIndlYmdsXCIpIHx8XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZTNEQ29udGV4dChjYW52YXMsIG9wdF9hdHRyaWJzLCBcImV4cGVyaW1lbnRhbC13ZWJnbFwiKSB8fFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGUzRENvbnRleHQoY2FudmFzLCBvcHRfYXR0cmlicywgXCJ3ZWJraXQtM2RcIikgfHxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlM0RDb250ZXh0KGNhbnZhcywgb3B0X2F0dHJpYnMsIFwibW96LXdlYmdsXCIpIHx8XG4gICAgICAgICAgICAgICAgICAgIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGNjLnN5cy5sb2NhbFN0b3JhZ2UgaXMgYSBsb2NhbCBzdG9yYWdlIGNvbXBvbmVudC5cbiAgICAgICAgICogQHByb3BlcnR5IHtPYmplY3R9IGxvY2FsU3RvcmFnZVxuICAgICAgICAgKi9cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBsb2NhbFN0b3JhZ2UgPSBzeXMubG9jYWxTdG9yYWdlID0gd2luLmxvY2FsU3RvcmFnZTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic3RvcmFnZVwiLCBcIlwiKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwic3RvcmFnZVwiKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZSA9IG51bGw7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciB3YXJuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCg1MjAwKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzeXMubG9jYWxTdG9yYWdlID0ge1xuICAgICAgICAgICAgICAgIGdldEl0ZW0gOiB3YXJuLFxuICAgICAgICAgICAgICAgIHNldEl0ZW0gOiB3YXJuLFxuICAgICAgICAgICAgICAgIHJlbW92ZUl0ZW0gOiB3YXJuLFxuICAgICAgICAgICAgICAgIGNsZWFyIDogd2FyblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfc3VwcG9ydFdlYnAgPSBfdG1wQ2FudmFzMS50b0RhdGFVUkwoJ2ltYWdlL3dlYnAnKS5zdGFydHNXaXRoKCdkYXRhOmltYWdlL3dlYnAnKTtcbiAgICAgICAgdmFyIF9zdXBwb3J0Q2FudmFzID0gISFfdG1wQ2FudmFzMS5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIHZhciBfc3VwcG9ydFdlYkdMID0gZmFsc2U7XG4gICAgICAgIGlmIChDQ19URVNUKSB7XG4gICAgICAgICAgICBfc3VwcG9ydFdlYkdMID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAod2luLldlYkdMUmVuZGVyaW5nQ29udGV4dCkge1xuICAgICAgICAgICAgX3N1cHBvcnRXZWJHTCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGNhcGFiaWxpdGllcyBvZiB0aGUgY3VycmVudCBwbGF0Zm9ybVxuICAgICAgICAgKiBAcHJvcGVydHkge09iamVjdH0gY2FwYWJpbGl0aWVzXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgY2FwYWJpbGl0aWVzID0gc3lzLmNhcGFiaWxpdGllcyA9IHtcbiAgICAgICAgICAgIFwiY2FudmFzXCI6IF9zdXBwb3J0Q2FudmFzLFxuICAgICAgICAgICAgXCJvcGVuZ2xcIjogX3N1cHBvcnRXZWJHTCxcbiAgICAgICAgICAgIFwid2VicFwiOiBfc3VwcG9ydFdlYnAsXG4gICAgICAgICAgICAnaW1hZ2VCaXRtYXAnOiBmYWxzZSxcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodHlwZW9mIGNyZWF0ZUltYWdlQml0bWFwICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgQmxvYiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIF90bXBDYW52YXMxLndpZHRoID0gX3RtcENhbnZhczEuaGVpZ2h0ID0gMjtcbiAgICAgICAgICAgIGNyZWF0ZUltYWdlQml0bWFwKF90bXBDYW52YXMxLCB7fSkudGhlbihpbWFnZUJpdG1hcCA9PiB7XG4gICAgICAgICAgICAgICAgY2FwYWJpbGl0aWVzLmltYWdlQml0bWFwID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpbWFnZUJpdG1hcC5jbG9zZSAmJiBpbWFnZUJpdG1hcC5jbG9zZSgpO1xuICAgICAgICAgICAgfSkuY2F0Y2goZXJyID0+IHt9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZG9jRWxlWydvbnRvdWNoc3RhcnQnXSAhPT0gdW5kZWZpbmVkIHx8IGRvY1snb250b3VjaHN0YXJ0J10gIT09IHVuZGVmaW5lZCB8fCBuYXYubXNQb2ludGVyRW5hYmxlZClcbiAgICAgICAgICAgIGNhcGFiaWxpdGllc1tcInRvdWNoZXNcIl0gPSB0cnVlO1xuICAgICAgICBpZiAoZG9jRWxlWydvbm1vdXNldXAnXSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgY2FwYWJpbGl0aWVzW1wibW91c2VcIl0gPSB0cnVlO1xuICAgICAgICBpZiAoZG9jRWxlWydvbmtleXVwJ10gIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGNhcGFiaWxpdGllc1tcImtleWJvYXJkXCJdID0gdHJ1ZTtcbiAgICAgICAgaWYgKHdpbi5EZXZpY2VNb3Rpb25FdmVudCB8fCB3aW4uRGV2aWNlT3JpZW50YXRpb25FdmVudClcbiAgICAgICAgICAgIGNhcGFiaWxpdGllc1tcImFjY2VsZXJvbWV0ZXJcIl0gPSB0cnVlO1xuXG4gICAgICAgIHZhciBfX2F1ZGlvU3VwcG9ydDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQXVkaW8gc3VwcG9ydCBpbiB0aGUgYnJvd3NlclxuICAgICAgICAgKlxuICAgICAgICAgKiBNVUxUSV9DSEFOTkVMICAgICAgICA6IE11bHRpcGxlIGF1ZGlvIHdoaWxlIHBsYXlpbmcgLSBJZiBpdCBkb2Vzbid0LCB5b3UgY2FuIG9ubHkgcGxheSBiYWNrZ3JvdW5kIG11c2ljXG4gICAgICAgICAqIFdFQl9BVURJTyAgICAgICAgICAgIDogU3VwcG9ydCBmb3IgV2ViQXVkaW8gLSBTdXBwb3J0IFczQyBXZWJBdWRpbyBzdGFuZGFyZHMsIGFsbCBvZiB0aGUgYXVkaW8gY2FuIGJlIHBsYXllZFxuICAgICAgICAgKiBBVVRPUExBWSAgICAgICAgICAgICA6IFN1cHBvcnRzIGF1dG8tcGxheSBhdWRpbyAtIGlmIERvbuKAmHQgc3VwcG9ydCBpdCwgT24gYSB0b3VjaCBkZXRlY3RpbmcgYmFja2dyb3VuZCBtdXNpYyBjYW52YXMsIGFuZCB0aGVuIHJlcGxheVxuICAgICAgICAgKiBSRVBMQVlfQUZURVJfVE9VQ0ggICA6IFRoZSBmaXJzdCBtdXNpYyB3aWxsIGZhaWwsIG11c3QgYmUgcmVwbGF5IGFmdGVyIHRvdWNoc3RhcnRcbiAgICAgICAgICogVVNFX0VNUFRJRURfRVZFTlQgICAgOiBXaGV0aGVyIHRvIHVzZSB0aGUgZW1wdGllZCBldmVudCB0byByZXBsYWNlIGxvYWQgY2FsbGJhY2tcbiAgICAgICAgICogREVMQVlfQ1JFQVRFX0NUWCAgICAgOiBkZWxheSBjcmVhdGVkIHRoZSBjb250ZXh0IG9iamVjdCAtIG9ubHkgd2ViQXVkaW9cbiAgICAgICAgICogTkVFRF9NQU5VQUxfTE9PUCAgICAgOiBsb29wIGF0dHJpYnV0ZSBmYWlsdXJlLCBuZWVkIHRvIHBlcmZvcm0gbG9vcCBtYW51YWxseVxuICAgICAgICAgKlxuICAgICAgICAgKiBNYXkgYmUgbW9kaWZpY2F0aW9ucyBmb3IgYSBmZXcgYnJvd3NlciB2ZXJzaW9uXG4gICAgICAgICAqL1xuICAgICAgICAoZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgdmFyIERFQlVHID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHZhciB2ZXJzaW9uID0gc3lzLmJyb3dzZXJWZXJzaW9uO1xuXG4gICAgICAgICAgICAvLyBjaGVjayBpZiBicm93c2VyIHN1cHBvcnRzIFdlYiBBdWRpb1xuICAgICAgICAgICAgLy8gY2hlY2sgV2ViIEF1ZGlvJ3MgY29udGV4dFxuICAgICAgICAgICAgdmFyIHN1cHBvcnRXZWJBdWRpbyA9ICEhKHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCB8fCB3aW5kb3cubW96QXVkaW9Db250ZXh0KTtcblxuICAgICAgICAgICAgX19hdWRpb1N1cHBvcnQgPSB7IE9OTFlfT05FOiBmYWxzZSwgV0VCX0FVRElPOiBzdXBwb3J0V2ViQXVkaW8sIERFTEFZX0NSRUFURV9DVFg6IGZhbHNlIH07XG5cbiAgICAgICAgICAgIGlmIChzeXMub3MgPT09IHN5cy5PU19JT1MpIHtcbiAgICAgICAgICAgICAgICAvLyBJT1Mgbm8gZXZlbnQgdGhhdCB1c2VkIHRvIHBhcnNlIGNvbXBsZXRlZCBjYWxsYmFja1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgdGltZSBpcyBub3QgY29tcGxldGUsIGNhbiBub3QgcGxheVxuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgX19hdWRpb1N1cHBvcnQuVVNFX0xPQURFUl9FVkVOVCA9ICdsb2FkZWRtZXRhZGF0YSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzeXMuYnJvd3NlclR5cGUgPT09IHN5cy5CUk9XU0VSX1RZUEVfRklSRUZPWCkge1xuICAgICAgICAgICAgICAgIF9fYXVkaW9TdXBwb3J0LkRFTEFZX0NSRUFURV9DVFggPSB0cnVlO1xuICAgICAgICAgICAgICAgIF9fYXVkaW9TdXBwb3J0LlVTRV9MT0FERVJfRVZFTlQgPSAnY2FucGxheSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzeXMub3MgPT09IHN5cy5PU19BTkRST0lEKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN5cy5icm93c2VyVHlwZSA9PT0gc3lzLkJST1dTRVJfVFlQRV9VQykge1xuICAgICAgICAgICAgICAgICAgICBfX2F1ZGlvU3VwcG9ydC5PTkVfU09VUkNFID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKERFQlVHKXtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZygnYnJvd3NlIHR5cGU6ICcgKyBzeXMuYnJvd3NlclR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBjYy5sb2coJ2Jyb3dzZSB2ZXJzaW9uOiAnICsgdmVyc2lvbik7XG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZygnTVVMVElfQ0hBTk5FTDogJyArIF9fYXVkaW9TdXBwb3J0Lk1VTFRJX0NIQU5ORUwpO1xuICAgICAgICAgICAgICAgICAgICBjYy5sb2coJ1dFQl9BVURJTzogJyArIF9fYXVkaW9TdXBwb3J0LldFQl9BVURJTyk7XG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZygnQVVUT1BMQVk6ICcgKyBfX2F1ZGlvU3VwcG9ydC5BVVRPUExBWSk7XG4gICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChfX2F1ZGlvU3VwcG9ydC5XRUJfQVVESU8pIHtcbiAgICAgICAgICAgICAgICBfX2F1ZGlvU3VwcG9ydC5jb250ZXh0ID0gbmV3ICh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQgfHwgd2luZG93Lm1vekF1ZGlvQ29udGV4dCkoKTtcbiAgICAgICAgICAgICAgICBpZihfX2F1ZGlvU3VwcG9ydC5ERUxBWV9DUkVBVEVfQ1RYKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgX19hdWRpb1N1cHBvcnQuY29udGV4dCA9IG5ldyAod2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0IHx8IHdpbmRvdy5tb3pBdWRpb0NvbnRleHQpKCk7IH0sIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgX19hdWRpb1N1cHBvcnQuV0VCX0FVRElPID0gZmFsc2U7XG4gICAgICAgICAgICBjYy5sb2dJRCg1MjAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmb3JtYXRTdXBwb3J0ID0gW107XG5cbiAgICAgICAgKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgYXVkaW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuICAgICAgICAgICAgaWYoYXVkaW8uY2FuUGxheVR5cGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgb2dnID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKTtcbiAgICAgICAgICAgICAgICBpZiAob2dnKSBmb3JtYXRTdXBwb3J0LnB1c2goJy5vZ2cnKTtcbiAgICAgICAgICAgICAgICB2YXIgbXAzID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWcnKTtcbiAgICAgICAgICAgICAgICBpZiAobXAzKSBmb3JtYXRTdXBwb3J0LnB1c2goJy5tcDMnKTtcbiAgICAgICAgICAgICAgICB2YXIgd2F2ID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL3dhdjsgY29kZWNzPVwiMVwiJyk7XG4gICAgICAgICAgICAgICAgaWYgKHdhdikgZm9ybWF0U3VwcG9ydC5wdXNoKCcud2F2Jyk7XG4gICAgICAgICAgICAgICAgdmFyIG1wNCA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby9tcDQnKTtcbiAgICAgICAgICAgICAgICBpZiAobXA0KSBmb3JtYXRTdXBwb3J0LnB1c2goJy5tcDQnKTtcbiAgICAgICAgICAgICAgICB2YXIgbTRhID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL3gtbTRhJyk7XG4gICAgICAgICAgICAgICAgaWYgKG00YSkgZm9ybWF0U3VwcG9ydC5wdXNoKCcubTRhJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG4gICAgICAgIF9fYXVkaW9TdXBwb3J0LmZvcm1hdCA9IGZvcm1hdFN1cHBvcnQ7XG5cbiAgICAgICAgc3lzLl9fYXVkaW9TdXBwb3J0ID0gX19hdWRpb1N1cHBvcnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIE5ldHdvcmsgdHlwZSBlbnVtZXJhdGlvblxuICAgICAqICEjemhcbiAgICAgKiDnvZHnu5znsbvlnovmnprkuL5cbiAgICAgKlxuICAgICAqIEBlbnVtIHN5cy5OZXR3b3JrVHlwZVxuICAgICAqL1xuICAgIHN5cy5OZXR3b3JrVHlwZSA9IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogTmV0d29yayBpcyB1bnJlYWNoYWJsZS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDnvZHnu5zkuI3pgJpcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IE5PTkVcbiAgICAgICAgICovXG4gICAgICAgIE5PTkU6IDAsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIE5ldHdvcmsgaXMgcmVhY2hhYmxlIHZpYSBXaUZpIG9yIGNhYmxlLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOmAmui/h+aXoOe6v+aIluiAheaciee6v+acrOWcsOe9kee7nOi/nuaOpeWboOeJuee9kVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gTEFOXG4gICAgICAgICAqL1xuICAgICAgICBMQU46IDEsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIE5ldHdvcmsgaXMgcmVhY2hhYmxlIHZpYSBXaXJlbGVzcyBXaWRlIEFyZWEgTmV0d29ya1xuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOmAmui/h+icgueqneenu+WKqOe9kee7nOi/nuaOpeWboOeJuee9kVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gV1dBTlxuICAgICAgICAgKi9cbiAgICAgICAgV1dBTjogMlxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3Mgc3lzXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0IHRoZSBuZXR3b3JrIHR5cGUgb2YgY3VycmVudCBkZXZpY2UsIHJldHVybiBjYy5zeXMuTmV0d29ya1R5cGUuTEFOIGlmIGZhaWx1cmUuXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluW9k+WJjeiuvuWkh+eahOe9kee7nOexu+Weiywg5aaC5p6c572R57uc57G75Z6L5peg5rOV6I635Y+W77yM6buY6K6k5bCG6L+U5ZueIGNjLnN5cy5OZXR3b3JrVHlwZS5MQU5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgZ2V0TmV0d29ya1R5cGVcbiAgICAgKiBAcmV0dXJuIHtzeXMuTmV0d29ya1R5cGV9XG4gICAgICovXG4gICAgc3lzLmdldE5ldHdvcmtUeXBlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIFRPRE86IG5lZWQgdG8gaW1wbGVtZW50IHRoaXMgZm9yIG1vYmlsZSBwaG9uZXMuXG4gICAgICAgIHJldHVybiBzeXMuTmV0d29ya1R5cGUuTEFOO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0IHRoZSBiYXR0ZXJ5IGxldmVsIG9mIGN1cnJlbnQgZGV2aWNlLCByZXR1cm4gMS4wIGlmIGZhaWx1cmUuXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluW9k+WJjeiuvuWkh+eahOeUteaxoOeUtemHj++8jOWmguaenOeUtemHj+aXoOazleiOt+WPlu+8jOm7mOiupOWwhui/lOWbniAxXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGdldEJhdHRlcnlMZXZlbFxuICAgICAqIEByZXR1cm4ge051bWJlcn0gLSAwLjAgfiAxLjBcbiAgICAgKi9cbiAgICBzeXMuZ2V0QmF0dGVyeUxldmVsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIFRPRE86IG5lZWQgdG8gaW1wbGVtZW50IHRoaXMgZm9yIG1vYmlsZSBwaG9uZXMuXG4gICAgICAgIHJldHVybiAxLjA7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZvcmNlcyB0aGUgZ2FyYmFnZSBjb2xsZWN0aW9uLCBvbmx5IGF2YWlsYWJsZSBpbiBKU0JcbiAgICAgKiBAbWV0aG9kIGdhcmJhZ2VDb2xsZWN0XG4gICAgICovXG4gICAgc3lzLmdhcmJhZ2VDb2xsZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBOL0EgaW4gd2ViXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlc3RhcnQgdGhlIEpTIFZNLCBvbmx5IGF2YWlsYWJsZSBpbiBKU0JcbiAgICAgKiBAbWV0aG9kIHJlc3RhcnRWTVxuICAgICAqL1xuICAgIHN5cy5yZXN0YXJ0Vk0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIE4vQSBpbiB3ZWJcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgd2hldGhlciBhbiBvYmplY3QgaXMgdmFsaWQsXG4gICAgICogSW4gd2ViIGVuZ2luZSwgaXQgd2lsbCByZXR1cm4gdHJ1ZSBpZiB0aGUgb2JqZWN0IGV4aXN0XG4gICAgICogSW4gbmF0aXZlIGVuZ2luZSwgaXQgd2lsbCByZXR1cm4gdHJ1ZSBpZiB0aGUgSlMgb2JqZWN0IGFuZCB0aGUgY29ycmVzcG9uZCBuYXRpdmUgb2JqZWN0IGFyZSBib3RoIHZhbGlkXG4gICAgICogQG1ldGhvZCBpc09iamVjdFZhbGlkXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9ialxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IFZhbGlkaXR5IG9mIHRoZSBvYmplY3RcbiAgICAgKi9cbiAgICBzeXMuaXNPYmplY3RWYWxpZCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEdW1wIHN5c3RlbSBpbmZvcm1hdGlvbnNcbiAgICAgKiBAbWV0aG9kIGR1bXBcbiAgICAgKi9cbiAgICBzeXMuZHVtcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgc3RyID0gXCJcIjtcbiAgICAgICAgc3RyICs9IFwiaXNNb2JpbGUgOiBcIiArIHNlbGYuaXNNb2JpbGUgKyBcIlxcclxcblwiO1xuICAgICAgICBzdHIgKz0gXCJsYW5ndWFnZSA6IFwiICsgc2VsZi5sYW5ndWFnZSArIFwiXFxyXFxuXCI7XG4gICAgICAgIHN0ciArPSBcImJyb3dzZXJUeXBlIDogXCIgKyBzZWxmLmJyb3dzZXJUeXBlICsgXCJcXHJcXG5cIjtcbiAgICAgICAgc3RyICs9IFwiYnJvd3NlclZlcnNpb24gOiBcIiArIHNlbGYuYnJvd3NlclZlcnNpb24gKyBcIlxcclxcblwiO1xuICAgICAgICBzdHIgKz0gXCJjYXBhYmlsaXRpZXMgOiBcIiArIEpTT04uc3RyaW5naWZ5KHNlbGYuY2FwYWJpbGl0aWVzKSArIFwiXFxyXFxuXCI7XG4gICAgICAgIHN0ciArPSBcIm9zIDogXCIgKyBzZWxmLm9zICsgXCJcXHJcXG5cIjtcbiAgICAgICAgc3RyICs9IFwib3NWZXJzaW9uIDogXCIgKyBzZWxmLm9zVmVyc2lvbiArIFwiXFxyXFxuXCI7XG4gICAgICAgIHN0ciArPSBcInBsYXRmb3JtIDogXCIgKyBzZWxmLnBsYXRmb3JtICsgXCJcXHJcXG5cIjtcbiAgICAgICAgc3RyICs9IFwiVXNpbmcgXCIgKyAoY2MuZ2FtZS5yZW5kZXJUeXBlID09PSBjYy5nYW1lLlJFTkRFUl9UWVBFX1dFQkdMID8gXCJXRUJHTFwiIDogXCJDQU5WQVNcIikgKyBcIiByZW5kZXJlci5cIiArIFwiXFxyXFxuXCI7XG4gICAgICAgIGNjLmxvZyhzdHIpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBPcGVuIGEgdXJsIGluIGJyb3dzZXJcbiAgICAgKiBAbWV0aG9kIG9wZW5VUkxcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gICAgICovXG4gICAgc3lzLm9wZW5VUkwgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgIGlmIChDQ19KU0IgfHwgQ0NfUlVOVElNRSkge1xuICAgICAgICAgICAganNiLm9wZW5VUkwodXJsKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5vcGVuKHVybCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGVsYXBzZWQgc2luY2UgMSBKYW51YXJ5IDE5NzAgMDA6MDA6MDAgVVRDLlxuICAgICAqIEBtZXRob2Qgbm93XG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIHN5cy5ub3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChEYXRlLm5vdykge1xuICAgICAgICAgICAgcmV0dXJuIERhdGUubm93KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKyhuZXcgRGF0ZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIHN5cztcbn1cblxudmFyIHN5cyA9IGNjICYmIGNjLnN5cyA/IGNjLnN5cyA6IGluaXRTeXMoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzeXM7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==