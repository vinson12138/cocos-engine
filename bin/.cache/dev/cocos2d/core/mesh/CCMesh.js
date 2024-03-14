
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/mesh/CCMesh.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _inputAssembler = _interopRequireDefault(require("../../renderer/core/input-assembler"));

var _gfx = _interopRequireDefault(require("../../renderer/gfx"));

var _meshData = require("./mesh-data");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
var renderer = require('../renderer');

var EventTarget = require('../event/event-target');

function applyColor(data, offset, value) {
  data[offset] = value._val;
}

function applyVec2(data, offset, value) {
  data[offset] = value.x;
  data[offset + 1] = value.y;
}

function applyVec3(data, offset, value) {
  data[offset] = value.x;
  data[offset + 1] = value.y;
  data[offset + 2] = value.z;
}

var _compType2fn = {
  5120: 'getInt8',
  5121: 'getUint8',
  5122: 'getInt16',
  5123: 'getUint16',
  5124: 'getInt32',
  5125: 'getUint32',
  5126: 'getFloat32'
};
var _compType2write = {
  5120: 'setInt8',
  5121: 'setUint8',
  5122: 'setInt16',
  5123: 'setUint16',
  5124: 'setInt32',
  5125: 'setUint32',
  5126: 'setFloat32'
}; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView#Endianness

var littleEndian = function () {
  var buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(0, 256, true); // Int16Array uses the platform's endianness.

  return new Int16Array(buffer)[0] === 256;
}();
/**
* @module cc
*/

/**
 * !#en Mesh Asset.
 * !#zh 网格资源。
 * @class Mesh
 * @extends Asset
 * @uses EventTarget
 */


var Mesh = cc.Class({
  name: 'cc.Mesh',
  "extends": cc.Asset,
  mixins: [EventTarget],
  properties: {
    _nativeAsset: {
      override: true,
      get: function get() {
        return this._buffer;
      },
      set: function set(bin) {
        this._buffer = ArrayBuffer.isView(bin) ? bin.buffer : bin;
        this.initWithBuffer();
      }
    },
    _vertexBundles: {
      "default": null,
      type: _meshData.VertexBundle
    },
    _primitives: {
      "default": null,
      Primitive: _meshData.Primitive
    },
    _minPos: cc.v3(),
    _maxPos: cc.v3(),

    /**
     * !#en Get ir set the sub meshes.
     * !#zh 设置或者获取子网格。
     * @property {[InputAssembler]} subMeshes
     */
    subMeshes: {
      get: function get() {
        return this._subMeshes;
      },
      set: function set(v) {
        this._subMeshes = v;
      }
    },
    subDatas: {
      get: function get() {
        return this._subDatas;
      }
    }
  },
  ctor: function ctor() {
    this._subMeshes = [];
    this._subDatas = [];
    this.loaded = false;
  },
  initWithBuffer: function initWithBuffer() {
    this._subMeshes.length = 0;
    var primitives = this._primitives;

    for (var i = 0; i < primitives.length; i++) {
      var primitive = primitives[i]; // ib

      var ibrange = primitive.data;
      var ibData = new Uint8Array(this._buffer, ibrange.offset, ibrange.length); // vb

      var vertexBundle = this._vertexBundles[primitive.vertexBundleIndices[0]];
      var vbRange = vertexBundle.data;
      var gfxVFmt = new _gfx["default"].VertexFormat(vertexBundle.formats); // Mesh binary may have several data format, must use Uint8Array to store data.

      var vbData = new Uint8Array(this._buffer, vbRange.offset, vbRange.length);

      var canBatch = this._canVertexFormatBatch(gfxVFmt);

      var meshData = new _meshData.MeshData();
      meshData.vData = vbData;
      meshData.iData = ibData;
      meshData.vfm = gfxVFmt;
      meshData.offset = vbRange.offset;
      meshData.canBatch = canBatch;

      this._subDatas.push(meshData);

      if (CC_JSB && CC_NATIVERENDERER) {
        meshData.vDirty = true;

        this._subMeshes.push(new _inputAssembler["default"](null, null));
      } else {
        var vbBuffer = new _gfx["default"].VertexBuffer(renderer.device, gfxVFmt, _gfx["default"].USAGE_STATIC, vbData);
        var ibBuffer = new _gfx["default"].IndexBuffer(renderer.device, primitive.indexUnit, _gfx["default"].USAGE_STATIC, ibData); // create sub meshes

        this._subMeshes.push(new _inputAssembler["default"](vbBuffer, ibBuffer));
      }
    }

    this.loaded = true;
    this.emit('load');
  },
  _canVertexFormatBatch: function _canVertexFormatBatch(format) {
    var aPosition = format._attr2el[_gfx["default"].ATTR_POSITION];
    var canBatch = !aPosition || aPosition.type === _gfx["default"].ATTR_TYPE_FLOAT32 && format._bytes % 4 === 0;
    return canBatch;
  },

  /**
   * !#en
   * Init vertex buffer according to the vertex format.
   * !#zh
   * 根据顶点格式初始化顶点内存。
   * @method init
   * @param {gfx.VertexFormat} vertexFormat - vertex format
   * @param {Number} vertexCount - how much vertex should be create in this buffer.
   * @param {Boolean} [dynamic] - whether or not to use dynamic buffer.
   * @param {Boolean} [index]
   */
  init: function init(vertexFormat, vertexCount, dynamic, index) {
    if (dynamic === void 0) {
      dynamic = false;
    }

    if (index === void 0) {
      index = 0;
    }

    var data = new Uint8Array(vertexFormat._bytes * vertexCount);
    var meshData = new _meshData.MeshData();
    meshData.vData = data;
    meshData.vfm = vertexFormat;
    meshData.vDirty = true;
    meshData.canBatch = this._canVertexFormatBatch(vertexFormat);

    if (!(CC_JSB && CC_NATIVERENDERER)) {
      var vb = new _gfx["default"].VertexBuffer(renderer.device, vertexFormat, dynamic ? _gfx["default"].USAGE_DYNAMIC : _gfx["default"].USAGE_STATIC, data);
      meshData.vb = vb;
      this._subMeshes[index] = new _inputAssembler["default"](meshData.vb);
    }

    var oldSubData = this._subDatas[index];

    if (oldSubData) {
      if (oldSubData.vb) {
        oldSubData.vb.destroy();
      }

      if (oldSubData.ib) {
        oldSubData.ib.destroy();
      }
    }

    this._subDatas[index] = meshData;
    this.loaded = true;
    this.emit('load');
    this.emit('init-format');
  },

  /**
   * !#en
   * Set the vertex values.
   * !#zh 
   * 设置顶点数据
   * @method setVertices
   * @param {String} name - the attribute name, e.g. gfx.ATTR_POSITION
   * @param {[Vec2] | [Vec3] | [Color] | [Number] | Uint8Array | Float32Array} values - the vertex values
   */
  setVertices: function setVertices(name, values, index) {
    index = index || 0;
    var subData = this._subDatas[index];
    var el = subData.vfm.element(name);

    if (!el) {
      return cc.warn("Cannot find " + name + " attribute in vertex defines.");
    } // whether the values is expanded


    var isFlatMode = typeof values[0] === 'number';
    var elNum = el.num;
    var verticesCount = isFlatMode ? values.length / elNum | 0 : values.length;

    if (subData.vData.byteLength < verticesCount * el.stride) {
      subData.setVData(new Uint8Array(verticesCount * subData.vfm._bytes));
    }

    var data;
    var bytes = 4;

    if (name === _gfx["default"].ATTR_COLOR) {
      if (!isFlatMode) {
        data = subData.getVData(Uint32Array);
      } else {
        data = subData.getVData();
        bytes = 1;
      }
    } else {
      data = subData.getVData(Float32Array);
    }

    var stride = el.stride / bytes;
    var offset = el.offset / bytes;

    if (isFlatMode) {
      for (var i = 0, l = values.length / elNum; i < l; i++) {
        var sOffset = i * elNum;
        var dOffset = i * stride + offset;

        for (var j = 0; j < elNum; j++) {
          data[dOffset + j] = values[sOffset + j];
        }
      }
    } else {
      var applyFunc;

      if (name === _gfx["default"].ATTR_COLOR) {
        applyFunc = applyColor;
      } else {
        if (elNum === 2) {
          applyFunc = applyVec2;
        } else {
          applyFunc = applyVec3;
        }
      }

      for (var _i = 0, _l = values.length; _i < _l; _i++) {
        var v = values[_i];
        var vOffset = _i * stride + offset;
        applyFunc(data, vOffset, v);
      }
    }

    subData.vDirty = true;
  },

  /**
   * !#en
   * Set the sub mesh indices.
   * !#zh
   * 设置子网格索引。
   * @method setIndices
   * @param {[Number]|Uint16Array|Uint8Array} indices - the sub mesh indices.
   * @param {Number} [index] - sub mesh index.
   * @param {Boolean} [dynamic] - whether or not to use dynamic buffer.
   */
  setIndices: function setIndices(indices, index, dynamic) {
    index = index || 0;
    var iData = indices;

    if (indices instanceof Uint16Array) {
      iData = new Uint8Array(indices.buffer, indices.byteOffset, indices.byteLength);
    } else if (Array.isArray(indices)) {
      iData = new Uint16Array(indices);
      iData = new Uint8Array(iData.buffer, iData.byteOffset, iData.byteLength);
    }

    var usage = dynamic ? _gfx["default"].USAGE_DYNAMIC : _gfx["default"].USAGE_STATIC;
    var subData = this._subDatas[index];

    if (!subData.ib) {
      subData.iData = iData;

      if (!(CC_JSB && CC_NATIVERENDERER)) {
        var buffer = new _gfx["default"].IndexBuffer(renderer.device, _gfx["default"].INDEX_FMT_UINT16, usage, iData, iData.byteLength / _gfx["default"].IndexBuffer.BYTES_PER_INDEX[_gfx["default"].INDEX_FMT_UINT16]);
        subData.ib = buffer;
        this._subMeshes[index]._indexBuffer = subData.ib;
      }
    } else {
      subData.iData = iData;
      subData.iDirty = true;
    }
  },

  /**
   * !#en
   * Set the sub mesh primitive type.
   * !#zh
   * 设置子网格绘制线条的方式。
   * @method setPrimitiveType
   * @param {Number} type 
   * @param {Number} index 
   */
  setPrimitiveType: function setPrimitiveType(type, index) {
    index = index || 0;
    var subMesh = this._subMeshes[index];

    if (!subMesh) {
      cc.warn("Do not have sub mesh at index " + index);
      return;
    }

    this._subMeshes[index]._primitiveType = type;
  },

  /** 
   * !#en
   * Clear the buffer data.
   * !#zh
   * 清除网格创建的内存数据。
   * @method clear
  */
  clear: function clear() {
    this._subMeshes.length = 0;
    var subDatas = this._subDatas;

    for (var i = 0, len = subDatas.length; i < len; i++) {
      var vb = subDatas[i].vb;

      if (vb) {
        vb.destroy();
      }

      var ib = subDatas[i].ib;

      if (ib) {
        ib.destroy();
      }
    }

    subDatas.length = 0;
  },

  /**
   * !#en Set mesh bounding box
   * !#zh 设置网格的包围盒
   * @method setBoundingBox
   * @param {Vec3} min 
   * @param {Vec3} max 
   */
  setBoundingBox: function setBoundingBox(min, max) {
    this._minPos = min;
    this._maxPos = max;
  },
  destroy: function destroy() {
    this.clear();
  },
  _uploadData: function _uploadData() {
    var subDatas = this._subDatas;

    for (var i = 0, len = subDatas.length; i < len; i++) {
      var subData = subDatas[i];

      if (subData.vDirty) {
        var buffer = subData.vb,
            data = subData.vData;
        buffer.update(0, data);
        subData.vDirty = false;
      }

      if (subData.iDirty) {
        var _buffer = subData.ib,
            _data = subData.iData;

        _buffer.update(0, _data);

        subData.iDirty = false;
      }
    }
  },
  _getAttrMeshData: function _getAttrMeshData(subDataIndex, name) {
    var subData = this._subDatas[subDataIndex];
    if (!subData) return [];
    var format = subData.vfm;
    var fmt = format.element(name);
    if (!fmt) return [];

    if (!subData.attrDatas) {
      subData.attrDatas = {};
    }

    var attrDatas = subData.attrDatas;
    var data = attrDatas[name];

    if (data) {
      return data;
    } else {
      data = attrDatas[name] = [];
    }

    var vbData = subData.vData;
    var dv = new DataView(vbData.buffer, vbData.byteOffset, vbData.byteLength);
    var stride = fmt.stride;
    var eleOffset = fmt.offset;
    var eleNum = fmt.num;
    var eleByte = fmt.bytes / eleNum;
    var fn = _compType2fn[fmt.type];
    var vertexCount = vbData.byteLength / format._bytes;

    for (var i = 0; i < vertexCount; i++) {
      var offset = i * stride + eleOffset;

      for (var j = 0; j < eleNum; j++) {
        var v = dv[fn](offset + j * eleByte, littleEndian);
        data.push(v);
      }
    }

    return data;
  },

  /**
   * !#en Read the specified attributes of the subgrid into the target buffer.
   * !#zh 读取子网格的指定属性到目标缓冲区中。
   * @param {Number} primitiveIndex The subgrid index.
   * @param {String} attributeName attribute name.
   * @param {ArrayBuffer} buffer The target buffer.
   * @param {Number} stride The byte interval between adjacent attributes in the target buffer.
   * @param {Number} offset The offset of the first attribute in the target buffer.
   * @returns {Boolean} If the specified sub-grid does not exist, the sub-grid does not exist, or the specified attribute cannot be read, return `false`, otherwise return` true`.
   * @method copyAttribute
   */
  copyAttribute: function copyAttribute(primitiveIndex, attributeName, buffer, stride, offset) {
    var written = false;
    var subData = this._subDatas[primitiveIndex];
    if (!subData) return written;
    var format = subData.vfm;
    var fmt = format.element(attributeName);
    if (!fmt) return written;
    var writter = _compType2write[fmt.type];
    if (!writter) return written;

    var data = this._getAttrMeshData(primitiveIndex, attributeName);

    var vertexCount = subData.vData.byteLength / format._bytes;
    var eleByte = fmt.bytes / fmt.num;

    if (data.length > 0) {
      var outputView = new DataView(buffer, offset);
      var outputStride = stride;
      var num = fmt.num;

      for (var i = 0; i < vertexCount; ++i) {
        var index = i * num;

        for (var j = 0; j < num; ++j) {
          var inputOffset = index + j;
          var outputOffset = outputStride * i + eleByte * j;
          outputView[writter](outputOffset, data[inputOffset], littleEndian);
        }
      }

      written = true;
    }

    return written;
  },

  /**
   * !#en Read the index data of the subgrid into the target array.
   * !#zh 读取子网格的索引数据到目标数组中。
   * @param {Number} primitiveIndex The subgrid index.
   * @param {TypedArray} outputArray The target array.
   * @returns {Boolean} returns `false` if the specified sub-grid does not exist or the sub-grid does not have index data, otherwise returns` true`.
   * @method copyIndices
   */
  copyIndices: function copyIndices(primitiveIndex, outputArray) {
    var subData = this._subDatas[primitiveIndex];
    if (!subData) return false;
    var iData = subData.iData;
    var indexCount = iData.length / 2;
    var dv = new DataView(iData.buffer, iData.byteOffset, iData.byteLength);
    var fn = _compType2fn[_gfx["default"].INDEX_FMT_UINT8];

    for (var i = 0; i < indexCount; ++i) {
      outputArray[i] = dv[fn](i * 2);
    }

    return true;
  }
});
cc.Mesh = module.exports = Mesh;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL21lc2gvQ0NNZXNoLmpzIl0sIm5hbWVzIjpbInJlbmRlcmVyIiwicmVxdWlyZSIsIkV2ZW50VGFyZ2V0IiwiYXBwbHlDb2xvciIsImRhdGEiLCJvZmZzZXQiLCJ2YWx1ZSIsIl92YWwiLCJhcHBseVZlYzIiLCJ4IiwieSIsImFwcGx5VmVjMyIsInoiLCJfY29tcFR5cGUyZm4iLCJfY29tcFR5cGUyd3JpdGUiLCJsaXR0bGVFbmRpYW4iLCJidWZmZXIiLCJBcnJheUJ1ZmZlciIsIkRhdGFWaWV3Iiwic2V0SW50MTYiLCJJbnQxNkFycmF5IiwiTWVzaCIsImNjIiwiQ2xhc3MiLCJuYW1lIiwiQXNzZXQiLCJtaXhpbnMiLCJwcm9wZXJ0aWVzIiwiX25hdGl2ZUFzc2V0Iiwib3ZlcnJpZGUiLCJnZXQiLCJfYnVmZmVyIiwic2V0IiwiYmluIiwiaXNWaWV3IiwiaW5pdFdpdGhCdWZmZXIiLCJfdmVydGV4QnVuZGxlcyIsInR5cGUiLCJWZXJ0ZXhCdW5kbGUiLCJfcHJpbWl0aXZlcyIsIlByaW1pdGl2ZSIsIl9taW5Qb3MiLCJ2MyIsIl9tYXhQb3MiLCJzdWJNZXNoZXMiLCJfc3ViTWVzaGVzIiwidiIsInN1YkRhdGFzIiwiX3N1YkRhdGFzIiwiY3RvciIsImxvYWRlZCIsImxlbmd0aCIsInByaW1pdGl2ZXMiLCJpIiwicHJpbWl0aXZlIiwiaWJyYW5nZSIsImliRGF0YSIsIlVpbnQ4QXJyYXkiLCJ2ZXJ0ZXhCdW5kbGUiLCJ2ZXJ0ZXhCdW5kbGVJbmRpY2VzIiwidmJSYW5nZSIsImdmeFZGbXQiLCJnZngiLCJWZXJ0ZXhGb3JtYXQiLCJmb3JtYXRzIiwidmJEYXRhIiwiY2FuQmF0Y2giLCJfY2FuVmVydGV4Rm9ybWF0QmF0Y2giLCJtZXNoRGF0YSIsIk1lc2hEYXRhIiwidkRhdGEiLCJpRGF0YSIsInZmbSIsInB1c2giLCJDQ19KU0IiLCJDQ19OQVRJVkVSRU5ERVJFUiIsInZEaXJ0eSIsIklucHV0QXNzZW1ibGVyIiwidmJCdWZmZXIiLCJWZXJ0ZXhCdWZmZXIiLCJkZXZpY2UiLCJVU0FHRV9TVEFUSUMiLCJpYkJ1ZmZlciIsIkluZGV4QnVmZmVyIiwiaW5kZXhVbml0IiwiZW1pdCIsImZvcm1hdCIsImFQb3NpdGlvbiIsIl9hdHRyMmVsIiwiQVRUUl9QT1NJVElPTiIsIkFUVFJfVFlQRV9GTE9BVDMyIiwiX2J5dGVzIiwiaW5pdCIsInZlcnRleEZvcm1hdCIsInZlcnRleENvdW50IiwiZHluYW1pYyIsImluZGV4IiwidmIiLCJVU0FHRV9EWU5BTUlDIiwib2xkU3ViRGF0YSIsImRlc3Ryb3kiLCJpYiIsInNldFZlcnRpY2VzIiwidmFsdWVzIiwic3ViRGF0YSIsImVsIiwiZWxlbWVudCIsIndhcm4iLCJpc0ZsYXRNb2RlIiwiZWxOdW0iLCJudW0iLCJ2ZXJ0aWNlc0NvdW50IiwiYnl0ZUxlbmd0aCIsInN0cmlkZSIsInNldFZEYXRhIiwiYnl0ZXMiLCJBVFRSX0NPTE9SIiwiZ2V0VkRhdGEiLCJVaW50MzJBcnJheSIsIkZsb2F0MzJBcnJheSIsImwiLCJzT2Zmc2V0IiwiZE9mZnNldCIsImoiLCJhcHBseUZ1bmMiLCJ2T2Zmc2V0Iiwic2V0SW5kaWNlcyIsImluZGljZXMiLCJVaW50MTZBcnJheSIsImJ5dGVPZmZzZXQiLCJBcnJheSIsImlzQXJyYXkiLCJ1c2FnZSIsIklOREVYX0ZNVF9VSU5UMTYiLCJCWVRFU19QRVJfSU5ERVgiLCJfaW5kZXhCdWZmZXIiLCJpRGlydHkiLCJzZXRQcmltaXRpdmVUeXBlIiwic3ViTWVzaCIsIl9wcmltaXRpdmVUeXBlIiwiY2xlYXIiLCJsZW4iLCJzZXRCb3VuZGluZ0JveCIsIm1pbiIsIm1heCIsIl91cGxvYWREYXRhIiwidXBkYXRlIiwiX2dldEF0dHJNZXNoRGF0YSIsInN1YkRhdGFJbmRleCIsImZtdCIsImF0dHJEYXRhcyIsImR2IiwiZWxlT2Zmc2V0IiwiZWxlTnVtIiwiZWxlQnl0ZSIsImZuIiwiY29weUF0dHJpYnV0ZSIsInByaW1pdGl2ZUluZGV4IiwiYXR0cmlidXRlTmFtZSIsIndyaXR0ZW4iLCJ3cml0dGVyIiwib3V0cHV0VmlldyIsIm91dHB1dFN0cmlkZSIsImlucHV0T2Zmc2V0Iiwib3V0cHV0T2Zmc2V0IiwiY29weUluZGljZXMiLCJvdXRwdXRBcnJheSIsImluZGV4Q291bnQiLCJJTkRFWF9GTVRfVUlOVDgiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBNEJBOztBQUNBOztBQUNBOzs7O0FBOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLFFBQVEsR0FBR0MsT0FBTyxDQUFDLGFBQUQsQ0FBeEI7O0FBQ0EsSUFBTUMsV0FBVyxHQUFHRCxPQUFPLENBQUMsdUJBQUQsQ0FBM0I7O0FBTUEsU0FBU0UsVUFBVCxDQUFxQkMsSUFBckIsRUFBMkJDLE1BQTNCLEVBQW1DQyxLQUFuQyxFQUEwQztBQUN0Q0YsRUFBQUEsSUFBSSxDQUFDQyxNQUFELENBQUosR0FBZUMsS0FBSyxDQUFDQyxJQUFyQjtBQUNIOztBQUVELFNBQVNDLFNBQVQsQ0FBb0JKLElBQXBCLEVBQTBCQyxNQUExQixFQUFrQ0MsS0FBbEMsRUFBeUM7QUFDckNGLEVBQUFBLElBQUksQ0FBQ0MsTUFBRCxDQUFKLEdBQWVDLEtBQUssQ0FBQ0csQ0FBckI7QUFDQUwsRUFBQUEsSUFBSSxDQUFDQyxNQUFNLEdBQUcsQ0FBVixDQUFKLEdBQW1CQyxLQUFLLENBQUNJLENBQXpCO0FBQ0g7O0FBRUQsU0FBU0MsU0FBVCxDQUFvQlAsSUFBcEIsRUFBMEJDLE1BQTFCLEVBQWtDQyxLQUFsQyxFQUF5QztBQUNyQ0YsRUFBQUEsSUFBSSxDQUFDQyxNQUFELENBQUosR0FBZUMsS0FBSyxDQUFDRyxDQUFyQjtBQUNBTCxFQUFBQSxJQUFJLENBQUNDLE1BQU0sR0FBRyxDQUFWLENBQUosR0FBbUJD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RUFBRWxILENBQWxDLEVBQXFDO0FBQ2pDaUgsTUFBQUEsV0FBVyxDQUFDakgsQ0FBRCxDQUFYLEdBQWlCa0csRUFBRSxDQUFDSSxFQUFELENBQUYsQ0FBT3RHLENBQUMsR0FBRyxDQUFYLENBQWpCO0FBQ0g7O0FBRUQsV0FBTyxJQUFQO0FBQ0g7QUFwZWUsQ0FBVCxDQUFYO0FBdWVBL0IsRUFBRSxDQUFDRCxJQUFILEdBQVVvSixNQUFNLENBQUNDLE9BQVAsR0FBaUJySixJQUEzQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwOi8vd3d3LmNvY29zLmNvbVxuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3QgcmVuZGVyZXIgPSByZXF1aXJlKCcuLi9yZW5kZXJlcicpO1xuY29uc3QgRXZlbnRUYXJnZXQgPSByZXF1aXJlKCcuLi9ldmVudC9ldmVudC10YXJnZXQnKTtcblxuaW1wb3J0IElucHV0QXNzZW1ibGVyIGZyb20gJy4uLy4uL3JlbmRlcmVyL2NvcmUvaW5wdXQtYXNzZW1ibGVyJztcbmltcG9ydCBnZnggZnJvbSAnLi4vLi4vcmVuZGVyZXIvZ2Z4JztcbmltcG9ydCB7IFByaW1pdGl2ZSwgVmVydGV4QnVuZGxlLCBNZXNoRGF0YX0gZnJvbSAnLi9tZXNoLWRhdGEnO1xuXG5mdW5jdGlvbiBhcHBseUNvbG9yIChkYXRhLCBvZmZzZXQsIHZhbHVlKSB7XG4gICAgZGF0YVtvZmZzZXRdID0gdmFsdWUuX3ZhbDtcbn1cblxuZnVuY3Rpb24gYXBwbHlWZWMyIChkYXRhLCBvZmZzZXQsIHZhbHVlKSB7XG4gICAgZGF0YVtvZmZzZXRdID0gdmFsdWUueDtcbiAgICBkYXRhW29mZnNldCArIDFdID0gdmFsdWUueTtcbn1cblxuZnVuY3Rpb24gYXBwbHlWZWMzIChkYXRhLCBvZmZzZXQsIHZhbHVlKSB7XG4gICAgZGF0YVtvZmZzZXRdID0gdmFsdWUueDtcbiAgICBkYXRhW29mZnNldCArIDFdID0gdmFsdWUueTtcbiAgICBkYXRhW29mZnNldCArIDJdID0gdmFsdWUuejtcbn1cblxuY29uc3QgX2NvbXBUeXBlMmZuID0ge1xuICAgIDUxMjA6ICdnZXRJbnQ4JyxcbiAgICA1MTIxOiAnZ2V0VWludDgnLFxuICAgIDUxMjI6ICdnZXRJbnQxNicsXG4gICAgNTEyMzogJ2dldFVpbnQxNicsXG4gICAgNTEyNDogJ2dldEludDMyJyxcbiAgICA1MTI1OiAnZ2V0VWludDMyJyxcbiAgICA1MTI2OiAnZ2V0RmxvYXQzMicsXG59O1xuXG5jb25zdCBfY29tcFR5cGUyd3JpdGUgPSB7XG4gICAgNTEyMDogJ3NldEludDgnLFxuICAgIDUxMjE6ICdzZXRVaW50OCcsXG4gICAgNTEyMjogJ3NldEludDE2JyxcbiAgICA1MTIzOiAnc2V0VWludDE2JyxcbiAgICA1MTI0OiAnc2V0SW50MzInLFxuICAgIDUxMjU6ICdzZXRVaW50MzInLFxuICAgIDUxMjY6ICdzZXRGbG9hdDMyJyxcbn07XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0RhdGFWaWV3I0VuZGlhbm5lc3NcbmNvbnN0IGxpdHRsZUVuZGlhbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigyKTtcbiAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRJbnQxNigwLCAyNTYsIHRydWUpO1xuICAgIC8vIEludDE2QXJyYXkgdXNlcyB0aGUgcGxhdGZvcm0ncyBlbmRpYW5uZXNzLlxuICAgIHJldHVybiBuZXcgSW50MTZBcnJheShidWZmZXIpWzBdID09PSAyNTY7XG59KSgpO1xuXG4vKipcbiogQG1vZHVsZSBjY1xuKi9cbi8qKlxuICogISNlbiBNZXNoIEFzc2V0LlxuICogISN6aCDnvZHmoLzotYTmupDjgIJcbiAqIEBjbGFzcyBNZXNoXG4gKiBAZXh0ZW5kcyBBc3NldFxuICogQHVzZXMgRXZlbnRUYXJnZXRcbiAqL1xubGV0IE1lc2ggPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLk1lc2gnLFxuICAgIGV4dGVuZHM6IGNjLkFzc2V0LFxuICAgIG1peGluczogW0V2ZW50VGFyZ2V0XSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX25hdGl2ZUFzc2V0OiB7XG4gICAgICAgICAgICBvdmVycmlkZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2J1ZmZlcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKGJpbikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2J1ZmZlciA9IEFycmF5QnVmZmVyLmlzVmlldyhiaW4pID8gYmluLmJ1ZmZlciA6IGJpbjtcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRXaXRoQnVmZmVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3ZlcnRleEJ1bmRsZXM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBWZXJ0ZXhCdW5kbGVcbiAgICAgICAgfSxcbiAgICAgICAgX3ByaW1pdGl2ZXM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICBQcmltaXRpdmVcbiAgICAgICAgfSxcbiAgICAgICAgX21pblBvczogY2MudjMoKSxcbiAgICAgICAgX21heFBvczogY2MudjMoKSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBHZXQgaXIgc2V0IHRoZSBzdWIgbWVzaGVzLlxuICAgICAgICAgKiAhI3poIOiuvue9ruaIluiAheiOt+WPluWtkOe9keagvOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1tJbnB1dEFzc2VtYmxlcl19IHN1Yk1lc2hlc1xuICAgICAgICAgKi9cbiAgICAgICAgc3ViTWVzaGVzOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdWJNZXNoZXM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3ViTWVzaGVzID0gdjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBzdWJEYXRhcyA6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N1YkRhdGFzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGN0b3IgKCkge1xuICAgICAgICB0aGlzLl9zdWJNZXNoZXMgPSBbXTtcbiAgICAgICAgdGhpcy5fc3ViRGF0YXMgPSBbXTtcbiAgICAgICAgdGhpcy5sb2FkZWQgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgaW5pdFdpdGhCdWZmZXIgKCkge1xuICAgICAgICB0aGlzLl9zdWJNZXNoZXMubGVuZ3RoID0gMDtcblxuICAgICAgICBsZXQgcHJpbWl0aXZlcyA9IHRoaXMuX3ByaW1pdGl2ZXM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJpbWl0aXZlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHByaW1pdGl2ZSA9IHByaW1pdGl2ZXNbaV07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGliXG4gICAgICAgICAgICBsZXQgaWJyYW5nZSA9IHByaW1pdGl2ZS5kYXRhO1xuICAgICAgICAgICAgbGV0IGliRGF0YSA9IG5ldyBVaW50OEFycmF5KHRoaXMuX2J1ZmZlciwgaWJyYW5nZS5vZmZzZXQsIGlicmFuZ2UubGVuZ3RoKTtcblxuICAgICAgICAgICAgLy8gdmJcbiAgICAgICAgICAgIGxldCB2ZXJ0ZXhCdW5kbGUgPSB0aGlzLl92ZXJ0ZXhCdW5kbGVzW3ByaW1pdGl2ZS52ZXJ0ZXhCdW5kbGVJbmRpY2VzWzBdXTtcbiAgICAgICAgICAgIGxldCB2YlJhbmdlID0gdmVydGV4QnVuZGxlLmRhdGE7XG4gICAgICAgICAgICBsZXQgZ2Z4VkZtdCA9IG5ldyBnZnguVmVydGV4Rm9ybWF0KHZlcnRleEJ1bmRsZS5mb3JtYXRzKTtcbiAgICAgICAgICAgIC8vIE1lc2ggYmluYXJ5IG1heSBoYXZlIHNldmVyYWwgZGF0YSBmb3JtYXQsIG11c3QgdXNlIFVpbnQ4QXJyYXkgdG8gc3RvcmUgZGF0YS5cbiAgICAgICAgICAgIGxldCB2YkRhdGEgPSBuZXcgVWludDhBcnJheSh0aGlzLl9idWZmZXIsIHZiUmFuZ2Uub2Zmc2V0LCB2YlJhbmdlLmxlbmd0aCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxldCBjYW5CYXRjaCA9IHRoaXMuX2NhblZlcnRleEZvcm1hdEJhdGNoKGdmeFZGbXQpO1xuXG4gICAgICAgICAgICBsZXQgbWVzaERhdGEgPSBuZXcgTWVzaERhdGEoKTtcbiAgICAgICAgICAgIG1lc2hEYXRhLnZEYXRhID0gdmJEYXRhO1xuICAgICAgICAgICAgbWVzaERhdGEuaURhdGEgPSBpYkRhdGE7XG4gICAgICAgICAgICBtZXNoRGF0YS52Zm0gPSBnZnhWRm10O1xuICAgICAgICAgICAgbWVzaERhdGEub2Zmc2V0ID0gdmJSYW5nZS5vZmZzZXQ7XG4gICAgICAgICAgICBtZXNoRGF0YS5jYW5CYXRjaCA9IGNhbkJhdGNoO1xuICAgICAgICAgICAgdGhpcy5fc3ViRGF0YXMucHVzaChtZXNoRGF0YSk7XG5cbiAgICAgICAgICAgIGlmIChDQ19KU0IgJiYgQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICAgICAgICAgICAgICBtZXNoRGF0YS52RGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3N1Yk1lc2hlcy5wdXNoKG5ldyBJbnB1dEFzc2VtYmxlcihudWxsLCBudWxsKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCB2YkJ1ZmZlciA9IG5ldyBnZnguVmVydGV4QnVmZmVyKFxuICAgICAgICAgICAgICAgICAgICByZW5kZXJlci5kZXZpY2UsXG4gICAgICAgICAgICAgICAgICAgIGdmeFZGbXQsXG4gICAgICAgICAgICAgICAgICAgIGdmeC5VU0FHRV9TVEFUSUMsXG4gICAgICAgICAgICAgICAgICAgIHZiRGF0YVxuICAgICAgICAgICAgICAgICk7XG4gICAgXG4gICAgICAgICAgICAgICAgbGV0IGliQnVmZmVyID0gbmV3IGdmeC5JbmRleEJ1ZmZlcihcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXIuZGV2aWNlLFxuICAgICAgICAgICAgICAgICAgICBwcmltaXRpdmUuaW5kZXhVbml0LFxuICAgICAgICAgICAgICAgICAgICBnZnguVVNBR0VfU1RBVElDLFxuICAgICAgICAgICAgICAgICAgICBpYkRhdGFcbiAgICAgICAgICAgICAgICApO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBzdWIgbWVzaGVzXG4gICAgICAgICAgICAgICAgdGhpcy5fc3ViTWVzaGVzLnB1c2gobmV3IElucHV0QXNzZW1ibGVyKHZiQnVmZmVyLCBpYkJ1ZmZlcikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lbWl0KCdsb2FkJyk7XG4gICAgfSxcblxuICAgIF9jYW5WZXJ0ZXhGb3JtYXRCYXRjaCAoZm9ybWF0KSB7XG4gICAgICAgIGxldCBhUG9zaXRpb24gPSBmb3JtYXQuX2F0dHIyZWxbZ2Z4LkFUVFJfUE9TSVRJT05dO1xuICAgICAgICBsZXQgY2FuQmF0Y2ggPSAhYVBvc2l0aW9uIHx8IFxuICAgICAgICAgICAgKGFQb3NpdGlvbi50eXBlID09PSBnZnguQVRUUl9UWVBFX0ZMT0FUMzIgJiYgXG4gICAgICAgICAgICBmb3JtYXQuX2J5dGVzICUgNCA9PT0gMCk7XG4gICAgICAgIHJldHVybiBjYW5CYXRjaDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEluaXQgdmVydGV4IGJ1ZmZlciBhY2NvcmRpbmcgdG8gdGhlIHZlcnRleCBmb3JtYXQuXG4gICAgICogISN6aFxuICAgICAqIOagueaNrumhtueCueagvOW8j+WIneWni+WMlumhtueCueWGheWtmOOAglxuICAgICAqIEBtZXRob2QgaW5pdFxuICAgICAqIEBwYXJhbSB7Z2Z4LlZlcnRleEZvcm1hdH0gdmVydGV4Rm9ybWF0IC0gdmVydGV4IGZvcm1hdFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB2ZXJ0ZXhDb3VudCAtIGhvdyBtdWNoIHZlcnRleCBzaG91bGQgYmUgY3JlYXRlIGluIHRoaXMgYnVmZmVyLlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2R5bmFtaWNdIC0gd2hldGhlciBvciBub3QgdG8gdXNlIGR5bmFtaWMgYnVmZmVyLlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2luZGV4XVxuICAgICAqL1xuICAgIGluaXQgKHZlcnRleEZvcm1hdCwgdmVydGV4Q291bnQsIGR5bmFtaWMgPSBmYWxzZSwgaW5kZXggPSAwKSB7XG4gICAgICAgIGxldCBkYXRhID0gbmV3IFVpbnQ4QXJyYXkodmVydGV4Rm9ybWF0Ll9ieXRlcyAqIHZlcnRleENvdW50KTtcbiAgICAgICAgbGV0IG1lc2hEYXRhID0gbmV3IE1lc2hEYXRhKCk7XG4gICAgICAgIG1lc2hEYXRhLnZEYXRhID0gZGF0YTtcbiAgICAgICAgbWVzaERhdGEudmZtID0gdmVydGV4Rm9ybWF0O1xuICAgICAgICBtZXNoRGF0YS52RGlydHkgPSB0cnVlO1xuICAgICAgICBtZXNoRGF0YS5jYW5CYXRjaCA9IHRoaXMuX2NhblZlcnRleEZvcm1hdEJhdGNoKHZlcnRleEZvcm1hdCk7XG5cbiAgICAgICAgaWYgKCEoQ0NfSlNCICYmIENDX05BVElWRVJFTkRFUkVSKSkge1xuICAgICAgICAgICAgbGV0IHZiID0gbmV3IGdmeC5WZXJ0ZXhCdWZmZXIoXG4gICAgICAgICAgICAgICAgcmVuZGVyZXIuZGV2aWNlLFxuICAgICAgICAgICAgICAgIHZlcnRleEZvcm1hdCxcbiAgICAgICAgICAgICAgICBkeW5hbWljID8gZ2Z4LlVTQUdFX0RZTkFNSUMgOiBnZnguVVNBR0VfU1RBVElDLFxuICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBtZXNoRGF0YS52YiA9IHZiOyBcbiAgICAgICAgICAgIHRoaXMuX3N1Yk1lc2hlc1tpbmRleF0gPSBuZXcgSW5wdXRBc3NlbWJsZXIobWVzaERhdGEudmIpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG9sZFN1YkRhdGEgPSB0aGlzLl9zdWJEYXRhc1tpbmRleF07XG4gICAgICAgIGlmIChvbGRTdWJEYXRhKSB7XG4gICAgICAgICAgICBpZiAob2xkU3ViRGF0YS52Yikge1xuICAgICAgICAgICAgICAgIG9sZFN1YkRhdGEudmIuZGVzdHJveSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9sZFN1YkRhdGEuaWIpIHtcbiAgICAgICAgICAgICAgICBvbGRTdWJEYXRhLmliLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3N1YkRhdGFzW2luZGV4XSA9IG1lc2hEYXRhO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmVtaXQoJ2xvYWQnKTtcbiAgICAgICAgdGhpcy5lbWl0KCdpbml0LWZvcm1hdCcpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0IHRoZSB2ZXJ0ZXggdmFsdWVzLlxuICAgICAqICEjemggXG4gICAgICog6K6+572u6aG254K55pWw5o2uXG4gICAgICogQG1ldGhvZCBzZXRWZXJ0aWNlc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gdGhlIGF0dHJpYnV0ZSBuYW1lLCBlLmcuIGdmeC5BVFRSX1BPU0lUSU9OXG4gICAgICogQHBhcmFtIHtbVmVjMl0gfCBbVmVjM10gfCBbQ29sb3JdIHwgW051bWJlcl0gfCBVaW50OEFycmF5IHwgRmxvYXQzMkFycmF5fSB2YWx1ZXMgLSB0aGUgdmVydGV4IHZhbHVlc1xuICAgICAqL1xuICAgIHNldFZlcnRpY2VzIChuYW1lLCB2YWx1ZXMsIGluZGV4KSB7XG4gICAgICAgIGluZGV4ID0gaW5kZXggfHwgMDtcbiAgICAgICAgbGV0IHN1YkRhdGEgPSB0aGlzLl9zdWJEYXRhc1tpbmRleF07XG5cbiAgICAgICAgbGV0IGVsID0gc3ViRGF0YS52Zm0uZWxlbWVudChuYW1lKTtcbiAgICAgICAgaWYgKCFlbCkge1xuICAgICAgICAgICAgcmV0dXJuIGNjLndhcm4oYENhbm5vdCBmaW5kICR7bmFtZX0gYXR0cmlidXRlIGluIHZlcnRleCBkZWZpbmVzLmApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2hldGhlciB0aGUgdmFsdWVzIGlzIGV4cGFuZGVkXG4gICAgICAgIGxldCBpc0ZsYXRNb2RlID0gdHlwZW9mIHZhbHVlc1swXSA9PT0gJ251bWJlcic7XG5cbiAgICAgICAgbGV0IGVsTnVtID0gZWwubnVtO1xuICAgICAgICBsZXQgdmVydGljZXNDb3VudCA9IGlzRmxhdE1vZGUgPyAoKHZhbHVlcy5sZW5ndGggLyBlbE51bSkgfCAwKSA6IHZhbHVlcy5sZW5ndGg7XG4gICAgICAgIGlmIChzdWJEYXRhLnZEYXRhLmJ5dGVMZW5ndGggPCB2ZXJ0aWNlc0NvdW50ICogZWwuc3RyaWRlKSB7XG4gICAgICAgICAgICBzdWJEYXRhLnNldFZEYXRhKG5ldyBVaW50OEFycmF5KHZlcnRpY2VzQ291bnQgKiBzdWJEYXRhLnZmbS5fYnl0ZXMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkYXRhO1xuICAgICAgICBsZXQgYnl0ZXMgPSA0O1xuICAgICAgICBpZiAobmFtZSA9PT0gZ2Z4LkFUVFJfQ09MT1IpIHtcbiAgICAgICAgICAgIGlmICghaXNGbGF0TW9kZSkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBzdWJEYXRhLmdldFZEYXRhKFVpbnQzMkFycmF5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBzdWJEYXRhLmdldFZEYXRhKCk7XG4gICAgICAgICAgICAgICAgYnl0ZXMgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRhdGEgPSBzdWJEYXRhLmdldFZEYXRhKEZsb2F0MzJBcnJheSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc3RyaWRlID0gZWwuc3RyaWRlIC8gYnl0ZXM7XG4gICAgICAgIGxldCBvZmZzZXQgPSBlbC5vZmZzZXQgLyBieXRlcztcblxuICAgICAgICBpZiAoaXNGbGF0TW9kZSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSAodmFsdWVzLmxlbmd0aCAvIGVsTnVtKTsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBzT2Zmc2V0ID0gaSAqIGVsTnVtO1xuICAgICAgICAgICAgICAgIGxldCBkT2Zmc2V0ID0gaSAqIHN0cmlkZSArIG9mZnNldDtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGVsTnVtOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtkT2Zmc2V0ICsgal0gPSB2YWx1ZXNbc09mZnNldCArIGpdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBhcHBseUZ1bmM7XG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gZ2Z4LkFUVFJfQ09MT1IpIHtcbiAgICAgICAgICAgICAgICBhcHBseUZ1bmMgPSBhcHBseUNvbG9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsTnVtID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIGFwcGx5RnVuYyA9IGFwcGx5VmVjMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFwcGx5RnVuYyA9IGFwcGx5VmVjMztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdmFsdWVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCB2ID0gdmFsdWVzW2ldO1xuICAgICAgICAgICAgICAgIGxldCB2T2Zmc2V0ID0gaSAqIHN0cmlkZSArIG9mZnNldDtcbiAgICAgICAgICAgICAgICBhcHBseUZ1bmMoZGF0YSwgdk9mZnNldCwgdik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3ViRGF0YS52RGlydHkgPSB0cnVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0IHRoZSBzdWIgbWVzaCBpbmRpY2VzLlxuICAgICAqICEjemhcbiAgICAgKiDorr7nva7lrZDnvZHmoLzntKLlvJXjgIJcbiAgICAgKiBAbWV0aG9kIHNldEluZGljZXNcbiAgICAgKiBAcGFyYW0ge1tOdW1iZXJdfFVpbnQxNkFycmF5fFVpbnQ4QXJyYXl9IGluZGljZXMgLSB0aGUgc3ViIG1lc2ggaW5kaWNlcy5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW2luZGV4XSAtIHN1YiBtZXNoIGluZGV4LlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2R5bmFtaWNdIC0gd2hldGhlciBvciBub3QgdG8gdXNlIGR5bmFtaWMgYnVmZmVyLlxuICAgICAqL1xuICAgIHNldEluZGljZXMgKGluZGljZXMsIGluZGV4LCBkeW5hbWljKSB7XG4gICAgICAgIGluZGV4ID0gaW5kZXggfHwgMDtcblxuICAgICAgICBsZXQgaURhdGEgPSBpbmRpY2VzO1xuICAgICAgICBpZiAoaW5kaWNlcyBpbnN0YW5jZW9mIFVpbnQxNkFycmF5KSB7XG4gICAgICAgICAgICBpRGF0YSA9IG5ldyBVaW50OEFycmF5KGluZGljZXMuYnVmZmVyLCBpbmRpY2VzLmJ5dGVPZmZzZXQsIGluZGljZXMuYnl0ZUxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShpbmRpY2VzKSkge1xuICAgICAgICAgICAgaURhdGEgPSBuZXcgVWludDE2QXJyYXkoaW5kaWNlcyk7XG4gICAgICAgICAgICBpRGF0YSA9IG5ldyBVaW50OEFycmF5KGlEYXRhLmJ1ZmZlciwgaURhdGEuYnl0ZU9mZnNldCwgaURhdGEuYnl0ZUxlbmd0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdXNhZ2UgPSBkeW5hbWljID8gZ2Z4LlVTQUdFX0RZTkFNSUMgOiBnZnguVVNBR0VfU1RBVElDO1xuXG4gICAgICAgIGxldCBzdWJEYXRhID0gdGhpcy5fc3ViRGF0YXNbaW5kZXhdO1xuICAgICAgICBpZiAoIXN1YkRhdGEuaWIpIHtcbiAgICAgICAgICAgIHN1YkRhdGEuaURhdGEgPSBpRGF0YTtcbiAgICAgICAgICAgIGlmICghKENDX0pTQiAmJiBDQ19OQVRJVkVSRU5ERVJFUikpIHtcbiAgICAgICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IGdmeC5JbmRleEJ1ZmZlcihcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXIuZGV2aWNlLFxuICAgICAgICAgICAgICAgICAgICBnZnguSU5ERVhfRk1UX1VJTlQxNixcbiAgICAgICAgICAgICAgICAgICAgdXNhZ2UsXG4gICAgICAgICAgICAgICAgICAgIGlEYXRhLFxuICAgICAgICAgICAgICAgICAgICBpRGF0YS5ieXRlTGVuZ3RoIC8gZ2Z4LkluZGV4QnVmZmVyLkJZVEVTX1BFUl9JTkRFWFtnZnguSU5ERVhfRk1UX1VJTlQxNl1cbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgc3ViRGF0YS5pYiA9IGJ1ZmZlcjtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdWJNZXNoZXNbaW5kZXhdLl9pbmRleEJ1ZmZlciA9IHN1YkRhdGEuaWI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzdWJEYXRhLmlEYXRhID0gaURhdGE7XG4gICAgICAgICAgICBzdWJEYXRhLmlEaXJ0eSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldCB0aGUgc3ViIG1lc2ggcHJpbWl0aXZlIHR5cGUuXG4gICAgICogISN6aFxuICAgICAqIOiuvue9ruWtkOe9keagvOe7mOWItue6v+adoeeahOaWueW8j+OAglxuICAgICAqIEBtZXRob2Qgc2V0UHJpbWl0aXZlVHlwZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0eXBlIFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBcbiAgICAgKi9cbiAgICBzZXRQcmltaXRpdmVUeXBlICh0eXBlLCBpbmRleCkge1xuICAgICAgICBpbmRleCA9IGluZGV4IHx8IDA7XG4gICAgICAgIGxldCBzdWJNZXNoID0gdGhpcy5fc3ViTWVzaGVzW2luZGV4XTtcbiAgICAgICAgaWYgKCFzdWJNZXNoKSB7XG4gICAgICAgICAgICBjYy53YXJuKGBEbyBub3QgaGF2ZSBzdWIgbWVzaCBhdCBpbmRleCAke2luZGV4fWApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N1Yk1lc2hlc1tpbmRleF0uX3ByaW1pdGl2ZVR5cGUgPSB0eXBlO1xuICAgIH0sXG5cbiAgICAvKiogXG4gICAgICogISNlblxuICAgICAqIENsZWFyIHRoZSBidWZmZXIgZGF0YS5cbiAgICAgKiAhI3poXG4gICAgICog5riF6Zmk572R5qC85Yib5bu655qE5YaF5a2Y5pWw5o2u44CCXG4gICAgICogQG1ldGhvZCBjbGVhclxuICAgICovXG4gICAgY2xlYXIgKCkge1xuICAgICAgICB0aGlzLl9zdWJNZXNoZXMubGVuZ3RoID0gMDtcblxuICAgICAgICBsZXQgc3ViRGF0YXMgPSB0aGlzLl9zdWJEYXRhcztcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHN1YkRhdGFzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgdmIgPSBzdWJEYXRhc1tpXS52YjtcbiAgICAgICAgICAgIGlmICh2Yikge1xuICAgICAgICAgICAgICAgIHZiLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IGliID0gc3ViRGF0YXNbaV0uaWI7XG4gICAgICAgICAgICBpZiAoaWIpIHtcbiAgICAgICAgICAgICAgICBpYi5kZXN0cm95KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3ViRGF0YXMubGVuZ3RoID0gMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgbWVzaCBib3VuZGluZyBib3hcbiAgICAgKiAhI3poIOiuvue9rue9keagvOeahOWMheWbtOebklxuICAgICAqIEBtZXRob2Qgc2V0Qm91bmRpbmdCb3hcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IG1pbiBcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IG1heCBcbiAgICAgKi9cbiAgICBzZXRCb3VuZGluZ0JveCAobWluLCBtYXgpIHtcbiAgICAgICAgdGhpcy5fbWluUG9zID0gbWluO1xuICAgICAgICB0aGlzLl9tYXhQb3MgPSBtYXg7XG4gICAgfSxcblxuICAgIGRlc3Ryb3kgKCkge1xuICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgfSxcblxuICAgIF91cGxvYWREYXRhICgpIHtcbiAgICAgICAgbGV0IHN1YkRhdGFzID0gdGhpcy5fc3ViRGF0YXM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBzdWJEYXRhcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbGV0IHN1YkRhdGEgPSBzdWJEYXRhc1tpXTtcblxuICAgICAgICAgICAgaWYgKHN1YkRhdGEudkRpcnR5KSB7XG4gICAgICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IHN1YkRhdGEudmIsIGRhdGEgPSBzdWJEYXRhLnZEYXRhO1xuICAgICAgICAgICAgICAgIGJ1ZmZlci51cGRhdGUoMCwgZGF0YSk7XG4gICAgICAgICAgICAgICAgc3ViRGF0YS52RGlydHkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN1YkRhdGEuaURpcnR5KSB7XG4gICAgICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IHN1YkRhdGEuaWIsIGRhdGEgPSBzdWJEYXRhLmlEYXRhO1xuICAgICAgICAgICAgICAgIGJ1ZmZlci51cGRhdGUoMCwgZGF0YSk7XG4gICAgICAgICAgICAgICAgc3ViRGF0YS5pRGlydHkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZ2V0QXR0ck1lc2hEYXRhIChzdWJEYXRhSW5kZXgsIG5hbWUpIHtcbiAgICAgICAgbGV0IHN1YkRhdGEgPSB0aGlzLl9zdWJEYXRhc1tzdWJEYXRhSW5kZXhdO1xuICAgICAgICBpZiAoIXN1YkRhdGEpIHJldHVybiBbXTtcblxuICAgICAgICBsZXQgZm9ybWF0ID0gc3ViRGF0YS52Zm07XG4gICAgICAgIGxldCBmbXQgPSBmb3JtYXQuZWxlbWVudChuYW1lKTtcbiAgICAgICAgaWYgKCFmbXQpIHJldHVybiBbXTtcblxuICAgICAgICBpZiAoIXN1YkRhdGEuYXR0ckRhdGFzKSB7XG4gICAgICAgICAgICBzdWJEYXRhLmF0dHJEYXRhcyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGxldCBhdHRyRGF0YXMgPSBzdWJEYXRhLmF0dHJEYXRhcztcbiAgICAgICAgbGV0IGRhdGEgPSBhdHRyRGF0YXNbbmFtZV07XG4gICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRhdGEgPSBhdHRyRGF0YXNbbmFtZV0gPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB2YkRhdGEgPSBzdWJEYXRhLnZEYXRhO1xuICAgICAgICBsZXQgZHYgPSBuZXcgRGF0YVZpZXcodmJEYXRhLmJ1ZmZlciwgdmJEYXRhLmJ5dGVPZmZzZXQsIHZiRGF0YS5ieXRlTGVuZ3RoKTtcblxuICAgICAgICBsZXQgc3RyaWRlID0gZm10LnN0cmlkZTtcbiAgICAgICAgbGV0IGVsZU9mZnNldCA9IGZtdC5vZmZzZXQ7XG4gICAgICAgIGxldCBlbGVOdW0gPSBmbXQubnVtO1xuICAgICAgICBsZXQgZWxlQnl0ZSA9IGZtdC5ieXRlcyAvIGVsZU51bTtcbiAgICAgICAgbGV0IGZuID0gX2NvbXBUeXBlMmZuW2ZtdC50eXBlXTtcbiAgICAgICAgbGV0IHZlcnRleENvdW50ID0gdmJEYXRhLmJ5dGVMZW5ndGggLyBmb3JtYXQuX2J5dGVzO1xuICAgICAgICBcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0ZXhDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0ID0gaSAqIHN0cmlkZSArIGVsZU9mZnNldDtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZWxlTnVtOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgdiA9IGR2W2ZuXShvZmZzZXQgKyBqICogZWxlQnl0ZSwgbGl0dGxlRW5kaWFuKTtcbiAgICAgICAgICAgICAgICBkYXRhLnB1c2godik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZWFkIHRoZSBzcGVjaWZpZWQgYXR0cmlidXRlcyBvZiB0aGUgc3ViZ3JpZCBpbnRvIHRoZSB0YXJnZXQgYnVmZmVyLlxuICAgICAqICEjemgg6K+75Y+W5a2Q572R5qC855qE5oyH5a6a5bGe5oCn5Yiw55uu5qCH57yT5Yay5Yy65Lit44CCXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHByaW1pdGl2ZUluZGV4IFRoZSBzdWJncmlkIGluZGV4LlxuwqDCoMKgwqDCoCogQHBhcmFtIHtTdHJpbmd9IGF0dHJpYnV0ZU5hbWUgYXR0cmlidXRlIG5hbWUuXG7CoMKgwqDCoMKgKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBidWZmZXIgVGhlIHRhcmdldCBidWZmZXIuXG7CoMKgwqDCoMKgKiBAcGFyYW0ge051bWJlcn0gc3RyaWRlIFRoZSBieXRlIGludGVydmFsIGJldHdlZW4gYWRqYWNlbnQgYXR0cmlidXRlcyBpbiB0aGUgdGFyZ2V0IGJ1ZmZlci5cbsKgwqDCoMKgwqAqIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXQgVGhlIG9mZnNldCBvZiB0aGUgZmlyc3QgYXR0cmlidXRlIGluIHRoZSB0YXJnZXQgYnVmZmVyLlxuwqDCoMKgwqDCoCogQHJldHVybnMge0Jvb2xlYW59IElmIHRoZSBzcGVjaWZpZWQgc3ViLWdyaWQgZG9lcyBub3QgZXhpc3QsIHRoZSBzdWItZ3JpZCBkb2VzIG5vdCBleGlzdCwgb3IgdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGUgY2Fubm90IGJlIHJlYWQsIHJldHVybiBgZmFsc2VgLCBvdGhlcndpc2UgcmV0dXJuYCB0cnVlYC5cbiAgICAgKiBAbWV0aG9kIGNvcHlBdHRyaWJ1dGVcbiAgICAgKi9cbiAgICBjb3B5QXR0cmlidXRlIChwcmltaXRpdmVJbmRleCwgYXR0cmlidXRlTmFtZSwgYnVmZmVyLCBzdHJpZGUsIG9mZnNldCkge1xuICAgICAgICBsZXQgd3JpdHRlbiA9IGZhbHNlO1xuICAgICAgICBsZXQgc3ViRGF0YSA9IHRoaXMuX3N1YkRhdGFzW3ByaW1pdGl2ZUluZGV4XTtcblxuICAgICAgICBpZiAoIXN1YkRhdGEpIHJldHVybiB3cml0dGVuO1xuXG4gICAgICAgIGxldCBmb3JtYXQgPSBzdWJEYXRhLnZmbTtcbiAgICAgICAgbGV0IGZtdCA9IGZvcm1hdC5lbGVtZW50KGF0dHJpYnV0ZU5hbWUpO1xuXG4gICAgICAgIGlmICghZm10KSByZXR1cm4gd3JpdHRlbjtcblxuICAgICAgICBsZXQgd3JpdHRlciA9IF9jb21wVHlwZTJ3cml0ZVtmbXQudHlwZV07XG5cbiAgICAgICAgaWYgKCF3cml0dGVyKSByZXR1cm4gd3JpdHRlbjtcblxuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuX2dldEF0dHJNZXNoRGF0YShwcmltaXRpdmVJbmRleCwgYXR0cmlidXRlTmFtZSk7XG4gICAgICAgIGxldCB2ZXJ0ZXhDb3VudCA9IHN1YkRhdGEudkRhdGEuYnl0ZUxlbmd0aCAvIGZvcm1hdC5fYnl0ZXM7XG4gICAgICAgIGxldCBlbGVCeXRlID0gZm10LmJ5dGVzIC8gZm10Lm51bTtcblxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBvdXRwdXRWaWV3ID0gbmV3IERhdGFWaWV3KGJ1ZmZlciwgb2Zmc2V0KTtcbiAgICAgICAgXG4gICAgICAgICAgICBsZXQgb3V0cHV0U3RyaWRlID0gc3RyaWRlO1xuICAgICAgICAgICAgbGV0IG51bSA9IGZtdC5udW07XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVydGV4Q291bnQ7ICsraSkge1xuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IGkgKiBudW07XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBudW07ICsraikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnB1dE9mZnNldCA9IGluZGV4ICsgajtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3V0cHV0T2Zmc2V0ID0gb3V0cHV0U3RyaWRlICogaSArIGVsZUJ5dGUgKiBqO1xuXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dFZpZXdbd3JpdHRlcl0ob3V0cHV0T2Zmc2V0LCBkYXRhW2lucHV0T2Zmc2V0XSwgbGl0dGxlRW5kaWFuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdyaXR0ZW4gPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHdyaXR0ZW47XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmVhZCB0aGUgaW5kZXggZGF0YSBvZiB0aGUgc3ViZ3JpZCBpbnRvIHRoZSB0YXJnZXQgYXJyYXkuXG4gICAgICogISN6aCDor7vlj5blrZDnvZHmoLznmoTntKLlvJXmlbDmja7liLDnm67moIfmlbDnu4TkuK3jgIJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcHJpbWl0aXZlSW5kZXggVGhlIHN1YmdyaWQgaW5kZXguXG7CoMKgwqDCoMKgKiBAcGFyYW0ge1R5cGVkQXJyYXl9IG91dHB1dEFycmF5IFRoZSB0YXJnZXQgYXJyYXkuXG7CoMKgwqDCoMKgKiBAcmV0dXJucyB7Qm9vbGVhbn0gcmV0dXJucyBgZmFsc2VgIGlmIHRoZSBzcGVjaWZpZWQgc3ViLWdyaWQgZG9lcyBub3QgZXhpc3Qgb3IgdGhlIHN1Yi1ncmlkIGRvZXMgbm90IGhhdmUgaW5kZXggZGF0YSwgb3RoZXJ3aXNlIHJldHVybnNgIHRydWVgLlxuICAgICAqIEBtZXRob2QgY29weUluZGljZXNcbiAgICAgKi9cbiAgICBjb3B5SW5kaWNlcyAocHJpbWl0aXZlSW5kZXgsIG91dHB1dEFycmF5KSB7XG4gICAgICAgIGxldCBzdWJEYXRhID0gdGhpcy5fc3ViRGF0YXNbcHJpbWl0aXZlSW5kZXhdO1xuXG4gICAgICAgIGlmICghc3ViRGF0YSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGlEYXRhID0gc3ViRGF0YS5pRGF0YTtcbiAgICAgICAgY29uc3QgaW5kZXhDb3VudCA9IGlEYXRhLmxlbmd0aCAvIDI7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBkdiA9IG5ldyBEYXRhVmlldyhpRGF0YS5idWZmZXIsIGlEYXRhLmJ5dGVPZmZzZXQsIGlEYXRhLmJ5dGVMZW5ndGgpO1xuICAgICAgICBjb25zdCBmbiA9IF9jb21wVHlwZTJmbltnZnguSU5ERVhfRk1UX1VJTlQ4XTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluZGV4Q291bnQ7ICsraSkge1xuICAgICAgICAgICAgb3V0cHV0QXJyYXlbaV0gPSBkdltmbl0oaSAqIDIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufSk7XG5cbmNjLk1lc2ggPSBtb2R1bGUuZXhwb3J0cyA9IE1lc2g7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==