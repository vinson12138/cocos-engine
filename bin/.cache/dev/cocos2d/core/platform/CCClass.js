
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCClass.js';
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

var Enum = require('./CCEnum');

var utils = require('./utils');

var _isPlainEmptyObj_DEV = utils.isPlainEmptyObj_DEV;
var _cloneable_DEV = utils.cloneable_DEV;

var Attr = require('./attribute');

var DELIMETER = Attr.DELIMETER;

var preprocess = require('./preprocess-class');

require('./requiring-frame');

var BUILTIN_ENTRIES = ['name', 'extends', 'mixins', 'ctor', '__ctor__', 'properties', 'statics', 'editor', '__ES6__'];
var INVALID_STATICS_DEV = CC_DEV && ['name', '__ctors__', '__props__', '__values__', 'arguments', 'call', 'apply', 'caller', 'length', 'prototype'];

function pushUnique(array, item) {
  if (array.indexOf(item) < 0) {
    array.push(item);
  }
}

var deferredInitializer = {
  // Configs for classes which needs deferred initialization
  datas: null,
  // register new class
  // data - {cls: cls, cb: properties, mixins: options.mixins}
  push: function push(data) {
    if (this.datas) {
      this.datas.push(data);
    } else {
      this.datas = [data]; // start a new timer to initialize

      var self = this;
      setTimeout(function () {
        self.init();
      }, 0);
    }
  },
  init: function init() {
    var datas = this.datas;

    if (datas) {
      for (var i = 0; i < datas.length; ++i) {
        var data = datas[i];
        var cls = data.cls;
        var properties = data.props;

        if (typeof properties === 'function') {
          properties = properties();
        }

        var name = js.getClassName(cls);

        if (properties) {
          declareProperties(cls, name, properties, cls.$super, data.mixins);
        } else {
          cc.errorID(3633, name);
        }
      }

      this.datas = null;
    }
  }
}; // both getter and prop must register the name into __props__ array

function appendProp(cls, name) {
  if (CC_DEV) {
    //if (!IDENTIFIER_RE.test(name)) {
    //    cc.error('The property name "' + name + '" is not compliant with JavaScript naming standards');
    //    return;
    //}
    if (name.indexOf('.') !== -1) {
      cc.errorID(3634);
      return;
    }
  }

  pushUnique(cls.__props__, name);
}

function defineProp(cls, className, propName, val, es6) {
  var defaultValue = val["default"];

  if (CC_DEV) {
    if (!es6) {
      // check default object value
      if (typeof defaultValue === 'object' && defaultValue) {
        if (Array.isArray(defaultValue)) {
          // check array empty
          if (defaultValue.length > 0) {
            cc.errorID(3635, className, propName, propName);
            return;
          }
        } else if (!_isPlainEmptyObj_DEV(defaultValue)) {
          // check cloneable
          if (!_cloneable_DEV(defaultValue)) {
            cc.errorID(3636, className, propName, propName);
            return;
          }
        }
      }
    } // check base prototype to avoid name collision


    if (CCClass.getInheritanceChain(cls).some(function (x) {
      return x.prototype.hasOwnProperty(propName);
    })) {
      cc.errorID(3637, className, propName, className);
      return;
    }
  } // set default value


  Attr.setClassAttr(cls, propName, 'default', defaultValue);
  appendProp(cls, propName); // apply attributes

  parseAttributes(cls, val, className, propName, false);

  if (CC_EDITOR && !Editor.isBuilder || CC_TEST) {
    for (var i = 0; i < onAfterProps_ET.length; i++) {
      onAfterProps_ET[i](cls, propName);
    }

    onAfterProps_ET.length = 0;
  }
}

function defineGetSet(cls, name, propName, val, es6) {
  var getter = val.get;
  var setter = val.set;
  var proto = cls.prototype;
  var d = Object.getOwnPropertyDescriptor(proto, propName);
  var setterUndefined = !d;

  if (getter) {
    if (CC_DEV && !es6 && d && d.get) {
      cc.errorID(3638, name, propName);
      return;
    }

    parseAttributes(cls, val, name, propName, true);

    if (CC_EDITOR && !Editor.isBuilder || CC_TEST) {
      onAfterProps_ET.length = 0;
    }

    Attr.setClassAttr(cls, propName, 'serializable', false);

    if (CC_DEV) {
      // 不论是否 visible 都要添加到 props，否则 asset watcher 不能正常工作
      appendProp(cls, propName);
    }

    if (!es6) {
      js.get(proto, propName, getter, setterUndefined, setterUndefined);
    }

    if (CC_EDITOR || CC_DEV) {
      Attr.setClassAttr(cls, propName, 'hasGetter', true); // 方便 editor 做判断
    }
  }

  if (setter) {
    if (!es6) {
      if (CC_DEV && d && d.set) {
        return cc.errorID(3640, name, propName);
      }

      js.set(proto, propName, setter, setterUndefined, setterUndefined);
    }

    if (CC_EDITOR || CC_DEV) {
      Attr.setClassAttr(cls, propName, 'hasSetter', true); // 方便 editor 做判断
    }
  }
}

function getDefault(defaultVal) {
  if (typeof defaultVal === 'function') {
    if (CC_EDITOR) {
      try {
        return defaultVal();
      } catch (e) {
        cc._throw(e);

        return undefined;
      }
    } else {
      return defaultVal();
    }
  }

  return defaultVal;
}

function mixinWithInherited(dest, src, filter) {
  for (var prop in src) {
    if (!dest.hasOwnProperty(prop) && (!filter || filter(prop))) {
      Object.defineProperty(dest, prop, js.getPropertyDescriptor(src, prop));
    }
  }
}

function doDefine(className, baseClass, mixins, options) {
  var shouldAddProtoCtor;
  var __ctor__ = options.__ctor__;
  var ctor = options.ctor;
  var __es6__ = options.__ES6__;

  if (CC_DEV) {
    // check ctor
    var ctorToUse = __ctor__ || ctor;

    if (ctorToUse) {
      if (CCClass._isCCClass(ctorToUse)) {
        cc.errorID(3618, className);
      } else if (typeof ctorToUse !== 'function') {
        cc.errorID(3619, className);
      } else {
        if (baseClass && /\bprototype.ctor\b/.test(ctorToUse)) {
          if (__es6__) {
            cc.errorID(3651, className || "");
          } else {
            cc.warnID(3600, className || "");
            shouldAddProtoCtor = true;
          }
        }
      }

      if (ctor) {
        if (__ctor__) {
          cc.errorID(3649, className);
        } else {
          ctor = options.ctor = _validateCtor_DEV(ctor, baseClass, className, options);
        }
      }
    }
  }

  var ctors;
  var fireClass;

  if (__es6__) {
    ctors = [ctor];
    fireClass = ctor;
  } else {
    ctors = __ctor__ ? [__ctor__] : _getAllCtors(baseClass, mixins, options);
    fireClass = _createCtor(ctors, baseClass, className, options); // extend - Create a new Class that inherits from this Class

    js.value(fireClass, 'extend', function (options) {
      options["extends"] = this;
      return CCClass(options);
    }, true);
  }

  js.value(fireClass, '__ctors__', ctors.length > 0 ? ctors : null, true);
  var prototype = fireClass.prototype;

  if (baseClass) {
    if (!__es6__) {
      js.extend(fireClass, baseClass); // 这里会把父类的 __props__ 复制给子类

      prototype = fireClass.prototype; // get extended prototype
    }

    fireClass.$super = baseClass;

    if (CC_DEV && shouldAddProtoCtor) {
      prototype.ctor = function () {};
    }
  }

  if (mixins) {
    for (var m = mixins.length - 1; m >= 0; m--) {
      var mixin = mixins[m];
      mixinWithInherited(prototype, mixin.prototype); // mixin statics (this will also copy editor attributes for component)

      mixinWithInherited(fireClass, mixin, function (prop) {
        return mixin.hasOwnProperty(prop) && (!CC_DEV || INVALID_STATICS_DEV.indexOf(prop) < 0);
      }); // mixin attributes

      if (CCClass._isCCClass(mixin)) {
        mixinWithInherited(Attr.getClassAttrs(fireClass), Attr.getClassAttrs(mixin));
      }
    } // restore constuctor overridden by mixin


    prototype.constructor = fireClass;
  }

  if (!__es6__) {
    prototype.__initProps__ = compileProps;
  }

  js.setClassName(className, fireClass);
  return fireClass;
}

function define(className, baseClass, mixins, options) {
  var Component = cc.Component;

  var frame = cc._RF.peek();

  if (frame && js.isChildClassOf(baseClass, Component)) {
    // project component
    if (js.isChildClassOf(frame.cls, Component)) {
      cc.errorID(3615);
      return null;
    }

    if (CC_DEV && frame.uuid && className) {
      cc.warnID(3616, className);
    }

    className = className || frame.script;
  }

  var cls = doDefine(className, baseClass, mixins, options);

  if (frame) {
    if (js.isChildClassOf(baseClass, Component)) {
      var uuid = frame.uuid;

      if (uuid) {
        js._setClassId(uuid, cls);

        if (CC_EDITOR) {
          Component._addMenuItem(cls, 'i18n:MAIN_MENU.component.scripts/' + className, -1);

          cls.prototype.__scriptUuid = Editor.Utils.UuidUtils.decompressUuid(uuid);
        }
      }

      frame.cls = cls;
    } else if (!js.isChildClassOf(frame.cls, Component)) {
      frame.cls = cls;
    }
  }

  return cls;
}

function normalizeClassName_DEV(className) {
  var DefaultName = 'CCClass';

  if (className) {
    className = className.replace(/^[^$A-Za-z_]/, '_').replace(/[^0-9A-Za-z_$]/g, '_');

    try {
      // validate name
      Function('function ' + className + '(){}')();
      return className;
    } catch (e) {
      ;
    }
  }

  return DefaultName;
}

function getNewValueTypeCodeJit(value) {
  var clsName = js.getClassName(value);
  var type = value.constructor;
  var res = 'new ' + clsName + '(';

  for (var i = 0; i < type.__props__.length; i++) {
    var prop = type.__props__[i];
    var propVal = value[prop];

    if (CC_DEV && typeof propVal === 'object') {
      cc.errorID(3641, clsName);
      return 'new ' + clsName + '()';
    }

    res += propVal;

    if (i < type.__props__.length - 1) {
      res += ',';
    }
  }

  return res + ')';
} // TODO - move escapeForJS, IDENTIFIER_RE, getNewValueTypeCodeJit to misc.js or a new source file
// convert a normal string including newlines, quotes and unicode characters into a string literal
// ready to use in JavaScript source


function escapeForJS(s) {
  return JSON.stringify(s). // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
  replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

function getInitPropsJit(attrs, propList) {
  // functions for generated code
  var F = [];
  var func = '';

  for (var i = 0; i < propList.length; i++) {
    var prop = propList[i];
    var attrKey = prop + DELIMETER + 'default';

    if (attrKey in attrs) {
      // getter does not have default
      var statement;

      if (IDENTIFIER_RE.test(prop)) {
        statement = 'this.' + prop + '=';
      } else {
        statement = 'this[' + escapeForJS(prop) + ']=';
      }

      var expression;
      var def = attrs[attrKey];

      if (typeof def === 'object' && def) {
        if (def instanceof cc.ValueType) {
          expression = getNewValueTypeCodeJit(def);
        } else if (Array.isArray(def)) {
          expression = '[]';
        } else {
          expression = '{}';
        }
      } else if (typeof def === 'function') {
        var index = F.length;
        F.push(def);
        expression = 'F[' + index + ']()';

        if (CC_EDITOR) {
          func += 'try {\n' + statement + expression + ';\n}\ncatch(e) {\ncc._throw(e);\n' + statement + 'undefined;\n}\n';
          continue;
        }
      } else if (typeof def === 'string') {
        expression = escapeForJS(def);
      } else {
        // number, boolean, null, undefined
        expression = def;
      }

      statement = statement + expression + ';\n';
      func += statement;
    }
  } // if (CC_TEST && !isPhantomJS) {
  //     console.log(func);
  // }


  var initProps;

  if (F.length === 0) {
    initProps = Function(func);
  } else {
    initProps = Function('F', 'return (function(){\n' + func + '})')(F);
  }

  return initProps;
}

function getInitProps(attrs, propList) {
  var props = null;
  var simpleEnd = 0;
  var valueTypeEnd = 0;

  (function () {
    // triage properties
    var simples = null;
    var valueTypes = null;
    var advanceds = null;

    for (var i = 0; i < propList.length; ++i) {
      var prop = propList[i];
      var attrKey = prop + DELIMETER + 'default';

      if (attrKey in attrs) {
        // getter does not have default
        var def = attrs[attrKey];

        if (typeof def === 'object' && def || typeof def === 'function') {
          if (def instanceof cc.ValueType) {
            if (!valueTypes) {
              valueTypes = [];
            }

            valueTypes.push(prop, def);
          } else {
            if (!advanceds) {
              advanceds = [];
            }

            advanceds.push(prop, def);
          }
        } else {
          // number, boolean, null, undefined, string
          if (!simples) {
            simples = [];
          }

          simples.push(prop, def);
        }
      }
    } // concat in compact memory


    simpleEnd = simples ? simples.length : 0;
    valueTypeEnd = simpleEnd + (valueTypes ? valueTypes.length : 0);
    var totalLength = valueTypeEnd + (advanceds ? advanceds.length : 0);
    props = new Array(totalLength);

    for (var _i = 0; _i < simpleEnd; ++_i) {
      props[_i] = simples[_i];
    }

    for (var _i2 = simpleEnd; _i2 < valueTypeEnd; ++_i2) {
      props[_i2] = valueTypes[_i2 - simpleEnd];
    }

    for (var _i3 = valueTypeEnd; _i3 < totalLength; ++_i3) {
      props[_i3] = advanceds[_i3 - valueTypeEnd];
    }
  })();

  return function () {
    var i = 0;

    for (; i < simpleEnd; i += 2) {
      this[props[i]] = props[i + 1];
    }

    for (; i < valueTypeEnd; i += 2) {
      this[props[i]] = props[i + 1].clone();
    }

    for (; i < props.length; i += 2) {
      var def = props[i + 1];

      if (Array.isArray(def)) {
        this[props[i]] = [];
      } else {
        var value;

        if (typeof def === 'object') {
          value = {};
        } else {
          // def is function
          if (CC_EDITOR) {
            try {
              value = def();
            } catch (err) {
              cc._throw(e);

              continue;
            }
          } else {
            value = def();
          }
        }

        this[props[i]] = value;
      }
    }
  };
} // simple test variable name


var IDENTIFIER_RE = /^[A-Za-z_$][0-9A-Za-z_$]*$/;

function compileProps(actualClass) {
  // init deferred properties
  var attrs = Attr.getClassAttrs(actualClass);
  var propList = actualClass.__props__;

  if (propList === null) {
    deferredInitializer.init();
    propList = actualClass.__props__;
  } // Overwite __initProps__ to avoid compile again.


  var initProps = CC_SUPPORT_JIT ? getInitPropsJit(attrs, propList) : getInitProps(attrs, propList);
  actualClass.prototype.__initProps__ = initProps; // call instantiateProps immediately, no need to pass actualClass into it anymore
  // (use call to manually bind `this` because `this` may not instanceof actualClass)

  initProps.call(this);
}

var _createCtor = CC_SUPPORT_JIT ? function (ctors, baseClass, className, options) {
  var superCallBounded = baseClass && boundSuperCalls(baseClass, options, className);
  var ctorName = CC_DEV ? normalizeClassName_DEV(className) : 'CCClass';
  var body = 'return function ' + ctorName + '(){\n';

  if (superCallBounded) {
    body += 'this._super=null;\n';
  } // instantiate props


  body += 'this.__initProps__(' + ctorName + ');\n'; // call user constructors

  var ctorLen = ctors.length;

  if (ctorLen > 0) {
    var useTryCatch = CC_DEV && !(className && className.startsWith('cc.'));

    if (useTryCatch) {
      body += 'try{\n';
    }

    var SNIPPET = '].apply(this,arguments);\n';

    if (ctorLen === 1) {
      body += ctorName + '.__ctors__[0' + SNIPPET;
    } else {
      body += 'var cs=' + ctorName + '.__ctors__;\n';

      for (var i = 0; i < ctorLen; i++) {
        body += 'cs[' + i + SNIPPET;
      }
    }

    if (useTryCatch) {
      body += '}catch(e){\n' + 'cc._throw(e);\n' + '}\n';
    }
  }

  body += '}';
  return Function(body)();
} : function (ctors, baseClass, className, options) {
  var superCallBounded = baseClass && boundSuperCalls(baseClass, options, className);
  var ctorLen = ctors.length;

  var _Class5;

  if (ctorLen > 0) {
    if (superCallBounded) {
      if (ctorLen === 2) {
        // User Component
        _Class5 = function Class() {
          this._super = null;

          this.__initProps__(_Class5);

          ctors[0].apply(this, arguments);
          ctors[1].apply(this, arguments);
        };
      } else {
        _Class5 = function _Class() {
          this._super = null;

          this.__initProps__(_Class5);

          for (var i = 0; i < ctors.length; ++i) {
            ctors[i].apply(this, arguments);
          }
        };
      }
    } else {
      if (ctorLen === 3) {
        // Node
        _Class5 = function _Class2() {
          this.__initProps__(_Class5);

          ctors[0].apply(this, arguments);
          ctors[1].apply(this, arguments);
          ctors[2].apply(this, arguments);
        };
      } else {
        _Class5 = function _Class3() {
          this.__initProps__(_Class5);

          var ctors = _Class5.__ctors__;

          for (var i = 0; i < ctors.length; ++i) {
            ctors[i].apply(this, arguments);
          }
        };
      }
    }
  } else {
    _Class5 = function _Class4() {
      if (superCallBounded) {
        this._super = null;
      }

      this.__initProps__(_Class5);
    };
  }

  return _Class5;
};

function _validateCtor_DEV(ctor, baseClass, className, options) {
  if (CC_EDITOR && baseClass) {
    // check super call in constructor
    var originCtor = ctor;

    if (SuperCallReg.test(ctor)) {
      if (options.__ES6__) {
        cc.errorID(3651, className);
      } else {
        cc.warnID(3600, className); // suppresss super call

        ctor = function ctor() {
          this._super = function () {};

          var ret = originCtor.apply(this, arguments);
          this._super = null;
          return ret;
        };
      }
    }
  } // check ctor


  if (ctor.length > 0 && (!className || !className.startsWith('cc.'))) {
    // To make a unified CCClass serialization process,
    // we don't allow parameters for constructor when creating instances of CCClass.
    // For advanced user, construct arguments can still get from 'arguments'.
    cc.warnID(3617, className);
  }

  return ctor;
}

function _getAllCtors(baseClass, mixins, options) {
  // get base user constructors
  function getCtors(cls) {
    if (CCClass._isCCClass(cls)) {
      return cls.__ctors__ || [];
    } else {
      return [cls];
    }
  }

  var ctors = []; // if (options.__ES6__) {
  //     if (mixins) {
  //         let baseOrMixins = getCtors(baseClass);
  //         for (let b = 0; b < mixins.length; b++) {
  //             let mixin = mixins[b];
  //             if (mixin) {
  //                 let baseCtors = getCtors(mixin);
  //                 for (let c = 0; c < baseCtors.length; c++) {
  //                     if (baseOrMixins.indexOf(baseCtors[c]) < 0) {
  //                         pushUnique(ctors, baseCtors[c]);
  //                     }
  //                 }
  //             }
  //         }
  //     }
  // }
  // else {

  var baseOrMixins = [baseClass].concat(mixins);

  for (var b = 0; b < baseOrMixins.length; b++) {
    var baseOrMixin = baseOrMixins[b];

    if (baseOrMixin) {
      var baseCtors = getCtors(baseOrMixin);

      for (var c = 0; c < baseCtors.length; c++) {
        pushUnique(ctors, baseCtors[c]);
      }
    }
  } // }
  // append subclass user constructors


  var ctor = options.ctor;

  if (ctor) {
    ctors.push(ctor);
  }

  return ctors;
}

var SuperCallReg = /xyz/.test(function () {
  xyz;
}) ? /\b\._super\b/ : /.*/;
var SuperCallRegStrict = /xyz/.test(function () {
  xyz;
}) ? /this\._super\s*\(/ : /(NONE){99}/;

function boundSuperCalls(baseClass, options, className) {
  var hasSuperCall = false;

  for (var funcName in options) {
    if (BUILTIN_ENTRIES.indexOf(funcName) >= 0) {
      continue;
    }

    var func = options[funcName];

    if (typeof func !== 'function') {
      continue;
    }

    var pd = js.getPropertyDescriptor(baseClass.prototype, funcName);

    if (pd) {
      var superFunc = pd.value; // ignore pd.get, assume that function defined by getter is just for warnings

      if (typeof superFunc === 'function') {
        if (SuperCallReg.test(func)) {
          hasSuperCall = true; // boundSuperCall

          options[funcName] = function (superFunc, func) {
            return function () {
              var tmp = this._super; // Add a new ._super() method that is the same method but on the super-Class

              this._super = superFunc;
              var ret = func.apply(this, arguments); // The method only need to be bound temporarily, so we remove it when we're done executing

              this._super = tmp;
              return ret;
            };
          }(superFunc, func);
        }

        continue;
      }
    }

    if (CC_DEV && SuperCallRegStrict.test(func)) {
      cc.warnID(3620, className, funcName);
    }
  }

  return hasSuperCall;
}

function declareProperties(cls, className, properties, baseClass, mixins, es6) {
  cls.__props__ = [];

  if (baseClass && baseClass.__props__) {
    cls.__props__ = baseClass.__props__.slice();
  }

  if (mixins) {
    for (var m = 0; m < mixins.length; ++m) {
      var mixin = mixins[m];

      if (mixin.__props__) {
        cls.__props__ = cls.__props__.concat(mixin.__props__.filter(function (x) {
          return cls.__props__.indexOf(x) < 0;
        }));
      }
    }
  }

  if (properties) {
    // 预处理属性
    preprocess.preprocessAttrs(properties, className, cls, es6);

    for (var propName in properties) {
      var val = properties[propName];

      if ('default' in val) {
        defineProp(cls, className, propName, val, es6);
      } else {
        defineGetSet(cls, className, propName, val, es6);
      }
    }
  }

  var attrs = Attr.getClassAttrs(cls);
  cls.__values__ = cls.__props__.filter(function (prop) {
    return attrs[prop + DELIMETER + 'serializable'] !== false;
  });
}
/**
 * @module cc
 */

/**
 * !#en Defines a CCClass using the given specification, please see [Class](/docs/editors_and_tools/creator-chapters/scripting/class.html) for details.
 * !#zh 定义一个 CCClass，传入参数必须是一个包含类型参数的字面量对象，具体用法请查阅[类型定义](/docs/creator/scripting/class.html)。
 *
 * @method Class
 *
 * @param {Object} [options]
 * @param {String} [options.name] - The class name used for serialization.
 * @param {Function} [options.extends] - The base class.
 * @param {Function} [options.ctor] - The constructor.
 * @param {Function} [options.__ctor__] - The same as ctor, but less encapsulated.
 * @param {Object} [options.properties] - The property definitions.
 * @param {Object} [options.statics] - The static members.
 * @param {Function[]} [options.mixins]
 *
 * @param {Object} [options.editor] - attributes for Component listed below.
 * @param {Boolean} [options.editor.executeInEditMode=false] - Allows the current component to run in edit mode. By default, all components are executed only at runtime, meaning that they will not have their callback functions executed while the Editor is in edit mode.
 * @param {Function} [options.editor.requireComponent] - Automatically add required component as a dependency.
 * @param {String} [options.editor.menu] - The menu path to register a component to the editors "Component" menu. Eg. "Rendering/Camera".
 * @param {Number} [options.editor.executionOrder=0] - The execution order of lifecycle methods for Component. Those less than 0 will execute before while those greater than 0 will execute after. The order will only affect onLoad, onEnable, start, update and lateUpdate while onDisable and onDestroy will not be affected.
 * @param {Boolean} [options.editor.disallowMultiple] - If specified to a type, prevents Component of the same type (or subtype) to be added more than once to a Node.
 * @param {Boolean} [options.editor.playOnFocus=false] - This property is only available when executeInEditMode is set. If specified, the editor's scene view will keep updating this node in 60 fps when it is selected, otherwise, it will update only if necessary.
 * @param {String} [options.editor.inspector] - Customize the page url used by the current component to render in the Properties.
 * @param {String} [options.editor.icon] - Customize the icon that the current component displays in the editor.
 * @param {String} [options.editor.help] - The custom documentation URL
 *
 * @param {Function} [options.update] - lifecycle method for Component, see {{#crossLink "Component/update:method"}}{{/crossLink}}
 * @param {Function} [options.lateUpdate] - lifecycle method for Component, see {{#crossLink "Component/lateUpdate:method"}}{{/crossLink}}
 * @param {Function} [options.onLoad] - lifecycle method for Component, see {{#crossLink "Component/onLoad:method"}}{{/crossLink}}
 * @param {Function} [options.start] - lifecycle method for Component, see {{#crossLink "Component/start:method"}}{{/crossLink}}
 * @param {Function} [options.onEnable] - lifecycle method for Component, see {{#crossLink "Component/onEnable:method"}}{{/crossLink}}
 * @param {Function} [options.onDisable] - lifecycle method for Component, see {{#crossLink "Component/onDisable:method"}}{{/crossLink}}
 * @param {Function} [options.onDestroy] - lifecycle method for Component, see {{#crossLink "Component/onDestroy:method"}}{{/crossLink}}
 * @param {Function} [options.onFocusInEditor] - lifecycle method for Component, see {{#crossLink "Component/onFocusInEditor:method"}}{{/crossLink}}
 * @param {Function} [options.onLostFocusInEditor] - lifecycle method for Component, see {{#crossLink "Component/onLostFocusInEditor:method"}}{{/crossLink}}
 * @param {Function} [options.resetInEditor] - lifecycle method for Component, see {{#crossLink "Component/resetInEditor:method"}}{{/crossLink}}
 * @param {Function} [options.onRestore] - for Component only, see {{#crossLink "Component/onRestore:method"}}{{/crossLink}}
 * @param {Function} [options._getLocalBounds] - for Component only, see {{#crossLink "Component/_getLocalBounds:method"}}{{/crossLink}}
 *
 * @return {Function} - the created class
 *
 * @example

 // define base class
 var Node = cc.Class();

 // define sub class
 var Sprite = cc.Class({
     name: 'Sprite',
     extends: Node,

     ctor: function () {
         this.url = "";
         this.id = 0;
     },

     statics: {
         // define static members
         count: 0,
         getBounds: function (spriteList) {
             // compute bounds...
         }
     },

     properties {
         width: {
             default: 128,
             type: cc.Integer,
             tooltip: 'The width of sprite'
         },
         height: 128,
         size: {
             get: function () {
                 return cc.v2(this.width, this.height);
             }
         }
     },

     load: function () {
         // load this.url...
     };
 });

 // instantiate

 var obj = new Sprite();
 obj.url = 'sprite.png';
 obj.load();
 */


function CCClass(options) {
  options = options || {};
  var name = options.name;
  var base = options["extends"]
  /* || CCObject*/
  ;
  var mixins = options.mixins; // create constructor

  var cls = define(name, base, mixins, options);

  if (!name) {
    name = cc.js.getClassName(cls);
  }

  cls._sealed = true;

  if (base) {
    base._sealed = false;
  } // define Properties


  var properties = options.properties;

  if (typeof properties === 'function' || base && base.__props__ === null || mixins && mixins.some(function (x) {
    return x.__props__ === null;
  })) {
    if (CC_DEV && options.__ES6__) {
      cc.error('not yet implement deferred properties for ES6 Classes');
    } else {
      deferredInitializer.push({
        cls: cls,
        props: properties,
        mixins: mixins
      });
      cls.__props__ = cls.__values__ = null;
    }
  } else {
    declareProperties(cls, name, properties, base, options.mixins, options.__ES6__);
  } // define statics


  var statics = options.statics;

  if (statics) {
    var staticPropName;

    if (CC_DEV) {
      for (staticPropName in statics) {
        if (INVALID_STATICS_DEV.indexOf(staticPropName) !== -1) {
          cc.errorID(3642, name, staticPropName, staticPropName);
        }
      }
    }

    for (staticPropName in statics) {
      cls[staticPropName] = statics[staticPropName];
    }
  } // define functions


  for (var funcName in options) {
    if (BUILTIN_ENTRIES.indexOf(funcName) >= 0) {
      continue;
    }

    var func = options[funcName];

    if (!preprocess.validateMethodWithProps(func, funcName, name, cls, base)) {
      continue;
    } // use value to redefine some super method defined as getter


    js.value(cls.prototype, funcName, func, true, true);
  }

  var editor = options.editor;

  if (editor) {
    cc.Component._registerEditorProps(cls, editor);
  }

  return cls;
}
/**
 * Checks whether the constructor is created by cc.Class
 *
 * @method _isCCClass
 * @param {Function} constructor
 * @return {Boolean}
 * @private
 */


CCClass._isCCClass = function (constructor) {
  return constructor && constructor.hasOwnProperty('__ctors__'); // is not inherited __ctors__
}; //
// Optimized define function only for internal classes
//
// @method _fastDefine
// @param {String} className
// @param {Function} constructor
// @param {Object} serializableFields
// @private
//


CCClass._fastDefine = function (className, constructor, serializableFields) {
  js.setClassName(className, constructor); //constructor.__ctors__ = constructor.__ctors__ || null;

  var props = constructor.__props__ = constructor.__values__ = Object.keys(serializableFields);
  var attrs = Attr.getClassAttrs(constructor);

  for (var i = 0; i < props.length; i++) {
    var key = props[i];
    attrs[key + DELIMETER + 'visible'] = false;
    attrs[key + DELIMETER + 'default'] = serializableFields[key];
  }
};

CCClass.Attr = Attr;
CCClass.attr = Attr.attr;
/*
 * Return all super classes
 * @method getInheritanceChain
 * @param {Function} constructor
 * @return {Function[]}
 */

CCClass.getInheritanceChain = function (klass) {
  var chain = [];

  for (;;) {
    klass = js.getSuper(klass);

    if (!klass) {
      break;
    }

    if (klass !== Object) {
      chain.push(klass);
    }
  }

  return chain;
};

var PrimitiveTypes = {
  // Specify that the input value must be integer in Properties.
  // Also used to indicates that the type of elements in array or the type of value in dictionary is integer.
  Integer: 'Number',
  // Indicates that the type of elements in array or the type of value in dictionary is double.
  Float: 'Number',
  Boolean: 'Boolean',
  String: 'String'
};
var onAfterProps_ET = [];

function parseAttributes(cls, attributes, className, propName, usedInGetter) {
  var ERR_Type = CC_DEV ? 'The %s of %s must be type %s' : '';
  var attrs = null;
  var propNamePrefix = '';

  function initAttrs() {
    propNamePrefix = propName + DELIMETER;
    return attrs = Attr.getClassAttrs(cls);
  }

  if (CC_EDITOR && !Editor.isBuilder || CC_TEST) {
    onAfterProps_ET.length = 0;
  }

  var type = attributes.type;

  if (type) {
    var primitiveType = PrimitiveTypes[type];

    if (primitiveType) {
      (attrs || initAttrs())[propNamePrefix + 'type'] = type;

      if ((CC_EDITOR && !Editor.isBuilder || CC_TEST) && !attributes._short) {
        onAfterProps_ET.push(Attr.getTypeChecker_ET(primitiveType, 'cc.' + type));
      }
    } else if (type === 'Object') {
      if (CC_DEV) {
        cc.errorID(3644, className, propName);
      }
    } else {
      if (type === Attr.ScriptUuid) {
        (attrs || initAttrs())[propNamePrefix + 'type'] = 'Script';
        attrs[propNamePrefix + 'ctor'] = cc.ScriptAsset;
      } else {
        if (typeof type === 'object') {
          if (Enum.isEnum(type)) {
            (attrs || initAttrs())[propNamePrefix + 'type'] = 'Enum';
            attrs[propNamePrefix + 'enumList'] = Enum.getList(type);
          } else if (CC_DEV) {
            cc.errorID(3645, className, propName, type);
          }
        } else if (typeof type === 'function') {
          (attrs || initAttrs())[propNamePrefix + 'type'] = 'Object';
          attrs[propNamePrefix + 'ctor'] = type;

          if ((CC_EDITOR && !Editor.isBuilder || CC_TEST) && !attributes._short) {
            onAfterProps_ET.push(Attr.getObjTypeChecker_ET(type));
          }
        } else if (CC_DEV) {
          cc.errorID(3646, className, propName, type);
        }
      }
    }
  }

  function parseSimpleAttr(attrName, expectType) {
    if (attrName in attributes) {
      var val = attributes[attrName];

      if (typeof val === expectType) {
        (attrs || initAttrs())[propNamePrefix + attrName] = val;
      } else if (CC_DEV) {
        cc.error(ERR_Type, attrName, className, propName, expectType);
      }
    }
  }

  if (attributes.editorOnly) {
    if (CC_DEV && usedInGetter) {
      cc.errorID(3613, "editorOnly", name, propName);
    } else {
      (attrs || initAttrs())[propNamePrefix + 'editorOnly'] = true;
    }
  } //parseSimpleAttr('preventDeferredLoad', 'boolean');


  if (CC_DEV) {
    parseSimpleAttr('displayName', 'string');
    parseSimpleAttr('multiline', 'boolean');

    if (attributes.readonly) {
      (attrs || initAttrs())[propNamePrefix + 'readonly'] = true;
    }

    parseSimpleAttr('tooltip', 'string');
    parseSimpleAttr('slide', 'boolean');
  }

  if (attributes.serializable === false) {
    if (CC_DEV && usedInGetter) {
      cc.errorID(3613, "serializable", name, propName);
    } else {
      (attrs || initAttrs())[propNamePrefix + 'serializable'] = false;
    }
  } // if (CC_BUILD || CC_TEST) {
  //     let fsa = attributes.formerlySerializedAs;
  //     if (fsa) {
  //         // js.set(cls.prototype, fsa, function (val) {
  //         //     this[propName] = val;
  //         // });
  //         (attrs || initAttrs())[propNamePrefix + 'formerlySerializedAs'] = fsa;
  //         // used by deserialize-compiled
  //         attrs[fsa + DELIMETER + 'deserializeAs'] = propName;
  //         cls.__FSA__ = true;     // inheritable
  //     }
  // }
  // else {
  //     parseSimpleAttr('formerlySerializedAs', 'string');
  // }


  parseSimpleAttr('formerlySerializedAs', 'string');

  if (CC_EDITOR) {
    parseSimpleAttr('notifyFor', 'string');

    if ('animatable' in attributes) {
      (attrs || initAttrs())[propNamePrefix + 'animatable'] = !!attributes.animatable;
    }
  }

  if (CC_DEV) {
    var visible = attributes.visible;

    if (typeof visible !== 'undefined') {
      if (!visible) {
        (attrs || initAttrs())[propNamePrefix + 'visible'] = false;
      } else if (typeof visible === 'function') {
        (attrs || initAttrs())[propNamePrefix + 'visible'] = visible;
      }
    } else {
      var startsWithUS = propName.charCodeAt(0) === 95;

      if (startsWithUS) {
        (attrs || initAttrs())[propNamePrefix + 'visible'] = false;
      }
    }
  }

  var range = attributes.range;

  if (range) {
    if (Array.isArray(range)) {
      if (range.length >= 2) {
        (attrs || initAttrs())[propNamePrefix + 'min'] = range[0];
        attrs[propNamePrefix + 'max'] = range[1];

        if (range.length > 2) {
          attrs[propNamePrefix + 'step'] = range[2];
        }
      } else if (CC_DEV) {
        cc.errorID(3647);
      }
    } else if (CC_DEV) {
      cc.error(ERR_Type, 'range', className, propName, 'array');
    }
  }

  parseSimpleAttr('min', 'number');
  parseSimpleAttr('max', 'number');
  parseSimpleAttr('step', 'number');
  parseSimpleAttr('userData', 'object');
}

cc.Class = CCClass;
module.exports = {
  isArray: function isArray(defaultVal) {
    defaultVal = getDefault(defaultVal);
    return Array.isArray(defaultVal);
  },
  fastDefine: CCClass._fastDefine,
  getNewValueTypeCode: CC_SUPPORT_JIT && getNewValueTypeCodeJit,
  IDENTIFIER_RE: IDENTIFIER_RE,
  escapeForJS: escapeForJS,
  getDefault: getDefault
};

if (CC_TEST) {
  js.mixin(CCClass, module.exports);
}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BsYXRmb3JtL0NDQ2xhc3MuanMiXSwibmFtZXMiOlsianMiLCJyZXF1aXJlIiwiRW51bSIsInV0aWxzIiwiX2lzUGxhaW5FbXB0eU9ial9ERVYiLCJpc1BsYWluRW1wdHlPYmpfREVWIiwiX2Nsb25lYWJsZV9ERVYiLCJjbG9uZWFibGVfREVWIiwiQXR0ciIsIkRFTElNRVRFUiIsInByZXByb2Nlc3MiLCJCVUlMVElOX0VOVFJJRVMiLCJJTlZBTElEX1NUQVRJQ1NfREVWIiwiQ0NfREVWIiwicHVzaFVuaXF1ZSIsImFycmF5IiwiaXRlbSIsImluZGV4T2YiLCJwdXNoIiwiZGVmZXJyZWRJbml0aWFsaXplciIsImRhdGFzIiwiZGF0YSIsInNlbGYiLCJzZXRUaW1lb3V0IiwiaW5pdCIsImkiLCJsZW5ndGgiLCJjbHMiLCJwcm9wZXJ0aWVzIiwicHJvcHMiLCJuYW1lIiwiZ2V0Q2xhc3NOYW1lIiwiZGVjbGFyZVByb3BlcnRpZXMiLCIkc3VwZXIiLCJtaXhpbnMiLCJjYyIsImVycm9ySUQiLCJhcHBlbmRQcm9wIiwiX19wcm9wc19fIiwiZGVmaW5lUHJvcCIsImNsYXNzTmFtZSIsInByb3BOYW1lIiwidmFsIiwiZXM2IiwiZGVmYXVsdFZhbHVlIiwiQXJyYXkiLCJpc0FycmF5IiwiQ0NDbGFzcyIsImdldEluaGVyaXRhbmNlQ2hhaW4iLCJzb21lIiwieCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5Iiwic2V0Q2xhc3NBdHRyIiwicGFyc2VBdHRyaWJ1dGVzIiwiQ0NfRURJVE9SIiwiRWRpdG9yIiwiaXNCdWlsZGVyIiwiQ0NfVEVTVCIsIm9uQWZ0ZXJQcm9wc19FVCIsImRlZmluZUdldFNldCIsImdldHRlciIsImdldCIsInNldHRlciIsInNldCIsInByb3RvIiwiZCIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsInNldHRlclVuZGVmaW5lZCIsImdldERlZmF1bHQiLCJkZWZhdWx0VmFsIiwiZSIsIl90aHJvdyIsInVuZGVmaW5lZCIsIm1peGluV2l0aEluaGVyaXRlZCIsImRlc3QiLCJzcmMiLCJmaWx0ZXIiLCJwcm9wIiwiZGVmaW5lUHJvcGVydHkiLCJnZXRQcm9wZXJ0eURlc2NyaXB0b3IiLCJkb0RlZmluZSIsImJhc2VDbGFzcyIsIm9wdGlvbnMiLCJzaG91bGRBZGRQcm90b0N0b3IiLCJfX2N0b3JfXyIsImN0b3IiLCJfX2VzNl9fIiwiX19FUzZfXyIsImN0b3JUb1VzZSIsIl9pc0NDQ2xhc3MiLCJ0ZXN0Iiwid2FybklEIiwiX3ZhbGlkYXRlQ3Rvcl9ERVYiLCJjdG9ycyIsImZpcmVDbGFzcyIsIl9nZXRBbGxDdG9ycyIsIl9jcmVhdGVDdG9yIiwidmFsdWUiLCJleHRlbmQiLCJtIiwibWl4aW4iLCJnZXRDbGFzc0F0dHJzIiwiY29uc3RydWN0b3IiLCJfX2luaXRQcm9wc19fIiwiY29tcGlsZVByb3BzIiwic2V0Q2xhc3NOYW1lIiwiZGVmaW5lIiwiQ29tcG9uZW50IiwiZnJhbWUiLCJfUkYiLCJwZWVrIiwiaXNDaGlsZENsYXNzT2YiLCJ1dWlkIiwic2NyaXB0IiwiX3NldENsYXNzSWQiLCJfYWRkTWVudUl0ZW0iLCJfX3NjcmlwdFV1aWQiLCJVdGlscyIsIlV1aWRVdGlscyIsImRlY29tcHJlc3NVdWlkIiwibm9ybWFsaXplQ2xhc3NOYW1lX0RFViIsIkRlZmF1bHROYW1lIiwicmVwbGFjZSIsIkZ1bmN0aW9uIiwiZ2V0TmV3VmFsdWVUeXBlQ29kZUppdCIsImNsc05hbWUiLCJ0eXBlIiwicmVzIiwicHJvcFZhbCIsImVzY2FwZUZvckpTIiwicyIsIkpTT04iLCJzdHJpbmdpZnkiLCJnZXRJbml0UHJvcHNKaXQiLCJhdHRycyIsInByb3BMaXN0IiwiRiIsImZ1bmMiLCJhdHRyS2V5Iiwic3RhdGVtZW50IiwiSURFTlRJRklFUl9SRSIsImV4cHJlc3Npb24iLCJkZWYiLCJWYWx1ZVR5cGUiLCJpbmRleCIsImluaXRQcm9wcyIsImdldEluaXRQcm9wcyIsInNpbXBsZUVuZCIsInZhbHVlVHlwZUVuZCIsInNpbXBsZXMiLCJ2YWx1ZVR5cGVzIiwiYWR2YW5jZWRzIiwidG90YWxMZW5ndGgiLCJjbG9uZSIsImVyciIsImFjdHVhbENsYXNzIiwiQ0NfU1VQUE9SVF9KSVQiLCJjYWxsIiwic3VwZXJDYWxsQm91bmRlZCIsImJvdW5kU3VwZXJDYWxscyIsImN0b3JOYW1lIiwiYm9keSIsImN0b3JMZW4iLCJ1c2VUcnlDYXRjaCIsInN0YXJ0c1dpdGgiLCJTTklQUEVUIiwiQ2xhc3MiLCJfc3VwZXIiLCJhcHBseSIsImFyZ3VtZW50cyIsIl9fY3RvcnNfXyIsIm9yaWdpbkN0b3IiLCJTdXBlckNhbGxSZWciLCJyZXQiLCJnZXRDdG9ycyIsImJhc2VPck1peGlucyIsImNvbmNhdCIsImIiLCJiYXNlT3JNaXhpbiIsImJhc2VDdG9ycyIsImMiLCJ4eXoiLCJTdXBlckNhbGxSZWdTdHJpY3QiLCJoYXNTdXBlckNhbGwiLCJmdW5jTmFtZSIsInBkIiwic3VwZXJGdW5jIiwidG1wIiwic2xpY2UiLCJwcmVwcm9jZXNzQXR0cnMiLCJfX3ZhbHVlc19fIiwiYmFzZSIsIl9zZWFsZWQiLCJlcnJvciIsInN0YXRpY3MiLCJzdGF0aWNQcm9wTmFtZSIsInZhbGlkYXRlTWV0aG9kV2l0aFByb3BzIiwiZWRpdG9yIiwiX3JlZ2lzdGVyRWRpdG9yUHJvcHMiLCJfZmFzdERlZmluZSIsInNlcmlhbGl6YWJsZUZpZWxkcyIsImtleXMiLCJrZXkiLCJhdHRyIiwia2xhc3MiLCJjaGFpbiIsImdldFN1cGVyIiwiUHJpbWl0aXZlVHlwZXMiLCJJbnRlZ2VyIiwiRmxvYXQiLCJCb29sZWFuIiwiU3RyaW5nIiwiYXR0cmlidXRlcyIsInVzZWRJbkdldHRlciIsIkVSUl9UeXBlIiwicHJvcE5hbWVQcmVmaXgiLCJpbml0QXR0cnMiLCJwcmltaXRpdmVUeXBlIiwiX3Nob3J0IiwiZ2V0VHlwZUNoZWNrZXJfRVQiLCJTY3JpcHRVdWlkIiwiU2NyaXB0QXNzZXQiLCJpc0VudW0iLCJnZXRMaXN0IiwiZ2V0T2JqVHlwZUNoZWNrZXJfRVQiLCJwYXJzZVNpbXBsZUF0dHIiLCJhdHRyTmFtZSIsImV4cGVjdFR5cGUiLCJlZGl0b3JPbmx5IiwicmVhZG9ubHkiLCJzZXJpYWxpemFibGUiLCJhbmltYXRhYmxlIiwidmlzaWJsZSIsInN0YXJ0c1dpdGhVUyIsImNoYXJDb2RlQXQiLCJyYW5nZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJmYXN0RGVmaW5lIiwiZ2V0TmV3VmFsdWVUeXBlQ29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBSUEsRUFBRSxHQUFHQyxPQUFPLENBQUMsTUFBRCxDQUFoQjs7QUFDQSxJQUFJQyxJQUFJLEdBQUdELE9BQU8sQ0FBQyxVQUFELENBQWxCOztBQUNBLElBQUlFLEtBQUssR0FBR0YsT0FBTyxDQUFDLFNBQUQsQ0FBbkI7O0FBQ0EsSUFBSUcsb0JBQW9CLEdBQUdELEtBQUssQ0FBQ0UsbUJBQWpDO0FBQ0EsSUFBSUMsY0FBYyxHQUFHSCxLQUFLLENBQUNJLGFBQTNCOztBQUNBLElBQUlDLElBQUksR0FBR1AsT0FBTyxDQUFDLGFBQUQsQ0FBbEI7O0FBQ0EsSUFBSVEsU0FBUyxHQUFHRCxJQUFJLENBQUNDLFNBQXJCOztBQUNBLElBQUlDLFVBQVUsR0FBR1QsT0FBTyxDQUFDLG9CQUFELENBQXhCOztBQUNBQSxPQUFPLENBQUMsbUJBQUQsQ0FBUDs7QUFFQSxJQUFJVSxlQUFlLEdBQUcsQ0FBQyxNQUFELEVBQVMsU0FBVCxFQUFvQixRQUFwQixFQUE4QixNQUE5QixFQUFzQyxVQUF0QyxFQUFrRCxZQUFsRCxFQUFnRSxTQUFoRSxFQUEyRSxRQUEzRSxFQUFxRixTQUFyRixDQUF0QjtBQUVBLElBQUlDLG1CQUFtQixHQUFHQyxNQUFNLElBQUksQ0FBQyxN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QUFJWixPQUFKLEVBQWE7QUFDVDFELEVBQUFBLEVBQUUsQ0FBQ3NHLEtBQUgsQ0FBU3ZELE9BQVQsRUFBa0IrTCxNQUFNLENBQUNDLE9BQXpCO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBqcyA9IHJlcXVpcmUoJy4vanMnKTtcbnZhciBFbnVtID0gcmVxdWlyZSgnLi9DQ0VudW0nKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBfaXNQbGFpbkVtcHR5T2JqX0RFViA9IHV0aWxzLmlzUGxhaW5FbXB0eU9ial9ERVY7XG52YXIgX2Nsb25lYWJsZV9ERVYgPSB1dGlscy5jbG9uZWFibGVfREVWO1xudmFyIEF0dHIgPSByZXF1aXJlKCcuL2F0dHJpYnV0ZScpO1xudmFyIERFTElNRVRFUiA9IEF0dHIuREVMSU1FVEVSO1xudmFyIHByZXByb2Nlc3MgPSByZXF1aXJlKCcuL3ByZXByb2Nlc3MtY2xhc3MnKTtcbnJlcXVpcmUoJy4vcmVxdWlyaW5nLWZyYW1lJyk7XG5cbnZhciBCVUlMVElOX0VOVFJJRVMgPSBbJ25hbWUnLCAnZXh0ZW5kcycsICdtaXhpbnMnLCAnY3RvcicsICdfX2N0b3JfXycsICdwcm9wZXJ0aWVzJywgJ3N0YXRpY3MnLCAnZWRpdG9yJywgJ19fRVM2X18nXTtcblxudmFyIElOVkFMSURfU1RBVElDU19ERVYgPSBDQ19ERVYgJiYgWyduYW1lJywgJ19fY3RvcnNfXycsICdfX3Byb3BzX18nLCAnX192YWx1ZXNfXycsICdhcmd1bWVudHMnLCAnY2FsbCcsICdhcHBseScsICdjYWxsZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAnbGVuZ3RoJywgJ3Byb3RvdHlwZSddO1xuXG5mdW5jdGlvbiBwdXNoVW5pcXVlIChhcnJheSwgaXRlbSkge1xuICAgIGlmIChhcnJheS5pbmRleE9mKGl0ZW0pIDwgMCkge1xuICAgICAgICBhcnJheS5wdXNoKGl0ZW0pO1xuICAgIH1cbn1cblxudmFyIGRlZmVycmVkSW5pdGlhbGl6ZXIgPSB7XG5cbiAgICAvLyBDb25maWdzIGZvciBjbGFzc2VzIHdoaWNoIG5lZWRzIGRlZmVycmVkIGluaXRpYWxpemF0aW9uXG4gICAgZGF0YXM6IG51bGwsXG5cbiAgICAvLyByZWdpc3RlciBuZXcgY2xhc3NcbiAgICAvLyBkYXRhIC0ge2NsczogY2xzLCBjYjogcHJvcGVydGllcywgbWl4aW5zOiBvcHRpb25zLm1peGluc31cbiAgICBwdXNoOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5kYXRhcykge1xuICAgICAgICAgICAgdGhpcy5kYXRhcy5wdXNoKGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kYXRhcyA9IFtkYXRhXTtcbiAgICAgICAgICAgIC8vIHN0YXJ0IGEgbmV3IHRpbWVyIHRvIGluaXRpYWxpemVcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuaW5pdCgpO1xuICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGF0YXMgPSB0aGlzLmRhdGFzO1xuICAgICAgICBpZiAoZGF0YXMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IGRhdGFzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBjbHMgPSBkYXRhLmNscztcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IGRhdGEucHJvcHM7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBuYW1lID0ganMuZ2V0Q2xhc3NOYW1lKGNscyk7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVjbGFyZVByb3BlcnRpZXMoY2xzLCBuYW1lLCBwcm9wZXJ0aWVzLCBjbHMuJHN1cGVyLCBkYXRhLm1peGlucyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDM2MzMsIG5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZGF0YXMgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLy8gYm90aCBnZXR0ZXIgYW5kIHByb3AgbXVzdCByZWdpc3RlciB0aGUgbmFtZSBpbnRvIF9fcHJvcHNfXyBhcnJheVxuZnVuY3Rpb24gYXBwZW5kUHJvcCAoY2xzLCBuYW1lKSB7XG4gICAgaWYgKENDX0RFVikge1xuICAgICAgICAvL2lmICghSURFTlRJRklFUl9SRS50ZXN0KG5hbWUpKSB7XG4gICAgICAgIC8vICAgIGNjLmVycm9yKCdUaGUgcHJvcGVydHkgbmFtZSBcIicgKyBuYW1lICsgJ1wiIGlzIG5vdCBjb21wbGlhbnQgd2l0aCBKYXZhU2NyaXB0IG5hbWluZyBzdGFuZGFyZHMnKTtcbiAgICAgICAgLy8gICAgcmV0dXJuO1xuICAgICAgICAvL31cbiAgICAgICAgaWYgKG5hbWUuaW5kZXhPZignLicpICE9PSAtMSkge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjM0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdXNoVW5pcXVlKGNscy5fX3Byb3BzX18sIG5hbWUpO1xufVxuXG5mdW5jdGlvbiBkZWZpbmVQcm9wIChjbHMsIGNsYXNzTmFtZSwgcHJvcE5hbWUsIHZhbCwgZXM2KSB7XG4gICAgdmFyIGRlZmF1bHRWYWx1ZSA9IHZhbC5kZWZhdWx0O1xuXG4gICAgaWYgKENDX0RFVikge1xuICAgICAgICBpZiAoIWVzNikge1xuICAgICAgICAgICAgLy8gY2hlY2sgZGVmYXVsdCBvYmplY3QgdmFsdWVcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGVmYXVsdFZhbHVlID09PSAnb2JqZWN0JyAmJiBkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShkZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGFycmF5IGVtcHR5XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWZhdWx0VmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjM1LCBjbGFzc05hbWUsIHByb3BOYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIV9pc1BsYWluRW1wdHlPYmpfREVWKGRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgY2xvbmVhYmxlXG4gICAgICAgICAgICAgICAgICAgIGlmICghX2Nsb25lYWJsZV9ERVYoZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjM2LCBjbGFzc05hbWUsIHByb3BOYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVjayBiYXNlIHByb3RvdHlwZSB0byBhdm9pZCBuYW1lIGNvbGxpc2lvblxuICAgICAgICBpZiAoQ0NDbGFzcy5nZXRJbmhlcml0YW5jZUNoYWluKGNscylcbiAgICAgICAgICAgICAgICAgICAuc29tZShmdW5jdGlvbiAoeCkgeyByZXR1cm4geC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpOyB9KSlcbiAgICAgICAge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjM3LCBjbGFzc05hbWUsIHByb3BOYW1lLCBjbGFzc05hbWUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gc2V0IGRlZmF1bHQgdmFsdWVcbiAgICBBdHRyLnNldENsYXNzQXR0cihjbHMsIHByb3BOYW1lLCAnZGVmYXVsdCcsIGRlZmF1bHRWYWx1ZSk7XG5cbiAgICBhcHBlbmRQcm9wKGNscywgcHJvcE5hbWUpO1xuXG4gICAgLy8gYXBwbHkgYXR0cmlidXRlc1xuICAgIHBhcnNlQXR0cmlidXRlcyhjbHMsIHZhbCwgY2xhc3NOYW1lLCBwcm9wTmFtZSwgZmFsc2UpO1xuICAgIGlmICgoQ0NfRURJVE9SICYmICFFZGl0b3IuaXNCdWlsZGVyKSB8fCBDQ19URVNUKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb25BZnRlclByb3BzX0VULmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBvbkFmdGVyUHJvcHNfRVRbaV0oY2xzLCBwcm9wTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgb25BZnRlclByb3BzX0VULmxlbmd0aCA9IDA7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkZWZpbmVHZXRTZXQgKGNscywgbmFtZSwgcHJvcE5hbWUsIHZhbCwgZXM2KSB7XG4gICAgdmFyIGdldHRlciA9IHZhbC5nZXQ7XG4gICAgdmFyIHNldHRlciA9IHZhbC5zZXQ7XG4gICAgdmFyIHByb3RvID0gY2xzLnByb3RvdHlwZTtcbiAgICB2YXIgZCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sIHByb3BOYW1lKTtcbiAgICB2YXIgc2V0dGVyVW5kZWZpbmVkID0gIWQ7XG5cbiAgICBpZiAoZ2V0dGVyKSB7XG4gICAgICAgIGlmIChDQ19ERVYgJiYgIWVzNiAmJiBkICYmIGQuZ2V0KSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDM2MzgsIG5hbWUsIHByb3BOYW1lKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcnNlQXR0cmlidXRlcyhjbHMsIHZhbCwgbmFtZSwgcHJvcE5hbWUsIHRydWUpO1xuICAgICAgICBpZiAoKENDX0VESVRPUiAmJiAhRWRpdG9yLmlzQnVpbGRlcikgfHwgQ0NfVEVTVCkge1xuICAgICAgICAgICAgb25BZnRlclByb3BzX0VULmxlbmd0aCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBBdHRyLnNldENsYXNzQXR0cihjbHMsIHByb3BOYW1lLCAnc2VyaWFsaXphYmxlJywgZmFsc2UpO1xuXG4gICAgICAgIGlmIChDQ19ERVYpIHtcbiAgICAgICAgICAgIC8vIOS4jeiuuuaYr+WQpiB2aXNpYmxlIOmDveimgea3u+WKoOWIsCBwcm9wc++8jOWQpuWImSBhc3NldCB3YXRjaGVyIOS4jeiDveato+W4uOW3peS9nFxuICAgICAgICAgICAgYXBwZW5kUHJvcChjbHMsIHByb3BOYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZXM2KSB7XG4gICAgICAgICAgICBqcy5nZXQocHJvdG8sIHByb3BOYW1lLCBnZXR0ZXIsIHNldHRlclVuZGVmaW5lZCwgc2V0dGVyVW5kZWZpbmVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChDQ19FRElUT1IgfHwgQ0NfREVWKSB7XG4gICAgICAgICAgICBBdHRyLnNldENsYXNzQXR0cihjbHMsIHByb3BOYW1lLCAnaGFzR2V0dGVyJywgdHJ1ZSk7IC8vIOaWueS+vyBlZGl0b3Ig5YGa5Yik5patXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2V0dGVyKSB7XG4gICAgICAgIGlmICghZXM2KSB7XG4gICAgICAgICAgICBpZiAoQ0NfREVWICYmIGQgJiYgZC5zZXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2MuZXJyb3JJRCgzNjQwLCBuYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBqcy5zZXQocHJvdG8sIHByb3BOYW1lLCBzZXR0ZXIsIHNldHRlclVuZGVmaW5lZCwgc2V0dGVyVW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoQ0NfRURJVE9SIHx8IENDX0RFVikge1xuICAgICAgICAgICAgQXR0ci5zZXRDbGFzc0F0dHIoY2xzLCBwcm9wTmFtZSwgJ2hhc1NldHRlcicsIHRydWUpOyAvLyDmlrnkvr8gZWRpdG9yIOWBmuWIpOaWrVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0IChkZWZhdWx0VmFsKSB7XG4gICAgaWYgKHR5cGVvZiBkZWZhdWx0VmFsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY2MuX3Rocm93KGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZGVmYXVsdFZhbCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkZWZhdWx0VmFsO1xufVxuXG5mdW5jdGlvbiBtaXhpbldpdGhJbmhlcml0ZWQgKGRlc3QsIHNyYywgZmlsdGVyKSB7XG4gICAgZm9yICh2YXIgcHJvcCBpbiBzcmMpIHtcbiAgICAgICAgaWYgKCFkZXN0Lmhhc093blByb3BlcnR5KHByb3ApICYmICghZmlsdGVyIHx8IGZpbHRlcihwcm9wKSkpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXN0LCBwcm9wLCBqcy5nZXRQcm9wZXJ0eURlc2NyaXB0b3Ioc3JjLCBwcm9wKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRvRGVmaW5lIChjbGFzc05hbWUsIGJhc2VDbGFzcywgbWl4aW5zLCBvcHRpb25zKSB7XG4gICAgdmFyIHNob3VsZEFkZFByb3RvQ3RvcjtcbiAgICB2YXIgX19jdG9yX18gPSBvcHRpb25zLl9fY3Rvcl9fO1xuICAgIHZhciBjdG9yID0gb3B0aW9ucy5jdG9yO1xuICAgIHZhciBfX2VzNl9fID0gb3B0aW9ucy5fX0VTNl9fO1xuXG4gICAgaWYgKENDX0RFVikge1xuICAgICAgICAvLyBjaGVjayBjdG9yXG4gICAgICAgIHZhciBjdG9yVG9Vc2UgPSBfX2N0b3JfXyB8fCBjdG9yO1xuICAgICAgICBpZiAoY3RvclRvVXNlKSB7XG4gICAgICAgICAgICBpZiAoQ0NDbGFzcy5faXNDQ0NsYXNzKGN0b3JUb1VzZSkpIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDM2MTgsIGNsYXNzTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgY3RvclRvVXNlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjE5LCBjbGFzc05hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGJhc2VDbGFzcyAmJiAvXFxicHJvdG90eXBlLmN0b3JcXGIvLnRlc3QoY3RvclRvVXNlKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoX19lczZfXykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjUxLCBjbGFzc05hbWUgfHwgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy53YXJuSUQoMzYwMCwgY2xhc3NOYW1lIHx8IFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkQWRkUHJvdG9DdG9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjdG9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKF9fY3Rvcl9fKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMzY0OSwgY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGN0b3IgPSBvcHRpb25zLmN0b3IgPSBfdmFsaWRhdGVDdG9yX0RFVihjdG9yLCBiYXNlQ2xhc3MsIGNsYXNzTmFtZSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGN0b3JzO1xuICAgIHZhciBmaXJlQ2xhc3M7XG4gICAgaWYgKF9fZXM2X18pIHtcbiAgICAgICAgY3RvcnMgPSBbY3Rvcl07XG4gICAgICAgIGZpcmVDbGFzcyA9IGN0b3I7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjdG9ycyA9IF9fY3Rvcl9fID8gW19fY3Rvcl9fXSA6IF9nZXRBbGxDdG9ycyhiYXNlQ2xhc3MsIG1peGlucywgb3B0aW9ucyk7XG4gICAgICAgIGZpcmVDbGFzcyA9IF9jcmVhdGVDdG9yKGN0b3JzLCBiYXNlQ2xhc3MsIGNsYXNzTmFtZSwgb3B0aW9ucyk7XG5cbiAgICAgICAgLy8gZXh0ZW5kIC0gQ3JlYXRlIGEgbmV3IENsYXNzIHRoYXQgaW5oZXJpdHMgZnJvbSB0aGlzIENsYXNzXG4gICAgICAgIGpzLnZhbHVlKGZpcmVDbGFzcywgJ2V4dGVuZCcsIGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICBvcHRpb25zLmV4dGVuZHMgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIENDQ2xhc3Mob3B0aW9ucyk7XG4gICAgICAgIH0sIHRydWUpO1xuICAgIH1cblxuICAgIGpzLnZhbHVlKGZpcmVDbGFzcywgJ19fY3RvcnNfXycsIGN0b3JzLmxlbmd0aCA+IDAgPyBjdG9ycyA6IG51bGwsIHRydWUpO1xuXG5cbiAgICB2YXIgcHJvdG90eXBlID0gZmlyZUNsYXNzLnByb3RvdHlwZTtcbiAgICBpZiAoYmFzZUNsYXNzKSB7XG4gICAgICAgIGlmICghX19lczZfXykge1xuICAgICAgICAgICAganMuZXh0ZW5kKGZpcmVDbGFzcywgYmFzZUNsYXNzKTsgICAgICAgIC8vIOi/memHjOS8muaKiueItuexu+eahCBfX3Byb3BzX18g5aSN5Yi257uZ5a2Q57G7XG4gICAgICAgICAgICBwcm90b3R5cGUgPSBmaXJlQ2xhc3MucHJvdG90eXBlOyAgICAgICAgLy8gZ2V0IGV4dGVuZGVkIHByb3RvdHlwZVxuICAgICAgICB9XG4gICAgICAgIGZpcmVDbGFzcy4kc3VwZXIgPSBiYXNlQ2xhc3M7XG4gICAgICAgIGlmIChDQ19ERVYgJiYgc2hvdWxkQWRkUHJvdG9DdG9yKSB7XG4gICAgICAgICAgICBwcm90b3R5cGUuY3RvciA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1peGlucykge1xuICAgICAgICBmb3IgKHZhciBtID0gbWl4aW5zLmxlbmd0aCAtIDE7IG0gPj0gMDsgbS0tKSB7XG4gICAgICAgICAgICB2YXIgbWl4aW4gPSBtaXhpbnNbbV07XG4gICAgICAgICAgICBtaXhpbldpdGhJbmhlcml0ZWQocHJvdG90eXBlLCBtaXhpbi5wcm90b3R5cGUpO1xuXG4gICAgICAgICAgICAvLyBtaXhpbiBzdGF0aWNzICh0aGlzIHdpbGwgYWxzbyBjb3B5IGVkaXRvciBhdHRyaWJ1dGVzIGZvciBjb21wb25lbnQpXG4gICAgICAgICAgICBtaXhpbldpdGhJbmhlcml0ZWQoZmlyZUNsYXNzLCBtaXhpbiwgZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWl4aW4uaGFzT3duUHJvcGVydHkocHJvcCkgJiYgKCFDQ19ERVYgfHwgSU5WQUxJRF9TVEFUSUNTX0RFVi5pbmRleE9mKHByb3ApIDwgMCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gbWl4aW4gYXR0cmlidXRlc1xuICAgICAgICAgICAgaWYgKENDQ2xhc3MuX2lzQ0NDbGFzcyhtaXhpbikpIHtcbiAgICAgICAgICAgICAgICBtaXhpbldpdGhJbmhlcml0ZWQoQXR0ci5nZXRDbGFzc0F0dHJzKGZpcmVDbGFzcyksIEF0dHIuZ2V0Q2xhc3NBdHRycyhtaXhpbikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHJlc3RvcmUgY29uc3R1Y3RvciBvdmVycmlkZGVuIGJ5IG1peGluXG4gICAgICAgIHByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGZpcmVDbGFzcztcbiAgICB9XG5cbiAgICBpZiAoIV9fZXM2X18pIHtcbiAgICAgICAgcHJvdG90eXBlLl9faW5pdFByb3BzX18gPSBjb21waWxlUHJvcHM7XG4gICAgfVxuXG4gICAganMuc2V0Q2xhc3NOYW1lKGNsYXNzTmFtZSwgZmlyZUNsYXNzKTtcbiAgICByZXR1cm4gZmlyZUNsYXNzO1xufVxuXG5mdW5jdGlvbiBkZWZpbmUgKGNsYXNzTmFtZSwgYmFzZUNsYXNzLCBtaXhpbnMsIG9wdGlvbnMpIHtcbiAgICB2YXIgQ29tcG9uZW50ID0gY2MuQ29tcG9uZW50O1xuICAgIHZhciBmcmFtZSA9IGNjLl9SRi5wZWVrKCk7XG4gICAgaWYgKGZyYW1lICYmIGpzLmlzQ2hpbGRDbGFzc09mKGJhc2VDbGFzcywgQ29tcG9uZW50KSkge1xuICAgICAgICAvLyBwcm9qZWN0IGNvbXBvbmVudFxuICAgICAgICBpZiAoanMuaXNDaGlsZENsYXNzT2YoZnJhbWUuY2xzLCBDb21wb25lbnQpKSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDM2MTUpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKENDX0RFViAmJiBmcmFtZS51dWlkICYmIGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgY2Mud2FybklEKDM2MTYsIGNsYXNzTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgY2xhc3NOYW1lID0gY2xhc3NOYW1lIHx8IGZyYW1lLnNjcmlwdDtcbiAgICB9XG5cbiAgICB2YXIgY2xzID0gZG9EZWZpbmUoY2xhc3NOYW1lLCBiYXNlQ2xhc3MsIG1peGlucywgb3B0aW9ucyk7XG5cbiAgICBpZiAoZnJhbWUpIHtcbiAgICAgICAgaWYgKGpzLmlzQ2hpbGRDbGFzc09mKGJhc2VDbGFzcywgQ29tcG9uZW50KSkge1xuICAgICAgICAgICAgdmFyIHV1aWQgPSBmcmFtZS51dWlkO1xuICAgICAgICAgICAgaWYgKHV1aWQpIHtcbiAgICAgICAgICAgICAgICBqcy5fc2V0Q2xhc3NJZCh1dWlkLCBjbHMpO1xuICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgQ29tcG9uZW50Ll9hZGRNZW51SXRlbShjbHMsICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQuc2NyaXB0cy8nICsgY2xhc3NOYW1lLCAtMSk7XG4gICAgICAgICAgICAgICAgICAgIGNscy5wcm90b3R5cGUuX19zY3JpcHRVdWlkID0gRWRpdG9yLlV0aWxzLlV1aWRVdGlscy5kZWNvbXByZXNzVXVpZCh1dWlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmcmFtZS5jbHMgPSBjbHM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWpzLmlzQ2hpbGRDbGFzc09mKGZyYW1lLmNscywgQ29tcG9uZW50KSkge1xuICAgICAgICAgICAgZnJhbWUuY2xzID0gY2xzO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjbHM7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUNsYXNzTmFtZV9ERVYgKGNsYXNzTmFtZSkge1xuICAgIHZhciBEZWZhdWx0TmFtZSA9ICdDQ0NsYXNzJztcbiAgICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZS5yZXBsYWNlKC9eW14kQS1aYS16X10vLCAnXycpLnJlcGxhY2UoL1teMC05QS1aYS16XyRdL2csICdfJyk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyB2YWxpZGF0ZSBuYW1lXG4gICAgICAgICAgICBGdW5jdGlvbignZnVuY3Rpb24gJyArIGNsYXNzTmFtZSArICcoKXt9JykoKTtcbiAgICAgICAgICAgIHJldHVybiBjbGFzc05hbWU7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gRGVmYXVsdE5hbWU7XG59XG5cbmZ1bmN0aW9uIGdldE5ld1ZhbHVlVHlwZUNvZGVKaXQgKHZhbHVlKSB7XG4gICAgdmFyIGNsc05hbWUgPSBqcy5nZXRDbGFzc05hbWUodmFsdWUpO1xuICAgIHZhciB0eXBlID0gdmFsdWUuY29uc3RydWN0b3I7XG4gICAgdmFyIHJlcyA9ICduZXcgJyArIGNsc05hbWUgKyAnKCc7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0eXBlLl9fcHJvcHNfXy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcHJvcCA9IHR5cGUuX19wcm9wc19fW2ldO1xuICAgICAgICB2YXIgcHJvcFZhbCA9IHZhbHVlW3Byb3BdO1xuICAgICAgICBpZiAoQ0NfREVWICYmIHR5cGVvZiBwcm9wVmFsID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjQxLCBjbHNOYW1lKTtcbiAgICAgICAgICAgIHJldHVybiAnbmV3ICcgKyBjbHNOYW1lICsgJygpJztcbiAgICAgICAgfVxuICAgICAgICByZXMgKz0gcHJvcFZhbDtcbiAgICAgICAgaWYgKGkgPCB0eXBlLl9fcHJvcHNfXy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICByZXMgKz0gJywnO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXMgKyAnKSc7XG59XG5cbi8vIFRPRE8gLSBtb3ZlIGVzY2FwZUZvckpTLCBJREVOVElGSUVSX1JFLCBnZXROZXdWYWx1ZVR5cGVDb2RlSml0IHRvIG1pc2MuanMgb3IgYSBuZXcgc291cmNlIGZpbGVcblxuLy8gY29udmVydCBhIG5vcm1hbCBzdHJpbmcgaW5jbHVkaW5nIG5ld2xpbmVzLCBxdW90ZXMgYW5kIHVuaWNvZGUgY2hhcmFjdGVycyBpbnRvIGEgc3RyaW5nIGxpdGVyYWxcbi8vIHJlYWR5IHRvIHVzZSBpbiBKYXZhU2NyaXB0IHNvdXJjZVxuZnVuY3Rpb24gZXNjYXBlRm9ySlMgKHMpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocykuXG4gICAgICAgIC8vIHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9KU09OL3N0cmluZ2lmeVxuICAgICAgICByZXBsYWNlKC9cXHUyMDI4L2csICdcXFxcdTIwMjgnKS5cbiAgICAgICAgcmVwbGFjZSgvXFx1MjAyOS9nLCAnXFxcXHUyMDI5Jyk7XG59XG5cbmZ1bmN0aW9uIGdldEluaXRQcm9wc0ppdCAoYXR0cnMsIHByb3BMaXN0KSB7XG4gICAgLy8gZnVuY3Rpb25zIGZvciBnZW5lcmF0ZWQgY29kZVxuICAgIHZhciBGID0gW107XG4gICAgdmFyIGZ1bmMgPSAnJztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHByb3AgPSBwcm9wTGlzdFtpXTtcbiAgICAgICAgdmFyIGF0dHJLZXkgPSBwcm9wICsgREVMSU1FVEVSICsgJ2RlZmF1bHQnO1xuICAgICAgICBpZiAoYXR0cktleSBpbiBhdHRycykgeyAgLy8gZ2V0dGVyIGRvZXMgbm90IGhhdmUgZGVmYXVsdFxuICAgICAgICAgICAgdmFyIHN0YXRlbWVudDtcbiAgICAgICAgICAgIGlmIChJREVOVElGSUVSX1JFLnRlc3QocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgPSAndGhpcy4nICsgcHJvcCArICc9JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXRlbWVudCA9ICd0aGlzWycgKyBlc2NhcGVGb3JKUyhwcm9wKSArICddPSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZXhwcmVzc2lvbjtcbiAgICAgICAgICAgIHZhciBkZWYgPSBhdHRyc1thdHRyS2V5XTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGVmID09PSAnb2JqZWN0JyAmJiBkZWYpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGVmIGluc3RhbmNlb2YgY2MuVmFsdWVUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSBnZXROZXdWYWx1ZVR5cGVDb2RlSml0KGRlZik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZGVmKSkge1xuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gJ1tdJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSAne30nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBkZWYgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBGLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBGLnB1c2goZGVmKTtcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gJ0ZbJyArIGluZGV4ICsgJ10oKSc7XG4gICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICBmdW5jICs9ICd0cnkge1xcbicgKyBzdGF0ZW1lbnQgKyBleHByZXNzaW9uICsgJztcXG59XFxuY2F0Y2goZSkge1xcbmNjLl90aHJvdyhlKTtcXG4nICsgc3RhdGVtZW50ICsgJ3VuZGVmaW5lZDtcXG59XFxuJztcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGRlZiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gZXNjYXBlRm9ySlMoZGVmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIG51bWJlciwgYm9vbGVhbiwgbnVsbCwgdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9IGRlZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXRlbWVudCA9IHN0YXRlbWVudCArIGV4cHJlc3Npb24gKyAnO1xcbic7XG4gICAgICAgICAgICBmdW5jICs9IHN0YXRlbWVudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGlmIChDQ19URVNUICYmICFpc1BoYW50b21KUykge1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhmdW5jKTtcbiAgICAvLyB9XG5cbiAgICB2YXIgaW5pdFByb3BzO1xuICAgIGlmIChGLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBpbml0UHJvcHMgPSBGdW5jdGlvbihmdW5jKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGluaXRQcm9wcyA9IEZ1bmN0aW9uKCdGJywgJ3JldHVybiAoZnVuY3Rpb24oKXtcXG4nICsgZnVuYyArICd9KScpKEYpO1xuICAgIH1cblxuICAgIHJldHVybiBpbml0UHJvcHM7XG59XG5cbmZ1bmN0aW9uIGdldEluaXRQcm9wcyAoYXR0cnMsIHByb3BMaXN0KSB7XG4gICAgdmFyIHByb3BzID0gbnVsbDtcbiAgICB2YXIgc2ltcGxlRW5kID0gMDtcbiAgICB2YXIgdmFsdWVUeXBlRW5kID0gMDtcblxuICAgIChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgLy8gdHJpYWdlIHByb3BlcnRpZXNcblxuICAgICAgICB2YXIgc2ltcGxlcyA9IG51bGw7XG4gICAgICAgIHZhciB2YWx1ZVR5cGVzID0gbnVsbDtcbiAgICAgICAgdmFyIGFkdmFuY2VkcyA9IG51bGw7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wTGlzdC5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgdmFyIHByb3AgPSBwcm9wTGlzdFtpXTtcbiAgICAgICAgICAgIHZhciBhdHRyS2V5ID0gcHJvcCArIERFTElNRVRFUiArICdkZWZhdWx0JztcbiAgICAgICAgICAgIGlmIChhdHRyS2V5IGluIGF0dHJzKSB7IC8vIGdldHRlciBkb2VzIG5vdCBoYXZlIGRlZmF1bHRcbiAgICAgICAgICAgICAgICB2YXIgZGVmID0gYXR0cnNbYXR0cktleV07XG4gICAgICAgICAgICAgICAgaWYgKCh0eXBlb2YgZGVmID09PSAnb2JqZWN0JyAmJiBkZWYpIHx8IHR5cGVvZiBkZWYgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlZiBpbnN0YW5jZW9mIGNjLlZhbHVlVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF2YWx1ZVR5cGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVUeXBlcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVUeXBlcy5wdXNoKHByb3AsIGRlZik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFkdmFuY2Vkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkdmFuY2VkcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYWR2YW5jZWRzLnB1c2gocHJvcCwgZGVmKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbnVtYmVyLCBib29sZWFuLCBudWxsLCB1bmRlZmluZWQsIHN0cmluZ1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXNpbXBsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpbXBsZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzaW1wbGVzLnB1c2gocHJvcCwgZGVmKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjb25jYXQgaW4gY29tcGFjdCBtZW1vcnlcblxuICAgICAgICBzaW1wbGVFbmQgPSBzaW1wbGVzID8gc2ltcGxlcy5sZW5ndGggOiAwO1xuICAgICAgICB2YWx1ZVR5cGVFbmQgPSBzaW1wbGVFbmQgKyAodmFsdWVUeXBlcyA/IHZhbHVlVHlwZXMubGVuZ3RoIDogMCk7XG4gICAgICAgIGxldCB0b3RhbExlbmd0aCA9IHZhbHVlVHlwZUVuZCArIChhZHZhbmNlZHMgPyBhZHZhbmNlZHMubGVuZ3RoIDogMCk7XG4gICAgICAgIHByb3BzID0gbmV3IEFycmF5KHRvdGFsTGVuZ3RoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpbXBsZUVuZDsgKytpKSB7XG4gICAgICAgICAgICBwcm9wc1tpXSA9IHNpbXBsZXNbaV07XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IHNpbXBsZUVuZDsgaSA8IHZhbHVlVHlwZUVuZDsgKytpKSB7XG4gICAgICAgICAgICBwcm9wc1tpXSA9IHZhbHVlVHlwZXNbaSAtIHNpbXBsZUVuZF07XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IHZhbHVlVHlwZUVuZDsgaSA8IHRvdGFsTGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHByb3BzW2ldID0gYWR2YW5jZWRzW2kgLSB2YWx1ZVR5cGVFbmRdO1xuICAgICAgICB9XG4gICAgfSkoKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgZm9yICg7IGkgPCBzaW1wbGVFbmQ7IGkgKz0gMikge1xuICAgICAgICAgICAgdGhpc1twcm9wc1tpXV0gPSBwcm9wc1tpICsgMV07XG4gICAgICAgIH1cbiAgICAgICAgZm9yICg7IGkgPCB2YWx1ZVR5cGVFbmQ7IGkgKz0gMikge1xuICAgICAgICAgICAgdGhpc1twcm9wc1tpXV0gPSBwcm9wc1tpICsgMV0uY2xvbmUoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKDsgaSA8IHByb3BzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgICAgICB2YXIgZGVmID0gcHJvcHNbaSArIDFdO1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGVmKSkge1xuICAgICAgICAgICAgICAgIHRoaXNbcHJvcHNbaV1dID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkZWYgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBkZWYgaXMgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGRlZigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLl90aHJvdyhlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gZGVmKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpc1twcm9wc1tpXV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5cbi8vIHNpbXBsZSB0ZXN0IHZhcmlhYmxlIG5hbWVcbnZhciBJREVOVElGSUVSX1JFID0gL15bQS1aYS16XyRdWzAtOUEtWmEtel8kXSokLztcbmZ1bmN0aW9uIGNvbXBpbGVQcm9wcyAoYWN0dWFsQ2xhc3MpIHtcbiAgICAvLyBpbml0IGRlZmVycmVkIHByb3BlcnRpZXNcbiAgICB2YXIgYXR0cnMgPSBBdHRyLmdldENsYXNzQXR0cnMoYWN0dWFsQ2xhc3MpO1xuICAgIHZhciBwcm9wTGlzdCA9IGFjdHVhbENsYXNzLl9fcHJvcHNfXztcbiAgICBpZiAocHJvcExpc3QgPT09IG51bGwpIHtcbiAgICAgICAgZGVmZXJyZWRJbml0aWFsaXplci5pbml0KCk7XG4gICAgICAgIHByb3BMaXN0ID0gYWN0dWFsQ2xhc3MuX19wcm9wc19fO1xuICAgIH1cblxuICAgIC8vIE92ZXJ3aXRlIF9faW5pdFByb3BzX18gdG8gYXZvaWQgY29tcGlsZSBhZ2Fpbi5cbiAgICB2YXIgaW5pdFByb3BzID0gQ0NfU1VQUE9SVF9KSVQgPyBnZXRJbml0UHJvcHNKaXQoYXR0cnMsIHByb3BMaXN0KSA6IGdldEluaXRQcm9wcyhhdHRycywgcHJvcExpc3QpO1xuICAgIGFjdHVhbENsYXNzLnByb3RvdHlwZS5fX2luaXRQcm9wc19fID0gaW5pdFByb3BzO1xuXG4gICAgLy8gY2FsbCBpbnN0YW50aWF0ZVByb3BzIGltbWVkaWF0ZWx5LCBubyBuZWVkIHRvIHBhc3MgYWN0dWFsQ2xhc3MgaW50byBpdCBhbnltb3JlXG4gICAgLy8gKHVzZSBjYWxsIHRvIG1hbnVhbGx5IGJpbmQgYHRoaXNgIGJlY2F1c2UgYHRoaXNgIG1heSBub3QgaW5zdGFuY2VvZiBhY3R1YWxDbGFzcylcbiAgICBpbml0UHJvcHMuY2FsbCh0aGlzKTtcbn1cblxudmFyIF9jcmVhdGVDdG9yID0gQ0NfU1VQUE9SVF9KSVQgPyBmdW5jdGlvbiAoY3RvcnMsIGJhc2VDbGFzcywgY2xhc3NOYW1lLCBvcHRpb25zKSB7XG4gICAgdmFyIHN1cGVyQ2FsbEJvdW5kZWQgPSBiYXNlQ2xhc3MgJiYgYm91bmRTdXBlckNhbGxzKGJhc2VDbGFzcywgb3B0aW9ucywgY2xhc3NOYW1lKTtcblxuICAgIHZhciBjdG9yTmFtZSA9IENDX0RFViA/IG5vcm1hbGl6ZUNsYXNzTmFtZV9ERVYoY2xhc3NOYW1lKSA6ICdDQ0NsYXNzJztcbiAgICB2YXIgYm9keSA9ICdyZXR1cm4gZnVuY3Rpb24gJyArIGN0b3JOYW1lICsgJygpe1xcbic7XG5cbiAgICBpZiAoc3VwZXJDYWxsQm91bmRlZCkge1xuICAgICAgICBib2R5ICs9ICd0aGlzLl9zdXBlcj1udWxsO1xcbic7XG4gICAgfVxuXG4gICAgLy8gaW5zdGFudGlhdGUgcHJvcHNcbiAgICBib2R5ICs9ICd0aGlzLl9faW5pdFByb3BzX18oJyArIGN0b3JOYW1lICsgJyk7XFxuJztcblxuICAgIC8vIGNhbGwgdXNlciBjb25zdHJ1Y3RvcnNcbiAgICB2YXIgY3RvckxlbiA9IGN0b3JzLmxlbmd0aDtcbiAgICBpZiAoY3RvckxlbiA+IDApIHtcbiAgICAgICAgdmFyIHVzZVRyeUNhdGNoID0gQ0NfREVWICYmICEgKGNsYXNzTmFtZSAmJiBjbGFzc05hbWUuc3RhcnRzV2l0aCgnY2MuJykpO1xuICAgICAgICBpZiAodXNlVHJ5Q2F0Y2gpIHtcbiAgICAgICAgICAgIGJvZHkgKz0gJ3RyeXtcXG4nO1xuICAgICAgICB9XG4gICAgICAgIHZhciBTTklQUEVUID0gJ10uYXBwbHkodGhpcyxhcmd1bWVudHMpO1xcbic7XG4gICAgICAgIGlmIChjdG9yTGVuID09PSAxKSB7XG4gICAgICAgICAgICBib2R5ICs9IGN0b3JOYW1lICsgJy5fX2N0b3JzX19bMCcgKyBTTklQUEVUO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYm9keSArPSAndmFyIGNzPScgKyBjdG9yTmFtZSArICcuX19jdG9yc19fO1xcbic7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN0b3JMZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGJvZHkgKz0gJ2NzWycgKyBpICsgU05JUFBFVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodXNlVHJ5Q2F0Y2gpIHtcbiAgICAgICAgICAgIGJvZHkgKz0gJ31jYXRjaChlKXtcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdjYy5fdGhyb3coZSk7XFxuJyArXG4gICAgICAgICAgICAgICAgICAgICd9XFxuJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBib2R5ICs9ICd9JztcblxuICAgIHJldHVybiBGdW5jdGlvbihib2R5KSgpO1xufSA6IGZ1bmN0aW9uIChjdG9ycywgYmFzZUNsYXNzLCBjbGFzc05hbWUsIG9wdGlvbnMpIHtcbiAgICB2YXIgc3VwZXJDYWxsQm91bmRlZCA9IGJhc2VDbGFzcyAmJiBib3VuZFN1cGVyQ2FsbHMoYmFzZUNsYXNzLCBvcHRpb25zLCBjbGFzc05hbWUpO1xuICAgIHZhciBjdG9yTGVuID0gY3RvcnMubGVuZ3RoO1xuXG4gICAgdmFyIENsYXNzO1xuXG4gICAgaWYgKGN0b3JMZW4gPiAwKSB7XG4gICAgICAgIGlmIChzdXBlckNhbGxCb3VuZGVkKSB7XG4gICAgICAgICAgICBpZiAoY3RvckxlbiA9PT0gMikge1xuICAgICAgICAgICAgICAgIC8vIFVzZXIgQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2luaXRQcm9wc19fKENsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgY3RvcnNbMF0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgY3RvcnNbMV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2luaXRQcm9wc19fKENsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdG9ycy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3RvcnNbaV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoY3RvckxlbiA9PT0gMykge1xuICAgICAgICAgICAgICAgIC8vIE5vZGVcbiAgICAgICAgICAgICAgICBDbGFzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2luaXRQcm9wc19fKENsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgY3RvcnNbMF0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgY3RvcnNbMV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgY3RvcnNbMl0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX19pbml0UHJvcHNfXyhDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdG9ycyA9IENsYXNzLl9fY3RvcnNfXztcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdG9ycy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3RvcnNbaV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIENsYXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHN1cGVyQ2FsbEJvdW5kZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdXBlciA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9faW5pdFByb3BzX18oQ2xhc3MpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gQ2xhc3M7XG59O1xuXG5mdW5jdGlvbiBfdmFsaWRhdGVDdG9yX0RFViAoY3RvciwgYmFzZUNsYXNzLCBjbGFzc05hbWUsIG9wdGlvbnMpIHtcbiAgICBpZiAoQ0NfRURJVE9SICYmIGJhc2VDbGFzcykge1xuICAgICAgICAvLyBjaGVjayBzdXBlciBjYWxsIGluIGNvbnN0cnVjdG9yXG4gICAgICAgIHZhciBvcmlnaW5DdG9yID0gY3RvcjtcbiAgICAgICAgaWYgKFN1cGVyQ2FsbFJlZy50ZXN0KGN0b3IpKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5fX0VTNl9fKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjUxLCBjbGFzc05hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybklEKDM2MDAsIGNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgICAgLy8gc3VwcHJlc3NzIHN1cGVyIGNhbGxcbiAgICAgICAgICAgICAgICBjdG9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdXBlciA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmV0ID0gb3JpZ2luQ3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdXBlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNoZWNrIGN0b3JcbiAgICBpZiAoY3Rvci5sZW5ndGggPiAwICYmICghY2xhc3NOYW1lIHx8ICFjbGFzc05hbWUuc3RhcnRzV2l0aCgnY2MuJykpKSB7XG4gICAgICAgIC8vIFRvIG1ha2UgYSB1bmlmaWVkIENDQ2xhc3Mgc2VyaWFsaXphdGlvbiBwcm9jZXNzLFxuICAgICAgICAvLyB3ZSBkb24ndCBhbGxvdyBwYXJhbWV0ZXJzIGZvciBjb25zdHJ1Y3RvciB3aGVuIGNyZWF0aW5nIGluc3RhbmNlcyBvZiBDQ0NsYXNzLlxuICAgICAgICAvLyBGb3IgYWR2YW5jZWQgdXNlciwgY29uc3RydWN0IGFyZ3VtZW50cyBjYW4gc3RpbGwgZ2V0IGZyb20gJ2FyZ3VtZW50cycuXG4gICAgICAgIGNjLndhcm5JRCgzNjE3LCBjbGFzc05hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiBjdG9yO1xufVxuXG5mdW5jdGlvbiBfZ2V0QWxsQ3RvcnMgKGJhc2VDbGFzcywgbWl4aW5zLCBvcHRpb25zKSB7XG4gICAgLy8gZ2V0IGJhc2UgdXNlciBjb25zdHJ1Y3RvcnNcbiAgICBmdW5jdGlvbiBnZXRDdG9ycyAoY2xzKSB7XG4gICAgICAgIGlmIChDQ0NsYXNzLl9pc0NDQ2xhc3MoY2xzKSkge1xuICAgICAgICAgICAgcmV0dXJuIGNscy5fX2N0b3JzX18gfHwgW107XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW2Nsc107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY3RvcnMgPSBbXTtcbiAgICAvLyBpZiAob3B0aW9ucy5fX0VTNl9fKSB7XG4gICAgLy8gICAgIGlmIChtaXhpbnMpIHtcbiAgICAvLyAgICAgICAgIGxldCBiYXNlT3JNaXhpbnMgPSBnZXRDdG9ycyhiYXNlQ2xhc3MpO1xuICAgIC8vICAgICAgICAgZm9yIChsZXQgYiA9IDA7IGIgPCBtaXhpbnMubGVuZ3RoOyBiKyspIHtcbiAgICAvLyAgICAgICAgICAgICBsZXQgbWl4aW4gPSBtaXhpbnNbYl07XG4gICAgLy8gICAgICAgICAgICAgaWYgKG1peGluKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgIGxldCBiYXNlQ3RvcnMgPSBnZXRDdG9ycyhtaXhpbik7XG4gICAgLy8gICAgICAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgYmFzZUN0b3JzLmxlbmd0aDsgYysrKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBpZiAoYmFzZU9yTWl4aW5zLmluZGV4T2YoYmFzZUN0b3JzW2NdKSA8IDApIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBwdXNoVW5pcXVlKGN0b3JzLCBiYXNlQ3RvcnNbY10pO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gfVxuICAgIC8vIGVsc2Uge1xuICAgIGxldCBiYXNlT3JNaXhpbnMgPSBbYmFzZUNsYXNzXS5jb25jYXQobWl4aW5zKTtcbiAgICBmb3IgKGxldCBiID0gMDsgYiA8IGJhc2VPck1peGlucy5sZW5ndGg7IGIrKykge1xuICAgICAgICBsZXQgYmFzZU9yTWl4aW4gPSBiYXNlT3JNaXhpbnNbYl07XG4gICAgICAgIGlmIChiYXNlT3JNaXhpbikge1xuICAgICAgICAgICAgbGV0IGJhc2VDdG9ycyA9IGdldEN0b3JzKGJhc2VPck1peGluKTtcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgYmFzZUN0b3JzLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICAgICAgcHVzaFVuaXF1ZShjdG9ycywgYmFzZUN0b3JzW2NdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyB9XG5cbiAgICAvLyBhcHBlbmQgc3ViY2xhc3MgdXNlciBjb25zdHJ1Y3RvcnNcbiAgICB2YXIgY3RvciA9IG9wdGlvbnMuY3RvcjtcbiAgICBpZiAoY3Rvcikge1xuICAgICAgICBjdG9ycy5wdXNoKGN0b3IpO1xuICAgIH1cblxuICAgIHJldHVybiBjdG9ycztcbn1cblxudmFyIFN1cGVyQ2FsbFJlZyA9IC94eXovLnRlc3QoZnVuY3Rpb24oKXt4eXp9KSA/IC9cXGJcXC5fc3VwZXJcXGIvIDogLy4qLztcbnZhciBTdXBlckNhbGxSZWdTdHJpY3QgPSAveHl6Ly50ZXN0KGZ1bmN0aW9uKCl7eHl6fSkgPyAvdGhpc1xcLl9zdXBlclxccypcXCgvIDogLyhOT05FKXs5OX0vO1xuZnVuY3Rpb24gYm91bmRTdXBlckNhbGxzIChiYXNlQ2xhc3MsIG9wdGlvbnMsIGNsYXNzTmFtZSkge1xuICAgIHZhciBoYXNTdXBlckNhbGwgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBmdW5jTmFtZSBpbiBvcHRpb25zKSB7XG4gICAgICAgIGlmIChCVUlMVElOX0VOVFJJRVMuaW5kZXhPZihmdW5jTmFtZSkgPj0gMCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZ1bmMgPSBvcHRpb25zW2Z1bmNOYW1lXTtcbiAgICAgICAgaWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGQgPSBqcy5nZXRQcm9wZXJ0eURlc2NyaXB0b3IoYmFzZUNsYXNzLnByb3RvdHlwZSwgZnVuY05hbWUpO1xuICAgICAgICBpZiAocGQpIHtcbiAgICAgICAgICAgIHZhciBzdXBlckZ1bmMgPSBwZC52YWx1ZTtcbiAgICAgICAgICAgIC8vIGlnbm9yZSBwZC5nZXQsIGFzc3VtZSB0aGF0IGZ1bmN0aW9uIGRlZmluZWQgYnkgZ2V0dGVyIGlzIGp1c3QgZm9yIHdhcm5pbmdzXG4gICAgICAgICAgICBpZiAodHlwZW9mIHN1cGVyRnVuYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGlmIChTdXBlckNhbGxSZWcudGVzdChmdW5jKSkge1xuICAgICAgICAgICAgICAgICAgICBoYXNTdXBlckNhbGwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAvLyBib3VuZFN1cGVyQ2FsbFxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zW2Z1bmNOYW1lXSA9IChmdW5jdGlvbiAoc3VwZXJGdW5jLCBmdW5jKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0bXAgPSB0aGlzLl9zdXBlcjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFkZCBhIG5ldyAuX3N1cGVyKCkgbWV0aG9kIHRoYXQgaXMgdGhlIHNhbWUgbWV0aG9kIGJ1dCBvbiB0aGUgc3VwZXItQ2xhc3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdXBlciA9IHN1cGVyRnVuYztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgbWV0aG9kIG9ubHkgbmVlZCB0byBiZSBib3VuZCB0ZW1wb3JhcmlseSwgc28gd2UgcmVtb3ZlIGl0IHdoZW4gd2UncmUgZG9uZSBleGVjdXRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdXBlciA9IHRtcDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9KShzdXBlckZ1bmMsIGZ1bmMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoQ0NfREVWICYmIFN1cGVyQ2FsbFJlZ1N0cmljdC50ZXN0KGZ1bmMpKSB7XG4gICAgICAgICAgICBjYy53YXJuSUQoMzYyMCwgY2xhc3NOYW1lLCBmdW5jTmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc1N1cGVyQ2FsbDtcbn1cblxuZnVuY3Rpb24gZGVjbGFyZVByb3BlcnRpZXMgKGNscywgY2xhc3NOYW1lLCBwcm9wZXJ0aWVzLCBiYXNlQ2xhc3MsIG1peGlucywgZXM2KSB7XG4gICAgY2xzLl9fcHJvcHNfXyA9IFtdO1xuXG4gICAgaWYgKGJhc2VDbGFzcyAmJiBiYXNlQ2xhc3MuX19wcm9wc19fKSB7XG4gICAgICAgIGNscy5fX3Byb3BzX18gPSBiYXNlQ2xhc3MuX19wcm9wc19fLnNsaWNlKCk7XG4gICAgfVxuXG4gICAgaWYgKG1peGlucykge1xuICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IG1peGlucy5sZW5ndGg7ICsrbSkge1xuICAgICAgICAgICAgdmFyIG1peGluID0gbWl4aW5zW21dO1xuICAgICAgICAgICAgaWYgKG1peGluLl9fcHJvcHNfXykge1xuICAgICAgICAgICAgICAgIGNscy5fX3Byb3BzX18gPSBjbHMuX19wcm9wc19fLmNvbmNhdChtaXhpbi5fX3Byb3BzX18uZmlsdGVyKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjbHMuX19wcm9wc19fLmluZGV4T2YoeCkgPCAwO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwcm9wZXJ0aWVzKSB7XG4gICAgICAgIC8vIOmihOWkhOeQhuWxnuaAp1xuICAgICAgICBwcmVwcm9jZXNzLnByZXByb2Nlc3NBdHRycyhwcm9wZXJ0aWVzLCBjbGFzc05hbWUsIGNscywgZXM2KTtcblxuICAgICAgICBmb3IgKHZhciBwcm9wTmFtZSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gcHJvcGVydGllc1twcm9wTmFtZV07XG4gICAgICAgICAgICBpZiAoJ2RlZmF1bHQnIGluIHZhbCkge1xuICAgICAgICAgICAgICAgIGRlZmluZVByb3AoY2xzLCBjbGFzc05hbWUsIHByb3BOYW1lLCB2YWwsIGVzNik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWZpbmVHZXRTZXQoY2xzLCBjbGFzc05hbWUsIHByb3BOYW1lLCB2YWwsIGVzNik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgYXR0cnMgPSBBdHRyLmdldENsYXNzQXR0cnMoY2xzKTtcbiAgICBjbHMuX192YWx1ZXNfXyA9IGNscy5fX3Byb3BzX18uZmlsdGVyKGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICAgIHJldHVybiBhdHRyc1twcm9wICsgREVMSU1FVEVSICsgJ3NlcmlhbGl6YWJsZSddICE9PSBmYWxzZTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBAbW9kdWxlIGNjXG4gKi9cblxuLyoqXG4gKiAhI2VuIERlZmluZXMgYSBDQ0NsYXNzIHVzaW5nIHRoZSBnaXZlbiBzcGVjaWZpY2F0aW9uLCBwbGVhc2Ugc2VlIFtDbGFzc10oL2RvY3MvZWRpdG9yc19hbmRfdG9vbHMvY3JlYXRvci1jaGFwdGVycy9zY3JpcHRpbmcvY2xhc3MuaHRtbCkgZm9yIGRldGFpbHMuXG4gKiAhI3poIOWumuS5ieS4gOS4qiBDQ0NsYXNz77yM5Lyg5YWl5Y+C5pWw5b+F6aG75piv5LiA5Liq5YyF5ZCr57G75Z6L5Y+C5pWw55qE5a2X6Z2i6YeP5a+56LGh77yM5YW35L2T55So5rOV6K+35p+l6ZiFW+exu+Wei+WumuS5iV0oL2RvY3MvY3JlYXRvci9zY3JpcHRpbmcvY2xhc3MuaHRtbCnjgIJcbiAqXG4gKiBAbWV0aG9kIENsYXNzXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWVdIC0gVGhlIGNsYXNzIG5hbWUgdXNlZCBmb3Igc2VyaWFsaXphdGlvbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmV4dGVuZHNdIC0gVGhlIGJhc2UgY2xhc3MuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5jdG9yXSAtIFRoZSBjb25zdHJ1Y3Rvci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLl9fY3Rvcl9fXSAtIFRoZSBzYW1lIGFzIGN0b3IsIGJ1dCBsZXNzIGVuY2Fwc3VsYXRlZC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5wcm9wZXJ0aWVzXSAtIFRoZSBwcm9wZXJ0eSBkZWZpbml0aW9ucy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5zdGF0aWNzXSAtIFRoZSBzdGF0aWMgbWVtYmVycy5cbiAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gW29wdGlvbnMubWl4aW5zXVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5lZGl0b3JdIC0gYXR0cmlidXRlcyBmb3IgQ29tcG9uZW50IGxpc3RlZCBiZWxvdy5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZWRpdG9yLmV4ZWN1dGVJbkVkaXRNb2RlPWZhbHNlXSAtIEFsbG93cyB0aGUgY3VycmVudCBjb21wb25lbnQgdG8gcnVuIGluIGVkaXQgbW9kZS4gQnkgZGVmYXVsdCwgYWxsIGNvbXBvbmVudHMgYXJlIGV4ZWN1dGVkIG9ubHkgYXQgcnVudGltZSwgbWVhbmluZyB0aGF0IHRoZXkgd2lsbCBub3QgaGF2ZSB0aGVpciBjYWxsYmFjayBmdW5jdGlvbnMgZXhlY3V0ZWQgd2hpbGUgdGhlIEVkaXRvciBpcyBpbiBlZGl0IG1vZGUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5lZGl0b3IucmVxdWlyZUNvbXBvbmVudF0gLSBBdXRvbWF0aWNhbGx5IGFkZCByZXF1aXJlZCBjb21wb25lbnQgYXMgYSBkZXBlbmRlbmN5LlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmVkaXRvci5tZW51XSAtIFRoZSBtZW51IHBhdGggdG8gcmVnaXN0ZXIgYSBjb21wb25lbnQgdG8gdGhlIGVkaXRvcnMgXCJDb21wb25lbnRcIiBtZW51LiBFZy4gXCJSZW5kZXJpbmcvQ2FtZXJhXCIuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZWRpdG9yLmV4ZWN1dGlvbk9yZGVyPTBdIC0gVGhlIGV4ZWN1dGlvbiBvcmRlciBvZiBsaWZlY3ljbGUgbWV0aG9kcyBmb3IgQ29tcG9uZW50LiBUaG9zZSBsZXNzIHRoYW4gMCB3aWxsIGV4ZWN1dGUgYmVmb3JlIHdoaWxlIHRob3NlIGdyZWF0ZXIgdGhhbiAwIHdpbGwgZXhlY3V0ZSBhZnRlci4gVGhlIG9yZGVyIHdpbGwgb25seSBhZmZlY3Qgb25Mb2FkLCBvbkVuYWJsZSwgc3RhcnQsIHVwZGF0ZSBhbmQgbGF0ZVVwZGF0ZSB3aGlsZSBvbkRpc2FibGUgYW5kIG9uRGVzdHJveSB3aWxsIG5vdCBiZSBhZmZlY3RlZC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZWRpdG9yLmRpc2FsbG93TXVsdGlwbGVdIC0gSWYgc3BlY2lmaWVkIHRvIGEgdHlwZSwgcHJldmVudHMgQ29tcG9uZW50IG9mIHRoZSBzYW1lIHR5cGUgKG9yIHN1YnR5cGUpIHRvIGJlIGFkZGVkIG1vcmUgdGhhbiBvbmNlIHRvIGEgTm9kZS5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZWRpdG9yLnBsYXlPbkZvY3VzPWZhbHNlXSAtIFRoaXMgcHJvcGVydHkgaXMgb25seSBhdmFpbGFibGUgd2hlbiBleGVjdXRlSW5FZGl0TW9kZSBpcyBzZXQuIElmIHNwZWNpZmllZCwgdGhlIGVkaXRvcidzIHNjZW5lIHZpZXcgd2lsbCBrZWVwIHVwZGF0aW5nIHRoaXMgbm9kZSBpbiA2MCBmcHMgd2hlbiBpdCBpcyBzZWxlY3RlZCwgb3RoZXJ3aXNlLCBpdCB3aWxsIHVwZGF0ZSBvbmx5IGlmIG5lY2Vzc2FyeS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5lZGl0b3IuaW5zcGVjdG9yXSAtIEN1c3RvbWl6ZSB0aGUgcGFnZSB1cmwgdXNlZCBieSB0aGUgY3VycmVudCBjb21wb25lbnQgdG8gcmVuZGVyIGluIHRoZSBQcm9wZXJ0aWVzLlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmVkaXRvci5pY29uXSAtIEN1c3RvbWl6ZSB0aGUgaWNvbiB0aGF0IHRoZSBjdXJyZW50IGNvbXBvbmVudCBkaXNwbGF5cyBpbiB0aGUgZWRpdG9yLlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmVkaXRvci5oZWxwXSAtIFRoZSBjdXN0b20gZG9jdW1lbnRhdGlvbiBVUkxcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy51cGRhdGVdIC0gbGlmZWN5Y2xlIG1ldGhvZCBmb3IgQ29tcG9uZW50LCBzZWUge3sjY3Jvc3NMaW5rIFwiQ29tcG9uZW50L3VwZGF0ZTptZXRob2RcIn19e3svY3Jvc3NMaW5rfX1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmxhdGVVcGRhdGVdIC0gbGlmZWN5Y2xlIG1ldGhvZCBmb3IgQ29tcG9uZW50LCBzZWUge3sjY3Jvc3NMaW5rIFwiQ29tcG9uZW50L2xhdGVVcGRhdGU6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5vbkxvYWRdIC0gbGlmZWN5Y2xlIG1ldGhvZCBmb3IgQ29tcG9uZW50LCBzZWUge3sjY3Jvc3NMaW5rIFwiQ29tcG9uZW50L29uTG9hZDptZXRob2RcIn19e3svY3Jvc3NMaW5rfX1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLnN0YXJ0XSAtIGxpZmVjeWNsZSBtZXRob2QgZm9yIENvbXBvbmVudCwgc2VlIHt7I2Nyb3NzTGluayBcIkNvbXBvbmVudC9zdGFydDptZXRob2RcIn19e3svY3Jvc3NMaW5rfX1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLm9uRW5hYmxlXSAtIGxpZmVjeWNsZSBtZXRob2QgZm9yIENvbXBvbmVudCwgc2VlIHt7I2Nyb3NzTGluayBcIkNvbXBvbmVudC9vbkVuYWJsZTptZXRob2RcIn19e3svY3Jvc3NMaW5rfX1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLm9uRGlzYWJsZV0gLSBsaWZlY3ljbGUgbWV0aG9kIGZvciBDb21wb25lbnQsIHNlZSB7eyNjcm9zc0xpbmsgXCJDb21wb25lbnQvb25EaXNhYmxlOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMub25EZXN0cm95XSAtIGxpZmVjeWNsZSBtZXRob2QgZm9yIENvbXBvbmVudCwgc2VlIHt7I2Nyb3NzTGluayBcIkNvbXBvbmVudC9vbkRlc3Ryb3k6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5vbkZvY3VzSW5FZGl0b3JdIC0gbGlmZWN5Y2xlIG1ldGhvZCBmb3IgQ29tcG9uZW50LCBzZWUge3sjY3Jvc3NMaW5rIFwiQ29tcG9uZW50L29uRm9jdXNJbkVkaXRvcjptZXRob2RcIn19e3svY3Jvc3NMaW5rfX1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLm9uTG9zdEZvY3VzSW5FZGl0b3JdIC0gbGlmZWN5Y2xlIG1ldGhvZCBmb3IgQ29tcG9uZW50LCBzZWUge3sjY3Jvc3NMaW5rIFwiQ29tcG9uZW50L29uTG9zdEZvY3VzSW5FZGl0b3I6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5yZXNldEluRWRpdG9yXSAtIGxpZmVjeWNsZSBtZXRob2QgZm9yIENvbXBvbmVudCwgc2VlIHt7I2Nyb3NzTGluayBcIkNvbXBvbmVudC9yZXNldEluRWRpdG9yOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMub25SZXN0b3JlXSAtIGZvciBDb21wb25lbnQgb25seSwgc2VlIHt7I2Nyb3NzTGluayBcIkNvbXBvbmVudC9vblJlc3RvcmU6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5fZ2V0TG9jYWxCb3VuZHNdIC0gZm9yIENvbXBvbmVudCBvbmx5LCBzZWUge3sjY3Jvc3NMaW5rIFwiQ29tcG9uZW50L19nZXRMb2NhbEJvdW5kczptZXRob2RcIn19e3svY3Jvc3NMaW5rfX1cbiAqXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gLSB0aGUgY3JlYXRlZCBjbGFzc1xuICpcbiAqIEBleGFtcGxlXG5cbiAvLyBkZWZpbmUgYmFzZSBjbGFzc1xuIHZhciBOb2RlID0gY2MuQ2xhc3MoKTtcblxuIC8vIGRlZmluZSBzdWIgY2xhc3NcbiB2YXIgU3ByaXRlID0gY2MuQ2xhc3Moe1xuICAgICBuYW1lOiAnU3ByaXRlJyxcbiAgICAgZXh0ZW5kczogTm9kZSxcblxuICAgICBjdG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICB0aGlzLnVybCA9IFwiXCI7XG4gICAgICAgICB0aGlzLmlkID0gMDtcbiAgICAgfSxcblxuICAgICBzdGF0aWNzOiB7XG4gICAgICAgICAvLyBkZWZpbmUgc3RhdGljIG1lbWJlcnNcbiAgICAgICAgIGNvdW50OiAwLFxuICAgICAgICAgZ2V0Qm91bmRzOiBmdW5jdGlvbiAoc3ByaXRlTGlzdCkge1xuICAgICAgICAgICAgIC8vIGNvbXB1dGUgYm91bmRzLi4uXG4gICAgICAgICB9XG4gICAgIH0sXG5cbiAgICAgcHJvcGVydGllcyB7XG4gICAgICAgICB3aWR0aDoge1xuICAgICAgICAgICAgIGRlZmF1bHQ6IDEyOCxcbiAgICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyLFxuICAgICAgICAgICAgIHRvb2x0aXA6ICdUaGUgd2lkdGggb2Ygc3ByaXRlJ1xuICAgICAgICAgfSxcbiAgICAgICAgIGhlaWdodDogMTI4LFxuICAgICAgICAgc2l6ZToge1xuICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICByZXR1cm4gY2MudjIodGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgICAgfSxcblxuICAgICBsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAvLyBsb2FkIHRoaXMudXJsLi4uXG4gICAgIH07XG4gfSk7XG5cbiAvLyBpbnN0YW50aWF0ZVxuXG4gdmFyIG9iaiA9IG5ldyBTcHJpdGUoKTtcbiBvYmoudXJsID0gJ3Nwcml0ZS5wbmcnO1xuIG9iai5sb2FkKCk7XG4gKi9cbmZ1bmN0aW9uIENDQ2xhc3MgKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHZhciBuYW1lID0gb3B0aW9ucy5uYW1lO1xuICAgIHZhciBiYXNlID0gb3B0aW9ucy5leHRlbmRzLyogfHwgQ0NPYmplY3QqLztcbiAgICB2YXIgbWl4aW5zID0gb3B0aW9ucy5taXhpbnM7XG5cbiAgICAvLyBjcmVhdGUgY29uc3RydWN0b3JcbiAgICB2YXIgY2xzID0gZGVmaW5lKG5hbWUsIGJhc2UsIG1peGlucywgb3B0aW9ucyk7XG4gICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIG5hbWUgPSBjYy5qcy5nZXRDbGFzc05hbWUoY2xzKTtcbiAgICB9XG5cbiAgICBjbHMuX3NlYWxlZCA9IHRydWU7XG4gICAgaWYgKGJhc2UpIHtcbiAgICAgICAgYmFzZS5fc2VhbGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gZGVmaW5lIFByb3BlcnRpZXNcbiAgICB2YXIgcHJvcGVydGllcyA9IG9wdGlvbnMucHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgPT09ICdmdW5jdGlvbicgfHxcbiAgICAgICAgKGJhc2UgJiYgYmFzZS5fX3Byb3BzX18gPT09IG51bGwpIHx8XG4gICAgICAgIChtaXhpbnMgJiYgbWl4aW5zLnNvbWUoZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgIHJldHVybiB4Ll9fcHJvcHNfXyA9PT0gbnVsbDtcbiAgICAgICAgfSkpXG4gICAgKSB7XG4gICAgICAgIGlmIChDQ19ERVYgJiYgb3B0aW9ucy5fX0VTNl9fKSB7XG4gICAgICAgICAgICBjYy5lcnJvcignbm90IHlldCBpbXBsZW1lbnQgZGVmZXJyZWQgcHJvcGVydGllcyBmb3IgRVM2IENsYXNzZXMnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRlZmVycmVkSW5pdGlhbGl6ZXIucHVzaCh7Y2xzOiBjbHMsIHByb3BzOiBwcm9wZXJ0aWVzLCBtaXhpbnM6IG1peGluc30pO1xuICAgICAgICAgICAgY2xzLl9fcHJvcHNfXyA9IGNscy5fX3ZhbHVlc19fID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZGVjbGFyZVByb3BlcnRpZXMoY2xzLCBuYW1lLCBwcm9wZXJ0aWVzLCBiYXNlLCBvcHRpb25zLm1peGlucywgb3B0aW9ucy5fX0VTNl9fKTtcbiAgICB9XG5cbiAgICAvLyBkZWZpbmUgc3RhdGljc1xuICAgIHZhciBzdGF0aWNzID0gb3B0aW9ucy5zdGF0aWNzO1xuICAgIGlmIChzdGF0aWNzKSB7XG4gICAgICAgIHZhciBzdGF0aWNQcm9wTmFtZTtcbiAgICAgICAgaWYgKENDX0RFVikge1xuICAgICAgICAgICAgZm9yIChzdGF0aWNQcm9wTmFtZSBpbiBzdGF0aWNzKSB7XG4gICAgICAgICAgICAgICAgaWYgKElOVkFMSURfU1RBVElDU19ERVYuaW5kZXhPZihzdGF0aWNQcm9wTmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMzY0MiwgbmFtZSwgc3RhdGljUHJvcE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0aWNQcm9wTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoc3RhdGljUHJvcE5hbWUgaW4gc3RhdGljcykge1xuICAgICAgICAgICAgY2xzW3N0YXRpY1Byb3BOYW1lXSA9IHN0YXRpY3Nbc3RhdGljUHJvcE5hbWVdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGVmaW5lIGZ1bmN0aW9uc1xuICAgIGZvciAodmFyIGZ1bmNOYW1lIGluIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKEJVSUxUSU5fRU5UUklFUy5pbmRleE9mKGZ1bmNOYW1lKSA+PSAwKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZnVuYyA9IG9wdGlvbnNbZnVuY05hbWVdO1xuICAgICAgICBpZiAoIXByZXByb2Nlc3MudmFsaWRhdGVNZXRob2RXaXRoUHJvcHMoZnVuYywgZnVuY05hbWUsIG5hbWUsIGNscywgYmFzZSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIHVzZSB2YWx1ZSB0byByZWRlZmluZSBzb21lIHN1cGVyIG1ldGhvZCBkZWZpbmVkIGFzIGdldHRlclxuICAgICAgICBqcy52YWx1ZShjbHMucHJvdG90eXBlLCBmdW5jTmFtZSwgZnVuYywgdHJ1ZSwgdHJ1ZSk7XG4gICAgfVxuXG5cbiAgICB2YXIgZWRpdG9yID0gb3B0aW9ucy5lZGl0b3I7XG4gICAgaWYgKGVkaXRvcikge1xuICAgICAgICBjYy5Db21wb25lbnQuX3JlZ2lzdGVyRWRpdG9yUHJvcHMoY2xzLCBlZGl0b3IpO1xuICAgIH1cblxuICAgIHJldHVybiBjbHM7XG59XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgdGhlIGNvbnN0cnVjdG9yIGlzIGNyZWF0ZWQgYnkgY2MuQ2xhc3NcbiAqXG4gKiBAbWV0aG9kIF9pc0NDQ2xhc3NcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbnN0cnVjdG9yXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQHByaXZhdGVcbiAqL1xuQ0NDbGFzcy5faXNDQ0NsYXNzID0gZnVuY3Rpb24gKGNvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIGNvbnN0cnVjdG9yICYmXG4gICAgICAgICAgIGNvbnN0cnVjdG9yLmhhc093blByb3BlcnR5KCdfX2N0b3JzX18nKTsgICAgIC8vIGlzIG5vdCBpbmhlcml0ZWQgX19jdG9yc19fXG59O1xuXG4vL1xuLy8gT3B0aW1pemVkIGRlZmluZSBmdW5jdGlvbiBvbmx5IGZvciBpbnRlcm5hbCBjbGFzc2VzXG4vL1xuLy8gQG1ldGhvZCBfZmFzdERlZmluZVxuLy8gQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZVxuLy8gQHBhcmFtIHtGdW5jdGlvbn0gY29uc3RydWN0b3Jcbi8vIEBwYXJhbSB7T2JqZWN0fSBzZXJpYWxpemFibGVGaWVsZHNcbi8vIEBwcml2YXRlXG4vL1xuQ0NDbGFzcy5fZmFzdERlZmluZSA9IGZ1bmN0aW9uIChjbGFzc05hbWUsIGNvbnN0cnVjdG9yLCBzZXJpYWxpemFibGVGaWVsZHMpIHtcbiAgICBqcy5zZXRDbGFzc05hbWUoY2xhc3NOYW1lLCBjb25zdHJ1Y3Rvcik7XG4gICAgLy9jb25zdHJ1Y3Rvci5fX2N0b3JzX18gPSBjb25zdHJ1Y3Rvci5fX2N0b3JzX18gfHwgbnVsbDtcbiAgICB2YXIgcHJvcHMgPSBjb25zdHJ1Y3Rvci5fX3Byb3BzX18gPSBjb25zdHJ1Y3Rvci5fX3ZhbHVlc19fID0gT2JqZWN0LmtleXMoc2VyaWFsaXphYmxlRmllbGRzKTtcbiAgICB2YXIgYXR0cnMgPSBBdHRyLmdldENsYXNzQXR0cnMoY29uc3RydWN0b3IpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGtleSA9IHByb3BzW2ldO1xuICAgICAgICBhdHRyc1trZXkgKyBERUxJTUVURVIgKyAndmlzaWJsZSddID0gZmFsc2U7XG4gICAgICAgIGF0dHJzW2tleSArIERFTElNRVRFUiArICdkZWZhdWx0J10gPSBzZXJpYWxpemFibGVGaWVsZHNba2V5XTtcbiAgICB9XG59O1xuXG5DQ0NsYXNzLkF0dHIgPSBBdHRyO1xuQ0NDbGFzcy5hdHRyID0gQXR0ci5hdHRyO1xuXG4vKlxuICogUmV0dXJuIGFsbCBzdXBlciBjbGFzc2VzXG4gKiBAbWV0aG9kIGdldEluaGVyaXRhbmNlQ2hhaW5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbnN0cnVjdG9yXG4gKiBAcmV0dXJuIHtGdW5jdGlvbltdfVxuICovXG5DQ0NsYXNzLmdldEluaGVyaXRhbmNlQ2hhaW4gPSBmdW5jdGlvbiAoa2xhc3MpIHtcbiAgICB2YXIgY2hhaW4gPSBbXTtcbiAgICBmb3IgKDs7KSB7XG4gICAgICAgIGtsYXNzID0ganMuZ2V0U3VwZXIoa2xhc3MpO1xuICAgICAgICBpZiAoIWtsYXNzKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoa2xhc3MgIT09IE9iamVjdCkge1xuICAgICAgICAgICAgY2hhaW4ucHVzaChrbGFzcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNoYWluO1xufTtcblxudmFyIFByaW1pdGl2ZVR5cGVzID0ge1xuICAgIC8vIFNwZWNpZnkgdGhhdCB0aGUgaW5wdXQgdmFsdWUgbXVzdCBiZSBpbnRlZ2VyIGluIFByb3BlcnRpZXMuXG4gICAgLy8gQWxzbyB1c2VkIHRvIGluZGljYXRlcyB0aGF0IHRoZSB0eXBlIG9mIGVsZW1lbnRzIGluIGFycmF5IG9yIHRoZSB0eXBlIG9mIHZhbHVlIGluIGRpY3Rpb25hcnkgaXMgaW50ZWdlci5cbiAgICBJbnRlZ2VyOiAnTnVtYmVyJyxcbiAgICAvLyBJbmRpY2F0ZXMgdGhhdCB0aGUgdHlwZSBvZiBlbGVtZW50cyBpbiBhcnJheSBvciB0aGUgdHlwZSBvZiB2YWx1ZSBpbiBkaWN0aW9uYXJ5IGlzIGRvdWJsZS5cbiAgICBGbG9hdDogJ051bWJlcicsXG4gICAgQm9vbGVhbjogJ0Jvb2xlYW4nLFxuICAgIFN0cmluZzogJ1N0cmluZycsXG59O1xudmFyIG9uQWZ0ZXJQcm9wc19FVCA9IFtdO1xuZnVuY3Rpb24gcGFyc2VBdHRyaWJ1dGVzIChjbHMsIGF0dHJpYnV0ZXMsIGNsYXNzTmFtZSwgcHJvcE5hbWUsIHVzZWRJbkdldHRlcikge1xuICAgIHZhciBFUlJfVHlwZSA9IENDX0RFViA/ICdUaGUgJXMgb2YgJXMgbXVzdCBiZSB0eXBlICVzJyA6ICcnO1xuXG4gICAgdmFyIGF0dHJzID0gbnVsbDtcbiAgICB2YXIgcHJvcE5hbWVQcmVmaXggPSAnJztcbiAgICBmdW5jdGlvbiBpbml0QXR0cnMgKCkge1xuICAgICAgICBwcm9wTmFtZVByZWZpeCA9IHByb3BOYW1lICsgREVMSU1FVEVSO1xuICAgICAgICByZXR1cm4gYXR0cnMgPSBBdHRyLmdldENsYXNzQXR0cnMoY2xzKTtcbiAgICB9XG5cbiAgICBpZiAoKENDX0VESVRPUiAmJiAhRWRpdG9yLmlzQnVpbGRlcikgfHwgQ0NfVEVTVCkge1xuICAgICAgICBvbkFmdGVyUHJvcHNfRVQubGVuZ3RoID0gMDtcbiAgICB9XG5cbiAgICB2YXIgdHlwZSA9IGF0dHJpYnV0ZXMudHlwZTtcbiAgICBpZiAodHlwZSkge1xuICAgICAgICB2YXIgcHJpbWl0aXZlVHlwZSA9IFByaW1pdGl2ZVR5cGVzW3R5cGVdO1xuICAgICAgICBpZiAocHJpbWl0aXZlVHlwZSkge1xuICAgICAgICAgICAgKGF0dHJzIHx8IGluaXRBdHRycygpKVtwcm9wTmFtZVByZWZpeCArICd0eXBlJ10gPSB0eXBlO1xuICAgICAgICAgICAgaWYgKCgoQ0NfRURJVE9SICYmICFFZGl0b3IuaXNCdWlsZGVyKSB8fCBDQ19URVNUKSAmJiAhYXR0cmlidXRlcy5fc2hvcnQpIHtcbiAgICAgICAgICAgICAgICBvbkFmdGVyUHJvcHNfRVQucHVzaChBdHRyLmdldFR5cGVDaGVja2VyX0VUKHByaW1pdGl2ZVR5cGUsICdjYy4nICsgdHlwZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGUgPT09ICdPYmplY3QnKSB7XG4gICAgICAgICAgICBpZiAoQ0NfREVWKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjQ0LCBjbGFzc05hbWUsIHByb3BOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09PSBBdHRyLlNjcmlwdFV1aWQpIHtcbiAgICAgICAgICAgICAgICAoYXR0cnMgfHwgaW5pdEF0dHJzKCkpW3Byb3BOYW1lUHJlZml4ICsgJ3R5cGUnXSA9ICdTY3JpcHQnO1xuICAgICAgICAgICAgICAgIGF0dHJzW3Byb3BOYW1lUHJlZml4ICsgJ2N0b3InXSA9IGNjLlNjcmlwdEFzc2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoRW51bS5pc0VudW0odHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIChhdHRycyB8fCBpbml0QXR0cnMoKSlbcHJvcE5hbWVQcmVmaXggKyAndHlwZSddID0gJ0VudW0nO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnNbcHJvcE5hbWVQcmVmaXggKyAnZW51bUxpc3QnXSA9IEVudW0uZ2V0TGlzdCh0eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChDQ19ERVYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMzY0NSwgY2xhc3NOYW1lLCBwcm9wTmFtZSwgdHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgKGF0dHJzIHx8IGluaXRBdHRycygpKVtwcm9wTmFtZVByZWZpeCArICd0eXBlJ10gPSAnT2JqZWN0JztcbiAgICAgICAgICAgICAgICAgICAgYXR0cnNbcHJvcE5hbWVQcmVmaXggKyAnY3RvciddID0gdHlwZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCgoQ0NfRURJVE9SICYmICFFZGl0b3IuaXNCdWlsZGVyKSB8fCBDQ19URVNUKSAmJiAhYXR0cmlidXRlcy5fc2hvcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQWZ0ZXJQcm9wc19FVC5wdXNoKEF0dHIuZ2V0T2JqVHlwZUNoZWNrZXJfRVQodHlwZSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKENDX0RFVikge1xuICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDM2NDYsIGNsYXNzTmFtZSwgcHJvcE5hbWUsIHR5cGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlU2ltcGxlQXR0ciAoYXR0ck5hbWUsIGV4cGVjdFR5cGUpIHtcbiAgICAgICAgaWYgKGF0dHJOYW1lIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSBhdHRyaWJ1dGVzW2F0dHJOYW1lXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsID09PSBleHBlY3RUeXBlKSB7XG4gICAgICAgICAgICAgICAgKGF0dHJzIHx8IGluaXRBdHRycygpKVtwcm9wTmFtZVByZWZpeCArIGF0dHJOYW1lXSA9IHZhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKENDX0RFVikge1xuICAgICAgICAgICAgICAgIGNjLmVycm9yKEVSUl9UeXBlLCBhdHRyTmFtZSwgY2xhc3NOYW1lLCBwcm9wTmFtZSwgZXhwZWN0VHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXR0cmlidXRlcy5lZGl0b3JPbmx5KSB7XG4gICAgICAgIGlmIChDQ19ERVYgJiYgdXNlZEluR2V0dGVyKSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDM2MTMsIFwiZWRpdG9yT25seVwiLCBuYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAoYXR0cnMgfHwgaW5pdEF0dHJzKCkpW3Byb3BOYW1lUHJlZml4ICsgJ2VkaXRvck9ubHknXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy9wYXJzZVNpbXBsZUF0dHIoJ3ByZXZlbnREZWZlcnJlZExvYWQnLCAnYm9vbGVhbicpO1xuICAgIGlmIChDQ19ERVYpIHtcbiAgICAgICAgcGFyc2VTaW1wbGVBdHRyKCdkaXNwbGF5TmFtZScsICdzdHJpbmcnKTtcbiAgICAgICAgcGFyc2VTaW1wbGVBdHRyKCdtdWx0aWxpbmUnLCAnYm9vbGVhbicpO1xuICAgICAgICBpZiAoYXR0cmlidXRlcy5yZWFkb25seSkge1xuICAgICAgICAgICAgKGF0dHJzIHx8IGluaXRBdHRycygpKVtwcm9wTmFtZVByZWZpeCArICdyZWFkb25seSddID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBwYXJzZVNpbXBsZUF0dHIoJ3Rvb2x0aXAnLCAnc3RyaW5nJyk7XG4gICAgICAgIHBhcnNlU2ltcGxlQXR0cignc2xpZGUnLCAnYm9vbGVhbicpO1xuICAgIH1cblxuICAgIGlmIChhdHRyaWJ1dGVzLnNlcmlhbGl6YWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKENDX0RFViAmJiB1c2VkSW5HZXR0ZXIpIHtcbiAgICAgICAgICAgIGNjLmVycm9ySUQoMzYxMywgXCJzZXJpYWxpemFibGVcIiwgbmFtZSwgcHJvcE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgKGF0dHJzIHx8IGluaXRBdHRycygpKVtwcm9wTmFtZVByZWZpeCArICdzZXJpYWxpemFibGUnXSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIGlmIChDQ19CVUlMRCB8fCBDQ19URVNUKSB7XG4gICAgLy8gICAgIGxldCBmc2EgPSBhdHRyaWJ1dGVzLmZvcm1lcmx5U2VyaWFsaXplZEFzO1xuICAgIC8vICAgICBpZiAoZnNhKSB7XG4gICAgLy8gICAgICAgICAvLyBqcy5zZXQoY2xzLnByb3RvdHlwZSwgZnNhLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgLy8gICAgICAgICAvLyAgICAgdGhpc1twcm9wTmFtZV0gPSB2YWw7XG4gICAgLy8gICAgICAgICAvLyB9KTtcbiAgICAvLyAgICAgICAgIChhdHRycyB8fCBpbml0QXR0cnMoKSlbcHJvcE5hbWVQcmVmaXggKyAnZm9ybWVybHlTZXJpYWxpemVkQXMnXSA9IGZzYTtcbiAgICAvLyAgICAgICAgIC8vIHVzZWQgYnkgZGVzZXJpYWxpemUtY29tcGlsZWRcbiAgICAvLyAgICAgICAgIGF0dHJzW2ZzYSArIERFTElNRVRFUiArICdkZXNlcmlhbGl6ZUFzJ10gPSBwcm9wTmFtZTtcbiAgICAvLyAgICAgICAgIGNscy5fX0ZTQV9fID0gdHJ1ZTsgICAgIC8vIGluaGVyaXRhYmxlXG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG4gICAgLy8gZWxzZSB7XG4gICAgLy8gICAgIHBhcnNlU2ltcGxlQXR0cignZm9ybWVybHlTZXJpYWxpemVkQXMnLCAnc3RyaW5nJyk7XG4gICAgLy8gfVxuXG4gICAgcGFyc2VTaW1wbGVBdHRyKCdmb3JtZXJseVNlcmlhbGl6ZWRBcycsICdzdHJpbmcnKTtcblxuICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgcGFyc2VTaW1wbGVBdHRyKCdub3RpZnlGb3InLCAnc3RyaW5nJyk7XG5cbiAgICAgICAgaWYgKCdhbmltYXRhYmxlJyBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAoYXR0cnMgfHwgaW5pdEF0dHJzKCkpW3Byb3BOYW1lUHJlZml4ICsgJ2FuaW1hdGFibGUnXSA9ICEhYXR0cmlidXRlcy5hbmltYXRhYmxlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKENDX0RFVikge1xuICAgICAgICB2YXIgdmlzaWJsZSA9IGF0dHJpYnV0ZXMudmlzaWJsZTtcbiAgICAgICAgaWYgKHR5cGVvZiB2aXNpYmxlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWYgKCF2aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgKGF0dHJzIHx8IGluaXRBdHRycygpKVtwcm9wTmFtZVByZWZpeCArICd2aXNpYmxlJ10gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2aXNpYmxlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgKGF0dHJzIHx8IGluaXRBdHRycygpKVtwcm9wTmFtZVByZWZpeCArICd2aXNpYmxlJ10gPSB2aXNpYmxlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIHN0YXJ0c1dpdGhVUyA9IChwcm9wTmFtZS5jaGFyQ29kZUF0KDApID09PSA5NSk7XG4gICAgICAgICAgICBpZiAoc3RhcnRzV2l0aFVTKSB7XG4gICAgICAgICAgICAgICAgKGF0dHJzIHx8IGluaXRBdHRycygpKVtwcm9wTmFtZVByZWZpeCArICd2aXNpYmxlJ10gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciByYW5nZSA9IGF0dHJpYnV0ZXMucmFuZ2U7XG4gICAgaWYgKHJhbmdlKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJhbmdlKSkge1xuICAgICAgICAgICAgaWYgKHJhbmdlLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICAgICAgKGF0dHJzIHx8IGluaXRBdHRycygpKVtwcm9wTmFtZVByZWZpeCArICdtaW4nXSA9IHJhbmdlWzBdO1xuICAgICAgICAgICAgICAgIGF0dHJzW3Byb3BOYW1lUHJlZml4ICsgJ21heCddID0gcmFuZ2VbMV07XG4gICAgICAgICAgICAgICAgaWYgKHJhbmdlLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0cnNbcHJvcE5hbWVQcmVmaXggKyAnc3RlcCddID0gcmFuZ2VbMl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoQ0NfREVWKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjQ3KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChDQ19ERVYpIHtcbiAgICAgICAgICAgIGNjLmVycm9yKEVSUl9UeXBlLCAncmFuZ2UnLCBjbGFzc05hbWUsIHByb3BOYW1lLCAnYXJyYXknKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwYXJzZVNpbXBsZUF0dHIoJ21pbicsICdudW1iZXInKTtcbiAgICBwYXJzZVNpbXBsZUF0dHIoJ21heCcsICdudW1iZXInKTtcbiAgICBwYXJzZVNpbXBsZUF0dHIoJ3N0ZXAnLCAnbnVtYmVyJyk7XG4gICAgcGFyc2VTaW1wbGVBdHRyKCd1c2VyRGF0YScsICdvYmplY3QnKTtcbn1cblxuY2MuQ2xhc3MgPSBDQ0NsYXNzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpc0FycmF5OiBmdW5jdGlvbiAoZGVmYXVsdFZhbCkge1xuICAgICAgICBkZWZhdWx0VmFsID0gZ2V0RGVmYXVsdChkZWZhdWx0VmFsKTtcbiAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoZGVmYXVsdFZhbCk7XG4gICAgfSxcbiAgICBmYXN0RGVmaW5lOiBDQ0NsYXNzLl9mYXN0RGVmaW5lLFxuICAgIGdldE5ld1ZhbHVlVHlwZUNvZGU6IENDX1NVUFBPUlRfSklUICYmIGdldE5ld1ZhbHVlVHlwZUNvZGVKaXQsXG4gICAgSURFTlRJRklFUl9SRSxcbiAgICBlc2NhcGVGb3JKUyxcbiAgICBnZXREZWZhdWx0LFxufTtcblxuaWYgKENDX1RFU1QpIHtcbiAgICBqcy5taXhpbihDQ0NsYXNzLCBtb2R1bGUuZXhwb3J0cyk7XG59XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==