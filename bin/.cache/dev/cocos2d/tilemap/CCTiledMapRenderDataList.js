
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/tilemap/CCTiledMapRenderDataList.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _inputAssembler = _interopRequireDefault(require("../renderer/core/input-assembler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
var TiledMapRenderDataList = cc.Class({
  name: 'cc.TiledMapRenderDataList',
  ctor: function ctor() {
    this._dataList = [];
    this._offset = 0;
  },
  _pushRenderData: function _pushRenderData() {
    var renderData = {};
    renderData.ia = new _inputAssembler["default"]();
    renderData.nodesRenderList = [];

    this._dataList.push(renderData);
  },
  popRenderData: function popRenderData(buffer) {
    if (this._offset >= this._dataList.length) {
      this._pushRenderData();
    }

    var renderData = this._dataList[this._offset];
    renderData.nodesRenderList.length = 0;
    var ia = renderData.ia;
    ia._vertexBuffer = buffer._vb;
    ia._indexBuffer = buffer._ib;
    ia._start = buffer.indiceOffset;
    ia._count = 0;
    this._offset++;
    return renderData;
  },
  pushNodesList: function pushNodesList(renderData, nodesList) {
    renderData.nodesRenderList.push(nodesList);
  },
  reset: function reset() {
    this._offset = 0;
  }
});
cc.TiledMapRenderDataList = module.exports = TiledMapRenderDataList;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC90aWxlbWFwL0NDVGlsZWRNYXBSZW5kZXJEYXRhTGlzdC5qcyJdLCJuYW1lcyI6WyJUaWxlZE1hcFJlbmRlckRhdGFMaXN0IiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJjdG9yIiwiX2RhdGFMaXN0IiwiX29mZnNldCIsIl9wdXNoUmVuZGVyRGF0YSIsInJlbmRlckRhdGEiLCJpYSIsIklucHV0QXNzZW1ibGVyIiwibm9kZXNSZW5kZXJMaXN0IiwicHVzaCIsInBvcFJlbmRlckRhdGEiLCJidWZmZXIiLCJsZW5ndGgiLCJfdmVydGV4QnVmZmVyIiwiX3ZiIiwiX2luZGV4QnVmZmVyIiwiX2liIiwiX3N0YXJ0IiwiaW5kaWNlT2Zmc2V0IiwiX2NvdW50IiwicHVzaE5vZGVzTGlzdCIsIm5vZGVzTGlzdCIsInJlc2V0IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQXdCQTs7OztBQXhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQSxJQUFJQSxzQkFBc0IsR0FBR0MsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDbENDLEVBQUFBLElBQUksRUFBRSwyQkFENEI7QUFHbENDLEVBQUFBLElBSGtDLGtCQUcxQjtBQUNKLFNBQUtDLFNBQUwsR0FBaUIsRUFBakI7QUFDQSxTQUFLQyxPQUFMLEdBQWUsQ0FBZjtBQUNILEdBTmlDO0FBUWxDQyxFQUFBQSxlQVJrQyw2QkFRZjtBQUNmLFFBQUlDLFVBQVUsR0FBRyxFQUFqQjtBQUNBQSxJQUFBQSxVQUFVLENBQUNDLEVBQVgsR0FBZ0IsSUFBSUMsMEJBQUosRUFBaEI7QUFDQUYsSUFBQUEsVUFBVSxDQUFDRyxlQUFYLEdBQTZCLEVBQTdCOztBQUNBLFNBQUtOLFNBQUwsQ0FBZU8sSUFBZixDQUFvQkosVUFBcEI7QUFDSCxHQWJpQztBQWVsQ0ssRUFBQUEsYUFma0MseUJBZW5CQyxNQWZtQixFQWVYO0FBQ25CLFFBQUksS0FBS1IsT0FBTCxJQUFnQixLQUFLRCxTQUFMLENBQWVVLE1BQW5DLEVBQTJDO0FBQ3ZDLFdBQUtSLGVBQUw7QUFDSDs7QUFDRCxRQUFJQyxVQUFVLEdBQUcsS0FBS0gsU0FBTCxDQUFlLEtBQUtDLE9BQXBCLENBQWpCO0FBQ0FFLElBQUFBLFVBQVUsQ0FBQ0csZUFBWCxDQUEyQkksTUFBM0IsR0FBb0MsQ0FBcEM7QUFDQSxRQUFJTixFQUFFLEdBQUdELFVBQVUsQ0FBQ0MsRUFBcEI7QUFDQUEsSUFBQUEsRUFBRSxDQUFDTyxhQUFILEdBQW1CRixNQUFNLENBQUNHLEdBQTFCO0FBQ0FSLElBQUFBLEVBQUUsQ0FBQ1MsWUFBSCxHQUFrQkosTUFBTSxDQUFDSyxHQUF6QjtBQUNBVixJQUFBQSxFQUFFLENBQUNXLE1BQUgsR0FBWU4sTUFBTSxDQUFDTyxZQUFuQjtBQUNBWixJQUFBQSxFQUFFLENBQUNhLE1BQUgsR0FBWSxDQUFaO0FBQ0EsU0FBS2hCLE9BQUw7QUFDQSxXQUFPRSxVQUFQO0FBQ0gsR0E1QmlDO0FBOEJsQ2UsRUFBQUEsYUE5QmtDLHlCQThCbkJmLFVBOUJtQixFQThCUGdCLFNBOUJPLEVBOEJJO0FBQ2xDaEIsSUFBQUEsVUFBVSxDQUFDRyxlQUFYLENBQTJCQyxJQUEzQixDQUFnQ1ksU0FBaEM7QUFDSCxHQWhDaUM7QUFrQ2xDQyxFQUFBQSxLQWxDa0MsbUJBa0N6QjtBQUNMLFNBQUtuQixPQUFMLEdBQWUsQ0FBZjtBQUNIO0FBcENpQyxDQUFULENBQTdCO0FBdUNBTCxFQUFFLENBQUNELHNCQUFILEdBQTRCMEIsTUFBTSxDQUFDQyxPQUFQLEdBQWlCM0Isc0JBQTdDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmltcG9ydCBJbnB1dEFzc2VtYmxlciBmcm9tICcuLi9yZW5kZXJlci9jb3JlL2lucHV0LWFzc2VtYmxlcic7XG5cbmxldCBUaWxlZE1hcFJlbmRlckRhdGFMaXN0ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5UaWxlZE1hcFJlbmRlckRhdGFMaXN0JyxcblxuICAgIGN0b3IgKCkge1xuICAgICAgICB0aGlzLl9kYXRhTGlzdCA9IFtdO1xuICAgICAgICB0aGlzLl9vZmZzZXQgPSAwO1xuICAgIH0sXG5cbiAgICBfcHVzaFJlbmRlckRhdGEgKCkge1xuICAgICAgICBsZXQgcmVuZGVyRGF0YSA9IHt9O1xuICAgICAgICByZW5kZXJEYXRhLmlhID0gbmV3IElucHV0QXNzZW1ibGVyKCk7XG4gICAgICAgIHJlbmRlckRhdGEubm9kZXNSZW5kZXJMaXN0ID0gW107XG4gICAgICAgIHRoaXMuX2RhdGFMaXN0LnB1c2gocmVuZGVyRGF0YSk7XG4gICAgfSxcblxuICAgIHBvcFJlbmRlckRhdGEgKGJ1ZmZlcikge1xuICAgICAgICBpZiAodGhpcy5fb2Zmc2V0ID49IHRoaXMuX2RhdGFMaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5fcHVzaFJlbmRlckRhdGEoKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmVuZGVyRGF0YSA9IHRoaXMuX2RhdGFMaXN0W3RoaXMuX29mZnNldF07XG4gICAgICAgIHJlbmRlckRhdGEubm9kZXNSZW5kZXJMaXN0Lmxlbmd0aCA9IDA7XG4gICAgICAgIGxldCBpYSA9IHJlbmRlckRhdGEuaWE7XG4gICAgICAgIGlhLl92ZXJ0ZXhCdWZmZXIgPSBidWZmZXIuX3ZiO1xuICAgICAgICBpYS5faW5kZXhCdWZmZXIgPSBidWZmZXIuX2liO1xuICAgICAgICBpYS5fc3RhcnQgPSBidWZmZXIuaW5kaWNlT2Zmc2V0O1xuICAgICAgICBpYS5fY291bnQgPSAwO1xuICAgICAgICB0aGlzLl9vZmZzZXQrKztcbiAgICAgICAgcmV0dXJuIHJlbmRlckRhdGE7XG4gICAgfSxcblxuICAgIHB1c2hOb2Rlc0xpc3QgKHJlbmRlckRhdGEsIG5vZGVzTGlzdCkge1xuICAgICAgICByZW5kZXJEYXRhLm5vZGVzUmVuZGVyTGlzdC5wdXNoKG5vZGVzTGlzdCk7XG4gICAgfSxcblxuICAgIHJlc2V0ICgpIHtcbiAgICAgICAgdGhpcy5fb2Zmc2V0ID0gMDtcbiAgICB9XG59KTtcblxuY2MuVGlsZWRNYXBSZW5kZXJEYXRhTGlzdCA9IG1vZHVsZS5leHBvcnRzID0gVGlsZWRNYXBSZW5kZXJEYXRhTGlzdDsiXSwic291cmNlUm9vdCI6Ii8ifQ==