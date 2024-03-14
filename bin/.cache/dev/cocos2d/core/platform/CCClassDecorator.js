
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCClassDecorator.js';
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
// const FIX_BABEL6 = true;

/**
 * !#en Some JavaScript decorators which can be accessed with "cc._decorator".
 * !#zh 一些 JavaScript 装饰器，目前可以通过 "cc._decorator" 来访问。
 * （这些 API 仍不完全稳定，有可能随着 JavaScript 装饰器的标准实现而调整）
 *
 * @submodule _decorator
 * @module _decorator
 * @main
 */
// inspired by toddlxt (https://github.com/toddlxt/Creator-TypeScript-Boilerplate)
require('./CCClass');

var Preprocess = require('./preprocess-class');

var js = require('./js');

var isPlainEmptyObj_DEV = CC_DEV && require('./utils').isPlainEmptyObj_DEV; // caches for class construction


var CACHE_KEY = '__ccclassCache__';

function fNOP(ctor) {
  return ctor;
}

function getSubDict(obj, key) {
  return obj[key] || (obj[key] = {});
}

function checkCtorArgument(decorate) {
  return function (target) {
    if (typeof target === 'function') {
      // no parameter, target is ctor
      return decorate(target);
    }

    return function (ctor) {
      return decorate(ctor, target);
    };
  };
}

function _checkNormalArgument(validator_DEV, decorate, decoratorName) {
  return function (target) {
    if (CC_DEV && validator_DEV(target, decoratorName) === false) {
      return function () {
        return fNOP;
      };
    }

    return function (ctor) {
      return decorate(ctor, target);
    };
  };
}

var checkCompArgument = _checkNormalArgument.bind(null, CC_DEV && function (arg, decoratorName) {
  if (!cc.Class._isCCClass(arg)) {
    cc.error('The parameter for %s is missing.', decoratorName);
    return false;
  }
});

function _argumentChecker(type) {
  return _checkNormalArgument.bind(null, CC_DEV && function (arg, decoratorName) {
    if (arg instanceof cc.Component || arg === undefined) {
      cc.error('The parameter for %s is missing.', decoratorName);
      return false;
    } else if (typeof arg !== type) {
      cc.error('The parameter for %s must be type %s.', decoratorName, type);
      return false;
    }
  });
}

var checkStringArgument = _argumentChecker('string');

var checkNumberArgument = _argumentChecker('number'); // var checkBooleanArgument = _argumentChecker('boolean');


function getClassCache(ctor, decoratorName) {
  if (CC_DEV && cc.Class._isCCClass(ctor)) {
    cc.error('`@%s` should be used after @ccclass for class "%s"', decoratorName, js.getClassName(ctor));
    return null;
  }

  return getSubDict(ctor, CACHE_KEY);
}

function getDefaultFromInitializer(initializer) {
  var value;

  try {
    value = initializer();
  } catch (e) {
    // just lazy initialize by CCClass
    return initializer;
  }

  if (typeof value !== 'object' || value === null) {
    // string boolean number function undefined null
    return value;
  } else {
    // The default attribute will not be used in ES6 constructor actually,
    // so we dont need to simplify into `{}` or `[]` or vec2 completely.
    return initializer;
  }
}

function extractActualDefaultValues(ctor) {
  var dummyObj;

  try {
    dummyObj = new ctor();
  } catch (e) {
    if (CC_DEV) {
      cc.errorID(3652, js.getClassName(ctor), e);
    }

    return {};
  }

  return dummyObj;
}

function genProperty(ctor, properties, propName, options, desc, cache) {
  var fullOptions;
  var isGetset = desc && (desc.get || desc.set);

  if (options) {
    fullOptions = Preprocess.getFullFormOfProperty(options, isGetset);
  }

  var existsProperty = properties[propName];
  var prop = js.mixin(existsProperty || {}, fullOptions || options || {});

  if (isGetset) {
    // typescript or babel
    if (CC_DEV && options && ((fullOptions || options).get || (fullOptions || options).set)) {
      var errorProps = getSubDict(cache, 'errorProps');

      if (!errorProps[propName]) {
        errorProps[propName] = true;
        cc.warnID(3655, propName, js.getClassName(ctor), propName, propName);
      }
    }

    if (desc.get) {
      prop.get = desc.get;
    }

    if (desc.set) {
      prop.set = desc.set;
    }
  } else {
    if (CC_DEV && (prop.get || prop.set)) {
      // @property({
      //     get () { ... },
      //     set (...) { ... },
      // })
      // value;
      cc.errorID(3655, propName, js.getClassName(ctor), propName, propName);
      return;
    } // member variables


    var defaultValue = undefined;
    var isDefaultValueSpecified = false;

    if (desc) {
      // babel
      if (desc.initializer) {
        // @property(...)
        // value = null;
        defaultValue = getDefaultFromInitializer(desc.initializer);
        isDefaultValueSpecified = true;
      } else {// @property(...)
        // value;
      }
    } else {
      // typescript
      var actualDefaultValues = cache["default"] || (cache["default"] = extractActualDefaultValues(ctor));

      if (actualDefaultValues.hasOwnProperty(propName)) {
        // @property(...)
        // value = null;
        defaultValue = actualDefaultValues[propName];
        isDefaultValueSpecified = true;
      } else {// @property(...)
        // value;
      }
    }

    if (CC_EDITOR && !Editor.isBuilder || CC_TEST) {
      if (!fullOptions && options && options.hasOwnProperty('default')) {
        cc.warnID(3653, propName, js.getClassName(ctor)); // prop.default = options.default;
      } else if (!isDefaultValueSpecified) {
        cc.warnID(3654, js.getClassName(ctor), propName); // prop.default = fullOptions.hasOwnProperty('default') ? fullOptions.default : undefined;
      }
    }

    prop["default"] = defaultValue;
  }

  properties[propName] = prop;
}
/**
 * !#en
 * Declare the standard [ES6 Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
 * as CCClass, please see [Class](../../../manual/en/scripting/class.html) for details.
 * !#zh
 * 将标准写法的 [ES6 Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) 声明为 CCClass，具体用法请参阅[类型定义](../../../manual/zh/scripting/class.html)。
 *
 * @method ccclass
 * @param {String} [name] - The class name used for serialization.
 * @example
 * const {ccclass} = cc._decorator;
 *
 * // define a CCClass, omit the name
 * &#64;ccclass
 * class NewScript extends cc.Component {
 *     // ...
 * }
 *
 * // define a CCClass with a name
 * &#64;ccclass('LoginData')
 * class LoginData {
 *     // ...
 * }
 * @typescript
 * ccclass(name?: string): Function
 * ccclass(_class?: Function): void
 */


var ccclass = checkCtorArgument(function (ctor, name) {
  // if (FIX_BABEL6) {
  //     eval('if(typeof _classCallCheck==="function"){_classCallCheck=function(){};}');
  // }
  var base = js.getSuper(ctor);

  if (base === Object) {
    base = null;
  }

  var proto = {
    name: name,
    "extends": base,
    ctor: ctor,
    __ES6__: true
  };
  var cache = ctor[CACHE_KEY];

  if (cache) {
    var decoratedProto = cache.proto;

    if (decoratedProto) {
      // decoratedProto.properties = createProperties(ctor, decoratedProto.properties);
      js.mixin(proto, decoratedProto);
    }

    ctor[CACHE_KEY] = undefined;
  }

  var res = cc.Class(proto); // validate methods

  if (CC_DEV) {
    var propNames = Object.getOwnPropertyNames(ctor.prototype);

    for (var i = 0; i < propNames.length; ++i) {
      var prop = propNames[i];

      if (prop !== 'constructor') {
        var desc = Object.getOwnPropertyDescriptor(ctor.prototype, prop);
        var func = desc && desc.value;

        if (typeof func === 'function') {
          Preprocess.doValidateMethodWithProps_DEV(func, prop, js.getClassName(ctor), ctor, base);
        }
      }
    }
  }

  return res;
});
/**
 * !#en
 * Declare property for [CCClass](../../../manual/en/scripting/reference/attributes.html).
 * !#zh
 * 定义 [CCClass](../../../manual/zh/scripting/reference/attributes.html) 所用的属性。
 *
 * @method property
 * @param {Object} [options] - an object with some property attributes
 * @param {Any} [options.type]
 * @param {Boolean|Function} [options.visible]
 * @param {String} [options.displayName]
 * @param {String} [options.tooltip]
 * @param {Boolean} [options.multiline]
 * @param {Boolean} [options.readonly]
 * @param {Number} [options.min]
 * @param {Number} [options.max]
 * @param {Number} [options.step]
 * @param {Number[]} [options.range]
 * @param {Boolean} [options.slide]
 * @param {Boolean} [options.serializable]
 * @param {Boolean} [options.editorOnly]
 * @param {Boolean} [options.override]
 * @param {Boolean} [options.animatable]
 * @param {String} [options.formerlySerializedAs]
 * @example
 * const {ccclass, property} = cc._decorator;
 *
 * &#64;ccclass
 * class NewScript extends cc.Component {
 *     &#64;property({
 *         type: cc.Node
 *     })
 *     targetNode1 = null;
 *
 *     &#64;property(cc.Node)
 *     targetNode2 = null;
 *
 *     &#64;property(cc.Button)
 *     targetButton = null;
 *
 *     &#64;property
 *     _width = 100;
 *
 *     &#64;property
 *     get width () {
 *         return this._width;
 *     }
 *
 *     &#64;property
 *     set width (value) {
 *         this._width = value;
 *     }
 *
 *     &#64;property
 *     offset = new cc.Vec2(100, 100);
 *
 *     &#64;property(cc.Vec2)
 *     offsets = [];
 *
 *     &#64;property(cc.SpriteFrame)
 *     frame = null;
 * }
 *
 * // above is equivalent to (上面的代码相当于):
 *
 * var NewScript = cc.Class({
 *     properties: {
 *         targetNode1: {
 *             default: null,
 *             type: cc.Node
 *         },
 *
 *         targetNode2: {
 *             default: null,
 *             type: cc.Node
 *         },
 *
 *         targetButton: {
 *             default: null,
 *             type: cc.Button
 *         },
 *
 *         _width: 100,
 *
 *         width: {
 *             get () {
 *                 return this._width;
 *             },
 *             set (value) {
 *                 this._width = value;
 *             }
 *         },
 *
 *         offset: new cc.Vec2(100, 100)
 *
 *         offsets: {
 *             default: [],
 *             type: cc.Vec2
 *         }
 *
 *         frame: {
 *             default: null,
 *             type: cc.SpriteFrame
 *         },
 *     }
 * });
 * @typescript
 * property(options?: {type?: any; visible?: boolean|(() => boolean); displayName?: string; tooltip?: string; multiline?: boolean; readonly?: boolean; min?: number; max?: number; step?: number; range?: number[]; slide?: boolean; serializable?: boolean; formerlySerializedAs?: string; editorOnly?: boolean; override?: boolean; animatable?: boolean, userData?: Record<string, any> } | any[]|Function|cc.ValueType|number|string|boolean): Function
 * property(_target: Object, _key: any, _desc?: any): void
 */

function property(ctorProtoOrOptions, propName, desc) {
  var options = null;

  function normalized(ctorProto, propName, desc) {
    var cache = getClassCache(ctorProto.constructor);

    if (cache) {
      var ccclassProto = getSubDict(cache, 'proto');
      var properties = getSubDict(ccclassProto, 'properties');
      genProperty(ctorProto.constructor, properties, propName, options, desc, cache);
    }
  }

  if (typeof propName === 'undefined') {
    options = ctorProtoOrOptions;
    return normalized;
  } else {
    normalized(ctorProtoOrOptions, propName, desc);
  }
} // Editor Decorators


function createEditorDecorator(argCheckFunc, editorPropName, staticValue) {
  return argCheckFunc(function (ctor, decoratedValue) {
    var cache = getClassCache(ctor, editorPropName);

    if (cache) {
      var value = staticValue !== undefined ? staticValue : decoratedValue;
      var proto = getSubDict(cache, 'proto');
      getSubDict(proto, 'editor')[editorPropName] = value;
    }
  }, editorPropName);
}

function createDummyDecorator(argCheckFunc) {
  return argCheckFunc(fNOP);
}
/**
 * !#en
 * Makes a CCClass that inherit from component execute in edit mode.<br>
 * By default, all components are only executed in play mode,
 * which means they will not have their callback functions executed while the Editor is in edit mode.
 * !#zh
 * 允许继承自 Component 的 CCClass 在编辑器里执行。<br>
 * 默认情况下，所有 Component 都只会在运行时才会执行，也就是说它们的生命周期回调不会在编辑器里触发。
 *
 * @method executeInEditMode
 * @example
 * const {ccclass, executeInEditMode} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;executeInEditMode
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * @typescript
 * executeInEditMode(): Function
 * executeInEditMode(_class: Function): void
 */


var executeInEditMode = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkCtorArgument, 'executeInEditMode', true);
/**
 * !#en
 * Automatically add required component as a dependency for the CCClass that inherit from component.
 * !#zh
 * 为声明为 CCClass 的组件添加依赖的其它组件。当组件添加到节点上时，如果依赖的组件不存在，引擎将会自动将依赖组件添加到同一个节点，防止脚本出错。该设置在运行时同样有效。
 *
 * @method requireComponent
 * @param {Component} requiredComponent
 * @example
 * const {ccclass, requireComponent} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;requireComponent(cc.Sprite)
 * class SpriteCtrl extends cc.Component {
 *     // ...
 * }
 * @typescript
 * requireComponent(requiredComponent: typeof cc.Component): Function
 */

var requireComponent = createEditorDecorator(checkCompArgument, 'requireComponent');
/**
 * !#en
 * The menu path to register a component to the editors "Component" menu. Eg. "Rendering/CameraCtrl".
 * !#zh
 * 将当前组件添加到组件菜单中，方便用户查找。例如 "Rendering/CameraCtrl"。
 *
 * @method menu
 * @param {String} path - The path is the menu represented like a pathname.
 *                        For example the menu could be "Rendering/CameraCtrl".
 * @example
 * const {ccclass, menu} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;menu("Rendering/CameraCtrl")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * @typescript
 * menu(path: string): Function
 */

var menu = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'menu');
/**
 * !#en
 * The execution order of lifecycle methods for Component.
 * Those less than 0 will execute before while those greater than 0 will execute after.
 * The order will only affect onLoad, onEnable, start, update and lateUpdate while onDisable and onDestroy will not be affected.
 * !#zh
 * 设置脚本生命周期方法调用的优先级。优先级小于 0 的组件将会优先执行，优先级大于 0 的组件将会延后执行。优先级仅会影响 onLoad, onEnable, start, update 和 lateUpdate，而 onDisable 和 onDestroy 不受影响。
 *
 * @method executionOrder
 * @param {Number} order - The execution order of lifecycle methods for Component. Those less than 0 will execute before while those greater than 0 will execute after.
 * @example
 * const {ccclass, executionOrder} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;executionOrder(1)
 * class CameraCtrl extends cc.Component {
 *     // ...
 * }
 * @typescript
 * executionOrder(order: number): Function
 */

var executionOrder = createEditorDecorator(checkNumberArgument, 'executionOrder');
/**
 * !#en
 * Prevents Component of the same type (or subtype) to be added more than once to a Node.
 * !#zh
 * 防止多个相同类型（或子类型）的组件被添加到同一个节点。
 *
 * @method disallowMultiple
 * @example
 * const {ccclass, disallowMultiple} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;disallowMultiple
 * class CameraCtrl extends cc.Component {
 *     // ...
 * }
 * @typescript
 * disallowMultiple(): Function
 * disallowMultiple(_class: Function): void
 */

var disallowMultiple = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkCtorArgument, 'disallowMultiple');
/**
 * !#en
 * If specified, the editor's scene view will keep updating this node in 60 fps when it is selected, otherwise, it will update only if necessary.<br>
 * This property is only available if executeInEditMode is true.
 * !#zh
 * 当指定了 "executeInEditMode" 以后，playOnFocus 可以在选中当前组件所在的节点时，提高编辑器的场景刷新频率到 60 FPS，否则场景就只会在必要的时候进行重绘。
 *
 * @method playOnFocus
 * @example
 * const {ccclass, playOnFocus, executeInEditMode} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;executeInEditMode
 * &#64;playOnFocus
 * class CameraCtrl extends cc.Component {
 *     // ...
 * }
 * @typescript
 * playOnFocus(): Function
 * playOnFocus(_class: Function): void
 */

var playOnFocus = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkCtorArgument, 'playOnFocus', true);
/**
 * !#en
 * Specifying the url of the custom html to draw the component in **Properties**.
 * !#zh
 * 自定义当前组件在 **属性检查器** 中渲染时所用的网页 url。
 *
 * @method inspector
 * @param {String} url
 * @example
 * const {ccclass, inspector} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;inspector("packages://inspector/inspectors/comps/camera-ctrl.js")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * @typescript
 * inspector(path: string): Function
 */

var inspector = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'inspector');
/**
 * !#en
 * Specifying the url of the icon to display in the editor.
 * !#zh
 * 自定义当前组件在编辑器中显示的图标 url。
 *
 * @method icon
 * @param {String} url
 * @private
 * @example
 * const {ccclass, icon} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;icon("xxxx.png")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * @typescript
 * icon(path: string): Function
 */

var icon = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'icon');
/**
 * !#en
 * The custom documentation URL.
 * !#zh
 * 指定当前组件的帮助文档的 url，设置过后，在 **属性检查器** 中就会出现一个帮助图标，用户点击将打开指定的网页。
 *
 * @method help
 * @param {String} url
 * @example
 * const {ccclass, help} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;help("app://docs/html/components/spine.html")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * @typescript
 * help(path: string): Function
 */

var help = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'help'); // Other Decorators

/**
 * NOTE:<br>
 * The old mixins implemented in cc.Class(ES5) behaves exact the same as multiple inheritance.
 * But since ES6, class constructor can't be function-called and class methods become non-enumerable,
 * so we can not mix in ES6 Classes.<br>
 * See:<br>
 * [https://esdiscuss.org/topic/traits-are-now-impossible-in-es6-until-es7-since-rev32](https://esdiscuss.org/topic/traits-are-now-impossible-in-es6-until-es7-since-rev32)<br>
 * One possible solution (but IDE unfriendly):<br>
 * [http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/)<br>
 * <br>
 * NOTE:<br>
 * You must manually call mixins constructor, this is different from cc.Class(ES5).
 *
 * @method mixins
 * @param {Function} ...ctor - constructors to mix, only support ES5 constructors or classes defined by using `cc.Class`,
 *                             not support ES6 Classes.
 * @example
 * const {ccclass, mixins} = cc._decorator;
 *
 * class Animal { ... }
 *
 * const Fly = cc.Class({
 *     constructor () { ... }
 * });
 *
 * &#64;ccclass
 * &#64;mixins(cc.EventTarget, Fly)
 * class Bird extends Animal {
 *     constructor () {
 *         super();
 *
 *         // You must manually call mixins constructor, this is different from cc.Class(ES5)
 *         cc.EventTarget.call(this);
 *         Fly.call(this);
 *     }
 *     // ...
 * }
 * @typescript
 * mixins(ctor: Function, ...rest: Function[]): Function
 */

function mixins() {
  var mixins = [];

  for (var i = 0; i < arguments.length; i++) {
    mixins[i] = arguments[i];
  }

  return function (ctor) {
    var cache = getClassCache(ctor, 'mixins');

    if (cache) {
      getSubDict(cache, 'proto').mixins = mixins;
    }
  };
}

cc._decorator = module.exports = {
  ccclass: ccclass,
  property: property,
  executeInEditMode: executeInEditMode,
  requireComponent: requireComponent,
  menu: menu,
  executionOrder: executionOrder,
  disallowMultiple: disallowMultiple,
  playOnFocus: playOnFocus,
  inspector: inspector,
  icon: icon,
  help: help,
  mixins: mixins
}; // fix submodule pollute ...

/**
 * @submodule cc
 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BsYXRmb3JtL0NDQ2xhc3NEZWNvcmF0b3IuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsIlByZXByb2Nlc3MiLCJqcyIsImlzUGxhaW5FbXB0eU9ial9ERVYiLCJDQ19ERVYiLCJDQUNIRV9LRVkiLCJmTk9QIiwiY3RvciIsImdldFN1YkRpY3QiLCJvYmoiLCJrZXkiLCJjaGVja0N0b3JBcmd1bWVudCIsImRlY29yYXRlIiwidGFyZ2V0IiwiX2NoZWNrTm9ybWFsQXJndW1lbnQiLCJ2YWxpZGF0b3JfREVWIiwiZGVjb3JhdG9yTmFtZSIsImNoZWNrQ29tcEFyZ3VtZW50IiwiYmluZCIsImFyZyIsImNjIiwiQ2xhc3MiLCJfaXNDQ0NsYXNzIiwiZXJyb3IiLCJfYXJndW1lbnRDaGVja2VyIiwidHlwZSIsIkNvbXBvbmVudCIsInVuZGVmaW5lZCIsImNoZWNrU3RyaW5nQXJndW1lbnQiLCJjaGVja051bWJlckFyZ3VtZW50IiwiZ2V0Q2xhc3NDYWNoZSIsImdldENsYXNzTmFtZSIsImdldERlZmF1bHRGcm9tSW5pdGlhbGl6ZXIiLCJpbml0aWFsaXplciIsInZhbHVlIiwiZSIsImV4dHJhY3RBY3R1YWxEZWZhdWx0VmFsdWVzIiwiZHVtbXlPYmoiLCJlcnJvcklEIiwiZ2VuUHJvcGVydHkiLCJwcm9wZXJ0aWVzIiwicHJvcE5hbWUiLCJvcHRpb25zIiwiZGVzYyIsImNhY2hlIiwiZnVsbE9wdGlvbnMiLCJpc0dldHNldCIsImdldCIsInNldCIsImdldEZ1bGxGb3JtT2ZQcm9wZXJ0eSIsImV4aXN0c1Byb3BlcnR5IiwicHJvcCIsIm1peGluIiwiZXJyb3JQcm9wcyIsIndhcm5JRCIsImRlZmF1bHRWYWx1ZSIsImlzRGVmYXVsdFZhbHVlU3BlY2lmaWVkIiwiYWN0dWFsRGVmYXVsdFZhbHVlcyIsImhhc093blByb3BlcnR5IiwiQ0NfRURJVE9SIiwiRWRpdG9yIiwiaXNCdWlsZGVyIiwiQ0NfVEVTVCIsImNjY2xhc3MiLCJuYW1lIiwiYmFzZSIsImdldFN1cGVyIiwiT2JqZWN0IiwicHJvdG8iLCJfX0VTNl9fIiwiZGVjb3JhdGVkUHJvdG8iLCJyZXMiLCJwcm9wTmFtZXMiLCJnZXRPd25Qcm9wZXJ0eU5hbWVzIiwicHJvdG90eXBlIiwiaSIsImxlbmd0aCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImZ1bmMiLCJkb1ZhbGlkYXRlTWV0aG9kV2l0aFByb3BzX0RFViIsInByb3BlcnR5IiwiY3RvclByb3RvT3JPcHRpb25zIiwibm9ybWFsaXplZCIsImN0b3JQcm90byIsImNvbnN0cnVjdG9yIiwiY2NjbGFzc1Byb3RvIiwiY3JlYXRlRWRpdG9yRGVjb3JhdG9yIiwiYXJnQ2hlY2tGdW5jIiwiZWRpdG9yUHJvcE5hbWUiLCJzdGF0aWNWYWx1ZSIsImRlY29yYXRlZFZhbHVlIiwiY3JlYXRlRHVtbXlEZWNvcmF0b3IiLCJleGVjdXRlSW5FZGl0TW9kZSIsInJlcXVpcmVDb21wb25lbnQiLCJtZW51IiwiZXhlY3V0aW9uT3JkZXIiLCJkaXNhbGxvd011bHRpcGxlIiwicGxheU9uRm9jdXMiLCJpbnNwZWN0b3IiLCJpY29uIiwiaGVscCIsIm1peGlucyIsImFyZ3VtZW50cyIsIl9kZWNvcmF0b3IiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBQSxPQUFPLENBQUMsV0FBRCxDQUFQOztBQUNBLElBQU1DLFVBQVUsR0FBR0QsT0FBTyxDQUFDLG9CQUFELENBQTFCOztBQUNBLElBQU1FLEVBQUUsR0FBR0YsT0FBTyxDQUFDLE1BQUQsQ0FBbEI7O0FBQ0Es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akMsRUFlQTs7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIGNvbnN0IEZJWF9CQUJFTDYgPSB0cnVlO1xuXG4vKipcbiAqICEjZW4gU29tZSBKYXZhU2NyaXB0IGRlY29yYXRvcnMgd2hpY2ggY2FuIGJlIGFjY2Vzc2VkIHdpdGggXCJjYy5fZGVjb3JhdG9yXCIuXG4gKiAhI3poIOS4gOS6myBKYXZhU2NyaXB0IOijhemlsOWZqO+8jOebruWJjeWPr+S7pemAmui/hyBcImNjLl9kZWNvcmF0b3JcIiDmnaXorr/pl67jgIJcbiAqIO+8iOi/meS6myBBUEkg5LuN5LiN5a6M5YWo56iz5a6a77yM5pyJ5Y+v6IO96ZqP552AIEphdmFTY3JpcHQg6KOF6aWw5Zmo55qE5qCH5YeG5a6e546w6ICM6LCD5pW077yJXG4gKlxuICogQHN1Ym1vZHVsZSBfZGVjb3JhdG9yXG4gKiBAbW9kdWxlIF9kZWNvcmF0b3JcbiAqIEBtYWluXG4gKi9cblxuLy8gaW5zcGlyZWQgYnkgdG9kZGx4dCAoaHR0cHM6Ly9naXRodWIuY29tL3RvZGRseHQvQ3JlYXRvci1UeXBlU2NyaXB0LUJvaWxlcnBsYXRlKVxuXG5yZXF1aXJlKCcuL0NDQ2xhc3MnKTtcbmNvbnN0IFByZXByb2Nlc3MgPSByZXF1aXJlKCcuL3ByZXByb2Nlc3MtY2xhc3MnKTtcbmNvbnN0IGpzID0gcmVxdWlyZSgnLi9qcycpO1xuY29uc3QgaXNQbGFpbkVtcHR5T2JqX0RFViA9IENDX0RFViAmJiByZXF1aXJlKCcuL3V0aWxzJykuaXNQbGFpbkVtcHR5T2JqX0RFVjtcblxuLy8gY2FjaGVzIGZvciBjbGFzcyBjb25zdHJ1Y3Rpb25cbmNvbnN0IENBQ0hFX0tFWSA9ICdfX2NjY2xhc3NDYWNoZV9fJztcblxuZnVuY3Rpb24gZk5PUCAoY3Rvcikge1xuICAgIHJldHVybiBjdG9yO1xufVxuXG5mdW5jdGlvbiBnZXRTdWJEaWN0IChvYmosIGtleSkge1xuICAgIHJldHVybiBvYmpba2V5XSB8fCAob2JqW2tleV0gPSB7fSk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrQ3RvckFyZ3VtZW50IChkZWNvcmF0ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAvLyBubyBwYXJhbWV0ZXIsIHRhcmdldCBpcyBjdG9yXG4gICAgICAgICAgICByZXR1cm4gZGVjb3JhdGUodGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGN0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWNvcmF0ZShjdG9yLCB0YXJnZXQpO1xuICAgICAgICB9O1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIF9jaGVja05vcm1hbEFyZ3VtZW50ICh2YWxpZGF0b3JfREVWLCBkZWNvcmF0ZSwgZGVjb3JhdG9yTmFtZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGlmIChDQ19ERVYgJiYgdmFsaWRhdG9yX0RFVih0YXJnZXQsIGRlY29yYXRvck5hbWUpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZk5PUDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChjdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVjb3JhdGUoY3RvciwgdGFyZ2V0KTtcbiAgICAgICAgfTtcbiAgICB9O1xufVxuXG52YXIgY2hlY2tDb21wQXJndW1lbnQgPSBfY2hlY2tOb3JtYWxBcmd1bWVudC5iaW5kKG51bGwsIENDX0RFViAmJiBmdW5jdGlvbiAoYXJnLCBkZWNvcmF0b3JOYW1lKSB7XG4gICAgaWYgKCFjYy5DbGFzcy5faXNDQ0NsYXNzKGFyZykpIHtcbiAgICAgICAgY2MuZXJyb3IoJ1RoZSBwYXJhbWV0ZXIgZm9yICVzIGlzIG1pc3NpbmcuJywgZGVjb3JhdG9yTmFtZSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59KTtcblxuZnVuY3Rpb24gX2FyZ3VtZW50Q2hlY2tlciAodHlwZSkge1xuICAgIHJldHVybiBfY2hlY2tOb3JtYWxBcmd1bWVudC5iaW5kKG51bGwsIENDX0RFViAmJiBmdW5jdGlvbiAoYXJnLCBkZWNvcmF0b3JOYW1lKSB7XG4gICAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBjYy5Db21wb25lbnQgfHwgYXJnID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNjLmVycm9yKCdUaGUgcGFyYW1ldGVyIGZvciAlcyBpcyBtaXNzaW5nLicsIGRlY29yYXRvck5hbWUpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBhcmcgIT09IHR5cGUpIHtcbiAgICAgICAgICAgIGNjLmVycm9yKCdUaGUgcGFyYW1ldGVyIGZvciAlcyBtdXN0IGJlIHR5cGUgJXMuJywgZGVjb3JhdG9yTmFtZSwgdHlwZSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbnZhciBjaGVja1N0cmluZ0FyZ3VtZW50ID0gX2FyZ3VtZW50Q2hlY2tlcignc3RyaW5nJyk7XG52YXIgY2hlY2tOdW1iZXJBcmd1bWVudCA9IF9hcmd1bWVudENoZWNrZXIoJ251bWJlcicpO1xuLy8gdmFyIGNoZWNrQm9vbGVhbkFyZ3VtZW50ID0gX2FyZ3VtZW50Q2hlY2tlcignYm9vbGVhbicpO1xuXG5cbmZ1bmN0aW9uIGdldENsYXNzQ2FjaGUgKGN0b3IsIGRlY29yYXRvck5hbWUpIHtcbiAgICBpZiAoQ0NfREVWICYmIGNjLkNsYXNzLl9pc0NDQ2xhc3MoY3RvcikpIHtcbiAgICAgICAgY2MuZXJyb3IoJ2BAJXNgIHNob3VsZCBiZSB1c2VkIGFmdGVyIEBjY2NsYXNzIGZvciBjbGFzcyBcIiVzXCInLCBkZWNvcmF0b3JOYW1lLCBqcy5nZXRDbGFzc05hbWUoY3RvcikpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGdldFN1YkRpY3QoY3RvciwgQ0FDSEVfS0VZKTtcbn1cblxuZnVuY3Rpb24gZ2V0RGVmYXVsdEZyb21Jbml0aWFsaXplciAoaW5pdGlhbGl6ZXIpIHtcbiAgICB2YXIgdmFsdWU7XG4gICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBpbml0aWFsaXplcigpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICAvLyBqdXN0IGxhenkgaW5pdGlhbGl6ZSBieSBDQ0NsYXNzXG4gICAgICAgIHJldHVybiBpbml0aWFsaXplcjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgLy8gc3RyaW5nIGJvb2xlYW4gbnVtYmVyIGZ1bmN0aW9uIHVuZGVmaW5lZCBudWxsXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFRoZSBkZWZhdWx0IGF0dHJpYnV0ZSB3aWxsIG5vdCBiZSB1c2VkIGluIEVTNiBjb25zdHJ1Y3RvciBhY3R1YWxseSxcbiAgICAgICAgLy8gc28gd2UgZG9udCBuZWVkIHRvIHNpbXBsaWZ5IGludG8gYHt9YCBvciBgW11gIG9yIHZlYzIgY29tcGxldGVseS5cbiAgICAgICAgcmV0dXJuIGluaXRpYWxpemVyO1xuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBleHRyYWN0QWN0dWFsRGVmYXVsdFZhbHVlcyAoY3Rvcikge1xuICAgIHZhciBkdW1teU9iajtcbiAgICB0cnkge1xuICAgICAgICBkdW1teU9iaiA9IG5ldyBjdG9yKCk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChDQ19ERVYpIHtcbiAgICAgICAgICAgIGNjLmVycm9ySUQoMzY1MiwganMuZ2V0Q2xhc3NOYW1lKGN0b3IpLCBlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIHJldHVybiBkdW1teU9iajtcbn1cblxuZnVuY3Rpb24gZ2VuUHJvcGVydHkgKGN0b3IsIHByb3BlcnRpZXMsIHByb3BOYW1lLCBvcHRpb25zLCBkZXNjLCBjYWNoZSkge1xuICAgIHZhciBmdWxsT3B0aW9ucztcbiAgICB2YXIgaXNHZXRzZXQgPSBkZXNjICYmIChkZXNjLmdldCB8fCBkZXNjLnNldCk7XG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgZnVsbE9wdGlvbnMgPSBQcmVwcm9jZXNzLmdldEZ1bGxGb3JtT2ZQcm9wZXJ0eShvcHRpb25zLCBpc0dldHNldCk7XG4gICAgfVxuICAgIHZhciBleGlzdHNQcm9wZXJ0eSA9IHByb3BlcnRpZXNbcHJvcE5hbWVdO1xuICAgIHZhciBwcm9wID0ganMubWl4aW4oZXhpc3RzUHJvcGVydHkgfHwge30sIGZ1bGxPcHRpb25zIHx8IG9wdGlvbnMgfHwge30pO1xuXG4gICAgaWYgKGlzR2V0c2V0KSB7XG4gICAgICAgIC8vIHR5cGVzY3JpcHQgb3IgYmFiZWxcbiAgICAgICAgaWYgKENDX0RFViAmJiBvcHRpb25zICYmICgoZnVsbE9wdGlvbnMgfHwgb3B0aW9ucykuZ2V0IHx8IChmdWxsT3B0aW9ucyB8fCBvcHRpb25zKS5zZXQpKSB7XG4gICAgICAgICAgICB2YXIgZXJyb3JQcm9wcyA9IGdldFN1YkRpY3QoY2FjaGUsICdlcnJvclByb3BzJyk7XG4gICAgICAgICAgICBpZiAoIWVycm9yUHJvcHNbcHJvcE5hbWVdKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JQcm9wc1twcm9wTmFtZV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzNjU1LCBwcm9wTmFtZSwganMuZ2V0Q2xhc3NOYW1lKGN0b3IpLCBwcm9wTmFtZSwgcHJvcE5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChkZXNjLmdldCkge1xuICAgICAgICAgICAgcHJvcC5nZXQgPSBkZXNjLmdldDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgICAgICAgIHByb3Auc2V0ID0gZGVzYy5zZXQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChDQ19ERVYgJiYgKHByb3AuZ2V0IHx8IHByb3Auc2V0KSkge1xuICAgICAgICAgICAgLy8gQHByb3BlcnR5KHtcbiAgICAgICAgICAgIC8vICAgICBnZXQgKCkgeyAuLi4gfSxcbiAgICAgICAgICAgIC8vICAgICBzZXQgKC4uLikgeyAuLi4gfSxcbiAgICAgICAgICAgIC8vIH0pXG4gICAgICAgICAgICAvLyB2YWx1ZTtcbiAgICAgICAgICAgIGNjLmVycm9ySUQoMzY1NSwgcHJvcE5hbWUsIGpzLmdldENsYXNzTmFtZShjdG9yKSwgcHJvcE5hbWUsIHByb3BOYW1lKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBtZW1iZXIgdmFyaWFibGVzXG4gICAgICAgIHZhciBkZWZhdWx0VmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBpc0RlZmF1bHRWYWx1ZVNwZWNpZmllZCA9IGZhbHNlO1xuICAgICAgICBpZiAoZGVzYykge1xuICAgICAgICAgICAgLy8gYmFiZWxcbiAgICAgICAgICAgIGlmIChkZXNjLmluaXRpYWxpemVyKSB7XG4gICAgICAgICAgICAgICAgLy8gQHByb3BlcnR5KC4uLilcbiAgICAgICAgICAgICAgICAvLyB2YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlID0gZ2V0RGVmYXVsdEZyb21Jbml0aWFsaXplcihkZXNjLmluaXRpYWxpemVyKTtcbiAgICAgICAgICAgICAgICBpc0RlZmF1bHRWYWx1ZVNwZWNpZmllZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBAcHJvcGVydHkoLi4uKVxuICAgICAgICAgICAgICAgIC8vIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gdHlwZXNjcmlwdFxuICAgICAgICAgICAgdmFyIGFjdHVhbERlZmF1bHRWYWx1ZXMgPSBjYWNoZS5kZWZhdWx0IHx8IChjYWNoZS5kZWZhdWx0ID0gZXh0cmFjdEFjdHVhbERlZmF1bHRWYWx1ZXMoY3RvcikpO1xuICAgICAgICAgICAgaWYgKGFjdHVhbERlZmF1bHRWYWx1ZXMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgLy8gQHByb3BlcnR5KC4uLilcbiAgICAgICAgICAgICAgICAvLyB2YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlID0gYWN0dWFsRGVmYXVsdFZhbHVlc1twcm9wTmFtZV07XG4gICAgICAgICAgICAgICAgaXNEZWZhdWx0VmFsdWVTcGVjaWZpZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gQHByb3BlcnR5KC4uLilcbiAgICAgICAgICAgICAgICAvLyB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgoQ0NfRURJVE9SICYmICFFZGl0b3IuaXNCdWlsZGVyKSB8fCBDQ19URVNUKSB7XG4gICAgICAgICAgICBpZiAoIWZ1bGxPcHRpb25zICYmIG9wdGlvbnMgJiYgb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnZGVmYXVsdCcpKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybklEKDM2NTMsIHByb3BOYW1lLCBqcy5nZXRDbGFzc05hbWUoY3RvcikpO1xuICAgICAgICAgICAgICAgIC8vIHByb3AuZGVmYXVsdCA9IG9wdGlvbnMuZGVmYXVsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCFpc0RlZmF1bHRWYWx1ZVNwZWNpZmllZCkge1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzNjU0LCBqcy5nZXRDbGFzc05hbWUoY3RvciksIHByb3BOYW1lKTtcbiAgICAgICAgICAgICAgICAvLyBwcm9wLmRlZmF1bHQgPSBmdWxsT3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnZGVmYXVsdCcpID8gZnVsbE9wdGlvbnMuZGVmYXVsdCA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwcm9wLmRlZmF1bHQgPSBkZWZhdWx0VmFsdWU7XG4gICAgfVxuXG4gICAgcHJvcGVydGllc1twcm9wTmFtZV0gPSBwcm9wO1xufVxuXG4vKipcbiAqICEjZW5cbiAqIERlY2xhcmUgdGhlIHN0YW5kYXJkIFtFUzYgQ2xhc3NdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0NsYXNzZXMpXG4gKiBhcyBDQ0NsYXNzLCBwbGVhc2Ugc2VlIFtDbGFzc10oLi4vLi4vLi4vbWFudWFsL2VuL3NjcmlwdGluZy9jbGFzcy5odG1sKSBmb3IgZGV0YWlscy5cbiAqICEjemhcbiAqIOWwhuagh+WHhuWGmeazleeahCBbRVM2IENsYXNzXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9DbGFzc2VzKSDlo7DmmI7kuLogQ0NDbGFzc++8jOWFt+S9k+eUqOazleivt+WPgumYhVvnsbvlnovlrprkuYldKC4uLy4uLy4uL21hbnVhbC96aC9zY3JpcHRpbmcvY2xhc3MuaHRtbCnjgIJcbiAqXG4gKiBAbWV0aG9kIGNjY2xhc3NcbiAqIEBwYXJhbSB7U3RyaW5nfSBbbmFtZV0gLSBUaGUgY2xhc3MgbmFtZSB1c2VkIGZvciBzZXJpYWxpemF0aW9uLlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHtjY2NsYXNzfSA9IGNjLl9kZWNvcmF0b3I7XG4gKlxuICogLy8gZGVmaW5lIGEgQ0NDbGFzcywgb21pdCB0aGUgbmFtZVxuICogJiM2NDtjY2NsYXNzXG4gKiBjbGFzcyBOZXdTY3JpcHQgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xuICogICAgIC8vIC4uLlxuICogfVxuICpcbiAqIC8vIGRlZmluZSBhIENDQ2xhc3Mgd2l0aCBhIG5hbWVcbiAqICYjNjQ7Y2NjbGFzcygnTG9naW5EYXRhJylcbiAqIGNsYXNzIExvZ2luRGF0YSB7XG4gKiAgICAgLy8gLi4uXG4gKiB9XG4gKiBAdHlwZXNjcmlwdFxuICogY2NjbGFzcyhuYW1lPzogc3RyaW5nKTogRnVuY3Rpb25cbiAqIGNjY2xhc3MoX2NsYXNzPzogRnVuY3Rpb24pOiB2b2lkXG4gKi9cbnZhciBjY2NsYXNzID0gY2hlY2tDdG9yQXJndW1lbnQoZnVuY3Rpb24gKGN0b3IsIG5hbWUpIHtcbiAgICAvLyBpZiAoRklYX0JBQkVMNikge1xuICAgIC8vICAgICBldmFsKCdpZih0eXBlb2YgX2NsYXNzQ2FsbENoZWNrPT09XCJmdW5jdGlvblwiKXtfY2xhc3NDYWxsQ2hlY2s9ZnVuY3Rpb24oKXt9O30nKTtcbiAgICAvLyB9XG4gICAgdmFyIGJhc2UgPSBqcy5nZXRTdXBlcihjdG9yKTtcbiAgICBpZiAoYmFzZSA9PT0gT2JqZWN0KSB7XG4gICAgICAgIGJhc2UgPSBudWxsO1xuICAgIH1cblxuICAgIHZhciBwcm90byA9IHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgZXh0ZW5kczogYmFzZSxcbiAgICAgICAgY3RvcixcbiAgICAgICAgX19FUzZfXzogdHJ1ZSxcbiAgICB9O1xuICAgIHZhciBjYWNoZSA9IGN0b3JbQ0FDSEVfS0VZXTtcbiAgICBpZiAoY2FjaGUpIHtcbiAgICAgICAgdmFyIGRlY29yYXRlZFByb3RvID0gY2FjaGUucHJvdG87XG4gICAgICAgIGlmIChkZWNvcmF0ZWRQcm90bykge1xuICAgICAgICAgICAgLy8gZGVjb3JhdGVkUHJvdG8ucHJvcGVydGllcyA9IGNyZWF0ZVByb3BlcnRpZXMoY3RvciwgZGVjb3JhdGVkUHJvdG8ucHJvcGVydGllcyk7XG4gICAgICAgICAgICBqcy5taXhpbihwcm90bywgZGVjb3JhdGVkUHJvdG8pO1xuICAgICAgICB9XG4gICAgICAgIGN0b3JbQ0FDSEVfS0VZXSA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB2YXIgcmVzID0gY2MuQ2xhc3MocHJvdG8pO1xuXG4gICAgLy8gdmFsaWRhdGUgbWV0aG9kc1xuICAgIGlmIChDQ19ERVYpIHtcbiAgICAgICAgdmFyIHByb3BOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGN0b3IucHJvdG90eXBlKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wTmFtZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBwcm9wID0gcHJvcE5hbWVzW2ldO1xuICAgICAgICAgICAgaWYgKHByb3AgIT09ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY3Rvci5wcm90b3R5cGUsIHByb3ApO1xuICAgICAgICAgICAgICAgIHZhciBmdW5jID0gZGVzYyAmJiBkZXNjLnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZnVuYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBQcmVwcm9jZXNzLmRvVmFsaWRhdGVNZXRob2RXaXRoUHJvcHNfREVWKGZ1bmMsIHByb3AsIGpzLmdldENsYXNzTmFtZShjdG9yKSwgY3RvciwgYmFzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbn0pO1xuXG4vKipcbiAqICEjZW5cbiAqIERlY2xhcmUgcHJvcGVydHkgZm9yIFtDQ0NsYXNzXSguLi8uLi8uLi9tYW51YWwvZW4vc2NyaXB0aW5nL3JlZmVyZW5jZS9hdHRyaWJ1dGVzLmh0bWwpLlxuICogISN6aFxuICog5a6a5LmJIFtDQ0NsYXNzXSguLi8uLi8uLi9tYW51YWwvemgvc2NyaXB0aW5nL3JlZmVyZW5jZS9hdHRyaWJ1dGVzLmh0bWwpIOaJgOeUqOeahOWxnuaAp+OAglxuICpcbiAqIEBtZXRob2QgcHJvcGVydHlcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSBhbiBvYmplY3Qgd2l0aCBzb21lIHByb3BlcnR5IGF0dHJpYnV0ZXNcbiAqIEBwYXJhbSB7QW55fSBbb3B0aW9ucy50eXBlXVxuICogQHBhcmFtIHtCb29sZWFufEZ1bmN0aW9ufSBbb3B0aW9ucy52aXNpYmxlXVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmRpc3BsYXlOYW1lXVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnRvb2x0aXBdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLm11bHRpbGluZV1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucmVhZG9ubHldXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWluXVxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1heF1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5zdGVwXVxuICogQHBhcmFtIHtOdW1iZXJbXX0gW29wdGlvbnMucmFuZ2VdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnNsaWRlXVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zZXJpYWxpemFibGVdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmVkaXRvck9ubHldXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLm92ZXJyaWRlXVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5hbmltYXRhYmxlXVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmZvcm1lcmx5U2VyaWFsaXplZEFzXVxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHtjY2NsYXNzLCBwcm9wZXJ0eX0gPSBjYy5fZGVjb3JhdG9yO1xuICpcbiAqICYjNjQ7Y2NjbGFzc1xuICogY2xhc3MgTmV3U2NyaXB0IGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcbiAqICAgICAmIzY0O3Byb3BlcnR5KHtcbiAqICAgICAgICAgdHlwZTogY2MuTm9kZVxuICogICAgIH0pXG4gKiAgICAgdGFyZ2V0Tm9kZTEgPSBudWxsO1xuICpcbiAqICAgICAmIzY0O3Byb3BlcnR5KGNjLk5vZGUpXG4gKiAgICAgdGFyZ2V0Tm9kZTIgPSBudWxsO1xuICpcbiAqICAgICAmIzY0O3Byb3BlcnR5KGNjLkJ1dHRvbilcbiAqICAgICB0YXJnZXRCdXR0b24gPSBudWxsO1xuICpcbiAqICAgICAmIzY0O3Byb3BlcnR5XG4gKiAgICAgX3dpZHRoID0gMTAwO1xuICpcbiAqICAgICAmIzY0O3Byb3BlcnR5XG4gKiAgICAgZ2V0IHdpZHRoICgpIHtcbiAqICAgICAgICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xuICogICAgIH1cbiAqXG4gKiAgICAgJiM2NDtwcm9wZXJ0eVxuICogICAgIHNldCB3aWR0aCAodmFsdWUpIHtcbiAqICAgICAgICAgdGhpcy5fd2lkdGggPSB2YWx1ZTtcbiAqICAgICB9XG4gKlxuICogICAgICYjNjQ7cHJvcGVydHlcbiAqICAgICBvZmZzZXQgPSBuZXcgY2MuVmVjMigxMDAsIDEwMCk7XG4gKlxuICogICAgICYjNjQ7cHJvcGVydHkoY2MuVmVjMilcbiAqICAgICBvZmZzZXRzID0gW107XG4gKlxuICogICAgICYjNjQ7cHJvcGVydHkoY2MuU3ByaXRlRnJhbWUpXG4gKiAgICAgZnJhbWUgPSBudWxsO1xuICogfVxuICpcbiAqIC8vIGFib3ZlIGlzIGVxdWl2YWxlbnQgdG8gKOS4iumdoueahOS7o+eggeebuOW9k+S6jik6XG4gKlxuICogdmFyIE5ld1NjcmlwdCA9IGNjLkNsYXNzKHtcbiAqICAgICBwcm9wZXJ0aWVzOiB7XG4gKiAgICAgICAgIHRhcmdldE5vZGUxOiB7XG4gKiAgICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICogICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICogICAgICAgICB9LFxuICpcbiAqICAgICAgICAgdGFyZ2V0Tm9kZTI6IHtcbiAqICAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gKiAgICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gKiAgICAgICAgIH0sXG4gKlxuICogICAgICAgICB0YXJnZXRCdXR0b246IHtcbiAqICAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gKiAgICAgICAgICAgICB0eXBlOiBjYy5CdXR0b25cbiAqICAgICAgICAgfSxcbiAqXG4gKiAgICAgICAgIF93aWR0aDogMTAwLFxuICpcbiAqICAgICAgICAgd2lkdGg6IHtcbiAqICAgICAgICAgICAgIGdldCAoKSB7XG4gKiAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xuICogICAgICAgICAgICAgfSxcbiAqICAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAqICAgICAgICAgICAgICAgICB0aGlzLl93aWR0aCA9IHZhbHVlO1xuICogICAgICAgICAgICAgfVxuICogICAgICAgICB9LFxuICpcbiAqICAgICAgICAgb2Zmc2V0OiBuZXcgY2MuVmVjMigxMDAsIDEwMClcbiAqXG4gKiAgICAgICAgIG9mZnNldHM6IHtcbiAqICAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxuICogICAgICAgICAgICAgdHlwZTogY2MuVmVjMlxuICogICAgICAgICB9XG4gKlxuICogICAgICAgICBmcmFtZToge1xuICogICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAqICAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUZyYW1lXG4gKiAgICAgICAgIH0sXG4gKiAgICAgfVxuICogfSk7XG4gKiBAdHlwZXNjcmlwdFxuICogcHJvcGVydHkob3B0aW9ucz86IHt0eXBlPzogYW55OyB2aXNpYmxlPzogYm9vbGVhbnwoKCkgPT4gYm9vbGVhbik7IGRpc3BsYXlOYW1lPzogc3RyaW5nOyB0b29sdGlwPzogc3RyaW5nOyBtdWx0aWxpbmU/OiBib29sZWFuOyByZWFkb25seT86IGJvb2xlYW47IG1pbj86IG51bWJlcjsgbWF4PzogbnVtYmVyOyBzdGVwPzogbnVtYmVyOyByYW5nZT86IG51bWJlcltdOyBzbGlkZT86IGJvb2xlYW47IHNlcmlhbGl6YWJsZT86IGJvb2xlYW47IGZvcm1lcmx5U2VyaWFsaXplZEFzPzogc3RyaW5nOyBlZGl0b3JPbmx5PzogYm9vbGVhbjsgb3ZlcnJpZGU/OiBib29sZWFuOyBhbmltYXRhYmxlPzogYm9vbGVhbiwgdXNlckRhdGE/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH0gfCBhbnlbXXxGdW5jdGlvbnxjYy5WYWx1ZVR5cGV8bnVtYmVyfHN0cmluZ3xib29sZWFuKTogRnVuY3Rpb25cbiAqIHByb3BlcnR5KF90YXJnZXQ6IE9iamVjdCwgX2tleTogYW55LCBfZGVzYz86IGFueSk6IHZvaWRcbiAqL1xuZnVuY3Rpb24gcHJvcGVydHkgKGN0b3JQcm90b09yT3B0aW9ucywgcHJvcE5hbWUsIGRlc2MpIHtcbiAgICB2YXIgb3B0aW9ucyA9IG51bGw7XG4gICAgZnVuY3Rpb24gbm9ybWFsaXplZCAoY3RvclByb3RvLCBwcm9wTmFtZSwgZGVzYykge1xuICAgICAgICB2YXIgY2FjaGUgPSBnZXRDbGFzc0NhY2hlKGN0b3JQcm90by5jb25zdHJ1Y3Rvcik7XG4gICAgICAgIGlmIChjYWNoZSkge1xuICAgICAgICAgICAgdmFyIGNjY2xhc3NQcm90byA9IGdldFN1YkRpY3QoY2FjaGUsICdwcm90bycpO1xuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBnZXRTdWJEaWN0KGNjY2xhc3NQcm90bywgJ3Byb3BlcnRpZXMnKTtcbiAgICAgICAgICAgIGdlblByb3BlcnR5KGN0b3JQcm90by5jb25zdHJ1Y3RvciwgcHJvcGVydGllcywgcHJvcE5hbWUsIG9wdGlvbnMsIGRlc2MsIGNhY2hlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAodHlwZW9mIHByb3BOYW1lID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBvcHRpb25zID0gY3RvclByb3RvT3JPcHRpb25zO1xuICAgICAgICByZXR1cm4gbm9ybWFsaXplZDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG5vcm1hbGl6ZWQoY3RvclByb3RvT3JPcHRpb25zLCBwcm9wTmFtZSwgZGVzYyk7XG4gICAgfVxufVxuXG4vLyBFZGl0b3IgRGVjb3JhdG9yc1xuXG5mdW5jdGlvbiBjcmVhdGVFZGl0b3JEZWNvcmF0b3IgKGFyZ0NoZWNrRnVuYywgZWRpdG9yUHJvcE5hbWUsIHN0YXRpY1ZhbHVlKSB7XG4gICAgcmV0dXJuIGFyZ0NoZWNrRnVuYyhmdW5jdGlvbiAoY3RvciwgZGVjb3JhdGVkVmFsdWUpIHtcbiAgICAgICAgdmFyIGNhY2hlID0gZ2V0Q2xhc3NDYWNoZShjdG9yLCBlZGl0b3JQcm9wTmFtZSk7XG4gICAgICAgIGlmIChjYWNoZSkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gKHN0YXRpY1ZhbHVlICE9PSB1bmRlZmluZWQpID8gc3RhdGljVmFsdWUgOiBkZWNvcmF0ZWRWYWx1ZTtcbiAgICAgICAgICAgIHZhciBwcm90byA9IGdldFN1YkRpY3QoY2FjaGUsICdwcm90bycpO1xuICAgICAgICAgICAgZ2V0U3ViRGljdChwcm90bywgJ2VkaXRvcicpW2VkaXRvclByb3BOYW1lXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfSwgZWRpdG9yUHJvcE5hbWUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVEdW1teURlY29yYXRvciAoYXJnQ2hlY2tGdW5jKSB7XG4gICAgcmV0dXJuIGFyZ0NoZWNrRnVuYyhmTk9QKTtcbn1cblxuLyoqXG4gKiAhI2VuXG4gKiBNYWtlcyBhIENDQ2xhc3MgdGhhdCBpbmhlcml0IGZyb20gY29tcG9uZW50IGV4ZWN1dGUgaW4gZWRpdCBtb2RlLjxicj5cbiAqIEJ5IGRlZmF1bHQsIGFsbCBjb21wb25lbnRzIGFyZSBvbmx5IGV4ZWN1dGVkIGluIHBsYXkgbW9kZSxcbiAqIHdoaWNoIG1lYW5zIHRoZXkgd2lsbCBub3QgaGF2ZSB0aGVpciBjYWxsYmFjayBmdW5jdGlvbnMgZXhlY3V0ZWQgd2hpbGUgdGhlIEVkaXRvciBpcyBpbiBlZGl0IG1vZGUuXG4gKiAhI3poXG4gKiDlhYHorrjnu6fmib/oh6ogQ29tcG9uZW50IOeahCBDQ0NsYXNzIOWcqOe8lui+keWZqOmHjOaJp+ihjOOAgjxicj5cbiAqIOm7mOiupOaDheWGteS4i++8jOaJgOaciSBDb21wb25lbnQg6YO95Y+q5Lya5Zyo6L+Q6KGM5pe25omN5Lya5omn6KGM77yM5Lmf5bCx5piv6K+05a6D5Lus55qE55Sf5ZG95ZGo5pyf5Zue6LCD5LiN5Lya5Zyo57yW6L6R5Zmo6YeM6Kem5Y+R44CCXG4gKlxuICogQG1ldGhvZCBleGVjdXRlSW5FZGl0TW9kZVxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHtjY2NsYXNzLCBleGVjdXRlSW5FZGl0TW9kZX0gPSBjYy5fZGVjb3JhdG9yO1xuICpcbiAqICYjNjQ7Y2NjbGFzc1xuICogJiM2NDtleGVjdXRlSW5FZGl0TW9kZVxuICogY2xhc3MgTmV3U2NyaXB0IGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcbiAqICAgICAvLyAuLi5cbiAqIH1cbiAqIEB0eXBlc2NyaXB0XG4gKiBleGVjdXRlSW5FZGl0TW9kZSgpOiBGdW5jdGlvblxuICogZXhlY3V0ZUluRWRpdE1vZGUoX2NsYXNzOiBGdW5jdGlvbik6IHZvaWRcbiAqL1xudmFyIGV4ZWN1dGVJbkVkaXRNb2RlID0gKENDX0RFViA/IGNyZWF0ZUVkaXRvckRlY29yYXRvciA6IGNyZWF0ZUR1bW15RGVjb3JhdG9yKShjaGVja0N0b3JBcmd1bWVudCwgJ2V4ZWN1dGVJbkVkaXRNb2RlJywgdHJ1ZSk7XG5cbi8qKlxuICogISNlblxuICogQXV0b21hdGljYWxseSBhZGQgcmVxdWlyZWQgY29tcG9uZW50IGFzIGEgZGVwZW5kZW5jeSBmb3IgdGhlIENDQ2xhc3MgdGhhdCBpbmhlcml0IGZyb20gY29tcG9uZW50LlxuICogISN6aFxuICog5Li65aOw5piO5Li6IENDQ2xhc3Mg55qE57uE5Lu25re75Yqg5L6d6LWW55qE5YW25a6D57uE5Lu244CC5b2T57uE5Lu25re75Yqg5Yiw6IqC54K55LiK5pe277yM5aaC5p6c5L6d6LWW55qE57uE5Lu25LiN5a2Y5Zyo77yM5byV5pOO5bCG5Lya6Ieq5Yqo5bCG5L6d6LWW57uE5Lu25re75Yqg5Yiw5ZCM5LiA5Liq6IqC54K577yM6Ziy5q2i6ISa5pys5Ye66ZSZ44CC6K+l6K6+572u5Zyo6L+Q6KGM5pe25ZCM5qC35pyJ5pWI44CCXG4gKlxuICogQG1ldGhvZCByZXF1aXJlQ29tcG9uZW50XG4gKiBAcGFyYW0ge0NvbXBvbmVudH0gcmVxdWlyZWRDb21wb25lbnRcbiAqIEBleGFtcGxlXG4gKiBjb25zdCB7Y2NjbGFzcywgcmVxdWlyZUNvbXBvbmVudH0gPSBjYy5fZGVjb3JhdG9yO1xuICpcbiAqICYjNjQ7Y2NjbGFzc1xuICogJiM2NDtyZXF1aXJlQ29tcG9uZW50KGNjLlNwcml0ZSlcbiAqIGNsYXNzIFNwcml0ZUN0cmwgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xuICogICAgIC8vIC4uLlxuICogfVxuICogQHR5cGVzY3JpcHRcbiAqIHJlcXVpcmVDb21wb25lbnQocmVxdWlyZWRDb21wb25lbnQ6IHR5cGVvZiBjYy5Db21wb25lbnQpOiBGdW5jdGlvblxuICovXG52YXIgcmVxdWlyZUNvbXBvbmVudCA9IGNyZWF0ZUVkaXRvckRlY29yYXRvcihjaGVja0NvbXBBcmd1bWVudCwgJ3JlcXVpcmVDb21wb25lbnQnKTtcblxuLyoqXG4gKiAhI2VuXG4gKiBUaGUgbWVudSBwYXRoIHRvIHJlZ2lzdGVyIGEgY29tcG9uZW50IHRvIHRoZSBlZGl0b3JzIFwiQ29tcG9uZW50XCIgbWVudS4gRWcuIFwiUmVuZGVyaW5nL0NhbWVyYUN0cmxcIi5cbiAqICEjemhcbiAqIOWwhuW9k+WJjee7hOS7tua3u+WKoOWIsOe7hOS7tuiPnOWNleS4re+8jOaWueS+v+eUqOaIt+afpeaJvuOAguS+i+WmgiBcIlJlbmRlcmluZy9DYW1lcmFDdHJsXCLjgIJcbiAqXG4gKiBAbWV0aG9kIG1lbnVcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggaXMgdGhlIG1lbnUgcmVwcmVzZW50ZWQgbGlrZSBhIHBhdGhuYW1lLlxuICogICAgICAgICAgICAgICAgICAgICAgICBGb3IgZXhhbXBsZSB0aGUgbWVudSBjb3VsZCBiZSBcIlJlbmRlcmluZy9DYW1lcmFDdHJsXCIuXG4gKiBAZXhhbXBsZVxuICogY29uc3Qge2NjY2xhc3MsIG1lbnV9ID0gY2MuX2RlY29yYXRvcjtcbiAqXG4gKiAmIzY0O2NjY2xhc3NcbiAqICYjNjQ7bWVudShcIlJlbmRlcmluZy9DYW1lcmFDdHJsXCIpXG4gKiBjbGFzcyBOZXdTY3JpcHQgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xuICogICAgIC8vIC4uLlxuICogfVxuICogQHR5cGVzY3JpcHRcbiAqIG1lbnUocGF0aDogc3RyaW5nKTogRnVuY3Rpb25cbiAqL1xudmFyIG1lbnUgPSAoQ0NfREVWID8gY3JlYXRlRWRpdG9yRGVjb3JhdG9yIDogY3JlYXRlRHVtbXlEZWNvcmF0b3IpKGNoZWNrU3RyaW5nQXJndW1lbnQsICdtZW51Jyk7XG5cbi8qKlxuICogISNlblxuICogVGhlIGV4ZWN1dGlvbiBvcmRlciBvZiBsaWZlY3ljbGUgbWV0aG9kcyBmb3IgQ29tcG9uZW50LlxuICogVGhvc2UgbGVzcyB0aGFuIDAgd2lsbCBleGVjdXRlIGJlZm9yZSB3aGlsZSB0aG9zZSBncmVhdGVyIHRoYW4gMCB3aWxsIGV4ZWN1dGUgYWZ0ZXIuXG4gKiBUaGUgb3JkZXIgd2lsbCBvbmx5IGFmZmVjdCBvbkxvYWQsIG9uRW5hYmxlLCBzdGFydCwgdXBkYXRlIGFuZCBsYXRlVXBkYXRlIHdoaWxlIG9uRGlzYWJsZSBhbmQgb25EZXN0cm95IHdpbGwgbm90IGJlIGFmZmVjdGVkLlxuICogISN6aFxuICog6K6+572u6ISa5pys55Sf5ZG95ZGo5pyf5pa55rOV6LCD55So55qE5LyY5YWI57qn44CC5LyY5YWI57qn5bCP5LqOIDAg55qE57uE5Lu25bCG5Lya5LyY5YWI5omn6KGM77yM5LyY5YWI57qn5aSn5LqOIDAg55qE57uE5Lu25bCG5Lya5bu25ZCO5omn6KGM44CC5LyY5YWI57qn5LuF5Lya5b2x5ZONIG9uTG9hZCwgb25FbmFibGUsIHN0YXJ0LCB1cGRhdGUg5ZKMIGxhdGVVcGRhdGXvvIzogIwgb25EaXNhYmxlIOWSjCBvbkRlc3Ryb3kg5LiN5Y+X5b2x5ZON44CCXG4gKlxuICogQG1ldGhvZCBleGVjdXRpb25PcmRlclxuICogQHBhcmFtIHtOdW1iZXJ9IG9yZGVyIC0gVGhlIGV4ZWN1dGlvbiBvcmRlciBvZiBsaWZlY3ljbGUgbWV0aG9kcyBmb3IgQ29tcG9uZW50LiBUaG9zZSBsZXNzIHRoYW4gMCB3aWxsIGV4ZWN1dGUgYmVmb3JlIHdoaWxlIHRob3NlIGdyZWF0ZXIgdGhhbiAwIHdpbGwgZXhlY3V0ZSBhZnRlci5cbiAqIEBleGFtcGxlXG4gKiBjb25zdCB7Y2NjbGFzcywgZXhlY3V0aW9uT3JkZXJ9ID0gY2MuX2RlY29yYXRvcjtcbiAqXG4gKiAmIzY0O2NjY2xhc3NcbiAqICYjNjQ7ZXhlY3V0aW9uT3JkZXIoMSlcbiAqIGNsYXNzIENhbWVyYUN0cmwgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xuICogICAgIC8vIC4uLlxuICogfVxuICogQHR5cGVzY3JpcHRcbiAqIGV4ZWN1dGlvbk9yZGVyKG9yZGVyOiBudW1iZXIpOiBGdW5jdGlvblxuICovXG52YXIgZXhlY3V0aW9uT3JkZXIgPSBjcmVhdGVFZGl0b3JEZWNvcmF0b3IoY2hlY2tOdW1iZXJBcmd1bWVudCwgJ2V4ZWN1dGlvbk9yZGVyJyk7XG5cbi8qKlxuICogISNlblxuICogUHJldmVudHMgQ29tcG9uZW50IG9mIHRoZSBzYW1lIHR5cGUgKG9yIHN1YnR5cGUpIHRvIGJlIGFkZGVkIG1vcmUgdGhhbiBvbmNlIHRvIGEgTm9kZS5cbiAqICEjemhcbiAqIOmYsuatouWkmuS4quebuOWQjOexu+Wei++8iOaIluWtkOexu+Wei++8ieeahOe7hOS7tuiiq+a3u+WKoOWIsOWQjOS4gOS4quiKgueCueOAglxuICpcbiAqIEBtZXRob2QgZGlzYWxsb3dNdWx0aXBsZVxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHtjY2NsYXNzLCBkaXNhbGxvd011bHRpcGxlfSA9IGNjLl9kZWNvcmF0b3I7XG4gKlxuICogJiM2NDtjY2NsYXNzXG4gKiAmIzY0O2Rpc2FsbG93TXVsdGlwbGVcbiAqIGNsYXNzIENhbWVyYUN0cmwgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xuICogICAgIC8vIC4uLlxuICogfVxuICogQHR5cGVzY3JpcHRcbiAqIGRpc2FsbG93TXVsdGlwbGUoKTogRnVuY3Rpb25cbiAqIGRpc2FsbG93TXVsdGlwbGUoX2NsYXNzOiBGdW5jdGlvbik6IHZvaWRcbiAqL1xudmFyIGRpc2FsbG93TXVsdGlwbGUgPSAoQ0NfREVWID8gY3JlYXRlRWRpdG9yRGVjb3JhdG9yIDogY3JlYXRlRHVtbXlEZWNvcmF0b3IpKGNoZWNrQ3RvckFyZ3VtZW50LCAnZGlzYWxsb3dNdWx0aXBsZScpO1xuXG4vKipcbiAqICEjZW5cbiAqIElmIHNwZWNpZmllZCwgdGhlIGVkaXRvcidzIHNjZW5lIHZpZXcgd2lsbCBrZWVwIHVwZGF0aW5nIHRoaXMgbm9kZSBpbiA2MCBmcHMgd2hlbiBpdCBpcyBzZWxlY3RlZCwgb3RoZXJ3aXNlLCBpdCB3aWxsIHVwZGF0ZSBvbmx5IGlmIG5lY2Vzc2FyeS48YnI+XG4gKiBUaGlzIHByb3BlcnR5IGlzIG9ubHkgYXZhaWxhYmxlIGlmIGV4ZWN1dGVJbkVkaXRNb2RlIGlzIHRydWUuXG4gKiAhI3poXG4gKiDlvZPmjIflrprkuoYgXCJleGVjdXRlSW5FZGl0TW9kZVwiIOS7peWQju+8jHBsYXlPbkZvY3VzIOWPr+S7peWcqOmAieS4reW9k+WJjee7hOS7tuaJgOWcqOeahOiKgueCueaXtu+8jOaPkOmrmOe8lui+keWZqOeahOWcuuaZr+WIt+aWsOmikeeOh+WIsCA2MCBGUFPvvIzlkKbliJnlnLrmma/lsLHlj6rkvJrlnKjlv4XopoHnmoTml7blgJnov5vooYzph43nu5jjgIJcbiAqXG4gKiBAbWV0aG9kIHBsYXlPbkZvY3VzXG4gKiBAZXhhbXBsZVxuICogY29uc3Qge2NjY2xhc3MsIHBsYXlPbkZvY3VzLCBleGVjdXRlSW5FZGl0TW9kZX0gPSBjYy5fZGVjb3JhdG9yO1xuICpcbiAqICYjNjQ7Y2NjbGFzc1xuICogJiM2NDtleGVjdXRlSW5FZGl0TW9kZVxuICogJiM2NDtwbGF5T25Gb2N1c1xuICogY2xhc3MgQ2FtZXJhQ3RybCBleHRlbmRzIGNjLkNvbXBvbmVudCB7XG4gKiAgICAgLy8gLi4uXG4gKiB9XG4gKiBAdHlwZXNjcmlwdFxuICogcGxheU9uRm9jdXMoKTogRnVuY3Rpb25cbiAqIHBsYXlPbkZvY3VzKF9jbGFzczogRnVuY3Rpb24pOiB2b2lkXG4gKi9cbnZhciBwbGF5T25Gb2N1cyA9IChDQ19ERVYgPyBjcmVhdGVFZGl0b3JEZWNvcmF0b3IgOiBjcmVhdGVEdW1teURlY29yYXRvcikoY2hlY2tDdG9yQXJndW1lbnQsICdwbGF5T25Gb2N1cycsIHRydWUpO1xuXG4vKipcbiAqICEjZW5cbiAqIFNwZWNpZnlpbmcgdGhlIHVybCBvZiB0aGUgY3VzdG9tIGh0bWwgdG8gZHJhdyB0aGUgY29tcG9uZW50IGluICoqUHJvcGVydGllcyoqLlxuICogISN6aFxuICog6Ieq5a6a5LmJ5b2T5YmN57uE5Lu25ZyoICoq5bGe5oCn5qOA5p+l5ZmoKiog5Lit5riy5p+T5pe25omA55So55qE572R6aG1IHVybOOAglxuICpcbiAqIEBtZXRob2QgaW5zcGVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAZXhhbXBsZVxuICogY29uc3Qge2NjY2xhc3MsIGluc3BlY3Rvcn0gPSBjYy5fZGVjb3JhdG9yO1xuICpcbiAqICYjNjQ7Y2NjbGFzc1xuICogJiM2NDtpbnNwZWN0b3IoXCJwYWNrYWdlczovL2luc3BlY3Rvci9pbnNwZWN0b3JzL2NvbXBzL2NhbWVyYS1jdHJsLmpzXCIpXG4gKiBjbGFzcyBOZXdTY3JpcHQgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xuICogICAgIC8vIC4uLlxuICogfVxuICogQHR5cGVzY3JpcHRcbiAqIGluc3BlY3RvcihwYXRoOiBzdHJpbmcpOiBGdW5jdGlvblxuICovXG52YXIgaW5zcGVjdG9yID0gKENDX0RFViA/IGNyZWF0ZUVkaXRvckRlY29yYXRvciA6IGNyZWF0ZUR1bW15RGVjb3JhdG9yKShjaGVja1N0cmluZ0FyZ3VtZW50LCAnaW5zcGVjdG9yJyk7XG5cbi8qKlxuICogISNlblxuICogU3BlY2lmeWluZyB0aGUgdXJsIG9mIHRoZSBpY29uIHRvIGRpc3BsYXkgaW4gdGhlIGVkaXRvci5cbiAqICEjemhcbiAqIOiHquWumuS5ieW9k+WJjee7hOS7tuWcqOe8lui+keWZqOS4reaYvuekuueahOWbvuaghyB1cmzjgIJcbiAqXG4gKiBAbWV0aG9kIGljb25cbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwcml2YXRlXG4gKiBAZXhhbXBsZVxuICogY29uc3Qge2NjY2xhc3MsIGljb259ID0gY2MuX2RlY29yYXRvcjtcbiAqXG4gKiAmIzY0O2NjY2xhc3NcbiAqICYjNjQ7aWNvbihcInh4eHgucG5nXCIpXG4gKiBjbGFzcyBOZXdTY3JpcHQgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xuICogICAgIC8vIC4uLlxuICogfVxuICogQHR5cGVzY3JpcHRcbiAqIGljb24ocGF0aDogc3RyaW5nKTogRnVuY3Rpb25cbiAqL1xudmFyIGljb24gPSAoQ0NfREVWID8gY3JlYXRlRWRpdG9yRGVjb3JhdG9yIDogY3JlYXRlRHVtbXlEZWNvcmF0b3IpKGNoZWNrU3RyaW5nQXJndW1lbnQsICdpY29uJyk7XG5cbi8qKlxuICogISNlblxuICogVGhlIGN1c3RvbSBkb2N1bWVudGF0aW9uIFVSTC5cbiAqICEjemhcbiAqIOaMh+WumuW9k+WJjee7hOS7tueahOW4ruWKqeaWh+aho+eahCB1cmzvvIzorr7nva7ov4flkI7vvIzlnKggKirlsZ7mgKfmo4Dmn6XlmagqKiDkuK3lsLHkvJrlh7rnjrDkuIDkuKrluK7liqnlm77moIfvvIznlKjmiLfngrnlh7vlsIbmiZPlvIDmjIflrprnmoTnvZHpobXjgIJcbiAqXG4gKiBAbWV0aG9kIGhlbHBcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBleGFtcGxlXG4gKiBjb25zdCB7Y2NjbGFzcywgaGVscH0gPSBjYy5fZGVjb3JhdG9yO1xuICpcbiAqICYjNjQ7Y2NjbGFzc1xuICogJiM2NDtoZWxwKFwiYXBwOi8vZG9jcy9odG1sL2NvbXBvbmVudHMvc3BpbmUuaHRtbFwiKVxuICogY2xhc3MgTmV3U2NyaXB0IGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcbiAqICAgICAvLyAuLi5cbiAqIH1cbiAqIEB0eXBlc2NyaXB0XG4gKiBoZWxwKHBhdGg6IHN0cmluZyk6IEZ1bmN0aW9uXG4gKi9cbnZhciBoZWxwID0gKENDX0RFViA/IGNyZWF0ZUVkaXRvckRlY29yYXRvciA6IGNyZWF0ZUR1bW15RGVjb3JhdG9yKShjaGVja1N0cmluZ0FyZ3VtZW50LCAnaGVscCcpO1xuXG4vLyBPdGhlciBEZWNvcmF0b3JzXG5cbi8qKlxuICogTk9URTo8YnI+XG4gKiBUaGUgb2xkIG1peGlucyBpbXBsZW1lbnRlZCBpbiBjYy5DbGFzcyhFUzUpIGJlaGF2ZXMgZXhhY3QgdGhlIHNhbWUgYXMgbXVsdGlwbGUgaW5oZXJpdGFuY2UuXG4gKiBCdXQgc2luY2UgRVM2LCBjbGFzcyBjb25zdHJ1Y3RvciBjYW4ndCBiZSBmdW5jdGlvbi1jYWxsZWQgYW5kIGNsYXNzIG1ldGhvZHMgYmVjb21lIG5vbi1lbnVtZXJhYmxlLFxuICogc28gd2UgY2FuIG5vdCBtaXggaW4gRVM2IENsYXNzZXMuPGJyPlxuICogU2VlOjxicj5cbiAqIFtodHRwczovL2VzZGlzY3Vzcy5vcmcvdG9waWMvdHJhaXRzLWFyZS1ub3ctaW1wb3NzaWJsZS1pbi1lczYtdW50aWwtZXM3LXNpbmNlLXJldjMyXShodHRwczovL2VzZGlzY3Vzcy5vcmcvdG9waWMvdHJhaXRzLWFyZS1ub3ctaW1wb3NzaWJsZS1pbi1lczYtdW50aWwtZXM3LXNpbmNlLXJldjMyKTxicj5cbiAqIE9uZSBwb3NzaWJsZSBzb2x1dGlvbiAoYnV0IElERSB1bmZyaWVuZGx5KTo8YnI+XG4gKiBbaHR0cDovL2p1c3RpbmZhZ25hbmkuY29tLzIwMTUvMTIvMjEvcmVhbC1taXhpbnMtd2l0aC1qYXZhc2NyaXB0LWNsYXNzZXNdKGh0dHA6Ly9qdXN0aW5mYWduYW5pLmNvbS8yMDE1LzEyLzIxL3JlYWwtbWl4aW5zLXdpdGgtamF2YXNjcmlwdC1jbGFzc2VzLyk8YnI+XG4gKiA8YnI+XG4gKiBOT1RFOjxicj5cbiAqIFlvdSBtdXN0IG1hbnVhbGx5IGNhbGwgbWl4aW5zIGNvbnN0cnVjdG9yLCB0aGlzIGlzIGRpZmZlcmVudCBmcm9tIGNjLkNsYXNzKEVTNSkuXG4gKlxuICogQG1ldGhvZCBtaXhpbnNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IC4uLmN0b3IgLSBjb25zdHJ1Y3RvcnMgdG8gbWl4LCBvbmx5IHN1cHBvcnQgRVM1IGNvbnN0cnVjdG9ycyBvciBjbGFzc2VzIGRlZmluZWQgYnkgdXNpbmcgYGNjLkNsYXNzYCxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3Qgc3VwcG9ydCBFUzYgQ2xhc3Nlcy5cbiAqIEBleGFtcGxlXG4gKiBjb25zdCB7Y2NjbGFzcywgbWl4aW5zfSA9IGNjLl9kZWNvcmF0b3I7XG4gKlxuICogY2xhc3MgQW5pbWFsIHsgLi4uIH1cbiAqXG4gKiBjb25zdCBGbHkgPSBjYy5DbGFzcyh7XG4gKiAgICAgY29uc3RydWN0b3IgKCkgeyAuLi4gfVxuICogfSk7XG4gKlxuICogJiM2NDtjY2NsYXNzXG4gKiAmIzY0O21peGlucyhjYy5FdmVudFRhcmdldCwgRmx5KVxuICogY2xhc3MgQmlyZCBleHRlbmRzIEFuaW1hbCB7XG4gKiAgICAgY29uc3RydWN0b3IgKCkge1xuICogICAgICAgICBzdXBlcigpO1xuICpcbiAqICAgICAgICAgLy8gWW91IG11c3QgbWFudWFsbHkgY2FsbCBtaXhpbnMgY29uc3RydWN0b3IsIHRoaXMgaXMgZGlmZmVyZW50IGZyb20gY2MuQ2xhc3MoRVM1KVxuICogICAgICAgICBjYy5FdmVudFRhcmdldC5jYWxsKHRoaXMpO1xuICogICAgICAgICBGbHkuY2FsbCh0aGlzKTtcbiAqICAgICB9XG4gKiAgICAgLy8gLi4uXG4gKiB9XG4gKiBAdHlwZXNjcmlwdFxuICogbWl4aW5zKGN0b3I6IEZ1bmN0aW9uLCAuLi5yZXN0OiBGdW5jdGlvbltdKTogRnVuY3Rpb25cbiAqL1xuZnVuY3Rpb24gbWl4aW5zICgpIHtcbiAgICB2YXIgbWl4aW5zID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbWl4aW5zW2ldID0gYXJndW1lbnRzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gKGN0b3IpIHtcbiAgICAgICAgdmFyIGNhY2hlID0gZ2V0Q2xhc3NDYWNoZShjdG9yLCAnbWl4aW5zJyk7XG4gICAgICAgIGlmIChjYWNoZSkge1xuICAgICAgICAgICAgZ2V0U3ViRGljdChjYWNoZSwgJ3Byb3RvJykubWl4aW5zID0gbWl4aW5zO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jYy5fZGVjb3JhdG9yID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgY2NjbGFzcyxcbiAgICBwcm9wZXJ0eSxcbiAgICBleGVjdXRlSW5FZGl0TW9kZSxcbiAgICByZXF1aXJlQ29tcG9uZW50LFxuICAgIG1lbnUsXG4gICAgZXhlY3V0aW9uT3JkZXIsXG4gICAgZGlzYWxsb3dNdWx0aXBsZSxcbiAgICBwbGF5T25Gb2N1cyxcbiAgICBpbnNwZWN0b3IsXG4gICAgaWNvbixcbiAgICBoZWxwLFxuICAgIG1peGlucyxcbn07XG5cbi8vIGZpeCBzdWJtb2R1bGUgcG9sbHV0ZSAuLi5cbi8qKlxuICogQHN1Ym1vZHVsZSBjY1xuICovXG4iXSwic291cmNlUm9vdCI6Ii8ifQ==