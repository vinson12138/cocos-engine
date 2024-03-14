
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/utils/find.js';
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

/**
 * Finds a node by hierarchy path, the path is case-sensitive.
 * It will traverse the hierarchy by splitting the path using '/' character.
 * This function will still returns the node even if it is inactive.
 * It is recommended to not use this function every frame instead cache the result at startup.
 *
 * @method find
 * @static
 * @param {String} path
 * @param {Node} [referenceNode]
 * @return {Node|null} the node or null if not found
 */
cc.find = module.exports = function (path, referenceNode) {
  if (path == null) {
    cc.errorID(3814);
    return null;
  }

  if (!referenceNode) {
    var scene = cc.director.getScene();

    if (!scene) {
      if (CC_DEV) {
        cc.warnID(5601);
      }

      return null;
    } else if (CC_DEV && !scene.isValid) {
      cc.warnID(5602);
      return null;
    }

    referenceNode = scene;
  } else if (CC_DEV && !referenceNode.isValid) {
    cc.warnID(5603);
    return null;
  }

  var match = referenceNode;
  var startIndex = path[0] !== '/' ? 0 : 1; // skip first '/'

  var nameList = path.split('/'); // parse path

  for (var n = startIndex; n < nameList.length; n++) {
    var name = nameList[n];
    var children = match._children;
    match = null;

    for (var t = 0, len = children.length; t < len; ++t) {
      var subChild = children[t];

      if (subChild.name === name) {
        match = subChild;
        break;
      }
    }

    if (!match) {
      return null;
    }
  }

  return match;
};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3V0aWxzL2ZpbmQuanMiXSwibmFtZXMiOlsiY2MiLCJmaW5kIiwibW9kdWxlIiwiZXhwb3J0cyIsInBhdGgiLCJyZWZlcmVuY2VOb2RlIiwiZXJyb3JJRCIsInNjZW5lIiwiZGlyZWN0b3IiLCJnZXRTY2VuZSIsIkNDX0RFViIsIndhcm5JRCIsImlzVmFsaWQiLCJtYXRjaCIsInN0YXJ0SW5kZXgiLCJuYW1lTGlzdCIsInNwbGl0IiwibiIsImxlbmd0aCIsIm5hbWUiLCJjaGlsZHJlbiIsIl9jaGlsZHJlbiIsInQiLCJsZW4iLCJzdWJDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBQSxFQUFFLENBQUNDLElBQUgsR0FBVUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCLFVBQVVDLElBQVYsRUFBZ0JDLGFBQWhCLEVBQStCO0FBQ3RELE1BQUlELElBQUksSUFBSSxJQUFaLEVBQWtCO0FBQ2RKLElBQUFBLEVBQUUsQ0FBQ00sT0FBSCxDQUFXLElBQVg7QUFDQSxXQUFPLElBQVA7QUFDSDs7QUFDRCxNQUFJLENBQUNELGFBQUwsRUFBb0I7QUFDaEIsUUFBSUUsS0FBSyxHQUFHUCxFQUFFLENBQUNRLFFBQUgsQ0FBWUMsUUFBWixFQUFaOztBQUNBLFFBQUksQ0FBQ0YsS0FBTCxFQUFZO0FBQ1IsVUFBSUcsTUFBSixFQUFZO0FBQ1JWLFFBQUFBLEVBQUUsQ0FBQ1csTUFBSCxDQUFVLElBQVY7QUFDSDs7QUFDRCxhQUFPLElBQVA7QUFDSCxLQUxELE1BTUssSUFBSUQsTUFBTSxJQUFJLENBQUNILEtBQUssQ0FBQ0ssT0FBckIsRUFBOEI7QUFDL0JaLE1BQUFBLEVBQUUsQ0FBQ1csTUFBSCxDQUFVLElBQVY7QUFDQSxhQUFPLElBQVA7QUFDSDs7QUFDRE4sSUFBQUEsYUFBYSxHQUFHRSxLQUFoQjtBQUNILEdBYkQsTUFjSyxJQUFJRyxNQUFNLElBQUksQ0FBQ0wsYUFBYSxDQUFDTyxPQUE3QixFQUFzQztBQUN2Q1osSUFBQUEsRUFBRSxDQUFDVyxNQUFILENBQVUsSUFBVjtBQUNBLFdBQU8sSUFBUDtBQUNIOztBQUVELE1BQUlFLEtBQUssR0FBR1IsYUFBWjtBQUNBLE1BQUlTLFVBQVUsR0FBSVYsSUFBSSxDQUFDLENBQUQsQ0FBSixLQUFZLEdBQWIsR0FBb0IsQ0FBcEIsR0FBd0IsQ0FBekMsQ0F6QnNELENBeUJWOztBQUM1QyxNQUFJVyxRQUFRLEdBQUdYLElBQUksQ0FBQ1ksS0FBTCxDQUFXLEdBQVgsQ0FBZixDQTFCc0QsQ0E0QnREOztBQUNBLE9BQUssSUFBSUMsQ0FBQyxHQUFHSCxVQUFiLEVBQXlCRyxDQUFDLEdBQUdGLFFBQVEsQ0FBQ0csTUFBdEMsRUFBOENELENBQUMsRUFBL0MsRUFBbUQ7QUFDL0MsUUFBSUUsSUFBSSxHQUFHSixRQUFRLENBQUNFLENBQUQsQ0FBbkI7QUFDQSxRQUFJRyxRQUFRLEdBQUdQLEtBQUssQ0FBQ1EsU0FBckI7QUFDQVIsSUFBQUEsS0FBSyxHQUFHLElBQVI7O0FBQ0EsU0FBSyxJQUFJUyxDQUFDLEdBQUcsQ0FBUixFQUFXQyxHQUFHLEdBQUdILFFBQVEsQ0FBQ0YsTUFBL0IsRUFBdUNJLENBQUMsR0FBR0MsR0FBM0MsRUFBZ0QsRUFBRUQsQ0FBbEQsRUFBcUQ7QUFDakQsVUFBSUUsUUFBUSxHQUFHSixRQUFRLENBQUNFLENBQUQsQ0FBdkI7O0FBQ0EsVUFBSUUsUUFBUSxDQUFDTCxJQUFULEtBQWtCQSxJQUF0QixFQUE0QjtBQUN4Qk4sUUFBQUEsS0FBSyxHQUFHVyxRQUFSO0FBQ0E7QUFDSDtBQUNKOztBQUNELFFBQUksQ0FBQ1gsS0FBTCxFQUFZO0FBQ1IsYUFBTyxJQUFQO0FBQ0g7QUFDSjs7QUFFRCxTQUFPQSxLQUFQO0FBQ0gsQ0E5Q0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogRmluZHMgYSBub2RlIGJ5IGhpZXJhcmNoeSBwYXRoLCB0aGUgcGF0aCBpcyBjYXNlLXNlbnNpdGl2ZS5cbiAqIEl0IHdpbGwgdHJhdmVyc2UgdGhlIGhpZXJhcmNoeSBieSBzcGxpdHRpbmcgdGhlIHBhdGggdXNpbmcgJy8nIGNoYXJhY3Rlci5cbiAqIFRoaXMgZnVuY3Rpb24gd2lsbCBzdGlsbCByZXR1cm5zIHRoZSBub2RlIGV2ZW4gaWYgaXQgaXMgaW5hY3RpdmUuXG4gKiBJdCBpcyByZWNvbW1lbmRlZCB0byBub3QgdXNlIHRoaXMgZnVuY3Rpb24gZXZlcnkgZnJhbWUgaW5zdGVhZCBjYWNoZSB0aGUgcmVzdWx0IGF0IHN0YXJ0dXAuXG4gKlxuICogQG1ldGhvZCBmaW5kXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICogQHBhcmFtIHtOb2RlfSBbcmVmZXJlbmNlTm9kZV1cbiAqIEByZXR1cm4ge05vZGV8bnVsbH0gdGhlIG5vZGUgb3IgbnVsbCBpZiBub3QgZm91bmRcbiAqL1xuY2MuZmluZCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHBhdGgsIHJlZmVyZW5jZU5vZGUpIHtcbiAgICBpZiAocGF0aCA9PSBudWxsKSB7XG4gICAgICAgIGNjLmVycm9ySUQoMzgxNCk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoIXJlZmVyZW5jZU5vZGUpIHtcbiAgICAgICAgdmFyIHNjZW5lID0gY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKTtcbiAgICAgICAgaWYgKCFzY2VuZSkge1xuICAgICAgICAgICAgaWYgKENDX0RFVikge1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCg1NjAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKENDX0RFViAmJiAhc2NlbmUuaXNWYWxpZCkge1xuICAgICAgICAgICAgY2Mud2FybklEKDU2MDIpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmVmZXJlbmNlTm9kZSA9IHNjZW5lO1xuICAgIH1cbiAgICBlbHNlIGlmIChDQ19ERVYgJiYgIXJlZmVyZW5jZU5vZGUuaXNWYWxpZCkge1xuICAgICAgICBjYy53YXJuSUQoNTYwMyk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciBtYXRjaCA9IHJlZmVyZW5jZU5vZGU7XG4gICAgdmFyIHN0YXJ0SW5kZXggPSAocGF0aFswXSAhPT0gJy8nKSA/IDAgOiAxOyAvLyBza2lwIGZpcnN0ICcvJ1xuICAgIHZhciBuYW1lTGlzdCA9IHBhdGguc3BsaXQoJy8nKTtcblxuICAgIC8vIHBhcnNlIHBhdGhcbiAgICBmb3IgKHZhciBuID0gc3RhcnRJbmRleDsgbiA8IG5hbWVMaXN0Lmxlbmd0aDsgbisrKSB7XG4gICAgICAgIHZhciBuYW1lID0gbmFtZUxpc3Rbbl07XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG1hdGNoLl9jaGlsZHJlbjtcbiAgICAgICAgbWF0Y2ggPSBudWxsO1xuICAgICAgICBmb3IgKHZhciB0ID0gMCwgbGVuID0gY2hpbGRyZW4ubGVuZ3RoOyB0IDwgbGVuOyArK3QpIHtcbiAgICAgICAgICAgIHZhciBzdWJDaGlsZCA9IGNoaWxkcmVuW3RdO1xuICAgICAgICAgICAgaWYgKHN1YkNoaWxkLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICAgICAgICBtYXRjaCA9IHN1YkNoaWxkO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hdGNoO1xufTtcbiJdLCJzb3VyY2VSb290IjoiLyJ9