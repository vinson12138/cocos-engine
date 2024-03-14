
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/animation/animation-curves.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

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
var bezierByTime = require('./bezier').bezierByTime;

var binarySearch = require('../core/utils/binary-search').binarySearchEpsilon;

var WrapModeMask = require('./types').WrapModeMask;

var WrappedInfo = require('./types').WrappedInfo;
/**
 * Compute a new ratio by curve type
 * @param {Number} ratio - The origin ratio
 * @param {Array|String} type - If it's Array, then ratio will be computed with bezierByTime. If it's string, then ratio will be computed with cc.easing function
 */


function computeRatioByType(ratio, type) {
  if (typeof type === 'string') {
    var func = cc.easing[type];

    if (func) {
      ratio = func(ratio);
    } else {
      cc.errorID(3906, type);
    }
  } else if (Array.isArray(type)) {
    // bezier curve
    ratio = bezierByTime(type, ratio);
  }

  return ratio;
} //
// 动画数据类，相当于 AnimationClip。
// 虽然叫做 AnimCurve，但除了曲线，可以保存任何类型的值。
//
// @class AnimCurve
//
//


var AnimCurve = cc.Class({
  name: 'cc.AnimCurve',
  //
  // @method sample
  // @param {number} time
  // @param {number} ratio - The normalized time specified as a number between 0.0 and 1.0 inclusive.
  // @param {AnimationState} state
  //
  sample: function sample(time, ratio, state) {},
  onTimeChangedManually: undefined
});
/**
 * 当每两帧之前的间隔都一样的时候可以使用此函数快速查找 index
 */

function quickFindIndex(ratios, ratio) {
  var length = ratios.length - 1;
  if (length === 0) return 0;
  var start = ratios[0];
  if (ratio < start) return 0;
  var end = ratios[length];
  if (ratio > end) return ~ratios.length;
  ratio = (ratio - start) / (end - start);
  var eachLength = 1 / length;
  var index = ratio / eachLength;
  var floorIndex = index | 0;
  var EPSILON = 1e-6;

  if (index - floorIndex < EPSILON) {
    return floorIndex;
  } else if (floorIndex + 1 - index < EPSILON) {
    return floorIndex + 1;
  }

  return ~(floorIndex + 1);
} //
//
// @class DynamicAnimCurve
//
// @extends AnimCurve
//


var DynamicAnimCurve = cc.Class({
  name: 'cc.DynamicAnimCurve',
  "extends": AnimCurve,
  ctor: function ctor() {
    // cache last frame index
    this._cachedIndex = 0;
  },
  properties: {
    // The object being animated.
    // @property target
    // @type {object}
    target: null,
    // The name of the property being animated.
    // @property prop
    // @type {string}
    prop: '',
    // The values of the keyframes. (y)
    // @property values
    // @type {any[]}
    values: [],
    // The keyframe ratio of the keyframe specified as a number between 0.0 and 1.0 inclusive. (x)
    // @property ratios
    // @type {number[]}
    ratios: [],
    // @property types
    // @param {object[]}
    // Each array item maybe type:
    // - [x, x, x, x]: Four control points for bezier
    // - null: linear
    types: []
  },
  _findFrameIndex: binarySearch,
  _lerp: undefined,
  _lerpNumber: function _lerpNumber(from, to, t) {
    return from + (to - from) * t;
  },
  _lerpObject: function _lerpObject(from, to, t) {
    return from.lerp(to, t);
  },
  _lerpQuat: function () {
    var out = cc.quat();
    return function (from, to, t) {
      return from.lerp(to, t, out);
    };
  }(),
  _lerpVector2: function () {
    var out = cc.v2();
    return function (from, to, t) {
      return from.lerp(to, t, out);
    };
  }(),
  _lerpVector3: function () {
    var out = cc.v3();
    return function (from, to, t) {
      return from.lerp(to, t, out);
    };
  }(),
  sample: function sample(time, ratio, state) {
    var values = this.values;
    var ratios = this.ratios;
    var frameCount = ratios.length;

    if (frameCount === 0) {
      return;
    } // only need to refind frame index when ratio is out of range of last from ratio and to ratio.


    var shoudRefind = true;
    var cachedIndex = this._cachedIndex;

    if (cachedIndex < 0) {
      cachedIndex = ~cachedIndex;

      if (cachedIndex > 0 && cachedIndex < ratios.length) {
        var _fromRatio = ratios[cachedIndex - 1];
        var _toRatio = ratios[cachedIndex];

        if (ratio > _fromRatio && ratio < _toRatio) {
          shoudRefind = false;
        }
      }
    }

    if (shoudRefind) {
      this._cachedIndex = this._findFrameIndex(ratios, ratio);
    } // evaluate value


    var value;
    var index = this._cachedIndex;

    if (index < 0) {
      index = ~index;

      if (index <= 0) {
        value = values[0];
      } else if (index >= frameCount) {
        value = values[frameCount - 1];
      } else {
        var fromVal = values[index - 1];

        if (!this._lerp) {
          value = fromVal;
        } else {
          var fromRatio = ratios[index - 1];
          var toRatio = ratios[index];
          var type = this.types[index - 1];
          var ratioBetweenFrames = (ratio - fromRatio) / (toRatio - fromRatio);

          if (type) {
            ratioBetweenFrames = computeRatioByType(ratioBetweenFrames, type);
          } // calculate value


          var toVal = values[index];
          value = this._lerp(fromVal, toVal, ratioBetweenFrames);
        }
      }
    } else {
      value = values[index];
    }

    this.target[this.prop] = value;
  }
});
DynamicAnimCurve.Linear = null;

DynamicAnimCurve.Bezier = function (controlPoints) {
  return controlPoints;
};
/**
 * Event information,
 * @class EventInfo
 *
 */


var EventInfo = function EventInfo() {
  this.events = [];
};
/**
 * @param {Function} [func] event function
 * @param {Object[]} [params] event params
 */


EventInfo.prototype.add = function (func, params) {
  this.events.push({
    func: func || '',
    params: params || []
  });
};
/**
 *
 * @class EventAnimCurve
 *
 * @extends AnimCurve
 */


var EventAnimCurve = cc.Class({
  name: 'cc.EventAnimCurve',
  "extends": AnimCurve,
  properties: {
    /**
     * The object being animated.
     * @property target
     * @type {object}
     */
    target: null,

    /** The keyframe ratio of the keyframe specified as a number between 0.0 and 1.0 inclusive. (x)
     * @property ratios
     * @type {number[]}
     */
    ratios: [],

    /**
     * @property events
     * @type {EventInfo[]}
     */
    events: [],
    _wrappedInfo: {
      "default": function _default() {
        return new WrappedInfo();
      }
    },
    _lastWrappedInfo: null,
    _ignoreIndex: NaN
  },
  _wrapIterations: function _wrapIterations(iterations) {
    if (iterations - (iterations | 0) === 0) iterations -= 1;
    return iterations | 0;
  },
  sample: function sample(time, ratio, state) {
    var length = this.ratios.length;
    var currentWrappedInfo = state.getWrappedInfo(state.time, this._wrappedInfo);
    var direction = currentWrappedInfo.direction;
    var currentIndex = binarySearch(this.ratios, currentWrappedInfo.ratio);

    if (currentIndex < 0) {
      currentIndex = ~currentIndex - 1; // if direction is inverse, then increase index

      if (direction < 0) currentIndex += 1;
    }

    if (this._ignoreIndex !== currentIndex) {
      this._ignoreIndex = NaN;
    }

    currentWrappedInfo.frameIndex = currentIndex;

    if (!this._lastWrappedInfo) {
      this._fireEvent(currentIndex);

      this._lastWrappedInfo = new WrappedInfo(currentWrappedInfo);
      return;
    }

    var wrapMode = state.wrapMode;

    var currentIterations = this._wrapIterations(currentWrappedInfo.iterations);

    var lastWrappedInfo = this._lastWrappedInfo;

    var lastIterations = this._wrapIterations(lastWrappedInfo.iterations);

    var lastIndex = lastWrappedInfo.frameIndex;
    var lastDirection = lastWrappedInfo.direction;
    var interationsChanged = lastIterations !== -1 && currentIterations !== lastIterations;

    if (lastIndex === currentIndex && interationsChanged && length === 1) {
      this._fireEvent(0);
    } else if (lastIndex !== currentIndex || interationsChanged) {
      direction = lastDirection;

      do {
        if (lastIndex !== currentIndex) {
          if (direction === -1 && lastIndex === 0 && currentIndex > 0) {
            if ((wrapMode & WrapModeMask.PingPong) === WrapModeMask.PingPong) {
              direction *= -1;
            } else {
              lastIndex = length;
            }

            lastIterations++;
          } else if (direction === 1 && lastIndex === length - 1 && currentIndex < length - 1) {
            if ((wrapMode & WrapModeMask.PingPong) === WrapModeMask.PingPong) {
              direction *= -1;
            } else {
              lastIndex = -1;
            }

            lastIterations++;
          }

          if (lastIndex === currentIndex) break;
          if (lastIterations > currentIterations) break;
        }

        lastIndex += direction;
        cc.director.getAnimationManager().pushDelayEvent(this, '_fireEvent', [lastIndex]);
      } while (lastIndex !== currentIndex && lastIndex > -1 && lastIndex < length);
    }

    this._lastWrappedInfo.set(currentWrappedInfo);
  },
  _fireEvent: function _fireEvent(index) {
    if (index < 0 || index >= this.events.length || this._ignoreIndex === index) return;
    var eventInfo = this.events[index];
    var events = eventInfo.events;

    if (!this.target.isValid) {
      return;
    }

    var components = this.target._components;

    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      var funcName = event.func;

      for (var j = 0; j < components.length; j++) {
        var component = components[j];
        var func = component[funcName];
        if (func) func.apply(component, event.params);
      }
    }
  },
  onTimeChangedManually: function onTimeChangedManually(time, state) {
    this._lastWrappedInfo = null;
    this._ignoreIndex = NaN;
    var info = state.getWrappedInfo(time, this._wrappedInfo);
    var direction = info.direction;
    var frameIndex = binarySearch(this.ratios, info.ratio); // only ignore when time not on a frame index

    if (frameIndex < 0) {
      frameIndex = ~frameIndex - 1; // if direction is inverse, then increase index

      if (direction < 0) frameIndex += 1;
      this._ignoreIndex = frameIndex;
    }
  }
});

if (CC_TEST) {
  cc._Test.DynamicAnimCurve = DynamicAnimCurve;
  cc._Test.EventAnimCurve = EventAnimCurve;
  cc._Test.quickFindIndex = quickFindIndex;
}

module.exports = {
  AnimCurve: AnimCurve,
  DynamicAnimCurve: DynamicAnimCurve,
  EventAnimCurve: EventAnimCurve,
  EventInfo: EventInfo,
  computeRatioByType: computeRatioByType,
  quickFindIndex: quickFindIndex
};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9hbmltYXRpb24vYW5pbWF0aW9uLWN1cnZlcy5qcyJdLCJuYW1lcyI6WyJiZXppZXJCeVRpbWUiLCJyZXF1aXJlIiwiYmluYXJ5U2VhcmNoIiwiYmluYXJ5U2VhcmNoRXBzaWxvbiIsIldyYXBNb2RlTWFzayIsIldyYXBwZWRJbmZvIiwiY29tcHV0ZVJhdGlvQnlUeXBlIiwicmF0aW8iLCJ0eXBlIiwiZnVuYyIsImNjIiwiZWFzaW5nIiwiZXJyb3JJRCIsIkFycmF5IiwiaXNBcnJheSIsIkFuaW1DdXJ2ZSIsIkNsYXNzIiwibmFtZSIsInNhbXBsZSIsInRpbWUiLCJzdGF0ZSIsIm9uVGltZUNoYW5nZWRNYW51YWxseSIsInVuZGVmaW5lZCIsInF1aWNrRmluZEluZGV4IiwicmF0aW9zIiwibGVuZ3RoIiwic3RhcnQiLCJlbmQiLCJlYWNoTGVuZ3RoIiwiaW5kZXgiLCJmbG9vckluZGV4IiwiRVBTSUxPTiIsIkR5bmFtaWNBbmltQ3VydmUiLCJjdG9yIiwiX2NhY2hlZEluZGV4IiwicHJvcGVydGllcyIsInRhcmdldCIsInByb3AiLCJ2YWx1ZXMiLCJ0eXBlcyIsIl9maW5kRnJhbWVJbmRleCIsIl9sZXJwIiwiX2xlcnBOdW1iZXIiLCJmcm9tIiwidG8iLCJ0IiwiX2xlcnBPYmplY3QiLCJsZXJwIiwiX2xlcnBRdWF0Iiwib3V0IiwicXVhdCIsIl9sZXJwVmVjdG9yMiIsInYyIiwiX2xlcnBWZWN0b3IzIiwidjMiLCJmcmFtZUNvdW50Iiwic2hvdWRSZWZpbmQiLCJjYWNoZWRJbmRleCIsImZyb21SYXRpbyIsInRvUmF0aW8iLCJ2YWx1ZSIsImZyb21WYWwiLCJyYXRpb0JldHdlZW5GcmFtZXMiLCJ0b1ZhbCIsIkxpbmVhciIsIkJlemllciIsImNvbnRyb2xQb2ludHMiLCJFdmVudEluZm8iLCJldmVudHMiLCJwcm90b3R5cGUiLCJhZGQiLCJwYXJhbXMiLCJwdXNoIiwiRXZlbnRBbmltQ3VydmUiLCJfd3JhcHBlZEluZm8iLCJfbGFzdFdyYXBwZWRJbmZvIiwiX2lnbm9yZUluZGV4IiwiTmFOIiwiX3dyYXBJdGVyYXRpb25zIiwiaXRlcmF0aW9ucyIsImN1cnJlbnRXcmFwcGVkSW5mbyIsImdldFdyYXBwZWRJbmZvIiwiZGlyZWN0aW9uIiwiY3VycmVudEluZGV4IiwiZnJhbWVJbmRleCIsIl9maXJlRXZlbnQiLCJ3cmFwTW9kZSIsImN1cnJlbnRJdGVyYXRpb25zIiwibGFzdFdyYXBwZWRJbmZvIiwibGFzdEl0ZXJhdGlvbnMiLCJsYXN0SW5kZXgiLCJsYXN0RGlyZWN0aW9uIiwiaW50ZXJhdGlvbnNDaGFuZ2VkIiwiUGluZ1BvbmciLCJkaXJlY3RvciIsImdldEFuaW1hdGlvbk1hbmFnZXIiLCJwdXNoRGVsYXlFdmVudCIsInNldCIsImV2ZW50SW5mbyIsImlzVmFsaWQiLCJjb21wb25lbnRzIiwiX2NvbXBvbmVudHMiLCJpIiwiZXZlbnQiLCJmdW5jTmFtZSIsImoiLCJjb21wb25lbnQiLCJhcHBseSIsImluZm8iLCJDQ19URVNUIiwiX1Rlc3QiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0EsSUFBTUEsWUFBWSxHQUFHQyxPQUFPLENBQUMsVUFBRCxDQUFQLENBQW9CRCxZQUF6Qzs7QUFFQSxJQUFNRSxZQUFZLEdBQUdELE9BQU8sQ0FBQyw2QkFBRCxDQUFQLENBQXVDRSxtQkFBNUQ7O0FBQ0EsSUFBTUMsWUFBWSxHQUFHSCxPQUFPLENBQUMsU0FBRCxDQUFQLENBQW1CRyxZQUF4Qzs7QUFDQSxJQUFNQyxXQUFXLEdBQUdKLE9BQU8sQ0FBQyxTQUFELENBQVAsQ0FBbUJJLFdBQXZDO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsU0FBU0Msa0JBQVQs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SUFBckIsRUFBMkIsS0FBS3VELFlBQWhDLENBQVg7QUFDQSxRQUFJUSxTQUFTLEdBQUcwQixJQUFJLENBQUMxQixTQUFyQjtBQUNBLFFBQUlFLFVBQVUsR0FBR2xGLFlBQVksQ0FBQyxLQUFLc0IsTUFBTixFQUFjb0YsSUFBSSxDQUFDckcsS0FBbkIsQ0FBN0IsQ0FOMEMsQ0FRMUM7O0FBQ0EsUUFBSTZFLFVBQVUsR0FBRyxDQUFqQixFQUFvQjtBQUNoQkEsTUFBQUEsVUFBVSxHQUFHLENBQUNBLFVBQUQsR0FBYyxDQUEzQixDQURnQixDQUdoQjs7QUFDQSxVQUFJRixTQUFTLEdBQUcsQ0FBaEIsRUFBbUJFLFVBQVUsSUFBSSxDQUFkO0FBRW5CLFdBQUtSLFlBQUwsR0FBb0JRLFVBQXBCO0FBQ0g7QUFDSjtBQS9KeUIsQ0FBVCxDQUFyQjs7QUFtS0EsSUFBSXlCLE9BQUosRUFBYTtBQUNUbkcsRUFBQUEsRUFBRSxDQUFDb0csS0FBSCxDQUFTOUUsZ0JBQVQsR0FBNEJBLGdCQUE1QjtBQUNBdEIsRUFBQUEsRUFBRSxDQUFDb0csS0FBSCxDQUFTckMsY0FBVCxHQUEwQkEsY0FBMUI7QUFDQS9ELEVBQUFBLEVBQUUsQ0FBQ29HLEtBQUgsQ0FBU3ZGLGNBQVQsR0FBMEJBLGNBQTFCO0FBQ0g7O0FBRUR3RixNQUFNLENBQUNDLE9BQVAsR0FBaUI7QUFDYmpHLEVBQUFBLFNBQVMsRUFBRUEsU0FERTtBQUViaUIsRUFBQUEsZ0JBQWdCLEVBQUVBLGdCQUZMO0FBR2J5QyxFQUFBQSxjQUFjLEVBQUVBLGNBSEg7QUFJYk4sRUFBQUEsU0FBUyxFQUFFQSxTQUpFO0FBS2I3RCxFQUFBQSxrQkFBa0IsRUFBRUEsa0JBTFA7QUFNYmlCLEVBQUFBLGNBQWMsRUFBRUE7QUFOSCxDQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuY29uc3QgYmV6aWVyQnlUaW1lID0gcmVxdWlyZSgnLi9iZXppZXInKS5iZXppZXJCeVRpbWU7XG5cbmNvbnN0IGJpbmFyeVNlYXJjaCA9IHJlcXVpcmUoJy4uL2NvcmUvdXRpbHMvYmluYXJ5LXNlYXJjaCcpLmJpbmFyeVNlYXJjaEVwc2lsb247XG5jb25zdCBXcmFwTW9kZU1hc2sgPSByZXF1aXJlKCcuL3R5cGVzJykuV3JhcE1vZGVNYXNrO1xuY29uc3QgV3JhcHBlZEluZm8gPSByZXF1aXJlKCcuL3R5cGVzJykuV3JhcHBlZEluZm87XG5cbi8qKlxuICogQ29tcHV0ZSBhIG5ldyByYXRpbyBieSBjdXJ2ZSB0eXBlXG4gKiBAcGFyYW0ge051bWJlcn0gcmF0aW8gLSBUaGUgb3JpZ2luIHJhdGlvXG4gKiBAcGFyYW0ge0FycmF5fFN0cmluZ30gdHlwZSAtIElmIGl0J3MgQXJyYXksIHRoZW4gcmF0aW8gd2lsbCBiZSBjb21wdXRlZCB3aXRoIGJlemllckJ5VGltZS4gSWYgaXQncyBzdHJpbmcsIHRoZW4gcmF0aW8gd2lsbCBiZSBjb21wdXRlZCB3aXRoIGNjLmVhc2luZyBmdW5jdGlvblxuICovXG5mdW5jdGlvbiBjb21wdXRlUmF0aW9CeVR5cGUgKHJhdGlvLCB0eXBlKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICB2YXIgZnVuYyA9IGNjLmVhc2luZ1t0eXBlXTtcbiAgICAgICAgaWYgKGZ1bmMpIHtcbiAgICAgICAgICAgIHJhdGlvID0gZnVuYyhyYXRpbyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDM5MDYsIHR5cGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodHlwZSkpIHtcbiAgICAgICAgLy8gYmV6aWVyIGN1cnZlXG4gICAgICAgIHJhdGlvID0gYmV6aWVyQnlUaW1lKHR5cGUsIHJhdGlvKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmF0aW87XG59XG5cbi8vXG4vLyDliqjnlLvmlbDmja7nsbvvvIznm7jlvZPkuo4gQW5pbWF0aW9uQ2xpcOOAglxuLy8g6Jm954S25Y+r5YGaIEFuaW1DdXJ2Ze+8jOS9humZpOS6huabsue6v++8jOWPr+S7peS/neWtmOS7u+S9leexu+Wei+eahOWAvOOAglxuLy9cbi8vIEBjbGFzcyBBbmltQ3VydmVcbi8vXG4vL1xudmFyIEFuaW1DdXJ2ZSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuQW5pbUN1cnZlJyxcblxuICAgIC8vXG4gICAgLy8gQG1ldGhvZCBzYW1wbGVcbiAgICAvLyBAcGFyYW0ge251bWJlcn0gdGltZVxuICAgIC8vIEBwYXJhbSB7bnVtYmVyfSByYXRpbyAtIFRoZSBub3JtYWxpemVkIHRpbWUgc3BlY2lmaWVkIGFzIGEgbnVtYmVyIGJldHdlZW4gMC4wIGFuZCAxLjAgaW5jbHVzaXZlLlxuICAgIC8vIEBwYXJhbSB7QW5pbWF0aW9uU3RhdGV9IHN0YXRlXG4gICAgLy9cbiAgICBzYW1wbGU6IGZ1bmN0aW9uICh0aW1lLCByYXRpbywgc3RhdGUpIHt9LFxuXG4gICAgb25UaW1lQ2hhbmdlZE1hbnVhbGx5OiB1bmRlZmluZWRcbn0pO1xuXG4vKipcbiAqIOW9k+avj+S4pOW4p+S5i+WJjeeahOmXtOmalOmDveS4gOagt+eahOaXtuWAmeWPr+S7peS9v+eUqOatpOWHveaVsOW/q+mAn+afpeaJviBpbmRleFxuICovXG5mdW5jdGlvbiBxdWlja0ZpbmRJbmRleCAocmF0aW9zLCByYXRpbykge1xuICAgIHZhciBsZW5ndGggPSByYXRpb3MubGVuZ3RoIC0gMTtcblxuICAgIGlmIChsZW5ndGggPT09IDApIHJldHVybiAwO1xuXG4gICAgdmFyIHN0YXJ0ID0gcmF0aW9zWzBdO1xuICAgIGlmIChyYXRpbyA8IHN0YXJ0KSByZXR1cm4gMDtcblxuICAgIHZhciBlbmQgPSByYXRpb3NbbGVuZ3RoXTtcbiAgICBpZiAocmF0aW8gPiBlbmQpIHJldHVybiB+cmF0aW9zLmxlbmd0aDtcblxuICAgIHJhdGlvID0gKHJhdGlvIC0gc3RhcnQpIC8gKGVuZCAtIHN0YXJ0KTtcblxuICAgIHZhciBlYWNoTGVuZ3RoID0gMSAvIGxlbmd0aDtcbiAgICB2YXIgaW5kZXggPSByYXRpbyAvIGVhY2hMZW5ndGg7XG4gICAgdmFyIGZsb29ySW5kZXggPSBpbmRleCB8IDA7XG4gICAgdmFyIEVQU0lMT04gPSAxZS02O1xuXG4gICAgaWYgKChpbmRleCAtIGZsb29ySW5kZXgpIDwgRVBTSUxPTikge1xuICAgICAgICByZXR1cm4gZmxvb3JJbmRleDtcbiAgICB9XG4gICAgZWxzZSBpZiAoKGZsb29ySW5kZXggKyAxIC0gaW5kZXgpIDwgRVBTSUxPTikge1xuICAgICAgICByZXR1cm4gZmxvb3JJbmRleCArIDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIH4oZmxvb3JJbmRleCArIDEpO1xufVxuXG4vL1xuLy9cbi8vIEBjbGFzcyBEeW5hbWljQW5pbUN1cnZlXG4vL1xuLy8gQGV4dGVuZHMgQW5pbUN1cnZlXG4vL1xudmFyIER5bmFtaWNBbmltQ3VydmUgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkR5bmFtaWNBbmltQ3VydmUnLFxuICAgIGV4dGVuZHM6IEFuaW1DdXJ2ZSxcblxuICAgIGN0b3IgKCkge1xuICAgICAgICAvLyBjYWNoZSBsYXN0IGZyYW1lIGluZGV4XG4gICAgICAgIHRoaXMuX2NhY2hlZEluZGV4ID0gMDtcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIC8vIFRoZSBvYmplY3QgYmVpbmcgYW5pbWF0ZWQuXG4gICAgICAgIC8vIEBwcm9wZXJ0eSB0YXJnZXRcbiAgICAgICAgLy8gQHR5cGUge29iamVjdH1cbiAgICAgICAgdGFyZ2V0OiBudWxsLFxuXG4gICAgICAgIC8vIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSBiZWluZyBhbmltYXRlZC5cbiAgICAgICAgLy8gQHByb3BlcnR5IHByb3BcbiAgICAgICAgLy8gQHR5cGUge3N0cmluZ31cbiAgICAgICAgcHJvcDogJycsXG5cbiAgICAgICAgLy8gVGhlIHZhbHVlcyBvZiB0aGUga2V5ZnJhbWVzLiAoeSlcbiAgICAgICAgLy8gQHByb3BlcnR5IHZhbHVlc1xuICAgICAgICAvLyBAdHlwZSB7YW55W119XG4gICAgICAgIHZhbHVlczogW10sXG5cbiAgICAgICAgLy8gVGhlIGtleWZyYW1lIHJhdGlvIG9mIHRoZSBrZXlmcmFtZSBzcGVjaWZpZWQgYXMgYSBudW1iZXIgYmV0d2VlbiAwLjAgYW5kIDEuMCBpbmNsdXNpdmUuICh4KVxuICAgICAgICAvLyBAcHJvcGVydHkgcmF0aW9zXG4gICAgICAgIC8vIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgICAgcmF0aW9zOiBbXSxcblxuICAgICAgICAvLyBAcHJvcGVydHkgdHlwZXNcbiAgICAgICAgLy8gQHBhcmFtIHtvYmplY3RbXX1cbiAgICAgICAgLy8gRWFjaCBhcnJheSBpdGVtIG1heWJlIHR5cGU6XG4gICAgICAgIC8vIC0gW3gsIHgsIHgsIHhdOiBGb3VyIGNvbnRyb2wgcG9pbnRzIGZvciBiZXppZXJcbiAgICAgICAgLy8gLSBudWxsOiBsaW5lYXJcbiAgICAgICAgdHlwZXM6IFtdLFxuICAgIH0sXG5cbiAgICBfZmluZEZyYW1lSW5kZXg6IGJpbmFyeVNlYXJjaCxcbiAgICBfbGVycDogdW5kZWZpbmVkLFxuXG4gICAgX2xlcnBOdW1iZXIgKGZyb20sIHRvLCB0KSB7XG4gICAgICAgIHJldHVybiBmcm9tICsgKHRvIC0gZnJvbSkgKiB0O1xuICAgIH0sXG5cbiAgICBfbGVycE9iamVjdCAoZnJvbSwgdG8sIHQpIHtcbiAgICAgICAgcmV0dXJuIGZyb20ubGVycCh0bywgdCk7XG4gICAgfSxcblxuICAgIF9sZXJwUXVhdDogKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IG91dCA9IGNjLnF1YXQoKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmcm9tLCB0bywgdCkge1xuICAgICAgICAgICAgcmV0dXJuIGZyb20ubGVycCh0bywgdCwgb3V0KTtcbiAgICAgICAgfTtcbiAgICB9KSgpLFxuXG4gICAgX2xlcnBWZWN0b3IyOiAoZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgb3V0ID0gY2MudjIoKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmcm9tLCB0bywgdCkge1xuICAgICAgICAgICAgcmV0dXJuIGZyb20ubGVycCh0bywgdCwgb3V0KTtcbiAgICAgICAgfTtcbiAgICB9KSgpLFxuXG4gICAgX2xlcnBWZWN0b3IzOiAoZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgb3V0ID0gY2MudjMoKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmcm9tLCB0bywgdCkge1xuICAgICAgICAgICAgcmV0dXJuIGZyb20ubGVycCh0bywgdCwgb3V0KTtcbiAgICAgICAgfTtcbiAgICB9KSgpLFxuXG4gICAgc2FtcGxlICh0aW1lLCByYXRpbywgc3RhdGUpIHtcbiAgICAgICAgbGV0IHZhbHVlcyA9IHRoaXMudmFsdWVzO1xuICAgICAgICBsZXQgcmF0aW9zID0gdGhpcy5yYXRpb3M7XG4gICAgICAgIGxldCBmcmFtZUNvdW50ID0gcmF0aW9zLmxlbmd0aDtcblxuICAgICAgICBpZiAoZnJhbWVDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gb25seSBuZWVkIHRvIHJlZmluZCBmcmFtZSBpbmRleCB3aGVuIHJhdGlvIGlzIG91dCBvZiByYW5nZSBvZiBsYXN0IGZyb20gcmF0aW8gYW5kIHRvIHJhdGlvLlxuICAgICAgICBsZXQgc2hvdWRSZWZpbmQgPSB0cnVlO1xuICAgICAgICBsZXQgY2FjaGVkSW5kZXggPSB0aGlzLl9jYWNoZWRJbmRleDtcbiAgICAgICAgaWYgKGNhY2hlZEluZGV4IDwgMCkge1xuICAgICAgICAgICAgY2FjaGVkSW5kZXggPSB+Y2FjaGVkSW5kZXg7XG4gICAgICAgICAgICBpZiAoY2FjaGVkSW5kZXggPiAwICYmIGNhY2hlZEluZGV4IDwgcmF0aW9zLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGxldCBmcm9tUmF0aW8gPSByYXRpb3NbY2FjaGVkSW5kZXggLSAxXTtcbiAgICAgICAgICAgICAgICBsZXQgdG9SYXRpbyA9IHJhdGlvc1tjYWNoZWRJbmRleF07XG4gICAgICAgICAgICAgICAgaWYgKHJhdGlvID4gZnJvbVJhdGlvICYmIHJhdGlvIDwgdG9SYXRpbykge1xuICAgICAgICAgICAgICAgICAgICBzaG91ZFJlZmluZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaG91ZFJlZmluZCkge1xuICAgICAgICAgICAgdGhpcy5fY2FjaGVkSW5kZXggPSB0aGlzLl9maW5kRnJhbWVJbmRleChyYXRpb3MsIHJhdGlvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGV2YWx1YXRlIHZhbHVlXG4gICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5fY2FjaGVkSW5kZXg7XG4gICAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgICAgIGluZGV4ID0gfmluZGV4O1xuXG4gICAgICAgICAgICBpZiAoaW5kZXggPD0gMCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWVzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaW5kZXggPj0gZnJhbWVDb3VudCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWVzW2ZyYW1lQ291bnQgLSAxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBmcm9tVmFsID0gdmFsdWVzW2luZGV4IC0gMV07XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2xlcnApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBmcm9tVmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZyb21SYXRpbyA9IHJhdGlvc1tpbmRleCAtIDFdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG9SYXRpbyA9IHJhdGlvc1tpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIHZhciB0eXBlID0gdGhpcy50eXBlc1tpbmRleCAtIDFdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmF0aW9CZXR3ZWVuRnJhbWVzID0gKHJhdGlvIC0gZnJvbVJhdGlvKSAvICh0b1JhdGlvIC0gZnJvbVJhdGlvKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmF0aW9CZXR3ZWVuRnJhbWVzID0gY29tcHV0ZVJhdGlvQnlUeXBlKHJhdGlvQmV0d2VlbkZyYW1lcywgdHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvVmFsID0gdmFsdWVzW2luZGV4XTtcblxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuX2xlcnAoZnJvbVZhbCwgdG9WYWwsIHJhdGlvQmV0d2VlbkZyYW1lcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZXNbaW5kZXhdO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50YXJnZXRbdGhpcy5wcm9wXSA9IHZhbHVlO1xuICAgIH1cbn0pO1xuXG5EeW5hbWljQW5pbUN1cnZlLkxpbmVhciA9IG51bGw7XG5EeW5hbWljQW5pbUN1cnZlLkJlemllciA9IGZ1bmN0aW9uIChjb250cm9sUG9pbnRzKSB7XG4gICAgcmV0dXJuIGNvbnRyb2xQb2ludHM7XG59O1xuXG5cbi8qKlxuICogRXZlbnQgaW5mb3JtYXRpb24sXG4gKiBAY2xhc3MgRXZlbnRJbmZvXG4gKlxuICovXG52YXIgRXZlbnRJbmZvID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZXZlbnRzID0gW107XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtmdW5jXSBldmVudCBmdW5jdGlvblxuICogQHBhcmFtIHtPYmplY3RbXX0gW3BhcmFtc10gZXZlbnQgcGFyYW1zXG4gKi9cbkV2ZW50SW5mby5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGZ1bmMsIHBhcmFtcykge1xuICAgIHRoaXMuZXZlbnRzLnB1c2goe1xuICAgICAgICBmdW5jOiBmdW5jIHx8ICcnLFxuICAgICAgICBwYXJhbXM6IHBhcmFtcyB8fCBbXVxuICAgIH0pO1xufTtcblxuXG4vKipcbiAqXG4gKiBAY2xhc3MgRXZlbnRBbmltQ3VydmVcbiAqXG4gKiBAZXh0ZW5kcyBBbmltQ3VydmVcbiAqL1xudmFyIEV2ZW50QW5pbUN1cnZlID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5FdmVudEFuaW1DdXJ2ZScsXG4gICAgZXh0ZW5kczogQW5pbUN1cnZlLFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG9iamVjdCBiZWluZyBhbmltYXRlZC5cbiAgICAgICAgICogQHByb3BlcnR5IHRhcmdldFxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdGFyZ2V0OiBudWxsLFxuXG4gICAgICAgIC8qKiBUaGUga2V5ZnJhbWUgcmF0aW8gb2YgdGhlIGtleWZyYW1lIHNwZWNpZmllZCBhcyBhIG51bWJlciBiZXR3ZWVuIDAuMCBhbmQgMS4wIGluY2x1c2l2ZS4gKHgpXG4gICAgICAgICAqIEBwcm9wZXJ0eSByYXRpb3NcbiAgICAgICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAgICAgKi9cbiAgICAgICAgcmF0aW9zOiBbXSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHByb3BlcnR5IGV2ZW50c1xuICAgICAgICAgKiBAdHlwZSB7RXZlbnRJbmZvW119XG4gICAgICAgICAqL1xuICAgICAgICBldmVudHM6IFtdLFxuXG4gICAgICAgIF93cmFwcGVkSW5mbzoge1xuICAgICAgICAgICAgZGVmYXVsdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgV3JhcHBlZEluZm8oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfbGFzdFdyYXBwZWRJbmZvOiBudWxsLFxuXG4gICAgICAgIF9pZ25vcmVJbmRleDogTmFOXG4gICAgfSxcblxuICAgIF93cmFwSXRlcmF0aW9uczogZnVuY3Rpb24gKGl0ZXJhdGlvbnMpIHtcbiAgICAgICAgaWYgKGl0ZXJhdGlvbnMgLSAoaXRlcmF0aW9ucyB8IDApID09PSAwKSBpdGVyYXRpb25zIC09IDE7XG4gICAgICAgIHJldHVybiBpdGVyYXRpb25zIHwgMDtcbiAgICB9LFxuXG4gICAgc2FtcGxlOiBmdW5jdGlvbiAodGltZSwgcmF0aW8sIHN0YXRlKSB7XG4gICAgICAgIHZhciBsZW5ndGggPSB0aGlzLnJhdGlvcy5sZW5ndGg7XG5cbiAgICAgICAgdmFyIGN1cnJlbnRXcmFwcGVkSW5mbyA9IHN0YXRlLmdldFdyYXBwZWRJbmZvKHN0YXRlLnRpbWUsIHRoaXMuX3dyYXBwZWRJbmZvKTtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGN1cnJlbnRXcmFwcGVkSW5mby5kaXJlY3Rpb247XG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBiaW5hcnlTZWFyY2godGhpcy5yYXRpb3MsIGN1cnJlbnRXcmFwcGVkSW5mby5yYXRpbyk7XG4gICAgICAgIGlmIChjdXJyZW50SW5kZXggPCAwKSB7XG4gICAgICAgICAgICBjdXJyZW50SW5kZXggPSB+Y3VycmVudEluZGV4IC0gMTtcblxuICAgICAgICAgICAgLy8gaWYgZGlyZWN0aW9uIGlzIGludmVyc2UsIHRoZW4gaW5jcmVhc2UgaW5kZXhcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPCAwKSBjdXJyZW50SW5kZXggKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9pZ25vcmVJbmRleCAhPT0gY3VycmVudEluZGV4KSB7XG4gICAgICAgICAgICB0aGlzLl9pZ25vcmVJbmRleCA9IE5hTjtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnRXcmFwcGVkSW5mby5mcmFtZUluZGV4ID0gY3VycmVudEluZGV4O1xuXG4gICAgICAgIGlmICghdGhpcy5fbGFzdFdyYXBwZWRJbmZvKSB7XG4gICAgICAgICAgICB0aGlzLl9maXJlRXZlbnQoY3VycmVudEluZGV4KTtcbiAgICAgICAgICAgIHRoaXMuX2xhc3RXcmFwcGVkSW5mbyA9IG5ldyBXcmFwcGVkSW5mbyhjdXJyZW50V3JhcHBlZEluZm8pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHdyYXBNb2RlID0gc3RhdGUud3JhcE1vZGU7XG4gICAgICAgIHZhciBjdXJyZW50SXRlcmF0aW9ucyA9IHRoaXMuX3dyYXBJdGVyYXRpb25zKGN1cnJlbnRXcmFwcGVkSW5mby5pdGVyYXRpb25zKTtcblxuICAgICAgICB2YXIgbGFzdFdyYXBwZWRJbmZvID0gdGhpcy5fbGFzdFdyYXBwZWRJbmZvO1xuICAgICAgICB2YXIgbGFzdEl0ZXJhdGlvbnMgPSB0aGlzLl93cmFwSXRlcmF0aW9ucyhsYXN0V3JhcHBlZEluZm8uaXRlcmF0aW9ucyk7XG4gICAgICAgIHZhciBsYXN0SW5kZXggPSBsYXN0V3JhcHBlZEluZm8uZnJhbWVJbmRleDtcbiAgICAgICAgdmFyIGxhc3REaXJlY3Rpb24gPSBsYXN0V3JhcHBlZEluZm8uZGlyZWN0aW9uO1xuXG4gICAgICAgIHZhciBpbnRlcmF0aW9uc0NoYW5nZWQgPSBsYXN0SXRlcmF0aW9ucyAhPT0gLTEgJiYgY3VycmVudEl0ZXJhdGlvbnMgIT09IGxhc3RJdGVyYXRpb25zO1xuXG4gICAgICAgIGlmIChsYXN0SW5kZXggPT09IGN1cnJlbnRJbmRleCAmJiBpbnRlcmF0aW9uc0NoYW5nZWQgJiYgbGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICB0aGlzLl9maXJlRXZlbnQoMCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobGFzdEluZGV4ICE9PSBjdXJyZW50SW5kZXggfHwgaW50ZXJhdGlvbnNDaGFuZ2VkKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBsYXN0RGlyZWN0aW9uO1xuXG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RJbmRleCAhPT0gY3VycmVudEluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09IC0xICYmIGxhc3RJbmRleCA9PT0gMCAmJiBjdXJyZW50SW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHdyYXBNb2RlICYgV3JhcE1vZGVNYXNrLlBpbmdQb25nKSA9PT0gV3JhcE1vZGVNYXNrLlBpbmdQb25nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uICo9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdEluZGV4ID0gbGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0SXRlcmF0aW9ucyArKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChkaXJlY3Rpb24gPT09IDEgJiYgbGFzdEluZGV4ID09PSBsZW5ndGggLSAxICYmIGN1cnJlbnRJbmRleCA8IGxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgod3JhcE1vZGUgJiBXcmFwTW9kZU1hc2suUGluZ1BvbmcpID09PSBXcmFwTW9kZU1hc2suUGluZ1BvbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb24gKj0gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0SW5kZXggPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdEl0ZXJhdGlvbnMgKys7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdEluZGV4ID09PSBjdXJyZW50SW5kZXgpIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdEl0ZXJhdGlvbnMgPiBjdXJyZW50SXRlcmF0aW9ucykgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGFzdEluZGV4ICs9IGRpcmVjdGlvbjtcblxuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmdldEFuaW1hdGlvbk1hbmFnZXIoKS5wdXNoRGVsYXlFdmVudCh0aGlzLCAnX2ZpcmVFdmVudCcsIFtsYXN0SW5kZXhdKTtcbiAgICAgICAgICAgIH0gd2hpbGUgKGxhc3RJbmRleCAhPT0gY3VycmVudEluZGV4ICYmIGxhc3RJbmRleCA+IC0xICYmIGxhc3RJbmRleCA8IGxlbmd0aCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sYXN0V3JhcHBlZEluZm8uc2V0KGN1cnJlbnRXcmFwcGVkSW5mbyk7XG4gICAgfSxcblxuICAgIF9maXJlRXZlbnQ6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuZXZlbnRzLmxlbmd0aCB8fCB0aGlzLl9pZ25vcmVJbmRleCA9PT0gaW5kZXgpIHJldHVybjtcblxuICAgICAgICB2YXIgZXZlbnRJbmZvID0gdGhpcy5ldmVudHNbaW5kZXhdO1xuICAgICAgICB2YXIgZXZlbnRzID0gZXZlbnRJbmZvLmV2ZW50cztcbiAgICAgICAgXG4gICAgICAgIGlmICggIXRoaXMudGFyZ2V0LmlzVmFsaWQgKSB7IFxuICAgICAgICAgICAgcmV0dXJuOyBcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdmFyIGNvbXBvbmVudHMgPSB0aGlzLnRhcmdldC5fY29tcG9uZW50cztcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgIGkgPCBldmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBldmVudCA9IGV2ZW50c1tpXTtcbiAgICAgICAgICAgIHZhciBmdW5jTmFtZSA9IGV2ZW50LmZ1bmM7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY29tcG9uZW50cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHZhciBjb21wb25lbnQgPSBjb21wb25lbnRzW2pdO1xuICAgICAgICAgICAgICAgIHZhciBmdW5jID0gY29tcG9uZW50W2Z1bmNOYW1lXTtcblxuICAgICAgICAgICAgICAgIGlmIChmdW5jKSBmdW5jLmFwcGx5KGNvbXBvbmVudCwgZXZlbnQucGFyYW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvblRpbWVDaGFuZ2VkTWFudWFsbHk6IGZ1bmN0aW9uICh0aW1lLCBzdGF0ZSkge1xuICAgICAgICB0aGlzLl9sYXN0V3JhcHBlZEluZm8gPSBudWxsO1xuICAgICAgICB0aGlzLl9pZ25vcmVJbmRleCA9IE5hTjtcblxuICAgICAgICB2YXIgaW5mbyA9IHN0YXRlLmdldFdyYXBwZWRJbmZvKHRpbWUsIHRoaXMuX3dyYXBwZWRJbmZvKTtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGluZm8uZGlyZWN0aW9uO1xuICAgICAgICB2YXIgZnJhbWVJbmRleCA9IGJpbmFyeVNlYXJjaCh0aGlzLnJhdGlvcywgaW5mby5yYXRpbyk7XG5cbiAgICAgICAgLy8gb25seSBpZ25vcmUgd2hlbiB0aW1lIG5vdCBvbiBhIGZyYW1lIGluZGV4XG4gICAgICAgIGlmIChmcmFtZUluZGV4IDwgMCkge1xuICAgICAgICAgICAgZnJhbWVJbmRleCA9IH5mcmFtZUluZGV4IC0gMTtcblxuICAgICAgICAgICAgLy8gaWYgZGlyZWN0aW9uIGlzIGludmVyc2UsIHRoZW4gaW5jcmVhc2UgaW5kZXhcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPCAwKSBmcmFtZUluZGV4ICs9IDE7XG5cbiAgICAgICAgICAgIHRoaXMuX2lnbm9yZUluZGV4ID0gZnJhbWVJbmRleDtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5cbmlmIChDQ19URVNUKSB7XG4gICAgY2MuX1Rlc3QuRHluYW1pY0FuaW1DdXJ2ZSA9IER5bmFtaWNBbmltQ3VydmU7XG4gICAgY2MuX1Rlc3QuRXZlbnRBbmltQ3VydmUgPSBFdmVudEFuaW1DdXJ2ZTtcbiAgICBjYy5fVGVzdC5xdWlja0ZpbmRJbmRleCA9IHF1aWNrRmluZEluZGV4O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBBbmltQ3VydmU6IEFuaW1DdXJ2ZSxcbiAgICBEeW5hbWljQW5pbUN1cnZlOiBEeW5hbWljQW5pbUN1cnZlLFxuICAgIEV2ZW50QW5pbUN1cnZlOiBFdmVudEFuaW1DdXJ2ZSxcbiAgICBFdmVudEluZm86IEV2ZW50SW5mbyxcbiAgICBjb21wdXRlUmF0aW9CeVR5cGU6IGNvbXB1dGVSYXRpb0J5VHlwZSxcbiAgICBxdWlja0ZpbmRJbmRleDogcXVpY2tGaW5kSW5kZXhcbn07XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==