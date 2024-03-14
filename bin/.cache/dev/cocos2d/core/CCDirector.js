
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/CCDirector.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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
var EventTarget = require('./event/event-target');

var ComponentScheduler = require('./component-scheduler');

var NodeActivator = require('./node-activator');

var Obj = require('./platform/CCObject');

var game = require('./CCGame');

var renderer = require('./renderer');

var eventManager = require('./event-manager');

var Scheduler = require('./CCScheduler'); //----------------------------------------------------------------------------------------------------------------------

/**
 * !#en
 * <p>
 *    ATTENTION: USE cc.director INSTEAD OF cc.Director.<br/>
 *    cc.director is a singleton object which manage your game's logic flow.<br/>
 *    Since the cc.director is a singleton, you don't need to call any constructor or create functions,<br/>
 *    the standard way to use it is by calling:<br/>
 *      - cc.director.methodName(); <br/>
 *
 *    It creates and handle the main Window and manages how and when to execute the Scenes.<br/>
 *    <br/>
 *    The cc.director is also responsible for:<br/>
 *      - initializing the OpenGL context<br/>
 *      - setting the OpenGL pixel format (default on is RGB565)<br/>
 *      - setting the OpenGL buffer depth (default on is 0-bit)<br/>
 *      - setting the color for clear screen (default one is BLACK)<br/>
 *      - setting the projection (default one is 3D)<br/>
 *      - setting the orientation (default one is Portrait)<br/>
 *      <br/>
 *    <br/>
 *    The cc.director also sets the default OpenGL context:<br/>
 *      - GL_TEXTURE_2D is enabled<br/>
 *      - GL_VERTEX_ARRAY is enabled<br/>
 *      - GL_COLOR_ARRAY is enabled<br/>
 *      - GL_TEXTURE_COORD_ARRAY is enabled<br/>
 * </p>
 * <p>
 *   cc.director also synchronizes timers with the refresh rate of the display.<br/>
 *   Features and Limitations:<br/>
 *      - Scheduled timers & drawing are synchronizes with the refresh rate of the display<br/>
 *      - Only supports animation intervals of 1/60 1/30 & 1/15<br/>
 * </p>
 *
 * !#zh
 * <p>
 *     注意：用 cc.director 代替 cc.Director。<br/>
 *     cc.director 一个管理你的游戏的逻辑流程的单例对象。<br/>
 *     由于 cc.director 是一个单例，你不需要调用任何构造函数或创建函数，<br/>
 *     使用它的标准方法是通过调用：<br/>
 *       - cc.director.methodName();
 *     <br/>
 *     它创建和处理主窗口并且管理什么时候执行场景。<br/>
 *     <br/>
 *     cc.director 还负责：<br/>
 *      - 初始化 OpenGL 环境。<br/>
 *      - 设置OpenGL像素格式。(默认是 RGB565)<br/>
 *      - 设置OpenGL缓冲区深度 (默认是 0-bit)<br/>
 *      - 设置空白场景的颜色 (默认是 黑色)<br/>
 *      - 设置投影 (默认是 3D)<br/>
 *      - 设置方向 (默认是 Portrait)<br/>
 *    <br/>
 *    cc.director 设置了 OpenGL 默认环境 <br/>
 *      - GL_TEXTURE_2D   启用。<br/>
 *      - GL_VERTEX_ARRAY 启用。<br/>
 *      - GL_COLOR_ARRAY  启用。<br/>
 *      - GL_TEXTURE_COORD_ARRAY 启用。<br/>
 * </p>
 * <p>
 *   cc.director 也同步定时器与显示器的刷新速率。
 *   <br/>
 *   特点和局限性: <br/>
 *      - 将计时器 & 渲染与显示器的刷新频率同步。<br/>
 *      - 只支持动画的间隔 1/60 1/30 & 1/15。<br/>
 * </p>
 *
 * @class Director
 * @extends EventTarget
 */


cc.Director = function () {
  EventTarget.call(this); // paused?

  this._paused = false; // purge?

  this._purgeDirectorInNextLoop = false;
  this._winSizeInPoints = null; // scenes

  this._scene = null;
  this._loadingScene = ''; // FPS

  this._totalFrames = 0;
  this._lastUpdate = 0;
  this._deltaTime = 0.0;
  this._startTime = 0.0; // ParticleSystem max step delta time

  this._maxParticleDeltaTime = 0.0; // Scheduler for user registration update

  this._scheduler = null; // Scheduler for life-cycle methods in component

  this._compScheduler = null; // Node activator

  this._nodeActivator = null; // Action manager

  this._actionManager = null;
  var self = this;
  game.on(game.EVENT_SHOW, function () {
    self._lastUpdate = performance.now();
  });
  game.once(game.EVENT_ENGINE_INITED, this.init, this);
};

cc.Director.prototype = {
  constructor: cc.Director,
  init: function init() {
    this._totalFrames = 0;
    this._lastUpdate = performance.now();
    this._startTime = this._lastUpdate;
    this._paused = false;
    this._purgeDirectorInNextLoop = false;
    this._winSizeInPoints = cc.size(0, 0);
    this._scheduler = new Scheduler();

    if (cc.ActionManager) {
      this._actionManager = new cc.ActionManager();

      this._scheduler.scheduleUpdate(this._actionManager, Scheduler.PRIORITY_SYSTEM, false);
    } else {
      this._actionManager = null;
    }

    this.sharedInit();
    return true;
  },

  /*
   * Manage all init process shared between the web engine and jsb engine.
   * All platform independent init process should be occupied here.
   */
  sharedInit: function sharedInit() {
    this._compScheduler = new ComponentScheduler();
    this._nodeActivator = new NodeActivator(); // Event manager

    if (eventManager) {
      eventManager.setEnabled(true);
    } // Animation manager


    if (cc.AnimationManager) {
      this._animationManager = new cc.AnimationManager();

      this._scheduler.scheduleUpdate(this._animationManager, Scheduler.PRIORITY_SYSTEM, false);
    } else {
      this._animationManager = null;
    } // collision manager


    if (cc.CollisionManager) {
      this._collisionManager = new cc.CollisionManager();

      this._scheduler.scheduleUpdate(this._collisionManager, Scheduler.PRIORITY_SYSTEM, false);
    } else {
      this._collisionManager = null;
    } // physics manager


    if (cc.PhysicsManager) {
      this._physicsManager = new cc.PhysicsManager();

      this._scheduler.scheduleUpdate(this._physicsManager, Scheduler.PRIORITY_SYSTEM, false);
    } else {
      this._physicsManager = null;
    } // physics 3d manager


    if (cc.Physics3DManager && (CC_PHYSICS_BUILTIN || CC_PHYSICS_CANNON)) {
      this._physics3DManager = new cc.Physics3DManager();

      this._scheduler.scheduleUpdate(this._physics3DManager, Scheduler.PRIORITY_SYSTEM, false);
    } else {
      this._physics3DManager = null;
    } // WidgetManager


    if (cc._widgetManager) {
      cc._widgetManager.init(this);
    }
  },

  /**
   * calculates delta time since last time it was called
   */
  calculateDeltaTime: function calculateDeltaTime(now) {
    if (!now) now = performance.now(); // avoid delta time from being negative
    // negative deltaTime would be caused by the precision of now's value, for details please see: https://developer.mozilla.org/zh-CN/docs/Web/API/window/requestAnimationFrame

    this._deltaTime = now > this._lastUpdate ? (now - this._lastUpdate) / 1000 : 0;
    if (CC_DEBUG && this._deltaTime > 1) this._deltaTime = 1 / 60.0;
    this._lastUpdate = now;
  },

  /**
   * !#en
   * Converts a view coordinate to an WebGL coordinate<br/>
   * Useful to convert (multi) touches coordinates to the current layout (portrait or landscape)<br/>
   * Implementation can be found in CCDirectorWebGL.
   * !#zh 将触摸点的屏幕坐标转换为 WebGL View 下的坐标。
   * @method convertToGL
   * @param {Vec2} uiPoint
   * @return {Vec2}
   * @deprecated since v2.0
   */
  convertToGL: function convertToGL(uiPoint) {
    var container = game.container;
    var view = cc.view;
    var box = container.getBoundingClientRect();
    var left = box.left + window.pageXOffset - container.clientLeft;
    var top = box.top + window.pageYOffset - container.clientTop;
    var x = view._devicePixelRatio * (uiPoint.x - left);
    var y = view._devicePixelRatio * (top + box.height - uiPoint.y);
    return view._isRotated ? cc.v2(view._viewportRect.width - y, x) : cc.v2(x, y);
  },

  /**
   * !#en
   * Converts an OpenGL coordinate to a view coordinate<br/>
   * Useful to convert node points to window points for calls such as glScissor<br/>
   * Implementation can be found in CCDirectorWebGL.
   * !#zh 将触摸点的 WebGL View 坐标转换为屏幕坐标。
   * @method convertToUI
   * @param {Vec2} glPoint
   * @return {Vec2}
   * @deprecated since v2.0
   */
  convertToUI: function convertToUI(glPoint) {
    var container = game.container;
    var view = cc.view;
    var box = container.getBoundingClientRect();
    var left = box.left + window.pageXOffset - container.clientLeft;
    var top = box.top + window.pageYOffset - container.clientTop;
    var uiPoint = cc.v2(0, 0);

    if (view._isRotated) {
      uiPoint.x = left + glPoint.y / view._devicePixelRatio;
      uiPoint.y = top + box.height - (view._viewportRect.width - glPoint.x) / view._devicePixelRatio;
    } else {
      uiPoint.x = left + glPoint.x * view._devicePixelRatio;
      uiPoint.y = top + box.height - glPoint.y * view._devicePixelRatio;
    }

    return uiPoint;
  },

  /**
   * End the life of director in the next frame
   * @method end
   */
  end: function end() {
    this._purgeDirectorInNextLoop = true;
  },

  /**
   * !#en
   * Returns the size of the WebGL view in points.<br/>
   * It takes into account any possible rotation (device orientation) of the window.
   * !#zh 获取视图的大小，以点为单位。
   * @method getWinSize
   * @return {Size}
   * @deprecated since v2.0
   */
  getWinSize: function getWinSize() {
    return cc.size(cc.winSize);
  },

  /**
   * !#en
   * Returns the size of the OpenGL view in pixels.<br/>
   * It takes into account any possible rotation (device orientation) of the window.<br/>
   * On Mac winSize and winSizeInPixels return the same value.
   * (The pixel here refers to the resource resolution. If you want to get the physics resolution of device, you need to use cc.view.getFrameSize())
   * !#zh
   * 获取视图大小，以像素为单位（这里的像素指的是资源分辨率。
   * 如果要获取屏幕物理分辨率，需要用 cc.view.getFrameSize()）
   * @method getWinSizeInPixels
   * @return {Size}
   * @deprecated since v2.0
   */
  getWinSizeInPixels: function getWinSizeInPixels() {
    return cc.size(cc.winSize);
  },

  /**
   * !#en Pause the director's ticker, only involve the game logic execution.
   * It won't pause the rendering process nor the event manager.
   * If you want to pause the entier game including rendering, audio and event, 
   * please use {{#crossLink "Game.pause"}}cc.game.pause{{/crossLink}}
   * !#zh 暂停正在运行的场景，该暂停只会停止游戏逻辑执行，但是不会停止渲染和 UI 响应。
   * 如果想要更彻底得暂停游戏，包含渲染，音频和事件，请使用 {{#crossLink "Game.pause"}}cc.game.pause{{/crossLink}}。
   * @method pause
   */
  pause: function pause() {
    if (this._paused) return;
    this._paused = true;
  },

  /**
   * Removes cached all cocos2d cached data.
   * @deprecated since v2.0
   */
  purgeCachedData: function purgeCachedData() {
    cc.assetManager.releaseAll();
  },

  /**
   * Purge the cc.director itself, including unschedule all schedule, remove all event listeners, clean up and exit the running scene, stops all animations, clear cached data.
   */
  purgeDirector: function purgeDirector() {
    //cleanup scheduler
    this._scheduler.unscheduleAll();

    this._compScheduler.unscheduleAll();

    this._nodeActivator.reset(); // Disable event dispatching


    if (eventManager) eventManager.setEnabled(false);

    if (!CC_EDITOR) {
      if (cc.isValid(this._scene)) {
        this._scene.destroy();
      }

      this._scene = null;
      cc.renderer.clear();
      cc.assetManager.builtins.clear();
    }

    cc.game.pause(); // Clear all caches

    cc.assetManager.releaseAll();
  },

  /**
   * Reset the cc.director, can be used to restart the director after purge
   */
  reset: function reset() {
    this.purgeDirector();
    if (eventManager) eventManager.setEnabled(true); // Action manager

    if (this._actionManager) {
      this._scheduler.scheduleUpdate(this._actionManager, cc.Scheduler.PRIORITY_SYSTEM, false);
    } // Animation manager


    if (this._animationManager) {
      this._scheduler.scheduleUpdate(this._animationManager, cc.Scheduler.PRIORITY_SYSTEM, false);
    } // Collider manager


    if (this._collisionManager) {
      this._scheduler.scheduleUpdate(this._collisionManager, cc.Scheduler.PRIORITY_SYSTEM, false);
    } // Physics manager


    if (this._physicsManager) {
      this._scheduler.scheduleUpdate(this._physicsManager, cc.Scheduler.PRIORITY_SYSTEM, false);
    }

    cc.game.resume();
  },

  /**
   * !#en
   * Run a scene. Replaces the running scene with a new one or enter the first scene.<br/>
   * The new scene will be launched immediately.
   * !#zh 立刻切换指定场景。
   * @method runSceneImmediate
   * @param {Scene|SceneAsset} scene - The need run scene.
   * @param {Function} [onBeforeLoadScene] - The function invoked at the scene before loading.
   * @param {Function} [onLaunched] - The function invoked at the scene after launch.
   */
  runSceneImmediate: function runSceneImmediate(scene, onBeforeLoadScene, onLaunched) {
    cc.assertID(scene instanceof cc.Scene || scene instanceof cc.SceneAsset, 1216);
    if (scene instanceof cc.SceneAsset) scene = scene.scene;
    CC_BUILD && CC_DEBUG && console.time('InitScene');

    scene._load(); // ensure scene initialized


    CC_BUILD && CC_DEBUG && console.timeEnd('InitScene'); // Re-attach or replace persist nodes

    CC_BUILD && CC_DEBUG && console.time('AttachPersist');
    var persistNodeList = Object.keys(game._persistRootNodes).map(function (x) {
      return game._persistRootNodes[x];
    });

    for (var i = 0; i < persistNodeList.length; i++) {
      var node = persistNodeList[i];
      var existNode = scene.getChildByUuid(node.uuid);

      if (existNode) {
        // scene also contains the persist node, select the old one
        var index = existNode.getSiblingIndex();

        existNode._destroyImmediate();

        scene.insertChild(node, index);
      } else {
        node.parent = scene;
      }
    }

    CC_BUILD && CC_DEBUG && console.timeEnd('AttachPersist');
    var oldScene = this._scene;

    if (!CC_EDITOR) {
      // auto release assets
      CC_BUILD && CC_DEBUG && console.time('AutoRelease');

      cc.assetManager._releaseManager._autoRelease(oldScene, scene, game._persistRootNodes);

      CC_BUILD && CC_DEBUG && console.timeEnd('AutoRelease');
    } // unload scene


    CC_BUILD && CC_DEBUG && console.time('Destroy');

    if (cc.isValid(oldScene)) {
      oldScene.destroy();
    }

    this._scene = null; // purge destroyed nodes belongs to old scene

    Obj._deferredDestroy();

    CC_BUILD && CC_DEBUG && console.timeEnd('Destroy');

    if (onBeforeLoadScene) {
      onBeforeLoadScene();
    }

    this.emit(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, scene); // Run an Entity Scene

    this._scene = scene;
    CC_BUILD && CC_DEBUG && console.time('Activate');

    scene._activate();

    CC_BUILD && CC_DEBUG && console.timeEnd('Activate'); //start scene

    cc.game.resume();

    if (onLaunched) {
      onLaunched(null, scene);
    }

    this.emit(cc.Director.EVENT_AFTER_SCENE_LAUNCH, scene);
  },

  /**
   * !#en
   * Run a scene. Replaces the running scene with a new one or enter the first scene.
   * The new scene will be launched at the end of the current frame.
   * !#zh 运行指定场景。
   * @method runScene
   * @param {Scene|SceneAsset} scene - The need run scene.
   * @param {Function} [onBeforeLoadScene] - The function invoked at the scene before loading.
   * @param {Function} [onLaunched] - The function invoked at the scene after launch.
   */
  runScene: function runScene(scene, onBeforeLoadScene, onLaunched) {
    cc.assertID(scene, 1205);
    cc.assertID(scene instanceof cc.Scene || scene instanceof cc.SceneAsset, 1216);
    if (scene instanceof cc.SceneAsset) scene = scene.scene; // ensure scene initialized

    scene._load(); // Delay run / replace scene to the end of the frame


    this.once(cc.Director.EVENT_AFTER_DRAW, function () {
      this.runSceneImmediate(scene, onBeforeLoadScene, onLaunched);
    }, this);
  },

  /**
   * !#en Loads the scene by its name.
   * !#zh 通过场景名称进行加载场景。
   *
   * @method loadScene
   * @param {String} sceneName - The name of the scene to load.
   * @param {Function} [onLaunched] - callback, will be called after scene launched.
   * @return {Boolean} if error, return false
   */
  loadScene: function loadScene(sceneName, onLaunched, _onUnloaded) {
    if (this._loadingScene) {
      cc.warnID(1208, sceneName, this._loadingScene);
      return false;
    }

    var bundle = cc.assetManager.bundles.find(function (bundle) {
      return bundle.getSceneInfo(sceneName);
    });

    if (bundle) {
      this.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING, sceneName);
      this._loadingScene = sceneName;
      var self = this;
      console.time('LoadScene ' + sceneName);
      bundle.loadScene(sceneName, function (err, scene) {
        console.timeEnd('LoadScene ' + sceneName);
        self._loadingScene = '';

        if (err) {
          err = 'Failed to load scene: ' + err;
          cc.error(err);
          onLaunched && onLaunched(err);
        } else {
          self.runSceneImmediate(scene, _onUnloaded, onLaunched);
        }
      });
      return true;
    } else {
      cc.errorID(1209, sceneName);
      return false;
    }
  },

  /**
  * !#en
  * Preloads the scene to reduces loading time. You can call this method at any time you want.
  * After calling this method, you still need to launch the scene by `cc.director.loadScene`.
  * It will be totally fine to call `cc.director.loadScene` at any time even if the preloading is not
  * yet finished, the scene will be launched after loaded automatically.
  * !#zh 预加载场景，你可以在任何时候调用这个方法。
  * 调用完后，你仍然需要通过 `cc.director.loadScene` 来启动场景，因为这个方法不会执行场景加载操作。
  * 就算预加载还没完成，你也可以直接调用 `cc.director.loadScene`，加载完成后场景就会启动。
  *
  * @method preloadScene
  * @param {String} sceneName - The name of the scene to preload.
  * @param {Function} [onProgress] - callback, will be called when the load progression change.
  * @param {Number} onProgress.completedCount - The number of the items that are already completed
  * @param {Number} onProgress.totalCount - The total number of the items
  * @param {Object} onProgress.item - The latest item which flow out the pipeline
  * @param {Function} [onLoaded] - callback, will be called after scene loaded.
  * @param {Error} onLoaded.error - null or the error object.
  */
  preloadScene: function preloadScene(sceneName, onProgress, onLoaded) {
    var bundle = cc.assetManager.bundles.find(function (bundle) {
      return bundle.getSceneInfo(sceneName);
    });

    if (bundle) {
      bundle.preloadScene(sceneName, null, onProgress, onLoaded);
    } else {
      cc.errorID(1209, sceneName);
      return null;
    }
  },

  /**
   * !#en Resume game logic execution after pause, if the current scene is not paused, nothing will happen.
   * !#zh 恢复暂停场景的游戏逻辑，如果当前场景没有暂停将没任何事情发生。
   * @method resume
   */
  resume: function resume() {
    if (!this._paused) {
      return;
    }

    this._lastUpdate = performance.now();

    if (!this._lastUpdate) {
      cc.logID(1200);
    }

    this._paused = false;
    this._deltaTime = 0;
  },

  /**
   * !#en
   * Enables or disables WebGL depth test.<br/>
   * Implementation can be found in CCDirectorCanvas.js/CCDirectorWebGL.js
   * !#zh 启用/禁用深度测试（在 Canvas 渲染模式下不会生效）。
   * @method setDepthTest
   * @param {Boolean} on
   * @deprecated since v2.0
   */
  setDepthTest: function setDepthTest(value) {
    if (!cc.Camera.main) {
      return;
    }

    cc.Camera.main.depth = !!value;
  },

  /**
   * !#en
   * Set color for clear screen.<br/>
   * (Implementation can be found in CCDirectorCanvas.js/CCDirectorWebGL.js)
   * !#zh
   * 设置场景的默认擦除颜色。<br/>
   * 支持全透明，但不支持透明度为中间值。要支持全透明需手工开启 cc.macro.ENABLE_TRANSPARENT_CANVAS。
   * @method setClearColor
   * @param {Color} clearColor
   * @deprecated since v2.0
   */
  setClearColor: function setClearColor(clearColor) {
    if (!cc.Camera.main) {
      return;
    }

    cc.Camera.main.backgroundColor = clearColor;
  },

  /**
   * !#en Returns current logic Scene.
   * !#zh 获取当前逻辑场景。
   * @method getRunningScene
   * @private
   * @return {Scene}
   * @deprecated since v2.0
   */
  getRunningScene: function getRunningScene() {
    return this._scene;
  },

  /**
   * !#en Returns current logic Scene.
   * !#zh 获取当前逻辑场景。
   * @method getScene
   * @return {Scene}
   * @example
   *  // This will help you to get the Canvas node in scene
   *  cc.director.getScene().getChildByName('Canvas');
   */
  getScene: function getScene() {
    return this._scene;
  },

  /**
   * !#en Returns the FPS value. Please use {{#crossLink "Game.setFrameRate"}}cc.game.setFrameRate{{/crossLink}} to control animation interval.
   * !#zh 获取单位帧执行时间。请使用 {{#crossLink "Game.setFrameRate"}}cc.game.setFrameRate{{/crossLink}} 来控制游戏帧率。
   * @method getAnimationInterval
   * @deprecated since v2.0
   * @return {Number}
   */
  getAnimationInterval: function getAnimationInterval() {
    return 1000 / game.getFrameRate();
  },

  /**
   * Sets animation interval, this doesn't control the main loop.
   * To control the game's frame rate overall, please use {{#crossLink "Game.setFrameRate"}}cc.game.setFrameRate{{/crossLink}}
   * @method setAnimationInterval
   * @deprecated since v2.0
   * @param {Number} value - The animation interval desired.
   */
  setAnimationInterval: function setAnimationInterval(value) {
    game.setFrameRate(Math.round(1000 / value));
  },

  /**
   * !#en Returns the delta time since last frame.
   * !#zh 获取上一帧的增量时间。
   * @method getDeltaTime
   * @return {Number}
   */
  getDeltaTime: function getDeltaTime() {
    return this._deltaTime;
  },

  /**
   * !#en Returns the total passed time since game start, unit: ms
   * !#zh 获取从游戏开始到现在总共经过的时间，单位为 ms
   * @method getTotalTime
   * @return {Number}
   */
  getTotalTime: function getTotalTime() {
    return performance.now() - this._startTime;
  },

  /**
   * !#en Returns how many frames were called since the director started.
   * !#zh 获取 director 启动以来游戏运行的总帧数。
   * @method getTotalFrames
   * @return {Number}
   */
  getTotalFrames: function getTotalFrames() {
    return this._totalFrames;
  },

  /**
   * !#en Returns whether or not the Director is paused.
   * !#zh 是否处于暂停状态。
   * @method isPaused
   * @return {Boolean}
   */
  isPaused: function isPaused() {
    return this._paused;
  },

  /**
   * !#en Returns the cc.Scheduler associated with this director.
   * !#zh 获取和 director 相关联的 cc.Scheduler。
   * @method getScheduler
   * @return {Scheduler}
   */
  getScheduler: function getScheduler() {
    return this._scheduler;
  },

  /**
   * !#en Sets the cc.Scheduler associated with this director.
   * !#zh 设置和 director 相关联的 cc.Scheduler。
   * @method setScheduler
   * @param {Scheduler} scheduler
   */
  setScheduler: function setScheduler(scheduler) {
    if (this._scheduler !== scheduler) {
      this._scheduler = scheduler;
    }
  },

  /**
   * !#en Returns the cc.ActionManager associated with this director.
   * !#zh 获取和 director 相关联的 cc.ActionManager（动作管理器）。
   * @method getActionManager
   * @return {ActionManager}
   */
  getActionManager: function getActionManager() {
    return this._actionManager;
  },

  /**
   * !#en Sets the cc.ActionManager associated with this director.
   * !#zh 设置和 director 相关联的 cc.ActionManager（动作管理器）。
   * @method setActionManager
   * @param {ActionManager} actionManager
   */
  setActionManager: function setActionManager(actionManager) {
    if (this._actionManager !== actionManager) {
      if (this._actionManager) {
        this._scheduler.unscheduleUpdate(this._actionManager);
      }

      this._actionManager = actionManager;

      this._scheduler.scheduleUpdate(this._actionManager, cc.Scheduler.PRIORITY_SYSTEM, false);
    }
  },

  /* 
   * !#en Returns the cc.AnimationManager associated with this director.
   * !#zh 获取和 director 相关联的 cc.AnimationManager（动画管理器）。
   * @method getAnimationManager
   * @return {AnimationManager}
   */
  getAnimationManager: function getAnimationManager() {
    return this._animationManager;
  },

  /**
   * !#en Returns the cc.CollisionManager associated with this director.
   * !#zh 获取和 director 相关联的 cc.CollisionManager （碰撞管理器）。
   * @method getCollisionManager
   * @return {CollisionManager}
   */
  getCollisionManager: function getCollisionManager() {
    return this._collisionManager;
  },

  /**
   * !#en Returns the cc.PhysicsManager associated with this director.
   * !#zh 返回与 director 相关联的 cc.PhysicsManager （物理管理器）。
   * @method getPhysicsManager
   * @return {PhysicsManager}
   */
  getPhysicsManager: function getPhysicsManager() {
    return this._physicsManager;
  },

  /**
   * !#en Returns the cc.Physics3DManager associated with this director.
   * !#zh 返回与 director 相关联的 cc.Physics3DManager （物理管理器）。
   * @method getPhysics3DManager
   * @return {Physics3DManager}
   */
  getPhysics3DManager: function getPhysics3DManager() {
    return this._physics3DManager;
  },
  // Loop management

  /*
   * Starts Animation
   * @deprecated since v2.1.2
   */
  startAnimation: function startAnimation() {
    cc.game.resume();
  },

  /*
   * Stops animation
   * @deprecated since v2.1.2
   */
  stopAnimation: function stopAnimation() {
    cc.game.pause();
  },
  _resetDeltaTime: function _resetDeltaTime() {
    this._lastUpdate = performance.now();
    this._deltaTime = 0;
  },

  /*
   * Run main loop of director
   */
  mainLoop: CC_EDITOR ? function (deltaTime, updateAnimate) {
    this._deltaTime = deltaTime; // Update

    if (!this._paused) {
      this.emit(cc.Director.EVENT_BEFORE_UPDATE);

      this._compScheduler.startPhase();

      this._compScheduler.updatePhase(deltaTime);

      if (updateAnimate) {
        this._scheduler.update(deltaTime);
      }

      this._compScheduler.lateUpdatePhase(deltaTime);

      this.emit(cc.Director.EVENT_AFTER_UPDATE);
    } // Render


    this.emit(cc.Director.EVENT_BEFORE_DRAW);
    renderer.render(this._scene, deltaTime); // After draw

    this.emit(cc.Director.EVENT_AFTER_DRAW);
    this._totalFrames++;
  } : function (now) {
    if (this._purgeDirectorInNextLoop) {
      this._purgeDirectorInNextLoop = false;
      this.purgeDirector();
    } else {
      // calculate "global" dt
      this.calculateDeltaTime(now); // Update

      if (!this._paused) {
        // before update
        this.emit(cc.Director.EVENT_BEFORE_UPDATE); // Call start for new added components

        this._compScheduler.startPhase(); // Update for components


        this._compScheduler.updatePhase(this._deltaTime); // Engine update with scheduler


        this._scheduler.update(this._deltaTime); // Late update for components


        this._compScheduler.lateUpdatePhase(this._deltaTime); // User can use this event to do things after update


        this.emit(cc.Director.EVENT_AFTER_UPDATE); // Destroy entities that have been removed recently

        Obj._deferredDestroy();
      } // Render


      this.emit(cc.Director.EVENT_BEFORE_DRAW);
      renderer.render(this._scene, this._deltaTime); // After draw

      this.emit(cc.Director.EVENT_AFTER_DRAW);
      eventManager.frameUpdateListeners();
      this._totalFrames++;
    }
  },
  __fastOn: function __fastOn(type, callback, target) {
    this.on(type, callback, target);
  },
  __fastOff: function __fastOff(type, callback, target) {
    this.off(type, callback, target);
  }
}; // Event target

cc.js.addon(cc.Director.prototype, EventTarget.prototype);
/**
 * !#en The event projection changed of cc.Director. This event will not get triggered since v2.0
 * !#zh cc.Director 投影变化的事件。从 v2.0 开始这个事件不会再被触发
 * @property {String} EVENT_PROJECTION_CHANGED
 * @readonly
 * @static
 * @deprecated since v2.0
 */

cc.Director.EVENT_PROJECTION_CHANGED = "director_projection_changed";
/**
 * !#en The event which will be triggered before loading a new scene.
 * !#zh 加载新场景之前所触发的事件。
 * @event cc.Director.EVENT_BEFORE_SCENE_LOADING
 * @param {String} sceneName - The loading scene name
 */

/**
 * !#en The event which will be triggered before loading a new scene.
 * !#zh 加载新场景之前所触发的事件。
 * @property {String} EVENT_BEFORE_SCENE_LOADING
 * @readonly
 * @static
 */

cc.Director.EVENT_BEFORE_SCENE_LOADING = "director_before_scene_loading";
/*
 * !#en The event which will be triggered before launching a new scene.
 * !#zh 运行新场景之前所触发的事件。
 * @event cc.Director.EVENT_BEFORE_SCENE_LAUNCH
 * @param {String} sceneName - New scene which will be launched
 */

/**
 * !#en The event which will be triggered before launching a new scene.
 * !#zh 运行新场景之前所触发的事件。
 * @property {String} EVENT_BEFORE_SCENE_LAUNCH
 * @readonly
 * @static
 */

cc.Director.EVENT_BEFORE_SCENE_LAUNCH = "director_before_scene_launch";
/**
 * !#en The event which will be triggered after launching a new scene.
 * !#zh 运行新场景之后所触发的事件。
 * @event cc.Director.EVENT_AFTER_SCENE_LAUNCH
 * @param {String} sceneName - New scene which is launched
 */

/**
 * !#en The event which will be triggered after launching a new scene.
 * !#zh 运行新场景之后所触发的事件。
 * @property {String} EVENT_AFTER_SCENE_LAUNCH
 * @readonly
 * @static
 */

cc.Director.EVENT_AFTER_SCENE_LAUNCH = "director_after_scene_launch";
/**
 * !#en The event which will be triggered at the beginning of every frame.
 * !#zh 每个帧的开始时所触发的事件。
 * @event cc.Director.EVENT_BEFORE_UPDATE
 */

/**
 * !#en The event which will be triggered at the beginning of every frame.
 * !#zh 每个帧的开始时所触发的事件。
 * @property {String} EVENT_BEFORE_UPDATE
 * @readonly
 * @static
 */

cc.Director.EVENT_BEFORE_UPDATE = "director_before_update";
/**
 * !#en The event which will be triggered after engine and components update logic.
 * !#zh 将在引擎和组件 “update” 逻辑之后所触发的事件。
 * @event cc.Director.EVENT_AFTER_UPDATE
 */

/**
 * !#en The event which will be triggered after engine and components update logic.
 * !#zh 将在引擎和组件 “update” 逻辑之后所触发的事件。
 * @property {String} EVENT_AFTER_UPDATE
 * @readonly
 * @static
 */

cc.Director.EVENT_AFTER_UPDATE = "director_after_update";
/**
 * !#en The event is deprecated since v2.0, please use cc.Director.EVENT_BEFORE_DRAW instead
 * !#zh 这个事件从 v2.0 开始被废弃，请直接使用 cc.Director.EVENT_BEFORE_DRAW
 * @property {String} EVENT_BEFORE_VISIT
 * @readonly
 * @deprecated since v2.0
 * @static
 */

cc.Director.EVENT_BEFORE_VISIT = "director_before_draw";
/**
 * !#en The event is deprecated since v2.0, please use cc.Director.EVENT_BEFORE_DRAW instead
 * !#zh 这个事件从 v2.0 开始被废弃，请直接使用 cc.Director.EVENT_BEFORE_DRAW
 * @property {String} EVENT_AFTER_VISIT
 * @readonly
 * @deprecated since v2.0
 * @static
 */

cc.Director.EVENT_AFTER_VISIT = "director_before_draw";
/**
 * !#en The event which will be triggered before the rendering process.
 * !#zh 渲染过程之前所触发的事件。
 * @event cc.Director.EVENT_BEFORE_DRAW
 */

/**
 * !#en The event which will be triggered before the rendering process.
 * !#zh 渲染过程之前所触发的事件。
 * @property {String} EVENT_BEFORE_DRAW
 * @readonly
 * @static
 */

cc.Director.EVENT_BEFORE_DRAW = "director_before_draw";
/**
 * !#en The event which will be triggered after the rendering process.
 * !#zh 渲染过程之后所触发的事件。
 * @event cc.Director.EVENT_AFTER_DRAW
 */

/**
 * !#en The event which will be triggered after the rendering process.
 * !#zh 渲染过程之后所触发的事件。
 * @property {String} EVENT_AFTER_DRAW
 * @readonly
 * @static
 */

cc.Director.EVENT_AFTER_DRAW = "director_after_draw"; //Possible OpenGL projections used by director

/**
 * Constant for 2D projection (orthogonal projection)
 * @property {Number} PROJECTION_2D
 * @default 0
 * @readonly
 * @static
 * @deprecated since v2.0
 */

cc.Director.PROJECTION_2D = 0;
/**
 * Constant for 3D projection with a fovy=60, znear=0.5f and zfar=1500.
 * @property {Number} PROJECTION_3D
 * @default 1
 * @readonly
 * @static
 * @deprecated since v2.0
 */

cc.Director.PROJECTION_3D = 1;
/**
 * Constant for custom projection, if cc.Director's projection set to it, it calls "updateProjection" on the projection delegate.
 * @property {Number} PROJECTION_CUSTOM
 * @default 3
 * @readonly
 * @static
 * @deprecated since v2.0
 */

cc.Director.PROJECTION_CUSTOM = 3;
/**
 * Constant for default projection of cc.Director, default projection is 2D projection
 * @property {Number} PROJECTION_DEFAULT
 * @default cc.Director.PROJECTION_2D
 * @readonly
 * @static
 * @deprecated since v2.0
 */

cc.Director.PROJECTION_DEFAULT = cc.Director.PROJECTION_2D;
/**
 * The event which will be triggered before the physics process.<br/>
 * 物理过程之前所触发的事件。
 * @event Director.EVENT_BEFORE_PHYSICS
 * @readonly
 */

cc.Director.EVENT_BEFORE_PHYSICS = 'director_before_physics';
/**
 * The event which will be triggered after the physics process.<br/>
 * 物理过程之后所触发的事件。
 * @event Director.EVENT_AFTER_PHYSICS
 * @readonly
 */

cc.Director.EVENT_AFTER_PHYSICS = 'director_after_physics';
/**
 * @module cc
 */

/**
 * !#en Director
 * !#zh 导演类。
 * @property director
 * @type {Director}
 */

cc.director = new cc.Director();
module.exports = cc.director;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL0NDRGlyZWN0b3IuanMiXSwibmFtZXMiOlsiRXZlbnRUYXJnZXQiLCJyZXF1aXJlIiwiQ29tcG9uZW50U2NoZWR1bGVyIiwiTm9kZUFjdGl2YXRvciIsIk9iaiIsImdhbWUiLCJyZW5kZXJlciIsImV2ZW50TWFuYWdlciIsIlNjaGVkdWxlciIsImNjIiwiRGlyZWN0b3IiLCJjYWxsIiwiX3BhdXNlZCIsIl9wdXJnZURpcmVjdG9ySW5OZXh0TG9vcCIsIl93aW5TaXplSW5Qb2ludHMiLCJfc2NlbmUiLCJfbG9hZGluZ1NjZW5lIiwiX3RvdGFsRnJhbWVzIiwiX2xhc3RVcGRhdGUiLCJfZGVsdGFUaW1lIiwiX3N0YXJ0VGltZSIsIl9tYXhQYXJ0aWNsZURlbHRhVGltZSIsIl9zY2hlZHVsZXIiLCJfY29tcFNjaGVkdWxlciIsIl9ub2RlQWN0aXZhdG9yIiwiX2FjdGlvbk1hbmFnZXIiLCJzZWxmIiwib24iLCJFVkVOVF9TSE9XIiwicGVyZm9ybWFuY2UiLCJub3ciLCJvbmNlIiwiRVZFTlRfRU5HSU5FX0lOSVRFRCIsImluaXQiLCJwcm90b3R5cGUiLCJjb25zdHJ1Y3RvciIsInNpemUiLCJBY3Rpb25NYW5hZ2VyIiwic2NoZWR1bGVVcGRhdGUiLCJQUklPUklUWV9TWVNURU0iLCJzaGFyZWRJbml0Iiwic2V0RW5hYmxlZCIsIkFuaW1hdGlvbk1hbmFnZXIiLCJfYW5pbWF0aW9uTWFuYWdlciIsIkNvbGxpc2lvbk1hbmFnZXIiLCJfY29sbGlzaW9uTWFuYWdlciIsIlBoeXNpY3NNYW5hZ2VyIiwiX3BoeXNpY3NNYW5hZ2VyIiwiUGh5c2ljczNETWFuYWdlciIsIkNDX1BIWVNJQ1NfQlVJTFRJTiIsIkNDX1BIWVNJQ1NfQ0FOTk9OIiwiX3BoeXNpY3MzRE1hbmFnZXIiLCJfd2lkZ2V0TWFuYWdlciIsImNhbGN1bGF0ZURlbHRhVGltZSIsIkNDX0RFQlVHIiwiY29udmVydFRvR0wiLCJ1aVBvaW50IiwiY29udGFpbmVyIiwidmlldyIsImJveCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImxlZnQiLCJ3aW5kb3ciLCJwYWdlWE9mZnNldCIsImNsaWVudExlZnQiLCJ0b3AiLCJwYWdlWU9mZnNldCIsImNsaWVudFRvcCIsIngiLCJfZGV2aWNlUGl4ZWxSYXRpbyIsInkiLCJoZWlnaHQiLCJfaXNSb3RhdGVkIiwidjIiLCJfdmlld3BvcnRSZWN0Iiwid2lkdGgiLCJjb252ZXJ0VG9VSSIsImdsUG9pbnQiLCJlbmQiLCJnZXRXaW5TaXplIiwid2luU2l6ZSIsImdldFdpblNpemVJblBpeGVscyIsInBhdXNlIiwicHVyZ2VDYWNoZWREYXRhIiwiYXNzZXRNYW5hZ2VyIiwicmVsZWFzZUFsbCIsInB1cmdlRGlyZWN0b3IiLCJ1bnNjaGVkdWxlQWxsIiwicmVzZXQiLCJDQ19FRElUT1IiLCJpc1ZhbGlkIiwiZGVzdHJveSIsImNsZWFyIiwiYnVpbHRpbnMiLCJyZXN1bWUiLCJydW5TY2VuZUltbWVkaWF0ZSIsInNjZW5lIiwib25CZWZvcmVMb2FkU2NlbmUiLCJvbkxhdW5jaGVkIiwiYXNzZXJ0SUQiLCJTY2VuZSIsIlNjZW5lQXNzZXQiLCJDQ19CVUlMRCIsImNvbnNvbGUiLCJ0aW1lIiwiX2xvYWQiLCJ0aW1lRW5kIiwicGVyc2lzdE5vZGVMaXN0IiwiT2JqZWN0Iiwia2V5cyIsIl9wZXJzaXN0Um9vdE5vZGVzIiwibWFwIiwiaSIsImxlbmd0aCIsIm5vZGUiLCJleGlzdE5vZGUiLCJnZXRDaGlsZEJ5VXVpZCIsInV1aWQiLCJpbmRleCIsImdldFNpYmxpbmdJbmRleCIsIl9kZXN0cm95SW1tZWRpYXRlIiwiaW5zZXJ0Q2hpbGQiLCJwYXJlbnQiLCJvbGRTY2VuZSIsIl9yZWxlYXNlTWFuYWdlciIsIl9hdXRvUmVsZWFzZSIsIl9kZWZlcnJlZERlc3Ryb3kiLCJlbWl0IiwiRVZFTlRfQkVGT1JFX1NDRU5FX0xBVU5DSCIsIl9hY3RpdmF0ZSIsIkVWRU5UX0FGVEVSX1NDRU5FX0xBVU5DSCIsInJ1blNjZW5lIiwiRVZFTlRfQUZURVJfRFJBVyIsImxvYWRTY2VuZSIsInNjZW5lTmFtZSIsIl9vblVubG9hZGVkIiwid2FybklEIiwiYnVuZGxlIiwiYnVuZGxlcyIsImZpbmQiLCJnZXRTY2VuZUluZm8iLCJFVkVOVF9CRUZPUkVfU0NFTkVfTE9BRElORyIsImVyciIsImVycm9yIiwiZXJyb3JJRCIsInByZWxvYWRTY2VuZSIsIm9uUHJvZ3Jlc3MiLCJvbkxvYWRlZCIsImxvZ0lEIiwic2V0RGVwdGhUZXN0IiwidmFsdWUiLCJDYW1lcmEiLCJtYWluIiwiZGVwdGgiLCJzZXRDbGVhckNvbG9yIiwiY2xlYXJDb2xvciIsImJhY2tncm91bmRDb2xvciIsImdldFJ1bm5pbmdTY2VuZSIsImdldFNjZW5lIiwiZ2V0QW5pbWF0aW9uSW50ZXJ2YWwiLCJnZXRGcmFtZVJhdGUiLCJzZXRBbmltYXRpb25JbnRlcnZhbCIsInNldEZyYW1lUmF0ZSIsIk1hdGgiLCJyb3VuZCIsImdldERlbHRhVGltZSIsImdldFRvdGFsVGltZSIsImdldFRvdGFsRnJhbWVzIiwiaXNQYXVzZWQiLCJnZXRTY2hlZHVsZXIiLCJzZXRTY2hlZHVsZXIiLCJzY2hlZHVsZXIiLCJnZXRBY3Rpb25NYW5hZ2VyIiwic2V0QWN0aW9uTWFuYWdlciIsImFjdGlvbk1hbmFnZXIiLCJ1bnNjaGVkdWxlVXBkYXRlIiwiZ2V0QW5pbWF0aW9uTWFuYWdlciIsImdldENvbGxpc2lvbk1hbmFnZXIiLCJnZXRQaHlzaWNzTWFuYWdlciIsImdldFBoeXNpY3MzRE1hbmFnZXIiLCJzdGFydEFuaW1hdGlvbiIsInN0b3BBbmltYXRpb24iLCJfcmVzZXREZWx0YVRpbWUiLCJtYWluTG9vcCIsImRlbHRhVGltZSIsInVwZGF0ZUFuaW1hdGUiLCJFVkVOVF9CRUZPUkVfVVBEQVRFIiwic3RhcnRQaGFzZSIsInVwZGF0ZVBoYXNlIiwidXBkYXRlIiwibGF0ZVVwZGF0ZVBoYXNlIiwiRVZFTlRfQUZURVJfVVBEQVRFIiwiRVZFTlRfQkVGT1JFX0RSQVciLCJyZW5kZXIiLCJmcmFtZVVwZGF0ZUxpc3RlbmVycyIsIl9fZmFzdE9uIiwidHlwZSIsImNhbGxiYWNrIiwidGFyZ2V0IiwiX19mYXN0T2ZmIiwib2ZmIiwianMiLCJhZGRvbiIsIkVWRU5UX1BST0pFQ1RJT05fQ0hBTkdFRCIsIkVWRU5UX0JFRk9SRV9WSVNJVCIsIkVWRU5UX0FGVEVSX1ZJU0lUIiwiUFJPSkVDVElPTl8yRCIsIlBST0pFQ1RJT05fM0QiLCJQUk9KRUNUSU9OX0NVU1RPTSIsIlBST0pFQ1RJT05fREVGQVVMVCIsIkVWRU5UX0JFRk9SRV9QSFlTSUNTIiwiRVZFTlRfQUZURVJfUEhZU0lDUyIsImRpcmVjdG9yIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxXQUFXLEdBQUdDLE9BQU8sQ0FBQyxzQkFBRCxDQUEzQjs7QUFDQSxJQUFNQyxrQkFBa0IsR0FBR0QsT0FBTyxDQUFDLHVCQUFELENBQWxDOztBQUNBLElBQU1FLGFBQWEsR0FBR0YsT0FBTyxDQUFDLGtCQUFELENBQTdCOztBQUNBLElBQU1HLEdBQUcsR0FBR0gsT0FBTyxDQUFDLHFCQUFELENBQW5COztBQUNBLElBQU1JLElBQUksR0FBR0osT0FBTyxDQUFDLFVBQUQsQ0FBcEI7O0FBQ0EsSUFBTUssUUFBUSxHQUFHTCxPQUFPLENBQUMsWUFBRCxDQUF4Qjs7QUFDQSxJQUFNTSxZQUFZLEdBQUdOLE9BQU8sQ0FBQyxpQkFBRCxDQUE1Qjs7QUFDQSxJQUFNTyxTQUFTLEdBQUdQLE9BQU8sQ0FBQyxlQUFELENBQXpCLEVBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUEvQixFQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EzSCxFQUFFLENBQUNDLFFBQUgsQ0FBWW9NLGFBQVosR0FBNEIsQ0FBNUI7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBck0sRUFBRSxDQUFDQyxRQUFILENBQVlxTSxhQUFaLEdBQTRCLENBQTVCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQXRNLEVBQUUsQ0FBQ0MsUUFBSCxDQUFZc00saUJBQVosR0FBZ0MsQ0FBaEM7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBdk0sRUFBRSxDQUFDQyxRQUFILENBQVl1TSxrQkFBWixHQUFpQ3hNLEVBQUUsQ0FBQ0MsUUFBSCxDQUFZb00sYUFBN0M7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0FyTSxFQUFFLENBQUNDLFFBQUgsQ0FBWXdNLG9CQUFaLEdBQW1DLHlCQUFuQztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQXpNLEVBQUUsQ0FBQ0MsUUFBSCxDQUFZeU0sbUJBQVosR0FBa0Msd0JBQWxDO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTFNLEVBQUUsQ0FBQzJNLFFBQUgsR0FBYyxJQUFJM00sRUFBRSxDQUFDQyxRQUFQLEVBQWQ7QUFFQTJNLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjdNLEVBQUUsQ0FBQzJNLFFBQXBCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMDgtMjAxMCBSaWNhcmRvIFF1ZXNhZGFcbiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxMiBjb2NvczJkLXgub3JnXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBFdmVudFRhcmdldCA9IHJlcXVpcmUoJy4vZXZlbnQvZXZlbnQtdGFyZ2V0Jyk7XG5jb25zdCBDb21wb25lbnRTY2hlZHVsZXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudC1zY2hlZHVsZXInKTtcbmNvbnN0IE5vZGVBY3RpdmF0b3IgPSByZXF1aXJlKCcuL25vZGUtYWN0aXZhdG9yJyk7XG5jb25zdCBPYmogPSByZXF1aXJlKCcuL3BsYXRmb3JtL0NDT2JqZWN0Jyk7XG5jb25zdCBnYW1lID0gcmVxdWlyZSgnLi9DQ0dhbWUnKTtcbmNvbnN0IHJlbmRlcmVyID0gcmVxdWlyZSgnLi9yZW5kZXJlcicpO1xuY29uc3QgZXZlbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi9ldmVudC1tYW5hZ2VyJyk7XG5jb25zdCBTY2hlZHVsZXIgPSByZXF1aXJlKCcuL0NDU2NoZWR1bGVyJyk7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqICEjZW5cbiAqIDxwPlxuICogICAgQVRURU5USU9OOiBVU0UgY2MuZGlyZWN0b3IgSU5TVEVBRCBPRiBjYy5EaXJlY3Rvci48YnIvPlxuICogICAgY2MuZGlyZWN0b3IgaXMgYSBzaW5nbGV0b24gb2JqZWN0IHdoaWNoIG1hbmFnZSB5b3VyIGdhbWUncyBsb2dpYyBmbG93Ljxici8+XG4gKiAgICBTaW5jZSB0aGUgY2MuZGlyZWN0b3IgaXMgYSBzaW5nbGV0b24sIHlvdSBkb24ndCBuZWVkIHRvIGNhbGwgYW55IGNvbnN0cnVjdG9yIG9yIGNyZWF0ZSBmdW5jdGlvbnMsPGJyLz5cbiAqICAgIHRoZSBzdGFuZGFyZCB3YXkgdG8gdXNlIGl0IGlzIGJ5IGNhbGxpbmc6PGJyLz5cbiAqICAgICAgLSBjYy5kaXJlY3Rvci5tZXRob2ROYW1lKCk7IDxici8+XG4gKlxuICogICAgSXQgY3JlYXRlcyBhbmQgaGFuZGxlIHRoZSBtYWluIFdpbmRvdyBhbmQgbWFuYWdlcyBob3cgYW5kIHdoZW4gdG8gZXhlY3V0ZSB0aGUgU2NlbmVzLjxici8+XG4gKiAgICA8YnIvPlxuICogICAgVGhlIGNjLmRpcmVjdG9yIGlzIGFsc28gcmVzcG9uc2libGUgZm9yOjxici8+XG4gKiAgICAgIC0gaW5pdGlhbGl6aW5nIHRoZSBPcGVuR0wgY29udGV4dDxici8+XG4gKiAgICAgIC0gc2V0dGluZyB0aGUgT3BlbkdMIHBpeGVsIGZvcm1hdCAoZGVmYXVsdCBvbiBpcyBSR0I1NjUpPGJyLz5cbiAqICAgICAgLSBzZXR0aW5nIHRoZSBPcGVuR0wgYnVmZmVyIGRlcHRoIChkZWZhdWx0IG9uIGlzIDAtYml0KTxici8+XG4gKiAgICAgIC0gc2V0dGluZyB0aGUgY29sb3IgZm9yIGNsZWFyIHNjcmVlbiAoZGVmYXVsdCBvbmUgaXMgQkxBQ0spPGJyLz5cbiAqICAgICAgLSBzZXR0aW5nIHRoZSBwcm9qZWN0aW9uIChkZWZhdWx0IG9uZSBpcyAzRCk8YnIvPlxuICogICAgICAtIHNldHRpbmcgdGhlIG9yaWVudGF0aW9uIChkZWZhdWx0IG9uZSBpcyBQb3J0cmFpdCk8YnIvPlxuICogICAgICA8YnIvPlxuICogICAgPGJyLz5cbiAqICAgIFRoZSBjYy5kaXJlY3RvciBhbHNvIHNldHMgdGhlIGRlZmF1bHQgT3BlbkdMIGNvbnRleHQ6PGJyLz5cbiAqICAgICAgLSBHTF9URVhUVVJFXzJEIGlzIGVuYWJsZWQ8YnIvPlxuICogICAgICAtIEdMX1ZFUlRFWF9BUlJBWSBpcyBlbmFibGVkPGJyLz5cbiAqICAgICAgLSBHTF9DT0xPUl9BUlJBWSBpcyBlbmFibGVkPGJyLz5cbiAqICAgICAgLSBHTF9URVhUVVJFX0NPT1JEX0FSUkFZIGlzIGVuYWJsZWQ8YnIvPlxuICogPC9wPlxuICogPHA+XG4gKiAgIGNjLmRpcmVjdG9yIGFsc28gc3luY2hyb25pemVzIHRpbWVycyB3aXRoIHRoZSByZWZyZXNoIHJhdGUgb2YgdGhlIGRpc3BsYXkuPGJyLz5cbiAqICAgRmVhdHVyZXMgYW5kIExpbWl0YXRpb25zOjxici8+XG4gKiAgICAgIC0gU2NoZWR1bGVkIHRpbWVycyAmIGRyYXdpbmcgYXJlIHN5bmNocm9uaXplcyB3aXRoIHRoZSByZWZyZXNoIHJhdGUgb2YgdGhlIGRpc3BsYXk8YnIvPlxuICogICAgICAtIE9ubHkgc3VwcG9ydHMgYW5pbWF0aW9uIGludGVydmFscyBvZiAxLzYwIDEvMzAgJiAxLzE1PGJyLz5cbiAqIDwvcD5cbiAqXG4gKiAhI3poXG4gKiA8cD5cbiAqICAgICDms6jmhI/vvJrnlKggY2MuZGlyZWN0b3Ig5Luj5pu/IGNjLkRpcmVjdG9y44CCPGJyLz5cbiAqICAgICBjYy5kaXJlY3RvciDkuIDkuKrnrqHnkIbkvaDnmoTmuLjmiI/nmoTpgLvovpHmtYHnqIvnmoTljZXkvovlr7nosaHjgII8YnIvPlxuICogICAgIOeUseS6jiBjYy5kaXJlY3RvciDmmK/kuIDkuKrljZXkvovvvIzkvaDkuI3pnIDopoHosIPnlKjku7vkvZXmnoTpgKDlh73mlbDmiJbliJvlu7rlh73mlbDvvIw8YnIvPlxuICogICAgIOS9v+eUqOWug+eahOagh+WHhuaWueazleaYr+mAmui/h+iwg+eUqO+8mjxici8+XG4gKiAgICAgICAtIGNjLmRpcmVjdG9yLm1ldGhvZE5hbWUoKTtcbiAqICAgICA8YnIvPlxuICogICAgIOWug+WIm+W7uuWSjOWkhOeQhuS4u+eql+WPo+W5tuS4lOeuoeeQhuS7gOS5iOaXtuWAmeaJp+ihjOWcuuaZr+OAgjxici8+XG4gKiAgICAgPGJyLz5cbiAqICAgICBjYy5kaXJlY3RvciDov5jotJ/otKPvvJo8YnIvPlxuICogICAgICAtIOWIneWni+WMliBPcGVuR0wg546v5aKD44CCPGJyLz5cbiAqICAgICAgLSDorr7nva5PcGVuR0zlg4/ntKDmoLzlvI/jgIIo6buY6K6k5pivIFJHQjU2NSk8YnIvPlxuICogICAgICAtIOiuvue9rk9wZW5HTOe8k+WGsuWMuua3seW6piAo6buY6K6k5pivIDAtYml0KTxici8+XG4gKiAgICAgIC0g6K6+572u56m655m95Zy65pmv55qE6aKc6ImyICjpu5jorqTmmK8g6buR6ImyKTxici8+XG4gKiAgICAgIC0g6K6+572u5oqV5b2xICjpu5jorqTmmK8gM0QpPGJyLz5cbiAqICAgICAgLSDorr7nva7mlrnlkJEgKOm7mOiupOaYryBQb3J0cmFpdCk8YnIvPlxuICogICAgPGJyLz5cbiAqICAgIGNjLmRpcmVjdG9yIOiuvue9ruS6hiBPcGVuR0wg6buY6K6k546v5aKDIDxici8+XG4gKiAgICAgIC0gR0xfVEVYVFVSRV8yRCAgIOWQr+eUqOOAgjxici8+XG4gKiAgICAgIC0gR0xfVkVSVEVYX0FSUkFZIOWQr+eUqOOAgjxici8+XG4gKiAgICAgIC0gR0xfQ09MT1JfQVJSQVkgIOWQr+eUqOOAgjxici8+XG4gKiAgICAgIC0gR0xfVEVYVFVSRV9DT09SRF9BUlJBWSDlkK/nlKjjgII8YnIvPlxuICogPC9wPlxuICogPHA+XG4gKiAgIGNjLmRpcmVjdG9yIOS5n+WQjOatpeWumuaXtuWZqOS4juaYvuekuuWZqOeahOWIt+aWsOmAn+eOh+OAglxuICogICA8YnIvPlxuICogICDnibnngrnlkozlsYDpmZDmgKc6IDxici8+XG4gKiAgICAgIC0g5bCG6K6h5pe25ZmoICYg5riy5p+T5LiO5pi+56S65Zmo55qE5Yi35paw6aKR546H5ZCM5q2l44CCPGJyLz5cbiAqICAgICAgLSDlj6rmlK/mjIHliqjnlLvnmoTpl7TpmpQgMS82MCAxLzMwICYgMS8xNeOAgjxici8+XG4gKiA8L3A+XG4gKlxuICogQGNsYXNzIERpcmVjdG9yXG4gKiBAZXh0ZW5kcyBFdmVudFRhcmdldFxuICovXG5jYy5EaXJlY3RvciA9IGZ1bmN0aW9uICgpIHtcbiAgICBFdmVudFRhcmdldC5jYWxsKHRoaXMpO1xuXG4gICAgLy8gcGF1c2VkP1xuICAgIHRoaXMuX3BhdXNlZCA9IGZhbHNlO1xuICAgIC8vIHB1cmdlP1xuICAgIHRoaXMuX3B1cmdlRGlyZWN0b3JJbk5leHRMb29wID0gZmFsc2U7XG5cbiAgICB0aGlzLl93aW5TaXplSW5Qb2ludHMgPSBudWxsO1xuXG4gICAgLy8gc2NlbmVzXG4gICAgdGhpcy5fc2NlbmUgPSBudWxsO1xuICAgIHRoaXMuX2xvYWRpbmdTY2VuZSA9ICcnO1xuXG4gICAgLy8gRlBTXG4gICAgdGhpcy5fdG90YWxGcmFtZXMgPSAwO1xuICAgIHRoaXMuX2xhc3RVcGRhdGUgPSAwO1xuICAgIHRoaXMuX2RlbHRhVGltZSA9IDAuMDtcbiAgICB0aGlzLl9zdGFydFRpbWUgPSAwLjA7XG5cbiAgICAvLyBQYXJ0aWNsZVN5c3RlbSBtYXggc3RlcCBkZWx0YSB0aW1lXG4gICAgdGhpcy5fbWF4UGFydGljbGVEZWx0YVRpbWUgPSAwLjA7XG5cbiAgICAvLyBTY2hlZHVsZXIgZm9yIHVzZXIgcmVnaXN0cmF0aW9uIHVwZGF0ZVxuICAgIHRoaXMuX3NjaGVkdWxlciA9IG51bGw7XG4gICAgLy8gU2NoZWR1bGVyIGZvciBsaWZlLWN5Y2xlIG1ldGhvZHMgaW4gY29tcG9uZW50XG4gICAgdGhpcy5fY29tcFNjaGVkdWxlciA9IG51bGw7XG4gICAgLy8gTm9kZSBhY3RpdmF0b3JcbiAgICB0aGlzLl9ub2RlQWN0aXZhdG9yID0gbnVsbDtcbiAgICAvLyBBY3Rpb24gbWFuYWdlclxuICAgIHRoaXMuX2FjdGlvbk1hbmFnZXIgPSBudWxsO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGdhbWUub24oZ2FtZS5FVkVOVF9TSE9XLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuX2xhc3RVcGRhdGUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICB9KTtcblxuICAgIGdhbWUub25jZShnYW1lLkVWRU5UX0VOR0lORV9JTklURUQsIHRoaXMuaW5pdCwgdGhpcyk7XG59O1xuXG5jYy5EaXJlY3Rvci5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IGNjLkRpcmVjdG9yLFxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fdG90YWxGcmFtZXMgPSAwO1xuICAgICAgICB0aGlzLl9sYXN0VXBkYXRlID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIHRoaXMuX3N0YXJ0VGltZSA9IHRoaXMuX2xhc3RVcGRhdGU7XG4gICAgICAgIHRoaXMuX3BhdXNlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9wdXJnZURpcmVjdG9ySW5OZXh0TG9vcCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl93aW5TaXplSW5Qb2ludHMgPSBjYy5zaXplKDAsIDApO1xuICAgICAgICB0aGlzLl9zY2hlZHVsZXIgPSBuZXcgU2NoZWR1bGVyKCk7XG5cbiAgICAgICAgaWYgKGNjLkFjdGlvbk1hbmFnZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2FjdGlvbk1hbmFnZXIgPSBuZXcgY2MuQWN0aW9uTWFuYWdlcigpO1xuICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVyLnNjaGVkdWxlVXBkYXRlKHRoaXMuX2FjdGlvbk1hbmFnZXIsIFNjaGVkdWxlci5QUklPUklUWV9TWVNURU0sIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2FjdGlvbk1hbmFnZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zaGFyZWRJbml0KCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIE1hbmFnZSBhbGwgaW5pdCBwcm9jZXNzIHNoYXJlZCBiZXR3ZWVuIHRoZSB3ZWIgZW5naW5lIGFuZCBqc2IgZW5naW5lLlxuICAgICAqIEFsbCBwbGF0Zm9ybSBpbmRlcGVuZGVudCBpbml0IHByb2Nlc3Mgc2hvdWxkIGJlIG9jY3VwaWVkIGhlcmUuXG4gICAgICovXG4gICAgc2hhcmVkSW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9jb21wU2NoZWR1bGVyID0gbmV3IENvbXBvbmVudFNjaGVkdWxlcigpO1xuICAgICAgICB0aGlzLl9ub2RlQWN0aXZhdG9yID0gbmV3IE5vZGVBY3RpdmF0b3IoKTtcblxuICAgICAgICAvLyBFdmVudCBtYW5hZ2VyXG4gICAgICAgIGlmIChldmVudE1hbmFnZXIpIHtcbiAgICAgICAgICAgIGV2ZW50TWFuYWdlci5zZXRFbmFibGVkKHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQW5pbWF0aW9uIG1hbmFnZXJcbiAgICAgICAgaWYgKGNjLkFuaW1hdGlvbk1hbmFnZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hdGlvbk1hbmFnZXIgPSBuZXcgY2MuQW5pbWF0aW9uTWFuYWdlcigpO1xuICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVyLnNjaGVkdWxlVXBkYXRlKHRoaXMuX2FuaW1hdGlvbk1hbmFnZXIsIFNjaGVkdWxlci5QUklPUklUWV9TWVNURU0sIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hdGlvbk1hbmFnZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY29sbGlzaW9uIG1hbmFnZXJcbiAgICAgICAgaWYgKGNjLkNvbGxpc2lvbk1hbmFnZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbGxpc2lvbk1hbmFnZXIgPSBuZXcgY2MuQ29sbGlzaW9uTWFuYWdlcigpO1xuICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVyLnNjaGVkdWxlVXBkYXRlKHRoaXMuX2NvbGxpc2lvbk1hbmFnZXIsIFNjaGVkdWxlci5QUklPUklUWV9TWVNURU0sIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbGxpc2lvbk1hbmFnZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcGh5c2ljcyBtYW5hZ2VyXG4gICAgICAgIGlmIChjYy5QaHlzaWNzTWFuYWdlcikge1xuICAgICAgICAgICAgdGhpcy5fcGh5c2ljc01hbmFnZXIgPSBuZXcgY2MuUGh5c2ljc01hbmFnZXIoKTtcbiAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlci5zY2hlZHVsZVVwZGF0ZSh0aGlzLl9waHlzaWNzTWFuYWdlciwgU2NoZWR1bGVyLlBSSU9SSVRZX1NZU1RFTSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcGh5c2ljc01hbmFnZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcGh5c2ljcyAzZCBtYW5hZ2VyXG4gICAgICAgIGlmIChjYy5QaHlzaWNzM0RNYW5hZ2VyICYmIChDQ19QSFlTSUNTX0JVSUxUSU4gfHwgQ0NfUEhZU0lDU19DQU5OT04pKSB7XG4gICAgICAgICAgICB0aGlzLl9waHlzaWNzM0RNYW5hZ2VyID0gbmV3IGNjLlBoeXNpY3MzRE1hbmFnZXIoKTtcbiAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlci5zY2hlZHVsZVVwZGF0ZSh0aGlzLl9waHlzaWNzM0RNYW5hZ2VyLCBTY2hlZHVsZXIuUFJJT1JJVFlfU1lTVEVNLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9waHlzaWNzM0RNYW5hZ2VyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdpZGdldE1hbmFnZXJcbiAgICAgICAgaWYgKGNjLl93aWRnZXRNYW5hZ2VyKSB7XG4gICAgICAgICAgICBjYy5fd2lkZ2V0TWFuYWdlci5pbml0KHRoaXMpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGNhbGN1bGF0ZXMgZGVsdGEgdGltZSBzaW5jZSBsYXN0IHRpbWUgaXQgd2FzIGNhbGxlZFxuICAgICAqL1xuICAgIGNhbGN1bGF0ZURlbHRhVGltZTogZnVuY3Rpb24gKG5vdykge1xuICAgICAgICBpZiAoIW5vdykgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICAgICAgLy8gYXZvaWQgZGVsdGEgdGltZSBmcm9tIGJlaW5nIG5lZ2F0aXZlXG4gICAgICAgIC8vIG5lZ2F0aXZlIGRlbHRhVGltZSB3b3VsZCBiZSBjYXVzZWQgYnkgdGhlIHByZWNpc2lvbiBvZiBub3cncyB2YWx1ZSwgZm9yIGRldGFpbHMgcGxlYXNlIHNlZTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvQVBJL3dpbmRvdy9yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgICAgICAgdGhpcy5fZGVsdGFUaW1lID0gbm93ID4gdGhpcy5fbGFzdFVwZGF0ZSA/IChub3cgLSB0aGlzLl9sYXN0VXBkYXRlKSAvIDEwMDAgOiAwO1xuICAgICAgICBpZiAoQ0NfREVCVUcgJiYgKHRoaXMuX2RlbHRhVGltZSA+IDEpKVxuICAgICAgICAgICAgdGhpcy5fZGVsdGFUaW1lID0gMSAvIDYwLjA7XG5cbiAgICAgICAgdGhpcy5fbGFzdFVwZGF0ZSA9IG5vdztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIENvbnZlcnRzIGEgdmlldyBjb29yZGluYXRlIHRvIGFuIFdlYkdMIGNvb3JkaW5hdGU8YnIvPlxuICAgICAqIFVzZWZ1bCB0byBjb252ZXJ0IChtdWx0aSkgdG91Y2hlcyBjb29yZGluYXRlcyB0byB0aGUgY3VycmVudCBsYXlvdXQgKHBvcnRyYWl0IG9yIGxhbmRzY2FwZSk8YnIvPlxuICAgICAqIEltcGxlbWVudGF0aW9uIGNhbiBiZSBmb3VuZCBpbiBDQ0RpcmVjdG9yV2ViR0wuXG4gICAgICogISN6aCDlsIbop6bmkbjngrnnmoTlsY/luZXlnZDmoIfovazmjaLkuLogV2ViR0wgVmlldyDkuIvnmoTlnZDmoIfjgIJcbiAgICAgKiBAbWV0aG9kIGNvbnZlcnRUb0dMXG4gICAgICogQHBhcmFtIHtWZWMyfSB1aVBvaW50XG4gICAgICogQHJldHVybiB7VmVjMn1cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gICAgICovXG4gICAgY29udmVydFRvR0w6IGZ1bmN0aW9uICh1aVBvaW50KSB7XG4gICAgICAgIHZhciBjb250YWluZXIgPSBnYW1lLmNvbnRhaW5lcjtcbiAgICAgICAgdmFyIHZpZXcgPSBjYy52aWV3O1xuICAgICAgICB2YXIgYm94ID0gY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB2YXIgbGVmdCA9IGJveC5sZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0IC0gY29udGFpbmVyLmNsaWVudExlZnQ7XG4gICAgICAgIHZhciB0b3AgPSBib3gudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0IC0gY29udGFpbmVyLmNsaWVudFRvcDtcbiAgICAgICAgdmFyIHggPSB2aWV3Ll9kZXZpY2VQaXhlbFJhdGlvICogKHVpUG9pbnQueCAtIGxlZnQpO1xuICAgICAgICB2YXIgeSA9IHZpZXcuX2RldmljZVBpeGVsUmF0aW8gKiAodG9wICsgYm94LmhlaWdodCAtIHVpUG9pbnQueSk7XG4gICAgICAgIHJldHVybiB2aWV3Ll9pc1JvdGF0ZWQgPyBjYy52Mih2aWV3Ll92aWV3cG9ydFJlY3Qud2lkdGggLSB5LCB4KSA6IGNjLnYyKHgsIHkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ29udmVydHMgYW4gT3BlbkdMIGNvb3JkaW5hdGUgdG8gYSB2aWV3IGNvb3JkaW5hdGU8YnIvPlxuICAgICAqIFVzZWZ1bCB0byBjb252ZXJ0IG5vZGUgcG9pbnRzIHRvIHdpbmRvdyBwb2ludHMgZm9yIGNhbGxzIHN1Y2ggYXMgZ2xTY2lzc29yPGJyLz5cbiAgICAgKiBJbXBsZW1lbnRhdGlvbiBjYW4gYmUgZm91bmQgaW4gQ0NEaXJlY3RvcldlYkdMLlxuICAgICAqICEjemgg5bCG6Kem5pG454K555qEIFdlYkdMIFZpZXcg5Z2Q5qCH6L2s5o2i5Li65bGP5bmV5Z2Q5qCH44CCXG4gICAgICogQG1ldGhvZCBjb252ZXJ0VG9VSVxuICAgICAqIEBwYXJhbSB7VmVjMn0gZ2xQb2ludFxuICAgICAqIEByZXR1cm4ge1ZlYzJ9XG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICAgICAqL1xuICAgIGNvbnZlcnRUb1VJOiBmdW5jdGlvbiAoZ2xQb2ludCkge1xuICAgICAgICB2YXIgY29udGFpbmVyID0gZ2FtZS5jb250YWluZXI7XG4gICAgICAgIHZhciB2aWV3ID0gY2MudmlldztcbiAgICAgICAgdmFyIGJveCA9IGNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdmFyIGxlZnQgPSBib3gubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCAtIGNvbnRhaW5lci5jbGllbnRMZWZ0O1xuICAgICAgICB2YXIgdG9wID0gYm94LnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldCAtIGNvbnRhaW5lci5jbGllbnRUb3A7XG4gICAgICAgIHZhciB1aVBvaW50ID0gY2MudjIoMCwgMCk7XG4gICAgICAgIGlmICh2aWV3Ll9pc1JvdGF0ZWQpIHtcbiAgICAgICAgICAgIHVpUG9pbnQueCA9IGxlZnQgKyBnbFBvaW50LnkgLyB2aWV3Ll9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgdWlQb2ludC55ID0gdG9wICsgYm94LmhlaWdodCAtICh2aWV3Ll92aWV3cG9ydFJlY3Qud2lkdGggLSBnbFBvaW50LngpIC8gdmlldy5fZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHVpUG9pbnQueCA9IGxlZnQgKyBnbFBvaW50LnggKiB2aWV3Ll9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgdWlQb2ludC55ID0gdG9wICsgYm94LmhlaWdodCAtIGdsUG9pbnQueSAqIHZpZXcuX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVpUG9pbnQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEVuZCB0aGUgbGlmZSBvZiBkaXJlY3RvciBpbiB0aGUgbmV4dCBmcmFtZVxuICAgICAqIEBtZXRob2QgZW5kXG4gICAgICovXG4gICAgZW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3B1cmdlRGlyZWN0b3JJbk5leHRMb29wID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgdGhlIHNpemUgb2YgdGhlIFdlYkdMIHZpZXcgaW4gcG9pbnRzLjxici8+XG4gICAgICogSXQgdGFrZXMgaW50byBhY2NvdW50IGFueSBwb3NzaWJsZSByb3RhdGlvbiAoZGV2aWNlIG9yaWVudGF0aW9uKSBvZiB0aGUgd2luZG93LlxuICAgICAqICEjemgg6I635Y+W6KeG5Zu+55qE5aSn5bCP77yM5Lul54K55Li65Y2V5L2N44CCXG4gICAgICogQG1ldGhvZCBnZXRXaW5TaXplXG4gICAgICogQHJldHVybiB7U2l6ZX1cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gICAgICovXG4gICAgZ2V0V2luU2l6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2Muc2l6ZShjYy53aW5TaXplKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgdGhlIHNpemUgb2YgdGhlIE9wZW5HTCB2aWV3IGluIHBpeGVscy48YnIvPlxuICAgICAqIEl0IHRha2VzIGludG8gYWNjb3VudCBhbnkgcG9zc2libGUgcm90YXRpb24gKGRldmljZSBvcmllbnRhdGlvbikgb2YgdGhlIHdpbmRvdy48YnIvPlxuICAgICAqIE9uIE1hYyB3aW5TaXplIGFuZCB3aW5TaXplSW5QaXhlbHMgcmV0dXJuIHRoZSBzYW1lIHZhbHVlLlxuICAgICAqIChUaGUgcGl4ZWwgaGVyZSByZWZlcnMgdG8gdGhlIHJlc291cmNlIHJlc29sdXRpb24uIElmIHlvdSB3YW50IHRvIGdldCB0aGUgcGh5c2ljcyByZXNvbHV0aW9uIG9mIGRldmljZSwgeW91IG5lZWQgdG8gdXNlIGNjLnZpZXcuZ2V0RnJhbWVTaXplKCkpXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluinhuWbvuWkp+Wwj++8jOS7peWDj+e0oOS4uuWNleS9je+8iOi/memHjOeahOWDj+e0oOaMh+eahOaYr+i1hOa6kOWIhui+qOeOh+OAglxuICAgICAqIOWmguaenOimgeiOt+WPluWxj+W5leeJqeeQhuWIhui+qOeOh++8jOmcgOimgeeUqCBjYy52aWV3LmdldEZyYW1lU2l6ZSgp77yJXG4gICAgICogQG1ldGhvZCBnZXRXaW5TaXplSW5QaXhlbHNcbiAgICAgKiBAcmV0dXJuIHtTaXplfVxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAgICAgKi9cbiAgICBnZXRXaW5TaXplSW5QaXhlbHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNjLnNpemUoY2Mud2luU2l6ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUGF1c2UgdGhlIGRpcmVjdG9yJ3MgdGlja2VyLCBvbmx5IGludm9sdmUgdGhlIGdhbWUgbG9naWMgZXhlY3V0aW9uLlxuICAgICAqIEl0IHdvbid0IHBhdXNlIHRoZSByZW5kZXJpbmcgcHJvY2VzcyBub3IgdGhlIGV2ZW50IG1hbmFnZXIuXG4gICAgICogSWYgeW91IHdhbnQgdG8gcGF1c2UgdGhlIGVudGllciBnYW1lIGluY2x1ZGluZyByZW5kZXJpbmcsIGF1ZGlvIGFuZCBldmVudCwgXG4gICAgICogcGxlYXNlIHVzZSB7eyNjcm9zc0xpbmsgXCJHYW1lLnBhdXNlXCJ9fWNjLmdhbWUucGF1c2V7ey9jcm9zc0xpbmt9fVxuICAgICAqICEjemgg5pqC5YGc5q2j5Zyo6L+Q6KGM55qE5Zy65pmv77yM6K+l5pqC5YGc5Y+q5Lya5YGc5q2i5ri45oiP6YC76L6R5omn6KGM77yM5L2G5piv5LiN5Lya5YGc5q2i5riy5p+T5ZKMIFVJIOWTjeW6lOOAglxuICAgICAqIOWmguaenOaDs+imgeabtOW9u+W6leW+l+aaguWBnOa4uOaIj++8jOWMheWQq+a4suafk++8jOmfs+mikeWSjOS6i+S7tu+8jOivt+S9v+eUqCB7eyNjcm9zc0xpbmsgXCJHYW1lLnBhdXNlXCJ9fWNjLmdhbWUucGF1c2V7ey9jcm9zc0xpbmt9feOAglxuICAgICAqIEBtZXRob2QgcGF1c2VcbiAgICAgKi9cbiAgICBwYXVzZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fcGF1c2VkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLl9wYXVzZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGNhY2hlZCBhbGwgY29jb3MyZCBjYWNoZWQgZGF0YS5cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gICAgICovXG4gICAgcHVyZ2VDYWNoZWREYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmFzc2V0TWFuYWdlci5yZWxlYXNlQWxsKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFB1cmdlIHRoZSBjYy5kaXJlY3RvciBpdHNlbGYsIGluY2x1ZGluZyB1bnNjaGVkdWxlIGFsbCBzY2hlZHVsZSwgcmVtb3ZlIGFsbCBldmVudCBsaXN0ZW5lcnMsIGNsZWFuIHVwIGFuZCBleGl0IHRoZSBydW5uaW5nIHNjZW5lLCBzdG9wcyBhbGwgYW5pbWF0aW9ucywgY2xlYXIgY2FjaGVkIGRhdGEuXG4gICAgICovXG4gICAgcHVyZ2VEaXJlY3RvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAvL2NsZWFudXAgc2NoZWR1bGVyXG4gICAgICAgIHRoaXMuX3NjaGVkdWxlci51bnNjaGVkdWxlQWxsKCk7XG4gICAgICAgIHRoaXMuX2NvbXBTY2hlZHVsZXIudW5zY2hlZHVsZUFsbCgpO1xuXG4gICAgICAgIHRoaXMuX25vZGVBY3RpdmF0b3IucmVzZXQoKTtcblxuICAgICAgICAvLyBEaXNhYmxlIGV2ZW50IGRpc3BhdGNoaW5nXG4gICAgICAgIGlmIChldmVudE1hbmFnZXIpXG4gICAgICAgICAgICBldmVudE1hbmFnZXIuc2V0RW5hYmxlZChmYWxzZSk7XG5cbiAgICAgICAgaWYgKCFDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIGlmIChjYy5pc1ZhbGlkKHRoaXMuX3NjZW5lKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NjZW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3NjZW5lID0gbnVsbDtcblxuICAgICAgICAgICAgY2MucmVuZGVyZXIuY2xlYXIoKTtcbiAgICAgICAgICAgIGNjLmFzc2V0TWFuYWdlci5idWlsdGlucy5jbGVhcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2MuZ2FtZS5wYXVzZSgpO1xuXG4gICAgICAgIC8vIENsZWFyIGFsbCBjYWNoZXNcbiAgICAgICAgY2MuYXNzZXRNYW5hZ2VyLnJlbGVhc2VBbGwoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVzZXQgdGhlIGNjLmRpcmVjdG9yLCBjYW4gYmUgdXNlZCB0byByZXN0YXJ0IHRoZSBkaXJlY3RvciBhZnRlciBwdXJnZVxuICAgICAqL1xuICAgIHJlc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucHVyZ2VEaXJlY3RvcigpO1xuXG4gICAgICAgIGlmIChldmVudE1hbmFnZXIpXG4gICAgICAgICAgICBldmVudE1hbmFnZXIuc2V0RW5hYmxlZCh0cnVlKTtcblxuICAgICAgICAvLyBBY3Rpb24gbWFuYWdlclxuICAgICAgICBpZiAodGhpcy5fYWN0aW9uTWFuYWdlcil7XG4gICAgICAgICAgICB0aGlzLl9zY2hlZHVsZXIuc2NoZWR1bGVVcGRhdGUodGhpcy5fYWN0aW9uTWFuYWdlciwgY2MuU2NoZWR1bGVyLlBSSU9SSVRZX1NZU1RFTSwgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQW5pbWF0aW9uIG1hbmFnZXJcbiAgICAgICAgaWYgKHRoaXMuX2FuaW1hdGlvbk1hbmFnZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlci5zY2hlZHVsZVVwZGF0ZSh0aGlzLl9hbmltYXRpb25NYW5hZ2VyLCBjYy5TY2hlZHVsZXIuUFJJT1JJVFlfU1lTVEVNLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb2xsaWRlciBtYW5hZ2VyXG4gICAgICAgIGlmICh0aGlzLl9jb2xsaXNpb25NYW5hZ2VyKSB7XG4gICAgICAgICAgICB0aGlzLl9zY2hlZHVsZXIuc2NoZWR1bGVVcGRhdGUodGhpcy5fY29sbGlzaW9uTWFuYWdlciwgY2MuU2NoZWR1bGVyLlBSSU9SSVRZX1NZU1RFTSwgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUGh5c2ljcyBtYW5hZ2VyXG4gICAgICAgIGlmICh0aGlzLl9waHlzaWNzTWFuYWdlcikge1xuICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVyLnNjaGVkdWxlVXBkYXRlKHRoaXMuX3BoeXNpY3NNYW5hZ2VyLCBjYy5TY2hlZHVsZXIuUFJJT1JJVFlfU1lTVEVNLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjYy5nYW1lLnJlc3VtZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUnVuIGEgc2NlbmUuIFJlcGxhY2VzIHRoZSBydW5uaW5nIHNjZW5lIHdpdGggYSBuZXcgb25lIG9yIGVudGVyIHRoZSBmaXJzdCBzY2VuZS48YnIvPlxuICAgICAqIFRoZSBuZXcgc2NlbmUgd2lsbCBiZSBsYXVuY2hlZCBpbW1lZGlhdGVseS5cbiAgICAgKiAhI3poIOeri+WIu+WIh+aNouaMh+WumuWcuuaZr+OAglxuICAgICAqIEBtZXRob2QgcnVuU2NlbmVJbW1lZGlhdGVcbiAgICAgKiBAcGFyYW0ge1NjZW5lfFNjZW5lQXNzZXR9IHNjZW5lIC0gVGhlIG5lZWQgcnVuIHNjZW5lLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvbkJlZm9yZUxvYWRTY2VuZV0gLSBUaGUgZnVuY3Rpb24gaW52b2tlZCBhdCB0aGUgc2NlbmUgYmVmb3JlIGxvYWRpbmcuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uTGF1bmNoZWRdIC0gVGhlIGZ1bmN0aW9uIGludm9rZWQgYXQgdGhlIHNjZW5lIGFmdGVyIGxhdW5jaC5cbiAgICAgKi9cbiAgICBydW5TY2VuZUltbWVkaWF0ZTogZnVuY3Rpb24gKHNjZW5lLCBvbkJlZm9yZUxvYWRTY2VuZSwgb25MYXVuY2hlZCkge1xuICAgICAgICBjYy5hc3NlcnRJRChzY2VuZSBpbnN0YW5jZW9mIGNjLlNjZW5lIHx8IHNjZW5lIGluc3RhbmNlb2YgY2MuU2NlbmVBc3NldCwgMTIxNik7XG5cbiAgICAgICAgaWYgKHNjZW5lIGluc3RhbmNlb2YgY2MuU2NlbmVBc3NldCkgc2NlbmUgPSBzY2VuZS5zY2VuZTtcblxuICAgICAgICBDQ19CVUlMRCAmJiBDQ19ERUJVRyAmJiBjb25zb2xlLnRpbWUoJ0luaXRTY2VuZScpO1xuICAgICAgICBzY2VuZS5fbG9hZCgpOyAgLy8gZW5zdXJlIHNjZW5lIGluaXRpYWxpemVkXG4gICAgICAgIENDX0JVSUxEICYmIENDX0RFQlVHICYmIGNvbnNvbGUudGltZUVuZCgnSW5pdFNjZW5lJyk7XG5cbiAgICAgICAgLy8gUmUtYXR0YWNoIG9yIHJlcGxhY2UgcGVyc2lzdCBub2Rlc1xuICAgICAgICBDQ19CVUlMRCAmJiBDQ19ERUJVRyAmJiBjb25zb2xlLnRpbWUoJ0F0dGFjaFBlcnNpc3QnKTtcbiAgICAgICAgdmFyIHBlcnNpc3ROb2RlTGlzdCA9IE9iamVjdC5rZXlzKGdhbWUuX3BlcnNpc3RSb290Tm9kZXMpLm1hcChmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgcmV0dXJuIGdhbWUuX3BlcnNpc3RSb290Tm9kZXNbeF07XG4gICAgICAgIH0pO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBlcnNpc3ROb2RlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IG5vZGUgPSBwZXJzaXN0Tm9kZUxpc3RbaV07XG4gICAgICAgICAgICB2YXIgZXhpc3ROb2RlID0gc2NlbmUuZ2V0Q2hpbGRCeVV1aWQobm9kZS51dWlkKTtcbiAgICAgICAgICAgIGlmIChleGlzdE5vZGUpIHtcbiAgICAgICAgICAgICAgICAvLyBzY2VuZSBhbHNvIGNvbnRhaW5zIHRoZSBwZXJzaXN0IG5vZGUsIHNlbGVjdCB0aGUgb2xkIG9uZVxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGV4aXN0Tm9kZS5nZXRTaWJsaW5nSW5kZXgoKTtcbiAgICAgICAgICAgICAgICBleGlzdE5vZGUuX2Rlc3Ryb3lJbW1lZGlhdGUoKTtcbiAgICAgICAgICAgICAgICBzY2VuZS5pbnNlcnRDaGlsZChub2RlLCBpbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudCA9IHNjZW5lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIENDX0JVSUxEICYmIENDX0RFQlVHICYmIGNvbnNvbGUudGltZUVuZCgnQXR0YWNoUGVyc2lzdCcpO1xuXG4gICAgICAgIHZhciBvbGRTY2VuZSA9IHRoaXMuX3NjZW5lO1xuICAgICAgICBpZiAoIUNDX0VESVRPUikge1xuICAgICAgICAgICAgLy8gYXV0byByZWxlYXNlIGFzc2V0c1xuICAgICAgICAgICAgQ0NfQlVJTEQgJiYgQ0NfREVCVUcgJiYgY29uc29sZS50aW1lKCdBdXRvUmVsZWFzZScpO1xuICAgICAgICAgICAgY2MuYXNzZXRNYW5hZ2VyLl9yZWxlYXNlTWFuYWdlci5fYXV0b1JlbGVhc2Uob2xkU2NlbmUsIHNjZW5lLCBnYW1lLl9wZXJzaXN0Um9vdE5vZGVzKTtcbiAgICAgICAgICAgIENDX0JVSUxEICYmIENDX0RFQlVHICYmIGNvbnNvbGUudGltZUVuZCgnQXV0b1JlbGVhc2UnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVubG9hZCBzY2VuZVxuICAgICAgICBDQ19CVUlMRCAmJiBDQ19ERUJVRyAmJiBjb25zb2xlLnRpbWUoJ0Rlc3Ryb3knKTtcbiAgICAgICAgaWYgKGNjLmlzVmFsaWQob2xkU2NlbmUpKSB7XG4gICAgICAgICAgICBvbGRTY2VuZS5kZXN0cm95KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zY2VuZSA9IG51bGw7XG5cbiAgICAgICAgLy8gcHVyZ2UgZGVzdHJveWVkIG5vZGVzIGJlbG9uZ3MgdG8gb2xkIHNjZW5lXG4gICAgICAgIE9iai5fZGVmZXJyZWREZXN0cm95KCk7XG4gICAgICAgIENDX0JVSUxEICYmIENDX0RFQlVHICYmIGNvbnNvbGUudGltZUVuZCgnRGVzdHJveScpO1xuXG4gICAgICAgIGlmIChvbkJlZm9yZUxvYWRTY2VuZSkge1xuICAgICAgICAgICAgb25CZWZvcmVMb2FkU2NlbmUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVtaXQoY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX1NDRU5FX0xBVU5DSCwgc2NlbmUpO1xuXG4gICAgICAgIC8vIFJ1biBhbiBFbnRpdHkgU2NlbmVcbiAgICAgICAgdGhpcy5fc2NlbmUgPSBzY2VuZTtcblxuICAgICAgICBDQ19CVUlMRCAmJiBDQ19ERUJVRyAmJiBjb25zb2xlLnRpbWUoJ0FjdGl2YXRlJyk7XG4gICAgICAgIHNjZW5lLl9hY3RpdmF0ZSgpO1xuICAgICAgICBDQ19CVUlMRCAmJiBDQ19ERUJVRyAmJiBjb25zb2xlLnRpbWVFbmQoJ0FjdGl2YXRlJyk7XG5cbiAgICAgICAgLy9zdGFydCBzY2VuZVxuICAgICAgICBjYy5nYW1lLnJlc3VtZSgpO1xuXG4gICAgICAgIGlmIChvbkxhdW5jaGVkKSB7XG4gICAgICAgICAgICBvbkxhdW5jaGVkKG51bGwsIHNjZW5lKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVtaXQoY2MuRGlyZWN0b3IuRVZFTlRfQUZURVJfU0NFTkVfTEFVTkNILCBzY2VuZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSdW4gYSBzY2VuZS4gUmVwbGFjZXMgdGhlIHJ1bm5pbmcgc2NlbmUgd2l0aCBhIG5ldyBvbmUgb3IgZW50ZXIgdGhlIGZpcnN0IHNjZW5lLlxuICAgICAqIFRoZSBuZXcgc2NlbmUgd2lsbCBiZSBsYXVuY2hlZCBhdCB0aGUgZW5kIG9mIHRoZSBjdXJyZW50IGZyYW1lLlxuICAgICAqICEjemgg6L+Q6KGM5oyH5a6a5Zy65pmv44CCXG4gICAgICogQG1ldGhvZCBydW5TY2VuZVxuICAgICAqIEBwYXJhbSB7U2NlbmV8U2NlbmVBc3NldH0gc2NlbmUgLSBUaGUgbmVlZCBydW4gc2NlbmUuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uQmVmb3JlTG9hZFNjZW5lXSAtIFRoZSBmdW5jdGlvbiBpbnZva2VkIGF0IHRoZSBzY2VuZSBiZWZvcmUgbG9hZGluZy5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25MYXVuY2hlZF0gLSBUaGUgZnVuY3Rpb24gaW52b2tlZCBhdCB0aGUgc2NlbmUgYWZ0ZXIgbGF1bmNoLlxuICAgICAqL1xuICAgIHJ1blNjZW5lOiBmdW5jdGlvbiAoc2NlbmUsIG9uQmVmb3JlTG9hZFNjZW5lLCBvbkxhdW5jaGVkKSB7XG4gICAgICAgIGNjLmFzc2VydElEKHNjZW5lLCAxMjA1KTtcbiAgICAgICAgY2MuYXNzZXJ0SUQoc2NlbmUgaW5zdGFuY2VvZiBjYy5TY2VuZSB8fCBzY2VuZSBpbnN0YW5jZW9mIGNjLlNjZW5lQXNzZXQsIDEyMTYpO1xuXG4gICAgICAgIGlmIChzY2VuZSBpbnN0YW5jZW9mIGNjLlNjZW5lQXNzZXQpIHNjZW5lID0gc2NlbmUuc2NlbmU7XG4gICAgICAgIC8vIGVuc3VyZSBzY2VuZSBpbml0aWFsaXplZFxuICAgICAgICBzY2VuZS5fbG9hZCgpO1xuXG4gICAgICAgIC8vIERlbGF5IHJ1biAvIHJlcGxhY2Ugc2NlbmUgdG8gdGhlIGVuZCBvZiB0aGUgZnJhbWVcbiAgICAgICAgdGhpcy5vbmNlKGNjLkRpcmVjdG9yLkVWRU5UX0FGVEVSX0RSQVcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMucnVuU2NlbmVJbW1lZGlhdGUoc2NlbmUsIG9uQmVmb3JlTG9hZFNjZW5lLCBvbkxhdW5jaGVkKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gTG9hZHMgdGhlIHNjZW5lIGJ5IGl0cyBuYW1lLlxuICAgICAqICEjemgg6YCa6L+H5Zy65pmv5ZCN56ew6L+b6KGM5Yqg6L295Zy65pmv44CCXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGxvYWRTY2VuZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzY2VuZU5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgc2NlbmUgdG8gbG9hZC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25MYXVuY2hlZF0gLSBjYWxsYmFjaywgd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgc2NlbmUgbGF1bmNoZWQuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gaWYgZXJyb3IsIHJldHVybiBmYWxzZVxuICAgICAqL1xuICAgIGxvYWRTY2VuZTogZnVuY3Rpb24gKHNjZW5lTmFtZSwgb25MYXVuY2hlZCwgX29uVW5sb2FkZWQpIHtcbiAgICAgICAgaWYgKHRoaXMuX2xvYWRpbmdTY2VuZSkge1xuICAgICAgICAgICAgY2Mud2FybklEKDEyMDgsIHNjZW5lTmFtZSwgdGhpcy5fbG9hZGluZ1NjZW5lKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYnVuZGxlID0gY2MuYXNzZXRNYW5hZ2VyLmJ1bmRsZXMuZmluZChmdW5jdGlvbiAoYnVuZGxlKSB7XG4gICAgICAgICAgICByZXR1cm4gYnVuZGxlLmdldFNjZW5lSW5mbyhzY2VuZU5hbWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGJ1bmRsZSkge1xuICAgICAgICAgICAgdGhpcy5lbWl0KGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9TQ0VORV9MT0FESU5HLCBzY2VuZU5hbWUpO1xuICAgICAgICAgICAgdGhpcy5fbG9hZGluZ1NjZW5lID0gc2NlbmVOYW1lO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgY29uc29sZS50aW1lKCdMb2FkU2NlbmUgJyArIHNjZW5lTmFtZSk7XG4gICAgICAgICAgICBidW5kbGUubG9hZFNjZW5lKHNjZW5lTmFtZSwgZnVuY3Rpb24gKGVyciwgc2NlbmUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ0xvYWRTY2VuZSAnICsgc2NlbmVOYW1lKTtcbiAgICAgICAgICAgICAgICBzZWxmLl9sb2FkaW5nU2NlbmUgPSAnJztcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGVyciA9ICdGYWlsZWQgdG8gbG9hZCBzY2VuZTogJyArIGVycjtcbiAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgb25MYXVuY2hlZCAmJiBvbkxhdW5jaGVkKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnJ1blNjZW5lSW1tZWRpYXRlKHNjZW5lLCBfb25VbmxvYWRlZCwgb25MYXVuY2hlZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNjLmVycm9ySUQoMTIwOSwgc2NlbmVOYW1lKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFByZWxvYWRzIHRoZSBzY2VuZSB0byByZWR1Y2VzIGxvYWRpbmcgdGltZS4gWW91IGNhbiBjYWxsIHRoaXMgbWV0aG9kIGF0IGFueSB0aW1lIHlvdSB3YW50LlxuICAgICAqIEFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QsIHlvdSBzdGlsbCBuZWVkIHRvIGxhdW5jaCB0aGUgc2NlbmUgYnkgYGNjLmRpcmVjdG9yLmxvYWRTY2VuZWAuXG4gICAgICogSXQgd2lsbCBiZSB0b3RhbGx5IGZpbmUgdG8gY2FsbCBgY2MuZGlyZWN0b3IubG9hZFNjZW5lYCBhdCBhbnkgdGltZSBldmVuIGlmIHRoZSBwcmVsb2FkaW5nIGlzIG5vdFxuICAgICAqIHlldCBmaW5pc2hlZCwgdGhlIHNjZW5lIHdpbGwgYmUgbGF1bmNoZWQgYWZ0ZXIgbG9hZGVkIGF1dG9tYXRpY2FsbHkuXG4gICAgICogISN6aCDpooTliqDovb3lnLrmma/vvIzkvaDlj6/ku6XlnKjku7vkvZXml7blgJnosIPnlKjov5nkuKrmlrnms5XjgIJcbiAgICAgKiDosIPnlKjlrozlkI7vvIzkvaDku43nhLbpnIDopoHpgJrov4cgYGNjLmRpcmVjdG9yLmxvYWRTY2VuZWAg5p2l5ZCv5Yqo5Zy65pmv77yM5Zug5Li66L+Z5Liq5pa55rOV5LiN5Lya5omn6KGM5Zy65pmv5Yqg6L295pON5L2c44CCXG4gICAgICog5bCx566X6aKE5Yqg6L296L+Y5rKh5a6M5oiQ77yM5L2g5Lmf5Y+v5Lul55u05o6l6LCD55SoIGBjYy5kaXJlY3Rvci5sb2FkU2NlbmVg77yM5Yqg6L295a6M5oiQ5ZCO5Zy65pmv5bCx5Lya5ZCv5Yqo44CCXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHByZWxvYWRTY2VuZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzY2VuZU5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgc2NlbmUgdG8gcHJlbG9hZC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25Qcm9ncmVzc10gLSBjYWxsYmFjaywgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgbG9hZCBwcm9ncmVzc2lvbiBjaGFuZ2UuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9uUHJvZ3Jlc3MuY29tcGxldGVkQ291bnQgLSBUaGUgbnVtYmVyIG9mIHRoZSBpdGVtcyB0aGF0IGFyZSBhbHJlYWR5IGNvbXBsZXRlZFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvblByb2dyZXNzLnRvdGFsQ291bnQgLSBUaGUgdG90YWwgbnVtYmVyIG9mIHRoZSBpdGVtc1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvblByb2dyZXNzLml0ZW0gLSBUaGUgbGF0ZXN0IGl0ZW0gd2hpY2ggZmxvdyBvdXQgdGhlIHBpcGVsaW5lXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uTG9hZGVkXSAtIGNhbGxiYWNrLCB3aWxsIGJlIGNhbGxlZCBhZnRlciBzY2VuZSBsb2FkZWQuXG4gICAgICogQHBhcmFtIHtFcnJvcn0gb25Mb2FkZWQuZXJyb3IgLSBudWxsIG9yIHRoZSBlcnJvciBvYmplY3QuXG4gICAgICovXG4gICAgcHJlbG9hZFNjZW5lIChzY2VuZU5hbWUsIG9uUHJvZ3Jlc3MsIG9uTG9hZGVkKSB7XG4gICAgICAgIHZhciBidW5kbGUgPSBjYy5hc3NldE1hbmFnZXIuYnVuZGxlcy5maW5kKGZ1bmN0aW9uIChidW5kbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBidW5kbGUuZ2V0U2NlbmVJbmZvKHNjZW5lTmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoYnVuZGxlKSB7XG4gICAgICAgICAgICBidW5kbGUucHJlbG9hZFNjZW5lKHNjZW5lTmFtZSwgbnVsbCwgb25Qcm9ncmVzcywgb25Mb2FkZWQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgxMjA5LCBzY2VuZU5hbWUpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJlc3VtZSBnYW1lIGxvZ2ljIGV4ZWN1dGlvbiBhZnRlciBwYXVzZSwgaWYgdGhlIGN1cnJlbnQgc2NlbmUgaXMgbm90IHBhdXNlZCwgbm90aGluZyB3aWxsIGhhcHBlbi5cbiAgICAgKiAhI3poIOaBouWkjeaaguWBnOWcuuaZr+eahOa4uOaIj+mAu+i+ke+8jOWmguaenOW9k+WJjeWcuuaZr+ayoeacieaaguWBnOWwhuayoeS7u+S9leS6i+aDheWPkeeUn+OAglxuICAgICAqIEBtZXRob2QgcmVzdW1lXG4gICAgICovXG4gICAgcmVzdW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fcGF1c2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sYXN0VXBkYXRlID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIGlmICghdGhpcy5fbGFzdFVwZGF0ZSkge1xuICAgICAgICAgICAgY2MubG9nSUQoMTIwMCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9wYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fZGVsdGFUaW1lID0gMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEVuYWJsZXMgb3IgZGlzYWJsZXMgV2ViR0wgZGVwdGggdGVzdC48YnIvPlxuICAgICAqIEltcGxlbWVudGF0aW9uIGNhbiBiZSBmb3VuZCBpbiBDQ0RpcmVjdG9yQ2FudmFzLmpzL0NDRGlyZWN0b3JXZWJHTC5qc1xuICAgICAqICEjemgg5ZCv55SoL+emgeeUqOa3seW6pua1i+ivle+8iOWcqCBDYW52YXMg5riy5p+T5qih5byP5LiL5LiN5Lya55Sf5pWI77yJ44CCXG4gICAgICogQG1ldGhvZCBzZXREZXB0aFRlc3RcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9uXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICAgICAqL1xuICAgIHNldERlcHRoVGVzdDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICghY2MuQ2FtZXJhLm1haW4pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjYy5DYW1lcmEubWFpbi5kZXB0aCA9ICEhdmFsdWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTZXQgY29sb3IgZm9yIGNsZWFyIHNjcmVlbi48YnIvPlxuICAgICAqIChJbXBsZW1lbnRhdGlvbiBjYW4gYmUgZm91bmQgaW4gQ0NEaXJlY3RvckNhbnZhcy5qcy9DQ0RpcmVjdG9yV2ViR0wuanMpXG4gICAgICogISN6aFxuICAgICAqIOiuvue9ruWcuuaZr+eahOm7mOiupOaTpumZpOminOiJsuOAgjxici8+XG4gICAgICog5pSv5oyB5YWo6YCP5piO77yM5L2G5LiN5pSv5oyB6YCP5piO5bqm5Li65Lit6Ze05YC844CC6KaB5pSv5oyB5YWo6YCP5piO6ZyA5omL5bel5byA5ZCvIGNjLm1hY3JvLkVOQUJMRV9UUkFOU1BBUkVOVF9DQU5WQVPjgIJcbiAgICAgKiBAbWV0aG9kIHNldENsZWFyQ29sb3JcbiAgICAgKiBAcGFyYW0ge0NvbG9yfSBjbGVhckNvbG9yXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICAgICAqL1xuICAgIHNldENsZWFyQ29sb3I6IGZ1bmN0aW9uIChjbGVhckNvbG9yKSB7XG4gICAgICAgIGlmICghY2MuQ2FtZXJhLm1haW4pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjYy5DYW1lcmEubWFpbi5iYWNrZ3JvdW5kQ29sb3IgPSBjbGVhckNvbG9yO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgY3VycmVudCBsb2dpYyBTY2VuZS5cbiAgICAgKiAhI3poIOiOt+WPluW9k+WJjemAu+i+keWcuuaZr+OAglxuICAgICAqIEBtZXRob2QgZ2V0UnVubmluZ1NjZW5lXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcmV0dXJuIHtTY2VuZX1cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gICAgICovXG4gICAgZ2V0UnVubmluZ1NjZW5lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zY2VuZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIGN1cnJlbnQgbG9naWMgU2NlbmUuXG4gICAgICogISN6aCDojrflj5blvZPliY3pgLvovpHlnLrmma/jgIJcbiAgICAgKiBAbWV0aG9kIGdldFNjZW5lXG4gICAgICogQHJldHVybiB7U2NlbmV9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgLy8gVGhpcyB3aWxsIGhlbHAgeW91IHRvIGdldCB0aGUgQ2FudmFzIG5vZGUgaW4gc2NlbmVcbiAgICAgKiAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZSgnQ2FudmFzJyk7XG4gICAgICovXG4gICAgZ2V0U2NlbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjZW5lO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgdGhlIEZQUyB2YWx1ZS4gUGxlYXNlIHVzZSB7eyNjcm9zc0xpbmsgXCJHYW1lLnNldEZyYW1lUmF0ZVwifX1jYy5nYW1lLnNldEZyYW1lUmF0ZXt7L2Nyb3NzTGlua319IHRvIGNvbnRyb2wgYW5pbWF0aW9uIGludGVydmFsLlxuICAgICAqICEjemgg6I635Y+W5Y2V5L2N5bin5omn6KGM5pe26Ze044CC6K+35L2/55SoIHt7I2Nyb3NzTGluayBcIkdhbWUuc2V0RnJhbWVSYXRlXCJ9fWNjLmdhbWUuc2V0RnJhbWVSYXRle3svY3Jvc3NMaW5rfX0g5p2l5o6n5Yi25ri45oiP5bin546H44CCXG4gICAgICogQG1ldGhvZCBnZXRBbmltYXRpb25JbnRlcnZhbFxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0QW5pbWF0aW9uSW50ZXJ2YWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIDEwMDAgLyBnYW1lLmdldEZyYW1lUmF0ZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXRzIGFuaW1hdGlvbiBpbnRlcnZhbCwgdGhpcyBkb2Vzbid0IGNvbnRyb2wgdGhlIG1haW4gbG9vcC5cbiAgICAgKiBUbyBjb250cm9sIHRoZSBnYW1lJ3MgZnJhbWUgcmF0ZSBvdmVyYWxsLCBwbGVhc2UgdXNlIHt7I2Nyb3NzTGluayBcIkdhbWUuc2V0RnJhbWVSYXRlXCJ9fWNjLmdhbWUuc2V0RnJhbWVSYXRle3svY3Jvc3NMaW5rfX1cbiAgICAgKiBAbWV0aG9kIHNldEFuaW1hdGlvbkludGVydmFsXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSAtIFRoZSBhbmltYXRpb24gaW50ZXJ2YWwgZGVzaXJlZC5cbiAgICAgKi9cbiAgICBzZXRBbmltYXRpb25JbnRlcnZhbDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGdhbWUuc2V0RnJhbWVSYXRlKE1hdGgucm91bmQoMTAwMCAvIHZhbHVlKSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgZGVsdGEgdGltZSBzaW5jZSBsYXN0IGZyYW1lLlxuICAgICAqICEjemgg6I635Y+W5LiK5LiA5bin55qE5aKe6YeP5pe26Ze044CCXG4gICAgICogQG1ldGhvZCBnZXREZWx0YVRpbWVcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0RGVsdGFUaW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWx0YVRpbWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgdG90YWwgcGFzc2VkIHRpbWUgc2luY2UgZ2FtZSBzdGFydCwgdW5pdDogbXNcbiAgICAgKiAhI3poIOiOt+WPluS7jua4uOaIj+W8gOWni+WIsOeOsOWcqOaAu+WFsee7j+i/h+eahOaXtumXtO+8jOWNleS9jeS4uiBtc1xuICAgICAqIEBtZXRob2QgZ2V0VG90YWxUaW1lXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldFRvdGFsVGltZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcGVyZm9ybWFuY2Uubm93KCkgLSB0aGlzLl9zdGFydFRpbWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyBob3cgbWFueSBmcmFtZXMgd2VyZSBjYWxsZWQgc2luY2UgdGhlIGRpcmVjdG9yIHN0YXJ0ZWQuXG4gICAgICogISN6aCDojrflj5YgZGlyZWN0b3Ig5ZCv5Yqo5Lul5p2l5ri45oiP6L+Q6KGM55qE5oC75bin5pWw44CCXG4gICAgICogQG1ldGhvZCBnZXRUb3RhbEZyYW1lc1xuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRUb3RhbEZyYW1lczogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdG90YWxGcmFtZXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgRGlyZWN0b3IgaXMgcGF1c2VkLlxuICAgICAqICEjemgg5piv5ZCm5aSE5LqO5pqC5YGc54q25oCB44CCXG4gICAgICogQG1ldGhvZCBpc1BhdXNlZFxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaXNQYXVzZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhdXNlZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBjYy5TY2hlZHVsZXIgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZGlyZWN0b3IuXG4gICAgICogISN6aCDojrflj5blkowgZGlyZWN0b3Ig55u45YWz6IGU55qEIGNjLlNjaGVkdWxlcuOAglxuICAgICAqIEBtZXRob2QgZ2V0U2NoZWR1bGVyXG4gICAgICogQHJldHVybiB7U2NoZWR1bGVyfVxuICAgICAqL1xuICAgIGdldFNjaGVkdWxlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2NoZWR1bGVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgdGhlIGNjLlNjaGVkdWxlciBhc3NvY2lhdGVkIHdpdGggdGhpcyBkaXJlY3Rvci5cbiAgICAgKiAhI3poIOiuvue9ruWSjCBkaXJlY3RvciDnm7jlhbPogZTnmoQgY2MuU2NoZWR1bGVy44CCXG4gICAgICogQG1ldGhvZCBzZXRTY2hlZHVsZXJcbiAgICAgKiBAcGFyYW0ge1NjaGVkdWxlcn0gc2NoZWR1bGVyXG4gICAgICovXG4gICAgc2V0U2NoZWR1bGVyOiBmdW5jdGlvbiAoc2NoZWR1bGVyKSB7XG4gICAgICAgIGlmICh0aGlzLl9zY2hlZHVsZXIgIT09IHNjaGVkdWxlcikge1xuICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgY2MuQWN0aW9uTWFuYWdlciBhc3NvY2lhdGVkIHdpdGggdGhpcyBkaXJlY3Rvci5cbiAgICAgKiAhI3poIOiOt+WPluWSjCBkaXJlY3RvciDnm7jlhbPogZTnmoQgY2MuQWN0aW9uTWFuYWdlcu+8iOWKqOS9nOeuoeeQhuWZqO+8ieOAglxuICAgICAqIEBtZXRob2QgZ2V0QWN0aW9uTWFuYWdlclxuICAgICAqIEByZXR1cm4ge0FjdGlvbk1hbmFnZXJ9XG4gICAgICovXG4gICAgZ2V0QWN0aW9uTWFuYWdlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWN0aW9uTWFuYWdlcjtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0cyB0aGUgY2MuQWN0aW9uTWFuYWdlciBhc3NvY2lhdGVkIHdpdGggdGhpcyBkaXJlY3Rvci5cbiAgICAgKiAhI3poIOiuvue9ruWSjCBkaXJlY3RvciDnm7jlhbPogZTnmoQgY2MuQWN0aW9uTWFuYWdlcu+8iOWKqOS9nOeuoeeQhuWZqO+8ieOAglxuICAgICAqIEBtZXRob2Qgc2V0QWN0aW9uTWFuYWdlclxuICAgICAqIEBwYXJhbSB7QWN0aW9uTWFuYWdlcn0gYWN0aW9uTWFuYWdlclxuICAgICAqL1xuICAgIHNldEFjdGlvbk1hbmFnZXI6IGZ1bmN0aW9uIChhY3Rpb25NYW5hZ2VyKSB7XG4gICAgICAgIGlmICh0aGlzLl9hY3Rpb25NYW5hZ2VyICE9PSBhY3Rpb25NYW5hZ2VyKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aW9uTWFuYWdlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlci51bnNjaGVkdWxlVXBkYXRlKHRoaXMuX2FjdGlvbk1hbmFnZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fYWN0aW9uTWFuYWdlciA9IGFjdGlvbk1hbmFnZXI7XG4gICAgICAgICAgICB0aGlzLl9zY2hlZHVsZXIuc2NoZWR1bGVVcGRhdGUodGhpcy5fYWN0aW9uTWFuYWdlciwgY2MuU2NoZWR1bGVyLlBSSU9SSVRZX1NZU1RFTSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qIFxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgY2MuQW5pbWF0aW9uTWFuYWdlciBhc3NvY2lhdGVkIHdpdGggdGhpcyBkaXJlY3Rvci5cbiAgICAgKiAhI3poIOiOt+WPluWSjCBkaXJlY3RvciDnm7jlhbPogZTnmoQgY2MuQW5pbWF0aW9uTWFuYWdlcu+8iOWKqOeUu+euoeeQhuWZqO+8ieOAglxuICAgICAqIEBtZXRob2QgZ2V0QW5pbWF0aW9uTWFuYWdlclxuICAgICAqIEByZXR1cm4ge0FuaW1hdGlvbk1hbmFnZXJ9XG4gICAgICovXG4gICAgZ2V0QW5pbWF0aW9uTWFuYWdlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYW5pbWF0aW9uTWFuYWdlcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBjYy5Db2xsaXNpb25NYW5hZ2VyIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGRpcmVjdG9yLlxuICAgICAqICEjemgg6I635Y+W5ZKMIGRpcmVjdG9yIOebuOWFs+iBlOeahCBjYy5Db2xsaXNpb25NYW5hZ2VyIO+8iOeisOaSnueuoeeQhuWZqO+8ieOAglxuICAgICAqIEBtZXRob2QgZ2V0Q29sbGlzaW9uTWFuYWdlclxuICAgICAqIEByZXR1cm4ge0NvbGxpc2lvbk1hbmFnZXJ9XG4gICAgICovXG4gICAgZ2V0Q29sbGlzaW9uTWFuYWdlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29sbGlzaW9uTWFuYWdlcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBjYy5QaHlzaWNzTWFuYWdlciBhc3NvY2lhdGVkIHdpdGggdGhpcyBkaXJlY3Rvci5cbiAgICAgKiAhI3poIOi/lOWbnuS4jiBkaXJlY3RvciDnm7jlhbPogZTnmoQgY2MuUGh5c2ljc01hbmFnZXIg77yI54mp55CG566h55CG5Zmo77yJ44CCXG4gICAgICogQG1ldGhvZCBnZXRQaHlzaWNzTWFuYWdlclxuICAgICAqIEByZXR1cm4ge1BoeXNpY3NNYW5hZ2VyfVxuICAgICAqL1xuICAgIGdldFBoeXNpY3NNYW5hZ2VyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9waHlzaWNzTWFuYWdlcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBjYy5QaHlzaWNzM0RNYW5hZ2VyIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGRpcmVjdG9yLlxuICAgICAqICEjemgg6L+U5Zue5LiOIGRpcmVjdG9yIOebuOWFs+iBlOeahCBjYy5QaHlzaWNzM0RNYW5hZ2VyIO+8iOeJqeeQhueuoeeQhuWZqO+8ieOAglxuICAgICAqIEBtZXRob2QgZ2V0UGh5c2ljczNETWFuYWdlclxuICAgICAqIEByZXR1cm4ge1BoeXNpY3MzRE1hbmFnZXJ9XG4gICAgICovXG4gICAgZ2V0UGh5c2ljczNETWFuYWdlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGh5c2ljczNETWFuYWdlcjtcbiAgICB9LFxuXG4gICAgLy8gTG9vcCBtYW5hZ2VtZW50XG4gICAgLypcbiAgICAgKiBTdGFydHMgQW5pbWF0aW9uXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMS4yXG4gICAgICovXG4gICAgc3RhcnRBbmltYXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuZ2FtZS5yZXN1bWUoKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBTdG9wcyBhbmltYXRpb25cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4xLjJcbiAgICAgKi9cbiAgICBzdG9wQW5pbWF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmdhbWUucGF1c2UoKTtcbiAgICB9LFxuXG4gICAgX3Jlc2V0RGVsdGFUaW1lICgpIHtcbiAgICAgICAgdGhpcy5fbGFzdFVwZGF0ZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICB0aGlzLl9kZWx0YVRpbWUgPSAwO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIFJ1biBtYWluIGxvb3Agb2YgZGlyZWN0b3JcbiAgICAgKi9cbiAgICBtYWluTG9vcDogQ0NfRURJVE9SID8gZnVuY3Rpb24gKGRlbHRhVGltZSwgdXBkYXRlQW5pbWF0ZSkge1xuICAgICAgICB0aGlzLl9kZWx0YVRpbWUgPSBkZWx0YVRpbWU7XG5cbiAgICAgICAgLy8gVXBkYXRlXG4gICAgICAgIGlmICghdGhpcy5fcGF1c2VkKSB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX1VQREFURSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2NvbXBTY2hlZHVsZXIuc3RhcnRQaGFzZSgpO1xuICAgICAgICAgICAgdGhpcy5fY29tcFNjaGVkdWxlci51cGRhdGVQaGFzZShkZWx0YVRpbWUpO1xuXG4gICAgICAgICAgICBpZiAodXBkYXRlQW5pbWF0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlci51cGRhdGUoZGVsdGFUaW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fY29tcFNjaGVkdWxlci5sYXRlVXBkYXRlUGhhc2UoZGVsdGFUaW1lKTtcblxuICAgICAgICAgICAgdGhpcy5lbWl0KGNjLkRpcmVjdG9yLkVWRU5UX0FGVEVSX1VQREFURSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZW5kZXJcbiAgICAgICAgdGhpcy5lbWl0KGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9EUkFXKTtcbiAgICAgICAgcmVuZGVyZXIucmVuZGVyKHRoaXMuX3NjZW5lLCBkZWx0YVRpbWUpO1xuICAgICAgICBcbiAgICAgICAgLy8gQWZ0ZXIgZHJhd1xuICAgICAgICB0aGlzLmVtaXQoY2MuRGlyZWN0b3IuRVZFTlRfQUZURVJfRFJBVyk7XG5cbiAgICAgICAgdGhpcy5fdG90YWxGcmFtZXMrKztcblxuICAgIH0gOiBmdW5jdGlvbiAobm93KSB7XG4gICAgICAgIGlmICh0aGlzLl9wdXJnZURpcmVjdG9ySW5OZXh0TG9vcCkge1xuICAgICAgICAgICAgdGhpcy5fcHVyZ2VEaXJlY3RvckluTmV4dExvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucHVyZ2VEaXJlY3RvcigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gY2FsY3VsYXRlIFwiZ2xvYmFsXCIgZHRcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlRGVsdGFUaW1lKG5vdyk7XG5cbiAgICAgICAgICAgIC8vIFVwZGF0ZVxuICAgICAgICAgICAgaWYgKCF0aGlzLl9wYXVzZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBiZWZvcmUgdXBkYXRlXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9VUERBVEUpO1xuXG4gICAgICAgICAgICAgICAgLy8gQ2FsbCBzdGFydCBmb3IgbmV3IGFkZGVkIGNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICB0aGlzLl9jb21wU2NoZWR1bGVyLnN0YXJ0UGhhc2UoKTtcblxuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSBmb3IgY29tcG9uZW50c1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbXBTY2hlZHVsZXIudXBkYXRlUGhhc2UodGhpcy5fZGVsdGFUaW1lKTtcbiAgICAgICAgICAgICAgICAvLyBFbmdpbmUgdXBkYXRlIHdpdGggc2NoZWR1bGVyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVyLnVwZGF0ZSh0aGlzLl9kZWx0YVRpbWUpO1xuXG4gICAgICAgICAgICAgICAgLy8gTGF0ZSB1cGRhdGUgZm9yIGNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICB0aGlzLl9jb21wU2NoZWR1bGVyLmxhdGVVcGRhdGVQaGFzZSh0aGlzLl9kZWx0YVRpbWUpO1xuXG4gICAgICAgICAgICAgICAgLy8gVXNlciBjYW4gdXNlIHRoaXMgZXZlbnQgdG8gZG8gdGhpbmdzIGFmdGVyIHVwZGF0ZVxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChjYy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9VUERBVEUpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIERlc3Ryb3kgZW50aXRpZXMgdGhhdCBoYXZlIGJlZW4gcmVtb3ZlZCByZWNlbnRseVxuICAgICAgICAgICAgICAgIE9iai5fZGVmZXJyZWREZXN0cm95KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJlbmRlclxuICAgICAgICAgICAgdGhpcy5lbWl0KGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9EUkFXKTtcbiAgICAgICAgICAgIHJlbmRlcmVyLnJlbmRlcih0aGlzLl9zY2VuZSwgdGhpcy5fZGVsdGFUaW1lKTtcblxuICAgICAgICAgICAgLy8gQWZ0ZXIgZHJhd1xuICAgICAgICAgICAgdGhpcy5lbWl0KGNjLkRpcmVjdG9yLkVWRU5UX0FGVEVSX0RSQVcpO1xuXG4gICAgICAgICAgICBldmVudE1hbmFnZXIuZnJhbWVVcGRhdGVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIHRoaXMuX3RvdGFsRnJhbWVzKys7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX19mYXN0T246IGZ1bmN0aW9uICh0eXBlLCBjYWxsYmFjaywgdGFyZ2V0KSB7XG4gICAgICAgIHRoaXMub24odHlwZSwgY2FsbGJhY2ssIHRhcmdldCk7XG4gICAgfSxcblxuICAgIF9fZmFzdE9mZjogZnVuY3Rpb24gKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQpIHtcbiAgICAgICAgdGhpcy5vZmYodHlwZSwgY2FsbGJhY2ssIHRhcmdldCk7XG4gICAgfSxcbn07XG5cbi8vIEV2ZW50IHRhcmdldFxuY2MuanMuYWRkb24oY2MuRGlyZWN0b3IucHJvdG90eXBlLCBFdmVudFRhcmdldC5wcm90b3R5cGUpO1xuXG4vKipcbiAqICEjZW4gVGhlIGV2ZW50IHByb2plY3Rpb24gY2hhbmdlZCBvZiBjYy5EaXJlY3Rvci4gVGhpcyBldmVudCB3aWxsIG5vdCBnZXQgdHJpZ2dlcmVkIHNpbmNlIHYyLjBcbiAqICEjemggY2MuRGlyZWN0b3Ig5oqV5b2x5Y+Y5YyW55qE5LqL5Lu244CC5LuOIHYyLjAg5byA5aeL6L+Z5Liq5LqL5Lu25LiN5Lya5YaN6KKr6Kem5Y+RXG4gKiBAcHJvcGVydHkge1N0cmluZ30gRVZFTlRfUFJPSkVDVElPTl9DSEFOR0VEXG4gKiBAcmVhZG9ubHlcbiAqIEBzdGF0aWNcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAqL1xuY2MuRGlyZWN0b3IuRVZFTlRfUFJPSkVDVElPTl9DSEFOR0VEID0gXCJkaXJlY3Rvcl9wcm9qZWN0aW9uX2NoYW5nZWRcIjtcblxuLyoqXG4gKiAhI2VuIFRoZSBldmVudCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCBiZWZvcmUgbG9hZGluZyBhIG5ldyBzY2VuZS5cbiAqICEjemgg5Yqg6L295paw5Zy65pmv5LmL5YmN5omA6Kem5Y+R55qE5LqL5Lu244CCXG4gKiBAZXZlbnQgY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX1NDRU5FX0xPQURJTkdcbiAqIEBwYXJhbSB7U3RyaW5nfSBzY2VuZU5hbWUgLSBUaGUgbG9hZGluZyBzY2VuZSBuYW1lXG4gKi9cbi8qKlxuICogISNlbiBUaGUgZXZlbnQgd2hpY2ggd2lsbCBiZSB0cmlnZ2VyZWQgYmVmb3JlIGxvYWRpbmcgYSBuZXcgc2NlbmUuXG4gKiAhI3poIOWKoOi9veaWsOWcuuaZr+S5i+WJjeaJgOinpuWPkeeahOS6i+S7tuOAglxuICogQHByb3BlcnR5IHtTdHJpbmd9IEVWRU5UX0JFRk9SRV9TQ0VORV9MT0FESU5HXG4gKiBAcmVhZG9ubHlcbiAqIEBzdGF0aWNcbiAqL1xuY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX1NDRU5FX0xPQURJTkcgPSBcImRpcmVjdG9yX2JlZm9yZV9zY2VuZV9sb2FkaW5nXCI7XG5cbi8qXG4gKiAhI2VuIFRoZSBldmVudCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCBiZWZvcmUgbGF1bmNoaW5nIGEgbmV3IHNjZW5lLlxuICogISN6aCDov5DooYzmlrDlnLrmma/kuYvliY3miYDop6blj5HnmoTkuovku7bjgIJcbiAqIEBldmVudCBjYy5EaXJlY3Rvci5FVkVOVF9CRUZPUkVfU0NFTkVfTEFVTkNIXG4gKiBAcGFyYW0ge1N0cmluZ30gc2NlbmVOYW1lIC0gTmV3IHNjZW5lIHdoaWNoIHdpbGwgYmUgbGF1bmNoZWRcbiAqL1xuLyoqXG4gKiAhI2VuIFRoZSBldmVudCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCBiZWZvcmUgbGF1bmNoaW5nIGEgbmV3IHNjZW5lLlxuICogISN6aCDov5DooYzmlrDlnLrmma/kuYvliY3miYDop6blj5HnmoTkuovku7bjgIJcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBFVkVOVF9CRUZPUkVfU0NFTkVfTEFVTkNIXG4gKiBAcmVhZG9ubHlcbiAqIEBzdGF0aWNcbiAqL1xuY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX1NDRU5FX0xBVU5DSCA9IFwiZGlyZWN0b3JfYmVmb3JlX3NjZW5lX2xhdW5jaFwiO1xuXG4vKipcbiAqICEjZW4gVGhlIGV2ZW50IHdoaWNoIHdpbGwgYmUgdHJpZ2dlcmVkIGFmdGVyIGxhdW5jaGluZyBhIG5ldyBzY2VuZS5cbiAqICEjemgg6L+Q6KGM5paw5Zy65pmv5LmL5ZCO5omA6Kem5Y+R55qE5LqL5Lu244CCXG4gKiBAZXZlbnQgY2MuRGlyZWN0b3IuRVZFTlRfQUZURVJfU0NFTkVfTEFVTkNIXG4gKiBAcGFyYW0ge1N0cmluZ30gc2NlbmVOYW1lIC0gTmV3IHNjZW5lIHdoaWNoIGlzIGxhdW5jaGVkXG4gKi9cbi8qKlxuICogISNlbiBUaGUgZXZlbnQgd2hpY2ggd2lsbCBiZSB0cmlnZ2VyZWQgYWZ0ZXIgbGF1bmNoaW5nIGEgbmV3IHNjZW5lLlxuICogISN6aCDov5DooYzmlrDlnLrmma/kuYvlkI7miYDop6blj5HnmoTkuovku7bjgIJcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBFVkVOVF9BRlRFUl9TQ0VORV9MQVVOQ0hcbiAqIEByZWFkb25seVxuICogQHN0YXRpY1xuICovXG5jYy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9TQ0VORV9MQVVOQ0ggPSBcImRpcmVjdG9yX2FmdGVyX3NjZW5lX2xhdW5jaFwiO1xuXG4vKipcbiAqICEjZW4gVGhlIGV2ZW50IHdoaWNoIHdpbGwgYmUgdHJpZ2dlcmVkIGF0IHRoZSBiZWdpbm5pbmcgb2YgZXZlcnkgZnJhbWUuXG4gKiAhI3poIOavj+S4quW4p+eahOW8gOWni+aXtuaJgOinpuWPkeeahOS6i+S7tuOAglxuICogQGV2ZW50IGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9VUERBVEVcbiAqL1xuLyoqXG4gKiAhI2VuIFRoZSBldmVudCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCBhdCB0aGUgYmVnaW5uaW5nIG9mIGV2ZXJ5IGZyYW1lLlxuICogISN6aCDmr4/kuKrluKfnmoTlvIDlp4vml7bmiYDop6blj5HnmoTkuovku7bjgIJcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBFVkVOVF9CRUZPUkVfVVBEQVRFXG4gKiBAcmVhZG9ubHlcbiAqIEBzdGF0aWNcbiAqL1xuY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX1VQREFURSA9IFwiZGlyZWN0b3JfYmVmb3JlX3VwZGF0ZVwiO1xuXG4vKipcbiAqICEjZW4gVGhlIGV2ZW50IHdoaWNoIHdpbGwgYmUgdHJpZ2dlcmVkIGFmdGVyIGVuZ2luZSBhbmQgY29tcG9uZW50cyB1cGRhdGUgbG9naWMuXG4gKiAhI3poIOWwhuWcqOW8leaTjuWSjOe7hOS7tiDigJx1cGRhdGXigJ0g6YC76L6R5LmL5ZCO5omA6Kem5Y+R55qE5LqL5Lu244CCXG4gKiBAZXZlbnQgY2MuRGlyZWN0b3IuRVZFTlRfQUZURVJfVVBEQVRFXG4gKi9cbi8qKlxuICogISNlbiBUaGUgZXZlbnQgd2hpY2ggd2lsbCBiZSB0cmlnZ2VyZWQgYWZ0ZXIgZW5naW5lIGFuZCBjb21wb25lbnRzIHVwZGF0ZSBsb2dpYy5cbiAqICEjemgg5bCG5Zyo5byV5pOO5ZKM57uE5Lu2IOKAnHVwZGF0ZeKAnSDpgLvovpHkuYvlkI7miYDop6blj5HnmoTkuovku7bjgIJcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBFVkVOVF9BRlRFUl9VUERBVEVcbiAqIEByZWFkb25seVxuICogQHN0YXRpY1xuICovXG5jYy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9VUERBVEUgPSBcImRpcmVjdG9yX2FmdGVyX3VwZGF0ZVwiO1xuXG4vKipcbiAqICEjZW4gVGhlIGV2ZW50IGlzIGRlcHJlY2F0ZWQgc2luY2UgdjIuMCwgcGxlYXNlIHVzZSBjYy5EaXJlY3Rvci5FVkVOVF9CRUZPUkVfRFJBVyBpbnN0ZWFkXG4gKiAhI3poIOi/meS4quS6i+S7tuS7jiB2Mi4wIOW8gOWni+iiq+W6n+W8g++8jOivt+ebtOaOpeS9v+eUqCBjYy5EaXJlY3Rvci5FVkVOVF9CRUZPUkVfRFJBV1xuICogQHByb3BlcnR5IHtTdHJpbmd9IEVWRU5UX0JFRk9SRV9WSVNJVFxuICogQHJlYWRvbmx5XG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gKiBAc3RhdGljXG4gKi9cbmNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9WSVNJVCA9IFwiZGlyZWN0b3JfYmVmb3JlX2RyYXdcIjtcblxuLyoqXG4gKiAhI2VuIFRoZSBldmVudCBpcyBkZXByZWNhdGVkIHNpbmNlIHYyLjAsIHBsZWFzZSB1c2UgY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX0RSQVcgaW5zdGVhZFxuICogISN6aCDov5nkuKrkuovku7bku44gdjIuMCDlvIDlp4vooqvlup/lvIPvvIzor7fnm7TmjqXkvb/nlKggY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX0RSQVdcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBFVkVOVF9BRlRFUl9WSVNJVFxuICogQHJlYWRvbmx5XG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gKiBAc3RhdGljXG4gKi9cbmNjLkRpcmVjdG9yLkVWRU5UX0FGVEVSX1ZJU0lUID0gXCJkaXJlY3Rvcl9iZWZvcmVfZHJhd1wiO1xuXG4vKipcbiAqICEjZW4gVGhlIGV2ZW50IHdoaWNoIHdpbGwgYmUgdHJpZ2dlcmVkIGJlZm9yZSB0aGUgcmVuZGVyaW5nIHByb2Nlc3MuXG4gKiAhI3poIOa4suafk+i/h+eoi+S5i+WJjeaJgOinpuWPkeeahOS6i+S7tuOAglxuICogQGV2ZW50IGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9EUkFXXG4gKi9cbi8qKlxuICogISNlbiBUaGUgZXZlbnQgd2hpY2ggd2lsbCBiZSB0cmlnZ2VyZWQgYmVmb3JlIHRoZSByZW5kZXJpbmcgcHJvY2Vzcy5cbiAqICEjemgg5riy5p+T6L+H56iL5LmL5YmN5omA6Kem5Y+R55qE5LqL5Lu244CCXG4gKiBAcHJvcGVydHkge1N0cmluZ30gRVZFTlRfQkVGT1JFX0RSQVdcbiAqIEByZWFkb25seVxuICogQHN0YXRpY1xuICovXG5jYy5EaXJlY3Rvci5FVkVOVF9CRUZPUkVfRFJBVyA9IFwiZGlyZWN0b3JfYmVmb3JlX2RyYXdcIjtcblxuLyoqXG4gKiAhI2VuIFRoZSBldmVudCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCBhZnRlciB0aGUgcmVuZGVyaW5nIHByb2Nlc3MuXG4gKiAhI3poIOa4suafk+i/h+eoi+S5i+WQjuaJgOinpuWPkeeahOS6i+S7tuOAglxuICogQGV2ZW50IGNjLkRpcmVjdG9yLkVWRU5UX0FGVEVSX0RSQVdcbiAqL1xuLyoqXG4gKiAhI2VuIFRoZSBldmVudCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCBhZnRlciB0aGUgcmVuZGVyaW5nIHByb2Nlc3MuXG4gKiAhI3poIOa4suafk+i/h+eoi+S5i+WQjuaJgOinpuWPkeeahOS6i+S7tuOAglxuICogQHByb3BlcnR5IHtTdHJpbmd9IEVWRU5UX0FGVEVSX0RSQVdcbiAqIEByZWFkb25seVxuICogQHN0YXRpY1xuICovXG5jYy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9EUkFXID0gXCJkaXJlY3Rvcl9hZnRlcl9kcmF3XCI7XG5cbi8vUG9zc2libGUgT3BlbkdMIHByb2plY3Rpb25zIHVzZWQgYnkgZGlyZWN0b3JcblxuLyoqXG4gKiBDb25zdGFudCBmb3IgMkQgcHJvamVjdGlvbiAob3J0aG9nb25hbCBwcm9qZWN0aW9uKVxuICogQHByb3BlcnR5IHtOdW1iZXJ9IFBST0pFQ1RJT05fMkRcbiAqIEBkZWZhdWx0IDBcbiAqIEByZWFkb25seVxuICogQHN0YXRpY1xuICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICovXG5jYy5EaXJlY3Rvci5QUk9KRUNUSU9OXzJEID0gMDtcblxuLyoqXG4gKiBDb25zdGFudCBmb3IgM0QgcHJvamVjdGlvbiB3aXRoIGEgZm92eT02MCwgem5lYXI9MC41ZiBhbmQgemZhcj0xNTAwLlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IFBST0pFQ1RJT05fM0RcbiAqIEBkZWZhdWx0IDFcbiAqIEByZWFkb25seVxuICogQHN0YXRpY1xuICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICovXG5jYy5EaXJlY3Rvci5QUk9KRUNUSU9OXzNEID0gMTtcblxuLyoqXG4gKiBDb25zdGFudCBmb3IgY3VzdG9tIHByb2plY3Rpb24sIGlmIGNjLkRpcmVjdG9yJ3MgcHJvamVjdGlvbiBzZXQgdG8gaXQsIGl0IGNhbGxzIFwidXBkYXRlUHJvamVjdGlvblwiIG9uIHRoZSBwcm9qZWN0aW9uIGRlbGVnYXRlLlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IFBST0pFQ1RJT05fQ1VTVE9NXG4gKiBAZGVmYXVsdCAzXG4gKiBAcmVhZG9ubHlcbiAqIEBzdGF0aWNcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAqL1xuY2MuRGlyZWN0b3IuUFJPSkVDVElPTl9DVVNUT00gPSAzO1xuXG4vKipcbiAqIENvbnN0YW50IGZvciBkZWZhdWx0IHByb2plY3Rpb24gb2YgY2MuRGlyZWN0b3IsIGRlZmF1bHQgcHJvamVjdGlvbiBpcyAyRCBwcm9qZWN0aW9uXG4gKiBAcHJvcGVydHkge051bWJlcn0gUFJPSkVDVElPTl9ERUZBVUxUXG4gKiBAZGVmYXVsdCBjYy5EaXJlY3Rvci5QUk9KRUNUSU9OXzJEXG4gKiBAcmVhZG9ubHlcbiAqIEBzdGF0aWNcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAqL1xuY2MuRGlyZWN0b3IuUFJPSkVDVElPTl9ERUZBVUxUID0gY2MuRGlyZWN0b3IuUFJPSkVDVElPTl8yRDtcblxuLyoqXG4gKiBUaGUgZXZlbnQgd2hpY2ggd2lsbCBiZSB0cmlnZ2VyZWQgYmVmb3JlIHRoZSBwaHlzaWNzIHByb2Nlc3MuPGJyLz5cbiAqIOeJqeeQhui/h+eoi+S5i+WJjeaJgOinpuWPkeeahOS6i+S7tuOAglxuICogQGV2ZW50IERpcmVjdG9yLkVWRU5UX0JFRk9SRV9QSFlTSUNTXG4gKiBAcmVhZG9ubHlcbiAqL1xuY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX1BIWVNJQ1MgPSAnZGlyZWN0b3JfYmVmb3JlX3BoeXNpY3MnO1xuXG4vKipcbiAqIFRoZSBldmVudCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCBhZnRlciB0aGUgcGh5c2ljcyBwcm9jZXNzLjxici8+XG4gKiDniannkIbov4fnqIvkuYvlkI7miYDop6blj5HnmoTkuovku7bjgIJcbiAqIEBldmVudCBEaXJlY3Rvci5FVkVOVF9BRlRFUl9QSFlTSUNTXG4gKiBAcmVhZG9ubHlcbiAqL1xuY2MuRGlyZWN0b3IuRVZFTlRfQUZURVJfUEhZU0lDUyA9ICdkaXJlY3Rvcl9hZnRlcl9waHlzaWNzJztcblxuLyoqXG4gKiBAbW9kdWxlIGNjXG4gKi9cblxuLyoqXG4gKiAhI2VuIERpcmVjdG9yXG4gKiAhI3poIOWvvOa8lOexu+OAglxuICogQHByb3BlcnR5IGRpcmVjdG9yXG4gKiBAdHlwZSB7RGlyZWN0b3J9XG4gKi9cbmNjLmRpcmVjdG9yID0gbmV3IGNjLkRpcmVjdG9yKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gY2MuZGlyZWN0b3I7Il0sInNvdXJjZVJvb3QiOiIvIn0=