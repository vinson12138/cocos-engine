
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/CCPhysicsContact.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
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
var PTM_RATIO = require('./CCPhysicsTypes').PTM_RATIO;

var ContactType = require('./CCPhysicsTypes').ContactType;

var pools = []; // temp world manifold

var pointCache = [cc.v2(), cc.v2()];
var b2worldmanifold = new b2.WorldManifold();
/**
 * @class WorldManifold
 */

var worldmanifold = {
  /**
   * !#en
   * world contact point (point of intersection)
   * !#zh
   * 碰撞点集合
   * @property {[Vec2]} points
   */
  points: [],

  /**
   * !#en
   * a negative value indicates overlap
   * !#zh
   * 一个负数，用于指明重叠的部分
   */
  separations: [],

  /**
   * !#en
   * world vector pointing from A to B
   * !#zh
   * 世界坐标系下由 A 指向 B 的向量
   * @property {Vec2} normal
   */
  normal: cc.v2()
};
/**
 * !#en
 * A manifold point is a contact point belonging to a contact manifold. 
 * It holds details related to the geometry and dynamics of the contact points.
 * Note: the impulses are used for internal caching and may not
 * provide reliable contact forces, especially for high speed collisions.
 * !#zh
 * ManifoldPoint 是接触信息中的接触点信息。它拥有关于几何和接触点的详细信息。
 * 注意：信息中的冲量用于系统内部缓存，提供的接触力可能不是很准确，特别是高速移动中的碰撞信息。
 * @class ManifoldPoint
 */

/**
 * !#en
 * The local point usage depends on the manifold type:
 * -e_circles: the local center of circleB
 * -e_faceA: the local center of circleB or the clip point of polygonB
 * -e_faceB: the clip point of polygonA
 * !#zh
 * 本地坐标点的用途取决于 manifold 的类型
 * - e_circles: circleB 的本地中心点
 * - e_faceA: circleB 的本地中心点 或者是 polygonB 的截取点
 * - e_faceB: polygonB 的截取点
 * @property {Vec2} localPoint
 */

/**
 * !#en
 * Normal impulse.
 * !#zh
 * 法线冲量。
 * @property {Number} normalImpulse
 */

/**
 * !#en
 * Tangent impulse.
 * !#zh
 * 切线冲量。
 * @property {Number} tangentImpulse
 */

function ManifoldPoint() {
  this.localPoint = cc.v2();
  this.normalImpulse = 0;
  this.tangentImpulse = 0;
}

var manifoldPointCache = [new ManifoldPoint(), new ManifoldPoint()];
var b2manifold = new b2.Manifold();
/**
 * @class Manifold
 */

var manifold = {
  /**
   * !#en
   * Manifold type :  0: e_circles, 1: e_faceA, 2: e_faceB
   * !#zh
   * Manifold 类型 :  0: e_circles, 1: e_faceA, 2: e_faceB
   * @property {Number} type
   */
  type: 0,

  /**
   * !#en
   * The local point usage depends on the manifold type:
   * -e_circles: the local center of circleA
   * -e_faceA: the center of faceA
   * -e_faceB: the center of faceB
   * !#zh
   * 用途取决于 manifold 类型
   * -e_circles: circleA 的本地中心点
   * -e_faceA: faceA 的本地中心点
   * -e_faceB: faceB 的本地中心点
   * @property {Vec2} localPoint
   */
  localPoint: cc.v2(),

  /**
   * !#en
   * -e_circles: not used
   * -e_faceA: the normal on polygonA
   * -e_faceB: the normal on polygonB
   * !#zh
   * -e_circles: 没被使用到
   * -e_faceA: polygonA 的法向量
   * -e_faceB: polygonB 的法向量
   * @property {Vec2} localNormal
   */
  localNormal: cc.v2(),

  /**
   * !#en
   * the points of contact.
   * !#zh
   * 接触点信息。
   * @property {[ManifoldPoint]} points
   */
  points: []
};
/**
 * !#en
 * Contact impulses for reporting.
 * !#zh
 * 用于返回给回调的接触冲量。
 * @class PhysicsImpulse
 */

var impulse = {
  /**
   * !#en
   * Normal impulses.
   * !#zh
   * 法线方向的冲量
   * @property normalImpulses
   */
  normalImpulses: [],

  /**
   * !#en
   * Tangent impulses
   * !#zh
   * 切线方向的冲量
   * @property tangentImpulses
   */
  tangentImpulses: []
};
/**
 * !#en
 * PhysicsContact will be generated during begin and end collision as a parameter of the collision callback.
 * Note that contacts will be reused for speed up cpu time, so do not cache anything in the contact.
 * !#zh
 * 物理接触会在开始和结束碰撞之间生成，并作为参数传入到碰撞回调函数中。
 * 注意：传入的物理接触会被系统进行重用，所以不要在使用中缓存里面的任何信息。
 * @class PhysicsContact
 */

function PhysicsContact() {}

PhysicsContact.prototype.init = function (b2contact) {
  this.colliderA = b2contact.GetFixtureA().collider;
  this.colliderB = b2contact.GetFixtureB().collider;
  this.disabled = false;
  this.disabledOnce = false;
  this._impulse = null;
  this._inverted = false;
  this._b2contact = b2contact;
  b2contact._contact = this;
};

PhysicsContact.prototype.reset = function () {
  this.setTangentSpeed(0);
  this.resetFriction();
  this.resetRestitution();
  this.colliderA = null;
  this.colliderB = null;
  this.disabled = false;
  this._impulse = null;
  this._b2contact._contact = null;
  this._b2contact = null;
};
/**
 * !#en
 * Get the world manifold.
 * !#zh
 * 获取世界坐标系下的碰撞信息。
 * @method getWorldManifold
 * @return {WorldManifold}
 */


PhysicsContact.prototype.getWorldManifold = function () {
  var points = worldmanifold.points;
  var separations = worldmanifold.separations;
  var normal = worldmanifold.normal;

  this._b2contact.GetWorldManifold(b2worldmanifold);

  var b2points = b2worldmanifold.points;
  var b2separations = b2worldmanifold.separations;

  var count = this._b2contact.GetManifold().pointCount;

  points.length = separations.length = count;

  for (var i = 0; i < count; i++) {
    var p = pointCache[i];
    p.x = b2points[i].x * PTM_RATIO;
    p.y = b2points[i].y * PTM_RATIO;
    points[i] = p;
    separations[i] = b2separations[i] * PTM_RATIO;
  }

  normal.x = b2worldmanifold.normal.x;
  normal.y = b2worldmanifold.normal.y;

  if (this._inverted) {
    normal.x *= -1;
    normal.y *= -1;
  }

  return worldmanifold;
};
/**
 * !#en
 * Get the manifold.
 * !#zh
 * 获取本地（局部）坐标系下的碰撞信息。
 * @method getManifold
 * @return {Manifold}
 */


PhysicsContact.prototype.getManifold = function () {
  var points = manifold.points;
  var localNormal = manifold.localNormal;
  var localPoint = manifold.localPoint;

  var b2manifold = this._b2contact.GetManifold();

  var b2points = b2manifold.points;
  var count = points.length = b2manifold.pointCount;

  for (var i = 0; i < count; i++) {
    var p = manifoldPointCache[i];
    var b2p = b2points[i];
    p.localPoint.x = b2p.localPoint.x * PTM_RATIO;
    p.localPoint.Y = b2p.localPoint.Y * PTM_RATIO;
    p.normalImpulse = b2p.normalImpulse * PTM_RATIO;
    p.tangentImpulse = b2p.tangentImpulse;
    points[i] = p;
  }

  localPoint.x = b2manifold.localPoint.x * PTM_RATIO;
  localPoint.y = b2manifold.localPoint.y * PTM_RATIO;
  localNormal.x = b2manifold.localNormal.x;
  localNormal.y = b2manifold.localNormal.y;
  manifold.type = b2manifold.type;

  if (this._inverted) {
    localNormal.x *= -1;
    localNormal.y *= -1;
  }

  return manifold;
};
/**
 * !#en
 * Get the impulses.
 * Note: PhysicsImpulse can only used in onPostSolve callback.
 * !#zh
 * 获取冲量信息
 * 注意：这个信息只有在 onPostSolve 回调中才能获取到
 * @method getImpulse
 * @return {PhysicsImpulse}
 */


PhysicsContact.prototype.getImpulse = function () {
  var b2impulse = this._impulse;
  if (!b2impulse) return null;
  var normalImpulses = impulse.normalImpulses;
  var tangentImpulses = impulse.tangentImpulses;
  var count = b2impulse.count;

  for (var i = 0; i < count; i++) {
    normalImpulses[i] = b2impulse.normalImpulses[i] * PTM_RATIO;
    tangentImpulses[i] = b2impulse.tangentImpulses[i];
  }

  tangentImpulses.length = normalImpulses.length = count;
  return impulse;
};

PhysicsContact.prototype.emit = function (contactType) {
  var func;

  switch (contactType) {
    case ContactType.BEGIN_CONTACT:
      func = 'onBeginContact';
      break;

    case ContactType.END_CONTACT:
      func = 'onEndContact';
      break;

    case ContactType.PRE_SOLVE:
      func = 'onPreSolve';
      break;

    case ContactType.POST_SOLVE:
      func = 'onPostSolve';
      break;
  }

  var colliderA = this.colliderA;
  var colliderB = this.colliderB;
  var bodyA = colliderA.body;
  var bodyB = colliderB.body;
  var comps;
  var i, l, comp;

  if (bodyA.enabledContactListener) {
    comps = bodyA.node._components;
    this._inverted = false;

    for (i = 0, l = comps.length; i < l; i++) {
      comp = comps[i];

      if (comp[func]) {
        comp[func](this, colliderA, colliderB);
      }
    }
  }

  if (bodyB.enabledContactListener) {
    comps = bodyB.node._components;
    this._inverted = true;

    for (i = 0, l = comps.length; i < l; i++) {
      comp = comps[i];

      if (comp[func]) {
        comp[func](this, colliderB, colliderA);
      }
    }
  }

  if (this.disabled || this.disabledOnce) {
    this.setEnabled(false);
    this.disabledOnce = false;
  }
};

PhysicsContact.get = function (b2contact) {
  var c;

  if (pools.length === 0) {
    c = new cc.PhysicsContact();
  } else {
    c = pools.pop();
  }

  c.init(b2contact);
  return c;
};

PhysicsContact.put = function (b2contact) {
  var c = b2contact._contact;
  if (!c) return;
  pools.push(c);
  c.reset();
};

var _p = PhysicsContact.prototype;
/**
 * !#en
 * One of the collider that collided
 * !#zh
 * 发生碰撞的碰撞体之一
 * @property {Collider} colliderA
 */

/**
 * !#en
 * One of the collider that collided
 * !#zh
 * 发生碰撞的碰撞体之一
 * @property {Collider} colliderB
 */

/**
 * !#en
 * If set disabled to true, the contact will be ignored until contact end.
 * If you just want to disabled contact for current time step or sub-step, please use disabledOnce.
 * !#zh
 * 如果 disabled 被设置为 true，那么直到接触结束此接触都将被忽略。
 * 如果只是希望在当前时间步或子步中忽略此接触，请使用 disabledOnce 。
 * @property {Boolean} disabled
 */

/**
 * !#en
 * Disabled contact for current time step or sub-step.
 * !#zh
 * 在当前时间步或子步中忽略此接触。
 * @property {Boolean} disabledOnce
 */

_p.setEnabled = function (value) {
  this._b2contact.SetEnabled(value);
};
/**
 * !#en
 * Is this contact touching?
 * !#zh
 * 返回碰撞体是否已经接触到。
 * @method isTouching
 * @return {Boolean}
 */


_p.isTouching = function () {
  return this._b2contact.IsTouching();
};
/**
 * !#en
 * Set the desired tangent speed for a conveyor belt behavior.
 * !#zh
 * 为传送带设置期望的切线速度
 * @method setTangentSpeed
 * @param {Number} tangentSpeed
 */


_p.setTangentSpeed = function (value) {
  this._b2contact.SetTangentSpeed(value / PTM_RATIO);
};
/**
 * !#en
 * Get the desired tangent speed.
 * !#zh
 * 获取切线速度
 * @method getTangentSpeed
 * @return {Number}
 */


_p.getTangentSpeed = function () {
  return this._b2contact.GetTangentSpeed() * PTM_RATIO;
};
/**
 * !#en
 * Override the default friction mixture. You can call this in onPreSolve callback.
 * !#zh
 * 覆盖默认的摩擦力系数。你可以在 onPreSolve 回调中调用此函数。
 * @method setFriction
 * @param {Number} friction
 */


_p.setFriction = function (value) {
  this._b2contact.SetFriction(value);
};
/**
 * !#en
 * Get the friction.
 * !#zh
 * 获取当前摩擦力系数
 * @method getFriction
 * @return {Number}
 */


_p.getFriction = function () {
  return this._b2contact.GetFriction();
};
/**
 * !#en
 * Reset the friction mixture to the default value.
 * !#zh
 * 重置摩擦力系数到默认值
 * @method resetFriction
 */


_p.resetFriction = function () {
  return this._b2contact.ResetFriction();
};
/**
 * !#en
 * Override the default restitution mixture. You can call this in onPreSolve callback.
 * !#zh
 * 覆盖默认的恢复系数。你可以在 onPreSolve 回调中调用此函数。
 * @method setRestitution
 * @param {Number} restitution
 */


_p.setRestitution = function (value) {
  this._b2contact.SetRestitution(value);
};
/**
 * !#en
 * Get the restitution.
 * !#zh
 * 获取当前恢复系数
 * @method getRestitution
 * @return {Number}
 */


_p.getRestitution = function () {
  return this._b2contact.GetRestitution();
};
/**
 * !#en
 * Reset the restitution mixture to the default value.
 * !#zh
 * 重置恢复系数到默认值
 * @method resetRestitution
 */


_p.resetRestitution = function () {
  return this._b2contact.ResetRestitution();
};

PhysicsContact.ContactType = ContactType;
cc.PhysicsContact = module.exports = PhysicsContact;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BoeXNpY3MvQ0NQaHlzaWNzQ29udGFjdC5qcyJdLCJuYW1lcyI6WyJQVE1fUkFUSU8iLCJyZXF1aXJlIiwiQ29udGFjdFR5cGUiLCJwb29scyIsInBvaW50Q2FjaGUiLCJjYyIsInYyIiwiYjJ3b3JsZG1hbmlmb2xkIiwiYjIiLCJXb3JsZE1hbmlmb2xkIiwid29ybGRtYW5pZm9sZCIsInBvaW50cyIsInNlcGFyYXRpb25zIiwibm9ybWFsIiwiTWFuaWZvbGRQb2ludCIsImxvY2FsUG9pbnQiLCJub3JtYWxJbXB1bHNlIiwidGFuZ2VudEltcHVsc2UiLCJtYW5pZm9sZFBvaW50Q2FjaGUiLCJiMm1hbmlmb2xkIiwiTWFuaWZvbGQiLCJtYW5pZm9sZCIsInR5cGUiLCJsb2NhbE5vcm1hbCIsImltcHVsc2UiLCJub3JtYWxJbXB1bHNlcyIsInRhbmdlbnRJbXB1bHNlcyIsIlBoeXNpY3NDb250YWN0IiwicHJvdG90eXBlIiwiaW5pdCIsImIyY29udGFjdCIsImNvbGxpZGVyQSIsIkdldEZpeHR1cmVBIiwiY29sbGlkZXIiLCJjb2xsaWRlckIiLCJHZXRGaXh0dXJlQiIsImRpc2FibGVkIiwiZGlzYWJsZWRPbmNlIiwiX2ltcHVsc2UiLCJfaW52ZXJ0ZWQiLCJfYjJjb250YWN0IiwiX2NvbnRhY3QiLCJyZXNldCIsInNldFRhbmdlbnRTcGVlZCIsInJlc2V0RnJpY3Rpb24iLCJyZXNldFJlc3RpdHV0aW9uIiwiZ2V0V29ybGRNYW5pZm9sZCIsIkdldFdvcmxkTWFuaWZvbGQiLCJiMnBvaW50cyIsImIyc2VwYXJhdGlvbnMiLCJjb3VudCIsIkdldE1hbmlmb2xkIiwicG9pbnRDb3VudCIsImxlbmd0aCIsImkiLCJwIiwieCIsInkiLCJnZXRNYW5pZm9sZCIsImIycCIsIlkiLCJnZXRJbXB1bHNlIiwiYjJpbXB1bHNlIiwiZW1pdCIsImNvbnRhY3RUeXBlIiwiZnVuYyIsIkJFR0lOX0NPTlRBQ1QiLCJFTkRfQ09OVEFDVCIsIlBSRV9TT0xWRSIsIlBPU1RfU09MVkUiLCJib2R5QSIsImJvZHkiLCJib2R5QiIsImNvbXBzIiwibCIsImNvbXAiLCJlbmFibGVkQ29udGFjdExpc3RlbmVyIiwibm9kZSIsIl9jb21wb25lbnRzIiwic2V0RW5hYmxlZCIsImdldCIsImMiLCJwb3AiLCJwdXQiLCJwdXNoIiwiX3AiLCJ2YWx1ZSIsIlNldEVuYWJsZWQiLCJpc1RvdWNoaW5nIiwiSXNUb3VjaGluZyIsIlNldFRhbmdlbnRTcGVlZCIsImdldFRhbmdlbnRTcGVlZCIsIkdldFRhbmdlbnRTcGVlZCIsInNldEZyaWN0aW9uIiwiU2V0RnJpY3Rpb24iLCJnZXRGcmljdGlvbiIsIkdldEZyaWN0aW9uIiwiUmVzZXRGcmljdGlvbiIsInNldFJlc3RpdHV0aW9uIiwiU2V0UmVzdGl0dXRpb24iLCJnZXRSZXN0aXR1dGlvbiIsIkdldFJlc3RpdHV0aW9uIiwiUmVzZXRSZXN0aXR1dGlvbiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQSxJQUFJQSxTQUFTLEdBQUdDLE9BQU8sQ0FBQyxrQkFBRCxDQUFQLENBQTRCRCxTQUE1Qzs7QUFDQSxJQUFJRSxXQUFXLEdBQUdELE9BQU8sQ0FBQyxrQkFBRCxDQUFQLENBQTRCQyxXQUE5Qzs7QUFFQSxJQUFJQyxLQUFLLEdBQUcsRUFBWixFQUdBOztBQUNBLElBQUlDLFVBQVUsR0FBRyxDQUFDQyxFQUFFLENBQUNDLEVBQUgsRUFBRCxFQUFVRCxFQUFFLENBQUNDLEVBQUgsRUFBVixDQUFqQjtBQUVBLElBQUlDLGVBQWUsR0FBRyxJQUFJQyxFQUFFLENBQUNDLGFBQVAsRUFBdEI7QUFFQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBSUMsYUFBYSxHQUFHO0FBRWhCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLEVBQUFBLE1BQU0sRUFBRSxFQVRROztBQVdoQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsV0FBVyxFQUFFLEVBakJHOztBQW1CaEI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsTUFBTSxFQUFFUixFQUFFLENBQUNDLEVBQUg7QUExQlEsQ0FBcEI7QUE2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxTQUFTUSxhQUFULEdBQTBCO0FBQ3RCLE9BQUtDLFVBQUwsR0FBa0JWLEVBQUUsQ0FBQ0MsRUFBSCxFQUFsQjtBQUNBLE9BQUtVLGFBQUwsR0FBcUIsQ0FBckI7QUFDQSxPQUFLQyxjQUFMLEdBQXNCLENBQXRCO0FBQ0g7O0FBRUQsSUFBSUMsa0JBQWtCLEdBQUcsQ0FBQyxJQUFJSixhQUFKLEVBQUQsRUFBc0IsSUFBSUEsYUFBSixFQUF0QixDQUF6QjtBQUVBLElBQUlLLFVBQVUsR0FBRyxJQUFJWCxFQUFFLENBQUNZLFFBQVAsRUFBakI7QUFFQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBSUMsUUFBUSxHQUFHO0FBQ1g7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsSUFBSSxFQUFFLENBUks7O0FBVVg7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSVAsRUFBQUEsVUFBVSxFQUFFVixFQUFFLENBQUNDLEVBQUgsRUF2QkQ7O0FBd0JYO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSWlCLEVBQUFBLFdBQVcsRUFBRWxCLEVBQUUsQ0FBQ0MsRUFBSCxFQW5DRjs7QUFxQ1g7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSUssRUFBQUEsTUFBTSxFQUFFO0FBNUNHLENBQWY7QUErQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBSWEsT0FBTyxHQUFHO0FBQ1Y7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsY0FBYyxFQUFFLEVBUk47O0FBU1Y7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsZUFBZSxFQUFFO0FBaEJQLENBQWQ7QUFtQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFNBQVNDLGNBQVQsR0FBMkIsQ0FDMUI7O0FBRURBLGNBQWMsQ0FBQ0MsU0FBZixDQUF5QkMsSUFBekIsR0FBZ0MsVUFBVUMsU0FBVixFQUFxQjtBQUNqRCxPQUFLQyxTQUFMLEdBQWlCRCxTQUFTLENBQUNFLFdBQVYsR0FBd0JDLFFBQXpDO0FBQ0EsT0FBS0MsU0FBTCxHQUFpQkosU0FBUyxDQUFDSyxXQUFWLEdBQXdCRixRQUF6QztBQUNBLE9BQUtHLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQSxPQUFLQyxZQUFMLEdBQW9CLEtBQXBCO0FBQ0EsT0FBS0MsUUFBTCxHQUFnQixJQUFoQjtBQUVBLE9BQUtDLFNBQUwsR0FBaUIsS0FBakI7QUFFQSxPQUFLQyxVQUFMLEdBQWtCVixTQUFsQjtBQUNBQSxFQUFBQSxTQUFTLENBQUNXLFFBQVYsR0FBcUIsSUFBckI7QUFDSCxDQVhEOztBQWFBZCxjQUFjLENBQUNDLFNBQWYsQ0FBeUJjLEtBQXpCLEdBQWlDLFlBQVk7QUFDekMsT0FBS0MsZUFBTCxDQUFxQixDQUFyQjtBQUNBLE9BQUtDLGFBQUw7QUFDQSxPQUFLQyxnQkFBTDtBQUVBLE9BQUtkLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxPQUFLRyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsT0FBS0UsUUFBTCxHQUFnQixLQUFoQjtBQUNBLE9BQUtFLFFBQUwsR0FBZ0IsSUFBaEI7QUFFQSxPQUFLRSxVQUFMLENBQWdCQyxRQUFoQixHQUEyQixJQUEzQjtBQUNBLE9BQUtELFVBQUwsR0FBa0IsSUFBbEI7QUFDSCxDQVpEO0FBY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0FiLGNBQWMsQ0FBQ0MsU0FBZixDQUF5QmtCLGdCQUF6QixHQUE0QyxZQUFZO0FBQ3BELE1BQUluQyxNQUFNLEdBQUdELGFBQWEsQ0FBQ0MsTUFBM0I7QUFDQSxNQUFJQyxXQUFXLEdBQUdGLGFBQWEsQ0FBQ0UsV0FBaEM7QUFDQSxNQUFJQyxNQUFNLEdBQUdILGFBQWEsQ0FBQ0csTUFBM0I7O0FBRUEsT0FBSzJCLFVBQUwsQ0FBZ0JPLGdCQUFoQixDQUFpQ3hDLGVBQWpDOztBQUNBLE1BQUl5QyxRQUFRLEdBQUd6QyxlQUFlLENBQUNJLE1BQS9CO0FBQ0EsTUFBSXNDLGFBQWEsR0FBRzFDLGVBQWUsQ0FBQ0ssV0FBcEM7O0FBRUEsTUFBSXNDLEtBQUssR0FBRyxLQUFLVixVQUFMLENBQWdCVyxXQUFoQixHQUE4QkMsVUFBMUM7O0FBQ0F6QyxFQUFBQSxNQUFNLENBQUMwQyxNQUFQLEdBQWdCekMsV0FBVyxDQUFDeUMsTUFBWixHQUFxQkgsS0FBckM7O0FBRUEsT0FBSyxJQUFJSSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHSixLQUFwQixFQUEyQkksQ0FBQyxFQUE1QixFQUFnQztBQUM1QixRQUFJQyxDQUFDLEdBQUduRCxVQUFVLENBQUNrRCxDQUFELENBQWxCO0FBQ0FDLElBQUFBLENBQUMsQ0FBQ0MsQ0FBRixHQUFNUixRQUFRLENBQUNNLENBQUQsQ0FBUixDQUFZRSxDQUFaLEdBQWdCeEQsU0FBdEI7QUFDQXVELElBQUFBLENBQUMsQ0FBQ0UsQ0FBRixHQUFNVCxRQUFRLENBQUNNLENBQUQsQ0FBUixDQUFZRyxDQUFaLEdBQWdCekQsU0FBdEI7QUFFQVcsSUFBQUEsTUFBTSxDQUFDMkMsQ0FBRCxDQUFOLEdBQVlDLENBQVo7QUFDQTNDLElBQUFBLFdBQVcsQ0FBQzBDLENBQUQsQ0FBWCxHQUFpQkwsYUFBYSxDQUFDSyxDQUFELENBQWIsR0FBbUJ0RCxTQUFwQztBQUNIOztBQUVEYSxFQUFBQSxNQUFNLENBQUMyQyxDQUFQLEdBQVdqRCxlQUFlLENBQUNNLE1BQWhCLENBQXVCMkMsQ0FBbEM7QUFDQTNDLEVBQUFBLE1BQU0sQ0FBQzRDLENBQVAsR0FBV2xELGVBQWUsQ0FBQ00sTUFBaEIsQ0FBdUI0QyxDQUFsQzs7QUFFQSxNQUFJLEtBQUtsQixTQUFULEVBQW9CO0FBQ2hCMUIsSUFBQUEsTUFBTSxDQUFDMkMsQ0FBUCxJQUFZLENBQUMsQ0FBYjtBQUNBM0MsSUFBQUEsTUFBTSxDQUFDNEMsQ0FBUCxJQUFZLENBQUMsQ0FBYjtBQUNIOztBQUVELFNBQU8vQyxhQUFQO0FBQ0gsQ0E5QkQ7QUFnQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0FpQixjQUFjLENBQUNDLFNBQWYsQ0FBeUI4QixXQUF6QixHQUF1QyxZQUFZO0FBQy9DLE1BQUkvQyxNQUFNLEdBQUdVLFFBQVEsQ0FBQ1YsTUFBdEI7QUFDQSxNQUFJWSxXQUFXLEdBQUdGLFFBQVEsQ0FBQ0UsV0FBM0I7QUFDQSxNQUFJUixVQUFVLEdBQUdNLFFBQVEsQ0FBQ04sVUFBMUI7O0FBRUEsTUFBSUksVUFBVSxHQUFHLEtBQUtxQixVQUFMLENBQWdCVyxXQUFoQixFQUFqQjs7QUFDQSxNQUFJSCxRQUFRLEdBQUc3QixVQUFVLENBQUNSLE1BQTFCO0FBQ0EsTUFBSXVDLEtBQUssR0FBR3ZDLE1BQU0sQ0FBQzBDLE1BQVAsR0FBZ0JsQyxVQUFVLENBQUNpQyxVQUF2Qzs7QUFFQSxPQUFLLElBQUlFLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdKLEtBQXBCLEVBQTJCSSxDQUFDLEVBQTVCLEVBQWdDO0FBQzVCLFFBQUlDLENBQUMsR0FBR3JDLGtCQUFrQixDQUFDb0MsQ0FBRCxDQUExQjtBQUNBLFFBQUlLLEdBQUcsR0FBR1gsUUFBUSxDQUFDTSxDQUFELENBQWxCO0FBQ0FDLElBQUFBLENBQUMsQ0FBQ3hDLFVBQUYsQ0FBYXlDLENBQWIsR0FBaUJHLEdBQUcsQ0FBQzVDLFVBQUosQ0FBZXlDLENBQWYsR0FBbUJ4RCxTQUFwQztBQUNBdUQsSUFBQUEsQ0FBQyxDQUFDeEMsVUFBRixDQUFhNkMsQ0FBYixHQUFpQkQsR0FBRyxDQUFDNUMsVUFBSixDQUFlNkMsQ0FBZixHQUFtQjVELFNBQXBDO0FBQ0F1RCxJQUFBQSxDQUFDLENBQUN2QyxhQUFGLEdBQWtCMkMsR0FBRyxDQUFDM0MsYUFBSixHQUFvQmhCLFNBQXRDO0FBQ0F1RCxJQUFBQSxDQUFDLENBQUN0QyxjQUFGLEdBQW1CMEMsR0FBRyxDQUFDMUMsY0FBdkI7QUFFQU4sSUFBQUEsTUFBTSxDQUFDMkMsQ0FBRCxDQUFOLEdBQVlDLENBQVo7QUFDSDs7QUFFRHhDLEVBQUFBLFVBQVUsQ0FBQ3lDLENBQVgsR0FBZXJDLFVBQVUsQ0FBQ0osVUFBWCxDQUFzQnlDLENBQXRCLEdBQTBCeEQsU0FBekM7QUFDQWUsRUFBQUEsVUFBVSxDQUFDMEMsQ0FBWCxHQUFldEMsVUFBVSxDQUFDSixVQUFYLENBQXNCMEMsQ0FBdEIsR0FBMEJ6RCxTQUF6QztBQUNBdUIsRUFBQUEsV0FBVyxDQUFDaUMsQ0FBWixHQUFnQnJDLFVBQVUsQ0FBQ0ksV0FBWCxDQUF1QmlDLENBQXZDO0FBQ0FqQyxFQUFBQSxXQUFXLENBQUNrQyxDQUFaLEdBQWdCdEMsVUFBVSxDQUFDSSxXQUFYLENBQXVCa0MsQ0FBdkM7QUFDQXBDLEVBQUFBLFFBQVEsQ0FBQ0MsSUFBVCxHQUFnQkgsVUFBVSxDQUFDRyxJQUEzQjs7QUFFQSxNQUFJLEtBQUtpQixTQUFULEVBQW9CO0FBQ2hCaEIsSUFBQUEsV0FBVyxDQUFDaUMsQ0FBWixJQUFpQixDQUFDLENBQWxCO0FBQ0FqQyxJQUFBQSxXQUFXLENBQUNrQyxDQUFaLElBQWlCLENBQUMsQ0FBbEI7QUFDSDs7QUFFRCxTQUFPcEMsUUFBUDtBQUNILENBaENEO0FBa0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQU0sY0FBYyxDQUFDQyxTQUFmLENBQXlCaUMsVUFBekIsR0FBc0MsWUFBWTtBQUM5QyxNQUFJQyxTQUFTLEdBQUcsS0FBS3hCLFFBQXJCO0FBQ0EsTUFBSSxDQUFDd0IsU0FBTCxFQUFnQixPQUFPLElBQVA7QUFFaEIsTUFBSXJDLGNBQWMsR0FBR0QsT0FBTyxDQUFDQyxjQUE3QjtBQUNBLE1BQUlDLGVBQWUsR0FBR0YsT0FBTyxDQUFDRSxlQUE5QjtBQUNBLE1BQUl3QixLQUFLLEdBQUdZLFNBQVMsQ0FBQ1osS0FBdEI7O0FBQ0EsT0FBSyxJQUFJSSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHSixLQUFwQixFQUEyQkksQ0FBQyxFQUE1QixFQUFnQztBQUM1QjdCLElBQUFBLGNBQWMsQ0FBQzZCLENBQUQsQ0FBZCxHQUFvQlEsU0FBUyxDQUFDckMsY0FBVixDQUF5QjZCLENBQXpCLElBQThCdEQsU0FBbEQ7QUFDQTBCLElBQUFBLGVBQWUsQ0FBQzRCLENBQUQsQ0FBZixHQUFxQlEsU0FBUyxDQUFDcEMsZUFBVixDQUEwQjRCLENBQTFCLENBQXJCO0FBQ0g7O0FBRUQ1QixFQUFBQSxlQUFlLENBQUMyQixNQUFoQixHQUF5QjVCLGNBQWMsQ0FBQzRCLE1BQWYsR0FBd0JILEtBQWpEO0FBRUEsU0FBTzFCLE9BQVA7QUFDSCxDQWZEOztBQWlCQUcsY0FBYyxDQUFDQyxTQUFmLENBQXlCbUMsSUFBekIsR0FBZ0MsVUFBVUMsV0FBVixFQUF1QjtBQUNuRCxNQUFJQyxJQUFKOztBQUNBLFVBQVFELFdBQVI7QUFDSSxTQUFLOUQsV0FBVyxDQUFDZ0UsYUFBakI7QUFDSUQsTUFBQUEsSUFBSSxHQUFHLGdCQUFQO0FBQ0E7O0FBQ0osU0FBSy9ELFdBQVcsQ0FBQ2lFLFdBQWpCO0FBQ0lGLE1BQUFBLElBQUksR0FBRyxjQUFQO0FBQ0E7O0FBQ0osU0FBSy9ELFdBQVcsQ0FBQ2tFLFNBQWpCO0FBQ0lILE1BQUFBLElBQUksR0FBRyxZQUFQO0FBQ0E7O0FBQ0osU0FBSy9ELFdBQVcsQ0FBQ21FLFVBQWpCO0FBQ0lKLE1BQUFBLElBQUksR0FBRyxhQUFQO0FBQ0E7QUFaUjs7QUFlQSxNQUFJbEMsU0FBUyxHQUFHLEtBQUtBLFNBQXJCO0FBQ0EsTUFBSUcsU0FBUyxHQUFHLEtBQUtBLFNBQXJCO0FBRUEsTUFBSW9DLEtBQUssR0FBR3ZDLFNBQVMsQ0FBQ3dDLElBQXRCO0FBQ0EsTUFBSUMsS0FBSyxHQUFHdEMsU0FBUyxDQUFDcUMsSUFBdEI7QUFFQSxNQUFJRSxLQUFKO0FBQ0EsTUFBSW5CLENBQUosRUFBT29CLENBQVAsRUFBVUMsSUFBVjs7QUFFQSxNQUFJTCxLQUFLLENBQUNNLHNCQUFWLEVBQWtDO0FBQzlCSCxJQUFBQSxLQUFLLEdBQUdILEtBQUssQ0FBQ08sSUFBTixDQUFXQyxXQUFuQjtBQUNBLFNBQUt2QyxTQUFMLEdBQWlCLEtBQWpCOztBQUNBLFNBQUtlLENBQUMsR0FBRyxDQUFKLEVBQU9vQixDQUFDLEdBQUdELEtBQUssQ0FBQ3BCLE1BQXRCLEVBQThCQyxDQUFDLEdBQUdvQixDQUFsQyxFQUFxQ3BCLENBQUMsRUFBdEMsRUFBMEM7QUFDdENxQixNQUFBQSxJQUFJLEdBQUdGLEtBQUssQ0FBQ25CLENBQUQsQ0FBWjs7QUFDQSxVQUFJcUIsSUFBSSxDQUFDVixJQUFELENBQVIsRUFBZ0I7QUFDWlUsUUFBQUEsSUFBSSxDQUFDVixJQUFELENBQUosQ0FBVyxJQUFYLEVBQWlCbEMsU0FBakIsRUFBNEJHLFNBQTVCO0FBQ0g7QUFDSjtBQUNKOztBQUVELE1BQUlzQyxLQUFLLENBQUNJLHNCQUFWLEVBQWtDO0FBQzlCSCxJQUFBQSxLQUFLLEdBQUdELEtBQUssQ0FBQ0ssSUFBTixDQUFXQyxXQUFuQjtBQUNBLFNBQUt2QyxTQUFMLEdBQWlCLElBQWpCOztBQUNBLFNBQUtlLENBQUMsR0FBRyxDQUFKLEVBQU9vQixDQUFDLEdBQUdELEtBQUssQ0FBQ3BCLE1BQXRCLEVBQThCQyxDQUFDLEdBQUdvQixDQUFsQyxFQUFxQ3BCLENBQUMsRUFBdEMsRUFBMEM7QUFDdENxQixNQUFBQSxJQUFJLEdBQUdGLEtBQUssQ0FBQ25CLENBQUQsQ0FBWjs7QUFDQSxVQUFJcUIsSUFBSSxDQUFDVixJQUFELENBQVIsRUFBZ0I7QUFDWlUsUUFBQUEsSUFBSSxDQUFDVixJQUFELENBQUosQ0FBVyxJQUFYLEVBQWlCL0IsU0FBakIsRUFBNEJILFNBQTVCO0FBQ0g7QUFDSjtBQUNKOztBQUVELE1BQUksS0FBS0ssUUFBTCxJQUFpQixLQUFLQyxZQUExQixFQUF3QztBQUNwQyxTQUFLMEMsVUFBTCxDQUFnQixLQUFoQjtBQUNBLFNBQUsxQyxZQUFMLEdBQW9CLEtBQXBCO0FBQ0g7QUFDSixDQXBERDs7QUFzREFWLGNBQWMsQ0FBQ3FELEdBQWYsR0FBcUIsVUFBVWxELFNBQVYsRUFBcUI7QUFDdEMsTUFBSW1ELENBQUo7O0FBQ0EsTUFBSTlFLEtBQUssQ0FBQ2tELE1BQU4sS0FBaUIsQ0FBckIsRUFBd0I7QUFDcEI0QixJQUFBQSxDQUFDLEdBQUcsSUFBSTVFLEVBQUUsQ0FBQ3NCLGNBQVAsRUFBSjtBQUNILEdBRkQsTUFHSztBQUNEc0QsSUFBQUEsQ0FBQyxHQUFHOUUsS0FBSyxDQUFDK0UsR0FBTixFQUFKO0FBQ0g7O0FBRURELEVBQUFBLENBQUMsQ0FBQ3BELElBQUYsQ0FBT0MsU0FBUDtBQUNBLFNBQU9tRCxDQUFQO0FBQ0gsQ0FYRDs7QUFhQXRELGNBQWMsQ0FBQ3dELEdBQWYsR0FBcUIsVUFBVXJELFNBQVYsRUFBcUI7QUFDdEMsTUFBSW1ELENBQUMsR0FBR25ELFNBQVMsQ0FBQ1csUUFBbEI7QUFDQSxNQUFJLENBQUN3QyxDQUFMLEVBQVE7QUFFUjlFLEVBQUFBLEtBQUssQ0FBQ2lGLElBQU4sQ0FBV0gsQ0FBWDtBQUNBQSxFQUFBQSxDQUFDLENBQUN2QyxLQUFGO0FBQ0gsQ0FORDs7QUFTQSxJQUFJMkMsRUFBRSxHQUFHMUQsY0FBYyxDQUFDQyxTQUF4QjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQXlELEVBQUUsQ0FBQ04sVUFBSCxHQUFnQixVQUFVTyxLQUFWLEVBQWlCO0FBQzdCLE9BQUs5QyxVQUFMLENBQWdCK0MsVUFBaEIsQ0FBMkJELEtBQTNCO0FBQ0gsQ0FGRDtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBRCxFQUFFLENBQUNHLFVBQUgsR0FBZ0IsWUFBWTtBQUN4QixTQUFPLEtBQUtoRCxVQUFMLENBQWdCaUQsVUFBaEIsRUFBUDtBQUNILENBRkQ7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQUosRUFBRSxDQUFDMUMsZUFBSCxHQUFxQixVQUFVMkMsS0FBVixFQUFpQjtBQUNsQyxPQUFLOUMsVUFBTCxDQUFnQmtELGVBQWhCLENBQWdDSixLQUFLLEdBQUd0RixTQUF4QztBQUNILENBRkQ7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQXFGLEVBQUUsQ0FBQ00sZUFBSCxHQUFxQixZQUFZO0FBQzdCLFNBQU8sS0FBS25ELFVBQUwsQ0FBZ0JvRCxlQUFoQixLQUFvQzVGLFNBQTNDO0FBQ0gsQ0FGRDtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBcUYsRUFBRSxDQUFDUSxXQUFILEdBQWlCLFVBQVVQLEtBQVYsRUFBaUI7QUFDOUIsT0FBSzlDLFVBQUwsQ0FBZ0JzRCxXQUFoQixDQUE0QlIsS0FBNUI7QUFDSCxDQUZEO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0FELEVBQUUsQ0FBQ1UsV0FBSCxHQUFpQixZQUFZO0FBQ3pCLFNBQU8sS0FBS3ZELFVBQUwsQ0FBZ0J3RCxXQUFoQixFQUFQO0FBQ0gsQ0FGRDtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQVgsRUFBRSxDQUFDekMsYUFBSCxHQUFtQixZQUFZO0FBQzNCLFNBQU8sS0FBS0osVUFBTCxDQUFnQnlELGFBQWhCLEVBQVA7QUFDSCxDQUZEO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0FaLEVBQUUsQ0FBQ2EsY0FBSCxHQUFvQixVQUFVWixLQUFWLEVBQWlCO0FBQ2pDLE9BQUs5QyxVQUFMLENBQWdCMkQsY0FBaEIsQ0FBK0JiLEtBQS9CO0FBQ0gsQ0FGRDtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBRCxFQUFFLENBQUNlLGNBQUgsR0FBb0IsWUFBWTtBQUM1QixTQUFPLEtBQUs1RCxVQUFMLENBQWdCNkQsY0FBaEIsRUFBUDtBQUNILENBRkQ7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0FoQixFQUFFLENBQUN4QyxnQkFBSCxHQUFzQixZQUFZO0FBQzlCLFNBQU8sS0FBS0wsVUFBTCxDQUFnQjhELGdCQUFoQixFQUFQO0FBQ0gsQ0FGRDs7QUFJQTNFLGNBQWMsQ0FBQ3pCLFdBQWYsR0FBNkJBLFdBQTdCO0FBQ0FHLEVBQUUsQ0FBQ3NCLGNBQUgsR0FBb0I0RSxNQUFNLENBQUNDLE9BQVAsR0FBaUI3RSxjQUFyQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxudmFyIFBUTV9SQVRJTyA9IHJlcXVpcmUoJy4vQ0NQaHlzaWNzVHlwZXMnKS5QVE1fUkFUSU87XG52YXIgQ29udGFjdFR5cGUgPSByZXF1aXJlKCcuL0NDUGh5c2ljc1R5cGVzJykuQ29udGFjdFR5cGU7XG5cbnZhciBwb29scyA9IFtdO1xuXG5cbi8vIHRlbXAgd29ybGQgbWFuaWZvbGRcbnZhciBwb2ludENhY2hlID0gW2NjLnYyKCksIGNjLnYyKCldO1xuXG52YXIgYjJ3b3JsZG1hbmlmb2xkID0gbmV3IGIyLldvcmxkTWFuaWZvbGQoKTtcblxuLyoqXG4gKiBAY2xhc3MgV29ybGRNYW5pZm9sZFxuICovXG52YXIgd29ybGRtYW5pZm9sZCA9IHtcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiB3b3JsZCBjb250YWN0IHBvaW50IChwb2ludCBvZiBpbnRlcnNlY3Rpb24pXG4gICAgICogISN6aFxuICAgICAqIOeisOaSnueCuembhuWQiFxuICAgICAqIEBwcm9wZXJ0eSB7W1ZlYzJdfSBwb2ludHNcbiAgICAgKi9cbiAgICBwb2ludHM6IFtdLFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIGEgbmVnYXRpdmUgdmFsdWUgaW5kaWNhdGVzIG92ZXJsYXBcbiAgICAgKiAhI3poXG4gICAgICog5LiA5Liq6LSf5pWw77yM55So5LqO5oyH5piO6YeN5Y+g55qE6YOo5YiGXG4gICAgICovXG4gICAgc2VwYXJhdGlvbnM6IFtdLFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIHdvcmxkIHZlY3RvciBwb2ludGluZyBmcm9tIEEgdG8gQlxuICAgICAqICEjemhcbiAgICAgKiDkuJbnlYzlnZDmoIfns7vkuIvnlLEgQSDmjIflkJEgQiDnmoTlkJHph49cbiAgICAgKiBAcHJvcGVydHkge1ZlYzJ9IG5vcm1hbFxuICAgICAqL1xuICAgIG5vcm1hbDogY2MudjIoKVxufTtcblxuLyoqXG4gKiAhI2VuXG4gKiBBIG1hbmlmb2xkIHBvaW50IGlzIGEgY29udGFjdCBwb2ludCBiZWxvbmdpbmcgdG8gYSBjb250YWN0IG1hbmlmb2xkLiBcbiAqIEl0IGhvbGRzIGRldGFpbHMgcmVsYXRlZCB0byB0aGUgZ2VvbWV0cnkgYW5kIGR5bmFtaWNzIG9mIHRoZSBjb250YWN0IHBvaW50cy5cbiAqIE5vdGU6IHRoZSBpbXB1bHNlcyBhcmUgdXNlZCBmb3IgaW50ZXJuYWwgY2FjaGluZyBhbmQgbWF5IG5vdFxuICogcHJvdmlkZSByZWxpYWJsZSBjb250YWN0IGZvcmNlcywgZXNwZWNpYWxseSBmb3IgaGlnaCBzcGVlZCBjb2xsaXNpb25zLlxuICogISN6aFxuICogTWFuaWZvbGRQb2ludCDmmK/mjqXop6bkv6Hmga/kuK3nmoTmjqXop6bngrnkv6Hmga/jgILlroPmi6XmnInlhbPkuo7lh6DkvZXlkozmjqXop6bngrnnmoTor6bnu4bkv6Hmga/jgIJcbiAqIOazqOaEj++8muS/oeaBr+S4reeahOWGsumHj+eUqOS6juezu+e7n+WGhemDqOe8k+WtmO+8jOaPkOS+m+eahOaOpeinpuWKm+WPr+iDveS4jeaYr+W+iOWHhuehru+8jOeJueWIq+aYr+mrmOmAn+enu+WKqOS4reeahOeisOaSnuS/oeaBr+OAglxuICogQGNsYXNzIE1hbmlmb2xkUG9pbnRcbiAqL1xuLyoqXG4gKiAhI2VuXG4gKiBUaGUgbG9jYWwgcG9pbnQgdXNhZ2UgZGVwZW5kcyBvbiB0aGUgbWFuaWZvbGQgdHlwZTpcbiAqIC1lX2NpcmNsZXM6IHRoZSBsb2NhbCBjZW50ZXIgb2YgY2lyY2xlQlxuICogLWVfZmFjZUE6IHRoZSBsb2NhbCBjZW50ZXIgb2YgY2lyY2xlQiBvciB0aGUgY2xpcCBwb2ludCBvZiBwb2x5Z29uQlxuICogLWVfZmFjZUI6IHRoZSBjbGlwIHBvaW50IG9mIHBvbHlnb25BXG4gKiAhI3poXG4gKiDmnKzlnLDlnZDmoIfngrnnmoTnlKjpgJTlj5blhrPkuo4gbWFuaWZvbGQg55qE57G75Z6LXG4gKiAtIGVfY2lyY2xlczogY2lyY2xlQiDnmoTmnKzlnLDkuK3lv4PngrlcbiAqIC0gZV9mYWNlQTogY2lyY2xlQiDnmoTmnKzlnLDkuK3lv4Pngrkg5oiW6ICF5pivIHBvbHlnb25CIOeahOaIquWPlueCuVxuICogLSBlX2ZhY2VCOiBwb2x5Z29uQiDnmoTmiKrlj5bngrlcbiAqIEBwcm9wZXJ0eSB7VmVjMn0gbG9jYWxQb2ludFxuICovXG4vKipcbiAqICEjZW5cbiAqIE5vcm1hbCBpbXB1bHNlLlxuICogISN6aFxuICog5rOV57q/5Yay6YeP44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gbm9ybWFsSW1wdWxzZVxuICovXG4vKipcbiAqICEjZW5cbiAqIFRhbmdlbnQgaW1wdWxzZS5cbiAqICEjemhcbiAqIOWIh+e6v+WGsumHj+OAglxuICogQHByb3BlcnR5IHtOdW1iZXJ9IHRhbmdlbnRJbXB1bHNlXG4gKi9cbmZ1bmN0aW9uIE1hbmlmb2xkUG9pbnQgKCkge1xuICAgIHRoaXMubG9jYWxQb2ludCA9IGNjLnYyKCk7XG4gICAgdGhpcy5ub3JtYWxJbXB1bHNlID0gMDtcbiAgICB0aGlzLnRhbmdlbnRJbXB1bHNlID0gMDtcbn1cblxudmFyIG1hbmlmb2xkUG9pbnRDYWNoZSA9IFtuZXcgTWFuaWZvbGRQb2ludCgpLCBuZXcgTWFuaWZvbGRQb2ludCgpXTtcblxudmFyIGIybWFuaWZvbGQgPSBuZXcgYjIuTWFuaWZvbGQoKTtcblxuLyoqXG4gKiBAY2xhc3MgTWFuaWZvbGRcbiAqL1xudmFyIG1hbmlmb2xkID0ge1xuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBNYW5pZm9sZCB0eXBlIDogIDA6IGVfY2lyY2xlcywgMTogZV9mYWNlQSwgMjogZV9mYWNlQlxuICAgICAqICEjemhcbiAgICAgKiBNYW5pZm9sZCDnsbvlnosgOiAgMDogZV9jaXJjbGVzLCAxOiBlX2ZhY2VBLCAyOiBlX2ZhY2VCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHR5cGVcbiAgICAgKi9cbiAgICB0eXBlOiAwLFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFRoZSBsb2NhbCBwb2ludCB1c2FnZSBkZXBlbmRzIG9uIHRoZSBtYW5pZm9sZCB0eXBlOlxuICAgICAqIC1lX2NpcmNsZXM6IHRoZSBsb2NhbCBjZW50ZXIgb2YgY2lyY2xlQVxuICAgICAqIC1lX2ZhY2VBOiB0aGUgY2VudGVyIG9mIGZhY2VBXG4gICAgICogLWVfZmFjZUI6IHRoZSBjZW50ZXIgb2YgZmFjZUJcbiAgICAgKiAhI3poXG4gICAgICog55So6YCU5Y+W5Yaz5LqOIG1hbmlmb2xkIOexu+Wei1xuICAgICAqIC1lX2NpcmNsZXM6IGNpcmNsZUEg55qE5pys5Zyw5Lit5b+D54K5XG4gICAgICogLWVfZmFjZUE6IGZhY2VBIOeahOacrOWcsOS4reW/g+eCuVxuICAgICAqIC1lX2ZhY2VCOiBmYWNlQiDnmoTmnKzlnLDkuK3lv4PngrlcbiAgICAgKiBAcHJvcGVydHkge1ZlYzJ9IGxvY2FsUG9pbnRcbiAgICAgKi9cbiAgICBsb2NhbFBvaW50OiBjYy52MigpLFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiAtZV9jaXJjbGVzOiBub3QgdXNlZFxuICAgICAqIC1lX2ZhY2VBOiB0aGUgbm9ybWFsIG9uIHBvbHlnb25BXG4gICAgICogLWVfZmFjZUI6IHRoZSBub3JtYWwgb24gcG9seWdvbkJcbiAgICAgKiAhI3poXG4gICAgICogLWVfY2lyY2xlczog5rKh6KKr5L2/55So5YiwXG4gICAgICogLWVfZmFjZUE6IHBvbHlnb25BIOeahOazleWQkemHj1xuICAgICAqIC1lX2ZhY2VCOiBwb2x5Z29uQiDnmoTms5XlkJHph49cbiAgICAgKiBAcHJvcGVydHkge1ZlYzJ9IGxvY2FsTm9ybWFsXG4gICAgICovXG4gICAgbG9jYWxOb3JtYWw6IGNjLnYyKCksXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogdGhlIHBvaW50cyBvZiBjb250YWN0LlxuICAgICAqICEjemhcbiAgICAgKiDmjqXop6bngrnkv6Hmga/jgIJcbiAgICAgKiBAcHJvcGVydHkge1tNYW5pZm9sZFBvaW50XX0gcG9pbnRzXG4gICAgICovXG4gICAgcG9pbnRzOiBbXVxufTtcblxuLyoqXG4gKiAhI2VuXG4gKiBDb250YWN0IGltcHVsc2VzIGZvciByZXBvcnRpbmcuXG4gKiAhI3poXG4gKiDnlKjkuo7ov5Tlm57nu5nlm57osIPnmoTmjqXop6blhrLph4/jgIJcbiAqIEBjbGFzcyBQaHlzaWNzSW1wdWxzZVxuICovXG52YXIgaW1wdWxzZSA9IHtcbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogTm9ybWFsIGltcHVsc2VzLlxuICAgICAqICEjemhcbiAgICAgKiDms5Xnur/mlrnlkJHnmoTlhrLph49cbiAgICAgKiBAcHJvcGVydHkgbm9ybWFsSW1wdWxzZXNcbiAgICAgKi9cbiAgICBub3JtYWxJbXB1bHNlczogW10sXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFRhbmdlbnQgaW1wdWxzZXNcbiAgICAgKiAhI3poXG4gICAgICog5YiH57q/5pa55ZCR55qE5Yay6YePXG4gICAgICogQHByb3BlcnR5IHRhbmdlbnRJbXB1bHNlc1xuICAgICAqL1xuICAgIHRhbmdlbnRJbXB1bHNlczogW11cbn07XG5cbi8qKlxuICogISNlblxuICogUGh5c2ljc0NvbnRhY3Qgd2lsbCBiZSBnZW5lcmF0ZWQgZHVyaW5nIGJlZ2luIGFuZCBlbmQgY29sbGlzaW9uIGFzIGEgcGFyYW1ldGVyIG9mIHRoZSBjb2xsaXNpb24gY2FsbGJhY2suXG4gKiBOb3RlIHRoYXQgY29udGFjdHMgd2lsbCBiZSByZXVzZWQgZm9yIHNwZWVkIHVwIGNwdSB0aW1lLCBzbyBkbyBub3QgY2FjaGUgYW55dGhpbmcgaW4gdGhlIGNvbnRhY3QuXG4gKiAhI3poXG4gKiDniannkIbmjqXop6bkvJrlnKjlvIDlp4vlkoznu5PmnZ/norDmkp7kuYvpl7TnlJ/miJDvvIzlubbkvZzkuLrlj4LmlbDkvKDlhaXliLDnorDmkp7lm57osIPlh73mlbDkuK3jgIJcbiAqIOazqOaEj++8muS8oOWFpeeahOeJqeeQhuaOpeinpuS8muiiq+ezu+e7n+i/m+ihjOmHjeeUqO+8jOaJgOS7peS4jeimgeWcqOS9v+eUqOS4ree8k+WtmOmHjOmdoueahOS7u+S9leS/oeaBr+OAglxuICogQGNsYXNzIFBoeXNpY3NDb250YWN0XG4gKi9cbmZ1bmN0aW9uIFBoeXNpY3NDb250YWN0ICgpIHtcbn1cblxuUGh5c2ljc0NvbnRhY3QucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoYjJjb250YWN0KSB7XG4gICAgdGhpcy5jb2xsaWRlckEgPSBiMmNvbnRhY3QuR2V0Rml4dHVyZUEoKS5jb2xsaWRlcjtcbiAgICB0aGlzLmNvbGxpZGVyQiA9IGIyY29udGFjdC5HZXRGaXh0dXJlQigpLmNvbGxpZGVyO1xuICAgIHRoaXMuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB0aGlzLmRpc2FibGVkT25jZSA9IGZhbHNlO1xuICAgIHRoaXMuX2ltcHVsc2UgPSBudWxsO1xuXG4gICAgdGhpcy5faW52ZXJ0ZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuX2IyY29udGFjdCA9IGIyY29udGFjdDtcbiAgICBiMmNvbnRhY3QuX2NvbnRhY3QgPSB0aGlzO1xufTtcblxuUGh5c2ljc0NvbnRhY3QucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0VGFuZ2VudFNwZWVkKDApO1xuICAgIHRoaXMucmVzZXRGcmljdGlvbigpO1xuICAgIHRoaXMucmVzZXRSZXN0aXR1dGlvbigpO1xuXG4gICAgdGhpcy5jb2xsaWRlckEgPSBudWxsO1xuICAgIHRoaXMuY29sbGlkZXJCID0gbnVsbDtcbiAgICB0aGlzLmRpc2FibGVkID0gZmFsc2U7XG4gICAgdGhpcy5faW1wdWxzZSA9IG51bGw7XG5cbiAgICB0aGlzLl9iMmNvbnRhY3QuX2NvbnRhY3QgPSBudWxsO1xuICAgIHRoaXMuX2IyY29udGFjdCA9IG51bGw7XG59O1xuXG4vKipcbiAqICEjZW5cbiAqIEdldCB0aGUgd29ybGQgbWFuaWZvbGQuXG4gKiAhI3poXG4gKiDojrflj5bkuJbnlYzlnZDmoIfns7vkuIvnmoTnorDmkp7kv6Hmga/jgIJcbiAqIEBtZXRob2QgZ2V0V29ybGRNYW5pZm9sZFxuICogQHJldHVybiB7V29ybGRNYW5pZm9sZH1cbiAqL1xuUGh5c2ljc0NvbnRhY3QucHJvdG90eXBlLmdldFdvcmxkTWFuaWZvbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBvaW50cyA9IHdvcmxkbWFuaWZvbGQucG9pbnRzO1xuICAgIHZhciBzZXBhcmF0aW9ucyA9IHdvcmxkbWFuaWZvbGQuc2VwYXJhdGlvbnM7XG4gICAgdmFyIG5vcm1hbCA9IHdvcmxkbWFuaWZvbGQubm9ybWFsO1xuXG4gICAgdGhpcy5fYjJjb250YWN0LkdldFdvcmxkTWFuaWZvbGQoYjJ3b3JsZG1hbmlmb2xkKTtcbiAgICB2YXIgYjJwb2ludHMgPSBiMndvcmxkbWFuaWZvbGQucG9pbnRzO1xuICAgIHZhciBiMnNlcGFyYXRpb25zID0gYjJ3b3JsZG1hbmlmb2xkLnNlcGFyYXRpb25zO1xuXG4gICAgdmFyIGNvdW50ID0gdGhpcy5fYjJjb250YWN0LkdldE1hbmlmb2xkKCkucG9pbnRDb3VudDtcbiAgICBwb2ludHMubGVuZ3RoID0gc2VwYXJhdGlvbnMubGVuZ3RoID0gY291bnQ7XG4gICAgXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgIHZhciBwID0gcG9pbnRDYWNoZVtpXTtcbiAgICAgICAgcC54ID0gYjJwb2ludHNbaV0ueCAqIFBUTV9SQVRJTztcbiAgICAgICAgcC55ID0gYjJwb2ludHNbaV0ueSAqIFBUTV9SQVRJTztcbiAgICAgICAgXG4gICAgICAgIHBvaW50c1tpXSA9IHA7XG4gICAgICAgIHNlcGFyYXRpb25zW2ldID0gYjJzZXBhcmF0aW9uc1tpXSAqIFBUTV9SQVRJTztcbiAgICB9XG5cbiAgICBub3JtYWwueCA9IGIyd29ybGRtYW5pZm9sZC5ub3JtYWwueDtcbiAgICBub3JtYWwueSA9IGIyd29ybGRtYW5pZm9sZC5ub3JtYWwueTtcblxuICAgIGlmICh0aGlzLl9pbnZlcnRlZCkge1xuICAgICAgICBub3JtYWwueCAqPSAtMTtcbiAgICAgICAgbm9ybWFsLnkgKj0gLTE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdvcmxkbWFuaWZvbGQ7XG59O1xuXG4vKipcbiAqICEjZW5cbiAqIEdldCB0aGUgbWFuaWZvbGQuXG4gKiAhI3poXG4gKiDojrflj5bmnKzlnLDvvIjlsYDpg6jvvInlnZDmoIfns7vkuIvnmoTnorDmkp7kv6Hmga/jgIJcbiAqIEBtZXRob2QgZ2V0TWFuaWZvbGRcbiAqIEByZXR1cm4ge01hbmlmb2xkfVxuICovXG5QaHlzaWNzQ29udGFjdC5wcm90b3R5cGUuZ2V0TWFuaWZvbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBvaW50cyA9IG1hbmlmb2xkLnBvaW50cztcbiAgICB2YXIgbG9jYWxOb3JtYWwgPSBtYW5pZm9sZC5sb2NhbE5vcm1hbDtcbiAgICB2YXIgbG9jYWxQb2ludCA9IG1hbmlmb2xkLmxvY2FsUG9pbnQ7XG4gICAgXG4gICAgdmFyIGIybWFuaWZvbGQgPSB0aGlzLl9iMmNvbnRhY3QuR2V0TWFuaWZvbGQoKTtcbiAgICB2YXIgYjJwb2ludHMgPSBiMm1hbmlmb2xkLnBvaW50cztcbiAgICB2YXIgY291bnQgPSBwb2ludHMubGVuZ3RoID0gYjJtYW5pZm9sZC5wb2ludENvdW50O1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgIHZhciBwID0gbWFuaWZvbGRQb2ludENhY2hlW2ldO1xuICAgICAgICB2YXIgYjJwID0gYjJwb2ludHNbaV07XG4gICAgICAgIHAubG9jYWxQb2ludC54ID0gYjJwLmxvY2FsUG9pbnQueCAqIFBUTV9SQVRJTztcbiAgICAgICAgcC5sb2NhbFBvaW50LlkgPSBiMnAubG9jYWxQb2ludC5ZICogUFRNX1JBVElPO1xuICAgICAgICBwLm5vcm1hbEltcHVsc2UgPSBiMnAubm9ybWFsSW1wdWxzZSAqIFBUTV9SQVRJTztcbiAgICAgICAgcC50YW5nZW50SW1wdWxzZSA9IGIycC50YW5nZW50SW1wdWxzZTtcblxuICAgICAgICBwb2ludHNbaV0gPSBwO1xuICAgIH1cblxuICAgIGxvY2FsUG9pbnQueCA9IGIybWFuaWZvbGQubG9jYWxQb2ludC54ICogUFRNX1JBVElPO1xuICAgIGxvY2FsUG9pbnQueSA9IGIybWFuaWZvbGQubG9jYWxQb2ludC55ICogUFRNX1JBVElPO1xuICAgIGxvY2FsTm9ybWFsLnggPSBiMm1hbmlmb2xkLmxvY2FsTm9ybWFsLng7XG4gICAgbG9jYWxOb3JtYWwueSA9IGIybWFuaWZvbGQubG9jYWxOb3JtYWwueTtcbiAgICBtYW5pZm9sZC50eXBlID0gYjJtYW5pZm9sZC50eXBlO1xuXG4gICAgaWYgKHRoaXMuX2ludmVydGVkKSB7XG4gICAgICAgIGxvY2FsTm9ybWFsLnggKj0gLTE7XG4gICAgICAgIGxvY2FsTm9ybWFsLnkgKj0gLTE7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hbmlmb2xkO1xufTtcblxuLyoqXG4gKiAhI2VuXG4gKiBHZXQgdGhlIGltcHVsc2VzLlxuICogTm90ZTogUGh5c2ljc0ltcHVsc2UgY2FuIG9ubHkgdXNlZCBpbiBvblBvc3RTb2x2ZSBjYWxsYmFjay5cbiAqICEjemhcbiAqIOiOt+WPluWGsumHj+S/oeaBr1xuICog5rOo5oSP77ya6L+Z5Liq5L+h5oGv5Y+q5pyJ5ZyoIG9uUG9zdFNvbHZlIOWbnuiwg+S4reaJjeiDveiOt+WPluWIsFxuICogQG1ldGhvZCBnZXRJbXB1bHNlXG4gKiBAcmV0dXJuIHtQaHlzaWNzSW1wdWxzZX1cbiAqL1xuUGh5c2ljc0NvbnRhY3QucHJvdG90eXBlLmdldEltcHVsc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGIyaW1wdWxzZSA9IHRoaXMuX2ltcHVsc2U7XG4gICAgaWYgKCFiMmltcHVsc2UpIHJldHVybiBudWxsO1xuXG4gICAgdmFyIG5vcm1hbEltcHVsc2VzID0gaW1wdWxzZS5ub3JtYWxJbXB1bHNlcztcbiAgICB2YXIgdGFuZ2VudEltcHVsc2VzID0gaW1wdWxzZS50YW5nZW50SW1wdWxzZXM7XG4gICAgdmFyIGNvdW50ID0gYjJpbXB1bHNlLmNvdW50O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICBub3JtYWxJbXB1bHNlc1tpXSA9IGIyaW1wdWxzZS5ub3JtYWxJbXB1bHNlc1tpXSAqIFBUTV9SQVRJTztcbiAgICAgICAgdGFuZ2VudEltcHVsc2VzW2ldID0gYjJpbXB1bHNlLnRhbmdlbnRJbXB1bHNlc1tpXTtcbiAgICB9XG5cbiAgICB0YW5nZW50SW1wdWxzZXMubGVuZ3RoID0gbm9ybWFsSW1wdWxzZXMubGVuZ3RoID0gY291bnQ7XG5cbiAgICByZXR1cm4gaW1wdWxzZTtcbn07XG5cblBoeXNpY3NDb250YWN0LnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gKGNvbnRhY3RUeXBlKSB7XG4gICAgdmFyIGZ1bmM7XG4gICAgc3dpdGNoIChjb250YWN0VHlwZSkge1xuICAgICAgICBjYXNlIENvbnRhY3RUeXBlLkJFR0lOX0NPTlRBQ1Q6XG4gICAgICAgICAgICBmdW5jID0gJ29uQmVnaW5Db250YWN0JztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIENvbnRhY3RUeXBlLkVORF9DT05UQUNUOlxuICAgICAgICAgICAgZnVuYyA9ICdvbkVuZENvbnRhY3QnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQ29udGFjdFR5cGUuUFJFX1NPTFZFOlxuICAgICAgICAgICAgZnVuYyA9ICdvblByZVNvbHZlJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIENvbnRhY3RUeXBlLlBPU1RfU09MVkU6XG4gICAgICAgICAgICBmdW5jID0gJ29uUG9zdFNvbHZlJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHZhciBjb2xsaWRlckEgPSB0aGlzLmNvbGxpZGVyQTtcbiAgICB2YXIgY29sbGlkZXJCID0gdGhpcy5jb2xsaWRlckI7XG5cbiAgICB2YXIgYm9keUEgPSBjb2xsaWRlckEuYm9keTtcbiAgICB2YXIgYm9keUIgPSBjb2xsaWRlckIuYm9keTtcblxuICAgIHZhciBjb21wcztcbiAgICB2YXIgaSwgbCwgY29tcDtcblxuICAgIGlmIChib2R5QS5lbmFibGVkQ29udGFjdExpc3RlbmVyKSB7XG4gICAgICAgIGNvbXBzID0gYm9keUEubm9kZS5fY29tcG9uZW50cztcbiAgICAgICAgdGhpcy5faW52ZXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgZm9yIChpID0gMCwgbCA9IGNvbXBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgY29tcCA9IGNvbXBzW2ldO1xuICAgICAgICAgICAgaWYgKGNvbXBbZnVuY10pIHtcbiAgICAgICAgICAgICAgICBjb21wW2Z1bmNdKHRoaXMsIGNvbGxpZGVyQSwgY29sbGlkZXJCKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChib2R5Qi5lbmFibGVkQ29udGFjdExpc3RlbmVyKSB7XG4gICAgICAgIGNvbXBzID0gYm9keUIubm9kZS5fY29tcG9uZW50cztcbiAgICAgICAgdGhpcy5faW52ZXJ0ZWQgPSB0cnVlO1xuICAgICAgICBmb3IgKGkgPSAwLCBsID0gY29tcHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBjb21wID0gY29tcHNbaV07XG4gICAgICAgICAgICBpZiAoY29tcFtmdW5jXSkge1xuICAgICAgICAgICAgICAgIGNvbXBbZnVuY10odGhpcywgY29sbGlkZXJCLCBjb2xsaWRlckEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlZE9uY2UpIHtcbiAgICAgICAgdGhpcy5zZXRFbmFibGVkKGZhbHNlKTtcbiAgICAgICAgdGhpcy5kaXNhYmxlZE9uY2UgPSBmYWxzZTtcbiAgICB9XG59O1xuXG5QaHlzaWNzQ29udGFjdC5nZXQgPSBmdW5jdGlvbiAoYjJjb250YWN0KSB7XG4gICAgdmFyIGM7XG4gICAgaWYgKHBvb2xzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjID0gbmV3IGNjLlBoeXNpY3NDb250YWN0KCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjID0gcG9vbHMucG9wKCk7IFxuICAgIH1cblxuICAgIGMuaW5pdChiMmNvbnRhY3QpO1xuICAgIHJldHVybiBjO1xufTtcblxuUGh5c2ljc0NvbnRhY3QucHV0ID0gZnVuY3Rpb24gKGIyY29udGFjdCkge1xuICAgIHZhciBjID0gYjJjb250YWN0Ll9jb250YWN0O1xuICAgIGlmICghYykgcmV0dXJuO1xuICAgIFxuICAgIHBvb2xzLnB1c2goYyk7XG4gICAgYy5yZXNldCgpO1xufTtcblxuXG52YXIgX3AgPSBQaHlzaWNzQ29udGFjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogISNlblxuICogT25lIG9mIHRoZSBjb2xsaWRlciB0aGF0IGNvbGxpZGVkXG4gKiAhI3poXG4gKiDlj5HnlJ/norDmkp7nmoTnorDmkp7kvZPkuYvkuIBcbiAqIEBwcm9wZXJ0eSB7Q29sbGlkZXJ9IGNvbGxpZGVyQVxuICovXG4vKipcbiAqICEjZW5cbiAqIE9uZSBvZiB0aGUgY29sbGlkZXIgdGhhdCBjb2xsaWRlZFxuICogISN6aFxuICog5Y+R55Sf56Kw5pKe55qE56Kw5pKe5L2T5LmL5LiAXG4gKiBAcHJvcGVydHkge0NvbGxpZGVyfSBjb2xsaWRlckJcbiAqL1xuLyoqXG4gKiAhI2VuXG4gKiBJZiBzZXQgZGlzYWJsZWQgdG8gdHJ1ZSwgdGhlIGNvbnRhY3Qgd2lsbCBiZSBpZ25vcmVkIHVudGlsIGNvbnRhY3QgZW5kLlxuICogSWYgeW91IGp1c3Qgd2FudCB0byBkaXNhYmxlZCBjb250YWN0IGZvciBjdXJyZW50IHRpbWUgc3RlcCBvciBzdWItc3RlcCwgcGxlYXNlIHVzZSBkaXNhYmxlZE9uY2UuXG4gKiAhI3poXG4gKiDlpoLmnpwgZGlzYWJsZWQg6KKr6K6+572u5Li6IHRydWXvvIzpgqPkuYjnm7TliLDmjqXop6bnu5PmnZ/mraTmjqXop6bpg73lsIbooqvlv73nlaXjgIJcbiAqIOWmguaenOWPquaYr+W4jOacm+WcqOW9k+WJjeaXtumXtOatpeaIluWtkOatpeS4reW/veeVpeatpOaOpeinpu+8jOivt+S9v+eUqCBkaXNhYmxlZE9uY2Ug44CCXG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IGRpc2FibGVkXG4gKi9cbi8qKlxuICogISNlblxuICogRGlzYWJsZWQgY29udGFjdCBmb3IgY3VycmVudCB0aW1lIHN0ZXAgb3Igc3ViLXN0ZXAuXG4gKiAhI3poXG4gKiDlnKjlvZPliY3ml7bpl7TmraXmiJblrZDmraXkuK3lv73nlaXmraTmjqXop6bjgIJcbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZGlzYWJsZWRPbmNlXG4gKi9cbl9wLnNldEVuYWJsZWQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLl9iMmNvbnRhY3QuU2V0RW5hYmxlZCh2YWx1ZSk7XG59O1xuXG4vKipcbiAqICEjZW5cbiAqIElzIHRoaXMgY29udGFjdCB0b3VjaGluZz9cbiAqICEjemhcbiAqIOi/lOWbnueisOaSnuS9k+aYr+WQpuW3sue7j+aOpeinpuWIsOOAglxuICogQG1ldGhvZCBpc1RvdWNoaW5nXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5fcC5pc1RvdWNoaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9iMmNvbnRhY3QuSXNUb3VjaGluZygpO1xufTtcblxuLyoqXG4gKiAhI2VuXG4gKiBTZXQgdGhlIGRlc2lyZWQgdGFuZ2VudCBzcGVlZCBmb3IgYSBjb252ZXlvciBiZWx0IGJlaGF2aW9yLlxuICogISN6aFxuICog5Li65Lyg6YCB5bim6K6+572u5pyf5pyb55qE5YiH57q/6YCf5bqmXG4gKiBAbWV0aG9kIHNldFRhbmdlbnRTcGVlZFxuICogQHBhcmFtIHtOdW1iZXJ9IHRhbmdlbnRTcGVlZFxuICovXG5fcC5zZXRUYW5nZW50U3BlZWQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLl9iMmNvbnRhY3QuU2V0VGFuZ2VudFNwZWVkKHZhbHVlIC8gUFRNX1JBVElPKTtcbn07XG4vKipcbiAqICEjZW5cbiAqIEdldCB0aGUgZGVzaXJlZCB0YW5nZW50IHNwZWVkLlxuICogISN6aFxuICog6I635Y+W5YiH57q/6YCf5bqmXG4gKiBAbWV0aG9kIGdldFRhbmdlbnRTcGVlZFxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5cbl9wLmdldFRhbmdlbnRTcGVlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fYjJjb250YWN0LkdldFRhbmdlbnRTcGVlZCgpICogUFRNX1JBVElPO1xufTtcblxuLyoqXG4gKiAhI2VuXG4gKiBPdmVycmlkZSB0aGUgZGVmYXVsdCBmcmljdGlvbiBtaXh0dXJlLiBZb3UgY2FuIGNhbGwgdGhpcyBpbiBvblByZVNvbHZlIGNhbGxiYWNrLlxuICogISN6aFxuICog6KaG55uW6buY6K6k55qE5pGp5pOm5Yqb57O75pWw44CC5L2g5Y+v5Lul5ZyoIG9uUHJlU29sdmUg5Zue6LCD5Lit6LCD55So5q2k5Ye95pWw44CCXG4gKiBAbWV0aG9kIHNldEZyaWN0aW9uXG4gKiBAcGFyYW0ge051bWJlcn0gZnJpY3Rpb25cbiAqL1xuX3Auc2V0RnJpY3Rpb24gPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLl9iMmNvbnRhY3QuU2V0RnJpY3Rpb24odmFsdWUpO1xufTtcbi8qKlxuICogISNlblxuICogR2V0IHRoZSBmcmljdGlvbi5cbiAqICEjemhcbiAqIOiOt+WPluW9k+WJjeaRqeaTpuWKm+ezu+aVsFxuICogQG1ldGhvZCBnZXRGcmljdGlvblxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5fcC5nZXRGcmljdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fYjJjb250YWN0LkdldEZyaWN0aW9uKCk7XG59O1xuLyoqXG4gKiAhI2VuXG4gKiBSZXNldCB0aGUgZnJpY3Rpb24gbWl4dHVyZSB0byB0aGUgZGVmYXVsdCB2YWx1ZS5cbiAqICEjemhcbiAqIOmHjee9ruaRqeaTpuWKm+ezu+aVsOWIsOm7mOiupOWAvFxuICogQG1ldGhvZCByZXNldEZyaWN0aW9uXG4gKi9cbl9wLnJlc2V0RnJpY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2IyY29udGFjdC5SZXNldEZyaWN0aW9uKCk7XG59O1xuLyoqXG4gKiAhI2VuXG4gKiBPdmVycmlkZSB0aGUgZGVmYXVsdCByZXN0aXR1dGlvbiBtaXh0dXJlLiBZb3UgY2FuIGNhbGwgdGhpcyBpbiBvblByZVNvbHZlIGNhbGxiYWNrLlxuICogISN6aFxuICog6KaG55uW6buY6K6k55qE5oGi5aSN57O75pWw44CC5L2g5Y+v5Lul5ZyoIG9uUHJlU29sdmUg5Zue6LCD5Lit6LCD55So5q2k5Ye95pWw44CCXG4gKiBAbWV0aG9kIHNldFJlc3RpdHV0aW9uXG4gKiBAcGFyYW0ge051bWJlcn0gcmVzdGl0dXRpb25cbiAqL1xuX3Auc2V0UmVzdGl0dXRpb24gPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLl9iMmNvbnRhY3QuU2V0UmVzdGl0dXRpb24odmFsdWUpO1xufTtcbi8qKlxuICogISNlblxuICogR2V0IHRoZSByZXN0aXR1dGlvbi5cbiAqICEjemhcbiAqIOiOt+WPluW9k+WJjeaBouWkjeezu+aVsFxuICogQG1ldGhvZCBnZXRSZXN0aXR1dGlvblxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5fcC5nZXRSZXN0aXR1dGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fYjJjb250YWN0LkdldFJlc3RpdHV0aW9uKCk7XG59O1xuLyoqXG4gKiAhI2VuXG4gKiBSZXNldCB0aGUgcmVzdGl0dXRpb24gbWl4dHVyZSB0byB0aGUgZGVmYXVsdCB2YWx1ZS5cbiAqICEjemhcbiAqIOmHjee9ruaBouWkjeezu+aVsOWIsOm7mOiupOWAvFxuICogQG1ldGhvZCByZXNldFJlc3RpdHV0aW9uXG4gKi9cbl9wLnJlc2V0UmVzdGl0dXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2IyY29udGFjdC5SZXNldFJlc3RpdHV0aW9uKCk7XG59O1xuXG5QaHlzaWNzQ29udGFjdC5Db250YWN0VHlwZSA9IENvbnRhY3RUeXBlO1xuY2MuUGh5c2ljc0NvbnRhY3QgPSBtb2R1bGUuZXhwb3J0cyA9IFBoeXNpY3NDb250YWN0O1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=