
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/utils/label/label-frame.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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

/**
 * !#en Class for Label Frame.
 * !#zh LabelFrame
 */
function LabelFrame() {
  // the location of the label on rendering texture
  this._rect = null; // uv data of frame

  this.uv = []; // texture of frame

  this._texture = null; // store original info before packed to dynamic atlas

  this._original = null;
}

LabelFrame.prototype = {
  constructor: LabelFrame,

  /**
  * !#en Returns the rect of the label frame in the texture.
  * !#zh 获取 LabelFrame 的纹理矩形区域
  * @method getRect
  * @return {Rect}
  */
  getRect: function getRect() {
    return cc.rect(this._rect);
  },

  /**
   * !#en Sets the rect of the label frame in the texture.
   * !#zh 设置 LabelFrame 的纹理矩形区域
   * @method setRect
   * @param {Rect} rect
   */
  setRect: function setRect(rect) {
    this._rect = rect;
    if (this._texture) this._calculateUV();
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
  _refreshTexture: function _refreshTexture(texture) {
    this._texture = texture;
    this._rect = cc.rect(0, 0, texture.width, texture.height);

    this._calculateUV();
  },
  _calculateUV: function _calculateUV() {
    var rect = this._rect,
        texture = this._texture,
        uv = this.uv,
        texw = texture.width,
        texh = texture.height;
    var l = texw === 0 ? 0 : rect.x / texw;
    var r = texw === 0 ? 0 : (rect.x + rect.width) / texw;
    var b = texh === 0 ? 0 : (rect.y + rect.height) / texh;
    var t = texh === 0 ? 0 : rect.y / texh;
    uv[0] = l;
    uv[1] = b;
    uv[2] = r;
    uv[3] = b;
    uv[4] = l;
    uv[5] = t;
    uv[6] = r;
    uv[7] = t;
  }
};
module.exports = LabelFrame;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL3V0aWxzL2xhYmVsL2xhYmVsLWZyYW1lLmpzIl0sIm5hbWVzIjpbIkxhYmVsRnJhbWUiLCJfcmVjdCIsInV2IiwiX3RleHR1cmUiLCJfb3JpZ2luYWwiLCJwcm90b3R5cGUiLCJjb25zdHJ1Y3RvciIsImdldFJlY3QiLCJjYyIsInJlY3QiLCJzZXRSZWN0IiwiX2NhbGN1bGF0ZVVWIiwiX3NldER5bmFtaWNBdGxhc0ZyYW1lIiwiZnJhbWUiLCJfeCIsIngiLCJfeSIsInkiLCJ0ZXh0dXJlIiwiX3Jlc2V0RHluYW1pY0F0bGFzRnJhbWUiLCJfcmVmcmVzaFRleHR1cmUiLCJ3aWR0aCIsImhlaWdodCIsInRleHciLCJ0ZXhoIiwibCIsInIiLCJiIiwidCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTQSxVQUFULEdBQXVCO0FBQ25CO0FBQ0EsT0FBS0MsS0FBTCxHQUFhLElBQWIsQ0FGbUIsQ0FHbkI7O0FBQ0EsT0FBS0MsRUFBTCxHQUFVLEVBQVYsQ0FKbUIsQ0FLbkI7O0FBQ0EsT0FBS0MsUUFBTCxHQUFnQixJQUFoQixDQU5tQixDQU9uQjs7QUFDQSxPQUFLQyxTQUFMLEdBQWlCLElBQWpCO0FBQ0g7O0FBRURKLFVBQVUsQ0FBQ0ssU0FBWCxHQUF1QjtBQUNuQkMsRUFBQUEsV0FBVyxFQUFFTixVQURNOztBQUdsQjtBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSU8sRUFBQUEsT0FBTyxFQUFFLG1CQUFZO0FBQ2pCLFdBQU9DLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRLEtBQUtSLEtBQWIsQ0FB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QVF5QixDQUFSO0FBQ0F6QixJQUFBQSxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVF1QixDQUFSO0FBQ0F2QixJQUFBQSxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQixDQUFSO0FBQ0ExQixJQUFBQSxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVF3QixDQUFSO0FBQ0F4QixJQUFBQSxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQixDQUFSO0FBQ0g7QUExRWtCLENBQXZCO0FBNkVBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUI5QixVQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqXG4gKiAhI2VuIENsYXNzIGZvciBMYWJlbCBGcmFtZS5cbiAqICEjemggTGFiZWxGcmFtZVxuICovXG5mdW5jdGlvbiBMYWJlbEZyYW1lICgpIHtcbiAgICAvLyB0aGUgbG9jYXRpb24gb2YgdGhlIGxhYmVsIG9uIHJlbmRlcmluZyB0ZXh0dXJlXG4gICAgdGhpcy5fcmVjdCA9IG51bGw7XG4gICAgLy8gdXYgZGF0YSBvZiBmcmFtZVxuICAgIHRoaXMudXYgPSBbXTtcbiAgICAvLyB0ZXh0dXJlIG9mIGZyYW1lXG4gICAgdGhpcy5fdGV4dHVyZSA9IG51bGw7XG4gICAgLy8gc3RvcmUgb3JpZ2luYWwgaW5mbyBiZWZvcmUgcGFja2VkIHRvIGR5bmFtaWMgYXRsYXNcbiAgICB0aGlzLl9vcmlnaW5hbCA9IG51bGw7XG59XG5cbkxhYmVsRnJhbWUucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBMYWJlbEZyYW1lLFxuXG4gICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgcmVjdCBvZiB0aGUgbGFiZWwgZnJhbWUgaW4gdGhlIHRleHR1cmUuXG4gICAgICogISN6aCDojrflj5YgTGFiZWxGcmFtZSDnmoTnurnnkIbnn6nlvaLljLrln59cbiAgICAgKiBAbWV0aG9kIGdldFJlY3RcbiAgICAgKiBAcmV0dXJuIHtSZWN0fVxuICAgICAqL1xuICAgIGdldFJlY3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNjLnJlY3QodGhpcy5fcmVjdCk7XG4gICAgfSxcbiAgICBcbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgdGhlIHJlY3Qgb2YgdGhlIGxhYmVsIGZyYW1lIGluIHRoZSB0ZXh0dXJlLlxuICAgICAqICEjemgg6K6+572uIExhYmVsRnJhbWUg55qE57q555CG55+p5b2i5Yy65Z+fXG4gICAgICogQG1ldGhvZCBzZXRSZWN0XG4gICAgICogQHBhcmFtIHtSZWN0fSByZWN0XG4gICAgICovXG4gICAgc2V0UmVjdDogZnVuY3Rpb24gKHJlY3QpIHtcbiAgICAgICAgdGhpcy5fcmVjdCA9IHJlY3Q7XG4gICAgICAgIGlmICh0aGlzLl90ZXh0dXJlKVxuICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlVVYoKTtcbiAgICB9LFxuXG4gICAgX3NldER5bmFtaWNBdGxhc0ZyYW1lIChmcmFtZSkge1xuICAgICAgICBpZiAoIWZyYW1lKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5fb3JpZ2luYWwgPSB7XG4gICAgICAgICAgICBfdGV4dHVyZSA6IHRoaXMuX3RleHR1cmUsXG4gICAgICAgICAgICBfeCA6IHRoaXMuX3JlY3QueCxcbiAgICAgICAgICAgIF95IDogdGhpcy5fcmVjdC55XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuX3RleHR1cmUgPSBmcmFtZS50ZXh0dXJlO1xuICAgICAgICB0aGlzLl9yZWN0LnggPSBmcmFtZS54O1xuICAgICAgICB0aGlzLl9yZWN0LnkgPSBmcmFtZS55O1xuICAgICAgICB0aGlzLl9jYWxjdWxhdGVVVigpO1xuICAgIH0sXG4gICAgX3Jlc2V0RHluYW1pY0F0bGFzRnJhbWUgKCkge1xuICAgICAgICBpZiAoIXRoaXMuX29yaWdpbmFsKSByZXR1cm47XG4gICAgICAgIHRoaXMuX3JlY3QueCA9IHRoaXMuX29yaWdpbmFsLl94O1xuICAgICAgICB0aGlzLl9yZWN0LnkgPSB0aGlzLl9vcmlnaW5hbC5feTtcbiAgICAgICAgdGhpcy5fdGV4dHVyZSA9IHRoaXMuX29yaWdpbmFsLl90ZXh0dXJlO1xuICAgICAgICB0aGlzLl9vcmlnaW5hbCA9IG51bGw7XG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZVVWKCk7XG4gICAgfSxcblxuICAgIF9yZWZyZXNoVGV4dHVyZTogZnVuY3Rpb24gKHRleHR1cmUpIHtcbiAgICAgICAgdGhpcy5fdGV4dHVyZSA9IHRleHR1cmU7XG4gICAgICAgIHRoaXMuX3JlY3QgPSBjYy5yZWN0KDAsIDAsIHRleHR1cmUud2lkdGgsIHRleHR1cmUuaGVpZ2h0KTtcbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlVVYoKTtcbiAgICB9LFxuXG4gICAgX2NhbGN1bGF0ZVVWKCkge1xuICAgICAgICBsZXQgcmVjdCA9IHRoaXMuX3JlY3QsXG4gICAgICAgICAgICB0ZXh0dXJlID0gdGhpcy5fdGV4dHVyZSxcbiAgICAgICAgICAgIHV2ID0gdGhpcy51dixcbiAgICAgICAgICAgIHRleHcgPSB0ZXh0dXJlLndpZHRoLFxuICAgICAgICAgICAgdGV4aCA9IHRleHR1cmUuaGVpZ2h0O1xuXG4gICAgICAgIGxldCBsID0gdGV4dyA9PT0gMCA/IDAgOiByZWN0LnggLyB0ZXh3O1xuICAgICAgICBsZXQgciA9IHRleHcgPT09IDAgPyAwIDogKHJlY3QueCArIHJlY3Qud2lkdGgpIC8gdGV4dztcbiAgICAgICAgbGV0IGIgPSB0ZXhoID09PSAwID8gMCA6IChyZWN0LnkgKyByZWN0LmhlaWdodCkgLyB0ZXhoO1xuICAgICAgICBsZXQgdCA9IHRleGggPT09IDAgPyAwIDogcmVjdC55IC8gdGV4aDtcblxuICAgICAgICB1dlswXSA9IGw7XG4gICAgICAgIHV2WzFdID0gYjtcbiAgICAgICAgdXZbMl0gPSByO1xuICAgICAgICB1dlszXSA9IGI7XG4gICAgICAgIHV2WzRdID0gbDtcbiAgICAgICAgdXZbNV0gPSB0O1xuICAgICAgICB1dls2XSA9IHI7XG4gICAgICAgIHV2WzddID0gdDtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGFiZWxGcmFtZTtcbiJdLCJzb3VyY2VSb290IjoiLyJ9