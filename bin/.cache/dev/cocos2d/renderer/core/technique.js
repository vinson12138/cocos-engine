
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/core/technique.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
var Technique = /*#__PURE__*/function () {
  function Technique(name, passes) {
    this._name = name;
    this._passes = passes;
  }

  var _proto = Technique.prototype;

  _proto.clone = function clone() {
    var passes = [];

    for (var i = 0; i < this._passes.length; i++) {
      passes.push(this._passes[i].clone());
    }

    return new Technique(this._name, passes);
  };

  _createClass(Technique, [{
    key: "name",
    get: function get() {
      return this._name;
    }
  }, {
    key: "passes",
    get: function get() {
      return this._passes;
    }
  }]);

  return Technique;
}();

exports["default"] = Technique;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9yZW5kZXJlci9jb3JlL3RlY2huaXF1ZS5qcyJdLCJuYW1lcyI6WyJUZWNobmlxdWUiLCJuYW1lIiwicGFzc2VzIiwiX25hbWUiLCJfcGFzc2VzIiwiY2xvbmUiLCJpIiwibGVuZ3RoIiwicHVzaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtJQUVxQkE7QUFDbkIscUJBQVlDLElBQVosRUFBa0JDLE1BQWxCLEVBQTBCO0FBQ3hCLFNBQUtDLEtBQUwsR0FBYUYsSUFBYjtBQUNBLFNBQUtHLE9BQUwsR0FBZUYsTUFBZjtBQUNEOzs7O1NBVURHLFFBQUEsaUJBQVM7QUFDUCxRQUFJSCxNQUFNLEdBQUcsRUFBYjs7QUFDQSxTQUFLLElBQUlJLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS0YsT0FBTCxDQUFhRyxNQUFqQyxFQUF5Q0QsQ0FBQyxFQUExQyxFQUE4QztBQUM1Q0osTUFBQUEsTUFBTSxDQUFDTSxJQUFQLENBQVksS0FBS0osT0FBTCxDQUFhRSxDQUFiLEVBQWdCRCxLQUFoQixFQUFaO0FBQ0Q7O0FBQ0QsV0FBTyxJQUFJTCxTQUFKLENBQWMsS0FBS0csS0FBbkIsRUFBMEJELE1BQTFCLENBQVA7QUFDRDs7OztTQWRELGVBQVk7QUFDVixhQUFPLEtBQUtDLEtBQVo7QUFDRDs7O1NBRUQsZUFBYTtBQUNYLGFBQU8sS0FBS0MsT0FBWjtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlY2huaXF1ZSB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIHBhc3Nlcykge1xuICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuICAgIHRoaXMuX3Bhc3NlcyA9IHBhc3NlcztcbiAgfVxuXG4gIGdldCBuYW1lICgpIHtcbiAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgfVxuXG4gIGdldCBwYXNzZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Bhc3NlcztcbiAgfVxuXG4gIGNsb25lICgpIHtcbiAgICBsZXQgcGFzc2VzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9wYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhc3Nlcy5wdXNoKHRoaXMuX3Bhc3Nlc1tpXS5jbG9uZSgpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBUZWNobmlxdWUodGhpcy5fbmFtZSwgcGFzc2VzKTtcbiAgfVxufSJdLCJzb3VyY2VSb290IjoiLyJ9