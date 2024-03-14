
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/instantiate-jit.js';
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
// Some helper methods for compile instantiation code
var CCObject = require('./CCObject');

var Destroyed = CCObject.Flags.Destroyed;
var PersistentMask = CCObject.Flags.PersistentMask;

var Attr = require('./attribute');

var js = require('./js');

var CCClass = require('./CCClass');

var Compiler = require('./compiler');

var DEFAULT = Attr.DELIMETER + 'default';
var IDENTIFIER_RE = CCClass.IDENTIFIER_RE;
var escapeForJS = CCClass.escapeForJS;
var VAR = 'var ';
var LOCAL_OBJ = 'o';
var LOCAL_TEMP_OBJ = 't';
var LOCAL_ARRAY = 'a';
var LINE_INDEX_OF_NEW_OBJ = 0;
var DEFAULT_MODULE_CACHE = {
  'cc.Node': 'cc.Node',
  'cc.Sprite': 'cc.Sprite',
  'cc.Label': 'cc.Label',
  'cc.Button': 'cc.Button',
  'cc.Widget': 'cc.Widget',
  'cc.Animation': 'cc.Animation',
  'cc.ClickEvent': false,
  'cc.PrefabInfo': false
};

try {
  // compatible for IE
  !Float32Array.name && (Float32Array.name = 'Float32Array');
  !Float64Array.name && (Float64Array.name = 'Float64Array');
  !Int8Array.name && (Int8Array.name = 'Int8Array');
  !Int16Array.name && (Int16Array.name = 'Int16Array');
  !Int32Array.name && (Int32Array.name = 'Int32Array');
  !Uint8Array.name && (Uint8Array.name = 'Uint8Array');
  !Uint16Array.name && (Uint16Array.name = 'Uint16Array');
  !Uint32Array.name && (Uint32Array.name = 'Uint32Array');
  !Uint8ClampedArray.name && (Uint8ClampedArray.name = 'Uint8ClampedArray');
} catch (e) {} // compatible for iOS 9


function getTypedArrayName(constructor) {
  if (constructor === Float32Array) {
    return 'Float32Array';
  } else if (constructor === Float64Array) {
    return 'Float64Array';
  } else if (constructor === Int8Array) {
    return 'Int8Array';
  } else if (constructor === Int16Array) {
    return 'Int16Array';
  } else if (constructor === Int32Array) {
    return 'Int32Array';
  } else if (constructor === Uint8Array) {
    return 'Uint8Array';
  } else if (constructor === Uint16Array) {
    return 'Uint16Array';
  } else if (constructor === Uint32Array) {
    return 'Uint32Array';
  } else if (constructor === Uint8ClampedArray) {
    return 'Uint8ClampedArray';
  } else {
    throw new Error("Unknown TypedArray to instantiate: " + constructor);
  }
} // HELPER CLASSES
// ('foo', 'bar')
// -> 'var foo = bar;'


function Declaration(varName, expression) {
  this.varName = varName;
  this.expression = expression;
}

Declaration.prototype.toString = function () {
  return VAR + this.varName + '=' + this.expression + ';';
}; // ('a =', 'var b = x')
// -> 'var b = a = x';
// ('a =', 'x')
// -> 'a = x';


function mergeDeclaration(statement, expression) {
  if (expression instanceof Declaration) {
    return new Declaration(expression.varName, statement + expression.expression);
  } else {
    return statement + expression;
  }
} // ('a', ['var b = x', 'b.foo = bar'])
// -> 'var b = a = x;'
// -> 'b.foo = bar;'
// ('a', 'var b = x')
// -> 'var b = a = x;'
// ('a', 'x')
// -> 'a = x;'


function writeAssignment(codeArray, statement, expression) {
  if (Array.isArray(expression)) {
    expression[0] = mergeDeclaration(statement, expression[0]);
    codeArray.push(expression);
  } else {
    codeArray.push(mergeDeclaration(statement, expression) + ';');
  }
} // ('foo', 'bar')
// -> 'targetExpression.foo = bar'
// ('foo1', 'bar1')
// ('foo2', 'bar2')
// -> 't = targetExpression;'
// -> 't.foo1 = bar1;'
// -> 't.foo2 = bar2;'


function Assignments(targetExpression) {
  this._exps = [];
  this._targetExp = targetExpression;
}

Assignments.prototype.append = function (key, expression) {
  this._exps.push([key, expression]);
};

Assignments.prototype.writeCode = function (codeArray) {
  var targetVar;

  if (this._exps.length > 1) {
    codeArray.push(LOCAL_TEMP_OBJ + '=' + this._targetExp + ';');
    targetVar = LOCAL_TEMP_OBJ;
  } else if (this._exps.length === 1) {
    targetVar = this._targetExp;
  } else {
    return;
  }

  for (var i = 0; i < this._exps.length; i++) {
    var pair = this._exps[i];
    writeAssignment(codeArray, targetVar + getPropAccessor(pair[0]) + '=', pair[1]);
  }
};

Assignments.pool = new js.Pool(function (obj) {
  obj._exps.length = 0;
  obj._targetExp = null;
}, 1);

Assignments.pool.get = function (targetExpression) {
  var cache = this._get() || new Assignments();
  cache._targetExp = targetExpression;
  return cache;
}; // HELPER FUNCTIONS


function equalsToDefault(def, value) {
  if (typeof def === 'function') {
    try {
      def = def();
    } catch (e) {
      return false;
    }
  }

  if (def === value) {
    return true;
  }

  if (def && value && typeof def === 'object' && typeof value === 'object' && def.constructor === value.constructor) {
    if (def instanceof cc.ValueType) {
      if (def.equals(value)) {
        return true;
      }
    } else if (Array.isArray(def)) {
      return def.length === 0 && value.length === 0;
    } else if (def.constructor === Object) {
      return js.isEmptyObject(def) && js.isEmptyObject(value);
    }
  }

  return false;
}

function getPropAccessor(key) {
  return IDENTIFIER_RE.test(key) ? '.' + key : '[' + escapeForJS(key) + ']';
} //

/*
 * Variables:
 * {Object[]} O - objs list
 * {Function[]} F - constructor list
 * {Node} [R] - specify an instantiated prefabRoot that all references to prefabRoot in prefab will redirect to
 * {Object} o - current creating object
 */

/*
 * @param {Object} obj - the object to parse
 * @param {Node} [parent]
 */


function Parser(obj, parent) {
  this.parent = parent;
  this.objsToClear_iN$t = []; // used to reset _iN$t variable

  this.codeArray = []; // datas for generated code

  this.objs = [];
  this.funcs = [];
  this.funcModuleCache = js.createMap();
  js.mixin(this.funcModuleCache, DEFAULT_MODULE_CACHE); // {String[]} - variable names for circular references,
  //              not really global, just local variables shared between sub functions

  this.globalVariables = []; // incremental id for new global variables

  this.globalVariableId = 0; // incremental id for new local variables

  this.localVariableId = 0; // generate codeArray
  //if (Array.isArray(obj)) {
  //    this.codeArray.push(this.instantiateArray(obj));
  //}
  //else {

  this.codeArray.push(VAR + LOCAL_OBJ + ',' + LOCAL_TEMP_OBJ + ';', 'if(R){', LOCAL_OBJ + '=R;', '}else{', LOCAL_OBJ + '=R=new ' + this.getFuncModule(obj.constructor, true) + '();', '}');
  js.value(obj, '_iN$t', {
    globalVar: 'R'
  }, true);
  this.objsToClear_iN$t.push(obj);
  this.enumerateObject(this.codeArray, obj); //}
  // generate code

  var globalVariablesDeclaration;

  if (this.globalVariables.length > 0) {
    globalVariablesDeclaration = VAR + this.globalVariables.join(',') + ';';
  }

  var code = Compiler.flattenCodeArray(['return (function(R){', globalVariablesDeclaration || [], this.codeArray, 'return o;', '})']); // generate method and bind with objs

  this.result = Function('O', 'F', code)(this.objs, this.funcs); // if (CC_TEST && !isPhantomJS) {
  //     console.log(code);
  // }
  // cleanup

  for (var i = 0, len = this.objsToClear_iN$t.length; i < len; ++i) {
    this.objsToClear_iN$t[i]._iN$t = null;
  }

  this.objsToClear_iN$t.length = 0;
}

var proto = Parser.prototype;

proto.getFuncModule = function (func, usedInNew) {
  var clsName = js.getClassName(func);

  if (clsName) {
    var cache = this.funcModuleCache[clsName];

    if (cache) {
      return cache;
    } else if (cache === undefined) {
      var clsNameIsModule = clsName.indexOf('.') !== -1;

      if (clsNameIsModule) {
        try {
          // ensure is module
          clsNameIsModule = func === Function('return ' + clsName)();

          if (clsNameIsModule) {
            this.funcModuleCache[clsName] = clsName;
            return clsName;
          }
        } catch (e) {}
      }
    }
  }

  var index = this.funcs.indexOf(func);

  if (index < 0) {
    index = this.funcs.length;
    this.funcs.push(func);
  }

  var res = 'F[' + index + ']';

  if (usedInNew) {
    res = '(' + res + ')';
  }

  this.funcModuleCache[clsName] = res;
  return res;
};

proto.getObjRef = function (obj) {
  var index = this.objs.indexOf(obj);

  if (index < 0) {
    index = this.objs.length;
    this.objs.push(obj);
  }

  return 'O[' + index + ']';
};

proto.setValueType = function (codeArray, defaultValue, srcValue, targetExpression) {
  var assignments = Assignments.pool.get(targetExpression);
  var fastDefinedProps = defaultValue.constructor.__props__;

  if (!fastDefinedProps) {
    fastDefinedProps = Object.keys(defaultValue);
  }

  for (var i = 0; i < fastDefinedProps.length; i++) {
    var propName = fastDefinedProps[i];
    var prop = srcValue[propName];

    if (defaultValue[propName] === prop) {
      continue;
    }

    var expression = this.enumerateField(srcValue, propName, prop);
    assignments.append(propName, expression);
  }

  assignments.writeCode(codeArray);
  Assignments.pool.put(assignments);
};

proto.enumerateCCClass = function (codeArray, obj, klass) {
  var props = klass.__values__;
  var attrs = Attr.getClassAttrs(klass);

  for (var p = 0; p < props.length; p++) {
    var key = props[p];
    var val = obj[key];
    var defaultValue = attrs[key + DEFAULT];

    if (equalsToDefault(defaultValue, val)) {
      continue;
    }

    if (typeof val === 'object' && val instanceof cc.ValueType) {
      defaultValue = CCClass.getDefault(defaultValue);

      if (defaultValue && defaultValue.constructor === val.constructor) {
        // fast case
        var targetExpression = LOCAL_OBJ + getPropAccessor(key);
        this.setValueType(codeArray, defaultValue, val, targetExpression);
        continue;
      }
    }

    this.setObjProp(codeArray, obj, key, val);
  }
};

proto.instantiateArray = function (value) {
  if (value.length === 0) {
    return '[]';
  }

  var arrayVar = LOCAL_ARRAY + ++this.localVariableId;
  var declaration = new Declaration(arrayVar, 'new Array(' + value.length + ')');
  var codeArray = [declaration]; // assign a _iN$t flag to indicate that this object has been parsed.

  js.value(value, '_iN$t', {
    globalVar: '',
    // the name of declared global variable used to access this object
    source: codeArray // the source code array for this object

  }, true);
  this.objsToClear_iN$t.push(value);

  for (var i = 0; i < value.length; ++i) {
    var statement = arrayVar + '[' + i + ']=';
    var expression = this.enumerateField(value, i, value[i]);
    writeAssignment(codeArray, statement, expression);
  }

  return codeArray;
};

proto.instantiateTypedArray = function (value) {
  var type = value.constructor.name || getTypedArrayName(value.constructor);

  if (value.length === 0) {
    return 'new ' + type;
  }

  var arrayVar = LOCAL_ARRAY + ++this.localVariableId;
  var declaration = new Declaration(arrayVar, 'new ' + type + '(' + value.length + ')');
  var codeArray = [declaration]; // assign a _iN$t flag to indicate that this object has been parsed.

  value._iN$t = {
    globalVar: '',
    // the name of declared global variable used to access this object
    source: codeArray // the source code array for this object

  };
  this.objsToClear_iN$t.push(value);

  for (var i = 0; i < value.length; ++i) {
    if (value[i] !== 0) {
      var statement = arrayVar + '[' + i + ']=';
      writeAssignment(codeArray, statement, value[i]);
    }
  }

  return codeArray;
};

proto.enumerateField = function (obj, key, value) {
  if (typeof value === 'object' && value) {
    var _iN$t = value._iN$t;

    if (_iN$t) {
      // parsed
      var globalVar = _iN$t.globalVar;

      if (!globalVar) {
        // declare a global var
        globalVar = _iN$t.globalVar = 'v' + ++this.globalVariableId;
        this.globalVariables.push(globalVar); // insert assignment statement to assign to global var

        var line = _iN$t.source[LINE_INDEX_OF_NEW_OBJ];
        _iN$t.source[LINE_INDEX_OF_NEW_OBJ] = mergeDeclaration(globalVar + '=', line); // if (typeof line ==='string' && line.startsWith(VAR)) {
        //     // var o=xxx -> var o=global=xxx
        //     var LEN_OF_VAR_O = 5;
        //     _iN$t.source[LINE_INDEX_OF_NEW_OBJ] = line.slice(0, LEN_OF_VAR_O) + '=' + globalVar + line.slice(LEN_OF_VAR_O);
        // }
      }

      return globalVar;
    } else if (ArrayBuffer.isView(value)) {
      return this.instantiateTypedArray(value);
    } else if (Array.isArray(value)) {
      return this.instantiateArray(value);
    } else {
      return this.instantiateObj(value);
    }
  } else if (typeof value === 'function') {
    return this.getFuncModule(value);
  } else if (typeof value === 'string') {
    return escapeForJS(value);
  } else {
    if (key === '_objFlags' && obj instanceof CCObject) {
      value &= PersistentMask;
    }

    return value;
  }
};

proto.setObjProp = function (codeArray, obj, key, value) {
  var statement = LOCAL_OBJ + getPropAccessor(key) + '=';
  var expression = this.enumerateField(obj, key, value);
  writeAssignment(codeArray, statement, expression);
}; // codeArray - the source code array for this object


proto.enumerateObject = function (codeArray, obj) {
  var klass = obj.constructor;

  if (cc.Class._isCCClass(klass)) {
    this.enumerateCCClass(codeArray, obj, klass);
  } else {
    // primitive javascript object
    for (var key in obj) {
      if (!obj.hasOwnProperty(key) || key.charCodeAt(0) === 95 && key.charCodeAt(1) === 95 && // starts with "__"
      key !== '__type__') {
        continue;
      }

      var value = obj[key];

      if (typeof value === 'object' && value && value === obj._iN$t) {
        continue;
      }

      this.setObjProp(codeArray, obj, key, value);
    }
  }
};

proto.instantiateObj = function (obj) {
  if (obj instanceof cc.ValueType) {
    return CCClass.getNewValueTypeCode(obj);
  }

  if (obj instanceof cc.Asset) {
    // register to asset list and just return the reference.
    return this.getObjRef(obj);
  }

  if (obj._objFlags & Destroyed) {
    // the same as cc.isValid(obj)
    return null;
  }

  var createCode;
  var ctor = obj.constructor;

  if (cc.Class._isCCClass(ctor)) {
    if (this.parent) {
      if (this.parent instanceof cc.Component) {
        if (obj instanceof cc._BaseNode || obj instanceof cc.Component) {
          return this.getObjRef(obj);
        }
      } else if (this.parent instanceof cc._BaseNode) {
        if (obj instanceof cc._BaseNode) {
          if (!obj.isChildOf(this.parent)) {
            // should not clone other nodes if not descendant
            return this.getObjRef(obj);
          }
        } else if (obj instanceof cc.Component) {
          if (!obj.node.isChildOf(this.parent)) {
            // should not clone other component if not descendant
            return this.getObjRef(obj);
          }
        }
      }
    }

    createCode = new Declaration(LOCAL_OBJ, 'new ' + this.getFuncModule(ctor, true) + '()');
  } else if (ctor === Object) {
    createCode = new Declaration(LOCAL_OBJ, '{}');
  } else if (!ctor) {
    createCode = new Declaration(LOCAL_OBJ, 'Object.create(null)');
  } else {
    // do not clone unknown type
    return this.getObjRef(obj);
  }

  var codeArray = [createCode]; // assign a _iN$t flag to indicate that this object has been parsed.

  js.value(obj, '_iN$t', {
    globalVar: '',
    // the name of declared global variable used to access this object
    source: codeArray // the source code array for this object
    //propName: '',     // the propName this object defined in its source code,
    //                  // if defined, use LOCAL_OBJ.propName to access the obj, else just use o

  }, true);
  this.objsToClear_iN$t.push(obj);
  this.enumerateObject(codeArray, obj);
  return ['(function(){', codeArray, 'return o;})();'];
};

function compile(node) {
  var root = node instanceof cc._BaseNode && node;
  var parser = new Parser(node, root);
  return parser.result;
}

module.exports = {
  compile: compile,
  equalsToDefault: equalsToDefault
};

if (CC_TEST) {
  cc._Test.IntantiateJit = module.exports;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BsYXRmb3JtL2luc3RhbnRpYXRlLWppdC5qcyJdLCJuYW1lcyI6WyJDQ09iamVjdCIsInJlcXVpcmUiLCJEZXN0cm95ZWQiLCJGbGFncyIsIlBlcnNpc3RlbnRNYXNrIiwiQXR0ciIsImpzIiwiQ0NDbGFzcyIsIkNvbXBpbGVyIiwiREVGQVVMVCIsIkRFTElNRVRFUiIsIklERU5USUZJRVJfUkUiLCJlc2NhcGVGb3JKUyIsIlZBUiIsIkxPQ0FMX09CSiIsIkxPQ0FMX1RFTVBfT0JKIiwiTE9DQUxfQVJSQVkiLCJMSU5FX0lOREVYX09GX05FV19PQkoiLCJERUZBVUxUX01PRFVMRV9DQUNIRSIsIkZsb2F0MzJBcnJheSIsIm5hbWUiLCJGbG9hdDY0QXJyYXkiLCJJbnQ4QXJyYXkiLCJJbnQxNkFycmF5IiwiSW50MzJBcnJheSIsIlVpbnQ4QXJyYXkiLCJVaW50MTZBcnJheSIsIlVpbnQzMkFycmF5IiwiVWludDhDbGFtcGVkQXJyYXkiLCJlIiwiZ2V0VHlwZWRBcnJheU5hbWUiLCJjb25zdHJ1Y3RvciIsIkVycm9yIiwiRGVjbGFyYXRpb24iLCJ2YXJOYW1lIiwiZXhwcmVzc2lvbiIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwibWVyZ2VEZWNsYXJhdGlvbiIsInN0YXRlbWVudCIsIndyaXRlQXNzaWdubWVudCIsImNvZGVBcnJheSIsIkFycmF5IiwiaXNBcnJheSIsInB1c2giLCJBc3NpZ25tZW50cyIsInRhcmdldEV4cHJlc3Npb24iLCJfZXhwcyIsIl90YXJnZXRFeHAiLCJhcHBlbmQiLCJrZXkiLCJ3cml0ZUNvZGUiLCJ0YXJnZXRWYXIiLCJsZW5ndGgiLCJpIiwicGFpciIsImdldFByb3BBY2Nlc3NvciIsInBvb2wiLCJQb29sIiwib2JqIiwiZ2V0IiwiY2FjaGUiLCJfZ2V0IiwiZXF1YWxzVG9EZWZhdWx0IiwiZGVmIiwidmFsdWUiLCJjYyIsIlZhbHVlVHlwZSIsImVxdWFscyIsIk9iamVjdCIsImlzRW1wdHlPYmplY3QiLCJ0ZXN0IiwiUGFyc2VyIiwicGFyZW50Iiwib2Jqc1RvQ2xlYXJfaU4kdCIsIm9ianMiLCJmdW5jcyIsImZ1bmNNb2R1bGVDYWNoZSIsImNyZWF0ZU1hcCIsIm1peGluIiwiZ2xvYmFsVmFyaWFibGVzIiwiZ2xvYmFsVmFyaWFibGVJZCIsImxvY2FsVmFyaWFibGVJZCIsImdldEZ1bmNNb2R1bGUiLCJnbG9iYWxWYXIiLCJlbnVtZXJhdGVPYmplY3QiLCJnbG9iYWxWYXJpYWJsZXNEZWNsYXJhdGlvbiIsImpvaW4iLCJjb2RlIiwiZmxhdHRlbkNvZGVBcnJheSIsInJlc3VsdCIsIkZ1bmN0aW9uIiwibGVuIiwiX2lOJHQiLCJwcm90byIsImZ1bmMiLCJ1c2VkSW5OZXciLCJjbHNOYW1lIiwiZ2V0Q2xhc3NOYW1lIiwidW5kZWZpbmVkIiwiY2xzTmFtZUlzTW9kdWxlIiwiaW5kZXhPZiIsImluZGV4IiwicmVzIiwiZ2V0T2JqUmVmIiwic2V0VmFsdWVUeXBlIiwiZGVmYXVsdFZhbHVlIiwic3JjVmFsdWUiLCJhc3NpZ25tZW50cyIsImZhc3REZWZpbmVkUHJvcHMiLCJfX3Byb3BzX18iLCJrZXlzIiwicHJvcE5hbWUiLCJwcm9wIiwiZW51bWVyYXRlRmllbGQiLCJwdXQiLCJlbnVtZXJhdGVDQ0NsYXNzIiwia2xhc3MiLCJwcm9wcyIsIl9fdmFsdWVzX18iLCJhdHRycyIsImdldENsYXNzQXR0cnMiLCJwIiwidmFsIiwiZ2V0RGVmYXVsdCIsInNldE9ialByb3AiLCJpbnN0YW50aWF0ZUFycmF5IiwiYXJyYXlWYXIiLCJkZWNsYXJhdGlvbiIsInNvdXJjZSIsImluc3RhbnRpYXRlVHlwZWRBcnJheSIsInR5cGUiLCJsaW5lIiwiQXJyYXlCdWZmZXIiLCJpc1ZpZXciLCJpbnN0YW50aWF0ZU9iaiIsIkNsYXNzIiwiX2lzQ0NDbGFzcyIsImhhc093blByb3BlcnR5IiwiY2hhckNvZGVBdCIsImdldE5ld1ZhbHVlVHlwZUNvZGUiLCJBc3NldCIsIl9vYmpGbGFncyIsImNyZWF0ZUNvZGUiLCJjdG9yIiwiQ29tcG9uZW50IiwiX0Jhc2VOb2RlIiwiaXNDaGlsZE9mIiwibm9kZSIsImNvbXBpbGUiLCJyb290IiwicGFyc2VyIiwibW9kdWxlIiwiZXhwb3J0cyIsIkNDX1RFU1QiLCJfVGVzdCIsIkludGFudGlhdGVKaXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUEsSUFBSUEsUUFBUSxHQUFHQyxPQUFPLENBQUMsWUFBRCxDQUF0Qjs7QUFDQSxJQUFJQyxTQUFTLEdBQUdGLFFBQVEsQ0FBQ0csS0FBVCxDQUFlRCxTQUEvQjtBQUNBLElBQUlFLGNBQWMsR0FBR0osUUFBUSxDQUFDRyxLQUFULENBQWVDLGNBQXBDOztBQUNBLElBQUlDLElBQUksR0FBR0osT0FBTyxDQUFDLGFBQUQsQ0FBbEI7O0FBQ0EsSUFBSUssRUFBRSxHQUFHTCxPQUFPLENBQUMsTUFBRCxDQUFoQjs7QUFDQSxJQUFJTSxPQUFPLEdBQUdOLE9BQU8sQ0FBQyxXQUFELENBQXJCOztBQUNBLElBQUlPLFFBQVEsR0FBR1AsT0FBTyxDQUFDLFlBQUQsQ0FBdEI7O0FBRUEsSUFBSVEsT0FBTyxHQUFHSixJQUFJLENBQUNLLFNBQUwsR0FBaUIsU0FBL0I7QUFDQSxJQUFJQyxhQUFhLEdBQUdKLE9BQU8sQ0FBQ0ksYUFBNUI7QUFDQSxJQUFJQyxXQUFXLEdBQUdMLE9BQU8sQ0FBQ0ssV0FBMUI7QUFFQSxJQUFNQyxHQUFHLEdBQUcsTUFBWjtBQUNBLElBQU1DLFNBQVMsR0FBRyxHQUFsQjtBQUNBLElBQU1DLGNBQWMsR0FBRyxHQUF2QjtBQUNBLElBQU1DLFdBQVcsR0FBRyxHQUFwQjtBQUNBLElBQU1DLHFCQUFxQixHQUFHLENBQTlCO0FBRUEsSUFBTUMsb0JBQW9CLEdBQUc7QUFDekIsYUFBVyxTQURjO0FBRXpCLGVBQWEsV0FGWTtBQUd6QixjQUFZLFVBSGE7QUFJekIsZUFBYSxXQUpZO0FBS3pCLGVBQWEsV0FMWTtBQU16QixrQkFBZ0IsY0FOUztBQU96QixtQkFBaUIsS0FQUTtBQVF6QixtQkFBaUI7QUFSUSxDQUE3Qjs7QUFXQSxJQUFJO0FBQ0E7QUFDQSxHQUFDQyxZQUFZLENBQUNDLElBQWQsS0FBdUJELFlBQVksQ0FBQ0MsSUFBYixHQUFvQixjQUEzQztBQUNBLEdBQUNDLFlBQVksQ0FBQ0QsSUFBZCxLQUF1QkMsWUFBWSxDQUFDRCxJQUFiLEdBQW9CLGNBQTNDO0FBRUEsR0FBQ0UsU0FBUyxDQUFDRixJQUFYLEtBQW9CRSxTQUFTLENBQUNGLElBQVYsR0FBaUIsV0FBckM7QUFDQSxHQUFDRyxVQUFVLENBQUNILElBQVosS0FBcUJHLFVBQVUsQ0FBQ0gsSUFBWCxHQUFrQixZQUF2QztBQUNBLEdBQUNJLFVBQVUsQ0FBQ0osSUFBWixLQUFxQkksVUFBVSxDQUFDSixJQUFYLEdBQWtCLFlBQXZDO0FBRUEsR0FBQ0ssVUFBVSxDQUFDTCxJQUFaLEtBQXFCSyxVQUFVLENBQUNMLElBQVgsR0FBa0IsWUFBdkM7QUFDQSxHQUFDTSxXQUFXLENBQUNOLElBQWIsS0FBc0JNLFdBQVcsQ0FBQ04sSUFBWixHQUFtQixhQUF6QztBQUNBLEdBQUNPLFdBQVcsQ0FBQ1AsSUFBYixLQUFzQk8sV0FBVyxDQUFDUCxJQUFaLEdBQW1CLGFBQXpDO0FBRUEsR0FBQ1EsaUJBQWlCLENBQUNSLElBQW5CLEtBQTRCUSxpQkFBaUIsQ0FBQ1IsSUFBbEIsR0FBeUIsbUJBQXJEO0FBQ0gsQ0FkRCxDQWVBLE9BQU9TLENBQVAsRUFBVSxDQUFFLEVBRVo7OztBQUNBLFNBQVNDLGlCQUFULENBQTRCQyxXQUE1QixFQUF5QztBQUNyQyxNQUFJQSxXQUFXLEtBQUtaLFlBQXBCLEVBQWtDO0FBQUUsV0FBTyxjQUFQO0FBQXdCLEdBQTVELE1BQ0ssSUFBSVksV0FBVyxLQUFLVixZQUFwQixFQUFrQztBQUFFLFdBQU8sY0FBUDtBQUF3QixHQUE1RCxNQUVBLElBQUlVLFdBQVcsS0FBS1QsU0FBcEIsRUFBK0I7QUFBRSxXQUFPLFdBQVA7QUFBcUIsR0FBdEQsTUFDQSxJQUFJUyxXQUFXLEtBQUtSLFVBQXBCLEVBQWdDO0FBQUUsV0FBTyxZQUFQO0FBQXNCLEdBQXhELE1BQ0EsSUFBSVEsV0FBVyxLQUFLUCxVQUFwQixFQUFnQztBQUFFLFdBQU8sWUFBUDtBQUFzQixHQUF4RCxNQUVBLElBQUlPLFdBQVcsS0FBS04sVUFBcEIsRUFBZ0M7QUFBRSxXQUFPLFlBQVA7QUFBc0IsR0FBeEQsTUFDQSxJQUFJTSxXQUFXLEtBQUtMLFdBQXBCLEVBQWlDO0FBQUUsV0FBTyxhQUFQO0FBQXVCLEdBQTFELE1BQ0EsSUFBSUssV0FBVyxLQUFLSixXQUFwQixFQUFpQztBQUFFLFdBQU8sYUFBUDtBQUF1QixHQUExRCxNQUVBLElBQUlJLFdBQVcsS0FBS0gsaUJBQXBCLEVBQXVDO0FBQUUsV0FBTyxtQkFBUDtBQUE2QixHQUF0RSxNQUNBO0FBQ0QsVUFBTSxJQUFJSSxLQUFKLHlDQUFnREQsV0FBaEQsQ0FBTjtBQUNIO0FBQ0osRUFFRDtBQUVBO0FBQ0E7OztBQUNBLFNBQVNFLFdBQVQsQ0FBc0JDLE9BQXRCLEVBQStCQyxVQUEvQixFQUEyQztBQUN2QyxPQUFLRCxPQUFMLEdBQWVBLE9BQWY7QUFDQSxPQUFLQyxVQUFMLEdBQWtCQSxVQUFsQjtBQUNIOztBQUNERixXQUFXLENBQUNHLFNBQVosQ0FBc0JDLFFBQXRCLEdBQWlDLFlBQVk7QUFDekMsU0FBT3hCLEdBQUcsR0FBRyxLQUFLcUIsT0FBWCxHQUFxQixHQUFyQixHQUEyQixLQUFLQyxVQUFoQyxHQUE2QyxHQUFwRDtBQUNILENBRkQsRUFJQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsU0FBU0csZ0JBQVQsQ0FBMkJDLFNBQTNCLEVBQXNDSixVQUF0QyxFQUFrRDtBQUM5QyxNQUFJQSxVQUFVLFlBQVlGLFdBQTFCLEVBQXVDO0FBQ25DLFdBQU8sSUFBSUEsV0FBSixDQUFnQkUsVUFBVSxDQUFDRCxPQUEzQixFQUFvQ0ssU0FBUyxHQUFHSixVQUFVLENBQUNBLFVBQTNELENBQVA7QUFDSCxHQUZELE1BR0s7QUFDRCxXQUFPSSxTQUFTLEdBQUdKLFVBQW5CO0FBQ0g7QUFDSixFQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxTQUFTSyxlQUFULENBQTBCQyxTQUExQixFQUFxQ0YsU0FBckMsRUFBZ0RKLFVBQWhELEVBQTREO0FBQ3hELE1BQUlPLEtBQUssQ0FBQ0MsT0FBTixDQUFjUixVQUFkLENBQUosRUFBK0I7QUFDM0JBLElBQUFBLFVBQVUsQ0FBQyxDQUFELENBQVYsR0FBZ0JHLGdCQUFnQixDQUFDQyxTQUFELEVBQVlKLFVBQVUsQ0FBQyxDQUFELENBQXRCLENBQWhDO0FBQ0FNLElBQUFBLFNBQVMsQ0FBQ0csSUFBVixDQUFlVCxVQUFmO0FBQ0gsR0FIRCxNQUlLO0FBQ0RNLElBQUFBLFNBQVMsQ0FBQ0csSUFBVixDQUFlTixnQkFBZ0IsQ0FBQ0MsU0FBRCxFQUFZSixVQUFaLENBQWhCLEdBQTBDLEdBQXpEO0FBQ0g7QUFDSixFQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxTQUFTVSxXQUFULENBQXNCQyxnQkFBdEIsRUFBd0M7QUFDcEMsT0FBS0MsS0FBTCxHQUFhLEVBQWI7QUFDQSxPQUFLQyxVQUFMLEdBQWtCRixnQkFBbEI7QUFDSDs7QUFDREQsV0FBVyxDQUFDVCxTQUFaLENBQXNCYSxNQUF0QixHQUErQixVQUFVQyxHQUFWLEVBQWVmLFVBQWYsRUFBMkI7QUFDdEQsT0FBS1ksS0FBTCxDQUFXSCxJQUFYLENBQWdCLENBQUNNLEdBQUQsRUFBTWYsVUFBTixDQUFoQjtBQUNILENBRkQ7O0FBR0FVLFdBQVcsQ0FBQ1QsU0FBWixDQUFzQmUsU0FBdEIsR0FBa0MsVUFBVVYsU0FBVixFQUFxQjtBQUNuRCxNQUFJVyxTQUFKOztBQUNBLE1BQUksS0FBS0wsS0FBTCxDQUFXTSxNQUFYLEdBQW9CLENBQXhCLEVBQTJCO0FBQ3ZCWixJQUFBQSxTQUFTLENBQUNHLElBQVYsQ0FBZTdCLGNBQWMsR0FBRyxHQUFqQixHQUF1QixLQUFLaUMsVUFBNUIsR0FBeUMsR0FBeEQ7QUFDQUksSUFBQUEsU0FBUyxHQUFHckMsY0FBWjtBQUNILEdBSEQsTUFJSyxJQUFJLEtBQUtnQyxLQUFMLENBQVdNLE1BQVgsS0FBc0IsQ0FBMUIsRUFBNkI7QUFDOUJELElBQUFBLFNBQVMsR0FBRyxLQUFLSixVQUFqQjtBQUNILEdBRkksTUFHQTtBQUNEO0FBQ0g7O0FBQ0QsT0FBSyxJQUFJTSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLEtBQUtQLEtBQUwsQ0FBV00sTUFBL0IsRUFBdUNDLENBQUMsRUFBeEMsRUFBNEM7QUFDeEMsUUFBSUMsSUFBSSxHQUFHLEtBQUtSLEtBQUwsQ0FBV08sQ0FBWCxDQUFYO0FBQ0FkLElBQUFBLGVBQWUsQ0FBQ0MsU0FBRCxFQUFZVyxTQUFTLEdBQUdJLGVBQWUsQ0FBQ0QsSUFBSSxDQUFDLENBQUQsQ0FBTCxDQUEzQixHQUF1QyxHQUFuRCxFQUF3REEsSUFBSSxDQUFDLENBQUQsQ0FBNUQsQ0FBZjtBQUNIO0FBQ0osQ0FoQkQ7O0FBa0JBVixXQUFXLENBQUNZLElBQVosR0FBbUIsSUFBSW5ELEVBQUUsQ0FBQ29ELElBQVAsQ0FBWSxVQUFVQyxHQUFWLEVBQWU7QUFDZEEsRUFBQUEsR0FBRyxDQUFDWixLQUFKLENBQVVNLE1BQVYsR0FBbUIsQ0FBbkI7QUFDQU0sRUFBQUEsR0FBRyxDQUFDWCxVQUFKLEdBQWlCLElBQWpCO0FBQ0gsQ0FIVixFQUdZLENBSFosQ0FBbkI7O0FBSUFILFdBQVcsQ0FBQ1ksSUFBWixDQUFpQkcsR0FBakIsR0FBdUIsVUFBVWQsZ0JBQVYsRUFBNEI7QUFDL0MsTUFBSWUsS0FBSyxHQUFHLEtBQUtDLElBQUwsTUFBZSxJQUFJakIsV0FBSixFQUEzQjtBQUNBZ0IsRUFBQUEsS0FBSyxDQUFDYixVQUFOLEdBQW1CRixnQkFBbkI7QUFDQSxTQUFPZSxLQUFQO0FBQ0gsQ0FKRCxFQU1BOzs7QUFFQSxTQUFTRSxlQUFULENBQTBCQyxHQUExQixFQUErQkMsS0FBL0IsRUFBc0M7QUFDbEMsTUFBSSxPQUFPRCxHQUFQLEtBQWUsVUFBbkIsRUFBK0I7QUFDM0IsUUFBSTtBQUNBQSxNQUFBQSxHQUFHLEdBQUdBLEdBQUcsRUFBVDtBQUNILEtBRkQsQ0FHQSxPQUFPbkMsQ0FBUCxFQUFVO0FBQ04sYUFBTyxLQUFQO0FBQ0g7QUFDSjs7QUFDRCxNQUFJbUMsR0FBRyxLQUFLQyxLQUFaLEVBQW1CO0FBQ2YsV0FBTyxJQUFQO0FBQ0g7O0FBQ0QsTUFBSUQsR0FBRyxJQUFJQyxLQUFQLElBQ0EsT0FBT0QsR0FBUCxLQUFlLFFBRGYsSUFDMkIsT0FBT0MsS0FBUCxLQUFpQixRQUQ1QyxJQUVBRCxHQUFHLENBQUNqQyxXQUFKLEtBQW9Ca0MsS0FBSyxDQUFDbEMsV0FGOUIsRUFHQTtBQUNJLFFBQUlpQyxHQUFHLFlBQVlFLEVBQUUsQ0FBQ0MsU0FBdEIsRUFBaUM7QUFDN0IsVUFBSUgsR0FBRyxDQUFDSSxNQUFKLENBQVdILEtBQVgsQ0FBSixFQUF1QjtBQUNuQixlQUFPLElBQVA7QUFDSDtBQUNKLEtBSkQsTUFLSyxJQUFJdkIsS0FBSyxDQUFDQyxPQUFOLENBQWNxQixHQUFkLENBQUosRUFBd0I7QUFDekIsYUFBT0EsR0FBRyxDQUFDWCxNQUFKLEtBQWUsQ0FBZixJQUFvQlksS0FBSyxDQUFDWixNQUFOLEtBQWlCLENBQTVDO0FBQ0gsS0FGSSxNQUdBLElBQUlXLEdBQUcsQ0FBQ2pDLFdBQUosS0FBb0JzQyxNQUF4QixFQUFnQztBQUNqQyxhQUFPL0QsRUFBRSxDQUFDZ0UsYUFBSCxDQUFpQk4sR0FBakIsS0FBeUIxRCxFQUFFLENBQUNnRSxhQUFILENBQWlCTCxLQUFqQixDQUFoQztBQUNIO0FBQ0o7O0FBQ0QsU0FBTyxLQUFQO0FBQ0g7O0FBRUQsU0FBU1QsZUFBVCxDQUEwQk4sR0FBMUIsRUFBK0I7QUFDM0IsU0FBT3ZDLGFBQWEsQ0FBQzRELElBQWQsQ0FBbUJyQixHQUFuQixJQUEyQixNQUFNQSxHQUFqQyxHQUF5QyxNQUFNdEMsV0FBVyxDQUFDc0MsR0FBRCxDQUFqQixHQUF5QixHQUF6RTtBQUNILEVBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLFNBQVNzQixNQUFULENBQWlCYixHQUFqQixFQUFzQmMsTUFBdEIsRUFBOEI7QUFDMUIsT0FBS0EsTUFBTCxHQUFjQSxNQUFkO0FBRUEsT0FBS0MsZ0JBQUwsR0FBd0IsRUFBeEIsQ0FIMEIsQ0FHSTs7QUFDOUIsT0FBS2pDLFNBQUwsR0FBaUIsRUFBakIsQ0FKMEIsQ0FNMUI7O0FBQ0EsT0FBS2tDLElBQUwsR0FBWSxFQUFaO0FBQ0EsT0FBS0MsS0FBTCxHQUFhLEVBQWI7QUFFQSxPQUFLQyxlQUFMLEdBQXVCdkUsRUFBRSxDQUFDd0UsU0FBSCxFQUF2QjtBQUNBeEUsRUFBQUEsRUFBRSxDQUFDeUUsS0FBSCxDQUFTLEtBQUtGLGVBQWQsRUFBK0IzRCxvQkFBL0IsRUFYMEIsQ0FhMUI7QUFDQTs7QUFDQSxPQUFLOEQsZUFBTCxHQUF1QixFQUF2QixDQWYwQixDQWdCMUI7O0FBQ0EsT0FBS0MsZ0JBQUwsR0FBd0IsQ0FBeEIsQ0FqQjBCLENBa0IxQjs7QUFDQSxPQUFLQyxlQUFMLEdBQXVCLENBQXZCLENBbkIwQixDQXFCMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDSSxPQUFLekMsU0FBTCxDQUFlRyxJQUFmLENBQW9CL0IsR0FBRyxHQUFHQyxTQUFOLEdBQWtCLEdBQWxCLEdBQXdCQyxjQUF4QixHQUF5QyxHQUE3RCxFQUNtQixRQURuQixFQUV3QkQsU0FBUyxHQUFHLEtBRnBDLEVBR21CLFFBSG5CLEVBSXdCQSxTQUFTLEdBQUcsU0FBWixHQUF3QixLQUFLcUUsYUFBTCxDQUFtQnhCLEdBQUcsQ0FBQzVCLFdBQXZCLEVBQW9DLElBQXBDLENBQXhCLEdBQW9FLEtBSjVGLEVBS21CLEdBTG5CO0FBTUF6QixFQUFBQSxFQUFFLENBQUMyRCxLQUFILENBQVNOLEdBQVQsRUFBYyxPQUFkLEVBQXVCO0FBQUV5QixJQUFBQSxTQUFTLEVBQUU7QUFBYixHQUF2QixFQUEyQyxJQUEzQztBQUNBLE9BQUtWLGdCQUFMLENBQXNCOUIsSUFBdEIsQ0FBMkJlLEdBQTNCO0FBQ0EsT0FBSzBCLGVBQUwsQ0FBcUIsS0FBSzVDLFNBQTFCLEVBQXFDa0IsR0FBckMsRUFsQ3NCLENBbUMxQjtBQUVBOztBQUNBLE1BQUkyQiwwQkFBSjs7QUFDQSxNQUFJLEtBQUtOLGVBQUwsQ0FBcUIzQixNQUFyQixHQUE4QixDQUFsQyxFQUFxQztBQUNqQ2lDLElBQUFBLDBCQUEwQixHQUFHekUsR0FBRyxHQUFHLEtBQUttRSxlQUFMLENBQXFCTyxJQUFyQixDQUEwQixHQUExQixDQUFOLEdBQXVDLEdBQXBFO0FBQ0g7O0FBQ0QsTUFBSUMsSUFBSSxHQUFHaEYsUUFBUSxDQUFDaUYsZ0JBQVQsQ0FBMEIsQ0FBQyxzQkFBRCxFQUNMSCwwQkFBMEIsSUFBSSxFQUR6QixFQUVMLEtBQUs3QyxTQUZBLEVBR0wsV0FISyxFQUlSLElBSlEsQ0FBMUIsQ0FBWCxDQTFDMEIsQ0FnRDFCOztBQUNBLE9BQUtpRCxNQUFMLEdBQWNDLFFBQVEsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXSCxJQUFYLENBQVIsQ0FBeUIsS0FBS2IsSUFBOUIsRUFBb0MsS0FBS0MsS0FBekMsQ0FBZCxDQWpEMEIsQ0FtRDFCO0FBQ0E7QUFDQTtBQUVBOztBQUNBLE9BQUssSUFBSXRCLENBQUMsR0FBRyxDQUFSLEVBQVdzQyxHQUFHLEdBQUcsS0FBS2xCLGdCQUFMLENBQXNCckIsTUFBNUMsRUFBb0RDLENBQUMsR0FBR3NDLEdBQXhELEVBQTZELEVBQUV0QyxDQUEvRCxFQUFrRTtBQUM5RCxTQUFLb0IsZ0JBQUwsQ0FBc0JwQixDQUF0QixFQUF5QnVDLEtBQXpCLEdBQWlDLElBQWpDO0FBQ0g7O0FBQ0QsT0FBS25CLGdCQUFMLENBQXNCckIsTUFBdEIsR0FBK0IsQ0FBL0I7QUFDSDs7QUFFRCxJQUFJeUMsS0FBSyxHQUFHdEIsTUFBTSxDQUFDcEMsU0FBbkI7O0FBRUEwRCxLQUFLLENBQUNYLGFBQU4sR0FBc0IsVUFBVVksSUFBVixFQUFnQkMsU0FBaEIsRUFBMkI7QUFDN0MsTUFBSUMsT0FBTyxHQUFHM0YsRUFBRSxDQUFDNEYsWUFBSCxDQUFnQkgsSUFBaEIsQ0FBZDs7QUFDQSxNQUFJRSxPQUFKLEVBQWE7QUFDVCxRQUFJcEMsS0FBSyxHQUFHLEtBQUtnQixlQUFMLENBQXFCb0IsT0FBckIsQ0FBWjs7QUFDQSxRQUFJcEMsS0FBSixFQUFXO0FBQ1AsYUFBT0EsS0FBUDtBQUNILEtBRkQsTUFHSyxJQUFJQSxLQUFLLEtBQUtzQyxTQUFkLEVBQXlCO0FBQzFCLFVBQUlDLGVBQWUsR0FBR0gsT0FBTyxDQUFDSSxPQUFSLENBQWdCLEdBQWhCLE1BQXlCLENBQUMsQ0FBaEQ7O0FBQ0EsVUFBSUQsZUFBSixFQUFxQjtBQUNqQixZQUFJO0FBQ0E7QUFDQUEsVUFBQUEsZUFBZSxHQUFJTCxJQUFJLEtBQUtKLFFBQVEsQ0FBQyxZQUFZTSxPQUFiLENBQVIsRUFBNUI7O0FBQ0EsY0FBSUcsZUFBSixFQUFxQjtBQUNqQixpQkFBS3ZCLGVBQUwsQ0FBcUJvQixPQUFyQixJQUFnQ0EsT0FBaEM7QUFDQSxtQkFBT0EsT0FBUDtBQUNIO0FBQ0osU0FQRCxDQVFBLE9BQU9wRSxDQUFQLEVBQVUsQ0FBRTtBQUNmO0FBQ0o7QUFDSjs7QUFDRCxNQUFJeUUsS0FBSyxHQUFHLEtBQUsxQixLQUFMLENBQVd5QixPQUFYLENBQW1CTixJQUFuQixDQUFaOztBQUNBLE1BQUlPLEtBQUssR0FBRyxDQUFaLEVBQWU7QUFDWEEsSUFBQUEsS0FBSyxHQUFHLEtBQUsxQixLQUFMLENBQVd2QixNQUFuQjtBQUNBLFNBQUt1QixLQUFMLENBQVdoQyxJQUFYLENBQWdCbUQsSUFBaEI7QUFDSDs7QUFDRCxNQUFJUSxHQUFHLEdBQUcsT0FBT0QsS0FBUCxHQUFlLEdBQXpCOztBQUNBLE1BQUlOLFNBQUosRUFBZTtBQUNYTyxJQUFBQSxHQUFHLEdBQUcsTUFBTUEsR0FBTixHQUFZLEdBQWxCO0FBQ0g7O0FBQ0QsT0FBSzFCLGVBQUwsQ0FBcUJvQixPQUFyQixJQUFnQ00sR0FBaEM7QUFDQSxTQUFPQSxHQUFQO0FBQ0gsQ0FqQ0Q7O0FBbUNBVCxLQUFLLENBQUNVLFNBQU4sR0FBa0IsVUFBVTdDLEdBQVYsRUFBZTtBQUM3QixNQUFJMkMsS0FBSyxHQUFHLEtBQUszQixJQUFMLENBQVUwQixPQUFWLENBQWtCMUMsR0FBbEIsQ0FBWjs7QUFDQSxNQUFJMkMsS0FBSyxHQUFHLENBQVosRUFBZTtBQUNYQSxJQUFBQSxLQUFLLEdBQUcsS0FBSzNCLElBQUwsQ0FBVXRCLE1BQWxCO0FBQ0EsU0FBS3NCLElBQUwsQ0FBVS9CLElBQVYsQ0FBZWUsR0FBZjtBQUNIOztBQUNELFNBQU8sT0FBTzJDLEtBQVAsR0FBZSxHQUF0QjtBQUNILENBUEQ7O0FBU0FSLEtBQUssQ0FBQ1csWUFBTixHQUFxQixVQUFVaEUsU0FBVixFQUFxQmlFLFlBQXJCLEVBQW1DQyxRQUFuQyxFQUE2QzdELGdCQUE3QyxFQUErRDtBQUNoRixNQUFJOEQsV0FBVyxHQUFHL0QsV0FBVyxDQUFDWSxJQUFaLENBQWlCRyxHQUFqQixDQUFxQmQsZ0JBQXJCLENBQWxCO0FBQ0EsTUFBSStELGdCQUFnQixHQUFHSCxZQUFZLENBQUMzRSxXQUFiLENBQXlCK0UsU0FBaEQ7O0FBQ0EsTUFBSSxDQUFDRCxnQkFBTCxFQUF1QjtBQUNuQkEsSUFBQUEsZ0JBQWdCLEdBQUd4QyxNQUFNLENBQUMwQyxJQUFQLENBQVlMLFlBQVosQ0FBbkI7QUFDSDs7QUFDRCxPQUFLLElBQUlwRCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHdUQsZ0JBQWdCLENBQUN4RCxNQUFyQyxFQUE2Q0MsQ0FBQyxFQUE5QyxFQUFrRDtBQUM5QyxRQUFJMEQsUUFBUSxHQUFHSCxnQkFBZ0IsQ0FBQ3ZELENBQUQsQ0FBL0I7QUFDQSxRQUFJMkQsSUFBSSxHQUFHTixRQUFRLENBQUNLLFFBQUQsQ0FBbkI7O0FBQ0EsUUFBSU4sWUFBWSxDQUFDTSxRQUFELENBQVosS0FBMkJDLElBQS9CLEVBQXFDO0FBQ2pDO0FBQ0g7O0FBQ0QsUUFBSTlFLFVBQVUsR0FBRyxLQUFLK0UsY0FBTCxDQUFvQlAsUUFBcEIsRUFBOEJLLFFBQTlCLEVBQXdDQyxJQUF4QyxDQUFqQjtBQUNBTCxJQUFBQSxXQUFXLENBQUMzRCxNQUFaLENBQW1CK0QsUUFBbkIsRUFBNkI3RSxVQUE3QjtBQUNIOztBQUNEeUUsRUFBQUEsV0FBVyxDQUFDekQsU0FBWixDQUFzQlYsU0FBdEI7QUFDQUksRUFBQUEsV0FBVyxDQUFDWSxJQUFaLENBQWlCMEQsR0FBakIsQ0FBcUJQLFdBQXJCO0FBQ0gsQ0FqQkQ7O0FBbUJBZCxLQUFLLENBQUNzQixnQkFBTixHQUF5QixVQUFVM0UsU0FBVixFQUFxQmtCLEdBQXJCLEVBQTBCMEQsS0FBMUIsRUFBaUM7QUFDdEQsTUFBSUMsS0FBSyxHQUFHRCxLQUFLLENBQUNFLFVBQWxCO0FBQ0EsTUFBSUMsS0FBSyxHQUFHbkgsSUFBSSxDQUFDb0gsYUFBTCxDQUFtQkosS0FBbkIsQ0FBWjs7QUFDQSxPQUFLLElBQUlLLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdKLEtBQUssQ0FBQ2pFLE1BQTFCLEVBQWtDcUUsQ0FBQyxFQUFuQyxFQUF1QztBQUNuQyxRQUFJeEUsR0FBRyxHQUFHb0UsS0FBSyxDQUFDSSxDQUFELENBQWY7QUFDQSxRQUFJQyxHQUFHLEdBQUdoRSxHQUFHLENBQUNULEdBQUQsQ0FBYjtBQUNBLFFBQUl3RCxZQUFZLEdBQUdjLEtBQUssQ0FBQ3RFLEdBQUcsR0FBR3pDLE9BQVAsQ0FBeEI7O0FBQ0EsUUFBSXNELGVBQWUsQ0FBQzJDLFlBQUQsRUFBZWlCLEdBQWYsQ0FBbkIsRUFBd0M7QUFDcEM7QUFDSDs7QUFDRCxRQUFJLE9BQU9BLEdBQVAsS0FBZSxRQUFmLElBQTJCQSxHQUFHLFlBQVl6RCxFQUFFLENBQUNDLFNBQWpELEVBQTREO0FBQ3hEdUMsTUFBQUEsWUFBWSxHQUFHbkcsT0FBTyxDQUFDcUgsVUFBUixDQUFtQmxCLFlBQW5CLENBQWY7O0FBQ0EsVUFBSUEsWUFBWSxJQUFJQSxZQUFZLENBQUMzRSxXQUFiLEtBQTZCNEYsR0FBRyxDQUFDNUYsV0FBckQsRUFBa0U7QUFDOUQ7QUFDQSxZQUFJZSxnQkFBZ0IsR0FBR2hDLFNBQVMsR0FBRzBDLGVBQWUsQ0FBQ04sR0FBRCxDQUFsRDtBQUNBLGFBQUt1RCxZQUFMLENBQWtCaEUsU0FBbEIsRUFBNkJpRSxZQUE3QixFQUEyQ2lCLEdBQTNDLEVBQWdEN0UsZ0JBQWhEO0FBQ0E7QUFDSDtBQUNKOztBQUNELFNBQUsrRSxVQUFMLENBQWdCcEYsU0FBaEIsRUFBMkJrQixHQUEzQixFQUFnQ1QsR0FBaEMsRUFBcUN5RSxHQUFyQztBQUNIO0FBQ0osQ0FyQkQ7O0FBdUJBN0IsS0FBSyxDQUFDZ0MsZ0JBQU4sR0FBeUIsVUFBVTdELEtBQVYsRUFBaUI7QUFDdEMsTUFBSUEsS0FBSyxDQUFDWixNQUFOLEtBQWlCLENBQXJCLEVBQXdCO0FBQ3BCLFdBQU8sSUFBUDtBQUNIOztBQUVELE1BQUkwRSxRQUFRLEdBQUcvRyxXQUFXLEdBQUksRUFBRSxLQUFLa0UsZUFBckM7QUFDQSxNQUFJOEMsV0FBVyxHQUFHLElBQUkvRixXQUFKLENBQWdCOEYsUUFBaEIsRUFBMEIsZUFBZTlELEtBQUssQ0FBQ1osTUFBckIsR0FBOEIsR0FBeEQsQ0FBbEI7QUFDQSxNQUFJWixTQUFTLEdBQUcsQ0FBQ3VGLFdBQUQsQ0FBaEIsQ0FQc0MsQ0FTdEM7O0FBQ0ExSCxFQUFBQSxFQUFFLENBQUMyRCxLQUFILENBQVNBLEtBQVQsRUFBZ0IsT0FBaEIsRUFBeUI7QUFDckJtQixJQUFBQSxTQUFTLEVBQUUsRUFEVTtBQUNEO0FBQ3BCNkMsSUFBQUEsTUFBTSxFQUFFeEYsU0FGYSxDQUVEOztBQUZDLEdBQXpCLEVBR0csSUFISDtBQUlBLE9BQUtpQyxnQkFBTCxDQUFzQjlCLElBQXRCLENBQTJCcUIsS0FBM0I7O0FBRUEsT0FBSyxJQUFJWCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHVyxLQUFLLENBQUNaLE1BQTFCLEVBQWtDLEVBQUVDLENBQXBDLEVBQXVDO0FBQ25DLFFBQUlmLFNBQVMsR0FBR3dGLFFBQVEsR0FBRyxHQUFYLEdBQWlCekUsQ0FBakIsR0FBcUIsSUFBckM7QUFDQSxRQUFJbkIsVUFBVSxHQUFHLEtBQUsrRSxjQUFMLENBQW9CakQsS0FBcEIsRUFBMkJYLENBQTNCLEVBQThCVyxLQUFLLENBQUNYLENBQUQsQ0FBbkMsQ0FBakI7QUFDQWQsSUFBQUEsZUFBZSxDQUFDQyxTQUFELEVBQVlGLFNBQVosRUFBdUJKLFVBQXZCLENBQWY7QUFDSDs7QUFDRCxTQUFPTSxTQUFQO0FBQ0gsQ0F0QkQ7O0FBd0JBcUQsS0FBSyxDQUFDb0MscUJBQU4sR0FBOEIsVUFBVWpFLEtBQVYsRUFBaUI7QUFDM0MsTUFBSWtFLElBQUksR0FBR2xFLEtBQUssQ0FBQ2xDLFdBQU4sQ0FBa0JYLElBQWxCLElBQTBCVSxpQkFBaUIsQ0FBQ21DLEtBQUssQ0FBQ2xDLFdBQVAsQ0FBdEQ7O0FBQ0EsTUFBSWtDLEtBQUssQ0FBQ1osTUFBTixLQUFpQixDQUFyQixFQUF3QjtBQUNwQixXQUFPLFNBQVM4RSxJQUFoQjtBQUNIOztBQUVELE1BQUlKLFFBQVEsR0FBRy9HLFdBQVcsR0FBSSxFQUFFLEtBQUtrRSxlQUFyQztBQUNBLE1BQUk4QyxXQUFXLEdBQUcsSUFBSS9GLFdBQUosQ0FBZ0I4RixRQUFoQixFQUEwQixTQUFTSSxJQUFULEdBQWdCLEdBQWhCLEdBQXNCbEUsS0FBSyxDQUFDWixNQUE1QixHQUFxQyxHQUEvRCxDQUFsQjtBQUNBLE1BQUlaLFNBQVMsR0FBRyxDQUFDdUYsV0FBRCxDQUFoQixDQVIyQyxDQVUzQzs7QUFDQS9ELEVBQUFBLEtBQUssQ0FBQzRCLEtBQU4sR0FBYztBQUNWVCxJQUFBQSxTQUFTLEVBQUUsRUFERDtBQUNVO0FBQ3BCNkMsSUFBQUEsTUFBTSxFQUFFeEYsU0FGRSxDQUVVOztBQUZWLEdBQWQ7QUFJQSxPQUFLaUMsZ0JBQUwsQ0FBc0I5QixJQUF0QixDQUEyQnFCLEtBQTNCOztBQUVBLE9BQUssSUFBSVgsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR1csS0FBSyxDQUFDWixNQUExQixFQUFrQyxFQUFFQyxDQUFwQyxFQUF1QztBQUNuQyxRQUFJVyxLQUFLLENBQUNYLENBQUQsQ0FBTCxLQUFhLENBQWpCLEVBQW9CO0FBQ2hCLFVBQUlmLFNBQVMsR0FBR3dGLFFBQVEsR0FBRyxHQUFYLEdBQWlCekUsQ0FBakIsR0FBcUIsSUFBckM7QUFDQWQsTUFBQUEsZUFBZSxDQUFDQyxTQUFELEVBQVlGLFNBQVosRUFBdUIwQixLQUFLLENBQUNYLENBQUQsQ0FBNUIsQ0FBZjtBQUNIO0FBQ0o7O0FBQ0QsU0FBT2IsU0FBUDtBQUNILENBeEJEOztBQTBCQXFELEtBQUssQ0FBQ29CLGNBQU4sR0FBdUIsVUFBVXZELEdBQVYsRUFBZVQsR0FBZixFQUFvQmUsS0FBcEIsRUFBMkI7QUFDOUMsTUFBSSxPQUFPQSxLQUFQLEtBQWlCLFFBQWpCLElBQTZCQSxLQUFqQyxFQUF3QztBQUNwQyxRQUFJNEIsS0FBSyxHQUFHNUIsS0FBSyxDQUFDNEIsS0FBbEI7O0FBQ0EsUUFBSUEsS0FBSixFQUFXO0FBQ1A7QUFDQSxVQUFJVCxTQUFTLEdBQUdTLEtBQUssQ0FBQ1QsU0FBdEI7O0FBQ0EsVUFBSSxDQUFDQSxTQUFMLEVBQWdCO0FBQ1o7QUFDQUEsUUFBQUEsU0FBUyxHQUFHUyxLQUFLLENBQUNULFNBQU4sR0FBa0IsTUFBTyxFQUFFLEtBQUtILGdCQUE1QztBQUNBLGFBQUtELGVBQUwsQ0FBcUJwQyxJQUFyQixDQUEwQndDLFNBQTFCLEVBSFksQ0FJWjs7QUFDQSxZQUFJZ0QsSUFBSSxHQUFHdkMsS0FBSyxDQUFDb0MsTUFBTixDQUFhaEgscUJBQWIsQ0FBWDtBQUNBNEUsUUFBQUEsS0FBSyxDQUFDb0MsTUFBTixDQUFhaEgscUJBQWIsSUFBc0NxQixnQkFBZ0IsQ0FBQzhDLFNBQVMsR0FBRyxHQUFiLEVBQWtCZ0QsSUFBbEIsQ0FBdEQsQ0FOWSxDQU9aO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFDRCxhQUFPaEQsU0FBUDtBQUNILEtBakJELE1Ba0JLLElBQUlpRCxXQUFXLENBQUNDLE1BQVosQ0FBbUJyRSxLQUFuQixDQUFKLEVBQStCO0FBQ2hDLGFBQU8sS0FBS2lFLHFCQUFMLENBQTJCakUsS0FBM0IsQ0FBUDtBQUNILEtBRkksTUFHQSxJQUFJdkIsS0FBSyxDQUFDQyxPQUFOLENBQWNzQixLQUFkLENBQUosRUFBMEI7QUFDM0IsYUFBTyxLQUFLNkQsZ0JBQUwsQ0FBc0I3RCxLQUF0QixDQUFQO0FBQ0gsS0FGSSxNQUdBO0FBQ0QsYUFBTyxLQUFLc0UsY0FBTCxDQUFvQnRFLEtBQXBCLENBQVA7QUFDSDtBQUNKLEdBN0JELE1BOEJLLElBQUksT0FBT0EsS0FBUCxLQUFpQixVQUFyQixFQUFpQztBQUNsQyxXQUFPLEtBQUtrQixhQUFMLENBQW1CbEIsS0FBbkIsQ0FBUDtBQUNILEdBRkksTUFHQSxJQUFJLE9BQU9BLEtBQVAsS0FBaUIsUUFBckIsRUFBK0I7QUFDaEMsV0FBT3JELFdBQVcsQ0FBQ3FELEtBQUQsQ0FBbEI7QUFDSCxHQUZJLE1BR0E7QUFDRCxRQUFJZixHQUFHLEtBQUssV0FBUixJQUF3QlMsR0FBRyxZQUFZM0QsUUFBM0MsRUFBc0Q7QUFDbERpRSxNQUFBQSxLQUFLLElBQUk3RCxjQUFUO0FBQ0g7O0FBQ0QsV0FBTzZELEtBQVA7QUFDSDtBQUNKLENBM0NEOztBQTZDQTZCLEtBQUssQ0FBQytCLFVBQU4sR0FBbUIsVUFBVXBGLFNBQVYsRUFBcUJrQixHQUFyQixFQUEwQlQsR0FBMUIsRUFBK0JlLEtBQS9CLEVBQXNDO0FBQ3JELE1BQUkxQixTQUFTLEdBQUd6QixTQUFTLEdBQUcwQyxlQUFlLENBQUNOLEdBQUQsQ0FBM0IsR0FBbUMsR0FBbkQ7QUFDQSxNQUFJZixVQUFVLEdBQUcsS0FBSytFLGNBQUwsQ0FBb0J2RCxHQUFwQixFQUF5QlQsR0FBekIsRUFBOEJlLEtBQTlCLENBQWpCO0FBQ0F6QixFQUFBQSxlQUFlLENBQUNDLFNBQUQsRUFBWUYsU0FBWixFQUF1QkosVUFBdkIsQ0FBZjtBQUNILENBSkQsRUFNQTs7O0FBQ0EyRCxLQUFLLENBQUNULGVBQU4sR0FBd0IsVUFBVTVDLFNBQVYsRUFBcUJrQixHQUFyQixFQUEwQjtBQUM5QyxNQUFJMEQsS0FBSyxHQUFHMUQsR0FBRyxDQUFDNUIsV0FBaEI7O0FBQ0EsTUFBSW1DLEVBQUUsQ0FBQ3NFLEtBQUgsQ0FBU0MsVUFBVCxDQUFvQnBCLEtBQXBCLENBQUosRUFBZ0M7QUFDNUIsU0FBS0QsZ0JBQUwsQ0FBc0IzRSxTQUF0QixFQUFpQ2tCLEdBQWpDLEVBQXNDMEQsS0FBdEM7QUFDSCxHQUZELE1BR0s7QUFDRDtBQUNBLFNBQUssSUFBSW5FLEdBQVQsSUFBZ0JTLEdBQWhCLEVBQXFCO0FBQ2pCLFVBQUksQ0FBQ0EsR0FBRyxDQUFDK0UsY0FBSixDQUFtQnhGLEdBQW5CLENBQUQsSUFDQ0EsR0FBRyxDQUFDeUYsVUFBSixDQUFlLENBQWYsTUFBc0IsRUFBdEIsSUFBNEJ6RixHQUFHLENBQUN5RixVQUFKLENBQWUsQ0FBZixNQUFzQixFQUFsRCxJQUEwRDtBQUMxRHpGLE1BQUFBLEdBQUcsS0FBSyxVQUZiLEVBR0U7QUFDRTtBQUNIOztBQUNELFVBQUllLEtBQUssR0FBR04sR0FBRyxDQUFDVCxHQUFELENBQWY7O0FBQ0EsVUFBSSxPQUFPZSxLQUFQLEtBQWlCLFFBQWpCLElBQTZCQSxLQUE3QixJQUFzQ0EsS0FBSyxLQUFLTixHQUFHLENBQUNrQyxLQUF4RCxFQUErRDtBQUMzRDtBQUNIOztBQUNELFdBQUtnQyxVQUFMLENBQWdCcEYsU0FBaEIsRUFBMkJrQixHQUEzQixFQUFnQ1QsR0FBaEMsRUFBcUNlLEtBQXJDO0FBQ0g7QUFDSjtBQUNKLENBckJEOztBQXVCQTZCLEtBQUssQ0FBQ3lDLGNBQU4sR0FBdUIsVUFBVTVFLEdBQVYsRUFBZTtBQUNsQyxNQUFJQSxHQUFHLFlBQVlPLEVBQUUsQ0FBQ0MsU0FBdEIsRUFBaUM7QUFDN0IsV0FBTzVELE9BQU8sQ0FBQ3FJLG1CQUFSLENBQTRCakYsR0FBNUIsQ0FBUDtBQUNIOztBQUNELE1BQUlBLEdBQUcsWUFBWU8sRUFBRSxDQUFDMkUsS0FBdEIsRUFBNkI7QUFDekI7QUFDQSxXQUFPLEtBQUtyQyxTQUFMLENBQWU3QyxHQUFmLENBQVA7QUFDSDs7QUFDRCxNQUFJQSxHQUFHLENBQUNtRixTQUFKLEdBQWdCNUksU0FBcEIsRUFBK0I7QUFDM0I7QUFDQSxXQUFPLElBQVA7QUFDSDs7QUFFRCxNQUFJNkksVUFBSjtBQUNBLE1BQUlDLElBQUksR0FBR3JGLEdBQUcsQ0FBQzVCLFdBQWY7O0FBQ0EsTUFBSW1DLEVBQUUsQ0FBQ3NFLEtBQUgsQ0FBU0MsVUFBVCxDQUFvQk8sSUFBcEIsQ0FBSixFQUErQjtBQUMzQixRQUFJLEtBQUt2RSxNQUFULEVBQWlCO0FBQ2IsVUFBSSxLQUFLQSxNQUFMLFlBQXVCUCxFQUFFLENBQUMrRSxTQUE5QixFQUF5QztBQUNyQyxZQUFJdEYsR0FBRyxZQUFZTyxFQUFFLENBQUNnRixTQUFsQixJQUErQnZGLEdBQUcsWUFBWU8sRUFBRSxDQUFDK0UsU0FBckQsRUFBZ0U7QUFDNUQsaUJBQU8sS0FBS3pDLFNBQUwsQ0FBZTdDLEdBQWYsQ0FBUDtBQUNIO0FBQ0osT0FKRCxNQUtLLElBQUksS0FBS2MsTUFBTCxZQUF1QlAsRUFBRSxDQUFDZ0YsU0FBOUIsRUFBeUM7QUFDMUMsWUFBSXZGLEdBQUcsWUFBWU8sRUFBRSxDQUFDZ0YsU0FBdEIsRUFBaUM7QUFDN0IsY0FBSSxDQUFDdkYsR0FBRyxDQUFDd0YsU0FBSixDQUFjLEtBQUsxRSxNQUFuQixDQUFMLEVBQWlDO0FBQzdCO0FBQ0EsbUJBQU8sS0FBSytCLFNBQUwsQ0FBZTdDLEdBQWYsQ0FBUDtBQUNIO0FBQ0osU0FMRCxNQU1LLElBQUlBLEdBQUcsWUFBWU8sRUFBRSxDQUFDK0UsU0FBdEIsRUFBaUM7QUFDbEMsY0FBSSxDQUFDdEYsR0FBRyxDQUFDeUYsSUFBSixDQUFTRCxTQUFULENBQW1CLEtBQUsxRSxNQUF4QixDQUFMLEVBQXNDO0FBQ2xDO0FBQ0EsbUJBQU8sS0FBSytCLFNBQUwsQ0FBZTdDLEdBQWYsQ0FBUDtBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUNEb0YsSUFBQUEsVUFBVSxHQUFHLElBQUk5RyxXQUFKLENBQWdCbkIsU0FBaEIsRUFBMkIsU0FBUyxLQUFLcUUsYUFBTCxDQUFtQjZELElBQW5CLEVBQXlCLElBQXpCLENBQVQsR0FBMEMsSUFBckUsQ0FBYjtBQUNILEdBdkJELE1Bd0JLLElBQUlBLElBQUksS0FBSzNFLE1BQWIsRUFBcUI7QUFDdEIwRSxJQUFBQSxVQUFVLEdBQUcsSUFBSTlHLFdBQUosQ0FBZ0JuQixTQUFoQixFQUEyQixJQUEzQixDQUFiO0FBQ0gsR0FGSSxNQUdBLElBQUksQ0FBQ2tJLElBQUwsRUFBVztBQUNaRCxJQUFBQSxVQUFVLEdBQUcsSUFBSTlHLFdBQUosQ0FBZ0JuQixTQUFoQixFQUEyQixxQkFBM0IsQ0FBYjtBQUNILEdBRkksTUFHQTtBQUNEO0FBQ0EsV0FBTyxLQUFLMEYsU0FBTCxDQUFlN0MsR0FBZixDQUFQO0FBQ0g7O0FBRUQsTUFBSWxCLFNBQVMsR0FBRyxDQUFDc0csVUFBRCxDQUFoQixDQWxEa0MsQ0FvRGxDOztBQUNBekksRUFBQUEsRUFBRSxDQUFDMkQsS0FBSCxDQUFTTixHQUFULEVBQWMsT0FBZCxFQUF1QjtBQUNuQnlCLElBQUFBLFNBQVMsRUFBRSxFQURRO0FBQ0M7QUFDcEI2QyxJQUFBQSxNQUFNLEVBQUV4RixTQUZXLENBRUM7QUFDcEI7QUFDQTs7QUFKbUIsR0FBdkIsRUFLRyxJQUxIO0FBTUEsT0FBS2lDLGdCQUFMLENBQXNCOUIsSUFBdEIsQ0FBMkJlLEdBQTNCO0FBRUEsT0FBSzBCLGVBQUwsQ0FBcUI1QyxTQUFyQixFQUFnQ2tCLEdBQWhDO0FBQ0EsU0FBTyxDQUFDLGNBQUQsRUFDS2xCLFNBREwsRUFFQyxnQkFGRCxDQUFQO0FBR0gsQ0FqRUQ7O0FBb0VBLFNBQVM0RyxPQUFULENBQWtCRCxJQUFsQixFQUF3QjtBQUNwQixNQUFJRSxJQUFJLEdBQUlGLElBQUksWUFBWWxGLEVBQUUsQ0FBQ2dGLFNBQXBCLElBQWtDRSxJQUE3QztBQUNBLE1BQUlHLE1BQU0sR0FBRyxJQUFJL0UsTUFBSixDQUFXNEUsSUFBWCxFQUFpQkUsSUFBakIsQ0FBYjtBQUNBLFNBQU9DLE1BQU0sQ0FBQzdELE1BQWQ7QUFDSDs7QUFFRDhELE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQUNiSixFQUFBQSxPQUFPLEVBQUVBLE9BREk7QUFFYnRGLEVBQUFBLGVBQWUsRUFBRUE7QUFGSixDQUFqQjs7QUFLQSxJQUFJMkYsT0FBSixFQUFhO0FBQ1R4RixFQUFBQSxFQUFFLENBQUN5RixLQUFILENBQVNDLGFBQVQsR0FBeUJKLE1BQU0sQ0FBQ0MsT0FBaEM7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gU29tZSBoZWxwZXIgbWV0aG9kcyBmb3IgY29tcGlsZSBpbnN0YW50aWF0aW9uIGNvZGVcblxudmFyIENDT2JqZWN0ID0gcmVxdWlyZSgnLi9DQ09iamVjdCcpO1xudmFyIERlc3Ryb3llZCA9IENDT2JqZWN0LkZsYWdzLkRlc3Ryb3llZDtcbnZhciBQZXJzaXN0ZW50TWFzayA9IENDT2JqZWN0LkZsYWdzLlBlcnNpc3RlbnRNYXNrO1xudmFyIEF0dHIgPSByZXF1aXJlKCcuL2F0dHJpYnV0ZScpO1xudmFyIGpzID0gcmVxdWlyZSgnLi9qcycpO1xudmFyIENDQ2xhc3MgPSByZXF1aXJlKCcuL0NDQ2xhc3MnKTtcbnZhciBDb21waWxlciA9IHJlcXVpcmUoJy4vY29tcGlsZXInKTtcblxudmFyIERFRkFVTFQgPSBBdHRyLkRFTElNRVRFUiArICdkZWZhdWx0JztcbnZhciBJREVOVElGSUVSX1JFID0gQ0NDbGFzcy5JREVOVElGSUVSX1JFO1xudmFyIGVzY2FwZUZvckpTID0gQ0NDbGFzcy5lc2NhcGVGb3JKUztcblxuY29uc3QgVkFSID0gJ3ZhciAnO1xuY29uc3QgTE9DQUxfT0JKID0gJ28nO1xuY29uc3QgTE9DQUxfVEVNUF9PQkogPSAndCc7XG5jb25zdCBMT0NBTF9BUlJBWSA9ICdhJztcbmNvbnN0IExJTkVfSU5ERVhfT0ZfTkVXX09CSiA9IDA7XG5cbmNvbnN0IERFRkFVTFRfTU9EVUxFX0NBQ0hFID0ge1xuICAgICdjYy5Ob2RlJzogJ2NjLk5vZGUnLFxuICAgICdjYy5TcHJpdGUnOiAnY2MuU3ByaXRlJyxcbiAgICAnY2MuTGFiZWwnOiAnY2MuTGFiZWwnLFxuICAgICdjYy5CdXR0b24nOiAnY2MuQnV0dG9uJyxcbiAgICAnY2MuV2lkZ2V0JzogJ2NjLldpZGdldCcsXG4gICAgJ2NjLkFuaW1hdGlvbic6ICdjYy5BbmltYXRpb24nLFxuICAgICdjYy5DbGlja0V2ZW50JzogZmFsc2UsXG4gICAgJ2NjLlByZWZhYkluZm8nOiBmYWxzZVxufTtcblxudHJ5IHtcbiAgICAvLyBjb21wYXRpYmxlIGZvciBJRVxuICAgICFGbG9hdDMyQXJyYXkubmFtZSAmJiAoRmxvYXQzMkFycmF5Lm5hbWUgPSAnRmxvYXQzMkFycmF5Jyk7XG4gICAgIUZsb2F0NjRBcnJheS5uYW1lICYmIChGbG9hdDY0QXJyYXkubmFtZSA9ICdGbG9hdDY0QXJyYXknKTtcblxuICAgICFJbnQ4QXJyYXkubmFtZSAmJiAoSW50OEFycmF5Lm5hbWUgPSAnSW50OEFycmF5Jyk7XG4gICAgIUludDE2QXJyYXkubmFtZSAmJiAoSW50MTZBcnJheS5uYW1lID0gJ0ludDE2QXJyYXknKTtcbiAgICAhSW50MzJBcnJheS5uYW1lICYmIChJbnQzMkFycmF5Lm5hbWUgPSAnSW50MzJBcnJheScpO1xuXG4gICAgIVVpbnQ4QXJyYXkubmFtZSAmJiAoVWludDhBcnJheS5uYW1lID0gJ1VpbnQ4QXJyYXknKTtcbiAgICAhVWludDE2QXJyYXkubmFtZSAmJiAoVWludDE2QXJyYXkubmFtZSA9ICdVaW50MTZBcnJheScpO1xuICAgICFVaW50MzJBcnJheS5uYW1lICYmIChVaW50MzJBcnJheS5uYW1lID0gJ1VpbnQzMkFycmF5Jyk7XG5cbiAgICAhVWludDhDbGFtcGVkQXJyYXkubmFtZSAmJiAoVWludDhDbGFtcGVkQXJyYXkubmFtZSA9ICdVaW50OENsYW1wZWRBcnJheScpO1xufVxuY2F0Y2ggKGUpIHt9XG5cbi8vIGNvbXBhdGlibGUgZm9yIGlPUyA5XG5mdW5jdGlvbiBnZXRUeXBlZEFycmF5TmFtZSAoY29uc3RydWN0b3IpIHtcbiAgICBpZiAoY29uc3RydWN0b3IgPT09IEZsb2F0MzJBcnJheSkgeyByZXR1cm4gJ0Zsb2F0MzJBcnJheSc7IH1cbiAgICBlbHNlIGlmIChjb25zdHJ1Y3RvciA9PT0gRmxvYXQ2NEFycmF5KSB7IHJldHVybiAnRmxvYXQ2NEFycmF5JzsgfVxuXG4gICAgZWxzZSBpZiAoY29uc3RydWN0b3IgPT09IEludDhBcnJheSkgeyByZXR1cm4gJ0ludDhBcnJheSc7IH1cbiAgICBlbHNlIGlmIChjb25zdHJ1Y3RvciA9PT0gSW50MTZBcnJheSkgeyByZXR1cm4gJ0ludDE2QXJyYXknOyB9XG4gICAgZWxzZSBpZiAoY29uc3RydWN0b3IgPT09IEludDMyQXJyYXkpIHsgcmV0dXJuICdJbnQzMkFycmF5JzsgfVxuXG4gICAgZWxzZSBpZiAoY29uc3RydWN0b3IgPT09IFVpbnQ4QXJyYXkpIHsgcmV0dXJuICdVaW50OEFycmF5JzsgfVxuICAgIGVsc2UgaWYgKGNvbnN0cnVjdG9yID09PSBVaW50MTZBcnJheSkgeyByZXR1cm4gJ1VpbnQxNkFycmF5JzsgfVxuICAgIGVsc2UgaWYgKGNvbnN0cnVjdG9yID09PSBVaW50MzJBcnJheSkgeyByZXR1cm4gJ1VpbnQzMkFycmF5JzsgfVxuXG4gICAgZWxzZSBpZiAoY29uc3RydWN0b3IgPT09IFVpbnQ4Q2xhbXBlZEFycmF5KSB7IHJldHVybiAnVWludDhDbGFtcGVkQXJyYXknOyB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBUeXBlZEFycmF5IHRvIGluc3RhbnRpYXRlOiAke2NvbnN0cnVjdG9yfWApO1xuICAgIH1cbn1cblxuLy8gSEVMUEVSIENMQVNTRVNcblxuLy8gKCdmb28nLCAnYmFyJylcbi8vIC0+ICd2YXIgZm9vID0gYmFyOydcbmZ1bmN0aW9uIERlY2xhcmF0aW9uICh2YXJOYW1lLCBleHByZXNzaW9uKSB7XG4gICAgdGhpcy52YXJOYW1lID0gdmFyTmFtZTtcbiAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xufVxuRGVjbGFyYXRpb24ucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBWQVIgKyB0aGlzLnZhck5hbWUgKyAnPScgKyB0aGlzLmV4cHJlc3Npb24gKyAnOyc7XG59O1xuXG4vLyAoJ2EgPScsICd2YXIgYiA9IHgnKVxuLy8gLT4gJ3ZhciBiID0gYSA9IHgnO1xuLy8gKCdhID0nLCAneCcpXG4vLyAtPiAnYSA9IHgnO1xuZnVuY3Rpb24gbWVyZ2VEZWNsYXJhdGlvbiAoc3RhdGVtZW50LCBleHByZXNzaW9uKSB7XG4gICAgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBEZWNsYXJhdGlvbikge1xuICAgICAgICByZXR1cm4gbmV3IERlY2xhcmF0aW9uKGV4cHJlc3Npb24udmFyTmFtZSwgc3RhdGVtZW50ICsgZXhwcmVzc2lvbi5leHByZXNzaW9uKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBzdGF0ZW1lbnQgKyBleHByZXNzaW9uO1xuICAgIH1cbn1cblxuLy8gKCdhJywgWyd2YXIgYiA9IHgnLCAnYi5mb28gPSBiYXInXSlcbi8vIC0+ICd2YXIgYiA9IGEgPSB4Oydcbi8vIC0+ICdiLmZvbyA9IGJhcjsnXG4vLyAoJ2EnLCAndmFyIGIgPSB4Jylcbi8vIC0+ICd2YXIgYiA9IGEgPSB4Oydcbi8vICgnYScsICd4Jylcbi8vIC0+ICdhID0geDsnXG5mdW5jdGlvbiB3cml0ZUFzc2lnbm1lbnQgKGNvZGVBcnJheSwgc3RhdGVtZW50LCBleHByZXNzaW9uKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZXhwcmVzc2lvbikpIHtcbiAgICAgICAgZXhwcmVzc2lvblswXSA9IG1lcmdlRGVjbGFyYXRpb24oc3RhdGVtZW50LCBleHByZXNzaW9uWzBdKTtcbiAgICAgICAgY29kZUFycmF5LnB1c2goZXhwcmVzc2lvbik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb2RlQXJyYXkucHVzaChtZXJnZURlY2xhcmF0aW9uKHN0YXRlbWVudCwgZXhwcmVzc2lvbikgKyAnOycpO1xuICAgIH1cbn1cblxuLy8gKCdmb28nLCAnYmFyJylcbi8vIC0+ICd0YXJnZXRFeHByZXNzaW9uLmZvbyA9IGJhcidcbi8vICgnZm9vMScsICdiYXIxJylcbi8vICgnZm9vMicsICdiYXIyJylcbi8vIC0+ICd0ID0gdGFyZ2V0RXhwcmVzc2lvbjsnXG4vLyAtPiAndC5mb28xID0gYmFyMTsnXG4vLyAtPiAndC5mb28yID0gYmFyMjsnXG5mdW5jdGlvbiBBc3NpZ25tZW50cyAodGFyZ2V0RXhwcmVzc2lvbikge1xuICAgIHRoaXMuX2V4cHMgPSBbXTtcbiAgICB0aGlzLl90YXJnZXRFeHAgPSB0YXJnZXRFeHByZXNzaW9uO1xufVxuQXNzaWdubWVudHMucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uIChrZXksIGV4cHJlc3Npb24pIHtcbiAgICB0aGlzLl9leHBzLnB1c2goW2tleSwgZXhwcmVzc2lvbl0pO1xufTtcbkFzc2lnbm1lbnRzLnByb3RvdHlwZS53cml0ZUNvZGUgPSBmdW5jdGlvbiAoY29kZUFycmF5KSB7XG4gICAgdmFyIHRhcmdldFZhcjtcbiAgICBpZiAodGhpcy5fZXhwcy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGNvZGVBcnJheS5wdXNoKExPQ0FMX1RFTVBfT0JKICsgJz0nICsgdGhpcy5fdGFyZ2V0RXhwICsgJzsnKTtcbiAgICAgICAgdGFyZ2V0VmFyID0gTE9DQUxfVEVNUF9PQko7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMuX2V4cHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHRhcmdldFZhciA9IHRoaXMuX3RhcmdldEV4cDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9leHBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwYWlyID0gdGhpcy5fZXhwc1tpXTtcbiAgICAgICAgd3JpdGVBc3NpZ25tZW50KGNvZGVBcnJheSwgdGFyZ2V0VmFyICsgZ2V0UHJvcEFjY2Vzc29yKHBhaXJbMF0pICsgJz0nLCBwYWlyWzFdKTtcbiAgICB9XG59O1xuXG5Bc3NpZ25tZW50cy5wb29sID0gbmV3IGpzLlBvb2woZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouX2V4cHMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLl90YXJnZXRFeHAgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEpO1xuQXNzaWdubWVudHMucG9vbC5nZXQgPSBmdW5jdGlvbiAodGFyZ2V0RXhwcmVzc2lvbikge1xuICAgIHZhciBjYWNoZSA9IHRoaXMuX2dldCgpIHx8IG5ldyBBc3NpZ25tZW50cygpO1xuICAgIGNhY2hlLl90YXJnZXRFeHAgPSB0YXJnZXRFeHByZXNzaW9uO1xuICAgIHJldHVybiBjYWNoZTtcbn07XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcblxuZnVuY3Rpb24gZXF1YWxzVG9EZWZhdWx0IChkZWYsIHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiBkZWYgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRlZiA9IGRlZigpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGRlZiA9PT0gdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChkZWYgJiYgdmFsdWUgJiZcbiAgICAgICAgdHlwZW9mIGRlZiA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuICAgICAgICBkZWYuY29uc3RydWN0b3IgPT09IHZhbHVlLmNvbnN0cnVjdG9yKVxuICAgIHtcbiAgICAgICAgaWYgKGRlZiBpbnN0YW5jZW9mIGNjLlZhbHVlVHlwZSkge1xuICAgICAgICAgICAgaWYgKGRlZi5lcXVhbHModmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShkZWYpKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVmLmxlbmd0aCA9PT0gMCAmJiB2YWx1ZS5sZW5ndGggPT09IDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGVmLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBqcy5pc0VtcHR5T2JqZWN0KGRlZikgJiYganMuaXNFbXB0eU9iamVjdCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBnZXRQcm9wQWNjZXNzb3IgKGtleSkge1xuICAgIHJldHVybiBJREVOVElGSUVSX1JFLnRlc3Qoa2V5KSA/ICgnLicgKyBrZXkpIDogKCdbJyArIGVzY2FwZUZvckpTKGtleSkgKyAnXScpO1xufVxuXG4vL1xuXG4vKlxuICogVmFyaWFibGVzOlxuICoge09iamVjdFtdfSBPIC0gb2JqcyBsaXN0XG4gKiB7RnVuY3Rpb25bXX0gRiAtIGNvbnN0cnVjdG9yIGxpc3RcbiAqIHtOb2RlfSBbUl0gLSBzcGVjaWZ5IGFuIGluc3RhbnRpYXRlZCBwcmVmYWJSb290IHRoYXQgYWxsIHJlZmVyZW5jZXMgdG8gcHJlZmFiUm9vdCBpbiBwcmVmYWIgd2lsbCByZWRpcmVjdCB0b1xuICoge09iamVjdH0gbyAtIGN1cnJlbnQgY3JlYXRpbmcgb2JqZWN0XG4gKi9cblxuLypcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogLSB0aGUgb2JqZWN0IHRvIHBhcnNlXG4gKiBAcGFyYW0ge05vZGV9IFtwYXJlbnRdXG4gKi9cbmZ1bmN0aW9uIFBhcnNlciAob2JqLCBwYXJlbnQpIHtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcblxuICAgIHRoaXMub2Jqc1RvQ2xlYXJfaU4kdCA9IFtdOyAgIC8vIHVzZWQgdG8gcmVzZXQgX2lOJHQgdmFyaWFibGVcbiAgICB0aGlzLmNvZGVBcnJheSA9IFtdO1xuXG4gICAgLy8gZGF0YXMgZm9yIGdlbmVyYXRlZCBjb2RlXG4gICAgdGhpcy5vYmpzID0gW107XG4gICAgdGhpcy5mdW5jcyA9IFtdO1xuXG4gICAgdGhpcy5mdW5jTW9kdWxlQ2FjaGUgPSBqcy5jcmVhdGVNYXAoKTtcbiAgICBqcy5taXhpbih0aGlzLmZ1bmNNb2R1bGVDYWNoZSwgREVGQVVMVF9NT0RVTEVfQ0FDSEUpO1xuXG4gICAgLy8ge1N0cmluZ1tdfSAtIHZhcmlhYmxlIG5hbWVzIGZvciBjaXJjdWxhciByZWZlcmVuY2VzLFxuICAgIC8vICAgICAgICAgICAgICBub3QgcmVhbGx5IGdsb2JhbCwganVzdCBsb2NhbCB2YXJpYWJsZXMgc2hhcmVkIGJldHdlZW4gc3ViIGZ1bmN0aW9uc1xuICAgIHRoaXMuZ2xvYmFsVmFyaWFibGVzID0gW107XG4gICAgLy8gaW5jcmVtZW50YWwgaWQgZm9yIG5ldyBnbG9iYWwgdmFyaWFibGVzXG4gICAgdGhpcy5nbG9iYWxWYXJpYWJsZUlkID0gMDtcbiAgICAvLyBpbmNyZW1lbnRhbCBpZCBmb3IgbmV3IGxvY2FsIHZhcmlhYmxlc1xuICAgIHRoaXMubG9jYWxWYXJpYWJsZUlkID0gMDtcblxuICAgIC8vIGdlbmVyYXRlIGNvZGVBcnJheVxuICAgIC8vaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgIC8vICAgIHRoaXMuY29kZUFycmF5LnB1c2godGhpcy5pbnN0YW50aWF0ZUFycmF5KG9iaikpO1xuICAgIC8vfVxuICAgIC8vZWxzZSB7XG4gICAgICAgIHRoaXMuY29kZUFycmF5LnB1c2goVkFSICsgTE9DQUxfT0JKICsgJywnICsgTE9DQUxfVEVNUF9PQkogKyAnOycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAnaWYoUil7JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTE9DQUxfT0JKICsgJz1SOycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAnfWVsc2V7JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTE9DQUxfT0JKICsgJz1SPW5ldyAnICsgdGhpcy5nZXRGdW5jTW9kdWxlKG9iai5jb25zdHJ1Y3RvciwgdHJ1ZSkgKyAnKCk7JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICd9Jyk7XG4gICAgICAgIGpzLnZhbHVlKG9iaiwgJ19pTiR0JywgeyBnbG9iYWxWYXI6ICdSJyB9LCB0cnVlKTtcbiAgICAgICAgdGhpcy5vYmpzVG9DbGVhcl9pTiR0LnB1c2gob2JqKTtcbiAgICAgICAgdGhpcy5lbnVtZXJhdGVPYmplY3QodGhpcy5jb2RlQXJyYXksIG9iaik7XG4gICAgLy99XG5cbiAgICAvLyBnZW5lcmF0ZSBjb2RlXG4gICAgdmFyIGdsb2JhbFZhcmlhYmxlc0RlY2xhcmF0aW9uO1xuICAgIGlmICh0aGlzLmdsb2JhbFZhcmlhYmxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGdsb2JhbFZhcmlhYmxlc0RlY2xhcmF0aW9uID0gVkFSICsgdGhpcy5nbG9iYWxWYXJpYWJsZXMuam9pbignLCcpICsgJzsnO1xuICAgIH1cbiAgICB2YXIgY29kZSA9IENvbXBpbGVyLmZsYXR0ZW5Db2RlQXJyYXkoWydyZXR1cm4gKGZ1bmN0aW9uKFIpeycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxWYXJpYWJsZXNEZWNsYXJhdGlvbiB8fCBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29kZUFycmF5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3JldHVybiBvOycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnfSknXSk7XG5cbiAgICAvLyBnZW5lcmF0ZSBtZXRob2QgYW5kIGJpbmQgd2l0aCBvYmpzXG4gICAgdGhpcy5yZXN1bHQgPSBGdW5jdGlvbignTycsICdGJywgY29kZSkodGhpcy5vYmpzLCB0aGlzLmZ1bmNzKTtcblxuICAgIC8vIGlmIChDQ19URVNUICYmICFpc1BoYW50b21KUykge1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhjb2RlKTtcbiAgICAvLyB9XG5cbiAgICAvLyBjbGVhbnVwXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMub2Jqc1RvQ2xlYXJfaU4kdC5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICB0aGlzLm9ianNUb0NsZWFyX2lOJHRbaV0uX2lOJHQgPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLm9ianNUb0NsZWFyX2lOJHQubGVuZ3RoID0gMDtcbn1cblxudmFyIHByb3RvID0gUGFyc2VyLnByb3RvdHlwZTtcblxucHJvdG8uZ2V0RnVuY01vZHVsZSA9IGZ1bmN0aW9uIChmdW5jLCB1c2VkSW5OZXcpIHtcbiAgICB2YXIgY2xzTmFtZSA9IGpzLmdldENsYXNzTmFtZShmdW5jKTtcbiAgICBpZiAoY2xzTmFtZSkge1xuICAgICAgICB2YXIgY2FjaGUgPSB0aGlzLmZ1bmNNb2R1bGVDYWNoZVtjbHNOYW1lXTtcbiAgICAgICAgaWYgKGNhY2hlKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FjaGU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY2FjaGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdmFyIGNsc05hbWVJc01vZHVsZSA9IGNsc05hbWUuaW5kZXhPZignLicpICE9PSAtMTtcbiAgICAgICAgICAgIGlmIChjbHNOYW1lSXNNb2R1bGUpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAvLyBlbnN1cmUgaXMgbW9kdWxlXG4gICAgICAgICAgICAgICAgICAgIGNsc05hbWVJc01vZHVsZSA9IChmdW5jID09PSBGdW5jdGlvbigncmV0dXJuICcgKyBjbHNOYW1lKSgpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsc05hbWVJc01vZHVsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mdW5jTW9kdWxlQ2FjaGVbY2xzTmFtZV0gPSBjbHNOYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNsc05hbWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIGluZGV4ID0gdGhpcy5mdW5jcy5pbmRleE9mKGZ1bmMpO1xuICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgaW5kZXggPSB0aGlzLmZ1bmNzLmxlbmd0aDtcbiAgICAgICAgdGhpcy5mdW5jcy5wdXNoKGZ1bmMpO1xuICAgIH1cbiAgICB2YXIgcmVzID0gJ0ZbJyArIGluZGV4ICsgJ10nO1xuICAgIGlmICh1c2VkSW5OZXcpIHtcbiAgICAgICAgcmVzID0gJygnICsgcmVzICsgJyknO1xuICAgIH1cbiAgICB0aGlzLmZ1bmNNb2R1bGVDYWNoZVtjbHNOYW1lXSA9IHJlcztcbiAgICByZXR1cm4gcmVzO1xufTtcblxucHJvdG8uZ2V0T2JqUmVmID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciBpbmRleCA9IHRoaXMub2Jqcy5pbmRleE9mKG9iaik7XG4gICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICBpbmRleCA9IHRoaXMub2Jqcy5sZW5ndGg7XG4gICAgICAgIHRoaXMub2Jqcy5wdXNoKG9iaik7XG4gICAgfVxuICAgIHJldHVybiAnT1snICsgaW5kZXggKyAnXSc7XG59O1xuXG5wcm90by5zZXRWYWx1ZVR5cGUgPSBmdW5jdGlvbiAoY29kZUFycmF5LCBkZWZhdWx0VmFsdWUsIHNyY1ZhbHVlLCB0YXJnZXRFeHByZXNzaW9uKSB7XG4gICAgdmFyIGFzc2lnbm1lbnRzID0gQXNzaWdubWVudHMucG9vbC5nZXQodGFyZ2V0RXhwcmVzc2lvbik7XG4gICAgdmFyIGZhc3REZWZpbmVkUHJvcHMgPSBkZWZhdWx0VmFsdWUuY29uc3RydWN0b3IuX19wcm9wc19fO1xuICAgIGlmICghZmFzdERlZmluZWRQcm9wcykge1xuICAgICAgICBmYXN0RGVmaW5lZFByb3BzID0gT2JqZWN0LmtleXMoZGVmYXVsdFZhbHVlKTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmYXN0RGVmaW5lZFByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwcm9wTmFtZSA9IGZhc3REZWZpbmVkUHJvcHNbaV07XG4gICAgICAgIHZhciBwcm9wID0gc3JjVmFsdWVbcHJvcE5hbWVdO1xuICAgICAgICBpZiAoZGVmYXVsdFZhbHVlW3Byb3BOYW1lXSA9PT0gcHJvcCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGV4cHJlc3Npb24gPSB0aGlzLmVudW1lcmF0ZUZpZWxkKHNyY1ZhbHVlLCBwcm9wTmFtZSwgcHJvcCk7XG4gICAgICAgIGFzc2lnbm1lbnRzLmFwcGVuZChwcm9wTmFtZSwgZXhwcmVzc2lvbik7XG4gICAgfVxuICAgIGFzc2lnbm1lbnRzLndyaXRlQ29kZShjb2RlQXJyYXkpO1xuICAgIEFzc2lnbm1lbnRzLnBvb2wucHV0KGFzc2lnbm1lbnRzKTtcbn07XG5cbnByb3RvLmVudW1lcmF0ZUNDQ2xhc3MgPSBmdW5jdGlvbiAoY29kZUFycmF5LCBvYmosIGtsYXNzKSB7XG4gICAgdmFyIHByb3BzID0ga2xhc3MuX192YWx1ZXNfXztcbiAgICB2YXIgYXR0cnMgPSBBdHRyLmdldENsYXNzQXR0cnMoa2xhc3MpO1xuICAgIGZvciAodmFyIHAgPSAwOyBwIDwgcHJvcHMubGVuZ3RoOyBwKyspIHtcbiAgICAgICAgdmFyIGtleSA9IHByb3BzW3BdO1xuICAgICAgICB2YXIgdmFsID0gb2JqW2tleV07XG4gICAgICAgIHZhciBkZWZhdWx0VmFsdWUgPSBhdHRyc1trZXkgKyBERUZBVUxUXTtcbiAgICAgICAgaWYgKGVxdWFsc1RvRGVmYXVsdChkZWZhdWx0VmFsdWUsIHZhbCkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0JyAmJiB2YWwgaW5zdGFuY2VvZiBjYy5WYWx1ZVR5cGUpIHtcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZSA9IENDQ2xhc3MuZ2V0RGVmYXVsdChkZWZhdWx0VmFsdWUpO1xuICAgICAgICAgICAgaWYgKGRlZmF1bHRWYWx1ZSAmJiBkZWZhdWx0VmFsdWUuY29uc3RydWN0b3IgPT09IHZhbC5jb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgICAgIC8vIGZhc3QgY2FzZVxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXRFeHByZXNzaW9uID0gTE9DQUxfT0JKICsgZ2V0UHJvcEFjY2Vzc29yKGtleSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZVR5cGUoY29kZUFycmF5LCBkZWZhdWx0VmFsdWUsIHZhbCwgdGFyZ2V0RXhwcmVzc2lvbik7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRPYmpQcm9wKGNvZGVBcnJheSwgb2JqLCBrZXksIHZhbCk7XG4gICAgfVxufTtcblxucHJvdG8uaW5zdGFudGlhdGVBcnJheSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuICdbXSc7XG4gICAgfVxuXG4gICAgdmFyIGFycmF5VmFyID0gTE9DQUxfQVJSQVkgKyAoKyt0aGlzLmxvY2FsVmFyaWFibGVJZCk7XG4gICAgdmFyIGRlY2xhcmF0aW9uID0gbmV3IERlY2xhcmF0aW9uKGFycmF5VmFyLCAnbmV3IEFycmF5KCcgKyB2YWx1ZS5sZW5ndGggKyAnKScpO1xuICAgIHZhciBjb2RlQXJyYXkgPSBbZGVjbGFyYXRpb25dO1xuXG4gICAgLy8gYXNzaWduIGEgX2lOJHQgZmxhZyB0byBpbmRpY2F0ZSB0aGF0IHRoaXMgb2JqZWN0IGhhcyBiZWVuIHBhcnNlZC5cbiAgICBqcy52YWx1ZSh2YWx1ZSwgJ19pTiR0Jywge1xuICAgICAgICBnbG9iYWxWYXI6ICcnLCAgICAgIC8vIHRoZSBuYW1lIG9mIGRlY2xhcmVkIGdsb2JhbCB2YXJpYWJsZSB1c2VkIHRvIGFjY2VzcyB0aGlzIG9iamVjdFxuICAgICAgICBzb3VyY2U6IGNvZGVBcnJheSwgIC8vIHRoZSBzb3VyY2UgY29kZSBhcnJheSBmb3IgdGhpcyBvYmplY3RcbiAgICB9LCB0cnVlKTtcbiAgICB0aGlzLm9ianNUb0NsZWFyX2lOJHQucHVzaCh2YWx1ZSk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBzdGF0ZW1lbnQgPSBhcnJheVZhciArICdbJyArIGkgKyAnXT0nO1xuICAgICAgICB2YXIgZXhwcmVzc2lvbiA9IHRoaXMuZW51bWVyYXRlRmllbGQodmFsdWUsIGksIHZhbHVlW2ldKTtcbiAgICAgICAgd3JpdGVBc3NpZ25tZW50KGNvZGVBcnJheSwgc3RhdGVtZW50LCBleHByZXNzaW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvZGVBcnJheTtcbn07XG5cbnByb3RvLmluc3RhbnRpYXRlVHlwZWRBcnJheSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGxldCB0eXBlID0gdmFsdWUuY29uc3RydWN0b3IubmFtZSB8fCBnZXRUeXBlZEFycmF5TmFtZSh2YWx1ZS5jb25zdHJ1Y3Rvcik7XG4gICAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gJ25ldyAnICsgdHlwZTtcbiAgICB9XG5cbiAgICBsZXQgYXJyYXlWYXIgPSBMT0NBTF9BUlJBWSArICgrK3RoaXMubG9jYWxWYXJpYWJsZUlkKTtcbiAgICBsZXQgZGVjbGFyYXRpb24gPSBuZXcgRGVjbGFyYXRpb24oYXJyYXlWYXIsICduZXcgJyArIHR5cGUgKyAnKCcgKyB2YWx1ZS5sZW5ndGggKyAnKScpO1xuICAgIGxldCBjb2RlQXJyYXkgPSBbZGVjbGFyYXRpb25dO1xuXG4gICAgLy8gYXNzaWduIGEgX2lOJHQgZmxhZyB0byBpbmRpY2F0ZSB0aGF0IHRoaXMgb2JqZWN0IGhhcyBiZWVuIHBhcnNlZC5cbiAgICB2YWx1ZS5faU4kdCA9IHtcbiAgICAgICAgZ2xvYmFsVmFyOiAnJywgICAgICAvLyB0aGUgbmFtZSBvZiBkZWNsYXJlZCBnbG9iYWwgdmFyaWFibGUgdXNlZCB0byBhY2Nlc3MgdGhpcyBvYmplY3RcbiAgICAgICAgc291cmNlOiBjb2RlQXJyYXksICAvLyB0aGUgc291cmNlIGNvZGUgYXJyYXkgZm9yIHRoaXMgb2JqZWN0XG4gICAgfTtcbiAgICB0aGlzLm9ianNUb0NsZWFyX2lOJHQucHVzaCh2YWx1ZSk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlmICh2YWx1ZVtpXSAhPT0gMCkge1xuICAgICAgICAgICAgdmFyIHN0YXRlbWVudCA9IGFycmF5VmFyICsgJ1snICsgaSArICddPSc7XG4gICAgICAgICAgICB3cml0ZUFzc2lnbm1lbnQoY29kZUFycmF5LCBzdGF0ZW1lbnQsIHZhbHVlW2ldKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29kZUFycmF5O1xufTtcblxucHJvdG8uZW51bWVyYXRlRmllbGQgPSBmdW5jdGlvbiAob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUpIHtcbiAgICAgICAgdmFyIF9pTiR0ID0gdmFsdWUuX2lOJHQ7XG4gICAgICAgIGlmIChfaU4kdCkge1xuICAgICAgICAgICAgLy8gcGFyc2VkXG4gICAgICAgICAgICB2YXIgZ2xvYmFsVmFyID0gX2lOJHQuZ2xvYmFsVmFyO1xuICAgICAgICAgICAgaWYgKCFnbG9iYWxWYXIpIHtcbiAgICAgICAgICAgICAgICAvLyBkZWNsYXJlIGEgZ2xvYmFsIHZhclxuICAgICAgICAgICAgICAgIGdsb2JhbFZhciA9IF9pTiR0Lmdsb2JhbFZhciA9ICd2JyArICgrK3RoaXMuZ2xvYmFsVmFyaWFibGVJZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5nbG9iYWxWYXJpYWJsZXMucHVzaChnbG9iYWxWYXIpO1xuICAgICAgICAgICAgICAgIC8vIGluc2VydCBhc3NpZ25tZW50IHN0YXRlbWVudCB0byBhc3NpZ24gdG8gZ2xvYmFsIHZhclxuICAgICAgICAgICAgICAgIHZhciBsaW5lID0gX2lOJHQuc291cmNlW0xJTkVfSU5ERVhfT0ZfTkVXX09CSl07XG4gICAgICAgICAgICAgICAgX2lOJHQuc291cmNlW0xJTkVfSU5ERVhfT0ZfTkVXX09CSl0gPSBtZXJnZURlY2xhcmF0aW9uKGdsb2JhbFZhciArICc9JywgbGluZSk7XG4gICAgICAgICAgICAgICAgLy8gaWYgKHR5cGVvZiBsaW5lID09PSdzdHJpbmcnICYmIGxpbmUuc3RhcnRzV2l0aChWQVIpKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIC8vIHZhciBvPXh4eCAtPiB2YXIgbz1nbG9iYWw9eHh4XG4gICAgICAgICAgICAgICAgLy8gICAgIHZhciBMRU5fT0ZfVkFSX08gPSA1O1xuICAgICAgICAgICAgICAgIC8vICAgICBfaU4kdC5zb3VyY2VbTElORV9JTkRFWF9PRl9ORVdfT0JKXSA9IGxpbmUuc2xpY2UoMCwgTEVOX09GX1ZBUl9PKSArICc9JyArIGdsb2JhbFZhciArIGxpbmUuc2xpY2UoTEVOX09GX1ZBUl9PKTtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsVmFyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluc3RhbnRpYXRlVHlwZWRBcnJheSh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluc3RhbnRpYXRlQXJyYXkodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFudGlhdGVPYmoodmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRGdW5jTW9kdWxlKHZhbHVlKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gZXNjYXBlRm9ySlModmFsdWUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ19vYmpGbGFncycgJiYgKG9iaiBpbnN0YW5jZW9mIENDT2JqZWN0KSkge1xuICAgICAgICAgICAgdmFsdWUgJj0gUGVyc2lzdGVudE1hc2s7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbn07XG5cbnByb3RvLnNldE9ialByb3AgPSBmdW5jdGlvbiAoY29kZUFycmF5LCBvYmosIGtleSwgdmFsdWUpIHtcbiAgICB2YXIgc3RhdGVtZW50ID0gTE9DQUxfT0JKICsgZ2V0UHJvcEFjY2Vzc29yKGtleSkgKyAnPSc7XG4gICAgdmFyIGV4cHJlc3Npb24gPSB0aGlzLmVudW1lcmF0ZUZpZWxkKG9iaiwga2V5LCB2YWx1ZSk7XG4gICAgd3JpdGVBc3NpZ25tZW50KGNvZGVBcnJheSwgc3RhdGVtZW50LCBleHByZXNzaW9uKTtcbn07XG5cbi8vIGNvZGVBcnJheSAtIHRoZSBzb3VyY2UgY29kZSBhcnJheSBmb3IgdGhpcyBvYmplY3RcbnByb3RvLmVudW1lcmF0ZU9iamVjdCA9IGZ1bmN0aW9uIChjb2RlQXJyYXksIG9iaikge1xuICAgIHZhciBrbGFzcyA9IG9iai5jb25zdHJ1Y3RvcjtcbiAgICBpZiAoY2MuQ2xhc3MuX2lzQ0NDbGFzcyhrbGFzcykpIHtcbiAgICAgICAgdGhpcy5lbnVtZXJhdGVDQ0NsYXNzKGNvZGVBcnJheSwgb2JqLCBrbGFzcyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBwcmltaXRpdmUgamF2YXNjcmlwdCBvYmplY3RcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICAgICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoa2V5KSB8fFxuICAgICAgICAgICAgICAgIChrZXkuY2hhckNvZGVBdCgwKSA9PT0gOTUgJiYga2V5LmNoYXJDb2RlQXQoMSkgPT09IDk1ICYmICAgLy8gc3RhcnRzIHdpdGggXCJfX1wiXG4gICAgICAgICAgICAgICAgIGtleSAhPT0gJ19fdHlwZV9fJylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHZhbHVlID0gb2JqW2tleV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZSA9PT0gb2JqLl9pTiR0KSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNldE9ialByb3AoY29kZUFycmF5LCBvYmosIGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxucHJvdG8uaW5zdGFudGlhdGVPYmogPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIGNjLlZhbHVlVHlwZSkge1xuICAgICAgICByZXR1cm4gQ0NDbGFzcy5nZXROZXdWYWx1ZVR5cGVDb2RlKG9iaik7XG4gICAgfVxuICAgIGlmIChvYmogaW5zdGFuY2VvZiBjYy5Bc3NldCkge1xuICAgICAgICAvLyByZWdpc3RlciB0byBhc3NldCBsaXN0IGFuZCBqdXN0IHJldHVybiB0aGUgcmVmZXJlbmNlLlxuICAgICAgICByZXR1cm4gdGhpcy5nZXRPYmpSZWYob2JqKTtcbiAgICB9XG4gICAgaWYgKG9iai5fb2JqRmxhZ3MgJiBEZXN0cm95ZWQpIHtcbiAgICAgICAgLy8gdGhlIHNhbWUgYXMgY2MuaXNWYWxpZChvYmopXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciBjcmVhdGVDb2RlO1xuICAgIHZhciBjdG9yID0gb2JqLmNvbnN0cnVjdG9yO1xuICAgIGlmIChjYy5DbGFzcy5faXNDQ0NsYXNzKGN0b3IpKSB7XG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucGFyZW50IGluc3RhbmNlb2YgY2MuQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIGNjLl9CYXNlTm9kZSB8fCBvYmogaW5zdGFuY2VvZiBjYy5Db21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0T2JqUmVmKG9iaik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBjYy5fQmFzZU5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAob2JqIGluc3RhbmNlb2YgY2MuX0Jhc2VOb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghb2JqLmlzQ2hpbGRPZih0aGlzLnBhcmVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNob3VsZCBub3QgY2xvbmUgb3RoZXIgbm9kZXMgaWYgbm90IGRlc2NlbmRhbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldE9ialJlZihvYmopO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIGNjLkNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW9iai5ub2RlLmlzQ2hpbGRPZih0aGlzLnBhcmVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNob3VsZCBub3QgY2xvbmUgb3RoZXIgY29tcG9uZW50IGlmIG5vdCBkZXNjZW5kYW50XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRPYmpSZWYob2JqKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjcmVhdGVDb2RlID0gbmV3IERlY2xhcmF0aW9uKExPQ0FMX09CSiwgJ25ldyAnICsgdGhpcy5nZXRGdW5jTW9kdWxlKGN0b3IsIHRydWUpICsgJygpJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGN0b3IgPT09IE9iamVjdCkge1xuICAgICAgICBjcmVhdGVDb2RlID0gbmV3IERlY2xhcmF0aW9uKExPQ0FMX09CSiwgJ3t9Jyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKCFjdG9yKSB7XG4gICAgICAgIGNyZWF0ZUNvZGUgPSBuZXcgRGVjbGFyYXRpb24oTE9DQUxfT0JKLCAnT2JqZWN0LmNyZWF0ZShudWxsKScpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gZG8gbm90IGNsb25lIHVua25vd24gdHlwZVxuICAgICAgICByZXR1cm4gdGhpcy5nZXRPYmpSZWYob2JqKTtcbiAgICB9XG5cbiAgICB2YXIgY29kZUFycmF5ID0gW2NyZWF0ZUNvZGVdO1xuXG4gICAgLy8gYXNzaWduIGEgX2lOJHQgZmxhZyB0byBpbmRpY2F0ZSB0aGF0IHRoaXMgb2JqZWN0IGhhcyBiZWVuIHBhcnNlZC5cbiAgICBqcy52YWx1ZShvYmosICdfaU4kdCcsIHtcbiAgICAgICAgZ2xvYmFsVmFyOiAnJywgICAgICAvLyB0aGUgbmFtZSBvZiBkZWNsYXJlZCBnbG9iYWwgdmFyaWFibGUgdXNlZCB0byBhY2Nlc3MgdGhpcyBvYmplY3RcbiAgICAgICAgc291cmNlOiBjb2RlQXJyYXksICAvLyB0aGUgc291cmNlIGNvZGUgYXJyYXkgZm9yIHRoaXMgb2JqZWN0XG4gICAgICAgIC8vcHJvcE5hbWU6ICcnLCAgICAgLy8gdGhlIHByb3BOYW1lIHRoaXMgb2JqZWN0IGRlZmluZWQgaW4gaXRzIHNvdXJjZSBjb2RlLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIC8vIGlmIGRlZmluZWQsIHVzZSBMT0NBTF9PQkoucHJvcE5hbWUgdG8gYWNjZXNzIHRoZSBvYmosIGVsc2UganVzdCB1c2Ugb1xuICAgIH0sIHRydWUpO1xuICAgIHRoaXMub2Jqc1RvQ2xlYXJfaU4kdC5wdXNoKG9iaik7XG5cbiAgICB0aGlzLmVudW1lcmF0ZU9iamVjdChjb2RlQXJyYXksIG9iaik7XG4gICAgcmV0dXJuIFsnKGZ1bmN0aW9uKCl7JyxcbiAgICAgICAgICAgICAgICBjb2RlQXJyYXksXG4gICAgICAgICAgICAncmV0dXJuIG87fSkoKTsnXTtcbn07XG5cblxuZnVuY3Rpb24gY29tcGlsZSAobm9kZSkge1xuICAgIHZhciByb290ID0gKG5vZGUgaW5zdGFuY2VvZiBjYy5fQmFzZU5vZGUpICYmIG5vZGU7XG4gICAgdmFyIHBhcnNlciA9IG5ldyBQYXJzZXIobm9kZSwgcm9vdCk7XG4gICAgcmV0dXJuIHBhcnNlci5yZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNvbXBpbGU6IGNvbXBpbGUsXG4gICAgZXF1YWxzVG9EZWZhdWx0OiBlcXVhbHNUb0RlZmF1bHRcbn07XG5cbmlmIChDQ19URVNUKSB7XG4gICAgY2MuX1Rlc3QuSW50YW50aWF0ZUppdCA9IG1vZHVsZS5leHBvcnRzO1xufVxuIl0sInNvdXJjZVJvb3QiOiIvIn0=