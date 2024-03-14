
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/camera/CCCamera.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _valueTypes = require("../value-types");

var _geomUtils = require("../geom-utils");

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
var AffineTrans = require('../utils/affine-transform');

var renderer = require('../renderer/index');

var RenderFlow = require('../renderer/render-flow');

var game = require('../CCGame');

var RendererCamera = null;

if (CC_JSB && CC_NATIVERENDERER) {
  RendererCamera = window.renderer.Camera;
} else {
  RendererCamera = require('../../renderer/scene/camera');
}

var _mat4_temp_1 = cc.mat4();

var _mat4_temp_2 = cc.mat4();

var _v3_temp_1 = cc.v3();

var _v3_temp_2 = cc.v3();

var _v3_temp_3 = cc.v3();

var _cameras = []; // unstable array

function updateMainCamera() {
  for (var i = 0, minDepth = Number.MAX_VALUE; i < _cameras.length; i++) {
    var camera = _cameras[i];

    if (camera._depth < minDepth) {
      Camera.main = camera;
      minDepth = camera._depth;
    }
  }
}

var _debugCamera = null;

function repositionDebugCamera() {
  if (!_debugCamera) return;

  var node = _debugCamera.getNode();

  var canvas = cc.game.canvas;
  node.z = canvas.height / 1.1566;
  node.x = canvas.width / 2;
  node.y = canvas.height / 2;
}
/**
 * !#en Values for Camera.clearFlags, determining what to clear when rendering a Camera.
 * !#zh 摄像机清除标记位，决定摄像机渲染时会清除哪些状态
 * @enum Camera.ClearFlags
 */


var ClearFlags = cc.Enum({
  /**
   * !#en
   * Clear the background color.
   * !#zh
   * 清除背景颜色
   * @property COLOR
   */
  COLOR: 1,

  /**
   * !#en
   * Clear the depth buffer.
   * !#zh
   * 清除深度缓冲区
   * @property DEPTH
   */
  DEPTH: 2,

  /**
   * !#en
   * Clear the stencil.
   * !#zh
   * 清除模板缓冲区
   * @property STENCIL
   */
  STENCIL: 4
});
var StageFlags = cc.Enum({
  OPAQUE: 1,
  TRANSPARENT: 2
});
/**
 * !#en
 * Camera is usefull when making reel game or other games which need scroll screen.
 * Using camera will be more efficient than moving node to scroll screen.
 * Camera 
 * !#zh
 * 摄像机在制作卷轴或是其他需要移动屏幕的游戏时比较有用，使用摄像机将会比移动节点来移动屏幕更加高效。
 * @class Camera
 * @extends Component
 */

var Camera = cc.Class({
  name: 'cc.Camera',
  "extends": cc.Component,
  ctor: function ctor() {
    if (game.renderType !== game.RENDER_TYPE_CANVAS) {
      var camera = new RendererCamera();
      camera.setStages(['opaque']);
      camera.dirty = true;
      this._inited = false;
      this._camera = camera;
    } else {
      this._inited = true;
    }
  },
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.others/Camera',
    inspector: 'packages://inspector/inspectors/comps/camera.js',
    executeInEditMode: true
  },
  properties: {
    _cullingMask: 0xffffffff,
    _clearFlags: ClearFlags.DEPTH | ClearFlags.STENCIL,
    _backgroundColor: cc.color(0, 0, 0, 255),
    _depth: 0,
    _zoomRatio: 1,
    _targetTexture: null,
    _fov: 60,
    _orthoSize: 10,
    _nearClip: 1,
    _farClip: 4096,
    _ortho: true,
    _rect: cc.rect(0, 0, 1, 1),
    _renderStages: 1,
    _alignWithScreen: true,

    /**
     * !#en
     * The camera zoom ratio, only support 2D camera.
     * !#zh
     * 摄像机缩放比率, 只支持 2D camera。
     * @property {Number} zoomRatio
     */
    zoomRatio: {
      get: function get() {
        return this._zoomRatio;
      },
      set: function set(value) {
        this._zoomRatio = value;
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.zoomRatio'
    },

    /**
     * !#en
     * Field of view. The width of the Camera’s view angle, measured in degrees along the local Y axis.
     * !#zh
     * 决定摄像机视角的宽度，当摄像机处于透视投影模式下这个属性才会生效。
     * @property {Number} fov
     * @default 60
     */
    fov: {
      get: function get() {
        return this._fov;
      },
      set: function set(v) {
        this._fov = v;
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.fov'
    },

    /**
     * !#en
     * The viewport size of the Camera when set to orthographic projection.
     * !#zh
     * 摄像机在正交投影模式下的视窗大小。
     * @property {Number} orthoSize
     * @default 10
     */
    orthoSize: {
      get: function get() {
        return this._orthoSize;
      },
      set: function set(v) {
        this._orthoSize = v;
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.orthoSize'
    },

    /**
     * !#en
     * The near clipping plane.
     * !#zh
     * 摄像机的近剪裁面。
     * @property {Number} nearClip
     * @default 0.1
     */
    nearClip: {
      get: function get() {
        return this._nearClip;
      },
      set: function set(v) {
        this._nearClip = v;

        this._updateClippingpPlanes();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.nearClip'
    },

    /**
     * !#en
     * The far clipping plane.
     * !#zh
     * 摄像机的远剪裁面。
     * @property {Number} farClip
     * @default 4096
     */
    farClip: {
      get: function get() {
        return this._farClip;
      },
      set: function set(v) {
        this._farClip = v;

        this._updateClippingpPlanes();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.farClip'
    },

    /**
     * !#en
     * Is the camera orthographic (true) or perspective (false)?
     * !#zh
     * 设置摄像机的投影模式是正交还是透视模式。
     * @property {Boolean} ortho
     * @default false
     */
    ortho: {
      get: function get() {
        return this._ortho;
      },
      set: function set(v) {
        this._ortho = v;

        this._updateProjection();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.ortho'
    },

    /**
     * !#en
     * Four values (0 ~ 1) that indicate where on the screen this camera view will be drawn.
     * !#zh
     * 决定摄像机绘制在屏幕上哪个位置，值为（0 ~ 1）。
     * @property {Rect} rect
     * @default cc.rect(0,0,1,1)
     */
    rect: {
      get: function get() {
        return this._rect;
      },
      set: function set(v) {
        this._rect = v;

        this._updateRect();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.rect'
    },

    /**
     * !#en
     * This is used to render parts of the scene selectively.
     * !#zh
     * 决定摄像机会渲染场景的哪一部分。
     * @property {Number} cullingMask
     */
    cullingMask: {
      get: function get() {
        return this._cullingMask;
      },
      set: function set(value) {
        this._cullingMask = value;

        this._updateCameraMask();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.cullingMask'
    },

    /**
     * !#en
     * Determining what to clear when camera rendering.
     * !#zh
     * 决定摄像机渲染时会清除哪些状态。
     * @property {Camera.ClearFlags} clearFlags
     */
    clearFlags: {
      get: function get() {
        return this._clearFlags;
      },
      set: function set(value) {
        this._clearFlags = value;

        if (this._camera) {
          this._camera.setClearFlags(value);
        }
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.clearFlags'
    },

    /**
     * !#en
     * The color with which the screen will be cleared.
     * !#zh
     * 摄像机用于清除屏幕的背景色。
     * @property {Color} backgroundColor
     */
    backgroundColor: {
      get: function get() {
        return this._backgroundColor;
      },
      set: function set(value) {
        if (!this._backgroundColor.equals(value)) {
          this._backgroundColor.set(value);

          this._updateBackgroundColor();
        }
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.backgroundColor'
    },

    /**
     * !#en
     * Camera's depth in the camera rendering order. Cameras with higher depth are rendered after cameras with lower depth.
     * !#zh
     * 摄像机深度。用于决定摄像机的渲染顺序，值越大渲染在越上层。
     * @property {Number} depth
     */
    depth: {
      get: function get() {
        return this._depth;
      },
      set: function set(value) {
        if (Camera.main === this) {
          if (this._depth < value) {
            updateMainCamera();
          }
        } else if (Camera.main && value < Camera.main._depth && _cameras.includes(this)) {
          Camera.main = this;
        }

        this._depth = value;

        if (this._camera) {
          this._camera.setPriority(value);
        }
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.depth'
    },

    /**
     * !#en
     * Destination render texture.
     * Usually cameras render directly to screen, but for some effects it is useful to make a camera render into a texture.
     * !#zh
     * 摄像机渲染的目标 RenderTexture。
     * 一般摄像机会直接渲染到屏幕上，但是有一些效果可以使用摄像机渲染到 RenderTexture 上再对 RenderTexture 进行处理来实现。
     * @property {RenderTexture} targetTexture
     */
    targetTexture: {
      get: function get() {
        return this._targetTexture;
      },
      set: function set(value) {
        this._targetTexture = value;

        this._updateTargetTexture();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.targetTexture'
    },

    /**
     * !#en
     * Sets the camera's render stages.
     * !#zh
     * 设置摄像机渲染的阶段
     * @property {Number} renderStages
     */
    renderStages: {
      get: function get() {
        return this._renderStages;
      },
      set: function set(val) {
        this._renderStages = val;

        this._updateStages();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.renderStages'
    },

    /**
     * !#en Whether auto align camera viewport to screen
     * !#zh 是否自动将摄像机的视口对准屏幕
     * @property {Boolean} alignWithScreen
     */
    alignWithScreen: {
      get: function get() {
        return this._alignWithScreen;
      },
      set: function set(v) {
        this._alignWithScreen = v;
      }
    },
    _is3D: {
      get: function get() {
        return this.node && this.node._is3DNode;
      }
    }
  },
  statics: {
    /**
     * !#en
     * The primary camera in the scene. Returns the rear most rendered camera, which is the camera with the lowest depth.
     * !#zh
     * 当前场景中激活的主摄像机。将会返回渲染在屏幕最底层，也就是 depth 最小的摄像机。
     * @property {Camera} main
     * @static
     */
    main: null,

    /**
     * !#en
     * All enabled cameras.
     * !#zh
     * 当前激活的所有摄像机。
     * @property {[Camera]} cameras
     * @static
     */
    cameras: _cameras,
    ClearFlags: ClearFlags,

    /**
     * !#en
     * Get the first camera which the node belong to.
     * !#zh
     * 获取节点所在的第一个摄像机。
     * @method findCamera
     * @param {Node} node 
     * @return {Camera}
     * @static
     */
    findCamera: function findCamera(node) {
      for (var i = 0, l = _cameras.length; i < l; i++) {
        var camera = _cameras[i];

        if (camera.containsNode(node)) {
          return camera;
        }
      }

      return null;
    },
    _findRendererCamera: function _findRendererCamera(node) {
      var cameras = renderer.scene._cameras;

      for (var i = 0; i < cameras._count; i++) {
        if (cameras._data[i]._cullingMask & node._cullingMask) {
          return cameras._data[i];
        }
      }

      return null;
    },
    _setupDebugCamera: function _setupDebugCamera() {
      if (_debugCamera) return;
      if (game.renderType === game.RENDER_TYPE_CANVAS) return;
      var camera = new RendererCamera();
      _debugCamera = camera;
      camera.setStages(['opaque']);
      camera.setFov(Math.PI * 60 / 180);
      camera.setNear(0.1);
      camera.setFar(4096);
      camera.dirty = true;
      camera.cullingMask = 1 << cc.Node.BuiltinGroupIndex.DEBUG;
      camera.setPriority(cc.macro.MAX_ZINDEX);
      camera.setClearFlags(0);
      camera.setColor(0, 0, 0, 0);
      var node = new cc.Node();
      camera.setNode(node);
      repositionDebugCamera();
      cc.view.on('design-resolution-changed', repositionDebugCamera);
      renderer.scene.addCamera(camera);
    }
  },
  _updateCameraMask: function _updateCameraMask() {
    if (this._camera) {
      var mask = this._cullingMask & ~(1 << cc.Node.BuiltinGroupIndex.DEBUG);
      this._camera.cullingMask = mask;
    }
  },
  _updateBackgroundColor: function _updateBackgroundColor() {
    if (!this._camera) return;
    var color = this._backgroundColor;

    this._camera.setColor(color.r / 255, color.g / 255, color.b / 255, color.a / 255);
  },
  _updateTargetTexture: function _updateTargetTexture() {
    if (!this._camera) return;
    var texture = this._targetTexture;

    this._camera.setFrameBuffer(texture ? texture._framebuffer : null);
  },
  _updateClippingpPlanes: function _updateClippingpPlanes() {
    if (!this._camera) return;

    this._camera.setNear(this._nearClip);

    this._camera.setFar(this._farClip);
  },
  _updateProjection: function _updateProjection() {
    if (!this._camera) return;
    var type = this._ortho ? 1 : 0;

    this._camera.setType(type);
  },
  _updateRect: function _updateRect() {
    if (!this._camera) return;
    var rect = this._rect;

    this._camera.setRect(rect.x, rect.y, rect.width, rect.height);
  },
  _updateStages: function _updateStages() {
    var flags = this._renderStages;
    var stages = [];

    if (flags & StageFlags.OPAQUE) {
      stages.push('opaque');
    }

    if (flags & StageFlags.TRANSPARENT) {
      stages.push('transparent');
    }

    this._camera.setStages(stages);
  },
  _init: function _init() {
    if (this._inited) return;
    this._inited = true;
    var camera = this._camera;
    if (!camera) return;
    camera.setNode(this.node);
    camera.setClearFlags(this._clearFlags);
    camera.setPriority(this._depth);

    this._updateBackgroundColor();

    this._updateCameraMask();

    this._updateTargetTexture();

    this._updateClippingpPlanes();

    this._updateProjection();

    this._updateStages();

    this._updateRect();

    if (!CC_EDITOR) {
      this.beforeDraw();
    }
  },
  __preload: function __preload() {
    this._init();
  },
  onEnable: function onEnable() {
    if (!CC_EDITOR && game.renderType !== game.RENDER_TYPE_CANVAS) {
      cc.director.on(cc.Director.EVENT_BEFORE_DRAW, this.beforeDraw, this);
      renderer.scene.addCamera(this._camera);
    }

    _cameras.push(this);

    if (!Camera.main || this._depth < Camera.main._depth) {
      Camera.main = this;
    }
  },
  onDisable: function onDisable() {
    if (!CC_EDITOR && game.renderType !== game.RENDER_TYPE_CANVAS) {
      cc.director.off(cc.Director.EVENT_BEFORE_DRAW, this.beforeDraw, this);
      renderer.scene.removeCamera(this._camera);
    }

    cc.js.array.fastRemove(_cameras, this);

    if (Camera.main === this) {
      Camera.main = null;
      updateMainCamera();
    }
  },

  /**
   * !#en
   * Get the screen to world matrix, only support 2D camera which alignWithScreen is true.
   * !#zh
   * 获取屏幕坐标系到世界坐标系的矩阵，只适用于 alignWithScreen 为 true 的 2D 摄像机。
   * @method getScreenToWorldMatrix2D
   * @param {Mat4} out - the matrix to receive the result
   * @return {Mat4} out
   */
  getScreenToWorldMatrix2D: function getScreenToWorldMatrix2D(out) {
    this.getWorldToScreenMatrix2D(out);

    _valueTypes.Mat4.invert(out, out);

    return out;
  },

  /**
   * !#en
   * Get the world to camera matrix, only support 2D camera which alignWithScreen is true.
   * !#zh
   * 获取世界坐标系到摄像机坐标系的矩阵，只适用于 alignWithScreen 为 true 的 2D 摄像机。
   * @method getWorldToScreenMatrix2D
   * @param {Mat4} out - the matrix to receive the result
   * @return {Mat4} out
   */
  getWorldToScreenMatrix2D: function getWorldToScreenMatrix2D(out) {
    this.node.getWorldRT(_mat4_temp_1);
    var zoomRatio = this.zoomRatio;
    var _mat4_temp_1m = _mat4_temp_1.m;
    _mat4_temp_1m[0] *= zoomRatio;
    _mat4_temp_1m[1] *= zoomRatio;
    _mat4_temp_1m[4] *= zoomRatio;
    _mat4_temp_1m[5] *= zoomRatio;
    var m12 = _mat4_temp_1m[12];
    var m13 = _mat4_temp_1m[13];
    var center = cc.visibleRect.center;
    _mat4_temp_1m[12] = center.x - (_mat4_temp_1m[0] * m12 + _mat4_temp_1m[4] * m13);
    _mat4_temp_1m[13] = center.y - (_mat4_temp_1m[1] * m12 + _mat4_temp_1m[5] * m13);

    if (out !== _mat4_temp_1) {
      _valueTypes.Mat4.copy(out, _mat4_temp_1);
    }

    return out;
  },

  /**
   * !#en
   * Convert point from screen to world.
   * !#zh
   * 将坐标从屏幕坐标系转换到世界坐标系。
   * @method getScreenToWorldPoint
   * @param {Vec3|Vec2} screenPosition 
   * @param {Vec3|Vec2} [out] 
   * @return {Vec3|Vec2} out
   */
  getScreenToWorldPoint: function getScreenToWorldPoint(screenPosition, out) {
    if (this.node.is3DNode) {
      out = out || new cc.Vec3();

      this._camera.screenToWorld(out, screenPosition, cc.visibleRect.width, cc.visibleRect.height);
    } else {
      out = out || new cc.Vec2();
      this.getScreenToWorldMatrix2D(_mat4_temp_1);

      _valueTypes.Vec2.transformMat4(out, screenPosition, _mat4_temp_1);
    }

    return out;
  },

  /**
   * !#en
   * Convert point from world to screen.
   * !#zh
   * 将坐标从世界坐标系转化到屏幕坐标系。
   * @method getWorldToScreenPoint
   * @param {Vec3|Vec2} worldPosition 
   * @param {Vec3|Vec2} [out] 
   * @return {Vec3|Vec2} out
   */
  getWorldToScreenPoint: function getWorldToScreenPoint(worldPosition, out) {
    if (this.node.is3DNode) {
      out = out || new cc.Vec3();

      this._camera.worldToScreen(out, worldPosition, cc.visibleRect.width, cc.visibleRect.height);
    } else {
      out = out || new cc.Vec2();
      this.getWorldToScreenMatrix2D(_mat4_temp_1);

      _valueTypes.Vec2.transformMat4(out, worldPosition, _mat4_temp_1);
    }

    return out;
  },

  /**
   * !#en
   * Get a ray from screen position
   * !#zh
   * 从屏幕坐标获取一条射线
   * @method getRay
   * @param {Vec2} screenPos
   * @return {Ray}
   */
  getRay: function getRay(screenPos) {
    if (!cc.geomUtils) return screenPos;

    _valueTypes.Vec3.set(_v3_temp_3, screenPos.x, screenPos.y, 1);

    this._camera.screenToWorld(_v3_temp_2, _v3_temp_3, cc.visibleRect.width, cc.visibleRect.height);

    if (this.ortho) {
      _valueTypes.Vec3.set(_v3_temp_3, screenPos.x, screenPos.y, -1);

      this._camera.screenToWorld(_v3_temp_1, _v3_temp_3, cc.visibleRect.width, cc.visibleRect.height);
    } else {
      this.node.getWorldPosition(_v3_temp_1);
    }

    return _geomUtils.Ray.fromPoints(new _geomUtils.Ray(), _v3_temp_1, _v3_temp_2);
  },

  /**
   * !#en
   * Check whether the node is in the camera.
   * !#zh
   * 检测节点是否被此摄像机影响
   * @method containsNode
   * @param {Node} node - the node which need to check
   * @return {Boolean}
   */
  containsNode: function containsNode(node) {
    return (node._cullingMask & this.cullingMask) > 0;
  },

  /**
   * !#en
   * Render the camera manually.
   * !#zh
   * 手动渲染摄像机。
   * @method render
   * @param {Node} [rootNode] 
   */
  render: function render(rootNode) {
    rootNode = rootNode || cc.director.getScene();
    if (!rootNode) return null; // force update node world matrix

    this.node.getWorldMatrix(_mat4_temp_1);
    this.beforeDraw();
    RenderFlow.renderCamera(this._camera, rootNode);
  },
  _onAlignWithScreen: function _onAlignWithScreen() {
    var height = cc.game.canvas.height / cc.view._scaleY;
    var targetTexture = this._targetTexture;

    if (targetTexture) {
      if (CC_EDITOR) {
        height = cc.engine.getDesignResolutionSize().height;
      } else {
        height = cc.visibleRect.height;
      }
    }

    var fov = this._fov * cc.macro.RAD;
    this.node.z = height / (Math.tan(fov / 2) * 2);
    fov = Math.atan(Math.tan(fov / 2) / this.zoomRatio) * 2;

    this._camera.setFov(fov);

    this._camera.setOrthoHeight(height / 2 / this.zoomRatio);

    this.node.setRotation(0, 0, 0, 1);
  },
  beforeDraw: function beforeDraw() {
    if (!this._camera) return;

    if (this._alignWithScreen) {
      this._onAlignWithScreen();
    } else {
      var fov = this._fov * cc.macro.RAD;
      fov = Math.atan(Math.tan(fov / 2) / this.zoomRatio) * 2;

      this._camera.setFov(fov);

      this._camera.setOrthoHeight(this._orthoSize / this.zoomRatio);
    }

    this._camera.dirty = true;
  }
}); // deprecated

cc.js.mixin(Camera.prototype, {
  /**
   * !#en
   * Returns the matrix that transform the node's (local) space coordinates into the camera's space coordinates.
   * !#zh
   * 返回一个将节点坐标系转换到摄像机坐标系下的矩阵
   * @method getNodeToCameraTransform
   * @deprecated since v2.0.0
   * @param {Node} node - the node which should transform
   * @return {AffineTransform}
   */
  getNodeToCameraTransform: function getNodeToCameraTransform(node) {
    var out = AffineTrans.identity();
    node.getWorldMatrix(_mat4_temp_2);

    if (this.containsNode(node)) {
      this.getWorldToCameraMatrix(_mat4_temp_1);

      _valueTypes.Mat4.mul(_mat4_temp_2, _mat4_temp_2, _mat4_temp_1);
    }

    AffineTrans.fromMat4(out, _mat4_temp_2);
    return out;
  },

  /**
   * !#en
   * Conver a camera coordinates point to world coordinates.
   * !#zh
   * 将一个摄像机坐标系下的点转换到世界坐标系下。
   * @method getCameraToWorldPoint
   * @deprecated since v2.1.3
   * @param {Vec2} point - the point which should transform
   * @param {Vec2} [out] - the point to receive the result
   * @return {Vec2} out
   */
  getCameraToWorldPoint: function getCameraToWorldPoint(point, out) {
    return this.getScreenToWorldPoint(point, out);
  },

  /**
   * !#en
   * Conver a world coordinates point to camera coordinates.
   * !#zh
   * 将一个世界坐标系下的点转换到摄像机坐标系下。
   * @method getWorldToCameraPoint
   * @deprecated since v2.1.3
   * @param {Vec2} point 
   * @param {Vec2} [out] - the point to receive the result
   * @return {Vec2} out
   */
  getWorldToCameraPoint: function getWorldToCameraPoint(point, out) {
    return this.getWorldToScreenPoint(point, out);
  },

  /**
   * !#en
   * Get the camera to world matrix
   * !#zh
   * 获取摄像机坐标系到世界坐标系的矩阵
   * @method getCameraToWorldMatrix
   * @deprecated since v2.1.3
   * @param {Mat4} out - the matrix to receive the result
   * @return {Mat4} out
   */
  getCameraToWorldMatrix: function getCameraToWorldMatrix(out) {
    return this.getScreenToWorldMatrix2D(out);
  },

  /**
   * !#en
   * Get the world to camera matrix
   * !#zh
   * 获取世界坐标系到摄像机坐标系的矩阵
   * @method getWorldToCameraMatrix
   * @deprecated since v2.1.3
   * @param {Mat4} out - the matrix to receive the result
   * @return {Mat4} out
   */
  getWorldToCameraMatrix: function getWorldToCameraMatrix(out) {
    return this.getWorldToScreenMatrix2D(out);
  }
});
module.exports = cc.Camera = Camera;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NhbWVyYS9DQ0NhbWVyYS5qcyJdLCJuYW1lcyI6WyJBZmZpbmVUcmFucyIsInJlcXVpcmUiLCJyZW5kZXJlciIsIlJlbmRlckZsb3ciLCJnYW1lIiwiUmVuZGVyZXJDYW1lcmEiLCJDQ19KU0IiLCJDQ19OQVRJVkVSRU5ERVJFUiIsIndpbmRvdyIsIkNhbWVyYSIsIl9tYXQ0X3RlbXBfMSIsImNjIiwibWF0NCIsIl9tYXQ0X3RlbXBfMiIsIl92M190ZW1wXzEiLCJ2MyIsIl92M190ZW1wXzIiLCJfdjNfdGVtcF8zIiwiX2NhbWVyYXMiLCJ1cGRhdGVNYWluQ2FtZXJhIiwiaSIsIm1pbkRlcHRoIiwiTnVtYmVyIiwiTUFYX1ZBTFVFIiwibGVuZ3RoIiwiY2FtZXJhIiwiX2RlcHRoIiwibWFpbiIsIl9kZWJ1Z0NhbWVyYSIsInJlcG9zaXRpb25EZWJ1Z0NhbWVyYSIsIm5vZGUiLCJnZXROb2RlIiwiY2FudmFzIiwieiIsImhlaWdodCIsIngiLCJ3aWR0aCIsInkiLCJDbGVhckZsYWdzIiwiRW51bSIsIkNPTE9SIiwiREVQVEgiLCJTVEVOQ0lMIiwiU3RhZ2VGbGFncyIsIk9QQVFVRSIsIlRSQU5TUEFSRU5UIiwiQ2xhc3MiLCJuYW1lIiwiQ29tcG9uZW50IiwiY3RvciIsInJlbmRlclR5cGUiLCJSRU5ERVJfVFlQRV9DQU5WQVMiLCJzZXRTdGFnZXMiLCJkaXJ0eSIsIl9pbml0ZWQiLCJfY2FtZXJhIiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwibWVudSIsImluc3BlY3RvciIsImV4ZWN1dGVJbkVkaXRNb2RlIiwicHJvcGVydGllcyIsIl9jdWxsaW5nTWFzayIsIl9jbGVhckZsYWdzIiwiX2JhY2tncm91bmRDb2xvciIsImNvbG9yIiwiX3pvb21SYXRpbyIsIl90YXJnZXRUZXh0dXJlIiwiX2ZvdiIsIl9vcnRob1NpemUiLCJfbmVhckNsaXAiLCJfZmFyQ2xpcCIsIl9vcnRobyIsIl9yZWN0IiwicmVjdCIsIl9yZW5kZXJTdGFnZXMiLCJfYWxpZ25XaXRoU2NyZWVuIiwiem9vbVJhdGlvIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJ0b29sdGlwIiwiQ0NfREVWIiwiZm92IiwidiIsIm9ydGhvU2l6ZSIsIm5lYXJDbGlwIiwiX3VwZGF0ZUNsaXBwaW5ncFBsYW5lcyIsImZhckNsaXAiLCJvcnRobyIsIl91cGRhdGVQcm9qZWN0aW9uIiwiX3VwZGF0ZVJlY3QiLCJjdWxsaW5nTWFzayIsIl91cGRhdGVDYW1lcmFNYXNrIiwiY2xlYXJGbGFncyIsInNldENsZWFyRmxhZ3MiLCJiYWNrZ3JvdW5kQ29sb3IiLCJlcXVhbHMiLCJfdXBkYXRlQmFja2dyb3VuZENvbG9yIiwiZGVwdGgiLCJpbmNsdWRlcyIsInNldFByaW9yaXR5IiwidGFyZ2V0VGV4dHVyZSIsIl91cGRhdGVUYXJnZXRUZXh0dXJlIiwicmVuZGVyU3RhZ2VzIiwidmFsIiwiX3VwZGF0ZVN0YWdlcyIsImFsaWduV2l0aFNjcmVlbiIsIl9pczNEIiwiX2lzM0ROb2RlIiwic3RhdGljcyIsImNhbWVyYXMiLCJmaW5kQ2FtZXJhIiwibCIsImNvbnRhaW5zTm9kZSIsIl9maW5kUmVuZGVyZXJDYW1lcmEiLCJzY2VuZSIsIl9jb3VudCIsIl9kYXRhIiwiX3NldHVwRGVidWdDYW1lcmEiLCJzZXRGb3YiLCJNYXRoIiwiUEkiLCJzZXROZWFyIiwic2V0RmFyIiwiTm9kZSIsIkJ1aWx0aW5Hcm91cEluZGV4IiwiREVCVUciLCJtYWNybyIsIk1BWF9aSU5ERVgiLCJzZXRDb2xvciIsInNldE5vZGUiLCJ2aWV3Iiwib24iLCJhZGRDYW1lcmEiLCJtYXNrIiwiciIsImciLCJiIiwiYSIsInRleHR1cmUiLCJzZXRGcmFtZUJ1ZmZlciIsIl9mcmFtZWJ1ZmZlciIsInR5cGUiLCJzZXRUeXBlIiwic2V0UmVjdCIsImZsYWdzIiwic3RhZ2VzIiwicHVzaCIsIl9pbml0IiwiYmVmb3JlRHJhdyIsIl9fcHJlbG9hZCIsIm9uRW5hYmxlIiwiZGlyZWN0b3IiLCJEaXJlY3RvciIsIkVWRU5UX0JFRk9SRV9EUkFXIiwib25EaXNhYmxlIiwib2ZmIiwicmVtb3ZlQ2FtZXJhIiwianMiLCJhcnJheSIsImZhc3RSZW1vdmUiLCJnZXRTY3JlZW5Ub1dvcmxkTWF0cml4MkQiLCJvdXQiLCJnZXRXb3JsZFRvU2NyZWVuTWF0cml4MkQiLCJNYXQ0IiwiaW52ZXJ0IiwiZ2V0V29ybGRSVCIsIl9tYXQ0X3RlbXBfMW0iLCJtIiwibTEyIiwibTEzIiwiY2VudGVyIiwidmlzaWJsZVJlY3QiLCJjb3B5IiwiZ2V0U2NyZWVuVG9Xb3JsZFBvaW50Iiwic2NyZWVuUG9zaXRpb24iLCJpczNETm9kZSIsIlZlYzMiLCJzY3JlZW5Ub1dvcmxkIiwiVmVjMiIsInRyYW5zZm9ybU1hdDQiLCJnZXRXb3JsZFRvU2NyZWVuUG9pbnQiLCJ3b3JsZFBvc2l0aW9uIiwid29ybGRUb1NjcmVlbiIsImdldFJheSIsInNjcmVlblBvcyIsImdlb21VdGlscyIsImdldFdvcmxkUG9zaXRpb24iLCJSYXkiLCJmcm9tUG9pbnRzIiwicmVuZGVyIiwicm9vdE5vZGUiLCJnZXRTY2VuZSIsImdldFdvcmxkTWF0cml4IiwicmVuZGVyQ2FtZXJhIiwiX29uQWxpZ25XaXRoU2NyZWVuIiwiX3NjYWxlWSIsImVuZ2luZSIsImdldERlc2lnblJlc29sdXRpb25TaXplIiwiUkFEIiwidGFuIiwiYXRhbiIsInNldE9ydGhvSGVpZ2h0Iiwic2V0Um90YXRpb24iLCJtaXhpbiIsInByb3RvdHlwZSIsImdldE5vZGVUb0NhbWVyYVRyYW5zZm9ybSIsImlkZW50aXR5IiwiZ2V0V29ybGRUb0NhbWVyYU1hdHJpeCIsIm11bCIsImZyb21NYXQ0IiwiZ2V0Q2FtZXJhVG9Xb3JsZFBvaW50IiwicG9pbnQiLCJnZXRXb3JsZFRvQ2FtZXJhUG9pbnQiLCJnZXRDYW1lcmFUb1dvcmxkTWF0cml4IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQTBCQTs7QUFDQTs7QUEzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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RUc7QUFDekIsV0FBTyxLQUFLQyx3QkFBTCxDQUE4QkQsR0FBOUIsQ0FBUDtBQUNIO0FBL0V5QixDQUE5QjtBQWtGQXFELE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjlNLEVBQUUsQ0FBQ0YsTUFBSCxHQUFZQSxNQUE3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IHsgTWF0NCwgVmVjMiwgVmVjMyB9IGZyb20gJy4uL3ZhbHVlLXR5cGVzJztcbmltcG9ydCB7IFJheSB9IGZyb20gJy4uL2dlb20tdXRpbHMnO1xuXG5jb25zdCBBZmZpbmVUcmFucyA9IHJlcXVpcmUoJy4uL3V0aWxzL2FmZmluZS10cmFuc2Zvcm0nKTtcbmNvbnN0IHJlbmRlcmVyID0gcmVxdWlyZSgnLi4vcmVuZGVyZXIvaW5kZXgnKTtcbmNvbnN0IFJlbmRlckZsb3cgPSByZXF1aXJlKCcuLi9yZW5kZXJlci9yZW5kZXItZmxvdycpO1xuY29uc3QgZ2FtZSA9IHJlcXVpcmUoJy4uL0NDR2FtZScpO1xuXG5sZXQgUmVuZGVyZXJDYW1lcmEgPSBudWxsO1xuaWYgKENDX0pTQiAmJiBDQ19OQVRJVkVSRU5ERVJFUikge1xuICAgIFJlbmRlcmVyQ2FtZXJhID0gd2luZG93LnJlbmRlcmVyLkNhbWVyYTtcbn0gZWxzZSB7XG4gICAgUmVuZGVyZXJDYW1lcmEgPSByZXF1aXJlKCcuLi8uLi9yZW5kZXJlci9zY2VuZS9jYW1lcmEnKTtcbn1cblxubGV0IF9tYXQ0X3RlbXBfMSA9IGNjLm1hdDQoKTtcbmxldCBfbWF0NF90ZW1wXzIgPSBjYy5tYXQ0KCk7XG5cbmxldCBfdjNfdGVtcF8xID0gY2MudjMoKTtcbmxldCBfdjNfdGVtcF8yID0gY2MudjMoKTtcbmxldCBfdjNfdGVtcF8zID0gY2MudjMoKTtcblxubGV0IF9jYW1lcmFzID0gW107ICAvLyB1bnN0YWJsZSBhcnJheVxuXG5mdW5jdGlvbiB1cGRhdGVNYWluQ2FtZXJhICgpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbWluRGVwdGggPSBOdW1iZXIuTUFYX1ZBTFVFOyBpIDwgX2NhbWVyYXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGNhbWVyYSA9IF9jYW1lcmFzW2ldO1xuICAgICAgICBpZiAoY2FtZXJhLl9kZXB0aCA8IG1pbkRlcHRoKSB7XG4gICAgICAgICAgICBDYW1lcmEubWFpbiA9IGNhbWVyYTtcbiAgICAgICAgICAgIG1pbkRlcHRoID0gY2FtZXJhLl9kZXB0aDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubGV0IF9kZWJ1Z0NhbWVyYSA9IG51bGw7XG5cbmZ1bmN0aW9uIHJlcG9zaXRpb25EZWJ1Z0NhbWVyYSAoKSB7XG4gICAgaWYgKCFfZGVidWdDYW1lcmEpIHJldHVybjtcblxuICAgIGxldCBub2RlID0gX2RlYnVnQ2FtZXJhLmdldE5vZGUoKTtcbiAgICBsZXQgY2FudmFzID0gY2MuZ2FtZS5jYW52YXM7XG4gICAgbm9kZS56ID0gY2FudmFzLmhlaWdodCAvIDEuMTU2NjtcbiAgICBub2RlLnggPSBjYW52YXMud2lkdGggLyAyO1xuICAgIG5vZGUueSA9IGNhbnZhcy5oZWlnaHQgLyAyO1xufVxuXG4vKipcbiAqICEjZW4gVmFsdWVzIGZvciBDYW1lcmEuY2xlYXJGbGFncywgZGV0ZXJtaW5pbmcgd2hhdCB0byBjbGVhciB3aGVuIHJlbmRlcmluZyBhIENhbWVyYS5cbiAqICEjemgg5pGE5YOP5py65riF6Zmk5qCH6K6w5L2N77yM5Yaz5a6a5pGE5YOP5py65riy5p+T5pe25Lya5riF6Zmk5ZOq5Lqb54q25oCBXG4gKiBAZW51bSBDYW1lcmEuQ2xlYXJGbGFnc1xuICovXG5sZXQgQ2xlYXJGbGFncyA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDbGVhciB0aGUgYmFja2dyb3VuZCBjb2xvci5cbiAgICAgKiAhI3poXG4gICAgICog5riF6Zmk6IOM5pmv6aKc6ImyXG4gICAgICogQHByb3BlcnR5IENPTE9SXG4gICAgICovXG4gICAgQ09MT1I6IDEsXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIENsZWFyIHRoZSBkZXB0aCBidWZmZXIuXG4gICAgICogISN6aFxuICAgICAqIOa4hemZpOa3seW6pue8k+WGsuWMulxuICAgICAqIEBwcm9wZXJ0eSBERVBUSFxuICAgICAqL1xuICAgIERFUFRIOiAyLFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDbGVhciB0aGUgc3RlbmNpbC5cbiAgICAgKiAhI3poXG4gICAgICog5riF6Zmk5qih5p2/57yT5Yay5Yy6XG4gICAgICogQHByb3BlcnR5IFNURU5DSUxcbiAgICAgKi9cbiAgICBTVEVOQ0lMOiA0LFxufSk7XG5cbmxldCBTdGFnZUZsYWdzID0gY2MuRW51bSh7XG4gICAgT1BBUVVFOiAxLFxuICAgIFRSQU5TUEFSRU5UOiAyXG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBDYW1lcmEgaXMgdXNlZnVsbCB3aGVuIG1ha2luZyByZWVsIGdhbWUgb3Igb3RoZXIgZ2FtZXMgd2hpY2ggbmVlZCBzY3JvbGwgc2NyZWVuLlxuICogVXNpbmcgY2FtZXJhIHdpbGwgYmUgbW9yZSBlZmZpY2llbnQgdGhhbiBtb3Zpbmcgbm9kZSB0byBzY3JvbGwgc2NyZWVuLlxuICogQ2FtZXJhIFxuICogISN6aFxuICog5pGE5YOP5py65Zyo5Yi25L2c5Y236L205oiW5piv5YW25LuW6ZyA6KaB56e75Yqo5bGP5bmV55qE5ri45oiP5pe25q+U6L6D5pyJ55So77yM5L2/55So5pGE5YOP5py65bCG5Lya5q+U56e75Yqo6IqC54K55p2l56e75Yqo5bGP5bmV5pu05Yqg6auY5pWI44CCXG4gKiBAY2xhc3MgQ2FtZXJhXG4gKiBAZXh0ZW5kcyBDb21wb25lbnRcbiAqL1xubGV0IENhbWVyYSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuQ2FtZXJhJyxcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBjdG9yICgpIHtcbiAgICAgICAgaWYgKGdhbWUucmVuZGVyVHlwZSAhPT0gZ2FtZS5SRU5ERVJfVFlQRV9DQU5WQVMpIHtcbiAgICAgICAgICAgIGxldCBjYW1lcmEgPSBuZXcgUmVuZGVyZXJDYW1lcmEoKTtcblxuICAgICAgICAgICAgY2FtZXJhLnNldFN0YWdlcyhbXG4gICAgICAgICAgICAgICAgJ29wYXF1ZScsXG4gICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgY2FtZXJhLmRpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgdGhpcy5faW5pdGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEgPSBjYW1lcmE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5vdGhlcnMvQ2FtZXJhJyxcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9jYW1lcmEuanMnLFxuICAgICAgICBleGVjdXRlSW5FZGl0TW9kZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF9jdWxsaW5nTWFzazogMHhmZmZmZmZmZixcbiAgICAgICAgX2NsZWFyRmxhZ3M6IENsZWFyRmxhZ3MuREVQVEggfCBDbGVhckZsYWdzLlNURU5DSUwsXG4gICAgICAgIF9iYWNrZ3JvdW5kQ29sb3I6IGNjLmNvbG9yKDAsIDAsIDAsIDI1NSksXG4gICAgICAgIF9kZXB0aDogMCxcbiAgICAgICAgX3pvb21SYXRpbzogMSxcbiAgICAgICAgX3RhcmdldFRleHR1cmU6IG51bGwsXG4gICAgICAgIF9mb3Y6IDYwLFxuICAgICAgICBfb3J0aG9TaXplOiAxMCxcbiAgICAgICAgX25lYXJDbGlwOiAxLFxuICAgICAgICBfZmFyQ2xpcDogNDA5NixcbiAgICAgICAgX29ydGhvOiB0cnVlLFxuICAgICAgICBfcmVjdDogY2MucmVjdCgwLCAwLCAxLCAxKSxcbiAgICAgICAgX3JlbmRlclN0YWdlczogMSxcbiAgICAgICAgX2FsaWduV2l0aFNjcmVlbjogdHJ1ZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgY2FtZXJhIHpvb20gcmF0aW8sIG9ubHkgc3VwcG9ydCAyRCBjYW1lcmEuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5pGE5YOP5py657yp5pS+5q+U546HLCDlj6rmlK/mjIEgMkQgY2FtZXJh44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB6b29tUmF0aW9cbiAgICAgICAgICovXG4gICAgICAgIHpvb21SYXRpbzoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fem9vbVJhdGlvO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl96b29tUmF0aW8gPSB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmNhbWVyYS56b29tUmF0aW8nLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIEZpZWxkIG9mIHZpZXcuIFRoZSB3aWR0aCBvZiB0aGUgQ2FtZXJh4oCZcyB2aWV3IGFuZ2xlLCBtZWFzdXJlZCBpbiBkZWdyZWVzIGFsb25nIHRoZSBsb2NhbCBZIGF4aXMuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5Yaz5a6a5pGE5YOP5py66KeG6KeS55qE5a695bqm77yM5b2T5pGE5YOP5py65aSE5LqO6YCP6KeG5oqV5b2x5qih5byP5LiL6L+Z5Liq5bGe5oCn5omN5Lya55Sf5pWI44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBmb3ZcbiAgICAgICAgICogQGRlZmF1bHQgNjBcbiAgICAgICAgICovXG4gICAgICAgIGZvdjoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZm92O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvdiA9IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5jYW1lcmEuZm92JyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgdmlld3BvcnQgc2l6ZSBvZiB0aGUgQ2FtZXJhIHdoZW4gc2V0IHRvIG9ydGhvZ3JhcGhpYyBwcm9qZWN0aW9uLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOaRhOWDj+acuuWcqOato+S6pOaKleW9seaooeW8j+S4i+eahOinhueql+Wkp+Wwj+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gb3J0aG9TaXplXG4gICAgICAgICAqIEBkZWZhdWx0IDEwXG4gICAgICAgICAqL1xuICAgICAgICBvcnRob1NpemU6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29ydGhvU2l6ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vcnRob1NpemUgPSB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuY2FtZXJhLm9ydGhvU2l6ZScsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIG5lYXIgY2xpcHBpbmcgcGxhbmUuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5pGE5YOP5py655qE6L+R5Ymq6KOB6Z2i44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBuZWFyQ2xpcFxuICAgICAgICAgKiBAZGVmYXVsdCAwLjFcbiAgICAgICAgICovXG4gICAgICAgIG5lYXJDbGlwOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9uZWFyQ2xpcDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9uZWFyQ2xpcCA9IHY7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ2xpcHBpbmdwUGxhbmVzKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5jYW1lcmEubmVhckNsaXAnLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBmYXIgY2xpcHBpbmcgcGxhbmUuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5pGE5YOP5py655qE6L+c5Ymq6KOB6Z2i44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBmYXJDbGlwXG4gICAgICAgICAqIEBkZWZhdWx0IDQwOTZcbiAgICAgICAgICovXG4gICAgICAgIGZhckNsaXA6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZhckNsaXA7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZmFyQ2xpcCA9IHY7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ2xpcHBpbmdwUGxhbmVzKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5jYW1lcmEuZmFyQ2xpcCcsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogSXMgdGhlIGNhbWVyYSBvcnRob2dyYXBoaWMgKHRydWUpIG9yIHBlcnNwZWN0aXZlIChmYWxzZSk/XG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog6K6+572u5pGE5YOP5py655qE5oqV5b2x5qih5byP5piv5q2j5Lqk6L+Y5piv6YCP6KeG5qih5byP44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gb3J0aG9cbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIG9ydGhvOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9vcnRobztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vcnRobyA9IHY7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUHJvamVjdGlvbigpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuY2FtZXJhLm9ydGhvJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBGb3VyIHZhbHVlcyAoMCB+IDEpIHRoYXQgaW5kaWNhdGUgd2hlcmUgb24gdGhlIHNjcmVlbiB0aGlzIGNhbWVyYSB2aWV3IHdpbGwgYmUgZHJhd24uXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5Yaz5a6a5pGE5YOP5py657uY5Yi25Zyo5bGP5bmV5LiK5ZOq5Liq5L2N572u77yM5YC85Li677yIMCB+IDHvvInjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtSZWN0fSByZWN0XG4gICAgICAgICAqIEBkZWZhdWx0IGNjLnJlY3QoMCwwLDEsMSlcbiAgICAgICAgICovXG4gICAgICAgIHJlY3Q6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlY3Q7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjdCA9IHY7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmVjdCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuY2FtZXJhLnJlY3QnLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoaXMgaXMgdXNlZCB0byByZW5kZXIgcGFydHMgb2YgdGhlIHNjZW5lIHNlbGVjdGl2ZWx5LlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOWGs+WumuaRhOWDj+acuuS8mua4suafk+WcuuaZr+eahOWTquS4gOmDqOWIhuOAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gY3VsbGluZ01hc2tcbiAgICAgICAgICovXG4gICAgICAgIGN1bGxpbmdNYXNrOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jdWxsaW5nTWFzaztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3VsbGluZ01hc2sgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVDYW1lcmFNYXNrKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5jYW1lcmEuY3VsbGluZ01hc2snLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIERldGVybWluaW5nIHdoYXQgdG8gY2xlYXIgd2hlbiBjYW1lcmEgcmVuZGVyaW5nLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOWGs+WumuaRhOWDj+acuua4suafk+aXtuS8mua4hemZpOWTquS6m+eKtuaAgeOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0NhbWVyYS5DbGVhckZsYWdzfSBjbGVhckZsYWdzXG4gICAgICAgICAqL1xuICAgICAgICBjbGVhckZsYWdzOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jbGVhckZsYWdzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jbGVhckZsYWdzID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NhbWVyYSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYW1lcmEuc2V0Q2xlYXJGbGFncyh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuY2FtZXJhLmNsZWFyRmxhZ3MnLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBjb2xvciB3aXRoIHdoaWNoIHRoZSBzY3JlZW4gd2lsbCBiZSBjbGVhcmVkLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOaRhOWDj+acuueUqOS6jua4hemZpOWxj+W5leeahOiDjOaZr+iJsuOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0NvbG9yfSBiYWNrZ3JvdW5kQ29sb3JcbiAgICAgICAgICovXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYmFja2dyb3VuZENvbG9yO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2JhY2tncm91bmRDb2xvci5lcXVhbHModmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2JhY2tncm91bmRDb2xvci5zZXQodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVCYWNrZ3JvdW5kQ29sb3IoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5jYW1lcmEuYmFja2dyb3VuZENvbG9yJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBDYW1lcmEncyBkZXB0aCBpbiB0aGUgY2FtZXJhIHJlbmRlcmluZyBvcmRlci4gQ2FtZXJhcyB3aXRoIGhpZ2hlciBkZXB0aCBhcmUgcmVuZGVyZWQgYWZ0ZXIgY2FtZXJhcyB3aXRoIGxvd2VyIGRlcHRoLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOaRhOWDj+acuua3seW6puOAgueUqOS6juWGs+WumuaRhOWDj+acuueahOa4suafk+mhuuW6j++8jOWAvOi2iuWkp+a4suafk+WcqOi2iuS4iuWxguOAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZGVwdGhcbiAgICAgICAgICovXG4gICAgICAgIGRlcHRoOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9kZXB0aDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKENhbWVyYS5tYWluID09PSB0aGlzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kZXB0aCA8IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVNYWluQ2FtZXJhKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoQ2FtZXJhLm1haW4gJiYgdmFsdWUgPCBDYW1lcmEubWFpbi5fZGVwdGggJiYgX2NhbWVyYXMuaW5jbHVkZXModGhpcykpIHtcbiAgICAgICAgICAgICAgICAgICAgQ2FtZXJhLm1haW4gPSB0aGlzO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuX2RlcHRoID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NhbWVyYSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYW1lcmEuc2V0UHJpb3JpdHkodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmNhbWVyYS5kZXB0aCcsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogRGVzdGluYXRpb24gcmVuZGVyIHRleHR1cmUuXG4gICAgICAgICAqIFVzdWFsbHkgY2FtZXJhcyByZW5kZXIgZGlyZWN0bHkgdG8gc2NyZWVuLCBidXQgZm9yIHNvbWUgZWZmZWN0cyBpdCBpcyB1c2VmdWwgdG8gbWFrZSBhIGNhbWVyYSByZW5kZXIgaW50byBhIHRleHR1cmUuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5pGE5YOP5py65riy5p+T55qE55uu5qCHIFJlbmRlclRleHR1cmXjgIJcbiAgICAgICAgICog5LiA6Iis5pGE5YOP5py65Lya55u05o6l5riy5p+T5Yiw5bGP5bmV5LiK77yM5L2G5piv5pyJ5LiA5Lqb5pWI5p6c5Y+v5Lul5L2/55So5pGE5YOP5py65riy5p+T5YiwIFJlbmRlclRleHR1cmUg5LiK5YaN5a+5IFJlbmRlclRleHR1cmUg6L+b6KGM5aSE55CG5p2l5a6e546w44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7UmVuZGVyVGV4dHVyZX0gdGFyZ2V0VGV4dHVyZVxuICAgICAgICAgKi9cbiAgICAgICAgdGFyZ2V0VGV4dHVyZToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFyZ2V0VGV4dHVyZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdGFyZ2V0VGV4dHVyZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVRhcmdldFRleHR1cmUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmNhbWVyYS50YXJnZXRUZXh0dXJlJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBTZXRzIHRoZSBjYW1lcmEncyByZW5kZXIgc3RhZ2VzLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOiuvue9ruaRhOWDj+acuua4suafk+eahOmYtuautVxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gcmVuZGVyU3RhZ2VzXG4gICAgICAgICAqL1xuICAgICAgICByZW5kZXJTdGFnZXM6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlclN0YWdlcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlclN0YWdlcyA9IHZhbDtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVTdGFnZXMoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmNhbWVyYS5yZW5kZXJTdGFnZXMnLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFdoZXRoZXIgYXV0byBhbGlnbiBjYW1lcmEgdmlld3BvcnQgdG8gc2NyZWVuXG4gICAgICAgICAqICEjemgg5piv5ZCm6Ieq5Yqo5bCG5pGE5YOP5py655qE6KeG5Y+j5a+55YeG5bGP5bmVXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gYWxpZ25XaXRoU2NyZWVuXG4gICAgICAgICAqL1xuICAgICAgICBhbGlnbldpdGhTY3JlZW46IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FsaWduV2l0aFNjcmVlbjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hbGlnbldpdGhTY3JlZW4gPSB2O1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF9pczNEOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGUgJiYgdGhpcy5ub2RlLl9pczNETm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBwcmltYXJ5IGNhbWVyYSBpbiB0aGUgc2NlbmUuIFJldHVybnMgdGhlIHJlYXIgbW9zdCByZW5kZXJlZCBjYW1lcmEsIHdoaWNoIGlzIHRoZSBjYW1lcmEgd2l0aCB0aGUgbG93ZXN0IGRlcHRoLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOW9k+WJjeWcuuaZr+S4rea/gOa0u+eahOS4u+aRhOWDj+acuuOAguWwhuS8mui/lOWbnua4suafk+WcqOWxj+W5leacgOW6leWxgu+8jOS5n+WwseaYryBkZXB0aCDmnIDlsI/nmoTmkYTlg4/mnLrjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtDYW1lcmF9IG1haW5cbiAgICAgICAgICogQHN0YXRpY1xuICAgICAgICAgKi9cbiAgICAgICAgbWFpbjogbnVsbCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBBbGwgZW5hYmxlZCBjYW1lcmFzLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOW9k+WJjea/gOa0u+eahOaJgOacieaRhOWDj+acuuOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1tDYW1lcmFdfSBjYW1lcmFzXG4gICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICovXG4gICAgICAgIGNhbWVyYXM6IF9jYW1lcmFzLFxuXG4gICAgICAgIENsZWFyRmxhZ3M6IENsZWFyRmxhZ3MsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogR2V0IHRoZSBmaXJzdCBjYW1lcmEgd2hpY2ggdGhlIG5vZGUgYmVsb25nIHRvLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOiOt+WPluiKgueCueaJgOWcqOeahOesrOS4gOS4quaRhOWDj+acuuOAglxuICAgICAgICAgKiBAbWV0aG9kIGZpbmRDYW1lcmFcbiAgICAgICAgICogQHBhcmFtIHtOb2RlfSBub2RlIFxuICAgICAgICAgKiBAcmV0dXJuIHtDYW1lcmF9XG4gICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICovXG4gICAgICAgIGZpbmRDYW1lcmEgKG5vZGUpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gX2NhbWVyYXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNhbWVyYSA9IF9jYW1lcmFzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChjYW1lcmEuY29udGFpbnNOb2RlKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYW1lcmE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICBfZmluZFJlbmRlcmVyQ2FtZXJhIChub2RlKSB7XG4gICAgICAgICAgICBsZXQgY2FtZXJhcyA9IHJlbmRlcmVyLnNjZW5lLl9jYW1lcmFzO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYW1lcmFzLl9jb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNhbWVyYXMuX2RhdGFbaV0uX2N1bGxpbmdNYXNrICYgbm9kZS5fY3VsbGluZ01hc2spIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbWVyYXMuX2RhdGFbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3NldHVwRGVidWdDYW1lcmEgKCkge1xuICAgICAgICAgICAgaWYgKF9kZWJ1Z0NhbWVyYSkgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKGdhbWUucmVuZGVyVHlwZSA9PT0gZ2FtZS5SRU5ERVJfVFlQRV9DQU5WQVMpIHJldHVybjtcbiAgICAgICAgICAgIGxldCBjYW1lcmEgPSBuZXcgUmVuZGVyZXJDYW1lcmEoKTtcbiAgICAgICAgICAgIF9kZWJ1Z0NhbWVyYSA9IGNhbWVyYTtcblxuICAgICAgICAgICAgY2FtZXJhLnNldFN0YWdlcyhbXG4gICAgICAgICAgICAgICAgJ29wYXF1ZScsXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2FtZXJhLnNldEZvdihNYXRoLlBJICogNjAgLyAxODApO1xuICAgICAgICAgICAgY2FtZXJhLnNldE5lYXIoMC4xKTtcbiAgICAgICAgICAgIGNhbWVyYS5zZXRGYXIoNDA5Nik7XG5cbiAgICAgICAgICAgIGNhbWVyYS5kaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgIGNhbWVyYS5jdWxsaW5nTWFzayA9IDEgPDwgY2MuTm9kZS5CdWlsdGluR3JvdXBJbmRleC5ERUJVRztcbiAgICAgICAgICAgIGNhbWVyYS5zZXRQcmlvcml0eShjYy5tYWNyby5NQVhfWklOREVYKTtcbiAgICAgICAgICAgIGNhbWVyYS5zZXRDbGVhckZsYWdzKDApO1xuICAgICAgICAgICAgY2FtZXJhLnNldENvbG9yKDAsIDAsIDAsIDApO1xuXG4gICAgICAgICAgICBsZXQgbm9kZSA9IG5ldyBjYy5Ob2RlKCk7XG4gICAgICAgICAgICBjYW1lcmEuc2V0Tm9kZShub2RlKTtcblxuICAgICAgICAgICAgcmVwb3NpdGlvbkRlYnVnQ2FtZXJhKCk7XG4gICAgICAgICAgICBjYy52aWV3Lm9uKCdkZXNpZ24tcmVzb2x1dGlvbi1jaGFuZ2VkJywgcmVwb3NpdGlvbkRlYnVnQ2FtZXJhKTtcblxuICAgICAgICAgICAgcmVuZGVyZXIuc2NlbmUuYWRkQ2FtZXJhKGNhbWVyYSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VwZGF0ZUNhbWVyYU1hc2sgKCkge1xuICAgICAgICBpZiAodGhpcy5fY2FtZXJhKSB7XG4gICAgICAgICAgICBsZXQgbWFzayA9IHRoaXMuX2N1bGxpbmdNYXNrICYgKH4oMSA8PCBjYy5Ob2RlLkJ1aWx0aW5Hcm91cEluZGV4LkRFQlVHKSk7XG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEuY3VsbGluZ01hc2sgPSBtYXNrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVCYWNrZ3JvdW5kQ29sb3IgKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2NhbWVyYSkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBjb2xvciA9IHRoaXMuX2JhY2tncm91bmRDb2xvcjtcbiAgICAgICAgdGhpcy5fY2FtZXJhLnNldENvbG9yKFxuICAgICAgICAgICAgY29sb3IuciAvIDI1NSxcbiAgICAgICAgICAgIGNvbG9yLmcgLyAyNTUsXG4gICAgICAgICAgICBjb2xvci5iIC8gMjU1LFxuICAgICAgICAgICAgY29sb3IuYSAvIDI1NSxcbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZVRhcmdldFRleHR1cmUgKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2NhbWVyYSkgcmV0dXJuO1xuXG4gICAgICAgIGxldCB0ZXh0dXJlID0gdGhpcy5fdGFyZ2V0VGV4dHVyZTtcbiAgICAgICAgdGhpcy5fY2FtZXJhLnNldEZyYW1lQnVmZmVyKHRleHR1cmUgPyB0ZXh0dXJlLl9mcmFtZWJ1ZmZlciA6IG51bGwpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlQ2xpcHBpbmdwUGxhbmVzICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jYW1lcmEpIHJldHVybjtcbiAgICAgICAgdGhpcy5fY2FtZXJhLnNldE5lYXIodGhpcy5fbmVhckNsaXApO1xuICAgICAgICB0aGlzLl9jYW1lcmEuc2V0RmFyKHRoaXMuX2ZhckNsaXApO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlUHJvamVjdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fY2FtZXJhKSByZXR1cm47XG4gICAgICAgIGxldCB0eXBlID0gdGhpcy5fb3J0aG8gPyAxIDogMDtcbiAgICAgICAgdGhpcy5fY2FtZXJhLnNldFR5cGUodHlwZSk7XG4gICAgfSxcblxuICAgIF91cGRhdGVSZWN0ICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jYW1lcmEpIHJldHVybjtcbiAgICAgICAgbGV0IHJlY3QgPSB0aGlzLl9yZWN0O1xuICAgICAgICB0aGlzLl9jYW1lcmEuc2V0UmVjdChyZWN0LngsIHJlY3QueSwgcmVjdC53aWR0aCwgcmVjdC5oZWlnaHQpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlU3RhZ2VzICgpIHtcbiAgICAgICAgbGV0IGZsYWdzID0gdGhpcy5fcmVuZGVyU3RhZ2VzO1xuICAgICAgICBsZXQgc3RhZ2VzID0gW107XG4gICAgICAgIGlmIChmbGFncyAmIFN0YWdlRmxhZ3MuT1BBUVVFKSB7XG4gICAgICAgICAgICBzdGFnZXMucHVzaCgnb3BhcXVlJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZsYWdzICYgU3RhZ2VGbGFncy5UUkFOU1BBUkVOVCkge1xuICAgICAgICAgICAgc3RhZ2VzLnB1c2goJ3RyYW5zcGFyZW50Jyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2FtZXJhLnNldFN0YWdlcyhzdGFnZXMpO1xuICAgIH0sXG5cbiAgICBfaW5pdCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbml0ZWQpIHJldHVybjtcbiAgICAgICAgdGhpcy5faW5pdGVkID0gdHJ1ZTtcblxuICAgICAgICBsZXQgY2FtZXJhID0gdGhpcy5fY2FtZXJhO1xuICAgICAgICBpZiAoIWNhbWVyYSkgcmV0dXJuO1xuICAgICAgICBjYW1lcmEuc2V0Tm9kZSh0aGlzLm5vZGUpO1xuICAgICAgICBjYW1lcmEuc2V0Q2xlYXJGbGFncyh0aGlzLl9jbGVhckZsYWdzKTtcbiAgICAgICAgY2FtZXJhLnNldFByaW9yaXR5KHRoaXMuX2RlcHRoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlQmFja2dyb3VuZENvbG9yKCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUNhbWVyYU1hc2soKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlVGFyZ2V0VGV4dHVyZSgpO1xuICAgICAgICB0aGlzLl91cGRhdGVDbGlwcGluZ3BQbGFuZXMoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlUHJvamVjdGlvbigpO1xuICAgICAgICB0aGlzLl91cGRhdGVTdGFnZXMoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlUmVjdCgpO1xuXG4gICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB0aGlzLmJlZm9yZURyYXcoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfX3ByZWxvYWQgKCkge1xuICAgICAgICB0aGlzLl9pbml0KCk7XG4gICAgfSxcblxuICAgIG9uRW5hYmxlICgpIHtcbiAgICAgICAgaWYgKCFDQ19FRElUT1IgJiYgZ2FtZS5yZW5kZXJUeXBlICE9PSBnYW1lLlJFTkRFUl9UWVBFX0NBTlZBUykge1xuICAgICAgICAgICAgY2MuZGlyZWN0b3Iub24oY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX0RSQVcsIHRoaXMuYmVmb3JlRHJhdywgdGhpcyk7XG4gICAgICAgICAgICByZW5kZXJlci5zY2VuZS5hZGRDYW1lcmEodGhpcy5fY2FtZXJhKTtcbiAgICAgICAgfVxuICAgICAgICBfY2FtZXJhcy5wdXNoKHRoaXMpO1xuICAgICAgICBpZiAoIUNhbWVyYS5tYWluIHx8ICh0aGlzLl9kZXB0aCA8IENhbWVyYS5tYWluLl9kZXB0aCkpIHtcbiAgICAgICAgICAgIENhbWVyYS5tYWluID0gdGhpcztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkRpc2FibGUgKCkge1xuICAgICAgICBpZiAoIUNDX0VESVRPUiAmJiBnYW1lLnJlbmRlclR5cGUgIT09IGdhbWUuUkVOREVSX1RZUEVfQ0FOVkFTKSB7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5vZmYoY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX0RSQVcsIHRoaXMuYmVmb3JlRHJhdywgdGhpcyk7XG4gICAgICAgICAgICByZW5kZXJlci5zY2VuZS5yZW1vdmVDYW1lcmEodGhpcy5fY2FtZXJhKTtcbiAgICAgICAgfVxuICAgICAgICBjYy5qcy5hcnJheS5mYXN0UmVtb3ZlKF9jYW1lcmFzLCB0aGlzKTtcbiAgICAgICAgaWYgKENhbWVyYS5tYWluID09PSB0aGlzKSB7XG4gICAgICAgICAgICBDYW1lcmEubWFpbiA9IG51bGw7XG4gICAgICAgICAgICB1cGRhdGVNYWluQ2FtZXJhKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldCB0aGUgc2NyZWVuIHRvIHdvcmxkIG1hdHJpeCwgb25seSBzdXBwb3J0IDJEIGNhbWVyYSB3aGljaCBhbGlnbldpdGhTY3JlZW4gaXMgdHJ1ZS5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5bGP5bmV5Z2Q5qCH57O75Yiw5LiW55WM5Z2Q5qCH57O755qE55+p6Zi177yM5Y+q6YCC55So5LqOIGFsaWduV2l0aFNjcmVlbiDkuLogdHJ1ZSDnmoQgMkQg5pGE5YOP5py644CCXG4gICAgICogQG1ldGhvZCBnZXRTY3JlZW5Ub1dvcmxkTWF0cml4MkRcbiAgICAgKiBAcGFyYW0ge01hdDR9IG91dCAtIHRoZSBtYXRyaXggdG8gcmVjZWl2ZSB0aGUgcmVzdWx0XG4gICAgICogQHJldHVybiB7TWF0NH0gb3V0XG4gICAgICovXG4gICAgZ2V0U2NyZWVuVG9Xb3JsZE1hdHJpeDJEIChvdXQpIHtcbiAgICAgICAgdGhpcy5nZXRXb3JsZFRvU2NyZWVuTWF0cml4MkQob3V0KTtcbiAgICAgICAgTWF0NC5pbnZlcnQob3V0LCBvdXQpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0IHRoZSB3b3JsZCB0byBjYW1lcmEgbWF0cml4LCBvbmx5IHN1cHBvcnQgMkQgY2FtZXJhIHdoaWNoIGFsaWduV2l0aFNjcmVlbiBpcyB0cnVlLlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bkuJbnlYzlnZDmoIfns7vliLDmkYTlg4/mnLrlnZDmoIfns7vnmoTnn6npmLXvvIzlj6rpgILnlKjkuo4gYWxpZ25XaXRoU2NyZWVuIOS4uiB0cnVlIOeahCAyRCDmkYTlg4/mnLrjgIJcbiAgICAgKiBAbWV0aG9kIGdldFdvcmxkVG9TY3JlZW5NYXRyaXgyRFxuICAgICAqIEBwYXJhbSB7TWF0NH0gb3V0IC0gdGhlIG1hdHJpeCB0byByZWNlaXZlIHRoZSByZXN1bHRcbiAgICAgKiBAcmV0dXJuIHtNYXQ0fSBvdXRcbiAgICAgKi9cbiAgICBnZXRXb3JsZFRvU2NyZWVuTWF0cml4MkQgKG91dCkge1xuICAgICAgICB0aGlzLm5vZGUuZ2V0V29ybGRSVChfbWF0NF90ZW1wXzEpO1xuXG4gICAgICAgIGxldCB6b29tUmF0aW8gPSB0aGlzLnpvb21SYXRpbztcbiAgICAgICAgbGV0IF9tYXQ0X3RlbXBfMW0gPSBfbWF0NF90ZW1wXzEubTtcbiAgICAgICAgX21hdDRfdGVtcF8xbVswXSAqPSB6b29tUmF0aW87XG4gICAgICAgIF9tYXQ0X3RlbXBfMW1bMV0gKj0gem9vbVJhdGlvO1xuICAgICAgICBfbWF0NF90ZW1wXzFtWzRdICo9IHpvb21SYXRpbztcbiAgICAgICAgX21hdDRfdGVtcF8xbVs1XSAqPSB6b29tUmF0aW87XG5cbiAgICAgICAgbGV0IG0xMiA9IF9tYXQ0X3RlbXBfMW1bMTJdO1xuICAgICAgICBsZXQgbTEzID0gX21hdDRfdGVtcF8xbVsxM107XG5cbiAgICAgICAgbGV0IGNlbnRlciA9IGNjLnZpc2libGVSZWN0LmNlbnRlcjtcbiAgICAgICAgX21hdDRfdGVtcF8xbVsxMl0gPSBjZW50ZXIueCAtIChfbWF0NF90ZW1wXzFtWzBdICogbTEyICsgX21hdDRfdGVtcF8xbVs0XSAqIG0xMyk7XG4gICAgICAgIF9tYXQ0X3RlbXBfMW1bMTNdID0gY2VudGVyLnkgLSAoX21hdDRfdGVtcF8xbVsxXSAqIG0xMiArIF9tYXQ0X3RlbXBfMW1bNV0gKiBtMTMpO1xuXG4gICAgICAgIGlmIChvdXQgIT09IF9tYXQ0X3RlbXBfMSkge1xuICAgICAgICAgICAgTWF0NC5jb3B5KG91dCwgX21hdDRfdGVtcF8xKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ29udmVydCBwb2ludCBmcm9tIHNjcmVlbiB0byB3b3JsZC5cbiAgICAgKiAhI3poXG4gICAgICog5bCG5Z2Q5qCH5LuO5bGP5bmV5Z2Q5qCH57O76L2s5o2i5Yiw5LiW55WM5Z2Q5qCH57O744CCXG4gICAgICogQG1ldGhvZCBnZXRTY3JlZW5Ub1dvcmxkUG9pbnRcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjMn0gc2NyZWVuUG9zaXRpb24gXG4gICAgICogQHBhcmFtIHtWZWMzfFZlYzJ9IFtvdXRdIFxuICAgICAqIEByZXR1cm4ge1ZlYzN8VmVjMn0gb3V0XG4gICAgICovXG4gICAgZ2V0U2NyZWVuVG9Xb3JsZFBvaW50IChzY3JlZW5Qb3NpdGlvbiwgb3V0KSB7XG4gICAgICAgIGlmICh0aGlzLm5vZGUuaXMzRE5vZGUpIHtcbiAgICAgICAgICAgIG91dCA9IG91dCB8fCBuZXcgY2MuVmVjMygpO1xuICAgICAgICAgICAgdGhpcy5fY2FtZXJhLnNjcmVlblRvV29ybGQob3V0LCBzY3JlZW5Qb3NpdGlvbiwgY2MudmlzaWJsZVJlY3Qud2lkdGgsIGNjLnZpc2libGVSZWN0LmhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IGNjLlZlYzIoKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0U2NyZWVuVG9Xb3JsZE1hdHJpeDJEKF9tYXQ0X3RlbXBfMSk7XG4gICAgICAgICAgICBWZWMyLnRyYW5zZm9ybU1hdDQob3V0LCBzY3JlZW5Qb3NpdGlvbiwgX21hdDRfdGVtcF8xKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ29udmVydCBwb2ludCBmcm9tIHdvcmxkIHRvIHNjcmVlbi5cbiAgICAgKiAhI3poXG4gICAgICog5bCG5Z2Q5qCH5LuO5LiW55WM5Z2Q5qCH57O76L2s5YyW5Yiw5bGP5bmV5Z2Q5qCH57O744CCXG4gICAgICogQG1ldGhvZCBnZXRXb3JsZFRvU2NyZWVuUG9pbnRcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjMn0gd29ybGRQb3NpdGlvbiBcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjMn0gW291dF0gXG4gICAgICogQHJldHVybiB7VmVjM3xWZWMyfSBvdXRcbiAgICAgKi9cbiAgICBnZXRXb3JsZFRvU2NyZWVuUG9pbnQgKHdvcmxkUG9zaXRpb24sIG91dCkge1xuICAgICAgICBpZiAodGhpcy5ub2RlLmlzM0ROb2RlKSB7XG4gICAgICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IGNjLlZlYzMoKTtcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYS53b3JsZFRvU2NyZWVuKG91dCwgd29ybGRQb3NpdGlvbiwgY2MudmlzaWJsZVJlY3Qud2lkdGgsIGNjLnZpc2libGVSZWN0LmhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IGNjLlZlYzIoKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0V29ybGRUb1NjcmVlbk1hdHJpeDJEKF9tYXQ0X3RlbXBfMSk7XG4gICAgICAgICAgICBWZWMyLnRyYW5zZm9ybU1hdDQob3V0LCB3b3JsZFBvc2l0aW9uLCBfbWF0NF90ZW1wXzEpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0IGEgcmF5IGZyb20gc2NyZWVuIHBvc2l0aW9uXG4gICAgICogISN6aFxuICAgICAqIOS7juWxj+W5leWdkOagh+iOt+WPluS4gOadoeWwhOe6v1xuICAgICAqIEBtZXRob2QgZ2V0UmF5XG4gICAgICogQHBhcmFtIHtWZWMyfSBzY3JlZW5Qb3NcbiAgICAgKiBAcmV0dXJuIHtSYXl9XG4gICAgICovXG4gICAgZ2V0UmF5IChzY3JlZW5Qb3MpIHtcbiAgICAgICAgaWYgKCFjYy5nZW9tVXRpbHMpIHJldHVybiBzY3JlZW5Qb3M7XG4gICAgICAgIFxuICAgICAgICBWZWMzLnNldChfdjNfdGVtcF8zLCBzY3JlZW5Qb3MueCwgc2NyZWVuUG9zLnksIDEpO1xuICAgICAgICB0aGlzLl9jYW1lcmEuc2NyZWVuVG9Xb3JsZChfdjNfdGVtcF8yLCBfdjNfdGVtcF8zLCBjYy52aXNpYmxlUmVjdC53aWR0aCwgY2MudmlzaWJsZVJlY3QuaGVpZ2h0KTtcblxuICAgICAgICBpZiAodGhpcy5vcnRobykge1xuICAgICAgICAgICAgVmVjMy5zZXQoX3YzX3RlbXBfMywgc2NyZWVuUG9zLngsIHNjcmVlblBvcy55LCAtMSk7XG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEuc2NyZWVuVG9Xb3JsZChfdjNfdGVtcF8xLCBfdjNfdGVtcF8zLCBjYy52aXNpYmxlUmVjdC53aWR0aCwgY2MudmlzaWJsZVJlY3QuaGVpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5nZXRXb3JsZFBvc2l0aW9uKF92M190ZW1wXzEpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFJheS5mcm9tUG9pbnRzKG5ldyBSYXkoKSwgX3YzX3RlbXBfMSwgX3YzX3RlbXBfMik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDaGVjayB3aGV0aGVyIHRoZSBub2RlIGlzIGluIHRoZSBjYW1lcmEuXG4gICAgICogISN6aFxuICAgICAqIOajgOa1i+iKgueCueaYr+WQpuiiq+atpOaRhOWDj+acuuW9seWTjVxuICAgICAqIEBtZXRob2QgY29udGFpbnNOb2RlXG4gICAgICogQHBhcmFtIHtOb2RlfSBub2RlIC0gdGhlIG5vZGUgd2hpY2ggbmVlZCB0byBjaGVja1xuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgY29udGFpbnNOb2RlIChub2RlKSB7XG4gICAgICAgIHJldHVybiAobm9kZS5fY3VsbGluZ01hc2sgJiB0aGlzLmN1bGxpbmdNYXNrKSA+IDA7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZW5kZXIgdGhlIGNhbWVyYSBtYW51YWxseS5cbiAgICAgKiAhI3poXG4gICAgICog5omL5Yqo5riy5p+T5pGE5YOP5py644CCXG4gICAgICogQG1ldGhvZCByZW5kZXJcbiAgICAgKiBAcGFyYW0ge05vZGV9IFtyb290Tm9kZV0gXG4gICAgICovXG4gICAgcmVuZGVyIChyb290Tm9kZSkge1xuICAgICAgICByb290Tm9kZSA9IHJvb3ROb2RlIHx8IGNjLmRpcmVjdG9yLmdldFNjZW5lKCk7XG4gICAgICAgIGlmICghcm9vdE5vZGUpIHJldHVybiBudWxsO1xuXG4gICAgICAgIC8vIGZvcmNlIHVwZGF0ZSBub2RlIHdvcmxkIG1hdHJpeFxuICAgICAgICB0aGlzLm5vZGUuZ2V0V29ybGRNYXRyaXgoX21hdDRfdGVtcF8xKTtcbiAgICAgICAgdGhpcy5iZWZvcmVEcmF3KCk7XG5cbiAgICAgICAgUmVuZGVyRmxvdy5yZW5kZXJDYW1lcmEodGhpcy5fY2FtZXJhLCByb290Tm9kZSk7XG4gICAgfSxcblxuICAgIF9vbkFsaWduV2l0aFNjcmVlbiAoKSB7XG4gICAgICAgIGxldCBoZWlnaHQgPSBjYy5nYW1lLmNhbnZhcy5oZWlnaHQgLyBjYy52aWV3Ll9zY2FsZVk7XG5cbiAgICAgICAgbGV0IHRhcmdldFRleHR1cmUgPSB0aGlzLl90YXJnZXRUZXh0dXJlO1xuICAgICAgICBpZiAodGFyZ2V0VGV4dHVyZSkge1xuICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IGNjLmVuZ2luZS5nZXREZXNpZ25SZXNvbHV0aW9uU2l6ZSgpLmhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IGNjLnZpc2libGVSZWN0LmhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmb3YgPSB0aGlzLl9mb3YgKiBjYy5tYWNyby5SQUQ7XG4gICAgICAgIHRoaXMubm9kZS56ID0gaGVpZ2h0IC8gKE1hdGgudGFuKGZvdiAvIDIpICogMik7XG5cbiAgICAgICAgZm92ID0gTWF0aC5hdGFuKE1hdGgudGFuKGZvdiAvIDIpIC8gdGhpcy56b29tUmF0aW8pICogMjtcbiAgICAgICAgdGhpcy5fY2FtZXJhLnNldEZvdihmb3YpO1xuICAgICAgICB0aGlzLl9jYW1lcmEuc2V0T3J0aG9IZWlnaHQoaGVpZ2h0IC8gMiAvIHRoaXMuem9vbVJhdGlvKTtcbiAgICAgICAgdGhpcy5ub2RlLnNldFJvdGF0aW9uKDAsIDAsIDAsIDEpO1xuICAgIH0sXG5cbiAgICBiZWZvcmVEcmF3ICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jYW1lcmEpIHJldHVybjtcblxuICAgICAgICBpZiAodGhpcy5fYWxpZ25XaXRoU2NyZWVuKSB7XG4gICAgICAgICAgICB0aGlzLl9vbkFsaWduV2l0aFNjcmVlbigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IGZvdiA9IHRoaXMuX2ZvdiAqIGNjLm1hY3JvLlJBRDtcbiAgICAgICAgICAgIGZvdiA9IE1hdGguYXRhbihNYXRoLnRhbihmb3YgLyAyKSAvIHRoaXMuem9vbVJhdGlvKSAqIDI7XG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEuc2V0Rm92KGZvdik7XG5cbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYS5zZXRPcnRob0hlaWdodCh0aGlzLl9vcnRob1NpemUgLyB0aGlzLnpvb21SYXRpbyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jYW1lcmEuZGlydHkgPSB0cnVlO1xuICAgIH1cbn0pO1xuXG4vLyBkZXByZWNhdGVkXG5jYy5qcy5taXhpbihDYW1lcmEucHJvdG90eXBlLCB7XG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgdGhlIG1hdHJpeCB0aGF0IHRyYW5zZm9ybSB0aGUgbm9kZSdzIChsb2NhbCkgc3BhY2UgY29vcmRpbmF0ZXMgaW50byB0aGUgY2FtZXJhJ3Mgc3BhY2UgY29vcmRpbmF0ZXMuXG4gICAgICogISN6aFxuICAgICAqIOi/lOWbnuS4gOS4quWwhuiKgueCueWdkOagh+ezu+i9rOaNouWIsOaRhOWDj+acuuWdkOagh+ezu+S4i+eahOefqemYtVxuICAgICAqIEBtZXRob2QgZ2V0Tm9kZVRvQ2FtZXJhVHJhbnNmb3JtXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMC4wXG4gICAgICogQHBhcmFtIHtOb2RlfSBub2RlIC0gdGhlIG5vZGUgd2hpY2ggc2hvdWxkIHRyYW5zZm9ybVxuICAgICAqIEByZXR1cm4ge0FmZmluZVRyYW5zZm9ybX1cbiAgICAgKi9cbiAgICBnZXROb2RlVG9DYW1lcmFUcmFuc2Zvcm0gKG5vZGUpIHtcbiAgICAgICAgbGV0IG91dCA9IEFmZmluZVRyYW5zLmlkZW50aXR5KCk7XG4gICAgICAgIG5vZGUuZ2V0V29ybGRNYXRyaXgoX21hdDRfdGVtcF8yKTtcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbnNOb2RlKG5vZGUpKSB7XG4gICAgICAgICAgICB0aGlzLmdldFdvcmxkVG9DYW1lcmFNYXRyaXgoX21hdDRfdGVtcF8xKTtcbiAgICAgICAgICAgIE1hdDQubXVsKF9tYXQ0X3RlbXBfMiwgX21hdDRfdGVtcF8yLCBfbWF0NF90ZW1wXzEpO1xuICAgICAgICB9XG4gICAgICAgIEFmZmluZVRyYW5zLmZyb21NYXQ0KG91dCwgX21hdDRfdGVtcF8yKTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIENvbnZlciBhIGNhbWVyYSBjb29yZGluYXRlcyBwb2ludCB0byB3b3JsZCBjb29yZGluYXRlcy5cbiAgICAgKiAhI3poXG4gICAgICog5bCG5LiA5Liq5pGE5YOP5py65Z2Q5qCH57O75LiL55qE54K56L2s5o2i5Yiw5LiW55WM5Z2Q5qCH57O75LiL44CCXG4gICAgICogQG1ldGhvZCBnZXRDYW1lcmFUb1dvcmxkUG9pbnRcbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4xLjNcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHBvaW50IC0gdGhlIHBvaW50IHdoaWNoIHNob3VsZCB0cmFuc2Zvcm1cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IFtvdXRdIC0gdGhlIHBvaW50IHRvIHJlY2VpdmUgdGhlIHJlc3VsdFxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IG91dFxuICAgICAqL1xuICAgIGdldENhbWVyYVRvV29ybGRQb2ludCAocG9pbnQsIG91dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRTY3JlZW5Ub1dvcmxkUG9pbnQocG9pbnQsIG91dCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDb252ZXIgYSB3b3JsZCBjb29yZGluYXRlcyBwb2ludCB0byBjYW1lcmEgY29vcmRpbmF0ZXMuXG4gICAgICogISN6aFxuICAgICAqIOWwhuS4gOS4quS4lueVjOWdkOagh+ezu+S4i+eahOeCuei9rOaNouWIsOaRhOWDj+acuuWdkOagh+ezu+S4i+OAglxuICAgICAqIEBtZXRob2QgZ2V0V29ybGRUb0NhbWVyYVBvaW50XG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMS4zXG4gICAgICogQHBhcmFtIHtWZWMyfSBwb2ludCBcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IFtvdXRdIC0gdGhlIHBvaW50IHRvIHJlY2VpdmUgdGhlIHJlc3VsdFxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IG91dFxuICAgICAqL1xuICAgIGdldFdvcmxkVG9DYW1lcmFQb2ludCAocG9pbnQsIG91dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRXb3JsZFRvU2NyZWVuUG9pbnQocG9pbnQsIG91dCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgdGhlIGNhbWVyYSB0byB3b3JsZCBtYXRyaXhcbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5pGE5YOP5py65Z2Q5qCH57O75Yiw5LiW55WM5Z2Q5qCH57O755qE55+p6Zi1XG4gICAgICogQG1ldGhvZCBnZXRDYW1lcmFUb1dvcmxkTWF0cml4XG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMS4zXG4gICAgICogQHBhcmFtIHtNYXQ0fSBvdXQgLSB0aGUgbWF0cml4IHRvIHJlY2VpdmUgdGhlIHJlc3VsdFxuICAgICAqIEByZXR1cm4ge01hdDR9IG91dFxuICAgICAqL1xuICAgIGdldENhbWVyYVRvV29ybGRNYXRyaXggKG91dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRTY3JlZW5Ub1dvcmxkTWF0cml4MkQob3V0KTtcbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0IHRoZSB3b3JsZCB0byBjYW1lcmEgbWF0cml4XG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluS4lueVjOWdkOagh+ezu+WIsOaRhOWDj+acuuWdkOagh+ezu+eahOefqemYtVxuICAgICAqIEBtZXRob2QgZ2V0V29ybGRUb0NhbWVyYU1hdHJpeFxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjEuM1xuICAgICAqIEBwYXJhbSB7TWF0NH0gb3V0IC0gdGhlIG1hdHJpeCB0byByZWNlaXZlIHRoZSByZXN1bHRcbiAgICAgKiBAcmV0dXJuIHtNYXQ0fSBvdXRcbiAgICAgKi9cbiAgICBnZXRXb3JsZFRvQ2FtZXJhTWF0cml4IChvdXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0V29ybGRUb1NjcmVlbk1hdHJpeDJEKG91dCk7XG4gICAgfSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNjLkNhbWVyYSA9IENhbWVyYTtcbiJdLCJzb3VyY2VSb290IjoiLyJ9