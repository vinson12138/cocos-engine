
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/skeleton/CCSkeletonAnimation.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
var Animation = require('../../components/CCAnimation');

var Model = require('../CCModel');

var SkeletonAnimationClip = require('./CCSkeletonAnimationClip');
/**
 * @module cc
 */

/**
 * !#en .
 * !#zh 。
 * @class SkeletonAnimation
 * @extends Animation
 */


var SkeletonAnimation = cc.Class({
  name: 'cc.SkeletonAnimation',
  "extends": Animation,
  editor: CC_EDITOR && {
    inspector: 'packages://inspector/inspectors/comps/skeleton-animation.js',
    menu: 'i18n:MAIN_MENU.component.others/Skeleton Animation'
  },
  properties: {
    _model: {
      "default": null,
      type: Model
    },
    _defaultClip: {
      override: true,
      "default": null,
      type: SkeletonAnimationClip
    },
    _clips: {
      override: true,
      "default": [],
      type: [SkeletonAnimationClip],
      visible: true
    },
    defaultClip: {
      override: true,
      get: function get() {
        return this._defaultClip;
      },
      set: function set(v) {
        this._defaultClip = v;
      },
      type: SkeletonAnimationClip
    },
    model: {
      get: function get() {
        return this._model;
      },
      set: function set(val) {
        this._model = val;

        this._updateClipModel();
      },
      type: Model
    }
  },
  __preload: function __preload() {
    this._updateClipModel();
  },
  _updateClipModel: function _updateClipModel() {
    if (this._defaultClip) {
      this._defaultClip._model = this._model;
    }

    var clips = this._clips;

    for (var i = 0; i < clips.length; i++) {
      clips[i]._model = this._model;
    }
  },
  addClip: function addClip(clip, newName) {
    clip._model = this._model;
    return Animation.prototype.addClip.call(this, clip, newName);
  },
  searchClips: CC_EDITOR && function () {
    if (!this._model) {
      cc.warn('There was no model provided.');
      return;
    }

    this._clips.length = 0;
    var self = this;
    Editor.assetdb.queryPathByUuid(this._model._uuid, function (err, modelPath) {
      if (err) return console.error(err);

      var Path = require('fire-path');

      var queryPath = Path.relative(Editor.remote.Project.path, modelPath);
      queryPath = Path.join(Path.dirname(queryPath), Path.basenameNoExt(queryPath));
      queryPath = "db://" + queryPath + "*/*.sac";
      Editor.assetdb.queryAssets(queryPath, null, function (err, results) {
        if (results) {
          for (var i = 0; i < results.length; i++) {
            var clip = new SkeletonAnimationClip();
            clip._uuid = results[i].uuid;

            self._clips.push(clip);
          }

          self._defaultClip = self._clips[0];
        }
      });
    });
  }
});
cc.SkeletonAnimation = module.exports = SkeletonAnimation;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3NrZWxldG9uL0NDU2tlbGV0b25BbmltYXRpb24uanMiXSwibmFtZXMiOlsiQW5pbWF0aW9uIiwicmVxdWlyZSIsIk1vZGVsIiwiU2tlbGV0b25BbmltYXRpb25DbGlwIiwiU2tlbGV0b25BbmltYXRpb24iLCJjYyIsIkNsYXNzIiwibmFtZSIsImVkaXRvciIsIkNDX0VESVRPUiIsImluc3BlY3RvciIsIm1lbnUiLCJwcm9wZXJ0aWVzIiwiX21vZGVsIiwidHlwZSIsIl9kZWZhdWx0Q2xpcCIsIm92ZXJyaWRlIiwiX2NsaXBzIiwidmlzaWJsZSIsImRlZmF1bHRDbGlwIiwiZ2V0Iiwic2V0IiwidiIsIm1vZGVsIiwidmFsIiwiX3VwZGF0ZUNsaXBNb2RlbCIsIl9fcHJlbG9hZCIsImNsaXBzIiwiaSIsImxlbmd0aCIsImFkZENsaXAiLCJjbGlwIiwibmV3TmFtZSIsInByb3RvdHlwZSIsImNhbGwiLCJzZWFyY2hDbGlwcyIsIndhcm4iLCJzZWxmIiwiRWRpdG9yIiwiYXNzZXRkYiIsInF1ZXJ5UGF0aEJ5VXVpZCIsIl91dWlkIiwiZXJyIiwibW9kZWxQYXRoIiwiY29uc29sZSIsImVycm9yIiwiUGF0aCIsInF1ZXJ5UGF0aCIsInJlbGF0aXZlIiwicmVtb3RlIiwiUHJvamVjdCIsInBhdGgiLCJqb2luIiwiZGlybmFtZSIsImJhc2VuYW1lTm9FeHQiLCJxdWVyeUFzc2V0cyIsInJlc3VsdHMiLCJ1dWlkIiwicHVzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxTQUFTLEdBQUdDLE9BQU8sQ0FBQyw4QkFBRCxDQUF6Qjs7QUFDQSxJQUFN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QUNETSxVQUFBQSxJQUFJLENBQUN0QixZQUFMLEdBQW9Cc0IsSUFBSSxDQUFDcEIsTUFBTCxDQUFZLENBQVosQ0FBcEI7QUFDSDtBQUNKLE9BVEQ7QUFVSCxLQWxCRDtBQW1CSDtBQWxHNEIsQ0FBVCxDQUF4QjtBQXFHQVosRUFBRSxDQUFDRCxpQkFBSCxHQUF1QnVELE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnhELGlCQUF4QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwOi8vd3d3LmNvY29zLmNvbVxuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3QgQW5pbWF0aW9uID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9DQ0FuaW1hdGlvbicpO1xuY29uc3QgTW9kZWwgPSByZXF1aXJlKCcuLi9DQ01vZGVsJyk7XG5jb25zdCBTa2VsZXRvbkFuaW1hdGlvbkNsaXAgPSByZXF1aXJlKCcuL0NDU2tlbGV0b25BbmltYXRpb25DbGlwJyk7XG5cbi8qKlxuICogQG1vZHVsZSBjY1xuICovXG4vKipcbiAqICEjZW4gLlxuICogISN6aCDjgIJcbiAqIEBjbGFzcyBTa2VsZXRvbkFuaW1hdGlvblxuICogQGV4dGVuZHMgQW5pbWF0aW9uXG4gKi9cbmxldCBTa2VsZXRvbkFuaW1hdGlvbiA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuU2tlbGV0b25BbmltYXRpb24nLFxuICAgIGV4dGVuZHM6IEFuaW1hdGlvbixcblxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9za2VsZXRvbi1hbmltYXRpb24uanMnLFxuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50Lm90aGVycy9Ta2VsZXRvbiBBbmltYXRpb24nLFxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF9tb2RlbDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IE1vZGVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgX2RlZmF1bHRDbGlwOiB7XG4gICAgICAgICAgICBvdmVycmlkZTogdHJ1ZSxcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBTa2VsZXRvbkFuaW1hdGlvbkNsaXAsXG4gICAgICAgIH0sXG5cbiAgICAgICAgX2NsaXBzOiB7XG4gICAgICAgICAgICBvdmVycmlkZTogdHJ1ZSxcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgICAgICAgdHlwZTogW1NrZWxldG9uQW5pbWF0aW9uQ2xpcF0sXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICB9LFxuXG4gICAgICAgIGRlZmF1bHRDbGlwOiB7XG4gICAgICAgICAgICBvdmVycmlkZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRDbGlwO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlZmF1bHRDbGlwID0gdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBTa2VsZXRvbkFuaW1hdGlvbkNsaXAsXG4gICAgICAgIH0sXG5cbiAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vZGVsO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW9kZWwgPSB2YWw7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ2xpcE1vZGVsKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogTW9kZWwsXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIF9fcHJlbG9hZCAoKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUNsaXBNb2RlbCgpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlQ2xpcE1vZGVsICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2RlZmF1bHRDbGlwKSB7XG4gICAgICAgICAgICB0aGlzLl9kZWZhdWx0Q2xpcC5fbW9kZWwgPSB0aGlzLl9tb2RlbDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgbGV0IGNsaXBzID0gdGhpcy5fY2xpcHM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2xpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNsaXBzW2ldLl9tb2RlbCA9IHRoaXMuX21vZGVsO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGFkZENsaXAgKGNsaXAsIG5ld05hbWUpIHtcbiAgICAgICAgY2xpcC5fbW9kZWwgPSB0aGlzLl9tb2RlbDtcbiAgICAgICAgcmV0dXJuIEFuaW1hdGlvbi5wcm90b3R5cGUuYWRkQ2xpcC5jYWxsKHRoaXMsIGNsaXAsIG5ld05hbWUpO1xuICAgIH0sXG5cbiAgICBzZWFyY2hDbGlwczogQ0NfRURJVE9SICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9tb2RlbCkge1xuICAgICAgICAgICAgY2Mud2FybignVGhlcmUgd2FzIG5vIG1vZGVsIHByb3ZpZGVkLicpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY2xpcHMubGVuZ3RoID0gMDtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBFZGl0b3IuYXNzZXRkYi5xdWVyeVBhdGhCeVV1aWQodGhpcy5fbW9kZWwuX3V1aWQsIGZ1bmN0aW9uIChlcnIsIG1vZGVsUGF0aCkge1xuICAgICAgICAgICAgaWYgKGVycikgcmV0dXJuIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgUGF0aCA9IHJlcXVpcmUoJ2ZpcmUtcGF0aCcpO1xuICAgICAgICAgICAgbGV0IHF1ZXJ5UGF0aCA9IFBhdGgucmVsYXRpdmUoRWRpdG9yLnJlbW90ZS5Qcm9qZWN0LnBhdGgsIG1vZGVsUGF0aCk7XG4gICAgICAgICAgICBxdWVyeVBhdGggPSBQYXRoLmpvaW4oUGF0aC5kaXJuYW1lKHF1ZXJ5UGF0aCksIFBhdGguYmFzZW5hbWVOb0V4dChxdWVyeVBhdGgpKTtcbiAgICAgICAgICAgIHF1ZXJ5UGF0aCA9IGBkYjovLyR7cXVlcnlQYXRofSovKi5zYWNgO1xuXG4gICAgICAgICAgICBFZGl0b3IuYXNzZXRkYi5xdWVyeUFzc2V0cyhxdWVyeVBhdGgsIG51bGwsIGZ1bmN0aW9uIChlcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0cykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjbGlwID0gbmV3IFNrZWxldG9uQW5pbWF0aW9uQ2xpcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xpcC5fdXVpZCA9IHJlc3VsdHNbaV0udXVpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX2NsaXBzLnB1c2goY2xpcCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fZGVmYXVsdENsaXAgPSBzZWxmLl9jbGlwc1swXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5cbmNjLlNrZWxldG9uQW5pbWF0aW9uID0gbW9kdWxlLmV4cG9ydHMgPSBTa2VsZXRvbkFuaW1hdGlvbjtcbiJdLCJzb3VyY2VSb290IjoiLyJ9