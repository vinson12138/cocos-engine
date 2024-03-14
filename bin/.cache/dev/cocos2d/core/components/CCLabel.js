
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCLabel.js';
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
var macro = require('../platform/CCMacro');

var RenderComponent = require('./CCRenderComponent');

var Material = require('../assets/material/CCMaterial');

var LabelFrame = require('../renderer/utils/label/label-frame');

var BlendFunc = require('../utils/blend-func');

var deleteFromDynamicAtlas = require('../renderer/utils/utils').deleteFromDynamicAtlas;
/**
 * !#en Enum for text alignment.
 * !#zh 文本横向对齐类型
 * @enum Label.HorizontalAlign
 */

/**
 * !#en Alignment left for text.
 * !#zh 文本内容左对齐。
 * @property {Number} LEFT
 */

/**
 * !#en Alignment center for text.
 * !#zh 文本内容居中对齐。
 * @property {Number} CENTER
 */

/**
 * !#en Alignment right for text.
 * !#zh 文本内容右边对齐。
 * @property {Number} RIGHT
 */


var HorizontalAlign = macro.TextAlignment;
/**
 * !#en Enum for vertical text alignment.
 * !#zh 文本垂直对齐类型
 * @enum Label.VerticalAlign
 */

/**
 * !#en Vertical alignment top for text.
 * !#zh 文本顶部对齐。
 * @property {Number} TOP
 */

/**
 * !#en Vertical alignment center for text.
 * !#zh 文本居中对齐。
 * @property {Number} CENTER
 */

/**
 * !#en Vertical alignment bottom for text.
 * !#zh 文本底部对齐。
 * @property {Number} BOTTOM
 */

var VerticalAlign = macro.VerticalTextAlignment;
/**
 * !#en Enum for Overflow.
 * !#zh Overflow 类型
 * @enum Label.Overflow
 */

/**
 * !#en NONE.
 * !#zh 不做任何限制。
 * @property {Number} NONE
 */

/**
 * !#en In CLAMP mode, when label content goes out of the bounding box, it will be clipped.
 * !#zh CLAMP 模式中，当文本内容超出边界框时，多余的会被截断。
 * @property {Number} CLAMP
 */

/**
 * !#en In SHRINK mode, the font size will change dynamically to adapt the content size. This mode may takes up more CPU resources when the label is refreshed.
 * !#zh SHRINK 模式，字体大小会动态变化，以适应内容大小。这个模式在文本刷新的时候可能会占用较多 CPU 资源。
 * @property {Number} SHRINK
 */

/**
 * !#en In RESIZE_HEIGHT mode, you can only change the width of label and the height is changed automatically.
 * !#zh 在 RESIZE_HEIGHT 模式下，只能更改文本的宽度，高度是自动改变的。
 * @property {Number} RESIZE_HEIGHT
 */

var Overflow = cc.Enum({
  NONE: 0,
  CLAMP: 1,
  SHRINK: 2,
  RESIZE_HEIGHT: 3
});
/**
 * !#en Enum for font type.
 * !#zh Type 类型
 * @enum Label.Type
 */

/**
 * !#en The TTF font type.
 * !#zh TTF字体
 * @property {Number} TTF
 */

/**
 * !#en The bitmap font type.
 * !#zh 位图字体
 * @property {Number} BMFont
 */

/**
 * !#en The system font type.
 * !#zh 系统字体
 * @property {Number} SystemFont
 */

/**
 * !#en Enum for cache mode.
 * !#zh CacheMode 类型
 * @enum Label.CacheMode
 */

/**
* !#en Do not do any caching.
* !#zh 不做任何缓存。
* @property {Number} NONE
*/

/**
 * !#en In BITMAP mode, cache the label as a static image and add it to the dynamic atlas for batch rendering, and can batching with Sprites using broken images.
 * !#zh BITMAP 模式，将 label 缓存成静态图像并加入到动态图集，以便进行批次合并，可与使用碎图的 Sprite 进行合批（注：动态图集在 Chrome 以及微信小游戏暂时关闭，该功能无效）。
 * @property {Number} BITMAP
 */

/**
 * !#en In CHAR mode, split text into characters and cache characters into a dynamic atlas which the size of 2048*2048. 
 * !#zh CHAR 模式，将文本拆分为字符，并将字符缓存到一张单独的大小为 2048*2048 的图集中进行重复使用，不再使用动态图集（注：当图集满时将不再进行缓存，暂时不支持 SHRINK 自适应文本尺寸（后续完善））。
 * @property {Number} CHAR
 */

var CacheMode = cc.Enum({
  NONE: 0,
  BITMAP: 1,
  CHAR: 2
});
var BOLD_FLAG = 1 << 0;
var ITALIC_FLAG = 1 << 1;
var UNDERLINE_FLAG = 1 << 2;
/**
 * !#en The Label Component.
 * !#zh 文字标签组件
 * @class Label
 * @extends RenderComponent
 */

var Label = cc.Class({
  name: 'cc.Label',
  "extends": RenderComponent,
  mixins: [BlendFunc],
  ctor: function ctor() {
    if (CC_EDITOR) {
      this._userDefinedFont = null;
    }

    this._actualFontSize = 0;
    this._assemblerData = null;
    this._frame = null;
    this._ttfTexture = null;
    this._letterTexture = null;

    if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
      this._updateMaterial = this._updateMaterialCanvas;
    } else {
      this._updateMaterial = this._updateMaterialWebgl;
    }
  },
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.renderers/Label',
    help: 'i18n:COMPONENT.help_url.label',
    inspector: 'packages://inspector/inspectors/comps/label.js'
  },
  properties: {
    /**
     * !#en Content string of label.
     * !#zh 标签显示的文本内容。
     * @property {String} string
     */
    _string: {
      "default": '',
      formerlySerializedAs: '_N$string'
    },
    string: {
      get: function get() {
        return this._string;
      },
      set: function set(value) {
        var oldValue = this._string;
        this._string = '' + value;

        if (this.string !== oldValue) {
          this.setVertsDirty();
        }

        this._checkStringEmpty();
      },
      multiline: true,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.string'
    },

    /**
     * !#en Horizontal Alignment of label.
     * !#zh 文本内容的水平对齐方式。
     * @property {Label.HorizontalAlign} horizontalAlign
     */
    horizontalAlign: {
      "default": HorizontalAlign.LEFT,
      type: HorizontalAlign,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.horizontal_align',
      notify: function notify(oldValue) {
        if (this.horizontalAlign === oldValue) return;
        this.setVertsDirty();
      },
      animatable: false
    },

    /**
     * !#en Vertical Alignment of label.
     * !#zh 文本内容的垂直对齐方式。
     * @property {Label.VerticalAlign} verticalAlign
     */
    verticalAlign: {
      "default": VerticalAlign.TOP,
      type: VerticalAlign,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.vertical_align',
      notify: function notify(oldValue) {
        if (this.verticalAlign === oldValue) return;
        this.setVertsDirty();
      },
      animatable: false
    },

    /**
     * !#en The actual rendering font size in shrink mode
     * !#zh SHRINK 模式下面文本实际渲染的字体大小
     * @property {Number} actualFontSize
     */
    actualFontSize: {
      displayName: 'Actual Font Size',
      animatable: false,
      readonly: true,
      get: function get() {
        return this._actualFontSize;
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.label.actualFontSize'
    },
    _fontSize: 40,

    /**
     * !#en Font size of label.
     * !#zh 文本字体大小。
     * @property {Number} fontSize
     */
    fontSize: {
      get: function get() {
        return this._fontSize;
      },
      set: function set(value) {
        if (this._fontSize === value) return;
        this._fontSize = value;
        this.setVertsDirty();
      },
      range: [0, 512],
      tooltip: CC_DEV && 'i18n:COMPONENT.label.font_size'
    },

    /**
     * !#en Font family of label, only take effect when useSystemFont property is true.
     * !#zh 文本字体名称, 只在 useSystemFont 属性为 true 的时候生效。
     * @property {String} fontFamily
     */
    fontFamily: {
      "default": "Arial",
      tooltip: CC_DEV && 'i18n:COMPONENT.label.font_family',
      notify: function notify(oldValue) {
        if (this.fontFamily === oldValue) return;
        this.setVertsDirty();
      },
      animatable: false
    },
    _lineHeight: 40,

    /**
     * !#en Line Height of label.
     * !#zh 文本行高。
     * @property {Number} lineHeight
     */
    lineHeight: {
      get: function get() {
        return this._lineHeight;
      },
      set: function set(value) {
        if (this._lineHeight === value) return;
        this._lineHeight = value;
        this.setVertsDirty();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.label.line_height'
    },

    /**
     * !#en Overflow of label.
     * !#zh 文字显示超出范围时的处理方式。
     * @property {Label.Overflow} overflow
     */
    overflow: {
      "default": Overflow.NONE,
      type: Overflow,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.overflow',
      notify: function notify(oldValue) {
        if (this.overflow === oldValue) return;
        this.setVertsDirty();
      },
      animatable: false
    },
    _enableWrapText: true,

    /**
     * !#en Whether auto wrap label when string width is large than label width.
     * !#zh 是否自动换行。
     * @property {Boolean} enableWrapText
     */
    enableWrapText: {
      get: function get() {
        return this._enableWrapText;
      },
      set: function set(value) {
        if (this._enableWrapText === value) return;
        this._enableWrapText = value;
        this.setVertsDirty();
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.wrap'
    },
    // 这个保存了旧项目的 file 数据
    _N$file: null,

    /**
     * !#en The font of label.
     * !#zh 文本字体。
     * @property {Font} font
     */
    font: {
      get: function get() {
        return this._N$file;
      },
      set: function set(value) {
        if (this.font === value) return; //if delete the font, we should change isSystemFontUsed to true

        if (!value) {
          this._isSystemFontUsed = true;
        }

        if (CC_EDITOR && value) {
          this._userDefinedFont = value;
        }

        this._N$file = value;
        if (value && this._isSystemFontUsed) this._isSystemFontUsed = false;
        if (!this.enabledInHierarchy) return;

        this._forceUpdateRenderData();
      },
      type: cc.Font,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.font',
      animatable: false
    },
    _isSystemFontUsed: true,

    /**
     * !#en Whether use system font name or not.
     * !#zh 是否使用系统字体。
     * @property {Boolean} useSystemFont
     */
    useSystemFont: {
      get: function get() {
        return this._isSystemFontUsed;
      },
      set: function set(value) {
        if (this._isSystemFontUsed === value) return;
        this._isSystemFontUsed = !!value;

        if (CC_EDITOR) {
          if (!value && this._userDefinedFont) {
            this.font = this._userDefinedFont;
            this.spacingX = this._spacingX;
            return;
          }
        }

        if (value) {
          this.font = null;
          if (!this.enabledInHierarchy) return;

          this._forceUpdateRenderData();
        }

        this.markForValidate();
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.system_font'
    },
    _bmFontOriginalSize: {
      displayName: 'BMFont Original Size',
      get: function get() {
        if (this._N$file instanceof cc.BitmapFont) {
          return this._N$file.fontSize;
        } else {
          return -1;
        }
      },
      visible: true,
      animatable: false
    },
    _spacingX: 0,

    /**
     * !#en The spacing of the x axis between characters, only take Effect when using bitmap fonts.
     * !#zh 文字之间 x 轴的间距，仅在使用位图字体时生效。
     * @property {Number} spacingX
     */
    spacingX: {
      get: function get() {
        return this._spacingX;
      },
      set: function set(value) {
        this._spacingX = value;
        this.setVertsDirty();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.label.spacingX'
    },
    //For compatibility with v2.0.x temporary reservation.
    _batchAsBitmap: false,

    /**
     * !#en The cache mode of label. This mode only supports system fonts.
     * !#zh 文本缓存模式, 该模式只支持系统字体。
     * @property {Label.CacheMode} cacheMode
     */
    cacheMode: {
      "default": CacheMode.NONE,
      type: CacheMode,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.cacheMode',
      notify: function notify(oldValue) {
        if (this.cacheMode === oldValue) return;

        if (oldValue === CacheMode.BITMAP && !(this.font instanceof cc.BitmapFont)) {
          this._frame && this._frame._resetDynamicAtlasFrame();
        }

        if (oldValue === CacheMode.CHAR) {
          this._ttfTexture = null;
        }

        if (!this.enabledInHierarchy) return;

        this._forceUpdateRenderData();
      },
      animatable: false
    },
    _styleFlags: 0,

    /**
     * !#en Whether enable bold.
     * !#zh 是否启用黑体。
     * @property {Boolean} enableBold
     */
    enableBold: {
      get: function get() {
        return !!(this._styleFlags & BOLD_FLAG);
      },
      set: function set(value) {
        if (value) {
          this._styleFlags |= BOLD_FLAG;
        } else {
          this._styleFlags &= ~BOLD_FLAG;
        }

        this.setVertsDirty();
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.bold'
    },

    /**
     * !#en Whether enable italic.
     * !#zh 是否启用斜体。
     * @property {Boolean} enableItalic
     */
    enableItalic: {
      get: function get() {
        return !!(this._styleFlags & ITALIC_FLAG);
      },
      set: function set(value) {
        if (value) {
          this._styleFlags |= ITALIC_FLAG;
        } else {
          this._styleFlags &= ~ITALIC_FLAG;
        }

        this.setVertsDirty();
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.italic'
    },

    /**
     * !#en Whether enable underline.
     * !#zh 是否启用下划线。
     * @property {Boolean} enableUnderline
     */
    enableUnderline: {
      get: function get() {
        return !!(this._styleFlags & UNDERLINE_FLAG);
      },
      set: function set(value) {
        if (value) {
          this._styleFlags |= UNDERLINE_FLAG;
        } else {
          this._styleFlags &= ~UNDERLINE_FLAG;
        }

        this.setVertsDirty();
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.underline'
    },
    _underlineHeight: 0,

    /**
     * !#en The height of underline.
     * !#zh 下划线高度。
     * @property {Number} underlineHeight
     */
    underlineHeight: {
      get: function get() {
        return this._underlineHeight;
      },
      set: function set(value) {
        if (this._underlineHeight === value) return;
        this._underlineHeight = value;
        this.setVertsDirty();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.label.underline_height'
    }
  },
  statics: {
    HorizontalAlign: HorizontalAlign,
    VerticalAlign: VerticalAlign,
    Overflow: Overflow,
    CacheMode: CacheMode,
    _shareAtlas: null,

    /**
     * !#zh 需要保证当前场景中没有使用CHAR缓存的Label才可以清除，否则已渲染的文字没有重新绘制会不显示
     * !#en It can be cleared that need to ensure there is not use the CHAR cache in the current scene. Otherwise, the rendered text will not be displayed without repainting.
     * @method clearCharCache
     * @static
     */
    clearCharCache: function clearCharCache() {
      if (Label._shareAtlas) {
        Label._shareAtlas.clearAllCache();
      }
    }
  },
  onLoad: function onLoad() {
    // For compatibility with v2.0.x temporary reservation.
    if (this._batchAsBitmap && this.cacheMode === CacheMode.NONE) {
      this.cacheMode = CacheMode.BITMAP;
      this._batchAsBitmap = false;
    }

    if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
      // CacheMode is not supported in Canvas.
      this.cacheMode = CacheMode.NONE;
    }
  },
  onEnable: function onEnable() {
    this._super(); // Keep track of Node size


    this.node.on(cc.Node.EventType.SIZE_CHANGED, this._nodeSizeChanged, this);
    this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this.setVertsDirty, this);
    this.node.on(cc.Node.EventType.COLOR_CHANGED, this._nodeColorChanged, this);

    this._forceUpdateRenderData();
  },
  onDisable: function onDisable() {
    this._super();

    this.node.off(cc.Node.EventType.SIZE_CHANGED, this._nodeSizeChanged, this);
    this.node.off(cc.Node.EventType.ANCHOR_CHANGED, this.setVertsDirty, this);
    this.node.off(cc.Node.EventType.COLOR_CHANGED, this._nodeColorChanged, this);
  },
  onDestroy: function onDestroy() {
    this._assembler && this._assembler._resetAssemblerData && this._assembler._resetAssemblerData(this._assemblerData);
    this._assemblerData = null;
    this._letterTexture = null;

    if (this._ttfTexture) {
      this._ttfTexture.destroy();

      this._ttfTexture = null;
    }

    this._super();
  },
  _nodeSizeChanged: function _nodeSizeChanged() {
    // Because the content size is automatically updated when overflow is NONE.
    // And this will conflict with the alignment of the CCWidget.
    if (CC_EDITOR || this.overflow !== Overflow.NONE) {
      this.setVertsDirty();
    }
  },
  _nodeColorChanged: function _nodeColorChanged() {
    if (!(this.font instanceof cc.BitmapFont)) {
      this.setVertsDirty();
    }
  },
  setVertsDirty: function setVertsDirty() {
    if (CC_JSB && this._nativeTTF()) {
      this._assembler && this._assembler.updateRenderData(this);
    }

    this._super();
  },
  _updateColor: function _updateColor() {
    if (!(this.font instanceof cc.BitmapFont)) {
      if (!(this._srcBlendFactor === cc.macro.BlendFactor.SRC_ALPHA && this.node._renderFlag & cc.RenderFlow.FLAG_OPACITY)) {
        this.setVertsDirty();
      }
    }

    RenderComponent.prototype._updateColor.call(this);
  },
  _validateRender: function _validateRender() {
    if (!this.string) {
      this.disableRender();
      return;
    }

    if (this._materials[0]) {
      var font = this.font;

      if (font instanceof cc.BitmapFont) {
        var spriteFrame = font.spriteFrame;

        if (spriteFrame && spriteFrame.textureLoaded() && font._fntConfig) {
          return;
        }
      } else {
        return;
      }
    }

    this.disableRender();
  },
  _resetAssembler: function _resetAssembler() {
    this._resetFrame();

    RenderComponent.prototype._resetAssembler.call(this);
  },
  _resetFrame: function _resetFrame() {
    if (this._frame && !(this.font instanceof cc.BitmapFont)) {
      deleteFromDynamicAtlas(this, this._frame);
      this._frame = null;
    }
  },
  _checkStringEmpty: function _checkStringEmpty() {
    this.markForRender(!!this.string);
  },
  _on3DNodeChanged: function _on3DNodeChanged() {
    this._resetAssembler();

    this._applyFontTexture();
  },
  _onBMFontTextureLoaded: function _onBMFontTextureLoaded() {
    this._frame._texture = this.font.spriteFrame._texture;
    this.markForRender(true);

    this._updateMaterial();

    this._assembler && this._assembler.updateRenderData(this);
  },
  _onBlendChanged: function _onBlendChanged() {
    if (!this.useSystemFont || !this.enabledInHierarchy) return;

    this._forceUpdateRenderData();
  },
  _applyFontTexture: function _applyFontTexture() {
    var font = this.font;

    if (font instanceof cc.BitmapFont) {
      var spriteFrame = font.spriteFrame;
      this._frame = spriteFrame;

      if (spriteFrame) {
        spriteFrame.onTextureLoaded(this._onBMFontTextureLoaded, this);
      }
    } else {
      if (!this._nativeTTF()) {
        if (!this._frame) {
          this._frame = new LabelFrame();
        }

        if (this.cacheMode === CacheMode.CHAR) {
          this._letterTexture = this._assembler._getAssemblerData();

          this._frame._refreshTexture(this._letterTexture);
        } else if (!this._ttfTexture) {
          this._ttfTexture = new cc.Texture2D();
          this._assemblerData = this._assembler._getAssemblerData();

          this._ttfTexture.initWithElement(this._assemblerData.canvas);
        }

        if (this.cacheMode !== CacheMode.CHAR) {
          this._frame._resetDynamicAtlasFrame();

          this._frame._refreshTexture(this._ttfTexture);

          if (this._srcBlendFactor === cc.macro.BlendFactor.ONE && !CC_NATIVERENDERER) {
            this._ttfTexture.setPremultiplyAlpha(true);
          }
        }

        this._updateMaterial();
      }

      this._assembler && this._assembler.updateRenderData(this);
    }

    this.markForValidate();
  },
  _updateMaterialCanvas: function _updateMaterialCanvas() {
    if (!this._frame) return;
    this._frame._texture._nativeUrl = this.uuid + '_texture';
  },
  _updateMaterialWebgl: function _updateMaterialWebgl() {
    var material = this.getMaterial(0);

    if (this._nativeTTF()) {
      if (material) this._assembler._updateTTFMaterial(this);
      return;
    }

    if (!this._frame) return;
    material && material.setProperty('texture', this._frame._texture);

    BlendFunc.prototype._updateMaterial.call(this);
  },
  _forceUseCanvas: false,
  _useNativeTTF: function _useNativeTTF() {
    return cc.macro.ENABLE_NATIVE_TTF_RENDERER && !this._forceUseCanvas;
  },
  _nativeTTF: function _nativeTTF() {
    return this._useNativeTTF() && !!this._assembler && !!this._assembler._updateTTFMaterial;
  },
  _forceUpdateRenderData: function _forceUpdateRenderData() {
    this.setVertsDirty();

    this._resetAssembler();

    this._applyFontTexture();
  },

  /**
   * @deprecated `label._enableBold` is deprecated, use `label.enableBold = true` instead please.
   */
  _enableBold: function _enableBold(enabled) {
    if (CC_DEBUG) {
      cc.warn('`label._enableBold` is deprecated, use `label.enableBold = true` instead please');
    }

    this.enableBold = !!enabled;
  },

  /**
   * @deprecated `label._enableItalics` is deprecated, use `label.enableItalics = true` instead please.
   */
  _enableItalics: function _enableItalics(enabled) {
    if (CC_DEBUG) {
      cc.warn('`label._enableItalics` is deprecated, use `label.enableItalics = true` instead please');
    }

    this.enableItalic = !!enabled;
  },

  /**
   * @deprecated `label._enableUnderline` is deprecated, use `label.enableUnderline = true` instead please.
   */
  _enableUnderline: function _enableUnderline(enabled) {
    if (CC_DEBUG) {
      cc.warn('`label._enableUnderline` is deprecated, use `label.enableUnderline = true` instead please');
    }

    this.enableUnderline = !!enabled;
  }
});
cc.Label = module.exports = Label;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvQ0NMYWJlbC5qcyJdLCJuYW1lcyI6WyJtYWNybyIsInJlcXVpcmUiLCJSZW5kZXJDb21wb25lbnQiLCJNYXRlcmlhbCIsIkxhYmVsRnJhbWUiLCJCbGVuZEZ1bmMiLCJkZWxldGVGcm9tRHluYW1pY0F0bGFzIiwiSG9yaXpvbnRhbEFsaWduIiwiVGV4dEFsaWdubWVudCIsIlZlcnRpY2FsQWxpZ24iLCJWZXJ0aWNhbFRleHRBbGlnbm1lbnQiLCJPdmVyZmxvdyIsImNjIiwiRW51bSIsIk5PTkUiLCJDTEFNUCIsIlNIUklOSyIsIlJFU0laRV9IRUlHSFQiLCJDYWNoZU1vZGUiLCJCSVRNQVAiLCJDSEFSIiwiQk9MRF9GTEFHIiwiSVRBTElDX0ZMQUciLCJVTkRFUkxJTkVfRkxBRyIsIkxhYmVsIiwiQ2xhc3MiLCJuYW1lIiwibWl4aW5zIiwiY3RvciIsIkNDX0VESVRPUiIsIl91c2VyRGVmaW5lZEZvbnQiLCJfYWN0dWFsRm9udFNpemUiLCJfYXNzZW1ibGVyRGF0YSIsIl9mcmFtZSIsIl90dGZUZXh0dXJlIiwiX2xldHRlclRleHR1cmUiLCJnYW1lIiwicmVuZGVyVHlwZSIsIlJFTkRFUl9UWVBFX0NBTlZBUyIsIl91cGRhdGVNYXRlcmlhbCIsIl91cGRhdGVNYXRlcmlhbENhbnZhcyIsIl91cGRhdGVNYXRlcmlhbFdlYmdsIiwiZWRpdG9yIiwibWVudSIsImhlbHAiLCJpbnNwZWN0b3IiLCJwcm9wZXJ0aWVzIiwiX3N0cmluZyIsImZvcm1lcmx5U2VyaWFsaXplZEFzIiwic3RyaW5nIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJvbGRWYWx1ZSIsInNldFZlcnRzRGlydHkiLCJfY2hlY2tTdHJpbmdFbXB0eSIsIm11bHRpbGluZSIsInRvb2x0aXAiLCJDQ19ERVYiLCJob3Jpem9udGFsQWxpZ24iLCJMRUZUIiwidHlwZSIsIm5vdGlmeSIsImFuaW1hdGFibGUiLCJ2ZXJ0aWNhbEFsaWduIiwiVE9QIiwiYWN0dWFsRm9udFNpemUiLCJkaXNwbGF5TmFtZSIsInJlYWRvbmx5IiwiX2ZvbnRTaXplIiwiZm9udFNpemUiLCJyYW5nZSIsImZvbnRGYW1pbHkiLCJfbGluZUhlaWdodCIsImxpbmVIZWlnaHQiLCJvdmVyZmxvdyIsIl9lbmFibGVXcmFwVGV4dCIsImVuYWJsZVdyYXBUZXh0IiwiX04kZmlsZSIsImZvbnQiLCJfaXNTeXN0ZW1Gb250VXNlZCIsImVuYWJsZWRJbkhpZXJhcmNoeSIsIl9mb3JjZVVwZGF0ZVJlbmRlckRhdGEiLCJGb250IiwidXNlU3lzdGVtRm9udCIsInNwYWNpbmdYIiwiX3NwYWNpbmdYIiwibWFya0ZvclZhbGlkYXRlIiwiX2JtRm9udE9yaWdpbmFsU2l6ZSIsIkJpdG1hcEZvbnQiLCJ2aXNpYmxlIiwiX2JhdGNoQXNCaXRtYXAiLCJjYWNoZU1vZGUiLCJfcmVzZXREeW5hbWljQXRsYXNGcmFtZSIsIl9zdHlsZUZsYWdzIiwiZW5hYmxlQm9sZCIsImVuYWJsZUl0YWxpYyIsImVuYWJsZVVuZGVybGluZSIsIl91bmRlcmxpbmVIZWlnaHQiLCJ1bmRlcmxpbmVIZWlnaHQiLCJzdGF0aWNzIiwiX3NoYXJlQXRsYXMiLCJjbGVhckNoYXJDYWNoZSIsImNsZWFyQWxsQ2FjaGUiLCJvbkxvYWQiLCJvbkVuYWJsZSIsIl9zdXBlciIsIm5vZGUiLCJvbiIsIk5vZGUiLCJFdmVudFR5cGUiLCJTSVpFX0NIQU5HRUQiLCJfbm9kZVNpemVDaGFuZ2VkIiwiQU5DSE9SX0NIQU5HRUQiLCJDT0xPUl9DSEFOR0VEIiwiX25vZGVDb2xvckNoYW5nZWQiLCJvbkRpc2FibGUiLCJvZmYiLCJvbkRlc3Ryb3kiLCJfYXNzZW1ibGVyIiwiX3Jlc2V0QXNzZW1ibGVyRGF0YSIsImRlc3Ryb3kiLCJDQ19KU0IiLCJfbmF0aXZlVFRGIiwidXBkYXRlUmVuZGVyRGF0YSIsIl91cGRhdGVDb2xvciIsIl9zcmNCbGVuZEZhY3RvciIsIkJsZW5kRmFjdG9yIiwiU1JDX0FMUEhBIiwiX3JlbmRlckZsYWciLCJSZW5kZXJGbG93IiwiRkxBR19PUEFDSVRZIiwicHJvdG90eXBlIiwiY2FsbCIsIl92YWxpZGF0ZVJlbmRlciIsImRpc2FibGVSZW5kZXIiLCJfbWF0ZXJpYWxzIiwic3ByaXRlRnJhbWUiLCJ0ZXh0dXJlTG9hZGVkIiwiX2ZudENvbmZpZyIsIl9yZXNldEFzc2VtYmxlciIsIl9yZXNldEZyYW1lIiwibWFya0ZvclJlbmRlciIsIl9vbjNETm9kZUNoYW5nZWQiLCJfYXBwbHlGb250VGV4dHVyZSIsIl9vbkJNRm9udFRleHR1cmVMb2FkZWQiLCJfdGV4dHVyZSIsIl9vbkJsZW5kQ2hhbmdlZCIsIm9uVGV4dHVyZUxvYWRlZCIsIl9nZXRBc3NlbWJsZXJEYXRhIiwiX3JlZnJlc2hUZXh0dXJlIiwiVGV4dHVyZTJEIiwiaW5pdFdpdGhFbGVtZW50IiwiY2FudmFzIiwiT05FIiwiQ0NfTkFUSVZFUkVOREVSRVIiLCJzZXRQcmVtdWx0aXBseUFscGhhIiwiX25hdGl2ZVVybCIsInV1aWQiLCJtYXRlcmlhbCIsImdldE1hdGVyaWFsIiwiX3VwZGF0ZVRURk1hdGVyaWFsIiwic2V0UHJvcGVydHkiLCJfZm9yY2VVc2VDYW52YXMiLCJfdXNlTmF0aXZlVFRGIiwiRU5BQkxFX05BVElWRV9UVEZfUkVOREVSRVIiLCJfZW5hYmxlQm9sZCIsImVuYWJsZWQiLCJDQ19ERUJVRyIsIndhcm4iLCJfZW5hYmxlSXRhbGljcyIsIl9lbmFibGVVbmRlcmxpbmUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxLQUFLLEdBQUdDLE9BQU8sQ0FBQyxxQkFBRCxDQUFyQjs7QUFDQSxJQUFNQyxlQUFlLEdBQUdELE9BQU8sQ0FBQyxxQkFBRCxDQUEvQjs7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QixJQUE2QyxDQUFDLENBQUMsS0FBS0EsVUFBTCxDQUFnQjBDLGtCQUF0RTtBQUNILEdBdm5CZ0I7QUF5bkJqQi9FLEVBQUFBLHNCQXpuQmlCLG9DQXluQlM7QUFDdEIsU0FBSzVCLGFBQUw7O0FBQ0EsU0FBS3NGLGVBQUw7O0FBQ0EsU0FBS0ksaUJBQUw7QUFDSCxHQTduQmdCOztBQStuQmpCO0FBQ0o7QUFDQTtBQUNJc0IsRUFBQUEsV0Fsb0JpQix1QkFrb0JKQyxPQWxvQkksRUFrb0JLO0FBQ2xCLFFBQUlDLFFBQUosRUFBYztBQUNWNUosTUFBQUEsRUFBRSxDQUFDNkosSUFBSCxDQUFRLGlGQUFSO0FBQ0g7O0FBQ0QsU0FBSzFFLFVBQUwsR0FBa0IsQ0FBQyxDQUFDd0UsT0FBcEI7QUFDSCxHQXZvQmdCOztBQXlvQmpCO0FBQ0o7QUFDQTtBQUNJRyxFQUFBQSxjQTVvQmlCLDBCQTRvQkRILE9BNW9CQyxFQTRvQlE7QUFDckIsUUFBSUMsUUFBSixFQUFjO0FBQ1Y1SixNQUFBQSxFQUFFLENBQUM2SixJQUFILENBQVEsdUZBQVI7QUFDSDs7QUFDRCxTQUFLekUsWUFBTCxHQUFvQixDQUFDLENBQUN1RSxPQUF0QjtBQUNILEdBanBCZ0I7O0FBbXBCakI7QUFDSjtBQUNBO0FBQ0lJLEVBQUFBLGdCQXRwQmlCLDRCQXNwQkNKLE9BdHBCRCxFQXNwQlU7QUFDdkIsUUFBSUMsUUFBSixFQUFjO0FBQ1Y1SixNQUFBQSxFQUFFLENBQUM2SixJQUFILENBQVEsMkZBQVI7QUFDSDs7QUFDRCxTQUFLeEUsZUFBTCxHQUF1QixDQUFDLENBQUNzRSxPQUF6QjtBQUNIO0FBM3BCZ0IsQ0FBVCxDQUFaO0FBOHBCQzNKLEVBQUUsQ0FBQ1ksS0FBSCxHQUFXb0osTUFBTSxDQUFDQyxPQUFQLEdBQWlCckosS0FBNUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IG1hY3JvID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vQ0NNYWNybycpO1xuY29uc3QgUmVuZGVyQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9DQ1JlbmRlckNvbXBvbmVudCcpO1xuY29uc3QgTWF0ZXJpYWwgPSByZXF1aXJlKCcuLi9hc3NldHMvbWF0ZXJpYWwvQ0NNYXRlcmlhbCcpO1xuY29uc3QgTGFiZWxGcmFtZSA9IHJlcXVpcmUoJy4uL3JlbmRlcmVyL3V0aWxzL2xhYmVsL2xhYmVsLWZyYW1lJyk7XG5jb25zdCBCbGVuZEZ1bmMgPSByZXF1aXJlKCcuLi91dGlscy9ibGVuZC1mdW5jJyk7XG5jb25zdCBkZWxldGVGcm9tRHluYW1pY0F0bGFzID0gcmVxdWlyZSgnLi4vcmVuZGVyZXIvdXRpbHMvdXRpbHMnKS5kZWxldGVGcm9tRHluYW1pY0F0bGFzO1xuXG4vKipcbiAqICEjZW4gRW51bSBmb3IgdGV4dCBhbGlnbm1lbnQuXG4gKiAhI3poIOaWh+acrOaoquWQkeWvuem9kOexu+Wei1xuICogQGVudW0gTGFiZWwuSG9yaXpvbnRhbEFsaWduXG4gKi9cbi8qKlxuICogISNlbiBBbGlnbm1lbnQgbGVmdCBmb3IgdGV4dC5cbiAqICEjemgg5paH5pys5YaF5a655bem5a+56b2Q44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gTEVGVFxuICovXG4vKipcbiAqICEjZW4gQWxpZ25tZW50IGNlbnRlciBmb3IgdGV4dC5cbiAqICEjemgg5paH5pys5YaF5a655bGF5Lit5a+56b2Q44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gQ0VOVEVSXG4gKi9cbi8qKlxuICogISNlbiBBbGlnbm1lbnQgcmlnaHQgZm9yIHRleHQuXG4gKiAhI3poIOaWh+acrOWGheWuueWPs+i+ueWvuem9kOOAglxuICogQHByb3BlcnR5IHtOdW1iZXJ9IFJJR0hUXG4gKi9cbmNvbnN0IEhvcml6b250YWxBbGlnbiA9IG1hY3JvLlRleHRBbGlnbm1lbnQ7XG5cbi8qKlxuICogISNlbiBFbnVtIGZvciB2ZXJ0aWNhbCB0ZXh0IGFsaWdubWVudC5cbiAqICEjemgg5paH5pys5Z6C55u05a+56b2Q57G75Z6LXG4gKiBAZW51bSBMYWJlbC5WZXJ0aWNhbEFsaWduXG4gKi9cbi8qKlxuICogISNlbiBWZXJ0aWNhbCBhbGlnbm1lbnQgdG9wIGZvciB0ZXh0LlxuICogISN6aCDmlofmnKzpobbpg6jlr7npvZDjgIJcbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBUT1BcbiAqL1xuLyoqXG4gKiAhI2VuIFZlcnRpY2FsIGFsaWdubWVudCBjZW50ZXIgZm9yIHRleHQuXG4gKiAhI3poIOaWh+acrOWxheS4reWvuem9kOOAglxuICogQHByb3BlcnR5IHtOdW1iZXJ9IENFTlRFUlxuICovXG4vKipcbiAqICEjZW4gVmVydGljYWwgYWxpZ25tZW50IGJvdHRvbSBmb3IgdGV4dC5cbiAqICEjemgg5paH5pys5bqV6YOo5a+56b2Q44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gQk9UVE9NXG4gKi9cbmNvbnN0IFZlcnRpY2FsQWxpZ24gPSBtYWNyby5WZXJ0aWNhbFRleHRBbGlnbm1lbnQ7XG5cbi8qKlxuICogISNlbiBFbnVtIGZvciBPdmVyZmxvdy5cbiAqICEjemggT3ZlcmZsb3cg57G75Z6LXG4gKiBAZW51bSBMYWJlbC5PdmVyZmxvd1xuICovXG4vKipcbiAqICEjZW4gTk9ORS5cbiAqICEjemgg5LiN5YGa5Lu75L2V6ZmQ5Yi244CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gTk9ORVxuICovXG4vKipcbiAqICEjZW4gSW4gQ0xBTVAgbW9kZSwgd2hlbiBsYWJlbCBjb250ZW50IGdvZXMgb3V0IG9mIHRoZSBib3VuZGluZyBib3gsIGl0IHdpbGwgYmUgY2xpcHBlZC5cbiAqICEjemggQ0xBTVAg5qih5byP5Lit77yM5b2T5paH5pys5YaF5a656LaF5Ye66L6555WM5qGG5pe277yM5aSa5L2Z55qE5Lya6KKr5oiq5pat44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gQ0xBTVBcbiAqL1xuLyoqXG4gKiAhI2VuIEluIFNIUklOSyBtb2RlLCB0aGUgZm9udCBzaXplIHdpbGwgY2hhbmdlIGR5bmFtaWNhbGx5IHRvIGFkYXB0IHRoZSBjb250ZW50IHNpemUuIFRoaXMgbW9kZSBtYXkgdGFrZXMgdXAgbW9yZSBDUFUgcmVzb3VyY2VzIHdoZW4gdGhlIGxhYmVsIGlzIHJlZnJlc2hlZC5cbiAqICEjemggU0hSSU5LIOaooeW8j++8jOWtl+S9k+Wkp+Wwj+S8muWKqOaAgeWPmOWMlu+8jOS7pemAguW6lOWGheWuueWkp+Wwj+OAgui/meS4quaooeW8j+WcqOaWh+acrOWIt+aWsOeahOaXtuWAmeWPr+iDveS8muWNoOeUqOi+g+WkmiBDUFUg6LWE5rqQ44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gU0hSSU5LXG4gKi9cbi8qKlxuICogISNlbiBJbiBSRVNJWkVfSEVJR0hUIG1vZGUsIHlvdSBjYW4gb25seSBjaGFuZ2UgdGhlIHdpZHRoIG9mIGxhYmVsIGFuZCB0aGUgaGVpZ2h0IGlzIGNoYW5nZWQgYXV0b21hdGljYWxseS5cbiAqICEjemgg5ZyoIFJFU0laRV9IRUlHSFQg5qih5byP5LiL77yM5Y+q6IO95pu05pS55paH5pys55qE5a695bqm77yM6auY5bqm5piv6Ieq5Yqo5pS55Y+Y55qE44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gUkVTSVpFX0hFSUdIVFxuICovXG5jb25zdCBPdmVyZmxvdyA9IGNjLkVudW0oe1xuICAgIE5PTkU6IDAsXG4gICAgQ0xBTVA6IDEsXG4gICAgU0hSSU5LOiAyLFxuICAgIFJFU0laRV9IRUlHSFQ6IDNcbn0pO1xuXG4vKipcbiAqICEjZW4gRW51bSBmb3IgZm9udCB0eXBlLlxuICogISN6aCBUeXBlIOexu+Wei1xuICogQGVudW0gTGFiZWwuVHlwZVxuICovXG4vKipcbiAqICEjZW4gVGhlIFRURiBmb250IHR5cGUuXG4gKiAhI3poIFRURuWtl+S9k1xuICogQHByb3BlcnR5IHtOdW1iZXJ9IFRURlxuICovXG4vKipcbiAqICEjZW4gVGhlIGJpdG1hcCBmb250IHR5cGUuXG4gKiAhI3poIOS9jeWbvuWtl+S9k1xuICogQHByb3BlcnR5IHtOdW1iZXJ9IEJNRm9udFxuICovXG4vKipcbiAqICEjZW4gVGhlIHN5c3RlbSBmb250IHR5cGUuXG4gKiAhI3poIOezu+e7n+Wtl+S9k1xuICogQHByb3BlcnR5IHtOdW1iZXJ9IFN5c3RlbUZvbnRcbiAqL1xuXG4vKipcbiAqICEjZW4gRW51bSBmb3IgY2FjaGUgbW9kZS5cbiAqICEjemggQ2FjaGVNb2RlIOexu+Wei1xuICogQGVudW0gTGFiZWwuQ2FjaGVNb2RlXG4gKi9cbiAvKipcbiAqICEjZW4gRG8gbm90IGRvIGFueSBjYWNoaW5nLlxuICogISN6aCDkuI3lgZrku7vkvZXnvJPlrZjjgIJcbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBOT05FXG4gKi9cbi8qKlxuICogISNlbiBJbiBCSVRNQVAgbW9kZSwgY2FjaGUgdGhlIGxhYmVsIGFzIGEgc3RhdGljIGltYWdlIGFuZCBhZGQgaXQgdG8gdGhlIGR5bmFtaWMgYXRsYXMgZm9yIGJhdGNoIHJlbmRlcmluZywgYW5kIGNhbiBiYXRjaGluZyB3aXRoIFNwcml0ZXMgdXNpbmcgYnJva2VuIGltYWdlcy5cbiAqICEjemggQklUTUFQIOaooeW8j++8jOWwhiBsYWJlbCDnvJPlrZjmiJDpnZnmgIHlm77lg4/lubbliqDlhaXliLDliqjmgIHlm77pm4bvvIzku6Xkvr/ov5vooYzmibnmrKHlkIjlubbvvIzlj6/kuI7kvb/nlKjnoo7lm77nmoQgU3ByaXRlIOi/m+ihjOWQiOaJue+8iOazqO+8muWKqOaAgeWbvumbhuWcqCBDaHJvbWUg5Lul5Y+K5b6u5L+h5bCP5ri45oiP5pqC5pe25YWz6Zet77yM6K+l5Yqf6IO95peg5pWI77yJ44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gQklUTUFQXG4gKi9cbi8qKlxuICogISNlbiBJbiBDSEFSIG1vZGUsIHNwbGl0IHRleHQgaW50byBjaGFyYWN0ZXJzIGFuZCBjYWNoZSBjaGFyYWN0ZXJzIGludG8gYSBkeW5hbWljIGF0bGFzIHdoaWNoIHRoZSBzaXplIG9mIDIwNDgqMjA0OC4gXG4gKiAhI3poIENIQVIg5qih5byP77yM5bCG5paH5pys5ouG5YiG5Li65a2X56ym77yM5bm25bCG5a2X56ym57yT5a2Y5Yiw5LiA5byg5Y2V54us55qE5aSn5bCP5Li6IDIwNDgqMjA0OCDnmoTlm77pm4bkuK3ov5vooYzph43lpI3kvb/nlKjvvIzkuI3lho3kvb/nlKjliqjmgIHlm77pm4bvvIjms6jvvJrlvZPlm77pm4bmu6Hml7blsIbkuI3lho3ov5vooYznvJPlrZjvvIzmmoLml7bkuI3mlK/mjIEgU0hSSU5LIOiHqumAguW6lOaWh+acrOWwuuWvuO+8iOWQjue7reWujOWWhO+8ie+8ieOAglxuICogQHByb3BlcnR5IHtOdW1iZXJ9IENIQVJcbiAqL1xuY29uc3QgQ2FjaGVNb2RlID0gY2MuRW51bSh7XG4gICAgTk9ORTogMCxcbiAgICBCSVRNQVA6IDEsXG4gICAgQ0hBUjogMixcbn0pO1xuXG5jb25zdCBCT0xEX0ZMQUcgPSAxIDw8IDA7XG5jb25zdCBJVEFMSUNfRkxBRyA9IDEgPDwgMTtcbmNvbnN0IFVOREVSTElORV9GTEFHID0gMSA8PCAyO1xuXG4vKipcbiAqICEjZW4gVGhlIExhYmVsIENvbXBvbmVudC5cbiAqICEjemgg5paH5a2X5qCH562+57uE5Lu2XG4gKiBAY2xhc3MgTGFiZWxcbiAqIEBleHRlbmRzIFJlbmRlckNvbXBvbmVudFxuICovXG5sZXQgTGFiZWwgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkxhYmVsJyxcbiAgICBleHRlbmRzOiBSZW5kZXJDb21wb25lbnQsXG4gICAgbWl4aW5zOiBbQmxlbmRGdW5jXSxcblxuICAgIGN0b3IgKCkge1xuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB0aGlzLl91c2VyRGVmaW5lZEZvbnQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fYWN0dWFsRm9udFNpemUgPSAwO1xuICAgICAgICB0aGlzLl9hc3NlbWJsZXJEYXRhID0gbnVsbDtcblxuICAgICAgICB0aGlzLl9mcmFtZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX3R0ZlRleHR1cmUgPSBudWxsO1xuICAgICAgICB0aGlzLl9sZXR0ZXJUZXh0dXJlID0gbnVsbDtcblxuICAgICAgICBpZiAoY2MuZ2FtZS5yZW5kZXJUeXBlID09PSBjYy5nYW1lLlJFTkRFUl9UWVBFX0NBTlZBUykge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlTWF0ZXJpYWwgPSB0aGlzLl91cGRhdGVNYXRlcmlhbENhbnZhcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZU1hdGVyaWFsID0gdGhpcy5fdXBkYXRlTWF0ZXJpYWxXZWJnbDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQucmVuZGVyZXJzL0xhYmVsJyxcbiAgICAgICAgaGVscDogJ2kxOG46Q09NUE9ORU5ULmhlbHBfdXJsLmxhYmVsJyxcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9sYWJlbC5qcycsXG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gQ29udGVudCBzdHJpbmcgb2YgbGFiZWwuXG4gICAgICAgICAqICEjemgg5qCH562+5pi+56S655qE5paH5pys5YaF5a6544CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBzdHJpbmdcbiAgICAgICAgICovXG4gICAgICAgIF9zdHJpbmc6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnLFxuICAgICAgICAgICAgZm9ybWVybHlTZXJpYWxpemVkQXM6ICdfTiRzdHJpbmcnLFxuICAgICAgICB9LFxuICAgICAgICBzdHJpbmc6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0cmluZztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgbGV0IG9sZFZhbHVlID0gdGhpcy5fc3RyaW5nO1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0cmluZyA9ICcnICsgdmFsdWU7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdHJpbmcgIT09IG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuX2NoZWNrU3RyaW5nRW1wdHkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtdWx0aWxpbmU6IHRydWUsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmxhYmVsLnN0cmluZydcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBIb3Jpem9udGFsIEFsaWdubWVudCBvZiBsYWJlbC5cbiAgICAgICAgICogISN6aCDmlofmnKzlhoXlrrnnmoTmsLTlubPlr7npvZDmlrnlvI/jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtMYWJlbC5Ib3Jpem9udGFsQWxpZ259IGhvcml6b250YWxBbGlnblxuICAgICAgICAgKi9cbiAgICAgICAgaG9yaXpvbnRhbEFsaWduOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBIb3Jpem9udGFsQWxpZ24uTEVGVCxcbiAgICAgICAgICAgIHR5cGU6IEhvcml6b250YWxBbGlnbixcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubGFiZWwuaG9yaXpvbnRhbF9hbGlnbicsXG4gICAgICAgICAgICBub3RpZnkgIChvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhvcml6b250YWxBbGlnbiA9PT0gb2xkVmFsdWUpIHJldHVybjtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFZlcnRzRGlydHkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFZlcnRpY2FsIEFsaWdubWVudCBvZiBsYWJlbC5cbiAgICAgICAgICogISN6aCDmlofmnKzlhoXlrrnnmoTlnoLnm7Tlr7npvZDmlrnlvI/jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtMYWJlbC5WZXJ0aWNhbEFsaWdufSB2ZXJ0aWNhbEFsaWduXG4gICAgICAgICAqL1xuICAgICAgICB2ZXJ0aWNhbEFsaWduOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBWZXJ0aWNhbEFsaWduLlRPUCxcbiAgICAgICAgICAgIHR5cGU6IFZlcnRpY2FsQWxpZ24sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmxhYmVsLnZlcnRpY2FsX2FsaWduJyxcbiAgICAgICAgICAgIG5vdGlmeSAob2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy52ZXJ0aWNhbEFsaWduID09PSBvbGRWYWx1ZSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgYWN0dWFsIHJlbmRlcmluZyBmb250IHNpemUgaW4gc2hyaW5rIG1vZGVcbiAgICAgICAgICogISN6aCBTSFJJTksg5qih5byP5LiL6Z2i5paH5pys5a6e6ZmF5riy5p+T55qE5a2X5L2T5aSn5bCPXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBhY3R1YWxGb250U2l6ZVxuICAgICAgICAgKi9cbiAgICAgICAgYWN0dWFsRm9udFNpemU6IHtcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnQWN0dWFsIEZvbnQgU2l6ZScsXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHJlYWRvbmx5OiB0cnVlLFxuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYWN0dWFsRm9udFNpemU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYWJlbC5hY3R1YWxGb250U2l6ZScsXG4gICAgICAgIH0sXG5cbiAgICAgICAgX2ZvbnRTaXplOiA0MCxcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gRm9udCBzaXplIG9mIGxhYmVsLlxuICAgICAgICAgKiAhI3poIOaWh+acrOWtl+S9k+Wkp+Wwj+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZm9udFNpemVcbiAgICAgICAgICovXG4gICAgICAgIGZvbnRTaXplOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb250U2l6ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2ZvbnRTaXplID09PSB2YWx1ZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9udFNpemUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFZlcnRzRGlydHkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByYW5nZTogWzAsIDUxMl0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmxhYmVsLmZvbnRfc2l6ZScsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gRm9udCBmYW1pbHkgb2YgbGFiZWwsIG9ubHkgdGFrZSBlZmZlY3Qgd2hlbiB1c2VTeXN0ZW1Gb250IHByb3BlcnR5IGlzIHRydWUuXG4gICAgICAgICAqICEjemgg5paH5pys5a2X5L2T5ZCN56ewLCDlj6rlnKggdXNlU3lzdGVtRm9udCDlsZ7mgKfkuLogdHJ1ZSDnmoTml7blgJnnlJ/mlYjjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtTdHJpbmd9IGZvbnRGYW1pbHlcbiAgICAgICAgICovXG4gICAgICAgIGZvbnRGYW1pbHk6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFwiQXJpYWxcIixcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubGFiZWwuZm9udF9mYW1pbHknLFxuICAgICAgICAgICAgbm90aWZ5IChvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvbnRGYW1pbHkgPT09IG9sZFZhbHVlKSByZXR1cm47XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICBfbGluZUhlaWdodDogNDAsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIExpbmUgSGVpZ2h0IG9mIGxhYmVsLlxuICAgICAgICAgKiAhI3poIOaWh+acrOihjOmrmOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbGluZUhlaWdodFxuICAgICAgICAgKi9cbiAgICAgICAgbGluZUhlaWdodDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbGluZUhlaWdodDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2xpbmVIZWlnaHQgPT09IHZhbHVlKSByZXR1cm47XG4gICAgICAgICAgICAgICAgdGhpcy5fbGluZUhlaWdodCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubGFiZWwubGluZV9oZWlnaHQnLFxuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBPdmVyZmxvdyBvZiBsYWJlbC5cbiAgICAgICAgICogISN6aCDmloflrZfmmL7npLrotoXlh7rojIPlm7Tml7bnmoTlpITnkIbmlrnlvI/jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtMYWJlbC5PdmVyZmxvd30gb3ZlcmZsb3dcbiAgICAgICAgICovXG4gICAgICAgIG92ZXJmbG93OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBPdmVyZmxvdy5OT05FLFxuICAgICAgICAgICAgdHlwZTogT3ZlcmZsb3csXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmxhYmVsLm92ZXJmbG93JyxcbiAgICAgICAgICAgIG5vdGlmeSAob2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vdmVyZmxvdyA9PT0gb2xkVmFsdWUpIHJldHVybjtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFZlcnRzRGlydHkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIF9lbmFibGVXcmFwVGV4dDogdHJ1ZSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gV2hldGhlciBhdXRvIHdyYXAgbGFiZWwgd2hlbiBzdHJpbmcgd2lkdGggaXMgbGFyZ2UgdGhhbiBsYWJlbCB3aWR0aC5cbiAgICAgICAgICogISN6aCDmmK/lkKboh6rliqjmjaLooYzjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBlbmFibGVXcmFwVGV4dFxuICAgICAgICAgKi9cbiAgICAgICAgZW5hYmxlV3JhcFRleHQ6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2VuYWJsZVdyYXBUZXh0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZW5hYmxlV3JhcFRleHQgPT09IHZhbHVlKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9lbmFibGVXcmFwVGV4dCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYWJlbC53cmFwJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDov5nkuKrkv53lrZjkuobml6fpobnnm67nmoQgZmlsZSDmlbDmja5cbiAgICAgICAgX04kZmlsZTogbnVsbCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgZm9udCBvZiBsYWJlbC5cbiAgICAgICAgICogISN6aCDmlofmnKzlrZfkvZPjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtGb250fSBmb250XG4gICAgICAgICAqL1xuICAgICAgICBmb250OiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9OJGZpbGU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvbnQgPT09IHZhbHVlKSByZXR1cm47XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy9pZiBkZWxldGUgdGhlIGZvbnQsIHdlIHNob3VsZCBjaGFuZ2UgaXNTeXN0ZW1Gb250VXNlZCB0byB0cnVlXG4gICAgICAgICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pc1N5c3RlbUZvbnRVc2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SICYmIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VzZXJEZWZpbmVkRm9udCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9OJGZpbGUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgdGhpcy5faXNTeXN0ZW1Gb250VXNlZClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faXNTeXN0ZW1Gb250VXNlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yY2VVcGRhdGVSZW5kZXJEYXRhKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogY2MuRm9udCxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubGFiZWwuZm9udCcsXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIF9pc1N5c3RlbUZvbnRVc2VkOiB0cnVlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFdoZXRoZXIgdXNlIHN5c3RlbSBmb250IG5hbWUgb3Igbm90LlxuICAgICAgICAgKiAhI3poIOaYr+WQpuS9v+eUqOezu+e7n+Wtl+S9k+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IHVzZVN5c3RlbUZvbnRcbiAgICAgICAgICovXG4gICAgICAgIHVzZVN5c3RlbUZvbnQ6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzU3lzdGVtRm9udFVzZWQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pc1N5c3RlbUZvbnRVc2VkID09PSB2YWx1ZSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHRoaXMuX2lzU3lzdGVtRm9udFVzZWQgPSAhIXZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF2YWx1ZSAmJiB0aGlzLl91c2VyRGVmaW5lZEZvbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZm9udCA9IHRoaXMuX3VzZXJEZWZpbmVkRm9udDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3BhY2luZ1ggPSB0aGlzLl9zcGFjaW5nWDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvbnQgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5lbmFibGVkSW5IaWVyYXJjaHkpIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmNlVXBkYXRlUmVuZGVyRGF0YSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLm1hcmtGb3JWYWxpZGF0ZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYWJlbC5zeXN0ZW1fZm9udCcsXG4gICAgICAgIH0sXG5cbiAgICAgICAgX2JtRm9udE9yaWdpbmFsU2l6ZToge1xuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdCTUZvbnQgT3JpZ2luYWwgU2l6ZScsXG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9OJGZpbGUgaW5zdGFuY2VvZiBjYy5CaXRtYXBGb250KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9OJGZpbGUuZm9udFNpemU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIF9zcGFjaW5nWDogMCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgc3BhY2luZyBvZiB0aGUgeCBheGlzIGJldHdlZW4gY2hhcmFjdGVycywgb25seSB0YWtlIEVmZmVjdCB3aGVuIHVzaW5nIGJpdG1hcCBmb250cy5cbiAgICAgICAgICogISN6aCDmloflrZfkuYvpl7QgeCDovbTnmoTpl7Tot53vvIzku4XlnKjkvb/nlKjkvY3lm77lrZfkvZPml7bnlJ/mlYjjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHNwYWNpbmdYXG4gICAgICAgICAqL1xuICAgICAgICBzcGFjaW5nWDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3BhY2luZ1g7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NwYWNpbmdYID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYWJlbC5zcGFjaW5nWCcsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy9Gb3IgY29tcGF0aWJpbGl0eSB3aXRoIHYyLjAueCB0ZW1wb3JhcnkgcmVzZXJ2YXRpb24uXG4gICAgICAgIF9iYXRjaEFzQml0bWFwOiBmYWxzZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgY2FjaGUgbW9kZSBvZiBsYWJlbC4gVGhpcyBtb2RlIG9ubHkgc3VwcG9ydHMgc3lzdGVtIGZvbnRzLlxuICAgICAgICAgKiAhI3poIOaWh+acrOe8k+WtmOaooeW8jywg6K+l5qih5byP5Y+q5pSv5oyB57O757uf5a2X5L2T44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TGFiZWwuQ2FjaGVNb2RlfSBjYWNoZU1vZGVcbiAgICAgICAgICovXG4gICAgICAgIGNhY2hlTW9kZToge1xuICAgICAgICAgICAgZGVmYXVsdDogQ2FjaGVNb2RlLk5PTkUsXG4gICAgICAgICAgICB0eXBlOiBDYWNoZU1vZGUsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmxhYmVsLmNhY2hlTW9kZScsXG4gICAgICAgICAgICBub3RpZnkgKG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2FjaGVNb2RlID09PSBvbGRWYWx1ZSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChvbGRWYWx1ZSA9PT0gQ2FjaGVNb2RlLkJJVE1BUCAmJiAhKHRoaXMuZm9udCBpbnN0YW5jZW9mIGNjLkJpdG1hcEZvbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZyYW1lICYmIHRoaXMuX2ZyYW1lLl9yZXNldER5bmFtaWNBdGxhc0ZyYW1lKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG9sZFZhbHVlID09PSBDYWNoZU1vZGUuQ0hBUikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90dGZUZXh0dXJlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZEluSGllcmFyY2h5KSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JjZVVwZGF0ZVJlbmRlckRhdGEoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIF9zdHlsZUZsYWdzOiAwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFdoZXRoZXIgZW5hYmxlIGJvbGQuXG4gICAgICAgICAqICEjemgg5piv5ZCm5ZCv55So6buR5L2T44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZW5hYmxlQm9sZFxuICAgICAgICAgKi9cbiAgICAgICAgZW5hYmxlQm9sZDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISEodGhpcy5fc3R5bGVGbGFncyAmIEJPTERfRkxBRyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdHlsZUZsYWdzIHw9IEJPTERfRkxBRztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdHlsZUZsYWdzICY9IH5CT0xEX0ZMQUc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmxhYmVsLmJvbGQnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gV2hldGhlciBlbmFibGUgaXRhbGljLlxuICAgICAgICAgKiAhI3poIOaYr+WQpuWQr+eUqOaWnOS9k+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGVuYWJsZUl0YWxpY1xuICAgICAgICAgKi9cbiAgICAgICAgZW5hYmxlSXRhbGljOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhISh0aGlzLl9zdHlsZUZsYWdzICYgSVRBTElDX0ZMQUcpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3R5bGVGbGFncyB8PSBJVEFMSUNfRkxBRztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdHlsZUZsYWdzICY9IH5JVEFMSUNfRkxBRztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmxhYmVsLml0YWxpYydcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBXaGV0aGVyIGVuYWJsZSB1bmRlcmxpbmUuXG4gICAgICAgICAqICEjemgg5piv5ZCm5ZCv55So5LiL5YiS57q/44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZW5hYmxlVW5kZXJsaW5lXG4gICAgICAgICAqL1xuICAgICAgICBlbmFibGVVbmRlcmxpbmU6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhKHRoaXMuX3N0eWxlRmxhZ3MgJiBVTkRFUkxJTkVfRkxBRyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdHlsZUZsYWdzIHw9IFVOREVSTElORV9GTEFHO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0eWxlRmxhZ3MgJj0gflVOREVSTElORV9GTEFHO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYWJlbC51bmRlcmxpbmUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgX3VuZGVybGluZUhlaWdodDogMCxcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIGhlaWdodCBvZiB1bmRlcmxpbmUuXG4gICAgICAgICAqICEjemgg5LiL5YiS57q/6auY5bqm44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB1bmRlcmxpbmVIZWlnaHRcbiAgICAgICAgICovXG4gICAgICAgIHVuZGVybGluZUhlaWdodDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdW5kZXJsaW5lSGVpZ2h0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdW5kZXJsaW5lSGVpZ2h0ID09PSB2YWx1ZSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMuX3VuZGVybGluZUhlaWdodCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubGFiZWwudW5kZXJsaW5lX2hlaWdodCcsXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgSG9yaXpvbnRhbEFsaWduOiBIb3Jpem9udGFsQWxpZ24sXG4gICAgICAgIFZlcnRpY2FsQWxpZ246IFZlcnRpY2FsQWxpZ24sXG4gICAgICAgIE92ZXJmbG93OiBPdmVyZmxvdyxcbiAgICAgICAgQ2FjaGVNb2RlOiBDYWNoZU1vZGUsXG5cbiAgICAgICAgX3NoYXJlQXRsYXM6IG51bGwsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI3poIOmcgOimgeS/neivgeW9k+WJjeWcuuaZr+S4reayoeacieS9v+eUqENIQVLnvJPlrZjnmoRMYWJlbOaJjeWPr+S7pea4hemZpO+8jOWQpuWImeW3sua4suafk+eahOaWh+Wtl+ayoeaciemHjeaWsOe7mOWItuS8muS4jeaYvuekulxuICAgICAgICAgKiAhI2VuIEl0IGNhbiBiZSBjbGVhcmVkIHRoYXQgbmVlZCB0byBlbnN1cmUgdGhlcmUgaXMgbm90IHVzZSB0aGUgQ0hBUiBjYWNoZSBpbiB0aGUgY3VycmVudCBzY2VuZS4gT3RoZXJ3aXNlLCB0aGUgcmVuZGVyZWQgdGV4dCB3aWxsIG5vdCBiZSBkaXNwbGF5ZWQgd2l0aG91dCByZXBhaW50aW5nLlxuICAgICAgICAgKiBAbWV0aG9kIGNsZWFyQ2hhckNhY2hlXG4gICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICovXG4gICAgICAgIGNsZWFyQ2hhckNhY2hlICgpIHtcbiAgICAgICAgICAgIGlmIChMYWJlbC5fc2hhcmVBdGxhcykge1xuICAgICAgICAgICAgICAgIExhYmVsLl9zaGFyZUF0bGFzLmNsZWFyQWxsQ2FjaGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkxvYWQgKCkge1xuICAgICAgICAvLyBGb3IgY29tcGF0aWJpbGl0eSB3aXRoIHYyLjAueCB0ZW1wb3JhcnkgcmVzZXJ2YXRpb24uXG4gICAgICAgIGlmICh0aGlzLl9iYXRjaEFzQml0bWFwICYmIHRoaXMuY2FjaGVNb2RlID09PSBDYWNoZU1vZGUuTk9ORSkge1xuICAgICAgICAgICAgdGhpcy5jYWNoZU1vZGUgPSBDYWNoZU1vZGUuQklUTUFQO1xuICAgICAgICAgICAgdGhpcy5fYmF0Y2hBc0JpdG1hcCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNjLmdhbWUucmVuZGVyVHlwZSA9PT0gY2MuZ2FtZS5SRU5ERVJfVFlQRV9DQU5WQVMpIHtcbiAgICAgICAgICAgIC8vIENhY2hlTW9kZSBpcyBub3Qgc3VwcG9ydGVkIGluIENhbnZhcy5cbiAgICAgICAgICAgIHRoaXMuY2FjaGVNb2RlID0gQ2FjaGVNb2RlLk5PTkU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25FbmFibGUgKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuXG4gICAgICAgIC8vIEtlZXAgdHJhY2sgb2YgTm9kZSBzaXplXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMuX25vZGVTaXplQ2hhbmdlZCwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRCwgdGhpcy5zZXRWZXJ0c0RpcnR5LCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLkNPTE9SX0NIQU5HRUQsIHRoaXMuX25vZGVDb2xvckNoYW5nZWQsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuX2ZvcmNlVXBkYXRlUmVuZGVyRGF0YSgpO1xuICAgIH0sXG5cbiAgICBvbkRpc2FibGUgKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgdGhpcy5fbm9kZVNpemVDaGFuZ2VkLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRCwgdGhpcy5zZXRWZXJ0c0RpcnR5LCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5DT0xPUl9DSEFOR0VELCB0aGlzLl9ub2RlQ29sb3JDaGFuZ2VkLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgb25EZXN0cm95ICgpIHtcbiAgICAgICAgdGhpcy5fYXNzZW1ibGVyICYmIHRoaXMuX2Fzc2VtYmxlci5fcmVzZXRBc3NlbWJsZXJEYXRhICYmIHRoaXMuX2Fzc2VtYmxlci5fcmVzZXRBc3NlbWJsZXJEYXRhKHRoaXMuX2Fzc2VtYmxlckRhdGEpO1xuICAgICAgICB0aGlzLl9hc3NlbWJsZXJEYXRhID0gbnVsbDtcbiAgICAgICAgdGhpcy5fbGV0dGVyVGV4dHVyZSA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLl90dGZUZXh0dXJlKSB7XG4gICAgICAgICAgICB0aGlzLl90dGZUZXh0dXJlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuX3R0ZlRleHR1cmUgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgfSxcblxuICAgIF9ub2RlU2l6ZUNoYW5nZWQgKCkge1xuICAgICAgICAvLyBCZWNhdXNlIHRoZSBjb250ZW50IHNpemUgaXMgYXV0b21hdGljYWxseSB1cGRhdGVkIHdoZW4gb3ZlcmZsb3cgaXMgTk9ORS5cbiAgICAgICAgLy8gQW5kIHRoaXMgd2lsbCBjb25mbGljdCB3aXRoIHRoZSBhbGlnbm1lbnQgb2YgdGhlIENDV2lkZ2V0LlxuICAgICAgICBpZiAoQ0NfRURJVE9SIHx8IHRoaXMub3ZlcmZsb3cgIT09IE92ZXJmbG93Lk5PTkUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9ub2RlQ29sb3JDaGFuZ2VkICgpIHtcbiAgICAgICAgaWYgKCEodGhpcy5mb250IGluc3RhbmNlb2YgY2MuQml0bWFwRm9udCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHNldFZlcnRzRGlydHkoKSB7XG4gICAgICAgIGlmKENDX0pTQiAmJiB0aGlzLl9uYXRpdmVUVEYoKSkge1xuICAgICAgICAgICAgdGhpcy5fYXNzZW1ibGVyICYmIHRoaXMuX2Fzc2VtYmxlci51cGRhdGVSZW5kZXJEYXRhKHRoaXMpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZUNvbG9yICgpIHtcbiAgICAgICAgaWYgKCEodGhpcy5mb250IGluc3RhbmNlb2YgY2MuQml0bWFwRm9udCkpIHtcbiAgICAgICAgICAgIGlmICghKHRoaXMuX3NyY0JsZW5kRmFjdG9yID09PSBjYy5tYWNyby5CbGVuZEZhY3Rvci5TUkNfQUxQSEEgJiYgdGhpcy5ub2RlLl9yZW5kZXJGbGFnICYgY2MuUmVuZGVyRmxvdy5GTEFHX09QQUNJVFkpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgUmVuZGVyQ29tcG9uZW50LnByb3RvdHlwZS5fdXBkYXRlQ29sb3IuY2FsbCh0aGlzKTtcbiAgICB9LFxuXG4gICAgX3ZhbGlkYXRlUmVuZGVyICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0cmluZykge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlUmVuZGVyKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fbWF0ZXJpYWxzWzBdKSB7XG4gICAgICAgICAgICBsZXQgZm9udCA9IHRoaXMuZm9udDtcbiAgICAgICAgICAgIGlmIChmb250IGluc3RhbmNlb2YgY2MuQml0bWFwRm9udCkge1xuICAgICAgICAgICAgICAgIGxldCBzcHJpdGVGcmFtZSA9IGZvbnQuc3ByaXRlRnJhbWU7XG4gICAgICAgICAgICAgICAgaWYgKHNwcml0ZUZyYW1lICYmIFxuICAgICAgICAgICAgICAgICAgICBzcHJpdGVGcmFtZS50ZXh0dXJlTG9hZGVkKCkgJiZcbiAgICAgICAgICAgICAgICAgICAgZm9udC5fZm50Q29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRpc2FibGVSZW5kZXIoKTtcbiAgICB9LFxuXG4gICAgX3Jlc2V0QXNzZW1ibGVyICgpIHtcbiAgICAgICAgdGhpcy5fcmVzZXRGcmFtZSgpO1xuICAgICAgICBSZW5kZXJDb21wb25lbnQucHJvdG90eXBlLl9yZXNldEFzc2VtYmxlci5jYWxsKHRoaXMpO1xuICAgIH0sXG5cbiAgICBfcmVzZXRGcmFtZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9mcmFtZSAmJiAhKHRoaXMuZm9udCBpbnN0YW5jZW9mIGNjLkJpdG1hcEZvbnQpKSB7XG4gICAgICAgICAgICBkZWxldGVGcm9tRHluYW1pY0F0bGFzKHRoaXMsIHRoaXMuX2ZyYW1lKTtcbiAgICAgICAgICAgIHRoaXMuX2ZyYW1lID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfY2hlY2tTdHJpbmdFbXB0eSAoKSB7XG4gICAgICAgIHRoaXMubWFya0ZvclJlbmRlcighIXRoaXMuc3RyaW5nKTtcbiAgICB9LFxuXG4gICAgX29uM0ROb2RlQ2hhbmdlZCAoKSB7XG4gICAgICAgIHRoaXMuX3Jlc2V0QXNzZW1ibGVyKCk7XG4gICAgICAgIHRoaXMuX2FwcGx5Rm9udFRleHR1cmUoKTtcbiAgICB9LFxuXG4gICAgX29uQk1Gb250VGV4dHVyZUxvYWRlZCAoKSB7XG4gICAgICAgIHRoaXMuX2ZyYW1lLl90ZXh0dXJlID0gdGhpcy5mb250LnNwcml0ZUZyYW1lLl90ZXh0dXJlO1xuICAgICAgICB0aGlzLm1hcmtGb3JSZW5kZXIodHJ1ZSk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZU1hdGVyaWFsKCk7XG4gICAgICAgIHRoaXMuX2Fzc2VtYmxlciAmJiB0aGlzLl9hc3NlbWJsZXIudXBkYXRlUmVuZGVyRGF0YSh0aGlzKTtcbiAgICB9LFxuXG4gICAgX29uQmxlbmRDaGFuZ2VkICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnVzZVN5c3RlbUZvbnQgfHwgIXRoaXMuZW5hYmxlZEluSGllcmFyY2h5KSByZXR1cm47XG4gICAgICAgICAgXG4gICAgICAgIHRoaXMuX2ZvcmNlVXBkYXRlUmVuZGVyRGF0YSgpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlGb250VGV4dHVyZSAoKSB7XG4gICAgICAgIGxldCBmb250ID0gdGhpcy5mb250O1xuICAgICAgICBpZiAoZm9udCBpbnN0YW5jZW9mIGNjLkJpdG1hcEZvbnQpIHtcbiAgICAgICAgICAgIGxldCBzcHJpdGVGcmFtZSA9IGZvbnQuc3ByaXRlRnJhbWU7XG4gICAgICAgICAgICB0aGlzLl9mcmFtZSA9IHNwcml0ZUZyYW1lO1xuICAgICAgICAgICAgaWYgKHNwcml0ZUZyYW1lKSB7XG4gICAgICAgICAgICAgICAgc3ByaXRlRnJhbWUub25UZXh0dXJlTG9hZGVkKHRoaXMuX29uQk1Gb250VGV4dHVyZUxvYWRlZCwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZighdGhpcy5fbmF0aXZlVFRGKCkpe1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fZnJhbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZnJhbWUgPSBuZXcgTGFiZWxGcmFtZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jYWNoZU1vZGUgPT09IENhY2hlTW9kZS5DSEFSKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xldHRlclRleHR1cmUgPSB0aGlzLl9hc3NlbWJsZXIuX2dldEFzc2VtYmxlckRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZnJhbWUuX3JlZnJlc2hUZXh0dXJlKHRoaXMuX2xldHRlclRleHR1cmUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX3R0ZlRleHR1cmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHRmVGV4dHVyZSA9IG5ldyBjYy5UZXh0dXJlMkQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXNzZW1ibGVyRGF0YSA9IHRoaXMuX2Fzc2VtYmxlci5fZ2V0QXNzZW1ibGVyRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90dGZUZXh0dXJlLmluaXRXaXRoRWxlbWVudCh0aGlzLl9hc3NlbWJsZXJEYXRhLmNhbnZhcyk7XG4gICAgICAgICAgICAgICAgfSBcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNhY2hlTW9kZSAhPT0gQ2FjaGVNb2RlLkNIQVIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZnJhbWUuX3Jlc2V0RHluYW1pY0F0bGFzRnJhbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZnJhbWUuX3JlZnJlc2hUZXh0dXJlKHRoaXMuX3R0ZlRleHR1cmUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fc3JjQmxlbmRGYWN0b3IgPT09IGNjLm1hY3JvLkJsZW5kRmFjdG9yLk9ORSAmJiAhQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3R0ZlRleHR1cmUuc2V0UHJlbXVsdGlwbHlBbHBoYSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVNYXRlcmlhbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fYXNzZW1ibGVyICYmIHRoaXMuX2Fzc2VtYmxlci51cGRhdGVSZW5kZXJEYXRhKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubWFya0ZvclZhbGlkYXRlKCk7XG4gICAgfSxcblxuICAgIF91cGRhdGVNYXRlcmlhbENhbnZhcyAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fZnJhbWUpIHJldHVybjtcbiAgICAgICAgdGhpcy5fZnJhbWUuX3RleHR1cmUuX25hdGl2ZVVybCA9IHRoaXMudXVpZCArICdfdGV4dHVyZSc7XG4gICAgfSxcblxuICAgIF91cGRhdGVNYXRlcmlhbFdlYmdsICgpIHtcblxuICAgICAgICBsZXQgbWF0ZXJpYWwgPSB0aGlzLmdldE1hdGVyaWFsKDApO1xuICAgICAgICBpZih0aGlzLl9uYXRpdmVUVEYoKSkge1xuICAgICAgICAgICAgaWYobWF0ZXJpYWwpIHRoaXMuX2Fzc2VtYmxlci5fdXBkYXRlVFRGTWF0ZXJpYWwodGhpcylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5fZnJhbWUpIHJldHVybjtcbiAgICAgICAgbWF0ZXJpYWwgJiYgbWF0ZXJpYWwuc2V0UHJvcGVydHkoJ3RleHR1cmUnLCB0aGlzLl9mcmFtZS5fdGV4dHVyZSk7XG5cbiAgICAgICAgQmxlbmRGdW5jLnByb3RvdHlwZS5fdXBkYXRlTWF0ZXJpYWwuY2FsbCh0aGlzKTtcbiAgICB9LFxuXG4gICAgX2ZvcmNlVXNlQ2FudmFzOiBmYWxzZSxcbiBcbiAgICBfdXNlTmF0aXZlVFRGKCkge1xuICAgICAgICByZXR1cm4gY2MubWFjcm8uRU5BQkxFX05BVElWRV9UVEZfUkVOREVSRVIgJiYgIXRoaXMuX2ZvcmNlVXNlQ2FudmFzO1xuICAgIH0sIFxuXG4gICAgX25hdGl2ZVRURigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VzZU5hdGl2ZVRURigpICYmICEhdGhpcy5fYXNzZW1ibGVyICYmICEhdGhpcy5fYXNzZW1ibGVyLl91cGRhdGVUVEZNYXRlcmlhbDtcbiAgICB9LFxuXG4gICAgX2ZvcmNlVXBkYXRlUmVuZGVyRGF0YSAoKSB7XG4gICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICB0aGlzLl9yZXNldEFzc2VtYmxlcigpO1xuICAgICAgICB0aGlzLl9hcHBseUZvbnRUZXh0dXJlKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIGBsYWJlbC5fZW5hYmxlQm9sZGAgaXMgZGVwcmVjYXRlZCwgdXNlIGBsYWJlbC5lbmFibGVCb2xkID0gdHJ1ZWAgaW5zdGVhZCBwbGVhc2UuXG4gICAgICovXG4gICAgX2VuYWJsZUJvbGQgKGVuYWJsZWQpIHtcbiAgICAgICAgaWYgKENDX0RFQlVHKSB7XG4gICAgICAgICAgICBjYy53YXJuKCdgbGFiZWwuX2VuYWJsZUJvbGRgIGlzIGRlcHJlY2F0ZWQsIHVzZSBgbGFiZWwuZW5hYmxlQm9sZCA9IHRydWVgIGluc3RlYWQgcGxlYXNlJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbmFibGVCb2xkID0gISFlbmFibGVkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBgbGFiZWwuX2VuYWJsZUl0YWxpY3NgIGlzIGRlcHJlY2F0ZWQsIHVzZSBgbGFiZWwuZW5hYmxlSXRhbGljcyA9IHRydWVgIGluc3RlYWQgcGxlYXNlLlxuICAgICAqL1xuICAgIF9lbmFibGVJdGFsaWNzIChlbmFibGVkKSB7XG4gICAgICAgIGlmIChDQ19ERUJVRykge1xuICAgICAgICAgICAgY2Mud2FybignYGxhYmVsLl9lbmFibGVJdGFsaWNzYCBpcyBkZXByZWNhdGVkLCB1c2UgYGxhYmVsLmVuYWJsZUl0YWxpY3MgPSB0cnVlYCBpbnN0ZWFkIHBsZWFzZScpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW5hYmxlSXRhbGljID0gISFlbmFibGVkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBgbGFiZWwuX2VuYWJsZVVuZGVybGluZWAgaXMgZGVwcmVjYXRlZCwgdXNlIGBsYWJlbC5lbmFibGVVbmRlcmxpbmUgPSB0cnVlYCBpbnN0ZWFkIHBsZWFzZS5cbiAgICAgKi9cbiAgICBfZW5hYmxlVW5kZXJsaW5lIChlbmFibGVkKSB7XG4gICAgICAgIGlmIChDQ19ERUJVRykge1xuICAgICAgICAgICAgY2Mud2FybignYGxhYmVsLl9lbmFibGVVbmRlcmxpbmVgIGlzIGRlcHJlY2F0ZWQsIHVzZSBgbGFiZWwuZW5hYmxlVW5kZXJsaW5lID0gdHJ1ZWAgaW5zdGVhZCBwbGVhc2UnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVuYWJsZVVuZGVybGluZSA9ICEhZW5hYmxlZDtcbiAgICB9LFxuIH0pO1xuXG4gY2MuTGFiZWwgPSBtb2R1bGUuZXhwb3J0cyA9IExhYmVsO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=