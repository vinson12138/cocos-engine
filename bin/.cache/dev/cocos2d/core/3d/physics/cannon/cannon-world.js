
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/cannon/cannon-world.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.CannonWorld = void 0;

var _cannon = _interopRequireDefault(require("../../../../../external/cannon/cannon"));

var _cannonUtil = require("./cannon-util");

var _cannonShape = require("./shapes/cannon-shape");

var _cannonSharedBody = require("./cannon-shared-body");

var _util = require("../framework/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Vec3 = cc.Vec3;
var fastRemoveAt = cc.js.array.fastRemoveAt;

var CannonWorld = /*#__PURE__*/function () {
  function CannonWorld() {
    this.bodies = [];
    this._world = void 0;
    this._raycastResult = new _cannon["default"].RaycastResult();
    this._world = new _cannon["default"].World();
    this._world.broadphase = new _cannon["default"].NaiveBroadphase();

    this._world.addEventListener("postStep", this.onPostStep.bind(this));
  }

  var _proto = CannonWorld.prototype;

  _proto.onPostStep = function onPostStep() {
    var p3dm = cc.director.getPhysics3DManager();

    if (p3dm.useFixedDigit) {
      var pd = p3dm.fixDigits.position;
      var rd = p3dm.fixDigits.rotation;
      var bodies = this._world.bodies;

      for (var i = 0; i < bodies.length; i++) {
        var bi = bodies[i];

        if (bi.type != _cannon["default"].Body.STATIC && !bi.isSleeping()) {
          var pos = bi.position;
          pos.x = parseFloat(pos.x.toFixed(pd));
          pos.y = parseFloat(pos.y.toFixed(pd));
          pos.z = parseFloat(pos.z.toFixed(pd));
          var rot = bi.quaternion;
          rot.x = parseFloat(rot.x.toFixed(rd));
          rot.y = parseFloat(rot.y.toFixed(rd));
          rot.z = parseFloat(rot.z.toFixed(rd));
          rot.w = parseFloat(rot.w.toFixed(rd));
          var vel = bi.velocity;
          vel.x = parseFloat(vel.x.toFixed(pd));
          vel.y = parseFloat(vel.y.toFixed(pd));
          vel.z = parseFloat(vel.z.toFixed(pd));
          var avel = bi.angularVelocity;
          avel.x = parseFloat(avel.x.toFixed(pd));
          avel.y = parseFloat(avel.y.toFixed(pd));
          avel.z = parseFloat(avel.z.toFixed(pd));
        }
      }
    }
  };

  _proto.step = function step(deltaTime, timeSinceLastCalled, maxSubStep) {
    this.syncSceneToPhysics();

    this._world.step(deltaTime, timeSinceLastCalled, maxSubStep);

    this.syncPhysicsToScene();
    this.emitEvents();
  };

  _proto.syncSceneToPhysics = function syncSceneToPhysics() {
    (0, _util.clearNodeTransformRecord)(); // sync scene to physics

    for (var i = 0; i < this.bodies.length; i++) {
      this.bodies[i].syncSceneToPhysics();
    }

    (0, _util.clearNodeTransformDirtyFlag)();
  };

  _proto.syncPhysicsToScene = function syncPhysicsToScene() {
    // sync physics to scene
    for (var i = 0; i < this.bodies.length; i++) {
      this.bodies[i].syncPhysicsToScene();
    }
  };

  _proto.emitEvents = function emitEvents() {
    this._world.emitTriggeredEvents();

    this._world.emitCollisionEvents();
  };

  _proto.raycastClosest = function raycastClosest(worldRay, options, result) {
    setupFromAndTo(worldRay, options.maxDistance);
    (0, _cannonUtil.toCannonRaycastOptions)(raycastOpt, options);

    var hit = this._world.raycastClosest(from, to, raycastOpt, this._raycastResult);

    if (hit) {
      (0, _cannonUtil.fillRaycastResult)(result, this._raycastResult);
    }

    return hit;
  };

  _proto.raycast = function raycast(worldRay, options, pool, results) {
    setupFromAndTo(worldRay, options.maxDistance);
    (0, _cannonUtil.toCannonRaycastOptions)(raycastOpt, options);

    var hit = this._world.raycastAll(from, to, raycastOpt, function (result) {
      var r = pool.add();
      (0, _cannonUtil.fillRaycastResult)(r, result);
      results.push(r);
    });

    return hit;
  };

  _proto.getSharedBody = function getSharedBody(node) {
    return _cannonSharedBody.CannonSharedBody.getSharedBody(node, this);
  };

  _proto.addSharedBody = function addSharedBody(sharedBody) {
    var i = this.bodies.indexOf(sharedBody);

    if (i < 0) {
      this.bodies.push(sharedBody);

      this._world.addBody(sharedBody.body);
    }
  };

  _proto.removeSharedBody = function removeSharedBody(sharedBody) {
    var i = this.bodies.indexOf(sharedBody);

    if (i >= 0) {
      fastRemoveAt(this.bodies, i);

      this._world.remove(sharedBody.body);
    }
  };

  _createClass(CannonWorld, [{
    key: "world",
    get: function get() {
      return this._world;
    }
  }, {
    key: "defaultMaterial",
    set: function set(mat) {
      this._world.defaultMaterial.friction = mat.friction;
      this._world.defaultMaterial.restitution = mat.restitution;

      if (_cannonShape.CannonShape.idToMaterial[mat._uuid] != null) {
        _cannonShape.CannonShape.idToMaterial[mat._uuid] = this._world.defaultMaterial;
      }
    }
  }, {
    key: "allowSleep",
    set: function set(v) {
      this._world.allowSleep = v;
    }
  }, {
    key: "gravity",
    set: function set(gravity) {
      Vec3.copy(this._world.gravity, gravity);
    }
  }]);

  return CannonWorld;
}();

exports.CannonWorld = CannonWorld;
var from = new _cannon["default"].Vec3();
var to = new _cannon["default"].Vec3();

function setupFromAndTo(worldRay, distance) {
  Vec3.copy(from, worldRay.o);
  worldRay.computeHit(to, distance);
}

var raycastOpt = {
  'checkCollisionResponse': false,
  'collisionFilterGroup': -1,
  'collisionFilterMask': -1,
  'skipBackFaces': false
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BoeXNpY3MvY2Fubm9uL2Nhbm5vbi13b3JsZC50cyJdLCJuYW1lcyI6WyJWZWMzIiwiY2MiLCJmYXN0UmVtb3ZlQXQiLCJqcyIsImFycmF5IiwiQ2Fubm9uV29ybGQiLCJib2RpZXMiLCJfd29ybGQiLCJfcmF5Y2FzdFJlc3VsdCIsIkNBTk5PTiIsIlJheWNhc3RSZXN1bHQiLCJXb3JsZCIsImJyb2FkcGhhc2UiLCJOYWl2ZUJyb2FkcGhhc2UiLCJhZGRFdmVudExpc3RlbmVyIiwib25Qb3N0U3RlcCIsImJpbmQiLCJwM2RtIiwiZGlyZWN0b3IiLCJnZXRQaHlzaWNzM0RNYW5hZ2VyIiwidXNlRml4ZWREaWdpdCIsInBkIiwiZml4RGlnaXRzIiwicG9zaXRpb24iLCJyZCIsInJvdGF0aW9uIiwiaSIsImxlbmd0aCIsImJpIiwidHlwZSIsIkJvZHkiLCJTVEFUSUMiLCJpc1NsZWVwaW5nIiwicG9zIiwieCIsInBhcnNlRmxvYXQiLCJ0b0ZpeGVkIiwieSIsInoiLCJyb3QiLCJxdWF0ZXJuaW9uIiwidyIsInZlbCIsInZlbG9jaXR5IiwiYXZlbCIsImFuZ3VsYXJWZWxvY2l0eSIsInN0ZXAiLCJkZWx0YVRpbWUiLCJ0aW1lU2luY2VMYXN0Q2FsbGVkIiwibWF4U3ViU3RlcCIsInN5bmNTY2VuZVRvUGh5c2ljcyIsInN5bmNQaHlzaWNzVG9TY2VuZSIsImVtaXRFdmVudHMiLCJlbWl0VHJpZ2dlcmVkRXZlbnRzIiwiZW1pdENvbGxpc2lvbkV2ZW50cyIsInJheWNhc3RDbG9zZXN0Iiwid29ybGRSYXkiLCJvcHRpb25zIiwicmVzdWx0Iiwic2V0dXBGcm9tQW5kVG8iLCJtYXhEaXN0YW5jZSIsInJheWNhc3RPcHQiLCJoaXQiLCJmcm9tIiwidG8iLCJyYXljYXN0IiwicG9vbCIsInJlc3VsdHMiLCJyYXljYXN0QWxsIiwiciIsImFkZCIsInB1c2giLCJnZXRTaGFyZWRCb2R5Iiwibm9kZSIsIkNhbm5vblNoYXJlZEJvZHkiLCJhZGRTaGFyZWRCb2R5Iiwic2hhcmVkQm9keSIsImluZGV4T2YiLCJhZGRCb2R5IiwiYm9keSIsInJlbW92ZVNoYXJlZEJvZHkiLCJyZW1vdmUiLCJtYXQiLCJkZWZhdWx0TWF0ZXJpYWwiLCJmcmljdGlvbiIsInJlc3RpdHV0aW9uIiwiQ2Fubm9uU2hhcGUiLCJpZFRvTWF0ZXJpYWwiLCJfdXVpZCIsInYiLCJhbGxvd1NsZWVwIiwiZ3Jhdml0eSIsImNvcHkiLCJkaXN0YW5jZSIsIm8iLCJjb21wdXRlSGl0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOztBQUNBOztBQUNBOztBQUNBOztBQUdBOzs7Ozs7OztBQUVBLElBQU1BLElBQUksR0FBR0MsRUFBRSxDQUFDRCxJQUFoQjtBQUNBLElBQU1FLFlBQVksR0FBR0QsRUFBRSxDQUFDRSxFQUFILENBQU1DLEtBQU4sQ0FBWUYsWUFBakM7O0lBRWFHO0FBMkJULHlCQUFlO0FBQUEsU0FMTkMsTUFLTSxHQUx1QixFQUt2QjtBQUFBLFNBSFBDLE1BR087QUFBQSxTQUZQQyxjQUVPLEdBRlUsSUFBSUMsbUJBQU9DLGFBQVgsRUFFVjtBQUNYLFNBQUtILE1BQUwsR0FBYyxJQUFJRSxtQkFBT0UsS0FBWCxFQUFkO0FBQ0EsU0FBS0osTUFBTCxDQUFZSyxVQUFaLEdBQXlCLElBQUlILG1CQUFPSSxlQUFYLEVBQXpCOztBQUNBLFNBQUtOLE1BQUwsQ0FBWU8sZ0JBQVosQ0FBNkIsVUFBN0IsRUFBeUMsS0FBS0MsVUFBTCxDQUFnQkMsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBekM7QUFDSDs7OztTQUVERCxhQUFBLHNCQUFjO0FBQ1YsUUFBTUUsSUFBSSxHQUFHaEIsRUFBRSxDQUFDaUIsUUFBSCxDQUFZQyxtQkFBWixFQUFiOztBQUNBLFFBQUlGLElBQUksQ0FBQ0csYUFBVCxFQUF3QjtBQUNwQixVQUFNQyxFQUFFLEdBQUdKLElBQUksQ0FBQ0ssU0FBTCxDQUFlQyxRQUExQjtBQUNBLFVBQU1DLEVBQUUsR0FBR1AsSUFBSSxDQUFD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QUVELElBQU1oQyxVQUFrQyxHQUFHO0FBQ3ZDLDRCQUEwQixLQURhO0FBRXZDLDBCQUF3QixDQUFDLENBRmM7QUFHdkMseUJBQXVCLENBQUMsQ0FIZTtBQUl2QyxtQkFBaUI7QUFKc0IsQ0FBM0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IENBTk5PTiBmcm9tICcuLi8uLi8uLi8uLi8uLi9leHRlcm5hbC9jYW5ub24vY2Fubm9uJztcbmltcG9ydCB7IGZpbGxSYXljYXN0UmVzdWx0LCB0b0Nhbm5vblJheWNhc3RPcHRpb25zIH0gZnJvbSAnLi9jYW5ub24tdXRpbCc7XG5pbXBvcnQgeyBDYW5ub25TaGFwZSB9IGZyb20gJy4vc2hhcGVzL2Nhbm5vbi1zaGFwZSc7XG5pbXBvcnQgeyBDYW5ub25TaGFyZWRCb2R5IH0gZnJvbSAnLi9jYW5ub24tc2hhcmVkLWJvZHknO1xuaW1wb3J0IHsgSVBoeXNpY3NXb3JsZCwgSVJheWNhc3RPcHRpb25zIH0gZnJvbSAnLi4vc3BlYy9pLXBoeXNpY3Mtd29ybGQnO1xuaW1wb3J0IHsgUGh5c2ljc01hdGVyaWFsLCBQaHlzaWNzUmF5UmVzdWx0IH0gZnJvbSAnLi4vZnJhbWV3b3JrJztcbmltcG9ydCB7IGNsZWFyTm9kZVRyYW5zZm9ybVJlY29yZCwgY2xlYXJOb2RlVHJhbnNmb3JtRGlydHlGbGFnIH0gZnJvbSAnLi4vZnJhbWV3b3JrL3V0aWwnXG5cbmNvbnN0IFZlYzMgPSBjYy5WZWMzO1xuY29uc3QgZmFzdFJlbW92ZUF0ID0gY2MuanMuYXJyYXkuZmFzdFJlbW92ZUF0O1xuXG5leHBvcnQgY2xhc3MgQ2Fubm9uV29ybGQgaW1wbGVtZW50cyBJUGh5c2ljc1dvcmxkIHtcblxuICAgIGdldCB3b3JsZCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93b3JsZDtcbiAgICB9XG5cbiAgICBzZXQgZGVmYXVsdE1hdGVyaWFsIChtYXQ6IFBoeXNpY3NNYXRlcmlhbCkge1xuICAgICAgICB0aGlzLl93b3JsZC5kZWZhdWx0TWF0ZXJpYWwuZnJpY3Rpb24gPSBtYXQuZnJpY3Rpb247XG4gICAgICAgIHRoaXMuX3dvcmxkLmRlZmF1bHRNYXRlcmlhbC5yZXN0aXR1dGlvbiA9IG1hdC5yZXN0aXR1dGlvbjtcbiAgICAgICAgaWYgKENhbm5vblNoYXBlLmlkVG9NYXRlcmlhbFttYXQuX3V1aWRdICE9IG51bGwpIHtcbiAgICAgICAgICAgIENhbm5vblNoYXBlLmlkVG9NYXRlcmlhbFttYXQuX3V1aWRdID0gdGhpcy5fd29ybGQuZGVmYXVsdE1hdGVyaWFsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0IGFsbG93U2xlZXAgKHY6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fd29ybGQuYWxsb3dTbGVlcCA9IHY7XG4gICAgfVxuXG4gICAgc2V0IGdyYXZpdHkgKGdyYXZpdHk6IGNjLlZlYzMpIHtcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMuX3dvcmxkLmdyYXZpdHksIGdyYXZpdHkpO1xuICAgIH1cblxuICAgIHJlYWRvbmx5IGJvZGllczogQ2Fubm9uU2hhcmVkQm9keVtdID0gW107XG5cbiAgICBwcml2YXRlIF93b3JsZDogQ0FOTk9OLldvcmxkO1xuICAgIHByaXZhdGUgX3JheWNhc3RSZXN1bHQgPSBuZXcgQ0FOTk9OLlJheWNhc3RSZXN1bHQoKTtcblxuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy5fd29ybGQgPSBuZXcgQ0FOTk9OLldvcmxkKCk7XG4gICAgICAgIHRoaXMuX3dvcmxkLmJyb2FkcGhhc2UgPSBuZXcgQ0FOTk9OLk5haXZlQnJvYWRwaGFzZSgpO1xuICAgICAgICB0aGlzLl93b3JsZC5hZGRFdmVudExpc3RlbmVyKFwicG9zdFN0ZXBcIiwgdGhpcy5vblBvc3RTdGVwLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIG9uUG9zdFN0ZXAgKCkge1xuICAgICAgICBjb25zdCBwM2RtID0gY2MuZGlyZWN0b3IuZ2V0UGh5c2ljczNETWFuYWdlcigpO1xuICAgICAgICBpZiAocDNkbS51c2VGaXhlZERpZ2l0KSB7XG4gICAgICAgICAgICBjb25zdCBwZCA9IHAzZG0uZml4RGlnaXRzLnBvc2l0aW9uO1xuICAgICAgICAgICAgY29uc3QgcmQgPSBwM2RtLmZpeERpZ2l0cy5yb3RhdGlvbjtcbiAgICAgICAgICAgIGNvbnN0IGJvZGllcyA9IHRoaXMuX3dvcmxkLmJvZGllcztcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYm9kaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYmkgPSBib2RpZXNbaV07XG4gICAgICAgICAgICAgICAgaWYoYmkudHlwZSAhPSBDQU5OT04uQm9keS5TVEFUSUMgJiYgIWJpLmlzU2xlZXBpbmcoKSl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvcyA9IGJpLnBvc2l0aW9uO1xuICAgICAgICAgICAgICAgICAgICBwb3MueCA9IHBhcnNlRmxvYXQocG9zLngudG9GaXhlZChwZCkpO1xuICAgICAgICAgICAgICAgICAgICBwb3MueSA9IHBhcnNlRmxvYXQocG9zLnkudG9GaXhlZChwZCkpO1xuICAgICAgICAgICAgICAgICAgICBwb3MueiA9IHBhcnNlRmxvYXQocG9zLnoudG9GaXhlZChwZCkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByb3QgPSBiaS5xdWF0ZXJuaW9uO1xuICAgICAgICAgICAgICAgICAgICByb3QueCA9IHBhcnNlRmxvYXQocm90LngudG9GaXhlZChyZCkpO1xuICAgICAgICAgICAgICAgICAgICByb3QueSA9IHBhcnNlRmxvYXQocm90LnkudG9GaXhlZChyZCkpO1xuICAgICAgICAgICAgICAgICAgICByb3QueiA9IHBhcnNlRmxvYXQocm90LnoudG9GaXhlZChyZCkpO1xuICAgICAgICAgICAgICAgICAgICByb3QudyA9IHBhcnNlRmxvYXQocm90LncudG9GaXhlZChyZCkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2ZWwgPSBiaS52ZWxvY2l0eTtcbiAgICAgICAgICAgICAgICAgICAgdmVsLnggPSBwYXJzZUZsb2F0KHZlbC54LnRvRml4ZWQocGQpKTtcbiAgICAgICAgICAgICAgICAgICAgdmVsLnkgPSBwYXJzZUZsb2F0KHZlbC55LnRvRml4ZWQocGQpKTtcbiAgICAgICAgICAgICAgICAgICAgdmVsLnogPSBwYXJzZUZsb2F0KHZlbC56LnRvRml4ZWQocGQpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXZlbCA9IGJpLmFuZ3VsYXJWZWxvY2l0eTtcbiAgICAgICAgICAgICAgICAgICAgYXZlbC54ID0gcGFyc2VGbG9hdChhdmVsLngudG9GaXhlZChwZCkpO1xuICAgICAgICAgICAgICAgICAgICBhdmVsLnkgPSBwYXJzZUZsb2F0KGF2ZWwueS50b0ZpeGVkKHBkKSk7XG4gICAgICAgICAgICAgICAgICAgIGF2ZWwueiA9IHBhcnNlRmxvYXQoYXZlbC56LnRvRml4ZWQocGQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGVwIChkZWx0YVRpbWU6IG51bWJlciwgdGltZVNpbmNlTGFzdENhbGxlZD86IG51bWJlciwgbWF4U3ViU3RlcD86IG51bWJlcikge1xuICAgICAgICB0aGlzLnN5bmNTY2VuZVRvUGh5c2ljcygpO1xuICAgICAgICB0aGlzLl93b3JsZC5zdGVwKGRlbHRhVGltZSwgdGltZVNpbmNlTGFzdENhbGxlZCwgbWF4U3ViU3RlcCk7XG4gICAgICAgIHRoaXMuc3luY1BoeXNpY3NUb1NjZW5lKCk7XG4gICAgICAgIHRoaXMuZW1pdEV2ZW50cygpO1xuICAgIH1cblxuICAgIHN5bmNTY2VuZVRvUGh5c2ljcyAoKSB7XG4gICAgICAgIGNsZWFyTm9kZVRyYW5zZm9ybVJlY29yZCgpO1xuICAgICAgICAvLyBzeW5jIHNjZW5lIHRvIHBoeXNpY3NcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJvZGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5ib2RpZXNbaV0uc3luY1NjZW5lVG9QaHlzaWNzKCk7XG4gICAgICAgIH1cbiAgICAgICAgY2xlYXJOb2RlVHJhbnNmb3JtRGlydHlGbGFnKCk7XG4gICAgfVxuXG4gICAgc3luY1BoeXNpY3NUb1NjZW5lICgpIHtcbiAgICAgICAgLy8gc3luYyBwaHlzaWNzIHRvIHNjZW5lXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ib2RpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYm9kaWVzW2ldLnN5bmNQaHlzaWNzVG9TY2VuZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZW1pdEV2ZW50cyAoKSB7XG4gICAgICAgIHRoaXMuX3dvcmxkLmVtaXRUcmlnZ2VyZWRFdmVudHMoKTtcbiAgICAgICAgdGhpcy5fd29ybGQuZW1pdENvbGxpc2lvbkV2ZW50cygpO1xuICAgIH1cblxuICAgIHJheWNhc3RDbG9zZXN0ICh3b3JsZFJheTogY2MuZ2VvbVV0aWxzLlJheSwgb3B0aW9uczogSVJheWNhc3RPcHRpb25zLCByZXN1bHQ6IFBoeXNpY3NSYXlSZXN1bHQpOiBib29sZWFuIHtcbiAgICAgICAgc2V0dXBGcm9tQW5kVG8od29ybGRSYXksIG9wdGlvbnMubWF4RGlzdGFuY2UpO1xuICAgICAgICB0b0Nhbm5vblJheWNhc3RPcHRpb25zKHJheWNhc3RPcHQsIG9wdGlvbnMpO1xuICAgICAgICBjb25zdCBoaXQgPSB0aGlzLl93b3JsZC5yYXljYXN0Q2xvc2VzdChmcm9tLCB0bywgcmF5Y2FzdE9wdCwgdGhpcy5fcmF5Y2FzdFJlc3VsdCk7XG4gICAgICAgIGlmIChoaXQpIHtcbiAgICAgICAgICAgIGZpbGxSYXljYXN0UmVzdWx0KHJlc3VsdCwgdGhpcy5fcmF5Y2FzdFJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhpdDtcbiAgICB9XG5cbiAgICByYXljYXN0ICh3b3JsZFJheTogY2MuZ2VvbVV0aWxzLlJheSwgb3B0aW9uczogSVJheWNhc3RPcHRpb25zLCBwb29sOiBjYy5SZWN5Y2xlUG9vbCwgcmVzdWx0czogUGh5c2ljc1JheVJlc3VsdFtdKTogYm9vbGVhbiB7XG4gICAgICAgIHNldHVwRnJvbUFuZFRvKHdvcmxkUmF5LCBvcHRpb25zLm1heERpc3RhbmNlKTtcbiAgICAgICAgdG9DYW5ub25SYXljYXN0T3B0aW9ucyhyYXljYXN0T3B0LCBvcHRpb25zKTtcbiAgICAgICAgY29uc3QgaGl0ID0gdGhpcy5fd29ybGQucmF5Y2FzdEFsbChmcm9tLCB0bywgcmF5Y2FzdE9wdCwgKHJlc3VsdDogQ0FOTk9OLlJheWNhc3RSZXN1bHQpOiBhbnkgPT4ge1xuICAgICAgICAgICAgY29uc3QgciA9IHBvb2wuYWRkKCk7XG4gICAgICAgICAgICBmaWxsUmF5Y2FzdFJlc3VsdChyLCByZXN1bHQpO1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHIpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGhpdFxuICAgIH1cblxuICAgIGdldFNoYXJlZEJvZHkgKG5vZGU6IE5vZGUpOiBDYW5ub25TaGFyZWRCb2R5IHtcbiAgICAgICAgcmV0dXJuIENhbm5vblNoYXJlZEJvZHkuZ2V0U2hhcmVkQm9keShub2RlLCB0aGlzKTtcbiAgICB9XG5cbiAgICBhZGRTaGFyZWRCb2R5IChzaGFyZWRCb2R5OiBDYW5ub25TaGFyZWRCb2R5KSB7XG4gICAgICAgIGNvbnN0IGkgPSB0aGlzLmJvZGllcy5pbmRleE9mKHNoYXJlZEJvZHkpO1xuICAgICAgICBpZiAoaSA8IDApIHtcbiAgICAgICAgICAgIHRoaXMuYm9kaWVzLnB1c2goc2hhcmVkQm9keSk7XG4gICAgICAgICAgICB0aGlzLl93b3JsZC5hZGRCb2R5KHNoYXJlZEJvZHkuYm9keSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVTaGFyZWRCb2R5IChzaGFyZWRCb2R5OiBDYW5ub25TaGFyZWRCb2R5KSB7XG4gICAgICAgIGNvbnN0IGkgPSB0aGlzLmJvZGllcy5pbmRleE9mKHNoYXJlZEJvZHkpO1xuICAgICAgICBpZiAoaSA+PSAwKSB7XG4gICAgICAgICAgICBmYXN0UmVtb3ZlQXQodGhpcy5ib2RpZXMsIGkpO1xuICAgICAgICAgICAgdGhpcy5fd29ybGQucmVtb3ZlKHNoYXJlZEJvZHkuYm9keSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IGZyb20gPSBuZXcgQ0FOTk9OLlZlYzMoKTtcbmNvbnN0IHRvID0gbmV3IENBTk5PTi5WZWMzKCk7XG5mdW5jdGlvbiBzZXR1cEZyb21BbmRUbyAod29ybGRSYXk6IGNjLmdlb21VdGlscy5SYXksIGRpc3RhbmNlOiBudW1iZXIpIHtcbiAgICBWZWMzLmNvcHkoZnJvbSwgd29ybGRSYXkubyk7XG4gICAgd29ybGRSYXkuY29tcHV0ZUhpdCh0bywgZGlzdGFuY2UpO1xufVxuXG5jb25zdCByYXljYXN0T3B0OiBDQU5OT04uSVJheWNhc3RPcHRpb25zID0ge1xuICAgICdjaGVja0NvbGxpc2lvblJlc3BvbnNlJzogZmFsc2UsXG4gICAgJ2NvbGxpc2lvbkZpbHRlckdyb3VwJzogLTEsXG4gICAgJ2NvbGxpc2lvbkZpbHRlck1hc2snOiAtMSxcbiAgICAnc2tpcEJhY2tGYWNlcyc6IGZhbHNlXG59Il0sInNvdXJjZVJvb3QiOiIvIn0=