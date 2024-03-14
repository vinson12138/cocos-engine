
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/component-scheduler.js';
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
require('./platform/CCClass');

var Flags = require('./platform/CCObject').Flags;

var jsArray = require('./platform/js').array;

var IsStartCalled = Flags.IsStartCalled;
var IsOnEnableCalled = Flags.IsOnEnableCalled;
var IsEditorOnEnableCalled = Flags.IsEditorOnEnableCalled;

var callerFunctor = CC_EDITOR && require('./utils/misc').tryCatchFunctor_EDITOR;

var callOnEnableInTryCatch = CC_EDITOR && callerFunctor('onEnable');
var callOnDisableInTryCatch = CC_EDITOR && callerFunctor('onDisable');

function sortedIndex(array, comp) {
  var order = comp.constructor._executionOrder;
  var id = comp._id;

  for (var l = 0, h = array.length - 1, m = h >>> 1; l <= h; m = l + h >>> 1) {
    var test = array[m];
    var testOrder = test.constructor._executionOrder;

    if (testOrder > order) {
      h = m - 1;
    } else if (testOrder < order) {
      l = m + 1;
    } else {
      var testId = test._id;

      if (testId > id) {
        h = m - 1;
      } else if (testId < id) {
        l = m + 1;
      } else {
        return m;
      }
    }
  }

  return ~l;
} // remove disabled and not invoked component from array


function stableRemoveInactive(iterator, flagToClear) {
  var array = iterator.array;
  var next = iterator.i + 1;

  while (next < array.length) {
    var comp = array[next];

    if (comp._enabled && comp.node._activeInHierarchy) {
      ++next;
    } else {
      iterator.removeAt(next);

      if (flagToClear) {
        comp._objFlags &= ~flagToClear;
      }
    }
  }
} // This class contains some queues used to invoke life-cycle methods by script execution order


var LifeCycleInvoker = cc.Class({
  __ctor__: function __ctor__(invokeFunc) {
    var Iterator = jsArray.MutableForwardIterator; // components which priority === 0 (default)

    this._zero = new Iterator([]); // components which priority < 0

    this._neg = new Iterator([]); // components which priority > 0

    this._pos = new Iterator([]);

    if (CC_TEST) {
      cc.assert(typeof invokeFunc === 'function', 'invokeFunc must be type function');
    }

    this._invoke = invokeFunc;
  },
  statics: {
    stableRemoveInactive: stableRemoveInactive
  },
  add: null,
  remove: null,
  invoke: null
});

function compareOrder(a, b) {
  return a.constructor._executionOrder - b.constructor._executionOrder;
} // for onLoad: sort once all components registered, invoke once


var OneOffInvoker = cc.Class({
  "extends": LifeCycleInvoker,
  add: function add(comp) {
    var order = comp.constructor._executionOrder;
    (order === 0 ? this._zero : order < 0 ? this._neg : this._pos).array.push(comp);
  },
  remove: function remove(comp) {
    var order = comp.constructor._executionOrder;
    (order === 0 ? this._zero : order < 0 ? this._neg : this._pos).fastRemove(comp);
  },
  cancelInactive: function cancelInactive(flagToClear) {
    stableRemoveInactive(this._zero, flagToClear);
    stableRemoveInactive(this._neg, flagToClear);
    stableRemoveInactive(this._pos, flagToClear);
  },
  invoke: function invoke() {
    var compsNeg = this._neg;

    if (compsNeg.array.length > 0) {
      compsNeg.array.sort(compareOrder);

      this._invoke(compsNeg);

      compsNeg.array.length = 0;
    }

    this._invoke(this._zero);

    this._zero.array.length = 0;
    var compsPos = this._pos;

    if (compsPos.array.length > 0) {
      compsPos.array.sort(compareOrder);

      this._invoke(compsPos);

      compsPos.array.length = 0;
    }
  }
}); // for update: sort every time new component registered, invoke many times

var ReusableInvoker = cc.Class({
  "extends": LifeCycleInvoker,
  add: function add(comp) {
    var order = comp.constructor._executionOrder;

    if (order === 0) {
      this._zero.array.push(comp);
    } else {
      var array = order < 0 ? this._neg.array : this._pos.array;
      var i = sortedIndex(array, comp);

      if (i < 0) {
        array.splice(~i, 0, comp);
      } else if (CC_DEV) {
        cc.error('component already added');
      }
    }
  },
  remove: function remove(comp) {
    var order = comp.constructor._executionOrder;

    if (order === 0) {
      this._zero.fastRemove(comp);
    } else {
      var iterator = order < 0 ? this._neg : this._pos;
      var i = sortedIndex(iterator.array, comp);

      if (i >= 0) {
        iterator.removeAt(i);
      }
    }
  },
  invoke: function invoke(dt) {
    if (this._neg.array.length > 0) {
      this._invoke(this._neg, dt);
    }

    this._invoke(this._zero, dt);

    if (this._pos.array.length > 0) {
      this._invoke(this._pos, dt);
    }
  }
});

function enableInEditor(comp) {
  if (!(comp._objFlags & IsEditorOnEnableCalled)) {
    cc.engine.emit('component-enabled', comp.uuid);
    comp._objFlags |= IsEditorOnEnableCalled;
  }
} // return function to simply call each component with try catch protection


function createInvokeImpl(indiePath, useDt, ensureFlag, fastPath) {
  if (CC_SUPPORT_JIT) {
    // function (it) {
    //     var a = it.array;
    //     for (it.i = 0; it.i < a.length; ++it.i) {
    //         var c = a[it.i];
    //         // ...
    //     }
    // }
    var body = 'var a=it.array;' + 'for(it.i=0;it.i<a.length;++it.i){' + 'var c=a[it.i];' + indiePath + '}';
    fastPath = useDt ? Function('it', 'dt', body) : Function('it', body);
    indiePath = Function('c', 'dt', indiePath);
  }

  return function (iterator, dt) {
    try {
      fastPath(iterator, dt);
    } catch (e) {
      // slow path
      cc._throw(e);

      var array = iterator.array;

      if (ensureFlag) {
        array[iterator.i]._objFlags |= ensureFlag;
      }

      ++iterator.i; // invoke next callback

      for (; iterator.i < array.length; ++iterator.i) {
        try {
          indiePath(array[iterator.i], dt);
        } catch (e) {
          cc._throw(e);

          if (ensureFlag) {
            array[iterator.i]._objFlags |= ensureFlag;
          }
        }
      }
    }
  };
}

var invokeStart = CC_SUPPORT_JIT ? createInvokeImpl('c.start();c._objFlags|=' + IsStartCalled, false, IsStartCalled) : createInvokeImpl(function (c) {
  c.start();
  c._objFlags |= IsStartCalled;
}, false, IsStartCalled, function (iterator) {
  var array = iterator.array;

  for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
    var comp = array[iterator.i];
    comp.start();
    comp._objFlags |= IsStartCalled;
  }
});
var invokeUpdate = CC_SUPPORT_JIT ? createInvokeImpl('c.update(dt)', true) : createInvokeImpl(function (c, dt) {
  c.update(dt);
}, true, undefined, function (iterator, dt) {
  var array = iterator.array;

  for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
    array[iterator.i].update(dt);
  }
});
var invokeLateUpdate = CC_SUPPORT_JIT ? createInvokeImpl('c.lateUpdate(dt)', true) : createInvokeImpl(function (c, dt) {
  c.lateUpdate(dt);
}, true, undefined, function (iterator, dt) {
  var array = iterator.array;

  for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
    array[iterator.i].lateUpdate(dt);
  }
});
/**
 * The Manager for Component's life-cycle methods.
 */

function ctor() {
  // invokers
  this.startInvoker = new OneOffInvoker(invokeStart);
  this.updateInvoker = new ReusableInvoker(invokeUpdate);
  this.lateUpdateInvoker = new ReusableInvoker(invokeLateUpdate); // components deferred to next frame

  this._deferredComps = []; // during a loop

  this._updating = false;
}

var ComponentScheduler = cc.Class({
  ctor: ctor,
  unscheduleAll: ctor,
  statics: {
    LifeCycleInvoker: LifeCycleInvoker,
    OneOffInvoker: OneOffInvoker,
    createInvokeImpl: createInvokeImpl,
    invokeOnEnable: CC_EDITOR ? function (iterator) {
      var compScheduler = cc.director._compScheduler;
      var array = iterator.array;

      for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
        var comp = array[iterator.i];

        if (comp._enabled) {
          callOnEnableInTryCatch(comp);
          var deactivatedDuringOnEnable = !comp.node._activeInHierarchy;

          if (!deactivatedDuringOnEnable) {
            compScheduler._onEnabled(comp);
          }
        }
      }
    } : function (iterator) {
      var compScheduler = cc.director._compScheduler;
      var array = iterator.array;

      for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
        var comp = array[iterator.i];

        if (comp._enabled) {
          comp.onEnable();
          var deactivatedDuringOnEnable = !comp.node._activeInHierarchy;

          if (!deactivatedDuringOnEnable) {
            compScheduler._onEnabled(comp);
          }
        }
      }
    }
  },
  _onEnabled: function _onEnabled(comp) {
    cc.director.getScheduler().resumeTarget(comp);
    comp._objFlags |= IsOnEnableCalled; // schedule

    if (this._updating) {
      this._deferredComps.push(comp);
    } else {
      this._scheduleImmediate(comp);
    }
  },
  _onDisabled: function _onDisabled(comp) {
    cc.director.getScheduler().pauseTarget(comp);
    comp._objFlags &= ~IsOnEnableCalled; // cancel schedule task

    var index = this._deferredComps.indexOf(comp);

    if (index >= 0) {
      jsArray.fastRemoveAt(this._deferredComps, index);
      return;
    } // unschedule


    if (comp.start && !(comp._objFlags & IsStartCalled)) {
      this.startInvoker.remove(comp);
    }

    if (comp.update) {
      this.updateInvoker.remove(comp);
    }

    if (comp.lateUpdate) {
      this.lateUpdateInvoker.remove(comp);
    }
  },
  enableComp: CC_EDITOR ? function (comp, invoker) {
    if (cc.engine.isPlaying || comp.constructor._executeInEditMode) {
      if (!(comp._objFlags & IsOnEnableCalled)) {
        if (comp.onEnable) {
          if (invoker) {
            invoker.add(comp);
            enableInEditor(comp);
            return;
          } else {
            callOnEnableInTryCatch(comp);
            var deactivatedDuringOnEnable = !comp.node._activeInHierarchy;

            if (deactivatedDuringOnEnable) {
              return;
            }
          }
        }

        this._onEnabled(comp);
      }
    }

    enableInEditor(comp);
  } : function (comp, invoker) {
    if (!(comp._objFlags & IsOnEnableCalled)) {
      if (comp.onEnable) {
        if (invoker) {
          invoker.add(comp);
          return;
        } else {
          comp.onEnable();
          var deactivatedDuringOnEnable = !comp.node._activeInHierarchy;

          if (deactivatedDuringOnEnable) {
            return;
          }
        }
      }

      this._onEnabled(comp);
    }
  },
  disableComp: CC_EDITOR ? function (comp) {
    if (cc.engine.isPlaying || comp.constructor._executeInEditMode) {
      if (comp._objFlags & IsOnEnableCalled) {
        if (comp.onDisable) {
          callOnDisableInTryCatch(comp);
        }

        this._onDisabled(comp);
      }
    }

    if (comp._objFlags & IsEditorOnEnableCalled) {
      cc.engine.emit('component-disabled', comp.uuid);
      comp._objFlags &= ~IsEditorOnEnableCalled;
    }
  } : function (comp) {
    if (comp._objFlags & IsOnEnableCalled) {
      if (comp.onDisable) {
        comp.onDisable();
      }

      this._onDisabled(comp);
    }
  },
  _scheduleImmediate: function _scheduleImmediate(comp) {
    if (typeof comp.start === 'function' && !(comp._objFlags & IsStartCalled)) {
      this.startInvoker.add(comp);
    }

    if (typeof comp.update === 'function') {
      this.updateInvoker.add(comp);
    }

    if (typeof comp.lateUpdate === 'function') {
      this.lateUpdateInvoker.add(comp);
    }
  },
  _deferredSchedule: function _deferredSchedule() {
    var comps = this._deferredComps;

    for (var i = 0, len = comps.length; i < len; i++) {
      this._scheduleImmediate(comps[i]);
    }

    comps.length = 0;
  },
  // Call new registered start schedule immediately since last time start phase calling in this frame
  // See cocos-creator/2d-tasks/issues/256
  _startForNewComps: function _startForNewComps() {
    if (this._deferredComps.length > 0) {
      this._deferredSchedule();

      this.startInvoker.invoke();
    }
  },
  startPhase: function startPhase() {
    // Start of this frame
    this._updating = true; // call start

    this.startInvoker.invoke(); // Start components of new activated nodes during start

    this._startForNewComps(); // if (CC_PREVIEW) {
    //     try {
    //         this.startInvoker.invoke();
    //     }
    //     catch (e) {
    //         // prevent start from getting into infinite loop
    //         this.startInvoker._neg.array.length = 0;
    //         this.startInvoker._zero.array.length = 0;
    //         this.startInvoker._pos.array.length = 0;
    //         throw e;
    //     }
    // }
    // else {
    //     this.startInvoker.invoke();
    // }

  },
  updatePhase: function updatePhase(dt) {
    this.updateInvoker.invoke(dt);
  },
  lateUpdatePhase: function lateUpdatePhase(dt) {
    this.lateUpdateInvoker.invoke(dt); // End of this frame

    this._updating = false; // Start components of new activated nodes during update and lateUpdate
    // The start callback will be invoked immediately,
    // update and lateUpdate callback will be running in the next frame

    this._startForNewComps();
  }
});
module.exports = ComponentScheduler;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudC1zY2hlZHVsZXIuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsIkZsYWdzIiwianNBcnJheSIsImFycmF5IiwiSXNTdGFydENhbGxlZCIsIklzT25FbmFibGVDYWxsZWQiLCJJc0VkaXRvck9uRW5hYmxlQ2FsbGVkIiwiY2FsbGVyRnVuY3RvciIsIkNDX0VESVRPUiIsInRyeUNhdGNoRnVuY3Rvcl9FRElUT1IiLCJjYWxsT25FbmFibGVJblRyeUNhdGNoIiwiY2FsbE9uRGlzYWJsZUluVHJ5Q2F0Y2giLCJzb3J0ZWRJbmRleCIsImNvbXAiLCJvcmRlciIsImNvbnN0cnVjdG9yIiwiX2V4ZWN1dGlvbk9yZGVyIiwiaWQiLCJfaWQiLCJsIiwiaCIsImxlbmd0aCIsIm0iLCJ0ZXN0IiwidGVzdE9yZGVyIiwidGVzdElkIiwic3RhYmxlUmVtb3ZlSW5hY3RpdmUiLCJpdGVyYXRvciIsImZsYWdUb0NsZWFyIiwibmV4dCIsImkiLCJfZW5hYmxlZCIsIm5vZGUiLCJfYWN0aXZlSW5IaWVyYXJjaHkiLCJyZW1vdmVBdCIsIl9vYmpGbGFncyIsIkxpZmVDeWNsZUludm9rZXIiLCJjYyIsIkNsYXNzIiwiX19jdG9yX18iLCJpbnZva2VGdW5jIiwiSXRlcmF0b3IiLCJNdXRhYmxlRm9yd2FyZEl0ZXJhdG9yIiwiX3plcm8iLCJfbmVnIiwiX3BvcyIsIkNDX1RFU1QiLCJhc3NlcnQiLCJfaW52b2tlIiwic3RhdGljcyIsImFkZCIsInJlbW92ZSIsImludm9rZSIsImNvbXBhcmVPcmRlciIsImEiLCJiIiwiT25lT2ZmSW52b2tlciIsInB1c2giLCJmYXN0UmVtb3ZlIiwiY2FuY2VsSW5hY3RpdmUiLCJjb21wc05lZyIsInNvcnQiLCJjb21wc1BvcyIsIlJldXNhYmxlSW52b2tlciIsInNwbGljZSIsIkNDX0RFViIsImVycm9yIiwiZHQiLCJlbmFibGVJbkVkaXRvciIsImVuZ2luZSIsImVtaXQiLCJ1dWlkIiwiY3JlYXRlSW52b2tlSW1wbCIsImluZGllUGF0aCIsInVzZUR0IiwiZW5zdXJlRmxhZyIsImZhc3RQYXRoIiwiQ0NfU1VQUE9SVF9KSVQiLCJib2R5IiwiRnVuY3Rpb24iLCJlIiwiX3Rocm93IiwiaW52b2tlU3RhcnQiLCJjIiwic3RhcnQiLCJpbnZva2VVcGRhdGUiLCJ1cGRhdGUiLCJ1bmRlZmluZWQiLCJpbnZva2VMYXRlVXBkYXRlIiwibGF0ZVVwZGF0ZSIsImN0b3IiLCJzdGFydEludm9rZXIiLCJ1cGRhdGVJbnZva2VyIiwibGF0ZVVwZGF0ZUludm9rZXIiLCJfZGVmZXJyZWRDb21wcyIsIl91cGRhdGluZyIsIkNvbXBvbmVudFNjaGVkdWxlciIsInVuc2NoZWR1bGVBbGwiLCJpbnZva2VPbkVuYWJsZSIsImNvbXBTY2hlZHVsZXIiLCJkaXJlY3RvciIsIl9jb21wU2NoZWR1bGVyIiwiZGVhY3RpdmF0ZWREdXJpbmdPbkVuYWJsZSIsIl9vbkVuYWJsZWQiLCJvbkVuYWJsZSIsImdldFNjaGVkdWxlciIsInJlc3VtZVRhcmdldCIsIl9zY2hlZHVsZUltbWVkaWF0ZSIsIl9vbkRpc2FibGVkIiwicGF1c2VUYXJnZXQiLCJpbmRleCIsImluZGV4T2YiLCJmYXN0UmVtb3ZlQXQiLCJlbmFibGVDb21wIiwiaW52b2tlciIsImlzUGxheWluZyIsIl9leGVjdXRlSW5FZGl0TW9kZSIsImRpc2FibGVDb21wIiwib25EaXNhYmxlIiwiX2RlZmVycmVkU2NoZWR1bGUiLCJjb21wcyIsImxlbiIsIl9zdGFydEZvck5ld0NvbXBzIiwic3RhcnRQaGFzZSIsInVwZGF0ZVBoYXNlIiwibGF0ZVVwZGF0ZVBoYXNlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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OztBQUNBLFNBQUtzRSxpQkFBTCxHQVJVLENBVVY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNILEdBL0w2QjtBQWlNOUJFLEVBQUFBLFdBak04Qix1QkFpTWpCekQsRUFqTWlCLEVBaU1iO0FBQ2IsU0FBS3lCLGFBQUwsQ0FBbUJ4QyxNQUFuQixDQUEwQmUsRUFBMUI7QUFDSCxHQW5NNkI7QUFxTTlCMEQsRUFBQUEsZUFyTThCLDJCQXFNYjFELEVBck1hLEVBcU1UO0FBQ2pCLFNBQUswQixpQkFBTCxDQUF1QnpDLE1BQXZCLENBQThCZSxFQUE5QixFQURpQixDQUdqQjs7QUFDQSxTQUFLNEIsU0FBTCxHQUFpQixLQUFqQixDQUppQixDQU1qQjtBQUNBO0FBQ0E7O0FBQ0EsU0FBSzJCLGlCQUFMO0FBQ0g7QUEvTTZCLENBQVQsQ0FBekI7QUFrTkFJLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQi9CLGtCQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxucmVxdWlyZSgnLi9wbGF0Zm9ybS9DQ0NsYXNzJyk7XG52YXIgRmxhZ3MgPSByZXF1aXJlKCcuL3BsYXRmb3JtL0NDT2JqZWN0JykuRmxhZ3M7XG52YXIganNBcnJheSA9IHJlcXVpcmUoJy4vcGxhdGZvcm0vanMnKS5hcnJheTtcblxudmFyIElzU3RhcnRDYWxsZWQgPSBGbGFncy5Jc1N0YXJ0Q2FsbGVkO1xudmFyIElzT25FbmFibGVDYWxsZWQgPSBGbGFncy5Jc09uRW5hYmxlQ2FsbGVkO1xudmFyIElzRWRpdG9yT25FbmFibGVDYWxsZWQgPSBGbGFncy5Jc0VkaXRvck9uRW5hYmxlQ2FsbGVkO1xuXG52YXIgY2FsbGVyRnVuY3RvciA9IENDX0VESVRPUiAmJiByZXF1aXJlKCcuL3V0aWxzL21pc2MnKS50cnlDYXRjaEZ1bmN0b3JfRURJVE9SO1xudmFyIGNhbGxPbkVuYWJsZUluVHJ5Q2F0Y2ggPSBDQ19FRElUT1IgJiYgY2FsbGVyRnVuY3Rvcignb25FbmFibGUnKTtcbnZhciBjYWxsT25EaXNhYmxlSW5UcnlDYXRjaCA9IENDX0VESVRPUiAmJiBjYWxsZXJGdW5jdG9yKCdvbkRpc2FibGUnKTtcblxuZnVuY3Rpb24gc29ydGVkSW5kZXggKGFycmF5LCBjb21wKSB7XG4gICAgdmFyIG9yZGVyID0gY29tcC5jb25zdHJ1Y3Rvci5fZXhlY3V0aW9uT3JkZXI7XG4gICAgdmFyIGlkID0gY29tcC5faWQ7XG4gICAgZm9yICh2YXIgbCA9IDAsIGggPSBhcnJheS5sZW5ndGggLSAxLCBtID0gaCA+Pj4gMTtcbiAgICAgICAgIGwgPD0gaDtcbiAgICAgICAgIG0gPSAobCArIGgpID4+PiAxXG4gICAgKSB7XG4gICAgICAgIHZhciB0ZXN0ID0gYXJyYXlbbV07XG4gICAgICAgIHZhciB0ZXN0T3JkZXIgPSB0ZXN0LmNvbnN0cnVjdG9yLl9leGVjdXRpb25PcmRlcjtcbiAgICAgICAgaWYgKHRlc3RPcmRlciA+IG9yZGVyKSB7XG4gICAgICAgICAgICBoID0gbSAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGVzdE9yZGVyIDwgb3JkZXIpIHtcbiAgICAgICAgICAgIGwgPSBtICsgMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciB0ZXN0SWQgPSB0ZXN0Ll9pZDtcbiAgICAgICAgICAgIGlmICh0ZXN0SWQgPiBpZCkge1xuICAgICAgICAgICAgICAgIGggPSBtIC0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRlc3RJZCA8IGlkKSB7XG4gICAgICAgICAgICAgICAgbCA9IG0gKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIH5sO1xufVxuXG4vLyByZW1vdmUgZGlzYWJsZWQgYW5kIG5vdCBpbnZva2VkIGNvbXBvbmVudCBmcm9tIGFycmF5XG5mdW5jdGlvbiBzdGFibGVSZW1vdmVJbmFjdGl2ZSAoaXRlcmF0b3IsIGZsYWdUb0NsZWFyKSB7XG4gICAgdmFyIGFycmF5ID0gaXRlcmF0b3IuYXJyYXk7XG4gICAgdmFyIG5leHQgPSBpdGVyYXRvci5pICsgMTtcbiAgICB3aGlsZSAobmV4dCA8IGFycmF5Lmxlbmd0aCkge1xuICAgICAgICB2YXIgY29tcCA9IGFycmF5W25leHRdO1xuICAgICAgICBpZiAoY29tcC5fZW5hYmxlZCAmJiBjb21wLm5vZGUuX2FjdGl2ZUluSGllcmFyY2h5KSB7XG4gICAgICAgICAgICArK25leHQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpdGVyYXRvci5yZW1vdmVBdChuZXh0KTtcbiAgICAgICAgICAgIGlmIChmbGFnVG9DbGVhcikge1xuICAgICAgICAgICAgICAgIGNvbXAuX29iakZsYWdzICY9IH5mbGFnVG9DbGVhcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gVGhpcyBjbGFzcyBjb250YWlucyBzb21lIHF1ZXVlcyB1c2VkIHRvIGludm9rZSBsaWZlLWN5Y2xlIG1ldGhvZHMgYnkgc2NyaXB0IGV4ZWN1dGlvbiBvcmRlclxudmFyIExpZmVDeWNsZUludm9rZXIgPSBjYy5DbGFzcyh7XG4gICAgX19jdG9yX18gKGludm9rZUZ1bmMpIHtcbiAgICAgICAgdmFyIEl0ZXJhdG9yID0ganNBcnJheS5NdXRhYmxlRm9yd2FyZEl0ZXJhdG9yO1xuICAgICAgICAvLyBjb21wb25lbnRzIHdoaWNoIHByaW9yaXR5ID09PSAwIChkZWZhdWx0KVxuICAgICAgICB0aGlzLl96ZXJvID0gbmV3IEl0ZXJhdG9yKFtdKTtcbiAgICAgICAgLy8gY29tcG9uZW50cyB3aGljaCBwcmlvcml0eSA8IDBcbiAgICAgICAgdGhpcy5fbmVnID0gbmV3IEl0ZXJhdG9yKFtdKTtcbiAgICAgICAgLy8gY29tcG9uZW50cyB3aGljaCBwcmlvcml0eSA+IDBcbiAgICAgICAgdGhpcy5fcG9zID0gbmV3IEl0ZXJhdG9yKFtdKTtcblxuICAgICAgICBpZiAoQ0NfVEVTVCkge1xuICAgICAgICAgICAgY2MuYXNzZXJ0KHR5cGVvZiBpbnZva2VGdW5jID09PSAnZnVuY3Rpb24nLCAnaW52b2tlRnVuYyBtdXN0IGJlIHR5cGUgZnVuY3Rpb24nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9pbnZva2UgPSBpbnZva2VGdW5jO1xuICAgIH0sXG4gICAgc3RhdGljczoge1xuICAgICAgICBzdGFibGVSZW1vdmVJbmFjdGl2ZVxuICAgIH0sXG4gICAgYWRkOiBudWxsLFxuICAgIHJlbW92ZTogbnVsbCxcbiAgICBpbnZva2U6IG51bGwsXG59KTtcblxuZnVuY3Rpb24gY29tcGFyZU9yZGVyIChhLCBiKSB7XG4gICAgcmV0dXJuIGEuY29uc3RydWN0b3IuX2V4ZWN1dGlvbk9yZGVyIC0gYi5jb25zdHJ1Y3Rvci5fZXhlY3V0aW9uT3JkZXI7XG59XG5cbi8vIGZvciBvbkxvYWQ6IHNvcnQgb25jZSBhbGwgY29tcG9uZW50cyByZWdpc3RlcmVkLCBpbnZva2Ugb25jZVxudmFyIE9uZU9mZkludm9rZXIgPSBjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogTGlmZUN5Y2xlSW52b2tlcixcbiAgICBhZGQgKGNvbXApIHtcbiAgICAgICAgdmFyIG9yZGVyID0gY29tcC5jb25zdHJ1Y3Rvci5fZXhlY3V0aW9uT3JkZXI7XG4gICAgICAgIChvcmRlciA9PT0gMCA/IHRoaXMuX3plcm8gOiAob3JkZXIgPCAwID8gdGhpcy5fbmVnIDogdGhpcy5fcG9zKSkuYXJyYXkucHVzaChjb21wKTtcbiAgICB9LFxuICAgIHJlbW92ZSAoY29tcCkge1xuICAgICAgICB2YXIgb3JkZXIgPSBjb21wLmNvbnN0cnVjdG9yLl9leGVjdXRpb25PcmRlcjtcbiAgICAgICAgKG9yZGVyID09PSAwID8gdGhpcy5femVybyA6IChvcmRlciA8IDAgPyB0aGlzLl9uZWcgOiB0aGlzLl9wb3MpKS5mYXN0UmVtb3ZlKGNvbXApO1xuICAgIH0sXG4gICAgY2FuY2VsSW5hY3RpdmUgKGZsYWdUb0NsZWFyKSB7XG4gICAgICAgIHN0YWJsZVJlbW92ZUluYWN0aXZlKHRoaXMuX3plcm8sIGZsYWdUb0NsZWFyKTtcbiAgICAgICAgc3RhYmxlUmVtb3ZlSW5hY3RpdmUodGhpcy5fbmVnLCBmbGFnVG9DbGVhcik7XG4gICAgICAgIHN0YWJsZVJlbW92ZUluYWN0aXZlKHRoaXMuX3BvcywgZmxhZ1RvQ2xlYXIpO1xuICAgIH0sXG4gICAgaW52b2tlICgpIHtcbiAgICAgICAgdmFyIGNvbXBzTmVnID0gdGhpcy5fbmVnO1xuICAgICAgICBpZiAoY29tcHNOZWcuYXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29tcHNOZWcuYXJyYXkuc29ydChjb21wYXJlT3JkZXIpO1xuICAgICAgICAgICAgdGhpcy5faW52b2tlKGNvbXBzTmVnKTtcbiAgICAgICAgICAgIGNvbXBzTmVnLmFycmF5Lmxlbmd0aCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9pbnZva2UodGhpcy5femVybyk7XG4gICAgICAgIHRoaXMuX3plcm8uYXJyYXkubGVuZ3RoID0gMDtcblxuICAgICAgICB2YXIgY29tcHNQb3MgPSB0aGlzLl9wb3M7XG4gICAgICAgIGlmIChjb21wc1Bvcy5hcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb21wc1Bvcy5hcnJheS5zb3J0KGNvbXBhcmVPcmRlcik7XG4gICAgICAgICAgICB0aGlzLl9pbnZva2UoY29tcHNQb3MpO1xuICAgICAgICAgICAgY29tcHNQb3MuYXJyYXkubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgIH0sXG59KTtcblxuLy8gZm9yIHVwZGF0ZTogc29ydCBldmVyeSB0aW1lIG5ldyBjb21wb25lbnQgcmVnaXN0ZXJlZCwgaW52b2tlIG1hbnkgdGltZXNcbnZhciBSZXVzYWJsZUludm9rZXIgPSBjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogTGlmZUN5Y2xlSW52b2tlcixcbiAgICBhZGQgKGNvbXApIHtcbiAgICAgICAgdmFyIG9yZGVyID0gY29tcC5jb25zdHJ1Y3Rvci5fZXhlY3V0aW9uT3JkZXI7XG4gICAgICAgIGlmIChvcmRlciA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5femVyby5hcnJheS5wdXNoKGNvbXApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGFycmF5ID0gb3JkZXIgPCAwID8gdGhpcy5fbmVnLmFycmF5IDogdGhpcy5fcG9zLmFycmF5O1xuICAgICAgICAgICAgdmFyIGkgPSBzb3J0ZWRJbmRleChhcnJheSwgY29tcCk7XG4gICAgICAgICAgICBpZiAoaSA8IDApIHtcbiAgICAgICAgICAgICAgICBhcnJheS5zcGxpY2UofmksIDAsIGNvbXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoQ0NfREVWKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3IoJ2NvbXBvbmVudCBhbHJlYWR5IGFkZGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZSAoY29tcCkge1xuICAgICAgICB2YXIgb3JkZXIgPSBjb21wLmNvbnN0cnVjdG9yLl9leGVjdXRpb25PcmRlcjtcbiAgICAgICAgaWYgKG9yZGVyID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl96ZXJvLmZhc3RSZW1vdmUoY29tcCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBvcmRlciA8IDAgPyB0aGlzLl9uZWcgOiB0aGlzLl9wb3M7XG4gICAgICAgICAgICB2YXIgaSA9IHNvcnRlZEluZGV4KGl0ZXJhdG9yLmFycmF5LCBjb21wKTtcbiAgICAgICAgICAgIGlmIChpID49IDApIHtcbiAgICAgICAgICAgICAgICBpdGVyYXRvci5yZW1vdmVBdChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgaW52b2tlIChkdCkge1xuICAgICAgICBpZiAodGhpcy5fbmVnLmFycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2ludm9rZSh0aGlzLl9uZWcsIGR0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2ludm9rZSh0aGlzLl96ZXJvLCBkdCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX3Bvcy5hcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLl9pbnZva2UodGhpcy5fcG9zLCBkdCk7XG4gICAgICAgIH1cbiAgICB9LFxufSk7XG5cbmZ1bmN0aW9uIGVuYWJsZUluRWRpdG9yIChjb21wKSB7XG4gICAgaWYgKCEoY29tcC5fb2JqRmxhZ3MgJiBJc0VkaXRvck9uRW5hYmxlQ2FsbGVkKSkge1xuICAgICAgICBjYy5lbmdpbmUuZW1pdCgnY29tcG9uZW50LWVuYWJsZWQnLCBjb21wLnV1aWQpO1xuICAgICAgICBjb21wLl9vYmpGbGFncyB8PSBJc0VkaXRvck9uRW5hYmxlQ2FsbGVkO1xuICAgIH1cbn1cblxuLy8gcmV0dXJuIGZ1bmN0aW9uIHRvIHNpbXBseSBjYWxsIGVhY2ggY29tcG9uZW50IHdpdGggdHJ5IGNhdGNoIHByb3RlY3Rpb25cbmZ1bmN0aW9uIGNyZWF0ZUludm9rZUltcGwgKGluZGllUGF0aCwgdXNlRHQsIGVuc3VyZUZsYWcsIGZhc3RQYXRoKSB7XG4gICAgaWYgKENDX1NVUFBPUlRfSklUKSB7XG4gICAgICAgIC8vIGZ1bmN0aW9uIChpdCkge1xuICAgICAgICAvLyAgICAgdmFyIGEgPSBpdC5hcnJheTtcbiAgICAgICAgLy8gICAgIGZvciAoaXQuaSA9IDA7IGl0LmkgPCBhLmxlbmd0aDsgKytpdC5pKSB7XG4gICAgICAgIC8vICAgICAgICAgdmFyIGMgPSBhW2l0LmldO1xuICAgICAgICAvLyAgICAgICAgIC8vIC4uLlxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG4gICAgICAgIGxldCBib2R5ID0gJ3ZhciBhPWl0LmFycmF5OycgK1xuICAgICAgICAgICAgICAgICAgICdmb3IoaXQuaT0wO2l0Lmk8YS5sZW5ndGg7KytpdC5pKXsnICtcbiAgICAgICAgICAgICAgICAgICAndmFyIGM9YVtpdC5pXTsnICtcbiAgICAgICAgICAgICAgICAgICBpbmRpZVBhdGggK1xuICAgICAgICAgICAgICAgICAgICd9JztcbiAgICAgICAgZmFzdFBhdGggPSB1c2VEdCA/IEZ1bmN0aW9uKCdpdCcsICdkdCcsIGJvZHkpIDogRnVuY3Rpb24oJ2l0JywgYm9keSk7XG4gICAgICAgIGluZGllUGF0aCA9IEZ1bmN0aW9uKCdjJywgJ2R0JywgaW5kaWVQYXRoKTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChpdGVyYXRvciwgZHQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZhc3RQYXRoKGl0ZXJhdG9yLCBkdCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIHNsb3cgcGF0aFxuICAgICAgICAgICAgY2MuX3Rocm93KGUpO1xuICAgICAgICAgICAgdmFyIGFycmF5ID0gaXRlcmF0b3IuYXJyYXk7XG4gICAgICAgICAgICBpZiAoZW5zdXJlRmxhZykge1xuICAgICAgICAgICAgICAgIGFycmF5W2l0ZXJhdG9yLmldLl9vYmpGbGFncyB8PSBlbnN1cmVGbGFnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKytpdGVyYXRvci5pOyAgIC8vIGludm9rZSBuZXh0IGNhbGxiYWNrXG4gICAgICAgICAgICBmb3IgKDsgaXRlcmF0b3IuaSA8IGFycmF5Lmxlbmd0aDsgKytpdGVyYXRvci5pKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaW5kaWVQYXRoKGFycmF5W2l0ZXJhdG9yLmldLCBkdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLl90aHJvdyhlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuc3VyZUZsYWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5W2l0ZXJhdG9yLmldLl9vYmpGbGFncyB8PSBlbnN1cmVGbGFnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cblxudmFyIGludm9rZVN0YXJ0ID0gQ0NfU1VQUE9SVF9KSVQgP1xuICAgIGNyZWF0ZUludm9rZUltcGwoJ2Muc3RhcnQoKTtjLl9vYmpGbGFnc3w9JyArIElzU3RhcnRDYWxsZWQsIGZhbHNlLCBJc1N0YXJ0Q2FsbGVkKSA6XG4gICAgY3JlYXRlSW52b2tlSW1wbChmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgYy5zdGFydCgpO1xuICAgICAgICAgICAgYy5fb2JqRmxhZ3MgfD0gSXNTdGFydENhbGxlZDtcbiAgICAgICAgfSxcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIElzU3RhcnRDYWxsZWQsXG4gICAgICAgIGZ1bmN0aW9uIChpdGVyYXRvcikge1xuICAgICAgICAgICAgdmFyIGFycmF5ID0gaXRlcmF0b3IuYXJyYXk7XG4gICAgICAgICAgICBmb3IgKGl0ZXJhdG9yLmkgPSAwOyBpdGVyYXRvci5pIDwgYXJyYXkubGVuZ3RoOyArK2l0ZXJhdG9yLmkpIHtcbiAgICAgICAgICAgICAgICBsZXQgY29tcCA9IGFycmF5W2l0ZXJhdG9yLmldO1xuICAgICAgICAgICAgICAgIGNvbXAuc3RhcnQoKTtcbiAgICAgICAgICAgICAgICBjb21wLl9vYmpGbGFncyB8PSBJc1N0YXJ0Q2FsbGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgKTtcbnZhciBpbnZva2VVcGRhdGUgPSBDQ19TVVBQT1JUX0pJVCA/XG4gICAgY3JlYXRlSW52b2tlSW1wbCgnYy51cGRhdGUoZHQpJywgdHJ1ZSkgOlxuICAgIGNyZWF0ZUludm9rZUltcGwoZnVuY3Rpb24gKGMsIGR0KSB7XG4gICAgICAgICAgICBjLnVwZGF0ZShkdCk7XG4gICAgICAgIH0sXG4gICAgICAgIHRydWUsXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgZnVuY3Rpb24gKGl0ZXJhdG9yLCBkdCkge1xuICAgICAgICAgICAgdmFyIGFycmF5ID0gaXRlcmF0b3IuYXJyYXk7XG4gICAgICAgICAgICBmb3IgKGl0ZXJhdG9yLmkgPSAwOyBpdGVyYXRvci5pIDwgYXJyYXkubGVuZ3RoOyArK2l0ZXJhdG9yLmkpIHtcbiAgICAgICAgICAgICAgICBhcnJheVtpdGVyYXRvci5pXS51cGRhdGUoZHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgKTtcbnZhciBpbnZva2VMYXRlVXBkYXRlID0gQ0NfU1VQUE9SVF9KSVQgP1xuICAgIGNyZWF0ZUludm9rZUltcGwoJ2MubGF0ZVVwZGF0ZShkdCknLCB0cnVlKSA6XG4gICAgY3JlYXRlSW52b2tlSW1wbChmdW5jdGlvbiAoYywgZHQpIHtcbiAgICAgICAgICAgIGMubGF0ZVVwZGF0ZShkdCk7XG4gICAgICAgIH0sXG4gICAgICAgIHRydWUsXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgZnVuY3Rpb24gKGl0ZXJhdG9yLCBkdCkge1xuICAgICAgICAgICAgdmFyIGFycmF5ID0gaXRlcmF0b3IuYXJyYXk7XG4gICAgICAgICAgICBmb3IgKGl0ZXJhdG9yLmkgPSAwOyBpdGVyYXRvci5pIDwgYXJyYXkubGVuZ3RoOyArK2l0ZXJhdG9yLmkpIHtcbiAgICAgICAgICAgICAgICBhcnJheVtpdGVyYXRvci5pXS5sYXRlVXBkYXRlKGR0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICk7XG4vKipcbiAqIFRoZSBNYW5hZ2VyIGZvciBDb21wb25lbnQncyBsaWZlLWN5Y2xlIG1ldGhvZHMuXG4gKi9cbmZ1bmN0aW9uIGN0b3IgKCkge1xuICAgIC8vIGludm9rZXJzXG4gICAgdGhpcy5zdGFydEludm9rZXIgPSBuZXcgT25lT2ZmSW52b2tlcihpbnZva2VTdGFydCk7XG4gICAgdGhpcy51cGRhdGVJbnZva2VyID0gbmV3IFJldXNhYmxlSW52b2tlcihpbnZva2VVcGRhdGUpO1xuICAgIHRoaXMubGF0ZVVwZGF0ZUludm9rZXIgPSBuZXcgUmV1c2FibGVJbnZva2VyKGludm9rZUxhdGVVcGRhdGUpO1xuXG4gICAgLy8gY29tcG9uZW50cyBkZWZlcnJlZCB0byBuZXh0IGZyYW1lXG4gICAgdGhpcy5fZGVmZXJyZWRDb21wcyA9IFtdO1xuXG4gICAgLy8gZHVyaW5nIGEgbG9vcFxuICAgIHRoaXMuX3VwZGF0aW5nID0gZmFsc2U7XG59XG52YXIgQ29tcG9uZW50U2NoZWR1bGVyID0gY2MuQ2xhc3Moe1xuICAgIGN0b3I6IGN0b3IsXG4gICAgdW5zY2hlZHVsZUFsbDogY3RvcixcblxuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgTGlmZUN5Y2xlSW52b2tlcixcbiAgICAgICAgT25lT2ZmSW52b2tlcixcbiAgICAgICAgY3JlYXRlSW52b2tlSW1wbCxcbiAgICAgICAgaW52b2tlT25FbmFibGU6IENDX0VESVRPUiA/IGZ1bmN0aW9uIChpdGVyYXRvcikge1xuICAgICAgICAgICAgdmFyIGNvbXBTY2hlZHVsZXIgPSBjYy5kaXJlY3Rvci5fY29tcFNjaGVkdWxlcjtcbiAgICAgICAgICAgIHZhciBhcnJheSA9IGl0ZXJhdG9yLmFycmF5O1xuICAgICAgICAgICAgZm9yIChpdGVyYXRvci5pID0gMDsgaXRlcmF0b3IuaSA8IGFycmF5Lmxlbmd0aDsgKytpdGVyYXRvci5pKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvbXAgPSBhcnJheVtpdGVyYXRvci5pXTtcbiAgICAgICAgICAgICAgICBpZiAoY29tcC5fZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsT25FbmFibGVJblRyeUNhdGNoKGNvbXApO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGVhY3RpdmF0ZWREdXJpbmdPbkVuYWJsZSA9ICFjb21wLm5vZGUuX2FjdGl2ZUluSGllcmFyY2h5O1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWRlYWN0aXZhdGVkRHVyaW5nT25FbmFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBTY2hlZHVsZXIuX29uRW5hYmxlZChjb21wKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSA6IGZ1bmN0aW9uIChpdGVyYXRvcikge1xuICAgICAgICAgICAgdmFyIGNvbXBTY2hlZHVsZXIgPSBjYy5kaXJlY3Rvci5fY29tcFNjaGVkdWxlcjtcbiAgICAgICAgICAgIHZhciBhcnJheSA9IGl0ZXJhdG9yLmFycmF5O1xuICAgICAgICAgICAgZm9yIChpdGVyYXRvci5pID0gMDsgaXRlcmF0b3IuaSA8IGFycmF5Lmxlbmd0aDsgKytpdGVyYXRvci5pKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvbXAgPSBhcnJheVtpdGVyYXRvci5pXTtcbiAgICAgICAgICAgICAgICBpZiAoY29tcC5fZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICBjb21wLm9uRW5hYmxlKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkZWFjdGl2YXRlZER1cmluZ09uRW5hYmxlID0gIWNvbXAubm9kZS5fYWN0aXZlSW5IaWVyYXJjaHk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZGVhY3RpdmF0ZWREdXJpbmdPbkVuYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcFNjaGVkdWxlci5fb25FbmFibGVkKGNvbXApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9vbkVuYWJsZWQgKGNvbXApIHtcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NoZWR1bGVyKCkucmVzdW1lVGFyZ2V0KGNvbXApO1xuICAgICAgICBjb21wLl9vYmpGbGFncyB8PSBJc09uRW5hYmxlQ2FsbGVkO1xuXG4gICAgICAgIC8vIHNjaGVkdWxlXG4gICAgICAgIGlmICh0aGlzLl91cGRhdGluZykge1xuICAgICAgICAgICAgdGhpcy5fZGVmZXJyZWRDb21wcy5wdXNoKGNvbXApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVJbW1lZGlhdGUoY29tcCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX29uRGlzYWJsZWQgKGNvbXApIHtcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NoZWR1bGVyKCkucGF1c2VUYXJnZXQoY29tcCk7XG4gICAgICAgIGNvbXAuX29iakZsYWdzICY9IH5Jc09uRW5hYmxlQ2FsbGVkO1xuXG4gICAgICAgIC8vIGNhbmNlbCBzY2hlZHVsZSB0YXNrXG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuX2RlZmVycmVkQ29tcHMuaW5kZXhPZihjb21wKTtcbiAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICAgIGpzQXJyYXkuZmFzdFJlbW92ZUF0KHRoaXMuX2RlZmVycmVkQ29tcHMsIGluZGV4KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVuc2NoZWR1bGVcbiAgICAgICAgaWYgKGNvbXAuc3RhcnQgJiYgIShjb21wLl9vYmpGbGFncyAmIElzU3RhcnRDYWxsZWQpKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0SW52b2tlci5yZW1vdmUoY29tcCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbXAudXBkYXRlKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUludm9rZXIucmVtb3ZlKGNvbXApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb21wLmxhdGVVcGRhdGUpIHtcbiAgICAgICAgICAgIHRoaXMubGF0ZVVwZGF0ZUludm9rZXIucmVtb3ZlKGNvbXApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGVuYWJsZUNvbXA6IENDX0VESVRPUiA/IGZ1bmN0aW9uIChjb21wLCBpbnZva2VyKSB7XG4gICAgICAgIGlmIChjYy5lbmdpbmUuaXNQbGF5aW5nIHx8IGNvbXAuY29uc3RydWN0b3IuX2V4ZWN1dGVJbkVkaXRNb2RlKSB7XG4gICAgICAgICAgICBpZiAoIShjb21wLl9vYmpGbGFncyAmIElzT25FbmFibGVDYWxsZWQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXAub25FbmFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGludm9rZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludm9rZXIuYWRkKGNvbXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlSW5FZGl0b3IoY29tcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsT25FbmFibGVJblRyeUNhdGNoKGNvbXApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVhY3RpdmF0ZWREdXJpbmdPbkVuYWJsZSA9ICFjb21wLm5vZGUuX2FjdGl2ZUluSGllcmFyY2h5O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlYWN0aXZhdGVkRHVyaW5nT25FbmFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fb25FbmFibGVkKGNvbXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVuYWJsZUluRWRpdG9yKGNvbXApO1xuICAgIH0gOiBmdW5jdGlvbiAoY29tcCwgaW52b2tlcikge1xuICAgICAgICBpZiAoIShjb21wLl9vYmpGbGFncyAmIElzT25FbmFibGVDYWxsZWQpKSB7XG4gICAgICAgICAgICBpZiAoY29tcC5vbkVuYWJsZSkge1xuICAgICAgICAgICAgICAgIGlmIChpbnZva2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIGludm9rZXIuYWRkKGNvbXApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb21wLm9uRW5hYmxlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlYWN0aXZhdGVkRHVyaW5nT25FbmFibGUgPSAhY29tcC5ub2RlLl9hY3RpdmVJbkhpZXJhcmNoeTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlYWN0aXZhdGVkRHVyaW5nT25FbmFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX29uRW5hYmxlZChjb21wKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBkaXNhYmxlQ29tcDogQ0NfRURJVE9SID8gZnVuY3Rpb24gKGNvbXApIHtcbiAgICAgICAgaWYgKGNjLmVuZ2luZS5pc1BsYXlpbmcgfHwgY29tcC5jb25zdHJ1Y3Rvci5fZXhlY3V0ZUluRWRpdE1vZGUpIHtcbiAgICAgICAgICAgIGlmIChjb21wLl9vYmpGbGFncyAmIElzT25FbmFibGVDYWxsZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcC5vbkRpc2FibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbE9uRGlzYWJsZUluVHJ5Q2F0Y2goY29tcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX29uRGlzYWJsZWQoY29tcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbXAuX29iakZsYWdzICYgSXNFZGl0b3JPbkVuYWJsZUNhbGxlZCkge1xuICAgICAgICAgICAgY2MuZW5naW5lLmVtaXQoJ2NvbXBvbmVudC1kaXNhYmxlZCcsIGNvbXAudXVpZCk7XG4gICAgICAgICAgICBjb21wLl9vYmpGbGFncyAmPSB+SXNFZGl0b3JPbkVuYWJsZUNhbGxlZDtcbiAgICAgICAgfVxuICAgIH0gOiBmdW5jdGlvbiAoY29tcCkge1xuICAgICAgICBpZiAoY29tcC5fb2JqRmxhZ3MgJiBJc09uRW5hYmxlQ2FsbGVkKSB7XG4gICAgICAgICAgICBpZiAoY29tcC5vbkRpc2FibGUpIHtcbiAgICAgICAgICAgICAgICBjb21wLm9uRGlzYWJsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fb25EaXNhYmxlZChjb21wKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfc2NoZWR1bGVJbW1lZGlhdGUgKGNvbXApIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb21wLnN0YXJ0ID09PSAnZnVuY3Rpb24nICYmICEoY29tcC5fb2JqRmxhZ3MgJiBJc1N0YXJ0Q2FsbGVkKSkge1xuICAgICAgICAgICAgdGhpcy5zdGFydEludm9rZXIuYWRkKGNvbXApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgY29tcC51cGRhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSW52b2tlci5hZGQoY29tcCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBjb21wLmxhdGVVcGRhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMubGF0ZVVwZGF0ZUludm9rZXIuYWRkKGNvbXApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9kZWZlcnJlZFNjaGVkdWxlICgpIHtcbiAgICAgICAgdmFyIGNvbXBzID0gdGhpcy5fZGVmZXJyZWRDb21wcztcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvbXBzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9zY2hlZHVsZUltbWVkaWF0ZShjb21wc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgY29tcHMubGVuZ3RoID0gMDtcbiAgICB9LFxuXG4gICAgLy8gQ2FsbCBuZXcgcmVnaXN0ZXJlZCBzdGFydCBzY2hlZHVsZSBpbW1lZGlhdGVseSBzaW5jZSBsYXN0IHRpbWUgc3RhcnQgcGhhc2UgY2FsbGluZyBpbiB0aGlzIGZyYW1lXG4gICAgLy8gU2VlIGNvY29zLWNyZWF0b3IvMmQtdGFza3MvaXNzdWVzLzI1NlxuICAgIF9zdGFydEZvck5ld0NvbXBzICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2RlZmVycmVkQ29tcHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5fZGVmZXJyZWRTY2hlZHVsZSgpO1xuICAgICAgICAgICAgdGhpcy5zdGFydEludm9rZXIuaW52b2tlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RhcnRQaGFzZSAoKSB7XG4gICAgICAgIC8vIFN0YXJ0IG9mIHRoaXMgZnJhbWVcbiAgICAgICAgdGhpcy5fdXBkYXRpbmcgPSB0cnVlO1xuXG4gICAgICAgIC8vIGNhbGwgc3RhcnRcbiAgICAgICAgdGhpcy5zdGFydEludm9rZXIuaW52b2tlKCk7XG5cbiAgICAgICAgLy8gU3RhcnQgY29tcG9uZW50cyBvZiBuZXcgYWN0aXZhdGVkIG5vZGVzIGR1cmluZyBzdGFydFxuICAgICAgICB0aGlzLl9zdGFydEZvck5ld0NvbXBzKCk7XG5cbiAgICAgICAgLy8gaWYgKENDX1BSRVZJRVcpIHtcbiAgICAgICAgLy8gICAgIHRyeSB7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5zdGFydEludm9rZXIuaW52b2tlKCk7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vICAgICBjYXRjaCAoZSkge1xuICAgICAgICAvLyAgICAgICAgIC8vIHByZXZlbnQgc3RhcnQgZnJvbSBnZXR0aW5nIGludG8gaW5maW5pdGUgbG9vcFxuICAgICAgICAvLyAgICAgICAgIHRoaXMuc3RhcnRJbnZva2VyLl9uZWcuYXJyYXkubGVuZ3RoID0gMDtcbiAgICAgICAgLy8gICAgICAgICB0aGlzLnN0YXJ0SW52b2tlci5femVyby5hcnJheS5sZW5ndGggPSAwO1xuICAgICAgICAvLyAgICAgICAgIHRoaXMuc3RhcnRJbnZva2VyLl9wb3MuYXJyYXkubGVuZ3RoID0gMDtcbiAgICAgICAgLy8gICAgICAgICB0aHJvdyBlO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG4gICAgICAgIC8vIGVsc2Uge1xuICAgICAgICAvLyAgICAgdGhpcy5zdGFydEludm9rZXIuaW52b2tlKCk7XG4gICAgICAgIC8vIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlUGhhc2UgKGR0KSB7XG4gICAgICAgIHRoaXMudXBkYXRlSW52b2tlci5pbnZva2UoZHQpO1xuICAgIH0sXG5cbiAgICBsYXRlVXBkYXRlUGhhc2UgKGR0KSB7XG4gICAgICAgIHRoaXMubGF0ZVVwZGF0ZUludm9rZXIuaW52b2tlKGR0KTtcblxuICAgICAgICAvLyBFbmQgb2YgdGhpcyBmcmFtZVxuICAgICAgICB0aGlzLl91cGRhdGluZyA9IGZhbHNlO1xuXG4gICAgICAgIC8vIFN0YXJ0IGNvbXBvbmVudHMgb2YgbmV3IGFjdGl2YXRlZCBub2RlcyBkdXJpbmcgdXBkYXRlIGFuZCBsYXRlVXBkYXRlXG4gICAgICAgIC8vIFRoZSBzdGFydCBjYWxsYmFjayB3aWxsIGJlIGludm9rZWQgaW1tZWRpYXRlbHksXG4gICAgICAgIC8vIHVwZGF0ZSBhbmQgbGF0ZVVwZGF0ZSBjYWxsYmFjayB3aWxsIGJlIHJ1bm5pbmcgaW4gdGhlIG5leHQgZnJhbWVcbiAgICAgICAgdGhpcy5fc3RhcnRGb3JOZXdDb21wcygpO1xuICAgIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb21wb25lbnRTY2hlZHVsZXI7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==