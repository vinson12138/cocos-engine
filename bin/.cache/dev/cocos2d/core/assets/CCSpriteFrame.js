
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCSpriteFrame.js';
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
var EventTarget = require("../event/event-target");

var INSET_LEFT = 0;
var INSET_TOP = 1;
var INSET_RIGHT = 2;
var INSET_BOTTOM = 3;
var temp_uvs = [{
  u: 0,
  v: 0
}, {
  u: 0,
  v: 0
}, {
  u: 0,
  v: 0
}, {
  u: 0,
  v: 0
}];
/**
 * !#en
 * A cc.SpriteFrame has:<br/>
 *  - texture: A cc.Texture2D that will be used by render components<br/>
 *  - rectangle: A rectangle of the texture
 *
 * !#zh
 * 一个 SpriteFrame 包含：<br/>
 *  - 纹理：会被渲染组件使用的 Texture2D 对象。<br/>
 *  - 矩形：在纹理中的矩形区域。
 *
 * @class SpriteFrame
 * @extends Asset
 * @uses EventTarget
 * @example
 * // load a cc.SpriteFrame with image path (Recommend)
 * var self = this;
 * var url = "test assets/PurpleMonster";
 * cc.resources.load(url, cc.SpriteFrame, null, function (err, spriteFrame) {
 *  var node = new cc.Node("New Sprite");
 *  var sprite = node.addComponent(cc.Sprite);
 *  sprite.spriteFrame = spriteFrame;
 *  node.parent = self.node
 * });
 */

var SpriteFrame = cc.Class(
/** @lends cc.SpriteFrame# */
{
  name: 'cc.SpriteFrame',
  "extends": require('../assets/CCAsset'),
  mixins: [EventTarget],
  properties: {
    // Use this property to set texture when loading dependency
    _textureSetter: {
      set: function set(texture) {
        if (texture) {
          if (CC_EDITOR && Editor.isBuilder) {
            // just building
            this._texture = texture;
            return;
          }

          if (this._texture !== texture) {
            this._refreshTexture(texture);
          }
        }
      }
    },

    /**
     * !#en Top border of the sprite
     * !#zh sprite 的顶部边框
     * @property insetTop
     * @type {Number}
     * @default 0
     */
    insetTop: {
      get: function get() {
        return this._capInsets[INSET_TOP];
      },
      set: function set(value) {
        this._capInsets[INSET_TOP] = value;

        if (this._texture) {
          this._calculateSlicedUV();
        }
      }
    },

    /**
     * !#en Bottom border of the sprite
     * !#zh sprite 的底部边框
     * @property insetBottom
     * @type {Number}
     * @default 0
     */
    insetBottom: {
      get: function get() {
        return this._capInsets[INSET_BOTTOM];
      },
      set: function set(value) {
        this._capInsets[INSET_BOTTOM] = value;

        if (this._texture) {
          this._calculateSlicedUV();
        }
      }
    },

    /**
     * !#en Left border of the sprite
     * !#zh sprite 的左边边框
     * @property insetLeft
     * @type {Number}
     * @default 0
     */
    insetLeft: {
      get: function get() {
        return this._capInsets[INSET_LEFT];
      },
      set: function set(value) {
        this._capInsets[INSET_LEFT] = value;

        if (this._texture) {
          this._calculateSlicedUV();
        }
      }
    },

    /**
     * !#en Right border of the sprite
     * !#zh sprite 的左边边框
     * @property insetRight
     * @type {Number}
     * @default 0
     */
    insetRight: {
      get: function get() {
        return this._capInsets[INSET_RIGHT];
      },
      set: function set(value) {
        this._capInsets[INSET_RIGHT] = value;

        if (this._texture) {
          this._calculateSlicedUV();
        }
      }
    }
  },

  /**
   * !#en
   * Constructor of SpriteFrame class.
   * !#zh
   * SpriteFrame 类的构造函数。
   * @method constructor
   * @param {String|Texture2D} [filename]
   * @param {Rect} [rect]
   * @param {Boolean} [rotated] - Whether the frame is rotated in the texture
   * @param {Vec2} [offset] - The offset of the frame in the texture
   * @param {Size} [originalSize] - The size of the frame in the texture
   */
  ctor: function ctor() {
    // Init EventTarget data
    EventTarget.call(this);
    var filename = arguments[0];
    var rect = arguments[1];
    var rotated = arguments[2];
    var offset = arguments[3];
    var originalSize = arguments[4]; // the location of the sprite on rendering texture

    this._rect = null; // uv data of frame

    this.uv = []; // texture of frame

    this._texture = null; // store original info before packed to dynamic atlas

    this._original = null; // for trimming

    this._offset = null; // for trimming

    this._originalSize = null;
    this._rotated = false;
    this._flipX = false;
    this._flipY = false;
    this.vertices = null;
    this._capInsets = [0, 0, 0, 0];
    this.uvSliced = [];

    if (CC_EDITOR) {
      // Atlas asset uuid
      this._atlasUuid = '';
    }

    if (filename !== undefined) {
      this.setTexture(filename, rect, rotated, offset, originalSize);
    } else {//todo log Error
    }
  },

  /**
   * !#en Returns whether the texture have been loaded
   * !#zh 返回是否已加载纹理
   * @method textureLoaded
   * @returns {boolean}
   */
  textureLoaded: function textureLoaded() {
    return this._texture && this._texture.loaded;
  },
  onTextureLoaded: function onTextureLoaded(callback, target) {
    if (this.textureLoaded()) {
      callback.call(target);
    } else {
      this.once('load', callback, target);
      this.ensureLoadTexture();
      return false;
    }

    return true;
  },

  /**
   * !#en Returns whether the sprite frame is rotated in the texture.
   * !#zh 获取 SpriteFrame 是否旋转
   * @method isRotated
   * @return {Boolean}
   */
  isRotated: function isRotated() {
    return this._rotated;
  },

  /**
   * !#en Set whether the sprite frame is rotated in the texture.
   * !#zh 设置 SpriteFrame 是否旋转
   * @method setRotated
   * @param {Boolean} bRotated
   */
  setRotated: function setRotated(bRotated) {
    this._rotated = bRotated;
    if (this._texture) this._calculateUV();
  },

  /**
   * !#en Returns whether the sprite frame is flip x axis in the texture.
   * !#zh 获取 SpriteFrame 是否反转 x 轴
   * @method isFlipX
   * @return {Boolean}
   */
  isFlipX: function isFlipX() {
    return this._flipX;
  },

  /**
   * !#en Returns whether the sprite frame is flip y axis in the texture.
   * !#zh 获取 SpriteFrame 是否反转 y 轴
   * @method isFlipY
   * @return {Boolean}
   */
  isFlipY: function isFlipY() {
    return this._flipY;
  },

  /**
   * !#en Set whether the sprite frame is flip x axis in the texture.
   * !#zh 设置 SpriteFrame 是否翻转 x 轴
   * @method setFlipX
   * @param {Boolean} flipX
   */
  setFlipX: function setFlipX(flipX) {
    this._flipX = flipX;

    if (this._texture) {
      this._calculateUV();
    }
  },

  /**
   * !#en Set whether the sprite frame is flip y axis in the texture.
   * !#zh 设置 SpriteFrame 是否翻转 y 轴
   * @method setFlipY
   * @param {Boolean} flipY
   */
  setFlipY: function setFlipY(flipY) {
    this._flipY = flipY;

    if (this._texture) {
      this._calculateUV();
    }
  },

  /**
   * !#en Returns the rect of the sprite frame in the texture.
   * !#zh 获取 SpriteFrame 的纹理矩形区域
   * @method getRect
   * @return {Rect}
   */
  getRect: function getRect() {
    return cc.rect(this._rect);
  },

  /**
   * !#en Sets the rect of the sprite frame in the texture.
   * !#zh 设置 SpriteFrame 的纹理矩形区域
   * @method setRect
   * @param {Rect} rect
   */
  setRect: function setRect(rect) {
    this._rect = rect;
    if (this._texture) this._calculateUV();
  },

  /**
   * !#en Returns the original size of the trimmed image.
   * !#zh 获取修剪前的原始大小
   * @method getOriginalSize
   * @return {Size}
   */
  getOriginalSize: function getOriginalSize() {
    return cc.size(this._originalSize);
  },

  /**
   * !#en Sets the original size of the trimmed image.
   * !#zh 设置修剪前的原始大小
   * @method setOriginalSize
   * @param {Size} size
   */
  setOriginalSize: function setOriginalSize(size) {
    if (!this._originalSize) {
      this._originalSize = cc.size(size);
    } else {
      this._originalSize.width = size.width;
      this._originalSize.height = size.height;
    }
  },

  /**
   * !#en Returns the texture of the frame.
   * !#zh 获取使用的纹理实例
   * @method getTexture
   * @return {Texture2D}
   */
  getTexture: function getTexture() {
    return this._texture;
  },
  _textureLoadedCallback: function _textureLoadedCallback() {
    var self = this;
    var texture = this._texture;

    if (!texture) {
      // clearTexture called while loading texture...
      return;
    }

    var w = texture.width,
        h = texture.height;

    if (self._rect) {
      self._checkRect(self._texture);
    } else {
      self._rect = cc.rect(0, 0, w, h);
    }

    if (!self._originalSize) {
      self.setOriginalSize(cc.size(w, h));
    }

    if (!self._offset) {
      self.setOffset(cc.v2(0, 0));
    }

    self._calculateUV(); // dispatch 'load' event of cc.SpriteFrame


    self.emit("load");
  },

  /*
   * !#en Sets the texture of the frame.
   * !#zh 设置使用的纹理实例。
   * @method _refreshTexture
   * @param {Texture2D} texture
   */
  _refreshTexture: function _refreshTexture(texture) {
    this._texture = texture;

    if (texture.loaded) {
      this._textureLoadedCallback();
    } else {
      texture.once('load', this._textureLoadedCallback, this);
    }
  },

  /**
   * !#en Returns the offset of the frame in the texture.
   * !#zh 获取偏移量
   * @method getOffset
   * @return {Vec2}
   */
  getOffset: function getOffset() {
    return cc.v2(this._offset);
  },

  /**
   * !#en Sets the offset of the frame in the texture.
   * !#zh 设置偏移量
   * @method setOffset
   * @param {Vec2} offsets
   */
  setOffset: function setOffset(offsets) {
    this._offset = cc.v2(offsets);
  },

  /**
   * !#en Clone the sprite frame.
   * !#zh 克隆 SpriteFrame
   * @method clone
   * @return {SpriteFrame}
   */
  clone: function clone() {
    return new SpriteFrame(this._texture, this.getRect(), this._rotated, this.getOffset(), this.getOriginalSize());
  },

  /**
   * !#en Set SpriteFrame with Texture, rect, rotated, offset and originalSize.<br/>
   * !#zh 通过 Texture，rect，rotated，offset 和 originalSize 设置 SpriteFrame。
   * @method setTexture
   * @param {Texture2D} texture
   * @param {Rect} [rect=null]
   * @param {Boolean} [rotated=false]
   * @param {Vec2} [offset=cc.v2(0,0)]
   * @param {Size} [originalSize=rect.size]
   * @return {Boolean}
   */
  setTexture: function setTexture(texture, rect, rotated, offset, originalSize) {
    if (arguments.length === 1 && texture === this._texture) return;

    if (rect) {
      this._rect = rect;
    } else {
      this._rect = null;
    }

    if (offset) {
      this.setOffset(offset);
    } else {
      this._offset = null;
    }

    if (originalSize) {
      this.setOriginalSize(originalSize);
    } else {
      this._originalSize = null;
    }

    this._rotated = rotated || false;

    if (typeof texture === 'string') {
      cc.errorID(3401);
      return;
    }

    if (texture instanceof cc.Texture2D) {
      this._refreshTexture(texture);
    }

    return true;
  },

  /**
   * !#en If a loading scene (or prefab) is marked as `asyncLoadAssets`, all the textures of the SpriteFrame which
   * associated by user's custom Components in the scene, will not preload automatically.
   * These textures will be load when Sprite component is going to render the SpriteFrames.
   * You can call this method if you want to load the texture early.
   * !#zh 当加载中的场景或 Prefab 被标记为 `asyncLoadAssets` 时，用户在场景中由自定义组件关联到的所有 SpriteFrame 的贴图都不会被提前加载。
   * 只有当 Sprite 组件要渲染这些 SpriteFrame 时，才会检查贴图是否加载。如果你希望加载过程提前，你可以手工调用这个方法。
   *
   * @method ensureLoadTexture
   * @example
   * if (spriteFrame.textureLoaded()) {
   *     this._onSpriteFrameLoaded();
   * }
   * else {
   *     spriteFrame.once('load', this._onSpriteFrameLoaded, this);
   *     spriteFrame.ensureLoadTexture();
   * }
   */
  ensureLoadTexture: function ensureLoadTexture() {
    if (this._texture) {
      if (!this._texture.loaded) {
        // load exists texture
        this._refreshTexture(this._texture);

        cc.assetManager.postLoadNative(this._texture);
      }
    }
  },

  /**
   * !#en
   * If you do not need to use the SpriteFrame temporarily, you can call this method so that its texture could be garbage collected. Then when you need to render the SpriteFrame, you should call `ensureLoadTexture` manually to reload texture.
   * !#zh
   * 当你暂时不再使用这个 SpriteFrame 时，可以调用这个方法来保证引用的贴图对象能被 GC。然后当你要渲染 SpriteFrame 时，你需要手动调用 `ensureLoadTexture` 来重新加载贴图。
   * @method clearTexture
   * @deprecated since 2.1
   */
  _checkRect: function _checkRect(texture) {
    var rect = this._rect;
    var maxX = rect.x,
        maxY = rect.y;

    if (this._rotated) {
      maxX += rect.height;
      maxY += rect.width;
    } else {
      maxX += rect.width;
      maxY += rect.height;
    }

    if (maxX > texture.width) {
      cc.errorID(3300, texture.nativeUrl + '/' + this.name, maxX, texture.width);
    }

    if (maxY > texture.height) {
      cc.errorID(3400, texture.nativeUrl + '/' + this.name, maxY, texture.height);
    }
  },
  _flipXY: function _flipXY(uvs) {
    if (this._flipX) {
      var tempVal = uvs[0];
      uvs[0] = uvs[1];
      uvs[1] = tempVal;
      tempVal = uvs[2];
      uvs[2] = uvs[3];
      uvs[3] = tempVal;
    }

    if (this._flipY) {
      var _tempVal = uvs[0];
      uvs[0] = uvs[2];
      uvs[2] = _tempVal;
      _tempVal = uvs[1];
      uvs[1] = uvs[3];
      uvs[3] = _tempVal;
    }
  },
  _calculateSlicedUV: function _calculateSlicedUV() {
    var rect = this._rect;
    var atlasWidth = this._texture.width;
    var atlasHeight = this._texture.height;
    var leftWidth = this._capInsets[INSET_LEFT];
    var rightWidth = this._capInsets[INSET_RIGHT];
    var centerWidth = rect.width - leftWidth - rightWidth;
    var topHeight = this._capInsets[INSET_TOP];
    var bottomHeight = this._capInsets[INSET_BOTTOM];
    var centerHeight = rect.height - topHeight - bottomHeight;
    var uvSliced = this.uvSliced;
    uvSliced.length = 0;

    if (this._rotated) {
      temp_uvs[0].u = rect.x / atlasWidth;
      temp_uvs[1].u = (rect.x + bottomHeight) / atlasWidth;
      temp_uvs[2].u = (rect.x + bottomHeight + centerHeight) / atlasWidth;
      temp_uvs[3].u = (rect.x + rect.height) / atlasWidth;
      temp_uvs[3].v = rect.y / atlasHeight;
      temp_uvs[2].v = (rect.y + leftWidth) / atlasHeight;
      temp_uvs[1].v = (rect.y + leftWidth + centerWidth) / atlasHeight;
      temp_uvs[0].v = (rect.y + rect.width) / atlasHeight;

      this._flipXY(temp_uvs);

      for (var row = 0; row < 4; ++row) {
        var rowD = temp_uvs[row];

        for (var col = 0; col < 4; ++col) {
          var colD = temp_uvs[3 - col];
          uvSliced.push({
            u: rowD.u,
            v: colD.v
          });
        }
      }
    } else {
      temp_uvs[0].u = rect.x / atlasWidth;
      temp_uvs[1].u = (rect.x + leftWidth) / atlasWidth;
      temp_uvs[2].u = (rect.x + leftWidth + centerWidth) / atlasWidth;
      temp_uvs[3].u = (rect.x + rect.width) / atlasWidth;
      temp_uvs[3].v = rect.y / atlasHeight;
      temp_uvs[2].v = (rect.y + topHeight) / atlasHeight;
      temp_uvs[1].v = (rect.y + topHeight + centerHeight) / atlasHeight;
      temp_uvs[0].v = (rect.y + rect.height) / atlasHeight;

      this._flipXY(temp_uvs);

      for (var _row = 0; _row < 4; ++_row) {
        var _rowD = temp_uvs[_row];

        for (var _col = 0; _col < 4; ++_col) {
          var _colD = temp_uvs[_col];
          uvSliced.push({
            u: _colD.u,
            v: _rowD.v
          });
        }
      }
    }
  },
  _setDynamicAtlasFrame: function _setDynamicAtlasFrame(frame) {
    if (!frame) return;
    this._original = {
      _texture: this._texture,
      _x: this._rect.x,
      _y: this._rect.y
    };
    this._texture = frame.texture;
    this._rect.x = frame.x;
    this._rect.y = frame.y;

    this._calculateUV();
  },
  _resetDynamicAtlasFrame: function _resetDynamicAtlasFrame() {
    if (!this._original) return;
    this._rect.x = this._original._x;
    this._rect.y = this._original._y;
    this._texture = this._original._texture;
    this._original = null;

    this._calculateUV();
  },
  _calculateUV: function _calculateUV() {
    var rect = this._rect,
        texture = this._texture,
        uv = this.uv,
        texw = texture.width,
        texh = texture.height;

    if (this._rotated) {
      var l = texw === 0 ? 0 : rect.x / texw;
      var r = texw === 0 ? 0 : (rect.x + rect.height) / texw;
      var b = texh === 0 ? 0 : (rect.y + rect.width) / texh;
      var t = texh === 0 ? 0 : rect.y / texh;
      uv[0] = l;
      uv[1] = t;
      uv[2] = l;
      uv[3] = b;
      uv[4] = r;
      uv[5] = t;
      uv[6] = r;
      uv[7] = b;
    } else {
      var _l = texw === 0 ? 0 : rect.x / texw;

      var _r = texw === 0 ? 0 : (rect.x + rect.width) / texw;

      var _b = texh === 0 ? 0 : (rect.y + rect.height) / texh;

      var _t = texh === 0 ? 0 : rect.y / texh;

      uv[0] = _l;
      uv[1] = _b;
      uv[2] = _r;
      uv[3] = _b;
      uv[4] = _l;
      uv[5] = _t;
      uv[6] = _r;
      uv[7] = _t;
    }

    if (this._flipX) {
      var tempVal = uv[0];
      uv[0] = uv[2];
      uv[2] = tempVal;
      tempVal = uv[1];
      uv[1] = uv[3];
      uv[3] = tempVal;
      tempVal = uv[4];
      uv[4] = uv[6];
      uv[6] = tempVal;
      tempVal = uv[5];
      uv[5] = uv[7];
      uv[7] = tempVal;
    }

    if (this._flipY) {
      var _tempVal2 = uv[0];
      uv[0] = uv[4];
      uv[4] = _tempVal2;
      _tempVal2 = uv[1];
      uv[1] = uv[5];
      uv[5] = _tempVal2;
      _tempVal2 = uv[2];
      uv[2] = uv[6];
      uv[6] = _tempVal2;
      _tempVal2 = uv[3];
      uv[3] = uv[7];
      uv[7] = _tempVal2;
    }

    var vertices = this.vertices;

    if (vertices) {
      vertices.nu.length = 0;
      vertices.nv.length = 0;

      for (var i = 0; i < vertices.u.length; i++) {
        vertices.nu[i] = vertices.u[i] / texw;
        vertices.nv[i] = vertices.v[i] / texh;
      }
    }

    this._calculateSlicedUV();
  },
  // SERIALIZATION
  _serialize: (CC_EDITOR || CC_TEST) && function (exporting, ctx) {
    var rect = this._rect;
    var offset = this._offset;
    var size = this._originalSize;
    var uuid;
    var texture = this._texture;

    if (texture) {
      uuid = texture._uuid;
    }

    if (!uuid) {
      var url = this._textureFilename;

      if (url) {
        uuid = Editor.Utils.UuidCache.urlToUuid(url);
      }
    }

    if (uuid && exporting) {
      uuid = Editor.Utils.UuidUtils.compressUuid(uuid, true);
      ctx.dependsOn('_textureSetter', uuid);
    }

    var vertices;

    if (this.vertices) {
      vertices = {
        triangles: this.vertices.triangles,
        x: this.vertices.x,
        y: this.vertices.y,
        u: this.vertices.u,
        v: this.vertices.v
      };
    }

    return {
      name: this._name,
      texture: !exporting && uuid || undefined,
      atlas: exporting ? undefined : this._atlasUuid,
      // strip from json if exporting
      rect: rect ? [rect.x, rect.y, rect.width, rect.height] : undefined,
      offset: offset ? [offset.x, offset.y] : undefined,
      originalSize: size ? [size.width, size.height] : undefined,
      rotated: this._rotated ? 1 : undefined,
      capInsets: this._capInsets,
      vertices: vertices
    };
  },
  _deserialize: function _deserialize(data, handle) {
    var rect = data.rect;

    if (rect) {
      this._rect = new cc.Rect(rect[0], rect[1], rect[2], rect[3]);
    }

    if (data.offset) {
      this.setOffset(new cc.Vec2(data.offset[0], data.offset[1]));
    }

    if (data.originalSize) {
      this.setOriginalSize(new cc.Size(data.originalSize[0], data.originalSize[1]));
    }

    this._rotated = data.rotated === 1;
    this._name = data.name;
    var capInsets = data.capInsets;

    if (capInsets) {
      this._capInsets[INSET_LEFT] = capInsets[INSET_LEFT];
      this._capInsets[INSET_TOP] = capInsets[INSET_TOP];
      this._capInsets[INSET_RIGHT] = capInsets[INSET_RIGHT];
      this._capInsets[INSET_BOTTOM] = capInsets[INSET_BOTTOM];
    }

    if (CC_EDITOR) {
      this._atlasUuid = data.atlas;
    }

    this.vertices = data.vertices;

    if (this.vertices) {
      // initialize normal uv arrays
      this.vertices.nu = [];
      this.vertices.nv = [];
    }

    if (!CC_BUILD) {
      // manually load texture via _textureSetter
      var textureUuid = data.texture;

      if (textureUuid) {
        handle.result.push(this, '_textureSetter', textureUuid);
      }
    }
  }
});
var proto = SpriteFrame.prototype;
proto.copyWithZone = proto.clone;
proto.copy = proto.clone;
proto.initWithTexture = proto.setTexture;
cc.SpriteFrame = SpriteFrame;
module.exports = SpriteFrame;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0cy9DQ1Nwcml0ZUZyYW1lLmpzIl0sIm5hbWVzIjpbIkV2ZW50VGFyZ2V0IiwicmVxdWlyZSIsIklOU0VUX0xFRlQiLCJJTlNFVF9UT1AiLCJJTlNFVF9SSUdIVCIsIklOU0VUX0JPVFRPTSIsInRlbXBfdXZzIiwidSIsInYiLCJTcHJpdGVGcmFtZSIsImNjIiwiQ2xhc3MiLCJuYW1lIiwibWl4aW5zIiwicHJvcGVydGllcyIsIl90ZXh0dXJlU2V0dGVyIiwic2V0IiwidGV4dHVyZSIsIkNDX0VESVRPUiIsIkVkaXRvciIsImlzQnVpbGRlciIsIl90ZXh0dXJlIiwiX3JlZnJlc2hUZXh0dXJlIiwiaW5zZXRUb3AiLCJnZXQiLCJfY2FwSW5zZXRzIiwidmFsdWUiLCJfY2FsY3VsYXRlU2xpY2VkVVYiLCJpbnNldEJvdHRvbSIsImluc2V0TGVmdCIsImluc2V0UmlnaHQiLCJjdG9yIiwiY2FsbCIsImZpbGVuYW1lIiwiYXJndW1lbnRzIiwicmVjdCIsInJvdGF0ZWQiLCJvZmZzZXQiLCJvcmlnaW5hbFNpemUiLCJfcmVjdCIsInV2IiwiX29yaWdpbmFsIiwiX29mZnNldCIsIl9vcmlnaW5hbFNpemUiLCJfcm90YXRlZCIsIl9mbGlwWCIsIl9mbGlwWSIsInZlcnRpY2VzIiwidXZTbGljZWQiLCJfYXRsYXNVdWlkIiwidW5kZWZpbmVkIiwic2V0VGV4dHVyZSIsInRleHR1cmVMb2FkZWQiLCJsb2FkZWQiLCJvblRleHR1cmVMb2FkZWQiLCJjYWxsYmFjayIsInRhcmdldCIsIm9uY2UiLCJlbnN1cmVMb2FkVGV4dHVyZSIsImlzUm90YXRlZCIsInNldFJvdGF0ZWQiLCJiUm90YXRlZCIsIl9jYWxjdWxhdGVVViIsImlzRmxpcFgiLCJpc0ZsaXBZIiwic2V0RmxpcFgiLCJmbGlwWCIsInNldEZsaXBZIiwiZmxpcFkiLCJnZXRSZWN0Iiwic2V0UmVjdCIsImdldE9yaWdpbmFsU2l6ZSIsInNpemUiLCJzZXRPcmlnaW5hbFNpemUiLCJ3aWR0aCIsImhlaWdodCIsImdldFRleHR1cmUiLCJfdGV4dHVyZUxvYWRlZENhbGxiYWNrIiwic2VsZiIsInciLCJoIiwiX2NoZWNrUmVjdCIsInNldE9mZnNldCIsInYyIiwiZW1pdCIsImdldE9mZnNldCIsIm9mZnNldHMiLCJjbG9uZSIsImxlbmd0aCIsImVycm9ySUQiLCJUZXh0dXJlMkQiLCJhc3NldE1hbmFnZXIiLCJwb3N0TG9hZE5hdGl2ZSIsIm1heFgiLCJ4IiwibWF4WSIsInkiLCJuYXRpdmVVcmwiLCJfZmxpcFhZIiwidXZzIiwidGVtcFZhbCIsImF0bGFzV2lkdGgiLCJhdGxhc0hlaWdodCIsImxlZnRXaWR0aCIsInJpZ2h0V2lkdGgiLCJjZW50ZXJXaWR0aCIsInRvcEhlaWdodCIsImJvdHRvbUhlaWdodCIsImNlbnRlckhlaWdodCIsInJvdyIsInJvd0QiLCJjb2wiLCJjb2xEIiwicHVzaCIsIl9zZXREeW5hbWljQXRsYXNGcmFtZSIsImZyYW1lIiwiX3giLCJfeSIsIl9yZXNldER5bmFtaWNBdGxhc0ZyYW1lIiwidGV4dyIsInRleGgiLCJsIiwiciIsImIiLCJ0IiwibnUiLCJudiIsImkiLCJfc2VyaWFsaXplIiwiQ0NfVEVTVCIsImV4cG9ydGluZyIsImN0eCIsInV1aWQiLCJfdXVpZCIsInVybCIsIl90ZXh0dXJlRmlsZW5hbWUiLCJVdGlscyIsIlV1aWRDYWNoZSIsInVybFRvVXVpZCIsIlV1aWRVdGlscyIsImNvbXByZXNzVXVpZCIsImRlcGVuZHNPbiIsInRyaWFuZ2xlcyIsIl9uYW1lIiwiYXRsYXMiLCJjYXBJbnNldHMiLCJfZGVzZXJpYWxpemUiLCJkYXRhIiwiaGFuZGxlIiwiUmVjdCIsIlZlYzIiLCJTaXplIiwiQ0NfQlVJTEQiLCJ0ZXh0dXJlVXVpZCIsInJlc3VsdCIsInByb3RvIiwicHJvdG90eXBlIiwiY29weVdpdGhab25lIiwiY29weSIsImluaXRXaXRoVGV4dHVyZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7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SUFBZCxDQUFtQixJQUFuQixFQUF5QixnQkFBekIsRUFBMkN3QyxXQUEzQztBQUNIO0FBQ0o7QUFDSjtBQTd2Qm1ELENBQXRDLENBQWxCO0FBZ3dCQSxJQUFJRSxLQUFLLEdBQUdsSixXQUFXLENBQUNtSixTQUF4QjtBQUVBRCxLQUFLLENBQUNFLFlBQU4sR0FBcUJGLEtBQUssQ0FBQ3BFLEtBQTNCO0FBQ0FvRSxLQUFLLENBQUNHLElBQU4sR0FBYUgsS0FBSyxDQUFDcEUsS0FBbkI7QUFDQW9FLEtBQUssQ0FBQ0ksZUFBTixHQUF3QkosS0FBSyxDQUFDeEcsVUFBOUI7QUFFQXpDLEVBQUUsQ0FBQ0QsV0FBSCxHQUFpQkEsV0FBakI7QUFFQXVKLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnhKLFdBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMDgtMjAxMCBSaWNhcmRvIFF1ZXNhZGFcbiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxMiBjb2NvczJkLXgub3JnXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBFdmVudFRhcmdldCA9IHJlcXVpcmUoXCIuLi9ldmVudC9ldmVudC10YXJnZXRcIik7XG5cbmNvbnN0IElOU0VUX0xFRlQgPSAwO1xuY29uc3QgSU5TRVRfVE9QID0gMTtcbmNvbnN0IElOU0VUX1JJR0hUID0gMjtcbmNvbnN0IElOU0VUX0JPVFRPTSA9IDM7XG5cbmxldCB0ZW1wX3V2cyA9IFt7dTogMCwgdjogMH0sIHt1OiAwLCB2OiAwfSwge3U6IDAsIHY6IDB9LCB7dTogMCwgdjogMH1dO1xuXG4vKipcbiAqICEjZW5cbiAqIEEgY2MuU3ByaXRlRnJhbWUgaGFzOjxici8+XG4gKiAgLSB0ZXh0dXJlOiBBIGNjLlRleHR1cmUyRCB0aGF0IHdpbGwgYmUgdXNlZCBieSByZW5kZXIgY29tcG9uZW50czxici8+XG4gKiAgLSByZWN0YW5nbGU6IEEgcmVjdGFuZ2xlIG9mIHRoZSB0ZXh0dXJlXG4gKlxuICogISN6aFxuICog5LiA5LiqIFNwcml0ZUZyYW1lIOWMheWQq++8mjxici8+XG4gKiAgLSDnurnnkIbvvJrkvJrooqvmuLLmn5Pnu4Tku7bkvb/nlKjnmoQgVGV4dHVyZTJEIOWvueixoeOAgjxici8+XG4gKiAgLSDnn6nlvaLvvJrlnKjnurnnkIbkuK3nmoTnn6nlvaLljLrln5/jgIJcbiAqXG4gKiBAY2xhc3MgU3ByaXRlRnJhbWVcbiAqIEBleHRlbmRzIEFzc2V0XG4gKiBAdXNlcyBFdmVudFRhcmdldFxuICogQGV4YW1wbGVcbiAqIC8vIGxvYWQgYSBjYy5TcHJpdGVGcmFtZSB3aXRoIGltYWdlIHBhdGggKFJlY29tbWVuZClcbiAqIHZhciBzZWxmID0gdGhpcztcbiAqIHZhciB1cmwgPSBcInRlc3QgYXNzZXRzL1B1cnBsZU1vbnN0ZXJcIjtcbiAqIGNjLnJlc291cmNlcy5sb2FkKHVybCwgY2MuU3ByaXRlRnJhbWUsIG51bGwsIGZ1bmN0aW9uIChlcnIsIHNwcml0ZUZyYW1lKSB7XG4gKiAgdmFyIG5vZGUgPSBuZXcgY2MuTm9kZShcIk5ldyBTcHJpdGVcIik7XG4gKiAgdmFyIHNwcml0ZSA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLlNwcml0ZSk7XG4gKiAgc3ByaXRlLnNwcml0ZUZyYW1lID0gc3ByaXRlRnJhbWU7XG4gKiAgbm9kZS5wYXJlbnQgPSBzZWxmLm5vZGVcbiAqIH0pO1xuICovXG5sZXQgU3ByaXRlRnJhbWUgPSBjYy5DbGFzcygvKiogQGxlbmRzIGNjLlNwcml0ZUZyYW1lIyAqL3tcbiAgICBuYW1lOiAnY2MuU3ByaXRlRnJhbWUnLFxuICAgIGV4dGVuZHM6IHJlcXVpcmUoJy4uL2Fzc2V0cy9DQ0Fzc2V0JyksXG4gICAgbWl4aW5zOiBbRXZlbnRUYXJnZXRdLFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBVc2UgdGhpcyBwcm9wZXJ0eSB0byBzZXQgdGV4dHVyZSB3aGVuIGxvYWRpbmcgZGVwZW5kZW5jeVxuICAgICAgICBfdGV4dHVyZVNldHRlcjoge1xuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodGV4dHVyZSkge1xuICAgICAgICAgICAgICAgIGlmICh0ZXh0dXJlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IgJiYgRWRpdG9yLmlzQnVpbGRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8ganVzdCBidWlsZGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGV4dHVyZSA9IHRleHR1cmU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RleHR1cmUgIT09IHRleHR1cmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlZnJlc2hUZXh0dXJlKHRleHR1cmUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRvcCBib3JkZXIgb2YgdGhlIHNwcml0ZVxuICAgICAgICAgKiAhI3poIHNwcml0ZSDnmoTpobbpg6jovrnmoYZcbiAgICAgICAgICogQHByb3BlcnR5IGluc2V0VG9wXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIGluc2V0VG9wOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FwSW5zZXRzW0lOU0VUX1RPUF07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYXBJbnNldHNbSU5TRVRfVE9QXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZXh0dXJlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVNsaWNlZFVWKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEJvdHRvbSBib3JkZXIgb2YgdGhlIHNwcml0ZVxuICAgICAgICAgKiAhI3poIHNwcml0ZSDnmoTlupXpg6jovrnmoYZcbiAgICAgICAgICogQHByb3BlcnR5IGluc2V0Qm90dG9tXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIGluc2V0Qm90dG9tOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FwSW5zZXRzW0lOU0VUX0JPVFRPTV07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYXBJbnNldHNbSU5TRVRfQk9UVE9NXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZXh0dXJlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVNsaWNlZFVWKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIExlZnQgYm9yZGVyIG9mIHRoZSBzcHJpdGVcbiAgICAgICAgICogISN6aCBzcHJpdGUg55qE5bem6L656L655qGGXG4gICAgICAgICAqIEBwcm9wZXJ0eSBpbnNldExlZnRcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgaW5zZXRMZWZ0OiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FwSW5zZXRzW0lOU0VUX0xFRlRdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FwSW5zZXRzW0lOU0VUX0xFRlRdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RleHR1cmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlU2xpY2VkVVYoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gUmlnaHQgYm9yZGVyIG9mIHRoZSBzcHJpdGVcbiAgICAgICAgICogISN6aCBzcHJpdGUg55qE5bem6L656L655qGGXG4gICAgICAgICAqIEBwcm9wZXJ0eSBpbnNldFJpZ2h0XG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIGluc2V0UmlnaHQ6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYXBJbnNldHNbSU5TRVRfUklHSFRdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FwSW5zZXRzW0lOU0VUX1JJR0hUXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZXh0dXJlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVNsaWNlZFVWKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ29uc3RydWN0b3Igb2YgU3ByaXRlRnJhbWUgY2xhc3MuXG4gICAgICogISN6aFxuICAgICAqIFNwcml0ZUZyYW1lIOexu+eahOaehOmAoOWHveaVsOOAglxuICAgICAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xUZXh0dXJlMkR9IFtmaWxlbmFtZV1cbiAgICAgKiBAcGFyYW0ge1JlY3R9IFtyZWN0XVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3JvdGF0ZWRdIC0gV2hldGhlciB0aGUgZnJhbWUgaXMgcm90YXRlZCBpbiB0aGUgdGV4dHVyZVxuICAgICAqIEBwYXJhbSB7VmVjMn0gW29mZnNldF0gLSBUaGUgb2Zmc2V0IG9mIHRoZSBmcmFtZSBpbiB0aGUgdGV4dHVyZVxuICAgICAqIEBwYXJhbSB7U2l6ZX0gW29yaWdpbmFsU2l6ZV0gLSBUaGUgc2l6ZSBvZiB0aGUgZnJhbWUgaW4gdGhlIHRleHR1cmVcbiAgICAgKi9cbiAgICBjdG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIEluaXQgRXZlbnRUYXJnZXQgZGF0YVxuICAgICAgICBFdmVudFRhcmdldC5jYWxsKHRoaXMpO1xuXG4gICAgICAgIGxldCBmaWxlbmFtZSA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgbGV0IHJlY3QgPSBhcmd1bWVudHNbMV07XG4gICAgICAgIGxldCByb3RhdGVkID0gYXJndW1lbnRzWzJdO1xuICAgICAgICBsZXQgb2Zmc2V0ID0gYXJndW1lbnRzWzNdO1xuICAgICAgICBsZXQgb3JpZ2luYWxTaXplID0gYXJndW1lbnRzWzRdO1xuXG4gICAgICAgIC8vIHRoZSBsb2NhdGlvbiBvZiB0aGUgc3ByaXRlIG9uIHJlbmRlcmluZyB0ZXh0dXJlXG4gICAgICAgIHRoaXMuX3JlY3QgPSBudWxsO1xuICAgICAgICAvLyB1diBkYXRhIG9mIGZyYW1lXG4gICAgICAgIHRoaXMudXYgPSBbXTtcbiAgICAgICAgLy8gdGV4dHVyZSBvZiBmcmFtZVxuICAgICAgICB0aGlzLl90ZXh0dXJlID0gbnVsbDtcbiAgICAgICAgLy8gc3RvcmUgb3JpZ2luYWwgaW5mbyBiZWZvcmUgcGFja2VkIHRvIGR5bmFtaWMgYXRsYXNcbiAgICAgICAgdGhpcy5fb3JpZ2luYWwgPSBudWxsO1xuXG4gICAgICAgIC8vIGZvciB0cmltbWluZ1xuICAgICAgICB0aGlzLl9vZmZzZXQgPSBudWxsO1xuXG4gICAgICAgIC8vIGZvciB0cmltbWluZ1xuICAgICAgICB0aGlzLl9vcmlnaW5hbFNpemUgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuX3JvdGF0ZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLl9mbGlwWCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9mbGlwWSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMudmVydGljZXMgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuX2NhcEluc2V0cyA9IFswLCAwLCAwLCAwXTtcblxuICAgICAgICB0aGlzLnV2U2xpY2VkID0gW107XG5cbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgLy8gQXRsYXMgYXNzZXQgdXVpZFxuICAgICAgICAgICAgdGhpcy5fYXRsYXNVdWlkID0gJyc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZmlsZW5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5zZXRUZXh0dXJlKGZpbGVuYW1lLCByZWN0LCByb3RhdGVkLCBvZmZzZXQsIG9yaWdpbmFsU2l6ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL3RvZG8gbG9nIEVycm9yXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHdoZXRoZXIgdGhlIHRleHR1cmUgaGF2ZSBiZWVuIGxvYWRlZFxuICAgICAqICEjemgg6L+U5Zue5piv5ZCm5bey5Yqg6L2957q555CGXG4gICAgICogQG1ldGhvZCB0ZXh0dXJlTG9hZGVkXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgdGV4dHVyZUxvYWRlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dHVyZSAmJiB0aGlzLl90ZXh0dXJlLmxvYWRlZDtcbiAgICB9LFxuXG4gICAgb25UZXh0dXJlTG9hZGVkIChjYWxsYmFjaywgdGFyZ2V0KSB7XG4gICAgICAgIGlmICh0aGlzLnRleHR1cmVMb2FkZWQoKSkge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vbmNlKCdsb2FkJywgY2FsbGJhY2ssIHRhcmdldCk7XG4gICAgICAgICAgICB0aGlzLmVuc3VyZUxvYWRUZXh0dXJlKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHdoZXRoZXIgdGhlIHNwcml0ZSBmcmFtZSBpcyByb3RhdGVkIGluIHRoZSB0ZXh0dXJlLlxuICAgICAqICEjemgg6I635Y+WIFNwcml0ZUZyYW1lIOaYr+WQpuaXi+i9rFxuICAgICAqIEBtZXRob2QgaXNSb3RhdGVkXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpc1JvdGF0ZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvdGF0ZWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHdoZXRoZXIgdGhlIHNwcml0ZSBmcmFtZSBpcyByb3RhdGVkIGluIHRoZSB0ZXh0dXJlLlxuICAgICAqICEjemgg6K6+572uIFNwcml0ZUZyYW1lIOaYr+WQpuaXi+i9rFxuICAgICAqIEBtZXRob2Qgc2V0Um90YXRlZFxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gYlJvdGF0ZWRcbiAgICAgKi9cbiAgICBzZXRSb3RhdGVkOiBmdW5jdGlvbiAoYlJvdGF0ZWQpIHtcbiAgICAgICAgdGhpcy5fcm90YXRlZCA9IGJSb3RhdGVkO1xuICAgICAgICBpZiAodGhpcy5fdGV4dHVyZSlcbiAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVVWKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB3aGV0aGVyIHRoZSBzcHJpdGUgZnJhbWUgaXMgZmxpcCB4IGF4aXMgaW4gdGhlIHRleHR1cmUuXG4gICAgICogISN6aCDojrflj5YgU3ByaXRlRnJhbWUg5piv5ZCm5Y+N6L2sIHgg6L20XG4gICAgICogQG1ldGhvZCBpc0ZsaXBYXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpc0ZsaXBYOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mbGlwWDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHdoZXRoZXIgdGhlIHNwcml0ZSBmcmFtZSBpcyBmbGlwIHkgYXhpcyBpbiB0aGUgdGV4dHVyZS5cbiAgICAgKiAhI3poIOiOt+WPliBTcHJpdGVGcmFtZSDmmK/lkKblj43ovawgeSDovbRcbiAgICAgKiBAbWV0aG9kIGlzRmxpcFlcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGlzRmxpcFk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZsaXBZO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCB3aGV0aGVyIHRoZSBzcHJpdGUgZnJhbWUgaXMgZmxpcCB4IGF4aXMgaW4gdGhlIHRleHR1cmUuXG4gICAgICogISN6aCDorr7nva4gU3ByaXRlRnJhbWUg5piv5ZCm57+76L2sIHgg6L20XG4gICAgICogQG1ldGhvZCBzZXRGbGlwWFxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gZmxpcFhcbiAgICAgKi9cbiAgICBzZXRGbGlwWDogZnVuY3Rpb24gKGZsaXBYKSB7XG4gICAgICAgIHRoaXMuX2ZsaXBYID0gZmxpcFg7XG4gICAgICAgIGlmICh0aGlzLl90ZXh0dXJlKSB7XG4gICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVVVigpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHdoZXRoZXIgdGhlIHNwcml0ZSBmcmFtZSBpcyBmbGlwIHkgYXhpcyBpbiB0aGUgdGV4dHVyZS5cbiAgICAgKiAhI3poIOiuvue9riBTcHJpdGVGcmFtZSDmmK/lkKbnv7vovawgeSDovbRcbiAgICAgKiBAbWV0aG9kIHNldEZsaXBZXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBmbGlwWVxuICAgICAqL1xuICAgIHNldEZsaXBZOiBmdW5jdGlvbiAoZmxpcFkpIHtcbiAgICAgICAgdGhpcy5fZmxpcFkgPSBmbGlwWTtcbiAgICAgICAgaWYgKHRoaXMuX3RleHR1cmUpIHtcbiAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVVWKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSByZWN0IG9mIHRoZSBzcHJpdGUgZnJhbWUgaW4gdGhlIHRleHR1cmUuXG4gICAgICogISN6aCDojrflj5YgU3ByaXRlRnJhbWUg55qE57q555CG55+p5b2i5Yy65Z+fXG4gICAgICogQG1ldGhvZCBnZXRSZWN0XG4gICAgICogQHJldHVybiB7UmVjdH1cbiAgICAgKi9cbiAgICBnZXRSZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjYy5yZWN0KHRoaXMuX3JlY3QpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgdGhlIHJlY3Qgb2YgdGhlIHNwcml0ZSBmcmFtZSBpbiB0aGUgdGV4dHVyZS5cbiAgICAgKiAhI3poIOiuvue9riBTcHJpdGVGcmFtZSDnmoTnurnnkIbnn6nlvaLljLrln59cbiAgICAgKiBAbWV0aG9kIHNldFJlY3RcbiAgICAgKiBAcGFyYW0ge1JlY3R9IHJlY3RcbiAgICAgKi9cbiAgICBzZXRSZWN0OiBmdW5jdGlvbiAocmVjdCkge1xuICAgICAgICB0aGlzLl9yZWN0ID0gcmVjdDtcbiAgICAgICAgaWYgKHRoaXMuX3RleHR1cmUpXG4gICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVVVigpO1xuICAgIH0sXG4gICAgXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBvcmlnaW5hbCBzaXplIG9mIHRoZSB0cmltbWVkIGltYWdlLlxuICAgICAqICEjemgg6I635Y+W5L+u5Ymq5YmN55qE5Y6f5aeL5aSn5bCPXG4gICAgICogQG1ldGhvZCBnZXRPcmlnaW5hbFNpemVcbiAgICAgKiBAcmV0dXJuIHtTaXplfVxuICAgICAqL1xuICAgIGdldE9yaWdpbmFsU2l6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2Muc2l6ZSh0aGlzLl9vcmlnaW5hbFNpemUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgdGhlIG9yaWdpbmFsIHNpemUgb2YgdGhlIHRyaW1tZWQgaW1hZ2UuXG4gICAgICogISN6aCDorr7nva7kv67liarliY3nmoTljp/lp4vlpKflsI9cbiAgICAgKiBAbWV0aG9kIHNldE9yaWdpbmFsU2l6ZVxuICAgICAqIEBwYXJhbSB7U2l6ZX0gc2l6ZVxuICAgICAqL1xuICAgIHNldE9yaWdpbmFsU2l6ZTogZnVuY3Rpb24gKHNpemUpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9vcmlnaW5hbFNpemUpIHtcbiAgICAgICAgICAgIHRoaXMuX29yaWdpbmFsU2l6ZSA9IGNjLnNpemUoc2l6ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9vcmlnaW5hbFNpemUud2lkdGggPSBzaXplLndpZHRoO1xuICAgICAgICAgICAgdGhpcy5fb3JpZ2luYWxTaXplLmhlaWdodCA9IHNpemUuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgdGV4dHVyZSBvZiB0aGUgZnJhbWUuXG4gICAgICogISN6aCDojrflj5bkvb/nlKjnmoTnurnnkIblrp7kvotcbiAgICAgKiBAbWV0aG9kIGdldFRleHR1cmVcbiAgICAgKiBAcmV0dXJuIHtUZXh0dXJlMkR9XG4gICAgICovXG4gICAgZ2V0VGV4dHVyZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dHVyZTtcbiAgICB9LFxuXG4gICAgX3RleHR1cmVMb2FkZWRDYWxsYmFjayAoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IHRleHR1cmUgPSB0aGlzLl90ZXh0dXJlO1xuICAgICAgICBpZiAoIXRleHR1cmUpIHtcbiAgICAgICAgICAgIC8vIGNsZWFyVGV4dHVyZSBjYWxsZWQgd2hpbGUgbG9hZGluZyB0ZXh0dXJlLi4uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHcgPSB0ZXh0dXJlLndpZHRoLCBoID0gdGV4dHVyZS5oZWlnaHQ7XG5cbiAgICAgICAgaWYgKHNlbGYuX3JlY3QpIHtcbiAgICAgICAgICAgIHNlbGYuX2NoZWNrUmVjdChzZWxmLl90ZXh0dXJlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYuX3JlY3QgPSBjYy5yZWN0KDAsIDAsIHcsIGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzZWxmLl9vcmlnaW5hbFNpemUpIHtcbiAgICAgICAgICAgIHNlbGYuc2V0T3JpZ2luYWxTaXplKGNjLnNpemUodywgaCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzZWxmLl9vZmZzZXQpIHtcbiAgICAgICAgICAgIHNlbGYuc2V0T2Zmc2V0KGNjLnYyKDAsIDApKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuX2NhbGN1bGF0ZVVWKCk7XG5cbiAgICAgICAgLy8gZGlzcGF0Y2ggJ2xvYWQnIGV2ZW50IG9mIGNjLlNwcml0ZUZyYW1lXG4gICAgICAgIHNlbGYuZW1pdChcImxvYWRcIik7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogISNlbiBTZXRzIHRoZSB0ZXh0dXJlIG9mIHRoZSBmcmFtZS5cbiAgICAgKiAhI3poIOiuvue9ruS9v+eUqOeahOe6ueeQhuWunuS+i+OAglxuICAgICAqIEBtZXRob2QgX3JlZnJlc2hUZXh0dXJlXG4gICAgICogQHBhcmFtIHtUZXh0dXJlMkR9IHRleHR1cmVcbiAgICAgKi9cbiAgICBfcmVmcmVzaFRleHR1cmU6IGZ1bmN0aW9uICh0ZXh0dXJlKSB7XG4gICAgICAgIHRoaXMuX3RleHR1cmUgPSB0ZXh0dXJlO1xuICAgICAgICBpZiAodGV4dHVyZS5sb2FkZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmVMb2FkZWRDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGV4dHVyZS5vbmNlKCdsb2FkJywgdGhpcy5fdGV4dHVyZUxvYWRlZENhbGxiYWNrLCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgdGhlIG9mZnNldCBvZiB0aGUgZnJhbWUgaW4gdGhlIHRleHR1cmUuXG4gICAgICogISN6aCDojrflj5blgY/np7vph49cbiAgICAgKiBAbWV0aG9kIGdldE9mZnNldFxuICAgICAqIEByZXR1cm4ge1ZlYzJ9XG4gICAgICovXG4gICAgZ2V0T2Zmc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjYy52Mih0aGlzLl9vZmZzZXQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgdGhlIG9mZnNldCBvZiB0aGUgZnJhbWUgaW4gdGhlIHRleHR1cmUuXG4gICAgICogISN6aCDorr7nva7lgY/np7vph49cbiAgICAgKiBAbWV0aG9kIHNldE9mZnNldFxuICAgICAqIEBwYXJhbSB7VmVjMn0gb2Zmc2V0c1xuICAgICAqL1xuICAgIHNldE9mZnNldDogZnVuY3Rpb24gKG9mZnNldHMpIHtcbiAgICAgICAgdGhpcy5fb2Zmc2V0ID0gY2MudjIob2Zmc2V0cyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2xvbmUgdGhlIHNwcml0ZSBmcmFtZS5cbiAgICAgKiAhI3poIOWFi+mahiBTcHJpdGVGcmFtZVxuICAgICAqIEBtZXRob2QgY2xvbmVcbiAgICAgKiBAcmV0dXJuIHtTcHJpdGVGcmFtZX1cbiAgICAgKi9cbiAgICBjbG9uZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuZXcgU3ByaXRlRnJhbWUodGhpcy5fdGV4dHVyZSwgdGhpcy5nZXRSZWN0KCksIHRoaXMuX3JvdGF0ZWQsIHRoaXMuZ2V0T2Zmc2V0KCksIHRoaXMuZ2V0T3JpZ2luYWxTaXplKCkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCBTcHJpdGVGcmFtZSB3aXRoIFRleHR1cmUsIHJlY3QsIHJvdGF0ZWQsIG9mZnNldCBhbmQgb3JpZ2luYWxTaXplLjxici8+XG4gICAgICogISN6aCDpgJrov4cgVGV4dHVyZe+8jHJlY3TvvIxyb3RhdGVk77yMb2Zmc2V0IOWSjCBvcmlnaW5hbFNpemUg6K6+572uIFNwcml0ZUZyYW1l44CCXG4gICAgICogQG1ldGhvZCBzZXRUZXh0dXJlXG4gICAgICogQHBhcmFtIHtUZXh0dXJlMkR9IHRleHR1cmVcbiAgICAgKiBAcGFyYW0ge1JlY3R9IFtyZWN0PW51bGxdXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbcm90YXRlZD1mYWxzZV1cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IFtvZmZzZXQ9Y2MudjIoMCwwKV1cbiAgICAgKiBAcGFyYW0ge1NpemV9IFtvcmlnaW5hbFNpemU9cmVjdC5zaXplXVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgc2V0VGV4dHVyZTogZnVuY3Rpb24gKHRleHR1cmUsIHJlY3QsIHJvdGF0ZWQsIG9mZnNldCwgb3JpZ2luYWxTaXplKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxICYmIHRleHR1cmUgPT09IHRoaXMuX3RleHR1cmUpIHJldHVybjtcblxuICAgICAgICBpZiAocmVjdCkge1xuICAgICAgICAgICAgdGhpcy5fcmVjdCA9IHJlY3Q7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9yZWN0ID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvZmZzZXQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0T2Zmc2V0KG9mZnNldCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9vZmZzZXQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9yaWdpbmFsU2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5zZXRPcmlnaW5hbFNpemUob3JpZ2luYWxTaXplKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX29yaWdpbmFsU2l6ZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9yb3RhdGVkID0gcm90YXRlZCB8fCBmYWxzZTtcblxuICAgICAgICBpZiAodHlwZW9mIHRleHR1cmUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDM0MDEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0ZXh0dXJlIGluc3RhbmNlb2YgY2MuVGV4dHVyZTJEKSB7XG4gICAgICAgICAgICB0aGlzLl9yZWZyZXNoVGV4dHVyZSh0ZXh0dXJlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIElmIGEgbG9hZGluZyBzY2VuZSAob3IgcHJlZmFiKSBpcyBtYXJrZWQgYXMgYGFzeW5jTG9hZEFzc2V0c2AsIGFsbCB0aGUgdGV4dHVyZXMgb2YgdGhlIFNwcml0ZUZyYW1lIHdoaWNoXG4gICAgICogYXNzb2NpYXRlZCBieSB1c2VyJ3MgY3VzdG9tIENvbXBvbmVudHMgaW4gdGhlIHNjZW5lLCB3aWxsIG5vdCBwcmVsb2FkIGF1dG9tYXRpY2FsbHkuXG4gICAgICogVGhlc2UgdGV4dHVyZXMgd2lsbCBiZSBsb2FkIHdoZW4gU3ByaXRlIGNvbXBvbmVudCBpcyBnb2luZyB0byByZW5kZXIgdGhlIFNwcml0ZUZyYW1lcy5cbiAgICAgKiBZb3UgY2FuIGNhbGwgdGhpcyBtZXRob2QgaWYgeW91IHdhbnQgdG8gbG9hZCB0aGUgdGV4dHVyZSBlYXJseS5cbiAgICAgKiAhI3poIOW9k+WKoOi9veS4reeahOWcuuaZr+aIliBQcmVmYWIg6KKr5qCH6K6w5Li6IGBhc3luY0xvYWRBc3NldHNgIOaXtu+8jOeUqOaIt+WcqOWcuuaZr+S4reeUseiHquWumuS5iee7hOS7tuWFs+iBlOWIsOeahOaJgOaciSBTcHJpdGVGcmFtZSDnmoTotLTlm77pg73kuI3kvJrooqvmj5DliY3liqDovb3jgIJcbiAgICAgKiDlj6rmnInlvZMgU3ByaXRlIOe7hOS7tuimgea4suafk+i/meS6myBTcHJpdGVGcmFtZSDml7bvvIzmiY3kvJrmo4Dmn6XotLTlm77mmK/lkKbliqDovb3jgILlpoLmnpzkvaDluIzmnJvliqDovb3ov4fnqIvmj5DliY3vvIzkvaDlj6/ku6XmiYvlt6XosIPnlKjov5nkuKrmlrnms5XjgIJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZW5zdXJlTG9hZFRleHR1cmVcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGlmIChzcHJpdGVGcmFtZS50ZXh0dXJlTG9hZGVkKCkpIHtcbiAgICAgKiAgICAgdGhpcy5fb25TcHJpdGVGcmFtZUxvYWRlZCgpO1xuICAgICAqIH1cbiAgICAgKiBlbHNlIHtcbiAgICAgKiAgICAgc3ByaXRlRnJhbWUub25jZSgnbG9hZCcsIHRoaXMuX29uU3ByaXRlRnJhbWVMb2FkZWQsIHRoaXMpO1xuICAgICAqICAgICBzcHJpdGVGcmFtZS5lbnN1cmVMb2FkVGV4dHVyZSgpO1xuICAgICAqIH1cbiAgICAgKi9cbiAgICBlbnN1cmVMb2FkVGV4dHVyZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fdGV4dHVyZSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl90ZXh0dXJlLmxvYWRlZCkge1xuICAgICAgICAgICAgICAgIC8vIGxvYWQgZXhpc3RzIHRleHR1cmVcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWZyZXNoVGV4dHVyZSh0aGlzLl90ZXh0dXJlKTtcbiAgICAgICAgICAgICAgICBjYy5hc3NldE1hbmFnZXIucG9zdExvYWROYXRpdmUodGhpcy5fdGV4dHVyZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIElmIHlvdSBkbyBub3QgbmVlZCB0byB1c2UgdGhlIFNwcml0ZUZyYW1lIHRlbXBvcmFyaWx5LCB5b3UgY2FuIGNhbGwgdGhpcyBtZXRob2Qgc28gdGhhdCBpdHMgdGV4dHVyZSBjb3VsZCBiZSBnYXJiYWdlIGNvbGxlY3RlZC4gVGhlbiB3aGVuIHlvdSBuZWVkIHRvIHJlbmRlciB0aGUgU3ByaXRlRnJhbWUsIHlvdSBzaG91bGQgY2FsbCBgZW5zdXJlTG9hZFRleHR1cmVgIG1hbnVhbGx5IHRvIHJlbG9hZCB0ZXh0dXJlLlxuICAgICAqICEjemhcbiAgICAgKiDlvZPkvaDmmoLml7bkuI3lho3kvb/nlKjov5nkuKogU3ByaXRlRnJhbWUg5pe277yM5Y+v5Lul6LCD55So6L+Z5Liq5pa55rOV5p2l5L+d6K+B5byV55So55qE6LS05Zu+5a+56LGh6IO96KKrIEdD44CC54S25ZCO5b2T5L2g6KaB5riy5p+TIFNwcml0ZUZyYW1lIOaXtu+8jOS9oOmcgOimgeaJi+WKqOiwg+eUqCBgZW5zdXJlTG9hZFRleHR1cmVgIOadpemHjeaWsOWKoOi9vei0tOWbvuOAglxuICAgICAqIEBtZXRob2QgY2xlYXJUZXh0dXJlXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgMi4xXG4gICAgICovXG5cbiAgICBfY2hlY2tSZWN0OiBmdW5jdGlvbiAodGV4dHVyZSkge1xuICAgICAgICBsZXQgcmVjdCA9IHRoaXMuX3JlY3Q7XG4gICAgICAgIGxldCBtYXhYID0gcmVjdC54LCBtYXhZID0gcmVjdC55O1xuICAgICAgICBpZiAodGhpcy5fcm90YXRlZCkge1xuICAgICAgICAgICAgbWF4WCArPSByZWN0LmhlaWdodDtcbiAgICAgICAgICAgIG1heFkgKz0gcmVjdC53aWR0aDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG1heFggKz0gcmVjdC53aWR0aDtcbiAgICAgICAgICAgIG1heFkgKz0gcmVjdC5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1heFggPiB0ZXh0dXJlLndpZHRoKSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDMzMDAsIHRleHR1cmUubmF0aXZlVXJsICsgJy8nICsgdGhpcy5uYW1lLCBtYXhYLCB0ZXh0dXJlLndpZHRoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF4WSA+IHRleHR1cmUuaGVpZ2h0KSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDM0MDAsIHRleHR1cmUubmF0aXZlVXJsICsgJy8nICsgdGhpcy5uYW1lLCBtYXhZLCB0ZXh0dXJlLmhlaWdodCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2ZsaXBYWSAodXZzKSB7XG4gICAgICAgIGlmICh0aGlzLl9mbGlwWCkge1xuICAgICAgICAgICAgbGV0IHRlbXBWYWwgPSB1dnNbMF07XG4gICAgICAgICAgICB1dnNbMF0gPSB1dnNbMV07XG4gICAgICAgICAgICB1dnNbMV0gPSB0ZW1wVmFsO1xuXG4gICAgICAgICAgICB0ZW1wVmFsID0gdXZzWzJdO1xuICAgICAgICAgICAgdXZzWzJdID0gdXZzWzNdO1xuICAgICAgICAgICAgdXZzWzNdID0gdGVtcFZhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9mbGlwWSkge1xuICAgICAgICAgICAgbGV0IHRlbXBWYWwgPSB1dnNbMF07XG4gICAgICAgICAgICB1dnNbMF0gPSB1dnNbMl07XG4gICAgICAgICAgICB1dnNbMl0gPSB0ZW1wVmFsO1xuXG4gICAgICAgICAgICB0ZW1wVmFsID0gdXZzWzFdO1xuICAgICAgICAgICAgdXZzWzFdID0gdXZzWzNdO1xuICAgICAgICAgICAgdXZzWzNdID0gdGVtcFZhbDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfY2FsY3VsYXRlU2xpY2VkVVYgKCkge1xuICAgICAgICBsZXQgcmVjdCA9IHRoaXMuX3JlY3Q7XG4gICAgICAgIGxldCBhdGxhc1dpZHRoID0gdGhpcy5fdGV4dHVyZS53aWR0aDtcbiAgICAgICAgbGV0IGF0bGFzSGVpZ2h0ID0gdGhpcy5fdGV4dHVyZS5oZWlnaHQ7XG4gICAgICAgIGxldCBsZWZ0V2lkdGggPSB0aGlzLl9jYXBJbnNldHNbSU5TRVRfTEVGVF07XG4gICAgICAgIGxldCByaWdodFdpZHRoID0gdGhpcy5fY2FwSW5zZXRzW0lOU0VUX1JJR0hUXTtcbiAgICAgICAgbGV0IGNlbnRlcldpZHRoID0gcmVjdC53aWR0aCAtIGxlZnRXaWR0aCAtIHJpZ2h0V2lkdGg7XG4gICAgICAgIGxldCB0b3BIZWlnaHQgPSB0aGlzLl9jYXBJbnNldHNbSU5TRVRfVE9QXTtcbiAgICAgICAgbGV0IGJvdHRvbUhlaWdodCA9IHRoaXMuX2NhcEluc2V0c1tJTlNFVF9CT1RUT01dO1xuICAgICAgICBsZXQgY2VudGVySGVpZ2h0ID0gcmVjdC5oZWlnaHQgLSB0b3BIZWlnaHQgLSBib3R0b21IZWlnaHQ7XG5cbiAgICAgICAgbGV0IHV2U2xpY2VkID0gdGhpcy51dlNsaWNlZDtcbiAgICAgICAgdXZTbGljZWQubGVuZ3RoID0gMDtcbiAgICAgICAgaWYgKHRoaXMuX3JvdGF0ZWQpIHtcbiAgICAgICAgICAgIHRlbXBfdXZzWzBdLnUgPSAocmVjdC54KSAvIGF0bGFzV2lkdGg7XG4gICAgICAgICAgICB0ZW1wX3V2c1sxXS51ID0gKHJlY3QueCArIGJvdHRvbUhlaWdodCkgLyBhdGxhc1dpZHRoO1xuICAgICAgICAgICAgdGVtcF91dnNbMl0udSA9IChyZWN0LnggKyBib3R0b21IZWlnaHQgKyBjZW50ZXJIZWlnaHQpIC8gYXRsYXNXaWR0aDtcbiAgICAgICAgICAgIHRlbXBfdXZzWzNdLnUgPSAocmVjdC54ICsgcmVjdC5oZWlnaHQpIC8gYXRsYXNXaWR0aDtcbiAgICAgICAgICAgIHRlbXBfdXZzWzNdLnYgPSAocmVjdC55KSAvIGF0bGFzSGVpZ2h0O1xuICAgICAgICAgICAgdGVtcF91dnNbMl0udiA9IChyZWN0LnkgKyBsZWZ0V2lkdGgpIC8gYXRsYXNIZWlnaHQ7XG4gICAgICAgICAgICB0ZW1wX3V2c1sxXS52ID0gKHJlY3QueSArIGxlZnRXaWR0aCArIGNlbnRlcldpZHRoKSAvIGF0bGFzSGVpZ2h0O1xuICAgICAgICAgICAgdGVtcF91dnNbMF0udiA9IChyZWN0LnkgKyByZWN0LndpZHRoKSAvIGF0bGFzSGVpZ2h0O1xuXG4gICAgICAgICAgICB0aGlzLl9mbGlwWFkodGVtcF91dnMpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCA0OyArK3Jvdykge1xuICAgICAgICAgICAgICAgIGxldCByb3dEID0gdGVtcF91dnNbcm93XTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCA0OyArK2NvbCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29sRCA9IHRlbXBfdXZzWzMgLSBjb2xdO1xuICAgICAgICAgICAgICAgICAgICB1dlNsaWNlZC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHU6IHJvd0QudSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHY6IGNvbEQudlxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0ZW1wX3V2c1swXS51ID0gKHJlY3QueCkgLyBhdGxhc1dpZHRoO1xuICAgICAgICAgICAgdGVtcF91dnNbMV0udSA9IChyZWN0LnggKyBsZWZ0V2lkdGgpIC8gYXRsYXNXaWR0aDtcbiAgICAgICAgICAgIHRlbXBfdXZzWzJdLnUgPSAocmVjdC54ICsgbGVmdFdpZHRoICsgY2VudGVyV2lkdGgpIC8gYXRsYXNXaWR0aDtcbiAgICAgICAgICAgIHRlbXBfdXZzWzNdLnUgPSAocmVjdC54ICsgcmVjdC53aWR0aCkgLyBhdGxhc1dpZHRoO1xuICAgICAgICAgICAgdGVtcF91dnNbM10udiA9IChyZWN0LnkpIC8gYXRsYXNIZWlnaHQ7XG4gICAgICAgICAgICB0ZW1wX3V2c1syXS52ID0gKHJlY3QueSArIHRvcEhlaWdodCkgLyBhdGxhc0hlaWdodDtcbiAgICAgICAgICAgIHRlbXBfdXZzWzFdLnYgPSAocmVjdC55ICsgdG9wSGVpZ2h0ICsgY2VudGVySGVpZ2h0KSAvIGF0bGFzSGVpZ2h0O1xuICAgICAgICAgICAgdGVtcF91dnNbMF0udiA9IChyZWN0LnkgKyByZWN0LmhlaWdodCkgLyBhdGxhc0hlaWdodDtcblxuICAgICAgICAgICAgdGhpcy5fZmxpcFhZKHRlbXBfdXZzKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgNDsgKytyb3cpIHtcbiAgICAgICAgICAgICAgICBsZXQgcm93RCA9IHRlbXBfdXZzW3Jvd107XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgNDsgKytjb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbEQgPSB0ZW1wX3V2c1tjb2xdO1xuICAgICAgICAgICAgICAgICAgICB1dlNsaWNlZC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHU6IGNvbEQudSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHY6IHJvd0QudlxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3NldER5bmFtaWNBdGxhc0ZyYW1lIChmcmFtZSkge1xuICAgICAgICBpZiAoIWZyYW1lKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5fb3JpZ2luYWwgPSB7XG4gICAgICAgICAgICBfdGV4dHVyZSA6IHRoaXMuX3RleHR1cmUsXG4gICAgICAgICAgICBfeCA6IHRoaXMuX3JlY3QueCxcbiAgICAgICAgICAgIF95IDogdGhpcy5fcmVjdC55XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuX3RleHR1cmUgPSBmcmFtZS50ZXh0dXJlO1xuICAgICAgICB0aGlzLl9yZWN0LnggPSBmcmFtZS54O1xuICAgICAgICB0aGlzLl9yZWN0LnkgPSBmcmFtZS55O1xuICAgICAgICB0aGlzLl9jYWxjdWxhdGVVVigpO1xuICAgIH0sXG5cbiAgICBfcmVzZXREeW5hbWljQXRsYXNGcmFtZSAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fb3JpZ2luYWwpIHJldHVybjtcbiAgICAgICAgdGhpcy5fcmVjdC54ID0gdGhpcy5fb3JpZ2luYWwuX3g7XG4gICAgICAgIHRoaXMuX3JlY3QueSA9IHRoaXMuX29yaWdpbmFsLl95O1xuICAgICAgICB0aGlzLl90ZXh0dXJlID0gdGhpcy5fb3JpZ2luYWwuX3RleHR1cmU7XG4gICAgICAgIHRoaXMuX29yaWdpbmFsID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlVVYoKTtcbiAgICB9LFxuXG4gICAgX2NhbGN1bGF0ZVVWICgpIHtcbiAgICAgICAgbGV0IHJlY3QgPSB0aGlzLl9yZWN0LFxuICAgICAgICAgICAgdGV4dHVyZSA9IHRoaXMuX3RleHR1cmUsXG4gICAgICAgICAgICB1diA9IHRoaXMudXYsXG4gICAgICAgICAgICB0ZXh3ID0gdGV4dHVyZS53aWR0aCxcbiAgICAgICAgICAgIHRleGggPSB0ZXh0dXJlLmhlaWdodDtcblxuICAgICAgICBpZiAodGhpcy5fcm90YXRlZCkge1xuICAgICAgICAgICAgbGV0IGwgPSB0ZXh3ID09PSAwID8gMCA6IHJlY3QueCAvIHRleHc7XG4gICAgICAgICAgICBsZXQgciA9IHRleHcgPT09IDAgPyAwIDogKHJlY3QueCArIHJlY3QuaGVpZ2h0KSAvIHRleHc7XG4gICAgICAgICAgICBsZXQgYiA9IHRleGggPT09IDAgPyAwIDogKHJlY3QueSArIHJlY3Qud2lkdGgpIC8gdGV4aDtcbiAgICAgICAgICAgIGxldCB0ID0gdGV4aCA9PT0gMCA/IDAgOiByZWN0LnkgLyB0ZXhoO1xuICAgICAgICAgICAgdXZbMF0gPSBsO1xuICAgICAgICAgICAgdXZbMV0gPSB0O1xuICAgICAgICAgICAgdXZbMl0gPSBsO1xuICAgICAgICAgICAgdXZbM10gPSBiO1xuICAgICAgICAgICAgdXZbNF0gPSByO1xuICAgICAgICAgICAgdXZbNV0gPSB0O1xuICAgICAgICAgICAgdXZbNl0gPSByO1xuICAgICAgICAgICAgdXZbN10gPSBiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IGwgPSB0ZXh3ID09PSAwID8gMCA6IHJlY3QueCAvIHRleHc7XG4gICAgICAgICAgICBsZXQgciA9IHRleHcgPT09IDAgPyAwIDogKHJlY3QueCArIHJlY3Qud2lkdGgpIC8gdGV4dztcbiAgICAgICAgICAgIGxldCBiID0gdGV4aCA9PT0gMCA/IDAgOiAocmVjdC55ICsgcmVjdC5oZWlnaHQpIC8gdGV4aDtcbiAgICAgICAgICAgIGxldCB0ID0gdGV4aCA9PT0gMCA/IDAgOiByZWN0LnkgLyB0ZXhoO1xuICAgICAgICAgICAgdXZbMF0gPSBsO1xuICAgICAgICAgICAgdXZbMV0gPSBiO1xuICAgICAgICAgICAgdXZbMl0gPSByO1xuICAgICAgICAgICAgdXZbM10gPSBiO1xuICAgICAgICAgICAgdXZbNF0gPSBsO1xuICAgICAgICAgICAgdXZbNV0gPSB0O1xuICAgICAgICAgICAgdXZbNl0gPSByO1xuICAgICAgICAgICAgdXZbN10gPSB0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2ZsaXBYKSB7XG4gICAgICAgICAgICBsZXQgdGVtcFZhbCA9IHV2WzBdO1xuICAgICAgICAgICAgdXZbMF0gPSB1dlsyXTtcbiAgICAgICAgICAgIHV2WzJdID0gdGVtcFZhbDtcblxuICAgICAgICAgICAgdGVtcFZhbCA9IHV2WzFdO1xuICAgICAgICAgICAgdXZbMV0gPSB1dlszXTtcbiAgICAgICAgICAgIHV2WzNdID0gdGVtcFZhbDtcblxuICAgICAgICAgICAgdGVtcFZhbCA9IHV2WzRdO1xuICAgICAgICAgICAgdXZbNF0gPSB1dls2XTtcbiAgICAgICAgICAgIHV2WzZdID0gdGVtcFZhbDtcblxuICAgICAgICAgICAgdGVtcFZhbCA9IHV2WzVdO1xuICAgICAgICAgICAgdXZbNV0gPSB1dls3XTtcbiAgICAgICAgICAgIHV2WzddID0gdGVtcFZhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9mbGlwWSkge1xuICAgICAgICAgICAgbGV0IHRlbXBWYWwgPSB1dlswXTtcbiAgICAgICAgICAgIHV2WzBdID0gdXZbNF07XG4gICAgICAgICAgICB1dls0XSA9IHRlbXBWYWw7XG5cbiAgICAgICAgICAgIHRlbXBWYWwgPSB1dlsxXTtcbiAgICAgICAgICAgIHV2WzFdID0gdXZbNV07XG4gICAgICAgICAgICB1dls1XSA9IHRlbXBWYWw7XG5cbiAgICAgICAgICAgIHRlbXBWYWwgPSB1dlsyXTtcbiAgICAgICAgICAgIHV2WzJdID0gdXZbNl07XG4gICAgICAgICAgICB1dls2XSA9IHRlbXBWYWw7XG5cbiAgICAgICAgICAgIHRlbXBWYWwgPSB1dlszXTtcbiAgICAgICAgICAgIHV2WzNdID0gdXZbN107XG4gICAgICAgICAgICB1dls3XSA9IHRlbXBWYWw7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdmVydGljZXMgPSB0aGlzLnZlcnRpY2VzO1xuICAgICAgICBpZiAodmVydGljZXMpIHtcbiAgICAgICAgICAgIHZlcnRpY2VzLm51Lmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB2ZXJ0aWNlcy5udi5sZW5ndGggPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0aWNlcy51Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmVydGljZXMubnVbaV0gPSB2ZXJ0aWNlcy51W2ldL3RleHc7XG4gICAgICAgICAgICAgICAgdmVydGljZXMubnZbaV0gPSB2ZXJ0aWNlcy52W2ldL3RleGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jYWxjdWxhdGVTbGljZWRVVigpO1xuICAgIH0sXG5cbiAgICAvLyBTRVJJQUxJWkFUSU9OXG5cbiAgICBfc2VyaWFsaXplOiAoQ0NfRURJVE9SIHx8IENDX1RFU1QpICYmIGZ1bmN0aW9uIChleHBvcnRpbmcsIGN0eCkge1xuICAgICAgICBsZXQgcmVjdCA9IHRoaXMuX3JlY3Q7XG4gICAgICAgIGxldCBvZmZzZXQgPSB0aGlzLl9vZmZzZXQ7XG4gICAgICAgIGxldCBzaXplID0gdGhpcy5fb3JpZ2luYWxTaXplO1xuICAgICAgICBsZXQgdXVpZDtcbiAgICAgICAgbGV0IHRleHR1cmUgPSB0aGlzLl90ZXh0dXJlO1xuICAgICAgICBpZiAodGV4dHVyZSkge1xuICAgICAgICAgICAgdXVpZCA9IHRleHR1cmUuX3V1aWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF1dWlkKSB7XG4gICAgICAgICAgICBsZXQgdXJsID0gdGhpcy5fdGV4dHVyZUZpbGVuYW1lO1xuICAgICAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgICAgICAgIHV1aWQgPSBFZGl0b3IuVXRpbHMuVXVpZENhY2hlLnVybFRvVXVpZCh1cmwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh1dWlkICYmIGV4cG9ydGluZykge1xuICAgICAgICAgICAgdXVpZCA9IEVkaXRvci5VdGlscy5VdWlkVXRpbHMuY29tcHJlc3NVdWlkKHV1aWQsIHRydWUpO1xuICAgICAgICAgICAgY3R4LmRlcGVuZHNPbignX3RleHR1cmVTZXR0ZXInLCB1dWlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB2ZXJ0aWNlcztcbiAgICAgICAgaWYgKHRoaXMudmVydGljZXMpIHtcbiAgICAgICAgICAgIHZlcnRpY2VzID0ge1xuICAgICAgICAgICAgICAgIHRyaWFuZ2xlczogdGhpcy52ZXJ0aWNlcy50cmlhbmdsZXMsXG4gICAgICAgICAgICAgICAgeDogdGhpcy52ZXJ0aWNlcy54LFxuICAgICAgICAgICAgICAgIHk6IHRoaXMudmVydGljZXMueSxcbiAgICAgICAgICAgICAgICB1OiB0aGlzLnZlcnRpY2VzLnUsXG4gICAgICAgICAgICAgICAgdjogdGhpcy52ZXJ0aWNlcy52XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IHRoaXMuX25hbWUsXG4gICAgICAgICAgICB0ZXh0dXJlOiAoIWV4cG9ydGluZyAmJiB1dWlkKSB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICBhdGxhczogZXhwb3J0aW5nID8gdW5kZWZpbmVkIDogdGhpcy5fYXRsYXNVdWlkLCAgLy8gc3RyaXAgZnJvbSBqc29uIGlmIGV4cG9ydGluZ1xuICAgICAgICAgICAgcmVjdDogcmVjdCA/IFtyZWN0LngsIHJlY3QueSwgcmVjdC53aWR0aCwgcmVjdC5oZWlnaHRdIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgb2Zmc2V0OiBvZmZzZXQgPyBbb2Zmc2V0LngsIG9mZnNldC55XSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIG9yaWdpbmFsU2l6ZTogc2l6ZSA/IFtzaXplLndpZHRoLCBzaXplLmhlaWdodF0gOiB1bmRlZmluZWQsXG4gICAgICAgICAgICByb3RhdGVkOiB0aGlzLl9yb3RhdGVkID8gMSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGNhcEluc2V0czogdGhpcy5fY2FwSW5zZXRzLFxuICAgICAgICAgICAgdmVydGljZXM6IHZlcnRpY2VzXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIF9kZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGRhdGEsIGhhbmRsZSkge1xuICAgICAgICBsZXQgcmVjdCA9IGRhdGEucmVjdDtcbiAgICAgICAgaWYgKHJlY3QpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlY3QgPSBuZXcgY2MuUmVjdChyZWN0WzBdLCByZWN0WzFdLCByZWN0WzJdLCByZWN0WzNdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS5vZmZzZXQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0T2Zmc2V0KG5ldyBjYy5WZWMyKGRhdGEub2Zmc2V0WzBdLCBkYXRhLm9mZnNldFsxXSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLm9yaWdpbmFsU2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5zZXRPcmlnaW5hbFNpemUobmV3IGNjLlNpemUoZGF0YS5vcmlnaW5hbFNpemVbMF0sIGRhdGEub3JpZ2luYWxTaXplWzFdKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcm90YXRlZCA9IGRhdGEucm90YXRlZCA9PT0gMTtcbiAgICAgICAgdGhpcy5fbmFtZSA9IGRhdGEubmFtZTtcblxuICAgICAgICBsZXQgY2FwSW5zZXRzID0gZGF0YS5jYXBJbnNldHM7XG4gICAgICAgIGlmIChjYXBJbnNldHMpIHtcbiAgICAgICAgICAgIHRoaXMuX2NhcEluc2V0c1tJTlNFVF9MRUZUXSA9IGNhcEluc2V0c1tJTlNFVF9MRUZUXTtcbiAgICAgICAgICAgIHRoaXMuX2NhcEluc2V0c1tJTlNFVF9UT1BdID0gY2FwSW5zZXRzW0lOU0VUX1RPUF07XG4gICAgICAgICAgICB0aGlzLl9jYXBJbnNldHNbSU5TRVRfUklHSFRdID0gY2FwSW5zZXRzW0lOU0VUX1JJR0hUXTtcbiAgICAgICAgICAgIHRoaXMuX2NhcEluc2V0c1tJTlNFVF9CT1RUT01dID0gY2FwSW5zZXRzW0lOU0VUX0JPVFRPTV07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB0aGlzLl9hdGxhc1V1aWQgPSBkYXRhLmF0bGFzO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy52ZXJ0aWNlcyA9IGRhdGEudmVydGljZXM7XG4gICAgICAgIGlmICh0aGlzLnZlcnRpY2VzKSB7XG4gICAgICAgICAgICAvLyBpbml0aWFsaXplIG5vcm1hbCB1diBhcnJheXNcbiAgICAgICAgICAgIHRoaXMudmVydGljZXMubnUgPSBbXTtcbiAgICAgICAgICAgIHRoaXMudmVydGljZXMubnYgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghQ0NfQlVJTEQpIHtcbiAgICAgICAgICAgIC8vIG1hbnVhbGx5IGxvYWQgdGV4dHVyZSB2aWEgX3RleHR1cmVTZXR0ZXJcbiAgICAgICAgICAgIGxldCB0ZXh0dXJlVXVpZCA9IGRhdGEudGV4dHVyZTtcbiAgICAgICAgICAgIGlmICh0ZXh0dXJlVXVpZCkge1xuICAgICAgICAgICAgICAgIGhhbmRsZS5yZXN1bHQucHVzaCh0aGlzLCAnX3RleHR1cmVTZXR0ZXInLCB0ZXh0dXJlVXVpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxubGV0IHByb3RvID0gU3ByaXRlRnJhbWUucHJvdG90eXBlO1xuXG5wcm90by5jb3B5V2l0aFpvbmUgPSBwcm90by5jbG9uZTtcbnByb3RvLmNvcHkgPSBwcm90by5jbG9uZTtcbnByb3RvLmluaXRXaXRoVGV4dHVyZSA9IHByb3RvLnNldFRleHR1cmU7XG5cbmNjLlNwcml0ZUZyYW1lID0gU3ByaXRlRnJhbWU7XG5cbm1vZHVsZS5leHBvcnRzID0gU3ByaXRlRnJhbWU7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==