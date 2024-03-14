
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/particle/particle-system-assembler.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _assembler = _interopRequireDefault(require("../core/renderer/assembler"));

var _inputAssembler = _interopRequireDefault(require("../renderer/core/input-assembler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ParticleSystem = require('./CCParticleSystem');

var renderer = require('../core/renderer/');

var QuadBuffer = require('../core/renderer/webgl/quad-buffer');

var vfmtPosUvColor = require('../core/renderer/webgl/vertex-format').vfmtPosUvColor;

var ParticleAssembler = /*#__PURE__*/function (_Assembler) {
  _inheritsLoose(ParticleAssembler, _Assembler);

  function ParticleAssembler(comp) {
    var _this;

    _this = _Assembler.call(this, comp) || this;
    _this._buffer = null;
    _this._ia = null;
    _this._vfmt = vfmtPosUvColor;
    return _this;
  }

  var _proto = ParticleAssembler.prototype;

  _proto.getBuffer = function getBuffer() {
    if (!this._buffer) {
      // Create quad buffer for vertex and index
      this._buffer = new QuadBuffer(renderer._handle, vfmtPosUvColor);
      this._ia = new _inputAssembler["default"]();
      this._ia._vertexBuffer = this._buffer._vb;
      this._ia._indexBuffer = this._buffer._ib;
      this._ia._start = 0;
      this._ia._count = 0;
    }

    return this._buffer;
  };

  _proto.fillBuffers = function fillBuffers(comp, renderer) {
    if (!this._ia) return;
    var PositionType = cc.ParticleSystem.PositionType;

    if (comp.positionType === PositionType.RELATIVE) {
      renderer.node = comp.node.parent;
    } else {
      renderer.node = comp.node;
    }

    renderer.material = comp._materials[0];

    renderer._flushIA(this._ia);
  };

  return ParticleAssembler;
}(_assembler["default"]);

_assembler["default"].register(ParticleSystem, ParticleAssembler);

module.exports = ParticleAssembler;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9wYXJ0aWNsZS9wYXJ0aWNsZS1zeXN0ZW0tYXNzZW1ibGVyLmpzIl0sIm5hbWVzIjpbIlBhcnRpY2xlU3lzdGVtIiwicmVxdWlyZSIsInJlbmRlcmVyIiwiUXVhZEJ1ZmZlciIsInZmbXRQb3NVdkNvbG9yIiwiUGFydGljbGVBc3NlbWJsZXIiLCJjb21wIiwiX2J1ZmZlciIsIl9pYSIsIl92Zm10IiwiZ2V0QnVmZmVyIiwiX2hhbmRsZSIsIklucHV0QXNzZW1ibGVyIiwiX3ZlcnRleEJ1ZmZlciIsIl92YiIsIl9pbmRleEJ1ZmZlciIsIl9pYiIsIl9zdGFydCIsIl9jb3VudCIsImZpbGxCdWZmZXJzIiwiUG9zaXRpb25UeXBlIiwiY2MiLCJwb3NpdGlvblR5cGUiLCJSRUxBVElWRSIsIm5vZGUiLCJwYXJlbnQiLCJtYXRlcmlhbCIsIl9tYXRlcmlhbHMiLCJfZmx1c2hJQSIsIkFzc2VtYmxlciIsInJlZ2lzdGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQXlCQTs7QUFPQTs7Ozs7Ozs7QUFMQSxJQUFNQSxjQUFjLEdBQUdDLE9BQU8sQ0FBQyxvQkFBRCxDQUE5Qjs7QUFDQSxJQUFNQyxRQUFRLEdBQUdELE9BQU8sQ0FBQyxtQkFBRCxDQUF4Qjs7QUFDQSxJQUFNRSxVQUFVLEdBQUdGLE9BQU8sQ0FBQyxvQ0FBRCxDQUExQjs7QUFDQSxJQUFNRyxjQUFjLEdBQUdILE9BQU8sQ0FBQyxzQ0FBRCxDQUFQLENBQWdERyxjQUF2RTs7SUFJTUM7OztBQUNGLDZCQUFhQyxJQUFiLEVBQW1CO0FBQUE7O0FBQ2Ysa0NBQU1BLElBQU47QUFFQSxVQUFLQyxPQUFMLEdBQWUsSUFBZjtBQUNBLFVBQUtDLEdBQUwsR0FBVyxJQUFYO0FBRUEsVUFBS0MsS0FBTCxHQUFhTCxjQUFiO0FBTmU7QUFPbEI7Ozs7U0FFRE0sWUFBQSxxQkFBYTtBQUNULFFBQUksQ0FBQyxLQUFLSCxPQUFWLEVBQW1CO0FBQ2Y7QUFDQSxXQUFLQSxPQUFMLEdBQWUsSUFBSUosVUFBSixDQUFlRCxRQUFRLENBQUNTLE9BQXhCLEVBQWlDUCxjQUFqQyxDQUFmO0FBRUEsV0FBS0ksR0FBTCxHQUFXLElBQUlJLDBCQUFKLEVBQVg7QUFDQSxXQUFLSixHQUFMLENBQVNLLGFBQVQsR0FBeUIsS0FBS04sT0FBTCxDQUFhTyxHQUF0QztBQUNBLFdBQUtOLEdBQUwsQ0FBU08sWUFBVCxHQUF3QixLQUFLUixPQUFMLENBQWFTLEdBQXJDO0FBQ0EsV0FBS1IsR0FBTCxDQUFTUyxNQUFULEdBQWtCLENBQWxCO0FBQ0EsV0FBS1QsR0FBTCxDQUFTVSxNQUFULEdBQWtCLENBQWxCO0FBQ0g7O0FBQ0QsV0FBTyxLQUFLWCxPQUFaO0FBQ0g7O1NBRURZLGNBQUEscUJBQWFiLElBQWIsRUFBbUJKLFFBQW5CLEVBQTZCO0FBQ3pCLFFBQUksQ0FBQyxLQUFLTSxHQUFWLEVBQWU7QUFFZixRQUFNWSxZQUFZLEdBQUdDLEVBQUUsQ0FBQ3JCLGNBQUgsQ0FBa0JvQixZQUF2Qzs7QUFDQSxRQUFJZCxJQUFJLENBQUNnQixZQUFMLEtBQXNCRixZQUFZLENBQUNHLFFBQXZDLEVBQWlEO0FBQzdDckIsTUFBQUEsUUFBUSxDQUFDc0IsSUFBVCxHQUFnQmxCLElBQUksQ0FBQ2tCLElBQUwsQ0FBVUMsTUFBMUI7QUFDSCxLQUZELE1BRU87QUFDSHZCLE1BQUFBLFFBQVEsQ0FBQ3NCLElBQVQsR0FBZ0JsQixJQUFJLENBQUNrQixJQUFyQjtBQUNIOztBQUNEdEIsSUFBQUEsUUFBUSxDQUFDd0IsUUFBVCxHQUFvQnBCLElBQUksQ0FBQ3FCLFVBQUwsQ0FBZ0IsQ0FBaEIsQ0FBcEI7O0FBQ0F6QixJQUFBQSxRQUFRLENBQUMwQixRQUFULENBQWtCLEtBQUtwQixHQUF2QjtBQUNIOzs7RUFuQzJCcUI7O0FBc0NoQ0Esc0JBQVVDLFFBQVYsQ0FBbUI5QixjQUFuQixFQUFtQ0ssaUJBQW5DOztBQUVBMEIsTUFBTSxDQUFDQyxPQUFQLEdBQWlCM0IsaUJBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCAgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBDaHVrb25nIEFpcHUgcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IEFzc2VtYmxlciBmcm9tICcuLi9jb3JlL3JlbmRlcmVyL2Fzc2VtYmxlcic7XG4gXG5jb25zdCBQYXJ0aWNsZVN5c3RlbSA9IHJlcXVpcmUoJy4vQ0NQYXJ0aWNsZVN5c3RlbScpO1xuY29uc3QgcmVuZGVyZXIgPSByZXF1aXJlKCcuLi9jb3JlL3JlbmRlcmVyLycpO1xuY29uc3QgUXVhZEJ1ZmZlciA9IHJlcXVpcmUoJy4uL2NvcmUvcmVuZGVyZXIvd2ViZ2wvcXVhZC1idWZmZXInKTtcbmNvbnN0IHZmbXRQb3NVdkNvbG9yID0gcmVxdWlyZSgnLi4vY29yZS9yZW5kZXJlci93ZWJnbC92ZXJ0ZXgtZm9ybWF0JykudmZtdFBvc1V2Q29sb3I7XG5cbmltcG9ydCBJbnB1dEFzc2VtYmxlciBmcm9tICcuLi9yZW5kZXJlci9jb3JlL2lucHV0LWFzc2VtYmxlcic7XG5cbmNsYXNzIFBhcnRpY2xlQXNzZW1ibGVyIGV4dGVuZHMgQXNzZW1ibGVyIHtcbiAgICBjb25zdHJ1Y3RvciAoY29tcCkge1xuICAgICAgICBzdXBlcihjb21wKTtcblxuICAgICAgICB0aGlzLl9idWZmZXIgPSBudWxsO1xuICAgICAgICB0aGlzLl9pYSA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5fdmZtdCA9IHZmbXRQb3NVdkNvbG9yO1xuICAgIH1cblxuICAgIGdldEJ1ZmZlciAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fYnVmZmVyKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgcXVhZCBidWZmZXIgZm9yIHZlcnRleCBhbmQgaW5kZXhcbiAgICAgICAgICAgIHRoaXMuX2J1ZmZlciA9IG5ldyBRdWFkQnVmZmVyKHJlbmRlcmVyLl9oYW5kbGUsIHZmbXRQb3NVdkNvbG9yKTtcblxuICAgICAgICAgICAgdGhpcy5faWEgPSBuZXcgSW5wdXRBc3NlbWJsZXIoKTtcbiAgICAgICAgICAgIHRoaXMuX2lhLl92ZXJ0ZXhCdWZmZXIgPSB0aGlzLl9idWZmZXIuX3ZiO1xuICAgICAgICAgICAgdGhpcy5faWEuX2luZGV4QnVmZmVyID0gdGhpcy5fYnVmZmVyLl9pYjtcbiAgICAgICAgICAgIHRoaXMuX2lhLl9zdGFydCA9IDA7XG4gICAgICAgICAgICB0aGlzLl9pYS5fY291bnQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9idWZmZXI7XG4gICAgfVxuICAgIFxuICAgIGZpbGxCdWZmZXJzIChjb21wLCByZW5kZXJlcikge1xuICAgICAgICBpZiAoIXRoaXMuX2lhKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICBjb25zdCBQb3NpdGlvblR5cGUgPSBjYy5QYXJ0aWNsZVN5c3RlbS5Qb3NpdGlvblR5cGU7XG4gICAgICAgIGlmIChjb21wLnBvc2l0aW9uVHlwZSA9PT0gUG9zaXRpb25UeXBlLlJFTEFUSVZFKSB7XG4gICAgICAgICAgICByZW5kZXJlci5ub2RlID0gY29tcC5ub2RlLnBhcmVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlbmRlcmVyLm5vZGUgPSBjb21wLm5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgcmVuZGVyZXIubWF0ZXJpYWwgPSBjb21wLl9tYXRlcmlhbHNbMF07XG4gICAgICAgIHJlbmRlcmVyLl9mbHVzaElBKHRoaXMuX2lhKTtcbiAgICB9XG59XG5cbkFzc2VtYmxlci5yZWdpc3RlcihQYXJ0aWNsZVN5c3RlbSwgUGFydGljbGVBc3NlbWJsZXIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhcnRpY2xlQXNzZW1ibGVyOyJdLCJzb3VyY2VSb290IjoiLyJ9