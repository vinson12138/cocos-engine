
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCTexture2D.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _gfx = _interopRequireDefault(require("../../renderer/gfx"));

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
var EventTarget = require('../event/event-target');

var renderer = require('../renderer');

require('../platform/CCClass');

var GL_NEAREST = 9728; // gl.NEAREST

var GL_LINEAR = 9729; // gl.LINEAR

var GL_REPEAT = 10497; // gl.REPEAT

var GL_CLAMP_TO_EDGE = 33071; // gl.CLAMP_TO_EDGE

var GL_MIRRORED_REPEAT = 33648; // gl.MIRRORED_REPEAT

var GL_RGBA = 6408; // gl.RGBA

var CHAR_CODE_0 = 48; // '0'

var CHAR_CODE_1 = 49; // '1'

var idGenerater = new (require('../platform/id-generater'))('Tex');
/**
 * <p>
 * This class allows to easily create OpenGL or Canvas 2D textures from images, text or raw data.                                    <br/>
 * The created cc.Texture2D object will always have power-of-two dimensions.                                                <br/>
 * Depending on how you create the cc.Texture2D object, the actual image area of the texture might be smaller than the texture dimensions <br/>
 *  i.e. "contentSize" != (pixelsWide, pixelsHigh) and (maxS, maxT) != (1.0, 1.0).                                           <br/>
 * Be aware that the content of the generated textures will be upside-down! </p>

 * @class Texture2D
 * @uses EventTarget
 * @extends Asset
 */
// define a specified number for the pixel format which gfx do not have a standard definition.

var CUSTOM_PIXEL_FORMAT = 1024;
/**
 * The texture pixel format, default value is RGBA8888, 
 * you should note that textures loaded by normal image files (png, jpg) can only support RGBA8888 format,
 * other formats are supported by compressed file types or raw data.
 * @enum Texture2D.PixelFormat
 */

var PixelFormat = cc.Enum({
  /**
   * 16-bit texture without Alpha channel
   * @property RGB565
   * @readonly
   * @type {Number}
   */
  RGB565: _gfx["default"].TEXTURE_FMT_R5_G6_B5,

  /**
   * 16-bit textures: RGB5A1
   * @property RGB5A1
   * @readonly
   * @type {Number}
   */
  RGB5A1: _gfx["default"].TEXTURE_FMT_R5_G5_B5_A1,

  /**
   * 16-bit textures: RGBA4444
   * @property RGBA4444
   * @readonly
   * @type {Number}
   */
  RGBA4444: _gfx["default"].TEXTURE_FMT_R4_G4_B4_A4,

  /**
   * 24-bit texture: RGB888
   * @property RGB888
   * @readonly
   * @type {Number}
   */
  RGB888: _gfx["default"].TEXTURE_FMT_RGB8,

  /**
   * 32-bit texture: RGBA8888
   * @property RGBA8888
   * @readonly
   * @type {Number}
   */
  RGBA8888: _gfx["default"].TEXTURE_FMT_RGBA8,

  /**
   * 32-bit float texture: RGBA32F
   * @property RGBA32F
   * @readonly
   * @type {Number}
   */
  RGBA32F: _gfx["default"].TEXTURE_FMT_RGBA32F,

  /**
   * 8-bit textures used as masks
   * @property A8
   * @readonly
   * @type {Number}
   */
  A8: _gfx["default"].TEXTURE_FMT_A8,

  /**
   * 8-bit intensity texture
   * @property I8
   * @readonly
   * @type {Number}
   */
  I8: _gfx["default"].TEXTURE_FMT_L8,

  /**
   * 16-bit textures used as masks
   * @property AI88
   * @readonly
   * @type {Number}
   */
  AI8: _gfx["default"].TEXTURE_FMT_L8_A8,

  /**
   * rgb 2 bpp pvrtc
   * @property RGB_PVRTC_2BPPV1
   * @readonly
   * @type {Number}
   */
  RGB_PVRTC_2BPPV1: _gfx["default"].TEXTURE_FMT_RGB_PVRTC_2BPPV1,

  /**
   * rgba 2 bpp pvrtc
   * @property RGBA_PVRTC_2BPPV1
   * @readonly
   * @type {Number}
   */
  RGBA_PVRTC_2BPPV1: _gfx["default"].TEXTURE_FMT_RGBA_PVRTC_2BPPV1,

  /**
   * rgb separate a 2 bpp pvrtc
   * RGB_A_PVRTC_2BPPV1 texture is a 2x height RGB_PVRTC_2BPPV1 format texture.
   * It separate the origin alpha channel to the bottom half atlas, the origin rgb channel to the top half atlas
   * @property RGB_A_PVRTC_2BPPV1
   * @readonly
   * @type {Number}
   */
  RGB_A_PVRTC_2BPPV1: CUSTOM_PIXEL_FORMAT++,

  /**
   * rgb 4 bpp pvrtc
   * @property RGB_PVRTC_4BPPV1
   * @readonly
   * @type {Number}
   */
  RGB_PVRTC_4BPPV1: _gfx["default"].TEXTURE_FMT_RGB_PVRTC_4BPPV1,

  /**
   * rgba 4 bpp pvrtc
   * @property RGBA_PVRTC_4BPPV1
   * @readonly
   * @type {Number}
   */
  RGBA_PVRTC_4BPPV1: _gfx["default"].TEXTURE_FMT_RGBA_PVRTC_4BPPV1,

  /**
   * rgb a 4 bpp pvrtc
   * RGB_A_PVRTC_4BPPV1 texture is a 2x height RGB_PVRTC_4BPPV1 format texture.
   * It separate the origin alpha channel to the bottom half atlas, the origin rgb channel to the top half atlas
   * @property RGB_A_PVRTC_4BPPV1
   * @readonly
   * @type {Number}
   */
  RGB_A_PVRTC_4BPPV1: CUSTOM_PIXEL_FORMAT++,

  /**
   * rgb etc1
   * @property RGB_ETC1
   * @readonly
   * @type {Number}
   */
  RGB_ETC1: _gfx["default"].TEXTURE_FMT_RGB_ETC1,

  /**
   * rgba etc1
   * @property RGBA_ETC1
   * @readonly
   * @type {Number}
   */
  RGBA_ETC1: CUSTOM_PIXEL_FORMAT++,

  /**
   * rgb etc2
   * @property RGB_ETC2
   * @readonly
   * @type {Number}
   */
  RGB_ETC2: _gfx["default"].TEXTURE_FMT_RGB_ETC2,

  /**
   * rgba etc2
   * @property RGBA_ETC2
   * @readonly
   * @type {Number}
   */
  RGBA_ETC2: _gfx["default"].TEXTURE_FMT_RGBA_ETC2
});
/**
 * The texture wrap mode
 * @enum Texture2D.WrapMode
 */

var WrapMode = cc.Enum({
  /**
   * The constant variable equals gl.REPEAT for texture
   * @property REPEAT
   * @type {Number}
   * @readonly
   */
  REPEAT: GL_REPEAT,

  /**
   * The constant variable equals gl.CLAMP_TO_EDGE for texture
   * @property CLAMP_TO_EDGE
   * @type {Number}
   * @readonly
   */
  CLAMP_TO_EDGE: GL_CLAMP_TO_EDGE,

  /**
   * The constant variable equals gl.MIRRORED_REPEAT for texture
   * @property MIRRORED_REPEAT
   * @type {Number}
   * @readonly
   */
  MIRRORED_REPEAT: GL_MIRRORED_REPEAT
});
/**
 * The texture filter mode
 * @enum Texture2D.Filter
 */

var Filter = cc.Enum({
  /**
   * The constant variable equals gl.LINEAR for texture
   * @property LINEAR
   * @type {Number}
   * @readonly
   */
  LINEAR: GL_LINEAR,

  /**
   * The constant variable equals gl.NEAREST for texture
   * @property NEAREST
   * @type {Number}
   * @readonly
   */
  NEAREST: GL_NEAREST
});
var FilterIndex = {
  9728: 0,
  // GL_NEAREST
  9729: 1 // GL_LINEAR

};
var _images = [];
var _sharedOpts = {
  width: undefined,
  height: undefined,
  minFilter: undefined,
  magFilter: undefined,
  wrapS: undefined,
  wrapT: undefined,
  format: undefined,
  genMipmaps: undefined,
  images: undefined,
  image: undefined,
  flipY: undefined,
  premultiplyAlpha: undefined
};

function _getSharedOptions() {
  for (var key in _sharedOpts) {
    _sharedOpts[key] = undefined;
  }

  _images.length = 0;
  _sharedOpts.images = _images;
  return _sharedOpts;
}
/**
 * This class allows to easily create OpenGL or Canvas 2D textures from images or raw data.
 *
 * @class Texture2D
 * @uses EventTarget
 * @extends Asset
 */


var Texture2D = cc.Class({
  name: 'cc.Texture2D',
  "extends": require('../assets/CCAsset'),
  mixins: [EventTarget],
  properties: {
    _nativeAsset: {
      get: function get() {
        // maybe returned to pool in webgl
        return this._image;
      },
      set: function set(data) {
        if (data._compressed && data._data) {
          this.initWithData(data._data, this._format, data.width, data.height);
        } else {
          this.initWithElement(data);
        }
      },
      override: true
    },
    _format: PixelFormat.RGBA8888,
    _premultiplyAlpha: false,
    _flipY: false,
    _minFilter: Filter.LINEAR,
    _magFilter: Filter.LINEAR,
    _mipFilter: Filter.LINEAR,
    _wrapS: WrapMode.CLAMP_TO_EDGE,
    _wrapT: WrapMode.CLAMP_TO_EDGE,
    _isAlphaAtlas: false,
    _genMipmaps: false,

    /**
     * !#en Sets whether generate mipmaps for the texture
     * !#zh 是否为纹理设置生成 mipmaps。
     * @property {Boolean} genMipmaps
     * @default false
     */
    genMipmaps: {
      get: function get() {
        return this._genMipmaps;
      },
      set: function set(genMipmaps) {
        if (this._genMipmaps !== genMipmaps) {
          var opts = _getSharedOptions();

          opts.genMipmaps = genMipmaps;
          this.update(opts);
        }
      }
    },
    _packable: true,

    /**
     * !#en 
     * Sets whether texture can be packed into texture atlas.
     * If need use texture uv in custom Effect, please sets packable to false.
     * !#zh 
     * 设置纹理是否允许参与合图。
     * 如果需要在自定义 Effect 中使用纹理 UV，需要禁止该选项。
     * @property {Boolean} packable
     * @default true
     */
    packable: {
      get: function get() {
        return this._packable;
      },
      set: function set(val) {
        this._packable = val;
      }
    },
    _nativeDep: {
      get: function get() {
        return {
          __isNative__: true,
          uuid: this._uuid,
          ext: this._native,
          __flipY__: this._flipY,
          __premultiplyAlpha__: this._premultiplyAlpha
        };
      },
      override: true
    }
  },
  statics: {
    PixelFormat: PixelFormat,
    WrapMode: WrapMode,
    Filter: Filter,
    _FilterIndex: FilterIndex,
    // predefined most common extnames
    extnames: ['.png', '.jpg', '.jpeg', '.bmp', '.webp', '.pvr', '.pkm'],
    _parseExt: function _parseExt(extIdStr, defaultFormat) {
      var device = cc.renderer.device;
      var extIds = extIdStr.split('_');
      var defaultExt = '';
      var bestExt = '';
      var bestIndex = 999;
      var bestFormat = defaultFormat;
      var SupportTextureFormats = cc.macro.SUPPORT_TEXTURE_FORMATS;

      for (var i = 0; i < extIds.length; i++) {
        var extFormat = extIds[i].split('@');
        var tmpExt = extFormat[0];
        tmpExt = Texture2D.extnames[tmpExt.charCodeAt(0) - CHAR_CODE_0] || tmpExt;
        var index = SupportTextureFormats.indexOf(tmpExt);

        if (index !== -1 && index < bestIndex) {
          var tmpFormat = extFormat[1] ? parseInt(extFormat[1]) : defaultFormat; // check whether or not support compressed texture

          if (tmpExt === '.pvr' && !device.ext('WEBGL_compressed_texture_pvrtc')) {
            continue;
          } else if ((tmpFormat === PixelFormat.RGB_ETC1 || tmpFormat === PixelFormat.RGBA_ETC1) && !device.ext('WEBGL_compressed_texture_etc1')) {
            continue;
          } else if ((tmpFormat === PixelFormat.RGB_ETC2 || tmpFormat === PixelFormat.RGBA_ETC2) && !device.ext('WEBGL_compressed_texture_etc')) {
            continue;
          } else if (tmpExt === '.webp' && !cc.sys.capabilities.webp) {
            continue;
          }

          bestIndex = index;
          bestExt = tmpExt;
          bestFormat = tmpFormat;
        } else if (!defaultExt) {
          defaultExt = tmpExt;
        }
      }

      return {
        bestExt: bestExt,
        bestFormat: bestFormat,
        defaultExt: defaultExt
      };
    }
  },
  ctor: function ctor() {
    // Id for generate hash in material
    this._id = idGenerater.getNewId();
    /**
     * !#en
     * Whether the texture is loaded or not
     * !#zh
     * 贴图是否已经成功加载
     * @property loaded
     * @type {Boolean}
     */

    this.loaded = false;
    /**
     * !#en
     * Texture width in pixel
     * !#zh
     * 贴图像素宽度
     * @property width
     * @type {Number}
     */

    this.width = 0;
    /**
     * !#en
     * Texture height in pixel
     * !#zh
     * 贴图像素高度
     * @property height
     * @type {Number}
     */

    this.height = 0;
    this._hashDirty = true;
    this._hash = 0;
    this._texture = null;

    if (CC_EDITOR) {
      this._exportedExts = null;
    }
  },

  /**
   * !#en
   * Get renderer texture implementation object
   * extended from render.Texture2D
   * !#zh  返回渲染器内部贴图对象
   * @method getImpl
   */
  getImpl: function getImpl() {
    if (!this._texture) this._texture = new renderer.Texture2D(renderer.device, {});
    return this._texture;
  },
  getId: function getId() {
    return this._id;
  },
  toString: function toString() {
    return this.nativeUrl || '';
  },

  /**
   * Update texture options, not available in Canvas render mode.
   * image, format, premultiplyAlpha can not be updated in native.
   * @method update
   * @param {Object} options
   * @param {DOMImageElement} options.image
   * @param {Boolean} options.genMipmaps
   * @param {PixelFormat} options.format
   * @param {Filter} options.minFilter
   * @param {Filter} options.magFilter
   * @param {WrapMode} options.wrapS
   * @param {WrapMode} options.wrapT
   * @param {Boolean} options.premultiplyAlpha
   */
  update: function update(options) {
    if (options) {
      var updateImg = false;

      if (options.width !== undefined) {
        this.width = options.width;
      }

      if (options.height !== undefined) {
        this.height = options.height;
      }

      if (options.minFilter !== undefined) {
        this._minFilter = options.minFilter;
        options.minFilter = FilterIndex[options.minFilter];
      }

      if (options.magFilter !== undefined) {
        this._magFilter = options.magFilter;
        options.magFilter = FilterIndex[options.magFilter];
      }

      if (options.mipFilter !== undefined) {
        this._mipFilter = options.mipFilter;
        options.mipFilter = FilterIndex[options.mipFilter];
      }

      if (options.wrapS !== undefined) {
        this._wrapS = options.wrapS;
      }

      if (options.wrapT !== undefined) {
        this._wrapT = options.wrapT;
      }

      if (options.format !== undefined) {
        this._format = options.format;
      }

      if (options.flipY !== undefined) {
        this._flipY = options.flipY;
        updateImg = true;
      }

      if (options.premultiplyAlpha !== undefined) {
        this._premultiplyAlpha = options.premultiplyAlpha;
        updateImg = true;
      }

      if (options.genMipmaps !== undefined) {
        this._genMipmaps = options.genMipmaps;
      }

      if (cc.sys.capabilities.imageBitmap && this._image instanceof ImageBitmap) {
        this._checkImageBitmap(this._upload.bind(this, options, updateImg));
      } else {
        this._upload(options, updateImg);
      }
    }
  },
  _upload: function _upload(options, updateImg) {
    if (updateImg && this._image) {
      options.image = this._image;
    }

    if (options.images && options.images.length > 0) {
      this._image = options.images[0];
    } else if (options.image !== undefined) {
      this._image = options.image;

      if (!options.images) {
        _images.length = 0;
        options.images = _images;
      } // webgl texture 2d uses images


      options.images.push(options.image);
    }

    this._texture && this._texture.update(options);
    this._hashDirty = true;
  },

  /**
   * !#en
   * Init with HTML element.
   * !#zh 用 HTML Image 或 Canvas 对象初始化贴图。
   * @method initWithElement
   * @param {HTMLImageElement|HTMLCanvasElement} element
   * @example
   * var img = new Image();
   * img.src = dataURL;
   * texture.initWithElement(img);
   */
  initWithElement: function initWithElement(element) {
    if (!element) return;
    this._image = element;

    if (element.complete || element instanceof HTMLCanvasElement) {
      this.handleLoadedTexture();
    } else if (cc.sys.capabilities.imageBitmap && element instanceof ImageBitmap) {
      this._checkImageBitmap(this.handleLoadedTexture.bind(this));
    } else {
      var self = this;
      element.addEventListener('load', function () {
        self.handleLoadedTexture();
      });
      element.addEventListener('error', function (err) {
        cc.warnID(3119, err.message);
      });
    }
  },

  /**
   * !#en
   * Intializes with texture data in ArrayBufferView.
   * !#zh 使用一个存储在 ArrayBufferView 中的图像数据（raw data）初始化数据。
   * @method initWithData
   * @param {ArrayBufferView} data
   * @param {Number} pixelFormat
   * @param {Number} pixelsWidth
   * @param {Number} pixelsHeight
   * @return {Boolean}
   */
  initWithData: function initWithData(data, pixelFormat, pixelsWidth, pixelsHeight) {
    var opts = _getSharedOptions();

    opts.image = data; // webgl texture 2d uses images

    opts.images = [opts.image];
    opts.genMipmaps = this._genMipmaps;
    opts.premultiplyAlpha = this._premultiplyAlpha;
    opts.flipY = this._flipY;
    opts.minFilter = FilterIndex[this._minFilter];
    opts.magFilter = FilterIndex[this._magFilter];
    opts.wrapS = this._wrapS;
    opts.wrapT = this._wrapT;
    opts.format = this._getGFXPixelFormat(pixelFormat);
    opts.width = pixelsWidth;
    opts.height = pixelsHeight;

    if (!this._texture) {
      this._texture = new renderer.Texture2D(renderer.device, opts);
    } else {
      this._texture.update(opts);
    }

    this.width = pixelsWidth;
    this.height = pixelsHeight;

    this._updateFormat();

    this._checkPackable();

    this.loaded = true;
    this.emit("load");
    return true;
  },

  /**
   * !#en
   * HTMLElement Object getter, available only on web.<br/>
   * Note: texture is packed into texture atlas by default<br/>
   * you should set texture.packable as false before getting Html element object.
   * !#zh 获取当前贴图对应的 HTML Image 或 Canvas 对象，只在 Web 平台下有效。<br/>
   * 注意：<br/>
   * texture 默认参与动态合图，如果需要获取到正确的 Html 元素对象，需要先设置 texture.packable 为 false
   * @method getHtmlElementObj
   * @return {HTMLImageElement|HTMLCanvasElement}
   */
  getHtmlElementObj: function getHtmlElementObj() {
    return this._image;
  },

  /**
   * !#en
   * Destory this texture and immediately release its video memory. (Inherit from cc.Object.destroy)<br>
   * After destroy, this object is not usable anymore.
   * You can use cc.isValid(obj) to check whether the object is destroyed before accessing it.
   * !#zh
   * 销毁该贴图，并立即释放它对应的显存。（继承自 cc.Object.destroy）<br/>
   * 销毁后，该对象不再可用。您可以在访问对象之前使用 cc.isValid(obj) 来检查对象是否已被销毁。
   * @method destroy
   * @return {Boolean} inherit from the CCObject
   */
  destroy: function destroy() {
    if (cc.sys.capabilities.imageBitmap && this._image instanceof ImageBitmap) {
      this._image.close && this._image.close();
    }

    this._packable && cc.dynamicAtlasManager && cc.dynamicAtlasManager.deleteAtlasTexture(this);
    this._image = null;
    this._texture && this._texture.destroy();

    this._super();
  },

  /**
   * !#en
   * Pixel format of the texture.
   * !#zh 获取纹理的像素格式。
   * @method getPixelFormat
   * @return {Number}
   */
  getPixelFormat: function getPixelFormat() {
    //support only in WebGl rendering mode
    return this._format;
  },

  /**
   * !#en
   * Whether or not the texture has their Alpha premultiplied.
   * !#zh 检查纹理在上传 GPU 时预乘选项是否开启。
   * @method hasPremultipliedAlpha
   * @return {Boolean}
   */
  hasPremultipliedAlpha: function hasPremultipliedAlpha() {
    return this._premultiplyAlpha || false;
  },
  isAlphaAtlas: function isAlphaAtlas() {
    return this._isAlphaAtlas;
  },

  /**
   * !#en
   * Handler of texture loaded event.
   * Since v2.0, you don't need to invoke this function, it will be invoked automatically after texture loaded.
   * !#zh 贴图加载事件处理器。v2.0 之后你将不在需要手动执行这个函数，它会在贴图加载成功之后自动执行。
   * @method handleLoadedTexture
   * @param {Boolean} [premultiplied]
   */
  handleLoadedTexture: function handleLoadedTexture() {
    if (!this._image || !this._image.width || !this._image.height) return;
    this.width = this._image.width;
    this.height = this._image.height;

    var opts = _getSharedOptions();

    opts.image = this._image; // webgl texture 2d uses images

    opts.images = [opts.image];
    opts.width = this.width;
    opts.height = this.height;
    opts.genMipmaps = this._genMipmaps;
    opts.format = this._getGFXPixelFormat(this._format);
    opts.premultiplyAlpha = this._premultiplyAlpha;
    opts.flipY = this._flipY;
    opts.minFilter = FilterIndex[this._minFilter];
    opts.magFilter = FilterIndex[this._magFilter];
    opts.wrapS = this._wrapS;
    opts.wrapT = this._wrapT;

    if (!this._texture) {
      this._texture = new renderer.Texture2D(renderer.device, opts);
    } else {
      this._texture.update(opts);
    }

    this._updateFormat();

    this._checkPackable(); //dispatch load event to listener.


    this.loaded = true;
    this.emit("load");

    if (cc.macro.CLEANUP_IMAGE_CACHE) {
      if (this._image instanceof HTMLImageElement) {
        this._clearImage();
      } else if (cc.sys.capabilities.imageBitmap && this._image instanceof ImageBitmap) {
        this._image.close && this._image.close();
      }
    }
  },

  /**
   * !#en
   * Description of cc.Texture2D.
   * !#zh cc.Texture2D 描述。
   * @method description
   * @returns {String}
   */
  description: function description() {
    return "<cc.Texture2D | Name = " + this.nativeUrl + " | Dimensions = " + this.width + " x " + this.height + ">";
  },

  /**
   * !#en
   * Release texture, please use destroy instead.
   * !#zh 释放纹理，请使用 destroy 替代。
   * @method releaseTexture
   * @deprecated since v2.0
   */
  releaseTexture: function releaseTexture() {
    this._image = null;
    this._texture && this._texture.destroy();
  },

  /**
   * !#en Sets the wrap s and wrap t options. <br/>
   * If the texture size is NPOT (non power of 2), then in can only use gl.CLAMP_TO_EDGE in gl.TEXTURE_WRAP_{S,T}.
   * !#zh 设置纹理包装模式。
   * 若纹理贴图尺寸是 NPOT（non power of 2），则只能使用 Texture2D.WrapMode.CLAMP_TO_EDGE。
   * @method setWrapMode
   * @param {Texture2D.WrapMode} wrapS
   * @param {Texture2D.WrapMode} wrapT
   */
  setWrapMode: function setWrapMode(wrapS, wrapT) {
    if (this._wrapS !== wrapS || this._wrapT !== wrapT) {
      var opts = _getSharedOptions();

      opts.wrapS = wrapS;
      opts.wrapT = wrapT;
      this.update(opts);
    }
  },

  /**
   * !#en Sets the minFilter and magFilter options
   * !#zh 设置纹理贴图缩小和放大过滤器算法选项。
   * @method setFilters
   * @param {Texture2D.Filter} minFilter
   * @param {Texture2D.Filter} magFilter
   */
  setFilters: function setFilters(minFilter, magFilter) {
    if (this._minFilter !== minFilter || this._magFilter !== magFilter) {
      var opts = _getSharedOptions();

      opts.minFilter = minFilter;
      opts.magFilter = magFilter;
      this.update(opts);
    }
  },

  /**
   * !#en
   * Sets the flipY options
   * !#zh 设置贴图的纵向翻转选项。
   * @method setFlipY
   * @param {Boolean} flipY
   */
  setFlipY: function setFlipY(flipY) {
    if (this._flipY !== flipY) {
      var opts = _getSharedOptions();

      opts.flipY = flipY;
      opts.premultiplyAlpha = this._premultiplyAlpha;
      this.update(opts);
    }
  },

  /**
   * !#en
   * Sets the premultiply alpha options
   * !#zh 设置贴图的预乘选项。
   * @method setPremultiplyAlpha
   * @param {Boolean} premultiply
   */
  setPremultiplyAlpha: function setPremultiplyAlpha(premultiply) {
    if (this._premultiplyAlpha !== premultiply) {
      var opts = _getSharedOptions();

      opts.flipY = this._flipY;
      opts.premultiplyAlpha = premultiply;
      this.update(opts);
    }
  },
  _updateFormat: function _updateFormat() {
    this._isAlphaAtlas = this._format === PixelFormat.RGBA_ETC1 || this._format === PixelFormat.RGB_A_PVRTC_4BPPV1 || this._format === PixelFormat.RGB_A_PVRTC_2BPPV1;

    if (CC_JSB) {
      this._texture.setAlphaAtlas(this._isAlphaAtlas);
    }
  },
  _checkPackable: function _checkPackable() {
    var dynamicAtlas = cc.dynamicAtlasManager;
    if (!dynamicAtlas) return;

    if (this._isCompressed()) {
      this._packable = false;
      return;
    }

    var w = this.width,
        h = this.height;

    if (!this._image || w > dynamicAtlas.maxFrameSize || h > dynamicAtlas.maxFrameSize || this._getHash() !== dynamicAtlas.Atlas.DEFAULT_HASH) {
      this._packable = false;
      return;
    }

    if (this._image && this._image instanceof HTMLCanvasElement) {
      this._packable = true;
    }
  },
  _getOpts: function _getOpts() {
    var opts = _getSharedOptions();

    opts.width = this.width;
    opts.height = this.height;
    opts.genMipmaps = this._genMipmaps;
    opts.format = this._format;
    opts.premultiplyAlpha = this._premultiplyAlpha;
    opts.anisotropy = this._anisotropy;
    opts.flipY = this._flipY;
    opts.minFilter = FilterIndex[this._minFilter];
    opts.magFilter = FilterIndex[this._magFilter];
    opts.mipFilter = FilterIndex[this._mipFilter];
    opts.wrapS = this._wrapS;
    opts.wrapT = this._wrapT;
    return opts;
  },
  _getGFXPixelFormat: function _getGFXPixelFormat(format) {
    if (format === PixelFormat.RGBA_ETC1) {
      format = PixelFormat.RGB_ETC1;
    } else if (format === PixelFormat.RGB_A_PVRTC_4BPPV1) {
      format = PixelFormat.RGB_PVRTC_4BPPV1;
    } else if (format === PixelFormat.RGB_A_PVRTC_2BPPV1) {
      format = PixelFormat.RGB_PVRTC_2BPPV1;
    }

    return format;
  },
  _resetUnderlyingMipmaps: function _resetUnderlyingMipmaps(mipmapSources) {
    var opts = this._getOpts();

    opts.images = mipmapSources || [null];

    if (!this._texture) {
      this._texture = new renderer.Texture2D(renderer.device, opts);
    } else {
      this._texture.update(opts);
    }
  },
  // SERIALIZATION
  _serialize: (CC_EDITOR || CC_TEST) && function () {
    var extId = "";
    var exportedExts = this._exportedExts;

    if (!exportedExts && this._native) {
      exportedExts = [this._native];
    }

    if (exportedExts) {
      var exts = [];

      for (var i = 0; i < exportedExts.length; i++) {
        var _extId = "";
        var ext = exportedExts[i];

        if (ext) {
          // ext@format
          var extFormat = ext.split('@');
          _extId = Texture2D.extnames.indexOf(extFormat[0]);

          if (_extId < 0) {
            _extId = ext;
          }

          if (extFormat[1]) {
            _extId += '@' + extFormat[1];
          }
        }

        exts.push(_extId);
      }

      extId = exts.join('_');
    }

    var asset = extId + "," + this._minFilter + "," + this._magFilter + "," + this._wrapS + "," + this._wrapT + "," + ((this._premultiplyAlpha ? 1 : 0) + "," + (this._genMipmaps ? 1 : 0) + "," + (this._packable ? 1 : 0));
    return asset;
  },
  _deserialize: function _deserialize(data) {
    var fields = data.split(','); // decode extname

    var extIdStr = fields[0];

    if (extIdStr) {
      var result = Texture2D._parseExt(extIdStr, this._format);

      if (result.bestExt) {
        this._setRawAsset(result.bestExt);

        this._format = result.bestFormat;
      } else if (result.defaultExt) {
        this._setRawAsset(result.defaultExt);

        cc.warnID(3120, result.defaultExt, result.defaultExt);
      } else {
        throw new Error(cc.debug.getError(3121));
      }
    }

    if (fields.length === 8) {
      // decode filters
      this._minFilter = parseInt(fields[1]);
      this._magFilter = parseInt(fields[2]); // decode wraps

      this._wrapS = parseInt(fields[3]);
      this._wrapT = parseInt(fields[4]); // decode premultiply alpha

      this._premultiplyAlpha = fields[5].charCodeAt(0) === CHAR_CODE_1;
      this._genMipmaps = fields[6].charCodeAt(0) === CHAR_CODE_1;
      this._packable = fields[7].charCodeAt(0) === CHAR_CODE_1;
    }
  },
  _getHash: function _getHash() {
    if (!this._hashDirty) {
      return this._hash;
    }

    var genMipmaps = this._genMipmaps ? 1 : 0;
    var premultiplyAlpha = this._premultiplyAlpha ? 1 : 0;
    var flipY = this._flipY ? 1 : 0;
    var minFilter = this._minFilter === Filter.LINEAR ? 1 : 2;
    var magFilter = this._magFilter === Filter.LINEAR ? 1 : 2;
    var wrapS = this._wrapS === WrapMode.REPEAT ? 1 : this._wrapS === WrapMode.CLAMP_TO_EDGE ? 2 : 3;
    var wrapT = this._wrapT === WrapMode.REPEAT ? 1 : this._wrapT === WrapMode.CLAMP_TO_EDGE ? 2 : 3;
    var pixelFormat = this._format;
    var image = this._image;

    if (CC_JSB && image) {
      if (image._glFormat && image._glFormat !== GL_RGBA) pixelFormat = 0;
      premultiplyAlpha = image._premultiplyAlpha ? 1 : 0;
    }

    this._hash = Number("" + minFilter + magFilter + pixelFormat + wrapS + wrapT + genMipmaps + premultiplyAlpha + flipY);
    this._hashDirty = false;
    return this._hash;
  },
  _isCompressed: function _isCompressed() {
    return this._format < PixelFormat.A8 || this._format > PixelFormat.RGBA32F;
  },
  _clearImage: function _clearImage() {
    this._image.src = "";
  },
  _checkImageBitmap: function _checkImageBitmap(cb) {
    var _this = this;

    var image = this._image;
    var flipY = this._flipY;
    var premultiplyAlpha = this._premultiplyAlpha;

    if (this._flipY !== image.flipY || this._premultiplyAlpha !== image.premultiplyAlpha) {
      createImageBitmap(image, {
        imageOrientation: flipY !== image.flipY ? 'flipY' : 'none',
        premultiplyAlpha: premultiplyAlpha ? 'premultiply' : 'none'
      }).then(function (result) {
        image.close && image.close();
        result.flipY = flipY;
        result.premultiplyAlpha = premultiplyAlpha;
        _this._image = result;
        cb();
      }, function (err) {
        cc.error(err.message);
      });
    } else {
      cb();
    }
  }
});
/**
 * !#zh
 * 当该资源加载成功后触发该事件
 * !#en
 * This event is emitted when the asset is loaded
 *
 * @event load
 */

cc.Texture2D = module.exports = Texture2D;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0cy9DQ1RleHR1cmUyRC5qcyJdLCJuYW1lcyI6WyJFdmVudFRhcmdldCIsInJlcXVpcmUiLCJyZW5kZXJlciIsIkdMX05FQVJFU1QiLCJHTF9MSU5FQVIiLCJHTF9SRVBFQVQiLCJHTF9DTEFNUF9UT19FREdFIiwiR0xfTUlSUk9SRURfUkVQRUFUIiwiR0xfUkdCQSIsIkNIQVJfQ09ERV8wIiwiQ0hBUl9DT0RFXzEiLCJpZEdlbmVyYXRlciIsIkNVU1RPTV9QSVhFTF9GT1JNQVQiLCJQaXhlbEZvcm1hdCIsImNjIiwiRW51bSIsIlJHQjU2NSIsImdmeCIsIlRFWFRVUkVfRk1UX1I1X0c2X0I1IiwiUkdCNUExIiwiVEVYVFVSRV9GTVRfUjVfRzVfQjVfQTEiLCJSR0JBNDQ0NCIsIlRFWFRVUkVfRk1UX1I0X0c0X0I0X0E0IiwiUkdCODg4IiwiVEVYVFVSRV9GTVRfUkdCOCIsIlJHQkE4ODg4IiwiVEVYVFVSRV9GTVRfUkdCQTgiLCJSR0JBMzJGIiwiVEVYVFVSRV9GTVRfUkdCQTMyRiIsIkE4IiwiVEVYVFVSRV9GTVRfQTgiLCJJOCIsIlRFWFRVUkVfRk1UX0w4IiwiQUk4IiwiVEVYVFVSRV9GTVRfTDhfQTgiLCJSR0JfUFZSVENfMkJQUFYxIiwiVEVYVFVSRV9GTVRfUkdCX1BWUlRDXzJCUFBWMSIsIlJHQkFfUFZSVENfMkJQUFYxIiwiVEVYVFVSRV9GTVRfUkdCQV9QVlJUQ18yQlBQVjEiLCJSR0JfQV9QVlJUQ18yQlBQVjEiLCJSR0JfUFZSVENfNEJQUFYxIiwiVEVYVFVSRV9GTVRfUkdCX1BWUlRDXzRCUFBWMSIsIlJHQkFfUFZSVENfNEJQUFYxIiwiVEVYVFVSRV9GTVRfUkdCQV9QVlJUQ180QlBQVjEiLCJSR0JfQV9QVlJUQ180QlBQVjEiLCJSR0JfRVRDMSIsIlRFWFRVUkVfRk1UX1JHQl9FVEMxIiwiUkdCQV9FVEMxIiwiUkdCX0VUQzIiLCJURVhUVVJFX0ZNVF9SR0JfRVRDMiIsIlJHQkFfRVRDMiIsIlRFWFRVUkVfRk1UX1JHQkFfRVRDMiIsIldyYXBNb2RlIiwiUkVQRUFUIiwiQ0xBTVBfVE9fRURHRSIsIk1JUlJPUkVEX1JFUEVBVCIsIkZpbHRlciIsIkxJTkVBUiIsIk5FQVJFU1QiLCJGaWx0ZXJJbmRleCIsIl9pbWFnZXMiLCJfc2hhcmVkT3B0cyIsIndpZHRoIiwidW5kZWZpbmVkIiwiaGVpZ2h0IiwibWluRmlsdGVyIiwibWFnRmlsdGVyIiwid3JhcFMiLCJ3cmFwVCIsImZvcm1hdCIsImdlbk1pcG1hcHMiLCJpbWFnZXMiLCJpbWFnZSIsImZsaXBZIiwicHJlbXVsdGlwbHlBbHBoYSIsIl9nZXRTaGFyZWRPcHRpb25zIiwia2V5IiwibGVuZ3RoIiwiVGV4dHVyZTJEIiwiQ2xhc3MiLCJuYW1lIiwibWl4aW5zIiwicHJvcGVydGllcyIsIl9uYXRpdmVBc3NldCIsImdldCIsIl9pbWFnZSIsInNldCIsImRhdGEiLCJfY29tcHJlc3NlZCIsIl9kYXRhIiwiaW5pdFdpdGhEYXRhIiwiX2Zvcm1hdCIsImluaXRXaXRoRWxlbWVudCIsIm92ZXJyaWRlIiwiX3ByZW11bHRpcGx5QWxwaGEiLCJfZmxpcFkiLCJfbWluRmlsdGVyIiwiX21hZ0ZpbHRlciIsIl9taXBGaWx0ZXIiLCJfd3JhcFMiLCJfd3JhcFQiLCJfaXNBbHBoYUF0bGFzIiwiX2dlbk1pcG1hcHMiLCJvcHRzIiwidXBkYXRlIiwiX3BhY2thYmxlIiwicGFja2FibGUiLCJ2YWwiLCJfbmF0aXZlRGVwIiwiX19pc05hdGl2ZV9fIiwidXVpZCIsIl91dWlkIiwiZXh0IiwiX25hdGl2ZSIsIl9fZmxpcFlfXyIsIl9fcHJlbXVsdGlwbHlBbHBoYV9fIiwic3RhdGljcyIsIl9GaWx0ZXJJbmRleCIsImV4dG5hbWVzIiwiX3BhcnNlRXh0IiwiZXh0SWRTdHIiLCJkZWZhdWx0Rm9ybWF0IiwiZGV2aWNlIiwiZXh0SWRzIiwic3BsaXQiLCJkZWZhdWx0RXh0IiwiYmVzdEV4dCIsImJlc3RJbmRleCIsImJlc3RGb3JtYXQiLCJTdXBwb3J0VGV4dHVyZUZvcm1hdHMiLCJtYWNybyIsIlNVUFBPUlRfVEVYVFVSRV9GT1JNQVRTIiwiaSIsImV4dEZvcm1hdCIsInRtcEV4dCIsImNoYXJDb2RlQXQiLCJpbmRleCIsImluZGV4T2YiLCJ0bXBGb3JtYXQiLCJwYXJzZUludCIsInN5cyIsImNhcGFiaWxpdGllcyIsIndlYnAiLCJjdG9yIiwiX2lkIiwiZ2V0TmV3SWQiLCJsb2FkZWQiLCJfaGFzaERpcnR5IiwiX2hhc2giLCJfdGV4dHVyZSIsIkNDX0VESVRPUiIsIl9leHBvcnRlZEV4dHMiLCJnZXRJbXBsIiwiZ2V0SWQiLCJ0b1N0cmluZyIsIm5hdGl2ZVVybCIsIm9wdGlvbnMiLCJ1cGRhdGVJbWciLCJtaXBGaWx0ZXIiLCJpbWFnZUJpdG1hcCIsIkltYWdlQml0bWFwIiwiX2NoZWNrSW1hZ2VCaXRtYXAiLCJfdXBsb2FkIiwiYmluZCIsInB1c2giLCJlbGVtZW50IiwiY29tcGxldGUiLCJIVE1MQ2FudmFzRWxlbWVudCIsImhhbmRsZUxvYWRlZFRleHR1cmUiLCJzZWxmIiwiYWRkRXZlbnRMaXN0ZW5lciIsImVyciIsIndhcm5JRCIsIm1lc3NhZ2UiLCJwaXhlbEZvcm1hdCIsInBpeGVsc1dpZHRoIiwicGl4ZWxzSGVpZ2h0IiwiX2dldEdGWFBpeGVsRm9ybWF0IiwiX3VwZGF0ZUZvcm1hdCIsIl9jaGVja1BhY2thYmxlIiwiZW1pdCIsImdldEh0bWxFbGVtZW50T2JqIiwiZGVzdHJveSIsImNsb3NlIiwiZHluYW1pY0F0bGFzTWFuYWdlciIsImRlbGV0ZUF0bGFzVGV4dHVyZSIsIl9zdXBlciIsImdldFBpeGVsRm9ybWF0IiwiaGFzUHJlbXVsdGlwbGllZEFscGhhIiwiaXNBbHBoYUF0bGFzIiwiQ0xFQU5VUF9JTUFHRV9DQUNIRSIsIkhUTUxJbWFnZUVsZW1lbnQiLCJfY2xlYXJJbWFnZSIsImRlc2NyaXB0aW9uIiwicmVsZWFzZVRleHR1cmUiLCJzZXRXcmFwTW9kZSIsInNldEZpbHRlcnMiLCJzZXRGbGlwWSIsInNldFByZW11bHRpcGx5QWxwaGEiLCJwcmVtdWx0aXBseSIsIkNDX0pTQiIsInNldEFscGhhQXRsYXMiLCJkeW5hbWljQXRsYXMiLCJfaXNDb21wcmVzc2VkIiwidyIsImgiLCJtYXhGcmFtZVNpemUiLCJfZ2V0SGFzaCIsIkF0bGFzIiwiREVGQVVMVF9IQVNIIiwiX2dldE9wdHMiLCJhbmlzb3Ryb3B5IiwiX2FuaXNvdHJvcHkiLCJfcmVzZXRVbmRlcmx5aW5nTWlwbWFwcyIsIm1pcG1hcFNvdXJjZXMiLCJfc2VyaWFsaXplIiwiQ0NfVEVTVCIsImV4dElkIiwiZXhwb3J0ZWRFeHRzIiwiZXh0cyIsImpvaW4iLCJhc3NldCIsIl9kZXNlcmlhbGl6ZSIsImZpZWxkcyIsInJlc3VsdCIsIl9zZXRSYXdBc3NldCIsIkVycm9yIiwiZGVidWciLCJnZXRFcnJvciIsIl9nbEZvcm1hdCIsIk51bWJlciIsInNyYyIsImNiIiwiY3JlYXRlSW1hZ2VCaXRtYXAiLCJpbWFnZU9yaWVudGF0aW9uIiwidGhlbiIsImVycm9yIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQThCQTs7OztBQTlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLFdBQVcsR0FBR0MsT0FBTyxDQUFDLHVCQUFELENBQTNCOztBQUNBLElBQU1DLFFBQVEsR0FBR0QsT0FBTyxDQUFDLGFBQUQsQ0FBeEI7O0FBQ0FBLE9BQU8sQ0FBQyxxQkFBRCxDQUFQOztBQUlBLElBQU1FLFVBQVUsR0FBRyxJQUFuQixFQUF3Qzs7QUFDeEMsSUFBTUMsU0FBUyxHQUFHLElBQWxCLEVBQXdDOztBQUN4QyxJQUFNQyxTQUFTLEdBQUcsS0FBbEIsRUFBd0M7O0FBQ3hDLElBQU1DLGdCQUFnQixHQUFHLEtBQXpCLEVBQXdDOztBQUN4QyxJQUFNQyxrQkFBa0IsR0FB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QWMySSxNQUFkO0FBQ0FRLFFBQUFBLEVBQUU7QUFDTCxPQVRMLEVBU08sVUFBQzdELEdBQUQsRUFBUztBQUNSN0osUUFBQUEsRUFBRSxDQUFDOE4sS0FBSCxDQUFTakUsR0FBRyxDQUFDRSxPQUFiO0FBQ0gsT0FYTDtBQVlILEtBYkQsTUFjSztBQUNEMkQsTUFBQUEsRUFBRTtBQUNMO0FBQ0o7QUF0dkJvQixDQUFULENBQWhCO0FBeXZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBMU4sRUFBRSxDQUFDZ0UsU0FBSCxHQUFlK0osTUFBTSxDQUFDQyxPQUFQLEdBQWlCaEssU0FBaEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IEV2ZW50VGFyZ2V0ID0gcmVxdWlyZSgnLi4vZXZlbnQvZXZlbnQtdGFyZ2V0Jyk7XG5jb25zdCByZW5kZXJlciA9IHJlcXVpcmUoJy4uL3JlbmRlcmVyJyk7XG5yZXF1aXJlKCcuLi9wbGF0Zm9ybS9DQ0NsYXNzJyk7XG5cbmltcG9ydCBnZnggZnJvbSAnLi4vLi4vcmVuZGVyZXIvZ2Z4JztcblxuY29uc3QgR0xfTkVBUkVTVCA9IDk3Mjg7ICAgICAgICAgICAgICAgIC8vIGdsLk5FQVJFU1RcbmNvbnN0IEdMX0xJTkVBUiA9IDk3Mjk7ICAgICAgICAgICAgICAgICAvLyBnbC5MSU5FQVJcbmNvbnN0IEdMX1JFUEVBVCA9IDEwNDk3OyAgICAgICAgICAgICAgICAvLyBnbC5SRVBFQVRcbmNvbnN0IEdMX0NMQU1QX1RPX0VER0UgPSAzMzA3MTsgICAgICAgICAvLyBnbC5DTEFNUF9UT19FREdFXG5jb25zdCBHTF9NSVJST1JFRF9SRVBFQVQgPSAzMzY0ODsgICAgICAgLy8gZ2wuTUlSUk9SRURfUkVQRUFUXG5jb25zdCBHTF9SR0JBID0gNjQwODsgICAgICAgICAgICAgICAgICAgLy8gZ2wuUkdCQVxuXG5jb25zdCBDSEFSX0NPREVfMCA9IDQ4OyAgICAvLyAnMCdcbmNvbnN0IENIQVJfQ09ERV8xID0gNDk7ICAgIC8vICcxJ1xuXG52YXIgaWRHZW5lcmF0ZXIgPSBuZXcgKHJlcXVpcmUoJy4uL3BsYXRmb3JtL2lkLWdlbmVyYXRlcicpKSgnVGV4Jyk7XG5cblxuLyoqXG4gKiA8cD5cbiAqIFRoaXMgY2xhc3MgYWxsb3dzIHRvIGVhc2lseSBjcmVhdGUgT3BlbkdMIG9yIENhbnZhcyAyRCB0ZXh0dXJlcyBmcm9tIGltYWdlcywgdGV4dCBvciByYXcgZGF0YS4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICogVGhlIGNyZWF0ZWQgY2MuVGV4dHVyZTJEIG9iamVjdCB3aWxsIGFsd2F5cyBoYXZlIHBvd2VyLW9mLXR3byBkaW1lbnNpb25zLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gKiBEZXBlbmRpbmcgb24gaG93IHlvdSBjcmVhdGUgdGhlIGNjLlRleHR1cmUyRCBvYmplY3QsIHRoZSBhY3R1YWwgaW1hZ2UgYXJlYSBvZiB0aGUgdGV4dHVyZSBtaWdodCBiZSBzbWFsbGVyIHRoYW4gdGhlIHRleHR1cmUgZGltZW5zaW9ucyA8YnIvPlxuICogIGkuZS4gXCJjb250ZW50U2l6ZVwiICE9IChwaXhlbHNXaWRlLCBwaXhlbHNIaWdoKSBhbmQgKG1heFMsIG1heFQpICE9ICgxLjAsIDEuMCkuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gKiBCZSBhd2FyZSB0aGF0IHRoZSBjb250ZW50IG9mIHRoZSBnZW5lcmF0ZWQgdGV4dHVyZXMgd2lsbCBiZSB1cHNpZGUtZG93biEgPC9wPlxuXG4gKiBAY2xhc3MgVGV4dHVyZTJEXG4gKiBAdXNlcyBFdmVudFRhcmdldFxuICogQGV4dGVuZHMgQXNzZXRcbiAqL1xuXG4vLyBkZWZpbmUgYSBzcGVjaWZpZWQgbnVtYmVyIGZvciB0aGUgcGl4ZWwgZm9ybWF0IHdoaWNoIGdmeCBkbyBub3QgaGF2ZSBhIHN0YW5kYXJkIGRlZmluaXRpb24uXG5sZXQgQ1VTVE9NX1BJWEVMX0ZPUk1BVCA9IDEwMjQ7XG5cbi8qKlxuICogVGhlIHRleHR1cmUgcGl4ZWwgZm9ybWF0LCBkZWZhdWx0IHZhbHVlIGlzIFJHQkE4ODg4LCBcbiAqIHlvdSBzaG91bGQgbm90ZSB0aGF0IHRleHR1cmVzIGxvYWRlZCBieSBub3JtYWwgaW1hZ2UgZmlsZXMgKHBuZywganBnKSBjYW4gb25seSBzdXBwb3J0IFJHQkE4ODg4IGZvcm1hdCxcbiAqIG90aGVyIGZvcm1hdHMgYXJlIHN1cHBvcnRlZCBieSBjb21wcmVzc2VkIGZpbGUgdHlwZXMgb3IgcmF3IGRhdGEuXG4gKiBAZW51bSBUZXh0dXJlMkQuUGl4ZWxGb3JtYXRcbiAqL1xuY29uc3QgUGl4ZWxGb3JtYXQgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAxNi1iaXQgdGV4dHVyZSB3aXRob3V0IEFscGhhIGNoYW5uZWxcbiAgICAgKiBAcHJvcGVydHkgUkdCNTY1XG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBSR0I1NjU6IGdmeC5URVhUVVJFX0ZNVF9SNV9HNl9CNSxcbiAgICAvKipcbiAgICAgKiAxNi1iaXQgdGV4dHVyZXM6IFJHQjVBMVxuICAgICAqIEBwcm9wZXJ0eSBSR0I1QTFcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFJHQjVBMTogZ2Z4LlRFWFRVUkVfRk1UX1I1X0c1X0I1X0ExLFxuICAgIC8qKlxuICAgICAqIDE2LWJpdCB0ZXh0dXJlczogUkdCQTQ0NDRcbiAgICAgKiBAcHJvcGVydHkgUkdCQTQ0NDRcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFJHQkE0NDQ0OiBnZnguVEVYVFVSRV9GTVRfUjRfRzRfQjRfQTQsXG4gICAgLyoqXG4gICAgICogMjQtYml0IHRleHR1cmU6IFJHQjg4OFxuICAgICAqIEBwcm9wZXJ0eSBSR0I4ODhcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFJHQjg4ODogZ2Z4LlRFWFRVUkVfRk1UX1JHQjgsXG4gICAgLyoqXG4gICAgICogMzItYml0IHRleHR1cmU6IFJHQkE4ODg4XG4gICAgICogQHByb3BlcnR5IFJHQkE4ODg4XG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBSR0JBODg4ODogZ2Z4LlRFWFRVUkVfRk1UX1JHQkE4LFxuICAgIC8qKlxuICAgICAqIDMyLWJpdCBmbG9hdCB0ZXh0dXJlOiBSR0JBMzJGXG4gICAgICogQHByb3BlcnR5IFJHQkEzMkZcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFJHQkEzMkY6IGdmeC5URVhUVVJFX0ZNVF9SR0JBMzJGLFxuICAgIC8qKlxuICAgICAqIDgtYml0IHRleHR1cmVzIHVzZWQgYXMgbWFza3NcbiAgICAgKiBAcHJvcGVydHkgQThcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIEE4OiBnZnguVEVYVFVSRV9GTVRfQTgsXG4gICAgLyoqXG4gICAgICogOC1iaXQgaW50ZW5zaXR5IHRleHR1cmVcbiAgICAgKiBAcHJvcGVydHkgSThcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIEk4OiBnZnguVEVYVFVSRV9GTVRfTDgsXG4gICAgLyoqXG4gICAgICogMTYtYml0IHRleHR1cmVzIHVzZWQgYXMgbWFza3NcbiAgICAgKiBAcHJvcGVydHkgQUk4OFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgQUk4OiBnZnguVEVYVFVSRV9GTVRfTDhfQTgsXG5cbiAgICAvKipcbiAgICAgKiByZ2IgMiBicHAgcHZydGNcbiAgICAgKiBAcHJvcGVydHkgUkdCX1BWUlRDXzJCUFBWMVxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgUkdCX1BWUlRDXzJCUFBWMTogZ2Z4LlRFWFRVUkVfRk1UX1JHQl9QVlJUQ18yQlBQVjEsXG4gICAgLyoqXG4gICAgICogcmdiYSAyIGJwcCBwdnJ0Y1xuICAgICAqIEBwcm9wZXJ0eSBSR0JBX1BWUlRDXzJCUFBWMVxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgUkdCQV9QVlJUQ18yQlBQVjE6IGdmeC5URVhUVVJFX0ZNVF9SR0JBX1BWUlRDXzJCUFBWMSxcbiAgICAvKipcbiAgICAgKiByZ2Igc2VwYXJhdGUgYSAyIGJwcCBwdnJ0Y1xuICAgICAqIFJHQl9BX1BWUlRDXzJCUFBWMSB0ZXh0dXJlIGlzIGEgMnggaGVpZ2h0IFJHQl9QVlJUQ18yQlBQVjEgZm9ybWF0IHRleHR1cmUuXG4gICAgICogSXQgc2VwYXJhdGUgdGhlIG9yaWdpbiBhbHBoYSBjaGFubmVsIHRvIHRoZSBib3R0b20gaGFsZiBhdGxhcywgdGhlIG9yaWdpbiByZ2IgY2hhbm5lbCB0byB0aGUgdG9wIGhhbGYgYXRsYXNcbiAgICAgKiBAcHJvcGVydHkgUkdCX0FfUFZSVENfMkJQUFYxXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBSR0JfQV9QVlJUQ18yQlBQVjE6IENVU1RPTV9QSVhFTF9GT1JNQVQrKyxcbiAgICAvKipcbiAgICAgKiByZ2IgNCBicHAgcHZydGNcbiAgICAgKiBAcHJvcGVydHkgUkdCX1BWUlRDXzRCUFBWMVxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgUkdCX1BWUlRDXzRCUFBWMTogZ2Z4LlRFWFRVUkVfRk1UX1JHQl9QVlJUQ180QlBQVjEsXG4gICAgLyoqXG4gICAgICogcmdiYSA0IGJwcCBwdnJ0Y1xuICAgICAqIEBwcm9wZXJ0eSBSR0JBX1BWUlRDXzRCUFBWMVxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgUkdCQV9QVlJUQ180QlBQVjE6IGdmeC5URVhUVVJFX0ZNVF9SR0JBX1BWUlRDXzRCUFBWMSxcbiAgICAvKipcbiAgICAgKiByZ2IgYSA0IGJwcCBwdnJ0Y1xuICAgICAqIFJHQl9BX1BWUlRDXzRCUFBWMSB0ZXh0dXJlIGlzIGEgMnggaGVpZ2h0IFJHQl9QVlJUQ180QlBQVjEgZm9ybWF0IHRleHR1cmUuXG4gICAgICogSXQgc2VwYXJhdGUgdGhlIG9yaWdpbiBhbHBoYSBjaGFubmVsIHRvIHRoZSBib3R0b20gaGFsZiBhdGxhcywgdGhlIG9yaWdpbiByZ2IgY2hhbm5lbCB0byB0aGUgdG9wIGhhbGYgYXRsYXNcbiAgICAgKiBAcHJvcGVydHkgUkdCX0FfUFZSVENfNEJQUFYxXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBSR0JfQV9QVlJUQ180QlBQVjE6IENVU1RPTV9QSVhFTF9GT1JNQVQrKyxcbiAgICAvKipcbiAgICAgKiByZ2IgZXRjMVxuICAgICAqIEBwcm9wZXJ0eSBSR0JfRVRDMVxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgUkdCX0VUQzE6IGdmeC5URVhUVVJFX0ZNVF9SR0JfRVRDMSxcbiAgICAvKipcbiAgICAgKiByZ2JhIGV0YzFcbiAgICAgKiBAcHJvcGVydHkgUkdCQV9FVEMxXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBSR0JBX0VUQzE6IENVU1RPTV9QSVhFTF9GT1JNQVQrKyxcblxuICAgIC8qKlxuICAgICAqIHJnYiBldGMyXG4gICAgICogQHByb3BlcnR5IFJHQl9FVEMyXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBSR0JfRVRDMjogZ2Z4LlRFWFRVUkVfRk1UX1JHQl9FVEMyLFxuICAgIC8qKlxuICAgICAqIHJnYmEgZXRjMlxuICAgICAqIEBwcm9wZXJ0eSBSR0JBX0VUQzJcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFJHQkFfRVRDMjogZ2Z4LlRFWFRVUkVfRk1UX1JHQkFfRVRDMixcbn0pO1xuXG4vKipcbiAqIFRoZSB0ZXh0dXJlIHdyYXAgbW9kZVxuICogQGVudW0gVGV4dHVyZTJELldyYXBNb2RlXG4gKi9cbmNvbnN0IFdyYXBNb2RlID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogVGhlIGNvbnN0YW50IHZhcmlhYmxlIGVxdWFscyBnbC5SRVBFQVQgZm9yIHRleHR1cmVcbiAgICAgKiBAcHJvcGVydHkgUkVQRUFUXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBSRVBFQVQ6IEdMX1JFUEVBVCxcbiAgICAvKipcbiAgICAgKiBUaGUgY29uc3RhbnQgdmFyaWFibGUgZXF1YWxzIGdsLkNMQU1QX1RPX0VER0UgZm9yIHRleHR1cmVcbiAgICAgKiBAcHJvcGVydHkgQ0xBTVBfVE9fRURHRVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgQ0xBTVBfVE9fRURHRTogR0xfQ0xBTVBfVE9fRURHRSxcbiAgICAvKipcbiAgICAgKiBUaGUgY29uc3RhbnQgdmFyaWFibGUgZXF1YWxzIGdsLk1JUlJPUkVEX1JFUEVBVCBmb3IgdGV4dHVyZVxuICAgICAqIEBwcm9wZXJ0eSBNSVJST1JFRF9SRVBFQVRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIE1JUlJPUkVEX1JFUEVBVDogR0xfTUlSUk9SRURfUkVQRUFUXG59KTtcblxuLyoqXG4gKiBUaGUgdGV4dHVyZSBmaWx0ZXIgbW9kZVxuICogQGVudW0gVGV4dHVyZTJELkZpbHRlclxuICovXG5jb25zdCBGaWx0ZXIgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiBUaGUgY29uc3RhbnQgdmFyaWFibGUgZXF1YWxzIGdsLkxJTkVBUiBmb3IgdGV4dHVyZVxuICAgICAqIEBwcm9wZXJ0eSBMSU5FQVJcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIExJTkVBUjogR0xfTElORUFSLFxuICAgIC8qKlxuICAgICAqIFRoZSBjb25zdGFudCB2YXJpYWJsZSBlcXVhbHMgZ2wuTkVBUkVTVCBmb3IgdGV4dHVyZVxuICAgICAqIEBwcm9wZXJ0eSBORUFSRVNUXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBORUFSRVNUOiBHTF9ORUFSRVNUXG59KTtcblxuY29uc3QgRmlsdGVySW5kZXggPSB7XG4gICAgOTcyODogMCwgLy8gR0xfTkVBUkVTVFxuICAgIDk3Mjk6IDEsIC8vIEdMX0xJTkVBUlxufTtcblxubGV0IF9pbWFnZXMgPSBbXTtcbmxldCBfc2hhcmVkT3B0cyA9IHtcbiAgICB3aWR0aDogdW5kZWZpbmVkLFxuICAgIGhlaWdodDogdW5kZWZpbmVkLFxuICAgIG1pbkZpbHRlcjogdW5kZWZpbmVkLFxuICAgIG1hZ0ZpbHRlcjogdW5kZWZpbmVkLFxuICAgIHdyYXBTOiB1bmRlZmluZWQsXG4gICAgd3JhcFQ6IHVuZGVmaW5lZCxcbiAgICBmb3JtYXQ6IHVuZGVmaW5lZCxcbiAgICBnZW5NaXBtYXBzOiB1bmRlZmluZWQsXG4gICAgaW1hZ2VzOiB1bmRlZmluZWQsXG4gICAgaW1hZ2U6IHVuZGVmaW5lZCxcbiAgICBmbGlwWTogdW5kZWZpbmVkLFxuICAgIHByZW11bHRpcGx5QWxwaGE6IHVuZGVmaW5lZFxufTtcbmZ1bmN0aW9uIF9nZXRTaGFyZWRPcHRpb25zICgpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gX3NoYXJlZE9wdHMpIHtcbiAgICAgICAgX3NoYXJlZE9wdHNba2V5XSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgX2ltYWdlcy5sZW5ndGggPSAwO1xuICAgIF9zaGFyZWRPcHRzLmltYWdlcyA9IF9pbWFnZXM7XG4gICAgcmV0dXJuIF9zaGFyZWRPcHRzO1xufVxuXG4vKipcbiAqIFRoaXMgY2xhc3MgYWxsb3dzIHRvIGVhc2lseSBjcmVhdGUgT3BlbkdMIG9yIENhbnZhcyAyRCB0ZXh0dXJlcyBmcm9tIGltYWdlcyBvciByYXcgZGF0YS5cbiAqXG4gKiBAY2xhc3MgVGV4dHVyZTJEXG4gKiBAdXNlcyBFdmVudFRhcmdldFxuICogQGV4dGVuZHMgQXNzZXRcbiAqL1xudmFyIFRleHR1cmUyRCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuVGV4dHVyZTJEJyxcbiAgICBleHRlbmRzOiByZXF1aXJlKCcuLi9hc3NldHMvQ0NBc3NldCcpLFxuICAgIG1peGluczogW0V2ZW50VGFyZ2V0XSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX25hdGl2ZUFzc2V0OiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIC8vIG1heWJlIHJldHVybmVkIHRvIHBvb2wgaW4gd2ViZ2xcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faW1hZ2U7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0IChkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuX2NvbXByZXNzZWQgJiYgZGF0YS5fZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRXaXRoRGF0YShkYXRhLl9kYXRhLCB0aGlzLl9mb3JtYXQsIGRhdGEud2lkdGgsIGRhdGEuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdFdpdGhFbGVtZW50KGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvdmVycmlkZTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBfZm9ybWF0OiBQaXhlbEZvcm1hdC5SR0JBODg4OCxcbiAgICAgICAgX3ByZW11bHRpcGx5QWxwaGE6IGZhbHNlLFxuICAgICAgICBfZmxpcFk6IGZhbHNlLFxuICAgICAgICBfbWluRmlsdGVyOiBGaWx0ZXIuTElORUFSLFxuICAgICAgICBfbWFnRmlsdGVyOiBGaWx0ZXIuTElORUFSLFxuICAgICAgICBfbWlwRmlsdGVyOiBGaWx0ZXIuTElORUFSLFxuICAgICAgICBfd3JhcFM6IFdyYXBNb2RlLkNMQU1QX1RPX0VER0UsXG4gICAgICAgIF93cmFwVDogV3JhcE1vZGUuQ0xBTVBfVE9fRURHRSxcblxuICAgICAgICBfaXNBbHBoYUF0bGFzOiBmYWxzZSxcblxuICAgICAgICBfZ2VuTWlwbWFwczogZmFsc2UsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFNldHMgd2hldGhlciBnZW5lcmF0ZSBtaXBtYXBzIGZvciB0aGUgdGV4dHVyZVxuICAgICAgICAgKiAhI3poIOaYr+WQpuS4uue6ueeQhuiuvue9rueUn+aIkCBtaXBtYXBz44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZ2VuTWlwbWFwc1xuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgZ2VuTWlwbWFwczoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2VuTWlwbWFwcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKGdlbk1pcG1hcHMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZ2VuTWlwbWFwcyAhPT0gZ2VuTWlwbWFwcykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3B0cyA9IF9nZXRTaGFyZWRPcHRpb25zKCk7XG4gICAgICAgICAgICAgICAgICAgIG9wdHMuZ2VuTWlwbWFwcyA9IGdlbk1pcG1hcHM7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKG9wdHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfcGFja2FibGU6IHRydWUsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFxuICAgICAgICAgKiBTZXRzIHdoZXRoZXIgdGV4dHVyZSBjYW4gYmUgcGFja2VkIGludG8gdGV4dHVyZSBhdGxhcy5cbiAgICAgICAgICogSWYgbmVlZCB1c2UgdGV4dHVyZSB1diBpbiBjdXN0b20gRWZmZWN0LCBwbGVhc2Ugc2V0cyBwYWNrYWJsZSB0byBmYWxzZS5cbiAgICAgICAgICogISN6aCBcbiAgICAgICAgICog6K6+572u57q555CG5piv5ZCm5YWB6K645Y+C5LiO5ZCI5Zu+44CCXG4gICAgICAgICAqIOWmguaenOmcgOimgeWcqOiHquWumuS5iSBFZmZlY3Qg5Lit5L2/55So57q555CGIFVW77yM6ZyA6KaB56aB5q2i6K+l6YCJ6aG544CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gcGFja2FibGVcbiAgICAgICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAgICAgKi9cbiAgICAgICAgcGFja2FibGU6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhY2thYmxlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGFja2FibGUgPSB2YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICBfbmF0aXZlRGVwOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIF9faXNOYXRpdmVfXzogdHJ1ZSwgXG4gICAgICAgICAgICAgICAgICAgIHV1aWQ6IHRoaXMuX3V1aWQsIFxuICAgICAgICAgICAgICAgICAgICBleHQ6IHRoaXMuX25hdGl2ZSwgXG4gICAgICAgICAgICAgICAgICAgIF9fZmxpcFlfXzogdGhpcy5fZmxpcFksXG4gICAgICAgICAgICAgICAgICAgIF9fcHJlbXVsdGlwbHlBbHBoYV9fOiB0aGlzLl9wcmVtdWx0aXBseUFscGhhXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvdmVycmlkZTogdHJ1ZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgUGl4ZWxGb3JtYXQ6IFBpeGVsRm9ybWF0LFxuICAgICAgICBXcmFwTW9kZTogV3JhcE1vZGUsXG4gICAgICAgIEZpbHRlcjogRmlsdGVyLFxuICAgICAgICBfRmlsdGVySW5kZXg6IEZpbHRlckluZGV4LFxuICAgICAgICAvLyBwcmVkZWZpbmVkIG1vc3QgY29tbW9uIGV4dG5hbWVzXG4gICAgICAgIGV4dG5hbWVzOiBbJy5wbmcnLCAnLmpwZycsICcuanBlZycsICcuYm1wJywgJy53ZWJwJywgJy5wdnInLCAnLnBrbSddLFxuXG4gICAgICAgIF9wYXJzZUV4dCAoZXh0SWRTdHIsIGRlZmF1bHRGb3JtYXQpIHtcbiAgICAgICAgICAgIGxldCBkZXZpY2UgPSBjYy5yZW5kZXJlci5kZXZpY2U7XG4gICAgICAgICAgICBsZXQgZXh0SWRzID0gZXh0SWRTdHIuc3BsaXQoJ18nKTtcblxuICAgICAgICAgICAgbGV0IGRlZmF1bHRFeHQgPSAnJztcbiAgICAgICAgICAgIGxldCBiZXN0RXh0ID0gJyc7XG4gICAgICAgICAgICBsZXQgYmVzdEluZGV4ID0gOTk5O1xuICAgICAgICAgICAgbGV0IGJlc3RGb3JtYXQgPSBkZWZhdWx0Rm9ybWF0O1xuICAgICAgICAgICAgbGV0IFN1cHBvcnRUZXh0dXJlRm9ybWF0cyA9IGNjLm1hY3JvLlNVUFBPUlRfVEVYVFVSRV9GT1JNQVRTO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleHRJZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgZXh0Rm9ybWF0ID0gZXh0SWRzW2ldLnNwbGl0KCdAJyk7XG4gICAgICAgICAgICAgICAgbGV0IHRtcEV4dCA9IGV4dEZvcm1hdFswXTtcbiAgICAgICAgICAgICAgICB0bXBFeHQgPSBUZXh0dXJlMkQuZXh0bmFtZXNbdG1wRXh0LmNoYXJDb2RlQXQoMCkgLSBDSEFSX0NPREVfMF0gfHwgdG1wRXh0O1xuXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gU3VwcG9ydFRleHR1cmVGb3JtYXRzLmluZGV4T2YodG1wRXh0KTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xICYmIGluZGV4IDwgYmVzdEluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBsZXQgdG1wRm9ybWF0ID0gZXh0Rm9ybWF0WzFdID8gcGFyc2VJbnQoZXh0Rm9ybWF0WzFdKSA6IGRlZmF1bHRGb3JtYXQ7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgd2hldGhlciBvciBub3Qgc3VwcG9ydCBjb21wcmVzc2VkIHRleHR1cmVcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB0bXBFeHQgPT09ICcucHZyJyAmJiAhZGV2aWNlLmV4dCgnV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX3B2cnRjJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCh0bXBGb3JtYXQgPT09IFBpeGVsRm9ybWF0LlJHQl9FVEMxIHx8IHRtcEZvcm1hdCA9PT0gUGl4ZWxGb3JtYXQuUkdCQV9FVEMxKSAmJiAhZGV2aWNlLmV4dCgnV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2V0YzEnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoKHRtcEZvcm1hdCA9PT0gUGl4ZWxGb3JtYXQuUkdCX0VUQzIgfHwgdG1wRm9ybWF0ID09PSBQaXhlbEZvcm1hdC5SR0JBX0VUQzIpICYmICFkZXZpY2UuZXh0KCdXRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfZXRjJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRtcEV4dCA9PT0gJy53ZWJwJyAmJiAhY2Muc3lzLmNhcGFiaWxpdGllcy53ZWJwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGJlc3RJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgICAgICBiZXN0RXh0ID0gdG1wRXh0O1xuICAgICAgICAgICAgICAgICAgICBiZXN0Rm9ybWF0ID0gdG1wRm9ybWF0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICghZGVmYXVsdEV4dCkge1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0RXh0ID0gdG1wRXh0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7IGJlc3RFeHQsIGJlc3RGb3JtYXQsIGRlZmF1bHRFeHQgfTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjdG9yICgpIHtcbiAgICAgICAgLy8gSWQgZm9yIGdlbmVyYXRlIGhhc2ggaW4gbWF0ZXJpYWxcbiAgICAgICAgdGhpcy5faWQgPSBpZEdlbmVyYXRlci5nZXROZXdJZCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFdoZXRoZXIgdGhlIHRleHR1cmUgaXMgbG9hZGVkIG9yIG5vdFxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOi0tOWbvuaYr+WQpuW3sue7j+aIkOWKn+WKoOi9vVxuICAgICAgICAgKiBAcHJvcGVydHkgbG9hZGVkXG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5sb2FkZWQgPSBmYWxzZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGV4dHVyZSB3aWR0aCBpbiBwaXhlbFxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOi0tOWbvuWDj+e0oOWuveW6plxuICAgICAgICAgKiBAcHJvcGVydHkgd2lkdGhcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMud2lkdGggPSAwO1xuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUZXh0dXJlIGhlaWdodCBpbiBwaXhlbFxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOi0tOWbvuWDj+e0oOmrmOW6plxuICAgICAgICAgKiBAcHJvcGVydHkgaGVpZ2h0XG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmhlaWdodCA9IDA7XG5cbiAgICAgICAgdGhpcy5faGFzaERpcnR5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5faGFzaCA9IDA7XG4gICAgICAgIHRoaXMuX3RleHR1cmUgPSBudWxsO1xuICAgICAgICBcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgdGhpcy5fZXhwb3J0ZWRFeHRzID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0IHJlbmRlcmVyIHRleHR1cmUgaW1wbGVtZW50YXRpb24gb2JqZWN0XG4gICAgICogZXh0ZW5kZWQgZnJvbSByZW5kZXIuVGV4dHVyZTJEXG4gICAgICogISN6aCAg6L+U5Zue5riy5p+T5Zmo5YaF6YOo6LS05Zu+5a+56LGhXG4gICAgICogQG1ldGhvZCBnZXRJbXBsXG4gICAgICovXG4gICAgZ2V0SW1wbCAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fdGV4dHVyZSkgdGhpcy5fdGV4dHVyZSA9IG5ldyByZW5kZXJlci5UZXh0dXJlMkQocmVuZGVyZXIuZGV2aWNlLCB7fSk7XG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0dXJlO1xuICAgIH0sXG5cbiAgICBnZXRJZCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pZDtcbiAgICB9LFxuXG4gICAgdG9TdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYXRpdmVVcmwgfHwgJyc7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSB0ZXh0dXJlIG9wdGlvbnMsIG5vdCBhdmFpbGFibGUgaW4gQ2FudmFzIHJlbmRlciBtb2RlLlxuICAgICAqIGltYWdlLCBmb3JtYXQsIHByZW11bHRpcGx5QWxwaGEgY2FuIG5vdCBiZSB1cGRhdGVkIGluIG5hdGl2ZS5cbiAgICAgKiBAbWV0aG9kIHVwZGF0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICogQHBhcmFtIHtET01JbWFnZUVsZW1lbnR9IG9wdGlvbnMuaW1hZ2VcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMuZ2VuTWlwbWFwc1xuICAgICAqIEBwYXJhbSB7UGl4ZWxGb3JtYXR9IG9wdGlvbnMuZm9ybWF0XG4gICAgICogQHBhcmFtIHtGaWx0ZXJ9IG9wdGlvbnMubWluRmlsdGVyXG4gICAgICogQHBhcmFtIHtGaWx0ZXJ9IG9wdGlvbnMubWFnRmlsdGVyXG4gICAgICogQHBhcmFtIHtXcmFwTW9kZX0gb3B0aW9ucy53cmFwU1xuICAgICAqIEBwYXJhbSB7V3JhcE1vZGV9IG9wdGlvbnMud3JhcFRcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMucHJlbXVsdGlwbHlBbHBoYVxuICAgICAqL1xuICAgIHVwZGF0ZSAob3B0aW9ucykge1xuICAgICAgICBpZiAob3B0aW9ucykge1xuICAgICAgICAgICAgbGV0IHVwZGF0ZUltZyA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMud2lkdGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggPSBvcHRpb25zLndpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuaGVpZ2h0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubWluRmlsdGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9taW5GaWx0ZXIgPSBvcHRpb25zLm1pbkZpbHRlcjtcbiAgICAgICAgICAgICAgICBvcHRpb25zLm1pbkZpbHRlciA9IEZpbHRlckluZGV4W29wdGlvbnMubWluRmlsdGVyXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1hZ0ZpbHRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFnRmlsdGVyID0gb3B0aW9ucy5tYWdGaWx0ZXI7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5tYWdGaWx0ZXIgPSBGaWx0ZXJJbmRleFtvcHRpb25zLm1hZ0ZpbHRlcl07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5taXBGaWx0ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21pcEZpbHRlciA9IG9wdGlvbnMubWlwRmlsdGVyO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMubWlwRmlsdGVyID0gRmlsdGVySW5kZXhbb3B0aW9ucy5taXBGaWx0ZXJdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMud3JhcFMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3dyYXBTID0gb3B0aW9ucy53cmFwUztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLndyYXBUICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl93cmFwVCA9IG9wdGlvbnMud3JhcFQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5mb3JtYXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Zvcm1hdCA9IG9wdGlvbnMuZm9ybWF0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZmxpcFkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZsaXBZID0gb3B0aW9ucy5mbGlwWTtcbiAgICAgICAgICAgICAgICB1cGRhdGVJbWcgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMucHJlbXVsdGlwbHlBbHBoYSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlbXVsdGlwbHlBbHBoYSA9IG9wdGlvbnMucHJlbXVsdGlwbHlBbHBoYTtcbiAgICAgICAgICAgICAgICB1cGRhdGVJbWcgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZ2VuTWlwbWFwcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZ2VuTWlwbWFwcyA9IG9wdGlvbnMuZ2VuTWlwbWFwcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNjLnN5cy5jYXBhYmlsaXRpZXMuaW1hZ2VCaXRtYXAgJiYgdGhpcy5faW1hZ2UgaW5zdGFuY2VvZiBJbWFnZUJpdG1hcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NoZWNrSW1hZ2VCaXRtYXAodGhpcy5fdXBsb2FkLmJpbmQodGhpcywgb3B0aW9ucywgdXBkYXRlSW1nKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGxvYWQob3B0aW9ucywgdXBkYXRlSW1nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgfSxcblxuXG4gICAgX3VwbG9hZCAob3B0aW9ucywgdXBkYXRlSW1nKSB7XG4gICAgICAgIGlmICh1cGRhdGVJbWcgJiYgdGhpcy5faW1hZ2UpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuaW1hZ2UgPSB0aGlzLl9pbWFnZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5pbWFnZXMgJiYgb3B0aW9ucy5pbWFnZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5faW1hZ2UgPSBvcHRpb25zLmltYWdlc1swXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChvcHRpb25zLmltYWdlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2ltYWdlID0gb3B0aW9ucy5pbWFnZTtcbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5pbWFnZXMpIHtcbiAgICAgICAgICAgICAgICBfaW1hZ2VzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5pbWFnZXMgPSBfaW1hZ2VzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gd2ViZ2wgdGV4dHVyZSAyZCB1c2VzIGltYWdlc1xuICAgICAgICAgICAgb3B0aW9ucy5pbWFnZXMucHVzaChvcHRpb25zLmltYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3RleHR1cmUgJiYgdGhpcy5fdGV4dHVyZS51cGRhdGUob3B0aW9ucyk7XG5cbiAgICAgICAgdGhpcy5faGFzaERpcnR5ID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEluaXQgd2l0aCBIVE1MIGVsZW1lbnQuXG4gICAgICogISN6aCDnlKggSFRNTCBJbWFnZSDmiJYgQ2FudmFzIOWvueixoeWIneWni+WMlui0tOWbvuOAglxuICAgICAqIEBtZXRob2QgaW5pdFdpdGhFbGVtZW50XG4gICAgICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fEhUTUxDYW52YXNFbGVtZW50fSBlbGVtZW50XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICogaW1nLnNyYyA9IGRhdGFVUkw7XG4gICAgICogdGV4dHVyZS5pbml0V2l0aEVsZW1lbnQoaW1nKTtcbiAgICAgKi9cbiAgICBpbml0V2l0aEVsZW1lbnQgKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKCFlbGVtZW50KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLl9pbWFnZSA9IGVsZW1lbnQ7XG4gICAgICAgIGlmIChlbGVtZW50LmNvbXBsZXRlIHx8IGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVMb2FkZWRUZXh0dXJlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY2Muc3lzLmNhcGFiaWxpdGllcy5pbWFnZUJpdG1hcCAmJiBlbGVtZW50IGluc3RhbmNlb2YgSW1hZ2VCaXRtYXApIHtcbiAgICAgICAgICAgIHRoaXMuX2NoZWNrSW1hZ2VCaXRtYXAodGhpcy5oYW5kbGVMb2FkZWRUZXh0dXJlLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuaGFuZGxlTG9hZGVkVGV4dHVyZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzMTE5LCBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogSW50aWFsaXplcyB3aXRoIHRleHR1cmUgZGF0YSBpbiBBcnJheUJ1ZmZlclZpZXcuXG4gICAgICogISN6aCDkvb/nlKjkuIDkuKrlrZjlgqjlnKggQXJyYXlCdWZmZXJWaWV3IOS4reeahOWbvuWDj+aVsOaNru+8iHJhdyBkYXRh77yJ5Yid5aeL5YyW5pWw5o2u44CCXG4gICAgICogQG1ldGhvZCBpbml0V2l0aERhdGFcbiAgICAgKiBAcGFyYW0ge0FycmF5QnVmZmVyVmlld30gZGF0YVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwaXhlbEZvcm1hdFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwaXhlbHNXaWR0aFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwaXhlbHNIZWlnaHRcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGluaXRXaXRoRGF0YSAoZGF0YSwgcGl4ZWxGb3JtYXQsIHBpeGVsc1dpZHRoLCBwaXhlbHNIZWlnaHQpIHtcbiAgICAgICAgdmFyIG9wdHMgPSBfZ2V0U2hhcmVkT3B0aW9ucygpO1xuICAgICAgICBvcHRzLmltYWdlID0gZGF0YTtcbiAgICAgICAgLy8gd2ViZ2wgdGV4dHVyZSAyZCB1c2VzIGltYWdlc1xuICAgICAgICBvcHRzLmltYWdlcyA9IFtvcHRzLmltYWdlXTtcbiAgICAgICAgb3B0cy5nZW5NaXBtYXBzID0gdGhpcy5fZ2VuTWlwbWFwcztcbiAgICAgICAgb3B0cy5wcmVtdWx0aXBseUFscGhhID0gdGhpcy5fcHJlbXVsdGlwbHlBbHBoYTtcbiAgICAgICAgb3B0cy5mbGlwWSA9IHRoaXMuX2ZsaXBZO1xuICAgICAgICBvcHRzLm1pbkZpbHRlciA9IEZpbHRlckluZGV4W3RoaXMuX21pbkZpbHRlcl07XG4gICAgICAgIG9wdHMubWFnRmlsdGVyID0gRmlsdGVySW5kZXhbdGhpcy5fbWFnRmlsdGVyXTtcbiAgICAgICAgb3B0cy53cmFwUyA9IHRoaXMuX3dyYXBTO1xuICAgICAgICBvcHRzLndyYXBUID0gdGhpcy5fd3JhcFQ7XG4gICAgICAgIG9wdHMuZm9ybWF0ID0gdGhpcy5fZ2V0R0ZYUGl4ZWxGb3JtYXQocGl4ZWxGb3JtYXQpO1xuICAgICAgICBvcHRzLndpZHRoID0gcGl4ZWxzV2lkdGg7XG4gICAgICAgIG9wdHMuaGVpZ2h0ID0gcGl4ZWxzSGVpZ2h0O1xuICAgICAgICBpZiAoIXRoaXMuX3RleHR1cmUpIHtcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmUgPSBuZXcgcmVuZGVyZXIuVGV4dHVyZTJEKHJlbmRlcmVyLmRldmljZSwgb3B0cyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl90ZXh0dXJlLnVwZGF0ZShvcHRzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLndpZHRoID0gcGl4ZWxzV2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gcGl4ZWxzSGVpZ2h0O1xuXG4gICAgICAgIHRoaXMuX3VwZGF0ZUZvcm1hdCgpO1xuICAgICAgICB0aGlzLl9jaGVja1BhY2thYmxlKCk7XG5cbiAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmVtaXQoXCJsb2FkXCIpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEhUTUxFbGVtZW50IE9iamVjdCBnZXR0ZXIsIGF2YWlsYWJsZSBvbmx5IG9uIHdlYi48YnIvPlxuICAgICAqIE5vdGU6IHRleHR1cmUgaXMgcGFja2VkIGludG8gdGV4dHVyZSBhdGxhcyBieSBkZWZhdWx0PGJyLz5cbiAgICAgKiB5b3Ugc2hvdWxkIHNldCB0ZXh0dXJlLnBhY2thYmxlIGFzIGZhbHNlIGJlZm9yZSBnZXR0aW5nIEh0bWwgZWxlbWVudCBvYmplY3QuXG4gICAgICogISN6aCDojrflj5blvZPliY3otLTlm77lr7nlupTnmoQgSFRNTCBJbWFnZSDmiJYgQ2FudmFzIOWvueixoe+8jOWPquWcqCBXZWIg5bmz5Y+w5LiL5pyJ5pWI44CCPGJyLz5cbiAgICAgKiDms6jmhI/vvJo8YnIvPlxuICAgICAqIHRleHR1cmUg6buY6K6k5Y+C5LiO5Yqo5oCB5ZCI5Zu+77yM5aaC5p6c6ZyA6KaB6I635Y+W5Yiw5q2j56Gu55qEIEh0bWwg5YWD57Sg5a+56LGh77yM6ZyA6KaB5YWI6K6+572uIHRleHR1cmUucGFja2FibGUg5Li6IGZhbHNlXG4gICAgICogQG1ldGhvZCBnZXRIdG1sRWxlbWVudE9ialxuICAgICAqIEByZXR1cm4ge0hUTUxJbWFnZUVsZW1lbnR8SFRNTENhbnZhc0VsZW1lbnR9XG4gICAgICovXG4gICAgZ2V0SHRtbEVsZW1lbnRPYmogKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW1hZ2U7XG4gICAgfSxcbiAgICBcbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogRGVzdG9yeSB0aGlzIHRleHR1cmUgYW5kIGltbWVkaWF0ZWx5IHJlbGVhc2UgaXRzIHZpZGVvIG1lbW9yeS4gKEluaGVyaXQgZnJvbSBjYy5PYmplY3QuZGVzdHJveSk8YnI+XG4gICAgICogQWZ0ZXIgZGVzdHJveSwgdGhpcyBvYmplY3QgaXMgbm90IHVzYWJsZSBhbnltb3JlLlxuICAgICAqIFlvdSBjYW4gdXNlIGNjLmlzVmFsaWQob2JqKSB0byBjaGVjayB3aGV0aGVyIHRoZSBvYmplY3QgaXMgZGVzdHJveWVkIGJlZm9yZSBhY2Nlc3NpbmcgaXQuXG4gICAgICogISN6aFxuICAgICAqIOmUgOavgeivpei0tOWbvu+8jOW5tueri+WNs+mHiuaUvuWug+WvueW6lOeahOaYvuWtmOOAgu+8iOe7p+aJv+iHqiBjYy5PYmplY3QuZGVzdHJvee+8iTxici8+XG4gICAgICog6ZSA5q+B5ZCO77yM6K+l5a+56LGh5LiN5YaN5Y+v55So44CC5oKo5Y+v5Lul5Zyo6K6/6Zeu5a+56LGh5LmL5YmN5L2/55SoIGNjLmlzVmFsaWQob2JqKSDmnaXmo4Dmn6Xlr7nosaHmmK/lkKblt7LooqvplIDmr4HjgIJcbiAgICAgKiBAbWV0aG9kIGRlc3Ryb3lcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBpbmhlcml0IGZyb20gdGhlIENDT2JqZWN0XG4gICAgICovXG4gICAgZGVzdHJveSAoKSB7XG4gICAgICAgIGlmIChjYy5zeXMuY2FwYWJpbGl0aWVzLmltYWdlQml0bWFwICYmIHRoaXMuX2ltYWdlIGluc3RhbmNlb2YgSW1hZ2VCaXRtYXApIHtcbiAgICAgICAgICAgIHRoaXMuX2ltYWdlLmNsb3NlICYmIHRoaXMuX2ltYWdlLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcGFja2FibGUgJiYgY2MuZHluYW1pY0F0bGFzTWFuYWdlciAmJiBjYy5keW5hbWljQXRsYXNNYW5hZ2VyLmRlbGV0ZUF0bGFzVGV4dHVyZSh0aGlzKTtcblxuICAgICAgICB0aGlzLl9pbWFnZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX3RleHR1cmUgJiYgdGhpcy5fdGV4dHVyZS5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBQaXhlbCBmb3JtYXQgb2YgdGhlIHRleHR1cmUuXG4gICAgICogISN6aCDojrflj5bnurnnkIbnmoTlg4/ntKDmoLzlvI/jgIJcbiAgICAgKiBAbWV0aG9kIGdldFBpeGVsRm9ybWF0XG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldFBpeGVsRm9ybWF0ICgpIHtcbiAgICAgICAgLy9zdXBwb3J0IG9ubHkgaW4gV2ViR2wgcmVuZGVyaW5nIG1vZGVcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Zvcm1hdDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFdoZXRoZXIgb3Igbm90IHRoZSB0ZXh0dXJlIGhhcyB0aGVpciBBbHBoYSBwcmVtdWx0aXBsaWVkLlxuICAgICAqICEjemgg5qOA5p+l57q555CG5Zyo5LiK5LygIEdQVSDml7bpooTkuZjpgInpobnmmK/lkKblvIDlkK/jgIJcbiAgICAgKiBAbWV0aG9kIGhhc1ByZW11bHRpcGxpZWRBbHBoYVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaGFzUHJlbXVsdGlwbGllZEFscGhhICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ByZW11bHRpcGx5QWxwaGEgfHwgZmFsc2U7XG4gICAgfSxcblxuICAgIGlzQWxwaGFBdGxhcyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc0FscGhhQXRsYXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBIYW5kbGVyIG9mIHRleHR1cmUgbG9hZGVkIGV2ZW50LlxuICAgICAqIFNpbmNlIHYyLjAsIHlvdSBkb24ndCBuZWVkIHRvIGludm9rZSB0aGlzIGZ1bmN0aW9uLCBpdCB3aWxsIGJlIGludm9rZWQgYXV0b21hdGljYWxseSBhZnRlciB0ZXh0dXJlIGxvYWRlZC5cbiAgICAgKiAhI3poIOi0tOWbvuWKoOi9veS6i+S7tuWkhOeQhuWZqOOAgnYyLjAg5LmL5ZCO5L2g5bCG5LiN5Zyo6ZyA6KaB5omL5Yqo5omn6KGM6L+Z5Liq5Ye95pWw77yM5a6D5Lya5Zyo6LS05Zu+5Yqg6L295oiQ5Yqf5LmL5ZCO6Ieq5Yqo5omn6KGM44CCXG4gICAgICogQG1ldGhvZCBoYW5kbGVMb2FkZWRUZXh0dXJlXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbcHJlbXVsdGlwbGllZF1cbiAgICAgKi9cbiAgICBoYW5kbGVMb2FkZWRUZXh0dXJlICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pbWFnZSB8fCAhdGhpcy5faW1hZ2Uud2lkdGggfHwgIXRoaXMuX2ltYWdlLmhlaWdodClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgXG4gICAgICAgIHRoaXMud2lkdGggPSB0aGlzLl9pbWFnZS53aWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLl9pbWFnZS5oZWlnaHQ7XG4gICAgICAgIGxldCBvcHRzID0gX2dldFNoYXJlZE9wdGlvbnMoKTtcbiAgICAgICAgb3B0cy5pbWFnZSA9IHRoaXMuX2ltYWdlO1xuICAgICAgICAvLyB3ZWJnbCB0ZXh0dXJlIDJkIHVzZXMgaW1hZ2VzXG4gICAgICAgIG9wdHMuaW1hZ2VzID0gW29wdHMuaW1hZ2VdO1xuICAgICAgICBvcHRzLndpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgb3B0cy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICAgICAgb3B0cy5nZW5NaXBtYXBzID0gdGhpcy5fZ2VuTWlwbWFwcztcbiAgICAgICAgb3B0cy5mb3JtYXQgPSB0aGlzLl9nZXRHRlhQaXhlbEZvcm1hdCh0aGlzLl9mb3JtYXQpO1xuICAgICAgICBvcHRzLnByZW11bHRpcGx5QWxwaGEgPSB0aGlzLl9wcmVtdWx0aXBseUFscGhhO1xuICAgICAgICBvcHRzLmZsaXBZID0gdGhpcy5fZmxpcFk7XG4gICAgICAgIG9wdHMubWluRmlsdGVyID0gRmlsdGVySW5kZXhbdGhpcy5fbWluRmlsdGVyXTtcbiAgICAgICAgb3B0cy5tYWdGaWx0ZXIgPSBGaWx0ZXJJbmRleFt0aGlzLl9tYWdGaWx0ZXJdO1xuICAgICAgICBvcHRzLndyYXBTID0gdGhpcy5fd3JhcFM7XG4gICAgICAgIG9wdHMud3JhcFQgPSB0aGlzLl93cmFwVDtcbiAgICAgICAgXG4gICAgICAgIGlmICghdGhpcy5fdGV4dHVyZSkge1xuICAgICAgICAgICAgdGhpcy5fdGV4dHVyZSA9IG5ldyByZW5kZXJlci5UZXh0dXJlMkQocmVuZGVyZXIuZGV2aWNlLCBvcHRzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmUudXBkYXRlKG9wdHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdXBkYXRlRm9ybWF0KCk7XG4gICAgICAgIHRoaXMuX2NoZWNrUGFja2FibGUoKTtcblxuICAgICAgICAvL2Rpc3BhdGNoIGxvYWQgZXZlbnQgdG8gbGlzdGVuZXIuXG4gICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lbWl0KFwibG9hZFwiKTtcblxuICAgICAgICBpZiAoY2MubWFjcm8uQ0xFQU5VUF9JTUFHRV9DQUNIRSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2ltYWdlIGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NsZWFySW1hZ2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNjLnN5cy5jYXBhYmlsaXRpZXMuaW1hZ2VCaXRtYXAgJiYgdGhpcy5faW1hZ2UgaW5zdGFuY2VvZiBJbWFnZUJpdG1hcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ltYWdlLmNsb3NlICYmIHRoaXMuX2ltYWdlLmNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIERlc2NyaXB0aW9uIG9mIGNjLlRleHR1cmUyRC5cbiAgICAgKiAhI3poIGNjLlRleHR1cmUyRCDmj4/ov7DjgIJcbiAgICAgKiBAbWV0aG9kIGRlc2NyaXB0aW9uXG4gICAgICogQHJldHVybnMge1N0cmluZ31cbiAgICAgKi9cbiAgICBkZXNjcmlwdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIjxjYy5UZXh0dXJlMkQgfCBOYW1lID0gXCIgKyB0aGlzLm5hdGl2ZVVybCArIFwiIHwgRGltZW5zaW9ucyA9IFwiICsgdGhpcy53aWR0aCArIFwiIHggXCIgKyB0aGlzLmhlaWdodCArIFwiPlwiO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmVsZWFzZSB0ZXh0dXJlLCBwbGVhc2UgdXNlIGRlc3Ryb3kgaW5zdGVhZC5cbiAgICAgKiAhI3poIOmHiuaUvue6ueeQhu+8jOivt+S9v+eUqCBkZXN0cm95IOabv+S7o+OAglxuICAgICAqIEBtZXRob2QgcmVsZWFzZVRleHR1cmVcbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gICAgICovXG4gICAgcmVsZWFzZVRleHR1cmUgKCkge1xuICAgICAgICB0aGlzLl9pbWFnZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX3RleHR1cmUgJiYgdGhpcy5fdGV4dHVyZS5kZXN0cm95KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0cyB0aGUgd3JhcCBzIGFuZCB3cmFwIHQgb3B0aW9ucy4gPGJyLz5cbiAgICAgKiBJZiB0aGUgdGV4dHVyZSBzaXplIGlzIE5QT1QgKG5vbiBwb3dlciBvZiAyKSwgdGhlbiBpbiBjYW4gb25seSB1c2UgZ2wuQ0xBTVBfVE9fRURHRSBpbiBnbC5URVhUVVJFX1dSQVBfe1MsVH0uXG4gICAgICogISN6aCDorr7nva7nurnnkIbljIXoo4XmqKHlvI/jgIJcbiAgICAgKiDoi6XnurnnkIbotLTlm77lsLrlr7jmmK8gTlBPVO+8iG5vbiBwb3dlciBvZiAy77yJ77yM5YiZ5Y+q6IO95L2/55SoIFRleHR1cmUyRC5XcmFwTW9kZS5DTEFNUF9UT19FREdF44CCXG4gICAgICogQG1ldGhvZCBzZXRXcmFwTW9kZVxuICAgICAqIEBwYXJhbSB7VGV4dHVyZTJELldyYXBNb2RlfSB3cmFwU1xuICAgICAqIEBwYXJhbSB7VGV4dHVyZTJELldyYXBNb2RlfSB3cmFwVFxuICAgICAqL1xuICAgIHNldFdyYXBNb2RlICh3cmFwUywgd3JhcFQpIHtcbiAgICAgICAgaWYgKHRoaXMuX3dyYXBTICE9PSB3cmFwUyB8fCB0aGlzLl93cmFwVCAhPT0gd3JhcFQpIHtcbiAgICAgICAgICAgIHZhciBvcHRzID0gX2dldFNoYXJlZE9wdGlvbnMoKTtcbiAgICAgICAgICAgIG9wdHMud3JhcFMgPSB3cmFwUztcbiAgICAgICAgICAgIG9wdHMud3JhcFQgPSB3cmFwVDtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKG9wdHMpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0cyB0aGUgbWluRmlsdGVyIGFuZCBtYWdGaWx0ZXIgb3B0aW9uc1xuICAgICAqICEjemgg6K6+572u57q555CG6LS05Zu+57yp5bCP5ZKM5pS+5aSn6L+H5ruk5Zmo566X5rOV6YCJ6aG544CCXG4gICAgICogQG1ldGhvZCBzZXRGaWx0ZXJzXG4gICAgICogQHBhcmFtIHtUZXh0dXJlMkQuRmlsdGVyfSBtaW5GaWx0ZXJcbiAgICAgKiBAcGFyYW0ge1RleHR1cmUyRC5GaWx0ZXJ9IG1hZ0ZpbHRlclxuICAgICAqL1xuICAgIHNldEZpbHRlcnMgKG1pbkZpbHRlciwgbWFnRmlsdGVyKSB7XG4gICAgICAgIGlmICh0aGlzLl9taW5GaWx0ZXIgIT09IG1pbkZpbHRlciB8fCB0aGlzLl9tYWdGaWx0ZXIgIT09IG1hZ0ZpbHRlcikge1xuICAgICAgICAgICAgdmFyIG9wdHMgPSBfZ2V0U2hhcmVkT3B0aW9ucygpO1xuICAgICAgICAgICAgb3B0cy5taW5GaWx0ZXIgPSBtaW5GaWx0ZXI7XG4gICAgICAgICAgICBvcHRzLm1hZ0ZpbHRlciA9IG1hZ0ZpbHRlcjtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKG9wdHMpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTZXRzIHRoZSBmbGlwWSBvcHRpb25zXG4gICAgICogISN6aCDorr7nva7otLTlm77nmoTnurXlkJHnv7vovazpgInpobnjgIJcbiAgICAgKiBAbWV0aG9kIHNldEZsaXBZXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBmbGlwWVxuICAgICAqL1xuICAgIHNldEZsaXBZIChmbGlwWSkge1xuICAgICAgICBpZiAodGhpcy5fZmxpcFkgIT09IGZsaXBZKSB7XG4gICAgICAgICAgICB2YXIgb3B0cyA9IF9nZXRTaGFyZWRPcHRpb25zKCk7XG4gICAgICAgICAgICBvcHRzLmZsaXBZID0gZmxpcFk7XG4gICAgICAgICAgICBvcHRzLnByZW11bHRpcGx5QWxwaGEgPSB0aGlzLl9wcmVtdWx0aXBseUFscGhhO1xuICAgICAgICAgICAgdGhpcy51cGRhdGUob3B0cyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldHMgdGhlIHByZW11bHRpcGx5IGFscGhhIG9wdGlvbnNcbiAgICAgKiAhI3poIOiuvue9rui0tOWbvueahOmihOS5mOmAiemhueOAglxuICAgICAqIEBtZXRob2Qgc2V0UHJlbXVsdGlwbHlBbHBoYVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gcHJlbXVsdGlwbHlcbiAgICAgKi9cbiAgICBzZXRQcmVtdWx0aXBseUFscGhhIChwcmVtdWx0aXBseSkge1xuICAgICAgICBpZiAodGhpcy5fcHJlbXVsdGlwbHlBbHBoYSAhPT0gcHJlbXVsdGlwbHkpIHtcbiAgICAgICAgICAgIHZhciBvcHRzID0gX2dldFNoYXJlZE9wdGlvbnMoKTtcbiAgICAgICAgICAgIG9wdHMuZmxpcFkgPSB0aGlzLl9mbGlwWTtcbiAgICAgICAgICAgIG9wdHMucHJlbXVsdGlwbHlBbHBoYSA9IHByZW11bHRpcGx5O1xuICAgICAgICAgICAgdGhpcy51cGRhdGUob3B0cyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VwZGF0ZUZvcm1hdCAoKSB7XG4gICAgICAgIHRoaXMuX2lzQWxwaGFBdGxhcyA9IHRoaXMuX2Zvcm1hdCA9PT0gUGl4ZWxGb3JtYXQuUkdCQV9FVEMxIHx8IHRoaXMuX2Zvcm1hdCA9PT0gUGl4ZWxGb3JtYXQuUkdCX0FfUFZSVENfNEJQUFYxIHx8IHRoaXMuX2Zvcm1hdCA9PT0gUGl4ZWxGb3JtYXQuUkdCX0FfUFZSVENfMkJQUFYxO1xuICAgICAgICBpZiAoQ0NfSlNCKSB7XG4gICAgICAgICAgICB0aGlzLl90ZXh0dXJlLnNldEFscGhhQXRsYXModGhpcy5faXNBbHBoYUF0bGFzKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfY2hlY2tQYWNrYWJsZSAoKSB7XG4gICAgICAgIGxldCBkeW5hbWljQXRsYXMgPSBjYy5keW5hbWljQXRsYXNNYW5hZ2VyO1xuICAgICAgICBpZiAoIWR5bmFtaWNBdGxhcykgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLl9pc0NvbXByZXNzZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5fcGFja2FibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB3ID0gdGhpcy53aWR0aCwgaCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgICBpZiAoIXRoaXMuX2ltYWdlIHx8XG4gICAgICAgICAgICB3ID4gZHluYW1pY0F0bGFzLm1heEZyYW1lU2l6ZSB8fCBoID4gZHluYW1pY0F0bGFzLm1heEZyYW1lU2l6ZSB8fCBcbiAgICAgICAgICAgIHRoaXMuX2dldEhhc2goKSAhPT0gZHluYW1pY0F0bGFzLkF0bGFzLkRFRkFVTFRfSEFTSCkge1xuICAgICAgICAgICAgdGhpcy5fcGFja2FibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9pbWFnZSAmJiB0aGlzLl9pbWFnZSBpbnN0YW5jZW9mIEhUTUxDYW52YXNFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9wYWNrYWJsZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2dldE9wdHMoKSB7XG4gICAgICAgIGxldCBvcHRzID0gX2dldFNoYXJlZE9wdGlvbnMoKTtcbiAgICAgICAgb3B0cy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIG9wdHMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgIG9wdHMuZ2VuTWlwbWFwcyA9IHRoaXMuX2dlbk1pcG1hcHM7XG4gICAgICAgIG9wdHMuZm9ybWF0ID0gdGhpcy5fZm9ybWF0O1xuICAgICAgICBvcHRzLnByZW11bHRpcGx5QWxwaGEgPSB0aGlzLl9wcmVtdWx0aXBseUFscGhhO1xuICAgICAgICBvcHRzLmFuaXNvdHJvcHkgPSB0aGlzLl9hbmlzb3Ryb3B5O1xuICAgICAgICBvcHRzLmZsaXBZID0gdGhpcy5fZmxpcFk7XG4gICAgICAgIG9wdHMubWluRmlsdGVyID0gRmlsdGVySW5kZXhbdGhpcy5fbWluRmlsdGVyXTtcbiAgICAgICAgb3B0cy5tYWdGaWx0ZXIgPSBGaWx0ZXJJbmRleFt0aGlzLl9tYWdGaWx0ZXJdO1xuICAgICAgICBvcHRzLm1pcEZpbHRlciA9IEZpbHRlckluZGV4W3RoaXMuX21pcEZpbHRlcl07XG4gICAgICAgIG9wdHMud3JhcFMgPSB0aGlzLl93cmFwUztcbiAgICAgICAgb3B0cy53cmFwVCA9IHRoaXMuX3dyYXBUO1xuICAgICAgICByZXR1cm4gb3B0cztcbiAgICB9LFxuXG4gICAgX2dldEdGWFBpeGVsRm9ybWF0IChmb3JtYXQpIHtcbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gUGl4ZWxGb3JtYXQuUkdCQV9FVEMxKSB7XG4gICAgICAgICAgICBmb3JtYXQgPSBQaXhlbEZvcm1hdC5SR0JfRVRDMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmb3JtYXQgPT09IFBpeGVsRm9ybWF0LlJHQl9BX1BWUlRDXzRCUFBWMSkge1xuICAgICAgICAgICAgZm9ybWF0ID0gUGl4ZWxGb3JtYXQuUkdCX1BWUlRDXzRCUFBWMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmb3JtYXQgPT09IFBpeGVsRm9ybWF0LlJHQl9BX1BWUlRDXzJCUFBWMSkge1xuICAgICAgICAgICAgZm9ybWF0ID0gUGl4ZWxGb3JtYXQuUkdCX1BWUlRDXzJCUFBWMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZm9ybWF0O1xuICAgIH0sXG5cbiAgICBfcmVzZXRVbmRlcmx5aW5nTWlwbWFwcyhtaXBtYXBTb3VyY2VzKSB7XG4gICAgICAgIGNvbnN0IG9wdHMgPSB0aGlzLl9nZXRPcHRzKCk7XG4gICAgICAgIG9wdHMuaW1hZ2VzID0gbWlwbWFwU291cmNlcyB8fCBbbnVsbF07XG4gICAgICAgIGlmICghdGhpcy5fdGV4dHVyZSkge1xuICAgICAgICAgICAgdGhpcy5fdGV4dHVyZSA9IG5ldyByZW5kZXJlci5UZXh0dXJlMkQocmVuZGVyZXIuZGV2aWNlLCBvcHRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmUudXBkYXRlKG9wdHMpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIFNFUklBTElaQVRJT05cblxuICAgIF9zZXJpYWxpemU6IChDQ19FRElUT1IgfHwgQ0NfVEVTVCkgJiYgZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgZXh0SWQgPSBcIlwiO1xuICAgICAgICBsZXQgZXhwb3J0ZWRFeHRzID0gdGhpcy5fZXhwb3J0ZWRFeHRzO1xuICAgICAgICBpZiAoIWV4cG9ydGVkRXh0cyAmJiB0aGlzLl9uYXRpdmUpIHtcbiAgICAgICAgICAgIGV4cG9ydGVkRXh0cyA9IFt0aGlzLl9uYXRpdmVdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChleHBvcnRlZEV4dHMpIHtcbiAgICAgICAgICAgIGxldCBleHRzID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4cG9ydGVkRXh0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBleHRJZCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgbGV0IGV4dCA9IGV4cG9ydGVkRXh0c1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGV4dEBmb3JtYXRcbiAgICAgICAgICAgICAgICAgICAgbGV0IGV4dEZvcm1hdCA9IGV4dC5zcGxpdCgnQCcpO1xuICAgICAgICAgICAgICAgICAgICBleHRJZCA9IFRleHR1cmUyRC5leHRuYW1lcy5pbmRleE9mKGV4dEZvcm1hdFswXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleHRJZCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dElkID0gZXh0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChleHRGb3JtYXRbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dElkICs9ICdAJyArIGV4dEZvcm1hdFsxXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBleHRzLnB1c2goZXh0SWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXh0SWQgPSBleHRzLmpvaW4oJ18nKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYXNzZXQgPSBgJHtleHRJZH0sJHt0aGlzLl9taW5GaWx0ZXJ9LCR7dGhpcy5fbWFnRmlsdGVyfSwke3RoaXMuX3dyYXBTfSwke3RoaXMuX3dyYXBUfSxgICtcbiAgICAgICAgICAgICAgICAgICAgYCR7dGhpcy5fcHJlbXVsdGlwbHlBbHBoYSA/IDEgOiAwfSwke3RoaXMuX2dlbk1pcG1hcHMgPyAxIDogMH0sJHt0aGlzLl9wYWNrYWJsZSA/IDEgOiAwfWA7XG4gICAgICAgIHJldHVybiBhc3NldDtcbiAgICB9LFxuXG4gICAgX2Rlc2VyaWFsaXplOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBsZXQgZmllbGRzID0gZGF0YS5zcGxpdCgnLCcpO1xuICAgICAgICAvLyBkZWNvZGUgZXh0bmFtZVxuICAgICAgICBsZXQgZXh0SWRTdHIgPSBmaWVsZHNbMF07XG4gICAgICAgIGlmIChleHRJZFN0cikge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFRleHR1cmUyRC5fcGFyc2VFeHQoZXh0SWRTdHIsIHRoaXMuX2Zvcm1hdCk7XG5cbiAgICAgICAgICAgIGlmIChyZXN1bHQuYmVzdEV4dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NldFJhd0Fzc2V0KHJlc3VsdC5iZXN0RXh0KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JtYXQgPSByZXN1bHQuYmVzdEZvcm1hdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHJlc3VsdC5kZWZhdWx0RXh0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0UmF3QXNzZXQocmVzdWx0LmRlZmF1bHRFeHQpO1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzMTIwLCByZXN1bHQuZGVmYXVsdEV4dCwgcmVzdWx0LmRlZmF1bHRFeHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGNjLmRlYnVnLmdldEVycm9yKDMxMjEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZmllbGRzLmxlbmd0aCA9PT0gOCkge1xuICAgICAgICAgICAgLy8gZGVjb2RlIGZpbHRlcnNcbiAgICAgICAgICAgIHRoaXMuX21pbkZpbHRlciA9IHBhcnNlSW50KGZpZWxkc1sxXSk7XG4gICAgICAgICAgICB0aGlzLl9tYWdGaWx0ZXIgPSBwYXJzZUludChmaWVsZHNbMl0pO1xuICAgICAgICAgICAgLy8gZGVjb2RlIHdyYXBzXG4gICAgICAgICAgICB0aGlzLl93cmFwUyA9IHBhcnNlSW50KGZpZWxkc1szXSk7XG4gICAgICAgICAgICB0aGlzLl93cmFwVCA9IHBhcnNlSW50KGZpZWxkc1s0XSk7XG4gICAgICAgICAgICAvLyBkZWNvZGUgcHJlbXVsdGlwbHkgYWxwaGFcbiAgICAgICAgICAgIHRoaXMuX3ByZW11bHRpcGx5QWxwaGEgPSBmaWVsZHNbNV0uY2hhckNvZGVBdCgwKSA9PT0gQ0hBUl9DT0RFXzE7XG4gICAgICAgICAgICB0aGlzLl9nZW5NaXBtYXBzID0gZmllbGRzWzZdLmNoYXJDb2RlQXQoMCkgPT09IENIQVJfQ09ERV8xO1xuICAgICAgICAgICAgdGhpcy5fcGFja2FibGUgPSBmaWVsZHNbN10uY2hhckNvZGVBdCgwKSA9PT0gQ0hBUl9DT0RFXzE7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2dldEhhc2ggKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2hhc2hEaXJ0eSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hhc2g7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGdlbk1pcG1hcHMgPSB0aGlzLl9nZW5NaXBtYXBzID8gMSA6IDA7XG4gICAgICAgIGxldCBwcmVtdWx0aXBseUFscGhhID0gdGhpcy5fcHJlbXVsdGlwbHlBbHBoYSA/IDEgOiAwO1xuICAgICAgICBsZXQgZmxpcFkgPSB0aGlzLl9mbGlwWSA/IDEgOiAwO1xuICAgICAgICBsZXQgbWluRmlsdGVyID0gdGhpcy5fbWluRmlsdGVyID09PSBGaWx0ZXIuTElORUFSID8gMSA6IDI7XG4gICAgICAgIGxldCBtYWdGaWx0ZXIgPSB0aGlzLl9tYWdGaWx0ZXIgPT09IEZpbHRlci5MSU5FQVIgPyAxIDogMjtcbiAgICAgICAgbGV0IHdyYXBTID0gdGhpcy5fd3JhcFMgPT09IFdyYXBNb2RlLlJFUEVBVCA/IDEgOiAodGhpcy5fd3JhcFMgPT09IFdyYXBNb2RlLkNMQU1QX1RPX0VER0UgPyAyIDogMyk7XG4gICAgICAgIGxldCB3cmFwVCA9IHRoaXMuX3dyYXBUID09PSBXcmFwTW9kZS5SRVBFQVQgPyAxIDogKHRoaXMuX3dyYXBUID09PSBXcmFwTW9kZS5DTEFNUF9UT19FREdFID8gMiA6IDMpO1xuICAgICAgICBsZXQgcGl4ZWxGb3JtYXQgPSB0aGlzLl9mb3JtYXQ7XG4gICAgICAgIGxldCBpbWFnZSA9IHRoaXMuX2ltYWdlO1xuICAgICAgICBpZiAoQ0NfSlNCICYmIGltYWdlKSB7XG4gICAgICAgICAgICBpZiAoaW1hZ2UuX2dsRm9ybWF0ICYmIGltYWdlLl9nbEZvcm1hdCAhPT0gR0xfUkdCQSlcbiAgICAgICAgICAgICAgICBwaXhlbEZvcm1hdCA9IDA7XG4gICAgICAgICAgICBwcmVtdWx0aXBseUFscGhhID0gaW1hZ2UuX3ByZW11bHRpcGx5QWxwaGEgPyAxIDogMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2hhc2ggPSBOdW1iZXIoYCR7bWluRmlsdGVyfSR7bWFnRmlsdGVyfSR7cGl4ZWxGb3JtYXR9JHt3cmFwU30ke3dyYXBUfSR7Z2VuTWlwbWFwc30ke3ByZW11bHRpcGx5QWxwaGF9JHtmbGlwWX1gKTtcbiAgICAgICAgdGhpcy5faGFzaERpcnR5ID0gZmFsc2U7XG4gICAgICAgIHJldHVybiB0aGlzLl9oYXNoO1xuICAgIH0sXG5cbiAgICBfaXNDb21wcmVzc2VkICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Zvcm1hdCA8IFBpeGVsRm9ybWF0LkE4IHx8IHRoaXMuX2Zvcm1hdCA+IFBpeGVsRm9ybWF0LlJHQkEzMkY7XG4gICAgfSxcbiAgICBcbiAgICBfY2xlYXJJbWFnZSAoKSB7XG4gICAgICAgIHRoaXMuX2ltYWdlLnNyYyA9IFwiXCI7XG4gICAgfSxcblxuICAgIF9jaGVja0ltYWdlQml0bWFwIChjYikge1xuICAgICAgICBsZXQgaW1hZ2UgPSB0aGlzLl9pbWFnZTtcbiAgICAgICAgbGV0IGZsaXBZID0gdGhpcy5fZmxpcFk7XG4gICAgICAgIGxldCBwcmVtdWx0aXBseUFscGhhID0gdGhpcy5fcHJlbXVsdGlwbHlBbHBoYTtcbiAgICAgICAgaWYgKHRoaXMuX2ZsaXBZICE9PSBpbWFnZS5mbGlwWSB8fCB0aGlzLl9wcmVtdWx0aXBseUFscGhhICE9PSBpbWFnZS5wcmVtdWx0aXBseUFscGhhKSB7XG4gICAgICAgICAgICBjcmVhdGVJbWFnZUJpdG1hcChpbWFnZSwge1xuICAgICAgICAgICAgICAgIGltYWdlT3JpZW50YXRpb246IGZsaXBZICE9PSBpbWFnZS5mbGlwWSA/ICdmbGlwWScgOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgcHJlbXVsdGlwbHlBbHBoYTogcHJlbXVsdGlwbHlBbHBoYSA/ICdwcmVtdWx0aXBseScgOiAnbm9uZSd9XG4gICAgICAgICAgICAgICAgKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2UuY2xvc2UgJiYgaW1hZ2UuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmZsaXBZID0gZmxpcFk7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wcmVtdWx0aXBseUFscGhhID0gcHJlbXVsdGlwbHlBbHBoYTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW1hZ2UgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIGNiKCk7XG4gICAgICAgICAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcihlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjYigpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbi8qKlxuICogISN6aFxuICog5b2T6K+l6LWE5rqQ5Yqg6L295oiQ5Yqf5ZCO6Kem5Y+R6K+l5LqL5Lu2XG4gKiAhI2VuXG4gKiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgd2hlbiB0aGUgYXNzZXQgaXMgbG9hZGVkXG4gKlxuICogQGV2ZW50IGxvYWRcbiAqL1xuXG5jYy5UZXh0dXJlMkQgPSBtb2R1bGUuZXhwb3J0cyA9IFRleHR1cmUyRDtcbiJdLCJzb3VyY2VSb290IjoiLyJ9