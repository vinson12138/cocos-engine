
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/event-manager/CCEventManager.js';
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
var js = require('../platform/js');

require('./CCEventListener');

var ListenerID = cc.EventListener.ListenerID;

var _EventListenerVector = function _EventListenerVector() {
  this._fixedListeners = [];
  this._sceneGraphListeners = [];
  this.gt0Index = 0;
};

_EventListenerVector.prototype = {
  constructor: _EventListenerVector,
  size: function size() {
    return this._fixedListeners.length + this._sceneGraphListeners.length;
  },
  empty: function empty() {
    return this._fixedListeners.length === 0 && this._sceneGraphListeners.length === 0;
  },
  push: function push(listener) {
    if (listener._getFixedPriority() === 0) this._sceneGraphListeners.push(listener);else this._fixedListeners.push(listener);
  },
  clearSceneGraphListeners: function clearSceneGraphListeners() {
    this._sceneGraphListeners.length = 0;
  },
  clearFixedListeners: function clearFixedListeners() {
    this._fixedListeners.length = 0;
  },
  clear: function clear() {
    this._sceneGraphListeners.length = 0;
    this._fixedListeners.length = 0;
  },
  getFixedPriorityListeners: function getFixedPriorityListeners() {
    return this._fixedListeners;
  },
  getSceneGraphPriorityListeners: function getSceneGraphPriorityListeners() {
    return this._sceneGraphListeners;
  }
};

var __getListenerID = function __getListenerID(event) {
  var eventType = cc.Event,
      type = event.type;
  if (type === eventType.ACCELERATION) return ListenerID.ACCELERATION;
  if (type === eventType.KEYBOARD) return ListenerID.KEYBOARD;
  if (type.startsWith(eventType.MOUSE)) return ListenerID.MOUSE;

  if (type.startsWith(eventType.TOUCH)) {
    // Touch listener is very special, it contains two kinds of listeners, EventListenerTouchOneByOne and EventListenerTouchAllAtOnce.
    // return UNKNOWN instead.
    cc.logID(2000);
  }

  return "";
};
/**
 * !#en
 * This class has been deprecated, please use cc.systemEvent or cc.EventTarget instead. See [Listen to and launch events](../../../manual/en/scripting/events.html) for details.<br>
 * <br>
 * cc.eventManager is a singleton object which manages event listener subscriptions and event dispatching.
 * The EventListener list is managed in such way so that event listeners can be added and removed
 * while events are being dispatched.
 *
 * !#zh
 * 该类已废弃，请使用 cc.systemEvent 或 cc.EventTarget 代替，详见 [监听和发射事件](../../../manual/zh/scripting/events.html)。<br>
 * <br>
 * 事件管理器，它主要管理事件监听器注册和派发系统事件。
 *
 * @class eventManager
 * @static
 * @example {@link cocos2d/core/event-manager/CCEventManager/addListener.js}
 * @deprecated
 */


var eventManager = {
  //Priority dirty flag
  DIRTY_NONE: 0,
  DIRTY_FIXED_PRIORITY: 1 << 0,
  DIRTY_SCENE_GRAPH_PRIORITY: 1 << 1,
  DIRTY_ALL: 3,
  _listenersMap: {},
  _priorityDirtyFlagMap: {},
  _nodeListenersMap: {},
  _toAddedListeners: [],
  _toRemovedListeners: [],
  _dirtyListeners: {},
  _inDispatch: 0,
  _isEnabled: false,
  _currentTouch: null,
  _currentTouchListener: null,
  _internalCustomListenerIDs: [],
  _setDirtyForNode: function _setDirtyForNode(node) {
    // Mark the node dirty only when there is an event listener associated with it.
    var selListeners = this._nodeListenersMap[node._id];

    if (selListeners !== undefined) {
      for (var j = 0, len = selListeners.length; j < len; j++) {
        var selListener = selListeners[j];

        var listenerID = selListener._getListenerID();

        if (this._dirtyListeners[listenerID] == null) this._dirtyListeners[listenerID] = true;
      }
    }

    if (node.childrenCount > 0) {
      var children = node._children;

      for (var i = 0, _len = children.length; i < _len; i++) {
        this._setDirtyForNode(children[i]);
      }
    }
  },

  /**
   * !#en Pauses all listeners which are associated the specified target.
   * !#zh 暂停传入的 node 相关的所有监听器的事件响应。
   * @method pauseTarget
   * @param {Node} node
   * @param {Boolean} [recursive=false]
   */
  pauseTarget: function pauseTarget(node, recursive) {
    if (!(node instanceof cc._BaseNode)) {
      cc.warnID(3506);
      return;
    }

    var listeners = this._nodeListenersMap[node._id],
        i,
        len;

    if (listeners) {
      for (i = 0, len = listeners.length; i < len; i++) {
        listeners[i]._setPaused(true);
      }
    }

    if (recursive === true) {
      var locChildren = node._children;

      for (i = 0, len = locChildren ? locChildren.length : 0; i < len; i++) {
        this.pauseTarget(locChildren[i], true);
      }
    }
  },

  /**
   * !#en Resumes all listeners which are associated the specified target.
   * !#zh 恢复传入的 node 相关的所有监听器的事件响应。
   * @method resumeTarget
   * @param {Node} node
   * @param {Boolean} [recursive=false]
   */
  resumeTarget: function resumeTarget(node, recursive) {
    if (!(node instanceof cc._BaseNode)) {
      cc.warnID(3506);
      return;
    }

    var listeners = this._nodeListenersMap[node._id],
        i,
        len;

    if (listeners) {
      for (i = 0, len = listeners.length; i < len; i++) {
        listeners[i]._setPaused(false);
      }
    }

    this._setDirtyForNode(node);

    if (recursive === true) {
      var locChildren = node._children;

      for (i = 0, len = locChildren ? locChildren.length : 0; i < len; i++) {
        this.resumeTarget(locChildren[i], true);
      }
    }
  },
  _addListener: function _addListener(listener) {
    if (this._inDispatch === 0) this._forceAddEventListener(listener);else this._toAddedListeners.push(listener);
  },
  _forceAddEventListener: function _forceAddEventListener(listener) {
    var listenerID = listener._getListenerID();

    var listeners = this._listenersMap[listenerID];

    if (!listeners) {
      listeners = new _EventListenerVector();
      this._listenersMap[listenerID] = listeners;
    }

    listeners.push(listener);

    if (listener._getFixedPriority() === 0) {
      this._setDirty(listenerID, this.DIRTY_SCENE_GRAPH_PRIORITY);

      var node = listener._getSceneGraphPriority();

      if (node === null) cc.logID(3507);

      this._associateNodeAndEventListener(node, listener);

      if (node.activeInHierarchy) this.resumeTarget(node);
    } else this._setDirty(listenerID, this.DIRTY_FIXED_PRIORITY);
  },
  _getListeners: function _getListeners(listenerID) {
    return this._listenersMap[listenerID];
  },
  _updateDirtyFlagForSceneGraph: function _updateDirtyFlagForSceneGraph() {
    var locDirtyListeners = this._dirtyListeners;

    for (var selKey in locDirtyListeners) {
      this._setDirty(selKey, this.DIRTY_SCENE_GRAPH_PRIORITY);
    }

    this._dirtyListeners = {};
  },
  _removeAllListenersInVector: function _removeAllListenersInVector(listenerVector) {
    if (!listenerVector) return;
    var selListener;

    for (var i = listenerVector.length - 1; i >= 0; i--) {
      selListener = listenerVector[i];

      selListener._setRegistered(false);

      if (selListener._getSceneGraphPriority() != null) {
        this._dissociateNodeAndEventListener(selListener._getSceneGraphPriority(), selListener);

        selListener._setSceneGraphPriority(null); // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.

      }

      if (this._inDispatch === 0) cc.js.array.removeAt(listenerVector, i);
    }
  },
  _removeListenersForListenerID: function _removeListenersForListenerID(listenerID) {
    var listeners = this._listenersMap[listenerID],
        i;

    if (listeners) {
      var fixedPriorityListeners = listeners.getFixedPriorityListeners();
      var sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();

      this._removeAllListenersInVector(sceneGraphPriorityListeners);

      this._removeAllListenersInVector(fixedPriorityListeners); // Remove the dirty flag according the 'listenerID'.
      // No need to check whether the dispatcher is dispatching event.


      delete this._priorityDirtyFlagMap[listenerID];

      if (!this._inDispatch) {
        listeners.clear();
        delete this._listenersMap[listenerID];
      }
    }

    var locToAddedListeners = this._toAddedListeners,
        listener;

    for (i = locToAddedListeners.length - 1; i >= 0; i--) {
      listener = locToAddedListeners[i];
      if (listener && listener._getListenerID() === listenerID) cc.js.array.removeAt(locToAddedListeners, i);
    }
  },
  _sortEventListeners: function _sortEventListeners(listenerID) {
    var dirtyFlag = this.DIRTY_NONE,
        locFlagMap = this._priorityDirtyFlagMap;
    if (locFlagMap[listenerID]) dirtyFlag = locFlagMap[listenerID];

    if (dirtyFlag !== this.DIRTY_NONE) {
      // Clear the dirty flag first, if `rootNode` is null, then set its dirty flag of scene graph priority
      locFlagMap[listenerID] = this.DIRTY_NONE;
      if (dirtyFlag & this.DIRTY_FIXED_PRIORITY) this._sortListenersOfFixedPriority(listenerID);

      if (dirtyFlag & this.DIRTY_SCENE_GRAPH_PRIORITY) {
        var rootEntity = cc.director.getScene();
        if (rootEntity) this._sortListenersOfSceneGraphPriority(listenerID);
      }
    }
  },
  _sortListenersOfSceneGraphPriority: function _sortListenersOfSceneGraphPriority(listenerID) {
    var listeners = this._getListeners(listenerID);

    if (!listeners) return;
    var sceneGraphListener = listeners.getSceneGraphPriorityListeners();
    if (!sceneGraphListener || sceneGraphListener.length === 0) return; // After sort: priority < 0, > 0

    listeners.getSceneGraphPriorityListeners().sort(this._sortEventListenersOfSceneGraphPriorityDes);
  },
  _sortEventListenersOfSceneGraphPriorityDes: function _sortEventListenersOfSceneGraphPriorityDes(l1, l2) {
    var node1 = l1._getSceneGraphPriority(),
        node2 = l2._getSceneGraphPriority();

    if (!l2 || !node2 || !node2._activeInHierarchy || node2._parent === null) return -1;else if (!l1 || !node1 || !node1._activeInHierarchy || node1._parent === null) return 1;
    var p1 = node1,
        p2 = node2,
        ex = false;

    while (p1._parent._id !== p2._parent._id) {
      p1 = p1._parent._parent === null ? (ex = true) && node2 : p1._parent;
      p2 = p2._parent._parent === null ? (ex = true) && node1 : p2._parent;
    }

    if (p1._id === p2._id) {
      if (p1._id === node2._id) return -1;
      if (p1._id === node1._id) return 1;
    }

    return ex ? p1._localZOrder - p2._localZOrder : p2._localZOrder - p1._localZOrder;
  },
  _sortListenersOfFixedPriority: function _sortListenersOfFixedPriority(listenerID) {
    var listeners = this._listenersMap[listenerID];
    if (!listeners) return;
    var fixedListeners = listeners.getFixedPriorityListeners();
    if (!fixedListeners || fixedListeners.length === 0) return; // After sort: priority < 0, > 0

    fixedListeners.sort(this._sortListenersOfFixedPriorityAsc); // FIXME: Should use binary search

    var index = 0;

    for (var len = fixedListeners.length; index < len;) {
      if (fixedListeners[index]._getFixedPriority() >= 0) break;
      ++index;
    }

    listeners.gt0Index = index;
  },
  _sortListenersOfFixedPriorityAsc: function _sortListenersOfFixedPriorityAsc(l1, l2) {
    return l1._getFixedPriority() - l2._getFixedPriority();
  },
  _onUpdateListeners: function _onUpdateListeners(listeners) {
    var fixedPriorityListeners = listeners.getFixedPriorityListeners();
    var sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();
    var i,
        selListener,
        idx,
        toRemovedListeners = this._toRemovedListeners;

    if (sceneGraphPriorityListeners) {
      for (i = sceneGraphPriorityListeners.length - 1; i >= 0; i--) {
        selListener = sceneGraphPriorityListeners[i];

        if (!selListener._isRegistered()) {
          cc.js.array.removeAt(sceneGraphPriorityListeners, i); // if item in toRemove list, remove it from the list

          idx = toRemovedListeners.indexOf(selListener);
          if (idx !== -1) toRemovedListeners.splice(idx, 1);
        }
      }
    }

    if (fixedPriorityListeners) {
      for (i = fixedPriorityListeners.length - 1; i >= 0; i--) {
        selListener = fixedPriorityListeners[i];

        if (!selListener._isRegistered()) {
          cc.js.array.removeAt(fixedPriorityListeners, i); // if item in toRemove list, remove it from the list

          idx = toRemovedListeners.indexOf(selListener);
          if (idx !== -1) toRemovedListeners.splice(idx, 1);
        }
      }
    }

    if (sceneGraphPriorityListeners && sceneGraphPriorityListeners.length === 0) listeners.clearSceneGraphListeners();
    if (fixedPriorityListeners && fixedPriorityListeners.length === 0) listeners.clearFixedListeners();
  },
  frameUpdateListeners: function frameUpdateListeners() {
    var locListenersMap = this._listenersMap,
        locPriorityDirtyFlagMap = this._priorityDirtyFlagMap;

    for (var selKey in locListenersMap) {
      if (locListenersMap[selKey].empty()) {
        delete locPriorityDirtyFlagMap[selKey];
        delete locListenersMap[selKey];
      }
    }

    var locToAddedListeners = this._toAddedListeners;

    if (locToAddedListeners.length !== 0) {
      for (var i = 0, len = locToAddedListeners.length; i < len; i++) {
        this._forceAddEventListener(locToAddedListeners[i]);
      }

      locToAddedListeners.length = 0;
    }

    if (this._toRemovedListeners.length !== 0) {
      this._cleanToRemovedListeners();
    }
  },
  _updateTouchListeners: function _updateTouchListeners(event) {
    var locInDispatch = this._inDispatch;
    cc.assertID(locInDispatch > 0, 3508);
    if (locInDispatch > 1) return;
    var listeners;
    listeners = this._listenersMap[ListenerID.TOUCH_ONE_BY_ONE];

    if (listeners) {
      this._onUpdateListeners(listeners);
    }

    listeners = this._listenersMap[ListenerID.TOUCH_ALL_AT_ONCE];

    if (listeners) {
      this._onUpdateListeners(listeners);
    }

    cc.assertID(locInDispatch === 1, 3509);
    var locToAddedListeners = this._toAddedListeners;

    if (locToAddedListeners.length !== 0) {
      for (var i = 0, len = locToAddedListeners.length; i < len; i++) {
        this._forceAddEventListener(locToAddedListeners[i]);
      }

      this._toAddedListeners.length = 0;
    }

    if (this._toRemovedListeners.length !== 0) {
      this._cleanToRemovedListeners();
    }
  },
  //Remove all listeners in _toRemoveListeners list and cleanup
  _cleanToRemovedListeners: function _cleanToRemovedListeners() {
    var toRemovedListeners = this._toRemovedListeners;

    for (var i = 0; i < toRemovedListeners.length; i++) {
      var selListener = toRemovedListeners[i];

      var listeners = this._listenersMap[selListener._getListenerID()];

      if (!listeners) continue;
      var idx,
          fixedPriorityListeners = listeners.getFixedPriorityListeners(),
          sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();

      if (sceneGraphPriorityListeners) {
        idx = sceneGraphPriorityListeners.indexOf(selListener);

        if (idx !== -1) {
          sceneGraphPriorityListeners.splice(idx, 1);
        }
      }

      if (fixedPriorityListeners) {
        idx = fixedPriorityListeners.indexOf(selListener);

        if (idx !== -1) {
          fixedPriorityListeners.splice(idx, 1);
        }
      }
    }

    toRemovedListeners.length = 0;
  },
  _onTouchEventCallback: function _onTouchEventCallback(listener, argsObj) {
    // Skip if the listener was removed.
    if (!listener._isRegistered()) return false;
    var event = argsObj.event,
        selTouch = event.currentTouch;
    event.currentTarget = listener._node;
    var isClaimed = false,
        removedIdx;
    var getCode = event.getEventCode(),
        EventTouch = cc.Event.EventTouch;

    if (getCode === EventTouch.BEGAN) {
      if (!cc.macro.ENABLE_MULTI_TOUCH && eventManager._currentTouch) {
        var node = eventManager._currentTouchListener._node;

        if (node && node.activeInHierarchy) {
          return false;
        }
      }

      if (listener.onTouchBegan) {
        isClaimed = listener.onTouchBegan(selTouch, event);

        if (isClaimed && listener._registered) {
          listener._claimedTouches.push(selTouch);

          eventManager._currentTouchListener = listener;
          eventManager._currentTouch = selTouch;
        }
      }
    } else if (listener._claimedTouches.length > 0 && (removedIdx = listener._claimedTouches.indexOf(selTouch)) !== -1) {
      isClaimed = true;

      if (!cc.macro.ENABLE_MULTI_TOUCH && eventManager._currentTouch && eventManager._currentTouch !== selTouch) {
        return false;
      }

      if (getCode === EventTouch.MOVED && listener.onTouchMoved) {
        listener.onTouchMoved(selTouch, event);
      } else if (getCode === EventTouch.ENDED) {
        if (listener.onTouchEnded) listener.onTouchEnded(selTouch, event);
        if (listener._registered) listener._claimedTouches.splice(removedIdx, 1);

        eventManager._clearCurTouch();
      } else if (getCode === EventTouch.CANCELED) {
        if (listener.onTouchCancelled) listener.onTouchCancelled(selTouch, event);
        if (listener._registered) listener._claimedTouches.splice(removedIdx, 1);

        eventManager._clearCurTouch();
      }
    } // If the event was stopped, return directly.


    if (event.isStopped()) {
      eventManager._updateTouchListeners(event);

      return true;
    }

    if (isClaimed && listener.swallowTouches) {
      if (argsObj.needsMutableSet) argsObj.touches.splice(selTouch, 1);
      return true;
    }

    return false;
  },
  _dispatchTouchEvent: function _dispatchTouchEvent(event) {
    this._sortEventListeners(ListenerID.TOUCH_ONE_BY_ONE);

    this._sortEventListeners(ListenerID.TOUCH_ALL_AT_ONCE);

    var oneByOneListeners = this._getListeners(ListenerID.TOUCH_ONE_BY_ONE);

    var allAtOnceListeners = this._getListeners(ListenerID.TOUCH_ALL_AT_ONCE); // If there aren't any touch listeners, return directly.


    if (null === oneByOneListeners && null === allAtOnceListeners) return;
    var originalTouches = event.getTouches(),
        mutableTouches = cc.js.array.copy(originalTouches);
    var oneByOneArgsObj = {
      event: event,
      needsMutableSet: oneByOneListeners && allAtOnceListeners,
      touches: mutableTouches,
      selTouch: null
    }; //
    // process the target handlers 1st
    //

    if (oneByOneListeners) {
      for (var i = 0; i < originalTouches.length; i++) {
        event.currentTouch = originalTouches[i];
        event._propagationStopped = event._propagationImmediateStopped = false;

        this._dispatchEventToListeners(oneByOneListeners, this._onTouchEventCallback, oneByOneArgsObj);
      }
    } //
    // process standard handlers 2nd
    //


    if (allAtOnceListeners && mutableTouches.length > 0) {
      this._dispatchEventToListeners(allAtOnceListeners, this._onTouchesEventCallback, {
        event: event,
        touches: mutableTouches
      });

      if (event.isStopped()) return;
    }

    this._updateTouchListeners(event);
  },
  _onTouchesEventCallback: function _onTouchesEventCallback(listener, callbackParams) {
    // Skip if the listener was removed.
    if (!listener._registered) return false;
    var EventTouch = cc.Event.EventTouch,
        event = callbackParams.event,
        touches = callbackParams.touches,
        getCode = event.getEventCode();
    event.currentTarget = listener._node;
    if (getCode === EventTouch.BEGAN && listener.onTouchesBegan) listener.onTouchesBegan(touches, event);else if (getCode === EventTouch.MOVED && listener.onTouchesMoved) listener.onTouchesMoved(touches, event);else if (getCode === EventTouch.ENDED && listener.onTouchesEnded) listener.onTouchesEnded(touches, event);else if (getCode === EventTouch.CANCELED && listener.onTouchesCancelled) listener.onTouchesCancelled(touches, event); // If the event was stopped, return directly.

    if (event.isStopped()) {
      eventManager._updateTouchListeners(event);

      return true;
    }

    return false;
  },
  _associateNodeAndEventListener: function _associateNodeAndEventListener(node, listener) {
    var listeners = this._nodeListenersMap[node._id];

    if (!listeners) {
      listeners = [];
      this._nodeListenersMap[node._id] = listeners;
    }

    listeners.push(listener);
  },
  _dissociateNodeAndEventListener: function _dissociateNodeAndEventListener(node, listener) {
    var listeners = this._nodeListenersMap[node._id];

    if (listeners) {
      cc.js.array.remove(listeners, listener);
      if (listeners.length === 0) delete this._nodeListenersMap[node._id];
    }
  },
  _dispatchEventToListeners: function _dispatchEventToListeners(listeners, onEvent, eventOrArgs) {
    var shouldStopPropagation = false;
    var fixedPriorityListeners = listeners.getFixedPriorityListeners();
    var sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();
    var i = 0,
        j,
        selListener;

    if (fixedPriorityListeners) {
      // priority < 0
      if (fixedPriorityListeners.length !== 0) {
        for (; i < listeners.gt0Index; ++i) {
          selListener = fixedPriorityListeners[i];

          if (selListener.isEnabled() && !selListener._isPaused() && selListener._isRegistered() && onEvent(selListener, eventOrArgs)) {
            shouldStopPropagation = true;
            break;
          }
        }
      }
    }

    if (sceneGraphPriorityListeners && !shouldStopPropagation) {
      // priority == 0, scene graph priority
      for (j = 0; j < sceneGraphPriorityListeners.length; j++) {
        selListener = sceneGraphPriorityListeners[j];

        if (selListener.isEnabled() && !selListener._isPaused() && selListener._isRegistered() && onEvent(selListener, eventOrArgs)) {
          shouldStopPropagation = true;
          break;
        }
      }
    }

    if (fixedPriorityListeners && !shouldStopPropagation) {
      // priority > 0
      for (; i < fixedPriorityListeners.length; ++i) {
        selListener = fixedPriorityListeners[i];

        if (selListener.isEnabled() && !selListener._isPaused() && selListener._isRegistered() && onEvent(selListener, eventOrArgs)) {
          shouldStopPropagation = true;
          break;
        }
      }
    }
  },
  _setDirty: function _setDirty(listenerID, flag) {
    var locDirtyFlagMap = this._priorityDirtyFlagMap;
    if (locDirtyFlagMap[listenerID] == null) locDirtyFlagMap[listenerID] = flag;else locDirtyFlagMap[listenerID] = flag | locDirtyFlagMap[listenerID];
  },
  _sortNumberAsc: function _sortNumberAsc(a, b) {
    return a - b;
  },

  /**
   * !#en Query whether the specified event listener id has been added.
   * !#zh 查询指定的事件 ID 是否存在
   * @method hasEventListener
   * @param {String|Number} listenerID - The listener id.
   * @return {Boolean} true or false
   */
  hasEventListener: function hasEventListener(listenerID) {
    return !!this._getListeners(listenerID);
  },

  /**
   * !#en
   * <p>
   * Adds a event listener for a specified event.<br/>
   * if the parameter "nodeOrPriority" is a node,
   * it means to add a event listener for a specified event with the priority of scene graph.<br/>
   * if the parameter "nodeOrPriority" is a Number,
   * it means to add a event listener for a specified event with the fixed priority.<br/>
   * </p>
   * !#zh
   * 将事件监听器添加到事件管理器中。<br/>
   * 如果参数 “nodeOrPriority” 是节点，优先级由 node 的渲染顺序决定，显示在上层的节点将优先收到事件。<br/>
   * 如果参数 “nodeOrPriority” 是数字，优先级则固定为该参数的数值，数字越小，优先级越高。<br/>
   *
   * @method addListener
   * @param {EventListener|Object} listener - The listener of a specified event or a object of some event parameters.
   * @param {Node|Number} nodeOrPriority - The priority of the listener is based on the draw order of this node or fixedPriority The fixed priority of the listener.
   * @note  The priority of scene graph will be fixed value 0. So the order of listener item in the vector will be ' <0, scene graph (0 priority), >0'.
   *         A lower priority will be called before the ones that have a higher value. 0 priority is forbidden for fixed priority since it's used for scene graph based priority.
   *         The listener must be a cc.EventListener object when adding a fixed priority listener, because we can't remove a fixed priority listener without the listener handler,
   *         except calls removeAllListeners().
   * @return {EventListener} Return the listener. Needed in order to remove the event from the dispatcher.
   */
  addListener: function addListener(listener, nodeOrPriority) {
    cc.assertID(listener && nodeOrPriority, 3503);

    if (!(cc.js.isNumber(nodeOrPriority) || nodeOrPriority instanceof cc._BaseNode)) {
      cc.warnID(3506);
      return;
    }

    if (!(listener instanceof cc.EventListener)) {
      cc.assertID(!cc.js.isNumber(nodeOrPriority), 3504);
      listener = cc.EventListener.create(listener);
    } else {
      if (listener._isRegistered()) {
        cc.logID(3505);
        return;
      }
    }

    if (!listener.checkAvailable()) return;

    if (cc.js.isNumber(nodeOrPriority)) {
      if (nodeOrPriority === 0) {
        cc.logID(3500);
        return;
      }

      listener._setSceneGraphPriority(null);

      listener._setFixedPriority(nodeOrPriority);

      listener._setRegistered(true);

      listener._setPaused(false);

      this._addListener(listener);
    } else {
      listener._setSceneGraphPriority(nodeOrPriority);

      listener._setFixedPriority(0);

      listener._setRegistered(true);

      this._addListener(listener);
    }

    return listener;
  },

  /*
   * !#en Adds a Custom event listener. It will use a fixed priority of 1.
   * !#zh 向事件管理器添加一个自定义事件监听器。
   * @method addCustomListener
   * @param {String} eventName
   * @param {Function} callback
   * @return {EventListener} the generated event. Needed in order to remove the event from the dispatcher
   */
  addCustomListener: function addCustomListener(eventName, callback) {
    var listener = new cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      eventName: eventName,
      callback: callback
    });
    this.addListener(listener, 1);
    return listener;
  },

  /**
   * !#en Remove a listener.
   * !#zh 移除一个已添加的监听器。
   * @method removeListener
   * @param {EventListener} listener - an event listener or a registered node target
   * @example {@link cocos2d/core/event-manager/CCEventManager/removeListener.js}
   */
  removeListener: function removeListener(listener) {
    if (listener == null) return;
    var isFound,
        locListener = this._listenersMap;

    for (var selKey in locListener) {
      var listeners = locListener[selKey];
      var fixedPriorityListeners = listeners.getFixedPriorityListeners(),
          sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();
      isFound = this._removeListenerInVector(sceneGraphPriorityListeners, listener);

      if (isFound) {
        // fixed #4160: Dirty flag need to be updated after listeners were removed.
        this._setDirty(listener._getListenerID(), this.DIRTY_SCENE_GRAPH_PRIORITY);
      } else {
        isFound = this._removeListenerInVector(fixedPriorityListeners, listener);
        if (isFound) this._setDirty(listener._getListenerID(), this.DIRTY_FIXED_PRIORITY);
      }

      if (listeners.empty()) {
        delete this._priorityDirtyFlagMap[listener._getListenerID()];
        delete locListener[selKey];
      }

      if (isFound) break;
    }

    if (!isFound) {
      var locToAddedListeners = this._toAddedListeners;

      for (var i = locToAddedListeners.length - 1; i >= 0; i--) {
        var selListener = locToAddedListeners[i];

        if (selListener === listener) {
          cc.js.array.removeAt(locToAddedListeners, i);

          selListener._setRegistered(false);

          break;
        }
      }
    }

    this._currentTouchListener === listener && this._clearCurTouch();
  },
  _clearCurTouch: function _clearCurTouch() {
    this._currentTouchListener = null;
    this._currentTouch = null;
  },
  _removeListenerInCallback: function _removeListenerInCallback(listeners, callback) {
    if (listeners == null) return false;

    for (var i = listeners.length - 1; i >= 0; i--) {
      var selListener = listeners[i];

      if (selListener._onCustomEvent === callback || selListener._onEvent === callback) {
        selListener._setRegistered(false);

        if (selListener._getSceneGraphPriority() != null) {
          this._dissociateNodeAndEventListener(selListener._getSceneGraphPriority(), selListener);

          selListener._setSceneGraphPriority(null); // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.

        }

        if (this._inDispatch === 0) cc.js.array.removeAt(listeners, i);else this._toRemovedListeners.push(selListener);
        return true;
      }
    }

    return false;
  },
  _removeListenerInVector: function _removeListenerInVector(listeners, listener) {
    if (listeners == null) return false;

    for (var i = listeners.length - 1; i >= 0; i--) {
      var selListener = listeners[i];

      if (selListener === listener) {
        selListener._setRegistered(false);

        if (selListener._getSceneGraphPriority() != null) {
          this._dissociateNodeAndEventListener(selListener._getSceneGraphPriority(), selListener);

          selListener._setSceneGraphPriority(null); // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.

        }

        if (this._inDispatch === 0) cc.js.array.removeAt(listeners, i);else this._toRemovedListeners.push(selListener);
        return true;
      }
    }

    return false;
  },

  /**
   * !#en Removes all listeners with the same event listener type or removes all listeners of a node.
   * !#zh
   * 移除注册到 eventManager 中指定类型的所有事件监听器。<br/>
   * 1. 如果传入的第一个参数类型是 Node，那么事件管理器将移除与该对象相关的所有事件监听器。
   * （如果第二参数 recursive 是 true 的话，就会连同该对象的子控件上所有的事件监听器也一并移除）<br/>
   * 2. 如果传入的第一个参数类型是 Number（该类型 EventListener 中定义的事件类型），
   * 那么事件管理器将移除该类型的所有事件监听器。<br/>
   *
   * 下列是目前存在监听器类型：       <br/>
   * cc.EventListener.UNKNOWN       <br/>
   * cc.EventListener.KEYBOARD      <br/>
   * cc.EventListener.ACCELERATION，<br/>
   *
   * @method removeListeners
   * @param {Number|Node} listenerType - listenerType or a node
   * @param {Boolean} [recursive=false]
   */
  removeListeners: function removeListeners(listenerType, recursive) {
    var i,
        _t = this;

    if (!(cc.js.isNumber(listenerType) || listenerType instanceof cc._BaseNode)) {
      cc.warnID(3506);
      return;
    }

    if (listenerType._id !== undefined) {
      // Ensure the node is removed from these immediately also.
      // Don't want any dangling pointers or the possibility of dealing with deleted objects..
      var listeners = _t._nodeListenersMap[listenerType._id],
          i;

      if (listeners) {
        var listenersCopy = cc.js.array.copy(listeners);

        for (i = 0; i < listenersCopy.length; i++) {
          _t.removeListener(listenersCopy[i]);
        }

        delete _t._nodeListenersMap[listenerType._id];
      } // Bug fix: ensure there are no references to the node in the list of listeners to be added.
      // If we find any listeners associated with the destroyed node in this list then remove them.
      // This is to catch the scenario where the node gets destroyed before it's listener
      // is added into the event dispatcher fully. This could happen if a node registers a listener
      // and gets destroyed while we are dispatching an event (touch etc.)


      var locToAddedListeners = _t._toAddedListeners;

      for (i = 0; i < locToAddedListeners.length;) {
        var listener = locToAddedListeners[i];

        if (listener._getSceneGraphPriority() === listenerType) {
          listener._setSceneGraphPriority(null); // Ensure no dangling ptr to the target node.


          listener._setRegistered(false);

          locToAddedListeners.splice(i, 1);
        } else ++i;
      }

      if (recursive === true) {
        var locChildren = listenerType.children,
            len;

        for (i = 0, len = locChildren.length; i < len; i++) {
          _t.removeListeners(locChildren[i], true);
        }
      }
    } else {
      if (listenerType === cc.EventListener.TOUCH_ONE_BY_ONE) _t._removeListenersForListenerID(ListenerID.TOUCH_ONE_BY_ONE);else if (listenerType === cc.EventListener.TOUCH_ALL_AT_ONCE) _t._removeListenersForListenerID(ListenerID.TOUCH_ALL_AT_ONCE);else if (listenerType === cc.EventListener.MOUSE) _t._removeListenersForListenerID(ListenerID.MOUSE);else if (listenerType === cc.EventListener.ACCELERATION) _t._removeListenersForListenerID(ListenerID.ACCELERATION);else if (listenerType === cc.EventListener.KEYBOARD) _t._removeListenersForListenerID(ListenerID.KEYBOARD);else cc.logID(3501);
    }
  },

  /*
   * !#en Removes all custom listeners with the same event name.
   * !#zh 移除同一事件名的自定义事件监听器。
   * @method removeCustomListeners
   * @param {String} customEventName
   */
  removeCustomListeners: function removeCustomListeners(customEventName) {
    this._removeListenersForListenerID(customEventName);
  },

  /**
   * !#en Removes all listeners
   * !#zh 移除所有事件监听器。
   * @method removeAllListeners
   */
  removeAllListeners: function removeAllListeners() {
    var locListeners = this._listenersMap,
        locInternalCustomEventIDs = this._internalCustomListenerIDs;

    for (var selKey in locListeners) {
      if (locInternalCustomEventIDs.indexOf(selKey) === -1) this._removeListenersForListenerID(selKey);
    }
  },

  /**
   * !#en Sets listener's priority with fixed value.
   * !#zh 设置 FixedPriority 类型监听器的优先级。
   * @method setPriority
   * @param {EventListener} listener
   * @param {Number} fixedPriority
   */
  setPriority: function setPriority(listener, fixedPriority) {
    if (listener == null) return;
    var locListeners = this._listenersMap;

    for (var selKey in locListeners) {
      var selListeners = locListeners[selKey];
      var fixedPriorityListeners = selListeners.getFixedPriorityListeners();

      if (fixedPriorityListeners) {
        var found = fixedPriorityListeners.indexOf(listener);

        if (found !== -1) {
          if (listener._getSceneGraphPriority() != null) cc.logID(3502);

          if (listener._getFixedPriority() !== fixedPriority) {
            listener._setFixedPriority(fixedPriority);

            this._setDirty(listener._getListenerID(), this.DIRTY_FIXED_PRIORITY);
          }

          return;
        }
      }
    }
  },

  /**
   * !#en Whether to enable dispatching events
   * !#zh 启用或禁用事件管理器，禁用后不会分发任何事件。
   * @method setEnabled
   * @param {Boolean} enabled
   */
  setEnabled: function setEnabled(enabled) {
    this._isEnabled = enabled;
  },

  /**
   * !#en Checks whether dispatching events is enabled
   * !#zh 检测事件管理器是否启用。
   * @method isEnabled
   * @returns {Boolean}
   */
  isEnabled: function isEnabled() {
    return this._isEnabled;
  },

  /*
   * !#en Dispatches the event, also removes all EventListeners marked for deletion from the event dispatcher list.
   * !#zh 分发事件。
   * @method dispatchEvent
   * @param {Event} event
   */
  dispatchEvent: function dispatchEvent(event) {
    if (!this._isEnabled) return;

    this._updateDirtyFlagForSceneGraph();

    this._inDispatch++;

    if (!event || !event.getType) {
      cc.errorID(3511);
      return;
    }

    if (event.getType().startsWith(cc.Event.TOUCH)) {
      this._dispatchTouchEvent(event);

      this._inDispatch--;
      return;
    }

    var listenerID = __getListenerID(event);

    this._sortEventListeners(listenerID);

    var selListeners = this._listenersMap[listenerID];

    if (selListeners != null) {
      this._dispatchEventToListeners(selListeners, this._onListenerCallback, event);

      this._onUpdateListeners(selListeners);
    }

    this._inDispatch--;
  },
  _onListenerCallback: function _onListenerCallback(listener, event) {
    event.currentTarget = listener._target;

    listener._onEvent(event);

    return event.isStopped();
  },

  /*
   * !#en Dispatches a Custom Event with a event name an optional user data
   * !#zh 分发自定义事件。
   * @method dispatchCustomEvent
   * @param {String} eventName
   * @param {*} optionalUserData
   */
  dispatchCustomEvent: function dispatchCustomEvent(eventName, optionalUserData) {
    var ev = new cc.Event.EventCustom(eventName);
    ev.setUserData(optionalUserData);
    this.dispatchEvent(ev);
  }
};
js.get(cc, 'eventManager', function () {
  cc.errorID(1405, 'cc.eventManager', 'cc.EventTarget or cc.systemEvent');
  return eventManager;
});
module.exports = cc.internal.eventManager = eventManager;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2V2ZW50LW1hbmFnZXIvQ0NFdmVudE1hbmFnZXIuanMiXSwibmFtZXMiOlsianMiLCJyZXF1aXJlIiwiTGlzdGVuZXJJRCIsImNjIiwiRXZlbnRMaXN0ZW5lciIsIl9FdmVudExpc3RlbmVyVmVjdG9yIiwiX2ZpeGVkTGlzdGVuZXJzIiwiX3NjZW5lR3JhcGhMaXN0ZW5lcnMiLCJndDBJbmRleCIsInByb3RvdHlwZSIsImNvbnN0cnVjdG9yIiwic2l6ZSIsImxlbmd0aCIsImVtcHR5IiwicHVzaCIsImxpc3RlbmVyIiwiX2dldEZpeGVkUHJpb3JpdHkiLCJjbGVhclNjZW5lR3JhcGhMaXN0ZW5lcnMiLCJjbGVhckZpeGVkTGlzdGVuZXJzIiwiY2xlYXIiLCJnZXRGaXhlZFByaW9yaXR5TGlzdGVuZXJzIiwiZ2V0U2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzIiwiX19nZXRMaXN0ZW5lcklEIiwiZXZlbnQiLCJldmVudFR5cGUiLCJFdmVudCIsInR5cGUiLCJBQ0NFTEVSQVRJT04iLCJLRVlCT0FSRCIsInN0YXJ0c1dpdGgiLCJNT1VTRSIsIlRPVUNIIiwibG9nSUQiLCJldmVudE1hbmFnZXIiLCJESVJUWV9OT05FIiwiRElSVFlfRklYRURfUFJJT1JJVFkiLCJESVJUWV9TQ0VORV9HUkFQSF9QUklPUklUWSIsIkRJUlRZX0FMTCIsIl9saXN0ZW5lcnNNYXAiLCJfcHJpb3JpdHlEaXJ0eUZsYWdNYXAiLCJfbm9kZUxpc3RlbmVyc01hcCIsIl90b0FkZGVkTGlzdGVuZXJzIiwiX3RvUmVtb3ZlZExpc3RlbmVycyIsIl9kaXJ0eUxpc3RlbmVycyIsIl9pbkRpc3BhdGNoIiwiX2lzRW5hYmxlZCIsIl9jdXJyZW50VG91Y2giLCJfY3VycmVudFRvdWNoTGlzdGVuZXIiLCJfaW50ZXJuYWxDdXN0b21MaXN0ZW5lcklEcyIsIl9zZXREaXJ0eUZvck5vZGUiLCJub2RlIiwic2VsTGlzdGVuZXJzIiwiX2lkIiwidW5kZWZpbmVkIiwiaiIsImxlbiIsInNlbExpc3RlbmVyIiwibGlzdGVuZXJJRCIsIl9nZXRMaXN0ZW5lcklEIiwiY2hpbGRyZW5Db3VudCIsImNoaWxkcmVuIiwiX2NoaWxkcmVuIiwiaSIsInBhdXNlVGFyZ2V0IiwicmVjdXJzaXZlIiwiX0Jhc2VOb2RlIiwid2FybklEIiwibGlzdGVuZXJzIiwiX3NldFBhdXNlZCIsImxvY0NoaWxkcmVuIiwicmVzdW1lVGFyZ2V0IiwiX2FkZExpc3RlbmVyIiwiX2ZvcmNlQWRkRXZlbnRMaXN0ZW5lciIsIl9zZXREaXJ0eSIsIl9nZXRTY2VuZUdyYXBoUHJpb3JpdHkiLCJfYXNzb2NpYXRlTm9kZUFuZEV2ZW50TGlzdGVuZXIiLCJhY3RpdmVJbkhpZXJhcmNoeSIsIl9nZXRMaXN0ZW5lcnMiLCJfdXBkYXRlRGlydHlGbGFnRm9yU2NlbmVHcmFwaCIsImxvY0RpcnR5TGlzdGVuZXJzIiwic2VsS2V5IiwiX3JlbW92ZUFsbExpc3RlbmVyc0luVmVjdG9yIiwibGlzdGVuZXJWZWN0b3IiLCJfc2V0UmVnaXN0ZXJlZCIsIl9kaXNzb2NpYXRlTm9kZUFuZEV2ZW50TGlzdGVuZXIiLCJfc2V0U2NlbmVHcmFwaFByaW9yaXR5IiwiYXJyYXkiLCJyZW1vdmVBdCIsIl9yZW1vdmVMaXN0ZW5lcnNGb3JMaXN0ZW5lcklEIiwiZml4ZWRQcmlvcml0eUxpc3RlbmVycyIsInNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycyIsImxvY1RvQWRkZWRMaXN0ZW5lcnMiLCJfc29ydEV2ZW50TGlzdGVuZXJzIiwiZGlydHlGbGFnIiwibG9jRmxhZ01hcCIsIl9zb3J0TGlzdGVuZXJzT2ZGaXhlZFByaW9yaXR5Iiwicm9vdEVudGl0eSIsImRpcmVjdG9yIiwiZ2V0U2NlbmUiLCJfc29ydExpc3RlbmVyc09mU2NlbmVHcmFwaFByaW9yaXR5Iiwic2NlbmVHcmFwaExpc3RlbmVyIiwic29ydCIsIl9zb3J0RXZlbnRMaXN0ZW5lcnNPZlNjZW5lR3JhcGhQcmlvcml0eURlcyIsImwxIiwibDIiLCJub2RlMSIsIm5vZGUyIiwiX2FjdGl2ZUluSGllcmFyY2h5IiwiX3BhcmVudCIsInAxIiwicDIiLCJleCIsIl9sb2NhbFpPcmRlciIsImZpeGVkTGlzdGVuZXJzIiwiX3NvcnRMaXN0ZW5lcnNPZkZpeGVkUHJpb3JpdHlBc2MiLCJpbmRleCIsIl9vblVwZGF0ZUxpc3RlbmVycyIsImlkeCIsInRvUmVtb3ZlZExpc3RlbmVycyIsIl9pc1JlZ2lzdGVyZWQiLCJpbmRleE9mIiwic3BsaWNlIiwiZnJhbWVVcGRhdGVMaXN0ZW5lcnMiLCJsb2NMaXN0ZW5lcnNNYXAiLCJsb2NQcmlvcml0eURpcnR5RmxhZ01hcCIsIl9jbGVhblRvUmVtb3ZlZExpc3RlbmVycyIsIl91cGRhdGVUb3VjaExpc3RlbmVycyIsImxvY0luRGlzcGF0Y2giLCJhc3NlcnRJRCIsIlRPVUNIX09ORV9CWV9PTkUiLCJUT1VDSF9BTExfQVRfT05DRSIsIl9vblRvdWNoRXZlbnRDYWxsYmFjayIsImFyZ3NPYmoiLCJzZWxUb3VjaCIsImN1cnJlbnRUb3VjaCIsImN1cnJlbnRUYXJnZXQiLCJfbm9kZSIsImlzQ2xhaW1lZCIsInJlbW92ZWRJZHgiLCJnZXRDb2RlIiwiZ2V0RXZlbnRDb2RlIiwiRXZlbnRUb3VjaCIsIkJFR0FOIiwibWFjcm8iLCJFTkFCTEVfTVVMVElfVE9VQ0giLCJvblRvdWNoQmVnYW4iLCJfcmVnaXN0ZXJlZCIsIl9jbGFpbWVkVG91Y2hlcyIsIk1PVkVEIiwib25Ub3VjaE1vdmVkIiwiRU5ERUQiLCJvblRvdWNoRW5kZWQiLCJfY2xlYXJDdXJUb3VjaCIsIkNBTkNFTEVEIiwib25Ub3VjaENhbmNlbGxlZCIsImlzU3RvcHBlZCIsInN3YWxsb3dUb3VjaGVzIiwibmVlZHNNdXRhYmxlU2V0IiwidG91Y2hlcyIsIl9kaXNwYXRjaFRvdWNoRXZlbnQiLCJvbmVCeU9uZUxpc3RlbmVycyIsImFsbEF0T25jZUxpc3RlbmVycyIsIm9yaWdpbmFsVG91Y2hlcyIsImdldFRvdWNoZXMiLCJtdXRhYmxlVG91Y2hlcyIsImNvcHkiLCJvbmVCeU9uZUFyZ3NPYmoiLCJfcHJvcGFnYXRpb25TdG9wcGVkIiwiX3Byb3BhZ2F0aW9uSW1tZWRpYXRlU3RvcHBlZCIsIl9kaXNwYXRjaEV2ZW50VG9MaXN0ZW5lcnMiLCJfb25Ub3VjaGVzRXZlbnRDYWxsYmFjayIsImNhbGxiYWNrUGFyYW1zIiwib25Ub3VjaGVzQmVnYW4iLCJvblRvdWNoZXNNb3ZlZCIsIm9uVG91Y2hlc0VuZGVkIiwib25Ub3VjaGVzQ2FuY2VsbGVkIiwicmVtb3ZlIiwib25FdmVudCIsImV2ZW50T3JBcmdzIiwic2hvdWxkU3RvcFByb3BhZ2F0aW9uIiwiaXNFbmFibGVkIiwiX2lzUGF1c2VkIiwiZmxhZyIsImxvY0RpcnR5RmxhZ01hcCIsIl9zb3J0TnVtYmVyQXNjIiwiYSIsImIiLCJoYXNFdmVudExpc3RlbmVyIiwiYWRkTGlzdGVuZXIiLCJub2RlT3JQcmlvcml0eSIsImlzTnVtYmVyIiwiY3JlYXRlIiwiY2hlY2tBdmFpbGFibGUiLCJfc2V0Rml4ZWRQcmlvcml0eSIsImFkZEN1c3RvbUxpc3RlbmVyIiwiZXZlbnROYW1lIiwiY2FsbGJhY2siLCJDVVNUT00iLCJyZW1vdmVMaXN0ZW5lciIsImlzRm91bmQiLCJsb2NMaXN0ZW5lciIsIl9yZW1vdmVMaXN0ZW5lckluVmVjdG9yIiwiX3JlbW92ZUxpc3RlbmVySW5DYWxsYmFjayIsIl9vbkN1c3RvbUV2ZW50IiwiX29uRXZlbnQiLCJyZW1vdmVMaXN0ZW5lcnMiLCJsaXN0ZW5lclR5cGUiLCJfdCIsImxpc3RlbmVyc0NvcHkiLCJyZW1vdmVDdXN0b21MaXN0ZW5lcnMiLCJjdXN0b21FdmVudE5hbWUiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJsb2NMaXN0ZW5lcnMiLCJsb2NJbnRlcm5hbEN1c3RvbUV2ZW50SURzIiwic2V0UHJpb3JpdHkiLCJmaXhlZFByaW9yaXR5IiwiZm91bmQiLCJzZXRFbmFibGVkIiwiZW5hYmxlZCIsImRpc3BhdGNoRXZlbnQiLCJnZXRUeXBlIiwiZXJyb3JJRCIsIl9vbkxpc3RlbmVyQ2FsbGJhY2siLCJfdGFyZ2V0IiwiZGlzcGF0Y2hDdXN0b21FdmVudCIsIm9wdGlvbmFsVXNlckRhdGEiLCJldiIsIkV2ZW50Q3VzdG9tIiwic2V0VXNlckRhdGEiLCJnZXQiLCJtb2R1bGUiLCJleHBvcnRzIiwiaW50ZXJuYWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUlBLEVBQUUsR0FBR0MsT0FBTyxDQUFDLGdCQUFELENBQWhCOztBQUNBQSxPQUFPLENBQUMsbUJBQUQsQ0FBUDs7QUFDQSxJQUFJQyxVQUFVLEdBQUdDLEVBQUUsQ0FBQ0MsYUFBSCxDQUFpQkYsVUFBbEM7O0FBRUEsSUFBSUcsb0JBQW9CLEdBQUcsU0FBdkJBLG9CQUF1QixHQUFZO0FBQ25DLE9BQUtDLGVBQUwsR0FBdUIsRUFBdkI7QUFDQSxPQUFLQyxvQkFBTCxHQUE0QixFQUE1QjtBQUNBLE9BQUtDLFFBQUwsR0FBZ0IsQ0FBaEI7QUFDSCxDQUpEOztBQUtBSCxvQkFBb0IsQ0FBQ0ksU0FBckIsR0FBaUM7QUFDN0JDLEVBQUFBLFdBQVcsRUFBRUwsb0JBRGdCO0FBRTdCTSxFQUFBQSxJQUFJLEVBQUUsZ0JBQVk7QUFDZCxXQUFPLEtBQUtMLGVBQUwsQ0FBcUJNLE1BQXJCLEdBQThCLEtBQUtMLG9CQUFMLENBQTBCSyxNQUEvRDtBQUNILEdBSjRCO0FBTTdCQyxFQUFBQSxLQUFLLEVBQUUsaUJBQVk7QUFDZixXQUFRLEtBQUtQLGVBQUwsQ0FBcUJNLE1BQXJCLEtBQWdDLENBQWpDLElBQXdDLEtBQUtMLG9CQUFMLENBQTBCSyxNQUExQixLQUFxQyxDQUFwRjtBQUNILEdBUjRCO0FBVTdCRSxFQUFBQSxJQUFJLEVBQUUsY0FBVUMsUUFBVixFQUFvQjtBQUN0QixRQUFJQSxRQUFRLENBQUNDLGlC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KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG52YXIganMgPSByZXF1aXJlKCcuLi9wbGF0Zm9ybS9qcycpO1xucmVxdWlyZSgnLi9DQ0V2ZW50TGlzdGVuZXInKTtcbnZhciBMaXN0ZW5lcklEID0gY2MuRXZlbnRMaXN0ZW5lci5MaXN0ZW5lcklEO1xuXG52YXIgX0V2ZW50TGlzdGVuZXJWZWN0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fZml4ZWRMaXN0ZW5lcnMgPSBbXTtcbiAgICB0aGlzLl9zY2VuZUdyYXBoTGlzdGVuZXJzID0gW107XG4gICAgdGhpcy5ndDBJbmRleCA9IDA7XG59O1xuX0V2ZW50TGlzdGVuZXJWZWN0b3IucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBfRXZlbnRMaXN0ZW5lclZlY3RvcixcbiAgICBzaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9maXhlZExpc3RlbmVycy5sZW5ndGggKyB0aGlzLl9zY2VuZUdyYXBoTGlzdGVuZXJzLmxlbmd0aDtcbiAgICB9LFxuXG4gICAgZW1wdHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLl9maXhlZExpc3RlbmVycy5sZW5ndGggPT09IDApICYmICh0aGlzLl9zY2VuZUdyYXBoTGlzdGVuZXJzLmxlbmd0aCA9PT0gMCk7XG4gICAgfSxcblxuICAgIHB1c2g6IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgICBpZiAobGlzdGVuZXIuX2dldEZpeGVkUHJpb3JpdHkoKSA9PT0gMClcbiAgICAgICAgICAgIHRoaXMuX3NjZW5lR3JhcGhMaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuX2ZpeGVkTGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgIH0sXG5cbiAgICBjbGVhclNjZW5lR3JhcGhMaXN0ZW5lcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fc2NlbmVHcmFwaExpc3RlbmVycy5sZW5ndGggPSAwO1xuICAgIH0sXG5cbiAgICBjbGVhckZpeGVkTGlzdGVuZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2ZpeGVkTGlzdGVuZXJzLmxlbmd0aCA9IDA7XG4gICAgfSxcblxuICAgIGNsZWFyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3NjZW5lR3JhcGhMaXN0ZW5lcnMubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5fZml4ZWRMaXN0ZW5lcnMubGVuZ3RoID0gMDtcbiAgICB9LFxuXG4gICAgZ2V0Rml4ZWRQcmlvcml0eUxpc3RlbmVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZml4ZWRMaXN0ZW5lcnM7XG4gICAgfSxcblxuICAgIGdldFNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2NlbmVHcmFwaExpc3RlbmVycztcbiAgICB9XG59O1xuXG52YXIgX19nZXRMaXN0ZW5lcklEID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIGV2ZW50VHlwZSA9IGNjLkV2ZW50LCB0eXBlID0gZXZlbnQudHlwZTtcbiAgICBpZiAodHlwZSA9PT0gZXZlbnRUeXBlLkFDQ0VMRVJBVElPTilcbiAgICAgICAgcmV0dXJuIExpc3RlbmVySUQuQUNDRUxFUkFUSU9OO1xuICAgIGlmICh0eXBlID09PSBldmVudFR5cGUuS0VZQk9BUkQpXG4gICAgICAgIHJldHVybiBMaXN0ZW5lcklELktFWUJPQVJEO1xuICAgIGlmICh0eXBlLnN0YXJ0c1dpdGgoZXZlbnRUeXBlLk1PVVNFKSlcbiAgICAgICAgcmV0dXJuIExpc3RlbmVySUQuTU9VU0U7XG4gICAgaWYgKHR5cGUuc3RhcnRzV2l0aChldmVudFR5cGUuVE9VQ0gpKXtcbiAgICAgICAgLy8gVG91Y2ggbGlzdGVuZXIgaXMgdmVyeSBzcGVjaWFsLCBpdCBjb250YWlucyB0d28ga2luZHMgb2YgbGlzdGVuZXJzLCBFdmVudExpc3RlbmVyVG91Y2hPbmVCeU9uZSBhbmQgRXZlbnRMaXN0ZW5lclRvdWNoQWxsQXRPbmNlLlxuICAgICAgICAvLyByZXR1cm4gVU5LTk9XTiBpbnN0ZWFkLlxuICAgICAgICBjYy5sb2dJRCgyMDAwKTtcbiAgICB9XG4gICAgcmV0dXJuIFwiXCI7XG59O1xuXG4vKipcbiAqICEjZW5cbiAqIFRoaXMgY2xhc3MgaGFzIGJlZW4gZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSBjYy5zeXN0ZW1FdmVudCBvciBjYy5FdmVudFRhcmdldCBpbnN0ZWFkLiBTZWUgW0xpc3RlbiB0byBhbmQgbGF1bmNoIGV2ZW50c10oLi4vLi4vLi4vbWFudWFsL2VuL3NjcmlwdGluZy9ldmVudHMuaHRtbCkgZm9yIGRldGFpbHMuPGJyPlxuICogPGJyPlxuICogY2MuZXZlbnRNYW5hZ2VyIGlzIGEgc2luZ2xldG9uIG9iamVjdCB3aGljaCBtYW5hZ2VzIGV2ZW50IGxpc3RlbmVyIHN1YnNjcmlwdGlvbnMgYW5kIGV2ZW50IGRpc3BhdGNoaW5nLlxuICogVGhlIEV2ZW50TGlzdGVuZXIgbGlzdCBpcyBtYW5hZ2VkIGluIHN1Y2ggd2F5IHNvIHRoYXQgZXZlbnQgbGlzdGVuZXJzIGNhbiBiZSBhZGRlZCBhbmQgcmVtb3ZlZFxuICogd2hpbGUgZXZlbnRzIGFyZSBiZWluZyBkaXNwYXRjaGVkLlxuICpcbiAqICEjemhcbiAqIOivpeexu+W3suW6n+W8g++8jOivt+S9v+eUqCBjYy5zeXN0ZW1FdmVudCDmiJYgY2MuRXZlbnRUYXJnZXQg5Luj5pu/77yM6K+m6KeBIFvnm5HlkKzlkozlj5HlsITkuovku7ZdKC4uLy4uLy4uL21hbnVhbC96aC9zY3JpcHRpbmcvZXZlbnRzLmh0bWwp44CCPGJyPlxuICogPGJyPlxuICog5LqL5Lu2566h55CG5Zmo77yM5a6D5Li76KaB566h55CG5LqL5Lu255uR5ZCs5Zmo5rOo5YaM5ZKM5rS+5Y+R57O757uf5LqL5Lu244CCXG4gKlxuICogQGNsYXNzIGV2ZW50TWFuYWdlclxuICogQHN0YXRpY1xuICogQGV4YW1wbGUge0BsaW5rIGNvY29zMmQvY29yZS9ldmVudC1tYW5hZ2VyL0NDRXZlbnRNYW5hZ2VyL2FkZExpc3RlbmVyLmpzfVxuICogQGRlcHJlY2F0ZWRcbiAqL1xudmFyIGV2ZW50TWFuYWdlciA9IHtcbiAgICAvL1ByaW9yaXR5IGRpcnR5IGZsYWdcbiAgICBESVJUWV9OT05FOiAwLFxuICAgIERJUlRZX0ZJWEVEX1BSSU9SSVRZOiAxIDw8IDAsXG4gICAgRElSVFlfU0NFTkVfR1JBUEhfUFJJT1JJVFk6IDEgPDwgMSxcbiAgICBESVJUWV9BTEw6IDMsXG4gICAgXG4gICAgX2xpc3RlbmVyc01hcDoge30sXG4gICAgX3ByaW9yaXR5RGlydHlGbGFnTWFwOiB7fSxcbiAgICBfbm9kZUxpc3RlbmVyc01hcDoge30sXG4gICAgX3RvQWRkZWRMaXN0ZW5lcnM6IFtdLFxuICAgIF90b1JlbW92ZWRMaXN0ZW5lcnM6IFtdLFxuICAgIF9kaXJ0eUxpc3RlbmVyczoge30sXG4gICAgX2luRGlzcGF0Y2g6IDAsXG4gICAgX2lzRW5hYmxlZDogZmFsc2UsXG4gICAgX2N1cnJlbnRUb3VjaDogbnVsbCxcbiAgICBfY3VycmVudFRvdWNoTGlzdGVuZXI6IG51bGwsXG5cbiAgICBfaW50ZXJuYWxDdXN0b21MaXN0ZW5lcklEczpbXSxcblxuICAgIF9zZXREaXJ0eUZvck5vZGU6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIC8vIE1hcmsgdGhlIG5vZGUgZGlydHkgb25seSB3aGVuIHRoZXJlIGlzIGFuIGV2ZW50IGxpc3RlbmVyIGFzc29jaWF0ZWQgd2l0aCBpdC5cbiAgICAgICAgbGV0IHNlbExpc3RlbmVycyA9IHRoaXMuX25vZGVMaXN0ZW5lcnNNYXBbbm9kZS5faWRdO1xuICAgICAgICBpZiAoc2VsTGlzdGVuZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBzZWxMaXN0ZW5lcnMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgc2VsTGlzdGVuZXIgPSBzZWxMaXN0ZW5lcnNbal07XG4gICAgICAgICAgICAgICAgbGV0IGxpc3RlbmVySUQgPSBzZWxMaXN0ZW5lci5fZ2V0TGlzdGVuZXJJRCgpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kaXJ0eUxpc3RlbmVyc1tsaXN0ZW5lcklEXSA9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXJ0eUxpc3RlbmVyc1tsaXN0ZW5lcklEXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW5Db3VudCA+IDApIHtcbiAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IG5vZGUuX2NoaWxkcmVuO1xuICAgICAgICAgICAgZm9yKGxldCBpID0gMCwgbGVuID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0RGlydHlGb3JOb2RlKGNoaWxkcmVuW2ldKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBhdXNlcyBhbGwgbGlzdGVuZXJzIHdoaWNoIGFyZSBhc3NvY2lhdGVkIHRoZSBzcGVjaWZpZWQgdGFyZ2V0LlxuICAgICAqICEjemgg5pqC5YGc5Lyg5YWl55qEIG5vZGUg55u45YWz55qE5omA5pyJ55uR5ZCs5Zmo55qE5LqL5Lu25ZON5bqU44CCXG4gICAgICogQG1ldGhvZCBwYXVzZVRhcmdldFxuICAgICAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3JlY3Vyc2l2ZT1mYWxzZV1cbiAgICAgKi9cbiAgICBwYXVzZVRhcmdldDogZnVuY3Rpb24gKG5vZGUsIHJlY3Vyc2l2ZSkge1xuICAgICAgICBpZiAoIShub2RlIGluc3RhbmNlb2YgY2MuX0Jhc2VOb2RlKSkge1xuICAgICAgICAgICAgY2Mud2FybklEKDM1MDYpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ub2RlTGlzdGVuZXJzTWFwW25vZGUuX2lkXSwgaSwgbGVuO1xuICAgICAgICBpZiAobGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzW2ldLl9zZXRQYXVzZWQodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlY3Vyc2l2ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdmFyIGxvY0NoaWxkcmVuID0gbm9kZS5fY2hpbGRyZW47XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBsb2NDaGlsZHJlbiA/IGxvY0NoaWxkcmVuLmxlbmd0aCA6IDA7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlVGFyZ2V0KGxvY0NoaWxkcmVuW2ldLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJlc3VtZXMgYWxsIGxpc3RlbmVycyB3aGljaCBhcmUgYXNzb2NpYXRlZCB0aGUgc3BlY2lmaWVkIHRhcmdldC5cbiAgICAgKiAhI3poIOaBouWkjeS8oOWFpeeahCBub2RlIOebuOWFs+eahOaJgOacieebkeWQrOWZqOeahOS6i+S7tuWTjeW6lOOAglxuICAgICAqIEBtZXRob2QgcmVzdW1lVGFyZ2V0XG4gICAgICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbcmVjdXJzaXZlPWZhbHNlXVxuICAgICAqL1xuICAgIHJlc3VtZVRhcmdldDogZnVuY3Rpb24gKG5vZGUsIHJlY3Vyc2l2ZSkge1xuICAgICAgICBpZiAoIShub2RlIGluc3RhbmNlb2YgY2MuX0Jhc2VOb2RlKSkge1xuICAgICAgICAgICAgY2Mud2FybklEKDM1MDYpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ub2RlTGlzdGVuZXJzTWFwW25vZGUuX2lkXSwgaSwgbGVuO1xuICAgICAgICBpZiAobGlzdGVuZXJzKXtcbiAgICAgICAgICAgIGZvciAoIGkgPSAwLCBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzW2ldLl9zZXRQYXVzZWQoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NldERpcnR5Rm9yTm9kZShub2RlKTtcbiAgICAgICAgaWYgKHJlY3Vyc2l2ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdmFyIGxvY0NoaWxkcmVuID0gbm9kZS5fY2hpbGRyZW47XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBsb2NDaGlsZHJlbiA/IGxvY0NoaWxkcmVuLmxlbmd0aCA6IDA7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3VtZVRhcmdldChsb2NDaGlsZHJlbltpXSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2FkZExpc3RlbmVyOiBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuX2luRGlzcGF0Y2ggPT09IDApXG4gICAgICAgICAgICB0aGlzLl9mb3JjZUFkZEV2ZW50TGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLl90b0FkZGVkTGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgIH0sXG5cbiAgICBfZm9yY2VBZGRFdmVudExpc3RlbmVyOiBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVySUQgPSBsaXN0ZW5lci5fZ2V0TGlzdGVuZXJJRCgpO1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzTWFwW2xpc3RlbmVySURdO1xuICAgICAgICBpZiAoIWxpc3RlbmVycykge1xuICAgICAgICAgICAgbGlzdGVuZXJzID0gbmV3IF9FdmVudExpc3RlbmVyVmVjdG9yKCk7XG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnNNYXBbbGlzdGVuZXJJRF0gPSBsaXN0ZW5lcnM7XG4gICAgICAgIH1cbiAgICAgICAgbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuXG4gICAgICAgIGlmIChsaXN0ZW5lci5fZ2V0Rml4ZWRQcmlvcml0eSgpID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXREaXJ0eShsaXN0ZW5lcklELCB0aGlzLkRJUlRZX1NDRU5FX0dSQVBIX1BSSU9SSVRZKTtcblxuICAgICAgICAgICAgdmFyIG5vZGUgPSBsaXN0ZW5lci5fZ2V0U2NlbmVHcmFwaFByaW9yaXR5KCk7XG4gICAgICAgICAgICBpZiAobm9kZSA9PT0gbnVsbClcbiAgICAgICAgICAgICAgICBjYy5sb2dJRCgzNTA3KTtcblxuICAgICAgICAgICAgdGhpcy5fYXNzb2NpYXRlTm9kZUFuZEV2ZW50TGlzdGVuZXIobm9kZSwgbGlzdGVuZXIpO1xuICAgICAgICAgICAgaWYgKG5vZGUuYWN0aXZlSW5IaWVyYXJjaHkpXG4gICAgICAgICAgICAgICAgdGhpcy5yZXN1bWVUYXJnZXQobm9kZSk7XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgdGhpcy5fc2V0RGlydHkobGlzdGVuZXJJRCwgdGhpcy5ESVJUWV9GSVhFRF9QUklPUklUWSk7XG4gICAgfSxcblxuICAgIF9nZXRMaXN0ZW5lcnM6IGZ1bmN0aW9uIChsaXN0ZW5lcklEKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0ZW5lcnNNYXBbbGlzdGVuZXJJRF07XG4gICAgfSxcblxuICAgIF91cGRhdGVEaXJ0eUZsYWdGb3JTY2VuZUdyYXBoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBsb2NEaXJ0eUxpc3RlbmVycyA9IHRoaXMuX2RpcnR5TGlzdGVuZXJzXG4gICAgICAgIGZvciAodmFyIHNlbEtleSBpbiBsb2NEaXJ0eUxpc3RlbmVycykge1xuICAgICAgICAgICAgdGhpcy5fc2V0RGlydHkoc2VsS2V5LCB0aGlzLkRJUlRZX1NDRU5FX0dSQVBIX1BSSU9SSVRZKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2RpcnR5TGlzdGVuZXJzID0ge307XG4gICAgfSxcblxuICAgIF9yZW1vdmVBbGxMaXN0ZW5lcnNJblZlY3RvcjogZnVuY3Rpb24gKGxpc3RlbmVyVmVjdG9yKSB7XG4gICAgICAgIGlmICghbGlzdGVuZXJWZWN0b3IpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBzZWxMaXN0ZW5lcjtcbiAgICAgICAgZm9yICh2YXIgaSA9IGxpc3RlbmVyVmVjdG9yLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBzZWxMaXN0ZW5lciA9IGxpc3RlbmVyVmVjdG9yW2ldO1xuICAgICAgICAgICAgc2VsTGlzdGVuZXIuX3NldFJlZ2lzdGVyZWQoZmFsc2UpO1xuICAgICAgICAgICAgaWYgKHNlbExpc3RlbmVyLl9nZXRTY2VuZUdyYXBoUHJpb3JpdHkoKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGlzc29jaWF0ZU5vZGVBbmRFdmVudExpc3RlbmVyKHNlbExpc3RlbmVyLl9nZXRTY2VuZUdyYXBoUHJpb3JpdHkoKSwgc2VsTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIHNlbExpc3RlbmVyLl9zZXRTY2VuZUdyYXBoUHJpb3JpdHkobnVsbCk7ICAgLy8gTlVMTCBvdXQgdGhlIG5vZGUgcG9pbnRlciBzbyB3ZSBkb24ndCBoYXZlIGFueSBkYW5nbGluZyBwb2ludGVycyB0byBkZXN0cm95ZWQgbm9kZXMuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9pbkRpc3BhdGNoID09PSAwKVxuICAgICAgICAgICAgICAgIGNjLmpzLmFycmF5LnJlbW92ZUF0KGxpc3RlbmVyVmVjdG9yLCBpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfcmVtb3ZlTGlzdGVuZXJzRm9yTGlzdGVuZXJJRDogZnVuY3Rpb24gKGxpc3RlbmVySUQpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc01hcFtsaXN0ZW5lcklEXSwgaTtcbiAgICAgICAgaWYgKGxpc3RlbmVycykge1xuICAgICAgICAgICAgdmFyIGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuZ2V0Rml4ZWRQcmlvcml0eUxpc3RlbmVycygpO1xuICAgICAgICAgICAgdmFyIHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycyA9IGxpc3RlbmVycy5nZXRTY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlQWxsTGlzdGVuZXJzSW5WZWN0b3Ioc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzKTtcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZUFsbExpc3RlbmVyc0luVmVjdG9yKGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMpO1xuXG4gICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGRpcnR5IGZsYWcgYWNjb3JkaW5nIHRoZSAnbGlzdGVuZXJJRCcuXG4gICAgICAgICAgICAvLyBObyBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgdGhlIGRpc3BhdGNoZXIgaXMgZGlzcGF0Y2hpbmcgZXZlbnQuXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fcHJpb3JpdHlEaXJ0eUZsYWdNYXBbbGlzdGVuZXJJRF07XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5faW5EaXNwYXRjaCkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVycy5jbGVhcigpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9saXN0ZW5lcnNNYXBbbGlzdGVuZXJJRF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbG9jVG9BZGRlZExpc3RlbmVycyA9IHRoaXMuX3RvQWRkZWRMaXN0ZW5lcnMsIGxpc3RlbmVyO1xuICAgICAgICBmb3IgKGkgPSBsb2NUb0FkZGVkTGlzdGVuZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBsaXN0ZW5lciA9IGxvY1RvQWRkZWRMaXN0ZW5lcnNbaV07XG4gICAgICAgICAgICBpZiAobGlzdGVuZXIgJiYgbGlzdGVuZXIuX2dldExpc3RlbmVySUQoKSA9PT0gbGlzdGVuZXJJRClcbiAgICAgICAgICAgICAgICBjYy5qcy5hcnJheS5yZW1vdmVBdChsb2NUb0FkZGVkTGlzdGVuZXJzLCBpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfc29ydEV2ZW50TGlzdGVuZXJzOiBmdW5jdGlvbiAobGlzdGVuZXJJRCkge1xuICAgICAgICB2YXIgZGlydHlGbGFnID0gdGhpcy5ESVJUWV9OT05FLCBsb2NGbGFnTWFwID0gdGhpcy5fcHJpb3JpdHlEaXJ0eUZsYWdNYXA7XG4gICAgICAgIGlmIChsb2NGbGFnTWFwW2xpc3RlbmVySURdKVxuICAgICAgICAgICAgZGlydHlGbGFnID0gbG9jRmxhZ01hcFtsaXN0ZW5lcklEXTtcbiAgICAgICAgXG4gICAgICAgIGlmIChkaXJ0eUZsYWcgIT09IHRoaXMuRElSVFlfTk9ORSkge1xuICAgICAgICAgICAgLy8gQ2xlYXIgdGhlIGRpcnR5IGZsYWcgZmlyc3QsIGlmIGByb290Tm9kZWAgaXMgbnVsbCwgdGhlbiBzZXQgaXRzIGRpcnR5IGZsYWcgb2Ygc2NlbmUgZ3JhcGggcHJpb3JpdHlcbiAgICAgICAgICAgIGxvY0ZsYWdNYXBbbGlzdGVuZXJJRF0gPSB0aGlzLkRJUlRZX05PTkU7XG5cbiAgICAgICAgICAgIGlmIChkaXJ0eUZsYWcgJiB0aGlzLkRJUlRZX0ZJWEVEX1BSSU9SSVRZKVxuICAgICAgICAgICAgICAgIHRoaXMuX3NvcnRMaXN0ZW5lcnNPZkZpeGVkUHJpb3JpdHkobGlzdGVuZXJJRCk7XG5cbiAgICAgICAgICAgIGlmIChkaXJ0eUZsYWcgJiB0aGlzLkRJUlRZX1NDRU5FX0dSQVBIX1BSSU9SSVRZKXtcbiAgICAgICAgICAgICAgICB2YXIgcm9vdEVudGl0eSA9IGNjLmRpcmVjdG9yLmdldFNjZW5lKCk7XG4gICAgICAgICAgICAgICAgaWYocm9vdEVudGl0eSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc29ydExpc3RlbmVyc09mU2NlbmVHcmFwaFByaW9yaXR5KGxpc3RlbmVySUQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9zb3J0TGlzdGVuZXJzT2ZTY2VuZUdyYXBoUHJpb3JpdHk6IGZ1bmN0aW9uIChsaXN0ZW5lcklEKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9nZXRMaXN0ZW5lcnMobGlzdGVuZXJJRCk7XG4gICAgICAgIGlmICghbGlzdGVuZXJzKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHZhciBzY2VuZUdyYXBoTGlzdGVuZXIgPSBsaXN0ZW5lcnMuZ2V0U2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzKCk7XG4gICAgICAgIGlmICghc2NlbmVHcmFwaExpc3RlbmVyIHx8IHNjZW5lR3JhcGhMaXN0ZW5lci5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgLy8gQWZ0ZXIgc29ydDogcHJpb3JpdHkgPCAwLCA+IDBcbiAgICAgICAgbGlzdGVuZXJzLmdldFNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycygpLnNvcnQodGhpcy5fc29ydEV2ZW50TGlzdGVuZXJzT2ZTY2VuZUdyYXBoUHJpb3JpdHlEZXMpO1xuICAgIH0sXG5cbiAgICBfc29ydEV2ZW50TGlzdGVuZXJzT2ZTY2VuZUdyYXBoUHJpb3JpdHlEZXM6IGZ1bmN0aW9uIChsMSwgbDIpIHtcbiAgICAgICAgbGV0IG5vZGUxID0gbDEuX2dldFNjZW5lR3JhcGhQcmlvcml0eSgpLFxuICAgICAgICAgICAgbm9kZTIgPSBsMi5fZ2V0U2NlbmVHcmFwaFByaW9yaXR5KCk7XG5cbiAgICAgICAgaWYgKCFsMiB8fCAhbm9kZTIgfHwgIW5vZGUyLl9hY3RpdmVJbkhpZXJhcmNoeSB8fCBub2RlMi5fcGFyZW50ID09PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICBlbHNlIGlmICghbDEgfHwgIW5vZGUxIHx8ICFub2RlMS5fYWN0aXZlSW5IaWVyYXJjaHkgfHwgbm9kZTEuX3BhcmVudCA9PT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICBcbiAgICAgICAgbGV0IHAxID0gbm9kZTEsIHAyID0gbm9kZTIsIGV4ID0gZmFsc2U7XG4gICAgICAgIHdoaWxlIChwMS5fcGFyZW50Ll9pZCAhPT0gcDIuX3BhcmVudC5faWQpIHtcbiAgICAgICAgICAgIHAxID0gcDEuX3BhcmVudC5fcGFyZW50ID09PSBudWxsID8gKGV4ID0gdHJ1ZSkgJiYgbm9kZTIgOiBwMS5fcGFyZW50O1xuICAgICAgICAgICAgcDIgPSBwMi5fcGFyZW50Ll9wYXJlbnQgPT09IG51bGwgPyAoZXggPSB0cnVlKSAmJiBub2RlMSA6IHAyLl9wYXJlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocDEuX2lkID09PSBwMi5faWQpIHtcbiAgICAgICAgICAgIGlmIChwMS5faWQgPT09IG5vZGUyLl9pZCkgXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgaWYgKHAxLl9pZCA9PT0gbm9kZTEuX2lkKVxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV4ID8gcDEuX2xvY2FsWk9yZGVyIC0gcDIuX2xvY2FsWk9yZGVyIDogcDIuX2xvY2FsWk9yZGVyIC0gcDEuX2xvY2FsWk9yZGVyO1xuICAgIH0sXG5cbiAgICBfc29ydExpc3RlbmVyc09mRml4ZWRQcmlvcml0eTogZnVuY3Rpb24gKGxpc3RlbmVySUQpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc01hcFtsaXN0ZW5lcklEXTtcbiAgICAgICAgaWYgKCFsaXN0ZW5lcnMpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdmFyIGZpeGVkTGlzdGVuZXJzID0gbGlzdGVuZXJzLmdldEZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMoKTtcbiAgICAgICAgaWYoIWZpeGVkTGlzdGVuZXJzIHx8IGZpeGVkTGlzdGVuZXJzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gQWZ0ZXIgc29ydDogcHJpb3JpdHkgPCAwLCA+IDBcbiAgICAgICAgZml4ZWRMaXN0ZW5lcnMuc29ydCh0aGlzLl9zb3J0TGlzdGVuZXJzT2ZGaXhlZFByaW9yaXR5QXNjKTtcblxuICAgICAgICAvLyBGSVhNRTogU2hvdWxkIHVzZSBiaW5hcnkgc2VhcmNoXG4gICAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICAgIGZvciAodmFyIGxlbiA9IGZpeGVkTGlzdGVuZXJzLmxlbmd0aDsgaW5kZXggPCBsZW47KSB7XG4gICAgICAgICAgICBpZiAoZml4ZWRMaXN0ZW5lcnNbaW5kZXhdLl9nZXRGaXhlZFByaW9yaXR5KCkgPj0gMClcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgbGlzdGVuZXJzLmd0MEluZGV4ID0gaW5kZXg7XG4gICAgfSxcblxuICAgIF9zb3J0TGlzdGVuZXJzT2ZGaXhlZFByaW9yaXR5QXNjOiBmdW5jdGlvbiAobDEsIGwyKSB7XG4gICAgICAgIHJldHVybiBsMS5fZ2V0Rml4ZWRQcmlvcml0eSgpIC0gbDIuX2dldEZpeGVkUHJpb3JpdHkoKTtcbiAgICB9LFxuXG4gICAgX29uVXBkYXRlTGlzdGVuZXJzOiBmdW5jdGlvbiAobGlzdGVuZXJzKSB7XG4gICAgICAgIHZhciBmaXhlZFByaW9yaXR5TGlzdGVuZXJzID0gbGlzdGVuZXJzLmdldEZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMoKTtcbiAgICAgICAgdmFyIHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycyA9IGxpc3RlbmVycy5nZXRTY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMoKTtcbiAgICAgICAgdmFyIGksIHNlbExpc3RlbmVyLCBpZHgsIHRvUmVtb3ZlZExpc3RlbmVycyA9IHRoaXMuX3RvUmVtb3ZlZExpc3RlbmVycztcblxuICAgICAgICBpZiAoc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSBzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBzZWxMaXN0ZW5lciA9IHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbExpc3RlbmVyLl9pc1JlZ2lzdGVyZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICBjYy5qcy5hcnJheS5yZW1vdmVBdChzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMsIGkpO1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiBpdGVtIGluIHRvUmVtb3ZlIGxpc3QsIHJlbW92ZSBpdCBmcm9tIHRoZSBsaXN0XG4gICAgICAgICAgICAgICAgICAgIGlkeCA9IHRvUmVtb3ZlZExpc3RlbmVycy5pbmRleE9mKHNlbExpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoaWR4ICE9PSAtMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvUmVtb3ZlZExpc3RlbmVycy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZml4ZWRQcmlvcml0eUxpc3RlbmVycykge1xuICAgICAgICAgICAgZm9yIChpID0gZml4ZWRQcmlvcml0eUxpc3RlbmVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIHNlbExpc3RlbmVyID0gZml4ZWRQcmlvcml0eUxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbExpc3RlbmVyLl9pc1JlZ2lzdGVyZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICBjYy5qcy5hcnJheS5yZW1vdmVBdChmaXhlZFByaW9yaXR5TGlzdGVuZXJzLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgaXRlbSBpbiB0b1JlbW92ZSBsaXN0LCByZW1vdmUgaXQgZnJvbSB0aGUgbGlzdFxuICAgICAgICAgICAgICAgICAgICBpZHggPSB0b1JlbW92ZWRMaXN0ZW5lcnMuaW5kZXhPZihzZWxMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgIGlmKGlkeCAhPT0gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICB0b1JlbW92ZWRMaXN0ZW5lcnMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycyAmJiBzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgbGlzdGVuZXJzLmNsZWFyU2NlbmVHcmFwaExpc3RlbmVycygpO1xuXG4gICAgICAgIGlmIChmaXhlZFByaW9yaXR5TGlzdGVuZXJzICYmIGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgbGlzdGVuZXJzLmNsZWFyRml4ZWRMaXN0ZW5lcnMoKTtcbiAgICB9LFxuXG4gICAgZnJhbWVVcGRhdGVMaXN0ZW5lcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGxvY0xpc3RlbmVyc01hcCA9IHRoaXMuX2xpc3RlbmVyc01hcCwgbG9jUHJpb3JpdHlEaXJ0eUZsYWdNYXAgPSB0aGlzLl9wcmlvcml0eURpcnR5RmxhZ01hcDtcbiAgICAgICAgZm9yICh2YXIgc2VsS2V5IGluIGxvY0xpc3RlbmVyc01hcCkge1xuICAgICAgICAgICAgaWYgKGxvY0xpc3RlbmVyc01hcFtzZWxLZXldLmVtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgbG9jUHJpb3JpdHlEaXJ0eUZsYWdNYXBbc2VsS2V5XTtcbiAgICAgICAgICAgICAgICBkZWxldGUgbG9jTGlzdGVuZXJzTWFwW3NlbEtleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbG9jVG9BZGRlZExpc3RlbmVycyA9IHRoaXMuX3RvQWRkZWRMaXN0ZW5lcnM7XG4gICAgICAgIGlmIChsb2NUb0FkZGVkTGlzdGVuZXJzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxvY1RvQWRkZWRMaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yY2VBZGRFdmVudExpc3RlbmVyKGxvY1RvQWRkZWRMaXN0ZW5lcnNbaV0pO1xuICAgICAgICAgICAgbG9jVG9BZGRlZExpc3RlbmVycy5sZW5ndGggPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl90b1JlbW92ZWRMaXN0ZW5lcnMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9jbGVhblRvUmVtb3ZlZExpc3RlbmVycygpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVUb3VjaExpc3RlbmVyczogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBsb2NJbkRpc3BhdGNoID0gdGhpcy5faW5EaXNwYXRjaDtcbiAgICAgICAgY2MuYXNzZXJ0SUQobG9jSW5EaXNwYXRjaCA+IDAsIDM1MDgpO1xuXG4gICAgICAgIGlmIChsb2NJbkRpc3BhdGNoID4gMSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB2YXIgbGlzdGVuZXJzO1xuICAgICAgICBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNNYXBbTGlzdGVuZXJJRC5UT1VDSF9PTkVfQllfT05FXTtcbiAgICAgICAgaWYgKGxpc3RlbmVycykge1xuICAgICAgICAgICAgdGhpcy5fb25VcGRhdGVMaXN0ZW5lcnMobGlzdGVuZXJzKTtcbiAgICAgICAgfVxuICAgICAgICBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNNYXBbTGlzdGVuZXJJRC5UT1VDSF9BTExfQVRfT05DRV07XG4gICAgICAgIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHRoaXMuX29uVXBkYXRlTGlzdGVuZXJzKGxpc3RlbmVycyk7XG4gICAgICAgIH1cblxuICAgICAgICBjYy5hc3NlcnRJRChsb2NJbkRpc3BhdGNoID09PSAxLCAzNTA5KTtcblxuICAgICAgICB2YXIgbG9jVG9BZGRlZExpc3RlbmVycyA9IHRoaXMuX3RvQWRkZWRMaXN0ZW5lcnM7XG4gICAgICAgIGlmIChsb2NUb0FkZGVkTGlzdGVuZXJzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxvY1RvQWRkZWRMaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yY2VBZGRFdmVudExpc3RlbmVyKGxvY1RvQWRkZWRMaXN0ZW5lcnNbaV0pO1xuICAgICAgICAgICAgdGhpcy5fdG9BZGRlZExpc3RlbmVycy5sZW5ndGggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX3RvUmVtb3ZlZExpc3RlbmVycy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2NsZWFuVG9SZW1vdmVkTGlzdGVuZXJzKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy9SZW1vdmUgYWxsIGxpc3RlbmVycyBpbiBfdG9SZW1vdmVMaXN0ZW5lcnMgbGlzdCBhbmQgY2xlYW51cFxuICAgIF9jbGVhblRvUmVtb3ZlZExpc3RlbmVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdG9SZW1vdmVkTGlzdGVuZXJzID0gdGhpcy5fdG9SZW1vdmVkTGlzdGVuZXJzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvUmVtb3ZlZExpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHNlbExpc3RlbmVyID0gdG9SZW1vdmVkTGlzdGVuZXJzW2ldO1xuICAgICAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc01hcFtzZWxMaXN0ZW5lci5fZ2V0TGlzdGVuZXJJRCgpXTtcbiAgICAgICAgICAgIGlmICghbGlzdGVuZXJzKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICB2YXIgaWR4LCBmaXhlZFByaW9yaXR5TGlzdGVuZXJzID0gbGlzdGVuZXJzLmdldEZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMoKSxcbiAgICAgICAgICAgICAgICBzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuZ2V0U2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgIGlmIChzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgICAgICBpZHggPSBzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMuaW5kZXhPZihzZWxMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgaWYgKGlkeCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmaXhlZFByaW9yaXR5TGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAgICAgaWR4ID0gZml4ZWRQcmlvcml0eUxpc3RlbmVycy5pbmRleE9mKHNlbExpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICBpZiAoaWR4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBmaXhlZFByaW9yaXR5TGlzdGVuZXJzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0b1JlbW92ZWRMaXN0ZW5lcnMubGVuZ3RoID0gMDtcbiAgICB9LFxuXG4gICAgX29uVG91Y2hFdmVudENhbGxiYWNrOiBmdW5jdGlvbiAobGlzdGVuZXIsIGFyZ3NPYmopIHtcbiAgICAgICAgLy8gU2tpcCBpZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWQuXG4gICAgICAgIGlmICghbGlzdGVuZXIuX2lzUmVnaXN0ZXJlZCgpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHZhciBldmVudCA9IGFyZ3NPYmouZXZlbnQsIHNlbFRvdWNoID0gZXZlbnQuY3VycmVudFRvdWNoO1xuICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0ID0gbGlzdGVuZXIuX25vZGU7XG5cbiAgICAgICAgdmFyIGlzQ2xhaW1lZCA9IGZhbHNlLCByZW1vdmVkSWR4O1xuICAgICAgICB2YXIgZ2V0Q29kZSA9IGV2ZW50LmdldEV2ZW50Q29kZSgpLCBFdmVudFRvdWNoID0gY2MuRXZlbnQuRXZlbnRUb3VjaDtcbiAgICAgICAgaWYgKGdldENvZGUgPT09IEV2ZW50VG91Y2guQkVHQU4pIHtcbiAgICAgICAgICAgIGlmICghY2MubWFjcm8uRU5BQkxFX01VTFRJX1RPVUNIICYmIGV2ZW50TWFuYWdlci5fY3VycmVudFRvdWNoKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5vZGUgPSBldmVudE1hbmFnZXIuX2N1cnJlbnRUb3VjaExpc3RlbmVyLl9ub2RlO1xuICAgICAgICAgICAgICAgIGlmIChub2RlICYmIG5vZGUuYWN0aXZlSW5IaWVyYXJjaHkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGxpc3RlbmVyLm9uVG91Y2hCZWdhbikge1xuICAgICAgICAgICAgICAgIGlzQ2xhaW1lZCA9IGxpc3RlbmVyLm9uVG91Y2hCZWdhbihzZWxUb3VjaCwgZXZlbnQpO1xuICAgICAgICAgICAgICAgIGlmIChpc0NsYWltZWQgJiYgbGlzdGVuZXIuX3JlZ2lzdGVyZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIuX2NsYWltZWRUb3VjaGVzLnB1c2goc2VsVG91Y2gpO1xuICAgICAgICAgICAgICAgICAgICBldmVudE1hbmFnZXIuX2N1cnJlbnRUb3VjaExpc3RlbmVyID0gbGlzdGVuZXI7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TWFuYWdlci5fY3VycmVudFRvdWNoID0gc2VsVG91Y2g7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGxpc3RlbmVyLl9jbGFpbWVkVG91Y2hlcy5sZW5ndGggPiAwXG4gICAgICAgICAgICAmJiAoKHJlbW92ZWRJZHggPSBsaXN0ZW5lci5fY2xhaW1lZFRvdWNoZXMuaW5kZXhPZihzZWxUb3VjaCkpICE9PSAtMSkpIHtcbiAgICAgICAgICAgIGlzQ2xhaW1lZCA9IHRydWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghY2MubWFjcm8uRU5BQkxFX01VTFRJX1RPVUNIICYmIGV2ZW50TWFuYWdlci5fY3VycmVudFRvdWNoICYmIGV2ZW50TWFuYWdlci5fY3VycmVudFRvdWNoICE9PSBzZWxUb3VjaCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGdldENvZGUgPT09IEV2ZW50VG91Y2guTU9WRUQgJiYgbGlzdGVuZXIub25Ub3VjaE1vdmVkKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIub25Ub3VjaE1vdmVkKHNlbFRvdWNoLCBldmVudCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGdldENvZGUgPT09IEV2ZW50VG91Y2guRU5ERUQpIHtcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIub25Ub3VjaEVuZGVkKVxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lci5vblRvdWNoRW5kZWQoc2VsVG91Y2gsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIuX3JlZ2lzdGVyZWQpXG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLl9jbGFpbWVkVG91Y2hlcy5zcGxpY2UocmVtb3ZlZElkeCwgMSk7XG4gICAgICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLl9jbGVhckN1clRvdWNoKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGdldENvZGUgPT09IEV2ZW50VG91Y2guQ0FOQ0VMRUQpIHtcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIub25Ub3VjaENhbmNlbGxlZClcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIub25Ub3VjaENhbmNlbGxlZChzZWxUb3VjaCwgZXZlbnQpO1xuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5fcmVnaXN0ZXJlZClcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIuX2NsYWltZWRUb3VjaGVzLnNwbGljZShyZW1vdmVkSWR4LCAxKTtcbiAgICAgICAgICAgICAgICBldmVudE1hbmFnZXIuX2NsZWFyQ3VyVG91Y2goKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZSBldmVudCB3YXMgc3RvcHBlZCwgcmV0dXJuIGRpcmVjdGx5LlxuICAgICAgICBpZiAoZXZlbnQuaXNTdG9wcGVkKCkpIHtcbiAgICAgICAgICAgIGV2ZW50TWFuYWdlci5fdXBkYXRlVG91Y2hMaXN0ZW5lcnMoZXZlbnQpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNDbGFpbWVkICYmIGxpc3RlbmVyLnN3YWxsb3dUb3VjaGVzKSB7XG4gICAgICAgICAgICBpZiAoYXJnc09iai5uZWVkc011dGFibGVTZXQpXG4gICAgICAgICAgICAgICAgYXJnc09iai50b3VjaGVzLnNwbGljZShzZWxUb3VjaCwgMSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIF9kaXNwYXRjaFRvdWNoRXZlbnQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB0aGlzLl9zb3J0RXZlbnRMaXN0ZW5lcnMoTGlzdGVuZXJJRC5UT1VDSF9PTkVfQllfT05FKTtcbiAgICAgICAgdGhpcy5fc29ydEV2ZW50TGlzdGVuZXJzKExpc3RlbmVySUQuVE9VQ0hfQUxMX0FUX09OQ0UpO1xuXG4gICAgICAgIHZhciBvbmVCeU9uZUxpc3RlbmVycyA9IHRoaXMuX2dldExpc3RlbmVycyhMaXN0ZW5lcklELlRPVUNIX09ORV9CWV9PTkUpO1xuICAgICAgICB2YXIgYWxsQXRPbmNlTGlzdGVuZXJzID0gdGhpcy5fZ2V0TGlzdGVuZXJzKExpc3RlbmVySUQuVE9VQ0hfQUxMX0FUX09OQ0UpO1xuXG4gICAgICAgIC8vIElmIHRoZXJlIGFyZW4ndCBhbnkgdG91Y2ggbGlzdGVuZXJzLCByZXR1cm4gZGlyZWN0bHkuXG4gICAgICAgIGlmIChudWxsID09PSBvbmVCeU9uZUxpc3RlbmVycyAmJiBudWxsID09PSBhbGxBdE9uY2VMaXN0ZW5lcnMpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdmFyIG9yaWdpbmFsVG91Y2hlcyA9IGV2ZW50LmdldFRvdWNoZXMoKSwgbXV0YWJsZVRvdWNoZXMgPSBjYy5qcy5hcnJheS5jb3B5KG9yaWdpbmFsVG91Y2hlcyk7XG4gICAgICAgIHZhciBvbmVCeU9uZUFyZ3NPYmogPSB7ZXZlbnQ6IGV2ZW50LCBuZWVkc011dGFibGVTZXQ6IChvbmVCeU9uZUxpc3RlbmVycyAmJiBhbGxBdE9uY2VMaXN0ZW5lcnMpLCB0b3VjaGVzOiBtdXRhYmxlVG91Y2hlcywgc2VsVG91Y2g6IG51bGx9O1xuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIHByb2Nlc3MgdGhlIHRhcmdldCBoYW5kbGVycyAxc3RcbiAgICAgICAgLy9cbiAgICAgICAgaWYgKG9uZUJ5T25lTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9yaWdpbmFsVG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGV2ZW50LmN1cnJlbnRUb3VjaCA9IG9yaWdpbmFsVG91Y2hlc1tpXTtcbiAgICAgICAgICAgICAgICBldmVudC5fcHJvcGFnYXRpb25TdG9wcGVkID0gZXZlbnQuX3Byb3BhZ2F0aW9uSW1tZWRpYXRlU3RvcHBlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnRUb0xpc3RlbmVycyhvbmVCeU9uZUxpc3RlbmVycywgdGhpcy5fb25Ub3VjaEV2ZW50Q2FsbGJhY2ssIG9uZUJ5T25lQXJnc09iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL1xuICAgICAgICAvLyBwcm9jZXNzIHN0YW5kYXJkIGhhbmRsZXJzIDJuZFxuICAgICAgICAvL1xuICAgICAgICBpZiAoYWxsQXRPbmNlTGlzdGVuZXJzICYmIG11dGFibGVUb3VjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnRUb0xpc3RlbmVycyhhbGxBdE9uY2VMaXN0ZW5lcnMsIHRoaXMuX29uVG91Y2hlc0V2ZW50Q2FsbGJhY2ssIHtldmVudDogZXZlbnQsIHRvdWNoZXM6IG11dGFibGVUb3VjaGVzfSk7XG4gICAgICAgICAgICBpZiAoZXZlbnQuaXNTdG9wcGVkKCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VwZGF0ZVRvdWNoTGlzdGVuZXJzKGV2ZW50KTtcbiAgICB9LFxuXG4gICAgX29uVG91Y2hlc0V2ZW50Q2FsbGJhY2s6IGZ1bmN0aW9uIChsaXN0ZW5lciwgY2FsbGJhY2tQYXJhbXMpIHtcbiAgICAgICAgLy8gU2tpcCBpZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWQuXG4gICAgICAgIGlmICghbGlzdGVuZXIuX3JlZ2lzdGVyZWQpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgdmFyIEV2ZW50VG91Y2ggPSBjYy5FdmVudC5FdmVudFRvdWNoLCBldmVudCA9IGNhbGxiYWNrUGFyYW1zLmV2ZW50LCB0b3VjaGVzID0gY2FsbGJhY2tQYXJhbXMudG91Y2hlcywgZ2V0Q29kZSA9IGV2ZW50LmdldEV2ZW50Q29kZSgpO1xuICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0ID0gbGlzdGVuZXIuX25vZGU7XG4gICAgICAgIGlmIChnZXRDb2RlID09PSBFdmVudFRvdWNoLkJFR0FOICYmIGxpc3RlbmVyLm9uVG91Y2hlc0JlZ2FuKVxuICAgICAgICAgICAgbGlzdGVuZXIub25Ub3VjaGVzQmVnYW4odG91Y2hlcywgZXZlbnQpO1xuICAgICAgICBlbHNlIGlmIChnZXRDb2RlID09PSBFdmVudFRvdWNoLk1PVkVEICYmIGxpc3RlbmVyLm9uVG91Y2hlc01vdmVkKVxuICAgICAgICAgICAgbGlzdGVuZXIub25Ub3VjaGVzTW92ZWQodG91Y2hlcywgZXZlbnQpO1xuICAgICAgICBlbHNlIGlmIChnZXRDb2RlID09PSBFdmVudFRvdWNoLkVOREVEICYmIGxpc3RlbmVyLm9uVG91Y2hlc0VuZGVkKVxuICAgICAgICAgICAgbGlzdGVuZXIub25Ub3VjaGVzRW5kZWQodG91Y2hlcywgZXZlbnQpO1xuICAgICAgICBlbHNlIGlmIChnZXRDb2RlID09PSBFdmVudFRvdWNoLkNBTkNFTEVEICYmIGxpc3RlbmVyLm9uVG91Y2hlc0NhbmNlbGxlZClcbiAgICAgICAgICAgIGxpc3RlbmVyLm9uVG91Y2hlc0NhbmNlbGxlZCh0b3VjaGVzLCBldmVudCk7XG5cbiAgICAgICAgLy8gSWYgdGhlIGV2ZW50IHdhcyBzdG9wcGVkLCByZXR1cm4gZGlyZWN0bHkuXG4gICAgICAgIGlmIChldmVudC5pc1N0b3BwZWQoKSkge1xuICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLl91cGRhdGVUb3VjaExpc3RlbmVycyhldmVudCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIF9hc3NvY2lhdGVOb2RlQW5kRXZlbnRMaXN0ZW5lcjogZnVuY3Rpb24gKG5vZGUsIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ub2RlTGlzdGVuZXJzTWFwW25vZGUuX2lkXTtcbiAgICAgICAgaWYgKCFsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGxpc3RlbmVycyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fbm9kZUxpc3RlbmVyc01hcFtub2RlLl9pZF0gPSBsaXN0ZW5lcnM7XG4gICAgICAgIH1cbiAgICAgICAgbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgIH0sXG5cbiAgICBfZGlzc29jaWF0ZU5vZGVBbmRFdmVudExpc3RlbmVyOiBmdW5jdGlvbiAobm9kZSwgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX25vZGVMaXN0ZW5lcnNNYXBbbm9kZS5faWRdO1xuICAgICAgICBpZiAobGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBjYy5qcy5hcnJheS5yZW1vdmUobGlzdGVuZXJzLCBsaXN0ZW5lcik7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fbm9kZUxpc3RlbmVyc01hcFtub2RlLl9pZF07XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2Rpc3BhdGNoRXZlbnRUb0xpc3RlbmVyczogZnVuY3Rpb24gKGxpc3RlbmVycywgb25FdmVudCwgZXZlbnRPckFyZ3MpIHtcbiAgICAgICAgdmFyIHNob3VsZFN0b3BQcm9wYWdhdGlvbiA9IGZhbHNlO1xuICAgICAgICB2YXIgZml4ZWRQcmlvcml0eUxpc3RlbmVycyA9IGxpc3RlbmVycy5nZXRGaXhlZFByaW9yaXR5TGlzdGVuZXJzKCk7XG4gICAgICAgIHZhciBzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuZ2V0U2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzKCk7XG5cbiAgICAgICAgdmFyIGkgPSAwLCBqLCBzZWxMaXN0ZW5lcjtcbiAgICAgICAgaWYgKGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMpIHsgIC8vIHByaW9yaXR5IDwgMFxuICAgICAgICAgICAgaWYgKGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgZm9yICg7IGkgPCBsaXN0ZW5lcnMuZ3QwSW5kZXg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxMaXN0ZW5lciA9IGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxMaXN0ZW5lci5pc0VuYWJsZWQoKSAmJiAhc2VsTGlzdGVuZXIuX2lzUGF1c2VkKCkgJiYgc2VsTGlzdGVuZXIuX2lzUmVnaXN0ZXJlZCgpICYmIG9uRXZlbnQoc2VsTGlzdGVuZXIsIGV2ZW50T3JBcmdzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkU3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycyAmJiAhc2hvdWxkU3RvcFByb3BhZ2F0aW9uKSB7ICAgIC8vIHByaW9yaXR5ID09IDAsIHNjZW5lIGdyYXBoIHByaW9yaXR5XG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgc2VsTGlzdGVuZXIgPSBzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnNbal07XG4gICAgICAgICAgICAgICAgaWYgKHNlbExpc3RlbmVyLmlzRW5hYmxlZCgpICYmICFzZWxMaXN0ZW5lci5faXNQYXVzZWQoKSAmJiBzZWxMaXN0ZW5lci5faXNSZWdpc3RlcmVkKCkgJiYgb25FdmVudChzZWxMaXN0ZW5lciwgZXZlbnRPckFyZ3MpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNob3VsZFN0b3BQcm9wYWdhdGlvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaXhlZFByaW9yaXR5TGlzdGVuZXJzICYmICFzaG91bGRTdG9wUHJvcGFnYXRpb24pIHsgICAgLy8gcHJpb3JpdHkgPiAwXG4gICAgICAgICAgICBmb3IgKDsgaSA8IGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBzZWxMaXN0ZW5lciA9IGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKHNlbExpc3RlbmVyLmlzRW5hYmxlZCgpICYmICFzZWxMaXN0ZW5lci5faXNQYXVzZWQoKSAmJiBzZWxMaXN0ZW5lci5faXNSZWdpc3RlcmVkKCkgJiYgb25FdmVudChzZWxMaXN0ZW5lciwgZXZlbnRPckFyZ3MpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNob3VsZFN0b3BQcm9wYWdhdGlvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfc2V0RGlydHk6IGZ1bmN0aW9uIChsaXN0ZW5lcklELCBmbGFnKSB7XG4gICAgICAgIHZhciBsb2NEaXJ0eUZsYWdNYXAgPSB0aGlzLl9wcmlvcml0eURpcnR5RmxhZ01hcDtcbiAgICAgICAgaWYgKGxvY0RpcnR5RmxhZ01hcFtsaXN0ZW5lcklEXSA9PSBudWxsKVxuICAgICAgICAgICAgbG9jRGlydHlGbGFnTWFwW2xpc3RlbmVySURdID0gZmxhZztcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbG9jRGlydHlGbGFnTWFwW2xpc3RlbmVySURdID0gZmxhZyB8IGxvY0RpcnR5RmxhZ01hcFtsaXN0ZW5lcklEXTtcbiAgICB9LFxuXG4gICAgX3NvcnROdW1iZXJBc2M6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHJldHVybiBhIC0gYjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBRdWVyeSB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgZXZlbnQgbGlzdGVuZXIgaWQgaGFzIGJlZW4gYWRkZWQuXG4gICAgICogISN6aCDmn6Xor6LmjIflrprnmoTkuovku7YgSUQg5piv5ZCm5a2Y5ZyoXG4gICAgICogQG1ldGhvZCBoYXNFdmVudExpc3RlbmVyXG4gICAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBsaXN0ZW5lcklEIC0gVGhlIGxpc3RlbmVyIGlkLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgb3IgZmFsc2VcbiAgICAgKi9cbiAgICBoYXNFdmVudExpc3RlbmVyOiBmdW5jdGlvbiAobGlzdGVuZXJJRCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9nZXRMaXN0ZW5lcnMobGlzdGVuZXJJRCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiA8cD5cbiAgICAgKiBBZGRzIGEgZXZlbnQgbGlzdGVuZXIgZm9yIGEgc3BlY2lmaWVkIGV2ZW50Ljxici8+XG4gICAgICogaWYgdGhlIHBhcmFtZXRlciBcIm5vZGVPclByaW9yaXR5XCIgaXMgYSBub2RlLFxuICAgICAqIGl0IG1lYW5zIHRvIGFkZCBhIGV2ZW50IGxpc3RlbmVyIGZvciBhIHNwZWNpZmllZCBldmVudCB3aXRoIHRoZSBwcmlvcml0eSBvZiBzY2VuZSBncmFwaC48YnIvPlxuICAgICAqIGlmIHRoZSBwYXJhbWV0ZXIgXCJub2RlT3JQcmlvcml0eVwiIGlzIGEgTnVtYmVyLFxuICAgICAqIGl0IG1lYW5zIHRvIGFkZCBhIGV2ZW50IGxpc3RlbmVyIGZvciBhIHNwZWNpZmllZCBldmVudCB3aXRoIHRoZSBmaXhlZCBwcmlvcml0eS48YnIvPlxuICAgICAqIDwvcD5cbiAgICAgKiAhI3poXG4gICAgICog5bCG5LqL5Lu255uR5ZCs5Zmo5re75Yqg5Yiw5LqL5Lu2566h55CG5Zmo5Lit44CCPGJyLz5cbiAgICAgKiDlpoLmnpzlj4LmlbAg4oCcbm9kZU9yUHJpb3JpdHnigJ0g5piv6IqC54K577yM5LyY5YWI57qn55SxIG5vZGUg55qE5riy5p+T6aG65bqP5Yaz5a6a77yM5pi+56S65Zyo5LiK5bGC55qE6IqC54K55bCG5LyY5YWI5pS25Yiw5LqL5Lu244CCPGJyLz5cbiAgICAgKiDlpoLmnpzlj4LmlbAg4oCcbm9kZU9yUHJpb3JpdHnigJ0g5piv5pWw5a2X77yM5LyY5YWI57qn5YiZ5Zu65a6a5Li66K+l5Y+C5pWw55qE5pWw5YC877yM5pWw5a2X6LaK5bCP77yM5LyY5YWI57qn6LaK6auY44CCPGJyLz5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgYWRkTGlzdGVuZXJcbiAgICAgKiBAcGFyYW0ge0V2ZW50TGlzdGVuZXJ8T2JqZWN0fSBsaXN0ZW5lciAtIFRoZSBsaXN0ZW5lciBvZiBhIHNwZWNpZmllZCBldmVudCBvciBhIG9iamVjdCBvZiBzb21lIGV2ZW50IHBhcmFtZXRlcnMuXG4gICAgICogQHBhcmFtIHtOb2RlfE51bWJlcn0gbm9kZU9yUHJpb3JpdHkgLSBUaGUgcHJpb3JpdHkgb2YgdGhlIGxpc3RlbmVyIGlzIGJhc2VkIG9uIHRoZSBkcmF3IG9yZGVyIG9mIHRoaXMgbm9kZSBvciBmaXhlZFByaW9yaXR5IFRoZSBmaXhlZCBwcmlvcml0eSBvZiB0aGUgbGlzdGVuZXIuXG4gICAgICogQG5vdGUgIFRoZSBwcmlvcml0eSBvZiBzY2VuZSBncmFwaCB3aWxsIGJlIGZpeGVkIHZhbHVlIDAuIFNvIHRoZSBvcmRlciBvZiBsaXN0ZW5lciBpdGVtIGluIHRoZSB2ZWN0b3Igd2lsbCBiZSAnIDwwLCBzY2VuZSBncmFwaCAoMCBwcmlvcml0eSksID4wJy5cbiAgICAgKiAgICAgICAgIEEgbG93ZXIgcHJpb3JpdHkgd2lsbCBiZSBjYWxsZWQgYmVmb3JlIHRoZSBvbmVzIHRoYXQgaGF2ZSBhIGhpZ2hlciB2YWx1ZS4gMCBwcmlvcml0eSBpcyBmb3JiaWRkZW4gZm9yIGZpeGVkIHByaW9yaXR5IHNpbmNlIGl0J3MgdXNlZCBmb3Igc2NlbmUgZ3JhcGggYmFzZWQgcHJpb3JpdHkuXG4gICAgICogICAgICAgICBUaGUgbGlzdGVuZXIgbXVzdCBiZSBhIGNjLkV2ZW50TGlzdGVuZXIgb2JqZWN0IHdoZW4gYWRkaW5nIGEgZml4ZWQgcHJpb3JpdHkgbGlzdGVuZXIsIGJlY2F1c2Ugd2UgY2FuJ3QgcmVtb3ZlIGEgZml4ZWQgcHJpb3JpdHkgbGlzdGVuZXIgd2l0aG91dCB0aGUgbGlzdGVuZXIgaGFuZGxlcixcbiAgICAgKiAgICAgICAgIGV4Y2VwdCBjYWxscyByZW1vdmVBbGxMaXN0ZW5lcnMoKS5cbiAgICAgKiBAcmV0dXJuIHtFdmVudExpc3RlbmVyfSBSZXR1cm4gdGhlIGxpc3RlbmVyLiBOZWVkZWQgaW4gb3JkZXIgdG8gcmVtb3ZlIHRoZSBldmVudCBmcm9tIHRoZSBkaXNwYXRjaGVyLlxuICAgICAqL1xuICAgIGFkZExpc3RlbmVyOiBmdW5jdGlvbiAobGlzdGVuZXIsIG5vZGVPclByaW9yaXR5KSB7XG4gICAgICAgIGNjLmFzc2VydElEKGxpc3RlbmVyICYmIG5vZGVPclByaW9yaXR5LCAzNTAzKTtcbiAgICAgICAgaWYgKCEoY2MuanMuaXNOdW1iZXIobm9kZU9yUHJpb3JpdHkpIHx8IG5vZGVPclByaW9yaXR5IGluc3RhbmNlb2YgY2MuX0Jhc2VOb2RlKSkge1xuICAgICAgICAgICAgY2Mud2FybklEKDM1MDYpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKGxpc3RlbmVyIGluc3RhbmNlb2YgY2MuRXZlbnRMaXN0ZW5lcikpIHtcbiAgICAgICAgICAgIGNjLmFzc2VydElEKCFjYy5qcy5pc051bWJlcihub2RlT3JQcmlvcml0eSksIDM1MDQpO1xuICAgICAgICAgICAgbGlzdGVuZXIgPSBjYy5FdmVudExpc3RlbmVyLmNyZWF0ZShsaXN0ZW5lcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXIuX2lzUmVnaXN0ZXJlZCgpKSB7XG4gICAgICAgICAgICAgICAgY2MubG9nSUQoMzUwNSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFsaXN0ZW5lci5jaGVja0F2YWlsYWJsZSgpKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGlmIChjYy5qcy5pc051bWJlcihub2RlT3JQcmlvcml0eSkpIHtcbiAgICAgICAgICAgIGlmIChub2RlT3JQcmlvcml0eSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNjLmxvZ0lEKDM1MDApO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlzdGVuZXIuX3NldFNjZW5lR3JhcGhQcmlvcml0eShudWxsKTtcbiAgICAgICAgICAgIGxpc3RlbmVyLl9zZXRGaXhlZFByaW9yaXR5KG5vZGVPclByaW9yaXR5KTtcbiAgICAgICAgICAgIGxpc3RlbmVyLl9zZXRSZWdpc3RlcmVkKHRydWUpO1xuICAgICAgICAgICAgbGlzdGVuZXIuX3NldFBhdXNlZChmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLl9hZGRMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsaXN0ZW5lci5fc2V0U2NlbmVHcmFwaFByaW9yaXR5KG5vZGVPclByaW9yaXR5KTtcbiAgICAgICAgICAgIGxpc3RlbmVyLl9zZXRGaXhlZFByaW9yaXR5KDApO1xuICAgICAgICAgICAgbGlzdGVuZXIuX3NldFJlZ2lzdGVyZWQodHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLl9hZGRMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogISNlbiBBZGRzIGEgQ3VzdG9tIGV2ZW50IGxpc3RlbmVyLiBJdCB3aWxsIHVzZSBhIGZpeGVkIHByaW9yaXR5IG9mIDEuXG4gICAgICogISN6aCDlkJHkuovku7bnrqHnkIblmajmt7vliqDkuIDkuKroh6rlrprkuYnkuovku7bnm5HlkKzlmajjgIJcbiAgICAgKiBAbWV0aG9kIGFkZEN1c3RvbUxpc3RlbmVyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICogQHJldHVybiB7RXZlbnRMaXN0ZW5lcn0gdGhlIGdlbmVyYXRlZCBldmVudC4gTmVlZGVkIGluIG9yZGVyIHRvIHJlbW92ZSB0aGUgZXZlbnQgZnJvbSB0aGUgZGlzcGF0Y2hlclxuICAgICAqL1xuICAgIGFkZEN1c3RvbUxpc3RlbmVyOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgbGlzdGVuZXIgPSBuZXcgY2MuRXZlbnRMaXN0ZW5lci5jcmVhdGUoe1xuICAgICAgICAgICAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuQ1VTVE9NLFxuICAgICAgICAgICAgZXZlbnROYW1lOiBldmVudE5hbWUsIFxuICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmFkZExpc3RlbmVyKGxpc3RlbmVyLCAxKTtcbiAgICAgICAgcmV0dXJuIGxpc3RlbmVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJlbW92ZSBhIGxpc3RlbmVyLlxuICAgICAqICEjemgg56e76Zmk5LiA5Liq5bey5re75Yqg55qE55uR5ZCs5Zmo44CCXG4gICAgICogQG1ldGhvZCByZW1vdmVMaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7RXZlbnRMaXN0ZW5lcn0gbGlzdGVuZXIgLSBhbiBldmVudCBsaXN0ZW5lciBvciBhIHJlZ2lzdGVyZWQgbm9kZSB0YXJnZXRcbiAgICAgKiBAZXhhbXBsZSB7QGxpbmsgY29jb3MyZC9jb3JlL2V2ZW50LW1hbmFnZXIvQ0NFdmVudE1hbmFnZXIvcmVtb3ZlTGlzdGVuZXIuanN9XG4gICAgICovXG4gICAgcmVtb3ZlTGlzdGVuZXI6IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgICBpZiAobGlzdGVuZXIgPT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB2YXIgaXNGb3VuZCwgbG9jTGlzdGVuZXIgPSB0aGlzLl9saXN0ZW5lcnNNYXA7XG4gICAgICAgIGZvciAodmFyIHNlbEtleSBpbiBsb2NMaXN0ZW5lcikge1xuICAgICAgICAgICAgdmFyIGxpc3RlbmVycyA9IGxvY0xpc3RlbmVyW3NlbEtleV07XG4gICAgICAgICAgICB2YXIgZml4ZWRQcmlvcml0eUxpc3RlbmVycyA9IGxpc3RlbmVycy5nZXRGaXhlZFByaW9yaXR5TGlzdGVuZXJzKCksIHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycyA9IGxpc3RlbmVycy5nZXRTY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgaXNGb3VuZCA9IHRoaXMuX3JlbW92ZUxpc3RlbmVySW5WZWN0b3Ioc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzLCBsaXN0ZW5lcik7XG4gICAgICAgICAgICBpZiAoaXNGb3VuZCl7XG4gICAgICAgICAgICAgICAgLy8gZml4ZWQgIzQxNjA6IERpcnR5IGZsYWcgbmVlZCB0byBiZSB1cGRhdGVkIGFmdGVyIGxpc3RlbmVycyB3ZXJlIHJlbW92ZWQuXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0RGlydHkobGlzdGVuZXIuX2dldExpc3RlbmVySUQoKSwgdGhpcy5ESVJUWV9TQ0VORV9HUkFQSF9QUklPUklUWSk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBpc0ZvdW5kID0gdGhpcy5fcmVtb3ZlTGlzdGVuZXJJblZlY3RvcihmaXhlZFByaW9yaXR5TGlzdGVuZXJzLCBsaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgaWYgKGlzRm91bmQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldERpcnR5KGxpc3RlbmVyLl9nZXRMaXN0ZW5lcklEKCksIHRoaXMuRElSVFlfRklYRURfUFJJT1JJVFkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzLmVtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fcHJpb3JpdHlEaXJ0eUZsYWdNYXBbbGlzdGVuZXIuX2dldExpc3RlbmVySUQoKV07XG4gICAgICAgICAgICAgICAgZGVsZXRlIGxvY0xpc3RlbmVyW3NlbEtleV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpc0ZvdW5kKVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc0ZvdW5kKSB7XG4gICAgICAgICAgICB2YXIgbG9jVG9BZGRlZExpc3RlbmVycyA9IHRoaXMuX3RvQWRkZWRMaXN0ZW5lcnM7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gbG9jVG9BZGRlZExpc3RlbmVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxMaXN0ZW5lciA9IGxvY1RvQWRkZWRMaXN0ZW5lcnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKHNlbExpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgICAgICBjYy5qcy5hcnJheS5yZW1vdmVBdChsb2NUb0FkZGVkTGlzdGVuZXJzLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsTGlzdGVuZXIuX3NldFJlZ2lzdGVyZWQoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jdXJyZW50VG91Y2hMaXN0ZW5lciA9PT0gbGlzdGVuZXIgJiYgdGhpcy5fY2xlYXJDdXJUb3VjaCgpO1xuICAgIH0sXG5cbiAgICBfY2xlYXJDdXJUb3VjaCAoKSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRUb3VjaExpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY3VycmVudFRvdWNoID0gbnVsbDtcbiAgICB9LFxuXG4gICAgX3JlbW92ZUxpc3RlbmVySW5DYWxsYmFjazogZnVuY3Rpb24obGlzdGVuZXJzLCBjYWxsYmFjayl7XG4gICAgICAgIGlmIChsaXN0ZW5lcnMgPT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICBmb3IgKHZhciBpID0gbGlzdGVuZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB2YXIgc2VsTGlzdGVuZXIgPSBsaXN0ZW5lcnNbaV07XG4gICAgICAgICAgICBpZiAoc2VsTGlzdGVuZXIuX29uQ3VzdG9tRXZlbnQgPT09IGNhbGxiYWNrIHx8IHNlbExpc3RlbmVyLl9vbkV2ZW50ID09PSBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHNlbExpc3RlbmVyLl9zZXRSZWdpc3RlcmVkKGZhbHNlKTtcbiAgICAgICAgICAgICAgICBpZiAoc2VsTGlzdGVuZXIuX2dldFNjZW5lR3JhcGhQcmlvcml0eSgpICE9IG51bGwpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXNzb2NpYXRlTm9kZUFuZEV2ZW50TGlzdGVuZXIoc2VsTGlzdGVuZXIuX2dldFNjZW5lR3JhcGhQcmlvcml0eSgpLCBzZWxMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgIHNlbExpc3RlbmVyLl9zZXRTY2VuZUdyYXBoUHJpb3JpdHkobnVsbCk7ICAgICAgICAgLy8gTlVMTCBvdXQgdGhlIG5vZGUgcG9pbnRlciBzbyB3ZSBkb24ndCBoYXZlIGFueSBkYW5nbGluZyBwb2ludGVycyB0byBkZXN0cm95ZWQgbm9kZXMuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2luRGlzcGF0Y2ggPT09IDApXG4gICAgICAgICAgICAgICAgICAgIGNjLmpzLmFycmF5LnJlbW92ZUF0KGxpc3RlbmVycywgaSk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90b1JlbW92ZWRMaXN0ZW5lcnMucHVzaChzZWxMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBfcmVtb3ZlTGlzdGVuZXJJblZlY3RvcjogZnVuY3Rpb24gKGxpc3RlbmVycywgbGlzdGVuZXIpIHtcbiAgICAgICAgaWYgKGxpc3RlbmVycyA9PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSBsaXN0ZW5lcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHZhciBzZWxMaXN0ZW5lciA9IGxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgIGlmIChzZWxMaXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBzZWxMaXN0ZW5lci5fc2V0UmVnaXN0ZXJlZChmYWxzZSk7XG4gICAgICAgICAgICAgICAgaWYgKHNlbExpc3RlbmVyLl9nZXRTY2VuZUdyYXBoUHJpb3JpdHkoKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3NvY2lhdGVOb2RlQW5kRXZlbnRMaXN0ZW5lcihzZWxMaXN0ZW5lci5fZ2V0U2NlbmVHcmFwaFByaW9yaXR5KCksIHNlbExpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsTGlzdGVuZXIuX3NldFNjZW5lR3JhcGhQcmlvcml0eShudWxsKTsgICAgICAgICAvLyBOVUxMIG91dCB0aGUgbm9kZSBwb2ludGVyIHNvIHdlIGRvbid0IGhhdmUgYW55IGRhbmdsaW5nIHBvaW50ZXJzIHRvIGRlc3Ryb3llZCBub2Rlcy5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faW5EaXNwYXRjaCA9PT0gMClcbiAgICAgICAgICAgICAgICAgICAgY2MuanMuYXJyYXkucmVtb3ZlQXQobGlzdGVuZXJzLCBpKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RvUmVtb3ZlZExpc3RlbmVycy5wdXNoKHNlbExpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmVtb3ZlcyBhbGwgbGlzdGVuZXJzIHdpdGggdGhlIHNhbWUgZXZlbnQgbGlzdGVuZXIgdHlwZSBvciByZW1vdmVzIGFsbCBsaXN0ZW5lcnMgb2YgYSBub2RlLlxuICAgICAqICEjemhcbiAgICAgKiDnp7vpmaTms6jlhozliLAgZXZlbnRNYW5hZ2VyIOS4reaMh+Wumuexu+Wei+eahOaJgOacieS6i+S7tuebkeWQrOWZqOOAgjxici8+XG4gICAgICogMS4g5aaC5p6c5Lyg5YWl55qE56ys5LiA5Liq5Y+C5pWw57G75Z6L5pivIE5vZGXvvIzpgqPkuYjkuovku7bnrqHnkIblmajlsIbnp7vpmaTkuI7or6Xlr7nosaHnm7jlhbPnmoTmiYDmnInkuovku7bnm5HlkKzlmajjgIJcbiAgICAgKiDvvIjlpoLmnpznrKzkuozlj4LmlbAgcmVjdXJzaXZlIOaYryB0cnVlIOeahOivne+8jOWwseS8mui/nuWQjOivpeWvueixoeeahOWtkOaOp+S7tuS4iuaJgOacieeahOS6i+S7tuebkeWQrOWZqOS5n+S4gOW5tuenu+mZpO+8iTxici8+XG4gICAgICogMi4g5aaC5p6c5Lyg5YWl55qE56ys5LiA5Liq5Y+C5pWw57G75Z6L5pivIE51bWJlcu+8iOivpeexu+WeiyBFdmVudExpc3RlbmVyIOS4reWumuS5ieeahOS6i+S7tuexu+Wei++8ie+8jFxuICAgICAqIOmCo+S5iOS6i+S7tueuoeeQhuWZqOWwhuenu+mZpOivpeexu+Wei+eahOaJgOacieS6i+S7tuebkeWQrOWZqOOAgjxici8+XG4gICAgICpcbiAgICAgKiDkuIvliJfmmK/nm67liY3lrZjlnKjnm5HlkKzlmajnsbvlnovvvJogICAgICAgPGJyLz5cbiAgICAgKiBjYy5FdmVudExpc3RlbmVyLlVOS05PV04gICAgICAgPGJyLz5cbiAgICAgKiBjYy5FdmVudExpc3RlbmVyLktFWUJPQVJEICAgICAgPGJyLz5cbiAgICAgKiBjYy5FdmVudExpc3RlbmVyLkFDQ0VMRVJBVElPTu+8jDxici8+XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJlbW92ZUxpc3RlbmVyc1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfE5vZGV9IGxpc3RlbmVyVHlwZSAtIGxpc3RlbmVyVHlwZSBvciBhIG5vZGVcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtyZWN1cnNpdmU9ZmFsc2VdXG4gICAgICovXG4gICAgcmVtb3ZlTGlzdGVuZXJzOiBmdW5jdGlvbiAobGlzdGVuZXJUeXBlLCByZWN1cnNpdmUpIHtcbiAgICAgICAgdmFyIGksIF90ID0gdGhpcztcbiAgICAgICAgaWYgKCEoY2MuanMuaXNOdW1iZXIobGlzdGVuZXJUeXBlKSB8fCBsaXN0ZW5lclR5cGUgaW5zdGFuY2VvZiBjYy5fQmFzZU5vZGUpKSB7XG4gICAgICAgICAgICBjYy53YXJuSUQoMzUwNik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpc3RlbmVyVHlwZS5faWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gRW5zdXJlIHRoZSBub2RlIGlzIHJlbW92ZWQgZnJvbSB0aGVzZSBpbW1lZGlhdGVseSBhbHNvLlxuICAgICAgICAgICAgLy8gRG9uJ3Qgd2FudCBhbnkgZGFuZ2xpbmcgcG9pbnRlcnMgb3IgdGhlIHBvc3NpYmlsaXR5IG9mIGRlYWxpbmcgd2l0aCBkZWxldGVkIG9iamVjdHMuLlxuICAgICAgICAgICAgdmFyIGxpc3RlbmVycyA9IF90Ll9ub2RlTGlzdGVuZXJzTWFwW2xpc3RlbmVyVHlwZS5faWRdLCBpO1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVycykge1xuICAgICAgICAgICAgICAgIHZhciBsaXN0ZW5lcnNDb3B5ID0gY2MuanMuYXJyYXkuY29weShsaXN0ZW5lcnMpO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0ZW5lcnNDb3B5Lmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgICAgICAgICBfdC5yZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcnNDb3B5W2ldKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgX3QuX25vZGVMaXN0ZW5lcnNNYXBbbGlzdGVuZXJUeXBlLl9pZF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEJ1ZyBmaXg6IGVuc3VyZSB0aGVyZSBhcmUgbm8gcmVmZXJlbmNlcyB0byB0aGUgbm9kZSBpbiB0aGUgbGlzdCBvZiBsaXN0ZW5lcnMgdG8gYmUgYWRkZWQuXG4gICAgICAgICAgICAvLyBJZiB3ZSBmaW5kIGFueSBsaXN0ZW5lcnMgYXNzb2NpYXRlZCB3aXRoIHRoZSBkZXN0cm95ZWQgbm9kZSBpbiB0aGlzIGxpc3QgdGhlbiByZW1vdmUgdGhlbS5cbiAgICAgICAgICAgIC8vIFRoaXMgaXMgdG8gY2F0Y2ggdGhlIHNjZW5hcmlvIHdoZXJlIHRoZSBub2RlIGdldHMgZGVzdHJveWVkIGJlZm9yZSBpdCdzIGxpc3RlbmVyXG4gICAgICAgICAgICAvLyBpcyBhZGRlZCBpbnRvIHRoZSBldmVudCBkaXNwYXRjaGVyIGZ1bGx5LiBUaGlzIGNvdWxkIGhhcHBlbiBpZiBhIG5vZGUgcmVnaXN0ZXJzIGEgbGlzdGVuZXJcbiAgICAgICAgICAgIC8vIGFuZCBnZXRzIGRlc3Ryb3llZCB3aGlsZSB3ZSBhcmUgZGlzcGF0Y2hpbmcgYW4gZXZlbnQgKHRvdWNoIGV0Yy4pXG4gICAgICAgICAgICB2YXIgbG9jVG9BZGRlZExpc3RlbmVycyA9IF90Ll90b0FkZGVkTGlzdGVuZXJzO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxvY1RvQWRkZWRMaXN0ZW5lcnMubGVuZ3RoOyApIHtcbiAgICAgICAgICAgICAgICB2YXIgbGlzdGVuZXIgPSBsb2NUb0FkZGVkTGlzdGVuZXJzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5fZ2V0U2NlbmVHcmFwaFByaW9yaXR5KCkgPT09IGxpc3RlbmVyVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lci5fc2V0U2NlbmVHcmFwaFByaW9yaXR5KG51bGwpOyAgICAgICAgICAgICAgICAgICAgICAvLyBFbnN1cmUgbm8gZGFuZ2xpbmcgcHRyIHRvIHRoZSB0YXJnZXQgbm9kZS5cbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIuX3NldFJlZ2lzdGVyZWQoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBsb2NUb0FkZGVkTGlzdGVuZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICAgICAgKytpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmVjdXJzaXZlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxvY0NoaWxkcmVuID0gbGlzdGVuZXJUeXBlLmNoaWxkcmVuLCBsZW47XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gbG9jQ2hpbGRyZW4ubGVuZ3RoOyBpPCBsZW47IGkrKylcbiAgICAgICAgICAgICAgICAgICAgX3QucmVtb3ZlTGlzdGVuZXJzKGxvY0NoaWxkcmVuW2ldLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lclR5cGUgPT09IGNjLkV2ZW50TGlzdGVuZXIuVE9VQ0hfT05FX0JZX09ORSlcbiAgICAgICAgICAgICAgICBfdC5fcmVtb3ZlTGlzdGVuZXJzRm9yTGlzdGVuZXJJRChMaXN0ZW5lcklELlRPVUNIX09ORV9CWV9PTkUpO1xuICAgICAgICAgICAgZWxzZSBpZiAobGlzdGVuZXJUeXBlID09PSBjYy5FdmVudExpc3RlbmVyLlRPVUNIX0FMTF9BVF9PTkNFKVxuICAgICAgICAgICAgICAgIF90Ll9yZW1vdmVMaXN0ZW5lcnNGb3JMaXN0ZW5lcklEKExpc3RlbmVySUQuVE9VQ0hfQUxMX0FUX09OQ0UpO1xuICAgICAgICAgICAgZWxzZSBpZiAobGlzdGVuZXJUeXBlID09PSBjYy5FdmVudExpc3RlbmVyLk1PVVNFKVxuICAgICAgICAgICAgICAgIF90Ll9yZW1vdmVMaXN0ZW5lcnNGb3JMaXN0ZW5lcklEKExpc3RlbmVySUQuTU9VU0UpO1xuICAgICAgICAgICAgZWxzZSBpZiAobGlzdGVuZXJUeXBlID09PSBjYy5FdmVudExpc3RlbmVyLkFDQ0VMRVJBVElPTilcbiAgICAgICAgICAgICAgICBfdC5fcmVtb3ZlTGlzdGVuZXJzRm9yTGlzdGVuZXJJRChMaXN0ZW5lcklELkFDQ0VMRVJBVElPTik7XG4gICAgICAgICAgICBlbHNlIGlmIChsaXN0ZW5lclR5cGUgPT09IGNjLkV2ZW50TGlzdGVuZXIuS0VZQk9BUkQpXG4gICAgICAgICAgICAgICAgX3QuX3JlbW92ZUxpc3RlbmVyc0Zvckxpc3RlbmVySUQoTGlzdGVuZXJJRC5LRVlCT0FSRCk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY2MubG9nSUQoMzUwMSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiAhI2VuIFJlbW92ZXMgYWxsIGN1c3RvbSBsaXN0ZW5lcnMgd2l0aCB0aGUgc2FtZSBldmVudCBuYW1lLlxuICAgICAqICEjemgg56e76Zmk5ZCM5LiA5LqL5Lu25ZCN55qE6Ieq5a6a5LmJ5LqL5Lu255uR5ZCs5Zmo44CCXG4gICAgICogQG1ldGhvZCByZW1vdmVDdXN0b21MaXN0ZW5lcnNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gY3VzdG9tRXZlbnROYW1lXG4gICAgICovXG4gICAgcmVtb3ZlQ3VzdG9tTGlzdGVuZXJzOiBmdW5jdGlvbiAoY3VzdG9tRXZlbnROYW1lKSB7XG4gICAgICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyc0Zvckxpc3RlbmVySUQoY3VzdG9tRXZlbnROYW1lKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZW1vdmVzIGFsbCBsaXN0ZW5lcnNcbiAgICAgKiAhI3poIOenu+mZpOaJgOacieS6i+S7tuebkeWQrOWZqOOAglxuICAgICAqIEBtZXRob2QgcmVtb3ZlQWxsTGlzdGVuZXJzXG4gICAgICovXG4gICAgcmVtb3ZlQWxsTGlzdGVuZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsb2NMaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNNYXAsIGxvY0ludGVybmFsQ3VzdG9tRXZlbnRJRHMgPSB0aGlzLl9pbnRlcm5hbEN1c3RvbUxpc3RlbmVySURzO1xuICAgICAgICBmb3IgKHZhciBzZWxLZXkgaW4gbG9jTGlzdGVuZXJzKXtcbiAgICAgICAgICAgIGlmKGxvY0ludGVybmFsQ3VzdG9tRXZlbnRJRHMuaW5kZXhPZihzZWxLZXkpID09PSAtMSlcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcnNGb3JMaXN0ZW5lcklEKHNlbEtleSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXRzIGxpc3RlbmVyJ3MgcHJpb3JpdHkgd2l0aCBmaXhlZCB2YWx1ZS5cbiAgICAgKiAhI3poIOiuvue9riBGaXhlZFByaW9yaXR5IOexu+Wei+ebkeWQrOWZqOeahOS8mOWFiOe6p+OAglxuICAgICAqIEBtZXRob2Qgc2V0UHJpb3JpdHlcbiAgICAgKiBAcGFyYW0ge0V2ZW50TGlzdGVuZXJ9IGxpc3RlbmVyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGZpeGVkUHJpb3JpdHlcbiAgICAgKi9cbiAgICBzZXRQcmlvcml0eTogZnVuY3Rpb24gKGxpc3RlbmVyLCBmaXhlZFByaW9yaXR5KSB7XG4gICAgICAgIGlmIChsaXN0ZW5lciA9PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHZhciBsb2NMaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNNYXA7XG4gICAgICAgIGZvciAodmFyIHNlbEtleSBpbiBsb2NMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHZhciBzZWxMaXN0ZW5lcnMgPSBsb2NMaXN0ZW5lcnNbc2VsS2V5XTtcbiAgICAgICAgICAgIHZhciBmaXhlZFByaW9yaXR5TGlzdGVuZXJzID0gc2VsTGlzdGVuZXJzLmdldEZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIGlmIChmaXhlZFByaW9yaXR5TGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZvdW5kID0gZml4ZWRQcmlvcml0eUxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICBpZiAoZm91bmQgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGxpc3RlbmVyLl9nZXRTY2VuZUdyYXBoUHJpb3JpdHkoKSAhPSBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgY2MubG9nSUQoMzUwMik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5fZ2V0Rml4ZWRQcmlvcml0eSgpICE9PSBmaXhlZFByaW9yaXR5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lci5fc2V0Rml4ZWRQcmlvcml0eShmaXhlZFByaW9yaXR5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldERpcnR5KGxpc3RlbmVyLl9nZXRMaXN0ZW5lcklEKCksIHRoaXMuRElSVFlfRklYRURfUFJJT1JJVFkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBXaGV0aGVyIHRvIGVuYWJsZSBkaXNwYXRjaGluZyBldmVudHNcbiAgICAgKiAhI3poIOWQr+eUqOaIluemgeeUqOS6i+S7tueuoeeQhuWZqO+8jOemgeeUqOWQjuS4jeS8muWIhuWPkeS7u+S9leS6i+S7tuOAglxuICAgICAqIEBtZXRob2Qgc2V0RW5hYmxlZFxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gZW5hYmxlZFxuICAgICAqL1xuICAgIHNldEVuYWJsZWQ6IGZ1bmN0aW9uIChlbmFibGVkKSB7XG4gICAgICAgIHRoaXMuX2lzRW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2hlY2tzIHdoZXRoZXIgZGlzcGF0Y2hpbmcgZXZlbnRzIGlzIGVuYWJsZWRcbiAgICAgKiAhI3poIOajgOa1i+S6i+S7tueuoeeQhuWZqOaYr+WQpuWQr+eUqOOAglxuICAgICAqIEBtZXRob2QgaXNFbmFibGVkXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICovXG4gICAgaXNFbmFibGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc0VuYWJsZWQ7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogISNlbiBEaXNwYXRjaGVzIHRoZSBldmVudCwgYWxzbyByZW1vdmVzIGFsbCBFdmVudExpc3RlbmVycyBtYXJrZWQgZm9yIGRlbGV0aW9uIGZyb20gdGhlIGV2ZW50IGRpc3BhdGNoZXIgbGlzdC5cbiAgICAgKiAhI3poIOWIhuWPkeS6i+S7tuOAglxuICAgICAqIEBtZXRob2QgZGlzcGF0Y2hFdmVudFxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gICAgICovXG4gICAgZGlzcGF0Y2hFdmVudDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5faXNFbmFibGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuX3VwZGF0ZURpcnR5RmxhZ0ZvclNjZW5lR3JhcGgoKTtcbiAgICAgICAgdGhpcy5faW5EaXNwYXRjaCsrO1xuICAgICAgICBpZiAoIWV2ZW50IHx8ICFldmVudC5nZXRUeXBlKSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDM1MTEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChldmVudC5nZXRUeXBlKCkuc3RhcnRzV2l0aChjYy5FdmVudC5UT1VDSCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoVG91Y2hFdmVudChldmVudCk7XG4gICAgICAgICAgICB0aGlzLl9pbkRpc3BhdGNoLS07XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbGlzdGVuZXJJRCA9IF9fZ2V0TGlzdGVuZXJJRChldmVudCk7XG4gICAgICAgIHRoaXMuX3NvcnRFdmVudExpc3RlbmVycyhsaXN0ZW5lcklEKTtcbiAgICAgICAgdmFyIHNlbExpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc01hcFtsaXN0ZW5lcklEXTtcbiAgICAgICAgaWYgKHNlbExpc3RlbmVycyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50VG9MaXN0ZW5lcnMoc2VsTGlzdGVuZXJzLCB0aGlzLl9vbkxpc3RlbmVyQ2FsbGJhY2ssIGV2ZW50KTtcbiAgICAgICAgICAgIHRoaXMuX29uVXBkYXRlTGlzdGVuZXJzKHNlbExpc3RlbmVycyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9pbkRpc3BhdGNoLS07XG4gICAgfSxcblxuICAgIF9vbkxpc3RlbmVyQ2FsbGJhY2s6IGZ1bmN0aW9uKGxpc3RlbmVyLCBldmVudCl7XG4gICAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQgPSBsaXN0ZW5lci5fdGFyZ2V0O1xuICAgICAgICBsaXN0ZW5lci5fb25FdmVudChldmVudCk7XG4gICAgICAgIHJldHVybiBldmVudC5pc1N0b3BwZWQoKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiAhI2VuIERpc3BhdGNoZXMgYSBDdXN0b20gRXZlbnQgd2l0aCBhIGV2ZW50IG5hbWUgYW4gb3B0aW9uYWwgdXNlciBkYXRhXG4gICAgICogISN6aCDliIblj5Hoh6rlrprkuYnkuovku7bjgIJcbiAgICAgKiBAbWV0aG9kIGRpc3BhdGNoQ3VzdG9tRXZlbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gICAgICogQHBhcmFtIHsqfSBvcHRpb25hbFVzZXJEYXRhXG4gICAgICovXG4gICAgZGlzcGF0Y2hDdXN0b21FdmVudDogZnVuY3Rpb24gKGV2ZW50TmFtZSwgb3B0aW9uYWxVc2VyRGF0YSkge1xuICAgICAgICB2YXIgZXYgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oZXZlbnROYW1lKTtcbiAgICAgICAgZXYuc2V0VXNlckRhdGEob3B0aW9uYWxVc2VyRGF0YSk7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChldik7XG4gICAgfVxufTtcblxuXG5qcy5nZXQoY2MsICdldmVudE1hbmFnZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgY2MuZXJyb3JJRCgxNDA1LCAnY2MuZXZlbnRNYW5hZ2VyJywgJ2NjLkV2ZW50VGFyZ2V0IG9yIGNjLnN5c3RlbUV2ZW50Jyk7XG4gICAgcmV0dXJuIGV2ZW50TWFuYWdlcjtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNjLmludGVybmFsLmV2ZW50TWFuYWdlciA9IGV2ZW50TWFuYWdlcjtcbiJdLCJzb3VyY2VSb290IjoiLyJ9