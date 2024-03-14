
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCMotionStreak.js';
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
var RenderComponent = require('../components/CCRenderComponent');

var BlendFunc = require('../../core/utils/blend-func');
/**
 * !#en
 * cc.MotionStreak manages a Ribbon based on it's motion in absolute space.                 <br/>
 * You construct it with a fadeTime, minimum segment size, texture path, texture            <br/>
 * length and color. The fadeTime controls how long it takes each vertex in                 <br/>
 * the streak to fade out, the minimum segment size it how many pixels the                  <br/>
 * streak will move before adding a new ribbon segment, and the texture                     <br/>
 * length is the how many pixels the texture is stretched across. The texture               <br/>
 * is vertically aligned along the streak segment.
 * !#zh 运动轨迹，用于游戏对象的运动轨迹上实现拖尾渐隐效果。
 * @class MotionStreak
 * @extends Component
 * @uses BlendFunc
 */


var MotionStreak = cc.Class({
  name: 'cc.MotionStreak',
  // To avoid conflict with other render component, we haven't use ComponentUnderSG,
  // its implementation also requires some different approach:
  //   1.Needed a parent node to make motion streak's position global related.
  //   2.Need to update the position in each frame by itself because we don't know
  //     whether the global position have changed
  "extends": RenderComponent,
  mixins: [BlendFunc],
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.others/MotionStreak',
    help: 'i18n:COMPONENT.help_url.motionStreak',
    playOnFocus: true,
    executeInEditMode: true
  },
  ctor: function ctor() {
    this._points = [];
  },
  properties: {
    /**
     * !#en
     * !#zh 在编辑器模式下预览拖尾效果。
     * @property {Boolean} preview
     * @default false
     */
    preview: {
      "default": false,
      editorOnly: true,
      notify: CC_EDITOR && function () {
        this.reset();
      },
      animatable: false
    },

    /**
     * !#en The fade time to fade.
     * !#zh 拖尾的渐隐时间，以秒为单位。
     * @property fadeTime
     * @type {Number}
     * @example
     * motionStreak.fadeTime = 3;
     */
    _fadeTime: 1,
    fadeTime: {
      get: function get() {
        return this._fadeTime;
      },
      set: function set(value) {
        this._fadeTime = value;
        this.reset();
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.fadeTime'
    },

    /**
     * !#en The minimum segment size.
     * !#zh 拖尾之间最小距离。
     * @property minSeg
     * @type {Number}
     * @example
     * motionStreak.minSeg = 3;
     */
    _minSeg: 1,
    minSeg: {
      get: function get() {
        return this._minSeg;
      },
      set: function set(value) {
        this._minSeg = value;
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.minSeg'
    },

    /**
     * !#en The stroke's width.
     * !#zh 拖尾的宽度。
     * @property stroke
     * @type {Number}
     * @example
     * motionStreak.stroke = 64;
     */
    _stroke: 64,
    stroke: {
      get: function get() {
        return this._stroke;
      },
      set: function set(value) {
        this._stroke = value;
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.stroke'
    },

    /**
     * !#en The texture of the MotionStreak.
     * !#zh 拖尾的贴图。
     * @property texture
     * @type {Texture2D}
     * @example
     * motionStreak.texture = newTexture;
     */
    _texture: {
      "default": null,
      type: cc.Texture2D
    },
    texture: {
      get: function get() {
        return this._texture;
      },
      set: function set(value) {
        if (this._texture === value) return;
        this._texture = value;

        this._updateMaterial();
      },
      type: cc.Texture2D,
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.texture'
    },

    /**
     * !#en The color of the MotionStreak.
     * !#zh 拖尾的颜色
     * @property color
     * @type {Color}
     * @default cc.Color.WHITE
     * @example
     * motionStreak.color = new cc.Color(255, 255, 255);
     */
    _color: cc.Color.WHITE,
    color: {
      get: function get() {
        return this._color.clone();
      },
      set: function set(value) {
        if (!this._color.equals(value)) {
          this._color.set(value);
        }
      },
      type: cc.Color,
      tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.color'
    },

    /**
     * !#en The fast Mode.
     * !#zh 是否启用了快速模式。当启用快速模式，新的点会被更快地添加，但精度较低。
     * @property fastMode
     * @type {Boolean}
     * @default false
     * @example
     * motionStreak.fastMode = true;
     */
    _fastMode: false,
    fastMode: {
      get: function get() {
        return this._fastMode;
      },
      set: function set(value) {
        this._fastMode = value;
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.fastMode'
    }
  },
  onEnable: function onEnable() {
    this._super();

    this.reset();
  },
  _updateMaterial: function _updateMaterial() {
    var material = this.getMaterial(0);
    material && material.setProperty('texture', this._texture);

    BlendFunc.prototype._updateMaterial.call(this);
  },
  onFocusInEditor: CC_EDITOR && function () {
    if (this.preview) {
      this.reset();
    }
  },
  onLostFocusInEditor: CC_EDITOR && function () {
    if (this.preview) {
      this.reset();
    }
  },

  /**
   * !#en Remove all living segments of the ribbon.
   * !#zh 删除当前所有的拖尾片段。
   * @method reset
   * @example
   * // Remove all living segments of the ribbon.
   * myMotionStreak.reset();
   */
  reset: function reset() {
    this._points.length = 0;
    this._assembler && this._assembler._renderData.clear();

    if (CC_EDITOR) {
      cc.engine.repaintInEditMode();
    }
  },
  lateUpdate: function lateUpdate(dt) {
    this._assembler && this._assembler.update(this, dt);
  }
});
cc.MotionStreak = module.exports = MotionStreak;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvQ0NNb3Rpb25TdHJlYWsuanMiXSwibmFtZXMiOlsiUmVuZGVyQ29tcG9uZW50IiwicmVxdWlyZSIsIkJsZW5kRnVuYyIsIk1vdGlvblN0cmVhayIsImNjIiwiQ2xhc3MiLCJuYW1lIiwibWl4aW5zIiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwibWVudSIsImhlbHAiLCJwbGF5T25Gb2N1cyIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiY3RvciIsIl9wb2ludHMiLCJwcm9wZXJ0aWVzIiwicHJldmlldyIsImVkaXRvck9ubHkiLCJub3RpZnkiLCJyZXNldCIsImFuaW1hdGFibGUiLCJfZmFkZVRpbWUiLCJmYWRlVGltZSIsImdldCIsInNldCIsInZhbHVlIiwidG9vbHRpcCIsIkNDX0RFViIsIl9taW5TZWciLCJtaW5TZWciLCJfc3Ryb2tlIiwic3Ryb2tlIiwiX3RleHR1cmUiLCJ0eXBlIiwiVGV4dHVyZTJEIiwidGV4dHVyZSIsIl91cGRhdGVNYXRlcmlhbCIsIl9jb2xvciIsIkNvbG9yIiwiV0hJVEUiLCJjb2xvciIsImNsb25lIiwiZXF1YWxzIiwiX2Zhc3RNb2RlIiwiZmFzdE1vZGUiLCJvbkVuYWJsZSIsIl9zdXBlciIsIm1hdGVyaWFsIiwiZ2V0TWF0ZXJpYWwiLCJzZXRQcm9wZXJ0eSIsInByb3RvdHlwZSIsImNhbGwiLCJvbkZvY3VzSW5FZGl0b3IiLCJvbkxvc3RGb2N1c0luRWRpdG9yIiwibGVuZ3RoIiwiX2Fzc2VtYmxlciIsIl9yZW5kZXJEYXRhIiwiY2xlYXIiLCJlbmdpbmUiLCJyZXBhaW50SW5FZGl0TW9kZSIsImxhdGVVcGRhdGUiLCJkdCIsInVwZGF0ZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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RCxNQUFILENBQVVDLGlCQUFWO0FBQ0g7QUFDSixHQWpOdUI7QUFtTnhCQyxFQUFBQSxVQW5Od0Isc0JBbU5aQyxFQW5OWSxFQW1OUjtBQUNaLFNBQUtOLFVBQUwsSUFBbUIsS0FBS0EsVUFBTCxDQUFnQk8sTUFBaEIsQ0FBdUIsSUFBdkIsRUFBNkJELEVBQTdCLENBQW5CO0FBQ0g7QUFyTnVCLENBQVQsQ0FBbkI7QUF3TkExRCxFQUFFLENBQUNELFlBQUgsR0FBa0I2RCxNQUFNLENBQUNDLE9BQVAsR0FBaUI5RCxZQUFuQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBSZW5kZXJDb21wb25lbnQgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL0NDUmVuZGVyQ29tcG9uZW50Jyk7XG5jb25zdCBCbGVuZEZ1bmMgPSByZXF1aXJlKCcuLi8uLi9jb3JlL3V0aWxzL2JsZW5kLWZ1bmMnKTtcblxuLyoqXG4gKiAhI2VuXG4gKiBjYy5Nb3Rpb25TdHJlYWsgbWFuYWdlcyBhIFJpYmJvbiBiYXNlZCBvbiBpdCdzIG1vdGlvbiBpbiBhYnNvbHV0ZSBzcGFjZS4gICAgICAgICAgICAgICAgIDxici8+XG4gKiBZb3UgY29uc3RydWN0IGl0IHdpdGggYSBmYWRlVGltZSwgbWluaW11bSBzZWdtZW50IHNpemUsIHRleHR1cmUgcGF0aCwgdGV4dHVyZSAgICAgICAgICAgIDxici8+XG4gKiBsZW5ndGggYW5kIGNvbG9yLiBUaGUgZmFkZVRpbWUgY29udHJvbHMgaG93IGxvbmcgaXQgdGFrZXMgZWFjaCB2ZXJ0ZXggaW4gICAgICAgICAgICAgICAgIDxici8+XG4gKiB0aGUgc3RyZWFrIHRvIGZhZGUgb3V0LCB0aGUgbWluaW11bSBzZWdtZW50IHNpemUgaXQgaG93IG1hbnkgcGl4ZWxzIHRoZSAgICAgICAgICAgICAgICAgIDxici8+XG4gKiBzdHJlYWsgd2lsbCBtb3ZlIGJlZm9yZSBhZGRpbmcgYSBuZXcgcmliYm9uIHNlZ21lbnQsIGFuZCB0aGUgdGV4dHVyZSAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gKiBsZW5ndGggaXMgdGhlIGhvdyBtYW55IHBpeGVscyB0aGUgdGV4dHVyZSBpcyBzdHJldGNoZWQgYWNyb3NzLiBUaGUgdGV4dHVyZSAgICAgICAgICAgICAgIDxici8+XG4gKiBpcyB2ZXJ0aWNhbGx5IGFsaWduZWQgYWxvbmcgdGhlIHN0cmVhayBzZWdtZW50LlxuICogISN6aCDov5Dliqjovajov7nvvIznlKjkuo7muLjmiI/lr7nosaHnmoTov5Dliqjovajov7nkuIrlrp7njrDmi5blsL7muJDpmpDmlYjmnpzjgIJcbiAqIEBjbGFzcyBNb3Rpb25TdHJlYWtcbiAqIEBleHRlbmRzIENvbXBvbmVudFxuICogQHVzZXMgQmxlbmRGdW5jXG4gKi9cbnZhciBNb3Rpb25TdHJlYWsgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLk1vdGlvblN0cmVhaycsXG5cbiAgICAvLyBUbyBhdm9pZCBjb25mbGljdCB3aXRoIG90aGVyIHJlbmRlciBjb21wb25lbnQsIHdlIGhhdmVuJ3QgdXNlIENvbXBvbmVudFVuZGVyU0csXG4gICAgLy8gaXRzIGltcGxlbWVudGF0aW9uIGFsc28gcmVxdWlyZXMgc29tZSBkaWZmZXJlbnQgYXBwcm9hY2g6XG4gICAgLy8gICAxLk5lZWRlZCBhIHBhcmVudCBub2RlIHRvIG1ha2UgbW90aW9uIHN0cmVhaydzIHBvc2l0aW9uIGdsb2JhbCByZWxhdGVkLlxuICAgIC8vICAgMi5OZWVkIHRvIHVwZGF0ZSB0aGUgcG9zaXRpb24gaW4gZWFjaCBmcmFtZSBieSBpdHNlbGYgYmVjYXVzZSB3ZSBkb24ndCBrbm93XG4gICAgLy8gICAgIHdoZXRoZXIgdGhlIGdsb2JhbCBwb3NpdGlvbiBoYXZlIGNoYW5nZWRcbiAgICBleHRlbmRzOiBSZW5kZXJDb21wb25lbnQsXG4gICAgbWl4aW5zOiBbQmxlbmRGdW5jXSxcblxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5vdGhlcnMvTW90aW9uU3RyZWFrJyxcbiAgICAgICAgaGVscDogJ2kxOG46Q09NUE9ORU5ULmhlbHBfdXJsLm1vdGlvblN0cmVhaycsXG4gICAgICAgIHBsYXlPbkZvY3VzOiB0cnVlLFxuICAgICAgICBleGVjdXRlSW5FZGl0TW9kZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBjdG9yICgpIHtcbiAgICAgICAgdGhpcy5fcG9pbnRzID0gW107XG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogISN6aCDlnKjnvJbovpHlmajmqKHlvI/kuIvpooTop4jmi5blsL7mlYjmnpzjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBwcmV2aWV3XG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICBwcmV2aWV3OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIGVkaXRvck9ubHk6IHRydWUsXG4gICAgICAgICAgICBub3RpZnk6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIGZhZGUgdGltZSB0byBmYWRlLlxuICAgICAgICAgKiAhI3poIOaLluWwvueahOa4kOmakOaXtumXtO+8jOS7peenkuS4uuWNleS9jeOAglxuICAgICAgICAgKiBAcHJvcGVydHkgZmFkZVRpbWVcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbW90aW9uU3RyZWFrLmZhZGVUaW1lID0gMztcbiAgICAgICAgICovXG4gICAgICAgIF9mYWRlVGltZTogMSxcbiAgICAgICAgZmFkZVRpbWU6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZhZGVUaW1lO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9mYWRlVGltZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubW90aW9uU3RyZWFrLmZhZGVUaW1lJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBtaW5pbXVtIHNlZ21lbnQgc2l6ZS5cbiAgICAgICAgICogISN6aCDmi5blsL7kuYvpl7TmnIDlsI/ot53nprvjgIJcbiAgICAgICAgICogQHByb3BlcnR5IG1pblNlZ1xuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBtb3Rpb25TdHJlYWsubWluU2VnID0gMztcbiAgICAgICAgICovXG4gICAgICAgIF9taW5TZWc6IDEsXG4gICAgICAgIG1pblNlZzoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbWluU2VnO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9taW5TZWcgPSB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubW90aW9uU3RyZWFrLm1pblNlZydcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgc3Ryb2tlJ3Mgd2lkdGguXG4gICAgICAgICAqICEjemgg5ouW5bC+55qE5a695bqm44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBzdHJva2VcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbW90aW9uU3RyZWFrLnN0cm9rZSA9IDY0O1xuICAgICAgICAgKi9cbiAgICAgICAgX3N0cm9rZTogNjQsXG4gICAgICAgIHN0cm9rZToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3Ryb2tlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdHJva2UgPSB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubW90aW9uU3RyZWFrLnN0cm9rZSdcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgdGV4dHVyZSBvZiB0aGUgTW90aW9uU3RyZWFrLlxuICAgICAgICAgKiAhI3poIOaLluWwvueahOi0tOWbvuOAglxuICAgICAgICAgKiBAcHJvcGVydHkgdGV4dHVyZVxuICAgICAgICAgKiBAdHlwZSB7VGV4dHVyZTJEfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBtb3Rpb25TdHJlYWsudGV4dHVyZSA9IG5ld1RleHR1cmU7XG4gICAgICAgICAqL1xuICAgICAgICBfdGV4dHVyZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlRleHR1cmUyRFxuICAgICAgICB9LFxuICAgICAgICB0ZXh0dXJlOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0dXJlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdGV4dHVyZSA9PT0gdmFsdWUpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3RleHR1cmUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVNYXRlcmlhbCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IGNjLlRleHR1cmUyRCxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5tb3Rpb25TdHJlYWsudGV4dHVyZSdcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgY29sb3Igb2YgdGhlIE1vdGlvblN0cmVhay5cbiAgICAgICAgICogISN6aCDmi5blsL7nmoTpopzoibJcbiAgICAgICAgICogQHByb3BlcnR5IGNvbG9yXG4gICAgICAgICAqIEB0eXBlIHtDb2xvcn1cbiAgICAgICAgICogQGRlZmF1bHQgY2MuQ29sb3IuV0hJVEVcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbW90aW9uU3RyZWFrLmNvbG9yID0gbmV3IGNjLkNvbG9yKDI1NSwgMjU1LCAyNTUpO1xuICAgICAgICAgKi9cbiAgICAgICAgX2NvbG9yOiBjYy5Db2xvci5XSElURSxcbiAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbG9yLmNsb25lKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fY29sb3IuZXF1YWxzKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb2xvci5zZXQodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBjYy5Db2xvcixcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubW90aW9uU3RyZWFrLmNvbG9yJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBmYXN0IE1vZGUuXG4gICAgICAgICAqICEjemgg5piv5ZCm5ZCv55So5LqG5b+r6YCf5qih5byP44CC5b2T5ZCv55So5b+r6YCf5qih5byP77yM5paw55qE54K55Lya6KKr5pu05b+r5Zyw5re75Yqg77yM5L2G57K+5bqm6L6D5L2O44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBmYXN0TW9kZVxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbW90aW9uU3RyZWFrLmZhc3RNb2RlID0gdHJ1ZTtcbiAgICAgICAgICovXG4gICAgICAgIF9mYXN0TW9kZTogZmFsc2UsXG4gICAgICAgIGZhc3RNb2RlOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9mYXN0TW9kZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZmFzdE1vZGUgPSB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubW90aW9uU3RyZWFrLmZhc3RNb2RlJ1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRW5hYmxlICgpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlTWF0ZXJpYWwgKCkge1xuICAgICAgICBsZXQgbWF0ZXJpYWwgPSB0aGlzLmdldE1hdGVyaWFsKDApO1xuICAgICAgICBtYXRlcmlhbCAmJiBtYXRlcmlhbC5zZXRQcm9wZXJ0eSgndGV4dHVyZScsIHRoaXMuX3RleHR1cmUpO1xuXG4gICAgICAgIEJsZW5kRnVuYy5wcm90b3R5cGUuX3VwZGF0ZU1hdGVyaWFsLmNhbGwodGhpcyk7XG4gICAgfSxcblxuICAgIG9uRm9jdXNJbkVkaXRvcjogQ0NfRURJVE9SICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMucHJldmlldykge1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uTG9zdEZvY3VzSW5FZGl0b3I6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnByZXZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJlbW92ZSBhbGwgbGl2aW5nIHNlZ21lbnRzIG9mIHRoZSByaWJib24uXG4gICAgICogISN6aCDliKDpmaTlvZPliY3miYDmnInnmoTmi5blsL7niYfmrrXjgIJcbiAgICAgKiBAbWV0aG9kIHJlc2V0XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyBSZW1vdmUgYWxsIGxpdmluZyBzZWdtZW50cyBvZiB0aGUgcmliYm9uLlxuICAgICAqIG15TW90aW9uU3RyZWFrLnJlc2V0KCk7XG4gICAgICovXG4gICAgcmVzZXQgKCkge1xuICAgICAgICB0aGlzLl9wb2ludHMubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5fYXNzZW1ibGVyICYmIHRoaXMuX2Fzc2VtYmxlci5fcmVuZGVyRGF0YS5jbGVhcigpO1xuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICBjYy5lbmdpbmUucmVwYWludEluRWRpdE1vZGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBsYXRlVXBkYXRlIChkdCkge1xuICAgICAgICB0aGlzLl9hc3NlbWJsZXIgJiYgdGhpcy5fYXNzZW1ibGVyLnVwZGF0ZSh0aGlzLCBkdCk7XG4gICAgfVxufSk7XG5cbmNjLk1vdGlvblN0cmVhayA9IG1vZHVsZS5leHBvcnRzID0gTW90aW9uU3RyZWFrO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=