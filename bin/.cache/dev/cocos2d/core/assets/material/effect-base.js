
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/material/effect-base.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _pass = _interopRequireDefault(require("../../../renderer/core/pass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var gfx = cc.gfx;

var EffectBase = /*#__PURE__*/function () {
  function EffectBase() {
    this._dirty = true;
    this._name = '';
    this._technique = null;
  }

  var _proto = EffectBase.prototype;

  _proto._createPassProp = function _createPassProp(name, pass) {
    var prop = pass._properties[name];

    if (!prop) {
      return;
    }

    var uniform = Object.create(null);
    uniform.name = name;
    uniform.type = prop.type;

    if (prop.value instanceof Float32Array) {
      uniform.value = new Float32Array(prop.value);
    } else if (prop.value instanceof Float64Array) {
      uniform.value = new Float64Array(prop.value);
    } else {
      uniform.value = prop.value;
    }

    pass._properties[name] = uniform;
    return uniform;
  };

  _proto._setPassProperty = function _setPassProperty(name, value, pass, directly) {
    var properties = pass._properties;

    if (!properties.hasOwnProperty(name)) {
      this._createPassProp(name, pass);
    }

    if (properties[name].value === value) {
      return true;
    }

    this._dirty = true;
    return _pass["default"].prototype.setProperty.call(pass, name, value, directly);
  };

  _proto.setProperty = function setProperty(name, value, passIdx, directly) {
    var success = false;
    var passes = this.passes;
    var start = 0,
        end = passes.length;

    if (passIdx !== undefined) {
      start = passIdx, end = passIdx + 1;
    }

    for (var i = start; i < end; i++) {
      if (this._setPassProperty(name, value, passes[i], directly)) {
        success = true;
      }
    }

    if (!success) {
      cc.warnID(9103, this.name, name);
    }
  };

  _proto.getProperty = function getProperty(name, passIdx) {
    var passes = this.passes;
    if (passIdx >= passes.length) return;
    var start = 0,
        end = passes.length;

    if (passIdx !== undefined) {
      start = passIdx, end = passIdx + 1;
    }

    for (var i = start; i < end; i++) {
      var value = passes[i].getProperty(name);

      if (value !== undefined) {
        return value;
      }
    }
  };

  _proto.define = function define(name, value, passIdx, force) {
    var success = false;
    var passes = this.passes;
    var start = 0,
        end = passes.length;

    if (passIdx !== undefined) {
      start = passIdx, end = passIdx + 1;
    }

    for (var i = start; i < end; i++) {
      if (passes[i].define(name, value, force)) {
        success = true;
      }
    }

    if (!success) {
      cc.warnID(9104, this.name, name);
    }
  };

  _proto.getDefine = function getDefine(name, passIdx) {
    var passes = this.passes;
    if (passIdx >= passes.length) return;
    var start = 0,
        end = passes.length;

    if (passIdx !== undefined) {
      start = passIdx, end = passIdx + 1;
    }

    for (var i = start; i < end; i++) {
      var value = passes[i].getDefine(name);

      if (value !== undefined) {
        return value;
      }
    }
  };

  _proto.setCullMode = function setCullMode(cullMode, passIdx) {
    if (cullMode === void 0) {
      cullMode = gfx.CULL_BACK;
    }

    var passes = this.passes;
    var start = 0,
        end = passes.length;

    if (passIdx !== undefined) {
      start = passIdx, end = passIdx + 1;
    }

    for (var i = start; i < end; i++) {
      passes[i].setCullMode(cullMode);
    }

    this._dirty = true;
  };

  _proto.setDepth = function setDepth(depthTest, depthWrite, depthFunc, passIdx) {
    var passes = this.passes;
    var start = 0,
        end = passes.length;

    if (passIdx !== undefined) {
      start = passIdx, end = passIdx + 1;
    }

    for (var i = start; i < end; i++) {
      passes[i].setDepth(depthTest, depthWrite, depthFunc);
    }

    this._dirty = true;
  };

  _proto.setBlend = function setBlend(enabled, blendEq, blendSrc, blendDst, blendAlphaEq, blendSrcAlpha, blendDstAlpha, blendColor, passIdx) {
    var passes = this.passes;
    var start = 0,
        end = passes.length;

    if (passIdx !== undefined) {
      start = passIdx, end = passIdx + 1;
    }

    for (var i = start; i < end; i++) {
      passes[i].setBlend(enabled, blendEq, blendSrc, blendDst, blendAlphaEq, blendSrcAlpha, blendDstAlpha, blendColor);
    }

    this._dirty = true;
  };

  _proto.setStencilEnabled = function setStencilEnabled(stencilTest, passIdx) {
    if (stencilTest === void 0) {
      stencilTest = gfx.STENCIL_INHERIT;
    }

    var passes = this.passes;
    var start = 0,
        end = passes.length;

    if (passIdx !== undefined) {
      start = passIdx, end = passIdx + 1;
    }

    for (var i = start; i < end; i++) {
      passes[i].setStencilEnabled(stencilTest);
    }

    this._dirty = true;
  };

  _proto.setStencil = function setStencil(enabled, stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask, passIdx) {
    var passes = this.passes;
    var start = 0,
        end = passes.length;

    if (passIdx !== undefined) {
      start = passIdx, end = passIdx + 1;
    }

    for (var i = start; i < end; i++) {
      var pass = passes[i];
      pass.setStencilFront(enabled, stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask);
      pass.setStencilBack(enabled, stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask);
    }

    this._dirty = true;
  };

  _createClass(EffectBase, [{
    key: "name",
    get: function get() {
      return this._name;
    }
  }, {
    key: "technique",
    get: function get() {
      return this._technique;
    }
  }, {
    key: "passes",
    get: function get() {
      return [];
    }
  }]);

  return EffectBase;
}();

exports["default"] = EffectBase;
cc.EffectBase = EffectBase;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0cy9tYXRlcmlhbC9lZmZlY3QtYmFzZS50cyJdLCJuYW1lcyI6WyJnZngiLCJjYyIsIkVmZmVjdEJhc2UiLCJfZGlydHkiLCJfbmFtZSIsIl90ZWNobmlxdWUiLCJfY3JlYXRlUGFzc1Byb3AiLCJuYW1lIiwicGFzcyIsInByb3AiLCJfcHJvcGVydGllcyIsInVuaWZvcm0iLCJPYmplY3QiLCJjcmVhdGUiLCJ0eXBlIiwidmFsdWUiLCJGbG9hdDMyQXJyYXkiLCJGbG9hdDY0QXJyYXkiLCJfc2V0UGFzc1Byb3BlcnR5IiwiZGlyZWN0bHkiLCJwcm9wZXJ0aWVzIiwiaGFzT3duUHJvcGVydHkiLCJQYXNzIiwicHJvdG90eXBlIiwic2V0UHJvcGVydHkiLCJjYWxsIiwicGFzc0lkeCIsInN1Y2Nlc3MiLCJwYXNzZXMiLCJzdGFydCIsImVuZCIsImxlbmd0aCIsInVuZGVmaW5lZCIsImkiLCJ3YXJuSUQiLCJnZXRQcm9wZXJ0eSIsImRlZmluZSIsImZvcmNlIiwiZ2V0RGVmaW5lIiwic2V0Q3VsbE1vZGUiLCJjdWxsTW9kZSIsIkNVTExfQkFDSyIsInNldERlcHRoIiwiZGVwdGhUZXN0IiwiZGVwdGhXcml0ZSIsImRlcHRoRnVuYyIsInNldEJsZW5kIiwiZW5hYmxlZCIsImJsZW5kRXEiLCJibGVuZFNyYyIsImJsZW5kRHN0IiwiYmxlbmRBbHBoYUVxIiwiYmxlbmRTcmNBbHBoYSIsImJsZW5kRHN0QWxwaGEiLCJibGVuZENvbG9yIiwic2V0U3RlbmNpbEVuYWJsZWQiLCJzdGVuY2lsVGVzdCIsIlNURU5DSUxfSU5IRVJJVCIsInNldFN0ZW5jaWwiLCJzdGVuY2lsRnVuYyIsInN0ZW5jaWxSZWYiLCJzdGVuY2lsTWFzayIsInN0ZW5jaWxGYWlsT3AiLCJzdGVuY2lsWkZhaWxPcCIsInN0ZW5jaWxaUGFzc09wIiwic3RlbmNpbFdyaXRlTWFzayIsInNldFN0ZW5jaWxGcm9udCIsInNldFN0ZW5jaWxCYWNrIl0s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QWtGQyxjQUFsRixFQUFrR0MsY0FBbEcsRUFBa0hDLGdCQUFsSDtBQUNIOztBQUNELFNBQUs5RCxNQUFMLEdBQWMsSUFBZDtBQUNIOzs7O1NBdExELGVBQVk7QUFDUixhQUFPLEtBQUtDLEtBQVo7QUFDSDs7O1NBR0QsZUFBaUI7QUFDYixhQUFPLEtBQUtDLFVBQVo7QUFDSDs7O1NBRUQsZUFBc0I7QUFDbEIsYUFBTyxFQUFQO0FBQ0g7Ozs7Ozs7QUE4S0xKLEVBQUUsQ0FBQ0MsVUFBSCxHQUFnQkEsVUFBaEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGFzcyBmcm9tICcuLi8uLi8uLi9yZW5kZXJlci9jb3JlL3Bhc3MnO1xuXG5jb25zdCBnZnggPSBjYy5nZng7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVmZmVjdEJhc2Uge1xuICAgIF9kaXJ0eSA9IHRydWU7XG5cbiAgICBfbmFtZSA9ICcnO1xuICAgIGdldCBuYW1lICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuXG4gICAgX3RlY2huaXF1ZSA9IG51bGw7XG4gICAgZ2V0IHRlY2huaXF1ZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90ZWNobmlxdWU7XG4gICAgfVxuXG4gICAgZ2V0IHBhc3NlcyAoKTogUGFzc1tdIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIF9jcmVhdGVQYXNzUHJvcCAobmFtZSwgcGFzcykge1xuICAgICAgICBsZXQgcHJvcCA9IHBhc3MuX3Byb3BlcnRpZXNbbmFtZV07XG4gICAgICAgIGlmICghcHJvcCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHVuaWZvcm0gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICB1bmlmb3JtLm5hbWUgPSBuYW1lO1xuICAgICAgICB1bmlmb3JtLnR5cGUgPSBwcm9wLnR5cGU7XG4gICAgICAgIGlmIChwcm9wLnZhbHVlIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5KSB7XG4gICAgICAgICAgICB1bmlmb3JtLnZhbHVlID0gbmV3IEZsb2F0MzJBcnJheShwcm9wLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChwcm9wLnZhbHVlIGluc3RhbmNlb2YgRmxvYXQ2NEFycmF5KSB7XG4gICAgICAgICAgICB1bmlmb3JtLnZhbHVlID0gbmV3IEZsb2F0NjRBcnJheShwcm9wLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHVuaWZvcm0udmFsdWUgPSBwcm9wLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHBhc3MuX3Byb3BlcnRpZXNbbmFtZV0gPSB1bmlmb3JtO1xuXG4gICAgICAgIHJldHVybiB1bmlmb3JtO1xuICAgIH1cblxuICAgIF9zZXRQYXNzUHJvcGVydHkgKG5hbWUsIHZhbHVlLCBwYXNzLCBkaXJlY3RseSkge1xuICAgICAgICBsZXQgcHJvcGVydGllcyA9IHBhc3MuX3Byb3BlcnRpZXM7XG5cbiAgICAgICAgaWYgKCFwcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLl9jcmVhdGVQYXNzUHJvcChuYW1lLCBwYXNzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzW25hbWVdLnZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9kaXJ0eSA9IHRydWU7XG4gICAgICAgIHJldHVybiBQYXNzLnByb3RvdHlwZS5zZXRQcm9wZXJ0eS5jYWxsKHBhc3MsIG5hbWUsIHZhbHVlLCBkaXJlY3RseSk7XG4gICAgfVxuXG4gICAgc2V0UHJvcGVydHkgKG5hbWUsIHZhbHVlLCBwYXNzSWR4LCBkaXJlY3RseSkge1xuICAgICAgICBsZXQgc3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICBsZXQgcGFzc2VzID0gdGhpcy5wYXNzZXM7XG4gICAgICAgIGxldCBzdGFydCA9IDAsIGVuZCA9IHBhc3Nlcy5sZW5ndGg7XG4gICAgICAgIGlmIChwYXNzSWR4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gcGFzc0lkeCwgZW5kID0gcGFzc0lkeCArIDE7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9zZXRQYXNzUHJvcGVydHkobmFtZSwgdmFsdWUsIHBhc3Nlc1tpXSwgZGlyZWN0bHkpKSB7XG4gICAgICAgICAgICAgICAgc3VjY2VzcyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzdWNjZXNzKSB7XG4gICAgICAgICAgICBjYy53YXJuSUQoOTEwMywgdGhpcy5uYW1lLCBuYW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFByb3BlcnR5IChuYW1lLCBwYXNzSWR4KSB7XG4gICAgICAgIGxldCBwYXNzZXMgPSB0aGlzLnBhc3NlcztcbiAgICAgICAgaWYgKHBhc3NJZHggPj0gcGFzc2VzLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBzdGFydCA9IDAsIGVuZCA9IHBhc3Nlcy5sZW5ndGg7XG4gICAgICAgIGlmIChwYXNzSWR4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gcGFzc0lkeCwgZW5kID0gcGFzc0lkeCArIDE7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IHBhc3Nlc1tpXS5nZXRQcm9wZXJ0eShuYW1lKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVmaW5lIChuYW1lLCB2YWx1ZSwgcGFzc0lkeCwgZm9yY2UpIHtcbiAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgbGV0IHBhc3NlcyA9IHRoaXMucGFzc2VzO1xuICAgICAgICBsZXQgc3RhcnQgPSAwLCBlbmQgPSBwYXNzZXMubGVuZ3RoO1xuICAgICAgICBpZiAocGFzc0lkeCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzdGFydCA9IHBhc3NJZHgsIGVuZCA9IHBhc3NJZHggKyAxO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocGFzc2VzW2ldLmRlZmluZShuYW1lLCB2YWx1ZSwgZm9yY2UpKSB7XG4gICAgICAgICAgICAgICAgc3VjY2VzcyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzdWNjZXNzKSB7XG4gICAgICAgICAgICBjYy53YXJuSUQoOTEwNCwgdGhpcy5uYW1lLCBuYW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldERlZmluZSAobmFtZSwgcGFzc0lkeCkge1xuICAgICAgICBsZXQgcGFzc2VzID0gdGhpcy5wYXNzZXM7XG4gICAgICAgIGlmIChwYXNzSWR4ID49IHBhc3Nlcy5sZW5ndGgpIHJldHVybjtcbiAgICAgICAgbGV0IHN0YXJ0ID0gMCwgZW5kID0gcGFzc2VzLmxlbmd0aDtcbiAgICAgICAgaWYgKHBhc3NJZHggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc3RhcnQgPSBwYXNzSWR4LCBlbmQgPSBwYXNzSWR4ICsgMTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gcGFzc2VzW2ldLmdldERlZmluZShuYW1lKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q3VsbE1vZGUgKGN1bGxNb2RlID0gZ2Z4LkNVTExfQkFDSywgcGFzc0lkeCkge1xuICAgICAgICBsZXQgcGFzc2VzID0gdGhpcy5wYXNzZXM7XG4gICAgICAgIGxldCBzdGFydCA9IDAsIGVuZCA9IHBhc3Nlcy5sZW5ndGg7XG4gICAgICAgIGlmIChwYXNzSWR4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gcGFzc0lkeCwgZW5kID0gcGFzc0lkeCArIDE7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgICAgICAgIHBhc3Nlc1tpXS5zZXRDdWxsTW9kZShjdWxsTW9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZGlydHkgPSB0cnVlO1xuICAgIH1cblxuICAgIHNldERlcHRoIChkZXB0aFRlc3QsIGRlcHRoV3JpdGUsIGRlcHRoRnVuYywgcGFzc0lkeCkge1xuICAgICAgICBsZXQgcGFzc2VzID0gdGhpcy5wYXNzZXM7XG4gICAgICAgIGxldCBzdGFydCA9IDAsIGVuZCA9IHBhc3Nlcy5sZW5ndGg7XG4gICAgICAgIGlmIChwYXNzSWR4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gcGFzc0lkeCwgZW5kID0gcGFzc0lkeCArIDE7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgICAgICAgIHBhc3Nlc1tpXS5zZXREZXB0aChkZXB0aFRlc3QsIGRlcHRoV3JpdGUsIGRlcHRoRnVuYyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZGlydHkgPSB0cnVlO1xuICAgIH1cblxuICAgIHNldEJsZW5kIChlbmFibGVkLCBibGVuZEVxLCBibGVuZFNyYywgYmxlbmREc3QsIGJsZW5kQWxwaGFFcSwgYmxlbmRTcmNBbHBoYSwgYmxlbmREc3RBbHBoYSwgYmxlbmRDb2xvciwgcGFzc0lkeCkge1xuICAgICAgICBsZXQgcGFzc2VzID0gdGhpcy5wYXNzZXM7XG4gICAgICAgIGxldCBzdGFydCA9IDAsIGVuZCA9IHBhc3Nlcy5sZW5ndGg7XG4gICAgICAgIGlmIChwYXNzSWR4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gcGFzc0lkeCwgZW5kID0gcGFzc0lkeCArIDE7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgICAgICAgIHBhc3Nlc1tpXS5zZXRCbGVuZChcbiAgICAgICAgICAgICAgICBlbmFibGVkLFxuICAgICAgICAgICAgICAgIGJsZW5kRXEsXG4gICAgICAgICAgICAgICAgYmxlbmRTcmMsIGJsZW5kRHN0LFxuICAgICAgICAgICAgICAgIGJsZW5kQWxwaGFFcSxcbiAgICAgICAgICAgICAgICBibGVuZFNyY0FscGhhLCBibGVuZERzdEFscGhhLCBibGVuZENvbG9yXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2RpcnR5ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBzZXRTdGVuY2lsRW5hYmxlZCAoc3RlbmNpbFRlc3QgPSBnZnguU1RFTkNJTF9JTkhFUklULCBwYXNzSWR4KSB7XG4gICAgICAgIGxldCBwYXNzZXMgPSB0aGlzLnBhc3NlcztcbiAgICAgICAgbGV0IHN0YXJ0ID0gMCwgZW5kID0gcGFzc2VzLmxlbmd0aDtcbiAgICAgICAgaWYgKHBhc3NJZHggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc3RhcnQgPSBwYXNzSWR4LCBlbmQgPSBwYXNzSWR4ICsgMTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICAgICAgcGFzc2VzW2ldLnNldFN0ZW5jaWxFbmFibGVkKHN0ZW5jaWxUZXN0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9kaXJ0eSA9IHRydWU7XG4gICAgfVxuXG4gICAgc2V0U3RlbmNpbCAoZW5hYmxlZCwgc3RlbmNpbEZ1bmMsIHN0ZW5jaWxSZWYsIHN0ZW5jaWxNYXNrLCBzdGVuY2lsRmFpbE9wLCBzdGVuY2lsWkZhaWxPcCwgc3RlbmNpbFpQYXNzT3AsIHN0ZW5jaWxXcml0ZU1hc2ssIHBhc3NJZHgpIHtcbiAgICAgICAgbGV0IHBhc3NlcyA9IHRoaXMucGFzc2VzO1xuICAgICAgICBsZXQgc3RhcnQgPSAwLCBlbmQgPSBwYXNzZXMubGVuZ3RoO1xuICAgICAgICBpZiAocGFzc0lkeCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzdGFydCA9IHBhc3NJZHgsIGVuZCA9IHBhc3NJZHggKyAxO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcGFzcyA9IHBhc3Nlc1tpXTtcbiAgICAgICAgICAgIHBhc3Muc2V0U3RlbmNpbEZyb250KGVuYWJsZWQsIHN0ZW5jaWxGdW5jLCBzdGVuY2lsUmVmLCBzdGVuY2lsTWFzaywgc3RlbmNpbEZhaWxPcCwgc3RlbmNpbFpGYWlsT3AsIHN0ZW5jaWxaUGFzc09wLCBzdGVuY2lsV3JpdGVNYXNrKTtcbiAgICAgICAgICAgIHBhc3Muc2V0U3RlbmNpbEJhY2soZW5hYmxlZCwgc3RlbmNpbEZ1bmMsIHN0ZW5jaWxSZWYsIHN0ZW5jaWxNYXNrLCBzdGVuY2lsRmFpbE9wLCBzdGVuY2lsWkZhaWxPcCwgc3RlbmNpbFpQYXNzT3AsIHN0ZW5jaWxXcml0ZU1hc2spO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2RpcnR5ID0gdHJ1ZTtcbiAgICB9XG59XG5cbmNjLkVmZmVjdEJhc2UgPSBFZmZlY3RCYXNlO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=