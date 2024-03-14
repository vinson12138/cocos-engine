
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/actions/tween.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _bezier = require("../animation/bezier");

var _tweenID = 0;
var TweenAction = cc.Class({
  name: 'cc.TweenAction',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, props, opts) {
    this._opts = opts = opts || Object.create(null);
    this._props = Object.create(null); // global easing or progress used for this action

    opts.progress = opts.progress || this.progress;

    if (opts.easing && typeof opts.easing === 'string') {
      var easingName = opts.easing;
      opts.easing = cc.easing[easingName];
      !opts.easing && cc.warnID(1031, easingName);
    }

    var relative = this._opts.relative;

    for (var name in props) {
      var value = props[name]; // property may have custom easing or progress function

      var easing = void 0,
          progress = void 0;

      if (value.value !== undefined && (value.easing || value.progress)) {
        if (typeof value.easing === 'string') {
          easing = cc.easing[value.easing];
          !easing && cc.warnID(1031, value.easing);
        } else {
          easing = value.easing;
        }

        progress = value.progress;
        value = value.value;
      }

      var isNumber = typeof value === 'number';

      if (!isNumber && (!value.lerp || relative && !value.add && !value.mul || !value.clone)) {
        cc.warn("Can not animate " + name + " property, because it do not have [lerp, (add|mul), clone] function.");
        continue;
      }

      var prop = Object.create(null);
      prop.value = value;
      prop.easing = easing;
      prop.progress = progress;
      this._props[name] = prop;
    }

    this._originProps = props;
    this.initWithDuration(duration);
  },
  clone: function clone() {
    var action = new TweenAction(this._duration, this._originProps, this._opts);

    this._cloneDecoration(action);

    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    var relative = !!this._opts.relative;
    var props = this._props;

    for (var name in props) {
      var value = target[name];
      var prop = props[name];

      if (typeof value === 'number') {
        prop.start = value;
        prop.current = value;
        prop.end = relative ? value + prop.value : prop.value;
      } else {
        prop.start = value.clone();
        prop.current = value.clone();
        prop.end = relative ? (value.add || value.mul).call(value, prop.value) : prop.value;
      }
    }
  },
  update: function update(t) {
    var opts = this._opts;
    var easingTime = t;
    if (opts.easing) easingTime = opts.easing(t);
    var target = this.target;
    if (!target) return;
    var props = this._props;
    var progress = opts.progress;

    for (var name in props) {
      var prop = props[name];
      var time = prop.easing ? prop.easing(t) : easingTime;
      var current = prop.current = (prop.progress || progress)(prop.start, prop.end, prop.current, time);
      target[name] = current;
    }

    var onUpdate = opts.onUpdate;

    if (onUpdate) {
      onUpdate(target, t);
    }
  },
  progress: function progress(start, end, current, t) {
    if (typeof start === 'number') {
      current = start + (end - start) * t;
    } else {
      start.lerp(end, t, current);
    }

    return current;
  }
});
var SetAction = cc.Class({
  name: 'cc.SetAction',
  "extends": cc.ActionInstant,
  ctor: function ctor(props) {
    this._props = {};
    props !== undefined && this.init(props);
  },
  init: function init(props) {
    for (var name in props) {
      this._props[name] = props[name];
    }

    return true;
  },
  update: function update() {
    var props = this._props;
    var target = this.target;

    for (var name in props) {
      target[name] = props[name];
    }
  },
  clone: function clone() {
    var action = new SetAction();
    action.init(this._props);
    return action;
  }
});
/**
 * !#en
 * Tween provide a simple and flexible way to create action. Tween's api is more flexible than `cc.Action`:
 *  - Support creating an action sequence in chained api.
 *  - Support animate any objects' any properties, not limited to node's properties. By contrast, `cc.Action` needs to create a new action class to support new node property.
 *  - Support working with `cc.Action`.
 *  - Support easing and progress function.
 * !#zh
 * Tween 提供了一个简单灵活的方法来创建 action。相对于 Cocos 传统的 `cc.Action`，`cc.Tween` 在创建动画上要灵活非常多：
 *  - 支持以链式结构的方式创建一个动画序列。
 *  - 支持对任意对象的任意属性进行缓动，不再局限于节点上的属性，而 `cc.Action` 添加一个属性的支持时还需要添加一个新的 action 类型。
 *  - 支持与 `cc.Action` 混用。
 *  - 支持设置 {{#crossLink "Easing"}}{{/crossLink}} 或者 progress 函数。
 * @class Tween
 * @example
 * cc.tween(node)
 *   .to(1, {scale: 2, position: cc.v3(100, 100, 100)})
 *   .call(() => { console.log('This is a callback'); })
 *   .by(1, {scale: 3, position: cc.v3(200, 200, 200)}, {easing: 'sineOutIn'})
 *   .start(cc.find('Canvas/cocos'));
 * @typescript Tween<T = any>
 */

function Tween(target) {
  this._actions = [];
  this._finalAction = null;
  this._target = target;
  this._tag = cc.Action.TAG_INVALID;
}
/**
 * @method constructor
 * @param {Object} [target]
 */

/**
 * !#en Stop all tweens
 * !#zh 停止所有缓动
 * @method stopAll
 * @static
 */


Tween.stopAll = function () {
  cc.director.getActionManager().removeAllActions();
};
/**
 * !#en Stop all tweens by tag
 * !#zh 停止所有指定标签的缓动
 * @method stopAllByTag
 * @static
 * @param {number} tag
 */


Tween.stopAllByTag = function (tag) {
  cc.director.getActionManager().removeActionByTag(tag);
};
/**
 * !#en Stop all tweens by target
 * !#zh 停止所有指定对象的缓动
 * @method stopAllByTarget
 * @static
 * @param {Object} target
 */


Tween.stopAllByTarget = function (target) {
  cc.director.getActionManager().removeAllActionsFromTarget(target);
};
/**
 * !#en
 * Insert an action or tween to this sequence
 * !#zh
 * 插入一个 action 或者 tween 到队列中
 * @method then 
 * @param {Action|Tween} other
 * @return {Tween}
 * @typescript then(other: Action|Tween<T>): Tween<T>
 */


Tween.prototype.then = function (other) {
  if (other instanceof cc.Action) {
    this._actions.push(other.clone());
  } else {
    this._actions.push(other._union());
  }

  return this;
};
/**
 * !#en
 * Set tween target
 * !#zh
 * 设置 tween 的 target
 * @method target
 * @param {Object} target
 * @return {Tween}
 * @typescript target(target: any): Tween<T>
 */


Tween.prototype.target = function (target) {
  this._target = target;
  return this;
};
/**
 * !#en
 * Start this tween
 * !#zh
 * 运行当前 tween
 * @method start
 * @return {Tween}
 * @typescript start(): Tween<T>
 */


Tween.prototype.start = function () {
  var target = this._target;

  if (!target) {
    cc.warn('Please set target to tween first');
    return this;
  }

  if (target instanceof cc.Object && !target.isValid) {
    return;
  }

  if (this._finalAction) {
    cc.director.getActionManager().removeAction(this._finalAction);
  }

  this._finalAction = this._union();

  if (target._id === undefined) {
    target._id = ++_tweenID;
  }

  this._finalAction.setTag(this._tag);

  cc.director.getActionManager().addAction(this._finalAction, target, false);
  return this;
};
/**
 * !#en
 * Stop this tween
 * !#zh
 * 停止当前 tween
 * @method stop
 * @return {Tween}
 * @typescript stop(): Tween<T>
 */


Tween.prototype.stop = function () {
  if (this._finalAction) {
    cc.director.getActionManager().removeAction(this._finalAction);
  }

  return this;
};
/**
 * !#en Sets tween tag
 * !#zh 设置缓动的标签
 * @method tag
 * @param {number} tag
 * @return {Tween}
 * @typescript tag(tag: number): Tween<T>
 */


Tween.prototype.tag = function (tag) {
  this._tag = tag;
  return this;
};
/**
 * !#en
 * Clone a tween
 * !#zh
 * 克隆当前 tween
 * @method clone
 * @param {Object} [target]
 * @return {Tween}
 * @typescript clone(target?: any): Tween<T>
 */


Tween.prototype.clone = function (target) {
  var action = this._union();

  return cc.tween(target).then(action.clone());
};
/**
 * !#en
 * Integrate all previous actions to an action.
 * !#zh
 * 将之前所有的 action 整合为一个 action。
 * @method union
 * @return {Tween}
 * @typescritp union(): Tween<T>
 */


Tween.prototype.union = function () {
  var action = this._union();

  this._actions.length = 0;

  this._actions.push(action);

  return this;
};

Tween.prototype._union = function () {
  var actions = this._actions;

  if (actions.length === 1) {
    actions = actions[0];
  } else {
    actions = cc.sequence(actions);
  }

  return actions;
};

Object.assign(Tween.prototype, {
  /**
   * !#en Sets target's position property according to the bezier curve.
   * !#zh 按照贝塞尔路径设置目标的 position 属性。
   * @method bezierTo
   * @param {number} duration
   * @param {cc.Vec2} c1
   * @param {cc.Vec2} c2
   * @param {cc.Vec2} to
   * @return {Tween}
   * @typescript bezierTo(duration: number, c1: Vec2, c2: Vec2, to: Vec2): Tween<T>
   */
  bezierTo: function bezierTo(duration, c1, c2, to, opts) {
    var c0x = c1.x,
        c0y = c1.y,
        c1x = c2.x,
        c1y = c2.y;
    opts = opts || Object.create(null);

    opts.progress = function (start, end, current, t) {
      current.x = (0, _bezier.bezier)(start.x, c0x, c1x, end.x, t);
      current.y = (0, _bezier.bezier)(start.y, c0y, c1y, end.y, t);
      return current;
    };

    return this.to(duration, {
      position: to
    }, opts);
  },

  /**
   * !#en Sets target's position property according to the bezier curve.
   * !#zh 按照贝塞尔路径设置目标的 position 属性。
   * @method bezierBy
   * @param {number} duration
   * @param {cc.Vec2} c1
   * @param {cc.Vec2} c2
   * @param {cc.Vec2} to
   * @return {Tween}
   * @typescript bezierBy(duration: number, c1: Vec2, c2: Vec2, to: Vec2): Tween<T>
   */
  bezierBy: function bezierBy(duration, c1, c2, to, opts) {
    var c0x = c1.x,
        c0y = c1.y,
        c1x = c2.x,
        c1y = c2.y;
    opts = opts || Object.create(null);

    opts.progress = function (start, end, current, t) {
      var sx = start.x,
          sy = start.y;
      current.x = (0, _bezier.bezier)(sx, c0x + sx, c1x + sx, end.x, t);
      current.y = (0, _bezier.bezier)(sy, c0y + sy, c1y + sy, end.y, t);
      return current;
    };

    return this.by(duration, {
      position: to
    }, opts);
  },

  /**
   * !#en Flips target's scaleX
   * !#zh 翻转目标的 scaleX 属性
   * @method flipX
   * @return {Tween}
   * @typescript flipX(): Tween<T>
   */
  flipX: function flipX() {
    var _this = this;

    return this.call(function () {
      _this._target.scaleX *= -1;
    }, this);
  },

  /**
   * !#en Flips target's scaleY
   * !#zh 翻转目标的 scaleY 属性
   * @method flipY
   * @return {Tween}
   * @typescript flipY(): Tween<T>
   */
  flipY: function flipY() {
    var _this2 = this;

    return this.call(function () {
      _this2._target.scaleY *= -1;
    }, this);
  },

  /**
   * !#en Blinks target by set target's opacity property
   * !#zh 通过设置目标的 opacity 属性达到闪烁效果
   * @method blink
   * @param {number} duration
   * @param {number} times
   * @param {Object} [opts]
   * @param {Function} [opts.progress]
   * @param {Function|String} [opts.easing]
   * @return {Tween}
   * @typescript blink(duration: number, times: number, opts?: {progress?: Function; easing?: Function|string; }): Tween<T>
   */
  blink: function blink(duration, times, opts) {
    var slice = 1.0 / times;
    opts = opts || Object.create(null);

    opts.progress = function (start, end, current, t) {
      if (t >= 1) {
        return start;
      } else {
        var m = t % slice;
        return m > slice / 2 ? 255 : 0;
      }
    };

    return this.to(duration, {
      opacity: 1
    }, opts);
  }
});
var tmp_args = [];

function wrapAction(action) {
  return function () {
    tmp_args.length = 0;

    for (var l = arguments.length, i = 0; i < l; i++) {
      var arg = tmp_args[i] = arguments[i];

      if (arg instanceof Tween) {
        tmp_args[i] = arg._union();
      }
    }

    return action.apply(this, tmp_args);
  };
}

var actions = {
  /**
   * !#en
   * Add an action which calculate with absolute value
   * !#zh
   * 添加一个对属性进行绝对值计算的 action
   * @method to
   * @param {Number} duration
   * @param {Object} props - {scale: 2, position: cc.v3(100, 100, 100)}
   * @param {Object} [opts]
   * @param {Function} [opts.progress]
   * @param {Function|String} [opts.easing]
   * @return {Tween}
   * @typescript
   * to<OPTS extends Partial<{ progress: Function, easing: Function | String, onUpdate: Function }>>(duration: number, props: ConstructorType<T>, opts?: OPTS): Tween<T>
   */
  to: function to(duration, props, opts) {
    opts = opts || Object.create(null);
    opts.relative = false;
    return new TweenAction(duration, props, opts);
  },

  /**
   * !#en
   * Add an action which calculate with relative value
   * !#zh
   * 添加一个对属性进行相对值计算的 action
   * @method by
   * @param {Number} duration
   * @param {Object} props - {scale: 2, position: cc.v3(100, 100, 100)}
   * @param {Object} [opts]
   * @param {Function} [opts.progress]
   * @param {Function|String} [opts.easing]
   * @return {Tween}
   * @typescript
   * by<OPTS extends Partial<{ progress: Function, easing: Function | String, onUpdate: Function }>>(duration: number, props: ConstructorType<T>, opts?: OPTS): Tween<T>
   */
  by: function by(duration, props, opts) {
    opts = opts || Object.create(null);
    opts.relative = true;
    return new TweenAction(duration, props, opts);
  },

  /**
   * !#en
   * Directly set target properties
   * !#zh
   * 直接设置 target 的属性
   * @method set
   * @param {Object} props
   * @return {Tween}
   * @typescript
   * set (props: ConstructorType<T>) : Tween<T>
   */
  set: function set(props) {
    return new SetAction(props);
  },

  /**
   * !#en
   * Add an delay action
   * !#zh
   * 添加一个延时 action
   * @method delay
   * @param {Number} duration
   * @return {Tween}
   * @typescript delay(duration: number): Tween<T>
   */
  delay: cc.delayTime,

  /**
   * !#en
   * Add an callback action
   * !#zh
   * 添加一个回调 action
   * @method call
   * @param {Function} callback
   * @param {object} [selectTarget]
   * @return {Tween}
   * @typescript call(callback: Function, selectTarget?: object): Tween<T>
   */
  call: cc.callFunc,

  /**
   * !#en
   * Add an hide action
   * !#zh
   * 添加一个隐藏 action
   * @method hide
   * @return {Tween}
   * @typescript hide(): Tween<T>
   */
  hide: cc.hide,

  /**
   * !#en
   * Add an show action
   * !#zh
   * 添加一个显示 action
   * @method show
   * @return {Tween}
   * @typescript show(): Tween<T>
   */
  show: cc.show,

  /**
   * !#en
   * Add an removeSelf action
   * !#zh
   * 添加一个移除自己 action
   * @method removeSelf
   * @return {Tween}
   * @typescript removeSelf(): Tween<T>
   */
  removeSelf: cc.removeSelf,

  /**
   * !#en
   * Add an sequence action
   * !#zh
   * 添加一个队列 action
   * @method sequence
   * @param {Action|Tween} action
   * @param {Action|Tween} ...actions
   * @return {Tween}
   * @typescript sequence(action: Action|Tween<T>, ...actions: (Action|Tween<T>)[]): Tween<T>
   */
  sequence: wrapAction(cc.sequence),

  /**
   * !#en
   * Add an parallel action
   * !#zh
   * 添加一个并行 action
   * @method parallel
   * @param {Action|Tween} action
   * @param {Action|Tween} ...actions
   * @return {Tween}
   * @typescript parallel(action: Action|Tween<T>, ...actions: (Action|Tween<T>)[]): Tween<T>
   */
  parallel: wrapAction(cc.spawn)
}; // these action will use previous action as their parameters

var previousAsInputActions = {
  /**
   * !#en
   * Add an repeat action. This action will integrate before actions to a sequence action as their parameters.
   * !#zh
   * 添加一个重复 action，这个 action 会将前一个动作作为他的参数。
   * @method repeat
   * @param {Number} repeatTimes
   * @param {Action | Tween} [action]
   * @return {Tween}
   * @typescript repeat(repeatTimes: number, action?: Action|Tween<T>): Tween<T>
   */
  repeat: cc.repeat,

  /**
   * !#en
   * Add an repeat forever action. This action will integrate before actions to a sequence action as their parameters.
   * !#zh
   * 添加一个永久重复 action，这个 action 会将前一个动作作为他的参数。
   * @method repeatForever
   * @param {Action | Tween} [action]
   * @return {Tween}
   * @typescript repeatForever(action?: Action|Tween<T>): Tween<T>
   */
  repeatForever: function repeatForever(action) {
    // TODO: fixed with cc.repeatForever
    return cc.repeat(action, 10e8);
  },

  /**
   * !#en
   * Add an reverse time action. This action will integrate before actions to a sequence action as their parameters.
   * !#zh
   * 添加一个倒置时间 action，这个 action 会将前一个动作作为他的参数。
   * @method reverseTime
   * @param {Action | Tween} [action]
   * @return {Tween}
   * @typescript reverseTime(action?: Action|Tween<T>): Tween<T>
   */
  reverseTime: cc.reverseTime
};
var keys = Object.keys(actions);

var _loop = function _loop(i) {
  var key = keys[i];

  Tween.prototype[key] = function () {
    var action = actions[key].apply(this, arguments);

    this._actions.push(action);

    return this;
  };
};

for (var i = 0; i < keys.length; i++) {
  _loop(i);
}

keys = Object.keys(previousAsInputActions);

var _loop2 = function _loop2(_i) {
  var key = keys[_i];

  Tween.prototype[key] = function () {
    var actions = this._actions;
    var action = arguments[arguments.length - 1];
    var length = arguments.length - 1;

    if (action instanceof cc.Tween) {
      action = action._union();
    } else if (!(action instanceof cc.Action)) {
      action = actions[actions.length - 1];
      actions.length -= 1;
      length += 1;
    }

    var args = [action];

    for (var _i2 = 0; _i2 < length; _i2++) {
      args.push(arguments[_i2]);
    }

    action = previousAsInputActions[key].apply(this, args);
    actions.push(action);
    return this;
  };
};

for (var _i = 0; _i < keys.length; _i++) {
  _loop2(_i);
}
/**
 * @module cc
 */

/**
 * @method tween
 * @param {Object} [target] - the target to animate
 * @return {Tween}
 * @typescript
 * tween<T> (target?: T) : Tween<T>
 */


cc.tween = function (target) {
  return new Tween(target);
};

cc.Tween = Tween;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9hY3Rpb25zL3R3ZWVuLmpzIl0sIm5hbWVzIjpbIl90d2VlbklEIiwiVHdlZW5BY3Rpb24iLCJjYyIsIkNsYXNzIiwibmFtZSIsIkFjdGlvbkludGVydmFsIiwiY3RvciIsImR1cmF0aW9uIiwicHJvcHMiLCJvcHRzIiwiX29wdHMiLCJPYmplY3QiLCJjcmVhdGUiLCJfcHJvcHMiLCJwcm9ncmVzcyIsImVhc2luZyIsImVhc2luZ05hbWUiLCJ3YXJuSUQiLCJyZWxhdGl2ZSIsInZhbHVlIiwidW5kZWZpbmVkIiwiaXNOdW1iZXIiLCJsZXJwIiwiYWRkIiwibXVsIiwiY2xvbmUiLCJ3YXJuIiwicHJvcCIsIl9vcmlnaW5Qcm9wcyIsImluaXRXaXRoRHVyYXRpb24iLCJhY3Rpb24iLCJfZHVyYXRpb24iLCJfY2xvbmVEZWNvcmF0aW9uIiwic3RhcnRXaXRoVGFyZ2V0IiwidGFyZ2V0IiwicHJvdG90eXBlIiwiY2FsbCIsInN0YXJ0IiwiY3VycmVudCIsImVuZCIsInVwZGF0ZSIsInQiLCJlYXNpbmdUaW1lIiwidGltZSIsIm9uVXBkYXRlIiwiU2V0QWN0aW9uIiwiQWN0aW9uSW5zdGFudCIsImluaXQiLCJUd2VlbiIsIl9hY3Rpb25zIiwiX2ZpbmFsQWN0aW9uIiwiX3RhcmdldCIsIl90YWciLCJBY3Rpb24iLCJUQUdfSU5WQUxJRCIsInN0b3BBbGwiLCJkaXJlY3RvciIsImdldEFjdGlvbk1hbmFnZXIiLCJyZW1vdmVBbGxBY3Rpb25zIiwic3RvcEFsbEJ5VGFnIiwidGFnIiwicmVtb3ZlQWN0aW9uQnlUYWciLCJzdG9wQWxsQnlUYXJnZXQiLCJyZW1vdmVBbGxBY3Rpb25zRnJvbVRhcmdldCIsInRoZW4iLCJvdGhlciIsInB1c2giLCJfdW5pb24iLCJpc1ZhbGlkIiwicmVtb3ZlQWN0aW9uIiwiX2lkIiwic2V0VGFnIiwiYWRkQWN0aW9uIiwic3RvcCIsInR3ZWVuIiwidW5pb24iLCJsZW5ndGgiLCJhY3Rpb25zIiwic2VxdWVuY2UiLCJhc3NpZ24iLCJiZXppZXJUbyIsImMxIiwiYzIiLCJ0byIsImMweCIsIngiLCJjMHkiLCJ5IiwiYzF4IiwiYzF5IiwicG9zaXRpb24iLCJiZXppZXJCeSIsInN4Iiwic3kiLCJieSIsImZsaXBYIiwic2NhbGVYIiwiZmxpcFkiLCJzY2FsZVkiLCJibGluayIsInRpbWVzIiwic2xpY2UiLCJtIiwib3BhY2l0eSIsInRtcF9hcmdzIiwid3JhcEFjdGlvbiIsImwiLCJhcmd1bWVudHMiLCJpIiwiYXJnIiwiYXBwbHkiLCJzZXQiLCJkZWxheSIsImRlbGF5VGltZSIsImNhbGxGdW5jIiwiaGlkZSIsInNob3ciLCJyZW1vdmVTZWxmIiwicGFyYWxsZWwiLCJzcGF3biIsInByZXZpb3VzQXNJbnB1dEFjdGlvbnMiLCJyZXBlYXQiLCJyZXBlYXRGb3JldmVyIiwicmV2ZXJzZVRpbWUiLCJrZXlzIiwia2V5IiwiYXJncyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBLElBQUlBLFFBQVEsR0FBRyxDQUFmO0FBRUEsSUFBSUMsV0FBVyxHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUN2QkMsRUFBQUEsSUFBSSxFQUFFLGdCQURpQjtBQUV2QixhQUFTRixFQUFFLENBQUNHLGNBRlc7QUFJdkJDLEVBQUFBLElBSnVCLGdCQUlqQkMsUUFKaUIsRUFJUEMsS0FKTyxFQUlBQyxJQUpBLEVBSU07QUFDekIsU0FBS0MsS0FBTCxHQUFhRCxJQUFJLEdBQUdBLElBQUksSUFBSUUsTUFBTSxDQUFDQyxNQUFQLENBQWMsSUFBZCxDQUE1QjtBQUNBLFNBQUtDLE1BQUwsR0FBY0YsTUFBTSxDQUFDQyxNQUFQLENBQWMsSUFBZCxDQUFkLENBRnlCLENBSXpCOztBQUNBSCxJQUFBQSxJQUFJLENBQUNLLFFBQUwsR0FBZ0JMLElBQUksQ0FBQ0ssUUFBTCxJQUFpQixLQUFLQSxRQUF0Qzs7QUFDQSxRQUFJTCxJQUFJLENBQUNNLE1BQUwsSUFBZSxPQUFPTixJQUFJLENBQUNNLE1BQVosS0FBdUIs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RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBMUcsRUFBRSxDQUFDd0UsS0FBSCxHQUFXLFVBQVV4QyxNQUFWLEVBQWtCO0FBQ3pCLFNBQU8sSUFBSWMsS0FBSixDQUFVZCxNQUFWLENBQVA7QUFDSCxDQUZEOztBQUlBaEMsRUFBRSxDQUFDOEMsS0FBSCxHQUFXQSxLQUFYIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYmV6aWVyIH0gZnJvbSAnLi4vYW5pbWF0aW9uL2Jlemllcic7XG5cbmxldCBfdHdlZW5JRCA9IDA7XG5cbmxldCBUd2VlbkFjdGlvbiA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuVHdlZW5BY3Rpb24nLFxuICAgIGV4dGVuZHM6IGNjLkFjdGlvbkludGVydmFsLFxuXG4gICAgY3RvciAoZHVyYXRpb24sIHByb3BzLCBvcHRzKSB7XG4gICAgICAgIHRoaXMuX29wdHMgPSBvcHRzID0gb3B0cyB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICB0aGlzLl9wcm9wcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICAgICAgLy8gZ2xvYmFsIGVhc2luZyBvciBwcm9ncmVzcyB1c2VkIGZvciB0aGlzIGFjdGlvblxuICAgICAgICBvcHRzLnByb2dyZXNzID0gb3B0cy5wcm9ncmVzcyB8fCB0aGlzLnByb2dyZXNzO1xuICAgICAgICBpZiAob3B0cy5lYXNpbmcgJiYgdHlwZW9mIG9wdHMuZWFzaW5nID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgbGV0IGVhc2luZ05hbWUgPSBvcHRzLmVhc2luZztcbiAgICAgICAgICAgIG9wdHMuZWFzaW5nID0gY2MuZWFzaW5nW2Vhc2luZ05hbWVdO1xuICAgICAgICAgICAgIW9wdHMuZWFzaW5nICYmIGNjLndhcm5JRCgxMDMxLCBlYXNpbmdOYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZWxhdGl2ZSA9IHRoaXMuX29wdHMucmVsYXRpdmU7XG5cbiAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBwcm9wcykge1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gcHJvcHNbbmFtZV07XG5cbiAgICAgICAgICAgIC8vIHByb3BlcnR5IG1heSBoYXZlIGN1c3RvbSBlYXNpbmcgb3IgcHJvZ3Jlc3MgZnVuY3Rpb25cbiAgICAgICAgICAgIGxldCBlYXNpbmcsIHByb2dyZXNzO1xuICAgICAgICAgICAgaWYgKHZhbHVlLnZhbHVlICE9PSB1bmRlZmluZWQgJiYgKHZhbHVlLmVhc2luZyB8fCB2YWx1ZS5wcm9ncmVzcykpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlLmVhc2luZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgZWFzaW5nID0gY2MuZWFzaW5nW3ZhbHVlLmVhc2luZ107XG4gICAgICAgICAgICAgICAgICAgICFlYXNpbmcgJiYgY2Mud2FybklEKDEwMzEsIHZhbHVlLmVhc2luZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlYXNpbmcgPSB2YWx1ZS5lYXNpbmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByb2dyZXNzID0gdmFsdWUucHJvZ3Jlc3M7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS52YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGlzTnVtYmVyID0gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJztcbiAgICAgICAgICAgIGlmICghaXNOdW1iZXIgJiYgKCF2YWx1ZS5sZXJwIHx8IChyZWxhdGl2ZSAmJiAhdmFsdWUuYWRkICYmICF2YWx1ZS5tdWwpIHx8ICF2YWx1ZS5jbG9uZSkpIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuKGBDYW4gbm90IGFuaW1hdGUgJHtuYW1lfSBwcm9wZXJ0eSwgYmVjYXVzZSBpdCBkbyBub3QgaGF2ZSBbbGVycCwgKGFkZHxtdWwpLCBjbG9uZV0gZnVuY3Rpb24uYCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBwcm9wID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgICAgIHByb3AudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHByb3AuZWFzaW5nID0gZWFzaW5nO1xuICAgICAgICAgICAgcHJvcC5wcm9ncmVzcyA9IHByb2dyZXNzO1xuICAgICAgICAgICAgdGhpcy5fcHJvcHNbbmFtZV0gPSBwcm9wO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fb3JpZ2luUHJvcHMgPSBwcm9wcztcbiAgICAgICAgdGhpcy5pbml0V2l0aER1cmF0aW9uKGR1cmF0aW9uKTtcbiAgICB9LFxuXG4gICAgY2xvbmUgKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IFR3ZWVuQWN0aW9uKHRoaXMuX2R1cmF0aW9uLCB0aGlzLl9vcmlnaW5Qcm9wcywgdGhpcy5fb3B0cyk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBzdGFydFdpdGhUYXJnZXQgKHRhcmdldCkge1xuICAgICAgICBjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcblxuICAgICAgICBsZXQgcmVsYXRpdmUgPSAhIXRoaXMuX29wdHMucmVsYXRpdmU7XG4gICAgICAgIGxldCBwcm9wcyA9IHRoaXMuX3Byb3BzO1xuICAgICAgICBmb3IgKGxldCBuYW1lIGluIHByb3BzKSB7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0YXJnZXRbbmFtZV07XG4gICAgICAgICAgICBsZXQgcHJvcCA9IHByb3BzW25hbWVdO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHByb3Auc3RhcnQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBwcm9wLmN1cnJlbnQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBwcm9wLmVuZCA9IHJlbGF0aXZlID8gdmFsdWUgKyBwcm9wLnZhbHVlIDogcHJvcC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHByb3Auc3RhcnQgPSB2YWx1ZS5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIHByb3AuY3VycmVudCA9IHZhbHVlLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgcHJvcC5lbmQgPSByZWxhdGl2ZSA/ICh2YWx1ZS5hZGQgfHwgdmFsdWUubXVsKS5jYWxsKHZhbHVlLCBwcm9wLnZhbHVlKSA6IHByb3AudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlICh0KSB7XG4gICAgICAgIGxldCBvcHRzID0gdGhpcy5fb3B0cztcbiAgICAgICAgbGV0IGVhc2luZ1RpbWUgPSB0O1xuICAgICAgICBpZiAob3B0cy5lYXNpbmcpIGVhc2luZ1RpbWUgPSBvcHRzLmVhc2luZyh0KTtcblxuICAgICAgICBsZXQgdGFyZ2V0ID0gdGhpcy50YXJnZXQ7XG4gICAgICAgIGlmICghdGFyZ2V0KSByZXR1cm47XG5cbiAgICAgICAgbGV0IHByb3BzID0gdGhpcy5fcHJvcHM7XG4gICAgICAgIGxldCBwcm9ncmVzcyA9IG9wdHMucHJvZ3Jlc3M7XG4gICAgICAgIGZvciAobGV0IG5hbWUgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgIGxldCBwcm9wID0gcHJvcHNbbmFtZV07XG4gICAgICAgICAgICBsZXQgdGltZSA9IHByb3AuZWFzaW5nID8gcHJvcC5lYXNpbmcodCkgOiBlYXNpbmdUaW1lO1xuICAgICAgICAgICAgbGV0IGN1cnJlbnQgPSBwcm9wLmN1cnJlbnQgPSAocHJvcC5wcm9ncmVzcyB8fCBwcm9ncmVzcykocHJvcC5zdGFydCwgcHJvcC5lbmQsIHByb3AuY3VycmVudCwgdGltZSk7XG4gICAgICAgICAgICB0YXJnZXRbbmFtZV0gPSBjdXJyZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG9uVXBkYXRlID0gb3B0cy5vblVwZGF0ZTtcbiAgICAgICAgaWYgKG9uVXBkYXRlKSB7XG4gICAgICAgICAgICBvblVwZGF0ZSh0YXJnZXQsIHQpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcHJvZ3Jlc3MgKHN0YXJ0LCBlbmQsIGN1cnJlbnQsIHQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzdGFydCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBzdGFydCArIChlbmQgLSBzdGFydCkgKiB0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3RhcnQubGVycChlbmQsIHQsIGN1cnJlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgIH1cbn0pO1xuXG5sZXQgU2V0QWN0aW9uID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5TZXRBY3Rpb24nLFxuICAgIGV4dGVuZHM6IGNjLkFjdGlvbkluc3RhbnQsXG5cbiAgICBjdG9yIChwcm9wcykge1xuICAgICAgICB0aGlzLl9wcm9wcyA9IHt9O1xuICAgICAgICBwcm9wcyAhPT0gdW5kZWZpbmVkICYmIHRoaXMuaW5pdChwcm9wcyk7XG4gICAgfSxcblxuICAgIGluaXQgKHByb3BzKSB7XG4gICAgICAgIGZvciAobGV0IG5hbWUgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb3BzW25hbWVdID0gcHJvcHNbbmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIHVwZGF0ZSAoKSB7XG4gICAgICAgIGxldCBwcm9wcyA9IHRoaXMuX3Byb3BzO1xuICAgICAgICBsZXQgdGFyZ2V0ID0gdGhpcy50YXJnZXQ7XG4gICAgICAgIGZvciAobGV0IG5hbWUgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgIHRhcmdldFtuYW1lXSA9IHByb3BzW25hbWVdO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNsb25lICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBTZXRBY3Rpb24oKTtcbiAgICAgICAgYWN0aW9uLmluaXQodGhpcy5fcHJvcHMpO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH1cbn0pO1xuXG5cblxuLyoqXG4gKiAhI2VuXG4gKiBUd2VlbiBwcm92aWRlIGEgc2ltcGxlIGFuZCBmbGV4aWJsZSB3YXkgdG8gY3JlYXRlIGFjdGlvbi4gVHdlZW4ncyBhcGkgaXMgbW9yZSBmbGV4aWJsZSB0aGFuIGBjYy5BY3Rpb25gOlxuICogIC0gU3VwcG9ydCBjcmVhdGluZyBhbiBhY3Rpb24gc2VxdWVuY2UgaW4gY2hhaW5lZCBhcGkuXG4gKiAgLSBTdXBwb3J0IGFuaW1hdGUgYW55IG9iamVjdHMnIGFueSBwcm9wZXJ0aWVzLCBub3QgbGltaXRlZCB0byBub2RlJ3MgcHJvcGVydGllcy4gQnkgY29udHJhc3QsIGBjYy5BY3Rpb25gIG5lZWRzIHRvIGNyZWF0ZSBhIG5ldyBhY3Rpb24gY2xhc3MgdG8gc3VwcG9ydCBuZXcgbm9kZSBwcm9wZXJ0eS5cbiAqICAtIFN1cHBvcnQgd29ya2luZyB3aXRoIGBjYy5BY3Rpb25gLlxuICogIC0gU3VwcG9ydCBlYXNpbmcgYW5kIHByb2dyZXNzIGZ1bmN0aW9uLlxuICogISN6aFxuICogVHdlZW4g5o+Q5L6b5LqG5LiA5Liq566A5Y2V54G15rS755qE5pa55rOV5p2l5Yib5bu6IGFjdGlvbuOAguebuOWvueS6jiBDb2NvcyDkvKDnu5/nmoQgYGNjLkFjdGlvbmDvvIxgY2MuVHdlZW5gIOWcqOWIm+W7uuWKqOeUu+S4iuimgeeBtea0u+mdnuW4uOWkmu+8mlxuICogIC0g5pSv5oyB5Lul6ZO+5byP57uT5p6E55qE5pa55byP5Yib5bu65LiA5Liq5Yqo55S75bqP5YiX44CCXG4gKiAgLSDmlK/mjIHlr7nku7vmhI/lr7nosaHnmoTku7vmhI/lsZ7mgKfov5vooYznvJPliqjvvIzkuI3lho3lsYDpmZDkuo7oioLngrnkuIrnmoTlsZ7mgKfvvIzogIwgYGNjLkFjdGlvbmAg5re75Yqg5LiA5Liq5bGe5oCn55qE5pSv5oyB5pe26L+Y6ZyA6KaB5re75Yqg5LiA5Liq5paw55qEIGFjdGlvbiDnsbvlnovjgIJcbiAqICAtIOaUr+aMgeS4jiBgY2MuQWN0aW9uYCDmt7fnlKjjgIJcbiAqICAtIOaUr+aMgeiuvue9riB7eyNjcm9zc0xpbmsgXCJFYXNpbmdcIn19e3svY3Jvc3NMaW5rfX0g5oiW6ICFIHByb2dyZXNzIOWHveaVsOOAglxuICogQGNsYXNzIFR3ZWVuXG4gKiBAZXhhbXBsZVxuICogY2MudHdlZW4obm9kZSlcbiAqICAgLnRvKDEsIHtzY2FsZTogMiwgcG9zaXRpb246IGNjLnYzKDEwMCwgMTAwLCAxMDApfSlcbiAqICAgLmNhbGwoKCkgPT4geyBjb25zb2xlLmxvZygnVGhpcyBpcyBhIGNhbGxiYWNrJyk7IH0pXG4gKiAgIC5ieSgxLCB7c2NhbGU6IDMsIHBvc2l0aW9uOiBjYy52MygyMDAsIDIwMCwgMjAwKX0sIHtlYXNpbmc6ICdzaW5lT3V0SW4nfSlcbiAqICAgLnN0YXJ0KGNjLmZpbmQoJ0NhbnZhcy9jb2NvcycpKTtcbiAqIEB0eXBlc2NyaXB0IFR3ZWVuPFQgPSBhbnk+XG4gKi9cbmZ1bmN0aW9uIFR3ZWVuICh0YXJnZXQpIHtcbiAgICB0aGlzLl9hY3Rpb25zID0gW107XG4gICAgdGhpcy5fZmluYWxBY3Rpb24gPSBudWxsO1xuICAgIHRoaXMuX3RhcmdldCA9IHRhcmdldDtcbiAgICB0aGlzLl90YWcgPSBjYy5BY3Rpb24uVEFHX0lOVkFMSUQ7XG59XG5cbi8qKlxuICogQG1ldGhvZCBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXRdXG4gKi9cblxuLyoqXG4gKiAhI2VuIFN0b3AgYWxsIHR3ZWVuc1xuICogISN6aCDlgZzmraLmiYDmnInnvJPliqhcbiAqIEBtZXRob2Qgc3RvcEFsbFxuICogQHN0YXRpY1xuICovXG5Ud2Vlbi5zdG9wQWxsID0gZnVuY3Rpb24gKCkge1xuICAgIGNjLmRpcmVjdG9yLmdldEFjdGlvbk1hbmFnZXIoKS5yZW1vdmVBbGxBY3Rpb25zKCk7XG59XG4vKipcbiAqICEjZW4gU3RvcCBhbGwgdHdlZW5zIGJ5IHRhZ1xuICogISN6aCDlgZzmraLmiYDmnInmjIflrprmoIfnrb7nmoTnvJPliqhcbiAqIEBtZXRob2Qgc3RvcEFsbEJ5VGFnXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0ge251bWJlcn0gdGFnXG4gKi9cblR3ZWVuLnN0b3BBbGxCeVRhZyA9IGZ1bmN0aW9uICh0YWcpIHtcbiAgICBjYy5kaXJlY3Rvci5nZXRBY3Rpb25NYW5hZ2VyKCkucmVtb3ZlQWN0aW9uQnlUYWcodGFnKTtcbn1cbi8qKlxuICogISNlbiBTdG9wIGFsbCB0d2VlbnMgYnkgdGFyZ2V0XG4gKiAhI3poIOWBnOatouaJgOacieaMh+WumuWvueixoeeahOe8k+WKqFxuICogQG1ldGhvZCBzdG9wQWxsQnlUYXJnZXRcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRcbiAqL1xuVHdlZW4uc3RvcEFsbEJ5VGFyZ2V0ID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIGNjLmRpcmVjdG9yLmdldEFjdGlvbk1hbmFnZXIoKS5yZW1vdmVBbGxBY3Rpb25zRnJvbVRhcmdldCh0YXJnZXQpO1xufVxuXG4vKipcbiAqICEjZW5cbiAqIEluc2VydCBhbiBhY3Rpb24gb3IgdHdlZW4gdG8gdGhpcyBzZXF1ZW5jZVxuICogISN6aFxuICog5o+S5YWl5LiA5LiqIGFjdGlvbiDmiJbogIUgdHdlZW4g5Yiw6Zif5YiX5LitXG4gKiBAbWV0aG9kIHRoZW4gXG4gKiBAcGFyYW0ge0FjdGlvbnxUd2Vlbn0gb3RoZXJcbiAqIEByZXR1cm4ge1R3ZWVufVxuICogQHR5cGVzY3JpcHQgdGhlbihvdGhlcjogQWN0aW9ufFR3ZWVuPFQ+KTogVHdlZW48VD5cbiAqL1xuVHdlZW4ucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbiAob3RoZXIpIHtcbiAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBjYy5BY3Rpb24pIHtcbiAgICAgICAgdGhpcy5fYWN0aW9ucy5wdXNoKG90aGVyLmNsb25lKCkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5fYWN0aW9ucy5wdXNoKG90aGVyLl91bmlvbigpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKlxuICogISNlblxuICogU2V0IHR3ZWVuIHRhcmdldFxuICogISN6aFxuICog6K6+572uIHR3ZWVuIOeahCB0YXJnZXRcbiAqIEBtZXRob2QgdGFyZ2V0XG4gKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0XG4gKiBAcmV0dXJuIHtUd2Vlbn1cbiAqIEB0eXBlc2NyaXB0IHRhcmdldCh0YXJnZXQ6IGFueSk6IFR3ZWVuPFQ+XG4gKi9cblR3ZWVuLnByb3RvdHlwZS50YXJnZXQgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgdGhpcy5fdGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiAhI2VuXG4gKiBTdGFydCB0aGlzIHR3ZWVuXG4gKiAhI3poXG4gKiDov5DooYzlvZPliY0gdHdlZW5cbiAqIEBtZXRob2Qgc3RhcnRcbiAqIEByZXR1cm4ge1R3ZWVufVxuICogQHR5cGVzY3JpcHQgc3RhcnQoKTogVHdlZW48VD5cbiAqL1xuVHdlZW4ucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCB0YXJnZXQgPSB0aGlzLl90YXJnZXQ7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgICAgY2Mud2FybignUGxlYXNlIHNldCB0YXJnZXQgdG8gdHdlZW4gZmlyc3QnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBjYy5PYmplY3QgJiYgIXRhcmdldC5pc1ZhbGlkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZmluYWxBY3Rpb24pIHtcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0QWN0aW9uTWFuYWdlcigpLnJlbW92ZUFjdGlvbih0aGlzLl9maW5hbEFjdGlvbik7XG4gICAgfVxuICAgIHRoaXMuX2ZpbmFsQWN0aW9uID0gdGhpcy5fdW5pb24oKTtcblxuICAgIGlmICh0YXJnZXQuX2lkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGFyZ2V0Ll9pZCA9ICsrX3R3ZWVuSUQ7XG4gICAgfVxuXG4gICAgdGhpcy5fZmluYWxBY3Rpb24uc2V0VGFnKHRoaXMuX3RhZyk7XG4gICAgY2MuZGlyZWN0b3IuZ2V0QWN0aW9uTWFuYWdlcigpLmFkZEFjdGlvbih0aGlzLl9maW5hbEFjdGlvbiwgdGFyZ2V0LCBmYWxzZSk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqICEjZW5cbiAqIFN0b3AgdGhpcyB0d2VlblxuICogISN6aFxuICog5YGc5q2i5b2T5YmNIHR3ZWVuXG4gKiBAbWV0aG9kIHN0b3BcbiAqIEByZXR1cm4ge1R3ZWVufVxuICogQHR5cGVzY3JpcHQgc3RvcCgpOiBUd2VlbjxUPlxuICovXG5Ud2Vlbi5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5fZmluYWxBY3Rpb24pIHtcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0QWN0aW9uTWFuYWdlcigpLnJlbW92ZUFjdGlvbih0aGlzLl9maW5hbEFjdGlvbik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqICEjZW4gU2V0cyB0d2VlbiB0YWdcbiAqICEjemgg6K6+572u57yT5Yqo55qE5qCH562+XG4gKiBAbWV0aG9kIHRhZ1xuICogQHBhcmFtIHtudW1iZXJ9IHRhZ1xuICogQHJldHVybiB7VHdlZW59XG4gKiBAdHlwZXNjcmlwdCB0YWcodGFnOiBudW1iZXIpOiBUd2VlbjxUPlxuICovXG5Ud2Vlbi5wcm90b3R5cGUudGFnID0gZnVuY3Rpb24gKHRhZykge1xuICAgIHRoaXMuX3RhZyA9IHRhZztcbiAgICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiAhI2VuXG4gKiBDbG9uZSBhIHR3ZWVuXG4gKiAhI3poXG4gKiDlhYvpmoblvZPliY0gdHdlZW5cbiAqIEBtZXRob2QgY2xvbmVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbdGFyZ2V0XVxuICogQHJldHVybiB7VHdlZW59XG4gKiBAdHlwZXNjcmlwdCBjbG9uZSh0YXJnZXQ/OiBhbnkpOiBUd2VlbjxUPlxuICovXG5Ud2Vlbi5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgbGV0IGFjdGlvbiA9IHRoaXMuX3VuaW9uKCk7XG4gICAgcmV0dXJuIGNjLnR3ZWVuKHRhcmdldCkudGhlbihhY3Rpb24uY2xvbmUoKSk7XG59O1xuXG4vKipcbiAqICEjZW5cbiAqIEludGVncmF0ZSBhbGwgcHJldmlvdXMgYWN0aW9ucyB0byBhbiBhY3Rpb24uXG4gKiAhI3poXG4gKiDlsIbkuYvliY3miYDmnInnmoQgYWN0aW9uIOaVtOWQiOS4uuS4gOS4qiBhY3Rpb27jgIJcbiAqIEBtZXRob2QgdW5pb25cbiAqIEByZXR1cm4ge1R3ZWVufVxuICogQHR5cGVzY3JpdHAgdW5pb24oKTogVHdlZW48VD5cbiAqL1xuVHdlZW4ucHJvdG90eXBlLnVuaW9uID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBhY3Rpb24gPSB0aGlzLl91bmlvbigpO1xuICAgIHRoaXMuX2FjdGlvbnMubGVuZ3RoID0gMDtcbiAgICB0aGlzLl9hY3Rpb25zLnB1c2goYWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cblR3ZWVuLnByb3RvdHlwZS5fdW5pb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGFjdGlvbnMgPSB0aGlzLl9hY3Rpb25zO1xuXG4gICAgaWYgKGFjdGlvbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGFjdGlvbnMgPSBhY3Rpb25zWzBdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgYWN0aW9ucyA9IGNjLnNlcXVlbmNlKGFjdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiBhY3Rpb25zO1xufTtcblxuT2JqZWN0LmFzc2lnbihUd2Vlbi5wcm90b3R5cGUsIHtcbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgdGFyZ2V0J3MgcG9zaXRpb24gcHJvcGVydHkgYWNjb3JkaW5nIHRvIHRoZSBiZXppZXIgY3VydmUuXG4gICAgICogISN6aCDmjInnhafotJ3loZ7lsJTot6/lvoTorr7nva7nm67moIfnmoQgcG9zaXRpb24g5bGe5oCn44CCXG4gICAgICogQG1ldGhvZCBiZXppZXJUb1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvblxuICAgICAqIEBwYXJhbSB7Y2MuVmVjMn0gYzFcbiAgICAgKiBAcGFyYW0ge2NjLlZlYzJ9IGMyXG4gICAgICogQHBhcmFtIHtjYy5WZWMyfSB0b1xuICAgICAqIEByZXR1cm4ge1R3ZWVufVxuICAgICAqIEB0eXBlc2NyaXB0IGJlemllclRvKGR1cmF0aW9uOiBudW1iZXIsIGMxOiBWZWMyLCBjMjogVmVjMiwgdG86IFZlYzIpOiBUd2VlbjxUPlxuICAgICAqL1xuICAgIGJlemllclRvIChkdXJhdGlvbiwgYzEsIGMyLCB0bywgb3B0cykge1xuICAgICAgICBsZXQgYzB4ID0gYzEueCwgYzB5ID0gYzEueSxcbiAgICAgICAgICAgIGMxeCA9IGMyLngsIGMxeSA9IGMyLnk7XG4gICAgICAgIG9wdHMgPSBvcHRzIHx8IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIG9wdHMucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCwgY3VycmVudCwgdCkge1xuICAgICAgICAgICAgY3VycmVudC54ID0gYmV6aWVyKHN0YXJ0LngsIGMweCwgYzF4LCBlbmQueCwgdCk7XG4gICAgICAgICAgICBjdXJyZW50LnkgPSBiZXppZXIoc3RhcnQueSwgYzB5LCBjMXksIGVuZC55LCB0KTtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnRvKGR1cmF0aW9uLCB7IHBvc2l0aW9uOiB0byB9LCBvcHRzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXRzIHRhcmdldCdzIHBvc2l0aW9uIHByb3BlcnR5IGFjY29yZGluZyB0byB0aGUgYmV6aWVyIGN1cnZlLlxuICAgICAqICEjemgg5oyJ54Wn6LSd5aGe5bCU6Lev5b6E6K6+572u55uu5qCH55qEIHBvc2l0aW9uIOWxnuaAp+OAglxuICAgICAqIEBtZXRob2QgYmV6aWVyQnlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZHVyYXRpb25cbiAgICAgKiBAcGFyYW0ge2NjLlZlYzJ9IGMxXG4gICAgICogQHBhcmFtIHtjYy5WZWMyfSBjMlxuICAgICAqIEBwYXJhbSB7Y2MuVmVjMn0gdG9cbiAgICAgKiBAcmV0dXJuIHtUd2Vlbn1cbiAgICAgKiBAdHlwZXNjcmlwdCBiZXppZXJCeShkdXJhdGlvbjogbnVtYmVyLCBjMTogVmVjMiwgYzI6IFZlYzIsIHRvOiBWZWMyKTogVHdlZW48VD5cbiAgICAgKi9cbiAgICBiZXppZXJCeSAoZHVyYXRpb24sIGMxLCBjMiwgdG8sIG9wdHMpIHtcbiAgICAgICAgbGV0IGMweCA9IGMxLngsIGMweSA9IGMxLnksXG4gICAgICAgICAgICBjMXggPSBjMi54LCBjMXkgPSBjMi55O1xuICAgICAgICBvcHRzID0gb3B0cyB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICBvcHRzLnByb2dyZXNzID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQsIGN1cnJlbnQsIHQpIHtcbiAgICAgICAgICAgIGxldCBzeCA9IHN0YXJ0LngsIHN5ID0gc3RhcnQueTtcbiAgICAgICAgICAgIGN1cnJlbnQueCA9IGJlemllcihzeCwgYzB4ICsgc3gsIGMxeCArIHN4LCBlbmQueCwgdCk7XG4gICAgICAgICAgICBjdXJyZW50LnkgPSBiZXppZXIoc3ksIGMweSArIHN5LCBjMXkgKyBzeSwgZW5kLnksIHQpO1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuYnkoZHVyYXRpb24sIHsgcG9zaXRpb246IHRvIH0sIG9wdHMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEZsaXBzIHRhcmdldCdzIHNjYWxlWFxuICAgICAqICEjemgg57+76L2s55uu5qCH55qEIHNjYWxlWCDlsZ7mgKdcbiAgICAgKiBAbWV0aG9kIGZsaXBYXG4gICAgICogQHJldHVybiB7VHdlZW59XG4gICAgICogQHR5cGVzY3JpcHQgZmxpcFgoKTogVHdlZW48VD5cbiAgICAgKi9cbiAgICBmbGlwWCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwoKCkgPT4geyB0aGlzLl90YXJnZXQuc2NhbGVYICo9IC0xOyB9LCB0aGlzKTtcbiAgICAgICAgXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiAhI2VuIEZsaXBzIHRhcmdldCdzIHNjYWxlWVxuICAgICAqICEjemgg57+76L2s55uu5qCH55qEIHNjYWxlWSDlsZ7mgKdcbiAgICAgKiBAbWV0aG9kIGZsaXBZXG4gICAgICogQHJldHVybiB7VHdlZW59XG4gICAgICogQHR5cGVzY3JpcHQgZmxpcFkoKTogVHdlZW48VD5cbiAgICAgKi9cbiAgICBmbGlwWSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwoKCkgPT4geyB0aGlzLl90YXJnZXQuc2NhbGVZICo9IC0xOyB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBCbGlua3MgdGFyZ2V0IGJ5IHNldCB0YXJnZXQncyBvcGFjaXR5IHByb3BlcnR5XG4gICAgICogISN6aCDpgJrov4forr7nva7nm67moIfnmoQgb3BhY2l0eSDlsZ7mgKfovr7liLDpl6rng4HmlYjmnpxcbiAgICAgKiBAbWV0aG9kIGJsaW5rXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRzXVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnByb2dyZXNzXVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258U3RyaW5nfSBbb3B0cy5lYXNpbmddXG4gICAgICogQHJldHVybiB7VHdlZW59XG4gICAgICogQHR5cGVzY3JpcHQgYmxpbmsoZHVyYXRpb246IG51bWJlciwgdGltZXM6IG51bWJlciwgb3B0cz86IHtwcm9ncmVzcz86IEZ1bmN0aW9uOyBlYXNpbmc/OiBGdW5jdGlvbnxzdHJpbmc7IH0pOiBUd2VlbjxUPlxuICAgICAqL1xuICAgIGJsaW5rIChkdXJhdGlvbiwgdGltZXMsIG9wdHMpIHtcbiAgICAgICAgdmFyIHNsaWNlID0gMS4wIC8gdGltZXM7XG4gICAgICAgIG9wdHMgPSBvcHRzIHx8IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIG9wdHMucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCwgY3VycmVudCwgdCkge1xuICAgICAgICAgICAgaWYgKHQgPj0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGFydDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBtID0gdCAlIHNsaWNlO1xuICAgICAgICAgICAgICAgIHJldHVybiAobSA+IChzbGljZSAvIDIpKSA/IDI1NSA6IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB0aGlzLnRvKGR1cmF0aW9uLCB7IG9wYWNpdHk6IDEgfSwgb3B0cyk7XG4gICAgfSxcbn0pXG5cbmxldCB0bXBfYXJncyA9IFtdO1xuXG5mdW5jdGlvbiB3cmFwQWN0aW9uIChhY3Rpb24pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB0bXBfYXJncy5sZW5ndGggPSAwO1xuICAgICAgICBmb3IgKGxldCBsID0gYXJndW1lbnRzLmxlbmd0aCwgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBhcmcgPSB0bXBfYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBUd2Vlbikge1xuICAgICAgICAgICAgICAgIHRtcF9hcmdzW2ldID0gYXJnLl91bmlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFjdGlvbi5hcHBseSh0aGlzLCB0bXBfYXJncyk7XG4gICAgfTtcbn1cblxubGV0IGFjdGlvbnMgPSB7XG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEFkZCBhbiBhY3Rpb24gd2hpY2ggY2FsY3VsYXRlIHdpdGggYWJzb2x1dGUgdmFsdWVcbiAgICAgKiAhI3poXG4gICAgICog5re75Yqg5LiA5Liq5a+55bGe5oCn6L+b6KGM57ud5a+55YC86K6h566X55qEIGFjdGlvblxuICAgICAqIEBtZXRob2QgdG9cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb25cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgLSB7c2NhbGU6IDIsIHBvc2l0aW9uOiBjYy52MygxMDAsIDEwMCwgMTAwKX1cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdHNdXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMucHJvZ3Jlc3NdXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxTdHJpbmd9IFtvcHRzLmVhc2luZ11cbiAgICAgKiBAcmV0dXJuIHtUd2Vlbn1cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHRvPE9QVFMgZXh0ZW5kcyBQYXJ0aWFsPHsgcHJvZ3Jlc3M6IEZ1bmN0aW9uLCBlYXNpbmc6IEZ1bmN0aW9uIHwgU3RyaW5nLCBvblVwZGF0ZTogRnVuY3Rpb24gfT4+KGR1cmF0aW9uOiBudW1iZXIsIHByb3BzOiBDb25zdHJ1Y3RvclR5cGU8VD4sIG9wdHM/OiBPUFRTKTogVHdlZW48VD5cbiAgICAgKi9cbiAgICB0byAoZHVyYXRpb24sIHByb3BzLCBvcHRzKSB7XG4gICAgICAgIG9wdHMgPSBvcHRzIHx8IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIG9wdHMucmVsYXRpdmUgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIG5ldyBUd2VlbkFjdGlvbihkdXJhdGlvbiwgcHJvcHMsIG9wdHMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQWRkIGFuIGFjdGlvbiB3aGljaCBjYWxjdWxhdGUgd2l0aCByZWxhdGl2ZSB2YWx1ZVxuICAgICAqICEjemhcbiAgICAgKiDmt7vliqDkuIDkuKrlr7nlsZ7mgKfov5vooYznm7jlr7nlgLzorqHnrpfnmoQgYWN0aW9uXG4gICAgICogQG1ldGhvZCBieVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvblxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyAtIHtzY2FsZTogMiwgcG9zaXRpb246IGNjLnYzKDEwMCwgMTAwLCAxMDApfVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0c11cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5wcm9ncmVzc11cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufFN0cmluZ30gW29wdHMuZWFzaW5nXVxuICAgICAqIEByZXR1cm4ge1R3ZWVufVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogYnk8T1BUUyBleHRlbmRzIFBhcnRpYWw8eyBwcm9ncmVzczogRnVuY3Rpb24sIGVhc2luZzogRnVuY3Rpb24gfCBTdHJpbmcsIG9uVXBkYXRlOiBGdW5jdGlvbiB9Pj4oZHVyYXRpb246IG51bWJlciwgcHJvcHM6IENvbnN0cnVjdG9yVHlwZTxUPiwgb3B0cz86IE9QVFMpOiBUd2VlbjxUPlxuICAgICAqL1xuICAgIGJ5IChkdXJhdGlvbiwgcHJvcHMsIG9wdHMpIHtcbiAgICAgICAgb3B0cyA9IG9wdHMgfHwgT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgb3B0cy5yZWxhdGl2ZSA9IHRydWU7XG4gICAgICAgIHJldHVybiBuZXcgVHdlZW5BY3Rpb24oZHVyYXRpb24sIHByb3BzLCBvcHRzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIERpcmVjdGx5IHNldCB0YXJnZXQgcHJvcGVydGllc1xuICAgICAqICEjemhcbiAgICAgKiDnm7TmjqXorr7nva4gdGFyZ2V0IOeahOWxnuaAp1xuICAgICAqIEBtZXRob2Qgc2V0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IHByb3BzXG4gICAgICogQHJldHVybiB7VHdlZW59XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzZXQgKHByb3BzOiBDb25zdHJ1Y3RvclR5cGU8VD4pIDogVHdlZW48VD5cbiAgICAgKi9cbiAgICBzZXQgKHByb3BzKSB7XG4gICAgICAgIHJldHVybiBuZXcgU2V0QWN0aW9uKHByb3BzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEFkZCBhbiBkZWxheSBhY3Rpb25cbiAgICAgKiAhI3poXG4gICAgICog5re75Yqg5LiA5Liq5bu25pe2IGFjdGlvblxuICAgICAqIEBtZXRob2QgZGVsYXlcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb25cbiAgICAgKiBAcmV0dXJuIHtUd2Vlbn1cbiAgICAgKiBAdHlwZXNjcmlwdCBkZWxheShkdXJhdGlvbjogbnVtYmVyKTogVHdlZW48VD5cbiAgICAgKi9cbiAgICBkZWxheTogY2MuZGVsYXlUaW1lLFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBZGQgYW4gY2FsbGJhY2sgYWN0aW9uXG4gICAgICogISN6aFxuICAgICAqIOa3u+WKoOS4gOS4quWbnuiwgyBhY3Rpb25cbiAgICAgKiBAbWV0aG9kIGNhbGxcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbc2VsZWN0VGFyZ2V0XVxuICAgICAqIEByZXR1cm4ge1R3ZWVufVxuICAgICAqIEB0eXBlc2NyaXB0IGNhbGwoY2FsbGJhY2s6IEZ1bmN0aW9uLCBzZWxlY3RUYXJnZXQ/OiBvYmplY3QpOiBUd2VlbjxUPlxuICAgICAqL1xuICAgIGNhbGw6IGNjLmNhbGxGdW5jLFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBZGQgYW4gaGlkZSBhY3Rpb25cbiAgICAgKiAhI3poXG4gICAgICog5re75Yqg5LiA5Liq6ZqQ6JePIGFjdGlvblxuICAgICAqIEBtZXRob2QgaGlkZVxuICAgICAqIEByZXR1cm4ge1R3ZWVufVxuICAgICAqIEB0eXBlc2NyaXB0IGhpZGUoKTogVHdlZW48VD5cbiAgICAgKi9cbiAgICBoaWRlOiBjYy5oaWRlLFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBZGQgYW4gc2hvdyBhY3Rpb25cbiAgICAgKiAhI3poXG4gICAgICog5re75Yqg5LiA5Liq5pi+56S6IGFjdGlvblxuICAgICAqIEBtZXRob2Qgc2hvd1xuICAgICAqIEByZXR1cm4ge1R3ZWVufVxuICAgICAqIEB0eXBlc2NyaXB0IHNob3coKTogVHdlZW48VD5cbiAgICAgKi9cbiAgICBzaG93OiBjYy5zaG93LFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBZGQgYW4gcmVtb3ZlU2VsZiBhY3Rpb25cbiAgICAgKiAhI3poXG4gICAgICog5re75Yqg5LiA5Liq56e76Zmk6Ieq5bexIGFjdGlvblxuICAgICAqIEBtZXRob2QgcmVtb3ZlU2VsZlxuICAgICAqIEByZXR1cm4ge1R3ZWVufVxuICAgICAqIEB0eXBlc2NyaXB0IHJlbW92ZVNlbGYoKTogVHdlZW48VD5cbiAgICAgKi9cbiAgICByZW1vdmVTZWxmOiBjYy5yZW1vdmVTZWxmLFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBZGQgYW4gc2VxdWVuY2UgYWN0aW9uXG4gICAgICogISN6aFxuICAgICAqIOa3u+WKoOS4gOS4qumYn+WIlyBhY3Rpb25cbiAgICAgKiBAbWV0aG9kIHNlcXVlbmNlXG4gICAgICogQHBhcmFtIHtBY3Rpb258VHdlZW59IGFjdGlvblxuICAgICAqIEBwYXJhbSB7QWN0aW9ufFR3ZWVufSAuLi5hY3Rpb25zXG4gICAgICogQHJldHVybiB7VHdlZW59XG4gICAgICogQHR5cGVzY3JpcHQgc2VxdWVuY2UoYWN0aW9uOiBBY3Rpb258VHdlZW48VD4sIC4uLmFjdGlvbnM6IChBY3Rpb258VHdlZW48VD4pW10pOiBUd2VlbjxUPlxuICAgICAqL1xuICAgIHNlcXVlbmNlOiB3cmFwQWN0aW9uKGNjLnNlcXVlbmNlKSxcbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQWRkIGFuIHBhcmFsbGVsIGFjdGlvblxuICAgICAqICEjemhcbiAgICAgKiDmt7vliqDkuIDkuKrlubbooYwgYWN0aW9uXG4gICAgICogQG1ldGhvZCBwYXJhbGxlbFxuICAgICAqIEBwYXJhbSB7QWN0aW9ufFR3ZWVufSBhY3Rpb25cbiAgICAgKiBAcGFyYW0ge0FjdGlvbnxUd2Vlbn0gLi4uYWN0aW9uc1xuICAgICAqIEByZXR1cm4ge1R3ZWVufVxuICAgICAqIEB0eXBlc2NyaXB0IHBhcmFsbGVsKGFjdGlvbjogQWN0aW9ufFR3ZWVuPFQ+LCAuLi5hY3Rpb25zOiAoQWN0aW9ufFR3ZWVuPFQ+KVtdKTogVHdlZW48VD5cbiAgICAgKi9cbiAgICBwYXJhbGxlbDogd3JhcEFjdGlvbihjYy5zcGF3bilcbn07XG5cbi8vIHRoZXNlIGFjdGlvbiB3aWxsIHVzZSBwcmV2aW91cyBhY3Rpb24gYXMgdGhlaXIgcGFyYW1ldGVyc1xubGV0IHByZXZpb3VzQXNJbnB1dEFjdGlvbnMgPSB7XG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEFkZCBhbiByZXBlYXQgYWN0aW9uLiBUaGlzIGFjdGlvbiB3aWxsIGludGVncmF0ZSBiZWZvcmUgYWN0aW9ucyB0byBhIHNlcXVlbmNlIGFjdGlvbiBhcyB0aGVpciBwYXJhbWV0ZXJzLlxuICAgICAqICEjemhcbiAgICAgKiDmt7vliqDkuIDkuKrph43lpI0gYWN0aW9u77yM6L+Z5LiqIGFjdGlvbiDkvJrlsIbliY3kuIDkuKrliqjkvZzkvZzkuLrku5bnmoTlj4LmlbDjgIJcbiAgICAgKiBAbWV0aG9kIHJlcGVhdFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByZXBlYXRUaW1lc1xuICAgICAqIEBwYXJhbSB7QWN0aW9uIHwgVHdlZW59IFthY3Rpb25dXG4gICAgICogQHJldHVybiB7VHdlZW59XG4gICAgICogQHR5cGVzY3JpcHQgcmVwZWF0KHJlcGVhdFRpbWVzOiBudW1iZXIsIGFjdGlvbj86IEFjdGlvbnxUd2VlbjxUPik6IFR3ZWVuPFQ+XG4gICAgICovXG4gICAgcmVwZWF0OiBjYy5yZXBlYXQsXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEFkZCBhbiByZXBlYXQgZm9yZXZlciBhY3Rpb24uIFRoaXMgYWN0aW9uIHdpbGwgaW50ZWdyYXRlIGJlZm9yZSBhY3Rpb25zIHRvIGEgc2VxdWVuY2UgYWN0aW9uIGFzIHRoZWlyIHBhcmFtZXRlcnMuXG4gICAgICogISN6aFxuICAgICAqIOa3u+WKoOS4gOS4quawuOS5hemHjeWkjSBhY3Rpb27vvIzov5nkuKogYWN0aW9uIOS8muWwhuWJjeS4gOS4quWKqOS9nOS9nOS4uuS7lueahOWPguaVsOOAglxuICAgICAqIEBtZXRob2QgcmVwZWF0Rm9yZXZlclxuICAgICAqIEBwYXJhbSB7QWN0aW9uIHwgVHdlZW59IFthY3Rpb25dXG4gICAgICogQHJldHVybiB7VHdlZW59XG4gICAgICogQHR5cGVzY3JpcHQgcmVwZWF0Rm9yZXZlcihhY3Rpb24/OiBBY3Rpb258VHdlZW48VD4pOiBUd2VlbjxUPlxuICAgICAqL1xuICAgIHJlcGVhdEZvcmV2ZXI6IGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgLy8gVE9ETzogZml4ZWQgd2l0aCBjYy5yZXBlYXRGb3JldmVyXG4gICAgICAgIHJldHVybiBjYy5yZXBlYXQoYWN0aW9uLCAxMGU4KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBZGQgYW4gcmV2ZXJzZSB0aW1lIGFjdGlvbi4gVGhpcyBhY3Rpb24gd2lsbCBpbnRlZ3JhdGUgYmVmb3JlIGFjdGlvbnMgdG8gYSBzZXF1ZW5jZSBhY3Rpb24gYXMgdGhlaXIgcGFyYW1ldGVycy5cbiAgICAgKiAhI3poXG4gICAgICog5re75Yqg5LiA5Liq5YCS572u5pe26Ze0IGFjdGlvbu+8jOi/meS4qiBhY3Rpb24g5Lya5bCG5YmN5LiA5Liq5Yqo5L2c5L2c5Li65LuW55qE5Y+C5pWw44CCXG4gICAgICogQG1ldGhvZCByZXZlcnNlVGltZVxuICAgICAqIEBwYXJhbSB7QWN0aW9uIHwgVHdlZW59IFthY3Rpb25dXG4gICAgICogQHJldHVybiB7VHdlZW59XG4gICAgICogQHR5cGVzY3JpcHQgcmV2ZXJzZVRpbWUoYWN0aW9uPzogQWN0aW9ufFR3ZWVuPFQ+KTogVHdlZW48VD5cbiAgICAgKi9cbiAgICByZXZlcnNlVGltZTogY2MucmV2ZXJzZVRpbWUsXG59O1xuXG5cbmxldCBrZXlzID0gT2JqZWN0LmtleXMoYWN0aW9ucyk7XG5mb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQga2V5ID0ga2V5c1tpXTtcbiAgICBUd2Vlbi5wcm90b3R5cGVba2V5XSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IGFjdGlvbiA9IGFjdGlvbnNba2V5XS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB0aGlzLl9hY3Rpb25zLnB1c2goYWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbn1cblxua2V5cyA9IE9iamVjdC5rZXlzKHByZXZpb3VzQXNJbnB1dEFjdGlvbnMpO1xuZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGtleSA9IGtleXNbaV07XG4gICAgVHdlZW4ucHJvdG90eXBlW2tleV0gPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgbGV0IGFjdGlvbnMgPSB0aGlzLl9hY3Rpb25zO1xuICAgICAgICBsZXQgYWN0aW9uID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXTtcbiAgICAgICAgbGV0IGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGggLSAxO1xuXG4gICAgICAgIGlmIChhY3Rpb24gaW5zdGFuY2VvZiBjYy5Ud2Vlbikge1xuICAgICAgICAgICAgYWN0aW9uID0gYWN0aW9uLl91bmlvbigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCEoYWN0aW9uIGluc3RhbmNlb2YgY2MuQWN0aW9uKSkge1xuICAgICAgICAgICAgYWN0aW9uID0gYWN0aW9uc1thY3Rpb25zLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgYWN0aW9ucy5sZW5ndGggLT0gMTtcbiAgICAgICAgICAgIGxlbmd0aCArPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGFyZ3MgPSBbYWN0aW9uXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICBhY3Rpb24gPSBwcmV2aW91c0FzSW5wdXRBY3Rpb25zW2tleV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIGFjdGlvbnMucHVzaChhY3Rpb24pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG59XG5cbi8qKlxuICogQG1vZHVsZSBjY1xuICovXG5cbi8qKlxuICogQG1ldGhvZCB0d2VlblxuICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXRdIC0gdGhlIHRhcmdldCB0byBhbmltYXRlXG4gKiBAcmV0dXJuIHtUd2Vlbn1cbiAqIEB0eXBlc2NyaXB0XG4gKiB0d2VlbjxUPiAodGFyZ2V0PzogVCkgOiBUd2VlbjxUPlxuICovXG5jYy50d2VlbiA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICByZXR1cm4gbmV3IFR3ZWVuKHRhcmdldCk7XG59O1xuXG5jYy5Ud2VlbiA9IFR3ZWVuO1xuICBcbiJdLCJzb3VyY2VSb290IjoiLyJ9