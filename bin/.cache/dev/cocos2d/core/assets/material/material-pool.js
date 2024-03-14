
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/material/material-pool.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _utils = _interopRequireDefault(require("./utils"));

var _pool = _interopRequireDefault(require("../../utils/pool"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * {
 *   effectUuid: {
 *     defineSerializeKey: []
 *   }
 * }
 */
var MaterialPool = /*#__PURE__*/function (_Pool) {
  _inheritsLoose(MaterialPool, _Pool);

  function MaterialPool() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Pool.call.apply(_Pool, [this].concat(args)) || this;
    _this.enabled = false;
    _this._pool = {};
    return _this;
  }

  var _proto = MaterialPool.prototype;

  _proto.get = function get(exampleMat, renderComponent) {
    var pool = this._pool;

    if (exampleMat instanceof cc.MaterialVariant) {
      if (exampleMat._owner) {
        if (exampleMat._owner === renderComponent) {
          return exampleMat;
        } else {
          exampleMat = exampleMat.material;
        }
      } else {
        exampleMat._owner = renderComponent;
        return exampleMat;
      }
    }

    var instance;

    if (this.enabled) {
      var uuid = exampleMat.effectAsset._uuid;

      if (pool[uuid]) {
        var key = _utils["default"].serializeDefines(exampleMat._effect._defines) + _utils["default"].serializeTechniques(exampleMat._effect._techniques);

        instance = pool[uuid][key] && pool[uuid][key].pop();
      }
    }

    if (!instance) {
      instance = new cc.MaterialVariant(exampleMat);
      instance._name = exampleMat._name + ' (Instance)';
      instance._uuid = exampleMat._uuid;
    } else {
      this.count--;
    }

    instance._owner = renderComponent;
    return instance;
  };

  _proto.put = function put(mat) {
    if (!this.enabled || !mat._owner) {
      return;
    }

    var pool = this._pool;
    var uuid = mat.effectAsset._uuid;

    if (!pool[uuid]) {
      pool[uuid] = {};
    }

    var key = _utils["default"].serializeDefines(mat._effect._defines) + _utils["default"].serializeTechniques(mat._effect._techniques);

    if (!pool[uuid][key]) {
      pool[uuid][key] = [];
    }

    if (this.count > this.maxSize) return;

    this._clean(mat);

    pool[uuid][key].push(mat);
    this.count++;
  };

  _proto.clear = function clear() {
    this._pool = {};
    this.count = 0;
  };

  _proto._clean = function _clean(mat) {
    mat._owner = null;
  };

  return MaterialPool;
}(_pool["default"]);

var materialPool = new MaterialPool();

_pool["default"].register('material', materialPool);

var _default = materialPool;
exports["default"] = _default;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0cy9tYXRlcmlhbC9tYXRlcmlhbC1wb29sLmpzIl0sIm5hbWVzIjpbIk1hdGVyaWFsUG9vbCIsImVuYWJsZWQiLCJfcG9vbCIsImdldCIsImV4YW1wbGVNYXQiLCJyZW5kZXJDb21wb25lbnQiLCJwb29sIiwiY2MiLCJNYXRlcmlhbFZhcmlhbnQiLCJfb3duZXIiLCJtYXRlcmlhbCIsImluc3RhbmNlIiwidXVpZCIsImVmZmVjdEFzc2V0IiwiX3V1aWQiLCJrZXkiLCJ1dGlscyIsInNlcmlhbGl6ZURlZmluZXMiLCJfZWZmZWN0IiwiX2RlZmluZXMiLCJzZXJpYWxpemVUZWNobmlxdWVzIiwiX3RlY2huaXF1ZXMiLCJwb3AiLCJfbmFtZSIsImNvdW50IiwicHV0IiwibWF0IiwibWF4U2l6ZSIsIl9jbGVhbiIsInB1c2giLCJjbGVhciIsIlBvb2wiLCJtYXRlcmlhbFBvb2wiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBQ01BOzs7Ozs7Ozs7OztVQUVGQyxVQUFVO1VBRVZDLFFBQVE7Ozs7OztTQUVSQyxNQUFBLGFBQUtDLFVBQUwsRUFBaUJDLGVBQWpCLEVBQWtDO0FBQzlCLFFBQUlDLElBQUksR0FBRyxLQUFLSixLQUFoQjs7QUFFQSxRQUFJRSxVQUFVLFlBQVlHLEVBQUUsQ0FBQ0MsZUFBN0IsRUFBOEM7QUFDMUMsVUFBSUosVUFBVSxDQUFDSyxNQUFmLEVBQXVCO0FBQ25CLFlBQUlMLFVBQVUsQ0FBQ0ssTUFBWCxLQUFzQkosZUFBMUIsRUFBMkM7QUFDdkMsaUJBQU9ELFVBQVA7QUFDSCxTQUZELE1BR0s7QUFDREEsVUFBQUEsVUFBVSxHQUFHQSxVQUFVLENBQUNNLFFBQXhCO0FBQ0g7QUFDSixPQVBELE1BUUs7QUFDRE4sUUFBQUEsVUFBVSxDQUFDSyxNQUFYLEdBQW9CSixlQUFwQjtBQUNBLGVBQU9ELFVBQVA7QUFDSDtBQUNKOztBQUVELFFBQUlPLFFBQUo7O0FBQ0EsUUFBSSxLQUFLVixPQUFULEVBQWtCO0FBQ2QsVUFBSVcsSUFBSSxHQUFHUixVQUFVLENBQUNTLFdBQVgsQ0FBdUJDLEtBQWxDOztBQUNBLFVBQUlSLElBQUksQ0FBQ00sSUFBRCxDQUFSLEVBQWdCO0FBQ1osWUFBSUcsR0FBRyxHQUNIQyxrQkFBTUMsZ0JBQU4sQ0FBdUJiLFVBQVUsQ0FBQ2MsT0FBWCxDQUFtQkMsUUFBMUMsSUFDQUgsa0JBQU1JLG1CQUFOLENBQTBCaEIsVUFBVSxDQUFDYyxPQUFYLENBQW1CRyxXQUE3QyxDQUZKOztBQUdBVixRQUFBQSxRQUFRLEdBQUdMLElBQUksQ0FBQ00sSUFBRCxDQUFKLENBQVdHLEdBQVgsS0FBbUJULElBQUksQ0FBQ00sSUFBRCxDQUFKLENBQVdHLEdBQVgsRUFBZ0JPLEdBQWhCLEVBQTlCO0FBQ0g7QUFDSjs7QUFFRCxRQUFJLENBQUNYLFFBQUwsRUFBZTtBQUNYQSxNQUFBQSxRQUFRLEdBQUcsSUFBSUosRUFBRSxDQUFDQyxlQUFQLENBQXVCSixVQUF2QixDQUFYO0FBQ0FPLE1BQUFBLFFBQVEsQ0FBQ1ksS0FBVCxHQUFpQm5CLFVBQVUsQ0FBQ21CLEtBQVgsR0FBbUIsYUFBcEM7QUFDQVosTUFBQUEsUUFBUSxDQUFDRyxLQUFULEdBQWlCVixVQUFVLENBQUNVLEtBQTVCO0FBQ0gsS0FKRCxNQUtLO0FBQ0QsV0FBS1UsS0FBTDtBQUNIOztBQUVEYixJQUFBQSxRQUFRLENBQUNGLE1BQVQsR0FBa0JKLGVBQWxCO0FBRUEsV0FBT00sUUFBUDtBQUNIOztTQUVEYyxNQUFBLGFBQUtDLEdBQUwsRUFBVTtBQUNOLFFBQUksQ0FBQyxLQUFLekIsT0FBTixJQUFpQixDQUFDeUIsR0FBRyxDQUFDakIsTUFBMUIsRUFBa0M7QUFDOUI7QUFDSDs7QUFFRCxRQUFJSCxJQUFJLEdBQUcsS0FBS0osS0FBaEI7QUFDQSxRQUFJVSxJQUFJLEdBQUdjLEdBQUcsQ0FBQ2IsV0FBSixDQUFnQkMsS0FBM0I7O0FBQ0EsUUFBSSxDQUFDUixJQUFJLENBQUNNLElBQUQsQ0FBVCxFQUFpQjtBQUNiTixNQUFBQSxJQUFJLENBQUNNLElBQUQsQ0FBSixHQUFhLEVBQWI7QUFDSDs7QUFDRCxRQUFJRyxHQUFHLEdBQ0hDLGtCQUFNQyxnQkFBTixDQUF1QlMsR0FBRyxDQUFDUixPQUFKLENBQVlDLFFBQW5DLElBQ0FILGtCQUFNSSxtQkFBTixDQUEwQk0sR0FBRyxDQUFDUixPQUFKLENBQVlHLFdBQXRDLENBRko7O0FBR0EsUUFBSSxDQUFDZixJQUFJLENBQUNNLElBQUQsQ0FBSixDQUFXRyxHQUFYLENBQUwsRUFBc0I7QUFDbEJULE1BQUFBLElBQUksQ0FBQ00sSUFBRCxDQUFKLENBQVdHLEdBQVgsSUFBa0IsRUFBbEI7QUFDSDs7QUFDRCxRQUFJLEtBQUtTLEtBQUwsR0FBYSxLQUFLRyxPQUF0QixFQUErQjs7QUFFL0IsU0FBS0MsTUFBTCxDQUFZRixHQUFaOztBQUNBcEIsSUFBQUEsSUFBSSxDQUFDTSxJQUFELENBQUosQ0FBV0csR0FBWCxFQUFnQmMsSUFBaEIsQ0FBcUJILEdBQXJCO0FBQ0EsU0FBS0YsS0FBTDtBQUNIOztTQUVETSxRQUFBLGlCQUFTO0FBQ0wsU0FBSzVCLEtBQUwsR0FBYSxFQUFiO0FBQ0EsU0FBS3NCLEtBQUwsR0FBYSxDQUFiO0FBQ0g7O1NBRURJLFNBQUEsZ0JBQVFGLEdBQVIsRUFBYTtBQUNUQSxJQUFBQSxHQUFHLENBQUNqQixNQUFKLEdBQWEsSUFBYjtBQUNIOzs7RUEvRXNCc0I7O0FBa0YzQixJQUFJQyxZQUFZLEdBQUcsSUFBSWhDLFlBQUosRUFBbkI7O0FBQ0ErQixpQkFBS0UsUUFBTCxDQUFjLFVBQWQsRUFBMEJELFlBQTFCOztlQUNlQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB1dGlscyBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBQb29sIGZyb20gJy4uLy4uL3V0aWxzL3Bvb2wnO1xuXG4vKipcbiAqIHtcbiAqICAgZWZmZWN0VXVpZDoge1xuICogICAgIGRlZmluZVNlcmlhbGl6ZUtleTogW11cbiAqICAgfVxuICogfVxuICovXG5jbGFzcyBNYXRlcmlhbFBvb2wgZXh0ZW5kcyBQb29sIHtcbiAgICAvLyBkZWZhdWx0IGRpc2FibGVkIG1hdGVyaWFsIHBvb2xcbiAgICBlbmFibGVkID0gZmFsc2U7XG4gICAgXG4gICAgX3Bvb2wgPSB7fTtcblxuICAgIGdldCAoZXhhbXBsZU1hdCwgcmVuZGVyQ29tcG9uZW50KSB7XG4gICAgICAgIGxldCBwb29sID0gdGhpcy5fcG9vbDtcblxuICAgICAgICBpZiAoZXhhbXBsZU1hdCBpbnN0YW5jZW9mIGNjLk1hdGVyaWFsVmFyaWFudCkge1xuICAgICAgICAgICAgaWYgKGV4YW1wbGVNYXQuX293bmVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV4YW1wbGVNYXQuX293bmVyID09PSByZW5kZXJDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4YW1wbGVNYXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBleGFtcGxlTWF0ID0gZXhhbXBsZU1hdC5tYXRlcmlhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBleGFtcGxlTWF0Ll9vd25lciA9IHJlbmRlckNvbXBvbmVudDtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXhhbXBsZU1hdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpbnN0YW5jZTtcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlZCkge1xuICAgICAgICAgICAgbGV0IHV1aWQgPSBleGFtcGxlTWF0LmVmZmVjdEFzc2V0Ll91dWlkO1xuICAgICAgICAgICAgaWYgKHBvb2xbdXVpZF0pIHtcbiAgICAgICAgICAgICAgICBsZXQga2V5ID0gXG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLnNlcmlhbGl6ZURlZmluZXMoZXhhbXBsZU1hdC5fZWZmZWN0Ll9kZWZpbmVzKSArXG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLnNlcmlhbGl6ZVRlY2huaXF1ZXMoZXhhbXBsZU1hdC5fZWZmZWN0Ll90ZWNobmlxdWVzKTtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZSA9IHBvb2xbdXVpZF1ba2V5XSAmJiBwb29sW3V1aWRdW2tleV0ucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgICAgICAgaW5zdGFuY2UgPSBuZXcgY2MuTWF0ZXJpYWxWYXJpYW50KGV4YW1wbGVNYXQpO1xuICAgICAgICAgICAgaW5zdGFuY2UuX25hbWUgPSBleGFtcGxlTWF0Ll9uYW1lICsgJyAoSW5zdGFuY2UpJztcbiAgICAgICAgICAgIGluc3RhbmNlLl91dWlkID0gZXhhbXBsZU1hdC5fdXVpZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY291bnQtLTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBpbnN0YW5jZS5fb3duZXIgPSByZW5kZXJDb21wb25lbnQ7XG4gICAgXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9XG4gICAgXG4gICAgcHV0IChtYXQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWQgfHwgIW1hdC5fb3duZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwb29sID0gdGhpcy5fcG9vbDtcbiAgICAgICAgbGV0IHV1aWQgPSBtYXQuZWZmZWN0QXNzZXQuX3V1aWQ7XG4gICAgICAgIGlmICghcG9vbFt1dWlkXSkge1xuICAgICAgICAgICAgcG9vbFt1dWlkXSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGxldCBrZXkgPSBcbiAgICAgICAgICAgIHV0aWxzLnNlcmlhbGl6ZURlZmluZXMobWF0Ll9lZmZlY3QuX2RlZmluZXMpICtcbiAgICAgICAgICAgIHV0aWxzLnNlcmlhbGl6ZVRlY2huaXF1ZXMobWF0Ll9lZmZlY3QuX3RlY2huaXF1ZXMpO1xuICAgICAgICBpZiAoIXBvb2xbdXVpZF1ba2V5XSkge1xuICAgICAgICAgICAgcG9vbFt1dWlkXVtrZXldID0gW107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY291bnQgPiB0aGlzLm1heFNpemUpIHJldHVybjtcblxuICAgICAgICB0aGlzLl9jbGVhbihtYXQpO1xuICAgICAgICBwb29sW3V1aWRdW2tleV0ucHVzaChtYXQpO1xuICAgICAgICB0aGlzLmNvdW50Kys7XG4gICAgfVxuXG4gICAgY2xlYXIgKCkge1xuICAgICAgICB0aGlzLl9wb29sID0ge307XG4gICAgICAgIHRoaXMuY291bnQgPSAwO1xuICAgIH1cblxuICAgIF9jbGVhbiAobWF0KSB7XG4gICAgICAgIG1hdC5fb3duZXIgPSBudWxsO1xuICAgIH1cbn1cblxubGV0IG1hdGVyaWFsUG9vbCA9IG5ldyBNYXRlcmlhbFBvb2woKTtcblBvb2wucmVnaXN0ZXIoJ21hdGVyaWFsJywgbWF0ZXJpYWxQb29sKTtcbmV4cG9ydCBkZWZhdWx0IG1hdGVyaWFsUG9vbDtcbiJdLCJzb3VyY2VSb290IjoiLyJ9