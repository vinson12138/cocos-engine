
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/webview/CCWebView.js';
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
var WebViewImpl = require('./webview-impl');
/**
 * !#en WebView event type
 * !#zh 网页视图事件类型
 * @enum WebView.EventType
 */


var EventType = WebViewImpl.EventType;
/**
 * !#en Web page Load completed.
 * !#zh  网页加载完成
 * @property {String} LOADED
 */

/**
 * !#en Web page is loading.
 * !#zh  网页加载中
 * @property {String} LOADING
 */

/**
 * !#en Web page error occurs when loading.
 * !#zh  网页加载出错
 * @property {String} ERROR
 */
//

function emptyCallback() {}
/**
 * !#en cc.WebView is a component for display web pages in the game. Because different platforms have different authorization, API and control methods for WebView component. And have not yet formed a unified standard, only Web, iOS, and Android platforms are currently supported.
 * !#zh WebView 组件，用于在游戏中显示网页。由于不同平台对于 WebView 组件的授权、API、控制方式都不同，还没有形成统一的标准，所以目前只支持 Web、iOS 和 Android 平台。
 * @class WebView
 * @extends Component
 */


var WebView = cc.Class({
  name: 'cc.WebView',
  "extends": cc.Component,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.ui/WebView',
    executeInEditMode: true
  },
  properties: {
    _url: '',

    /**
     * !#en A given URL to be loaded by the WebView, it should have a http or https prefix.
     * !#zh 指定 WebView 加载的网址，它应该是一个 http 或者 https 开头的字符串
     * @property {String} url
     */
    url: {
      type: cc.String,
      tooltip: CC_DEV && 'i18n:COMPONENT.webview.url',
      get: function get() {
        return this._url;
      },
      set: function set(url) {
        this._url = url;
        var impl = this._impl;

        if (impl) {
          impl.loadURL(url);
        }
      }
    },

    /**
     * !#en The webview's event callback , it will be triggered when certain webview event occurs.
     * !#zh WebView 的回调事件，当网页加载过程中，加载完成后或者加载出错时都会回调此函数
     * @property {Component.EventHandler[]} webviewLoadedEvents
     */
    webviewEvents: {
      "default": [],
      type: cc.Component.EventHandler
    }
  },
  statics: {
    EventType: EventType,
    // Impl will be overrided in the different platform.
    Impl: WebViewImpl
  },
  ctor: function ctor() {
    this._impl = new WebView.Impl();
  },
  onRestore: function onRestore() {
    if (!this._impl) {
      this._impl = new WebView.Impl();
    }
  },
  onEnable: function onEnable() {
    var impl = this._impl;
    impl.createDomElementIfNeeded(this.node.width, this.node.height);

    if (!CC_EDITOR) {
      impl.setEventListener(EventType.LOADED, this._onWebViewLoaded.bind(this));
      impl.setEventListener(EventType.LOADING, this._onWebViewLoading.bind(this));
      impl.setEventListener(EventType.ERROR, this._onWebViewLoadError.bind(this));
    }

    impl.loadURL(this._url);
    impl.setVisible(true);
  },
  onDisable: function onDisable() {
    var impl = this._impl;
    impl.setVisible(false);

    if (!CC_EDITOR) {
      impl.setEventListener(EventType.LOADED, emptyCallback);
      impl.setEventListener(EventType.LOADING, emptyCallback);
      impl.setEventListener(EventType.ERROR, emptyCallback);
    }
  },
  onDestroy: function onDestroy() {
    if (this._impl) {
      this._impl.destroy();

      this._impl = null;
    }
  },
  update: function update(dt) {
    if (this._impl) {
      this._impl.updateMatrix(this.node);
    }
  },
  _onWebViewLoaded: function _onWebViewLoaded() {
    cc.Component.EventHandler.emitEvents(this.webviewEvents, this, EventType.LOADED);
    this.node.emit('loaded', this);
  },
  _onWebViewLoading: function _onWebViewLoading() {
    cc.Component.EventHandler.emitEvents(this.webviewEvents, this, EventType.LOADING);
    this.node.emit('loading', this);
    return true;
  },
  _onWebViewLoadError: function _onWebViewLoadError() {
    cc.Component.EventHandler.emitEvents(this.webviewEvents, this, EventType.ERROR);
    this.node.emit('error', this);
  },

  /**
   * !#en
   * Set javascript interface scheme (see also setOnJSCallback). <br/>
   * Note: Supports only on the Android and iOS. For HTML5, please refer to the official documentation.<br/>
   * Please refer to the official documentation for more details.
   * !#zh
   * 设置 JavaScript 接口方案（与 'setOnJSCallback' 配套使用）。<br/>
   * 注意：只支持 Android 和 iOS ，Web 端用法请前往官方文档查看。<br/>
   * 详情请参阅官方文档
   * @method setJavascriptInterfaceScheme
   * @param {String} scheme
   */
  setJavascriptInterfaceScheme: function setJavascriptInterfaceScheme(scheme) {
    if (this._impl) {
      this._impl.setJavascriptInterfaceScheme(scheme);
    }
  },

  /**
   * !#en
   * This callback called when load URL that start with javascript
   * interface scheme (see also setJavascriptInterfaceScheme). <br/>
   * Note: Supports only on the Android and iOS. For HTML5, please refer to the official documentation.<br/>
   * Please refer to the official documentation for more details.
   * !#zh
   * 当加载 URL 以 JavaScript 接口方案开始时调用这个回调函数。<br/>
   * 注意：只支持 Android 和 iOS，Web 端用法请前往官方文档查看。
   * 详情请参阅官方文档
   * @method setOnJSCallback
   * @param {Function} callback
   */
  setOnJSCallback: function setOnJSCallback(callback) {
    if (this._impl) {
      this._impl.setOnJSCallback(callback);
    }
  },

  /**
   * !#en
   * Evaluates JavaScript in the context of the currently displayed page. <br/>
   * Please refer to the official document for more details <br/>
   * Note: Cross domain issues need to be resolved by yourself <br/>
   * !#zh
   * 执行 WebView 内部页面脚本（详情请参阅官方文档） <br/>
   * 注意：需要自行解决跨域问题
   * @method evaluateJS
   * @param {String} str
   */
  evaluateJS: function evaluateJS(str) {
    if (this._impl) {
      this._impl.evaluateJS(str);
    }
  }
});
cc.WebView = module.exports = WebView;
/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event loaded
 * @param {Event.EventCustom} event
 * @param {WebView} webView - The WebView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event loading
 * @param {Event.EventCustom} event
 * @param {WebView} webView - The WebView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event error
 * @param {Event.EventCustom} event
 * @param {WebView} webView - The WebView component.
 */

/**
 * !#en if you don't need the WebView and it isn't in any running Scene, you should
 * call the destroy method on this component or the associated node explicitly.
 * Otherwise, the created DOM element won't be removed from web page.
 * !#zh
 * 如果你不再使用 WebView，并且组件未添加到场景中，那么你必须手动对组件或所在节点调用 destroy。
 * 这样才能移除网页上的 DOM 节点，避免 Web 平台内存泄露。
 * @example
 * webview.node.parent = null;  // or  webview.node.removeFromParent(false);
 * // when you don't need webview anymore
 * webview.node.destroy();
 * @method destroy
 * @return {Boolean} whether it is the first time the destroy being called
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC93ZWJ2aWV3L0NDV2ViVmlldy5qcyJdLCJuYW1lcyI6WyJXZWJWaWV3SW1wbCIsInJlcXVpcmUiLCJFdmVudFR5cGUiLCJlbXB0eUNhbGxiYWNrIiwiV2ViVmlldyIsImNjIiwiQ2xhc3MiLCJuYW1lIiwiQ29tcG9uZW50IiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwibWVudSIsImV4ZWN1dGVJbkVkaXRNb2RlIiwicHJvcGVydGllcyIsIl91cmwiLCJ1cmwiLCJ0eXBlIiwiU3RyaW5nIiwidG9vbHRpcCIsIkNDX0RFViIsImdldCIsInNldCIsImltcGwiLCJfaW1wbCIsImxvYWRVUkwiLCJ3ZWJ2aWV3RXZlbnRzIiwiRXZlbnRIYW5kbGVyIiwic3RhdGljcyIsIkltcGwiLCJjdG9yIiwib25SZXN0b3JlIiwib25FbmFibGUiLCJjcmVhdGVEb21FbGVtZW50SWZOZWVkZWQiLCJub2RlIiwid2lkdGgiLCJoZWlnaHQiLCJzZXRFdmVudExpc3RlbmVyIiwiTE9BREVEIiwiX29uV2ViVmlld0xvYWRlZCIsImJpbmQiLCJMT0FESU5HIiwiX29uV2ViVmlld0xvYWRpbmciLCJFUlJPUiIsIl9vbldlYlZpZXdMb2FkRXJyb3IiLCJzZXRWaXNpYmxlIiwib25EaXNhYmxlIiwib25EZXN0cm95IiwiZGVzdHJveSIsInVwZGF0ZSIsImR0IiwidXBkYXRlTWF0cml4IiwiZW1pdEV2ZW50cyIsImVtaXQiLCJzZXRKYXZhc2NyaXB0SW50ZXJmYWNlU2NoZW1lIiwic2NoZW1lIiwic2V0T25KU0NhbGxiYWNrIiwiY2FsbGJhY2siLCJldmFsdWF0ZUpTIiwic3RyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBQ0E7QUFDSUMsRUFBQUEsVUE3Sm1CLHNCQTZKUEMsR0E3Sk8sRUE2SkY7QUFDYixRQUFJLEtBQUtuQyxLQUFULEVBQWdCO0FBQ1osV0FBS0EsS0FBTCxDQUFXa0MsVUFBWCxDQUFzQkMsR0FBdEI7QUFDSDtBQUNKO0FBaktrQixDQUFULENBQWQ7QUFxS0FyRCxFQUFFLENBQUNELE9BQUgsR0FBYXVELE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnhELE9BQTlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBXZWJWaWV3SW1wbCA9IHJlcXVpcmUoJy4vd2Vidmlldy1pbXBsJyk7XG5cbi8qKlxuICogISNlbiBXZWJWaWV3IGV2ZW50IHR5cGVcbiAqICEjemgg572R6aG16KeG5Zu+5LqL5Lu257G75Z6LXG4gKiBAZW51bSBXZWJWaWV3LkV2ZW50VHlwZVxuICovXG5jb25zdCBFdmVudFR5cGUgPSBXZWJWaWV3SW1wbC5FdmVudFR5cGU7XG5cblxuLyoqXG4gKiAhI2VuIFdlYiBwYWdlIExvYWQgY29tcGxldGVkLlxuICogISN6aCAg572R6aG15Yqg6L295a6M5oiQXG4gKiBAcHJvcGVydHkge1N0cmluZ30gTE9BREVEXG4gKi9cblxuLyoqXG4gKiAhI2VuIFdlYiBwYWdlIGlzIGxvYWRpbmcuXG4gKiAhI3poICDnvZHpobXliqDovb3kuK1cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMT0FESU5HXG4gKi9cblxuLyoqXG4gKiAhI2VuIFdlYiBwYWdlIGVycm9yIG9jY3VycyB3aGVuIGxvYWRpbmcuXG4gKiAhI3poICDnvZHpobXliqDovb3lh7rplJlcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBFUlJPUlxuICovXG5cbi8vXG5mdW5jdGlvbiBlbXB0eUNhbGxiYWNrICgpIHsgfVxuXG4vKipcbiAqICEjZW4gY2MuV2ViVmlldyBpcyBhIGNvbXBvbmVudCBmb3IgZGlzcGxheSB3ZWIgcGFnZXMgaW4gdGhlIGdhbWUuIEJlY2F1c2UgZGlmZmVyZW50IHBsYXRmb3JtcyBoYXZlIGRpZmZlcmVudCBhdXRob3JpemF0aW9uLCBBUEkgYW5kIGNvbnRyb2wgbWV0aG9kcyBmb3IgV2ViVmlldyBjb21wb25lbnQuIEFuZCBoYXZlIG5vdCB5ZXQgZm9ybWVkIGEgdW5pZmllZCBzdGFuZGFyZCwgb25seSBXZWIsIGlPUywgYW5kIEFuZHJvaWQgcGxhdGZvcm1zIGFyZSBjdXJyZW50bHkgc3VwcG9ydGVkLlxuICogISN6aCBXZWJWaWV3IOe7hOS7tu+8jOeUqOS6juWcqOa4uOaIj+S4reaYvuekuue9kemhteOAgueUseS6juS4jeWQjOW5s+WPsOWvueS6jiBXZWJWaWV3IOe7hOS7tueahOaOiOadg+OAgUFQSeOAgeaOp+WItuaWueW8j+mDveS4jeWQjO+8jOi/mOayoeacieW9ouaIkOe7n+S4gOeahOagh+WHhu+8jOaJgOS7peebruWJjeWPquaUr+aMgSBXZWLjgIFpT1Mg5ZKMIEFuZHJvaWQg5bmz5Y+w44CCXG4gKiBAY2xhc3MgV2ViVmlld1xuICogQGV4dGVuZHMgQ29tcG9uZW50XG4gKi9cbmxldCBXZWJWaWV3ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5XZWJWaWV3JyxcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQudWkvV2ViVmlldycsXG4gICAgICAgIGV4ZWN1dGVJbkVkaXRNb2RlOiB0cnVlXG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX3VybDogJycsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEEgZ2l2ZW4gVVJMIHRvIGJlIGxvYWRlZCBieSB0aGUgV2ViVmlldywgaXQgc2hvdWxkIGhhdmUgYSBodHRwIG9yIGh0dHBzIHByZWZpeC5cbiAgICAgICAgICogISN6aCDmjIflrpogV2ViVmlldyDliqDovb3nmoTnvZHlnYDvvIzlroPlupTor6XmmK/kuIDkuKogaHR0cCDmiJbogIUgaHR0cHMg5byA5aS055qE5a2X56ym5LiyXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSB1cmxcbiAgICAgICAgICovXG4gICAgICAgIHVybDoge1xuICAgICAgICAgICAgdHlwZTogY2MuU3RyaW5nLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC53ZWJ2aWV3LnVybCcsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdXJsO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHVybCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3VybCA9IHVybDtcbiAgICAgICAgICAgICAgICBsZXQgaW1wbCA9IHRoaXMuX2ltcGw7XG4gICAgICAgICAgICAgICAgaWYgKGltcGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaW1wbC5sb2FkVVJMKHVybCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSB3ZWJ2aWV3J3MgZXZlbnQgY2FsbGJhY2sgLCBpdCB3aWxsIGJlIHRyaWdnZXJlZCB3aGVuIGNlcnRhaW4gd2VidmlldyBldmVudCBvY2N1cnMuXG4gICAgICAgICAqICEjemggV2ViVmlldyDnmoTlm57osIPkuovku7bvvIzlvZPnvZHpobXliqDovb3ov4fnqIvkuK3vvIzliqDovb3lrozmiJDlkI7miJbogIXliqDovb3lh7rplJnml7bpg73kvJrlm57osIPmraTlh73mlbBcbiAgICAgICAgICogQHByb3BlcnR5IHtDb21wb25lbnQuRXZlbnRIYW5kbGVyW119IHdlYnZpZXdMb2FkZWRFdmVudHNcbiAgICAgICAgICovXG4gICAgICAgIHdlYnZpZXdFdmVudHM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlcixcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICBFdmVudFR5cGU6IEV2ZW50VHlwZSxcbiAgICAgICAgLy8gSW1wbCB3aWxsIGJlIG92ZXJyaWRlZCBpbiB0aGUgZGlmZmVyZW50IHBsYXRmb3JtLlxuICAgICAgICBJbXBsOiBXZWJWaWV3SW1wbFxuICAgIH0sXG5cbiAgICBjdG9yICgpIHtcbiAgICAgICAgdGhpcy5faW1wbCA9IG5ldyBXZWJWaWV3LkltcGwoKTtcbiAgICB9LFxuXG4gICAgb25SZXN0b3JlICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICB0aGlzLl9pbXBsID0gbmV3IFdlYlZpZXcuSW1wbCgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRW5hYmxlICgpIHtcbiAgICAgICAgbGV0IGltcGwgPSB0aGlzLl9pbXBsO1xuICAgICAgICBpbXBsLmNyZWF0ZURvbUVsZW1lbnRJZk5lZWRlZCh0aGlzLm5vZGUud2lkdGgsIHRoaXMubm9kZS5oZWlnaHQpO1xuICAgICAgICBpZiAoIUNDX0VESVRPUikge1xuICAgICAgICAgICAgaW1wbC5zZXRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5MT0FERUQsIHRoaXMuX29uV2ViVmlld0xvYWRlZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIGltcGwuc2V0RXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuTE9BRElORywgdGhpcy5fb25XZWJWaWV3TG9hZGluZy5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIGltcGwuc2V0RXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuRVJST1IsIHRoaXMuX29uV2ViVmlld0xvYWRFcnJvci5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgICBpbXBsLmxvYWRVUkwodGhpcy5fdXJsKTtcbiAgICAgICAgaW1wbC5zZXRWaXNpYmxlKHRydWUpO1xuICAgIH0sXG5cbiAgICBvbkRpc2FibGUgKCkge1xuICAgICAgICBsZXQgaW1wbCA9IHRoaXMuX2ltcGw7XG4gICAgICAgIGltcGwuc2V0VmlzaWJsZShmYWxzZSk7XG4gICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICBpbXBsLnNldEV2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLkxPQURFRCwgZW1wdHlDYWxsYmFjayk7XG4gICAgICAgICAgICBpbXBsLnNldEV2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLkxPQURJTkcsIGVtcHR5Q2FsbGJhY2spO1xuICAgICAgICAgICAgaW1wbC5zZXRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5FUlJPUiwgZW1wdHlDYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25EZXN0cm95ICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcbiAgICAgICAgICAgIHRoaXMuX2ltcGwuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5faW1wbCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlIChkdCkge1xuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgdGhpcy5faW1wbC51cGRhdGVNYXRyaXgodGhpcy5ub2RlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfb25XZWJWaWV3TG9hZGVkICgpIHtcbiAgICAgICAgY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlci5lbWl0RXZlbnRzKHRoaXMud2Vidmlld0V2ZW50cywgdGhpcywgRXZlbnRUeXBlLkxPQURFRCk7XG4gICAgICAgIHRoaXMubm9kZS5lbWl0KCdsb2FkZWQnLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX29uV2ViVmlld0xvYWRpbmcgKCkge1xuICAgICAgICBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyLmVtaXRFdmVudHModGhpcy53ZWJ2aWV3RXZlbnRzLCB0aGlzLCBFdmVudFR5cGUuTE9BRElORyk7XG4gICAgICAgIHRoaXMubm9kZS5lbWl0KCdsb2FkaW5nJywgdGhpcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICBfb25XZWJWaWV3TG9hZEVycm9yICgpIHtcbiAgICAgICAgY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlci5lbWl0RXZlbnRzKHRoaXMud2Vidmlld0V2ZW50cywgdGhpcywgRXZlbnRUeXBlLkVSUk9SKTtcbiAgICAgICAgdGhpcy5ub2RlLmVtaXQoJ2Vycm9yJywgdGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTZXQgamF2YXNjcmlwdCBpbnRlcmZhY2Ugc2NoZW1lIChzZWUgYWxzbyBzZXRPbkpTQ2FsbGJhY2spLiA8YnIvPlxuICAgICAqIE5vdGU6IFN1cHBvcnRzIG9ubHkgb24gdGhlIEFuZHJvaWQgYW5kIGlPUy4gRm9yIEhUTUw1LCBwbGVhc2UgcmVmZXIgdG8gdGhlIG9mZmljaWFsIGRvY3VtZW50YXRpb24uPGJyLz5cbiAgICAgKiBQbGVhc2UgcmVmZXIgdG8gdGhlIG9mZmljaWFsIGRvY3VtZW50YXRpb24gZm9yIG1vcmUgZGV0YWlscy5cbiAgICAgKiAhI3poXG4gICAgICog6K6+572uIEphdmFTY3JpcHQg5o6l5Y+j5pa55qGI77yI5LiOICdzZXRPbkpTQ2FsbGJhY2snIOmFjeWll+S9v+eUqO+8ieOAgjxici8+XG4gICAgICog5rOo5oSP77ya5Y+q5pSv5oyBIEFuZHJvaWQg5ZKMIGlPUyDvvIxXZWIg56uv55So5rOV6K+35YmN5b6A5a6Y5pa55paH5qGj5p+l55yL44CCPGJyLz5cbiAgICAgKiDor6bmg4Xor7flj4LpmIXlrpjmlrnmlofmoaNcbiAgICAgKiBAbWV0aG9kIHNldEphdmFzY3JpcHRJbnRlcmZhY2VTY2hlbWVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2NoZW1lXG4gICAgICovXG4gICAgc2V0SmF2YXNjcmlwdEludGVyZmFjZVNjaGVtZSAoc2NoZW1lKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICB0aGlzLl9pbXBsLnNldEphdmFzY3JpcHRJbnRlcmZhY2VTY2hlbWUoc2NoZW1lKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVGhpcyBjYWxsYmFjayBjYWxsZWQgd2hlbiBsb2FkIFVSTCB0aGF0IHN0YXJ0IHdpdGggamF2YXNjcmlwdFxuICAgICAqIGludGVyZmFjZSBzY2hlbWUgKHNlZSBhbHNvIHNldEphdmFzY3JpcHRJbnRlcmZhY2VTY2hlbWUpLiA8YnIvPlxuICAgICAqIE5vdGU6IFN1cHBvcnRzIG9ubHkgb24gdGhlIEFuZHJvaWQgYW5kIGlPUy4gRm9yIEhUTUw1LCBwbGVhc2UgcmVmZXIgdG8gdGhlIG9mZmljaWFsIGRvY3VtZW50YXRpb24uPGJyLz5cbiAgICAgKiBQbGVhc2UgcmVmZXIgdG8gdGhlIG9mZmljaWFsIGRvY3VtZW50YXRpb24gZm9yIG1vcmUgZGV0YWlscy5cbiAgICAgKiAhI3poXG4gICAgICog5b2T5Yqg6L29IFVSTCDku6UgSmF2YVNjcmlwdCDmjqXlj6PmlrnmoYjlvIDlp4vml7bosIPnlKjov5nkuKrlm57osIPlh73mlbDjgII8YnIvPlxuICAgICAqIOazqOaEj++8muWPquaUr+aMgSBBbmRyb2lkIOWSjCBpT1PvvIxXZWIg56uv55So5rOV6K+35YmN5b6A5a6Y5pa55paH5qGj5p+l55yL44CCXG4gICAgICog6K+m5oOF6K+35Y+C6ZiF5a6Y5pa55paH5qGjXG4gICAgICogQG1ldGhvZCBzZXRPbkpTQ2FsbGJhY2tcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqL1xuICAgIHNldE9uSlNDYWxsYmFjayAoY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcbiAgICAgICAgICAgIHRoaXMuX2ltcGwuc2V0T25KU0NhbGxiYWNrKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogRXZhbHVhdGVzIEphdmFTY3JpcHQgaW4gdGhlIGNvbnRleHQgb2YgdGhlIGN1cnJlbnRseSBkaXNwbGF5ZWQgcGFnZS4gPGJyLz5cbiAgICAgKiBQbGVhc2UgcmVmZXIgdG8gdGhlIG9mZmljaWFsIGRvY3VtZW50IGZvciBtb3JlIGRldGFpbHMgPGJyLz5cbiAgICAgKiBOb3RlOiBDcm9zcyBkb21haW4gaXNzdWVzIG5lZWQgdG8gYmUgcmVzb2x2ZWQgYnkgeW91cnNlbGYgPGJyLz5cbiAgICAgKiAhI3poXG4gICAgICog5omn6KGMIFdlYlZpZXcg5YaF6YOo6aG16Z2i6ISa5pys77yI6K+m5oOF6K+35Y+C6ZiF5a6Y5pa55paH5qGj77yJIDxici8+XG4gICAgICog5rOo5oSP77ya6ZyA6KaB6Ieq6KGM6Kej5Yaz6Leo5Z+f6Zeu6aKYXG4gICAgICogQG1ldGhvZCBldmFsdWF0ZUpTXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAgICAqL1xuICAgIGV2YWx1YXRlSlMgKHN0cikge1xuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgdGhpcy5faW1wbC5ldmFsdWF0ZUpTKHN0cik7XG4gICAgICAgIH1cbiAgICB9LFxuXG59KTtcblxuY2MuV2ViVmlldyA9IG1vZHVsZS5leHBvcnRzID0gV2ViVmlldztcbi8qKlxuICogISNlblxuICogTm90ZTogVGhpcyBldmVudCBpcyBlbWl0dGVkIGZyb20gdGhlIG5vZGUgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBiZWxvbmdzLlxuICogISN6aFxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXG4gKiBAZXZlbnQgbG9hZGVkXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxuICogQHBhcmFtIHtXZWJWaWV3fSB3ZWJWaWV3IC0gVGhlIFdlYlZpZXcgY29tcG9uZW50LlxuICovXG5cbi8qKlxuICogISNlblxuICogTm90ZTogVGhpcyBldmVudCBpcyBlbWl0dGVkIGZyb20gdGhlIG5vZGUgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBiZWxvbmdzLlxuICogISN6aFxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXG4gKiBAZXZlbnQgbG9hZGluZ1xuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqIEBwYXJhbSB7V2ViVmlld30gd2ViVmlldyAtIFRoZSBXZWJWaWV3IGNvbXBvbmVudC5cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IGVycm9yXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxuICogQHBhcmFtIHtXZWJWaWV3fSB3ZWJWaWV3IC0gVGhlIFdlYlZpZXcgY29tcG9uZW50LlxuICovXG5cbi8qKlxuICogISNlbiBpZiB5b3UgZG9uJ3QgbmVlZCB0aGUgV2ViVmlldyBhbmQgaXQgaXNuJ3QgaW4gYW55IHJ1bm5pbmcgU2NlbmUsIHlvdSBzaG91bGRcbiAqIGNhbGwgdGhlIGRlc3Ryb3kgbWV0aG9kIG9uIHRoaXMgY29tcG9uZW50IG9yIHRoZSBhc3NvY2lhdGVkIG5vZGUgZXhwbGljaXRseS5cbiAqIE90aGVyd2lzZSwgdGhlIGNyZWF0ZWQgRE9NIGVsZW1lbnQgd29uJ3QgYmUgcmVtb3ZlZCBmcm9tIHdlYiBwYWdlLlxuICogISN6aFxuICog5aaC5p6c5L2g5LiN5YaN5L2/55SoIFdlYlZpZXfvvIzlubbkuJTnu4Tku7bmnKrmt7vliqDliLDlnLrmma/kuK3vvIzpgqPkuYjkvaDlv4XpobvmiYvliqjlr7nnu4Tku7bmiJbmiYDlnKjoioLngrnosIPnlKggZGVzdHJveeOAglxuICog6L+Z5qC35omN6IO956e76Zmk572R6aG15LiK55qEIERPTSDoioLngrnvvIzpgb/lhY0gV2ViIOW5s+WPsOWGheWtmOazhOmcsuOAglxuICogQGV4YW1wbGVcbiAqIHdlYnZpZXcubm9kZS5wYXJlbnQgPSBudWxsOyAgLy8gb3IgIHdlYnZpZXcubm9kZS5yZW1vdmVGcm9tUGFyZW50KGZhbHNlKTtcbiAqIC8vIHdoZW4geW91IGRvbid0IG5lZWQgd2VidmlldyBhbnltb3JlXG4gKiB3ZWJ2aWV3Lm5vZGUuZGVzdHJveSgpO1xuICogQG1ldGhvZCBkZXN0cm95XG4gKiBAcmV0dXJuIHtCb29sZWFufSB3aGV0aGVyIGl0IGlzIHRoZSBmaXJzdCB0aW1lIHRoZSBkZXN0cm95IGJlaW5nIGNhbGxlZFxuICovXG4iXSwic291cmNlUm9vdCI6Ii8ifQ==