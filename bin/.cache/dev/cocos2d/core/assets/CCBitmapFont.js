
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCBitmapFont.js';
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
var FontLetterDefinition = function FontLetterDefinition() {
  this.u = 0;
  this.v = 0;
  this.w = 0;
  this.h = 0;
  this.offsetX = 0;
  this.offsetY = 0;
  this.textureID = 0;
  this.valid = false;
  this.xAdvance = 0;
};

var FontAtlas = function FontAtlas(texture) {
  this._letterDefinitions = {};
  this._texture = texture;
};

FontAtlas.prototype = {
  constructor: FontAtlas,
  addLetterDefinitions: function addLetterDefinitions(letter, letterDefinition) {
    this._letterDefinitions[letter] = letterDefinition;
  },
  cloneLetterDefinition: function cloneLetterDefinition() {
    var copyLetterDefinitions = {};

    for (var key in this._letterDefinitions) {
      var value = new FontLetterDefinition();
      cc.js.mixin(value, this._letterDefinitions[key]);
      copyLetterDefinitions[key] = value;
    }

    return copyLetterDefinitions;
  },
  getTexture: function getTexture() {
    return this._texture;
  },
  getLetter: function getLetter(key) {
    return this._letterDefinitions[key];
  },
  getLetterDefinitionForChar: function getLetterDefinitionForChar(_char) {
    var key = _char.charCodeAt(0);

    var hasKey = this._letterDefinitions.hasOwnProperty(key);

    var letter;

    if (hasKey) {
      letter = this._letterDefinitions[key];
    } else {
      letter = null;
    }

    return letter;
  },
  clear: function clear() {
    this._letterDefinitions = {};
  }
};
/**
 * @module cc
 */

/**
 * !#en Class for BitmapFont handling.
 * !#zh 位图字体资源类。
 * @class BitmapFont
 * @extends Font
 *
 */

var BitmapFont = cc.Class({
  name: 'cc.BitmapFont',
  "extends": cc.Font,
  properties: {
    fntDataStr: {
      "default": ''
    },
    spriteFrame: {
      "default": null,
      type: cc.SpriteFrame
    },
    fontSize: {
      "default": -1
    },
    //用来缓存 BitmapFont 解析之后的数据
    _fntConfig: null,
    _fontDefDictionary: null
  },
  onLoad: function onLoad() {
    var spriteFrame = this.spriteFrame;

    if (!this._fontDefDictionary) {
      this._fontDefDictionary = new FontAtlas();

      if (spriteFrame) {
        this._fontDefDictionary._texture = spriteFrame._texture;
      }
    }

    var fntConfig = this._fntConfig;

    if (!fntConfig) {
      return;
    }

    var fontDict = fntConfig.fontDefDictionary;

    for (var fontDef in fontDict) {
      var letter = new FontLetterDefinition();
      var rect = fontDict[fontDef].rect;
      letter.offsetX = fontDict[fontDef].xOffset;
      letter.offsetY = fontDict[fontDef].yOffset;
      letter.w = rect.width;
      letter.h = rect.height;
      letter.u = rect.x;
      letter.v = rect.y; //FIXME: only one texture supported for now

      letter.textureID = 0;
      letter.valid = true;
      letter.xAdvance = fontDict[fontDef].xAdvance;

      this._fontDefDictionary.addLetterDefinitions(fontDef, letter);
    }
  }
});
cc.BitmapFont = BitmapFont;
cc.BitmapFont.FontLetterDefinition = FontLetterDefinition;
cc.BitmapFont.FontAtlas = FontAtlas;
module.exports = BitmapFont;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0cy9DQ0JpdG1hcEZvbnQuanMiXSwibmFtZXMiOlsiRm9udExldHRlckRlZmluaXRpb24iLCJ1IiwidiIsInciLCJoIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJ0ZXh0dXJlSUQiLCJ2YWxpZCIsInhBZHZhbmNlIiwiRm9udEF0bGFzIiwidGV4dHVyZSIsIl9sZXR0ZXJEZWZpbml0aW9ucyIsIl90ZXh0dXJlIiwicHJvdG90eXBlIiwiY29uc3RydWN0b3IiLCJhZGRMZXR0ZXJEZWZpbml0aW9ucyIsImxldHRlciIsImxldHRlckRlZmluaXRpb24iLCJjbG9uZUxldHRlckRlZmluaXRpb24iLCJjb3B5TGV0dGVyRGVmaW5pdGlvbnMiLCJrZXkiLCJ2YWx1ZSIsImNjIiwianMiLCJtaXhpbiIsImdldFRleHR1cmUiLCJnZXRMZXR0ZXIiLCJnZXRMZXR0ZXJEZWZpbml0aW9uRm9yQ2hhciIsImNoYXIiLCJjaGFyQ29kZUF0IiwiaGFzS2V5IiwiaGFzT3duUHJvcGVydHkiLCJjbGVhciIsIkJpdG1hcEZvbnQiLCJDbGFzcyIsIm5hbWUiLCJGb250IiwicHJvcGVydGllcyIsImZudERhdGFTdHIiLCJzcHJpdGVGcmFtZSIsInR5cGUiLCJTcHJpdGVGcmFtZSIsImZvbnRTaXplIiwiX2ZudENvbmZpZyIsIl9mb250RGVmRGljdGlvbmFyeSIsIm9uTG9hZCIsImZudENvbmZpZyIsImZvbnREaWN0IiwiZm9udERlZkRpY3Rpb25hcnkiLCJmb250RGVmIiwicmVjdCIsInhPZmZzZXQiLCJ5T2Zmc2V0Iiwid2lkdGgiLCJoZWlnaHQiLCJ4IiwieSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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aUQsSUFBSSxDQUFDTSxDQUFoQixDQVQwQixDQVUxQjs7QUFDQXhDLE1BQUFBLE1BQU0sQ0FBQ1YsU0FBUCxHQUFtQixDQUFuQjtBQUNBVSxNQUFBQSxNQUFNLENBQUNULEtBQVAsR0FBZSxJQUFmO0FBQ0FTLE1BQUFBLE1BQU0sQ0FBQ1IsUUFBUCxHQUFrQnVDLFFBQVEsQ0FBQ0UsT0FBRCxDQUFSLENBQWtCekMsUUFBcEM7O0FBRUEsV0FBS29DLGtCQUFMLENBQXdCN0Isb0JBQXhCLENBQTZDa0MsT0FBN0MsRUFBc0RqQyxNQUF0RDtBQUNIO0FBQ0o7QUFyRHFCLENBQVQsQ0FBakI7QUF3REFNLEVBQUUsQ0FBQ1csVUFBSCxHQUFnQkEsVUFBaEI7QUFDQVgsRUFBRSxDQUFDVyxVQUFILENBQWNsQyxvQkFBZCxHQUFxQ0Esb0JBQXJDO0FBQ0F1QixFQUFFLENBQUNXLFVBQUgsQ0FBY3hCLFNBQWQsR0FBMEJBLFNBQTFCO0FBQ0FnRCxNQUFNLENBQUNDLE9BQVAsR0FBaUJ6QixVQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxubGV0IEZvbnRMZXR0ZXJEZWZpbml0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy51ID0gMDtcbiAgICB0aGlzLnYgPSAwO1xuICAgIHRoaXMudyA9IDA7XG4gICAgdGhpcy5oID0gMDtcbiAgICB0aGlzLm9mZnNldFggPSAwO1xuICAgIHRoaXMub2Zmc2V0WSA9IDA7XG4gICAgdGhpcy50ZXh0dXJlSUQgPSAwO1xuICAgIHRoaXMudmFsaWQgPSBmYWxzZTtcbiAgICB0aGlzLnhBZHZhbmNlID0gMDtcbn07XG5cbmxldCBGb250QXRsYXMgPSBmdW5jdGlvbiAodGV4dHVyZSkge1xuICAgIHRoaXMuX2xldHRlckRlZmluaXRpb25zID0ge307XG4gICAgdGhpcy5fdGV4dHVyZSA9IHRleHR1cmU7XG59O1xuXG5Gb250QXRsYXMucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBGb250QXRsYXMsXG4gICAgYWRkTGV0dGVyRGVmaW5pdGlvbnMgKGxldHRlciwgbGV0dGVyRGVmaW5pdGlvbikge1xuICAgICAgICB0aGlzLl9sZXR0ZXJEZWZpbml0aW9uc1tsZXR0ZXJdID0gbGV0dGVyRGVmaW5pdGlvbjtcbiAgICB9LFxuICAgIGNsb25lTGV0dGVyRGVmaW5pdGlvbiAoKSB7XG4gICAgICAgIGxldCBjb3B5TGV0dGVyRGVmaW5pdGlvbnMgPSB7fTtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuX2xldHRlckRlZmluaXRpb25zKSB7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBuZXcgRm9udExldHRlckRlZmluaXRpb24oKTtcbiAgICAgICAgICAgIGNjLmpzLm1peGluKHZhbHVlLCB0aGlzLl9sZXR0ZXJEZWZpbml0aW9uc1trZXldKTtcbiAgICAgICAgICAgIGNvcHlMZXR0ZXJEZWZpbml0aW9uc1trZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvcHlMZXR0ZXJEZWZpbml0aW9ucztcbiAgICB9LFxuICAgIGdldFRleHR1cmUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dHVyZTtcbiAgICB9LFxuICAgIGdldExldHRlciAoa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sZXR0ZXJEZWZpbml0aW9uc1trZXldO1xuICAgIH0sXG4gICAgZ2V0TGV0dGVyRGVmaW5pdGlvbkZvckNoYXIgKGNoYXIpIHtcbiAgICAgICAgbGV0IGtleSA9IGNoYXIuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgbGV0IGhhc0tleSA9IHRoaXMuX2xldHRlckRlZmluaXRpb25zLmhhc093blByb3BlcnR5KGtleSk7XG4gICAgICAgIGxldCBsZXR0ZXI7XG4gICAgICAgIGlmIChoYXNLZXkpIHtcbiAgICAgICAgICAgIGxldHRlciA9IHRoaXMuX2xldHRlckRlZmluaXRpb25zW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXR0ZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsZXR0ZXI7XG4gICAgfSxcbiAgICBjbGVhciAoKSB7XG4gICAgICAgIHRoaXMuX2xldHRlckRlZmluaXRpb25zID0ge307XG4gICAgfVxufTtcblxuLyoqXG4gKiBAbW9kdWxlIGNjXG4gKi9cbi8qKlxuICogISNlbiBDbGFzcyBmb3IgQml0bWFwRm9udCBoYW5kbGluZy5cbiAqICEjemgg5L2N5Zu+5a2X5L2T6LWE5rqQ57G744CCXG4gKiBAY2xhc3MgQml0bWFwRm9udFxuICogQGV4dGVuZHMgRm9udFxuICpcbiAqL1xudmFyIEJpdG1hcEZvbnQgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkJpdG1hcEZvbnQnLFxuICAgIGV4dGVuZHM6IGNjLkZvbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGZudERhdGFTdHI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICAgIH0sXG5cbiAgICAgICAgc3ByaXRlRnJhbWU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVGcmFtZVxuICAgICAgICB9LFxuXG4gICAgICAgIGZvbnRTaXplOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAtMVxuICAgICAgICB9LFxuICAgICAgICAvL+eUqOadpee8k+WtmCBCaXRtYXBGb250IOino+aekOS5i+WQjueahOaVsOaNrlxuICAgICAgICBfZm50Q29uZmlnOiBudWxsLFxuICAgICAgICBfZm9udERlZkRpY3Rpb25hcnk6IG51bGxcbiAgICB9LFxuXG4gICAgb25Mb2FkICgpIHtcbiAgICAgICAgbGV0IHNwcml0ZUZyYW1lID0gdGhpcy5zcHJpdGVGcmFtZTtcbiAgICAgICAgaWYgKCF0aGlzLl9mb250RGVmRGljdGlvbmFyeSkge1xuICAgICAgICAgICAgdGhpcy5fZm9udERlZkRpY3Rpb25hcnkgPSBuZXcgRm9udEF0bGFzKCk7XG4gICAgICAgICAgICBpZiAoc3ByaXRlRnJhbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb250RGVmRGljdGlvbmFyeS5fdGV4dHVyZSA9IHNwcml0ZUZyYW1lLl90ZXh0dXJlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZudENvbmZpZyA9IHRoaXMuX2ZudENvbmZpZztcbiAgICAgICAgaWYgKCFmbnRDb25maWcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZm9udERpY3QgPSBmbnRDb25maWcuZm9udERlZkRpY3Rpb25hcnk7XG4gICAgICAgIGZvciAobGV0IGZvbnREZWYgaW4gZm9udERpY3QpIHtcbiAgICAgICAgICAgIGxldCBsZXR0ZXIgPSBuZXcgRm9udExldHRlckRlZmluaXRpb24oKTtcblxuICAgICAgICAgICAgbGV0IHJlY3QgPSBmb250RGljdFtmb250RGVmXS5yZWN0O1xuICAgICAgICAgICAgbGV0dGVyLm9mZnNldFggPSBmb250RGljdFtmb250RGVmXS54T2Zmc2V0O1xuICAgICAgICAgICAgbGV0dGVyLm9mZnNldFkgPSBmb250RGljdFtmb250RGVmXS55T2Zmc2V0O1xuICAgICAgICAgICAgbGV0dGVyLncgPSByZWN0LndpZHRoO1xuICAgICAgICAgICAgbGV0dGVyLmggPSByZWN0LmhlaWdodDtcbiAgICAgICAgICAgIGxldHRlci51ID0gcmVjdC54O1xuICAgICAgICAgICAgbGV0dGVyLnYgPSByZWN0Lnk7XG4gICAgICAgICAgICAvL0ZJWE1FOiBvbmx5IG9uZSB0ZXh0dXJlIHN1cHBvcnRlZCBmb3Igbm93XG4gICAgICAgICAgICBsZXR0ZXIudGV4dHVyZUlEID0gMDtcbiAgICAgICAgICAgIGxldHRlci52YWxpZCA9IHRydWU7XG4gICAgICAgICAgICBsZXR0ZXIueEFkdmFuY2UgPSBmb250RGljdFtmb250RGVmXS54QWR2YW5jZTtcblxuICAgICAgICAgICAgdGhpcy5fZm9udERlZkRpY3Rpb25hcnkuYWRkTGV0dGVyRGVmaW5pdGlvbnMoZm9udERlZiwgbGV0dGVyKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5CaXRtYXBGb250ID0gQml0bWFwRm9udDtcbmNjLkJpdG1hcEZvbnQuRm9udExldHRlckRlZmluaXRpb24gPSBGb250TGV0dGVyRGVmaW5pdGlvbjtcbmNjLkJpdG1hcEZvbnQuRm9udEF0bGFzID0gRm9udEF0bGFzO1xubW9kdWxlLmV4cG9ydHMgPSBCaXRtYXBGb250O1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=