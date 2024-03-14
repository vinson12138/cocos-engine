
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/CCScene.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2015-2016 Chukong Technologies Inc.
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
var NIL = function NIL() {};
/**
 * !#en
 * cc.Scene is a subclass of cc.Node that is used only as an abstract concept.<br/>
 * cc.Scene and cc.Node are almost identical with the difference that users can not modify cc.Scene manually.
 * !#zh
 * cc.Scene 是 cc.Node 的子类，仅作为一个抽象的概念。<br/>
 * cc.Scene 和 cc.Node 有点不同，用户不应直接修改 cc.Scene。
 * @class Scene
 * @extends Node
 */


cc.Scene = cc.Class({
  name: 'cc.Scene',
  "extends": require('./CCNode'),
  properties: {
    _is3DNode: {
      "default": true,
      override: true
    },

    /**
     * !#en Indicates whether all (directly or indirectly) static referenced assets of this scene are releasable by default after scene unloading.
     * !#zh 指示该场景中直接或间接静态引用到的所有资源是否默认在场景切换后自动释放。
     * @property {Boolean} autoReleaseAssets
     * @default false
     */
    autoReleaseAssets: false
  },
  ctor: function ctor() {
    this._anchorPoint.x = 0.0;
    this._anchorPoint.y = 0.0;
    this._activeInHierarchy = false;
    this._inited = !cc.game._isCloning;

    if (CC_EDITOR) {
      this._prefabSyncedInLiveReload = false;
    } // cache all depend assets for auto release


    this.dependAssets = null;
  },
  destroy: function destroy() {
    if (cc.Object.prototype.destroy.call(this)) {
      var children = this._children;

      for (var i = 0; i < children.length; ++i) {
        children[i].active = false;
      }
    }

    this._active = false;
    this._activeInHierarchy = false;
  },
  _onHierarchyChanged: NIL,
  _instantiate: null,
  _load: function _load() {
    if (!this._inited) {
      if (CC_TEST) {
        cc.assert(!this._activeInHierarchy, 'Should deactivate ActionManager and EventManager by default');
      }

      this._onBatchCreated(CC_EDITOR && this._prefabSyncedInLiveReload);

      this._inited = true;
    }
  },
  _activate: function _activate(active) {
    active = active !== false;

    if (CC_EDITOR || CC_TEST) {
      // register all nodes to editor
      this._registerIfAttached(active);
    }

    cc.director._nodeActivator.activateNode(this, active);
  }
});
module.exports = cc.Scene;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL0NDU2NlbmUuanMiXSwibmFtZXMiOlsiTklMIiwiY2MiLCJTY2VuZSIsIkNsYXNzIiwibmFtZSIsInJlcXVpcmUiLCJwcm9wZXJ0aWVzIiwiX2lzM0ROb2RlIiwib3ZlcnJpZGUiLCJhdXRvUmVsZWFzZUFzc2V0cyIsImN0b3IiLCJfYW5jaG9yUG9pbnQiLCJ4IiwieSIsIl9hY3RpdmVJbkhpZXJhcmNoeSIsIl9pbml0ZWQiLCJnYW1lIiwiX2lzQ2xvbmluZyIsIkNDX0VESVRPUiIsIl9wcmVmYWJTeW5jZWRJbkxpdmVSZWxvYWQiLCJkZXBlbmRBc3NldHMiLCJkZXN0cm95IiwiT2JqZWN0IiwicHJvdG90eXBlIiwiY2FsbCIsImNoaWxkcmVuIiwiX2NoaWxkcmVuIiwiaSIsImxlbmd0aCIsImFjdGl2ZSIsIl9hY3RpdmUiLCJfb25IaWVyYXJjaHlDaGFuZ2VkIiwiX2luc3RhbnRpYXRlIiwiX2xvYWQiLCJDQ19URVNUIiwiYXNzZXJ0IiwiX29uQmF0Y2hDcmVhdGVkIiwiX2FjdGl2YXRlIiwiX3JlZ2lzdGVySWZBdHRhY2hlZCIsImRpcmVjdG9yIiwiX25vZGVBY3RpdmF0b3IiLCJhY3RpdmF0ZU5vZGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBSUEsR0FBRyxHQUFHLFNBQU5BLEdBQU0sR0FBWSxDQUFFLENBQXhCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBQyxFQUFFLENBQUNDLEtBQUgsR0FBV0QsRUFBRSxDQUFDRSxLQUFILENBQVM7QUFDaEJDLEVBQUFBLElBQUksRUFBRSxVQURVO0FBRWhCLGFBQVNDLE9BQU8sQ0FBQyxVQUFELENBRkE7QUFJaEJDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxTQUFTLEVBQUU7QUFDUCxpQkFBUyxJQURGO0FBRVBDLE1BQUFBLFFBQVEsRUFBRTtBQUZILEtBREg7O0FBTVI7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1FDLElBQUFBLGlCQUFpQixFQUFFO0FBWlgsR0FKSTtBQW1CaEJDLEVBQUFBLElBQUksRUFBRSxnQkFBWTtBQUNkLFNBQUtDLFlBQUwsQ0FBa0JDLENBQWxCLEdBQXNCLEdBQXRCO0FBQ0EsU0FBS0QsWUFBTCxDQUFrQkUsQ0FBbEIsR0FBc0IsR0FBdEI7QUFFQSxTQUFLQyxrQkFBTCxHQUEwQixLQUExQjtBQUNBLFNBQUtDLE9BQUwsR0FBZSxDQUFDZCxFQUFFLENBQUNlLElBQUgsQ0FBUUMsVUFBeEI7O0FBRUEsUUFBSUMsU0FBSixFQUFlO0FBQ1gsV0FBS0MseUJBQUwsR0FBaUMsS0FBakM7QUFDSCxLQVRhLENBV2Q7OztBQUNBLFNBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDSCxHQWhDZTtBQWtDaEJDLEVBQUFBLE9BQU8sRUFBRSxtQkFBWTtBQUNqQixRQUFJcEIsRUFBRSxDQUFDcUIsTUFBSCxDQUFVQyxTQUFWLENBQW9CRixPQUFwQixDQUE0QkcsSUFBNUIsQ0FBaUMsSUFBakMsQ0FBSixFQUE0QztBQUN4QyxVQUFJQyxRQUFRLEdBQUcsS0FBS0MsU0FBcEI7O0FBQ0EsV0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixRQUFRLENBQUNHLE1BQTdCLEVBQXFDLEVBQUVELENBQXZDLEVBQTBDO0FBQ3RDRixRQUFBQSxRQUFRLENBQUNFLENBQUQsQ0FBUixDQUFZRSxNQUFaLEdBQXFCLEtBQXJCO0FBQ0g7QUFDSjs7QUFDRCxTQUFLQyxPQUFMLEdBQWUsS0FBZjtBQUNBLFNBQUtoQixrQkFBTCxHQUEwQixLQUExQjtBQUNILEdBM0NlO0FBNkNoQmlCLEVBQUFBLG1CQUFtQixFQUFFL0IsR0E3Q0w7QUE4Q2hCZ0MsRUFBQUEsWUFBWSxFQUFHLElBOUNDO0FBZ0RoQkMsRUFBQUEsS0FBSyxFQUFFLGlCQUFZO0FBQ2YsUUFBSSxDQUFDLEtBQUtsQixPQUFWLEVBQW1CO0FBQ2YsVUFBSW1CLE9BQUosRUFBYTtBQUNUakMsUUFBQUEsRUFBRSxDQUFDa0MsTUFBSCxDQUFVLENBQUMsS0FBS3JCLGtCQUFoQixFQUFvQyw2REFBcEM7QUFDSDs7QUFDRCxXQUFLc0IsZUFBTCxDQUFxQmxCLFNBQVMsSUFBSSxLQUFLQyx5QkFBdkM7O0FBQ0EsV0FBS0osT0FBTCxHQUFlLElBQWY7QUFDSDtBQUNKLEdBeERlO0FBMERoQnNCLEVBQUFBLFNBQVMsRUFBRSxtQkFBVVIsTUFBVixFQUFrQjtBQUN6QkEsSUFBQUEsTUFBTSxHQUFJQSxNQUFNLEtBQUssS0FBckI7O0FBQ0EsUUFBSVgsU0FBUyxJQUFJZ0IsT0FBakIsRUFBMEI7QUFDdEI7QUFDQSxXQUFLSSxtQkFBTCxDQUF5QlQsTUFBekI7QUFDSDs7QUFDRDVCLElBQUFBLEVBQUUsQ0FBQ3NDLFFBQUgsQ0FBWUMsY0FBWixDQUEyQkMsWUFBM0IsQ0FBd0MsSUFBeEMsRUFBOENaLE1BQTlDO0FBQ0g7QUFqRWUsQ0FBVCxDQUFYO0FBb0VBYSxNQUFNLENBQUNDLE9BQVAsR0FBaUIxQyxFQUFFLENBQUNDLEtBQXBCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTUtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwOi8vd3d3LmNvY29zMmQteC5vcmdcblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBOSUwgPSBmdW5jdGlvbiAoKSB7fTtcblxuLyoqXG4gKiAhI2VuXG4gKiBjYy5TY2VuZSBpcyBhIHN1YmNsYXNzIG9mIGNjLk5vZGUgdGhhdCBpcyB1c2VkIG9ubHkgYXMgYW4gYWJzdHJhY3QgY29uY2VwdC48YnIvPlxuICogY2MuU2NlbmUgYW5kIGNjLk5vZGUgYXJlIGFsbW9zdCBpZGVudGljYWwgd2l0aCB0aGUgZGlmZmVyZW5jZSB0aGF0IHVzZXJzIGNhbiBub3QgbW9kaWZ5IGNjLlNjZW5lIG1hbnVhbGx5LlxuICogISN6aFxuICogY2MuU2NlbmUg5pivIGNjLk5vZGUg55qE5a2Q57G777yM5LuF5L2c5Li65LiA5Liq5oq96LGh55qE5qaC5b+144CCPGJyLz5cbiAqIGNjLlNjZW5lIOWSjCBjYy5Ob2RlIOacieeCueS4jeWQjO+8jOeUqOaIt+S4jeW6lOebtOaOpeS/ruaUuSBjYy5TY2VuZeOAglxuICogQGNsYXNzIFNjZW5lXG4gKiBAZXh0ZW5kcyBOb2RlXG4gKi9cbmNjLlNjZW5lID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5TY2VuZScsXG4gICAgZXh0ZW5kczogcmVxdWlyZSgnLi9DQ05vZGUnKSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX2lzM0ROb2RlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgICAgb3ZlcnJpZGU6IHRydWVcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBJbmRpY2F0ZXMgd2hldGhlciBhbGwgKGRpcmVjdGx5IG9yIGluZGlyZWN0bHkpIHN0YXRpYyByZWZlcmVuY2VkIGFzc2V0cyBvZiB0aGlzIHNjZW5lIGFyZSByZWxlYXNhYmxlIGJ5IGRlZmF1bHQgYWZ0ZXIgc2NlbmUgdW5sb2FkaW5nLlxuICAgICAgICAgKiAhI3poIOaMh+ekuuivpeWcuuaZr+S4reebtOaOpeaIlumXtOaOpemdmeaAgeW8leeUqOWIsOeahOaJgOaciei1hOa6kOaYr+WQpum7mOiupOWcqOWcuuaZr+WIh+aNouWQjuiHquWKqOmHiuaUvuOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGF1dG9SZWxlYXNlQXNzZXRzXG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICBhdXRvUmVsZWFzZUFzc2V0czogZmFsc2UsXG4gICAgfSxcblxuICAgIGN0b3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fYW5jaG9yUG9pbnQueCA9IDAuMDtcbiAgICAgICAgdGhpcy5fYW5jaG9yUG9pbnQueSA9IDAuMDtcblxuICAgICAgICB0aGlzLl9hY3RpdmVJbkhpZXJhcmNoeSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pbml0ZWQgPSAhY2MuZ2FtZS5faXNDbG9uaW5nO1xuXG4gICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRoaXMuX3ByZWZhYlN5bmNlZEluTGl2ZVJlbG9hZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2FjaGUgYWxsIGRlcGVuZCBhc3NldHMgZm9yIGF1dG8gcmVsZWFzZVxuICAgICAgICB0aGlzLmRlcGVuZEFzc2V0cyA9IG51bGw7XG4gICAgfSxcblxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGNjLk9iamVjdC5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbjtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbltpXS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fYWN0aXZlSW5IaWVyYXJjaHkgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgX29uSGllcmFyY2h5Q2hhbmdlZDogTklMLFxuICAgIF9pbnN0YW50aWF0ZSA6IG51bGwsXG5cbiAgICBfbG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2luaXRlZCkge1xuICAgICAgICAgICAgaWYgKENDX1RFU1QpIHtcbiAgICAgICAgICAgICAgICBjYy5hc3NlcnQoIXRoaXMuX2FjdGl2ZUluSGllcmFyY2h5LCAnU2hvdWxkIGRlYWN0aXZhdGUgQWN0aW9uTWFuYWdlciBhbmQgRXZlbnRNYW5hZ2VyIGJ5IGRlZmF1bHQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX29uQmF0Y2hDcmVhdGVkKENDX0VESVRPUiAmJiB0aGlzLl9wcmVmYWJTeW5jZWRJbkxpdmVSZWxvYWQpO1xuICAgICAgICAgICAgdGhpcy5faW5pdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfYWN0aXZhdGU6IGZ1bmN0aW9uIChhY3RpdmUpIHtcbiAgICAgICAgYWN0aXZlID0gKGFjdGl2ZSAhPT0gZmFsc2UpO1xuICAgICAgICBpZiAoQ0NfRURJVE9SIHx8IENDX1RFU1QpIHtcbiAgICAgICAgICAgIC8vIHJlZ2lzdGVyIGFsbCBub2RlcyB0byBlZGl0b3JcbiAgICAgICAgICAgIHRoaXMuX3JlZ2lzdGVySWZBdHRhY2hlZChhY3RpdmUpO1xuICAgICAgICB9XG4gICAgICAgIGNjLmRpcmVjdG9yLl9ub2RlQWN0aXZhdG9yLmFjdGl2YXRlTm9kZSh0aGlzLCBhY3RpdmUpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNjLlNjZW5lO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=