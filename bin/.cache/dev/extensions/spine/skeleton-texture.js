
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/spine/skeleton-texture.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
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
sp.SkeletonTexture = cc.Class({
  name: 'sp.SkeletonTexture',
  "extends": sp.spine.Texture,
  _texture: null,
  _material: null,
  setRealTexture: function setRealTexture(tex) {
    this._texture = tex;
  },
  getRealTexture: function getRealTexture() {
    return this._texture;
  },
  setFilters: function setFilters(minFilter, magFilter) {
    if (this._texture) {
      this._texture.setFilters(minFilter, magFilter);
    }
  },
  setWraps: function setWraps(uWrap, vWrap) {
    if (this._texture) {
      this._texture.setWrapMode(uWrap, vWrap);
    }
  },
  dispose: function dispose() {}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvZXh0ZW5zaW9ucy9zcGluZS9za2VsZXRvbi10ZXh0dXJlLmpzIl0sIm5hbWVzIjpbInNwIiwiU2tlbGV0b25UZXh0dXJlIiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJzcGluZSIsIlRleHR1cmUiLCJfdGV4dHVyZSIsIl9tYXRlcmlhbCIsInNldFJlYWxUZXh0dXJlIiwidGV4IiwiZ2V0UmVhbFRleHR1cmUiLCJzZXRGaWx0ZXJzIiwibWluRmlsdGVyIiwibWFnRmlsdGVyIiwic2V0V3JhcHMiLCJ1V3JhcCIsInZXcmFwIiwic2V0V3JhcE1vZGUiLCJkaXNwb3NlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLEVBQUUsQ0FBQ0MsZUFBSCxHQUFxQkMsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDMUJDLEVBQUFBLElBQUksRUFBRSxvQkFEb0I7QUFFMUIsYUFBU0osRUFBRSxDQUFDSyxLQUFILENBQVNDLE9BRlE7QUFHMUJDLEVBQUFBLFFBQVEsRUFBRSxJQUhnQjtBQUkxQkMsRUFBQUEsU0FBUyxFQUFFLElBSmU7QUFNMUJDLEVBQUFBLGNBQWMsRUFBRSx3QkFBU0MsR0FBVCxFQUFjO0FBQzFCLFNBQUtILFFBQUwsR0FBZ0JHLEdBQWhCO0FBQ0gsR0FSeUI7QUFVMUJDLEVBQUFBLGNBQWMsRUFBRSwwQkFBVztBQUN2QixXQUFPLEtBQUtKLFFBQVo7QUFDSCxHQVp5QjtBQWMxQkssRUFBQUEsVUFBVSxFQUFFLG9CQUFTQyxTQUFULEVBQW9CQyxTQUFwQixFQUErQjtBQUN2QyxRQUFJLEtBQUtQLFFBQVQsRUFBbUI7QUFDZixXQUFLQSxRQUFMLENBQWNLLFVBQWQsQ0FBeUJDLFNBQXpCLEVBQW9DQyxTQUFwQztBQUNIO0FBQ0osR0FsQnlCO0FBb0IxQkMsRUFBQUEsUUFBUSxFQUFFLGtCQUFTQyxLQUFULEVBQWdCQyxLQUFoQixFQUF1QjtBQUM3QixRQUFJLEtBQUtWLFFBQVQsRUFBbUI7QUFDZixXQUFLQSxRQUFMLENBQWNXLFdBQWQsQ0FBMEJGLEtBQTFCLEVBQWlDQyxLQUFqQztBQUNIO0FBQ0osR0F4QnlCO0FBMEIxQkUsRUFBQUEsT0FBTyxFQUFFLG1CQUFXLENBQUU7QUExQkksQ0FBVCxDQUFyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnNwLlNrZWxldG9uVGV4dHVyZSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnc3AuU2tlbGV0b25UZXh0dXJlJyxcbiAgICBleHRlbmRzOiBzcC5zcGluZS5UZXh0dXJlLFxuICAgIF90ZXh0dXJlOiBudWxsLFxuICAgIF9tYXRlcmlhbDogbnVsbCxcblxuICAgIHNldFJlYWxUZXh0dXJlOiBmdW5jdGlvbih0ZXgpIHtcbiAgICAgICAgdGhpcy5fdGV4dHVyZSA9IHRleDtcbiAgICB9LFxuXG4gICAgZ2V0UmVhbFRleHR1cmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dHVyZTtcbiAgICB9LFxuXG4gICAgc2V0RmlsdGVyczogZnVuY3Rpb24obWluRmlsdGVyLCBtYWdGaWx0ZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuX3RleHR1cmUpIHtcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmUuc2V0RmlsdGVycyhtaW5GaWx0ZXIsIG1hZ0ZpbHRlcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0V3JhcHM6IGZ1bmN0aW9uKHVXcmFwLCB2V3JhcCkge1xuICAgICAgICBpZiAodGhpcy5fdGV4dHVyZSkge1xuICAgICAgICAgICAgdGhpcy5fdGV4dHVyZS5zZXRXcmFwTW9kZSh1V3JhcCwgdldyYXApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRpc3Bvc2U6IGZ1bmN0aW9uKCkge31cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=