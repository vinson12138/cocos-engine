
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/deserialize-compiled.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = deserialize;
exports.unpackJSONs = unpackJSONs;
exports.packCustomObjData = packCustomObjData;
exports.hasNativeDep = hasNativeDep;
exports.getDependUuidList = getDependUuidList;
exports.File = exports.Refs = exports.DataTypeID = void 0;

var _js = _interopRequireDefault(require("./js"));

var _vec = _interopRequireDefault(require("../value-types/vec2"));

var _vec2 = _interopRequireDefault(require("../value-types/vec3"));

var _vec3 = _interopRequireDefault(require("../value-types/vec4"));

var _color = _interopRequireDefault(require("../value-types/color"));

var _size = _interopRequireDefault(require("../value-types/size"));

var _rect = _interopRequireDefault(require("../value-types/rect"));

var _quat = _interopRequireDefault(require("../value-types/quat"));

var _mat = _interopRequireDefault(require("../value-types/mat4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/****************************************************************************
 Copyright (c) present Xiamen Yaji Software Co., Ltd.

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
// import Attr from './attribute';

/****************************************************************************
 * BUILT-IN TYPES / CONSTAINTS
 ****************************************************************************/
var SUPPORT_MIN_FORMAT_VERSION = 1;
var EMPTY_PLACEHOLDER = 0; // Used for Data.ValueType.
// If a value type is not registered in this list, it will be serialized to Data.Class.

var BuiltinValueTypes = [_vec["default"], // 0
_vec2["default"], // 1
_vec3["default"], // 2
_quat["default"], // 3
_color["default"], // 4
_size["default"], // 5
_rect["default"], // 6
_mat["default"] // 7
]; // Used for Data.ValueTypeCreated.

function BuiltinValueTypeParsers_xyzw(obj, data) {
  obj.x = data[1];
  obj.y = data[2];
  obj.z = data[3];
  obj.w = data[4];
}

var BuiltinValueTypeSetters = [function (obj, data) {
  obj.x = data[1];
  obj.y = data[2];
}, function (obj, data) {
  obj.x = data[1];
  obj.y = data[2];
  obj.z = data[3];
}, BuiltinValueTypeParsers_xyzw, // Vec4
BuiltinValueTypeParsers_xyzw, // Quat
function (obj, data) {
  obj._val = data[1];
}, function (obj, data) {
  obj.width = data[1];
  obj.height = data[2];
}, function (obj, data) {
  obj.x = data[1];
  obj.y = data[2];
  obj.width = data[3];
  obj.height = data[4];
}, function (obj, data) {
  _mat["default"].fromArray(obj, data, 1);
}];

function serializeBuiltinValueTypes(obj) {
  var ctor = obj.constructor;
  var typeId = BuiltinValueTypes.indexOf(ctor);

  switch (ctor) {
    case _vec["default"]:
      // @ts-ignore
      return [typeId, obj.x, obj.y];

    case _vec2["default"]:
      // @ts-ignore
      return [typeId, obj.x, obj.y, obj.z];

    case _vec3["default"]:
    case _quat["default"]:
      // @ts-ignore
      return [typeId, obj.x, obj.y, obj.z, obj.w];

    case _color["default"]:
      // @ts-ignore
      return [typeId, obj._val];

    case _size["default"]:
      // @ts-ignore
      return [typeId, obj.width, obj.height];

    case _rect["default"]:
      // @ts-ignore
      return [typeId, obj.x, obj.y, obj.width, obj.height];

    case _mat["default"]:
      // @ts-ignore
      var res = new Array(1 + 16);
      res[VALUETYPE_SETTER] = typeId;

      _mat["default"].toArray(res, obj, 1);

      return res;

    default:
      return null;
  }
} // // TODO: Used for Data.TypedArray.
// const TypedArrays = [
//     Float32Array,
//     Float64Array,
//
//     Int8Array,
//     Int16Array,
//     Int32Array,
//
//     Uint8Array,
//     Uint16Array,
//     Uint32Array,
//
//     Uint8ClampedArray,
//     // BigInt64Array,
//     // BigUint64Array,
// ];

/****************************************************************************
 * TYPE DECLARATIONS
 ****************************************************************************/
// Includes Bitwise NOT value.
// Both T and U have non-negative integer ranges.
// When the value >= 0 represents T
// When the value is < 0, it represents ~U. Use ~x to extract the value of U.


/*@__DROP_PURE_EXPORT__*/
var DataTypeID = {
  SimpleType: 0,
  InstanceRef: 1,
  Array_InstanceRef: 2,
  Array_AssetRefByInnerObj: 3,
  Class: 4,
  ValueTypeCreated: 5,
  AssetRefByInnerObj: 6,
  TRS: 7,
  ValueType: 8,
  Array_Class: 9,
  CustomizedClass: 10,
  Dict: 11,
  Array: 12,
  ARRAY_LENGTH: 13
};
exports.DataTypeID = DataTypeID;

/**
 * If the value type is different, different Classes will be generated
 */
var CLASS_TYPE = 0;
var CLASS_KEYS = 1;
var CLASS_PROP_TYPE_OFFSET = 2;

/**
 * Mask is used to define the properties and types that need to be deserialized.
 * Instances of the same class may have different Masks due to different default properties removed.
 */
var MASK_CLASS = 0;
var OBJ_DATA_MASK = 0;
var CUSTOM_OBJ_DATA_CLASS = 0;
var CUSTOM_OBJ_DATA_CONTENT = 1;
var VALUETYPE_SETTER = 0;
var DICT_JSON_LAYOUT = 0;
var ARRAY_ITEM_VALUES = 0;
// const TYPEDARRAY_TYPE = 0;
// const TYPEDARRAY_ELEMENTS = 1;
// export interface ITypedArrayData extends Array<number|number[]> {
//     [TYPEDARRAY_TYPE]: number,
//     [TYPEDARRAY_ELEMENTS]: number[],
// }

/*@__DROP_PURE_EXPORT__*/
var Refs = {
  EACH_RECORD_LENGTH: 3,
  OWNER_OFFSET: 0,
  KEY_OFFSET: 1,
  TARGET_OFFSET: 2
};
exports.Refs = Refs;

/*@__DROP_PURE_EXPORT__*/
var File = {
  Version: 0,
  Context: 0,
  SharedUuids: 1,
  SharedStrings: 2,
  SharedClasses: 3,
  SharedMasks: 4,
  Instances: 5,
  InstanceTypes: 6,
  Refs: 7,
  DependObjs: 8,
  DependKeys: 9,
  DependUuidIndices: 10,
  ARRAY_LENGTH: 11
}; // Main file structure

exports.File = File;
var PACKED_SECTIONS = File.Instances;

/****************************************************************************
 * IMPLEMENTS
 ****************************************************************************/

/**
 * !#en Contains meta information collected during deserialization
 * !#zh 包含反序列化后附带的元信息
 * @class Details
 */
var Details = /*#__PURE__*/function () {
  function Details() {
    this.uuidObjList = null;
    this.uuidPropList = null;
    this.uuidList = null;
  }

  var _proto = Details.prototype;

  /**
   * @method init
   * @param {Object} data
   */
  _proto.init = function init(data) {
    this.uuidObjList = data[File.DependObjs];
    this.uuidPropList = data[File.DependKeys];
    this.uuidList = data[File.DependUuidIndices];
  }
  /**
   * @method reset
   */
  ;

  _proto.reset = function reset() {
    this.uuidList = null;
    this.uuidObjList = null;
    this.uuidPropList = null;
  };

  /**
   * @method push
   * @param {Object} obj
   * @param {String} propName
   * @param {String} uuid
   */
  _proto.push = function push(obj, propName, uuid) {
    this.uuidObjList.push(obj);
    this.uuidPropList.push(propName);
    this.uuidList.push(uuid);
  };

  return Details;
}();

Details.pool = new _js["default"].Pool(function (obj) {
  obj.reset();
}, 5);

Details.pool.get = function () {
  return this._get() || new Details();
};

if (CC_EDITOR || CC_TEST) {
  // @ts-ignore
  Details.prototype.assignAssetsBy = function (getter) {
    for (var i = 0, len = this.uuidList.length; i < len; i++) {
      var obj = this.uuidObjList[i];
      var prop = this.uuidPropList[i];
      var uuid = this.uuidList[i];
      obj[prop] = getter(uuid);
    }
  };
}

function dereference(refs, instances, strings) {
  var dataLength = refs.length - 1;
  var i = 0; // owner is object

  var instanceOffset = refs[dataLength] * Refs.EACH_RECORD_LENGTH;

  for (; i < instanceOffset; i += Refs.EACH_RECORD_LENGTH) {
    var _owner = refs[i];
    var target = instances[refs[i + Refs.TARGET_OFFSET]];
    var keyIndex = refs[i + Refs.KEY_OFFSET];

    if (keyIndex >= 0) {
      _owner[strings[keyIndex]] = target;
    } else {
      _owner[~keyIndex] = target;
    }
  } // owner is instance index


  for (; i < dataLength; i += Refs.EACH_RECORD_LENGTH) {
    var _owner2 = instances[refs[i]];
    var _target = instances[refs[i + Refs.TARGET_OFFSET]];
    var _keyIndex = refs[i + Refs.KEY_OFFSET];

    if (_keyIndex >= 0) {
      _owner2[strings[_keyIndex]] = _target;
    } else {
      _owner2[~_keyIndex] = _target;
    }
  }
} //


function deserializeCCObject(data, objectData) {
  var mask = data[File.SharedMasks][objectData[OBJ_DATA_MASK]];
  var clazz = mask[MASK_CLASS];
  var ctor = clazz[CLASS_TYPE]; // if (!ctor) {
  //     return null;
  // }

  var obj = new ctor();
  var keys = clazz[CLASS_KEYS];
  var classTypeOffset = clazz[CLASS_PROP_TYPE_OFFSET];
  var maskTypeOffset = mask[mask.length - 1]; // parse simple type

  var i = MASK_CLASS + 1;

  for (; i < maskTypeOffset; ++i) {
    var _key = keys[mask[i]];
    obj[_key] = objectData[i];
  } // parse advanced type


  for (; i < objectData.length; ++i) {
    var _key2 = keys[mask[i]];
    var _type = clazz[mask[i] + classTypeOffset];
    var op = ASSIGNMENTS[_type];
    op(data, obj, _key2, objectData[i]);
  }

  return obj;
}

function deserializeCustomCCObject(data, ctor, value) {
  var obj = new ctor();

  if (obj._deserialize) {
    obj._deserialize(value, data[File.Context]);
  } else {
    cc.errorID(5303, _js["default"].getClassName(ctor));
  }

  return obj;
} // Parse Functions


function assignSimple(data, owner, key, value) {
  owner[key] = value;
}

function assignInstanceRef(data, owner, key, value) {
  if (value >= 0) {
    owner[key] = data[File.Instances][value];
  } else {
    data[File.Refs][~value * Refs.EACH_RECORD_LENGTH] = owner;
  }
}

function genArrayParser(parser) {
  return function (data, owner, key, value) {
    owner[key] = value;

    for (var i = 0; i < value.length; ++i) {
      // @ts-ignore
      parser(data, value, i, value[i]);
    }
  };
}

function parseAssetRefByInnerObj(data, owner, key, value) {
  owner[key] = null;
  data[File.DependObjs][value] = owner;
}

function parseClass(data, owner, key, value) {
  owner[key] = deserializeCCObject(data, value);
}

function parseCustomClass(data, owner, key, value) {
  var ctor = data[File.SharedClasses][value[CUSTOM_OBJ_DATA_CLASS]];
  owner[key] = deserializeCustomCCObject(data, ctor, value[CUSTOM_OBJ_DATA_CONTENT]);
}

function parseValueTypeCreated(data, owner, key, value) {
  BuiltinValueTypeSetters[value[VALUETYPE_SETTER]](owner[key], value);
}

function parseValueType(data, owner, key, value) {
  var val = new BuiltinValueTypes[value[VALUETYPE_SETTER]]();
  BuiltinValueTypeSetters[value[VALUETYPE_SETTER]](val, value);
  owner[key] = val;
}

function parseTRS(data, owner, key, value) {
  var typedArray = owner[key];
  typedArray.set(value);
}

function parseDict(data, owner, key, value) {
  var dict = value[DICT_JSON_LAYOUT];
  owner[key] = dict;

  for (var i = DICT_JSON_LAYOUT + 1; i < value.length; i += 3) {
    var _key3 = value[i];
    var _type2 = value[i + 1];
    var subValue = value[i + 2];
    var op = ASSIGNMENTS[_type2];
    op(data, dict, _key3, subValue);
  }
}

function parseArray(data, owner, key, value) {
  var array = value[ARRAY_ITEM_VALUES];
  owner[key] = array;

  for (var i = 0; i < array.length; ++i) {
    var subValue = array[i];
    var _type3 = value[i + 1];

    if (_type3 !== DataTypeID.SimpleType) {
      var op = ASSIGNMENTS[_type3]; // @ts-ignore

      op(data, array, i, subValue);
    }
  }
} // function parseTypedArray (data: IFileData, owner: any, key: string, value: ITypedArrayData) {
//     let val: ValueType = new TypedArrays[value[TYPEDARRAY_TYPE]]();
//     BuiltinValueTypeSetters[value[VALUETYPE_SETTER]](val, value);
//     // obj = new window[serialized.ctor](array.length);
//     // for (let i = 0; i < array.length; ++i) {
//     //     obj[i] = array[i];
//     // }
//     // return obj;
//     owner[key] = val;
// }


var ASSIGNMENTS = new Array(DataTypeID.ARRAY_LENGTH);
ASSIGNMENTS[DataTypeID.SimpleType] = assignSimple; // Only be used in the instances array

ASSIGNMENTS[DataTypeID.InstanceRef] = assignInstanceRef;
ASSIGNMENTS[DataTypeID.Array_InstanceRef] = genArrayParser(assignInstanceRef);
ASSIGNMENTS[DataTypeID.Array_AssetRefByInnerObj] = genArrayParser(parseAssetRefByInnerObj);
ASSIGNMENTS[DataTypeID.Class] = parseClass;
ASSIGNMENTS[DataTypeID.ValueTypeCreated] = parseValueTypeCreated;
ASSIGNMENTS[DataTypeID.AssetRefByInnerObj] = parseAssetRefByInnerObj;
ASSIGNMENTS[DataTypeID.TRS] = parseTRS;
ASSIGNMENTS[DataTypeID.ValueType] = parseValueType;
ASSIGNMENTS[DataTypeID.Array_Class] = genArrayParser(parseClass);
ASSIGNMENTS[DataTypeID.CustomizedClass] = parseCustomClass;
ASSIGNMENTS[DataTypeID.Dict] = parseDict;
ASSIGNMENTS[DataTypeID.Array] = parseArray; // ASSIGNMENTS[DataTypeID.TypedArray] = parseTypedArray;

function parseInstances(data) {
  var instances = data[File.Instances];
  var instanceTypes = data[File.InstanceTypes];
  var instanceTypesLen = instanceTypes === EMPTY_PLACEHOLDER ? 0 : instanceTypes.length;
  var rootIndex = instances[instances.length - 1];
  var normalObjectCount = instances.length - instanceTypesLen;

  if (typeof rootIndex !== 'number') {
    rootIndex = 0;
  } else {
    if (rootIndex < 0) {
      rootIndex = ~rootIndex;
    }

    --normalObjectCount;
  } // DataTypeID.Class


  var insIndex = 0;

  for (; insIndex < normalObjectCount; ++insIndex) {
    instances[insIndex] = deserializeCCObject(data, instances[insIndex]);
  }

  var classes = data[File.SharedClasses];

  for (var typeIndex = 0; typeIndex < instanceTypesLen; ++typeIndex, ++insIndex) {
    var _type4 = instanceTypes[typeIndex];
    var eachData = instances[insIndex];

    if (_type4 >= 0) {
      // class index for DataTypeID.CustomizedClass
      var ctor = classes[_type4]; // class

      instances[insIndex] = deserializeCustomCCObject(data, ctor, eachData);
    } else {
      // Other
      _type4 = ~_type4;
      var op = ASSIGNMENTS[_type4]; // @ts-ignore

      op(data, instances, insIndex, eachData);
    }
  }

  return rootIndex;
} // const DESERIALIZE_AS = Attr.DELIMETER + 'deserializeAs';
// function deserializeAs(klass: AnyCCClass, klassLayout: IClass) {
//     var attrs = Attr.getClassAttrs(klass);
//     let keys = klassLayout[CLASS_KEYS];
//     for (let i = 0; i < keys.length; ++i) {
//         let newKey = attrs[keys[i] + DESERIALIZE_AS];
//         if (newKey) {
//             // @ts-ignore
//             if (keys.includes(newKey)) {
//                 // %s cannot be deserialized by property %s because %s was also present in the serialized data.
//                 cc.warnID(, newKey, keys[i], newKey);
//             }
//             else {
//                 keys[i] = newKey;
//             }
//         }
//     }
// }


function getMissingClass(hasCustomFinder, type) {
  if (!hasCustomFinder) {
    // @ts-ignore
    deserialize.reportMissingClass(type);
  }

  return Object;
}

function doLookupClass(classFinder, type, container, index, silent, hasCustomFinder) {
  var klass = classFinder(type);

  if (!klass) {
    // if (klass.__FSA__) {
    //     deserializeAs(klass, klassLayout as IClass);
    // }
    if (silent) {
      // generate a lazy proxy for ctor
      container[index] = function (container, index, type) {
        return function proxy() {
          var klass = classFinder(type) || getMissingClass(hasCustomFinder, type);
          container[index] = klass;
          return new klass();
        };
      }(container, index, type);

      return;
    } else {
      klass = getMissingClass(hasCustomFinder, type);
    }
  }

  container[index] = klass;
}

function lookupClasses(data, silent, customFinder) {
  var classFinder = customFinder || _js["default"]._getClassById;
  var classes = data[File.SharedClasses];

  for (var i = 0; i < classes.length; ++i) {
    var klassLayout = classes[i];

    if (typeof klassLayout !== 'string') {
      if (CC_DEBUG) {
        if (typeof klassLayout[CLASS_TYPE] === 'function') {
          throw new Error('Can not deserialize the same JSON data again.');
        }
      }

      var _type5 = klassLayout[CLASS_TYPE];
      doLookupClass(classFinder, _type5, klassLayout, CLASS_TYPE, silent, customFinder);
    } else {
      doLookupClass(classFinder, klassLayout, classes, i, silent, customFinder);
    }
  }
}

function cacheMasks(data) {
  var masks = data[File.SharedMasks];

  if (masks) {
    var classes = data[File.SharedClasses];

    for (var i = 0; i < masks.length; ++i) {
      var mask = masks[i]; // @ts-ignore

      mask[MASK_CLASS] = classes[mask[MASK_CLASS]];
    }
  }
}

function parseResult(data) {
  var instances = data[File.Instances];
  var sharedStrings = data[File.SharedStrings];
  var dependSharedUuids = data[File.SharedUuids];
  var dependObjs = data[File.DependObjs];
  var dependKeys = data[File.DependKeys];
  var dependUuids = data[File.DependUuidIndices];

  for (var i = 0; i < dependObjs.length; ++i) {
    var _obj = dependObjs[i];

    if (typeof _obj === 'number') {
      dependObjs[i] = instances[_obj];
    } else {// assigned by DataTypeID.AssetRefByInnerObj or added by Details object directly in _deserialize
    }

    var _key4 = dependKeys[i];

    if (typeof _key4 === 'number') {
      if (_key4 >= 0) {
        _key4 = sharedStrings[_key4];
      } else {
        _key4 = ~_key4;
      }

      dependKeys[i] = _key4;
    } else {// added by Details object directly in _deserialize
    }

    var uuid = dependUuids[i];

    if (typeof uuid === 'number') {
      dependUuids[i] = dependSharedUuids[uuid];
    } else {// added by Details object directly in _deserialize
    }
  }
}

function deserialize(data, details, options) {
  // @ts-ignore
  if (CC_EDITOR && Buffer.isBuffer(data)) {
    // @ts-ignore
    data = data.toString();
  }

  if (typeof data === 'string') {
    data = JSON.parse(data);
  }

  var borrowDetails = !details;
  details = details || Details.pool.get();
  details.init(data);
  options = options || {};
  var version = data[File.Version];
  var preprocessed = false;

  if (typeof version === 'object') {
    preprocessed = version.preprocessed;
    version = version.version;
  }

  if (version < SUPPORT_MIN_FORMAT_VERSION) {
    throw new Error(cc.debug.getError(5304, version));
  }

  options._version = version;
  options.result = details;
  data[File.Context] = options;

  if (!preprocessed) {
    lookupClasses(data, false, options.classFinder);
    cacheMasks(data);
  }

  cc.game._isCloning = true;
  var instances = data[File.Instances];
  var rootIndex = parseInstances(data);
  cc.game._isCloning = false;

  if (data[File.Refs]) {
    dereference(data[File.Refs], instances, data[File.SharedStrings]);
  }

  parseResult(data);

  if (borrowDetails) {
    Details.pool.put(details);
  }

  return instances[rootIndex];
}

;
deserialize.Details = Details;

var FileInfo = function FileInfo(version) {
  this.preprocessed = true;
  this.version = version;
};

function unpackJSONs(data, classFinder) {
  if (data[File.Version] < SUPPORT_MIN_FORMAT_VERSION) {
    throw new Error(cc.debug.getError(5304, data[File.Version]));
  }

  lookupClasses(data, true, classFinder);
  cacheMasks(data);
  var version = new FileInfo(data[File.Version]);
  var sharedUuids = data[File.SharedUuids];
  var sharedStrings = data[File.SharedStrings];
  var sharedClasses = data[File.SharedClasses];
  var sharedMasks = data[File.SharedMasks];
  var sections = data[PACKED_SECTIONS];

  for (var i = 0; i < sections.length; ++i) {
    sections[i].unshift(version, sharedUuids, sharedStrings, sharedClasses, sharedMasks);
  }

  return sections;
}

function packCustomObjData(type, data, hasNativeDep) {
  return [SUPPORT_MIN_FORMAT_VERSION, EMPTY_PLACEHOLDER, EMPTY_PLACEHOLDER, [type], EMPTY_PLACEHOLDER, hasNativeDep ? [data, ~0] : [data], [0], EMPTY_PLACEHOLDER, [], [], []];
}

function hasNativeDep(data) {
  var instances = data[File.Instances];
  var rootInfo = instances[instances.length - 1];

  if (typeof rootInfo !== 'number') {
    return false;
  } else {
    return rootInfo < 0;
  }
}

if (CC_PREVIEW) {
  deserialize.isCompiledJson = function (json) {
    if (Array.isArray(json)) {
      var version = json[0]; // array[0] will not be a number in the editor version

      return typeof version === 'number' || version instanceof FileInfo;
    } else {
      return false;
    }
  };
}

function getDependUuidList(json) {
  var sharedUuids = json[File.SharedUuids];
  return json[File.DependUuidIndices].map(function (index) {
    return sharedUuids[index];
  });
}

if (CC_EDITOR || CC_TEST) {
  cc._deserializeCompiled = deserialize;
  deserialize.macros = {
    EMPTY_PLACEHOLDER: EMPTY_PLACEHOLDER,
    CUSTOM_OBJ_DATA_CLASS: CUSTOM_OBJ_DATA_CLASS,
    CUSTOM_OBJ_DATA_CONTENT: CUSTOM_OBJ_DATA_CONTENT,
    CLASS_TYPE: CLASS_TYPE,
    CLASS_KEYS: CLASS_KEYS,
    CLASS_PROP_TYPE_OFFSET: CLASS_PROP_TYPE_OFFSET,
    MASK_CLASS: MASK_CLASS,
    OBJ_DATA_MASK: OBJ_DATA_MASK,
    DICT_JSON_LAYOUT: DICT_JSON_LAYOUT,
    ARRAY_ITEM_VALUES: ARRAY_ITEM_VALUES,
    PACKED_SECTIONS: PACKED_SECTIONS
  };
  deserialize._BuiltinValueTypes = BuiltinValueTypes;
  deserialize._serializeBuiltinValueTypes = serializeBuiltinValueTypes;
}

if (CC_TEST) {
  cc._Test.deserializeCompiled = {
    deserialize: deserialize,
    dereference: dereference,
    deserializeCCObject: deserializeCCObject,
    deserializeCustomCCObject: deserializeCustomCCObject,
    parseInstances: parseInstances,
    parseResult: parseResult,
    cacheMasks: cacheMasks,
    File: {
      Version: File.Version,
      Context: File.Context,
      SharedUuids: File.SharedUuids,
      SharedStrings: File.SharedStrings,
      SharedClasses: File.SharedClasses,
      SharedMasks: File.SharedMasks,
      Instances: File.Instances,
      InstanceTypes: File.InstanceTypes,
      Refs: File.Refs,
      DependObjs: File.DependObjs,
      DependKeys: File.DependKeys,
      DependUuidIndices: File.DependUuidIndices // ArrayLength: File.ArrayLength,

    },
    DataTypeID: {
      SimpleType: DataTypeID.SimpleType,
      InstanceRef: DataTypeID.InstanceRef,
      Array_InstanceRef: DataTypeID.Array_InstanceRef,
      Array_AssetRefByInnerObj: DataTypeID.Array_AssetRefByInnerObj,
      Class: DataTypeID.Class,
      ValueTypeCreated: DataTypeID.ValueTypeCreated,
      AssetRefByInnerObj: DataTypeID.AssetRefByInnerObj,
      TRS: DataTypeID.TRS,
      ValueType: DataTypeID.ValueType,
      Array_Class: DataTypeID.Array_Class,
      CustomizedClass: DataTypeID.CustomizedClass,
      Dict: DataTypeID.Dict,
      Array: DataTypeID.Array // TypedArray: DataTypeID.TypedArray,

    },
    BuiltinValueTypes: BuiltinValueTypes,
    unpackJSONs: unpackJSONs
  };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BsYXRmb3JtL2Rlc2VyaWFsaXplLWNvbXBpbGVkLnRzIl0sIm5hbWVzIjpbIlNVUFBPUlRfTUlOX0ZPUk1BVF9WRVJTSU9OIiwiRU1QVFlfUExBQ0VIT0xERVIiLCJCdWlsdGluVmFsdWVUeXBlcyIsIlZlYzIiLCJWZWMzIiwiVmVjNCIsIlF1YXQiLCJDb2xvciIsIlNpemUiLCJSZWN0IiwiTWF0NCIsIkJ1aWx0aW5WYWx1ZVR5cGVQYXJzZXJzX3h5enciLCJvYmoiLCJkYXRhIiwieCIsInkiLCJ6IiwidyIsIkJ1aWx0aW5WYWx1ZVR5cGVTZXR0ZXJzIiwiX3ZhbCIsIndpZHRoIiwiaGVpZ2h0IiwiZnJvbUFycmF5Iiwic2VyaWFsaXplQnVpbHRpblZhbHVlVHlwZXMiLCJjdG9yIiwiY29uc3RydWN0b3IiLCJ0eXBlSWQiLCJpbmRleE9mIiwicmVzIiwiQXJyYXkiLCJWQUxVRVRZUEVfU0VUVEVSIiwidG9BcnJheSIsIkNMQVNTX1RZUEUiLCJDTEFTU19LRVlTIiwiQ0xBU1NfUFJPUF9UWVBFX09GRlNFVCIsIk1BU0tfQ0xBU1MiLCJPQkpfREFUQV9NQVNLIiwiQ1VTVE9NX09CSl9EQVRBX0NMQVNTIiwiQ1VTVE9NX09CSl9EQVRBX0NPTlRFTlQiLCJESUNUX0pTT05fTEFZT1VUIiwiQVJSQVlfSVRFTV9WQUxVRVMiLCJQQUNLRURfU0VDVElPTlMiLCJGaWxlIiwiSW5zdGFuY2VzIiwiRGV0YWlscyIsInV1aWRPYmpMaXN0IiwidXVpZFByb3BMaXN0IiwidXVpZExpc3QiLCJpbml0IiwiRGVwZW5kT2JqcyIsIkRlcGVuZEtleXMiLCJEZXBlbmRVdWlkSW5kaWNlcyIsInJlc2V0IiwicHVzaCIsInByb3BOYW1lIiwidXVpZCIsInBvb2wiLCJqcyIsIlBvb2wiLCJnZXQiLCJfZ2V0IiwiQ0NfRURJVE9SIiwiQ0NfVEVTVCIsInByb3RvdHlwZSIsImFzc2lnbkFzc2V0c0J5IiwiZ2V0dGVyIiwiaSIsImxlbiIsImxlbmd0aCIsInByb3AiLCJkZXJlZmVyZW5jZSIsInJlZnMiLCJpbnN0YW5jZXMiLCJzdHJpbmdzIiwiZGF0YUxlbmd0aCIsImluc3RhbmNlT2Zmc2V0IiwiUmVmcyIsIkVBQ0hfUkVDT1JEX0xFTkdUSCIsIm93bmVyIiwidGFyZ2V0IiwiVEFSR0VUX09GRlNFVCIsImtleUluZGV4IiwiS0VZX09GRlNFVCIsImRlc2VyaWFsaXplQ0NPYmplY3QiLCJvYmplY3REYXRhIiwibWFzayIsIlNoYXJlZE1hc2tzIiwiY2xhenoiLCJrZXlzIiwiY2xhc3NUeXBlT2Zmc2V0IiwibWFza1R5cGVPZmZzZXQiLCJrZXkiLCJ0eXBlIiwib3AiLCJBU1NJR05NRU5UUyIsImRlc2VyaWFsaXplQ3VzdG9tQ0NPYmplY3QiLCJ2YWx1ZSIsIl9kZXNlcmlhbGl6ZSIsIkNvbnRleHQiLCJjYyIsImVycm9ySUQiLCJnZXRDbGFzc05hbWUiLCJhc3NpZ25TaW1wbGUiLCJhc3NpZ25JbnN0YW5jZVJlZiIsImdlbkFycmF5UGFyc2VyIiwicGFyc2VyIiwicGFyc2VBc3NldFJlZkJ5SW5uZXJPYmoiLCJwYXJzZUNsYXNzIiwicGFyc2VDdXN0b21DbGFzcyIsIlNoYXJlZENsYXNzZXMiLCJwYXJzZVZhbHVlVHlwZUNyZWF0ZWQiLCJwYXJzZVZhbHVlVHlwZSIsInZhbCIsInBhcnNlVFJTIiwidHlwZWRBcnJheSIsInNldCIsInBhcnNlRGljdCIsImRpY3QiLCJzdWJWYWx1ZSIsInBhcnNlQXJyYXkiLCJhcnJheSIsIkRhdGFUeXBlSUQiLCJTaW1wbGVUeXBlIiwiQVJSQVlfTEVOR1RIIiwiSW5zdGFuY2VSZWYiLCJBcnJheV9JbnN0YW5jZVJlZiIsIkFycmF5X0Fzc2V0UmVmQnlJbm5lck9iaiIsIkNsYXNzIiwiVmFsdWVUeXBlQ3JlYXRlZCIsIkFzc2V0UmVmQnlJbm5lck9iaiIsIlRSUyIsIlZhbHVlVHlwZSIsIkFycmF5X0NsYXNzIiwiQ3VzdG9taXplZENsYXNzIiwiRGljdCIsInBhcnNlSW5zdGFuY2VzIiwiaW5zdGFuY2VUeXBlcyIsIkluc3RhbmNlVHlwZXMiLCJpbnN0YW5jZVR5cGVzTGVuIiwicm9vdEluZGV4Iiwibm9ybWFsT2JqZWN0Q291bnQiLCJpbnNJbmRleCIsImNsYXNzZXMiLCJ0eXBlSW5kZXgiLCJlYWNoRGF0YSIsImdldE1pc3NpbmdDbGFzcyIsImhhc0N1c3RvbUZpbmRlciIsImRlc2VyaWFsaXplIiwicmVwb3J0TWlzc2luZ0NsYXNzIiwiT2JqZWN0IiwiZG9Mb29rdXBDbGFzcyIsImNsYXNzRmluZGVyIiwiY29udGFpbmVyIiwiaW5kZXgiLCJzaWxlbnQiLCJrbGFzcyIsInByb3h5IiwibG9va3VwQ2xhc3NlcyIsImN1c3RvbUZpbmRlciIsIl9nZXRDbGFzc0J5SWQiLCJrbGFzc0xheW91dCIsIkNDX0RFQlVHIiwiRXJyb3IiLCJjYWNoZU1hc2tzIiwibWFza3MiLCJwYXJzZVJlc3VsdCIsInNoYXJlZFN0cmluZ3MiLCJTaGFyZWRTdHJpbmdzIiwiZGVwZW5kU2hhcmVkVXVpZHMiLCJTaGFyZWRVdWlkcyIsImRlcGVuZE9ianMiLCJkZXBlbmRLZXlzIiwiZGVwZW5kVXVpZHMiLCJkZXRhaWxzIiwib3B0aW9ucyIsIkJ1ZmZlciIsImlzQnVmZmVyIiwidG9TdHJpbmciLCJKU09OIiwicGFyc2UiLCJib3Jyb3dEZXRhaWxzIiwidmVyc2lvbiIsIlZlcnNpb24iLCJwcmVwcm9jZXNzZWQiLCJkZWJ1ZyIsImdldEVycm9yIiwiX3ZlcnNpb24iLCJyZXN1bHQiLCJnYW1lIiwiX2lzQ2xvbmluZyIsInB1dCIsIkZpbGVJbmZvIiwidW5wYWNrSlNPTnMiLCJzaGFyZWRVdWlkcyIsInNoYXJlZENsYXNzZXMiLCJzaGFyZWRNYXNrcyIsInNlY3Rpb25zIiwidW5zaGlmdCIsInBhY2tDdXN0b21PYmpEYXRhIiwiaGFzTmF0aXZlRGVwIiwicm9vdEluZm8iLCJDQ19QUkVWSUVXIiwiaXNDb21waWxlZEpzb24iLCJqc29uIiwiaXNBcnJheSIsImdldERlcGVuZFV1aWRMaXN0IiwibWFwIiwiX2Rlc2VyaWFsaXplQ29tcGlsZWQiLCJtYWNyb3MiLCJfQnVpbHRpblZhbHVlVHlwZXMiLCJfc2VyaWFsaXplQnVpbHRpblZhbHVlVHlwZXMiLCJfVGVzdCIsImRlc2VyaWFsaXplQ29tcGlsZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQWxDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFZQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSwwQkFBMEIsR0FBRyxDQUFuQztBQUNBLElBQU1DLGlCQUFpQixHQUFHLENBQTFCLEVBRUE7QUFDQTs7QUFDQSxJQUFNQyxpQkFBMEMsR0FBRyxDQUMvQ0MsZUFEK0MsRUFDdkM7QUFDUkMsZ0JBRitDLEVBRXZDO0FBQ1JDLGdCQUgrQyxFQUd2QztBQUNSQyxnQkFKK0MsRUFJdkM7QUFDUkMsaUJBTCtDLEVBS3ZDO0FBQ1JDLGdCQU4rQyxFQU12QztBQUNSQyxnQkFQK0MsRUFPdkM7QUFDUkMsZUFSK0MsQ0FRdkM7QUFSdUMsQ0FBbkQsRUFXQTs7QUFDQSxTQUFTQyw0QkFBVCxDQUF1Q0MsR0FBdkMsRUFBa0RDLElBQWxELEVBQXVFO0FBQ25FRCxFQUFBQSxHQUFHLENBQUNFLENBQUosR0FBUUQsSUFBSSxDQUFDLENBQUQsQ0FBWjtBQUNBRCxFQUFBQSxHQUFHLENBQUNHLENBQUosR0FBUUYsSUFBSSxDQUFDLENBQUQsQ0FBWjtBQUNBRCxFQUFBQSxHQUFHLENBQUNJLENBQUosR0FBUUgsSUFBSSxDQUFDLENBQUQsQ0FBWjtBQUNBRCxFQUFBQSxHQUFHLENBQUNLLENBQUosR0FBUUosSUFBSSxDQUFDLENBQUQsQ0FBWjtBQUNIOztBQUNELElBQU1LLHVCQUErRSxHQUFHLENBQ3BGLFVBQVVOLEdBQVYs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VUFBVSxDQUFDQyxVQURmO0FBRVJFLE1BQUFBLFdBQVcsRUFBRUgsVUFBVSxDQUFDRyxXQUZoQjtBQUdSQyxNQUFBQSxpQkFBaUIsRUFBRUosVUFBVSxDQUFDSSxpQkFIdEI7QUFJUkMsTUFBQUEsd0JBQXdCLEVBQUVMLFVBQVUsQ0FBQ0ssd0JBSjdCO0FBS1JDLE1BQUFBLEtBQUssRUFBRU4sVUFBVSxDQUFDTSxLQUxWO0FBTVJDLE1BQUFBLGdCQUFnQixFQUFFUCxVQUFVLENBQUNPLGdCQU5yQjtBQU9SQyxNQUFBQSxrQkFBa0IsRUFBRVIsVUFBVSxDQUFDUSxrQkFQdkI7QUFRUkMsTUFBQUEsR0FBRyxFQUFFVCxVQUFVLENBQUNTLEdBUlI7QUFTUkMsTUFBQUEsU0FBUyxFQUFFVixVQUFVLENBQUNVLFNBVGQ7QUFVUkMsTUFBQUEsV0FBVyxFQUFFWCxVQUFVLENBQUNXLFdBVmhCO0FBV1JDLE1BQUFBLGVBQWUsRUFBRVosVUFBVSxDQUFDWSxlQVhwQjtBQVlSQyxNQUFBQSxJQUFJLEVBQUViLFVBQVUsQ0FBQ2EsSUFaVDtBQWFSekcsTUFBQUEsS0FBSyxFQUFFNEYsVUFBVSxDQUFDNUYsS0FiVixDQWNSOztBQWRRLEtBdkJlO0FBdUMzQjNCLElBQUFBLGlCQUFpQixFQUFqQkEsaUJBdkMyQjtBQXdDM0I4TCxJQUFBQSxXQUFXLEVBQVhBO0FBeEMyQixHQUEvQjtBQTBDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSBwcmVzZW50IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IGpzIGZyb20gJy4vanMnO1xuaW1wb3J0IFZhbHVlVHlwZSBmcm9tICcuLi92YWx1ZS10eXBlcy92YWx1ZS10eXBlJztcbmltcG9ydCBWZWMyIGZyb20gJy4uL3ZhbHVlLXR5cGVzL3ZlYzInO1xuaW1wb3J0IFZlYzMgZnJvbSAnLi4vdmFsdWUtdHlwZXMvdmVjMyc7XG5pbXBvcnQgVmVjNCBmcm9tICcuLi92YWx1ZS10eXBlcy92ZWM0JztcbmltcG9ydCBDb2xvciBmcm9tICcuLi92YWx1ZS10eXBlcy9jb2xvcic7XG5pbXBvcnQgU2l6ZSBmcm9tICcuLi92YWx1ZS10eXBlcy9zaXplJztcbmltcG9ydCBSZWN0IGZyb20gJy4uL3ZhbHVlLXR5cGVzL3JlY3QnO1xuaW1wb3J0IFF1YXQgZnJvbSAnLi4vdmFsdWUtdHlwZXMvcXVhdCc7XG5pbXBvcnQgTWF0NCBmcm9tICcuLi92YWx1ZS10eXBlcy9tYXQ0Jztcbi8vIGltcG9ydCBBdHRyIGZyb20gJy4vYXR0cmlidXRlJztcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIEJVSUxULUlOIFRZUEVTIC8gQ09OU1RBSU5UU1xuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IFNVUFBPUlRfTUlOX0ZPUk1BVF9WRVJTSU9OID0gMTtcbmNvbnN0IEVNUFRZX1BMQUNFSE9MREVSID0gMDtcblxuLy8gVXNlZCBmb3IgRGF0YS5WYWx1ZVR5cGUuXG4vLyBJZiBhIHZhbHVlIHR5cGUgaXMgbm90IHJlZ2lzdGVyZWQgaW4gdGhpcyBsaXN0LCBpdCB3aWxsIGJlIHNlcmlhbGl6ZWQgdG8gRGF0YS5DbGFzcy5cbmNvbnN0IEJ1aWx0aW5WYWx1ZVR5cGVzOiBBcnJheTx0eXBlb2YgVmFsdWVUeXBlPiA9IFtcbiAgICBWZWMyLCAgIC8vIDBcbiAgICBWZWMzLCAgIC8vIDFcbiAgICBWZWM0LCAgIC8vIDJcbiAgICBRdWF0LCAgIC8vIDNcbiAgICBDb2xvciwgIC8vIDRcbiAgICBTaXplLCAgIC8vIDVcbiAgICBSZWN0LCAgIC8vIDZcbiAgICBNYXQ0LCAgIC8vIDdcbl07XG5cbi8vIFVzZWQgZm9yIERhdGEuVmFsdWVUeXBlQ3JlYXRlZC5cbmZ1bmN0aW9uIEJ1aWx0aW5WYWx1ZVR5cGVQYXJzZXJzX3h5encgKG9iajogVmVjNCwgZGF0YTogQXJyYXk8bnVtYmVyPikge1xuICAgIG9iai54ID0gZGF0YVsxXTtcbiAgICBvYmoueSA9IGRhdGFbMl07XG4gICAgb2JqLnogPSBkYXRhWzNdO1xuICAgIG9iai53ID0gZGF0YVs0XTtcbn1cbmNvbnN0IEJ1aWx0aW5WYWx1ZVR5cGVTZXR0ZXJzOiBBcnJheTwoKG9iajogVmFsdWVUeXBlLCBkYXRhOiBBcnJheTxudW1iZXI+KSA9PiB2b2lkKT4gPSBbXG4gICAgZnVuY3Rpb24gKG9iajogVmVjMiwgZGF0YTogQXJyYXk8bnVtYmVyPikge1xuICAgICAgICBvYmoueCA9IGRhdGFbMV07XG4gICAgICAgIG9iai55ID0gZGF0YVsyXTtcbiAgICB9LFxuICAgIGZ1bmN0aW9uIChvYmo6IFZlYzMsIGRhdGE6IEFycmF5PG51bWJlcj4pIHtcbiAgICAgICAgb2JqLnggPSBkYXRhWzFdO1xuICAgICAgICBvYmoueSA9IGRhdGFbMl07XG4gICAgICAgIG9iai56ID0gZGF0YVszXTtcbiAgICB9LFxuICAgIEJ1aWx0aW5WYWx1ZVR5cGVQYXJzZXJzX3h5encsICAgLy8gVmVjNFxuICAgIEJ1aWx0aW5WYWx1ZVR5cGVQYXJzZXJzX3h5encsICAgLy8gUXVhdFxuICAgIGZ1bmN0aW9uIChvYmo6IENvbG9yLCBkYXRhOiBBcnJheTxudW1iZXI+KSB7XG4gICAgICAgIG9iai5fdmFsID0gZGF0YVsxXTtcbiAgICB9LFxuICAgIGZ1bmN0aW9uIChvYmo6IFNpemUsIGRhdGE6IEFycmF5PG51bWJlcj4pIHtcbiAgICAgICAgb2JqLndpZHRoID0gZGF0YVsxXTtcbiAgICAgICAgb2JqLmhlaWdodCA9IGRhdGFbMl07XG4gICAgfSxcbiAgICBmdW5jdGlvbiAob2JqOiBSZWN0LCBkYXRhOiBBcnJheTxudW1iZXI+KSB7XG4gICAgICAgIG9iai54ID0gZGF0YVsxXTtcbiAgICAgICAgb2JqLnkgPSBkYXRhWzJdO1xuICAgICAgICBvYmoud2lkdGggPSBkYXRhWzNdO1xuICAgICAgICBvYmouaGVpZ2h0ID0gZGF0YVs0XTtcbiAgICB9LFxuICAgIGZ1bmN0aW9uIChvYmo6IE1hdDQsIGRhdGE6IEFycmF5PG51bWJlcj4pIHtcbiAgICAgICAgTWF0NC5mcm9tQXJyYXkob2JqLCBkYXRhLCAxKTtcbiAgICB9XG5dO1xuXG5mdW5jdGlvbiBzZXJpYWxpemVCdWlsdGluVmFsdWVUeXBlcyhvYmo6IFZhbHVlVHlwZSk6IElWYWx1ZVR5cGVEYXRhIHwgbnVsbCB7XG4gICAgbGV0IGN0b3IgPSBvYmouY29uc3RydWN0b3IgYXMgdHlwZW9mIFZhbHVlVHlwZTtcbiAgICBsZXQgdHlwZUlkID0gQnVpbHRpblZhbHVlVHlwZXMuaW5kZXhPZihjdG9yKTtcbiAgICBzd2l0Y2ggKGN0b3IpIHtcbiAgICAgICAgY2FzZSBWZWMyOlxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgcmV0dXJuIFt0eXBlSWQsIG9iai54LCBvYmoueV07XG4gICAgICAgIGNhc2UgVmVjMzpcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIHJldHVybiBbdHlwZUlkLCBvYmoueCwgb2JqLnksIG9iai56XTtcbiAgICAgICAgY2FzZSBWZWM0OlxuICAgICAgICBjYXNlIFF1YXQ6XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICByZXR1cm4gW3R5cGVJZCwgb2JqLngsIG9iai55LCBvYmoueiwgb2JqLnddO1xuICAgICAgICBjYXNlIENvbG9yOlxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgcmV0dXJuIFt0eXBlSWQsIG9iai5fdmFsXTtcbiAgICAgICAgY2FzZSBTaXplOlxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgcmV0dXJuIFt0eXBlSWQsIG9iai53aWR0aCwgb2JqLmhlaWdodF07XG4gICAgICAgIGNhc2UgUmVjdDpcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIHJldHVybiBbdHlwZUlkLCBvYmoueCwgb2JqLnksIG9iai53aWR0aCwgb2JqLmhlaWdodF07XG4gICAgICAgIGNhc2UgTWF0NDpcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGxldCByZXM6IElWYWx1ZVR5cGVEYXRhID0gbmV3IEFycmF5KDEgKyAxNik7XG4gICAgICAgICAgICByZXNbVkFMVUVUWVBFX1NFVFRFUl0gPSB0eXBlSWQ7XG4gICAgICAgICAgICBNYXQ0LnRvQXJyYXkocmVzLCBvYmogYXMgTWF0NCwgMSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuXG4vLyAvLyBUT0RPOiBVc2VkIGZvciBEYXRhLlR5cGVkQXJyYXkuXG4vLyBjb25zdCBUeXBlZEFycmF5cyA9IFtcbi8vICAgICBGbG9hdDMyQXJyYXksXG4vLyAgICAgRmxvYXQ2NEFycmF5LFxuLy9cbi8vICAgICBJbnQ4QXJyYXksXG4vLyAgICAgSW50MTZBcnJheSxcbi8vICAgICBJbnQzMkFycmF5LFxuLy9cbi8vICAgICBVaW50OEFycmF5LFxuLy8gICAgIFVpbnQxNkFycmF5LFxuLy8gICAgIFVpbnQzMkFycmF5LFxuLy9cbi8vICAgICBVaW50OENsYW1wZWRBcnJheSxcbi8vICAgICAvLyBCaWdJbnQ2NEFycmF5LFxuLy8gICAgIC8vIEJpZ1VpbnQ2NEFycmF5LFxuLy8gXTtcblxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogVFlQRSBERUNMQVJBVElPTlNcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBJbmNsdWRlcyBCaXR3aXNlIE5PVCB2YWx1ZS5cbi8vIEJvdGggVCBhbmQgVSBoYXZlIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyIHJhbmdlcy5cbi8vIFdoZW4gdGhlIHZhbHVlID49IDAgcmVwcmVzZW50cyBUXG4vLyBXaGVuIHRoZSB2YWx1ZSBpcyA8IDAsIGl0IHJlcHJlc2VudHMgflUuIFVzZSB+eCB0byBleHRyYWN0IHRoZSB2YWx1ZSBvZiBVLlxuZXhwb3J0IHR5cGUgQm5vdDxUIGV4dGVuZHMgbnVtYmVyLCBVIGV4dGVuZHMgbnVtYmVyPiA9IFR8VTtcblxuLy8gQ29tYmluZXMgYSBib29sZWFuIGFuZCBhIG51bWJlciBpbnRvIG9uZSB2YWx1ZS5cbi8vIFRoZSBudW1iZXIgbXVzdCA+PSAwLlxuLy8gV2hlbiB0aGUgdmFsdWUgPj0gMCwgdGhlIGJvb2xlYW4gaXMgdHJ1ZSwgdGhlIG51bWJlciBpcyB2YWx1ZS5cbi8vIFdoZW4gdGhlIHZhbHVlIDwgMCwgdGhlIGJvb2xlYW4gaXMgZmFsc2UsIHRoZSBudW1iZXIgaXMgfnZhbHVlLlxuZXhwb3J0IHR5cGUgQm9vbEFuZE51bTxCIGV4dGVuZHMgYm9vbGVhbiwgTiBleHRlbmRzIG51bWJlcj4gPSBCbm90PE4sIE4+O1xuXG5leHBvcnQgdHlwZSBTaGFyZWRTdHJpbmcgPSBzdHJpbmc7XG5leHBvcnQgdHlwZSBFbXB0eSA9IHR5cGVvZiBFTVBUWV9QTEFDRUhPTERFUjtcbmV4cG9ydCB0eXBlIFN0cmluZ0luZGV4ID0gbnVtYmVyO1xuZXhwb3J0IHR5cGUgSW5zdGFuY2VJbmRleCA9IG51bWJlcjtcbmV4cG9ydCB0eXBlIFJvb3RJbnN0YW5jZUluZGV4ID0gSW5zdGFuY2VJbmRleDtcbmV4cG9ydCB0eXBlIE5vTmF0aXZlRGVwID0gYm9vbGVhbjsgIC8vIEluZGljYXRlcyB3aGV0aGVyIHRoZSBhc3NldCBkZXBlbmRzIG9uIGEgbmF0aXZlIGFzc2V0XG5leHBvcnQgdHlwZSBSb290SW5mbyA9IEJvb2xBbmROdW08Tm9OYXRpdmVEZXAsIFJvb3RJbnN0YW5jZUluZGV4PjtcblxuLy8gV2hlbiB0aGUgdmFsdWUgPj0gMCByZXByZXNlbnRzIHRoZSBzdHJpbmcgaW5kZXhcbi8vIFdoZW4gdGhlIHZhbHVlIGlzIDwgMCwgaXQganVzdCByZXByZXNlbnRzIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyLiBVc2UgfnggdG8gZXh0cmFjdCB0aGUgdmFsdWUuXG5leHBvcnQgdHlwZSBTdHJpbmdJbmRleEJub3ROdW1iZXIgPSBCbm90PFN0cmluZ0luZGV4LCBudW1iZXI+O1xuXG4vLyBBIHJldmVyc2UgaW5kZXggdXNlZCB0byBhc3NpZ24gY3VycmVudCBwYXJzaW5nIG9iamVjdCB0byB0YXJnZXQgY29tbWFuZCBidWZmZXIgc28gaXQgY291bGQgYmUgYXNzZW1ibGVkIGxhdGVyLlxuLy8gU2hvdWxkID49IFJFRi5PQkpfT0ZGU0VUXG5leHBvcnQgdHlwZSBSZXZlcnNlSW5kZXggPSBudW1iZXI7XG5cbi8vIFVzZWQgdG8gaW5kZXggdGhlIGN1cnJlbnQgb2JqZWN0XG5leHBvcnQgdHlwZSBJbnN0YW5jZUJub3RSZXZlcnNlSW5kZXggPSBCbm90PEluc3RhbmNlSW5kZXgsIFJldmVyc2VJbmRleD47XG5cbi8qQF9fRFJPUF9QVVJFX0VYUE9SVF9fKi9cbmV4cG9ydCBjb25zdCBlbnVtIERhdGFUeXBlSUQge1xuXG4gICAgLy8gRmllbGRzIHRoYXQgY2FuIGJlIGFzc2lnbmVkIGRpcmVjdGx5LCBjYW4gYmUgdmFsdWVzIGluIGFueSBKU09OLCBvciBldmVuIGEgY29tcGxleCBKU09OIGFycmF5LCBvYmplY3QgKG5vIHR5cGUpLlxuICAgIC8vIENvbnRhaW5zIG51bGwsIG5vIHVuZGVmaW5lZCwgSlNPTiBkb2VzIG5vdCBzdXBwb3J0IHNlcmlhbGl6YXRpb24gb2YgdW5kZWZpbmVkLlxuICAgIC8vIFRoaXMgaXMgdGhlIG9ubHkgdHlwZSB0aGF0IHN1cHBvcnRzIG51bGwsIGFuZCBhbGwgb3RoZXIgYWR2YW5jZWQgZmllbGRzIGFyZSBmb3JiaWRkZW4gd2l0aCBudWxsIHZhbHVlcy5cbiAgICAvLyBJZiB0aGUgdmFsdWUgb2YgYW4gb2JqZWN0IGlzIGxpa2VseSB0byBiZSBudWxsLCBpdCBuZWVkcyB0byBleGlzdCBhcyBhIG5ldyBjbGFzcyxcbiAgICAvLyBidXQgdGhlIHByb2JhYmlsaXR5IG9mIHRoaXMgaXMgdmVyeSBsb3cgYW5kIHdpbGwgYmUgYW5hbHl6ZWQgYmVsb3cuXG4gICAgU2ltcGxlVHlwZSA9IDAsXG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRXhjZXB0IFNpbXBsZSwgdGhlIHJlc3QgYmVsb25nIHRvIEFkdmFuY2VkIFR5cGUuXG5cbiAgICAvLyBSYXJlbHkgd2lsbCBpdCBiZSBOVUxMLCBhcyBOVUxMIHdpbGwgYmUgZHJvcHBlZCBhcyB0aGUgZGVmYXVsdCB2YWx1ZS5cbiAgICBJbnN0YW5jZVJlZixcblxuICAgIC8vIEFycmF5cyBvZiBleGFjdGx5IGVxdWFsIHR5cGVzLlxuICAgIC8vIEFycmF5cyB3aWxsIGhhdmUgZGVmYXVsdCB2YWx1ZXMgdGhhdCBkZXZlbG9wZXJzIHdpbGwgcmFyZWx5IGFzc2lnbiB0byBudWxsIG1hbnVhbGx5LlxuICAgIEFycmF5X0luc3RhbmNlUmVmLFxuICAgIEFycmF5X0Fzc2V0UmVmQnlJbm5lck9iaixcblxuICAgIC8vIEVtYmVkZGVkIG9iamVjdFxuICAgIC8vIFJhcmVseSB3aWxsIGl0IGJlIE5VTEwsIGFzIE5VTEwgd2lsbCBiZSBkcm9wcGVkIGFzIHRoZSBkZWZhdWx0IHZhbHVlLlxuICAgIENsYXNzLFxuXG4gICAgLy8gRXhpc3RpbmcgVmFsdWVUeXBlIChjcmVhdGVkIGJ5IHRoZSBDbGFzcyBjb25zdHJ1Y3RvcikuXG4gICAgLy8gRGV2ZWxvcGVycyB3aWxsIHJhcmVseSBtYW51YWxseSBhc3NpZ24gYSBudWxsLlxuICAgIFZhbHVlVHlwZUNyZWF0ZWQsXG5cbiAgICAvLyBSZXNvdXJjZSByZWZlcmVuY2UgZm9yIGVtYmVkZGVkIG9iamVjdHMgKHN1Y2ggYXMgYXJyYXlzKSwgdGhlIHZhbHVlIGlzIHRoZSBpbmRleCBvZiBERVBFTkRfT0JKUy5cbiAgICAvLyAoVGhlIG9iamVjdHMgaW4gSU5TVEFOQ0VTIGRvIG5vdCBuZWVkIHRvIGR5bmFtaWNhbGx5IHJlc29sdmUgcmVzb3VyY2UgcmVmZXJlbmNlIHJlbGF0aW9uc2hpcHMsIHNvIHRoZXJlIGlzIG5vIG5lZWQgdG8gaGF2ZSB0aGUgQXNzZXRSZWYgdHlwZS4pXG4gICAgQXNzZXRSZWZCeUlubmVyT2JqLFxuXG4gICAgLy8gQ29tbW9uIFR5cGVkQXJyYXkgZm9yIGNjLk5vZGUgb25seS4gTmV2ZXIgYmUgbnVsbC5cbiAgICBUUlMsXG5cbiAgICAvLyAvLyBGcm9tIHRoZSBwb2ludCBvZiB2aWV3IG9mIHNpbXBsaWZpZWQgaW1wbGVtZW50YXRpb24sXG4gICAgLy8gLy8gaXQgaXMgbm90IHN1cHBvcnRlZCB0byBkZXNlcmlhbGl6ZSBUeXBlZEFycmF5IHRoYXQgaXMgaW5pdGlhbGl6ZWQgdG8gbnVsbCBpbiB0aGUgY29uc3RydWN0b3IuXG4gICAgLy8gLy8gQWxzbywgdGhlIGxlbmd0aCBvZiBUeXBlZEFycmF5IGNhbm5vdCBiZSBjaGFuZ2VkLlxuICAgIC8vIC8vIERldmVsb3BlcnMgd2lsbCByYXJlbHkgbWFudWFsbHkgYXNzaWduIGEgbnVsbC5cbiAgICAvLyBUeXBlZEFycmF5LFxuXG4gICAgLy8gVmFsdWVUeXBlIHdpdGhvdXQgZGVmYXVsdCB2YWx1ZSAoaW4gYXJyYXlzLCBkaWN0aW9uYXJpZXMpLlxuICAgIC8vIERldmVsb3BlcnMgd2lsbCByYXJlbHkgbWFudWFsbHkgYXNzaWduIGEgbnVsbC5cbiAgICBWYWx1ZVR5cGUsXG5cbiAgICBBcnJheV9DbGFzcyxcblxuICAgIC8vIEN1c3RvbWl6ZWRDbGFzcyBlbWJlZGRlZCBpbiBDbGFzc1xuICAgIEN1c3RvbWl6ZWRDbGFzcyxcblxuICAgIC8vIFVuaXZlcnNhbCBkaWN0aW9uYXJ5IHdpdGggdW5saW1pdGVkIHR5cGVzIG9mIHZhbHVlcyAoZXhjZXB0IFR5cGVkQXJyYXkpXG4gICAgRGljdCxcblxuICAgIC8vIFVuaXZlcnNhbCBhcnJheXMsIG9mIGFueSB0eXBlIChleGNlcHQgVHlwZWRBcnJheSkgYW5kIGNhbiBiZSB1bmVxdWFsLlxuICAgIC8vIChUaGUgZWRpdG9yIGRvZXNuJ3Qgc2VlbSB0byBoYXZlIGEgZ29vZCB3YXkgb2Ygc3RvcHBpbmcgYXJyYXlzIG9mIHVuZXF1YWwgdHlwZXMgZWl0aGVyKVxuICAgIEFycmF5LFxuXG4gICAgQVJSQVlfTEVOR1RILFxufVxuXG5leHBvcnQgdHlwZSBEYXRhVHlwZXMgPSB7XG4gICAgW0RhdGFUeXBlSUQuU2ltcGxlVHlwZV06IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW4gfCBudWxsIHwgb2JqZWN0O1xuICAgIFtEYXRhVHlwZUlELkluc3RhbmNlUmVmXTogSW5zdGFuY2VCbm90UmV2ZXJzZUluZGV4O1xuICAgIFtEYXRhVHlwZUlELkFycmF5X0luc3RhbmNlUmVmXTogQXJyYXk8RGF0YVR5cGVzW0RhdGFUeXBlSUQuSW5zdGFuY2VSZWZdPjtcbiAgICBbRGF0YVR5cGVJRC5BcnJheV9Bc3NldFJlZkJ5SW5uZXJPYmpdOiBBcnJheTxEYXRhVHlwZXNbRGF0YVR5cGVJRC5Bc3NldFJlZkJ5SW5uZXJPYmpdPjtcbiAgICBbRGF0YVR5cGVJRC5DbGFzc106IElDbGFzc09iamVjdERhdGE7XG4gICAgW0RhdGFUeXBlSUQuVmFsdWVUeXBlQ3JlYXRlZF06IElWYWx1ZVR5cGVEYXRhO1xuICAgIFtEYXRhVHlwZUlELkFzc2V0UmVmQnlJbm5lck9ial06IG51bWJlcjtcbiAgICBbRGF0YVR5cGVJRC5UUlNdOiBJVFJTRGF0YTtcbiAgICAvLyBbRGF0YVR5cGVJRC5UeXBlZEFycmF5XTogQXJyYXk8SW5zdGFuY2VPclJldmVyc2VJbmRleD47XG4gICAgW0RhdGFUeXBlSUQuVmFsdWVUeXBlXTogSVZhbHVlVHlwZURhdGE7XG4gICAgW0RhdGFUeXBlSUQuQXJyYXlfQ2xhc3NdOiBBcnJheTxEYXRhVHlwZXNbRGF0YVR5cGVJRC5DbGFzc10+O1xuICAgIFtEYXRhVHlwZUlELkN1c3RvbWl6ZWRDbGFzc106IElDdXN0b21PYmplY3REYXRhO1xuICAgIFtEYXRhVHlwZUlELkRpY3RdOiBJRGljdERhdGE7XG4gICAgW0RhdGFUeXBlSUQuQXJyYXldOiBJQXJyYXlEYXRhO1xufTtcblxuZXhwb3J0IHR5cGUgUHJpbWl0aXZlT2JqZWN0VHlwZUlEID0gKFxuICAgIERhdGFUeXBlSUQuU2ltcGxlVHlwZSB8IC8vIFNpbXBsZVR5cGUgYWxzbyBpbmNsdWRlcyBhbnkgcHVyZSBKU09OIG9iamVjdFxuICAgIERhdGFUeXBlSUQuQXJyYXkgfFxuICAgIERhdGFUeXBlSUQuQXJyYXlfQ2xhc3MgfFxuICAgIERhdGFUeXBlSUQuQXJyYXlfQXNzZXRSZWZCeUlubmVyT2JqIHxcbiAgICBEYXRhVHlwZUlELkFycmF5X0luc3RhbmNlUmVmIHxcbiAgICBEYXRhVHlwZUlELkRpY3Rcbik7XG5cbmV4cG9ydCB0eXBlIEFkdmFuY2VkVHlwZUlEID0gRXhjbHVkZTxEYXRhVHlwZUlELCBEYXRhVHlwZUlELlNpbXBsZVR5cGU+XG5cblxuLy8gQ29sbGVjdGlvbiBvZiBhbGwgZGF0YSB0eXBlc1xuZXhwb3J0IHR5cGUgQW55RGF0YSA9IERhdGFUeXBlc1trZXlvZiBEYXRhVHlwZXNdO1xuXG5leHBvcnQgdHlwZSBBZHZhbmNlZERhdGEgPSBEYXRhVHlwZXNbRXhjbHVkZTxrZXlvZiBEYXRhVHlwZXMsIERhdGFUeXBlSUQuU2ltcGxlVHlwZT5dO1xuXG5leHBvcnQgdHlwZSBPdGhlck9iamVjdERhdGEgPSBJQ3VzdG9tT2JqZWN0RGF0YUNvbnRlbnQgfCBFeGNsdWRlPERhdGFUeXBlc1tQcmltaXRpdmVPYmplY3RUeXBlSURdLCAobnVtYmVyfHN0cmluZ3xib29sZWFufG51bGwpPjtcblxuLy8gY2xhc3MgSW5kZXggb2YgRGF0YVR5cGVJRC5DdXN0b21pemVkQ2xhc3Mgb3IgUHJpbWl0aXZlT2JqZWN0VHlwZUlEXG5leHBvcnQgdHlwZSBPdGhlck9iamVjdFR5cGVJRCA9IEJub3Q8bnVtYmVyLCBQcmltaXRpdmVPYmplY3RUeXBlSUQ+O1xuXG5leHBvcnQgaW50ZXJmYWNlIEN0b3I8VD4gZXh0ZW5kcyBGdW5jdGlvbiB7XG4gICAgbmV3KCk6IFQ7XG59XG4vLyBJbmNsdWRlcyBub3JtYWwgQ0NDbGFzcyBhbmQgZmFzdCBkZWZpbmVkIGNsYXNzXG5leHBvcnQgaW50ZXJmYWNlIENDQ2xhc3M8VD4gZXh0ZW5kcyBDdG9yPFQ+IHtcbiAgICBfX3ZhbHVlc19fOiBzdHJpbmdbXVxufVxuZXhwb3J0IHR5cGUgQW55Q3RvciA9IEN0b3I8T2JqZWN0PjtcbmV4cG9ydCB0eXBlIEFueUNDQ2xhc3MgPSBDQ0NsYXNzPE9iamVjdD47XG5cbi8qKlxuICogSWYgdGhlIHZhbHVlIHR5cGUgaXMgZGlmZmVyZW50LCBkaWZmZXJlbnQgQ2xhc3NlcyB3aWxsIGJlIGdlbmVyYXRlZFxuICovXG5jb25zdCBDTEFTU19UWVBFID0gMDtcbmNvbnN0IENMQVNTX0tFWVMgPSAxO1xuY29uc3QgQ0xBU1NfUFJPUF9UWVBFX09GRlNFVCA9IDI7XG5leHBvcnQgdHlwZSBJQ2xhc3MgPSBbXG4gICAgc3RyaW5nfEFueUN0b3IsXG4gICAgc3RyaW5nW10sXG4gICAgLy8gb2Zmc2V0IC0gSXQgaXMgdXNlZCB0byBzcGVjaWZ5IHRoZSBjb3JyZXNwb25kZW5jZSBiZXR3ZWVuIHRoZSBlbGVtZW50cyBpbiBDTEFTU19LRVlTIGFuZCB0aGVpciBBZHZhbmNlZFR5cGUsXG4gICAgLy8gICAgICAgICAgd2hpY2ggaXMgb25seSB2YWxpZCBmb3IgQWR2YW5jZWRUeXBlLlxuICAgIC8vIFdoZW4gcGFyc2luZywgdGhlIHR5cGUgb2YgSUNsYXNzW0NMQVNTX0tFWVNdW3hdIGlzIElDbGFzc1t4ICsgSUNsYXNzW0NMQVNTX1BST1BfVFlQRV9PRkZTRVRdXVxuICAgIC8vIFdoZW4gc2VyaWFsaXppbmcsIElDbGFzc1tDTEFTU19QUk9QX1RZUEVfT0ZGU0VUXSA9IENMQVNTX1BST1BfVFlQRV9PRkZTRVQgKyAxIC0gKFRoZSBudW1iZXIgb2YgU2ltcGxlVHlwZSlcbiAgICBudW1iZXIsXG4gICAgLy8gVGhlIEFkdmFuY2VkVHlwZSB0eXBlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHByb3BlcnR5LlxuICAgIC4uLkRhdGFUeXBlSURbXVxuXTtcblxuLyoqXG4gKiBNYXNrIGlzIHVzZWQgdG8gZGVmaW5lIHRoZSBwcm9wZXJ0aWVzIGFuZCB0eXBlcyB0aGF0IG5lZWQgdG8gYmUgZGVzZXJpYWxpemVkLlxuICogSW5zdGFuY2VzIG9mIHRoZSBzYW1lIGNsYXNzIG1heSBoYXZlIGRpZmZlcmVudCBNYXNrcyBkdWUgdG8gZGlmZmVyZW50IGRlZmF1bHQgcHJvcGVydGllcyByZW1vdmVkLlxuICovXG5jb25zdCBNQVNLX0NMQVNTID0gMDtcbmV4cG9ydCB0eXBlIElNYXNrID0gW1xuICAgIC8vIFRoZSBpbmRleCBvZiBpdHMgQ2xhc3NcbiAgICBudW1iZXIsXG4gICAgLy8gVGhlIGluZGljZXMgb2YgdGhlIHByb3BlcnR5IHRoYXQgbmVlZHMgdG8gYmUgZGVzZXJpYWxpemVkIGluIElDbGFzcywgZXhjZXB0IHRoYXQgdGhlIGxhc3QgbnVtYmVyIHJlcHJlc2VudHMgT0ZGU0VULlxuICAgIC8vIEFsbCBwcm9wZXJ0aWVzIGJlZm9yZSBPRkZTRVQgYXJlIFNpbXBsZVR5cGUsIGFuZCB0aG9zZSBzdGFydGluZyBhdCBPRkZTRVQgYXJlIEFkdmFuY2VkVHlwZS5cbiAgICAvLyBkZWZhdWx0IGlzIDFcbiAgICAuLi5udW1iZXJbXVxuXTtcblxuY29uc3QgT0JKX0RBVEFfTUFTSyA9IDA7XG5leHBvcnQgdHlwZSBJQ2xhc3NPYmplY3REYXRhID0gW1xuICAgIC8vIFRoZSBpbmRleCBvZiBpdHMgTWFza1xuICAgIG51bWJlcixcbiAgICAvLyBTdGFydGluZyBmcm9tIDEsIHRoZSB2YWx1ZXMgY29ycmVzcG9uZGluZyB0byB0aGUgcHJvcGVydGllcyBpbiB0aGUgTWFza1xuICAgIC4uLkFueURhdGFbXVxuXTtcblxuZXhwb3J0IHR5cGUgSUN1c3RvbU9iamVjdERhdGFDb250ZW50ID0gYW55O1xuXG5jb25zdCBDVVNUT01fT0JKX0RBVEFfQ0xBU1MgPSAwO1xuY29uc3QgQ1VTVE9NX09CSl9EQVRBX0NPTlRFTlQgPSAxO1xuZXhwb3J0IGludGVyZmFjZSBJQ3VzdG9tT2JqZWN0RGF0YSBleHRlbmRzIEFycmF5PGFueT4ge1xuICAgIC8vIFRoZSBpbmRleCBvZiBpdHMgQ2xhc3NcbiAgICBbQ1VTVE9NX09CSl9EQVRBX0NMQVNTXTogbnVtYmVyO1xuICAgIC8vIENvbnRlbnRcbiAgICBbQ1VTVE9NX09CSl9EQVRBX0NPTlRFTlRdOiBJQ3VzdG9tT2JqZWN0RGF0YUNvbnRlbnQ7XG59XG5cbmNvbnN0IFZBTFVFVFlQRV9TRVRURVIgPSAwO1xuZXhwb3J0IHR5cGUgSVZhbHVlVHlwZURhdGEgPSBbXG4gICAgLy8gUHJlZGVmaW5lZCBwYXJzaW5nIGZ1bmN0aW9uIGluZGV4XG4gICAgbnVtYmVyLFxuICAgIC8vIFN0YXJ0aW5nIHdpdGggMSwgdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWUgaW4gdGhlIGF0dHJpYnV0ZXMgYXJlIGZvbGxvd2VkIGluIG9yZGVyXG4gICAgLi4ubnVtYmVyW11cbl07XG5cbmV4cG9ydCB0eXBlIElUUlNEYXRhID0gW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdO1xuXG5jb25zdCBESUNUX0pTT05fTEFZT1VUID0gMDtcbmV4cG9ydCBpbnRlcmZhY2UgSURpY3REYXRhIGV4dGVuZHMgQXJyYXk8YW55PiB7XG4gICAgLy8gVGhlIHJhdyBqc29uIG9iamVjdFxuICAgIFtESUNUX0pTT05fTEFZT1VUXTogYW55LFxuICAgIC8vIGtleVxuICAgIC8vIFNoYXJlZCBzdHJpbmdzIGFyZSBub3QgY29uc2lkZXJlZCBoZXJlLCBjYW4gYmUgZGVmaW5lZCBhcyBDQ0NsYXNzIGlmIGl0IGlzIHJlcXVpcmVkLlxuICAgIFsxXTogc3RyaW5nO1xuICAgIC8vIHZhbHVlIHR5cGVcbiAgICAvLyBTaG91bGQgbm90IGJlIFNpbXBsZVR5cGUsIFNpbXBsZVR5cGUgaXMgYnVpbHQgZGlyZWN0bHkgaW50byBESUNUX0pTT05fTEFZT1VULlxuICAgIFsyXTogQWR2YW5jZWRUeXBlSUQ7XG4gICAgLy8gdmFsdWVcbiAgICBbM106IEFkdmFuY2VkRGF0YTtcbiAgICAvLyBNb3JlIHJlcGVhdGVkIGtleSB2YWx1ZXNcbiAgICBbaW5kZXg6IG51bWJlcl06IGFueSxcbn1cblxuY29uc3QgQVJSQVlfSVRFTV9WQUxVRVMgPSAwO1xuZXhwb3J0IHR5cGUgSUFycmF5RGF0YSA9IFtcbiAgICBBbnlEYXRhW10sXG4gICAgLy8gdHlwZXNcbiAgICAuLi5EYXRhVHlwZUlEW11cbl07XG5cbi8vIGNvbnN0IFRZUEVEQVJSQVlfVFlQRSA9IDA7XG4vLyBjb25zdCBUWVBFREFSUkFZX0VMRU1FTlRTID0gMTtcbi8vIGV4cG9ydCBpbnRlcmZhY2UgSVR5cGVkQXJyYXlEYXRhIGV4dGVuZHMgQXJyYXk8bnVtYmVyfG51bWJlcltdPiB7XG4vLyAgICAgW1RZUEVEQVJSQVlfVFlQRV06IG51bWJlcixcbi8vICAgICBbVFlQRURBUlJBWV9FTEVNRU5UU106IG51bWJlcltdLFxuLy8gfVxuXG4vKkBfX0RST1BfUFVSRV9FWFBPUlRfXyovXG5leHBvcnQgY29uc3QgZW51bSBSZWZzIHtcbiAgICBFQUNIX1JFQ09SRF9MRU5HVEggPSAzLFxuICAgIE9XTkVSX09GRlNFVCA9IDAsXG4gICAgS0VZX09GRlNFVCA9IDEsXG4gICAgVEFSR0VUX09GRlNFVCA9IDIsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJlZnMgZXh0ZW5kcyBBcnJheTxudW1iZXI+IHtcbiAgICAvLyBvd25lclxuICAgIC8vIFRoZSBvd25lciBvZiBhbGwgdGhlIG9iamVjdHMgaW4gdGhlIGZyb250IGlzIG9mIHR5cGUgb2JqZWN0LCBzdGFydGluZyBmcm9tIE9GRlNFVCAqIDMgYXJlIG9mIHR5cGUgSW5zdGFuY2VJbmRleFxuICAgIFswXTogKG9iamVjdCB8IEluc3RhbmNlSW5kZXgpLFxuICAgIC8vIHByb3BlcnR5IG5hbWVcbiAgICBbMV0/OiBTdHJpbmdJbmRleEJub3ROdW1iZXI7XG4gICAgLy8gdGFyZ2V0IG9iamVjdFxuICAgIFsyXT86IEluc3RhbmNlSW5kZXg7XG4gICAgLy8gQWxsIHRoZSBmb2xsb3dpbmcgb2JqZWN0cyBhcmUgYXJyYW5nZWQgaW4gdGhlIG9yZGVyIG9mIHRoZSBmaXJzdCB0aHJlZSB2YWx1ZXMsXG4gICAgLy8gZXhjZXB0IHRoYXQgdGhlIGxhc3QgbnVtYmVyIHJlcHJlc2VudHMgT0ZGU0VULlxuICAgIFtpbmRleDogbnVtYmVyXTogYW55O1xufVxuXG4vKkBfX0RST1BfUFVSRV9FWFBPUlRfXyovXG5leHBvcnQgY29uc3QgZW51bSBGaWxlIHtcbiAgICBWZXJzaW9uID0gMCxcbiAgICBDb250ZXh0ID0gMCxcblxuICAgIFNoYXJlZFV1aWRzLFxuICAgIFNoYXJlZFN0cmluZ3MsXG4gICAgU2hhcmVkQ2xhc3NlcyxcbiAgICBTaGFyZWRNYXNrcyxcblxuICAgIEluc3RhbmNlcyxcbiAgICBJbnN0YW5jZVR5cGVzLFxuXG4gICAgUmVmcyxcblxuICAgIERlcGVuZE9ianMsXG4gICAgRGVwZW5kS2V5cyxcbiAgICBEZXBlbmRVdWlkSW5kaWNlcyxcblxuICAgIEFSUkFZX0xFTkdUSCxcbn1cblxuLy8gTWFpbiBmaWxlIHN0cnVjdHVyZVxuZXhwb3J0IGludGVyZmFjZSBJRmlsZURhdGEgZXh0ZW5kcyBBcnJheTxhbnk+IHtcbiAgICAvLyB2ZXJzaW9uXG4gICAgW0ZpbGUuVmVyc2lvbl06IG51bWJlciB8IEZpbGVJbmZvIHwgYW55O1xuXG4gICAgLy8gU2hhcmVkIGRhdGEgYXJlYSwgdGhlIGhpZ2hlciB0aGUgbnVtYmVyIG9mIHJlZmVyZW5jZXMsIHRoZSBoaWdoZXIgdGhlIHBvc2l0aW9uXG5cbiAgICBbRmlsZS5TaGFyZWRVdWlkc106IFNoYXJlZFN0cmluZ1tdIHwgRW1wdHk7IC8vIFNoYXJlZCB1dWlkIHN0cmluZ3MgZm9yIGRlcGVuZGVudCBhc3NldHNcbiAgICBbRmlsZS5TaGFyZWRTdHJpbmdzXTogU2hhcmVkU3RyaW5nW10gfCBFbXB0eTtcbiAgICBbRmlsZS5TaGFyZWRDbGFzc2VzXTogKElDbGFzc3xzdHJpbmd8QW55Q0NDbGFzcylbXTtcbiAgICBbRmlsZS5TaGFyZWRNYXNrc106IElNYXNrW10gfCBFbXB0eTsgIC8vIFNoYXJlZCBPYmplY3QgbGF5b3V0cyBmb3IgSUNsYXNzT2JqZWN0RGF0YVxuXG4gICAgLy8gRGF0YSBhcmVhXG5cbiAgICAvLyBBIG9uZS1kaW1lbnNpb25hbCBhcnJheSB0byByZXByZXNlbnQgb2JqZWN0IGRhdGFzLCBsYXlvdXQgaXMgWy4uLklDbGFzc09iamVjdERhdGFbXSwgLi4uT3RoZXJPYmplY3REYXRhW10sIFJvb3RJbmZvXVxuICAgIC8vIElmIHRoZSBsYXN0IGVsZW1lbnQgaXMgbm90IFJvb3RJbmZvKG51bWJlciksIHRoZSBmaXJzdCBlbGVtZW50IHdpbGwgYmUgdGhlIHJvb3Qgb2JqZWN0IHRvIHJldHVybiBhbmQgaXQgZG9lc24ndCBoYXZlIG5hdGl2ZSBhc3NldFxuICAgIFtGaWxlLkluc3RhbmNlc106IChJQ2xhc3NPYmplY3REYXRhfE90aGVyT2JqZWN0RGF0YXxSb290SW5mbylbXTtcbiAgICBbRmlsZS5JbnN0YW5jZVR5cGVzXTogT3RoZXJPYmplY3RUeXBlSURbXSB8IEVtcHR5O1xuICAgIC8vIE9iamVjdCByZWZlcmVuY2VzIGluZm9tYXRpb25cbiAgICBbRmlsZS5SZWZzXTogSVJlZnMgfCBFbXB0eTtcblxuICAgIC8vIFJlc3VsdCBhcmVhXG5cbiAgICAvLyBBc3NldC1kZXBlbmRlbnQgb2JqZWN0cyB0aGF0IGFyZSBkZXNlcmlhbGl6ZWQgYW5kIHBhcnNlZCBpbnRvIG9iamVjdCBhcnJheXNcbiAgICBbRmlsZS5EZXBlbmRPYmpzXTogKG9iamVjdHxJbnN0YW5jZUluZGV4KVtdO1xuICAgIC8vIEFzc2V0LWRlcGVuZGVudCBrZXkgbmFtZSBvciBhcnJheSBpbmRleFxuICAgIFtGaWxlLkRlcGVuZEtleXNdOiAoU3RyaW5nSW5kZXhCbm90TnVtYmVyfHN0cmluZylbXTtcbiAgICAvLyBVVUlEIG9mIGRlcGVuZGVudCBhc3NldHNcbiAgICBbRmlsZS5EZXBlbmRVdWlkSW5kaWNlc106IChTdHJpbmdJbmRleHxzdHJpbmcpW107XG59XG5cbi8vIHR5cGUgQm9keSA9IFBpY2s8SUZpbGVEYXRhLCBGaWxlLkluc3RhbmNlcyB8IEZpbGUuSW5zdGFuY2VUeXBlcyB8IEZpbGUuUmVmcyB8IEZpbGUuRGVwZW5kT2JqcyB8IEZpbGUuRGVwZW5kS2V5cyB8IEZpbGUuRGVwZW5kVXVpZEluZGljZXM+XG50eXBlIFNoYXJlZCA9IFBpY2s8SUZpbGVEYXRhLCBGaWxlLlZlcnNpb24gfCBGaWxlLlNoYXJlZFV1aWRzIHwgRmlsZS5TaGFyZWRTdHJpbmdzIHwgRmlsZS5TaGFyZWRDbGFzc2VzIHwgRmlsZS5TaGFyZWRNYXNrcz5cbmNvbnN0IFBBQ0tFRF9TRUNUSU9OUyA9IEZpbGUuSW5zdGFuY2VzO1xuZXhwb3J0IGludGVyZmFjZSBJUGFja2VkRmlsZURhdGEgZXh0ZW5kcyBTaGFyZWQge1xuICAgIFtQQUNLRURfU0VDVElPTlNdOiBJRmlsZURhdGFbXTtcbn1cblxuaW50ZXJmYWNlIElDdXN0b21IYW5kbGVyIHtcbiAgICByZXN1bHQ6IERldGFpbHMsXG4gICAgY3VzdG9tRW52OiBhbnksXG59XG50eXBlIENsYXNzRmluZGVyID0ge1xuICAgICh0eXBlOiBzdHJpbmcpOiBBbnlDdG9yO1xuICAgIC8vIC8vIGZvciBlZGl0b3JcbiAgICAvLyBvbkRlcmVmZXJlbmNlZDogKGN1ck93bmVyOiBvYmplY3QsIGN1clByb3BOYW1lOiBzdHJpbmcsIG5ld093bmVyOiBvYmplY3QsIG5ld1Byb3BOYW1lOiBzdHJpbmcpID0+IHZvaWQ7XG59O1xuaW50ZXJmYWNlIElPcHRpb25zIGV4dGVuZHMgUGFydGlhbDxJQ3VzdG9tSGFuZGxlcj4ge1xuICAgIGNsYXNzRmluZGVyPzogQ2xhc3NGaW5kZXI7XG4gICAgX3ZlcnNpb24/OiBudW1iZXI7XG59XG5pbnRlcmZhY2UgSUN1c3RvbUNsYXNzIHtcbiAgICBfZGVzZXJpYWxpemU6IChjb250ZW50OiBhbnksIGNvbnRleHQ6IElDdXN0b21IYW5kbGVyKSA9PiB2b2lkO1xufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogSU1QTEVNRU5UU1xuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogISNlbiBDb250YWlucyBtZXRhIGluZm9ybWF0aW9uIGNvbGxlY3RlZCBkdXJpbmcgZGVzZXJpYWxpemF0aW9uXG4gKiAhI3poIOWMheWQq+WPjeW6j+WIl+WMluWQjumZhOW4pueahOWFg+S/oeaBr1xuICogQGNsYXNzIERldGFpbHNcbiAqL1xuY2xhc3MgRGV0YWlscyB7XG4gICAgLyoqXG4gICAgICogdGhlIG9iaiBsaXN0IHdob3NlIGZpZWxkIG5lZWRzIHRvIGxvYWQgYXNzZXQgYnkgdXVpZFxuICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0W119IHV1aWRPYmpMaXN0XG4gICAgICovXG4gICAgdXVpZE9iakxpc3Q6IElGaWxlRGF0YVtGaWxlLkRlcGVuZE9ianNdIHwgbnVsbCA9IG51bGw7XG4gICAgLyoqXG4gICAgICogdGhlIGNvcnJlc3BvbmRpbmcgZmllbGQgbmFtZSB3aGljaCByZWZlcmVuY2VkIHRvIHRoZSBhc3NldFxuICAgICAqIEBwcm9wZXJ0eSB7KFN0cmluZ3xOdW1iZXIpW119IHV1aWRQcm9wTGlzdFxuICAgICAqL1xuICAgIHV1aWRQcm9wTGlzdDogSUZpbGVEYXRhW0ZpbGUuRGVwZW5kS2V5c10gfCBudWxsID0gbnVsbDtcbiAgICAvKipcbiAgICAgKiBsaXN0IG9mIHRoZSBkZXBlbmRzIGFzc2V0cycgdXVpZFxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nW119IHV1aWRMaXN0XG4gICAgICovXG4gICAgdXVpZExpc3Q6IElGaWxlRGF0YVtGaWxlLkRlcGVuZFV1aWRJbmRpY2VzXSB8IG51bGwgPSBudWxsO1xuXG4gICAgc3RhdGljIHBvb2wgPSBuZXcganMuUG9vbChmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIG9iai5yZXNldCgpO1xuICAgIH0sIDUpO1xuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBpbml0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICAgKi9cbiAgICBpbml0IChkYXRhOiBJRmlsZURhdGEpIHtcbiAgICAgICAgdGhpcy51dWlkT2JqTGlzdCA9IGRhdGFbRmlsZS5EZXBlbmRPYmpzXTtcbiAgICAgICAgdGhpcy51dWlkUHJvcExpc3QgPSBkYXRhW0ZpbGUuRGVwZW5kS2V5c107XG4gICAgICAgIHRoaXMudXVpZExpc3QgPSBkYXRhW0ZpbGUuRGVwZW5kVXVpZEluZGljZXNdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgcmVzZXRcbiAgICAgKi9cbiAgICByZXNldCAgKCkge1xuICAgICAgICB0aGlzLnV1aWRMaXN0ID0gbnVsbDtcbiAgICAgICAgdGhpcy51dWlkT2JqTGlzdCA9IG51bGw7XG4gICAgICAgIHRoaXMudXVpZFByb3BMaXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBwdXNoXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9ialxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wTmFtZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1dWlkXG4gICAgICovXG4gICAgcHVzaCAob2JqOiBvYmplY3QsIHByb3BOYW1lOiBzdHJpbmcsIHV1aWQ6IHN0cmluZykge1xuICAgICAgICAodGhpcy51dWlkT2JqTGlzdCBhcyBvYmplY3RbXSkucHVzaChvYmopO1xuICAgICAgICAodGhpcy51dWlkUHJvcExpc3QgYXMgc3RyaW5nW10pLnB1c2gocHJvcE5hbWUpO1xuICAgICAgICAodGhpcy51dWlkTGlzdCBhcyBzdHJpbmdbXSkucHVzaCh1dWlkKTtcbiAgICB9O1xufVxuRGV0YWlscy5wb29sLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0KCkgfHwgbmV3IERldGFpbHMoKTtcbn07XG5pZiAoQ0NfRURJVE9SIHx8IENDX1RFU1QpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgRGV0YWlscy5wcm90b3R5cGUuYXNzaWduQXNzZXRzQnkgPSBmdW5jdGlvbiAoZ2V0dGVyOiAodXVpZDogc3RyaW5nKSA9PiBhbnkpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9ICh0aGlzLnV1aWRMaXN0IGFzIHN0cmluZ1tdKS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdmFyIG9iaiA9ICh0aGlzLnV1aWRPYmpMaXN0IGFzIG9iamVjdClbaV07XG4gICAgICAgICAgICB2YXIgcHJvcCA9ICh0aGlzLnV1aWRQcm9wTGlzdCBhcyBhbnlbXSlbaV07XG4gICAgICAgICAgICB2YXIgdXVpZCA9ICh0aGlzLnV1aWRMaXN0IGFzIHN0cmluZ1tdKVtpXTtcbiAgICAgICAgICAgIG9ialtwcm9wXSA9IGdldHRlcih1dWlkIGFzIHN0cmluZyk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5mdW5jdGlvbiBkZXJlZmVyZW5jZShyZWZzOiBJUmVmcywgaW5zdGFuY2VzOiBJRmlsZURhdGFbRmlsZS5JbnN0YW5jZXNdLCBzdHJpbmdzOiBJRmlsZURhdGFbRmlsZS5TaGFyZWRTdHJpbmdzXSk6IHZvaWQge1xuICAgIGxldCBkYXRhTGVuZ3RoID0gcmVmcy5sZW5ndGggLSAxO1xuICAgIGxldCBpID0gMDtcbiAgICAvLyBvd25lciBpcyBvYmplY3RcbiAgICBsZXQgaW5zdGFuY2VPZmZzZXQ6IG51bWJlciA9IHJlZnNbZGF0YUxlbmd0aF0gKiBSZWZzLkVBQ0hfUkVDT1JEX0xFTkdUSDtcbiAgICBmb3IgKDsgaSA8IGluc3RhbmNlT2Zmc2V0OyBpICs9IFJlZnMuRUFDSF9SRUNPUkRfTEVOR1RIKSB7XG4gICAgICAgIGNvbnN0IG93bmVyID0gcmVmc1tpXSBhcyBhbnk7XG5cbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gaW5zdGFuY2VzW3JlZnNbaSArIFJlZnMuVEFSR0VUX09GRlNFVF1dO1xuICAgICAgICBjb25zdCBrZXlJbmRleCA9IHJlZnNbaSArIFJlZnMuS0VZX09GRlNFVF0gYXMgU3RyaW5nSW5kZXhCbm90TnVtYmVyO1xuICAgICAgICBpZiAoa2V5SW5kZXggPj0gMCkge1xuICAgICAgICAgICAgb3duZXJbc3RyaW5nc1trZXlJbmRleF1dID0gdGFyZ2V0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb3duZXJbfmtleUluZGV4XSA9IHRhcmdldDtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBvd25lciBpcyBpbnN0YW5jZSBpbmRleFxuICAgIGZvciAoOyBpIDwgZGF0YUxlbmd0aDsgaSArPSBSZWZzLkVBQ0hfUkVDT1JEX0xFTkdUSCkge1xuICAgICAgICBjb25zdCBvd25lciA9IGluc3RhbmNlc1tyZWZzW2ldXSBhcyBhbnk7XG5cbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gaW5zdGFuY2VzW3JlZnNbaSArIFJlZnMuVEFSR0VUX09GRlNFVF1dO1xuICAgICAgICBjb25zdCBrZXlJbmRleCA9IHJlZnNbaSArIFJlZnMuS0VZX09GRlNFVF0gYXMgU3RyaW5nSW5kZXhCbm90TnVtYmVyO1xuICAgICAgICBpZiAoa2V5SW5kZXggPj0gMCkge1xuICAgICAgICAgICAgb3duZXJbc3RyaW5nc1trZXlJbmRleF1dID0gdGFyZ2V0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb3duZXJbfmtleUluZGV4XSA9IHRhcmdldDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy9cblxuZnVuY3Rpb24gZGVzZXJpYWxpemVDQ09iamVjdCAoZGF0YTogSUZpbGVEYXRhLCBvYmplY3REYXRhOiBJQ2xhc3NPYmplY3REYXRhKSB7XG4gICAgbGV0IG1hc2sgPSBkYXRhW0ZpbGUuU2hhcmVkTWFza3NdW29iamVjdERhdGFbT0JKX0RBVEFfTUFTS11dO1xuICAgIGxldCBjbGF6eiA9IG1hc2tbTUFTS19DTEFTU107XG4gICAgbGV0IGN0b3IgPSBjbGF6eltDTEFTU19UWVBFXSBhcyBFeGNsdWRlPEFueUN0b3IsIElDdXN0b21DbGFzcz47XG4gICAgLy8gaWYgKCFjdG9yKSB7XG4gICAgLy8gICAgIHJldHVybiBudWxsO1xuICAgIC8vIH1cblxuICAgIGxldCBvYmogPSBuZXcgY3RvcigpO1xuXG4gICAgbGV0IGtleXMgPSBjbGF6eltDTEFTU19LRVlTXTtcbiAgICBsZXQgY2xhc3NUeXBlT2Zmc2V0ID0gY2xhenpbQ0xBU1NfUFJPUF9UWVBFX09GRlNFVF07XG4gICAgbGV0IG1hc2tUeXBlT2Zmc2V0ID0gbWFza1ttYXNrLmxlbmd0aCAtIDFdO1xuXG4gICAgLy8gcGFyc2Ugc2ltcGxlIHR5cGVcbiAgICBsZXQgaSA9IE1BU0tfQ0xBU1MgKyAxO1xuICAgIGZvciAoOyBpIDwgbWFza1R5cGVPZmZzZXQ7ICsraSkge1xuICAgICAgICBsZXQga2V5ID0ga2V5c1ttYXNrW2ldXTtcbiAgICAgICAgb2JqW2tleV0gPSBvYmplY3REYXRhW2ldO1xuICAgIH1cblxuICAgIC8vIHBhcnNlIGFkdmFuY2VkIHR5cGVcbiAgICBmb3IgKDsgaSA8IG9iamVjdERhdGEubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgbGV0IGtleSA9IGtleXNbbWFza1tpXV07XG4gICAgICAgIGxldCB0eXBlID0gY2xhenpbbWFza1tpXSArIGNsYXNzVHlwZU9mZnNldF07XG4gICAgICAgIGxldCBvcCA9IEFTU0lHTk1FTlRTW3R5cGVdO1xuICAgICAgICBvcChkYXRhLCBvYmosIGtleSwgb2JqZWN0RGF0YVtpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbn1cblxuZnVuY3Rpb24gZGVzZXJpYWxpemVDdXN0b21DQ09iamVjdCAoZGF0YTogSUZpbGVEYXRhLCBjdG9yOiBDdG9yPElDdXN0b21DbGFzcz4sIHZhbHVlOiBJQ3VzdG9tT2JqZWN0RGF0YUNvbnRlbnQpIHtcbiAgICBsZXQgb2JqID0gbmV3IGN0b3IoKTtcbiAgICBpZiAob2JqLl9kZXNlcmlhbGl6ZSkge1xuICAgICAgICBvYmouX2Rlc2VyaWFsaXplKHZhbHVlLCBkYXRhW0ZpbGUuQ29udGV4dF0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY2MuZXJyb3JJRCg1MzAzLCBqcy5nZXRDbGFzc05hbWUoY3RvcikpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xufVxuXG4vLyBQYXJzZSBGdW5jdGlvbnNcblxudHlwZSBQYXJzZUZ1bmN0aW9uID0gKGRhdGE6IElGaWxlRGF0YSwgb3duZXI6IGFueSwga2V5OiBzdHJpbmcsIHZhbHVlOiBBbnlEYXRhKSA9PiB2b2lkO1xuXG5mdW5jdGlvbiBhc3NpZ25TaW1wbGUgKGRhdGE6IElGaWxlRGF0YSwgb3duZXI6IGFueSwga2V5OiBzdHJpbmcsIHZhbHVlOiBEYXRhVHlwZXNbRGF0YVR5cGVJRC5TaW1wbGVUeXBlXSkge1xuICAgIG93bmVyW2tleV0gPSB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gYXNzaWduSW5zdGFuY2VSZWYgKGRhdGE6IElGaWxlRGF0YSwgb3duZXI6IGFueSwga2V5OiBzdHJpbmcsIHZhbHVlOiBJbnN0YW5jZUJub3RSZXZlcnNlSW5kZXgpIHtcbiAgICBpZiAodmFsdWUgPj0gMCkge1xuICAgICAgICBvd25lcltrZXldID0gZGF0YVtGaWxlLkluc3RhbmNlc11bdmFsdWVdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgKGRhdGFbRmlsZS5SZWZzXSBhcyBJUmVmcylbKH52YWx1ZSkgKiBSZWZzLkVBQ0hfUkVDT1JEX0xFTkdUSF0gPSBvd25lcjtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdlbkFycmF5UGFyc2VyIChwYXJzZXI6IFBhcnNlRnVuY3Rpb24pOiBQYXJzZUZ1bmN0aW9uIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGE6IElGaWxlRGF0YSwgb3duZXI6IGFueSwga2V5OiBzdHJpbmcsIHZhbHVlOiBBcnJheTxhbnk+KSB7XG4gICAgICAgIG93bmVyW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgcGFyc2VyKGRhdGEsIHZhbHVlLCBpLCB2YWx1ZVtpXSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5mdW5jdGlvbiBwYXJzZUFzc2V0UmVmQnlJbm5lck9iaiAoZGF0YTogSUZpbGVEYXRhLCBvd25lcjogYW55LCBrZXk6IHN0cmluZywgdmFsdWU6IG51bWJlcikge1xuICAgIG93bmVyW2tleV0gPSBudWxsO1xuICAgIGRhdGFbRmlsZS5EZXBlbmRPYmpzXVt2YWx1ZV0gPSBvd25lcjtcbn1cblxuZnVuY3Rpb24gcGFyc2VDbGFzcyAoZGF0YTogSUZpbGVEYXRhLCBvd25lcjogYW55LCBrZXk6IHN0cmluZywgdmFsdWU6IElDbGFzc09iamVjdERhdGEpIHtcbiAgICBvd25lcltrZXldID0gZGVzZXJpYWxpemVDQ09iamVjdChkYXRhLCB2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlQ3VzdG9tQ2xhc3MgKGRhdGE6IElGaWxlRGF0YSwgb3duZXI6IGFueSwga2V5OiBzdHJpbmcsIHZhbHVlOiBJQ3VzdG9tT2JqZWN0RGF0YSkge1xuICAgIGxldCBjdG9yID0gZGF0YVtGaWxlLlNoYXJlZENsYXNzZXNdW3ZhbHVlW0NVU1RPTV9PQkpfREFUQV9DTEFTU11dIGFzIENDQ2xhc3M8SUN1c3RvbUNsYXNzPjtcbiAgICBvd25lcltrZXldID0gZGVzZXJpYWxpemVDdXN0b21DQ09iamVjdChkYXRhLCBjdG9yLCB2YWx1ZVtDVVNUT01fT0JKX0RBVEFfQ09OVEVOVF0pO1xufVxuXG5mdW5jdGlvbiBwYXJzZVZhbHVlVHlwZUNyZWF0ZWQgKGRhdGE6IElGaWxlRGF0YSwgb3duZXI6IGFueSwga2V5OiBzdHJpbmcsIHZhbHVlOiBJVmFsdWVUeXBlRGF0YSkge1xuICAgIEJ1aWx0aW5WYWx1ZVR5cGVTZXR0ZXJzW3ZhbHVlW1ZBTFVFVFlQRV9TRVRURVJdXShvd25lcltrZXldLCB2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVmFsdWVUeXBlIChkYXRhOiBJRmlsZURhdGEsIG93bmVyOiBhbnksIGtleTogc3RyaW5nLCB2YWx1ZTogSVZhbHVlVHlwZURhdGEpIHtcbiAgICBsZXQgdmFsOiBWYWx1ZVR5cGUgPSBuZXcgQnVpbHRpblZhbHVlVHlwZXNbdmFsdWVbVkFMVUVUWVBFX1NFVFRFUl1dKCk7XG4gICAgQnVpbHRpblZhbHVlVHlwZVNldHRlcnNbdmFsdWVbVkFMVUVUWVBFX1NFVFRFUl1dKHZhbCwgdmFsdWUpO1xuICAgIG93bmVyW2tleV0gPSB2YWw7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVFJTIChkYXRhOiBJRmlsZURhdGEsIG93bmVyOiBhbnksIGtleTogc3RyaW5nLCB2YWx1ZTogSVRSU0RhdGEpIHtcbiAgICBsZXQgdHlwZWRBcnJheSA9IG93bmVyW2tleV0gYXMgKEZsb2F0MzJBcnJheSB8IEZsb2F0NjRBcnJheSk7XG4gICAgdHlwZWRBcnJheS5zZXQodmFsdWUpO1xufVxuXG5mdW5jdGlvbiBwYXJzZURpY3QgKGRhdGE6IElGaWxlRGF0YSwgb3duZXI6IGFueSwga2V5OiBzdHJpbmcsIHZhbHVlOiBJRGljdERhdGEpIHtcbiAgICBsZXQgZGljdCA9IHZhbHVlW0RJQ1RfSlNPTl9MQVlPVVRdO1xuICAgIG93bmVyW2tleV0gPSBkaWN0O1xuICAgIGZvciAobGV0IGkgPSBESUNUX0pTT05fTEFZT1VUICsgMTsgaSA8IHZhbHVlLmxlbmd0aDsgaSArPSAzKSB7XG4gICAgICAgIGxldCBrZXkgPSB2YWx1ZVtpXSBhcyBzdHJpbmc7XG4gICAgICAgIGxldCB0eXBlID0gdmFsdWVbaSArIDFdIGFzIERhdGFUeXBlSUQ7XG4gICAgICAgIGxldCBzdWJWYWx1ZSA9IHZhbHVlW2kgKyAyXSBhcyBBbnlEYXRhO1xuICAgICAgICBsZXQgb3AgPSBBU1NJR05NRU5UU1t0eXBlXTtcbiAgICAgICAgb3AoZGF0YSwgZGljdCwga2V5LCBzdWJWYWx1ZSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZUFycmF5IChkYXRhOiBJRmlsZURhdGEsIG93bmVyOiBhbnksIGtleTogc3RyaW5nLCB2YWx1ZTogSUFycmF5RGF0YSkge1xuICAgIGxldCBhcnJheSA9IHZhbHVlW0FSUkFZX0lURU1fVkFMVUVTXTtcbiAgICBvd25lcltrZXldID0gYXJyYXk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7ICsraSkge1xuICAgICAgICBsZXQgc3ViVmFsdWUgPSBhcnJheVtpXSBhcyBBbnlEYXRhO1xuICAgICAgICBsZXQgdHlwZSA9IHZhbHVlW2kgKyAxXSBhcyBEYXRhVHlwZUlEO1xuICAgICAgICBpZiAodHlwZSAhPT0gRGF0YVR5cGVJRC5TaW1wbGVUeXBlKSB7XG4gICAgICAgICAgICBsZXQgb3AgPSBBU1NJR05NRU5UU1t0eXBlXTtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIG9wKGRhdGEsIGFycmF5LCBpLCBzdWJWYWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIGZ1bmN0aW9uIHBhcnNlVHlwZWRBcnJheSAoZGF0YTogSUZpbGVEYXRhLCBvd25lcjogYW55LCBrZXk6IHN0cmluZywgdmFsdWU6IElUeXBlZEFycmF5RGF0YSkge1xuLy8gICAgIGxldCB2YWw6IFZhbHVlVHlwZSA9IG5ldyBUeXBlZEFycmF5c1t2YWx1ZVtUWVBFREFSUkFZX1RZUEVdXSgpO1xuLy8gICAgIEJ1aWx0aW5WYWx1ZVR5cGVTZXR0ZXJzW3ZhbHVlW1ZBTFVFVFlQRV9TRVRURVJdXSh2YWwsIHZhbHVlKTtcbi8vICAgICAvLyBvYmogPSBuZXcgd2luZG93W3NlcmlhbGl6ZWQuY3Rvcl0oYXJyYXkubGVuZ3RoKTtcbi8vICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgKytpKSB7XG4vLyAgICAgLy8gICAgIG9ialtpXSA9IGFycmF5W2ldO1xuLy8gICAgIC8vIH1cbi8vICAgICAvLyByZXR1cm4gb2JqO1xuLy8gICAgIG93bmVyW2tleV0gPSB2YWw7XG4vLyB9XG5cbmNvbnN0IEFTU0lHTk1FTlRTID0gbmV3IEFycmF5PFBhcnNlRnVuY3Rpb24+KERhdGFUeXBlSUQuQVJSQVlfTEVOR1RIKTtcbkFTU0lHTk1FTlRTW0RhdGFUeXBlSUQuU2ltcGxlVHlwZV0gPSBhc3NpZ25TaW1wbGU7ICAgIC8vIE9ubHkgYmUgdXNlZCBpbiB0aGUgaW5zdGFuY2VzIGFycmF5XG5BU1NJR05NRU5UU1tEYXRhVHlwZUlELkluc3RhbmNlUmVmXSA9IGFzc2lnbkluc3RhbmNlUmVmO1xuQVNTSUdOTUVOVFNbRGF0YVR5cGVJRC5BcnJheV9JbnN0YW5jZVJlZl0gPSBnZW5BcnJheVBhcnNlcihhc3NpZ25JbnN0YW5jZVJlZik7XG5BU1NJR05NRU5UU1tEYXRhVHlwZUlELkFycmF5X0Fzc2V0UmVmQnlJbm5lck9ial0gPSBnZW5BcnJheVBhcnNlcihwYXJzZUFzc2V0UmVmQnlJbm5lck9iaik7XG5BU1NJR05NRU5UU1tEYXRhVHlwZUlELkNsYXNzXSA9IHBhcnNlQ2xhc3M7XG5BU1NJR05NRU5UU1tEYXRhVHlwZUlELlZhbHVlVHlwZUNyZWF0ZWRdID0gcGFyc2VWYWx1ZVR5cGVDcmVhdGVkO1xuQVNTSUdOTUVOVFNbRGF0YVR5cGVJRC5Bc3NldFJlZkJ5SW5uZXJPYmpdID0gcGFyc2VBc3NldFJlZkJ5SW5uZXJPYmo7XG5BU1NJR05NRU5UU1tEYXRhVHlwZUlELlRSU10gPSBwYXJzZVRSUztcbkFTU0lHTk1FTlRTW0RhdGFUeXBlSUQuVmFsdWVUeXBlXSA9IHBhcnNlVmFsdWVUeXBlO1xuQVNTSUdOTUVOVFNbRGF0YVR5cGVJRC5BcnJheV9DbGFzc10gPSBnZW5BcnJheVBhcnNlcihwYXJzZUNsYXNzKTtcbkFTU0lHTk1FTlRTW0RhdGFUeXBlSUQuQ3VzdG9taXplZENsYXNzXSA9IHBhcnNlQ3VzdG9tQ2xhc3M7XG5BU1NJR05NRU5UU1tEYXRhVHlwZUlELkRpY3RdID0gcGFyc2VEaWN0O1xuQVNTSUdOTUVOVFNbRGF0YVR5cGVJRC5BcnJheV0gPSBwYXJzZUFycmF5O1xuLy8gQVNTSUdOTUVOVFNbRGF0YVR5cGVJRC5UeXBlZEFycmF5XSA9IHBhcnNlVHlwZWRBcnJheTtcblxuXG5cbmZ1bmN0aW9uIHBhcnNlSW5zdGFuY2VzIChkYXRhOiBJRmlsZURhdGEpOiBSb290SW5zdGFuY2VJbmRleCB7XG4gICAgbGV0IGluc3RhbmNlcyA9IGRhdGFbRmlsZS5JbnN0YW5jZXNdO1xuICAgIGxldCBpbnN0YW5jZVR5cGVzID0gZGF0YVtGaWxlLkluc3RhbmNlVHlwZXNdO1xuICAgIGxldCBpbnN0YW5jZVR5cGVzTGVuID0gaW5zdGFuY2VUeXBlcyA9PT0gRU1QVFlfUExBQ0VIT0xERVIgPyAwIDogKGluc3RhbmNlVHlwZXMgYXMgT3RoZXJPYmplY3RUeXBlSURbXSkubGVuZ3RoO1xuICAgIGxldCByb290SW5kZXggPSBpbnN0YW5jZXNbaW5zdGFuY2VzLmxlbmd0aCAtIDFdO1xuICAgIGxldCBub3JtYWxPYmplY3RDb3VudCA9IGluc3RhbmNlcy5sZW5ndGggLSBpbnN0YW5jZVR5cGVzTGVuO1xuICAgIGlmICh0eXBlb2Ygcm9vdEluZGV4ICE9PSAnbnVtYmVyJykge1xuICAgICAgICByb290SW5kZXggPSAwO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKHJvb3RJbmRleCA8IDApIHtcbiAgICAgICAgICAgIHJvb3RJbmRleCA9IH5yb290SW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgLS1ub3JtYWxPYmplY3RDb3VudDtcbiAgICB9XG5cbiAgICAvLyBEYXRhVHlwZUlELkNsYXNzXG5cbiAgICBsZXQgaW5zSW5kZXggPSAwO1xuICAgIGZvciAoOyBpbnNJbmRleCA8IG5vcm1hbE9iamVjdENvdW50OyArK2luc0luZGV4KSB7XG4gICAgICAgIGluc3RhbmNlc1tpbnNJbmRleF0gPSBkZXNlcmlhbGl6ZUNDT2JqZWN0KGRhdGEsIGluc3RhbmNlc1tpbnNJbmRleF0gYXMgSUNsYXNzT2JqZWN0RGF0YSk7XG4gICAgfVxuXG4gICAgbGV0IGNsYXNzZXMgPSBkYXRhW0ZpbGUuU2hhcmVkQ2xhc3Nlc107XG4gICAgZm9yIChsZXQgdHlwZUluZGV4ID0gMDsgdHlwZUluZGV4IDwgaW5zdGFuY2VUeXBlc0xlbjsgKyt0eXBlSW5kZXgsICsraW5zSW5kZXgpIHtcbiAgICAgICAgbGV0IHR5cGUgPSBpbnN0YW5jZVR5cGVzW3R5cGVJbmRleF0gYXMgT3RoZXJPYmplY3RUeXBlSUQ7XG4gICAgICAgIGxldCBlYWNoRGF0YSA9IGluc3RhbmNlc1tpbnNJbmRleF07XG4gICAgICAgIGlmICh0eXBlID49IDApIHtcblxuICAgICAgICAgICAgLy8gY2xhc3MgaW5kZXggZm9yIERhdGFUeXBlSUQuQ3VzdG9taXplZENsYXNzXG5cbiAgICAgICAgICAgIGxldCBjdG9yID0gY2xhc3Nlc1t0eXBlXSBhcyBDQ0NsYXNzPElDdXN0b21DbGFzcz47ICAvLyBjbGFzc1xuICAgICAgICAgICAgaW5zdGFuY2VzW2luc0luZGV4XSA9IGRlc2VyaWFsaXplQ3VzdG9tQ0NPYmplY3QoZGF0YSwgY3RvciwgZWFjaERhdGEgYXMgSUN1c3RvbU9iamVjdERhdGFDb250ZW50KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgLy8gT3RoZXJcblxuICAgICAgICAgICAgdHlwZSA9ICh+dHlwZSkgYXMgUHJpbWl0aXZlT2JqZWN0VHlwZUlEO1xuICAgICAgICAgICAgbGV0IG9wID0gQVNTSUdOTUVOVFNbdHlwZV07XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBvcChkYXRhLCBpbnN0YW5jZXMsIGluc0luZGV4LCBlYWNoRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcm9vdEluZGV4O1xufVxuXG4vLyBjb25zdCBERVNFUklBTElaRV9BUyA9IEF0dHIuREVMSU1FVEVSICsgJ2Rlc2VyaWFsaXplQXMnO1xuLy8gZnVuY3Rpb24gZGVzZXJpYWxpemVBcyhrbGFzczogQW55Q0NDbGFzcywga2xhc3NMYXlvdXQ6IElDbGFzcykge1xuLy8gICAgIHZhciBhdHRycyA9IEF0dHIuZ2V0Q2xhc3NBdHRycyhrbGFzcyk7XG4vLyAgICAgbGV0IGtleXMgPSBrbGFzc0xheW91dFtDTEFTU19LRVlTXTtcbi8vICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbi8vICAgICAgICAgbGV0IG5ld0tleSA9IGF0dHJzW2tleXNbaV0gKyBERVNFUklBTElaRV9BU107XG4vLyAgICAgICAgIGlmIChuZXdLZXkpIHtcbi8vICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbi8vICAgICAgICAgICAgIGlmIChrZXlzLmluY2x1ZGVzKG5ld0tleSkpIHtcbi8vICAgICAgICAgICAgICAgICAvLyAlcyBjYW5ub3QgYmUgZGVzZXJpYWxpemVkIGJ5IHByb3BlcnR5ICVzIGJlY2F1c2UgJXMgd2FzIGFsc28gcHJlc2VudCBpbiB0aGUgc2VyaWFsaXplZCBkYXRhLlxuLy8gICAgICAgICAgICAgICAgIGNjLndhcm5JRCgsIG5ld0tleSwga2V5c1tpXSwgbmV3S2V5KTtcbi8vICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgIGVsc2Uge1xuLy8gICAgICAgICAgICAgICAgIGtleXNbaV0gPSBuZXdLZXk7XG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgIH1cbi8vICAgICB9XG4vLyB9XG5cbmZ1bmN0aW9uIGdldE1pc3NpbmdDbGFzcyAoaGFzQ3VzdG9tRmluZGVyLCB0eXBlKSB7XG4gICAgaWYgKCFoYXNDdXN0b21GaW5kZXIpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBkZXNlcmlhbGl6ZS5yZXBvcnRNaXNzaW5nQ2xhc3ModHlwZSk7XG4gICAgfVxuICAgIHJldHVybiBPYmplY3Q7XG59XG5mdW5jdGlvbiBkb0xvb2t1cENsYXNzKGNsYXNzRmluZGVyLCB0eXBlOiBzdHJpbmcsIGNvbnRhaW5lcjogYW55W10sIGluZGV4OiBudW1iZXIsIHNpbGVudDogYm9vbGVhbiwgaGFzQ3VzdG9tRmluZGVyKSB7XG4gICAgbGV0IGtsYXNzID0gY2xhc3NGaW5kZXIodHlwZSk7XG4gICAgaWYgKCFrbGFzcykge1xuICAgICAgICAvLyBpZiAoa2xhc3MuX19GU0FfXykge1xuICAgICAgICAvLyAgICAgZGVzZXJpYWxpemVBcyhrbGFzcywga2xhc3NMYXlvdXQgYXMgSUNsYXNzKTtcbiAgICAgICAgLy8gfVxuICAgICAgICBpZiAoc2lsZW50KSB7XG4gICAgICAgICAgICAvLyBnZW5lcmF0ZSBhIGxhenkgcHJveHkgZm9yIGN0b3JcbiAgICAgICAgICAgIGNvbnRhaW5lcltpbmRleF0gPSAoZnVuY3Rpb24gKGNvbnRhaW5lciwgaW5kZXgsIHR5cGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gcHJveHkgKCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQga2xhc3MgPSBjbGFzc0ZpbmRlcih0eXBlKSB8fCBnZXRNaXNzaW5nQ2xhc3MoaGFzQ3VzdG9tRmluZGVyLCB0eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyW2luZGV4XSA9IGtsYXNzO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGtsYXNzKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pKGNvbnRhaW5lciwgaW5kZXgsIHR5cGUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAga2xhc3MgPSBnZXRNaXNzaW5nQ2xhc3MoaGFzQ3VzdG9tRmluZGVyLCB0eXBlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb250YWluZXJbaW5kZXhdID0ga2xhc3M7XG59XG5cbmZ1bmN0aW9uIGxvb2t1cENsYXNzZXMgKGRhdGE6IElQYWNrZWRGaWxlRGF0YSwgc2lsZW50OiBib29sZWFuLCBjdXN0b21GaW5kZXI/OiBDbGFzc0ZpbmRlcikge1xuICAgIGxldCBjbGFzc0ZpbmRlciA9IGN1c3RvbUZpbmRlciB8fCBqcy5fZ2V0Q2xhc3NCeUlkO1xuICAgIGxldCBjbGFzc2VzID0gZGF0YVtGaWxlLlNoYXJlZENsYXNzZXNdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICBsZXQga2xhc3NMYXlvdXQgPSBjbGFzc2VzW2ldO1xuICAgICAgICBpZiAodHlwZW9mIGtsYXNzTGF5b3V0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWYgKENDX0RFQlVHKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBrbGFzc0xheW91dFtDTEFTU19UWVBFXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbiBub3QgZGVzZXJpYWxpemUgdGhlIHNhbWUgSlNPTiBkYXRhIGFnYWluLicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCB0eXBlOiBzdHJpbmcgPSBrbGFzc0xheW91dFtDTEFTU19UWVBFXTtcbiAgICAgICAgICAgIGRvTG9va3VwQ2xhc3MoY2xhc3NGaW5kZXIsIHR5cGUsIGtsYXNzTGF5b3V0IGFzIElDbGFzcywgQ0xBU1NfVFlQRSwgc2lsZW50LCBjdXN0b21GaW5kZXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZG9Mb29rdXBDbGFzcyhjbGFzc0ZpbmRlciwga2xhc3NMYXlvdXQsIGNsYXNzZXMsIGksIHNpbGVudCwgY3VzdG9tRmluZGVyKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gY2FjaGVNYXNrcyAoZGF0YTogSVBhY2tlZEZpbGVEYXRhKSB7XG4gICAgbGV0IG1hc2tzID0gZGF0YVtGaWxlLlNoYXJlZE1hc2tzXTtcbiAgICBpZiAobWFza3MpIHtcbiAgICAgICAgbGV0IGNsYXNzZXMgPSBkYXRhW0ZpbGUuU2hhcmVkQ2xhc3Nlc107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFza3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBtYXNrID0gbWFza3NbaV07XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBtYXNrW01BU0tfQ0xBU1NdID0gY2xhc3Nlc1ttYXNrW01BU0tfQ0xBU1NdXTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VSZXN1bHQgKGRhdGE6IElGaWxlRGF0YSkge1xuICAgIGxldCBpbnN0YW5jZXMgPSBkYXRhW0ZpbGUuSW5zdGFuY2VzXTtcbiAgICBsZXQgc2hhcmVkU3RyaW5ncyA9IGRhdGFbRmlsZS5TaGFyZWRTdHJpbmdzXTtcbiAgICBsZXQgZGVwZW5kU2hhcmVkVXVpZHMgPSBkYXRhW0ZpbGUuU2hhcmVkVXVpZHNdO1xuXG4gICAgbGV0IGRlcGVuZE9ianMgPSBkYXRhW0ZpbGUuRGVwZW5kT2Jqc107XG4gICAgbGV0IGRlcGVuZEtleXMgPSBkYXRhW0ZpbGUuRGVwZW5kS2V5c107XG4gICAgbGV0IGRlcGVuZFV1aWRzID0gZGF0YVtGaWxlLkRlcGVuZFV1aWRJbmRpY2VzXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGVwZW5kT2Jqcy5sZW5ndGg7ICsraSkge1xuICAgICAgICBsZXQgb2JqOiBhbnkgPSBkZXBlbmRPYmpzW2ldO1xuICAgICAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGRlcGVuZE9ianNbaV0gPSBpbnN0YW5jZXNbb2JqXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGFzc2lnbmVkIGJ5IERhdGFUeXBlSUQuQXNzZXRSZWZCeUlubmVyT2JqIG9yIGFkZGVkIGJ5IERldGFpbHMgb2JqZWN0IGRpcmVjdGx5IGluIF9kZXNlcmlhbGl6ZVxuICAgICAgICB9XG4gICAgICAgIGxldCBrZXk6IGFueSA9IGRlcGVuZEtleXNbaV07XG4gICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgaWYgKGtleSA+PSAwKSB7XG4gICAgICAgICAgICAgICAga2V5ID0gc2hhcmVkU3RyaW5nc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAga2V5ID0gfmtleTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlcGVuZEtleXNbaV0gPSBrZXk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBhZGRlZCBieSBEZXRhaWxzIG9iamVjdCBkaXJlY3RseSBpbiBfZGVzZXJpYWxpemVcbiAgICAgICAgfVxuICAgICAgICBsZXQgdXVpZCA9IGRlcGVuZFV1aWRzW2ldO1xuICAgICAgICBpZiAodHlwZW9mIHV1aWQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBkZXBlbmRVdWlkc1tpXSA9IChkZXBlbmRTaGFyZWRVdWlkcyBhcyBTaGFyZWRTdHJpbmdbXSlbdXVpZCBhcyBTdHJpbmdJbmRleF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBhZGRlZCBieSBEZXRhaWxzIG9iamVjdCBkaXJlY3RseSBpbiBfZGVzZXJpYWxpemVcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGVzZXJpYWxpemUgKGRhdGE6IElGaWxlRGF0YSwgZGV0YWlsczogRGV0YWlscywgb3B0aW9ucz86IElPcHRpb25zKTogb2JqZWN0IHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgaWYgKENDX0VESVRPUiAmJiBCdWZmZXIuaXNCdWZmZXIoZGF0YSkpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBkYXRhID0gZGF0YS50b1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgIH1cbiAgICBsZXQgYm9ycm93RGV0YWlscyA9ICFkZXRhaWxzO1xuICAgIGRldGFpbHMgPSBkZXRhaWxzIHx8IERldGFpbHMucG9vbC5nZXQoKTtcbiAgICBkZXRhaWxzLmluaXQoZGF0YSk7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICBsZXQgdmVyc2lvbiA9IGRhdGFbRmlsZS5WZXJzaW9uXTtcbiAgICBsZXQgcHJlcHJvY2Vzc2VkID0gZmFsc2U7XG4gICAgaWYgKHR5cGVvZiB2ZXJzaW9uID09PSAnb2JqZWN0Jykge1xuICAgICAgICBwcmVwcm9jZXNzZWQgPSB2ZXJzaW9uLnByZXByb2Nlc3NlZDtcbiAgICAgICAgdmVyc2lvbiA9IHZlcnNpb24udmVyc2lvbjtcbiAgICB9XG4gICAgaWYgKHZlcnNpb24gPCBTVVBQT1JUX01JTl9GT1JNQVRfVkVSU0lPTikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoY2MuZGVidWcuZ2V0RXJyb3IoNTMwNCwgdmVyc2lvbikpO1xuICAgIH1cbiAgICBvcHRpb25zLl92ZXJzaW9uID0gdmVyc2lvbjtcbiAgICBvcHRpb25zLnJlc3VsdCA9IGRldGFpbHM7XG4gICAgZGF0YVtGaWxlLkNvbnRleHRdID0gb3B0aW9ucztcblxuICAgIGlmICghcHJlcHJvY2Vzc2VkKSB7XG4gICAgICAgIGxvb2t1cENsYXNzZXMoZGF0YSwgZmFsc2UsIG9wdGlvbnMuY2xhc3NGaW5kZXIpO1xuICAgICAgICBjYWNoZU1hc2tzKGRhdGEpO1xuICAgIH1cblxuICAgIGNjLmdhbWUuX2lzQ2xvbmluZyA9IHRydWU7XG4gICAgbGV0IGluc3RhbmNlcyA9IGRhdGFbRmlsZS5JbnN0YW5jZXNdO1xuICAgIGxldCByb290SW5kZXggPSBwYXJzZUluc3RhbmNlcyhkYXRhKTtcbiAgICBjYy5nYW1lLl9pc0Nsb25pbmcgPSBmYWxzZTtcblxuICAgIGlmIChkYXRhW0ZpbGUuUmVmc10pIHtcbiAgICAgICAgZGVyZWZlcmVuY2UoZGF0YVtGaWxlLlJlZnNdIGFzIElSZWZzLCBpbnN0YW5jZXMsIGRhdGFbRmlsZS5TaGFyZWRTdHJpbmdzXSk7XG4gICAgfVxuXG4gICAgcGFyc2VSZXN1bHQoZGF0YSk7XG5cbiAgICBpZiAoYm9ycm93RGV0YWlscykge1xuICAgICAgICBEZXRhaWxzLnBvb2wucHV0KGRldGFpbHMpO1xuICAgIH1cblxuICAgIHJldHVybiBpbnN0YW5jZXNbcm9vdEluZGV4XTtcbn07XG5cbmRlc2VyaWFsaXplLkRldGFpbHMgPSBEZXRhaWxzO1xuXG5jbGFzcyBGaWxlSW5mbyB7XG4gICAgZGVjbGFyZSB2ZXJzaW9uOiBudW1iZXI7XG4gICAgcHJlcHJvY2Vzc2VkID0gdHJ1ZTtcbiAgICBjb25zdHJ1Y3RvciAodmVyc2lvbjogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMudmVyc2lvbiA9IHZlcnNpb247XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5wYWNrSlNPTnMgKGRhdGE6IElQYWNrZWRGaWxlRGF0YSwgY2xhc3NGaW5kZXI/OiBDbGFzc0ZpbmRlcik6IElGaWxlRGF0YVtdIHtcbiAgICBpZiAoZGF0YVtGaWxlLlZlcnNpb25dIDwgU1VQUE9SVF9NSU5fRk9STUFUX1ZFUlNJT04pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGNjLmRlYnVnLmdldEVycm9yKDUzMDQsIGRhdGFbRmlsZS5WZXJzaW9uXSkpO1xuICAgIH1cbiAgICBsb29rdXBDbGFzc2VzKGRhdGEsIHRydWUsIGNsYXNzRmluZGVyKTtcbiAgICBjYWNoZU1hc2tzKGRhdGEpO1xuXG4gICAgbGV0IHZlcnNpb24gPSBuZXcgRmlsZUluZm8oZGF0YVtGaWxlLlZlcnNpb25dKTtcbiAgICBsZXQgc2hhcmVkVXVpZHMgPSBkYXRhW0ZpbGUuU2hhcmVkVXVpZHNdO1xuICAgIGxldCBzaGFyZWRTdHJpbmdzID0gZGF0YVtGaWxlLlNoYXJlZFN0cmluZ3NdO1xuICAgIGxldCBzaGFyZWRDbGFzc2VzID0gZGF0YVtGaWxlLlNoYXJlZENsYXNzZXNdO1xuICAgIGxldCBzaGFyZWRNYXNrcyA9IGRhdGFbRmlsZS5TaGFyZWRNYXNrc107XG5cbiAgICBsZXQgc2VjdGlvbnMgPSBkYXRhW1BBQ0tFRF9TRUNUSU9OU107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWN0aW9ucy5sZW5ndGg7ICsraSkge1xuICAgICAgICBzZWN0aW9uc1tpXS51bnNoaWZ0KHZlcnNpb24sIHNoYXJlZFV1aWRzLCBzaGFyZWRTdHJpbmdzLCBzaGFyZWRDbGFzc2VzLCBzaGFyZWRNYXNrcyk7XG4gICAgfVxuICAgIHJldHVybiBzZWN0aW9ucztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhY2tDdXN0b21PYmpEYXRhICh0eXBlOiBzdHJpbmcsIGRhdGE6IElDbGFzc09iamVjdERhdGF8T3RoZXJPYmplY3REYXRhLCBoYXNOYXRpdmVEZXA/OiBib29sZWFuKTogSUZpbGVEYXRhIHtcbiAgICByZXR1cm4gW1xuICAgICAgICBTVVBQT1JUX01JTl9GT1JNQVRfVkVSU0lPTiwgRU1QVFlfUExBQ0VIT0xERVIsIEVNUFRZX1BMQUNFSE9MREVSLFxuICAgICAgICBbdHlwZV0sXG4gICAgICAgIEVNUFRZX1BMQUNFSE9MREVSLFxuICAgICAgICBoYXNOYXRpdmVEZXAgPyBbZGF0YSwgfjBdIDogW2RhdGFdLFxuICAgICAgICBbMF0sXG4gICAgICAgIEVNUFRZX1BMQUNFSE9MREVSLCBbXSwgW10sIFtdXG4gICAgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc05hdGl2ZURlcCAoZGF0YTogSUZpbGVEYXRhKTogYm9vbGVhbiB7XG4gICAgbGV0IGluc3RhbmNlcyA9IGRhdGFbRmlsZS5JbnN0YW5jZXNdO1xuICAgIGxldCByb290SW5mbyA9IGluc3RhbmNlc1tpbnN0YW5jZXMubGVuZ3RoIC0gMV07XG4gICAgaWYgKHR5cGVvZiByb290SW5mbyAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJvb3RJbmZvIDwgMDtcbiAgICB9XG59XG5cbmlmIChDQ19QUkVWSUVXKSB7XG4gICAgZGVzZXJpYWxpemUuaXNDb21waWxlZEpzb24gPSBmdW5jdGlvbiAoanNvbjogb2JqZWN0KTogYm9vbGVhbiB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGpzb24pKSB7XG4gICAgICAgICAgICBsZXQgdmVyc2lvbiA9IGpzb25bMF07XG4gICAgICAgICAgICAvLyBhcnJheVswXSB3aWxsIG5vdCBiZSBhIG51bWJlciBpbiB0aGUgZWRpdG9yIHZlcnNpb25cbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgdmVyc2lvbiA9PT0gJ251bWJlcicgfHwgdmVyc2lvbiBpbnN0YW5jZW9mIEZpbGVJbmZvO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERlcGVuZFV1aWRMaXN0IChqc29uOiBJRmlsZURhdGEpOiBBcnJheTxzdHJpbmc+IHtcbiAgICBsZXQgc2hhcmVkVXVpZHMgPSBqc29uW0ZpbGUuU2hhcmVkVXVpZHNdO1xuICAgIHJldHVybiBqc29uW0ZpbGUuRGVwZW5kVXVpZEluZGljZXNdLm1hcChpbmRleCA9PiBzaGFyZWRVdWlkc1tpbmRleF0pO1xufVxuXG5pZiAoQ0NfRURJVE9SIHx8IENDX1RFU1QpIHtcbiAgICBjYy5fZGVzZXJpYWxpemVDb21waWxlZCA9IGRlc2VyaWFsaXplO1xuICAgIGRlc2VyaWFsaXplLm1hY3JvcyA9IHtcbiAgICAgICAgRU1QVFlfUExBQ0VIT0xERVIsXG4gICAgICAgIENVU1RPTV9PQkpfREFUQV9DTEFTUyxcbiAgICAgICAgQ1VTVE9NX09CSl9EQVRBX0NPTlRFTlQsXG4gICAgICAgIENMQVNTX1RZUEUsXG4gICAgICAgIENMQVNTX0tFWVMsXG4gICAgICAgIENMQVNTX1BST1BfVFlQRV9PRkZTRVQsXG4gICAgICAgIE1BU0tfQ0xBU1MsXG4gICAgICAgIE9CSl9EQVRBX01BU0ssXG4gICAgICAgIERJQ1RfSlNPTl9MQVlPVVQsXG4gICAgICAgIEFSUkFZX0lURU1fVkFMVUVTLFxuICAgICAgICBQQUNLRURfU0VDVElPTlMsXG4gICAgfTtcbiAgICBkZXNlcmlhbGl6ZS5fQnVpbHRpblZhbHVlVHlwZXMgPSBCdWlsdGluVmFsdWVUeXBlcztcbiAgICBkZXNlcmlhbGl6ZS5fc2VyaWFsaXplQnVpbHRpblZhbHVlVHlwZXMgPSBzZXJpYWxpemVCdWlsdGluVmFsdWVUeXBlcztcbn1cblxuaWYgKENDX1RFU1QpIHtcbiAgICBjYy5fVGVzdC5kZXNlcmlhbGl6ZUNvbXBpbGVkID0ge1xuICAgICAgICBkZXNlcmlhbGl6ZSxcbiAgICAgICAgZGVyZWZlcmVuY2UsXG4gICAgICAgIGRlc2VyaWFsaXplQ0NPYmplY3QsXG4gICAgICAgIGRlc2VyaWFsaXplQ3VzdG9tQ0NPYmplY3QsXG4gICAgICAgIHBhcnNlSW5zdGFuY2VzLFxuICAgICAgICBwYXJzZVJlc3VsdCxcbiAgICAgICAgY2FjaGVNYXNrcyxcbiAgICAgICAgRmlsZToge1xuICAgICAgICAgICAgVmVyc2lvbjogRmlsZS5WZXJzaW9uLFxuICAgICAgICAgICAgQ29udGV4dDogRmlsZS5Db250ZXh0LFxuICAgICAgICAgICAgU2hhcmVkVXVpZHM6IEZpbGUuU2hhcmVkVXVpZHMsXG4gICAgICAgICAgICBTaGFyZWRTdHJpbmdzOiBGaWxlLlNoYXJlZFN0cmluZ3MsXG4gICAgICAgICAgICBTaGFyZWRDbGFzc2VzOiBGaWxlLlNoYXJlZENsYXNzZXMsXG4gICAgICAgICAgICBTaGFyZWRNYXNrczogRmlsZS5TaGFyZWRNYXNrcyxcbiAgICAgICAgICAgIEluc3RhbmNlczogRmlsZS5JbnN0YW5jZXMsXG4gICAgICAgICAgICBJbnN0YW5jZVR5cGVzOiBGaWxlLkluc3RhbmNlVHlwZXMsXG4gICAgICAgICAgICBSZWZzOiBGaWxlLlJlZnMsXG4gICAgICAgICAgICBEZXBlbmRPYmpzOiBGaWxlLkRlcGVuZE9ianMsXG4gICAgICAgICAgICBEZXBlbmRLZXlzOiBGaWxlLkRlcGVuZEtleXMsXG4gICAgICAgICAgICBEZXBlbmRVdWlkSW5kaWNlczogRmlsZS5EZXBlbmRVdWlkSW5kaWNlcyxcbiAgICAgICAgICAgIC8vIEFycmF5TGVuZ3RoOiBGaWxlLkFycmF5TGVuZ3RoLFxuICAgICAgICB9LFxuICAgICAgICBEYXRhVHlwZUlEOiB7XG4gICAgICAgICAgICBTaW1wbGVUeXBlOiBEYXRhVHlwZUlELlNpbXBsZVR5cGUsXG4gICAgICAgICAgICBJbnN0YW5jZVJlZjogRGF0YVR5cGVJRC5JbnN0YW5jZVJlZixcbiAgICAgICAgICAgIEFycmF5X0luc3RhbmNlUmVmOiBEYXRhVHlwZUlELkFycmF5X0luc3RhbmNlUmVmLFxuICAgICAgICAgICAgQXJyYXlfQXNzZXRSZWZCeUlubmVyT2JqOiBEYXRhVHlwZUlELkFycmF5X0Fzc2V0UmVmQnlJbm5lck9iaixcbiAgICAgICAgICAgIENsYXNzOiBEYXRhVHlwZUlELkNsYXNzLFxuICAgICAgICAgICAgVmFsdWVUeXBlQ3JlYXRlZDogRGF0YVR5cGVJRC5WYWx1ZVR5cGVDcmVhdGVkLFxuICAgICAgICAgICAgQXNzZXRSZWZCeUlubmVyT2JqOiBEYXRhVHlwZUlELkFzc2V0UmVmQnlJbm5lck9iaixcbiAgICAgICAgICAgIFRSUzogRGF0YVR5cGVJRC5UUlMsXG4gICAgICAgICAgICBWYWx1ZVR5cGU6IERhdGFUeXBlSUQuVmFsdWVUeXBlLFxuICAgICAgICAgICAgQXJyYXlfQ2xhc3M6IERhdGFUeXBlSUQuQXJyYXlfQ2xhc3MsXG4gICAgICAgICAgICBDdXN0b21pemVkQ2xhc3M6IERhdGFUeXBlSUQuQ3VzdG9taXplZENsYXNzLFxuICAgICAgICAgICAgRGljdDogRGF0YVR5cGVJRC5EaWN0LFxuICAgICAgICAgICAgQXJyYXk6IERhdGFUeXBlSUQuQXJyYXksXG4gICAgICAgICAgICAvLyBUeXBlZEFycmF5OiBEYXRhVHlwZUlELlR5cGVkQXJyYXksXG4gICAgICAgIH0sXG4gICAgICAgIEJ1aWx0aW5WYWx1ZVR5cGVzLFxuICAgICAgICB1bnBhY2tKU09OcyxcbiAgICB9O1xufVxuIl0sInNvdXJjZVJvb3QiOiIvIn0=