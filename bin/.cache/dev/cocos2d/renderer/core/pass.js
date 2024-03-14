
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/core/pass.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _gfx = _interopRequireDefault(require("../gfx"));

var _enums = _interopRequireDefault(require("../enums"));

var _valueType = _interopRequireDefault(require("../../core/value-types/value-type"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
var Pass = /*#__PURE__*/function () {
  function Pass(name, detailName, programName, stage, properties, defines) {
    if (properties === void 0) {
      properties = {};
    }

    if (defines === void 0) {
      defines = {};
    }

    this._name = name;
    this._detailName = detailName;
    this._programName = programName;
    this._programKey = null;
    this._stage = stage;
    this._properties = properties;
    this._defines = defines; // cullmode

    this._cullMode = _gfx["default"].CULL_BACK; // blending

    this._blend = false;
    this._blendEq = _gfx["default"].BLEND_FUNC_ADD;
    this._blendAlphaEq = _gfx["default"].BLEND_FUNC_ADD;
    this._blendSrc = _gfx["default"].BLEND_SRC_ALPHA;
    this._blendDst = _gfx["default"].BLEND_ONE_MINUS_SRC_ALPHA;
    this._blendSrcAlpha = _gfx["default"].BLEND_SRC_ALPHA;
    this._blendDstAlpha = _gfx["default"].BLEND_ONE_MINUS_SRC_ALPHA;
    this._blendColor = 0xffffffff; // depth

    this._depthTest = false;
    this._depthWrite = false;
    this._depthFunc = _gfx["default"].DS_FUNC_LESS, // stencil
    this._stencilTest = _gfx["default"].STENCIL_INHERIT; // front

    this._stencilFuncFront = _gfx["default"].DS_FUNC_ALWAYS;
    this._stencilRefFront = 0;
    this._stencilMaskFront = 0xff;
    this._stencilFailOpFront = _gfx["default"].STENCIL_OP_KEEP;
    this._stencilZFailOpFront = _gfx["default"].STENCIL_OP_KEEP;
    this._stencilZPassOpFront = _gfx["default"].STENCIL_OP_KEEP;
    this._stencilWriteMaskFront = 0xff; // back

    this._stencilFuncBack = _gfx["default"].DS_FUNC_ALWAYS;
    this._stencilRefBack = 0;
    this._stencilMaskBack = 0xff;
    this._stencilFailOpBack = _gfx["default"].STENCIL_OP_KEEP;
    this._stencilZFailOpBack = _gfx["default"].STENCIL_OP_KEEP;
    this._stencilZPassOpBack = _gfx["default"].STENCIL_OP_KEEP;
    this._stencilWriteMaskBack = 0xff;
  }

  var _proto = Pass.prototype;

  _proto.setCullMode = function setCullMode(cullMode) {
    if (cullMode === void 0) {
      cullMode = _gfx["default"].CULL_BACK;
    }

    this._cullMode = cullMode;
  };

  _proto.setBlend = function setBlend(enabled, blendEq, blendSrc, blendDst, blendAlphaEq, blendSrcAlpha, blendDstAlpha, blendColor) {
    if (enabled === void 0) {
      enabled = false;
    }

    if (blendEq === void 0) {
      blendEq = _gfx["default"].BLEND_FUNC_ADD;
    }

    if (blendSrc === void 0) {
      blendSrc = _gfx["default"].BLEND_SRC_ALPHA;
    }

    if (blendDst === void 0) {
      blendDst = _gfx["default"].BLEND_ONE_MINUS_SRC_ALPHA;
    }

    if (blendAlphaEq === void 0) {
      blendAlphaEq = _gfx["default"].BLEND_FUNC_ADD;
    }

    if (blendSrcAlpha === void 0) {
      blendSrcAlpha = _gfx["default"].BLEND_SRC_ALPHA;
    }

    if (blendDstAlpha === void 0) {
      blendDstAlpha = _gfx["default"].BLEND_ONE_MINUS_SRC_ALPHA;
    }

    if (blendColor === void 0) {
      blendColor = 0xffffffff;
    }

    this._blend = enabled;
    this._blendEq = blendEq;
    this._blendSrc = blendSrc;
    this._blendDst = blendDst;
    this._blendAlphaEq = blendAlphaEq;
    this._blendSrcAlpha = blendSrcAlpha;
    this._blendDstAlpha = blendDstAlpha;
    this._blendColor = blendColor;
  };

  _proto.setDepth = function setDepth(depthTest, depthWrite, depthFunc) {
    if (depthTest === void 0) {
      depthTest = false;
    }

    if (depthWrite === void 0) {
      depthWrite = false;
    }

    if (depthFunc === void 0) {
      depthFunc = _gfx["default"].DS_FUNC_LESS;
    }

    this._depthTest = depthTest;
    this._depthWrite = depthWrite;
    this._depthFunc = depthFunc;
  };

  _proto.setStencilFront = function setStencilFront(enabled, stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask) {
    if (enabled === void 0) {
      enabled = _gfx["default"].STENCIL_INHERIT;
    }

    if (stencilFunc === void 0) {
      stencilFunc = _gfx["default"].DS_FUNC_ALWAYS;
    }

    if (stencilRef === void 0) {
      stencilRef = 0;
    }

    if (stencilMask === void 0) {
      stencilMask = 0xff;
    }

    if (stencilFailOp === void 0) {
      stencilFailOp = _gfx["default"].STENCIL_OP_KEEP;
    }

    if (stencilZFailOp === void 0) {
      stencilZFailOp = _gfx["default"].STENCIL_OP_KEEP;
    }

    if (stencilZPassOp === void 0) {
      stencilZPassOp = _gfx["default"].STENCIL_OP_KEEP;
    }

    if (stencilWriteMask === void 0) {
      stencilWriteMask = 0xff;
    }

    this._stencilTest = enabled;
    this._stencilFuncFront = stencilFunc;
    this._stencilRefFront = stencilRef;
    this._stencilMaskFront = stencilMask;
    this._stencilFailOpFront = stencilFailOp;
    this._stencilZFailOpFront = stencilZFailOp;
    this._stencilZPassOpFront = stencilZPassOp;
    this._stencilWriteMaskFront = stencilWriteMask;
  };

  _proto.setStencilEnabled = function setStencilEnabled(stencilTest) {
    if (stencilTest === void 0) {
      stencilTest = _gfx["default"].STENCIL_INHERIT;
    }

    this._stencilTest = stencilTest;
  };

  _proto.setStencilBack = function setStencilBack(stencilTest, stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask) {
    if (stencilTest === void 0) {
      stencilTest = _gfx["default"].STENCIL_INHERIT;
    }

    if (stencilFunc === void 0) {
      stencilFunc = _gfx["default"].DS_FUNC_ALWAYS;
    }

    if (stencilRef === void 0) {
      stencilRef = 0;
    }

    if (stencilMask === void 0) {
      stencilMask = 0xff;
    }

    if (stencilFailOp === void 0) {
      stencilFailOp = _gfx["default"].STENCIL_OP_KEEP;
    }

    if (stencilZFailOp === void 0) {
      stencilZFailOp = _gfx["default"].STENCIL_OP_KEEP;
    }

    if (stencilZPassOp === void 0) {
      stencilZPassOp = _gfx["default"].STENCIL_OP_KEEP;
    }

    if (stencilWriteMask === void 0) {
      stencilWriteMask = 0xff;
    }

    this._stencilTest = stencilTest;
    this._stencilFuncBack = stencilFunc;
    this._stencilRefBack = stencilRef;
    this._stencilMaskBack = stencilMask;
    this._stencilFailOpBack = stencilFailOp;
    this._stencilZFailOpBack = stencilZFailOp;
    this._stencilZPassOpBack = stencilZPassOp;
    this._stencilWriteMaskBack = stencilWriteMask;
  };

  _proto.setStage = function setStage(stage) {
    this._stage = stage;
  };

  _proto.setProperties = function setProperties(properties) {
    this._properties = properties;
  };

  _proto.getProperty = function getProperty(name) {
    if (!this._properties[name]) {
      return;
    }

    return this._properties[name].value;
  };

  _proto.setProperty = function setProperty(name, value, directly) {
    var prop = this._properties[name];

    if (!prop) {
      return false;
    }

    prop.directly = directly;

    if (Array.isArray(value)) {
      var array = prop.value;

      if (array.length !== value.length) {
        cc.warnID(9105, this._name, name);
        return;
      }

      for (var i = 0; i < value.length; i++) {
        array[i] = value[i];
      }
    } else {
      if (value && !ArrayBuffer.isView(value)) {
        if (prop.type === _enums["default"].PARAM_TEXTURE_2D) {
          prop.value = value.getImpl();
        } else if (value instanceof _valueType["default"]) {
          value.constructor.toArray(prop.value, value);
        } else {
          if (typeof value === 'object') {
            cc.warnID(9106, this._name, name);
          }

          prop.value = value;
        }
      } else {
        prop.value = value;
      }
    }

    return true;
  };

  _proto.getDefine = function getDefine(name) {
    return this._defines[name];
  };

  _proto.define = function define(name, value, force) {
    var oldValue = this._defines[name];

    if (!force && oldValue === undefined) {
      return false;
    }

    if (oldValue !== value) {
      this._defines[name] = value;
      this._programKey = null;
    }

    return true;
  };

  _proto.clone = function clone() {
    var pass = new Pass(this._programName);
    Object.assign(pass, this);
    var newProperties = {};
    var properties = this._properties;

    for (var name in properties) {
      var prop = properties[name];
      var newProp = newProperties[name] = {};
      var value = prop.value;

      if (Array.isArray(value)) {
        newProp.value = value.concat();
      } else if (ArrayBuffer.isView(value)) {
        newProp.value = new value.__proto__.constructor(value);
      } else {
        newProp.value = value;
      }

      for (var _name in prop) {
        if (_name === 'value') continue;
        newProp[_name] = prop[_name];
      }
    }

    pass._properties = newProperties;
    pass._defines = Object.assign({}, this._defines);
    return pass;
  };

  return Pass;
}();

exports["default"] = Pass;
module.exports = exports["default"];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9yZW5kZXJlci9jb3JlL3Bhc3MuanMiXSwibmFtZXMiOlsiUGFzcyIsIm5hbWUiLCJkZXRhaWxOYW1lIiwicHJvZ3JhbU5hbWUiLCJzdGFnZSIsInByb3BlcnRpZXMiLCJkZWZpbmVzIiwiX25hbWUiLCJfZGV0YWlsTmFtZSIsIl9wcm9ncmFtTmFtZSIsIl9wcm9ncmFtS2V5IiwiX3N0YWdlIiwiX3Byb3BlcnRpZXMiLCJfZGVmaW5lcyIsIl9jdWxsTW9kZSIsImdmeCIsIkNVTExfQkFDSyIsIl9ibGVuZCIsIl9ibGVuZEVxIiwiQkxFTkRfRlVOQ19BREQiLCJfYmxlbmRBbHBoYUVxIiwiX2JsZW5kU3JjIiwiQkxFTkRfU1JDX0FMUEhBIiwiX2JsZW5kRHN0IiwiQkxFTkRfT05FX01JTlVTX1NSQ19BTFBIQSIsIl9ibGVuZFNyY0FscGhhIiwiX2JsZW5kRHN0QWxwaGEiLCJfYmxlbmRDb2xvciIsIl9kZXB0aFRlc3QiLCJfZGVwdGhXcml0ZSIsIl9kZXB0aEZ1bmMiLCJEU19GVU5DX0xFU1MiLCJfc3RlbmNpbFRlc3QiLCJTVEVOQ0lMX0lOSEVSSVQiLCJfc3RlbmNpbEZ1bmNGcm9udCIsIkRTX0ZVTkNfQUxXQVlTIiwiX3N0ZW5jaWxSZWZGcm9udCIsIl9zdGVuY2lsTWFza0Zyb250IiwiX3N0ZW5jaWxGYWlsT3BGcm9udCIsIlNURU5DSUxfT1BfS0VFUCIsIl9zdGVuY2lsWkZhaWxPcEZyb250IiwiX3N0ZW5jaWxaUGFzc09wRnJvbnQiLCJfc3RlbmNpbFdyaXRlTWFza0Zyb250IiwiX3N0ZW5jaWxGdW5jQmFjayIsIl9zdGVuY2lsUmVmQmFjayIsIl9zdGVuY2lsTWFza0JhY2siLCJfc3RlbmNpbEZhaWxPcEJhY2siLCJfc3RlbmNpbFpGYWlsT3BCYWNrIiwiX3N0ZW5jaWxaUGFzc09wQmFjayIsIl9zdGVuY2lsV3JpdGVNYXNrQmFjayIsInNldEN1bGxNb2RlIiwiY3VsbE1vZGUiLCJzZXRCbGVuZCIsImVuYWJsZWQiLCJibGVuZEVxIiwiYmxlbmRTcmMiLCJibGVuZERzdCIsImJsZW5kQWxwaGFFcSIsImJsZW5kU3JjQWxwaGEiLCJibGVuZERzdEFscGhhIiwiYmxlbmRDb2xvciIsInNldERlcHRoIiwiZGVwdGhUZXN0IiwiZGVwdGhXcml0ZSIsImRlcHRoRnVuYyIsInNldFN0ZW5jaWxGcm9udCIsInN0ZW5jaWxGdW5jIiwic3RlbmNpbFJlZiIsInN0ZW5jaWxNYXNrIiwic3RlbmNpbEZhaWxPcCIsInN0ZW5jaWxaRmFpbE9wIiwic3RlbmNpbFpQYXNzT3AiLCJzdGVuY2lsV3JpdGVNYXNrIiwic2V0U3RlbmNpbEVuYWJsZWQiLCJzdGVuY2lsVGVzdCIsInNldFN0ZW5jaWxCYWNrIiwic2V0U3RhZ2UiLCJzZXRQcm9wZXJ0aWVzIiwiZ2V0UHJvcGVydHkiLCJ2YWx1ZSIsInNldFByb3BlcnR5IiwiZGlyZWN0bHkiLCJwcm9wIiwiQXJyYXkiLCJpc0FycmF5IiwiYXJyYXkiLCJsZW5ndGgiLCJjYyIsIndhcm5JRCIsImkiLCJBcnJheUJ1ZmZlciIsImlzVmlldyIsInR5cGUiLCJlbnVtcyIsIlBBUkFNX1RFWFRVUkVfMkQiLCJnZXRJbXBsIiwiVmFsdWVUeXBlIiwiY29uc3RydWN0b3IiLCJ0b0FycmF5IiwiZ2V0RGVmaW5lIiwiZGVmaW5lIiwiZm9yY2UiLCJvbGRWYWx1ZSIsInVuZGVmaW5lZCIsImNsb25lIiwicGFzcyIsIk9iamVjdCIsImFzc2lnbiIsIm5ld1Byb3BlcnRpZXMiLCJuZXdQcm9wIiwiY29uY2F0IiwiX19wcm90b19fIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7QUFKQTtJQU1xQkE7QUFDakIsZ0JBQWFDLElBQWIsRUFBbUJDLFVBQW5CLEVBQStCQyxXQUEvQixFQUE0Q0MsS0FBNUMsRUFBbURDLFVBQW5ELEVBQW9FQyxPQUFwRSxFQUFrRjtBQUFBLFFBQS9CRCxVQUErQjtBQUEvQkEsTUFBQUEsVUFBK0IsR0FBbEIsRUFBa0I7QUFBQTs7QUFBQSxR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IFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbmltcG9ydCBnZnggZnJvbSAnLi4vZ2Z4JztcbmltcG9ydCBlbnVtcyBmcm9tICcuLi9lbnVtcyc7XG5pbXBvcnQgVmFsdWVUeXBlIGZyb20gJy4uLy4uL2NvcmUvdmFsdWUtdHlwZXMvdmFsdWUtdHlwZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhc3Mge1xuICAgIGNvbnN0cnVjdG9yIChuYW1lLCBkZXRhaWxOYW1lLCBwcm9ncmFtTmFtZSwgc3RhZ2UsIHByb3BlcnRpZXMgPSB7fSwgZGVmaW5lcyA9IHt9KSB7XG4gICAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLl9kZXRhaWxOYW1lID0gZGV0YWlsTmFtZTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbU5hbWUgPSBwcm9ncmFtTmFtZTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbUtleSA9IG51bGw7XG4gICAgICAgIHRoaXMuX3N0YWdlID0gc3RhZ2U7XG4gICAgICAgIHRoaXMuX3Byb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuICAgICAgICB0aGlzLl9kZWZpbmVzID0gZGVmaW5lcztcblxuICAgICAgICAvLyBjdWxsbW9kZVxuICAgICAgICB0aGlzLl9jdWxsTW9kZSA9IGdmeC5DVUxMX0JBQ0s7XG5cbiAgICAgICAgLy8gYmxlbmRpbmdcbiAgICAgICAgdGhpcy5fYmxlbmQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fYmxlbmRFcSA9IGdmeC5CTEVORF9GVU5DX0FERDtcbiAgICAgICAgdGhpcy5fYmxlbmRBbHBoYUVxID0gZ2Z4LkJMRU5EX0ZVTkNfQUREO1xuICAgICAgICB0aGlzLl9ibGVuZFNyYyA9IGdmeC5CTEVORF9TUkNfQUxQSEE7XG4gICAgICAgIHRoaXMuX2JsZW5kRHN0ID0gZ2Z4LkJMRU5EX09ORV9NSU5VU19TUkNfQUxQSEE7XG4gICAgICAgIHRoaXMuX2JsZW5kU3JjQWxwaGEgPSBnZnguQkxFTkRfU1JDX0FMUEhBO1xuICAgICAgICB0aGlzLl9ibGVuZERzdEFscGhhID0gZ2Z4LkJMRU5EX09ORV9NSU5VU19TUkNfQUxQSEE7XG4gICAgICAgIHRoaXMuX2JsZW5kQ29sb3IgPSAweGZmZmZmZmZmO1xuXG4gICAgICAgIC8vIGRlcHRoXG4gICAgICAgIHRoaXMuX2RlcHRoVGVzdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9kZXB0aFdyaXRlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2RlcHRoRnVuYyA9IGdmeC5EU19GVU5DX0xFU1MsXG5cbiAgICAgICAgLy8gc3RlbmNpbFxuICAgICAgICB0aGlzLl9zdGVuY2lsVGVzdCA9IGdmeC5TVEVOQ0lMX0lOSEVSSVQ7XG5cbiAgICAgICAgLy8gZnJvbnRcbiAgICAgICAgdGhpcy5fc3RlbmNpbEZ1bmNGcm9udCA9IGdmeC5EU19GVU5DX0FMV0FZUztcbiAgICAgICAgdGhpcy5fc3RlbmNpbFJlZkZyb250ID0gMDtcbiAgICAgICAgdGhpcy5fc3RlbmNpbE1hc2tGcm9udCA9IDB4ZmY7XG4gICAgICAgIHRoaXMuX3N0ZW5jaWxGYWlsT3BGcm9udCA9IGdmeC5TVEVOQ0lMX09QX0tFRVA7XG4gICAgICAgIHRoaXMuX3N0ZW5jaWxaRmFpbE9wRnJvbnQgPSBnZnguU1RFTkNJTF9PUF9LRUVQO1xuICAgICAgICB0aGlzLl9zdGVuY2lsWlBhc3NPcEZyb250ID0gZ2Z4LlNURU5DSUxfT1BfS0VFUDtcbiAgICAgICAgdGhpcy5fc3RlbmNpbFdyaXRlTWFza0Zyb250ID0gMHhmZjtcbiAgICAgICAgLy8gYmFja1xuICAgICAgICB0aGlzLl9zdGVuY2lsRnVuY0JhY2sgPSBnZnguRFNfRlVOQ19BTFdBWVM7XG4gICAgICAgIHRoaXMuX3N0ZW5jaWxSZWZCYWNrID0gMDtcbiAgICAgICAgdGhpcy5fc3RlbmNpbE1hc2tCYWNrID0gMHhmZjtcbiAgICAgICAgdGhpcy5fc3RlbmNpbEZhaWxPcEJhY2sgPSBnZnguU1RFTkNJTF9PUF9LRUVQO1xuICAgICAgICB0aGlzLl9zdGVuY2lsWkZhaWxPcEJhY2sgPSBnZnguU1RFTkNJTF9PUF9LRUVQO1xuICAgICAgICB0aGlzLl9zdGVuY2lsWlBhc3NPcEJhY2sgPSBnZnguU1RFTkNJTF9PUF9LRUVQO1xuICAgICAgICB0aGlzLl9zdGVuY2lsV3JpdGVNYXNrQmFjayA9IDB4ZmY7XG4gICAgfVxuXG4gICAgc2V0Q3VsbE1vZGUgKGN1bGxNb2RlID0gZ2Z4LkNVTExfQkFDSykge1xuICAgICAgICB0aGlzLl9jdWxsTW9kZSA9IGN1bGxNb2RlO1xuICAgIH1cblxuICAgIHNldEJsZW5kIChcbiAgICAgICAgZW5hYmxlZCA9IGZhbHNlLFxuICAgICAgICBibGVuZEVxID0gZ2Z4LkJMRU5EX0ZVTkNfQURELFxuICAgICAgICBibGVuZFNyYyA9IGdmeC5CTEVORF9TUkNfQUxQSEEsXG4gICAgICAgIGJsZW5kRHN0ID0gZ2Z4LkJMRU5EX09ORV9NSU5VU19TUkNfQUxQSEEsXG4gICAgICAgIGJsZW5kQWxwaGFFcSA9IGdmeC5CTEVORF9GVU5DX0FERCxcbiAgICAgICAgYmxlbmRTcmNBbHBoYSA9IGdmeC5CTEVORF9TUkNfQUxQSEEsXG4gICAgICAgIGJsZW5kRHN0QWxwaGEgPSBnZnguQkxFTkRfT05FX01JTlVTX1NSQ19BTFBIQSxcbiAgICAgICAgYmxlbmRDb2xvciA9IDB4ZmZmZmZmZmZcbiAgICApIHtcbiAgICAgICAgdGhpcy5fYmxlbmQgPSBlbmFibGVkO1xuICAgICAgICB0aGlzLl9ibGVuZEVxID0gYmxlbmRFcTtcbiAgICAgICAgdGhpcy5fYmxlbmRTcmMgPSBibGVuZFNyYztcbiAgICAgICAgdGhpcy5fYmxlbmREc3QgPSBibGVuZERzdDtcbiAgICAgICAgdGhpcy5fYmxlbmRBbHBoYUVxID0gYmxlbmRBbHBoYUVxO1xuICAgICAgICB0aGlzLl9ibGVuZFNyY0FscGhhID0gYmxlbmRTcmNBbHBoYTtcbiAgICAgICAgdGhpcy5fYmxlbmREc3RBbHBoYSA9IGJsZW5kRHN0QWxwaGE7XG4gICAgICAgIHRoaXMuX2JsZW5kQ29sb3IgPSBibGVuZENvbG9yO1xuICAgIH1cblxuICAgIHNldERlcHRoIChcbiAgICAgICAgZGVwdGhUZXN0ID0gZmFsc2UsXG4gICAgICAgIGRlcHRoV3JpdGUgPSBmYWxzZSxcbiAgICAgICAgZGVwdGhGdW5jID0gZ2Z4LkRTX0ZVTkNfTEVTU1xuICAgICkge1xuICAgICAgICB0aGlzLl9kZXB0aFRlc3QgPSBkZXB0aFRlc3Q7XG4gICAgICAgIHRoaXMuX2RlcHRoV3JpdGUgPSBkZXB0aFdyaXRlO1xuICAgICAgICB0aGlzLl9kZXB0aEZ1bmMgPSBkZXB0aEZ1bmM7XG4gICAgfVxuXG4gICAgc2V0U3RlbmNpbEZyb250IChcbiAgICAgICAgZW5hYmxlZCA9IGdmeC5TVEVOQ0lMX0lOSEVSSVQsXG4gICAgICAgIHN0ZW5jaWxGdW5jID0gZ2Z4LkRTX0ZVTkNfQUxXQVlTLFxuICAgICAgICBzdGVuY2lsUmVmID0gMCxcbiAgICAgICAgc3RlbmNpbE1hc2sgPSAweGZmLFxuICAgICAgICBzdGVuY2lsRmFpbE9wID0gZ2Z4LlNURU5DSUxfT1BfS0VFUCxcbiAgICAgICAgc3RlbmNpbFpGYWlsT3AgPSBnZnguU1RFTkNJTF9PUF9LRUVQLFxuICAgICAgICBzdGVuY2lsWlBhc3NPcCA9IGdmeC5TVEVOQ0lMX09QX0tFRVAsXG4gICAgICAgIHN0ZW5jaWxXcml0ZU1hc2sgPSAweGZmXG4gICAgKSB7XG4gICAgICAgIHRoaXMuX3N0ZW5jaWxUZXN0ID0gZW5hYmxlZDtcbiAgICAgICAgdGhpcy5fc3RlbmNpbEZ1bmNGcm9udCA9IHN0ZW5jaWxGdW5jO1xuICAgICAgICB0aGlzLl9zdGVuY2lsUmVmRnJvbnQgPSBzdGVuY2lsUmVmO1xuICAgICAgICB0aGlzLl9zdGVuY2lsTWFza0Zyb250ID0gc3RlbmNpbE1hc2s7XG4gICAgICAgIHRoaXMuX3N0ZW5jaWxGYWlsT3BGcm9udCA9IHN0ZW5jaWxGYWlsT3A7XG4gICAgICAgIHRoaXMuX3N0ZW5jaWxaRmFpbE9wRnJvbnQgPSBzdGVuY2lsWkZhaWxPcDtcbiAgICAgICAgdGhpcy5fc3RlbmNpbFpQYXNzT3BGcm9udCA9IHN0ZW5jaWxaUGFzc09wO1xuICAgICAgICB0aGlzLl9zdGVuY2lsV3JpdGVNYXNrRnJvbnQgPSBzdGVuY2lsV3JpdGVNYXNrO1xuICAgIH1cblxuICAgIHNldFN0ZW5jaWxFbmFibGVkIChzdGVuY2lsVGVzdCA9IGdmeC5TVEVOQ0lMX0lOSEVSSVQpIHtcbiAgICAgICAgdGhpcy5fc3RlbmNpbFRlc3QgPSBzdGVuY2lsVGVzdDtcbiAgICB9XG5cbiAgICBzZXRTdGVuY2lsQmFjayAoXG4gICAgICAgIHN0ZW5jaWxUZXN0ID0gZ2Z4LlNURU5DSUxfSU5IRVJJVCxcbiAgICAgICAgc3RlbmNpbEZ1bmMgPSBnZnguRFNfRlVOQ19BTFdBWVMsXG4gICAgICAgIHN0ZW5jaWxSZWYgPSAwLFxuICAgICAgICBzdGVuY2lsTWFzayA9IDB4ZmYsXG4gICAgICAgIHN0ZW5jaWxGYWlsT3AgPSBnZnguU1RFTkNJTF9PUF9LRUVQLFxuICAgICAgICBzdGVuY2lsWkZhaWxPcCA9IGdmeC5TVEVOQ0lMX09QX0tFRVAsXG4gICAgICAgIHN0ZW5jaWxaUGFzc09wID0gZ2Z4LlNURU5DSUxfT1BfS0VFUCxcbiAgICAgICAgc3RlbmNpbFdyaXRlTWFzayA9IDB4ZmZcbiAgICApIHtcbiAgICAgICAgdGhpcy5fc3RlbmNpbFRlc3QgPSBzdGVuY2lsVGVzdDtcbiAgICAgICAgdGhpcy5fc3RlbmNpbEZ1bmNCYWNrID0gc3RlbmNpbEZ1bmM7XG4gICAgICAgIHRoaXMuX3N0ZW5jaWxSZWZCYWNrID0gc3RlbmNpbFJlZjtcbiAgICAgICAgdGhpcy5fc3RlbmNpbE1hc2tCYWNrID0gc3RlbmNpbE1hc2s7XG4gICAgICAgIHRoaXMuX3N0ZW5jaWxGYWlsT3BCYWNrID0gc3RlbmNpbEZhaWxPcDtcbiAgICAgICAgdGhpcy5fc3RlbmNpbFpGYWlsT3BCYWNrID0gc3RlbmNpbFpGYWlsT3A7XG4gICAgICAgIHRoaXMuX3N0ZW5jaWxaUGFzc09wQmFjayA9IHN0ZW5jaWxaUGFzc09wO1xuICAgICAgICB0aGlzLl9zdGVuY2lsV3JpdGVNYXNrQmFjayA9IHN0ZW5jaWxXcml0ZU1hc2s7XG4gICAgfVxuXG4gICAgc2V0U3RhZ2UgKHN0YWdlKSB7XG4gICAgICAgIHRoaXMuX3N0YWdlID0gc3RhZ2U7XG4gICAgfVxuXG4gICAgc2V0UHJvcGVydGllcyAocHJvcGVydGllcykge1xuICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcbiAgICB9XG5cbiAgICBnZXRQcm9wZXJ0eSAobmFtZSkge1xuICAgICAgICBpZiAoIXRoaXMuX3Byb3BlcnRpZXNbbmFtZV0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fcHJvcGVydGllc1tuYW1lXS52YWx1ZTtcbiAgICB9XG5cbiAgICBzZXRQcm9wZXJ0eSAobmFtZSwgdmFsdWUsIGRpcmVjdGx5KSB7XG4gICAgICAgIGxldCBwcm9wID0gdGhpcy5fcHJvcGVydGllc1tuYW1lXTtcbiAgICAgICAgaWYgKCFwcm9wKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBwcm9wLmRpcmVjdGx5ID0gZGlyZWN0bHk7XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICBsZXQgYXJyYXkgPSBwcm9wLnZhbHVlO1xuICAgICAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCAhPT0gdmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybklEKDkxMDUsIHRoaXMuX25hbWUsIG5hbWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBhcnJheVtpXSA9IHZhbHVlW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHZhbHVlICYmICFBcnJheUJ1ZmZlci5pc1ZpZXcodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb3AudHlwZSA9PT0gZW51bXMuUEFSQU1fVEVYVFVSRV8yRCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wLnZhbHVlID0gdmFsdWUuZ2V0SW1wbCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFZhbHVlVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5jb25zdHJ1Y3Rvci50b0FycmF5KHByb3AudmFsdWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy53YXJuSUQoOTEwNiwgdGhpcy5fbmFtZSwgbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcHJvcC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHByb3AudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGdldERlZmluZSAobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmaW5lc1tuYW1lXTtcbiAgICB9XG5cbiAgICBkZWZpbmUgKG5hbWUsIHZhbHVlLCBmb3JjZSkge1xuICAgICAgICBsZXQgb2xkVmFsdWUgPSB0aGlzLl9kZWZpbmVzW25hbWVdO1xuXG4gICAgICAgIGlmICghZm9yY2UgJiYgb2xkVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9sZFZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fZGVmaW5lc1tuYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbUtleSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjbG9uZSAoKSB7XG4gICAgICAgIGxldCBwYXNzID0gbmV3IFBhc3ModGhpcy5fcHJvZ3JhbU5hbWUpO1xuICAgICAgICBPYmplY3QuYXNzaWduKHBhc3MsIHRoaXMpO1xuXG4gICAgICAgIGxldCBuZXdQcm9wZXJ0aWVzID0ge307XG4gICAgICAgIGxldCBwcm9wZXJ0aWVzID0gdGhpcy5fcHJvcGVydGllcztcbiAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBsZXQgcHJvcCA9IHByb3BlcnRpZXNbbmFtZV07XG4gICAgICAgICAgICBsZXQgbmV3UHJvcCA9IG5ld1Byb3BlcnRpZXNbbmFtZV0gPSB7fTtcblxuICAgICAgICAgICAgbGV0IHZhbHVlID0gcHJvcC52YWx1ZTtcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIG5ld1Byb3AudmFsdWUgPSB2YWx1ZS5jb25jYXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBuZXdQcm9wLnZhbHVlID0gbmV3IHZhbHVlLl9fcHJvdG9fXy5jb25zdHJ1Y3Rvcih2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdQcm9wLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gcHJvcCkge1xuICAgICAgICAgICAgICAgIGlmIChuYW1lID09PSAndmFsdWUnKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBuZXdQcm9wW25hbWVdID0gcHJvcFtuYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHBhc3MuX3Byb3BlcnRpZXMgPSBuZXdQcm9wZXJ0aWVzO1xuICAgICAgICBwYXNzLl9kZWZpbmVzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fZGVmaW5lcyk7XG5cbiAgICAgICAgcmV0dXJuIHBhc3M7XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvIn0=