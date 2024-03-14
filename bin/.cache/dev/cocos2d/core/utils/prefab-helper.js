
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/utils/prefab-helper.js';
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
cc._PrefabInfo = cc.Class({
  name: 'cc.PrefabInfo',
  // extends: require('../platform/CCObject'),
  properties: {
    // the most top node of this prefab
    root: null,
    // 所属的 prefab 资源对象 (cc.Prefab)
    // In Editor, only asset._uuid is usable because asset will be changed.
    asset: null,
    // To identify the node in the prefab asset, so only needs to be unique.
    // Not available in the root node.
    fileId: '',
    // Indicates whether this node should always synchronize with the prefab asset, only available in the root node
    sync: false
  }
}); // prefab helper function

module.exports = {
  // update node to make it sync with prefab
  syncWithPrefab: function syncWithPrefab(node) {
    var _prefab = node._prefab;

    if (!_prefab.asset) {
      if (CC_EDITOR) {
        var NodeUtils = Editor.require('scene://utils/node');

        var PrefabUtils = Editor.require('scene://utils/prefab');

        cc.warn(Editor.T('MESSAGE.prefab.missing_prefab', {
          node: NodeUtils.getNodePath(node)
        }));
        node.name += PrefabUtils.MISSING_PREFAB_SUFFIX;
      } else {
        cc.errorID(3701, node.name);
      }

      node._prefab = null;
      return;
    } // save root's preserved props to avoid overwritten by prefab


    var _objFlags = node._objFlags;
    var _parent = node._parent;
    var _id = node._id;
    var _name = node._name;
    var _active = node._active;
    var eulerAnglesX = node._eulerAngles.x;
    var eulerAnglesY = node._eulerAngles.y;
    var eulerAnglesZ = node._eulerAngles.z;
    var _localZOrder = node._localZOrder;
    var trs = node._trs;
    var x = trs[0];
    var y = trs[1];
    var z = trs[2]; // instantiate prefab

    cc.game._isCloning = true;

    if (CC_SUPPORT_JIT) {
      _prefab.asset._doInstantiate(node);
    } else {
      // root in prefab asset is always synced
      var prefabRoot = _prefab.asset.data; // use node as the instantiated prefabRoot to make references to prefabRoot in prefab redirect to node

      prefabRoot._iN$t = node; // instantiate prefab and apply to node

      cc.instantiate._clone(prefabRoot, prefabRoot);
    }

    cc.game._isCloning = false; // restore preserved props

    node._objFlags = _objFlags;
    node._parent = _parent;
    node._id = _id;
    node._prefab = _prefab;
    node._name = _name;
    node._active = _active;
    node._localZOrder = _localZOrder;
    trs = node._trs;
    trs[0] = x;
    trs[1] = y;
    trs[2] = z;
    node._eulerAngles.x = eulerAnglesX;
    node._eulerAngles.y = eulerAnglesY;
    node._eulerAngles.z = eulerAnglesZ;
  }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3V0aWxzL3ByZWZhYi1oZWxwZXIuanMiXSwibmFtZXMiOlsiY2MiLCJfUHJlZmFiSW5mbyIsIkNsYXNzIiwibmFtZSIsInByb3BlcnRpZXMiLCJyb290IiwiYXNzZXQiLCJmaWxlSWQiLCJzeW5jIiwibW9kdWxlIiwiZXhwb3J0cyIsInN5bmNXaXRoUHJlZmFiIiwibm9kZSIsIl9wcmVmYWIiLCJDQ19FRElUT1IiLCJOb2RlVXRpbHMiLCJFZGl0b3IiLCJyZXF1aXJlIiwiUHJlZmFiVXRpbHMiLCJ3YXJuIiwiVCIsImdldE5vZGVQYXRoIiwiTUlTU0lOR19QUkVGQUJfU1VGRklYIiwiZXJyb3JJRCIsIl9vYmpGbGFncyIsIl9wYXJlbnQiLCJfaWQiLCJfbmFtZSIsIl9hY3RpdmUiLCJldWxlckFuZ2xlc1giLCJfZXVsZXJBbmdsZXMiLCJ4IiwiZXVsZXJBbmdsZXNZIiwieSIsImV1bGVyQW5nbGVzWiIsInoiLCJfbG9jYWxaT3JkZXIiLCJ0cnMiLCJfdHJzIiwiZ2FtZSIsIl9pc0Nsb25pbmciLCJDQ19TVVBQT1JUX0pJVCIsIl9kb0luc3RhbnRpYXRlIiwicHJlZmFiUm9vdCIsImRhdGEiLCJfaU4kdCIsImluc3RhbnRpYXRlIiwiX2Nsb25lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsRUFBRSxDQUFDQyxXQUFILEdBQWlCRCxFQUFFLENBQUNFLEtBQUgsQ0FBUztBQUN0QkMsRUFBQUEsSUFBSSxFQUFFLGVBRGdCO0FBRXRCO0FBQ0FDLEVBQUFBLFVBQVUsRUFBRTtBQUNSO0FBQ0FDLElBQUFBLElBQUksRUFBRSxJQUZFO0FBSVI7QUFDQTtBQUNBQyxJQUFBQSxLQUFLLEVB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QUEsSUFBSSxDQUFDYyxHQUFMLEdBQVdBLEdBQVg7QUFDQWQsSUFBQUEsSUFBSSxDQUFDQyxPQUFMLEdBQWVBLE9BQWY7QUFDQUQsSUFBQUEsSUFBSSxDQUFDZSxLQUFMLEdBQWFBLEtBQWI7QUFDQWYsSUFBQUEsSUFBSSxDQUFDZ0IsT0FBTCxHQUFlQSxPQUFmO0FBQ0FoQixJQUFBQSxJQUFJLENBQUN3QixZQUFMLEdBQW9CQSxZQUFwQjtBQUNBQyxJQUFBQSxHQUFHLEdBQUd6QixJQUFJLENBQUMwQixJQUFYO0FBQ0FELElBQUFBLEdBQUcsQ0FBQyxDQUFELENBQUgsR0FBU04sQ0FBVDtBQUNBTSxJQUFBQSxHQUFHLENBQUMsQ0FBRCxDQUFILEdBQVNKLENBQVQ7QUFDQUksSUFBQUEsR0FBRyxDQUFDLENBQUQsQ0FBSCxHQUFTRixDQUFUO0FBQ0F2QixJQUFBQSxJQUFJLENBQUNrQixZQUFMLENBQWtCQyxDQUFsQixHQUFzQkYsWUFBdEI7QUFDQWpCLElBQUFBLElBQUksQ0FBQ2tCLFlBQUwsQ0FBa0JHLENBQWxCLEdBQXNCRCxZQUF0QjtBQUNBcEIsSUFBQUEsSUFBSSxDQUFDa0IsWUFBTCxDQUFrQkssQ0FBbEIsR0FBc0JELFlBQXRCO0FBQ0g7QUFuRVksQ0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNjLl9QcmVmYWJJbmZvID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5QcmVmYWJJbmZvJyxcbiAgICAvLyBleHRlbmRzOiByZXF1aXJlKCcuLi9wbGF0Zm9ybS9DQ09iamVjdCcpLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gdGhlIG1vc3QgdG9wIG5vZGUgb2YgdGhpcyBwcmVmYWJcbiAgICAgICAgcm9vdDogbnVsbCxcblxuICAgICAgICAvLyDmiYDlsZ7nmoQgcHJlZmFiIOi1hOa6kOWvueixoSAoY2MuUHJlZmFiKVxuICAgICAgICAvLyBJbiBFZGl0b3IsIG9ubHkgYXNzZXQuX3V1aWQgaXMgdXNhYmxlIGJlY2F1c2UgYXNzZXQgd2lsbCBiZSBjaGFuZ2VkLlxuICAgICAgICBhc3NldDogbnVsbCxcblxuICAgICAgICAvLyBUbyBpZGVudGlmeSB0aGUgbm9kZSBpbiB0aGUgcHJlZmFiIGFzc2V0LCBzbyBvbmx5IG5lZWRzIHRvIGJlIHVuaXF1ZS5cbiAgICAgICAgLy8gTm90IGF2YWlsYWJsZSBpbiB0aGUgcm9vdCBub2RlLlxuICAgICAgICBmaWxlSWQ6ICcnLFxuXG4gICAgICAgIC8vIEluZGljYXRlcyB3aGV0aGVyIHRoaXMgbm9kZSBzaG91bGQgYWx3YXlzIHN5bmNocm9uaXplIHdpdGggdGhlIHByZWZhYiBhc3NldCwgb25seSBhdmFpbGFibGUgaW4gdGhlIHJvb3Qgbm9kZVxuICAgICAgICBzeW5jOiBmYWxzZSxcbiAgICB9LFxufSk7XG5cbi8vIHByZWZhYiBoZWxwZXIgZnVuY3Rpb25cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIC8vIHVwZGF0ZSBub2RlIHRvIG1ha2UgaXQgc3luYyB3aXRoIHByZWZhYlxuICAgIHN5bmNXaXRoUHJlZmFiOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICB2YXIgX3ByZWZhYiA9IG5vZGUuX3ByZWZhYjtcblxuICAgICAgICBpZiAoIV9wcmVmYWIuYXNzZXQpIHtcbiAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICB2YXIgTm9kZVV0aWxzID0gRWRpdG9yLnJlcXVpcmUoJ3NjZW5lOi8vdXRpbHMvbm9kZScpO1xuICAgICAgICAgICAgICAgIHZhciBQcmVmYWJVdGlscyA9IEVkaXRvci5yZXF1aXJlKCdzY2VuZTovL3V0aWxzL3ByZWZhYicpO1xuXG4gICAgICAgICAgICAgICAgY2Mud2FybihFZGl0b3IuVCgnTUVTU0FHRS5wcmVmYWIubWlzc2luZ19wcmVmYWInLCB7IG5vZGU6IE5vZGVVdGlscy5nZXROb2RlUGF0aChub2RlKSB9KSk7XG4gICAgICAgICAgICAgICAgbm9kZS5uYW1lICs9IFByZWZhYlV0aWxzLk1JU1NJTkdfUFJFRkFCX1NVRkZJWDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMzcwMSwgbm9kZS5uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGUuX3ByZWZhYiA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzYXZlIHJvb3QncyBwcmVzZXJ2ZWQgcHJvcHMgdG8gYXZvaWQgb3ZlcndyaXR0ZW4gYnkgcHJlZmFiXG4gICAgICAgIHZhciBfb2JqRmxhZ3MgPSBub2RlLl9vYmpGbGFncztcbiAgICAgICAgdmFyIF9wYXJlbnQgPSBub2RlLl9wYXJlbnQ7XG4gICAgICAgIHZhciBfaWQgPSBub2RlLl9pZDtcbiAgICAgICAgdmFyIF9uYW1lID0gbm9kZS5fbmFtZTtcbiAgICAgICAgdmFyIF9hY3RpdmUgPSBub2RlLl9hY3RpdmU7XG4gICAgICAgIHZhciBldWxlckFuZ2xlc1ggPSBub2RlLl9ldWxlckFuZ2xlcy54O1xuICAgICAgICB2YXIgZXVsZXJBbmdsZXNZID0gbm9kZS5fZXVsZXJBbmdsZXMueTtcbiAgICAgICAgdmFyIGV1bGVyQW5nbGVzWiA9IG5vZGUuX2V1bGVyQW5nbGVzLno7XG4gICAgICAgIHZhciBfbG9jYWxaT3JkZXIgPSBub2RlLl9sb2NhbFpPcmRlcjtcbiAgICAgICAgdmFyIHRycyA9IG5vZGUuX3RycztcbiAgICAgICAgdmFyIHggPSB0cnNbMF07XG4gICAgICAgIHZhciB5ID0gdHJzWzFdO1xuICAgICAgICB2YXIgeiA9IHRyc1syXTtcblxuICAgICAgICAvLyBpbnN0YW50aWF0ZSBwcmVmYWJcbiAgICAgICAgY2MuZ2FtZS5faXNDbG9uaW5nID0gdHJ1ZTtcbiAgICAgICAgaWYgKENDX1NVUFBPUlRfSklUKSB7XG4gICAgICAgICAgICBfcHJlZmFiLmFzc2V0Ll9kb0luc3RhbnRpYXRlKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gcm9vdCBpbiBwcmVmYWIgYXNzZXQgaXMgYWx3YXlzIHN5bmNlZFxuICAgICAgICAgICAgdmFyIHByZWZhYlJvb3QgPSBfcHJlZmFiLmFzc2V0LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIHVzZSBub2RlIGFzIHRoZSBpbnN0YW50aWF0ZWQgcHJlZmFiUm9vdCB0byBtYWtlIHJlZmVyZW5jZXMgdG8gcHJlZmFiUm9vdCBpbiBwcmVmYWIgcmVkaXJlY3QgdG8gbm9kZVxuICAgICAgICAgICAgcHJlZmFiUm9vdC5faU4kdCA9IG5vZGU7XG5cbiAgICAgICAgICAgIC8vIGluc3RhbnRpYXRlIHByZWZhYiBhbmQgYXBwbHkgdG8gbm9kZVxuICAgICAgICAgICAgY2MuaW5zdGFudGlhdGUuX2Nsb25lKHByZWZhYlJvb3QsIHByZWZhYlJvb3QpO1xuICAgICAgICB9XG4gICAgICAgIGNjLmdhbWUuX2lzQ2xvbmluZyA9IGZhbHNlO1xuXG4gICAgICAgIC8vIHJlc3RvcmUgcHJlc2VydmVkIHByb3BzXG4gICAgICAgIG5vZGUuX29iakZsYWdzID0gX29iakZsYWdzO1xuICAgICAgICBub2RlLl9wYXJlbnQgPSBfcGFyZW50O1xuICAgICAgICBub2RlLl9pZCA9IF9pZDtcbiAgICAgICAgbm9kZS5fcHJlZmFiID0gX3ByZWZhYjtcbiAgICAgICAgbm9kZS5fbmFtZSA9IF9uYW1lO1xuICAgICAgICBub2RlLl9hY3RpdmUgPSBfYWN0aXZlO1xuICAgICAgICBub2RlLl9sb2NhbFpPcmRlciA9IF9sb2NhbFpPcmRlcjtcbiAgICAgICAgdHJzID0gbm9kZS5fdHJzO1xuICAgICAgICB0cnNbMF0gPSB4O1xuICAgICAgICB0cnNbMV0gPSB5O1xuICAgICAgICB0cnNbMl0gPSB6O1xuICAgICAgICBub2RlLl9ldWxlckFuZ2xlcy54ID0gZXVsZXJBbmdsZXNYO1xuICAgICAgICBub2RlLl9ldWxlckFuZ2xlcy55ID0gZXVsZXJBbmdsZXNZO1xuICAgICAgICBub2RlLl9ldWxlckFuZ2xlcy56ID0gZXVsZXJBbmdsZXNaO1xuICAgIH1cbn07XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==