
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/SubContextView.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
var Component = require('./CCComponent');
/**
 * !#en SubContextView is a view component which controls open data context viewport in minigame platform.<br/>
 * The component's node size decide the viewport of the sub context content in main context, 
 * the entire sub context texture will be scaled to the node's bounding box area.<br/>
 * This component provides multiple important features:<br/>
 * 1. Sub context could use its own resolution size and policy.<br/>
 * 2. Sub context could be minized to smallest size it needed.<br/>
 * 3. Resolution of sub context content could be increased.<br/>
 * 4. User touch input is transformed to the correct viewport.<br/>
 * 5. Texture update is handled by this component. User don't need to worry.<br/>
 * One important thing to be noted, whenever the node's bounding box change, 
 * !#zh SubContextView 可以用来控制小游戏平台开放数据域在主域中的视窗的位置。<br/>
 * 这个组件的节点尺寸决定了开放数据域内容在主域中的尺寸，整个开放数据域会被缩放到节点的包围盒范围内。<br/>
 * 在这个组件的控制下，用户可以更自由得控制开放数据域：<br/>
 * 1. 子域中可以使用独立的设计分辨率和适配模式<br/>
 * 2. 子域区域尺寸可以缩小到只容纳内容即可<br/>
 * 3. 子域的分辨率也可以被放大，以便获得更清晰的显示效果<br/>
 * 4. 用户输入坐标会被自动转换到正确的子域视窗中<br/>
 * 5. 子域内容贴图的更新由组件负责，用户不需要处理<br/>
 * @class SubContextView
 * @extends Component
 */


var SubContextView = cc.Class({
  name: 'cc.SubContextView',
  "extends": Component,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.others/SubContextView',
    help: 'i18n:COMPONENT.help_url.subcontext_view'
  },
  properties: {
    _firstlyEnabled: true,
    _fps: 60,
    fps: {
      get: function get() {
        return this._fps;
      },
      set: function set(value) {
        if (this._fps === value) {
          return;
        }

        this._fps = value;
        this._updateInterval = 1 / value;

        this._updateSubContextFrameRate();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.subcontext_view.fps'
    }
  },
  ctor: function ctor() {
    this._sprite = null;
    this._tex = new cc.Texture2D();
    this._context = null;
    this._updatedTime = performance.now();
    this._updateInterval = 0;
  },
  onLoad: function onLoad() {
    // Setup subcontext canvas size
    if (window.__globalAdapter && __globalAdapter.getOpenDataContext) {
      this._updateInterval = 1000 / this._fps;
      this._context = __globalAdapter.getOpenDataContext();
      this.reset();
      var sharedCanvas = this._context.canvas;

      this._tex.setPremultiplyAlpha(true);

      this._tex.initWithElement(sharedCanvas);

      this._sprite = this.node.getComponent(cc.Sprite);

      if (!this._sprite) {
        this._sprite = this.node.addComponent(cc.Sprite);
        this._sprite.srcBlendFactor = cc.macro.BlendFactor.ONE;
      }

      this._sprite.spriteFrame = new cc.SpriteFrame(this._tex);
    } else {
      this.enabled = false;
    }
  },

  /**
   * !#en Reset open data context size and viewport
   * !#zh 重置开放数据域的尺寸和视窗
   * @method reset
   */
  reset: function reset() {
    if (this._context) {
      this.updateSubContextViewport();
      var sharedCanvas = this._context.canvas;

      if (sharedCanvas) {
        sharedCanvas.width = this.node.width;
        sharedCanvas.height = this.node.height;
      }
    }
  },
  onEnable: function onEnable() {
    if (this._firstlyEnabled && this._context) {
      this._context.postMessage({
        fromEngine: true,
        event: 'boot'
      });

      this._firstlyEnabled = false;
    } else {
      this._runSubContextMainLoop();
    }

    this._registerNodeEvent();

    this._updateSubContextFrameRate();

    this.updateSubContextViewport();
  },
  onDisable: function onDisable() {
    this._unregisterNodeEvent();

    this._stopSubContextMainLoop();
  },
  update: function update(dt) {
    var calledUpdateMannually = dt === undefined;

    if (calledUpdateMannually) {
      this._context && this._context.postMessage({
        fromEngine: true,
        event: 'step'
      });

      this._updateSubContextTexture();

      return;
    }

    var now = performance.now();
    var deltaTime = now - this._updatedTime;

    if (deltaTime >= this._updateInterval) {
      this._updatedTime += this._updateInterval;

      this._updateSubContextTexture();
    }
  },
  _updateSubContextTexture: function _updateSubContextTexture() {
    if (!this._tex || !this._context) {
      return;
    }

    this._tex.initWithElement(this._context.canvas);

    this._sprite._activateMaterial();
  },

  /**
   * !#en Update the sub context viewport manually, it should be called whenever the node's bounding box changes.
   * !#zh 更新开放数据域相对于主域的 viewport，这个函数应该在节点包围盒改变时手动调用。
   * @method updateSubContextViewport
   */
  updateSubContextViewport: function updateSubContextViewport() {
    if (this._context) {
      var box = this.node.getBoundingBoxToWorld();
      var sx = cc.view._scaleX;
      var sy = cc.view._scaleY;

      this._context.postMessage({
        fromEngine: true,
        event: 'viewport',
        x: box.x * sx + cc.view._viewportRect.x,
        y: box.y * sy + cc.view._viewportRect.y,
        width: box.width * sx,
        height: box.height * sy
      });
    }
  },
  _registerNodeEvent: function _registerNodeEvent() {
    this.node.on('position-changed', this.updateSubContextViewport, this);
    this.node.on('scale-changed', this.updateSubContextViewport, this);
    this.node.on('size-changed', this.updateSubContextViewport, this);
  },
  _unregisterNodeEvent: function _unregisterNodeEvent() {
    this.node.off('position-changed', this.updateSubContextViewport, this);
    this.node.off('scale-changed', this.updateSubContextViewport, this);
    this.node.off('size-changed', this.updateSubContextViewport, this);
  },
  _runSubContextMainLoop: function _runSubContextMainLoop() {
    if (this._context) {
      this._context.postMessage({
        fromEngine: true,
        event: 'mainLoop',
        value: true
      });
    }
  },
  _stopSubContextMainLoop: function _stopSubContextMainLoop() {
    if (this._context) {
      this._context.postMessage({
        fromEngine: true,
        event: 'mainLoop',
        value: false
      });
    }
  },
  _updateSubContextFrameRate: function _updateSubContextFrameRate() {
    if (this._context) {
      this._context.postMessage({
        fromEngine: true,
        event: 'frameRate',
        value: this._fps
      });
    }
  }
});
cc.SubContextView = module.exports = SubContextView;
/**
 * !#en WXSubContextView is deprecated since v2.4.1, please use SubContextView instead.
 * !#zh 自 v2.4.1 起，WXSubContextView 已经废弃，请使用 SubContextView
 * @class WXSubContextView
 * @extends Component
 * @deprecated since v2.4.1
 */

cc.WXSubContextView = SubContextView;
/**
 * !#en SwanSubContextView is deprecated since v2.4.1, please use SubContextView instead.
 * !#zh 自 v2.4.1 起，SwanSubContextView 已经废弃，请使用 SubContextView
 * @class SwanSubContextView
 * @extends Component
 * @deprecated since v2.4.1
 */

cc.SwanSubContextView = SubContextView;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvU3ViQ29udGV4dFZpZXcuanMiXSwibmFtZXMiOlsiQ29tcG9uZW50IiwicmVxdWlyZSIsIlN1YkNvbnRleHRWaWV3IiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJlZGl0b3IiLCJDQ19FRElUT1IiLCJtZW51IiwiaGVscCIsInByb3BlcnRpZXMiLCJfZmlyc3RseUVuYWJsZWQiLCJfZnBzIiwiZnBzIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJfdXBkYXRlSW50ZXJ2YWwiLCJfdXBkYXRlU3ViQ29udGV4dEZyYW1lUmF0ZSIsInRvb2x0aXAiLCJDQ19ERVYiLCJjdG9yIiwiX3Nwcml0ZSIsIl90ZXgiLCJUZXh0dXJlMkQiLCJfY29udGV4dCIsIl91cGRhdGVkVGltZSIsInBlcmZvcm1hbmNlIiwibm93Iiwib25Mb2FkIiwid2luZG93IiwiX19nbG9iYWxBZGFwdGVyIiwiZ2V0T3BlbkRhdGFDb250ZXh0IiwicmVzZXQiLCJzaGFyZWRDYW52YXMiLCJjYW52YXMiLCJzZXRQcmVtdWx0aXBseUFscGhhIiwiaW5pdFdpdGhFbGVtZW50Iiwibm9kZSIsImdldENvbXBvbmVudCIsIlNwcml0ZSIsImFkZENvbXBvbmVudCIsInNyY0JsZW5kRmFjdG9yIiwibWFjcm8iLCJCbGVuZEZhY3RvciIsIk9ORSIsInNwcml0ZUZyYW1lIiwiU3ByaXRlRnJhbWUiLCJlbmFibGVkIiwidXBkYXRlU3ViQ29udGV4dFZpZXdwb3J0Iiwid2lkdGgiLCJoZWlnaHQiLCJvbkVuYWJsZSIsInBvc3RNZXNzYWdlIiwiZnJvbUVuZ2luZSIsImV2ZW50IiwiX3J1blN1YkNvbnRleHRNYWluTG9vcCIsIl9yZWdpc3Rlck5vZGVFdmVudCIsIm9uRGlzYWJsZSIsIl91bnJlZ2lzdGVyTm9kZUV2ZW50IiwiX3N0b3BTdWJDb250ZXh0TWFpbkxvb3AiLCJ1cGRhdGUiLCJkdCIsImNhbGxlZFVwZGF0ZU1hbm51YWxseSIsInVuZGVmaW5lZCIsIl91cGRhdGVTdWJDb250ZXh0VGV4dHVyZSIsImRlbHRhVGltZSIsIl9hY3RpdmF0ZU1hdGVyaWFsIiwiYm94IiwiZ2V0Qm91bmRpbmdCb3hUb1dvcmxkIiwic3giLCJ2aWV3IiwiX3NjYWxlWCIsInN5IiwiX3NjYWxlWSIsIngiLCJfdmlld3BvcnRSZWN0IiwieSIsIm9uIiwib2ZmIiwibW9kdWxlIiwiZXhwb3J0cyIsIldYU3ViQ29udGV4dFZpZXciLCJTd2FuU3ViQ29udGV4dFZpZXciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxTQUFTLEdBQUdDLE9BQU8sQ0FBQyxlQUFELENBQXpCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQUlDLGNBQWMsR0FBR0MsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDMUJDLEVBQUFBLElBQUksRUFBRSxtQkFEb0I7QUFFMUIsYUFBU0wsU0FGaUI7QUFJMUJNLEVBQUFBLE1BQU0sRUFBRUMsU0FBUyxJQUFJO0FBQ2pCQyxJQUFBQSxJQUFJLEVBQUUsZ0RBRFc7QUFFakJDLElBQUFBLElBQUksRUFBRTtBQUZXLEdBSks7QUFTMUJDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxlQUFlLEVBQUUsSUFEVDtBQUdSQyxJQUFBQSxJQUFJLEVBQUUsRUFIRTtBQUtSQyxJQUFBQSxHQUFHLEVBQUU7QUFDREMsTUFBQUEsR0FEQyxpQkFDTTtBQUNILGVBQU8sS0FBS0YsSUFBWjtBQUNILE9BSEE7QUFJREcsTUFBQUEsR0FKQyxlQUlJQyxLQUpKLEVBSVc7QUFDUixZ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Ii8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDIwIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9DQ0NvbXBvbmVudCcpO1xuXG4vKipcbiAqICEjZW4gU3ViQ29udGV4dFZpZXcgaXMgYSB2aWV3IGNvbXBvbmVudCB3aGljaCBjb250cm9scyBvcGVuIGRhdGEgY29udGV4dCB2aWV3cG9ydCBpbiBtaW5pZ2FtZSBwbGF0Zm9ybS48YnIvPlxuICogVGhlIGNvbXBvbmVudCdzIG5vZGUgc2l6ZSBkZWNpZGUgdGhlIHZpZXdwb3J0IG9mIHRoZSBzdWIgY29udGV4dCBjb250ZW50IGluIG1haW4gY29udGV4dCwgXG4gKiB0aGUgZW50aXJlIHN1YiBjb250ZXh0IHRleHR1cmUgd2lsbCBiZSBzY2FsZWQgdG8gdGhlIG5vZGUncyBib3VuZGluZyBib3ggYXJlYS48YnIvPlxuICogVGhpcyBjb21wb25lbnQgcHJvdmlkZXMgbXVsdGlwbGUgaW1wb3J0YW50IGZlYXR1cmVzOjxici8+XG4gKiAxLiBTdWIgY29udGV4dCBjb3VsZCB1c2UgaXRzIG93biByZXNvbHV0aW9uIHNpemUgYW5kIHBvbGljeS48YnIvPlxuICogMi4gU3ViIGNvbnRleHQgY291bGQgYmUgbWluaXplZCB0byBzbWFsbGVzdCBzaXplIGl0IG5lZWRlZC48YnIvPlxuICogMy4gUmVzb2x1dGlvbiBvZiBzdWIgY29udGV4dCBjb250ZW50IGNvdWxkIGJlIGluY3JlYXNlZC48YnIvPlxuICogNC4gVXNlciB0b3VjaCBpbnB1dCBpcyB0cmFuc2Zvcm1lZCB0byB0aGUgY29ycmVjdCB2aWV3cG9ydC48YnIvPlxuICogNS4gVGV4dHVyZSB1cGRhdGUgaXMgaGFuZGxlZCBieSB0aGlzIGNvbXBvbmVudC4gVXNlciBkb24ndCBuZWVkIHRvIHdvcnJ5Ljxici8+XG4gKiBPbmUgaW1wb3J0YW50IHRoaW5nIHRvIGJlIG5vdGVkLCB3aGVuZXZlciB0aGUgbm9kZSdzIGJvdW5kaW5nIGJveCBjaGFuZ2UsIFxuICogISN6aCBTdWJDb250ZXh0VmlldyDlj6/ku6XnlKjmnaXmjqfliLblsI/muLjmiI/lubPlj7DlvIDmlL7mlbDmja7ln5/lnKjkuLvln5/kuK3nmoTop4bnqpfnmoTkvY3nva7jgII8YnIvPlxuICog6L+Z5Liq57uE5Lu255qE6IqC54K55bC65a+45Yaz5a6a5LqG5byA5pS+5pWw5o2u5Z+f5YaF5a655Zyo5Li75Z+f5Lit55qE5bC65a+477yM5pW05Liq5byA5pS+5pWw5o2u5Z+f5Lya6KKr57yp5pS+5Yiw6IqC54K555qE5YyF5Zu055uS6IyD5Zu05YaF44CCPGJyLz5cbiAqIOWcqOi/meS4que7hOS7tueahOaOp+WItuS4i++8jOeUqOaIt+WPr+S7peabtOiHqueUseW+l+aOp+WItuW8gOaUvuaVsOaNruWfn++8mjxici8+XG4gKiAxLiDlrZDln5/kuK3lj6/ku6Xkvb/nlKjni6znq4vnmoTorr7orqHliIbovqjnjoflkozpgILphY3mqKHlvI88YnIvPlxuICogMi4g5a2Q5Z+f5Yy65Z+f5bC65a+45Y+v5Lul57yp5bCP5Yiw5Y+q5a6557qz5YaF5a655Y2z5Y+vPGJyLz5cbiAqIDMuIOWtkOWfn+eahOWIhui+qOeOh+S5n+WPr+S7peiiq+aUvuWkp++8jOS7peS+v+iOt+W+l+abtOa4heaZsOeahOaYvuekuuaViOaenDxici8+XG4gKiA0LiDnlKjmiLfovpPlhaXlnZDmoIfkvJrooqvoh6rliqjovazmjaLliLDmraPnoa7nmoTlrZDln5/op4bnqpfkuK08YnIvPlxuICogNS4g5a2Q5Z+f5YaF5a656LS05Zu+55qE5pu05paw55Sx57uE5Lu26LSf6LSj77yM55So5oi35LiN6ZyA6KaB5aSE55CGPGJyLz5cbiAqIEBjbGFzcyBTdWJDb250ZXh0Vmlld1xuICogQGV4dGVuZHMgQ29tcG9uZW50XG4gKi9cbmxldCBTdWJDb250ZXh0VmlldyA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuU3ViQ29udGV4dFZpZXcnLFxuICAgIGV4dGVuZHM6IENvbXBvbmVudCxcblxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5vdGhlcnMvU3ViQ29udGV4dFZpZXcnLFxuICAgICAgICBoZWxwOiAnaTE4bjpDT01QT05FTlQuaGVscF91cmwuc3ViY29udGV4dF92aWV3JyxcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBfZmlyc3RseUVuYWJsZWQ6IHRydWUsXG4gICAgICAgIFxuICAgICAgICBfZnBzOiA2MCxcblxuICAgICAgICBmcHM6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZwcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2ZwcyA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9mcHMgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVJbnRlcnZhbCA9IDEgLyB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVTdWJDb250ZXh0RnJhbWVSYXRlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zdWJjb250ZXh0X3ZpZXcuZnBzJ1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGN0b3IgKCkge1xuICAgICAgICB0aGlzLl9zcHJpdGUgPSBudWxsO1xuICAgICAgICB0aGlzLl90ZXggPSBuZXcgY2MuVGV4dHVyZTJEKCk7XG4gICAgICAgIHRoaXMuX2NvbnRleHQgPSBudWxsO1xuICAgICAgICB0aGlzLl91cGRhdGVkVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICB0aGlzLl91cGRhdGVJbnRlcnZhbCA9IDA7XG4gICAgfSxcblxuICAgIG9uTG9hZCAoKSB7XG4gICAgICAgIC8vIFNldHVwIHN1YmNvbnRleHQgY2FudmFzIHNpemVcbiAgICAgICAgaWYgKHdpbmRvdy5fX2dsb2JhbEFkYXB0ZXIgJiYgX19nbG9iYWxBZGFwdGVyLmdldE9wZW5EYXRhQ29udGV4dCkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlSW50ZXJ2YWwgPSAxMDAwIC8gdGhpcy5fZnBzO1xuICAgICAgICAgICAgdGhpcy5fY29udGV4dCA9IF9fZ2xvYmFsQWRhcHRlci5nZXRPcGVuRGF0YUNvbnRleHQoKTtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgIGxldCBzaGFyZWRDYW52YXMgPSB0aGlzLl9jb250ZXh0LmNhbnZhcztcbiAgICAgICAgICAgIHRoaXMuX3RleC5zZXRQcmVtdWx0aXBseUFscGhhKHRydWUpO1xuICAgICAgICAgICAgdGhpcy5fdGV4LmluaXRXaXRoRWxlbWVudChzaGFyZWRDYW52YXMpO1xuXG4gICAgICAgICAgICB0aGlzLl9zcHJpdGUgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3Nwcml0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Nwcml0ZSA9IHRoaXMubm9kZS5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zcHJpdGUuc3JjQmxlbmRGYWN0b3IgPSBjYy5tYWNyby5CbGVuZEZhY3Rvci5PTkU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9zcHJpdGUuc3ByaXRlRnJhbWUgPSBuZXcgY2MuU3ByaXRlRnJhbWUodGhpcy5fdGV4KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmVzZXQgb3BlbiBkYXRhIGNvbnRleHQgc2l6ZSBhbmQgdmlld3BvcnRcbiAgICAgKiAhI3poIOmHjee9ruW8gOaUvuaVsOaNruWfn+eahOWwuuWvuOWSjOinhueql1xuICAgICAqIEBtZXRob2QgcmVzZXRcbiAgICAgKi9cbiAgICByZXNldCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jb250ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVN1YkNvbnRleHRWaWV3cG9ydCgpO1xuICAgICAgICAgICAgbGV0IHNoYXJlZENhbnZhcyA9IHRoaXMuX2NvbnRleHQuY2FudmFzO1xuICAgICAgICAgICAgaWYgKHNoYXJlZENhbnZhcykge1xuICAgICAgICAgICAgICAgIHNoYXJlZENhbnZhcy53aWR0aCA9IHRoaXMubm9kZS53aWR0aDtcbiAgICAgICAgICAgICAgICBzaGFyZWRDYW52YXMuaGVpZ2h0ID0gdGhpcy5ub2RlLmhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkVuYWJsZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9maXJzdGx5RW5hYmxlZCAmJiB0aGlzLl9jb250ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLl9jb250ZXh0LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBmcm9tRW5naW5lOiB0cnVlLFxuICAgICAgICAgICAgICAgIGV2ZW50OiAnYm9vdCcsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZpcnN0bHlFbmFibGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9ydW5TdWJDb250ZXh0TWFpbkxvb3AoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9yZWdpc3Rlck5vZGVFdmVudCgpO1xuICAgICAgICB0aGlzLl91cGRhdGVTdWJDb250ZXh0RnJhbWVSYXRlKCk7XG4gICAgICAgIHRoaXMudXBkYXRlU3ViQ29udGV4dFZpZXdwb3J0KCk7XG4gICAgfSxcblxuICAgIG9uRGlzYWJsZSAoKSB7XG4gICAgICAgIHRoaXMuX3VucmVnaXN0ZXJOb2RlRXZlbnQoKTtcbiAgICAgICAgdGhpcy5fc3RvcFN1YkNvbnRleHRNYWluTG9vcCgpO1xuICAgIH0sXG5cbiAgICB1cGRhdGUgKGR0KSB7XG4gICAgICAgIGxldCBjYWxsZWRVcGRhdGVNYW5udWFsbHkgPSAoZHQgPT09IHVuZGVmaW5lZCk7XG4gICAgICAgIGlmIChjYWxsZWRVcGRhdGVNYW5udWFsbHkpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRleHQgJiYgdGhpcy5fY29udGV4dC5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgZnJvbUVuZ2luZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBldmVudDogJ3N0ZXAnLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVTdWJDb250ZXh0VGV4dHVyZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgbGV0IGRlbHRhVGltZSA9IChub3cgLSB0aGlzLl91cGRhdGVkVGltZSk7XG4gICAgICAgIGlmIChkZWx0YVRpbWUgPj0gdGhpcy5fdXBkYXRlSW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZWRUaW1lICs9IHRoaXMuX3VwZGF0ZUludGVydmFsO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlU3ViQ29udGV4dFRleHR1cmUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXBkYXRlU3ViQ29udGV4dFRleHR1cmUgKCkge1xuICAgICAgICBpZiAoIXRoaXMuX3RleCB8fCAhdGhpcy5fY29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3RleC5pbml0V2l0aEVsZW1lbnQodGhpcy5fY29udGV4dC5jYW52YXMpO1xuICAgICAgICB0aGlzLl9zcHJpdGUuX2FjdGl2YXRlTWF0ZXJpYWwoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBVcGRhdGUgdGhlIHN1YiBjb250ZXh0IHZpZXdwb3J0IG1hbnVhbGx5LCBpdCBzaG91bGQgYmUgY2FsbGVkIHdoZW5ldmVyIHRoZSBub2RlJ3MgYm91bmRpbmcgYm94IGNoYW5nZXMuXG4gICAgICogISN6aCDmm7TmlrDlvIDmlL7mlbDmja7ln5/nm7jlr7nkuo7kuLvln5/nmoQgdmlld3BvcnTvvIzov5nkuKrlh73mlbDlupTor6XlnKjoioLngrnljIXlm7Tnm5LmlLnlj5jml7bmiYvliqjosIPnlKjjgIJcbiAgICAgKiBAbWV0aG9kIHVwZGF0ZVN1YkNvbnRleHRWaWV3cG9ydFxuICAgICAqL1xuICAgIHVwZGF0ZVN1YkNvbnRleHRWaWV3cG9ydCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jb250ZXh0KSB7XG4gICAgICAgICAgICBsZXQgYm94ID0gdGhpcy5ub2RlLmdldEJvdW5kaW5nQm94VG9Xb3JsZCgpO1xuICAgICAgICAgICAgbGV0IHN4ID0gY2Mudmlldy5fc2NhbGVYO1xuICAgICAgICAgICAgbGV0IHN5ID0gY2Mudmlldy5fc2NhbGVZO1xuICAgICAgICAgICAgdGhpcy5fY29udGV4dC5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgZnJvbUVuZ2luZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBldmVudDogJ3ZpZXdwb3J0JyxcbiAgICAgICAgICAgICAgICB4OiBib3gueCAqIHN4ICsgY2Mudmlldy5fdmlld3BvcnRSZWN0LngsXG4gICAgICAgICAgICAgICAgeTogYm94LnkgKiBzeSArIGNjLnZpZXcuX3ZpZXdwb3J0UmVjdC55LFxuICAgICAgICAgICAgICAgIHdpZHRoOiBib3gud2lkdGggKiBzeCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGJveC5oZWlnaHQgKiBzeVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3JlZ2lzdGVyTm9kZUV2ZW50ICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdwb3NpdGlvbi1jaGFuZ2VkJywgdGhpcy51cGRhdGVTdWJDb250ZXh0Vmlld3BvcnQsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oJ3NjYWxlLWNoYW5nZWQnLCB0aGlzLnVwZGF0ZVN1YkNvbnRleHRWaWV3cG9ydCwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vbignc2l6ZS1jaGFuZ2VkJywgdGhpcy51cGRhdGVTdWJDb250ZXh0Vmlld3BvcnQsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfdW5yZWdpc3Rlck5vZGVFdmVudCAoKSB7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoJ3Bvc2l0aW9uLWNoYW5nZWQnLCB0aGlzLnVwZGF0ZVN1YkNvbnRleHRWaWV3cG9ydCwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoJ3NjYWxlLWNoYW5nZWQnLCB0aGlzLnVwZGF0ZVN1YkNvbnRleHRWaWV3cG9ydCwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoJ3NpemUtY2hhbmdlZCcsIHRoaXMudXBkYXRlU3ViQ29udGV4dFZpZXdwb3J0LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX3J1blN1YkNvbnRleHRNYWluTG9vcCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jb250ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLl9jb250ZXh0LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBmcm9tRW5naW5lOiB0cnVlLFxuICAgICAgICAgICAgICAgIGV2ZW50OiAnbWFpbkxvb3AnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3N0b3BTdWJDb250ZXh0TWFpbkxvb3AgKCkge1xuICAgICAgICBpZiAodGhpcy5fY29udGV4dCkge1xuICAgICAgICAgICAgdGhpcy5fY29udGV4dC5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgZnJvbUVuZ2luZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBldmVudDogJ21haW5Mb29wJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogZmFsc2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXBkYXRlU3ViQ29udGV4dEZyYW1lUmF0ZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jb250ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLl9jb250ZXh0LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBmcm9tRW5naW5lOiB0cnVlLFxuICAgICAgICAgICAgICAgIGV2ZW50OiAnZnJhbWVSYXRlJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5fZnBzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxufSk7XG5cbmNjLlN1YkNvbnRleHRWaWV3ID0gbW9kdWxlLmV4cG9ydHMgPSBTdWJDb250ZXh0VmlldztcblxuLyoqXG4gKiAhI2VuIFdYU3ViQ29udGV4dFZpZXcgaXMgZGVwcmVjYXRlZCBzaW5jZSB2Mi40LjEsIHBsZWFzZSB1c2UgU3ViQ29udGV4dFZpZXcgaW5zdGVhZC5cbiAqICEjemgg6IeqIHYyLjQuMSDotbfvvIxXWFN1YkNvbnRleHRWaWV3IOW3sue7j+W6n+W8g++8jOivt+S9v+eUqCBTdWJDb250ZXh0Vmlld1xuICogQGNsYXNzIFdYU3ViQ29udGV4dFZpZXdcbiAqIEBleHRlbmRzIENvbXBvbmVudFxuICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuNC4xXG4gKi9cbmNjLldYU3ViQ29udGV4dFZpZXcgPSBTdWJDb250ZXh0VmlldztcblxuLyoqXG4gKiAhI2VuIFN3YW5TdWJDb250ZXh0VmlldyBpcyBkZXByZWNhdGVkIHNpbmNlIHYyLjQuMSwgcGxlYXNlIHVzZSBTdWJDb250ZXh0VmlldyBpbnN0ZWFkLlxuICogISN6aCDoh6ogdjIuNC4xIOi1t++8jFN3YW5TdWJDb250ZXh0VmlldyDlt7Lnu4/lup/lvIPvvIzor7fkvb/nlKggU3ViQ29udGV4dFZpZXdcbiAqIEBjbGFzcyBTd2FuU3ViQ29udGV4dFZpZXdcbiAqIEBleHRlbmRzIENvbXBvbmVudFxuICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuNC4xXG4gKi9cbmNjLlN3YW5TdWJDb250ZXh0VmlldyA9IFN1YkNvbnRleHRWaWV3OyJdLCJzb3VyY2VSb290IjoiLyJ9