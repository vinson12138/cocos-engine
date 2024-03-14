
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/index.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _gfx = _interopRequireDefault(require("../../renderer/gfx"));

var _inputAssembler = _interopRequireDefault(require("../../renderer/core/input-assembler"));

var _pass = _interopRequireDefault(require("../../renderer/core/pass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
// const RenderFlow = require('./render-flow');
function _initBuiltins(device) {
  var defaultTexture = new _gfx["default"].Texture2D(device, {
    images: [],
    width: 128,
    height: 128,
    wrapS: _gfx["default"].WRAP_REPEAT,
    wrapT: _gfx["default"].WRAP_REPEAT,
    format: _gfx["default"].TEXTURE_FMT_RGB8,
    genMipmaps: false
  });
  return {
    defaultTexture: defaultTexture,
    programTemplates: [],
    programChunks: {}
  };
}
/**
 * @module cc
 */

/**
 * !#en The renderer object which provide access to render system APIs, 
 * detailed APIs will be available progressively.
 * !#zh 提供基础渲染接口的渲染器对象，渲染层的基础接口将逐步开放给用户
 * @class renderer
 * @static
 */


var _default = cc.renderer = {
  Texture2D: null,
  InputAssembler: _inputAssembler["default"],
  Pass: _pass["default"],

  /**
   * !#en The render engine is available only after cc.game.EVENT_ENGINE_INITED event.<br/>
   * Normally it will be inited as the webgl render engine, but in wechat open context domain,
   * it will be inited as the canvas render engine. Canvas render engine is no longer available for other use case since v2.0.
   * !#zh 基础渲染引擎对象只在 cc.game.EVENT_ENGINE_INITED 事件触发后才可获取。<br/>
   * 大多数情况下，它都会是 WebGL 渲染引擎实例，但是在微信开放数据域当中，它会是 Canvas 渲染引擎实例。请注意，从 2.0 开始，我们在其他平台和环境下都废弃了 Canvas 渲染器。
   * @property renderEngine
   * @deprecated
   * @type {Object}
   */
  renderEngine: null,

  /*
   * !#en The canvas object which provides the rendering context
   * !#zh 用于渲染的 Canvas 对象
   * @property canvas
   * @type {HTMLCanvasElement}
   */
  canvas: null,

  /*
   * !#en The device object which provides device related rendering functionality, it divers for different render engine type.
   * !#zh 提供设备渲染能力的对象，它对于不同的渲染环境功能也不相同。
   * @property device
   * @type {renderer.Device}
   */
  device: null,
  scene: null,

  /**
   * !#en The total draw call count in last rendered frame.
   * !#zh 上一次渲染帧所提交的渲染批次总数。
   * @property drawCalls
   * @type {Number}
   */
  drawCalls: 0,
  // Render component handler
  _handle: null,
  _cameraNode: null,
  _camera: null,
  _forward: null,
  _flow: null,
  initWebGL: function initWebGL(canvas, opts) {
    require('./webgl/assemblers');

    var ModelBatcher = require('./webgl/model-batcher');

    this.Texture2D = _gfx["default"].Texture2D;
    this.canvas = canvas;
    this._flow = cc.RenderFlow;

    if (CC_JSB && CC_NATIVERENDERER) {
      // native codes will create an instance of Device, so just use the global instance.
      this.device = _gfx["default"].Device.getInstance();
      this.scene = new renderer.Scene();

      var builtins = _initBuiltins(this.device);

      this._forward = new renderer.ForwardRenderer(this.device, builtins);
      var nativeFlow = new renderer.RenderFlow(this.device, this.scene, this._forward);

      this._flow.init(nativeFlow);
    } else {
      var Scene = require('../../renderer/scene/scene');

      var ForwardRenderer = require('../../renderer/renderers/forward-renderer');

      this.device = new _gfx["default"].Device(canvas, opts);
      this.scene = new Scene();

      var _builtins = _initBuiltins(this.device);

      this._forward = new ForwardRenderer(this.device, _builtins);
      this._handle = new ModelBatcher(this.device, this.scene);

      this._flow.init(this._handle, this._forward);
    }
  },
  initCanvas: function initCanvas(canvas) {
    var canvasRenderer = require('./canvas');

    var Texture2D = require('./canvas/Texture2D');

    var Device = require('./canvas/Device'); // It's actually running with original render engine


    this.Device = Device;
    this.Texture2D = Texture2D;
    this.canvas = canvas;
    this.device = new Device(canvas);
    this._camera = {
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      tx: 0,
      ty: 0
    };
    this._handle = new canvasRenderer.RenderComponentHandle(this.device, this._camera);
    this._forward = new canvasRenderer.ForwardRenderer();
    this._flow = cc.RenderFlow;

    this._flow.init(this._handle, this._forward);
  },
  updateCameraViewport: function updateCameraViewport() {
    // TODO: remove HACK
    if (!CC_EDITOR && cc.director) {
      var ecScene = cc.director.getScene();
      if (ecScene) ecScene.setScale(1, 1, 1);
    }

    if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
      var vp = cc.view.getViewportRect();
      this.device.setViewport(vp.x, vp.y, vp.width, vp.height);
      this._camera.a = cc.view.getScaleX();
      this._camera.d = cc.view.getScaleY();
      this._camera.tx = vp.x;
      this._camera.ty = vp.y + vp.height;
    }
  },
  render: function render(ecScene, dt) {
    this.device.resetDrawCalls();

    if (ecScene) {
      // walk entity component scene to generate models
      this._flow.render(ecScene, dt);

      this.drawCalls = this.device.getDrawCalls();
    }
  },
  clear: function clear() {
    this._handle.reset();

    this._forward.clear();
  }
};

exports["default"] = _default;
module.exports = exports["default"];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL2luZGV4LmpzIl0sIm5hbWVzIjpbIl9pbml0QnVpbHRpbnMiLCJkZXZpY2UiLCJkZWZhdWx0VGV4dHVyZSIsImdmeCIsIlRleHR1cmUyRCIsImltYWdlcyIsIndpZHRoIiwiaGVpZ2h0Iiwid3JhcFMiLCJXUkFQX1JFUEVBVCIsIndyYXBUIiwiZm9ybWF0IiwiVEVYVFVSRV9GTVRfUkdCOCIsImdlbk1pcG1hcHMiLCJwcm9ncmFtVGVtcGxhdGVzIiwicHJvZ3JhbUNodW5rcyIsImNjIiwicmVuZGVyZXIiLCJJbnB1dEFzc2VtYmxlciIsIlBhc3MiLCJyZW5kZXJFbmdpbmUiLCJjYW52YXMiLCJzY2VuZSIsImRyYXdDYWxscyIsIl9oYW5kbGUiLCJfY2FtZXJhTm9kZSIsIl9jYW1lcmEiLCJfZm9yd2FyZCIsIl9mbG93IiwiaW5pdFdlYkdMIiwib3B0cyIsInJlcXVpcmUiLCJNb2RlbEJhdGNoZXIiLCJSZW5kZXJGbG93IiwiQ0NfSlNCIiwiQ0NfTkFUSVZFUkVOREVSRVIiLCJEZXZpY2UiLCJnZXRJbnN0YW5jZSIsIlNjZW5lIiwiYnVpbHRpbnMiLCJGb3J3YXJkUmVuZGVyZXIiLCJuYXRpdmVGbG93IiwiaW5pdCIsImluaXRDYW52YXMiLCJjYW52YXNSZW5kZXJlciIsImEiLCJiIiwiYyIsImQiLCJ0eCIsInR5IiwiUmVuZGVyQ29tcG9uZW50SGFuZGxlIiwidXBkYXRlQ2FtZXJhVmlld3BvcnQiLCJDQ19FRElUT1IiLCJkaXJlY3RvciIsImVjU2NlbmUiLCJnZXRTY2VuZSIsInNldFNjYWxlIiwiZ2FtZSIsInJlbmRlclR5cGUiLCJSRU5ERVJfVFlQRV9DQU5WQVMiLCJ2cCIsInZpZXciLCJnZXRWaWV3cG9ydFJlY3QiLCJzZXRWaWV3cG9ydCIsIngiLCJ5IiwiZ2V0U2NhbGVYIiwiZ2V0U2NhbGVZIiwicmVuZGVyIiwiZHQiLCJyZXNldERyYXdDYWxscyIsImdldERyYXdDYWxscyIsImNsZWFy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QUNJLENBQTNCLEVBQThCSixFQUFFLENBQUNLLENBQWpDLEVBQW9DTCxFQUFFLENBQUN2RCxLQUF2QyxFQUE4Q3VELEVBQUUsQ0FBQ3RELE1BQWpEO0FBQ0EsV0FBS21CLE9BQUwsQ0FBYW1CLENBQWIsR0FBaUI3QixFQUFFLENBQUM4QyxJQUFILENBQVFLLFNBQVIsRUFBakI7QUFDQSxXQUFLekMsT0FBTCxDQUFhc0IsQ0FBYixHQUFpQmhDLEVBQUUsQ0FBQzhDLElBQUgsQ0FBUU0sU0FBUixFQUFqQjtBQUNBLFdBQUsxQyxPQUFMLENBQWF1QixFQUFiLEdBQWtCWSxFQUFFLENBQUNJLENBQXJCO0FBQ0EsV0FBS3ZDLE9BQUwsQ0FBYXdCLEVBQWIsR0FBa0JXLEVBQUUsQ0FBQ0ssQ0FBSCxHQUFPTCxFQUFFLENBQUN0RCxNQUE1QjtBQUNIO0FBQ0osR0FoSHdCO0FBa0h6QjhELEVBQUFBLE1BbEh5QixrQkFrSGpCZCxPQWxIaUIsRUFrSFJlLEVBbEhRLEVBa0hKO0FBQ2pCLFNBQUtyRSxNQUFMLENBQVlzRSxjQUFaOztBQUNBLFFBQUloQixPQUFKLEVBQWE7QUFDVDtBQUNBLFdBQUszQixLQUFMLENBQVd5QyxNQUFYLENBQWtCZCxPQUFsQixFQUEyQmUsRUFBM0I7O0FBQ0EsV0FBSy9DLFNBQUwsR0FBaUIsS0FBS3RCLE1BQUwsQ0FBWXVFLFlBQVosRUFBakI7QUFDSDtBQUNKLEdBekh3QjtBQTJIekJDLEVBQUFBLEtBM0h5QixtQkEySGhCO0FBQ0wsU0FBS2pELE9BQUwsQ0FBYWtELEtBQWI7O0FBQ0EsU0FBSy9DLFFBQUwsQ0FBYzhDLEtBQWQ7QUFDSDtBQTlId0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuaW1wb3J0IGdmeCBmcm9tICcuLi8uLi9yZW5kZXJlci9nZngnO1xuXG5pbXBvcnQgSW5wdXRBc3NlbWJsZXIgZnJvbSAnLi4vLi4vcmVuZGVyZXIvY29yZS9pbnB1dC1hc3NlbWJsZXInO1xuaW1wb3J0IFBhc3MgZnJvbSAnLi4vLi4vcmVuZGVyZXIvY29yZS9wYXNzJztcblxuLy8gY29uc3QgUmVuZGVyRmxvdyA9IHJlcXVpcmUoJy4vcmVuZGVyLWZsb3cnKTtcblxuZnVuY3Rpb24gX2luaXRCdWlsdGlucyhkZXZpY2UpIHtcbiAgICBsZXQgZGVmYXVsdFRleHR1cmUgPSBuZXcgZ2Z4LlRleHR1cmUyRChkZXZpY2UsIHtcbiAgICAgICAgaW1hZ2VzOiBbXSxcbiAgICAgICAgd2lkdGg6IDEyOCxcbiAgICAgICAgaGVpZ2h0OiAxMjgsXG4gICAgICAgIHdyYXBTOiBnZnguV1JBUF9SRVBFQVQsXG4gICAgICAgIHdyYXBUOiBnZnguV1JBUF9SRVBFQVQsXG4gICAgICAgIGZvcm1hdDogZ2Z4LlRFWFRVUkVfRk1UX1JHQjgsXG4gICAgICAgIGdlbk1pcG1hcHM6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVmYXVsdFRleHR1cmU6IGRlZmF1bHRUZXh0dXJlLFxuICAgICAgICBwcm9ncmFtVGVtcGxhdGVzOiBbXSxcbiAgICAgICAgcHJvZ3JhbUNodW5rczoge30sXG4gICAgfTtcbn1cblxuLyoqXG4gKiBAbW9kdWxlIGNjXG4gKi9cblxuLyoqXG4gKiAhI2VuIFRoZSByZW5kZXJlciBvYmplY3Qgd2hpY2ggcHJvdmlkZSBhY2Nlc3MgdG8gcmVuZGVyIHN5c3RlbSBBUElzLCBcbiAqIGRldGFpbGVkIEFQSXMgd2lsbCBiZSBhdmFpbGFibGUgcHJvZ3Jlc3NpdmVseS5cbiAqICEjemgg5o+Q5L6b5Z+656GA5riy5p+T5o6l5Y+j55qE5riy5p+T5Zmo5a+56LGh77yM5riy5p+T5bGC55qE5Z+656GA5o6l5Y+j5bCG6YCQ5q2l5byA5pS+57uZ55So5oi3XG4gKiBAY2xhc3MgcmVuZGVyZXJcbiAqIEBzdGF0aWNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2MucmVuZGVyZXIgPSB7XG4gICAgVGV4dHVyZTJEOiBudWxsLFxuXG4gICAgSW5wdXRBc3NlbWJsZXI6IElucHV0QXNzZW1ibGVyLFxuICAgIFBhc3M6IFBhc3MsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSByZW5kZXIgZW5naW5lIGlzIGF2YWlsYWJsZSBvbmx5IGFmdGVyIGNjLmdhbWUuRVZFTlRfRU5HSU5FX0lOSVRFRCBldmVudC48YnIvPlxuICAgICAqIE5vcm1hbGx5IGl0IHdpbGwgYmUgaW5pdGVkIGFzIHRoZSB3ZWJnbCByZW5kZXIgZW5naW5lLCBidXQgaW4gd2VjaGF0IG9wZW4gY29udGV4dCBkb21haW4sXG4gICAgICogaXQgd2lsbCBiZSBpbml0ZWQgYXMgdGhlIGNhbnZhcyByZW5kZXIgZW5naW5lLiBDYW52YXMgcmVuZGVyIGVuZ2luZSBpcyBubyBsb25nZXIgYXZhaWxhYmxlIGZvciBvdGhlciB1c2UgY2FzZSBzaW5jZSB2Mi4wLlxuICAgICAqICEjemgg5Z+656GA5riy5p+T5byV5pOO5a+56LGh5Y+q5ZyoIGNjLmdhbWUuRVZFTlRfRU5HSU5FX0lOSVRFRCDkuovku7bop6blj5HlkI7miY3lj6/ojrflj5bjgII8YnIvPlxuICAgICAqIOWkp+WkmuaVsOaDheWGteS4i++8jOWug+mDveS8muaYryBXZWJHTCDmuLLmn5PlvJXmk47lrp7kvovvvIzkvYbmmK/lnKjlvq7kv6HlvIDmlL7mlbDmja7ln5/lvZPkuK3vvIzlroPkvJrmmK8gQ2FudmFzIOa4suafk+W8leaTjuWunuS+i+OAguivt+azqOaEj++8jOS7jiAyLjAg5byA5aeL77yM5oiR5Lus5Zyo5YW25LuW5bmz5Y+w5ZKM546v5aKD5LiL6YO95bqf5byD5LqGIENhbnZhcyDmuLLmn5PlmajjgIJcbiAgICAgKiBAcHJvcGVydHkgcmVuZGVyRW5naW5lXG4gICAgICogQGRlcHJlY2F0ZWRcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHJlbmRlckVuZ2luZTogbnVsbCxcblxuICAgIC8qXG4gICAgICogISNlbiBUaGUgY2FudmFzIG9iamVjdCB3aGljaCBwcm92aWRlcyB0aGUgcmVuZGVyaW5nIGNvbnRleHRcbiAgICAgKiAhI3poIOeUqOS6jua4suafk+eahCBDYW52YXMg5a+56LGhXG4gICAgICogQHByb3BlcnR5IGNhbnZhc1xuICAgICAqIEB0eXBlIHtIVE1MQ2FudmFzRWxlbWVudH1cbiAgICAgKi9cbiAgICBjYW52YXM6IG51bGwsXG4gICAgLypcbiAgICAgKiAhI2VuIFRoZSBkZXZpY2Ugb2JqZWN0IHdoaWNoIHByb3ZpZGVzIGRldmljZSByZWxhdGVkIHJlbmRlcmluZyBmdW5jdGlvbmFsaXR5LCBpdCBkaXZlcnMgZm9yIGRpZmZlcmVudCByZW5kZXIgZW5naW5lIHR5cGUuXG4gICAgICogISN6aCDmj5Dkvpvorr7lpIfmuLLmn5Pog73lipvnmoTlr7nosaHvvIzlroPlr7nkuo7kuI3lkIznmoTmuLLmn5Pnjq/looPlip/og73kuZ/kuI3nm7jlkIzjgIJcbiAgICAgKiBAcHJvcGVydHkgZGV2aWNlXG4gICAgICogQHR5cGUge3JlbmRlcmVyLkRldmljZX1cbiAgICAgKi9cbiAgICBkZXZpY2U6IG51bGwsXG4gICAgc2NlbmU6IG51bGwsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgdG90YWwgZHJhdyBjYWxsIGNvdW50IGluIGxhc3QgcmVuZGVyZWQgZnJhbWUuXG4gICAgICogISN6aCDkuIrkuIDmrKHmuLLmn5PluKfmiYDmj5DkuqTnmoTmuLLmn5PmibnmrKHmgLvmlbDjgIJcbiAgICAgKiBAcHJvcGVydHkgZHJhd0NhbGxzXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBkcmF3Q2FsbHM6IDAsXG4gICAgLy8gUmVuZGVyIGNvbXBvbmVudCBoYW5kbGVyXG4gICAgX2hhbmRsZTogbnVsbCxcbiAgICBfY2FtZXJhTm9kZTogbnVsbCxcbiAgICBfY2FtZXJhOiBudWxsLFxuICAgIF9mb3J3YXJkOiBudWxsLFxuICAgIF9mbG93OiBudWxsLFxuXG4gICAgaW5pdFdlYkdMIChjYW52YXMsIG9wdHMpIHtcbiAgICAgICAgcmVxdWlyZSgnLi93ZWJnbC9hc3NlbWJsZXJzJyk7XG4gICAgICAgIGNvbnN0IE1vZGVsQmF0Y2hlciA9IHJlcXVpcmUoJy4vd2ViZ2wvbW9kZWwtYmF0Y2hlcicpO1xuXG4gICAgICAgIHRoaXMuVGV4dHVyZTJEID0gZ2Z4LlRleHR1cmUyRDtcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgICAgIHRoaXMuX2Zsb3cgPSBjYy5SZW5kZXJGbG93O1xuICAgICAgICBcbiAgICAgICAgaWYgKENDX0pTQiAmJiBDQ19OQVRJVkVSRU5ERVJFUikge1xuICAgICAgICAgICAgLy8gbmF0aXZlIGNvZGVzIHdpbGwgY3JlYXRlIGFuIGluc3RhbmNlIG9mIERldmljZSwgc28ganVzdCB1c2UgdGhlIGdsb2JhbCBpbnN0YW5jZS5cbiAgICAgICAgICAgIHRoaXMuZGV2aWNlID0gZ2Z4LkRldmljZS5nZXRJbnN0YW5jZSgpO1xuICAgICAgICAgICAgdGhpcy5zY2VuZSA9IG5ldyByZW5kZXJlci5TY2VuZSgpO1xuICAgICAgICAgICAgbGV0IGJ1aWx0aW5zID0gX2luaXRCdWlsdGlucyh0aGlzLmRldmljZSk7XG4gICAgICAgICAgICB0aGlzLl9mb3J3YXJkID0gbmV3IHJlbmRlcmVyLkZvcndhcmRSZW5kZXJlcih0aGlzLmRldmljZSwgYnVpbHRpbnMpO1xuICAgICAgICAgICAgbGV0IG5hdGl2ZUZsb3cgPSBuZXcgcmVuZGVyZXIuUmVuZGVyRmxvdyh0aGlzLmRldmljZSwgdGhpcy5zY2VuZSwgdGhpcy5fZm9yd2FyZCk7XG4gICAgICAgICAgICB0aGlzLl9mbG93LmluaXQobmF0aXZlRmxvdyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgU2NlbmUgPSByZXF1aXJlKCcuLi8uLi9yZW5kZXJlci9zY2VuZS9zY2VuZScpO1xuICAgICAgICAgICAgbGV0IEZvcndhcmRSZW5kZXJlciA9IHJlcXVpcmUoJy4uLy4uL3JlbmRlcmVyL3JlbmRlcmVycy9mb3J3YXJkLXJlbmRlcmVyJyk7XG4gICAgICAgICAgICB0aGlzLmRldmljZSA9IG5ldyBnZnguRGV2aWNlKGNhbnZhcywgb3B0cyk7XG4gICAgICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFNjZW5lKCk7XG4gICAgICAgICAgICBsZXQgYnVpbHRpbnMgPSBfaW5pdEJ1aWx0aW5zKHRoaXMuZGV2aWNlKTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcndhcmQgPSBuZXcgRm9yd2FyZFJlbmRlcmVyKHRoaXMuZGV2aWNlLCBidWlsdGlucyk7XG4gICAgICAgICAgICB0aGlzLl9oYW5kbGUgPSBuZXcgTW9kZWxCYXRjaGVyKHRoaXMuZGV2aWNlLCB0aGlzLnNjZW5lKTtcbiAgICAgICAgICAgIHRoaXMuX2Zsb3cuaW5pdCh0aGlzLl9oYW5kbGUsIHRoaXMuX2ZvcndhcmQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGluaXRDYW52YXMgKGNhbnZhcykge1xuICAgICAgICBjb25zdCBjYW52YXNSZW5kZXJlciA9IHJlcXVpcmUoJy4vY2FudmFzJyk7XG4gICAgICAgIGNvbnN0IFRleHR1cmUyRCA9IHJlcXVpcmUoJy4vY2FudmFzL1RleHR1cmUyRCcpO1xuICAgICAgICBjb25zdCBEZXZpY2UgPSByZXF1aXJlKCcuL2NhbnZhcy9EZXZpY2UnKTtcblxuICAgICAgICAvLyBJdCdzIGFjdHVhbGx5IHJ1bm5pbmcgd2l0aCBvcmlnaW5hbCByZW5kZXIgZW5naW5lXG4gICAgICAgIHRoaXMuRGV2aWNlID0gRGV2aWNlO1xuXG4gICAgICAgIHRoaXMuVGV4dHVyZTJEID0gVGV4dHVyZTJEO1xuXG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgICAgICB0aGlzLmRldmljZSA9IG5ldyBEZXZpY2UoY2FudmFzKTtcbiAgICAgICAgdGhpcy5fY2FtZXJhID0ge1xuICAgICAgICAgICAgYTogMSwgYjogMCwgYzogMCwgZDogMSwgdHg6IDAsIHR5OiAwXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX2hhbmRsZSA9IG5ldyBjYW52YXNSZW5kZXJlci5SZW5kZXJDb21wb25lbnRIYW5kbGUodGhpcy5kZXZpY2UsIHRoaXMuX2NhbWVyYSk7XG4gICAgICAgIHRoaXMuX2ZvcndhcmQgPSBuZXcgY2FudmFzUmVuZGVyZXIuRm9yd2FyZFJlbmRlcmVyKCk7XG4gICAgICAgIHRoaXMuX2Zsb3cgPSBjYy5SZW5kZXJGbG93O1xuICAgICAgICB0aGlzLl9mbG93LmluaXQodGhpcy5faGFuZGxlLCB0aGlzLl9mb3J3YXJkKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlQ2FtZXJhVmlld3BvcnQgKCkge1xuICAgICAgICAvLyBUT0RPOiByZW1vdmUgSEFDS1xuICAgICAgICBpZiAoIUNDX0VESVRPUiAmJiBjYy5kaXJlY3Rvcikge1xuICAgICAgICAgICAgbGV0IGVjU2NlbmUgPSBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpO1xuICAgICAgICAgICAgaWYgKGVjU2NlbmUpIGVjU2NlbmUuc2V0U2NhbGUoMSwgMSwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2MuZ2FtZS5yZW5kZXJUeXBlID09PSBjYy5nYW1lLlJFTkRFUl9UWVBFX0NBTlZBUykge1xuICAgICAgICAgICAgbGV0IHZwID0gY2Mudmlldy5nZXRWaWV3cG9ydFJlY3QoKTtcbiAgICAgICAgICAgIHRoaXMuZGV2aWNlLnNldFZpZXdwb3J0KHZwLngsIHZwLnksIHZwLndpZHRoLCB2cC5oZWlnaHQpO1xuICAgICAgICAgICAgdGhpcy5fY2FtZXJhLmEgPSBjYy52aWV3LmdldFNjYWxlWCgpO1xuICAgICAgICAgICAgdGhpcy5fY2FtZXJhLmQgPSBjYy52aWV3LmdldFNjYWxlWSgpO1xuICAgICAgICAgICAgdGhpcy5fY2FtZXJhLnR4ID0gdnAueDtcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYS50eSA9IHZwLnkgKyB2cC5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVuZGVyIChlY1NjZW5lLCBkdCkge1xuICAgICAgICB0aGlzLmRldmljZS5yZXNldERyYXdDYWxscygpO1xuICAgICAgICBpZiAoZWNTY2VuZSkge1xuICAgICAgICAgICAgLy8gd2FsayBlbnRpdHkgY29tcG9uZW50IHNjZW5lIHRvIGdlbmVyYXRlIG1vZGVsc1xuICAgICAgICAgICAgdGhpcy5fZmxvdy5yZW5kZXIoZWNTY2VuZSwgZHQpO1xuICAgICAgICAgICAgdGhpcy5kcmF3Q2FsbHMgPSB0aGlzLmRldmljZS5nZXREcmF3Q2FsbHMoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjbGVhciAoKSB7XG4gICAgICAgIHRoaXMuX2hhbmRsZS5yZXNldCgpO1xuICAgICAgICB0aGlzLl9mb3J3YXJkLmNsZWFyKCk7XG4gICAgfVxufTtcbiJdLCJzb3VyY2VSb290IjoiLyJ9