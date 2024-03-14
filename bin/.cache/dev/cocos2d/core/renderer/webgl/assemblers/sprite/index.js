
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/webgl/assemblers/sprite/index.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _assembler = _interopRequireDefault(require("../../../assembler"));

var _CCSprite = require("../../../../components/CCSprite");

var _simple = _interopRequireDefault(require("./2d/simple"));

var _sliced = _interopRequireDefault(require("./2d/sliced"));

var _tiled = _interopRequireDefault(require("./2d/tiled"));

var _radialFilled = _interopRequireDefault(require("./2d/radial-filled"));

var _barFilled = _interopRequireDefault(require("./2d/bar-filled"));

var _mesh = _interopRequireDefault(require("./2d/mesh"));

var _simple2 = _interopRequireDefault(require("./3d/simple"));

var _sliced2 = _interopRequireDefault(require("./3d/sliced"));

var _tiled2 = _interopRequireDefault(require("./3d/tiled"));

var _radialFilled2 = _interopRequireDefault(require("./3d/radial-filled"));

var _barFilled2 = _interopRequireDefault(require("./3d/bar-filled"));

var _mesh2 = _interopRequireDefault(require("./3d/mesh"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ctor = {
  getConstructor: function getConstructor(sprite) {
    var is3DNode = sprite.node.is3DNode;
    var ctor = is3DNode ? _simple2["default"] : _simple["default"];

    switch (sprite.type) {
      case _CCSprite.Type.SLICED:
        ctor = is3DNode ? _sliced2["default"] : _sliced["default"];
        break;

      case _CCSprite.Type.TILED:
        ctor = is3DNode ? _tiled2["default"] : _tiled["default"];
        break;

      case _CCSprite.Type.FILLED:
        if (sprite._fillType === _CCSprite.FillType.RADIAL) {
          ctor = is3DNode ? _radialFilled2["default"] : _radialFilled["default"];
        } else {
          ctor = is3DNode ? _barFilled2["default"] : _barFilled["default"];
        }

        break;

      case _CCSprite.Type.MESH:
        ctor = is3DNode ? _mesh2["default"] : _mesh["default"];
        break;
    }

    return ctor;
  },
  Simple: _simple["default"],
  Sliced: _sliced["default"],
  Tiled: _tiled["default"],
  RadialFilled: _radialFilled["default"],
  BarFilled: _barFilled["default"],
  Mesh: _mesh["default"],
  Simple3D: _simple2["default"],
  Sliced3D: _sliced2["default"],
  Tiled3D: _tiled2["default"],
  RadialFilled3D: _radialFilled2["default"],
  BarFilled3D: _barFilled2["default"],
  Mesh3D: _mesh2["default"]
};

_assembler["default"].register(cc.Sprite, ctor);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL3dlYmdsL2Fzc2VtYmxlcnMvc3ByaXRlL2luZGV4LmpzIl0sIm5hbWVzIjpbImN0b3IiLCJnZXRDb25zdHJ1Y3RvciIsInNwcml0ZSIsImlzM0ROb2RlIiwibm9kZSIsIlNpbXBsZTNEIiwiU2ltcGxlIiwidHlwZSIsIlR5cGUiLCJTTElDRUQiLCJTbGljZWQzRCIsIlNsaWNlZCIsIlRJTEVEIiwiVGlsZWQzRCIsIlRpbGVkIiwiRklMTEVEIiwiX2ZpbGxUeXBlIiwiRmlsbFR5cGUiLCJSQURJQUwiLCJSYWRpYWxGaWxsZWQzRCIsIlJhZGlhbEZpbGxlZCIsIkJhckZpbGxlZDNEIiwiQmFyRmlsbGVkIiwiTUVTSCIsIk1lc2gzRCIsIk1lc2giLCJBc3NlbWJsZXIiLCJyZWdpc3RlciIsImNjIiwiU3ByaXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxJQUFJQSxJQUFJLEdBQUc7QUFDUEMsRUFBQUEsY0FETywwQkFDUUMsTUFEUixFQUNnQjtBQUNuQixRQUFJQyxRQUFRLEdBQUdELE1BQU0sQ0FBQ0UsSUFBUCxDQUFZRCxRQUEzQjtBQUVBLFFBQUlILElBQUksR0FBR0csUUFBUSxHQUFHRSxtQkFBSCxHQUFjQyxrQkFBakM7O0FBQ0EsWUFBUUosTUFBTSxDQUFDSyxJQUFmO0FBQ0ksV0FBS0MsZUFBS0MsTUFBVjtBQUNJVCxRQUFBQSxJQUFJLEdBQUdHLFFBQVEsR0FBR08sbUJBQUgsR0FBY0Msa0JBQTdCO0FBQ0E7O0FBQ0osV0FBS0gsZUFBS0ksS0FBVjtBQUNJWixRQUFBQSxJQUFJLEdBQUdHLFFBQVEsR0FBR1Usa0JBQUgsR0FBYUMsaUJBQTVCO0FBQ0E7O0FBQ0osV0FBS04sZUFBS08sTUFBVjtBQUNJLFlBQUliLE1BQU0sQ0FBQ2MsU0FBUCxLQUFxQkMsbUJBQVNDLE1BQWxDLEVBQTBDO0FBQ3RDbEIsVUFBQUEsSUFBSSxHQUFHRyxRQUFRLEdBQUdnQix5QkFBSCxHQUFvQkMsd0JBQW5DO0FBQ0gsU0FGRCxNQUVPO0FBQ0hwQixVQUFBQSxJQUFJLEdBQUdHLFFBQVEsR0FBR2tCLHNCQUFILEdBQWlCQyxxQkFBaEM7QUFDSDs7QUFDRDs7QUFDSixXQUFLZCxlQUFLZSxJQUFWO0FBQ0l2QixRQUFBQSxJQUFJLEdBQUdHLFFBQVEsR0FBR3FCLGlCQUFILEdBQVlDLGdCQUEzQjtBQUNBO0FBaEJSOztBQW1CQSxXQUFPekIsSUFBUDtBQUNILEdBekJNO0FBMkJQTSxFQUFBQSxNQUFNLEVBQU5BLGtCQTNCTztBQTRCUEssRUFBQUEsTUFBTSxFQUFOQSxrQkE1Qk87QUE2QlBHLEVBQUFBLEtBQUssRUFBTEEsaUJBN0JPO0FBOEJQTSxFQUFBQSxZQUFZLEVBQVpBLHdCQTlCTztBQStCUEUsRUFBQUEsU0FBUyxFQUFUQSxxQkEvQk87QUFnQ1BHLEVBQUFBLElBQUksRUFBSkEsZ0JBaENPO0FBa0NQcEIsRUFBQUEsUUFBUSxFQUFSQSxtQkFsQ087QUFtQ1BLLEVBQUFBLFFBQVEsRUFBUkEsbUJBbkNPO0FBb0NQRyxFQUFBQSxPQUFPLEVBQVBBLGtCQXBDTztBQXFDUE0sRUFBQUEsY0FBYyxFQUFkQSx5QkFyQ087QUFzQ1BFLEVBQUFBLFdBQVcsRUFBWEEsc0JBdENPO0FBdUNQRyxFQUFBQSxNQUFNLEVBQU5BO0FBdkNPLENBQVg7O0FBMENBRSxzQkFBVUMsUUFBVixDQUFtQkMsRUFBRSxDQUFDQyxNQUF0QixFQUE4QjdCLElBQTlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFzc2VtYmxlciBmcm9tICcuLi8uLi8uLi9hc3NlbWJsZXInO1xuaW1wb3J0IHsgVHlwZSwgRmlsbFR5cGUgfSBmcm9tICcuLi8uLi8uLi8uLi9jb21wb25lbnRzL0NDU3ByaXRlJztcblxuaW1wb3J0IFNpbXBsZSBmcm9tIFwiLi8yZC9zaW1wbGVcIjtcbmltcG9ydCBTbGljZWQgZnJvbSBcIi4vMmQvc2xpY2VkXCI7XG5pbXBvcnQgVGlsZWQgZnJvbSBcIi4vMmQvdGlsZWRcIjtcbmltcG9ydCBSYWRpYWxGaWxsZWQgZnJvbSBcIi4vMmQvcmFkaWFsLWZpbGxlZFwiO1xuaW1wb3J0IEJhckZpbGxlZCBmcm9tIFwiLi8yZC9iYXItZmlsbGVkXCI7XG5pbXBvcnQgTWVzaCBmcm9tICcuLzJkL21lc2gnO1xuXG5pbXBvcnQgU2ltcGxlM0QgZnJvbSBcIi4vM2Qvc2ltcGxlXCI7XG5pbXBvcnQgU2xpY2VkM0QgZnJvbSBcIi4vM2Qvc2xpY2VkXCI7XG5pbXBvcnQgVGlsZWQzRCBmcm9tIFwiLi8zZC90aWxlZFwiO1xuaW1wb3J0IFJhZGlhbEZpbGxlZDNEIGZyb20gXCIuLzNkL3JhZGlhbC1maWxsZWRcIjtcbmltcG9ydCBCYXJGaWxsZWQzRCBmcm9tIFwiLi8zZC9iYXItZmlsbGVkXCI7XG5pbXBvcnQgTWVzaDNEIGZyb20gJy4vM2QvbWVzaCc7XG5cbmxldCBjdG9yID0ge1xuICAgIGdldENvbnN0cnVjdG9yKHNwcml0ZSkge1xuICAgICAgICBsZXQgaXMzRE5vZGUgPSBzcHJpdGUubm9kZS5pczNETm9kZTtcblxuICAgICAgICBsZXQgY3RvciA9IGlzM0ROb2RlID8gU2ltcGxlM0QgOiBTaW1wbGU7XG4gICAgICAgIHN3aXRjaCAoc3ByaXRlLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgVHlwZS5TTElDRUQ6XG4gICAgICAgICAgICAgICAgY3RvciA9IGlzM0ROb2RlID8gU2xpY2VkM0QgOiBTbGljZWQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFR5cGUuVElMRUQ6XG4gICAgICAgICAgICAgICAgY3RvciA9IGlzM0ROb2RlID8gVGlsZWQzRCA6IFRpbGVkO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBUeXBlLkZJTExFRDpcbiAgICAgICAgICAgICAgICBpZiAoc3ByaXRlLl9maWxsVHlwZSA9PT0gRmlsbFR5cGUuUkFESUFMKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0b3IgPSBpczNETm9kZSA/IFJhZGlhbEZpbGxlZDNEIDogUmFkaWFsRmlsbGVkO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGN0b3IgPSBpczNETm9kZSA/IEJhckZpbGxlZDNEIDogQmFyRmlsbGVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgVHlwZS5NRVNIOlxuICAgICAgICAgICAgICAgIGN0b3IgPSBpczNETm9kZSA/IE1lc2gzRCA6IE1lc2g7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3RvcjtcbiAgICB9LFxuXG4gICAgU2ltcGxlLFxuICAgIFNsaWNlZCxcbiAgICBUaWxlZCxcbiAgICBSYWRpYWxGaWxsZWQsXG4gICAgQmFyRmlsbGVkLFxuICAgIE1lc2gsXG5cbiAgICBTaW1wbGUzRCxcbiAgICBTbGljZWQzRCxcbiAgICBUaWxlZDNELFxuICAgIFJhZGlhbEZpbGxlZDNELFxuICAgIEJhckZpbGxlZDNELFxuICAgIE1lc2gzRCxcbn07XG5cbkFzc2VtYmxlci5yZWdpc3RlcihjYy5TcHJpdGUsIGN0b3IpO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=