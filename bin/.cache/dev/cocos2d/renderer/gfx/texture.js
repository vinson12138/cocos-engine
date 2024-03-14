
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/gfx/texture.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _enums = require("./enums");

/**
 * @type {WebGLTexture}
 */
var _nullWebGLTexture = null;
var _textureID = 0;
/**
 * @typedef {import("../gfx/device").default} Device
 */

var Texture = /*#__PURE__*/function () {
  /**
   * @param {Device} device
   */
  function Texture(device) {
    this._device = device;
    this._width = 4;
    this._height = 4;
    this._genMipmaps = false;
    this._compressed = false;
    this._anisotropy = 1;
    this._minFilter = _enums.enums.FILTER_LINEAR;
    this._magFilter = _enums.enums.FILTER_LINEAR;
    this._mipFilter = _enums.enums.FILTER_LINEAR;
    this._wrapS = _enums.enums.WRAP_REPEAT;
    this._wrapT = _enums.enums.WRAP_REPEAT; // wrapR available in webgl2
    // this._wrapR = enums.WRAP_REPEAT;

    this._format = _enums.enums.TEXTURE_FMT_RGBA8;
    this._target = -1;
    this._id = _textureID++;
  }
  /**
   * @method destroy
   */


  var _proto = Texture.prototype;

  _proto.destroy = function destroy() {
    if (this._glID === _nullWebGLTexture) {
      console.error('The texture already destroyed');
      return;
    }

    var gl = this._device._gl;
    gl.deleteTexture(this._glID);
    this._device._stats.tex -= this.bytes;
    this._glID = _nullWebGLTexture;
  };

  return Texture;
}();

exports["default"] = Texture;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9yZW5kZXJlci9nZngvdGV4dHVyZS5qcyJdLCJuYW1lcyI6WyJfbnVsbFdlYkdMVGV4dHVyZSIsIl90ZXh0dXJlSUQiLCJUZXh0dXJlIiwiZGV2aWNlIiwiX2RldmljZSIsIl93aWR0aCIsIl9oZWlnaHQiLCJfZ2VuTWlwbWFwcyIsIl9jb21wcmVzc2VkIiwiX2FuaXNvdHJvcHkiLCJfbWluRmlsdGVyIiwiZW51bXMiLCJGSUxURVJfTElORUFSIiwiX21hZ0ZpbHRlciIsIl9taXBGaWx0ZXIiLCJfd3JhcFMiLCJXUkFQX1JFUEVBVCIsIl93cmFwVCIsIl9mb3JtYXQiLCJURVhUVVJFX0ZNVF9SR0JBOCIsIl90YXJnZXQiLCJfaWQiLCJkZXN0cm95IiwiX2dsSUQiLCJjb25zb2xlIiwiZXJyb3IiLCJnbCIsIl9nbCIsImRlbGV0ZVRleHR1cmUiLCJfc3RhdHMiLCJ0ZXgiLCJieXRlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQU1BLGlCQUFpQixHQUFHLElBQTFCO0FBRUEsSUFBSUMsVUFBVSxHQUFHLENBQWpCO0FBRUE7QUFDQTtBQUNBOztJQUVxQkM7QUFDbkI7QUFDRjtBQUNBO0FBQ0UsbUJBQVlDLE1BQVosRUFBb0I7QUFDbEIsU0FBS0MsT0FBTCxHQUFlRCxNQUFmO0FBRUEsU0FBS0UsTUFBTCxHQUFjLENBQWQ7QUFDQSxTQUFLQyxPQUFMLEdBQWUsQ0FBZjtBQUNBLFNBQUtDLFdBQUwsR0FBbUIsS0FBbkI7QUFDQSxTQUFLQyxXQUFMLEdBQW1CLEtBQW5CO0FBRUEsU0FBS0MsV0FBTCxHQUFtQixDQUFuQjtBQUNBLFNBQUtDLFVBQUwsR0FBa0JDLGFBQU1DLGFBQXhCO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQkYsYUFBTUMsYUFBeEI7QUFDQSxTQUFLRSxVQUFMLEdBQWtCSCxhQUFNQyxhQUF4QjtBQUNBLFNBQUtHLE1BQUwsR0FBY0osYUFBTUssV0FBcEI7QUFDQSxTQUFLQyxNQUFMLEdBQWNOLGFBQU1LLFdBQXBCLENBYmtCLENBY2xCO0FBQ0E7O0FBQ0EsU0FBS0UsT0FBTCxHQUFlUCxhQUFNUSxpQkFBckI7QUFFQSxTQUFLQyxPQUFMLEdBQWUsQ0FBQyxDQUFoQjtBQUVBLFNBQUtDLEdBQUwsR0FBV3BCLFVBQVUsRUFBckI7QUFDRDtBQUVEO0FBQ0Y7QUFDQTs7Ozs7U0FDRXFCLFVBQUEsbUJBQVU7QUFDUixRQUFJLEtBQUtDLEtBQUwsS0FBZXZCLGlCQUFuQixFQUFzQztBQUNwQ3dCLE1BQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjLCtCQUFkO0FBQ0E7QUFDRDs7QUFFRCxRQUFJQyxFQUFFLEdBQUcsS0FBS3RCLE9BQUwsQ0FBYXVCLEdBQXRCO0FBQ0FELElBQUFBLEVBQUUsQ0FBQ0UsYUFBSCxDQUFpQixLQUFLTCxLQUF0QjtBQUVBLFNBQUtuQixPQUFMLENBQWF5QixNQUFiLENBQW9CQyxHQUFwQixJQUEyQixLQUFLQyxLQUFoQztBQUNBLFNBQUtSLEtBQUwsR0FBYXZCLGlCQUFiO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBlbnVtcyB9IGZyb20gJy4vZW51bXMnO1xuXG4vKipcbiAqIEB0eXBlIHtXZWJHTFRleHR1cmV9XG4gKi9cbmNvbnN0IF9udWxsV2ViR0xUZXh0dXJlID0gbnVsbDtcblxubGV0IF90ZXh0dXJlSUQgPSAwO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtpbXBvcnQoXCIuLi9nZngvZGV2aWNlXCIpLmRlZmF1bHR9IERldmljZVxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleHR1cmUge1xuICAvKipcbiAgICogQHBhcmFtIHtEZXZpY2V9IGRldmljZVxuICAgKi9cbiAgY29uc3RydWN0b3IoZGV2aWNlKSB7XG4gICAgdGhpcy5fZGV2aWNlID0gZGV2aWNlO1xuXG4gICAgdGhpcy5fd2lkdGggPSA0O1xuICAgIHRoaXMuX2hlaWdodCA9IDQ7XG4gICAgdGhpcy5fZ2VuTWlwbWFwcyA9IGZhbHNlO1xuICAgIHRoaXMuX2NvbXByZXNzZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuX2FuaXNvdHJvcHkgPSAxO1xuICAgIHRoaXMuX21pbkZpbHRlciA9IGVudW1zLkZJTFRFUl9MSU5FQVI7XG4gICAgdGhpcy5fbWFnRmlsdGVyID0gZW51bXMuRklMVEVSX0xJTkVBUjtcbiAgICB0aGlzLl9taXBGaWx0ZXIgPSBlbnVtcy5GSUxURVJfTElORUFSO1xuICAgIHRoaXMuX3dyYXBTID0gZW51bXMuV1JBUF9SRVBFQVQ7XG4gICAgdGhpcy5fd3JhcFQgPSBlbnVtcy5XUkFQX1JFUEVBVDtcbiAgICAvLyB3cmFwUiBhdmFpbGFibGUgaW4gd2ViZ2wyXG4gICAgLy8gdGhpcy5fd3JhcFIgPSBlbnVtcy5XUkFQX1JFUEVBVDtcbiAgICB0aGlzLl9mb3JtYXQgPSBlbnVtcy5URVhUVVJFX0ZNVF9SR0JBODtcblxuICAgIHRoaXMuX3RhcmdldCA9IC0xO1xuICAgIFxuICAgIHRoaXMuX2lkID0gX3RleHR1cmVJRCsrO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgZGVzdHJveVxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fZ2xJRCA9PT0gX251bGxXZWJHTFRleHR1cmUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoZSB0ZXh0dXJlIGFscmVhZHkgZGVzdHJveWVkJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGdsID0gdGhpcy5fZGV2aWNlLl9nbDtcbiAgICBnbC5kZWxldGVUZXh0dXJlKHRoaXMuX2dsSUQpO1xuXG4gICAgdGhpcy5fZGV2aWNlLl9zdGF0cy50ZXggLT0gdGhpcy5ieXRlcztcbiAgICB0aGlzLl9nbElEID0gX251bGxXZWJHTFRleHR1cmU7XG4gIH1cbn0iXSwic291cmNlUm9vdCI6Ii8ifQ==