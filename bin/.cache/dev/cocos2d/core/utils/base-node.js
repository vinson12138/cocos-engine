
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/utils/base-node.js';
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
var Flags = require('../platform/CCObject').Flags;

var misc = require('./misc');

var js = require('../platform/js');

var IdGenerater = require('../platform/id-generater');

var eventManager = require('../event-manager');

var RenderFlow = require('../renderer/render-flow');

var Destroying = Flags.Destroying;
var DontDestroy = Flags.DontDestroy;
var Deactivating = Flags.Deactivating;
var CHILD_ADDED = 'child-added';
var CHILD_REMOVED = 'child-removed';
var idGenerater = new IdGenerater('Node');

function getConstructor(typeOrClassName) {
  if (!typeOrClassName) {
    cc.errorID(3804);
    return null;
  }

  if (typeof typeOrClassName === 'string') {
    return js.getClassByName(typeOrClassName);
  }

  return typeOrClassName;
}

function findComponent(node, constructor) {
  if (constructor._sealed) {
    for (var i = 0; i < node._components.length; ++i) {
      var comp = node._components[i];

      if (comp.constructor === constructor) {
        return comp;
      }
    }
  } else {
    for (var _i = 0; _i < node._components.length; ++_i) {
      var _comp = node._components[_i];

      if (_comp instanceof constructor) {
        return _comp;
      }
    }
  }

  return null;
}

function findComponents(node, constructor, components) {
  if (constructor._sealed) {
    for (var i = 0; i < node._components.length; ++i) {
      var comp = node._components[i];

      if (comp.constructor === constructor) {
        components.push(comp);
      }
    }
  } else {
    for (var _i2 = 0; _i2 < node._components.length; ++_i2) {
      var _comp2 = node._components[_i2];

      if (_comp2 instanceof constructor) {
        components.push(_comp2);
      }
    }
  }
}

function findChildComponent(children, constructor) {
  for (var i = 0; i < children.length; ++i) {
    var node = children[i];
    var comp = findComponent(node, constructor);

    if (comp) {
      return comp;
    } else if (node._children.length > 0) {
      comp = findChildComponent(node._children, constructor);

      if (comp) {
        return comp;
      }
    }
  }

  return null;
}

function findChildComponents(children, constructor, components) {
  for (var i = 0; i < children.length; ++i) {
    var node = children[i];
    findComponents(node, constructor, components);

    if (node._children.length > 0) {
      findChildComponents(node._children, constructor, components);
    }
  }
}
/**
 * A base node for CCNode, it will:
 * - maintain scene hierarchy and active logic
 * - notifications if some properties changed
 * - define some interfaces shares between CCNode
 * - define machanisms for Enity Component Systems
 * - define prefab and serialize functions
 *
 * @class _BaseNode
 * @extends Object
 * @uses EventTarget
 * @constructor
 * @param {String} [name]
 * @private
 */


var BaseNode = cc.Class({
  name: 'cc._BaseNode',
  "extends": cc.Object,
  properties: {
    // SERIALIZABLE
    _parent: null,
    _children: [],
    _active: true,

    /**
     * @property _components
     * @type {Component[]}
     * @default []
     * @readOnly
     * @private
     */
    _components: [],

    /**
     * The PrefabInfo object
     * @property _prefab
     * @type {PrefabInfo}
     * @private
     */
    _prefab: null,

    /**
     * If true, the node is an persist node which won't be destroyed during scene transition.
     * If false, the node will be destroyed automatically when loading a new scene. Default is false.
     * @property _persistNode
     * @type {Boolean}
     * @default false
     * @private
     */
    _persistNode: {
      get: function get() {
        return (this._objFlags & DontDestroy) > 0;
      },
      set: function set(value) {
        if (value) {
          this._objFlags |= DontDestroy;
        } else {
          this._objFlags &= ~DontDestroy;
        }
      }
    },
    // API

    /**
     * !#en Name of node.
     * !#zh 该节点名称。
     * @property name
     * @type {String}
     * @example
     * node.name = "New Node";
     * cc.log("Node Name: " + node.name);
     */
    name: {
      get: function get() {
        return this._name;
      },
      set: function set(value) {
        if (CC_DEV && value.indexOf('/') !== -1) {
          cc.errorID(1632);
          return;
        }

        this._name = value;

        if (CC_JSB && CC_NATIVERENDERER) {
          this._proxy.setName(this._name);
        }
      }
    },

    /**
     * !#en The uuid for editor, will be stripped before building project.
     * !#zh 主要用于编辑器的 uuid，在编辑器下可用于持久化存储，在项目构建之后将变成自增的 id。
     * @property uuid
     * @type {String}
     * @readOnly
     * @example
     * cc.log("Node Uuid: " + node.uuid);
     */
    uuid: {
      get: function get() {
        return this._id;
      }
    },

    /**
     * !#en All children nodes.
     * !#zh 节点的所有子节点。
     * @property children
     * @type {Node[]}
     * @readOnly
     * @example
     * var children = node.children;
     * for (var i = 0; i < children.length; ++i) {
     *     cc.log("Node: " + children[i]);
     * }
     */
    children: {
      get: function get() {
        return this._children;
      }
    },

    /**
     * !#en All children nodes.
     * !#zh 节点的子节点数量。
     * @property childrenCount
     * @type {Number}
     * @readOnly
     * @example
     * var count = node.childrenCount;
     * cc.log("Node Children Count: " + count);
     */
    childrenCount: {
      get: function get() {
        return this._children.length;
      }
    },

    /**
     * !#en
     * The local active state of this node.<br/>
     * Note that a Node may be inactive because a parent is not active, even if this returns true.<br/>
     * Use {{#crossLink "Node/activeInHierarchy:property"}}{{/crossLink}} if you want to check if the Node is actually treated as active in the scene.
     * !#zh
     * 当前节点的自身激活状态。<br/>
     * 值得注意的是，一个节点的父节点如果不被激活，那么即使它自身设为激活，它仍然无法激活。<br/>
     * 如果你想检查节点在场景中实际的激活状态可以使用 {{#crossLink "Node/activeInHierarchy:property"}}{{/crossLink}}。
     * @property active
     * @type {Boolean}
     * @default true
     * @example
     * node.active = false;
     */
    active: {
      get: function get() {
        return this._active;
      },
      set: function set(value) {
        value = !!value;

        if (this._active !== value) {
          this._active = value;
          var parent = this._parent;

          if (parent) {
            var couldActiveInScene = parent._activeInHierarchy;

            if (couldActiveInScene) {
              cc.director._nodeActivator.activateNode(this, value);
            }
          }
        }
      }
    },

    /**
     * !#en Indicates whether this node is active in the scene.
     * !#zh 表示此节点是否在场景中激活。
     * @property activeInHierarchy
     * @type {Boolean}
     * @example
     * cc.log("activeInHierarchy: " + node.activeInHierarchy);
     */
    activeInHierarchy: {
      get: function get() {
        return this._activeInHierarchy;
      }
    }
  },

  /**
   * @method constructor
   * @param {String} [name]
   */
  ctor: function ctor(name) {
    this._name = name !== undefined ? name : 'New Node';
    this._activeInHierarchy = false;
    this._id = CC_EDITOR ? Editor.Utils.UuidUtils.uuid() : idGenerater.getNewId();
    cc.director._scheduler && cc.director._scheduler.enableForTarget(this);
    /**
     * Register all related EventTargets,
     * all event callbacks will be removed in _onPreDestroy
     * @property __eventTargets
     * @type {EventTarget[]}
     * @private
     */

    this.__eventTargets = [];
  },

  /** 
   * !#en The parent of the node.
   * !#zh 该节点的父节点。
   * @property {Node} parent
   * @example 
   * cc.log("Node Parent: " + node.parent);
   */

  /**
   * !#en Get parent of the node.
   * !#zh 获取该节点的父节点。
   * @method getParent
   * @return {Node}
   * @example
   * var parent = this.node.getParent();
   */
  getParent: function getParent() {
    return this._parent;
  },

  /**
   * !#en Set parent of the node.
   * !#zh 设置该节点的父节点。
   * @method setParent
   * @param {Node} value
   * @example
   * node.setParent(newNode);
   */
  setParent: function setParent(value) {
    if (this._parent === value) {
      return;
    }

    if (CC_EDITOR && cc.engine && !cc.engine.isPlaying) {
      if (_Scene.DetectConflict.beforeAddChild(this, value)) {
        return;
      }
    }

    var oldParent = this._parent;

    if (CC_DEBUG && oldParent && oldParent._objFlags & Deactivating) {
      cc.errorID(3821);
    }

    this._parent = value || null;

    this._onSetParent(value);

    if (value) {
      if (CC_DEBUG && value._objFlags & Deactivating) {
        cc.errorID(3821);
      }

      eventManager._setDirtyForNode(this);

      value._children.push(this);

      value.emit && value.emit(CHILD_ADDED, this);
      value._renderFlag |= RenderFlow.FLAG_CHILDREN;
    }

    if (oldParent) {
      if (!(oldParent._objFlags & Destroying)) {
        var removeAt = oldParent._children.indexOf(this);

        if (CC_DEV && removeAt < 0) {
          return cc.errorID(1633);
        }

        oldParent._children.splice(removeAt, 1);

        oldParent.emit && oldParent.emit(CHILD_REMOVED, this);

        this._onHierarchyChanged(oldParent);

        if (oldParent._children.length === 0) {
          oldParent._renderFlag &= ~RenderFlow.FLAG_CHILDREN;
        }
      }
    } else if (value) {
      this._onHierarchyChanged(null);
    }
  },
  // ABSTRACT INTERFACES

  /**
   * !#en
   * Properties configuration function <br/>
   * All properties in attrs will be set to the node, <br/>
   * when the setter of the node is available, <br/>
   * the property will be set via setter function.<br/>
   * !#zh 属性配置函数。在 attrs 的所有属性将被设置为节点属性。
   * @method attr
   * @param {Object} attrs - Properties to be set to node
   * @example
   * var attrs = { key: 0, num: 100 };
   * node.attr(attrs);
   */
  attr: function attr(attrs) {
    js.mixin(this, attrs);
  },
  // composition: GET

  /**
   * !#en Returns a child from the container given its uuid.
   * !#zh 通过 uuid 获取节点的子节点。
   * @method getChildByUuid
   * @param {String} uuid - The uuid to find the child node.
   * @return {Node} a Node whose uuid equals to the input parameter
   * @example
   * var child = node.getChildByUuid(uuid);
   */
  getChildByUuid: function getChildByUuid(uuid) {
    if (!uuid) {
      cc.log("Invalid uuid");
      return null;
    }

    var locChildren = this._children;

    for (var i = 0, len = locChildren.length; i < len; i++) {
      if (locChildren[i]._id === uuid) return locChildren[i];
    }

    return null;
  },

  /**
   * !#en Returns a child from the container given its name.
   * !#zh 通过名称获取节点的子节点。
   * @method getChildByName
   * @param {String} name - A name to find the child node.
   * @return {Node} a CCNode object whose name equals to the input parameter
   * @example
   * var child = node.getChildByName("Test Node");
   */
  getChildByName: function getChildByName(name) {
    if (!name) {
      cc.log("Invalid name");
      return null;
    }

    var locChildren = this._children;

    for (var i = 0, len = locChildren.length; i < len; i++) {
      if (locChildren[i]._name === name) return locChildren[i];
    }

    return null;
  },
  // composition: ADD
  addChild: function addChild(child) {
    if (CC_DEV && !(child instanceof cc._BaseNode)) {
      return cc.errorID(1634, cc.js.getClassName(child));
    }

    cc.assertID(child, 1606);
    cc.assertID(child._parent === null, 1605); // invokes the parent setter

    child.setParent(this);
  },

  /**
   * !#en
   * Inserts a child to the node at a specified index.
   * !#zh
   * 插入子节点到指定位置
   * @method insertChild
   * @param {Node} child - the child node to be inserted
   * @param {Number} siblingIndex - the sibling index to place the child in
   * @example
   * node.insertChild(child, 2);
   */
  insertChild: function insertChild(child, siblingIndex) {
    child.parent = this;
    child.setSiblingIndex(siblingIndex);
  },
  // HIERARCHY METHODS

  /**
   * !#en Get the sibling index.
   * !#zh 获取同级索引。
   * @method getSiblingIndex
   * @return {Number}
   * @example
   * var index = node.getSiblingIndex();
   */
  getSiblingIndex: function getSiblingIndex() {
    if (this._parent) {
      return this._parent._children.indexOf(this);
    } else {
      return 0;
    }
  },

  /**
   * !#en Set the sibling index of this node.
   * !#zh 设置节点同级索引。
   * @method setSiblingIndex
   * @param {Number} index
   * @example
   * node.setSiblingIndex(1);
   */
  setSiblingIndex: function setSiblingIndex(index) {
    if (!this._parent) {
      return;
    }

    if (this._parent._objFlags & Deactivating) {
      cc.errorID(3821);
      return;
    }

    var siblings = this._parent._children;
    index = index !== -1 ? index : siblings.length - 1;
    var oldIndex = siblings.indexOf(this);

    if (index !== oldIndex) {
      siblings.splice(oldIndex, 1);

      if (index < siblings.length) {
        siblings.splice(index, 0, this);
      } else {
        siblings.push(this);
      }

      this._onSiblingIndexChanged && this._onSiblingIndexChanged(index);
    }
  },

  /**
   * !#en Walk though the sub children tree of the current node.
   * Each node, including the current node, in the sub tree will be visited two times, before all children and after all children.
   * This function call is not recursive, it's based on stack.
   * Please don't walk any other node inside the walk process.
   * !#zh 遍历该节点的子树里的所有节点并按规则执行回调函数。
   * 对子树中的所有节点，包含当前节点，会执行两次回调，prefunc 会在访问它的子节点之前调用，postfunc 会在访问所有子节点之后调用。
   * 这个函数的实现不是基于递归的，而是基于栈展开递归的方式。
   * 请不要在 walk 过程中对任何其他的节点嵌套执行 walk。
   * @method walk
   * @param {Function} prefunc The callback to process node when reach the node for the first time
   * @param {_BaseNode} prefunc.target The current visiting node
   * @param {Function} postfunc The callback to process node when re-visit the node after walked all children in its sub tree
   * @param {_BaseNode} postfunc.target The current visiting node
   * @example
   * node.walk(function (target) {
   *     console.log('Walked through node ' + target.name + ' for the first time');
   * }, function (target) {
   *     console.log('Walked through node ' + target.name + ' after walked all children in its sub tree');
   * });
   */
  walk: function walk(prefunc, postfunc) {
    var BaseNode = cc._BaseNode;
    var index = 1;
    var children, child, curr, i, afterChildren;
    var stack = BaseNode._stacks[BaseNode._stackId];

    if (!stack) {
      stack = [];

      BaseNode._stacks.push(stack);
    }

    BaseNode._stackId++;
    stack.length = 0;
    stack[0] = this;
    var parent = null;
    afterChildren = false;

    while (index) {
      index--;
      curr = stack[index];

      if (!curr) {
        continue;
      }

      if (!afterChildren && prefunc) {
        // pre call
        prefunc(curr);
      } else if (afterChildren && postfunc) {
        // post call
        postfunc(curr);
      } // Avoid memory leak


      stack[index] = null; // Do not repeatly visit child tree, just do post call and continue walk

      if (afterChildren) {
        if (parent === this._parent) break;
        afterChildren = false;
      } else {
        // Children not proceeded and has children, proceed to child tree
        if (curr._children.length > 0) {
          parent = curr;
          children = curr._children;
          i = 0;
          stack[index] = children[i];
          index++;
        } // No children, then repush curr to be walked for post func
        else {
            stack[index] = curr;
            index++;
            afterChildren = true;
          }

        continue;
      } // curr has no sub tree, so look into the siblings in parent children


      if (children) {
        i++; // Proceed to next sibling in parent children

        if (children[i]) {
          stack[index] = children[i];
          index++;
        } // No children any more in this sub tree, go upward
        else if (parent) {
            stack[index] = parent;
            index++; // Setup parent walk env

            afterChildren = true;

            if (parent._parent) {
              children = parent._parent._children;
              i = children.indexOf(parent);
              parent = parent._parent;
            } else {
              // At root
              parent = null;
              children = null;
            } // ERROR


            if (i < 0) {
              break;
            }
          }
      }
    }

    stack.length = 0;
    BaseNode._stackId--;
  },
  cleanup: function cleanup() {},

  /**
   * !#en
   * Remove itself from its parent node. If cleanup is `true`, then also remove all events and actions. <br/>
   * If the cleanup parameter is not passed, it will force a cleanup, so it is recommended that you always pass in the `false` parameter when calling this API.<br/>
   * If the node orphan, then nothing happens.
   * !#zh
   * 从父节点中删除该节点。如果不传入 cleanup 参数或者传入 `true`，那么这个节点上所有绑定的事件、action 都会被删除。<br/>
   * 因此建议调用这个 API 时总是传入 `false` 参数。<br/>
   * 如果这个节点是一个孤节点，那么什么都不会发生。
   * @method removeFromParent
   * @param {Boolean} [cleanup=true] - true if all actions and callbacks on this node should be removed, false otherwise.
   * @example
   * node.removeFromParent();
   * node.removeFromParent(false);
   */
  removeFromParent: function removeFromParent(cleanup) {
    if (this._parent) {
      if (cleanup === undefined) cleanup = true;

      this._parent.removeChild(this, cleanup);
    }
  },

  /**
   * !#en
   * Removes a child from the container. It will also cleanup all running actions depending on the cleanup parameter. </p>
   * If the cleanup parameter is not passed, it will force a cleanup. <br/>
   * "remove" logic MUST only be on this method  <br/>
   * If a class wants to extend the 'removeChild' behavior it only needs <br/>
   * to override this method.
   * !#zh
   * 移除节点中指定的子节点，是否需要清理所有正在运行的行为取决于 cleanup 参数。<br/>
   * 如果 cleanup 参数不传入，默认为 true 表示清理。<br/>
   * @method removeChild
   * @param {Node} child - The child node which will be removed.
   * @param {Boolean} [cleanup=true] - true if all running actions and callbacks on the child node will be cleanup, false otherwise.
   * @example
   * node.removeChild(newNode);
   * node.removeChild(newNode, false);
   */
  removeChild: function removeChild(child, cleanup) {
    if (this._children.indexOf(child) > -1) {
      // If you don't do cleanup, the child's actions will not get removed and the
      if (cleanup || cleanup === undefined) {
        child.cleanup();
      } // invoke the parent setter


      child.parent = null;
    }
  },

  /**
   * !#en
   * Removes all children from the container and do a cleanup all running actions depending on the cleanup parameter. <br/>
   * If the cleanup parameter is not passed, it will force a cleanup.
   * !#zh
   * 移除节点所有的子节点，是否需要清理所有正在运行的行为取决于 cleanup 参数。<br/>
   * 如果 cleanup 参数不传入，默认为 true 表示清理。
   * @method removeAllChildren
   * @param {Boolean} [cleanup=true] - true if all running actions on all children nodes should be cleanup, false otherwise.
   * @example
   * node.removeAllChildren();
   * node.removeAllChildren(false);
   */
  removeAllChildren: function removeAllChildren(cleanup) {
    // not using detachChild improves speed here
    var children = this._children;
    if (cleanup === undefined) cleanup = true;

    for (var i = children.length - 1; i >= 0; i--) {
      var node = children[i];

      if (node) {
        // If you don't do cleanup, the node's actions will not get removed and the
        if (cleanup) node.cleanup();
        node.parent = null;
      }
    }

    this._children.length = 0;
  },

  /**
   * !#en Is this node a child of the given node?
   * !#zh 是否是指定节点的子节点？
   * @method isChildOf
   * @param {Node} parent
   * @return {Boolean} - Returns true if this node is a child, deep child or identical to the given node.
   * @example
   * node.isChildOf(newNode);
   */
  isChildOf: function isChildOf(parent) {
    var child = this;

    do {
      if (child === parent) {
        return true;
      }

      child = child._parent;
    } while (child);

    return false;
  },
  // COMPONENT

  /**
   * !#en
   * Returns the component of supplied type if the node has one attached, null if it doesn't.<br/>
   * You can also get component in the node by passing in the name of the script.
   * !#zh
   * 获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。<br/>
   * 传入参数也可以是脚本的名称。
   * @method getComponent
   * @param {Function|String} typeOrClassName
   * @return {Component}
   * @example
   * // get sprite component
   * var sprite = node.getComponent(cc.Sprite);
   * // get custom test class
   * var test = node.getComponent("Test");
   * @typescript
   * getComponent<T extends Component>(type: {prototype: T}): T
   * getComponent(className: string): any
   */
  getComponent: function getComponent(typeOrClassName) {
    var constructor = getConstructor(typeOrClassName);

    if (constructor) {
      return findComponent(this, constructor);
    }

    return null;
  },

  /**
   * !#en Returns all components of supplied type in the node.
   * !#zh 返回节点上指定类型的所有组件。
   * @method getComponents
   * @param {Function|String} typeOrClassName
   * @return {Component[]}
   * @example
   * var sprites = node.getComponents(cc.Sprite);
   * var tests = node.getComponents("Test");
   * @typescript
   * getComponents<T extends Component>(type: {prototype: T}): T[]
   * getComponents(className: string): any[]
   */
  getComponents: function getComponents(typeOrClassName) {
    var constructor = getConstructor(typeOrClassName),
        components = [];

    if (constructor) {
      findComponents(this, constructor, components);
    }

    return components;
  },

  /**
   * !#en Returns the component of supplied type in any of its children using depth first search.
   * !#zh 递归查找所有子节点中第一个匹配指定类型的组件。
   * @method getComponentInChildren
   * @param {Function|String} typeOrClassName
   * @return {Component}
   * @example
   * var sprite = node.getComponentInChildren(cc.Sprite);
   * var Test = node.getComponentInChildren("Test");
   * @typescript
   * getComponentInChildren<T extends Component>(type: {prototype: T}): T
   * getComponentInChildren(className: string): any
   */
  getComponentInChildren: function getComponentInChildren(typeOrClassName) {
    var constructor = getConstructor(typeOrClassName);

    if (constructor) {
      return findChildComponent(this._children, constructor);
    }

    return null;
  },

  /**
   * !#en Returns all components of supplied type in self or any of its children.
   * !#zh 递归查找自身或所有子节点中指定类型的组件
   * @method getComponentsInChildren
   * @param {Function|String} typeOrClassName
   * @return {Component[]}
   * @example
   * var sprites = node.getComponentsInChildren(cc.Sprite);
   * var tests = node.getComponentsInChildren("Test");
   * @typescript
   * getComponentsInChildren<T extends Component>(type: {prototype: T}): T[]
   * getComponentsInChildren(className: string): any[]
   */
  getComponentsInChildren: function getComponentsInChildren(typeOrClassName) {
    var constructor = getConstructor(typeOrClassName),
        components = [];

    if (constructor) {
      findComponents(this, constructor, components);
      findChildComponents(this._children, constructor, components);
    }

    return components;
  },
  _checkMultipleComp: (CC_EDITOR || CC_PREVIEW) && function (ctor) {
    var existing = this.getComponent(ctor._disallowMultiple);

    if (existing) {
      if (existing.constructor === ctor) {
        cc.errorID(3805, js.getClassName(ctor), this._name);
      } else {
        cc.errorID(3806, js.getClassName(ctor), this._name, js.getClassName(existing));
      }

      return false;
    }

    return true;
  },

  /**
   * !#en Adds a component class to the node. You can also add component to node by passing in the name of the script.
   * !#zh 向节点添加一个指定类型的组件类，你还可以通过传入脚本的名称来添加组件。
   * @method addComponent
   * @param {Function|String} typeOrClassName - The constructor or the class name of the component to add
   * @return {Component} - The newly added component
   * @example
   * var sprite = node.addComponent(cc.Sprite);
   * var test = node.addComponent("Test");
   * @typescript
   * addComponent<T extends Component>(type: {new(): T}): T
   * addComponent(className: string): any
   */
  addComponent: function addComponent(typeOrClassName) {
    if (CC_EDITOR && this._objFlags & Destroying) {
      cc.error('isDestroying');
      return null;
    } // get component


    var constructor;

    if (typeof typeOrClassName === 'string') {
      constructor = js.getClassByName(typeOrClassName);

      if (!constructor) {
        cc.errorID(3807, typeOrClassName);

        if (cc._RFpeek()) {
          cc.errorID(3808, typeOrClassName);
        }

        return null;
      }
    } else {
      if (!typeOrClassName) {
        cc.errorID(3804);
        return null;
      }

      constructor = typeOrClassName;
    } // check component


    if (typeof constructor !== 'function') {
      cc.errorID(3809);
      return null;
    }

    if (!js.isChildClassOf(constructor, cc.Component)) {
      cc.errorID(3810);
      return null;
    }

    if ((CC_EDITOR || CC_PREVIEW) && constructor._disallowMultiple) {
      if (!this._checkMultipleComp(constructor)) {
        return null;
      }
    } // check requirement


    var ReqComp = constructor._requireComponent;

    if (ReqComp && !this.getComponent(ReqComp)) {
      var depended = this.addComponent(ReqComp);

      if (!depended) {
        // depend conflicts
        return null;
      }
    } //// check conflict
    //
    //if (CC_EDITOR && !_Scene.DetectConflict.beforeAddComponent(this, constructor)) {
    //    return null;
    //}
    //


    var component = new constructor();
    component.node = this;

    this._components.push(component);

    if ((CC_EDITOR || CC_TEST) && cc.engine && this._id in cc.engine.attachedObjsForEditor) {
      cc.engine.attachedObjsForEditor[component._id] = component;
    }

    if (this._activeInHierarchy) {
      cc.director._nodeActivator.activateComp(component);
    }

    return component;
  },

  /**
   * This api should only used by undo system
   * @method _addComponentAt
   * @param {Component} comp
   * @param {Number} index
   * @private
   */
  _addComponentAt: CC_EDITOR && function (comp, index) {
    if (this._objFlags & Destroying) {
      return cc.error('isDestroying');
    }

    if (!(comp instanceof cc.Component)) {
      return cc.errorID(3811);
    }

    if (index > this._components.length) {
      return cc.errorID(3812);
    } // recheck attributes because script may changed


    var ctor = comp.constructor;

    if (ctor._disallowMultiple) {
      if (!this._checkMultipleComp(ctor)) {
        return;
      }
    }

    var ReqComp = ctor._requireComponent;

    if (ReqComp && !this.getComponent(ReqComp)) {
      if (index === this._components.length) {
        // If comp should be last component, increase the index because required component added
        ++index;
      }

      var depended = this.addComponent(ReqComp);

      if (!depended) {
        // depend conflicts
        return null;
      }
    }

    comp.node = this;

    this._components.splice(index, 0, comp);

    if ((CC_EDITOR || CC_TEST) && cc.engine && this._id in cc.engine.attachedObjsForEditor) {
      cc.engine.attachedObjsForEditor[comp._id] = comp;
    }

    if (this._activeInHierarchy) {
      cc.director._nodeActivator.activateComp(comp);
    }
  },

  /**
   * !#en
   * Removes a component identified by the given name or removes the component object given.
   * You can also use component.destroy() if you already have the reference.
   * !#zh
   * 删除节点上的指定组件，传入参数可以是一个组件构造函数或组件名，也可以是已经获得的组件引用。
   * 如果你已经获得组件引用，你也可以直接调用 component.destroy()
   * @method removeComponent
   * @param {String|Function|Component} component - The need remove component.
   * @deprecated please destroy the component to remove it.
   * @example
   * node.removeComponent(cc.Sprite);
   * var Test = require("Test");
   * node.removeComponent(Test);
   */
  removeComponent: function removeComponent(component) {
    if (!component) {
      cc.errorID(3813);
      return;
    }

    if (!(component instanceof cc.Component)) {
      component = this.getComponent(component);
    }

    if (component) {
      component.destroy();
    }
  },

  /**
   * @method _getDependComponent
   * @param {Component} depended
   * @return {Component}
   * @private
   */
  _getDependComponent: CC_EDITOR && function (depended) {
    for (var i = 0; i < this._components.length; i++) {
      var comp = this._components[i];

      if (comp !== depended && comp.isValid && !cc.Object._willDestroy(comp)) {
        var depend = comp.constructor._requireComponent;

        if (depend && depended instanceof depend) {
          return comp;
        }
      }
    }

    return null;
  },
  // do remove component, only used internally
  _removeComponent: function _removeComponent(component) {
    if (!component) {
      cc.errorID(3814);
      return;
    }

    if (!(this._objFlags & Destroying)) {
      var i = this._components.indexOf(component);

      if (i !== -1) {
        this._components.splice(i, 1);

        if ((CC_EDITOR || CC_TEST) && cc.engine) {
          delete cc.engine.attachedObjsForEditor[component._id];
        }
      } else if (component.node !== this) {
        cc.errorID(3815);
      }
    }
  },
  destroy: function destroy() {
    if (cc.Object.prototype.destroy.call(this)) {
      this.active = false;
    }
  },

  /**
   * !#en
   * Destroy all children from the node, and release all their own references to other objects.<br/>
   * Actual destruct operation will delayed until before rendering.
   * !#zh
   * 销毁所有子节点，并释放所有它们对其它对象的引用。<br/>
   * 实际销毁操作会延迟到当前帧渲染前执行。
   * @method destroyAllChildren
   * @example
   * node.destroyAllChildren();
   */
  destroyAllChildren: function destroyAllChildren() {
    var children = this._children;

    for (var i = 0; i < children.length; ++i) {
      children[i].destroy();
    }
  },
  _onSetParent: function _onSetParent(value) {},
  _onPostActivated: function _onPostActivated() {},
  _onBatchCreated: function _onBatchCreated(dontSyncChildPrefab) {},
  _onHierarchyChanged: function _onHierarchyChanged(oldParent) {
    var newParent = this._parent;

    if (this._persistNode && !(newParent instanceof cc.Scene)) {
      cc.game.removePersistRootNode(this);

      if (CC_EDITOR) {
        cc.warnID(1623);
      }
    }

    if (CC_EDITOR || CC_TEST) {
      var scene = cc.director.getScene();
      var inCurrentSceneBefore = oldParent && oldParent.isChildOf(scene);
      var inCurrentSceneNow = newParent && newParent.isChildOf(scene);

      if (!inCurrentSceneBefore && inCurrentSceneNow) {
        // attached
        this._registerIfAttached(true);
      } else if (inCurrentSceneBefore && !inCurrentSceneNow) {
        // detached
        this._registerIfAttached(false);
      } // update prefab


      var newPrefabRoot = newParent && newParent._prefab && newParent._prefab.root;
      var myPrefabInfo = this._prefab;

      var PrefabUtils = Editor.require('scene://utils/prefab');

      if (myPrefabInfo) {
        if (newPrefabRoot) {
          if (myPrefabInfo.root !== newPrefabRoot) {
            if (myPrefabInfo.root === this) {
              // nest prefab
              myPrefabInfo.fileId || (myPrefabInfo.fileId = Editor.Utils.UuidUtils.uuid());
              PrefabUtils.checkCircularReference(myPrefabInfo.root);
            } else {
              // change prefab
              PrefabUtils.linkPrefab(newPrefabRoot._prefab.asset, newPrefabRoot, this);
              PrefabUtils.checkCircularReference(newPrefabRoot);
            }
          }
        } else if (myPrefabInfo.root === this) {
          // nested prefab to root prefab
          myPrefabInfo.fileId = ''; // root prefab doesn't have fileId
        } else {
          // detach from prefab
          PrefabUtils.unlinkPrefab(this);
        }
      } else if (newPrefabRoot) {
        // attach to prefab
        PrefabUtils.linkPrefab(newPrefabRoot._prefab.asset, newPrefabRoot, this);
        PrefabUtils.checkCircularReference(newPrefabRoot);
      } // conflict detection


      _Scene.DetectConflict.afterAddChild(this);
    }

    var shouldActiveNow = this._active && !!(newParent && newParent._activeInHierarchy);

    if (this._activeInHierarchy !== shouldActiveNow) {
      cc.director._nodeActivator.activateNode(this, shouldActiveNow);
    }
  },
  _instantiate: function _instantiate(cloned, isSyncedNode) {
    if (!cloned) {
      cloned = cc.instantiate._clone(this, this);
    }

    var newPrefabInfo = cloned._prefab;

    if (CC_EDITOR && newPrefabInfo) {
      if (cloned === newPrefabInfo.root) {
        newPrefabInfo.fileId = '';
      } else {
        var PrefabUtils = Editor.require('scene://utils/prefab');

        PrefabUtils.unlinkPrefab(cloned);
      }
    }

    if (CC_EDITOR && cc.engine._isPlaying) {
      var syncing = newPrefabInfo && cloned === newPrefabInfo.root && newPrefabInfo.sync;

      if (!syncing) {
        cloned._name += ' (Clone)';
      }
    } // reset and init


    cloned._parent = null;

    cloned._onBatchCreated(isSyncedNode);

    return cloned;
  },
  _registerIfAttached: (CC_EDITOR || CC_TEST) && function (register) {
    var attachedObjsForEditor = cc.engine.attachedObjsForEditor;

    if (register) {
      attachedObjsForEditor[this._id] = this;

      for (var i = 0; i < this._components.length; i++) {
        var comp = this._components[i];
        attachedObjsForEditor[comp._id] = comp;
      }

      cc.engine.emit('node-attach-to-scene', this);
    } else {
      cc.engine.emit('node-detach-from-scene', this);
      delete attachedObjsForEditor[this._id];

      for (var _i3 = 0; _i3 < this._components.length; _i3++) {
        var _comp3 = this._components[_i3];
        delete attachedObjsForEditor[_comp3._id];
      }
    }

    var children = this._children;

    for (var _i4 = 0, len = children.length; _i4 < len; ++_i4) {
      var child = children[_i4];

      child._registerIfAttached(register);
    }
  },
  _onPreDestroy: function _onPreDestroy() {
    var i, len; // marked as destroying

    this._objFlags |= Destroying; // detach self and children from editor

    var parent = this._parent;
    var destroyByParent = parent && parent._objFlags & Destroying;

    if (!destroyByParent && (CC_EDITOR || CC_TEST)) {
      this._registerIfAttached(false);
    } // destroy children


    var children = this._children;

    for (i = 0, len = children.length; i < len; ++i) {
      // destroy immediate so its _onPreDestroy can be called
      children[i]._destroyImmediate();
    } // destroy self components


    for (i = 0, len = this._components.length; i < len; ++i) {
      var component = this._components[i]; // destroy immediate so its _onPreDestroy can be called

      component._destroyImmediate();
    }

    var eventTargets = this.__eventTargets;

    for (i = 0, len = eventTargets.length; i < len; ++i) {
      var target = eventTargets[i];
      target && target.targetOff(this);
    }

    eventTargets.length = 0; // remove from persist

    if (this._persistNode) {
      cc.game.removePersistRootNode(this);
    }

    if (!destroyByParent) {
      // remove from parent
      if (parent) {
        var childIndex = parent._children.indexOf(this);

        parent._children.splice(childIndex, 1);

        parent.emit && parent.emit('child-removed', this);
      }
    }

    return destroyByParent;
  },
  onRestore: CC_EDITOR && function () {
    // check activity state
    var shouldActiveNow = this._active && !!(this._parent && this._parent._activeInHierarchy);

    if (this._activeInHierarchy !== shouldActiveNow) {
      cc.director._nodeActivator.activateNode(this, shouldActiveNow);
    }
  }
});
BaseNode.idGenerater = idGenerater; // For walk

BaseNode._stacks = [[]];
BaseNode._stackId = 0;
BaseNode.prototype._onPreDestroyBase = BaseNode.prototype._onPreDestroy;

if (CC_EDITOR) {
  BaseNode.prototype._onPreDestroy = function () {
    var destroyByParent = this._onPreDestroyBase();

    if (!destroyByParent) {
      // ensure this node can reattach to scene by undo system
      // (simulate some destruct logic to make undo system work correctly)
      this._parent = null;
    }

    return destroyByParent;
  };
}

BaseNode.prototype._onHierarchyChangedBase = BaseNode.prototype._onHierarchyChanged;

if (CC_EDITOR) {
  BaseNode.prototype._onRestoreBase = BaseNode.prototype.onRestore;
} // Define public getter and setter methods to ensure api compatibility.


var SameNameGetSets = ['parent', 'name', 'children', 'childrenCount'];
misc.propertyDefine(BaseNode, SameNameGetSets, {});

if (CC_DEV) {
  // promote debug info
  js.get(BaseNode.prototype, ' INFO ', function () {
    var path = '';
    var node = this;

    while (node && !(node instanceof cc.Scene)) {
      if (path) {
        path = node.name + '/' + path;
      } else {
        path = node.name;
      }

      node = node._parent;
    }

    return this.name + ', path: ' + path;
  });
}
/**
 * !#en
 * Note: This event is only emitted from the top most node whose active value did changed,
 * not including its child nodes.
 * !#zh
 * 注意：此节点激活时，此事件仅从最顶部的节点发出。
 * @event active-in-hierarchy-changed
 * @param {Event.EventCustom} event
 */


cc._BaseNode = module.exports = BaseNode;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3V0aWxzL2Jhc2Utbm9kZS5qcyJdLCJuYW1lcyI6WyJGbGFncyIsInJlcXVpcmUiLCJtaXNjIiwianMiLCJJZEdlbmVyYXRlciIsImV2ZW50TWFuYWdlciIsIlJlbmRlckZsb3ciLCJEZXN0cm95aW5nIiwiRG9udERlc3Ryb3kiLCJEZWFjdGl2YXRpbmciLCJDSElMRF9BRERFRCIsIkNISUxEX1JFTU9WRUQiLCJpZEdlbmVyYXRlciIsImdldENvbnN0cnVjdG9yIiwidHlwZU9yQ2xhc3NOYW1lIiwiY2MiLCJlcnJvcklEIiwiZ2V0Q2xhc3NCeU5hbWUiLCJmaW5kQ29tcG9uZW50Iiwibm9kZSIsImNvbnN0cnVjdG9yIiwiX3NlYWxlZCIsImkiLCJfY29tcG9uZW50cyIsImxlbmd0aCIsImNvbXAiLCJmaW5kQ29tcG9uZW50cyIsImNvbXBvbmVudHMiLCJwdXNoIiwiZmluZENoaWxkQ29tcG9uZW50IiwiY2hpbGRyZW4iLCJfY2hpbGRyZW4iLCJmaW5kQ2hpbGRDb21wb25lbnRzIiwiQmFzZU5vZGUiLCJDbGFzcyIsIm5hbWUiLCJPYmplY3QiLCJwcm9wZXJ0aWVzIiwiX3BhcmVudCIsIl9hY3RpdmUiLCJfcHJlZmFiIiwiX3BlcnNpc3ROb2RlIiwiZ2V0IiwiX29iakZsYWdzIiwic2V0IiwidmFsdWUiLCJfbmFtZSIsIkNDX0RFViIsImluZGV4T2YiLCJDQ19KU0IiLCJDQ19OQVRJVkVSRU5ERVJFUiIsIl9wcm94eSIsInNldE5hbWUiLCJ1dWlkIiwiX2lkIiwiY2hpbGRyZW5Db3VudCIsImFjdGl2ZSIsInBhcmVudCIsImNvdWxkQWN0aXZlSW5TY2VuZSIsIl9hY3RpdmVJbkhpZXJhcmNoeSIsImRpcmVjdG9yIiwiX25vZGVBY3RpdmF0b3IiLCJhY3RpdmF0ZU5vZGUiLCJhY3RpdmVJbkhpZXJhcmNoeSIsImN0b3IiLCJ1bmRlZmluZWQiLCJDQ19FRElUT1IiLCJFZGl0b3IiLCJVdGlscyIsIlV1aWRVdGlscyIsImdldE5ld0lkIiwiX3NjaGVkdWxlciIsImVuYWJsZUZvclRhcmdldCIsIl9fZXZlbnRUYXJnZXRzIiwiZ2V0UGFyZW50Iiwic2V0UGFyZW50IiwiZW5naW5lIiwiaXNQbGF5aW5nIiwiX1NjZW5lIiwiRGV0ZWN0Q29uZmxpY3QiLCJiZWZvcmVBZGRDaGlsZCIsIm9sZFBhcmVudCIsIkNDX0RFQlVHIiwiX29uU2V0UGFyZW50IiwiX3NldERpcnR5Rm9yTm9kZSIsImVtaXQiLCJfcmVuZGVyRmxhZyIsIkZMQUdfQ0hJTERSRU4iLCJyZW1vdmVBdCIsInNwbGljZSIsIl9vbkhpZXJhcmNoeUNoYW5nZWQiLCJhdHRyIiwiYXR0cnMiLCJtaXhpbiIsImdldENoaWxkQnlVdWlkIiwibG9nIiwibG9jQ2hpbGRyZW4iLCJsZW4iLCJnZXRDaGlsZEJ5TmFtZSIsImFkZENoaWxkIiwiY2hpbGQiLCJfQmFzZU5vZGUiLCJnZXRDbGFzc05hbWUiLCJhc3NlcnRJRCIsImluc2VydENoaWxkIiwic2libGluZ0luZGV4Iiwic2V0U2libGluZ0luZGV4IiwiZ2V0U2libGluZ0luZGV4IiwiaW5kZXgiLCJzaWJsaW5ncyIsIm9sZEluZGV4IiwiX29uU2libGluZ0luZGV4Q2hhbmdlZCIsIndhbGsiLCJwcmVmdW5jIiwicG9zdGZ1bmMiLCJjdXJyIiwiYWZ0ZXJDaGlsZHJlbiIsInN0YWNrIiwiX3N0YWNrcyIsIl9zdGFja0lkIiwiY2xlYW51cCIsInJlbW92ZUZyb21QYXJlbnQiLCJyZW1vdmVDaGlsZCIsInJlbW92ZUFsbENoaWxkcmVuIiwiaXNDaGlsZE9mIiwiZ2V0Q29tcG9uZW50IiwiZ2V0Q29tcG9uZW50cyIsImdldENvbXBvbmVudEluQ2hpbGRyZW4iLCJnZXRDb21wb25lbnRzSW5DaGlsZHJlbiIsIl9jaGVja011bHRpcGxlQ29tcCIsIkNDX1BSRVZJRVciLCJleGlzdGluZyIsIl9kaXNhbGxvd011bHRpcGxlIiwiYWRkQ29tcG9uZW50IiwiZXJyb3IiLCJfUkZwZWVrIiwiaXNDaGlsZENsYXNzT2YiLCJDb21wb25lbnQiLCJSZXFDb21wIiwiX3JlcXVpcmVDb21wb25lbnQiLCJkZXBlbmRlZCIsImNvbXBvbmVudCIsIkNDX1RFU1QiLCJhdHRhY2hlZE9ianNGb3JFZGl0b3IiLCJhY3RpdmF0ZUNvbXAiLCJfYWRkQ29tcG9uZW50QXQiLCJyZW1vdmVDb21wb25lbnQiLCJkZXN0cm95IiwiX2dldERlcGVuZENvbXBvbmVudCIsImlzVmFsaWQiLCJfd2lsbERlc3Ryb3kiLCJkZXBlbmQiLCJfcmVtb3ZlQ29tcG9uZW50IiwicHJvdG90eXBlIiwiY2FsbCIsImRlc3Ryb3lBbGxDaGlsZHJlbiIsIl9vblBvc3RBY3RpdmF0ZWQiLCJfb25CYXRjaENyZWF0ZWQiLCJkb250U3luY0NoaWxkUHJlZmFiIiwibmV3UGFyZW50IiwiU2NlbmUiLCJnYW1lIiwicmVtb3ZlUGVyc2lzdFJvb3ROb2RlIiwid2FybklEIiwic2NlbmUiLCJnZXRTY2VuZSIsImluQ3VycmVudFNjZW5lQmVmb3JlIiwiaW5DdXJyZW50U2NlbmVOb3ciLCJfcmVnaXN0ZXJJZkF0dGFjaGVkIiwibmV3UHJlZmFiUm9vdCIsInJvb3QiLCJteVByZWZhYkluZm8iLCJQcmVmYWJVdGlscyIsImZpbGVJZCIsImNoZWNrQ2lyY3VsYXJSZWZlcmVuY2UiLCJsaW5rUHJlZmFiIiwiYXNzZXQiLCJ1bmxpbmtQcmVmYWIiLCJhZnRlckFkZENoaWxkIiwic2hvdWxkQWN0aXZlTm93IiwiX2luc3RhbnRpYXRlIiwiY2xvbmVkIiwiaXNTeW5jZWROb2RlIiwiaW5zdGFudGlhdGUiLCJfY2xvbmUiLCJuZXdQcmVmYWJJbmZvIiwiX2lzUGxheWluZyIsInN5bmNpbmciLCJzeW5jIiwicmVnaXN0ZXIiLCJfb25QcmVEZXN0cm95IiwiZGVzdHJveUJ5UGFyZW50IiwiX2Rlc3Ryb3lJbW1lZGlhdGUiLCJldmVudFRhcmdldHMiLCJ0YXJnZXQiLCJ0YXJnZXRPZmYiLCJjaGlsZEluZGV4Iiwib25SZXN0b3JlIiwiX29uUHJlRGVzdHJveUJhc2UiLCJfb25IaWVyYXJjaHlDaGFuZ2VkQmFzZSIsIl9vblJlc3RvcmVCYXNlIiwiU2FtZU5hbWVHZXRTZXRzIiwicHJvcGVydHlEZWZpbmUiLCJwYXRoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsS0FBSyxHQUFHQyxPQUFPLENBQUMsc0JBQUQsQ0FBUCxDQUFnQ0QsS0FBOUM7O0FBQ0EsSUFBTUUsSUFBSSxHQUFHRCxPQUFPLENBQUMsUUFBRCxDQUFwQjs7QUFDQSxJQUFNRSxFQUFFLEdBQUdGLE9BQU8sQ0FBQyxnQkFBRCxDQUFsQjs7QUFDQSxJQUFNRyxXQUFXLEdBQUdILE9BQU8sQ0FBQywwQkFBRCxDQUEzQjs7QUFDQSxJQUFNSSxZQUFZLEdBQUdKLE9BQU8sQ0FBQyxrQkFBRCxDQUE1Qjs7QUFDQSxJQUFNSyxVQUFVLEdBQUdMLE9BQU8sQ0FBQyx5QkFBRCxDQUExQjs7QUFFQSxJQUFNTSxVQUFVLEdBQUdQLEtBQUssQ0FBQ08sVUFBekI7QUFDQSxJQUFNQyxXQUFXLEdBQUdSLEtBQUssQ0FBQ1EsV0FBMUI7QUFDQSxJQUFNQyxZQUFZLEdBQUdULEtBQUssQ0FBQ1MsWUFBM0I7QUFFQSxJQUFNQyxXQUFXLEdBQUcsYUFBcEI7QUFDQSxJQUFNQyxhQUFhLEdBQUcsZUFBdEI7QUFFQSxJQUFJQyxXQUFXLEdBQUcsSUFBSVIsV0FBSixDQUFnQixNQUFoQixDQUFsQjs7QUFFQSxTQUFTUyxjQUFULENBQXdCQyxlQUF4QixFQUF5QztBQUNyQyxNQUFJLENBQUNBLGVBQUwsRUFBc0I7QUFDbEJDLElBQUFBLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLElBQVg7QUFDQSxXQUFPLElBQVA7QUFDSDs7QUFDRCxNQUFJLE9BQU9GLGVBQVAsS0FBMkIsUUFBL0IsRUFB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RUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTVMLEVBQUUsQ0FBQ3NGLFNBQUgsR0FBZXVHLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjVLLFFBQWhDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IEZsYWdzID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vQ0NPYmplY3QnKS5GbGFncztcbmNvbnN0IG1pc2MgPSByZXF1aXJlKCcuL21pc2MnKTtcbmNvbnN0IGpzID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vanMnKTtcbmNvbnN0IElkR2VuZXJhdGVyID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vaWQtZ2VuZXJhdGVyJyk7XG5jb25zdCBldmVudE1hbmFnZXIgPSByZXF1aXJlKCcuLi9ldmVudC1tYW5hZ2VyJyk7XG5jb25zdCBSZW5kZXJGbG93ID0gcmVxdWlyZSgnLi4vcmVuZGVyZXIvcmVuZGVyLWZsb3cnKTtcblxuY29uc3QgRGVzdHJveWluZyA9IEZsYWdzLkRlc3Ryb3lpbmc7XG5jb25zdCBEb250RGVzdHJveSA9IEZsYWdzLkRvbnREZXN0cm95O1xuY29uc3QgRGVhY3RpdmF0aW5nID0gRmxhZ3MuRGVhY3RpdmF0aW5nOyBcblxuY29uc3QgQ0hJTERfQURERUQgPSAnY2hpbGQtYWRkZWQnO1xuY29uc3QgQ0hJTERfUkVNT1ZFRCA9ICdjaGlsZC1yZW1vdmVkJztcblxudmFyIGlkR2VuZXJhdGVyID0gbmV3IElkR2VuZXJhdGVyKCdOb2RlJyk7XG5cbmZ1bmN0aW9uIGdldENvbnN0cnVjdG9yKHR5cGVPckNsYXNzTmFtZSkge1xuICAgIGlmICghdHlwZU9yQ2xhc3NOYW1lKSB7XG4gICAgICAgIGNjLmVycm9ySUQoMzgwNCk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHR5cGVPckNsYXNzTmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGpzLmdldENsYXNzQnlOYW1lKHR5cGVPckNsYXNzTmFtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHR5cGVPckNsYXNzTmFtZTtcbn1cblxuZnVuY3Rpb24gZmluZENvbXBvbmVudChub2RlLCBjb25zdHJ1Y3Rvcikge1xuICAgIGlmIChjb25zdHJ1Y3Rvci5fc2VhbGVkKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5fY29tcG9uZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgbGV0IGNvbXAgPSBub2RlLl9jb21wb25lbnRzW2ldO1xuICAgICAgICAgICAgaWYgKGNvbXAuY29uc3RydWN0b3IgPT09IGNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbXA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5fY29tcG9uZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgbGV0IGNvbXAgPSBub2RlLl9jb21wb25lbnRzW2ldO1xuICAgICAgICAgICAgaWYgKGNvbXAgaW5zdGFuY2VvZiBjb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb21wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBmaW5kQ29tcG9uZW50cyhub2RlLCBjb25zdHJ1Y3RvciwgY29tcG9uZW50cykge1xuICAgIGlmIChjb25zdHJ1Y3Rvci5fc2VhbGVkKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5fY29tcG9uZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgbGV0IGNvbXAgPSBub2RlLl9jb21wb25lbnRzW2ldO1xuICAgICAgICAgICAgaWYgKGNvbXAuY29uc3RydWN0b3IgPT09IGNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5wdXNoKGNvbXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuX2NvbXBvbmVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBjb21wID0gbm9kZS5fY29tcG9uZW50c1tpXTtcbiAgICAgICAgICAgIGlmIChjb21wIGluc3RhbmNlb2YgY29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzLnB1c2goY29tcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZpbmRDaGlsZENvbXBvbmVudChjaGlsZHJlbiwgY29uc3RydWN0b3IpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBub2RlID0gY2hpbGRyZW5baV07XG4gICAgICAgIHZhciBjb21wID0gZmluZENvbXBvbmVudChub2RlLCBjb25zdHJ1Y3Rvcik7XG4gICAgICAgIGlmIChjb21wKSB7XG4gICAgICAgICAgICByZXR1cm4gY29tcDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChub2RlLl9jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb21wID0gZmluZENoaWxkQ29tcG9uZW50KG5vZGUuX2NoaWxkcmVuLCBjb25zdHJ1Y3Rvcik7XG4gICAgICAgICAgICBpZiAoY29tcCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb21wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBmaW5kQ2hpbGRDb21wb25lbnRzKGNoaWxkcmVuLCBjb25zdHJ1Y3RvciwgY29tcG9uZW50cykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIG5vZGUgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgZmluZENvbXBvbmVudHMobm9kZSwgY29uc3RydWN0b3IsIGNvbXBvbmVudHMpO1xuICAgICAgICBpZiAobm9kZS5fY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZmluZENoaWxkQ29tcG9uZW50cyhub2RlLl9jaGlsZHJlbiwgY29uc3RydWN0b3IsIGNvbXBvbmVudHMpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIEEgYmFzZSBub2RlIGZvciBDQ05vZGUsIGl0IHdpbGw6XG4gKiAtIG1haW50YWluIHNjZW5lIGhpZXJhcmNoeSBhbmQgYWN0aXZlIGxvZ2ljXG4gKiAtIG5vdGlmaWNhdGlvbnMgaWYgc29tZSBwcm9wZXJ0aWVzIGNoYW5nZWRcbiAqIC0gZGVmaW5lIHNvbWUgaW50ZXJmYWNlcyBzaGFyZXMgYmV0d2VlbiBDQ05vZGVcbiAqIC0gZGVmaW5lIG1hY2hhbmlzbXMgZm9yIEVuaXR5IENvbXBvbmVudCBTeXN0ZW1zXG4gKiAtIGRlZmluZSBwcmVmYWIgYW5kIHNlcmlhbGl6ZSBmdW5jdGlvbnNcbiAqXG4gKiBAY2xhc3MgX0Jhc2VOb2RlXG4gKiBAZXh0ZW5kcyBPYmplY3RcbiAqIEB1c2VzIEV2ZW50VGFyZ2V0XG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSBbbmFtZV1cbiAqIEBwcml2YXRlXG4gKi9cbnZhciBCYXNlTm9kZSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuX0Jhc2VOb2RlJyxcbiAgICBleHRlbmRzOiBjYy5PYmplY3QsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIFNFUklBTElaQUJMRVxuXG4gICAgICAgIF9wYXJlbnQ6IG51bGwsXG4gICAgICAgIF9jaGlsZHJlbjogW10sXG5cbiAgICAgICAgX2FjdGl2ZTogdHJ1ZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHByb3BlcnR5IF9jb21wb25lbnRzXG4gICAgICAgICAqIEB0eXBlIHtDb21wb25lbnRbXX1cbiAgICAgICAgICogQGRlZmF1bHQgW11cbiAgICAgICAgICogQHJlYWRPbmx5XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBfY29tcG9uZW50czogW10sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBQcmVmYWJJbmZvIG9iamVjdFxuICAgICAgICAgKiBAcHJvcGVydHkgX3ByZWZhYlxuICAgICAgICAgKiBAdHlwZSB7UHJlZmFiSW5mb31cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF9wcmVmYWI6IG51bGwsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIHRydWUsIHRoZSBub2RlIGlzIGFuIHBlcnNpc3Qgbm9kZSB3aGljaCB3b24ndCBiZSBkZXN0cm95ZWQgZHVyaW5nIHNjZW5lIHRyYW5zaXRpb24uXG4gICAgICAgICAqIElmIGZhbHNlLCB0aGUgbm9kZSB3aWxsIGJlIGRlc3Ryb3llZCBhdXRvbWF0aWNhbGx5IHdoZW4gbG9hZGluZyBhIG5ldyBzY2VuZS4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICAgICAgICogQHByb3BlcnR5IF9wZXJzaXN0Tm9kZVxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF9wZXJzaXN0Tm9kZToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHRoaXMuX29iakZsYWdzICYgRG9udERlc3Ryb3kpID4gMDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29iakZsYWdzIHw9IERvbnREZXN0cm95O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb2JqRmxhZ3MgJj0gfkRvbnREZXN0cm95O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyBBUElcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBOYW1lIG9mIG5vZGUuXG4gICAgICAgICAqICEjemgg6K+l6IqC54K55ZCN56ew44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBuYW1lXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIG5vZGUubmFtZSA9IFwiTmV3IE5vZGVcIjtcbiAgICAgICAgICogY2MubG9nKFwiTm9kZSBOYW1lOiBcIiArIG5vZGUubmFtZSk7XG4gICAgICAgICAqL1xuICAgICAgICBuYW1lOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoQ0NfREVWICYmIHZhbHVlLmluZGV4T2YoJy8nKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgxNjMyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9uYW1lID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKENDX0pTQiAmJiBDQ19OQVRJVkVSRU5ERVJFUikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm94eS5zZXROYW1lKHRoaXMuX25hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHV1aWQgZm9yIGVkaXRvciwgd2lsbCBiZSBzdHJpcHBlZCBiZWZvcmUgYnVpbGRpbmcgcHJvamVjdC5cbiAgICAgICAgICogISN6aCDkuLvopoHnlKjkuo7nvJbovpHlmajnmoQgdXVpZO+8jOWcqOe8lui+keWZqOS4i+WPr+eUqOS6juaMgeS5heWMluWtmOWCqO+8jOWcqOmhueebruaehOW7uuS5i+WQjuWwhuWPmOaIkOiHquWinueahCBpZOOAglxuICAgICAgICAgKiBAcHJvcGVydHkgdXVpZFxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAcmVhZE9ubHlcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogY2MubG9nKFwiTm9kZSBVdWlkOiBcIiArIG5vZGUudXVpZCk7XG4gICAgICAgICAqL1xuICAgICAgICB1dWlkOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBBbGwgY2hpbGRyZW4gbm9kZXMuXG4gICAgICAgICAqICEjemgg6IqC54K555qE5omA5pyJ5a2Q6IqC54K544CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBjaGlsZHJlblxuICAgICAgICAgKiBAdHlwZSB7Tm9kZVtdfVxuICAgICAgICAgKiBAcmVhZE9ubHlcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICAgICAgICogZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xuICAgICAgICAgKiAgICAgY2MubG9nKFwiTm9kZTogXCIgKyBjaGlsZHJlbltpXSk7XG4gICAgICAgICAqIH1cbiAgICAgICAgICovXG4gICAgICAgIGNoaWxkcmVuOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBBbGwgY2hpbGRyZW4gbm9kZXMuXG4gICAgICAgICAqICEjemgg6IqC54K555qE5a2Q6IqC54K55pWw6YeP44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBjaGlsZHJlbkNvdW50XG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiB2YXIgY291bnQgPSBub2RlLmNoaWxkcmVuQ291bnQ7XG4gICAgICAgICAqIGNjLmxvZyhcIk5vZGUgQ2hpbGRyZW4gQ291bnQ6IFwiICsgY291bnQpO1xuICAgICAgICAgKi9cbiAgICAgICAgY2hpbGRyZW5Db3VudDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBsb2NhbCBhY3RpdmUgc3RhdGUgb2YgdGhpcyBub2RlLjxici8+XG4gICAgICAgICAqIE5vdGUgdGhhdCBhIE5vZGUgbWF5IGJlIGluYWN0aXZlIGJlY2F1c2UgYSBwYXJlbnQgaXMgbm90IGFjdGl2ZSwgZXZlbiBpZiB0aGlzIHJldHVybnMgdHJ1ZS48YnIvPlxuICAgICAgICAgKiBVc2Uge3sjY3Jvc3NMaW5rIFwiTm9kZS9hY3RpdmVJbkhpZXJhcmNoeTpwcm9wZXJ0eVwifX17ey9jcm9zc0xpbmt9fSBpZiB5b3Ugd2FudCB0byBjaGVjayBpZiB0aGUgTm9kZSBpcyBhY3R1YWxseSB0cmVhdGVkIGFzIGFjdGl2ZSBpbiB0aGUgc2NlbmUuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5b2T5YmN6IqC54K555qE6Ieq6Lqr5r+A5rS754q25oCB44CCPGJyLz5cbiAgICAgICAgICog5YC85b6X5rOo5oSP55qE5piv77yM5LiA5Liq6IqC54K555qE54i26IqC54K55aaC5p6c5LiN6KKr5r+A5rS777yM6YKj5LmI5Y2z5L2/5a6D6Ieq6Lqr6K6+5Li65r+A5rS777yM5a6D5LuN54S25peg5rOV5r+A5rS744CCPGJyLz5cbiAgICAgICAgICog5aaC5p6c5L2g5oOz5qOA5p+l6IqC54K55Zyo5Zy65pmv5Lit5a6e6ZmF55qE5r+A5rS754q25oCB5Y+v5Lul5L2/55SoIHt7I2Nyb3NzTGluayBcIk5vZGUvYWN0aXZlSW5IaWVyYXJjaHk6cHJvcGVydHlcIn19e3svY3Jvc3NMaW5rfX3jgIJcbiAgICAgICAgICogQHByb3BlcnR5IGFjdGl2ZVxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgKi9cbiAgICAgICAgYWN0aXZlOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hY3RpdmU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gISF2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hY3RpdmUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IHRoaXMuX3BhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvdWxkQWN0aXZlSW5TY2VuZSA9IHBhcmVudC5fYWN0aXZlSW5IaWVyYXJjaHk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY291bGRBY3RpdmVJblNjZW5lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuX25vZGVBY3RpdmF0b3IuYWN0aXZhdGVOb2RlKHRoaXMsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBJbmRpY2F0ZXMgd2hldGhlciB0aGlzIG5vZGUgaXMgYWN0aXZlIGluIHRoZSBzY2VuZS5cbiAgICAgICAgICogISN6aCDooajnpLrmraToioLngrnmmK/lkKblnKjlnLrmma/kuK3mv4DmtLvjgIJcbiAgICAgICAgICogQHByb3BlcnR5IGFjdGl2ZUluSGllcmFyY2h5XG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBjYy5sb2coXCJhY3RpdmVJbkhpZXJhcmNoeTogXCIgKyBub2RlLmFjdGl2ZUluSGllcmFyY2h5KTtcbiAgICAgICAgICovXG4gICAgICAgIGFjdGl2ZUluSGllcmFyY2h5OiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hY3RpdmVJbkhpZXJhcmNoeTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbbmFtZV1cbiAgICAgKi9cbiAgICBjdG9yIChuYW1lKSB7XG4gICAgICAgIHRoaXMuX25hbWUgPSBuYW1lICE9PSB1bmRlZmluZWQgPyBuYW1lIDogJ05ldyBOb2RlJztcbiAgICAgICAgdGhpcy5fYWN0aXZlSW5IaWVyYXJjaHkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faWQgPSBDQ19FRElUT1IgPyBFZGl0b3IuVXRpbHMuVXVpZFV0aWxzLnV1aWQoKSA6IGlkR2VuZXJhdGVyLmdldE5ld0lkKCk7XG5cbiAgICAgICAgY2MuZGlyZWN0b3IuX3NjaGVkdWxlciAmJiBjYy5kaXJlY3Rvci5fc2NoZWR1bGVyLmVuYWJsZUZvclRhcmdldCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVnaXN0ZXIgYWxsIHJlbGF0ZWQgRXZlbnRUYXJnZXRzLFxuICAgICAgICAgKiBhbGwgZXZlbnQgY2FsbGJhY2tzIHdpbGwgYmUgcmVtb3ZlZCBpbiBfb25QcmVEZXN0cm95XG4gICAgICAgICAqIEBwcm9wZXJ0eSBfX2V2ZW50VGFyZ2V0c1xuICAgICAgICAgKiBAdHlwZSB7RXZlbnRUYXJnZXRbXX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX19ldmVudFRhcmdldHMgPSBbXTtcbiAgICB9LFxuICAgIC8qKiBcbiAgICAgKiAhI2VuIFRoZSBwYXJlbnQgb2YgdGhlIG5vZGUuXG4gICAgICogISN6aCDor6XoioLngrnnmoTniLboioLngrnjgIJcbiAgICAgKiBAcHJvcGVydHkge05vZGV9IHBhcmVudFxuICAgICAqIEBleGFtcGxlIFxuICAgICAqIGNjLmxvZyhcIk5vZGUgUGFyZW50OiBcIiArIG5vZGUucGFyZW50KTtcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0IHBhcmVudCBvZiB0aGUgbm9kZS5cbiAgICAgKiAhI3poIOiOt+WPluivpeiKgueCueeahOeItuiKgueCueOAglxuICAgICAqIEBtZXRob2QgZ2V0UGFyZW50XG4gICAgICogQHJldHVybiB7Tm9kZX1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBwYXJlbnQgPSB0aGlzLm5vZGUuZ2V0UGFyZW50KCk7XG4gICAgICovXG4gICAgZ2V0UGFyZW50ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgcGFyZW50IG9mIHRoZSBub2RlLlxuICAgICAqICEjemgg6K6+572u6K+l6IqC54K555qE54i26IqC54K544CCXG4gICAgICogQG1ldGhvZCBzZXRQYXJlbnRcbiAgICAgKiBAcGFyYW0ge05vZGV9IHZhbHVlXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBub2RlLnNldFBhcmVudChuZXdOb2RlKTtcbiAgICAgKi9cbiAgICBzZXRQYXJlbnQgKHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKENDX0VESVRPUiAmJiBjYy5lbmdpbmUgJiYgIWNjLmVuZ2luZS5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgIGlmIChfU2NlbmUuRGV0ZWN0Q29uZmxpY3QuYmVmb3JlQWRkQ2hpbGQodGhpcywgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBvbGRQYXJlbnQgPSB0aGlzLl9wYXJlbnQ7XG4gICAgICAgIGlmIChDQ19ERUJVRyAmJiBvbGRQYXJlbnQgJiYgKG9sZFBhcmVudC5fb2JqRmxhZ3MgJiBEZWFjdGl2YXRpbmcpKSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDM4MjEpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3BhcmVudCA9IHZhbHVlIHx8IG51bGw7XG5cbiAgICAgICAgdGhpcy5fb25TZXRQYXJlbnQodmFsdWUpO1xuXG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKENDX0RFQlVHICYmICh2YWx1ZS5fb2JqRmxhZ3MgJiBEZWFjdGl2YXRpbmcpKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzODIxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV2ZW50TWFuYWdlci5fc2V0RGlydHlGb3JOb2RlKHRoaXMpO1xuICAgICAgICAgICAgdmFsdWUuX2NoaWxkcmVuLnB1c2godGhpcyk7XG4gICAgICAgICAgICB2YWx1ZS5lbWl0ICYmIHZhbHVlLmVtaXQoQ0hJTERfQURERUQsIHRoaXMpO1xuICAgICAgICAgICAgdmFsdWUuX3JlbmRlckZsYWcgfD0gUmVuZGVyRmxvdy5GTEFHX0NISUxEUkVOO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvbGRQYXJlbnQpIHtcbiAgICAgICAgICAgIGlmICghKG9sZFBhcmVudC5fb2JqRmxhZ3MgJiBEZXN0cm95aW5nKSkge1xuICAgICAgICAgICAgICAgIHZhciByZW1vdmVBdCA9IG9sZFBhcmVudC5fY2hpbGRyZW4uaW5kZXhPZih0aGlzKTtcbiAgICAgICAgICAgICAgICBpZiAoQ0NfREVWICYmIHJlbW92ZUF0IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2MuZXJyb3JJRCgxNjMzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb2xkUGFyZW50Ll9jaGlsZHJlbi5zcGxpY2UocmVtb3ZlQXQsIDEpO1xuICAgICAgICAgICAgICAgIG9sZFBhcmVudC5lbWl0ICYmIG9sZFBhcmVudC5lbWl0KENISUxEX1JFTU9WRUQsIHRoaXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuX29uSGllcmFyY2h5Q2hhbmdlZChvbGRQYXJlbnQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG9sZFBhcmVudC5fY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG9sZFBhcmVudC5fcmVuZGVyRmxhZyAmPSB+UmVuZGVyRmxvdy5GTEFHX0NISUxEUkVOO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fb25IaWVyYXJjaHlDaGFuZ2VkKG51bGwpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIEFCU1RSQUNUIElOVEVSRkFDRVNcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBQcm9wZXJ0aWVzIGNvbmZpZ3VyYXRpb24gZnVuY3Rpb24gPGJyLz5cbiAgICAgKiBBbGwgcHJvcGVydGllcyBpbiBhdHRycyB3aWxsIGJlIHNldCB0byB0aGUgbm9kZSwgPGJyLz5cbiAgICAgKiB3aGVuIHRoZSBzZXR0ZXIgb2YgdGhlIG5vZGUgaXMgYXZhaWxhYmxlLCA8YnIvPlxuICAgICAqIHRoZSBwcm9wZXJ0eSB3aWxsIGJlIHNldCB2aWEgc2V0dGVyIGZ1bmN0aW9uLjxici8+XG4gICAgICogISN6aCDlsZ7mgKfphY3nva7lh73mlbDjgILlnKggYXR0cnMg55qE5omA5pyJ5bGe5oCn5bCG6KKr6K6+572u5Li66IqC54K55bGe5oCn44CCXG4gICAgICogQG1ldGhvZCBhdHRyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJzIC0gUHJvcGVydGllcyB0byBiZSBzZXQgdG8gbm9kZVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGF0dHJzID0geyBrZXk6IDAsIG51bTogMTAwIH07XG4gICAgICogbm9kZS5hdHRyKGF0dHJzKTtcbiAgICAgKi9cbiAgICBhdHRyIChhdHRycykge1xuICAgICAgICBqcy5taXhpbih0aGlzLCBhdHRycyk7XG4gICAgfSxcblxuICAgIC8vIGNvbXBvc2l0aW9uOiBHRVRcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyBhIGNoaWxkIGZyb20gdGhlIGNvbnRhaW5lciBnaXZlbiBpdHMgdXVpZC5cbiAgICAgKiAhI3poIOmAmui/hyB1dWlkIOiOt+WPluiKgueCueeahOWtkOiKgueCueOAglxuICAgICAqIEBtZXRob2QgZ2V0Q2hpbGRCeVV1aWRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXVpZCAtIFRoZSB1dWlkIHRvIGZpbmQgdGhlIGNoaWxkIG5vZGUuXG4gICAgICogQHJldHVybiB7Tm9kZX0gYSBOb2RlIHdob3NlIHV1aWQgZXF1YWxzIHRvIHRoZSBpbnB1dCBwYXJhbWV0ZXJcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBjaGlsZCA9IG5vZGUuZ2V0Q2hpbGRCeVV1aWQodXVpZCk7XG4gICAgICovXG4gICAgZ2V0Q2hpbGRCeVV1aWQgKHV1aWQpIHtcbiAgICAgICAgaWYgKCF1dWlkKSB7XG4gICAgICAgICAgICBjYy5sb2coXCJJbnZhbGlkIHV1aWRcIik7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsb2NDaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbG9jQ2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChsb2NDaGlsZHJlbltpXS5faWQgPT09IHV1aWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxvY0NoaWxkcmVuW2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgYSBjaGlsZCBmcm9tIHRoZSBjb250YWluZXIgZ2l2ZW4gaXRzIG5hbWUuXG4gICAgICogISN6aCDpgJrov4flkI3np7Dojrflj5boioLngrnnmoTlrZDoioLngrnjgIJcbiAgICAgKiBAbWV0aG9kIGdldENoaWxkQnlOYW1lXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBBIG5hbWUgdG8gZmluZCB0aGUgY2hpbGQgbm9kZS5cbiAgICAgKiBAcmV0dXJuIHtOb2RlfSBhIENDTm9kZSBvYmplY3Qgd2hvc2UgbmFtZSBlcXVhbHMgdG8gdGhlIGlucHV0IHBhcmFtZXRlclxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGNoaWxkID0gbm9kZS5nZXRDaGlsZEJ5TmFtZShcIlRlc3QgTm9kZVwiKTtcbiAgICAgKi9cbiAgICBnZXRDaGlsZEJ5TmFtZSAobmFtZSkge1xuICAgICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgICAgIGNjLmxvZyhcIkludmFsaWQgbmFtZVwiKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxvY0NoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW47XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsb2NDaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKGxvY0NoaWxkcmVuW2ldLl9uYW1lID09PSBuYW1lKVxuICAgICAgICAgICAgICAgIHJldHVybiBsb2NDaGlsZHJlbltpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgLy8gY29tcG9zaXRpb246IEFERFxuXG4gICAgYWRkQ2hpbGQgKGNoaWxkKSB7XG5cbiAgICAgICAgaWYgKENDX0RFViAmJiAhKGNoaWxkIGluc3RhbmNlb2YgY2MuX0Jhc2VOb2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGNjLmVycm9ySUQoMTYzNCwgY2MuanMuZ2V0Q2xhc3NOYW1lKGNoaWxkKSk7XG4gICAgICAgIH1cbiAgICAgICAgY2MuYXNzZXJ0SUQoY2hpbGQsIDE2MDYpO1xuICAgICAgICBjYy5hc3NlcnRJRChjaGlsZC5fcGFyZW50ID09PSBudWxsLCAxNjA1KTtcblxuICAgICAgICAvLyBpbnZva2VzIHRoZSBwYXJlbnQgc2V0dGVyXG4gICAgICAgIGNoaWxkLnNldFBhcmVudCh0aGlzKTtcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogSW5zZXJ0cyBhIGNoaWxkIHRvIHRoZSBub2RlIGF0IGEgc3BlY2lmaWVkIGluZGV4LlxuICAgICAqICEjemhcbiAgICAgKiDmj5LlhaXlrZDoioLngrnliLDmjIflrprkvY3nva5cbiAgICAgKiBAbWV0aG9kIGluc2VydENoaWxkXG4gICAgICogQHBhcmFtIHtOb2RlfSBjaGlsZCAtIHRoZSBjaGlsZCBub2RlIHRvIGJlIGluc2VydGVkXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHNpYmxpbmdJbmRleCAtIHRoZSBzaWJsaW5nIGluZGV4IHRvIHBsYWNlIHRoZSBjaGlsZCBpblxuICAgICAqIEBleGFtcGxlXG4gICAgICogbm9kZS5pbnNlcnRDaGlsZChjaGlsZCwgMik7XG4gICAgICovXG4gICAgaW5zZXJ0Q2hpbGQgKGNoaWxkLCBzaWJsaW5nSW5kZXgpIHtcbiAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgICAgICAgY2hpbGQuc2V0U2libGluZ0luZGV4KHNpYmxpbmdJbmRleCk7XG4gICAgfSxcblxuICAgIC8vIEhJRVJBUkNIWSBNRVRIT0RTXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldCB0aGUgc2libGluZyBpbmRleC5cbiAgICAgKiAhI3poIOiOt+WPluWQjOe6p+e0ouW8leOAglxuICAgICAqIEBtZXRob2QgZ2V0U2libGluZ0luZGV4XG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGluZGV4ID0gbm9kZS5nZXRTaWJsaW5nSW5kZXgoKTtcbiAgICAgKi9cbiAgICBnZXRTaWJsaW5nSW5kZXggKCkge1xuICAgICAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50Ll9jaGlsZHJlbi5pbmRleE9mKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIHNpYmxpbmcgaW5kZXggb2YgdGhpcyBub2RlLlxuICAgICAqICEjemgg6K6+572u6IqC54K55ZCM57qn57Si5byV44CCXG4gICAgICogQG1ldGhvZCBzZXRTaWJsaW5nSW5kZXhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXhcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIG5vZGUuc2V0U2libGluZ0luZGV4KDEpO1xuICAgICAqL1xuICAgIHNldFNpYmxpbmdJbmRleCAoaW5kZXgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9wYXJlbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fcGFyZW50Ll9vYmpGbGFncyAmIERlYWN0aXZhdGluZykge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgzODIxKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc2libGluZ3MgPSB0aGlzLl9wYXJlbnQuX2NoaWxkcmVuO1xuICAgICAgICBpbmRleCA9IGluZGV4ICE9PSAtMSA/IGluZGV4IDogc2libGluZ3MubGVuZ3RoIC0gMTtcbiAgICAgICAgdmFyIG9sZEluZGV4ID0gc2libGluZ3MuaW5kZXhPZih0aGlzKTtcbiAgICAgICAgaWYgKGluZGV4ICE9PSBvbGRJbmRleCkge1xuICAgICAgICAgICAgc2libGluZ3Muc3BsaWNlKG9sZEluZGV4LCAxKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA8IHNpYmxpbmdzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHNpYmxpbmdzLnNwbGljZShpbmRleCwgMCwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzaWJsaW5ncy5wdXNoKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fb25TaWJsaW5nSW5kZXhDaGFuZ2VkICYmIHRoaXMuX29uU2libGluZ0luZGV4Q2hhbmdlZChpbmRleCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBXYWxrIHRob3VnaCB0aGUgc3ViIGNoaWxkcmVuIHRyZWUgb2YgdGhlIGN1cnJlbnQgbm9kZS5cbiAgICAgKiBFYWNoIG5vZGUsIGluY2x1ZGluZyB0aGUgY3VycmVudCBub2RlLCBpbiB0aGUgc3ViIHRyZWUgd2lsbCBiZSB2aXNpdGVkIHR3byB0aW1lcywgYmVmb3JlIGFsbCBjaGlsZHJlbiBhbmQgYWZ0ZXIgYWxsIGNoaWxkcmVuLlxuICAgICAqIFRoaXMgZnVuY3Rpb24gY2FsbCBpcyBub3QgcmVjdXJzaXZlLCBpdCdzIGJhc2VkIG9uIHN0YWNrLlxuICAgICAqIFBsZWFzZSBkb24ndCB3YWxrIGFueSBvdGhlciBub2RlIGluc2lkZSB0aGUgd2FsayBwcm9jZXNzLlxuICAgICAqICEjemgg6YGN5Y6G6K+l6IqC54K555qE5a2Q5qCR6YeM55qE5omA5pyJ6IqC54K55bm25oyJ6KeE5YiZ5omn6KGM5Zue6LCD5Ye95pWw44CCXG4gICAgICog5a+55a2Q5qCR5Lit55qE5omA5pyJ6IqC54K577yM5YyF5ZCr5b2T5YmN6IqC54K577yM5Lya5omn6KGM5Lik5qyh5Zue6LCD77yMcHJlZnVuYyDkvJrlnKjorr/pl67lroPnmoTlrZDoioLngrnkuYvliY3osIPnlKjvvIxwb3N0ZnVuYyDkvJrlnKjorr/pl67miYDmnInlrZDoioLngrnkuYvlkI7osIPnlKjjgIJcbiAgICAgKiDov5nkuKrlh73mlbDnmoTlrp7njrDkuI3mmK/ln7rkuo7pgJLlvZLnmoTvvIzogIzmmK/ln7rkuo7moIjlsZXlvIDpgJLlvZLnmoTmlrnlvI/jgIJcbiAgICAgKiDor7fkuI3opoHlnKggd2FsayDov4fnqIvkuK3lr7nku7vkvZXlhbbku5bnmoToioLngrnltYzlpZfmiafooYwgd2Fsa+OAglxuICAgICAqIEBtZXRob2Qgd2Fsa1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWZ1bmMgVGhlIGNhbGxiYWNrIHRvIHByb2Nlc3Mgbm9kZSB3aGVuIHJlYWNoIHRoZSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAqIEBwYXJhbSB7X0Jhc2VOb2RlfSBwcmVmdW5jLnRhcmdldCBUaGUgY3VycmVudCB2aXNpdGluZyBub2RlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcG9zdGZ1bmMgVGhlIGNhbGxiYWNrIHRvIHByb2Nlc3Mgbm9kZSB3aGVuIHJlLXZpc2l0IHRoZSBub2RlIGFmdGVyIHdhbGtlZCBhbGwgY2hpbGRyZW4gaW4gaXRzIHN1YiB0cmVlXG4gICAgICogQHBhcmFtIHtfQmFzZU5vZGV9IHBvc3RmdW5jLnRhcmdldCBUaGUgY3VycmVudCB2aXNpdGluZyBub2RlXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBub2RlLndhbGsoZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAqICAgICBjb25zb2xlLmxvZygnV2Fsa2VkIHRocm91Z2ggbm9kZSAnICsgdGFyZ2V0Lm5hbWUgKyAnIGZvciB0aGUgZmlyc3QgdGltZScpO1xuICAgICAqIH0sIGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgKiAgICAgY29uc29sZS5sb2coJ1dhbGtlZCB0aHJvdWdoIG5vZGUgJyArIHRhcmdldC5uYW1lICsgJyBhZnRlciB3YWxrZWQgYWxsIGNoaWxkcmVuIGluIGl0cyBzdWIgdHJlZScpO1xuICAgICAqIH0pO1xuICAgICAqL1xuICAgIHdhbGsgKHByZWZ1bmMsIHBvc3RmdW5jKSB7XG4gICAgICAgIHZhciBCYXNlTm9kZSA9IGNjLl9CYXNlTm9kZTtcbiAgICAgICAgdmFyIGluZGV4ID0gMTtcbiAgICAgICAgdmFyIGNoaWxkcmVuLCBjaGlsZCwgY3VyciwgaSwgYWZ0ZXJDaGlsZHJlbjtcbiAgICAgICAgdmFyIHN0YWNrID0gQmFzZU5vZGUuX3N0YWNrc1tCYXNlTm9kZS5fc3RhY2tJZF07XG4gICAgICAgIGlmICghc3RhY2spIHtcbiAgICAgICAgICAgIHN0YWNrID0gW107XG4gICAgICAgICAgICBCYXNlTm9kZS5fc3RhY2tzLnB1c2goc3RhY2spO1xuICAgICAgICB9XG4gICAgICAgIEJhc2VOb2RlLl9zdGFja0lkKys7XG5cbiAgICAgICAgc3RhY2subGVuZ3RoID0gMDtcbiAgICAgICAgc3RhY2tbMF0gPSB0aGlzO1xuICAgICAgICB2YXIgcGFyZW50ID0gbnVsbDtcbiAgICAgICAgYWZ0ZXJDaGlsZHJlbiA9IGZhbHNlO1xuICAgICAgICB3aGlsZSAoaW5kZXgpIHtcbiAgICAgICAgICAgIGluZGV4LS07XG4gICAgICAgICAgICBjdXJyID0gc3RhY2tbaW5kZXhdO1xuICAgICAgICAgICAgaWYgKCFjdXJyKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWFmdGVyQ2hpbGRyZW4gJiYgcHJlZnVuYykge1xuICAgICAgICAgICAgICAgIC8vIHByZSBjYWxsXG4gICAgICAgICAgICAgICAgcHJlZnVuYyhjdXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGFmdGVyQ2hpbGRyZW4gJiYgcG9zdGZ1bmMpIHtcbiAgICAgICAgICAgICAgICAvLyBwb3N0IGNhbGxcbiAgICAgICAgICAgICAgICBwb3N0ZnVuYyhjdXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gQXZvaWQgbWVtb3J5IGxlYWtcbiAgICAgICAgICAgIHN0YWNrW2luZGV4XSA9IG51bGw7XG4gICAgICAgICAgICAvLyBEbyBub3QgcmVwZWF0bHkgdmlzaXQgY2hpbGQgdHJlZSwganVzdCBkbyBwb3N0IGNhbGwgYW5kIGNvbnRpbnVlIHdhbGtcbiAgICAgICAgICAgIGlmIChhZnRlckNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcy5fcGFyZW50KSBicmVhaztcbiAgICAgICAgICAgICAgICBhZnRlckNoaWxkcmVuID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBDaGlsZHJlbiBub3QgcHJvY2VlZGVkIGFuZCBoYXMgY2hpbGRyZW4sIHByb2NlZWQgdG8gY2hpbGQgdHJlZVxuICAgICAgICAgICAgICAgIGlmIChjdXJyLl9jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IGN1cnI7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gY3Vyci5fY2hpbGRyZW47XG4gICAgICAgICAgICAgICAgICAgIGkgPSAwO1xuICAgICAgICAgICAgICAgICAgICBzdGFja1tpbmRleF0gPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gTm8gY2hpbGRyZW4sIHRoZW4gcmVwdXNoIGN1cnIgdG8gYmUgd2Fsa2VkIGZvciBwb3N0IGZ1bmNcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2tbaW5kZXhdID0gY3VycjtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgICAgICAgICAgYWZ0ZXJDaGlsZHJlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY3VyciBoYXMgbm8gc3ViIHRyZWUsIHNvIGxvb2sgaW50byB0aGUgc2libGluZ3MgaW4gcGFyZW50IGNoaWxkcmVuXG4gICAgICAgICAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgLy8gUHJvY2VlZCB0byBuZXh0IHNpYmxpbmcgaW4gcGFyZW50IGNoaWxkcmVuXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrW2luZGV4XSA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBObyBjaGlsZHJlbiBhbnkgbW9yZSBpbiB0aGlzIHN1YiB0cmVlLCBnbyB1cHdhcmRcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2tbaW5kZXhdID0gcGFyZW50O1xuICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICAvLyBTZXR1cCBwYXJlbnQgd2FsayBlbnZcbiAgICAgICAgICAgICAgICAgICAgYWZ0ZXJDaGlsZHJlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBwYXJlbnQuX3BhcmVudC5fY2hpbGRyZW47XG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gY2hpbGRyZW4uaW5kZXhPZihwYXJlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50Ll9wYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBdCByb290XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRVJST1JcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzdGFjay5sZW5ndGggPSAwO1xuICAgICAgICBCYXNlTm9kZS5fc3RhY2tJZC0tO1xuICAgIH0sXG5cbiAgICBjbGVhbnVwICgpIHtcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmVtb3ZlIGl0c2VsZiBmcm9tIGl0cyBwYXJlbnQgbm9kZS4gSWYgY2xlYW51cCBpcyBgdHJ1ZWAsIHRoZW4gYWxzbyByZW1vdmUgYWxsIGV2ZW50cyBhbmQgYWN0aW9ucy4gPGJyLz5cbiAgICAgKiBJZiB0aGUgY2xlYW51cCBwYXJhbWV0ZXIgaXMgbm90IHBhc3NlZCwgaXQgd2lsbCBmb3JjZSBhIGNsZWFudXAsIHNvIGl0IGlzIHJlY29tbWVuZGVkIHRoYXQgeW91IGFsd2F5cyBwYXNzIGluIHRoZSBgZmFsc2VgIHBhcmFtZXRlciB3aGVuIGNhbGxpbmcgdGhpcyBBUEkuPGJyLz5cbiAgICAgKiBJZiB0aGUgbm9kZSBvcnBoYW4sIHRoZW4gbm90aGluZyBoYXBwZW5zLlxuICAgICAqICEjemhcbiAgICAgKiDku47niLboioLngrnkuK3liKDpmaTor6XoioLngrnjgILlpoLmnpzkuI3kvKDlhaUgY2xlYW51cCDlj4LmlbDmiJbogIXkvKDlhaUgYHRydWVg77yM6YKj5LmI6L+Z5Liq6IqC54K55LiK5omA5pyJ57uR5a6a55qE5LqL5Lu244CBYWN0aW9uIOmDveS8muiiq+WIoOmZpOOAgjxici8+XG4gICAgICog5Zug5q2k5bu66K6u6LCD55So6L+Z5LiqIEFQSSDml7bmgLvmmK/kvKDlhaUgYGZhbHNlYCDlj4LmlbDjgII8YnIvPlxuICAgICAqIOWmguaenOi/meS4quiKgueCueaYr+S4gOS4quWtpOiKgueCue+8jOmCo+S5iOS7gOS5iOmDveS4jeS8muWPkeeUn+OAglxuICAgICAqIEBtZXRob2QgcmVtb3ZlRnJvbVBhcmVudFxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NsZWFudXA9dHJ1ZV0gLSB0cnVlIGlmIGFsbCBhY3Rpb25zIGFuZCBjYWxsYmFja3Mgb24gdGhpcyBub2RlIHNob3VsZCBiZSByZW1vdmVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBub2RlLnJlbW92ZUZyb21QYXJlbnQoKTtcbiAgICAgKiBub2RlLnJlbW92ZUZyb21QYXJlbnQoZmFsc2UpO1xuICAgICAqL1xuICAgIHJlbW92ZUZyb21QYXJlbnQgKGNsZWFudXApIHtcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCkge1xuICAgICAgICAgICAgaWYgKGNsZWFudXAgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBjbGVhbnVwID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC5yZW1vdmVDaGlsZCh0aGlzLCBjbGVhbnVwKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmVtb3ZlcyBhIGNoaWxkIGZyb20gdGhlIGNvbnRhaW5lci4gSXQgd2lsbCBhbHNvIGNsZWFudXAgYWxsIHJ1bm5pbmcgYWN0aW9ucyBkZXBlbmRpbmcgb24gdGhlIGNsZWFudXAgcGFyYW1ldGVyLiA8L3A+XG4gICAgICogSWYgdGhlIGNsZWFudXAgcGFyYW1ldGVyIGlzIG5vdCBwYXNzZWQsIGl0IHdpbGwgZm9yY2UgYSBjbGVhbnVwLiA8YnIvPlxuICAgICAqIFwicmVtb3ZlXCIgbG9naWMgTVVTVCBvbmx5IGJlIG9uIHRoaXMgbWV0aG9kICA8YnIvPlxuICAgICAqIElmIGEgY2xhc3Mgd2FudHMgdG8gZXh0ZW5kIHRoZSAncmVtb3ZlQ2hpbGQnIGJlaGF2aW9yIGl0IG9ubHkgbmVlZHMgPGJyLz5cbiAgICAgKiB0byBvdmVycmlkZSB0aGlzIG1ldGhvZC5cbiAgICAgKiAhI3poXG4gICAgICog56e76Zmk6IqC54K55Lit5oyH5a6a55qE5a2Q6IqC54K577yM5piv5ZCm6ZyA6KaB5riF55CG5omA5pyJ5q2j5Zyo6L+Q6KGM55qE6KGM5Li65Y+W5Yaz5LqOIGNsZWFudXAg5Y+C5pWw44CCPGJyLz5cbiAgICAgKiDlpoLmnpwgY2xlYW51cCDlj4LmlbDkuI3kvKDlhaXvvIzpu5jorqTkuLogdHJ1ZSDooajnpLrmuIXnkIbjgII8YnIvPlxuICAgICAqIEBtZXRob2QgcmVtb3ZlQ2hpbGRcbiAgICAgKiBAcGFyYW0ge05vZGV9IGNoaWxkIC0gVGhlIGNoaWxkIG5vZGUgd2hpY2ggd2lsbCBiZSByZW1vdmVkLlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NsZWFudXA9dHJ1ZV0gLSB0cnVlIGlmIGFsbCBydW5uaW5nIGFjdGlvbnMgYW5kIGNhbGxiYWNrcyBvbiB0aGUgY2hpbGQgbm9kZSB3aWxsIGJlIGNsZWFudXAsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIG5vZGUucmVtb3ZlQ2hpbGQobmV3Tm9kZSk7XG4gICAgICogbm9kZS5yZW1vdmVDaGlsZChuZXdOb2RlLCBmYWxzZSk7XG4gICAgICovXG4gICAgcmVtb3ZlQ2hpbGQgKGNoaWxkLCBjbGVhbnVwKSB7XG4gICAgICAgIGlmICh0aGlzLl9jaGlsZHJlbi5pbmRleE9mKGNoaWxkKSA+IC0xKSB7XG4gICAgICAgICAgICAvLyBJZiB5b3UgZG9uJ3QgZG8gY2xlYW51cCwgdGhlIGNoaWxkJ3MgYWN0aW9ucyB3aWxsIG5vdCBnZXQgcmVtb3ZlZCBhbmQgdGhlXG4gICAgICAgICAgICBpZiAoY2xlYW51cCB8fCBjbGVhbnVwID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjaGlsZC5jbGVhbnVwKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpbnZva2UgdGhlIHBhcmVudCBzZXR0ZXJcbiAgICAgICAgICAgIGNoaWxkLnBhcmVudCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJlbW92ZXMgYWxsIGNoaWxkcmVuIGZyb20gdGhlIGNvbnRhaW5lciBhbmQgZG8gYSBjbGVhbnVwIGFsbCBydW5uaW5nIGFjdGlvbnMgZGVwZW5kaW5nIG9uIHRoZSBjbGVhbnVwIHBhcmFtZXRlci4gPGJyLz5cbiAgICAgKiBJZiB0aGUgY2xlYW51cCBwYXJhbWV0ZXIgaXMgbm90IHBhc3NlZCwgaXQgd2lsbCBmb3JjZSBhIGNsZWFudXAuXG4gICAgICogISN6aFxuICAgICAqIOenu+mZpOiKgueCueaJgOacieeahOWtkOiKgueCue+8jOaYr+WQpumcgOimgea4heeQhuaJgOacieato+WcqOi/kOihjOeahOihjOS4uuWPluWGs+S6jiBjbGVhbnVwIOWPguaVsOOAgjxici8+XG4gICAgICog5aaC5p6cIGNsZWFudXAg5Y+C5pWw5LiN5Lyg5YWl77yM6buY6K6k5Li6IHRydWUg6KGo56S65riF55CG44CCXG4gICAgICogQG1ldGhvZCByZW1vdmVBbGxDaGlsZHJlblxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NsZWFudXA9dHJ1ZV0gLSB0cnVlIGlmIGFsbCBydW5uaW5nIGFjdGlvbnMgb24gYWxsIGNoaWxkcmVuIG5vZGVzIHNob3VsZCBiZSBjbGVhbnVwLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBub2RlLnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgICogbm9kZS5yZW1vdmVBbGxDaGlsZHJlbihmYWxzZSk7XG4gICAgICovXG4gICAgcmVtb3ZlQWxsQ2hpbGRyZW4gKGNsZWFudXApIHtcbiAgICAgICAgLy8gbm90IHVzaW5nIGRldGFjaENoaWxkIGltcHJvdmVzIHNwZWVkIGhlcmVcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW47XG4gICAgICAgIGlmIChjbGVhbnVwID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBjbGVhbnVwID0gdHJ1ZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IGNoaWxkcmVuLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB5b3UgZG9uJ3QgZG8gY2xlYW51cCwgdGhlIG5vZGUncyBhY3Rpb25zIHdpbGwgbm90IGdldCByZW1vdmVkIGFuZCB0aGVcbiAgICAgICAgICAgICAgICBpZiAoY2xlYW51cClcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5jbGVhbnVwKCk7XG5cbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2hpbGRyZW4ubGVuZ3RoID0gMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBJcyB0aGlzIG5vZGUgYSBjaGlsZCBvZiB0aGUgZ2l2ZW4gbm9kZT9cbiAgICAgKiAhI3poIOaYr+WQpuaYr+aMh+WumuiKgueCueeahOWtkOiKgueCue+8n1xuICAgICAqIEBtZXRob2QgaXNDaGlsZE9mXG4gICAgICogQHBhcmFtIHtOb2RlfSBwYXJlbnRcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSAtIFJldHVybnMgdHJ1ZSBpZiB0aGlzIG5vZGUgaXMgYSBjaGlsZCwgZGVlcCBjaGlsZCBvciBpZGVudGljYWwgdG8gdGhlIGdpdmVuIG5vZGUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBub2RlLmlzQ2hpbGRPZihuZXdOb2RlKTtcbiAgICAgKi9cbiAgICBpc0NoaWxkT2YgKHBhcmVudCkge1xuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBpZiAoY2hpbGQgPT09IHBhcmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2hpbGQgPSBjaGlsZC5fcGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlIChjaGlsZCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8gQ09NUE9ORU5UXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyB0aGUgY29tcG9uZW50IG9mIHN1cHBsaWVkIHR5cGUgaWYgdGhlIG5vZGUgaGFzIG9uZSBhdHRhY2hlZCwgbnVsbCBpZiBpdCBkb2Vzbid0Ljxici8+XG4gICAgICogWW91IGNhbiBhbHNvIGdldCBjb21wb25lbnQgaW4gdGhlIG5vZGUgYnkgcGFzc2luZyBpbiB0aGUgbmFtZSBvZiB0aGUgc2NyaXB0LlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5boioLngrnkuIrmjIflrprnsbvlnovnmoTnu4Tku7bvvIzlpoLmnpzoioLngrnmnInpmYTliqDmjIflrprnsbvlnovnmoTnu4Tku7bvvIzliJnov5Tlm57vvIzlpoLmnpzmsqHmnInliJnkuLrnqbrjgII8YnIvPlxuICAgICAqIOS8oOWFpeWPguaVsOS5n+WPr+S7peaYr+iEmuacrOeahOWQjeensOOAglxuICAgICAqIEBtZXRob2QgZ2V0Q29tcG9uZW50XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxTdHJpbmd9IHR5cGVPckNsYXNzTmFtZVxuICAgICAqIEByZXR1cm4ge0NvbXBvbmVudH1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vIGdldCBzcHJpdGUgY29tcG9uZW50XG4gICAgICogdmFyIHNwcml0ZSA9IG5vZGUuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICogLy8gZ2V0IGN1c3RvbSB0ZXN0IGNsYXNzXG4gICAgICogdmFyIHRlc3QgPSBub2RlLmdldENvbXBvbmVudChcIlRlc3RcIik7XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBnZXRDb21wb25lbnQ8VCBleHRlbmRzIENvbXBvbmVudD4odHlwZToge3Byb3RvdHlwZTogVH0pOiBUXG4gICAgICogZ2V0Q29tcG9uZW50KGNsYXNzTmFtZTogc3RyaW5nKTogYW55XG4gICAgICovXG4gICAgZ2V0Q29tcG9uZW50ICh0eXBlT3JDbGFzc05hbWUpIHtcbiAgICAgICAgdmFyIGNvbnN0cnVjdG9yID0gZ2V0Q29uc3RydWN0b3IodHlwZU9yQ2xhc3NOYW1lKTtcbiAgICAgICAgaWYgKGNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZmluZENvbXBvbmVudCh0aGlzLCBjb25zdHJ1Y3Rvcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyBhbGwgY29tcG9uZW50cyBvZiBzdXBwbGllZCB0eXBlIGluIHRoZSBub2RlLlxuICAgICAqICEjemgg6L+U5Zue6IqC54K55LiK5oyH5a6a57G75Z6L55qE5omA5pyJ57uE5Lu244CCXG4gICAgICogQG1ldGhvZCBnZXRDb21wb25lbnRzXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxTdHJpbmd9IHR5cGVPckNsYXNzTmFtZVxuICAgICAqIEByZXR1cm4ge0NvbXBvbmVudFtdfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHNwcml0ZXMgPSBub2RlLmdldENvbXBvbmVudHMoY2MuU3ByaXRlKTtcbiAgICAgKiB2YXIgdGVzdHMgPSBub2RlLmdldENvbXBvbmVudHMoXCJUZXN0XCIpO1xuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZ2V0Q29tcG9uZW50czxUIGV4dGVuZHMgQ29tcG9uZW50Pih0eXBlOiB7cHJvdG90eXBlOiBUfSk6IFRbXVxuICAgICAqIGdldENvbXBvbmVudHMoY2xhc3NOYW1lOiBzdHJpbmcpOiBhbnlbXVxuICAgICAqL1xuICAgIGdldENvbXBvbmVudHMgKHR5cGVPckNsYXNzTmFtZSkge1xuICAgICAgICB2YXIgY29uc3RydWN0b3IgPSBnZXRDb25zdHJ1Y3Rvcih0eXBlT3JDbGFzc05hbWUpLCBjb21wb25lbnRzID0gW107XG4gICAgICAgIGlmIChjb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgZmluZENvbXBvbmVudHModGhpcywgY29uc3RydWN0b3IsIGNvbXBvbmVudHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wb25lbnRzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgdGhlIGNvbXBvbmVudCBvZiBzdXBwbGllZCB0eXBlIGluIGFueSBvZiBpdHMgY2hpbGRyZW4gdXNpbmcgZGVwdGggZmlyc3Qgc2VhcmNoLlxuICAgICAqICEjemgg6YCS5b2S5p+l5om+5omA5pyJ5a2Q6IqC54K55Lit56ys5LiA5Liq5Yy56YWN5oyH5a6a57G75Z6L55qE57uE5Lu244CCXG4gICAgICogQG1ldGhvZCBnZXRDb21wb25lbnRJbkNoaWxkcmVuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxTdHJpbmd9IHR5cGVPckNsYXNzTmFtZVxuICAgICAqIEByZXR1cm4ge0NvbXBvbmVudH1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBzcHJpdGUgPSBub2RlLmdldENvbXBvbmVudEluQ2hpbGRyZW4oY2MuU3ByaXRlKTtcbiAgICAgKiB2YXIgVGVzdCA9IG5vZGUuZ2V0Q29tcG9uZW50SW5DaGlsZHJlbihcIlRlc3RcIik7XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBnZXRDb21wb25lbnRJbkNoaWxkcmVuPFQgZXh0ZW5kcyBDb21wb25lbnQ+KHR5cGU6IHtwcm90b3R5cGU6IFR9KTogVFxuICAgICAqIGdldENvbXBvbmVudEluQ2hpbGRyZW4oY2xhc3NOYW1lOiBzdHJpbmcpOiBhbnlcbiAgICAgKi9cbiAgICBnZXRDb21wb25lbnRJbkNoaWxkcmVuICh0eXBlT3JDbGFzc05hbWUpIHtcbiAgICAgICAgdmFyIGNvbnN0cnVjdG9yID0gZ2V0Q29uc3RydWN0b3IodHlwZU9yQ2xhc3NOYW1lKTtcbiAgICAgICAgaWYgKGNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZmluZENoaWxkQ29tcG9uZW50KHRoaXMuX2NoaWxkcmVuLCBjb25zdHJ1Y3Rvcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyBhbGwgY29tcG9uZW50cyBvZiBzdXBwbGllZCB0eXBlIGluIHNlbGYgb3IgYW55IG9mIGl0cyBjaGlsZHJlbi5cbiAgICAgKiAhI3poIOmAkuW9kuafpeaJvuiHqui6q+aIluaJgOacieWtkOiKgueCueS4reaMh+Wumuexu+Wei+eahOe7hOS7tlxuICAgICAqIEBtZXRob2QgZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufFN0cmluZ30gdHlwZU9yQ2xhc3NOYW1lXG4gICAgICogQHJldHVybiB7Q29tcG9uZW50W119XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgc3ByaXRlcyA9IG5vZGUuZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4oY2MuU3ByaXRlKTtcbiAgICAgKiB2YXIgdGVzdHMgPSBub2RlLmdldENvbXBvbmVudHNJbkNoaWxkcmVuKFwiVGVzdFwiKTtcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGdldENvbXBvbmVudHNJbkNoaWxkcmVuPFQgZXh0ZW5kcyBDb21wb25lbnQ+KHR5cGU6IHtwcm90b3R5cGU6IFR9KTogVFtdXG4gICAgICogZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4oY2xhc3NOYW1lOiBzdHJpbmcpOiBhbnlbXVxuICAgICAqL1xuICAgIGdldENvbXBvbmVudHNJbkNoaWxkcmVuICh0eXBlT3JDbGFzc05hbWUpIHtcbiAgICAgICAgdmFyIGNvbnN0cnVjdG9yID0gZ2V0Q29uc3RydWN0b3IodHlwZU9yQ2xhc3NOYW1lKSwgY29tcG9uZW50cyA9IFtdO1xuICAgICAgICBpZiAoY29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIGZpbmRDb21wb25lbnRzKHRoaXMsIGNvbnN0cnVjdG9yLCBjb21wb25lbnRzKTtcbiAgICAgICAgICAgIGZpbmRDaGlsZENvbXBvbmVudHModGhpcy5fY2hpbGRyZW4sIGNvbnN0cnVjdG9yLCBjb21wb25lbnRzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tcG9uZW50cztcbiAgICB9LFxuXG4gICAgX2NoZWNrTXVsdGlwbGVDb21wOiAoQ0NfRURJVE9SIHx8IENDX1BSRVZJRVcpICYmIGZ1bmN0aW9uIChjdG9yKSB7XG4gICAgICAgIHZhciBleGlzdGluZyA9IHRoaXMuZ2V0Q29tcG9uZW50KGN0b3IuX2Rpc2FsbG93TXVsdGlwbGUpO1xuICAgICAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgICAgICAgIGlmIChleGlzdGluZy5jb25zdHJ1Y3RvciA9PT0gY3Rvcikge1xuICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMzgwNSwganMuZ2V0Q2xhc3NOYW1lKGN0b3IpLCB0aGlzLl9uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMzgwNiwganMuZ2V0Q2xhc3NOYW1lKGN0b3IpLCB0aGlzLl9uYW1lLCBqcy5nZXRDbGFzc05hbWUoZXhpc3RpbmcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBBZGRzIGEgY29tcG9uZW50IGNsYXNzIHRvIHRoZSBub2RlLiBZb3UgY2FuIGFsc28gYWRkIGNvbXBvbmVudCB0byBub2RlIGJ5IHBhc3NpbmcgaW4gdGhlIG5hbWUgb2YgdGhlIHNjcmlwdC5cbiAgICAgKiAhI3poIOWQkeiKgueCuea3u+WKoOS4gOS4quaMh+Wumuexu+Wei+eahOe7hOS7tuexu++8jOS9oOi/mOWPr+S7pemAmui/h+S8oOWFpeiEmuacrOeahOWQjeensOadpea3u+WKoOe7hOS7tuOAglxuICAgICAqIEBtZXRob2QgYWRkQ29tcG9uZW50XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxTdHJpbmd9IHR5cGVPckNsYXNzTmFtZSAtIFRoZSBjb25zdHJ1Y3RvciBvciB0aGUgY2xhc3MgbmFtZSBvZiB0aGUgY29tcG9uZW50IHRvIGFkZFxuICAgICAqIEByZXR1cm4ge0NvbXBvbmVudH0gLSBUaGUgbmV3bHkgYWRkZWQgY29tcG9uZW50XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgc3ByaXRlID0gbm9kZS5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgKiB2YXIgdGVzdCA9IG5vZGUuYWRkQ29tcG9uZW50KFwiVGVzdFwiKTtcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGFkZENvbXBvbmVudDxUIGV4dGVuZHMgQ29tcG9uZW50Pih0eXBlOiB7bmV3KCk6IFR9KTogVFxuICAgICAqIGFkZENvbXBvbmVudChjbGFzc05hbWU6IHN0cmluZyk6IGFueVxuICAgICAqL1xuICAgIGFkZENvbXBvbmVudCAodHlwZU9yQ2xhc3NOYW1lKSB7XG4gICAgICAgIGlmIChDQ19FRElUT1IgJiYgKHRoaXMuX29iakZsYWdzICYgRGVzdHJveWluZykpIHtcbiAgICAgICAgICAgIGNjLmVycm9yKCdpc0Rlc3Ryb3lpbmcnKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZ2V0IGNvbXBvbmVudFxuXG4gICAgICAgIHZhciBjb25zdHJ1Y3RvcjtcbiAgICAgICAgaWYgKHR5cGVvZiB0eXBlT3JDbGFzc05hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RvciA9IGpzLmdldENsYXNzQnlOYW1lKHR5cGVPckNsYXNzTmFtZSk7XG4gICAgICAgICAgICBpZiAoIWNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzODA3LCB0eXBlT3JDbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChjYy5fUkZwZWVrKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzODA4LCB0eXBlT3JDbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdHlwZU9yQ2xhc3NOYW1lKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzODA0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0cnVjdG9yID0gdHlwZU9yQ2xhc3NOYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2hlY2sgY29tcG9uZW50XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb25zdHJ1Y3RvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgzODA5KTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICghanMuaXNDaGlsZENsYXNzT2YoY29uc3RydWN0b3IsIGNjLkNvbXBvbmVudCkpIHtcbiAgICAgICAgICAgIGNjLmVycm9ySUQoMzgxMCk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgoQ0NfRURJVE9SIHx8IENDX1BSRVZJRVcpICYmIGNvbnN0cnVjdG9yLl9kaXNhbGxvd011bHRpcGxlKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2NoZWNrTXVsdGlwbGVDb21wKGNvbnN0cnVjdG9yKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2hlY2sgcmVxdWlyZW1lbnRcblxuICAgICAgICB2YXIgUmVxQ29tcCA9IGNvbnN0cnVjdG9yLl9yZXF1aXJlQ29tcG9uZW50O1xuICAgICAgICBpZiAoUmVxQ29tcCAmJiAhdGhpcy5nZXRDb21wb25lbnQoUmVxQ29tcCkpIHtcbiAgICAgICAgICAgIHZhciBkZXBlbmRlZCA9IHRoaXMuYWRkQ29tcG9uZW50KFJlcUNvbXApO1xuICAgICAgICAgICAgaWYgKCFkZXBlbmRlZCkge1xuICAgICAgICAgICAgICAgIC8vIGRlcGVuZCBjb25mbGljdHNcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vLy8gY2hlY2sgY29uZmxpY3RcbiAgICAgICAgLy9cbiAgICAgICAgLy9pZiAoQ0NfRURJVE9SICYmICFfU2NlbmUuRGV0ZWN0Q29uZmxpY3QuYmVmb3JlQWRkQ29tcG9uZW50KHRoaXMsIGNvbnN0cnVjdG9yKSkge1xuICAgICAgICAvLyAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgLy99XG5cbiAgICAgICAgLy9cblxuICAgICAgICB2YXIgY29tcG9uZW50ID0gbmV3IGNvbnN0cnVjdG9yKCk7XG4gICAgICAgIGNvbXBvbmVudC5ub2RlID0gdGhpcztcbiAgICAgICAgdGhpcy5fY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gICAgICAgIGlmICgoQ0NfRURJVE9SIHx8IENDX1RFU1QpICYmIGNjLmVuZ2luZSAmJiAodGhpcy5faWQgaW4gY2MuZW5naW5lLmF0dGFjaGVkT2Jqc0ZvckVkaXRvcikpIHtcbiAgICAgICAgICAgIGNjLmVuZ2luZS5hdHRhY2hlZE9ianNGb3JFZGl0b3JbY29tcG9uZW50Ll9pZF0gPSBjb21wb25lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZUluSGllcmFyY2h5KSB7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5fbm9kZUFjdGl2YXRvci5hY3RpdmF0ZUNvbXAoY29tcG9uZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb21wb25lbnQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRoaXMgYXBpIHNob3VsZCBvbmx5IHVzZWQgYnkgdW5kbyBzeXN0ZW1cbiAgICAgKiBAbWV0aG9kIF9hZGRDb21wb25lbnRBdFxuICAgICAqIEBwYXJhbSB7Q29tcG9uZW50fSBjb21wXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfYWRkQ29tcG9uZW50QXQ6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoY29tcCwgaW5kZXgpIHtcbiAgICAgICAgaWYgKHRoaXMuX29iakZsYWdzICYgRGVzdHJveWluZykge1xuICAgICAgICAgICAgcmV0dXJuIGNjLmVycm9yKCdpc0Rlc3Ryb3lpbmcnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIShjb21wIGluc3RhbmNlb2YgY2MuQ29tcG9uZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuIGNjLmVycm9ySUQoMzgxMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluZGV4ID4gdGhpcy5fY29tcG9uZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBjYy5lcnJvcklEKDM4MTIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVjaGVjayBhdHRyaWJ1dGVzIGJlY2F1c2Ugc2NyaXB0IG1heSBjaGFuZ2VkXG4gICAgICAgIHZhciBjdG9yID0gY29tcC5jb25zdHJ1Y3RvcjtcbiAgICAgICAgaWYgKGN0b3IuX2Rpc2FsbG93TXVsdGlwbGUpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fY2hlY2tNdWx0aXBsZUNvbXAoY3RvcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIFJlcUNvbXAgPSBjdG9yLl9yZXF1aXJlQ29tcG9uZW50O1xuICAgICAgICBpZiAoUmVxQ29tcCAmJiAhdGhpcy5nZXRDb21wb25lbnQoUmVxQ29tcCkpIHtcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gdGhpcy5fY29tcG9uZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBjb21wIHNob3VsZCBiZSBsYXN0IGNvbXBvbmVudCwgaW5jcmVhc2UgdGhlIGluZGV4IGJlY2F1c2UgcmVxdWlyZWQgY29tcG9uZW50IGFkZGVkXG4gICAgICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBkZXBlbmRlZCA9IHRoaXMuYWRkQ29tcG9uZW50KFJlcUNvbXApO1xuICAgICAgICAgICAgaWYgKCFkZXBlbmRlZCkge1xuICAgICAgICAgICAgICAgIC8vIGRlcGVuZCBjb25mbGljdHNcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbXAubm9kZSA9IHRoaXM7XG4gICAgICAgIHRoaXMuX2NvbXBvbmVudHMuc3BsaWNlKGluZGV4LCAwLCBjb21wKTtcbiAgICAgICAgaWYgKChDQ19FRElUT1IgfHwgQ0NfVEVTVCkgJiYgY2MuZW5naW5lICYmICh0aGlzLl9pZCBpbiBjYy5lbmdpbmUuYXR0YWNoZWRPYmpzRm9yRWRpdG9yKSkge1xuICAgICAgICAgICAgY2MuZW5naW5lLmF0dGFjaGVkT2Jqc0ZvckVkaXRvcltjb21wLl9pZF0gPSBjb21wO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9hY3RpdmVJbkhpZXJhcmNoeSkge1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IuX25vZGVBY3RpdmF0b3IuYWN0aXZhdGVDb21wKGNvbXApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZW1vdmVzIGEgY29tcG9uZW50IGlkZW50aWZpZWQgYnkgdGhlIGdpdmVuIG5hbWUgb3IgcmVtb3ZlcyB0aGUgY29tcG9uZW50IG9iamVjdCBnaXZlbi5cbiAgICAgKiBZb3UgY2FuIGFsc28gdXNlIGNvbXBvbmVudC5kZXN0cm95KCkgaWYgeW91IGFscmVhZHkgaGF2ZSB0aGUgcmVmZXJlbmNlLlxuICAgICAqICEjemhcbiAgICAgKiDliKDpmaToioLngrnkuIrnmoTmjIflrprnu4Tku7bvvIzkvKDlhaXlj4LmlbDlj6/ku6XmmK/kuIDkuKrnu4Tku7bmnoTpgKDlh73mlbDmiJbnu4Tku7blkI3vvIzkuZ/lj6/ku6XmmK/lt7Lnu4/ojrflvpfnmoTnu4Tku7blvJXnlKjjgIJcbiAgICAgKiDlpoLmnpzkvaDlt7Lnu4/ojrflvpfnu4Tku7blvJXnlKjvvIzkvaDkuZ/lj6/ku6Xnm7TmjqXosIPnlKggY29tcG9uZW50LmRlc3Ryb3koKVxuICAgICAqIEBtZXRob2QgcmVtb3ZlQ29tcG9uZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd8RnVuY3Rpb258Q29tcG9uZW50fSBjb21wb25lbnQgLSBUaGUgbmVlZCByZW1vdmUgY29tcG9uZW50LlxuICAgICAqIEBkZXByZWNhdGVkIHBsZWFzZSBkZXN0cm95IHRoZSBjb21wb25lbnQgdG8gcmVtb3ZlIGl0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICogbm9kZS5yZW1vdmVDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgKiB2YXIgVGVzdCA9IHJlcXVpcmUoXCJUZXN0XCIpO1xuICAgICAqIG5vZGUucmVtb3ZlQ29tcG9uZW50KFRlc3QpO1xuICAgICAqL1xuICAgIHJlbW92ZUNvbXBvbmVudCAoY29tcG9uZW50KSB7XG4gICAgICAgIGlmICghY29tcG9uZW50KSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDM4MTMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKGNvbXBvbmVudCBpbnN0YW5jZW9mIGNjLkNvbXBvbmVudCkpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudCA9IHRoaXMuZ2V0Q29tcG9uZW50KGNvbXBvbmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgICAgICAgY29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIF9nZXREZXBlbmRDb21wb25lbnRcbiAgICAgKiBAcGFyYW0ge0NvbXBvbmVudH0gZGVwZW5kZWRcbiAgICAgKiBAcmV0dXJuIHtDb21wb25lbnR9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0RGVwZW5kQ29tcG9uZW50OiBDQ19FRElUT1IgJiYgZnVuY3Rpb24gKGRlcGVuZGVkKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNvbXAgPSB0aGlzLl9jb21wb25lbnRzW2ldO1xuICAgICAgICAgICAgaWYgKGNvbXAgIT09IGRlcGVuZGVkICYmIGNvbXAuaXNWYWxpZCAmJiAhY2MuT2JqZWN0Ll93aWxsRGVzdHJveShjb21wKSkge1xuICAgICAgICAgICAgICAgIHZhciBkZXBlbmQgPSBjb21wLmNvbnN0cnVjdG9yLl9yZXF1aXJlQ29tcG9uZW50O1xuICAgICAgICAgICAgICAgIGlmIChkZXBlbmQgJiYgZGVwZW5kZWQgaW5zdGFuY2VvZiBkZXBlbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICAvLyBkbyByZW1vdmUgY29tcG9uZW50LCBvbmx5IHVzZWQgaW50ZXJuYWxseVxuICAgIF9yZW1vdmVDb21wb25lbnQgKGNvbXBvbmVudCkge1xuICAgICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgzODE0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghKHRoaXMuX29iakZsYWdzICYgRGVzdHJveWluZykpIHtcbiAgICAgICAgICAgIHZhciBpID0gdGhpcy5fY29tcG9uZW50cy5pbmRleE9mKGNvbXBvbmVudCk7XG4gICAgICAgICAgICBpZiAoaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb21wb25lbnRzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBpZiAoKENDX0VESVRPUiB8fCBDQ19URVNUKSAmJiBjYy5lbmdpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNjLmVuZ2luZS5hdHRhY2hlZE9ianNGb3JFZGl0b3JbY29tcG9uZW50Ll9pZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29tcG9uZW50Lm5vZGUgIT09IHRoaXMpIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDM4MTUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRlc3Ryb3kgKCkge1xuICAgICAgICBpZiAoY2MuT2JqZWN0LnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcykpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIERlc3Ryb3kgYWxsIGNoaWxkcmVuIGZyb20gdGhlIG5vZGUsIGFuZCByZWxlYXNlIGFsbCB0aGVpciBvd24gcmVmZXJlbmNlcyB0byBvdGhlciBvYmplY3RzLjxici8+XG4gICAgICogQWN0dWFsIGRlc3RydWN0IG9wZXJhdGlvbiB3aWxsIGRlbGF5ZWQgdW50aWwgYmVmb3JlIHJlbmRlcmluZy5cbiAgICAgKiAhI3poXG4gICAgICog6ZSA5q+B5omA5pyJ5a2Q6IqC54K577yM5bm26YeK5pS+5omA5pyJ5a6D5Lus5a+55YW25a6D5a+56LGh55qE5byV55So44CCPGJyLz5cbiAgICAgKiDlrp7pmYXplIDmr4Hmk43kvZzkvJrlu7bov5/liLDlvZPliY3luKfmuLLmn5PliY3miafooYzjgIJcbiAgICAgKiBAbWV0aG9kIGRlc3Ryb3lBbGxDaGlsZHJlblxuICAgICAqIEBleGFtcGxlXG4gICAgICogbm9kZS5kZXN0cm95QWxsQ2hpbGRyZW4oKTtcbiAgICAgKi9cbiAgICBkZXN0cm95QWxsQ2hpbGRyZW4gKCkge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY2hpbGRyZW5baV0uZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9vblNldFBhcmVudCAodmFsdWUpIHt9LFxuICAgIF9vblBvc3RBY3RpdmF0ZWQgKCkge30sXG4gICAgX29uQmF0Y2hDcmVhdGVkIChkb250U3luY0NoaWxkUHJlZmFiKSB7fSxcblxuICAgIF9vbkhpZXJhcmNoeUNoYW5nZWQgKG9sZFBhcmVudCkge1xuICAgICAgICB2YXIgbmV3UGFyZW50ID0gdGhpcy5fcGFyZW50O1xuICAgICAgICBpZiAodGhpcy5fcGVyc2lzdE5vZGUgJiYgIShuZXdQYXJlbnQgaW5zdGFuY2VvZiBjYy5TY2VuZSkpIHtcbiAgICAgICAgICAgIGNjLmdhbWUucmVtb3ZlUGVyc2lzdFJvb3ROb2RlKHRoaXMpO1xuICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCgxNjIzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChDQ19FRElUT1IgfHwgQ0NfVEVTVCkge1xuICAgICAgICAgICAgdmFyIHNjZW5lID0gY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKTtcbiAgICAgICAgICAgIHZhciBpbkN1cnJlbnRTY2VuZUJlZm9yZSA9IG9sZFBhcmVudCAmJiBvbGRQYXJlbnQuaXNDaGlsZE9mKHNjZW5lKTtcbiAgICAgICAgICAgIHZhciBpbkN1cnJlbnRTY2VuZU5vdyA9IG5ld1BhcmVudCAmJiBuZXdQYXJlbnQuaXNDaGlsZE9mKHNjZW5lKTtcbiAgICAgICAgICAgIGlmICghaW5DdXJyZW50U2NlbmVCZWZvcmUgJiYgaW5DdXJyZW50U2NlbmVOb3cpIHtcbiAgICAgICAgICAgICAgICAvLyBhdHRhY2hlZFxuICAgICAgICAgICAgICAgIHRoaXMuX3JlZ2lzdGVySWZBdHRhY2hlZCh0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGluQ3VycmVudFNjZW5lQmVmb3JlICYmICFpbkN1cnJlbnRTY2VuZU5vdykge1xuICAgICAgICAgICAgICAgIC8vIGRldGFjaGVkXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaXN0ZXJJZkF0dGFjaGVkKGZhbHNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdXBkYXRlIHByZWZhYlxuICAgICAgICAgICAgdmFyIG5ld1ByZWZhYlJvb3QgPSBuZXdQYXJlbnQgJiYgbmV3UGFyZW50Ll9wcmVmYWIgJiYgbmV3UGFyZW50Ll9wcmVmYWIucm9vdDtcbiAgICAgICAgICAgIHZhciBteVByZWZhYkluZm8gPSB0aGlzLl9wcmVmYWI7XG4gICAgICAgICAgICB2YXIgUHJlZmFiVXRpbHMgPSBFZGl0b3IucmVxdWlyZSgnc2NlbmU6Ly91dGlscy9wcmVmYWInKTtcbiAgICAgICAgICAgIGlmIChteVByZWZhYkluZm8pIHtcbiAgICAgICAgICAgICAgICBpZiAobmV3UHJlZmFiUm9vdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobXlQcmVmYWJJbmZvLnJvb3QgIT09IG5ld1ByZWZhYlJvb3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChteVByZWZhYkluZm8ucm9vdCA9PT0gdGhpcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5lc3QgcHJlZmFiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXlQcmVmYWJJbmZvLmZpbGVJZCB8fCAobXlQcmVmYWJJbmZvLmZpbGVJZCA9IEVkaXRvci5VdGlscy5VdWlkVXRpbHMudXVpZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQcmVmYWJVdGlscy5jaGVja0NpcmN1bGFyUmVmZXJlbmNlKG15UHJlZmFiSW5mby5yb290KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoYW5nZSBwcmVmYWJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQcmVmYWJVdGlscy5saW5rUHJlZmFiKG5ld1ByZWZhYlJvb3QuX3ByZWZhYi5hc3NldCwgbmV3UHJlZmFiUm9vdCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUHJlZmFiVXRpbHMuY2hlY2tDaXJjdWxhclJlZmVyZW5jZShuZXdQcmVmYWJSb290KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChteVByZWZhYkluZm8ucm9vdCA9PT0gdGhpcykge1xuICAgICAgICAgICAgICAgICAgICAvLyBuZXN0ZWQgcHJlZmFiIHRvIHJvb3QgcHJlZmFiXG4gICAgICAgICAgICAgICAgICAgIG15UHJlZmFiSW5mby5maWxlSWQgPSAnJzsgICAvLyByb290IHByZWZhYiBkb2Vzbid0IGhhdmUgZmlsZUlkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBkZXRhY2ggZnJvbSBwcmVmYWJcbiAgICAgICAgICAgICAgICAgICAgUHJlZmFiVXRpbHMudW5saW5rUHJlZmFiKHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG5ld1ByZWZhYlJvb3QpIHtcbiAgICAgICAgICAgICAgICAvLyBhdHRhY2ggdG8gcHJlZmFiXG4gICAgICAgICAgICAgICAgUHJlZmFiVXRpbHMubGlua1ByZWZhYihuZXdQcmVmYWJSb290Ll9wcmVmYWIuYXNzZXQsIG5ld1ByZWZhYlJvb3QsIHRoaXMpO1xuICAgICAgICAgICAgICAgIFByZWZhYlV0aWxzLmNoZWNrQ2lyY3VsYXJSZWZlcmVuY2UobmV3UHJlZmFiUm9vdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNvbmZsaWN0IGRldGVjdGlvblxuICAgICAgICAgICAgX1NjZW5lLkRldGVjdENvbmZsaWN0LmFmdGVyQWRkQ2hpbGQodGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2hvdWxkQWN0aXZlTm93ID0gdGhpcy5fYWN0aXZlICYmICEhKG5ld1BhcmVudCAmJiBuZXdQYXJlbnQuX2FjdGl2ZUluSGllcmFyY2h5KTtcbiAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZUluSGllcmFyY2h5ICE9PSBzaG91bGRBY3RpdmVOb3cpIHtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLl9ub2RlQWN0aXZhdG9yLmFjdGl2YXRlTm9kZSh0aGlzLCBzaG91bGRBY3RpdmVOb3cpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9pbnN0YW50aWF0ZSAoY2xvbmVkLCBpc1N5bmNlZE5vZGUpIHtcbiAgICAgICAgaWYgKCFjbG9uZWQpIHtcbiAgICAgICAgICAgIGNsb25lZCA9IGNjLmluc3RhbnRpYXRlLl9jbG9uZSh0aGlzLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBuZXdQcmVmYWJJbmZvID0gY2xvbmVkLl9wcmVmYWI7XG4gICAgICAgIGlmIChDQ19FRElUT1IgJiYgbmV3UHJlZmFiSW5mbykge1xuICAgICAgICAgICAgaWYgKGNsb25lZCA9PT0gbmV3UHJlZmFiSW5mby5yb290KSB7XG4gICAgICAgICAgICAgICAgbmV3UHJlZmFiSW5mby5maWxlSWQgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBQcmVmYWJVdGlscyA9IEVkaXRvci5yZXF1aXJlKCdzY2VuZTovL3V0aWxzL3ByZWZhYicpO1xuICAgICAgICAgICAgICAgIFByZWZhYlV0aWxzLnVubGlua1ByZWZhYihjbG9uZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChDQ19FRElUT1IgJiYgY2MuZW5naW5lLl9pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgIGxldCBzeW5jaW5nID0gbmV3UHJlZmFiSW5mbyAmJiBjbG9uZWQgPT09IG5ld1ByZWZhYkluZm8ucm9vdCAmJiBuZXdQcmVmYWJJbmZvLnN5bmM7XG4gICAgICAgICAgICBpZiAoIXN5bmNpbmcpIHtcbiAgICAgICAgICAgICAgICBjbG9uZWQuX25hbWUgKz0gJyAoQ2xvbmUpJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlc2V0IGFuZCBpbml0XG4gICAgICAgIGNsb25lZC5fcGFyZW50ID0gbnVsbDtcbiAgICAgICAgY2xvbmVkLl9vbkJhdGNoQ3JlYXRlZChpc1N5bmNlZE5vZGUpO1xuXG4gICAgICAgIHJldHVybiBjbG9uZWQ7XG4gICAgfSxcblxuICAgIF9yZWdpc3RlcklmQXR0YWNoZWQ6IChDQ19FRElUT1IgfHwgQ0NfVEVTVCkgJiYgZnVuY3Rpb24gKHJlZ2lzdGVyKSB7XG4gICAgICAgIHZhciBhdHRhY2hlZE9ianNGb3JFZGl0b3IgPSBjYy5lbmdpbmUuYXR0YWNoZWRPYmpzRm9yRWRpdG9yO1xuICAgICAgICBpZiAocmVnaXN0ZXIpIHtcbiAgICAgICAgICAgIGF0dGFjaGVkT2Jqc0ZvckVkaXRvclt0aGlzLl9pZF0gPSB0aGlzO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9jb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvbXAgPSB0aGlzLl9jb21wb25lbnRzW2ldO1xuICAgICAgICAgICAgICAgIGF0dGFjaGVkT2Jqc0ZvckVkaXRvcltjb21wLl9pZF0gPSBjb21wO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2MuZW5naW5lLmVtaXQoJ25vZGUtYXR0YWNoLXRvLXNjZW5lJywgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjYy5lbmdpbmUuZW1pdCgnbm9kZS1kZXRhY2gtZnJvbS1zY2VuZScsIHRoaXMpO1xuICAgICAgICAgICAgZGVsZXRlIGF0dGFjaGVkT2Jqc0ZvckVkaXRvclt0aGlzLl9pZF07XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2NvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY29tcCA9IHRoaXMuX2NvbXBvbmVudHNbaV07XG4gICAgICAgICAgICAgICAgZGVsZXRlIGF0dGFjaGVkT2Jqc0ZvckVkaXRvcltjb21wLl9pZF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW47XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICAgICAgICBjaGlsZC5fcmVnaXN0ZXJJZkF0dGFjaGVkKHJlZ2lzdGVyKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfb25QcmVEZXN0cm95ICgpIHtcbiAgICAgICAgdmFyIGksIGxlbjtcblxuICAgICAgICAvLyBtYXJrZWQgYXMgZGVzdHJveWluZ1xuICAgICAgICB0aGlzLl9vYmpGbGFncyB8PSBEZXN0cm95aW5nO1xuXG4gICAgICAgIC8vIGRldGFjaCBzZWxmIGFuZCBjaGlsZHJlbiBmcm9tIGVkaXRvclxuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5fcGFyZW50O1xuICAgICAgICB2YXIgZGVzdHJveUJ5UGFyZW50ID0gcGFyZW50ICYmIChwYXJlbnQuX29iakZsYWdzICYgRGVzdHJveWluZyk7XG4gICAgICAgIGlmICghZGVzdHJveUJ5UGFyZW50ICYmIChDQ19FRElUT1IgfHwgQ0NfVEVTVCkpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlZ2lzdGVySWZBdHRhY2hlZChmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkZXN0cm95IGNoaWxkcmVuXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICAgICAgLy8gZGVzdHJveSBpbW1lZGlhdGUgc28gaXRzIF9vblByZURlc3Ryb3kgY2FuIGJlIGNhbGxlZFxuICAgICAgICAgICAgY2hpbGRyZW5baV0uX2Rlc3Ryb3lJbW1lZGlhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRlc3Ryb3kgc2VsZiBjb21wb25lbnRzXG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHRoaXMuX2NvbXBvbmVudHMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBjb21wb25lbnQgPSB0aGlzLl9jb21wb25lbnRzW2ldO1xuICAgICAgICAgICAgLy8gZGVzdHJveSBpbW1lZGlhdGUgc28gaXRzIF9vblByZURlc3Ryb3kgY2FuIGJlIGNhbGxlZFxuICAgICAgICAgICAgY29tcG9uZW50Ll9kZXN0cm95SW1tZWRpYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZXZlbnRUYXJnZXRzID0gdGhpcy5fX2V2ZW50VGFyZ2V0cztcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gZXZlbnRUYXJnZXRzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZXZlbnRUYXJnZXRzW2ldO1xuICAgICAgICAgICAgdGFyZ2V0ICYmIHRhcmdldC50YXJnZXRPZmYodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnRUYXJnZXRzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGZyb20gcGVyc2lzdFxuICAgICAgICBpZiAodGhpcy5fcGVyc2lzdE5vZGUpIHtcbiAgICAgICAgICAgIGNjLmdhbWUucmVtb3ZlUGVyc2lzdFJvb3ROb2RlKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFkZXN0cm95QnlQYXJlbnQpIHtcbiAgICAgICAgICAgIC8vIHJlbW92ZSBmcm9tIHBhcmVudFxuICAgICAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZEluZGV4ID0gcGFyZW50Ll9jaGlsZHJlbi5pbmRleE9mKHRoaXMpO1xuICAgICAgICAgICAgICAgIHBhcmVudC5fY2hpbGRyZW4uc3BsaWNlKGNoaWxkSW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIHBhcmVudC5lbWl0ICYmIHBhcmVudC5lbWl0KCdjaGlsZC1yZW1vdmVkJywgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVzdHJveUJ5UGFyZW50O1xuICAgIH0sXG5cbiAgICBvblJlc3RvcmU6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGNoZWNrIGFjdGl2aXR5IHN0YXRlXG4gICAgICAgIHZhciBzaG91bGRBY3RpdmVOb3cgPSB0aGlzLl9hY3RpdmUgJiYgISEodGhpcy5fcGFyZW50ICYmIHRoaXMuX3BhcmVudC5fYWN0aXZlSW5IaWVyYXJjaHkpO1xuICAgICAgICBpZiAodGhpcy5fYWN0aXZlSW5IaWVyYXJjaHkgIT09IHNob3VsZEFjdGl2ZU5vdykge1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IuX25vZGVBY3RpdmF0b3IuYWN0aXZhdGVOb2RlKHRoaXMsIHNob3VsZEFjdGl2ZU5vdyk7XG4gICAgICAgIH1cbiAgICB9LFxufSk7XG5cbkJhc2VOb2RlLmlkR2VuZXJhdGVyID0gaWRHZW5lcmF0ZXI7XG5cbi8vIEZvciB3YWxrXG5CYXNlTm9kZS5fc3RhY2tzID0gW1tdXTtcbkJhc2VOb2RlLl9zdGFja0lkID0gMDtcblxuQmFzZU5vZGUucHJvdG90eXBlLl9vblByZURlc3Ryb3lCYXNlID0gQmFzZU5vZGUucHJvdG90eXBlLl9vblByZURlc3Ryb3k7XG5pZiAoQ0NfRURJVE9SKSB7XG4gICAgQmFzZU5vZGUucHJvdG90eXBlLl9vblByZURlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgdmFyIGRlc3Ryb3lCeVBhcmVudCA9IHRoaXMuX29uUHJlRGVzdHJveUJhc2UoKTtcbiAgICAgICBpZiAoIWRlc3Ryb3lCeVBhcmVudCkge1xuICAgICAgICAgICAvLyBlbnN1cmUgdGhpcyBub2RlIGNhbiByZWF0dGFjaCB0byBzY2VuZSBieSB1bmRvIHN5c3RlbVxuICAgICAgICAgICAvLyAoc2ltdWxhdGUgc29tZSBkZXN0cnVjdCBsb2dpYyB0byBtYWtlIHVuZG8gc3lzdGVtIHdvcmsgY29ycmVjdGx5KVxuICAgICAgICAgICB0aGlzLl9wYXJlbnQgPSBudWxsO1xuICAgICAgIH1cbiAgICAgICByZXR1cm4gZGVzdHJveUJ5UGFyZW50O1xuICAgfTtcbn1cblxuQmFzZU5vZGUucHJvdG90eXBlLl9vbkhpZXJhcmNoeUNoYW5nZWRCYXNlID0gQmFzZU5vZGUucHJvdG90eXBlLl9vbkhpZXJhcmNoeUNoYW5nZWQ7XG5cbmlmKENDX0VESVRPUikge1xuICAgIEJhc2VOb2RlLnByb3RvdHlwZS5fb25SZXN0b3JlQmFzZSA9IEJhc2VOb2RlLnByb3RvdHlwZS5vblJlc3RvcmU7XG59XG5cbi8vIERlZmluZSBwdWJsaWMgZ2V0dGVyIGFuZCBzZXR0ZXIgbWV0aG9kcyB0byBlbnN1cmUgYXBpIGNvbXBhdGliaWxpdHkuXG52YXIgU2FtZU5hbWVHZXRTZXRzID0gWydwYXJlbnQnLCAnbmFtZScsICdjaGlsZHJlbicsICdjaGlsZHJlbkNvdW50JyxdO1xubWlzYy5wcm9wZXJ0eURlZmluZShCYXNlTm9kZSwgU2FtZU5hbWVHZXRTZXRzLCB7fSk7XG5cbmlmIChDQ19ERVYpIHtcbiAgICAvLyBwcm9tb3RlIGRlYnVnIGluZm9cbiAgICBqcy5nZXQoQmFzZU5vZGUucHJvdG90eXBlLCAnIElORk8gJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcGF0aCA9ICcnO1xuICAgICAgICB2YXIgbm9kZSA9IHRoaXM7XG4gICAgICAgIHdoaWxlIChub2RlICYmICEobm9kZSBpbnN0YW5jZW9mIGNjLlNjZW5lKSkge1xuICAgICAgICAgICAgaWYgKHBhdGgpIHtcbiAgICAgICAgICAgICAgICBwYXRoID0gbm9kZS5uYW1lICsgJy8nICsgcGF0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhdGggPSBub2RlLm5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub2RlID0gbm9kZS5fcGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWUgKyAnLCBwYXRoOiAnICsgcGF0aDtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiAhI2VuXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIG9ubHkgZW1pdHRlZCBmcm9tIHRoZSB0b3AgbW9zdCBub2RlIHdob3NlIGFjdGl2ZSB2YWx1ZSBkaWQgY2hhbmdlZCxcbiAqIG5vdCBpbmNsdWRpbmcgaXRzIGNoaWxkIG5vZGVzLlxuICogISN6aFxuICog5rOo5oSP77ya5q2k6IqC54K55r+A5rS75pe277yM5q2k5LqL5Lu25LuF5LuO5pyA6aG26YOo55qE6IqC54K55Y+R5Ye644CCXG4gKiBAZXZlbnQgYWN0aXZlLWluLWhpZXJhcmNoeS1jaGFuZ2VkXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxuICovXG5cbmNjLl9CYXNlTm9kZSA9IG1vZHVsZS5leHBvcnRzID0gQmFzZU5vZGU7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==