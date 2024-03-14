
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/id-generater.js';
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
// ID generater for runtime
var NonUuidMark = '.';
/*
 * @param {string} [category] - You can specify a unique category to avoid id collision with other instance of IdGenerater
 */

function IdGenerater(category) {
  // init with a random id to emphasize that the returns id should not be stored in persistence data
  this.id = 0 | Math.random() * 998;
  this.prefix = category ? category + NonUuidMark : '';
}
/*
 * @method getNewId
 * @return {string}
 */


IdGenerater.prototype.getNewId = function () {
  return this.prefix + ++this.id;
};
/*
 * The global id generater might have a conflict problem once every 365 days,
 * if the game runs at 60 FPS and each frame 4760273 counts of new id are requested.
 */


IdGenerater.global = new IdGenerater('global');
module.exports = IdGenerater;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BsYXRmb3JtL2lkLWdlbmVyYXRlci5qcyJdLCJuYW1lcyI6WyJOb25VdWlkTWFyayIsIklkR2VuZXJhdGVyIiwiY2F0ZWdvcnkiLCJpZCIsIk1hdGgiLCJyYW5kb20iLCJwcmVmaXgiLCJwcm90b3R5cGUiLCJnZXROZXdJZCIsImdsb2JhbCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUEsSUFBSUEsV0FBVyxHQUFHLEdBQWxCO0FBRUE7QUFDQTtBQUNBOztBQUNBLFNBQVNDLFdBQVQsQ0FBc0JDLFFBQXRCLEVBQWdDO0FBQzVCO0FBQ0EsT0FBS0MsRUFBTCxHQUFVLElBQUtDLElBQUksQ0FBQ0MsTUFBTCxLQUFnQixHQUEvQjtBQUVBLE9BQUtDLE1BQUwsR0FBY0osUUFBUSxHQUFJQSxRQUFRLEdBQUdGLFdBQWYsR0FBOEIsRUFBcEQ7QUFDSDtBQUVEO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQUMsV0FBVyxDQUFDTSxTQUFaLENBQXNCQyxRQUF0QixHQUFpQyxZQUFZO0FBQ3pDLFNBQU8sS0FBS0YsTUFBTCxHQUFlLEVBQUUsS0FBS0gsRUFBN0I7QUFDSCxDQUZEO0FBSUE7QUFDQTtBQUNBO0FBQ0E7OztBQUNBRixXQUFXLENBQUNRLE1BQVosR0FBcUIsSUFBSVIsV0FBSixDQUFnQixRQUFoQixDQUFyQjtBQUVBUyxNQUFNLENBQUNDLE9BQVAsR0FBaUJWLFdBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIElEIGdlbmVyYXRlciBmb3IgcnVudGltZVxuXG52YXIgTm9uVXVpZE1hcmsgPSAnLic7XG5cbi8qXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NhdGVnb3J5XSAtIFlvdSBjYW4gc3BlY2lmeSBhIHVuaXF1ZSBjYXRlZ29yeSB0byBhdm9pZCBpZCBjb2xsaXNpb24gd2l0aCBvdGhlciBpbnN0YW5jZSBvZiBJZEdlbmVyYXRlclxuICovXG5mdW5jdGlvbiBJZEdlbmVyYXRlciAoY2F0ZWdvcnkpIHtcbiAgICAvLyBpbml0IHdpdGggYSByYW5kb20gaWQgdG8gZW1waGFzaXplIHRoYXQgdGhlIHJldHVybnMgaWQgc2hvdWxkIG5vdCBiZSBzdG9yZWQgaW4gcGVyc2lzdGVuY2UgZGF0YVxuICAgIHRoaXMuaWQgPSAwIHwgKE1hdGgucmFuZG9tKCkgKiA5OTgpO1xuICAgIFxuICAgIHRoaXMucHJlZml4ID0gY2F0ZWdvcnkgPyAoY2F0ZWdvcnkgKyBOb25VdWlkTWFyaykgOiAnJztcbn1cblxuLypcbiAqIEBtZXRob2QgZ2V0TmV3SWRcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuSWRHZW5lcmF0ZXIucHJvdG90eXBlLmdldE5ld0lkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnByZWZpeCArICgrK3RoaXMuaWQpO1xufTtcblxuLypcbiAqIFRoZSBnbG9iYWwgaWQgZ2VuZXJhdGVyIG1pZ2h0IGhhdmUgYSBjb25mbGljdCBwcm9ibGVtIG9uY2UgZXZlcnkgMzY1IGRheXMsXG4gKiBpZiB0aGUgZ2FtZSBydW5zIGF0IDYwIEZQUyBhbmQgZWFjaCBmcmFtZSA0NzYwMjczIGNvdW50cyBvZiBuZXcgaWQgYXJlIHJlcXVlc3RlZC5cbiAqL1xuSWRHZW5lcmF0ZXIuZ2xvYmFsID0gbmV3IElkR2VuZXJhdGVyKCdnbG9iYWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBJZEdlbmVyYXRlcjtcbiJdLCJzb3VyY2VSb290IjoiLyJ9