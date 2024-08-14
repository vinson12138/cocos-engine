
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
  MESH: 4,

  /**
   * !#en The simple+depth type.
   * !#zh 简单深度类型
   * @property {Number}
   */
  SIMPLE_DEPTH: 5
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvQ0NTcHJpdGUuanMiXSwibmFtZXMiOlsibWlzYyIsInJlcXVpcmUiLCJOb2RlRXZlbnQiLCJFdmVudFR5cGUiLCJSZW5kZXJDb21wb25lbnQiLCJCbGVuZEZ1bmMiLCJTcHJpdGVUeXBlIiwiY2MiLCJFbnVtIiwiU0lNUExFIiwiU0xJQ0VEIiwiVElMRUQiLCJGSUxMRUQiLCJNRVNIIiwiU0lNUExFX0RFUFRIIiwiRmlsbFR5cGUiLCJIT1JJWk9OVEFMIiwiVkVSVElDQUwiLCJSQURJQUwiLCJTaXplTW9kZSIsIkNVU1RPTSIsIlRSSU1NRUQiLCJSQVciLCJTdGF0ZSIsIk5PUk1BTCIsIkdSQVkiLCJTcHJpdGUiLCJDbGFzcyIsIm5hbWUiLCJtaXhpbnMiLCJlZGl0b3IiLCJDQ19FRElUT1IiLCJtZW51IiwiaGVscCIsImluc3BlY3RvciIsInByb3BlcnRpZXMiLCJfc3ByaXRlRnJhbWUiLCJ0eXBlIiwiU3ByaXRlRnJhbWUiLCJfdHlwZSIsIl9zaXplTW9kZSIsIl9maWxsVHlwZSIsIl9maWxsQ2VudGVyIiwidjIiLCJfZmlsbFN0YXJ0IiwiX2ZpbGxSYW5nZSIsIl9pc1RyaW1tZWRNb2RlIiwiX2F0bGFzIiwiU3ByaXRlQXRsYXMiLCJ0b29sdGlwIiwiQ0NfREVWIiwiZWRpdG9yT25seSIsInZpc2libGUiLCJhbmltYXRhYmxlIiwic3ByaXRlRnJhbWUiLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsImZvcmNlIiwibGFzdFNwcml0ZSIsIl91dWlkIiwiX2FwcGx5U3ByaXRlRnJhbWUiLCJub2RlIiwiZW1pdCIsInNldFZlcnRzRGlydHkiLCJfcmVzZXRBc3NlbWJsZXIiLCJmaWxsVHlwZSIsImZpbGxDZW50ZXIiLCJ4IiwieSIsImZpbGxTdGFydCIsImNsYW1wZiIsImZpbGxSYW5nZSIsInRyaW0iLCJzaXplTW9kZSIsIl9hcHBseVNwcml0ZVNpemUiLCJzdGF0aWNzIiwiVHlwZSIsInNldFZpc2libGUiLCJlbmFibGVkIiwic2V0U3RhdGUiLCJnZXRTdGF0ZSIsIl9fcHJlbG9hZCIsIl9zdXBlciIsIm9uIiwiU0laRV9DSEFOR0VEIiwiX3Jlc2l6ZWRJbkVkaXRvciIsIm9uRW5hYmxlIiwiZW5zdXJlTG9hZFRleHR1cmUiLCJOb2RlIiwiQU5DSE9SX0NIQU5HRUQiLCJvbkRpc2FibGUiLCJvZmYiLCJfdXBkYXRlTWF0ZXJpYWwiLCJ0ZXh0dXJlIiwiZ2V0VGV4dHVyZSIsIm1hdGVyaWFsIiwiZ2V0TWF0ZXJpYWwiLCJnZXREZWZpbmUiLCJ1bmRlZmluZWQiLCJkZWZpbmUiLCJnZXRQcm9wZXJ0eSIsInNldFByb3BlcnR5IiwicHJvdG90eXBlIiwiY2FsbCIsIl9hcHBseUF0bGFzIiwiX2F0bGFzVXVpZCIsInNlbGYiLCJhc3NldE1hbmFnZXIiLCJsb2FkQW55IiwiZXJyIiwiYXNzZXQiLCJfdmFsaWRhdGVSZW5kZXIiLCJfbWF0ZXJpYWxzIiwidGV4dHVyZUxvYWRlZCIsImRpc2FibGVSZW5kZXIiLCJpc1ZhbGlkIiwic2l6ZSIsIl9vcmlnaW5hbFNpemUiLCJzZXRDb250ZW50U2l6ZSIsInJlY3QiLCJfcmVjdCIsIndpZHRoIiwiaGVpZ2h0Iiwib2xkRnJhbWUiLCJvbGRUZXh0dXJlIiwibG9hZGVkIiwibmV3VGV4dHVyZSIsIm9uY2UiLCJhY3R1YWxTaXplIiwiZ2V0Q29udGVudFNpemUiLCJleHBlY3RlZFciLCJleHBlY3RlZEgiLCJnZXRPcmlnaW5hbFNpemUiLCJnZXRSZWN0IiwiX19zdXBlck9uRGVzdHJveSIsIkNvbXBvbmVudCIsIm9uRGVzdHJveSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLElBQUksR0FBR0MsT0FBTyxDQUFDLGVBQUQsQ0FBcEI7O0FBQ0EsSUFBTUMsU0FBUyxHQUFHRCxPQUFPLENBQUMsV0FBRCxDQUFQLENBQXFCRSxTQUF2Qzs7QUFDQSxJQUFNQyxlQUFlLEdBQUdILE9BQU8sQ0FBQyxxQkFBRCxDQUEvQjs7QUFDQSxJQUFNSSxTQUFTLEdBQUdKLE9BQU8sQ0FBQyxxQkFBRCxDQUF6QjtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQUlLLFVBQVUsR0FBR0MsRUFBRSxDQUFDQyxJQUFILENBQVE7QUFDckI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNJQyxFQUFBQSxNQUFNLEVBQUUsQ0FOYTs7QUFPckI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNJQyxFQUFBQSxNQUFNLEVBQUUsQ0FaYTs7QUFhckI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNJQyxFQUFBQSxLQUFLLEVBQUUsQ0FsQmM7O0FBbUJyQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLEVBQUFBLE1BQU0sRUFBRSxDQXhCYTs7QUF5QnJCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsSUFBSSxFQUFFLENBOUJlOztBQStCckI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNJQyxFQUFBQSxZQUFZLEVBQUU7QUFwQ08sQ0FBUixDQUFqQjtBQXVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQUlDLFFBQVEsR0FBR1IsRUFBRSxDQUFDQyxJQUFILENBQVE7QUFDbkI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNJUSxFQUFBQSxVQUFVLEVBQUUsQ0FOTzs7QUFPbkI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNJQyxFQUFBQSxRQUFRLEVBQUUsQ0FaUzs7QUFhbkI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNJQyxFQUFBQSxNQUFNLEVBQUU7QUFsQlcsQ0FBUixDQUFmO0FBcUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBSUMsUUFBUSxHQUFHWixFQUFFLENBQUNDLElBQUgsQ0FBUTtBQUNuQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0lZLEVBQUFBLE1BQU0sRUFBRSxDQU5XOztBQU9uQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLEVBQUFBLE9BQU8sRUFBRSxDQVpVOztBQWFuQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLEVBQUFBLEdBQUcsRUFBRTtBQWxCYyxDQUFSLENBQWY7QUFvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQUlDLEtBQUssR0FBR2hCLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQ2hCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSWdCLEVBQUFBLE1BQU0sRUFBRSxDQU5ROztBQU9oQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLEVBQUFBLElBQUksRUFBRTtBQVpVLENBQVIsQ0FBWjtBQWVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFJQyxNQUFNLEdBQUduQixFQUFFLENBQUNvQixLQUFILENBQVM7QUFDbEJDLEVBQUFBLElBQUksRUFBRSxXQURZO0FBRWxCLGFBQVN4QixlQUZTO0FBR2xCeUIsRUFBQUEsTUFBTSxFQUFFLENBQUN4QixTQUFELENBSFU7QUFLbEJ5QixFQUFBQSxNQUFNLEVBQUVDLFNBQVMsSUFBSTtBQUNqQkMsSUFBQUEsSUFBSSxFQUFFLDJDQURXO0FBRWpCQyxJQUFBQSxJQUFJLEVBQUUsZ0NBRlc7QUFHakJDLElBQUFBLFNBQVMsRUFBRTtBQUhNLEdBTEg7QUFXbEJDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxZQUFZLEVBQUU7QUFDVixpQkFBUyxJQURDO0FBRVZDLE1BQUFBLElBQUksRUFBRTlCLEVBQUUsQ0FBQytCO0FBRkMsS0FETjtBQUtSQyxJQUFBQSxLQUFLLEVBQUVqQyxVQUFVLENBQUNHLE1BTFY7QUFNUitCLElBQUFBLFNBQVMsRUFBRXJCLFFBQVEsQ0FBQ0UsT0FOWjtBQU9Sb0IsSUFBQUEsU0FBUyxFQUFFLENBUEg7QUFRUkMsSUFBQUEsV0FBVyxFQUFFbkMsRUFBRSxDQUFDb0MsRUFBSCxDQUFNLENBQU4sRUFBUyxDQUFULENBUkw7QUFTUkMsSUFBQUEsVUFBVSxFQUFFLENBVEo7QUFVUkMsSUFBQUEsVUFBVSxFQUFFLENBVko7QUFXUkMsSUFBQUEsY0FBYyxFQUFFLElBWFI7QUFZUkMsSUFBQUEsTUFBTSxFQUFFO0FBQ0osaUJBQVMsSUFETDtBQUVKVixNQUFBQSxJQUFJLEVBQUU5QixFQUFFLENBQUN5QyxXQUZMO0FBR0pDLE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxJQUFJLDZCQUhmO0FBSUpDLE1BQUFBLFVBQVUsRUFBRSxJQUpSO0FBS0pDLE1BQUFBLE9BQU8sRUFBRSxJQUxMO0FBTUpDLE1BQUFBLFVBQVUsRUFBRTtBQU5SLEtBWkE7O0FBcUJSO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDUUMsSUFBQUEsV0FBVyxFQUFFO0FBQ1RDLE1BQUFBLEdBRFMsaUJBQ0g7QUFDRixlQUFPLEtBQUtuQixZQUFaO0FBQ0gsT0FIUTtBQUlUb0IsTUFBQUEsR0FKUyxlQUlMQyxLQUpLLEVBSUVDLEtBSkYsRUFJUztBQUNkLFlBQUlDLFVBQVUsR0FBRyxLQUFLdkIsWUFBdEI7O0FBQ0EsWUFBSUwsU0FBSixFQUFlO0FBQ1gsY0FBSSxDQUFDMkIsS0FBRCxJQUFXLENBQUNDLFVBQVUsSUFBSUEsVUFBVSxDQUFDQyxLQUExQixPQUFzQ0gsS0FBSyxJQUFJQSxLQUFLLENBQUNHLEtBQXJELENBQWYsRUFBNkU7QUFDekU7QUFDSDtBQUNKLFNBSkQsTUFLSztBQUNELGNBQUlELFVBQVUsS0FBS0YsS0FBbkIsRUFBMEI7QUFDdEI7QUFDSDtBQUNKOztBQUNELGFBQUtyQixZQUFMLEdBQW9CcUIsS0FBcEI7O0FBQ0EsYUFBS0ksaUJBQUwsQ0FBdUJGLFVBQXZCOztBQUNBLFlBQUk1QixTQUFKLEVBQWU7QUFDWCxlQUFLK0IsSUFBTCxDQUFVQyxJQUFWLENBQWUscUJBQWYsRUFBc0MsSUFBdEM7QUFDSDtBQUNKLE9BckJRO0FBc0JUMUIsTUFBQUEsSUFBSSxFQUFFOUIsRUFBRSxDQUFDK0I7QUF0QkEsS0E3Qkw7O0FBc0RSO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDUUQsSUFBQUEsSUFBSSxFQUFFO0FBQ0ZrQixNQUFBQSxHQURFLGlCQUNJO0FBQ0YsZUFBTyxLQUFLaEIsS0FBWjtBQUNILE9BSEM7QUFJRmlCLE1BQUFBLEdBSkUsZUFJRUMsS0FKRixFQUlTO0FBQ1AsWUFBSSxLQUFLbEIsS0FBTCxLQUFla0IsS0FBbkIsRUFBMEI7QUFDdEIsZUFBS2xCLEtBQUwsR0FBYWtCLEtBQWI7QUFDQSxlQUFLTyxhQUFMOztBQUNBLGVBQUtDLGVBQUw7QUFDSDtBQUNKLE9BVkM7QUFXRjVCLE1BQUFBLElBQUksRUFBRS9CLFVBWEo7QUFZRitDLE1BQUFBLFVBQVUsRUFBRSxLQVpWO0FBYUZKLE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxJQUFJO0FBYmpCLEtBOURFOztBQThFUjtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNRZ0IsSUFBQUEsUUFBUSxFQUFFO0FBQ05YLE1BQUFBLEdBRE0saUJBQ0E7QUFDRixlQUFPLEtBQUtkLFNBQVo7QUFDSCxPQUhLO0FBSU5lLE1BQUFBLEdBSk0sZUFJRkMsS0FKRSxFQUlLO0FBQ1AsWUFBSUEsS0FBSyxLQUFLLEtBQUtoQixTQUFuQixFQUE4QjtBQUMxQixlQUFLQSxTQUFMLEdBQWlCZ0IsS0FBakI7QUFDQSxlQUFLTyxhQUFMOztBQUNBLGVBQUtDLGVBQUw7QUFDSDtBQUNKLE9BVks7QUFXTjVCLE1BQUFBLElBQUksRUFBRXRCLFFBWEE7QUFZTmtDLE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxJQUFJO0FBWmIsS0F4RkY7O0FBdUdSO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1FpQixJQUFBQSxVQUFVLEVBQUU7QUFDUlosTUFBQUEsR0FEUSxpQkFDRjtBQUNGLGVBQU8sS0FBS2IsV0FBWjtBQUNILE9BSE87QUFJUmMsTUFBQUEsR0FKUSxlQUlKQyxLQUpJLEVBSUc7QUFDUCxhQUFLZixXQUFMLENBQWlCMEIsQ0FBakIsR0FBcUJYLEtBQUssQ0FBQ1csQ0FBM0I7QUFDQSxhQUFLMUIsV0FBTCxDQUFpQjJCLENBQWpCLEdBQXFCWixLQUFLLENBQUNZLENBQTNCOztBQUNBLFlBQUksS0FBSzlCLEtBQUwsS0FBZWpDLFVBQVUsQ0FBQ00sTUFBOUIsRUFBc0M7QUFDbEMsZUFBS29ELGFBQUw7QUFDSDtBQUNKLE9BVk87QUFXUmYsTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUk7QUFYWCxLQWpISjs7QUErSFI7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNRb0IsSUFBQUEsU0FBUyxFQUFFO0FBQ1BmLE1BQUFBLEdBRE8saUJBQ0Q7QUFDRixlQUFPLEtBQUtYLFVBQVo7QUFDSCxPQUhNO0FBSVBZLE1BQUFBLEdBSk8sZUFJSEMsS0FKRyxFQUlJO0FBQ1AsYUFBS2IsVUFBTCxHQUFrQjVDLElBQUksQ0FBQ3VFLE1BQUwsQ0FBWWQsS0FBWixFQUFtQixDQUFDLENBQXBCLEVBQXVCLENBQXZCLENBQWxCOztBQUNBLFlBQUksS0FBS2xCLEtBQUwsS0FBZWpDLFVBQVUsQ0FBQ00sTUFBOUIsRUFBc0M7QUFDbEMsZUFBS29ELGFBQUw7QUFDSDtBQUNKLE9BVE07QUFVUGYsTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUk7QUFWWixLQTFJSDs7QUF1SlI7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNRc0IsSUFBQUEsU0FBUyxFQUFFO0FBQ1BqQixNQUFBQSxHQURPLGlCQUNEO0FBQ0YsZUFBTyxLQUFLVixVQUFaO0FBQ0gsT0FITTtBQUlQVyxNQUFBQSxHQUpPLGVBSUhDLEtBSkcsRUFJSTtBQUNQLGFBQUtaLFVBQUwsR0FBa0I3QyxJQUFJLENBQUN1RSxNQUFMLENBQVlkLEtBQVosRUFBbUIsQ0FBQyxDQUFwQixFQUF1QixDQUF2QixDQUFsQjs7QUFDQSxZQUFJLEtBQUtsQixLQUFMLEtBQWVqQyxVQUFVLENBQUNNLE1BQTlCLEVBQXNDO0FBQ2xDLGVBQUtvRCxhQUFMO0FBQ0g7QUFDSixPQVRNO0FBVVBmLE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxJQUFJO0FBVlosS0FsS0g7O0FBOEtSO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDUXVCLElBQUFBLElBQUksRUFBRTtBQUNGbEIsTUFBQUEsR0FERSxpQkFDSTtBQUNGLGVBQU8sS0FBS1QsY0FBWjtBQUNILE9BSEM7QUFJRlUsTUFBQUEsR0FKRSxlQUlFQyxLQUpGLEVBSVM7QUFDUCxZQUFJLEtBQUtYLGNBQUwsS0FBd0JXLEtBQTVCLEVBQW1DO0FBQy9CLGVBQUtYLGNBQUwsR0FBc0JXLEtBQXRCOztBQUNBLGNBQUksS0FBS2xCLEtBQUwsS0FBZWpDLFVBQVUsQ0FBQ0csTUFBMUIsSUFBb0MsS0FBSzhCLEtBQUwsS0FBZWpDLFVBQVUsQ0FBQ08sSUFBbEUsRUFBd0U7QUFDcEUsaUJBQUttRCxhQUFMO0FBQ0g7QUFDSjtBQUNKLE9BWEM7QUFZRlgsTUFBQUEsVUFBVSxFQUFFLEtBWlY7QUFhRkosTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUk7QUFiakIsS0F0TEU7O0FBdU1SO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDUXdCLElBQUFBLFFBQVEsRUFBRTtBQUNObkIsTUFBQUEsR0FETSxpQkFDQTtBQUNGLGVBQU8sS0FBS2YsU0FBWjtBQUNILE9BSEs7QUFJTmdCLE1BQUFBLEdBSk0sZUFJRkMsS0FKRSxFQUlLO0FBQ1AsYUFBS2pCLFNBQUwsR0FBaUJpQixLQUFqQjs7QUFDQSxZQUFJQSxLQUFLLEtBQUt0QyxRQUFRLENBQUNDLE1BQXZCLEVBQStCO0FBQzNCLGVBQUt1RCxnQkFBTDtBQUNIO0FBQ0osT0FUSztBQVVOdEIsTUFBQUEsVUFBVSxFQUFFLEtBVk47QUFXTmhCLE1BQUFBLElBQUksRUFBRWxCLFFBWEE7QUFZTjhCLE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxJQUFJO0FBWmI7QUEvTUYsR0FYTTtBQTBPbEIwQixFQUFBQSxPQUFPLEVBQUU7QUFDTDdELElBQUFBLFFBQVEsRUFBRUEsUUFETDtBQUVMOEQsSUFBQUEsSUFBSSxFQUFFdkUsVUFGRDtBQUdMYSxJQUFBQSxRQUFRLEVBQUVBLFFBSEw7QUFJTEksSUFBQUEsS0FBSyxFQUFFQTtBQUpGLEdBMU9TO0FBaVBsQnVELEVBQUFBLFVBalBrQixzQkFpUFAxQixPQWpQTyxFQWlQRTtBQUNoQixTQUFLMkIsT0FBTCxHQUFlM0IsT0FBZjtBQUNILEdBblBpQjs7QUFxUGxCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k0QixFQUFBQSxRQTVQa0Isc0JBNFBQLENBQUcsQ0E1UEk7O0FBOFBsQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJQyxFQUFBQSxRQXJRa0Isc0JBcVFQLENBQUcsQ0FyUUk7QUF1UWxCQyxFQUFBQSxTQXZRa0IsdUJBdVFOO0FBQ1IsU0FBS0MsTUFBTDs7QUFDQXBELElBQUFBLFNBQVMsSUFBSSxLQUFLK0IsSUFBTCxDQUFVc0IsRUFBVixDQUFhbEYsU0FBUyxDQUFDbUYsWUFBdkIsRUFBcUMsS0FBS0MsZ0JBQTFDLEVBQTRELElBQTVELENBQWI7O0FBQ0EsU0FBS3pCLGlCQUFMO0FBQ0gsR0EzUWlCO0FBNlFsQjBCLEVBQUFBLFFBN1FrQixzQkE2UVA7QUFDUCxTQUFLSixNQUFMOztBQUNBLFNBQUsvQyxZQUFMLElBQXFCLEtBQUtBLFlBQUwsQ0FBa0JvRCxpQkFBbEIsRUFBckI7QUFFQSxTQUFLMUIsSUFBTCxDQUFVc0IsRUFBVixDQUFhN0UsRUFBRSxDQUFDa0YsSUFBSCxDQUFRdEYsU0FBUixDQUFrQmtGLFlBQS9CLEVBQTZDLEtBQUtyQixhQUFsRCxFQUFpRSxJQUFqRTtBQUNBLFNBQUtGLElBQUwsQ0FBVXNCLEVBQVYsQ0FBYTdFLEVBQUUsQ0FBQ2tGLElBQUgsQ0FBUXRGLFNBQVIsQ0FBa0J1RixjQUEvQixFQUErQyxLQUFLMUIsYUFBcEQsRUFBbUUsSUFBbkU7QUFDSCxHQW5SaUI7QUFxUmxCMkIsRUFBQUEsU0FyUmtCLHVCQXFSTjtBQUNSLFNBQUtSLE1BQUw7O0FBRUEsU0FBS3JCLElBQUwsQ0FBVThCLEdBQVYsQ0FBY3JGLEVBQUUsQ0FBQ2tGLElBQUgsQ0FBUXRGLFNBQVIsQ0FBa0JrRixZQUFoQyxFQUE4QyxLQUFLckIsYUFBbkQsRUFBa0UsSUFBbEU7QUFDQSxTQUFLRixJQUFMLENBQVU4QixHQUFWLENBQWNyRixFQUFFLENBQUNrRixJQUFILENBQVF0RixTQUFSLENBQWtCdUYsY0FBaEMsRUFBZ0QsS0FBSzFCLGFBQXJELEVBQW9FLElBQXBFO0FBQ0gsR0ExUmlCO0FBNFJsQjZCLEVBQUFBLGVBNVJrQiw2QkE0UkE7QUFDZCxRQUFJQyxPQUFPLEdBQUcsSUFBZDs7QUFFQSxRQUFJLEtBQUsxRCxZQUFULEVBQXVCO0FBQ25CMEQsTUFBQUEsT0FBTyxHQUFHLEtBQUsxRCxZQUFMLENBQWtCMkQsVUFBbEIsRUFBVjtBQUNILEtBTGEsQ0FPZDs7O0FBQ0EsUUFBSUMsUUFBUSxHQUFHLEtBQUtDLFdBQUwsQ0FBaUIsQ0FBakIsQ0FBZjs7QUFDQSxRQUFJRCxRQUFKLEVBQWM7QUFDVixVQUFJQSxRQUFRLENBQUNFLFNBQVQsQ0FBbUIsYUFBbkIsTUFBc0NDLFNBQTFDLEVBQXFEO0FBQ2pESCxRQUFBQSxRQUFRLENBQUNJLE1BQVQsQ0FBZ0IsYUFBaEIsRUFBK0IsSUFBL0I7QUFDSDs7QUFDRCxVQUFJSixRQUFRLENBQUNLLFdBQVQsQ0FBcUIsU0FBckIsTUFBb0NQLE9BQXhDLEVBQWlEO0FBQzdDRSxRQUFBQSxRQUFRLENBQUNNLFdBQVQsQ0FBcUIsU0FBckIsRUFBZ0NSLE9BQWhDO0FBQ0g7QUFDSjs7QUFFRHpGLElBQUFBLFNBQVMsQ0FBQ2tHLFNBQVYsQ0FBb0JWLGVBQXBCLENBQW9DVyxJQUFwQyxDQUF5QyxJQUF6QztBQUNILEdBL1NpQjtBQWlUbEJDLEVBQUFBLFdBQVcsRUFBRTFFLFNBQVMsSUFBSSxVQUFVdUIsV0FBVixFQUF1QjtBQUM3QztBQUNBLFFBQUlBLFdBQVcsSUFBSUEsV0FBVyxDQUFDb0QsVUFBL0IsRUFBMkM7QUFDdkMsVUFBSUMsSUFBSSxHQUFHLElBQVg7QUFDQXBHLE1BQUFBLEVBQUUsQ0FBQ3FHLFlBQUgsQ0FBZ0JDLE9BQWhCLENBQXdCdkQsV0FBVyxDQUFDb0QsVUFBcEMsRUFBZ0QsVUFBVUksR0FBVixFQUFlQyxLQUFmLEVBQXNCO0FBQ2xFSixRQUFBQSxJQUFJLENBQUM1RCxNQUFMLEdBQWNnRSxLQUFkO0FBQ0gsT0FGRDtBQUdILEtBTEQsTUFLTztBQUNILFdBQUtoRSxNQUFMLEdBQWMsSUFBZDtBQUNIO0FBQ0osR0EzVGlCO0FBNlRsQmlFLEVBQUFBLGVBN1RrQiw2QkE2VEE7QUFDZCxRQUFJMUQsV0FBVyxHQUFHLEtBQUtsQixZQUF2Qjs7QUFDQSxRQUFJLEtBQUs2RSxVQUFMLENBQWdCLENBQWhCLEtBQ0EzRCxXQURBLElBRUFBLFdBQVcsQ0FBQzRELGFBQVosRUFGSixFQUVpQztBQUM3QjtBQUNIOztBQUVELFNBQUtDLGFBQUw7QUFDSCxHQXRVaUI7QUF3VWxCeEMsRUFBQUEsZ0JBeFVrQiw4QkF3VUM7QUFDZixRQUFJLENBQUMsS0FBS3ZDLFlBQU4sSUFBc0IsQ0FBQyxLQUFLZ0YsT0FBaEMsRUFBeUM7O0FBRXpDLFFBQUlqRyxRQUFRLENBQUNHLEdBQVQsS0FBaUIsS0FBS2tCLFNBQTFCLEVBQXFDO0FBQ2pDLFVBQUk2RSxJQUFJLEdBQUcsS0FBS2pGLFlBQUwsQ0FBa0JrRixhQUE3QjtBQUNBLFdBQUt4RCxJQUFMLENBQVV5RCxjQUFWLENBQXlCRixJQUF6QjtBQUNILEtBSEQsTUFHTyxJQUFJbEcsUUFBUSxDQUFDRSxPQUFULEtBQXFCLEtBQUttQixTQUE5QixFQUF5QztBQUM1QyxVQUFJZ0YsSUFBSSxHQUFHLEtBQUtwRixZQUFMLENBQWtCcUYsS0FBN0I7QUFDQSxXQUFLM0QsSUFBTCxDQUFVeUQsY0FBVixDQUF5QkMsSUFBSSxDQUFDRSxLQUE5QixFQUFxQ0YsSUFBSSxDQUFDRyxNQUExQztBQUNIOztBQUVELFNBQUszRCxhQUFMO0FBQ0gsR0FwVmlCO0FBc1ZsQkgsRUFBQUEsaUJBdFZrQiw2QkFzVkErRCxRQXRWQSxFQXNWVTtBQUN4QixRQUFJLENBQUMsS0FBS1IsT0FBVixFQUFtQjtBQUVuQixRQUFJUyxVQUFVLEdBQUdELFFBQVEsSUFBSUEsUUFBUSxDQUFDN0IsVUFBVCxFQUE3Qjs7QUFDQSxRQUFJOEIsVUFBVSxJQUFJLENBQUNBLFVBQVUsQ0FBQ0MsTUFBOUIsRUFBc0M7QUFDbENGLE1BQUFBLFFBQVEsQ0FBQ2hDLEdBQVQsQ0FBYSxNQUFiLEVBQXFCLEtBQUtqQixnQkFBMUIsRUFBNEMsSUFBNUM7QUFDSDs7QUFFRCxTQUFLa0IsZUFBTDs7QUFDQSxRQUFJdkMsV0FBVyxHQUFHLEtBQUtsQixZQUF2Qjs7QUFDQSxRQUFJa0IsV0FBSixFQUFpQjtBQUNiLFVBQUl5RSxVQUFVLEdBQUd6RSxXQUFXLENBQUN5QyxVQUFaLEVBQWpCOztBQUNBLFVBQUlnQyxVQUFVLElBQUlBLFVBQVUsQ0FBQ0QsTUFBN0IsRUFBcUM7QUFDakMsYUFBS25ELGdCQUFMO0FBQ0gsT0FGRCxNQUdLO0FBQ0QsYUFBS3dDLGFBQUw7QUFDQTdELFFBQUFBLFdBQVcsQ0FBQzBFLElBQVosQ0FBaUIsTUFBakIsRUFBeUIsS0FBS3JELGdCQUE5QixFQUFnRCxJQUFoRDtBQUNIO0FBQ0osS0FURCxNQVVLO0FBQ0QsV0FBS3dDLGFBQUw7QUFDSDs7QUFFRCxRQUFJcEYsU0FBSixFQUFlO0FBQ1g7QUFDQSxXQUFLMEUsV0FBTCxDQUFpQm5ELFdBQWpCO0FBQ0g7QUFDSjtBQWxYaUIsQ0FBVCxDQUFiOztBQXFYQSxJQUFJdkIsU0FBSixFQUFlO0FBQ1hMLEVBQUFBLE1BQU0sQ0FBQzZFLFNBQVAsQ0FBaUJqQixnQkFBakIsR0FBb0MsWUFBWTtBQUM1QyxRQUFJLEtBQUtsRCxZQUFULEVBQXVCO0FBQ25CLFVBQUk2RixVQUFVLEdBQUcsS0FBS25FLElBQUwsQ0FBVW9FLGNBQVYsRUFBakI7QUFDQSxVQUFJQyxTQUFTLEdBQUdGLFVBQVUsQ0FBQ1AsS0FBM0I7QUFDQSxVQUFJVSxTQUFTLEdBQUdILFVBQVUsQ0FBQ04sTUFBM0I7O0FBQ0EsVUFBSSxLQUFLbkYsU0FBTCxLQUFtQnJCLFFBQVEsQ0FBQ0csR0FBaEMsRUFBcUM7QUFDakMsWUFBSStGLElBQUksR0FBRyxLQUFLakYsWUFBTCxDQUFrQmlHLGVBQWxCLEVBQVg7O0FBQ0FGLFFBQUFBLFNBQVMsR0FBR2QsSUFBSSxDQUFDSyxLQUFqQjtBQUNBVSxRQUFBQSxTQUFTLEdBQUdmLElBQUksQ0FBQ00sTUFBakI7QUFDSCxPQUpELE1BSU8sSUFBSSxLQUFLbkYsU0FBTCxLQUFtQnJCLFFBQVEsQ0FBQ0UsT0FBaEMsRUFBeUM7QUFDNUMsWUFBSW1HLElBQUksR0FBRyxLQUFLcEYsWUFBTCxDQUFrQmtHLE9BQWxCLEVBQVg7O0FBQ0FILFFBQUFBLFNBQVMsR0FBR1gsSUFBSSxDQUFDRSxLQUFqQjtBQUNBVSxRQUFBQSxTQUFTLEdBQUdaLElBQUksQ0FBQ0csTUFBakI7QUFFSDs7QUFFRCxVQUFJUSxTQUFTLEtBQUtGLFVBQVUsQ0FBQ1AsS0FBekIsSUFBa0NVLFNBQVMsS0FBS0gsVUFBVSxDQUFDTixNQUEvRCxFQUF1RTtBQUNuRSxhQUFLbkYsU0FBTCxHQUFpQnJCLFFBQVEsQ0FBQ0MsTUFBMUI7QUFDSDtBQUNKO0FBQ0osR0FwQkQsQ0FEVyxDQXVCWDs7O0FBQ0FNLEVBQUFBLE1BQU0sQ0FBQzZFLFNBQVAsQ0FBaUJnQyxnQkFBakIsR0FBb0NoSSxFQUFFLENBQUNpSSxTQUFILENBQWFqQyxTQUFiLENBQXVCa0MsU0FBM0Q7O0FBQ0EvRyxFQUFBQSxNQUFNLENBQUM2RSxTQUFQLENBQWlCa0MsU0FBakIsR0FBNkIsWUFBWTtBQUNyQyxRQUFJLEtBQUtGLGdCQUFULEVBQTJCLEtBQUtBLGdCQUFMO0FBQzNCLFNBQUt6RSxJQUFMLENBQVU4QixHQUFWLENBQWMxRixTQUFTLENBQUNtRixZQUF4QixFQUFzQyxLQUFLQyxnQkFBM0MsRUFBNkQsSUFBN0Q7QUFDSCxHQUhEO0FBSUg7O0FBRUQvRSxFQUFFLENBQUNtQixNQUFILEdBQVlnSCxNQUFNLENBQUNDLE9BQVAsR0FBaUJqSCxNQUE3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3QgbWlzYyA9IHJlcXVpcmUoJy4uL3V0aWxzL21pc2MnKTtcbmNvbnN0IE5vZGVFdmVudCA9IHJlcXVpcmUoJy4uL0NDTm9kZScpLkV2ZW50VHlwZTtcbmNvbnN0IFJlbmRlckNvbXBvbmVudCA9IHJlcXVpcmUoJy4vQ0NSZW5kZXJDb21wb25lbnQnKTtcbmNvbnN0IEJsZW5kRnVuYyA9IHJlcXVpcmUoJy4uL3V0aWxzL2JsZW5kLWZ1bmMnKTtcblxuXG4vKipcbiAqICEjZW4gRW51bSBmb3Igc3ByaXRlIHR5cGUuXG4gKiAhI3poIFNwcml0ZSDnsbvlnotcbiAqIEBlbnVtIFNwcml0ZS5UeXBlXG4gKi9cbnZhciBTcHJpdGVUeXBlID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgc2ltcGxlIHR5cGUuXG4gICAgICogISN6aCDmma7pgJrnsbvlnotcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU0lNUExFXG4gICAgICovXG4gICAgU0lNUExFOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHNsaWNlZCB0eXBlLlxuICAgICAqICEjemgg5YiH54mH77yI5Lmd5a6r5qC877yJ57G75Z6LXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFNMSUNFRFxuICAgICAqL1xuICAgIFNMSUNFRDogMSxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSB0aWxlZCB0eXBlLlxuICAgICAqICEjemgg5bmz6ZO657G75Z6LXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFRJTEVEXG4gICAgICovXG4gICAgVElMRUQ6IDIsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZmlsbGVkIHR5cGUuXG4gICAgICogISN6aCDloavlhYXnsbvlnotcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gRklMTEVEXG4gICAgICovXG4gICAgRklMTEVEOiAzLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG1lc2ggdHlwZS5cbiAgICAgKiAhI3poIOS7pSBNZXNoIOS4ieinkuW9oue7hOaIkOeahOexu+Wei1xuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBNRVNIXG4gICAgICovXG4gICAgTUVTSDogNCxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBzaW1wbGUrZGVwdGggdHlwZS5cbiAgICAgKiAhI3poIOeugOWNlea3seW6puexu+Wei1xuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFNJTVBMRV9ERVBUSDogNSxcbn0pO1xuXG4vKipcbiAqICEjZW4gRW51bSBmb3IgZmlsbCB0eXBlLlxuICogISN6aCDloavlhYXnsbvlnotcbiAqIEBlbnVtIFNwcml0ZS5GaWxsVHlwZVxuICovXG52YXIgRmlsbFR5cGUgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBob3Jpem9udGFsIGZpbGwuXG4gICAgICogISN6aCDmsLTlubPmlrnlkJHloavlhYVcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gSE9SSVpPTlRBTFxuICAgICAqL1xuICAgIEhPUklaT05UQUw6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgdmVydGljYWwgZmlsbC5cbiAgICAgKiAhI3poIOWeguebtOaWueWQkeWhq+WFhVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBWRVJUSUNBTFxuICAgICAqL1xuICAgIFZFUlRJQ0FMOiAxLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHJhZGlhbCBmaWxsLlxuICAgICAqICEjemgg5b6E5ZCR5aGr5YWFXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFJBRElBTFxuICAgICAqL1xuICAgIFJBRElBTDogMixcbn0pO1xuXG4vKipcbiAqICEjZW4gU3ByaXRlIFNpemUgY2FuIHRyYWNrIHRyaW1tZWQgc2l6ZSwgcmF3IHNpemUgb3Igbm9uZS5cbiAqICEjemgg57K+54G15bC65a+46LCD5pW05qih5byPXG4gKiBAZW51bSBTcHJpdGUuU2l6ZU1vZGVcbiAqL1xudmFyIFNpemVNb2RlID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBVc2UgdGhlIGN1c3RvbWl6ZWQgbm9kZSBzaXplLlxuICAgICAqICEjemgg5L2/55So6IqC54K56aKE6K6+55qE5bC65a+4XG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IENVU1RPTVxuICAgICAqL1xuICAgIENVU1RPTTogMCxcbiAgICAvKipcbiAgICAgKiAhI2VuIE1hdGNoIHRoZSB0cmltbWVkIHNpemUgb2YgdGhlIHNwcml0ZSBmcmFtZSBhdXRvbWF0aWNhbGx5LlxuICAgICAqICEjemgg6Ieq5Yqo6YCC6YWN5Li657K+54G16KOB5Ymq5ZCO55qE5bC65a+4XG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFRSSU1NRURcbiAgICAgKi9cbiAgICBUUklNTUVEOiAxLFxuICAgIC8qKlxuICAgICAqICEjZW4gTWF0Y2ggdGhlIHJhdyBzaXplIG9mIHRoZSBzcHJpdGUgZnJhbWUgYXV0b21hdGljYWxseS5cbiAgICAgKiAhI3poIOiHquWKqOmAgumFjeS4uueyvueBteWOn+WbvuWwuuWvuFxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBSQVdcbiAgICAgKi9cbiAgICBSQVc6IDJcbn0pO1xuLyoqXG4gKiAhI2VuIFNwcml0ZSBzdGF0ZSBjYW4gY2hvaWNlIHRoZSBub3JtYWwgb3IgZ3JheXNjYWxlLlxuICogISN6aCDnsr7ngbXpopzoibLpgJrpgZPmqKHlvI/jgIJcbiAqIEBlbnVtIFNwcml0ZS5TdGF0ZVxuICogQGRlcHJlY2F0ZWRcbiAqL1xudmFyIFN0YXRlID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbm9ybWFsIHN0YXRlXG4gICAgICogISN6aCDmraPluLjnirbmgIFcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gTk9STUFMXG4gICAgICovXG4gICAgTk9STUFMOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGdyYXkgc3RhdGUsIGFsbCBjb2xvciB3aWxsIGJlIG1vZGlmaWVkIHRvIGdyYXlzY2FsZSB2YWx1ZS5cbiAgICAgKiAhI3poIOeBsOiJsueKtuaAge+8jOaJgOacieminOiJsuS8muiiq+i9rOaNouaIkOeBsOW6puWAvFxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBHUkFZXG4gICAgICovXG4gICAgR1JBWTogMVxufSk7XG5cbi8qKlxuICogISNlbiBSZW5kZXJzIGEgc3ByaXRlIGluIHRoZSBzY2VuZS5cbiAqICEjemgg6K+l57uE5Lu255So5LqO5Zyo5Zy65pmv5Lit5riy5p+T57K+54G144CCXG4gKiBAY2xhc3MgU3ByaXRlXG4gKiBAZXh0ZW5kcyBSZW5kZXJDb21wb25lbnRcbiAqIEB1c2VzIEJsZW5kRnVuY1xuICogQGV4YW1wbGVcbiAqICAvLyBDcmVhdGUgYSBuZXcgbm9kZSBhbmQgYWRkIHNwcml0ZSBjb21wb25lbnRzLlxuICogIHZhciBub2RlID0gbmV3IGNjLk5vZGUoXCJOZXcgU3ByaXRlXCIpO1xuICogIHZhciBzcHJpdGUgPSBub2RlLmFkZENvbXBvbmVudChjYy5TcHJpdGUpO1xuICogIG5vZGUucGFyZW50ID0gdGhpcy5ub2RlO1xuICovXG52YXIgU3ByaXRlID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5TcHJpdGUnLFxuICAgIGV4dGVuZHM6IFJlbmRlckNvbXBvbmVudCxcbiAgICBtaXhpbnM6IFtCbGVuZEZ1bmNdLFxuXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnJlbmRlcmVycy9TcHJpdGUnLFxuICAgICAgICBoZWxwOiAnaTE4bjpDT01QT05FTlQuaGVscF91cmwuc3ByaXRlJyxcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9zcHJpdGUuanMnLFxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF9zcHJpdGVGcmFtZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUZyYW1lXG4gICAgICAgIH0sXG4gICAgICAgIF90eXBlOiBTcHJpdGVUeXBlLlNJTVBMRSxcbiAgICAgICAgX3NpemVNb2RlOiBTaXplTW9kZS5UUklNTUVELFxuICAgICAgICBfZmlsbFR5cGU6IDAsXG4gICAgICAgIF9maWxsQ2VudGVyOiBjYy52MigwLCAwKSxcbiAgICAgICAgX2ZpbGxTdGFydDogMCxcbiAgICAgICAgX2ZpbGxSYW5nZTogMCxcbiAgICAgICAgX2lzVHJpbW1lZE1vZGU6IHRydWUsXG4gICAgICAgIF9hdGxhczoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUF0bGFzLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zcHJpdGUuYXRsYXMnLFxuICAgICAgICAgICAgZWRpdG9yT25seTogdHJ1ZSxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBzcHJpdGUgZnJhbWUgb2YgdGhlIHNwcml0ZS5cbiAgICAgICAgICogISN6aCDnsr7ngbXnmoTnsr7ngbXluKdcbiAgICAgICAgICogQHByb3BlcnR5IHNwcml0ZUZyYW1lXG4gICAgICAgICAqIEB0eXBlIHtTcHJpdGVGcmFtZX1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogc3ByaXRlLnNwcml0ZUZyYW1lID0gbmV3U3ByaXRlRnJhbWU7XG4gICAgICAgICAqL1xuICAgICAgICBzcHJpdGVGcmFtZToge1xuICAgICAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zcHJpdGVGcmFtZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQodmFsdWUsIGZvcmNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxhc3RTcHJpdGUgPSB0aGlzLl9zcHJpdGVGcmFtZTtcbiAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZm9yY2UgJiYgKChsYXN0U3ByaXRlICYmIGxhc3RTcHJpdGUuX3V1aWQpID09PSAodmFsdWUgJiYgdmFsdWUuX3V1aWQpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdFNwcml0ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9zcHJpdGVGcmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2FwcGx5U3ByaXRlRnJhbWUobGFzdFNwcml0ZSk7XG4gICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuZW1pdCgnc3ByaXRlZnJhbWUtY2hhbmdlZCcsIHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVGcmFtZSxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgc3ByaXRlIHJlbmRlciB0eXBlLlxuICAgICAgICAgKiAhI3poIOeyvueBtea4suafk+exu+Wei1xuICAgICAgICAgKiBAcHJvcGVydHkgdHlwZVxuICAgICAgICAgKiBAdHlwZSB7U3ByaXRlLlR5cGV9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIHNwcml0ZS50eXBlID0gY2MuU3ByaXRlLlR5cGUuU0lNUExFO1xuICAgICAgICAgKi9cbiAgICAgICAgdHlwZToge1xuICAgICAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90eXBlICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90eXBlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNldEFzc2VtYmxlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBTcHJpdGVUeXBlLFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNwcml0ZS50eXBlJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgZmlsbCB0eXBlLCBUaGlzIHdpbGwgb25seSBoYXZlIGFueSBlZmZlY3QgaWYgdGhlIFwidHlwZVwiIGlzIHNldCB0byDigJxjYy5TcHJpdGUuVHlwZS5GSUxMRUTigJ0uXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog57K+54G15aGr5YWF57G75Z6L77yM5LuF5riy5p+T57G75Z6L6K6+572u5Li6IGNjLlNwcml0ZS5UeXBlLkZJTExFRCDml7bmnInmlYjjgIJcbiAgICAgICAgICogQHByb3BlcnR5IGZpbGxUeXBlXG4gICAgICAgICAqIEB0eXBlIHtTcHJpdGUuRmlsbFR5cGV9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIHNwcml0ZS5maWxsVHlwZSA9IGNjLlNwcml0ZS5GaWxsVHlwZS5IT1JJWk9OVEFMO1xuICAgICAgICAgKi9cbiAgICAgICAgZmlsbFR5cGU6IHtcbiAgICAgICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZmlsbFR5cGU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB0aGlzLl9maWxsVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9maWxsVHlwZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFZlcnRzRGlydHkoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzZXRBc3NlbWJsZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogRmlsbFR5cGUsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNwcml0ZS5maWxsX3R5cGUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIGZpbGwgQ2VudGVyLCBUaGlzIHdpbGwgb25seSBoYXZlIGFueSBlZmZlY3QgaWYgdGhlIFwidHlwZVwiIGlzIHNldCB0byDigJxjYy5TcHJpdGUuVHlwZS5GSUxMRUTigJ0uXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5aGr5YWF5Lit5b+D54K577yM5LuF5riy5p+T57G75Z6L6K6+572u5Li6IGNjLlNwcml0ZS5UeXBlLkZJTExFRCDml7bmnInmlYjjgIJcbiAgICAgICAgICogQHByb3BlcnR5IGZpbGxDZW50ZXJcbiAgICAgICAgICogQHR5cGUge1ZlYzJ9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIHNwcml0ZS5maWxsQ2VudGVyID0gbmV3IGNjLlZlYzIoMCwgMCk7XG4gICAgICAgICAqL1xuICAgICAgICBmaWxsQ2VudGVyOiB7XG4gICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZpbGxDZW50ZXI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZmlsbENlbnRlci54ID0gdmFsdWUueDtcbiAgICAgICAgICAgICAgICB0aGlzLl9maWxsQ2VudGVyLnkgPSB2YWx1ZS55O1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90eXBlID09PSBTcHJpdGVUeXBlLkZJTExFRCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFZlcnRzRGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zcHJpdGUuZmlsbF9jZW50ZXInLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBmaWxsIFN0YXJ0LCBUaGlzIHdpbGwgb25seSBoYXZlIGFueSBlZmZlY3QgaWYgdGhlIFwidHlwZVwiIGlzIHNldCB0byDigJxjYy5TcHJpdGUuVHlwZS5GSUxMRUTigJ0uXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5aGr5YWF6LW35aeL54K577yM5LuF5riy5p+T57G75Z6L6K6+572u5Li6IGNjLlNwcml0ZS5UeXBlLkZJTExFRCDml7bmnInmlYjjgIJcbiAgICAgICAgICogQHByb3BlcnR5IGZpbGxTdGFydFxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiAvLyAtMSBUbyAxIGJldHdlZW4gdGhlIG51bWJlcnNcbiAgICAgICAgICogc3ByaXRlLmZpbGxTdGFydCA9IDAuNTtcbiAgICAgICAgICovXG4gICAgICAgIGZpbGxTdGFydDoge1xuICAgICAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9maWxsU3RhcnQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZmlsbFN0YXJ0ID0gbWlzYy5jbGFtcGYodmFsdWUsIC0xLCAxKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdHlwZSA9PT0gU3ByaXRlVHlwZS5GSUxMRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuc3ByaXRlLmZpbGxfc3RhcnQnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIGZpbGwgUmFuZ2UsIFRoaXMgd2lsbCBvbmx5IGhhdmUgYW55IGVmZmVjdCBpZiB0aGUgXCJ0eXBlXCIgaXMgc2V0IHRvIOKAnGNjLlNwcml0ZS5UeXBlLkZJTExFROKAnS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDloavlhYXojIPlm7TvvIzku4XmuLLmn5Pnsbvlnovorr7nva7kuLogY2MuU3ByaXRlLlR5cGUuRklMTEVEIOaXtuacieaViOOAglxuICAgICAgICAgKiBAcHJvcGVydHkgZmlsbFJhbmdlXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIC8vIC0xIFRvIDEgYmV0d2VlbiB0aGUgbnVtYmVyc1xuICAgICAgICAgKiBzcHJpdGUuZmlsbFJhbmdlID0gMTtcbiAgICAgICAgICovXG4gICAgICAgIGZpbGxSYW5nZToge1xuICAgICAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9maWxsUmFuZ2U7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZmlsbFJhbmdlID0gbWlzYy5jbGFtcGYodmFsdWUsIC0xLCAxKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdHlwZSA9PT0gU3ByaXRlVHlwZS5GSUxMRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuc3ByaXRlLmZpbGxfcmFuZ2UnXG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIHNwZWNpZnkgdGhlIGZyYW1lIGlzIHRyaW1tZWQgb3Igbm90LlxuICAgICAgICAgKiAhI3poIOaYr+WQpuS9v+eUqOijgeWJquaooeW8j1xuICAgICAgICAgKiBAcHJvcGVydHkgdHJpbVxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogc3ByaXRlLnRyaW0gPSB0cnVlO1xuICAgICAgICAgKi9cbiAgICAgICAgdHJpbToge1xuICAgICAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc1RyaW1tZWRNb2RlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pc1RyaW1tZWRNb2RlICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pc1RyaW1tZWRNb2RlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl90eXBlID09PSBTcHJpdGVUeXBlLlNJTVBMRSB8fCB0aGlzLl90eXBlID09PSBTcHJpdGVUeXBlLk1FU0gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zcHJpdGUudHJpbSdcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIHNwZWNpZnkgdGhlIHNpemUgdHJhY2luZyBtb2RlLlxuICAgICAgICAgKiAhI3poIOeyvueBteWwuuWvuOiwg+aVtOaooeW8j1xuICAgICAgICAgKiBAcHJvcGVydHkgc2l6ZU1vZGVcbiAgICAgICAgICogQHR5cGUge1Nwcml0ZS5TaXplTW9kZX1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogc3ByaXRlLnNpemVNb2RlID0gY2MuU3ByaXRlLlNpemVNb2RlLkNVU1RPTTtcbiAgICAgICAgICovXG4gICAgICAgIHNpemVNb2RlOiB7XG4gICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NpemVNb2RlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NpemVNb2RlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSBTaXplTW9kZS5DVVNUT00pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXBwbHlTcHJpdGVTaXplKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdHlwZTogU2l6ZU1vZGUsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNwcml0ZS5zaXplX21vZGUnXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICBGaWxsVHlwZTogRmlsbFR5cGUsXG4gICAgICAgIFR5cGU6IFNwcml0ZVR5cGUsXG4gICAgICAgIFNpemVNb2RlOiBTaXplTW9kZSxcbiAgICAgICAgU3RhdGU6IFN0YXRlLFxuICAgIH0sXG5cbiAgICBzZXRWaXNpYmxlKHZpc2libGUpIHtcbiAgICAgICAgdGhpcy5lbmFibGVkID0gdmlzaWJsZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlIHRoZSBzdGF0ZSBvZiBzcHJpdGUuXG4gICAgICogQG1ldGhvZCBzZXRTdGF0ZVxuICAgICAqIEBzZWUgYFNwcml0ZS5TdGF0ZWBcbiAgICAgKiBAcGFyYW0gc3RhdGUge1Nwcml0ZS5TdGF0ZX0gTk9STUFMIG9yIEdSQVkgU3RhdGUuXG4gICAgICogQGRlcHJlY2F0ZWRcbiAgICAgKi9cbiAgICBzZXRTdGF0ZSgpIHsgfSxcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGN1cnJlbnQgc3RhdGUuXG4gICAgICogQG1ldGhvZCBnZXRTdGF0ZVxuICAgICAqIEBzZWUgYFNwcml0ZS5TdGF0ZWBcbiAgICAgKiBAcmV0dXJuIHtTcHJpdGUuU3RhdGV9XG4gICAgICogQGRlcHJlY2F0ZWRcbiAgICAgKi9cbiAgICBnZXRTdGF0ZSgpIHsgfSxcblxuICAgIF9fcHJlbG9hZCgpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgQ0NfRURJVE9SICYmIHRoaXMubm9kZS5vbihOb2RlRXZlbnQuU0laRV9DSEFOR0VELCB0aGlzLl9yZXNpemVkSW5FZGl0b3IsIHRoaXMpO1xuICAgICAgICB0aGlzLl9hcHBseVNwcml0ZUZyYW1lKCk7XG4gICAgfSxcblxuICAgIG9uRW5hYmxlKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICB0aGlzLl9zcHJpdGVGcmFtZSAmJiB0aGlzLl9zcHJpdGVGcmFtZS5lbnN1cmVMb2FkVGV4dHVyZSgpO1xuXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMuc2V0VmVydHNEaXJ0eSwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRCwgdGhpcy5zZXRWZXJ0c0RpcnR5LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgb25EaXNhYmxlKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuXG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuU0laRV9DSEFOR0VELCB0aGlzLnNldFZlcnRzRGlydHksIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLkFOQ0hPUl9DSEFOR0VELCB0aGlzLnNldFZlcnRzRGlydHksIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlTWF0ZXJpYWwoKSB7XG4gICAgICAgIGxldCB0ZXh0dXJlID0gbnVsbDtcblxuICAgICAgICBpZiAodGhpcy5fc3ByaXRlRnJhbWUpIHtcbiAgICAgICAgICAgIHRleHR1cmUgPSB0aGlzLl9zcHJpdGVGcmFtZS5nZXRUZXh0dXJlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYWtlIHN1cmUgbWF0ZXJpYWwgaXMgYmVsb25nIHRvIHNlbGYuXG4gICAgICAgIGxldCBtYXRlcmlhbCA9IHRoaXMuZ2V0TWF0ZXJpYWwoMCk7XG4gICAgICAgIGlmIChtYXRlcmlhbCkge1xuICAgICAgICAgICAgaWYgKG1hdGVyaWFsLmdldERlZmluZSgnVVNFX1RFWFRVUkUnKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwuZGVmaW5lKCdVU0VfVEVYVFVSRScsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1hdGVyaWFsLmdldFByb3BlcnR5KCd0ZXh0dXJlJykgIT09IHRleHR1cmUpIHtcbiAgICAgICAgICAgICAgICBtYXRlcmlhbC5zZXRQcm9wZXJ0eSgndGV4dHVyZScsIHRleHR1cmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgQmxlbmRGdW5jLnByb3RvdHlwZS5fdXBkYXRlTWF0ZXJpYWwuY2FsbCh0aGlzKTtcbiAgICB9LFxuXG4gICAgX2FwcGx5QXRsYXM6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoc3ByaXRlRnJhbWUpIHtcbiAgICAgICAgLy8gU2V0IGF0bGFzXG4gICAgICAgIGlmIChzcHJpdGVGcmFtZSAmJiBzcHJpdGVGcmFtZS5fYXRsYXNVdWlkKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBjYy5hc3NldE1hbmFnZXIubG9hZEFueShzcHJpdGVGcmFtZS5fYXRsYXNVdWlkLCBmdW5jdGlvbiAoZXJyLCBhc3NldCkge1xuICAgICAgICAgICAgICAgIHNlbGYuX2F0bGFzID0gYXNzZXQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2F0bGFzID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdmFsaWRhdGVSZW5kZXIoKSB7XG4gICAgICAgIGxldCBzcHJpdGVGcmFtZSA9IHRoaXMuX3Nwcml0ZUZyYW1lO1xuICAgICAgICBpZiAodGhpcy5fbWF0ZXJpYWxzWzBdICYmXG4gICAgICAgICAgICBzcHJpdGVGcmFtZSAmJlxuICAgICAgICAgICAgc3ByaXRlRnJhbWUudGV4dHVyZUxvYWRlZCgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRpc2FibGVSZW5kZXIoKTtcbiAgICB9LFxuXG4gICAgX2FwcGx5U3ByaXRlU2l6ZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zcHJpdGVGcmFtZSB8fCAhdGhpcy5pc1ZhbGlkKSByZXR1cm47XG5cbiAgICAgICAgaWYgKFNpemVNb2RlLlJBVyA9PT0gdGhpcy5fc2l6ZU1vZGUpIHtcbiAgICAgICAgICAgIHZhciBzaXplID0gdGhpcy5fc3ByaXRlRnJhbWUuX29yaWdpbmFsU2l6ZTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5zZXRDb250ZW50U2l6ZShzaXplKTtcbiAgICAgICAgfSBlbHNlIGlmIChTaXplTW9kZS5UUklNTUVEID09PSB0aGlzLl9zaXplTW9kZSkge1xuICAgICAgICAgICAgdmFyIHJlY3QgPSB0aGlzLl9zcHJpdGVGcmFtZS5fcmVjdDtcbiAgICAgICAgICAgIHRoaXMubm9kZS5zZXRDb250ZW50U2l6ZShyZWN0LndpZHRoLCByZWN0LmhlaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFZlcnRzRGlydHkoKTtcbiAgICB9LFxuXG4gICAgX2FwcGx5U3ByaXRlRnJhbWUob2xkRnJhbWUpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQpIHJldHVybjtcblxuICAgICAgICBsZXQgb2xkVGV4dHVyZSA9IG9sZEZyYW1lICYmIG9sZEZyYW1lLmdldFRleHR1cmUoKTtcbiAgICAgICAgaWYgKG9sZFRleHR1cmUgJiYgIW9sZFRleHR1cmUubG9hZGVkKSB7XG4gICAgICAgICAgICBvbGRGcmFtZS5vZmYoJ2xvYWQnLCB0aGlzLl9hcHBseVNwcml0ZVNpemUsIHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdXBkYXRlTWF0ZXJpYWwoKTtcbiAgICAgICAgbGV0IHNwcml0ZUZyYW1lID0gdGhpcy5fc3ByaXRlRnJhbWU7XG4gICAgICAgIGlmIChzcHJpdGVGcmFtZSkge1xuICAgICAgICAgICAgbGV0IG5ld1RleHR1cmUgPSBzcHJpdGVGcmFtZS5nZXRUZXh0dXJlKCk7XG4gICAgICAgICAgICBpZiAobmV3VGV4dHVyZSAmJiBuZXdUZXh0dXJlLmxvYWRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FwcGx5U3ByaXRlU2l6ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNhYmxlUmVuZGVyKCk7XG4gICAgICAgICAgICAgICAgc3ByaXRlRnJhbWUub25jZSgnbG9hZCcsIHRoaXMuX2FwcGx5U3ByaXRlU2l6ZSwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRpc2FibGVSZW5kZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIC8vIFNldCBhdGxhc1xuICAgICAgICAgICAgdGhpcy5fYXBwbHlBdGxhcyhzcHJpdGVGcmFtZSk7XG4gICAgICAgIH1cbiAgICB9LFxufSk7XG5cbmlmIChDQ19FRElUT1IpIHtcbiAgICBTcHJpdGUucHJvdG90eXBlLl9yZXNpemVkSW5FZGl0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9zcHJpdGVGcmFtZSkge1xuICAgICAgICAgICAgdmFyIGFjdHVhbFNpemUgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKTtcbiAgICAgICAgICAgIHZhciBleHBlY3RlZFcgPSBhY3R1YWxTaXplLndpZHRoO1xuICAgICAgICAgICAgdmFyIGV4cGVjdGVkSCA9IGFjdHVhbFNpemUuaGVpZ2h0O1xuICAgICAgICAgICAgaWYgKHRoaXMuX3NpemVNb2RlID09PSBTaXplTW9kZS5SQVcpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2l6ZSA9IHRoaXMuX3Nwcml0ZUZyYW1lLmdldE9yaWdpbmFsU2l6ZSgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdGVkVyA9IHNpemUud2lkdGg7XG4gICAgICAgICAgICAgICAgZXhwZWN0ZWRIID0gc2l6ZS5oZWlnaHQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX3NpemVNb2RlID09PSBTaXplTW9kZS5UUklNTUVEKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlY3QgPSB0aGlzLl9zcHJpdGVGcmFtZS5nZXRSZWN0KCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0ZWRXID0gcmVjdC53aWR0aDtcbiAgICAgICAgICAgICAgICBleHBlY3RlZEggPSByZWN0LmhlaWdodDtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZXhwZWN0ZWRXICE9PSBhY3R1YWxTaXplLndpZHRoIHx8IGV4cGVjdGVkSCAhPT0gYWN0dWFsU2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zaXplTW9kZSA9IFNpemVNb2RlLkNVU1RPTTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBvdmVycmlkZSBvbkRlc3Ryb3lcbiAgICBTcHJpdGUucHJvdG90eXBlLl9fc3VwZXJPbkRlc3Ryb3kgPSBjYy5Db21wb25lbnQucHJvdG90eXBlLm9uRGVzdHJveTtcbiAgICBTcHJpdGUucHJvdG90eXBlLm9uRGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX19zdXBlck9uRGVzdHJveSkgdGhpcy5fX3N1cGVyT25EZXN0cm95KCk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoTm9kZUV2ZW50LlNJWkVfQ0hBTkdFRCwgdGhpcy5fcmVzaXplZEluRWRpdG9yLCB0aGlzKTtcbiAgICB9O1xufVxuXG5jYy5TcHJpdGUgPSBtb2R1bGUuZXhwb3J0cyA9IFNwcml0ZTtcbiJdLCJzb3VyY2VSb290IjoiLyJ9