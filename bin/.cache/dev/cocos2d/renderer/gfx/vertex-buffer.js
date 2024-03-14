
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/gfx/vertex-buffer.js';
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

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var VertexBuffer = /*#__PURE__*/function () {
  /**
   * @constructor
   * @param {Device} device
   * @param {VertexFormat} format
   * @param {USAGE_*} usage
   * @param {ArrayBuffer | Uint8Array} data
   */
  function VertexBuffer(device, format, usage, data) {
    this._device = device;
    this._format = format;
    this._usage = usage;
    this._bytesPerVertex = this._format._bytes;
    this._bytes = data.byteLength;
    this._numVertices = this._bytes / this._bytesPerVertex;
    this._needExpandDataStore = true; // update

    this._glID = device._gl.createBuffer();
    this.update(0, data); // stats

    device._stats.vb += this._bytes;
  }
  /**
   * @method destroy
   */


  var _proto = VertexBuffer.prototype;

  _proto.destroy = function destroy() {
    if (this._glID === -1) {
      console.error('The buffer already destroyed');
      return;
    }

    var gl = this._device._gl;
    gl.deleteBuffer(this._glID);
    this._device._stats.vb -= this.bytes;
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
        this._numVertices = this._bytes / this._bytesPerVertex;
      }
    }

    var gl = this._device._gl;
    var glUsage = this._usage;
    gl.bindBuffer(gl.ARRAY_BUFFER, this._glID);

    if (this._needExpandDataStore) {
      gl.bufferData(gl.ARRAY_BUFFER, data, glUsage);
      this._needExpandDataStore = false;
    } else {
      gl.bufferSubData(gl.ARRAY_BUFFER, byteOffset, data);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  };

  _proto.getFormat = function getFormat(name) {
    return this._format.element(name);
  };

  _proto.setUsage = function setUsage(usage) {
    this._usage = usage;
  };

  _createClass(VertexBuffer, [{
    key: "count",
    get: function get() {
      return this._numVertices;
    }
  }]);

  return VertexBuffer;
}();

var _default = VertexBuffer;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9yZW5kZXJlci9nZngvdmVydGV4LWJ1ZmZlci5qcyJdLCJuYW1lcyI6WyJWZXJ0ZXhCdWZmZXIiLCJkZXZpY2UiLCJmb3JtYXQiLCJ1c2FnZSIsImRhdGEiLCJfZGV2aWNlIiwiX2Zvcm1hdCIsIl91c2FnZSIsIl9ieXRlc1BlclZlcnRleCIsIl9ieXRlcyIsImJ5dGVMZW5ndGgiLCJfbnVtVmVydGljZXMiLCJfbmVlZEV4cGFuZERhdGFTdG9yZSIsIl9nbElEIiwiX2dsIiwiY3JlYXRlQnVmZmVyIiwidXBkYXRlIiwiX3N0YXRzIiwidmIiLCJkZXN0cm95IiwiY29uc29sZSIsImVycm9yIiwiZ2wiLCJkZWxldGVCdWZmZXIiLCJieXRlcyIsImJ5dGVPZmZzZXQiLCJnbFVzYWdlIiwiYmluZEJ1ZmZlciIsIkFSUkFZX0JVRkZFUiIsImJ1ZmZlckRhdGEiLCJidWZmZXJTdWJEYXRhIiwiZ2V0Rm9ybWF0IiwibmFtZSIsImVsZW1lbnQiLCJzZXRVc2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7SUFFTUE7QUFDSjtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNFLHdCQUFZQyxNQUFaLEVBQW9CQyxNQUFwQixFQUE0QkMsS0FBNUIsRUFBbUNDLElBQW5DLEVBQXlDO0FBQ3ZDLFNBQUtDLE9BQUwsR0FBZUosTUFBZjtBQUNBLFNBQUtLLE9BQUwsR0FBZUosTUFBZjtBQUNBLFNBQUtLLE1BQUwsR0FBY0osS0FBZDtBQUNBLFNBQUtLLGVBQUwsR0FBdUIsS0FBS0YsT0FBTCxDQUFhRyxNQUFwQztBQUNBLFNBQUtBLE1BQUwsR0FBY0wsSUFBSSxDQUFDTSxVQUFuQjtBQUNBLFNBQUtDLFlBQUwsR0FBb0IsS0FBS0YsTUFBTCxHQUFjLEtBQUtELGVBQXZDO0FBRUEsU0FBS0ksb0JBQUwsR0FBNEIsSUFBNUIsQ0FSdUMsQ0FVdkM7O0FBQ0EsU0FBS0MsS0FBTCxHQUFhWixNQUFNLENBQUNhLEdBQVAsQ0FBV0MsWUFBWCxFQUFiO0FBQ0EsU0FBS0MsTUFBTCxDQUFZLENBQVosRUFBZVosSUFBZixFQVp1QyxDQWN2Qzs7QUFDQUgsSUFBQUEsTUFBTSxDQUFDZ0IsTUFBUCxDQUFjQyxFQUFkLElBQW9CLEtBQUtULE1BQXpCO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7Ozs7O1NBQ0VVLFVBQUEsbUJBQVU7QUFDUixRQUFJLEtBQUtOLEtBQUwsS0FBZSxDQUFDLENBQXBCLEVBQXVCO0FBQ3JCTyxNQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYyw4QkFBZDtBQUNBO0FBQ0Q7O0FBRUQsUUFBSUMsRUFBRSxHQUFHLEtBQUtqQixPQUFMLENBQWFTLEdBQXRCO0FBQ0FRLElBQUFBLEVBQUUsQ0FBQ0MsWUFBSCxDQUFnQixLQUFLVixLQUFyQjtBQUNBLFNBQUtSLE9BQUwsQ0FBYVksTUFBYixDQUFvQkMsRUFBcEIsSUFBMEIsS0FBS00sS0FBL0I7QUFFQSxTQUFLWCxLQUFMLEdBQWEsQ0FBQyxDQUFkO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBOzs7U0FDRUcsU0FBQSxnQkFBT1MsVUFBUCxFQUFtQnJCLElBQW5CLEVBQXlCO0FBQ3ZCLFFBQUksS0FBS1MsS0FBTCxLQUFlLENBQUMsQ0FBcEIsRUFBdUI7QUFDckJPLE1BQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjLHlCQUFkO0FBQ0E7QUFDRDs7QUFFRCxRQUFJakIsSUFBSSxDQUFDTSxVQUFMLEtBQW9CLENBQXhCLEVBQTJCLE9BTkosQ0FRdkI7O0FBQ0EsUUFBSWUsVUFBVSxHQUFHckIsSUFBSSxDQUFDTSxVQUFsQixHQUErQixLQUFLRCxNQUF4QyxFQUFnRDtBQUM5QyxVQUFJZ0IsVUFBSixFQUFnQjtBQUNkO0FBQ0FMLFFBQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjLHNDQUFkO0FBQ0E7QUFDRCxPQUpELE1BS0s7QUFDSCxhQUFLVCxvQkFBTCxHQUE0QixJQUE1QjtBQUNBLGFBQUtILE1BQUwsR0FBY2dCLFVBQVUsR0FBR3JCLElBQUksQ0FBQ00sVUFBaEM7QUFDQSxhQUFLQyxZQUFMLEdBQW9CLEtBQUtGLE1BQUwsR0FBYyxLQUFLRCxlQUF2QztBQUNEO0FBQ0Y7O0FBRUQsUUFBSWMsRUFBRSxHQUFHLEtBQUtqQixPQUFMLENBQWFTLEdBQXRCO0FBQ0EsUUFBSVksT0FBTyxHQUFHLEtBQUtuQixNQUFuQjtBQUVBZSxJQUFBQSxFQUFFLENBQUNLLFVBQUgsQ0FBY0wsRUFBRSxDQUFDTSxZQUFqQixFQUErQixLQUFLZixLQUFwQzs7QUFDQSxRQUFJLEtBQUtELG9CQUFULEVBQStCO0FBQzdCVSxNQUFBQSxFQUFFLENBQUNPLFVBQUgsQ0FBY1AsRUFBRSxDQUFDTSxZQUFqQixFQUErQnhCLElBQS9CLEVBQXFDc0IsT0FBckM7QUFDQSxXQUFLZCxvQkFBTCxHQUE0QixLQUE1QjtBQUNELEtBSEQsTUFJSztBQUNIVSxNQUFBQSxFQUFFLENBQUNRLGFBQUgsQ0FBaUJSLEVBQUUsQ0FBQ00sWUFBcEIsRUFBa0NILFVBQWxDLEVBQThDckIsSUFBOUM7QUFDRDs7QUFDRGtCLElBQUFBLEVBQUUsQ0FBQ0ssVUFBSCxDQUFjTCxFQUFFLENBQUNNLFlBQWpCLEVBQStCLElBQS9CO0FBQ0Q7O1NBTURHLFlBQUEsbUJBQVdDLElBQVgsRUFBaUI7QUFDZixXQUFPLEtBQUsxQixPQUFMLENBQWEyQixPQUFiLENBQXFCRCxJQUFyQixDQUFQO0FBQ0Q7O1NBRURFLFdBQUEsa0JBQVUvQixLQUFWLEVBQWlCO0FBQ2YsU0FBS0ksTUFBTCxHQUFjSixLQUFkO0FBQ0Q7Ozs7U0FWRCxlQUFhO0FBQ1gsYUFBTyxLQUFLUSxZQUFaO0FBQ0Q7Ozs7OztlQVdZWCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGVudW1zIH0gZnJvbSAnLi9lbnVtcyc7XG5cbmNsYXNzIFZlcnRleEJ1ZmZlciB7XG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtEZXZpY2V9IGRldmljZVxuICAgKiBAcGFyYW0ge1ZlcnRleEZvcm1hdH0gZm9ybWF0XG4gICAqIEBwYXJhbSB7VVNBR0VfKn0gdXNhZ2VcbiAgICogQHBhcmFtIHtBcnJheUJ1ZmZlciB8IFVpbnQ4QXJyYXl9IGRhdGFcbiAgICovXG4gIGNvbnN0cnVjdG9yKGRldmljZSwgZm9ybWF0LCB1c2FnZSwgZGF0YSkge1xuICAgIHRoaXMuX2RldmljZSA9IGRldmljZTtcbiAgICB0aGlzLl9mb3JtYXQgPSBmb3JtYXQ7XG4gICAgdGhpcy5fdXNhZ2UgPSB1c2FnZTtcbiAgICB0aGlzLl9ieXRlc1BlclZlcnRleCA9IHRoaXMuX2Zvcm1hdC5fYnl0ZXM7XG4gICAgdGhpcy5fYnl0ZXMgPSBkYXRhLmJ5dGVMZW5ndGg7XG4gICAgdGhpcy5fbnVtVmVydGljZXMgPSB0aGlzLl9ieXRlcyAvIHRoaXMuX2J5dGVzUGVyVmVydGV4O1xuXG4gICAgdGhpcy5fbmVlZEV4cGFuZERhdGFTdG9yZSA9IHRydWU7XG5cbiAgICAvLyB1cGRhdGVcbiAgICB0aGlzLl9nbElEID0gZGV2aWNlLl9nbC5jcmVhdGVCdWZmZXIoKTtcbiAgICB0aGlzLnVwZGF0ZSgwLCBkYXRhKTtcblxuICAgIC8vIHN0YXRzXG4gICAgZGV2aWNlLl9zdGF0cy52YiArPSB0aGlzLl9ieXRlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIGRlc3Ryb3lcbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuX2dsSUQgPT09IC0xKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdUaGUgYnVmZmVyIGFscmVhZHkgZGVzdHJveWVkJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGdsID0gdGhpcy5fZGV2aWNlLl9nbDtcbiAgICBnbC5kZWxldGVCdWZmZXIodGhpcy5fZ2xJRCk7XG4gICAgdGhpcy5fZGV2aWNlLl9zdGF0cy52YiAtPSB0aGlzLmJ5dGVzO1xuXG4gICAgdGhpcy5fZ2xJRCA9IC0xO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgdXBkYXRlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBieXRlT2Zmc2V0XG4gICAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGRhdGFcbiAgICovXG4gIHVwZGF0ZShieXRlT2Zmc2V0LCBkYXRhKSB7XG4gICAgaWYgKHRoaXMuX2dsSUQgPT09IC0xKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdUaGUgYnVmZmVyIGlzIGRlc3Ryb3llZCcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChkYXRhLmJ5dGVMZW5ndGggPT09IDApIHJldHVybjtcblxuICAgIC8vIE5lZWQgdG8gY3JlYXRlIG5ldyBidWZmZXIgb2JqZWN0IHdoZW4gYnl0ZXMgZXhjZWVkXG4gICAgaWYgKGJ5dGVPZmZzZXQgKyBkYXRhLmJ5dGVMZW5ndGggPiB0aGlzLl9ieXRlcykge1xuICAgICAgaWYgKGJ5dGVPZmZzZXQpIHtcbiAgICAgICAgLy8gTG9zdCBkYXRhIGJldHdlZW4gWzAsIGJ5dGVPZmZzZXRdIHdoaWNoIGlzIG5lZWQgZm9yIG5ldyBidWZmZXJcbiAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHVwZGF0ZSBkYXRhLCBieXRlcyBleGNlZWQuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLl9uZWVkRXhwYW5kRGF0YVN0b3JlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fYnl0ZXMgPSBieXRlT2Zmc2V0ICsgZGF0YS5ieXRlTGVuZ3RoO1xuICAgICAgICB0aGlzLl9udW1WZXJ0aWNlcyA9IHRoaXMuX2J5dGVzIC8gdGhpcy5fYnl0ZXNQZXJWZXJ0ZXg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGdsID0gdGhpcy5fZGV2aWNlLl9nbDtcbiAgICBsZXQgZ2xVc2FnZSA9IHRoaXMuX3VzYWdlO1xuXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuX2dsSUQpO1xuICAgIGlmICh0aGlzLl9uZWVkRXhwYW5kRGF0YVN0b3JlKSB7XG4gICAgICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgZGF0YSwgZ2xVc2FnZSk7XG4gICAgICB0aGlzLl9uZWVkRXhwYW5kRGF0YVN0b3JlID0gZmFsc2U7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZ2wuYnVmZmVyU3ViRGF0YShnbC5BUlJBWV9CVUZGRVIsIGJ5dGVPZmZzZXQsIGRhdGEpO1xuICAgIH1cbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgbnVsbCk7XG4gIH1cblxuICBnZXQgY291bnQgKCkge1xuICAgIHJldHVybiB0aGlzLl9udW1WZXJ0aWNlcztcbiAgfVxuXG4gIGdldEZvcm1hdCAobmFtZSkge1xuICAgIHJldHVybiB0aGlzLl9mb3JtYXQuZWxlbWVudChuYW1lKTtcbiAgfVxuXG4gIHNldFVzYWdlICh1c2FnZSkge1xuICAgIHRoaXMuX3VzYWdlID0gdXNhZ2U7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVmVydGV4QnVmZmVyO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=