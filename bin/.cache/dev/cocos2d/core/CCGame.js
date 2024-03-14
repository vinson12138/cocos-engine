
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/CCGame.js';
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
var EventTarget = require('./event/event-target');

require('../audio/CCAudioEngine');

var debug = require('./CCDebug');

var renderer = require('./renderer/index.js');

var dynamicAtlasManager = require('../core/renderer/utils/dynamic-atlas/manager');
/**
 * @module cc
 */

/**
 * !#en An object to boot the game.
 * !#zh 包含游戏主体信息并负责驱动游戏的游戏对象。
 * @class Game
 * @extends EventTarget
 */


var game = {
  /**
   * !#en Event triggered when game hide to background.
   * Please note that this event is not 100% guaranteed to be fired on Web platform,
   * on native platforms, it corresponds to enter background event, os status bar or notification center may not trigger this event.
   * !#zh 游戏进入后台时触发的事件。
   * 请注意，在 WEB 平台，这个事件不一定会 100% 触发，这完全取决于浏览器的回调行为。
   * 在原生平台，它对应的是应用被切换到后台事件，下拉菜单和上拉状态栏等不一定会触发这个事件，这取决于系统行为。
   * @property EVENT_HIDE
   * @type {String}
   * @example
   * cc.game.on(cc.game.EVENT_HIDE, function () {
   *     cc.audioEngine.pauseMusic();
   *     cc.audioEngine.pauseAllEffects();
   * });
   */
  EVENT_HIDE: "game_on_hide",

  /**
   * !#en Event triggered when game back to foreground
   * Please note that this event is not 100% guaranteed to be fired on Web platform,
   * on native platforms, it corresponds to enter foreground event.
   * !#zh 游戏进入前台运行时触发的事件。
   * 请注意，在 WEB 平台，这个事件不一定会 100% 触发，这完全取决于浏览器的回调行为。
   * 在原生平台，它对应的是应用被切换到前台事件。
   * @property EVENT_SHOW
   * @constant
   * @type {String}
   */
  EVENT_SHOW: "game_on_show",

  /**
   * !#en Event triggered when game restart
   * !#zh 调用restart后，触发事件。
   * @property EVENT_RESTART
   * @constant
   * @type {String}
   */
  EVENT_RESTART: "game_on_restart",

  /**
   * Event triggered after game inited, at this point all engine objects and game scripts are loaded
   * @property EVENT_GAME_INITED
   * @constant
   * @type {String}
   */
  EVENT_GAME_INITED: "game_inited",

  /**
   * Event triggered after engine inited, at this point you will be able to use all engine classes.
   * It was defined as EVENT_RENDERER_INITED in cocos creator v1.x and renamed in v2.0
   * @property EVENT_ENGINE_INITED
   * @constant
   * @type {String}
   */
  EVENT_ENGINE_INITED: "engine_inited",
  // deprecated
  EVENT_RENDERER_INITED: "engine_inited",

  /**
   * Web Canvas 2d API as renderer backend
   * @property RENDER_TYPE_CANVAS
   * @constant
   * @type {Number}
   */
  RENDER_TYPE_CANVAS: 0,

  /**
   * WebGL API as renderer backend
   * @property RENDER_TYPE_WEBGL
   * @constant
   * @type {Number}
   */
  RENDER_TYPE_WEBGL: 1,

  /**
   * OpenGL API as renderer backend
   * @property RENDER_TYPE_OPENGL
   * @constant
   * @type {Number}
   */
  RENDER_TYPE_OPENGL: 2,
  _persistRootNodes: {},
  // states
  _paused: true,
  //whether the game is paused
  _configLoaded: false,
  //whether config loaded
  _isCloning: false,
  // deserializing or instantiating
  _prepared: false,
  //whether the engine has prepared
  _rendererInitialized: false,
  _renderContext: null,
  _intervalId: null,
  //interval target of main
  _lastTime: null,
  _frameTime: null,

  /**
   * !#en The outer frame of the game canvas, parent of game container.
   * !#zh 游戏画布的外框，container 的父容器。
   * @property frame
   * @type {Object}
   */
  frame: null,

  /**
   * !#en The container of game canvas.
   * !#zh 游戏画布的容器。
   * @property container
   * @type {HTMLDivElement}
   */
  container: null,

  /**
   * !#en The canvas of the game.
   * !#zh 游戏的画布。
   * @property canvas
   * @type {HTMLCanvasElement}
   */
  canvas: null,

  /**
   * !#en The renderer backend of the game.
   * !#zh 游戏的渲染器类型。
   * @property renderType
   * @type {Number}
   */
  renderType: -1,

  /**
   * !#en
   * The current game configuration, including:<br/>
   * 1. debugMode<br/>
   *      "debugMode" possible values :<br/>
   *      0 - No message will be printed.                                                      <br/>
   *      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.                      <br/>
   *      2 - cc.error, cc.assert, cc.warn will print in console.                              <br/>
   *      3 - cc.error, cc.assert will print in console.                                       <br/>
   *      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.<br/>
   *      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.        <br/>
   *      6 - cc.error, cc.assert will print on canvas, available only on web.                 <br/>
   * 2. showFPS<br/>
   *      Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.<br/>
   * 3. exposeClassName<br/>
   *      Expose class name to chrome debug tools, the class intantiate performance is a little bit slower when exposed.<br/>
   * 4. frameRate<br/>
   *      "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.<br/>
   * 5. id<br/>
   *      "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.<br/>
   * 6. renderMode<br/>
   *      "renderMode" sets the renderer type, only useful on web :<br/>
   *      0 - Automatically chosen by engine<br/>
   *      1 - Forced to use canvas renderer<br/>
   *      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers<br/>
   *<br/>
   * Please DO NOT modify this object directly, it won't have any effect.<br/>
   * !#zh
   * 当前的游戏配置，包括：                                                                  <br/>
   * 1. debugMode（debug 模式，但是在浏览器中这个选项会被忽略）                                <br/>
   *      "debugMode" 各种设置选项的意义。                                                   <br/>
   *          0 - 没有消息被打印出来。                                                       <br/>
   *          1 - cc.error，cc.assert，cc.warn，cc.log 将打印在 console 中。                  <br/>
   *          2 - cc.error，cc.assert，cc.warn 将打印在 console 中。                          <br/>
   *          3 - cc.error，cc.assert 将打印在 console 中。                                   <br/>
   *          4 - cc.error，cc.assert，cc.warn，cc.log 将打印在 canvas 中（仅适用于 web 端）。 <br/>
   *          5 - cc.error，cc.assert，cc.warn 将打印在 canvas 中（仅适用于 web 端）。         <br/>
   *          6 - cc.error，cc.assert 将打印在 canvas 中（仅适用于 web 端）。                  <br/>
   * 2. showFPS（显示 FPS）                                                            <br/>
   *      当 showFPS 为 true 的时候界面的左下角将显示 fps 的信息，否则被隐藏。              <br/>
   * 3. exposeClassName                                                           <br/>
   *      暴露类名让 Chrome DevTools 可以识别，如果开启会稍稍降低类的创建过程的性能，但对对象构造没有影响。 <br/>
   * 4. frameRate (帧率)                                                              <br/>
   *      “frameRate” 设置想要的帧率你的游戏，但真正的FPS取决于你的游戏实现和运行环境。      <br/>
   * 5. id                                                                            <br/>
   *      "gameCanvas" Web 页面上的 Canvas Element ID，仅适用于 web 端。                         <br/>
   * 6. renderMode（渲染模式）                                                         <br/>
   *      “renderMode” 设置渲染器类型，仅适用于 web 端：                              <br/>
   *          0 - 通过引擎自动选择。                                                     <br/>
   *          1 - 强制使用 canvas 渲染。
   *          2 - 强制使用 WebGL 渲染，但是在部分 Android 浏览器中这个选项会被忽略。     <br/>
   * <br/>
   * 注意：请不要直接修改这个对象，它不会有任何效果。
   * @property config
   * @type {Object}
   */
  config: null,

  /**
   * !#en Callback when the scripts of engine have been load.
   * !#zh 当引擎完成启动后的回调函数。
   * @method onStart
   * @type {Function}
   */
  onStart: null,
  //@Public Methods
  //  @Game play control

  /**
   * !#en Set frame rate of game.
   * !#zh 设置游戏帧率。
   * @method setFrameRate
   * @param {Number} frameRate
   */
  setFrameRate: function setFrameRate(frameRate) {
    var config = this.config;
    config.frameRate = frameRate;
    if (this._intervalId) window.cancelAnimFrame(this._intervalId);
    this._intervalId = 0;
    this._paused = true;

    this._setAnimFrame();

    this._runMainLoop();
  },

  /**
   * !#en Get frame rate set for the game, it doesn't represent the real frame rate.
   * !#zh 获取设置的游戏帧率（不等同于实际帧率）。
   * @method getFrameRate
   * @return {Number} frame rate
   */
  getFrameRate: function getFrameRate() {
    return this.config.frameRate;
  },

  /**
   * !#en Run the game frame by frame.
   * !#zh 执行一帧游戏循环。
   * @method step
   */
  step: function step() {
    cc.director.mainLoop();
  },

  /**
   * !#en Pause the game main loop. This will pause:
   * game logic execution, rendering process, event manager, background music and all audio effects.
   * This is different with cc.director.pause which only pause the game logic execution.
   * !#zh 暂停游戏主循环。包含：游戏逻辑，渲染，事件处理，背景音乐和所有音效。这点和只暂停游戏逻辑的 cc.director.pause 不同。
   * @method pause
   */
  pause: function pause() {
    if (this._paused) return;
    this._paused = true; // Pause audio engine

    if (cc.audioEngine) {
      cc.audioEngine._break();
    } // Pause main loop


    if (this._intervalId) window.cancelAnimFrame(this._intervalId);
    this._intervalId = 0;
  },

  /**
   * !#en Resume the game from pause. This will resume:
   * game logic execution, rendering process, event manager, background music and all audio effects.
   * !#zh 恢复游戏主循环。包含：游戏逻辑，渲染，事件处理，背景音乐和所有音效。
   * @method resume
   */
  resume: function resume() {
    if (!this._paused) return;
    this._paused = false; // Resume audio engine

    if (cc.audioEngine) {
      cc.audioEngine._restore();
    }

    cc.director._resetDeltaTime(); // Resume main loop


    this._runMainLoop();
  },

  /**
   * !#en Check whether the game is paused.
   * !#zh 判断游戏是否暂停。
   * @method isPaused
   * @return {Boolean}
   */
  isPaused: function isPaused() {
    return this._paused;
  },

  /**
   * !#en Restart game.
   * !#zh 重新开始游戏
   * @method restart
   */
  restart: function restart() {
    cc.director.once(cc.Director.EVENT_AFTER_DRAW, function () {
      for (var id in game._persistRootNodes) {
        game.removePersistRootNode(game._persistRootNodes[id]);
      } // Clear scene


      cc.director.getScene().destroy();

      cc.Object._deferredDestroy(); // Clean up audio


      if (cc.audioEngine) {
        cc.audioEngine.uncacheAll();
      }

      cc.director.reset();
      game.pause();
      cc.assetManager.builtins.init(function () {
        game.onStart();
        game.emit(game.EVENT_RESTART);
      });
    });
  },

  /**
   * !#en End game, it will close the game window
   * !#zh 退出游戏
   * @method end
   */
  end: function end() {
    close();
  },
  //  @Game loading
  _initEngine: function _initEngine() {
    if (this._rendererInitialized) {
      return;
    }

    this._initRenderer();

    if (!CC_EDITOR) {
      this._initEvents();
    }

    this.emit(this.EVENT_ENGINE_INITED);
  },
  _loadPreviewScript: function _loadPreviewScript(cb) {
    if (CC_PREVIEW && window.__quick_compile_project__) {
      window.__quick_compile_project__.load(cb);
    } else {
      cb();
    }
  },
  _prepareFinished: function _prepareFinished(cb) {
    var _this = this;

    // Init engine
    this._initEngine();

    this._setAnimFrame();

    cc.assetManager.builtins.init(function () {
      // Log engine version
      console.log('Cocos Creator v' + cc.ENGINE_VERSION);
      _this._prepared = true;

      _this._runMainLoop();

      _this.emit(_this.EVENT_GAME_INITED);

      if (cb) cb();
    });
  },
  eventTargetOn: EventTarget.prototype.on,
  eventTargetOnce: EventTarget.prototype.once,

  /**
   * !#en
   * Register an callback of a specific event type on the game object.
   * This type of event should be triggered via `emit`.
   * !#zh
   * 注册 game 的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
   *
   * @method on
   * @param {String} type - A string representing the event type to listen for.
   * @param {Function} callback - The callback that will be invoked when the event is dispatched.
   *                              The callback is ignored if it is a duplicate (the callbacks are unique).
   * @param {any} [callback.arg1] arg1
   * @param {any} [callback.arg2] arg2
   * @param {any} [callback.arg3] arg3
   * @param {any} [callback.arg4] arg4
   * @param {any} [callback.arg5] arg5
   * @param {Object} [target] - The target (this object) to invoke the callback, can be null
   * @return {Function} - Just returns the incoming callback so you can save the anonymous function easier.
   * @typescript
   * on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T
   */
  on: function on(type, callback, target, once) {
    // Make sure EVENT_ENGINE_INITED and EVENT_GAME_INITED callbacks to be invoked
    if (this._prepared && type === this.EVENT_ENGINE_INITED || !this._paused && type === this.EVENT_GAME_INITED) {
      callback.call(target);
    } else {
      this.eventTargetOn(type, callback, target, once);
    }
  },

  /**
   * !#en
   * Register an callback of a specific event type on the game object,
   * the callback will remove itself after the first time it is triggered.
   * !#zh
   * 注册 game 的特定事件类型回调，回调会在第一时间被触发后删除自身。
   *
   * @method once
   * @param {String} type - A string representing the event type to listen for.
   * @param {Function} callback - The callback that will be invoked when the event is dispatched.
   *                              The callback is ignored if it is a duplicate (the callbacks are unique).
   * @param {any} [callback.arg1] arg1
   * @param {any} [callback.arg2] arg2
   * @param {any} [callback.arg3] arg3
   * @param {any} [callback.arg4] arg4
   * @param {any} [callback.arg5] arg5
   * @param {Object} [target] - The target (this object) to invoke the callback, can be null
   */
  once: function once(type, callback, target) {
    // Make sure EVENT_ENGINE_INITED and EVENT_GAME_INITED callbacks to be invoked
    if (this._prepared && type === this.EVENT_ENGINE_INITED || !this._paused && type === this.EVENT_GAME_INITED) {
      callback.call(target);
    } else {
      this.eventTargetOnce(type, callback, target);
    }
  },

  /**
   * !#en Prepare game.
   * !#zh 准备引擎，请不要直接调用这个函数。
   * @param {Function} cb
   * @method prepare
   */
  prepare: function prepare(cb) {
    var _this2 = this;

    // Already prepared
    if (this._prepared) {
      if (cb) cb();
      return;
    }

    this._loadPreviewScript(function () {
      _this2._prepareFinished(cb);
    });
  },

  /**
   * !#en Run game with configuration object and onStart function.
   * !#zh 运行游戏，并且指定引擎配置和 onStart 的回调。
   * @method run
   * @param {Object} config - Pass configuration object or onStart function
   * @param {Function} onStart - function to be executed after game initialized
   */
  run: function run(config, onStart) {
    this._initConfig(config);

    this.onStart = onStart;
    this.prepare(game.onStart && game.onStart.bind(game));
  },
  //  @ Persist root node section

  /**
   * !#en
   * Add a persistent root node to the game, the persistent node won't be destroyed during scene transition.<br/>
   * The target node must be placed in the root level of hierarchy, otherwise this API won't have any effect.
   * !#zh
   * 声明常驻根节点，该节点不会被在场景切换中被销毁。<br/>
   * 目标节点必须位于为层级的根节点，否则无效。
   * @method addPersistRootNode
   * @param {Node} node - The node to be made persistent
   */
  addPersistRootNode: function addPersistRootNode(node) {
    if (!cc.Node.isNode(node) || !node.uuid) {
      cc.warnID(3800);
      return;
    }

    var id = node.uuid;

    if (!this._persistRootNodes[id]) {
      var scene = cc.director._scene;

      if (cc.isValid(scene)) {
        if (!node.parent) {
          node.parent = scene;
        } else if (!(node.parent instanceof cc.Scene)) {
          cc.warnID(3801);
          return;
        } else if (node.parent !== scene) {
          cc.warnID(3802);
          return;
        }
      }

      this._persistRootNodes[id] = node;
      node._persistNode = true;

      cc.assetManager._releaseManager._addPersistNodeRef(node);
    }
  },

  /**
   * !#en Remove a persistent root node.
   * !#zh 取消常驻根节点。
   * @method removePersistRootNode
   * @param {Node} node - The node to be removed from persistent node list
   */
  removePersistRootNode: function removePersistRootNode(node) {
    var id = node.uuid || '';

    if (node === this._persistRootNodes[id]) {
      delete this._persistRootNodes[id];
      node._persistNode = false;

      cc.assetManager._releaseManager._removePersistNodeRef(node);
    }
  },

  /**
   * !#en Check whether the node is a persistent root node.
   * !#zh 检查节点是否是常驻根节点。
   * @method isPersistRootNode
   * @param {Node} node - The node to be checked
   * @return {Boolean}
   */
  isPersistRootNode: function isPersistRootNode(node) {
    return node._persistNode;
  },
  //@Private Methods
  //  @Time ticker section
  _setAnimFrame: function _setAnimFrame() {
    this._lastTime = performance.now();
    var frameRate = game.config.frameRate;
    this._frameTime = 1000 / frameRate;
    cc.director._maxParticleDeltaTime = this._frameTime / 1000 * 2;

    if (CC_JSB || CC_RUNTIME) {
      jsb.setPreferredFramesPerSecond(frameRate);
      window.requestAnimFrame = window.requestAnimationFrame;
      window.cancelAnimFrame = window.cancelAnimationFrame;
    } else {
      var rAF = window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;

      if (frameRate !== 60 && frameRate !== 30) {
        window.requestAnimFrame = rAF ? this._stTimeWithRAF : this._stTime;
        window.cancelAnimFrame = this._ctTime;
      } else {
        window.requestAnimFrame = rAF || this._stTime;
        window.cancelAnimFrame = window.cancelAnimationFrame || window.cancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.msCancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.oCancelAnimationFrame || this._ctTime;
      }
    }
  },
  _stTimeWithRAF: function _stTimeWithRAF(callback) {
    var currTime = performance.now();
    var timeToCall = Math.max(0, game._frameTime - (currTime - game._lastTime));
    var id = window.setTimeout(function () {
      window.requestAnimationFrame(callback);
    }, timeToCall);
    game._lastTime = currTime + timeToCall;
    return id;
  },
  _stTime: function _stTime(callback) {
    var currTime = performance.now();
    var timeToCall = Math.max(0, game._frameTime - (currTime - game._lastTime));
    var id = window.setTimeout(function () {
      callback();
    }, timeToCall);
    game._lastTime = currTime + timeToCall;
    return id;
  },
  _ctTime: function _ctTime(id) {
    window.clearTimeout(id);
  },
  //Run game.
  _runMainLoop: function _runMainLoop() {
    if (CC_EDITOR) {
      return;
    }

    if (!this._prepared) return;

    var self = this,
        _callback,
        config = self.config,
        director = cc.director,
        skip = true,
        frameRate = config.frameRate;

    debug.setDisplayStats(config.showFPS);

    _callback = function callback(now) {
      if (!self._paused) {
        self._intervalId = window.requestAnimFrame(_callback);

        if (!CC_JSB && !CC_RUNTIME && frameRate === 30) {
          if (skip = !skip) {
            return;
          }
        }

        director.mainLoop(now);
      }
    };

    self._intervalId = window.requestAnimFrame(_callback);
    self._paused = false;
  },
  //  @Game loading section
  _initConfig: function _initConfig(config) {
    // Configs adjustment
    if (typeof config.debugMode !== 'number') {
      config.debugMode = 0;
    }

    config.exposeClassName = !!config.exposeClassName;

    if (typeof config.frameRate !== 'number') {
      config.frameRate = 60;
    }

    var renderMode = config.renderMode;

    if (typeof renderMode !== 'number' || renderMode > 2 || renderMode < 0) {
      config.renderMode = 0;
    }

    if (typeof config.registerSystemEvent !== 'boolean') {
      config.registerSystemEvent = true;
    }

    if (renderMode === 1) {
      config.showFPS = false;
    } else {
      config.showFPS = !!config.showFPS;
    } // Collide Map and Group List


    this.collisionMatrix = config.collisionMatrix || [];
    this.groupList = config.groupList || [];

    debug._resetDebugSetting(config.debugMode);

    this.config = config;
    this._configLoaded = true;
  },
  _determineRenderType: function _determineRenderType() {
    var config = this.config,
        userRenderMode = parseInt(config.renderMode) || 0; // Determine RenderType

    this.renderType = this.RENDER_TYPE_CANVAS;
    var supportRender = false;

    if (userRenderMode === 0) {
      if (cc.sys.capabilities['opengl']) {
        this.renderType = this.RENDER_TYPE_WEBGL;
        supportRender = true;
      } else if (cc.sys.capabilities['canvas']) {
        this.renderType = this.RENDER_TYPE_CANVAS;
        supportRender = true;
      }
    } else if (userRenderMode === 1 && cc.sys.capabilities['canvas']) {
      this.renderType = this.RENDER_TYPE_CANVAS;
      supportRender = true;
    } else if (userRenderMode === 2 && cc.sys.capabilities['opengl']) {
      this.renderType = this.RENDER_TYPE_WEBGL;
      supportRender = true;
    }

    if (!supportRender) {
      throw new Error(debug.getError(3820, userRenderMode));
    }
  },
  _initRenderer: function _initRenderer() {
    // Avoid setup to be called twice.
    if (this._rendererInitialized) return;
    var el = this.config.id,
        width,
        height,
        localCanvas,
        localContainer;

    if (CC_JSB || CC_RUNTIME) {
      this.container = localContainer = document.createElement("DIV");
      this.frame = localContainer.parentNode === document.body ? document.documentElement : localContainer.parentNode;
      localCanvas = window.__canvas;
      this.canvas = localCanvas;
    } else {
      var addClass = function addClass(element, name) {
        var hasClass = (' ' + element.className + ' ').indexOf(' ' + name + ' ') > -1;

        if (!hasClass) {
          if (element.className) {
            element.className += " ";
          }

          element.className += name;
        }
      };

      var element = el instanceof HTMLElement ? el : document.querySelector(el) || document.querySelector('#' + el);

      if (element.tagName === "CANVAS") {
        width = element.width;
        height = element.height; //it is already a canvas, we wrap it around with a div

        this.canvas = localCanvas = element;
        this.container = localContainer = document.createElement("DIV");
        if (localCanvas.parentNode) localCanvas.parentNode.insertBefore(localContainer, localCanvas);
      } else {
        //we must make a new canvas and place into this element
        if (element.tagName !== "DIV") {
          cc.warnID(3819);
        }

        width = element.clientWidth;
        height = element.clientHeight;
        this.canvas = localCanvas = document.createElement("CANVAS");
        this.container = localContainer = document.createElement("DIV");
        element.appendChild(localContainer);
      }

      localContainer.setAttribute('id', 'Cocos2dGameContainer');
      localContainer.appendChild(localCanvas);
      this.frame = localContainer.parentNode === document.body ? document.documentElement : localContainer.parentNode;
      addClass(localCanvas, "gameCanvas");
      localCanvas.setAttribute("width", width || 480);
      localCanvas.setAttribute("height", height || 320);
      localCanvas.setAttribute("tabindex", 99);
    }

    this._determineRenderType(); // WebGL context created successfully


    if (this.renderType === this.RENDER_TYPE_WEBGL) {
      var opts = {
        'stencil': true,
        // MSAA is causing serious performance dropdown on some browsers.
        'antialias': cc.macro.ENABLE_WEBGL_ANTIALIAS,
        'alpha': cc.macro.ENABLE_TRANSPARENT_CANVAS
      };
      renderer.initWebGL(localCanvas, opts);
      this._renderContext = renderer.device._gl; // Enable dynamic atlas manager by default

      if (!cc.macro.CLEANUP_IMAGE_CACHE && dynamicAtlasManager) {
        dynamicAtlasManager.enabled = true;
      }
    }

    if (!this._renderContext) {
      this.renderType = this.RENDER_TYPE_CANVAS; // Could be ignored by module settings

      renderer.initCanvas(localCanvas);
      this._renderContext = renderer.device._ctx;
    }

    this.canvas.oncontextmenu = function () {
      if (!cc._isContextMenuEnable) return false;
    };

    this._rendererInitialized = true;
  },
  _initEvents: function _initEvents() {
    var win = window,
        hiddenPropName; // register system events

    if (this.config.registerSystemEvent) cc.internal.inputManager.registerSystemEvent(this.canvas);

    if (typeof document.hidden !== 'undefined') {
      hiddenPropName = "hidden";
    } else if (typeof document.mozHidden !== 'undefined') {
      hiddenPropName = "mozHidden";
    } else if (typeof document.msHidden !== 'undefined') {
      hiddenPropName = "msHidden";
    } else if (typeof document.webkitHidden !== 'undefined') {
      hiddenPropName = "webkitHidden";
    }

    var hidden = false;

    function onHidden() {
      if (!hidden) {
        hidden = true;
        game.emit(game.EVENT_HIDE);
      }
    } // In order to adapt the most of platforms the onshow API.


    function onShown(arg0, arg1, arg2, arg3, arg4) {
      if (hidden) {
        hidden = false;
        game.emit(game.EVENT_SHOW, arg0, arg1, arg2, arg3, arg4);
      }
    }

    if (hiddenPropName) {
      var changeList = ["visibilitychange", "mozvisibilitychange", "msvisibilitychange", "webkitvisibilitychange", "qbrowserVisibilityChange"];

      for (var i = 0; i < changeList.length; i++) {
        document.addEventListener(changeList[i], function (event) {
          var visible = document[hiddenPropName]; // QQ App

          visible = visible || event["hidden"];
          if (visible) onHidden();else onShown();
        });
      }
    } else {
      win.addEventListener("blur", onHidden);
      win.addEventListener("focus", onShown);
    }

    if (navigator.userAgent.indexOf("MicroMessenger") > -1) {
      win.onfocus = onShown;
    }

    if ("onpageshow" in window && "onpagehide" in window) {
      win.addEventListener("pagehide", onHidden);
      win.addEventListener("pageshow", onShown); // Taobao UIWebKit

      document.addEventListener("pagehide", onHidden);
      document.addEventListener("pageshow", onShown);
    }

    this.on(game.EVENT_HIDE, function () {
      game.pause();
    });
    this.on(game.EVENT_SHOW, function () {
      game.resume();
    });
  }
};
EventTarget.call(game);
cc.js.addon(game, EventTarget.prototype);
/**
 * @module cc
 */

/**
 * !#en This is a Game instance.
 * !#zh 这是一个 Game 类的实例，包含游戏主体信息并负责驱动游戏的游戏对象。。
 * @property game
 * @type Game
 */

cc.game = module.exports = game;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL0NDR2FtZS5qcyJdLCJuYW1lcyI6WyJFdmVudFRhcmdldCIsInJlcXVpcmUiLCJkZWJ1ZyIsInJlbmRlcmVyIiwiZHluYW1pY0F0bGFzTWFuYWdlciIsImdhbWUiLCJFVkVOVF9ISURFIiwiRVZFTlRfU0hPVyIsIkVWRU5UX1JFU1RBUlQiLCJFVkVOVF9HQU1FX0lOSVRFRCIsIkVWRU5UX0VOR0lORV9JTklURUQiLCJFVkVOVF9SRU5ERVJFUl9JTklURUQiLCJSRU5ERVJfVFlQRV9DQU5WQVMiLCJSRU5ERVJfVFlQRV9XRUJHTCIsIlJFTkRFUl9UWVBFX09QRU5HTCIsIl9wZXJzaXN0Um9vdE5vZGVzIiwiX3BhdXNlZCIsIl9jb25maWdMb2FkZWQiLCJfaXNDbG9uaW5nIiwiX3ByZXBhcmVkIiwiX3JlbmRlcmVySW5pdGlhbGl6ZWQiLCJfcmVuZGVyQ29udGV4dCIsIl9pbnRlcnZhbElkIiwiX2xhc3RUaW1lIiwiX2ZyYW1lVGltZSIsImZyYW1lIiwiY29udGFpbmVyIiwiY2FudmFzIiwicmVuZGVyVHlwZSIsImNvbmZpZyIsIm9uU3RhcnQiLCJzZXRGcmFtZVJhdGUiLCJmcmFtZVJhdGUiLCJ3aW5kb3ciLCJjYW5jZWxBbmltRnJhbWUiLCJfc2V0QW5pbUZyYW1lIiwiX3J1bk1haW5Mb29wIiwiZ2V0RnJhbWVSYXRlIiwic3RlcCIsImNjIiwiZGlyZWN0b3IiLCJtYWluTG9vcCIsInBhdXNlIiwiYXVkaW9FbmdpbmUiLCJfYnJlYWsiLCJyZXN1bWUiLCJfcmVzdG9yZSIsIl9yZXNldERlbHRhVGltZSIsImlzUGF1c2VkIiwicmVzdGFydCIsIm9uY2UiLCJEaXJlY3RvciIsIkVWRU5UX0FGVEVSX0RSQVciLCJpZCIsInJlbW92ZVBlcnNpc3RSb290Tm9kZSIsImdldFNjZW5lIiwiZGVzdHJveSIsIk9iamVjdCIsIl9kZWZlcnJlZERlc3Ryb3kiLCJ1bmNhY2hlQWxsIiwicmVzZXQiLCJhc3NldE1hbmFnZXIiLCJidWlsdGlucyIsImluaXQiLCJlbWl0IiwiZW5kIiwiY2xvc2UiLCJfaW5pdEVuZ2luZSIsIl9pbml0UmVuZGVyZXIiLCJDQ19FRElUT1IiLCJfaW5pdEV2ZW50cyIsIl9sb2FkUHJldmlld1NjcmlwdCIsImNiIiwiQ0NfUFJFVklFVyIsIl9fcXVpY2tfY29tcGlsZV9wcm9qZWN0X18iLCJsb2FkIiwiX3ByZXBhcmVGaW5pc2hlZCIsImNvbnNvbGUiLCJsb2ciLCJFTkdJTkVfVkVSU0lPTiIsImV2ZW50VGFyZ2V0T24iLCJwcm90b3R5cGUiLCJvbiIsImV2ZW50VGFyZ2V0T25jZSIsInR5cGUiLCJjYWxsYmFjayIsInRhcmdldCIsImNhbGwiLCJwcmVwYXJlIiwicnVuIiwiX2luaXRDb25maWciLCJiaW5kIiwiYWRkUGVyc2lzdFJvb3ROb2RlIiwibm9kZSIsIk5vZGUiLCJpc05vZGUiLCJ1dWlkIiwid2FybklEIiwic2NlbmUiLCJfc2NlbmUiLCJpc1ZhbGlkIiwicGFyZW50IiwiU2NlbmUiLCJfcGVyc2lzdE5vZGUiLCJfcmVsZWFzZU1hbmFnZXIiLCJfYWRkUGVyc2lzdE5vZGVSZWYiLCJfcmVtb3ZlUGVyc2lzdE5vZGVSZWYiLCJpc1BlcnNpc3RSb290Tm9kZSIsInBlcmZvcm1hbmNlIiwibm93IiwiX21heFBhcnRpY2xlRGVsdGFUaW1lIiwiQ0NfSlNCIiwiQ0NfUlVOVElNRSIsImpzYiIsInNldFByZWZlcnJlZEZyYW1lc1BlclNlY29uZCIsInJlcXVlc3RBbmltRnJhbWUiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsInJBRiIsIndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1velJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJtc1JlcXVlc3RBbmltYXRpb25GcmFtZSIsIl9zdFRpbWVXaXRoUkFGIiwiX3N0VGltZSIsIl9jdFRpbWUiLCJjYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJtc0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1vekNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm9DYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJ3ZWJraXRDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJtc0NhbmNlbEFuaW1hdGlvbkZyYW1lIiwibW96Q2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJ3ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZSIsIm9DYW5jZWxBbmltYXRpb25GcmFtZSIsImN1cnJUaW1lIiwidGltZVRvQ2FsbCIsIk1hdGgiLCJtYXgiLCJzZXRUaW1lb3V0IiwiY2xlYXJUaW1lb3V0Iiwic2VsZiIsInNraXAiLCJzZXREaXNwbGF5U3RhdHMiLCJzaG93RlBTIiwiZGVidWdNb2RlIiwiZXhwb3NlQ2xhc3NOYW1lIiwicmVuZGVyTW9kZSIsInJlZ2lzdGVyU3lzdGVtRXZlbnQiLCJjb2xsaXNpb25NYXRyaXgiLCJncm91cExpc3QiLCJfcmVzZXREZWJ1Z1NldHRpbmciLCJfZGV0ZXJtaW5lUmVuZGVyVHlwZSIsInVzZXJSZW5kZXJNb2RlIiwicGFyc2VJbnQiLCJzdXBwb3J0UmVuZGVyIiwic3lzIiwiY2FwYWJpbGl0aWVzIiwiRXJyb3IiLCJnZXRFcnJvciIsImVsIiwid2lkdGgiLCJoZWlnaHQiLCJsb2NhbENhbnZhcyIsImxvY2FsQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwicGFyZW50Tm9kZSIsImJvZHkiLCJkb2N1bWVudEVsZW1lbnQiLCJfX2NhbnZhcyIsImFkZENsYXNzIiwiZWxlbWVudCIsIm5hbWUiLCJoYXNDbGFzcyIsImNsYXNzTmFtZSIsImluZGV4T2YiLCJIVE1MRWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJ0YWdOYW1lIiwiaW5zZXJ0QmVmb3JlIiwiY2xpZW50V2lkdGgiLCJjbGllbnRIZWlnaHQiLCJhcHBlbmRDaGlsZCIsInNldEF0dHJpYnV0ZSIsIm9wdHMiLCJtYWNybyIsIkVOQUJMRV9XRUJHTF9BTlRJQUxJQVMiLCJFTkFCTEVfVFJBTlNQQVJFTlRfQ0FOVkFTIiwiaW5pdFdlYkdMIiwiZGV2aWNlIiwiX2dsIiwiQ0xFQU5VUF9JTUFHRV9DQUNIRSIsImVuYWJsZWQiLCJpbml0Q2FudmFzIiwiX2N0eCIsIm9uY29udGV4dG1lbnUiLCJfaXNDb250ZXh0TWVudUVuYWJsZSIsIndpbiIsImhpZGRlblByb3BOYW1lIiwiaW50ZXJuYWwiLCJpbnB1dE1hbmFnZXIiLCJoaWRkZW4iLCJtb3pIaWRkZW4iLCJtc0hpZGRlbiIsIndlYmtpdEhpZGRlbiIsIm9uSGlkZGVuIiwib25TaG93biIsImFyZzAiLCJhcmcxIiwiYXJnMiIsImFyZzMiLCJhcmc0IiwiY2hhbmdlTGlzdCIsImkiLCJsZW5ndGgiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJ2aXNpYmxlIiwibmF2aWdhdG9yIiwidXNlckFnZW50Iiwib25mb2N1cyIsImpzIiwiYWRkb24iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFJQSxXQUFXLEdBQUdDLE9BQU8sQ0FBQyxzQkFBRCxDQUF6Qjs7QUFDQUEsT0FBTyxDQUFDLHdCQUFELENBQVA7O0FBQ0EsSUFBTUMsS0FBSyxHQUFHRCxPQUFPLENBQUMsV0FBRCxDQUFyQjs7QUFDQSxJQUFNRSxRQUFRLEdBQUdGLE9BQU8sQ0FBQyxxQkFBRCxDQUF4Qjs7QUFDQSxJQUFNRyxtQkFBbUIsR0FBR0gsT0FBTyxDQUFDLDhDQUFELENBQW5DO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBSUksSUFBSSxHQUFHO0FBQ1A7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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c0NULE9BQXRDO0FBQ0g7O0FBRUQsU0FBSzdILEVBQUwsQ0FBUTdFLElBQUksQ0FBQ0MsVUFBYixFQUF5QixZQUFZO0FBQ2pDRCxNQUFBQSxJQUFJLENBQUNxQyxLQUFMO0FBQ0gsS0FGRDtBQUdBLFNBQUt3QyxFQUFMLENBQVE3RSxJQUFJLENBQUNFLFVBQWIsRUFBeUIsWUFBWTtBQUNqQ0YsTUFBQUEsSUFBSSxDQUFDd0MsTUFBTDtBQUNILEtBRkQ7QUFHSDtBQXQwQk0sQ0FBWDtBQXkwQkE3QyxXQUFXLENBQUN1RixJQUFaLENBQWlCbEYsSUFBakI7QUFDQWtDLEVBQUUsQ0FBQ3VMLEVBQUgsQ0FBTUMsS0FBTixDQUFZMU4sSUFBWixFQUFrQkwsV0FBVyxDQUFDaUYsU0FBOUI7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBMUMsRUFBRSxDQUFDbEMsSUFBSCxHQUFVMk4sTUFBTSxDQUFDQyxPQUFQLEdBQWlCNU4sSUFBM0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBFdmVudFRhcmdldCA9IHJlcXVpcmUoJy4vZXZlbnQvZXZlbnQtdGFyZ2V0Jyk7XG5yZXF1aXJlKCcuLi9hdWRpby9DQ0F1ZGlvRW5naW5lJyk7XG5jb25zdCBkZWJ1ZyA9IHJlcXVpcmUoJy4vQ0NEZWJ1ZycpO1xuY29uc3QgcmVuZGVyZXIgPSByZXF1aXJlKCcuL3JlbmRlcmVyL2luZGV4LmpzJyk7XG5jb25zdCBkeW5hbWljQXRsYXNNYW5hZ2VyID0gcmVxdWlyZSgnLi4vY29yZS9yZW5kZXJlci91dGlscy9keW5hbWljLWF0bGFzL21hbmFnZXInKTtcblxuLyoqXG4gKiBAbW9kdWxlIGNjXG4gKi9cblxuLyoqXG4gKiAhI2VuIEFuIG9iamVjdCB0byBib290IHRoZSBnYW1lLlxuICogISN6aCDljIXlkKvmuLjmiI/kuLvkvZPkv6Hmga/lubbotJ/otKPpqbHliqjmuLjmiI/nmoTmuLjmiI/lr7nosaHjgIJcbiAqIEBjbGFzcyBHYW1lXG4gKiBAZXh0ZW5kcyBFdmVudFRhcmdldFxuICovXG52YXIgZ2FtZSA9IHtcbiAgICAvKipcbiAgICAgKiAhI2VuIEV2ZW50IHRyaWdnZXJlZCB3aGVuIGdhbWUgaGlkZSB0byBiYWNrZ3JvdW5kLlxuICAgICAqIFBsZWFzZSBub3RlIHRoYXQgdGhpcyBldmVudCBpcyBub3QgMTAwJSBndWFyYW50ZWVkIHRvIGJlIGZpcmVkIG9uIFdlYiBwbGF0Zm9ybSxcbiAgICAgKiBvbiBuYXRpdmUgcGxhdGZvcm1zLCBpdCBjb3JyZXNwb25kcyB0byBlbnRlciBiYWNrZ3JvdW5kIGV2ZW50LCBvcyBzdGF0dXMgYmFyIG9yIG5vdGlmaWNhdGlvbiBjZW50ZXIgbWF5IG5vdCB0cmlnZ2VyIHRoaXMgZXZlbnQuXG4gICAgICogISN6aCDmuLjmiI/ov5vlhaXlkI7lj7Dml7bop6blj5HnmoTkuovku7bjgIJcbiAgICAgKiDor7fms6jmhI/vvIzlnKggV0VCIOW5s+WPsO+8jOi/meS4quS6i+S7tuS4jeS4gOWumuS8miAxMDAlIOinpuWPke+8jOi/meWujOWFqOWPluWGs+S6jua1j+iniOWZqOeahOWbnuiwg+ihjOS4uuOAglxuICAgICAqIOWcqOWOn+eUn+W5s+WPsO+8jOWug+WvueW6lOeahOaYr+W6lOeUqOiiq+WIh+aNouWIsOWQjuWPsOS6i+S7tu+8jOS4i+aLieiPnOWNleWSjOS4iuaLieeKtuaAgeagj+etieS4jeS4gOWumuS8muinpuWPkei/meS4quS6i+S7tu+8jOi/meWPluWGs+S6juezu+e7n+ihjOS4uuOAglxuICAgICAqIEBwcm9wZXJ0eSBFVkVOVF9ISURFXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNjLmdhbWUub24oY2MuZ2FtZS5FVkVOVF9ISURFLCBmdW5jdGlvbiAoKSB7XG4gICAgICogICAgIGNjLmF1ZGlvRW5naW5lLnBhdXNlTXVzaWMoKTtcbiAgICAgKiAgICAgY2MuYXVkaW9FbmdpbmUucGF1c2VBbGxFZmZlY3RzKCk7XG4gICAgICogfSk7XG4gICAgICovXG4gICAgRVZFTlRfSElERTogXCJnYW1lX29uX2hpZGVcIixcblxuICAgIC8qKlxuICAgICAqICEjZW4gRXZlbnQgdHJpZ2dlcmVkIHdoZW4gZ2FtZSBiYWNrIHRvIGZvcmVncm91bmRcbiAgICAgKiBQbGVhc2Ugbm90ZSB0aGF0IHRoaXMgZXZlbnQgaXMgbm90IDEwMCUgZ3VhcmFudGVlZCB0byBiZSBmaXJlZCBvbiBXZWIgcGxhdGZvcm0sXG4gICAgICogb24gbmF0aXZlIHBsYXRmb3JtcywgaXQgY29ycmVzcG9uZHMgdG8gZW50ZXIgZm9yZWdyb3VuZCBldmVudC5cbiAgICAgKiAhI3poIOa4uOaIj+i/m+WFpeWJjeWPsOi/kOihjOaXtuinpuWPkeeahOS6i+S7tuOAglxuICAgICAqIOivt+azqOaEj++8jOWcqCBXRUIg5bmz5Y+w77yM6L+Z5Liq5LqL5Lu25LiN5LiA5a6a5LyaIDEwMCUg6Kem5Y+R77yM6L+Z5a6M5YWo5Y+W5Yaz5LqO5rWP6KeI5Zmo55qE5Zue6LCD6KGM5Li644CCXG4gICAgICog5Zyo5Y6f55Sf5bmz5Y+w77yM5a6D5a+55bqU55qE5piv5bqU55So6KKr5YiH5o2i5Yiw5YmN5Y+w5LqL5Lu244CCXG4gICAgICogQHByb3BlcnR5IEVWRU5UX1NIT1dcbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIEVWRU5UX1NIT1c6IFwiZ2FtZV9vbl9zaG93XCIsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEV2ZW50IHRyaWdnZXJlZCB3aGVuIGdhbWUgcmVzdGFydFxuICAgICAqICEjemgg6LCD55SocmVzdGFydOWQju+8jOinpuWPkeS6i+S7tuOAglxuICAgICAqIEBwcm9wZXJ0eSBFVkVOVF9SRVNUQVJUXG4gICAgICogQGNvbnN0YW50XG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICBFVkVOVF9SRVNUQVJUOiBcImdhbWVfb25fcmVzdGFydFwiLFxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgdHJpZ2dlcmVkIGFmdGVyIGdhbWUgaW5pdGVkLCBhdCB0aGlzIHBvaW50IGFsbCBlbmdpbmUgb2JqZWN0cyBhbmQgZ2FtZSBzY3JpcHRzIGFyZSBsb2FkZWRcbiAgICAgKiBAcHJvcGVydHkgRVZFTlRfR0FNRV9JTklURURcbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIEVWRU5UX0dBTUVfSU5JVEVEOiBcImdhbWVfaW5pdGVkXCIsXG5cbiAgICAvKipcbiAgICAgKiBFdmVudCB0cmlnZ2VyZWQgYWZ0ZXIgZW5naW5lIGluaXRlZCwgYXQgdGhpcyBwb2ludCB5b3Ugd2lsbCBiZSBhYmxlIHRvIHVzZSBhbGwgZW5naW5lIGNsYXNzZXMuXG4gICAgICogSXQgd2FzIGRlZmluZWQgYXMgRVZFTlRfUkVOREVSRVJfSU5JVEVEIGluIGNvY29zIGNyZWF0b3IgdjEueCBhbmQgcmVuYW1lZCBpbiB2Mi4wXG4gICAgICogQHByb3BlcnR5IEVWRU5UX0VOR0lORV9JTklURURcbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIEVWRU5UX0VOR0lORV9JTklURUQ6IFwiZW5naW5lX2luaXRlZFwiLFxuICAgIC8vIGRlcHJlY2F0ZWRcbiAgICBFVkVOVF9SRU5ERVJFUl9JTklURUQ6IFwiZW5naW5lX2luaXRlZFwiLFxuXG4gICAgLyoqXG4gICAgICogV2ViIENhbnZhcyAyZCBBUEkgYXMgcmVuZGVyZXIgYmFja2VuZFxuICAgICAqIEBwcm9wZXJ0eSBSRU5ERVJfVFlQRV9DQU5WQVNcbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFJFTkRFUl9UWVBFX0NBTlZBUzogMCxcbiAgICAvKipcbiAgICAgKiBXZWJHTCBBUEkgYXMgcmVuZGVyZXIgYmFja2VuZFxuICAgICAqIEBwcm9wZXJ0eSBSRU5ERVJfVFlQRV9XRUJHTFxuICAgICAqIEBjb25zdGFudFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgUkVOREVSX1RZUEVfV0VCR0w6IDEsXG4gICAgLyoqXG4gICAgICogT3BlbkdMIEFQSSBhcyByZW5kZXJlciBiYWNrZW5kXG4gICAgICogQHByb3BlcnR5IFJFTkRFUl9UWVBFX09QRU5HTFxuICAgICAqIEBjb25zdGFudFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgUkVOREVSX1RZUEVfT1BFTkdMOiAyLFxuXG4gICAgX3BlcnNpc3RSb290Tm9kZXM6IHt9LFxuXG4gICAgLy8gc3RhdGVzXG4gICAgX3BhdXNlZDogdHJ1ZSwvL3doZXRoZXIgdGhlIGdhbWUgaXMgcGF1c2VkXG4gICAgX2NvbmZpZ0xvYWRlZDogZmFsc2UsLy93aGV0aGVyIGNvbmZpZyBsb2FkZWRcbiAgICBfaXNDbG9uaW5nOiBmYWxzZSwgICAgLy8gZGVzZXJpYWxpemluZyBvciBpbnN0YW50aWF0aW5nXG4gICAgX3ByZXBhcmVkOiBmYWxzZSwgLy93aGV0aGVyIHRoZSBlbmdpbmUgaGFzIHByZXBhcmVkXG4gICAgX3JlbmRlcmVySW5pdGlhbGl6ZWQ6IGZhbHNlLFxuXG4gICAgX3JlbmRlckNvbnRleHQ6IG51bGwsXG5cbiAgICBfaW50ZXJ2YWxJZDogbnVsbCwvL2ludGVydmFsIHRhcmdldCBvZiBtYWluXG5cbiAgICBfbGFzdFRpbWU6IG51bGwsXG4gICAgX2ZyYW1lVGltZTogbnVsbCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG91dGVyIGZyYW1lIG9mIHRoZSBnYW1lIGNhbnZhcywgcGFyZW50IG9mIGdhbWUgY29udGFpbmVyLlxuICAgICAqICEjemgg5ri45oiP55S75biD55qE5aSW5qGG77yMY29udGFpbmVyIOeahOeItuWuueWZqOOAglxuICAgICAqIEBwcm9wZXJ0eSBmcmFtZVxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgZnJhbWU6IG51bGwsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgY29udGFpbmVyIG9mIGdhbWUgY2FudmFzLlxuICAgICAqICEjemgg5ri45oiP55S75biD55qE5a655Zmo44CCXG4gICAgICogQHByb3BlcnR5IGNvbnRhaW5lclxuICAgICAqIEB0eXBlIHtIVE1MRGl2RWxlbWVudH1cbiAgICAgKi9cbiAgICBjb250YWluZXI6IG51bGwsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgY2FudmFzIG9mIHRoZSBnYW1lLlxuICAgICAqICEjemgg5ri45oiP55qE55S75biD44CCXG4gICAgICogQHByb3BlcnR5IGNhbnZhc1xuICAgICAqIEB0eXBlIHtIVE1MQ2FudmFzRWxlbWVudH1cbiAgICAgKi9cbiAgICBjYW52YXM6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSByZW5kZXJlciBiYWNrZW5kIG9mIHRoZSBnYW1lLlxuICAgICAqICEjemgg5ri45oiP55qE5riy5p+T5Zmo57G75Z6L44CCXG4gICAgICogQHByb3BlcnR5IHJlbmRlclR5cGVcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHJlbmRlclR5cGU6IC0xLFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFRoZSBjdXJyZW50IGdhbWUgY29uZmlndXJhdGlvbiwgaW5jbHVkaW5nOjxici8+XG4gICAgICogMS4gZGVidWdNb2RlPGJyLz5cbiAgICAgKiAgICAgIFwiZGVidWdNb2RlXCIgcG9zc2libGUgdmFsdWVzIDo8YnIvPlxuICAgICAqICAgICAgMCAtIE5vIG1lc3NhZ2Ugd2lsbCBiZSBwcmludGVkLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogICAgICAxIC0gY2MuZXJyb3IsIGNjLmFzc2VydCwgY2Mud2FybiwgY2MubG9nIHdpbGwgcHJpbnQgaW4gY29uc29sZS4gICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgIDIgLSBjYy5lcnJvciwgY2MuYXNzZXJ0LCBjYy53YXJuIHdpbGwgcHJpbnQgaW4gY29uc29sZS4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqICAgICAgMyAtIGNjLmVycm9yLCBjYy5hc3NlcnQgd2lsbCBwcmludCBpbiBjb25zb2xlLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogICAgICA0IC0gY2MuZXJyb3IsIGNjLmFzc2VydCwgY2Mud2FybiwgY2MubG9nIHdpbGwgcHJpbnQgb24gY2FudmFzLCBhdmFpbGFibGUgb25seSBvbiB3ZWIuPGJyLz5cbiAgICAgKiAgICAgIDUgLSBjYy5lcnJvciwgY2MuYXNzZXJ0LCBjYy53YXJuIHdpbGwgcHJpbnQgb24gY2FudmFzLCBhdmFpbGFibGUgb25seSBvbiB3ZWIuICAgICAgICA8YnIvPlxuICAgICAqICAgICAgNiAtIGNjLmVycm9yLCBjYy5hc3NlcnQgd2lsbCBwcmludCBvbiBjYW52YXMsIGF2YWlsYWJsZSBvbmx5IG9uIHdlYi4gICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogMi4gc2hvd0ZQUzxici8+XG4gICAgICogICAgICBMZWZ0IGJvdHRvbSBjb3JuZXIgZnBzIGluZm9ybWF0aW9uIHdpbGwgc2hvdyB3aGVuIFwic2hvd0ZQU1wiIGVxdWFscyB0cnVlLCBvdGhlcndpc2UgaXQgd2lsbCBiZSBoaWRlLjxici8+XG4gICAgICogMy4gZXhwb3NlQ2xhc3NOYW1lPGJyLz5cbiAgICAgKiAgICAgIEV4cG9zZSBjbGFzcyBuYW1lIHRvIGNocm9tZSBkZWJ1ZyB0b29scywgdGhlIGNsYXNzIGludGFudGlhdGUgcGVyZm9ybWFuY2UgaXMgYSBsaXR0bGUgYml0IHNsb3dlciB3aGVuIGV4cG9zZWQuPGJyLz5cbiAgICAgKiA0LiBmcmFtZVJhdGU8YnIvPlxuICAgICAqICAgICAgXCJmcmFtZVJhdGVcIiBzZXQgdGhlIHdhbnRlZCBmcmFtZSByYXRlIGZvciB5b3VyIGdhbWUsIGJ1dCB0aGUgcmVhbCBmcHMgZGVwZW5kcyBvbiB5b3VyIGdhbWUgaW1wbGVtZW50YXRpb24gYW5kIHRoZSBydW5uaW5nIGVudmlyb25tZW50Ljxici8+XG4gICAgICogNS4gaWQ8YnIvPlxuICAgICAqICAgICAgXCJnYW1lQ2FudmFzXCIgc2V0cyB0aGUgaWQgb2YgeW91ciBjYW52YXMgZWxlbWVudCBvbiB0aGUgd2ViIHBhZ2UsIGl0J3MgdXNlZnVsIG9ubHkgb24gd2ViLjxici8+XG4gICAgICogNi4gcmVuZGVyTW9kZTxici8+XG4gICAgICogICAgICBcInJlbmRlck1vZGVcIiBzZXRzIHRoZSByZW5kZXJlciB0eXBlLCBvbmx5IHVzZWZ1bCBvbiB3ZWIgOjxici8+XG4gICAgICogICAgICAwIC0gQXV0b21hdGljYWxseSBjaG9zZW4gYnkgZW5naW5lPGJyLz5cbiAgICAgKiAgICAgIDEgLSBGb3JjZWQgdG8gdXNlIGNhbnZhcyByZW5kZXJlcjxici8+XG4gICAgICogICAgICAyIC0gRm9yY2VkIHRvIHVzZSBXZWJHTCByZW5kZXJlciwgYnV0IHRoaXMgd2lsbCBiZSBpZ25vcmVkIG9uIG1vYmlsZSBicm93c2Vyczxici8+XG4gICAgICo8YnIvPlxuICAgICAqIFBsZWFzZSBETyBOT1QgbW9kaWZ5IHRoaXMgb2JqZWN0IGRpcmVjdGx5LCBpdCB3b24ndCBoYXZlIGFueSBlZmZlY3QuPGJyLz5cbiAgICAgKiAhI3poXG4gICAgICog5b2T5YmN55qE5ri45oiP6YWN572u77yM5YyF5ous77yaICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAxLiBkZWJ1Z01vZGXvvIhkZWJ1ZyDmqKHlvI/vvIzkvYbmmK/lnKjmtY/op4jlmajkuK3ov5nkuKrpgInpobnkvJrooqvlv73nlaXvvIkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogICAgICBcImRlYnVnTW9kZVwiIOWQhOenjeiuvue9rumAiemhueeahOaEj+S5ieOAgiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogICAgICAgICAgMCAtIOayoeaciea2iOaBr+iiq+aJk+WNsOWHuuadpeOAgiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqICAgICAgICAgIDEgLSBjYy5lcnJvcu+8jGNjLmFzc2VydO+8jGNjLndhcm7vvIxjYy5sb2cg5bCG5omT5Y2w5ZyoIGNvbnNvbGUg5Lit44CCICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgICAgICAyIC0gY2MuZXJyb3LvvIxjYy5hc3NlcnTvvIxjYy53YXJuIOWwhuaJk+WNsOWcqCBjb25zb2xlIOS4reOAgiAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgICAgICAzIC0gY2MuZXJyb3LvvIxjYy5hc3NlcnQg5bCG5omT5Y2w5ZyoIGNvbnNvbGUg5Lit44CCICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqICAgICAgICAgIDQgLSBjYy5lcnJvcu+8jGNjLmFzc2VydO+8jGNjLndhcm7vvIxjYy5sb2cg5bCG5omT5Y2w5ZyoIGNhbnZhcyDkuK3vvIjku4XpgILnlKjkuo4gd2ViIOerr++8ieOAgiA8YnIvPlxuICAgICAqICAgICAgICAgIDUgLSBjYy5lcnJvcu+8jGNjLmFzc2VydO+8jGNjLndhcm4g5bCG5omT5Y2w5ZyoIGNhbnZhcyDkuK3vvIjku4XpgILnlKjkuo4gd2ViIOerr++8ieOAgiAgICAgICAgIDxici8+XG4gICAgICogICAgICAgICAgNiAtIGNjLmVycm9y77yMY2MuYXNzZXJ0IOWwhuaJk+WNsOWcqCBjYW52YXMg5Lit77yI5LuF6YCC55So5LqOIHdlYiDnq6/vvInjgIIgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqIDIuIHNob3dGUFPvvIjmmL7npLogRlBT77yJICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgIOW9kyBzaG93RlBTIOS4uiB0cnVlIOeahOaXtuWAmeeVjOmdoueahOW3puS4i+inkuWwhuaYvuekuiBmcHMg55qE5L+h5oGv77yM5ZCm5YiZ6KKr6ZqQ6JeP44CCICAgICAgICAgICAgICA8YnIvPlxuICAgICAqIDMuIGV4cG9zZUNsYXNzTmFtZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgIOaatOmcsuexu+WQjeiuqSBDaHJvbWUgRGV2VG9vbHMg5Y+v5Lul6K+G5Yir77yM5aaC5p6c5byA5ZCv5Lya56iN56iN6ZmN5L2O57G755qE5Yib5bu66L+H56iL55qE5oCn6IO977yM5L2G5a+55a+56LGh5p6E6YCg5rKh5pyJ5b2x5ZON44CCIDxici8+XG4gICAgICogNC4gZnJhbWVSYXRlICjluKfnjocpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqICAgICAg4oCcZnJhbWVSYXRl4oCdIOiuvue9ruaDs+imgeeahOW4p+eOh+S9oOeahOa4uOaIj++8jOS9huecn+ato+eahEZQU+WPluWGs+S6juS9oOeahOa4uOaIj+WunueOsOWSjOi/kOihjOeOr+Wig+OAgiAgICAgIDxici8+XG4gICAgICogNS4gaWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgIFwiZ2FtZUNhbnZhc1wiIFdlYiDpobXpnaLkuIrnmoQgQ2FudmFzIEVsZW1lbnQgSUTvvIzku4XpgILnlKjkuo4gd2ViIOerr+OAgiAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqIDYuIHJlbmRlck1vZGXvvIjmuLLmn5PmqKHlvI/vvIkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqICAgICAg4oCccmVuZGVyTW9kZeKAnSDorr7nva7muLLmn5PlmajnsbvlnovvvIzku4XpgILnlKjkuo4gd2ViIOerr++8miAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogICAgICAgICAgMCAtIOmAmui/h+W8leaTjuiHquWKqOmAieaLqeOAgiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgICAgICAxIC0g5by65Yi25L2/55SoIGNhbnZhcyDmuLLmn5PjgIJcbiAgICAgKiAgICAgICAgICAyIC0g5by65Yi25L2/55SoIFdlYkdMIOa4suafk++8jOS9huaYr+WcqOmDqOWIhiBBbmRyb2lkIOa1j+iniOWZqOS4rei/meS4qumAiemhueS8muiiq+W/veeVpeOAgiAgICAgPGJyLz5cbiAgICAgKiA8YnIvPlxuICAgICAqIOazqOaEj++8muivt+S4jeimgeebtOaOpeS/ruaUuei/meS4quWvueixoe+8jOWug+S4jeS8muacieS7u+S9leaViOaenOOAglxuICAgICAqIEBwcm9wZXJ0eSBjb25maWdcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbmZpZzogbnVsbCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2FsbGJhY2sgd2hlbiB0aGUgc2NyaXB0cyBvZiBlbmdpbmUgaGF2ZSBiZWVuIGxvYWQuXG4gICAgICogISN6aCDlvZPlvJXmk47lrozmiJDlkK/liqjlkI7nmoTlm57osIPlh73mlbDjgIJcbiAgICAgKiBAbWV0aG9kIG9uU3RhcnRcbiAgICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAgICovXG4gICAgb25TdGFydDogbnVsbCxcblxuICAgIC8vQFB1YmxpYyBNZXRob2RzXG5cbiAgICAvLyAgQEdhbWUgcGxheSBjb250cm9sXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgZnJhbWUgcmF0ZSBvZiBnYW1lLlxuICAgICAqICEjemgg6K6+572u5ri45oiP5bin546H44CCXG4gICAgICogQG1ldGhvZCBzZXRGcmFtZVJhdGVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZnJhbWVSYXRlXG4gICAgICovXG4gICAgc2V0RnJhbWVSYXRlOiBmdW5jdGlvbiAoZnJhbWVSYXRlKSB7XG4gICAgICAgIHZhciBjb25maWcgPSB0aGlzLmNvbmZpZztcbiAgICAgICAgY29uZmlnLmZyYW1lUmF0ZSA9IGZyYW1lUmF0ZTtcbiAgICAgICAgaWYgKHRoaXMuX2ludGVydmFsSWQpXG4gICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbUZyYW1lKHRoaXMuX2ludGVydmFsSWQpO1xuICAgICAgICB0aGlzLl9pbnRlcnZhbElkID0gMDtcbiAgICAgICAgdGhpcy5fcGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fc2V0QW5pbUZyYW1lKCk7XG4gICAgICAgIHRoaXMuX3J1bk1haW5Mb29wKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0IGZyYW1lIHJhdGUgc2V0IGZvciB0aGUgZ2FtZSwgaXQgZG9lc24ndCByZXByZXNlbnQgdGhlIHJlYWwgZnJhbWUgcmF0ZS5cbiAgICAgKiAhI3poIOiOt+WPluiuvue9rueahOa4uOaIj+W4p+eOh++8iOS4jeetieWQjOS6juWunumZheW4p+eOh++8ieOAglxuICAgICAqIEBtZXRob2QgZ2V0RnJhbWVSYXRlXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBmcmFtZSByYXRlXG4gICAgICovXG4gICAgZ2V0RnJhbWVSYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5mcmFtZVJhdGU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUnVuIHRoZSBnYW1lIGZyYW1lIGJ5IGZyYW1lLlxuICAgICAqICEjemgg5omn6KGM5LiA5bin5ri45oiP5b6q546v44CCXG4gICAgICogQG1ldGhvZCBzdGVwXG4gICAgICovXG4gICAgc3RlcDogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5tYWluTG9vcCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBhdXNlIHRoZSBnYW1lIG1haW4gbG9vcC4gVGhpcyB3aWxsIHBhdXNlOlxuICAgICAqIGdhbWUgbG9naWMgZXhlY3V0aW9uLCByZW5kZXJpbmcgcHJvY2VzcywgZXZlbnQgbWFuYWdlciwgYmFja2dyb3VuZCBtdXNpYyBhbmQgYWxsIGF1ZGlvIGVmZmVjdHMuXG4gICAgICogVGhpcyBpcyBkaWZmZXJlbnQgd2l0aCBjYy5kaXJlY3Rvci5wYXVzZSB3aGljaCBvbmx5IHBhdXNlIHRoZSBnYW1lIGxvZ2ljIGV4ZWN1dGlvbi5cbiAgICAgKiAhI3poIOaaguWBnOa4uOaIj+S4u+W+queOr+OAguWMheWQq++8mua4uOaIj+mAu+i+ke+8jOa4suafk++8jOS6i+S7tuWkhOeQhu+8jOiDjOaZr+mfs+S5kOWSjOaJgOaciemfs+aViOOAgui/meeCueWSjOWPquaaguWBnOa4uOaIj+mAu+i+keeahCBjYy5kaXJlY3Rvci5wYXVzZSDkuI3lkIzjgIJcbiAgICAgKiBAbWV0aG9kIHBhdXNlXG4gICAgICovXG4gICAgcGF1c2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3BhdXNlZCkgcmV0dXJuO1xuICAgICAgICB0aGlzLl9wYXVzZWQgPSB0cnVlO1xuICAgICAgICAvLyBQYXVzZSBhdWRpbyBlbmdpbmVcbiAgICAgICAgaWYgKGNjLmF1ZGlvRW5naW5lKSB7XG4gICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5fYnJlYWsoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBQYXVzZSBtYWluIGxvb3BcbiAgICAgICAgaWYgKHRoaXMuX2ludGVydmFsSWQpXG4gICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbUZyYW1lKHRoaXMuX2ludGVydmFsSWQpO1xuICAgICAgICB0aGlzLl9pbnRlcnZhbElkID0gMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXN1bWUgdGhlIGdhbWUgZnJvbSBwYXVzZS4gVGhpcyB3aWxsIHJlc3VtZTpcbiAgICAgKiBnYW1lIGxvZ2ljIGV4ZWN1dGlvbiwgcmVuZGVyaW5nIHByb2Nlc3MsIGV2ZW50IG1hbmFnZXIsIGJhY2tncm91bmQgbXVzaWMgYW5kIGFsbCBhdWRpbyBlZmZlY3RzLlxuICAgICAqICEjemgg5oGi5aSN5ri45oiP5Li75b6q546v44CC5YyF5ZCr77ya5ri45oiP6YC76L6R77yM5riy5p+T77yM5LqL5Lu25aSE55CG77yM6IOM5pmv6Z+z5LmQ5ZKM5omA5pyJ6Z+z5pWI44CCXG4gICAgICogQG1ldGhvZCByZXN1bWVcbiAgICAgKi9cbiAgICByZXN1bWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9wYXVzZWQpIHJldHVybjtcbiAgICAgICAgdGhpcy5fcGF1c2VkID0gZmFsc2U7XG4gICAgICAgIC8vIFJlc3VtZSBhdWRpbyBlbmdpbmVcbiAgICAgICAgaWYgKGNjLmF1ZGlvRW5naW5lKSB7XG4gICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5fcmVzdG9yZSgpO1xuICAgICAgICB9XG4gICAgICAgIGNjLmRpcmVjdG9yLl9yZXNldERlbHRhVGltZSgpO1xuICAgICAgICAvLyBSZXN1bWUgbWFpbiBsb29wXG4gICAgICAgIHRoaXMuX3J1bk1haW5Mb29wKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2hlY2sgd2hldGhlciB0aGUgZ2FtZSBpcyBwYXVzZWQuXG4gICAgICogISN6aCDliKTmlq3muLjmiI/mmK/lkKbmmoLlgZzjgIJcbiAgICAgKiBAbWV0aG9kIGlzUGF1c2VkXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpc1BhdXNlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGF1c2VkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJlc3RhcnQgZ2FtZS5cbiAgICAgKiAhI3poIOmHjeaWsOW8gOWni+a4uOaIj1xuICAgICAqIEBtZXRob2QgcmVzdGFydFxuICAgICAqL1xuICAgIHJlc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuZGlyZWN0b3Iub25jZShjYy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9EUkFXLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpZCBpbiBnYW1lLl9wZXJzaXN0Um9vdE5vZGVzKSB7XG4gICAgICAgICAgICAgICAgZ2FtZS5yZW1vdmVQZXJzaXN0Um9vdE5vZGUoZ2FtZS5fcGVyc2lzdFJvb3ROb2Rlc1tpZF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDbGVhciBzY2VuZVxuICAgICAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5kZXN0cm95KCk7XG4gICAgICAgICAgICBjYy5PYmplY3QuX2RlZmVycmVkRGVzdHJveSgpO1xuXG4gICAgICAgICAgICAvLyBDbGVhbiB1cCBhdWRpb1xuICAgICAgICAgICAgaWYgKGNjLmF1ZGlvRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUudW5jYWNoZUFsbCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5yZXNldCgpO1xuXG4gICAgICAgICAgICBnYW1lLnBhdXNlKCk7XG4gICAgICAgICAgICBjYy5hc3NldE1hbmFnZXIuYnVpbHRpbnMuaW5pdCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgZ2FtZS5vblN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgZ2FtZS5lbWl0KGdhbWUuRVZFTlRfUkVTVEFSVCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gRW5kIGdhbWUsIGl0IHdpbGwgY2xvc2UgdGhlIGdhbWUgd2luZG93XG4gICAgICogISN6aCDpgIDlh7rmuLjmiI9cbiAgICAgKiBAbWV0aG9kIGVuZFxuICAgICAqL1xuICAgIGVuZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBjbG9zZSgpO1xuICAgIH0sXG5cbiAgICAvLyAgQEdhbWUgbG9hZGluZ1xuXG4gICAgX2luaXRFbmdpbmUoKSB7XG4gICAgICAgIGlmICh0aGlzLl9yZW5kZXJlckluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9pbml0UmVuZGVyZXIoKTtcblxuICAgICAgICBpZiAoIUNDX0VESVRPUikge1xuICAgICAgICAgICAgdGhpcy5faW5pdEV2ZW50cygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfRU5HSU5FX0lOSVRFRCk7XG4gICAgfSxcblxuICAgIF9sb2FkUHJldmlld1NjcmlwdChjYikge1xuICAgICAgICBpZiAoQ0NfUFJFVklFVyAmJiB3aW5kb3cuX19xdWlja19jb21waWxlX3Byb2plY3RfXykge1xuICAgICAgICAgICAgd2luZG93Ll9fcXVpY2tfY29tcGlsZV9wcm9qZWN0X18ubG9hZChjYik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjYigpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9wcmVwYXJlRmluaXNoZWQoY2IpIHtcbiAgICAgICAgLy8gSW5pdCBlbmdpbmVcbiAgICAgICAgdGhpcy5faW5pdEVuZ2luZSgpO1xuICAgICAgICB0aGlzLl9zZXRBbmltRnJhbWUoKTtcbiAgICAgICAgY2MuYXNzZXRNYW5hZ2VyLmJ1aWx0aW5zLmluaXQoKCkgPT4ge1xuICAgICAgICAgICAgLy8gTG9nIGVuZ2luZSB2ZXJzaW9uXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ29jb3MgQ3JlYXRvciB2JyArIGNjLkVOR0lORV9WRVJTSU9OKTtcbiAgICAgICAgICAgIHRoaXMuX3ByZXBhcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX3J1bk1haW5Mb29wKCk7XG5cbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX0dBTUVfSU5JVEVEKTtcblxuICAgICAgICAgICAgaWYgKGNiKSBjYigpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgZXZlbnRUYXJnZXRPbjogRXZlbnRUYXJnZXQucHJvdG90eXBlLm9uLFxuICAgIGV2ZW50VGFyZ2V0T25jZTogRXZlbnRUYXJnZXQucHJvdG90eXBlLm9uY2UsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmVnaXN0ZXIgYW4gY2FsbGJhY2sgb2YgYSBzcGVjaWZpYyBldmVudCB0eXBlIG9uIHRoZSBnYW1lIG9iamVjdC5cbiAgICAgKiBUaGlzIHR5cGUgb2YgZXZlbnQgc2hvdWxkIGJlIHRyaWdnZXJlZCB2aWEgYGVtaXRgLlxuICAgICAqICEjemhcbiAgICAgKiDms6jlhowgZ2FtZSDnmoTnibnlrprkuovku7bnsbvlnovlm57osIPjgILov5nnp43nsbvlnovnmoTkuovku7blupTor6XooqsgYGVtaXRgIOinpuWPkeOAglxuICAgICAqXG4gICAgICogQG1ldGhvZCBvblxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBldmVudCB0eXBlIHRvIGxpc3RlbiBmb3IuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnQgaXMgZGlzcGF0Y2hlZC5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBjYWxsYmFjayBpcyBpZ25vcmVkIGlmIGl0IGlzIGEgZHVwbGljYXRlICh0aGUgY2FsbGJhY2tzIGFyZSB1bmlxdWUpLlxuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnMV0gYXJnMVxuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnMl0gYXJnMlxuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnM10gYXJnM1xuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnNF0gYXJnNFxuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnNV0gYXJnNVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbdGFyZ2V0XSAtIFRoZSB0YXJnZXQgKHRoaXMgb2JqZWN0KSB0byBpbnZva2UgdGhlIGNhbGxiYWNrLCBjYW4gYmUgbnVsbFxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSAtIEp1c3QgcmV0dXJucyB0aGUgaW5jb21pbmcgY2FsbGJhY2sgc28geW91IGNhbiBzYXZlIHRoZSBhbm9ueW1vdXMgZnVuY3Rpb24gZWFzaWVyLlxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogb248VCBleHRlbmRzIEZ1bmN0aW9uPih0eXBlOiBzdHJpbmcsIGNhbGxiYWNrOiBULCB0YXJnZXQ/OiBhbnksIHVzZUNhcHR1cmU/OiBib29sZWFuKTogVFxuICAgICAqL1xuICAgIG9uKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQsIG9uY2UpIHtcbiAgICAgICAgLy8gTWFrZSBzdXJlIEVWRU5UX0VOR0lORV9JTklURUQgYW5kIEVWRU5UX0dBTUVfSU5JVEVEIGNhbGxiYWNrcyB0byBiZSBpbnZva2VkXG4gICAgICAgIGlmICgodGhpcy5fcHJlcGFyZWQgJiYgdHlwZSA9PT0gdGhpcy5FVkVOVF9FTkdJTkVfSU5JVEVEKSB8fFxuICAgICAgICAgICAgKCF0aGlzLl9wYXVzZWQgJiYgdHlwZSA9PT0gdGhpcy5FVkVOVF9HQU1FX0lOSVRFRCkpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRUYXJnZXRPbih0eXBlLCBjYWxsYmFjaywgdGFyZ2V0LCBvbmNlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJlZ2lzdGVyIGFuIGNhbGxiYWNrIG9mIGEgc3BlY2lmaWMgZXZlbnQgdHlwZSBvbiB0aGUgZ2FtZSBvYmplY3QsXG4gICAgICogdGhlIGNhbGxiYWNrIHdpbGwgcmVtb3ZlIGl0c2VsZiBhZnRlciB0aGUgZmlyc3QgdGltZSBpdCBpcyB0cmlnZ2VyZWQuXG4gICAgICogISN6aFxuICAgICAqIOazqOWGjCBnYW1lIOeahOeJueWumuS6i+S7tuexu+Wei+Wbnuiwg++8jOWbnuiwg+S8muWcqOesrOS4gOaXtumXtOiiq+inpuWPkeWQjuWIoOmZpOiHqui6q+OAglxuICAgICAqXG4gICAgICogQG1ldGhvZCBvbmNlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGV2ZW50IHR5cGUgdG8gbGlzdGVuIGZvci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgaW52b2tlZCB3aGVuIHRoZSBldmVudCBpcyBkaXNwYXRjaGVkLlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGNhbGxiYWNrIGlzIGlnbm9yZWQgaWYgaXQgaXMgYSBkdXBsaWNhdGUgKHRoZSBjYWxsYmFja3MgYXJlIHVuaXF1ZSkuXG4gICAgICogQHBhcmFtIHthbnl9IFtjYWxsYmFjay5hcmcxXSBhcmcxXG4gICAgICogQHBhcmFtIHthbnl9IFtjYWxsYmFjay5hcmcyXSBhcmcyXG4gICAgICogQHBhcmFtIHthbnl9IFtjYWxsYmFjay5hcmczXSBhcmczXG4gICAgICogQHBhcmFtIHthbnl9IFtjYWxsYmFjay5hcmc0XSBhcmc0XG4gICAgICogQHBhcmFtIHthbnl9IFtjYWxsYmFjay5hcmc1XSBhcmc1XG4gICAgICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXRdIC0gVGhlIHRhcmdldCAodGhpcyBvYmplY3QpIHRvIGludm9rZSB0aGUgY2FsbGJhY2ssIGNhbiBiZSBudWxsXG4gICAgICovXG4gICAgb25jZSh0eXBlLCBjYWxsYmFjaywgdGFyZ2V0KSB7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSBFVkVOVF9FTkdJTkVfSU5JVEVEIGFuZCBFVkVOVF9HQU1FX0lOSVRFRCBjYWxsYmFja3MgdG8gYmUgaW52b2tlZFxuICAgICAgICBpZiAoKHRoaXMuX3ByZXBhcmVkICYmIHR5cGUgPT09IHRoaXMuRVZFTlRfRU5HSU5FX0lOSVRFRCkgfHxcbiAgICAgICAgICAgICghdGhpcy5fcGF1c2VkICYmIHR5cGUgPT09IHRoaXMuRVZFTlRfR0FNRV9JTklURUQpKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50VGFyZ2V0T25jZSh0eXBlLCBjYWxsYmFjaywgdGFyZ2V0KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFByZXBhcmUgZ2FtZS5cbiAgICAgKiAhI3poIOWHhuWkh+W8leaTju+8jOivt+S4jeimgeebtOaOpeiwg+eUqOi/meS4quWHveaVsOOAglxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNiXG4gICAgICogQG1ldGhvZCBwcmVwYXJlXG4gICAgICovXG4gICAgcHJlcGFyZShjYikge1xuICAgICAgICAvLyBBbHJlYWR5IHByZXBhcmVkXG4gICAgICAgIGlmICh0aGlzLl9wcmVwYXJlZCkge1xuICAgICAgICAgICAgaWYgKGNiKSBjYigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9hZFByZXZpZXdTY3JpcHQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fcHJlcGFyZUZpbmlzaGVkKGNiKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUnVuIGdhbWUgd2l0aCBjb25maWd1cmF0aW9uIG9iamVjdCBhbmQgb25TdGFydCBmdW5jdGlvbi5cbiAgICAgKiAhI3poIOi/kOihjOa4uOaIj++8jOW5tuS4lOaMh+WumuW8leaTjumFjee9ruWSjCBvblN0YXJ0IOeahOWbnuiwg+OAglxuICAgICAqIEBtZXRob2QgcnVuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtIFBhc3MgY29uZmlndXJhdGlvbiBvYmplY3Qgb3Igb25TdGFydCBmdW5jdGlvblxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9uU3RhcnQgLSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBhZnRlciBnYW1lIGluaXRpYWxpemVkXG4gICAgICovXG4gICAgcnVuOiBmdW5jdGlvbiAoY29uZmlnLCBvblN0YXJ0KSB7XG4gICAgICAgIHRoaXMuX2luaXRDb25maWcoY29uZmlnKTtcbiAgICAgICAgdGhpcy5vblN0YXJ0ID0gb25TdGFydDtcbiAgICAgICAgdGhpcy5wcmVwYXJlKGdhbWUub25TdGFydCAmJiBnYW1lLm9uU3RhcnQuYmluZChnYW1lKSk7XG4gICAgfSxcblxuICAgIC8vICBAIFBlcnNpc3Qgcm9vdCBub2RlIHNlY3Rpb25cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQWRkIGEgcGVyc2lzdGVudCByb290IG5vZGUgdG8gdGhlIGdhbWUsIHRoZSBwZXJzaXN0ZW50IG5vZGUgd29uJ3QgYmUgZGVzdHJveWVkIGR1cmluZyBzY2VuZSB0cmFuc2l0aW9uLjxici8+XG4gICAgICogVGhlIHRhcmdldCBub2RlIG11c3QgYmUgcGxhY2VkIGluIHRoZSByb290IGxldmVsIG9mIGhpZXJhcmNoeSwgb3RoZXJ3aXNlIHRoaXMgQVBJIHdvbid0IGhhdmUgYW55IGVmZmVjdC5cbiAgICAgKiAhI3poXG4gICAgICog5aOw5piO5bi46am75qC56IqC54K577yM6K+l6IqC54K55LiN5Lya6KKr5Zyo5Zy65pmv5YiH5o2i5Lit6KKr6ZSA5q+B44CCPGJyLz5cbiAgICAgKiDnm67moIfoioLngrnlv4XpobvkvY3kuo7kuLrlsYLnuqfnmoTmoLnoioLngrnvvIzlkKbliJnml6DmlYjjgIJcbiAgICAgKiBAbWV0aG9kIGFkZFBlcnNpc3RSb290Tm9kZVxuICAgICAqIEBwYXJhbSB7Tm9kZX0gbm9kZSAtIFRoZSBub2RlIHRvIGJlIG1hZGUgcGVyc2lzdGVudFxuICAgICAqL1xuICAgIGFkZFBlcnNpc3RSb290Tm9kZTogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgaWYgKCFjYy5Ob2RlLmlzTm9kZShub2RlKSB8fCAhbm9kZS51dWlkKSB7XG4gICAgICAgICAgICBjYy53YXJuSUQoMzgwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlkID0gbm9kZS51dWlkO1xuICAgICAgICBpZiAoIXRoaXMuX3BlcnNpc3RSb290Tm9kZXNbaWRdKSB7XG4gICAgICAgICAgICB2YXIgc2NlbmUgPSBjYy5kaXJlY3Rvci5fc2NlbmU7XG4gICAgICAgICAgICBpZiAoY2MuaXNWYWxpZChzY2VuZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW5vZGUucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUucGFyZW50ID0gc2NlbmU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCEobm9kZS5wYXJlbnQgaW5zdGFuY2VvZiBjYy5TY2VuZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2Mud2FybklEKDM4MDEpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5vZGUucGFyZW50ICE9PSBzY2VuZSkge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuSUQoMzgwMik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9wZXJzaXN0Um9vdE5vZGVzW2lkXSA9IG5vZGU7XG4gICAgICAgICAgICBub2RlLl9wZXJzaXN0Tm9kZSA9IHRydWU7XG4gICAgICAgICAgICBjYy5hc3NldE1hbmFnZXIuX3JlbGVhc2VNYW5hZ2VyLl9hZGRQZXJzaXN0Tm9kZVJlZihub2RlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJlbW92ZSBhIHBlcnNpc3RlbnQgcm9vdCBub2RlLlxuICAgICAqICEjemgg5Y+W5raI5bi46am75qC56IqC54K544CCXG4gICAgICogQG1ldGhvZCByZW1vdmVQZXJzaXN0Um9vdE5vZGVcbiAgICAgKiBAcGFyYW0ge05vZGV9IG5vZGUgLSBUaGUgbm9kZSB0byBiZSByZW1vdmVkIGZyb20gcGVyc2lzdGVudCBub2RlIGxpc3RcbiAgICAgKi9cbiAgICByZW1vdmVQZXJzaXN0Um9vdE5vZGU6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHZhciBpZCA9IG5vZGUudXVpZCB8fCAnJztcbiAgICAgICAgaWYgKG5vZGUgPT09IHRoaXMuX3BlcnNpc3RSb290Tm9kZXNbaWRdKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fcGVyc2lzdFJvb3ROb2Rlc1tpZF07XG4gICAgICAgICAgICBub2RlLl9wZXJzaXN0Tm9kZSA9IGZhbHNlO1xuICAgICAgICAgICAgY2MuYXNzZXRNYW5hZ2VyLl9yZWxlYXNlTWFuYWdlci5fcmVtb3ZlUGVyc2lzdE5vZGVSZWYobm9kZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBDaGVjayB3aGV0aGVyIHRoZSBub2RlIGlzIGEgcGVyc2lzdGVudCByb290IG5vZGUuXG4gICAgICogISN6aCDmo4Dmn6XoioLngrnmmK/lkKbmmK/luLjpqbvmoLnoioLngrnjgIJcbiAgICAgKiBAbWV0aG9kIGlzUGVyc2lzdFJvb3ROb2RlXG4gICAgICogQHBhcmFtIHtOb2RlfSBub2RlIC0gVGhlIG5vZGUgdG8gYmUgY2hlY2tlZFxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaXNQZXJzaXN0Um9vdE5vZGU6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHJldHVybiBub2RlLl9wZXJzaXN0Tm9kZTtcbiAgICB9LFxuXG4gICAgLy9AUHJpdmF0ZSBNZXRob2RzXG5cbiAgICAvLyAgQFRpbWUgdGlja2VyIHNlY3Rpb25cbiAgICBfc2V0QW5pbUZyYW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2xhc3RUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIHZhciBmcmFtZVJhdGUgPSBnYW1lLmNvbmZpZy5mcmFtZVJhdGU7XG4gICAgICAgIHRoaXMuX2ZyYW1lVGltZSA9IDEwMDAgLyBmcmFtZVJhdGU7XG4gICAgICAgIGNjLmRpcmVjdG9yLl9tYXhQYXJ0aWNsZURlbHRhVGltZSA9IHRoaXMuX2ZyYW1lVGltZSAvIDEwMDAgKiAyO1xuICAgICAgICBpZiAoQ0NfSlNCIHx8IENDX1JVTlRJTUUpIHtcbiAgICAgICAgICAgIGpzYi5zZXRQcmVmZXJyZWRGcmFtZXNQZXJTZWNvbmQoZnJhbWVSYXRlKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbUZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltRnJhbWUgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgckFGID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgIHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgICAgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXG4gICAgICAgICAgICBpZiAoZnJhbWVSYXRlICE9PSA2MCAmJiBmcmFtZVJhdGUgIT09IDMwKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltRnJhbWUgPSByQUYgPyB0aGlzLl9zdFRpbWVXaXRoUkFGIDogdGhpcy5fc3RUaW1lO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltRnJhbWUgPSB0aGlzLl9jdFRpbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1GcmFtZSA9IHJBRiB8fCB0aGlzLl9zdFRpbWU7XG5cbiAgICAgICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbUZyYW1lID0gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm1zQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5tb3pDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9DYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LndlYmtpdENhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubXNDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vQ2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3RUaW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9zdFRpbWVXaXRoUkFGOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGN1cnJUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgZ2FtZS5fZnJhbWVUaW1lIC0gKGN1cnJUaW1lIC0gZ2FtZS5fbGFzdFRpbWUpKTtcbiAgICAgICAgdmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShjYWxsYmFjayk7XG4gICAgICAgIH0sIHRpbWVUb0NhbGwpO1xuICAgICAgICBnYW1lLl9sYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH0sXG5cbiAgICBfc3RUaW1lOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGN1cnJUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgZ2FtZS5fZnJhbWVUaW1lIC0gKGN1cnJUaW1lIC0gZ2FtZS5fbGFzdFRpbWUpKTtcbiAgICAgICAgdmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjYWxsYmFjaygpOyB9LFxuICAgICAgICAgICAgdGltZVRvQ2FsbCk7XG4gICAgICAgIGdhbWUuX2xhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfSxcbiAgICBfY3RUaW1lOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dChpZCk7XG4gICAgfSxcbiAgICAvL1J1biBnYW1lLlxuICAgIF9ydW5NYWluTG9vcDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9wcmVwYXJlZCkgcmV0dXJuO1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcywgY2FsbGJhY2ssIGNvbmZpZyA9IHNlbGYuY29uZmlnLFxuICAgICAgICAgICAgZGlyZWN0b3IgPSBjYy5kaXJlY3RvcixcbiAgICAgICAgICAgIHNraXAgPSB0cnVlLCBmcmFtZVJhdGUgPSBjb25maWcuZnJhbWVSYXRlO1xuXG4gICAgICAgIGRlYnVnLnNldERpc3BsYXlTdGF0cyhjb25maWcuc2hvd0ZQUyk7XG5cbiAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAobm93KSB7XG4gICAgICAgICAgICBpZiAoIXNlbGYuX3BhdXNlZCkge1xuICAgICAgICAgICAgICAgIHNlbGYuX2ludGVydmFsSWQgPSB3aW5kb3cucmVxdWVzdEFuaW1GcmFtZShjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgaWYgKCFDQ19KU0IgJiYgIUNDX1JVTlRJTUUgJiYgZnJhbWVSYXRlID09PSAzMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2tpcCA9ICFza2lwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGlyZWN0b3IubWFpbkxvb3Aobm93KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBzZWxmLl9pbnRlcnZhbElkID0gd2luZG93LnJlcXVlc3RBbmltRnJhbWUoY2FsbGJhY2spO1xuICAgICAgICBzZWxmLl9wYXVzZWQgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8gIEBHYW1lIGxvYWRpbmcgc2VjdGlvblxuICAgIF9pbml0Q29uZmlnKGNvbmZpZykge1xuICAgICAgICAvLyBDb25maWdzIGFkanVzdG1lbnRcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcuZGVidWdNb2RlICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgY29uZmlnLmRlYnVnTW9kZSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgY29uZmlnLmV4cG9zZUNsYXNzTmFtZSA9ICEhY29uZmlnLmV4cG9zZUNsYXNzTmFtZTtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcuZnJhbWVSYXRlICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgY29uZmlnLmZyYW1lUmF0ZSA9IDYwO1xuICAgICAgICB9XG4gICAgICAgIGxldCByZW5kZXJNb2RlID0gY29uZmlnLnJlbmRlck1vZGU7XG4gICAgICAgIGlmICh0eXBlb2YgcmVuZGVyTW9kZSAhPT0gJ251bWJlcicgfHwgcmVuZGVyTW9kZSA+IDIgfHwgcmVuZGVyTW9kZSA8IDApIHtcbiAgICAgICAgICAgIGNvbmZpZy5yZW5kZXJNb2RlID0gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5yZWdpc3RlclN5c3RlbUV2ZW50ICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIGNvbmZpZy5yZWdpc3RlclN5c3RlbUV2ZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVuZGVyTW9kZSA9PT0gMSkge1xuICAgICAgICAgICAgY29uZmlnLnNob3dGUFMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZy5zaG93RlBTID0gISFjb25maWcuc2hvd0ZQUztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvbGxpZGUgTWFwIGFuZCBHcm91cCBMaXN0XG4gICAgICAgIHRoaXMuY29sbGlzaW9uTWF0cml4ID0gY29uZmlnLmNvbGxpc2lvbk1hdHJpeCB8fCBbXTtcbiAgICAgICAgdGhpcy5ncm91cExpc3QgPSBjb25maWcuZ3JvdXBMaXN0IHx8IFtdO1xuXG4gICAgICAgIGRlYnVnLl9yZXNldERlYnVnU2V0dGluZyhjb25maWcuZGVidWdNb2RlKTtcblxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5fY29uZmlnTG9hZGVkID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgX2RldGVybWluZVJlbmRlclR5cGUoKSB7XG4gICAgICAgIGxldCBjb25maWcgPSB0aGlzLmNvbmZpZyxcbiAgICAgICAgICAgIHVzZXJSZW5kZXJNb2RlID0gcGFyc2VJbnQoY29uZmlnLnJlbmRlck1vZGUpIHx8IDA7XG5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIFJlbmRlclR5cGVcbiAgICAgICAgdGhpcy5yZW5kZXJUeXBlID0gdGhpcy5SRU5ERVJfVFlQRV9DQU5WQVM7XG4gICAgICAgIGxldCBzdXBwb3J0UmVuZGVyID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHVzZXJSZW5kZXJNb2RlID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoY2Muc3lzLmNhcGFiaWxpdGllc1snb3BlbmdsJ10pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclR5cGUgPSB0aGlzLlJFTkRFUl9UWVBFX1dFQkdMO1xuICAgICAgICAgICAgICAgIHN1cHBvcnRSZW5kZXIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2Muc3lzLmNhcGFiaWxpdGllc1snY2FudmFzJ10pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclR5cGUgPSB0aGlzLlJFTkRFUl9UWVBFX0NBTlZBUztcbiAgICAgICAgICAgICAgICBzdXBwb3J0UmVuZGVyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1c2VyUmVuZGVyTW9kZSA9PT0gMSAmJiBjYy5zeXMuY2FwYWJpbGl0aWVzWydjYW52YXMnXSkge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJUeXBlID0gdGhpcy5SRU5ERVJfVFlQRV9DQU5WQVM7XG4gICAgICAgICAgICBzdXBwb3J0UmVuZGVyID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1c2VyUmVuZGVyTW9kZSA9PT0gMiAmJiBjYy5zeXMuY2FwYWJpbGl0aWVzWydvcGVuZ2wnXSkge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJUeXBlID0gdGhpcy5SRU5ERVJfVFlQRV9XRUJHTDtcbiAgICAgICAgICAgIHN1cHBvcnRSZW5kZXIgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzdXBwb3J0UmVuZGVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZGVidWcuZ2V0RXJyb3IoMzgyMCwgdXNlclJlbmRlck1vZGUpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfaW5pdFJlbmRlcmVyKCkge1xuICAgICAgICAvLyBBdm9pZCBzZXR1cCB0byBiZSBjYWxsZWQgdHdpY2UuXG4gICAgICAgIGlmICh0aGlzLl9yZW5kZXJlckluaXRpYWxpemVkKSByZXR1cm47XG5cbiAgICAgICAgbGV0IGVsID0gdGhpcy5jb25maWcuaWQsXG4gICAgICAgICAgICB3aWR0aCwgaGVpZ2h0LFxuICAgICAgICAgICAgbG9jYWxDYW52YXMsIGxvY2FsQ29udGFpbmVyO1xuXG4gICAgICAgIGlmIChDQ19KU0IgfHwgQ0NfUlVOVElNRSkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBsb2NhbENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XG4gICAgICAgICAgICB0aGlzLmZyYW1lID0gbG9jYWxDb250YWluZXIucGFyZW50Tm9kZSA9PT0gZG9jdW1lbnQuYm9keSA/IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCA6IGxvY2FsQ29udGFpbmVyLnBhcmVudE5vZGU7XG4gICAgICAgICAgICBsb2NhbENhbnZhcyA9IHdpbmRvdy5fX2NhbnZhcztcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gbG9jYWxDYW52YXM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IChlbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSA/IGVsIDogKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpIHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgZWwpKTtcblxuICAgICAgICAgICAgaWYgKGVsZW1lbnQudGFnTmFtZSA9PT0gXCJDQU5WQVNcIikge1xuICAgICAgICAgICAgICAgIHdpZHRoID0gZWxlbWVudC53aWR0aDtcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSBlbGVtZW50LmhlaWdodDtcblxuICAgICAgICAgICAgICAgIC8vaXQgaXMgYWxyZWFkeSBhIGNhbnZhcywgd2Ugd3JhcCBpdCBhcm91bmQgd2l0aCBhIGRpdlxuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzID0gbG9jYWxDYW52YXMgPSBlbGVtZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gbG9jYWxDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xuICAgICAgICAgICAgICAgIGlmIChsb2NhbENhbnZhcy5wYXJlbnROb2RlKVxuICAgICAgICAgICAgICAgICAgICBsb2NhbENhbnZhcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShsb2NhbENvbnRhaW5lciwgbG9jYWxDYW52YXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL3dlIG11c3QgbWFrZSBhIG5ldyBjYW52YXMgYW5kIHBsYWNlIGludG8gdGhpcyBlbGVtZW50XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQudGFnTmFtZSAhPT0gXCJESVZcIikge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuSUQoMzgxOSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdpZHRoID0gZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSBlbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcyA9IGxvY2FsQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkNBTlZBU1wiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGxvY2FsQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGxvY2FsQ29udGFpbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvY2FsQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnaWQnLCAnQ29jb3MyZEdhbWVDb250YWluZXInKTtcbiAgICAgICAgICAgIGxvY2FsQ29udGFpbmVyLmFwcGVuZENoaWxkKGxvY2FsQ2FudmFzKTtcbiAgICAgICAgICAgIHRoaXMuZnJhbWUgPSAobG9jYWxDb250YWluZXIucGFyZW50Tm9kZSA9PT0gZG9jdW1lbnQuYm9keSkgPyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgOiBsb2NhbENvbnRhaW5lci5wYXJlbnROb2RlO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBhZGRDbGFzcyhlbGVtZW50LCBuYW1lKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhhc0NsYXNzID0gKCcgJyArIGVsZW1lbnQuY2xhc3NOYW1lICsgJyAnKS5pbmRleE9mKCcgJyArIG5hbWUgKyAnICcpID4gLTE7XG4gICAgICAgICAgICAgICAgaWYgKCFoYXNDbGFzcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5jbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lICs9IFwiIFwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lICs9IG5hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWRkQ2xhc3MobG9jYWxDYW52YXMsIFwiZ2FtZUNhbnZhc1wiKTtcbiAgICAgICAgICAgIGxvY2FsQ2FudmFzLnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIHdpZHRoIHx8IDQ4MCk7XG4gICAgICAgICAgICBsb2NhbENhbnZhcy5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgaGVpZ2h0IHx8IDMyMCk7XG4gICAgICAgICAgICBsb2NhbENhbnZhcy5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCA5OSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9kZXRlcm1pbmVSZW5kZXJUeXBlKCk7XG4gICAgICAgIC8vIFdlYkdMIGNvbnRleHQgY3JlYXRlZCBzdWNjZXNzZnVsbHlcbiAgICAgICAgaWYgKHRoaXMucmVuZGVyVHlwZSA9PT0gdGhpcy5SRU5ERVJfVFlQRV9XRUJHTCkge1xuICAgICAgICAgICAgdmFyIG9wdHMgPSB7XG4gICAgICAgICAgICAgICAgJ3N0ZW5jaWwnOiB0cnVlLFxuICAgICAgICAgICAgICAgIC8vIE1TQUEgaXMgY2F1c2luZyBzZXJpb3VzIHBlcmZvcm1hbmNlIGRyb3Bkb3duIG9uIHNvbWUgYnJvd3NlcnMuXG4gICAgICAgICAgICAgICAgJ2FudGlhbGlhcyc6IGNjLm1hY3JvLkVOQUJMRV9XRUJHTF9BTlRJQUxJQVMsXG4gICAgICAgICAgICAgICAgJ2FscGhhJzogY2MubWFjcm8uRU5BQkxFX1RSQU5TUEFSRU5UX0NBTlZBU1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlbmRlcmVyLmluaXRXZWJHTChsb2NhbENhbnZhcywgb3B0cyk7XG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJDb250ZXh0ID0gcmVuZGVyZXIuZGV2aWNlLl9nbDtcblxuICAgICAgICAgICAgLy8gRW5hYmxlIGR5bmFtaWMgYXRsYXMgbWFuYWdlciBieSBkZWZhdWx0XG4gICAgICAgICAgICBpZiAoIWNjLm1hY3JvLkNMRUFOVVBfSU1BR0VfQ0FDSEUgJiYgZHluYW1pY0F0bGFzTWFuYWdlcikge1xuICAgICAgICAgICAgICAgIGR5bmFtaWNBdGxhc01hbmFnZXIuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9yZW5kZXJDb250ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlclR5cGUgPSB0aGlzLlJFTkRFUl9UWVBFX0NBTlZBUztcbiAgICAgICAgICAgIC8vIENvdWxkIGJlIGlnbm9yZWQgYnkgbW9kdWxlIHNldHRpbmdzXG4gICAgICAgICAgICByZW5kZXJlci5pbml0Q2FudmFzKGxvY2FsQ2FudmFzKTtcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckNvbnRleHQgPSByZW5kZXJlci5kZXZpY2UuX2N0eDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2FudmFzLm9uY29udGV4dG1lbnUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIWNjLl9pc0NvbnRleHRNZW51RW5hYmxlKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fcmVuZGVyZXJJbml0aWFsaXplZCA9IHRydWU7XG4gICAgfSxcblxuICAgIF9pbml0RXZlbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB3aW4gPSB3aW5kb3csIGhpZGRlblByb3BOYW1lO1xuXG4gICAgICAgIC8vIHJlZ2lzdGVyIHN5c3RlbSBldmVudHNcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnJlZ2lzdGVyU3lzdGVtRXZlbnQpXG4gICAgICAgICAgICBjYy5pbnRlcm5hbC5pbnB1dE1hbmFnZXIucmVnaXN0ZXJTeXN0ZW1FdmVudCh0aGlzLmNhbnZhcyk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudC5oaWRkZW4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBoaWRkZW5Qcm9wTmFtZSA9IFwiaGlkZGVuXCI7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRvY3VtZW50Lm1vekhpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGhpZGRlblByb3BOYW1lID0gXCJtb3pIaWRkZW5cIjtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQubXNIaWRkZW4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBoaWRkZW5Qcm9wTmFtZSA9IFwibXNIaWRkZW5cIjtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQud2Via2l0SGlkZGVuICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaGlkZGVuUHJvcE5hbWUgPSBcIndlYmtpdEhpZGRlblwiO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGhpZGRlbiA9IGZhbHNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIG9uSGlkZGVuKCkge1xuICAgICAgICAgICAgaWYgKCFoaWRkZW4pIHtcbiAgICAgICAgICAgICAgICBoaWRkZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGdhbWUuZW1pdChnYW1lLkVWRU5UX0hJREUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEluIG9yZGVyIHRvIGFkYXB0IHRoZSBtb3N0IG9mIHBsYXRmb3JtcyB0aGUgb25zaG93IEFQSS5cbiAgICAgICAgZnVuY3Rpb24gb25TaG93bihhcmcwLCBhcmcxLCBhcmcyLCBhcmczLCBhcmc0KSB7XG4gICAgICAgICAgICBpZiAoaGlkZGVuKSB7XG4gICAgICAgICAgICAgICAgaGlkZGVuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZ2FtZS5lbWl0KGdhbWUuRVZFTlRfU0hPVywgYXJnMCwgYXJnMSwgYXJnMiwgYXJnMywgYXJnNCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGlkZGVuUHJvcE5hbWUpIHtcbiAgICAgICAgICAgIHZhciBjaGFuZ2VMaXN0ID0gW1xuICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eWNoYW5nZVwiLFxuICAgICAgICAgICAgICAgIFwibW96dmlzaWJpbGl0eWNoYW5nZVwiLFxuICAgICAgICAgICAgICAgIFwibXN2aXNpYmlsaXR5Y2hhbmdlXCIsXG4gICAgICAgICAgICAgICAgXCJ3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlXCIsXG4gICAgICAgICAgICAgICAgXCJxYnJvd3NlclZpc2liaWxpdHlDaGFuZ2VcIlxuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhbmdlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoY2hhbmdlTGlzdFtpXSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2aXNpYmxlID0gZG9jdW1lbnRbaGlkZGVuUHJvcE5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAvLyBRUSBBcHBcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJsZSA9IHZpc2libGUgfHwgZXZlbnRbXCJoaWRkZW5cIl07XG4gICAgICAgICAgICAgICAgICAgIGlmICh2aXNpYmxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgb25IaWRkZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgb25TaG93bigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2luLmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIG9uSGlkZGVuKTtcbiAgICAgICAgICAgIHdpbi5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgb25TaG93bik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTWljcm9NZXNzZW5nZXJcIikgPiAtMSkge1xuICAgICAgICAgICAgd2luLm9uZm9jdXMgPSBvblNob3duO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFwib25wYWdlc2hvd1wiIGluIHdpbmRvdyAmJiBcIm9ucGFnZWhpZGVcIiBpbiB3aW5kb3cpIHtcbiAgICAgICAgICAgIHdpbi5hZGRFdmVudExpc3RlbmVyKFwicGFnZWhpZGVcIiwgb25IaWRkZW4pO1xuICAgICAgICAgICAgd2luLmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlc2hvd1wiLCBvblNob3duKTtcbiAgICAgICAgICAgIC8vIFRhb2JhbyBVSVdlYktpdFxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInBhZ2VoaWRlXCIsIG9uSGlkZGVuKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlc2hvd1wiLCBvblNob3duKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub24oZ2FtZS5FVkVOVF9ISURFLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBnYW1lLnBhdXNlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm9uKGdhbWUuRVZFTlRfU0hPVywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZ2FtZS5yZXN1bWUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuRXZlbnRUYXJnZXQuY2FsbChnYW1lKTtcbmNjLmpzLmFkZG9uKGdhbWUsIEV2ZW50VGFyZ2V0LnByb3RvdHlwZSk7XG5cbi8qKlxuICogQG1vZHVsZSBjY1xuICovXG5cbi8qKlxuICogISNlbiBUaGlzIGlzIGEgR2FtZSBpbnN0YW5jZS5cbiAqICEjemgg6L+Z5piv5LiA5LiqIEdhbWUg57G755qE5a6e5L6L77yM5YyF5ZCr5ri45oiP5Li75L2T5L+h5oGv5bm26LSf6LSj6amx5Yqo5ri45oiP55qE5ri45oiP5a+56LGh44CC44CCXG4gKiBAcHJvcGVydHkgZ2FtZVxuICogQHR5cGUgR2FtZVxuICovXG5jYy5nYW1lID0gbW9kdWxlLmV4cG9ydHMgPSBnYW1lO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=