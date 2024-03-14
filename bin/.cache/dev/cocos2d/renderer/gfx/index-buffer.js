
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/gfx/index-buffer.js';
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

var _BYTES_PER_INDEX;

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BYTES_PER_INDEX = (_BYTES_PER_INDEX = {}, _BYTES_PER_INDEX[_enums.enums.INDEX_FMT_UINT8] = 1, _BYTES_PER_INDEX[_enums.enums.INDEX_FMT_UINT16] = 2, _BYTES_PER_INDEX[_enums.enums.INDEX_FMT_UINT32] = 4, _BYTES_PER_INDEX);

var IndexBuffer = /*#__PURE__*/function () {
  /**
   * @constructor
   * @param {Device} device
   * @param {INDEX_FMT_*} format
   * @param {USAGE_*} usage
   * @param {ArrayBuffer | Uint8Array} data
   */
  function IndexBuffer(device, format, usage, data) {
    this._device = device;
    this._format = format;
    this._usage = usage;
    this._bytesPerIndex = BYTES_PER_INDEX[format];
    this._bytes = data.byteLength;
    this._numIndices = this._bytes / this._bytesPerIndex;
    this._needExpandDataStore = true; // update

    this._glID = device._gl.createBuffer();
    this.update(0, data); // stats

    device._stats.ib += this._bytes;
  }
  /**
   * @method destroy
   */


  var _proto = IndexBuffer.prototype;

  _proto.destroy = function destroy() {
    if (this._glID === -1) {
      console.error('The buffer already destroyed');
      return;
    }

    var gl = this._device._gl;
    gl.deleteBuffer(this._glID);
    this._device._stats.ib -= this.bytes;
    this._glID = -1;
  }
  /**
   * @method update
   * @param {Number} byteOffset
   * @param {ArrayBuffer} data
   */
  ;

  _proto.update = function update(byteOffset, data) {
    if (this._glID === -1) {
      console.error('The buffer is destroyed');
      return;
    }

    if (data.byteLength === 0) return; // Need to create new buffer object when bytes exceed

    if (byteOffset + data.byteLength > this._bytes) {
      if (byteOffset) {
        // Lost data between [0, byteOffset] which is need for new buffer
        console.error('Failed to update data, bytes exceed.');
        return;
      } else {
        this._needExpandDataStore = true;
        this._bytes = byteOffset + data.byteLength;
        this._numIndices = this._bytes / this._bytesPerIndex;
      }
    }
    /** @type{WebGLRenderingContext} */


    var gl = this._device._gl;
    var glUsage = this._usage;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._glID);

    if (this._needExpandDataStore) {
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, glUsage);
      this._needExpandDataStore = false;
    } else {
      gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, byteOffset, data);
    }

    this._device._restoreIndexBuffer();
  };

  _proto.setUsage = function setUsage(usage) {
    this._usage = usage;
  };

  _createClass(IndexBuffer, [{
    key: "count",
    get: function get() {
      return this._numIndices;
    }
  }]);

  return IndexBuffer;
}();

IndexBuffer.BYTES_PER_INDEX = BYTES_PER_INDEX;
var _default = IndexBuffer;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9yZW5kZXJlci9nZngvaW5kZXgtYnVmZmVyLmpzIl0sIm5hbWVzIjpbIkJZVEVTX1BFUl9JTkRFWCIsImVudW1zIiwiSU5ERVhfRk1UX1VJTlQ4IiwiSU5ERVhfRk1UX1VJTlQxNiIsIklOREVYX0ZNVF9VSU5UMzIiLCJJbmRleEJ1ZmZlciIsImRldmljZSIsImZvcm1hdCIsInVzYWdlIiwiZGF0YSIsIl9kZXZpY2UiLCJfZm9ybWF0IiwiX3VzYWdlIiwiX2J5dGVzUGVySW5kZXgiLCJfYnl0ZXMiLCJieXRlTGVuZ3RoIiwiX251bUluZGljZXMiLCJfbmVlZEV4cGFuZERhdGFTdG9yZSIsIl9nbElEIiwiX2dsIiwiY3JlYXRlQnVmZmVyIiwidXBkYXRlIiwiX3N0YXRzIiwiaWIiLCJkZXN0cm95IiwiY29uc29sZSIsImVycm9yIiwiZ2wiLCJkZWxldGVCdWZmZXIiLCJieXRlcyIsImJ5dGVPZmZzZXQiLCJnbFVzYWdlIiwiYmluZEJ1ZmZlciIsIkVMRU1FTlRfQVJSQVlfQlVGRkVSIiwiYnVmZmVyRGF0YSIsImJ1ZmZlclN1YkRhdGEiLCJfcmVzdG9yZUluZGV4QnVmZmVyIiwic2V0VXNhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7QUFFQSxJQUFNQSxlQUFlLDRDQUNsQkMsYUFBTUMsZUFEWSxJQUNNLENBRE4sbUJBRWxCRCxhQUFNRSxnQkFGWSxJQUVPLENBRlAsbUJBR2xCRixhQUFNRyxnQkFIWSxJQUdPLENBSFAsbUJBQXJCOztJQU1NQztBQUNKO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0UsdUJBQVlDLE1BQVosRUFBb0JDLE1BQXBCLEVBQTRCQyxLQUE1QixFQUFtQ0MsSUFBbkMsRUFBeUM7QUFDdkMsU0FBS0MsT0FBTCxHQUFlSixNQUFmO0FBQ0EsU0FBS0ssT0FBTCxHQUFlSixNQUFmO0FBQ0EsU0FBS0ssTUFBTCxHQUFjSixLQUFkO0FBQ0EsU0FBS0ssY0FB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QllURVNfUEVSX0lOREVYID0ge1xuICBbZW51bXMuSU5ERVhfRk1UX1VJTlQ4XTogMSxcbiAgW2VudW1zLklOREVYX0ZNVF9VSU5UMTZdOiAyLFxuICBbZW51bXMuSU5ERVhfRk1UX1VJTlQzMl06IDQsXG59XG5cbmNsYXNzIEluZGV4QnVmZmVyIHtcbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0RldmljZX0gZGV2aWNlXG4gICAqIEBwYXJhbSB7SU5ERVhfRk1UXyp9IGZvcm1hdFxuICAgKiBAcGFyYW0ge1VTQUdFXyp9IHVzYWdlXG4gICAqIEBwYXJhbSB7QXJyYXlCdWZmZXIgfCBVaW50OEFycmF5fSBkYXRhXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkZXZpY2UsIGZvcm1hdCwgdXNhZ2UsIGRhdGEpIHtcbiAgICB0aGlzLl9kZXZpY2UgPSBkZXZpY2U7XG4gICAgdGhpcy5fZm9ybWF0ID0gZm9ybWF0O1xuICAgIHRoaXMuX3VzYWdlID0gdXNhZ2U7XG4gICAgdGhpcy5fYnl0ZXNQZXJJbmRleCA9IEJZVEVTX1BFUl9JTkRFWFtmb3JtYXRdO1xuICAgIHRoaXMuX2J5dGVzID0gZGF0YS5ieXRlTGVuZ3RoO1xuICAgIHRoaXMuX251bUluZGljZXMgPSB0aGlzLl9ieXRlcyAvIHRoaXMuX2J5dGVzUGVySW5kZXg7XG5cbiAgICB0aGlzLl9uZWVkRXhwYW5kRGF0YVN0b3JlID0gdHJ1ZTtcblxuICAgIC8vIHVwZGF0ZVxuICAgIHRoaXMuX2dsSUQgPSBkZXZpY2UuX2dsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgIHRoaXMudXBkYXRlKDAsIGRhdGEpO1xuXG4gICAgLy8gc3RhdHNcbiAgICBkZXZpY2UuX3N0YXRzLmliICs9IHRoaXMuX2J5dGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgZGVzdHJveVxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fZ2xJRCA9PT0gLTEpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoZSBidWZmZXIgYWxyZWFkeSBkZXN0cm95ZWQnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgZ2wgPSB0aGlzLl9kZXZpY2UuX2dsO1xuICAgIGdsLmRlbGV0ZUJ1ZmZlcih0aGlzLl9nbElEKTtcbiAgICB0aGlzLl9kZXZpY2UuX3N0YXRzLmliIC09IHRoaXMuYnl0ZXM7XG5cbiAgICB0aGlzLl9nbElEID0gLTE7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCB1cGRhdGVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGJ5dGVPZmZzZXRcbiAgICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gZGF0YVxuICAgKi9cbiAgdXBkYXRlKGJ5dGVPZmZzZXQsIGRhdGEpIHtcbiAgICBpZiAodGhpcy5fZ2xJRCA9PT0gLTEpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoZSBidWZmZXIgaXMgZGVzdHJveWVkJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuYnl0ZUxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgLy8gTmVlZCB0byBjcmVhdGUgbmV3IGJ1ZmZlciBvYmplY3Qgd2hlbiBieXRlcyBleGNlZWRcbiAgICBpZiAoYnl0ZU9mZnNldCArIGRhdGEuYnl0ZUxlbmd0aCA+IHRoaXMuX2J5dGVzKSB7XG4gICAgICBpZiAoYnl0ZU9mZnNldCkge1xuICAgICAgICAvLyBMb3N0IGRhdGEgYmV0d2VlbiBbMCwgYnl0ZU9mZnNldF0gd2hpY2ggaXMgbmVlZCBmb3IgbmV3IGJ1ZmZlclxuICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gdXBkYXRlIGRhdGEsIGJ5dGVzIGV4Y2VlZC4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuX25lZWRFeHBhbmREYXRhU3RvcmUgPSB0cnVlO1xuICAgICAgICB0aGlzLl9ieXRlcyA9IGJ5dGVPZmZzZXQgKyBkYXRhLmJ5dGVMZW5ndGg7XG4gICAgICAgIHRoaXMuX251bUluZGljZXMgPSB0aGlzLl9ieXRlcyAvIHRoaXMuX2J5dGVzUGVySW5kZXg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEB0eXBle1dlYkdMUmVuZGVyaW5nQ29udGV4dH0gKi9cbiAgICBsZXQgZ2wgPSB0aGlzLl9kZXZpY2UuX2dsO1xuICAgIGxldCBnbFVzYWdlID0gdGhpcy5fdXNhZ2U7XG5cbiAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLl9nbElEKTtcbiAgICBpZiAodGhpcy5fbmVlZEV4cGFuZERhdGFTdG9yZSkge1xuICAgICAgZ2wuYnVmZmVyRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgZGF0YSwgZ2xVc2FnZSk7XG4gICAgICB0aGlzLl9uZWVkRXhwYW5kRGF0YVN0b3JlID0gZmFsc2U7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZ2wuYnVmZmVyU3ViRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgYnl0ZU9mZnNldCwgZGF0YSk7XG4gICAgfVxuICAgIHRoaXMuX2RldmljZS5fcmVzdG9yZUluZGV4QnVmZmVyKCk7XG4gIH1cblxuICBnZXQgY291bnQgKCkge1xuICAgIHJldHVybiB0aGlzLl9udW1JbmRpY2VzO1xuICB9XG5cbiAgc2V0VXNhZ2UgKHVzYWdlKSB7XG4gICAgdGhpcy5fdXNhZ2UgPSB1c2FnZTtcbiAgfVxufVxuXG5JbmRleEJ1ZmZlci5CWVRFU19QRVJfSU5ERVggPSBCWVRFU19QRVJfSU5ERVg7XG5cbmV4cG9ydCBkZWZhdWx0IEluZGV4QnVmZmVyO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=