
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/actions.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _quat = _interopRequireDefault(require("../value-types/quat"));

var _vec = _interopRequireDefault(require("../value-types/vec3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _quat_tmp = cc.quat();

var _vec3_tmp = cc.v3();
/*
 * Rotates a Node object to a certain angle by modifying its quaternion property. <br/>
 * The direction will be decided by the shortest angle.
 * @class Rotate3DTo
 * @extends ActionInterval
 * @param {Number} duration duration in seconds
 * @param {Number|Vec3} dstAngleX dstAngleX in degrees.
 * @param {Number} [dstAngleY] dstAngleY in degrees.
 * @param {Number} [dstAngleZ] dstAngleZ in degrees.
 * @example
 * var rotate3DTo = new cc.Rotate3DTo(2, cc.v3(0, 180, 0));
 */


cc.Rotate3DTo = cc.Class({
  name: 'cc.Rotate3DTo',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, dstAngleX, dstAngleY, dstAngleZ) {
    this._startQuat = cc.quat();
    this._dstQuat = cc.quat();
    dstAngleX !== undefined && this.initWithDuration(duration, dstAngleX, dstAngleY, dstAngleZ);
  },

  /*
   * Initializes the action.
   * @param {Number} duration
   * @param {Number|Vec3|Quat} dstAngleX
   * @param {Number} dstAngleY
   * @param {Number} dstAngleZ
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(duration, dstAngleX, dstAngleY, dstAngleZ) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      var dstQuat = this._dstQuat;

      if (dstAngleX instanceof cc.Quat) {
        dstQuat.set(dstAngleX);
      } else {
        if (dstAngleX instanceof cc.Vec3) {
          dstAngleY = dstAngleX.y;
          dstAngleZ = dstAngleX.z;
          dstAngleX = dstAngleX.x;
        } else {
          dstAngleY = dstAngleY || 0;
          dstAngleZ = dstAngleZ || 0;
        }

        _quat["default"].fromEuler(dstQuat, dstAngleX, dstAngleY, dstAngleZ);
      }

      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.Rotate3DTo();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._dstQuat);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);

    this._startQuat.set(target.quat);
  },
  reverse: function reverse() {
    cc.logID(1016);
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);

    if (this.target) {
      _quat["default"].slerp(_quat_tmp, this._startQuat, this._dstQuat, dt);

      this.target.setRotation(_quat_tmp);
    }
  }
});
/**
 * !#en
 * Rotates a Node object to a certain angle by modifying its quternion property. <br/>
 * The direction will be decided by the shortest angle.
 * !#zh 旋转到目标角度，通过逐帧修改它的 quternion 属性，旋转方向将由最短的角度决定。
 * @method rotate3DTo
 * @param {Number} duration duration in seconds
 * @param {Number|Vec3|Quat} dstAngleX dstAngleX in degrees.
 * @param {Number} [dstAngleY] dstAngleY in degrees.
 * @param {Number} [dstAngleZ] dstAngleZ in degrees.
 * @return {ActionInterval}
 * @example
 * // example
 * var rotate3DTo = cc.rotate3DTo(2, cc.v3(0, 180, 0));
 */

cc.rotate3DTo = function (duration, dstAngleX, dstAngleY, dstAngleZ) {
  return new cc.Rotate3DTo(duration, dstAngleX, dstAngleY, dstAngleZ);
};
/*
 * Rotates a Node object counter clockwise a number of degrees by modifying its quaternion property.
 * Relative to its properties to modify.
 * @class Rotate3DBy
 * @extends ActionInterval
 * @param {Number} duration duration in seconds
 * @param {Number|Vec3} deltaAngleX deltaAngleX in degrees
 * @param {Number} [deltaAngleY] deltaAngleY in degrees
 * @param {Number} [deltaAngleZ] deltaAngleZ in degrees
 * @example
 * var actionBy = new cc.Rotate3DBy(2, cc.v3(0, 360, 0));
 */


cc.Rotate3DBy = cc.Class({
  name: 'cc.Rotate3DBy',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, deltaAngleX, deltaAngleY, deltaAngleZ) {
    this._startQuat = cc.quat();
    this._dstQuat = cc.quat();
    this._deltaAngle = cc.v3();
    deltaAngleX !== undefined && this.initWithDuration(duration, deltaAngleX, deltaAngleY, deltaAngleZ);
  },

  /*
   * Initializes the action.
   * @param {Number} duration duration in seconds
   * @param {Number|Vec3} deltaAngleX deltaAngleX in degrees
   * @param {Number} [deltaAngleY=] deltaAngleY in degrees
   * @param {Number} [deltaAngleZ=] deltaAngleZ in degrees
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(duration, deltaAngleX, deltaAngleY, deltaAngleZ) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      if (deltaAngleX instanceof cc.Vec3) {
        deltaAngleY = deltaAngleX.y;
        deltaAngleZ = deltaAngleX.z;
        deltaAngleX = deltaAngleX.x;
      } else {
        deltaAngleY = deltaAngleY || 0;
        deltaAngleZ = deltaAngleZ || 0;
      }

      _vec["default"].set(this._deltaAngle, deltaAngleX, deltaAngleY, deltaAngleZ);

      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.Rotate3DBy();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._angle);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    var startAngle = target.eulerAngles;
    var deltaAngle = this._deltaAngle;

    _quat["default"].fromEuler(this._dstQuat, startAngle.x + deltaAngle.x, startAngle.y + deltaAngle.y, startAngle.z + deltaAngle.z);

    this._startQuat.set(target.quat);
  },
  update: function () {
    var RAD = Math.PI / 180;
    return function (dt) {
      dt = this._computeEaseTime(dt);

      if (this.target) {
        _quat["default"].slerp(_quat_tmp, this._startQuat, this._dstQuat, dt);

        this.target.setRotation(_quat_tmp);
      }
    };
  }(),
  reverse: function reverse() {
    var angle = this._angle;
    _vec3_tmp.x = -angle.x;
    _vec3_tmp.y = -angle.y;
    _vec3_tmp.z = -angle.z;
    var action = new cc.Rotate3DBy(this._duration, _vec3_tmp);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  }
});
/**
 * !#en
 * Rotates a Node object counter clockwise a number of degrees by modifying its quaternion property.
 * Relative to its properties to modify.
 * !#zh 旋转指定的 3D 角度。
 * @method rotate3DBy
 * @param {Number} duration duration in seconds
 * @param {Number|Vec3} deltaAngleX deltaAngleX in degrees
 * @param {Number} [deltaAngleY] deltaAngleY in degrees
 * @param {Number} [deltaAngleZ] deltaAngleZ in degrees
 * @return {ActionInterval}
 * @example
 * // example
 * var actionBy = cc.rotate3DBy(2, cc.v3(0, 360, 0));
 */

cc.rotate3DBy = function (duration, deltaAngleX, deltaAngleY, deltaAngleZ) {
  return new cc.Rotate3DBy(duration, deltaAngleX, deltaAngleY, deltaAngleZ);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL2FjdGlvbnMuanMiXSwibmFtZXMiOlsiX3F1YXRfdG1wIiwiY2MiLCJxdWF0IiwiX3ZlYzNfdG1wIiwidjMiLCJSb3RhdGUzRFRvIiwiQ2xhc3MiLCJuYW1lIiwiQWN0aW9uSW50ZXJ2YWwiLCJjdG9yIiwiZHVyYXRpb24iLCJkc3RBbmdsZVgiLCJkc3RBbmdsZVkiLCJkc3RBbmdsZVoiLCJfc3RhcnRRdWF0IiwiX2RzdFF1YXQiLCJ1bmRlZmluZWQiLCJpbml0V2l0aER1cmF0aW9uIiwicHJvdG90eXBlIiwiY2FsbCIsImRzdFF1YXQiLCJRdWF0Iiwic2V0IiwiVmVjMyIsInkiLCJ6IiwieCIsImZyb21FdWxlciIsImNsb25lIiwiYWN0aW9uIiwiX2Nsb25lRGVjb3JhdGlvbiIsIl9kdXJhdGlvbiIsInN0YXJ0V2l0aFRhcmdldCIsInRhcmdldCIsInJldmVyc2UiLCJsb2dJRCIsInVwZGF0ZSIsImR0IiwiX2NvbXB1dGVFYXNlVGltZSIsInNsZXJwIiwic2V0Um90YXRpb24iLCJyb3RhdGUzRFRvIiwiUm90YXRlM0RCeSIsImRlbHRhQW5nbGVYIiwiZGVsdGFBbmdsZVkiLCJkZWx0YUFuZ2xlWiIsIl9kZWx0YUFuZ2xlIiwiX2FuZ2xlIiwic3RhcnRBbmdsZSIsImV1bGVyQW5nbGVzIiwiZGVsdGFBbmdsZSIsIlJBRCIsIk1hdGgiLCJQSSIsImFuZ2xlIiwiX3JldmVyc2VFYXNlTGlzdCIsInJvdGF0ZTNEQnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFDQTs7OztBQUVBLElBQUlBLFNBQVMsR0FBR0MsRUFBRSxDQUFDQyxJQUFILEVBQWhCOztBQUNBLElBQUlDLFNBQVMsR0FBR0YsRUFBRSxDQUFDRyxFQUFILEVBQWhCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQUgsRUFBRSxDQUFDSSxVQUFILEdBQWdCSixF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c0IsQ0FBVixHQUFjLENBQUM2QixLQUFLLENBQUM3QixDQUFyQjtBQUNBLFFBQUlJLE1BQU0sR0FBRyxJQUFJNUIsRUFBRSxDQUFDeUMsVUFBUCxDQUFrQixLQUFLWCxTQUF2QixFQUFrQzVCLFNBQWxDLENBQWI7O0FBQ0EsU0FBSzJCLGdCQUFMLENBQXNCRCxNQUF0Qjs7QUFDQSxTQUFLMEIsZ0JBQUwsQ0FBc0IxQixNQUF0Qjs7QUFDQSxXQUFPQSxNQUFQO0FBQ0g7QUExRW9CLENBQVQsQ0FBaEI7QUE2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBNUIsRUFBRSxDQUFDdUQsVUFBSCxHQUFnQixVQUFVOUMsUUFBVixFQUFvQmlDLFdBQXBCLEVBQWlDQyxXQUFqQyxFQUE4Q0MsV0FBOUMsRUFBMkQ7QUFDdkUsU0FBTyxJQUFJNUMsRUFBRSxDQUFDeUMsVUFBUCxDQUFrQmhDLFFBQWxCLEVBQTRCaUMsV0FBNUIsRUFBeUNDLFdBQXpDLEVBQXNEQyxXQUF0RCxDQUFQO0FBQ0gsQ0FGRCIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IFF1YXQgZnJvbSAnLi4vdmFsdWUtdHlwZXMvcXVhdCc7XG5pbXBvcnQgVmVjMyBmcm9tICcuLi92YWx1ZS10eXBlcy92ZWMzJztcblxubGV0IF9xdWF0X3RtcCA9IGNjLnF1YXQoKTtcbmxldCBfdmVjM190bXAgPSBjYy52MygpO1xuXG4vKlxuICogUm90YXRlcyBhIE5vZGUgb2JqZWN0IHRvIGEgY2VydGFpbiBhbmdsZSBieSBtb2RpZnlpbmcgaXRzIHF1YXRlcm5pb24gcHJvcGVydHkuIDxici8+XG4gKiBUaGUgZGlyZWN0aW9uIHdpbGwgYmUgZGVjaWRlZCBieSB0aGUgc2hvcnRlc3QgYW5nbGUuXG4gKiBAY2xhc3MgUm90YXRlM0RUb1xuICogQGV4dGVuZHMgQWN0aW9uSW50ZXJ2YWxcbiAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gKiBAcGFyYW0ge051bWJlcnxWZWMzfSBkc3RBbmdsZVggZHN0QW5nbGVYIGluIGRlZ3JlZXMuXG4gKiBAcGFyYW0ge051bWJlcn0gW2RzdEFuZ2xlWV0gZHN0QW5nbGVZIGluIGRlZ3JlZXMuXG4gKiBAcGFyYW0ge051bWJlcn0gW2RzdEFuZ2xlWl0gZHN0QW5nbGVaIGluIGRlZ3JlZXMuXG4gKiBAZXhhbXBsZVxuICogdmFyIHJvdGF0ZTNEVG8gPSBuZXcgY2MuUm90YXRlM0RUbygyLCBjYy52MygwLCAxODAsIDApKTtcbiAqL1xuY2MuUm90YXRlM0RUbyA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuUm90YXRlM0RUbycsXG4gICAgZXh0ZW5kczogY2MuQWN0aW9uSW50ZXJ2YWwsXG5cbiAgICBjdG9yOmZ1bmN0aW9uIChkdXJhdGlvbiwgZHN0QW5nbGVYLCBkc3RBbmdsZVksIGRzdEFuZ2xlWikge1xuICAgICAgICB0aGlzLl9zdGFydFF1YXQgPSBjYy5xdWF0KCk7XG4gICAgICAgIHRoaXMuX2RzdFF1YXQgPSBjYy5xdWF0KCk7XG5cblx0XHRkc3RBbmdsZVggIT09IHVuZGVmaW5lZCAmJiB0aGlzLmluaXRXaXRoRHVyYXRpb24oZHVyYXRpb24sIGRzdEFuZ2xlWCwgZHN0QW5nbGVZLCBkc3RBbmdsZVopO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBhY3Rpb24uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ8VmVjM3xRdWF0fSBkc3RBbmdsZVhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHN0QW5nbGVZXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGRzdEFuZ2xlWlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaW5pdFdpdGhEdXJhdGlvbjpmdW5jdGlvbiAoZHVyYXRpb24sIGRzdEFuZ2xlWCwgZHN0QW5nbGVZLCBkc3RBbmdsZVopIHtcbiAgICAgICAgaWYgKGNjLkFjdGlvbkludGVydmFsLnByb3RvdHlwZS5pbml0V2l0aER1cmF0aW9uLmNhbGwodGhpcywgZHVyYXRpb24pKSB7XG4gICAgICAgICAgICBsZXQgZHN0UXVhdCA9IHRoaXMuX2RzdFF1YXQ7XG4gICAgICAgICAgICBpZiAoZHN0QW5nbGVYIGluc3RhbmNlb2YgY2MuUXVhdCkge1xuICAgICAgICAgICAgICAgIGRzdFF1YXQuc2V0KGRzdEFuZ2xlWCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoZHN0QW5nbGVYIGluc3RhbmNlb2YgY2MuVmVjMykge1xuICAgICAgICAgICAgICAgICAgICBkc3RBbmdsZVkgPSBkc3RBbmdsZVgueTtcbiAgICAgICAgICAgICAgICAgICAgZHN0QW5nbGVaID0gZHN0QW5nbGVYLno7XG4gICAgICAgICAgICAgICAgICAgIGRzdEFuZ2xlWCA9IGRzdEFuZ2xlWC54O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZHN0QW5nbGVZID0gZHN0QW5nbGVZIHx8IDA7XG4gICAgICAgICAgICAgICAgICAgIGRzdEFuZ2xlWiA9IGRzdEFuZ2xlWiB8fCAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBRdWF0LmZyb21FdWxlcihkc3RRdWF0LCBkc3RBbmdsZVgsIGRzdEFuZ2xlWSwgZHN0QW5nbGVaKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgY2xvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLlJvdGF0ZTNEVG8oKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aER1cmF0aW9uKHRoaXMuX2R1cmF0aW9uLCB0aGlzLl9kc3RRdWF0KTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9LFxuXG4gICAgc3RhcnRXaXRoVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLnN0YXJ0V2l0aFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XG4gICAgICAgIHRoaXMuX3N0YXJ0UXVhdC5zZXQodGFyZ2V0LnF1YXQpO1xuICAgIH0sXG5cbiAgICByZXZlcnNlOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MubG9nSUQoMTAxNik7XG4gICAgfSxcblxuICAgIHVwZGF0ZTpmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgZHQgPSB0aGlzLl9jb21wdXRlRWFzZVRpbWUoZHQpO1xuICAgICAgICBpZiAodGhpcy50YXJnZXQpIHtcbiAgICAgICAgICAgIFF1YXQuc2xlcnAoX3F1YXRfdG1wLCB0aGlzLl9zdGFydFF1YXQsIHRoaXMuX2RzdFF1YXQsIGR0KTtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LnNldFJvdGF0aW9uKF9xdWF0X3RtcCk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBSb3RhdGVzIGEgTm9kZSBvYmplY3QgdG8gYSBjZXJ0YWluIGFuZ2xlIGJ5IG1vZGlmeWluZyBpdHMgcXV0ZXJuaW9uIHByb3BlcnR5LiA8YnIvPlxuICogVGhlIGRpcmVjdGlvbiB3aWxsIGJlIGRlY2lkZWQgYnkgdGhlIHNob3J0ZXN0IGFuZ2xlLlxuICogISN6aCDml4vovazliLDnm67moIfop5LluqbvvIzpgJrov4fpgJDluKfkv67mlLnlroPnmoQgcXV0ZXJuaW9uIOWxnuaAp++8jOaXi+i9rOaWueWQkeWwhueUseacgOefreeahOinkuW6puWGs+WumuOAglxuICogQG1ldGhvZCByb3RhdGUzRFRvXG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gZHVyYXRpb24gaW4gc2Vjb25kc1xuICogQHBhcmFtIHtOdW1iZXJ8VmVjM3xRdWF0fSBkc3RBbmdsZVggZHN0QW5nbGVYIGluIGRlZ3JlZXMuXG4gKiBAcGFyYW0ge051bWJlcn0gW2RzdEFuZ2xlWV0gZHN0QW5nbGVZIGluIGRlZ3JlZXMuXG4gKiBAcGFyYW0ge051bWJlcn0gW2RzdEFuZ2xlWl0gZHN0QW5nbGVaIGluIGRlZ3JlZXMuXG4gKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cbiAqIEBleGFtcGxlXG4gKiAvLyBleGFtcGxlXG4gKiB2YXIgcm90YXRlM0RUbyA9IGNjLnJvdGF0ZTNEVG8oMiwgY2MudjMoMCwgMTgwLCAwKSk7XG4gKi9cbmNjLnJvdGF0ZTNEVG8gPSBmdW5jdGlvbiAoZHVyYXRpb24sIGRzdEFuZ2xlWCwgZHN0QW5nbGVZLCBkc3RBbmdsZVopIHtcbiAgICByZXR1cm4gbmV3IGNjLlJvdGF0ZTNEVG8oZHVyYXRpb24sIGRzdEFuZ2xlWCwgZHN0QW5nbGVZLCBkc3RBbmdsZVopO1xufTtcblxuXG4vKlxuICogUm90YXRlcyBhIE5vZGUgb2JqZWN0IGNvdW50ZXIgY2xvY2t3aXNlIGEgbnVtYmVyIG9mIGRlZ3JlZXMgYnkgbW9kaWZ5aW5nIGl0cyBxdWF0ZXJuaW9uIHByb3BlcnR5LlxuICogUmVsYXRpdmUgdG8gaXRzIHByb3BlcnRpZXMgdG8gbW9kaWZ5LlxuICogQGNsYXNzIFJvdGF0ZTNEQnlcbiAqIEBleHRlbmRzIEFjdGlvbkludGVydmFsXG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gZHVyYXRpb24gaW4gc2Vjb25kc1xuICogQHBhcmFtIHtOdW1iZXJ8VmVjM30gZGVsdGFBbmdsZVggZGVsdGFBbmdsZVggaW4gZGVncmVlc1xuICogQHBhcmFtIHtOdW1iZXJ9IFtkZWx0YUFuZ2xlWV0gZGVsdGFBbmdsZVkgaW4gZGVncmVlc1xuICogQHBhcmFtIHtOdW1iZXJ9IFtkZWx0YUFuZ2xlWl0gZGVsdGFBbmdsZVogaW4gZGVncmVlc1xuICogQGV4YW1wbGVcbiAqIHZhciBhY3Rpb25CeSA9IG5ldyBjYy5Sb3RhdGUzREJ5KDIsIGNjLnYzKDAsIDM2MCwgMCkpO1xuICovXG5jYy5Sb3RhdGUzREJ5ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5Sb3RhdGUzREJ5JyxcbiAgICBleHRlbmRzOiBjYy5BY3Rpb25JbnRlcnZhbCxcblxuICAgIGN0b3I6IGZ1bmN0aW9uIChkdXJhdGlvbiwgZGVsdGFBbmdsZVgsIGRlbHRhQW5nbGVZLCBkZWx0YUFuZ2xlWikge1xuICAgICAgICB0aGlzLl9zdGFydFF1YXQgPSBjYy5xdWF0KCk7XG4gICAgICAgIHRoaXMuX2RzdFF1YXQgPSBjYy5xdWF0KCk7XG4gICAgICAgIHRoaXMuX2RlbHRhQW5nbGUgPSBjYy52MygpO1xuXHRcdGRlbHRhQW5nbGVYICE9PSB1bmRlZmluZWQgJiYgdGhpcy5pbml0V2l0aER1cmF0aW9uKGR1cmF0aW9uLCBkZWx0YUFuZ2xlWCwgZGVsdGFBbmdsZVksIGRlbHRhQW5nbGVaKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgYWN0aW9uLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ8VmVjM30gZGVsdGFBbmdsZVggZGVsdGFBbmdsZVggaW4gZGVncmVlc1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbZGVsdGFBbmdsZVk9XSBkZWx0YUFuZ2xlWSBpbiBkZWdyZWVzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtkZWx0YUFuZ2xlWj1dIGRlbHRhQW5nbGVaIGluIGRlZ3JlZXNcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGluaXRXaXRoRHVyYXRpb246ZnVuY3Rpb24gKGR1cmF0aW9uLCBkZWx0YUFuZ2xlWCwgZGVsdGFBbmdsZVksIGRlbHRhQW5nbGVaKSB7XG4gICAgICAgIGlmIChjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuaW5pdFdpdGhEdXJhdGlvbi5jYWxsKHRoaXMsIGR1cmF0aW9uKSkge1xuICAgICAgICAgICAgaWYgKGRlbHRhQW5nbGVYIGluc3RhbmNlb2YgY2MuVmVjMykge1xuICAgICAgICAgICAgICAgIGRlbHRhQW5nbGVZID0gZGVsdGFBbmdsZVgueTtcbiAgICAgICAgICAgICAgICBkZWx0YUFuZ2xlWiA9IGRlbHRhQW5nbGVYLno7XG4gICAgICAgICAgICAgICAgZGVsdGFBbmdsZVggPSBkZWx0YUFuZ2xlWC54O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVsdGFBbmdsZVkgPSBkZWx0YUFuZ2xlWSB8fCAwO1xuICAgICAgICAgICAgICAgIGRlbHRhQW5nbGVaID0gZGVsdGFBbmdsZVogfHwgMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgVmVjMy5zZXQodGhpcy5fZGVsdGFBbmdsZSwgZGVsdGFBbmdsZVgsIGRlbHRhQW5nbGVZLCBkZWx0YUFuZ2xlWik7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5Sb3RhdGUzREJ5KCk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICBhY3Rpb24uaW5pdFdpdGhEdXJhdGlvbih0aGlzLl9kdXJhdGlvbiwgdGhpcy5fYW5nbGUpO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBzdGFydFdpdGhUYXJnZXQ6ZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcbiAgICAgICAgXG4gICAgICAgIGxldCBzdGFydEFuZ2xlID0gdGFyZ2V0LmV1bGVyQW5nbGVzO1xuICAgICAgICBsZXQgZGVsdGFBbmdsZSA9IHRoaXMuX2RlbHRhQW5nbGU7XG4gICAgICAgIFF1YXQuZnJvbUV1bGVyKHRoaXMuX2RzdFF1YXQsIHN0YXJ0QW5nbGUueCArIGRlbHRhQW5nbGUueCwgc3RhcnRBbmdsZS55ICsgZGVsdGFBbmdsZS55LCBzdGFydEFuZ2xlLnogKyBkZWx0YUFuZ2xlLnopO1xuXG4gICAgICAgIHRoaXMuX3N0YXJ0UXVhdC5zZXQodGFyZ2V0LnF1YXQpO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IChmdW5jdGlvbigpe1xuICAgICAgICBsZXQgUkFEID0gTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkdCkge1xuICAgICAgICAgICAgZHQgPSB0aGlzLl9jb21wdXRlRWFzZVRpbWUoZHQpO1xuICAgICAgICAgICAgaWYgKHRoaXMudGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgUXVhdC5zbGVycChfcXVhdF90bXAsIHRoaXMuX3N0YXJ0UXVhdCwgdGhpcy5fZHN0UXVhdCwgZHQpO1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0LnNldFJvdGF0aW9uKF9xdWF0X3RtcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KSgpLFxuXG4gICAgcmV2ZXJzZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBhbmdsZSA9IHRoaXMuX2FuZ2xlO1xuICAgICAgICBfdmVjM190bXAueCA9IC1hbmdsZS54O1xuICAgICAgICBfdmVjM190bXAueSA9IC1hbmdsZS55O1xuICAgICAgICBfdmVjM190bXAueiA9IC1hbmdsZS56O1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLlJvdGF0ZTNEQnkodGhpcy5fZHVyYXRpb24sIF92ZWMzX3RtcCk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICB0aGlzLl9yZXZlcnNlRWFzZUxpc3QoYWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBSb3RhdGVzIGEgTm9kZSBvYmplY3QgY291bnRlciBjbG9ja3dpc2UgYSBudW1iZXIgb2YgZGVncmVlcyBieSBtb2RpZnlpbmcgaXRzIHF1YXRlcm5pb24gcHJvcGVydHkuXG4gKiBSZWxhdGl2ZSB0byBpdHMgcHJvcGVydGllcyB0byBtb2RpZnkuXG4gKiAhI3poIOaXi+i9rOaMh+WumueahCAzRCDop5LluqbjgIJcbiAqIEBtZXRob2Qgcm90YXRlM0RCeVxuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIGR1cmF0aW9uIGluIHNlY29uZHNcbiAqIEBwYXJhbSB7TnVtYmVyfFZlYzN9IGRlbHRhQW5nbGVYIGRlbHRhQW5nbGVYIGluIGRlZ3JlZXNcbiAqIEBwYXJhbSB7TnVtYmVyfSBbZGVsdGFBbmdsZVldIGRlbHRhQW5nbGVZIGluIGRlZ3JlZXNcbiAqIEBwYXJhbSB7TnVtYmVyfSBbZGVsdGFBbmdsZVpdIGRlbHRhQW5nbGVaIGluIGRlZ3JlZXNcbiAqIEByZXR1cm4ge0FjdGlvbkludGVydmFsfVxuICogQGV4YW1wbGVcbiAqIC8vIGV4YW1wbGVcbiAqIHZhciBhY3Rpb25CeSA9IGNjLnJvdGF0ZTNEQnkoMiwgY2MudjMoMCwgMzYwLCAwKSk7XG4gKi9cbmNjLnJvdGF0ZTNEQnkgPSBmdW5jdGlvbiAoZHVyYXRpb24sIGRlbHRhQW5nbGVYLCBkZWx0YUFuZ2xlWSwgZGVsdGFBbmdsZVopIHtcbiAgICByZXR1cm4gbmV3IGNjLlJvdGF0ZTNEQnkoZHVyYXRpb24sIGRlbHRhQW5nbGVYLCBkZWx0YUFuZ2xlWSwgZGVsdGFBbmdsZVopO1xufTtcblxuIl0sInNvdXJjZVJvb3QiOiIvIn0=