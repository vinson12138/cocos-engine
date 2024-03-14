
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/deserialize-editor.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _deserializeCompiled = _interopRequireDefault(require("./deserialize-compiled"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var Attr = require('./attribute');

var CCClass = require('./CCClass');

var misc = require('../utils/misc');

// HELPERS

/**
 * !#en Contains information collected during deserialization
 * !#zh 包含反序列化时的一些信息
 * @class Details
 *
 */
var Details = function Details() {
  /**
   * list of the depends assets' uuid
   * @property {String[]} uuidList
   */
  this.uuidList = [];
  /**
   * the obj list whose field needs to load asset by uuid
   * @property {Object[]} uuidObjList
   */

  this.uuidObjList = [];
  /**
   * the corresponding field name which referenced to the asset
   * @property {String[]} uuidPropList
   */

  this.uuidPropList = [];
};
/**
 * @method reset
 */


Details.prototype.reset = function () {
  this.uuidList.length = 0;
  this.uuidObjList.length = 0;
  this.uuidPropList.length = 0;
};

if (CC_EDITOR || CC_TEST) {
  Details.prototype.assignAssetsBy = function (getter) {
    for (var i = 0, len = this.uuidList.length; i < len; i++) {
      var uuid = this.uuidList[i];
      var obj = this.uuidObjList[i];
      var prop = this.uuidPropList[i];
      obj[prop] = getter(uuid);
    }
  };
} // /**
//  * @method getUuidOf
//  * @param {Object} obj
//  * @param {String} propName
//  * @return {String}
//  */
// Details.prototype.getUuidOf = function (obj, propName) {
//     for (var i = 0; i < this.uuidObjList.length; i++) {
//         if (this.uuidObjList[i] === obj && this.uuidPropList[i] === propName) {
//             return this.uuidList[i];
//         }
//     }
//     return "";
// };

/**
 * @method push
 * @param {Object} obj
 * @param {String} propName
 * @param {String} uuid
 */


Details.prototype.push = function (obj, propName, uuid) {
  this.uuidList.push(uuid);
  this.uuidObjList.push(obj);
  this.uuidPropList.push(propName);
};

Details.pool = new js.Pool(function (obj) {
  obj.reset();
}, 10);

Details.pool.get = function () {
  return this._get() || new Details();
}; // IMPLEMENT OF DESERIALIZATION


var _Deserializer = function () {
  function _Deserializer(result, classFinder, customEnv, ignoreEditorOnly) {
    this.result = result;
    this.customEnv = customEnv;
    this.deserializedList = [];
    this.deserializedData = null;
    this._classFinder = classFinder;

    if (!CC_BUILD) {
      this._ignoreEditorOnly = ignoreEditorOnly;
    }

    this._idList = [];
    this._idObjList = [];
    this._idPropList = [];
  }

  function _dereference(self) {
    // 这里不采用遍历反序列化结果的方式，因为反序列化的结果如果引用到复杂的外部库，很容易堆栈溢出。
    var deserializedList = self.deserializedList;
    var idPropList = self._idPropList;
    var idList = self._idList;
    var idObjList = self._idObjList;
    var onDereferenced = self._classFinder && self._classFinder.onDereferenced;
    var i, propName, id;

    if (CC_EDITOR && onDereferenced) {
      for (i = 0; i < idList.length; i++) {
        propName = idPropList[i];
        id = idList[i];
        idObjList[i][propName] = deserializedList[id];
        onDereferenced(deserializedList, id, idObjList[i], propName);
      }
    } else {
      for (i = 0; i < idList.length; i++) {
        propName = idPropList[i];
        id = idList[i];
        idObjList[i][propName] = deserializedList[id];
      }
    }
  }

  var prototype = _Deserializer.prototype;

  prototype.deserialize = function (jsonObj) {
    if (Array.isArray(jsonObj)) {
      var jsonArray = jsonObj;
      var refCount = jsonArray.length;
      this.deserializedList.length = refCount; // deserialize

      for (var i = 0; i < refCount; i++) {
        if (jsonArray[i]) {
          if (CC_EDITOR || CC_TEST) {
            this.deserializedList[i] = this._deserializeObject(jsonArray[i], this.deserializedList, '' + i);
          } else {
            this.deserializedList[i] = this._deserializeObject(jsonArray[i]);
          }
        }
      }

      this.deserializedData = refCount > 0 ? this.deserializedList[0] : []; //// callback
      //for (var j = 0; j < refCount; j++) {
      //    if (referencedList[j].onAfterDeserialize) {
      //        referencedList[j].onAfterDeserialize();
      //    }
      //}
    } else {
      this.deserializedList.length = 1;

      if (CC_EDITOR || CC_TEST) {
        this.deserializedData = jsonObj ? this._deserializeObject(jsonObj, this.deserializedList, '0') : null;
      } else {
        this.deserializedData = jsonObj ? this._deserializeObject(jsonObj) : null;
      }

      this.deserializedList[0] = this.deserializedData; //// callback
      //if (deserializedData.onAfterDeserialize) {
      //    deserializedData.onAfterDeserialize();
      //}
    } // dereference


    _dereference(this);

    return this.deserializedData;
  }; ///**
  // * @param {Object} serialized - The obj to deserialize, must be non-nil
  // * @param {Object} [owner] - debug only
  // * @param {String} [propName] - debug only
  // */


  prototype._deserializeObject = function (serialized, owner, propName) {
    var prop;
    var obj = null; // the obj to return

    var klass = null;
    var type = serialized.__type__;

    if (type === 'TypedArray') {
      var array = serialized.array;
      obj = new window[serialized.ctor](array.length);

      for (var i = 0; i < array.length; ++i) {
        obj[i] = array[i];
      }

      return obj;
    } else if (type) {
      // Type Object (including CCClass)
      klass = this._classFinder(type, serialized, owner, propName);

      if (!klass) {
        var notReported = this._classFinder === js._getClassById;

        if (notReported) {
          deserialize.reportMissingClass(type);
        }

        return null;
      } // instantiate a new object


      obj = new klass();

      if (obj._deserialize) {
        obj._deserialize(serialized.content, this);

        return obj;
      }

      if (cc.Class._isCCClass(klass)) {
        _deserializeFireClass(this, obj, serialized, klass);
      } else {
        this._deserializeTypedObject(obj, serialized, klass);
      }
    } else if (!Array.isArray(serialized)) {
      // embedded primitive javascript object
      obj = {};

      this._deserializePrimitiveObject(obj, serialized);
    } else {
      // Array
      obj = new Array(serialized.length);

      for (var _i = 0; _i < serialized.length; _i++) {
        prop = serialized[_i];

        if (typeof prop === 'object' && prop) {
          var isAssetType = this._deserializeObjField(obj, prop, '' + _i);

          if (isAssetType) {
            // fill default value for primitive objects (no constructor)
            obj[_i] = null;
          }
        } else {
          obj[_i] = prop;
        }
      }
    }

    return obj;
  }; // 和 _deserializeObject 不同的地方在于会判断 id 和 uuid


  prototype._deserializeObjField = function (obj, jsonObj, propName) {
    var id = jsonObj.__id__;

    if (id === undefined) {
      var uuid = jsonObj.__uuid__;

      if (uuid) {
        this.result.push(obj, propName, uuid);
        return true;
      } else {
        if (CC_EDITOR || CC_TEST) {
          obj[propName] = this._deserializeObject(jsonObj, obj, propName);
        } else {
          obj[propName] = this._deserializeObject(jsonObj);
        }
      }
    } else {
      var dObj = this.deserializedList[id];

      if (dObj) {
        obj[propName] = dObj;
      } else {
        this._idList.push(id);

        this._idObjList.push(obj);

        this._idPropList.push(propName);
      }
    }
  };

  prototype._deserializePrimitiveObject = function (instance, serialized) {
    for (var propName in serialized) {
      if (serialized.hasOwnProperty(propName)) {
        var prop = serialized[propName];

        if (typeof prop !== 'object') {
          if (propName !== '__type__'
          /* && k != '__id__'*/
          ) {
              instance[propName] = prop;
            }
        } else {
          if (prop) {
            var isAssetType = this._deserializeObjField(instance, prop, propName);

            if (isAssetType) {
              // fill default value for primitive objects (no constructor)
              instance[propName] = null;
            }
          } else {
            instance[propName] = null;
          }
        }
      }
    }
  }; // function _compileTypedObject (accessor, klass, ctorCode) {
  //     if (klass === cc.Vec2) {
  //         return `{` +
  //                     `o${accessor}.x=prop.x||0;` +
  //                     `o${accessor}.y=prop.y||0;` +
  //                `}`;
  //     }
  //     else if (klass === cc.Color) {
  //         return `{` +
  //                    `o${accessor}.r=prop.r||0;` +
  //                    `o${accessor}.g=prop.g||0;` +
  //                    `o${accessor}.b=prop.b||0;` +
  //                    `o${accessor}.a=(prop.a===undefined?255:prop.a);` +
  //                `}`;
  //     }
  //     else if (klass === cc.Size) {
  //         return `{` +
  //                    `o${accessor}.width=prop.width||0;` +
  //                    `o${accessor}.height=prop.height||0;` +
  //                `}`;
  //     }
  //     else {
  //         return `s._deserializeTypedObject(o${accessor},prop,${ctorCode});`;
  //     }
  // }
  // deserialize ValueType


  prototype._deserializeTypedObject = function (instance, serialized, klass) {
    if (klass === cc.Vec2) {
      instance.x = serialized.x || 0;
      instance.y = serialized.y || 0;
      return;
    } else if (klass === cc.Vec3) {
      instance.x = serialized.x || 0;
      instance.y = serialized.y || 0;
      instance.z = serialized.z || 0;
      return;
    } else if (klass === cc.Color) {
      instance.r = serialized.r || 0;
      instance.g = serialized.g || 0;
      instance.b = serialized.b || 0;
      var a = serialized.a;
      instance.a = a === undefined ? 255 : a;
      return;
    } else if (klass === cc.Size) {
      instance.width = serialized.width || 0;
      instance.height = serialized.height || 0;
      return;
    }

    var DEFAULT = Attr.DELIMETER + 'default';
    var attrs = Attr.getClassAttrs(klass);
    var fastDefinedProps = klass.__props__ || Object.keys(instance); // 遍历 instance，如果具有类型，才不会把 __type__ 也读进来

    for (var i = 0; i < fastDefinedProps.length; i++) {
      var propName = fastDefinedProps[i];
      var value = serialized[propName];

      if (value === undefined || !serialized.hasOwnProperty(propName)) {
        // not serialized,
        // recover to default value in ValueType, because eliminated properties equals to
        // its default value in ValueType, not default value in user class
        value = CCClass.getDefault(attrs[propName + DEFAULT]);
      }

      if (typeof value !== 'object') {
        instance[propName] = value;
      } else if (value) {
        this._deserializeObjField(instance, value, propName);
      } else {
        instance[propName] = null;
      }
    }
  };

  function compileObjectTypeJit(sources, defaultValue, accessorToSet, propNameLiteralToSet, assumeHavePropIfIsValue) {
    if (defaultValue instanceof cc.ValueType) {
      // fast case
      if (!assumeHavePropIfIsValue) {
        sources.push('if(prop){');
      }

      var ctorCode = js.getClassName(defaultValue);
      sources.push("s._deserializeTypedObject(o" + accessorToSet + ",prop," + ctorCode + ");");

      if (!assumeHavePropIfIsValue) {
        sources.push('}else o' + accessorToSet + '=null;');
      }
    } else {
      sources.push('if(prop){');
      sources.push('s._deserializeObjField(o,prop,' + propNameLiteralToSet + ');');
      sources.push('}else o' + accessorToSet + '=null;');
    }
  }

  var compileDeserialize = CC_SUPPORT_JIT ? function (self, klass) {
    var TYPE = Attr.DELIMETER + 'type';
    var EDITOR_ONLY = Attr.DELIMETER + 'editorOnly';
    var DEFAULT = Attr.DELIMETER + 'default';
    var FORMERLY_SERIALIZED_AS = Attr.DELIMETER + 'formerlySerializedAs';
    var attrs = Attr.getClassAttrs(klass);
    var props = klass.__values__; // self, obj, serializedData, klass

    var sources = ['var prop;'];
    var fastMode = misc.BUILTIN_CLASSID_RE.test(js._getClassId(klass)); // sources.push('var vb,vn,vs,vo,vu,vf;');    // boolean, number, string, object, undefined, function

    for (var p = 0; p < props.length; p++) {
      var propName = props[p];

      if ((CC_PREVIEW || CC_EDITOR && self._ignoreEditorOnly) && attrs[propName + EDITOR_ONLY]) {
        continue; // skip editor only if in preview
      }

      var accessorToSet, propNameLiteralToSet;

      if (CCClass.IDENTIFIER_RE.test(propName)) {
        propNameLiteralToSet = '"' + propName + '"';
        accessorToSet = '.' + propName;
      } else {
        propNameLiteralToSet = CCClass.escapeForJS(propName);
        accessorToSet = '[' + propNameLiteralToSet + ']';
      }

      var accessorToGet = accessorToSet;

      if (attrs[propName + FORMERLY_SERIALIZED_AS]) {
        var propNameToRead = attrs[propName + FORMERLY_SERIALIZED_AS];

        if (CCClass.IDENTIFIER_RE.test(propNameToRead)) {
          accessorToGet = '.' + propNameToRead;
        } else {
          accessorToGet = '[' + CCClass.escapeForJS(propNameToRead) + ']';
        }
      }

      sources.push('prop=d' + accessorToGet + ';');
      sources.push("if(typeof " + (CC_JSB || CC_RUNTIME ? '(prop)' : 'prop') + "!==\"undefined\"){"); // function undefined object(null) string boolean number

      var defaultValue = CCClass.getDefault(attrs[propName + DEFAULT]);

      if (fastMode) {
        var isPrimitiveType;
        var userType = attrs[propName + TYPE];

        if (defaultValue === undefined && userType) {
          isPrimitiveType = userType instanceof Attr.PrimitiveType;
        } else {
          var defaultType = typeof defaultValue;
          isPrimitiveType = defaultType === 'string' || defaultType === 'number' || defaultType === 'boolean';
        }

        if (isPrimitiveType) {
          sources.push("o" + accessorToSet + "=prop;");
        } else {
          compileObjectTypeJit(sources, defaultValue, accessorToSet, propNameLiteralToSet, true);
        }
      } else {
        sources.push("if(typeof " + (CC_JSB || CC_RUNTIME ? '(prop)' : 'prop') + "!==\"object\"){" + 'o' + accessorToSet + '=prop;' + '}else{');
        compileObjectTypeJit(sources, defaultValue, accessorToSet, propNameLiteralToSet, false);
        sources.push('}');
      }

      sources.push('}');
    }

    if (cc.js.isChildClassOf(klass, cc._BaseNode) || cc.js.isChildClassOf(klass, cc.Component)) {
      if (CC_PREVIEW || CC_EDITOR && self._ignoreEditorOnly) {
        var mayUsedInPersistRoot = js.isChildClassOf(klass, cc.Node);

        if (mayUsedInPersistRoot) {
          sources.push('d._id&&(o._id=d._id);');
        }
      } else {
        sources.push('d._id&&(o._id=d._id);');
      }
    }

    if (props[props.length - 1] === '_$erialized') {
      // deep copy original serialized data
      sources.push('o._$erialized=JSON.parse(JSON.stringify(d));'); // parse the serialized data as primitive javascript object, so its __id__ will be dereferenced

      sources.push('s._deserializePrimitiveObject(o._$erialized,d);');
    }

    return Function('s', 'o', 'd', 'k', sources.join(''));
  } : function (self, klass) {
    var fastMode = misc.BUILTIN_CLASSID_RE.test(js._getClassId(klass));
    var shouldCopyId = cc.js.isChildClassOf(klass, cc._BaseNode) || cc.js.isChildClassOf(klass, cc.Component);
    var shouldCopyRawData;
    var simpleProps = [];
    var simplePropsToRead = simpleProps;
    var advancedProps = [];
    var advancedPropsToRead = advancedProps;
    var advancedPropsValueType = [];

    (function () {
      var props = klass.__values__;
      shouldCopyRawData = props[props.length - 1] === '_$erialized';
      var attrs = Attr.getClassAttrs(klass);
      var TYPE = Attr.DELIMETER + 'type';
      var DEFAULT = Attr.DELIMETER + 'default';
      var FORMERLY_SERIALIZED_AS = Attr.DELIMETER + 'formerlySerializedAs';

      for (var p = 0; p < props.length; p++) {
        var propName = props[p];
        var propNameToRead = propName;

        if (attrs[propName + FORMERLY_SERIALIZED_AS]) {
          propNameToRead = attrs[propName + FORMERLY_SERIALIZED_AS];
        } // function undefined object(null) string boolean number


        var defaultValue = CCClass.getDefault(attrs[propName + DEFAULT]);
        var isPrimitiveType = false;

        if (fastMode) {
          var userType = attrs[propName + TYPE];

          if (defaultValue === undefined && userType) {
            isPrimitiveType = userType instanceof Attr.PrimitiveType;
          } else {
            var defaultType = typeof defaultValue;
            isPrimitiveType = defaultType === 'string' || defaultType === 'number' || defaultType === 'boolean';
          }
        }

        if (fastMode && isPrimitiveType) {
          if (propNameToRead !== propName && simplePropsToRead === simpleProps) {
            simplePropsToRead = simpleProps.slice();
          }

          simpleProps.push(propName);

          if (simplePropsToRead !== simpleProps) {
            simplePropsToRead.push(propNameToRead);
          }
        } else {
          if (propNameToRead !== propName && advancedPropsToRead === advancedProps) {
            advancedPropsToRead = advancedProps.slice();
          }

          advancedProps.push(propName);

          if (advancedPropsToRead !== advancedProps) {
            advancedPropsToRead.push(propNameToRead);
          }

          advancedPropsValueType.push(defaultValue instanceof cc.ValueType && defaultValue.constructor);
        }
      }
    })();

    return function (s, o, d, k) {
      for (var i = 0; i < simpleProps.length; ++i) {
        var _prop = d[simplePropsToRead[i]];

        if (_prop !== undefined) {
          o[simpleProps[i]] = _prop;
        }
      }

      for (var _i2 = 0; _i2 < advancedProps.length; ++_i2) {
        var propName = advancedProps[_i2];
        var prop = d[advancedPropsToRead[_i2]];

        if (prop === undefined) {
          continue;
        }

        if (!fastMode && typeof prop !== 'object') {
          o[propName] = prop;
        } else {
          // fastMode (so will not simpleProp) or object
          var valueTypeCtor = advancedPropsValueType[_i2];

          if (valueTypeCtor) {
            if (fastMode || prop) {
              s._deserializeTypedObject(o[propName], prop, valueTypeCtor);
            } else {
              o[propName] = null;
            }
          } else {
            if (prop) {
              s._deserializeObjField(o, prop, propName);
            } else {
              o[propName] = null;
            }
          }
        }
      }

      if (shouldCopyId && d._id) {
        o._id = d._id;
      }

      if (shouldCopyRawData) {
        // deep copy original serialized data
        o._$erialized = JSON.parse(JSON.stringify(d)); // parse the serialized data as primitive javascript object, so its __id__ will be dereferenced

        s._deserializePrimitiveObject(o._$erialized, d);
      }
    };
  };

  function unlinkUnusedPrefab(self, serialized, obj) {
    var uuid = serialized['asset'] && serialized['asset'].__uuid__;

    if (uuid) {
      var last = self.result.uuidList.length - 1;

      if (self.result.uuidList[last] === uuid && self.result.uuidObjList[last] === obj && self.result.uuidPropList[last] === 'asset') {
        self.result.uuidList.pop();
        self.result.uuidObjList.pop();
        self.result.uuidPropList.pop();
      } else {
        var debugEnvOnlyInfo = 'Failed to skip prefab asset while deserializing PrefabInfo';
        cc.warn(debugEnvOnlyInfo);
      }
    }
  }

  function _deserializeFireClass(self, obj, serialized, klass) {
    var deserialize;

    if (klass.hasOwnProperty('__deserialize__')) {
      deserialize = klass.__deserialize__;
    } else {
      deserialize = compileDeserialize(self, klass); // if (CC_TEST && !isPhantomJS) {
      //     cc.log(deserialize);
      // }

      js.value(klass, '__deserialize__', deserialize, true);
    }

    deserialize(self, obj, serialized, klass); // if preview or build worker

    if (CC_PREVIEW || CC_EDITOR && self._ignoreEditorOnly) {
      if (klass === cc._PrefabInfo && !obj.sync) {
        unlinkUnusedPrefab(self, serialized, obj);
      }
    }
  }

  _Deserializer.pool = new js.Pool(function (obj) {
    obj.result = null;
    obj.customEnv = null;
    obj.deserializedList.length = 0;
    obj.deserializedData = null;
    obj._classFinder = null;
    obj._idList.length = 0;
    obj._idObjList.length = 0;
    obj._idPropList.length = 0;
  }, 1);

  _Deserializer.pool.get = function (result, classFinder, customEnv, ignoreEditorOnly) {
    var cache = this._get();

    if (cache) {
      cache.result = result;
      cache.customEnv = customEnv;
      cache._classFinder = classFinder;

      if (!CC_BUILD) {
        cache._ignoreEditorOnly = ignoreEditorOnly;
      }

      return cache;
    } else {
      return new _Deserializer(result, classFinder, customEnv, ignoreEditorOnly);
    }
  };

  return _Deserializer;
}();
/**
 * @module cc
 */

/**
 * !#en Deserialize json to cc.Asset
 * !#zh 将 JSON 反序列化为对象实例。
 *
 * @method deserialize
 * @param {String|Object} data - the serialized cc.Asset json string or json object.
 * @param {Details} [details] - additional loading result
 * @param {Object} [options]
 * @return {object} the main data(asset)
 */


var deserialize = module.exports = function (data, details, options) {
  options = options || {};
  var classFinder = options.classFinder || js._getClassById; // 启用 createAssetRefs 后，如果有 url 属性则会被统一强制设置为 { uuid: 'xxx' }，必须后面再特殊处理

  var createAssetRefs = options.createAssetRefs || cc.sys.platform === cc.sys.EDITOR_CORE;
  var customEnv = options.customEnv;
  var ignoreEditorOnly = options.ignoreEditorOnly; //var oldJson = JSON.stringify(data, null, 2);

  var tempDetails = !details;
  details = details || Details.pool.get();

  var deserializer = _Deserializer.pool.get(details, classFinder, customEnv, ignoreEditorOnly);

  cc.game._isCloning = true;
  var res = deserializer.deserialize(data);
  cc.game._isCloning = false;

  _Deserializer.pool.put(deserializer);

  if (createAssetRefs) {
    details.assignAssetsBy(Editor.serialize.asAsset);
  }

  if (tempDetails) {
    Details.pool.put(details);
  } //var afterJson = JSON.stringify(data, null, 2);
  //if (oldJson !== afterJson) {
  //    throw new Error('JSON SHOULD not changed');
  //}


  return res;
};

deserialize.Details = Details;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BsYXRmb3JtL2Rlc2VyaWFsaXplLWVkaXRvci5qcyJdLCJuYW1lcyI6WyJqcyIsInJlcXVpcmUiLCJBdHRyIiwiQ0NDbGFzcyIsIm1pc2MiLCJEZXRhaWxzIiwidXVpZExpc3QiLCJ1dWlkT2JqTGlzdCIsInV1aWRQcm9wTGlzdCIsInByb3RvdHlwZSIsInJlc2V0IiwibGVuZ3RoIiwiQ0NfRURJVE9SIiwiQ0NfVEVTVCIsImFzc2lnbkFzc2V0c0J5IiwiZ2V0dGVyIiwiaSIsImxlbiIsInV1aWQiLCJvYmoiLCJwcm9wIiwicHVzaCIsInByb3BOYW1lIiwicG9vbCIsIlBvb2wiLCJnZXQiLCJfZ2V0IiwiX0Rlc2VyaWFsaXplciIsInJlc3VsdCIsImNsYXNzRmluZGVyIiwiY3VzdG9tRW52IiwiaWdub3JlRWRpdG9yT25seSIsImRlc2VyaWFsaXplZExpc3QiLCJkZXNlcmlhbGl6ZWREYXRhIiwiX2NsYXNzRmluZGVyIiwiQ0NfQlVJTEQiLCJfaWdub3JlRWRpdG9yT25seSIsIl9pZExpc3QiLCJfaWRPYmpMaXN0IiwiX2lkUHJvcExpc3QiLCJfZGVyZWZlcmVuY2UiLCJzZWxmIiwiaWRQcm9wTGlzdCIsImlkTGlzdCIsImlkT2JqTGlzdCIsIm9uRGVyZWZlcmVuY2VkIiwiaWQiLCJkZXNlcmlhbGl6ZSIsImpzb25PYmoiLCJBcnJheSIsImlzQXJyYXkiLCJqc29uQXJyYXkiLCJyZWZDb3VudCIsIl9kZXNlcmlhbGl6ZU9iamVjdCIsInNlcmlhbGl6ZWQiLCJvd25lciIsImtsYXNzIiwidHlwZSIsIl9fdHlwZV9fIiwiYXJyYXkiLCJ3aW5kb3ciLCJjdG9yIiwibm90UmVwb3J0ZWQiLCJfZ2V0Q2xhc3NCeUlkIiwicmVwb3J0TWlzc2luZ0NsYXNzIiwiX2Rlc2VyaWFsaXplIiwiY29udGVudCIsImNjIiwiQ2xhc3MiLCJfaXNDQ0NsYXNzIiwiX2Rlc2VyaWFsaXplRmlyZUNsYXNzIiwiX2Rlc2VyaWFsaXplVHlwZWRPYmplY3QiLCJfZGVzZXJpYWxpemVQcmltaXRpdmVPYmplY3QiLCJpc0Fzc2V0VHlwZSIsIl9kZXNlcmlhbGl6ZU9iakZpZWxkIiwiX19pZF9fIiwidW5kZWZpbmVkIiwiX191dWlkX18iLCJkT2JqIiwiaW5zdGFuY2UiLCJoYXNPd25Qcm9wZXJ0eSIsIlZlYzIiLCJ4IiwieSIsIlZlYzMiLCJ6IiwiQ29sb3IiLCJyIiwiZyIsImIiLCJhIiwiU2l6ZSIsIndpZHRoIiwiaGVpZ2h0IiwiREVGQVVMVCIsIkRFTElNRVRFUiIsImF0dHJzIiwiZ2V0Q2xhc3NBdHRycyIsImZhc3REZWZpbmVkUHJvcHMiLCJfX3Byb3BzX18iLCJPYmplY3QiLCJrZXlzIiwidmFsdWUiLCJnZXREZWZhdWx0IiwiY29tcGlsZU9iamVjdFR5cGVKaXQiLCJzb3VyY2VzIiwiZGVmYXVsdFZhbHVlIiwiYWNjZXNzb3JUb1NldCIsInByb3BOYW1lTGl0ZXJhbFRvU2V0IiwiYXNzdW1lSGF2ZVByb3BJZklzVmFsdWUiLCJWYWx1ZVR5cGUiLCJjdG9yQ29kZSIsImdldENsYXNzTmFtZSIsImNvbXBpbGVEZXNlcmlhbGl6ZSIsIkNDX1NVUFBPUlRfSklUIiwiVFlQRSIsIkVESVRPUl9PTkxZIiwiRk9STUVSTFlfU0VSSUFMSVpFRF9BUyIsInByb3BzIiwiX192YWx1ZXNfXyIsImZhc3RNb2RlIiwiQlVJTFRJTl9DTEFTU0lEX1JFIiwidGVzdCIsIl9nZXRDbGFzc0lkIiwicCIsIkNDX1BSRVZJRVciLCJJREVOVElGSUVSX1JFIiwiZXNjYXBlRm9ySlMiLCJhY2Nlc3NvclRvR2V0IiwicHJvcE5hbWVUb1JlYWQiLCJDQ19KU0IiLCJDQ19SVU5USU1FIiwiaXNQcmltaXRpdmVUeXBlIiwidXNlclR5cGUiLCJQcmltaXRpdmVUeXBlIiwiZGVmYXVsdFR5cGUiLCJpc0NoaWxkQ2xhc3NPZiIsIl9CYXNlTm9kZSIsIkNvbXBvbmVudCIsIm1heVVzZWRJblBlcnNpc3RSb290IiwiTm9kZSIsIkZ1bmN0aW9uIiwiam9pbiIsInNob3VsZENvcHlJZCIsInNob3VsZENvcHlSYXdEYXRhIiwic2ltcGxlUHJvcHMiLCJzaW1wbGVQcm9wc1RvUmVhZCIsImFkdmFuY2VkUHJvcHMiLCJhZHZhbmNlZFByb3BzVG9SZWFkIiwiYWR2YW5jZWRQcm9wc1ZhbHVlVHlwZSIsInNsaWNlIiwiY29uc3RydWN0b3IiLCJzIiwibyIsImQiLCJrIiwidmFsdWVUeXBlQ3RvciIsIl9pZCIsIl8kZXJpYWxpemVkIiwiSlNPTiIsInBhcnNlIiwic3RyaW5naWZ5IiwidW5saW5rVW51c2VkUHJlZmFiIiwibGFzdCIsInBvcCIsImRlYnVnRW52T25seUluZm8iLCJ3YXJuIiwiX19kZXNlcmlhbGl6ZV9fIiwiX1ByZWZhYkluZm8iLCJzeW5jIiwiY2FjaGUiLCJtb2R1bGUiLCJleHBvcnRzIiwiZGF0YSIsImRldGFpbHMiLCJvcHRpb25zIiwiY3JlYXRlQXNzZXRSZWZzIiwic3lzIiwicGxhdGZvcm0iLCJFRElUT1JfQ09SRSIsInRlbXBEZXRhaWxzIiwiZGVzZXJpYWxpemVyIiwiZ2FtZSIsIl9pc0Nsb25pbmciLCJyZXMiLCJwdXQiLCJFZGl0b3IiLCJzZXJpYWxpemUiLCJhc0Fzc2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBK0JBOzs7O0FBL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBSUEsRUFBRSxHQUFHQyxPQUFPLENBQUMsTUFBRCxDQUFoQjs7QUFDQSxJQUFJQyxJQUFJLEdBQUdELE9BQU8sQ0FBQyxhQUFELENBQWxCOztBQUNBLElBQUlFLE9BQU8sR0FBR0YsT0FBTyxDQUFDLFdBQUQsQ0FBckI7O0FBQ0EsSUFBSUcsSUFBSSxHQUFHSCxPQUFPLENBQUMsZUFBRCxDQUFsQjs7QUFJQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJ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QU0sQ0FBQ0MsU0FBUCxDQUFpQkMsT0FBeEM7QUFDSDs7QUFDRCxNQUFJUixXQUFKLEVBQWlCO0FBQ2IvSyxJQUFBQSxPQUFPLENBQUNrQixJQUFSLENBQWFrSyxHQUFiLENBQWlCWCxPQUFqQjtBQUNILEdBeEJnRSxDQTBCakU7QUFDQTtBQUNBO0FBQ0E7OztBQUVBLFNBQU9VLEdBQVA7QUFDSCxDQWhDRDs7QUFrQ0F6SSxXQUFXLENBQUMxQyxPQUFaLEdBQXNCQSxPQUF0QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxudmFyIGpzID0gcmVxdWlyZSgnLi9qcycpO1xudmFyIEF0dHIgPSByZXF1aXJlKCcuL2F0dHJpYnV0ZScpO1xudmFyIENDQ2xhc3MgPSByZXF1aXJlKCcuL0NDQ2xhc3MnKTtcbnZhciBtaXNjID0gcmVxdWlyZSgnLi4vdXRpbHMvbWlzYycpO1xuXG5pbXBvcnQgZGVzZXJpYWxpemVDb21waWxlZCBmcm9tICcuL2Rlc2VyaWFsaXplLWNvbXBpbGVkJztcblxuLy8gSEVMUEVSU1xuXG4vKipcbiAqICEjZW4gQ29udGFpbnMgaW5mb3JtYXRpb24gY29sbGVjdGVkIGR1cmluZyBkZXNlcmlhbGl6YXRpb25cbiAqICEjemgg5YyF5ZCr5Y+N5bqP5YiX5YyW5pe255qE5LiA5Lqb5L+h5oGvXG4gKiBAY2xhc3MgRGV0YWlsc1xuICpcbiAqL1xudmFyIERldGFpbHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogbGlzdCBvZiB0aGUgZGVwZW5kcyBhc3NldHMnIHV1aWRcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ1tdfSB1dWlkTGlzdFxuICAgICAqL1xuICAgIHRoaXMudXVpZExpc3QgPSBbXTtcbiAgICAvKipcbiAgICAgKiB0aGUgb2JqIGxpc3Qgd2hvc2UgZmllbGQgbmVlZHMgdG8gbG9hZCBhc3NldCBieSB1dWlkXG4gICAgICogQHByb3BlcnR5IHtPYmplY3RbXX0gdXVpZE9iakxpc3RcbiAgICAgKi9cbiAgICB0aGlzLnV1aWRPYmpMaXN0ID0gW107XG4gICAgLyoqXG4gICAgICogdGhlIGNvcnJlc3BvbmRpbmcgZmllbGQgbmFtZSB3aGljaCByZWZlcmVuY2VkIHRvIHRoZSBhc3NldFxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nW119IHV1aWRQcm9wTGlzdFxuICAgICAqL1xuICAgIHRoaXMudXVpZFByb3BMaXN0ID0gW107XG59O1xuLyoqXG4gKiBAbWV0aG9kIHJlc2V0XG4gKi9cbkRldGFpbHMucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudXVpZExpc3QubGVuZ3RoID0gMDtcbiAgICB0aGlzLnV1aWRPYmpMaXN0Lmxlbmd0aCA9IDA7XG4gICAgdGhpcy51dWlkUHJvcExpc3QubGVuZ3RoID0gMDtcbn07XG5pZiAoQ0NfRURJVE9SIHx8IENDX1RFU1QpIHtcbiAgICBEZXRhaWxzLnByb3RvdHlwZS5hc3NpZ25Bc3NldHNCeSA9IGZ1bmN0aW9uIChnZXR0ZXIpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMudXVpZExpc3QubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB1dWlkID0gdGhpcy51dWlkTGlzdFtpXTtcbiAgICAgICAgICAgIHZhciBvYmogPSB0aGlzLnV1aWRPYmpMaXN0W2ldO1xuICAgICAgICAgICAgdmFyIHByb3AgPSB0aGlzLnV1aWRQcm9wTGlzdFtpXTtcbiAgICAgICAgICAgIG9ialtwcm9wXSA9IGdldHRlcih1dWlkKTtcbiAgICAgICAgfVxuICAgIH07XG59XG4vLyAvKipcbi8vICAqIEBtZXRob2QgZ2V0VXVpZE9mXG4vLyAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4vLyAgKiBAcGFyYW0ge1N0cmluZ30gcHJvcE5hbWVcbi8vICAqIEByZXR1cm4ge1N0cmluZ31cbi8vICAqL1xuLy8gRGV0YWlscy5wcm90b3R5cGUuZ2V0VXVpZE9mID0gZnVuY3Rpb24gKG9iaiwgcHJvcE5hbWUpIHtcbi8vICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudXVpZE9iakxpc3QubGVuZ3RoOyBpKyspIHtcbi8vICAgICAgICAgaWYgKHRoaXMudXVpZE9iakxpc3RbaV0gPT09IG9iaiAmJiB0aGlzLnV1aWRQcm9wTGlzdFtpXSA9PT0gcHJvcE5hbWUpIHtcbi8vICAgICAgICAgICAgIHJldHVybiB0aGlzLnV1aWRMaXN0W2ldO1xuLy8gICAgICAgICB9XG4vLyAgICAgfVxuLy8gICAgIHJldHVybiBcIlwiO1xuLy8gfTtcbi8qKlxuICogQG1ldGhvZCBwdXNoXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcE5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSB1dWlkXG4gKi9cbkRldGFpbHMucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiAob2JqLCBwcm9wTmFtZSwgdXVpZCkge1xuICAgIHRoaXMudXVpZExpc3QucHVzaCh1dWlkKTtcbiAgICB0aGlzLnV1aWRPYmpMaXN0LnB1c2gob2JqKTtcbiAgICB0aGlzLnV1aWRQcm9wTGlzdC5wdXNoKHByb3BOYW1lKTtcbn07XG5cbkRldGFpbHMucG9vbCA9IG5ldyBqcy5Qb29sKGZ1bmN0aW9uIChvYmopIHtcbiAgICBvYmoucmVzZXQoKTtcbn0sIDEwKTtcblxuRGV0YWlscy5wb29sLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0KCkgfHwgbmV3IERldGFpbHMoKTtcbn07XG5cbi8vIElNUExFTUVOVCBPRiBERVNFUklBTElaQVRJT05cblxudmFyIF9EZXNlcmlhbGl6ZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIF9EZXNlcmlhbGl6ZXIocmVzdWx0LCBjbGFzc0ZpbmRlciwgY3VzdG9tRW52LCBpZ25vcmVFZGl0b3JPbmx5KSB7XG4gICAgICAgIHRoaXMucmVzdWx0ID0gcmVzdWx0O1xuICAgICAgICB0aGlzLmN1c3RvbUVudiA9IGN1c3RvbUVudjtcbiAgICAgICAgdGhpcy5kZXNlcmlhbGl6ZWRMaXN0ID0gW107XG4gICAgICAgIHRoaXMuZGVzZXJpYWxpemVkRGF0YSA9IG51bGw7XG4gICAgICAgIHRoaXMuX2NsYXNzRmluZGVyID0gY2xhc3NGaW5kZXI7XG4gICAgICAgIGlmICghQ0NfQlVJTEQpIHtcbiAgICAgICAgICAgIHRoaXMuX2lnbm9yZUVkaXRvck9ubHkgPSBpZ25vcmVFZGl0b3JPbmx5O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2lkTGlzdCA9IFtdO1xuICAgICAgICB0aGlzLl9pZE9iakxpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5faWRQcm9wTGlzdCA9IFtdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9kZXJlZmVyZW5jZSAoc2VsZikge1xuICAgICAgICAvLyDov5nph4zkuI3ph4fnlKjpgY3ljoblj43luo/liJfljJbnu5PmnpznmoTmlrnlvI/vvIzlm6DkuLrlj43luo/liJfljJbnmoTnu5PmnpzlpoLmnpzlvJXnlKjliLDlpI3mnYLnmoTlpJbpg6jlupPvvIzlvojlrrnmmJPloIbmoIjmuqLlh7rjgIJcbiAgICAgICAgdmFyIGRlc2VyaWFsaXplZExpc3QgPSBzZWxmLmRlc2VyaWFsaXplZExpc3Q7XG4gICAgICAgIHZhciBpZFByb3BMaXN0ID0gc2VsZi5faWRQcm9wTGlzdDtcbiAgICAgICAgdmFyIGlkTGlzdCA9IHNlbGYuX2lkTGlzdDtcbiAgICAgICAgdmFyIGlkT2JqTGlzdCA9IHNlbGYuX2lkT2JqTGlzdDtcbiAgICAgICAgdmFyIG9uRGVyZWZlcmVuY2VkID0gc2VsZi5fY2xhc3NGaW5kZXIgJiYgc2VsZi5fY2xhc3NGaW5kZXIub25EZXJlZmVyZW5jZWQ7XG4gICAgICAgIHZhciBpLCBwcm9wTmFtZSwgaWQ7XG4gICAgICAgIGlmIChDQ19FRElUT1IgJiYgb25EZXJlZmVyZW5jZWQpIHtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBpZExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBwcm9wTmFtZSA9IGlkUHJvcExpc3RbaV07XG4gICAgICAgICAgICAgICAgaWQgPSBpZExpc3RbaV07XG4gICAgICAgICAgICAgICAgaWRPYmpMaXN0W2ldW3Byb3BOYW1lXSA9IGRlc2VyaWFsaXplZExpc3RbaWRdO1xuICAgICAgICAgICAgICAgIG9uRGVyZWZlcmVuY2VkKGRlc2VyaWFsaXplZExpc3QsIGlkLCBpZE9iakxpc3RbaV0sIHByb3BOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBpZExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBwcm9wTmFtZSA9IGlkUHJvcExpc3RbaV07XG4gICAgICAgICAgICAgICAgaWQgPSBpZExpc3RbaV07XG4gICAgICAgICAgICAgICAgaWRPYmpMaXN0W2ldW3Byb3BOYW1lXSA9IGRlc2VyaWFsaXplZExpc3RbaWRdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByb3RvdHlwZSA9IF9EZXNlcmlhbGl6ZXIucHJvdG90eXBlO1xuXG4gICAgcHJvdG90eXBlLmRlc2VyaWFsaXplID0gZnVuY3Rpb24gKGpzb25PYmopIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoanNvbk9iaikpIHtcbiAgICAgICAgICAgIHZhciBqc29uQXJyYXkgPSBqc29uT2JqO1xuICAgICAgICAgICAgdmFyIHJlZkNvdW50ID0ganNvbkFycmF5Lmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMuZGVzZXJpYWxpemVkTGlzdC5sZW5ndGggPSByZWZDb3VudDtcbiAgICAgICAgICAgIC8vIGRlc2VyaWFsaXplXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlZkNvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoanNvbkFycmF5W2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IgfHwgQ0NfVEVTVCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNlcmlhbGl6ZWRMaXN0W2ldID0gdGhpcy5fZGVzZXJpYWxpemVPYmplY3QoanNvbkFycmF5W2ldLCB0aGlzLmRlc2VyaWFsaXplZExpc3QsICcnICsgaSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2VyaWFsaXplZExpc3RbaV0gPSB0aGlzLl9kZXNlcmlhbGl6ZU9iamVjdChqc29uQXJyYXlbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kZXNlcmlhbGl6ZWREYXRhID0gcmVmQ291bnQgPiAwID8gdGhpcy5kZXNlcmlhbGl6ZWRMaXN0WzBdIDogW107XG5cbiAgICAgICAgICAgIC8vLy8gY2FsbGJhY2tcbiAgICAgICAgICAgIC8vZm9yICh2YXIgaiA9IDA7IGogPCByZWZDb3VudDsgaisrKSB7XG4gICAgICAgICAgICAvLyAgICBpZiAocmVmZXJlbmNlZExpc3Rbal0ub25BZnRlckRlc2VyaWFsaXplKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgcmVmZXJlbmNlZExpc3Rbal0ub25BZnRlckRlc2VyaWFsaXplKCk7XG4gICAgICAgICAgICAvLyAgICB9XG4gICAgICAgICAgICAvL31cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGVzZXJpYWxpemVkTGlzdC5sZW5ndGggPSAxO1xuICAgICAgICAgICAgaWYgKENDX0VESVRPUiB8fCBDQ19URVNUKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZXNlcmlhbGl6ZWREYXRhID0ganNvbk9iaiA/IHRoaXMuX2Rlc2VyaWFsaXplT2JqZWN0KGpzb25PYmosIHRoaXMuZGVzZXJpYWxpemVkTGlzdCwgJzAnKSA6IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2VyaWFsaXplZERhdGEgPSBqc29uT2JqID8gdGhpcy5fZGVzZXJpYWxpemVPYmplY3QoanNvbk9iaikgOiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kZXNlcmlhbGl6ZWRMaXN0WzBdID0gdGhpcy5kZXNlcmlhbGl6ZWREYXRhO1xuXG4gICAgICAgICAgICAvLy8vIGNhbGxiYWNrXG4gICAgICAgICAgICAvL2lmIChkZXNlcmlhbGl6ZWREYXRhLm9uQWZ0ZXJEZXNlcmlhbGl6ZSkge1xuICAgICAgICAgICAgLy8gICAgZGVzZXJpYWxpemVkRGF0YS5vbkFmdGVyRGVzZXJpYWxpemUoKTtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVyZWZlcmVuY2VcbiAgICAgICAgX2RlcmVmZXJlbmNlKHRoaXMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmRlc2VyaWFsaXplZERhdGE7XG4gICAgfTtcblxuICAgIC8vLyoqXG4gICAgLy8gKiBAcGFyYW0ge09iamVjdH0gc2VyaWFsaXplZCAtIFRoZSBvYmogdG8gZGVzZXJpYWxpemUsIG11c3QgYmUgbm9uLW5pbFxuICAgIC8vICogQHBhcmFtIHtPYmplY3R9IFtvd25lcl0gLSBkZWJ1ZyBvbmx5XG4gICAgLy8gKiBAcGFyYW0ge1N0cmluZ30gW3Byb3BOYW1lXSAtIGRlYnVnIG9ubHlcbiAgICAvLyAqL1xuICAgIHByb3RvdHlwZS5fZGVzZXJpYWxpemVPYmplY3QgPSBmdW5jdGlvbiAoc2VyaWFsaXplZCwgb3duZXIsIHByb3BOYW1lKSB7XG4gICAgICAgIHZhciBwcm9wO1xuICAgICAgICB2YXIgb2JqID0gbnVsbDsgICAgIC8vIHRoZSBvYmogdG8gcmV0dXJuXG4gICAgICAgIHZhciBrbGFzcyA9IG51bGw7XG4gICAgICAgIHZhciB0eXBlID0gc2VyaWFsaXplZC5fX3R5cGVfXztcbiAgICAgICAgaWYgKHR5cGUgPT09ICdUeXBlZEFycmF5Jykge1xuICAgICAgICAgICAgdmFyIGFycmF5ID0gc2VyaWFsaXplZC5hcnJheTtcbiAgICAgICAgICAgIG9iaiA9IG5ldyB3aW5kb3dbc2VyaWFsaXplZC5jdG9yXShhcnJheS5sZW5ndGgpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIG9ialtpXSA9IGFycmF5W2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlKSB7XG5cbiAgICAgICAgICAgIC8vIFR5cGUgT2JqZWN0IChpbmNsdWRpbmcgQ0NDbGFzcylcblxuICAgICAgICAgICAga2xhc3MgPSB0aGlzLl9jbGFzc0ZpbmRlcih0eXBlLCBzZXJpYWxpemVkLCBvd25lciwgcHJvcE5hbWUpO1xuICAgICAgICAgICAgaWYgKCFrbGFzcykge1xuICAgICAgICAgICAgICAgIHZhciBub3RSZXBvcnRlZCA9IHRoaXMuX2NsYXNzRmluZGVyID09PSBqcy5fZ2V0Q2xhc3NCeUlkO1xuICAgICAgICAgICAgICAgIGlmIChub3RSZXBvcnRlZCkge1xuICAgICAgICAgICAgICAgICAgICBkZXNlcmlhbGl6ZS5yZXBvcnRNaXNzaW5nQ2xhc3ModHlwZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpbnN0YW50aWF0ZSBhIG5ldyBvYmplY3RcbiAgICAgICAgICAgIG9iaiA9IG5ldyBrbGFzcygpO1xuXG4gICAgICAgICAgICBpZiAob2JqLl9kZXNlcmlhbGl6ZSkge1xuICAgICAgICAgICAgICAgIG9iai5fZGVzZXJpYWxpemUoc2VyaWFsaXplZC5jb250ZW50LCB0aGlzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNjLkNsYXNzLl9pc0NDQ2xhc3Moa2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgX2Rlc2VyaWFsaXplRmlyZUNsYXNzKHRoaXMsIG9iaiwgc2VyaWFsaXplZCwga2xhc3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVzZXJpYWxpemVUeXBlZE9iamVjdChvYmosIHNlcmlhbGl6ZWQsIGtsYXNzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICggIUFycmF5LmlzQXJyYXkoc2VyaWFsaXplZCkgKSB7XG5cbiAgICAgICAgICAgIC8vIGVtYmVkZGVkIHByaW1pdGl2ZSBqYXZhc2NyaXB0IG9iamVjdFxuXG4gICAgICAgICAgICBvYmogPSB7fTtcbiAgICAgICAgICAgIHRoaXMuX2Rlc2VyaWFsaXplUHJpbWl0aXZlT2JqZWN0KG9iaiwgc2VyaWFsaXplZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIEFycmF5XG5cbiAgICAgICAgICAgIG9iaiA9IG5ldyBBcnJheShzZXJpYWxpemVkLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VyaWFsaXplZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHByb3AgPSBzZXJpYWxpemVkW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gJ29iamVjdCcgJiYgcHJvcCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaXNBc3NldFR5cGUgPSB0aGlzLl9kZXNlcmlhbGl6ZU9iakZpZWxkKG9iaiwgcHJvcCwgJycgKyBpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQXNzZXRUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaWxsIGRlZmF1bHQgdmFsdWUgZm9yIHByaW1pdGl2ZSBvYmplY3RzIChubyBjb25zdHJ1Y3RvcilcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtpXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG9ialtpXSA9IHByb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfTtcblxuICAgIC8vIOWSjCBfZGVzZXJpYWxpemVPYmplY3Qg5LiN5ZCM55qE5Zyw5pa55Zyo5LqO5Lya5Yik5patIGlkIOWSjCB1dWlkXG4gICAgcHJvdG90eXBlLl9kZXNlcmlhbGl6ZU9iakZpZWxkID0gZnVuY3Rpb24gKG9iaiwganNvbk9iaiwgcHJvcE5hbWUpIHtcbiAgICAgICAgdmFyIGlkID0ganNvbk9iai5fX2lkX187XG4gICAgICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YXIgdXVpZCA9IGpzb25PYmouX191dWlkX187XG4gICAgICAgICAgICBpZiAodXVpZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzdWx0LnB1c2gob2JqLCBwcm9wTmFtZSwgdXVpZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SIHx8IENDX1RFU1QpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BOYW1lXSA9IHRoaXMuX2Rlc2VyaWFsaXplT2JqZWN0KGpzb25PYmosIG9iaiwgcHJvcE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BOYW1lXSA9IHRoaXMuX2Rlc2VyaWFsaXplT2JqZWN0KGpzb25PYmopO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBkT2JqID0gdGhpcy5kZXNlcmlhbGl6ZWRMaXN0W2lkXTtcbiAgICAgICAgICAgIGlmIChkT2JqKSB7XG4gICAgICAgICAgICAgICAgb2JqW3Byb3BOYW1lXSA9IGRPYmo7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pZExpc3QucHVzaChpZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5faWRPYmpMaXN0LnB1c2gob2JqKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9pZFByb3BMaXN0LnB1c2gocHJvcE5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHByb3RvdHlwZS5fZGVzZXJpYWxpemVQcmltaXRpdmVPYmplY3QgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIHNlcmlhbGl6ZWQpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcE5hbWUgaW4gc2VyaWFsaXplZCkge1xuICAgICAgICAgICAgaWYgKHNlcmlhbGl6ZWQuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHByb3AgPSBzZXJpYWxpemVkW3Byb3BOYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHByb3AgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wTmFtZSAhPT0gJ19fdHlwZV9fJy8qICYmIGsgIT0gJ19faWRfXycqLykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2VbcHJvcE5hbWVdID0gcHJvcDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpc0Fzc2V0VHlwZSA9IHRoaXMuX2Rlc2VyaWFsaXplT2JqRmllbGQoaW5zdGFuY2UsIHByb3AsIHByb3BOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0Fzc2V0VHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpbGwgZGVmYXVsdCB2YWx1ZSBmb3IgcHJpbWl0aXZlIG9iamVjdHMgKG5vIGNvbnN0cnVjdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbmNlW3Byb3BOYW1lXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZVtwcm9wTmFtZV0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gZnVuY3Rpb24gX2NvbXBpbGVUeXBlZE9iamVjdCAoYWNjZXNzb3IsIGtsYXNzLCBjdG9yQ29kZSkge1xuICAgIC8vICAgICBpZiAoa2xhc3MgPT09IGNjLlZlYzIpIHtcbiAgICAvLyAgICAgICAgIHJldHVybiBge2AgK1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgYG8ke2FjY2Vzc29yfS54PXByb3AueHx8MDtgICtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGBvJHthY2Nlc3Nvcn0ueT1wcm9wLnl8fDA7YCArXG4gICAgLy8gICAgICAgICAgICAgICAgYH1gO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIGVsc2UgaWYgKGtsYXNzID09PSBjYy5Db2xvcikge1xuICAgIC8vICAgICAgICAgcmV0dXJuIGB7YCArXG4gICAgLy8gICAgICAgICAgICAgICAgICAgIGBvJHthY2Nlc3Nvcn0ucj1wcm9wLnJ8fDA7YCArXG4gICAgLy8gICAgICAgICAgICAgICAgICAgIGBvJHthY2Nlc3Nvcn0uZz1wcm9wLmd8fDA7YCArXG4gICAgLy8gICAgICAgICAgICAgICAgICAgIGBvJHthY2Nlc3Nvcn0uYj1wcm9wLmJ8fDA7YCArXG4gICAgLy8gICAgICAgICAgICAgICAgICAgIGBvJHthY2Nlc3Nvcn0uYT0ocHJvcC5hPT09dW5kZWZpbmVkPzI1NTpwcm9wLmEpO2AgK1xuICAgIC8vICAgICAgICAgICAgICAgIGB9YDtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICBlbHNlIGlmIChrbGFzcyA9PT0gY2MuU2l6ZSkge1xuICAgIC8vICAgICAgICAgcmV0dXJuIGB7YCArXG4gICAgLy8gICAgICAgICAgICAgICAgICAgIGBvJHthY2Nlc3Nvcn0ud2lkdGg9cHJvcC53aWR0aHx8MDtgICtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgYG8ke2FjY2Vzc29yfS5oZWlnaHQ9cHJvcC5oZWlnaHR8fDA7YCArXG4gICAgLy8gICAgICAgICAgICAgICAgYH1gO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIGVsc2Uge1xuICAgIC8vICAgICAgICAgcmV0dXJuIGBzLl9kZXNlcmlhbGl6ZVR5cGVkT2JqZWN0KG8ke2FjY2Vzc29yfSxwcm9wLCR7Y3RvckNvZGV9KTtgO1xuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG4gICAgLy8gZGVzZXJpYWxpemUgVmFsdWVUeXBlXG4gICAgcHJvdG90eXBlLl9kZXNlcmlhbGl6ZVR5cGVkT2JqZWN0ID0gZnVuY3Rpb24gKGluc3RhbmNlLCBzZXJpYWxpemVkLCBrbGFzcykge1xuICAgICAgICBpZiAoa2xhc3MgPT09IGNjLlZlYzIpIHtcbiAgICAgICAgICAgIGluc3RhbmNlLnggPSBzZXJpYWxpemVkLnggfHwgMDtcbiAgICAgICAgICAgIGluc3RhbmNlLnkgPSBzZXJpYWxpemVkLnkgfHwgMDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChrbGFzcyA9PT0gY2MuVmVjMykge1xuICAgICAgICAgICAgaW5zdGFuY2UueCA9IHNlcmlhbGl6ZWQueCB8fCAwO1xuICAgICAgICAgICAgaW5zdGFuY2UueSA9IHNlcmlhbGl6ZWQueSB8fCAwO1xuICAgICAgICAgICAgaW5zdGFuY2UueiA9IHNlcmlhbGl6ZWQueiB8fCAwO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGtsYXNzID09PSBjYy5Db2xvcikge1xuICAgICAgICAgICAgaW5zdGFuY2UuciA9IHNlcmlhbGl6ZWQuciB8fCAwO1xuICAgICAgICAgICAgaW5zdGFuY2UuZyA9IHNlcmlhbGl6ZWQuZyB8fCAwO1xuICAgICAgICAgICAgaW5zdGFuY2UuYiA9IHNlcmlhbGl6ZWQuYiB8fCAwO1xuICAgICAgICAgICAgdmFyIGEgPSBzZXJpYWxpemVkLmE7XG4gICAgICAgICAgICBpbnN0YW5jZS5hID0gKGEgPT09IHVuZGVmaW5lZCA/IDI1NSA6IGEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGtsYXNzID09PSBjYy5TaXplKSB7XG4gICAgICAgICAgICBpbnN0YW5jZS53aWR0aCA9IHNlcmlhbGl6ZWQud2lkdGggfHwgMDtcbiAgICAgICAgICAgIGluc3RhbmNlLmhlaWdodCA9IHNlcmlhbGl6ZWQuaGVpZ2h0IHx8IDA7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgREVGQVVMVCA9IEF0dHIuREVMSU1FVEVSICsgJ2RlZmF1bHQnO1xuICAgICAgICB2YXIgYXR0cnMgPSBBdHRyLmdldENsYXNzQXR0cnMoa2xhc3MpO1xuICAgICAgICB2YXIgZmFzdERlZmluZWRQcm9wcyA9IGtsYXNzLl9fcHJvcHNfXyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGluc3RhbmNlKTsgICAgLy8g6YGN5Y6GIGluc3RhbmNl77yM5aaC5p6c5YW35pyJ57G75Z6L77yM5omN5LiN5Lya5oqKIF9fdHlwZV9fIOS5n+ivu+i/m+adpVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZhc3REZWZpbmVkUHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwcm9wTmFtZSA9IGZhc3REZWZpbmVkUHJvcHNbaV07XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBzZXJpYWxpemVkW3Byb3BOYW1lXTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8ICFzZXJpYWxpemVkLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgICAgICAgICAgIC8vIG5vdCBzZXJpYWxpemVkLFxuICAgICAgICAgICAgICAgIC8vIHJlY292ZXIgdG8gZGVmYXVsdCB2YWx1ZSBpbiBWYWx1ZVR5cGUsIGJlY2F1c2UgZWxpbWluYXRlZCBwcm9wZXJ0aWVzIGVxdWFscyB0b1xuICAgICAgICAgICAgICAgIC8vIGl0cyBkZWZhdWx0IHZhbHVlIGluIFZhbHVlVHlwZSwgbm90IGRlZmF1bHQgdmFsdWUgaW4gdXNlciBjbGFzc1xuICAgICAgICAgICAgICAgIHZhbHVlID0gQ0NDbGFzcy5nZXREZWZhdWx0KGF0dHJzW3Byb3BOYW1lICsgREVGQVVMVF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlW3Byb3BOYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZXNlcmlhbGl6ZU9iakZpZWxkKGluc3RhbmNlLCB2YWx1ZSwgcHJvcE5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2VbcHJvcE5hbWVdID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBjb21waWxlT2JqZWN0VHlwZUppdCAoc291cmNlcywgZGVmYXVsdFZhbHVlLCBhY2Nlc3NvclRvU2V0LCBwcm9wTmFtZUxpdGVyYWxUb1NldCwgYXNzdW1lSGF2ZVByb3BJZklzVmFsdWUpIHtcbiAgICAgICAgaWYgKGRlZmF1bHRWYWx1ZSBpbnN0YW5jZW9mIGNjLlZhbHVlVHlwZSkge1xuICAgICAgICAgICAgLy8gZmFzdCBjYXNlXG4gICAgICAgICAgICBpZiAoIWFzc3VtZUhhdmVQcm9wSWZJc1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgc291cmNlcy5wdXNoKCdpZihwcm9wKXsnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjdG9yQ29kZSA9IGpzLmdldENsYXNzTmFtZShkZWZhdWx0VmFsdWUpO1xuICAgICAgICAgICAgc291cmNlcy5wdXNoKGBzLl9kZXNlcmlhbGl6ZVR5cGVkT2JqZWN0KG8ke2FjY2Vzc29yVG9TZXR9LHByb3AsJHtjdG9yQ29kZX0pO2ApO1xuICAgICAgICAgICAgaWYgKCFhc3N1bWVIYXZlUHJvcElmSXNWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHNvdXJjZXMucHVzaCgnfWVsc2UgbycgKyBhY2Nlc3NvclRvU2V0ICsgJz1udWxsOycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc291cmNlcy5wdXNoKCdpZihwcm9wKXsnKTtcbiAgICAgICAgICAgICAgICBzb3VyY2VzLnB1c2goJ3MuX2Rlc2VyaWFsaXplT2JqRmllbGQobyxwcm9wLCcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcE5hbWVMaXRlcmFsVG9TZXQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnKTsnKTtcbiAgICAgICAgICAgIHNvdXJjZXMucHVzaCgnfWVsc2UgbycgKyBhY2Nlc3NvclRvU2V0ICsgJz1udWxsOycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGNvbXBpbGVEZXNlcmlhbGl6ZSA9IENDX1NVUFBPUlRfSklUID8gZnVuY3Rpb24gKHNlbGYsIGtsYXNzKSB7XG4gICAgICAgIHZhciBUWVBFID0gQXR0ci5ERUxJTUVURVIgKyAndHlwZSc7XG4gICAgICAgIHZhciBFRElUT1JfT05MWSA9IEF0dHIuREVMSU1FVEVSICsgJ2VkaXRvck9ubHknO1xuICAgICAgICB2YXIgREVGQVVMVCA9IEF0dHIuREVMSU1FVEVSICsgJ2RlZmF1bHQnO1xuICAgICAgICB2YXIgRk9STUVSTFlfU0VSSUFMSVpFRF9BUyA9IEF0dHIuREVMSU1FVEVSICsgJ2Zvcm1lcmx5U2VyaWFsaXplZEFzJztcbiAgICAgICAgdmFyIGF0dHJzID0gQXR0ci5nZXRDbGFzc0F0dHJzKGtsYXNzKTtcblxuICAgICAgICB2YXIgcHJvcHMgPSBrbGFzcy5fX3ZhbHVlc19fO1xuICAgICAgICAvLyBzZWxmLCBvYmosIHNlcmlhbGl6ZWREYXRhLCBrbGFzc1xuICAgICAgICB2YXIgc291cmNlcyA9IFtcbiAgICAgICAgICAgICd2YXIgcHJvcDsnXG4gICAgICAgIF07XG4gICAgICAgIHZhciBmYXN0TW9kZSA9IG1pc2MuQlVJTFRJTl9DTEFTU0lEX1JFLnRlc3QoanMuX2dldENsYXNzSWQoa2xhc3MpKTtcbiAgICAgICAgLy8gc291cmNlcy5wdXNoKCd2YXIgdmIsdm4sdnMsdm8sdnUsdmY7Jyk7ICAgIC8vIGJvb2xlYW4sIG51bWJlciwgc3RyaW5nLCBvYmplY3QsIHVuZGVmaW5lZCwgZnVuY3Rpb25cbiAgICAgICAgZm9yICh2YXIgcCA9IDA7IHAgPCBwcm9wcy5sZW5ndGg7IHArKykge1xuICAgICAgICAgICAgdmFyIHByb3BOYW1lID0gcHJvcHNbcF07XG4gICAgICAgICAgICBpZiAoKENDX1BSRVZJRVcgfHwgKENDX0VESVRPUiAmJiBzZWxmLl9pZ25vcmVFZGl0b3JPbmx5KSkgJiYgYXR0cnNbcHJvcE5hbWUgKyBFRElUT1JfT05MWV0pIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTsgICAvLyBza2lwIGVkaXRvciBvbmx5IGlmIGluIHByZXZpZXdcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGFjY2Vzc29yVG9TZXQsIHByb3BOYW1lTGl0ZXJhbFRvU2V0O1xuICAgICAgICAgICAgaWYgKENDQ2xhc3MuSURFTlRJRklFUl9SRS50ZXN0KHByb3BOYW1lKSkge1xuICAgICAgICAgICAgICAgIHByb3BOYW1lTGl0ZXJhbFRvU2V0ID0gJ1wiJyArIHByb3BOYW1lICsgJ1wiJztcbiAgICAgICAgICAgICAgICBhY2Nlc3NvclRvU2V0ID0gJy4nICsgcHJvcE5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcm9wTmFtZUxpdGVyYWxUb1NldCA9IENDQ2xhc3MuZXNjYXBlRm9ySlMocHJvcE5hbWUpO1xuICAgICAgICAgICAgICAgIGFjY2Vzc29yVG9TZXQgPSAnWycgKyBwcm9wTmFtZUxpdGVyYWxUb1NldCArICddJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGFjY2Vzc29yVG9HZXQgPSBhY2Nlc3NvclRvU2V0O1xuICAgICAgICAgICAgaWYgKGF0dHJzW3Byb3BOYW1lICsgRk9STUVSTFlfU0VSSUFMSVpFRF9BU10pIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcE5hbWVUb1JlYWQgPSBhdHRyc1twcm9wTmFtZSArIEZPUk1FUkxZX1NFUklBTElaRURfQVNdO1xuICAgICAgICAgICAgICAgIGlmIChDQ0NsYXNzLklERU5USUZJRVJfUkUudGVzdChwcm9wTmFtZVRvUmVhZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzb3JUb0dldCA9ICcuJyArIHByb3BOYW1lVG9SZWFkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzb3JUb0dldCA9ICdbJyArIENDQ2xhc3MuZXNjYXBlRm9ySlMocHJvcE5hbWVUb1JlYWQpICsgJ10nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc291cmNlcy5wdXNoKCdwcm9wPWQnICsgYWNjZXNzb3JUb0dldCArICc7Jyk7XG4gICAgICAgICAgICBzb3VyY2VzLnB1c2goYGlmKHR5cGVvZiAke0NDX0pTQiB8fCBDQ19SVU5USU1FID8gJyhwcm9wKScgOiAncHJvcCd9IT09XCJ1bmRlZmluZWRcIil7YCk7XG5cbiAgICAgICAgICAgIC8vIGZ1bmN0aW9uIHVuZGVmaW5lZCBvYmplY3QobnVsbCkgc3RyaW5nIGJvb2xlYW4gbnVtYmVyXG4gICAgICAgICAgICB2YXIgZGVmYXVsdFZhbHVlID0gQ0NDbGFzcy5nZXREZWZhdWx0KGF0dHJzW3Byb3BOYW1lICsgREVGQVVMVF0pO1xuICAgICAgICAgICAgaWYgKGZhc3RNb2RlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlzUHJpbWl0aXZlVHlwZTtcbiAgICAgICAgICAgICAgICB2YXIgdXNlclR5cGUgPSBhdHRyc1twcm9wTmFtZSArIFRZUEVdO1xuICAgICAgICAgICAgICAgIGlmIChkZWZhdWx0VmFsdWUgPT09IHVuZGVmaW5lZCAmJiB1c2VyVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBpc1ByaW1pdGl2ZVR5cGUgPSB1c2VyVHlwZSBpbnN0YW5jZW9mIEF0dHIuUHJpbWl0aXZlVHlwZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkZWZhdWx0VHlwZSA9IHR5cGVvZiBkZWZhdWx0VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGlzUHJpbWl0aXZlVHlwZSA9IGRlZmF1bHRUeXBlID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VHlwZSA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFR5cGUgPT09ICdib29sZWFuJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNQcmltaXRpdmVUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZXMucHVzaChgbyR7YWNjZXNzb3JUb1NldH09cHJvcDtgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBpbGVPYmplY3RUeXBlSml0KHNvdXJjZXMsIGRlZmF1bHRWYWx1ZSwgYWNjZXNzb3JUb1NldCwgcHJvcE5hbWVMaXRlcmFsVG9TZXQsIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNvdXJjZXMucHVzaChgaWYodHlwZW9mICR7Q0NfSlNCIHx8IENDX1JVTlRJTUUgPyAnKHByb3ApJyA6ICdwcm9wJ30hPT1cIm9iamVjdFwiKXtgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdvJyArIGFjY2Vzc29yVG9TZXQgKyAnPXByb3A7JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICd9ZWxzZXsnKTtcbiAgICAgICAgICAgICAgICBjb21waWxlT2JqZWN0VHlwZUppdChzb3VyY2VzLCBkZWZhdWx0VmFsdWUsIGFjY2Vzc29yVG9TZXQsIHByb3BOYW1lTGl0ZXJhbFRvU2V0LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgc291cmNlcy5wdXNoKCd9Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzb3VyY2VzLnB1c2goJ30nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2MuanMuaXNDaGlsZENsYXNzT2Yoa2xhc3MsIGNjLl9CYXNlTm9kZSkgfHwgY2MuanMuaXNDaGlsZENsYXNzT2Yoa2xhc3MsIGNjLkNvbXBvbmVudCkpIHtcbiAgICAgICAgICAgIGlmIChDQ19QUkVWSUVXIHx8IChDQ19FRElUT1IgJiYgc2VsZi5faWdub3JlRWRpdG9yT25seSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF5VXNlZEluUGVyc2lzdFJvb3QgPSBqcy5pc0NoaWxkQ2xhc3NPZihrbGFzcywgY2MuTm9kZSk7XG4gICAgICAgICAgICAgICAgaWYgKG1heVVzZWRJblBlcnNpc3RSb290KSB7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZXMucHVzaCgnZC5faWQmJihvLl9pZD1kLl9pZCk7Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc291cmNlcy5wdXNoKCdkLl9pZCYmKG8uX2lkPWQuX2lkKTsnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcHNbcHJvcHMubGVuZ3RoIC0gMV0gPT09ICdfJGVyaWFsaXplZCcpIHtcbiAgICAgICAgICAgIC8vIGRlZXAgY29weSBvcmlnaW5hbCBzZXJpYWxpemVkIGRhdGFcbiAgICAgICAgICAgIHNvdXJjZXMucHVzaCgnby5fJGVyaWFsaXplZD1KU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGQpKTsnKTtcbiAgICAgICAgICAgIC8vIHBhcnNlIHRoZSBzZXJpYWxpemVkIGRhdGEgYXMgcHJpbWl0aXZlIGphdmFzY3JpcHQgb2JqZWN0LCBzbyBpdHMgX19pZF9fIHdpbGwgYmUgZGVyZWZlcmVuY2VkXG4gICAgICAgICAgICBzb3VyY2VzLnB1c2goJ3MuX2Rlc2VyaWFsaXplUHJpbWl0aXZlT2JqZWN0KG8uXyRlcmlhbGl6ZWQsZCk7Jyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEZ1bmN0aW9uKCdzJywgJ28nLCAnZCcsICdrJywgc291cmNlcy5qb2luKCcnKSk7XG4gICAgfSA6IGZ1bmN0aW9uIChzZWxmLCBrbGFzcykge1xuICAgICAgICB2YXIgZmFzdE1vZGUgPSBtaXNjLkJVSUxUSU5fQ0xBU1NJRF9SRS50ZXN0KGpzLl9nZXRDbGFzc0lkKGtsYXNzKSk7XG4gICAgICAgIHZhciBzaG91bGRDb3B5SWQgPSBjYy5qcy5pc0NoaWxkQ2xhc3NPZihrbGFzcywgY2MuX0Jhc2VOb2RlKSB8fCBjYy5qcy5pc0NoaWxkQ2xhc3NPZihrbGFzcywgY2MuQ29tcG9uZW50KTtcbiAgICAgICAgdmFyIHNob3VsZENvcHlSYXdEYXRhO1xuXG4gICAgICAgIHZhciBzaW1wbGVQcm9wcyA9IFtdO1xuICAgICAgICB2YXIgc2ltcGxlUHJvcHNUb1JlYWQgPSBzaW1wbGVQcm9wcztcbiAgICAgICAgdmFyIGFkdmFuY2VkUHJvcHMgPSBbXTtcbiAgICAgICAgdmFyIGFkdmFuY2VkUHJvcHNUb1JlYWQgPSBhZHZhbmNlZFByb3BzO1xuICAgICAgICB2YXIgYWR2YW5jZWRQcm9wc1ZhbHVlVHlwZSA9IFtdO1xuXG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcHJvcHMgPSBrbGFzcy5fX3ZhbHVlc19fO1xuICAgICAgICAgICAgc2hvdWxkQ29weVJhd0RhdGEgPSBwcm9wc1twcm9wcy5sZW5ndGggLSAxXSA9PT0gJ18kZXJpYWxpemVkJztcblxuICAgICAgICAgICAgdmFyIGF0dHJzID0gQXR0ci5nZXRDbGFzc0F0dHJzKGtsYXNzKTtcbiAgICAgICAgICAgIHZhciBUWVBFID0gQXR0ci5ERUxJTUVURVIgKyAndHlwZSc7XG4gICAgICAgICAgICB2YXIgREVGQVVMVCA9IEF0dHIuREVMSU1FVEVSICsgJ2RlZmF1bHQnO1xuICAgICAgICAgICAgdmFyIEZPUk1FUkxZX1NFUklBTElaRURfQVMgPSBBdHRyLkRFTElNRVRFUiArICdmb3JtZXJseVNlcmlhbGl6ZWRBcyc7XG5cbiAgICAgICAgICAgIGZvciAodmFyIHAgPSAwOyBwIDwgcHJvcHMubGVuZ3RoOyBwKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcE5hbWUgPSBwcm9wc1twXTtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcE5hbWVUb1JlYWQgPSBwcm9wTmFtZTtcbiAgICAgICAgICAgICAgICBpZiAoYXR0cnNbcHJvcE5hbWUgKyBGT1JNRVJMWV9TRVJJQUxJWkVEX0FTXSkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wTmFtZVRvUmVhZCA9IGF0dHJzW3Byb3BOYW1lICsgRk9STUVSTFlfU0VSSUFMSVpFRF9BU107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGZ1bmN0aW9uIHVuZGVmaW5lZCBvYmplY3QobnVsbCkgc3RyaW5nIGJvb2xlYW4gbnVtYmVyXG4gICAgICAgICAgICAgICAgdmFyIGRlZmF1bHRWYWx1ZSA9IENDQ2xhc3MuZ2V0RGVmYXVsdChhdHRyc1twcm9wTmFtZSArIERFRkFVTFRdKTtcbiAgICAgICAgICAgICAgICB2YXIgaXNQcmltaXRpdmVUeXBlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKGZhc3RNb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB1c2VyVHlwZSA9IGF0dHJzW3Byb3BOYW1lICsgVFlQRV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWZhdWx0VmFsdWUgPT09IHVuZGVmaW5lZCAmJiB1c2VyVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNQcmltaXRpdmVUeXBlID0gdXNlclR5cGUgaW5zdGFuY2VvZiBBdHRyLlByaW1pdGl2ZVR5cGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVmYXVsdFR5cGUgPSB0eXBlb2YgZGVmYXVsdFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNQcmltaXRpdmVUeXBlID0gZGVmYXVsdFR5cGUgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VHlwZSA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRUeXBlID09PSAnYm9vbGVhbic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGZhc3RNb2RlICYmIGlzUHJpbWl0aXZlVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcE5hbWVUb1JlYWQgIT09IHByb3BOYW1lICYmIHNpbXBsZVByb3BzVG9SZWFkID09PSBzaW1wbGVQcm9wcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2ltcGxlUHJvcHNUb1JlYWQgPSBzaW1wbGVQcm9wcy5zbGljZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNpbXBsZVByb3BzLnB1c2gocHJvcE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2ltcGxlUHJvcHNUb1JlYWQgIT09IHNpbXBsZVByb3BzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaW1wbGVQcm9wc1RvUmVhZC5wdXNoKHByb3BOYW1lVG9SZWFkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BOYW1lVG9SZWFkICE9PSBwcm9wTmFtZSAmJiBhZHZhbmNlZFByb3BzVG9SZWFkID09PSBhZHZhbmNlZFByb3BzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZHZhbmNlZFByb3BzVG9SZWFkID0gYWR2YW5jZWRQcm9wcy5zbGljZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGFkdmFuY2VkUHJvcHMucHVzaChwcm9wTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhZHZhbmNlZFByb3BzVG9SZWFkICE9PSBhZHZhbmNlZFByb3BzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZHZhbmNlZFByb3BzVG9SZWFkLnB1c2gocHJvcE5hbWVUb1JlYWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGFkdmFuY2VkUHJvcHNWYWx1ZVR5cGUucHVzaCgoZGVmYXVsdFZhbHVlIGluc3RhbmNlb2YgY2MuVmFsdWVUeXBlKSAmJiBkZWZhdWx0VmFsdWUuY29uc3RydWN0b3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkoKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHMsIG8sIGQsIGspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2ltcGxlUHJvcHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBsZXQgcHJvcCA9IGRbc2ltcGxlUHJvcHNUb1JlYWRbaV1dO1xuICAgICAgICAgICAgICAgIGlmIChwcm9wICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgb1tzaW1wbGVQcm9wc1tpXV0gPSBwcm9wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWR2YW5jZWRQcm9wcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGxldCBwcm9wTmFtZSA9IGFkdmFuY2VkUHJvcHNbaV07XG4gICAgICAgICAgICAgICAgdmFyIHByb3AgPSBkW2FkdmFuY2VkUHJvcHNUb1JlYWRbaV1dO1xuICAgICAgICAgICAgICAgIGlmIChwcm9wID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghZmFzdE1vZGUgJiYgdHlwZW9mIHByb3AgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIG9bcHJvcE5hbWVdID0gcHJvcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZhc3RNb2RlIChzbyB3aWxsIG5vdCBzaW1wbGVQcm9wKSBvciBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlVHlwZUN0b3IgPSBhZHZhbmNlZFByb3BzVmFsdWVUeXBlW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWVUeXBlQ3Rvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZhc3RNb2RlIHx8IHByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzLl9kZXNlcmlhbGl6ZVR5cGVkT2JqZWN0KG9bcHJvcE5hbWVdLCBwcm9wLCB2YWx1ZVR5cGVDdG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9bcHJvcE5hbWVdID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcy5fZGVzZXJpYWxpemVPYmpGaWVsZChvLCBwcm9wLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvW3Byb3BOYW1lXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2hvdWxkQ29weUlkICYmIGQuX2lkKSB7XG4gICAgICAgICAgICAgICAgby5faWQgPSBkLl9pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzaG91bGRDb3B5UmF3RGF0YSkge1xuICAgICAgICAgICAgICAgIC8vIGRlZXAgY29weSBvcmlnaW5hbCBzZXJpYWxpemVkIGRhdGFcbiAgICAgICAgICAgICAgICBvLl8kZXJpYWxpemVkID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkKSk7XG4gICAgICAgICAgICAgICAgLy8gcGFyc2UgdGhlIHNlcmlhbGl6ZWQgZGF0YSBhcyBwcmltaXRpdmUgamF2YXNjcmlwdCBvYmplY3QsIHNvIGl0cyBfX2lkX18gd2lsbCBiZSBkZXJlZmVyZW5jZWRcbiAgICAgICAgICAgICAgICBzLl9kZXNlcmlhbGl6ZVByaW1pdGl2ZU9iamVjdChvLl8kZXJpYWxpemVkLCBkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiB1bmxpbmtVbnVzZWRQcmVmYWIgKHNlbGYsIHNlcmlhbGl6ZWQsIG9iaikge1xuICAgICAgICB2YXIgdXVpZCA9IHNlcmlhbGl6ZWRbJ2Fzc2V0J10gJiYgc2VyaWFsaXplZFsnYXNzZXQnXS5fX3V1aWRfXztcbiAgICAgICAgaWYgKHV1aWQpIHtcbiAgICAgICAgICAgIHZhciBsYXN0ID0gc2VsZi5yZXN1bHQudXVpZExpc3QubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIGlmIChzZWxmLnJlc3VsdC51dWlkTGlzdFtsYXN0XSA9PT0gdXVpZCAmJlxuICAgICAgICAgICAgICAgIHNlbGYucmVzdWx0LnV1aWRPYmpMaXN0W2xhc3RdID09PSBvYmogJiZcbiAgICAgICAgICAgICAgICBzZWxmLnJlc3VsdC51dWlkUHJvcExpc3RbbGFzdF0gPT09ICdhc3NldCcpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnJlc3VsdC51dWlkTGlzdC5wb3AoKTtcbiAgICAgICAgICAgICAgICBzZWxmLnJlc3VsdC51dWlkT2JqTGlzdC5wb3AoKTtcbiAgICAgICAgICAgICAgICBzZWxmLnJlc3VsdC51dWlkUHJvcExpc3QucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVidWdFbnZPbmx5SW5mbyA9ICdGYWlsZWQgdG8gc2tpcCBwcmVmYWIgYXNzZXQgd2hpbGUgZGVzZXJpYWxpemluZyBQcmVmYWJJbmZvJztcbiAgICAgICAgICAgICAgICBjYy53YXJuKGRlYnVnRW52T25seUluZm8pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2Rlc2VyaWFsaXplRmlyZUNsYXNzIChzZWxmLCBvYmosIHNlcmlhbGl6ZWQsIGtsYXNzKSB7XG4gICAgICAgIHZhciBkZXNlcmlhbGl6ZTtcbiAgICAgICAgaWYgKGtsYXNzLmhhc093blByb3BlcnR5KCdfX2Rlc2VyaWFsaXplX18nKSkge1xuICAgICAgICAgICAgZGVzZXJpYWxpemUgPSBrbGFzcy5fX2Rlc2VyaWFsaXplX187XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkZXNlcmlhbGl6ZSA9IGNvbXBpbGVEZXNlcmlhbGl6ZShzZWxmLCBrbGFzcyk7XG4gICAgICAgICAgICAvLyBpZiAoQ0NfVEVTVCAmJiAhaXNQaGFudG9tSlMpIHtcbiAgICAgICAgICAgIC8vICAgICBjYy5sb2coZGVzZXJpYWxpemUpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAganMudmFsdWUoa2xhc3MsICdfX2Rlc2VyaWFsaXplX18nLCBkZXNlcmlhbGl6ZSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZGVzZXJpYWxpemUoc2VsZiwgb2JqLCBzZXJpYWxpemVkLCBrbGFzcyk7XG4gICAgICAgIC8vIGlmIHByZXZpZXcgb3IgYnVpbGQgd29ya2VyXG4gICAgICAgIGlmIChDQ19QUkVWSUVXIHx8IChDQ19FRElUT1IgJiYgc2VsZi5faWdub3JlRWRpdG9yT25seSkpIHtcbiAgICAgICAgICAgIGlmIChrbGFzcyA9PT0gY2MuX1ByZWZhYkluZm8gJiYgIW9iai5zeW5jKSB7XG4gICAgICAgICAgICAgICAgdW5saW5rVW51c2VkUHJlZmFiKHNlbGYsIHNlcmlhbGl6ZWQsIG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfRGVzZXJpYWxpemVyLnBvb2wgPSBuZXcganMuUG9vbChmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIG9iai5yZXN1bHQgPSBudWxsO1xuICAgICAgICBvYmouY3VzdG9tRW52ID0gbnVsbDtcbiAgICAgICAgb2JqLmRlc2VyaWFsaXplZExpc3QubGVuZ3RoID0gMDtcbiAgICAgICAgb2JqLmRlc2VyaWFsaXplZERhdGEgPSBudWxsO1xuICAgICAgICBvYmouX2NsYXNzRmluZGVyID0gbnVsbDtcbiAgICAgICAgb2JqLl9pZExpc3QubGVuZ3RoID0gMDtcbiAgICAgICAgb2JqLl9pZE9iakxpc3QubGVuZ3RoID0gMDtcbiAgICAgICAgb2JqLl9pZFByb3BMaXN0Lmxlbmd0aCA9IDA7XG4gICAgfSwgMSk7XG5cbiAgICBfRGVzZXJpYWxpemVyLnBvb2wuZ2V0ID0gZnVuY3Rpb24gKHJlc3VsdCwgY2xhc3NGaW5kZXIsIGN1c3RvbUVudiwgaWdub3JlRWRpdG9yT25seSkge1xuICAgICAgICB2YXIgY2FjaGUgPSB0aGlzLl9nZXQoKTtcbiAgICAgICAgaWYgKGNhY2hlKSB7XG4gICAgICAgICAgICBjYWNoZS5yZXN1bHQgPSByZXN1bHQ7XG4gICAgICAgICAgICBjYWNoZS5jdXN0b21FbnYgPSBjdXN0b21FbnY7XG4gICAgICAgICAgICBjYWNoZS5fY2xhc3NGaW5kZXIgPSBjbGFzc0ZpbmRlcjtcbiAgICAgICAgICAgIGlmICghQ0NfQlVJTEQpIHtcbiAgICAgICAgICAgICAgICBjYWNoZS5faWdub3JlRWRpdG9yT25seSA9IGlnbm9yZUVkaXRvck9ubHk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2FjaGU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IF9EZXNlcmlhbGl6ZXIocmVzdWx0LCBjbGFzc0ZpbmRlciwgY3VzdG9tRW52LCBpZ25vcmVFZGl0b3JPbmx5KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gX0Rlc2VyaWFsaXplcjtcbn0pKCk7XG5cbi8qKlxuICogQG1vZHVsZSBjY1xuICovXG5cbi8qKlxuICogISNlbiBEZXNlcmlhbGl6ZSBqc29uIHRvIGNjLkFzc2V0XG4gKiAhI3poIOWwhiBKU09OIOWPjeW6j+WIl+WMluS4uuWvueixoeWunuS+i+OAglxuICpcbiAqIEBtZXRob2QgZGVzZXJpYWxpemVcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gZGF0YSAtIHRoZSBzZXJpYWxpemVkIGNjLkFzc2V0IGpzb24gc3RyaW5nIG9yIGpzb24gb2JqZWN0LlxuICogQHBhcmFtIHtEZXRhaWxzfSBbZGV0YWlsc10gLSBhZGRpdGlvbmFsIGxvYWRpbmcgcmVzdWx0XG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcmV0dXJuIHtvYmplY3R9IHRoZSBtYWluIGRhdGEoYXNzZXQpXG4gKi9cbmxldCBkZXNlcmlhbGl6ZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGRhdGEsIGRldGFpbHMsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgY2xhc3NGaW5kZXIgPSBvcHRpb25zLmNsYXNzRmluZGVyIHx8IGpzLl9nZXRDbGFzc0J5SWQ7XG4gICAgLy8g5ZCv55SoIGNyZWF0ZUFzc2V0UmVmcyDlkI7vvIzlpoLmnpzmnIkgdXJsIOWxnuaAp+WImeS8muiiq+e7n+S4gOW8uuWItuiuvue9ruS4uiB7IHV1aWQ6ICd4eHgnIH3vvIzlv4XpobvlkI7pnaLlho3nibnmrorlpITnkIZcbiAgICB2YXIgY3JlYXRlQXNzZXRSZWZzID0gb3B0aW9ucy5jcmVhdGVBc3NldFJlZnMgfHwgY2Muc3lzLnBsYXRmb3JtID09PSBjYy5zeXMuRURJVE9SX0NPUkU7XG4gICAgdmFyIGN1c3RvbUVudiA9IG9wdGlvbnMuY3VzdG9tRW52O1xuICAgIHZhciBpZ25vcmVFZGl0b3JPbmx5ID0gb3B0aW9ucy5pZ25vcmVFZGl0b3JPbmx5O1xuXG4gICAgLy92YXIgb2xkSnNvbiA9IEpTT04uc3RyaW5naWZ5KGRhdGEsIG51bGwsIDIpO1xuXG4gICAgdmFyIHRlbXBEZXRhaWxzID0gIWRldGFpbHM7XG4gICAgZGV0YWlscyA9IGRldGFpbHMgfHwgRGV0YWlscy5wb29sLmdldCgpO1xuICAgIHZhciBkZXNlcmlhbGl6ZXIgPSBfRGVzZXJpYWxpemVyLnBvb2wuZ2V0KGRldGFpbHMsIGNsYXNzRmluZGVyLCBjdXN0b21FbnYsIGlnbm9yZUVkaXRvck9ubHkpO1xuXG4gICAgY2MuZ2FtZS5faXNDbG9uaW5nID0gdHJ1ZTtcbiAgICB2YXIgcmVzID0gZGVzZXJpYWxpemVyLmRlc2VyaWFsaXplKGRhdGEpO1xuICAgIGNjLmdhbWUuX2lzQ2xvbmluZyA9IGZhbHNlO1xuXG4gICAgX0Rlc2VyaWFsaXplci5wb29sLnB1dChkZXNlcmlhbGl6ZXIpO1xuICAgIGlmIChjcmVhdGVBc3NldFJlZnMpIHtcbiAgICAgICAgZGV0YWlscy5hc3NpZ25Bc3NldHNCeShFZGl0b3Iuc2VyaWFsaXplLmFzQXNzZXQpO1xuICAgIH1cbiAgICBpZiAodGVtcERldGFpbHMpIHtcbiAgICAgICAgRGV0YWlscy5wb29sLnB1dChkZXRhaWxzKTtcbiAgICB9XG5cbiAgICAvL3ZhciBhZnRlckpzb24gPSBKU09OLnN0cmluZ2lmeShkYXRhLCBudWxsLCAyKTtcbiAgICAvL2lmIChvbGRKc29uICE9PSBhZnRlckpzb24pIHtcbiAgICAvLyAgICB0aHJvdyBuZXcgRXJyb3IoJ0pTT04gU0hPVUxEIG5vdCBjaGFuZ2VkJyk7XG4gICAgLy99XG5cbiAgICByZXR1cm4gcmVzO1xufTtcblxuZGVzZXJpYWxpemUuRGV0YWlscyA9IERldGFpbHM7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==