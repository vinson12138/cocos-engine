
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/actions/CCActionInterval.js';
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

/**
 * @module cc
 */

/**
 * !#en
 * <p> An interval action is an action that takes place within a certain period of time. <br/>
 * It has an start time, and a finish time. The finish time is the parameter<br/>
 * duration plus the start time.</p>
 *
 * <p>These CCActionInterval actions have some interesting properties, like:<br/>
 * - They can run normally (default)  <br/>
 * - They can run reversed with the reverse method   <br/>
 * - They can run with the time altered with the Accelerate, AccelDeccel and Speed actions. </p>
 *
 * <p>For example, you can simulate a Ping Pong effect running the action normally and<br/>
 * then running it again in Reverse mode. </p>
 * !#zh 时间间隔动作，这种动作在已定时间内完成，继承 FiniteTimeAction。
 * @class ActionInterval
 * @extends FiniteTimeAction
 * @param {Number} d duration in seconds
 */
cc.ActionInterval = cc.Class({
  name: 'cc.ActionInterval',
  "extends": cc.FiniteTimeAction,
  ctor: function ctor(d) {
    this.MAX_VALUE = 2;
    this._elapsed = 0;
    this._firstTick = false;
    this._easeList = null;
    this._speed = 1;
    this._timesForRepeat = 1;
    this._repeatForever = false;
    this._repeatMethod = false; //Compatible with repeat class, Discard after can be deleted

    this._speedMethod = false; //Compatible with repeat class, Discard after can be deleted

    d !== undefined && cc.ActionInterval.prototype.initWithDuration.call(this, d);
  },

  /*
   * How many seconds had elapsed since the actions started to run.
   * @return {Number}
   */
  getElapsed: function getElapsed() {
    return this._elapsed;
  },

  /*
   * Initializes the action.
   * @param {Number} d duration in seconds
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(d) {
    this._duration = d === 0 ? cc.macro.FLT_EPSILON : d; // prevent division by 0
    // This comparison could be in step:, but it might decrease the performance
    // by 3% in heavy based action games.

    this._elapsed = 0;
    this._firstTick = true;
    return true;
  },
  isDone: function isDone() {
    return this._elapsed >= this._duration;
  },
  _cloneDecoration: function _cloneDecoration(action) {
    action._repeatForever = this._repeatForever;
    action._speed = this._speed;
    action._timesForRepeat = this._timesForRepeat;
    action._easeList = this._easeList;
    action._speedMethod = this._speedMethod;
    action._repeatMethod = this._repeatMethod;
  },
  _reverseEaseList: function _reverseEaseList(action) {
    if (this._easeList) {
      action._easeList = [];

      for (var i = 0; i < this._easeList.length; i++) {
        action._easeList.push(this._easeList[i].reverse());
      }
    }
  },
  clone: function clone() {
    var action = new cc.ActionInterval(this._duration);

    this._cloneDecoration(action);

    return action;
  },

  /**
   * !#en Implementation of ease motion.
   * !#zh 缓动运动。
   * @method easing
   * @param {Object} easeObj
   * @returns {ActionInterval}
   * @example
   * action.easing(cc.easeIn(3.0));
   */
  easing: function easing(easeObj) {
    if (this._easeList) this._easeList.length = 0;else this._easeList = [];

    for (var i = 0; i < arguments.length; i++) {
      this._easeList.push(arguments[i]);
    }

    return this;
  },
  _computeEaseTime: function _computeEaseTime(dt) {
    var locList = this._easeList;
    if (!locList || locList.length === 0) return dt;

    for (var i = 0, n = locList.length; i < n; i++) {
      dt = locList[i].easing(dt);
    }

    return dt;
  },
  step: function step(dt) {
    if (this._firstTick) {
      this._firstTick = false;
      this._elapsed = 0;
    } else this._elapsed += dt; //this.update((1 > (this._elapsed / this._duration)) ? this._elapsed / this._duration : 1);
    //this.update(Math.max(0, Math.min(1, this._elapsed / Math.max(this._duration, cc.macro.FLT_EPSILON))));


    var t = this._elapsed / (this._duration > 0.0000001192092896 ? this._duration : 0.0000001192092896);
    t = 1 > t ? t : 1;
    this.update(t > 0 ? t : 0); //Compatible with repeat class, Discard after can be deleted (this._repeatMethod)

    if (this._repeatMethod && this._timesForRepeat > 1 && this.isDone()) {
      if (!this._repeatForever) {
        this._timesForRepeat--;
      } //var diff = locInnerAction.getElapsed() - locInnerAction._duration;


      this.startWithTarget(this.target); // to prevent jerk. issue #390 ,1247
      //this._innerAction.step(0);
      //this._innerAction.step(diff);

      this.step(this._elapsed - this._duration);
    }
  },
  startWithTarget: function startWithTarget(target) {
    cc.Action.prototype.startWithTarget.call(this, target);
    this._elapsed = 0;
    this._firstTick = true;
  },
  reverse: function reverse() {
    cc.logID(1010);
    return null;
  },

  /*
   * Set amplitude rate.
   * @warning It should be overridden in subclass.
   * @param {Number} amp
   */
  setAmplitudeRate: function setAmplitudeRate(amp) {
    // Abstract class needs implementation
    cc.logID(1011);
  },

  /*
   * Get amplitude rate.
   * @warning It should be overridden in subclass.
   * @return {Number} 0
   */
  getAmplitudeRate: function getAmplitudeRate() {
    // Abstract class needs implementation
    cc.logID(1012);
    return 0;
  },

  /**
   * !#en
   * Changes the speed of an action, making it take longer (speed>1)
   * or less (speed<1) time. <br/>
   * Useful to simulate 'slow motion' or 'fast forward' effect.
   * !#zh
   * 改变一个动作的速度，使它的执行使用更长的时间（speed > 1）<br/>
   * 或更少（speed < 1）可以有效得模拟“慢动作”或“快进”的效果。
   * @param {Number} speed
   * @returns {Action}
   */
  speed: function speed(_speed) {
    if (_speed <= 0) {
      cc.logID(1013);
      return this;
    }

    this._speedMethod = true; //Compatible with repeat class, Discard after can be deleted

    this._speed *= _speed;
    return this;
  },

  /**
   * Get this action speed.
   * @return {Number}
   */
  getSpeed: function getSpeed() {
    return this._speed;
  },

  /**
   * Set this action speed.
   * @param {Number} speed
   * @returns {ActionInterval}
   */
  setSpeed: function setSpeed(speed) {
    this._speed = speed;
    return this;
  },

  /**
   * !#en
   * Repeats an action a number of times.
   * To repeat an action forever use the CCRepeatForever action.
   * !#zh 重复动作可以按一定次数重复一个动作，使用 RepeatForever 动作来永远重复一个动作。
   * @method repeat
   * @param {Number} times
   * @returns {ActionInterval}
   */
  repeat: function repeat(times) {
    times = Math.round(times);

    if (isNaN(times) || times < 1) {
      cc.logID(1014);
      return this;
    }

    this._repeatMethod = true; //Compatible with repeat class, Discard after can be deleted

    this._timesForRepeat *= times;
    return this;
  },

  /**
   * !#en
   * Repeats an action for ever.  <br/>
   * To repeat the an action for a limited number of times use the Repeat action. <br/>
   * !#zh 永远地重复一个动作，有限次数内重复一个动作请使用 Repeat 动作。
   * @method repeatForever
   * @returns {ActionInterval}
   */
  repeatForever: function repeatForever() {
    this._repeatMethod = true; //Compatible with repeat class, Discard after can be deleted

    this._timesForRepeat = this.MAX_VALUE;
    this._repeatForever = true;
    return this;
  }
});

cc.actionInterval = function (d) {
  return new cc.ActionInterval(d);
};
/**
 * @module cc
 */

/*
 * Runs actions sequentially, one after another.
 * @class Sequence
 * @extends ActionInterval
 * @param {Array|FiniteTimeAction} tempArray
 * @example
 * // create sequence with actions
 * var seq = new cc.Sequence(act1, act2);
 *
 * // create sequence with array
 * var seq = new cc.Sequence(actArray);
 */


cc.Sequence = cc.Class({
  name: 'cc.Sequence',
  "extends": cc.ActionInterval,
  ctor: function ctor(tempArray) {
    this._actions = [];
    this._split = null;
    this._last = 0;
    this._reversed = false;
    var paramArray = tempArray instanceof Array ? tempArray : arguments;

    if (paramArray.length === 1) {
      cc.errorID(1019);
      return;
    }

    var last = paramArray.length - 1;
    if (last >= 0 && paramArray[last] == null) cc.logID(1015);

    if (last >= 0) {
      var prev = paramArray[0],
          action1;

      for (var i = 1; i < last; i++) {
        if (paramArray[i]) {
          action1 = prev;
          prev = cc.Sequence._actionOneTwo(action1, paramArray[i]);
        }
      }

      this.initWithTwoActions(prev, paramArray[last]);
    }
  },

  /*
   * Initializes the action <br/>
   * @param {FiniteTimeAction} actionOne
   * @param {FiniteTimeAction} actionTwo
   * @return {Boolean}
   */
  initWithTwoActions: function initWithTwoActions(actionOne, actionTwo) {
    if (!actionOne || !actionTwo) {
      cc.errorID(1025);
      return false;
    }

    var durationOne = actionOne._duration,
        durationTwo = actionTwo._duration;
    durationOne *= actionOne._repeatMethod ? actionOne._timesForRepeat : 1;
    durationTwo *= actionTwo._repeatMethod ? actionTwo._timesForRepeat : 1;
    var d = durationOne + durationTwo;
    this.initWithDuration(d);
    this._actions[0] = actionOne;
    this._actions[1] = actionTwo;
    return true;
  },
  clone: function clone() {
    var action = new cc.Sequence();

    this._cloneDecoration(action);

    action.initWithTwoActions(this._actions[0].clone(), this._actions[1].clone());
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    this._split = this._actions[0]._duration / this._duration;
    this._split *= this._actions[0]._repeatMethod ? this._actions[0]._timesForRepeat : 1;
    this._last = -1;
  },
  stop: function stop() {
    // Issue #1305
    if (this._last !== -1) this._actions[this._last].stop();
    cc.Action.prototype.stop.call(this);
  },
  update: function update(dt) {
    var new_t,
        found = 0;
    var locSplit = this._split,
        locActions = this._actions,
        locLast = this._last,
        actionFound;
    dt = this._computeEaseTime(dt);

    if (dt < locSplit) {
      // action[0]
      new_t = locSplit !== 0 ? dt / locSplit : 1;

      if (found === 0 && locLast === 1 && this._reversed) {
        // Reverse mode ?
        // XXX: Bug. this case doesn't contemplate when _last==-1, found=0 and in "reverse mode"
        // since it will require a hack to know if an action is on reverse mode or not.
        // "step" should be overriden, and the "reverseMode" value propagated to inner Sequences.
        locActions[1].update(0);
        locActions[1].stop();
      }
    } else {
      // action[1]
      found = 1;
      new_t = locSplit === 1 ? 1 : (dt - locSplit) / (1 - locSplit);

      if (locLast === -1) {
        // action[0] was skipped, execute it.
        locActions[0].startWithTarget(this.target);
        locActions[0].update(1);
        locActions[0].stop();
      }

      if (locLast === 0) {
        // switching to action 1. stop action 0.
        locActions[0].update(1);
        locActions[0].stop();
      }
    }

    actionFound = locActions[found]; // Last action found and it is done.

    if (locLast === found && actionFound.isDone()) return; // Last action not found

    if (locLast !== found) actionFound.startWithTarget(this.target);
    new_t = new_t * actionFound._timesForRepeat;
    actionFound.update(new_t > 1 ? new_t % 1 : new_t);
    this._last = found;
  },
  reverse: function reverse() {
    var action = cc.Sequence._actionOneTwo(this._actions[1].reverse(), this._actions[0].reverse());

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    action._reversed = true;
    return action;
  }
});
/**
 * !#en
 * Helper constructor to create an array of sequenceable actions
 * The created action will run actions sequentially, one after another.
 * !#zh 顺序执行动作，创建的动作将按顺序依次运行。
 * @method sequence
 * @param {FiniteTimeAction|FiniteTimeAction[]} actionOrActionArray
 * @param {FiniteTimeAction} ...tempArray
 * @return {ActionInterval}
 * @example
 * // example
 * // create sequence with actions
 * var seq = cc.sequence(act1, act2);
 *
 * // create sequence with array
 * var seq = cc.sequence(actArray);
 */
// todo: It should be use new

cc.sequence = function (
/*Multiple Arguments*/
tempArray) {
  var paramArray = tempArray instanceof Array ? tempArray : arguments;

  if (paramArray.length === 1) {
    cc.errorID(1019);
    return null;
  }

  var last = paramArray.length - 1;
  if (last >= 0 && paramArray[last] == null) cc.logID(1015);
  var result = null;

  if (last >= 0) {
    result = paramArray[0];

    for (var i = 1; i <= last; i++) {
      if (paramArray[i]) {
        result = cc.Sequence._actionOneTwo(result, paramArray[i]);
      }
    }
  }

  return result;
};

cc.Sequence._actionOneTwo = function (actionOne, actionTwo) {
  var sequence = new cc.Sequence();
  sequence.initWithTwoActions(actionOne, actionTwo);
  return sequence;
};
/*
 * Repeats an action a number of times.
 * To repeat an action forever use the CCRepeatForever action.
 * @class Repeat
 * @extends ActionInterval
 * @param {FiniteTimeAction} action
 * @param {Number} times
 * @example
 * var rep = new cc.Repeat(cc.sequence(jump2, jump1), 5);
 */


cc.Repeat = cc.Class({
  name: 'cc.Repeat',
  "extends": cc.ActionInterval,
  ctor: function ctor(action, times) {
    this._times = 0;
    this._total = 0;
    this._nextDt = 0;
    this._actionInstant = false;
    this._innerAction = null;
    times !== undefined && this.initWithAction(action, times);
  },

  /*
   * @param {FiniteTimeAction} action
   * @param {Number} times
   * @return {Boolean}
   */
  initWithAction: function initWithAction(action, times) {
    var duration = action._duration * times;

    if (this.initWithDuration(duration)) {
      this._times = times;
      this._innerAction = action;

      if (action instanceof cc.ActionInstant) {
        this._actionInstant = true;
        this._times -= 1;
      }

      this._total = 0;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.Repeat();

    this._cloneDecoration(action);

    action.initWithAction(this._innerAction.clone(), this._times);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    this._total = 0;
    this._nextDt = this._innerAction._duration / this._duration;
    cc.ActionInterval.prototype.startWithTarget.call(this, target);

    this._innerAction.startWithTarget(target);
  },
  stop: function stop() {
    this._innerAction.stop();

    cc.Action.prototype.stop.call(this);
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);
    var locInnerAction = this._innerAction;
    var locDuration = this._duration;
    var locTimes = this._times;
    var locNextDt = this._nextDt;

    if (dt >= locNextDt) {
      while (dt > locNextDt && this._total < locTimes) {
        locInnerAction.update(1);
        this._total++;
        locInnerAction.stop();
        locInnerAction.startWithTarget(this.target);
        locNextDt += locInnerAction._duration / locDuration;
        this._nextDt = locNextDt > 1 ? 1 : locNextDt;
      } // fix for issue #1288, incorrect end value of repeat


      if (dt >= 1.0 && this._total < locTimes) {
        // fix for cocos-creator/fireball/issues/4310
        locInnerAction.update(1);
        this._total++;
      } // don't set a instant action back or update it, it has no use because it has no duration


      if (!this._actionInstant) {
        if (this._total === locTimes) {
          locInnerAction.stop();
        } else {
          // issue #390 prevent jerk, use right update
          locInnerAction.update(dt - (locNextDt - locInnerAction._duration / locDuration));
        }
      }
    } else {
      locInnerAction.update(dt * locTimes % 1.0);
    }
  },
  isDone: function isDone() {
    return this._total === this._times;
  },
  reverse: function reverse() {
    var action = new cc.Repeat(this._innerAction.reverse(), this._times);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  },

  /*
   * Set inner Action.
   * @param {FiniteTimeAction} action
   */
  setInnerAction: function setInnerAction(action) {
    if (this._innerAction !== action) {
      this._innerAction = action;
    }
  },

  /*
   * Get inner Action.
   * @return {FiniteTimeAction}
   */
  getInnerAction: function getInnerAction() {
    return this._innerAction;
  }
});
/**
 * !#en Creates a Repeat action. Times is an unsigned integer between 1 and pow(2,30)
 * !#zh 重复动作，可以按一定次数重复一个动，如果想永远重复一个动作请使用 repeatForever 动作来完成。
 * @method repeat
 * @param {FiniteTimeAction} action
 * @param {Number} times
 * @return {ActionInterval}
 * @example
 * // example
 * var rep = cc.repeat(cc.sequence(jump2, jump1), 5);
 */

cc.repeat = function (action, times) {
  return new cc.Repeat(action, times);
};
/*
 * Repeats an action for ever.  <br/>
 * To repeat the an action for a limited number of times use the Repeat action. <br/>
 * @warning This action can't be Sequenceable because it is not an IntervalAction
 * @class RepeatForever
 * @extends ActionInterval
 * @param {FiniteTimeAction} action
 * @example
 * var rep = new cc.RepeatForever(cc.sequence(jump2, jump1), 5);
 */


cc.RepeatForever = cc.Class({
  name: 'cc.RepeatForever',
  "extends": cc.ActionInterval,
  ctor: function ctor(action) {
    this._innerAction = null;
    action && this.initWithAction(action);
  },

  /*
   * @param {ActionInterval} action
   * @return {Boolean}
   */
  initWithAction: function initWithAction(action) {
    if (!action) {
      cc.errorID(1026);
      return false;
    }

    this._innerAction = action;
    return true;
  },
  clone: function clone() {
    var action = new cc.RepeatForever();

    this._cloneDecoration(action);

    action.initWithAction(this._innerAction.clone());
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);

    this._innerAction.startWithTarget(target);
  },
  step: function step(dt) {
    var locInnerAction = this._innerAction;
    locInnerAction.step(dt);

    if (locInnerAction.isDone()) {
      //var diff = locInnerAction.getElapsed() - locInnerAction._duration;
      locInnerAction.startWithTarget(this.target); // to prevent jerk. issue #390 ,1247
      //this._innerAction.step(0);
      //this._innerAction.step(diff);

      locInnerAction.step(locInnerAction.getElapsed() - locInnerAction._duration);
    }
  },
  isDone: function isDone() {
    return false;
  },
  reverse: function reverse() {
    var action = new cc.RepeatForever(this._innerAction.reverse());

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  },

  /*
   * Set inner action.
   * @param {ActionInterval} action
   */
  setInnerAction: function setInnerAction(action) {
    if (this._innerAction !== action) {
      this._innerAction = action;
    }
  },

  /*
   * Get inner action.
   * @return {ActionInterval}
   */
  getInnerAction: function getInnerAction() {
    return this._innerAction;
  }
});
/**
 * !#en Create a acton which repeat forever, as it runs forever, it can't be added into cc.sequence and cc.spawn.
 * !#zh 永远地重复一个动作，有限次数内重复一个动作请使用 repeat 动作，由于这个动作不会停止，所以不能被添加到 cc.sequence 或 cc.spawn 中。
 * @method repeatForever
 * @param {FiniteTimeAction} action
 * @return {ActionInterval}
 * @example
 * // example
 * var repeat = cc.repeatForever(cc.rotateBy(1.0, 360));
 */

cc.repeatForever = function (action) {
  return new cc.RepeatForever(action);
};
/* 
 * Spawn a new action immediately
 * @class Spawn
 * @extends ActionInterval
 */


cc.Spawn = cc.Class({
  name: 'cc.Spawn',
  "extends": cc.ActionInterval,
  ctor: function ctor(tempArray) {
    this._one = null;
    this._two = null;
    var paramArray = tempArray instanceof Array ? tempArray : arguments;

    if (paramArray.length === 1) {
      cc.errorID(1020);
      return;
    }

    var last = paramArray.length - 1;
    if (last >= 0 && paramArray[last] == null) cc.logID(1015);

    if (last >= 0) {
      var prev = paramArray[0],
          action1;

      for (var i = 1; i < last; i++) {
        if (paramArray[i]) {
          action1 = prev;
          prev = cc.Spawn._actionOneTwo(action1, paramArray[i]);
        }
      }

      this.initWithTwoActions(prev, paramArray[last]);
    }
  },

  /* initializes the Spawn action with the 2 actions to spawn
   * @param {FiniteTimeAction} action1
   * @param {FiniteTimeAction} action2
   * @return {Boolean}
   */
  initWithTwoActions: function initWithTwoActions(action1, action2) {
    if (!action1 || !action2) {
      cc.errorID(1027);
      return false;
    }

    var ret = false;
    var d1 = action1._duration;
    var d2 = action2._duration;

    if (this.initWithDuration(Math.max(d1, d2))) {
      this._one = action1;
      this._two = action2;

      if (d1 > d2) {
        this._two = cc.Sequence._actionOneTwo(action2, cc.delayTime(d1 - d2));
      } else if (d1 < d2) {
        this._one = cc.Sequence._actionOneTwo(action1, cc.delayTime(d2 - d1));
      }

      ret = true;
    }

    return ret;
  },
  clone: function clone() {
    var action = new cc.Spawn();

    this._cloneDecoration(action);

    action.initWithTwoActions(this._one.clone(), this._two.clone());
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);

    this._one.startWithTarget(target);

    this._two.startWithTarget(target);
  },
  stop: function stop() {
    this._one.stop();

    this._two.stop();

    cc.Action.prototype.stop.call(this);
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);
    if (this._one) this._one.update(dt);
    if (this._two) this._two.update(dt);
  },
  reverse: function reverse() {
    var action = cc.Spawn._actionOneTwo(this._one.reverse(), this._two.reverse());

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  }
});
/**
 * !#en Create a spawn action which runs several actions in parallel.
 * !#zh 同步执行动作，同步执行一组动作。
 * @method spawn
 * @param {FiniteTimeAction|FiniteTimeAction[]} actionOrActionArray
 * @param {FiniteTimeAction} ...tempArray
 * @return {FiniteTimeAction}
 * @example
 * // example
 * var action = cc.spawn(cc.jumpBy(2, cc.v2(300, 0), 50, 4), cc.rotateBy(2, 720));
 * todo: It should be the direct use new
 */

cc.spawn = function (
/*Multiple Arguments*/
tempArray) {
  var paramArray = tempArray instanceof Array ? tempArray : arguments;

  if (paramArray.length === 1) {
    cc.errorID(1020);
    return null;
  }

  if (paramArray.length > 0 && paramArray[paramArray.length - 1] == null) cc.logID(1015);
  var prev = paramArray[0];

  for (var i = 1; i < paramArray.length; i++) {
    if (paramArray[i] != null) prev = cc.Spawn._actionOneTwo(prev, paramArray[i]);
  }

  return prev;
};

cc.Spawn._actionOneTwo = function (action1, action2) {
  var pSpawn = new cc.Spawn();
  pSpawn.initWithTwoActions(action1, action2);
  return pSpawn;
};
/*
 * Rotates a Node object to a certain angle by modifying its angle property. <br/>
 * The direction will be decided by the shortest angle.
 * @class RotateTo
 * @extends ActionInterval
 * @param {Number} duration duration in seconds
 * @param {Number} dstAngle dstAngle in degrees.
 * @example
 * var rotateTo = new cc.RotateTo(2, 61.0);
 */


cc.RotateTo = cc.Class({
  name: 'cc.RotateTo',
  "extends": cc.ActionInterval,
  statics: {
    _reverse: false
  },
  ctor: function ctor(duration, dstAngle) {
    this._startAngle = 0;
    this._dstAngle = 0;
    this._angle = 0;
    dstAngle !== undefined && this.initWithDuration(duration, dstAngle);
  },

  /*
   * Initializes the action.
   * @param {Number} duration
   * @param {Number} dstAngle
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(duration, dstAngle) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      this._dstAngle = dstAngle;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.RotateTo();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._dstAngle);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    var startAngle = target.angle % 360;
    var angle = cc.RotateTo._reverse ? this._dstAngle - startAngle : this._dstAngle + startAngle;
    if (angle > 180) angle -= 360;
    if (angle < -180) angle += 360;
    this._startAngle = startAngle;
    this._angle = cc.RotateTo._reverse ? angle : -angle;
  },
  reverse: function reverse() {
    cc.logID(1016);
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);

    if (this.target) {
      this.target.angle = this._startAngle + this._angle * dt;
    }
  }
});
/**
 * !#en
 * Rotates a Node object to a certain angle by modifying its angle property. <br/>
 * The direction will be decided by the shortest angle.
 * !#zh 旋转到目标角度，通过逐帧修改它的 angle 属性，旋转方向将由最短的角度决定。
 * @method rotateTo
 * @param {Number} duration duration in seconds
 * @param {Number} dstAngle dstAngle in degrees.
 * @return {ActionInterval}
 * @example
 * // example
 * var rotateTo = cc.rotateTo(2, 61.0);
 */

cc.rotateTo = function (duration, dstAngle) {
  return new cc.RotateTo(duration, dstAngle);
};
/*
 * Rotates a Node object clockwise a number of degrees by modifying its angle property.
 * Relative to its properties to modify.
 * @class RotateBy
 * @extends ActionInterval
 * @param {Number} duration duration in seconds
 * @param {Number} deltaAngle deltaAngle in degrees
 * @example
 * var actionBy = new cc.RotateBy(2, 360);
 */


cc.RotateBy = cc.Class({
  name: 'cc.RotateBy',
  "extends": cc.ActionInterval,
  statics: {
    _reverse: false
  },
  ctor: function ctor(duration, deltaAngle) {
    deltaAngle *= cc.RotateBy._reverse ? 1 : -1;
    this._deltaAngle = 0;
    this._startAngle = 0;
    deltaAngle !== undefined && this.initWithDuration(duration, deltaAngle);
  },

  /*
   * Initializes the action.
   * @param {Number} duration duration in seconds
   * @param {Number} deltaAngle deltaAngle in degrees
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(duration, deltaAngle) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      this._deltaAngle = deltaAngle;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.RotateBy();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._deltaAngle);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    this._startAngle = target.angle;
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);

    if (this.target) {
      this.target.angle = this._startAngle + this._deltaAngle * dt;
    }
  },
  reverse: function reverse() {
    var action = new cc.RotateBy();
    action.initWithDuration(this._duration, -this._deltaAngle);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  }
});
/**
 * !#en
 * Rotates a Node object clockwise a number of degrees by modifying its angle property.
 * Relative to its properties to modify.
 * !#zh 旋转指定的角度。
 * @method rotateBy
 * @param {Number} duration duration in seconds
 * @param {Number} deltaAngle deltaAngle in degrees
 * @return {ActionInterval}
 * @example
 * // example
 * var actionBy = cc.rotateBy(2, 360);
 */

cc.rotateBy = function (duration, deltaAngle) {
  return new cc.RotateBy(duration, deltaAngle);
};
/*
 * <p>
 * Moves a Node object x,y pixels by modifying its position property.                                  <br/>
 * x and y are relative to the position of the object.                                                     <br/>
 * Several MoveBy actions can be concurrently called, and the resulting                                  <br/>
 * movement will be the sum of individual movements.
 * </p>
 * @class MoveBy
 * @extends ActionInterval
 * @param {Number} duration duration in seconds
 * @param {Vec2|Number} deltaPos
 * @param {Number} [deltaY]
 * @example
 * var actionTo = cc.moveBy(2, cc.v2(windowSize.width - 40, windowSize.height - 40));
 */


cc.MoveBy = cc.Class({
  name: 'cc.MoveBy',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, deltaPos, deltaY) {
    this._positionDelta = cc.v2(0, 0);
    this._startPosition = cc.v2(0, 0);
    this._previousPosition = cc.v2(0, 0);
    deltaPos !== undefined && cc.MoveBy.prototype.initWithDuration.call(this, duration, deltaPos, deltaY);
  },

  /*
   * Initializes the action.
   * @param {Number} duration duration in seconds
   * @param {Vec2} position
   * @param {Number} [y]
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(duration, position, y) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      if (position.x !== undefined) {
        y = position.y;
        position = position.x;
      }

      this._positionDelta.x = position;
      this._positionDelta.y = y;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.MoveBy();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._positionDelta);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    var locPosX = target.x;
    var locPosY = target.y;
    this._previousPosition.x = locPosX;
    this._previousPosition.y = locPosY;
    this._startPosition.x = locPosX;
    this._startPosition.y = locPosY;
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);

    if (this.target) {
      var x = this._positionDelta.x * dt;
      var y = this._positionDelta.y * dt;
      var locStartPosition = this._startPosition;

      if (cc.macro.ENABLE_STACKABLE_ACTIONS) {
        var targetX = this.target.x;
        var targetY = this.target.y;
        var locPreviousPosition = this._previousPosition;
        locStartPosition.x = locStartPosition.x + targetX - locPreviousPosition.x;
        locStartPosition.y = locStartPosition.y + targetY - locPreviousPosition.y;
        x = x + locStartPosition.x;
        y = y + locStartPosition.y;
        locPreviousPosition.x = x;
        locPreviousPosition.y = y;
        this.target.setPosition(x, y);
      } else {
        this.target.setPosition(locStartPosition.x + x, locStartPosition.y + y);
      }
    }
  },
  reverse: function reverse() {
    var action = new cc.MoveBy(this._duration, cc.v2(-this._positionDelta.x, -this._positionDelta.y));

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  }
});
/**
 * !#en
 * Moves a Node object x,y pixels by modifying its position property.                                  <br/>
 * x and y are relative to the position of the object.                                                     <br/>
 * Several MoveBy actions can be concurrently called, and the resulting                                  <br/>
 * movement will be the sum of individual movements.
 * !#zh 移动指定的距离。
 * @method moveBy
 * @param {Number} duration duration in seconds
 * @param {Vec2|Number} deltaPos
 * @param {Number} [deltaY]
 * @return {ActionInterval}
 * @example
 * // example
 * var actionTo = cc.moveBy(2, cc.v2(windowSize.width - 40, windowSize.height - 40));
 */

cc.moveBy = function (duration, deltaPos, deltaY) {
  return new cc.MoveBy(duration, deltaPos, deltaY);
};
/*
 * Moves a Node object to the position x,y. x and y are absolute coordinates by modifying its position property. <br/>
 * Several MoveTo actions can be concurrently called, and the resulting                                            <br/>
 * movement will be the sum of individual movements.
 * @class MoveTo
 * @extends MoveBy
 * @param {Number} duration duration in seconds
 * @param {Vec2|Number} position
 * @param {Number} [y]
 * @example
 * var actionBy = new cc.MoveTo(2, cc.v2(80, 80));
 */


cc.MoveTo = cc.Class({
  name: 'cc.MoveTo',
  "extends": cc.MoveBy,
  ctor: function ctor(duration, position, y) {
    this._endPosition = cc.v2(0, 0);
    position !== undefined && this.initWithDuration(duration, position, y);
  },

  /*
   * Initializes the action.
   * @param {Number} duration  duration in seconds
   * @param {Vec2} position
   * @param {Number} [y]
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(duration, position, y) {
    if (cc.MoveBy.prototype.initWithDuration.call(this, duration, position, y)) {
      if (position.x !== undefined) {
        y = position.y;
        position = position.x;
      }

      this._endPosition.x = position;
      this._endPosition.y = y;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.MoveTo();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._endPosition);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.MoveBy.prototype.startWithTarget.call(this, target);
    this._positionDelta.x = this._endPosition.x - target.x;
    this._positionDelta.y = this._endPosition.y - target.y;
  }
});
/**
 * !#en
 * Moves a Node object to the position x,y. x and y are absolute coordinates by modifying its position property. <br/>
 * Several MoveTo actions can be concurrently called, and the resulting                                            <br/>
 * movement will be the sum of individual movements.
 * !#zh 移动到目标位置。
 * @method moveTo
 * @param {Number} duration duration in seconds
 * @param {Vec2|Number} position
 * @param {Number} [y]
 * @return {ActionInterval}
 * @example
 * // example
 * var actionBy = cc.moveTo(2, cc.v2(80, 80));
 */

cc.moveTo = function (duration, position, y) {
  return new cc.MoveTo(duration, position, y);
};
/*
 * Skews a Node object to given angles by modifying its skewX and skewY properties
 * @class SkewTo
 * @extends ActionInterval
 * @param {Number} t time in seconds
 * @param {Number} sx
 * @param {Number} sy
 * @example
 * var actionTo = new cc.SkewTo(2, 37.2, -37.2);
 */


cc.SkewTo = cc.Class({
  name: 'cc.SkewTo',
  "extends": cc.ActionInterval,
  ctor: function ctor(t, sx, sy) {
    this._skewX = 0;
    this._skewY = 0;
    this._startSkewX = 0;
    this._startSkewY = 0;
    this._endSkewX = 0;
    this._endSkewY = 0;
    this._deltaX = 0;
    this._deltaY = 0;
    sy !== undefined && cc.SkewTo.prototype.initWithDuration.call(this, t, sx, sy);
  },

  /*
   * Initializes the action.
   * @param {Number} t time in seconds
   * @param {Number} sx
   * @param {Number} sy
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(t, sx, sy) {
    var ret = false;

    if (cc.ActionInterval.prototype.initWithDuration.call(this, t)) {
      this._endSkewX = sx;
      this._endSkewY = sy;
      ret = true;
    }

    return ret;
  },
  clone: function clone() {
    var action = new cc.SkewTo();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._endSkewX, this._endSkewY);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    this._startSkewX = target.skewX % 180;
    this._deltaX = this._endSkewX - this._startSkewX;
    if (this._deltaX > 180) this._deltaX -= 360;
    if (this._deltaX < -180) this._deltaX += 360;
    this._startSkewY = target.skewY % 360;
    this._deltaY = this._endSkewY - this._startSkewY;
    if (this._deltaY > 180) this._deltaY -= 360;
    if (this._deltaY < -180) this._deltaY += 360;
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);
    this.target.skewX = this._startSkewX + this._deltaX * dt;
    this.target.skewY = this._startSkewY + this._deltaY * dt;
  }
});
/**
 * !#en
 * Create a action which skews a Node object to given angles by modifying its skewX and skewY properties.
 * Changes to the specified value.
 * !#zh 偏斜到目标角度。
 * @method skewTo
 * @param {Number} t time in seconds
 * @param {Number} sx
 * @param {Number} sy
 * @return {ActionInterval}
 * @example
 * // example
 * var actionTo = cc.skewTo(2, 37.2, -37.2);
 */

cc.skewTo = function (t, sx, sy) {
  return new cc.SkewTo(t, sx, sy);
};
/*
 * Skews a Node object by skewX and skewY degrees.
 * Relative to its property modification.
 * @class SkewBy
 * @extends SkewTo
 * @param {Number} t time in seconds
 * @param {Number} sx  skew in degrees for X axis
 * @param {Number} sy  skew in degrees for Y axis
 */


cc.SkewBy = cc.Class({
  name: 'cc.SkewBy',
  "extends": cc.SkewTo,
  ctor: function ctor(t, sx, sy) {
    sy !== undefined && this.initWithDuration(t, sx, sy);
  },

  /*
   * Initializes the action.
   * @param {Number} t time in seconds
   * @param {Number} deltaSkewX  skew in degrees for X axis
   * @param {Number} deltaSkewY  skew in degrees for Y axis
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(t, deltaSkewX, deltaSkewY) {
    var ret = false;

    if (cc.SkewTo.prototype.initWithDuration.call(this, t, deltaSkewX, deltaSkewY)) {
      this._skewX = deltaSkewX;
      this._skewY = deltaSkewY;
      ret = true;
    }

    return ret;
  },
  clone: function clone() {
    var action = new cc.SkewBy();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._skewX, this._skewY);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.SkewTo.prototype.startWithTarget.call(this, target);
    this._deltaX = this._skewX;
    this._deltaY = this._skewY;
    this._endSkewX = this._startSkewX + this._deltaX;
    this._endSkewY = this._startSkewY + this._deltaY;
  },
  reverse: function reverse() {
    var action = new cc.SkewBy(this._duration, -this._skewX, -this._skewY);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  }
});
/**
 * !#en
 * Skews a Node object by skewX and skewY degrees. <br />
 * Relative to its property modification.
 * !#zh 偏斜指定的角度。
 * @method skewBy
 * @param {Number} t time in seconds
 * @param {Number} sx sx skew in degrees for X axis
 * @param {Number} sy sy skew in degrees for Y axis
 * @return {ActionInterval}
 * @example
 * // example
 * var actionBy = cc.skewBy(2, 0, -90);
 */

cc.skewBy = function (t, sx, sy) {
  return new cc.SkewBy(t, sx, sy);
};
/*
 * Moves a Node object simulating a parabolic jump movement by modifying its position property.
 * Relative to its movement.
 * @class JumpBy
 * @extends ActionInterval
 * @param {Number} duration
 * @param {Vec2|Number} position
 * @param {Number} [y]
 * @param {Number} height
 * @param {Number} jumps
 * @example
 * var actionBy = new cc.JumpBy(2, cc.v2(300, 0), 50, 4);
 * var actionBy = new cc.JumpBy(2, 300, 0, 50, 4);
 */


cc.JumpBy = cc.Class({
  name: 'cc.JumpBy',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, position, y, height, jumps) {
    this._startPosition = cc.v2(0, 0);
    this._previousPosition = cc.v2(0, 0);
    this._delta = cc.v2(0, 0);
    this._height = 0;
    this._jumps = 0;
    height !== undefined && cc.JumpBy.prototype.initWithDuration.call(this, duration, position, y, height, jumps);
  },

  /*
   * Initializes the action.
   * @param {Number} duration
   * @param {Vec2|Number} position
   * @param {Number} [y]
   * @param {Number} height
   * @param {Number} jumps
   * @return {Boolean}
   * @example
   * actionBy.initWithDuration(2, cc.v2(300, 0), 50, 4);
   * actionBy.initWithDuration(2, 300, 0, 50, 4);
   */
  initWithDuration: function initWithDuration(duration, position, y, height, jumps) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      if (jumps === undefined) {
        jumps = height;
        height = y;
        y = position.y;
        position = position.x;
      }

      this._delta.x = position;
      this._delta.y = y;
      this._height = height;
      this._jumps = jumps;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.JumpBy();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._delta, this._height, this._jumps);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    var locPosX = target.x;
    var locPosY = target.y;
    this._previousPosition.x = locPosX;
    this._previousPosition.y = locPosY;
    this._startPosition.x = locPosX;
    this._startPosition.y = locPosY;
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);

    if (this.target) {
      var frac = dt * this._jumps % 1.0;
      var y = this._height * 4 * frac * (1 - frac);
      y += this._delta.y * dt;
      var x = this._delta.x * dt;
      var locStartPosition = this._startPosition;

      if (cc.macro.ENABLE_STACKABLE_ACTIONS) {
        var targetX = this.target.x;
        var targetY = this.target.y;
        var locPreviousPosition = this._previousPosition;
        locStartPosition.x = locStartPosition.x + targetX - locPreviousPosition.x;
        locStartPosition.y = locStartPosition.y + targetY - locPreviousPosition.y;
        x = x + locStartPosition.x;
        y = y + locStartPosition.y;
        locPreviousPosition.x = x;
        locPreviousPosition.y = y;
        this.target.setPosition(x, y);
      } else {
        this.target.setPosition(locStartPosition.x + x, locStartPosition.y + y);
      }
    }
  },
  reverse: function reverse() {
    var action = new cc.JumpBy(this._duration, cc.v2(-this._delta.x, -this._delta.y), this._height, this._jumps);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  }
});
/**
 * !#en
 * Moves a Node object simulating a parabolic jump movement by modifying it's position property.
 * Relative to its movement.
 * !#zh 用跳跃的方式移动指定的距离。
 * @method jumpBy
 * @param {Number} duration
 * @param {Vec2|Number} position
 * @param {Number} [y]
 * @param {Number} [height]
 * @param {Number} [jumps]
 * @return {ActionInterval}
 * @example
 * // example
 * var actionBy = cc.jumpBy(2, cc.v2(300, 0), 50, 4);
 * var actionBy = cc.jumpBy(2, 300, 0, 50, 4);
 */

cc.jumpBy = function (duration, position, y, height, jumps) {
  return new cc.JumpBy(duration, position, y, height, jumps);
};
/*
 * Moves a Node object to a parabolic position simulating a jump movement by modifying it's position property. <br />
 * Jump to the specified location.
 * @class JumpTo
 * @extends JumpBy
 * @param {Number} duration
 * @param {Vec2|Number} position
 * @param {Number} [y]
 * @param {Number} [height]
 * @param {Number} [jumps]
 * @example
 * var actionTo = new cc.JumpTo(2, cc.v2(300, 0), 50, 4);
 * var actionTo = new cc.JumpTo(2, 300, 0, 50, 4);
 */


cc.JumpTo = cc.Class({
  name: 'cc.JumpTo',
  "extends": cc.JumpBy,
  ctor: function ctor(duration, position, y, height, jumps) {
    this._endPosition = cc.v2(0, 0);
    height !== undefined && this.initWithDuration(duration, position, y, height, jumps);
  },

  /*
   * Initializes the action.
   * @param {Number} duration
   * @param {Vec2|Number} position
   * @param {Number} [y]
   * @param {Number} height
   * @param {Number} jumps
   * @return {Boolean}
   * @example
   * actionTo.initWithDuration(2, cc.v2(300, 0), 50, 4);
   * actionTo.initWithDuration(2, 300, 0, 50, 4);
   */
  initWithDuration: function initWithDuration(duration, position, y, height, jumps) {
    if (cc.JumpBy.prototype.initWithDuration.call(this, duration, position, y, height, jumps)) {
      if (jumps === undefined) {
        y = position.y;
        position = position.x;
      }

      this._endPosition.x = position;
      this._endPosition.y = y;
      return true;
    }

    return false;
  },
  startWithTarget: function startWithTarget(target) {
    cc.JumpBy.prototype.startWithTarget.call(this, target);
    this._delta.x = this._endPosition.x - this._startPosition.x;
    this._delta.y = this._endPosition.y - this._startPosition.y;
  },
  clone: function clone() {
    var action = new cc.JumpTo();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._endPosition, this._height, this._jumps);
    return action;
  }
});
/**
 * !#en
 * Moves a Node object to a parabolic position simulating a jump movement by modifying its position property. <br />
 * Jump to the specified location.
 * !#zh 用跳跃的方式移动到目标位置。
 * @method jumpTo
 * @param {Number} duration
 * @param {Vec2|Number} position
 * @param {Number} [y]
 * @param {Number} [height]
 * @param {Number} [jumps]
 * @return {ActionInterval}
 * @example
 * // example
 * var actionTo = cc.jumpTo(2, cc.v2(300, 300), 50, 4);
 * var actionTo = cc.jumpTo(2, 300, 300, 50, 4);
 */

cc.jumpTo = function (duration, position, y, height, jumps) {
  return new cc.JumpTo(duration, position, y, height, jumps);
};
/* An action that moves the target with a cubic Bezier curve by a certain distance.
 * Relative to its movement.
 * @class BezierBy
 * @extends ActionInterval
 * @param {Number} t - time in seconds
 * @param {Vec2[]} c - Array of points
 * @example
 * var bezier = [cc.v2(0, windowSize.height / 2), cc.v2(300, -windowSize.height / 2), cc.v2(300, 100)];
 * var bezierForward = new cc.BezierBy(3, bezier);
 */


function bezierAt(a, b, c, d, t) {
  return Math.pow(1 - t, 3) * a + 3 * t * Math.pow(1 - t, 2) * b + 3 * Math.pow(t, 2) * (1 - t) * c + Math.pow(t, 3) * d;
}

;
cc.BezierBy = cc.Class({
  name: 'cc.BezierBy',
  "extends": cc.ActionInterval,
  ctor: function ctor(t, c) {
    this._config = [];
    this._startPosition = cc.v2(0, 0);
    this._previousPosition = cc.v2(0, 0);
    c && cc.BezierBy.prototype.initWithDuration.call(this, t, c);
  },

  /*
   * Initializes the action.
   * @param {Number} t - time in seconds
   * @param {Vec2[]} c - Array of points
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(t, c) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, t)) {
      this._config = c;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.BezierBy();

    this._cloneDecoration(action);

    var newConfigs = [];

    for (var i = 0; i < this._config.length; i++) {
      var selConf = this._config[i];
      newConfigs.push(cc.v2(selConf.x, selConf.y));
    }

    action.initWithDuration(this._duration, newConfigs);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    var locPosX = target.x;
    var locPosY = target.y;
    this._previousPosition.x = locPosX;
    this._previousPosition.y = locPosY;
    this._startPosition.x = locPosX;
    this._startPosition.y = locPosY;
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);

    if (this.target) {
      var locConfig = this._config;
      var xa = 0;
      var xb = locConfig[0].x;
      var xc = locConfig[1].x;
      var xd = locConfig[2].x;
      var ya = 0;
      var yb = locConfig[0].y;
      var yc = locConfig[1].y;
      var yd = locConfig[2].y;
      var x = bezierAt(xa, xb, xc, xd, dt);
      var y = bezierAt(ya, yb, yc, yd, dt);
      var locStartPosition = this._startPosition;

      if (cc.macro.ENABLE_STACKABLE_ACTIONS) {
        var targetX = this.target.x;
        var targetY = this.target.y;
        var locPreviousPosition = this._previousPosition;
        locStartPosition.x = locStartPosition.x + targetX - locPreviousPosition.x;
        locStartPosition.y = locStartPosition.y + targetY - locPreviousPosition.y;
        x = x + locStartPosition.x;
        y = y + locStartPosition.y;
        locPreviousPosition.x = x;
        locPreviousPosition.y = y;
        this.target.setPosition(x, y);
      } else {
        this.target.setPosition(locStartPosition.x + x, locStartPosition.y + y);
      }
    }
  },
  reverse: function reverse() {
    var locConfig = this._config;
    var x0 = locConfig[0].x,
        y0 = locConfig[0].y;
    var x1 = locConfig[1].x,
        y1 = locConfig[1].y;
    var x2 = locConfig[2].x,
        y2 = locConfig[2].y;
    var r = [cc.v2(x1 - x2, y1 - y2), cc.v2(x0 - x2, y0 - y2), cc.v2(-x2, -y2)];
    var action = new cc.BezierBy(this._duration, r);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  }
});
/**
 * !#en
 * An action that moves the target with a cubic Bezier curve by a certain distance.
 * Relative to its movement.
 * !#zh 按贝赛尔曲线轨迹移动指定的距离。
 * @method bezierBy
 * @param {Number} t - time in seconds
 * @param {Vec2[]} c - Array of points
 * @return {ActionInterval}
 * @example
 * // example
 * var bezier = [cc.v2(0, windowSize.height / 2), cc.v2(300, -windowSize.height / 2), cc.v2(300, 100)];
 * var bezierForward = cc.bezierBy(3, bezier);
 */

cc.bezierBy = function (t, c) {
  return new cc.BezierBy(t, c);
};
/* An action that moves the target with a cubic Bezier curve to a destination point.
 * @class BezierTo
 * @extends BezierBy
 * @param {Number} t
 * @param {Vec2[]} c - Array of points
 * @example
 * var bezier = [cc.v2(0, windowSize.height / 2), cc.v2(300, -windowSize.height / 2), cc.v2(300, 100)];
 * var bezierTo = new cc.BezierTo(2, bezier);
 */


cc.BezierTo = cc.Class({
  name: 'cc.BezierTo',
  "extends": cc.BezierBy,
  ctor: function ctor(t, c) {
    this._toConfig = [];
    c && this.initWithDuration(t, c);
  },

  /*
   * Initializes the action.
   * @param {Number} t time in seconds
   * @param {Vec2[]} c - Array of points
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(t, c) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, t)) {
      this._toConfig = c;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.BezierTo();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._toConfig);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.BezierBy.prototype.startWithTarget.call(this, target);
    var locStartPos = this._startPosition;
    var locToConfig = this._toConfig;
    var locConfig = this._config;
    locConfig[0] = locToConfig[0].sub(locStartPos);
    locConfig[1] = locToConfig[1].sub(locStartPos);
    locConfig[2] = locToConfig[2].sub(locStartPos);
  }
});
/**
 * !#en An action that moves the target with a cubic Bezier curve to a destination point.
 * !#zh 按贝赛尔曲线轨迹移动到目标位置。
 * @method bezierTo
 * @param {Number} t
 * @param {Vec2[]} c - Array of points
 * @return {ActionInterval}
 * @example
 * // example
 * var bezier = [cc.v2(0, windowSize.height / 2), cc.v2(300, -windowSize.height / 2), cc.v2(300, 100)];
 * var bezierTo = cc.bezierTo(2, bezier);
 */

cc.bezierTo = function (t, c) {
  return new cc.BezierTo(t, c);
};
/* Scales a Node object to a zoom factor by modifying it's scale property.
 * @warning This action doesn't support "reverse"
 * @class ScaleTo
 * @extends ActionInterval
 * @param {Number} duration
 * @param {Number} sx  scale parameter in X
 * @param {Number} [sy] scale parameter in Y, if Null equal to sx
 * @example
 * // It scales to 0.5 in both X and Y.
 * var actionTo = new cc.ScaleTo(2, 0.5);
 *
 * // It scales to 0.5 in x and 2 in Y
 * var actionTo = new cc.ScaleTo(2, 0.5, 2);
 */


cc.ScaleTo = cc.Class({
  name: 'cc.ScaleTo',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, sx, sy) {
    this._scaleX = 1;
    this._scaleY = 1;
    this._startScaleX = 1;
    this._startScaleY = 1;
    this._endScaleX = 0;
    this._endScaleY = 0;
    this._deltaX = 0;
    this._deltaY = 0;
    sx !== undefined && cc.ScaleTo.prototype.initWithDuration.call(this, duration, sx, sy);
  },

  /*
   * Initializes the action.
   * @param {Number} duration
   * @param {Number} sx
   * @param {Number} [sy=]
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(duration, sx, sy) {
    //function overload here
    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      this._endScaleX = sx;
      this._endScaleY = sy != null ? sy : sx;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.ScaleTo();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._endScaleX, this._endScaleY);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    this._startScaleX = target.scaleX;
    this._startScaleY = target.scaleY;
    this._deltaX = this._endScaleX - this._startScaleX;
    this._deltaY = this._endScaleY - this._startScaleY;
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);

    if (this.target) {
      this.target.scaleX = this._startScaleX + this._deltaX * dt;
      this.target.scaleY = this._startScaleY + this._deltaY * dt;
    }
  }
});
/**
 * !#en Scales a Node object to a zoom factor by modifying it's scale property.
 * !#zh 将节点大小缩放到指定的倍数。
 * @method scaleTo
 * @param {Number} duration
 * @param {Number} sx  scale parameter in X
 * @param {Number} [sy] scale parameter in Y, if Null equal to sx
 * @return {ActionInterval}
 * @example
 * // example
 * // It scales to 0.5 in both X and Y.
 * var actionTo = cc.scaleTo(2, 0.5);
 *
 * // It scales to 0.5 in x and 2 in Y
 * var actionTo = cc.scaleTo(2, 0.5, 2);
 */

cc.scaleTo = function (duration, sx, sy) {
  //function overload
  return new cc.ScaleTo(duration, sx, sy);
};
/* Scales a Node object a zoom factor by modifying it's scale property.
 * Relative to its changes.
 * @class ScaleBy
 * @extends ScaleTo
 */


cc.ScaleBy = cc.Class({
  name: 'cc.ScaleBy',
  "extends": cc.ScaleTo,
  startWithTarget: function startWithTarget(target) {
    cc.ScaleTo.prototype.startWithTarget.call(this, target);
    this._deltaX = this._startScaleX * this._endScaleX - this._startScaleX;
    this._deltaY = this._startScaleY * this._endScaleY - this._startScaleY;
  },
  reverse: function reverse() {
    var action = new cc.ScaleBy(this._duration, 1 / this._endScaleX, 1 / this._endScaleY);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  },
  clone: function clone() {
    var action = new cc.ScaleBy();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._endScaleX, this._endScaleY);
    return action;
  }
});
/**
 * !#en
 * Scales a Node object a zoom factor by modifying it's scale property.
 * Relative to its changes.
 * !#zh 按指定的倍数缩放节点大小。
 * @method scaleBy
 * @param {Number} duration duration in seconds
 * @param {Number} sx sx  scale parameter in X
 * @param {Number|Null} [sy=] sy scale parameter in Y, if Null equal to sx
 * @return {ActionInterval}
 * @example
 * // example without sy, it scales by 2 both in X and Y
 * var actionBy = cc.scaleBy(2, 2);
 *
 * //example with sy, it scales by 0.25 in X and 4.5 in Y
 * var actionBy2 = cc.scaleBy(2, 0.25, 4.5);
 */

cc.scaleBy = function (duration, sx, sy) {
  return new cc.ScaleBy(duration, sx, sy);
};
/* Blinks a Node object by modifying it's visible property
 * @class Blink
 * @extends ActionInterval
 * @param {Number} duration  duration in seconds
 * @param {Number} blinks  blinks in times
 * @example
 * var action = new cc.Blink(2, 10);
 */


cc.Blink = cc.Class({
  name: 'cc.Blink',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, blinks) {
    this._times = 0;
    this._originalState = false;
    blinks !== undefined && this.initWithDuration(duration, blinks);
  },

  /*
   * Initializes the action.
   * @param {Number} duration duration in seconds
   * @param {Number} blinks blinks in times
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(duration, blinks) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      this._times = blinks;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.Blink();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._times);
    return action;
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);

    if (this.target && !this.isDone()) {
      var slice = 1.0 / this._times;
      var m = dt % slice;
      this.target.opacity = m > slice / 2 ? 255 : 0;
    }
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    this._originalState = target.opacity;
  },
  stop: function stop() {
    this.target.opacity = this._originalState;
    cc.ActionInterval.prototype.stop.call(this);
  },
  reverse: function reverse() {
    var action = new cc.Blink(this._duration, this._times);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  }
});
/**
 * !#en Blinks a Node object by modifying it's visible property.
 * !#zh 闪烁（基于透明度）。
 * @method blink
 * @param {Number} duration  duration in seconds
 * @param {Number} blinks blinks in times
 * @return {ActionInterval}
 * @example
 * // example
 * var action = cc.blink(2, 10);
 */

cc.blink = function (duration, blinks) {
  return new cc.Blink(duration, blinks);
};
/* Fades an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from the current value to a custom one.
 * @warning This action doesn't support "reverse"
 * @class FadeTo
 * @extends ActionInterval
 * @param {Number} duration
 * @param {Number} opacity 0-255, 0 is transparent
 * @example
 * var action = new cc.FadeTo(1.0, 0);
 */


cc.FadeTo = cc.Class({
  name: 'cc.FadeTo',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, opacity) {
    this._toOpacity = 0;
    this._fromOpacity = 0;
    opacity !== undefined && cc.FadeTo.prototype.initWithDuration.call(this, duration, opacity);
  },

  /*
   * Initializes the action.
   * @param {Number} duration  duration in seconds
   * @param {Number} opacity
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(duration, opacity) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      this._toOpacity = opacity;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.FadeTo();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._toOpacity);
    return action;
  },
  update: function update(time) {
    time = this._computeEaseTime(time);
    var fromOpacity = this._fromOpacity !== undefined ? this._fromOpacity : 255;
    this.target.opacity = fromOpacity + (this._toOpacity - fromOpacity) * time;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    this._fromOpacity = target.opacity;
  }
});
/**
 * !#en
 * Fades an object that implements the cc.RGBAProtocol protocol.
 * It modifies the opacity from the current value to a custom one.
 * !#zh 修改透明度到指定值。
 * @method fadeTo
 * @param {Number} duration
 * @param {Number} opacity 0-255, 0 is transparent
 * @return {ActionInterval}
 * @example
 * // example
 * var action = cc.fadeTo(1.0, 0);
 */

cc.fadeTo = function (duration, opacity) {
  return new cc.FadeTo(duration, opacity);
};
/* Fades In an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from 0 to 255.<br/>
 * The "reverse" of this action is FadeOut
 * @class FadeIn
 * @extends FadeTo
 * @param {Number} duration duration in seconds
 */


cc.FadeIn = cc.Class({
  name: 'cc.FadeIn',
  "extends": cc.FadeTo,
  ctor: function ctor(duration) {
    if (duration == null) duration = 0;
    this._reverseAction = null;
    this.initWithDuration(duration, 255);
  },
  reverse: function reverse() {
    var action = new cc.FadeOut();
    action.initWithDuration(this._duration, 0);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  },
  clone: function clone() {
    var action = new cc.FadeIn();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._toOpacity);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    if (this._reverseAction) this._toOpacity = this._reverseAction._fromOpacity;
    cc.FadeTo.prototype.startWithTarget.call(this, target);
  }
});
/**
 * !#en Fades In an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from 0 to 255.
 * !#zh 渐显效果。
 * @method fadeIn
 * @param {Number} duration duration in seconds
 * @return {ActionInterval}
 * @example
 * //example
 * var action = cc.fadeIn(1.0);
 */

cc.fadeIn = function (duration) {
  return new cc.FadeIn(duration);
};
/* Fades Out an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from 255 to 0.
 * The "reverse" of this action is FadeIn
 * @class FadeOut
 * @extends FadeTo
 * @param {Number} duration duration in seconds
 */


cc.FadeOut = cc.Class({
  name: 'cc.FadeOut',
  "extends": cc.FadeTo,
  ctor: function ctor(duration) {
    if (duration == null) duration = 0;
    this._reverseAction = null;
    this.initWithDuration(duration, 0);
  },
  reverse: function reverse() {
    var action = new cc.FadeIn();
    action._reverseAction = this;
    action.initWithDuration(this._duration, 255);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  },
  clone: function clone() {
    var action = new cc.FadeOut();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._toOpacity);
    return action;
  }
});
/**
 * !#en Fades Out an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from 255 to 0.
 * !#zh 渐隐效果。
 * @method fadeOut
 * @param {Number} d  duration in seconds
 * @return {ActionInterval}
 * @example
 * // example
 * var action = cc.fadeOut(1.0);
 */

cc.fadeOut = function (d) {
  return new cc.FadeOut(d);
};
/* Tints a Node that implements the cc.NodeRGB protocol from current tint to a custom one.
 * @warning This action doesn't support "reverse"
 * @class TintTo
 * @extends ActionInterval
 * @param {Number} duration
 * @param {Number} red 0-255
 * @param {Number} green  0-255
 * @param {Number} blue 0-255
 * @example
 * var action = new cc.TintTo(2, 255, 0, 255);
 */


cc.TintTo = cc.Class({
  name: 'cc.TintTo',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, red, green, blue) {
    this._to = cc.color(0, 0, 0);
    this._from = cc.color(0, 0, 0);

    if (red instanceof cc.Color) {
      blue = red.b;
      green = red.g;
      red = red.r;
    }

    blue !== undefined && this.initWithDuration(duration, red, green, blue);
  },

  /*
   * Initializes the action.
   * @param {Number} duration
   * @param {Number} red 0-255
   * @param {Number} green 0-255
   * @param {Number} blue 0-255
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(duration, red, green, blue) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      this._to = cc.color(red, green, blue);
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.TintTo();

    this._cloneDecoration(action);

    var locTo = this._to;
    action.initWithDuration(this._duration, locTo.r, locTo.g, locTo.b);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    this._from = this.target.color;
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);
    var locFrom = this._from,
        locTo = this._to;

    if (locFrom) {
      this.target.color = cc.color(locFrom.r + (locTo.r - locFrom.r) * dt, locFrom.g + (locTo.g - locFrom.g) * dt, locFrom.b + (locTo.b - locFrom.b) * dt);
    }
  }
});
/**
 * !#en Tints a Node that implements the cc.NodeRGB protocol from current tint to a custom one.
 * !#zh 修改颜色到指定值。
 * @method tintTo
 * @param {Number} duration
 * @param {Number} red 0-255
 * @param {Number} green  0-255
 * @param {Number} blue 0-255
 * @return {ActionInterval}
 * @example
 * // example
 * var action = cc.tintTo(2, 255, 0, 255);
 */

cc.tintTo = function (duration, red, green, blue) {
  return new cc.TintTo(duration, red, green, blue);
};
/* Tints a Node that implements the cc.NodeRGB protocol from current tint to a custom one.
 * Relative to their own color change.
 * @class TintBy
 * @extends ActionInterval
 * @param {Number} duration  duration in seconds
 * @param {Number} deltaRed
 * @param {Number} deltaGreen
 * @param {Number} deltaBlue
 * @example
 * var action = new cc.TintBy(2, -127, -255, -127);
 */


cc.TintBy = cc.Class({
  name: 'cc.TintBy',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, deltaRed, deltaGreen, deltaBlue) {
    this._deltaR = 0;
    this._deltaG = 0;
    this._deltaB = 0;
    this._fromR = 0;
    this._fromG = 0;
    this._fromB = 0;
    deltaBlue !== undefined && this.initWithDuration(duration, deltaRed, deltaGreen, deltaBlue);
  },

  /*
   * Initializes the action.
   * @param {Number} duration
   * @param {Number} deltaRed 0-255
   * @param {Number} deltaGreen 0-255
   * @param {Number} deltaBlue 0-255
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(duration, deltaRed, deltaGreen, deltaBlue) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      this._deltaR = deltaRed;
      this._deltaG = deltaGreen;
      this._deltaB = deltaBlue;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.TintBy();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._deltaR, this._deltaG, this._deltaB);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    var color = target.color;
    this._fromR = color.r;
    this._fromG = color.g;
    this._fromB = color.b;
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);
    this.target.color = cc.color(this._fromR + this._deltaR * dt, this._fromG + this._deltaG * dt, this._fromB + this._deltaB * dt);
  },
  reverse: function reverse() {
    var action = new cc.TintBy(this._duration, -this._deltaR, -this._deltaG, -this._deltaB);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  }
});
/**
 * !#en
 * Tints a Node that implements the cc.NodeRGB protocol from current tint to a custom one.
 * Relative to their own color change.
 * !#zh 按照指定的增量修改颜色。
 * @method tintBy
 * @param {Number} duration  duration in seconds
 * @param {Number} deltaRed
 * @param {Number} deltaGreen
 * @param {Number} deltaBlue
 * @return {ActionInterval}
 * @example
 * // example
 * var action = cc.tintBy(2, -127, -255, -127);
 */

cc.tintBy = function (duration, deltaRed, deltaGreen, deltaBlue) {
  return new cc.TintBy(duration, deltaRed, deltaGreen, deltaBlue);
};
/* Delays the action a certain amount of seconds
 * @class DelayTime
 * @extends ActionInterval
 */


cc.DelayTime = cc.Class({
  name: 'cc.DelayTime',
  "extends": cc.ActionInterval,
  update: function update(dt) {},
  reverse: function reverse() {
    var action = new cc.DelayTime(this._duration);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  },
  clone: function clone() {
    var action = new cc.DelayTime();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration);
    return action;
  }
});
/**
 * !#en Delays the action a certain amount of seconds.
 * !#zh 延迟指定的时间量。
 * @method delayTime
 * @param {Number} d duration in seconds
 * @return {ActionInterval}
 * @example
 * // example
 * var delay = cc.delayTime(1);
 */

cc.delayTime = function (d) {
  return new cc.DelayTime(d);
};
/*
 * <p>
 * Executes an action in reverse order, from time=duration to time=0                                     <br/>
 * @warning Use this action carefully. This action is not sequenceable.                                 <br/>
 * Use it as the default "reversed" method of your own actions, but using it outside the "reversed"      <br/>
 * scope is not recommended.
 * </p>
 * @class ReverseTime
 * @extends ActionInterval
 * @param {FiniteTimeAction} action
 * @example
 *  var reverse = new cc.ReverseTime(this);
 */


cc.ReverseTime = cc.Class({
  name: 'cc.ReverseTime',
  "extends": cc.ActionInterval,
  ctor: function ctor(action) {
    this._other = null;
    action && this.initWithAction(action);
  },

  /*
   * @param {FiniteTimeAction} action
   * @return {Boolean}
   */
  initWithAction: function initWithAction(action) {
    if (!action) {
      cc.errorID(1028);
      return false;
    }

    if (action === this._other) {
      cc.errorID(1029);
      return false;
    }

    if (cc.ActionInterval.prototype.initWithDuration.call(this, action._duration)) {
      // Don't leak if action is reused
      this._other = action;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.ReverseTime();

    this._cloneDecoration(action);

    action.initWithAction(this._other.clone());
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);

    this._other.startWithTarget(target);
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);
    if (this._other) this._other.update(1 - dt);
  },
  reverse: function reverse() {
    return this._other.clone();
  },
  stop: function stop() {
    this._other.stop();

    cc.Action.prototype.stop.call(this);
  }
});
/**
 * !#en Executes an action in reverse order, from time=duration to time=0.
 * !#zh 反转目标动作的时间轴。
 * @method reverseTime
 * @param {FiniteTimeAction} action
 * @return {ActionInterval}
 * @example
 * // example
 *  var reverse = cc.reverseTime(this);
 */

cc.reverseTime = function (action) {
  return new cc.ReverseTime(action);
};
/*
 * <p>
 * Overrides the target of an action so that it always runs on the target<br/>
 * specified at action creation rather than the one specified by runAction.
 * </p>
 * @class TargetedAction
 * @extends ActionInterval
 * @param {Node} target
 * @param {FiniteTimeAction} action
 */


cc.TargetedAction = cc.Class({
  name: 'cc.TargetedAction',
  "extends": cc.ActionInterval,
  ctor: function ctor(target, action) {
    this._action = null;
    this._forcedTarget = null;
    action && this.initWithTarget(target, action);
  },

  /*
   * Init an action with the specified action and forced target
   * @param {Node} target
   * @param {FiniteTimeAction} action
   * @return {Boolean}
   */
  initWithTarget: function initWithTarget(target, action) {
    if (this.initWithDuration(action._duration)) {
      this._forcedTarget = target;
      this._action = action;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.TargetedAction();

    this._cloneDecoration(action);

    action.initWithTarget(this._forcedTarget, this._action.clone());
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);

    this._action.startWithTarget(this._forcedTarget);
  },
  stop: function stop() {
    this._action.stop();
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);

    this._action.update(dt);
  },

  /*
   * return the target that the action will be forced to run with
   * @return {Node}
   */
  getForcedTarget: function getForcedTarget() {
    return this._forcedTarget;
  },

  /*
   * set the target that the action will be forced to run with
   * @param {Node} forcedTarget
   */
  setForcedTarget: function setForcedTarget(forcedTarget) {
    if (this._forcedTarget !== forcedTarget) this._forcedTarget = forcedTarget;
  }
});
/**
 * !#en Create an action with the specified action and forced target.
 * !#zh 用已有动作和一个新的目标节点创建动作。
 * @method targetedAction
 * @param {Node} target
 * @param {FiniteTimeAction} action
 * @return {ActionInterval}
 */

cc.targetedAction = function (target, action) {
  return new cc.TargetedAction(target, action);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9hY3Rpb25zL0NDQWN0aW9uSW50ZXJ2YWwuanMiXSwibmFtZXMiOlsiY2MiLCJBY3Rpb25JbnRlcnZhbCIsIkNsYXNzIiwibmFtZSIsIkZpbml0ZVRpbWVBY3Rpb24iLCJjdG9yIiwiZCIsIk1BWF9WQUxVRSIsIl9lbGFwc2VkIiwiX2ZpcnN0VGljayIsIl9lYXNlTGlzdCIsIl9zcGVlZCIsIl90aW1lc0ZvclJlcGVhdCIsIl9yZXBlYXRGb3JldmVyIiwiX3JlcGVhdE1ldGhvZCIsIl9zcGVlZE1ldGhvZCIsInVuZGVmaW5lZCIsInByb3RvdHlwZSIsImluaXRXaXRoRHVyYXRpb24iLCJjYWxsIiwiZ2V0RWxhcHNlZCIsIl9kdXJhdGlvbiIsIm1hY3JvIiwiRkxUX0VQU0lMT04iLCJpc0RvbmUiLCJfY2xvbmVEZWNvcmF0aW9uIiwiYWN0aW9uIiwiX3JldmVyc2VFYXNlTGlzdCIsImkiLCJsZW5ndGgiLCJwdXNoIiwicmV2ZXJzZSIsImNsb25lIiwiZWFzaW5nIiwiZWFzZU9iaiIsImFyZ3VtZW50cyIsIl9jb21wdXRlRWFzZVRpbWUiLCJkdCIsImxvY0xpc3QiLCJuIiwic3RlcCIsInQiLCJ1cGRhdGUiLCJzdGFydFdpdGhUYXJnZXQiLCJ0YXJnZXQiLCJBY3Rpb24iLCJsb2dJRCIsInNldEFtcGxpdHVkZVJhdGUiLCJhbXAiLCJnZXRBbXBsaXR1ZGVSYXRlIiwic3BlZWQiLCJnZXRTcGVlZCIsInNldFNwZWVkIiwicmVwZWF0IiwidGltZXMiLCJNYXRoIiwicm91bmQiLCJpc05hTiIsInJlcGVhdEZvcmV2ZXIiLCJhY3Rpb25JbnRlcnZhbCIsIlNlcXVlbmNlIiwidGVtcEFycmF5IiwiX2FjdGlvbnMiLCJfc3BsaXQiLCJfbGFzdCIsIl9yZXZlcnNlZCIsInBhcmFtQXJyYXkiLCJBcnJheSIsImVycm9ySUQiLCJsYXN0IiwicHJldiIsImFjdGlvbjEiLCJfYWN0aW9uT25lVHdvIiwiaW5pdFdpdGhUd29BY3Rpb25zIiwiYWN0aW9uT25lIiwiYWN0aW9uVHdvIiwiZHVyYXRpb25PbmUiLCJkdXJhdGlvblR3byIsInN0b3AiLCJuZXdfdCIsImZvdW5kIiwibG9jU3BsaXQiLCJsb2NBY3Rpb25zIiwibG9jTGFzdCIsImFjdGlvbkZvdW5kIiwic2VxdWVuY2UiLCJyZXN1bHQiLCJSZXBlYXQiLCJfdGltZXMiLCJfdG90YWwiLCJfbmV4dER0IiwiX2FjdGlvbkluc3RhbnQiLCJfaW5uZXJBY3Rpb24iLCJpbml0V2l0aEFjdGlvbiIsImR1cmF0aW9uIiwiQWN0aW9uSW5zdGFudCIsImxvY0lubmVyQWN0aW9uIiwibG9jRHVyYXRpb24iLCJsb2NUaW1lcyIsImxvY05leHREdCIsInNldElubmVyQWN0aW9uIiwiZ2V0SW5uZXJBY3Rpb24iLCJSZXBlYXRGb3JldmVyIiwiU3Bhd24iLCJfb25lIiwiX3R3byIsImFjdGlvbjIiLCJyZXQiLCJkMSIsImQyIiwibWF4IiwiZGVsYXlUaW1lIiwic3Bhd24iLCJwU3Bhd24iLCJSb3RhdGVUbyIsInN0YXRpY3MiLCJfcmV2ZXJzZSIsImRzdEFuZ2xlIiwiX3N0YXJ0QW5nbGUiLCJfZHN0QW5nbGUiLCJfYW5nbGUiLCJzdGFydEFuZ2xlIiwiYW5nbGUiLCJyb3RhdGVUbyIsIlJvdGF0ZUJ5IiwiZGVsdGFBbmdsZSIsIl9kZWx0YUFuZ2xlIiwicm90YXRlQnkiLCJNb3ZlQnkiLCJkZWx0YVBvcyIsImRlbHRhWSIsIl9wb3NpdGlvbkRlbHRhIiwidjIiLCJfc3RhcnRQb3NpdGlvbiIsIl9wcmV2aW91c1Bvc2l0aW9uIiwicG9zaXRpb24iLCJ5IiwieCIsImxvY1Bvc1giLCJsb2NQb3NZIiwibG9jU3RhcnRQb3NpdGlvbiIsIkVOQUJMRV9TVEFDS0FCTEVfQUNUSU9OUyIsInRhcmdldFgiLCJ0YXJnZXRZIiwibG9jUHJldmlvdXNQb3NpdGlvbiIsInNldFBvc2l0aW9uIiwibW92ZUJ5IiwiTW92ZVRvIiwiX2VuZFBvc2l0aW9uIiwibW92ZVRvIiwiU2tld1RvIiwic3giLCJzeSIsIl9za2V3WCIsIl9za2V3WSIsIl9zdGFydFNrZXdYIiwiX3N0YXJ0U2tld1kiLCJfZW5kU2tld1giLCJfZW5kU2tld1kiLCJfZGVsdGFYIiwiX2RlbHRhWSIsInNrZXdYIiwic2tld1kiLCJza2V3VG8iLCJTa2V3QnkiLCJkZWx0YVNrZXdYIiwiZGVsdGFTa2V3WSIsInNrZXdCeSIsIkp1bXBCeSIsImhlaWdodCIsImp1bXBzIiwiX2RlbHRhIiwiX2hlaWdodCIsIl9qdW1wcyIsImZyYWMiLCJqdW1wQnkiLCJKdW1wVG8iLCJqdW1wVG8iLCJiZXppZXJBdCIsImEiLCJiIiwiYyIsInBvdyIsIkJlemllckJ5IiwiX2NvbmZpZyIsIm5ld0NvbmZpZ3MiLCJzZWxDb25mIiwibG9jQ29uZmlnIiwieGEiLCJ4YiIsInhjIiwieGQiLCJ5YSIsInliIiwieWMiLCJ5ZCIsIngwIiwieTAiLCJ4MSIsInkxIiwieDIiLCJ5MiIsInIiLCJiZXppZXJCeSIsIkJlemllclRvIiwiX3RvQ29uZmlnIiwibG9jU3RhcnRQb3MiLCJsb2NUb0NvbmZpZyIsInN1YiIsImJlemllclRvIiwiU2NhbGVUbyIsIl9zY2FsZVgiLCJfc2NhbGVZIiwiX3N0YXJ0U2NhbGVYIiwiX3N0YXJ0U2NhbGVZIiwiX2VuZFNjYWxlWCIsIl9lbmRTY2FsZVkiLCJzY2FsZVgiLCJzY2FsZVkiLCJzY2FsZVRvIiwiU2NhbGVCeSIsInNjYWxlQnkiLCJCbGluayIsImJsaW5rcyIsIl9vcmlnaW5hbFN0YXRlIiwic2xpY2UiLCJtIiwib3BhY2l0eSIsImJsaW5rIiwiRmFkZVRvIiwiX3RvT3BhY2l0eSIsIl9mcm9tT3BhY2l0eSIsInRpbWUiLCJmcm9tT3BhY2l0eSIsImZhZGVUbyIsIkZhZGVJbiIsIl9yZXZlcnNlQWN0aW9uIiwiRmFkZU91dCIsImZhZGVJbiIsImZhZGVPdXQiLCJUaW50VG8iLCJyZWQiLCJncmVlbiIsImJsdWUiLCJfdG8iLCJjb2xvciIsIl9mcm9tIiwiQ29sb3IiLCJnIiwibG9jVG8iLCJsb2NGcm9tIiwidGludFRvIiwiVGludEJ5IiwiZGVsdGFSZWQiLCJkZWx0YUdyZWVuIiwiZGVsdGFCbHVlIiwiX2RlbHRhUiIsIl9kZWx0YUciLCJfZGVsdGFCIiwiX2Zyb21SIiwiX2Zyb21HIiwiX2Zyb21CIiwidGludEJ5IiwiRGVsYXlUaW1lIiwiUmV2ZXJzZVRpbWUiLCJfb3RoZXIiLCJyZXZlcnNlVGltZSIsIlRhcmdldGVkQWN0aW9uIiwiX2FjdGlvbiIsIl9mb3JjZWRUYXJnZXQiLCJpbml0V2l0aFRhcmdldCIsImdldEZvcmNlZFRhcmdldCIsInNldEZvcmNlZFRhcmdldCIsImZvcmNlZFRhcmdldCIsInRhcmdldGVkQWN0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FBLEVBQUUsQ0FBQ0MsY0FBSCxHQUFvQkQsRUFBRSxDQUFDRSxLQUFILENBQVM7QUFDekJDLEVBQUFBLElBQUksRUFBRSxtQkFEbUI7QUFFekIsYUFBU0gsRUFBRSxDQUFDSSxnQkFGYTtBQUl6QkMsRUFBQUEsSUFBSSxFQUFDLGNBQVVDLENBQVYsRUFBYTtBQUNkLFNBQUtDLFNBQUwsR0FBaUIsQ0FBakI7QUFDQSxTQUFLQyxRQUFMLEdBQWdCLENBQWhCO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQixLQUFsQjtBQUNBLFNBQUtDLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxTQUFLQyxNQUFMLEdBQWMsQ0FBZDtBQUNBLFNBQUtDLGVBQUwsR0FBdUIsQ0FBdkI7QUFDQSxTQUFLQyxjQUFMLEdBQXNCLEtBQXRCO0FBQ0EsU0FBS0MsYUFBTCxHQUFx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QUFxQ3pCL0wsRUFBQUEsSUFBSSxFQUFDLGdCQUFZO0FBQ2IsU0FBSzhMLE9BQUwsQ0FBYTlMLElBQWI7QUFDSCxHQXZDd0I7QUF5Q3pCcEMsRUFBQUEsTUFBTSxFQUFDLGdCQUFVTCxFQUFWLEVBQWM7QUFDakJBLElBQUFBLEVBQUUsR0FBRyxLQUFLRCxnQkFBTCxDQUFzQkMsRUFBdEIsQ0FBTDs7QUFDQSxTQUFLdU8sT0FBTCxDQUFhbE8sTUFBYixDQUFvQkwsRUFBcEI7QUFDSCxHQTVDd0I7O0FBOEN6QjtBQUNKO0FBQ0E7QUFDQTtBQUNJME8sRUFBQUEsZUFBZSxFQUFDLDJCQUFZO0FBQ3hCLFdBQU8sS0FBS0YsYUFBWjtBQUNILEdBcER3Qjs7QUFzRHpCO0FBQ0o7QUFDQTtBQUNBO0FBQ0lHLEVBQUFBLGVBQWUsRUFBQyx5QkFBVUMsWUFBVixFQUF3QjtBQUNwQyxRQUFJLEtBQUtKLGFBQUwsS0FBdUJJLFlBQTNCLEVBQ0ksS0FBS0osYUFBTCxHQUFxQkksWUFBckI7QUFDUDtBQTdEd0IsQ0FBVCxDQUFwQjtBQWdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBalIsRUFBRSxDQUFDa1IsY0FBSCxHQUFvQixVQUFVdE8sTUFBVixFQUFrQmxCLE1BQWxCLEVBQTBCO0FBQzFDLFNBQU8sSUFBSTFCLEVBQUUsQ0FBQzJRLGNBQVAsQ0FBc0IvTixNQUF0QixFQUE4QmxCLE1BQTlCLENBQVA7QUFDSCxDQUZEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMDgtMjAxMCBSaWNhcmRvIFF1ZXNhZGFcbiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxMiBjb2NvczJkLXgub3JnXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbi8qKlxuICogQG1vZHVsZSBjY1xuICovXG5cbi8qKlxuICogISNlblxuICogPHA+IEFuIGludGVydmFsIGFjdGlvbiBpcyBhbiBhY3Rpb24gdGhhdCB0YWtlcyBwbGFjZSB3aXRoaW4gYSBjZXJ0YWluIHBlcmlvZCBvZiB0aW1lLiA8YnIvPlxuICogSXQgaGFzIGFuIHN0YXJ0IHRpbWUsIGFuZCBhIGZpbmlzaCB0aW1lLiBUaGUgZmluaXNoIHRpbWUgaXMgdGhlIHBhcmFtZXRlcjxici8+XG4gKiBkdXJhdGlvbiBwbHVzIHRoZSBzdGFydCB0aW1lLjwvcD5cbiAqXG4gKiA8cD5UaGVzZSBDQ0FjdGlvbkludGVydmFsIGFjdGlvbnMgaGF2ZSBzb21lIGludGVyZXN0aW5nIHByb3BlcnRpZXMsIGxpa2U6PGJyLz5cbiAqIC0gVGhleSBjYW4gcnVuIG5vcm1hbGx5IChkZWZhdWx0KSAgPGJyLz5cbiAqIC0gVGhleSBjYW4gcnVuIHJldmVyc2VkIHdpdGggdGhlIHJldmVyc2UgbWV0aG9kICAgPGJyLz5cbiAqIC0gVGhleSBjYW4gcnVuIHdpdGggdGhlIHRpbWUgYWx0ZXJlZCB3aXRoIHRoZSBBY2NlbGVyYXRlLCBBY2NlbERlY2NlbCBhbmQgU3BlZWQgYWN0aW9ucy4gPC9wPlxuICpcbiAqIDxwPkZvciBleGFtcGxlLCB5b3UgY2FuIHNpbXVsYXRlIGEgUGluZyBQb25nIGVmZmVjdCBydW5uaW5nIHRoZSBhY3Rpb24gbm9ybWFsbHkgYW5kPGJyLz5cbiAqIHRoZW4gcnVubmluZyBpdCBhZ2FpbiBpbiBSZXZlcnNlIG1vZGUuIDwvcD5cbiAqICEjemgg5pe26Ze06Ze06ZqU5Yqo5L2c77yM6L+Z56eN5Yqo5L2c5Zyo5bey5a6a5pe26Ze05YaF5a6M5oiQ77yM57un5om/IEZpbml0ZVRpbWVBY3Rpb27jgIJcbiAqIEBjbGFzcyBBY3Rpb25JbnRlcnZhbFxuICogQGV4dGVuZHMgRmluaXRlVGltZUFjdGlvblxuICogQHBhcmFtIHtOdW1iZXJ9IGQgZHVyYXRpb24gaW4gc2Vjb25kc1xuICovXG5jYy5BY3Rpb25JbnRlcnZhbCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuQWN0aW9uSW50ZXJ2YWwnLFxuICAgIGV4dGVuZHM6IGNjLkZpbml0ZVRpbWVBY3Rpb24sXG5cbiAgICBjdG9yOmZ1bmN0aW9uIChkKSB7XG4gICAgICAgIHRoaXMuTUFYX1ZBTFVFID0gMjtcbiAgICAgICAgdGhpcy5fZWxhcHNlZCA9IDA7XG4gICAgICAgIHRoaXMuX2ZpcnN0VGljayA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9lYXNlTGlzdCA9IG51bGw7XG4gICAgICAgIHRoaXMuX3NwZWVkID0gMTtcbiAgICAgICAgdGhpcy5fdGltZXNGb3JSZXBlYXQgPSAxO1xuICAgICAgICB0aGlzLl9yZXBlYXRGb3JldmVyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3JlcGVhdE1ldGhvZCA9IGZhbHNlOy8vQ29tcGF0aWJsZSB3aXRoIHJlcGVhdCBjbGFzcywgRGlzY2FyZCBhZnRlciBjYW4gYmUgZGVsZXRlZFxuICAgICAgICB0aGlzLl9zcGVlZE1ldGhvZCA9IGZhbHNlOy8vQ29tcGF0aWJsZSB3aXRoIHJlcGVhdCBjbGFzcywgRGlzY2FyZCBhZnRlciBjYW4gYmUgZGVsZXRlZFxuICAgICAgICBkICE9PSB1bmRlZmluZWQgJiYgY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLmluaXRXaXRoRHVyYXRpb24uY2FsbCh0aGlzLCBkKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBIb3cgbWFueSBzZWNvbmRzIGhhZCBlbGFwc2VkIHNpbmNlIHRoZSBhY3Rpb25zIHN0YXJ0ZWQgdG8gcnVuLlxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRFbGFwc2VkOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsYXBzZWQ7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIGFjdGlvbi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZCBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpbml0V2l0aER1cmF0aW9uOmZ1bmN0aW9uIChkKSB7XG4gICAgICAgIHRoaXMuX2R1cmF0aW9uID0gKGQgPT09IDApID8gY2MubWFjcm8uRkxUX0VQU0lMT04gOiBkO1xuICAgICAgICAvLyBwcmV2ZW50IGRpdmlzaW9uIGJ5IDBcbiAgICAgICAgLy8gVGhpcyBjb21wYXJpc29uIGNvdWxkIGJlIGluIHN0ZXA6LCBidXQgaXQgbWlnaHQgZGVjcmVhc2UgdGhlIHBlcmZvcm1hbmNlXG4gICAgICAgIC8vIGJ5IDMlIGluIGhlYXZ5IGJhc2VkIGFjdGlvbiBnYW1lcy5cbiAgICAgICAgdGhpcy5fZWxhcHNlZCA9IDA7XG4gICAgICAgIHRoaXMuX2ZpcnN0VGljayA9IHRydWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICBpc0RvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuX2VsYXBzZWQgPj0gdGhpcy5fZHVyYXRpb24pO1xuICAgIH0sXG5cbiAgICBfY2xvbmVEZWNvcmF0aW9uOiBmdW5jdGlvbihhY3Rpb24pe1xuICAgICAgICBhY3Rpb24uX3JlcGVhdEZvcmV2ZXIgPSB0aGlzLl9yZXBlYXRGb3JldmVyO1xuICAgICAgICBhY3Rpb24uX3NwZWVkID0gdGhpcy5fc3BlZWQ7XG4gICAgICAgIGFjdGlvbi5fdGltZXNGb3JSZXBlYXQgPSB0aGlzLl90aW1lc0ZvclJlcGVhdDtcbiAgICAgICAgYWN0aW9uLl9lYXNlTGlzdCA9IHRoaXMuX2Vhc2VMaXN0O1xuICAgICAgICBhY3Rpb24uX3NwZWVkTWV0aG9kID0gdGhpcy5fc3BlZWRNZXRob2Q7XG4gICAgICAgIGFjdGlvbi5fcmVwZWF0TWV0aG9kID0gdGhpcy5fcmVwZWF0TWV0aG9kO1xuICAgIH0sXG5cbiAgICBfcmV2ZXJzZUVhc2VMaXN0OiBmdW5jdGlvbihhY3Rpb24pe1xuICAgICAgICBpZih0aGlzLl9lYXNlTGlzdCl7XG4gICAgICAgICAgICBhY3Rpb24uX2Vhc2VMaXN0ID0gW107XG4gICAgICAgICAgICBmb3IodmFyIGk9MDsgaTx0aGlzLl9lYXNlTGlzdC5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgYWN0aW9uLl9lYXNlTGlzdC5wdXNoKHRoaXMuX2Vhc2VMaXN0W2ldLnJldmVyc2UoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLkFjdGlvbkludGVydmFsKHRoaXMuX2R1cmF0aW9uKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gSW1wbGVtZW50YXRpb24gb2YgZWFzZSBtb3Rpb24uXG4gICAgICogISN6aCDnvJPliqjov5DliqjjgIJcbiAgICAgKiBAbWV0aG9kIGVhc2luZ1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlYXNlT2JqXG4gICAgICogQHJldHVybnMge0FjdGlvbkludGVydmFsfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogYWN0aW9uLmVhc2luZyhjYy5lYXNlSW4oMy4wKSk7XG4gICAgICovXG4gICAgZWFzaW5nOiBmdW5jdGlvbiAoZWFzZU9iaikge1xuICAgICAgICBpZiAodGhpcy5fZWFzZUxpc3QpXG4gICAgICAgICAgICB0aGlzLl9lYXNlTGlzdC5sZW5ndGggPSAwO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLl9lYXNlTGlzdCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIHRoaXMuX2Vhc2VMaXN0LnB1c2goYXJndW1lbnRzW2ldKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIF9jb21wdXRlRWFzZVRpbWU6IGZ1bmN0aW9uIChkdCkge1xuICAgICAgICB2YXIgbG9jTGlzdCA9IHRoaXMuX2Vhc2VMaXN0O1xuICAgICAgICBpZiAoKCFsb2NMaXN0KSB8fCAobG9jTGlzdC5sZW5ndGggPT09IDApKVxuICAgICAgICAgICAgcmV0dXJuIGR0O1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbiA9IGxvY0xpc3QubGVuZ3RoOyBpIDwgbjsgaSsrKVxuICAgICAgICAgICAgZHQgPSBsb2NMaXN0W2ldLmVhc2luZyhkdCk7XG4gICAgICAgIHJldHVybiBkdDtcbiAgICB9LFxuXG4gICAgc3RlcDpmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuX2ZpcnN0VGljaykge1xuICAgICAgICAgICAgdGhpcy5fZmlyc3RUaWNrID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl9lbGFwc2VkID0gMDtcbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICB0aGlzLl9lbGFwc2VkICs9IGR0O1xuXG4gICAgICAgIC8vdGhpcy51cGRhdGUoKDEgPiAodGhpcy5fZWxhcHNlZCAvIHRoaXMuX2R1cmF0aW9uKSkgPyB0aGlzLl9lbGFwc2VkIC8gdGhpcy5fZHVyYXRpb24gOiAxKTtcbiAgICAgICAgLy90aGlzLnVwZGF0ZShNYXRoLm1heCgwLCBNYXRoLm1pbigxLCB0aGlzLl9lbGFwc2VkIC8gTWF0aC5tYXgodGhpcy5fZHVyYXRpb24sIGNjLm1hY3JvLkZMVF9FUFNJTE9OKSkpKTtcbiAgICAgICAgdmFyIHQgPSB0aGlzLl9lbGFwc2VkIC8gKHRoaXMuX2R1cmF0aW9uID4gMC4wMDAwMDAxMTkyMDkyODk2ID8gdGhpcy5fZHVyYXRpb24gOiAwLjAwMDAwMDExOTIwOTI4OTYpO1xuICAgICAgICB0ID0gKDEgPiB0ID8gdCA6IDEpO1xuICAgICAgICB0aGlzLnVwZGF0ZSh0ID4gMCA/IHQgOiAwKTtcblxuICAgICAgICAvL0NvbXBhdGlibGUgd2l0aCByZXBlYXQgY2xhc3MsIERpc2NhcmQgYWZ0ZXIgY2FuIGJlIGRlbGV0ZWQgKHRoaXMuX3JlcGVhdE1ldGhvZClcbiAgICAgICAgaWYodGhpcy5fcmVwZWF0TWV0aG9kICYmIHRoaXMuX3RpbWVzRm9yUmVwZWF0ID4gMSAmJiB0aGlzLmlzRG9uZSgpKXtcbiAgICAgICAgICAgIGlmKCF0aGlzLl9yZXBlYXRGb3JldmVyKXtcbiAgICAgICAgICAgICAgICB0aGlzLl90aW1lc0ZvclJlcGVhdC0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy92YXIgZGlmZiA9IGxvY0lubmVyQWN0aW9uLmdldEVsYXBzZWQoKSAtIGxvY0lubmVyQWN0aW9uLl9kdXJhdGlvbjtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRXaXRoVGFyZ2V0KHRoaXMudGFyZ2V0KTtcbiAgICAgICAgICAgIC8vIHRvIHByZXZlbnQgamVyay4gaXNzdWUgIzM5MCAsMTI0N1xuICAgICAgICAgICAgLy90aGlzLl9pbm5lckFjdGlvbi5zdGVwKDApO1xuICAgICAgICAgICAgLy90aGlzLl9pbm5lckFjdGlvbi5zdGVwKGRpZmYpO1xuICAgICAgICAgICAgdGhpcy5zdGVwKHRoaXMuX2VsYXBzZWQgLSB0aGlzLl9kdXJhdGlvbik7XG5cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGFydFdpdGhUYXJnZXQ6ZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBjYy5BY3Rpb24ucHJvdG90eXBlLnN0YXJ0V2l0aFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XG4gICAgICAgIHRoaXMuX2VsYXBzZWQgPSAwO1xuICAgICAgICB0aGlzLl9maXJzdFRpY2sgPSB0cnVlO1xuICAgIH0sXG5cbiAgICByZXZlcnNlOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MubG9nSUQoMTAxMCk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIFNldCBhbXBsaXR1ZGUgcmF0ZS5cbiAgICAgKiBAd2FybmluZyBJdCBzaG91bGQgYmUgb3ZlcnJpZGRlbiBpbiBzdWJjbGFzcy5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYW1wXG4gICAgICovXG4gICAgc2V0QW1wbGl0dWRlUmF0ZTpmdW5jdGlvbiAoYW1wKSB7XG4gICAgICAgIC8vIEFic3RyYWN0IGNsYXNzIG5lZWRzIGltcGxlbWVudGF0aW9uXG4gICAgICAgIGNjLmxvZ0lEKDEwMTEpO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEdldCBhbXBsaXR1ZGUgcmF0ZS5cbiAgICAgKiBAd2FybmluZyBJdCBzaG91bGQgYmUgb3ZlcnJpZGRlbiBpbiBzdWJjbGFzcy5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IDBcbiAgICAgKi9cbiAgICBnZXRBbXBsaXR1ZGVSYXRlOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gQWJzdHJhY3QgY2xhc3MgbmVlZHMgaW1wbGVtZW50YXRpb25cbiAgICAgICAgY2MubG9nSUQoMTAxMik7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ2hhbmdlcyB0aGUgc3BlZWQgb2YgYW4gYWN0aW9uLCBtYWtpbmcgaXQgdGFrZSBsb25nZXIgKHNwZWVkPjEpXG4gICAgICogb3IgbGVzcyAoc3BlZWQ8MSkgdGltZS4gPGJyLz5cbiAgICAgKiBVc2VmdWwgdG8gc2ltdWxhdGUgJ3Nsb3cgbW90aW9uJyBvciAnZmFzdCBmb3J3YXJkJyBlZmZlY3QuXG4gICAgICogISN6aFxuICAgICAqIOaUueWPmOS4gOS4quWKqOS9nOeahOmAn+W6pu+8jOS9v+Wug+eahOaJp+ihjOS9v+eUqOabtOmVv+eahOaXtumXtO+8iHNwZWVkID4gMe+8iTxici8+XG4gICAgICog5oiW5pu05bCR77yIc3BlZWQgPCAx77yJ5Y+v5Lul5pyJ5pWI5b6X5qih5ouf4oCc5oWi5Yqo5L2c4oCd5oiW4oCc5b+r6L+b4oCd55qE5pWI5p6c44CCXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwZWVkXG4gICAgICogQHJldHVybnMge0FjdGlvbn1cbiAgICAgKi9cbiAgICBzcGVlZDogZnVuY3Rpb24oc3BlZWQpe1xuICAgICAgICBpZihzcGVlZCA8PSAwKXtcbiAgICAgICAgICAgIGNjLmxvZ0lEKDEwMTMpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zcGVlZE1ldGhvZCA9IHRydWU7Ly9Db21wYXRpYmxlIHdpdGggcmVwZWF0IGNsYXNzLCBEaXNjYXJkIGFmdGVyIGNhbiBiZSBkZWxldGVkXG4gICAgICAgIHRoaXMuX3NwZWVkICo9IHNwZWVkO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoaXMgYWN0aW9uIHNwZWVkLlxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRTcGVlZDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NwZWVkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhpcyBhY3Rpb24gc3BlZWQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwZWVkXG4gICAgICogQHJldHVybnMge0FjdGlvbkludGVydmFsfVxuICAgICAqL1xuICAgIHNldFNwZWVkOiBmdW5jdGlvbihzcGVlZCl7XG4gICAgICAgIHRoaXMuX3NwZWVkID0gc3BlZWQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmVwZWF0cyBhbiBhY3Rpb24gYSBudW1iZXIgb2YgdGltZXMuXG4gICAgICogVG8gcmVwZWF0IGFuIGFjdGlvbiBmb3JldmVyIHVzZSB0aGUgQ0NSZXBlYXRGb3JldmVyIGFjdGlvbi5cbiAgICAgKiAhI3poIOmHjeWkjeWKqOS9nOWPr+S7peaMieS4gOWumuasoeaVsOmHjeWkjeS4gOS4quWKqOS9nO+8jOS9v+eUqCBSZXBlYXRGb3JldmVyIOWKqOS9nOadpeawuOi/nOmHjeWkjeS4gOS4quWKqOS9nOOAglxuICAgICAqIEBtZXRob2QgcmVwZWF0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVzXG4gICAgICogQHJldHVybnMge0FjdGlvbkludGVydmFsfVxuICAgICAqL1xuICAgIHJlcGVhdDogZnVuY3Rpb24odGltZXMpe1xuICAgICAgICB0aW1lcyA9IE1hdGgucm91bmQodGltZXMpO1xuICAgICAgICBpZihpc05hTih0aW1lcykgfHwgdGltZXMgPCAxKXtcbiAgICAgICAgICAgIGNjLmxvZ0lEKDEwMTQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcmVwZWF0TWV0aG9kID0gdHJ1ZTsvL0NvbXBhdGlibGUgd2l0aCByZXBlYXQgY2xhc3MsIERpc2NhcmQgYWZ0ZXIgY2FuIGJlIGRlbGV0ZWRcbiAgICAgICAgdGhpcy5fdGltZXNGb3JSZXBlYXQgKj0gdGltZXM7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmVwZWF0cyBhbiBhY3Rpb24gZm9yIGV2ZXIuICA8YnIvPlxuICAgICAqIFRvIHJlcGVhdCB0aGUgYW4gYWN0aW9uIGZvciBhIGxpbWl0ZWQgbnVtYmVyIG9mIHRpbWVzIHVzZSB0aGUgUmVwZWF0IGFjdGlvbi4gPGJyLz5cbiAgICAgKiAhI3poIOawuOi/nOWcsOmHjeWkjeS4gOS4quWKqOS9nO+8jOaciemZkOasoeaVsOWGhemHjeWkjeS4gOS4quWKqOS9nOivt+S9v+eUqCBSZXBlYXQg5Yqo5L2c44CCXG4gICAgICogQG1ldGhvZCByZXBlYXRGb3JldmVyXG4gICAgICogQHJldHVybnMge0FjdGlvbkludGVydmFsfVxuICAgICAqL1xuICAgIHJlcGVhdEZvcmV2ZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3JlcGVhdE1ldGhvZCA9IHRydWU7Ly9Db21wYXRpYmxlIHdpdGggcmVwZWF0IGNsYXNzLCBEaXNjYXJkIGFmdGVyIGNhbiBiZSBkZWxldGVkXG4gICAgICAgIHRoaXMuX3RpbWVzRm9yUmVwZWF0ID0gdGhpcy5NQVhfVkFMVUU7XG4gICAgICAgIHRoaXMuX3JlcGVhdEZvcmV2ZXIgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59KTtcblxuY2MuYWN0aW9uSW50ZXJ2YWwgPSBmdW5jdGlvbiAoZCkge1xuICAgIHJldHVybiBuZXcgY2MuQWN0aW9uSW50ZXJ2YWwoZCk7XG59O1xuXG4vKipcbiAqIEBtb2R1bGUgY2NcbiAqL1xuXG4vKlxuICogUnVucyBhY3Rpb25zIHNlcXVlbnRpYWxseSwgb25lIGFmdGVyIGFub3RoZXIuXG4gKiBAY2xhc3MgU2VxdWVuY2VcbiAqIEBleHRlbmRzIEFjdGlvbkludGVydmFsXG4gKiBAcGFyYW0ge0FycmF5fEZpbml0ZVRpbWVBY3Rpb259IHRlbXBBcnJheVxuICogQGV4YW1wbGVcbiAqIC8vIGNyZWF0ZSBzZXF1ZW5jZSB3aXRoIGFjdGlvbnNcbiAqIHZhciBzZXEgPSBuZXcgY2MuU2VxdWVuY2UoYWN0MSwgYWN0Mik7XG4gKlxuICogLy8gY3JlYXRlIHNlcXVlbmNlIHdpdGggYXJyYXlcbiAqIHZhciBzZXEgPSBuZXcgY2MuU2VxdWVuY2UoYWN0QXJyYXkpO1xuICovXG5jYy5TZXF1ZW5jZSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuU2VxdWVuY2UnLFxuICAgIGV4dGVuZHM6IGNjLkFjdGlvbkludGVydmFsLFxuXG4gICAgY3RvcjpmdW5jdGlvbiAodGVtcEFycmF5KSB7XG4gICAgICAgIHRoaXMuX2FjdGlvbnMgPSBbXTtcbiAgICAgICAgdGhpcy5fc3BsaXQgPSBudWxsO1xuICAgICAgICB0aGlzLl9sYXN0ID0gMDtcbiAgICAgICAgdGhpcy5fcmV2ZXJzZWQgPSBmYWxzZTtcblxuICAgICAgICB2YXIgcGFyYW1BcnJheSA9ICh0ZW1wQXJyYXkgaW5zdGFuY2VvZiBBcnJheSkgPyB0ZW1wQXJyYXkgOiBhcmd1bWVudHM7XG4gICAgICAgIGlmIChwYXJhbUFycmF5Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgxMDE5KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGFzdCA9IHBhcmFtQXJyYXkubGVuZ3RoIC0gMTtcbiAgICAgICAgaWYgKChsYXN0ID49IDApICYmIChwYXJhbUFycmF5W2xhc3RdID09IG51bGwpKVxuICAgICAgICAgICAgY2MubG9nSUQoMTAxNSk7XG5cbiAgICAgICAgaWYgKGxhc3QgPj0gMCkge1xuICAgICAgICAgICAgdmFyIHByZXYgPSBwYXJhbUFycmF5WzBdLCBhY3Rpb24xO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsYXN0OyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyYW1BcnJheVtpXSkge1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb24xID0gcHJldjtcbiAgICAgICAgICAgICAgICAgICAgcHJldiA9IGNjLlNlcXVlbmNlLl9hY3Rpb25PbmVUd28oYWN0aW9uMSwgcGFyYW1BcnJheVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pbml0V2l0aFR3b0FjdGlvbnMocHJldiwgcGFyYW1BcnJheVtsYXN0XSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgYWN0aW9uIDxici8+XG4gICAgICogQHBhcmFtIHtGaW5pdGVUaW1lQWN0aW9ufSBhY3Rpb25PbmVcbiAgICAgKiBAcGFyYW0ge0Zpbml0ZVRpbWVBY3Rpb259IGFjdGlvblR3b1xuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaW5pdFdpdGhUd29BY3Rpb25zOmZ1bmN0aW9uIChhY3Rpb25PbmUsIGFjdGlvblR3bykge1xuICAgICAgICBpZiAoIWFjdGlvbk9uZSB8fCAhYWN0aW9uVHdvKSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDEwMjUpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGR1cmF0aW9uT25lID0gYWN0aW9uT25lLl9kdXJhdGlvbiwgZHVyYXRpb25Ud28gPSBhY3Rpb25Ud28uX2R1cmF0aW9uO1xuICAgICAgICBkdXJhdGlvbk9uZSAqPSBhY3Rpb25PbmUuX3JlcGVhdE1ldGhvZCA/IGFjdGlvbk9uZS5fdGltZXNGb3JSZXBlYXQgOiAxO1xuICAgICAgICBkdXJhdGlvblR3byAqPSBhY3Rpb25Ud28uX3JlcGVhdE1ldGhvZCA/IGFjdGlvblR3by5fdGltZXNGb3JSZXBlYXQgOiAxO1xuICAgICAgICB2YXIgZCA9IGR1cmF0aW9uT25lICsgZHVyYXRpb25Ud287XG4gICAgICAgIHRoaXMuaW5pdFdpdGhEdXJhdGlvbihkKTtcblxuICAgICAgICB0aGlzLl9hY3Rpb25zWzBdID0gYWN0aW9uT25lO1xuICAgICAgICB0aGlzLl9hY3Rpb25zWzFdID0gYWN0aW9uVHdvO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgY2xvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLlNlcXVlbmNlKCk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICBhY3Rpb24uaW5pdFdpdGhUd29BY3Rpb25zKHRoaXMuX2FjdGlvbnNbMF0uY2xvbmUoKSwgdGhpcy5fYWN0aW9uc1sxXS5jbG9uZSgpKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9LFxuXG4gICAgc3RhcnRXaXRoVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLnN0YXJ0V2l0aFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XG4gICAgICAgIHRoaXMuX3NwbGl0ID0gdGhpcy5fYWN0aW9uc1swXS5fZHVyYXRpb24gLyB0aGlzLl9kdXJhdGlvbjtcbiAgICAgICAgdGhpcy5fc3BsaXQgKj0gdGhpcy5fYWN0aW9uc1swXS5fcmVwZWF0TWV0aG9kID8gdGhpcy5fYWN0aW9uc1swXS5fdGltZXNGb3JSZXBlYXQgOiAxO1xuICAgICAgICB0aGlzLl9sYXN0ID0gLTE7XG4gICAgfSxcblxuICAgIHN0b3A6ZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBJc3N1ZSAjMTMwNVxuICAgICAgICBpZiAodGhpcy5fbGFzdCAhPT0gLTEpXG4gICAgICAgICAgICB0aGlzLl9hY3Rpb25zW3RoaXMuX2xhc3RdLnN0b3AoKTtcbiAgICAgICAgY2MuQWN0aW9uLnByb3RvdHlwZS5zdG9wLmNhbGwodGhpcyk7XG4gICAgfSxcblxuICAgIHVwZGF0ZTpmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgdmFyIG5ld190LCBmb3VuZCA9IDA7XG4gICAgICAgIHZhciBsb2NTcGxpdCA9IHRoaXMuX3NwbGl0LCBsb2NBY3Rpb25zID0gdGhpcy5fYWN0aW9ucywgbG9jTGFzdCA9IHRoaXMuX2xhc3QsIGFjdGlvbkZvdW5kO1xuXG4gICAgICAgIGR0ID0gdGhpcy5fY29tcHV0ZUVhc2VUaW1lKGR0KTtcbiAgICAgICAgaWYgKGR0IDwgbG9jU3BsaXQpIHtcbiAgICAgICAgICAgIC8vIGFjdGlvblswXVxuICAgICAgICAgICAgbmV3X3QgPSAobG9jU3BsaXQgIT09IDApID8gZHQgLyBsb2NTcGxpdCA6IDE7XG5cbiAgICAgICAgICAgIGlmIChmb3VuZCA9PT0gMCAmJiBsb2NMYXN0ID09PSAxICYmIHRoaXMuX3JldmVyc2VkKSB7XG4gICAgICAgICAgICAgICAgLy8gUmV2ZXJzZSBtb2RlID9cbiAgICAgICAgICAgICAgICAvLyBYWFg6IEJ1Zy4gdGhpcyBjYXNlIGRvZXNuJ3QgY29udGVtcGxhdGUgd2hlbiBfbGFzdD09LTEsIGZvdW5kPTAgYW5kIGluIFwicmV2ZXJzZSBtb2RlXCJcbiAgICAgICAgICAgICAgICAvLyBzaW5jZSBpdCB3aWxsIHJlcXVpcmUgYSBoYWNrIHRvIGtub3cgaWYgYW4gYWN0aW9uIGlzIG9uIHJldmVyc2UgbW9kZSBvciBub3QuXG4gICAgICAgICAgICAgICAgLy8gXCJzdGVwXCIgc2hvdWxkIGJlIG92ZXJyaWRlbiwgYW5kIHRoZSBcInJldmVyc2VNb2RlXCIgdmFsdWUgcHJvcGFnYXRlZCB0byBpbm5lciBTZXF1ZW5jZXMuXG4gICAgICAgICAgICAgICAgbG9jQWN0aW9uc1sxXS51cGRhdGUoMCk7XG4gICAgICAgICAgICAgICAgbG9jQWN0aW9uc1sxXS5zdG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBhY3Rpb25bMV1cbiAgICAgICAgICAgIGZvdW5kID0gMTtcbiAgICAgICAgICAgIG5ld190ID0gKGxvY1NwbGl0ID09PSAxKSA/IDEgOiAoZHQgLSBsb2NTcGxpdCkgLyAoMSAtIGxvY1NwbGl0KTtcblxuICAgICAgICAgICAgaWYgKGxvY0xhc3QgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gYWN0aW9uWzBdIHdhcyBza2lwcGVkLCBleGVjdXRlIGl0LlxuICAgICAgICAgICAgICAgIGxvY0FjdGlvbnNbMF0uc3RhcnRXaXRoVGFyZ2V0KHRoaXMudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICBsb2NBY3Rpb25zWzBdLnVwZGF0ZSgxKTtcbiAgICAgICAgICAgICAgICBsb2NBY3Rpb25zWzBdLnN0b3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsb2NMYXN0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gc3dpdGNoaW5nIHRvIGFjdGlvbiAxLiBzdG9wIGFjdGlvbiAwLlxuICAgICAgICAgICAgICAgIGxvY0FjdGlvbnNbMF0udXBkYXRlKDEpO1xuICAgICAgICAgICAgICAgIGxvY0FjdGlvbnNbMF0uc3RvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYWN0aW9uRm91bmQgPSBsb2NBY3Rpb25zW2ZvdW5kXTtcbiAgICAgICAgLy8gTGFzdCBhY3Rpb24gZm91bmQgYW5kIGl0IGlzIGRvbmUuXG4gICAgICAgIGlmIChsb2NMYXN0ID09PSBmb3VuZCAmJiBhY3Rpb25Gb3VuZC5pc0RvbmUoKSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAvLyBMYXN0IGFjdGlvbiBub3QgZm91bmRcbiAgICAgICAgaWYgKGxvY0xhc3QgIT09IGZvdW5kKVxuICAgICAgICAgICAgYWN0aW9uRm91bmQuc3RhcnRXaXRoVGFyZ2V0KHRoaXMudGFyZ2V0KTtcblxuICAgICAgICBuZXdfdCA9IG5ld190ICogYWN0aW9uRm91bmQuX3RpbWVzRm9yUmVwZWF0O1xuICAgICAgICBhY3Rpb25Gb3VuZC51cGRhdGUobmV3X3QgPiAxID8gbmV3X3QgJSAxIDogbmV3X3QpO1xuICAgICAgICB0aGlzLl9sYXN0ID0gZm91bmQ7XG4gICAgfSxcblxuICAgIHJldmVyc2U6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gY2MuU2VxdWVuY2UuX2FjdGlvbk9uZVR3byh0aGlzLl9hY3Rpb25zWzFdLnJldmVyc2UoKSwgdGhpcy5fYWN0aW9uc1swXS5yZXZlcnNlKCkpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgdGhpcy5fcmV2ZXJzZUVhc2VMaXN0KGFjdGlvbik7XG4gICAgICAgIGFjdGlvbi5fcmV2ZXJzZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqICEjZW5cbiAqIEhlbHBlciBjb25zdHJ1Y3RvciB0byBjcmVhdGUgYW4gYXJyYXkgb2Ygc2VxdWVuY2VhYmxlIGFjdGlvbnNcbiAqIFRoZSBjcmVhdGVkIGFjdGlvbiB3aWxsIHJ1biBhY3Rpb25zIHNlcXVlbnRpYWxseSwgb25lIGFmdGVyIGFub3RoZXIuXG4gKiAhI3poIOmhuuW6j+aJp+ihjOWKqOS9nO+8jOWIm+W7uueahOWKqOS9nOWwhuaMiemhuuW6j+S+neasoei/kOihjOOAglxuICogQG1ldGhvZCBzZXF1ZW5jZVxuICogQHBhcmFtIHtGaW5pdGVUaW1lQWN0aW9ufEZpbml0ZVRpbWVBY3Rpb25bXX0gYWN0aW9uT3JBY3Rpb25BcnJheVxuICogQHBhcmFtIHtGaW5pdGVUaW1lQWN0aW9ufSAuLi50ZW1wQXJyYXlcbiAqIEByZXR1cm4ge0FjdGlvbkludGVydmFsfVxuICogQGV4YW1wbGVcbiAqIC8vIGV4YW1wbGVcbiAqIC8vIGNyZWF0ZSBzZXF1ZW5jZSB3aXRoIGFjdGlvbnNcbiAqIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShhY3QxLCBhY3QyKTtcbiAqXG4gKiAvLyBjcmVhdGUgc2VxdWVuY2Ugd2l0aCBhcnJheVxuICogdmFyIHNlcSA9IGNjLnNlcXVlbmNlKGFjdEFycmF5KTtcbiAqL1xuLy8gdG9kbzogSXQgc2hvdWxkIGJlIHVzZSBuZXdcbmNjLnNlcXVlbmNlID0gZnVuY3Rpb24gKC8qTXVsdGlwbGUgQXJndW1lbnRzKi90ZW1wQXJyYXkpIHtcbiAgICB2YXIgcGFyYW1BcnJheSA9ICh0ZW1wQXJyYXkgaW5zdGFuY2VvZiBBcnJheSkgPyB0ZW1wQXJyYXkgOiBhcmd1bWVudHM7XG4gICAgaWYgKHBhcmFtQXJyYXkubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGNjLmVycm9ySUQoMTAxOSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB2YXIgbGFzdCA9IHBhcmFtQXJyYXkubGVuZ3RoIC0gMTtcbiAgICBpZiAoKGxhc3QgPj0gMCkgJiYgKHBhcmFtQXJyYXlbbGFzdF0gPT0gbnVsbCkpXG4gICAgICAgIGNjLmxvZ0lEKDEwMTUpO1xuXG4gICAgdmFyIHJlc3VsdCA9IG51bGw7XG4gICAgaWYgKGxhc3QgPj0gMCkge1xuICAgICAgICByZXN1bHQgPSBwYXJhbUFycmF5WzBdO1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSBsYXN0OyBpKyspIHtcbiAgICAgICAgICAgIGlmIChwYXJhbUFycmF5W2ldKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gY2MuU2VxdWVuY2UuX2FjdGlvbk9uZVR3byhyZXN1bHQsIHBhcmFtQXJyYXlbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmNjLlNlcXVlbmNlLl9hY3Rpb25PbmVUd28gPSBmdW5jdGlvbiAoYWN0aW9uT25lLCBhY3Rpb25Ud28pIHtcbiAgICB2YXIgc2VxdWVuY2UgPSBuZXcgY2MuU2VxdWVuY2UoKTtcbiAgICBzZXF1ZW5jZS5pbml0V2l0aFR3b0FjdGlvbnMoYWN0aW9uT25lLCBhY3Rpb25Ud28pO1xuICAgIHJldHVybiBzZXF1ZW5jZTtcbn07XG5cbi8qXG4gKiBSZXBlYXRzIGFuIGFjdGlvbiBhIG51bWJlciBvZiB0aW1lcy5cbiAqIFRvIHJlcGVhdCBhbiBhY3Rpb24gZm9yZXZlciB1c2UgdGhlIENDUmVwZWF0Rm9yZXZlciBhY3Rpb24uXG4gKiBAY2xhc3MgUmVwZWF0XG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnRlcnZhbFxuICogQHBhcmFtIHtGaW5pdGVUaW1lQWN0aW9ufSBhY3Rpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lc1xuICogQGV4YW1wbGVcbiAqIHZhciByZXAgPSBuZXcgY2MuUmVwZWF0KGNjLnNlcXVlbmNlKGp1bXAyLCBqdW1wMSksIDUpO1xuICovXG5jYy5SZXBlYXQgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlJlcGVhdCcsXG4gICAgZXh0ZW5kczogY2MuQWN0aW9uSW50ZXJ2YWwsXG5cbiAgICBjdG9yOiBmdW5jdGlvbiAoYWN0aW9uLCB0aW1lcykge1xuICAgICAgICB0aGlzLl90aW1lcyA9IDA7XG4gICAgICAgIHRoaXMuX3RvdGFsID0gMDtcbiAgICAgICAgdGhpcy5fbmV4dER0ID0gMDtcbiAgICAgICAgdGhpcy5fYWN0aW9uSW5zdGFudCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pbm5lckFjdGlvbiA9IG51bGw7XG5cdFx0dGltZXMgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmluaXRXaXRoQWN0aW9uKGFjdGlvbiwgdGltZXMpO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEBwYXJhbSB7RmluaXRlVGltZUFjdGlvbn0gYWN0aW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVzXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpbml0V2l0aEFjdGlvbjpmdW5jdGlvbiAoYWN0aW9uLCB0aW1lcykge1xuICAgICAgICB2YXIgZHVyYXRpb24gPSBhY3Rpb24uX2R1cmF0aW9uICogdGltZXM7XG5cbiAgICAgICAgaWYgKHRoaXMuaW5pdFdpdGhEdXJhdGlvbihkdXJhdGlvbikpIHtcbiAgICAgICAgICAgIHRoaXMuX3RpbWVzID0gdGltZXM7XG4gICAgICAgICAgICB0aGlzLl9pbm5lckFjdGlvbiA9IGFjdGlvbjtcbiAgICAgICAgICAgIGlmIChhY3Rpb24gaW5zdGFuY2VvZiBjYy5BY3Rpb25JbnN0YW50KXtcbiAgICAgICAgICAgICAgICB0aGlzLl9hY3Rpb25JbnN0YW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl90aW1lcyAtPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdG90YWwgPSAwO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBjbG9uZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuUmVwZWF0KCk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICBhY3Rpb24uaW5pdFdpdGhBY3Rpb24odGhpcy5faW5uZXJBY3Rpb24uY2xvbmUoKSwgdGhpcy5fdGltZXMpO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBzdGFydFdpdGhUYXJnZXQ6ZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICB0aGlzLl90b3RhbCA9IDA7XG4gICAgICAgIHRoaXMuX25leHREdCA9IHRoaXMuX2lubmVyQWN0aW9uLl9kdXJhdGlvbiAvIHRoaXMuX2R1cmF0aW9uO1xuICAgICAgICBjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcbiAgICAgICAgdGhpcy5faW5uZXJBY3Rpb24uc3RhcnRXaXRoVGFyZ2V0KHRhcmdldCk7XG4gICAgfSxcblxuICAgIHN0b3A6ZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9pbm5lckFjdGlvbi5zdG9wKCk7XG4gICAgICAgIGNjLkFjdGlvbi5wcm90b3R5cGUuc3RvcC5jYWxsKHRoaXMpO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6ZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIGR0ID0gdGhpcy5fY29tcHV0ZUVhc2VUaW1lKGR0KTtcbiAgICAgICAgdmFyIGxvY0lubmVyQWN0aW9uID0gdGhpcy5faW5uZXJBY3Rpb247XG4gICAgICAgIHZhciBsb2NEdXJhdGlvbiA9IHRoaXMuX2R1cmF0aW9uO1xuICAgICAgICB2YXIgbG9jVGltZXMgPSB0aGlzLl90aW1lcztcbiAgICAgICAgdmFyIGxvY05leHREdCA9IHRoaXMuX25leHREdDtcblxuICAgICAgICBpZiAoZHQgPj0gbG9jTmV4dER0KSB7XG4gICAgICAgICAgICB3aGlsZSAoZHQgPiBsb2NOZXh0RHQgJiYgdGhpcy5fdG90YWwgPCBsb2NUaW1lcykge1xuICAgICAgICAgICAgICAgIGxvY0lubmVyQWN0aW9uLnVwZGF0ZSgxKTtcbiAgICAgICAgICAgICAgICB0aGlzLl90b3RhbCsrO1xuICAgICAgICAgICAgICAgIGxvY0lubmVyQWN0aW9uLnN0b3AoKTtcbiAgICAgICAgICAgICAgICBsb2NJbm5lckFjdGlvbi5zdGFydFdpdGhUYXJnZXQodGhpcy50YXJnZXQpO1xuICAgICAgICAgICAgICAgIGxvY05leHREdCArPSBsb2NJbm5lckFjdGlvbi5fZHVyYXRpb24gLyBsb2NEdXJhdGlvbjtcbiAgICAgICAgICAgICAgICB0aGlzLl9uZXh0RHQgPSBsb2NOZXh0RHQgPiAxID8gMSA6IGxvY05leHREdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZml4IGZvciBpc3N1ZSAjMTI4OCwgaW5jb3JyZWN0IGVuZCB2YWx1ZSBvZiByZXBlYXRcbiAgICAgICAgICAgIGlmIChkdCA+PSAxLjAgJiYgdGhpcy5fdG90YWwgPCBsb2NUaW1lcykge1xuICAgICAgICAgICAgICAgIC8vIGZpeCBmb3IgY29jb3MtY3JlYXRvci9maXJlYmFsbC9pc3N1ZXMvNDMxMFxuICAgICAgICAgICAgICAgIGxvY0lubmVyQWN0aW9uLnVwZGF0ZSgxKTtcbiAgICAgICAgICAgICAgICB0aGlzLl90b3RhbCsrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBkb24ndCBzZXQgYSBpbnN0YW50IGFjdGlvbiBiYWNrIG9yIHVwZGF0ZSBpdCwgaXQgaGFzIG5vIHVzZSBiZWNhdXNlIGl0IGhhcyBubyBkdXJhdGlvblxuICAgICAgICAgICAgaWYgKCF0aGlzLl9hY3Rpb25JbnN0YW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RvdGFsID09PSBsb2NUaW1lcykge1xuICAgICAgICAgICAgICAgICAgICBsb2NJbm5lckFjdGlvbi5zdG9wKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaXNzdWUgIzM5MCBwcmV2ZW50IGplcmssIHVzZSByaWdodCB1cGRhdGVcbiAgICAgICAgICAgICAgICAgICAgbG9jSW5uZXJBY3Rpb24udXBkYXRlKGR0IC0gKGxvY05leHREdCAtIGxvY0lubmVyQWN0aW9uLl9kdXJhdGlvbiAvIGxvY0R1cmF0aW9uKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9jSW5uZXJBY3Rpb24udXBkYXRlKChkdCAqIGxvY1RpbWVzKSAlIDEuMCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaXNEb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RvdGFsID09PSB0aGlzLl90aW1lcztcbiAgICB9LFxuXG4gICAgcmV2ZXJzZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuUmVwZWF0KHRoaXMuX2lubmVyQWN0aW9uLnJldmVyc2UoKSwgdGhpcy5fdGltZXMpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgdGhpcy5fcmV2ZXJzZUVhc2VMaXN0KGFjdGlvbik7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogU2V0IGlubmVyIEFjdGlvbi5cbiAgICAgKiBAcGFyYW0ge0Zpbml0ZVRpbWVBY3Rpb259IGFjdGlvblxuICAgICAqL1xuICAgIHNldElubmVyQWN0aW9uOmZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgaWYgKHRoaXMuX2lubmVyQWN0aW9uICE9PSBhY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2lubmVyQWN0aW9uID0gYWN0aW9uO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogR2V0IGlubmVyIEFjdGlvbi5cbiAgICAgKiBAcmV0dXJuIHtGaW5pdGVUaW1lQWN0aW9ufVxuICAgICAqL1xuICAgIGdldElubmVyQWN0aW9uOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lubmVyQWN0aW9uO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqICEjZW4gQ3JlYXRlcyBhIFJlcGVhdCBhY3Rpb24uIFRpbWVzIGlzIGFuIHVuc2lnbmVkIGludGVnZXIgYmV0d2VlbiAxIGFuZCBwb3coMiwzMClcbiAqICEjemgg6YeN5aSN5Yqo5L2c77yM5Y+v5Lul5oyJ5LiA5a6a5qyh5pWw6YeN5aSN5LiA5Liq5Yqo77yM5aaC5p6c5oOz5rC46L+c6YeN5aSN5LiA5Liq5Yqo5L2c6K+35L2/55SoIHJlcGVhdEZvcmV2ZXIg5Yqo5L2c5p2l5a6M5oiQ44CCXG4gKiBAbWV0aG9kIHJlcGVhdFxuICogQHBhcmFtIHtGaW5pdGVUaW1lQWN0aW9ufSBhY3Rpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lc1xuICogQHJldHVybiB7QWN0aW9uSW50ZXJ2YWx9XG4gKiBAZXhhbXBsZVxuICogLy8gZXhhbXBsZVxuICogdmFyIHJlcCA9IGNjLnJlcGVhdChjYy5zZXF1ZW5jZShqdW1wMiwganVtcDEpLCA1KTtcbiAqL1xuY2MucmVwZWF0ID0gZnVuY3Rpb24gKGFjdGlvbiwgdGltZXMpIHtcbiAgICByZXR1cm4gbmV3IGNjLlJlcGVhdChhY3Rpb24sIHRpbWVzKTtcbn07XG5cblxuLypcbiAqIFJlcGVhdHMgYW4gYWN0aW9uIGZvciBldmVyLiAgPGJyLz5cbiAqIFRvIHJlcGVhdCB0aGUgYW4gYWN0aW9uIGZvciBhIGxpbWl0ZWQgbnVtYmVyIG9mIHRpbWVzIHVzZSB0aGUgUmVwZWF0IGFjdGlvbi4gPGJyLz5cbiAqIEB3YXJuaW5nIFRoaXMgYWN0aW9uIGNhbid0IGJlIFNlcXVlbmNlYWJsZSBiZWNhdXNlIGl0IGlzIG5vdCBhbiBJbnRlcnZhbEFjdGlvblxuICogQGNsYXNzIFJlcGVhdEZvcmV2ZXJcbiAqIEBleHRlbmRzIEFjdGlvbkludGVydmFsXG4gKiBAcGFyYW0ge0Zpbml0ZVRpbWVBY3Rpb259IGFjdGlvblxuICogQGV4YW1wbGVcbiAqIHZhciByZXAgPSBuZXcgY2MuUmVwZWF0Rm9yZXZlcihjYy5zZXF1ZW5jZShqdW1wMiwganVtcDEpLCA1KTtcbiAqL1xuY2MuUmVwZWF0Rm9yZXZlciA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuUmVwZWF0Rm9yZXZlcicsXG4gICAgZXh0ZW5kczogY2MuQWN0aW9uSW50ZXJ2YWwsXG5cbiAgICBjdG9yOmZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgdGhpcy5faW5uZXJBY3Rpb24gPSBudWxsO1xuXHRcdGFjdGlvbiAmJiB0aGlzLmluaXRXaXRoQWN0aW9uKGFjdGlvbik7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogQHBhcmFtIHtBY3Rpb25JbnRlcnZhbH0gYWN0aW9uXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpbml0V2l0aEFjdGlvbjpmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgIGlmICghYWN0aW9uKSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDEwMjYpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faW5uZXJBY3Rpb24gPSBhY3Rpb247XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICBjbG9uZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuUmVwZWF0Rm9yZXZlcigpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoQWN0aW9uKHRoaXMuX2lubmVyQWN0aW9uLmNsb25lKCkpO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBzdGFydFdpdGhUYXJnZXQ6ZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcbiAgICAgICAgdGhpcy5faW5uZXJBY3Rpb24uc3RhcnRXaXRoVGFyZ2V0KHRhcmdldCk7XG4gICAgfSxcblxuICAgIHN0ZXA6ZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIHZhciBsb2NJbm5lckFjdGlvbiA9IHRoaXMuX2lubmVyQWN0aW9uO1xuICAgICAgICBsb2NJbm5lckFjdGlvbi5zdGVwKGR0KTtcbiAgICAgICAgaWYgKGxvY0lubmVyQWN0aW9uLmlzRG9uZSgpKSB7XG4gICAgICAgICAgICAvL3ZhciBkaWZmID0gbG9jSW5uZXJBY3Rpb24uZ2V0RWxhcHNlZCgpIC0gbG9jSW5uZXJBY3Rpb24uX2R1cmF0aW9uO1xuICAgICAgICAgICAgbG9jSW5uZXJBY3Rpb24uc3RhcnRXaXRoVGFyZ2V0KHRoaXMudGFyZ2V0KTtcbiAgICAgICAgICAgIC8vIHRvIHByZXZlbnQgamVyay4gaXNzdWUgIzM5MCAsMTI0N1xuICAgICAgICAgICAgLy90aGlzLl9pbm5lckFjdGlvbi5zdGVwKDApO1xuICAgICAgICAgICAgLy90aGlzLl9pbm5lckFjdGlvbi5zdGVwKGRpZmYpO1xuICAgICAgICAgICAgbG9jSW5uZXJBY3Rpb24uc3RlcChsb2NJbm5lckFjdGlvbi5nZXRFbGFwc2VkKCkgLSBsb2NJbm5lckFjdGlvbi5fZHVyYXRpb24pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGlzRG9uZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgcmV2ZXJzZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuUmVwZWF0Rm9yZXZlcih0aGlzLl9pbm5lckFjdGlvbi5yZXZlcnNlKCkpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgdGhpcy5fcmV2ZXJzZUVhc2VMaXN0KGFjdGlvbik7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogU2V0IGlubmVyIGFjdGlvbi5cbiAgICAgKiBAcGFyYW0ge0FjdGlvbkludGVydmFsfSBhY3Rpb25cbiAgICAgKi9cbiAgICBzZXRJbm5lckFjdGlvbjpmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbm5lckFjdGlvbiAhPT0gYWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9pbm5lckFjdGlvbiA9IGFjdGlvbjtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEdldCBpbm5lciBhY3Rpb24uXG4gICAgICogQHJldHVybiB7QWN0aW9uSW50ZXJ2YWx9XG4gICAgICovXG4gICAgZ2V0SW5uZXJBY3Rpb246ZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW5uZXJBY3Rpb247XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlbiBDcmVhdGUgYSBhY3RvbiB3aGljaCByZXBlYXQgZm9yZXZlciwgYXMgaXQgcnVucyBmb3JldmVyLCBpdCBjYW4ndCBiZSBhZGRlZCBpbnRvIGNjLnNlcXVlbmNlIGFuZCBjYy5zcGF3bi5cbiAqICEjemgg5rC46L+c5Zyw6YeN5aSN5LiA5Liq5Yqo5L2c77yM5pyJ6ZmQ5qyh5pWw5YaF6YeN5aSN5LiA5Liq5Yqo5L2c6K+35L2/55SoIHJlcGVhdCDliqjkvZzvvIznlLHkuo7ov5nkuKrliqjkvZzkuI3kvJrlgZzmraLvvIzmiYDku6XkuI3og73ooqvmt7vliqDliLAgY2Muc2VxdWVuY2Ug5oiWIGNjLnNwYXduIOS4reOAglxuICogQG1ldGhvZCByZXBlYXRGb3JldmVyXG4gKiBAcGFyYW0ge0Zpbml0ZVRpbWVBY3Rpb259IGFjdGlvblxuICogQHJldHVybiB7QWN0aW9uSW50ZXJ2YWx9XG4gKiBAZXhhbXBsZVxuICogLy8gZXhhbXBsZVxuICogdmFyIHJlcGVhdCA9IGNjLnJlcGVhdEZvcmV2ZXIoY2Mucm90YXRlQnkoMS4wLCAzNjApKTtcbiAqL1xuY2MucmVwZWF0Rm9yZXZlciA9IGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICByZXR1cm4gbmV3IGNjLlJlcGVhdEZvcmV2ZXIoYWN0aW9uKTtcbn07XG5cblxuLyogXG4gKiBTcGF3biBhIG5ldyBhY3Rpb24gaW1tZWRpYXRlbHlcbiAqIEBjbGFzcyBTcGF3blxuICogQGV4dGVuZHMgQWN0aW9uSW50ZXJ2YWxcbiAqL1xuY2MuU3Bhd24gPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlNwYXduJyxcbiAgICBleHRlbmRzOiBjYy5BY3Rpb25JbnRlcnZhbCxcblxuICAgIGN0b3I6ZnVuY3Rpb24gKHRlbXBBcnJheSkge1xuICAgICAgICB0aGlzLl9vbmUgPSBudWxsO1xuICAgICAgICB0aGlzLl90d28gPSBudWxsO1xuXG5cdFx0dmFyIHBhcmFtQXJyYXkgPSAodGVtcEFycmF5IGluc3RhbmNlb2YgQXJyYXkpID8gdGVtcEFycmF5IDogYXJndW1lbnRzO1xuICAgICAgICBpZiAocGFyYW1BcnJheS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGNjLmVycm9ySUQoMTAyMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblx0XHR2YXIgbGFzdCA9IHBhcmFtQXJyYXkubGVuZ3RoIC0gMTtcblx0XHRpZiAoKGxhc3QgPj0gMCkgJiYgKHBhcmFtQXJyYXlbbGFzdF0gPT0gbnVsbCkpXG5cdFx0XHRjYy5sb2dJRCgxMDE1KTtcblxuICAgICAgICBpZiAobGFzdCA+PSAwKSB7XG4gICAgICAgICAgICB2YXIgcHJldiA9IHBhcmFtQXJyYXlbMF0sIGFjdGlvbjE7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxhc3Q7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChwYXJhbUFycmF5W2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjEgPSBwcmV2O1xuICAgICAgICAgICAgICAgICAgICBwcmV2ID0gY2MuU3Bhd24uX2FjdGlvbk9uZVR3byhhY3Rpb24xLCBwYXJhbUFycmF5W2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmluaXRXaXRoVHdvQWN0aW9ucyhwcmV2LCBwYXJhbUFycmF5W2xhc3RdKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKiBpbml0aWFsaXplcyB0aGUgU3Bhd24gYWN0aW9uIHdpdGggdGhlIDIgYWN0aW9ucyB0byBzcGF3blxuICAgICAqIEBwYXJhbSB7RmluaXRlVGltZUFjdGlvbn0gYWN0aW9uMVxuICAgICAqIEBwYXJhbSB7RmluaXRlVGltZUFjdGlvbn0gYWN0aW9uMlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaW5pdFdpdGhUd29BY3Rpb25zOmZ1bmN0aW9uIChhY3Rpb24xLCBhY3Rpb24yKSB7XG4gICAgICAgIGlmICghYWN0aW9uMSB8fCAhYWN0aW9uMikge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgxMDI3KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXQgPSBmYWxzZTtcblxuICAgICAgICB2YXIgZDEgPSBhY3Rpb24xLl9kdXJhdGlvbjtcbiAgICAgICAgdmFyIGQyID0gYWN0aW9uMi5fZHVyYXRpb247XG5cbiAgICAgICAgaWYgKHRoaXMuaW5pdFdpdGhEdXJhdGlvbihNYXRoLm1heChkMSwgZDIpKSkge1xuICAgICAgICAgICAgdGhpcy5fb25lID0gYWN0aW9uMTtcbiAgICAgICAgICAgIHRoaXMuX3R3byA9IGFjdGlvbjI7XG5cbiAgICAgICAgICAgIGlmIChkMSA+IGQyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdHdvID0gY2MuU2VxdWVuY2UuX2FjdGlvbk9uZVR3byhhY3Rpb24yLCBjYy5kZWxheVRpbWUoZDEgLSBkMikpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkMSA8IGQyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25lID0gY2MuU2VxdWVuY2UuX2FjdGlvbk9uZVR3byhhY3Rpb24xLCBjYy5kZWxheVRpbWUoZDIgLSBkMSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5TcGF3bigpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoVHdvQWN0aW9ucyh0aGlzLl9vbmUuY2xvbmUoKSwgdGhpcy5fdHdvLmNsb25lKCkpO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBzdGFydFdpdGhUYXJnZXQ6ZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcbiAgICAgICAgdGhpcy5fb25lLnN0YXJ0V2l0aFRhcmdldCh0YXJnZXQpO1xuICAgICAgICB0aGlzLl90d28uc3RhcnRXaXRoVGFyZ2V0KHRhcmdldCk7XG4gICAgfSxcblxuICAgIHN0b3A6ZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9vbmUuc3RvcCgpO1xuICAgICAgICB0aGlzLl90d28uc3RvcCgpO1xuICAgICAgICBjYy5BY3Rpb24ucHJvdG90eXBlLnN0b3AuY2FsbCh0aGlzKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOmZ1bmN0aW9uIChkdCkge1xuICAgICAgICBkdCA9IHRoaXMuX2NvbXB1dGVFYXNlVGltZShkdCk7XG4gICAgICAgIGlmICh0aGlzLl9vbmUpXG4gICAgICAgICAgICB0aGlzLl9vbmUudXBkYXRlKGR0KTtcbiAgICAgICAgaWYgKHRoaXMuX3R3bylcbiAgICAgICAgICAgIHRoaXMuX3R3by51cGRhdGUoZHQpO1xuICAgIH0sXG5cbiAgICByZXZlcnNlOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IGNjLlNwYXduLl9hY3Rpb25PbmVUd28odGhpcy5fb25lLnJldmVyc2UoKSwgdGhpcy5fdHdvLnJldmVyc2UoKSk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICB0aGlzLl9yZXZlcnNlRWFzZUxpc3QoYWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuIENyZWF0ZSBhIHNwYXduIGFjdGlvbiB3aGljaCBydW5zIHNldmVyYWwgYWN0aW9ucyBpbiBwYXJhbGxlbC5cbiAqICEjemgg5ZCM5q2l5omn6KGM5Yqo5L2c77yM5ZCM5q2l5omn6KGM5LiA57uE5Yqo5L2c44CCXG4gKiBAbWV0aG9kIHNwYXduXG4gKiBAcGFyYW0ge0Zpbml0ZVRpbWVBY3Rpb258RmluaXRlVGltZUFjdGlvbltdfSBhY3Rpb25PckFjdGlvbkFycmF5XG4gKiBAcGFyYW0ge0Zpbml0ZVRpbWVBY3Rpb259IC4uLnRlbXBBcnJheVxuICogQHJldHVybiB7RmluaXRlVGltZUFjdGlvbn1cbiAqIEBleGFtcGxlXG4gKiAvLyBleGFtcGxlXG4gKiB2YXIgYWN0aW9uID0gY2Muc3Bhd24oY2MuanVtcEJ5KDIsIGNjLnYyKDMwMCwgMCksIDUwLCA0KSwgY2Mucm90YXRlQnkoMiwgNzIwKSk7XG4gKiB0b2RvOiBJdCBzaG91bGQgYmUgdGhlIGRpcmVjdCB1c2UgbmV3XG4gKi9cbmNjLnNwYXduID0gZnVuY3Rpb24gKC8qTXVsdGlwbGUgQXJndW1lbnRzKi90ZW1wQXJyYXkpIHtcbiAgICB2YXIgcGFyYW1BcnJheSA9ICh0ZW1wQXJyYXkgaW5zdGFuY2VvZiBBcnJheSkgPyB0ZW1wQXJyYXkgOiBhcmd1bWVudHM7XG4gICAgaWYgKHBhcmFtQXJyYXkubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGNjLmVycm9ySUQoMTAyMCk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoKHBhcmFtQXJyYXkubGVuZ3RoID4gMCkgJiYgKHBhcmFtQXJyYXlbcGFyYW1BcnJheS5sZW5ndGggLSAxXSA9PSBudWxsKSlcbiAgICAgICAgY2MubG9nSUQoMTAxNSk7XG5cbiAgICB2YXIgcHJldiA9IHBhcmFtQXJyYXlbMF07XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBwYXJhbUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChwYXJhbUFycmF5W2ldICE9IG51bGwpXG4gICAgICAgICAgICBwcmV2ID0gY2MuU3Bhd24uX2FjdGlvbk9uZVR3byhwcmV2LCBwYXJhbUFycmF5W2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHByZXY7XG59O1xuXG5jYy5TcGF3bi5fYWN0aW9uT25lVHdvID0gZnVuY3Rpb24gKGFjdGlvbjEsIGFjdGlvbjIpIHtcbiAgICB2YXIgcFNwYXduID0gbmV3IGNjLlNwYXduKCk7XG4gICAgcFNwYXduLmluaXRXaXRoVHdvQWN0aW9ucyhhY3Rpb24xLCBhY3Rpb24yKTtcbiAgICByZXR1cm4gcFNwYXduO1xufTtcblxuXG4vKlxuICogUm90YXRlcyBhIE5vZGUgb2JqZWN0IHRvIGEgY2VydGFpbiBhbmdsZSBieSBtb2RpZnlpbmcgaXRzIGFuZ2xlIHByb3BlcnR5LiA8YnIvPlxuICogVGhlIGRpcmVjdGlvbiB3aWxsIGJlIGRlY2lkZWQgYnkgdGhlIHNob3J0ZXN0IGFuZ2xlLlxuICogQGNsYXNzIFJvdGF0ZVRvXG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnRlcnZhbFxuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIGR1cmF0aW9uIGluIHNlY29uZHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBkc3RBbmdsZSBkc3RBbmdsZSBpbiBkZWdyZWVzLlxuICogQGV4YW1wbGVcbiAqIHZhciByb3RhdGVUbyA9IG5ldyBjYy5Sb3RhdGVUbygyLCA2MS4wKTtcbiAqL1xuY2MuUm90YXRlVG8gPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlJvdGF0ZVRvJyxcbiAgICBleHRlbmRzOiBjYy5BY3Rpb25JbnRlcnZhbCxcblxuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgX3JldmVyc2U6IGZhbHNlLFxuICAgIH0sXG5cbiAgICBjdG9yOmZ1bmN0aW9uIChkdXJhdGlvbiwgZHN0QW5nbGUpIHtcbiAgICAgICAgdGhpcy5fc3RhcnRBbmdsZSA9IDA7XG4gICAgICAgIHRoaXMuX2RzdEFuZ2xlID0gMDtcbiAgICAgICAgdGhpcy5fYW5nbGUgPSAwO1xuICAgICAgICBkc3RBbmdsZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuaW5pdFdpdGhEdXJhdGlvbihkdXJhdGlvbiwgZHN0QW5nbGUpO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBhY3Rpb24uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGRzdEFuZ2xlXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpbml0V2l0aER1cmF0aW9uOmZ1bmN0aW9uIChkdXJhdGlvbiwgZHN0QW5nbGUpIHtcbiAgICAgICAgaWYgKGNjLkFjdGlvbkludGVydmFsLnByb3RvdHlwZS5pbml0V2l0aER1cmF0aW9uLmNhbGwodGhpcywgZHVyYXRpb24pKSB7XG4gICAgICAgICAgICB0aGlzLl9kc3RBbmdsZSA9IGRzdEFuZ2xlO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBjbG9uZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuUm90YXRlVG8oKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aER1cmF0aW9uKHRoaXMuX2R1cmF0aW9uLCB0aGlzLl9kc3RBbmdsZSk7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIHN0YXJ0V2l0aFRhcmdldDpmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGNjLkFjdGlvbkludGVydmFsLnByb3RvdHlwZS5zdGFydFdpdGhUYXJnZXQuY2FsbCh0aGlzLCB0YXJnZXQpO1xuXG4gICAgICAgIGxldCBzdGFydEFuZ2xlID0gdGFyZ2V0LmFuZ2xlICUgMzYwO1xuXG4gICAgICAgIGxldCBhbmdsZSA9IGNjLlJvdGF0ZVRvLl9yZXZlcnNlID8gKHRoaXMuX2RzdEFuZ2xlIC0gc3RhcnRBbmdsZSkgOiAodGhpcy5fZHN0QW5nbGUgKyBzdGFydEFuZ2xlKTtcbiAgICAgICAgaWYgKGFuZ2xlID4gMTgwKSBhbmdsZSAtPSAzNjA7XG4gICAgICAgIGlmIChhbmdsZSA8IC0xODApIGFuZ2xlICs9IDM2MDtcblxuICAgICAgICB0aGlzLl9zdGFydEFuZ2xlID0gc3RhcnRBbmdsZTtcbiAgICAgICAgdGhpcy5fYW5nbGUgPSBjYy5Sb3RhdGVUby5fcmV2ZXJzZSA/IGFuZ2xlIDogLWFuZ2xlO1xuICAgIH0sXG5cbiAgICByZXZlcnNlOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MubG9nSUQoMTAxNik7XG4gICAgfSxcblxuICAgIHVwZGF0ZTpmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgZHQgPSB0aGlzLl9jb21wdXRlRWFzZVRpbWUoZHQpO1xuICAgICAgICBpZiAodGhpcy50YXJnZXQpIHtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LmFuZ2xlID0gdGhpcy5fc3RhcnRBbmdsZSArIHRoaXMuX2FuZ2xlICogZHQ7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBSb3RhdGVzIGEgTm9kZSBvYmplY3QgdG8gYSBjZXJ0YWluIGFuZ2xlIGJ5IG1vZGlmeWluZyBpdHMgYW5nbGUgcHJvcGVydHkuIDxici8+XG4gKiBUaGUgZGlyZWN0aW9uIHdpbGwgYmUgZGVjaWRlZCBieSB0aGUgc2hvcnRlc3QgYW5nbGUuXG4gKiAhI3poIOaXi+i9rOWIsOebruagh+inkuW6pu+8jOmAmui/h+mAkOW4p+S/ruaUueWug+eahCBhbmdsZSDlsZ7mgKfvvIzml4vovazmlrnlkJHlsIbnlLHmnIDnn63nmoTop5LluqblhrPlrprjgIJcbiAqIEBtZXRob2Qgcm90YXRlVG9cbiAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gKiBAcGFyYW0ge051bWJlcn0gZHN0QW5nbGUgZHN0QW5nbGUgaW4gZGVncmVlcy5cbiAqIEByZXR1cm4ge0FjdGlvbkludGVydmFsfVxuICogQGV4YW1wbGVcbiAqIC8vIGV4YW1wbGVcbiAqIHZhciByb3RhdGVUbyA9IGNjLnJvdGF0ZVRvKDIsIDYxLjApO1xuICovXG5jYy5yb3RhdGVUbyA9IGZ1bmN0aW9uIChkdXJhdGlvbiwgZHN0QW5nbGUpIHtcbiAgICByZXR1cm4gbmV3IGNjLlJvdGF0ZVRvKGR1cmF0aW9uLCBkc3RBbmdsZSk7XG59O1xuXG5cbi8qXG4gKiBSb3RhdGVzIGEgTm9kZSBvYmplY3QgY2xvY2t3aXNlIGEgbnVtYmVyIG9mIGRlZ3JlZXMgYnkgbW9kaWZ5aW5nIGl0cyBhbmdsZSBwcm9wZXJ0eS5cbiAqIFJlbGF0aXZlIHRvIGl0cyBwcm9wZXJ0aWVzIHRvIG1vZGlmeS5cbiAqIEBjbGFzcyBSb3RhdGVCeVxuICogQGV4dGVuZHMgQWN0aW9uSW50ZXJ2YWxcbiAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gKiBAcGFyYW0ge051bWJlcn0gZGVsdGFBbmdsZSBkZWx0YUFuZ2xlIGluIGRlZ3JlZXNcbiAqIEBleGFtcGxlXG4gKiB2YXIgYWN0aW9uQnkgPSBuZXcgY2MuUm90YXRlQnkoMiwgMzYwKTtcbiAqL1xuY2MuUm90YXRlQnkgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlJvdGF0ZUJ5JyxcbiAgICBleHRlbmRzOiBjYy5BY3Rpb25JbnRlcnZhbCxcblxuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgX3JldmVyc2U6IGZhbHNlLFxuICAgIH0sXG5cbiAgICBjdG9yOiBmdW5jdGlvbiAoZHVyYXRpb24sIGRlbHRhQW5nbGUpIHtcbiAgICAgICAgZGVsdGFBbmdsZSAqPSBjYy5Sb3RhdGVCeS5fcmV2ZXJzZSA/IDEgOiAtMTtcblxuICAgICAgICB0aGlzLl9kZWx0YUFuZ2xlID0gMDtcbiAgICAgICAgdGhpcy5fc3RhcnRBbmdsZSA9IDA7XG4gICAgICAgIGRlbHRhQW5nbGUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmluaXRXaXRoRHVyYXRpb24oZHVyYXRpb24sIGRlbHRhQW5nbGUpO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBhY3Rpb24uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIGR1cmF0aW9uIGluIHNlY29uZHNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZGVsdGFBbmdsZSBkZWx0YUFuZ2xlIGluIGRlZ3JlZXNcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGluaXRXaXRoRHVyYXRpb246ZnVuY3Rpb24gKGR1cmF0aW9uLCBkZWx0YUFuZ2xlKSB7XG4gICAgICAgIGlmIChjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuaW5pdFdpdGhEdXJhdGlvbi5jYWxsKHRoaXMsIGR1cmF0aW9uKSkge1xuICAgICAgICAgICAgdGhpcy5fZGVsdGFBbmdsZSA9IGRlbHRhQW5nbGU7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5Sb3RhdGVCeSgpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoRHVyYXRpb24odGhpcy5fZHVyYXRpb24sIHRoaXMuX2RlbHRhQW5nbGUpO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBzdGFydFdpdGhUYXJnZXQ6ZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcbiAgICAgICAgdGhpcy5fc3RhcnRBbmdsZSA9IHRhcmdldC5hbmdsZTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOmZ1bmN0aW9uIChkdCkge1xuICAgICAgICBkdCA9IHRoaXMuX2NvbXB1dGVFYXNlVGltZShkdCk7XG4gICAgICAgIGlmICh0aGlzLnRhcmdldCkge1xuICAgICAgICAgICAgdGhpcy50YXJnZXQuYW5nbGUgPSB0aGlzLl9zdGFydEFuZ2xlICsgdGhpcy5fZGVsdGFBbmdsZSAqIGR0O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJldmVyc2U6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLlJvdGF0ZUJ5KCk7XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aER1cmF0aW9uKHRoaXMuX2R1cmF0aW9uLCAtdGhpcy5fZGVsdGFBbmdsZSk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICB0aGlzLl9yZXZlcnNlRWFzZUxpc3QoYWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBSb3RhdGVzIGEgTm9kZSBvYmplY3QgY2xvY2t3aXNlIGEgbnVtYmVyIG9mIGRlZ3JlZXMgYnkgbW9kaWZ5aW5nIGl0cyBhbmdsZSBwcm9wZXJ0eS5cbiAqIFJlbGF0aXZlIHRvIGl0cyBwcm9wZXJ0aWVzIHRvIG1vZGlmeS5cbiAqICEjemgg5peL6L2s5oyH5a6a55qE6KeS5bqm44CCXG4gKiBAbWV0aG9kIHJvdGF0ZUJ5XG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gZHVyYXRpb24gaW4gc2Vjb25kc1xuICogQHBhcmFtIHtOdW1iZXJ9IGRlbHRhQW5nbGUgZGVsdGFBbmdsZSBpbiBkZWdyZWVzXG4gKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cbiAqIEBleGFtcGxlXG4gKiAvLyBleGFtcGxlXG4gKiB2YXIgYWN0aW9uQnkgPSBjYy5yb3RhdGVCeSgyLCAzNjApO1xuICovXG5jYy5yb3RhdGVCeSA9IGZ1bmN0aW9uIChkdXJhdGlvbiwgZGVsdGFBbmdsZSkge1xuICAgIHJldHVybiBuZXcgY2MuUm90YXRlQnkoZHVyYXRpb24sIGRlbHRhQW5nbGUpO1xufTtcblxuXG4vKlxuICogPHA+XG4gKiBNb3ZlcyBhIE5vZGUgb2JqZWN0IHgseSBwaXhlbHMgYnkgbW9kaWZ5aW5nIGl0cyBwb3NpdGlvbiBwcm9wZXJ0eS4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAqIHggYW5kIHkgYXJlIHJlbGF0aXZlIHRvIHRoZSBwb3NpdGlvbiBvZiB0aGUgb2JqZWN0LiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAqIFNldmVyYWwgTW92ZUJ5IGFjdGlvbnMgY2FuIGJlIGNvbmN1cnJlbnRseSBjYWxsZWQsIGFuZCB0aGUgcmVzdWx0aW5nICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gKiBtb3ZlbWVudCB3aWxsIGJlIHRoZSBzdW0gb2YgaW5kaXZpZHVhbCBtb3ZlbWVudHMuXG4gKiA8L3A+XG4gKiBAY2xhc3MgTW92ZUJ5XG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnRlcnZhbFxuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIGR1cmF0aW9uIGluIHNlY29uZHNcbiAqIEBwYXJhbSB7VmVjMnxOdW1iZXJ9IGRlbHRhUG9zXG4gKiBAcGFyYW0ge051bWJlcn0gW2RlbHRhWV1cbiAqIEBleGFtcGxlXG4gKiB2YXIgYWN0aW9uVG8gPSBjYy5tb3ZlQnkoMiwgY2MudjIod2luZG93U2l6ZS53aWR0aCAtIDQwLCB3aW5kb3dTaXplLmhlaWdodCAtIDQwKSk7XG4gKi9cbmNjLk1vdmVCeSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuTW92ZUJ5JyxcbiAgICBleHRlbmRzOiBjYy5BY3Rpb25JbnRlcnZhbCxcblxuICAgIGN0b3I6ZnVuY3Rpb24gKGR1cmF0aW9uLCBkZWx0YVBvcywgZGVsdGFZKSB7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uRGVsdGEgPSBjYy52MigwLCAwKTtcbiAgICAgICAgdGhpcy5fc3RhcnRQb3NpdGlvbiA9IGNjLnYyKDAsIDApO1xuICAgICAgICB0aGlzLl9wcmV2aW91c1Bvc2l0aW9uID0gY2MudjIoMCwgMCk7XG5cbiAgICAgICAgZGVsdGFQb3MgIT09IHVuZGVmaW5lZCAmJiBjYy5Nb3ZlQnkucHJvdG90eXBlLmluaXRXaXRoRHVyYXRpb24uY2FsbCh0aGlzLCBkdXJhdGlvbiwgZGVsdGFQb3MsIGRlbHRhWSk7XHRcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgYWN0aW9uLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gICAgICogQHBhcmFtIHtWZWMyfSBwb3NpdGlvblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbeV1cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGluaXRXaXRoRHVyYXRpb246ZnVuY3Rpb24gKGR1cmF0aW9uLCBwb3NpdGlvbiwgeSkge1xuICAgICAgICBpZiAoY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLmluaXRXaXRoRHVyYXRpb24uY2FsbCh0aGlzLCBkdXJhdGlvbikpIHtcblx0ICAgICAgICBpZihwb3NpdGlvbi54ICE9PSB1bmRlZmluZWQpIHtcblx0XHQgICAgICAgIHkgPSBwb3NpdGlvbi55O1xuXHRcdCAgICAgICAgcG9zaXRpb24gPSBwb3NpdGlvbi54O1xuXHQgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fcG9zaXRpb25EZWx0YS54ID0gcG9zaXRpb247XG4gICAgICAgICAgICB0aGlzLl9wb3NpdGlvbkRlbHRhLnkgPSB5O1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBjbG9uZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuTW92ZUJ5KCk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICBhY3Rpb24uaW5pdFdpdGhEdXJhdGlvbih0aGlzLl9kdXJhdGlvbiwgdGhpcy5fcG9zaXRpb25EZWx0YSk7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIHN0YXJ0V2l0aFRhcmdldDpmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGNjLkFjdGlvbkludGVydmFsLnByb3RvdHlwZS5zdGFydFdpdGhUYXJnZXQuY2FsbCh0aGlzLCB0YXJnZXQpO1xuICAgICAgICB2YXIgbG9jUG9zWCA9IHRhcmdldC54O1xuICAgICAgICB2YXIgbG9jUG9zWSA9IHRhcmdldC55O1xuICAgICAgICB0aGlzLl9wcmV2aW91c1Bvc2l0aW9uLnggPSBsb2NQb3NYO1xuICAgICAgICB0aGlzLl9wcmV2aW91c1Bvc2l0aW9uLnkgPSBsb2NQb3NZO1xuICAgICAgICB0aGlzLl9zdGFydFBvc2l0aW9uLnggPSBsb2NQb3NYO1xuICAgICAgICB0aGlzLl9zdGFydFBvc2l0aW9uLnkgPSBsb2NQb3NZO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6ZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIGR0ID0gdGhpcy5fY29tcHV0ZUVhc2VUaW1lKGR0KTtcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0KSB7XG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMuX3Bvc2l0aW9uRGVsdGEueCAqIGR0O1xuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLl9wb3NpdGlvbkRlbHRhLnkgKiBkdDtcbiAgICAgICAgICAgIHZhciBsb2NTdGFydFBvc2l0aW9uID0gdGhpcy5fc3RhcnRQb3NpdGlvbjtcbiAgICAgICAgICAgIGlmIChjYy5tYWNyby5FTkFCTEVfU1RBQ0tBQkxFX0FDVElPTlMpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0WCA9IHRoaXMudGFyZ2V0Lng7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldFkgPSB0aGlzLnRhcmdldC55O1xuICAgICAgICAgICAgICAgIHZhciBsb2NQcmV2aW91c1Bvc2l0aW9uID0gdGhpcy5fcHJldmlvdXNQb3NpdGlvbjtcblxuICAgICAgICAgICAgICAgIGxvY1N0YXJ0UG9zaXRpb24ueCA9IGxvY1N0YXJ0UG9zaXRpb24ueCArIHRhcmdldFggLSBsb2NQcmV2aW91c1Bvc2l0aW9uLng7XG4gICAgICAgICAgICAgICAgbG9jU3RhcnRQb3NpdGlvbi55ID0gbG9jU3RhcnRQb3NpdGlvbi55ICsgdGFyZ2V0WSAtIGxvY1ByZXZpb3VzUG9zaXRpb24ueTtcbiAgICAgICAgICAgICAgICB4ID0geCArIGxvY1N0YXJ0UG9zaXRpb24ueDtcbiAgICAgICAgICAgICAgICB5ID0geSArIGxvY1N0YXJ0UG9zaXRpb24ueTtcblx0ICAgICAgICAgICAgbG9jUHJldmlvdXNQb3NpdGlvbi54ID0geDtcblx0ICAgICAgICAgICAgbG9jUHJldmlvdXNQb3NpdGlvbi55ID0geTtcblx0ICAgICAgICAgICAgdGhpcy50YXJnZXQuc2V0UG9zaXRpb24oeCwgeSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0LnNldFBvc2l0aW9uKGxvY1N0YXJ0UG9zaXRpb24ueCArIHgsIGxvY1N0YXJ0UG9zaXRpb24ueSArIHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJldmVyc2U6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLk1vdmVCeSh0aGlzLl9kdXJhdGlvbiwgY2MudjIoLXRoaXMuX3Bvc2l0aW9uRGVsdGEueCwgLXRoaXMuX3Bvc2l0aW9uRGVsdGEueSkpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgdGhpcy5fcmV2ZXJzZUVhc2VMaXN0KGFjdGlvbik7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlblxuICogTW92ZXMgYSBOb2RlIG9iamVjdCB4LHkgcGl4ZWxzIGJ5IG1vZGlmeWluZyBpdHMgcG9zaXRpb24gcHJvcGVydHkuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gKiB4IGFuZCB5IGFyZSByZWxhdGl2ZSB0byB0aGUgcG9zaXRpb24gb2YgdGhlIG9iamVjdC4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gKiBTZXZlcmFsIE1vdmVCeSBhY3Rpb25zIGNhbiBiZSBjb25jdXJyZW50bHkgY2FsbGVkLCBhbmQgdGhlIHJlc3VsdGluZyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICogbW92ZW1lbnQgd2lsbCBiZSB0aGUgc3VtIG9mIGluZGl2aWR1YWwgbW92ZW1lbnRzLlxuICogISN6aCDnp7vliqjmjIflrprnmoTot53nprvjgIJcbiAqIEBtZXRob2QgbW92ZUJ5XG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gZHVyYXRpb24gaW4gc2Vjb25kc1xuICogQHBhcmFtIHtWZWMyfE51bWJlcn0gZGVsdGFQb3NcbiAqIEBwYXJhbSB7TnVtYmVyfSBbZGVsdGFZXVxuICogQHJldHVybiB7QWN0aW9uSW50ZXJ2YWx9XG4gKiBAZXhhbXBsZVxuICogLy8gZXhhbXBsZVxuICogdmFyIGFjdGlvblRvID0gY2MubW92ZUJ5KDIsIGNjLnYyKHdpbmRvd1NpemUud2lkdGggLSA0MCwgd2luZG93U2l6ZS5oZWlnaHQgLSA0MCkpO1xuICovXG5jYy5tb3ZlQnkgPSBmdW5jdGlvbiAoZHVyYXRpb24sIGRlbHRhUG9zLCBkZWx0YVkpIHtcbiAgICByZXR1cm4gbmV3IGNjLk1vdmVCeShkdXJhdGlvbiwgZGVsdGFQb3MsIGRlbHRhWSk7XG59O1xuXG5cbi8qXG4gKiBNb3ZlcyBhIE5vZGUgb2JqZWN0IHRvIHRoZSBwb3NpdGlvbiB4LHkuIHggYW5kIHkgYXJlIGFic29sdXRlIGNvb3JkaW5hdGVzIGJ5IG1vZGlmeWluZyBpdHMgcG9zaXRpb24gcHJvcGVydHkuIDxici8+XG4gKiBTZXZlcmFsIE1vdmVUbyBhY3Rpb25zIGNhbiBiZSBjb25jdXJyZW50bHkgY2FsbGVkLCBhbmQgdGhlIHJlc3VsdGluZyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAqIG1vdmVtZW50IHdpbGwgYmUgdGhlIHN1bSBvZiBpbmRpdmlkdWFsIG1vdmVtZW50cy5cbiAqIEBjbGFzcyBNb3ZlVG9cbiAqIEBleHRlbmRzIE1vdmVCeVxuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIGR1cmF0aW9uIGluIHNlY29uZHNcbiAqIEBwYXJhbSB7VmVjMnxOdW1iZXJ9IHBvc2l0aW9uXG4gKiBAcGFyYW0ge051bWJlcn0gW3ldXG4gKiBAZXhhbXBsZVxuICogdmFyIGFjdGlvbkJ5ID0gbmV3IGNjLk1vdmVUbygyLCBjYy52Mig4MCwgODApKTtcbiAqL1xuY2MuTW92ZVRvID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5Nb3ZlVG8nLFxuICAgIGV4dGVuZHM6IGNjLk1vdmVCeSxcblxuICAgIGN0b3I6ZnVuY3Rpb24gKGR1cmF0aW9uLCBwb3NpdGlvbiwgeSkge1xuICAgICAgICB0aGlzLl9lbmRQb3NpdGlvbiA9IGNjLnYyKDAsIDApO1xuXHRcdHBvc2l0aW9uICE9PSB1bmRlZmluZWQgJiYgdGhpcy5pbml0V2l0aER1cmF0aW9uKGR1cmF0aW9uLCBwb3NpdGlvbiwgeSk7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIGFjdGlvbi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gIGR1cmF0aW9uIGluIHNlY29uZHNcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFt5XVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaW5pdFdpdGhEdXJhdGlvbjpmdW5jdGlvbiAoZHVyYXRpb24sIHBvc2l0aW9uLCB5KSB7XG4gICAgICAgIGlmIChjYy5Nb3ZlQnkucHJvdG90eXBlLmluaXRXaXRoRHVyYXRpb24uY2FsbCh0aGlzLCBkdXJhdGlvbiwgcG9zaXRpb24sIHkpKSB7XG5cdCAgICAgICAgaWYocG9zaXRpb24ueCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0ICAgICAgICB5ID0gcG9zaXRpb24ueTtcblx0XHQgICAgICAgIHBvc2l0aW9uID0gcG9zaXRpb24ueDtcblx0ICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2VuZFBvc2l0aW9uLnggPSBwb3NpdGlvbjtcbiAgICAgICAgICAgIHRoaXMuX2VuZFBvc2l0aW9uLnkgPSB5O1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBjbG9uZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuTW92ZVRvKCk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICBhY3Rpb24uaW5pdFdpdGhEdXJhdGlvbih0aGlzLl9kdXJhdGlvbiwgdGhpcy5fZW5kUG9zaXRpb24pO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBzdGFydFdpdGhUYXJnZXQ6ZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBjYy5Nb3ZlQnkucHJvdG90eXBlLnN0YXJ0V2l0aFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uRGVsdGEueCA9IHRoaXMuX2VuZFBvc2l0aW9uLnggLSB0YXJnZXQueDtcbiAgICAgICAgdGhpcy5fcG9zaXRpb25EZWx0YS55ID0gdGhpcy5fZW5kUG9zaXRpb24ueSAtIHRhcmdldC55O1xuICAgIH1cbn0pO1xuXG4vKipcbiAqICEjZW5cbiAqIE1vdmVzIGEgTm9kZSBvYmplY3QgdG8gdGhlIHBvc2l0aW9uIHgseS4geCBhbmQgeSBhcmUgYWJzb2x1dGUgY29vcmRpbmF0ZXMgYnkgbW9kaWZ5aW5nIGl0cyBwb3NpdGlvbiBwcm9wZXJ0eS4gPGJyLz5cbiAqIFNldmVyYWwgTW92ZVRvIGFjdGlvbnMgY2FuIGJlIGNvbmN1cnJlbnRseSBjYWxsZWQsIGFuZCB0aGUgcmVzdWx0aW5nICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICogbW92ZW1lbnQgd2lsbCBiZSB0aGUgc3VtIG9mIGluZGl2aWR1YWwgbW92ZW1lbnRzLlxuICogISN6aCDnp7vliqjliLDnm67moIfkvY3nva7jgIJcbiAqIEBtZXRob2QgbW92ZVRvXG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gZHVyYXRpb24gaW4gc2Vjb25kc1xuICogQHBhcmFtIHtWZWMyfE51bWJlcn0gcG9zaXRpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSBbeV1cbiAqIEByZXR1cm4ge0FjdGlvbkludGVydmFsfVxuICogQGV4YW1wbGVcbiAqIC8vIGV4YW1wbGVcbiAqIHZhciBhY3Rpb25CeSA9IGNjLm1vdmVUbygyLCBjYy52Mig4MCwgODApKTtcbiAqL1xuY2MubW92ZVRvID0gZnVuY3Rpb24gKGR1cmF0aW9uLCBwb3NpdGlvbiwgeSkge1xuICAgIHJldHVybiBuZXcgY2MuTW92ZVRvKGR1cmF0aW9uLCBwb3NpdGlvbiwgeSk7XG59O1xuXG4vKlxuICogU2tld3MgYSBOb2RlIG9iamVjdCB0byBnaXZlbiBhbmdsZXMgYnkgbW9kaWZ5aW5nIGl0cyBza2V3WCBhbmQgc2tld1kgcHJvcGVydGllc1xuICogQGNsYXNzIFNrZXdUb1xuICogQGV4dGVuZHMgQWN0aW9uSW50ZXJ2YWxcbiAqIEBwYXJhbSB7TnVtYmVyfSB0IHRpbWUgaW4gc2Vjb25kc1xuICogQHBhcmFtIHtOdW1iZXJ9IHN4XG4gKiBAcGFyYW0ge051bWJlcn0gc3lcbiAqIEBleGFtcGxlXG4gKiB2YXIgYWN0aW9uVG8gPSBuZXcgY2MuU2tld1RvKDIsIDM3LjIsIC0zNy4yKTtcbiAqL1xuY2MuU2tld1RvID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5Ta2V3VG8nLFxuICAgIGV4dGVuZHM6IGNjLkFjdGlvbkludGVydmFsLFxuXG4gICAgY3RvcjogZnVuY3Rpb24gKHQsIHN4LCBzeSkge1xuICAgICAgICB0aGlzLl9za2V3WCA9IDA7XG4gICAgICAgIHRoaXMuX3NrZXdZID0gMDtcbiAgICAgICAgdGhpcy5fc3RhcnRTa2V3WCA9IDA7XG4gICAgICAgIHRoaXMuX3N0YXJ0U2tld1kgPSAwO1xuICAgICAgICB0aGlzLl9lbmRTa2V3WCA9IDA7XG4gICAgICAgIHRoaXMuX2VuZFNrZXdZID0gMDtcbiAgICAgICAgdGhpcy5fZGVsdGFYID0gMDtcbiAgICAgICAgdGhpcy5fZGVsdGFZID0gMDtcbiAgICAgICAgc3kgIT09IHVuZGVmaW5lZCAmJiBjYy5Ta2V3VG8ucHJvdG90eXBlLmluaXRXaXRoRHVyYXRpb24uY2FsbCh0aGlzLCB0LCBzeCwgc3kpO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBhY3Rpb24uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgdGltZSBpbiBzZWNvbmRzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHN4XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHN5XG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpbml0V2l0aER1cmF0aW9uOmZ1bmN0aW9uICh0LCBzeCwgc3kpIHtcbiAgICAgICAgdmFyIHJldCA9IGZhbHNlO1xuICAgICAgICBpZiAoY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLmluaXRXaXRoRHVyYXRpb24uY2FsbCh0aGlzLCB0KSkge1xuICAgICAgICAgICAgdGhpcy5fZW5kU2tld1ggPSBzeDtcbiAgICAgICAgICAgIHRoaXMuX2VuZFNrZXdZID0gc3k7XG4gICAgICAgICAgICByZXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5Ta2V3VG8oKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aER1cmF0aW9uKHRoaXMuX2R1cmF0aW9uLCB0aGlzLl9lbmRTa2V3WCwgdGhpcy5fZW5kU2tld1kpO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBzdGFydFdpdGhUYXJnZXQ6ZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcblxuICAgICAgICB0aGlzLl9zdGFydFNrZXdYID0gdGFyZ2V0LnNrZXdYICUgMTgwO1xuICAgICAgICB0aGlzLl9kZWx0YVggPSB0aGlzLl9lbmRTa2V3WCAtIHRoaXMuX3N0YXJ0U2tld1g7XG4gICAgICAgIGlmICh0aGlzLl9kZWx0YVggPiAxODApXG4gICAgICAgICAgICB0aGlzLl9kZWx0YVggLT0gMzYwO1xuICAgICAgICBpZiAodGhpcy5fZGVsdGFYIDwgLTE4MClcbiAgICAgICAgICAgIHRoaXMuX2RlbHRhWCArPSAzNjA7XG5cbiAgICAgICAgdGhpcy5fc3RhcnRTa2V3WSA9IHRhcmdldC5za2V3WSAlIDM2MDtcbiAgICAgICAgdGhpcy5fZGVsdGFZID0gdGhpcy5fZW5kU2tld1kgLSB0aGlzLl9zdGFydFNrZXdZO1xuICAgICAgICBpZiAodGhpcy5fZGVsdGFZID4gMTgwKVxuICAgICAgICAgICAgdGhpcy5fZGVsdGFZIC09IDM2MDtcbiAgICAgICAgaWYgKHRoaXMuX2RlbHRhWSA8IC0xODApXG4gICAgICAgICAgICB0aGlzLl9kZWx0YVkgKz0gMzYwO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6ZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIGR0ID0gdGhpcy5fY29tcHV0ZUVhc2VUaW1lKGR0KTtcbiAgICAgICAgdGhpcy50YXJnZXQuc2tld1ggPSB0aGlzLl9zdGFydFNrZXdYICsgdGhpcy5fZGVsdGFYICogZHQ7XG4gICAgICAgIHRoaXMudGFyZ2V0LnNrZXdZID0gdGhpcy5fc3RhcnRTa2V3WSArIHRoaXMuX2RlbHRhWSAqIGR0O1xuICAgIH1cbn0pO1xuXG4vKipcbiAqICEjZW5cbiAqIENyZWF0ZSBhIGFjdGlvbiB3aGljaCBza2V3cyBhIE5vZGUgb2JqZWN0IHRvIGdpdmVuIGFuZ2xlcyBieSBtb2RpZnlpbmcgaXRzIHNrZXdYIGFuZCBza2V3WSBwcm9wZXJ0aWVzLlxuICogQ2hhbmdlcyB0byB0aGUgc3BlY2lmaWVkIHZhbHVlLlxuICogISN6aCDlgY/mlpzliLDnm67moIfop5LluqbjgIJcbiAqIEBtZXRob2Qgc2tld1RvXG4gKiBAcGFyYW0ge051bWJlcn0gdCB0aW1lIGluIHNlY29uZHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBzeFxuICogQHBhcmFtIHtOdW1iZXJ9IHN5XG4gKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cbiAqIEBleGFtcGxlXG4gKiAvLyBleGFtcGxlXG4gKiB2YXIgYWN0aW9uVG8gPSBjYy5za2V3VG8oMiwgMzcuMiwgLTM3LjIpO1xuICovXG5jYy5za2V3VG8gPSBmdW5jdGlvbiAodCwgc3gsIHN5KSB7XG4gICAgcmV0dXJuIG5ldyBjYy5Ta2V3VG8odCwgc3gsIHN5KTtcbn07XG5cbi8qXG4gKiBTa2V3cyBhIE5vZGUgb2JqZWN0IGJ5IHNrZXdYIGFuZCBza2V3WSBkZWdyZWVzLlxuICogUmVsYXRpdmUgdG8gaXRzIHByb3BlcnR5IG1vZGlmaWNhdGlvbi5cbiAqIEBjbGFzcyBTa2V3QnlcbiAqIEBleHRlbmRzIFNrZXdUb1xuICogQHBhcmFtIHtOdW1iZXJ9IHQgdGltZSBpbiBzZWNvbmRzXG4gKiBAcGFyYW0ge051bWJlcn0gc3ggIHNrZXcgaW4gZGVncmVlcyBmb3IgWCBheGlzXG4gKiBAcGFyYW0ge051bWJlcn0gc3kgIHNrZXcgaW4gZGVncmVlcyBmb3IgWSBheGlzXG4gKi9cbmNjLlNrZXdCeSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuU2tld0J5JyxcbiAgICBleHRlbmRzOiBjYy5Ta2V3VG8sXG5cblx0Y3RvcjogZnVuY3Rpb24odCwgc3gsIHN5KSB7XG5cdFx0c3kgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmluaXRXaXRoRHVyYXRpb24odCwgc3gsIHN5KTtcblx0fSxcblxuICAgIC8qXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIGFjdGlvbi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCB0aW1lIGluIHNlY29uZHNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZGVsdGFTa2V3WCAgc2tldyBpbiBkZWdyZWVzIGZvciBYIGF4aXNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZGVsdGFTa2V3WSAgc2tldyBpbiBkZWdyZWVzIGZvciBZIGF4aXNcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGluaXRXaXRoRHVyYXRpb246ZnVuY3Rpb24gKHQsIGRlbHRhU2tld1gsIGRlbHRhU2tld1kpIHtcbiAgICAgICAgdmFyIHJldCA9IGZhbHNlO1xuICAgICAgICBpZiAoY2MuU2tld1RvLnByb3RvdHlwZS5pbml0V2l0aER1cmF0aW9uLmNhbGwodGhpcywgdCwgZGVsdGFTa2V3WCwgZGVsdGFTa2V3WSkpIHtcbiAgICAgICAgICAgIHRoaXMuX3NrZXdYID0gZGVsdGFTa2V3WDtcbiAgICAgICAgICAgIHRoaXMuX3NrZXdZID0gZGVsdGFTa2V3WTtcbiAgICAgICAgICAgIHJldCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgY2xvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLlNrZXdCeSgpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoRHVyYXRpb24odGhpcy5fZHVyYXRpb24sIHRoaXMuX3NrZXdYLCB0aGlzLl9za2V3WSk7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIHN0YXJ0V2l0aFRhcmdldDpmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGNjLlNrZXdUby5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcbiAgICAgICAgdGhpcy5fZGVsdGFYID0gdGhpcy5fc2tld1g7XG4gICAgICAgIHRoaXMuX2RlbHRhWSA9IHRoaXMuX3NrZXdZO1xuICAgICAgICB0aGlzLl9lbmRTa2V3WCA9IHRoaXMuX3N0YXJ0U2tld1ggKyB0aGlzLl9kZWx0YVg7XG4gICAgICAgIHRoaXMuX2VuZFNrZXdZID0gdGhpcy5fc3RhcnRTa2V3WSArIHRoaXMuX2RlbHRhWTtcbiAgICB9LFxuXG4gICAgcmV2ZXJzZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuU2tld0J5KHRoaXMuX2R1cmF0aW9uLCAtdGhpcy5fc2tld1gsIC10aGlzLl9za2V3WSk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICB0aGlzLl9yZXZlcnNlRWFzZUxpc3QoYWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBTa2V3cyBhIE5vZGUgb2JqZWN0IGJ5IHNrZXdYIGFuZCBza2V3WSBkZWdyZWVzLiA8YnIgLz5cbiAqIFJlbGF0aXZlIHRvIGl0cyBwcm9wZXJ0eSBtb2RpZmljYXRpb24uXG4gKiAhI3poIOWBj+aWnOaMh+WumueahOinkuW6puOAglxuICogQG1ldGhvZCBza2V3QnlcbiAqIEBwYXJhbSB7TnVtYmVyfSB0IHRpbWUgaW4gc2Vjb25kc1xuICogQHBhcmFtIHtOdW1iZXJ9IHN4IHN4IHNrZXcgaW4gZGVncmVlcyBmb3IgWCBheGlzXG4gKiBAcGFyYW0ge051bWJlcn0gc3kgc3kgc2tldyBpbiBkZWdyZWVzIGZvciBZIGF4aXNcbiAqIEByZXR1cm4ge0FjdGlvbkludGVydmFsfVxuICogQGV4YW1wbGVcbiAqIC8vIGV4YW1wbGVcbiAqIHZhciBhY3Rpb25CeSA9IGNjLnNrZXdCeSgyLCAwLCAtOTApO1xuICovXG5jYy5za2V3QnkgPSBmdW5jdGlvbiAodCwgc3gsIHN5KSB7XG4gICAgcmV0dXJuIG5ldyBjYy5Ta2V3QnkodCwgc3gsIHN5KTtcbn07XG5cblxuLypcbiAqIE1vdmVzIGEgTm9kZSBvYmplY3Qgc2ltdWxhdGluZyBhIHBhcmFib2xpYyBqdW1wIG1vdmVtZW50IGJ5IG1vZGlmeWluZyBpdHMgcG9zaXRpb24gcHJvcGVydHkuXG4gKiBSZWxhdGl2ZSB0byBpdHMgbW92ZW1lbnQuXG4gKiBAY2xhc3MgSnVtcEJ5XG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnRlcnZhbFxuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uXG4gKiBAcGFyYW0ge1ZlYzJ8TnVtYmVyfSBwb3NpdGlvblxuICogQHBhcmFtIHtOdW1iZXJ9IFt5XVxuICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodFxuICogQHBhcmFtIHtOdW1iZXJ9IGp1bXBzXG4gKiBAZXhhbXBsZVxuICogdmFyIGFjdGlvbkJ5ID0gbmV3IGNjLkp1bXBCeSgyLCBjYy52MigzMDAsIDApLCA1MCwgNCk7XG4gKiB2YXIgYWN0aW9uQnkgPSBuZXcgY2MuSnVtcEJ5KDIsIDMwMCwgMCwgNTAsIDQpO1xuICovXG5jYy5KdW1wQnkgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkp1bXBCeScsXG4gICAgZXh0ZW5kczogY2MuQWN0aW9uSW50ZXJ2YWwsXG5cbiAgICBjdG9yOmZ1bmN0aW9uIChkdXJhdGlvbiwgcG9zaXRpb24sIHksIGhlaWdodCwganVtcHMpIHtcbiAgICAgICAgdGhpcy5fc3RhcnRQb3NpdGlvbiA9IGNjLnYyKDAsIDApO1xuICAgICAgICB0aGlzLl9wcmV2aW91c1Bvc2l0aW9uID0gY2MudjIoMCwgMCk7XG4gICAgICAgIHRoaXMuX2RlbHRhID0gY2MudjIoMCwgMCk7XG4gICAgICAgIHRoaXMuX2hlaWdodCA9IDA7XG4gICAgICAgIHRoaXMuX2p1bXBzID0gMDtcblxuICAgICAgICBoZWlnaHQgIT09IHVuZGVmaW5lZCAmJiBjYy5KdW1wQnkucHJvdG90eXBlLmluaXRXaXRoRHVyYXRpb24uY2FsbCh0aGlzLCBkdXJhdGlvbiwgcG9zaXRpb24sIHksIGhlaWdodCwganVtcHMpO1xuICAgIH0sXG4gICAgLypcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgYWN0aW9uLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvblxuICAgICAqIEBwYXJhbSB7VmVjMnxOdW1iZXJ9IHBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFt5XVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0ganVtcHNcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqIEBleGFtcGxlXG4gICAgICogYWN0aW9uQnkuaW5pdFdpdGhEdXJhdGlvbigyLCBjYy52MigzMDAsIDApLCA1MCwgNCk7XG4gICAgICogYWN0aW9uQnkuaW5pdFdpdGhEdXJhdGlvbigyLCAzMDAsIDAsIDUwLCA0KTtcbiAgICAgKi9cbiAgICBpbml0V2l0aER1cmF0aW9uOmZ1bmN0aW9uIChkdXJhdGlvbiwgcG9zaXRpb24sIHksIGhlaWdodCwganVtcHMpIHtcbiAgICAgICAgaWYgKGNjLkFjdGlvbkludGVydmFsLnByb3RvdHlwZS5pbml0V2l0aER1cmF0aW9uLmNhbGwodGhpcywgZHVyYXRpb24pKSB7XG5cdCAgICAgICAgaWYgKGp1bXBzID09PSB1bmRlZmluZWQpIHtcblx0XHQgICAgICAgIGp1bXBzID0gaGVpZ2h0O1xuXHRcdCAgICAgICAgaGVpZ2h0ID0geTtcblx0XHQgICAgICAgIHkgPSBwb3NpdGlvbi55O1xuXHRcdCAgICAgICAgcG9zaXRpb24gPSBwb3NpdGlvbi54O1xuXHQgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2RlbHRhLnggPSBwb3NpdGlvbjtcbiAgICAgICAgICAgIHRoaXMuX2RlbHRhLnkgPSB5O1xuICAgICAgICAgICAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICAgICAgdGhpcy5fanVtcHMgPSBqdW1wcztcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgY2xvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLkp1bXBCeSgpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoRHVyYXRpb24odGhpcy5fZHVyYXRpb24sIHRoaXMuX2RlbHRhLCB0aGlzLl9oZWlnaHQsIHRoaXMuX2p1bXBzKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9LFxuXG4gICAgc3RhcnRXaXRoVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLnN0YXJ0V2l0aFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XG4gICAgICAgIHZhciBsb2NQb3NYID0gdGFyZ2V0Lng7XG4gICAgICAgIHZhciBsb2NQb3NZID0gdGFyZ2V0Lnk7XG4gICAgICAgIHRoaXMuX3ByZXZpb3VzUG9zaXRpb24ueCA9IGxvY1Bvc1g7XG4gICAgICAgIHRoaXMuX3ByZXZpb3VzUG9zaXRpb24ueSA9IGxvY1Bvc1k7XG4gICAgICAgIHRoaXMuX3N0YXJ0UG9zaXRpb24ueCA9IGxvY1Bvc1g7XG4gICAgICAgIHRoaXMuX3N0YXJ0UG9zaXRpb24ueSA9IGxvY1Bvc1k7XG4gICAgfSxcblxuICAgIHVwZGF0ZTpmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgZHQgPSB0aGlzLl9jb21wdXRlRWFzZVRpbWUoZHQpO1xuICAgICAgICBpZiAodGhpcy50YXJnZXQpIHtcbiAgICAgICAgICAgIHZhciBmcmFjID0gZHQgKiB0aGlzLl9qdW1wcyAlIDEuMDtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5faGVpZ2h0ICogNCAqIGZyYWMgKiAoMSAtIGZyYWMpO1xuICAgICAgICAgICAgeSArPSB0aGlzLl9kZWx0YS55ICogZHQ7XG5cbiAgICAgICAgICAgIHZhciB4ID0gdGhpcy5fZGVsdGEueCAqIGR0O1xuICAgICAgICAgICAgdmFyIGxvY1N0YXJ0UG9zaXRpb24gPSB0aGlzLl9zdGFydFBvc2l0aW9uO1xuICAgICAgICAgICAgaWYgKGNjLm1hY3JvLkVOQUJMRV9TVEFDS0FCTEVfQUNUSU9OUykge1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXRYID0gdGhpcy50YXJnZXQueDtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0WSA9IHRoaXMudGFyZ2V0Lnk7XG4gICAgICAgICAgICAgICAgdmFyIGxvY1ByZXZpb3VzUG9zaXRpb24gPSB0aGlzLl9wcmV2aW91c1Bvc2l0aW9uO1xuXG4gICAgICAgICAgICAgICAgbG9jU3RhcnRQb3NpdGlvbi54ID0gbG9jU3RhcnRQb3NpdGlvbi54ICsgdGFyZ2V0WCAtIGxvY1ByZXZpb3VzUG9zaXRpb24ueDtcbiAgICAgICAgICAgICAgICBsb2NTdGFydFBvc2l0aW9uLnkgPSBsb2NTdGFydFBvc2l0aW9uLnkgKyB0YXJnZXRZIC0gbG9jUHJldmlvdXNQb3NpdGlvbi55O1xuICAgICAgICAgICAgICAgIHggPSB4ICsgbG9jU3RhcnRQb3NpdGlvbi54O1xuICAgICAgICAgICAgICAgIHkgPSB5ICsgbG9jU3RhcnRQb3NpdGlvbi55O1xuXHQgICAgICAgICAgICBsb2NQcmV2aW91c1Bvc2l0aW9uLnggPSB4O1xuXHQgICAgICAgICAgICBsb2NQcmV2aW91c1Bvc2l0aW9uLnkgPSB5O1xuXHQgICAgICAgICAgICB0aGlzLnRhcmdldC5zZXRQb3NpdGlvbih4LCB5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQuc2V0UG9zaXRpb24obG9jU3RhcnRQb3NpdGlvbi54ICsgeCwgbG9jU3RhcnRQb3NpdGlvbi55ICsgeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmV2ZXJzZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuSnVtcEJ5KHRoaXMuX2R1cmF0aW9uLCBjYy52MigtdGhpcy5fZGVsdGEueCwgLXRoaXMuX2RlbHRhLnkpLCB0aGlzLl9oZWlnaHQsIHRoaXMuX2p1bXBzKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIHRoaXMuX3JldmVyc2VFYXNlTGlzdChhY3Rpb24pO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqICEjZW5cbiAqIE1vdmVzIGEgTm9kZSBvYmplY3Qgc2ltdWxhdGluZyBhIHBhcmFib2xpYyBqdW1wIG1vdmVtZW50IGJ5IG1vZGlmeWluZyBpdCdzIHBvc2l0aW9uIHByb3BlcnR5LlxuICogUmVsYXRpdmUgdG8gaXRzIG1vdmVtZW50LlxuICogISN6aCDnlKjot7Pot4PnmoTmlrnlvI/np7vliqjmjIflrprnmoTot53nprvjgIJcbiAqIEBtZXRob2QganVtcEJ5XG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb25cbiAqIEBwYXJhbSB7VmVjMnxOdW1iZXJ9IHBvc2l0aW9uXG4gKiBAcGFyYW0ge051bWJlcn0gW3ldXG4gKiBAcGFyYW0ge051bWJlcn0gW2hlaWdodF1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbanVtcHNdXG4gKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cbiAqIEBleGFtcGxlXG4gKiAvLyBleGFtcGxlXG4gKiB2YXIgYWN0aW9uQnkgPSBjYy5qdW1wQnkoMiwgY2MudjIoMzAwLCAwKSwgNTAsIDQpO1xuICogdmFyIGFjdGlvbkJ5ID0gY2MuanVtcEJ5KDIsIDMwMCwgMCwgNTAsIDQpO1xuICovXG5jYy5qdW1wQnkgPSBmdW5jdGlvbiAoZHVyYXRpb24sIHBvc2l0aW9uLCB5LCBoZWlnaHQsIGp1bXBzKSB7XG4gICAgcmV0dXJuIG5ldyBjYy5KdW1wQnkoZHVyYXRpb24sIHBvc2l0aW9uLCB5LCBoZWlnaHQsIGp1bXBzKTtcbn07XG5cbi8qXG4gKiBNb3ZlcyBhIE5vZGUgb2JqZWN0IHRvIGEgcGFyYWJvbGljIHBvc2l0aW9uIHNpbXVsYXRpbmcgYSBqdW1wIG1vdmVtZW50IGJ5IG1vZGlmeWluZyBpdCdzIHBvc2l0aW9uIHByb3BlcnR5LiA8YnIgLz5cbiAqIEp1bXAgdG8gdGhlIHNwZWNpZmllZCBsb2NhdGlvbi5cbiAqIEBjbGFzcyBKdW1wVG9cbiAqIEBleHRlbmRzIEp1bXBCeVxuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uXG4gKiBAcGFyYW0ge1ZlYzJ8TnVtYmVyfSBwb3NpdGlvblxuICogQHBhcmFtIHtOdW1iZXJ9IFt5XVxuICogQHBhcmFtIHtOdW1iZXJ9IFtoZWlnaHRdXG4gKiBAcGFyYW0ge051bWJlcn0gW2p1bXBzXVxuICogQGV4YW1wbGVcbiAqIHZhciBhY3Rpb25UbyA9IG5ldyBjYy5KdW1wVG8oMiwgY2MudjIoMzAwLCAwKSwgNTAsIDQpO1xuICogdmFyIGFjdGlvblRvID0gbmV3IGNjLkp1bXBUbygyLCAzMDAsIDAsIDUwLCA0KTtcbiAqL1xuY2MuSnVtcFRvID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5KdW1wVG8nLFxuICAgIGV4dGVuZHM6IGNjLkp1bXBCeSxcblxuICAgIGN0b3I6ZnVuY3Rpb24gKGR1cmF0aW9uLCBwb3NpdGlvbiwgeSwgaGVpZ2h0LCBqdW1wcykge1xuICAgICAgICB0aGlzLl9lbmRQb3NpdGlvbiA9IGNjLnYyKDAsIDApO1xuICAgICAgICBoZWlnaHQgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmluaXRXaXRoRHVyYXRpb24oZHVyYXRpb24sIHBvc2l0aW9uLCB5LCBoZWlnaHQsIGp1bXBzKTtcbiAgICB9LFxuICAgIC8qXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIGFjdGlvbi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb25cbiAgICAgKiBAcGFyYW0ge1ZlYzJ8TnVtYmVyfSBwb3NpdGlvblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbeV1cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGp1bXBzXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGFjdGlvblRvLmluaXRXaXRoRHVyYXRpb24oMiwgY2MudjIoMzAwLCAwKSwgNTAsIDQpO1xuICAgICAqIGFjdGlvblRvLmluaXRXaXRoRHVyYXRpb24oMiwgMzAwLCAwLCA1MCwgNCk7XG4gICAgICovXG4gICAgaW5pdFdpdGhEdXJhdGlvbjpmdW5jdGlvbiAoZHVyYXRpb24sIHBvc2l0aW9uLCB5LCBoZWlnaHQsIGp1bXBzKSB7XG4gICAgICAgIGlmIChjYy5KdW1wQnkucHJvdG90eXBlLmluaXRXaXRoRHVyYXRpb24uY2FsbCh0aGlzLCBkdXJhdGlvbiwgcG9zaXRpb24sIHksIGhlaWdodCwganVtcHMpKSB7XG4gICAgICAgICAgICBpZiAoanVtcHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHkgPSBwb3NpdGlvbi55O1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gcG9zaXRpb24ueDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2VuZFBvc2l0aW9uLnggPSBwb3NpdGlvbjtcbiAgICAgICAgICAgIHRoaXMuX2VuZFBvc2l0aW9uLnkgPSB5O1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBzdGFydFdpdGhUYXJnZXQ6ZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBjYy5KdW1wQnkucHJvdG90eXBlLnN0YXJ0V2l0aFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XG4gICAgICAgIHRoaXMuX2RlbHRhLnggPSB0aGlzLl9lbmRQb3NpdGlvbi54IC0gdGhpcy5fc3RhcnRQb3NpdGlvbi54O1xuICAgICAgICB0aGlzLl9kZWx0YS55ID0gdGhpcy5fZW5kUG9zaXRpb24ueSAtIHRoaXMuX3N0YXJ0UG9zaXRpb24ueTtcbiAgICB9LFxuXG4gICAgY2xvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLkp1bXBUbygpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoRHVyYXRpb24odGhpcy5fZHVyYXRpb24sIHRoaXMuX2VuZFBvc2l0aW9uLCB0aGlzLl9oZWlnaHQsIHRoaXMuX2p1bXBzKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBNb3ZlcyBhIE5vZGUgb2JqZWN0IHRvIGEgcGFyYWJvbGljIHBvc2l0aW9uIHNpbXVsYXRpbmcgYSBqdW1wIG1vdmVtZW50IGJ5IG1vZGlmeWluZyBpdHMgcG9zaXRpb24gcHJvcGVydHkuIDxiciAvPlxuICogSnVtcCB0byB0aGUgc3BlY2lmaWVkIGxvY2F0aW9uLlxuICogISN6aCDnlKjot7Pot4PnmoTmlrnlvI/np7vliqjliLDnm67moIfkvY3nva7jgIJcbiAqIEBtZXRob2QganVtcFRvXG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb25cbiAqIEBwYXJhbSB7VmVjMnxOdW1iZXJ9IHBvc2l0aW9uXG4gKiBAcGFyYW0ge051bWJlcn0gW3ldXG4gKiBAcGFyYW0ge051bWJlcn0gW2hlaWdodF1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbanVtcHNdXG4gKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cbiAqIEBleGFtcGxlXG4gKiAvLyBleGFtcGxlXG4gKiB2YXIgYWN0aW9uVG8gPSBjYy5qdW1wVG8oMiwgY2MudjIoMzAwLCAzMDApLCA1MCwgNCk7XG4gKiB2YXIgYWN0aW9uVG8gPSBjYy5qdW1wVG8oMiwgMzAwLCAzMDAsIDUwLCA0KTtcbiAqL1xuY2MuanVtcFRvID0gZnVuY3Rpb24gKGR1cmF0aW9uLCBwb3NpdGlvbiwgeSwgaGVpZ2h0LCBqdW1wcykge1xuICAgIHJldHVybiBuZXcgY2MuSnVtcFRvKGR1cmF0aW9uLCBwb3NpdGlvbiwgeSwgaGVpZ2h0LCBqdW1wcyk7XG59O1xuXG4vKiBBbiBhY3Rpb24gdGhhdCBtb3ZlcyB0aGUgdGFyZ2V0IHdpdGggYSBjdWJpYyBCZXppZXIgY3VydmUgYnkgYSBjZXJ0YWluIGRpc3RhbmNlLlxuICogUmVsYXRpdmUgdG8gaXRzIG1vdmVtZW50LlxuICogQGNsYXNzIEJlemllckJ5XG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnRlcnZhbFxuICogQHBhcmFtIHtOdW1iZXJ9IHQgLSB0aW1lIGluIHNlY29uZHNcbiAqIEBwYXJhbSB7VmVjMltdfSBjIC0gQXJyYXkgb2YgcG9pbnRzXG4gKiBAZXhhbXBsZVxuICogdmFyIGJlemllciA9IFtjYy52MigwLCB3aW5kb3dTaXplLmhlaWdodCAvIDIpLCBjYy52MigzMDAsIC13aW5kb3dTaXplLmhlaWdodCAvIDIpLCBjYy52MigzMDAsIDEwMCldO1xuICogdmFyIGJlemllckZvcndhcmQgPSBuZXcgY2MuQmV6aWVyQnkoMywgYmV6aWVyKTtcbiAqL1xuZnVuY3Rpb24gYmV6aWVyQXQgKGEsIGIsIGMsIGQsIHQpIHtcbiAgICByZXR1cm4gKE1hdGgucG93KDEgLSB0LCAzKSAqIGEgK1xuICAgICAgICAzICogdCAqIChNYXRoLnBvdygxIC0gdCwgMikpICogYiArXG4gICAgICAgIDMgKiBNYXRoLnBvdyh0LCAyKSAqICgxIC0gdCkgKiBjICtcbiAgICAgICAgTWF0aC5wb3codCwgMykgKiBkICk7XG59O1xuY2MuQmV6aWVyQnkgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkJlemllckJ5JyxcbiAgICBleHRlbmRzOiBjYy5BY3Rpb25JbnRlcnZhbCxcblxuICAgIGN0b3I6ZnVuY3Rpb24gKHQsIGMpIHtcbiAgICAgICAgdGhpcy5fY29uZmlnID0gW107XG4gICAgICAgIHRoaXMuX3N0YXJ0UG9zaXRpb24gPSBjYy52MigwLCAwKTtcbiAgICAgICAgdGhpcy5fcHJldmlvdXNQb3NpdGlvbiA9IGNjLnYyKDAsIDApO1xuICAgICAgICBjICYmIGNjLkJlemllckJ5LnByb3RvdHlwZS5pbml0V2l0aER1cmF0aW9uLmNhbGwodGhpcywgdCwgYyk7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIGFjdGlvbi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCAtIHRpbWUgaW4gc2Vjb25kc1xuICAgICAqIEBwYXJhbSB7VmVjMltdfSBjIC0gQXJyYXkgb2YgcG9pbnRzXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpbml0V2l0aER1cmF0aW9uOmZ1bmN0aW9uICh0LCBjKSB7XG4gICAgICAgIGlmIChjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuaW5pdFdpdGhEdXJhdGlvbi5jYWxsKHRoaXMsIHQpKSB7XG4gICAgICAgICAgICB0aGlzLl9jb25maWcgPSBjO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBjbG9uZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuQmV6aWVyQnkoKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIHZhciBuZXdDb25maWdzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fY29uZmlnLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc2VsQ29uZiA9IHRoaXMuX2NvbmZpZ1tpXTtcbiAgICAgICAgICAgIG5ld0NvbmZpZ3MucHVzaChjYy52MihzZWxDb25mLngsIHNlbENvbmYueSkpO1xuICAgICAgICB9XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aER1cmF0aW9uKHRoaXMuX2R1cmF0aW9uLCBuZXdDb25maWdzKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9LFxuXG4gICAgc3RhcnRXaXRoVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLnN0YXJ0V2l0aFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XG4gICAgICAgIHZhciBsb2NQb3NYID0gdGFyZ2V0Lng7XG4gICAgICAgIHZhciBsb2NQb3NZID0gdGFyZ2V0Lnk7XG4gICAgICAgIHRoaXMuX3ByZXZpb3VzUG9zaXRpb24ueCA9IGxvY1Bvc1g7XG4gICAgICAgIHRoaXMuX3ByZXZpb3VzUG9zaXRpb24ueSA9IGxvY1Bvc1k7XG4gICAgICAgIHRoaXMuX3N0YXJ0UG9zaXRpb24ueCA9IGxvY1Bvc1g7XG4gICAgICAgIHRoaXMuX3N0YXJ0UG9zaXRpb24ueSA9IGxvY1Bvc1k7XG4gICAgfSxcblxuICAgIHVwZGF0ZTpmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgZHQgPSB0aGlzLl9jb21wdXRlRWFzZVRpbWUoZHQpO1xuICAgICAgICBpZiAodGhpcy50YXJnZXQpIHtcbiAgICAgICAgICAgIHZhciBsb2NDb25maWcgPSB0aGlzLl9jb25maWc7XG4gICAgICAgICAgICB2YXIgeGEgPSAwO1xuICAgICAgICAgICAgdmFyIHhiID0gbG9jQ29uZmlnWzBdLng7XG4gICAgICAgICAgICB2YXIgeGMgPSBsb2NDb25maWdbMV0ueDtcbiAgICAgICAgICAgIHZhciB4ZCA9IGxvY0NvbmZpZ1syXS54O1xuXG4gICAgICAgICAgICB2YXIgeWEgPSAwO1xuICAgICAgICAgICAgdmFyIHliID0gbG9jQ29uZmlnWzBdLnk7XG4gICAgICAgICAgICB2YXIgeWMgPSBsb2NDb25maWdbMV0ueTtcbiAgICAgICAgICAgIHZhciB5ZCA9IGxvY0NvbmZpZ1syXS55O1xuXG4gICAgICAgICAgICB2YXIgeCA9IGJlemllckF0KHhhLCB4YiwgeGMsIHhkLCBkdCk7XG4gICAgICAgICAgICB2YXIgeSA9IGJlemllckF0KHlhLCB5YiwgeWMsIHlkLCBkdCk7XG5cbiAgICAgICAgICAgIHZhciBsb2NTdGFydFBvc2l0aW9uID0gdGhpcy5fc3RhcnRQb3NpdGlvbjtcbiAgICAgICAgICAgIGlmIChjYy5tYWNyby5FTkFCTEVfU1RBQ0tBQkxFX0FDVElPTlMpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0WCA9IHRoaXMudGFyZ2V0Lng7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldFkgPSB0aGlzLnRhcmdldC55O1xuICAgICAgICAgICAgICAgIHZhciBsb2NQcmV2aW91c1Bvc2l0aW9uID0gdGhpcy5fcHJldmlvdXNQb3NpdGlvbjtcblxuICAgICAgICAgICAgICAgIGxvY1N0YXJ0UG9zaXRpb24ueCA9IGxvY1N0YXJ0UG9zaXRpb24ueCArIHRhcmdldFggLSBsb2NQcmV2aW91c1Bvc2l0aW9uLng7XG4gICAgICAgICAgICAgICAgbG9jU3RhcnRQb3NpdGlvbi55ID0gbG9jU3RhcnRQb3NpdGlvbi55ICsgdGFyZ2V0WSAtIGxvY1ByZXZpb3VzUG9zaXRpb24ueTtcbiAgICAgICAgICAgICAgICB4ID0geCArIGxvY1N0YXJ0UG9zaXRpb24ueDtcbiAgICAgICAgICAgICAgICB5ID0geSArIGxvY1N0YXJ0UG9zaXRpb24ueTtcblx0ICAgICAgICAgICAgbG9jUHJldmlvdXNQb3NpdGlvbi54ID0geDtcblx0ICAgICAgICAgICAgbG9jUHJldmlvdXNQb3NpdGlvbi55ID0geTtcblx0ICAgICAgICAgICAgdGhpcy50YXJnZXQuc2V0UG9zaXRpb24oeCwgeSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0LnNldFBvc2l0aW9uKGxvY1N0YXJ0UG9zaXRpb24ueCArIHgsIGxvY1N0YXJ0UG9zaXRpb24ueSArIHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJldmVyc2U6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbG9jQ29uZmlnID0gdGhpcy5fY29uZmlnO1xuICAgICAgICB2YXIgeDAgPSBsb2NDb25maWdbMF0ueCwgeTAgPSBsb2NDb25maWdbMF0ueTtcbiAgICAgICAgdmFyIHgxID0gbG9jQ29uZmlnWzFdLngsIHkxID0gbG9jQ29uZmlnWzFdLnk7XG4gICAgICAgIHZhciB4MiA9IGxvY0NvbmZpZ1syXS54LCB5MiA9IGxvY0NvbmZpZ1syXS55O1xuICAgICAgICB2YXIgciA9IFtcbiAgICAgICAgICAgIGNjLnYyKHgxIC0geDIsIHkxIC0geTIpLFxuICAgICAgICAgICAgY2MudjIoeDAgLSB4MiwgeTAgLSB5MiksXG4gICAgICAgICAgICBjYy52MigteDIsIC15MikgXTtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5CZXppZXJCeSh0aGlzLl9kdXJhdGlvbiwgcik7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICB0aGlzLl9yZXZlcnNlRWFzZUxpc3QoYWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBBbiBhY3Rpb24gdGhhdCBtb3ZlcyB0aGUgdGFyZ2V0IHdpdGggYSBjdWJpYyBCZXppZXIgY3VydmUgYnkgYSBjZXJ0YWluIGRpc3RhbmNlLlxuICogUmVsYXRpdmUgdG8gaXRzIG1vdmVtZW50LlxuICogISN6aCDmjInotJ3otZvlsJTmm7Lnur/ovajov7nnp7vliqjmjIflrprnmoTot53nprvjgIJcbiAqIEBtZXRob2QgYmV6aWVyQnlcbiAqIEBwYXJhbSB7TnVtYmVyfSB0IC0gdGltZSBpbiBzZWNvbmRzXG4gKiBAcGFyYW0ge1ZlYzJbXX0gYyAtIEFycmF5IG9mIHBvaW50c1xuICogQHJldHVybiB7QWN0aW9uSW50ZXJ2YWx9XG4gKiBAZXhhbXBsZVxuICogLy8gZXhhbXBsZVxuICogdmFyIGJlemllciA9IFtjYy52MigwLCB3aW5kb3dTaXplLmhlaWdodCAvIDIpLCBjYy52MigzMDAsIC13aW5kb3dTaXplLmhlaWdodCAvIDIpLCBjYy52MigzMDAsIDEwMCldO1xuICogdmFyIGJlemllckZvcndhcmQgPSBjYy5iZXppZXJCeSgzLCBiZXppZXIpO1xuICovXG5jYy5iZXppZXJCeSA9IGZ1bmN0aW9uICh0LCBjKSB7XG4gICAgcmV0dXJuIG5ldyBjYy5CZXppZXJCeSh0LCBjKTtcbn07XG5cblxuLyogQW4gYWN0aW9uIHRoYXQgbW92ZXMgdGhlIHRhcmdldCB3aXRoIGEgY3ViaWMgQmV6aWVyIGN1cnZlIHRvIGEgZGVzdGluYXRpb24gcG9pbnQuXG4gKiBAY2xhc3MgQmV6aWVyVG9cbiAqIEBleHRlbmRzIEJlemllckJ5XG4gKiBAcGFyYW0ge051bWJlcn0gdFxuICogQHBhcmFtIHtWZWMyW119IGMgLSBBcnJheSBvZiBwb2ludHNcbiAqIEBleGFtcGxlXG4gKiB2YXIgYmV6aWVyID0gW2NjLnYyKDAsIHdpbmRvd1NpemUuaGVpZ2h0IC8gMiksIGNjLnYyKDMwMCwgLXdpbmRvd1NpemUuaGVpZ2h0IC8gMiksIGNjLnYyKDMwMCwgMTAwKV07XG4gKiB2YXIgYmV6aWVyVG8gPSBuZXcgY2MuQmV6aWVyVG8oMiwgYmV6aWVyKTtcbiAqL1xuY2MuQmV6aWVyVG8gPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkJlemllclRvJyxcbiAgICBleHRlbmRzOiBjYy5CZXppZXJCeSxcblxuICAgIGN0b3I6ZnVuY3Rpb24gKHQsIGMpIHtcbiAgICAgICAgdGhpcy5fdG9Db25maWcgPSBbXTtcblx0XHRjICYmIHRoaXMuaW5pdFdpdGhEdXJhdGlvbih0LCBjKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgYWN0aW9uLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IHRpbWUgaW4gc2Vjb25kc1xuICAgICAqIEBwYXJhbSB7VmVjMltdfSBjIC0gQXJyYXkgb2YgcG9pbnRzXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpbml0V2l0aER1cmF0aW9uOmZ1bmN0aW9uICh0LCBjKSB7XG4gICAgICAgIGlmIChjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuaW5pdFdpdGhEdXJhdGlvbi5jYWxsKHRoaXMsIHQpKSB7XG4gICAgICAgICAgICB0aGlzLl90b0NvbmZpZyA9IGM7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5CZXppZXJUbygpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoRHVyYXRpb24odGhpcy5fZHVyYXRpb24sIHRoaXMuX3RvQ29uZmlnKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9LFxuXG4gICAgc3RhcnRXaXRoVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgY2MuQmV6aWVyQnkucHJvdG90eXBlLnN0YXJ0V2l0aFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XG4gICAgICAgIHZhciBsb2NTdGFydFBvcyA9IHRoaXMuX3N0YXJ0UG9zaXRpb247XG4gICAgICAgIHZhciBsb2NUb0NvbmZpZyA9IHRoaXMuX3RvQ29uZmlnO1xuICAgICAgICB2YXIgbG9jQ29uZmlnID0gdGhpcy5fY29uZmlnO1xuXG4gICAgICAgIGxvY0NvbmZpZ1swXSA9IGxvY1RvQ29uZmlnWzBdLnN1Yihsb2NTdGFydFBvcyk7XG4gICAgICAgIGxvY0NvbmZpZ1sxXSA9IGxvY1RvQ29uZmlnWzFdLnN1Yihsb2NTdGFydFBvcyk7XG4gICAgICAgIGxvY0NvbmZpZ1syXSA9IGxvY1RvQ29uZmlnWzJdLnN1Yihsb2NTdGFydFBvcyk7XG4gICAgfVxufSk7XG4vKipcbiAqICEjZW4gQW4gYWN0aW9uIHRoYXQgbW92ZXMgdGhlIHRhcmdldCB3aXRoIGEgY3ViaWMgQmV6aWVyIGN1cnZlIHRvIGEgZGVzdGluYXRpb24gcG9pbnQuXG4gKiAhI3poIOaMiei0nei1m+WwlOabsue6v+i9qOi/ueenu+WKqOWIsOebruagh+S9jee9ruOAglxuICogQG1ldGhvZCBiZXppZXJUb1xuICogQHBhcmFtIHtOdW1iZXJ9IHRcbiAqIEBwYXJhbSB7VmVjMltdfSBjIC0gQXJyYXkgb2YgcG9pbnRzXG4gKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cbiAqIEBleGFtcGxlXG4gKiAvLyBleGFtcGxlXG4gKiB2YXIgYmV6aWVyID0gW2NjLnYyKDAsIHdpbmRvd1NpemUuaGVpZ2h0IC8gMiksIGNjLnYyKDMwMCwgLXdpbmRvd1NpemUuaGVpZ2h0IC8gMiksIGNjLnYyKDMwMCwgMTAwKV07XG4gKiB2YXIgYmV6aWVyVG8gPSBjYy5iZXppZXJUbygyLCBiZXppZXIpO1xuICovXG5jYy5iZXppZXJUbyA9IGZ1bmN0aW9uICh0LCBjKSB7XG4gICAgcmV0dXJuIG5ldyBjYy5CZXppZXJUbyh0LCBjKTtcbn07XG5cblxuLyogU2NhbGVzIGEgTm9kZSBvYmplY3QgdG8gYSB6b29tIGZhY3RvciBieSBtb2RpZnlpbmcgaXQncyBzY2FsZSBwcm9wZXJ0eS5cbiAqIEB3YXJuaW5nIFRoaXMgYWN0aW9uIGRvZXNuJ3Qgc3VwcG9ydCBcInJldmVyc2VcIlxuICogQGNsYXNzIFNjYWxlVG9cbiAqIEBleHRlbmRzIEFjdGlvbkludGVydmFsXG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSBzeCAgc2NhbGUgcGFyYW1ldGVyIGluIFhcbiAqIEBwYXJhbSB7TnVtYmVyfSBbc3ldIHNjYWxlIHBhcmFtZXRlciBpbiBZLCBpZiBOdWxsIGVxdWFsIHRvIHN4XG4gKiBAZXhhbXBsZVxuICogLy8gSXQgc2NhbGVzIHRvIDAuNSBpbiBib3RoIFggYW5kIFkuXG4gKiB2YXIgYWN0aW9uVG8gPSBuZXcgY2MuU2NhbGVUbygyLCAwLjUpO1xuICpcbiAqIC8vIEl0IHNjYWxlcyB0byAwLjUgaW4geCBhbmQgMiBpbiBZXG4gKiB2YXIgYWN0aW9uVG8gPSBuZXcgY2MuU2NhbGVUbygyLCAwLjUsIDIpO1xuICovXG5jYy5TY2FsZVRvID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5TY2FsZVRvJyxcbiAgICBleHRlbmRzOiBjYy5BY3Rpb25JbnRlcnZhbCxcblxuICAgIGN0b3I6ZnVuY3Rpb24gKGR1cmF0aW9uLCBzeCwgc3kpIHtcbiAgICAgICAgdGhpcy5fc2NhbGVYID0gMTtcbiAgICAgICAgdGhpcy5fc2NhbGVZID0gMTtcbiAgICAgICAgdGhpcy5fc3RhcnRTY2FsZVggPSAxO1xuICAgICAgICB0aGlzLl9zdGFydFNjYWxlWSA9IDE7XG4gICAgICAgIHRoaXMuX2VuZFNjYWxlWCA9IDA7XG4gICAgICAgIHRoaXMuX2VuZFNjYWxlWSA9IDA7XG4gICAgICAgIHRoaXMuX2RlbHRhWCA9IDA7XG4gICAgICAgIHRoaXMuX2RlbHRhWSA9IDA7XG4gICAgICAgIHN4ICE9PSB1bmRlZmluZWQgJiYgY2MuU2NhbGVUby5wcm90b3R5cGUuaW5pdFdpdGhEdXJhdGlvbi5jYWxsKHRoaXMsIGR1cmF0aW9uLCBzeCwgc3kpO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBhY3Rpb24uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHN4XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtzeT1dXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpbml0V2l0aER1cmF0aW9uOmZ1bmN0aW9uIChkdXJhdGlvbiwgc3gsIHN5KSB7IC8vZnVuY3Rpb24gb3ZlcmxvYWQgaGVyZVxuICAgICAgICBpZiAoY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLmluaXRXaXRoRHVyYXRpb24uY2FsbCh0aGlzLCBkdXJhdGlvbikpIHtcbiAgICAgICAgICAgIHRoaXMuX2VuZFNjYWxlWCA9IHN4O1xuICAgICAgICAgICAgdGhpcy5fZW5kU2NhbGVZID0gKHN5ICE9IG51bGwpID8gc3kgOiBzeDtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgY2xvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLlNjYWxlVG8oKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aER1cmF0aW9uKHRoaXMuX2R1cmF0aW9uLCB0aGlzLl9lbmRTY2FsZVgsIHRoaXMuX2VuZFNjYWxlWSk7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIHN0YXJ0V2l0aFRhcmdldDpmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGNjLkFjdGlvbkludGVydmFsLnByb3RvdHlwZS5zdGFydFdpdGhUYXJnZXQuY2FsbCh0aGlzLCB0YXJnZXQpO1xuICAgICAgICB0aGlzLl9zdGFydFNjYWxlWCA9IHRhcmdldC5zY2FsZVg7XG4gICAgICAgIHRoaXMuX3N0YXJ0U2NhbGVZID0gdGFyZ2V0LnNjYWxlWTtcbiAgICAgICAgdGhpcy5fZGVsdGFYID0gdGhpcy5fZW5kU2NhbGVYIC0gdGhpcy5fc3RhcnRTY2FsZVg7XG4gICAgICAgIHRoaXMuX2RlbHRhWSA9IHRoaXMuX2VuZFNjYWxlWSAtIHRoaXMuX3N0YXJ0U2NhbGVZO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6ZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIGR0ID0gdGhpcy5fY29tcHV0ZUVhc2VUaW1lKGR0KTtcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0KSB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldC5zY2FsZVggPSB0aGlzLl9zdGFydFNjYWxlWCArIHRoaXMuX2RlbHRhWCAqIGR0O1xuXHQgICAgICAgIHRoaXMudGFyZ2V0LnNjYWxlWSA9IHRoaXMuX3N0YXJ0U2NhbGVZICsgdGhpcy5fZGVsdGFZICogZHQ7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbi8qKlxuICogISNlbiBTY2FsZXMgYSBOb2RlIG9iamVjdCB0byBhIHpvb20gZmFjdG9yIGJ5IG1vZGlmeWluZyBpdCdzIHNjYWxlIHByb3BlcnR5LlxuICogISN6aCDlsIboioLngrnlpKflsI/nvKnmlL7liLDmjIflrprnmoTlgI3mlbDjgIJcbiAqIEBtZXRob2Qgc2NhbGVUb1xuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uXG4gKiBAcGFyYW0ge051bWJlcn0gc3ggIHNjYWxlIHBhcmFtZXRlciBpbiBYXG4gKiBAcGFyYW0ge051bWJlcn0gW3N5XSBzY2FsZSBwYXJhbWV0ZXIgaW4gWSwgaWYgTnVsbCBlcXVhbCB0byBzeFxuICogQHJldHVybiB7QWN0aW9uSW50ZXJ2YWx9XG4gKiBAZXhhbXBsZVxuICogLy8gZXhhbXBsZVxuICogLy8gSXQgc2NhbGVzIHRvIDAuNSBpbiBib3RoIFggYW5kIFkuXG4gKiB2YXIgYWN0aW9uVG8gPSBjYy5zY2FsZVRvKDIsIDAuNSk7XG4gKlxuICogLy8gSXQgc2NhbGVzIHRvIDAuNSBpbiB4IGFuZCAyIGluIFlcbiAqIHZhciBhY3Rpb25UbyA9IGNjLnNjYWxlVG8oMiwgMC41LCAyKTtcbiAqL1xuY2Muc2NhbGVUbyA9IGZ1bmN0aW9uIChkdXJhdGlvbiwgc3gsIHN5KSB7IC8vZnVuY3Rpb24gb3ZlcmxvYWRcbiAgICByZXR1cm4gbmV3IGNjLlNjYWxlVG8oZHVyYXRpb24sIHN4LCBzeSk7XG59O1xuXG5cbi8qIFNjYWxlcyBhIE5vZGUgb2JqZWN0IGEgem9vbSBmYWN0b3IgYnkgbW9kaWZ5aW5nIGl0J3Mgc2NhbGUgcHJvcGVydHkuXG4gKiBSZWxhdGl2ZSB0byBpdHMgY2hhbmdlcy5cbiAqIEBjbGFzcyBTY2FsZUJ5XG4gKiBAZXh0ZW5kcyBTY2FsZVRvXG4gKi9cbmNjLlNjYWxlQnkgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlNjYWxlQnknLFxuICAgIGV4dGVuZHM6IGNjLlNjYWxlVG8sXG5cbiAgICBzdGFydFdpdGhUYXJnZXQ6ZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBjYy5TY2FsZVRvLnByb3RvdHlwZS5zdGFydFdpdGhUYXJnZXQuY2FsbCh0aGlzLCB0YXJnZXQpO1xuICAgICAgICB0aGlzLl9kZWx0YVggPSB0aGlzLl9zdGFydFNjYWxlWCAqIHRoaXMuX2VuZFNjYWxlWCAtIHRoaXMuX3N0YXJ0U2NhbGVYO1xuICAgICAgICB0aGlzLl9kZWx0YVkgPSB0aGlzLl9zdGFydFNjYWxlWSAqIHRoaXMuX2VuZFNjYWxlWSAtIHRoaXMuX3N0YXJ0U2NhbGVZO1xuICAgIH0sXG5cbiAgICByZXZlcnNlOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5TY2FsZUJ5KHRoaXMuX2R1cmF0aW9uLCAxIC8gdGhpcy5fZW5kU2NhbGVYLCAxIC8gdGhpcy5fZW5kU2NhbGVZKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIHRoaXMuX3JldmVyc2VFYXNlTGlzdChhY3Rpb24pO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBjbG9uZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuU2NhbGVCeSgpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoRHVyYXRpb24odGhpcy5fZHVyYXRpb24sIHRoaXMuX2VuZFNjYWxlWCwgdGhpcy5fZW5kU2NhbGVZKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9XG59KTtcbi8qKlxuICogISNlblxuICogU2NhbGVzIGEgTm9kZSBvYmplY3QgYSB6b29tIGZhY3RvciBieSBtb2RpZnlpbmcgaXQncyBzY2FsZSBwcm9wZXJ0eS5cbiAqIFJlbGF0aXZlIHRvIGl0cyBjaGFuZ2VzLlxuICogISN6aCDmjInmjIflrprnmoTlgI3mlbDnvKnmlL7oioLngrnlpKflsI/jgIJcbiAqIEBtZXRob2Qgc2NhbGVCeVxuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIGR1cmF0aW9uIGluIHNlY29uZHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBzeCBzeCAgc2NhbGUgcGFyYW1ldGVyIGluIFhcbiAqIEBwYXJhbSB7TnVtYmVyfE51bGx9IFtzeT1dIHN5IHNjYWxlIHBhcmFtZXRlciBpbiBZLCBpZiBOdWxsIGVxdWFsIHRvIHN4XG4gKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cbiAqIEBleGFtcGxlXG4gKiAvLyBleGFtcGxlIHdpdGhvdXQgc3ksIGl0IHNjYWxlcyBieSAyIGJvdGggaW4gWCBhbmQgWVxuICogdmFyIGFjdGlvbkJ5ID0gY2Muc2NhbGVCeSgyLCAyKTtcbiAqXG4gKiAvL2V4YW1wbGUgd2l0aCBzeSwgaXQgc2NhbGVzIGJ5IDAuMjUgaW4gWCBhbmQgNC41IGluIFlcbiAqIHZhciBhY3Rpb25CeTIgPSBjYy5zY2FsZUJ5KDIsIDAuMjUsIDQuNSk7XG4gKi9cbmNjLnNjYWxlQnkgPSBmdW5jdGlvbiAoZHVyYXRpb24sIHN4LCBzeSkge1xuICAgIHJldHVybiBuZXcgY2MuU2NhbGVCeShkdXJhdGlvbiwgc3gsIHN5KTtcbn07XG5cbi8qIEJsaW5rcyBhIE5vZGUgb2JqZWN0IGJ5IG1vZGlmeWluZyBpdCdzIHZpc2libGUgcHJvcGVydHlcbiAqIEBjbGFzcyBCbGlua1xuICogQGV4dGVuZHMgQWN0aW9uSW50ZXJ2YWxcbiAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiAgZHVyYXRpb24gaW4gc2Vjb25kc1xuICogQHBhcmFtIHtOdW1iZXJ9IGJsaW5rcyAgYmxpbmtzIGluIHRpbWVzXG4gKiBAZXhhbXBsZVxuICogdmFyIGFjdGlvbiA9IG5ldyBjYy5CbGluaygyLCAxMCk7XG4gKi9cbmNjLkJsaW5rID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5CbGluaycsXG4gICAgZXh0ZW5kczogY2MuQWN0aW9uSW50ZXJ2YWwsXG5cbiAgICBjdG9yOmZ1bmN0aW9uIChkdXJhdGlvbiwgYmxpbmtzKSB7XG4gICAgICAgIHRoaXMuX3RpbWVzID0gMDtcbiAgICAgICAgdGhpcy5fb3JpZ2luYWxTdGF0ZSA9IGZhbHNlO1xuXHRcdGJsaW5rcyAhPT0gdW5kZWZpbmVkICYmIHRoaXMuaW5pdFdpdGhEdXJhdGlvbihkdXJhdGlvbiwgYmxpbmtzKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgYWN0aW9uLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGJsaW5rcyBibGlua3MgaW4gdGltZXNcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGluaXRXaXRoRHVyYXRpb246ZnVuY3Rpb24gKGR1cmF0aW9uLCBibGlua3MpIHtcbiAgICAgICAgaWYgKGNjLkFjdGlvbkludGVydmFsLnByb3RvdHlwZS5pbml0V2l0aER1cmF0aW9uLmNhbGwodGhpcywgZHVyYXRpb24pKSB7XG4gICAgICAgICAgICB0aGlzLl90aW1lcyA9IGJsaW5rcztcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgY2xvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLkJsaW5rKCk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICBhY3Rpb24uaW5pdFdpdGhEdXJhdGlvbih0aGlzLl9kdXJhdGlvbiwgdGhpcy5fdGltZXMpO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6ZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIGR0ID0gdGhpcy5fY29tcHV0ZUVhc2VUaW1lKGR0KTtcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0ICYmICF0aGlzLmlzRG9uZSgpKSB7XG4gICAgICAgICAgICB2YXIgc2xpY2UgPSAxLjAgLyB0aGlzLl90aW1lcztcbiAgICAgICAgICAgIHZhciBtID0gZHQgJSBzbGljZTtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0Lm9wYWNpdHkgPSAobSA+IChzbGljZSAvIDIpKSA/IDI1NSA6IDA7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RhcnRXaXRoVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLnN0YXJ0V2l0aFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XG4gICAgICAgIHRoaXMuX29yaWdpbmFsU3RhdGUgPSB0YXJnZXQub3BhY2l0eTtcbiAgICB9LFxuXG4gICAgc3RvcDpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0Lm9wYWNpdHkgPSB0aGlzLl9vcmlnaW5hbFN0YXRlO1xuICAgICAgICBjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuc3RvcC5jYWxsKHRoaXMpO1xuICAgIH0sXG5cbiAgICByZXZlcnNlOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5CbGluayh0aGlzLl9kdXJhdGlvbiwgdGhpcy5fdGltZXMpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgdGhpcy5fcmV2ZXJzZUVhc2VMaXN0KGFjdGlvbik7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfVxufSk7XG4vKipcbiAqICEjZW4gQmxpbmtzIGEgTm9kZSBvYmplY3QgYnkgbW9kaWZ5aW5nIGl0J3MgdmlzaWJsZSBwcm9wZXJ0eS5cbiAqICEjemgg6Zeq54OB77yI5Z+65LqO6YCP5piO5bqm77yJ44CCXG4gKiBAbWV0aG9kIGJsaW5rXG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gIGR1cmF0aW9uIGluIHNlY29uZHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBibGlua3MgYmxpbmtzIGluIHRpbWVzXG4gKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cbiAqIEBleGFtcGxlXG4gKiAvLyBleGFtcGxlXG4gKiB2YXIgYWN0aW9uID0gY2MuYmxpbmsoMiwgMTApO1xuICovXG5jYy5ibGluayA9IGZ1bmN0aW9uIChkdXJhdGlvbiwgYmxpbmtzKSB7XG4gICAgcmV0dXJuIG5ldyBjYy5CbGluayhkdXJhdGlvbiwgYmxpbmtzKTtcbn07XG5cbi8qIEZhZGVzIGFuIG9iamVjdCB0aGF0IGltcGxlbWVudHMgdGhlIGNjLlJHQkFQcm90b2NvbCBwcm90b2NvbC4gSXQgbW9kaWZpZXMgdGhlIG9wYWNpdHkgZnJvbSB0aGUgY3VycmVudCB2YWx1ZSB0byBhIGN1c3RvbSBvbmUuXG4gKiBAd2FybmluZyBUaGlzIGFjdGlvbiBkb2Vzbid0IHN1cHBvcnQgXCJyZXZlcnNlXCJcbiAqIEBjbGFzcyBGYWRlVG9cbiAqIEBleHRlbmRzIEFjdGlvbkludGVydmFsXG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSBvcGFjaXR5IDAtMjU1LCAwIGlzIHRyYW5zcGFyZW50XG4gKiBAZXhhbXBsZVxuICogdmFyIGFjdGlvbiA9IG5ldyBjYy5GYWRlVG8oMS4wLCAwKTtcbiAqL1xuY2MuRmFkZVRvID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5GYWRlVG8nLFxuICAgIGV4dGVuZHM6IGNjLkFjdGlvbkludGVydmFsLFxuXG4gICAgY3RvcjpmdW5jdGlvbiAoZHVyYXRpb24sIG9wYWNpdHkpIHtcbiAgICAgICAgdGhpcy5fdG9PcGFjaXR5ID0gMDtcbiAgICAgICAgdGhpcy5fZnJvbU9wYWNpdHkgPSAwO1xuICAgICAgICBvcGFjaXR5ICE9PSB1bmRlZmluZWQgJiYgY2MuRmFkZVRvLnByb3RvdHlwZS5pbml0V2l0aER1cmF0aW9uLmNhbGwodGhpcywgZHVyYXRpb24sIG9wYWNpdHkpO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBhY3Rpb24uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uICBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9wYWNpdHlcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGluaXRXaXRoRHVyYXRpb246ZnVuY3Rpb24gKGR1cmF0aW9uLCBvcGFjaXR5KSB7XG4gICAgICAgIGlmIChjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuaW5pdFdpdGhEdXJhdGlvbi5jYWxsKHRoaXMsIGR1cmF0aW9uKSkge1xuICAgICAgICAgICAgdGhpcy5fdG9PcGFjaXR5ID0gb3BhY2l0eTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgY2xvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLkZhZGVUbygpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoRHVyYXRpb24odGhpcy5fZHVyYXRpb24sIHRoaXMuX3RvT3BhY2l0eSk7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIHVwZGF0ZTpmdW5jdGlvbiAodGltZSkge1xuICAgICAgICB0aW1lID0gdGhpcy5fY29tcHV0ZUVhc2VUaW1lKHRpbWUpO1xuICAgICAgICB2YXIgZnJvbU9wYWNpdHkgPSB0aGlzLl9mcm9tT3BhY2l0eSAhPT0gdW5kZWZpbmVkID8gdGhpcy5fZnJvbU9wYWNpdHkgOiAyNTU7XG4gICAgICAgIHRoaXMudGFyZ2V0Lm9wYWNpdHkgPSBmcm9tT3BhY2l0eSArICh0aGlzLl90b09wYWNpdHkgLSBmcm9tT3BhY2l0eSkgKiB0aW1lO1xuICAgIH0sXG5cbiAgICBzdGFydFdpdGhUYXJnZXQ6ZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcbiAgICAgICAgdGhpcy5fZnJvbU9wYWNpdHkgPSB0YXJnZXQub3BhY2l0eTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBGYWRlcyBhbiBvYmplY3QgdGhhdCBpbXBsZW1lbnRzIHRoZSBjYy5SR0JBUHJvdG9jb2wgcHJvdG9jb2wuXG4gKiBJdCBtb2RpZmllcyB0aGUgb3BhY2l0eSBmcm9tIHRoZSBjdXJyZW50IHZhbHVlIHRvIGEgY3VzdG9tIG9uZS5cbiAqICEjemgg5L+u5pS56YCP5piO5bqm5Yiw5oyH5a6a5YC844CCXG4gKiBAbWV0aG9kIGZhZGVUb1xuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uXG4gKiBAcGFyYW0ge051bWJlcn0gb3BhY2l0eSAwLTI1NSwgMCBpcyB0cmFuc3BhcmVudFxuICogQHJldHVybiB7QWN0aW9uSW50ZXJ2YWx9XG4gKiBAZXhhbXBsZVxuICogLy8gZXhhbXBsZVxuICogdmFyIGFjdGlvbiA9IGNjLmZhZGVUbygxLjAsIDApO1xuICovXG5jYy5mYWRlVG8gPSBmdW5jdGlvbiAoZHVyYXRpb24sIG9wYWNpdHkpIHtcbiAgICByZXR1cm4gbmV3IGNjLkZhZGVUbyhkdXJhdGlvbiwgb3BhY2l0eSk7XG59O1xuXG4vKiBGYWRlcyBJbiBhbiBvYmplY3QgdGhhdCBpbXBsZW1lbnRzIHRoZSBjYy5SR0JBUHJvdG9jb2wgcHJvdG9jb2wuIEl0IG1vZGlmaWVzIHRoZSBvcGFjaXR5IGZyb20gMCB0byAyNTUuPGJyLz5cbiAqIFRoZSBcInJldmVyc2VcIiBvZiB0aGlzIGFjdGlvbiBpcyBGYWRlT3V0XG4gKiBAY2xhc3MgRmFkZUluXG4gKiBAZXh0ZW5kcyBGYWRlVG9cbiAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gKi9cbmNjLkZhZGVJbiA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuRmFkZUluJyxcbiAgICBleHRlbmRzOiBjYy5GYWRlVG8sXG5cbiAgICBjdG9yOmZ1bmN0aW9uIChkdXJhdGlvbikge1xuICAgICAgICBpZiAoZHVyYXRpb24gPT0gbnVsbClcbiAgICAgICAgICAgIGR1cmF0aW9uID0gMDtcbiAgICAgICAgdGhpcy5fcmV2ZXJzZUFjdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuaW5pdFdpdGhEdXJhdGlvbihkdXJhdGlvbiwgMjU1KTtcbiAgICB9LFxuXG4gICAgcmV2ZXJzZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuRmFkZU91dCgpO1xuICAgICAgICBhY3Rpb24uaW5pdFdpdGhEdXJhdGlvbih0aGlzLl9kdXJhdGlvbiwgMCk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICB0aGlzLl9yZXZlcnNlRWFzZUxpc3QoYWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9LFxuXG4gICAgY2xvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLkZhZGVJbigpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoRHVyYXRpb24odGhpcy5fZHVyYXRpb24sIHRoaXMuX3RvT3BhY2l0eSk7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIHN0YXJ0V2l0aFRhcmdldDpmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGlmKHRoaXMuX3JldmVyc2VBY3Rpb24pXG4gICAgICAgICAgICB0aGlzLl90b09wYWNpdHkgPSB0aGlzLl9yZXZlcnNlQWN0aW9uLl9mcm9tT3BhY2l0eTtcbiAgICAgICAgY2MuRmFkZVRvLnByb3RvdHlwZS5zdGFydFdpdGhUYXJnZXQuY2FsbCh0aGlzLCB0YXJnZXQpO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqICEjZW4gRmFkZXMgSW4gYW4gb2JqZWN0IHRoYXQgaW1wbGVtZW50cyB0aGUgY2MuUkdCQVByb3RvY29sIHByb3RvY29sLiBJdCBtb2RpZmllcyB0aGUgb3BhY2l0eSBmcm9tIDAgdG8gMjU1LlxuICogISN6aCDmuJDmmL7mlYjmnpzjgIJcbiAqIEBtZXRob2QgZmFkZUluXG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gZHVyYXRpb24gaW4gc2Vjb25kc1xuICogQHJldHVybiB7QWN0aW9uSW50ZXJ2YWx9XG4gKiBAZXhhbXBsZVxuICogLy9leGFtcGxlXG4gKiB2YXIgYWN0aW9uID0gY2MuZmFkZUluKDEuMCk7XG4gKi9cbmNjLmZhZGVJbiA9IGZ1bmN0aW9uIChkdXJhdGlvbikge1xuICAgIHJldHVybiBuZXcgY2MuRmFkZUluKGR1cmF0aW9uKTtcbn07XG5cblxuLyogRmFkZXMgT3V0IGFuIG9iamVjdCB0aGF0IGltcGxlbWVudHMgdGhlIGNjLlJHQkFQcm90b2NvbCBwcm90b2NvbC4gSXQgbW9kaWZpZXMgdGhlIG9wYWNpdHkgZnJvbSAyNTUgdG8gMC5cbiAqIFRoZSBcInJldmVyc2VcIiBvZiB0aGlzIGFjdGlvbiBpcyBGYWRlSW5cbiAqIEBjbGFzcyBGYWRlT3V0XG4gKiBAZXh0ZW5kcyBGYWRlVG9cbiAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gKi9cbmNjLkZhZGVPdXQgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkZhZGVPdXQnLFxuICAgIGV4dGVuZHM6IGNjLkZhZGVUbyxcblxuICAgIGN0b3I6ZnVuY3Rpb24gKGR1cmF0aW9uKSB7XG4gICAgICAgIGlmIChkdXJhdGlvbiA9PSBudWxsKVxuICAgICAgICAgICAgZHVyYXRpb24gPSAwO1xuICAgICAgICB0aGlzLl9yZXZlcnNlQWN0aW9uID0gbnVsbDtcbiAgICAgICAgdGhpcy5pbml0V2l0aER1cmF0aW9uKGR1cmF0aW9uLCAwKTtcbiAgICB9LFxuXG4gICAgcmV2ZXJzZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuRmFkZUluKCk7XG4gICAgICAgIGFjdGlvbi5fcmV2ZXJzZUFjdGlvbiA9IHRoaXM7XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aER1cmF0aW9uKHRoaXMuX2R1cmF0aW9uLCAyNTUpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgdGhpcy5fcmV2ZXJzZUVhc2VMaXN0KGFjdGlvbik7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5GYWRlT3V0KCk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICBhY3Rpb24uaW5pdFdpdGhEdXJhdGlvbih0aGlzLl9kdXJhdGlvbiwgdGhpcy5fdG9PcGFjaXR5KTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuIEZhZGVzIE91dCBhbiBvYmplY3QgdGhhdCBpbXBsZW1lbnRzIHRoZSBjYy5SR0JBUHJvdG9jb2wgcHJvdG9jb2wuIEl0IG1vZGlmaWVzIHRoZSBvcGFjaXR5IGZyb20gMjU1IHRvIDAuXG4gKiAhI3poIOa4kOmakOaViOaenOOAglxuICogQG1ldGhvZCBmYWRlT3V0XG4gKiBAcGFyYW0ge051bWJlcn0gZCAgZHVyYXRpb24gaW4gc2Vjb25kc1xuICogQHJldHVybiB7QWN0aW9uSW50ZXJ2YWx9XG4gKiBAZXhhbXBsZVxuICogLy8gZXhhbXBsZVxuICogdmFyIGFjdGlvbiA9IGNjLmZhZGVPdXQoMS4wKTtcbiAqL1xuY2MuZmFkZU91dCA9IGZ1bmN0aW9uIChkKSB7XG4gICAgcmV0dXJuIG5ldyBjYy5GYWRlT3V0KGQpO1xufTtcblxuLyogVGludHMgYSBOb2RlIHRoYXQgaW1wbGVtZW50cyB0aGUgY2MuTm9kZVJHQiBwcm90b2NvbCBmcm9tIGN1cnJlbnQgdGludCB0byBhIGN1c3RvbSBvbmUuXG4gKiBAd2FybmluZyBUaGlzIGFjdGlvbiBkb2Vzbid0IHN1cHBvcnQgXCJyZXZlcnNlXCJcbiAqIEBjbGFzcyBUaW50VG9cbiAqIEBleHRlbmRzIEFjdGlvbkludGVydmFsXG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSByZWQgMC0yNTVcbiAqIEBwYXJhbSB7TnVtYmVyfSBncmVlbiAgMC0yNTVcbiAqIEBwYXJhbSB7TnVtYmVyfSBibHVlIDAtMjU1XG4gKiBAZXhhbXBsZVxuICogdmFyIGFjdGlvbiA9IG5ldyBjYy5UaW50VG8oMiwgMjU1LCAwLCAyNTUpO1xuICovXG5jYy5UaW50VG8gPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlRpbnRUbycsXG4gICAgZXh0ZW5kczogY2MuQWN0aW9uSW50ZXJ2YWwsXG5cbiAgICBjdG9yOmZ1bmN0aW9uIChkdXJhdGlvbiwgcmVkLCBncmVlbiwgYmx1ZSkge1xuICAgICAgICB0aGlzLl90byA9IGNjLmNvbG9yKDAsIDAsIDApO1xuICAgICAgICB0aGlzLl9mcm9tID0gY2MuY29sb3IoMCwgMCwgMCk7XG5cbiAgICAgICAgaWYgKHJlZCBpbnN0YW5jZW9mIGNjLkNvbG9yKSB7XG4gICAgICAgICAgICBibHVlID0gcmVkLmI7XG4gICAgICAgICAgICBncmVlbiA9IHJlZC5nO1xuICAgICAgICAgICAgcmVkID0gcmVkLnI7XG4gICAgICAgIH1cblxuICAgICAgICBibHVlICE9PSB1bmRlZmluZWQgJiYgdGhpcy5pbml0V2l0aER1cmF0aW9uKGR1cmF0aW9uLCByZWQsIGdyZWVuLCBibHVlKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgYWN0aW9uLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByZWQgMC0yNTVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZ3JlZW4gMC0yNTVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYmx1ZSAwLTI1NVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaW5pdFdpdGhEdXJhdGlvbjpmdW5jdGlvbiAoZHVyYXRpb24sIHJlZCwgZ3JlZW4sIGJsdWUpIHtcbiAgICAgICAgaWYgKGNjLkFjdGlvbkludGVydmFsLnByb3RvdHlwZS5pbml0V2l0aER1cmF0aW9uLmNhbGwodGhpcywgZHVyYXRpb24pKSB7XG4gICAgICAgICAgICB0aGlzLl90byA9IGNjLmNvbG9yKHJlZCwgZ3JlZW4sIGJsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBjbG9uZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuVGludFRvKCk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICB2YXIgbG9jVG8gPSB0aGlzLl90bztcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoRHVyYXRpb24odGhpcy5fZHVyYXRpb24sIGxvY1RvLnIsIGxvY1RvLmcsIGxvY1RvLmIpO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBzdGFydFdpdGhUYXJnZXQ6ZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcblxuICAgICAgICB0aGlzLl9mcm9tID0gdGhpcy50YXJnZXQuY29sb3I7XG4gICAgfSxcblxuICAgIHVwZGF0ZTpmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgZHQgPSB0aGlzLl9jb21wdXRlRWFzZVRpbWUoZHQpO1xuICAgICAgICB2YXIgbG9jRnJvbSA9IHRoaXMuX2Zyb20sIGxvY1RvID0gdGhpcy5fdG87XG4gICAgICAgIGlmIChsb2NGcm9tKSB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldC5jb2xvciA9IGNjLmNvbG9yKFxuICAgICAgICAgICAgICAgICAgICBsb2NGcm9tLnIgKyAobG9jVG8uciAtIGxvY0Zyb20ucikgKiBkdCxcbiAgICAgICAgICAgICAgICAgICAgbG9jRnJvbS5nICsgKGxvY1RvLmcgLSBsb2NGcm9tLmcpICogZHQsXG4gICAgICAgICAgICAgICAgICAgIGxvY0Zyb20uYiArIChsb2NUby5iIC0gbG9jRnJvbS5iKSAqIGR0KTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG4vKipcbiAqICEjZW4gVGludHMgYSBOb2RlIHRoYXQgaW1wbGVtZW50cyB0aGUgY2MuTm9kZVJHQiBwcm90b2NvbCBmcm9tIGN1cnJlbnQgdGludCB0byBhIGN1c3RvbSBvbmUuXG4gKiAhI3poIOS/ruaUueminOiJsuWIsOaMh+WumuWAvOOAglxuICogQG1ldGhvZCB0aW50VG9cbiAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvblxuICogQHBhcmFtIHtOdW1iZXJ9IHJlZCAwLTI1NVxuICogQHBhcmFtIHtOdW1iZXJ9IGdyZWVuICAwLTI1NVxuICogQHBhcmFtIHtOdW1iZXJ9IGJsdWUgMC0yNTVcbiAqIEByZXR1cm4ge0FjdGlvbkludGVydmFsfVxuICogQGV4YW1wbGVcbiAqIC8vIGV4YW1wbGVcbiAqIHZhciBhY3Rpb24gPSBjYy50aW50VG8oMiwgMjU1LCAwLCAyNTUpO1xuICovXG5jYy50aW50VG8gPSBmdW5jdGlvbiAoZHVyYXRpb24sIHJlZCwgZ3JlZW4sIGJsdWUpIHtcbiAgICByZXR1cm4gbmV3IGNjLlRpbnRUbyhkdXJhdGlvbiwgcmVkLCBncmVlbiwgYmx1ZSk7XG59O1xuXG5cbi8qIFRpbnRzIGEgTm9kZSB0aGF0IGltcGxlbWVudHMgdGhlIGNjLk5vZGVSR0IgcHJvdG9jb2wgZnJvbSBjdXJyZW50IHRpbnQgdG8gYSBjdXN0b20gb25lLlxuICogUmVsYXRpdmUgdG8gdGhlaXIgb3duIGNvbG9yIGNoYW5nZS5cbiAqIEBjbGFzcyBUaW50QnlcbiAqIEBleHRlbmRzIEFjdGlvbkludGVydmFsXG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gIGR1cmF0aW9uIGluIHNlY29uZHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBkZWx0YVJlZFxuICogQHBhcmFtIHtOdW1iZXJ9IGRlbHRhR3JlZW5cbiAqIEBwYXJhbSB7TnVtYmVyfSBkZWx0YUJsdWVcbiAqIEBleGFtcGxlXG4gKiB2YXIgYWN0aW9uID0gbmV3IGNjLlRpbnRCeSgyLCAtMTI3LCAtMjU1LCAtMTI3KTtcbiAqL1xuY2MuVGludEJ5ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5UaW50QnknLFxuICAgIGV4dGVuZHM6IGNjLkFjdGlvbkludGVydmFsLFxuXG4gICAgY3RvcjpmdW5jdGlvbiAoZHVyYXRpb24sIGRlbHRhUmVkLCBkZWx0YUdyZWVuLCBkZWx0YUJsdWUpIHtcbiAgICAgICAgdGhpcy5fZGVsdGFSID0gMDtcbiAgICAgICAgdGhpcy5fZGVsdGFHID0gMDtcbiAgICAgICAgdGhpcy5fZGVsdGFCID0gMDtcbiAgICAgICAgdGhpcy5fZnJvbVIgPSAwO1xuICAgICAgICB0aGlzLl9mcm9tRyA9IDA7XG4gICAgICAgIHRoaXMuX2Zyb21CID0gMDtcblx0XHRkZWx0YUJsdWUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmluaXRXaXRoRHVyYXRpb24oZHVyYXRpb24sIGRlbHRhUmVkLCBkZWx0YUdyZWVuLCBkZWx0YUJsdWUpO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBhY3Rpb24uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGRlbHRhUmVkIDAtMjU1XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGRlbHRhR3JlZW4gMC0yNTVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZGVsdGFCbHVlIDAtMjU1XG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpbml0V2l0aER1cmF0aW9uOmZ1bmN0aW9uIChkdXJhdGlvbiwgZGVsdGFSZWQsIGRlbHRhR3JlZW4sIGRlbHRhQmx1ZSkge1xuICAgICAgICBpZiAoY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLmluaXRXaXRoRHVyYXRpb24uY2FsbCh0aGlzLCBkdXJhdGlvbikpIHtcbiAgICAgICAgICAgIHRoaXMuX2RlbHRhUiA9IGRlbHRhUmVkO1xuICAgICAgICAgICAgdGhpcy5fZGVsdGFHID0gZGVsdGFHcmVlbjtcbiAgICAgICAgICAgIHRoaXMuX2RlbHRhQiA9IGRlbHRhQmx1ZTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgY2xvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLlRpbnRCeSgpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoRHVyYXRpb24odGhpcy5fZHVyYXRpb24sIHRoaXMuX2RlbHRhUiwgdGhpcy5fZGVsdGFHLCB0aGlzLl9kZWx0YUIpO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBzdGFydFdpdGhUYXJnZXQ6ZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcblxuICAgICAgICB2YXIgY29sb3IgPSB0YXJnZXQuY29sb3I7XG4gICAgICAgIHRoaXMuX2Zyb21SID0gY29sb3IucjtcbiAgICAgICAgdGhpcy5fZnJvbUcgPSBjb2xvci5nO1xuICAgICAgICB0aGlzLl9mcm9tQiA9IGNvbG9yLmI7XG4gICAgfSxcblxuICAgIHVwZGF0ZTpmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgZHQgPSB0aGlzLl9jb21wdXRlRWFzZVRpbWUoZHQpO1xuXG4gICAgICAgIHRoaXMudGFyZ2V0LmNvbG9yID0gY2MuY29sb3IodGhpcy5fZnJvbVIgKyB0aGlzLl9kZWx0YVIgKiBkdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Zyb21HICsgdGhpcy5fZGVsdGFHICogZHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9mcm9tQiArIHRoaXMuX2RlbHRhQiAqIGR0KTtcbiAgICB9LFxuXG4gICAgcmV2ZXJzZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuVGludEJ5KHRoaXMuX2R1cmF0aW9uLCAtdGhpcy5fZGVsdGFSLCAtdGhpcy5fZGVsdGFHLCAtdGhpcy5fZGVsdGFCKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIHRoaXMuX3JldmVyc2VFYXNlTGlzdChhY3Rpb24pO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqICEjZW5cbiAqIFRpbnRzIGEgTm9kZSB0aGF0IGltcGxlbWVudHMgdGhlIGNjLk5vZGVSR0IgcHJvdG9jb2wgZnJvbSBjdXJyZW50IHRpbnQgdG8gYSBjdXN0b20gb25lLlxuICogUmVsYXRpdmUgdG8gdGhlaXIgb3duIGNvbG9yIGNoYW5nZS5cbiAqICEjemgg5oyJ54Wn5oyH5a6a55qE5aKe6YeP5L+u5pS56aKc6Imy44CCXG4gKiBAbWV0aG9kIHRpbnRCeVxuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uICBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gKiBAcGFyYW0ge051bWJlcn0gZGVsdGFSZWRcbiAqIEBwYXJhbSB7TnVtYmVyfSBkZWx0YUdyZWVuXG4gKiBAcGFyYW0ge051bWJlcn0gZGVsdGFCbHVlXG4gKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cbiAqIEBleGFtcGxlXG4gKiAvLyBleGFtcGxlXG4gKiB2YXIgYWN0aW9uID0gY2MudGludEJ5KDIsIC0xMjcsIC0yNTUsIC0xMjcpO1xuICovXG5jYy50aW50QnkgPSBmdW5jdGlvbiAoZHVyYXRpb24sIGRlbHRhUmVkLCBkZWx0YUdyZWVuLCBkZWx0YUJsdWUpIHtcbiAgICByZXR1cm4gbmV3IGNjLlRpbnRCeShkdXJhdGlvbiwgZGVsdGFSZWQsIGRlbHRhR3JlZW4sIGRlbHRhQmx1ZSk7XG59O1xuXG4vKiBEZWxheXMgdGhlIGFjdGlvbiBhIGNlcnRhaW4gYW1vdW50IG9mIHNlY29uZHNcbiAqIEBjbGFzcyBEZWxheVRpbWVcbiAqIEBleHRlbmRzIEFjdGlvbkludGVydmFsXG4gKi9cbmNjLkRlbGF5VGltZSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuRGVsYXlUaW1lJyxcbiAgICBleHRlbmRzOiBjYy5BY3Rpb25JbnRlcnZhbCxcblxuICAgIHVwZGF0ZTpmdW5jdGlvbiAoZHQpIHt9LFxuXG4gICAgcmV2ZXJzZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuRGVsYXlUaW1lKHRoaXMuX2R1cmF0aW9uKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIHRoaXMuX3JldmVyc2VFYXNlTGlzdChhY3Rpb24pO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBjbG9uZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuRGVsYXlUaW1lKCk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICBhY3Rpb24uaW5pdFdpdGhEdXJhdGlvbih0aGlzLl9kdXJhdGlvbik7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlbiBEZWxheXMgdGhlIGFjdGlvbiBhIGNlcnRhaW4gYW1vdW50IG9mIHNlY29uZHMuXG4gKiAhI3poIOW7tui/n+aMh+WumueahOaXtumXtOmHj+OAglxuICogQG1ldGhvZCBkZWxheVRpbWVcbiAqIEBwYXJhbSB7TnVtYmVyfSBkIGR1cmF0aW9uIGluIHNlY29uZHNcbiAqIEByZXR1cm4ge0FjdGlvbkludGVydmFsfVxuICogQGV4YW1wbGVcbiAqIC8vIGV4YW1wbGVcbiAqIHZhciBkZWxheSA9IGNjLmRlbGF5VGltZSgxKTtcbiAqL1xuY2MuZGVsYXlUaW1lID0gZnVuY3Rpb24gKGQpIHtcbiAgICByZXR1cm4gbmV3IGNjLkRlbGF5VGltZShkKTtcbn07XG5cbi8qXG4gKiA8cD5cbiAqIEV4ZWN1dGVzIGFuIGFjdGlvbiBpbiByZXZlcnNlIG9yZGVyLCBmcm9tIHRpbWU9ZHVyYXRpb24gdG8gdGltZT0wICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gKiBAd2FybmluZyBVc2UgdGhpcyBhY3Rpb24gY2FyZWZ1bGx5LiBUaGlzIGFjdGlvbiBpcyBub3Qgc2VxdWVuY2VhYmxlLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gKiBVc2UgaXQgYXMgdGhlIGRlZmF1bHQgXCJyZXZlcnNlZFwiIG1ldGhvZCBvZiB5b3VyIG93biBhY3Rpb25zLCBidXQgdXNpbmcgaXQgb3V0c2lkZSB0aGUgXCJyZXZlcnNlZFwiICAgICAgPGJyLz5cbiAqIHNjb3BlIGlzIG5vdCByZWNvbW1lbmRlZC5cbiAqIDwvcD5cbiAqIEBjbGFzcyBSZXZlcnNlVGltZVxuICogQGV4dGVuZHMgQWN0aW9uSW50ZXJ2YWxcbiAqIEBwYXJhbSB7RmluaXRlVGltZUFjdGlvbn0gYWN0aW9uXG4gKiBAZXhhbXBsZVxuICogIHZhciByZXZlcnNlID0gbmV3IGNjLlJldmVyc2VUaW1lKHRoaXMpO1xuICovXG5jYy5SZXZlcnNlVGltZSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuUmV2ZXJzZVRpbWUnLFxuICAgIGV4dGVuZHM6IGNjLkFjdGlvbkludGVydmFsLFxuXG4gICAgY3RvcjpmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgIHRoaXMuX290aGVyID0gbnVsbDtcblx0XHRhY3Rpb24gJiYgdGhpcy5pbml0V2l0aEFjdGlvbihhY3Rpb24pO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEBwYXJhbSB7RmluaXRlVGltZUFjdGlvbn0gYWN0aW9uXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpbml0V2l0aEFjdGlvbjpmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgIGlmICghYWN0aW9uKSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDEwMjgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3Rpb24gPT09IHRoaXMuX290aGVyKSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDEwMjkpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNjLkFjdGlvbkludGVydmFsLnByb3RvdHlwZS5pbml0V2l0aER1cmF0aW9uLmNhbGwodGhpcywgYWN0aW9uLl9kdXJhdGlvbikpIHtcbiAgICAgICAgICAgIC8vIERvbid0IGxlYWsgaWYgYWN0aW9uIGlzIHJldXNlZFxuICAgICAgICAgICAgdGhpcy5fb3RoZXIgPSBhY3Rpb247XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5SZXZlcnNlVGltZSgpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoQWN0aW9uKHRoaXMuX290aGVyLmNsb25lKCkpO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBzdGFydFdpdGhUYXJnZXQ6ZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcbiAgICAgICAgdGhpcy5fb3RoZXIuc3RhcnRXaXRoVGFyZ2V0KHRhcmdldCk7XG4gICAgfSxcblxuICAgIHVwZGF0ZTpmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgZHQgPSB0aGlzLl9jb21wdXRlRWFzZVRpbWUoZHQpO1xuICAgICAgICBpZiAodGhpcy5fb3RoZXIpXG4gICAgICAgICAgICB0aGlzLl9vdGhlci51cGRhdGUoMSAtIGR0KTtcbiAgICB9LFxuXG4gICAgcmV2ZXJzZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vdGhlci5jbG9uZSgpO1xuICAgIH0sXG5cbiAgICBzdG9wOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fb3RoZXIuc3RvcCgpO1xuICAgICAgICBjYy5BY3Rpb24ucHJvdG90eXBlLnN0b3AuY2FsbCh0aGlzKTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuIEV4ZWN1dGVzIGFuIGFjdGlvbiBpbiByZXZlcnNlIG9yZGVyLCBmcm9tIHRpbWU9ZHVyYXRpb24gdG8gdGltZT0wLlxuICogISN6aCDlj43ovaznm67moIfliqjkvZznmoTml7bpl7TovbTjgIJcbiAqIEBtZXRob2QgcmV2ZXJzZVRpbWVcbiAqIEBwYXJhbSB7RmluaXRlVGltZUFjdGlvbn0gYWN0aW9uXG4gKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cbiAqIEBleGFtcGxlXG4gKiAvLyBleGFtcGxlXG4gKiAgdmFyIHJldmVyc2UgPSBjYy5yZXZlcnNlVGltZSh0aGlzKTtcbiAqL1xuY2MucmV2ZXJzZVRpbWUgPSBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgcmV0dXJuIG5ldyBjYy5SZXZlcnNlVGltZShhY3Rpb24pO1xufTtcblxuLypcbiAqIDxwPlxuICogT3ZlcnJpZGVzIHRoZSB0YXJnZXQgb2YgYW4gYWN0aW9uIHNvIHRoYXQgaXQgYWx3YXlzIHJ1bnMgb24gdGhlIHRhcmdldDxici8+XG4gKiBzcGVjaWZpZWQgYXQgYWN0aW9uIGNyZWF0aW9uIHJhdGhlciB0aGFuIHRoZSBvbmUgc3BlY2lmaWVkIGJ5IHJ1bkFjdGlvbi5cbiAqIDwvcD5cbiAqIEBjbGFzcyBUYXJnZXRlZEFjdGlvblxuICogQGV4dGVuZHMgQWN0aW9uSW50ZXJ2YWxcbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge0Zpbml0ZVRpbWVBY3Rpb259IGFjdGlvblxuICovXG5jYy5UYXJnZXRlZEFjdGlvbiA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuVGFyZ2V0ZWRBY3Rpb24nLFxuICAgIGV4dGVuZHM6IGNjLkFjdGlvbkludGVydmFsLFxuXG4gICAgY3RvcjogZnVuY3Rpb24gKHRhcmdldCwgYWN0aW9uKSB7XG4gICAgICAgIHRoaXMuX2FjdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuX2ZvcmNlZFRhcmdldCA9IG51bGw7XG5cdFx0YWN0aW9uICYmIHRoaXMuaW5pdFdpdGhUYXJnZXQodGFyZ2V0LCBhY3Rpb24pO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEluaXQgYW4gYWN0aW9uIHdpdGggdGhlIHNwZWNpZmllZCBhY3Rpb24gYW5kIGZvcmNlZCB0YXJnZXRcbiAgICAgKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICAgICAqIEBwYXJhbSB7RmluaXRlVGltZUFjdGlvbn0gYWN0aW9uXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpbml0V2l0aFRhcmdldDpmdW5jdGlvbiAodGFyZ2V0LCBhY3Rpb24pIHtcbiAgICAgICAgaWYgKHRoaXMuaW5pdFdpdGhEdXJhdGlvbihhY3Rpb24uX2R1cmF0aW9uKSkge1xuICAgICAgICAgICAgdGhpcy5fZm9yY2VkVGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICAgICAgdGhpcy5fYWN0aW9uID0gYWN0aW9uO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBjbG9uZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuVGFyZ2V0ZWRBY3Rpb24oKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aFRhcmdldCh0aGlzLl9mb3JjZWRUYXJnZXQsIHRoaXMuX2FjdGlvbi5jbG9uZSgpKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9LFxuXG4gICAgc3RhcnRXaXRoVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLnN0YXJ0V2l0aFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XG4gICAgICAgIHRoaXMuX2FjdGlvbi5zdGFydFdpdGhUYXJnZXQodGhpcy5fZm9yY2VkVGFyZ2V0KTtcbiAgICB9LFxuXG4gICAgc3RvcDpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2FjdGlvbi5zdG9wKCk7XG4gICAgfSxcblxuICAgIHVwZGF0ZTpmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgZHQgPSB0aGlzLl9jb21wdXRlRWFzZVRpbWUoZHQpO1xuICAgICAgICB0aGlzLl9hY3Rpb24udXBkYXRlKGR0KTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiByZXR1cm4gdGhlIHRhcmdldCB0aGF0IHRoZSBhY3Rpb24gd2lsbCBiZSBmb3JjZWQgdG8gcnVuIHdpdGhcbiAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAqL1xuICAgIGdldEZvcmNlZFRhcmdldDpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mb3JjZWRUYXJnZXQ7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogc2V0IHRoZSB0YXJnZXQgdGhhdCB0aGUgYWN0aW9uIHdpbGwgYmUgZm9yY2VkIHRvIHJ1biB3aXRoXG4gICAgICogQHBhcmFtIHtOb2RlfSBmb3JjZWRUYXJnZXRcbiAgICAgKi9cbiAgICBzZXRGb3JjZWRUYXJnZXQ6ZnVuY3Rpb24gKGZvcmNlZFRhcmdldCkge1xuICAgICAgICBpZiAodGhpcy5fZm9yY2VkVGFyZ2V0ICE9PSBmb3JjZWRUYXJnZXQpXG4gICAgICAgICAgICB0aGlzLl9mb3JjZWRUYXJnZXQgPSBmb3JjZWRUYXJnZXQ7XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlbiBDcmVhdGUgYW4gYWN0aW9uIHdpdGggdGhlIHNwZWNpZmllZCBhY3Rpb24gYW5kIGZvcmNlZCB0YXJnZXQuXG4gKiAhI3poIOeUqOW3suacieWKqOS9nOWSjOS4gOS4quaWsOeahOebruagh+iKgueCueWIm+W7uuWKqOS9nOOAglxuICogQG1ldGhvZCB0YXJnZXRlZEFjdGlvblxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7RmluaXRlVGltZUFjdGlvbn0gYWN0aW9uXG4gKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cbiAqL1xuY2MudGFyZ2V0ZWRBY3Rpb24gPSBmdW5jdGlvbiAodGFyZ2V0LCBhY3Rpb24pIHtcbiAgICByZXR1cm4gbmV3IGNjLlRhcmdldGVkQWN0aW9uKHRhcmdldCwgYWN0aW9uKTtcbn07XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==