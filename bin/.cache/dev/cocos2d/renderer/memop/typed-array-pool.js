
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/memop/typed-array-pool.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _bufferPools = Array(8);

for (var i = 0; i < 8; ++i) {
  _bufferPools[i] = [];
}

function _nextPow16(v) {
  for (var _i = 16; _i <= 1 << 28; _i *= 16) {
    if (v <= _i) {
      return _i;
    }
  }

  return 0;
}

function _log2(v) {
  var r, shift;
  r = (v > 0xFFFF) << 4;
  v >>>= r;
  shift = (v > 0xFF) << 3;
  v >>>= shift;
  r |= shift;
  shift = (v > 0xF) << 2;
  v >>>= shift;
  r |= shift;
  shift = (v > 0x3) << 1;
  v >>>= shift;
  r |= shift;
  return r | v >> 1;
}

function _alloc(n) {
  var sz = _nextPow16(n);

  var bin = _bufferPools[_log2(sz) >> 2];

  if (bin.length > 0) {
    return bin.pop();
  }

  return new ArrayBuffer(sz);
}

function _free(buf) {
  _bufferPools[_log2(buf.byteLength) >> 2].push(buf);
}

var _default = {
  alloc_int8: function alloc_int8(n) {
    var result = new Int8Array(_alloc(n), 0, n);

    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },
  alloc_uint8: function alloc_uint8(n) {
    var result = new Uint8Array(_alloc(n), 0, n);

    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },
  alloc_int16: function alloc_int16(n) {
    var result = new Int16Array(_alloc(2 * n), 0, n);

    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },
  alloc_uint16: function alloc_uint16(n) {
    var result = new Uint16Array(_alloc(2 * n), 0, n);

    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },
  alloc_int32: function alloc_int32(n) {
    var result = new Int32Array(_alloc(4 * n), 0, n);

    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },
  alloc_uint32: function alloc_uint32(n) {
    var result = new Uint32Array(_alloc(4 * n), 0, n);

    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },
  alloc_float32: function alloc_float32(n) {
    var result = new Float32Array(_alloc(4 * n), 0, n);

    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },
  alloc_float64: function alloc_float64(n) {
    var result = new Float64Array(_alloc(8 * n), 0, n);

    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },
  alloc_dataview: function alloc_dataview(n) {
    var result = new DataView(_alloc(n), 0, n);

    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },
  free: function free(array) {
    _free(array.buffer);
  },
  reset: function reset() {
    var _bufferPools = Array(8);

    for (var _i2 = 0; _i2 < 8; ++_i2) {
      _bufferPools[_i2] = [];
    }
  }
};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9yZW5kZXJlci9tZW1vcC90eXBlZC1hcnJheS1wb29sLmpzIl0sIm5hbWVzIjpbIl9idWZmZXJQb29scyIsIkFycmF5IiwiaSIsIl9uZXh0UG93MTYiLCJ2IiwiX2xvZzIiLCJyIiwic2hpZnQiLCJfYWxsb2MiLCJuIiwic3oiLCJiaW4iLCJsZW5ndGgiLCJwb3AiLCJBcnJheUJ1ZmZlciIsIl9mcmVlIiwiYnVmIiwiYnl0ZUxlbmd0aCIsInB1c2giLCJhbGxvY19pbnQ4IiwicmVzdWx0IiwiSW50OEFycmF5Iiwic3ViYXJyYXkiLCJhbGxvY191aW50OCIsIlVpbnQ4QXJyYXkiLCJhbGxvY19pbnQxNiIsIkludDE2QXJyYXkiLCJhbGxvY191aW50MTYiLCJVaW50MTZBcnJheSIsImFsbG9jX2ludDMyIiwiSW50MzJBcnJheSIsImFsbG9jX3VpbnQzMiIsIlVpbnQzMkFycmF5IiwiYWxsb2NfZmxvYXQzMiIsIkZsb2F0MzJBcnJheSIsImFsbG9jX2Zsb2F0NjQiLCJGbG9hdDY0QXJyYXkiLCJhbGxvY19kYXRhdmlldyIsIkRhdGFWaWV3IiwiZnJlZSIsImFycmF5IiwiYnVmZmVyIiwicmVzZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxZQUFZLEdBQUdDLEtBQUssQ0FBQyxDQUFELENBQXhCOztBQUNBLEtBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxDQUFwQixFQUF1QixFQUFFQSxDQUF6QixFQUE0QjtBQUMxQkYsRUFBQUEsWUFBWSxDQUFDRSxDQUFELENBQVosR0FBa0IsRUFBbEI7QUFDRDs7QUFFRCxTQUFTQyxVQUFULENBQW9CQyxDQUFwQixFQUF1QjtBQUNyQixPQUFLLElBQUlGLEVBQUMsR0FBRyxFQUFiLEVBQWlCQSxFQUFDLElBQUssS0FBSyxFQUE1QixFQUFpQ0EsRUFBQyxJQUFJLEVBQXRDLEVBQTBDO0FBQ3hDLFFBQUlFLENBQUMsSUFBSUYsRUFB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LENBQUMsQ0FBRCxDQUF4Qjs7QUFDQSxTQUFLLElBQUlDLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLEdBQUcsQ0FBcEIsRUFBdUIsRUFBRUEsR0FBekIsRUFBNEI7QUFDMUJGLE1BQUFBLFlBQVksQ0FBQ0UsR0FBRCxDQUFaLEdBQWtCLEVBQWxCO0FBQ0Q7QUFDRjtBQTNGWSIsInNvdXJjZXNDb250ZW50IjpbImxldCBfYnVmZmVyUG9vbHMgPSBBcnJheSg4KTtcbmZvciAobGV0IGkgPSAwOyBpIDwgODsgKytpKSB7XG4gIF9idWZmZXJQb29sc1tpXSA9IFtdO1xufVxuXG5mdW5jdGlvbiBfbmV4dFBvdzE2KHYpIHtcbiAgZm9yIChsZXQgaSA9IDE2OyBpIDw9ICgxIDw8IDI4KTsgaSAqPSAxNikge1xuICAgIGlmICh2IDw9IGkpIHtcbiAgICAgIHJldHVybiBpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gMDtcbn1cblxuZnVuY3Rpb24gX2xvZzIodikge1xuICBsZXQgciwgc2hpZnQ7XG4gIHIgPSAodiA+IDB4RkZGRikgPDwgNDsgdiA+Pj49IHI7XG4gIHNoaWZ0ID0gKHYgPiAweEZGKSA8PCAzOyB2ID4+Pj0gc2hpZnQ7IHIgfD0gc2hpZnQ7XG4gIHNoaWZ0ID0gKHYgPiAweEYpIDw8IDI7IHYgPj4+PSBzaGlmdDsgciB8PSBzaGlmdDtcbiAgc2hpZnQgPSAodiA+IDB4MykgPDwgMTsgdiA+Pj49IHNoaWZ0OyByIHw9IHNoaWZ0O1xuICByZXR1cm4gciB8ICh2ID4+IDEpO1xufVxuXG5mdW5jdGlvbiBfYWxsb2Mobikge1xuICBsZXQgc3ogPSBfbmV4dFBvdzE2KG4pO1xuICBsZXQgYmluID0gX2J1ZmZlclBvb2xzW19sb2cyKHN6KSA+PiAyXTtcbiAgaWYgKGJpbi5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIGJpbi5wb3AoKTtcbiAgfVxuICByZXR1cm4gbmV3IEFycmF5QnVmZmVyKHN6KTtcbn1cblxuZnVuY3Rpb24gX2ZyZWUoYnVmKSB7XG4gIF9idWZmZXJQb29sc1tfbG9nMihidWYuYnl0ZUxlbmd0aCkgPj4gMl0ucHVzaChidWYpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFsbG9jX2ludDgobikge1xuICAgIGxldCByZXN1bHQgPSBuZXcgSW50OEFycmF5KF9hbGxvYyhuKSwgMCwgbik7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGggIT09IG4pIHtcbiAgICAgIHJldHVybiByZXN1bHQuc3ViYXJyYXkoMCwgbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcblxuICBhbGxvY191aW50OChuKSB7XG4gICAgbGV0IHJlc3VsdCA9IG5ldyBVaW50OEFycmF5KF9hbGxvYyhuKSwgMCwgbik7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGggIT09IG4pIHtcbiAgICAgIHJldHVybiByZXN1bHQuc3ViYXJyYXkoMCwgbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcblxuICBhbGxvY19pbnQxNihuKSB7XG4gICAgbGV0IHJlc3VsdCA9IG5ldyBJbnQxNkFycmF5KF9hbGxvYygyICogbiksIDAsIG4pO1xuICAgIGlmIChyZXN1bHQubGVuZ3RoICE9PSBuKSB7XG4gICAgICByZXR1cm4gcmVzdWx0LnN1YmFycmF5KDAsIG4pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG5cbiAgYWxsb2NfdWludDE2KG4pIHtcbiAgICBsZXQgcmVzdWx0ID0gbmV3IFVpbnQxNkFycmF5KF9hbGxvYygyICogbiksIDAsIG4pO1xuICAgIGlmIChyZXN1bHQubGVuZ3RoICE9PSBuKSB7XG4gICAgICByZXR1cm4gcmVzdWx0LnN1YmFycmF5KDAsIG4pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG5cbiAgYWxsb2NfaW50MzIobikge1xuICAgIGxldCByZXN1bHQgPSBuZXcgSW50MzJBcnJheShfYWxsb2MoNCAqIG4pLCAwLCBuKTtcbiAgICBpZiAocmVzdWx0Lmxlbmd0aCAhPT0gbikge1xuICAgICAgcmV0dXJuIHJlc3VsdC5zdWJhcnJheSgwLCBuKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuXG4gIGFsbG9jX3VpbnQzMihuKSB7XG4gICAgbGV0IHJlc3VsdCA9IG5ldyBVaW50MzJBcnJheShfYWxsb2MoNCAqIG4pLCAwLCBuKTtcbiAgICBpZiAocmVzdWx0Lmxlbmd0aCAhPT0gbikge1xuICAgICAgcmV0dXJuIHJlc3VsdC5zdWJhcnJheSgwLCBuKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuXG4gIGFsbG9jX2Zsb2F0MzIobikge1xuICAgIGxldCByZXN1bHQgPSBuZXcgRmxvYXQzMkFycmF5KF9hbGxvYyg0ICogbiksIDAsIG4pO1xuICAgIGlmIChyZXN1bHQubGVuZ3RoICE9PSBuKSB7XG4gICAgICByZXR1cm4gcmVzdWx0LnN1YmFycmF5KDAsIG4pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG5cbiAgYWxsb2NfZmxvYXQ2NChuKSB7XG4gICAgbGV0IHJlc3VsdCA9IG5ldyBGbG9hdDY0QXJyYXkoX2FsbG9jKDggKiBuKSwgMCwgbik7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGggIT09IG4pIHtcbiAgICAgIHJldHVybiByZXN1bHQuc3ViYXJyYXkoMCwgbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcblxuICBhbGxvY19kYXRhdmlldyhuKSB7XG4gICAgbGV0IHJlc3VsdCA9IG5ldyBEYXRhVmlldyhfYWxsb2MobiksIDAsIG4pO1xuICAgIGlmIChyZXN1bHQubGVuZ3RoICE9PSBuKSB7XG4gICAgICByZXR1cm4gcmVzdWx0LnN1YmFycmF5KDAsIG4pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG5cbiAgZnJlZShhcnJheSkge1xuICAgIF9mcmVlKGFycmF5LmJ1ZmZlcik7XG4gIH0sXG5cbiAgcmVzZXQoKSB7XG4gICAgbGV0IF9idWZmZXJQb29scyA9IEFycmF5KDgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgODsgKytpKSB7XG4gICAgICBfYnVmZmVyUG9vbHNbaV0gPSBbXTtcbiAgICB9XG4gIH0sXG59OyJdLCJzb3VyY2VSb290IjoiLyJ9