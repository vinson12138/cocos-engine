
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/editbox/CCEditBox.js';
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
var macro = require('../../platform/CCMacro');

var EditBoxImplBase = require('../editbox/EditBoxImplBase');

var Label = require('../CCLabel');

var Types = require('./types');

var InputMode = Types.InputMode;
var InputFlag = Types.InputFlag;
var KeyboardReturnType = Types.KeyboardReturnType;

function capitalize(string) {
  return string.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
/**
 * !#en cc.EditBox is a component for inputing text, you can use it to gather small amounts of text from users.
 * !#zh EditBox 组件，用于获取用户的输入文本。
 * @class EditBox
 * @extends Component
 */


var EditBox = cc.Class({
  name: 'cc.EditBox',
  "extends": cc.Component,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.ui/EditBox',
    inspector: 'packages://inspector/inspectors/comps/cceditbox.js',
    help: 'i18n:COMPONENT.help_url.editbox',
    executeInEditMode: true
  },
  properties: {
    _string: '',

    /**
     * !#en Input string of EditBox.
     * !#zh 输入框的初始输入内容，如果为空则会显示占位符的文本。
     * @property {String} string
     */
    string: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.string',
      get: function get() {
        return this._string;
      },
      set: function set(value) {
        value = '' + value;

        if (this.maxLength >= 0 && value.length >= this.maxLength) {
          value = value.slice(0, this.maxLength);
        }

        this._string = value;

        this._updateString(value);
      }
    },

    /**
     * !#en The Label component attached to the node for EditBox's input text label
     * !#zh 输入框输入文本节点上挂载的 Label 组件对象
     * @property {Label} textLabel
     */
    textLabel: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.textLabel',
      "default": null,
      type: Label,
      notify: function notify(oldValue) {
        if (this.textLabel && this.textLabel !== oldValue) {
          this._updateTextLabel();

          this._updateLabels();
        }
      }
    },

    /**
    * !#en The Label component attached to the node for EditBox's placeholder text label
    * !#zh 输入框占位符节点上挂载的 Label 组件对象
    * @property {Label} placeholderLabel
    */
    placeholderLabel: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.placeholderLabel',
      "default": null,
      type: Label,
      notify: function notify(oldValue) {
        if (this.placeholderLabel && this.placeholderLabel !== oldValue) {
          this._updatePlaceholderLabel();

          this._updateLabels();
        }
      }
    },

    /**
     * !#en The Sprite component attached to the node for EditBox's background
     * !#zh 输入框背景节点上挂载的 Sprite 组件对象
     * @property {Sprite} background
     */
    background: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.background',
      "default": null,
      type: cc.Sprite,
      notify: function notify(oldValue) {
        if (this.background && this.background !== oldValue) {
          this._updateBackgroundSprite();
        }
      }
    },
    // To be removed in the future
    _N$backgroundImage: {
      "default": undefined,
      type: cc.SpriteFrame
    },

    /**
     * !#en The background image of EditBox. This property will be removed in the future, use editBox.background instead please.
     * !#zh 输入框的背景图片。 该属性会在将来的版本中移除，请用 editBox.background
     * @property {SpriteFrame} backgroundImage
     * @deprecated since v2.1
     */
    backgroundImage: {
      get: function get() {
        // if (!CC_EDITOR) cc.warnID(1400, 'editBox.backgroundImage', 'editBox.background');
        if (!this.background) {
          return null;
        }

        return this.background.spriteFrame;
      },
      set: function set(value) {
        // if (!CC_EDITOR) cc.warnID(1400, 'editBox.backgroundImage', 'editBox.background');
        if (this.background) {
          this.background.spriteFrame = value;
        }
      }
    },

    /**
     * !#en
     * The return key type of EditBox.
     * Note: it is meaningless for web platforms and desktop platforms.
     * !#zh
     * 指定移动设备上面回车按钮的样式。
     * 注意：这个选项对 web 平台与 desktop 平台无效。
     * @property {EditBox.KeyboardReturnType} returnType
     * @default KeyboardReturnType.DEFAULT
     */
    returnType: {
      "default": KeyboardReturnType.DEFAULT,
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.returnType',
      displayName: 'KeyboardReturnType',
      type: KeyboardReturnType
    },
    // To be removed in the future
    _N$returnType: {
      "default": undefined,
      type: cc.Float
    },

    /**
     * !#en Set the input flags that are to be applied to the EditBox.
     * !#zh 指定输入标志位，可以指定输入方式为密码或者单词首字母大写。
     * @property {EditBox.InputFlag} inputFlag
     * @default InputFlag.DEFAULT
     */
    inputFlag: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.input_flag',
      "default": InputFlag.DEFAULT,
      type: InputFlag,
      notify: function notify() {
        this._updateString(this._string);
      }
    },

    /**
     * !#en
     * Set the input mode of the edit box.
     * If you pass ANY, it will create a multiline EditBox.
     * !#zh
     * 指定输入模式: ANY表示多行输入，其它都是单行输入，移动平台上还可以指定键盘样式。
     * @property {EditBox.InputMode} inputMode
     * @default InputMode.ANY
     */
    inputMode: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.input_mode',
      "default": InputMode.ANY,
      type: InputMode,
      notify: function notify(oldValue) {
        if (this.inputMode !== oldValue) {
          this._updateTextLabel();

          this._updatePlaceholderLabel();
        }
      }
    },

    /**
     * !#en Font size of the input text. This property will be removed in the future, use editBox.textLabel.fontSize instead please.
     * !#zh 输入框文本的字体大小。 该属性会在将来的版本中移除，请使用 editBox.textLabel.fontSize。
     * @property {Number} fontSize
     * @deprecated since v2.1
     */
    fontSize: {
      get: function get() {
        // if (!CC_EDITOR) cc.warnID(1400, 'editBox.fontSize', 'editBox.textLabel.fontSize');
        if (!this.textLabel) {
          return 0;
        }

        return this.textLabel.fontSize;
      },
      set: function set(value) {
        // if (!CC_EDITOR) cc.warnID(1400, 'editBox.fontSize', 'editBox.textLabel.fontSize');
        if (this.textLabel) {
          this.textLabel.fontSize = value;
        }
      }
    },
    // To be removed in the future
    _N$fontSize: {
      "default": undefined,
      type: cc.Float
    },

    /**
     * !#en Change the lineHeight of displayed text. This property will be removed in the future, use editBox.textLabel.lineHeight instead.
     * !#zh 输入框文本的行高。该属性会在将来的版本中移除，请使用 editBox.textLabel.lineHeight
     * @property {Number} lineHeight
     * @deprecated since v2.1
     */
    lineHeight: {
      get: function get() {
        // if (!CC_EDITOR) cc.warnID(1400, 'editBox.lineHeight', 'editBox.textLabel.lineHeight');
        if (!this.textLabel) {
          return 0;
        }

        return this.textLabel.lineHeight;
      },
      set: function set(value) {
        // if (!CC_EDITOR) cc.warnID(1400, 'editBox.lineHeight', 'editBox.textLabel.lineHeight');
        if (this.textLabel) {
          this.textLabel.lineHeight = value;
        }
      }
    },
    // To be removed in the future
    _N$lineHeight: {
      "default": undefined,
      type: cc.Float
    },

    /**
     * !#en Font color of the input text. This property will be removed in the future, use editBox.textLabel.node.color instead.
     * !#zh 输入框文本的颜色。该属性会在将来的版本中移除，请使用 editBox.textLabel.node.color
     * @property {Color} fontColor
     * @deprecated since v2.1
     */
    fontColor: {
      get: function get() {
        // if (!CC_EDITOR) cc.warnID(1400, 'editBox.fontColor', 'editBox.textLabel.node.color');
        if (!this.textLabel) {
          return cc.Color.BLACK;
        }

        return this.textLabel.node.color;
      },
      set: function set(value) {
        // if (!CC_EDITOR) cc.warnID(1400, 'editBox.fontColor', 'editBox.textLabel.node.color');
        if (this.textLabel) {
          this.textLabel.node.color = value;
          this.textLabel.node.opacity = value.a;
        }
      }
    },
    // To be removed in the future
    _N$fontColor: undefined,

    /**
     * !#en The display text of placeholder.
     * !#zh 输入框占位符的文本内容。
     * @property {String} placeholder
     */
    placeholder: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.placeholder',
      get: function get() {
        if (!this.placeholderLabel) {
          return '';
        }

        return this.placeholderLabel.string;
      },
      set: function set(value) {
        if (this.placeholderLabel) {
          this.placeholderLabel.string = value;
        }
      }
    },
    // To be removed in the future
    _N$placeholder: {
      "default": undefined,
      type: cc.String
    },

    /**
     * !#en The font size of placeholder. This property will be removed in the future, use editBox.placeholderLabel.fontSize instead.
     * !#zh 输入框占位符的字体大小。该属性会在将来的版本中移除，请使用 editBox.placeholderLabel.fontSize
     * @property {Number} placeholderFontSize
     * @deprecated since v2.1
     */
    placeholderFontSize: {
      get: function get() {
        // if (!CC_EDITOR) cc.warnID(1400, 'editBox.placeholderFontSize', 'editBox.placeholderLabel.fontSize');
        if (!this.placeholderLabel) {
          return 0;
        }

        return this.placeholderLabel.fontSize;
      },
      set: function set(value) {
        // if (!CC_EDITOR) cc.warnID(1400, 'editBox.placeholderFontSize', 'editBox.placeholderLabel.fontSize');
        if (this.placeholderLabel) {
          this.placeholderLabel.fontSize = value;
        }
      }
    },
    // To be removed in the future
    _N$placeholderFontSize: {
      "default": undefined,
      type: cc.Float
    },

    /**
     * !#en The font color of placeholder. This property will be removed in the future, use editBox.placeholderLabel.node.color instead.
     * !#zh 输入框占位符的字体颜色。该属性会在将来的版本中移除，请使用 editBox.placeholderLabel.node.color
     * @property {Color} placeholderFontColor
     * @deprecated since v2.1
     */
    placeholderFontColor: {
      get: function get() {
        // if (!CC_EDITOR) cc.warnID(1400, 'editBox.placeholderFontColor', 'editBox.placeholderLabel.node.color');
        if (!this.placeholderLabel) {
          return cc.Color.BLACK;
        }

        return this.placeholderLabel.node.color;
      },
      set: function set(value) {
        // if (!CC_EDITOR) cc.warnID(1400, 'editBox.placeholderFontColor', 'editBox.placeholderLabel.node.color');
        if (this.placeholderLabel) {
          this.placeholderLabel.node.color = value;
          this.placeholderLabel.node.opacity = value.a;
        }
      }
    },
    // To be removed in the future
    _N$placeholderFontColor: undefined,

    /**
     * !#en The maximize input length of EditBox.
     * - If pass a value less than 0, it won't limit the input number of characters.
     * - If pass 0, it doesn't allow input any characters.
     * !#zh 输入框最大允许输入的字符个数。
     * - 如果值为小于 0 的值，则不会限制输入字符个数。
     * - 如果值为 0，则不允许用户进行任何输入。
     * @property {Number} maxLength
     */
    maxLength: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.max_length',
      "default": 20
    },
    // To be removed in the future
    _N$maxLength: {
      "default": undefined,
      type: cc.Float
    },

    /**
     * !#en The input is always visible and be on top of the game view (only useful on Web), this property will be removed on v2.1
     * !zh 输入框总是可见，并且永远在游戏视图的上面（这个属性只有在 Web 上面修改有意义），该属性会在 v2.1 中移除
     * Note: only available on Web at the moment.
     * @property {Boolean} stayOnTop
     * @deprecated since 2.0.8
     */
    stayOnTop: {
      "default": false,
      notify: function notify() {
        cc.warn('editBox.stayOnTop is removed since v2.1.');
      }
    },
    _tabIndex: 0,

    /**
     * !#en Set the tabIndex of the DOM input element (only useful on Web).
     * !#zh 修改 DOM 输入元素的 tabIndex（这个属性只有在 Web 上面修改有意义）。
     * @property {Number} tabIndex
     */
    tabIndex: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.tab_index',
      get: function get() {
        return this._tabIndex;
      },
      set: function set(value) {
        if (this._tabIndex !== value) {
          this._tabIndex = value;

          if (this._impl) {
            this._impl.setTabIndex(value);
          }
        }
      }
    },

    /**
     * !#en The event handler to be called when EditBox began to edit text.
     * !#zh 开始编辑文本输入框触发的事件回调。
     * @property {Component.EventHandler[]} editingDidBegan
     */
    editingDidBegan: {
      "default": [],
      type: cc.Component.EventHandler
    },

    /**
     * !#en The event handler to be called when EditBox text changes.
     * !#zh 编辑文本输入框时触发的事件回调。
     * @property {Component.EventHandler[]} textChanged
     */
    textChanged: {
      "default": [],
      type: cc.Component.EventHandler
    },

    /**
     * !#en The event handler to be called when EditBox edit ends.
     * !#zh 结束编辑文本输入框时触发的事件回调。
     * @property {Component.EventHandler[]} editingDidEnded
     */
    editingDidEnded: {
      "default": [],
      type: cc.Component.EventHandler
    },

    /**
     * !#en The event handler to be called when return key is pressed. Windows is not supported.
     * !#zh 当用户按下回车按键时的事件回调，目前不支持 windows 平台
     * @property {Component.EventHandler[]} editingReturn
     */
    editingReturn: {
      "default": [],
      type: cc.Component.EventHandler
    }
  },
  statics: {
    _ImplClass: EditBoxImplBase,
    // implemented on different platform adapter
    KeyboardReturnType: KeyboardReturnType,
    InputFlag: InputFlag,
    InputMode: InputMode
  },
  _init: function _init() {
    this._upgradeComp();

    this._isLabelVisible = true;
    this.node.on(cc.Node.EventType.SIZE_CHANGED, this._syncSize, this);
    var impl = this._impl = new EditBox._ImplClass();
    impl.init(this);

    this._updateString(this._string);

    this._syncSize();
  },
  _updateBackgroundSprite: function _updateBackgroundSprite() {
    var background = this.background; // If background doesn't exist, create one.

    if (!background) {
      var node = this.node.getChildByName('BACKGROUND_SPRITE');

      if (!node) {
        node = new cc.Node('BACKGROUND_SPRITE');
      }

      background = node.getComponent(cc.Sprite);

      if (!background) {
        background = node.addComponent(cc.Sprite);
      }

      node.parent = this.node;
      this.background = background;
    } // update


    background.type = cc.Sprite.Type.SLICED; // handle old data

    if (this._N$backgroundImage !== undefined) {
      background.spriteFrame = this._N$backgroundImage;
      this._N$backgroundImage = undefined;
    }
  },
  _updateTextLabel: function _updateTextLabel() {
    var textLabel = this.textLabel; // If textLabel doesn't exist, create one.

    if (!textLabel) {
      var node = this.node.getChildByName('TEXT_LABEL');

      if (!node) {
        node = new cc.Node('TEXT_LABEL');
      }

      textLabel = node.getComponent(Label);

      if (!textLabel) {
        textLabel = node.addComponent(Label);
      }

      node.parent = this.node;
      this.textLabel = textLabel;
    } // update


    textLabel.node.setAnchorPoint(0, 1);
    textLabel.overflow = Label.Overflow.CLAMP;

    if (this.inputMode === InputMode.ANY) {
      textLabel.verticalAlign = macro.VerticalTextAlignment.TOP;
      textLabel.enableWrapText = true;
    } else {
      textLabel.verticalAlign = macro.VerticalTextAlignment.CENTER;
      textLabel.enableWrapText = false;
    }

    textLabel.string = this._updateLabelStringStyle(this._string); // handle old data

    if (this._N$fontColor !== undefined) {
      textLabel.node.color = this._N$fontColor;
      textLabel.node.opacity = this._N$fontColor.a;
      this._N$fontColor = undefined;
    }

    if (this._N$fontSize !== undefined) {
      textLabel.fontSize = this._N$fontSize;
      this._N$fontSize = undefined;
    }

    if (this._N$lineHeight !== undefined) {
      textLabel.lineHeight = this._N$lineHeight;
      this._N$lineHeight = undefined;
    }
  },
  _updatePlaceholderLabel: function _updatePlaceholderLabel() {
    var placeholderLabel = this.placeholderLabel; // If placeholderLabel doesn't exist, create one.

    if (!placeholderLabel) {
      var node = this.node.getChildByName('PLACEHOLDER_LABEL');

      if (!node) {
        node = new cc.Node('PLACEHOLDER_LABEL');
      }

      placeholderLabel = node.getComponent(Label);

      if (!placeholderLabel) {
        placeholderLabel = node.addComponent(Label);
      }

      node.parent = this.node;
      this.placeholderLabel = placeholderLabel;
    } // update


    placeholderLabel.node.setAnchorPoint(0, 1);
    placeholderLabel.overflow = Label.Overflow.CLAMP;

    if (this.inputMode === InputMode.ANY) {
      placeholderLabel.verticalAlign = macro.VerticalTextAlignment.TOP;
      placeholderLabel.enableWrapText = true;
    } else {
      placeholderLabel.verticalAlign = macro.VerticalTextAlignment.CENTER;
      placeholderLabel.enableWrapText = false;
    }

    placeholderLabel.string = this.placeholder; // handle old data

    if (this._N$placeholderFontColor !== undefined) {
      placeholderLabel.node.color = this._N$placeholderFontColor;
      placeholderLabel.node.opacity = this._N$placeholderFontColor.a;
      this._N$placeholderFontColor = undefined;
    }

    if (this._N$placeholderFontSize !== undefined) {
      placeholderLabel.fontSize = this._N$placeholderFontSize;
      this._N$placeholderFontSize = undefined;
    }
  },
  _upgradeComp: function _upgradeComp() {
    if (this._N$returnType !== undefined) {
      this.returnType = this._N$returnType;
      this._N$returnType = undefined;
    }

    if (this._N$maxLength !== undefined) {
      this.maxLength = this._N$maxLength;
      this._N$maxLength = undefined;
    }

    if (this._N$backgroundImage !== undefined) {
      this._updateBackgroundSprite();
    }

    if (this._N$fontColor !== undefined || this._N$fontSize !== undefined || this._N$lineHeight !== undefined) {
      this._updateTextLabel();
    }

    if (this._N$placeholderFontColor !== undefined || this._N$placeholderFontSize !== undefined) {
      this._updatePlaceholderLabel();
    }

    if (this._N$placeholder !== undefined) {
      this.placeholder = this._N$placeholder;
      this._N$placeholder = undefined;
    }
  },
  _syncSize: function _syncSize() {
    if (this._impl) {
      var size = this.node.getContentSize();

      this._impl.setSize(size.width, size.height);
    }
  },
  _showLabels: function _showLabels() {
    this._isLabelVisible = true;

    this._updateLabels();
  },
  _hideLabels: function _hideLabels() {
    this._isLabelVisible = false;

    if (this.textLabel) {
      this.textLabel.node.active = false;
    }

    if (this.placeholderLabel) {
      this.placeholderLabel.node.active = false;
    }
  },
  _updateLabels: function _updateLabels() {
    if (this._isLabelVisible) {
      var content = this._string;

      if (this.textLabel) {
        this.textLabel.node.active = content !== '';
      }

      if (this.placeholderLabel) {
        this.placeholderLabel.node.active = content === '';
      }
    }
  },
  _updateString: function _updateString(text) {
    var textLabel = this.textLabel; // Not inited yet

    if (!textLabel) {
      return;
    }

    var displayText = text;

    if (displayText) {
      displayText = this._updateLabelStringStyle(displayText);
    }

    textLabel.string = displayText;

    this._updateLabels();
  },
  _updateLabelStringStyle: function _updateLabelStringStyle(text, ignorePassword) {
    var inputFlag = this.inputFlag;

    if (!ignorePassword && inputFlag === InputFlag.PASSWORD) {
      var passwordString = '';
      var len = text.length;

      for (var i = 0; i < len; ++i) {
        passwordString += "\u25CF";
      }

      text = passwordString;
    } else if (inputFlag === InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
      text = text.toUpperCase();
    } else if (inputFlag === InputFlag.INITIAL_CAPS_WORD) {
      text = capitalize(text);
    } else if (inputFlag === InputFlag.INITIAL_CAPS_SENTENCE) {
      text = capitalizeFirstLetter(text);
    }

    return text;
  },
  editBoxEditingDidBegan: function editBoxEditingDidBegan() {
    cc.Component.EventHandler.emitEvents(this.editingDidBegan, this);
    this.node.emit('editing-did-began', this);
  },
  editBoxEditingDidEnded: function editBoxEditingDidEnded() {
    cc.Component.EventHandler.emitEvents(this.editingDidEnded, this);
    this.node.emit('editing-did-ended', this);
  },
  editBoxTextChanged: function editBoxTextChanged(text) {
    text = this._updateLabelStringStyle(text, true);
    this.string = text;
    cc.Component.EventHandler.emitEvents(this.textChanged, text, this);
    this.node.emit('text-changed', this);
  },
  editBoxEditingReturn: function editBoxEditingReturn() {
    cc.Component.EventHandler.emitEvents(this.editingReturn, this);
    this.node.emit('editing-return', this);
  },
  onEnable: function onEnable() {
    if (!CC_EDITOR) {
      this._registerEvent();
    }

    if (this._impl) {
      this._impl.enable();
    }
  },
  onDisable: function onDisable() {
    if (!CC_EDITOR) {
      this._unregisterEvent();
    }

    if (this._impl) {
      this._impl.disable();
    }
  },
  onDestroy: function onDestroy() {
    if (this._impl) {
      this._impl.clear();
    }
  },
  __preload: function __preload() {
    this._init();
  },
  _registerEvent: function _registerEvent() {
    this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
  },
  _unregisterEvent: function _unregisterEvent() {
    this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
  },
  _onTouchBegan: function _onTouchBegan(event) {
    event.stopPropagation();
  },
  _onTouchCancel: function _onTouchCancel(event) {
    event.stopPropagation();
  },
  _onTouchEnded: function _onTouchEnded(event) {
    if (this._impl) {
      this._impl.beginEditing();
    }

    event.stopPropagation();
  },

  /**
   * !#en Let the EditBox get focus, this method will be removed on v2.1
   * !#zh 让当前 EditBox 获得焦点, 这个方法会在 v2.1 中移除
   * @method setFocus
   * @deprecated since 2.0.8
   */
  setFocus: function setFocus() {
    cc.errorID(1400, 'setFocus()', 'focus()');

    if (this._impl) {
      this._impl.setFocus(true);
    }
  },

  /**
   * !#en Let the EditBox get focus
   * !#zh 让当前 EditBox 获得焦点
   * @method focus
   */
  focus: function focus() {
    if (this._impl) {
      this._impl.setFocus(true);
    }
  },

  /**
   * !#en Let the EditBox lose focus
   * !#zh 让当前 EditBox 失去焦点
   * @method blur
   */
  blur: function blur() {
    if (this._impl) {
      this._impl.setFocus(false);
    }
  },

  /**
   * !#en Determine whether EditBox is getting focus or not.
   * !#zh 判断 EditBox 是否获得了焦点
   * @method isFocused
   */
  isFocused: function isFocused() {
    if (this._impl) {
      return this._impl.isFocused();
    } else {
      return false;
    }
  },
  update: function update() {
    if (this._impl) {
      this._impl.update();
    }
  }
});
cc.EditBox = module.exports = EditBox;

if (cc.sys.isBrowser) {
  require('./WebEditBoxImpl');
}
/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event editing-did-began
 * @param {Event.EventCustom} event
 * @param {EditBox} editbox - The EditBox component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event editing-did-ended
 * @param {Event.EventCustom} event
 * @param {EditBox} editbox - The EditBox component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event text-changed
 * @param {Event.EventCustom} event
 * @param {EditBox} editbox - The EditBox component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event editing-return
 * @param {Event.EventCustom} event
 * @param {EditBox} editbox - The EditBox component.
 */

/**
 * !#en if you don't need the EditBox and it isn't in any running Scene, you should
 * call the destroy method on this component or the associated node explicitly.
 * Otherwise, the created DOM element won't be removed from web page.
 * !#zh
 * 如果你不再使用 EditBox，并且组件未添加到场景中，那么你必须手动对组件或所在节点调用 destroy。
 * 这样才能移除网页上的 DOM 节点，避免 Web 平台内存泄露。
 * @example
 * editbox.node.parent = null;  // or  editbox.node.removeFromParent(false);
 * // when you don't need editbox anymore
 * editbox.node.destroy();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvZWRpdGJveC9DQ0VkaXRCb3guanMiXSwibmFtZXMiOlsibWFjcm8iLCJyZXF1aXJlIiwiRWRpdEJveEltcGxCYXNlIiwiTGFiZWwiLCJUeXBlcyIsIklucHV0TW9kZSIsIklucHV0RmxhZyIsIktleWJvYXJkUmV0dXJuVHlwZSIsImNhcGl0YWxpemUiLCJzdHJpbmciLCJyZXBsYWNlIiwiYSIsInRvVXBwZXJDYXNlIiwiY2FwaXRhbGl6ZUZpcnN0TGV0dGVyIiwiY2hhckF0Iiwic2xpY2UiLCJFZGl0Qm94IiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJDb21wb25lbnQiLCJlZGl0b3IiLCJDQ19FRElUT1IiLCJtZW51IiwiaW5zcGVjdG9yIiwiaGVscCIsImV4ZWN1dGVJbkVkaXRNb2RlIiwicHJvcGVydGllcyIsIl9zdHJpbmciLCJ0b29sdGlwIiwiQ0NfREVWIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJtYXhMZW5ndGgiLCJsZW5ndGgiLCJfdXBkYXRlU3RyaW5nIiwidGV4dExhYmVsIiwidHlwZSIsIm5vdGlmeSIsIm9sZFZhbHVlIiwiX3VwZGF0ZVRleHRMYWJlbCIsIl91cGRhdGVMYWJlbHMiLCJwbGFjZWhvbGRlckxhYmVsIiwiX3VwZGF0ZVBsYWNlaG9sZGVyTGFiZWwiLCJiYWNrZ3JvdW5kIiwiU3ByaXRlIiwiX3VwZGF0ZUJhY2tncm91bmRTcHJpdGUiLCJfTiRiYWNrZ3JvdW5kSW1hZ2UiLCJ1bmRlZmluZWQiLCJTcHJpdGVGcmFtZSIsImJhY2tncm91bmRJbWFnZSIsInNwcml0ZUZyYW1lIiwicmV0dXJuVHlwZSIsIkRFRkFVTFQiLCJkaXNwbGF5TmFtZSIsIl9OJHJldHVyblR5cGUiLCJGbG9hdCIsImlucHV0RmxhZyIsImlucHV0TW9kZSIsIkFOWSIsImZvbnRTaXplIiwiX04kZm9udFNpemUiLCJsaW5lSGVpZ2h0IiwiX04kbGluZUhlaWdodCIsImZvbnRDb2xvciIsIkNvbG9yIiwiQkxBQ0siLCJub2RlIiwiY29sb3IiLCJvcGFjaXR5IiwiX04kZm9udENvbG9yIiwicGxhY2Vob2xkZXIiLCJfTiRwbGFjZWhvbGRlciIsIlN0cmluZyIsInBsYWNlaG9sZGVyRm9udFNpemUiLCJfTiRwbGFjZWhvbGRlckZvbnRTaXplIiwicGxhY2Vob2xkZXJGb250Q29sb3IiLCJfTiRwbGFjZWhvbGRlckZvbnRDb2xvciIsIl9OJG1heExlbmd0aCIsInN0YXlPblRvcCIsIndhcm4iLCJfdGFiSW5kZXgiLCJ0YWJJbmRleCIsIl9pbXBsIiwic2V0VGFiSW5kZXgiLCJlZGl0aW5nRGlkQmVnYW4iLCJFdmVudEhhbmRsZXIiLCJ0ZXh0Q2hhbmdlZCIsImVkaXRpbmdEaWRFbmRlZCIsImVkaXRpbmdSZXR1cm4iLCJzdGF0aWNzIiwiX0ltcGxDbGFzcyIsIl9pbml0IiwiX3VwZ3JhZGVDb21wIiwiX2lzTGFiZWxWaXNpYmxlIiwib24iLCJOb2RlIiwiRXZlbnRUeXBlIiwiU0laRV9DSEFOR0VEIiwiX3N5bmNTaXplIiwiaW1wbCIsImluaXQiLCJnZXRDaGlsZEJ5TmFtZSIsImdldENvbXBvbmVudCIsImFkZENvbXBvbmVudCIsInBhcmVudCIsIlR5cGUiLCJTTElDRUQiLCJzZXRBbmNob3JQb2ludCIsIm92ZXJmbG93IiwiT3ZlcmZsb3ciLCJDTEFNUCIsInZlcnRpY2FsQWxpZ24iLCJWZXJ0aWNhbFRleHRBbGlnbm1lbnQiLCJUT1AiLCJlbmFibGVXcmFwVGV4dCIsIkNFTlRFUiIsIl91cGRhdGVMYWJlbFN0cmluZ1N0eWxlIiwic2l6ZSIsImdldENvbnRlbnRTaXplIiwic2V0U2l6ZSIsIndpZHRoIiwiaGVpZ2h0IiwiX3Nob3dMYWJlbHMiLCJfaGlkZUxhYmVscyIsImFjdGl2ZSIsImNvbnRlbnQiLCJ0ZXh0IiwiZGlzcGxheVRleHQiLCJpZ25vcmVQYXNzd29yZCIsIlBBU1NXT1JEIiwicGFzc3dvcmRTdHJpbmciLCJsZW4iLCJpIiwiSU5JVElBTF9DQVBTX0FMTF9DSEFSQUNURVJTIiwiSU5JVElBTF9DQVBTX1dPUkQiLCJJTklUSUFMX0NBUFNfU0VOVEVOQ0UiLCJlZGl0Qm94RWRpdGluZ0RpZEJlZ2FuIiwiZW1pdEV2ZW50cyIsImVtaXQiLCJlZGl0Qm94RWRpdGluZ0RpZEVuZGVkIiwiZWRpdEJveFRleHRDaGFuZ2VkIiwiZWRpdEJveEVkaXRpbmdSZXR1cm4iLCJvbkVuYWJsZSIsIl9yZWdpc3RlckV2ZW50IiwiZW5hYmxlIiwib25EaXNhYmxlIiwiX3VucmVnaXN0ZXJFdmVudCIsImRpc2FibGUiLCJvbkRlc3Ryb3kiLCJjbGVhciIsIl9fcHJlbG9hZCIsIlRPVUNIX1NUQVJUIiwiX29uVG91Y2hCZWdhbiIsIlRPVUNIX0VORCIsIl9vblRvdWNoRW5kZWQiLCJvZmYiLCJldmVudCIsInN0b3BQcm9wYWdhdGlvbiIsIl9vblRvdWNoQ2FuY2VsIiwiYmVnaW5FZGl0aW5nIiwic2V0Rm9jdXMiLCJlcnJvcklEIiwiZm9jdXMiLCJibHVyIiwiaXNGb2N1c2VkIiwidXBkYXRlIiwibW9kdWxlIiwiZXhwb3J0cyIsInN5cyIsImlzQnJvd3NlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsS0FBSyxHQUFHQyxPQUFPLENBQUMsd0JBQUQsQ0FBckI7O0FBQ0EsSUFBTUMsZUFBZSxHQUFHRCxPQUFPLENBQUMsNEJBQUQsQ0FBL0I7O0FBQ0EsSUFBTUUsS0FBSyxHQUFHRixPQUFPLENBQUMsWUFBRCxDQUFyQjs7QUFDQSxJQUFNRyxLQUFLLEdBQUdILE9BQU8sQ0FBQyxTQUFELENBQXJCOztBQUNBLElBQU1JLFNBQVMsR0FBR0QsS0FBSyxDQUFDQyxTQUF4QjtBQUNBLElBQU1DLFNBQVMsR0FBR0YsS0FBSyxDQUFDRSxTQUF4QjtBQUNBLElBQU1DLGtCQUFr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QUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IG1hY3JvID0gcmVxdWlyZSgnLi4vLi4vcGxhdGZvcm0vQ0NNYWNybycpO1xuY29uc3QgRWRpdEJveEltcGxCYXNlID0gcmVxdWlyZSgnLi4vZWRpdGJveC9FZGl0Qm94SW1wbEJhc2UnKTtcbmNvbnN0IExhYmVsID0gcmVxdWlyZSgnLi4vQ0NMYWJlbCcpO1xuY29uc3QgVHlwZXMgPSByZXF1aXJlKCcuL3R5cGVzJyk7XG5jb25zdCBJbnB1dE1vZGUgPSBUeXBlcy5JbnB1dE1vZGU7XG5jb25zdCBJbnB1dEZsYWcgPSBUeXBlcy5JbnB1dEZsYWc7XG5jb25zdCBLZXlib2FyZFJldHVyblR5cGUgPSBUeXBlcy5LZXlib2FyZFJldHVyblR5cGU7XG5cbmZ1bmN0aW9uIGNhcGl0YWxpemUgKHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZSgvKD86XnxcXHMpXFxTL2csIGZ1bmN0aW9uKGEpIHsgcmV0dXJuIGEudG9VcHBlckNhc2UoKTsgfSk7XG59XG5cbmZ1bmN0aW9uIGNhcGl0YWxpemVGaXJzdExldHRlciAoc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKTtcbn1cblxuXG4vKipcbiAqICEjZW4gY2MuRWRpdEJveCBpcyBhIGNvbXBvbmVudCBmb3IgaW5wdXRpbmcgdGV4dCwgeW91IGNhbiB1c2UgaXQgdG8gZ2F0aGVyIHNtYWxsIGFtb3VudHMgb2YgdGV4dCBmcm9tIHVzZXJzLlxuICogISN6aCBFZGl0Qm94IOe7hOS7tu+8jOeUqOS6juiOt+WPlueUqOaIt+eahOi+k+WFpeaWh+acrOOAglxuICogQGNsYXNzIEVkaXRCb3hcbiAqIEBleHRlbmRzIENvbXBvbmVudFxuICovXG5sZXQgRWRpdEJveCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuRWRpdEJveCcsXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnVpL0VkaXRCb3gnLFxuICAgICAgICBpbnNwZWN0b3I6ICdwYWNrYWdlczovL2luc3BlY3Rvci9pbnNwZWN0b3JzL2NvbXBzL2NjZWRpdGJveC5qcycsXG4gICAgICAgIGhlbHA6ICdpMThuOkNPTVBPTkVOVC5oZWxwX3VybC5lZGl0Ym94JyxcbiAgICAgICAgZXhlY3V0ZUluRWRpdE1vZGU6IHRydWUsXG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX3N0cmluZzogJycsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIElucHV0IHN0cmluZyBvZiBFZGl0Qm94LlxuICAgICAgICAgKiAhI3poIOi+k+WFpeahhueahOWIneWni+i+k+WFpeWGheWuue+8jOWmguaenOS4uuepuuWImeS8muaYvuekuuWNoOS9jeespueahOaWh+acrOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gc3RyaW5nXG4gICAgICAgICAqL1xuICAgICAgICBzdHJpbmc6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuZWRpdGJveC5zdHJpbmcnLFxuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RyaW5nO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gJycgKyB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tYXhMZW5ndGggPj0gMCAmJiB2YWx1ZS5sZW5ndGggPj0gdGhpcy5tYXhMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgwLCB0aGlzLm1heExlbmd0aCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5fc3RyaW5nID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgTGFiZWwgY29tcG9uZW50IGF0dGFjaGVkIHRvIHRoZSBub2RlIGZvciBFZGl0Qm94J3MgaW5wdXQgdGV4dCBsYWJlbFxuICAgICAgICAgKiAhI3poIOi+k+WFpeahhui+k+WFpeaWh+acrOiKgueCueS4iuaMgui9veeahCBMYWJlbCDnu4Tku7blr7nosaFcbiAgICAgICAgICogQHByb3BlcnR5IHtMYWJlbH0gdGV4dExhYmVsXG4gICAgICAgICAqL1xuICAgICAgICB0ZXh0TGFiZWw6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuZWRpdGJveC50ZXh0TGFiZWwnLFxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IExhYmVsLFxuICAgICAgICAgICAgbm90aWZ5IChvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRleHRMYWJlbCAmJiB0aGlzLnRleHRMYWJlbCAhPT0gb2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlVGV4dExhYmVsKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUxhYmVscygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBMYWJlbCBjb21wb25lbnQgYXR0YWNoZWQgdG8gdGhlIG5vZGUgZm9yIEVkaXRCb3gncyBwbGFjZWhvbGRlciB0ZXh0IGxhYmVsXG4gICAgICAgICAqICEjemgg6L6T5YWl5qGG5Y2g5L2N56ym6IqC54K55LiK5oyC6L2955qEIExhYmVsIOe7hOS7tuWvueixoVxuICAgICAgICAgKiBAcHJvcGVydHkge0xhYmVsfSBwbGFjZWhvbGRlckxhYmVsXG4gICAgICAgICAqL1xuICAgICAgICBwbGFjZWhvbGRlckxhYmVsOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmVkaXRib3gucGxhY2Vob2xkZXJMYWJlbCcsXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogTGFiZWwsXG4gICAgICAgICAgICBub3RpZnkgKG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGxhY2Vob2xkZXJMYWJlbCAmJiB0aGlzLnBsYWNlaG9sZGVyTGFiZWwgIT09IG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBsYWNlaG9sZGVyTGFiZWwoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlTGFiZWxzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgU3ByaXRlIGNvbXBvbmVudCBhdHRhY2hlZCB0byB0aGUgbm9kZSBmb3IgRWRpdEJveCdzIGJhY2tncm91bmRcbiAgICAgICAgICogISN6aCDovpPlhaXmoYbog4zmma/oioLngrnkuIrmjILovb3nmoQgU3ByaXRlIOe7hOS7tuWvueixoVxuICAgICAgICAgKiBAcHJvcGVydHkge1Nwcml0ZX0gYmFja2dyb3VuZFxuICAgICAgICAgKi9cbiAgICAgICAgYmFja2dyb3VuZDoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5lZGl0Ym94LmJhY2tncm91bmQnLFxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZSxcbiAgICAgICAgICAgIG5vdGlmeSAob2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5iYWNrZ3JvdW5kICYmIHRoaXMuYmFja2dyb3VuZCAhPT0gb2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlQmFja2dyb3VuZFNwcml0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gVG8gYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlXG4gICAgICAgIF9OJGJhY2tncm91bmRJbWFnZToge1xuICAgICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlRnJhbWUsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIGJhY2tncm91bmQgaW1hZ2Ugb2YgRWRpdEJveC4gVGhpcyBwcm9wZXJ0eSB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIGZ1dHVyZSwgdXNlIGVkaXRCb3guYmFja2dyb3VuZCBpbnN0ZWFkIHBsZWFzZS5cbiAgICAgICAgICogISN6aCDovpPlhaXmoYbnmoTog4zmma/lm77niYfjgIIg6K+l5bGe5oCn5Lya5Zyo5bCG5p2l55qE54mI5pys5Lit56e76Zmk77yM6K+355SoIGVkaXRCb3guYmFja2dyb3VuZFxuICAgICAgICAgKiBAcHJvcGVydHkge1Nwcml0ZUZyYW1lfSBiYWNrZ3JvdW5kSW1hZ2VcbiAgICAgICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMVxuICAgICAgICAgKi9cbiAgICAgICAgYmFja2dyb3VuZEltYWdlOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIC8vIGlmICghQ0NfRURJVE9SKSBjYy53YXJuSUQoMTQwMCwgJ2VkaXRCb3guYmFja2dyb3VuZEltYWdlJywgJ2VkaXRCb3guYmFja2dyb3VuZCcpO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iYWNrZ3JvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5iYWNrZ3JvdW5kLnNwcml0ZUZyYW1lO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiAoIUNDX0VESVRPUikgY2Mud2FybklEKDE0MDAsICdlZGl0Qm94LmJhY2tncm91bmRJbWFnZScsICdlZGl0Qm94LmJhY2tncm91bmQnKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5iYWNrZ3JvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZC5zcHJpdGVGcmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIHJldHVybiBrZXkgdHlwZSBvZiBFZGl0Qm94LlxuICAgICAgICAgKiBOb3RlOiBpdCBpcyBtZWFuaW5nbGVzcyBmb3Igd2ViIHBsYXRmb3JtcyBhbmQgZGVza3RvcCBwbGF0Zm9ybXMuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5oyH5a6a56e75Yqo6K6+5aSH5LiK6Z2i5Zue6L2m5oyJ6ZKu55qE5qC35byP44CCXG4gICAgICAgICAqIOazqOaEj++8mui/meS4qumAiemhueWvuSB3ZWIg5bmz5Y+w5LiOIGRlc2t0b3Ag5bmz5Y+w5peg5pWI44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7RWRpdEJveC5LZXlib2FyZFJldHVyblR5cGV9IHJldHVyblR5cGVcbiAgICAgICAgICogQGRlZmF1bHQgS2V5Ym9hcmRSZXR1cm5UeXBlLkRFRkFVTFRcbiAgICAgICAgICovXG4gICAgICAgIHJldHVyblR5cGU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IEtleWJvYXJkUmV0dXJuVHlwZS5ERUZBVUxULFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5lZGl0Ym94LnJldHVyblR5cGUnLFxuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdLZXlib2FyZFJldHVyblR5cGUnLFxuICAgICAgICAgICAgdHlwZTogS2V5Ym9hcmRSZXR1cm5UeXBlLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFRvIGJlIHJlbW92ZWQgaW4gdGhlIGZ1dHVyZVxuICAgICAgICBfTiRyZXR1cm5UeXBlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICB0eXBlOiBjYy5GbG9hdCxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBTZXQgdGhlIGlucHV0IGZsYWdzIHRoYXQgYXJlIHRvIGJlIGFwcGxpZWQgdG8gdGhlIEVkaXRCb3guXG4gICAgICAgICAqICEjemgg5oyH5a6a6L6T5YWl5qCH5b+X5L2N77yM5Y+v5Lul5oyH5a6a6L6T5YWl5pa55byP5Li65a+G56CB5oiW6ICF5Y2V6K+N6aaW5a2X5q+N5aSn5YaZ44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7RWRpdEJveC5JbnB1dEZsYWd9IGlucHV0RmxhZ1xuICAgICAgICAgKiBAZGVmYXVsdCBJbnB1dEZsYWcuREVGQVVMVFxuICAgICAgICAgKi9cbiAgICAgICAgaW5wdXRGbGFnOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmVkaXRib3guaW5wdXRfZmxhZycsXG4gICAgICAgICAgICBkZWZhdWx0OiBJbnB1dEZsYWcuREVGQVVMVCxcbiAgICAgICAgICAgIHR5cGU6IElucHV0RmxhZyxcbiAgICAgICAgICAgIG5vdGlmeSAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlU3RyaW5nKHRoaXMuX3N0cmluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFNldCB0aGUgaW5wdXQgbW9kZSBvZiB0aGUgZWRpdCBib3guXG4gICAgICAgICAqIElmIHlvdSBwYXNzIEFOWSwgaXQgd2lsbCBjcmVhdGUgYSBtdWx0aWxpbmUgRWRpdEJveC5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDmjIflrprovpPlhaXmqKHlvI86IEFOWeihqOekuuWkmuihjOi+k+WFpe+8jOWFtuWug+mDveaYr+WNleihjOi+k+WFpe+8jOenu+WKqOW5s+WPsOS4iui/mOWPr+S7peaMh+WumumUruebmOagt+W8j+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0VkaXRCb3guSW5wdXRNb2RlfSBpbnB1dE1vZGVcbiAgICAgICAgICogQGRlZmF1bHQgSW5wdXRNb2RlLkFOWVxuICAgICAgICAgKi9cbiAgICAgICAgaW5wdXRNb2RlOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmVkaXRib3guaW5wdXRfbW9kZScsXG4gICAgICAgICAgICBkZWZhdWx0OiBJbnB1dE1vZGUuQU5ZLFxuICAgICAgICAgICAgdHlwZTogSW5wdXRNb2RlLFxuICAgICAgICAgICAgbm90aWZ5IChvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0TW9kZSAhPT0gb2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlVGV4dExhYmVsKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBsYWNlaG9sZGVyTGFiZWwoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gRm9udCBzaXplIG9mIHRoZSBpbnB1dCB0ZXh0LiBUaGlzIHByb3BlcnR5IHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlLCB1c2UgZWRpdEJveC50ZXh0TGFiZWwuZm9udFNpemUgaW5zdGVhZCBwbGVhc2UuXG4gICAgICAgICAqICEjemgg6L6T5YWl5qGG5paH5pys55qE5a2X5L2T5aSn5bCP44CCIOivpeWxnuaAp+S8muWcqOWwhuadpeeahOeJiOacrOS4reenu+mZpO+8jOivt+S9v+eUqCBlZGl0Qm94LnRleHRMYWJlbC5mb250U2l6ZeOAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZm9udFNpemVcbiAgICAgICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMVxuICAgICAgICAgKi9cbiAgICAgICAgZm9udFNpemU6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgKCFDQ19FRElUT1IpIGNjLndhcm5JRCgxNDAwLCAnZWRpdEJveC5mb250U2l6ZScsICdlZGl0Qm94LnRleHRMYWJlbC5mb250U2l6ZScpO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy50ZXh0TGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRleHRMYWJlbC5mb250U2l6ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgKCFDQ19FRElUT1IpIGNjLndhcm5JRCgxNDAwLCAnZWRpdEJveC5mb250U2l6ZScsICdlZGl0Qm94LnRleHRMYWJlbC5mb250U2l6ZScpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRleHRMYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHRMYWJlbC5mb250U2l6ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gVG8gYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlXG4gICAgICAgIF9OJGZvbnRTaXplOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICB0eXBlOiBjYy5GbG9hdCxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBDaGFuZ2UgdGhlIGxpbmVIZWlnaHQgb2YgZGlzcGxheWVkIHRleHQuIFRoaXMgcHJvcGVydHkgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBmdXR1cmUsIHVzZSBlZGl0Qm94LnRleHRMYWJlbC5saW5lSGVpZ2h0IGluc3RlYWQuXG4gICAgICAgICAqICEjemgg6L6T5YWl5qGG5paH5pys55qE6KGM6auY44CC6K+l5bGe5oCn5Lya5Zyo5bCG5p2l55qE54mI5pys5Lit56e76Zmk77yM6K+35L2/55SoIGVkaXRCb3gudGV4dExhYmVsLmxpbmVIZWlnaHRcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGxpbmVIZWlnaHRcbiAgICAgICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMVxuICAgICAgICAgKi9cbiAgICAgICAgbGluZUhlaWdodDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiAoIUNDX0VESVRPUikgY2Mud2FybklEKDE0MDAsICdlZGl0Qm94LmxpbmVIZWlnaHQnLCAnZWRpdEJveC50ZXh0TGFiZWwubGluZUhlaWdodCcpO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy50ZXh0TGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRleHRMYWJlbC5saW5lSGVpZ2h0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiAoIUNDX0VESVRPUikgY2Mud2FybklEKDE0MDAsICdlZGl0Qm94LmxpbmVIZWlnaHQnLCAnZWRpdEJveC50ZXh0TGFiZWwubGluZUhlaWdodCcpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRleHRMYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHRMYWJlbC5saW5lSGVpZ2h0ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBUbyBiZSByZW1vdmVkIGluIHRoZSBmdXR1cmVcbiAgICAgICAgX04kbGluZUhlaWdodDoge1xuICAgICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdHlwZTogY2MuRmxvYXQsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gRm9udCBjb2xvciBvZiB0aGUgaW5wdXQgdGV4dC4gVGhpcyBwcm9wZXJ0eSB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIGZ1dHVyZSwgdXNlIGVkaXRCb3gudGV4dExhYmVsLm5vZGUuY29sb3IgaW5zdGVhZC5cbiAgICAgICAgICogISN6aCDovpPlhaXmoYbmlofmnKznmoTpopzoibLjgILor6XlsZ7mgKfkvJrlnKjlsIbmnaXnmoTniYjmnKzkuK3np7vpmaTvvIzor7fkvb/nlKggZWRpdEJveC50ZXh0TGFiZWwubm9kZS5jb2xvclxuICAgICAgICAgKiBAcHJvcGVydHkge0NvbG9yfSBmb250Q29sb3JcbiAgICAgICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMVxuICAgICAgICAgKi9cbiAgICAgICAgZm9udENvbG9yOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIC8vIGlmICghQ0NfRURJVE9SKSBjYy53YXJuSUQoMTQwMCwgJ2VkaXRCb3guZm9udENvbG9yJywgJ2VkaXRCb3gudGV4dExhYmVsLm5vZGUuY29sb3InKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudGV4dExhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYy5Db2xvci5CTEFDSztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudGV4dExhYmVsLm5vZGUuY29sb3I7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIC8vIGlmICghQ0NfRURJVE9SKSBjYy53YXJuSUQoMTQwMCwgJ2VkaXRCb3guZm9udENvbG9yJywgJ2VkaXRCb3gudGV4dExhYmVsLm5vZGUuY29sb3InKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0TGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0TGFiZWwubm9kZS5jb2xvciA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHRMYWJlbC5ub2RlLm9wYWNpdHkgPSB2YWx1ZS5hO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gVG8gYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlXG4gICAgICAgIF9OJGZvbnRDb2xvcjogdW5kZWZpbmVkLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBkaXNwbGF5IHRleHQgb2YgcGxhY2Vob2xkZXIuXG4gICAgICAgICAqICEjemgg6L6T5YWl5qGG5Y2g5L2N56ym55qE5paH5pys5YaF5a6544CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBwbGFjZWhvbGRlclxuICAgICAgICAgKi9cbiAgICAgICAgcGxhY2Vob2xkZXI6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuZWRpdGJveC5wbGFjZWhvbGRlcicsXG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5wbGFjZWhvbGRlckxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXJMYWJlbC5zdHJpbmc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyTGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGFjZWhvbGRlckxhYmVsLnN0cmluZyA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyBUbyBiZSByZW1vdmVkIGluIHRoZSBmdXR1cmVcbiAgICAgICAgX04kcGxhY2Vob2xkZXI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlN0cmluZyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgZm9udCBzaXplIG9mIHBsYWNlaG9sZGVyLiBUaGlzIHByb3BlcnR5IHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlLCB1c2UgZWRpdEJveC5wbGFjZWhvbGRlckxhYmVsLmZvbnRTaXplIGluc3RlYWQuXG4gICAgICAgICAqICEjemgg6L6T5YWl5qGG5Y2g5L2N56ym55qE5a2X5L2T5aSn5bCP44CC6K+l5bGe5oCn5Lya5Zyo5bCG5p2l55qE54mI5pys5Lit56e76Zmk77yM6K+35L2/55SoIGVkaXRCb3gucGxhY2Vob2xkZXJMYWJlbC5mb250U2l6ZVxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gcGxhY2Vob2xkZXJGb250U2l6ZVxuICAgICAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4xXG4gICAgICAgICAqL1xuICAgICAgICBwbGFjZWhvbGRlckZvbnRTaXplOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIC8vIGlmICghQ0NfRURJVE9SKSBjYy53YXJuSUQoMTQwMCwgJ2VkaXRCb3gucGxhY2Vob2xkZXJGb250U2l6ZScsICdlZGl0Qm94LnBsYWNlaG9sZGVyTGFiZWwuZm9udFNpemUnKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMucGxhY2Vob2xkZXJMYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXJMYWJlbC5mb250U2l6ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgKCFDQ19FRElUT1IpIGNjLndhcm5JRCgxNDAwLCAnZWRpdEJveC5wbGFjZWhvbGRlckZvbnRTaXplJywgJ2VkaXRCb3gucGxhY2Vob2xkZXJMYWJlbC5mb250U2l6ZScpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyTGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGFjZWhvbGRlckxhYmVsLmZvbnRTaXplID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBUbyBiZSByZW1vdmVkIGluIHRoZSBmdXR1cmVcbiAgICAgICAgX04kcGxhY2Vob2xkZXJGb250U2l6ZToge1xuICAgICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdHlwZTogY2MuRmxvYXQsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIGZvbnQgY29sb3Igb2YgcGxhY2Vob2xkZXIuIFRoaXMgcHJvcGVydHkgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBmdXR1cmUsIHVzZSBlZGl0Qm94LnBsYWNlaG9sZGVyTGFiZWwubm9kZS5jb2xvciBpbnN0ZWFkLlxuICAgICAgICAgKiAhI3poIOi+k+WFpeahhuWNoOS9jeespueahOWtl+S9k+minOiJsuOAguivpeWxnuaAp+S8muWcqOWwhuadpeeahOeJiOacrOS4reenu+mZpO+8jOivt+S9v+eUqCBlZGl0Qm94LnBsYWNlaG9sZGVyTGFiZWwubm9kZS5jb2xvclxuICAgICAgICAgKiBAcHJvcGVydHkge0NvbG9yfSBwbGFjZWhvbGRlckZvbnRDb2xvclxuICAgICAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4xXG4gICAgICAgICAqL1xuICAgICAgICBwbGFjZWhvbGRlckZvbnRDb2xvcjoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiAoIUNDX0VESVRPUikgY2Mud2FybklEKDE0MDAsICdlZGl0Qm94LnBsYWNlaG9sZGVyRm9udENvbG9yJywgJ2VkaXRCb3gucGxhY2Vob2xkZXJMYWJlbC5ub2RlLmNvbG9yJyk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnBsYWNlaG9sZGVyTGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNjLkNvbG9yLkJMQUNLO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wbGFjZWhvbGRlckxhYmVsLm5vZGUuY29sb3I7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIC8vIGlmICghQ0NfRURJVE9SKSBjYy53YXJuSUQoMTQwMCwgJ2VkaXRCb3gucGxhY2Vob2xkZXJGb250Q29sb3InLCAnZWRpdEJveC5wbGFjZWhvbGRlckxhYmVsLm5vZGUuY29sb3InKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wbGFjZWhvbGRlckxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGxhY2Vob2xkZXJMYWJlbC5ub2RlLmNvbG9yID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGxhY2Vob2xkZXJMYWJlbC5ub2RlLm9wYWNpdHkgPSB2YWx1ZS5hO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gVG8gYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlXG4gICAgICAgIF9OJHBsYWNlaG9sZGVyRm9udENvbG9yOiB1bmRlZmluZWQsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIG1heGltaXplIGlucHV0IGxlbmd0aCBvZiBFZGl0Qm94LlxuICAgICAgICAgKiAtIElmIHBhc3MgYSB2YWx1ZSBsZXNzIHRoYW4gMCwgaXQgd29uJ3QgbGltaXQgdGhlIGlucHV0IG51bWJlciBvZiBjaGFyYWN0ZXJzLlxuICAgICAgICAgKiAtIElmIHBhc3MgMCwgaXQgZG9lc24ndCBhbGxvdyBpbnB1dCBhbnkgY2hhcmFjdGVycy5cbiAgICAgICAgICogISN6aCDovpPlhaXmoYbmnIDlpKflhYHorrjovpPlhaXnmoTlrZfnrKbkuKrmlbDjgIJcbiAgICAgICAgICogLSDlpoLmnpzlgLzkuLrlsI/kuo4gMCDnmoTlgLzvvIzliJnkuI3kvJrpmZDliLbovpPlhaXlrZfnrKbkuKrmlbDjgIJcbiAgICAgICAgICogLSDlpoLmnpzlgLzkuLogMO+8jOWImeS4jeWFgeiuuOeUqOaIt+i/m+ihjOS7u+S9lei+k+WFpeOAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbWF4TGVuZ3RoXG4gICAgICAgICAqL1xuICAgICAgICBtYXhMZW5ndGg6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuZWRpdGJveC5tYXhfbGVuZ3RoJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IDIwLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFRvIGJlIHJlbW92ZWQgaW4gdGhlIGZ1dHVyZVxuICAgICAgICBfTiRtYXhMZW5ndGg6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkZsb2F0LFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBpbnB1dCBpcyBhbHdheXMgdmlzaWJsZSBhbmQgYmUgb24gdG9wIG9mIHRoZSBnYW1lIHZpZXcgKG9ubHkgdXNlZnVsIG9uIFdlYiksIHRoaXMgcHJvcGVydHkgd2lsbCBiZSByZW1vdmVkIG9uIHYyLjFcbiAgICAgICAgICogIXpoIOi+k+WFpeahhuaAu+aYr+WPr+inge+8jOW5tuS4lOawuOi/nOWcqOa4uOaIj+inhuWbvueahOS4iumdou+8iOi/meS4quWxnuaAp+WPquacieWcqCBXZWIg5LiK6Z2i5L+u5pS55pyJ5oSP5LmJ77yJ77yM6K+l5bGe5oCn5Lya5ZyoIHYyLjEg5Lit56e76ZmkXG4gICAgICAgICAqIE5vdGU6IG9ubHkgYXZhaWxhYmxlIG9uIFdlYiBhdCB0aGUgbW9tZW50LlxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IHN0YXlPblRvcFxuICAgICAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSAyLjAuOFxuICAgICAgICAgKi9cbiAgICAgICAgc3RheU9uVG9wOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIG5vdGlmeSAoKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybignZWRpdEJveC5zdGF5T25Ub3AgaXMgcmVtb3ZlZCBzaW5jZSB2Mi4xLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF90YWJJbmRleDogMCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBTZXQgdGhlIHRhYkluZGV4IG9mIHRoZSBET00gaW5wdXQgZWxlbWVudCAob25seSB1c2VmdWwgb24gV2ViKS5cbiAgICAgICAgICogISN6aCDkv67mlLkgRE9NIOi+k+WFpeWFg+e0oOeahCB0YWJJbmRleO+8iOi/meS4quWxnuaAp+WPquacieWcqCBXZWIg5LiK6Z2i5L+u5pS55pyJ5oSP5LmJ77yJ44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB0YWJJbmRleFxuICAgICAgICAgKi9cbiAgICAgICAgdGFiSW5kZXg6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuZWRpdGJveC50YWJfaW5kZXgnLFxuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFiSW5kZXg7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90YWJJbmRleCAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGFiSW5kZXggPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ltcGwuc2V0VGFiSW5kZXgodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBldmVudCBoYW5kbGVyIHRvIGJlIGNhbGxlZCB3aGVuIEVkaXRCb3ggYmVnYW4gdG8gZWRpdCB0ZXh0LlxuICAgICAgICAgKiAhI3poIOW8gOWni+e8lui+keaWh+acrOi+k+WFpeahhuinpuWPkeeahOS6i+S7tuWbnuiwg+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0NvbXBvbmVudC5FdmVudEhhbmRsZXJbXX0gZWRpdGluZ0RpZEJlZ2FuXG4gICAgICAgICAqL1xuICAgICAgICBlZGl0aW5nRGlkQmVnYW46IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlcixcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgZXZlbnQgaGFuZGxlciB0byBiZSBjYWxsZWQgd2hlbiBFZGl0Qm94IHRleHQgY2hhbmdlcy5cbiAgICAgICAgICogISN6aCDnvJbovpHmlofmnKzovpPlhaXmoYbml7bop6blj5HnmoTkuovku7blm57osIPjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtDb21wb25lbnQuRXZlbnRIYW5kbGVyW119IHRleHRDaGFuZ2VkXG4gICAgICAgICAqL1xuICAgICAgICB0ZXh0Q2hhbmdlZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBldmVudCBoYW5kbGVyIHRvIGJlIGNhbGxlZCB3aGVuIEVkaXRCb3ggZWRpdCBlbmRzLlxuICAgICAgICAgKiAhI3poIOe7k+adn+e8lui+keaWh+acrOi+k+WFpeahhuaXtuinpuWPkeeahOS6i+S7tuWbnuiwg+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0NvbXBvbmVudC5FdmVudEhhbmRsZXJbXX0gZWRpdGluZ0RpZEVuZGVkXG4gICAgICAgICAqL1xuICAgICAgICBlZGl0aW5nRGlkRW5kZWQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlcixcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgZXZlbnQgaGFuZGxlciB0byBiZSBjYWxsZWQgd2hlbiByZXR1cm4ga2V5IGlzIHByZXNzZWQuIFdpbmRvd3MgaXMgbm90IHN1cHBvcnRlZC5cbiAgICAgICAgICogISN6aCDlvZPnlKjmiLfmjInkuIvlm57ovabmjInplK7ml7bnmoTkuovku7blm57osIPvvIznm67liY3kuI3mlK/mjIEgd2luZG93cyDlubPlj7BcbiAgICAgICAgICogQHByb3BlcnR5IHtDb21wb25lbnQuRXZlbnRIYW5kbGVyW119IGVkaXRpbmdSZXR1cm5cbiAgICAgICAgICovXG4gICAgICAgIGVkaXRpbmdSZXR1cm46IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlclxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICBfSW1wbENsYXNzOiBFZGl0Qm94SW1wbEJhc2UsICAvLyBpbXBsZW1lbnRlZCBvbiBkaWZmZXJlbnQgcGxhdGZvcm0gYWRhcHRlclxuICAgICAgICBLZXlib2FyZFJldHVyblR5cGU6IEtleWJvYXJkUmV0dXJuVHlwZSxcbiAgICAgICAgSW5wdXRGbGFnOiBJbnB1dEZsYWcsXG4gICAgICAgIElucHV0TW9kZTogSW5wdXRNb2RlXG4gICAgfSxcblxuICAgIF9pbml0ICgpIHtcbiAgICAgICAgdGhpcy5fdXBncmFkZUNvbXAoKTtcblxuICAgICAgICB0aGlzLl9pc0xhYmVsVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMuX3N5bmNTaXplLCB0aGlzKTtcblxuICAgICAgICBsZXQgaW1wbCA9IHRoaXMuX2ltcGwgPSBuZXcgRWRpdEJveC5fSW1wbENsYXNzKCk7XG4gICAgICAgIGltcGwuaW5pdCh0aGlzKTtcblxuICAgICAgICB0aGlzLl91cGRhdGVTdHJpbmcodGhpcy5fc3RyaW5nKTtcbiAgICAgICAgdGhpcy5fc3luY1NpemUoKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZUJhY2tncm91bmRTcHJpdGUgKCkge1xuICAgICAgICBsZXQgYmFja2dyb3VuZCA9IHRoaXMuYmFja2dyb3VuZDtcblxuICAgICAgICAvLyBJZiBiYWNrZ3JvdW5kIGRvZXNuJ3QgZXhpc3QsIGNyZWF0ZSBvbmUuXG4gICAgICAgIGlmICghYmFja2dyb3VuZCkge1xuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ0JBQ0tHUk9VTkRfU1BSSVRFJyk7XG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgICAgICBub2RlID0gbmV3IGNjLk5vZGUoJ0JBQ0tHUk9VTkRfU1BSSVRFJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGJhY2tncm91bmQgPSBub2RlLmdldENvbXBvbmVudChjYy5TcHJpdGUpO1xuICAgICAgICAgICAgaWYgKCFiYWNrZ3JvdW5kKSB7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZCA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub2RlLnBhcmVudCA9IHRoaXMubm9kZTtcbiAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZCA9IGJhY2tncm91bmQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1cGRhdGVcbiAgICAgICAgYmFja2dyb3VuZC50eXBlID0gY2MuU3ByaXRlLlR5cGUuU0xJQ0VEO1xuICAgICAgICBcbiAgICAgICAgLy8gaGFuZGxlIG9sZCBkYXRhXG4gICAgICAgIGlmICh0aGlzLl9OJGJhY2tncm91bmRJbWFnZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLnNwcml0ZUZyYW1lID0gdGhpcy5fTiRiYWNrZ3JvdW5kSW1hZ2U7XG4gICAgICAgICAgICB0aGlzLl9OJGJhY2tncm91bmRJbWFnZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXBkYXRlVGV4dExhYmVsICgpIHtcbiAgICAgICAgbGV0IHRleHRMYWJlbCA9IHRoaXMudGV4dExhYmVsO1xuXG4gICAgICAgIC8vIElmIHRleHRMYWJlbCBkb2Vzbid0IGV4aXN0LCBjcmVhdGUgb25lLlxuICAgICAgICBpZiAoIXRleHRMYWJlbCkge1xuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ1RFWFRfTEFCRUwnKTtcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xuICAgICAgICAgICAgICAgIG5vZGUgPSBuZXcgY2MuTm9kZSgnVEVYVF9MQUJFTCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGV4dExhYmVsID0gbm9kZS5nZXRDb21wb25lbnQoTGFiZWwpO1xuICAgICAgICAgICAgaWYgKCF0ZXh0TGFiZWwpIHtcbiAgICAgICAgICAgICAgICB0ZXh0TGFiZWwgPSBub2RlLmFkZENvbXBvbmVudChMYWJlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub2RlLnBhcmVudCA9IHRoaXMubm9kZTtcbiAgICAgICAgICAgIHRoaXMudGV4dExhYmVsID0gdGV4dExhYmVsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdXBkYXRlXG4gICAgICAgIHRleHRMYWJlbC5ub2RlLnNldEFuY2hvclBvaW50KDAsIDEpO1xuICAgICAgICB0ZXh0TGFiZWwub3ZlcmZsb3cgPSBMYWJlbC5PdmVyZmxvdy5DTEFNUDtcbiAgICAgICAgaWYgKHRoaXMuaW5wdXRNb2RlID09PSBJbnB1dE1vZGUuQU5ZKSB7XG4gICAgICAgICAgICB0ZXh0TGFiZWwudmVydGljYWxBbGlnbiA9IG1hY3JvLlZlcnRpY2FsVGV4dEFsaWdubWVudC5UT1A7XG4gICAgICAgICAgICB0ZXh0TGFiZWwuZW5hYmxlV3JhcFRleHQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGV4dExhYmVsLnZlcnRpY2FsQWxpZ24gPSBtYWNyby5WZXJ0aWNhbFRleHRBbGlnbm1lbnQuQ0VOVEVSO1xuICAgICAgICAgICAgdGV4dExhYmVsLmVuYWJsZVdyYXBUZXh0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGV4dExhYmVsLnN0cmluZyA9IHRoaXMuX3VwZGF0ZUxhYmVsU3RyaW5nU3R5bGUodGhpcy5fc3RyaW5nKTtcblxuICAgICAgICAvLyBoYW5kbGUgb2xkIGRhdGFcbiAgICAgICAgaWYgKHRoaXMuX04kZm9udENvbG9yICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRleHRMYWJlbC5ub2RlLmNvbG9yID0gdGhpcy5fTiRmb250Q29sb3I7XG4gICAgICAgICAgICB0ZXh0TGFiZWwubm9kZS5vcGFjaXR5ID0gdGhpcy5fTiRmb250Q29sb3IuYTtcbiAgICAgICAgICAgIHRoaXMuX04kZm9udENvbG9yID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9OJGZvbnRTaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRleHRMYWJlbC5mb250U2l6ZSA9IHRoaXMuX04kZm9udFNpemU7XG4gICAgICAgICAgICB0aGlzLl9OJGZvbnRTaXplID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9OJGxpbmVIZWlnaHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGV4dExhYmVsLmxpbmVIZWlnaHQgPSB0aGlzLl9OJGxpbmVIZWlnaHQ7XG4gICAgICAgICAgICB0aGlzLl9OJGxpbmVIZWlnaHQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VwZGF0ZVBsYWNlaG9sZGVyTGFiZWwgKCkge1xuICAgICAgICBsZXQgcGxhY2Vob2xkZXJMYWJlbCA9IHRoaXMucGxhY2Vob2xkZXJMYWJlbDtcblxuICAgICAgICAvLyBJZiBwbGFjZWhvbGRlckxhYmVsIGRvZXNuJ3QgZXhpc3QsIGNyZWF0ZSBvbmUuXG4gICAgICAgIGlmICghcGxhY2Vob2xkZXJMYWJlbCkge1xuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ1BMQUNFSE9MREVSX0xBQkVMJyk7XG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgICAgICBub2RlID0gbmV3IGNjLk5vZGUoJ1BMQUNFSE9MREVSX0xBQkVMJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwbGFjZWhvbGRlckxhYmVsID0gbm9kZS5nZXRDb21wb25lbnQoTGFiZWwpO1xuICAgICAgICAgICAgaWYgKCFwbGFjZWhvbGRlckxhYmVsKSB7XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJMYWJlbCA9IG5vZGUuYWRkQ29tcG9uZW50KExhYmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGUucGFyZW50ID0gdGhpcy5ub2RlO1xuICAgICAgICAgICAgdGhpcy5wbGFjZWhvbGRlckxhYmVsID0gcGxhY2Vob2xkZXJMYWJlbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZVxuICAgICAgICBwbGFjZWhvbGRlckxhYmVsLm5vZGUuc2V0QW5jaG9yUG9pbnQoMCwgMSk7XG4gICAgICAgIHBsYWNlaG9sZGVyTGFiZWwub3ZlcmZsb3cgPSBMYWJlbC5PdmVyZmxvdy5DTEFNUDtcbiAgICAgICAgaWYgKHRoaXMuaW5wdXRNb2RlID09PSBJbnB1dE1vZGUuQU5ZKSB7XG4gICAgICAgICAgICBwbGFjZWhvbGRlckxhYmVsLnZlcnRpY2FsQWxpZ24gPSBtYWNyby5WZXJ0aWNhbFRleHRBbGlnbm1lbnQuVE9QO1xuICAgICAgICAgICAgcGxhY2Vob2xkZXJMYWJlbC5lbmFibGVXcmFwVGV4dCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwbGFjZWhvbGRlckxhYmVsLnZlcnRpY2FsQWxpZ24gPSBtYWNyby5WZXJ0aWNhbFRleHRBbGlnbm1lbnQuQ0VOVEVSO1xuICAgICAgICAgICAgcGxhY2Vob2xkZXJMYWJlbC5lbmFibGVXcmFwVGV4dCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHBsYWNlaG9sZGVyTGFiZWwuc3RyaW5nID0gdGhpcy5wbGFjZWhvbGRlcjtcblxuICAgICAgICAvLyBoYW5kbGUgb2xkIGRhdGFcbiAgICAgICAgaWYgKHRoaXMuX04kcGxhY2Vob2xkZXJGb250Q29sb3IgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcGxhY2Vob2xkZXJMYWJlbC5ub2RlLmNvbG9yID0gdGhpcy5fTiRwbGFjZWhvbGRlckZvbnRDb2xvcjtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyTGFiZWwubm9kZS5vcGFjaXR5ID0gdGhpcy5fTiRwbGFjZWhvbGRlckZvbnRDb2xvci5hO1xuICAgICAgICAgICAgdGhpcy5fTiRwbGFjZWhvbGRlckZvbnRDb2xvciA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fTiRwbGFjZWhvbGRlckZvbnRTaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyTGFiZWwuZm9udFNpemUgPSB0aGlzLl9OJHBsYWNlaG9sZGVyRm9udFNpemU7XG4gICAgICAgICAgICB0aGlzLl9OJHBsYWNlaG9sZGVyRm9udFNpemUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VwZ3JhZGVDb21wICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX04kcmV0dXJuVHlwZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnJldHVyblR5cGUgPSB0aGlzLl9OJHJldHVyblR5cGU7XG4gICAgICAgICAgICB0aGlzLl9OJHJldHVyblR5cGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX04kbWF4TGVuZ3RoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMubWF4TGVuZ3RoID0gdGhpcy5fTiRtYXhMZW5ndGg7XG4gICAgICAgICAgICB0aGlzLl9OJG1heExlbmd0aCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fTiRiYWNrZ3JvdW5kSW1hZ2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQmFja2dyb3VuZFNwcml0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9OJGZvbnRDb2xvciAhPT0gdW5kZWZpbmVkIHx8IHRoaXMuX04kZm9udFNpemUgIT09IHVuZGVmaW5lZCB8fCB0aGlzLl9OJGxpbmVIZWlnaHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlVGV4dExhYmVsKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX04kcGxhY2Vob2xkZXJGb250Q29sb3IgIT09IHVuZGVmaW5lZCB8fCB0aGlzLl9OJHBsYWNlaG9sZGVyRm9udFNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUGxhY2Vob2xkZXJMYWJlbCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9OJHBsYWNlaG9sZGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMucGxhY2Vob2xkZXIgPSB0aGlzLl9OJHBsYWNlaG9sZGVyO1xuICAgICAgICAgICAgdGhpcy5fTiRwbGFjZWhvbGRlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfc3luY1NpemUgKCkge1xuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgbGV0IHNpemUgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKTtcbiAgICAgICAgICAgIHRoaXMuX2ltcGwuc2V0U2l6ZShzaXplLndpZHRoLCBzaXplLmhlaWdodCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3Nob3dMYWJlbHMgKCkge1xuICAgICAgICB0aGlzLl9pc0xhYmVsVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUxhYmVscygpO1xuICAgIH0sXG5cbiAgICBfaGlkZUxhYmVscyAoKSB7XG4gICAgICAgIHRoaXMuX2lzTGFiZWxWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLnRleHRMYWJlbCkge1xuICAgICAgICAgICAgdGhpcy50ZXh0TGFiZWwubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wbGFjZWhvbGRlckxhYmVsKSB7XG4gICAgICAgICAgICB0aGlzLnBsYWNlaG9sZGVyTGFiZWwubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXBkYXRlTGFiZWxzICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzTGFiZWxWaXNpYmxlKSB7XG4gICAgICAgICAgICBsZXQgY29udGVudCA9IHRoaXMuX3N0cmluZztcbiAgICAgICAgICAgIGlmICh0aGlzLnRleHRMYWJlbCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dExhYmVsLm5vZGUuYWN0aXZlID0gKGNvbnRlbnQgIT09ICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyTGFiZWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYWNlaG9sZGVyTGFiZWwubm9kZS5hY3RpdmUgPSAoY29udGVudCA9PT0gJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVTdHJpbmcgKHRleHQpIHtcbiAgICAgICAgbGV0IHRleHRMYWJlbCA9IHRoaXMudGV4dExhYmVsO1xuICAgICAgICAvLyBOb3QgaW5pdGVkIHlldFxuICAgICAgICBpZiAoIXRleHRMYWJlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRpc3BsYXlUZXh0ID0gdGV4dDtcbiAgICAgICAgaWYgKGRpc3BsYXlUZXh0KSB7XG4gICAgICAgICAgICBkaXNwbGF5VGV4dCA9IHRoaXMuX3VwZGF0ZUxhYmVsU3RyaW5nU3R5bGUoZGlzcGxheVRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGV4dExhYmVsLnN0cmluZyA9IGRpc3BsYXlUZXh0O1xuXG4gICAgICAgIHRoaXMuX3VwZGF0ZUxhYmVscygpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlTGFiZWxTdHJpbmdTdHlsZSAodGV4dCwgaWdub3JlUGFzc3dvcmQpIHtcbiAgICAgICAgbGV0IGlucHV0RmxhZyA9IHRoaXMuaW5wdXRGbGFnO1xuICAgICAgICBpZiAoIWlnbm9yZVBhc3N3b3JkICYmIGlucHV0RmxhZyA9PT0gSW5wdXRGbGFnLlBBU1NXT1JEKSB7XG4gICAgICAgICAgICBsZXQgcGFzc3dvcmRTdHJpbmcgPSAnJztcbiAgICAgICAgICAgIGxldCBsZW4gPSB0ZXh0Lmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICAgICAgICBwYXNzd29yZFN0cmluZyArPSAnXFx1MjVDRic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ZXh0ID0gcGFzc3dvcmRTdHJpbmc7XG4gICAgICAgIH0gXG4gICAgICAgIGVsc2UgaWYgKGlucHV0RmxhZyA9PT0gSW5wdXRGbGFnLklOSVRJQUxfQ0FQU19BTExfQ0hBUkFDVEVSUykge1xuICAgICAgICAgICAgdGV4dCA9IHRleHQudG9VcHBlckNhc2UoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpbnB1dEZsYWcgPT09IElucHV0RmxhZy5JTklUSUFMX0NBUFNfV09SRCkge1xuICAgICAgICAgICAgdGV4dCA9IGNhcGl0YWxpemUodGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaW5wdXRGbGFnID09PSBJbnB1dEZsYWcuSU5JVElBTF9DQVBTX1NFTlRFTkNFKSB7XG4gICAgICAgICAgICB0ZXh0ID0gY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfSxcblxuICAgIGVkaXRCb3hFZGl0aW5nRGlkQmVnYW4gKCkge1xuICAgICAgICBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyLmVtaXRFdmVudHModGhpcy5lZGl0aW5nRGlkQmVnYW4sIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUuZW1pdCgnZWRpdGluZy1kaWQtYmVnYW4nLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgZWRpdEJveEVkaXRpbmdEaWRFbmRlZCAoKSB7XG4gICAgICAgIGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIuZW1pdEV2ZW50cyh0aGlzLmVkaXRpbmdEaWRFbmRlZCwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5lbWl0KCdlZGl0aW5nLWRpZC1lbmRlZCcsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBlZGl0Qm94VGV4dENoYW5nZWQgKHRleHQpIHtcbiAgICAgICAgdGV4dCA9IHRoaXMuX3VwZGF0ZUxhYmVsU3RyaW5nU3R5bGUodGV4dCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuc3RyaW5nID0gdGV4dDtcbiAgICAgICAgY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlci5lbWl0RXZlbnRzKHRoaXMudGV4dENoYW5nZWQsIHRleHQsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUuZW1pdCgndGV4dC1jaGFuZ2VkJywgdGhpcyk7XG4gICAgfSxcblxuICAgIGVkaXRCb3hFZGl0aW5nUmV0dXJuKCkge1xuICAgICAgICBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyLmVtaXRFdmVudHModGhpcy5lZGl0aW5nUmV0dXJuLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLmVtaXQoJ2VkaXRpbmctcmV0dXJuJywgdGhpcyk7XG4gICAgfSxcblxuICAgIG9uRW5hYmxlICgpIHtcbiAgICAgICAgaWYgKCFDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlZ2lzdGVyRXZlbnQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgdGhpcy5faW1wbC5lbmFibGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkRpc2FibGUgKCkge1xuICAgICAgICBpZiAoIUNDX0VESVRPUikge1xuICAgICAgICAgICAgdGhpcy5fdW5yZWdpc3RlckV2ZW50KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcbiAgICAgICAgICAgIHRoaXMuX2ltcGwuZGlzYWJsZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRGVzdHJveSAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICB0aGlzLl9pbXBsLmNsZWFyKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX19wcmVsb2FkICgpIHtcbiAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgIH0sXG5cbiAgICBfcmVnaXN0ZXJFdmVudCAoKSB7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5fb25Ub3VjaEJlZ2FuLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5fb25Ub3VjaEVuZGVkLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX3VucmVnaXN0ZXJFdmVudCAoKSB7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuX29uVG91Y2hCZWdhbiwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLl9vblRvdWNoRW5kZWQsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfb25Ub3VjaEJlZ2FuIChldmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9LFxuXG4gICAgX29uVG91Y2hDYW5jZWwgKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0sXG5cbiAgICBfb25Ub3VjaEVuZGVkIChldmVudCkge1xuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgdGhpcy5faW1wbC5iZWdpbkVkaXRpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBMZXQgdGhlIEVkaXRCb3ggZ2V0IGZvY3VzLCB0aGlzIG1ldGhvZCB3aWxsIGJlIHJlbW92ZWQgb24gdjIuMVxuICAgICAqICEjemgg6K6p5b2T5YmNIEVkaXRCb3gg6I635b6X54Sm54K5LCDov5nkuKrmlrnms5XkvJrlnKggdjIuMSDkuK3np7vpmaRcbiAgICAgKiBAbWV0aG9kIHNldEZvY3VzXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgMi4wLjhcbiAgICAgKi9cbiAgICBzZXRGb2N1cyAoKSB7XG4gICAgICAgIGNjLmVycm9ySUQoMTQwMCwgJ3NldEZvY3VzKCknLCAnZm9jdXMoKScpO1xuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgdGhpcy5faW1wbC5zZXRGb2N1cyh0cnVlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIExldCB0aGUgRWRpdEJveCBnZXQgZm9jdXNcbiAgICAgKiAhI3poIOiuqeW9k+WJjSBFZGl0Qm94IOiOt+W+l+eEpueCuVxuICAgICAqIEBtZXRob2QgZm9jdXNcbiAgICAgKi9cbiAgICBmb2N1cyAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICB0aGlzLl9pbXBsLnNldEZvY3VzKHRydWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gTGV0IHRoZSBFZGl0Qm94IGxvc2UgZm9jdXNcbiAgICAgKiAhI3poIOiuqeW9k+WJjSBFZGl0Qm94IOWkseWOu+eEpueCuVxuICAgICAqIEBtZXRob2QgYmx1clxuICAgICAqL1xuICAgIGJsdXIgKCkge1xuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgdGhpcy5faW1wbC5zZXRGb2N1cyhmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBEZXRlcm1pbmUgd2hldGhlciBFZGl0Qm94IGlzIGdldHRpbmcgZm9jdXMgb3Igbm90LlxuICAgICAqICEjemgg5Yik5patIEVkaXRCb3gg5piv5ZCm6I635b6X5LqG54Sm54K5XG4gICAgICogQG1ldGhvZCBpc0ZvY3VzZWRcbiAgICAgKi9cbiAgICBpc0ZvY3VzZWQgKCkge1xuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ltcGwuaXNGb2N1c2VkKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcbiAgICAgICAgICAgIHRoaXMuX2ltcGwudXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pO1xuXG5jYy5FZGl0Qm94ID0gbW9kdWxlLmV4cG9ydHMgPSBFZGl0Qm94O1xuXG5pZiAoY2Muc3lzLmlzQnJvd3Nlcikge1xuICAgIHJlcXVpcmUoJy4vV2ViRWRpdEJveEltcGwnKTtcbn1cblxuLyoqXG4gKiAhI2VuXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXG4gKiAhI3poXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcbiAqIEBldmVudCBlZGl0aW5nLWRpZC1iZWdhblxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqIEBwYXJhbSB7RWRpdEJveH0gZWRpdGJveCAtIFRoZSBFZGl0Qm94IGNvbXBvbmVudC5cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IGVkaXRpbmctZGlkLWVuZGVkXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxuICogQHBhcmFtIHtFZGl0Qm94fSBlZGl0Ym94IC0gVGhlIEVkaXRCb3ggY29tcG9uZW50LlxuICovXG5cbi8qKlxuICogISNlblxuICogTm90ZTogVGhpcyBldmVudCBpcyBlbWl0dGVkIGZyb20gdGhlIG5vZGUgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBiZWxvbmdzLlxuICogISN6aFxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXG4gKiBAZXZlbnQgdGV4dC1jaGFuZ2VkXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxuICogQHBhcmFtIHtFZGl0Qm94fSBlZGl0Ym94IC0gVGhlIEVkaXRCb3ggY29tcG9uZW50LlxuICovXG5cbi8qKlxuICogISNlblxuICogTm90ZTogVGhpcyBldmVudCBpcyBlbWl0dGVkIGZyb20gdGhlIG5vZGUgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBiZWxvbmdzLlxuICogISN6aFxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXG4gKiBAZXZlbnQgZWRpdGluZy1yZXR1cm5cbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XG4gKiBAcGFyYW0ge0VkaXRCb3h9IGVkaXRib3ggLSBUaGUgRWRpdEJveCBjb21wb25lbnQuXG4gKi9cblxuLyoqXG4gKiAhI2VuIGlmIHlvdSBkb24ndCBuZWVkIHRoZSBFZGl0Qm94IGFuZCBpdCBpc24ndCBpbiBhbnkgcnVubmluZyBTY2VuZSwgeW91IHNob3VsZFxuICogY2FsbCB0aGUgZGVzdHJveSBtZXRob2Qgb24gdGhpcyBjb21wb25lbnQgb3IgdGhlIGFzc29jaWF0ZWQgbm9kZSBleHBsaWNpdGx5LlxuICogT3RoZXJ3aXNlLCB0aGUgY3JlYXRlZCBET00gZWxlbWVudCB3b24ndCBiZSByZW1vdmVkIGZyb20gd2ViIHBhZ2UuXG4gKiAhI3poXG4gKiDlpoLmnpzkvaDkuI3lho3kvb/nlKggRWRpdEJveO+8jOW5tuS4lOe7hOS7tuacqua3u+WKoOWIsOWcuuaZr+S4re+8jOmCo+S5iOS9oOW/hemhu+aJi+WKqOWvuee7hOS7tuaIluaJgOWcqOiKgueCueiwg+eUqCBkZXN0cm9544CCXG4gKiDov5nmoLfmiY3og73np7vpmaTnvZHpobXkuIrnmoQgRE9NIOiKgueCue+8jOmBv+WFjSBXZWIg5bmz5Y+w5YaF5a2Y5rOE6Zyy44CCXG4gKiBAZXhhbXBsZVxuICogZWRpdGJveC5ub2RlLnBhcmVudCA9IG51bGw7ICAvLyBvciAgZWRpdGJveC5ub2RlLnJlbW92ZUZyb21QYXJlbnQoZmFsc2UpO1xuICogLy8gd2hlbiB5b3UgZG9uJ3QgbmVlZCBlZGl0Ym94IGFueW1vcmVcbiAqIGVkaXRib3gubm9kZS5kZXN0cm95KCk7XG4gKiBAbWV0aG9kIGRlc3Ryb3lcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHdoZXRoZXIgaXQgaXMgdGhlIGZpcnN0IHRpbWUgdGhlIGRlc3Ryb3kgYmVpbmcgY2FsbGVkXG4gKi8iXSwic291cmNlUm9vdCI6Ii8ifQ==