
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/asset-manager/download-dom-image.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
var _require = require('./utilities'),
    parseParameters = _require.parseParameters;

function downloadDomImage(url, options, onComplete) {
  var _parseParameters = parseParameters(options, undefined, onComplete),
      options = _parseParameters.options,
      onComplete = _parseParameters.onComplete;

  var img = new Image();

  if (window.location.protocol !== 'file:') {
    img.crossOrigin = 'anonymous';
  }

  function loadCallback() {
    img.removeEventListener('load', loadCallback);
    img.removeEventListener('error', errorCallback);
    onComplete && onComplete(null, img);
  }

  function errorCallback() {
    img.removeEventListener('load', loadCallback);
    img.removeEventListener('error', errorCallback);
    onComplete && onComplete(new Error(cc.debug.getError(4930, url)));
  }

  img.addEventListener('load', loadCallback);
  img.addEventListener('error', errorCallback);
  img.src = url;
  return img;
}

module.exports = downloadDomImage;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0LW1hbmFnZXIvZG93bmxvYWQtZG9tLWltYWdlLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJwYXJzZVBhcmFtZXRlcnMiLCJkb3dubG9hZERvbUltYWdlIiwidXJsIiwib3B0aW9ucyIsIm9uQ29tcGxldGUiLCJ1bmRlZmluZWQiLCJpbWciLCJJbWFnZSIsIndpbmRvdyIsImxvY2F0aW9uIiwicHJvdG9jb2wiLCJjcm9zc09yaWdpbiIsImxvYWRDYWxsYmFjayIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJlcnJvckNhbGxiYWNrIiwiRXJyb3IiLCJjYyIsImRlYnVnIiwiZ2V0RXJyb3IiLCJhZGRFdmVudExpc3RlbmVyIiwic3JjIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtlQUU0QkEsT0FBTyxDQUFDLGFBQUQ7SUFBM0JDLDJCQUFBQTs7QUFFUixTQUFTQyxnQkFBVCxDQUEyQkMsR0FBM0IsRUFBZ0NDLE9BQWhDLEVBQXlDQyxVQUF6QyxFQUFxRDtBQUFBLHlCQUNuQkosZUFBZSxDQUFDRyxPQUFELEVBQVVFLFNBQVYsRUFBcUJELFVBQXJCLENBREk7QUFBQSxNQUMzQ0QsT0FEMkMsb0JBQzNDQSxPQUQyQztBQUFBLE1BQ2xDQyxVQURrQyxvQkFDbENBLFVBRGtDOztBQUdqRCxNQUFJRSxHQUFHLEdBQUcsSUFBSUMsS0FBSixFQUFWOztBQUVBLE1BQUlDLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsUUFBaEIsS0FBNkIsT0FBakMsRUFBMEM7QUFDdENKLElBQUFBLEdBQUcsQ0FBQ0ssV0FBSixHQUFrQixXQUFsQjtBQUNIOztBQUVELFdBQVNDLFlBQVQsR0FBeUI7QUFDckJOLElBQUFBLEdBQUcsQ0FBQ08sbUJBQUosQ0FBd0IsTUFBeEIsRUFBZ0NELFlBQWhDO0FBQ0FOLElBQUFBLEdBQUcsQ0FBQ08sbUJBQUosQ0FBd0IsT0FBeEIsRUFBaUNDLGFBQWpDO0FBQ0FWLElBQUFBLFVBQVUsSUFBSUEsVUFBVSxDQUFDLElBQUQsRUFBT0UsR0FBUCxDQUF4QjtBQUNIOztBQUVELFdBQVNRLGFBQVQsR0FBMEI7QUFDdEJSLElBQUFBLEdBQUcsQ0FBQ08sbUJBQUosQ0FBd0IsTUFBeEIsRUFBZ0NELFlBQWhDO0FBQ0FOLElBQUFBLEdBQUcsQ0FBQ08sbUJBQUosQ0FBd0IsT0FBeEIsRUFBaUNDLGFBQWpDO0FBQ0FWLElBQUFBLFVBQVUsSUFBSUEsVUFBVSxDQUFDLElBQUlXLEtBQUosQ0FBVUMsRUFBRSxDQUFDQyxLQUFILENBQVNDLFFBQVQsQ0FBa0IsSUFBbEIsRUFBd0JoQixHQUF4QixDQUFWLENBQUQsQ0FBeEI7QUFDSDs7QUFFREksRUFBQUEsR0FBRyxDQUFDYSxnQkFBSixDQUFxQixNQUFyQixFQUE2QlAsWUFBN0I7QUFDQU4sRUFBQUEsR0FBRyxDQUFDYSxnQkFBSixDQUFxQixPQUFyQixFQUE4QkwsYUFBOUI7QUFDQVIsRUFBQUEsR0FBRyxDQUFDYyxHQUFKLEdBQVVsQixHQUFWO0FBQ0EsU0FBT0ksR0FBUDtBQUNIOztBQUVEZSxNQUFNLENBQUNDLE9BQVAsR0FBaUJyQixnQkFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3QgeyBwYXJzZVBhcmFtZXRlcnMgfSA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzJyk7XG5cbmZ1bmN0aW9uIGRvd25sb2FkRG9tSW1hZ2UgKHVybCwgb3B0aW9ucywgb25Db21wbGV0ZSkge1xuICAgIHZhciB7IG9wdGlvbnMsIG9uQ29tcGxldGUgfSA9IHBhcnNlUGFyYW1ldGVycyhvcHRpb25zLCB1bmRlZmluZWQsIG9uQ29tcGxldGUpO1xuXG4gICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuXG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCAhPT0gJ2ZpbGU6Jykge1xuICAgICAgICBpbWcuY3Jvc3NPcmlnaW4gPSAnYW5vbnltb3VzJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2FkQ2FsbGJhY2sgKCkge1xuICAgICAgICBpbWcucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcsIGxvYWRDYWxsYmFjayk7XG4gICAgICAgIGltZy5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9yQ2FsbGJhY2spO1xuICAgICAgICBvbkNvbXBsZXRlICYmIG9uQ29tcGxldGUobnVsbCwgaW1nKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gZXJyb3JDYWxsYmFjayAoKSB7XG4gICAgICAgIGltZy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgbG9hZENhbGxiYWNrKTtcbiAgICAgICAgaW1nLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3JDYWxsYmFjayk7XG4gICAgICAgIG9uQ29tcGxldGUgJiYgb25Db21wbGV0ZShuZXcgRXJyb3IoY2MuZGVidWcuZ2V0RXJyb3IoNDkzMCwgdXJsKSkpO1xuICAgIH1cblxuICAgIGltZy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgbG9hZENhbGxiYWNrKTtcbiAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlcnJvckNhbGxiYWNrKTtcbiAgICBpbWcuc3JjID0gdXJsO1xuICAgIHJldHVybiBpbWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZG93bmxvYWREb21JbWFnZTsiXSwic291cmNlUm9vdCI6Ii8ifQ==