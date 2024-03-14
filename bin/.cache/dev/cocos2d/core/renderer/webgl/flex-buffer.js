
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/webgl/flex-buffer.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

/****************************************************************************
 LICENSING AGREEMENT
 
 Xiamen Yaji Software Co., Ltd., (the “Licensor”) grants the user (the “Licensee”) non-exclusive and non-transferable rights to use the software according to the following conditions:
 a.  The Licensee shall pay royalties to the Licensor, and the amount of those royalties and the payment method are subject to separate negotiations between the parties.
 b.  The software is licensed for use rather than sold, and the Licensor reserves all rights over the software that are not expressly granted (whether by implication, reservation or prohibition).
 c.  The open source codes contained in the software are subject to the MIT Open Source Licensing Agreement (see the attached for the details);
 d.  The Licensee acknowledges and consents to the possibility that errors may occur during the operation of the software for one or more technical reasons, and the Licensee shall take precautions and prepare remedies for such events. In such circumstance, the Licensor shall provide software patches or updates according to the agreement between the two parties. The Licensor will not assume any liability beyond the explicit wording of this Licensing Agreement.
 e.  Where the Licensor must assume liability for the software according to relevant laws, the Licensor’s entire liability is limited to the annual royalty payable by the Licensee.
 f.  The Licensor owns the portions listed in the root directory and subdirectory (if any) in the software and enjoys the intellectual property rights over those portions. As for the portions owned by the Licensor, the Licensee shall not:
 - i. Bypass or avoid any relevant technical protection measures in the products or services;
 - ii. Release the source codes to any other parties;
 - iii. Disassemble, decompile, decipher, attack, emulate, exploit or reverse-engineer these portion of code;
 - iv. Apply it to any third-party products or services without Licensor’s permission;
 - v. Publish, copy, rent, lease, sell, export, import, distribute or lend any products containing these portions of code;
 - vi. Allow others to use any services relevant to the technology of these codes;
 - vii. Conduct any other act beyond the scope of this Licensing Agreement.
 g.  This Licensing Agreement terminates immediately if the Licensee breaches this Agreement. The Licensor may claim compensation from the Licensee where the Licensee’s breach causes any damage to the Licensor.
 h.  The laws of the People's Republic of China apply to this Licensing Agreement.
 i.  This Agreement is made in both Chinese and English, and the Chinese version shall prevail the event of conflict.
 ****************************************************************************/
var FlexBuffer = /*#__PURE__*/function () {
  function FlexBuffer(handler, index, verticesCount, indicesCount, vfmt) {
    this._handler = handler;
    this._index = index;
    this._vfmt = vfmt;
    this._verticesBytes = vfmt._bytes;
    this._initVerticesCount = verticesCount;
    this._initIndicesCount = indicesCount;
    this.reset();
  }

  var _proto = FlexBuffer.prototype;

  _proto._reallocVData = function _reallocVData(floatsCount, oldData) {
    this.vData = new Float32Array(floatsCount);
    this.uintVData = new Uint32Array(this.vData.buffer);

    if (oldData) {
      this.vData.set(oldData);
    }

    this._handler.updateMesh(this._index, this.vData, this.iData);
  };

  _proto._reallocIData = function _reallocIData(indicesCount, oldData) {
    this.iData = new Uint16Array(indicesCount);

    if (oldData) {
      this.iData.set(oldData);
    }

    this._handler.updateMesh(this._index, this.vData, this.iData);
  };

  _proto.reserve = function reserve(verticesCount, indicesCount) {
    var floatsCount = verticesCount * this._verticesBytes >> 2;
    var newFloatsCount = this.vData.length;
    var realloced = false;

    if (floatsCount > newFloatsCount) {
      while (newFloatsCount < floatsCount) {
        newFloatsCount *= 2;
      }

      this._reallocVData(newFloatsCount, this.vData);

      realloced = true;
    }

    var newIndicesCount = this.iData.length;

    if (indicesCount > newIndicesCount) {
      while (newIndicesCount < indicesCount) {
        newIndicesCount *= 2;
      }

      this._reallocIData(indicesCount, this.iData);

      realloced = true;
    }

    return realloced;
  };

  _proto.used = function used(verticesCount, indicesCount) {
    this.usedVertices = verticesCount;
    this.usedIndices = indicesCount;
    this.usedVerticesFloats = verticesCount * this._verticesBytes >> 2;

    this._handler.updateMeshRange(verticesCount, indicesCount);
  };

  _proto.reset = function reset() {
    var floatsCount = this._initVerticesCount * this._verticesBytes >> 2;

    this._reallocVData(floatsCount);

    this._reallocIData(this._initIndicesCount);

    this.usedVertices = 0;
    this.usedVerticesFloats = 0;
    this.usedIndices = 0;
  };

  return FlexBuffer;
}();

exports["default"] = FlexBuffer;
cc.FlexBuffer = FlexBuffer;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL3dlYmdsL2ZsZXgtYnVmZmVyLmpzIl0sIm5hbWVzIjpbIkZsZXhCdWZmZXIiLCJoYW5kbGVyIiwiaW5kZXgiLCJ2ZXJ0aWNlc0NvdW50IiwiaW5kaWNlc0NvdW50IiwidmZtdCIsIl9oYW5kbGVyIiwiX2luZGV4IiwiX3ZmbXQiLCJfdmVydGljZXNCeXRlcyIsIl9ieXRlcyIsIl9pbml0VmVydGljZXNDb3VudCIsIl9pbml0SW5kaWNlc0NvdW50IiwicmVzZXQiLCJfcmVhbGxvY1ZEYXRhIiwiZmxvYXRzQ291bnQiLCJvbGREYXRhIiwidkRhdGEiLCJGbG9hdDMyQXJyYXkiLCJ1aW50VkRhdGEiLCJVaW50MzJBcnJheSIsImJ1ZmZlciIsInNldCIsInVwZGF0ZU1lc2giLCJpRGF0YSIsIl9yZWFsbG9jSURhdGEiLCJVaW50MTZBcnJheSIsInJlc2VydmUiLCJuZXdGbG9hdHNDb3VudCIsImxlbmd0aCIsInJlYWxsb2NlZCIsIm5ld0luZGljZXNDb3VudCIsInVzZWQiLCJ1c2VkVmVydGljZXMiLCJ1c2VkSW5kaWNlcyIsInVzZWRWZXJ0aWNlc0Zsb2F0cyIsInVwZGF0ZU1lc2hSYW5nZSIsImNjIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBRXFCQTtBQUNqQixzQkFBYUMsT0FBYixFQUFzQkMsS0FBdEIsRUFBNkJDLGFBQTdCLEVBQTRDQyxZQUE1QyxFQUEwREMsSUFBMUQsRUFBZ0U7QUFDNUQsU0FBS0MsUUFBTCxHQUFnQkwsT0FBaEI7QUFDQSxTQUFLTSxNQUFMLEdBQWNMLEtBQWQ7QUFDQSxTQUFLTSxLQUFMLEdBQWFILElBQWI7QUFDQSxTQUFLSSxjQUFMLEdBQXNCSixJQUFJLENBQUNLLE1B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KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gTElDRU5TSU5HIEFHUkVFTUVOVFxuIFxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiwgKHRoZSDigJxMaWNlbnNvcuKAnSkgZ3JhbnRzIHRoZSB1c2VyICh0aGUg4oCcTGljZW5zZWXigJ0pIG5vbi1leGNsdXNpdmUgYW5kIG5vbi10cmFuc2ZlcmFibGUgcmlnaHRzIHRvIHVzZSB0aGUgc29mdHdhcmUgYWNjb3JkaW5nIHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiBhLiAgVGhlIExpY2Vuc2VlIHNoYWxsIHBheSByb3lhbHRpZXMgdG8gdGhlIExpY2Vuc29yLCBhbmQgdGhlIGFtb3VudCBvZiB0aG9zZSByb3lhbHRpZXMgYW5kIHRoZSBwYXltZW50IG1ldGhvZCBhcmUgc3ViamVjdCB0byBzZXBhcmF0ZSBuZWdvdGlhdGlvbnMgYmV0d2VlbiB0aGUgcGFydGllcy5cbiBiLiAgVGhlIHNvZnR3YXJlIGlzIGxpY2Vuc2VkIGZvciB1c2UgcmF0aGVyIHRoYW4gc29sZCwgYW5kIHRoZSBMaWNlbnNvciByZXNlcnZlcyBhbGwgcmlnaHRzIG92ZXIgdGhlIHNvZnR3YXJlIHRoYXQgYXJlIG5vdCBleHByZXNzbHkgZ3JhbnRlZCAod2hldGhlciBieSBpbXBsaWNhdGlvbiwgcmVzZXJ2YXRpb24gb3IgcHJvaGliaXRpb24pLlxuIGMuICBUaGUgb3BlbiBzb3VyY2UgY29kZXMgY29udGFpbmVkIGluIHRoZSBzb2Z0d2FyZSBhcmUgc3ViamVjdCB0byB0aGUgTUlUIE9wZW4gU291cmNlIExpY2Vuc2luZyBBZ3JlZW1lbnQgKHNlZSB0aGUgYXR0YWNoZWQgZm9yIHRoZSBkZXRhaWxzKTtcbiBkLiAgVGhlIExpY2Vuc2VlIGFja25vd2xlZGdlcyBhbmQgY29uc2VudHMgdG8gdGhlIHBvc3NpYmlsaXR5IHRoYXQgZXJyb3JzIG1heSBvY2N1ciBkdXJpbmcgdGhlIG9wZXJhdGlvbiBvZiB0aGUgc29mdHdhcmUgZm9yIG9uZSBvciBtb3JlIHRlY2huaWNhbCByZWFzb25zLCBhbmQgdGhlIExpY2Vuc2VlIHNoYWxsIHRha2UgcHJlY2F1dGlvbnMgYW5kIHByZXBhcmUgcmVtZWRpZXMgZm9yIHN1Y2ggZXZlbnRzLiBJbiBzdWNoIGNpcmN1bXN0YW5jZSwgdGhlIExpY2Vuc29yIHNoYWxsIHByb3ZpZGUgc29mdHdhcmUgcGF0Y2hlcyBvciB1cGRhdGVzIGFjY29yZGluZyB0byB0aGUgYWdyZWVtZW50IGJldHdlZW4gdGhlIHR3byBwYXJ0aWVzLiBUaGUgTGljZW5zb3Igd2lsbCBub3QgYXNzdW1lIGFueSBsaWFiaWxpdHkgYmV5b25kIHRoZSBleHBsaWNpdCB3b3JkaW5nIG9mIHRoaXMgTGljZW5zaW5nIEFncmVlbWVudC5cbiBlLiAgV2hlcmUgdGhlIExpY2Vuc29yIG11c3QgYXNzdW1lIGxpYWJpbGl0eSBmb3IgdGhlIHNvZnR3YXJlIGFjY29yZGluZyB0byByZWxldmFudCBsYXdzLCB0aGUgTGljZW5zb3LigJlzIGVudGlyZSBsaWFiaWxpdHkgaXMgbGltaXRlZCB0byB0aGUgYW5udWFsIHJveWFsdHkgcGF5YWJsZSBieSB0aGUgTGljZW5zZWUuXG4gZi4gIFRoZSBMaWNlbnNvciBvd25zIHRoZSBwb3J0aW9ucyBsaXN0ZWQgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IGFuZCBzdWJkaXJlY3RvcnkgKGlmIGFueSkgaW4gdGhlIHNvZnR3YXJlIGFuZCBlbmpveXMgdGhlIGludGVsbGVjdHVhbCBwcm9wZXJ0eSByaWdodHMgb3ZlciB0aG9zZSBwb3J0aW9ucy4gQXMgZm9yIHRoZSBwb3J0aW9ucyBvd25lZCBieSB0aGUgTGljZW5zb3IsIHRoZSBMaWNlbnNlZSBzaGFsbCBub3Q6XG4gLSBpLiBCeXBhc3Mgb3IgYXZvaWQgYW55IHJlbGV2YW50IHRlY2huaWNhbCBwcm90ZWN0aW9uIG1lYXN1cmVzIGluIHRoZSBwcm9kdWN0cyBvciBzZXJ2aWNlcztcbiAtIGlpLiBSZWxlYXNlIHRoZSBzb3VyY2UgY29kZXMgdG8gYW55IG90aGVyIHBhcnRpZXM7XG4gLSBpaWkuIERpc2Fzc2VtYmxlLCBkZWNvbXBpbGUsIGRlY2lwaGVyLCBhdHRhY2ssIGVtdWxhdGUsIGV4cGxvaXQgb3IgcmV2ZXJzZS1lbmdpbmVlciB0aGVzZSBwb3J0aW9uIG9mIGNvZGU7XG4gLSBpdi4gQXBwbHkgaXQgdG8gYW55IHRoaXJkLXBhcnR5IHByb2R1Y3RzIG9yIHNlcnZpY2VzIHdpdGhvdXQgTGljZW5zb3LigJlzIHBlcm1pc3Npb247XG4gLSB2LiBQdWJsaXNoLCBjb3B5LCByZW50LCBsZWFzZSwgc2VsbCwgZXhwb3J0LCBpbXBvcnQsIGRpc3RyaWJ1dGUgb3IgbGVuZCBhbnkgcHJvZHVjdHMgY29udGFpbmluZyB0aGVzZSBwb3J0aW9ucyBvZiBjb2RlO1xuIC0gdmkuIEFsbG93IG90aGVycyB0byB1c2UgYW55IHNlcnZpY2VzIHJlbGV2YW50IHRvIHRoZSB0ZWNobm9sb2d5IG9mIHRoZXNlIGNvZGVzO1xuIC0gdmlpLiBDb25kdWN0IGFueSBvdGhlciBhY3QgYmV5b25kIHRoZSBzY29wZSBvZiB0aGlzIExpY2Vuc2luZyBBZ3JlZW1lbnQuXG4gZy4gIFRoaXMgTGljZW5zaW5nIEFncmVlbWVudCB0ZXJtaW5hdGVzIGltbWVkaWF0ZWx5IGlmIHRoZSBMaWNlbnNlZSBicmVhY2hlcyB0aGlzIEFncmVlbWVudC4gVGhlIExpY2Vuc29yIG1heSBjbGFpbSBjb21wZW5zYXRpb24gZnJvbSB0aGUgTGljZW5zZWUgd2hlcmUgdGhlIExpY2Vuc2Vl4oCZcyBicmVhY2ggY2F1c2VzIGFueSBkYW1hZ2UgdG8gdGhlIExpY2Vuc29yLlxuIGguICBUaGUgbGF3cyBvZiB0aGUgUGVvcGxlJ3MgUmVwdWJsaWMgb2YgQ2hpbmEgYXBwbHkgdG8gdGhpcyBMaWNlbnNpbmcgQWdyZWVtZW50LlxuIGkuICBUaGlzIEFncmVlbWVudCBpcyBtYWRlIGluIGJvdGggQ2hpbmVzZSBhbmQgRW5nbGlzaCwgYW5kIHRoZSBDaGluZXNlIHZlcnNpb24gc2hhbGwgcHJldmFpbCB0aGUgZXZlbnQgb2YgY29uZmxpY3QuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmxleEJ1ZmZlciB7XG4gICAgY29uc3RydWN0b3IgKGhhbmRsZXIsIGluZGV4LCB2ZXJ0aWNlc0NvdW50LCBpbmRpY2VzQ291bnQsIHZmbXQpIHtcbiAgICAgICAgdGhpcy5faGFuZGxlciA9IGhhbmRsZXI7XG4gICAgICAgIHRoaXMuX2luZGV4ID0gaW5kZXg7XG4gICAgICAgIHRoaXMuX3ZmbXQgPSB2Zm10O1xuICAgICAgICB0aGlzLl92ZXJ0aWNlc0J5dGVzID0gdmZtdC5fYnl0ZXM7XG5cbiAgICAgICAgdGhpcy5faW5pdFZlcnRpY2VzQ291bnQgPSB2ZXJ0aWNlc0NvdW50O1xuICAgICAgICB0aGlzLl9pbml0SW5kaWNlc0NvdW50ID0gaW5kaWNlc0NvdW50O1xuXG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9XG5cbiAgICBfcmVhbGxvY1ZEYXRhIChmbG9hdHNDb3VudCwgb2xkRGF0YSkge1xuICAgICAgICB0aGlzLnZEYXRhID0gbmV3IEZsb2F0MzJBcnJheShmbG9hdHNDb3VudCk7XG4gICAgICAgIHRoaXMudWludFZEYXRhID0gbmV3IFVpbnQzMkFycmF5KHRoaXMudkRhdGEuYnVmZmVyKTtcblxuICAgICAgICBpZiAob2xkRGF0YSkge1xuICAgICAgICAgICAgdGhpcy52RGF0YS5zZXQob2xkRGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9oYW5kbGVyLnVwZGF0ZU1lc2godGhpcy5faW5kZXgsIHRoaXMudkRhdGEsIHRoaXMuaURhdGEpO1xuICAgIH1cblxuICAgIF9yZWFsbG9jSURhdGEgKGluZGljZXNDb3VudCwgb2xkRGF0YSkge1xuICAgICAgICB0aGlzLmlEYXRhID0gbmV3IFVpbnQxNkFycmF5KGluZGljZXNDb3VudCk7XG4gICAgICAgIFxuICAgICAgICBpZiAob2xkRGF0YSkge1xuICAgICAgICAgICAgdGhpcy5pRGF0YS5zZXQob2xkRGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9oYW5kbGVyLnVwZGF0ZU1lc2godGhpcy5faW5kZXgsIHRoaXMudkRhdGEsIHRoaXMuaURhdGEpO1xuICAgIH1cblxuICAgIHJlc2VydmUgKHZlcnRpY2VzQ291bnQsIGluZGljZXNDb3VudCkge1xuICAgICAgICBsZXQgZmxvYXRzQ291bnQgPSB2ZXJ0aWNlc0NvdW50ICogdGhpcy5fdmVydGljZXNCeXRlcyA+PiAyO1xuICAgICAgICBsZXQgbmV3RmxvYXRzQ291bnQgPSB0aGlzLnZEYXRhLmxlbmd0aDtcbiAgICAgICAgbGV0IHJlYWxsb2NlZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChmbG9hdHNDb3VudCA+IG5ld0Zsb2F0c0NvdW50KSB7XG4gICAgICAgICAgICB3aGlsZSAobmV3RmxvYXRzQ291bnQgPCBmbG9hdHNDb3VudCkge1xuICAgICAgICAgICAgICAgIG5ld0Zsb2F0c0NvdW50ICo9IDI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9yZWFsbG9jVkRhdGEobmV3RmxvYXRzQ291bnQsIHRoaXMudkRhdGEpO1xuICAgICAgICAgICAgcmVhbGxvY2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBuZXdJbmRpY2VzQ291bnQgPSB0aGlzLmlEYXRhLmxlbmd0aDtcbiAgICAgICAgaWYgKGluZGljZXNDb3VudCA+IG5ld0luZGljZXNDb3VudCkge1xuICAgICAgICAgICAgd2hpbGUgKG5ld0luZGljZXNDb3VudCA8IGluZGljZXNDb3VudCkge1xuICAgICAgICAgICAgICAgIG5ld0luZGljZXNDb3VudCAqPSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fcmVhbGxvY0lEYXRhKGluZGljZXNDb3VudCwgdGhpcy5pRGF0YSk7XG4gICAgICAgICAgICByZWFsbG9jZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlYWxsb2NlZDtcbiAgICB9XG5cbiAgICB1c2VkICh2ZXJ0aWNlc0NvdW50LCBpbmRpY2VzQ291bnQpIHtcbiAgICAgICAgdGhpcy51c2VkVmVydGljZXMgPSB2ZXJ0aWNlc0NvdW50O1xuICAgICAgICB0aGlzLnVzZWRJbmRpY2VzID0gaW5kaWNlc0NvdW50O1xuICAgICAgICB0aGlzLnVzZWRWZXJ0aWNlc0Zsb2F0cyA9IHZlcnRpY2VzQ291bnQgKiB0aGlzLl92ZXJ0aWNlc0J5dGVzID4+IDI7XG5cbiAgICAgICAgdGhpcy5faGFuZGxlci51cGRhdGVNZXNoUmFuZ2UodmVydGljZXNDb3VudCwgaW5kaWNlc0NvdW50KTtcbiAgICB9XG5cbiAgICByZXNldCAoKSB7XG4gICAgICAgIGxldCBmbG9hdHNDb3VudCA9IHRoaXMuX2luaXRWZXJ0aWNlc0NvdW50ICogdGhpcy5fdmVydGljZXNCeXRlcyA+PiAyO1xuICAgICAgICB0aGlzLl9yZWFsbG9jVkRhdGEoZmxvYXRzQ291bnQpO1xuICAgICAgICB0aGlzLl9yZWFsbG9jSURhdGEodGhpcy5faW5pdEluZGljZXNDb3VudCk7XG5cbiAgICAgICAgdGhpcy51c2VkVmVydGljZXMgPSAwO1xuICAgICAgICB0aGlzLnVzZWRWZXJ0aWNlc0Zsb2F0cyA9IDA7XG4gICAgICAgIHRoaXMudXNlZEluZGljZXMgPSAwO1xuICAgIH1cbn0gXG5cbmNjLkZsZXhCdWZmZXIgPSBGbGV4QnVmZmVyXG4iXSwic291cmNlUm9vdCI6Ii8ifQ==