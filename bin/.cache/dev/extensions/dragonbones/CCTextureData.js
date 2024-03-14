
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/dragonbones/CCTextureData.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
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
dragonBones.CCTextureAtlasData = cc.Class({
  "extends": dragonBones.TextureAtlasData,
  name: "dragonBones.CCTextureAtlasData",
  properties: {
    _renderTexture: {
      "default": null,
      serializable: false
    },
    renderTexture: {
      get: function get() {
        return this._renderTexture;
      },
      set: function set(value) {
        this._renderTexture = value;

        if (value) {
          for (var k in this.textures) {
            var textureData = this.textures[k];

            if (!textureData.spriteFrame) {
              var rect = null;

              if (textureData.rotated) {
                rect = cc.rect(textureData.region.x, textureData.region.y, textureData.region.height, textureData.region.width);
              } else {
                rect = cc.rect(textureData.region.x, textureData.region.y, textureData.region.width, textureData.region.height);
              }

              var offset = cc.v2(0, 0);
              var size = cc.size(rect.width, rect.height);
              textureData.spriteFrame = new cc.SpriteFrame();
              textureData.spriteFrame.setTexture(value, rect, false, offset, size);
            }
          }
        } else {
          for (var _k in this.textures) {
            var _textureData = this.textures[_k];
            _textureData.spriteFrame = null;
          }
        }
      }
    }
  },
  statics: {
    toString: function toString() {
      return "[class dragonBones.CCTextureAtlasData]";
    }
  },
  _onClear: function _onClear() {
    dragonBones.TextureAtlasData.prototype._onClear.call(this);

    this.renderTexture = null;
  },
  createTexture: function createTexture() {
    return dragonBones.BaseObject.borrowObject(dragonBones.CCTextureData);
  }
});
dragonBones.CCTextureData = cc.Class({
  "extends": dragonBones.TextureData,
  name: "dragonBones.CCTextureData",
  properties: {
    spriteFrame: {
      "default": null,
      serializable: false
    }
  },
  statics: {
    toString: function toString() {
      return "[class dragonBones.CCTextureData]";
    }
  },
  _onClear: function _onClear() {
    dragonBones.TextureData.prototype._onClear.call(this);

    this.spriteFrame = null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvZXh0ZW5zaW9ucy9kcmFnb25ib25lcy9DQ1RleHR1cmVEYXRhLmpzIl0sIm5hbWVzIjpbImRyYWdvbkJvbmVzIiwiQ0NUZXh0dXJlQXRsYXNEYXRhIiwiY2MiLCJDbGFzcyIsIlRleHR1cmVBdGxhc0RhdGEiLCJuYW1lIiwicHJvcGVydGllcyIsIl9yZW5kZXJUZXh0dXJlIiwic2VyaWFsaXphYmxlIiwicmVuZGVyVGV4dHVyZSIsImdldCIsInNldCIsInZhbHVlIiwiayIsInRleHR1cmVzIiwidGV4dHVyZURhdGEiLCJzcHJpdGVGcmFtZSIsInJlY3QiLCJyb3RhdGVkIiwicmVnaW9uIiwieCIsInkiLCJoZWlnaHQiLCJ3aWR0aCIsIm9mZnNldCIsInYyIiwic2l6ZSIsIlNwcml0ZUZyYW1lIiwic2V0VGV4dHVyZSIsInN0YXRpY3MiLCJ0b1N0cmluZyIsIl9vbkNsZWFyIiwicHJvdG90eXBlIiwiY2FsbCIsImNyZWF0ZVRleHR1cmUiLCJCYXNlT2JqZWN0IiwiYm9ycm93T2JqZWN0IiwiQ0NUZXh0dXJlRGF0YSIsIlRleHR1cmVEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLFdBQVcsQ0FBQ0Msa0JBQVosR0FBaUNDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ3RDLGFBQVNILFdBQVcsQ0FBQ0ksZ0JBRGlCO0FBRXRDQyxFQUFBQSxJQUFJLEVBQUUsZ0NBRmdDO0FBSXRDQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsY0FBYyxFQUFFO0FBQ1osaUJBQVMsSUFERztBQUVaQyxNQUFBQSxZQUFZLEVBQUU7QUFGRixLQURSO0FBTVJDLElBQUFBLGFBQWEsRUFBRTtBQUNYQyxNQUFBQSxHQURXLGlCQUNKO0FBQ0gsZUFBTyxLQUFLSCxjQUFaO0FBQ0gsT0FIVTtBQUlYSSxNQUFBQSxHQUpXLGVBSU5DLEtBSk0sRUFJQztBQUNSLGFBQUtMLGNBQUwsR0FBc0JLLEtBQXRCOztBQUNBLFlBQUlBLEtBQUosRUFBVztBQUNQLGVBQUssSUFBSUMsQ0FBVCxJQUFjLEtBQUtDLFFBQW5CLEVBQTZCO0FBQ3pCLGdCQUFJQyxXQUFXLEdBQUcsS0FBS0QsUUFBTCxDQUFjRCxDQUFkLENBQWxCOztBQUNBLGdCQUFJLENBQUNFLFdBQVcsQ0FBQ0MsV0FBakIsRUFBOEI7QUFDMUIsa0JBQUlDLElBQUksR0FBRyxJQUFYOztBQUNBLGtCQUFJRixXQUFXLENBQUNHLE9BQWhCLEVBQXlCO0FBQ3JCRCxnQkFBQUEsSUFBSSxHQUFHZixFQUFFLENBQUNlLElBQUgsQ0FBUUYsV0FBVyxDQUFDSSxNQUFaLENBQW1CQyxDQUEzQixFQUE4QkwsV0FBVyxDQUFDSSxNQUFaLENBQW1CRSxDQUFqRCxFQUNITixXQUFXLENBQUNJLE1BQVosQ0FBbUJHLE1BRGhCLEVBQ3dCUCxXQUFXLENBQUNJLE1BQVosQ0FBbUJJLEtBRDNDLENBQVA7QUFFSCxlQUhELE1BR087QUFDSE4sZ0JBQUFBLElBQUksR0FBR2YsRUFBRSxDQUFDZSxJQUFILENBQVFGLFdBQVcsQ0FBQ0ksTUFBWixDQUFtQkMsQ0FBM0IsRUFBOEJMLFdBQVcsQ0FBQ0ksTUFBWixDQUFtQkUsQ0FBakQsRUFDSE4sV0FBVyxDQUFDSSxNQUFaLENBQW1CSSxLQURoQixFQUN1QlIsV0FBVyxDQUFDSSxNQUFaLENBQW1CRyxNQUQxQyxDQUFQO0FBRUg7O0FBQ0Qsa0JBQUlFLE1BQU0sR0FBR3RCLEVBQUUsQ0FBQ3VCLEVBQUgsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFiO0FBQ0Esa0JBQUlDLElBQUksR0FBR3hCLEVBQUUsQ0FBQ3dCLElBQUgsQ0FBUVQsSUFBSSxDQUFDTSxLQUFiLEVBQW9CTixJQUFJLENBQUNLLE1BQXpCLENBQVg7QUFDQVAsY0FBQUEsV0FBVyxDQUFDQyxXQUFaLEdBQTBCLElBQUlkLEVBQUUsQ0FBQ3lCLFdBQVAsRUFBMUI7QUFDQVosY0FBQUEsV0FBVyxDQUFDQyxXQUFaLENBQXdCWSxVQUF4QixDQUFtQ2hCLEtBQW5DLEVBQTBDSyxJQUExQyxFQUFnRCxLQUFoRCxFQUF1RE8sTUFBdkQsRUFBK0RFLElBQS9EO0FBQ0g7QUFDSjtBQUNKLFNBbEJELE1Ba0JPO0FBQ0gsZUFBSyxJQUFJYixFQUFULElBQWMsS0FBS0MsUUFBbkIsRUFBNkI7QUFDekIsZ0JBQUlDLFlBQVcsR0FBRyxLQUFLRCxRQUFMLENBQWNELEVBQWQsQ0FBbEI7QUFDQUUsWUFBQUEsWUFBVyxDQUFDQyxXQUFaLEdBQTBCLElBQTFCO0FBQ0g7QUFDSjtBQUVKO0FBL0JVO0FBTlAsR0FKMEI7QUE2Q3RDYSxFQUFBQSxPQUFPLEVBQUU7QUFDTEMsSUFBQUEsUUFBUSxFQUFFLG9CQUFZO0FBQ2xCLGFBQU8sd0NBQVA7QUFDSDtBQUhJLEdBN0M2QjtBQW1EdENDLEVBQUFBLFFBQVEsRUFBRSxvQkFBWTtBQUNsQi9CLElBQUFBLFdBQVcsQ0FBQ0ksZ0JBQVosQ0FBNkI0QixTQUE3QixDQUF1Q0QsUUFBdkMsQ0FBZ0RFLElBQWhELENBQXFELElBQXJEOztBQUNBLFNBQUt4QixhQUFMLEdBQXFCLElBQXJCO0FBQ0gsR0F0RHFDO0FBd0R0Q3lCLEVBQUFBLGFBQWEsRUFBRyx5QkFBVztBQUN2QixXQUFPbEMsV0FBVyxDQUFDbUMsVUFBWixDQUF1QkMsWUFBdkIsQ0FBb0NwQyxXQUFXLENBQUNxQyxhQUFoRCxDQUFQO0FBQ0g7QUExRHFDLENBQVQsQ0FBakM7QUErREFyQyxXQUFXLENBQUNxQyxhQUFaLEdBQTRCbkMsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDakMsYUFBU0gsV0FBVyxDQUFDc0MsV0FEWTtBQUVqQ2pDLEVBQUFBLElBQUksRUFBRSwyQkFGMkI7QUFJakNDLEVBQUFBLFVBQVUsRUFBRTtBQUNSVSxJQUFBQSxXQUFXLEVBQUU7QUFDVCxpQkFBUyxJQURBO0FBRVRSLE1BQUFBLFlBQVksRUFBRTtBQUZMO0FBREwsR0FKcUI7QUFXakNxQixFQUFBQSxPQUFPLEVBQUU7QUFDTEMsSUFBQUEsUUFBUSxFQUFFLG9CQUFZO0FBQ2xCLGFBQU8sbUNBQVA7QUFDSDtBQUhJLEdBWHdCO0FBaUJqQ0MsRUFBQUEsUUFBUSxFQUFFLG9CQUFZO0FBQ2xCL0IsSUFBQUEsV0FBVyxDQUFDc0MsV0FBWixDQUF3Qk4sU0FBeEIsQ0FBa0NELFFBQWxDLENBQTJDRSxJQUEzQyxDQUFnRCxJQUFoRDs7QUFDQSxTQUFLakIsV0FBTCxHQUFtQixJQUFuQjtBQUNIO0FBcEJnQyxDQUFULENBQTVCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5kcmFnb25Cb25lcy5DQ1RleHR1cmVBdGxhc0RhdGEgPSBjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogZHJhZ29uQm9uZXMuVGV4dHVyZUF0bGFzRGF0YSxcbiAgICBuYW1lOiBcImRyYWdvbkJvbmVzLkNDVGV4dHVyZUF0bGFzRGF0YVwiLFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBfcmVuZGVyVGV4dHVyZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHNlcmlhbGl6YWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICByZW5kZXJUZXh0dXJlOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZW5kZXJUZXh0dXJlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW5kZXJUZXh0dXJlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgaW4gdGhpcy50ZXh0dXJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRleHR1cmVEYXRhID0gdGhpcy50ZXh0dXJlc1trXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGV4dHVyZURhdGEuc3ByaXRlRnJhbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVjdCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRleHR1cmVEYXRhLnJvdGF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjdCA9IGNjLnJlY3QodGV4dHVyZURhdGEucmVnaW9uLngsIHRleHR1cmVEYXRhLnJlZ2lvbi55LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHVyZURhdGEucmVnaW9uLmhlaWdodCwgdGV4dHVyZURhdGEucmVnaW9uLndpZHRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWN0ID0gY2MucmVjdCh0ZXh0dXJlRGF0YS5yZWdpb24ueCwgdGV4dHVyZURhdGEucmVnaW9uLnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlRGF0YS5yZWdpb24ud2lkdGgsIHRleHR1cmVEYXRhLnJlZ2lvbi5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0ID0gY2MudjIoMCwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNpemUgPSBjYy5zaXplKHJlY3Qud2lkdGgsIHJlY3QuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlRGF0YS5zcHJpdGVGcmFtZSA9IG5ldyBjYy5TcHJpdGVGcmFtZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHR1cmVEYXRhLnNwcml0ZUZyYW1lLnNldFRleHR1cmUodmFsdWUsIHJlY3QsIGZhbHNlLCBvZmZzZXQsIHNpemUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayBpbiB0aGlzLnRleHR1cmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGV4dHVyZURhdGEgPSB0aGlzLnRleHR1cmVzW2tdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHVyZURhdGEuc3ByaXRlRnJhbWUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJbY2xhc3MgZHJhZ29uQm9uZXMuQ0NUZXh0dXJlQXRsYXNEYXRhXVwiO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9vbkNsZWFyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRyYWdvbkJvbmVzLlRleHR1cmVBdGxhc0RhdGEucHJvdG90eXBlLl9vbkNsZWFyLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMucmVuZGVyVGV4dHVyZSA9IG51bGw7XG4gICAgfSxcblxuICAgIGNyZWF0ZVRleHR1cmUgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGRyYWdvbkJvbmVzLkJhc2VPYmplY3QuYm9ycm93T2JqZWN0KGRyYWdvbkJvbmVzLkNDVGV4dHVyZURhdGEpO1xuICAgIH1cblxuXG59KTtcblxuZHJhZ29uQm9uZXMuQ0NUZXh0dXJlRGF0YSA9IGNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBkcmFnb25Cb25lcy5UZXh0dXJlRGF0YSxcbiAgICBuYW1lOiBcImRyYWdvbkJvbmVzLkNDVGV4dHVyZURhdGFcIixcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgc3ByaXRlRnJhbWU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICBzZXJpYWxpemFibGU6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBcIltjbGFzcyBkcmFnb25Cb25lcy5DQ1RleHR1cmVEYXRhXVwiO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9vbkNsZWFyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRyYWdvbkJvbmVzLlRleHR1cmVEYXRhLnByb3RvdHlwZS5fb25DbGVhci5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLnNwcml0ZUZyYW1lID0gbnVsbDtcbiAgICB9XG59KTtcbiJdLCJzb3VyY2VSb290IjoiLyJ9