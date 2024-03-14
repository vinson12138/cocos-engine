
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/instantiate.js';
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
var CCObject = require('./CCObject');

var CCValueType = require('../value-types/value-type');

var Destroyed = CCObject.Flags.Destroyed;
var PersistentMask = CCObject.Flags.PersistentMask;

var _isDomNode = require('./utils').isDomNode;

var js = require('./js');
/**
 * !#en Clones the object `original` and returns the clone, or instantiate a node from the Prefab.
 * !#zh 克隆指定的任意类型的对象，或者从 Prefab 实例化出新节点。
 *
 * （Instantiate 时，function 和 dom 等非可序列化对象会直接保留原有引用，Asset 会直接进行浅拷贝，可序列化类型会进行深拷贝。）
 *
 * @method instantiate
 * @param {Prefab|Node|Object} original - An existing object that you want to make a copy of.
 * @return {Node|Object} the newly instantiated object
 * @typescript
 * instantiate(original: Prefab): Node
 * instantiate<T>(original: T): T
 * @example
 * // instantiate node from prefab
 * var scene = cc.director.getScene();
 * var node = cc.instantiate(prefabAsset);
 * node.parent = scene;
 * // clone node
 * var scene = cc.director.getScene();
 * var node = cc.instantiate(targetNode);
 * node.parent = scene;
 */


function instantiate(original, internal_force) {
  if (!internal_force) {
    if (typeof original !== 'object' || Array.isArray(original)) {
      if (CC_DEV) {
        cc.errorID(6900);
      }

      return null;
    }

    if (!original) {
      if (CC_DEV) {
        cc.errorID(6901);
      }

      return null;
    }

    if (!cc.isValid(original)) {
      if (CC_DEV) {
        cc.errorID(6902);
      }

      return null;
    }

    if (CC_DEV && original instanceof cc.Component) {
      cc.warn('Should not instantiate a single cc.Component directly, you must instantiate the entire node.');
    }
  }

  var clone;

  if (original instanceof CCObject) {
    // Invoke _instantiate method if supplied.
    // The _instantiate callback will be called only on the root object, its associated object will not be called.
    // @callback associated
    // @param {Object} [instantiated] - If supplied, _instantiate just need to initialize the instantiated object,
    //                                  no need to create new object by itself.
    // @returns {Object} - the instantiated object
    if (original._instantiate) {
      cc.game._isCloning = true;
      clone = original._instantiate(null, true);
      cc.game._isCloning = false;
      return clone;
    } else if (original instanceof cc.Asset) {
      // 不允许用通用方案实例化资源
      if (CC_DEV) {
        cc.errorID(6903);
      }

      return null;
    }
  }

  cc.game._isCloning = true;
  clone = doInstantiate(original);
  cc.game._isCloning = false;
  return clone;
}

var objsToClearTmpVar = []; // used to reset _iN$t variable
///**
// * Do instantiate object, the object to instantiate must be non-nil.
// * 这是一个通用的 instantiate 方法，可能效率比较低。
// * 之后可以给各种类型重写快速实例化的特殊实现，但应该在单元测试中将结果和这个方法的结果进行对比。
// * 值得注意的是，这个方法不可重入。
// *
// * @param {Object} obj - 该方法仅供内部使用，用户需负责保证参数合法。什么参数是合法的请参考 cc.instantiate 的实现。
// * @param {Node} [parent] - 只有在该对象下的场景物体会被克隆。
// * @return {Object}
// * @private
// */

function doInstantiate(obj, parent) {
  if (Array.isArray(obj)) {
    if (CC_DEV) {
      cc.errorID(6904);
    }

    return null;
  }

  if (_isDomNode && _isDomNode(obj)) {
    if (CC_DEV) {
      cc.errorID(6905);
    }

    return null;
  }

  var clone;

  if (obj._iN$t) {
    // User can specify an existing object by assigning the "_iN$t" property.
    // enumerateObject will always push obj to objsToClearTmpVar
    clone = obj._iN$t;
  } else if (obj.constructor) {
    var klass = obj.constructor;
    clone = new klass();
  } else {
    clone = Object.create(null);
  }

  enumerateObject(obj, clone, parent);

  for (var i = 0, len = objsToClearTmpVar.length; i < len; ++i) {
    objsToClearTmpVar[i]._iN$t = null;
  }

  objsToClearTmpVar.length = 0;
  return clone;
} // @param {Object} obj - The object to instantiate, typeof must be 'object' and should not be an array.


function enumerateCCClass(klass, obj, clone, parent) {
  var props = klass.__values__;

  for (var p = 0; p < props.length; p++) {
    var key = props[p];
    var value = obj[key];

    if (typeof value === 'object' && value) {
      var initValue = clone[key];

      if (initValue instanceof CCValueType && initValue.constructor === value.constructor) {
        initValue.set(value);
      } else {
        clone[key] = value._iN$t || instantiateObj(value, parent);
      }
    } else {
      clone[key] = value;
    }
  }
}

function enumerateObject(obj, clone, parent) {
  // 目前使用“_iN$t”这个特殊字段来存实例化后的对象，这样做主要是为了防止循环引用
  // 注意，为了避免循环引用，所有新创建的实例，必须在赋值前被设为源对象的_iN$t
  js.value(obj, '_iN$t', clone, true);
  objsToClearTmpVar.push(obj);
  var klass = obj.constructor;

  if (cc.Class._isCCClass(klass)) {
    enumerateCCClass(klass, obj, clone, parent);
  } else {
    // primitive javascript object
    for (var key in obj) {
      if (!obj.hasOwnProperty(key) || key.charCodeAt(0) === 95 && key.charCodeAt(1) === 95 && // starts with "__"
      key !== '__type__') {
        continue;
      }

      var value = obj[key];

      if (typeof value === 'object' && value) {
        if (value === clone) {
          continue; // value is obj._iN$t
        }

        clone[key] = value._iN$t || instantiateObj(value, parent);
      } else {
        clone[key] = value;
      }
    }
  }

  if (obj instanceof CCObject) {
    clone._objFlags &= PersistentMask;
  }
}
/*
 * @param {Object|Array} obj - the original non-nil object, typeof must be 'object'
 * @return {Object|Array} - the original non-nil object, typeof must be 'object'
 */


function instantiateObj(obj, parent) {
  if (obj instanceof CCValueType) {
    return obj.clone();
  }

  if (obj instanceof cc.Asset) {
    // 所有资源直接引用，不需要拷贝
    return obj;
  }

  var clone;

  if (ArrayBuffer.isView(obj)) {
    var len = obj.length;
    clone = new obj.constructor(len);
    obj._iN$t = clone;
    objsToClearTmpVar.push(obj);

    for (var i = 0; i < len; ++i) {
      clone[i] = obj[i];
    }

    return clone;
  }

  if (Array.isArray(obj)) {
    var _len = obj.length;
    clone = new Array(_len);
    js.value(obj, '_iN$t', clone, true);
    objsToClearTmpVar.push(obj);

    for (var _i = 0; _i < _len; ++_i) {
      var value = obj[_i];

      if (typeof value === 'object' && value) {
        clone[_i] = value._iN$t || instantiateObj(value, parent);
      } else {
        clone[_i] = value;
      }
    }

    return clone;
  } else if (obj._objFlags & Destroyed) {
    // the same as cc.isValid(obj)
    return null;
  }

  var ctor = obj.constructor;

  if (cc.Class._isCCClass(ctor)) {
    if (parent) {
      if (parent instanceof cc.Component) {
        if (obj instanceof cc._BaseNode || obj instanceof cc.Component) {
          return obj;
        }
      } else if (parent instanceof cc._BaseNode) {
        if (obj instanceof cc._BaseNode) {
          if (!obj.isChildOf(parent)) {
            // should not clone other nodes if not descendant
            return obj;
          }
        } else if (obj instanceof cc.Component) {
          if (!obj.node.isChildOf(parent)) {
            // should not clone other component if not descendant
            return obj;
          }
        }
      }
    }

    clone = new ctor();
  } else if (ctor === Object) {
    clone = {};
  } else if (!ctor) {
    clone = Object.create(null);
  } else {
    // unknown type
    return obj;
  }

  enumerateObject(obj, clone, parent);
  return clone;
}

instantiate._clone = doInstantiate;
cc.instantiate = instantiate;
module.exports = instantiate;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BsYXRmb3JtL2luc3RhbnRpYXRlLmpzIl0sIm5hbWVzIjpbIkNDT2JqZWN0IiwicmVxdWlyZSIsIkNDVmFsdWVUeXBlIiwiRGVzdHJveWVkIiwiRmxhZ3MiLCJQZXJzaXN0ZW50TWFzayIsIl9pc0RvbU5vZGUiLCJpc0RvbU5vZGUiLCJqcyIsImluc3RhbnRpYXRlIiwib3JpZ2luYWwiLCJpbnRlcm5hbF9mb3JjZSIsIkFycmF5IiwiaXNBcnJheSIsIkNDX0RFViIsImNjIiwiZXJyb3JJRCIsImlzVmFsaWQiLCJDb21wb25lbnQiLCJ3YXJuIiwiY2xvbmUiLCJfaW5zdGFudGlhdGUiLCJnYW1lIiwiX2lzQ2xvbmluZyIsIkFzc2V0IiwiZG9JbnN0YW50aWF0ZSIsIm9ianNUb0NsZWFyVG1wVmFyIiwib2JqIiwicGFyZW50IiwiX2lOJHQiLCJjb25zdHJ1Y3RvciIsImtsYXNzIiwiT2JqZWN0IiwiY3JlYXRlIiwiZW51bWVyYXRlT2JqZWN0IiwiaSIsImxlbiIsImxlbmd0aCIsImVudW1lcmF0ZUNDQ2xhc3MiLCJwcm9wcyIsIl9fdmFsdWVzX18iLCJwIiwia2V5IiwidmFsdWUiLCJpbml0VmFsdWUiLCJzZXQiLCJpbnN0YW50aWF0ZU9iaiIsInB1c2giLCJDbGFzcyIsIl9pc0NDQ2xhc3MiLCJoYXNPd25Qcm9wZXJ0eSIsImNoYXJDb2RlQXQiLCJfb2JqRmxhZ3MiLCJBcnJheUJ1ZmZlciIsImlzVmlldyIsImN0b3IiLCJfQmFzZU5vZGUiLCJpc0NoaWxkT2YiLCJub2RlIiwiX2Nsb25lIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBSUEsUUFBUSxHQUFHQyxPQUFPLENBQUMsWUFBRCxDQUF0Qjs7QUFDQSxJQUFJQyxXQUFXLEdBQUdELE9BQU8sQ0FBQywyQkFBRCxDQUF6Qjs7QUFDQSxJQUFJRSxTQUFTLEdBQUdILFFBQVEsQ0FBQ0ksS0FBVCxDQUFlRCxTQUEvQjtBQUNBLElBQUlFLGNBQWMsR0FBR0wsUUFBUSxDQUFDSSxLQUFULENBQWVDLGNBQXBDOztBQUNBLElBQUlDLFVBQVUsR0FBR0wsT0FBTyxDQUFDLFNBQUQsQ0FBUCxDQUFtQk0sU0FBcEM7O0FBQ0EsSUFBSUMsRUFBRSxHQUFHUCxPQUFPLENBQUMsTUFBRCxDQUFoQjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxTQUFTUSxXQUFULENBQXNCQyxRQUF0QixFQUFnQ0MsY0FBaEMsRUFBZ0Q7QUFDNUMsTUFBSSxDQUFDQSxjQUFMLEVBQXFCO0FBQ2pCLFFBQUksT0FBT0QsUUFBUCxLQUFvQixRQUFwQixJQUFnQ0UsS0FBSyxDQUFDQyxPQUFOLENBQWNILFFBQWQsQ0FBcEMsRUFBNkQ7QUFDekQsVUFBSUksTUFBSixFQUFZO0FBQ1JDLFFBQUFBLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLElBQVg7QUFDSDs7QUFDRCxhQUFPLElBQVA7QUFDSDs7QUFDRCxRQUFJLENBQUNOLFFBQUwsRUFBZTtBQUNYLFVBQUlJLE1BQUosRUFBWTtBQUNSQyxRQUFBQSxFQUFFLENBQUNDLE9BQUgsQ0FBVyxJQUFYO0FBQ0g7O0FBQ0QsYUFBTyxJQUFQO0FBQ0g7O0FBQ0QsUUFBSSxDQUFDRCxFQUFFLENBQUNFLE9BQUgsQ0FBV1AsUUFBWCxDQUFMLEVBQTJCO0FBQ3ZCLFVBQUlJLE1BQUosRUFBWTtBQUNSQyxRQUFBQSxFQUFFLENBQUNDLE9BQUgsQ0FBVyxJQUFYO0FBQ0g7O0FBQ0QsYUFBTyxJQUFQO0FBQ0g7O0FBQ0QsUUFBSUYsTUFBTSxJQUFJSixRQUFRLFlBQVlLLEVBQUUsQ0FBQ0csU0FBckMsRUFBZ0Q7QUFDNUNILE1BQUFBLEVBQUUsQ0FBQ0ksSUFBSCxDQUFRLDhGQUFSO0FBQ0g7QUFDSjs7QUFFRCxNQUFJQyxLQUFKOztBQUNBLE1BQUlWLFFBQVEsWUFBWVYsUUFBeEIsRUFBa0M7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBSVUsUUFBUSxDQUFDVyxZQUFiLEVBQTJCO0FBQ3ZCTixNQUFBQSxFQUFFLENBQUNPLElBQUgsQ0FBUUMsVUFBUixHQUFxQixJQUFyQjtBQUNBSCxNQUFBQSxLQUFLLEdBQUdWLFFBQVEsQ0FBQ1csWUFBVCxDQUFzQixJQUF0QixFQUE0QixJQUE1QixDQUFSO0FBQ0FOLE1BQUFBLEVBQUUsQ0FBQ08sSUFBSCxDQUFRQyxVQUFSLEdBQXFCLEtBQXJCO0FBQ0EsYUFBT0gsS0FBUDtBQUNILEtBTEQsTUFNSyxJQUFJVixRQUFRLFlBQVlLLEVBQUUsQ0FBQ1MsS0FBM0IsRUFBa0M7QUFDbkM7QUFDQSxVQUFJVixNQUFKLEVBQVk7QUFDUkMsUUFBQUEsRUFBRSxDQUFDQyxPQUFILENBQVcsSUFBWDtBQUNIOztBQUNELGFBQU8sSUFBUDtBQUNIO0FBQ0o7O0FBRURELEVBQUFBLEVBQUUsQ0FBQ08sSUFBSCxDQUFRQyxVQUFSLEdBQXFCLElBQXJCO0FBQ0FILEVBQUFBLEtBQUssR0FBR0ssYUFBYSxDQUFDZixRQUFELENBQXJCO0FBQ0FLLEVBQUFBLEVBQUUsQ0FBQ08sSUFBSCxDQUFRQyxVQUFSLEdBQXFCLEtBQXJCO0FBQ0EsU0FBT0gsS0FBUDtBQUNIOztBQUVELElBQUlNLGlCQUFpQixHQUFHLEVBQXhCLEVBQThCO0FBRTlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsU0FBU0QsYUFBVCxDQUF3QkUsR0FBeEIsRUFBNkJDLE1BQTdCLEVBQXFDO0FBQ2pDLE1BQUloQixLQUFLLENBQUNDLE9BQU4sQ0FBY2MsR0FBZCxDQUFKLEVBQXdCO0FBQ3BCLFFBQUliLE1BQUosRUFBWTtBQUNSQyxNQUFBQSxFQUFFLENBQUNDLE9BQUgsQ0FBVyxJQUFYO0FBQ0g7O0FBQ0QsV0FBTyxJQUFQO0FBQ0g7O0FBQ0QsTUFBSVYsVUFBVSxJQUFJQSxVQUFVLENBQUNxQixHQUFELENBQTVCLEVBQW1DO0FBQy9CLFFBQUliLE1BQUosRUFBWTtBQUNSQyxNQUFBQSxFQUFFLENBQUNDLE9BQUgsQ0FBVyxJQUFYO0FBQ0g7O0FBQ0QsV0FBTyxJQUFQO0FBQ0g7O0FBRUQsTUFBSUksS0FBSjs7QUFDQSxNQUFJTyxHQUFHLENBQUNFLEtBQVIsRUFBZTtBQUNYO0FBQ0E7QUFDQVQsSUFBQUEsS0FBSyxHQUFHTyxHQUFHLENBQUNFLEtBQVo7QUFDSCxHQUpELE1BS0ssSUFBSUYsR0FBRyxDQUFDRyxXQUFSLEVBQXFCO0FBQ3RCLFFBQUlDLEtBQUssR0FBR0osR0FBRyxDQUFDRyxXQUFoQjtBQUNBVixJQUFBQSxLQUFLLEdBQUcsSUFBSVcsS0FBSixFQUFSO0FBQ0gsR0FISSxNQUlBO0FBQ0RYLElBQUFBLEtBQUssR0FBR1ksTUFBTSxDQUFDQyxNQUFQLENBQWMsSUFBZCxDQUFSO0FBQ0g7O0FBRURDLEVBQUFBLGVBQWUsQ0FBQ1AsR0FBRCxFQUFNUCxLQUFOLEVBQWFRLE1BQWIsQ0FBZjs7QUFFQSxPQUFLLElBQUlPLENBQUMsR0FBRyxDQUFSLEVBQVdDLEdBQUcsR0FBR1YsaUJBQWlCLENBQUNXLE1BQXhDLEVBQWdERixDQUFDLEdBQUdDLEdBQXBELEVBQXlELEVBQUVELENBQTNELEVBQThEO0FBQzFEVCxJQUFBQSxpQkFBaUIsQ0FBQ1MsQ0FBRCxDQUFqQixDQUFxQk4sS0FBckIsR0FBNkIsSUFBN0I7QUFDSDs7QUFDREgsRUFBQUEsaUJBQWlCLENBQUNXLE1BQWxCLEdBQTJCLENBQTNCO0FBRUEsU0FBT2pCLEtBQVA7QUFDSCxFQUVEOzs7QUFFQSxTQUFTa0IsZ0JBQVQsQ0FBMkJQLEtBQTNCLEVBQWtDSixHQUFsQyxFQUF1Q1AsS0FBdkMsRUFBOENRLE1BQTlDLEVBQXNEO0FBQ2xELE1BQUlXLEtBQUssR0FBR1IsS0FBSyxDQUFDUyxVQUFsQjs7QUFDQSxPQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdGLEtBQUssQ0FBQ0YsTUFBMUIsRUFBa0NJLENBQUMsRUFBbkMsRUFBdUM7QUFDbkMsUUFBSUMsR0FBRyxHQUFHSCxLQUFLLENBQUNFLENBQUQsQ0FBZjtBQUNBLFFBQUlFLEtBQUssR0FBR2hCLEdBQUcsQ0FBQ2UsR0FBRCxDQUFmOztBQUNBLFFBQUksT0FBT0MsS0FBUCxLQUFpQixRQUFqQixJQUE2QkEsS0FBakMsRUFBd0M7QUFDcEMsVUFBSUMsU0FBUyxHQUFHeEIsS0FBSyxDQUFDc0IsR0FBRCxDQUFyQjs7QUFDQSxVQUFJRSxTQUFTLFlBQVkxQyxXQUFyQixJQUNBMEMsU0FBUyxDQUFDZCxXQUFWLEtBQTBCYSxLQUFLLENBQUNiLFdBRHBDLEVBQ2lEO0FBQzdDYyxRQUFBQSxTQUFTLENBQUNDLEdBQVYsQ0FBY0YsS0FBZDtBQUNILE9BSEQsTUFJSztBQUNEdkIsUUFBQUEsS0FBSyxDQUFDc0IsR0FBRCxDQUFMLEdBQWFDLEtBQUssQ0FBQ2QsS0FBTixJQUFlaUIsY0FBYyxDQUFDSCxLQUFELEVBQVFmLE1BQVIsQ0FBMUM7QUFDSDtBQUNKLEtBVEQsTUFVSztBQUNEUixNQUFBQSxLQUFLLENBQUNzQixHQUFELENBQUwsR0FBYUMsS0FBYjtBQUNIO0FBQ0o7QUFDSjs7QUFFRCxTQUFTVCxlQUFULENBQTBCUCxHQUExQixFQUErQlAsS0FBL0IsRUFBc0NRLE1BQXRDLEVBQThDO0FBQzFDO0FBQ0E7QUFDQXBCLEVBQUFBLEVBQUUsQ0FBQ21DLEtBQUgsQ0FBU2hCLEdBQVQsRUFBYyxPQUFkLEVBQXVCUCxLQUF2QixFQUE4QixJQUE5QjtBQUNBTSxFQUFBQSxpQkFBaUIsQ0FBQ3FCLElBQWxCLENBQXVCcEIsR0FBdkI7QUFDQSxNQUFJSSxLQUFLLEdBQUdKLEdBQUcsQ0FBQ0csV0FBaEI7O0FBQ0EsTUFBSWYsRUFBRSxDQUFDaUMsS0FBSCxDQUFTQyxVQUFULENBQW9CbEIsS0FBcEIsQ0FBSixFQUFnQztBQUM1Qk8sSUFBQUEsZ0JBQWdCLENBQUNQLEtBQUQsRUFBUUosR0FBUixFQUFhUCxLQUFiLEVBQW9CUSxNQUFwQixDQUFoQjtBQUNILEdBRkQsTUFHSztBQUNEO0FBQ0EsU0FBSyxJQUFJYyxHQUFULElBQWdCZixHQUFoQixFQUFxQjtBQUNqQixVQUFJLENBQUNBLEdBQUcsQ0FBQ3VCLGNBQUosQ0FBbUJSLEdBQW5CLENBQUQsSUFDQ0EsR0FBRyxDQUFDUyxVQUFKLENBQWUsQ0FBZixNQUFzQixFQUF0QixJQUE0QlQsR0FBRyxDQUFDUyxVQUFKLENBQWUsQ0FBZixNQUFzQixFQUFsRCxJQUEwRDtBQUMxRFQsTUFBQUEsR0FBRyxLQUFLLFVBRmIsRUFHRTtBQUNFO0FBQ0g7O0FBQ0QsVUFBSUMsS0FBSyxHQUFHaEIsR0FBRyxDQUFDZSxHQUFELENBQWY7O0FBQ0EsVUFBSSxPQUFPQyxLQUFQLEtBQWlCLFFBQWpCLElBQTZCQSxLQUFqQyxFQUF3QztBQUNwQyxZQUFJQSxLQUFLLEtBQUt2QixLQUFkLEVBQXFCO0FBQ2pCLG1CQURpQixDQUNMO0FBQ2Y7O0FBQ0RBLFFBQUFBLEtBQUssQ0FBQ3NCLEdBQUQsQ0FBTCxHQUFhQyxLQUFLLENBQUNkLEtBQU4sSUFBZWlCLGNBQWMsQ0FBQ0gsS0FBRCxFQUFRZixNQUFSLENBQTFDO0FBQ0gsT0FMRCxNQU1LO0FBQ0RSLFFBQUFBLEtBQUssQ0FBQ3NCLEdBQUQsQ0FBTCxHQUFhQyxLQUFiO0FBQ0g7QUFDSjtBQUNKOztBQUNELE1BQUloQixHQUFHLFlBQVkzQixRQUFuQixFQUE2QjtBQUN6Qm9CLElBQUFBLEtBQUssQ0FBQ2dDLFNBQU4sSUFBbUIvQyxjQUFuQjtBQUNIO0FBQ0o7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsU0FBU3lDLGNBQVQsQ0FBeUJuQixHQUF6QixFQUE4QkMsTUFBOUIsRUFBc0M7QUFDbEMsTUFBSUQsR0FBRyxZQUFZekIsV0FBbkIsRUFBZ0M7QUFDNUIsV0FBT3lCLEdBQUcsQ0FBQ1AsS0FBSixFQUFQO0FBQ0g7O0FBQ0QsTUFBSU8sR0FBRyxZQUFZWixFQUFFLENBQUNTLEtBQXRCLEVBQTZCO0FBQ3pCO0FBQ0EsV0FBT0csR0FBUDtBQUNIOztBQUNELE1BQUlQLEtBQUo7O0FBQ0EsTUFBSWlDLFdBQVcsQ0FBQ0MsTUFBWixDQUFtQjNCLEdBQW5CLENBQUosRUFBNkI7QUFDekIsUUFBSVMsR0FBRyxHQUFHVCxHQUFHLENBQUNVLE1BQWQ7QUFDQWpCLElBQUFBLEtBQUssR0FBRyxJQUFLTyxHQUFHLENBQUNHLFdBQVQsQ0FBc0JNLEdBQXRCLENBQVI7QUFDQVQsSUFBQUEsR0FBRyxDQUFDRSxLQUFKLEdBQVlULEtBQVo7QUFDQU0sSUFBQUEsaUJBQWlCLENBQUNxQixJQUFsQixDQUF1QnBCLEdBQXZCOztBQUNBLFNBQUssSUFBSVEsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0MsR0FBcEIsRUFBeUIsRUFBRUQsQ0FBM0IsRUFBOEI7QUFDMUJmLE1BQUFBLEtBQUssQ0FBQ2UsQ0FBRCxDQUFMLEdBQVdSLEdBQUcsQ0FBQ1EsQ0FBRCxDQUFkO0FBQ0g7O0FBQ0QsV0FBT2YsS0FBUDtBQUNIOztBQUNELE1BQUlSLEtBQUssQ0FBQ0MsT0FBTixDQUFjYyxHQUFkLENBQUosRUFBd0I7QUFDcEIsUUFBSVMsSUFBRyxHQUFHVCxHQUFHLENBQUNVLE1BQWQ7QUFDQWpCLElBQUFBLEtBQUssR0FBRyxJQUFJUixLQUFKLENBQVV3QixJQUFWLENBQVI7QUFDQTVCLElBQUFBLEVBQUUsQ0FBQ21DLEtBQUgsQ0FBU2hCLEdBQVQsRUFBYyxPQUFkLEVBQXVCUCxLQUF2QixFQUE4QixJQUE5QjtBQUNBTSxJQUFBQSxpQkFBaUIsQ0FBQ3FCLElBQWxCLENBQXVCcEIsR0FBdkI7O0FBQ0EsU0FBSyxJQUFJUSxFQUFDLEdBQUcsQ0FBYixFQUFnQkEsRUFBQyxHQUFHQyxJQUFwQixFQUF5QixFQUFFRCxFQUEzQixFQUE4QjtBQUMxQixVQUFJUSxLQUFLLEdBQUdoQixHQUFHLENBQUNRLEVBQUQsQ0FBZjs7QUFDQSxVQUFJLE9BQU9RLEtBQVAsS0FBaUIsUUFBakIsSUFBNkJBLEtBQWpDLEVBQXdDO0FBQ3BDdkIsUUFBQUEsS0FBSyxDQUFDZSxFQUFELENBQUwsR0FBV1EsS0FBSyxDQUFDZCxLQUFOLElBQWVpQixjQUFjLENBQUNILEtBQUQsRUFBUWYsTUFBUixDQUF4QztBQUNILE9BRkQsTUFHSztBQUNEUixRQUFBQSxLQUFLLENBQUNlLEVBQUQsQ0FBTCxHQUFXUSxLQUFYO0FBQ0g7QUFDSjs7QUFDRCxXQUFPdkIsS0FBUDtBQUNILEdBZkQsTUFnQkssSUFBSU8sR0FBRyxDQUFDeUIsU0FBSixHQUFnQmpELFNBQXBCLEVBQStCO0FBQ2hDO0FBQ0EsV0FBTyxJQUFQO0FBQ0g7O0FBRUQsTUFBSW9ELElBQUksR0FBRzVCLEdBQUcsQ0FBQ0csV0FBZjs7QUFDQSxNQUFJZixFQUFFLENBQUNpQyxLQUFILENBQVNDLFVBQVQsQ0FBb0JNLElBQXBCLENBQUosRUFBK0I7QUFDM0IsUUFBSTNCLE1BQUosRUFBWTtBQUNSLFVBQUlBLE1BQU0sWUFBWWIsRUFBRSxDQUFDRyxTQUF6QixFQUFvQztBQUNoQyxZQUFJUyxHQUFHLFlBQVlaLEVBQUUsQ0FBQ3lDLFNBQWxCLElBQStCN0IsR0FBRyxZQUFZWixFQUFFLENBQUNHLFNBQXJELEVBQWdFO0FBQzVELGlCQUFPUyxHQUFQO0FBQ0g7QUFDSixPQUpELE1BS0ssSUFBSUMsTUFBTSxZQUFZYixFQUFFLENBQUN5QyxTQUF6QixFQUFvQztBQUNyQyxZQUFJN0IsR0FBRyxZQUFZWixFQUFFLENBQUN5QyxTQUF0QixFQUFpQztBQUM3QixjQUFJLENBQUM3QixHQUFHLENBQUM4QixTQUFKLENBQWM3QixNQUFkLENBQUwsRUFBNEI7QUFDeEI7QUFDQSxtQkFBT0QsR0FBUDtBQUNIO0FBQ0osU0FMRCxNQU1LLElBQUlBLEdBQUcsWUFBWVosRUFBRSxDQUFDRyxTQUF0QixFQUFpQztBQUNsQyxjQUFJLENBQUNTLEdBQUcsQ0FBQytCLElBQUosQ0FBU0QsU0FBVCxDQUFtQjdCLE1BQW5CLENBQUwsRUFBaUM7QUFDN0I7QUFDQSxtQkFBT0QsR0FBUDtBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUNEUCxJQUFBQSxLQUFLLEdBQUcsSUFBSW1DLElBQUosRUFBUjtBQUNILEdBdkJELE1Bd0JLLElBQUlBLElBQUksS0FBS3ZCLE1BQWIsRUFBcUI7QUFDdEJaLElBQUFBLEtBQUssR0FBRyxFQUFSO0FBQ0gsR0FGSSxNQUdBLElBQUksQ0FBQ21DLElBQUwsRUFBVztBQUNabkMsSUFBQUEsS0FBSyxHQUFHWSxNQUFNLENBQUNDLE1BQVAsQ0FBYyxJQUFkLENBQVI7QUFDSCxHQUZJLE1BR0E7QUFDRDtBQUNBLFdBQU9OLEdBQVA7QUFDSDs7QUFDRE8sRUFBQUEsZUFBZSxDQUFDUCxHQUFELEVBQU1QLEtBQU4sRUFBYVEsTUFBYixDQUFmO0FBQ0EsU0FBT1IsS0FBUDtBQUNIOztBQUVEWCxXQUFXLENBQUNrRCxNQUFaLEdBQXFCbEMsYUFBckI7QUFDQVYsRUFBRSxDQUFDTixXQUFILEdBQWlCQSxXQUFqQjtBQUNBbUQsTUFBTSxDQUFDQyxPQUFQLEdBQWlCcEQsV0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG52YXIgQ0NPYmplY3QgPSByZXF1aXJlKCcuL0NDT2JqZWN0Jyk7XHJcbnZhciBDQ1ZhbHVlVHlwZSA9IHJlcXVpcmUoJy4uL3ZhbHVlLXR5cGVzL3ZhbHVlLXR5cGUnKTtcclxudmFyIERlc3Ryb3llZCA9IENDT2JqZWN0LkZsYWdzLkRlc3Ryb3llZDtcclxudmFyIFBlcnNpc3RlbnRNYXNrID0gQ0NPYmplY3QuRmxhZ3MuUGVyc2lzdGVudE1hc2s7XHJcbnZhciBfaXNEb21Ob2RlID0gcmVxdWlyZSgnLi91dGlscycpLmlzRG9tTm9kZTtcclxudmFyIGpzID0gcmVxdWlyZSgnLi9qcycpO1xyXG5cclxuLyoqXHJcbiAqICEjZW4gQ2xvbmVzIHRoZSBvYmplY3QgYG9yaWdpbmFsYCBhbmQgcmV0dXJucyB0aGUgY2xvbmUsIG9yIGluc3RhbnRpYXRlIGEgbm9kZSBmcm9tIHRoZSBQcmVmYWIuXHJcbiAqICEjemgg5YWL6ZqG5oyH5a6a55qE5Lu75oSP57G75Z6L55qE5a+56LGh77yM5oiW6ICF5LuOIFByZWZhYiDlrp7kvovljJblh7rmlrDoioLngrnjgIJcclxuICpcclxuICog77yISW5zdGFudGlhdGUg5pe277yMZnVuY3Rpb24g5ZKMIGRvbSDnrYnpnZ7lj6/luo/liJfljJblr7nosaHkvJrnm7TmjqXkv53nlZnljp/mnInlvJXnlKjvvIxBc3NldCDkvJrnm7TmjqXov5vooYzmtYXmi7fotJ3vvIzlj6/luo/liJfljJbnsbvlnovkvJrov5vooYzmt7Hmi7fotJ3jgILvvIlcclxuICpcclxuICogQG1ldGhvZCBpbnN0YW50aWF0ZVxyXG4gKiBAcGFyYW0ge1ByZWZhYnxOb2RlfE9iamVjdH0gb3JpZ2luYWwgLSBBbiBleGlzdGluZyBvYmplY3QgdGhhdCB5b3Ugd2FudCB0byBtYWtlIGEgY29weSBvZi5cclxuICogQHJldHVybiB7Tm9kZXxPYmplY3R9IHRoZSBuZXdseSBpbnN0YW50aWF0ZWQgb2JqZWN0XHJcbiAqIEB0eXBlc2NyaXB0XHJcbiAqIGluc3RhbnRpYXRlKG9yaWdpbmFsOiBQcmVmYWIpOiBOb2RlXHJcbiAqIGluc3RhbnRpYXRlPFQ+KG9yaWdpbmFsOiBUKTogVFxyXG4gKiBAZXhhbXBsZVxyXG4gKiAvLyBpbnN0YW50aWF0ZSBub2RlIGZyb20gcHJlZmFiXHJcbiAqIHZhciBzY2VuZSA9IGNjLmRpcmVjdG9yLmdldFNjZW5lKCk7XHJcbiAqIHZhciBub2RlID0gY2MuaW5zdGFudGlhdGUocHJlZmFiQXNzZXQpO1xyXG4gKiBub2RlLnBhcmVudCA9IHNjZW5lO1xyXG4gKiAvLyBjbG9uZSBub2RlXHJcbiAqIHZhciBzY2VuZSA9IGNjLmRpcmVjdG9yLmdldFNjZW5lKCk7XHJcbiAqIHZhciBub2RlID0gY2MuaW5zdGFudGlhdGUodGFyZ2V0Tm9kZSk7XHJcbiAqIG5vZGUucGFyZW50ID0gc2NlbmU7XHJcbiAqL1xyXG5mdW5jdGlvbiBpbnN0YW50aWF0ZSAob3JpZ2luYWwsIGludGVybmFsX2ZvcmNlKSB7XHJcbiAgICBpZiAoIWludGVybmFsX2ZvcmNlKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvcmlnaW5hbCAhPT0gJ29iamVjdCcgfHwgQXJyYXkuaXNBcnJheShvcmlnaW5hbCkpIHtcclxuICAgICAgICAgICAgaWYgKENDX0RFVikge1xyXG4gICAgICAgICAgICAgICAgY2MuZXJyb3JJRCg2OTAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFvcmlnaW5hbCkge1xyXG4gICAgICAgICAgICBpZiAoQ0NfREVWKSB7XHJcbiAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDY5MDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWNjLmlzVmFsaWQob3JpZ2luYWwpKSB7XHJcbiAgICAgICAgICAgIGlmIChDQ19ERVYpIHtcclxuICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoNjkwMik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChDQ19ERVYgJiYgb3JpZ2luYWwgaW5zdGFuY2VvZiBjYy5Db21wb25lbnQpIHtcclxuICAgICAgICAgICAgY2Mud2FybignU2hvdWxkIG5vdCBpbnN0YW50aWF0ZSBhIHNpbmdsZSBjYy5Db21wb25lbnQgZGlyZWN0bHksIHlvdSBtdXN0IGluc3RhbnRpYXRlIHRoZSBlbnRpcmUgbm9kZS4nKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGNsb25lO1xyXG4gICAgaWYgKG9yaWdpbmFsIGluc3RhbmNlb2YgQ0NPYmplY3QpIHtcclxuICAgICAgICAvLyBJbnZva2UgX2luc3RhbnRpYXRlIG1ldGhvZCBpZiBzdXBwbGllZC5cclxuICAgICAgICAvLyBUaGUgX2luc3RhbnRpYXRlIGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIG9ubHkgb24gdGhlIHJvb3Qgb2JqZWN0LCBpdHMgYXNzb2NpYXRlZCBvYmplY3Qgd2lsbCBub3QgYmUgY2FsbGVkLlxyXG4gICAgICAgIC8vIEBjYWxsYmFjayBhc3NvY2lhdGVkXHJcbiAgICAgICAgLy8gQHBhcmFtIHtPYmplY3R9IFtpbnN0YW50aWF0ZWRdIC0gSWYgc3VwcGxpZWQsIF9pbnN0YW50aWF0ZSBqdXN0IG5lZWQgdG8gaW5pdGlhbGl6ZSB0aGUgaW5zdGFudGlhdGVkIG9iamVjdCxcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBubyBuZWVkIHRvIGNyZWF0ZSBuZXcgb2JqZWN0IGJ5IGl0c2VsZi5cclxuICAgICAgICAvLyBAcmV0dXJucyB7T2JqZWN0fSAtIHRoZSBpbnN0YW50aWF0ZWQgb2JqZWN0XHJcbiAgICAgICAgaWYgKG9yaWdpbmFsLl9pbnN0YW50aWF0ZSkge1xyXG4gICAgICAgICAgICBjYy5nYW1lLl9pc0Nsb25pbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICBjbG9uZSA9IG9yaWdpbmFsLl9pbnN0YW50aWF0ZShudWxsLCB0cnVlKTtcclxuICAgICAgICAgICAgY2MuZ2FtZS5faXNDbG9uaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybiBjbG9uZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAob3JpZ2luYWwgaW5zdGFuY2VvZiBjYy5Bc3NldCkge1xyXG4gICAgICAgICAgICAvLyDkuI3lhYHorrjnlKjpgJrnlKjmlrnmoYjlrp7kvovljJbotYTmupBcclxuICAgICAgICAgICAgaWYgKENDX0RFVikge1xyXG4gICAgICAgICAgICAgICAgY2MuZXJyb3JJRCg2OTAzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2MuZ2FtZS5faXNDbG9uaW5nID0gdHJ1ZTtcclxuICAgIGNsb25lID0gZG9JbnN0YW50aWF0ZShvcmlnaW5hbCk7XHJcbiAgICBjYy5nYW1lLl9pc0Nsb25pbmcgPSBmYWxzZTtcclxuICAgIHJldHVybiBjbG9uZTtcclxufVxyXG5cclxudmFyIG9ianNUb0NsZWFyVG1wVmFyID0gW107ICAgLy8gdXNlZCB0byByZXNldCBfaU4kdCB2YXJpYWJsZVxyXG5cclxuLy8vKipcclxuLy8gKiBEbyBpbnN0YW50aWF0ZSBvYmplY3QsIHRoZSBvYmplY3QgdG8gaW5zdGFudGlhdGUgbXVzdCBiZSBub24tbmlsLlxyXG4vLyAqIOi/meaYr+S4gOS4qumAmueUqOeahCBpbnN0YW50aWF0ZSDmlrnms5XvvIzlj6/og73mlYjnjofmr5TovoPkvY7jgIJcclxuLy8gKiDkuYvlkI7lj6/ku6Xnu5nlkITnp43nsbvlnovph43lhpnlv6vpgJ/lrp7kvovljJbnmoTnibnmrorlrp7njrDvvIzkvYblupTor6XlnKjljZXlhYPmtYvor5XkuK3lsIbnu5Pmnpzlkozov5nkuKrmlrnms5XnmoTnu5Pmnpzov5vooYzlr7nmr5TjgIJcclxuLy8gKiDlgLzlvpfms6jmhI/nmoTmmK/vvIzov5nkuKrmlrnms5XkuI3lj6/ph43lhaXjgIJcclxuLy8gKlxyXG4vLyAqIEBwYXJhbSB7T2JqZWN0fSBvYmogLSDor6Xmlrnms5Xku4XkvpvlhoXpg6jkvb/nlKjvvIznlKjmiLfpnIDotJ/otKPkv53or4Hlj4LmlbDlkIjms5XjgILku4DkuYjlj4LmlbDmmK/lkIjms5XnmoTor7flj4LogIMgY2MuaW5zdGFudGlhdGUg55qE5a6e546w44CCXHJcbi8vICogQHBhcmFtIHtOb2RlfSBbcGFyZW50XSAtIOWPquacieWcqOivpeWvueixoeS4i+eahOWcuuaZr+eJqeS9k+S8muiiq+WFi+mahuOAglxyXG4vLyAqIEByZXR1cm4ge09iamVjdH1cclxuLy8gKiBAcHJpdmF0ZVxyXG4vLyAqL1xyXG5mdW5jdGlvbiBkb0luc3RhbnRpYXRlIChvYmosIHBhcmVudCkge1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xyXG4gICAgICAgIGlmIChDQ19ERVYpIHtcclxuICAgICAgICAgICAgY2MuZXJyb3JJRCg2OTA0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBpZiAoX2lzRG9tTm9kZSAmJiBfaXNEb21Ob2RlKG9iaikpIHtcclxuICAgICAgICBpZiAoQ0NfREVWKSB7XHJcbiAgICAgICAgICAgIGNjLmVycm9ySUQoNjkwNSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjbG9uZTtcclxuICAgIGlmIChvYmouX2lOJHQpIHtcclxuICAgICAgICAvLyBVc2VyIGNhbiBzcGVjaWZ5IGFuIGV4aXN0aW5nIG9iamVjdCBieSBhc3NpZ25pbmcgdGhlIFwiX2lOJHRcIiBwcm9wZXJ0eS5cclxuICAgICAgICAvLyBlbnVtZXJhdGVPYmplY3Qgd2lsbCBhbHdheXMgcHVzaCBvYmogdG8gb2Jqc1RvQ2xlYXJUbXBWYXJcclxuICAgICAgICBjbG9uZSA9IG9iai5faU4kdDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKG9iai5jb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgIHZhciBrbGFzcyA9IG9iai5jb25zdHJ1Y3RvcjtcclxuICAgICAgICBjbG9uZSA9IG5ldyBrbGFzcygpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY2xvbmUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIGVudW1lcmF0ZU9iamVjdChvYmosIGNsb25lLCBwYXJlbnQpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBvYmpzVG9DbGVhclRtcFZhci5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICAgIG9ianNUb0NsZWFyVG1wVmFyW2ldLl9pTiR0ID0gbnVsbDtcclxuICAgIH1cclxuICAgIG9ianNUb0NsZWFyVG1wVmFyLmxlbmd0aCA9IDA7XHJcblxyXG4gICAgcmV0dXJuIGNsb25lO1xyXG59XHJcblxyXG4vLyBAcGFyYW0ge09iamVjdH0gb2JqIC0gVGhlIG9iamVjdCB0byBpbnN0YW50aWF0ZSwgdHlwZW9mIG11c3QgYmUgJ29iamVjdCcgYW5kIHNob3VsZCBub3QgYmUgYW4gYXJyYXkuXHJcblxyXG5mdW5jdGlvbiBlbnVtZXJhdGVDQ0NsYXNzIChrbGFzcywgb2JqLCBjbG9uZSwgcGFyZW50KSB7XHJcbiAgICB2YXIgcHJvcHMgPSBrbGFzcy5fX3ZhbHVlc19fO1xyXG4gICAgZm9yICh2YXIgcCA9IDA7IHAgPCBwcm9wcy5sZW5ndGg7IHArKykge1xyXG4gICAgICAgIHZhciBrZXkgPSBwcm9wc1twXTtcclxuICAgICAgICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcclxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSkge1xyXG4gICAgICAgICAgICB2YXIgaW5pdFZhbHVlID0gY2xvbmVba2V5XTtcclxuICAgICAgICAgICAgaWYgKGluaXRWYWx1ZSBpbnN0YW5jZW9mIENDVmFsdWVUeXBlICYmXHJcbiAgICAgICAgICAgICAgICBpbml0VmFsdWUuY29uc3RydWN0b3IgPT09IHZhbHVlLmNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICBpbml0VmFsdWUuc2V0KHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNsb25lW2tleV0gPSB2YWx1ZS5faU4kdCB8fCBpbnN0YW50aWF0ZU9iaih2YWx1ZSwgcGFyZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY2xvbmVba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZW51bWVyYXRlT2JqZWN0IChvYmosIGNsb25lLCBwYXJlbnQpIHtcclxuICAgIC8vIOebruWJjeS9v+eUqOKAnF9pTiR04oCd6L+Z5Liq54m55q6K5a2X5q615p2l5a2Y5a6e5L6L5YyW5ZCO55qE5a+56LGh77yM6L+Z5qC35YGa5Li76KaB5piv5Li65LqG6Ziy5q2i5b6q546v5byV55SoXHJcbiAgICAvLyDms6jmhI/vvIzkuLrkuobpgb/lhY3lvqrnjq/lvJXnlKjvvIzmiYDmnInmlrDliJvlu7rnmoTlrp7kvovvvIzlv4XpobvlnKjotYvlgLzliY3ooqvorr7kuLrmupDlr7nosaHnmoRfaU4kdFxyXG4gICAganMudmFsdWUob2JqLCAnX2lOJHQnLCBjbG9uZSwgdHJ1ZSk7XHJcbiAgICBvYmpzVG9DbGVhclRtcFZhci5wdXNoKG9iaik7XHJcbiAgICB2YXIga2xhc3MgPSBvYmouY29uc3RydWN0b3I7XHJcbiAgICBpZiAoY2MuQ2xhc3MuX2lzQ0NDbGFzcyhrbGFzcykpIHtcclxuICAgICAgICBlbnVtZXJhdGVDQ0NsYXNzKGtsYXNzLCBvYmosIGNsb25lLCBwYXJlbnQpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gcHJpbWl0aXZlIGphdmFzY3JpcHQgb2JqZWN0XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xyXG4gICAgICAgICAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShrZXkpIHx8XHJcbiAgICAgICAgICAgICAgICAoa2V5LmNoYXJDb2RlQXQoMCkgPT09IDk1ICYmIGtleS5jaGFyQ29kZUF0KDEpID09PSA5NSAmJiAgIC8vIHN0YXJ0cyB3aXRoIFwiX19cIlxyXG4gICAgICAgICAgICAgICAgIGtleSAhPT0gJ19fdHlwZV9fJylcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gY2xvbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsgICAvLyB2YWx1ZSBpcyBvYmouX2lOJHRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNsb25lW2tleV0gPSB2YWx1ZS5faU4kdCB8fCBpbnN0YW50aWF0ZU9iaih2YWx1ZSwgcGFyZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNsb25lW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChvYmogaW5zdGFuY2VvZiBDQ09iamVjdCkge1xyXG4gICAgICAgIGNsb25lLl9vYmpGbGFncyAmPSBQZXJzaXN0ZW50TWFzaztcclxuICAgIH1cclxufVxyXG5cclxuLypcclxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IG9iaiAtIHRoZSBvcmlnaW5hbCBub24tbmlsIG9iamVjdCwgdHlwZW9mIG11c3QgYmUgJ29iamVjdCdcclxuICogQHJldHVybiB7T2JqZWN0fEFycmF5fSAtIHRoZSBvcmlnaW5hbCBub24tbmlsIG9iamVjdCwgdHlwZW9mIG11c3QgYmUgJ29iamVjdCdcclxuICovXHJcbmZ1bmN0aW9uIGluc3RhbnRpYXRlT2JqIChvYmosIHBhcmVudCkge1xyXG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIENDVmFsdWVUeXBlKSB7XHJcbiAgICAgICAgcmV0dXJuIG9iai5jbG9uZSgpO1xyXG4gICAgfVxyXG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIGNjLkFzc2V0KSB7XHJcbiAgICAgICAgLy8g5omA5pyJ6LWE5rqQ55u05o6l5byV55So77yM5LiN6ZyA6KaB5ou36LSdXHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH1cclxuICAgIHZhciBjbG9uZTtcclxuICAgIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcob2JqKSkge1xyXG4gICAgICAgIGxldCBsZW4gPSBvYmoubGVuZ3RoO1xyXG4gICAgICAgIGNsb25lID0gbmV3IChvYmouY29uc3RydWN0b3IpKGxlbik7XHJcbiAgICAgICAgb2JqLl9pTiR0ID0gY2xvbmU7XHJcbiAgICAgICAgb2Jqc1RvQ2xlYXJUbXBWYXIucHVzaChvYmopO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcclxuICAgICAgICAgICAgY2xvbmVbaV0gPSBvYmpbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjbG9uZTtcclxuICAgIH1cclxuICAgIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcclxuICAgICAgICBsZXQgbGVuID0gb2JqLmxlbmd0aDtcclxuICAgICAgICBjbG9uZSA9IG5ldyBBcnJheShsZW4pO1xyXG4gICAgICAgIGpzLnZhbHVlKG9iaiwgJ19pTiR0JywgY2xvbmUsIHRydWUpO1xyXG4gICAgICAgIG9ianNUb0NsZWFyVG1wVmFyLnB1c2gob2JqKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IG9ialtpXTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGNsb25lW2ldID0gdmFsdWUuX2lOJHQgfHwgaW5zdGFudGlhdGVPYmoodmFsdWUsIHBhcmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjbG9uZVtpXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjbG9uZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKG9iai5fb2JqRmxhZ3MgJiBEZXN0cm95ZWQpIHtcclxuICAgICAgICAvLyB0aGUgc2FtZSBhcyBjYy5pc1ZhbGlkKG9iailcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgY3RvciA9IG9iai5jb25zdHJ1Y3RvcjtcclxuICAgIGlmIChjYy5DbGFzcy5faXNDQ0NsYXNzKGN0b3IpKSB7XHJcbiAgICAgICAgaWYgKHBhcmVudCkge1xyXG4gICAgICAgICAgICBpZiAocGFyZW50IGluc3RhbmNlb2YgY2MuQ29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2JqIGluc3RhbmNlb2YgY2MuX0Jhc2VOb2RlIHx8IG9iaiBpbnN0YW5jZW9mIGNjLkNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAocGFyZW50IGluc3RhbmNlb2YgY2MuX0Jhc2VOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2JqIGluc3RhbmNlb2YgY2MuX0Jhc2VOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvYmouaXNDaGlsZE9mKHBhcmVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2hvdWxkIG5vdCBjbG9uZSBvdGhlciBub2RlcyBpZiBub3QgZGVzY2VuZGFudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIGNjLkNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghb2JqLm5vZGUuaXNDaGlsZE9mKHBhcmVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2hvdWxkIG5vdCBjbG9uZSBvdGhlciBjb21wb25lbnQgaWYgbm90IGRlc2NlbmRhbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2xvbmUgPSBuZXcgY3RvcigpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoY3RvciA9PT0gT2JqZWN0KSB7XHJcbiAgICAgICAgY2xvbmUgPSB7fTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKCFjdG9yKSB7XHJcbiAgICAgICAgY2xvbmUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gdW5rbm93biB0eXBlXHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH1cclxuICAgIGVudW1lcmF0ZU9iamVjdChvYmosIGNsb25lLCBwYXJlbnQpO1xyXG4gICAgcmV0dXJuIGNsb25lO1xyXG59XHJcblxyXG5pbnN0YW50aWF0ZS5fY2xvbmUgPSBkb0luc3RhbnRpYXRlO1xyXG5jYy5pbnN0YW50aWF0ZSA9IGluc3RhbnRpYXRlO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGluc3RhbnRpYXRlO1xyXG4iXSwic291cmNlUm9vdCI6Ii8ifQ==