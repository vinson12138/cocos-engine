
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCAnimation.js';
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
var AnimationAnimator = require('../../animation/animation-animator');

var AnimationClip = require('../../animation/animation-clip');

var EventTarget = require('../event/event-target');

var js = require('../platform/js');

var equalClips = CC_EDITOR ? function (clip1, clip2) {
  return clip1 === clip2 || clip1 && clip2 && (clip1.name === clip2.name || clip1._uuid === clip2._uuid);
} : function (clip1, clip2) {
  return clip1 === clip2;
};
/**
 * !#en The event type supported by Animation
 * !#zh Animation 支持的事件类型
 * @class Animation.EventType
 * @static
 * @namespace Animationd
 */

var EventType = cc.Enum({
  /**
   * !#en Emit when begin playing animation
   * !#zh 开始播放时触发
   * @property {String} PLAY
   * @static
   */
  PLAY: 'play',

  /**
   * !#en Emit when stop playing animation
   * !#zh 停止播放时触发
   * @property {String} STOP
   * @static
   */
  STOP: 'stop',

  /**
   * !#en Emit when pause animation
   * !#zh 暂停播放时触发
   * @property {String} PAUSE
   * @static
   */
  PAUSE: 'pause',

  /**
   * !#en Emit when resume animation
   * !#zh 恢复播放时触发
   * @property {String} RESUME
   * @static
   */
  RESUME: 'resume',

  /**
   * !#en If animation repeat count is larger than 1, emit when animation play to the last frame
   * !#zh 假如动画循环次数大于 1，当动画播放到最后一帧时触发
   * @property {String} LASTFRAME
   * @static
   */
  LASTFRAME: 'lastframe',

  /**
   * !#en Emit when finish playing animation
   * !#zh 动画播放完成时触发
   * @property {String} FINISHED
   * @static
   */
  FINISHED: 'finished'
});
/**
 * !#en The animation component is used to play back animations.
 *
 * Animation provide several events to register：
 *  - play : Emit when begin playing animation
 *  - stop : Emit when stop playing animation
 *  - pause : Emit when pause animation
 *  - resume : Emit when resume animation
 *  - lastframe : If animation repeat count is larger than 1, emit when animation play to the last frame
 *  - finished : Emit when finish playing animation
 *
 * !#zh Animation 组件用于播放动画。
 *
 * Animation 提供了一系列可注册的事件：
 *  - play : 开始播放时
 *  - stop : 停止播放时
 *  - pause : 暂停播放时
 *  - resume : 恢复播放时
 *  - lastframe : 假如动画循环次数大于 1，当动画播放到最后一帧时
 *  - finished : 动画播放完成时
 *
 * @class Animation
 * @extends Component
 * @uses EventTarget
 */

var Animation = cc.Class({
  name: 'cc.Animation',
  "extends": require('./CCComponent'),
  mixins: [EventTarget],
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.others/Animation',
    help: 'i18n:COMPONENT.help_url.animation',
    executeInEditMode: true
  },
  statics: {
    EventType: EventType
  },
  ctor: function ctor() {
    cc.EventTarget.call(this); // The actual implement for Animation

    this._animator = null;
    this._nameToState = js.createMap(true);
    this._didInit = false;
    this._currentClip = null;
  },
  properties: {
    _defaultClip: {
      "default": null,
      type: AnimationClip
    },

    /**
     * !#en Animation will play the default clip when start game.
     * !#zh 在勾选自动播放或调用 play() 时默认播放的动画剪辑。
     * @property defaultClip
     * @type {AnimationClip}
     */
    defaultClip: {
      type: AnimationClip,
      get: function get() {
        return this._defaultClip;
      },
      set: function set(value) {
        if (!CC_EDITOR || cc.engine && cc.engine.isPlaying) {
          return;
        }

        this._defaultClip = value;

        if (!value) {
          return;
        }

        var contain = this._clips.findIndex(function (clip) {
          return equalClips(clip, value);
        }) >= 0;

        if (!contain) {
          this.addClip(value);
        }
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.animation.default_clip'
    },

    /**
     * !#en Current played clip.
     * !#zh 当前播放的动画剪辑。
     * @property currentClip
     * @type {AnimationClip}
     */
    currentClip: {
      get: function get() {
        return this._currentClip;
      },
      set: function set(value) {
        this._currentClip = value;
      },
      type: AnimationClip,
      visible: false
    },
    // This property is used to watch clip changes in editor.
    // Don't use in your game, use addClip/removeClip instead.
    _writableClips: {
      get: function get() {
        return this._clips;
      },
      set: function set(val) {
        this._didInit = false;
        this._clips = val;

        this._init();
      },
      type: [AnimationClip]
    },

    /**
     * !#en All the clips used in this animation.
     * !#zh 通过脚本可以访问并播放的 AnimationClip 列表。
     * @property _clips
     * @type {AnimationClip[]}
     * @private
     */
    _clips: {
      "default": [],
      type: [AnimationClip],
      tooltip: CC_DEV && 'i18n:COMPONENT.animation.clips',
      visible: true
    },

    /**
     * !#en Whether the animation should auto play the default clip when start game.
     * !#zh 是否在运行游戏后自动播放默认动画剪辑。
     * @property playOnLoad
     * @type {Boolean}
     * @default true
     */
    playOnLoad: {
      "default": false,
      tooltip: CC_DEV && 'i18n:COMPONENT.animation.play_on_load'
    }
  },
  start: function start() {
    if (!CC_EDITOR && this.playOnLoad && this._defaultClip) {
      var isPlaying = this._animator && this._animator.isPlaying;

      if (!isPlaying) {
        var state = this.getAnimationState(this._defaultClip.name);

        this._animator.playState(state);
      }
    }
  },
  onEnable: function onEnable() {
    if (this._animator) {
      this._animator.resume();
    }
  },
  onDisable: function onDisable() {
    if (this._animator) {
      this._animator.pause();
    }
  },
  onDestroy: function onDestroy() {
    this.stop();
  },
  ///////////////////////////////////////////////////////////////////////////////
  // Public Methods
  ///////////////////////////////////////////////////////////////////////////////

  /**
   * !#en Get all the clips used in this animation.
   * !#zh 获取动画组件上的所有动画剪辑。
   * @method getClips
   * @return {AnimationClip[]}
   */
  getClips: function getClips() {
    return this._clips;
  },

  /**
   * !#en Plays an animation and stop other animations.
   * !#zh 播放指定的动画，并且停止当前正在播放动画。如果没有指定动画，则播放默认动画。
   * @method play
   * @param {String} [name] - The name of animation to play. If no name is supplied then the default animation will be played.
   * @param {Number} [startTime] - play an animation from startTime
   * @return {AnimationState} - The AnimationState of playing animation. In cases where the animation can't be played (ie, there is no default animation or no animation with the specified name), the function will return null.
   * @example
   * var animCtrl = this.node.getComponent(cc.Animation);
   * animCtrl.play("linear");
   */
  play: function play(name, startTime) {
    var state = this.playAdditive(name, startTime);

    this._animator.stopStatesExcept(state);

    return state;
  },

  /**
   * !#en
   * Plays an additive animation, it will not stop other animations.
   * If there are other animations playing, then will play several animations at the same time.
   * !#zh 播放指定的动画（将不会停止当前播放的动画）。如果没有指定动画，则播放默认动画。
   * @method playAdditive
   * @param {String} [name] - The name of animation to play. If no name is supplied then the default animation will be played.
   * @param {Number} [startTime] - play an animation from startTime
   * @return {AnimationState} - The AnimationState of playing animation. In cases where the animation can't be played (ie, there is no default animation or no animation with the specified name), the function will return null.
   * @example
   * // linear_1 and linear_2 at the same time playing.
   * var animCtrl = this.node.getComponent(cc.Animation);
   * animCtrl.playAdditive("linear_1");
   * animCtrl.playAdditive("linear_2");
   */
  playAdditive: function playAdditive(name, startTime) {
    this._init();

    var state = this.getAnimationState(name || this._defaultClip && this._defaultClip.name);

    if (state) {
      this.enabled = true;
      var animator = this._animator;

      if (animator.isPlaying && state.isPlaying) {
        if (state.isPaused) {
          animator.resumeState(state);
        } else {
          animator.stopState(state);
          animator.playState(state, startTime);
        }
      } else {
        animator.playState(state, startTime);
      } // Animation cannot be played when the component is not enabledInHierarchy.
      // That would cause an error for the animation lost the reference after destroying the node.
      // If users play the animation when the component is not enabledInHierarchy,
      // we pause the animator here so that it will automatically resume the animation when users enable the component.


      if (!this.enabledInHierarchy) {
        animator.pause();
      }

      this.currentClip = state.clip;
    }

    return state;
  },

  /**
   * !#en Stops an animation named name. If no name is supplied then stops all playing animations that were started with this Animation. <br/>
   * Stopping an animation also Rewinds it to the Start.
   * !#zh 停止指定的动画。如果没有指定名字，则停止当前正在播放的动画。
   * @method stop
   * @param {String} [name] - The animation to stop, if not supplied then stops all playing animations.
   */
  stop: function stop(name) {
    if (!this._didInit) {
      return;
    }

    if (name) {
      var state = this._nameToState[name];

      if (state) {
        this._animator.stopState(state);
      }
    } else {
      this._animator.stop();
    }
  },

  /**
   * !#en Pauses an animation named name. If no name is supplied then pauses all playing animations that were started with this Animation.
   * !#zh 暂停当前或者指定的动画。如果没有指定名字，则暂停当前正在播放的动画。
   * @method pause
   * @param {String} [name] - The animation to pauses, if not supplied then pauses all playing animations.
   */
  pause: function pause(name) {
    if (!this._didInit) {
      return;
    }

    if (name) {
      var state = this._nameToState[name];

      if (state) {
        this._animator.pauseState(state);
      }
    } else {
      this.enabled = false;
    }
  },

  /**
   * !#en Resumes an animation named name. If no name is supplied then resumes all paused animations that were started with this Animation.
   * !#zh 重新播放指定的动画，如果没有指定名字，则重新播放当前正在播放的动画。
   * @method resume
   * @param {String} [name] - The animation to resumes, if not supplied then resumes all paused animations.
   */
  resume: function resume(name) {
    if (!this._didInit) {
      return;
    }

    if (name) {
      var state = this.getAnimationState(name);

      if (state) {
        this._animator.resumeState(state);
      }
    } else {
      this.enabled = true;
    }
  },

  /**
   * !#en Make an animation named name go to the specified time. If no name is supplied then make all animations go to the specified time.
   * !#zh 设置指定动画的播放时间。如果没有指定名字，则设置当前播放动画的播放时间。
   * @method setCurrentTime
   * @param {Number} [time] - The time to go to
   * @param {String} [name] - Specified animation name, if not supplied then make all animations go to the time.
   */
  setCurrentTime: function setCurrentTime(time, name) {
    this._init();

    if (name) {
      var state = this.getAnimationState(name);

      if (state) {
        this._animator.setStateTime(state, time);
      }
    } else {
      this._animator.setStateTime(time);
    }
  },

  /**
   * !#en Returns the animation state named name. If no animation with the specified name, the function will return null.
   * !#zh 获取当前或者指定的动画状态，如果未找到指定动画剪辑则返回 null。
   * @method getAnimationState
   * @param {String} name
   * @return {AnimationState}
   */
  getAnimationState: function getAnimationState(name) {
    this._init();

    var state = this._nameToState[name];

    if (CC_EDITOR && (!state || !cc.js.array.contains(this._clips, state.clip))) {
      this._didInit = false;

      if (this._animator) {
        this._animator.stop();
      }

      this._init();

      state = this._nameToState[name];
    }

    if (state && !state.curveLoaded) {
      this._animator._reloadClip(state);
    }

    return state || null;
  },

  /**
   * !#en Adds a clip to the animation with name newName. If a clip with that name already exists it will be replaced with the new clip.
   * !#zh 添加动画剪辑，并且可以重新设置该动画剪辑的名称。
   * @method addClip
   * @param {AnimationClip} clip - the clip to add
   * @param {String} [newName]
   * @return {AnimationState} - The AnimationState which gives full control over the animation clip.
   */
  addClip: function addClip(clip, newName) {
    if (!clip) {
      cc.warnID(3900);
      return;
    }

    this._init(); // add clip


    if (!cc.js.array.contains(this._clips, clip)) {
      this._clips.push(clip);
    } // replace same name clip


    newName = newName || clip.name;
    var oldState = this._nameToState[newName];

    if (oldState) {
      if (oldState.clip === clip) {
        return oldState;
      } else {
        var index = this._clips.indexOf(oldState.clip);

        if (index !== -1) {
          this._clips.splice(index, 1);
        }
      }
    } // replace state


    var newState = new cc.AnimationState(clip, newName);
    this._nameToState[newName] = newState;
    return newState;
  },

  /**
   * !#en
   * Remove clip from the animation list. This will remove the clip and any animation states based on it.
   * If there are animation states depand on the clip are playing or clip is defaultClip, it will not delete the clip.
   * But if force is true, then will always remove the clip and any animation states based on it. If clip is defaultClip, defaultClip will be reset to null
   * !#zh
   * 从动画列表中移除指定的动画剪辑，<br/>
   * 如果依赖于 clip 的 AnimationState 正在播放或者 clip 是 defaultClip 的话，默认是不会删除 clip 的。
   * 但是如果 force 参数为 true，则会强制停止该动画，然后移除该动画剪辑和相关的动画。这时候如果 clip 是 defaultClip，defaultClip 将会被重置为 null。
   * @method removeClip
   * @param {AnimationClip} clip
   * @param {Boolean} [force=false] - If force is true, then will always remove the clip and any animation states based on it.
   */
  removeClip: function removeClip(clip, force) {
    if (!clip) {
      cc.warnID(3901);
      return;
    }

    this._init();

    var state;

    for (var name in this._nameToState) {
      state = this._nameToState[name];

      if (equalClips(state.clip, clip)) {
        break;
      }
    }

    if (clip === this._defaultClip) {
      if (force) this._defaultClip = null;else {
        if (!CC_TEST) cc.warnID(3902);
        return;
      }
    }

    if (state && state.isPlaying) {
      if (force) this.stop(state.name);else {
        if (!CC_TEST) cc.warnID(3903);
        return;
      }
    }

    this._clips = this._clips.filter(function (item) {
      return !equalClips(item, clip);
    });

    if (state) {
      delete this._nameToState[state.name];
    }
  },

  /**
   * !#en
   * Samples animations at the current state.<br/>
   * This is useful when you explicitly want to set up some animation state, and sample it once.
   * !#zh 对指定或当前动画进行采样。你可以手动将动画设置到某一个状态，然后采样一次。
   * @method sample
   * @param {String} name
   */
  sample: function sample(name) {
    this._init();

    if (name) {
      var state = this.getAnimationState(name);

      if (state) {
        state.sample();
      }
    } else {
      this._animator.sample();
    }
  },

  /**
   * !#en
   * Register animation event callback.
   * The event arguments will provide the AnimationState which emit the event.
   * When play an animation, will auto register the event callback to the AnimationState, and unregister the event callback from the AnimationState when animation stopped.
   * !#zh
   * 注册动画事件回调。
   * 回调的事件里将会附上发送事件的 AnimationState。
   * 当播放一个动画时，会自动将事件注册到对应的 AnimationState 上，停止播放时会将事件从这个 AnimationState 上取消注册。
   * @method on
   * @param {String} type - A string representing the event type to listen for.
   * @param {Function} callback - The callback that will be invoked when the event is dispatched.
   *                              The callback is ignored if it is a duplicate (the callbacks are unique).
   * @param {cc.AnimationState} state
   * @param {Object} [target] - The target (this object) to invoke the callback, can be null
   * @param {Boolean} [useCapture=false] - When set to true, the capture argument prevents callback
   *                              from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE.
   *                              When false, callback will NOT be invoked when event's eventPhase attribute value is CAPTURING_PHASE.
   *                              Either way, callback will be invoked when event's eventPhase attribute value is AT_TARGET.
   *
   * @return {Function} - Just returns the incoming callback so you can save the anonymous function easier.
   * @typescript
   * on(type: string, callback: (event: Event.EventCustom) => void, target?: any, useCapture?: boolean): (event: Event.EventCustom) => void
   * on<T>(type: string, callback: (event: T) => void, target?: any, useCapture?: boolean): (event: T) => void
   * on(type: string, callback: (type: string, state: cc.AnimationState) => void, target?: any, useCapture?: boolean): (type: string, state: cc.AnimationState) => void
   * @example
   * onPlay: function (type, state) {
   *     // callback
   * }
   *
   * // register event to all animation
   * animation.on('play', this.onPlay, this);
   */
  on: function on(type, callback, target, useCapture) {
    this._init();

    var ret = this._EventTargetOn(type, callback, target, useCapture);

    if (type === 'lastframe') {
      var states = this._nameToState;

      for (var name in states) {
        states[name]._lastframeEventOn = true;
      }
    }

    return ret;
  },

  /**
   * !#en
   * Unregister animation event callback.
   * !#zh
   * 取消注册动画事件回调。
   * @method off
   * @param {String} type - A string representing the event type being removed.
   * @param {Function} [callback] - The callback to remove.
   * @param {Object} [target] - The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
   * @param {Boolean} [useCapture=false] - Specifies whether the callback being removed was registered as a capturing callback or not.
   *                              If not specified, useCapture defaults to false. If a callback was registered twice,
   *                              one with capture and one without, each must be removed separately. Removal of a capturing callback
   *                              does not affect a non-capturing version of the same listener, and vice versa.
   *
   * @example
   * // unregister event to all animation
   * animation.off('play', this.onPlay, this);
   */
  off: function off(type, callback, target, useCapture) {
    this._init();

    if (type === 'lastframe') {
      var states = this._nameToState;

      for (var name in states) {
        states[name]._lastframeEventOn = false;
      }
    }

    this._EventTargetOff(type, callback, target, useCapture);
  },
  ///////////////////////////////////////////////////////////////////////////////
  // Internal Methods
  ///////////////////////////////////////////////////////////////////////////////
  // Dont forget to call _init before every actual process in public methods.
  // Just invoking _init by onLoad is not enough because onLoad is called only if the entity is active.
  _init: function _init() {
    if (this._didInit) {
      return;
    }

    this._didInit = true;
    this._animator = new AnimationAnimator(this.node, this);

    this._createStates();
  },
  _createStates: function _createStates() {
    this._nameToState = js.createMap(true); // create animation states

    var state = null;
    var defaultClipState = false;

    for (var i = 0; i < this._clips.length; ++i) {
      var clip = this._clips[i];

      if (clip) {
        state = new cc.AnimationState(clip);

        if (CC_EDITOR) {
          this._animator._reloadClip(state);
        }

        this._nameToState[state.name] = state;

        if (equalClips(this._defaultClip, clip)) {
          defaultClipState = state;
        }
      }
    }

    if (this._defaultClip && !defaultClipState) {
      state = new cc.AnimationState(this._defaultClip);

      if (CC_EDITOR) {
        this._animator._reloadClip(state);
      }

      this._nameToState[state.name] = state;
    }
  }
});
Animation.prototype._EventTargetOn = EventTarget.prototype.on;
Animation.prototype._EventTargetOff = EventTarget.prototype.off;
cc.Animation = module.exports = Animation;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvQ0NBbmltYXRpb24uanMiXSwibmFtZXMiOlsiQW5pbWF0aW9uQW5pbWF0b3IiLCJyZXF1aXJlIiwiQW5pbWF0aW9uQ2xpcCIsIkV2ZW50VGFyZ2V0IiwianMiLCJlcXVhbENsaXBzIiwiQ0NfRURJVE9SIiwiY2xpcDEiLCJjbGlwMiIsIm5hbWUiLCJfdXVpZCIsIkV2ZW50VHlwZSIsImNjIiwiRW51bSIsIlBMQVkiLCJTVE9QIiwiUEFVU0UiLCJSRVNVTUUiLCJMQVNURlJBTUUiLCJGSU5JU0hFRCIsIkFuaW1hdGlvbiIsIkNsYXNzIiwibWl4aW5zIiwiZWRpdG9yIiwibWVudSIsImhlbHAiLCJleGVjdXRlSW5FZGl0TW9kZSIsInN0YXRpY3MiLCJjdG9yIiwiY2FsbCIsIl9hbmltYXRvciIsIl9uYW1lVG9TdGF0ZSIsImNyZWF0ZU1hcCIsIl9kaWRJbml0IiwiX2N1cnJlbnRDbGlwIiwicHJvcGVydGllcyIsIl9kZWZhdWx0Q2xpcCIsInR5cGUiLCJkZWZhdWx0Q2xpcCIsImdldCIsInNldCIsInZhbHVlIiwiZW5naW5lIiwiaXNQbGF5aW5nIiwiY29udGFpbiIsIl9jbGlwcyIsImZpbmRJbmRleCIsImNsaXAiLCJhZGRDbGlwIiwidG9vbHRpcCIsIkNDX0RFViIsImN1cnJlbnRDbGlwIiwidmlzaWJsZSIsIl93cml0YWJsZUNsaXBzIiwidmFsIiwiX2luaXQiLCJwbGF5T25Mb2FkIiwic3RhcnQiLCJzdGF0ZSIsImdldEFuaW1hdGlvblN0YXRlIiwicGxheVN0YXRlIiwib25FbmFibGUiLCJyZXN1bWUiLCJvbkRpc2FibGUiLCJwYXVzZSIsIm9uRGVzdHJveSIsInN0b3AiLCJnZXRDbGlwcyIsInBsYXkiLCJzdGFydFRpbWUiLCJwbGF5QWRkaXRpdmUiLCJzdG9wU3RhdGVzRXhjZXB0IiwiZW5hYmxlZCIsImFuaW1hdG9yIiwiaXNQYXVzZWQiLCJyZXN1bWVTdGF0ZSIsInN0b3BTdGF0ZSIsImVuYWJsZWRJbkhpZXJhcmNoeSIsInBhdXNlU3RhdGUiLCJzZXRDdXJyZW50VGltZSIsInRpbWUiLCJzZXRTdGF0ZVRpbWUiLCJhcnJheSIsImNvbnRhaW5zIiwiY3VydmVMb2FkZWQiLCJfcmVsb2FkQ2xpcCIsIm5ld05hbWUiLCJ3YXJuSUQiLCJwdXNoIiwib2xkU3RhdGUiLCJpbmRleCIsImluZGV4T2YiLCJzcGxpY2UiLCJuZXdTdGF0ZSIsIkFuaW1hdGlvblN0YXRlIiwicmVtb3ZlQ2xpcCIsImZvcmNlIiwiQ0NfVEVTVCIsImZpbHRlciIsIml0ZW0iLCJzYW1wbGUiLCJvbiIsImNhbGxiYWNrIiwidGFyZ2V0IiwidXNlQ2FwdHVyZSIsInJldCIsIl9FdmVudFRhcmdldE9uIiwic3RhdGVzIiwiX2xhc3RmcmFtZUV2ZW50T24iLCJvZmYiLCJfRXZlbnRUYXJnZXRPZmYiLCJub2RlIiwiX2NyZWF0ZVN0YXRlcyIsImRlZmF1bHRDbGlwU3RhdGUiLCJpIiwibGVuZ3RoIiwicHJvdG90eXBlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsaUJBQWlCLEdBQUdDLE9BQU8sQ0FBQyxvQ0FBRCxDQUFqQzs7QUFDQSxJQUFNQyxhQUFhLEdBQUdELE9BQU8sQ0FBQyxnQ0FBRCxDQUE3Qjs7QUFDQSxJQUFNRSxXQUFXLEdBQUdGLE9BQU8sQ0FBQyx1QkFBRCxDQUEzQjs7QUFDQSxJQUFNRyxFQUFFLEdBQUdILE9BQU8sQ0FBQyxnQkFBRCxDQUFsQjs7QUFFQSxJQUFJSSxVQUFVLEdBQUdDLFNBQVMsR0FBRyxVQUFVQyxLQUFWLEVBQWlCQyxLQUFqQixFQUF3QjtBQUNqRCxTQUFPRCxLQUFLLEtBQUtDLEtBQVYsSUFBb0JELEtBQUssSUFBSUMsS0FBVCxLQUFtQkQsS0FBSyxDQUFDRSxJQUFOLEtBQWVELEtBQUssQ0FBQ0MsSUFBckIsSUFBNkJGLEtBQUssQ0FBQ0csS0FBTixLQUFnQkYsS0FBSyxDQUFDRSxLQUF0RSxDQUEzQjtBQUNILENBRnlCLEdBRXRCLFVBQVVILEtBQVYsRUFBaUJDLEtBQWpCLEVBQXdCO0FBQ3hCLFNBQU9ELEtBQUssS0FBS0MsS0FBakI7QUFDSCxDQUpEO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBSUcsU0FBUyxHQUFHQyxFQUFFLENBQUNDLElBQUgsQ0FBUTtBQUNwQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsSUFBSSxFQUFFLE1BUGM7O0FBUXBCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJQyxFQUFBQSxJQUFJLEVBQUUsTUFkYzs7QUFlcEI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLEVBQUFBLEtBQUssRUFBRSxPQXJCYTs7QUFzQnBCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJQyxFQUFBQSxNQUFNLEVBQUUsUUE1Qlk7O0FBNkJwQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsU0FBUyxFQUFFLFdBbkNTOztBQW9DcEI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLEVBQUFBLFFBQVEsRUFBRTtBQTFDVSxDQUFSLENBQWhCO0FBNkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQUlDLFNBQVMsR0FBR1IsRUFBRSxDQUFDUyxLQUFILENBQVM7QUFDckJaLEVBQUFBLElBQUksRUFBRSxjQURlO0FBRXJCLGFBQVNSLE9BQU8sQ0FBQyxlQUFELENBRks7QUFHckJxQixFQUFBQSxNQUFNLEVBQUUsQ0FBQ25CLFdBQUQsQ0FIYTtBQUtyQm9CLEVBQUFBLE1BQU0sRUFBRWpCLFNBQVMsSUFBSTtBQUNqQmtCLElBQUFBLElBQUksRUFBRSwyQ0FEVztBQUVqQkMsSUFBQUEsSUFBSSxFQUFFLG1DQUZXO0FBR2pCQyxJQUFBQSxpQkFBaUIsRUFBRTtBQUhGLEdBTEE7QUFXckJDLEVBQUFBLE9BQU8sRUFBRTtBQUNMaEIsSUFBQUEsU0FBUyxFQUFUQTtBQURLLEdBWFk7QUFlckJpQixFQUFBQSxJQUFJLEVBQUUsZ0JBQVk7QUFDZGhCLElBQUFBLEVBQUUsQ0FBQ1QsV0FBSCxDQUFlMEIsSUFBZixDQUFvQixJQUFwQixFQURjLENBR2Q7O0FBQ0EsU0FBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUVBLFNBQUtDLFlBQUwsR0FBb0IzQixFQUFFLENBQUM0QixTQUFILENBQWEsSUFBYixDQUFwQjtBQUNBLFNBQUtDLFFBQUwsR0FBZ0IsS0FBaEI7QUFFQSxTQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0gsR0F6Qm9CO0FBMkJyQkMsRUFBQUEsVUFBVSxFQUFFO0FBRVJDLElBQUFBLFlBQVksRUFBRTtBQUNWLGlCQUFTLElBREM7QUFFVkMsTUFBQUEsSUFBSSxFQUFFbkM7QUFGSSxLQUZOOztBQU9SO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNRb0MsSUFBQUEsV0FBVyxFQUFFO0FBQ1RELE1BQUFBLElBQUksRUFBRW5DLGFBREc7QUFFVHFDLE1BQUFBLEdBQUcsRUFBRSxlQUFZO0FBQ2IsZUFBTyxLQUFLSCxZQUFaO0FBQ0gsT0FKUTtBQUtUSSxNQUFBQSxHQUFHLEVBQUUsYUFBVUMsS0FBVixFQUFpQjtBQUNsQixZQUFJLENBQUNuQyxTQUFELElBQWVNLEVBQUUsQ0FBQzhCLE1BQUgsSUFBYTlCLEVBQUUsQ0FBQzhCLE1BQUgsQ0FBVUMsU0FBMUMsRUFBc0Q7QUFDbEQ7QUFDSDs7QUFFRCxhQUFLUCxZQUFMLEdBQW9CSyxLQUFwQjs7QUFDQSxZQUFJLENBQUNBLEtBQUwsRUFBWTtBQUNSO0FBQ0g7O0FBRUQsWUFBTUcsT0FBTyxHQUFHLEtBQUtDLE1BQUwsQ0FBWUMsU0FBWixDQUFzQixVQUFDQyxJQUFEO0FBQUEsaUJBQVUxQyxVQUFVLENBQUMwQyxJQUFELEVBQU9OLEtBQVAsQ0FBcEI7QUFBQSxTQUF0QixLQUE0RCxDQUE1RTs7QUFDQSxZQUFJLENBQUNHLE9BQUwsRUFBYztBQUNWLGVBQUtJLE9BQUwsQ0FBYVAsS0FBYjtBQUNIO0FBQ0osT0FuQlE7QUFvQlRRLE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxJQUFJO0FBcEJWLEtBYkw7O0FBb0NSO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNRQyxJQUFBQSxXQUFXLEVBQUU7QUFDVFosTUFBQUEsR0FBRyxFQUFFLGVBQVk7QUFDYixlQUFPLEtBQUtMLFlBQVo7QUFDSCxPQUhRO0FBSVRNLE1BQUFBLEdBQUcsRUFBRSxhQUFVQyxLQUFWLEVBQWlCO0FBQ2xCLGFBQUtQLFlBQUwsR0FBb0JPLEtBQXBCO0FBQ0gsT0FOUTtBQU9USixNQUFBQSxJQUFJLEVBQUVuQyxhQVBHO0FBUVRrRCxNQUFBQSxPQUFPLEVBQUU7QUFSQSxLQTFDTDtBQXFEUjtBQUNBO0FBQ0FDLElBQUFBLGNBQWMsRUFBRTtBQUNaZCxNQUFBQSxHQURZLGlCQUNMO0FBQ0gsZUFBTyxLQUFLTSxNQUFaO0FBQ0gsT0FIVztBQUlaTCxNQUFBQSxHQUpZLGVBSVBjLEdBSk8sRUFJRjtBQUNOLGFBQUtyQixRQUFMLEdBQWdCLEtBQWhCO0FBQ0EsYUFBS1ksTUFBTCxHQUFjUyxHQUFkOztBQUNBLGFBQUtDLEtBQUw7QUFDSCxPQVJXO0FBU1psQixNQUFBQSxJQUFJLEVBQUUsQ0FBQ25DLGFBQUQ7QUFUTSxLQXZEUjs7QUFtRVI7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDUTJDLElBQUFBLE1BQU0sRUFBRTtBQUNKLGlCQUFTLEVBREw7QUFFSlIsTUFBQUEsSUFBSSxFQUFFLENBQUNuQyxhQUFELENBRkY7QUFHSitDLE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxJQUFJLGdDQUhmO0FBSUpFLE1BQUFBLE9BQU8sRUFBRTtBQUpMLEtBMUVBOztBQWlGUjtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNRSSxJQUFBQSxVQUFVLEVBQUU7QUFDUixpQkFBUyxLQUREO0FBRVJQLE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxJQUFJO0FBRlg7QUF4RkosR0EzQlM7QUF5SHJCTyxFQUFBQSxLQUFLLEVBQUUsaUJBQVk7QUFDZixRQUFJLENBQUNuRCxTQUFELElBQWMsS0FBS2tELFVBQW5CLElBQWlDLEtBQUtwQixZQUExQyxFQUF3RDtBQUNwRCxVQUFJTyxTQUFTLEdBQUcsS0FBS2IsU0FBTCxJQUFrQixLQUFLQSxTQUFMLENBQWVhLFNBQWpEOztBQUNBLFVBQUksQ0FBQ0EsU0FBTCxFQUFnQjtBQUNaLFlBQUllLEtBQUssR0FBRyxLQUFLQyxpQkFBTCxDQUF1QixLQUFLdkIsWUFBTCxDQUFrQjNCLElBQXpDLENBQVo7O0FBQ0EsYUFBS3FCLFNBQUwsQ0FBZThCLFNBQWYsQ0FBeUJGLEtBQXpCO0FBQ0g7QUFDSjtBQUNKLEdBaklvQjtBQW1JckJHLEVBQUFBLFFBQVEsRUFBRSxvQkFBWTtBQUNsQixRQUFJLEtBQUsvQixTQUFULEVBQW9CO0FBQ2hCLFdBQUtBLFNBQUwsQ0FBZWdDLE1BQWY7QUFDSDtBQUNKLEdBdklvQjtBQXlJckJDLEVBQUFBLFNBQVMsRUFBRSxxQkFBWTtBQUNuQixRQUFJLEtBQUtqQyxTQUFULEVBQW9CO0FBQ2hCLFdBQUtBLFNBQUwsQ0FBZWtDLEtBQWY7QUFDSDtBQUNKLEdBN0lvQjtBQStJckJDLEVBQUFBLFNBQVMsRUFBRSxxQkFBWTtBQUNuQixTQUFLQyxJQUFMO0FBQ0gsR0FqSm9CO0FBbUpyQjtBQUNBO0FBQ0E7O0FBRUE7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLEVBQUFBLFFBQVEsRUFBRSxvQkFBWTtBQUNsQixXQUFPLEtBQUt0QixNQUFaO0FBQ0gsR0EvSm9COztBQWlLckI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJdUIsRUFBQUEsSUFBSSxFQUFFLGNBQVUzRCxJQUFWLEVBQWdCNEQsU0FBaEIsRUFBMkI7QUFDN0IsUUFBSVgsS0FBSyxHQUFHLEtBQUtZLFlBQUwsQ0FBa0I3RCxJQUFsQixFQUF3QjRELFNBQXhCLENBQVo7O0FBQ0EsU0FBS3ZDLFNBQUwsQ0FBZXlDLGdCQUFmLENBQWdDYixLQUFoQzs7QUFDQSxXQUFPQSxLQUFQO0FBQ0gsR0FoTG9COztBQWtMckI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0lZLEVBQUFBLFlBQVksRUFBRSxzQkFBVTdELElBQVYsRUFBZ0I0RCxTQUFoQixFQUEyQjtBQUNyQyxTQUFLZCxLQUFMOztBQUNBLFFBQUlHLEtBQUssR0FBRyxLQUFLQyxpQkFBTCxDQUF1QmxELElBQUksSUFBSyxLQUFLMkIsWUFBTCxJQUFxQixLQUFLQSxZQUFMLENBQWtCM0IsSUFBdkUsQ0FBWjs7QUFFQSxRQUFJaUQsS0FBSixFQUFXO0FBQ1AsV0FBS2MsT0FBTCxHQUFlLElBQWY7QUFFQSxVQUFJQyxRQUFRLEdBQUcsS0FBSzNDLFNBQXBCOztBQUNBLFVBQUkyQyxRQUFRLENBQUM5QixTQUFULElBQXNCZSxLQUFLLENBQUNmLFNBQWhDLEVBQTJDO0FBQ3ZDLFlBQUllLEtBQUssQ0FBQ2dCLFFBQVYsRUFBb0I7QUFDaEJELFVBQUFBLFFBQVEsQ0FBQ0UsV0FBVCxDQUFxQmpCLEtBQXJCO0FBQ0gsU0FGRCxNQUdLO0FBQ0RlLFVBQUFBLFFBQVEsQ0FBQ0csU0FBVCxDQUFtQmxCLEtBQW5CO0FBQ0FlLFVBQUFBLFFBQVEsQ0FBQ2IsU0FBVCxDQUFtQkYsS0FBbkIsRUFBMEJXLFNBQTFCO0FBQ0g7QUFDSixPQVJELE1BU0s7QUFDREksUUFBQUEsUUFBUSxDQUFDYixTQUFULENBQW1CRixLQUFuQixFQUEwQlcsU0FBMUI7QUFDSCxPQWZNLENBaUJQO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxVQUFJLENBQUMsS0FBS1Esa0JBQVYsRUFBOEI7QUFDMUJKLFFBQUFBLFFBQVEsQ0FBQ1QsS0FBVDtBQUNIOztBQUVELFdBQUtiLFdBQUwsR0FBbUJPLEtBQUssQ0FBQ1gsSUFBekI7QUFDSDs7QUFDRCxXQUFPVyxLQUFQO0FBQ0gsR0FqT29COztBQW1PckI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSVEsRUFBQUEsSUFBSSxFQUFFLGNBQVV6RCxJQUFWLEVBQWdCO0FBQ2xCLFFBQUksQ0FBQyxLQUFLd0IsUUFBVixFQUFvQjtBQUNoQjtBQUNIOztBQUNELFFBQUl4QixJQUFKLEVBQVU7QUFDTixVQUFJaUQsS0FBSyxHQUFHLEtBQUszQixZQUFMLENBQWtCdEIsSUFBbEIsQ0FBWjs7QUFDQSxVQUFJaUQsS0FBSixFQUFXO0FBQ1AsYUFBSzVCLFNBQUwsQ0FBZThDLFNBQWYsQ0FBeUJsQixLQUF6QjtBQUNIO0FBQ0osS0FMRCxNQU1LO0FBQ0QsV0FBSzVCLFNBQUwsQ0FBZW9DLElBQWY7QUFDSDtBQUNKLEdBdlBvQjs7QUF5UHJCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJRixFQUFBQSxLQUFLLEVBQUUsZUFBVXZELElBQVYsRUFBZ0I7QUFDbkIsUUFBSSxDQUFDLEtBQUt3QixRQUFWLEVBQW9CO0FBQ2hCO0FBQ0g7O0FBQ0QsUUFBSXhCLElBQUosRUFBVTtBQUNOLFVBQUlpRCxLQUFLLEdBQUcsS0FBSzNCLFlBQUwsQ0FBa0J0QixJQUFsQixDQUFaOztBQUNBLFVBQUlpRCxLQUFKLEVBQVc7QUFDUCxhQUFLNUIsU0FBTCxDQUFlZ0QsVUFBZixDQUEwQnBCLEtBQTFCO0FBQ0g7QUFDSixLQUxELE1BTUs7QUFDRCxXQUFLYyxPQUFMLEdBQWUsS0FBZjtBQUNIO0FBQ0osR0E1UW9COztBQThRckI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0lWLEVBQUFBLE1BQU0sRUFBRSxnQkFBVXJELElBQVYsRUFBZ0I7QUFDcEIsUUFBSSxDQUFDLEtBQUt3QixRQUFWLEVBQW9CO0FBQ2hCO0FBQ0g7O0FBQ0QsUUFBSXhCLElBQUosRUFBVTtBQUNOLFVBQUlpRCxLQUFLLEdBQUcsS0FBS0MsaUJBQUwsQ0FBdUJsRCxJQUF2QixDQUFaOztBQUNBLFVBQUlpRCxLQUFKLEVBQVc7QUFDUCxhQUFLNUIsU0FBTCxDQUFlNkMsV0FBZixDQUEyQmpCLEtBQTNCO0FBQ0g7QUFDSixLQUxELE1BTUs7QUFDRCxXQUFLYyxPQUFMLEdBQWUsSUFBZjtBQUNIO0FBQ0osR0FqU29COztBQW1TckI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSU8sRUFBQUEsY0FBYyxFQUFFLHdCQUFVQyxJQUFWLEVBQWdCdkUsSUFBaEIsRUFBc0I7QUFDbEMsU0FBSzhDLEtBQUw7O0FBQ0EsUUFBSTlDLElBQUosRUFBVTtBQUNOLFVBQUlpRCxLQUFLLEdBQUcsS0FBS0MsaUJBQUwsQ0FBdUJsRCxJQUF2QixDQUFaOztBQUNBLFVBQUlpRCxLQUFKLEVBQVc7QUFDUCxhQUFLNUIsU0FBTCxDQUFlbUQsWUFBZixDQUE0QnZCLEtBQTVCLEVBQW1Dc0IsSUFBbkM7QUFDSDtBQUNKLEtBTEQsTUFNSztBQUNELFdBQUtsRCxTQUFMLENBQWVtRCxZQUFmLENBQTRCRCxJQUE1QjtBQUNIO0FBQ0osR0FyVG9COztBQXVUckI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSXJCLEVBQUFBLGlCQUFpQixFQUFFLDJCQUFVbEQsSUFBVixFQUFnQjtBQUMvQixTQUFLOEMsS0FBTDs7QUFDQSxRQUFJRyxLQUFLLEdBQUcsS0FBSzNCLFlBQUwsQ0FBa0J0QixJQUFsQixDQUFaOztBQUVBLFFBQUlILFNBQVMsS0FBSyxDQUFDb0QsS0FBRCxJQUFVLENBQUM5QyxFQUFFLENBQUNSLEVBQUgsQ0FBTThFLEtBQU4sQ0FBWUMsUUFBWixDQUFxQixLQUFLdEMsTUFBMUIsRUFBa0NhLEtBQUssQ0FBQ1gsSUFBeEMsQ0FBaEIsQ0FBYixFQUE2RTtBQUN6RSxXQUFLZCxRQUFMLEdBQWdCLEtBQWhCOztBQUVBLFVBQUksS0FBS0gsU0FBVCxFQUFvQjtBQUNoQixhQUFLQSxTQUFMLENBQWVvQyxJQUFmO0FBQ0g7O0FBRUQsV0FBS1gsS0FBTDs7QUFDQUcsTUFBQUEsS0FBSyxHQUFHLEtBQUszQixZQUFMLENBQWtCdEIsSUFBbEIsQ0FBUjtBQUNIOztBQUVELFFBQUlpRCxLQUFLLElBQUksQ0FBQ0EsS0FBSyxDQUFDMEIsV0FBcEIsRUFBaUM7QUFDN0IsV0FBS3RELFNBQUwsQ0FBZXVELFdBQWYsQ0FBMkIzQixLQUEzQjtBQUNIOztBQUVELFdBQU9BLEtBQUssSUFBSSxJQUFoQjtBQUNILEdBbFZvQjs7QUFvVnJCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSVYsRUFBQUEsT0FBTyxFQUFFLGlCQUFVRCxJQUFWLEVBQWdCdUMsT0FBaEIsRUFBeUI7QUFDOUIsUUFBSSxDQUFDdkMsSUFBTCxFQUFXO0FBQ1BuQyxNQUFBQSxFQUFFLENBQUMyRSxNQUFILENBQVUsSUFBVjtBQUNBO0FBQ0g7O0FBQ0QsU0FBS2hDLEtBQUwsR0FMOEIsQ0FPOUI7OztBQUNBLFFBQUksQ0FBQzNDLEVBQUUsQ0FBQ1IsRUFBSCxDQUFNOEUsS0FBTixDQUFZQyxRQUFaLENBQXFCLEtBQUt0QyxNQUExQixFQUFrQ0UsSUFBbEMsQ0FBTCxFQUE4QztBQUMxQyxXQUFLRixNQUFMLENBQVkyQyxJQUFaLENBQWlCekMsSUFBakI7QUFDSCxLQVY2QixDQVk5Qjs7O0FBQ0F1QyxJQUFBQSxPQUFPLEdBQUdBLE9BQU8sSUFBSXZDLElBQUksQ0FBQ3RDLElBQTFCO0FBQ0EsUUFBSWdGLFFBQVEsR0FBRyxLQUFLMUQsWUFBTCxDQUFrQnVELE9BQWxCLENBQWY7O0FBQ0EsUUFBSUcsUUFBSixFQUFjO0FBQ1YsVUFBSUEsUUFBUSxDQUFDMUMsSUFBVCxLQUFrQkEsSUFBdEIsRUFBNEI7QUFDeEIsZUFBTzBDLFFBQVA7QUFDSCxPQUZELE1BR0s7QUFDRCxZQUFJQyxLQUFLLEdBQUcsS0FBSzdDLE1BQUwsQ0FBWThDLE9BQVosQ0FBb0JGLFFBQVEsQ0FBQzFDLElBQTdCLENBQVo7O0FBQ0EsWUFBSTJDLEtBQUssS0FBSyxDQUFDLENBQWYsRUFBa0I7QUFDZCxlQUFLN0MsTUFBTCxDQUFZK0MsTUFBWixDQUFtQkYsS0FBbkIsRUFBMEIsQ0FBMUI7QUFDSDtBQUNKO0FBQ0osS0F6QjZCLENBMkI5Qjs7O0FBQ0EsUUFBSUcsUUFBUSxHQUFHLElBQUlqRixFQUFFLENBQUNrRixjQUFQLENBQXNCL0MsSUFBdEIsRUFBNEJ1QyxPQUE1QixDQUFmO0FBQ0EsU0FBS3ZELFlBQUwsQ0FBa0J1RCxPQUFsQixJQUE2Qk8sUUFBN0I7QUFDQSxXQUFPQSxRQUFQO0FBQ0gsR0EzWG9COztBQTZYckI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSUUsRUFBQUEsVUFBVSxFQUFFLG9CQUFVaEQsSUFBVixFQUFnQmlELEtBQWhCLEVBQXVCO0FBQy9CLFFBQUksQ0FBQ2pELElBQUwsRUFBVztBQUNQbkMsTUFBQUEsRUFBRSxDQUFDMkUsTUFBSCxDQUFVLElBQVY7QUFDQTtBQUNIOztBQUNELFNBQUtoQyxLQUFMOztBQUVBLFFBQUlHLEtBQUo7O0FBQ0EsU0FBSyxJQUFJakQsSUFBVCxJQUFpQixLQUFLc0IsWUFBdEIsRUFBb0M7QUFDaEMyQixNQUFBQSxLQUFLLEdBQUcsS0FBSzNCLFlBQUwsQ0FBa0J0QixJQUFsQixDQUFSOztBQUNBLFVBQUlKLFVBQVUsQ0FBQ3FELEtBQUssQ0FBQ1gsSUFBUCxFQUFhQSxJQUFiLENBQWQsRUFBa0M7QUFDOUI7QUFDSDtBQUNKOztBQUVELFFBQUlBLElBQUksS0FBSyxLQUFLWCxZQUFsQixFQUFnQztBQUM1QixVQUFJNEQsS0FBSixFQUFXLEtBQUs1RCxZQUFMLEdBQW9CLElBQXBCLENBQVgsS0FDSztBQUNELFlBQUksQ0FBQzZELE9BQUwsRUFBY3JGLEVBQUUsQ0FBQzJFLE1BQUgsQ0FBVSxJQUFWO0FBQ2Q7QUFDSDtBQUNKOztBQUVELFFBQUk3QixLQUFLLElBQUlBLEtBQUssQ0FBQ2YsU0FBbkIsRUFBOEI7QUFDMUIsVUFBSXFELEtBQUosRUFBVyxLQUFLOUIsSUFBTCxDQUFVUixLQUFLLENBQUNqRCxJQUFoQixFQUFYLEtBQ0s7QUFDRCxZQUFJLENBQUN3RixPQUFMLEVBQWNyRixFQUFFLENBQUMyRSxNQUFILENBQVUsSUFBVjtBQUNkO0FBQ0g7QUFDSjs7QUFFRCxTQUFLMUMsTUFBTCxHQUFjLEtBQUtBLE1BQUwsQ0FBWXFELE1BQVosQ0FBbUIsVUFBVUMsSUFBVixFQUFnQjtBQUM3QyxhQUFPLENBQUM5RixVQUFVLENBQUM4RixJQUFELEVBQU9wRCxJQUFQLENBQWxCO0FBQ0gsS0FGYSxDQUFkOztBQUlBLFFBQUlXLEtBQUosRUFBVztBQUNQLGFBQU8sS0FBSzNCLFlBQUwsQ0FBa0IyQixLQUFLLENBQUNqRCxJQUF4QixDQUFQO0FBQ0g7QUFDSixHQWhib0I7O0FBa2JyQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0kyRixFQUFBQSxNQUFNLEVBQUUsZ0JBQVUzRixJQUFWLEVBQWdCO0FBQ3BCLFNBQUs4QyxLQUFMOztBQUVBLFFBQUk5QyxJQUFKLEVBQVU7QUFDTixVQUFJaUQsS0FBSyxHQUFHLEtBQUtDLGlCQUFMLENBQXVCbEQsSUFBdkIsQ0FBWjs7QUFDQSxVQUFJaUQsS0FBSixFQUFXO0FBQ1BBLFFBQUFBLEtBQUssQ0FBQzBDLE1BQU47QUFDSDtBQUNKLEtBTEQsTUFNSztBQUNELFdBQUt0RSxTQUFMLENBQWVzRSxNQUFmO0FBQ0g7QUFDSixHQXRjb0I7O0FBeWNyQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsRUFBRSxFQUFFLFlBQVVoRSxJQUFWLEVBQWdCaUUsUUFBaEIsRUFBMEJDLE1BQTFCLEVBQWtDQyxVQUFsQyxFQUE4QztBQUM5QyxTQUFLakQsS0FBTDs7QUFFQSxRQUFJa0QsR0FBRyxHQUFHLEtBQUtDLGNBQUwsQ0FBb0JyRSxJQUFwQixFQUEwQmlFLFFBQTFCLEVBQW9DQyxNQUFwQyxFQUE0Q0MsVUFBNUMsQ0FBVjs7QUFFQSxRQUFJbkUsSUFBSSxLQUFLLFdBQWIsRUFBMEI7QUFDdEIsVUFBSXNFLE1BQU0sR0FBRyxLQUFLNUUsWUFBbEI7O0FBQ0EsV0FBSyxJQUFJdEIsSUFBVCxJQUFpQmtHLE1BQWpCLEVBQXlCO0FBQ3JCQSxRQUFBQSxNQUFNLENBQUNsRyxJQUFELENBQU4sQ0FBYW1HLGlCQUFiLEdBQWlDLElBQWpDO0FBQ0g7QUFDSjs7QUFFRCxXQUFPSCxHQUFQO0FBQ0gsR0F2Zm9COztBQTBmckI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0lJLEVBQUFBLEdBQUcsRUFBRSxhQUFVeEUsSUFBVixFQUFnQmlFLFFBQWhCLEVBQTBCQyxNQUExQixFQUFrQ0MsVUFBbEMsRUFBOEM7QUFDL0MsU0FBS2pELEtBQUw7O0FBRUEsUUFBSWxCLElBQUksS0FBSyxXQUFiLEVBQTBCO0FBQ3RCLFVBQUlzRSxNQUFNLEdBQUcsS0FBSzVFLFlBQWxCOztBQUNBLFdBQUssSUFBSXRCLElBQVQsSUFBaUJrRyxNQUFqQixFQUF5QjtBQUNyQkEsUUFBQUEsTUFBTSxDQUFDbEcsSUFBRCxDQUFOLENBQWFtRyxpQkFBYixHQUFpQyxLQUFqQztBQUNIO0FBQ0o7O0FBRUQsU0FBS0UsZUFBTCxDQUFxQnpFLElBQXJCLEVBQTJCaUUsUUFBM0IsRUFBcUNDLE1BQXJDLEVBQTZDQyxVQUE3QztBQUNILEdBdmhCb0I7QUF5aEJyQjtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUFqRCxFQUFBQSxLQUFLLEVBQUUsaUJBQVk7QUFDZixRQUFJLEtBQUt0QixRQUFULEVBQW1CO0FBQ2Y7QUFDSDs7QUFDRCxTQUFLQSxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsU0FBS0gsU0FBTCxHQUFpQixJQUFJOUIsaUJBQUosQ0FBc0IsS0FBSytHLElBQTNCLEVBQWlDLElBQWpDLENBQWpCOztBQUNBLFNBQUtDLGFBQUw7QUFDSCxHQXZpQm9CO0FBeWlCckJBLEVBQUFBLGFBQWEsRUFBRSx5QkFBVztBQUN0QixTQUFLakYsWUFBTCxHQUFvQjNCLEVBQUUsQ0FBQzRCLFNBQUgsQ0FBYSxJQUFiLENBQXBCLENBRHNCLENBR3RCOztBQUNBLFFBQUkwQixLQUFLLEdBQUcsSUFBWjtBQUNBLFFBQUl1RCxnQkFBZ0IsR0FBRyxLQUF2Qjs7QUFDQSxTQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS3JFLE1BQUwsQ0FBWXNFLE1BQWhDLEVBQXdDLEVBQUVELENBQTFDLEVBQTZDO0FBQ3pDLFVBQUluRSxJQUFJLEdBQUcsS0FBS0YsTUFBTCxDQUFZcUUsQ0FBWixDQUFYOztBQUNBLFVBQUluRSxJQUFKLEVBQVU7QUFDTlcsUUFBQUEsS0FBSyxHQUFHLElBQUk5QyxFQUFFLENBQUNrRixjQUFQLENBQXNCL0MsSUFBdEIsQ0FBUjs7QUFFQSxZQUFJekMsU0FBSixFQUFlO0FBQ1gsZUFBS3dCLFNBQUwsQ0FBZXVELFdBQWYsQ0FBMkIzQixLQUEzQjtBQUNIOztBQUVELGFBQUszQixZQUFMLENBQWtCMkIsS0FBSyxDQUFDakQsSUFBeEIsSUFBZ0NpRCxLQUFoQzs7QUFDQSxZQUFJckQsVUFBVSxDQUFDLEtBQUsrQixZQUFOLEVBQW9CVyxJQUFwQixDQUFkLEVBQXlDO0FBQ3JDa0UsVUFBQUEsZ0JBQWdCLEdBQUd2RCxLQUFuQjtBQUNIO0FBQ0o7QUFDSjs7QUFDRCxRQUFJLEtBQUt0QixZQUFMLElBQXFCLENBQUM2RSxnQkFBMUIsRUFBNEM7QUFDeEN2RCxNQUFBQSxLQUFLLEdBQUcsSUFBSTlDLEVBQUUsQ0FBQ2tGLGNBQVAsQ0FBc0IsS0FBSzFELFlBQTNCLENBQVI7O0FBRUEsVUFBSTlCLFNBQUosRUFBZTtBQUNYLGFBQUt3QixTQUFMLENBQWV1RCxXQUFmLENBQTJCM0IsS0FBM0I7QUFDSDs7QUFFRCxXQUFLM0IsWUFBTCxDQUFrQjJCLEtBQUssQ0FBQ2pELElBQXhCLElBQWdDaUQsS0FBaEM7QUFDSDtBQUNKO0FBdmtCb0IsQ0FBVCxDQUFoQjtBQTBrQkF0QyxTQUFTLENBQUNnRyxTQUFWLENBQW9CVixjQUFwQixHQUFxQ3ZHLFdBQVcsQ0FBQ2lILFNBQVosQ0FBc0JmLEVBQTNEO0FBQ0FqRixTQUFTLENBQUNnRyxTQUFWLENBQW9CTixlQUFwQixHQUFzQzNHLFdBQVcsQ0FBQ2lILFNBQVosQ0FBc0JQLEdBQTVEO0FBRUFqRyxFQUFFLENBQUNRLFNBQUgsR0FBZWlHLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmxHLFNBQWhDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBBbmltYXRpb25BbmltYXRvciA9IHJlcXVpcmUoJy4uLy4uL2FuaW1hdGlvbi9hbmltYXRpb24tYW5pbWF0b3InKTtcbmNvbnN0IEFuaW1hdGlvbkNsaXAgPSByZXF1aXJlKCcuLi8uLi9hbmltYXRpb24vYW5pbWF0aW9uLWNsaXAnKTtcbmNvbnN0IEV2ZW50VGFyZ2V0ID0gcmVxdWlyZSgnLi4vZXZlbnQvZXZlbnQtdGFyZ2V0Jyk7XG5jb25zdCBqcyA9IHJlcXVpcmUoJy4uL3BsYXRmb3JtL2pzJyk7XG5cbmxldCBlcXVhbENsaXBzID0gQ0NfRURJVE9SID8gZnVuY3Rpb24gKGNsaXAxLCBjbGlwMikge1xuICAgIHJldHVybiBjbGlwMSA9PT0gY2xpcDIgfHwgKGNsaXAxICYmIGNsaXAyICYmIChjbGlwMS5uYW1lID09PSBjbGlwMi5uYW1lIHx8IGNsaXAxLl91dWlkID09PSBjbGlwMi5fdXVpZCkpO1xufSA6IGZ1bmN0aW9uIChjbGlwMSwgY2xpcDIpIHtcbiAgICByZXR1cm4gY2xpcDEgPT09IGNsaXAyO1xufTtcblxuLyoqXG4gKiAhI2VuIFRoZSBldmVudCB0eXBlIHN1cHBvcnRlZCBieSBBbmltYXRpb25cbiAqICEjemggQW5pbWF0aW9uIOaUr+aMgeeahOS6i+S7tuexu+Wei1xuICogQGNsYXNzIEFuaW1hdGlvbi5FdmVudFR5cGVcbiAqIEBzdGF0aWNcbiAqIEBuYW1lc3BhY2UgQW5pbWF0aW9uZFxuICovXG5sZXQgRXZlbnRUeXBlID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBFbWl0IHdoZW4gYmVnaW4gcGxheWluZyBhbmltYXRpb25cbiAgICAgKiAhI3poIOW8gOWni+aSreaUvuaXtuinpuWPkVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBQTEFZXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIFBMQVk6ICdwbGF5JyxcbiAgICAvKipcbiAgICAgKiAhI2VuIEVtaXQgd2hlbiBzdG9wIHBsYXlpbmcgYW5pbWF0aW9uXG4gICAgICogISN6aCDlgZzmraLmkq3mlL7ml7bop6blj5FcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gU1RPUFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBTVE9QOiAnc3RvcCcsXG4gICAgLyoqXG4gICAgICogISNlbiBFbWl0IHdoZW4gcGF1c2UgYW5pbWF0aW9uXG4gICAgICogISN6aCDmmoLlgZzmkq3mlL7ml7bop6blj5FcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gUEFVU0VcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgUEFVU0U6ICdwYXVzZScsXG4gICAgLyoqXG4gICAgICogISNlbiBFbWl0IHdoZW4gcmVzdW1lIGFuaW1hdGlvblxuICAgICAqICEjemgg5oGi5aSN5pKt5pS+5pe26Kem5Y+RXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IFJFU1VNRVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBSRVNVTUU6ICdyZXN1bWUnLFxuICAgIC8qKlxuICAgICAqICEjZW4gSWYgYW5pbWF0aW9uIHJlcGVhdCBjb3VudCBpcyBsYXJnZXIgdGhhbiAxLCBlbWl0IHdoZW4gYW5pbWF0aW9uIHBsYXkgdG8gdGhlIGxhc3QgZnJhbWVcbiAgICAgKiAhI3poIOWBh+WmguWKqOeUu+W+queOr+asoeaVsOWkp+S6jiAx77yM5b2T5Yqo55S75pKt5pS+5Yiw5pyA5ZCO5LiA5bin5pe26Kem5Y+RXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IExBU1RGUkFNRVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBMQVNURlJBTUU6ICdsYXN0ZnJhbWUnLFxuICAgIC8qKlxuICAgICAqICEjZW4gRW1pdCB3aGVuIGZpbmlzaCBwbGF5aW5nIGFuaW1hdGlvblxuICAgICAqICEjemgg5Yqo55S75pKt5pS+5a6M5oiQ5pe26Kem5Y+RXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEZJTklTSEVEXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIEZJTklTSEVEOiAnZmluaXNoZWQnXG59KTtcblxuLyoqXG4gKiAhI2VuIFRoZSBhbmltYXRpb24gY29tcG9uZW50IGlzIHVzZWQgdG8gcGxheSBiYWNrIGFuaW1hdGlvbnMuXG4gKlxuICogQW5pbWF0aW9uIHByb3ZpZGUgc2V2ZXJhbCBldmVudHMgdG8gcmVnaXN0ZXLvvJpcbiAqICAtIHBsYXkgOiBFbWl0IHdoZW4gYmVnaW4gcGxheWluZyBhbmltYXRpb25cbiAqICAtIHN0b3AgOiBFbWl0IHdoZW4gc3RvcCBwbGF5aW5nIGFuaW1hdGlvblxuICogIC0gcGF1c2UgOiBFbWl0IHdoZW4gcGF1c2UgYW5pbWF0aW9uXG4gKiAgLSByZXN1bWUgOiBFbWl0IHdoZW4gcmVzdW1lIGFuaW1hdGlvblxuICogIC0gbGFzdGZyYW1lIDogSWYgYW5pbWF0aW9uIHJlcGVhdCBjb3VudCBpcyBsYXJnZXIgdGhhbiAxLCBlbWl0IHdoZW4gYW5pbWF0aW9uIHBsYXkgdG8gdGhlIGxhc3QgZnJhbWVcbiAqICAtIGZpbmlzaGVkIDogRW1pdCB3aGVuIGZpbmlzaCBwbGF5aW5nIGFuaW1hdGlvblxuICpcbiAqICEjemggQW5pbWF0aW9uIOe7hOS7tueUqOS6juaSreaUvuWKqOeUu+OAglxuICpcbiAqIEFuaW1hdGlvbiDmj5DkvpvkuobkuIDns7vliJflj6/ms6jlhoznmoTkuovku7bvvJpcbiAqICAtIHBsYXkgOiDlvIDlp4vmkq3mlL7ml7ZcbiAqICAtIHN0b3AgOiDlgZzmraLmkq3mlL7ml7ZcbiAqICAtIHBhdXNlIDog5pqC5YGc5pKt5pS+5pe2XG4gKiAgLSByZXN1bWUgOiDmgaLlpI3mkq3mlL7ml7ZcbiAqICAtIGxhc3RmcmFtZSA6IOWBh+WmguWKqOeUu+W+queOr+asoeaVsOWkp+S6jiAx77yM5b2T5Yqo55S75pKt5pS+5Yiw5pyA5ZCO5LiA5bin5pe2XG4gKiAgLSBmaW5pc2hlZCA6IOWKqOeUu+aSreaUvuWujOaIkOaXtlxuICpcbiAqIEBjbGFzcyBBbmltYXRpb25cbiAqIEBleHRlbmRzIENvbXBvbmVudFxuICogQHVzZXMgRXZlbnRUYXJnZXRcbiAqL1xubGV0IEFuaW1hdGlvbiA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuQW5pbWF0aW9uJyxcbiAgICBleHRlbmRzOiByZXF1aXJlKCcuL0NDQ29tcG9uZW50JyksXG4gICAgbWl4aW5zOiBbRXZlbnRUYXJnZXRdLFxuXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50Lm90aGVycy9BbmltYXRpb24nLFxuICAgICAgICBoZWxwOiAnaTE4bjpDT01QT05FTlQuaGVscF91cmwuYW5pbWF0aW9uJyxcbiAgICAgICAgZXhlY3V0ZUluRWRpdE1vZGU6IHRydWUsXG4gICAgfSxcblxuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgRXZlbnRUeXBlXG4gICAgfSxcblxuICAgIGN0b3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuRXZlbnRUYXJnZXQuY2FsbCh0aGlzKTtcblxuICAgICAgICAvLyBUaGUgYWN0dWFsIGltcGxlbWVudCBmb3IgQW5pbWF0aW9uXG4gICAgICAgIHRoaXMuX2FuaW1hdG9yID0gbnVsbDtcblxuICAgICAgICB0aGlzLl9uYW1lVG9TdGF0ZSA9IGpzLmNyZWF0ZU1hcCh0cnVlKTtcbiAgICAgICAgdGhpcy5fZGlkSW5pdCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX2N1cnJlbnRDbGlwID0gbnVsbDtcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIF9kZWZhdWx0Q2xpcDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IEFuaW1hdGlvbkNsaXAsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gQW5pbWF0aW9uIHdpbGwgcGxheSB0aGUgZGVmYXVsdCBjbGlwIHdoZW4gc3RhcnQgZ2FtZS5cbiAgICAgICAgICogISN6aCDlnKjli77pgInoh6rliqjmkq3mlL7miJbosIPnlKggcGxheSgpIOaXtum7mOiupOaSreaUvueahOWKqOeUu+WJqui+keOAglxuICAgICAgICAgKiBAcHJvcGVydHkgZGVmYXVsdENsaXBcbiAgICAgICAgICogQHR5cGUge0FuaW1hdGlvbkNsaXB9XG4gICAgICAgICAqL1xuICAgICAgICBkZWZhdWx0Q2xpcDoge1xuICAgICAgICAgICAgdHlwZTogQW5pbWF0aW9uQ2xpcCxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9kZWZhdWx0Q2xpcDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICghQ0NfRURJVE9SIHx8IChjYy5lbmdpbmUgJiYgY2MuZW5naW5lLmlzUGxheWluZykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuX2RlZmF1bHRDbGlwID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgY29udGFpbiA9IHRoaXMuX2NsaXBzLmZpbmRJbmRleCgoY2xpcCkgPT4gZXF1YWxDbGlwcyhjbGlwLCB2YWx1ZSkpID49IDA7XG4gICAgICAgICAgICAgICAgaWYgKCFjb250YWluKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2xpcCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuYW5pbWF0aW9uLmRlZmF1bHRfY2xpcCdcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBDdXJyZW50IHBsYXllZCBjbGlwLlxuICAgICAgICAgKiAhI3poIOW9k+WJjeaSreaUvueahOWKqOeUu+WJqui+keOAglxuICAgICAgICAgKiBAcHJvcGVydHkgY3VycmVudENsaXBcbiAgICAgICAgICogQHR5cGUge0FuaW1hdGlvbkNsaXB9XG4gICAgICAgICAqL1xuICAgICAgICBjdXJyZW50Q2xpcDoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRDbGlwO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudENsaXAgPSB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBBbmltYXRpb25DbGlwLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBUaGlzIHByb3BlcnR5IGlzIHVzZWQgdG8gd2F0Y2ggY2xpcCBjaGFuZ2VzIGluIGVkaXRvci5cbiAgICAgICAgLy8gRG9uJ3QgdXNlIGluIHlvdXIgZ2FtZSwgdXNlIGFkZENsaXAvcmVtb3ZlQ2xpcCBpbnN0ZWFkLlxuICAgICAgICBfd3JpdGFibGVDbGlwczoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2xpcHM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kaWRJbml0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2xpcHMgPSB2YWw7XG4gICAgICAgICAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IFtBbmltYXRpb25DbGlwXSxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBBbGwgdGhlIGNsaXBzIHVzZWQgaW4gdGhpcyBhbmltYXRpb24uXG4gICAgICAgICAqICEjemgg6YCa6L+H6ISa5pys5Y+v5Lul6K6/6Zeu5bm25pKt5pS+55qEIEFuaW1hdGlvbkNsaXAg5YiX6KGo44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBfY2xpcHNcbiAgICAgICAgICogQHR5cGUge0FuaW1hdGlvbkNsaXBbXX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF9jbGlwczoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBbQW5pbWF0aW9uQ2xpcF0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmFuaW1hdGlvbi5jbGlwcycsXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gV2hldGhlciB0aGUgYW5pbWF0aW9uIHNob3VsZCBhdXRvIHBsYXkgdGhlIGRlZmF1bHQgY2xpcCB3aGVuIHN0YXJ0IGdhbWUuXG4gICAgICAgICAqICEjemgg5piv5ZCm5Zyo6L+Q6KGM5ri45oiP5ZCO6Ieq5Yqo5pKt5pS+6buY6K6k5Yqo55S75Ymq6L6R44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBwbGF5T25Mb2FkXG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKiBAZGVmYXVsdCB0cnVlXG4gICAgICAgICAqL1xuICAgICAgICBwbGF5T25Mb2FkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuYW5pbWF0aW9uLnBsYXlfb25fbG9hZCdcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGFydDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIUNDX0VESVRPUiAmJiB0aGlzLnBsYXlPbkxvYWQgJiYgdGhpcy5fZGVmYXVsdENsaXApIHtcbiAgICAgICAgICAgIGxldCBpc1BsYXlpbmcgPSB0aGlzLl9hbmltYXRvciAmJiB0aGlzLl9hbmltYXRvci5pc1BsYXlpbmc7XG4gICAgICAgICAgICBpZiAoIWlzUGxheWluZykge1xuICAgICAgICAgICAgICAgIGxldCBzdGF0ZSA9IHRoaXMuZ2V0QW5pbWF0aW9uU3RhdGUodGhpcy5fZGVmYXVsdENsaXAubmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYW5pbWF0b3IucGxheVN0YXRlKHN0YXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkVuYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fYW5pbWF0b3IpIHtcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hdG9yLnJlc3VtZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fYW5pbWF0b3IpIHtcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hdG9yLnBhdXNlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgIH0sXG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gUHVibGljIE1ldGhvZHNcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldCBhbGwgdGhlIGNsaXBzIHVzZWQgaW4gdGhpcyBhbmltYXRpb24uXG4gICAgICogISN6aCDojrflj5bliqjnlLvnu4Tku7bkuIrnmoTmiYDmnInliqjnlLvliarovpHjgIJcbiAgICAgKiBAbWV0aG9kIGdldENsaXBzXG4gICAgICogQHJldHVybiB7QW5pbWF0aW9uQ2xpcFtdfVxuICAgICAqL1xuICAgIGdldENsaXBzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jbGlwcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBQbGF5cyBhbiBhbmltYXRpb24gYW5kIHN0b3Agb3RoZXIgYW5pbWF0aW9ucy5cbiAgICAgKiAhI3poIOaSreaUvuaMh+WumueahOWKqOeUu++8jOW5tuS4lOWBnOatouW9k+WJjeato+WcqOaSreaUvuWKqOeUu+OAguWmguaenOayoeacieaMh+WumuWKqOeUu++8jOWImeaSreaUvum7mOiupOWKqOeUu+OAglxuICAgICAqIEBtZXRob2QgcGxheVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbbmFtZV0gLSBUaGUgbmFtZSBvZiBhbmltYXRpb24gdG8gcGxheS4gSWYgbm8gbmFtZSBpcyBzdXBwbGllZCB0aGVuIHRoZSBkZWZhdWx0IGFuaW1hdGlvbiB3aWxsIGJlIHBsYXllZC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3N0YXJ0VGltZV0gLSBwbGF5IGFuIGFuaW1hdGlvbiBmcm9tIHN0YXJ0VGltZVxuICAgICAqIEByZXR1cm4ge0FuaW1hdGlvblN0YXRlfSAtIFRoZSBBbmltYXRpb25TdGF0ZSBvZiBwbGF5aW5nIGFuaW1hdGlvbi4gSW4gY2FzZXMgd2hlcmUgdGhlIGFuaW1hdGlvbiBjYW4ndCBiZSBwbGF5ZWQgKGllLCB0aGVyZSBpcyBubyBkZWZhdWx0IGFuaW1hdGlvbiBvciBubyBhbmltYXRpb24gd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUpLCB0aGUgZnVuY3Rpb24gd2lsbCByZXR1cm4gbnVsbC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBhbmltQ3RybCA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgKiBhbmltQ3RybC5wbGF5KFwibGluZWFyXCIpO1xuICAgICAqL1xuICAgIHBsYXk6IGZ1bmN0aW9uIChuYW1lLCBzdGFydFRpbWUpIHtcbiAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5wbGF5QWRkaXRpdmUobmFtZSwgc3RhcnRUaW1lKTtcbiAgICAgICAgdGhpcy5fYW5pbWF0b3Iuc3RvcFN0YXRlc0V4Y2VwdChzdGF0ZSk7XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFBsYXlzIGFuIGFkZGl0aXZlIGFuaW1hdGlvbiwgaXQgd2lsbCBub3Qgc3RvcCBvdGhlciBhbmltYXRpb25zLlxuICAgICAqIElmIHRoZXJlIGFyZSBvdGhlciBhbmltYXRpb25zIHBsYXlpbmcsIHRoZW4gd2lsbCBwbGF5IHNldmVyYWwgYW5pbWF0aW9ucyBhdCB0aGUgc2FtZSB0aW1lLlxuICAgICAqICEjemgg5pKt5pS+5oyH5a6a55qE5Yqo55S777yI5bCG5LiN5Lya5YGc5q2i5b2T5YmN5pKt5pS+55qE5Yqo55S777yJ44CC5aaC5p6c5rKh5pyJ5oyH5a6a5Yqo55S777yM5YiZ5pKt5pS+6buY6K6k5Yqo55S744CCXG4gICAgICogQG1ldGhvZCBwbGF5QWRkaXRpdmVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW25hbWVdIC0gVGhlIG5hbWUgb2YgYW5pbWF0aW9uIHRvIHBsYXkuIElmIG5vIG5hbWUgaXMgc3VwcGxpZWQgdGhlbiB0aGUgZGVmYXVsdCBhbmltYXRpb24gd2lsbCBiZSBwbGF5ZWQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtzdGFydFRpbWVdIC0gcGxheSBhbiBhbmltYXRpb24gZnJvbSBzdGFydFRpbWVcbiAgICAgKiBAcmV0dXJuIHtBbmltYXRpb25TdGF0ZX0gLSBUaGUgQW5pbWF0aW9uU3RhdGUgb2YgcGxheWluZyBhbmltYXRpb24uIEluIGNhc2VzIHdoZXJlIHRoZSBhbmltYXRpb24gY2FuJ3QgYmUgcGxheWVkIChpZSwgdGhlcmUgaXMgbm8gZGVmYXVsdCBhbmltYXRpb24gb3Igbm8gYW5pbWF0aW9uIHdpdGggdGhlIHNwZWNpZmllZCBuYW1lKSwgdGhlIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIG51bGwuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyBsaW5lYXJfMSBhbmQgbGluZWFyXzIgYXQgdGhlIHNhbWUgdGltZSBwbGF5aW5nLlxuICAgICAqIHZhciBhbmltQ3RybCA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgKiBhbmltQ3RybC5wbGF5QWRkaXRpdmUoXCJsaW5lYXJfMVwiKTtcbiAgICAgKiBhbmltQ3RybC5wbGF5QWRkaXRpdmUoXCJsaW5lYXJfMlwiKTtcbiAgICAgKi9cbiAgICBwbGF5QWRkaXRpdmU6IGZ1bmN0aW9uIChuYW1lLCBzdGFydFRpbWUpIHtcbiAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLmdldEFuaW1hdGlvblN0YXRlKG5hbWUgfHwgKHRoaXMuX2RlZmF1bHRDbGlwICYmIHRoaXMuX2RlZmF1bHRDbGlwLm5hbWUpKTtcblxuICAgICAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIGxldCBhbmltYXRvciA9IHRoaXMuX2FuaW1hdG9yO1xuICAgICAgICAgICAgaWYgKGFuaW1hdG9yLmlzUGxheWluZyAmJiBzdGF0ZS5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUuaXNQYXVzZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IucmVzdW1lU3RhdGUoc3RhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3Iuc3RvcFN0YXRlKHN0YXRlKTtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IucGxheVN0YXRlKHN0YXRlLCBzdGFydFRpbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFuaW1hdG9yLnBsYXlTdGF0ZShzdGF0ZSwgc3RhcnRUaW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQW5pbWF0aW9uIGNhbm5vdCBiZSBwbGF5ZWQgd2hlbiB0aGUgY29tcG9uZW50IGlzIG5vdCBlbmFibGVkSW5IaWVyYXJjaHkuXG4gICAgICAgICAgICAvLyBUaGF0IHdvdWxkIGNhdXNlIGFuIGVycm9yIGZvciB0aGUgYW5pbWF0aW9uIGxvc3QgdGhlIHJlZmVyZW5jZSBhZnRlciBkZXN0cm95aW5nIHRoZSBub2RlLlxuICAgICAgICAgICAgLy8gSWYgdXNlcnMgcGxheSB0aGUgYW5pbWF0aW9uIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBub3QgZW5hYmxlZEluSGllcmFyY2h5LFxuICAgICAgICAgICAgLy8gd2UgcGF1c2UgdGhlIGFuaW1hdG9yIGhlcmUgc28gdGhhdCBpdCB3aWxsIGF1dG9tYXRpY2FsbHkgcmVzdW1lIHRoZSBhbmltYXRpb24gd2hlbiB1c2VycyBlbmFibGUgdGhlIGNvbXBvbmVudC5cbiAgICAgICAgICAgIGlmICghdGhpcy5lbmFibGVkSW5IaWVyYXJjaHkpIHtcbiAgICAgICAgICAgICAgICBhbmltYXRvci5wYXVzZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDbGlwID0gc3RhdGUuY2xpcDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU3RvcHMgYW4gYW5pbWF0aW9uIG5hbWVkIG5hbWUuIElmIG5vIG5hbWUgaXMgc3VwcGxpZWQgdGhlbiBzdG9wcyBhbGwgcGxheWluZyBhbmltYXRpb25zIHRoYXQgd2VyZSBzdGFydGVkIHdpdGggdGhpcyBBbmltYXRpb24uIDxici8+XG4gICAgICogU3RvcHBpbmcgYW4gYW5pbWF0aW9uIGFsc28gUmV3aW5kcyBpdCB0byB0aGUgU3RhcnQuXG4gICAgICogISN6aCDlgZzmraLmjIflrprnmoTliqjnlLvjgILlpoLmnpzmsqHmnInmjIflrprlkI3lrZfvvIzliJnlgZzmraLlvZPliY3mraPlnKjmkq3mlL7nmoTliqjnlLvjgIJcbiAgICAgKiBAbWV0aG9kIHN0b3BcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW25hbWVdIC0gVGhlIGFuaW1hdGlvbiB0byBzdG9wLCBpZiBub3Qgc3VwcGxpZWQgdGhlbiBzdG9wcyBhbGwgcGxheWluZyBhbmltYXRpb25zLlxuICAgICAqL1xuICAgIHN0b3A6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIGlmICghdGhpcy5fZGlkSW5pdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLl9uYW1lVG9TdGF0ZVtuYW1lXTtcbiAgICAgICAgICAgIGlmIChzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FuaW1hdG9yLnN0b3BTdGF0ZShzdGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9hbmltYXRvci5zdG9wKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXVzZXMgYW4gYW5pbWF0aW9uIG5hbWVkIG5hbWUuIElmIG5vIG5hbWUgaXMgc3VwcGxpZWQgdGhlbiBwYXVzZXMgYWxsIHBsYXlpbmcgYW5pbWF0aW9ucyB0aGF0IHdlcmUgc3RhcnRlZCB3aXRoIHRoaXMgQW5pbWF0aW9uLlxuICAgICAqICEjemgg5pqC5YGc5b2T5YmN5oiW6ICF5oyH5a6a55qE5Yqo55S744CC5aaC5p6c5rKh5pyJ5oyH5a6a5ZCN5a2X77yM5YiZ5pqC5YGc5b2T5YmN5q2j5Zyo5pKt5pS+55qE5Yqo55S744CCXG4gICAgICogQG1ldGhvZCBwYXVzZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbbmFtZV0gLSBUaGUgYW5pbWF0aW9uIHRvIHBhdXNlcywgaWYgbm90IHN1cHBsaWVkIHRoZW4gcGF1c2VzIGFsbCBwbGF5aW5nIGFuaW1hdGlvbnMuXG4gICAgICovXG4gICAgcGF1c2U6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIGlmICghdGhpcy5fZGlkSW5pdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLl9uYW1lVG9TdGF0ZVtuYW1lXTtcbiAgICAgICAgICAgIGlmIChzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FuaW1hdG9yLnBhdXNlU3RhdGUoc3RhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbmFibGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXN1bWVzIGFuIGFuaW1hdGlvbiBuYW1lZCBuYW1lLiBJZiBubyBuYW1lIGlzIHN1cHBsaWVkIHRoZW4gcmVzdW1lcyBhbGwgcGF1c2VkIGFuaW1hdGlvbnMgdGhhdCB3ZXJlIHN0YXJ0ZWQgd2l0aCB0aGlzIEFuaW1hdGlvbi5cbiAgICAgKiAhI3poIOmHjeaWsOaSreaUvuaMh+WumueahOWKqOeUu++8jOWmguaenOayoeacieaMh+WumuWQjeWtl++8jOWImemHjeaWsOaSreaUvuW9k+WJjeato+WcqOaSreaUvueahOWKqOeUu+OAglxuICAgICAqIEBtZXRob2QgcmVzdW1lXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtuYW1lXSAtIFRoZSBhbmltYXRpb24gdG8gcmVzdW1lcywgaWYgbm90IHN1cHBsaWVkIHRoZW4gcmVzdW1lcyBhbGwgcGF1c2VkIGFuaW1hdGlvbnMuXG4gICAgICovXG4gICAgcmVzdW1lOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICBpZiAoIXRoaXMuX2RpZEluaXQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmFtZSkge1xuICAgICAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5nZXRBbmltYXRpb25TdGF0ZShuYW1lKTtcbiAgICAgICAgICAgIGlmIChzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FuaW1hdG9yLnJlc3VtZVN0YXRlKHN0YXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBNYWtlIGFuIGFuaW1hdGlvbiBuYW1lZCBuYW1lIGdvIHRvIHRoZSBzcGVjaWZpZWQgdGltZS4gSWYgbm8gbmFtZSBpcyBzdXBwbGllZCB0aGVuIG1ha2UgYWxsIGFuaW1hdGlvbnMgZ28gdG8gdGhlIHNwZWNpZmllZCB0aW1lLlxuICAgICAqICEjemgg6K6+572u5oyH5a6a5Yqo55S755qE5pKt5pS+5pe26Ze044CC5aaC5p6c5rKh5pyJ5oyH5a6a5ZCN5a2X77yM5YiZ6K6+572u5b2T5YmN5pKt5pS+5Yqo55S755qE5pKt5pS+5pe26Ze044CCXG4gICAgICogQG1ldGhvZCBzZXRDdXJyZW50VGltZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbdGltZV0gLSBUaGUgdGltZSB0byBnbyB0b1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbbmFtZV0gLSBTcGVjaWZpZWQgYW5pbWF0aW9uIG5hbWUsIGlmIG5vdCBzdXBwbGllZCB0aGVuIG1ha2UgYWxsIGFuaW1hdGlvbnMgZ28gdG8gdGhlIHRpbWUuXG4gICAgICovXG4gICAgc2V0Q3VycmVudFRpbWU6IGZ1bmN0aW9uICh0aW1lLCBuYW1lKSB7XG4gICAgICAgIHRoaXMuX2luaXQoKTtcbiAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgIGxldCBzdGF0ZSA9IHRoaXMuZ2V0QW5pbWF0aW9uU3RhdGUobmFtZSk7XG4gICAgICAgICAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hbmltYXRvci5zZXRTdGF0ZVRpbWUoc3RhdGUsIHRpbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fYW5pbWF0b3Iuc2V0U3RhdGVUaW1lKHRpbWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgYW5pbWF0aW9uIHN0YXRlIG5hbWVkIG5hbWUuIElmIG5vIGFuaW1hdGlvbiB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZSwgdGhlIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIG51bGwuXG4gICAgICogISN6aCDojrflj5blvZPliY3miJbogIXmjIflrprnmoTliqjnlLvnirbmgIHvvIzlpoLmnpzmnKrmib7liLDmjIflrprliqjnlLvliarovpHliJnov5Tlm54gbnVsbOOAglxuICAgICAqIEBtZXRob2QgZ2V0QW5pbWF0aW9uU3RhdGVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgICAqIEByZXR1cm4ge0FuaW1hdGlvblN0YXRlfVxuICAgICAqL1xuICAgIGdldEFuaW1hdGlvblN0YXRlOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICB0aGlzLl9pbml0KCk7XG4gICAgICAgIGxldCBzdGF0ZSA9IHRoaXMuX25hbWVUb1N0YXRlW25hbWVdO1xuXG4gICAgICAgIGlmIChDQ19FRElUT1IgJiYgKCFzdGF0ZSB8fCAhY2MuanMuYXJyYXkuY29udGFpbnModGhpcy5fY2xpcHMsIHN0YXRlLmNsaXApKSkge1xuICAgICAgICAgICAgdGhpcy5fZGlkSW5pdCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fYW5pbWF0b3IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hbmltYXRvci5zdG9wKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2luaXQoKTtcbiAgICAgICAgICAgIHN0YXRlID0gdGhpcy5fbmFtZVRvU3RhdGVbbmFtZV07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RhdGUgJiYgIXN0YXRlLmN1cnZlTG9hZGVkKSB7XG4gICAgICAgICAgICB0aGlzLl9hbmltYXRvci5fcmVsb2FkQ2xpcChzdGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RhdGUgfHwgbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBBZGRzIGEgY2xpcCB0byB0aGUgYW5pbWF0aW9uIHdpdGggbmFtZSBuZXdOYW1lLiBJZiBhIGNsaXAgd2l0aCB0aGF0IG5hbWUgYWxyZWFkeSBleGlzdHMgaXQgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSBuZXcgY2xpcC5cbiAgICAgKiAhI3poIOa3u+WKoOWKqOeUu+WJqui+ke+8jOW5tuS4lOWPr+S7pemHjeaWsOiuvue9ruivpeWKqOeUu+WJqui+keeahOWQjeensOOAglxuICAgICAqIEBtZXRob2QgYWRkQ2xpcFxuICAgICAqIEBwYXJhbSB7QW5pbWF0aW9uQ2xpcH0gY2xpcCAtIHRoZSBjbGlwIHRvIGFkZFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbbmV3TmFtZV1cbiAgICAgKiBAcmV0dXJuIHtBbmltYXRpb25TdGF0ZX0gLSBUaGUgQW5pbWF0aW9uU3RhdGUgd2hpY2ggZ2l2ZXMgZnVsbCBjb250cm9sIG92ZXIgdGhlIGFuaW1hdGlvbiBjbGlwLlxuICAgICAqL1xuICAgIGFkZENsaXA6IGZ1bmN0aW9uIChjbGlwLCBuZXdOYW1lKSB7XG4gICAgICAgIGlmICghY2xpcCkge1xuICAgICAgICAgICAgY2Mud2FybklEKDM5MDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2luaXQoKTtcblxuICAgICAgICAvLyBhZGQgY2xpcFxuICAgICAgICBpZiAoIWNjLmpzLmFycmF5LmNvbnRhaW5zKHRoaXMuX2NsaXBzLCBjbGlwKSkge1xuICAgICAgICAgICAgdGhpcy5fY2xpcHMucHVzaChjbGlwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlcGxhY2Ugc2FtZSBuYW1lIGNsaXBcbiAgICAgICAgbmV3TmFtZSA9IG5ld05hbWUgfHwgY2xpcC5uYW1lO1xuICAgICAgICBsZXQgb2xkU3RhdGUgPSB0aGlzLl9uYW1lVG9TdGF0ZVtuZXdOYW1lXTtcbiAgICAgICAgaWYgKG9sZFN0YXRlKSB7XG4gICAgICAgICAgICBpZiAob2xkU3RhdGUuY2xpcCA9PT0gY2xpcCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvbGRTdGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuX2NsaXBzLmluZGV4T2Yob2xkU3RhdGUuY2xpcCk7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jbGlwcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlcGxhY2Ugc3RhdGVcbiAgICAgICAgbGV0IG5ld1N0YXRlID0gbmV3IGNjLkFuaW1hdGlvblN0YXRlKGNsaXAsIG5ld05hbWUpO1xuICAgICAgICB0aGlzLl9uYW1lVG9TdGF0ZVtuZXdOYW1lXSA9IG5ld1N0YXRlO1xuICAgICAgICByZXR1cm4gbmV3U3RhdGU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZW1vdmUgY2xpcCBmcm9tIHRoZSBhbmltYXRpb24gbGlzdC4gVGhpcyB3aWxsIHJlbW92ZSB0aGUgY2xpcCBhbmQgYW55IGFuaW1hdGlvbiBzdGF0ZXMgYmFzZWQgb24gaXQuXG4gICAgICogSWYgdGhlcmUgYXJlIGFuaW1hdGlvbiBzdGF0ZXMgZGVwYW5kIG9uIHRoZSBjbGlwIGFyZSBwbGF5aW5nIG9yIGNsaXAgaXMgZGVmYXVsdENsaXAsIGl0IHdpbGwgbm90IGRlbGV0ZSB0aGUgY2xpcC5cbiAgICAgKiBCdXQgaWYgZm9yY2UgaXMgdHJ1ZSwgdGhlbiB3aWxsIGFsd2F5cyByZW1vdmUgdGhlIGNsaXAgYW5kIGFueSBhbmltYXRpb24gc3RhdGVzIGJhc2VkIG9uIGl0LiBJZiBjbGlwIGlzIGRlZmF1bHRDbGlwLCBkZWZhdWx0Q2xpcCB3aWxsIGJlIHJlc2V0IHRvIG51bGxcbiAgICAgKiAhI3poXG4gICAgICog5LuO5Yqo55S75YiX6KGo5Lit56e76Zmk5oyH5a6a55qE5Yqo55S75Ymq6L6R77yMPGJyLz5cbiAgICAgKiDlpoLmnpzkvp3otZbkuo4gY2xpcCDnmoQgQW5pbWF0aW9uU3RhdGUg5q2j5Zyo5pKt5pS+5oiW6ICFIGNsaXAg5pivIGRlZmF1bHRDbGlwIOeahOivne+8jOm7mOiupOaYr+S4jeS8muWIoOmZpCBjbGlwIOeahOOAglxuICAgICAqIOS9huaYr+WmguaenCBmb3JjZSDlj4LmlbDkuLogdHJ1Ze+8jOWImeS8muW8uuWItuWBnOatouivpeWKqOeUu++8jOeEtuWQjuenu+mZpOivpeWKqOeUu+WJqui+keWSjOebuOWFs+eahOWKqOeUu+OAgui/meaXtuWAmeWmguaenCBjbGlwIOaYryBkZWZhdWx0Q2xpcO+8jGRlZmF1bHRDbGlwIOWwhuS8muiiq+mHjee9ruS4uiBudWxs44CCXG4gICAgICogQG1ldGhvZCByZW1vdmVDbGlwXG4gICAgICogQHBhcmFtIHtBbmltYXRpb25DbGlwfSBjbGlwXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbZm9yY2U9ZmFsc2VdIC0gSWYgZm9yY2UgaXMgdHJ1ZSwgdGhlbiB3aWxsIGFsd2F5cyByZW1vdmUgdGhlIGNsaXAgYW5kIGFueSBhbmltYXRpb24gc3RhdGVzIGJhc2VkIG9uIGl0LlxuICAgICAqL1xuICAgIHJlbW92ZUNsaXA6IGZ1bmN0aW9uIChjbGlwLCBmb3JjZSkge1xuICAgICAgICBpZiAoIWNsaXApIHtcbiAgICAgICAgICAgIGNjLndhcm5JRCgzOTAxKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9pbml0KCk7XG5cbiAgICAgICAgbGV0IHN0YXRlO1xuICAgICAgICBmb3IgKGxldCBuYW1lIGluIHRoaXMuX25hbWVUb1N0YXRlKSB7XG4gICAgICAgICAgICBzdGF0ZSA9IHRoaXMuX25hbWVUb1N0YXRlW25hbWVdO1xuICAgICAgICAgICAgaWYgKGVxdWFsQ2xpcHMoc3RhdGUuY2xpcCwgY2xpcCkpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGlwID09PSB0aGlzLl9kZWZhdWx0Q2xpcCkge1xuICAgICAgICAgICAgaWYgKGZvcmNlKSB0aGlzLl9kZWZhdWx0Q2xpcCA9IG51bGw7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIUNDX1RFU1QpIGNjLndhcm5JRCgzOTAyKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RhdGUgJiYgc3RhdGUuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICBpZiAoZm9yY2UpIHRoaXMuc3RvcChzdGF0ZS5uYW1lKTtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghQ0NfVEVTVCkgY2Mud2FybklEKDM5MDMpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2NsaXBzID0gdGhpcy5fY2xpcHMuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gIWVxdWFsQ2xpcHMoaXRlbSwgY2xpcCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChzdGF0ZSkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX25hbWVUb1N0YXRlW3N0YXRlLm5hbWVdO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTYW1wbGVzIGFuaW1hdGlvbnMgYXQgdGhlIGN1cnJlbnQgc3RhdGUuPGJyLz5cbiAgICAgKiBUaGlzIGlzIHVzZWZ1bCB3aGVuIHlvdSBleHBsaWNpdGx5IHdhbnQgdG8gc2V0IHVwIHNvbWUgYW5pbWF0aW9uIHN0YXRlLCBhbmQgc2FtcGxlIGl0IG9uY2UuXG4gICAgICogISN6aCDlr7nmjIflrprmiJblvZPliY3liqjnlLvov5vooYzph4fmoLfjgILkvaDlj6/ku6XmiYvliqjlsIbliqjnlLvorr7nva7liLDmn5DkuIDkuKrnirbmgIHvvIznhLblkI7ph4fmoLfkuIDmrKHjgIJcbiAgICAgKiBAbWV0aG9kIHNhbXBsZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAgICovXG4gICAgc2FtcGxlOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICB0aGlzLl9pbml0KCk7XG5cbiAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgIGxldCBzdGF0ZSA9IHRoaXMuZ2V0QW5pbWF0aW9uU3RhdGUobmFtZSk7XG4gICAgICAgICAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5zYW1wbGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hdG9yLnNhbXBsZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJlZ2lzdGVyIGFuaW1hdGlvbiBldmVudCBjYWxsYmFjay5cbiAgICAgKiBUaGUgZXZlbnQgYXJndW1lbnRzIHdpbGwgcHJvdmlkZSB0aGUgQW5pbWF0aW9uU3RhdGUgd2hpY2ggZW1pdCB0aGUgZXZlbnQuXG4gICAgICogV2hlbiBwbGF5IGFuIGFuaW1hdGlvbiwgd2lsbCBhdXRvIHJlZ2lzdGVyIHRoZSBldmVudCBjYWxsYmFjayB0byB0aGUgQW5pbWF0aW9uU3RhdGUsIGFuZCB1bnJlZ2lzdGVyIHRoZSBldmVudCBjYWxsYmFjayBmcm9tIHRoZSBBbmltYXRpb25TdGF0ZSB3aGVuIGFuaW1hdGlvbiBzdG9wcGVkLlxuICAgICAqICEjemhcbiAgICAgKiDms6jlhozliqjnlLvkuovku7blm57osIPjgIJcbiAgICAgKiDlm57osIPnmoTkuovku7bph4zlsIbkvJrpmYTkuIrlj5HpgIHkuovku7bnmoQgQW5pbWF0aW9uU3RhdGXjgIJcbiAgICAgKiDlvZPmkq3mlL7kuIDkuKrliqjnlLvml7bvvIzkvJroh6rliqjlsIbkuovku7bms6jlhozliLDlr7nlupTnmoQgQW5pbWF0aW9uU3RhdGUg5LiK77yM5YGc5q2i5pKt5pS+5pe25Lya5bCG5LqL5Lu25LuO6L+Z5LiqIEFuaW1hdGlvblN0YXRlIOS4iuWPlua2iOazqOWGjOOAglxuICAgICAqIEBtZXRob2Qgb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZXZlbnQgdHlwZSB0byBsaXN0ZW4gZm9yLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBpbnZva2VkIHdoZW4gdGhlIGV2ZW50IGlzIGRpc3BhdGNoZWQuXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgY2FsbGJhY2sgaXMgaWdub3JlZCBpZiBpdCBpcyBhIGR1cGxpY2F0ZSAodGhlIGNhbGxiYWNrcyBhcmUgdW5pcXVlKS5cbiAgICAgKiBAcGFyYW0ge2NjLkFuaW1hdGlvblN0YXRlfSBzdGF0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbdGFyZ2V0XSAtIFRoZSB0YXJnZXQgKHRoaXMgb2JqZWN0KSB0byBpbnZva2UgdGhlIGNhbGxiYWNrLCBjYW4gYmUgbnVsbFxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3VzZUNhcHR1cmU9ZmFsc2VdIC0gV2hlbiBzZXQgdG8gdHJ1ZSwgdGhlIGNhcHR1cmUgYXJndW1lbnQgcHJldmVudHMgY2FsbGJhY2tcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gYmVpbmcgaW52b2tlZCB3aGVuIHRoZSBldmVudCdzIGV2ZW50UGhhc2UgYXR0cmlidXRlIHZhbHVlIGlzIEJVQkJMSU5HX1BIQVNFLlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2hlbiBmYWxzZSwgY2FsbGJhY2sgd2lsbCBOT1QgYmUgaW52b2tlZCB3aGVuIGV2ZW50J3MgZXZlbnRQaGFzZSBhdHRyaWJ1dGUgdmFsdWUgaXMgQ0FQVFVSSU5HX1BIQVNFLlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRWl0aGVyIHdheSwgY2FsbGJhY2sgd2lsbCBiZSBpbnZva2VkIHdoZW4gZXZlbnQncyBldmVudFBoYXNlIGF0dHJpYnV0ZSB2YWx1ZSBpcyBBVF9UQVJHRVQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gLSBKdXN0IHJldHVybnMgdGhlIGluY29taW5nIGNhbGxiYWNrIHNvIHlvdSBjYW4gc2F2ZSB0aGUgYW5vbnltb3VzIGZ1bmN0aW9uIGVhc2llci5cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG9uKHR5cGU6IHN0cmluZywgY2FsbGJhY2s6IChldmVudDogRXZlbnQuRXZlbnRDdXN0b20pID0+IHZvaWQsIHRhcmdldD86IGFueSwgdXNlQ2FwdHVyZT86IGJvb2xlYW4pOiAoZXZlbnQ6IEV2ZW50LkV2ZW50Q3VzdG9tKSA9PiB2b2lkXG4gICAgICogb248VD4odHlwZTogc3RyaW5nLCBjYWxsYmFjazogKGV2ZW50OiBUKSA9PiB2b2lkLCB0YXJnZXQ/OiBhbnksIHVzZUNhcHR1cmU/OiBib29sZWFuKTogKGV2ZW50OiBUKSA9PiB2b2lkXG4gICAgICogb24odHlwZTogc3RyaW5nLCBjYWxsYmFjazogKHR5cGU6IHN0cmluZywgc3RhdGU6IGNjLkFuaW1hdGlvblN0YXRlKSA9PiB2b2lkLCB0YXJnZXQ/OiBhbnksIHVzZUNhcHR1cmU/OiBib29sZWFuKTogKHR5cGU6IHN0cmluZywgc3RhdGU6IGNjLkFuaW1hdGlvblN0YXRlKSA9PiB2b2lkXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBvblBsYXk6IGZ1bmN0aW9uICh0eXBlLCBzdGF0ZSkge1xuICAgICAqICAgICAvLyBjYWxsYmFja1xuICAgICAqIH1cbiAgICAgKlxuICAgICAqIC8vIHJlZ2lzdGVyIGV2ZW50IHRvIGFsbCBhbmltYXRpb25cbiAgICAgKiBhbmltYXRpb24ub24oJ3BsYXknLCB0aGlzLm9uUGxheSwgdGhpcyk7XG4gICAgICovXG4gICAgb246IGZ1bmN0aW9uICh0eXBlLCBjYWxsYmFjaywgdGFyZ2V0LCB1c2VDYXB0dXJlKSB7XG4gICAgICAgIHRoaXMuX2luaXQoKTtcblxuICAgICAgICBsZXQgcmV0ID0gdGhpcy5fRXZlbnRUYXJnZXRPbih0eXBlLCBjYWxsYmFjaywgdGFyZ2V0LCB1c2VDYXB0dXJlKTtcblxuICAgICAgICBpZiAodHlwZSA9PT0gJ2xhc3RmcmFtZScpIHtcbiAgICAgICAgICAgIGxldCBzdGF0ZXMgPSB0aGlzLl9uYW1lVG9TdGF0ZTtcbiAgICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gc3RhdGVzKSB7XG4gICAgICAgICAgICAgICAgc3RhdGVzW25hbWVdLl9sYXN0ZnJhbWVFdmVudE9uID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFVucmVnaXN0ZXIgYW5pbWF0aW9uIGV2ZW50IGNhbGxiYWNrLlxuICAgICAqICEjemhcbiAgICAgKiDlj5bmtojms6jlhozliqjnlLvkuovku7blm57osIPjgIJcbiAgICAgKiBAbWV0aG9kIG9mZlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBldmVudCB0eXBlIGJlaW5nIHJlbW92ZWQuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSAtIFRoZSBjYWxsYmFjayB0byByZW1vdmUuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXRdIC0gVGhlIHRhcmdldCAodGhpcyBvYmplY3QpIHRvIGludm9rZSB0aGUgY2FsbGJhY2ssIGlmIGl0J3Mgbm90IGdpdmVuLCBvbmx5IGNhbGxiYWNrIHdpdGhvdXQgdGFyZ2V0IHdpbGwgYmUgcmVtb3ZlZFxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3VzZUNhcHR1cmU9ZmFsc2VdIC0gU3BlY2lmaWVzIHdoZXRoZXIgdGhlIGNhbGxiYWNrIGJlaW5nIHJlbW92ZWQgd2FzIHJlZ2lzdGVyZWQgYXMgYSBjYXB0dXJpbmcgY2FsbGJhY2sgb3Igbm90LlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSWYgbm90IHNwZWNpZmllZCwgdXNlQ2FwdHVyZSBkZWZhdWx0cyB0byBmYWxzZS4gSWYgYSBjYWxsYmFjayB3YXMgcmVnaXN0ZXJlZCB0d2ljZSxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uZSB3aXRoIGNhcHR1cmUgYW5kIG9uZSB3aXRob3V0LCBlYWNoIG11c3QgYmUgcmVtb3ZlZCBzZXBhcmF0ZWx5LiBSZW1vdmFsIG9mIGEgY2FwdHVyaW5nIGNhbGxiYWNrXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2VzIG5vdCBhZmZlY3QgYSBub24tY2FwdHVyaW5nIHZlcnNpb24gb2YgdGhlIHNhbWUgbGlzdGVuZXIsIGFuZCB2aWNlIHZlcnNhLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyB1bnJlZ2lzdGVyIGV2ZW50IHRvIGFsbCBhbmltYXRpb25cbiAgICAgKiBhbmltYXRpb24ub2ZmKCdwbGF5JywgdGhpcy5vblBsYXksIHRoaXMpO1xuICAgICAqL1xuICAgIG9mZjogZnVuY3Rpb24gKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQsIHVzZUNhcHR1cmUpIHtcbiAgICAgICAgdGhpcy5faW5pdCgpO1xuXG4gICAgICAgIGlmICh0eXBlID09PSAnbGFzdGZyYW1lJykge1xuICAgICAgICAgICAgbGV0IHN0YXRlcyA9IHRoaXMuX25hbWVUb1N0YXRlO1xuICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBzdGF0ZXMpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZXNbbmFtZV0uX2xhc3RmcmFtZUV2ZW50T24gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX0V2ZW50VGFyZ2V0T2ZmKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQsIHVzZUNhcHR1cmUpO1xuICAgIH0sXG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gSW50ZXJuYWwgTWV0aG9kc1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIC8vIERvbnQgZm9yZ2V0IHRvIGNhbGwgX2luaXQgYmVmb3JlIGV2ZXJ5IGFjdHVhbCBwcm9jZXNzIGluIHB1YmxpYyBtZXRob2RzLlxuICAgIC8vIEp1c3QgaW52b2tpbmcgX2luaXQgYnkgb25Mb2FkIGlzIG5vdCBlbm91Z2ggYmVjYXVzZSBvbkxvYWQgaXMgY2FsbGVkIG9ubHkgaWYgdGhlIGVudGl0eSBpcyBhY3RpdmUuXG5cbiAgICBfaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fZGlkSW5pdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2RpZEluaXQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9hbmltYXRvciA9IG5ldyBBbmltYXRpb25BbmltYXRvcih0aGlzLm5vZGUsIHRoaXMpO1xuICAgICAgICB0aGlzLl9jcmVhdGVTdGF0ZXMoKTtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZVN0YXRlczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX25hbWVUb1N0YXRlID0ganMuY3JlYXRlTWFwKHRydWUpO1xuXG4gICAgICAgIC8vIGNyZWF0ZSBhbmltYXRpb24gc3RhdGVzXG4gICAgICAgIGxldCBzdGF0ZSA9IG51bGw7XG4gICAgICAgIGxldCBkZWZhdWx0Q2xpcFN0YXRlID0gZmFsc2U7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fY2xpcHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBjbGlwID0gdGhpcy5fY2xpcHNbaV07XG4gICAgICAgICAgICBpZiAoY2xpcCkge1xuICAgICAgICAgICAgICAgIHN0YXRlID0gbmV3IGNjLkFuaW1hdGlvblN0YXRlKGNsaXApO1xuXG4gICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hbmltYXRvci5fcmVsb2FkQ2xpcChzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5fbmFtZVRvU3RhdGVbc3RhdGUubmFtZV0gPSBzdGF0ZTtcbiAgICAgICAgICAgICAgICBpZiAoZXF1YWxDbGlwcyh0aGlzLl9kZWZhdWx0Q2xpcCwgY2xpcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdENsaXBTdGF0ZSA9IHN0YXRlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fZGVmYXVsdENsaXAgJiYgIWRlZmF1bHRDbGlwU3RhdGUpIHtcbiAgICAgICAgICAgIHN0YXRlID0gbmV3IGNjLkFuaW1hdGlvblN0YXRlKHRoaXMuX2RlZmF1bHRDbGlwKTtcblxuICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FuaW1hdG9yLl9yZWxvYWRDbGlwKHN0YXRlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbmFtZVRvU3RhdGVbc3RhdGUubmFtZV0gPSBzdGF0ZTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5BbmltYXRpb24ucHJvdG90eXBlLl9FdmVudFRhcmdldE9uID0gRXZlbnRUYXJnZXQucHJvdG90eXBlLm9uO1xuQW5pbWF0aW9uLnByb3RvdHlwZS5fRXZlbnRUYXJnZXRPZmYgPSBFdmVudFRhcmdldC5wcm90b3R5cGUub2ZmO1xuXG5jYy5BbmltYXRpb24gPSBtb2R1bGUuZXhwb3J0cyA9IEFuaW1hdGlvbjtcbiJdLCJzb3VyY2VSb290IjoiLyJ9