
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/cannon/shapes/cannon-shape.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.CannonShape = void 0;

var _cannon = _interopRequireDefault(require("../../../../../../external/cannon/cannon"));

var _util = require("../../framework/util");

var _cannonUtil = require("../cannon-util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TriggerEventObject = {
  type: 'trigger-enter',
  selfCollider: null,
  otherCollider: null
};
var Vec3 = cc.Vec3;
var v3_0 = new Vec3();

var CannonShape = /*#__PURE__*/function () {
  function CannonShape() {
    this._collider = void 0;
    this._shape = void 0;
    this._offset = new _cannon["default"].Vec3();
    this._orient = new _cannon["default"].Quaternion();
    this._index = -1;
    this._sharedBody = void 0;
    this.onTriggerListener = this.onTrigger.bind(this);
  }

  var _proto = CannonShape.prototype;

  /** LIFECYCLE */
  _proto.__preload = function __preload(comp) {
    this._collider = comp;
    (0, _util.setWrap)(this._shape, this);

    this._shape.addEventListener('cc-trigger', this.onTriggerListener);

    this._sharedBody = cc.director.getPhysics3DManager().physicsWorld.getSharedBody(this._collider.node);
    this._sharedBody.reference = true;
  };

  _proto.onLoad = function onLoad() {
    this.center = this._collider.center;
    this.isTrigger = this._collider.isTrigger;
  };

  _proto.onEnable = function onEnable() {
    this._sharedBody.addShape(this);

    this._sharedBody.enabled = true;
  };

  _proto.onDisable = function onDisable() {
    this._sharedBody.removeShape(this);

    this._sharedBody.enabled = false;
  };

  _proto.onDestroy = function onDestroy() {
    this._sharedBody.reference = false;

    this._shape.removeEventListener('cc-trigger', this.onTriggerListener);

    delete _cannon["default"].World['idToShapeMap'][this._shape.id];
    this._sharedBody = null;
    (0, _util.setWrap)(this._shape, null);
    this._offset = null;
    this._orient = null;
    this._shape = null;
    this._collider = null;
    this.onTriggerListener = null;
  }
  /**
   * change scale will recalculate center & size \
   * size handle by child class
   * @param scale 
   */
  ;

  _proto.setScale = function setScale(scale) {
    this._setCenter(this._collider.center);
  };

  _proto.setIndex = function setIndex(index) {
    this._index = index;
  };

  _proto.setOffsetAndOrient = function setOffsetAndOrient(offset, orient) {
    cc.Vec3.copy(offset, this._offset);
    cc.Vec3.copy(orient, this._orient);
    this._offset = offset;
    this._orient = orient;
  };

  _proto._setCenter = function _setCenter(v) {
    var lpos = this._offset;
    Vec3.copy(lpos, v);

    this._collider.node.getWorldScale(v3_0);

    Vec3.multiply(lpos, lpos, v3_0);
  };

  _proto.onTrigger = function onTrigger(event) {
    TriggerEventObject.type = event.event;
    var self = (0, _util.getWrap)(event.selfShape);
    var other = (0, _util.getWrap)(event.otherShape);

    if (self) {
      TriggerEventObject.selfCollider = self.collider;
      TriggerEventObject.otherCollider = other ? other.collider : null;
      TriggerEventObject.type = _cannonUtil.deprecatedEventMap[TriggerEventObject.type];

      this._collider.emit(TriggerEventObject.type, TriggerEventObject); // adapt 


      TriggerEventObject.type = event.event;

      this._collider.emit(TriggerEventObject.type, TriggerEventObject);
    }
  };

  _createClass(CannonShape, [{
    key: "shape",
    get: function get() {
      return this._shape;
    }
  }, {
    key: "collider",
    get: function get() {
      return this._collider;
    }
  }, {
    key: "attachedRigidBody",
    get: function get() {
      if (this._sharedBody.wrappedBody) {
        return this._sharedBody.wrappedBody.rigidBody;
      }

      return null;
    }
  }, {
    key: "sharedBody",
    get: function get() {
      return this._sharedBody;
    }
  }, {
    key: "material",
    set: function set(mat) {
      if (mat == null) {
        this._shape.material = null;
      } else {
        if (CannonShape.idToMaterial[mat._uuid] == null) {
          CannonShape.idToMaterial[mat._uuid] = new _cannon["default"].Material(mat._uuid);
        }

        this._shape.material = CannonShape.idToMaterial[mat._uuid];
        this._shape.material.friction = mat.friction;
        this._shape.material.restitution = mat.restitution;
      }
    }
  }, {
    key: "isTrigger",
    set: function set(v) {
      this._shape.collisionResponse = !v;

      if (this._index >= 0) {
        this._body.updateHasTrigger();
      }
    }
  }, {
    key: "center",
    set: function set(v) {
      this._setCenter(v);

      if (this._index >= 0) {
        (0, _cannonUtil.commitShapeUpdates)(this._body);
      }
    }
  }, {
    key: "_body",
    get: function get() {
      return this._sharedBody.body;
    }
  }]);

  return CannonShape;
}();

exports.CannonShape = CannonShape;
CannonShape.idToMaterial = {};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BoeXNpY3MvY2Fubm9uL3NoYXBlcy9jYW5ub24tc2hhcGUudHMiXSwibmFtZXMiOlsiVHJpZ2dlckV2ZW50T2JqZWN0IiwidHlwZSIsInNlbGZDb2xsaWRlciIsIm90aGVyQ29sbGlkZXIiLCJWZWMzIiwiY2MiLCJ2M18wIiwiQ2Fubm9uU2hhcGUiLCJfY29sbGlkZXIiLCJfc2hhcGUiLCJfb2Zmc2V0IiwiQ0FOTk9OIiwiX29yaWVudCIsIlF1YXRlcm5pb24iLCJfaW5kZXgiLCJfc2hhcmVkQm9keSIsIm9uVHJpZ2dlckxpc3RlbmVyIiwib25UcmlnZ2VyIiwiYmluZCIsIl9fcHJlbG9hZCIsImNvbXAiLCJhZGRFdmVudExpc3RlbmVyIiwiZGlyZWN0b3IiLCJnZXRQaHlzaWNzM0RNYW5hZ2VyIiwicGh5c2ljc1dvcmxkIiwiZ2V0U2hhcmVkQm9keSIsIm5vZGUiLCJyZWZlcmVuY2UiLCJvbkxvYWQiLCJjZW50ZXIiLCJpc1RyaWdnZXIiLCJvbkVuYWJsZSIsImFkZFNoYXBlIiwiZW5hYmxlZCIsIm9uRGlzYWJsZSIsInJlbW92ZVNoYXBlIiwib25EZXN0cm95IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIldvcmxkIiwiaWQiLCJzZXRTY2FsZSIsInNjYWxlIiwiX3NldENlbnRlciIsInNldEluZGV4IiwiaW5kZXgiLCJzZXRPZmZzZXRBbmRPcmllbnQiLCJvZmZzZXQiLCJvcmllbnQiLCJjb3B5IiwidiIsImxwb3MiLCJnZXRXb3JsZFNjYWxlIiwibXVsdGlwbHkiLCJldmVudCIsInNlbGYiLCJzZWxmU2hhcGUiLCJvdGhlciIsIm90aGVyU2hhcGUiLCJjb2xsaWRlciIsImRlcHJlY2F0ZWRFdmVudE1hcCIsImVtaXQiLCJ3cmFwcGVkQm9keSIsInJpZ2lkQm9keSIsIm1hdCIsIm1hdGVyaWFsIiwiaWRUb01hdGVyaWFsIiwiX3V1aWQiLCJNYXRlcmlhbCIsImZyaWN0aW9uIiwicmVzdGl0dXRpb24iLCJj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QUF4QztBQUNIO0FBQ0o7OztTQUVELGFBQWVwQixDQUFmLEVBQTJCO0FBQ3ZCLFdBQUt4QyxNQUFMLENBQVk2RCxpQkFBWixHQUFnQyxDQUFDckIsQ0FBakM7O0FBQ0EsVUFBSSxLQUFLbkMsTUFBTCxJQUFlLENBQW5CLEVBQXNCO0FBQ2xCLGFBQUt5RCxLQUFMLENBQVdDLGdCQUFYO0FBQ0g7QUFDSjs7O1NBRUQsYUFBWXZCLENBQVosRUFBMEI7QUFDdEIsV0FBS1AsVUFBTCxDQUFnQk8sQ0FBaEI7O0FBQ0EsVUFBSSxLQUFLbkMsTUFBTCxJQUFlLENBQW5CLEVBQXNCO0FBQ2xCLDRDQUFtQixLQUFLeUQsS0FBeEI7QUFDSDtBQUNKOzs7U0FTRCxlQUFvQztBQUFFLGFBQU8sS0FBS3hELFdBQUwsQ0FBaUIwRCxJQUF4QjtBQUErQjs7Ozs7OztBQWxENURsRSxZQUVPMEQsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgQ0FOTk9OIGZyb20gJy4uLy4uLy4uLy4uLy4uLy4uL2V4dGVybmFsL2Nhbm5vbi9jYW5ub24nO1xuaW1wb3J0IHsgZ2V0V3JhcCwgc2V0V3JhcCB9IGZyb20gJy4uLy4uL2ZyYW1ld29yay91dGlsJztcbmltcG9ydCB7IGNvbW1pdFNoYXBlVXBkYXRlcywgZGVwcmVjYXRlZEV2ZW50TWFwIH0gZnJvbSAnLi4vY2Fubm9uLXV0aWwnO1xuaW1wb3J0IHsgUGh5c2ljc01hdGVyaWFsIH0gZnJvbSAnLi4vLi4vZnJhbWV3b3JrL2Fzc2V0cy9waHlzaWNzLW1hdGVyaWFsJztcbmltcG9ydCB7IElCYXNlU2hhcGUgfSBmcm9tICcuLi8uLi9zcGVjL2ktcGh5c2ljcy1zaGFwZSc7XG5pbXBvcnQgeyBJVmVjM0xpa2UgfSBmcm9tICcuLi8uLi9zcGVjL2ktY29tbW9uJztcbmltcG9ydCB7IENhbm5vblNoYXJlZEJvZHkgfSBmcm9tICcuLi9jYW5ub24tc2hhcmVkLWJvZHknO1xuaW1wb3J0IHsgQ2Fubm9uV29ybGQgfSBmcm9tICcuLi9jYW5ub24td29ybGQnO1xuaW1wb3J0IHsgVHJpZ2dlckV2ZW50VHlwZSB9IGZyb20gJy4uLy4uL2ZyYW1ld29yay9waHlzaWNzLWludGVyZmFjZSc7XG5pbXBvcnQgeyBDb2xsaWRlcjNEIH0gZnJvbSAnLi4vLi4vZnJhbWV3b3JrJztcblxuY29uc3QgVHJpZ2dlckV2ZW50T2JqZWN0ID0ge1xuICAgIHR5cGU6ICd0cmlnZ2VyLWVudGVyJyBhcyBUcmlnZ2VyRXZlbnRUeXBlLFxuICAgIHNlbGZDb2xsaWRlcjogbnVsbCBhcyBDb2xsaWRlcjNEIHwgbnVsbCxcbiAgICBvdGhlckNvbGxpZGVyOiBudWxsIGFzIENvbGxpZGVyM0QgfCBudWxsLFxufTtcblxuY29uc3QgVmVjMyA9IGNjLlZlYzM7XG5jb25zdCB2M18wID0gbmV3IFZlYzMoKTtcblxuZXhwb3J0IGNsYXNzIENhbm5vblNoYXBlIGltcGxlbWVudHMgSUJhc2VTaGFwZSB7XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgaWRUb01hdGVyaWFsID0ge307XG5cbiAgICBnZXQgc2hhcGUgKCkgeyByZXR1cm4gdGhpcy5fc2hhcGUhOyB9XG5cbiAgICBnZXQgY29sbGlkZXIgKCkgeyByZXR1cm4gdGhpcy5fY29sbGlkZXI7IH1cblxuICAgIGdldCBhdHRhY2hlZFJpZ2lkQm9keSAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9zaGFyZWRCb2R5LndyYXBwZWRCb2R5KSB7IHJldHVybiB0aGlzLl9zaGFyZWRCb2R5LndyYXBwZWRCb2R5LnJpZ2lkQm9keTsgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXQgc2hhcmVkQm9keSAoKTogQ2Fubm9uU2hhcmVkQm9keSB7IHJldHVybiB0aGlzLl9zaGFyZWRCb2R5OyB9XG5cbiAgICBzZXQgbWF0ZXJpYWwgKG1hdDogUGh5c2ljc01hdGVyaWFsKSB7XG4gICAgICAgIGlmIChtYXQgPT0gbnVsbCkge1xuICAgICAgICAgICAgKHRoaXMuX3NoYXBlIS5tYXRlcmlhbCBhcyB1bmtub3duKSA9IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoQ2Fubm9uU2hhcGUuaWRUb01hdGVyaWFsW21hdC5fdXVpZF0gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIENhbm5vblNoYXBlLmlkVG9NYXRlcmlhbFttYXQuX3V1aWRdID0gbmV3IENBTk5PTi5NYXRlcmlhbChtYXQuX3V1aWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9zaGFwZSEubWF0ZXJpYWwgPSBDYW5ub25TaGFwZS5pZFRvTWF0ZXJpYWxbbWF0Ll91dWlkXTtcbiAgICAgICAgICAgIHRoaXMuX3NoYXBlIS5tYXRlcmlhbC5mcmljdGlvbiA9IG1hdC5mcmljdGlvbjtcbiAgICAgICAgICAgIHRoaXMuX3NoYXBlIS5tYXRlcmlhbC5yZXN0aXR1dGlvbiA9IG1hdC5yZXN0aXR1dGlvbjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldCBpc1RyaWdnZXIgKHY6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fc2hhcGUuY29sbGlzaW9uUmVzcG9uc2UgPSAhdjtcbiAgICAgICAgaWYgKHRoaXMuX2luZGV4ID49IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkudXBkYXRlSGFzVHJpZ2dlcigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0IGNlbnRlciAodjogSVZlYzNMaWtlKSB7XG4gICAgICAgIHRoaXMuX3NldENlbnRlcih2KTtcbiAgICAgICAgaWYgKHRoaXMuX2luZGV4ID49IDApIHtcbiAgICAgICAgICAgIGNvbW1pdFNoYXBlVXBkYXRlcyh0aGlzLl9ib2R5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9jb2xsaWRlciE6IENvbGxpZGVyM0Q7XG5cbiAgICBwcm90ZWN0ZWQgX3NoYXBlITogQ0FOTk9OLlNoYXBlO1xuICAgIHByb3RlY3RlZCBfb2Zmc2V0ID0gbmV3IENBTk5PTi5WZWMzKCk7XG4gICAgcHJvdGVjdGVkIF9vcmllbnQgPSBuZXcgQ0FOTk9OLlF1YXRlcm5pb24oKTtcbiAgICBwcm90ZWN0ZWQgX2luZGV4OiBudW1iZXIgPSAtMTtcbiAgICBwcm90ZWN0ZWQgX3NoYXJlZEJvZHkhOiBDYW5ub25TaGFyZWRCb2R5O1xuICAgIHByb3RlY3RlZCBnZXQgX2JvZHkgKCk6IENBTk5PTi5Cb2R5IHsgcmV0dXJuIHRoaXMuX3NoYXJlZEJvZHkuYm9keTsgfVxuICAgIHByb3RlY3RlZCBvblRyaWdnZXJMaXN0ZW5lciA9IHRoaXMub25UcmlnZ2VyLmJpbmQodGhpcyk7XG5cbiAgICAvKiogTElGRUNZQ0xFICovXG5cbiAgICBfX3ByZWxvYWQgKGNvbXA6IENvbGxpZGVyM0QpIHtcbiAgICAgICAgdGhpcy5fY29sbGlkZXIgPSBjb21wO1xuICAgICAgICBzZXRXcmFwKHRoaXMuX3NoYXBlLCB0aGlzKTtcbiAgICAgICAgdGhpcy5fc2hhcGUuYWRkRXZlbnRMaXN0ZW5lcignY2MtdHJpZ2dlcicsIHRoaXMub25UcmlnZ2VyTGlzdGVuZXIpO1xuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5ID0gKGNjLmRpcmVjdG9yLmdldFBoeXNpY3MzRE1hbmFnZXIoKS5waHlzaWNzV29ybGQgYXMgQ2Fubm9uV29ybGQpLmdldFNoYXJlZEJvZHkodGhpcy5fY29sbGlkZXIubm9kZSk7XG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkucmVmZXJlbmNlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBvbkxvYWQgKCkge1xuICAgICAgICB0aGlzLmNlbnRlciA9IHRoaXMuX2NvbGxpZGVyLmNlbnRlcjtcbiAgICAgICAgdGhpcy5pc1RyaWdnZXIgPSB0aGlzLl9jb2xsaWRlci5pc1RyaWdnZXI7XG4gICAgfVxuXG4gICAgb25FbmFibGUgKCkge1xuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LmFkZFNoYXBlKHRoaXMpO1xuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LmVuYWJsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIG9uRGlzYWJsZSAoKSB7XG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkucmVtb3ZlU2hhcGUodGhpcyk7XG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuZW5hYmxlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIG9uRGVzdHJveSAoKSB7XG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkucmVmZXJlbmNlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3NoYXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NjLXRyaWdnZXInLCB0aGlzLm9uVHJpZ2dlckxpc3RlbmVyKTtcbiAgICAgICAgZGVsZXRlIENBTk5PTi5Xb3JsZFsnaWRUb1NoYXBlTWFwJ11bdGhpcy5fc2hhcGUuaWRdO1xuICAgICAgICAodGhpcy5fc2hhcmVkQm9keSBhcyBhbnkpID0gbnVsbDtcbiAgICAgICAgc2V0V3JhcCh0aGlzLl9zaGFwZSwgbnVsbCk7XG4gICAgICAgICh0aGlzLl9vZmZzZXQgYXMgYW55KSA9IG51bGw7XG4gICAgICAgICh0aGlzLl9vcmllbnQgYXMgYW55KSA9IG51bGw7XG4gICAgICAgICh0aGlzLl9zaGFwZSBhcyBhbnkpID0gbnVsbDtcbiAgICAgICAgKHRoaXMuX2NvbGxpZGVyIGFzIGFueSkgPSBudWxsO1xuICAgICAgICAodGhpcy5vblRyaWdnZXJMaXN0ZW5lciBhcyBhbnkpID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjaGFuZ2Ugc2NhbGUgd2lsbCByZWNhbGN1bGF0ZSBjZW50ZXIgJiBzaXplIFxcXG4gICAgICogc2l6ZSBoYW5kbGUgYnkgY2hpbGQgY2xhc3NcbiAgICAgKiBAcGFyYW0gc2NhbGUgXG4gICAgICovXG4gICAgc2V0U2NhbGUgKHNjYWxlOiBJVmVjM0xpa2UpIHtcbiAgICAgICAgdGhpcy5fc2V0Q2VudGVyKHRoaXMuX2NvbGxpZGVyLmNlbnRlcik7XG4gICAgfVxuXG4gICAgc2V0SW5kZXggKGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5faW5kZXggPSBpbmRleDtcbiAgICB9XG5cbiAgICBzZXRPZmZzZXRBbmRPcmllbnQgKG9mZnNldDogQ0FOTk9OLlZlYzMsIG9yaWVudDogQ0FOTk9OLlF1YXRlcm5pb24pIHtcbiAgICAgICAgY2MuVmVjMy5jb3B5KG9mZnNldCwgdGhpcy5fb2Zmc2V0KTtcbiAgICAgICAgY2MuVmVjMy5jb3B5KG9yaWVudCwgdGhpcy5fb3JpZW50KTtcbiAgICAgICAgdGhpcy5fb2Zmc2V0ID0gb2Zmc2V0O1xuICAgICAgICB0aGlzLl9vcmllbnQgPSBvcmllbnQ7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIF9zZXRDZW50ZXIgKHY6IElWZWMzTGlrZSkge1xuICAgICAgICBjb25zdCBscG9zID0gdGhpcy5fb2Zmc2V0IGFzIElWZWMzTGlrZTtcbiAgICAgICAgVmVjMy5jb3B5KGxwb3MsIHYpO1xuICAgICAgICB0aGlzLl9jb2xsaWRlci5ub2RlLmdldFdvcmxkU2NhbGUodjNfMCk7XG4gICAgICAgIFZlYzMubXVsdGlwbHkobHBvcywgbHBvcywgdjNfMCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvblRyaWdnZXIgKGV2ZW50OiBDQU5OT04uSVRyaWdnZXJlZEV2ZW50KSB7XG4gICAgICAgIFRyaWdnZXJFdmVudE9iamVjdC50eXBlID0gZXZlbnQuZXZlbnQ7XG4gICAgICAgIGNvbnN0IHNlbGYgPSBnZXRXcmFwPENhbm5vblNoYXBlPihldmVudC5zZWxmU2hhcGUpO1xuICAgICAgICBjb25zdCBvdGhlciA9IGdldFdyYXA8Q2Fubm9uU2hhcGU+KGV2ZW50Lm90aGVyU2hhcGUpO1xuXG4gICAgICAgIGlmIChzZWxmKSB7XG4gICAgICAgICAgICBUcmlnZ2VyRXZlbnRPYmplY3Quc2VsZkNvbGxpZGVyID0gc2VsZi5jb2xsaWRlcjtcbiAgICAgICAgICAgIFRyaWdnZXJFdmVudE9iamVjdC5vdGhlckNvbGxpZGVyID0gb3RoZXIgPyBvdGhlci5jb2xsaWRlciA6IG51bGw7XG4gICAgICAgICAgICBUcmlnZ2VyRXZlbnRPYmplY3QudHlwZSA9IGRlcHJlY2F0ZWRFdmVudE1hcFtUcmlnZ2VyRXZlbnRPYmplY3QudHlwZV07XG4gICAgICAgICAgICB0aGlzLl9jb2xsaWRlci5lbWl0KFRyaWdnZXJFdmVudE9iamVjdC50eXBlLCBUcmlnZ2VyRXZlbnRPYmplY3QpO1xuICAgICAgICAgICAgLy8gYWRhcHQgXG4gICAgICAgICAgICBUcmlnZ2VyRXZlbnRPYmplY3QudHlwZSA9IGV2ZW50LmV2ZW50O1xuICAgICAgICAgICAgdGhpcy5fY29sbGlkZXIuZW1pdChUcmlnZ2VyRXZlbnRPYmplY3QudHlwZSwgVHJpZ2dlckV2ZW50T2JqZWN0KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiLyJ9