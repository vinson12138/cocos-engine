
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCObject.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

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
var js = require('./js');

var CCClass = require('./CCClass'); // definitions for CCObject.Flags


var Destroyed = 1 << 0;
var RealDestroyed = 1 << 1;
var ToDestroy = 1 << 2;
var DontSave = 1 << 3;
var EditorOnly = 1 << 4;
var Dirty = 1 << 5;
var DontDestroy = 1 << 6;
var Destroying = 1 << 7;
var Deactivating = 1 << 8;
var LockedInEditor = 1 << 9; //var HideInGame = 1 << 9;

var HideInHierarchy = 1 << 10;
var IsOnEnableCalled = 1 << 11;
var IsEditorOnEnableCalled = 1 << 12;
var IsPreloadStarted = 1 << 13;
var IsOnLoadCalled = 1 << 14;
var IsOnLoadStarted = 1 << 15;
var IsStartCalled = 1 << 16;
var IsRotationLocked = 1 << 17;
var IsScaleLocked = 1 << 18;
var IsAnchorLocked = 1 << 19;
var IsSizeLocked = 1 << 20;
var IsPositionLocked = 1 << 21; // var Hide = HideInGame | HideInHierarchy;
// should not clone or serialize these flags

var PersistentMask = ~(ToDestroy | Dirty | Destroying | DontDestroy | Deactivating | IsPreloadStarted | IsOnLoadStarted | IsOnLoadCalled | IsStartCalled | IsOnEnableCalled | IsEditorOnEnableCalled | IsRotationLocked | IsScaleLocked | IsAnchorLocked | IsSizeLocked | IsPositionLocked
/*RegisteredInEditor*/
);
/**
 * The base class of most of all the objects in Fireball.
 * @class Object
 *
 * @main
 * @private
 */

function CCObject() {
  /**
   * @property {String} _name
   * @default ""
   * @private
   */
  this._name = '';
  /**
   * @property {Number} _objFlags
   * @default 0
   * @private
   */

  this._objFlags = 0;
}

CCClass.fastDefine('cc.Object', CCObject, {
  _name: '',
  _objFlags: 0
});
/**
 * Bit mask that controls object states.
 * @enum Flags
 * @static
 * @private
 */

js.value(CCObject, 'Flags', {
  Destroyed: Destroyed,
  //ToDestroy: ToDestroy,

  /**
   * !#en The object will not be saved.
   * !#zh 该对象将不会被保存。
   * @property {Number} DontSave
   */
  DontSave: DontSave,

  /**
   * !#en The object will not be saved when building a player.
   * !#zh 构建项目时，该对象将不会被保存。
   * @property {Number} EditorOnly
   */
  EditorOnly: EditorOnly,
  Dirty: Dirty,

  /**
   * !#en Dont destroy automatically when loading a new scene.
   * !#zh 加载一个新场景时，不自动删除该对象。
   * @property DontDestroy
   * @private
   */
  DontDestroy: DontDestroy,
  PersistentMask: PersistentMask,
  // FLAGS FOR ENGINE
  Destroying: Destroying,

  /**
   * !#en The node is deactivating.
   * !#zh 节点正在反激活的过程中。
   * @property Deactivating
   * @private
   */
  Deactivating: Deactivating,

  /**
   * !#en The lock node, when the node is locked, cannot be clicked in the scene.
   * !#zh 锁定节点，锁定后场景内不能点击。
   * 
   * @property LockedInEditor
   * @private
   */
  LockedInEditor: LockedInEditor,
  ///**
  // * !#en
  // * Hide in game and hierarchy.
  // * This flag is readonly, it can only be used as an argument of `scene.addEntity()` or `Entity.createWithFlags()`.
  // * !#zh
  // * 在游戏和层级中隐藏该对象。<br/>
  // * 该标记只读，它只能被用作 `scene.addEntity()` 或者 `Entity.createWithFlags()` 的一个参数。
  // * @property {Number} HideInGame
  // */
  //HideInGame: HideInGame,
  // FLAGS FOR EDITOR

  /**
   * !#en Hide the object in editor.
   * !#zh 在编辑器中隐藏该对象。
   * @property {Number} HideInHierarchy
   */
  HideInHierarchy: HideInHierarchy,
  ///**
  // * !#en
  // * Hide in game view, hierarchy, and scene view... etc.
  // * This flag is readonly, it can only be used as an argument of `scene.addEntity()` or `Entity.createWithFlags()`.
  // * !#zh
  // * 在游戏视图，层级，场景视图等等...中隐藏该对象。
  // * 该标记只读，它只能被用作 `scene.addEntity()` 或者 `Entity.createWithFlags()` 的一个参数。
  // * @property {Number} Hide
  // */
  //Hide: Hide,
  // FLAGS FOR COMPONENT
  IsPreloadStarted: IsPreloadStarted,
  IsOnLoadStarted: IsOnLoadStarted,
  IsOnLoadCalled: IsOnLoadCalled,
  IsOnEnableCalled: IsOnEnableCalled,
  IsStartCalled: IsStartCalled,
  IsEditorOnEnableCalled: IsEditorOnEnableCalled,
  IsPositionLocked: IsPositionLocked,
  IsRotationLocked: IsRotationLocked,
  IsScaleLocked: IsScaleLocked,
  IsAnchorLocked: IsAnchorLocked,
  IsSizeLocked: IsSizeLocked
});
var objectsToDestroy = [];

function deferredDestroy() {
  var deleteCount = objectsToDestroy.length;

  for (var i = 0; i < deleteCount; ++i) {
    var obj = objectsToDestroy[i];

    if (!(obj._objFlags & Destroyed)) {
      obj._destroyImmediate();
    }
  } // if we called b.destory() in a.onDestroy(), objectsToDestroy will be resized,
  // but we only destroy the objects which called destory in this frame.


  if (deleteCount === objectsToDestroy.length) {
    objectsToDestroy.length = 0;
  } else {
    objectsToDestroy.splice(0, deleteCount);
  }

  if (CC_EDITOR) {
    deferredDestroyTimer = null;
  }
}

js.value(CCObject, '_deferredDestroy', deferredDestroy);

if (CC_EDITOR) {
  js.value(CCObject, '_clearDeferredDestroyTimer', function () {
    if (deferredDestroyTimer !== null) {
      clearImmediate(deferredDestroyTimer);
      deferredDestroyTimer = null;
    }
  });
} // MEMBER

/**
 * @class Object
 */


var prototype = CCObject.prototype;
/**
 * !#en The name of the object.
 * !#zh 该对象的名称。
 * @property {String} name
 * @default ""
 * @example
 * obj.name = "New Obj";
 */

js.getset(prototype, 'name', function () {
  return this._name;
}, function (value) {
  this._name = value;
}, true);
/**
 * !#en
 * Indicates whether the object is not yet destroyed. (It will not be available after being destroyed)<br>
 * When an object's `destroy` is called, it is actually destroyed after the end of this frame.
 * So `isValid` will return false from the next frame, while `isValid` in the current frame will still be true.
 * If you want to determine whether the current frame has called `destroy`, use `cc.isValid(obj, true)`,
 * but this is often caused by a particular logical requirements, which is not normally required.
 *
 * !#zh
 * 表示该对象是否可用（被 destroy 后将不可用）。<br>
 * 当一个对象的 `destroy` 调用以后，会在这一帧结束后才真正销毁。因此从下一帧开始 `isValid` 就会返回 false，而当前帧内 `isValid` 仍然会是 true。如果希望判断当前帧是否调用过 `destroy`，请使用 `cc.isValid(obj, true)`，不过这往往是特殊的业务需求引起的，通常情况下不需要这样。
 *
 * @property {Boolean} isValid
 * @default true
 * @readOnly
 * @example
 * var node = new cc.Node();
 * cc.log(node.isValid);    // true
 * node.destroy();
 * cc.log(node.isValid);    // true, still valid in this frame
 * // after a frame...
 * cc.log(node.isValid);    // false, destroyed in the end of last frame
 */

js.get(prototype, 'isValid', function () {
  return !(this._objFlags & Destroyed);
}, true);

if (CC_EDITOR || CC_TEST) {
  js.get(prototype, 'isRealValid', function () {
    return !(this._objFlags & RealDestroyed);
  });
}

var deferredDestroyTimer = null;
/**
 * !#en
 * Destroy this Object, and release all its own references to other objects.<br/>
 * Actual object destruction will delayed until before rendering.
 * From the next frame, this object is not usable anymore.
 * You can use `cc.isValid(obj)` to check whether the object is destroyed before accessing it.
 * !#zh
 * 销毁该对象，并释放所有它对其它对象的引用。<br/>
 * 实际销毁操作会延迟到当前帧渲染前执行。从下一帧开始，该对象将不再可用。
 * 您可以在访问对象之前使用 `cc.isValid(obj)` 来检查对象是否已被销毁。
 * @method destroy
 * @return {Boolean} whether it is the first time the destroy being called
 * @example
 * obj.destroy();
 */

prototype.destroy = function () {
  if (this._objFlags & Destroyed) {
    cc.warnID(5000);
    return false;
  }

  if (this._objFlags & ToDestroy) {
    return false;
  }

  this._objFlags |= ToDestroy;
  objectsToDestroy.push(this);

  if (CC_EDITOR && deferredDestroyTimer === null && cc.engine && !cc.engine._isUpdating) {
    // auto destroy immediate in edit mode
    deferredDestroyTimer = setImmediate(deferredDestroy);
  }

  return true;
};

if (CC_EDITOR || CC_TEST) {
  /*
   * !#en
   * In fact, Object's "destroy" will not trigger the destruct operation in Firebal Editor.
   * The destruct operation will be executed by Undo system later.
   * !#zh
   * 事实上，对象的 “destroy” 不会在编辑器中触发析构操作，
   * 析构操作将在 Undo 系统中 **延后** 执行。
   * @method realDestroyInEditor
   * @private
   */
  prototype.realDestroyInEditor = function () {
    if (!(this._objFlags & Destroyed)) {
      cc.warnID(5001);
      return;
    }

    if (this._objFlags & RealDestroyed) {
      cc.warnID(5000);
      return;
    }

    this._destruct();

    this._objFlags |= RealDestroyed;
  };
}

function compileDestruct(obj, ctor) {
  var shouldSkipId = obj instanceof cc._BaseNode || obj instanceof cc.Component;
  var idToSkip = shouldSkipId ? '_id' : null;
  var key,
      propsToReset = {};

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (key === idToSkip) {
        continue;
      }

      switch (typeof obj[key]) {
        case 'string':
          propsToReset[key] = '';
          break;

        case 'object':
        case 'function':
          propsToReset[key] = null;
          break;
      }
    }
  } // Overwrite propsToReset according to Class


  if (cc.Class._isCCClass(ctor)) {
    var attrs = cc.Class.Attr.getClassAttrs(ctor);
    var propList = ctor.__props__;

    for (var i = 0; i < propList.length; i++) {
      key = propList[i];
      var attrKey = key + cc.Class.Attr.DELIMETER + 'default';

      if (attrKey in attrs) {
        if (shouldSkipId && key === '_id') {
          continue;
        }

        switch (typeof attrs[attrKey]) {
          case 'string':
            propsToReset[key] = '';
            break;

          case 'object':
          case 'function':
            propsToReset[key] = null;
            break;

          case 'undefined':
            propsToReset[key] = undefined;
            break;
        }
      }
    }
  }

  if (CC_SUPPORT_JIT) {
    // compile code
    var func = '';

    for (key in propsToReset) {
      var statement;

      if (CCClass.IDENTIFIER_RE.test(key)) {
        statement = 'o.' + key + '=';
      } else {
        statement = 'o[' + CCClass.escapeForJS(key) + ']=';
      }

      var val = propsToReset[key];

      if (val === '') {
        val = '""';
      }

      func += statement + val + ';\n';
    }

    return Function('o', func);
  } else {
    return function (o) {
      for (var key in propsToReset) {
        o[key] = propsToReset[key];
      }
    };
  }
}
/**
 * !#en
 * Clear all references in the instance.
 *
 * NOTE: this method will not clear the `getter` or `setter` functions which defined in the instance of `CCObject`.
 * You can override the `_destruct` method if you need, for example:
 * ```js
 * _destruct: function () {
 *     for (var key in this) {
 *         if (this.hasOwnProperty(key)) {
 *             switch (typeof this[key]) {
 *                 case 'string':
 *                     this[key] = '';
 *                     break;
 *                 case 'object':
 *                 case 'function':
 *                     this[key] = null;
 *                     break;
 *         }
 *     }
 * }
 * ```
 * !#zh
 * 清除实例中的所有引用。
 * 
 * 注意：此方法不会清除在 `CCObject` 实例中定义的 `getter` 或 `setter`。如果需要，你可以重写 `_destruct` 方法。例如：
 * 
 * ```js
 * _destruct: function () {
 *     for (var key in this) {
 *         if (this.hasOwnProperty(key)) {
 *             switch (typeof this[key]) {
 *                 case 'string':
 *                     this[key] = '';
 *                     break;
 *                 case 'object':
 *                 case 'function':
 *                     this[key] = null;
 *                     break;
 *         }
 *     }
 * }
 * ```
 * @method _destruct
 * @private
 */


prototype._destruct = function () {
  var ctor = this.constructor;
  var destruct = ctor.__destruct__;

  if (!destruct) {
    destruct = compileDestruct(this, ctor);
    js.value(ctor, '__destruct__', destruct, true);
  }

  destruct(this);
};
/**
 * !#en
 * Called before the object being destroyed.
 * !#zh
 * 在对象被销毁之前调用。
 * @method _onPreDestroy
 * @private
 */


prototype._onPreDestroy = null;

prototype._destroyImmediate = function () {
  if (this._objFlags & Destroyed) {
    cc.errorID(5000);
    return;
  } // engine internal callback


  if (this._onPreDestroy) {
    this._onPreDestroy();
  }

  if ((CC_TEST ?
  /* make CC_EDITOR mockable*/
  Function('return !CC_EDITOR')() : !CC_EDITOR) || cc.engine._isPlaying) {
    this._destruct();
  }

  this._objFlags |= Destroyed;
};

if (CC_EDITOR) {
  /**
   * !#en
   * The customized serialization for this object. (Editor Only)
   * !#zh
   * 为此对象定制序列化。
   * @method _serialize
   * @param {Boolean} exporting
   * @return {object} the serialized json data object
   * @private
   */
  prototype._serialize = null;
}
/**
 * !#en
 * Init this object from the custom serialized data.
 * !#zh
 * 从自定义序列化数据初始化此对象。
 * @method _deserialize
 * @param {Object} data - the serialized json data
 * @param {_Deserializer} ctx
 * @private
 */


prototype._deserialize = null;
/**
 * @module cc
 */

/**
 * !#en
 * Checks whether the object is non-nil and not yet destroyed.<br>
 * When an object's `destroy` is called, it is actually destroyed after the end of this frame.
 * So `isValid` will return false from the next frame, while `isValid` in the current frame will still be true.
 * If you want to determine whether the current frame has called `destroy`, use `cc.isValid(obj, true)`,
 * but this is often caused by a particular logical requirements, which is not normally required.
 *
 * !#zh
 * 检查该对象是否不为 null 并且尚未销毁。<br>
 * 当一个对象的 `destroy` 调用以后，会在这一帧结束后才真正销毁。因此从下一帧开始 `isValid` 就会返回 false，而当前帧内 `isValid` 仍然会是 true。如果希望判断当前帧是否调用过 `destroy`，请使用 `cc.isValid(obj, true)`，不过这往往是特殊的业务需求引起的，通常情况下不需要这样。
 *
 * @method isValid
 * @param {any} value
 * @param {Boolean} [strictMode=false] - If true, Object called destroy() in this frame will also treated as invalid.
 * @return {Boolean} whether is valid
 * @example
 * var node = new cc.Node();
 * cc.log(cc.isValid(node));    // true
 * node.destroy();
 * cc.log(cc.isValid(node));    // true, still valid in this frame
 * // after a frame...
 * cc.log(cc.isValid(node));    // false, destroyed in the end of last frame
 */

cc.isValid = function (value, strictMode) {
  if (typeof value === 'object') {
    return !!value && !(value._objFlags & (strictMode ? Destroyed | ToDestroy : Destroyed));
  } else {
    return typeof value !== 'undefined';
  }
};

if (CC_EDITOR || CC_TEST) {
  js.value(CCObject, '_willDestroy', function (obj) {
    return !(obj._objFlags & Destroyed) && (obj._objFlags & ToDestroy) > 0;
  });
  js.value(CCObject, '_cancelDestroy', function (obj) {
    obj._objFlags &= ~ToDestroy;
    js.array.fastRemove(objectsToDestroy, obj);
  });
}

cc.Object = module.exports = CCObject;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BsYXRmb3JtL0NDT2JqZWN0LmpzIl0sIm5hbWVzIjpbImpzIiwicmVxdWlyZSIsIkNDQ2xhc3MiLCJEZXN0cm95ZWQiLCJSZWFsRGVzdHJveWVkIiwiVG9EZXN0cm95IiwiRG9udFNhdmUiLCJFZGl0b3JPbmx5IiwiRGlydHkiLCJEb250RGVzdHJveSIsIkRlc3Ryb3lpbmciLCJEZWFjdGl2YXRpbmciLCJMb2NrZWRJbkVkaXRvciIsIkhpZGVJbkhpZXJhcmNoeSIsIklzT25FbmFibGVDYWxsZWQiLCJJc0VkaXRvck9uRW5hYmxlQ2FsbGVkIiwiSXNQcmVsb2FkU3RhcnRlZCIsIklzT25Mb2FkQ2FsbGVkIiwiSXNPbkxvYWRTdGFydGVkIiwiSXNTdGFydENhbGxlZCIsIklzUm90YXRpb25Mb2NrZWQiLCJJc1NjYWxlTG9ja2VkIiwiSXNBbmNob3JMb2NrZWQiLCJJc1NpemVMb2NrZWQiLCJJc1Bvc2l0aW9uTG9ja2VkIiwiUGVyc2lzdGVudE1hc2siLCJDQ09iamVjdCIsIl9uYW1lIiwiX29iakZsYWdzIiwiZmFzdERlZmluZSIsInZhbHVlIiwib2JqZWN0c1RvRGVzdHJveSIsImRlZmVycmVkRGVzdHJveSIsImRlbGV0ZUNvdW50IiwibGVuZ3RoIiwiaSIsIm9iaiIsIl9kZXN0cm95SW1tZWRpYXRlIiwic3BsaWNlIiwiQ0NfRURJVE9SIiwiZGVmZXJyZWREZXN0cm95VGltZXIiLCJjbGVhckltbWVkaWF0ZSIsInByb3RvdHlwZSIsImdldHNldCIsImdldCIsIkNDX1RFU1QiLCJkZXN0cm95IiwiY2MiLCJ3YXJuSUQiLCJwdXNoIiwiZW5naW5lIiwiX2lzVXBkYXRpbmciLCJzZXRJbW1lZGlhdGUiLCJyZWFsRGVzdHJveUluRWRpdG9yIiwiX2Rlc3RydWN0IiwiY29tcGlsZURlc3RydWN0IiwiY3RvciIsInNob3VsZFNraXBJZCIsIl9CYXNlTm9kZSIsIkNvbXBvbmVudCIsImlkVG9Ta2lwIiwia2V5IiwicHJvcHNUb1Jlc2V0IiwiaGFzT3duUHJvcGVydHkiLCJDbGFzcyIsIl9pc0NDQ2xhc3MiLCJhdHRycyIsIkF0dHIiLCJnZXRDbGFzc0F0dHJzIiwicHJvcExpc3QiLCJfX3Byb3BzX18iLCJhdHRyS2V5IiwiREVMSU1FVEVSIiwidW5kZWZpbmVkIiwiQ0NfU1VQUE9SVF9KSVQiLCJmdW5jIiwic3RhdGVtZW50IiwiSURFTlRJRklFUl9SRSIsInRlc3QiLCJlc2NhcGVGb3JKUyIsInZhbCIsIkZ1bmN0aW9uIiwibyIsImNvbnN0cnVjdG9yIiwiZGVzdHJ1Y3QiLCJfX2Rlc3RydWN0X18iLCJfb25QcmVEZXN0cm95IiwiZXJyb3JJRCIsIl9pc1BsYXlpbmciLCJfc2VyaWFsaXplIiwiX2Rlc2VyaWFsaXplIiwiaXNWYWxpZCIsInN0cmljdE1vZGUiLCJhcnJheSIsImZhc3RSZW1vdmUiLCJPYmplY3QiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBSUEsRUFBRSxHQUFHQyxPQUFPLENBQUMsTUFBRCxDQUFoQjs7QUFDQSxJQUFJQyxPQUFPLEdBQUdELE9BQU8sQ0FBQyxXQUFELENBQXJCLEVBRUE7OztBQUVBLElBQUlFLFNBQVMsR0FBRyxLQUFLLENBQXJCO0FBQ0EsSUFBSUMsYUFBYSxHQUFHLEtBQUssQ0FBekI7QUFDQSxJQUFJQyxTQUFTLEdBQUcsS0FBSyxDQUFyQjtBQUNBLElBQUlDLFFBQVEsR0FBRyxLQUFLLENBQXBCO0FBQ0EsSUFBSUMsVUFBVSxHQUFHLEtBQUssQ0FBdEI7QUFDQSxJQUFJQyxLQUFLLEdBQUcsS0FBSyxDQUFqQjtBQUNBLElBQUlDLFdBQVcsR0FBRyxLQUFLLENBQXZCO0FBQ0EsSUFBSUMsVUFBVSxHQUFHLEtBQUss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QUFFQSxLQUFLLENBQUNGLFNBQU4sSUFBbUJnRSxVQUFVLEdBQUl6RixTQUFTLEdBQUdFLFNBQWhCLEdBQTZCRixTQUExRCxDQUFGLENBQWxCO0FBQ0gsR0FGRCxNQUdLO0FBQ0QsV0FBTyxPQUFPMkIsS0FBUCxLQUFpQixXQUF4QjtBQUNIO0FBQ0osQ0FQRDs7QUFTQSxJQUFJUyxTQUFTLElBQUlNLE9BQWpCLEVBQTBCO0FBQ3RCN0MsRUFBQUEsRUFBRSxDQUFDOEIsS0FBSCxDQUFTSixRQUFULEVBQW1CLGNBQW5CLEVBQW1DLFVBQVVVLEdBQVYsRUFBZTtBQUM5QyxXQUFPLEVBQUVBLEdBQUcsQ0FBQ1IsU0FBSixHQUFnQnpCLFNBQWxCLEtBQWdDLENBQUNpQyxHQUFHLENBQUNSLFNBQUosR0FBZ0J2QixTQUFqQixJQUE4QixDQUFyRTtBQUNILEdBRkQ7QUFHQUwsRUFBQUEsRUFBRSxDQUFDOEIsS0FBSCxDQUFTSixRQUFULEVBQW1CLGdCQUFuQixFQUFxQyxVQUFVVSxHQUFWLEVBQWU7QUFDaERBLElBQUFBLEdBQUcsQ0FBQ1IsU0FBSixJQUFpQixDQUFDdkIsU0FBbEI7QUFDQUwsSUFBQUEsRUFBRSxDQUFDNkYsS0FBSCxDQUFTQyxVQUFULENBQW9CL0QsZ0JBQXBCLEVBQXNDSyxHQUF0QztBQUNILEdBSEQ7QUFJSDs7QUFFRFcsRUFBRSxDQUFDZ0QsTUFBSCxHQUFZQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJ2RSxRQUE3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBqcyA9IHJlcXVpcmUoJy4vanMnKTtcbnZhciBDQ0NsYXNzID0gcmVxdWlyZSgnLi9DQ0NsYXNzJyk7XG5cbi8vIGRlZmluaXRpb25zIGZvciBDQ09iamVjdC5GbGFnc1xuXG52YXIgRGVzdHJveWVkID0gMSA8PCAwO1xudmFyIFJlYWxEZXN0cm95ZWQgPSAxIDw8IDE7XG52YXIgVG9EZXN0cm95ID0gMSA8PCAyO1xudmFyIERvbnRTYXZlID0gMSA8PCAzO1xudmFyIEVkaXRvck9ubHkgPSAxIDw8IDQ7XG52YXIgRGlydHkgPSAxIDw8IDU7XG52YXIgRG9udERlc3Ryb3kgPSAxIDw8IDY7XG52YXIgRGVzdHJveWluZyA9IDEgPDwgNztcbnZhciBEZWFjdGl2YXRpbmcgPSAxIDw8IDg7XG52YXIgTG9ja2VkSW5FZGl0b3IgPSAxIDw8IDk7XG4vL3ZhciBIaWRlSW5HYW1lID0gMSA8PCA5O1xudmFyIEhpZGVJbkhpZXJhcmNoeSA9IDEgPDwgMTA7XG5cbnZhciBJc09uRW5hYmxlQ2FsbGVkID0gMSA8PCAxMTtcbnZhciBJc0VkaXRvck9uRW5hYmxlQ2FsbGVkID0gMSA8PCAxMjtcbnZhciBJc1ByZWxvYWRTdGFydGVkID0gMSA8PCAxMztcbnZhciBJc09uTG9hZENhbGxlZCA9IDEgPDwgMTQ7XG52YXIgSXNPbkxvYWRTdGFydGVkID0gMSA8PCAxNTtcbnZhciBJc1N0YXJ0Q2FsbGVkID0gMSA8PCAxNjtcblxudmFyIElzUm90YXRpb25Mb2NrZWQgPSAxIDw8IDE3O1xudmFyIElzU2NhbGVMb2NrZWQgPSAxIDw8IDE4O1xudmFyIElzQW5jaG9yTG9ja2VkID0gMSA8PCAxOTtcbnZhciBJc1NpemVMb2NrZWQgPSAxIDw8IDIwO1xudmFyIElzUG9zaXRpb25Mb2NrZWQgPSAxIDw8IDIxO1xuXG4vLyB2YXIgSGlkZSA9IEhpZGVJbkdhbWUgfCBIaWRlSW5IaWVyYXJjaHk7XG4vLyBzaG91bGQgbm90IGNsb25lIG9yIHNlcmlhbGl6ZSB0aGVzZSBmbGFnc1xudmFyIFBlcnNpc3RlbnRNYXNrID0gfihUb0Rlc3Ryb3kgfCBEaXJ0eSB8IERlc3Ryb3lpbmcgfCBEb250RGVzdHJveSB8IERlYWN0aXZhdGluZyB8XG4gICAgICAgICAgICAgICAgICAgICAgIElzUHJlbG9hZFN0YXJ0ZWQgfCBJc09uTG9hZFN0YXJ0ZWQgfCBJc09uTG9hZENhbGxlZCB8IElzU3RhcnRDYWxsZWQgfFxuICAgICAgICAgICAgICAgICAgICAgICBJc09uRW5hYmxlQ2FsbGVkIHwgSXNFZGl0b3JPbkVuYWJsZUNhbGxlZCB8XG4gICAgICAgICAgICAgICAgICAgICAgIElzUm90YXRpb25Mb2NrZWQgfCBJc1NjYWxlTG9ja2VkIHwgSXNBbmNob3JMb2NrZWQgfCBJc1NpemVMb2NrZWQgfCBJc1Bvc2l0aW9uTG9ja2VkXG4gICAgICAgICAgICAgICAgICAgICAgIC8qUmVnaXN0ZXJlZEluRWRpdG9yKi8pO1xuXG4vKipcbiAqIFRoZSBiYXNlIGNsYXNzIG9mIG1vc3Qgb2YgYWxsIHRoZSBvYmplY3RzIGluIEZpcmViYWxsLlxuICogQGNsYXNzIE9iamVjdFxuICpcbiAqIEBtYWluXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBDQ09iamVjdCAoKSB7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IF9uYW1lXG4gICAgICogQGRlZmF1bHQgXCJcIlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fbmFtZSA9ICcnO1xuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IF9vYmpGbGFnc1xuICAgICAqIEBkZWZhdWx0IDBcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX29iakZsYWdzID0gMDtcbn1cbkNDQ2xhc3MuZmFzdERlZmluZSgnY2MuT2JqZWN0JywgQ0NPYmplY3QsIHsgX25hbWU6ICcnLCBfb2JqRmxhZ3M6IDAgfSk7XG5cbi8qKlxuICogQml0IG1hc2sgdGhhdCBjb250cm9scyBvYmplY3Qgc3RhdGVzLlxuICogQGVudW0gRmxhZ3NcbiAqIEBzdGF0aWNcbiAqIEBwcml2YXRlXG4gKi9cbmpzLnZhbHVlKENDT2JqZWN0LCAnRmxhZ3MnLCB7XG5cbiAgICBEZXN0cm95ZWQsXG4gICAgLy9Ub0Rlc3Ryb3k6IFRvRGVzdHJveSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG9iamVjdCB3aWxsIG5vdCBiZSBzYXZlZC5cbiAgICAgKiAhI3poIOivpeWvueixoeWwhuS4jeS8muiiq+S/neWtmOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBEb250U2F2ZVxuICAgICAqL1xuICAgIERvbnRTYXZlLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgb2JqZWN0IHdpbGwgbm90IGJlIHNhdmVkIHdoZW4gYnVpbGRpbmcgYSBwbGF5ZXIuXG4gICAgICogISN6aCDmnoTlu7rpobnnm67ml7bvvIzor6Xlr7nosaHlsIbkuI3kvJrooqvkv53lrZjjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gRWRpdG9yT25seVxuICAgICAqL1xuICAgIEVkaXRvck9ubHksXG5cbiAgICBEaXJ0eSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gRG9udCBkZXN0cm95IGF1dG9tYXRpY2FsbHkgd2hlbiBsb2FkaW5nIGEgbmV3IHNjZW5lLlxuICAgICAqICEjemgg5Yqg6L295LiA5Liq5paw5Zy65pmv5pe277yM5LiN6Ieq5Yqo5Yig6Zmk6K+l5a+56LGh44CCXG4gICAgICogQHByb3BlcnR5IERvbnREZXN0cm95XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBEb250RGVzdHJveSxcblxuICAgIFBlcnNpc3RlbnRNYXNrLFxuXG4gICAgLy8gRkxBR1MgRk9SIEVOR0lORVxuXG4gICAgRGVzdHJveWluZyxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG5vZGUgaXMgZGVhY3RpdmF0aW5nLlxuICAgICAqICEjemgg6IqC54K55q2j5Zyo5Y+N5r+A5rS755qE6L+H56iL5Lit44CCXG4gICAgICogQHByb3BlcnR5IERlYWN0aXZhdGluZ1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgRGVhY3RpdmF0aW5nLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbG9jayBub2RlLCB3aGVuIHRoZSBub2RlIGlzIGxvY2tlZCwgY2Fubm90IGJlIGNsaWNrZWQgaW4gdGhlIHNjZW5lLlxuICAgICAqICEjemgg6ZSB5a6a6IqC54K577yM6ZSB5a6a5ZCO5Zy65pmv5YaF5LiN6IO954K55Ye744CCXG4gICAgICogXG4gICAgICogQHByb3BlcnR5IExvY2tlZEluRWRpdG9yXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBMb2NrZWRJbkVkaXRvcixcblxuICAgIC8vLyoqXG4gICAgLy8gKiAhI2VuXG4gICAgLy8gKiBIaWRlIGluIGdhbWUgYW5kIGhpZXJhcmNoeS5cbiAgICAvLyAqIFRoaXMgZmxhZyBpcyByZWFkb25seSwgaXQgY2FuIG9ubHkgYmUgdXNlZCBhcyBhbiBhcmd1bWVudCBvZiBgc2NlbmUuYWRkRW50aXR5KClgIG9yIGBFbnRpdHkuY3JlYXRlV2l0aEZsYWdzKClgLlxuICAgIC8vICogISN6aFxuICAgIC8vICog5Zyo5ri45oiP5ZKM5bGC57qn5Lit6ZqQ6JeP6K+l5a+56LGh44CCPGJyLz5cbiAgICAvLyAqIOivpeagh+iusOWPquivu++8jOWug+WPquiDveiiq+eUqOS9nCBgc2NlbmUuYWRkRW50aXR5KClgIOaIluiAhSBgRW50aXR5LmNyZWF0ZVdpdGhGbGFncygpYCDnmoTkuIDkuKrlj4LmlbDjgIJcbiAgICAvLyAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBIaWRlSW5HYW1lXG4gICAgLy8gKi9cbiAgICAvL0hpZGVJbkdhbWU6IEhpZGVJbkdhbWUsXG5cbiAgICAvLyBGTEFHUyBGT1IgRURJVE9SXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEhpZGUgdGhlIG9iamVjdCBpbiBlZGl0b3IuXG4gICAgICogISN6aCDlnKjnvJbovpHlmajkuK3pmpDol4/or6Xlr7nosaHjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gSGlkZUluSGllcmFyY2h5XG4gICAgICovXG4gICAgSGlkZUluSGllcmFyY2h5OiBIaWRlSW5IaWVyYXJjaHksXG5cbiAgICAvLy8qKlxuICAgIC8vICogISNlblxuICAgIC8vICogSGlkZSBpbiBnYW1lIHZpZXcsIGhpZXJhcmNoeSwgYW5kIHNjZW5lIHZpZXcuLi4gZXRjLlxuICAgIC8vICogVGhpcyBmbGFnIGlzIHJlYWRvbmx5LCBpdCBjYW4gb25seSBiZSB1c2VkIGFzIGFuIGFyZ3VtZW50IG9mIGBzY2VuZS5hZGRFbnRpdHkoKWAgb3IgYEVudGl0eS5jcmVhdGVXaXRoRmxhZ3MoKWAuXG4gICAgLy8gKiAhI3poXG4gICAgLy8gKiDlnKjmuLjmiI/op4blm77vvIzlsYLnuqfvvIzlnLrmma/op4blm77nrYnnrYkuLi7kuK3pmpDol4/or6Xlr7nosaHjgIJcbiAgICAvLyAqIOivpeagh+iusOWPquivu++8jOWug+WPquiDveiiq+eUqOS9nCBgc2NlbmUuYWRkRW50aXR5KClgIOaIluiAhSBgRW50aXR5LmNyZWF0ZVdpdGhGbGFncygpYCDnmoTkuIDkuKrlj4LmlbDjgIJcbiAgICAvLyAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBIaWRlXG4gICAgLy8gKi9cbiAgICAvL0hpZGU6IEhpZGUsXG5cbiAgICAvLyBGTEFHUyBGT1IgQ09NUE9ORU5UXG5cbiAgICBJc1ByZWxvYWRTdGFydGVkLFxuICAgIElzT25Mb2FkU3RhcnRlZCxcbiAgICBJc09uTG9hZENhbGxlZCxcbiAgICBJc09uRW5hYmxlQ2FsbGVkLFxuICAgIElzU3RhcnRDYWxsZWQsXG4gICAgSXNFZGl0b3JPbkVuYWJsZUNhbGxlZCxcblxuICAgIElzUG9zaXRpb25Mb2NrZWQsXG4gICAgSXNSb3RhdGlvbkxvY2tlZCxcbiAgICBJc1NjYWxlTG9ja2VkLFxuICAgIElzQW5jaG9yTG9ja2VkLFxuICAgIElzU2l6ZUxvY2tlZCxcbn0pO1xuXG52YXIgb2JqZWN0c1RvRGVzdHJveSA9IFtdO1xuXG5mdW5jdGlvbiBkZWZlcnJlZERlc3Ryb3kgKCkge1xuICAgIHZhciBkZWxldGVDb3VudCA9IG9iamVjdHNUb0Rlc3Ryb3kubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVsZXRlQ291bnQ7ICsraSkge1xuICAgICAgICB2YXIgb2JqID0gb2JqZWN0c1RvRGVzdHJveVtpXTtcbiAgICAgICAgaWYgKCEob2JqLl9vYmpGbGFncyAmIERlc3Ryb3llZCkpIHtcbiAgICAgICAgICAgIG9iai5fZGVzdHJveUltbWVkaWF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGlmIHdlIGNhbGxlZCBiLmRlc3RvcnkoKSBpbiBhLm9uRGVzdHJveSgpLCBvYmplY3RzVG9EZXN0cm95IHdpbGwgYmUgcmVzaXplZCxcbiAgICAvLyBidXQgd2Ugb25seSBkZXN0cm95IHRoZSBvYmplY3RzIHdoaWNoIGNhbGxlZCBkZXN0b3J5IGluIHRoaXMgZnJhbWUuXG4gICAgaWYgKGRlbGV0ZUNvdW50ID09PSBvYmplY3RzVG9EZXN0cm95Lmxlbmd0aCkge1xuICAgICAgICBvYmplY3RzVG9EZXN0cm95Lmxlbmd0aCA9IDA7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBvYmplY3RzVG9EZXN0cm95LnNwbGljZSgwLCBkZWxldGVDb3VudCk7XG4gICAgfVxuXG4gICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICBkZWZlcnJlZERlc3Ryb3lUaW1lciA9IG51bGw7XG4gICAgfVxufVxuXG5qcy52YWx1ZShDQ09iamVjdCwgJ19kZWZlcnJlZERlc3Ryb3knLCBkZWZlcnJlZERlc3Ryb3kpO1xuXG5pZiAoQ0NfRURJVE9SKSB7XG4gICAganMudmFsdWUoQ0NPYmplY3QsICdfY2xlYXJEZWZlcnJlZERlc3Ryb3lUaW1lcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGRlZmVycmVkRGVzdHJveVRpbWVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjbGVhckltbWVkaWF0ZShkZWZlcnJlZERlc3Ryb3lUaW1lcik7XG4gICAgICAgICAgICBkZWZlcnJlZERlc3Ryb3lUaW1lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLy8gTUVNQkVSXG5cbi8qKlxuICogQGNsYXNzIE9iamVjdFxuICovXG5cbnZhciBwcm90b3R5cGUgPSBDQ09iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogISNlbiBUaGUgbmFtZSBvZiB0aGUgb2JqZWN0LlxuICogISN6aCDor6Xlr7nosaHnmoTlkI3np7DjgIJcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBuYW1lXG4gKiBAZGVmYXVsdCBcIlwiXG4gKiBAZXhhbXBsZVxuICogb2JqLm5hbWUgPSBcIk5ldyBPYmpcIjtcbiAqL1xuanMuZ2V0c2V0KHByb3RvdHlwZSwgJ25hbWUnLFxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfSxcbiAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fbmFtZSA9IHZhbHVlO1xuICAgIH0sXG4gICAgdHJ1ZVxuKTtcblxuLyoqXG4gKiAhI2VuXG4gKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgb2JqZWN0IGlzIG5vdCB5ZXQgZGVzdHJveWVkLiAoSXQgd2lsbCBub3QgYmUgYXZhaWxhYmxlIGFmdGVyIGJlaW5nIGRlc3Ryb3llZCk8YnI+XG4gKiBXaGVuIGFuIG9iamVjdCdzIGBkZXN0cm95YCBpcyBjYWxsZWQsIGl0IGlzIGFjdHVhbGx5IGRlc3Ryb3llZCBhZnRlciB0aGUgZW5kIG9mIHRoaXMgZnJhbWUuXG4gKiBTbyBgaXNWYWxpZGAgd2lsbCByZXR1cm4gZmFsc2UgZnJvbSB0aGUgbmV4dCBmcmFtZSwgd2hpbGUgYGlzVmFsaWRgIGluIHRoZSBjdXJyZW50IGZyYW1lIHdpbGwgc3RpbGwgYmUgdHJ1ZS5cbiAqIElmIHlvdSB3YW50IHRvIGRldGVybWluZSB3aGV0aGVyIHRoZSBjdXJyZW50IGZyYW1lIGhhcyBjYWxsZWQgYGRlc3Ryb3lgLCB1c2UgYGNjLmlzVmFsaWQob2JqLCB0cnVlKWAsXG4gKiBidXQgdGhpcyBpcyBvZnRlbiBjYXVzZWQgYnkgYSBwYXJ0aWN1bGFyIGxvZ2ljYWwgcmVxdWlyZW1lbnRzLCB3aGljaCBpcyBub3Qgbm9ybWFsbHkgcmVxdWlyZWQuXG4gKlxuICogISN6aFxuICog6KGo56S66K+l5a+56LGh5piv5ZCm5Y+v55So77yI6KKrIGRlc3Ryb3kg5ZCO5bCG5LiN5Y+v55So77yJ44CCPGJyPlxuICog5b2T5LiA5Liq5a+56LGh55qEIGBkZXN0cm95YCDosIPnlKjku6XlkI7vvIzkvJrlnKjov5nkuIDluKfnu5PmnZ/lkI7miY3nnJ/mraPplIDmr4HjgILlm6DmraTku47kuIvkuIDluKflvIDlp4sgYGlzVmFsaWRgIOWwseS8mui/lOWbniBmYWxzZe+8jOiAjOW9k+WJjeW4p+WGhSBgaXNWYWxpZGAg5LuN54S25Lya5pivIHRydWXjgILlpoLmnpzluIzmnJvliKTmlq3lvZPliY3luKfmmK/lkKbosIPnlKjov4cgYGRlc3Ryb3lg77yM6K+35L2/55SoIGBjYy5pc1ZhbGlkKG9iaiwgdHJ1ZSlg77yM5LiN6L+H6L+Z5b6A5b6A5piv54m55q6K55qE5Lia5Yqh6ZyA5rGC5byV6LW355qE77yM6YCa5bi45oOF5Ya15LiL5LiN6ZyA6KaB6L+Z5qC344CCXG4gKlxuICogQHByb3BlcnR5IHtCb29sZWFufSBpc1ZhbGlkXG4gKiBAZGVmYXVsdCB0cnVlXG4gKiBAcmVhZE9ubHlcbiAqIEBleGFtcGxlXG4gKiB2YXIgbm9kZSA9IG5ldyBjYy5Ob2RlKCk7XG4gKiBjYy5sb2cobm9kZS5pc1ZhbGlkKTsgICAgLy8gdHJ1ZVxuICogbm9kZS5kZXN0cm95KCk7XG4gKiBjYy5sb2cobm9kZS5pc1ZhbGlkKTsgICAgLy8gdHJ1ZSwgc3RpbGwgdmFsaWQgaW4gdGhpcyBmcmFtZVxuICogLy8gYWZ0ZXIgYSBmcmFtZS4uLlxuICogY2MubG9nKG5vZGUuaXNWYWxpZCk7ICAgIC8vIGZhbHNlLCBkZXN0cm95ZWQgaW4gdGhlIGVuZCBvZiBsYXN0IGZyYW1lXG4gKi9cbmpzLmdldChwcm90b3R5cGUsICdpc1ZhbGlkJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAhKHRoaXMuX29iakZsYWdzICYgRGVzdHJveWVkKTtcbn0sIHRydWUpO1xuXG5pZiAoQ0NfRURJVE9SIHx8IENDX1RFU1QpIHtcbiAgICBqcy5nZXQocHJvdG90eXBlLCAnaXNSZWFsVmFsaWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAhKHRoaXMuX29iakZsYWdzICYgUmVhbERlc3Ryb3llZCk7XG4gICAgfSk7XG59XG5cbnZhciBkZWZlcnJlZERlc3Ryb3lUaW1lciA9IG51bGw7XG5cbi8qKlxuICogISNlblxuICogRGVzdHJveSB0aGlzIE9iamVjdCwgYW5kIHJlbGVhc2UgYWxsIGl0cyBvd24gcmVmZXJlbmNlcyB0byBvdGhlciBvYmplY3RzLjxici8+XG4gKiBBY3R1YWwgb2JqZWN0IGRlc3RydWN0aW9uIHdpbGwgZGVsYXllZCB1bnRpbCBiZWZvcmUgcmVuZGVyaW5nLlxuICogRnJvbSB0aGUgbmV4dCBmcmFtZSwgdGhpcyBvYmplY3QgaXMgbm90IHVzYWJsZSBhbnltb3JlLlxuICogWW91IGNhbiB1c2UgYGNjLmlzVmFsaWQob2JqKWAgdG8gY2hlY2sgd2hldGhlciB0aGUgb2JqZWN0IGlzIGRlc3Ryb3llZCBiZWZvcmUgYWNjZXNzaW5nIGl0LlxuICogISN6aFxuICog6ZSA5q+B6K+l5a+56LGh77yM5bm26YeK5pS+5omA5pyJ5a6D5a+55YW25a6D5a+56LGh55qE5byV55So44CCPGJyLz5cbiAqIOWunumZhemUgOavgeaTjeS9nOS8muW7tui/n+WIsOW9k+WJjeW4p+a4suafk+WJjeaJp+ihjOOAguS7juS4i+S4gOW4p+W8gOWni++8jOivpeWvueixoeWwhuS4jeWGjeWPr+eUqOOAglxuICog5oKo5Y+v5Lul5Zyo6K6/6Zeu5a+56LGh5LmL5YmN5L2/55SoIGBjYy5pc1ZhbGlkKG9iailgIOadpeajgOafpeWvueixoeaYr+WQpuW3suiiq+mUgOavgeOAglxuICogQG1ldGhvZCBkZXN0cm95XG4gKiBAcmV0dXJuIHtCb29sZWFufSB3aGV0aGVyIGl0IGlzIHRoZSBmaXJzdCB0aW1lIHRoZSBkZXN0cm95IGJlaW5nIGNhbGxlZFxuICogQGV4YW1wbGVcbiAqIG9iai5kZXN0cm95KCk7XG4gKi9cbnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl9vYmpGbGFncyAmIERlc3Ryb3llZCkge1xuICAgICAgICBjYy53YXJuSUQoNTAwMCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX29iakZsYWdzICYgVG9EZXN0cm95KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5fb2JqRmxhZ3MgfD0gVG9EZXN0cm95O1xuICAgIG9iamVjdHNUb0Rlc3Ryb3kucHVzaCh0aGlzKTtcblxuICAgIGlmIChDQ19FRElUT1IgJiYgZGVmZXJyZWREZXN0cm95VGltZXIgPT09IG51bGwgJiYgY2MuZW5naW5lICYmICEgY2MuZW5naW5lLl9pc1VwZGF0aW5nKSB7XG4gICAgICAgIC8vIGF1dG8gZGVzdHJveSBpbW1lZGlhdGUgaW4gZWRpdCBtb2RlXG4gICAgICAgIGRlZmVycmVkRGVzdHJveVRpbWVyID0gc2V0SW1tZWRpYXRlKGRlZmVycmVkRGVzdHJveSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufTtcblxuaWYgKENDX0VESVRPUiB8fCBDQ19URVNUKSB7XG4gICAgLypcbiAgICAgKiAhI2VuXG4gICAgICogSW4gZmFjdCwgT2JqZWN0J3MgXCJkZXN0cm95XCIgd2lsbCBub3QgdHJpZ2dlciB0aGUgZGVzdHJ1Y3Qgb3BlcmF0aW9uIGluIEZpcmViYWwgRWRpdG9yLlxuICAgICAqIFRoZSBkZXN0cnVjdCBvcGVyYXRpb24gd2lsbCBiZSBleGVjdXRlZCBieSBVbmRvIHN5c3RlbSBsYXRlci5cbiAgICAgKiAhI3poXG4gICAgICog5LqL5a6e5LiK77yM5a+56LGh55qEIOKAnGRlc3Ryb3nigJ0g5LiN5Lya5Zyo57yW6L6R5Zmo5Lit6Kem5Y+R5p6Q5p6E5pON5L2c77yMXG4gICAgICog5p6Q5p6E5pON5L2c5bCG5ZyoIFVuZG8g57O757uf5LitICoq5bu25ZCOKiog5omn6KGM44CCXG4gICAgICogQG1ldGhvZCByZWFsRGVzdHJveUluRWRpdG9yXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBwcm90b3R5cGUucmVhbERlc3Ryb3lJbkVkaXRvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCAhKHRoaXMuX29iakZsYWdzICYgRGVzdHJveWVkKSApIHtcbiAgICAgICAgICAgIGNjLndhcm5JRCg1MDAxKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fb2JqRmxhZ3MgJiBSZWFsRGVzdHJveWVkKSB7XG4gICAgICAgICAgICBjYy53YXJuSUQoNTAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZGVzdHJ1Y3QoKTtcbiAgICAgICAgdGhpcy5fb2JqRmxhZ3MgfD0gUmVhbERlc3Ryb3llZDtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBjb21waWxlRGVzdHJ1Y3QgKG9iaiwgY3Rvcikge1xuICAgIHZhciBzaG91bGRTa2lwSWQgPSBvYmogaW5zdGFuY2VvZiBjYy5fQmFzZU5vZGUgfHwgb2JqIGluc3RhbmNlb2YgY2MuQ29tcG9uZW50O1xuICAgIHZhciBpZFRvU2tpcCA9IHNob3VsZFNraXBJZCA/ICdfaWQnIDogbnVsbDtcblxuICAgIHZhciBrZXksIHByb3BzVG9SZXNldCA9IHt9O1xuICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IGlkVG9Ta2lwKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGVvZiBvYmpba2V5XSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgICAgICAgICAgIHByb3BzVG9SZXNldFtrZXldID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICAgICAgICAgICAgICBwcm9wc1RvUmVzZXRba2V5XSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIE92ZXJ3cml0ZSBwcm9wc1RvUmVzZXQgYWNjb3JkaW5nIHRvIENsYXNzXG4gICAgaWYgKGNjLkNsYXNzLl9pc0NDQ2xhc3MoY3RvcikpIHtcbiAgICAgICAgdmFyIGF0dHJzID0gY2MuQ2xhc3MuQXR0ci5nZXRDbGFzc0F0dHJzKGN0b3IpO1xuICAgICAgICB2YXIgcHJvcExpc3QgPSBjdG9yLl9fcHJvcHNfXztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAga2V5ID0gcHJvcExpc3RbaV07XG4gICAgICAgICAgICB2YXIgYXR0cktleSA9IGtleSArIGNjLkNsYXNzLkF0dHIuREVMSU1FVEVSICsgJ2RlZmF1bHQnO1xuICAgICAgICAgICAgaWYgKGF0dHJLZXkgaW4gYXR0cnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2hvdWxkU2tpcElkICYmIGtleSA9PT0gJ19pZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN3aXRjaCAodHlwZW9mIGF0dHJzW2F0dHJLZXldKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wc1RvUmVzZXRba2V5XSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzVG9SZXNldFtrZXldID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHNUb1Jlc2V0W2tleV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoQ0NfU1VQUE9SVF9KSVQpIHtcbiAgICAgICAgLy8gY29tcGlsZSBjb2RlXG4gICAgICAgIHZhciBmdW5jID0gJyc7XG4gICAgICAgIGZvciAoa2V5IGluIHByb3BzVG9SZXNldCkge1xuICAgICAgICAgICAgdmFyIHN0YXRlbWVudDtcbiAgICAgICAgICAgIGlmIChDQ0NsYXNzLklERU5USUZJRVJfUkUudGVzdChrZXkpKSB7XG4gICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gJ28uJyArIGtleSArICc9JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXRlbWVudCA9ICdvWycgKyBDQ0NsYXNzLmVzY2FwZUZvckpTKGtleSkgKyAnXT0nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHZhbCA9IHByb3BzVG9SZXNldFtrZXldO1xuICAgICAgICAgICAgaWYgKHZhbCA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICB2YWwgPSAnXCJcIic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jICs9IChzdGF0ZW1lbnQgKyB2YWwgKyAnO1xcbicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBGdW5jdGlvbignbycsIGZ1bmMpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChvKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcHNUb1Jlc2V0KSB7XG4gICAgICAgICAgICAgICAgb1trZXldID0gcHJvcHNUb1Jlc2V0W2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuXG4vKipcbiAqICEjZW5cbiAqIENsZWFyIGFsbCByZWZlcmVuY2VzIGluIHRoZSBpbnN0YW5jZS5cbiAqXG4gKiBOT1RFOiB0aGlzIG1ldGhvZCB3aWxsIG5vdCBjbGVhciB0aGUgYGdldHRlcmAgb3IgYHNldHRlcmAgZnVuY3Rpb25zIHdoaWNoIGRlZmluZWQgaW4gdGhlIGluc3RhbmNlIG9mIGBDQ09iamVjdGAuXG4gKiBZb3UgY2FuIG92ZXJyaWRlIHRoZSBgX2Rlc3RydWN0YCBtZXRob2QgaWYgeW91IG5lZWQsIGZvciBleGFtcGxlOlxuICogYGBganNcbiAqIF9kZXN0cnVjdDogZnVuY3Rpb24gKCkge1xuICogICAgIGZvciAodmFyIGtleSBpbiB0aGlzKSB7XG4gKiAgICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAqICAgICAgICAgICAgIHN3aXRjaCAodHlwZW9mIHRoaXNba2V5XSkge1xuICogICAgICAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gKiAgICAgICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9ICcnO1xuICogICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAqICAgICAgICAgICAgICAgICBjYXNlICdvYmplY3QnOlxuICogICAgICAgICAgICAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAqICAgICAgICAgICAgICAgICAgICAgdGhpc1trZXldID0gbnVsbDtcbiAqICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gKiAgICAgICAgIH1cbiAqICAgICB9XG4gKiB9XG4gKiBgYGBcbiAqICEjemhcbiAqIOa4hemZpOWunuS+i+S4reeahOaJgOacieW8leeUqOOAglxuICogXG4gKiDms6jmhI/vvJrmraTmlrnms5XkuI3kvJrmuIXpmaTlnKggYENDT2JqZWN0YCDlrp7kvovkuK3lrprkuYnnmoQgYGdldHRlcmAg5oiWIGBzZXR0ZXJg44CC5aaC5p6c6ZyA6KaB77yM5L2g5Y+v5Lul6YeN5YaZIGBfZGVzdHJ1Y3RgIOaWueazleOAguS+i+Wmgu+8mlxuICogXG4gKiBgYGBqc1xuICogX2Rlc3RydWN0OiBmdW5jdGlvbiAoKSB7XG4gKiAgICAgZm9yICh2YXIga2V5IGluIHRoaXMpIHtcbiAqICAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICogICAgICAgICAgICAgc3dpdGNoICh0eXBlb2YgdGhpc1trZXldKSB7XG4gKiAgICAgICAgICAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAqICAgICAgICAgICAgICAgICAgICAgdGhpc1trZXldID0gJyc7XG4gKiAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICogICAgICAgICAgICAgICAgIGNhc2UgJ29iamVjdCc6XG4gKiAgICAgICAgICAgICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICogICAgICAgICAgICAgICAgICAgICB0aGlzW2tleV0gPSBudWxsO1xuICogICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAqICAgICAgICAgfVxuICogICAgIH1cbiAqIH1cbiAqIGBgYFxuICogQG1ldGhvZCBfZGVzdHJ1Y3RcbiAqIEBwcml2YXRlXG4gKi9cbnByb3RvdHlwZS5fZGVzdHJ1Y3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGN0b3IgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgIHZhciBkZXN0cnVjdCA9IGN0b3IuX19kZXN0cnVjdF9fO1xuICAgIGlmICghZGVzdHJ1Y3QpIHtcbiAgICAgICAgZGVzdHJ1Y3QgPSBjb21waWxlRGVzdHJ1Y3QodGhpcywgY3Rvcik7XG4gICAgICAgIGpzLnZhbHVlKGN0b3IsICdfX2Rlc3RydWN0X18nLCBkZXN0cnVjdCwgdHJ1ZSk7XG4gICAgfVxuICAgIGRlc3RydWN0KHRoaXMpO1xufTtcblxuLyoqXG4gKiAhI2VuXG4gKiBDYWxsZWQgYmVmb3JlIHRoZSBvYmplY3QgYmVpbmcgZGVzdHJveWVkLlxuICogISN6aFxuICog5Zyo5a+56LGh6KKr6ZSA5q+B5LmL5YmN6LCD55So44CCXG4gKiBAbWV0aG9kIF9vblByZURlc3Ryb3lcbiAqIEBwcml2YXRlXG4gKi9cbnByb3RvdHlwZS5fb25QcmVEZXN0cm95ID0gbnVsbDtcblxucHJvdG90eXBlLl9kZXN0cm95SW1tZWRpYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl9vYmpGbGFncyAmIERlc3Ryb3llZCkge1xuICAgICAgICBjYy5lcnJvcklEKDUwMDApO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIGVuZ2luZSBpbnRlcm5hbCBjYWxsYmFja1xuICAgIGlmICh0aGlzLl9vblByZURlc3Ryb3kpIHtcbiAgICAgICAgdGhpcy5fb25QcmVEZXN0cm95KCk7XG4gICAgfVxuXG4gICAgaWYgKChDQ19URVNUID8gKC8qIG1ha2UgQ0NfRURJVE9SIG1vY2thYmxlKi8gRnVuY3Rpb24oJ3JldHVybiAhQ0NfRURJVE9SJykpKCkgOiAhQ0NfRURJVE9SKSB8fCBjYy5lbmdpbmUuX2lzUGxheWluZykge1xuICAgICAgICB0aGlzLl9kZXN0cnVjdCgpO1xuICAgIH1cblxuICAgIHRoaXMuX29iakZsYWdzIHw9IERlc3Ryb3llZDtcbn07XG5cbmlmIChDQ19FRElUT1IpIHtcbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVGhlIGN1c3RvbWl6ZWQgc2VyaWFsaXphdGlvbiBmb3IgdGhpcyBvYmplY3QuIChFZGl0b3IgT25seSlcbiAgICAgKiAhI3poXG4gICAgICog5Li65q2k5a+56LGh5a6a5Yi25bqP5YiX5YyW44CCXG4gICAgICogQG1ldGhvZCBfc2VyaWFsaXplXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBleHBvcnRpbmdcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IHRoZSBzZXJpYWxpemVkIGpzb24gZGF0YSBvYmplY3RcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHByb3RvdHlwZS5fc2VyaWFsaXplID0gbnVsbDtcbn1cblxuLyoqXG4gKiAhI2VuXG4gKiBJbml0IHRoaXMgb2JqZWN0IGZyb20gdGhlIGN1c3RvbSBzZXJpYWxpemVkIGRhdGEuXG4gKiAhI3poXG4gKiDku47oh6rlrprkuYnluo/liJfljJbmlbDmja7liJ3lp4vljJbmraTlr7nosaHjgIJcbiAqIEBtZXRob2QgX2Rlc2VyaWFsaXplXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIHRoZSBzZXJpYWxpemVkIGpzb24gZGF0YVxuICogQHBhcmFtIHtfRGVzZXJpYWxpemVyfSBjdHhcbiAqIEBwcml2YXRlXG4gKi9cbnByb3RvdHlwZS5fZGVzZXJpYWxpemUgPSBudWxsO1xuXG4vKipcbiAqIEBtb2R1bGUgY2NcbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIENoZWNrcyB3aGV0aGVyIHRoZSBvYmplY3QgaXMgbm9uLW5pbCBhbmQgbm90IHlldCBkZXN0cm95ZWQuPGJyPlxuICogV2hlbiBhbiBvYmplY3QncyBgZGVzdHJveWAgaXMgY2FsbGVkLCBpdCBpcyBhY3R1YWxseSBkZXN0cm95ZWQgYWZ0ZXIgdGhlIGVuZCBvZiB0aGlzIGZyYW1lLlxuICogU28gYGlzVmFsaWRgIHdpbGwgcmV0dXJuIGZhbHNlIGZyb20gdGhlIG5leHQgZnJhbWUsIHdoaWxlIGBpc1ZhbGlkYCBpbiB0aGUgY3VycmVudCBmcmFtZSB3aWxsIHN0aWxsIGJlIHRydWUuXG4gKiBJZiB5b3Ugd2FudCB0byBkZXRlcm1pbmUgd2hldGhlciB0aGUgY3VycmVudCBmcmFtZSBoYXMgY2FsbGVkIGBkZXN0cm95YCwgdXNlIGBjYy5pc1ZhbGlkKG9iaiwgdHJ1ZSlgLFxuICogYnV0IHRoaXMgaXMgb2Z0ZW4gY2F1c2VkIGJ5IGEgcGFydGljdWxhciBsb2dpY2FsIHJlcXVpcmVtZW50cywgd2hpY2ggaXMgbm90IG5vcm1hbGx5IHJlcXVpcmVkLlxuICpcbiAqICEjemhcbiAqIOajgOafpeivpeWvueixoeaYr+WQpuS4jeS4uiBudWxsIOW5tuS4lOWwmuacqumUgOavgeOAgjxicj5cbiAqIOW9k+S4gOS4quWvueixoeeahCBgZGVzdHJveWAg6LCD55So5Lul5ZCO77yM5Lya5Zyo6L+Z5LiA5bin57uT5p2f5ZCO5omN55yf5q2j6ZSA5q+B44CC5Zug5q2k5LuO5LiL5LiA5bin5byA5aeLIGBpc1ZhbGlkYCDlsLHkvJrov5Tlm54gZmFsc2XvvIzogIzlvZPliY3luKflhoUgYGlzVmFsaWRgIOS7jeeEtuS8muaYryB0cnVl44CC5aaC5p6c5biM5pyb5Yik5pat5b2T5YmN5bin5piv5ZCm6LCD55So6L+HIGBkZXN0cm95YO+8jOivt+S9v+eUqCBgY2MuaXNWYWxpZChvYmosIHRydWUpYO+8jOS4jei/h+i/meW+gOW+gOaYr+eJueauiueahOS4muWKoemcgOaxguW8lei1t+eahO+8jOmAmuW4uOaDheWGteS4i+S4jemcgOimgei/meagt+OAglxuICpcbiAqIEBtZXRob2QgaXNWYWxpZFxuICogQHBhcmFtIHthbnl9IHZhbHVlXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtzdHJpY3RNb2RlPWZhbHNlXSAtIElmIHRydWUsIE9iamVjdCBjYWxsZWQgZGVzdHJveSgpIGluIHRoaXMgZnJhbWUgd2lsbCBhbHNvIHRyZWF0ZWQgYXMgaW52YWxpZC5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IHdoZXRoZXIgaXMgdmFsaWRcbiAqIEBleGFtcGxlXG4gKiB2YXIgbm9kZSA9IG5ldyBjYy5Ob2RlKCk7XG4gKiBjYy5sb2coY2MuaXNWYWxpZChub2RlKSk7ICAgIC8vIHRydWVcbiAqIG5vZGUuZGVzdHJveSgpO1xuICogY2MubG9nKGNjLmlzVmFsaWQobm9kZSkpOyAgICAvLyB0cnVlLCBzdGlsbCB2YWxpZCBpbiB0aGlzIGZyYW1lXG4gKiAvLyBhZnRlciBhIGZyYW1lLi4uXG4gKiBjYy5sb2coY2MuaXNWYWxpZChub2RlKSk7ICAgIC8vIGZhbHNlLCBkZXN0cm95ZWQgaW4gdGhlIGVuZCBvZiBsYXN0IGZyYW1lXG4gKi9cbmNjLmlzVmFsaWQgPSBmdW5jdGlvbiAodmFsdWUsIHN0cmljdE1vZGUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gISF2YWx1ZSAmJiAhKHZhbHVlLl9vYmpGbGFncyAmIChzdHJpY3RNb2RlID8gKERlc3Ryb3llZCB8IFRvRGVzdHJveSkgOiBEZXN0cm95ZWQpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnO1xuICAgIH1cbn07XG5cbmlmIChDQ19FRElUT1IgfHwgQ0NfVEVTVCkge1xuICAgIGpzLnZhbHVlKENDT2JqZWN0LCAnX3dpbGxEZXN0cm95JywgZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gIShvYmouX29iakZsYWdzICYgRGVzdHJveWVkKSAmJiAob2JqLl9vYmpGbGFncyAmIFRvRGVzdHJveSkgPiAwO1xuICAgIH0pO1xuICAgIGpzLnZhbHVlKENDT2JqZWN0LCAnX2NhbmNlbERlc3Ryb3knLCBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIG9iai5fb2JqRmxhZ3MgJj0gflRvRGVzdHJveTtcbiAgICAgICAganMuYXJyYXkuZmFzdFJlbW92ZShvYmplY3RzVG9EZXN0cm95LCBvYmopO1xuICAgIH0pO1xufVxuXG5jYy5PYmplY3QgPSBtb2R1bGUuZXhwb3J0cyA9IENDT2JqZWN0O1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=