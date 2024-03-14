
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/primitive/sphere.js';
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
 * @param {Object} opts
 * @param {Number} opts.segments
 */
function _default(radius, opts) {
  if (radius === void 0) {
    radius = 0.5;
  }

  if (opts === void 0) {
    opts = {
      segments: 32
    };
  }

  var segments = opts.segments; // lat === latitude
  // lon === longitude

  var positions = [];
  var normals = [];
  var uvs = [];
  var indices = [];
  var minPos = new _valueTypes.Vec3(-radius, -radius, -radius);
  var maxPos = new _valueTypes.Vec3(radius, radius, radius);
  var boundingRadius = radius;

  for (var lat = 0; lat <= segments; ++lat) {
    var theta = lat * Math.PI / segments;
    var sinTheta = Math.sin(theta);
    var cosTheta = -Math.cos(theta);

    for (var lon = 0; lon <= segments; ++lon) {
      var phi = lon * 2 * Math.PI / segments - Math.PI / 2.0;
      var sinPhi = Math.sin(phi);
      var cosPhi = Math.cos(phi);
      var x = sinPhi * sinTheta;
      var y = cosTheta;
      var z = cosPhi * sinTheta;
      var u = lon / segments;
      var v = lat / segments;
      positions.push(x * radius, y * radius, z * radius);
      normals.push(x, y, z);
      uvs.push(u, v);

      if (lat < segments && lon < segments) {
        var seg1 = segments + 1;
        var a = seg1 * lat + lon;
        var b = seg1 * (lat + 1) + lon;
        var c = seg1 * (lat + 1) + lon + 1;
        var d = seg1 * lat + lon + 1;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3ByaW1pdGl2ZS9zcGhlcmUudHMiXSwibmFtZXMiOlsicmFkaXVzIiwib3B0cyIsInNlZ21lbnRzIiwicG9zaXRpb25zIiwibm9ybWFscyIsInV2cyIsImluZGljZXMiLCJtaW5Qb3MiLCJWZWMzIiwibWF4UG9zIiwiYm91bmRpbmdSYWRpdXMiLCJsYXQiLCJ0aGV0YSIsIk1hdGgiLCJQSSIsInNpblRoZXRhIiwic2luIiwiY29zVGhldGEiLCJjb3MiLCJsb24iLCJwaGkiLCJzaW5QaGkiLCJjb3NQaGkiLCJ4IiwieSIsInoiLCJ1IiwidiIsInB1c2giLCJzZWcxIiwiYSIsImIiLCJjIiwiZCIsIlZlcnRleERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7O0FBRUE7O0FBQ0E7Ozs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2Usa0JBQVVBLE1BQVYsRUFBd0JDLElBQXhCLEVBQStDO0FBQUEsTUFBckNELE1BQXFDO0FBQXJDQSxJQUFBQSxNQUFxQyxHQUE1QixHQUE0QjtBQUFBOztBQUFBLE1BQXZCQyxJQUF1QjtBQUF2QkEsSUFBQUEsSUFBdUIsR0FBaEI7QUFBQ0MsTUFBQUEsUUFBUSxFQUFFO0FBQVgsS0FBZ0I7QUFBQTs7QUFDNUQsTUFBSUEsUUFBUSxHQUFHRCxJQUFJLENBQUNDLFFBQXBCLENBRDRELENBRzVEO0FBQ0E7O0FBRUEsTUFBSUMsU0FBbUIsR0FBRyxFQUExQjtBQUNBLE1BQUlDLE9BQWlCLEdBQUcsRUFBeEI7QUFDQSxNQUFJQyxHQUFhLEdBQUcsRUFBcEI7QUFDQSxNQUFJQyxPQUFpQixHQUFHLEVBQXhCO0FBQ0EsTUFBSUMsTUFBTSxHQUFHLElBQUlDLGdCQUFKLENBQVMsQ0FBQ1IsTUFBVixFQUFrQixDQUFDQSxNQUFuQixFQUEyQixDQUFDQSxNQUE1QixDQUFiO0FBQ0EsTUFBSVMsTUFBTSxHQUFHLElBQUlELGdCQUFKLENBQVNSLE1BQVQsRUFBaUJBLE1BQWpCLEVBQXlCQSxNQUF6QixDQUFiO0FBQ0EsTUFBSVUsY0FBYyxHQUFHVixNQUFyQjs7QUFFQSxPQUFLLElBQUlXLEdBQUcsR0FBRyxDQUFmLEVBQWtCQSxHQUFHLElBQUlULFFBQXpCLEVBQW1DLEVBQUVTLEdBQXJDLEVBQTBDO0FBQ3hDLFFBQUlDLEtBQUssR0FBR0QsR0FBRyxHQUFHRSxJQUFJLENBQUNDLEVBQVgsR0FBZ0JaLFFBQTVCO0FBQ0EsUUFBSWEsUUFBUSxHQUFHRixJQUFJLENBQUNHLEdBQUwsQ0FBU0osS0FBVCxDQUFmO0FBQ0EsUUFBSUssUUFBUSxHQUFHLENBQUNKLElBQUksQ0FBQ0ssR0FBTCxDQUFTTixLQUFULENBQWhCOztBQUVBLFNBQUssSUFBSU8sR0FBRyxHQUFHLENBQWYsRUFBa0JBLEdBQUcsSUFBSWpCLFFBQXpCLEVBQW1DLEVBQUVpQixHQUFyQyxFQUEwQztBQUN4QyxVQUFJQyxHQUFHLEdBQUdELEdBQUcsR0FBRyxDQUFOLEdBQVVOLElBQUksQ0FBQ0MsRUFBZixHQUFvQlosUUFBcEIsR0FBK0JXLElBQUksQ0FBQ0MsRUFBTCxHQUFVLEdBQW5EO0FBQ0EsVUFBSU8sTUFBTSxHQUFHUixJQUFJLENBQUNHLEdBQUwsQ0FBU0ksR0FBVCxDQUFiO0FBQ0EsVUFBSUUsTUFBTSxHQUFHVCxJQUFJLENBQUNLLEdBQUwsQ0FBU0UsR0FBVCxDQUFiO0FBRUEsVUFBSUcsQ0FBQyxHQUFHRixNQUFNLEdBQUdOLFFBQWpCO0FBQ0EsVUFBSVMsQ0FBQyxHQUFHUCxRQUFSO0FBQ0EsVUFBSVEsQ0FBQyxHQUFHSCxNQUFNLEdBQUdQLFFBQWpCO0FBQ0EsVUFBSVcsQ0FBQyxHQUFHUCxHQUFHLEdBQUdqQixRQUFkO0FBQ0EsVUFBSXlCLENBQUMsR0FBR2hCLEdBQUcsR0FBR1QsUUFBZDtBQUVBQyxNQUFBQSxTQUFTLENBQUN5QixJQUFWLENBQWVMLENBQUMsR0FBR3ZCLE1BQW5CLEVBQTJCd0IsQ0FBQyxHQUFHeEIsTUFBL0IsRUFBdUN5QixDQUFDLEdBQUd6QixNQUEzQztBQUNBSSxNQUFBQSxPQUFPLENBQUN3QixJQUFSLENBQWFMLENBQWIsRUFBZ0JDLENBQWhCLEVBQW1CQyxDQUFuQjtBQUNBcEIsTUFBQUEsR0FBRyxDQUFDdUIsSUFBSixDQUFTRixDQUFULEVBQVlDLENBQVo7O0FBR0EsVUFBS2hCLEdBQUcsR0FBR1QsUUFBUCxJQUFxQmlCLEdBQUcsR0FBR2pCLFFBQS9CLEVBQTBDO0FBQ3hDLFlBQUkyQixJQUFJLEdBQUczQixRQUFRLEdBQUcsQ0FBdEI7QUFDQSxZQUFJNEIsQ0FBQyxHQUFHRCxJQUFJLEdBQUdsQixHQUFQLEdBQWFRLEdBQXJCO0FBQ0EsWUFBSVksQ0FBQyxHQUFHRixJQUFJLElBQUlsQixHQUFHLEdBQUcsQ0FBVixDQUFKLEdBQW1CUSxHQUEzQjtBQUNBLFlBQUlhLENBQUMsR0FBR0gsSUFBSSxJQUFJbEIsR0FBRyxHQUFHLENBQVYsQ0FBSixHQUFtQlEsR0FBbkIsR0FBeUIsQ0FBakM7QUFDQSxZQUFJYyxDQUFDLEdBQUdKLElBQUksR0FBR2xCLEdBQVAsR0FBYVEsR0FBYixHQUFtQixDQUEzQjtBQUVBYixRQUFBQSxPQUFPLENBQUNzQixJQUFSLENBQWFFLENBQWIsRUFBZ0JHLENBQWhCLEVBQW1CRixDQUFuQjtBQUNBekIsUUFBQUEsT0FBTyxDQUFDc0IsSUFBUixDQUFhSyxDQUFiLEVBQWdCRCxDQUFoQixFQUFtQkQsQ0FBbkI7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsU0FBTyxJQUFJRyxzQkFBSixDQUNML0IsU0FESyxFQUVMQyxPQUZLLEVBR0xDLEdBSEssRUFJTEMsT0FKSyxFQUtMQyxNQUxLLEVBTUxFLE1BTkssRUFPTEMsY0FQSyxDQUFQO0FBU0QiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBWZXJ0ZXhEYXRhIGZyb20gJy4vdmVydGV4LWRhdGEnO1xuaW1wb3J0IHsgVmVjMyB9IGZyb20gJy4uLy4uL3ZhbHVlLXR5cGVzJztcblxuLyoqXG4gKiBAcGFyYW0ge051bWJlcn0gcmFkaXVzXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMuc2VnbWVudHNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHJhZGl1cyA9IDAuNSwgb3B0cyA9IHtzZWdtZW50czogMzJ9KSB7XG4gIGxldCBzZWdtZW50cyA9IG9wdHMuc2VnbWVudHM7XG5cbiAgLy8gbGF0ID09PSBsYXRpdHVkZVxuICAvLyBsb24gPT09IGxvbmdpdHVkZVxuXG4gIGxldCBwb3NpdGlvbnM6IG51bWJlcltdID0gW107XG4gIGxldCBub3JtYWxzOiBudW1iZXJbXSA9IFtdO1xuICBsZXQgdXZzOiBudW1iZXJbXSA9IFtdO1xuICBsZXQgaW5kaWNlczogbnVtYmVyW10gPSBbXTtcbiAgbGV0IG1pblBvcyA9IG5ldyBWZWMzKC1yYWRpdXMsIC1yYWRpdXMsIC1yYWRpdXMpO1xuICBsZXQgbWF4UG9zID0gbmV3IFZlYzMocmFkaXVzLCByYWRpdXMsIHJhZGl1cyk7XG4gIGxldCBib3VuZGluZ1JhZGl1cyA9IHJhZGl1cztcblxuICBmb3IgKGxldCBsYXQgPSAwOyBsYXQgPD0gc2VnbWVudHM7ICsrbGF0KSB7XG4gICAgbGV0IHRoZXRhID0gbGF0ICogTWF0aC5QSSAvIHNlZ21lbnRzO1xuICAgIGxldCBzaW5UaGV0YSA9IE1hdGguc2luKHRoZXRhKTtcbiAgICBsZXQgY29zVGhldGEgPSAtTWF0aC5jb3ModGhldGEpO1xuXG4gICAgZm9yIChsZXQgbG9uID0gMDsgbG9uIDw9IHNlZ21lbnRzOyArK2xvbikge1xuICAgICAgbGV0IHBoaSA9IGxvbiAqIDIgKiBNYXRoLlBJIC8gc2VnbWVudHMgLSBNYXRoLlBJIC8gMi4wO1xuICAgICAgbGV0IHNpblBoaSA9IE1hdGguc2luKHBoaSk7XG4gICAgICBsZXQgY29zUGhpID0gTWF0aC5jb3MocGhpKTtcblxuICAgICAgbGV0IHggPSBzaW5QaGkgKiBzaW5UaGV0YTtcbiAgICAgIGxldCB5ID0gY29zVGhldGE7XG4gICAgICBsZXQgeiA9IGNvc1BoaSAqIHNpblRoZXRhO1xuICAgICAgbGV0IHUgPSBsb24gLyBzZWdtZW50cztcbiAgICAgIGxldCB2ID0gbGF0IC8gc2VnbWVudHM7XG5cbiAgICAgIHBvc2l0aW9ucy5wdXNoKHggKiByYWRpdXMsIHkgKiByYWRpdXMsIHogKiByYWRpdXMpO1xuICAgICAgbm9ybWFscy5wdXNoKHgsIHksIHopO1xuICAgICAgdXZzLnB1c2godSwgdik7XG5cblxuICAgICAgaWYgKChsYXQgPCBzZWdtZW50cykgJiYgKGxvbiA8IHNlZ21lbnRzKSkge1xuICAgICAgICBsZXQgc2VnMSA9IHNlZ21lbnRzICsgMTtcbiAgICAgICAgbGV0IGEgPSBzZWcxICogbGF0ICsgbG9uO1xuICAgICAgICBsZXQgYiA9IHNlZzEgKiAobGF0ICsgMSkgKyBsb247XG4gICAgICAgIGxldCBjID0gc2VnMSAqIChsYXQgKyAxKSArIGxvbiArIDE7XG4gICAgICAgIGxldCBkID0gc2VnMSAqIGxhdCArIGxvbiArIDE7XG5cbiAgICAgICAgaW5kaWNlcy5wdXNoKGEsIGQsIGIpO1xuICAgICAgICBpbmRpY2VzLnB1c2goZCwgYywgYik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBWZXJ0ZXhEYXRhKFxuICAgIHBvc2l0aW9ucyxcbiAgICBub3JtYWxzLFxuICAgIHV2cyxcbiAgICBpbmRpY2VzLFxuICAgIG1pblBvcyxcbiAgICBtYXhQb3MsXG4gICAgYm91bmRpbmdSYWRpdXNcbiAgKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiLyJ9