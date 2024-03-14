
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/actions/CCActionCatmullRom.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2008 Radu Gruian
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011 Vit Valentin
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 Orignal code by Radu Gruian: http://www.codeproject.com/Articles/30838/Overhauser-Catmull-Rom-Splines-for-Camera-Animatio.So

 Adapted to cocos2d-x by Vit Valentin

 Adapted from cocos2d-x to cocos2d-iphone by Ricardo Quesada
 ****************************************************************************/

/**
 * @module cc
 */

/*
 * Returns the Cardinal Spline position for a given set of control points, tension and time. <br />
 * CatmullRom Spline formula. <br />
 * s(-ttt + 2tt - t)P1 + s(-ttt + tt)P2 + (2ttt - 3tt + 1)P2 + s(ttt - 2tt + t)P3 + (-2ttt + 3tt)P3 + s(ttt - tt)P4
 *
 * @method cardinalSplineAt
 * @param {Vec2} p0
 * @param {Vec2} p1
 * @param {Vec2} p2
 * @param {Vec2} p3
 * @param {Number} tension
 * @param {Number} t
 * @return {Vec2}
 */
function cardinalSplineAt(p0, p1, p2, p3, tension, t) {
  var t2 = t * t;
  var t3 = t2 * t;
  /*
   * Formula: s(-ttt + 2tt - t)P1 + s(-ttt + tt)P2 + (2ttt - 3tt + 1)P2 + s(ttt - 2tt + t)P3 + (-2ttt + 3tt)P3 + s(ttt - tt)P4
   */

  var s = (1 - tension) / 2;
  var b1 = s * (-t3 + 2 * t2 - t); // s(-t3 + 2 t2 - t)P1

  var b2 = s * (-t3 + t2) + (2 * t3 - 3 * t2 + 1); // s(-t3 + t2)P2 + (2 t3 - 3 t2 + 1)P2

  var b3 = s * (t3 - 2 * t2 + t) + (-2 * t3 + 3 * t2); // s(t3 - 2 t2 + t)P3 + (-2 t3 + 3 t2)P3

  var b4 = s * (t3 - t2); // s(t3 - t2)P4

  var x = p0.x * b1 + p1.x * b2 + p2.x * b3 + p3.x * b4;
  var y = p0.y * b1 + p1.y * b2 + p2.y * b3 + p3.y * b4;
  return cc.v2(x, y);
}

;
/*
 * returns a point from the array
 * @method getControlPointAt
 * @param {Array} controlPoints
 * @param {Number} pos
 * @return {Array}
 */

function getControlPointAt(controlPoints, pos) {
  var p = Math.min(controlPoints.length - 1, Math.max(pos, 0));
  return controlPoints[p];
}

;

function reverseControlPoints(controlPoints) {
  var newArray = [];

  for (var i = controlPoints.length - 1; i >= 0; i--) {
    newArray.push(cc.v2(controlPoints[i].x, controlPoints[i].y));
  }

  return newArray;
}

function cloneControlPoints(controlPoints) {
  var newArray = [];

  for (var i = 0; i < controlPoints.length; i++) {
    newArray.push(cc.v2(controlPoints[i].x, controlPoints[i].y));
  }

  return newArray;
}
/*
 * Cardinal Spline path. http://en.wikipedia.org/wiki/Cubic_Hermite_spline#Cardinal_spline
 * Absolute coordinates.
 *
 * @class CardinalSplineTo
 * @extends ActionInterval
 *
 * @param {Number} duration
 * @param {Array} points array of control points
 * @param {Number} tension
 *
 * @example
 * //create a cc.CardinalSplineTo
 * var action1 = cc.cardinalSplineTo(3, array, 0);
 */


cc.CardinalSplineTo = cc.Class({
  name: 'cc.CardinalSplineTo',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, points, tension) {
    /* Array of control points */
    this._points = [];
    this._deltaT = 0;
    this._tension = 0;
    this._previousPosition = null;
    this._accumulatedDiff = null;
    tension !== undefined && cc.CardinalSplineTo.prototype.initWithDuration.call(this, duration, points, tension);
  },
  initWithDuration: function initWithDuration(duration, points, tension) {
    if (!points || points.length === 0) {
      cc.errorID(1024);
      return false;
    }

    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      this.setPoints(points);
      this._tension = tension;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.CardinalSplineTo();
    action.initWithDuration(this._duration, cloneControlPoints(this._points), this._tension);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target); // Issue #1441 from cocos2d-iphone

    this._deltaT = 1 / (this._points.length - 1);
    this._previousPosition = cc.v2(this.target.x, this.target.y);
    this._accumulatedDiff = cc.v2(0, 0);
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);
    var p, lt;
    var ps = this._points; // eg.
    // p..p..p..p..p..p..p
    // 1..2..3..4..5..6..7
    // want p to be 1, 2, 3, 4, 5, 6

    if (dt === 1) {
      p = ps.length - 1;
      lt = 1;
    } else {
      var locDT = this._deltaT;
      p = 0 | dt / locDT;
      lt = (dt - locDT * p) / locDT;
    }

    var newPos = cardinalSplineAt(getControlPointAt(ps, p - 1), getControlPointAt(ps, p - 0), getControlPointAt(ps, p + 1), getControlPointAt(ps, p + 2), this._tension, lt);

    if (cc.macro.ENABLE_STACKABLE_ACTIONS) {
      var tempX, tempY;
      tempX = this.target.x - this._previousPosition.x;
      tempY = this.target.y - this._previousPosition.y;

      if (tempX !== 0 || tempY !== 0) {
        var locAccDiff = this._accumulatedDiff;
        tempX = locAccDiff.x + tempX;
        tempY = locAccDiff.y + tempY;
        locAccDiff.x = tempX;
        locAccDiff.y = tempY;
        newPos.x += tempX;
        newPos.y += tempY;
      }
    }

    this.updatePosition(newPos);
  },
  reverse: function reverse() {
    var reversePoints = reverseControlPoints(this._points);
    return cc.cardinalSplineTo(this._duration, reversePoints, this._tension);
  },

  /*
   * update position of target
   * @method updatePosition
   * @param {Vec2} newPos
   */
  updatePosition: function updatePosition(newPos) {
    this.target.setPosition(newPos);
    this._previousPosition = newPos;
  },

  /*
   * Points getter
   * @method getPoints
   * @return {Array}
   */
  getPoints: function getPoints() {
    return this._points;
  },

  /**
   * Points setter
   * @method setPoints
   * @param {Array} points
   */
  setPoints: function setPoints(points) {
    this._points = points;
  }
});
/**
 * !#en Creates an action with a Cardinal Spline array of points and tension.
 * !#zh 按基数样条曲线轨迹移动到目标位置。
 * @method cardinalSplineTo
 * @param {Number} duration
 * @param {Array} points array of control points
 * @param {Number} tension
 * @return {ActionInterval}
 *
 * @example
 * //create a cc.CardinalSplineTo
 * var action1 = cc.cardinalSplineTo(3, array, 0);
 */

cc.cardinalSplineTo = function (duration, points, tension) {
  return new cc.CardinalSplineTo(duration, points, tension);
};
/*
 * Cardinal Spline path. http://en.wikipedia.org/wiki/Cubic_Hermite_spline#Cardinal_spline
 * Relative coordinates.
 *
 * @class CardinalSplineBy
 * @extends CardinalSplineTo
 *
 * @param {Number} duration
 * @param {Array} points
 * @param {Number} tension
 *
 * @example
 * //create a cc.CardinalSplineBy
 * var action1 = cc.cardinalSplineBy(3, array, 0);
 */


cc.CardinalSplineBy = cc.Class({
  name: 'cc.CardinalSplineBy',
  "extends": cc.CardinalSplineTo,
  ctor: function ctor(duration, points, tension) {
    this._startPosition = cc.v2(0, 0);
    tension !== undefined && this.initWithDuration(duration, points, tension);
  },
  startWithTarget: function startWithTarget(target) {
    cc.CardinalSplineTo.prototype.startWithTarget.call(this, target);
    this._startPosition.x = target.x;
    this._startPosition.y = target.y;
  },
  reverse: function reverse() {
    var copyConfig = this._points.slice();

    var current; //
    // convert "absolutes" to "diffs"
    //

    var p = copyConfig[0];

    for (var i = 1; i < copyConfig.length; ++i) {
      current = copyConfig[i];
      copyConfig[i] = current.sub(p);
      p = current;
    } // convert to "diffs" to "reverse absolute"


    var reverseArray = reverseControlPoints(copyConfig); // 1st element (which should be 0,0) should be here too

    p = reverseArray[reverseArray.length - 1];
    reverseArray.pop();
    p.x = -p.x;
    p.y = -p.y;
    reverseArray.unshift(p);

    for (var i = 1; i < reverseArray.length; ++i) {
      current = reverseArray[i];
      current.x = -current.x;
      current.y = -current.y;
      current.x += p.x;
      current.y += p.y;
      reverseArray[i] = current;
      p = current;
    }

    return cc.cardinalSplineBy(this._duration, reverseArray, this._tension);
  },

  /**
   * update position of target
   * @method updatePosition
   * @param {Vec2} newPos
   */
  updatePosition: function updatePosition(newPos) {
    var pos = this._startPosition;
    var posX = newPos.x + pos.x;
    var posY = newPos.y + pos.y;
    this._previousPosition.x = posX;
    this._previousPosition.y = posY;
    this.target.setPosition(posX, posY);
  },
  clone: function clone() {
    var a = new cc.CardinalSplineBy();
    a.initWithDuration(this._duration, cloneControlPoints(this._points), this._tension);
    return a;
  }
});
/**
 * !#en Creates an action with a Cardinal Spline array of points and tension.
 * !#zh 按基数样条曲线轨迹移动指定的距离。
 * @method cardinalSplineBy
 * @param {Number} duration
 * @param {Array} points
 * @param {Number} tension
 *
 * @return {ActionInterval}
 */

cc.cardinalSplineBy = function (duration, points, tension) {
  return new cc.CardinalSplineBy(duration, points, tension);
};
/*
 * An action that moves the target with a CatmullRom curve to a destination point.<br/>
 * A Catmull Rom is a Cardinal Spline with a tension of 0.5.  <br/>
 * http://en.wikipedia.org/wiki/Cubic_Hermite_spline#Catmull.E2.80.93Rom_spline
 * Absolute coordinates.
 *
 * @class CatmullRomTo
 * @extends CardinalSplineTo
 *
 * @param {Number} dt
 * @param {Array} points
 *
 * @example
 * var action1 = cc.catmullRomTo(3, array);
 */


cc.CatmullRomTo = cc.Class({
  name: 'cc.CatmullRomTo',
  "extends": cc.CardinalSplineTo,
  ctor: function ctor(dt, points) {
    points && this.initWithDuration(dt, points);
  },
  initWithDuration: function initWithDuration(dt, points) {
    return cc.CardinalSplineTo.prototype.initWithDuration.call(this, dt, points, 0.5);
  },
  clone: function clone() {
    var action = new cc.CatmullRomTo();
    action.initWithDuration(this._duration, cloneControlPoints(this._points));
    return action;
  }
});
/**
 * !#en Creates an action with a Cardinal Spline array of points and tension.
 * !#zh 按 Catmull Rom 样条曲线轨迹移动到目标位置。
 * @method catmullRomTo
 * @param {Number} dt
 * @param {Array} points
 * @return {ActionInterval}
 *
 * @example
 * var action1 = cc.catmullRomTo(3, array);
 */

cc.catmullRomTo = function (dt, points) {
  return new cc.CatmullRomTo(dt, points);
};
/*
 * An action that moves the target with a CatmullRom curve by a certain distance.  <br/>
 * A Catmull Rom is a Cardinal Spline with a tension of 0.5.<br/>
 * http://en.wikipedia.org/wiki/Cubic_Hermite_spline#Catmull.E2.80.93Rom_spline
 * Relative coordinates.
 *
 * @class CatmullRomBy
 * @extends CardinalSplineBy
 *
 * @param {Number} dt
 * @param {Array} points
 *
 * @example
 * var action1 = cc.catmullRomBy(3, array);
 */


cc.CatmullRomBy = cc.Class({
  name: 'cc.CatmullRomBy',
  "extends": cc.CardinalSplineBy,
  ctor: function ctor(dt, points) {
    points && this.initWithDuration(dt, points);
  },
  initWithDuration: function initWithDuration(dt, points) {
    return cc.CardinalSplineTo.prototype.initWithDuration.call(this, dt, points, 0.5);
  },
  clone: function clone() {
    var action = new cc.CatmullRomBy();
    action.initWithDuration(this._duration, cloneControlPoints(this._points));
    return action;
  }
});
/**
 * !#en Creates an action with a Cardinal Spline array of points and tension.
 * !#zh 按 Catmull Rom 样条曲线轨迹移动指定的距离。
 * @method catmullRomBy
 * @param {Number} dt
 * @param {Array} points
 * @return {ActionInterval}
 * @example
 * var action1 = cc.catmullRomBy(3, array);
 */

cc.catmullRomBy = function (dt, points) {
  return new cc.CatmullRomBy(dt, points);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9hY3Rpb25zL0NDQWN0aW9uQ2F0bXVsbFJvbS5qcyJdLCJuYW1lcyI6WyJjYXJkaW5hbFNwbGluZUF0IiwicDAiLCJwMSIsInAyIiwicDMiLCJ0ZW5zaW9uIiwidCIsInQyIiwidDMiLCJzIiwiYjEiLCJiMiIsImIzIiwiYjQiLCJ4IiwieSIsImNjIiwidjIiLCJnZXRDb250cm9sUG9pbnRBdCIsImNvbnRyb2xQb2ludHMiLCJwb3MiLCJwIiwiTWF0aCIsIm1pbiIsImxlbmd0aCIsIm1heCIsInJldmVyc2VDb250cm9sUG9pbnRzIiwibmV3QXJyYXkiLCJpIiwicHVzaCIsImNsb25lQ29udHJvbFBvaW50cyIsIkNhcmRpbmFsU3BsaW5lVG8iLCJDbGFzcyIsIm5hbWUiLCJBY3Rpb25JbnRlcnZhbCIsImN0b3IiLCJkdXJhdGlvbiIsInBvaW50cyIsIl9wb2ludHMiLCJfZGVsdGFUIiwiX3RlbnNpb24iLCJfcHJldmlvdXNQb3NpdGlvbiIsIl9hY2N1bXVsYXRlZERpZmYiLCJ1bmRlZmluZWQiLCJwcm90b3R5cGUiLCJpbml0V2l0aER1cmF0aW9uIiwiY2FsbCIsImVycm9ySUQiLCJzZXRQb2ludHMiLCJjbG9uZSIsImFjdGlvbiIsIl9kdXJhdGlvbiIsInN0YXJ0V2l0aFRhcmdldCIsInRhcmdldCIsInVwZGF0ZSIsImR0IiwiX2NvbXB1dGVFYXNlVGltZSIsImx0IiwicHMiLCJsb2NEVCIsIm5ld1BvcyIsIm1hY3JvIiwiRU5BQkxFX1NUQUNLQUJMRV9BQ1RJT05TIiwidGVtcFgiLCJ0ZW1wWSIsImxvY0FjY0RpZmYiLCJ1cGRhdGVQb3NpdGlvbiIsInJldmVyc2UiLCJyZXZlcnNlUG9pbnRzIiwiY2FyZGluYWxTcGxpbmVUbyIsInNldFBvc2l0aW9uIiwiZ2V0UG9pbnRzIiwiQ2FyZGluYWxTcGxpbmVCeSIsIl9zdGFydFBvc2l0aW9uIiwiY29weUNvbmZpZyIsInNsaWNlIiwiY3VycmVudCIsInN1YiIsInJldmVyc2VBcnJheSIsInBvcCIsInVuc2hpZnQiLCJjYXJkaW5hbFNwbGluZUJ5IiwicG9zWCIsInBvc1kiLCJhIiwiQ2F0bXVsbFJvbVRvIiwiY2F0bXVsbFJvbVRvIiwiQ2F0bXVsbFJvbUJ5IiwiY2F0bXVsbFJvbUJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTQSxnQkFBVCxDQUEyQkMsRUFBM0IsRUFBK0JDLEVBQS9CLEVBQW1DQyxFQUFuQyxFQUF1Q0MsRUFBdkMsRUFBMkNDLE9BQTNDLEVBQW9EQyxDQUFwRCxFQUF1RDtBQUNuRCxNQUFJQyxFQUFFLEdBQUdELENBQUMsR0FBR0EsQ0FBYjtBQUNBLE1BQUlFLEVBQUUsR0FBR0QsRUFBRSxHQUFHRCxDQUFkO0FBRUE7QUFDSjtBQUNBOztBQUNJLE1BQUlHLENBQUMsR0FBRyxDQUFDLElBQUlKLE9BQUwsSUFBZ0IsQ0FBeEI7QUFFQSxNQUFJSyxFQUFFLEdBQUdELENBQUMsSUFBSyxDQUFDRCxFQUFELEdBQU8sSUFBSUQsRUFBWixHQUFtQkQsQ0FBdkIsQ0FBVixDQVRtRCxDQVNPOztBQUMxRCxNQUFJSyxFQUFFLEdBQUdGLENBQUMsSUFBSSxDQUFDRCxFQUFELEdBQU1ELEVBQVYsQ0FBRCxJQUFrQixJQUFJQyxFQUFKLEdBQVMsSUFBSUQsRUFBYixHQUFrQixDQUFwQyxDQUFULENBVm1ELENBVU87O0FBQzFELE1BQUlLLEVBQUUsR0FBR0gsQ0FBQyxJQUFJRCxFQUFFLEdBQUcs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KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDA4IFJhZHUgR3J1aWFuXG4gQ29weXJpZ2h0IChjKSAyMDA4LTIwMTAgUmljYXJkbyBRdWVzYWRhXG4gQ29weXJpZ2h0IChjKSAyMDExIFZpdCBWYWxlbnRpblxuIENvcHlyaWdodCAoYykgMjAxMS0yMDEyIGNvY29zMmQteC5vcmdcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwOi8vd3d3LmNvY29zMmQteC5vcmdcblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuXG4gT3JpZ25hbCBjb2RlIGJ5IFJhZHUgR3J1aWFuOiBodHRwOi8vd3d3LmNvZGVwcm9qZWN0LmNvbS9BcnRpY2xlcy8zMDgzOC9PdmVyaGF1c2VyLUNhdG11bGwtUm9tLVNwbGluZXMtZm9yLUNhbWVyYS1BbmltYXRpby5Tb1xuXG4gQWRhcHRlZCB0byBjb2NvczJkLXggYnkgVml0IFZhbGVudGluXG5cbiBBZGFwdGVkIGZyb20gY29jb3MyZC14IHRvIGNvY29zMmQtaXBob25lIGJ5IFJpY2FyZG8gUXVlc2FkYVxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogQG1vZHVsZSBjY1xuICovXG5cbi8qXG4gKiBSZXR1cm5zIHRoZSBDYXJkaW5hbCBTcGxpbmUgcG9zaXRpb24gZm9yIGEgZ2l2ZW4gc2V0IG9mIGNvbnRyb2wgcG9pbnRzLCB0ZW5zaW9uIGFuZCB0aW1lLiA8YnIgLz5cbiAqIENhdG11bGxSb20gU3BsaW5lIGZvcm11bGEuIDxiciAvPlxuICogcygtdHR0ICsgMnR0IC0gdClQMSArIHMoLXR0dCArIHR0KVAyICsgKDJ0dHQgLSAzdHQgKyAxKVAyICsgcyh0dHQgLSAydHQgKyB0KVAzICsgKC0ydHR0ICsgM3R0KVAzICsgcyh0dHQgLSB0dClQNFxuICpcbiAqIEBtZXRob2QgY2FyZGluYWxTcGxpbmVBdFxuICogQHBhcmFtIHtWZWMyfSBwMFxuICogQHBhcmFtIHtWZWMyfSBwMVxuICogQHBhcmFtIHtWZWMyfSBwMlxuICogQHBhcmFtIHtWZWMyfSBwM1xuICogQHBhcmFtIHtOdW1iZXJ9IHRlbnNpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSB0XG4gKiBAcmV0dXJuIHtWZWMyfVxuICovXG5mdW5jdGlvbiBjYXJkaW5hbFNwbGluZUF0IChwMCwgcDEsIHAyLCBwMywgdGVuc2lvbiwgdCkge1xuICAgIHZhciB0MiA9IHQgKiB0O1xuICAgIHZhciB0MyA9IHQyICogdDtcblxuICAgIC8qXG4gICAgICogRm9ybXVsYTogcygtdHR0ICsgMnR0IC0gdClQMSArIHMoLXR0dCArIHR0KVAyICsgKDJ0dHQgLSAzdHQgKyAxKVAyICsgcyh0dHQgLSAydHQgKyB0KVAzICsgKC0ydHR0ICsgM3R0KVAzICsgcyh0dHQgLSB0dClQNFxuICAgICAqL1xuICAgIHZhciBzID0gKDEgLSB0ZW5zaW9uKSAvIDI7XG5cbiAgICB2YXIgYjEgPSBzICogKCgtdDMgKyAoMiAqIHQyKSkgLSB0KTsgICAgICAgICAgICAgICAgICAgICAgLy8gcygtdDMgKyAyIHQyIC0gdClQMVxuICAgIHZhciBiMiA9IHMgKiAoLXQzICsgdDIpICsgKDIgKiB0MyAtIDMgKiB0MiArIDEpOyAgICAgICAgICAvLyBzKC10MyArIHQyKVAyICsgKDIgdDMgLSAzIHQyICsgMSlQMlxuICAgIHZhciBiMyA9IHMgKiAodDMgLSAyICogdDIgKyB0KSArICgtMiAqIHQzICsgMyAqIHQyKTsgICAgICAvLyBzKHQzIC0gMiB0MiArIHQpUDMgKyAoLTIgdDMgKyAzIHQyKVAzXG4gICAgdmFyIGI0ID0gcyAqICh0MyAtIHQyKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHModDMgLSB0MilQNFxuXG4gICAgdmFyIHggPSAocDAueCAqIGIxICsgcDEueCAqIGIyICsgcDIueCAqIGIzICsgcDMueCAqIGI0KTtcbiAgICB2YXIgeSA9IChwMC55ICogYjEgKyBwMS55ICogYjIgKyBwMi55ICogYjMgKyBwMy55ICogYjQpO1xuICAgIHJldHVybiBjYy52Mih4LCB5KTtcbn07XG5cbi8qXG4gKiByZXR1cm5zIGEgcG9pbnQgZnJvbSB0aGUgYXJyYXlcbiAqIEBtZXRob2QgZ2V0Q29udHJvbFBvaW50QXRcbiAqIEBwYXJhbSB7QXJyYXl9IGNvbnRyb2xQb2ludHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBwb3NcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5mdW5jdGlvbiBnZXRDb250cm9sUG9pbnRBdCAoY29udHJvbFBvaW50cywgcG9zKSB7XG4gICAgdmFyIHAgPSBNYXRoLm1pbihjb250cm9sUG9pbnRzLmxlbmd0aCAtIDEsIE1hdGgubWF4KHBvcywgMCkpO1xuICAgIHJldHVybiBjb250cm9sUG9pbnRzW3BdO1xufTtcblxuZnVuY3Rpb24gcmV2ZXJzZUNvbnRyb2xQb2ludHMgKGNvbnRyb2xQb2ludHMpIHtcbiAgICB2YXIgbmV3QXJyYXkgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gY29udHJvbFBvaW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBuZXdBcnJheS5wdXNoKGNjLnYyKGNvbnRyb2xQb2ludHNbaV0ueCwgY29udHJvbFBvaW50c1tpXS55KSk7XG4gICAgfVxuICAgIHJldHVybiBuZXdBcnJheTtcbn1cblxuZnVuY3Rpb24gY2xvbmVDb250cm9sUG9pbnRzIChjb250cm9sUG9pbnRzKSB7XG4gICAgdmFyIG5ld0FycmF5ID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb250cm9sUG9pbnRzLmxlbmd0aDsgaSsrKVxuICAgICAgICBuZXdBcnJheS5wdXNoKGNjLnYyKGNvbnRyb2xQb2ludHNbaV0ueCwgY29udHJvbFBvaW50c1tpXS55KSk7XG4gICAgcmV0dXJuIG5ld0FycmF5O1xufVxuXG5cbi8qXG4gKiBDYXJkaW5hbCBTcGxpbmUgcGF0aC4gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9DdWJpY19IZXJtaXRlX3NwbGluZSNDYXJkaW5hbF9zcGxpbmVcbiAqIEFic29sdXRlIGNvb3JkaW5hdGVzLlxuICpcbiAqIEBjbGFzcyBDYXJkaW5hbFNwbGluZVRvXG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnRlcnZhbFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvblxuICogQHBhcmFtIHtBcnJheX0gcG9pbnRzIGFycmF5IG9mIGNvbnRyb2wgcG9pbnRzXG4gKiBAcGFyYW0ge051bWJlcn0gdGVuc2lvblxuICpcbiAqIEBleGFtcGxlXG4gKiAvL2NyZWF0ZSBhIGNjLkNhcmRpbmFsU3BsaW5lVG9cbiAqIHZhciBhY3Rpb24xID0gY2MuY2FyZGluYWxTcGxpbmVUbygzLCBhcnJheSwgMCk7XG4gKi9cbmNjLkNhcmRpbmFsU3BsaW5lVG8gPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkNhcmRpbmFsU3BsaW5lVG8nLFxuICAgIGV4dGVuZHM6IGNjLkFjdGlvbkludGVydmFsLFxuXG4gICAgY3RvcjogZnVuY3Rpb24gKGR1cmF0aW9uLCBwb2ludHMsIHRlbnNpb24pIHtcbiAgICAgICAgLyogQXJyYXkgb2YgY29udHJvbCBwb2ludHMgKi9cbiAgICAgICAgdGhpcy5fcG9pbnRzID0gW107XG4gICAgICAgIHRoaXMuX2RlbHRhVCA9IDA7XG4gICAgICAgIHRoaXMuX3RlbnNpb24gPSAwO1xuICAgICAgICB0aGlzLl9wcmV2aW91c1Bvc2l0aW9uID0gbnVsbDtcbiAgICAgICAgdGhpcy5fYWNjdW11bGF0ZWREaWZmID0gbnVsbDtcbiAgICAgICAgdGVuc2lvbiAhPT0gdW5kZWZpbmVkICYmIGNjLkNhcmRpbmFsU3BsaW5lVG8ucHJvdG90eXBlLmluaXRXaXRoRHVyYXRpb24uY2FsbCh0aGlzLCBkdXJhdGlvbiwgcG9pbnRzLCB0ZW5zaW9uKTtcbiAgICB9LFxuXG4gICAgaW5pdFdpdGhEdXJhdGlvbjpmdW5jdGlvbiAoZHVyYXRpb24sIHBvaW50cywgdGVuc2lvbikge1xuICAgICAgICBpZiAoIXBvaW50cyB8fCBwb2ludHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDEwMjQpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNjLkFjdGlvbkludGVydmFsLnByb3RvdHlwZS5pbml0V2l0aER1cmF0aW9uLmNhbGwodGhpcywgZHVyYXRpb24pKSB7XG4gICAgICAgICAgICB0aGlzLnNldFBvaW50cyhwb2ludHMpO1xuICAgICAgICAgICAgdGhpcy5fdGVuc2lvbiA9IHRlbnNpb247XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5DYXJkaW5hbFNwbGluZVRvKCk7XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aER1cmF0aW9uKHRoaXMuX2R1cmF0aW9uLCBjbG9uZUNvbnRyb2xQb2ludHModGhpcy5fcG9pbnRzKSwgdGhpcy5fdGVuc2lvbik7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIHN0YXJ0V2l0aFRhcmdldDpmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGNjLkFjdGlvbkludGVydmFsLnByb3RvdHlwZS5zdGFydFdpdGhUYXJnZXQuY2FsbCh0aGlzLCB0YXJnZXQpO1xuICAgICAgICAvLyBJc3N1ZSAjMTQ0MSBmcm9tIGNvY29zMmQtaXBob25lXG4gICAgICAgIHRoaXMuX2RlbHRhVCA9IDEgLyAodGhpcy5fcG9pbnRzLmxlbmd0aCAtIDEpO1xuICAgICAgICB0aGlzLl9wcmV2aW91c1Bvc2l0aW9uID0gY2MudjIodGhpcy50YXJnZXQueCwgdGhpcy50YXJnZXQueSk7XG4gICAgICAgIHRoaXMuX2FjY3VtdWxhdGVkRGlmZiA9IGNjLnYyKDAsIDApO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6ZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIGR0ID0gdGhpcy5fY29tcHV0ZUVhc2VUaW1lKGR0KTtcbiAgICAgICAgdmFyIHAsIGx0O1xuICAgICAgICB2YXIgcHMgPSB0aGlzLl9wb2ludHM7XG4gICAgICAgIC8vIGVnLlxuICAgICAgICAvLyBwLi5wLi5wLi5wLi5wLi5wLi5wXG4gICAgICAgIC8vIDEuLjIuLjMuLjQuLjUuLjYuLjdcbiAgICAgICAgLy8gd2FudCBwIHRvIGJlIDEsIDIsIDMsIDQsIDUsIDZcbiAgICAgICAgaWYgKGR0ID09PSAxKSB7XG4gICAgICAgICAgICBwID0gcHMubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIGx0ID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBsb2NEVCA9IHRoaXMuX2RlbHRhVDtcbiAgICAgICAgICAgIHAgPSAwIHwgKGR0IC8gbG9jRFQpO1xuICAgICAgICAgICAgbHQgPSAoZHQgLSBsb2NEVCAqIHApIC8gbG9jRFQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbmV3UG9zID0gY2FyZGluYWxTcGxpbmVBdChcbiAgICAgICAgICAgIGdldENvbnRyb2xQb2ludEF0KHBzLCBwIC0gMSksXG4gICAgICAgICAgICBnZXRDb250cm9sUG9pbnRBdChwcywgcCAtIDApLFxuICAgICAgICAgICAgZ2V0Q29udHJvbFBvaW50QXQocHMsIHAgKyAxKSxcbiAgICAgICAgICAgIGdldENvbnRyb2xQb2ludEF0KHBzLCBwICsgMiksXG4gICAgICAgICAgICB0aGlzLl90ZW5zaW9uLCBsdCk7XG5cbiAgICAgICAgaWYgKGNjLm1hY3JvLkVOQUJMRV9TVEFDS0FCTEVfQUNUSU9OUykge1xuICAgICAgICAgICAgdmFyIHRlbXBYLCB0ZW1wWTtcbiAgICAgICAgICAgIHRlbXBYID0gdGhpcy50YXJnZXQueCAtIHRoaXMuX3ByZXZpb3VzUG9zaXRpb24ueDtcbiAgICAgICAgICAgIHRlbXBZID0gdGhpcy50YXJnZXQueSAtIHRoaXMuX3ByZXZpb3VzUG9zaXRpb24ueTtcbiAgICAgICAgICAgIGlmICh0ZW1wWCAhPT0gMCB8fCB0ZW1wWSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHZhciBsb2NBY2NEaWZmID0gdGhpcy5fYWNjdW11bGF0ZWREaWZmO1xuICAgICAgICAgICAgICAgIHRlbXBYID0gbG9jQWNjRGlmZi54ICsgdGVtcFg7XG4gICAgICAgICAgICAgICAgdGVtcFkgPSBsb2NBY2NEaWZmLnkgKyB0ZW1wWTtcbiAgICAgICAgICAgICAgICBsb2NBY2NEaWZmLnggPSB0ZW1wWDtcbiAgICAgICAgICAgICAgICBsb2NBY2NEaWZmLnkgPSB0ZW1wWTtcbiAgICAgICAgICAgICAgICBuZXdQb3MueCArPSB0ZW1wWDtcbiAgICAgICAgICAgICAgICBuZXdQb3MueSArPSB0ZW1wWTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uKG5ld1Bvcyk7XG4gICAgfSxcblxuICAgIHJldmVyc2U6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcmV2ZXJzZVBvaW50cyA9IHJldmVyc2VDb250cm9sUG9pbnRzKHRoaXMuX3BvaW50cyk7XG4gICAgICAgIHJldHVybiBjYy5jYXJkaW5hbFNwbGluZVRvKHRoaXMuX2R1cmF0aW9uLCByZXZlcnNlUG9pbnRzLCB0aGlzLl90ZW5zaW9uKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiB1cGRhdGUgcG9zaXRpb24gb2YgdGFyZ2V0XG4gICAgICogQG1ldGhvZCB1cGRhdGVQb3NpdGlvblxuICAgICAqIEBwYXJhbSB7VmVjMn0gbmV3UG9zXG4gICAgICovXG4gICAgdXBkYXRlUG9zaXRpb246ZnVuY3Rpb24gKG5ld1Bvcykge1xuICAgICAgICB0aGlzLnRhcmdldC5zZXRQb3NpdGlvbihuZXdQb3MpO1xuICAgICAgICB0aGlzLl9wcmV2aW91c1Bvc2l0aW9uID0gbmV3UG9zO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIFBvaW50cyBnZXR0ZXJcbiAgICAgKiBAbWV0aG9kIGdldFBvaW50c1xuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIGdldFBvaW50czpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wb2ludHM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFBvaW50cyBzZXR0ZXJcbiAgICAgKiBAbWV0aG9kIHNldFBvaW50c1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IHBvaW50c1xuICAgICAqL1xuICAgIHNldFBvaW50czpmdW5jdGlvbiAocG9pbnRzKSB7XG4gICAgICAgIHRoaXMuX3BvaW50cyA9IHBvaW50cztcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuIENyZWF0ZXMgYW4gYWN0aW9uIHdpdGggYSBDYXJkaW5hbCBTcGxpbmUgYXJyYXkgb2YgcG9pbnRzIGFuZCB0ZW5zaW9uLlxuICogISN6aCDmjInln7rmlbDmoLfmnaHmm7Lnur/ovajov7nnp7vliqjliLDnm67moIfkvY3nva7jgIJcbiAqIEBtZXRob2QgY2FyZGluYWxTcGxpbmVUb1xuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uXG4gKiBAcGFyYW0ge0FycmF5fSBwb2ludHMgYXJyYXkgb2YgY29udHJvbCBwb2ludHNcbiAqIEBwYXJhbSB7TnVtYmVyfSB0ZW5zaW9uXG4gKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cbiAqXG4gKiBAZXhhbXBsZVxuICogLy9jcmVhdGUgYSBjYy5DYXJkaW5hbFNwbGluZVRvXG4gKiB2YXIgYWN0aW9uMSA9IGNjLmNhcmRpbmFsU3BsaW5lVG8oMywgYXJyYXksIDApO1xuICovXG5jYy5jYXJkaW5hbFNwbGluZVRvID0gZnVuY3Rpb24gKGR1cmF0aW9uLCBwb2ludHMsIHRlbnNpb24pIHtcbiAgICByZXR1cm4gbmV3IGNjLkNhcmRpbmFsU3BsaW5lVG8oZHVyYXRpb24sIHBvaW50cywgdGVuc2lvbik7XG59O1xuXG4vKlxuICogQ2FyZGluYWwgU3BsaW5lIHBhdGguIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ3ViaWNfSGVybWl0ZV9zcGxpbmUjQ2FyZGluYWxfc3BsaW5lXG4gKiBSZWxhdGl2ZSBjb29yZGluYXRlcy5cbiAqXG4gKiBAY2xhc3MgQ2FyZGluYWxTcGxpbmVCeVxuICogQGV4dGVuZHMgQ2FyZGluYWxTcGxpbmVUb1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvblxuICogQHBhcmFtIHtBcnJheX0gcG9pbnRzXG4gKiBAcGFyYW0ge051bWJlcn0gdGVuc2lvblxuICpcbiAqIEBleGFtcGxlXG4gKiAvL2NyZWF0ZSBhIGNjLkNhcmRpbmFsU3BsaW5lQnlcbiAqIHZhciBhY3Rpb24xID0gY2MuY2FyZGluYWxTcGxpbmVCeSgzLCBhcnJheSwgMCk7XG4gKi9cbmNjLkNhcmRpbmFsU3BsaW5lQnkgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkNhcmRpbmFsU3BsaW5lQnknLFxuICAgIGV4dGVuZHM6IGNjLkNhcmRpbmFsU3BsaW5lVG8sXG5cbiAgICBjdG9yOmZ1bmN0aW9uIChkdXJhdGlvbiwgcG9pbnRzLCB0ZW5zaW9uKSB7XG4gICAgICAgIHRoaXMuX3N0YXJ0UG9zaXRpb24gPSBjYy52MigwLCAwKTtcbiAgICAgICAgdGVuc2lvbiAhPT0gdW5kZWZpbmVkICYmIHRoaXMuaW5pdFdpdGhEdXJhdGlvbihkdXJhdGlvbiwgcG9pbnRzLCB0ZW5zaW9uKTtcbiAgICB9LFxuXG4gICAgc3RhcnRXaXRoVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgY2MuQ2FyZGluYWxTcGxpbmVUby5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcbiAgICAgICAgdGhpcy5fc3RhcnRQb3NpdGlvbi54ID0gdGFyZ2V0Lng7XG4gICAgICAgIHRoaXMuX3N0YXJ0UG9zaXRpb24ueSA9IHRhcmdldC55O1xuICAgIH0sXG5cbiAgICByZXZlcnNlOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvcHlDb25maWcgPSB0aGlzLl9wb2ludHMuc2xpY2UoKTtcbiAgICAgICAgdmFyIGN1cnJlbnQ7XG4gICAgICAgIC8vXG4gICAgICAgIC8vIGNvbnZlcnQgXCJhYnNvbHV0ZXNcIiB0byBcImRpZmZzXCJcbiAgICAgICAgLy9cbiAgICAgICAgdmFyIHAgPSBjb3B5Q29uZmlnWzBdO1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGNvcHlDb25maWcubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBjb3B5Q29uZmlnW2ldO1xuICAgICAgICAgICAgY29weUNvbmZpZ1tpXSA9IGN1cnJlbnQuc3ViKHApO1xuICAgICAgICAgICAgcCA9IGN1cnJlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjb252ZXJ0IHRvIFwiZGlmZnNcIiB0byBcInJldmVyc2UgYWJzb2x1dGVcIlxuICAgICAgICB2YXIgcmV2ZXJzZUFycmF5ID0gcmV2ZXJzZUNvbnRyb2xQb2ludHMoY29weUNvbmZpZyk7XG5cbiAgICAgICAgLy8gMXN0IGVsZW1lbnQgKHdoaWNoIHNob3VsZCBiZSAwLDApIHNob3VsZCBiZSBoZXJlIHRvb1xuICAgICAgICBwID0gcmV2ZXJzZUFycmF5WyByZXZlcnNlQXJyYXkubGVuZ3RoIC0gMSBdO1xuICAgICAgICByZXZlcnNlQXJyYXkucG9wKCk7XG5cbiAgICAgICAgcC54ID0gLXAueDtcbiAgICAgICAgcC55ID0gLXAueTtcblxuICAgICAgICByZXZlcnNlQXJyYXkudW5zaGlmdChwKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCByZXZlcnNlQXJyYXkubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGN1cnJlbnQgPSByZXZlcnNlQXJyYXlbaV07XG4gICAgICAgICAgICBjdXJyZW50LnggPSAtY3VycmVudC54O1xuICAgICAgICAgICAgY3VycmVudC55ID0gLWN1cnJlbnQueTtcbiAgICAgICAgICAgIGN1cnJlbnQueCArPSBwLng7XG4gICAgICAgICAgICBjdXJyZW50LnkgKz0gcC55O1xuICAgICAgICAgICAgcmV2ZXJzZUFycmF5W2ldID0gY3VycmVudDtcbiAgICAgICAgICAgIHAgPSBjdXJyZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYy5jYXJkaW5hbFNwbGluZUJ5KHRoaXMuX2R1cmF0aW9uLCByZXZlcnNlQXJyYXksIHRoaXMuX3RlbnNpb24pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiB1cGRhdGUgcG9zaXRpb24gb2YgdGFyZ2V0XG4gICAgICogQG1ldGhvZCB1cGRhdGVQb3NpdGlvblxuICAgICAqIEBwYXJhbSB7VmVjMn0gbmV3UG9zXG4gICAgICovXG4gICAgdXBkYXRlUG9zaXRpb246ZnVuY3Rpb24gKG5ld1Bvcykge1xuICAgICAgICB2YXIgcG9zID0gdGhpcy5fc3RhcnRQb3NpdGlvbjtcbiAgICAgICAgdmFyIHBvc1ggPSBuZXdQb3MueCArIHBvcy54O1xuICAgICAgICB2YXIgcG9zWSA9IG5ld1Bvcy55ICsgcG9zLnk7XG4gICAgICAgIHRoaXMuX3ByZXZpb3VzUG9zaXRpb24ueCA9IHBvc1g7XG4gICAgICAgIHRoaXMuX3ByZXZpb3VzUG9zaXRpb24ueSA9IHBvc1k7XG4gICAgICAgIHRoaXMudGFyZ2V0LnNldFBvc2l0aW9uKHBvc1gsIHBvc1kpO1xuICAgIH0sXG5cbiAgICBjbG9uZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhID0gbmV3IGNjLkNhcmRpbmFsU3BsaW5lQnkoKTtcbiAgICAgICAgYS5pbml0V2l0aER1cmF0aW9uKHRoaXMuX2R1cmF0aW9uLCBjbG9uZUNvbnRyb2xQb2ludHModGhpcy5fcG9pbnRzKSwgdGhpcy5fdGVuc2lvbik7XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqICEjZW4gQ3JlYXRlcyBhbiBhY3Rpb24gd2l0aCBhIENhcmRpbmFsIFNwbGluZSBhcnJheSBvZiBwb2ludHMgYW5kIHRlbnNpb24uXG4gKiAhI3poIOaMieWfuuaVsOagt+adoeabsue6v+i9qOi/ueenu+WKqOaMh+WumueahOi3neemu+OAglxuICogQG1ldGhvZCBjYXJkaW5hbFNwbGluZUJ5XG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb25cbiAqIEBwYXJhbSB7QXJyYXl9IHBvaW50c1xuICogQHBhcmFtIHtOdW1iZXJ9IHRlbnNpb25cbiAqXG4gKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cbiAqL1xuY2MuY2FyZGluYWxTcGxpbmVCeSA9IGZ1bmN0aW9uIChkdXJhdGlvbiwgcG9pbnRzLCB0ZW5zaW9uKSB7XG4gICAgcmV0dXJuIG5ldyBjYy5DYXJkaW5hbFNwbGluZUJ5KGR1cmF0aW9uLCBwb2ludHMsIHRlbnNpb24pO1xufTtcblxuLypcbiAqIEFuIGFjdGlvbiB0aGF0IG1vdmVzIHRoZSB0YXJnZXQgd2l0aCBhIENhdG11bGxSb20gY3VydmUgdG8gYSBkZXN0aW5hdGlvbiBwb2ludC48YnIvPlxuICogQSBDYXRtdWxsIFJvbSBpcyBhIENhcmRpbmFsIFNwbGluZSB3aXRoIGEgdGVuc2lvbiBvZiAwLjUuICA8YnIvPlxuICogaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9DdWJpY19IZXJtaXRlX3NwbGluZSNDYXRtdWxsLkUyLjgwLjkzUm9tX3NwbGluZVxuICogQWJzb2x1dGUgY29vcmRpbmF0ZXMuXG4gKlxuICogQGNsYXNzIENhdG11bGxSb21Ub1xuICogQGV4dGVuZHMgQ2FyZGluYWxTcGxpbmVUb1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBkdFxuICogQHBhcmFtIHtBcnJheX0gcG9pbnRzXG4gKlxuICogQGV4YW1wbGVcbiAqIHZhciBhY3Rpb24xID0gY2MuY2F0bXVsbFJvbVRvKDMsIGFycmF5KTtcbiAqL1xuY2MuQ2F0bXVsbFJvbVRvID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5DYXRtdWxsUm9tVG8nLFxuICAgIGV4dGVuZHM6IGNjLkNhcmRpbmFsU3BsaW5lVG8sXG5cbiAgICBjdG9yOiBmdW5jdGlvbihkdCwgcG9pbnRzKSB7XG4gICAgICAgIHBvaW50cyAmJiB0aGlzLmluaXRXaXRoRHVyYXRpb24oZHQsIHBvaW50cyk7XG4gICAgfSxcblxuICAgIGluaXRXaXRoRHVyYXRpb246ZnVuY3Rpb24gKGR0LCBwb2ludHMpIHtcbiAgICAgICAgcmV0dXJuIGNjLkNhcmRpbmFsU3BsaW5lVG8ucHJvdG90eXBlLmluaXRXaXRoRHVyYXRpb24uY2FsbCh0aGlzLCBkdCwgcG9pbnRzLCAwLjUpO1xuICAgIH0sXG5cbiAgICBjbG9uZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuQ2F0bXVsbFJvbVRvKCk7XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aER1cmF0aW9uKHRoaXMuX2R1cmF0aW9uLCBjbG9uZUNvbnRyb2xQb2ludHModGhpcy5fcG9pbnRzKSk7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlbiBDcmVhdGVzIGFuIGFjdGlvbiB3aXRoIGEgQ2FyZGluYWwgU3BsaW5lIGFycmF5IG9mIHBvaW50cyBhbmQgdGVuc2lvbi5cbiAqICEjemgg5oyJIENhdG11bGwgUm9tIOagt+adoeabsue6v+i9qOi/ueenu+WKqOWIsOebruagh+S9jee9ruOAglxuICogQG1ldGhvZCBjYXRtdWxsUm9tVG9cbiAqIEBwYXJhbSB7TnVtYmVyfSBkdFxuICogQHBhcmFtIHtBcnJheX0gcG9pbnRzXG4gKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIGFjdGlvbjEgPSBjYy5jYXRtdWxsUm9tVG8oMywgYXJyYXkpO1xuICovXG5jYy5jYXRtdWxsUm9tVG8gPSBmdW5jdGlvbiAoZHQsIHBvaW50cykge1xuICAgIHJldHVybiBuZXcgY2MuQ2F0bXVsbFJvbVRvKGR0LCBwb2ludHMpO1xufTtcblxuLypcbiAqIEFuIGFjdGlvbiB0aGF0IG1vdmVzIHRoZSB0YXJnZXQgd2l0aCBhIENhdG11bGxSb20gY3VydmUgYnkgYSBjZXJ0YWluIGRpc3RhbmNlLiAgPGJyLz5cbiAqIEEgQ2F0bXVsbCBSb20gaXMgYSBDYXJkaW5hbCBTcGxpbmUgd2l0aCBhIHRlbnNpb24gb2YgMC41Ljxici8+XG4gKiBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0N1YmljX0hlcm1pdGVfc3BsaW5lI0NhdG11bGwuRTIuODAuOTNSb21fc3BsaW5lXG4gKiBSZWxhdGl2ZSBjb29yZGluYXRlcy5cbiAqXG4gKiBAY2xhc3MgQ2F0bXVsbFJvbUJ5XG4gKiBAZXh0ZW5kcyBDYXJkaW5hbFNwbGluZUJ5XG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGR0XG4gKiBAcGFyYW0ge0FycmF5fSBwb2ludHNcbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIGFjdGlvbjEgPSBjYy5jYXRtdWxsUm9tQnkoMywgYXJyYXkpO1xuICovXG5jYy5DYXRtdWxsUm9tQnkgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkNhdG11bGxSb21CeScsXG4gICAgZXh0ZW5kczogY2MuQ2FyZGluYWxTcGxpbmVCeSxcblxuICAgIGN0b3I6IGZ1bmN0aW9uKGR0LCBwb2ludHMpIHtcbiAgICAgICAgcG9pbnRzICYmIHRoaXMuaW5pdFdpdGhEdXJhdGlvbihkdCwgcG9pbnRzKTtcbiAgICB9LFxuXG4gICAgaW5pdFdpdGhEdXJhdGlvbjpmdW5jdGlvbiAoZHQsIHBvaW50cykge1xuICAgICAgICByZXR1cm4gY2MuQ2FyZGluYWxTcGxpbmVUby5wcm90b3R5cGUuaW5pdFdpdGhEdXJhdGlvbi5jYWxsKHRoaXMsIGR0LCBwb2ludHMsIDAuNSk7XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5DYXRtdWxsUm9tQnkoKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoRHVyYXRpb24odGhpcy5fZHVyYXRpb24sIGNsb25lQ29udHJvbFBvaW50cyh0aGlzLl9wb2ludHMpKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuIENyZWF0ZXMgYW4gYWN0aW9uIHdpdGggYSBDYXJkaW5hbCBTcGxpbmUgYXJyYXkgb2YgcG9pbnRzIGFuZCB0ZW5zaW9uLlxuICogISN6aCDmjIkgQ2F0bXVsbCBSb20g5qC35p2h5puy57q/6L2o6L+556e75Yqo5oyH5a6a55qE6Led56a744CCXG4gKiBAbWV0aG9kIGNhdG11bGxSb21CeVxuICogQHBhcmFtIHtOdW1iZXJ9IGR0XG4gKiBAcGFyYW0ge0FycmF5fSBwb2ludHNcbiAqIEByZXR1cm4ge0FjdGlvbkludGVydmFsfVxuICogQGV4YW1wbGVcbiAqIHZhciBhY3Rpb24xID0gY2MuY2F0bXVsbFJvbUJ5KDMsIGFycmF5KTtcbiAqL1xuY2MuY2F0bXVsbFJvbUJ5ID0gZnVuY3Rpb24gKGR0LCBwb2ludHMpIHtcbiAgICByZXR1cm4gbmV3IGNjLkNhdG11bGxSb21CeShkdCwgcG9pbnRzKTtcbn07XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==