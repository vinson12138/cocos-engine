
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/skeleton/CCSkeletonAnimationClip.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _mat = _interopRequireDefault(require("../../value-types/mat4"));

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
var AnimationClip = require('../../../animation/animation-clip');

var JointMatrixCurve = require('./CCJointMatrixCurve');

function maxtrixToArray(matrix) {
  var data = new Float32Array(16);
  data.set(matrix.m);
  return data;
}
/**
* @module cc
*/

/**
 * !#en SkeletonAnimationClip Asset.
 * !#zh 骨骼动画剪辑。
 * @class SkeletonAnimationClip
 * @extends AnimationClip
 */


var SkeletonAnimationClip = cc.Class({
  name: 'cc.SkeletonAnimationClip',
  "extends": AnimationClip,
  properties: {
    _nativeAsset: {
      override: true,
      get: function get() {
        return this._buffer;
      },
      set: function set(bin) {
        var buffer = ArrayBuffer.isView(bin) ? bin.buffer : bin;
        this._buffer = new Float32Array(buffer || bin, 0, buffer.byteLength / 4);
      }
    },

    /**
     * Describe the data structure.
     * { path: { offset, frameCount, property } }
     */
    description: {
      "default": null,
      type: Object
    },

    /**
     * SkeletonAnimationClip's curveData is generated from binary buffer.
     * So should not serialize curveData.
     */
    curveData: {
      visible: false,
      override: true,
      get: function get() {
        return this._curveData || {};
      },
      set: function set() {}
    }
  },
  statics: {
    preventDeferredLoadDependents: true
  },
  _init: function _init() {
    if (this._curveData) {
      return this._curveData;
    }

    this._curveData = {};

    this._generateCommonCurve();

    if (this._model.precomputeJointMatrix) {
      this._generateJointMatrixCurve();
    }

    return this._curveData;
  },
  _generateCommonCurve: function _generateCommonCurve() {
    var buffer = this._buffer;
    var description = this.description;
    var offset = 0;

    function getValue() {
      return buffer[offset++];
    }

    if (!this._curveData.paths) {
      this._curveData.paths = {};
    }

    var paths = this._curveData.paths;

    for (var path in description) {
      var des = description[path];
      var curves = {};
      paths[path] = {
        props: curves
      };

      for (var property in des) {
        var frames = [];
        var frameCount = des[property].frameCount;
        offset = des[property].offset;

        for (var i = 0; i < frameCount; i++) {
          var frame = getValue();
          var value = void 0;

          if (property === 'position' || property === 'scale') {
            value = cc.v3(getValue(), getValue(), getValue());
          } else if (property === 'quat') {
            value = cc.quat(getValue(), getValue(), getValue(), getValue());
          }

          frames.push({
            frame: frame,
            value: value
          });
        }

        curves[property] = frames;
      }
    }
  },
  _generateJointMatrixCurve: function _generateJointMatrixCurve() {
    var rootNode = this._model.rootNode;
    var curveData = this._curveData;
    var paths = curveData.paths;
    var newCurveData = {
      ratios: [],
      jointMatrixMap: {}
    };
    var jointMatrixMap = newCurveData.jointMatrixMap; // walk through node tree to calculate node's joint matrix at time.

    function walk(node, time, pm) {
      var matrix;
      var EPSILON = 10e-5;
      var path = paths[node.path];

      if (node !== rootNode && path) {
        var props = path.props;

        for (var prop in props) {
          var frames = props[prop];

          for (var i = 0; i < frames.length; i++) {
            var end = frames[i];

            if (Math.abs(end.frame - time) < EPSILON) {
              node[prop].set(end.value);
              break;
            } else if (end.frame > time) {
              var start = frames[i - 1];
              var ratio = (time - start.frame) / (end.frame - start.frame);
              start.value.lerp(end.value, ratio, node[prop]);
              break;
            }
          }
        }

        matrix = cc.mat4();

        _mat["default"].fromRTS(matrix, node.quat, node.position, node.scale);

        if (pm) {
          _mat["default"].mul(matrix, pm, matrix);
        }

        if (!props._jointMatrix) {
          props._jointMatrix = [];
        }

        var bindWorldMatrix;

        if (node.uniqueBindPose) {
          bindWorldMatrix = cc.mat4();

          _mat["default"].mul(bindWorldMatrix, matrix, node.uniqueBindPose);
        }

        if (!jointMatrixMap[node.path]) {
          jointMatrixMap[node.path] = [];
        }

        if (bindWorldMatrix) {
          jointMatrixMap[node.path].push(maxtrixToArray(bindWorldMatrix));
        } else {
          jointMatrixMap[node.path].push(matrix);
        }
      }

      var children = node.children;

      for (var name in children) {
        var child = children[name];
        walk(child, time, matrix);
      }
    }

    var time = 0;
    var duration = this.duration;
    var step = 1 / this.sample;

    while (time < duration) {
      newCurveData.ratios.push(time / duration);
      walk(rootNode, time);
      time += step;
    }

    this._curveData = newCurveData;
  },
  _createJointMatrixCurve: function _createJointMatrixCurve(state, root) {
    var curve = new JointMatrixCurve();
    curve.ratios = this.curveData.ratios;
    curve.pairs = [];
    var jointMatrixMap = this.curveData.jointMatrixMap;

    for (var path in jointMatrixMap) {
      var target = cc.find(path, root);
      if (!target) continue;
      curve.pairs.push({
        target: target,
        values: jointMatrixMap[path]
      });
    }

    return [curve];
  },
  createCurves: function createCurves(state, root) {
    if (!this._model) {
      cc.warn("Skeleton Animation Clip [" + this.name + "] Can not find model");
      return [];
    }

    this._init();

    if (this._model.precomputeJointMatrix) {
      return this._createJointMatrixCurve(state, root);
    } else {
      return AnimationClip.prototype.createCurves.call(this, state, root);
    }
  }
});
cc.SkeletonAnimationClip = module.exports = SkeletonAnimationClip;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3NrZWxldG9uL0NDU2tlbGV0b25BbmltYXRpb25DbGlwLmpzIl0sIm5hbWVzIjpbIkFuaW1hdGlvbkNsaXAiLCJyZXF1aXJlIiwiSm9pbnRNYXRyaXhDdXJ2ZSIsIm1heHRyaXhUb0FycmF5IiwibWF0cml4IiwiZGF0YSIsIkZsb2F0MzJBcnJheSIsInNldCIsIm0iLCJTa2VsZXRvbkFuaW1hdGlvbkNsaXAiLCJjYyIsIkNsYXNzIiwibmFtZSIsInByb3BlcnRpZXMiLCJfbmF0aXZlQXNzZXQiLCJvdmVycmlkZSIsImdldCIsIl9idWZmZXIiLCJiaW4iLCJidWZmZXIiLCJBcnJheUJ1ZmZlciIsImlzVmlldyIsImJ5dGVMZW5ndGgiLCJkZXNjcmlwdGlvbiIsInR5cGUiLCJPYmplY3QiLCJjdXJ2ZURhdGEiLCJ2aXNpYmxlIiwiX2N1cnZlRGF0YSIsInN0YXRpY3MiLCJwcmV2ZW50RGVmZXJyZWRMb2FkRGVwZW5kZW50cyIsIl9pbml0IiwiX2dlbmVyYXRlQ29tbW9uQ3VydmUiLCJfbW9kZWwiLCJwcmVjb21wdXRlSm9pbnRNYXRyaXgiLCJfZ2VuZXJhdGVKb2ludE1hdHJpeEN1cnZlIiwib2Zmc2V0IiwiZ2V0VmFsdWUiLCJwYXRocyIsInBhdGgiLCJkZXMiLCJjdXJ2ZXMiLCJwcm9wcyIsInByb3BlcnR5IiwiZnJhbWVzIiwiZnJhbWVDb3VudCIsImkiLCJmcmFtZSIsInZhbHVlIiwidjMiLCJxdWF0IiwicHVzaCIsInJvb3ROb2RlIiwibmV3Q3VydmVEYXRhIiwicmF0aW9zIiwiam9pbnRNYXRyaXhNYXAiLCJ3YWxrIiwibm9kZSIsInRpbWUiLCJwbSIsIkVQU0lMT04iLCJwcm9wIiwibGVuZ3RoIiwiZW5kIiwiTWF0aCIsImFicyIsInN0YXJ0IiwicmF0aW8iLCJsZXJwIiwibWF0NCIsIk1hdDQiLCJmcm9tUlRTIiwicG9zaXRpb24iLCJzY2FsZSIsIm11bCIsIl9qb2ludE1hdHJpeCIsImJpbmRXb3JsZE1hdHJpeCIsInVuaXF1ZUJpbmRQb3NlIiwiY2hpbGRyZW4iLCJjaGlsZCIsImR1cmF0aW9uIiwic3RlcCIsInNhbXBsZSIsIl9jcmVhdGVKb2ludE1hdHJpeEN1cnZlIiwic3RhdGUiLCJyb290IiwiY3VydmUiLCJwYWlycyIsInRhcmdldCIsImZpbmQiLCJ2YWx1ZXMiLCJjcmVhdGVDdXJ2ZXMiLCJ3YXJuIiwicHJvdG90eXBlIiwiY2FsbCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUF5QkE7Ozs7QUF6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUEsSUFBTUEsYUFBYSxHQUFHQyxPQUFPLENBQUMsbUNBQUQsQ0FBN0I7O0FBQ0EsSUFBTUMsZ0JBQWdCLEdBQUdELE9BQU8sQ0FBQyxzQkFBRCxDQUFoQzs7QUFFQSxTQUFTRSxjQUFULENBQXlCQyxNQUF6QixFQUFpQztBQUM3QixNQUFJQyxJQUFJLEdBQUcsSUFBSUMsWUFBSixDQUFpQixFQUFqQixDQUFYO0FBQ0FELEVBQUFBLElBQUksQ0FBQ0UsR0FBTCxDQUFTSCxNQUFNLENBQUNJLENBQWhCO0FBQ0EsU0FBT0gsSUFBUDtBQUNIO0FBRUQ7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBSUkscUJBQXFCLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ2pDQyxFQUFBQSxJQUFJLEVBQUUsMEJBRDJCO0FBRWpDLGFBQVNaLGFBRndCO0FBSWpDYSxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsWUFBWSxFQUFFO0FBQ1ZDLE1BQUFBLFFBQVEsRUFBRSxJQURBO0FBRVZDLE1BQUFBLEdBRlUsaUJBRUg7QUFDSCxlQUFPLEtBQUtDLE9BQVo7QUFDSCxPQUpTO0FBS1ZWLE1BQUFBLEdB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LFFBQUksQ0FBQyxLQUFLcEQsTUFBVixFQUFrQjtBQUNkdkIsTUFBQUEsRUFBRSxDQUFDa0YsSUFBSCwrQkFBb0MsS0FBS2hGLElBQXpDO0FBQ0EsYUFBTyxFQUFQO0FBQ0g7O0FBRUQsU0FBS21CLEtBQUw7O0FBRUEsUUFBSSxLQUFLRSxNQUFMLENBQVlDLHFCQUFoQixFQUF1QztBQUNuQyxhQUFPLEtBQUtpRCx1QkFBTCxDQUE2QkMsS0FBN0IsRUFBb0NDLElBQXBDLENBQVA7QUFDSCxLQUZELE1BR0s7QUFDRCxhQUFPckYsYUFBYSxDQUFDNkYsU0FBZCxDQUF3QkYsWUFBeEIsQ0FBcUNHLElBQXJDLENBQTBDLElBQTFDLEVBQWdEVixLQUFoRCxFQUF1REMsSUFBdkQsQ0FBUDtBQUNIO0FBQ0o7QUF6TmdDLENBQVQsQ0FBNUI7QUE0TkEzRSxFQUFFLENBQUNELHFCQUFILEdBQTJCc0YsTUFBTSxDQUFDQyxPQUFQLEdBQWlCdkYscUJBQTVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHA6Ly93d3cuY29jb3MuY29tXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgTWF0NCBmcm9tICcuLi8uLi92YWx1ZS10eXBlcy9tYXQ0JztcblxuY29uc3QgQW5pbWF0aW9uQ2xpcCA9IHJlcXVpcmUoJy4uLy4uLy4uL2FuaW1hdGlvbi9hbmltYXRpb24tY2xpcCcpO1xuY29uc3QgSm9pbnRNYXRyaXhDdXJ2ZSA9IHJlcXVpcmUoJy4vQ0NKb2ludE1hdHJpeEN1cnZlJyk7XG5cbmZ1bmN0aW9uIG1heHRyaXhUb0FycmF5IChtYXRyaXgpIHtcbiAgICBsZXQgZGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpO1xuICAgIGRhdGEuc2V0KG1hdHJpeC5tKTtcbiAgICByZXR1cm4gZGF0YTtcbn1cblxuLyoqXG4qIEBtb2R1bGUgY2NcbiovXG4vKipcbiAqICEjZW4gU2tlbGV0b25BbmltYXRpb25DbGlwIEFzc2V0LlxuICogISN6aCDpqqjpqrzliqjnlLvliarovpHjgIJcbiAqIEBjbGFzcyBTa2VsZXRvbkFuaW1hdGlvbkNsaXBcbiAqIEBleHRlbmRzIEFuaW1hdGlvbkNsaXBcbiAqL1xubGV0IFNrZWxldG9uQW5pbWF0aW9uQ2xpcCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuU2tlbGV0b25BbmltYXRpb25DbGlwJyxcbiAgICBleHRlbmRzOiBBbmltYXRpb25DbGlwLFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBfbmF0aXZlQXNzZXQ6IHtcbiAgICAgICAgICAgIG92ZXJyaWRlOiB0cnVlLFxuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYnVmZmVyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAoYmluKSB7XG4gICAgICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IEFycmF5QnVmZmVyLmlzVmlldyhiaW4pID8gYmluLmJ1ZmZlciA6IGJpbjtcbiAgICAgICAgICAgICAgICB0aGlzLl9idWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KGJ1ZmZlciB8fCBiaW4sIDAsIGJ1ZmZlci5ieXRlTGVuZ3RoIC8gNCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlc2NyaWJlIHRoZSBkYXRhIHN0cnVjdHVyZS5cbiAgICAgICAgICogeyBwYXRoOiB7IG9mZnNldCwgZnJhbWVDb3VudCwgcHJvcGVydHkgfSB9XG4gICAgICAgICAqL1xuICAgICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IE9iamVjdCxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2tlbGV0b25BbmltYXRpb25DbGlwJ3MgY3VydmVEYXRhIGlzIGdlbmVyYXRlZCBmcm9tIGJpbmFyeSBidWZmZXIuXG4gICAgICAgICAqIFNvIHNob3VsZCBub3Qgc2VyaWFsaXplIGN1cnZlRGF0YS5cbiAgICAgICAgICovXG4gICAgICAgIGN1cnZlRGF0YToge1xuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICBvdmVycmlkZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnZlRGF0YSB8fCB7fTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKCkge31cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIHByZXZlbnREZWZlcnJlZExvYWREZXBlbmRlbnRzOiB0cnVlLFxuICAgIH0sXG5cbiAgICBfaW5pdCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJ2ZURhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jdXJ2ZURhdGE7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jdXJ2ZURhdGEgPSB7fTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuX2dlbmVyYXRlQ29tbW9uQ3VydmUoKTtcblxuICAgICAgICBpZiAodGhpcy5fbW9kZWwucHJlY29tcHV0ZUpvaW50TWF0cml4KSB7XG4gICAgICAgICAgICB0aGlzLl9nZW5lcmF0ZUpvaW50TWF0cml4Q3VydmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJ2ZURhdGE7XG4gICAgfSxcblxuICAgIF9nZW5lcmF0ZUNvbW1vbkN1cnZlICgpIHtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IHRoaXMuX2J1ZmZlcjtcbiAgICAgICAgbGV0IGRlc2NyaXB0aW9uID0gdGhpcy5kZXNjcmlwdGlvbjtcblxuICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICAgICAgZnVuY3Rpb24gZ2V0VmFsdWUgKCkge1xuICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlcltvZmZzZXQrK107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuX2N1cnZlRGF0YS5wYXRocykge1xuICAgICAgICAgICAgdGhpcy5fY3VydmVEYXRhLnBhdGhzID0ge307XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHBhdGhzID0gdGhpcy5fY3VydmVEYXRhLnBhdGhzO1xuXG4gICAgICAgIGZvciAobGV0IHBhdGggaW4gZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIGxldCBkZXMgPSBkZXNjcmlwdGlvbltwYXRoXTtcbiAgICAgICAgICAgIGxldCBjdXJ2ZXMgPSB7fTtcbiAgICAgICAgICAgIHBhdGhzW3BhdGhdID0geyBwcm9wczogY3VydmVzIH07XG5cbiAgICAgICAgICAgIGZvciAobGV0IHByb3BlcnR5IGluIGRlcykge1xuICAgICAgICAgICAgICAgIGxldCBmcmFtZXMgPSBbXTtcblxuICAgICAgICAgICAgICAgIGxldCBmcmFtZUNvdW50ID0gZGVzW3Byb3BlcnR5XS5mcmFtZUNvdW50O1xuICAgICAgICAgICAgICAgIG9mZnNldCA9IGRlc1twcm9wZXJ0eV0ub2Zmc2V0O1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmcmFtZSA9IGdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09PSAncG9zaXRpb24nIHx8IHByb3BlcnR5ID09PSAnc2NhbGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNjLnYzKGdldFZhbHVlKCksIGdldFZhbHVlKCksIGdldFZhbHVlKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHByb3BlcnR5ID09PSAncXVhdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY2MucXVhdChnZXRWYWx1ZSgpLCBnZXRWYWx1ZSgpLCBnZXRWYWx1ZSgpLCBnZXRWYWx1ZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmcmFtZXMucHVzaCh7IGZyYW1lLCB2YWx1ZSB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjdXJ2ZXNbcHJvcGVydHldID0gZnJhbWVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9nZW5lcmF0ZUpvaW50TWF0cml4Q3VydmUgKCkge1xuICAgICAgICBsZXQgcm9vdE5vZGUgPSB0aGlzLl9tb2RlbC5yb290Tm9kZTtcbiAgICAgICAgbGV0IGN1cnZlRGF0YSA9IHRoaXMuX2N1cnZlRGF0YTtcbiAgICAgICAgbGV0IHBhdGhzID0gY3VydmVEYXRhLnBhdGhzO1xuXG4gICAgICAgIGxldCBuZXdDdXJ2ZURhdGEgPSB7IHJhdGlvczogW10sIGpvaW50TWF0cml4TWFwOiB7fSB9O1xuICAgICAgICBsZXQgam9pbnRNYXRyaXhNYXAgPSBuZXdDdXJ2ZURhdGEuam9pbnRNYXRyaXhNYXA7XG5cbiAgICAgICAgLy8gd2FsayB0aHJvdWdoIG5vZGUgdHJlZSB0byBjYWxjdWxhdGUgbm9kZSdzIGpvaW50IG1hdHJpeCBhdCB0aW1lLlxuICAgICAgICBmdW5jdGlvbiB3YWxrIChub2RlLCB0aW1lLCBwbSkge1xuICAgICAgICAgICAgbGV0IG1hdHJpeDtcbiAgICAgICAgICAgIGxldCBFUFNJTE9OID0gMTBlLTU7XG5cbiAgICAgICAgICAgIGxldCBwYXRoID0gcGF0aHNbbm9kZS5wYXRoXTtcbiAgICAgICAgICAgIGlmIChub2RlICE9PSByb290Tm9kZSAmJiBwYXRoKSB7XG4gICAgICAgICAgICAgICAgbGV0IHByb3BzID0gcGF0aC5wcm9wcztcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBwcm9wIGluIHByb3BzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmcmFtZXMgPSBwcm9wc1twcm9wXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlbmQgPSBmcmFtZXNbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhlbmQuZnJhbWUgLSB0aW1lKSA8IEVQU0lMT04pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlW3Byb3BdLnNldChlbmQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZW5kLmZyYW1lID4gdGltZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdGFydCA9IGZyYW1lc1tpIC0gMV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJhdGlvID0gKHRpbWUgLSBzdGFydC5mcmFtZSkgLyAoZW5kLmZyYW1lIC0gc3RhcnQuZnJhbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0LnZhbHVlLmxlcnAoZW5kLnZhbHVlLCByYXRpbywgbm9kZVtwcm9wXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBtYXRyaXggPSBjYy5tYXQ0KCk7XG4gICAgICAgICAgICAgICAgTWF0NC5mcm9tUlRTKG1hdHJpeCwgbm9kZS5xdWF0LCBub2RlLnBvc2l0aW9uLCBub2RlLnNjYWxlKTtcblxuICAgICAgICAgICAgICAgIGlmIChwbSkge1xuICAgICAgICAgICAgICAgICAgICBNYXQ0Lm11bChtYXRyaXgsIHBtLCBtYXRyaXgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghcHJvcHMuX2pvaW50TWF0cml4KSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BzLl9qb2ludE1hdHJpeCA9IFtdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBiaW5kV29ybGRNYXRyaXg7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUudW5pcXVlQmluZFBvc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgYmluZFdvcmxkTWF0cml4ID0gY2MubWF0NCgpO1xuICAgICAgICAgICAgICAgICAgICBNYXQ0Lm11bChiaW5kV29ybGRNYXRyaXgsIG1hdHJpeCwgbm9kZS51bmlxdWVCaW5kUG9zZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFqb2ludE1hdHJpeE1hcFtub2RlLnBhdGhdKSB7XG4gICAgICAgICAgICAgICAgICAgIGpvaW50TWF0cml4TWFwW25vZGUucGF0aF0gPSBbXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYmluZFdvcmxkTWF0cml4KSB7XG4gICAgICAgICAgICAgICAgICAgIGpvaW50TWF0cml4TWFwW25vZGUucGF0aF0ucHVzaChtYXh0cml4VG9BcnJheShiaW5kV29ybGRNYXRyaXgpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgam9pbnRNYXRyaXhNYXBbbm9kZS5wYXRoXS5wdXNoKG1hdHJpeClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgICAgICAgICBmb3IgKGxldCBuYW1lIGluIGNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkID0gY2hpbGRyZW5bbmFtZV07XG4gICAgICAgICAgICAgICAgd2FsayhjaGlsZCwgdGltZSwgbWF0cml4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB0aW1lID0gMDtcbiAgICAgICAgbGV0IGR1cmF0aW9uID0gdGhpcy5kdXJhdGlvbjtcbiAgICAgICAgbGV0IHN0ZXAgPSAxIC8gdGhpcy5zYW1wbGU7XG5cbiAgICAgICAgd2hpbGUgKHRpbWUgPCBkdXJhdGlvbikge1xuICAgICAgICAgICAgbmV3Q3VydmVEYXRhLnJhdGlvcy5wdXNoKHRpbWUgLyBkdXJhdGlvbik7XG4gICAgICAgICAgICB3YWxrKHJvb3ROb2RlLCB0aW1lKTtcbiAgICAgICAgICAgIHRpbWUgKz0gc3RlcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2N1cnZlRGF0YSA9IG5ld0N1cnZlRGF0YTtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUpvaW50TWF0cml4Q3VydmUgKHN0YXRlLCByb290KSB7XG4gICAgICAgIGxldCBjdXJ2ZSA9IG5ldyBKb2ludE1hdHJpeEN1cnZlKCk7XG4gICAgICAgIGN1cnZlLnJhdGlvcyA9IHRoaXMuY3VydmVEYXRhLnJhdGlvcztcblxuICAgICAgICBjdXJ2ZS5wYWlycyA9IFtdO1xuXG4gICAgICAgIGxldCBqb2ludE1hdHJpeE1hcCA9IHRoaXMuY3VydmVEYXRhLmpvaW50TWF0cml4TWFwO1xuICAgICAgICBmb3IgKGxldCBwYXRoIGluIGpvaW50TWF0cml4TWFwKSB7XG4gICAgICAgICAgICBsZXQgdGFyZ2V0ID0gY2MuZmluZChwYXRoLCByb290KTtcbiAgICAgICAgICAgIGlmICghdGFyZ2V0KSBjb250aW51ZTtcblxuICAgICAgICAgICAgY3VydmUucGFpcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgICAgICAgICAgdmFsdWVzOiBqb2ludE1hdHJpeE1hcFtwYXRoXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW2N1cnZlXTtcbiAgICB9LFxuXG4gICAgY3JlYXRlQ3VydmVzIChzdGF0ZSwgcm9vdCkge1xuICAgICAgICBpZiAoIXRoaXMuX21vZGVsKSB7XG4gICAgICAgICAgICBjYy53YXJuKGBTa2VsZXRvbiBBbmltYXRpb24gQ2xpcCBbJHt0aGlzLm5hbWV9XSBDYW4gbm90IGZpbmQgbW9kZWxgKTtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2luaXQoKTtcblxuICAgICAgICBpZiAodGhpcy5fbW9kZWwucHJlY29tcHV0ZUpvaW50TWF0cml4KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlSm9pbnRNYXRyaXhDdXJ2ZShzdGF0ZSwgcm9vdCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gQW5pbWF0aW9uQ2xpcC5wcm90b3R5cGUuY3JlYXRlQ3VydmVzLmNhbGwodGhpcywgc3RhdGUsIHJvb3QpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLlNrZWxldG9uQW5pbWF0aW9uQ2xpcCA9IG1vZHVsZS5leHBvcnRzID0gU2tlbGV0b25BbmltYXRpb25DbGlwO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=