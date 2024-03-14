
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/cannon/cannon-shared-body.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.CannonSharedBody = void 0;

var _cannon = _interopRequireDefault(require("../../../../../external/cannon/cannon"));

var _physicsEnum = require("../framework/physics-enum");

var _util = require("../framework/util");

var _cannonUtil = require("./cannon-util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LocalDirtyFlag = cc.Node._LocalDirtyFlag;
var PHYSICS_SCALE = LocalDirtyFlag.PHYSICS_SCALE;
var Quat = cc.Quat;
var Vec3 = cc.Vec3;
var fastRemoveAt = cc.js.array.fastRemoveAt;
var v3_0 = new Vec3();
var quat_0 = new Quat();
var contactsPool = [];
var CollisionEventObject = {
  type: 'collision-enter',
  selfCollider: null,
  otherCollider: null,
  contacts: []
};
/**
 * sharedbody, node : sharedbody = 1 : 1
 * static
 */

var CannonSharedBody = /*#__PURE__*/function () {
  CannonSharedBody.getSharedBody = function getSharedBody(node, wrappedWorld) {
    var key = node._id;

    if (CannonSharedBody.sharedBodiesMap.has(key)) {
      return CannonSharedBody.sharedBodiesMap.get(key);
    } else {
      var newSB = new CannonSharedBody(node, wrappedWorld);
      CannonSharedBody.sharedBodiesMap.set(node._id, newSB);
      return newSB;
    }
  };

  function CannonSharedBody(node, wrappedWorld) {
    this.node = void 0;
    this.wrappedWorld = void 0;
    this.body = new _cannon["default"].Body();
    this.shapes = [];
    this.wrappedBody = null;
    this.index = -1;
    this.ref = 0;
    this.onCollidedListener = this.onCollided.bind(this);
    this.wrappedWorld = wrappedWorld;
    this.node = node;
    this.body.material = this.wrappedWorld.world.defaultMaterial;
    this.body.addEventListener('cc-collide', this.onCollidedListener);

    this._updateGroup();

    this.node.on(cc.Node.EventType.GROUP_CHANGED, this._updateGroup, this);
  }

  var _proto = CannonSharedBody.prototype;

  _proto._updateGroup = function _updateGroup() {
    (0, _cannonUtil.groupIndexToBitMask)(this.node.groupIndex, this.body);
  };

  _proto.addShape = function addShape(v) {
    var index = this.shapes.indexOf(v);

    if (index < 0) {
      var _index = this.body.shapes.length;
      this.body.addShape(v.shape);
      this.shapes.push(v);
      v.setIndex(_index);
      var offset = this.body.shapeOffsets[_index];
      var orient = this.body.shapeOrientations[_index];
      v.setOffsetAndOrient(offset, orient);
    }
  };

  _proto.removeShape = function removeShape(v) {
    var index = this.shapes.indexOf(v);

    if (index >= 0) {
      fastRemoveAt(this.shapes, index);
      this.body.removeShape(v.shape);
      v.setIndex(-1);
    }
  };

  _proto.syncSceneToPhysics = function syncSceneToPhysics(force) {
    if (force === void 0) {
      force = false;
    }

    var node = this.node;
    var needUpdateTransform = (0, _util.worldDirty)(node);

    if (!force && !needUpdateTransform) {
      return;
    } // body world aabb need to be recalculated


    this.body.aabbNeedsUpdate = true;
    node.getWorldPosition(v3_0);
    node.getWorldRotation(quat_0);
    Vec3.copy(this.body.position, v3_0);
    Quat.copy(this.body.quaternion, quat_0);

    if (node._localMatDirty & PHYSICS_SCALE) {
      var wscale = node.__wscale;

      for (var i = 0; i < this.shapes.length; i++) {
        this.shapes[i].setScale(wscale);
      }

      (0, _cannonUtil.commitShapeUpdates)(this.body);
    }

    if (this.body.isSleeping()) {
      this.body.wakeUp();
    }
  };

  _proto.syncPhysicsToScene = function syncPhysicsToScene() {
    if (this.body.type != _physicsEnum.ERigidBodyType.STATIC && !this.body.isSleeping()) {
      Vec3.copy(v3_0, this.body.position);
      Quat.copy(quat_0, this.body.quaternion);
      this.node.setWorldPosition(v3_0);
      this.node.setWorldRotation(quat_0);
    }
  };

  _proto.destroy = function destroy() {
    this.body.removeEventListener('cc-collide', this.onCollidedListener);
    this.node.off(cc.Node.EventType.GROUP_CHANGED, this._updateGroup, this);
    CannonSharedBody.sharedBodiesMap["delete"](this.node._id);
    delete _cannon["default"].World['idToBodyMap'][this.body.id];
    this.node = null;
    this.wrappedWorld = null;
    this.body = null;
    this.shapes = null;
    this.onCollidedListener = null;
  };

  _proto.onCollided = function onCollided(event) {
    CollisionEventObject.type = event.event;
    var self = (0, _util.getWrap)(event.selfShape);
    var other = (0, _util.getWrap)(event.otherShape);

    if (self) {
      CollisionEventObject.selfCollider = self.collider;
      CollisionEventObject.otherCollider = other ? other.collider : null;
      var i = 0;

      for (i = CollisionEventObject.contacts.length; i--;) {
        contactsPool.push(CollisionEventObject.contacts.pop());
      }

      for (i = 0; i < event.contacts.length; i++) {
        var cq = event.contacts[i];

        if (contactsPool.length > 0) {
          var c = contactsPool.pop();
          Vec3.copy(c.contactA, cq.ri);
          Vec3.copy(c.contactB, cq.rj);
          Vec3.copy(c.normal, cq.ni);
          CollisionEventObject.contacts.push(c);
        } else {
          var _c = {
            contactA: Vec3.copy(new Vec3(), cq.ri),
            contactB: Vec3.copy(new Vec3(), cq.rj),
            normal: Vec3.copy(new Vec3(), cq.ni)
          };
          CollisionEventObject.contacts.push(_c);
        }
      }

      for (i = 0; i < this.shapes.length; i++) {
        var shape = this.shapes[i];
        CollisionEventObject.type = _cannonUtil.deprecatedEventMap[CollisionEventObject.type];
        shape.collider.emit(CollisionEventObject.type, CollisionEventObject); // adapt 

        CollisionEventObject.type = event.event;
        shape.collider.emit(CollisionEventObject.type, CollisionEventObject);
      }
    }
  };

  _createClass(CannonSharedBody, [{
    key: "enabled",
    set:
    /**
     * add or remove from world \
     * add, if enable \
     * remove, if disable & shapes.length == 0 & wrappedBody disable
     */
    function set(v) {
      if (v) {
        if (this.index < 0) {
          this.index = this.wrappedWorld.bodies.length;
          this.wrappedWorld.addSharedBody(this);
          var node = this.node; // body world aabb need to be recalculated

          this.body.aabbNeedsUpdate = true;
          node.getWorldPosition(v3_0);
          node.getWorldRotation(quat_0);
          var pos = this.body.position;
          pos.x = parseFloat(v3_0.x.toFixed(3));
          pos.y = parseFloat(v3_0.y.toFixed(3));
          pos.z = parseFloat(v3_0.z.toFixed(3));
          var rot = this.body.quaternion;
          rot.x = parseFloat(quat_0.x.toFixed(12));
          rot.y = parseFloat(quat_0.y.toFixed(12));
          rot.z = parseFloat(quat_0.z.toFixed(12));
          rot.w = parseFloat(quat_0.w.toFixed(12));

          if (node._localMatDirty & PHYSICS_SCALE) {
            var wscale = node.__wscale;

            for (var i = 0; i < this.shapes.length; i++) {
              this.shapes[i].setScale(wscale);
            }

            (0, _cannonUtil.commitShapeUpdates)(this.body);
          }

          if (this.body.isSleeping()) {
            this.body.wakeUp();
          }
        }
      } else {
        if (this.index >= 0) {
          var isRemove = this.shapes.length == 0 && this.wrappedBody == null || this.shapes.length == 0 && this.wrappedBody != null && !this.wrappedBody.rigidBody.enabledInHierarchy || this.shapes.length == 0 && this.wrappedBody != null && !this.wrappedBody.isEnabled;

          if (isRemove) {
            this.body.sleep(); // clear velocity etc.

            this.index = -1;
            this.wrappedWorld.removeSharedBody(this);
          }
        }
      }
    }
  }, {
    key: "reference",
    set: function set(v) {
      v ? this.ref++ : this.ref--;

      if (this.ref == 0) {
        this.destroy();
      }
    }
  }]);

  return CannonSharedBody;
}();

exports.CannonSharedBody = CannonSharedBody;
CannonSharedBody.sharedBodiesMap = new Map();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BoeXNpY3MvY2Fubm9uL2Nhbm5vbi1zaGFyZWQtYm9keS50cyJdLCJuYW1lcyI6WyJMb2NhbERpcnR5RmxhZyIsImNjIiwiTm9kZSIsIl9Mb2NhbERpcnR5RmxhZyIsIlBIWVNJQ1NfU0NBTEUiLCJRdWF0IiwiVmVjMyIsImZhc3RSZW1vdmVBdCIsImpzIiwiYXJyYXkiLCJ2M18wIiwicXVhdF8wIiwiY29udGFjdHNQb29sIiwiQ29sbGlzaW9uRXZlbnRPYmplY3QiLCJ0eXBlIiwic2VsZkNvbGxpZGVyIiwib3RoZXJDb2xsaWRlciIsImNvbnRhY3RzIiwiQ2Fubm9uU2hhcmVkQm9keSIsImdldFNoYXJlZEJvZHkiLCJub2RlIiwid3JhcHBlZFdvcmxkIiwia2V5IiwiX2lkIiwic2hhcmVkQm9kaWVzTWFwIiwiaGFzIiwiZ2V0IiwibmV3U0IiLCJzZXQiLCJib2R5IiwiQ0FOTk9OIiwiQm9keSIsInNoYXBlcyIsIndyYXBwZWRCb2R5IiwiaW5kZXgiLCJyZWYiLCJvbkNvbGxpZGVkTGlzdGVuZXIiLCJvbkNvbGxpZGVkIiwiYmluZCIsIm1hdGVyaWFsIiwid29ybGQiLCJkZWZhdWx0TWF0ZXJpYWwiLCJhZGRFdmVudExpc3RlbmVyIiwiX3VwZGF0ZUdyb3VwIiwib24iLCJFdmVudFR5cGUiLCJHUk9VUF9DSEFOR0VEIiwiZ3JvdXBJbmRleCIsImFkZFNoYXBlIiwidiIsImluZGV4T2YiLCJsZW5ndGgiLCJzaGFwZSIsInB1c2giLCJzZXRJbmRleCIsIm9mZnNldCIsInNoYXBlT2Zmc2V0cyIsIm9yaWVudCIsInNoYXBlT3JpZW50YXRpb25zIiwic2V0T2Zmc2V0QW5kT3JpZW50IiwicmVtb3ZlU2hhcGUiLCJzeW5jU2NlbmVUb1BoeXNpY3MiLCJmb3JjZSIsIm5lZWRVcGRhdGVUcmFuc2Zvcm0iLCJhYWJiTmVlZHNVcGRhdGUiLCJnZXRXb3JsZFBvc2l0aW9uIiwiZ2V0V29ybGRSb3RhdGlvbiIsImNvcHkiLCJwb3NpdGlvbiIsInF1YXRlcm5pb24iLCJfbG9jYWxNYXREaXJ0eSIsIndzY2FsZSIsIl9fd3NjYWxlIiwiaSIsInNldFNjYWxlIiwiaXNTbGVlcGluZyIsIndha2VVcCIsInN5bmNQaHlzaWNzVG9TY2VuZSIsIkVSaWdpZEJvZHlUeXBlIiwiU1RBVElDIiwic2V0V29ybGRQb3NpdGlvbiIsInNldFdvcmxkUm90YXRpb24iLCJkZXN0cm95IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm9mZiIsIldvcmxkIiwiaWQiLCJldmVudCIsInNlbGYiLCJzZWxmU2hhcGUiLCJvdGhlciIsIm90aGVyU2hhcGUiLCJjb2xsaWRlciIsInBvcCIsImNxIiwiYyIsImNvbnRhY3RBIiwicmkiLCJjb250YWN0QiIsInJqIiwibm9ybWFsIiwibmkiLCJkZXByZWNhdGVkRXZlbnRNYXAiLCJlbWl0IiwiYm9kaWVzIiwiYWRkU2hhcmVkQm9keSIsInBvcyIsIngiLCJwYXJzZUZsb2F0IiwidG9GaXhlZCIsInkiLCJ6Iiwicm90IiwidyIsImlzUmVtb3ZlIiwicmlnaWRCb2R5IiwiZW5hYmxlZEluSGllcmFyY2h5IiwiaXNFbmFibGVkIiwic2xlZXAiLCJyZW1vdmVTaGFyZWRCb2R5IiwiTWFwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOztBQUNBOztBQUNBOztBQU1BOzs7Ozs7OztBQUVBLElBQU1BLGNBQWMsR0FBR0MsRUFBRSxDQUFDQyxJQUFILENBQVFDLGVBQS9CO0FBQ0EsSUFBTUMsYUFBYSxHQUFHSixjQUFjLENBQUNJLGFBQXJDO0FBQ0EsSUFBTUMsSUFBSSxHQUFHSixFQUFFLENBQUNJLElBQWhCO0FBQ0EsSUFBTUMsSUFBSSxHQUFHTCxFQUFFLENBQUNLLElBQWhCO0FBQ0EsSUFBTUMsWUFBWSxHQUFHTixFQUFFLENBQUNPLEVBQUgsQ0FBTUMsS0FBTixDQUFZRixZQUFqQztBQUNBLElBQU1HLElBQUksR0FBRyxJQUFJSixJQUFKLEVBQWI7QUFDQSxJQUFNSyxNQUFNLEdBQUcsSUFBSU4s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KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBDQU5OT04gZnJvbSAnLi4vLi4vLi4vLi4vLi4vZXh0ZXJuYWwvY2Fubm9uL2Nhbm5vbic7XG5pbXBvcnQgeyBFUmlnaWRCb2R5VHlwZSB9IGZyb20gJy4uL2ZyYW1ld29yay9waHlzaWNzLWVudW0nO1xuaW1wb3J0IHsgZ2V0V3JhcCwgd29ybGREaXJ0eSB9IGZyb20gJy4uL2ZyYW1ld29yay91dGlsJztcbmltcG9ydCB7IENhbm5vbldvcmxkIH0gZnJvbSAnLi9jYW5ub24td29ybGQnO1xuaW1wb3J0IHsgQ2Fubm9uU2hhcGUgfSBmcm9tICcuL3NoYXBlcy9jYW5ub24tc2hhcGUnO1xuaW1wb3J0IHsgQ29sbGlkZXIzRCB9IGZyb20gJy4uL2V4cG9ydHMvcGh5c2ljcy1mcmFtZXdvcmsnO1xuaW1wb3J0IHsgQ29sbGlzaW9uRXZlbnRUeXBlIH0gZnJvbSAnLi4vZnJhbWV3b3JrL3BoeXNpY3MtaW50ZXJmYWNlJztcbmltcG9ydCB7IENhbm5vblJpZ2lkQm9keSB9IGZyb20gJy4vY2Fubm9uLXJpZ2lkLWJvZHknO1xuaW1wb3J0IHsgY29tbWl0U2hhcGVVcGRhdGVzLCBncm91cEluZGV4VG9CaXRNYXNrLCBkZXByZWNhdGVkRXZlbnRNYXAgfSBmcm9tICcuL2Nhbm5vbi11dGlsJ1xuXG5jb25zdCBMb2NhbERpcnR5RmxhZyA9IGNjLk5vZGUuX0xvY2FsRGlydHlGbGFnO1xuY29uc3QgUEhZU0lDU19TQ0FMRSA9IExvY2FsRGlydHlGbGFnLlBIWVNJQ1NfU0NBTEU7XG5jb25zdCBRdWF0ID0gY2MuUXVhdDtcbmNvbnN0IFZlYzMgPSBjYy5WZWMzO1xuY29uc3QgZmFzdFJlbW92ZUF0ID0gY2MuanMuYXJyYXkuZmFzdFJlbW92ZUF0O1xuY29uc3QgdjNfMCA9IG5ldyBWZWMzKCk7XG5jb25zdCBxdWF0XzAgPSBuZXcgUXVhdCgpO1xuY29uc3QgY29udGFjdHNQb29sID0gW10gYXMgYW55O1xuY29uc3QgQ29sbGlzaW9uRXZlbnRPYmplY3QgPSB7XG4gICAgdHlwZTogJ2NvbGxpc2lvbi1lbnRlcicgYXMgQ29sbGlzaW9uRXZlbnRUeXBlLFxuICAgIHNlbGZDb2xsaWRlcjogbnVsbCBhcyBDb2xsaWRlcjNEIHwgbnVsbCxcbiAgICBvdGhlckNvbGxpZGVyOiBudWxsIGFzIENvbGxpZGVyM0QgfCBudWxsLFxuICAgIGNvbnRhY3RzOiBbXSBhcyBhbnksXG59O1xuXG4vKipcbiAqIHNoYXJlZGJvZHksIG5vZGUgOiBzaGFyZWRib2R5ID0gMSA6IDFcbiAqIHN0YXRpY1xuICovXG5leHBvcnQgY2xhc3MgQ2Fubm9uU2hhcmVkQm9keSB7XG5cbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBzaGFyZWRCb2RpZXNNYXAgPSBuZXcgTWFwPHN0cmluZywgQ2Fubm9uU2hhcmVkQm9keT4oKTtcblxuICAgIHN0YXRpYyBnZXRTaGFyZWRCb2R5IChub2RlOiBjYy5Ob2RlLCB3cmFwcGVkV29ybGQ6IENhbm5vbldvcmxkKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IG5vZGUuX2lkO1xuICAgICAgICBpZiAoQ2Fubm9uU2hhcmVkQm9keS5zaGFyZWRCb2RpZXNNYXAuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiBDYW5ub25TaGFyZWRCb2R5LnNoYXJlZEJvZGllc01hcC5nZXQoa2V5KSE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBuZXdTQiA9IG5ldyBDYW5ub25TaGFyZWRCb2R5KG5vZGUsIHdyYXBwZWRXb3JsZCk7XG4gICAgICAgICAgICBDYW5ub25TaGFyZWRCb2R5LnNoYXJlZEJvZGllc01hcC5zZXQobm9kZS5faWQsIG5ld1NCKTtcbiAgICAgICAgICAgIHJldHVybiBuZXdTQjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlYWRvbmx5IG5vZGU6IGNjLk5vZGU7XG4gICAgcmVhZG9ubHkgd3JhcHBlZFdvcmxkOiBDYW5ub25Xb3JsZDtcbiAgICByZWFkb25seSBib2R5OiBDQU5OT04uQm9keSA9IG5ldyBDQU5OT04uQm9keSgpO1xuICAgIHJlYWRvbmx5IHNoYXBlczogQ2Fubm9uU2hhcGVbXSA9IFtdO1xuICAgIHdyYXBwZWRCb2R5OiBDYW5ub25SaWdpZEJvZHkgfCBudWxsID0gbnVsbDtcblxuICAgIHByaXZhdGUgaW5kZXg6IG51bWJlciA9IC0xO1xuICAgIHByaXZhdGUgcmVmOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgb25Db2xsaWRlZExpc3RlbmVyID0gdGhpcy5vbkNvbGxpZGVkLmJpbmQodGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBhZGQgb3IgcmVtb3ZlIGZyb20gd29ybGQgXFxcbiAgICAgKiBhZGQsIGlmIGVuYWJsZSBcXFxuICAgICAqIHJlbW92ZSwgaWYgZGlzYWJsZSAmIHNoYXBlcy5sZW5ndGggPT0gMCAmIHdyYXBwZWRCb2R5IGRpc2FibGVcbiAgICAgKi9cbiAgICBzZXQgZW5hYmxlZCAodjogYm9vbGVhbikge1xuICAgICAgICBpZiAodikge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IHRoaXMud3JhcHBlZFdvcmxkLmJvZGllcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdGhpcy53cmFwcGVkV29ybGQuYWRkU2hhcmVkQm9keSh0aGlzKTtcblxuICAgICAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5ub2RlO1xuICAgICAgICAgICAgICAgIC8vIGJvZHkgd29ybGQgYWFiYiBuZWVkIHRvIGJlIHJlY2FsY3VsYXRlZFxuICAgICAgICAgICAgICAgIHRoaXMuYm9keS5hYWJiTmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIG5vZGUuZ2V0V29ybGRQb3NpdGlvbih2M18wKTtcbiAgICAgICAgICAgICAgICBub2RlLmdldFdvcmxkUm90YXRpb24ocXVhdF8wKTtcbiAgICAgICAgICAgICAgICB2YXIgcG9zID0gdGhpcy5ib2R5LnBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIHBvcy54ID0gcGFyc2VGbG9hdCh2M18wLngudG9GaXhlZCgzKSk7XG4gICAgICAgICAgICAgICAgcG9zLnkgPSBwYXJzZUZsb2F0KHYzXzAueS50b0ZpeGVkKDMpKTtcbiAgICAgICAgICAgICAgICBwb3MueiA9IHBhcnNlRmxvYXQodjNfMC56LnRvRml4ZWQoMykpO1xuICAgICAgICAgICAgICAgIHZhciByb3QgPSB0aGlzLmJvZHkucXVhdGVybmlvbjtcbiAgICAgICAgICAgICAgICByb3QueCA9IHBhcnNlRmxvYXQocXVhdF8wLngudG9GaXhlZCgxMikpO1xuICAgICAgICAgICAgICAgIHJvdC55ID0gcGFyc2VGbG9hdChxdWF0XzAueS50b0ZpeGVkKDEyKSk7XG4gICAgICAgICAgICAgICAgcm90LnogPSBwYXJzZUZsb2F0KHF1YXRfMC56LnRvRml4ZWQoMTIpKTtcbiAgICAgICAgICAgICAgICByb3QudyA9IHBhcnNlRmxvYXQocXVhdF8wLncudG9GaXhlZCgxMikpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuX2xvY2FsTWF0RGlydHkgJiBQSFlTSUNTX1NDQUxFKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB3c2NhbGUgPSBub2RlLl9fd3NjYWxlO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2hhcGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNoYXBlc1tpXS5zZXRTY2FsZSh3c2NhbGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbW1pdFNoYXBlVXBkYXRlcyh0aGlzLmJvZHkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvZHkuaXNTbGVlcGluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9keS53YWtlVXAoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNSZW1vdmUgPSAodGhpcy5zaGFwZXMubGVuZ3RoID09IDAgJiYgdGhpcy53cmFwcGVkQm9keSA9PSBudWxsKSB8fFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5zaGFwZXMubGVuZ3RoID09IDAgJiYgdGhpcy53cmFwcGVkQm9keSAhPSBudWxsICYmICF0aGlzLndyYXBwZWRCb2R5LnJpZ2lkQm9keS5lbmFibGVkSW5IaWVyYXJjaHkpIHx8XG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnNoYXBlcy5sZW5ndGggPT0gMCAmJiB0aGlzLndyYXBwZWRCb2R5ICE9IG51bGwgJiYgIXRoaXMud3JhcHBlZEJvZHkuaXNFbmFibGVkKVxuXG4gICAgICAgICAgICAgICAgaWYgKGlzUmVtb3ZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9keS5zbGVlcCgpOyAvLyBjbGVhciB2ZWxvY2l0eSBldGMuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZXggPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53cmFwcGVkV29ybGQucmVtb3ZlU2hhcmVkQm9keSh0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXQgcmVmZXJlbmNlICh2OiBib29sZWFuKSB7XG4gICAgICAgIHYgPyB0aGlzLnJlZisrIDogdGhpcy5yZWYtLTtcbiAgICAgICAgaWYgKHRoaXMucmVmID09IDApIHsgdGhpcy5kZXN0cm95KCk7IH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yIChub2RlOiBjYy5Ob2RlLCB3cmFwcGVkV29ybGQ6IENhbm5vbldvcmxkKSB7XG4gICAgICAgIHRoaXMud3JhcHBlZFdvcmxkID0gd3JhcHBlZFdvcmxkO1xuICAgICAgICB0aGlzLm5vZGUgPSBub2RlO1xuICAgICAgICB0aGlzLmJvZHkubWF0ZXJpYWwgPSB0aGlzLndyYXBwZWRXb3JsZC53b3JsZC5kZWZhdWx0TWF0ZXJpYWw7XG4gICAgICAgIHRoaXMuYm9keS5hZGRFdmVudExpc3RlbmVyKCdjYy1jb2xsaWRlJywgdGhpcy5vbkNvbGxpZGVkTGlzdGVuZXIpO1xuICAgICAgICB0aGlzLl91cGRhdGVHcm91cCgpO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuR1JPVVBfQ0hBTkdFRCwgdGhpcy5fdXBkYXRlR3JvdXAsIHRoaXMpO1xuICAgIH1cblxuICAgIF91cGRhdGVHcm91cCAoKSB7XG4gICAgICAgIGdyb3VwSW5kZXhUb0JpdE1hc2sodGhpcy5ub2RlLmdyb3VwSW5kZXgsIHRoaXMuYm9keSk7XG4gICAgfVxuXG4gICAgYWRkU2hhcGUgKHY6IENhbm5vblNoYXBlKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5zaGFwZXMuaW5kZXhPZih2KTtcbiAgICAgICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmJvZHkuc2hhcGVzLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMuYm9keS5hZGRTaGFwZSh2LnNoYXBlKTtcbiAgICAgICAgICAgIHRoaXMuc2hhcGVzLnB1c2godik7XG5cbiAgICAgICAgICAgIHYuc2V0SW5kZXgoaW5kZXgpO1xuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gdGhpcy5ib2R5LnNoYXBlT2Zmc2V0c1tpbmRleF07XG4gICAgICAgICAgICBjb25zdCBvcmllbnQgPSB0aGlzLmJvZHkuc2hhcGVPcmllbnRhdGlvbnNbaW5kZXhdO1xuICAgICAgICAgICAgdi5zZXRPZmZzZXRBbmRPcmllbnQob2Zmc2V0LCBvcmllbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlU2hhcGUgKHY6IENhbm5vblNoYXBlKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5zaGFwZXMuaW5kZXhPZih2KTtcbiAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICAgIGZhc3RSZW1vdmVBdCh0aGlzLnNoYXBlcywgaW5kZXgpO1xuICAgICAgICAgICAgdGhpcy5ib2R5LnJlbW92ZVNoYXBlKHYuc2hhcGUpO1xuICAgICAgICAgICAgdi5zZXRJbmRleCgtMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzeW5jU2NlbmVUb1BoeXNpY3MgKGZvcmNlID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLm5vZGU7XG4gICAgICAgIGxldCBuZWVkVXBkYXRlVHJhbnNmb3JtID0gd29ybGREaXJ0eShub2RlKTtcbiAgICAgICAgaWYgKCFmb3JjZSAmJiAhbmVlZFVwZGF0ZVRyYW5zZm9ybSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGJvZHkgd29ybGQgYWFiYiBuZWVkIHRvIGJlIHJlY2FsY3VsYXRlZFxuICAgICAgICB0aGlzLmJvZHkuYWFiYk5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgbm9kZS5nZXRXb3JsZFBvc2l0aW9uKHYzXzApO1xuICAgICAgICBub2RlLmdldFdvcmxkUm90YXRpb24ocXVhdF8wKVxuICAgICAgICBWZWMzLmNvcHkodGhpcy5ib2R5LnBvc2l0aW9uLCB2M18wKTtcbiAgICAgICAgUXVhdC5jb3B5KHRoaXMuYm9keS5xdWF0ZXJuaW9uLCBxdWF0XzApO1xuXG4gICAgICAgIGlmIChub2RlLl9sb2NhbE1hdERpcnR5ICYgUEhZU0lDU19TQ0FMRSkge1xuICAgICAgICAgICAgbGV0IHdzY2FsZSA9IG5vZGUuX193c2NhbGU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2hhcGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaGFwZXNbaV0uc2V0U2NhbGUod3NjYWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbW1pdFNoYXBlVXBkYXRlcyh0aGlzLmJvZHkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYm9keS5pc1NsZWVwaW5nKCkpIHtcbiAgICAgICAgICAgIHRoaXMuYm9keS53YWtlVXAoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN5bmNQaHlzaWNzVG9TY2VuZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLmJvZHkudHlwZSAhPSBFUmlnaWRCb2R5VHlwZS5TVEFUSUMgJiYgIXRoaXMuYm9keS5pc1NsZWVwaW5nKCkpIHtcbiAgICAgICAgICAgIFZlYzMuY29weSh2M18wLCB0aGlzLmJvZHkucG9zaXRpb24pO1xuICAgICAgICAgICAgUXVhdC5jb3B5KHF1YXRfMCwgdGhpcy5ib2R5LnF1YXRlcm5pb24pO1xuICAgICAgICAgICAgdGhpcy5ub2RlLnNldFdvcmxkUG9zaXRpb24odjNfMCk7XG4gICAgICAgICAgICB0aGlzLm5vZGUuc2V0V29ybGRSb3RhdGlvbihxdWF0XzApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZXN0cm95ICgpIHtcbiAgICAgICAgdGhpcy5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NjLWNvbGxpZGUnLCB0aGlzLm9uQ29sbGlkZWRMaXN0ZW5lcik7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuR1JPVVBfQ0hBTkdFRCwgdGhpcy5fdXBkYXRlR3JvdXAsIHRoaXMpO1xuICAgICAgICBDYW5ub25TaGFyZWRCb2R5LnNoYXJlZEJvZGllc01hcC5kZWxldGUodGhpcy5ub2RlLl9pZCk7XG4gICAgICAgIGRlbGV0ZSBDQU5OT04uV29ybGRbJ2lkVG9Cb2R5TWFwJ11bdGhpcy5ib2R5LmlkXTtcbiAgICAgICAgKHRoaXMubm9kZSBhcyBhbnkpID0gbnVsbDtcbiAgICAgICAgKHRoaXMud3JhcHBlZFdvcmxkIGFzIGFueSkgPSBudWxsO1xuICAgICAgICAodGhpcy5ib2R5IGFzIGFueSkgPSBudWxsO1xuICAgICAgICAodGhpcy5zaGFwZXMgYXMgYW55KSA9IG51bGw7XG4gICAgICAgICh0aGlzLm9uQ29sbGlkZWRMaXN0ZW5lciBhcyBhbnkpID0gbnVsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uQ29sbGlkZWQgKGV2ZW50OiBDQU5OT04uSUNvbGxpc2lvbkV2ZW50KSB7XG4gICAgICAgIENvbGxpc2lvbkV2ZW50T2JqZWN0LnR5cGUgPSBldmVudC5ldmVudDtcbiAgICAgICAgY29uc3Qgc2VsZiA9IGdldFdyYXA8Q2Fubm9uU2hhcGU+KGV2ZW50LnNlbGZTaGFwZSk7XG4gICAgICAgIGNvbnN0IG90aGVyID0gZ2V0V3JhcDxDYW5ub25TaGFwZT4oZXZlbnQub3RoZXJTaGFwZSk7XG5cbiAgICAgICAgaWYgKHNlbGYpIHtcbiAgICAgICAgICAgIENvbGxpc2lvbkV2ZW50T2JqZWN0LnNlbGZDb2xsaWRlciA9IHNlbGYuY29sbGlkZXI7XG4gICAgICAgICAgICBDb2xsaXNpb25FdmVudE9iamVjdC5vdGhlckNvbGxpZGVyID0gb3RoZXIgPyBvdGhlci5jb2xsaWRlciA6IG51bGw7XG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBmb3IgKGkgPSBDb2xsaXNpb25FdmVudE9iamVjdC5jb250YWN0cy5sZW5ndGg7IGktLTspIHtcbiAgICAgICAgICAgICAgICBjb250YWN0c1Bvb2wucHVzaChDb2xsaXNpb25FdmVudE9iamVjdC5jb250YWN0cy5wb3AoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBldmVudC5jb250YWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNxID0gZXZlbnQuY29udGFjdHNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRhY3RzUG9vbC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGMgPSBjb250YWN0c1Bvb2wucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIFZlYzMuY29weShjLmNvbnRhY3RBLCBjcS5yaSk7XG4gICAgICAgICAgICAgICAgICAgIFZlYzMuY29weShjLmNvbnRhY3RCLCBjcS5yaik7XG4gICAgICAgICAgICAgICAgICAgIFZlYzMuY29weShjLm5vcm1hbCwgY3EubmkpO1xuICAgICAgICAgICAgICAgICAgICBDb2xsaXNpb25FdmVudE9iamVjdC5jb250YWN0cy5wdXNoKGMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250YWN0QTogVmVjMy5jb3B5KG5ldyBWZWMzKCksIGNxLnJpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhY3RCOiBWZWMzLmNvcHkobmV3IFZlYzMoKSwgY3EucmopLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsOiBWZWMzLmNvcHkobmV3IFZlYzMoKSwgY3EubmkpLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBDb2xsaXNpb25FdmVudE9iamVjdC5jb250YWN0cy5wdXNoKGMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuc2hhcGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhcGUgPSB0aGlzLnNoYXBlc1tpXTtcbiAgICAgICAgICAgICAgICBDb2xsaXNpb25FdmVudE9iamVjdC50eXBlID0gZGVwcmVjYXRlZEV2ZW50TWFwW0NvbGxpc2lvbkV2ZW50T2JqZWN0LnR5cGVdO1xuICAgICAgICAgICAgICAgIHNoYXBlLmNvbGxpZGVyLmVtaXQoQ29sbGlzaW9uRXZlbnRPYmplY3QudHlwZSwgQ29sbGlzaW9uRXZlbnRPYmplY3QpO1xuICAgICAgICAgICAgICAgIC8vIGFkYXB0IFxuICAgICAgICAgICAgICAgIENvbGxpc2lvbkV2ZW50T2JqZWN0LnR5cGUgPSBldmVudC5ldmVudDtcbiAgICAgICAgICAgICAgICBzaGFwZS5jb2xsaWRlci5lbWl0KENvbGxpc2lvbkV2ZW50T2JqZWN0LnR5cGUsIENvbGxpc2lvbkV2ZW50T2JqZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iXSwic291cmNlUm9vdCI6Ii8ifQ==