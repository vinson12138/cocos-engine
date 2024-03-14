
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/primitive/torus.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}'use strict';

exports.__esModule = true;
exports["default"] = _default;

var _vertexData = _interopRequireDefault(require("./vertex-data"));

var _valueTypes = require("../../value-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @param {Number} radius
 * @param {Number} tube
 * @param {Object} opts
 * @param {Number} opts.radialSegments
 * @param {Number} opts.tubularSegments
 * @param {Number} opts.arc
 */
function _default(radius, tube, opts) {
  if (radius === void 0) {
    radius = 0.4;
  }

  if (tube === void 0) {
    tube = 0.1;
  }

  if (opts === void 0) {
    opts = {
      radialSegments: 32,
      tubularSegments: 32,
      arc: 2.0 * Math.PI
    };
  }

  var radialSegments = opts.radialSegments;
  var tubularSegments = opts.tubularSegments;
  var arc = opts.arc;
  var positions = [];
  var normals = [];
  var uvs = [];
  var indices = [];
  var minPos = new _valueTypes.Vec3(-radius - tube, -tube, -radius - tube);
  var maxPos = new _valueTypes.Vec3(radius + tube, tube, radius + tube);
  var boundingRadius = radius + tube;

  for (var j = 0; j <= radialSegments; j++) {
    for (var i = 0; i <= tubularSegments; i++) {
      var u = i / tubularSegments;
      var v = j / radialSegments;
      var u1 = u * arc;
      var v1 = v * Math.PI * 2; // vertex

      var x = (radius + tube * Math.cos(v1)) * Math.sin(u1);
      var y = tube * Math.sin(v1);
      var z = (radius + tube * Math.cos(v1)) * Math.cos(u1); // this vector is used to calculate the normal

      var nx = Math.sin(u1) * Math.cos(v1);
      var ny = Math.sin(v1);
      var nz = Math.cos(u1) * Math.cos(v1);
      positions.push(x, y, z);
      normals.push(nx, ny, nz);
      uvs.push(u, v);

      if (i < tubularSegments && j < radialSegments) {
        var seg1 = tubularSegments + 1;
        var a = seg1 * j + i;
        var b = seg1 * (j + 1) + i;
        var c = seg1 * (j + 1) + i + 1;
        var d = seg1 * j + i + 1;
        indices.push(a, d, b);
        indices.push(d, c, b);
      }
    }
  }

  return new _vertexData["default"](positions, normals, uvs, indices, minPos, maxPos, boundingRadius);
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3ByaW1pdGl2ZS90b3J1cy50cyJdLCJuYW1lcyI6WyJyYWRpdXMiLCJ0dWJlIiwib3B0cyIsInJhZGlhbFNlZ21lbnRzIiwidHVidWxhclNlZ21lbnRzIiwiYXJjIiwiTWF0aCIsIlBJIiwicG9zaXRpb25zIiwibm9ybWFscyIsInV2cyIsImluZGljZXMiLCJtaW5Qb3MiLCJWZWMzIiwibWF4UG9zIiwiYm91bmRpbmdSYWRpdXMiLCJqIiwiaSIsInUiLCJ2IiwidTEiLCJ2MSIsIngiLCJjb3MiLCJzaW4iLCJ5IiwieiIsIm54IiwibnkiLCJueiIsInB1c2giLCJzZWcxIiwiYSIsImIiLCJjIiwiZCIsIlZlcnRleERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7O0FBRUE7O0FBQ0E7Ozs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2Usa0JBQVVBLE1BQVYsRUFBd0JDLElBQXhCLEVBQW9DQyxJQUFwQyxFQUEwRztBQUFBLE1BQWhHRixNQUFnRztBQUFoR0EsSUFBQUEsTUFBZ0csR0FBdkYsR0FBdUY7QUFBQTs7QUFBQSxNQUFsRkMsSUFBa0Y7QUFBbEZBLElBQUFBLElBQWtGLEdBQTNFLEdBQTJFO0FBQUE7O0FBQUEsTUFBdEVDLElBQXNFO0FBQXRFQSxJQUFBQSxJQUFzRSxHQUEvRDtBQUFDQyxNQUFBQSxjQUFjLEVBQUUsRUFBakI7QUFBcUJDLE1BQUFBLGVBQWUsRUFBRSxFQUF0QztBQUEwQ0MsTUFBQUEsR0FBRyxFQUFFLE1BQU1DLElBQUksQ0FBQ0M7QUFBMUQsS0FBK0Q7QUFBQTs7QUFDdkgsTUFBSUosY0FBYyxHQUFHRCxJQUFJLENBQUNDLGNBQTFCO0FBQ0EsTUFBSUMsZUFBZSxHQUFHRixJQUFJLENBQUNFLGVBQTNCO0FBQ0EsTUFBSUMsR0FBRyxHQUFHSCxJQUFJLENBQUNHLEdBQWY7QUFFQSxNQUFJRyxTQUFtQixHQUFHLEVBQTFCO0FBQ0Es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T0FBTyxDQUFDbUIsSUFBUixDQUFhRSxDQUFiLEVBQWdCRyxDQUFoQixFQUFtQkYsQ0FBbkI7QUFDQXRCLFFBQUFBLE9BQU8sQ0FBQ21CLElBQVIsQ0FBYUssQ0FBYixFQUFnQkQsQ0FBaEIsRUFBbUJELENBQW5CO0FBQ0Q7QUFDRjtBQUNGOztBQUVELFNBQU8sSUFBSUcsc0JBQUosQ0FDTDVCLFNBREssRUFFTEMsT0FGSyxFQUdMQyxHQUhLLEVBSUxDLE9BSkssRUFLTEMsTUFMSyxFQU1MRSxNQU5LLEVBT0xDLGNBUEssQ0FBUDtBQVNEIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgVmVydGV4RGF0YSBmcm9tICcuL3ZlcnRleC1kYXRhJztcbmltcG9ydCB7IFZlYzMgfSBmcm9tICcuLi8uLi92YWx1ZS10eXBlcyc7XG5cbi8qKlxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1c1xuICogQHBhcmFtIHtOdW1iZXJ9IHR1YmVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0cy5yYWRpYWxTZWdtZW50c1xuICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMudHVidWxhclNlZ21lbnRzXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0cy5hcmNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHJhZGl1cyA9IDAuNCwgdHViZSA9IDAuMSwgb3B0cyA9IHtyYWRpYWxTZWdtZW50czogMzIsIHR1YnVsYXJTZWdtZW50czogMzIsIGFyYzogMi4wICogTWF0aC5QSX0pIHtcbiAgbGV0IHJhZGlhbFNlZ21lbnRzID0gb3B0cy5yYWRpYWxTZWdtZW50cztcbiAgbGV0IHR1YnVsYXJTZWdtZW50cyA9IG9wdHMudHVidWxhclNlZ21lbnRzO1xuICBsZXQgYXJjID0gb3B0cy5hcmM7XG5cbiAgbGV0IHBvc2l0aW9uczogbnVtYmVyW10gPSBbXTtcbiAgbGV0IG5vcm1hbHM6IG51bWJlcltdID0gW107XG4gIGxldCB1dnM6IG51bWJlcltdID0gW107XG4gIGxldCBpbmRpY2VzOiBudW1iZXJbXSA9IFtdO1xuICBsZXQgbWluUG9zID0gbmV3IFZlYzMoLXJhZGl1cyAtIHR1YmUsIC10dWJlLCAtcmFkaXVzIC0gdHViZSk7XG4gIGxldCBtYXhQb3MgPSBuZXcgVmVjMyhyYWRpdXMgKyB0dWJlLCB0dWJlLCByYWRpdXMgKyB0dWJlKTtcbiAgbGV0IGJvdW5kaW5nUmFkaXVzID0gcmFkaXVzICsgdHViZTtcblxuICBmb3IgKGxldCBqID0gMDsgaiA8PSByYWRpYWxTZWdtZW50czsgaisrKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gdHVidWxhclNlZ21lbnRzOyBpKyspIHtcbiAgICAgIGxldCB1ID0gaSAvIHR1YnVsYXJTZWdtZW50cztcbiAgICAgIGxldCB2ID0gaiAvIHJhZGlhbFNlZ21lbnRzO1xuXG4gICAgICBsZXQgdTEgPSB1ICogYXJjO1xuICAgICAgbGV0IHYxID0gdiAqIE1hdGguUEkgKiAyO1xuXG4gICAgICAvLyB2ZXJ0ZXhcbiAgICAgIGxldCB4ID0gKHJhZGl1cyArIHR1YmUgKiBNYXRoLmNvcyh2MSkpICogTWF0aC5zaW4odTEpO1xuICAgICAgbGV0IHkgPSB0dWJlICogTWF0aC5zaW4odjEpO1xuICAgICAgbGV0IHogPSAocmFkaXVzICsgdHViZSAqIE1hdGguY29zKHYxKSkgKiBNYXRoLmNvcyh1MSk7XG5cbiAgICAgIC8vIHRoaXMgdmVjdG9yIGlzIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSBub3JtYWxcbiAgICAgIGxldCBueCA9IE1hdGguc2luKHUxKSAqIE1hdGguY29zKHYxKTtcbiAgICAgIGxldCBueSA9IE1hdGguc2luKHYxKTtcbiAgICAgIGxldCBueiA9IE1hdGguY29zKHUxKSAqIE1hdGguY29zKHYxKTtcblxuICAgICAgcG9zaXRpb25zLnB1c2goeCwgeSwgeik7XG4gICAgICBub3JtYWxzLnB1c2gobngsIG55LCBueik7XG4gICAgICB1dnMucHVzaCh1LCB2KTtcblxuICAgICAgaWYgKChpIDwgdHVidWxhclNlZ21lbnRzKSAmJiAoaiA8IHJhZGlhbFNlZ21lbnRzKSkge1xuICAgICAgICBsZXQgc2VnMSA9IHR1YnVsYXJTZWdtZW50cyArIDE7XG4gICAgICAgIGxldCBhID0gc2VnMSAqIGogKyBpO1xuICAgICAgICBsZXQgYiA9IHNlZzEgKiAoaiArIDEpICsgaTtcbiAgICAgICAgbGV0IGMgPSBzZWcxICogKGogKyAxKSArIGkgKyAxO1xuICAgICAgICBsZXQgZCA9IHNlZzEgKiBqICsgaSArIDE7XG5cbiAgICAgICAgaW5kaWNlcy5wdXNoKGEsIGQsIGIpO1xuICAgICAgICBpbmRpY2VzLnB1c2goZCwgYywgYik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBWZXJ0ZXhEYXRhKFxuICAgIHBvc2l0aW9ucyxcbiAgICBub3JtYWxzLFxuICAgIHV2cyxcbiAgICBpbmRpY2VzLFxuICAgIG1pblBvcyxcbiAgICBtYXhQb3MsXG4gICAgYm91bmRpbmdSYWRpdXNcbiAgKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiLyJ9