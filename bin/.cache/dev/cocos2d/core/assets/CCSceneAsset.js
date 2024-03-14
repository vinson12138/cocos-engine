
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCSceneAsset.js';
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
 * !#en Class for scene handling.
 * !#zh 场景资源类。
 * @class SceneAsset
 * @extends Asset
 *
 */
var Scene = cc.Class({
  name: 'cc.SceneAsset',
  "extends": cc.Asset,
  properties: {
    /**
     * @property {Scene} scene
     * @default null
     */
    scene: null,

    /**
     * !#en Indicates the raw assets of this scene can be load after scene launched.
     * !#zh 指示该场景依赖的资源可否在场景切换后再延迟加载。
     * @property {Boolean} asyncLoadAssets
     * @default false
     */
    asyncLoadAssets: undefined //// backup prefab assets in editor
    //// {string} assetUuid: {cc.Node} rootInPrefab
    //_prefabDatas: {
    //    default: null,
    //    editorOnly: true
    //}

  }
});
cc.SceneAsset = Scene;
module.exports = Scene;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0cy9DQ1NjZW5lQXNzZXQuanMiXSwibmFtZXMiOlsiU2NlbmUiLCJjYyIsIkNsYXNzIiwibmFtZSIsIkFzc2V0IiwicHJvcGVydGllcyIsInNjZW5lIiwiYXN5bmNMb2FkQXNzZXRzIiwidW5kZWZpbmVkIiwiU2NlbmVBc3NldCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUlBLEtBQUssR0FBR0MsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDakJDLEVBQUFBLElBQUksRUFBRSxlQURXO0FBRWpCLGFBQVNGLEVBQUUsQ0FBQ0csS0FGSztBQUlqQkMsRUFBQUEsVUFBVSxFQUFFO0FBRVI7QUFDUjtBQUNBO0FBQ0E7QUFDUUMsSUFBQUEsS0FBSyxFQUFFLElBTkM7O0FBUVI7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1FDLElBQUFBLGVBQWUsRUFBRUMsU0FkVCxDQWdCUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBckJRO0FBSkssQ0FBVCxDQUFaO0FBNkJBUCxFQUFFLENBQUNRLFVBQUgsR0FBZ0JULEtBQWhCO0FBQ0FVLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQlgsS0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogISNlbiBDbGFzcyBmb3Igc2NlbmUgaGFuZGxpbmcuXG4gKiAhI3poIOWcuuaZr+i1hOa6kOexu+OAglxuICogQGNsYXNzIFNjZW5lQXNzZXRcbiAqIEBleHRlbmRzIEFzc2V0XG4gKlxuICovXG52YXIgU2NlbmUgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlNjZW5lQXNzZXQnLFxuICAgIGV4dGVuZHM6IGNjLkFzc2V0LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJvcGVydHkge1NjZW5lfSBzY2VuZVxuICAgICAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICAgICAqL1xuICAgICAgICBzY2VuZTogbnVsbCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBJbmRpY2F0ZXMgdGhlIHJhdyBhc3NldHMgb2YgdGhpcyBzY2VuZSBjYW4gYmUgbG9hZCBhZnRlciBzY2VuZSBsYXVuY2hlZC5cbiAgICAgICAgICogISN6aCDmjIfnpLror6XlnLrmma/kvp3otZbnmoTotYTmupDlj6/lkKblnKjlnLrmma/liIfmjaLlkI7lho3lu7bov5/liqDovb3jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBhc3luY0xvYWRBc3NldHNcbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIGFzeW5jTG9hZEFzc2V0czogdW5kZWZpbmVkLFxuXG4gICAgICAgIC8vLy8gYmFja3VwIHByZWZhYiBhc3NldHMgaW4gZWRpdG9yXG4gICAgICAgIC8vLy8ge3N0cmluZ30gYXNzZXRVdWlkOiB7Y2MuTm9kZX0gcm9vdEluUHJlZmFiXG4gICAgICAgIC8vX3ByZWZhYkRhdGFzOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIGVkaXRvck9ubHk6IHRydWVcbiAgICAgICAgLy99XG4gICAgfSxcbn0pO1xuXG5jYy5TY2VuZUFzc2V0ID0gU2NlbmU7XG5tb2R1bGUuZXhwb3J0cyA9IFNjZW5lO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=