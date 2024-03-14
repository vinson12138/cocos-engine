
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/collider/CCPhysicsCollider.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var PTM_RATIO = require('../CCPhysicsTypes').PTM_RATIO;

var getWorldScale = require('../utils').getWorldScale;

var b2_aabb_tmp = new b2.AABB();
/**
 * @class PhysicsCollider
 * @extends Collider
 */

var PhysicsCollider = cc.Class({
  name: 'cc.PhysicsCollider',
  "extends": cc.Collider,
  ctor: function ctor() {
    this._fixtures = [];
    this._shapes = [];
    this._inited = false;
    this._rect = cc.rect();
  },
  properties: {
    _density: 1.0,
    _sensor: false,
    _friction: 0.2,
    _restitution: 0,

    /**
     * !#en
     * The density.
     * !#zh
     * 密度
     * @property {Number} density
     * @default 1
     */
    density: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.density',
      get: function get() {
        return this._density;
      },
      set: function set(value) {
        this._density = value;
      }
    },

    /**
     * !#en
     * A sensor collider collects contact information but never generates a collision response
     * !#zh
     * 一个传感器类型的碰撞体会产生碰撞回调，但是不会发生物理碰撞效果。
     * @property {Boolean} sensor
     * @default false
     */
    sensor: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.sensor',
      get: function get() {
        return this._sensor;
      },
      set: function set(value) {
        this._sensor = value;
      }
    },

    /**
     * !#en
     * The friction coefficient, usually in the range [0,1].
     * !#zh
     * 摩擦系数，取值一般在 [0, 1] 之间
     * @property {Number} friction
     * @default 0.2
     */
    friction: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.friction',
      get: function get() {
        return this._friction;
      },
      set: function set(value) {
        this._friction = value;
      }
    },

    /**
     * !#en
     * The restitution (elasticity) usually in the range [0,1].
     * !#zh
     * 弹性系数，取值一般在 [0, 1]之间
     * @property {Number} restitution
     * @default 0
     */
    restitution: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.restitution',
      get: function get() {
        return this._restitution;
      },
      set: function set(value) {
        this._restitution = value;
      }
    },

    /**
     * !#en
     * Physics collider will find the rigidbody component on the node and set to this property.
     * !#zh
     * 碰撞体会在初始化时查找节点上是否存在刚体，如果查找成功则赋值到这个属性上。
     * @property {RigidBody} body
     * @default null
     */
    body: {
      "default": null,
      type: cc.RigidBody,
      visible: false
    }
  },
  onDisable: function onDisable() {
    this._destroy();
  },
  onEnable: function onEnable() {
    this._init();
  },
  start: function start() {
    this._init();
  },
  _getFixtureIndex: function _getFixtureIndex(fixture) {
    return this._fixtures.indexOf(fixture);
  },
  _init: function _init() {
    cc.director.getPhysicsManager().pushDelayEvent(this, '__init', []);
  },
  _destroy: function _destroy() {
    cc.director.getPhysicsManager().pushDelayEvent(this, '__destroy', []);
  },
  __init: function __init() {
    if (this._inited) return;
    var body = this.body || this.getComponent(cc.RigidBody);
    if (!body) return;

    var innerBody = body._getBody();

    if (!innerBody) return;
    var node = body.node;
    var scale = getWorldScale(node);
    this._scale = scale;
    var shapes = scale.x === 0 && scale.y === 0 ? [] : this._createShape(scale);

    if (!(shapes instanceof Array)) {
      shapes = [shapes];
    }

    var categoryBits = 1 << node.groupIndex;
    var maskBits = 0;
    var bits = cc.game.collisionMatrix[node.groupIndex];

    for (var i = 0; i < bits.length; i++) {
      if (!bits[i]) continue;
      maskBits |= 1 << i;
    }

    var filter = {
      categoryBits: categoryBits,
      maskBits: maskBits,
      groupIndex: 0
    };
    var manager = cc.director.getPhysicsManager();

    for (var _i = 0; _i < shapes.length; _i++) {
      var shape = shapes[_i];
      var fixDef = new b2.FixtureDef();
      fixDef.density = this.density;
      fixDef.isSensor = this.sensor;
      fixDef.friction = this.friction;
      fixDef.restitution = this.restitution;
      fixDef.shape = shape;
      fixDef.filter = filter;
      var fixture = innerBody.CreateFixture(fixDef);
      fixture.collider = this;

      if (body.enabledContactListener) {
        manager._registerContactFixture(fixture);
      }

      this._shapes.push(shape);

      this._fixtures.push(fixture);
    }

    this.body = body;
    this._inited = true;
  },
  __destroy: function __destroy() {
    if (!this._inited) return;
    var fixtures = this._fixtures;

    var body = this.body._getBody();

    var manager = cc.director.getPhysicsManager();

    for (var i = fixtures.length - 1; i >= 0; i--) {
      var fixture = fixtures[i];
      fixture.collider = null;

      manager._unregisterContactFixture(fixture);

      if (body) {
        body.DestroyFixture(fixture);
      }
    }

    this.body = null;
    this._fixtures.length = 0;
    this._shapes.length = 0;
    this._inited = false;
  },
  _createShape: function _createShape() {},

  /**
   * !#en
   * Apply current changes to collider, this will regenerate inner box2d fixtures.
   * !#zh
   * 应用当前 collider 中的修改，调用此函数会重新生成内部 box2d 的夹具。
   * @method apply
   */
  apply: function apply() {
    this._destroy();

    this._init();
  },

  /**
   * !#en
   * Get the world aabb of the collider
   * !#zh
   * 获取碰撞体的世界坐标系下的包围盒
   * @method getAABB
   */
  getAABB: function getAABB() {
    var MAX = 10e6;
    var minX = MAX,
        minY = MAX;
    var maxX = -MAX,
        maxY = -MAX;

    var xf = this.body._getBody().GetTransform();

    var fixtures = this._fixtures;

    for (var i = 0; i < fixtures.length; i++) {
      var shape = fixtures[i].GetShape();
      var count = shape.GetChildCount();

      for (var j = 0; j < count; j++) {
        shape.ComputeAABB(b2_aabb_tmp, xf, j);
        if (b2_aabb_tmp.lowerBound.x < minX) minX = b2_aabb_tmp.lowerBound.x;
        if (b2_aabb_tmp.lowerBound.y < minY) minY = b2_aabb_tmp.lowerBound.y;
        if (b2_aabb_tmp.upperBound.x > maxX) maxX = b2_aabb_tmp.upperBound.x;
        if (b2_aabb_tmp.upperBound.y > maxY) maxY = b2_aabb_tmp.upperBound.y;
      }
    }

    minX *= PTM_RATIO;
    minY *= PTM_RATIO;
    maxX *= PTM_RATIO;
    maxY *= PTM_RATIO;
    var r = this._rect;
    r.x = minX;
    r.y = minY;
    r.width = maxX - minX;
    r.height = maxY - minY;
    return r;
  }
});
cc.PhysicsCollider = module.exports = PhysicsCollider;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BoeXNpY3MvY29sbGlkZXIvQ0NQaHlzaWNzQ29sbGlkZXIuanMiXSwibmFtZXMiOlsiUFRNX1JBVElPIiwicmVxdWlyZSIsImdldFdvcmxkU2NhbGUiLCJiMl9hYWJiX3RtcCIsImIyIiwiQUFCQiIsIlBoeXNpY3NDb2xsaWRlciIsImNjIiwiQ2xhc3MiLCJuYW1lIiwiQ29sbGlkZXIiLCJjdG9yIiwiX2ZpeHR1cmVzIiwiX3NoYXBlcyIsIl9pbml0ZWQiLCJfcmVjdCIsInJlY3QiLCJwcm9wZXJ0aWVzIiwiX2RlbnNpdHkiLCJfc2Vuc29yIiwiX2ZyaWN0aW9uIiwiX3Jlc3RpdHV0aW9uIiwiZGVuc2l0eSIsInRvb2x0aXAiLCJDQ19ERVYiLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsInNlbnNvciIsImZyaWN0aW9uIiwicmVzdGl0dXRpb24iLCJib2R5IiwidHlwZSIsIlJpZ2lkQm9keSIsInZpc2libGUiLCJvbkRpc2FibGUiLCJfZGVzdHJveSIsIm9uRW5hYmxlIiwiX2luaXQiLCJzdGFydCIsIl9nZXRGaXh0dXJlSW5kZXgiLCJmaXh0dXJlIiwiaW5kZXhPZiIsImRpcmVjdG9yIiwiZ2V0UGh5c2ljc01hbmFnZXIiLCJwdXNoRGVsYXlFdmVudCIsIl9faW5pdCIsImdldENvbXBvbmVudCIsImlubmVyQm9keSIsIl9nZXRCb2R5Iiwibm9kZSIsInNjYWxlIiwiX3NjYWxlIiwic2hhcGVzIiwieCIsInkiLCJfY3JlYXRlU2hhcGUiLCJBcnJheSIsImNhdGVnb3J5Qml0cyIsImdyb3VwSW5kZXgiLCJtYXNrQml0cyIsImJpdHMiLCJnYW1lIiwiY29sbGlzaW9uTWF0cml4IiwiaSIsImxlbmd0aCIsImZpbHRlciIsIm1hbmFnZXIiLCJzaGFwZSIsImZpeERlZiIsIkZpeHR1cmVEZWYiLCJpc1NlbnNvciIsIkNyZWF0ZUZpeHR1cmUiLCJjb2xsaWRlciIsImVuYWJsZWRDb250YWN0TGlzdGVuZXIiLCJfcmVnaXN0ZXJDb250YWN0Rml4dHVyZSIsInB1c2giLCJfX2Rlc3Ryb3kiLCJmaXh0dXJlcyIsIl91bnJlZ2lzdGVyQ29udGFjdEZpeHR1cmUiLCJEZXN0cm95Rml4dHVyZSIsImFwcGx5IiwiZ2V0QUFCQiIsIk1BWCIsIm1pblgiLCJtaW5ZIiwibWF4WCIsIm1heFkiLCJ4ZiIsIkdldFRyYW5zZm9ybSIsIkdldFNoYXBlIiwiY291bnQiLCJHZXRDaGlsZENvdW50IiwiaiIsIkNvbXB1dGVBQUJCIiwibG93ZXJCb3VuZCIsInVwcGVyQm91bmQiLCJyIiwid2lkdGgiLCJoZWlnaHQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFJQSxTQUFTLEdBQUdDLE9BQU8sQ0FBQyxtQkFBRCxDQUFQLENBQTZCRCxTQUE3Qzs7QUFDQSxJQUFJRSxhQUFhLEdBQUdELE9BQU8sQ0FBQyxVQUFELENBQVAsQ0FBb0JDLGFBQXhDOztBQUNBLElBQUlDLFdBQVcsR0FBRyxJQUFJQyxFQUFFLENBQUNDLElBQVAsRUFBbEI7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFJQyxlQUFlLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQzNCQyxFQUFBQSxJQUFJLEVBQUUsb0JBRHFCO0FBRTNCLGFBQVNGLEVBQUUsQ0FBQ0csUUFGZTtBQUkzQkMsRUFBQUEsSUFBSSxFQUFFLGdCQUFZO0FBQ2QsU0FBS0MsU0FBTCxHQUFpQixFQUFqQjtBQUNBLFNBQUtDLE9BQUwsR0FBZSxFQUFmO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLEtBQWY7QUFDQSxTQUFLQyxLQUFMLEdBQWFSLEVBQUUsQ0FBQ1MsSUFBSCxFQUFiO0FBQ0gsR0FUMEI7QUFXM0JDLEVBQUFBLFVBQVUsRUFB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VyxDQUFDNkYsVUFBWixDQUF1QjFDLENBQXZCLEdBQTJCZ0MsSUFBL0IsRUFBcUNBLElBQUksR0FBR25GLFdBQVcsQ0FBQzZGLFVBQVosQ0FBdUIxQyxDQUE5QjtBQUNyQyxZQUFJbkQsV0FBVyxDQUFDNkYsVUFBWixDQUF1QnpDLENBQXZCLEdBQTJCZ0MsSUFBL0IsRUFBcUNBLElBQUksR0FBR3BGLFdBQVcsQ0FBQzZGLFVBQVosQ0FBdUJ6QyxDQUE5QjtBQUN4QztBQUNKOztBQUVENkIsSUFBQUEsSUFBSSxJQUFJcEYsU0FBUjtBQUNBcUYsSUFBQUEsSUFBSSxJQUFJckYsU0FBUjtBQUNBc0YsSUFBQUEsSUFBSSxJQUFJdEYsU0FBUjtBQUNBdUYsSUFBQUEsSUFBSSxJQUFJdkYsU0FBUjtBQUVBLFFBQUlpRyxDQUFDLEdBQUcsS0FBS2xGLEtBQWI7QUFDQWtGLElBQUFBLENBQUMsQ0FBQzNDLENBQUYsR0FBTThCLElBQU47QUFDQWEsSUFBQUEsQ0FBQyxDQUFDMUMsQ0FBRixHQUFNOEIsSUFBTjtBQUNBWSxJQUFBQSxDQUFDLENBQUNDLEtBQUYsR0FBVVosSUFBSSxHQUFHRixJQUFqQjtBQUNBYSxJQUFBQSxDQUFDLENBQUNFLE1BQUYsR0FBV1osSUFBSSxHQUFHRixJQUFsQjtBQUVBLFdBQU9ZLENBQVA7QUFDSDtBQTNRMEIsQ0FBVCxDQUF0QjtBQThRQTFGLEVBQUUsQ0FBQ0QsZUFBSCxHQUFxQjhGLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQi9GLGVBQXRDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuIFxudmFyIFBUTV9SQVRJTyA9IHJlcXVpcmUoJy4uL0NDUGh5c2ljc1R5cGVzJykuUFRNX1JBVElPO1xudmFyIGdldFdvcmxkU2NhbGUgPSByZXF1aXJlKCcuLi91dGlscycpLmdldFdvcmxkU2NhbGU7XG52YXIgYjJfYWFiYl90bXAgPSBuZXcgYjIuQUFCQigpO1xuXG4vKipcbiAqIEBjbGFzcyBQaHlzaWNzQ29sbGlkZXJcbiAqIEBleHRlbmRzIENvbGxpZGVyXG4gKi9cbnZhciBQaHlzaWNzQ29sbGlkZXIgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlBoeXNpY3NDb2xsaWRlcicsXG4gICAgZXh0ZW5kczogY2MuQ29sbGlkZXIsXG5cbiAgICBjdG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2ZpeHR1cmVzID0gW107XG4gICAgICAgIHRoaXMuX3NoYXBlcyA9IFtdO1xuICAgICAgICB0aGlzLl9pbml0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcmVjdCA9IGNjLnJlY3QoKTtcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBfZGVuc2l0eTogMS4wLFxuICAgICAgICBfc2Vuc29yOiBmYWxzZSxcbiAgICAgICAgX2ZyaWN0aW9uOiAwLjIsXG4gICAgICAgIF9yZXN0aXR1dGlvbjogMCxcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBkZW5zaXR5LlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOWvhuW6plxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZGVuc2l0eVxuICAgICAgICAgKiBAZGVmYXVsdCAxXG4gICAgICAgICAqL1xuICAgICAgICBkZW5zaXR5OiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5kZW5zaXR5JyxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9kZW5zaXR5O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVuc2l0eSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIEEgc2Vuc29yIGNvbGxpZGVyIGNvbGxlY3RzIGNvbnRhY3QgaW5mb3JtYXRpb24gYnV0IG5ldmVyIGdlbmVyYXRlcyBhIGNvbGxpc2lvbiByZXNwb25zZVxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOS4gOS4quS8oOaEn+WZqOexu+Wei+eahOeisOaSnuS9k+S8muS6p+eUn+eisOaSnuWbnuiwg++8jOS9huaYr+S4jeS8muWPkeeUn+eJqeeQhueisOaSnuaViOaenOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IHNlbnNvclxuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgc2Vuc29yOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5zZW5zb3InLCAgICAgICAgXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Vuc29yO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2Vuc29yICA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBmcmljdGlvbiBjb2VmZmljaWVudCwgdXN1YWxseSBpbiB0aGUgcmFuZ2UgWzAsMV0uXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5pGp5pOm57O75pWw77yM5Y+W5YC85LiA6Iis5ZyoIFswLCAxXSDkuYvpl7RcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGZyaWN0aW9uXG4gICAgICAgICAqIEBkZWZhdWx0IDAuMlxuICAgICAgICAgKi9cbiAgICAgICAgZnJpY3Rpb246IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLmZyaWN0aW9uJywgICAgICAgIFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZyaWN0aW9uO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZnJpY3Rpb24gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgcmVzdGl0dXRpb24gKGVsYXN0aWNpdHkpIHVzdWFsbHkgaW4gdGhlIHJhbmdlIFswLDFdLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOW8ueaAp+ezu+aVsO+8jOWPluWAvOS4gOiIrOWcqCBbMCwgMV3kuYvpl7RcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHJlc3RpdHV0aW9uXG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHJlc3RpdHV0aW9uOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5yZXN0aXR1dGlvbicsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVzdGl0dXRpb247XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXN0aXR1dGlvbiA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFBoeXNpY3MgY29sbGlkZXIgd2lsbCBmaW5kIHRoZSByaWdpZGJvZHkgY29tcG9uZW50IG9uIHRoZSBub2RlIGFuZCBzZXQgdG8gdGhpcyBwcm9wZXJ0eS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDnorDmkp7kvZPkvJrlnKjliJ3lp4vljJbml7bmn6Xmib7oioLngrnkuIrmmK/lkKblrZjlnKjliJrkvZPvvIzlpoLmnpzmn6Xmib7miJDlip/liJnotYvlgLzliLDov5nkuKrlsZ7mgKfkuIrjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtSaWdpZEJvZHl9IGJvZHlcbiAgICAgICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAgICAgKi9cbiAgICAgICAgYm9keToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlJpZ2lkQm9keSxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2Rlc3Ryb3koKTtcbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2luaXQoKTtcbiAgICB9LFxuICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2luaXQoKTtcbiAgICB9LFxuXG4gICAgX2dldEZpeHR1cmVJbmRleDogZnVuY3Rpb24gKGZpeHR1cmUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpeHR1cmVzLmluZGV4T2YoZml4dHVyZSk7XG4gICAgfSxcblxuICAgIF9pbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFBoeXNpY3NNYW5hZ2VyKCkucHVzaERlbGF5RXZlbnQodGhpcywgJ19faW5pdCcsIFtdKTtcbiAgICB9LFxuICAgIF9kZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFBoeXNpY3NNYW5hZ2VyKCkucHVzaERlbGF5RXZlbnQodGhpcywgJ19fZGVzdHJveScsIFtdKTtcbiAgICB9LFxuXG4gICAgX19pbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbml0ZWQpIHJldHVybjtcblxuICAgICAgICB2YXIgYm9keSA9IHRoaXMuYm9keSB8fCB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpO1xuICAgICAgICBpZiAoIWJvZHkpIHJldHVybjtcblxuICAgICAgICB2YXIgaW5uZXJCb2R5ID0gYm9keS5fZ2V0Qm9keSgpO1xuICAgICAgICBpZiAoIWlubmVyQm9keSkgcmV0dXJuO1xuXG4gICAgICAgIHZhciBub2RlID0gYm9keS5ub2RlO1xuICAgICAgICB2YXIgc2NhbGUgPSBnZXRXb3JsZFNjYWxlKG5vZGUpO1xuICAgICAgICB0aGlzLl9zY2FsZSA9IHNjYWxlO1xuXG4gICAgICAgIHZhciBzaGFwZXMgPSBzY2FsZS54ID09PSAwICYmIHNjYWxlLnkgPT09IDAgPyBbXSA6IHRoaXMuX2NyZWF0ZVNoYXBlKHNjYWxlKTtcblxuICAgICAgICBpZiAoIShzaGFwZXMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgIHNoYXBlcyA9IFtzaGFwZXNdO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNhdGVnb3J5Qml0cyA9IDEgPDwgbm9kZS5ncm91cEluZGV4O1xuICAgICAgICB2YXIgbWFza0JpdHMgPSAwO1xuICAgICAgICB2YXIgYml0cyA9IGNjLmdhbWUuY29sbGlzaW9uTWF0cml4W25vZGUuZ3JvdXBJbmRleF07XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYml0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKCFiaXRzW2ldKSBjb250aW51ZTtcbiAgICAgICAgICAgIG1hc2tCaXRzIHw9IDEgPDwgaTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmaWx0ZXIgPSB7XG4gICAgICAgICAgICBjYXRlZ29yeUJpdHM6IGNhdGVnb3J5Qml0cyxcbiAgICAgICAgICAgIG1hc2tCaXRzOiBtYXNrQml0cyxcbiAgICAgICAgICAgIGdyb3VwSW5kZXg6IDBcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbWFuYWdlciA9IGNjLmRpcmVjdG9yLmdldFBoeXNpY3NNYW5hZ2VyKCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGFwZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzaGFwZSA9IHNoYXBlc1tpXTtcblxuICAgICAgICAgICAgdmFyIGZpeERlZiA9IG5ldyBiMi5GaXh0dXJlRGVmKCk7XG4gICAgICAgICAgICBmaXhEZWYuZGVuc2l0eSA9IHRoaXMuZGVuc2l0eTtcbiAgICAgICAgICAgIGZpeERlZi5pc1NlbnNvciA9IHRoaXMuc2Vuc29yO1xuICAgICAgICAgICAgZml4RGVmLmZyaWN0aW9uID0gdGhpcy5mcmljdGlvbjtcbiAgICAgICAgICAgIGZpeERlZi5yZXN0aXR1dGlvbiA9IHRoaXMucmVzdGl0dXRpb247XG4gICAgICAgICAgICBmaXhEZWYuc2hhcGUgPSBzaGFwZTtcblxuICAgICAgICAgICAgZml4RGVmLmZpbHRlciA9IGZpbHRlcjtcblxuICAgICAgICAgICAgdmFyIGZpeHR1cmUgPSBpbm5lckJvZHkuQ3JlYXRlRml4dHVyZShmaXhEZWYpO1xuICAgICAgICAgICAgZml4dHVyZS5jb2xsaWRlciA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmIChib2R5LmVuYWJsZWRDb250YWN0TGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBtYW5hZ2VyLl9yZWdpc3RlckNvbnRhY3RGaXh0dXJlKGZpeHR1cmUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9zaGFwZXMucHVzaChzaGFwZSk7XG4gICAgICAgICAgICB0aGlzLl9maXh0dXJlcy5wdXNoKGZpeHR1cmUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcblxuICAgICAgICB0aGlzLl9pbml0ZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBfX2Rlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pbml0ZWQpIHJldHVybjtcblxuICAgICAgICB2YXIgZml4dHVyZXMgPSB0aGlzLl9maXh0dXJlcztcbiAgICAgICAgdmFyIGJvZHkgPSB0aGlzLmJvZHkuX2dldEJvZHkoKTtcbiAgICAgICAgdmFyIG1hbmFnZXIgPSBjYy5kaXJlY3Rvci5nZXRQaHlzaWNzTWFuYWdlcigpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSBmaXh0dXJlcy5sZW5ndGgtMTsgaSA+PTAgOyBpLS0pIHtcbiAgICAgICAgICAgIHZhciBmaXh0dXJlID0gZml4dHVyZXNbaV07XG4gICAgICAgICAgICBmaXh0dXJlLmNvbGxpZGVyID0gbnVsbDtcblxuICAgICAgICAgICAgbWFuYWdlci5fdW5yZWdpc3RlckNvbnRhY3RGaXh0dXJlKGZpeHR1cmUpO1xuXG4gICAgICAgICAgICBpZiAoYm9keSkge1xuICAgICAgICAgICAgICAgIGJvZHkuRGVzdHJveUZpeHR1cmUoZml4dHVyZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuYm9keSA9IG51bGw7XG4gICAgICAgIFxuICAgICAgICB0aGlzLl9maXh0dXJlcy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLl9zaGFwZXMubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5faW5pdGVkID0gZmFsc2U7XG4gICAgfSxcbiAgICBcbiAgICBfY3JlYXRlU2hhcGU6IGZ1bmN0aW9uICgpIHtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEFwcGx5IGN1cnJlbnQgY2hhbmdlcyB0byBjb2xsaWRlciwgdGhpcyB3aWxsIHJlZ2VuZXJhdGUgaW5uZXIgYm94MmQgZml4dHVyZXMuXG4gICAgICogISN6aFxuICAgICAqIOW6lOeUqOW9k+WJjSBjb2xsaWRlciDkuK3nmoTkv67mlLnvvIzosIPnlKjmraTlh73mlbDkvJrph43mlrDnlJ/miJDlhoXpg6ggYm94MmQg55qE5aS55YW344CCXG4gICAgICogQG1ldGhvZCBhcHBseVxuICAgICAqL1xuICAgIGFwcGx5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2Rlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0IHRoZSB3b3JsZCBhYWJiIG9mIHRoZSBjb2xsaWRlclxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bnorDmkp7kvZPnmoTkuJbnlYzlnZDmoIfns7vkuIvnmoTljIXlm7Tnm5JcbiAgICAgKiBAbWV0aG9kIGdldEFBQkJcbiAgICAgKi9cbiAgICBnZXRBQUJCOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBNQVggPSAxMGU2O1xuXG4gICAgICAgIHZhciBtaW5YID0gTUFYLCBtaW5ZID0gTUFYO1xuICAgICAgICB2YXIgbWF4WCA9IC1NQVgsIG1heFkgPSAtTUFYO1xuICAgICAgICBcbiAgICAgICAgdmFyIHhmID0gdGhpcy5ib2R5Ll9nZXRCb2R5KCkuR2V0VHJhbnNmb3JtKCk7XG4gICAgICAgIHZhciBmaXh0dXJlcyA9IHRoaXMuX2ZpeHR1cmVzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpeHR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc2hhcGUgPSBmaXh0dXJlc1tpXS5HZXRTaGFwZSgpO1xuICAgICAgICAgICAgdmFyIGNvdW50ID0gc2hhcGUuR2V0Q2hpbGRDb3VudCgpO1xuICAgICAgICAgICAgZm9yKHZhciBqID0gMDsgaiA8IGNvdW50OyBqKyspe1xuICAgICAgICAgICAgICAgIHNoYXBlLkNvbXB1dGVBQUJCKGIyX2FhYmJfdG1wLCB4Ziwgaik7XG4gICAgICAgICAgICAgICAgaWYgKGIyX2FhYmJfdG1wLmxvd2VyQm91bmQueCA8IG1pblgpIG1pblggPSBiMl9hYWJiX3RtcC5sb3dlckJvdW5kLng7XG4gICAgICAgICAgICAgICAgaWYgKGIyX2FhYmJfdG1wLmxvd2VyQm91bmQueSA8IG1pblkpIG1pblkgPSBiMl9hYWJiX3RtcC5sb3dlckJvdW5kLnk7XG4gICAgICAgICAgICAgICAgaWYgKGIyX2FhYmJfdG1wLnVwcGVyQm91bmQueCA+IG1heFgpIG1heFggPSBiMl9hYWJiX3RtcC51cHBlckJvdW5kLng7XG4gICAgICAgICAgICAgICAgaWYgKGIyX2FhYmJfdG1wLnVwcGVyQm91bmQueSA+IG1heFkpIG1heFkgPSBiMl9hYWJiX3RtcC51cHBlckJvdW5kLnk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBtaW5YICo9IFBUTV9SQVRJTztcbiAgICAgICAgbWluWSAqPSBQVE1fUkFUSU87XG4gICAgICAgIG1heFggKj0gUFRNX1JBVElPO1xuICAgICAgICBtYXhZICo9IFBUTV9SQVRJTztcblxuICAgICAgICB2YXIgciA9IHRoaXMuX3JlY3Q7XG4gICAgICAgIHIueCA9IG1pblg7XG4gICAgICAgIHIueSA9IG1pblk7XG4gICAgICAgIHIud2lkdGggPSBtYXhYIC0gbWluWDtcbiAgICAgICAgci5oZWlnaHQgPSBtYXhZIC0gbWluWTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiByO1xuICAgIH1cbn0pO1xuXG5jYy5QaHlzaWNzQ29sbGlkZXIgPSBtb2R1bGUuZXhwb3J0cyA9IFBoeXNpY3NDb2xsaWRlcjtcbiJdLCJzb3VyY2VSb290IjoiLyJ9