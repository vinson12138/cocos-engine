
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/editbox/WebEditBoxImpl.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _mat = _interopRequireDefault(require("../../value-types/mat4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
var utils = require('../../platform/utils');

var macro = require('../../platform/CCMacro');

var Types = require('./types');

var Label = require('../CCLabel');

var tabIndexUtil = require('./tabIndexUtil');

var EditBox = cc.EditBox;
var js = cc.js;
var InputMode = Types.InputMode;
var InputFlag = Types.InputFlag;
var KeyboardReturnType = Types.KeyboardReturnType; // polyfill

var polyfill = {
  zoomInvalid: false
};

if (cc.sys.OS_ANDROID === cc.sys.os && (cc.sys.browserType === cc.sys.BROWSER_TYPE_SOUGOU || cc.sys.browserType === cc.sys.BROWSER_TYPE_360)) {
  polyfill.zoomInvalid = true;
} // https://segmentfault.com/q/1010000002914610


var DELAY_TIME = 800;
var SCROLLY = 100;
var LEFT_PADDING = 2; // private static property

var _domCount = 0;

var _vec3 = cc.v3();

var _currentEditBoxImpl = null; // on mobile

var _fullscreen = false;
var _autoResize = false;
var BaseClass = EditBox._ImplClass; // This is an adapter for EditBoxImpl on web platform.
// For more adapters on other platforms, please inherit from EditBoxImplBase and implement the interface.

function WebEditBoxImpl() {
  BaseClass.call(this);
  this._domId = "EditBoxId_" + ++_domCount;
  this._placeholderStyleSheet = null;
  this._elem = null;
  this._isTextArea = false; // matrix

  this._worldMat = new _mat["default"]();
  this._cameraMat = new _mat["default"](); // matrix cache

  this._m00 = 0;
  this._m01 = 0;
  this._m04 = 0;
  this._m05 = 0;
  this._m12 = 0;
  this._m13 = 0;
  this._w = 0;
  this._h = 0; // viewport cache

  this._cacheViewportRect = cc.rect(0, 0, 0, 0); // inputType cache

  this._inputMode = null;
  this._inputFlag = null;
  this._returnType = null; // event listeners

  this._eventListeners = {}; // update style sheet cache

  this._textLabelFont = null;
  this._textLabelFontSize = null;
  this._textLabelFontColor = null;
  this._textLabelAlign = null;
  this._placeholderLabelFont = null;
  this._placeholderLabelFontSize = null;
  this._placeholderLabelFontColor = null;
  this._placeholderLabelAlign = null;
  this._placeholderLineHeight = null;
}

js.extend(WebEditBoxImpl, BaseClass);
EditBox._ImplClass = WebEditBoxImpl;
Object.assign(WebEditBoxImpl.prototype, {
  // =================================
  // implement EditBoxImplBase interface
  init: function init(delegate) {
    if (!delegate) {
      return;
    }

    this._delegate = delegate;

    if (delegate.inputMode === InputMode.ANY) {
      this._createTextArea();
    } else {
      this._createInput();
    }

    tabIndexUtil.add(this);
    this.setTabIndex(delegate.tabIndex);

    this._initStyleSheet();

    this._registerEventListeners();

    this._addDomToGameContainer();

    _fullscreen = cc.view.isAutoFullScreenEnabled();
    _autoResize = cc.view._resizeWithBrowserSize;
  },
  clear: function clear() {
    this._removeEventListeners();

    this._removeDomFromGameContainer();

    tabIndexUtil.remove(this); // clear while editing

    if (_currentEditBoxImpl === this) {
      _currentEditBoxImpl = null;
    }
  },
  update: function update() {
    this._updateMatrix();
  },
  setTabIndex: function setTabIndex(index) {
    this._elem.tabIndex = index;
    tabIndexUtil.resort();
  },
  setSize: function setSize(width, height) {
    var elem = this._elem;
    elem.style.width = width + 'px';
    elem.style.height = height + 'px';
  },
  beginEditing: function beginEditing() {
    if (_currentEditBoxImpl && _currentEditBoxImpl !== this) {
      _currentEditBoxImpl.setFocus(false);
    }

    this._editing = true;
    _currentEditBoxImpl = this;

    this._delegate.editBoxEditingDidBegan();

    this._showDom();

    this._elem.focus(); // set focus

  },
  endEditing: function endEditing() {
    if (this._elem) {
      this._elem.blur();
    }
  },
  // ==========================================================================
  // implement dom input
  _createInput: function _createInput() {
    this._isTextArea = false;
    this._elem = document.createElement('input');
  },
  _createTextArea: function _createTextArea() {
    this._isTextArea = true;
    this._elem = document.createElement('textarea');
  },
  _addDomToGameContainer: function _addDomToGameContainer() {
    cc.game.container.appendChild(this._elem);
    document.head.appendChild(this._placeholderStyleSheet);
  },
  _removeDomFromGameContainer: function _removeDomFromGameContainer() {
    var hasElem = utils.contains(cc.game.container, this._elem);

    if (hasElem) {
      cc.game.container.removeChild(this._elem);
    }

    var hasStyleSheet = utils.contains(document.head, this._placeholderStyleSheet);

    if (hasStyleSheet) {
      document.head.removeChild(this._placeholderStyleSheet);
    }

    delete this._elem;
    delete this._placeholderStyleSheet;
  },
  _showDom: function _showDom() {
    this._updateMaxLength();

    this._updateInputType();

    this._updateStyleSheet();

    this._elem.style.display = '';

    this._delegate._hideLabels();

    if (cc.sys.isMobile) {
      this._showDomOnMobile();
    }
  },
  _hideDom: function _hideDom() {
    var elem = this._elem;
    elem.style.display = 'none';

    this._delegate._showLabels();

    if (cc.sys.isMobile) {
      this._hideDomOnMobile();
    }
  },
  _showDomOnMobile: function _showDomOnMobile() {
    if (cc.sys.os !== cc.sys.OS_ANDROID) {
      return;
    }

    if (_fullscreen) {
      cc.view.enableAutoFullScreen(false);
      cc.screen.exitFullScreen();
    }

    if (_autoResize) {
      cc.view.resizeWithBrowserSize(false);
    }

    this._adjustWindowScroll();
  },
  _hideDomOnMobile: function _hideDomOnMobile() {
    if (cc.sys.os === cc.sys.OS_ANDROID) {
      if (_autoResize) {
        cc.view.resizeWithBrowserSize(true);
      } // In case enter full screen when soft keyboard still showing


      setTimeout(function () {
        if (!_currentEditBoxImpl) {
          if (_fullscreen) {
            cc.view.enableAutoFullScreen(true);
          }
        }
      }, DELAY_TIME);
    } // Some browser like wechat on iOS need to mannully scroll back window


    this._scrollBackWindow();
  },
  // adjust view to editBox
  _adjustWindowScroll: function _adjustWindowScroll() {
    var self = this;
    setTimeout(function () {
      if (window.scrollY < SCROLLY) {
        self._elem.scrollIntoView({
          block: "start",
          inline: "nearest",
          behavior: "smooth"
        });
      }
    }, DELAY_TIME);
  },
  _scrollBackWindow: function _scrollBackWindow() {
    setTimeout(function () {
      // FIX: wechat browser bug on iOS
      // If gameContainer is included in iframe,
      // Need to scroll the top window, not the one in the iframe
      // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/top
      var sys = cc.sys;

      if (sys.browserType === sys.BROWSER_TYPE_WECHAT && sys.os === sys.OS_IOS) {
        window.top && window.top.scrollTo(0, 0);
        return;
      }

      window.scrollTo(0, 0);
    }, DELAY_TIME);
  },
  _updateCameraMatrix: function _updateCameraMatrix() {
    var node = this._delegate.node;
    node.getWorldMatrix(this._worldMat);
    var worldMat = this._worldMat;
    var nodeContentSize = node._contentSize,
        nodeAnchorPoint = node._anchorPoint;
    _vec3.x = -nodeAnchorPoint.x * nodeContentSize.width;
    _vec3.y = -nodeAnchorPoint.y * nodeContentSize.height;

    _mat["default"].transform(worldMat, worldMat, _vec3); // can't find node camera in editor


    if (CC_EDITOR) {
      this._cameraMat = worldMat;
    } else {
      var camera = cc.Camera.findCamera(node);

      if (!camera) {
        return false;
      }

      camera.getWorldToScreenMatrix2D(this._cameraMat);

      _mat["default"].mul(this._cameraMat, this._cameraMat, worldMat);
    }

    return true;
  },
  _updateMatrix: function _updateMatrix() {
    if (CC_EDITOR || !this._updateCameraMatrix()) {
      return;
    }

    var cameraMatm = this._cameraMat.m;
    var node = this._delegate.node;
    var localView = cc.view; // check whether need to update

    if (this._m00 === cameraMatm[0] && this._m01 === cameraMatm[1] && this._m04 === cameraMatm[4] && this._m05 === cameraMatm[5] && this._m12 === cameraMatm[12] && this._m13 === cameraMatm[13] && this._w === node._contentSize.width && this._h === node._contentSize.height && this._cacheViewportRect.equals(localView._viewportRect)) {
      return;
    } // update matrix cache


    this._m00 = cameraMatm[0];
    this._m01 = cameraMatm[1];
    this._m04 = cameraMatm[4];
    this._m05 = cameraMatm[5];
    this._m12 = cameraMatm[12];
    this._m13 = cameraMatm[13];
    this._w = node._contentSize.width;
    this._h = node._contentSize.height; // update viewport cache

    this._cacheViewportRect.set(localView._viewportRect);

    var scaleX = localView._scaleX,
        scaleY = localView._scaleY,
        viewport = localView._viewportRect,
        dpr = localView._devicePixelRatio;
    scaleX /= dpr;
    scaleY /= dpr;
    var container = cc.game.container;
    var a = cameraMatm[0] * scaleX,
        b = cameraMatm[1],
        c = cameraMatm[4],
        d = cameraMatm[5] * scaleY;
    var offsetX = container && container.style.paddingLeft && parseInt(container.style.paddingLeft);
    offsetX += viewport.x / dpr;
    var offsetY = container && container.style.paddingBottom && parseInt(container.style.paddingBottom);
    offsetY += viewport.y / dpr;
    var tx = cameraMatm[12] * scaleX + offsetX,
        ty = cameraMatm[13] * scaleY + offsetY;

    if (polyfill.zoomInvalid) {
      this.setSize(node.width * a, node.height * d);
      a = 1;
      d = 1;
    }

    var elem = this._elem;
    var matrix = "matrix(" + a + "," + -b + "," + -c + "," + d + "," + tx + "," + -ty + ")";
    elem.style['transform'] = matrix;
    elem.style['-webkit-transform'] = matrix;
    elem.style['transform-origin'] = '0px 100% 0px';
    elem.style['-webkit-transform-origin'] = '0px 100% 0px';
  },
  // ===========================================
  // input type and max length
  _updateInputType: function _updateInputType() {
    var delegate = this._delegate,
        inputMode = delegate.inputMode,
        inputFlag = delegate.inputFlag,
        returnType = delegate.returnType,
        elem = this._elem; // whether need to update

    if (this._inputMode === inputMode && this._inputFlag === inputFlag && this._returnType === returnType) {
      return;
    } // update cache


    this._inputMode = inputMode;
    this._inputFlag = inputFlag;
    this._returnType = returnType; // FIX ME: TextArea actually dose not support password type.

    if (this._isTextArea) {
      // input flag
      var _textTransform = 'none';

      if (inputFlag === InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
        _textTransform = 'uppercase';
      } else if (inputFlag === InputFlag.INITIAL_CAPS_WORD) {
        _textTransform = 'capitalize';
      }

      elem.style.textTransform = _textTransform;
      return;
    } // begin to updateInputType


    if (inputFlag === InputFlag.PASSWORD) {
      elem.type = 'password';
      elem.style.textTransform = 'none';
      return;
    } // input mode


    var type = elem.type;

    if (inputMode === InputMode.EMAIL_ADDR) {
      type = 'email';
    } else if (inputMode === InputMode.NUMERIC || inputMode === InputMode.DECIMAL) {
      type = 'number';
    } else if (inputMode === InputMode.PHONE_NUMBER) {
      type = 'number';
      elem.pattern = '[0-9]*';
    } else if (inputMode === InputMode.URL) {
      type = 'url';
    } else {
      type = 'text';

      if (returnType === KeyboardReturnType.SEARCH) {
        type = 'search';
      }
    }

    elem.type = type; // input flag

    var textTransform = 'none';

    if (inputFlag === InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
      textTransform = 'uppercase';
    } else if (inputFlag === InputFlag.INITIAL_CAPS_WORD) {
      textTransform = 'capitalize';
    }

    elem.style.textTransform = textTransform;
  },
  _updateMaxLength: function _updateMaxLength() {
    var maxLength = this._delegate.maxLength;

    if (maxLength < 0) {
      //we can't set Number.MAX_VALUE to input's maxLength property
      //so we use a magic number here, it should works at most use cases.
      maxLength = 65535;
    }

    this._elem.maxLength = maxLength;
  },
  // ===========================================
  // style sheet
  _initStyleSheet: function _initStyleSheet() {
    var elem = this._elem;
    elem.style.display = 'none';
    elem.style.border = 0;
    elem.style.background = 'transparent';
    elem.style.width = '100%';
    elem.style.height = '100%';
    elem.style.active = 0;
    elem.style.outline = 'medium';
    elem.style.padding = '0';
    elem.style.textTransform = 'none';
    elem.style.position = "absolute";
    elem.style.bottom = "0px";
    elem.style.left = LEFT_PADDING + "px";
    elem.className = "cocosEditBox";
    elem.id = this._domId;

    if (!this._isTextArea) {
      elem.type = 'text';
      elem.style['-moz-appearance'] = 'textfield';
    } else {
      elem.style.resize = 'none';
      elem.style.overflow_y = 'scroll';
    }

    this._placeholderStyleSheet = document.createElement('style');
  },
  _updateStyleSheet: function _updateStyleSheet() {
    var delegate = this._delegate,
        elem = this._elem;
    elem.value = delegate.string;
    elem.placeholder = delegate.placeholder;

    this._updateTextLabel(delegate.textLabel);

    this._updatePlaceholderLabel(delegate.placeholderLabel);
  },
  _updateTextLabel: function _updateTextLabel(textLabel) {
    if (!textLabel) {
      return;
    } // get font


    var font = textLabel.font;

    if (font && !(font instanceof cc.BitmapFont)) {
      font = font._fontFamily;
    } else {
      font = textLabel.fontFamily;
    } // get font size


    var fontSize = textLabel.fontSize * textLabel.node.scaleY; // whether need to update

    if (this._textLabelFont === font && this._textLabelFontSize === fontSize && this._textLabelFontColor === textLabel.fontColor && this._textLabelAlign === textLabel.horizontalAlign) {
      return;
    } // update cache


    this._textLabelFont = font;
    this._textLabelFontSize = fontSize;
    this._textLabelFontColor = textLabel.fontColor;
    this._textLabelAlign = textLabel.horizontalAlign;
    var elem = this._elem; // font size

    elem.style.fontSize = fontSize + "px"; // font color

    elem.style.color = textLabel.node.color.toCSS(); // font family

    elem.style.fontFamily = font; // text-align

    switch (textLabel.horizontalAlign) {
      case Label.HorizontalAlign.LEFT:
        elem.style.textAlign = 'left';
        break;

      case Label.HorizontalAlign.CENTER:
        elem.style.textAlign = 'center';
        break;

      case Label.HorizontalAlign.RIGHT:
        elem.style.textAlign = 'right';
        break;
    } // lineHeight
    // Can't sync lineHeight property, because lineHeight would change the touch area of input

  },
  _updatePlaceholderLabel: function _updatePlaceholderLabel(placeholderLabel) {
    if (!placeholderLabel) {
      return;
    } // get font


    var font = placeholderLabel.font;

    if (font && !(font instanceof cc.BitmapFont)) {
      font = placeholderLabel.font._fontFamily;
    } else {
      font = placeholderLabel.fontFamily;
    } // get font size


    var fontSize = placeholderLabel.fontSize * placeholderLabel.node.scaleY; // whether need to update

    if (this._placeholderLabelFont === font && this._placeholderLabelFontSize === fontSize && this._placeholderLabelFontColor === placeholderLabel.fontColor && this._placeholderLabelAlign === placeholderLabel.horizontalAlign && this._placeholderLineHeight === placeholderLabel.fontSize) {
      return;
    } // update cache


    this._placeholderLabelFont = font;
    this._placeholderLabelFontSize = fontSize;
    this._placeholderLabelFontColor = placeholderLabel.fontColor;
    this._placeholderLabelAlign = placeholderLabel.horizontalAlign;
    this._placeholderLineHeight = placeholderLabel.fontSize;
    var styleEl = this._placeholderStyleSheet; // font color

    var fontColor = placeholderLabel.node.color.toCSS(); // line height

    var lineHeight = placeholderLabel.fontSize; // top vertical align by default
    // horizontal align

    var horizontalAlign;

    switch (placeholderLabel.horizontalAlign) {
      case Label.HorizontalAlign.LEFT:
        horizontalAlign = 'left';
        break;

      case Label.HorizontalAlign.CENTER:
        horizontalAlign = 'center';
        break;

      case Label.HorizontalAlign.RIGHT:
        horizontalAlign = 'right';
        break;
    }

    styleEl.innerHTML = "#" + this._domId + "::-webkit-input-placeholder,#" + this._domId + "::-moz-placeholder,#" + this._domId + ":-ms-input-placeholder" + ("{text-transform: initial; font-family: " + font + "; font-size: " + fontSize + "px; color: " + fontColor + "; line-height: " + lineHeight + "px; text-align: " + horizontalAlign + ";}"); // EDGE_BUG_FIX: hide clear button, because clearing input box in Edge does not emit input event 
    // issue refference: https://github.com/angular/angular/issues/26307

    if (cc.sys.browserType === cc.sys.BROWSER_TYPE_EDGE) {
      styleEl.innerHTML += "#" + this._domId + "::-ms-clear{display: none;}";
    }
  },
  // ===========================================
  // handle event listeners
  _registerEventListeners: function _registerEventListeners() {
    var impl = this,
        elem = this._elem,
        inputLock = false,
        cbs = this._eventListeners;

    cbs.compositionStart = function () {
      inputLock = true;
    };

    cbs.compositionEnd = function () {
      inputLock = false;

      impl._delegate.editBoxTextChanged(elem.value);
    };

    cbs.onInput = function () {
      if (inputLock) {
        return;
      } // input of number type doesn't support maxLength attribute


      var maxLength = impl._delegate.maxLength;

      if (maxLength >= 0) {
        elem.value = elem.value.slice(0, maxLength);
      }

      impl._delegate.editBoxTextChanged(elem.value);
    }; // There are 2 ways to focus on the input element:
    // Click the input element, or call input.focus().
    // Both need to adjust window scroll.


    cbs.onClick = function (e) {
      // In case operation sequence: click input, hide keyboard, then click again.
      if (impl._editing) {
        if (cc.sys.isMobile) {
          impl._adjustWindowScroll();
        }
      }
    };

    cbs.onKeydown = function (e) {
      if (e.keyCode === macro.KEY.enter) {
        e.stopPropagation();

        impl._delegate.editBoxEditingReturn();

        if (!impl._isTextArea) {
          elem.blur();
        }
      } else if (e.keyCode === macro.KEY.tab) {
        e.stopPropagation();
        e.preventDefault();
        tabIndexUtil.next(impl);
      }
    };

    cbs.onBlur = function () {
      // on mobile, sometimes input element doesn't fire compositionend event
      if (cc.sys.isMobile && inputLock) {
        cbs.compositionEnd();
      }

      impl._editing = false;
      _currentEditBoxImpl = null;

      impl._hideDom();

      impl._delegate.editBoxEditingDidEnded();
    };

    elem.addEventListener('compositionstart', cbs.compositionStart);
    elem.addEventListener('compositionend', cbs.compositionEnd);
    elem.addEventListener('input', cbs.onInput);
    elem.addEventListener('keydown', cbs.onKeydown);
    elem.addEventListener('blur', cbs.onBlur);
    elem.addEventListener('touchstart', cbs.onClick);
  },
  _removeEventListeners: function _removeEventListeners() {
    var elem = this._elem,
        cbs = this._eventListeners;
    elem.removeEventListener('compositionstart', cbs.compositionStart);
    elem.removeEventListener('compositionend', cbs.compositionEnd);
    elem.removeEventListener('input', cbs.onInput);
    elem.removeEventListener('keydown', cbs.onKeydown);
    elem.removeEventListener('blur', cbs.onBlur);
    elem.removeEventListener('touchstart', cbs.onClick);
    cbs.compositionStart = null;
    cbs.compositionEnd = null;
    cbs.onInput = null;
    cbs.onKeydown = null;
    cbs.onBlur = null;
    cbs.onClick = null;
  }
});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvZWRpdGJveC9XZWJFZGl0Qm94SW1wbC5qcyJdLCJuYW1lcyI6WyJ1dGlscyIsInJlcXVpcmUiLCJtYWNybyIsIlR5cGVzIiwiTGFiZWwiLCJ0YWJJbmRleFV0aWwiLCJFZGl0Qm94IiwiY2MiLCJqcyIsIklucHV0TW9kZSIsIklucHV0RmxhZyIsIktleWJvYXJkUmV0dXJuVHlwZSIsInBvbHlmaWxsIiwiem9vbUludmFsaWQiLCJzeXMiLCJPU19BTkRST0lEIiwib3MiLCJicm93c2VyVHlwZSIsIkJST1dTRVJfVFlQRV9TT1VHT1UiLCJCUk9XU0VSX1RZUEVfMzYwIiwiREVMQVlfVElNRSIsIlNDUk9MTFkiLCJMRUZUX1BBRERJTkciLCJfZG9tQ291bnQiLCJfdmVjMyIsInYzIiwiX2N1cnJlbnRFZGl0Qm94SW1wbCIsIl9mdWxsc2NyZWVuIiwiX2F1dG9SZXNpemUiLCJCYXNlQ2xhc3MiLCJfSW1wbENsYXNzIiwiV2ViRWRpdEJveEltcGwiLCJjYWxsIiwiX2RvbUlkIiwiX3BsYWNlaG9sZGVyU3R5bGVTaGVldCIsIl9lbGVtIiwiX2lzVGV4dEFyZWEiLCJfd29ybGRNYXQiLCJNYXQ0IiwiX2NhbWVyYU1hdCIsIl9tMDAiLCJfbTAxIiwiX20wNCIsIl9tMDUiLCJfbTEyIiwiX20xMyIsIl93IiwiX2giLCJfY2FjaGVWaWV3cG9ydFJlY3QiLCJyZWN0IiwiX2lucHV0TW9kZSIsIl9pbnB1dEZsYWciLCJfcmV0dXJuVHlwZSIsIl9ldmVudExpc3RlbmVycyIsIl90ZXh0TGFiZWxGb250IiwiX3RleHRMYWJlbEZvbnRTaXplIiwiX3RleHRMYWJlbEZvbnRDb2xvciIsIl90ZXh0TGFiZWxBbGlnbiIsIl9wbGFjZWhvbGRlckxhYmVsRm9udCIsIl9wbGFjZWhvbGRlckxhYmVsRm9udFNpemUiLCJfcGxhY2Vob2xkZXJMYWJlbEZvbnRDb2xvciIsIl9wbGFjZWhvbGRlckxhYmVsQWxpZ24iLCJfcGxhY2Vob2xkZXJMaW5lSGVpZ2h0IiwiZXh0ZW5kIiwiT2JqZWN0IiwiYXNzaWduIiwicHJvdG90eXBlIiwiaW5pdCIsImRlbGVnYXRlIiwiX2RlbGVnYXRlIiwiaW5wdXRNb2RlIiwiQU5ZIiwiX2NyZWF0ZVRleHRBcmVhIiwiX2NyZWF0ZUlucHV0IiwiYWRkIiwic2V0VGFiSW5kZXgiLCJ0YWJJbmRleCIsIl9pbml0U3R5bGVTaGVldCIsIl9yZWdpc3RlckV2ZW50TGlzdGVuZXJzIiwiX2FkZERvbVRvR2FtZUNvbnRhaW5lciIsInZpZXciLCJpc0F1dG9GdWxsU2NyZWVuRW5hYmxlZCIsIl9yZXNpemVXaXRoQnJvd3NlclNpemUiLCJjbGVhciIsIl9yZW1vdmVFdmVudExpc3RlbmVycyIsIl9yZW1vdmVEb21Gcm9tR2FtZUNvbnRhaW5lciIsInJlbW92ZSIsInVwZGF0ZSIsIl91cGRhdGVNYXRyaXgiLCJpbmRleCIsInJlc29ydCIsInNldFNpemUiLCJ3aWR0aCIsImhlaWdodCIsImVsZW0iLCJzdHlsZSIsImJlZ2luRWRpdGluZyIsInNldEZvY3VzIiwiX2VkaXRpbmciLCJlZGl0Qm94RWRpdGluZ0RpZEJlZ2FuIiwiX3Nob3dEb20iLCJmb2N1cyIsImVuZEVkaXRpbmciLCJibHVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiZ2FtZSIsImNvbnRhaW5lciIsImFwcGVuZENoaWxkIiwiaGVhZCIsImhhc0VsZW0iLCJjb250YWlucyIsInJlbW92ZUNoaWxkIiwiaGFzU3R5bGVTaGVldCIsIl91cGRhdGVNYXhMZW5ndGgiLCJfdXBkYXRlSW5wdXRUeXBlIiwiX3VwZGF0ZVN0eWxlU2hlZXQiLCJkaXNwbGF5IiwiX2hpZGVMYWJlbHMiLCJpc01vYmlsZSIsIl9zaG93RG9tT25Nb2JpbGUiLCJfaGlkZURvbSIsIl9zaG93TGFiZWxzIiwiX2hpZGVEb21Pbk1vYmlsZSIsImVuYWJsZUF1dG9GdWxsU2NyZWVuIiwic2NyZWVuIiwiZXhpdEZ1bGxTY3JlZW4iLCJyZXNpemVXaXRoQnJvd3NlclNpemUiLCJfYWRqdXN0V2luZG93U2Nyb2xsIiwic2V0VGltZW91dCIsIl9zY3JvbGxCYWNrV2luZG93Iiwic2VsZiIsIndpbmRvdyIsInNjcm9sbFkiLCJzY3JvbGxJbnRvVmlldyIsImJsb2NrIiwiaW5saW5lIiwiYmVoYXZpb3IiLCJCUk9XU0VSX1RZUEVfV0VDSEFUIiwiT1NfSU9TIiwidG9wIiwic2Nyb2xsVG8iLCJfdXBkYXRlQ2FtZXJhTWF0cml4Iiwibm9kZSIsImdldFdvcmxkTWF0cml4Iiwid29ybGRNYXQiLCJub2RlQ29udGVudFNpemUiLCJfY29udGVudFNpemUiLCJub2RlQW5jaG9yUG9pbnQiLCJfYW5jaG9yUG9pbnQiLCJ4IiwieSIsInRyYW5zZm9ybSIsIkNDX0VESVRPUiIsImNhbWVyYSIsIkNhbWVyYSIsImZpbmRDYW1lcmEiLCJnZXRXb3JsZFRvU2NyZWVuTWF0cml4MkQiLCJtdWwiLCJjYW1lcmFNYXRtIiwibSIsImxvY2FsVmlldyIsImVxdWFscyIsIl92aWV3cG9ydFJlY3QiLCJzZXQiLCJzY2FsZVgiLCJfc2NhbGVYIiwic2NhbGVZIiwiX3NjYWxlWSIsInZpZXdwb3J0IiwiZHByIiwiX2RldmljZVBpeGVsUmF0aW8iLCJhIiwiYiIsImMiLCJkIiwib2Zmc2V0WCIsInBhZGRpbmdMZWZ0IiwicGFyc2VJbnQiLCJvZmZzZXRZIiwicGFkZGluZ0JvdHRvbSIsInR4IiwidHkiLCJtYXRyaXgiLCJpbnB1dEZsYWciLCJyZXR1cm5UeXBlIiwidGV4dFRyYW5zZm9ybSIsIklOSVRJQUxfQ0FQU19BTExfQ0hBUkFDVEVSUyIsIklOSVRJQUxfQ0FQU19XT1JEIiwiUEFTU1dPUkQiLCJ0eXBlIiwiRU1BSUxfQUREUiIsIk5VTUVSSUMiLCJERUNJTUFMIiwiUEhPTkVfTlVNQkVSIiwicGF0dGVybiIsIlVSTCIsIlNFQVJDSCIsIm1heExlbmd0aCIsImJvcmRlciIsImJhY2tncm91bmQiLCJhY3RpdmUiLCJvdXRsaW5lIiwicGFkZGluZyIsInBvc2l0aW9uIiwiYm90dG9tIiwibGVmdCIsImNsYXNzTmFtZSIsImlkIiwicmVzaXplIiwib3ZlcmZsb3dfeSIsInZhbHVlIiwic3RyaW5nIiwicGxhY2Vob2xkZXIiLCJfdXBkYXRlVGV4dExhYmVsIiwidGV4dExhYmVsIiwiX3VwZGF0ZVBsYWNlaG9sZGVyTGFiZWwiLCJwbGFjZWhvbGRlckxhYmVsIiwiZm9udCIsIkJpdG1hcEZvbnQiLCJfZm9udEZhbWlseSIsImZvbnRGYW1pbHkiLCJmb250U2l6ZSIsImZvbnRDb2xvciIsImhvcml6b250YWxBbGlnbiIsImNvbG9yIiwidG9DU1MiLCJIb3Jpem9udGFsQWxpZ24iLCJMRUZUIiwidGV4dEFsaWduIiwiQ0VOVEVSIiwiUklHSFQiLCJzdHlsZUVsIiwibGluZUhlaWdodCIsImlubmVySFRNTCIsIkJST1dTRVJfVFlQRV9FREdFIiwiaW1wbCIsImlucHV0TG9jayIsImNicyIsImNvbXBvc2l0aW9uU3RhcnQiLCJjb21wb3NpdGlvbkVuZCIsImVkaXRCb3hUZXh0Q2hhbmdlZCIsIm9uSW5wdXQiLCJzbGljZSIsIm9uQ2xpY2siLCJlIiwib25LZXlkb3duIiwia2V5Q29kZSIsIktFWSIsImVudGVyIiwic3RvcFByb3BhZ2F0aW9uIiwiZWRpdEJveEVkaXRpbmdSZXR1cm4iLCJ0YWIiLCJwcmV2ZW50RGVmYXVsdCIsIm5leHQiLCJvbkJsdXIiLCJlZGl0Qm94RWRpdGluZ0RpZEVuZGVkIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUEwQkE7Ozs7QUExQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQSxJQUFNQSxLQUFLLEdBQUdDLE9BQU8sQ0FBQyxzQkFBRCxDQUFyQjs7QUFDQSxJQUFNQyxLQUFLLEdBQUdELE9BQU8sQ0FBQyx3QkFBRCxDQUFy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QUFDckIsUUFBSVUsSUFBSSxHQUFHLEtBQUszRCxLQUFoQjtBQUFBLFFBQ0kyTSxHQUFHLEdBQUcsS0FBS3pMLGVBRGY7QUFHQXlDLElBQUFBLElBQUksQ0FBQ29LLG1CQUFMLENBQXlCLGtCQUF6QixFQUE2Q3BCLEdBQUcsQ0FBQ0MsZ0JBQWpEO0FBQ0FqSixJQUFBQSxJQUFJLENBQUNvSyxtQkFBTCxDQUF5QixnQkFBekIsRUFBMkNwQixHQUFHLENBQUNFLGNBQS9DO0FBQ0FsSixJQUFBQSxJQUFJLENBQUNvSyxtQkFBTCxDQUF5QixPQUF6QixFQUFrQ3BCLEdBQUcsQ0FBQ0ksT0FBdEM7QUFDQXBKLElBQUFBLElBQUksQ0FBQ29LLG1CQUFMLENBQXlCLFNBQXpCLEVBQW9DcEIsR0FBRyxDQUFDUSxTQUF4QztBQUNBeEosSUFBQUEsSUFBSSxDQUFDb0ssbUJBQUwsQ0FBeUIsTUFBekIsRUFBaUNwQixHQUFHLENBQUNpQixNQUFyQztBQUNBakssSUFBQUEsSUFBSSxDQUFDb0ssbUJBQUwsQ0FBeUIsWUFBekIsRUFBdUNwQixHQUFHLENBQUNNLE9BQTNDO0FBRUFOLElBQUFBLEdBQUcsQ0FBQ0MsZ0JBQUosR0FBdUIsSUFBdkI7QUFDQUQsSUFBQUEsR0FBRyxDQUFDRSxjQUFKLEdBQXFCLElBQXJCO0FBQ0FGLElBQUFBLEdBQUcsQ0FBQ0ksT0FBSixHQUFjLElBQWQ7QUFDQUosSUFBQUEsR0FBRyxDQUFDUSxTQUFKLEdBQWdCLElBQWhCO0FBQ0FSLElBQUFBLEdBQUcsQ0FBQ2lCLE1BQUosR0FBYSxJQUFiO0FBQ0FqQixJQUFBQSxHQUFHLENBQUNNLE9BQUosR0FBYyxJQUFkO0FBQ0g7QUE3bEJtQyxDQUF4QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgTWF0NCBmcm9tICcuLi8uLi92YWx1ZS10eXBlcy9tYXQ0JztcblxuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi8uLi9wbGF0Zm9ybS91dGlscycpO1xuY29uc3QgbWFjcm8gPSByZXF1aXJlKCcuLi8uLi9wbGF0Zm9ybS9DQ01hY3JvJyk7XG5jb25zdCBUeXBlcyA9IHJlcXVpcmUoJy4vdHlwZXMnKTtcbmNvbnN0IExhYmVsID0gcmVxdWlyZSgnLi4vQ0NMYWJlbCcpO1xuY29uc3QgdGFiSW5kZXhVdGlsID0gcmVxdWlyZSgnLi90YWJJbmRleFV0aWwnKTtcblxuY29uc3QgRWRpdEJveCA9IGNjLkVkaXRCb3g7XG5jb25zdCBqcyA9IGNjLmpzO1xuY29uc3QgSW5wdXRNb2RlID0gVHlwZXMuSW5wdXRNb2RlO1xuY29uc3QgSW5wdXRGbGFnID0gVHlwZXMuSW5wdXRGbGFnO1xuY29uc3QgS2V5Ym9hcmRSZXR1cm5UeXBlID0gVHlwZXMuS2V5Ym9hcmRSZXR1cm5UeXBlO1xuXG4vLyBwb2x5ZmlsbFxubGV0IHBvbHlmaWxsID0ge1xuICAgIHpvb21JbnZhbGlkOiBmYWxzZVxufTtcblxuaWYgKGNjLnN5cy5PU19BTkRST0lEID09PSBjYy5zeXMub3MgJiZcbiAgICAoY2Muc3lzLmJyb3dzZXJUeXBlID09PSBjYy5zeXMuQlJPV1NFUl9UWVBFX1NPVUdPVSB8fFxuICAgIGNjLnN5cy5icm93c2VyVHlwZSA9PT0gY2Muc3lzLkJST1dTRVJfVFlQRV8zNjApKSB7XG4gICAgcG9seWZpbGwuem9vbUludmFsaWQgPSB0cnVlO1xufVxuXG4vLyBodHRwczovL3NlZ21lbnRmYXVsdC5jb20vcS8xMDEwMDAwMDAyOTE0NjEwXG5jb25zdCBERUxBWV9USU1FID0gODAwO1xuY29uc3QgU0NST0xMWSA9IDEwMDtcbmNvbnN0IExFRlRfUEFERElORyA9IDI7XG5cbi8vIHByaXZhdGUgc3RhdGljIHByb3BlcnR5XG5sZXQgX2RvbUNvdW50ID0gMDtcbmxldCBfdmVjMyA9IGNjLnYzKCk7XG5sZXQgX2N1cnJlbnRFZGl0Qm94SW1wbCA9IG51bGw7XG5cbi8vIG9uIG1vYmlsZVxubGV0IF9mdWxsc2NyZWVuID0gZmFsc2U7XG5sZXQgX2F1dG9SZXNpemUgPSBmYWxzZTtcblxuY29uc3QgQmFzZUNsYXNzID0gRWRpdEJveC5fSW1wbENsYXNzO1xuIC8vIFRoaXMgaXMgYW4gYWRhcHRlciBmb3IgRWRpdEJveEltcGwgb24gd2ViIHBsYXRmb3JtLlxuIC8vIEZvciBtb3JlIGFkYXB0ZXJzIG9uIG90aGVyIHBsYXRmb3JtcywgcGxlYXNlIGluaGVyaXQgZnJvbSBFZGl0Qm94SW1wbEJhc2UgYW5kIGltcGxlbWVudCB0aGUgaW50ZXJmYWNlLlxuZnVuY3Rpb24gV2ViRWRpdEJveEltcGwgKCkge1xuICAgIEJhc2VDbGFzcy5jYWxsKHRoaXMpO1xuICAgIHRoaXMuX2RvbUlkID0gYEVkaXRCb3hJZF8keysrX2RvbUNvdW50fWA7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXJTdHlsZVNoZWV0ID0gbnVsbDtcbiAgICB0aGlzLl9lbGVtID0gbnVsbDtcbiAgICB0aGlzLl9pc1RleHRBcmVhID0gZmFsc2U7XG5cbiAgICAvLyBtYXRyaXhcbiAgICB0aGlzLl93b3JsZE1hdCA9IG5ldyBNYXQ0KCk7XG4gICAgdGhpcy5fY2FtZXJhTWF0ID0gbmV3IE1hdDQoKTtcbiAgICAvLyBtYXRyaXggY2FjaGVcbiAgICB0aGlzLl9tMDAgPSAwO1xuICAgIHRoaXMuX20wMSA9IDA7XG4gICAgdGhpcy5fbTA0ID0gMDtcbiAgICB0aGlzLl9tMDUgPSAwO1xuICAgIHRoaXMuX20xMiA9IDA7XG4gICAgdGhpcy5fbTEzID0gMDtcbiAgICB0aGlzLl93ID0gMDtcbiAgICB0aGlzLl9oID0gMDtcbiAgICAvLyB2aWV3cG9ydCBjYWNoZVxuICAgIHRoaXMuX2NhY2hlVmlld3BvcnRSZWN0ID0gY2MucmVjdCgwLCAwLCAwLCAwKTtcblxuICAgIC8vIGlucHV0VHlwZSBjYWNoZVxuICAgIHRoaXMuX2lucHV0TW9kZSA9IG51bGw7XG4gICAgdGhpcy5faW5wdXRGbGFnID0gbnVsbDtcbiAgICB0aGlzLl9yZXR1cm5UeXBlID0gbnVsbDtcblxuICAgIC8vIGV2ZW50IGxpc3RlbmVyc1xuICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzID0ge307XG5cbiAgICAvLyB1cGRhdGUgc3R5bGUgc2hlZXQgY2FjaGVcbiAgICB0aGlzLl90ZXh0TGFiZWxGb250ID0gbnVsbDtcbiAgICB0aGlzLl90ZXh0TGFiZWxGb250U2l6ZSA9IG51bGw7XG4gICAgdGhpcy5fdGV4dExhYmVsRm9udENvbG9yID0gbnVsbDtcbiAgICB0aGlzLl90ZXh0TGFiZWxBbGlnbiA9IG51bGw7XG5cbiAgICB0aGlzLl9wbGFjZWhvbGRlckxhYmVsRm9udCA9IG51bGw7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXJMYWJlbEZvbnRTaXplID0gbnVsbDtcbiAgICB0aGlzLl9wbGFjZWhvbGRlckxhYmVsRm9udENvbG9yID0gbnVsbDtcbiAgICB0aGlzLl9wbGFjZWhvbGRlckxhYmVsQWxpZ24gPSBudWxsO1xuICAgIHRoaXMuX3BsYWNlaG9sZGVyTGluZUhlaWdodCA9IG51bGw7XG59XG5cbmpzLmV4dGVuZChXZWJFZGl0Qm94SW1wbCwgQmFzZUNsYXNzKTtcbkVkaXRCb3guX0ltcGxDbGFzcyA9IFdlYkVkaXRCb3hJbXBsO1xuXG5PYmplY3QuYXNzaWduKFdlYkVkaXRCb3hJbXBsLnByb3RvdHlwZSwge1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIGltcGxlbWVudCBFZGl0Qm94SW1wbEJhc2UgaW50ZXJmYWNlXG4gICAgaW5pdCAoZGVsZWdhdGUpIHtcbiAgICAgICAgaWYgKCFkZWxlZ2F0ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZGVsZWdhdGUgPSBkZWxlZ2F0ZTtcblxuICAgICAgICBpZiAoZGVsZWdhdGUuaW5wdXRNb2RlID09PSBJbnB1dE1vZGUuQU5ZKSB7XG4gICAgICAgICAgICB0aGlzLl9jcmVhdGVUZXh0QXJlYSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fY3JlYXRlSW5wdXQoKTtcbiAgICAgICAgfVxuICAgICAgICB0YWJJbmRleFV0aWwuYWRkKHRoaXMpO1xuICAgICAgICB0aGlzLnNldFRhYkluZGV4KGRlbGVnYXRlLnRhYkluZGV4KTtcbiAgICAgICAgdGhpcy5faW5pdFN0eWxlU2hlZXQoKTtcbiAgICAgICAgdGhpcy5fcmVnaXN0ZXJFdmVudExpc3RlbmVycygpO1xuICAgICAgICB0aGlzLl9hZGREb21Ub0dhbWVDb250YWluZXIoKTtcblxuICAgICAgICBfZnVsbHNjcmVlbiA9IGNjLnZpZXcuaXNBdXRvRnVsbFNjcmVlbkVuYWJsZWQoKTtcbiAgICAgICAgX2F1dG9SZXNpemUgPSBjYy52aWV3Ll9yZXNpemVXaXRoQnJvd3NlclNpemU7XG4gICAgfSxcblxuICAgIGNsZWFyICgpIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlRG9tRnJvbUdhbWVDb250YWluZXIoKTtcblxuICAgICAgICB0YWJJbmRleFV0aWwucmVtb3ZlKHRoaXMpO1xuXG4gICAgICAgIC8vIGNsZWFyIHdoaWxlIGVkaXRpbmdcbiAgICAgICAgaWYgKF9jdXJyZW50RWRpdEJveEltcGwgPT09IHRoaXMpIHtcbiAgICAgICAgICAgIF9jdXJyZW50RWRpdEJveEltcGwgPSBudWxsO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZSAoKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZU1hdHJpeCgpO1xuICAgIH0sXG5cbiAgICBzZXRUYWJJbmRleCAoaW5kZXgpIHtcbiAgICAgICAgdGhpcy5fZWxlbS50YWJJbmRleCA9IGluZGV4O1xuICAgICAgICB0YWJJbmRleFV0aWwucmVzb3J0KCk7XG4gICAgfSxcblxuICAgIHNldFNpemUgKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgbGV0IGVsZW0gPSB0aGlzLl9lbGVtO1xuICAgICAgICBlbGVtLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuICAgICAgICBlbGVtLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG4gICAgfSxcblxuICAgIGJlZ2luRWRpdGluZyAoKSB7XG4gICAgICAgIGlmIChfY3VycmVudEVkaXRCb3hJbXBsICYmIF9jdXJyZW50RWRpdEJveEltcGwgIT09IHRoaXMpIHtcbiAgICAgICAgICAgIF9jdXJyZW50RWRpdEJveEltcGwuc2V0Rm9jdXMoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2VkaXRpbmcgPSB0cnVlO1xuICAgICAgICBfY3VycmVudEVkaXRCb3hJbXBsID0gdGhpcztcbiAgICAgICAgdGhpcy5fZGVsZWdhdGUuZWRpdEJveEVkaXRpbmdEaWRCZWdhbigpO1xuICAgICAgICB0aGlzLl9zaG93RG9tKCk7XG4gICAgICAgIHRoaXMuX2VsZW0uZm9jdXMoKTsgIC8vIHNldCBmb2N1c1xuICAgIH0sXG5cbiAgICBlbmRFZGl0aW5nICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2VsZW0pIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW0uYmx1cigpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gaW1wbGVtZW50IGRvbSBpbnB1dFxuICAgIF9jcmVhdGVJbnB1dCAoKSB7XG4gICAgICAgIHRoaXMuX2lzVGV4dEFyZWEgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgfSxcblxuICAgIF9jcmVhdGVUZXh0QXJlYSAoKSB7XG4gICAgICAgIHRoaXMuX2lzVGV4dEFyZWEgPSB0cnVlO1xuICAgICAgICB0aGlzLl9lbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICB9LFxuXG4gICAgX2FkZERvbVRvR2FtZUNvbnRhaW5lciAoKSB7XG4gICAgICAgIGNjLmdhbWUuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuX2VsZW0pO1xuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHRoaXMuX3BsYWNlaG9sZGVyU3R5bGVTaGVldCk7XG4gICAgfSxcblxuICAgIF9yZW1vdmVEb21Gcm9tR2FtZUNvbnRhaW5lciAoKSB7XG4gICAgICAgIGxldCBoYXNFbGVtID0gdXRpbHMuY29udGFpbnMoY2MuZ2FtZS5jb250YWluZXIsIHRoaXMuX2VsZW0pO1xuICAgICAgICBpZiAoaGFzRWxlbSkge1xuICAgICAgICAgICAgY2MuZ2FtZS5jb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy5fZWxlbSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGhhc1N0eWxlU2hlZXQgPSB1dGlscy5jb250YWlucyhkb2N1bWVudC5oZWFkLCB0aGlzLl9wbGFjZWhvbGRlclN0eWxlU2hlZXQpO1xuICAgICAgICBpZiAoaGFzU3R5bGVTaGVldCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZCh0aGlzLl9wbGFjZWhvbGRlclN0eWxlU2hlZXQpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBkZWxldGUgdGhpcy5fZWxlbTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3BsYWNlaG9sZGVyU3R5bGVTaGVldDtcbiAgICB9LFxuXG4gICAgX3Nob3dEb20gKCkge1xuICAgICAgICB0aGlzLl91cGRhdGVNYXhMZW5ndGgoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlSW5wdXRUeXBlKCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVN0eWxlU2hlZXQoKTtcblxuICAgICAgICB0aGlzLl9lbGVtLnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgdGhpcy5fZGVsZWdhdGUuX2hpZGVMYWJlbHMoKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChjYy5zeXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgIHRoaXMuX3Nob3dEb21Pbk1vYmlsZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9oaWRlRG9tICgpIHtcbiAgICAgICAgbGV0IGVsZW0gPSB0aGlzLl9lbGVtO1xuXG4gICAgICAgIGVsZW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgdGhpcy5fZGVsZWdhdGUuX3Nob3dMYWJlbHMoKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChjYy5zeXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2hpZGVEb21Pbk1vYmlsZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9zaG93RG9tT25Nb2JpbGUgKCkge1xuICAgICAgICBpZiAoY2Muc3lzLm9zICE9PSBjYy5zeXMuT1NfQU5EUk9JRCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoX2Z1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgIGNjLnZpZXcuZW5hYmxlQXV0b0Z1bGxTY3JlZW4oZmFsc2UpO1xuICAgICAgICAgICAgY2Muc2NyZWVuLmV4aXRGdWxsU2NyZWVuKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF9hdXRvUmVzaXplKSB7XG4gICAgICAgICAgICBjYy52aWV3LnJlc2l6ZVdpdGhCcm93c2VyU2l6ZShmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9hZGp1c3RXaW5kb3dTY3JvbGwoKTtcbiAgICB9LFxuXG4gICAgX2hpZGVEb21Pbk1vYmlsZSAoKSB7XG4gICAgICAgIGlmIChjYy5zeXMub3MgPT09IGNjLnN5cy5PU19BTkRST0lEKSB7XG4gICAgICAgICAgICBpZiAoX2F1dG9SZXNpemUpIHtcbiAgICAgICAgICAgICAgICBjYy52aWV3LnJlc2l6ZVdpdGhCcm93c2VyU2l6ZSh0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEluIGNhc2UgZW50ZXIgZnVsbCBzY3JlZW4gd2hlbiBzb2Z0IGtleWJvYXJkIHN0aWxsIHNob3dpbmdcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghX2N1cnJlbnRFZGl0Qm94SW1wbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoX2Z1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLnZpZXcuZW5hYmxlQXV0b0Z1bGxTY3JlZW4odHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBERUxBWV9USU1FKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNvbWUgYnJvd3NlciBsaWtlIHdlY2hhdCBvbiBpT1MgbmVlZCB0byBtYW5udWxseSBzY3JvbGwgYmFjayB3aW5kb3dcbiAgICAgICAgdGhpcy5fc2Nyb2xsQmFja1dpbmRvdygpO1xuICAgIH0sXG5cbiAgICAvLyBhZGp1c3QgdmlldyB0byBlZGl0Qm94XG4gICAgX2FkanVzdFdpbmRvd1Njcm9sbCAoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuc2Nyb2xsWSA8IFNDUk9MTFkpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9lbGVtLnNjcm9sbEludG9WaWV3KHtibG9jazogXCJzdGFydFwiLCBpbmxpbmU6IFwibmVhcmVzdFwiLCBiZWhhdmlvcjogXCJzbW9vdGhcIn0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBERUxBWV9USU1FKTtcbiAgICB9LFxuXG4gICAgX3Njcm9sbEJhY2tXaW5kb3cgKCkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIEZJWDogd2VjaGF0IGJyb3dzZXIgYnVnIG9uIGlPU1xuICAgICAgICAgICAgLy8gSWYgZ2FtZUNvbnRhaW5lciBpcyBpbmNsdWRlZCBpbiBpZnJhbWUsXG4gICAgICAgICAgICAvLyBOZWVkIHRvIHNjcm9sbCB0aGUgdG9wIHdpbmRvdywgbm90IHRoZSBvbmUgaW4gdGhlIGlmcmFtZVxuICAgICAgICAgICAgLy8gUmVmZXJlbmNlOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2luZG93L3RvcFxuICAgICAgICAgICAgbGV0IHN5cyA9IGNjLnN5cztcbiAgICAgICAgICAgIGlmIChzeXMuYnJvd3NlclR5cGUgPT09IHN5cy5CUk9XU0VSX1RZUEVfV0VDSEFUICYmIHN5cy5vcyA9PT0gc3lzLk9TX0lPUykge1xuICAgICAgICAgICAgICAgIHdpbmRvdy50b3AgJiYgd2luZG93LnRvcC5zY3JvbGxUbygwLCAwKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcbiAgICAgICAgfSwgREVMQVlfVElNRSk7XG4gICAgfSxcblxuICAgIF91cGRhdGVDYW1lcmFNYXRyaXggKCkge1xuICAgICAgICBsZXQgbm9kZSA9IHRoaXMuX2RlbGVnYXRlLm5vZGU7ICAgIFxuICAgICAgICBub2RlLmdldFdvcmxkTWF0cml4KHRoaXMuX3dvcmxkTWF0KTtcbiAgICAgICAgbGV0IHdvcmxkTWF0ID0gdGhpcy5fd29ybGRNYXQ7XG4gICAgICAgIGxldCBub2RlQ29udGVudFNpemUgPSBub2RlLl9jb250ZW50U2l6ZSxcbiAgICAgICAgICAgIG5vZGVBbmNob3JQb2ludCA9IG5vZGUuX2FuY2hvclBvaW50O1xuXG4gICAgICAgIF92ZWMzLnggPSAtbm9kZUFuY2hvclBvaW50LnggKiBub2RlQ29udGVudFNpemUud2lkdGg7XG4gICAgICAgIF92ZWMzLnkgPSAtbm9kZUFuY2hvclBvaW50LnkgKiBub2RlQ29udGVudFNpemUuaGVpZ2h0O1xuICAgIFxuICAgICAgICBNYXQ0LnRyYW5zZm9ybSh3b3JsZE1hdCwgd29ybGRNYXQsIF92ZWMzKTtcblxuICAgICAgICAvLyBjYW4ndCBmaW5kIG5vZGUgY2FtZXJhIGluIGVkaXRvclxuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB0aGlzLl9jYW1lcmFNYXQgPSB3b3JsZE1hdDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBjYW1lcmEgPSBjYy5DYW1lcmEuZmluZENhbWVyYShub2RlKTtcbiAgICAgICAgICAgIGlmICghY2FtZXJhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FtZXJhLmdldFdvcmxkVG9TY3JlZW5NYXRyaXgyRCh0aGlzLl9jYW1lcmFNYXQpO1xuICAgICAgICAgICAgTWF0NC5tdWwodGhpcy5fY2FtZXJhTWF0LCB0aGlzLl9jYW1lcmFNYXQsIHdvcmxkTWF0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZU1hdHJpeCAoKSB7ICAgIFxuICAgICAgICBpZiAoQ0NfRURJVE9SIHx8ICF0aGlzLl91cGRhdGVDYW1lcmFNYXRyaXgoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjYW1lcmFNYXRtID0gdGhpcy5fY2FtZXJhTWF0Lm07XG4gICAgICAgIGxldCBub2RlID0gdGhpcy5fZGVsZWdhdGUubm9kZTtcbiAgICAgICAgbGV0IGxvY2FsVmlldyA9IGNjLnZpZXc7XG4gICAgICAgIC8vIGNoZWNrIHdoZXRoZXIgbmVlZCB0byB1cGRhdGVcbiAgICAgICAgaWYgKHRoaXMuX20wMCA9PT0gY2FtZXJhTWF0bVswXSAmJiB0aGlzLl9tMDEgPT09IGNhbWVyYU1hdG1bMV0gJiZcbiAgICAgICAgICAgIHRoaXMuX20wNCA9PT0gY2FtZXJhTWF0bVs0XSAmJiB0aGlzLl9tMDUgPT09IGNhbWVyYU1hdG1bNV0gJiZcbiAgICAgICAgICAgIHRoaXMuX20xMiA9PT0gY2FtZXJhTWF0bVsxMl0gJiYgdGhpcy5fbTEzID09PSBjYW1lcmFNYXRtWzEzXSAmJlxuICAgICAgICAgICAgdGhpcy5fdyA9PT0gbm9kZS5fY29udGVudFNpemUud2lkdGggJiYgdGhpcy5faCA9PT0gbm9kZS5fY29udGVudFNpemUuaGVpZ2h0ICYmXG4gICAgICAgICAgICB0aGlzLl9jYWNoZVZpZXdwb3J0UmVjdC5lcXVhbHMobG9jYWxWaWV3Ll92aWV3cG9ydFJlY3QpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1cGRhdGUgbWF0cml4IGNhY2hlXG4gICAgICAgIHRoaXMuX20wMCA9IGNhbWVyYU1hdG1bMF07XG4gICAgICAgIHRoaXMuX20wMSA9IGNhbWVyYU1hdG1bMV07XG4gICAgICAgIHRoaXMuX20wNCA9IGNhbWVyYU1hdG1bNF07XG4gICAgICAgIHRoaXMuX20wNSA9IGNhbWVyYU1hdG1bNV07XG4gICAgICAgIHRoaXMuX20xMiA9IGNhbWVyYU1hdG1bMTJdO1xuICAgICAgICB0aGlzLl9tMTMgPSBjYW1lcmFNYXRtWzEzXTtcbiAgICAgICAgdGhpcy5fdyA9IG5vZGUuX2NvbnRlbnRTaXplLndpZHRoO1xuICAgICAgICB0aGlzLl9oID0gbm9kZS5fY29udGVudFNpemUuaGVpZ2h0O1xuICAgICAgICAvLyB1cGRhdGUgdmlld3BvcnQgY2FjaGVcbiAgICAgICAgdGhpcy5fY2FjaGVWaWV3cG9ydFJlY3Quc2V0KGxvY2FsVmlldy5fdmlld3BvcnRSZWN0KTtcblxuICAgICAgICBsZXQgc2NhbGVYID0gbG9jYWxWaWV3Ll9zY2FsZVgsIHNjYWxlWSA9IGxvY2FsVmlldy5fc2NhbGVZLFxuICAgICAgICAgICAgdmlld3BvcnQgPSBsb2NhbFZpZXcuX3ZpZXdwb3J0UmVjdCxcbiAgICAgICAgICAgIGRwciA9IGxvY2FsVmlldy5fZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgXG4gICAgICAgIHNjYWxlWCAvPSBkcHI7XG4gICAgICAgIHNjYWxlWSAvPSBkcHI7XG4gICAgXG4gICAgICAgIGxldCBjb250YWluZXIgPSBjYy5nYW1lLmNvbnRhaW5lcjtcbiAgICAgICAgbGV0IGEgPSBjYW1lcmFNYXRtWzBdICogc2NhbGVYLCBiID0gY2FtZXJhTWF0bVsxXSwgYyA9IGNhbWVyYU1hdG1bNF0sIGQgPSBjYW1lcmFNYXRtWzVdICogc2NhbGVZO1xuICAgIFxuICAgICAgICBsZXQgb2Zmc2V0WCA9IGNvbnRhaW5lciAmJiBjb250YWluZXIuc3R5bGUucGFkZGluZ0xlZnQgJiYgcGFyc2VJbnQoY29udGFpbmVyLnN0eWxlLnBhZGRpbmdMZWZ0KTtcbiAgICAgICAgb2Zmc2V0WCArPSB2aWV3cG9ydC54IC8gZHByO1xuICAgICAgICBsZXQgb2Zmc2V0WSA9IGNvbnRhaW5lciAmJiBjb250YWluZXIuc3R5bGUucGFkZGluZ0JvdHRvbSAmJiBwYXJzZUludChjb250YWluZXIuc3R5bGUucGFkZGluZ0JvdHRvbSk7XG4gICAgICAgIG9mZnNldFkgKz0gdmlld3BvcnQueSAvIGRwcjtcbiAgICAgICAgbGV0IHR4ID0gY2FtZXJhTWF0bVsxMl0gKiBzY2FsZVggKyBvZmZzZXRYLCB0eSA9IGNhbWVyYU1hdG1bMTNdICogc2NhbGVZICsgb2Zmc2V0WTtcbiAgICBcbiAgICAgICAgaWYgKHBvbHlmaWxsLnpvb21JbnZhbGlkKSB7XG4gICAgICAgICAgICB0aGlzLnNldFNpemUobm9kZS53aWR0aCAqIGEsIG5vZGUuaGVpZ2h0ICogZCk7XG4gICAgICAgICAgICBhID0gMTtcbiAgICAgICAgICAgIGQgPSAxO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGxldCBlbGVtID0gdGhpcy5fZWxlbTtcbiAgICAgICAgbGV0IG1hdHJpeCA9IFwibWF0cml4KFwiICsgYSArIFwiLFwiICsgLWIgKyBcIixcIiArIC1jICsgXCIsXCIgKyBkICsgXCIsXCIgKyB0eCArIFwiLFwiICsgLXR5ICsgXCIpXCI7XG4gICAgICAgIGVsZW0uc3R5bGVbJ3RyYW5zZm9ybSddID0gbWF0cml4O1xuICAgICAgICBlbGVtLnN0eWxlWyctd2Via2l0LXRyYW5zZm9ybSddID0gbWF0cml4O1xuICAgICAgICBlbGVtLnN0eWxlWyd0cmFuc2Zvcm0tb3JpZ2luJ10gPSAnMHB4IDEwMCUgMHB4JztcbiAgICAgICAgZWxlbS5zdHlsZVsnLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luJ10gPSAnMHB4IDEwMCUgMHB4JztcbiAgICB9LFxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIGlucHV0IHR5cGUgYW5kIG1heCBsZW5ndGhcbiAgICBfdXBkYXRlSW5wdXRUeXBlICgpIHtcbiAgICAgICAgbGV0IGRlbGVnYXRlID0gdGhpcy5fZGVsZWdhdGUsXG4gICAgICAgICAgICBpbnB1dE1vZGUgPSBkZWxlZ2F0ZS5pbnB1dE1vZGUsXG4gICAgICAgICAgICBpbnB1dEZsYWcgPSBkZWxlZ2F0ZS5pbnB1dEZsYWcsXG4gICAgICAgICAgICByZXR1cm5UeXBlID0gZGVsZWdhdGUucmV0dXJuVHlwZSxcbiAgICAgICAgICAgIGVsZW0gPSB0aGlzLl9lbGVtO1xuXG4gICAgICAgIC8vIHdoZXRoZXIgbmVlZCB0byB1cGRhdGVcbiAgICAgICAgaWYgKHRoaXMuX2lucHV0TW9kZSA9PT0gaW5wdXRNb2RlICYmXG4gICAgICAgICAgICB0aGlzLl9pbnB1dEZsYWcgPT09IGlucHV0RmxhZyAmJlxuICAgICAgICAgICAgdGhpcy5fcmV0dXJuVHlwZSA9PT0gcmV0dXJuVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdXBkYXRlIGNhY2hlXG4gICAgICAgIHRoaXMuX2lucHV0TW9kZSA9IGlucHV0TW9kZTtcbiAgICAgICAgdGhpcy5faW5wdXRGbGFnID0gaW5wdXRGbGFnO1xuICAgICAgICB0aGlzLl9yZXR1cm5UeXBlID0gcmV0dXJuVHlwZTtcblxuICAgICAgICAvLyBGSVggTUU6IFRleHRBcmVhIGFjdHVhbGx5IGRvc2Ugbm90IHN1cHBvcnQgcGFzc3dvcmQgdHlwZS5cbiAgICAgICAgaWYgKHRoaXMuX2lzVGV4dEFyZWEpIHtcbiAgICAgICAgICAgIC8vIGlucHV0IGZsYWdcbiAgICAgICAgICAgIGxldCB0ZXh0VHJhbnNmb3JtID0gJ25vbmUnO1xuICAgICAgICAgICAgaWYgKGlucHV0RmxhZyA9PT0gSW5wdXRGbGFnLklOSVRJQUxfQ0FQU19BTExfQ0hBUkFDVEVSUykge1xuICAgICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm0gPSAndXBwZXJjYXNlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlucHV0RmxhZyA9PT0gSW5wdXRGbGFnLklOSVRJQUxfQ0FQU19XT1JEKSB7XG4gICAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybSA9ICdjYXBpdGFsaXplJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsZW0uc3R5bGUudGV4dFRyYW5zZm9ybSA9IHRleHRUcmFuc2Zvcm07XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgLy8gYmVnaW4gdG8gdXBkYXRlSW5wdXRUeXBlXG4gICAgICAgIGlmIChpbnB1dEZsYWcgPT09IElucHV0RmxhZy5QQVNTV09SRCkge1xuICAgICAgICAgICAgZWxlbS50eXBlID0gJ3Bhc3N3b3JkJztcbiAgICAgICAgICAgIGVsZW0uc3R5bGUudGV4dFRyYW5zZm9ybSA9ICdub25lJztcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICAvLyBpbnB1dCBtb2RlXG4gICAgICAgIGxldCB0eXBlID0gZWxlbS50eXBlO1xuICAgICAgICBpZiAoaW5wdXRNb2RlID09PSBJbnB1dE1vZGUuRU1BSUxfQUREUikge1xuICAgICAgICAgICAgdHlwZSA9ICdlbWFpbCc7XG4gICAgICAgIH0gZWxzZSBpZihpbnB1dE1vZGUgPT09IElucHV0TW9kZS5OVU1FUklDIHx8IGlucHV0TW9kZSA9PT0gSW5wdXRNb2RlLkRFQ0lNQUwpIHtcbiAgICAgICAgICAgIHR5cGUgPSAnbnVtYmVyJztcbiAgICAgICAgfSBlbHNlIGlmKGlucHV0TW9kZSA9PT0gSW5wdXRNb2RlLlBIT05FX05VTUJFUikge1xuICAgICAgICAgICAgdHlwZSA9ICdudW1iZXInO1xuICAgICAgICAgICAgZWxlbS5wYXR0ZXJuID0gJ1swLTldKic7XG4gICAgICAgIH0gZWxzZSBpZihpbnB1dE1vZGUgPT09IElucHV0TW9kZS5VUkwpIHtcbiAgICAgICAgICAgIHR5cGUgPSAndXJsJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHR5cGUgPSAndGV4dCc7XG4gICAgXG4gICAgICAgICAgICBpZiAocmV0dXJuVHlwZSA9PT0gS2V5Ym9hcmRSZXR1cm5UeXBlLlNFQVJDSCkge1xuICAgICAgICAgICAgICAgIHR5cGUgPSAnc2VhcmNoJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbGVtLnR5cGUgPSB0eXBlO1xuXG4gICAgICAgIC8vIGlucHV0IGZsYWdcbiAgICAgICAgbGV0IHRleHRUcmFuc2Zvcm0gPSAnbm9uZSc7XG4gICAgICAgIGlmIChpbnB1dEZsYWcgPT09IElucHV0RmxhZy5JTklUSUFMX0NBUFNfQUxMX0NIQVJBQ1RFUlMpIHtcbiAgICAgICAgICAgIHRleHRUcmFuc2Zvcm0gPSAndXBwZXJjYXNlJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpbnB1dEZsYWcgPT09IElucHV0RmxhZy5JTklUSUFMX0NBUFNfV09SRCkge1xuICAgICAgICAgICAgdGV4dFRyYW5zZm9ybSA9ICdjYXBpdGFsaXplJztcbiAgICAgICAgfVxuICAgICAgICBlbGVtLnN0eWxlLnRleHRUcmFuc2Zvcm0gPSB0ZXh0VHJhbnNmb3JtO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlTWF4TGVuZ3RoICgpIHtcbiAgICAgICAgbGV0IG1heExlbmd0aCA9IHRoaXMuX2RlbGVnYXRlLm1heExlbmd0aDtcbiAgICAgICAgaWYobWF4TGVuZ3RoIDwgMCkge1xuICAgICAgICAgICAgLy93ZSBjYW4ndCBzZXQgTnVtYmVyLk1BWF9WQUxVRSB0byBpbnB1dCdzIG1heExlbmd0aCBwcm9wZXJ0eVxuICAgICAgICAgICAgLy9zbyB3ZSB1c2UgYSBtYWdpYyBudW1iZXIgaGVyZSwgaXQgc2hvdWxkIHdvcmtzIGF0IG1vc3QgdXNlIGNhc2VzLlxuICAgICAgICAgICAgbWF4TGVuZ3RoID0gNjU1MzU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZWxlbS5tYXhMZW5ndGggPSBtYXhMZW5ndGg7XG4gICAgfSxcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBzdHlsZSBzaGVldFxuICAgIF9pbml0U3R5bGVTaGVldCAoKSB7XG4gICAgICAgIGxldCBlbGVtID0gdGhpcy5fZWxlbTtcbiAgICAgICAgZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBlbGVtLnN0eWxlLmJvcmRlciA9IDA7XG4gICAgICAgIGVsZW0uc3R5bGUuYmFja2dyb3VuZCA9ICd0cmFuc3BhcmVudCc7XG4gICAgICAgIGVsZW0uc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICAgIGVsZW0uc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuICAgICAgICBlbGVtLnN0eWxlLmFjdGl2ZSA9IDA7XG4gICAgICAgIGVsZW0uc3R5bGUub3V0bGluZSA9ICdtZWRpdW0nO1xuICAgICAgICBlbGVtLnN0eWxlLnBhZGRpbmcgPSAnMCc7XG4gICAgICAgIGVsZW0uc3R5bGUudGV4dFRyYW5zZm9ybSA9ICdub25lJztcbiAgICAgICAgZWxlbS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgZWxlbS5zdHlsZS5ib3R0b20gPSBcIjBweFwiO1xuICAgICAgICBlbGVtLnN0eWxlLmxlZnQgPSBMRUZUX1BBRERJTkcgKyBcInB4XCI7XG4gICAgICAgIGVsZW0uY2xhc3NOYW1lID0gXCJjb2Nvc0VkaXRCb3hcIjtcbiAgICAgICAgZWxlbS5pZCA9IHRoaXMuX2RvbUlkO1xuXG4gICAgICAgIGlmICghdGhpcy5faXNUZXh0QXJlYSkge1xuICAgICAgICAgICAgZWxlbS50eXBlID0gJ3RleHQnO1xuICAgICAgICAgICAgZWxlbS5zdHlsZVsnLW1vei1hcHBlYXJhbmNlJ10gPSAndGV4dGZpZWxkJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGVsZW0uc3R5bGUucmVzaXplID0gJ25vbmUnO1xuICAgICAgICAgICAgZWxlbS5zdHlsZS5vdmVyZmxvd195ID0gJ3Njcm9sbCc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9wbGFjZWhvbGRlclN0eWxlU2hlZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIH0sXG4gICAgXG4gICAgX3VwZGF0ZVN0eWxlU2hlZXQgKCkge1xuICAgICAgICBsZXQgZGVsZWdhdGUgPSB0aGlzLl9kZWxlZ2F0ZSxcbiAgICAgICAgICAgIGVsZW0gPSB0aGlzLl9lbGVtO1xuXG4gICAgICAgIGVsZW0udmFsdWUgPSBkZWxlZ2F0ZS5zdHJpbmc7XG4gICAgICAgIGVsZW0ucGxhY2Vob2xkZXIgPSBkZWxlZ2F0ZS5wbGFjZWhvbGRlcjtcblxuICAgICAgICB0aGlzLl91cGRhdGVUZXh0TGFiZWwoZGVsZWdhdGUudGV4dExhYmVsKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlUGxhY2Vob2xkZXJMYWJlbChkZWxlZ2F0ZS5wbGFjZWhvbGRlckxhYmVsKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZVRleHRMYWJlbCAodGV4dExhYmVsKSB7XG4gICAgICAgIGlmICghdGV4dExhYmVsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gZ2V0IGZvbnRcbiAgICAgICAgbGV0IGZvbnQgPSB0ZXh0TGFiZWwuZm9udDtcbiAgICAgICAgaWYgKGZvbnQgJiYgIShmb250IGluc3RhbmNlb2YgY2MuQml0bWFwRm9udCkpIHtcbiAgICAgICAgICAgIGZvbnQgPSBmb250Ll9mb250RmFtaWx5O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9udCA9IHRleHRMYWJlbC5mb250RmFtaWx5O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZ2V0IGZvbnQgc2l6ZVxuICAgICAgICBsZXQgZm9udFNpemUgPSB0ZXh0TGFiZWwuZm9udFNpemUgKiB0ZXh0TGFiZWwubm9kZS5zY2FsZVk7XG5cbiAgICAgICAgLy8gd2hldGhlciBuZWVkIHRvIHVwZGF0ZVxuICAgICAgICBpZiAodGhpcy5fdGV4dExhYmVsRm9udCA9PT0gZm9udFxuICAgICAgICAgICAgJiYgdGhpcy5fdGV4dExhYmVsRm9udFNpemUgPT09IGZvbnRTaXplXG4gICAgICAgICAgICAmJiB0aGlzLl90ZXh0TGFiZWxGb250Q29sb3IgPT09IHRleHRMYWJlbC5mb250Q29sb3JcbiAgICAgICAgICAgICYmIHRoaXMuX3RleHRMYWJlbEFsaWduID09PSB0ZXh0TGFiZWwuaG9yaXpvbnRhbEFsaWduKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdXBkYXRlIGNhY2hlXG4gICAgICAgIHRoaXMuX3RleHRMYWJlbEZvbnQgPSBmb250O1xuICAgICAgICB0aGlzLl90ZXh0TGFiZWxGb250U2l6ZSA9IGZvbnRTaXplO1xuICAgICAgICB0aGlzLl90ZXh0TGFiZWxGb250Q29sb3IgPSB0ZXh0TGFiZWwuZm9udENvbG9yO1xuICAgICAgICB0aGlzLl90ZXh0TGFiZWxBbGlnbiA9IHRleHRMYWJlbC5ob3Jpem9udGFsQWxpZ247XG5cbiAgICAgICAgbGV0IGVsZW0gPSB0aGlzLl9lbGVtO1xuICAgICAgICAvLyBmb250IHNpemVcbiAgICAgICAgZWxlbS5zdHlsZS5mb250U2l6ZSA9IGAke2ZvbnRTaXplfXB4YDtcbiAgICAgICAgLy8gZm9udCBjb2xvclxuICAgICAgICBlbGVtLnN0eWxlLmNvbG9yID0gdGV4dExhYmVsLm5vZGUuY29sb3IudG9DU1MoKTtcbiAgICAgICAgLy8gZm9udCBmYW1pbHlcbiAgICAgICAgZWxlbS5zdHlsZS5mb250RmFtaWx5ID0gZm9udDtcbiAgICAgICAgLy8gdGV4dC1hbGlnblxuICAgICAgICBzd2l0Y2godGV4dExhYmVsLmhvcml6b250YWxBbGlnbikge1xuICAgICAgICAgICAgY2FzZSBMYWJlbC5Ib3Jpem9udGFsQWxpZ24uTEVGVDpcbiAgICAgICAgICAgICAgICBlbGVtLnN0eWxlLnRleHRBbGlnbiA9ICdsZWZ0JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgTGFiZWwuSG9yaXpvbnRhbEFsaWduLkNFTlRFUjpcbiAgICAgICAgICAgICAgICBlbGVtLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBMYWJlbC5Ib3Jpem9udGFsQWxpZ24uUklHSFQ6XG4gICAgICAgICAgICAgICAgZWxlbS5zdHlsZS50ZXh0QWxpZ24gPSAncmlnaHQnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIC8vIGxpbmVIZWlnaHRcbiAgICAgICAgLy8gQ2FuJ3Qgc3luYyBsaW5lSGVpZ2h0IHByb3BlcnR5LCBiZWNhdXNlIGxpbmVIZWlnaHQgd291bGQgY2hhbmdlIHRoZSB0b3VjaCBhcmVhIG9mIGlucHV0XG4gICAgfSxcblxuICAgIF91cGRhdGVQbGFjZWhvbGRlckxhYmVsIChwbGFjZWhvbGRlckxhYmVsKSB7XG4gICAgICAgIGlmICghcGxhY2Vob2xkZXJMYWJlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZ2V0IGZvbnRcbiAgICAgICAgbGV0IGZvbnQgPSBwbGFjZWhvbGRlckxhYmVsLmZvbnQ7XG4gICAgICAgIGlmIChmb250ICYmICEoZm9udCBpbnN0YW5jZW9mIGNjLkJpdG1hcEZvbnQpKSB7XG4gICAgICAgICAgICBmb250ID0gcGxhY2Vob2xkZXJMYWJlbC5mb250Ll9mb250RmFtaWx5O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9udCA9IHBsYWNlaG9sZGVyTGFiZWwuZm9udEZhbWlseTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGdldCBmb250IHNpemVcbiAgICAgICAgbGV0IGZvbnRTaXplID0gcGxhY2Vob2xkZXJMYWJlbC5mb250U2l6ZSAqIHBsYWNlaG9sZGVyTGFiZWwubm9kZS5zY2FsZVk7XG5cbiAgICAgICAgLy8gd2hldGhlciBuZWVkIHRvIHVwZGF0ZVxuICAgICAgICBpZiAodGhpcy5fcGxhY2Vob2xkZXJMYWJlbEZvbnQgPT09IGZvbnRcbiAgICAgICAgICAgICYmIHRoaXMuX3BsYWNlaG9sZGVyTGFiZWxGb250U2l6ZSA9PT0gZm9udFNpemVcbiAgICAgICAgICAgICYmIHRoaXMuX3BsYWNlaG9sZGVyTGFiZWxGb250Q29sb3IgPT09IHBsYWNlaG9sZGVyTGFiZWwuZm9udENvbG9yXG4gICAgICAgICAgICAmJiB0aGlzLl9wbGFjZWhvbGRlckxhYmVsQWxpZ24gPT09IHBsYWNlaG9sZGVyTGFiZWwuaG9yaXpvbnRhbEFsaWduXG4gICAgICAgICAgICAmJiB0aGlzLl9wbGFjZWhvbGRlckxpbmVIZWlnaHQgPT09IHBsYWNlaG9sZGVyTGFiZWwuZm9udFNpemUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1cGRhdGUgY2FjaGVcbiAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXJMYWJlbEZvbnQgPSBmb250O1xuICAgICAgICB0aGlzLl9wbGFjZWhvbGRlckxhYmVsRm9udFNpemUgPSBmb250U2l6ZTtcbiAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXJMYWJlbEZvbnRDb2xvciA9IHBsYWNlaG9sZGVyTGFiZWwuZm9udENvbG9yO1xuICAgICAgICB0aGlzLl9wbGFjZWhvbGRlckxhYmVsQWxpZ24gPSBwbGFjZWhvbGRlckxhYmVsLmhvcml6b250YWxBbGlnbjtcbiAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXJMaW5lSGVpZ2h0ID0gcGxhY2Vob2xkZXJMYWJlbC5mb250U2l6ZTtcblxuICAgICAgICBsZXQgc3R5bGVFbCA9IHRoaXMuX3BsYWNlaG9sZGVyU3R5bGVTaGVldDtcbiAgICAgICAgXG4gICAgICAgIC8vIGZvbnQgY29sb3JcbiAgICAgICAgbGV0IGZvbnRDb2xvciA9IHBsYWNlaG9sZGVyTGFiZWwubm9kZS5jb2xvci50b0NTUygpO1xuICAgICAgICAvLyBsaW5lIGhlaWdodFxuICAgICAgICBsZXQgbGluZUhlaWdodCA9IHBsYWNlaG9sZGVyTGFiZWwuZm9udFNpemU7ICAvLyB0b3AgdmVydGljYWwgYWxpZ24gYnkgZGVmYXVsdFxuICAgICAgICAvLyBob3Jpem9udGFsIGFsaWduXG4gICAgICAgIGxldCBob3Jpem9udGFsQWxpZ247XG4gICAgICAgIHN3aXRjaCAocGxhY2Vob2xkZXJMYWJlbC5ob3Jpem9udGFsQWxpZ24pIHtcbiAgICAgICAgICAgIGNhc2UgTGFiZWwuSG9yaXpvbnRhbEFsaWduLkxFRlQ6XG4gICAgICAgICAgICAgICAgaG9yaXpvbnRhbEFsaWduID0gJ2xlZnQnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBMYWJlbC5Ib3Jpem9udGFsQWxpZ24uQ0VOVEVSOlxuICAgICAgICAgICAgICAgIGhvcml6b250YWxBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBMYWJlbC5Ib3Jpem9udGFsQWxpZ24uUklHSFQ6XG4gICAgICAgICAgICAgICAgaG9yaXpvbnRhbEFsaWduID0gJ3JpZ2h0JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHN0eWxlRWwuaW5uZXJIVE1MID0gYCMke3RoaXMuX2RvbUlkfTo6LXdlYmtpdC1pbnB1dC1wbGFjZWhvbGRlciwjJHt0aGlzLl9kb21JZH06Oi1tb3otcGxhY2Vob2xkZXIsIyR7dGhpcy5fZG9tSWR9Oi1tcy1pbnB1dC1wbGFjZWhvbGRlcmAgK1xuICAgICAgICBge3RleHQtdHJhbnNmb3JtOiBpbml0aWFsOyBmb250LWZhbWlseTogJHtmb250fTsgZm9udC1zaXplOiAke2ZvbnRTaXplfXB4OyBjb2xvcjogJHtmb250Q29sb3J9OyBsaW5lLWhlaWdodDogJHtsaW5lSGVpZ2h0fXB4OyB0ZXh0LWFsaWduOiAke2hvcml6b250YWxBbGlnbn07fWA7XG4gICAgICAgIC8vIEVER0VfQlVHX0ZJWDogaGlkZSBjbGVhciBidXR0b24sIGJlY2F1c2UgY2xlYXJpbmcgaW5wdXQgYm94IGluIEVkZ2UgZG9lcyBub3QgZW1pdCBpbnB1dCBldmVudCBcbiAgICAgICAgLy8gaXNzdWUgcmVmZmVyZW5jZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjYzMDdcbiAgICAgICAgaWYgKGNjLnN5cy5icm93c2VyVHlwZSA9PT0gY2Muc3lzLkJST1dTRVJfVFlQRV9FREdFKSB7XG4gICAgICAgICAgICBzdHlsZUVsLmlubmVySFRNTCArPSBgIyR7dGhpcy5fZG9tSWR9OjotbXMtY2xlYXJ7ZGlzcGxheTogbm9uZTt9YDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gaGFuZGxlIGV2ZW50IGxpc3RlbmVyc1xuICAgIF9yZWdpc3RlckV2ZW50TGlzdGVuZXJzICgpIHsgICAgICAgIFxuICAgICAgICBsZXQgaW1wbCA9IHRoaXMsXG4gICAgICAgICAgICBlbGVtID0gdGhpcy5fZWxlbSxcbiAgICAgICAgICAgIGlucHV0TG9jayA9IGZhbHNlLFxuICAgICAgICAgICAgY2JzID0gdGhpcy5fZXZlbnRMaXN0ZW5lcnM7XG5cbiAgICAgICAgY2JzLmNvbXBvc2l0aW9uU3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpbnB1dExvY2sgPSB0cnVlO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgY2JzLmNvbXBvc2l0aW9uRW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaW5wdXRMb2NrID0gZmFsc2U7XG4gICAgICAgICAgICBpbXBsLl9kZWxlZ2F0ZS5lZGl0Qm94VGV4dENoYW5nZWQoZWxlbS52YWx1ZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY2JzLm9uSW5wdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXRMb2NrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaW5wdXQgb2YgbnVtYmVyIHR5cGUgZG9lc24ndCBzdXBwb3J0IG1heExlbmd0aCBhdHRyaWJ1dGVcbiAgICAgICAgICAgIGxldCBtYXhMZW5ndGggPSBpbXBsLl9kZWxlZ2F0ZS5tYXhMZW5ndGg7XG4gICAgICAgICAgICBpZiAobWF4TGVuZ3RoID49IDApIHtcbiAgICAgICAgICAgICAgICBlbGVtLnZhbHVlID0gZWxlbS52YWx1ZS5zbGljZSgwLCBtYXhMZW5ndGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW1wbC5fZGVsZWdhdGUuZWRpdEJveFRleHRDaGFuZ2VkKGVsZW0udmFsdWUpO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgLy8gVGhlcmUgYXJlIDIgd2F5cyB0byBmb2N1cyBvbiB0aGUgaW5wdXQgZWxlbWVudDpcbiAgICAgICAgLy8gQ2xpY2sgdGhlIGlucHV0IGVsZW1lbnQsIG9yIGNhbGwgaW5wdXQuZm9jdXMoKS5cbiAgICAgICAgLy8gQm90aCBuZWVkIHRvIGFkanVzdCB3aW5kb3cgc2Nyb2xsLlxuICAgICAgICBjYnMub25DbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAvLyBJbiBjYXNlIG9wZXJhdGlvbiBzZXF1ZW5jZTogY2xpY2sgaW5wdXQsIGhpZGUga2V5Ym9hcmQsIHRoZW4gY2xpY2sgYWdhaW4uXG4gICAgICAgICAgICBpZiAoaW1wbC5fZWRpdGluZykge1xuICAgICAgICAgICAgICAgIGlmIChjYy5zeXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaW1wbC5fYWRqdXN0V2luZG93U2Nyb2xsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgY2JzLm9uS2V5ZG93biA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09PSBtYWNyby5LRVkuZW50ZXIpIHtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGltcGwuX2RlbGVnYXRlLmVkaXRCb3hFZGl0aW5nUmV0dXJuKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWltcGwuX2lzVGV4dEFyZWEpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5ibHVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZS5rZXlDb2RlID09PSBtYWNyby5LRVkudGFiKSB7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICB0YWJJbmRleFV0aWwubmV4dChpbXBsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjYnMub25CbHVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gb24gbW9iaWxlLCBzb21ldGltZXMgaW5wdXQgZWxlbWVudCBkb2Vzbid0IGZpcmUgY29tcG9zaXRpb25lbmQgZXZlbnRcbiAgICAgICAgICAgIGlmIChjYy5zeXMuaXNNb2JpbGUgJiYgaW5wdXRMb2NrKSB7XG4gICAgICAgICAgICAgICAgY2JzLmNvbXBvc2l0aW9uRW5kKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbXBsLl9lZGl0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBfY3VycmVudEVkaXRCb3hJbXBsID0gbnVsbDtcbiAgICAgICAgICAgIGltcGwuX2hpZGVEb20oKTtcbiAgICAgICAgICAgIGltcGwuX2RlbGVnYXRlLmVkaXRCb3hFZGl0aW5nRGlkRW5kZWQoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbXBvc2l0aW9uc3RhcnQnLCBjYnMuY29tcG9zaXRpb25TdGFydCk7XG4gICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY29tcG9zaXRpb25lbmQnLCBjYnMuY29tcG9zaXRpb25FbmQpO1xuICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgY2JzLm9uSW5wdXQpO1xuICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBjYnMub25LZXlkb3duKTtcbiAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgY2JzLm9uQmx1cik7XG4gICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGNicy5vbkNsaWNrKTtcbiAgICB9LFxuXG4gICAgX3JlbW92ZUV2ZW50TGlzdGVuZXJzICgpIHtcbiAgICAgICAgbGV0IGVsZW0gPSB0aGlzLl9lbGVtLFxuICAgICAgICAgICAgY2JzID0gdGhpcy5fZXZlbnRMaXN0ZW5lcnM7XG5cbiAgICAgICAgZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKCdjb21wb3NpdGlvbnN0YXJ0JywgY2JzLmNvbXBvc2l0aW9uU3RhcnQpO1xuICAgICAgICBlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NvbXBvc2l0aW9uZW5kJywgY2JzLmNvbXBvc2l0aW9uRW5kKTtcbiAgICAgICAgZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKCdpbnB1dCcsIGNicy5vbklucHV0KTtcbiAgICAgICAgZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgY2JzLm9uS2V5ZG93bik7XG4gICAgICAgIGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIGNicy5vbkJsdXIpO1xuICAgICAgICBlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBjYnMub25DbGljayk7XG4gICAgICAgIFxuICAgICAgICBjYnMuY29tcG9zaXRpb25TdGFydCA9IG51bGw7XG4gICAgICAgIGNicy5jb21wb3NpdGlvbkVuZCA9IG51bGw7XG4gICAgICAgIGNicy5vbklucHV0ID0gbnVsbDtcbiAgICAgICAgY2JzLm9uS2V5ZG93biA9IG51bGw7XG4gICAgICAgIGNicy5vbkJsdXIgPSBudWxsO1xuICAgICAgICBjYnMub25DbGljayA9IG51bGw7XG4gICAgfSxcbn0pO1xuXG4iXSwic291cmNlUm9vdCI6Ii8ifQ==