
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/gfx/render-buffer.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var RenderBuffer = /*#__PURE__*/function () {
  /**
   * @constructor
   * @param {Device} device
   * @param {RB_FMT_*} format
   * @param {Number} width
   * @param {Number} height
   */
  function RenderBuffer(device, format, width, height) {
    this._device = device;
    this._format = format;
    this._glID = device._gl.createRenderbuffer();
    this.update(width, height);
  }

  var _proto = RenderBuffer.prototype;

  _proto.update = function update(width, height) {
    this._width = width;
    this._height = height;
    var gl = this._device._gl;
    gl.bindRenderbuffer(gl.RENDERBUFFER, this._glID);
    gl.renderbufferStorage(gl.RENDERBUFFER, this._format, width, height);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  }
  /**
   * @method destroy
   */
  ;

  _proto.destroy = function destroy() {
    if (this._glID === null) {
      console.error('The render-buffer already destroyed');
      return;
    }

    var gl = this._device._gl;
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.deleteRenderbuffer(this._glID);
    this._glID = null;
  };

  return RenderBuffer;
}();

exports["default"] = RenderBuffer;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9yZW5kZXJlci9nZngvcmVuZGVyLWJ1ZmZlci5qcyJdLCJuYW1lcyI6WyJSZW5kZXJCdWZmZXIiLCJkZXZpY2UiLCJmb3JtYXQiLCJ3aWR0aCIsImhlaWdodCIsIl9kZXZpY2UiLCJfZm9ybWF0IiwiX2dsSUQiLCJfZ2wiLCJjcmVhdGVSZW5kZXJidWZmZXIiLCJ1cGRhdGUiLCJfd2lkdGgiLCJfaGVpZ2h0IiwiZ2wiLCJiaW5kUmVuZGVyYnVmZmVyIiwiUkVOREVSQlVGRkVSIiwicmVuZGVyYnVmZmVyU3RvcmFnZSIsImRlc3Ryb3kiLCJjb25zb2xlIiwiZXJyb3IiLCJkZWxldGVSZW5kZXJidWZmZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBcUJBO0FBQ25CO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Usd0JBQVlDLE1BQVosRUFBb0JDLE1BQXBCLEVBQTRCQyxLQUE1QixFQUFtQ0MsTUFBbkMsRUFBMkM7QUFDekMsU0FBS0MsT0FBTCxHQUFlSixNQUFmO0FBQ0EsU0FBS0ssT0FBTCxHQUFlSixNQUFmO0FBRUEsU0FBS0ssS0FBTCxHQUFhTixNQUFNLENBQUNPLEdBQVAsQ0FBV0Msa0JBQVgsRUFBYjtBQUNBLFNBQUtDLE1BQUwsQ0FBWVAsS0FBWixFQUFtQkMsTUFBbkI7QUFDRDs7OztTQUVETSxTQUFBLGdCQUFRUCxLQUFSLEVBQWVDLE1BQWYsRUFBdUI7QUFDckIsU0FBS08sTUFBTCxHQUFjUixLQUFkO0FBQ0EsU0FBS1MsT0FBTCxHQUFlUixNQUFmO0FBRUEsUUFBTVMsRUFBRSxHQUFHLEtBQUtSLE9BQUwsQ0FBYUcsR0FBeEI7QUFDQUssSUFBQUEsRUFBRSxDQUFDQyxnQkFBSCxDQUFvQkQsRUFBRSxDQUFDRSxZQUF2QixFQUFxQyxLQUFLUixLQUExQztBQUNBTSxJQUFBQSxFQUFFLENBQUNHLG1CQUFILENBQXVCSCxFQUFFLENBQUNFLFlBQTFCLEVBQXdDLEtBQUtULE9BQTdDLEVBQXNESCxLQUF0RCxFQUE2REMsTUFBN0Q7QUFDQVMsSUFBQUEsRUFBRSxDQUFDQyxnQkFBSCxDQUFvQkQsRUFBRSxDQUFDRSxZQUF2QixFQUFxQyxJQUFyQztBQUNEO0FBRUQ7QUFDRjtBQUNBOzs7U0FDRUUsVUFBQSxtQkFBVTtBQUNSLFFBQUksS0FBS1YsS0FBTCxLQUFlLElBQW5CLEVBQXlCO0FBQ3ZCVyxNQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYyxxQ0FBZDtBQUNBO0FBQ0Q7O0FBRUQsUUFBTU4sRUFBRSxHQUFHLEtBQUtSLE9BQUwsQ0FBYUcsR0FBeEI7QUFFQUssSUFBQUEsRUFBRSxDQUFDQyxnQkFBSCxDQUFvQkQsRUFBRSxDQUFDRSxZQUF2QixFQUFxQyxJQUFyQztBQUNBRixJQUFBQSxFQUFFLENBQUNPLGtCQUFILENBQXNCLEtBQUtiLEtBQTNCO0FBRUEsU0FBS0EsS0FBTCxHQUFhLElBQWI7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlckJ1ZmZlciB7XG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtEZXZpY2V9IGRldmljZVxuICAgKiBAcGFyYW0ge1JCX0ZNVF8qfSBmb3JtYXRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGRldmljZSwgZm9ybWF0LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy5fZGV2aWNlID0gZGV2aWNlO1xuICAgIHRoaXMuX2Zvcm1hdCA9IGZvcm1hdDtcbiAgICBcbiAgICB0aGlzLl9nbElEID0gZGV2aWNlLl9nbC5jcmVhdGVSZW5kZXJidWZmZXIoKTtcbiAgICB0aGlzLnVwZGF0ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgfVxuXG4gIHVwZGF0ZSAod2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMuX3dpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgY29uc3QgZ2wgPSB0aGlzLl9kZXZpY2UuX2dsO1xuICAgIGdsLmJpbmRSZW5kZXJidWZmZXIoZ2wuUkVOREVSQlVGRkVSLCB0aGlzLl9nbElEKTtcbiAgICBnbC5yZW5kZXJidWZmZXJTdG9yYWdlKGdsLlJFTkRFUkJVRkZFUiwgdGhpcy5fZm9ybWF0LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgbnVsbCk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBkZXN0cm95XG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9nbElEID09PSBudWxsKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdUaGUgcmVuZGVyLWJ1ZmZlciBhbHJlYWR5IGRlc3Ryb3llZCcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGdsID0gdGhpcy5fZGV2aWNlLl9nbDtcblxuICAgIGdsLmJpbmRSZW5kZXJidWZmZXIoZ2wuUkVOREVSQlVGRkVSLCBudWxsKTtcbiAgICBnbC5kZWxldGVSZW5kZXJidWZmZXIodGhpcy5fZ2xJRCk7XG5cbiAgICB0aGlzLl9nbElEID0gbnVsbDtcbiAgfVxufSJdLCJzb3VyY2VSb290IjoiLyJ9