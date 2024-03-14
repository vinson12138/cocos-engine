
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/cocos/builtin-shared-body.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.BuiltinSharedBody = void 0;

var _util = require("../framework/util");

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var intersect = cc.geomUtils.intersect;
var fastRemove = cc.js.array.fastRemove;
var v3_0 = new cc.Vec3();
var v3_1 = new cc.Vec3();
var quat_0 = new cc.Quat();
/**
 * Built-in static collider, no physical forces involved
 */

var BuiltinSharedBody = /*#__PURE__*/function () {
  BuiltinSharedBody.getSharedBody = function getSharedBody(node, wrappedWorld) {
    var key = node._id;

    if (BuiltinSharedBody.sharedBodiesMap.has(key)) {
      return BuiltinSharedBody.sharedBodiesMap.get(key);
    } else {
      var newSB = new BuiltinSharedBody(node, wrappedWorld);
      BuiltinSharedBody.sharedBodiesMap.set(node._id, newSB);
      return newSB;
    }
  };

  function BuiltinSharedBody(node, world) {
    this._id = void 0;
    this.index = -1;
    this.ref = 0;
    this.node = void 0;
    this.world = void 0;
    this.shapes = [];
    this._id = BuiltinSharedBody.idCounter++;
    this.node = node;
    this.world = world;
  }

  var _proto = BuiltinSharedBody.prototype;

  _proto.intersects = function intersects(body) {
    for (var i = 0; i < this.shapes.length; i++) {
      var shapeA = this.shapes[i];

      for (var j = 0; j < body.shapes.length; j++) {
        var shapeB = body.shapes[j];

        if (intersect.resolve(shapeA.worldShape, shapeB.worldShape)) {
          this.world.shapeArr.push(shapeA);
          this.world.shapeArr.push(shapeB);
        }
      }
    }
  };

  _proto.addShape = function addShape(shape) {
    var i = this.shapes.indexOf(shape);

    if (i < 0) {
      this.shapes.push(shape);
    }
  };

  _proto.removeShape = function removeShape(shape) {
    fastRemove(this.shapes, shape);
  };

  _proto.syncSceneToPhysics = function syncSceneToPhysics(force) {
    if (force === void 0) {
      force = false;
    }

    var node = this.node;
    var needUpdateTransform = (0, _util.worldDirty)(node);
    if (!force && !needUpdateTransform) return;
    node.getWorldPosition(v3_0);
    node.getWorldRotation(quat_0);
    node.getWorldScale(v3_1);

    for (var i = 0; i < this.shapes.length; i++) {
      this.shapes[i].transform(node._worldMatrix, v3_0, quat_0, v3_1);
    }
  };

  _proto.destory = function destory() {
    BuiltinSharedBody.sharedBodiesMap["delete"](this.node._id);
    this.node = null;
    this.world = null;
    this.shapes = null;
  };

  _createClass(BuiltinSharedBody, [{
    key: "id",
    get: function get() {
      return this._id;
    }
    /**
     * add or remove from world \
     * add, if enable \
     * remove, if disable & shapes.length == 0 & wrappedBody disable
     */

  }, {
    key: "enabled",
    set: function set(v) {
      if (v) {
        if (this.index < 0) {
          this.index = this.world.bodies.length;
          this.world.addSharedBody(this);
          this.syncSceneToPhysics(true);
        }
      } else {
        if (this.index >= 0) {
          var isRemove = this.shapes.length == 0;

          if (isRemove) {
            this.index = -1;
            this.world.removeSharedBody(this);
          }
        }
      }
    }
  }, {
    key: "reference",
    set: function set(v) {
      v ? this.ref++ : this.ref--;

      if (this.ref == 0) {
        this.destory();
      }
    }
    /** id generator */

  }]);

  return BuiltinSharedBody;
}();

exports.BuiltinSharedBody = BuiltinSharedBody;
BuiltinSharedBody.sharedBodiesMap = new Map();
BuiltinSharedBody.idCounter = 0;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BoeXNpY3MvY29jb3MvYnVpbHRpbi1zaGFyZWQtYm9keS50cyJdLCJuYW1lcyI6WyJpbnRlcnNlY3QiLCJjYyIsImdlb21VdGlscyIsImZhc3RSZW1vdmUiLCJqcyIsImFycmF5IiwidjNfMCIsIlZlYzMiLCJ2M18xIiwicXVhdF8wIiwiUXVhdCIsIkJ1aWx0aW5TaGFyZWRCb2R5IiwiZ2V0U2hhcmVkQm9keSIsIm5vZGUiLCJ3cmFwcGVkV29ybGQiLCJrZXkiLCJfaWQiLCJzaGFyZWRCb2RpZXNNYXAiLCJoYXMiLCJnZXQiLCJuZXdTQiIsInNldCIsIndvcmxkIiwiaW5kZXgiLCJyZWYiLCJzaGFwZXMiLCJpZENvdW50ZXIiLCJpbnRlcnNlY3RzIiwiYm9keSIsImkiLCJsZW5ndGgiLCJzaGFwZUEiLCJqIiwic2hhcGVCIiwicmVzb2x2ZSIsIndvcmxkU2hhcGUiLCJzaGFwZUFyciIsInB1c2giLCJhZGRTaGFwZSIsInNoYXBlIiwiaW5kZXhPZiIsInJlbW92ZVNoYXBlIiwic3luY1NjZW5lVG9QaHlzaWNzIiwiZm9yY2UiLCJuZWVkVXBkYXRlVHJhbnNmb3JtIiwiZ2V0V29ybGRQb3NpdGlvbiIsImdldFdvcmxkUm90YXRpb24iLCJnZXRXb3JsZFNjYWxlIiwidHJhbnNmb3JtIiwiX3dvcmxkTWF0cml4IiwiZGVzdG9yeSIsInYiLCJib2RpZXMiLCJhZGRTaGFyZWRCb2R5IiwiaXNSZW1vdmUiLCJyZW1vdmVTaGFyZWRCb2R5IiwiTWFwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBOzs7Ozs7QUFFQSxJQUFNQSxTQUFTLEdBQUdDLEVBQUUsQ0FBQ0MsU0FBSCxDQUFhRixTQUEvQjtBQUNBLElBQU1HLFVBQVUsR0FBR0YsRUFBRSxDQUFDRyxFQUFILENBQU1DLEtBQU4sQ0FBWUYsVUFBL0I7QUFDQSxJQUFNRyxJQUFJLEdBQUcsSUFBSUwsRUFBRSxDQUFDTSxJQUFQLEVBQWI7QUFDQSxJ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USxHQUFJLEtBQUs3QixNQUFMLENBQVlLLE1BQVosSUFBc0IsQ0FBeEM7O0FBQ0EsY0FBSXdCLFFBQUosRUFBYztBQUNWLGlCQUFLL0IsS0FBTCxHQUFhLENBQUMsQ0FBZDtBQUNBLGlCQUFLRCxLQUFMLENBQVdpQyxnQkFBWCxDQUE0QixJQUE1QjtBQUNIO0FBQ0o7QUFDSjtBQUNKOzs7U0FFRCxhQUFlSixDQUFmLEVBQTJCO0FBQ3ZCQSxNQUFBQSxDQUFDLEdBQUcsS0FBSzNCLEdBQUwsRUFBSCxHQUFnQixLQUFLQSxHQUFMLEVBQWpCOztBQUNBLFVBQUksS0FBS0EsR0FBTCxJQUFZLENBQWhCLEVBQW1CO0FBQUUsYUFBSzBCLE9BQUw7QUFBaUI7QUFDekM7QUFFRDs7Ozs7Ozs7QUEvQ1N2QyxrQkFFZU0sa0JBQWtCLElBQUl1QyxHQUFKO0FBRmpDN0Msa0JBZ0RNZSxZQUFvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuaW1wb3J0IHsgQnVpbHRJbldvcmxkIH0gZnJvbSAnLi9idWlsdGluLXdvcmxkJztcbmltcG9ydCB7IEJ1aWx0aW5TaGFwZSB9IGZyb20gJy4vc2hhcGVzL2J1aWx0aW4tc2hhcGUnO1xuaW1wb3J0IHsgd29ybGREaXJ0eSB9IGZyb20gXCIuLi9mcmFtZXdvcmsvdXRpbFwiXG5cbmNvbnN0IGludGVyc2VjdCA9IGNjLmdlb21VdGlscy5pbnRlcnNlY3Q7XG5jb25zdCBmYXN0UmVtb3ZlID0gY2MuanMuYXJyYXkuZmFzdFJlbW92ZTtcbmNvbnN0IHYzXzAgPSBuZXcgY2MuVmVjMygpO1xuY29uc3QgdjNfMSA9IG5ldyBjYy5WZWMzKCk7XG5jb25zdCBxdWF0XzAgPSBuZXcgY2MuUXVhdCgpO1xuXG5cbi8qKlxuICogQnVpbHQtaW4gc3RhdGljIGNvbGxpZGVyLCBubyBwaHlzaWNhbCBmb3JjZXMgaW52b2x2ZWRcbiAqL1xuZXhwb3J0IGNsYXNzIEJ1aWx0aW5TaGFyZWRCb2R5IHtcblxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IHNoYXJlZEJvZGllc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBCdWlsdGluU2hhcmVkQm9keT4oKTtcblxuICAgIHN0YXRpYyBnZXRTaGFyZWRCb2R5IChub2RlOiBjYy5Ob2RlLCB3cmFwcGVkV29ybGQ6IEJ1aWx0SW5Xb3JsZCkge1xuICAgICAgICBjb25zdCBrZXkgPSBub2RlLl9pZDtcbiAgICAgICAgaWYgKEJ1aWx0aW5TaGFyZWRCb2R5LnNoYXJlZEJvZGllc01hcC5oYXMoa2V5KSkge1xuICAgICAgICAgICAgcmV0dXJuIEJ1aWx0aW5TaGFyZWRCb2R5LnNoYXJlZEJvZGllc01hcC5nZXQoa2V5KSE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBuZXdTQiA9IG5ldyBCdWlsdGluU2hhcmVkQm9keShub2RlLCB3cmFwcGVkV29ybGQpO1xuICAgICAgICAgICAgQnVpbHRpblNoYXJlZEJvZHkuc2hhcmVkQm9kaWVzTWFwLnNldChub2RlLl9pZCwgbmV3U0IpO1xuICAgICAgICAgICAgcmV0dXJuIG5ld1NCO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGlkICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCBvciByZW1vdmUgZnJvbSB3b3JsZCBcXFxuICAgICAqIGFkZCwgaWYgZW5hYmxlIFxcXG4gICAgICogcmVtb3ZlLCBpZiBkaXNhYmxlICYgc2hhcGVzLmxlbmd0aCA9PSAwICYgd3JhcHBlZEJvZHkgZGlzYWJsZVxuICAgICAqL1xuICAgIHNldCBlbmFibGVkICh2OiBib29sZWFuKSB7XG4gICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbmRleCA8IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4ID0gdGhpcy53b3JsZC5ib2RpZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHRoaXMud29ybGQuYWRkU2hhcmVkQm9keSh0aGlzKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN5bmNTY2VuZVRvUGh5c2ljcyh0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc1JlbW92ZSA9ICh0aGlzLnNoYXBlcy5sZW5ndGggPT0gMCk7XG4gICAgICAgICAgICAgICAgaWYgKGlzUmVtb3ZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZXggPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZC5yZW1vdmVTaGFyZWRCb2R5KHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldCByZWZlcmVuY2UgKHY6IGJvb2xlYW4pIHtcbiAgICAgICAgdiA/IHRoaXMucmVmKysgOiB0aGlzLnJlZi0tO1xuICAgICAgICBpZiAodGhpcy5yZWYgPT0gMCkgeyB0aGlzLmRlc3RvcnkoKTsgfVxuICAgIH1cblxuICAgIC8qKiBpZCBnZW5lcmF0b3IgKi9cbiAgICBwcml2YXRlIHN0YXRpYyBpZENvdW50ZXI6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfaWQ6IG51bWJlcjtcbiAgICBwcml2YXRlIGluZGV4OiBudW1iZXIgPSAtMTtcbiAgICBwcml2YXRlIHJlZjogbnVtYmVyID0gMDtcblxuICAgIHJlYWRvbmx5IG5vZGU6IGNjLk5vZGU7XG4gICAgcmVhZG9ubHkgd29ybGQ6IEJ1aWx0SW5Xb3JsZDtcbiAgICByZWFkb25seSBzaGFwZXM6IEJ1aWx0aW5TaGFwZVtdID0gW107XG5cbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yIChub2RlOiBjYy5Ob2RlLCB3b3JsZDogQnVpbHRJbldvcmxkKSB7XG4gICAgICAgIHRoaXMuX2lkID0gQnVpbHRpblNoYXJlZEJvZHkuaWRDb3VudGVyKys7XG4gICAgICAgIHRoaXMubm9kZSA9IG5vZGU7XG4gICAgICAgIHRoaXMud29ybGQgPSB3b3JsZDtcbiAgICB9XG5cbiAgICBpbnRlcnNlY3RzIChib2R5OiBCdWlsdGluU2hhcmVkQm9keSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2hhcGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBzaGFwZUEgPSB0aGlzLnNoYXBlc1tpXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBib2R5LnNoYXBlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNoYXBlQiA9IGJvZHkuc2hhcGVzW2pdO1xuXG4gICAgICAgICAgICAgICAgaWYgKGludGVyc2VjdC5yZXNvbHZlKHNoYXBlQS53b3JsZFNoYXBlLCBzaGFwZUIud29ybGRTaGFwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZC5zaGFwZUFyci5wdXNoKHNoYXBlQSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGQuc2hhcGVBcnIucHVzaChzaGFwZUIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZFNoYXBlIChzaGFwZTogQnVpbHRpblNoYXBlKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGkgPSB0aGlzLnNoYXBlcy5pbmRleE9mKHNoYXBlKTtcbiAgICAgICAgaWYgKGkgPCAwKSB7XG4gICAgICAgICAgICB0aGlzLnNoYXBlcy5wdXNoKHNoYXBlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZVNoYXBlIChzaGFwZTogQnVpbHRpblNoYXBlKTogdm9pZCB7XG4gICAgICAgIGZhc3RSZW1vdmUodGhpcy5zaGFwZXMsIHNoYXBlKTtcbiAgICB9XG5cbiAgICBzeW5jU2NlbmVUb1BoeXNpY3MgKGZvcmNlOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLm5vZGU7XG4gICAgICAgIGxldCBuZWVkVXBkYXRlVHJhbnNmb3JtID0gd29ybGREaXJ0eShub2RlKTtcbiAgICAgICAgaWYgKCFmb3JjZSAmJiAhbmVlZFVwZGF0ZVRyYW5zZm9ybSkgcmV0dXJuO1xuXG4gICAgICAgIG5vZGUuZ2V0V29ybGRQb3NpdGlvbih2M18wKTtcbiAgICAgICAgbm9kZS5nZXRXb3JsZFJvdGF0aW9uKHF1YXRfMClcbiAgICAgICAgbm9kZS5nZXRXb3JsZFNjYWxlKHYzXzEpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2hhcGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnNoYXBlc1tpXS50cmFuc2Zvcm0obm9kZS5fd29ybGRNYXRyaXgsIHYzXzAsIHF1YXRfMCwgdjNfMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGRlc3RvcnkgKCkge1xuICAgICAgICBCdWlsdGluU2hhcmVkQm9keS5zaGFyZWRCb2RpZXNNYXAuZGVsZXRlKHRoaXMubm9kZS5faWQpO1xuICAgICAgICAodGhpcy5ub2RlIGFzIGFueSkgPSBudWxsO1xuICAgICAgICAodGhpcy53b3JsZCBhcyBhbnkpID0gbnVsbDtcbiAgICAgICAgKHRoaXMuc2hhcGVzIGFzIGFueSkgPSBudWxsO1xuICAgIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiLyJ9