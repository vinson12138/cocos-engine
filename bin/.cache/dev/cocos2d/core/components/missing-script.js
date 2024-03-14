
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/missing-script.js';
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
var js = cc.js;
/*
 * A temp fallback to contain the original serialized data which can not be loaded.
 * Deserialized as a component by default.
 */

var MissingScript = cc.Class({
  name: 'cc.MissingScript',
  "extends": cc.Component,
  editor: {
    inspector: 'packages://inspector/inspectors/comps/missing-script.js'
  },
  properties: {
    //_scriptUuid: {
    //    get: function () {
    //        var id = this._$erialized.__type__;
    //        if (Editor.Utils.UuidUtils.isUuid(id)) {
    //            return Editor.Utils.UuidUtils.decompressUuid(id);
    //        }
    //        return '';
    //    },
    //    set: function (value) {
    //        if ( !sandbox.compiled ) {
    //            cc.error('Scripts not yet compiled, please fix script errors and compile first.');
    //            return;
    //        }
    //        if (value && Editor.Utils.UuidUtils.isUuid(value._uuid)) {
    //            var classId = Editor.Utils.UuidUtils.compressUuid(value);
    //            if (cc.js._getClassById(classId)) {
    //                this._$erialized.__type__ = classId;
    //                Editor.Ipc.sendToWins('reload:window-scripts', sandbox.compiled);
    //            }
    //            else {
    //                cc.error('Can not find a component in the script which uuid is "%s".', value);
    //            }
    //        }
    //        else {
    //            cc.error('invalid script');
    //        }
    //    }
    //},
    compiled: {
      "default": false,
      serializable: false
    },
    // the serialized data for original script object
    _$erialized: {
      "default": null,
      visible: false,
      editorOnly: true
    }
  },
  ctor: CC_EDITOR && function () {
    this.compiled = _Scene.Sandbox.compiled;
  },
  statics: {
    /*
     * @param {string} id
     * @return {function} constructor
     */
    safeFindClass: function safeFindClass(id) {
      var cls = js._getClassById(id);

      if (cls) {
        return cls;
      }

      cc.deserialize.reportMissingClass(id);
      return MissingScript;
    }
  },
  onLoad: function onLoad() {
    cc.warnID(4600, this.node.name);
  }
});
cc._MissingScript = module.exports = MissingScript;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvbWlzc2luZy1zY3JpcHQuanMiXSwibmFtZXMiOlsianMiLCJjYyIsIk1pc3NpbmdTY3JpcHQiLCJDbGFzcyIsIm5hbWUiLCJDb21wb25lbnQiLCJlZGl0b3IiLCJpbnNwZWN0b3IiLCJwcm9wZXJ0aWVzIiwiY29tcGlsZWQiLCJzZXJpYWxpemFibGUiLCJfJGVyaWFsaXplZCIsInZpc2libGUiLCJlZGl0b3JPbmx5IiwiY3RvciIsIkNDX0VESVRPUiIsIl9TY2VuZSIsIlNhbmRib3giLCJzdGF0aWNzIiwic2FmZUZpbmRDbGFzcyIsImlkIiwiY2xzIiwiX2dldENsYXNzQnlJZCIsImRlc2VyaWFsaXplIiwicmVwb3J0TWlzc2luZ0NsYXNzIiwib25Mb2FkIiwid2FybklEIiwibm9kZSIsIl9NaXNzaW5nU2NyaXB0IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBSUEsRUFBRSxHQUFHQyxFQUFFLENBQUNELEVBQVo7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFJRSxhQUFhLEdBQUdELEVBQUUsQ0FBQ0UsS0FBSCxDQUFTO0FBQ3pCQyxFQUFBQSxJQUFJLEVBQUUsa0JBRG1CO0FBRXpCLGFBQVNILEVBQUUsQ0FBQ0ksU0FGYTtBQUd6QkMsRUFBQUEsTUFBTSxFQUFFO0FBQ0pDLElBQUFBLFNBQVMsRUFBRTtBQURQLEdBSGlCO0FBTXpCQyxFQUFBQSxVQUFVLEVBQUU7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBQyxJQUFBQSxRQUFRLEVBQUU7QUFDTixpQkFBUyxLQURIO0FBRU5DLE1BQUFBLFlBQVksRUFBRTtBQUZSLEtBN0JGO0FBaUNSO0FBQ0FDLElBQUFBLFdBQVcsRUFBRTtBQUNULGlCQUFTLElBREE7QUFFVEMsTUFBQUEsT0FBTyxFQUFFLEtBRkE7QUFHVEMsTUFBQUEsVUFBVSxFQUFFO0FBSEg7QUFsQ0wsR0FOYTtBQThDekJDLEVBQUFBLElBQUksRUFBRUMsU0FBUyxJQUFJLFlBQVk7QUFDM0IsU0FBS04sUUFBTCxHQUFnQk8sTUFBTSxDQUFDQyxPQUFQLENBQWVSLFFBQS9CO0FBQ0gsR0FoRHdCO0FBaUR6QlMsRUFBQUEsT0FBTyxFQUFFO0FBQ0w7QUFDUjtBQUNBO0FBQ0E7QUFDUUMsSUFBQUEsYUFBYSxFQUFFLHVCQUFVQyxFQUFWLEVBQWM7QUFDekIsVUFBSUMsR0FBRyxHQUFHckIsRUFBRSxDQUFDc0IsYUFBSCxDQUFpQkYsRUFBakIsQ0FBVjs7QUFDQSxVQUFJQyxHQUFKLEVBQVM7QUFDTCxlQUFPQSxHQUFQO0FBQ0g7O0FBQ0RwQixNQUFBQSxFQUFFLENBQUNzQixXQUFILENBQWVDLGtCQUFmLENBQWtDSixFQUFsQztBQUNBLGFBQU9sQixhQUFQO0FBQ0g7QUFaSSxHQWpEZ0I7QUErRHpCdUIsRUFBQUEsTUFBTSxFQUFFLGtCQUFZO0FBQ2hCeEIsSUFBQUEsRUFBRSxDQUFDeUIsTUFBSCxDQUFVLElBQVYsRUFBZ0IsS0FBS0MsSUFBTCxDQUFVdkIsSUFBMUI7QUFDSDtBQWpFd0IsQ0FBVCxDQUFwQjtBQW9FQUgsRUFBRSxDQUFDMkIsY0FBSCxHQUFvQkMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCNUIsYUFBckMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBqcyA9IGNjLmpzO1xuXG4vKlxuICogQSB0ZW1wIGZhbGxiYWNrIHRvIGNvbnRhaW4gdGhlIG9yaWdpbmFsIHNlcmlhbGl6ZWQgZGF0YSB3aGljaCBjYW4gbm90IGJlIGxvYWRlZC5cbiAqIERlc2VyaWFsaXplZCBhcyBhIGNvbXBvbmVudCBieSBkZWZhdWx0LlxuICovXG52YXIgTWlzc2luZ1NjcmlwdCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuTWlzc2luZ1NjcmlwdCcsIFxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgICBlZGl0b3I6IHtcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9taXNzaW5nLXNjcmlwdC5qcycsXG4gICAgfSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vX3NjcmlwdFV1aWQ6IHtcbiAgICAgICAgLy8gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vICAgICAgICB2YXIgaWQgPSB0aGlzLl8kZXJpYWxpemVkLl9fdHlwZV9fO1xuICAgICAgICAvLyAgICAgICAgaWYgKEVkaXRvci5VdGlscy5VdWlkVXRpbHMuaXNVdWlkKGlkKSkge1xuICAgICAgICAvLyAgICAgICAgICAgIHJldHVybiBFZGl0b3IuVXRpbHMuVXVpZFV0aWxzLmRlY29tcHJlc3NVdWlkKGlkKTtcbiAgICAgICAgLy8gICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgIHJldHVybiAnJztcbiAgICAgICAgLy8gICAgfSxcbiAgICAgICAgLy8gICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgLy8gICAgICAgIGlmICggIXNhbmRib3guY29tcGlsZWQgKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgY2MuZXJyb3IoJ1NjcmlwdHMgbm90IHlldCBjb21waWxlZCwgcGxlYXNlIGZpeCBzY3JpcHQgZXJyb3JzIGFuZCBjb21waWxlIGZpcnN0LicpO1xuICAgICAgICAvLyAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgIGlmICh2YWx1ZSAmJiBFZGl0b3IuVXRpbHMuVXVpZFV0aWxzLmlzVXVpZCh2YWx1ZS5fdXVpZCkpIHtcbiAgICAgICAgLy8gICAgICAgICAgICB2YXIgY2xhc3NJZCA9IEVkaXRvci5VdGlscy5VdWlkVXRpbHMuY29tcHJlc3NVdWlkKHZhbHVlKTtcbiAgICAgICAgLy8gICAgICAgICAgICBpZiAoY2MuanMuX2dldENsYXNzQnlJZChjbGFzc0lkKSkge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICB0aGlzLl8kZXJpYWxpemVkLl9fdHlwZV9fID0gY2xhc3NJZDtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgRWRpdG9yLklwYy5zZW5kVG9XaW5zKCdyZWxvYWQ6d2luZG93LXNjcmlwdHMnLCBzYW5kYm94LmNvbXBpbGVkKTtcbiAgICAgICAgLy8gICAgICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGNjLmVycm9yKCdDYW4gbm90IGZpbmQgYSBjb21wb25lbnQgaW4gdGhlIHNjcmlwdCB3aGljaCB1dWlkIGlzIFwiJXNcIi4nLCB2YWx1ZSk7XG4gICAgICAgIC8vICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgZWxzZSB7XG4gICAgICAgIC8vICAgICAgICAgICAgY2MuZXJyb3IoJ2ludmFsaWQgc2NyaXB0Jyk7XG4gICAgICAgIC8vICAgICAgICB9XG4gICAgICAgIC8vICAgIH1cbiAgICAgICAgLy99LFxuICAgICAgICBjb21waWxlZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgICBzZXJpYWxpemFibGU6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIC8vIHRoZSBzZXJpYWxpemVkIGRhdGEgZm9yIG9yaWdpbmFsIHNjcmlwdCBvYmplY3RcbiAgICAgICAgXyRlcmlhbGl6ZWQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGVkaXRvck9ubHk6IHRydWVcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY3RvcjogQ0NfRURJVE9SICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jb21waWxlZCA9IF9TY2VuZS5TYW5kYm94LmNvbXBpbGVkO1xuICAgIH0sXG4gICAgc3RhdGljczoge1xuICAgICAgICAvKlxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICAgICAgICogQHJldHVybiB7ZnVuY3Rpb259IGNvbnN0cnVjdG9yXG4gICAgICAgICAqL1xuICAgICAgICBzYWZlRmluZENsYXNzOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIHZhciBjbHMgPSBqcy5fZ2V0Q2xhc3NCeUlkKGlkKTtcbiAgICAgICAgICAgIGlmIChjbHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2MuZGVzZXJpYWxpemUucmVwb3J0TWlzc2luZ0NsYXNzKGlkKTtcbiAgICAgICAgICAgIHJldHVybiBNaXNzaW5nU2NyaXB0O1xuICAgICAgICB9LFxuICAgIH0sXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLndhcm5JRCg0NjAwLCB0aGlzLm5vZGUubmFtZSk7XG4gICAgfVxufSk7XG5cbmNjLl9NaXNzaW5nU2NyaXB0ID0gbW9kdWxlLmV4cG9ydHMgPSBNaXNzaW5nU2NyaXB0O1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=