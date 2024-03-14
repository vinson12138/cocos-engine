
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/cocos/shapes/builtin-sphere-shape.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.BuiltinSphereShape = void 0;

var _builtinShape = require("./builtin-shape");

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Sphere = cc.geomUtils.Sphere;

var _worldScale = new cc.Vec3();

var BuiltinSphereShape = /*#__PURE__*/function (_BuiltinShape) {
  _inheritsLoose(BuiltinSphereShape, _BuiltinShape);

  function BuiltinSphereShape(radius) {
    var _this;

    _this = _BuiltinShape.call(this) || this;
    _this._localShape = new Sphere(0, 0, 0, radius);
    _this._worldShape = new Sphere(0, 0, 0, radius);
    return _this;
  }

  var _proto = BuiltinSphereShape.prototype;

  _proto.onLoad = function onLoad() {
    _BuiltinShape.prototype.onLoad.call(this);

    this.radius = this.sphereCollider.radius;
  };

  _createClass(BuiltinSphereShape, [{
    key: "radius",
    set: function set(radius) {
      this.localSphere.radius = radius;
      this.collider.node.getWorldScale(_worldScale);

      var s = _worldScale.maxAxis();

      this.worldSphere.radius = this.localSphere.radius * s;
    }
  }, {
    key: "localSphere",
    get: function get() {
      return this._localShape;
    }
  }, {
    key: "worldSphere",
    get: function get() {
      return this._worldShape;
    }
  }, {
    key: "sphereCollider",
    get: function get() {
      return this.collider;
    }
  }]);

  return BuiltinSphereShape;
}(_builtinShape.BuiltinShape);

exports.BuiltinSphereShape = BuiltinSphereShape;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BoeXNpY3MvY29jb3Mvc2hhcGVzL2J1aWx0aW4tc3BoZXJlLXNoYXBlLnRzIl0sIm5hbWVzIjpbIlNwaGVyZSIsImNjIiwiZ2VvbVV0aWxzIiwiX3dvcmxkU2NhbGUiLCJWZWMzIiwiQnVpbHRpblNwaGVyZVNoYXBlIiwicmFkaXVzIiwiX2xvY2FsU2hhcGUiLCJfd29ybGRTaGFwZSIsIm9uTG9hZCIsInNwaGVyZUNvbGxpZGVyIiwibG9jYWxTcGhlcmUiLCJjb2xsaWRlciIsIm5vZGUiLCJnZXRXb3JsZFNjYWxlIiwicyIsIm1heEF4aXMiLCJ3b3JsZFNwaGVyZSIsIkJ1aWx0aW5TaGFwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7Ozs7Ozs7OztBQUlBLElBQU1BLE1BQU0sR0FBR0MsRUFBRSxDQUFDQyxTQUFILENBQWFGLE1BQTVCOztBQUNBLElBQUlHLFdBQVcsR0FBRyxJQUFJRixFQUFFLENBQUNHLElBQVAsRUFBbEI7O0lBRWFDOzs7QUFxQlQsOEJBQWFDLE1BQWIsRUFBNkI7QUFBQTs7QUFDekI7QUFDQSxVQUFLQyxXQUFMLEdBQW1CLElBQUlQLE1BQUosQ0FBVyxDQUFYLEVBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQk0sTUFBcEIsQ0FBbkI7QUFDQSxVQUFLRSxXQUFMLEdBQW1CLElBQUlSLE1BQUosQ0FBVyxDQUFYLEVBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQk0sTUFBcEIsQ0FBbkI7QUFIeUI7QUFJNUI7Ozs7U0FFREcsU0FBQSxrQkFBVTtBQUNOLDRCQUFNQSxNQUFOOztBQUNBLFNBQUtILE1BQUwsR0FBYyxLQUFLSSxjQUFMLENBQW9CSixNQUFsQztBQUNIOzs7O1NBNUJELGFBQVlBLE1BQVosRUFBNEI7QUFDeEIsV0FBS0ssV0FBTCxDQUFpQkwsTUFBakIsR0FBMEJBLE1BQTFCO0FBQ0EsV0FBS00sUUFBTCxDQUFjQyxJQUFkLENBQW1CQyxhQUFuQixDQUFpQ1gsV0FBakM7O0FBQ0EsVUFBTVksQ0FBQyxHQUFHWixXQUFXLENBQUNhLE9BQVosRUFBVjs7QUFDQSxXQUFLQyxXQUFMLENBQWlCWCxNQUFqQixHQUEwQixLQUFLSyxXQUFMLENBQWlCTCxNQUFqQixHQUEwQlMsQ0FBcEQ7QUFDSDs7O1NBRUQsZUFBbUI7QUFDZixhQUFPLEtBQUtSLFdBQVo7QUFDSDs7O1NBRUQsZUFBbUI7QUFDZixhQUFPLEtBQUtDLFdBQVo7QUFDSDs7O1NBRUQsZUFBc0I7QUFDbEIsYUFBTyxLQUFLSSxRQUFaO0FBQ0g7Ozs7RUFuQm1DTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgeyBCdWlsdGluU2hhcGUgfSBmcm9tICcuL2J1aWx0aW4tc2hhcGUnO1xuaW1wb3J0IHsgSVNwaGVyZVNoYXBlIH0gZnJvbSAnLi4vLi4vc3BlYy9pLXBoeXNpY3Mtc2hhcGUnO1xuaW1wb3J0IHsgU3BoZXJlQ29sbGlkZXIzRCB9IGZyb20gJy4uLy4uL2V4cG9ydHMvcGh5c2ljcy1mcmFtZXdvcmsnO1xuXG5jb25zdCBTcGhlcmUgPSBjYy5nZW9tVXRpbHMuU3BoZXJlO1xubGV0IF93b3JsZFNjYWxlID0gbmV3IGNjLlZlYzMoKTtcblxuZXhwb3J0IGNsYXNzIEJ1aWx0aW5TcGhlcmVTaGFwZSBleHRlbmRzIEJ1aWx0aW5TaGFwZSBpbXBsZW1lbnRzIElTcGhlcmVTaGFwZSB7XG5cbiAgICBzZXQgcmFkaXVzIChyYWRpdXM6IG51bWJlcikge1xuICAgICAgICB0aGlzLmxvY2FsU3BoZXJlLnJhZGl1cyA9IHJhZGl1cztcbiAgICAgICAgdGhpcy5jb2xsaWRlci5ub2RlLmdldFdvcmxkU2NhbGUoX3dvcmxkU2NhbGUpO1xuICAgICAgICBjb25zdCBzID0gX3dvcmxkU2NhbGUubWF4QXhpcygpO1xuICAgICAgICB0aGlzLndvcmxkU3BoZXJlLnJhZGl1cyA9IHRoaXMubG9jYWxTcGhlcmUucmFkaXVzICogcztcbiAgICB9XG5cbiAgICBnZXQgbG9jYWxTcGhlcmUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxTaGFwZSBhcyBjYy5nZW9tVXRpbHMuU3BoZXJlO1xuICAgIH1cblxuICAgIGdldCB3b3JsZFNwaGVyZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93b3JsZFNoYXBlIGFzIGNjLmdlb21VdGlscy5TcGhlcmU7XG4gICAgfVxuXG4gICAgZ2V0IHNwaGVyZUNvbGxpZGVyICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sbGlkZXIgYXMgU3BoZXJlQ29sbGlkZXIzRDtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvciAocmFkaXVzOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fbG9jYWxTaGFwZSA9IG5ldyBTcGhlcmUoMCwgMCwgMCwgcmFkaXVzKTtcbiAgICAgICAgdGhpcy5fd29ybGRTaGFwZSA9IG5ldyBTcGhlcmUoMCwgMCwgMCwgcmFkaXVzKTtcbiAgICB9XG5cbiAgICBvbkxvYWQgKCkge1xuICAgICAgICBzdXBlci5vbkxvYWQoKTtcbiAgICAgICAgdGhpcy5yYWRpdXMgPSB0aGlzLnNwaGVyZUNvbGxpZGVyLnJhZGl1cztcbiAgICB9XG5cbn1cbiJdLCJzb3VyY2VSb290IjoiLyJ9