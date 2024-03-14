
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/utils/texture-util.js';
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
var Texture2D = require('../assets/CCTexture2D');

var textureUtil = {
  loadImage: function loadImage(url, cb, target) {
    cc.assertID(url, 3103);
    var tex = cc.assetManager.assets.get(url);

    if (tex) {
      if (tex.loaded) {
        cb && cb.call(target, null, tex);
        return tex;
      } else {
        tex.once("load", function () {
          cb && cb.call(target, null, tex);
        }, target);
        return tex;
      }
    } else {
      cc.assetManager.loadRemote(url, function (err, texture) {
        cb && cb.call(target, err, texture);
      });
    }
  },
  cacheImage: function cacheImage(url, image) {
    if (url && image) {
      var tex = new Texture2D();
      tex.initWithElement(image);
      cc.assetManager.assets.add(url, tex);
      return tex;
    }
  },
  postLoadTexture: function postLoadTexture(texture, callback) {
    if (texture.loaded) {
      callback && callback();
      return;
    }

    if (!texture.nativeUrl) {
      callback && callback();
      return;
    } // load image


    cc.assetManager.postLoadNative(texture, callback);
  }
};
module.exports = textureUtil;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3V0aWxzL3RleHR1cmUtdXRpbC5qcyJdLCJuYW1lcyI6WyJUZXh0dXJlMkQiLCJyZXF1aXJlIiwidGV4dHVyZVV0aWwiLCJsb2FkSW1hZ2UiLCJ1cmwiLCJjYiIsInRhcmdldCIsImNjIiwiYXNzZXJ0SUQiLCJ0ZXgiLCJhc3NldE1hbmFnZXIiLCJhc3NldHMiLCJnZXQiLCJsb2FkZWQiLCJjYWxsIiwib25jZSIsImxvYWRSZW1vdGUiLCJlcnIiLCJ0ZXh0dXJlIiwiY2FjaGVJbWFnZSIsImltYWdlIiwiaW5pdFdpdGhFbGVtZW50IiwiYWRkIiwicG9zdExvYWRUZXh0dXJlIiwiY2FsbGJhY2siLCJuYXRpdmVVcmwiLCJwb3N0TG9hZE5hdGl2ZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLFNBQVMsR0FBR0MsT0FBTyxDQUFDLHVCQUFELENBQXpCOztBQUVBLElBQUlDLFdBQVcsR0FBRztBQUNkQyxFQUFBQSxTQURjLHFCQUNIQyxHQURHLEVBQ0VDLEVBREYsRUFDTUMsTUFETixFQUNjO0FBQ3hCQyxJQUFBQSxFQUFFLENBQUNDLFFBQUgsQ0FBWUosR0FBWixFQUFpQixJQUFqQjtBQUVBLFFBQUlLLEdBQUcsR0FBR0YsRUFBRSxDQUFDRyxZQUFILENBQWdCQyxNQUFoQixDQUF1QkMsR0FBdkIsQ0FBMkJSLEdBQTNCLENBQVY7O0FBQ0EsUUFBSUssR0FBSixFQUFTO0FBQ0wsVUFBSUEsR0FBRyxDQUFDSSxNQUFSLEVBQWdCO0FBQ1pSLFFBQUFBLEVBQUUsSUFBSUEsRUFBRSxDQUFDUyxJQUFILENBQVFSLE1BQVIsRUFBZ0IsSUFBaEIsRUFBc0JHLEdBQXRCLENBQU47QUFDQSxlQUFPQSxHQUFQO0FBQ0gsT0FIRCxNQUtBO0FBQ0lBLFFBQUFBLEdBQUcsQ0FBQ00sSUFBSixDQUFTLE1BQVQsRUFBaUIsWUFBVTtBQUN4QlYsVUFBQUEsRUFBRSxJQUFJQSxFQUFFLENBQUNTLElBQUgsQ0FBUVIsTUFBUixFQUFnQixJQUFoQixFQUFzQkcsR0FBdEIsQ0FBTjtBQUNGLFNBRkQsRUFFR0gsTUFGSDtBQUdBLGVBQU9HLEdBQVA7QUFDSDtBQUNKLEtBWkQsTUFhSztBQUNERixNQUFBQSxFQUFFLENBQUNHLFlBQUgsQ0FBZ0JNLFVBQWhCLENBQTJCWixHQUEzQixFQUFnQyxVQUFVYSxHQUFWLEVBQWVDLE9BQWYsRUFBd0I7QUFDcERiLFFBQUFBLEVBQUUsSUFBSUEsRUFBRSxDQUFDUyxJQUFILENBQVFSLE1BQVIsRUFBZ0JXLEdBQWhCLEVBQXFCQyxPQUFyQixDQUFOO0FBQ0gsT0FGRDtBQUdIO0FBQ0osR0F2QmE7QUF5QmRDLEVBQUFBLFVBekJjLHNCQXlCRmYsR0F6QkUsRUF5QkdnQixLQXpCSCxFQXlCVTtBQUNwQixRQUFJaEIsR0FBRyxJQUFJZ0IsS0FBWCxFQUFrQjtBQUNkLFVBQUlYLEdBQUcsR0FBRyxJQUFJVCxTQUFKLEVBQVY7QUFDQVMsTUFBQUEsR0FBRyxDQUFDWSxlQUFKLENBQW9CRCxLQUFwQjtBQUNBYixNQUFBQSxFQUFFLENBQUNHLFlBQUgsQ0FBZ0JDLE1BQWhCLENBQXVCVyxHQUF2QixDQUEyQmxCLEdBQTNCLEVBQWdDSyxHQUFoQztBQUNBLGFBQU9BLEdBQVA7QUFDSDtBQUNKLEdBaENhO0FBa0NkYyxFQUFBQSxlQWxDYywyQkFrQ0dMLE9BbENILEVBa0NZTSxRQWxDWixFQWtDc0I7QUFDaEMsUUFBSU4sT0FBTyxDQUFDTCxNQUFaLEVBQW9CO0FBQ2hCVyxNQUFBQSxRQUFRLElBQUlBLFFBQVEsRUFBcEI7QUFDQTtBQUNIOztBQUNELFFBQUksQ0FBQ04sT0FBTyxDQUFDTyxTQUFiLEVBQXdCO0FBQ3BCRCxNQUFBQSxRQUFRLElBQUlBLFFBQVEsRUFBcEI7QUFDQTtBQUNILEtBUitCLENBU2hDOzs7QUFDQWpCLElBQUFBLEVBQUUsQ0FBQ0csWUFBSCxDQUFnQmdCLGNBQWhCLENBQStCUixPQUEvQixFQUF3Q00sUUFBeEM7QUFDSDtBQTdDYSxDQUFsQjtBQWdEQUcsTUFBTSxDQUFDQyxPQUFQLEdBQWlCMUIsV0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3QgVGV4dHVyZTJEID0gcmVxdWlyZSgnLi4vYXNzZXRzL0NDVGV4dHVyZTJEJyk7XG5cbmxldCB0ZXh0dXJlVXRpbCA9IHtcbiAgICBsb2FkSW1hZ2UgKHVybCwgY2IsIHRhcmdldCkge1xuICAgICAgICBjYy5hc3NlcnRJRCh1cmwsIDMxMDMpO1xuXG4gICAgICAgIHZhciB0ZXggPSBjYy5hc3NldE1hbmFnZXIuYXNzZXRzLmdldCh1cmwpO1xuICAgICAgICBpZiAodGV4KSB7XG4gICAgICAgICAgICBpZiAodGV4LmxvYWRlZCkge1xuICAgICAgICAgICAgICAgIGNiICYmIGNiLmNhbGwodGFyZ2V0LCBudWxsLCB0ZXgpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGV4Lm9uY2UoXCJsb2FkXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgY2IgJiYgY2IuY2FsbCh0YXJnZXQsIG51bGwsIHRleCk7XG4gICAgICAgICAgICAgICAgfSwgdGFyZ2V0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2MuYXNzZXRNYW5hZ2VyLmxvYWRSZW1vdGUodXJsLCBmdW5jdGlvbiAoZXJyLCB0ZXh0dXJlKSB7XG4gICAgICAgICAgICAgICAgY2IgJiYgY2IuY2FsbCh0YXJnZXQsIGVyciwgdGV4dHVyZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjYWNoZUltYWdlICh1cmwsIGltYWdlKSB7XG4gICAgICAgIGlmICh1cmwgJiYgaW1hZ2UpIHtcbiAgICAgICAgICAgIHZhciB0ZXggPSBuZXcgVGV4dHVyZTJEKCk7XG4gICAgICAgICAgICB0ZXguaW5pdFdpdGhFbGVtZW50KGltYWdlKTtcbiAgICAgICAgICAgIGNjLmFzc2V0TWFuYWdlci5hc3NldHMuYWRkKHVybCwgdGV4KTtcbiAgICAgICAgICAgIHJldHVybiB0ZXg7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcG9zdExvYWRUZXh0dXJlICh0ZXh0dXJlLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAodGV4dHVyZS5sb2FkZWQpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0ZXh0dXJlLm5hdGl2ZVVybCkge1xuICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBsb2FkIGltYWdlXG4gICAgICAgIGNjLmFzc2V0TWFuYWdlci5wb3N0TG9hZE5hdGl2ZSh0ZXh0dXJlLCBjYWxsYmFjayk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0ZXh0dXJlVXRpbDsiXSwic291cmNlUm9vdCI6Ii8ifQ==