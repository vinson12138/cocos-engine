
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/callbacks-invoker.js';
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
var js = require('./js');

var fastRemoveAt = js.array.fastRemoveAt;

function empty() {}

function CallbackInfo() {
  this.callback = empty;
  this.target = undefined;
  this.once = false;
}

CallbackInfo.prototype.set = function (callback, target, once) {
  this.callback = callback;
  this.target = target;
  this.once = !!once;
};

var callbackInfoPool = new js.Pool(function (info) {
  info.callback = empty;
  info.target = undefined;
  info.once = false;
  return true;
}, 32);

callbackInfoPool.get = function () {
  return this._get() || new CallbackInfo();
};

function CallbackList() {
  this.callbackInfos = [];
  this.isInvoking = false;
  this.containCanceled = false;
}

var proto = CallbackList.prototype;
/**
 * !#zh
 * 从列表中移除与指定目标相同回调函数的事件。
 * @param cb
 */

proto.removeByCallback = function (cb) {
  for (var i = 0; i < this.callbackInfos.length; ++i) {
    var info = this.callbackInfos[i];

    if (info && info.callback === cb) {
      callbackInfoPool.put(info);
      fastRemoveAt(this.callbackInfos, i);
      --i;
    }
  }
};
/**
 * !#zh
 * 从列表中移除与指定目标相同调用者的事件。
 * @param target
 */


proto.removeByTarget = function (target) {
  for (var i = 0; i < this.callbackInfos.length; ++i) {
    var info = this.callbackInfos[i];

    if (info && info.target === target) {
      callbackInfoPool.put(info);
      fastRemoveAt(this.callbackInfos, i);
      --i;
    }
  }
};
/**
 * !#zh
 * 移除指定编号事件。
 *
 * @param index
 */


proto.cancel = function (index) {
  var info = this.callbackInfos[index];

  if (info) {
    callbackInfoPool.put(info);
    this.callbackInfos[index] = null;
  }

  this.containCanceled = true;
};
/**
 * !#zh
 * 注销所有事件。
 */


proto.cancelAll = function () {
  for (var i = 0; i < this.callbackInfos.length; i++) {
    var info = this.callbackInfos[i];

    if (info) {
      callbackInfoPool.put(info);
      this.callbackInfos[i] = null;
    }
  }

  this.containCanceled = true;
}; // filter all removed callbacks and compact array


proto.purgeCanceled = function () {
  for (var i = this.callbackInfos.length - 1; i >= 0; --i) {
    var info = this.callbackInfos[i];

    if (!info) {
      fastRemoveAt(this.callbackInfos, i);
    }
  }

  this.containCanceled = false;
};

proto.clear = function () {
  this.cancelAll();
  this.callbackInfos.length = 0;
  this.isInvoking = false;
  this.containCanceled = false;
};

var MAX_SIZE = 16;
var callbackListPool = new js.Pool(function (info) {
  info.callbackInfos = [];
  info.isInvoking = false;
  info.containCanceled = false;
  return true;
}, MAX_SIZE);

callbackListPool.get = function () {
  return this._get() || new CallbackList();
};
/**
 * !#en The callbacks invoker to handle and invoke callbacks by key.
 * !#zh CallbacksInvoker 用来根据 Key 管理并调用回调方法。
 * @class CallbacksInvoker
 */


function CallbacksInvoker() {
  this._callbackTable = js.createMap(true);
}

proto = CallbacksInvoker.prototype;
/**
 * !#zh
 * 事件添加管理
 *
 * @param key
 * @param callback
 * @param target
 * @param once
 */

proto.on = function (key, callback, target, once) {
  var list = this._callbackTable[key];

  if (!list) {
    list = this._callbackTable[key] = callbackListPool.get();
  }

  var info = callbackInfoPool.get();
  info.set(callback, target, once);
  list.callbackInfos.push(info);
};
/**
 *
 * !#zh
 * 检查指定事件是否已注册回调。
 *
 * !#en
 * Check if the specified key has any registered callback. If a callback is also specified,
 * it will only return true if the callback is registered.
 *
 * @method hasEventListener
 * @param {String} key
 * @param {Function} [callback]
 * @param {Object} [target]
 * @return {Boolean}
 */


proto.hasEventListener = function (key, callback, target) {
  var list = this._callbackTable[key];

  if (!list) {
    return false;
  } // check any valid callback


  var infos = list.callbackInfos;

  if (!callback) {
    // Make sure no cancelled callbacks
    if (list.isInvoking) {
      for (var i = 0; i < infos.length; ++i) {
        if (infos[i]) {
          return true;
        }
      }

      return false;
    } else {
      return infos.length > 0;
    }
  }

  for (var _i = 0; _i < infos.length; ++_i) {
    var info = infos[_i];

    if (info && info.callback === callback && info.target === target) {
      return true;
    }
  }

  return false;
};
/**
 * !#zh
 * 移除在特定事件类型中注册的所有回调或在某个目标中注册的所有回调。
 *
 * !#en
 * Removes all callbacks registered in a certain event type or all callbacks registered with a certain target
 * @method removeAll
 * @param {String|Object} keyOrTarget - The event key to be removed or the target to be removed
 */


proto.removeAll = function (keyOrTarget) {
  if (typeof keyOrTarget === 'string') {
    // remove by key
    var list = this._callbackTable[keyOrTarget];

    if (list) {
      if (list.isInvoking) {
        list.cancelAll();
      } else {
        list.clear();
        callbackListPool.put(list);
        delete this._callbackTable[keyOrTarget];
      }
    }
  } else if (keyOrTarget) {
    // remove by target
    for (var key in this._callbackTable) {
      var _list = this._callbackTable[key];

      if (_list.isInvoking) {
        var infos = _list.callbackInfos;

        for (var i = 0; i < infos.length; ++i) {
          var info = infos[i];

          if (info && info.target === keyOrTarget) {
            _list.cancel(i);
          }
        }
      } else {
        _list.removeByTarget(keyOrTarget);
      }
    }
  }
};
/**
 * !#zh
 * 删除之前与同类型，回调，目标注册的回调。
 *
 * @method off
 * @param {String} key
 * @param {Function} callback
 * @param {Object} [target]
 */


proto.off = function (key, callback, target) {
  var list = this._callbackTable[key];

  if (list) {
    var infos = list.callbackInfos;

    for (var i = 0; i < infos.length; ++i) {
      var info = infos[i];

      if (info && info.callback === callback && info.target === target) {
        if (list.isInvoking) {
          list.cancel(i);
        } else {
          fastRemoveAt(infos, i);
          callbackInfoPool.put(info);
        }

        break;
      }
    }
  }
};
/**
 * !#en
 * Trigger an event directly with the event name and necessary arguments.
 * !#zh
 * 通过事件名发送自定义事件
 *
 * @method emit
 * @param {String} key - event type
 * @param {*} [arg1] - First argument
 * @param {*} [arg2] - Second argument
 * @param {*} [arg3] - Third argument
 * @param {*} [arg4] - Fourth argument
 * @param {*} [arg5] - Fifth argument
 * @example
 *
 * eventTarget.emit('fire', event);
 * eventTarget.emit('fire', message, emitter);
 */


proto.emit = function (key, arg1, arg2, arg3, arg4, arg5) {
  var list = this._callbackTable[key];

  if (list) {
    var rootInvoker = !list.isInvoking;
    list.isInvoking = true;
    var infos = list.callbackInfos;

    for (var i = 0, len = infos.length; i < len; ++i) {
      var info = infos[i];

      if (info) {
        var target = info.target;
        var callback = info.callback;

        if (info.once) {
          this.off(key, callback, target);
        }

        if (target) {
          callback.call(target, arg1, arg2, arg3, arg4, arg5);
        } else {
          callback(arg1, arg2, arg3, arg4, arg5);
        }
      }
    }

    if (rootInvoker) {
      list.isInvoking = false;

      if (list.containCanceled) {
        list.purgeCanceled();
      }
    }
  }
};

if (CC_TEST) {
  cc._Test.CallbacksInvoker = CallbacksInvoker;
}

module.exports = CallbacksInvoker;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BsYXRmb3JtL2NhbGxiYWNrcy1pbnZva2VyLmpzIl0sIm5hbWVzIjpbImpzIiwicmVxdWlyZSIsImZhc3RSZW1vdmVBdCIsImFycmF5IiwiZW1wdHkiLCJDYWxsYmFja0luZm8iLCJjYWxsYmFjayIsInRhcmdldCIsInVuZGVmaW5lZCIsIm9uY2UiLCJwcm90b3R5cGUiLCJzZXQiLCJjYWxsYmFja0luZm9Qb29sIiwiUG9vbCIsImluZm8iLCJnZXQiLCJfZ2V0IiwiQ2FsbGJhY2tMaXN0IiwiY2FsbGJhY2tJbmZvcyIsImlzSW52b2tpbmciLCJjb250YWluQ2FuY2VsZWQiLCJwcm90byIsInJlbW92ZUJ5Q2FsbGJhY2siLCJjYiIsImkiLCJsZW5ndGgiLCJwdXQiLCJyZW1vdmVCeVRhcmdldCIsImNhbmNlbCIsImluZGV4IiwiY2FuY2VsQWxsIiwicHVyZ2VDYW5jZWxlZCIsImNsZWFyIiwiTUFYX1NJWkUiLCJjYWxsYmFja0xpc3RQb29sIiwiQ2FsbGJhY2tzSW52b2tlciIsIl9jYWxsYmFja1RhYmxlIiwiY3JlYXRlTWFwIiwib24iLCJrZXkiLCJsaXN0IiwicHVzaCIsImhhc0V2ZW50TGlzdGVuZXIiLCJpbmZvcyIsInJlbW92ZUFsbCIsImtleU9yVGFyZ2V0Iiwib2ZmIiwiZW1pdCIsImFyZzEiLCJhcmcyIiwiYXJnMyIsImFyZzQiLCJhcmc1Iiwicm9vdEludm9rZXIiLCJsZW4iLCJjYWxsIiwiQ0NfVEVTVCIsImNjIiwiX1Rlc3QiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxNQUFELENB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QThDQyxJQUE5QztBQUNILFNBRkQsTUFHSztBQUNEOUMsVUFBQUEsUUFBUSxDQUFDMEMsSUFBRCxFQUFPQyxJQUFQLEVBQWFDLElBQWIsRUFBbUJDLElBQW5CLEVBQXlCQyxJQUF6QixDQUFSO0FBQ0g7QUFDSjtBQUNKOztBQUVELFFBQUlDLFdBQUosRUFBaUI7QUFDYmIsTUFBQUEsSUFBSSxDQUFDckIsVUFBTCxHQUFrQixLQUFsQjs7QUFDQSxVQUFJcUIsSUFBSSxDQUFDcEIsZUFBVCxFQUEwQjtBQUN0Qm9CLFFBQUFBLElBQUksQ0FBQ1QsYUFBTDtBQUNIO0FBQ0o7QUFDSjtBQUNKLENBaENEOztBQWtDQSxJQUFJeUIsT0FBSixFQUFhO0FBQ1RDLEVBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTdkIsZ0JBQVQsR0FBNEJBLGdCQUE1QjtBQUNIOztBQUVEd0IsTUFBTSxDQUFDQyxPQUFQLEdBQWlCekIsZ0JBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBqcyA9IHJlcXVpcmUoJy4vanMnKTtcbmNvbnN0IGZhc3RSZW1vdmVBdCA9IGpzLmFycmF5LmZhc3RSZW1vdmVBdDtcblxuZnVuY3Rpb24gZW1wdHkgKCkge31cblxuZnVuY3Rpb24gQ2FsbGJhY2tJbmZvICgpIHtcbiAgICB0aGlzLmNhbGxiYWNrID0gZW1wdHk7XG4gICAgdGhpcy50YXJnZXQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5vbmNlID0gZmFsc2U7XG59XG5cbkNhbGxiYWNrSW5mby5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGNhbGxiYWNrLCB0YXJnZXQsIG9uY2UpIHtcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgdGhpcy5vbmNlID0gISFvbmNlO1xufTtcblxubGV0IGNhbGxiYWNrSW5mb1Bvb2wgPSBuZXcganMuUG9vbChmdW5jdGlvbiAoaW5mbykge1xuICAgIGluZm8uY2FsbGJhY2sgPSBlbXB0eTtcbiAgICBpbmZvLnRhcmdldCA9IHVuZGVmaW5lZDtcbiAgICBpbmZvLm9uY2UgPSBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbn0sIDMyKTtcblxuY2FsbGJhY2tJbmZvUG9vbC5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldCgpIHx8IG5ldyBDYWxsYmFja0luZm8oKTtcbn07XG5cbmZ1bmN0aW9uIENhbGxiYWNrTGlzdCAoKSB7XG4gICAgdGhpcy5jYWxsYmFja0luZm9zID0gW107XG4gICAgdGhpcy5pc0ludm9raW5nID0gZmFsc2U7XG4gICAgdGhpcy5jb250YWluQ2FuY2VsZWQgPSBmYWxzZTtcbn1cblxubGV0IHByb3RvID0gQ2FsbGJhY2tMaXN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiAhI3poXG4gKiDku47liJfooajkuK3np7vpmaTkuI7mjIflrprnm67moIfnm7jlkIzlm57osIPlh73mlbDnmoTkuovku7bjgIJcbiAqIEBwYXJhbSBjYlxuICovXG5wcm90by5yZW1vdmVCeUNhbGxiYWNrID0gZnVuY3Rpb24gKGNiKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhbGxiYWNrSW5mb3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgbGV0IGluZm8gPSB0aGlzLmNhbGxiYWNrSW5mb3NbaV07XG4gICAgICAgIGlmIChpbmZvICYmIGluZm8uY2FsbGJhY2sgPT09IGNiKSB7XG4gICAgICAgICAgICBjYWxsYmFja0luZm9Qb29sLnB1dChpbmZvKTtcbiAgICAgICAgICAgIGZhc3RSZW1vdmVBdCh0aGlzLmNhbGxiYWNrSW5mb3MsIGkpO1xuICAgICAgICAgICAgLS1pO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiAhI3poXG4gKiDku47liJfooajkuK3np7vpmaTkuI7mjIflrprnm67moIfnm7jlkIzosIPnlKjogIXnmoTkuovku7bjgIJcbiAqIEBwYXJhbSB0YXJnZXRcbiAqL1xucHJvdG8ucmVtb3ZlQnlUYXJnZXQgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhbGxiYWNrSW5mb3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgaW5mbyA9IHRoaXMuY2FsbGJhY2tJbmZvc1tpXTtcbiAgICAgICAgaWYgKGluZm8gJiYgaW5mby50YXJnZXQgPT09IHRhcmdldCkge1xuICAgICAgICAgICAgY2FsbGJhY2tJbmZvUG9vbC5wdXQoaW5mbyk7XG4gICAgICAgICAgICBmYXN0UmVtb3ZlQXQodGhpcy5jYWxsYmFja0luZm9zLCBpKTtcbiAgICAgICAgICAgIC0taTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogISN6aFxuICog56e76Zmk5oyH5a6a57yW5Y+35LqL5Lu244CCXG4gKlxuICogQHBhcmFtIGluZGV4XG4gKi9cbnByb3RvLmNhbmNlbCA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgIGNvbnN0IGluZm8gPSB0aGlzLmNhbGxiYWNrSW5mb3NbaW5kZXhdO1xuICAgIGlmIChpbmZvKSB7XG4gICAgICAgIGNhbGxiYWNrSW5mb1Bvb2wucHV0KGluZm8pO1xuICAgICAgICB0aGlzLmNhbGxiYWNrSW5mb3NbaW5kZXhdID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5jb250YWluQ2FuY2VsZWQgPSB0cnVlO1xufTtcblxuLyoqXG4gKiAhI3poXG4gKiDms6jplIDmiYDmnInkuovku7bjgIJcbiAqL1xucHJvdG8uY2FuY2VsQWxsID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYWxsYmFja0luZm9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLmNhbGxiYWNrSW5mb3NbaV07XG4gICAgICAgIGlmIChpbmZvKSB7XG4gICAgICAgICAgICBjYWxsYmFja0luZm9Qb29sLnB1dChpbmZvKTtcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2tJbmZvc1tpXSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jb250YWluQ2FuY2VsZWQgPSB0cnVlO1xufTtcblxuLy8gZmlsdGVyIGFsbCByZW1vdmVkIGNhbGxiYWNrcyBhbmQgY29tcGFjdCBhcnJheVxucHJvdG8ucHVyZ2VDYW5jZWxlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKGxldCBpID0gdGhpcy5jYWxsYmFja0luZm9zLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLmNhbGxiYWNrSW5mb3NbaV07XG4gICAgICAgIGlmICghaW5mbykge1xuICAgICAgICAgICAgZmFzdFJlbW92ZUF0KHRoaXMuY2FsbGJhY2tJbmZvcywgaSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jb250YWluQ2FuY2VsZWQgPSBmYWxzZTtcbn07XG5cbnByb3RvLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuY2FuY2VsQWxsKCk7XG4gICAgdGhpcy5jYWxsYmFja0luZm9zLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5pc0ludm9raW5nID0gZmFsc2U7XG4gICAgdGhpcy5jb250YWluQ2FuY2VsZWQgPSBmYWxzZTtcbn07XG5cbmNvbnN0IE1BWF9TSVpFID0gMTY7XG5sZXQgY2FsbGJhY2tMaXN0UG9vbCA9IG5ldyBqcy5Qb29sKGZ1bmN0aW9uIChpbmZvKSB7XG4gICAgaW5mby5jYWxsYmFja0luZm9zID0gW107XG4gICAgaW5mby5pc0ludm9raW5nID0gZmFsc2U7XG4gICAgaW5mby5jb250YWluQ2FuY2VsZWQgPSBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbn0sIE1BWF9TSVpFKTtcblxuY2FsbGJhY2tMaXN0UG9vbC5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldCgpIHx8IG5ldyBDYWxsYmFja0xpc3QoKTtcbn07XG5cbi8qKlxuICogISNlbiBUaGUgY2FsbGJhY2tzIGludm9rZXIgdG8gaGFuZGxlIGFuZCBpbnZva2UgY2FsbGJhY2tzIGJ5IGtleS5cbiAqICEjemggQ2FsbGJhY2tzSW52b2tlciDnlKjmnaXmoLnmja4gS2V5IOeuoeeQhuW5tuiwg+eUqOWbnuiwg+aWueazleOAglxuICogQGNsYXNzIENhbGxiYWNrc0ludm9rZXJcbiAqL1xuZnVuY3Rpb24gQ2FsbGJhY2tzSW52b2tlciAoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tUYWJsZSA9IGpzLmNyZWF0ZU1hcCh0cnVlKTtcbn1cblxucHJvdG8gPSBDYWxsYmFja3NJbnZva2VyLnByb3RvdHlwZTtcblxuLyoqXG4gKiAhI3poXG4gKiDkuovku7bmt7vliqDnrqHnkIZcbiAqXG4gKiBAcGFyYW0ga2V5XG4gKiBAcGFyYW0gY2FsbGJhY2tcbiAqIEBwYXJhbSB0YXJnZXRcbiAqIEBwYXJhbSBvbmNlXG4gKi9cbnByb3RvLm9uID0gZnVuY3Rpb24gKGtleSwgY2FsbGJhY2ssIHRhcmdldCwgb25jZSkge1xuICAgIGxldCBsaXN0ID0gdGhpcy5fY2FsbGJhY2tUYWJsZVtrZXldO1xuICAgIGlmICghbGlzdCkge1xuICAgICAgICBsaXN0ID0gdGhpcy5fY2FsbGJhY2tUYWJsZVtrZXldID0gY2FsbGJhY2tMaXN0UG9vbC5nZXQoKTtcbiAgICB9XG4gICAgbGV0IGluZm8gPSBjYWxsYmFja0luZm9Qb29sLmdldCgpO1xuICAgIGluZm8uc2V0KGNhbGxiYWNrLCB0YXJnZXQsIG9uY2UpO1xuICAgIGxpc3QuY2FsbGJhY2tJbmZvcy5wdXNoKGluZm8pO1xufTtcblxuLyoqXG4gKlxuICogISN6aFxuICog5qOA5p+l5oyH5a6a5LqL5Lu25piv5ZCm5bey5rOo5YaM5Zue6LCD44CCXG4gKlxuICogISNlblxuICogQ2hlY2sgaWYgdGhlIHNwZWNpZmllZCBrZXkgaGFzIGFueSByZWdpc3RlcmVkIGNhbGxiYWNrLiBJZiBhIGNhbGxiYWNrIGlzIGFsc28gc3BlY2lmaWVkLFxuICogaXQgd2lsbCBvbmx5IHJldHVybiB0cnVlIGlmIHRoZSBjYWxsYmFjayBpcyByZWdpc3RlcmVkLlxuICpcbiAqIEBtZXRob2QgaGFzRXZlbnRMaXN0ZW5lclxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXVxuICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXRdXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5wcm90by5oYXNFdmVudExpc3RlbmVyID0gZnVuY3Rpb24gKGtleSwgY2FsbGJhY2ssIHRhcmdldCkge1xuICAgIGNvbnN0IGxpc3QgPSB0aGlzLl9jYWxsYmFja1RhYmxlW2tleV07XG4gICAgaWYgKCFsaXN0KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBhbnkgdmFsaWQgY2FsbGJhY2tcbiAgICBjb25zdCBpbmZvcyA9IGxpc3QuY2FsbGJhY2tJbmZvcztcbiAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSBubyBjYW5jZWxsZWQgY2FsbGJhY2tzXG4gICAgICAgIGlmIChsaXN0LmlzSW52b2tpbmcpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5mb3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5mb3NbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGluZm9zLmxlbmd0aCA+IDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluZm9zLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvbnN0IGluZm8gPSBpbmZvc1tpXTtcbiAgICAgICAgaWYgKGluZm8gJiYgaW5mby5jYWxsYmFjayA9PT0gY2FsbGJhY2sgJiYgaW5mby50YXJnZXQgPT09IHRhcmdldCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiAhI3poXG4gKiDnp7vpmaTlnKjnibnlrprkuovku7bnsbvlnovkuK3ms6jlhoznmoTmiYDmnInlm57osIPmiJblnKjmn5DkuKrnm67moIfkuK3ms6jlhoznmoTmiYDmnInlm57osIPjgIJcbiAqXG4gKiAhI2VuXG4gKiBSZW1vdmVzIGFsbCBjYWxsYmFja3MgcmVnaXN0ZXJlZCBpbiBhIGNlcnRhaW4gZXZlbnQgdHlwZSBvciBhbGwgY2FsbGJhY2tzIHJlZ2lzdGVyZWQgd2l0aCBhIGNlcnRhaW4gdGFyZ2V0XG4gKiBAbWV0aG9kIHJlbW92ZUFsbFxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBrZXlPclRhcmdldCAtIFRoZSBldmVudCBrZXkgdG8gYmUgcmVtb3ZlZCBvciB0aGUgdGFyZ2V0IHRvIGJlIHJlbW92ZWRcbiAqL1xucHJvdG8ucmVtb3ZlQWxsID0gZnVuY3Rpb24gKGtleU9yVGFyZ2V0KSB7XG4gICAgaWYgKHR5cGVvZiBrZXlPclRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgLy8gcmVtb3ZlIGJ5IGtleVxuICAgICAgICBjb25zdCBsaXN0ID0gdGhpcy5fY2FsbGJhY2tUYWJsZVtrZXlPclRhcmdldF07XG4gICAgICAgIGlmIChsaXN0KSB7XG4gICAgICAgICAgICBpZiAobGlzdC5pc0ludm9raW5nKSB7XG4gICAgICAgICAgICAgICAgbGlzdC5jYW5jZWxBbGwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxpc3QuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFja0xpc3RQb29sLnB1dChsaXN0KTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tUYWJsZVtrZXlPclRhcmdldF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoa2V5T3JUYXJnZXQpIHtcbiAgICAgICAgLy8gcmVtb3ZlIGJ5IHRhcmdldFxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLl9jYWxsYmFja1RhYmxlKSB7XG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gdGhpcy5fY2FsbGJhY2tUYWJsZVtrZXldO1xuICAgICAgICAgICAgaWYgKGxpc3QuaXNJbnZva2luZykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZm9zID0gbGlzdC5jYWxsYmFja0luZm9zO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5mb3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5mbyA9IGluZm9zW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5mbyAmJiBpbmZvLnRhcmdldCA9PT0ga2V5T3JUYXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QuY2FuY2VsKGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGlzdC5yZW1vdmVCeVRhcmdldChrZXlPclRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqICEjemhcbiAqIOWIoOmZpOS5i+WJjeS4juWQjOexu+Wei++8jOWbnuiwg++8jOebruagh+azqOWGjOeahOWbnuiwg+OAglxuICpcbiAqIEBtZXRob2Qgb2ZmXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXRdXG4gKi9cbnByb3RvLm9mZiA9IGZ1bmN0aW9uIChrZXksIGNhbGxiYWNrLCB0YXJnZXQpIHtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5fY2FsbGJhY2tUYWJsZVtrZXldO1xuICAgIGlmIChsaXN0KSB7XG4gICAgICAgIGNvbnN0IGluZm9zID0gbGlzdC5jYWxsYmFja0luZm9zO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluZm9zLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBpbmZvID0gaW5mb3NbaV07XG4gICAgICAgICAgICBpZiAoaW5mbyAmJiBpbmZvLmNhbGxiYWNrID09PSBjYWxsYmFjayAmJiBpbmZvLnRhcmdldCA9PT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpc3QuaXNJbnZva2luZykge1xuICAgICAgICAgICAgICAgICAgICBsaXN0LmNhbmNlbChpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZhc3RSZW1vdmVBdChpbmZvcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrSW5mb1Bvb2wucHV0KGluZm8pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuLyoqXG4gKiAhI2VuXG4gKiBUcmlnZ2VyIGFuIGV2ZW50IGRpcmVjdGx5IHdpdGggdGhlIGV2ZW50IG5hbWUgYW5kIG5lY2Vzc2FyeSBhcmd1bWVudHMuXG4gKiAhI3poXG4gKiDpgJrov4fkuovku7blkI3lj5HpgIHoh6rlrprkuYnkuovku7ZcbiAqXG4gKiBAbWV0aG9kIGVtaXRcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgLSBldmVudCB0eXBlXG4gKiBAcGFyYW0geyp9IFthcmcxXSAtIEZpcnN0IGFyZ3VtZW50XG4gKiBAcGFyYW0geyp9IFthcmcyXSAtIFNlY29uZCBhcmd1bWVudFxuICogQHBhcmFtIHsqfSBbYXJnM10gLSBUaGlyZCBhcmd1bWVudFxuICogQHBhcmFtIHsqfSBbYXJnNF0gLSBGb3VydGggYXJndW1lbnRcbiAqIEBwYXJhbSB7Kn0gW2FyZzVdIC0gRmlmdGggYXJndW1lbnRcbiAqIEBleGFtcGxlXG4gKlxuICogZXZlbnRUYXJnZXQuZW1pdCgnZmlyZScsIGV2ZW50KTtcbiAqIGV2ZW50VGFyZ2V0LmVtaXQoJ2ZpcmUnLCBtZXNzYWdlLCBlbWl0dGVyKTtcbiAqL1xucHJvdG8uZW1pdCA9IGZ1bmN0aW9uIChrZXksIGFyZzEsIGFyZzIsIGFyZzMsIGFyZzQsIGFyZzUpIHtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5fY2FsbGJhY2tUYWJsZVtrZXldO1xuICAgIGlmIChsaXN0KSB7XG4gICAgICAgIGNvbnN0IHJvb3RJbnZva2VyID0gIWxpc3QuaXNJbnZva2luZztcbiAgICAgICAgbGlzdC5pc0ludm9raW5nID0gdHJ1ZTtcblxuICAgICAgICBjb25zdCBpbmZvcyA9IGxpc3QuY2FsbGJhY2tJbmZvcztcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGluZm9zLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBpbmZvID0gaW5mb3NbaV07XG4gICAgICAgICAgICBpZiAoaW5mbykge1xuICAgICAgICAgICAgICAgIGxldCB0YXJnZXQgPSBpbmZvLnRhcmdldDtcbiAgICAgICAgICAgICAgICBsZXQgY2FsbGJhY2sgPSBpbmZvLmNhbGxiYWNrO1xuICAgICAgICAgICAgICAgIGlmIChpbmZvLm9uY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vZmYoa2V5LCBjYWxsYmFjaywgdGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGFyZ2V0LCBhcmcxLCBhcmcyLCBhcmczLCBhcmc0LCBhcmc1KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGFyZzEsIGFyZzIsIGFyZzMsIGFyZzQsIGFyZzUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyb290SW52b2tlcikge1xuICAgICAgICAgICAgbGlzdC5pc0ludm9raW5nID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAobGlzdC5jb250YWluQ2FuY2VsZWQpIHtcbiAgICAgICAgICAgICAgICBsaXN0LnB1cmdlQ2FuY2VsZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmlmIChDQ19URVNUKSB7XG4gICAgY2MuX1Rlc3QuQ2FsbGJhY2tzSW52b2tlciA9IENhbGxiYWNrc0ludm9rZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FsbGJhY2tzSW52b2tlcjtcbiJdLCJzb3VyY2VSb290IjoiLyJ9