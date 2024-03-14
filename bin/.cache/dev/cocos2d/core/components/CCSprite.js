
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCSprite.js';
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
var misc = require('../utils/misc');

var NodeEvent = require('../CCNode').EventType;

var RenderComponent = require('./CCRenderComponent');

var BlendFunc = require('../utils/blend-func');
/**
 * !#en Enum for sprite type.
 * !#zh Sprite 类型
 * @enum Sprite.Type
 */


var SpriteType = cc.Enum({
  /**
   * !#en The simple type.
   * !#zh 普通类型
   * @property {Number} SIMPLE
   */
  SIMPLE: 0,

  /**
   * !#en The sliced type.
   * !#zh 切片（九宫格）类型
   * @property {Number} SLICED
   */
  SLICED: 1,

  /**
   * !#en The tiled type.
   * !#zh 平铺类型
   * @property {Number} TILED
   */
  TILED: 2,

  /**
   * !#en The filled type.
   * !#zh 填充类型
   * @property {Number} FILLED
   */
  FILLED: 3,

  /**
   * !#en The mesh type.
   * !#zh 以 Mesh 三角形组成的类型
   * @property {Number} MESH
   */
  MESH: 4
});
/**
 * !#en Enum for fill type.
 * !#zh 填充类型
 * @enum Sprite.FillType
 */

var FillType = cc.Enum({
  /**
   * !#en The horizontal fill.
   * !#zh 水平方向填充
   * @property {Number} HORIZONTAL
   */
  HORIZONTAL: 0,

  /**
   * !#en The vertical fill.
   * !#zh 垂直方向填充
   * @property {Number} VERTICAL
   */
  VERTICAL: 1,

  /**
   * !#en The radial fill.
   * !#zh 径向填充
   * @property {Number} RADIAL
   */
  RADIAL: 2
});
/**
 * !#en Sprite Size can track trimmed size, raw size or none.
 * !#zh 精灵尺寸调整模式
 * @enum Sprite.SizeMode
 */

var SizeMode = cc.Enum({
  /**
   * !#en Use the customized node size.
   * !#zh 使用节点预设的尺寸
   * @property {Number} CUSTOM
   */
  CUSTOM: 0,

  /**
   * !#en Match the trimmed size of the sprite frame automatically.
   * !#zh 自动适配为精灵裁剪后的尺寸
   * @property {Number} TRIMMED
   */
  TRIMMED: 1,

  /**
   * !#en Match the raw size of the sprite frame automatically.
   * !#zh 自动适配为精灵原图尺寸
   * @property {Number} RAW
   */
  RAW: 2
});
/**
 * !#en Sprite state can choice the normal or grayscale.
 * !#zh 精灵颜色通道模式。
 * @enum Sprite.State
 * @deprecated
 */

var State = cc.Enum({
  /**
   * !#en The normal state
   * !#zh 正常状态
   * @property {Number} NORMAL
   */
  NORMAL: 0,

  /**
   * !#en The gray state, all color will be modified to grayscale value.
   * !#zh 灰色状态，所有颜色会被转换成灰度值
   * @property {Number} GRAY
   */
  GRAY: 1
});
/**
 * !#en Renders a sprite in the scene.
 * !#zh 该组件用于在场景中渲染精灵。
 * @class Sprite
 * @extends RenderComponent
 * @uses BlendFunc
 * @example
 *  // Create a new node and add sprite components.
 *  var node = new cc.Node("New Sprite");
 *  var sprite = node.addComponent(cc.Sprite);
 *  node.parent = this.node;
 */

var Sprite = cc.Class({
  name: 'cc.Sprite',
  "extends": RenderComponent,
  mixins: [BlendFunc],
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.renderers/Sprite',
    help: 'i18n:COMPONENT.help_url.sprite',
    inspector: 'packages://inspector/inspectors/comps/sprite.js'
  },
  properties: {
    _spriteFrame: {
      "default": null,
      type: cc.SpriteFrame
    },
    _type: SpriteType.SIMPLE,
    _sizeMode: SizeMode.TRIMMED,
    _fillType: 0,
    _fillCenter: cc.v2(0, 0),
    _fillStart: 0,
    _fillRange: 0,
    _isTrimmedMode: true,
    _atlas: {
      "default": null,
      type: cc.SpriteAtlas,
      tooltip: CC_DEV && 'i18n:COMPONENT.sprite.atlas',
      editorOnly: true,
      visible: true,
      animatable: false
    },

    /**
     * !#en The sprite frame of the sprite.
     * !#zh 精灵的精灵帧
     * @property spriteFrame
     * @type {SpriteFrame}
     * @example
     * sprite.spriteFrame = newSpriteFrame;
     */
    spriteFrame: {
      get: function get() {
        return this._spriteFrame;
      },
      set: function set(value, force) {
        var lastSprite = this._spriteFrame;

        if (CC_EDITOR) {
          if (!force && (lastSprite && lastSprite._uuid) === (value && value._uuid)) {
            return;
          }
        } else {
          if (lastSprite === value) {
            return;
          }
        }

        this._spriteFrame = value;

        this._applySpriteFrame(lastSprite);

        if (CC_EDITOR) {
          this.node.emit('spriteframe-changed', this);
        }
      },
      type: cc.SpriteFrame
    },

    /**
     * !#en The sprite render type.
     * !#zh 精灵渲染类型
     * @property type
     * @type {Sprite.Type}
     * @example
     * sprite.type = cc.Sprite.Type.SIMPLE;
     */
    type: {
      get: function get() {
        return this._type;
      },
      set: function set(value) {
        if (this._type !== value) {
          this._type = value;
          this.setVertsDirty();

          this._resetAssembler();
        }
      },
      type: SpriteType,
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.sprite.type'
    },

    /**
     * !#en
     * The fill type, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
     * !#zh
     * 精灵填充类型，仅渲染类型设置为 cc.Sprite.Type.FILLED 时有效。
     * @property fillType
     * @type {Sprite.FillType}
     * @example
     * sprite.fillType = cc.Sprite.FillType.HORIZONTAL;
     */
    fillType: {
      get: function get() {
        return this._fillType;
      },
      set: function set(value) {
        if (value !== this._fillType) {
          this._fillType = value;
          this.setVertsDirty();

          this._resetAssembler();
        }
      },
      type: FillType,
      tooltip: CC_DEV && 'i18n:COMPONENT.sprite.fill_type'
    },

    /**
     * !#en
     * The fill Center, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
     * !#zh
     * 填充中心点，仅渲染类型设置为 cc.Sprite.Type.FILLED 时有效。
     * @property fillCenter
     * @type {Vec2}
     * @example
     * sprite.fillCenter = new cc.Vec2(0, 0);
     */
    fillCenter: {
      get: function get() {
        return this._fillCenter;
      },
      set: function set(value) {
        this._fillCenter.x = value.x;
        this._fillCenter.y = value.y;

        if (this._type === SpriteType.FILLED) {
          this.setVertsDirty();
        }
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.sprite.fill_center'
    },

    /**
     * !#en
     * The fill Start, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
     * !#zh
     * 填充起始点，仅渲染类型设置为 cc.Sprite.Type.FILLED 时有效。
     * @property fillStart
     * @type {Number}
     * @example
     * // -1 To 1 between the numbers
     * sprite.fillStart = 0.5;
     */
    fillStart: {
      get: function get() {
        return this._fillStart;
      },
      set: function set(value) {
        this._fillStart = misc.clampf(value, -1, 1);

        if (this._type === SpriteType.FILLED) {
          this.setVertsDirty();
        }
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.sprite.fill_start'
    },

    /**
     * !#en
     * The fill Range, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
     * !#zh
     * 填充范围，仅渲染类型设置为 cc.Sprite.Type.FILLED 时有效。
     * @property fillRange
     * @type {Number}
     * @example
     * // -1 To 1 between the numbers
     * sprite.fillRange = 1;
     */
    fillRange: {
      get: function get() {
        return this._fillRange;
      },
      set: function set(value) {
        this._fillRange = misc.clampf(value, -1, 1);

        if (this._type === SpriteType.FILLED) {
          this.setVertsDirty();
        }
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.sprite.fill_range'
    },

    /**
     * !#en specify the frame is trimmed or not.
     * !#zh 是否使用裁剪模式
     * @property trim
     * @type {Boolean}
     * @example
     * sprite.trim = true;
     */
    trim: {
      get: function get() {
        return this._isTrimmedMode;
      },
      set: function set(value) {
        if (this._isTrimmedMode !== value) {
          this._isTrimmedMode = value;

          if (this._type === SpriteType.SIMPLE || this._type === SpriteType.MESH) {
            this.setVertsDirty();
          }
        }
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.sprite.trim'
    },

    /**
     * !#en specify the size tracing mode.
     * !#zh 精灵尺寸调整模式
     * @property sizeMode
     * @type {Sprite.SizeMode}
     * @example
     * sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
     */
    sizeMode: {
      get: function get() {
        return this._sizeMode;
      },
      set: function set(value) {
        this._sizeMode = value;

        if (value !== SizeMode.CUSTOM) {
          this._applySpriteSize();
        }
      },
      animatable: false,
      type: SizeMode,
      tooltip: CC_DEV && 'i18n:COMPONENT.sprite.size_mode'
    }
  },
  statics: {
    FillType: FillType,
    Type: SpriteType,
    SizeMode: SizeMode,
    State: State
  },
  setVisible: function setVisible(visible) {
    this.enabled = visible;
  },

  /**
   * Change the state of sprite.
   * @method setState
   * @see `Sprite.State`
   * @param state {Sprite.State} NORMAL or GRAY State.
   * @deprecated
   */
  setState: function setState() {},

  /**
   * Gets the current state.
   * @method getState
   * @see `Sprite.State`
   * @return {Sprite.State}
   * @deprecated
   */
  getState: function getState() {},
  __preload: function __preload() {
    this._super();

    CC_EDITOR && this.node.on(NodeEvent.SIZE_CHANGED, this._resizedInEditor, this);

    this._applySpriteFrame();
  },
  onEnable: function onEnable() {
    this._super();

    this._spriteFrame && this._spriteFrame.ensureLoadTexture();
    this.node.on(cc.Node.EventType.SIZE_CHANGED, this.setVertsDirty, this);
    this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this.setVertsDirty, this);
  },
  onDisable: function onDisable() {
    this._super();

    this.node.off(cc.Node.EventType.SIZE_CHANGED, this.setVertsDirty, this);
    this.node.off(cc.Node.EventType.ANCHOR_CHANGED, this.setVertsDirty, this);
  },
  _updateMaterial: function _updateMaterial() {
    var texture = null;

    if (this._spriteFrame) {
      texture = this._spriteFrame.getTexture();
    } // make sure material is belong to self.


    var material = this.getMaterial(0);

    if (material) {
      if (material.getDefine('USE_TEXTURE') !== undefined) {
        material.define('USE_TEXTURE', true);
      }

      if (material.getProperty('texture') !== texture) {
        material.setProperty('texture', texture);
      }
    }

    BlendFunc.prototype._updateMaterial.call(this);
  },
  _applyAtlas: CC_EDITOR && function (spriteFrame) {
    // Set atlas
    if (spriteFrame && spriteFrame._atlasUuid) {
      var self = this;
      cc.assetManager.loadAny(spriteFrame._atlasUuid, function (err, asset) {
        self._atlas = asset;
      });
    } else {
      this._atlas = null;
    }
  },
  _validateRender: function _validateRender() {
    var spriteFrame = this._spriteFrame;

    if (this._materials[0] && spriteFrame && spriteFrame.textureLoaded()) {
      return;
    }

    this.disableRender();
  },
  _applySpriteSize: function _applySpriteSize() {
    if (!this._spriteFrame || !this.isValid) return;

    if (SizeMode.RAW === this._sizeMode) {
      var size = this._spriteFrame._originalSize;
      this.node.setContentSize(size);
    } else if (SizeMode.TRIMMED === this._sizeMode) {
      var rect = this._spriteFrame._rect;
      this.node.setContentSize(rect.width, rect.height);
    }

    this.setVertsDirty();
  },
  _applySpriteFrame: function _applySpriteFrame(oldFrame) {
    if (!this.isValid) return;
    var oldTexture = oldFrame && oldFrame.getTexture();

    if (oldTexture && !oldTexture.loaded) {
      oldFrame.off('load', this._applySpriteSize, this);
    }

    this._updateMaterial();

    var spriteFrame = this._spriteFrame;

    if (spriteFrame) {
      var newTexture = spriteFrame.getTexture();

      if (newTexture && newTexture.loaded) {
        this._applySpriteSize();
      } else {
        this.disableRender();
        spriteFrame.once('load', this._applySpriteSize, this);
      }
    } else {
      this.disableRender();
    }

    if (CC_EDITOR) {
      // Set atlas
      this._applyAtlas(spriteFrame);
    }
  }
});

if (CC_EDITOR) {
  Sprite.prototype._resizedInEditor = function () {
    if (this._spriteFrame) {
      var actualSize = this.node.getContentSize();
      var expectedW = actualSize.width;
      var expectedH = actualSize.height;

      if (this._sizeMode === SizeMode.RAW) {
        var size = this._spriteFrame.getOriginalSize();

        expectedW = size.width;
        expectedH = size.height;
      } else if (this._sizeMode === SizeMode.TRIMMED) {
        var rect = this._spriteFrame.getRect();

        expectedW = rect.width;
        expectedH = rect.height;
      }

      if (expectedW !== actualSize.width || expectedH !== actualSize.height) {
        this._sizeMode = SizeMode.CUSTOM;
      }
    }
  }; // override onDestroy


  Sprite.prototype.__superOnDestroy = cc.Component.prototype.onDestroy;

  Sprite.prototype.onDestroy = function () {
    if (this.__superOnDestroy) this.__superOnDestroy();
    this.node.off(NodeEvent.SIZE_CHANGED, this._resizedInEditor, this);
  };
}

cc.Sprite = module.exports = Sprite;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvQ0NTcHJpdGUuanMiXSwibmFtZXMiOlsibWlzYyIsInJlcXVpcmUiLCJOb2RlRXZlbnQiLCJFdmVudFR5cGUiLCJSZW5kZXJDb21wb25lbnQiLCJCbGVuZEZ1bmMiLCJTcHJpdGVUeXBlIiwiY2MiLCJFbnVtIiwiU0lNUExFIiwiU0xJQ0VEIiwiVElMRUQiLCJGSUxMRUQiLCJNRVNIIiwiRmlsbFR5cGUiLCJIT1JJWk9OVEFMIiwiVkVSVElDQUwiLCJSQURJQUwiLCJTaXplTW9kZSIsIkNVU1RPTSIsIlRSSU1NRUQiLCJSQVciLCJTdGF0ZSIsIk5PUk1BTCIsIkdSQVkiLCJTcHJpdGUiLCJDbGFzcyIsIm5hbWUiLCJtaXhpbnMiLCJlZGl0b3IiLCJDQ19FRElUT1IiLCJtZW51IiwiaGVscCIsImluc3BlY3RvciIsInByb3BlcnRpZXMiLCJfc3ByaXRlRnJhbWUiLCJ0eXBlIiwiU3ByaXRlRnJhbWUiLCJfdHlwZSIsIl9zaXplTW9kZSIsIl9maWxsVHlwZSIsIl9maWxsQ2VudGVyIiwidjIiLCJfZmlsbFN0YXJ0IiwiX2ZpbGxSYW5nZSIsIl9pc1RyaW1tZWRNb2RlIiwiX2F0bGFzIiwiU3ByaXRlQXRsYXMiLCJ0b29sdGlwIiwiQ0NfREVWIiwiZWRpdG9yT25seSIsInZpc2libGUiLCJhbmltYXRhYmxlIiwic3ByaXRlRnJhbWUiLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsImZvcmNlIiwibGFzdFNwcml0ZSIsIl91dWlkIiwiX2FwcGx5U3ByaXRlRnJhbWUiLCJub2RlIiwiZW1pdCIsInNldFZlcnRzRGlydHkiLCJfcmVzZXRBc3NlbWJsZXIiLCJmaWxsVHlwZSIsImZpbGxDZW50ZXIiLCJ4IiwieSIsImZpbGxTdGFydCIsImNsYW1wZiIsImZpbGxSYW5nZSIsInRyaW0iLCJzaXplTW9kZSIsIl9hcHBseVNwcml0ZVNpemUiLCJzdGF0aWNzIiwiVHlwZSIsInNldFZpc2libGUiLCJlbmFibGVkIiwic2V0U3RhdGUiLCJnZXRTdGF0ZSIsIl9fcHJlbG9hZCIsIl9zdXBlciIsIm9uIiwiU0laRV9DSEFOR0VEIiwiX3Jlc2l6ZWRJbkVkaXRvciIsIm9uRW5hYmxlIiwiZW5zdXJlTG9hZFRleHR1cmUiLCJOb2RlIiwiQU5DSE9SX0NIQU5HRUQiLCJvbkRpc2FibGUiLCJvZmYiLCJfdXBkYXRlTWF0ZXJpYWwiLCJ0ZXh0dXJlIiwiZ2V0VGV4dHVyZSIsIm1hdGVyaWFsIiwiZ2V0TWF0ZXJpYWwiLCJnZXREZWZpbmUiLCJ1bmRlZmluZWQiLCJkZWZpbmUiLCJnZXRQcm9wZXJ0eSIsInNldFByb3BlcnR5IiwicHJvdG90eXBlIiwiY2FsbCIsIl9hcHBseUF0bGFzIiwiX2F0bGFzVXVpZCIsInNlbGYiLCJhc3NldE1hbmFnZXIiLCJsb2FkQW55IiwiZXJyIiwiYXNzZXQiLCJfdmFsaWRhdGVSZW5kZXIiLCJfbWF0ZXJpYWxzIiwidGV4dHVyZUxvYWRlZCIsImRpc2FibGVSZW5kZXIiLCJpc1ZhbGlkIiwic2l6ZSIsIl9vcmlnaW5hbFNpemUiLCJzZXRDb250ZW50U2l6ZSIsInJlY3QiLCJfcmVjdCIsIndpZHRoIiwiaGVpZ2h0Iiwib2xkRnJhbWUiLCJvbGRUZXh0dXJlIiwibG9hZGVkIiwibmV3VGV4dHVyZSIsIm9uY2UiLCJhY3R1YWxTaXplIiwiZ2V0Q29udGVudFNpemUiLCJleHBlY3RlZFciLCJleHBlY3RlZEgiLCJnZXRPcmlnaW5hbFNpemUiLCJnZXRSZWN0IiwiX19zdXBlck9uRGVzdHJveSIsIkNvbXBvbmVudCIsIm9uRGVzdHJveSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLElBQUksR0FBR0MsT0FBTyxDQUFDLGVB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LENBQUNDLE9BQVAsR0FBaUJqSCxNQUE3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3QgbWlzYyA9IHJlcXVpcmUoJy4uL3V0aWxzL21pc2MnKTtcbmNvbnN0IE5vZGVFdmVudCA9IHJlcXVpcmUoJy4uL0NDTm9kZScpLkV2ZW50VHlwZTtcbmNvbnN0IFJlbmRlckNvbXBvbmVudCA9IHJlcXVpcmUoJy4vQ0NSZW5kZXJDb21wb25lbnQnKTtcbmNvbnN0IEJsZW5kRnVuYyA9IHJlcXVpcmUoJy4uL3V0aWxzL2JsZW5kLWZ1bmMnKTtcblxuXG4vKipcbiAqICEjZW4gRW51bSBmb3Igc3ByaXRlIHR5cGUuXG4gKiAhI3poIFNwcml0ZSDnsbvlnotcbiAqIEBlbnVtIFNwcml0ZS5UeXBlXG4gKi9cbnZhciBTcHJpdGVUeXBlID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgc2ltcGxlIHR5cGUuXG4gICAgICogISN6aCDmma7pgJrnsbvlnotcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU0lNUExFXG4gICAgICovXG4gICAgU0lNUExFOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHNsaWNlZCB0eXBlLlxuICAgICAqICEjemgg5YiH54mH77yI5Lmd5a6r5qC877yJ57G75Z6LXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFNMSUNFRFxuICAgICAqL1xuICAgIFNMSUNFRDogMSxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSB0aWxlZCB0eXBlLlxuICAgICAqICEjemgg5bmz6ZO657G75Z6LXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFRJTEVEXG4gICAgICovXG4gICAgVElMRUQ6IDIsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZmlsbGVkIHR5cGUuXG4gICAgICogISN6aCDloavlhYXnsbvlnotcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gRklMTEVEXG4gICAgICovXG4gICAgRklMTEVEOiAzLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG1lc2ggdHlwZS5cbiAgICAgKiAhI3poIOS7pSBNZXNoIOS4ieinkuW9oue7hOaIkOeahOexu+Wei1xuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBNRVNIXG4gICAgICovXG4gICAgTUVTSDogNFxufSk7XG5cbi8qKlxuICogISNlbiBFbnVtIGZvciBmaWxsIHR5cGUuXG4gKiAhI3poIOWhq+WFheexu+Wei1xuICogQGVudW0gU3ByaXRlLkZpbGxUeXBlXG4gKi9cbnZhciBGaWxsVHlwZSA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGhvcml6b250YWwgZmlsbC5cbiAgICAgKiAhI3poIOawtOW5s+aWueWQkeWhq+WFhVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBIT1JJWk9OVEFMXG4gICAgICovXG4gICAgSE9SSVpPTlRBTDogMCxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSB2ZXJ0aWNhbCBmaWxsLlxuICAgICAqICEjemgg5Z6C55u05pa55ZCR5aGr5YWFXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFZFUlRJQ0FMXG4gICAgICovXG4gICAgVkVSVElDQUw6IDEsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgcmFkaWFsIGZpbGwuXG4gICAgICogISN6aCDlvoTlkJHloavlhYVcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUkFESUFMXG4gICAgICovXG4gICAgUkFESUFMOjIsXG59KTtcblxuLyoqXG4gKiAhI2VuIFNwcml0ZSBTaXplIGNhbiB0cmFjayB0cmltbWVkIHNpemUsIHJhdyBzaXplIG9yIG5vbmUuXG4gKiAhI3poIOeyvueBteWwuuWvuOiwg+aVtOaooeW8j1xuICogQGVudW0gU3ByaXRlLlNpemVNb2RlXG4gKi9cbnZhciBTaXplTW9kZSA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqICEjZW4gVXNlIHRoZSBjdXN0b21pemVkIG5vZGUgc2l6ZS5cbiAgICAgKiAhI3poIOS9v+eUqOiKgueCuemihOiuvueahOWwuuWvuFxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBDVVNUT01cbiAgICAgKi9cbiAgICBDVVNUT006IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBNYXRjaCB0aGUgdHJpbW1lZCBzaXplIG9mIHRoZSBzcHJpdGUgZnJhbWUgYXV0b21hdGljYWxseS5cbiAgICAgKiAhI3poIOiHquWKqOmAgumFjeS4uueyvueBteijgeWJquWQjueahOWwuuWvuFxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBUUklNTUVEXG4gICAgICovXG4gICAgVFJJTU1FRDogMSxcbiAgICAvKipcbiAgICAgKiAhI2VuIE1hdGNoIHRoZSByYXcgc2l6ZSBvZiB0aGUgc3ByaXRlIGZyYW1lIGF1dG9tYXRpY2FsbHkuXG4gICAgICogISN6aCDoh6rliqjpgILphY3kuLrnsr7ngbXljp/lm77lsLrlr7hcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUkFXXG4gICAgICovXG4gICAgUkFXOiAyXG59KTtcbi8qKlxuICogISNlbiBTcHJpdGUgc3RhdGUgY2FuIGNob2ljZSB0aGUgbm9ybWFsIG9yIGdyYXlzY2FsZS5cbiAqICEjemgg57K+54G16aKc6Imy6YCa6YGT5qih5byP44CCXG4gKiBAZW51bSBTcHJpdGUuU3RhdGVcbiAqIEBkZXByZWNhdGVkXG4gKi9cbnZhciBTdGF0ZSA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG5vcm1hbCBzdGF0ZVxuICAgICAqICEjemgg5q2j5bi454q25oCBXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IE5PUk1BTFxuICAgICAqL1xuICAgIE5PUk1BTDogMCxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBncmF5IHN0YXRlLCBhbGwgY29sb3Igd2lsbCBiZSBtb2RpZmllZCB0byBncmF5c2NhbGUgdmFsdWUuXG4gICAgICogISN6aCDngbDoibLnirbmgIHvvIzmiYDmnInpopzoibLkvJrooqvovazmjaLmiJDngbDluqblgLxcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gR1JBWVxuICAgICAqL1xuICAgIEdSQVk6IDFcbn0pO1xuXG4vKipcbiAqICEjZW4gUmVuZGVycyBhIHNwcml0ZSBpbiB0aGUgc2NlbmUuXG4gKiAhI3poIOivpee7hOS7tueUqOS6juWcqOWcuuaZr+S4rea4suafk+eyvueBteOAglxuICogQGNsYXNzIFNwcml0ZVxuICogQGV4dGVuZHMgUmVuZGVyQ29tcG9uZW50XG4gKiBAdXNlcyBCbGVuZEZ1bmNcbiAqIEBleGFtcGxlXG4gKiAgLy8gQ3JlYXRlIGEgbmV3IG5vZGUgYW5kIGFkZCBzcHJpdGUgY29tcG9uZW50cy5cbiAqICB2YXIgbm9kZSA9IG5ldyBjYy5Ob2RlKFwiTmV3IFNwcml0ZVwiKTtcbiAqICB2YXIgc3ByaXRlID0gbm9kZS5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAqICBub2RlLnBhcmVudCA9IHRoaXMubm9kZTtcbiAqL1xudmFyIFNwcml0ZSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuU3ByaXRlJyxcbiAgICBleHRlbmRzOiBSZW5kZXJDb21wb25lbnQsXG4gICAgbWl4aW5zOiBbQmxlbmRGdW5jXSxcblxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5yZW5kZXJlcnMvU3ByaXRlJyxcbiAgICAgICAgaGVscDogJ2kxOG46Q09NUE9ORU5ULmhlbHBfdXJsLnNwcml0ZScsXG4gICAgICAgIGluc3BlY3RvcjogJ3BhY2thZ2VzOi8vaW5zcGVjdG9yL2luc3BlY3RvcnMvY29tcHMvc3ByaXRlLmpzJyxcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBfc3ByaXRlRnJhbWU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVGcmFtZVxuICAgICAgICB9LFxuICAgICAgICBfdHlwZTogU3ByaXRlVHlwZS5TSU1QTEUsXG4gICAgICAgIF9zaXplTW9kZTogU2l6ZU1vZGUuVFJJTU1FRCxcbiAgICAgICAgX2ZpbGxUeXBlOiAwLFxuICAgICAgICBfZmlsbENlbnRlcjogY2MudjIoMCwwKSxcbiAgICAgICAgX2ZpbGxTdGFydDogMCxcbiAgICAgICAgX2ZpbGxSYW5nZTogMCxcbiAgICAgICAgX2lzVHJpbW1lZE1vZGU6IHRydWUsXG4gICAgICAgIF9hdGxhczoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUF0bGFzLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zcHJpdGUuYXRsYXMnLFxuICAgICAgICAgICAgZWRpdG9yT25seTogdHJ1ZSxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBzcHJpdGUgZnJhbWUgb2YgdGhlIHNwcml0ZS5cbiAgICAgICAgICogISN6aCDnsr7ngbXnmoTnsr7ngbXluKdcbiAgICAgICAgICogQHByb3BlcnR5IHNwcml0ZUZyYW1lXG4gICAgICAgICAqIEB0eXBlIHtTcHJpdGVGcmFtZX1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogc3ByaXRlLnNwcml0ZUZyYW1lID0gbmV3U3ByaXRlRnJhbWU7XG4gICAgICAgICAqL1xuICAgICAgICBzcHJpdGVGcmFtZToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3ByaXRlRnJhbWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSwgZm9yY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgbGFzdFNwcml0ZSA9IHRoaXMuX3Nwcml0ZUZyYW1lO1xuICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmb3JjZSAmJiAoKGxhc3RTcHJpdGUgJiYgbGFzdFNwcml0ZS5fdXVpZCkgPT09ICh2YWx1ZSAmJiB2YWx1ZS5fdXVpZCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0U3ByaXRlID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX3Nwcml0ZUZyYW1lID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXBwbHlTcHJpdGVGcmFtZShsYXN0U3ByaXRlKTtcbiAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5lbWl0KCdzcHJpdGVmcmFtZS1jaGFuZ2VkJywgdGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUZyYW1lLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBzcHJpdGUgcmVuZGVyIHR5cGUuXG4gICAgICAgICAqICEjemgg57K+54G15riy5p+T57G75Z6LXG4gICAgICAgICAqIEBwcm9wZXJ0eSB0eXBlXG4gICAgICAgICAqIEB0eXBlIHtTcHJpdGUuVHlwZX1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogc3ByaXRlLnR5cGUgPSBjYy5TcHJpdGUuVHlwZS5TSU1QTEU7XG4gICAgICAgICAqL1xuICAgICAgICB0eXBlOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdHlwZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHlwZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFZlcnRzRGlydHkoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzZXRBc3NlbWJsZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogU3ByaXRlVHlwZSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zcHJpdGUudHlwZScsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIGZpbGwgdHlwZSwgVGhpcyB3aWxsIG9ubHkgaGF2ZSBhbnkgZWZmZWN0IGlmIHRoZSBcInR5cGVcIiBpcyBzZXQgdG8g4oCcY2MuU3ByaXRlLlR5cGUuRklMTEVE4oCdLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOeyvueBteWhq+WFheexu+Wei++8jOS7hea4suafk+exu+Wei+iuvue9ruS4uiBjYy5TcHJpdGUuVHlwZS5GSUxMRUQg5pe25pyJ5pWI44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBmaWxsVHlwZVxuICAgICAgICAgKiBAdHlwZSB7U3ByaXRlLkZpbGxUeXBlfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBzcHJpdGUuZmlsbFR5cGUgPSBjYy5TcHJpdGUuRmlsbFR5cGUuSE9SSVpPTlRBTDtcbiAgICAgICAgICovXG4gICAgICAgIGZpbGxUeXBlIDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZmlsbFR5cGU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fZmlsbFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmlsbFR5cGUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2V0QXNzZW1ibGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IEZpbGxUeXBlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zcHJpdGUuZmlsbF90eXBlJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBmaWxsIENlbnRlciwgVGhpcyB3aWxsIG9ubHkgaGF2ZSBhbnkgZWZmZWN0IGlmIHRoZSBcInR5cGVcIiBpcyBzZXQgdG8g4oCcY2MuU3ByaXRlLlR5cGUuRklMTEVE4oCdLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOWhq+WFheS4reW/g+eCue+8jOS7hea4suafk+exu+Wei+iuvue9ruS4uiBjYy5TcHJpdGUuVHlwZS5GSUxMRUQg5pe25pyJ5pWI44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBmaWxsQ2VudGVyXG4gICAgICAgICAqIEB0eXBlIHtWZWMyfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBzcHJpdGUuZmlsbENlbnRlciA9IG5ldyBjYy5WZWMyKDAsIDApO1xuICAgICAgICAgKi9cbiAgICAgICAgZmlsbENlbnRlcjoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZmlsbENlbnRlcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZmlsbENlbnRlci54ID0gdmFsdWUueDtcbiAgICAgICAgICAgICAgICB0aGlzLl9maWxsQ2VudGVyLnkgPSB2YWx1ZS55O1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90eXBlID09PSBTcHJpdGVUeXBlLkZJTExFRCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFZlcnRzRGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zcHJpdGUuZmlsbF9jZW50ZXInLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBmaWxsIFN0YXJ0LCBUaGlzIHdpbGwgb25seSBoYXZlIGFueSBlZmZlY3QgaWYgdGhlIFwidHlwZVwiIGlzIHNldCB0byDigJxjYy5TcHJpdGUuVHlwZS5GSUxMRUTigJ0uXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5aGr5YWF6LW35aeL54K577yM5LuF5riy5p+T57G75Z6L6K6+572u5Li6IGNjLlNwcml0ZS5UeXBlLkZJTExFRCDml7bmnInmlYjjgIJcbiAgICAgICAgICogQHByb3BlcnR5IGZpbGxTdGFydFxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiAvLyAtMSBUbyAxIGJldHdlZW4gdGhlIG51bWJlcnNcbiAgICAgICAgICogc3ByaXRlLmZpbGxTdGFydCA9IDAuNTtcbiAgICAgICAgICovXG4gICAgICAgIGZpbGxTdGFydDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZmlsbFN0YXJ0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9maWxsU3RhcnQgPSBtaXNjLmNsYW1wZih2YWx1ZSwgLTEsIDEpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90eXBlID09PSBTcHJpdGVUeXBlLkZJTExFRCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFZlcnRzRGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zcHJpdGUuZmlsbF9zdGFydCdcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgZmlsbCBSYW5nZSwgVGhpcyB3aWxsIG9ubHkgaGF2ZSBhbnkgZWZmZWN0IGlmIHRoZSBcInR5cGVcIiBpcyBzZXQgdG8g4oCcY2MuU3ByaXRlLlR5cGUuRklMTEVE4oCdLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOWhq+WFheiMg+WbtO+8jOS7hea4suafk+exu+Wei+iuvue9ruS4uiBjYy5TcHJpdGUuVHlwZS5GSUxMRUQg5pe25pyJ5pWI44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBmaWxsUmFuZ2VcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogLy8gLTEgVG8gMSBiZXR3ZWVuIHRoZSBudW1iZXJzXG4gICAgICAgICAqIHNwcml0ZS5maWxsUmFuZ2UgPSAxO1xuICAgICAgICAgKi9cbiAgICAgICAgZmlsbFJhbmdlOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9maWxsUmFuZ2U7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZpbGxSYW5nZSA9IG1pc2MuY2xhbXBmKHZhbHVlLCAtMSwgMSk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3R5cGUgPT09IFNwcml0ZVR5cGUuRklMTEVEKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNwcml0ZS5maWxsX3JhbmdlJ1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBzcGVjaWZ5IHRoZSBmcmFtZSBpcyB0cmltbWVkIG9yIG5vdC5cbiAgICAgICAgICogISN6aCDmmK/lkKbkvb/nlKjoo4HliarmqKHlvI9cbiAgICAgICAgICogQHByb3BlcnR5IHRyaW1cbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIHNwcml0ZS50cmltID0gdHJ1ZTtcbiAgICAgICAgICovXG4gICAgICAgIHRyaW06IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzVHJpbW1lZE1vZGU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pc1RyaW1tZWRNb2RlICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pc1RyaW1tZWRNb2RlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl90eXBlID09PSBTcHJpdGVUeXBlLlNJTVBMRSB8fCB0aGlzLl90eXBlID09PSBTcHJpdGVUeXBlLk1FU0gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zcHJpdGUudHJpbSdcbiAgICAgICAgfSxcblxuICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIHNwZWNpZnkgdGhlIHNpemUgdHJhY2luZyBtb2RlLlxuICAgICAgICAgKiAhI3poIOeyvueBteWwuuWvuOiwg+aVtOaooeW8j1xuICAgICAgICAgKiBAcHJvcGVydHkgc2l6ZU1vZGVcbiAgICAgICAgICogQHR5cGUge1Nwcml0ZS5TaXplTW9kZX1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogc3ByaXRlLnNpemVNb2RlID0gY2MuU3ByaXRlLlNpemVNb2RlLkNVU1RPTTtcbiAgICAgICAgICovXG4gICAgICAgIHNpemVNb2RlOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zaXplTW9kZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2l6ZU1vZGUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09IFNpemVNb2RlLkNVU1RPTSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hcHBseVNwcml0ZVNpemUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0eXBlOiBTaXplTW9kZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuc3ByaXRlLnNpemVfbW9kZSdcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIEZpbGxUeXBlOiBGaWxsVHlwZSxcbiAgICAgICAgVHlwZTogU3ByaXRlVHlwZSxcbiAgICAgICAgU2l6ZU1vZGU6IFNpemVNb2RlLFxuICAgICAgICBTdGF0ZTogU3RhdGUsXG4gICAgfSxcblxuICAgIHNldFZpc2libGUgKHZpc2libGUpIHtcbiAgICAgICAgdGhpcy5lbmFibGVkID0gdmlzaWJsZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlIHRoZSBzdGF0ZSBvZiBzcHJpdGUuXG4gICAgICogQG1ldGhvZCBzZXRTdGF0ZVxuICAgICAqIEBzZWUgYFNwcml0ZS5TdGF0ZWBcbiAgICAgKiBAcGFyYW0gc3RhdGUge1Nwcml0ZS5TdGF0ZX0gTk9STUFMIG9yIEdSQVkgU3RhdGUuXG4gICAgICogQGRlcHJlY2F0ZWRcbiAgICAgKi9cbiAgICBzZXRTdGF0ZSAoKSB7fSxcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGN1cnJlbnQgc3RhdGUuXG4gICAgICogQG1ldGhvZCBnZXRTdGF0ZVxuICAgICAqIEBzZWUgYFNwcml0ZS5TdGF0ZWBcbiAgICAgKiBAcmV0dXJuIHtTcHJpdGUuU3RhdGV9XG4gICAgICogQGRlcHJlY2F0ZWRcbiAgICAgKi9cbiAgICBnZXRTdGF0ZSAoKSB7fSxcblxuICAgIF9fcHJlbG9hZCAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIENDX0VESVRPUiAmJiB0aGlzLm5vZGUub24oTm9kZUV2ZW50LlNJWkVfQ0hBTkdFRCwgdGhpcy5fcmVzaXplZEluRWRpdG9yLCB0aGlzKTtcbiAgICAgICAgdGhpcy5fYXBwbHlTcHJpdGVGcmFtZSgpO1xuICAgIH0sXG5cbiAgICBvbkVuYWJsZSAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIHRoaXMuX3Nwcml0ZUZyYW1lICYmIHRoaXMuX3Nwcml0ZUZyYW1lLmVuc3VyZUxvYWRUZXh0dXJlKCk7XG5cbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgdGhpcy5zZXRWZXJ0c0RpcnR5LCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLkFOQ0hPUl9DSEFOR0VELCB0aGlzLnNldFZlcnRzRGlydHksIHRoaXMpO1xuICAgIH0sXG5cbiAgICBvbkRpc2FibGUgKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMuc2V0VmVydHNEaXJ0eSwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuQU5DSE9SX0NIQU5HRUQsIHRoaXMuc2V0VmVydHNEaXJ0eSwgdGhpcyk7XG4gICAgfSxcblxuICAgIF91cGRhdGVNYXRlcmlhbCAoKSB7XG4gICAgICAgIGxldCB0ZXh0dXJlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuX3Nwcml0ZUZyYW1lKSB7XG4gICAgICAgICAgICB0ZXh0dXJlID0gdGhpcy5fc3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBtYWtlIHN1cmUgbWF0ZXJpYWwgaXMgYmVsb25nIHRvIHNlbGYuXG4gICAgICAgIGxldCBtYXRlcmlhbCA9IHRoaXMuZ2V0TWF0ZXJpYWwoMCk7XG4gICAgICAgIGlmIChtYXRlcmlhbCkge1xuICAgICAgICAgICAgaWYgKG1hdGVyaWFsLmdldERlZmluZSgnVVNFX1RFWFRVUkUnKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwuZGVmaW5lKCdVU0VfVEVYVFVSRScsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1hdGVyaWFsLmdldFByb3BlcnR5KCd0ZXh0dXJlJykgIT09IHRleHR1cmUpIHtcbiAgICAgICAgICAgICAgICBtYXRlcmlhbC5zZXRQcm9wZXJ0eSgndGV4dHVyZScsIHRleHR1cmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgQmxlbmRGdW5jLnByb3RvdHlwZS5fdXBkYXRlTWF0ZXJpYWwuY2FsbCh0aGlzKTtcbiAgICB9LFxuXG4gICAgX2FwcGx5QXRsYXM6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoc3ByaXRlRnJhbWUpIHtcbiAgICAgICAgLy8gU2V0IGF0bGFzXG4gICAgICAgIGlmIChzcHJpdGVGcmFtZSAmJiBzcHJpdGVGcmFtZS5fYXRsYXNVdWlkKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBjYy5hc3NldE1hbmFnZXIubG9hZEFueShzcHJpdGVGcmFtZS5fYXRsYXNVdWlkLCBmdW5jdGlvbiAoZXJyLCBhc3NldCkge1xuICAgICAgICAgICAgICAgIHNlbGYuX2F0bGFzID0gYXNzZXQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2F0bGFzID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdmFsaWRhdGVSZW5kZXIgKCkge1xuICAgICAgICBsZXQgc3ByaXRlRnJhbWUgPSB0aGlzLl9zcHJpdGVGcmFtZTtcbiAgICAgICAgaWYgKHRoaXMuX21hdGVyaWFsc1swXSAmJlxuICAgICAgICAgICAgc3ByaXRlRnJhbWUgJiYgXG4gICAgICAgICAgICBzcHJpdGVGcmFtZS50ZXh0dXJlTG9hZGVkKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlzYWJsZVJlbmRlcigpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlTcHJpdGVTaXplICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zcHJpdGVGcmFtZSB8fCAhdGhpcy5pc1ZhbGlkKSAgcmV0dXJuO1xuICAgICAgICBcbiAgICAgICAgaWYgKFNpemVNb2RlLlJBVyA9PT0gdGhpcy5fc2l6ZU1vZGUpIHtcbiAgICAgICAgICAgIHZhciBzaXplID0gdGhpcy5fc3ByaXRlRnJhbWUuX29yaWdpbmFsU2l6ZTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5zZXRDb250ZW50U2l6ZShzaXplKTtcbiAgICAgICAgfSBlbHNlIGlmIChTaXplTW9kZS5UUklNTUVEID09PSB0aGlzLl9zaXplTW9kZSkge1xuICAgICAgICAgICAgdmFyIHJlY3QgPSB0aGlzLl9zcHJpdGVGcmFtZS5fcmVjdDtcbiAgICAgICAgICAgIHRoaXMubm9kZS5zZXRDb250ZW50U2l6ZShyZWN0LndpZHRoLCByZWN0LmhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlTcHJpdGVGcmFtZSAob2xkRnJhbWUpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQpICByZXR1cm47XG5cbiAgICAgICAgbGV0IG9sZFRleHR1cmUgPSBvbGRGcmFtZSAmJiBvbGRGcmFtZS5nZXRUZXh0dXJlKCk7XG4gICAgICAgIGlmIChvbGRUZXh0dXJlICYmICFvbGRUZXh0dXJlLmxvYWRlZCkge1xuICAgICAgICAgICAgb2xkRnJhbWUub2ZmKCdsb2FkJywgdGhpcy5fYXBwbHlTcHJpdGVTaXplLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3VwZGF0ZU1hdGVyaWFsKCk7XG4gICAgICAgIGxldCBzcHJpdGVGcmFtZSA9IHRoaXMuX3Nwcml0ZUZyYW1lO1xuICAgICAgICBpZiAoc3ByaXRlRnJhbWUpIHtcbiAgICAgICAgICAgIGxldCBuZXdUZXh0dXJlID0gc3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpO1xuICAgICAgICAgICAgaWYgKG5ld1RleHR1cmUgJiYgbmV3VGV4dHVyZS5sb2FkZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hcHBseVNwcml0ZVNpemUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzYWJsZVJlbmRlcigpO1xuICAgICAgICAgICAgICAgIHNwcml0ZUZyYW1lLm9uY2UoJ2xvYWQnLCB0aGlzLl9hcHBseVNwcml0ZVNpemUsIHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlUmVuZGVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAvLyBTZXQgYXRsYXNcbiAgICAgICAgICAgIHRoaXMuX2FwcGx5QXRsYXMoc3ByaXRlRnJhbWUpO1xuICAgICAgICB9XG4gICAgfSxcbn0pO1xuXG5pZiAoQ0NfRURJVE9SKSB7XG4gICAgU3ByaXRlLnByb3RvdHlwZS5fcmVzaXplZEluRWRpdG9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fc3ByaXRlRnJhbWUpIHtcbiAgICAgICAgICAgIHZhciBhY3R1YWxTaXplID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCk7XG4gICAgICAgICAgICB2YXIgZXhwZWN0ZWRXID0gYWN0dWFsU2l6ZS53aWR0aDtcbiAgICAgICAgICAgIHZhciBleHBlY3RlZEggPSBhY3R1YWxTaXplLmhlaWdodDtcbiAgICAgICAgICAgIGlmICh0aGlzLl9zaXplTW9kZSA9PT0gU2l6ZU1vZGUuUkFXKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNpemUgPSB0aGlzLl9zcHJpdGVGcmFtZS5nZXRPcmlnaW5hbFNpemUoKTtcbiAgICAgICAgICAgICAgICBleHBlY3RlZFcgPSBzaXplLndpZHRoO1xuICAgICAgICAgICAgICAgIGV4cGVjdGVkSCA9IHNpemUuaGVpZ2h0O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9zaXplTW9kZSA9PT0gU2l6ZU1vZGUuVFJJTU1FRCkge1xuICAgICAgICAgICAgICAgIHZhciByZWN0ID0gdGhpcy5fc3ByaXRlRnJhbWUuZ2V0UmVjdCgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdGVkVyA9IHJlY3Qud2lkdGg7XG4gICAgICAgICAgICAgICAgZXhwZWN0ZWRIID0gcmVjdC5oZWlnaHQ7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGV4cGVjdGVkVyAhPT0gYWN0dWFsU2l6ZS53aWR0aCB8fCBleHBlY3RlZEggIT09IGFjdHVhbFNpemUuaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2l6ZU1vZGUgPSBTaXplTW9kZS5DVVNUT007XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gb3ZlcnJpZGUgb25EZXN0cm95XG4gICAgU3ByaXRlLnByb3RvdHlwZS5fX3N1cGVyT25EZXN0cm95ID0gY2MuQ29tcG9uZW50LnByb3RvdHlwZS5vbkRlc3Ryb3k7XG4gICAgU3ByaXRlLnByb3RvdHlwZS5vbkRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9fc3VwZXJPbkRlc3Ryb3kpIHRoaXMuX19zdXBlck9uRGVzdHJveSgpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKE5vZGVFdmVudC5TSVpFX0NIQU5HRUQsIHRoaXMuX3Jlc2l6ZWRJbkVkaXRvciwgdGhpcyk7XG4gICAgfTtcbn1cblxuY2MuU3ByaXRlID0gbW9kdWxlLmV4cG9ydHMgPSBTcHJpdGU7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==