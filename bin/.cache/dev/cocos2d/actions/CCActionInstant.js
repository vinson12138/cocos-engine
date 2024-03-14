
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/actions/CCActionInstant.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
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
 ****************************************************************************/

/**
 * @module cc
 */

/**
 * !#en Instant actions are immediate actions. They don't have a duration like the ActionInterval actions.
 * !#zh 即时动作，这种动作立即就会执行，继承自 FiniteTimeAction。
 * @class ActionInstant
 * @extends FiniteTimeAction
 */
cc.ActionInstant = cc.Class({
  name: 'cc.ActionInstant',
  "extends": cc.FiniteTimeAction,
  isDone: function isDone() {
    return true;
  },
  step: function step(dt) {
    this.update(1);
  },
  update: function update(dt) {//nothing
  },

  /**
   * returns a reversed action. <br />
   * For example: <br />
   * - The action is x coordinates of 0 move to 100. <br />
   * - The reversed action will be x of 100 move to 0.
   * @returns {Action}
   */
  reverse: function reverse() {
    return this.clone();
  },
  clone: function clone() {
    return new cc.ActionInstant();
  }
});
/**
 * @module cc
 */

/*
 * Show the node.
 * @class Show
 * @extends ActionInstant
 */

cc.Show = cc.Class({
  name: 'cc.Show',
  "extends": cc.ActionInstant,
  update: function update(dt) {
    var _renderComps = this.target.getComponentsInChildren(cc.RenderComponent);

    for (var i = 0; i < _renderComps.length; ++i) {
      var render = _renderComps[i];
      render.enabled = true;
    }
  },
  reverse: function reverse() {
    return new cc.Hide();
  },
  clone: function clone() {
    return new cc.Show();
  }
});
/**
 * !#en Show the Node.
 * !#zh 立即显示。
 * @method show
 * @return {ActionInstant}
 * @example
 * // example
 * var showAction = cc.show();
 */

cc.show = function () {
  return new cc.Show();
};
/*
 * Hide the node.
 * @class Hide
 * @extends ActionInstant
 */


cc.Hide = cc.Class({
  name: 'cc.Hide',
  "extends": cc.ActionInstant,
  update: function update(dt) {
    var _renderComps = this.target.getComponentsInChildren(cc.RenderComponent);

    for (var i = 0; i < _renderComps.length; ++i) {
      var render = _renderComps[i];
      render.enabled = false;
    }
  },
  reverse: function reverse() {
    return new cc.Show();
  },
  clone: function clone() {
    return new cc.Hide();
  }
});
/**
 * !#en Hide the node.
 * !#zh 立即隐藏。
 * @method hide
 * @return {ActionInstant}
 * @example
 * // example
 * var hideAction = cc.hide();
 */

cc.hide = function () {
  return new cc.Hide();
};
/*
 * Toggles the visibility of a node.
 * @class ToggleVisibility
 * @extends ActionInstant
 */


cc.ToggleVisibility = cc.Class({
  name: 'cc.ToggleVisibility',
  "extends": cc.ActionInstant,
  update: function update(dt) {
    var _renderComps = this.target.getComponentsInChildren(cc.RenderComponent);

    for (var i = 0; i < _renderComps.length; ++i) {
      var render = _renderComps[i];
      render.enabled = !render.enabled;
    }
  },
  reverse: function reverse() {
    return new cc.ToggleVisibility();
  },
  clone: function clone() {
    return new cc.ToggleVisibility();
  }
});
/**
 * !#en Toggles the visibility of a node.
 * !#zh 显隐状态切换。
 * @method toggleVisibility
 * @return {ActionInstant}
 * @example
 * // example
 * var toggleVisibilityAction = cc.toggleVisibility();
 */

cc.toggleVisibility = function () {
  return new cc.ToggleVisibility();
};
/*
 * Delete self in the next frame.
 * @class RemoveSelf
 * @extends ActionInstant
 * @param {Boolean} [isNeedCleanUp=true]
 *
 * @example
 * // example
 * var removeSelfAction = new cc.RemoveSelf(false);
 */


cc.RemoveSelf = cc.Class({
  name: 'cc.RemoveSelf',
  "extends": cc.ActionInstant,
  ctor: function ctor(isNeedCleanUp) {
    this._isNeedCleanUp = true;
    isNeedCleanUp !== undefined && this.init(isNeedCleanUp);
  },
  update: function update(dt) {
    this.target.removeFromParent(this._isNeedCleanUp);
  },
  init: function init(isNeedCleanUp) {
    this._isNeedCleanUp = isNeedCleanUp;
    return true;
  },
  reverse: function reverse() {
    return new cc.RemoveSelf(this._isNeedCleanUp);
  },
  clone: function clone() {
    return new cc.RemoveSelf(this._isNeedCleanUp);
  }
});
/**
 * !#en Create a RemoveSelf object with a flag indicate whether the target should be cleaned up while removing.
 * !#zh 从父节点移除自身。
 * @method removeSelf
 * @param {Boolean} [isNeedCleanUp = true]
 * @return {ActionInstant}
 *
 * @example
 * // example
 * var removeSelfAction = cc.removeSelf();
 */

cc.removeSelf = function (isNeedCleanUp) {
  return new cc.RemoveSelf(isNeedCleanUp);
};
/*
 * Create an action to destroy self.
 * @class DestroySelf
 * @extends ActionInstant
 *
 * @example
 * var destroySelfAction = new cc.DestroySelf();
 */


cc.DestroySelf = cc.Class({
  name: 'cc.DestroySelf',
  "extends": cc.ActionInstant,
  update: function update() {
    this.target.destroy();
  },
  reverse: function reverse() {
    return new cc.DestroySelf();
  },
  clone: function clone() {
    return new cc.DestroySelf();
  }
});
/**
 * !#en Destroy self
 * !#zh 创建一个销毁自身的动作。
 * @method destroySelf
 * @return {ActionInstant}
 *
 * @example
 * var destroySelfAction = cc.destroySelf();
 */

cc.destroySelf = function () {
  return new cc.DestroySelf();
};
/*
 * Flips the sprite horizontally.
 * @class FlipX
 * @extends ActionInstant
 * @param {Boolean} flip Indicate whether the target should be flipped or not
 *
 * @example
 * var flipXAction = new cc.FlipX(true);
 */


cc.FlipX = cc.Class({
  name: 'cc.FlipX',
  "extends": cc.ActionInstant,
  ctor: function ctor(flip) {
    this._flippedX = false;
    flip !== undefined && this.initWithFlipX(flip);
  },

  /*
   * initializes the action with a set flipX.
   * @param {Boolean} flip
   * @return {Boolean}
   */
  initWithFlipX: function initWithFlipX(flip) {
    this._flippedX = flip;
    return true;
  },
  update: function update(dt) {
    this.target.scaleX = Math.abs(this.target.scaleX) * (this._flippedX ? -1 : 1);
  },
  reverse: function reverse() {
    return new cc.FlipX(!this._flippedX);
  },
  clone: function clone() {
    var action = new cc.FlipX();
    action.initWithFlipX(this._flippedX);
    return action;
  }
});
/**
 * !#en Create a FlipX action to flip or unflip the target.
 * !#zh X轴翻转。
 * @method flipX
 * @param {Boolean} flip Indicate whether the target should be flipped or not
 * @return {ActionInstant}
 * @example
 * var flipXAction = cc.flipX(true);
 */

cc.flipX = function (flip) {
  return new cc.FlipX(flip);
};
/*
 * Flips the sprite vertically
 * @class FlipY
 * @extends ActionInstant
 * @param {Boolean} flip
 * @example
 * var flipYAction = new cc.FlipY(true);
 */


cc.FlipY = cc.Class({
  name: 'cc.FlipY',
  "extends": cc.ActionInstant,
  ctor: function ctor(flip) {
    this._flippedY = false;
    flip !== undefined && this.initWithFlipY(flip);
  },

  /*
   * initializes the action with a set flipY.
   * @param {Boolean} flip
   * @return {Boolean}
   */
  initWithFlipY: function initWithFlipY(flip) {
    this._flippedY = flip;
    return true;
  },
  update: function update(dt) {
    this.target.scaleY = Math.abs(this.target.scaleY) * (this._flippedY ? -1 : 1);
  },
  reverse: function reverse() {
    return new cc.FlipY(!this._flippedY);
  },
  clone: function clone() {
    var action = new cc.FlipY();
    action.initWithFlipY(this._flippedY);
    return action;
  }
});
/**
 * !#en Create a FlipY action to flip or unflip the target.
 * !#zh Y轴翻转。
 * @method flipY
 * @param {Boolean} flip
 * @return {ActionInstant}
 * @example
 * var flipYAction = cc.flipY(true);
 */

cc.flipY = function (flip) {
  return new cc.FlipY(flip);
};
/*
 * Places the node in a certain position
 * @class Place
 * @extends ActionInstant
 * @param {Vec2|Number} pos
 * @param {Number} [y]
 * @example
 * var placeAction = new cc.Place(cc.v2(200, 200));
 * var placeAction = new cc.Place(200, 200);
 */


cc.Place = cc.Class({
  name: 'cc.Place',
  "extends": cc.ActionInstant,
  ctor: function ctor(pos, y) {
    this._x = 0;
    this._y = 0;

    if (pos !== undefined) {
      if (pos.x !== undefined) {
        y = pos.y;
        pos = pos.x;
      }

      this.initWithPosition(pos, y);
    }
  },

  /*
   * Initializes a Place action with a position
   * @param {number} x
   * @param {number} y
   * @return {Boolean}
   */
  initWithPosition: function initWithPosition(x, y) {
    this._x = x;
    this._y = y;
    return true;
  },
  update: function update(dt) {
    this.target.setPosition(this._x, this._y);
  },
  clone: function clone() {
    var action = new cc.Place();
    action.initWithPosition(this._x, this._y);
    return action;
  }
});
/**
 * !#en Creates a Place action with a position.
 * !#zh 放置在目标位置。
 * @method place
 * @param {Vec2|Number} pos
 * @param {Number} [y]
 * @return {ActionInstant}
 * @example
 * // example
 * var placeAction = cc.place(cc.v2(200, 200));
 * var placeAction = cc.place(200, 200);
 */

cc.place = function (pos, y) {
  return new cc.Place(pos, y);
};
/*
 * Calls a 'callback'.
 * @class CallFunc
 * @extends ActionInstant
 * @param {function} selector
 * @param {object} [selectorTarget=null]
 * @param {*} [data=null] data for function, it accepts all data types.
 * @example
 * // example
 * // CallFunc without data
 * var finish = new cc.CallFunc(this.removeSprite, this);
 *
 * // CallFunc with data
 * var finish = new cc.CallFunc(this.removeFromParentAndCleanup, this,  true);
 */


cc.CallFunc = cc.Class({
  name: 'cc.CallFunc',
  "extends": cc.ActionInstant,

  /*
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
  * Creates a CallFunc action with the callback.
  * @param {function} selector
  * @param {object} [selectorTarget=null]
  * @param {*} [data=null] data for function, it accepts all data types.
  */
  ctor: function ctor(selector, selectorTarget, data) {
    this._selectorTarget = null;
    this._function = null;
    this._data = null;
    this.initWithFunction(selector, selectorTarget, data);
  },

  /*
   * Initializes the action with a function or function and its target
   * @param {function} selector
   * @param {object|Null} selectorTarget
   * @param {*|Null} [data] data for function, it accepts all data types.
   * @return {Boolean}
   */
  initWithFunction: function initWithFunction(selector, selectorTarget, data) {
    if (selector) {
      this._function = selector;
    }

    if (selectorTarget) {
      this._selectorTarget = selectorTarget;
    }

    if (data !== undefined) {
      this._data = data;
    }

    return true;
  },

  /*
   * execute the function.
   */
  execute: function execute() {
    if (this._function) {
      this._function.call(this._selectorTarget, this.target, this._data);
    }
  },
  update: function update(dt) {
    this.execute();
  },

  /*
   * Get selectorTarget.
   * @return {object}
   */
  getTargetCallback: function getTargetCallback() {
    return this._selectorTarget;
  },

  /*
   * Set selectorTarget.
   * @param {object} sel
   */
  setTargetCallback: function setTargetCallback(sel) {
    if (sel !== this._selectorTarget) {
      if (this._selectorTarget) this._selectorTarget = null;
      this._selectorTarget = sel;
    }
  },
  clone: function clone() {
    var action = new cc.CallFunc();
    action.initWithFunction(this._function, this._selectorTarget, this._data);
    return action;
  }
});
/**
 * !#en Creates the action with the callback.
 * !#zh 执行回调函数。
 * @method callFunc
 * @param {function} selector
 * @param {object} [selectorTarget=null]
 * @param {*} [data=null] - data for function, it accepts all data types.
 * @return {ActionInstant}
 * @example
 * // example
 * // CallFunc without data
 * var finish = cc.callFunc(this.removeSprite, this);
 *
 * // CallFunc with data
 * var finish = cc.callFunc(this.removeFromParentAndCleanup, this._grossini,  true);
 */

cc.callFunc = function (selector, selectorTarget, data) {
  return new cc.CallFunc(selector, selectorTarget, data);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9hY3Rpb25zL0NDQWN0aW9uSW5zdGFudC5qcyJdLCJuYW1lcyI6WyJjYyIsIkFjdGlvbkluc3RhbnQiLCJDbGFzcyIsIm5hbWUiLCJGaW5pdGVUaW1lQWN0aW9uIiwiaXNEb25lIiwic3RlcCIsImR0IiwidXBkYXRlIiwicmV2ZXJzZSIsImNsb25lIiwiU2hvdyIsIl9yZW5kZXJDb21wcyIsInRhcmdldCIsImdldENvbXBvbmVudHNJbkNoaWxkcmVuIiwiUmVuZGVyQ29tcG9uZW50IiwiaSIsImxlbmd0aCIsInJlbmRlciIsImVuYWJsZWQiLCJIaWRlIiwic2hvdyIsImhpZGUiLCJUb2dnbGVWaXNpYmlsaXR5IiwidG9nZ2xlVmlzaWJpbGl0eSIsIlJlbW92ZVNlbGYiLCJjdG9yIiwiaXNOZWVkQ2xlYW5VcCIsIl9pc05lZWRDbGVhblVwIiwidW5kZWZpbmVkIiwiaW5pdCIsInJlbW92ZUZyb21QYXJlbnQiLCJyZW1vdmVTZWxmIiwiRGVzdHJveVNlbGYiLCJkZXN0cm95IiwiZGVzdHJveVNlbGYiLCJGbGlwWCIsImZsaXAiLCJfZmxpcHBlZFgiLCJpbml0V2l0aEZsaXBYIiwic2NhbGVYIiwiTWF0aCIsImFicyIsImFjdGlvbiIsImZsaXBYIiwiRmxpcFkiLCJfZmxpcHBlZFkiLCJpbml0V2l0aEZsaXBZIiwic2NhbGVZIiwiZmxpcFkiLCJQbGFjZSIsInBvcyIsInkiLCJfeCIsIl95IiwieCIsImluaXRXaXRoUG9zaXRpb24iLCJzZXRQb3NpdGlvbiIsInBsYWNlIiwiQ2FsbEZ1bmMiLCJzZWxlY3RvciIsInNlbGVjdG9yVGFyZ2V0IiwiZGF0YSIsIl9zZWxlY3RvclRhcmdldCIsIl9mdW5jdGlvbiIsIl9kYXRhIiwiaW5pdFdpdGhGdW5jdGlvbiIsImV4ZWN1dGUiLCJjYWxsIiwiZ2V0VGFyZ2V0Q2FsbGJhY2siLCJzZXRUYXJnZXRDYWxsYmFjayIsInNlbCIsImNhbGxGdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7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QUFULENBQWQ7QUE4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EzQyxFQUFFLENBQUN3RSxRQUFILEdBQWMsVUFBVVosUUFBVixFQUFvQkMsY0FBcEIsRUFBb0NDLElBQXBDLEVBQTBDO0FBQ3BELFNBQU8sSUFBSTlELEVBQUUsQ0FBQzJELFFBQVAsQ0FBZ0JDLFFBQWhCLEVBQTBCQyxjQUExQixFQUEwQ0MsSUFBMUMsQ0FBUDtBQUNILENBRkQiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAwOC0yMDEwIFJpY2FyZG8gUXVlc2FkYVxuIENvcHlyaWdodCAoYykgMjAxMS0yMDEyIGNvY29zMmQteC5vcmdcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwOi8vd3d3LmNvY29zMmQteC5vcmdcblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogQG1vZHVsZSBjY1xuICovXG5cbi8qKlxuICogISNlbiBJbnN0YW50IGFjdGlvbnMgYXJlIGltbWVkaWF0ZSBhY3Rpb25zLiBUaGV5IGRvbid0IGhhdmUgYSBkdXJhdGlvbiBsaWtlIHRoZSBBY3Rpb25JbnRlcnZhbCBhY3Rpb25zLlxuICogISN6aCDljbPml7bliqjkvZzvvIzov5nnp43liqjkvZznq4vljbPlsLHkvJrmiafooYzvvIznu6fmib/oh6ogRmluaXRlVGltZUFjdGlvbuOAglxuICogQGNsYXNzIEFjdGlvbkluc3RhbnRcbiAqIEBleHRlbmRzIEZpbml0ZVRpbWVBY3Rpb25cbiAqL1xuY2MuQWN0aW9uSW5zdGFudCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuQWN0aW9uSW5zdGFudCcsXG4gICAgZXh0ZW5kczogY2MuRmluaXRlVGltZUFjdGlvbixcbiAgICBpc0RvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgc3RlcDpmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgdGhpcy51cGRhdGUoMSk7XG4gICAgfSxcblxuICAgIHVwZGF0ZTpmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgLy9ub3RoaW5nXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgYSByZXZlcnNlZCBhY3Rpb24uIDxiciAvPlxuICAgICAqIEZvciBleGFtcGxlOiA8YnIgLz5cbiAgICAgKiAtIFRoZSBhY3Rpb24gaXMgeCBjb29yZGluYXRlcyBvZiAwIG1vdmUgdG8gMTAwLiA8YnIgLz5cbiAgICAgKiAtIFRoZSByZXZlcnNlZCBhY3Rpb24gd2lsbCBiZSB4IG9mIDEwMCBtb3ZlIHRvIDAuXG4gICAgICogQHJldHVybnMge0FjdGlvbn1cbiAgICAgKi9cbiAgICByZXZlcnNlOmZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCk7XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBuZXcgY2MuQWN0aW9uSW5zdGFudCgpO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIEBtb2R1bGUgY2NcbiAqL1xuXG4vKlxuICogU2hvdyB0aGUgbm9kZS5cbiAqIEBjbGFzcyBTaG93XG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnN0YW50XG4gKi9cbmNjLlNob3cgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlNob3cnLFxuICAgIGV4dGVuZHM6IGNjLkFjdGlvbkluc3RhbnQsXG5cbiAgICB1cGRhdGU6ZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIHZhciBfcmVuZGVyQ29tcHMgPSB0aGlzLnRhcmdldC5nZXRDb21wb25lbnRzSW5DaGlsZHJlbihjYy5SZW5kZXJDb21wb25lbnQpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9yZW5kZXJDb21wcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgdmFyIHJlbmRlciA9IF9yZW5kZXJDb21wc1tpXTtcbiAgICAgICAgICAgIHJlbmRlci5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZXZlcnNlOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjYy5IaWRlKCk7XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBuZXcgY2MuU2hvdygpO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqICEjZW4gU2hvdyB0aGUgTm9kZS5cbiAqICEjemgg56uL5Y2z5pi+56S644CCXG4gKiBAbWV0aG9kIHNob3dcbiAqIEByZXR1cm4ge0FjdGlvbkluc3RhbnR9XG4gKiBAZXhhbXBsZVxuICogLy8gZXhhbXBsZVxuICogdmFyIHNob3dBY3Rpb24gPSBjYy5zaG93KCk7XG4gKi9cbmNjLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBjYy5TaG93KCk7XG59O1xuXG4vKlxuICogSGlkZSB0aGUgbm9kZS5cbiAqIEBjbGFzcyBIaWRlXG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnN0YW50XG4gKi9cbmNjLkhpZGUgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkhpZGUnLFxuICAgIGV4dGVuZHM6IGNjLkFjdGlvbkluc3RhbnQsXG5cbiAgICB1cGRhdGU6ZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIHZhciBfcmVuZGVyQ29tcHMgPSB0aGlzLnRhcmdldC5nZXRDb21wb25lbnRzSW5DaGlsZHJlbihjYy5SZW5kZXJDb21wb25lbnQpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9yZW5kZXJDb21wcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgdmFyIHJlbmRlciA9IF9yZW5kZXJDb21wc1tpXTtcbiAgICAgICAgICAgIHJlbmRlci5lbmFibGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmV2ZXJzZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2MuU2hvdygpO1xuICAgIH0sXG5cbiAgICBjbG9uZTpmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gbmV3IGNjLkhpZGUoKTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuIEhpZGUgdGhlIG5vZGUuXG4gKiAhI3poIOeri+WNs+makOiXj+OAglxuICogQG1ldGhvZCBoaWRlXG4gKiBAcmV0dXJuIHtBY3Rpb25JbnN0YW50fVxuICogQGV4YW1wbGVcbiAqIC8vIGV4YW1wbGVcbiAqIHZhciBoaWRlQWN0aW9uID0gY2MuaGlkZSgpO1xuICovXG5jYy5oaWRlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgY2MuSGlkZSgpO1xufTtcblxuLypcbiAqIFRvZ2dsZXMgdGhlIHZpc2liaWxpdHkgb2YgYSBub2RlLlxuICogQGNsYXNzIFRvZ2dsZVZpc2liaWxpdHlcbiAqIEBleHRlbmRzIEFjdGlvbkluc3RhbnRcbiAqL1xuY2MuVG9nZ2xlVmlzaWJpbGl0eSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuVG9nZ2xlVmlzaWJpbGl0eScsXG4gICAgZXh0ZW5kczogY2MuQWN0aW9uSW5zdGFudCxcblxuICAgIHVwZGF0ZTpmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgdmFyIF9yZW5kZXJDb21wcyA9IHRoaXMudGFyZ2V0LmdldENvbXBvbmVudHNJbkNoaWxkcmVuKGNjLlJlbmRlckNvbXBvbmVudCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX3JlbmRlckNvbXBzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICB2YXIgcmVuZGVyID0gX3JlbmRlckNvbXBzW2ldO1xuICAgICAgICAgICAgcmVuZGVyLmVuYWJsZWQgPSAhcmVuZGVyLmVuYWJsZWQ7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmV2ZXJzZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2MuVG9nZ2xlVmlzaWJpbGl0eSgpO1xuICAgIH0sXG5cbiAgICBjbG9uZTpmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gbmV3IGNjLlRvZ2dsZVZpc2liaWxpdHkoKTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuIFRvZ2dsZXMgdGhlIHZpc2liaWxpdHkgb2YgYSBub2RlLlxuICogISN6aCDmmL7pmpDnirbmgIHliIfmjaLjgIJcbiAqIEBtZXRob2QgdG9nZ2xlVmlzaWJpbGl0eVxuICogQHJldHVybiB7QWN0aW9uSW5zdGFudH1cbiAqIEBleGFtcGxlXG4gKiAvLyBleGFtcGxlXG4gKiB2YXIgdG9nZ2xlVmlzaWJpbGl0eUFjdGlvbiA9IGNjLnRvZ2dsZVZpc2liaWxpdHkoKTtcbiAqL1xuY2MudG9nZ2xlVmlzaWJpbGl0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IGNjLlRvZ2dsZVZpc2liaWxpdHkoKTtcbn07XG5cbi8qXG4gKiBEZWxldGUgc2VsZiBpbiB0aGUgbmV4dCBmcmFtZS5cbiAqIEBjbGFzcyBSZW1vdmVTZWxmXG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnN0YW50XG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtpc05lZWRDbGVhblVwPXRydWVdXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIGV4YW1wbGVcbiAqIHZhciByZW1vdmVTZWxmQWN0aW9uID0gbmV3IGNjLlJlbW92ZVNlbGYoZmFsc2UpO1xuICovXG5jYy5SZW1vdmVTZWxmID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5SZW1vdmVTZWxmJyxcbiAgICBleHRlbmRzOiBjYy5BY3Rpb25JbnN0YW50LFxuXG4gICAgY3RvcjpmdW5jdGlvbihpc05lZWRDbGVhblVwKXtcbiAgICAgICAgdGhpcy5faXNOZWVkQ2xlYW5VcCA9IHRydWU7XG5cdCAgICBpc05lZWRDbGVhblVwICE9PSB1bmRlZmluZWQgJiYgdGhpcy5pbml0KGlzTmVlZENsZWFuVXApO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6ZnVuY3Rpb24oZHQpe1xuICAgICAgICB0aGlzLnRhcmdldC5yZW1vdmVGcm9tUGFyZW50KHRoaXMuX2lzTmVlZENsZWFuVXApO1xuICAgIH0sXG5cbiAgICBpbml0OmZ1bmN0aW9uKGlzTmVlZENsZWFuVXApe1xuICAgICAgICB0aGlzLl9pc05lZWRDbGVhblVwID0gaXNOZWVkQ2xlYW5VcDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIHJldmVyc2U6ZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIG5ldyBjYy5SZW1vdmVTZWxmKHRoaXMuX2lzTmVlZENsZWFuVXApO1xuICAgIH0sXG5cbiAgICBjbG9uZTpmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gbmV3IGNjLlJlbW92ZVNlbGYodGhpcy5faXNOZWVkQ2xlYW5VcCk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlbiBDcmVhdGUgYSBSZW1vdmVTZWxmIG9iamVjdCB3aXRoIGEgZmxhZyBpbmRpY2F0ZSB3aGV0aGVyIHRoZSB0YXJnZXQgc2hvdWxkIGJlIGNsZWFuZWQgdXAgd2hpbGUgcmVtb3ZpbmcuXG4gKiAhI3poIOS7jueItuiKgueCueenu+mZpOiHqui6q+OAglxuICogQG1ldGhvZCByZW1vdmVTZWxmXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtpc05lZWRDbGVhblVwID0gdHJ1ZV1cbiAqIEByZXR1cm4ge0FjdGlvbkluc3RhbnR9XG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIGV4YW1wbGVcbiAqIHZhciByZW1vdmVTZWxmQWN0aW9uID0gY2MucmVtb3ZlU2VsZigpO1xuICovXG5jYy5yZW1vdmVTZWxmID0gZnVuY3Rpb24oaXNOZWVkQ2xlYW5VcCl7XG4gICAgcmV0dXJuIG5ldyBjYy5SZW1vdmVTZWxmKGlzTmVlZENsZWFuVXApO1xufTtcblxuLypcbiAqIENyZWF0ZSBhbiBhY3Rpb24gdG8gZGVzdHJveSBzZWxmLlxuICogQGNsYXNzIERlc3Ryb3lTZWxmXG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnN0YW50XG4gKlxuICogQGV4YW1wbGVcbiAqIHZhciBkZXN0cm95U2VsZkFjdGlvbiA9IG5ldyBjYy5EZXN0cm95U2VsZigpO1xuICovXG5jYy5EZXN0cm95U2VsZiA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuRGVzdHJveVNlbGYnLFxuICAgIGV4dGVuZHM6IGNjLkFjdGlvbkluc3RhbnQsXG5cbiAgICB1cGRhdGUgKCkge1xuICAgICAgICB0aGlzLnRhcmdldC5kZXN0cm95KCk7XG4gICAgfSxcblxuICAgIHJldmVyc2UgKCkge1xuICAgICAgICByZXR1cm4gbmV3IGNjLkRlc3Ryb3lTZWxmKCk7XG4gICAgfSxcblxuICAgIGNsb25lICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjYy5EZXN0cm95U2VsZigpO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqICEjZW4gRGVzdHJveSBzZWxmXG4gKiAhI3poIOWIm+W7uuS4gOS4qumUgOavgeiHqui6q+eahOWKqOS9nOOAglxuICogQG1ldGhvZCBkZXN0cm95U2VsZlxuICogQHJldHVybiB7QWN0aW9uSW5zdGFudH1cbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIGRlc3Ryb3lTZWxmQWN0aW9uID0gY2MuZGVzdHJveVNlbGYoKTtcbiAqL1xuY2MuZGVzdHJveVNlbGYgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBjYy5EZXN0cm95U2VsZigpO1xufTtcblxuLypcbiAqIEZsaXBzIHRoZSBzcHJpdGUgaG9yaXpvbnRhbGx5LlxuICogQGNsYXNzIEZsaXBYXG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnN0YW50XG4gKiBAcGFyYW0ge0Jvb2xlYW59IGZsaXAgSW5kaWNhdGUgd2hldGhlciB0aGUgdGFyZ2V0IHNob3VsZCBiZSBmbGlwcGVkIG9yIG5vdFxuICpcbiAqIEBleGFtcGxlXG4gKiB2YXIgZmxpcFhBY3Rpb24gPSBuZXcgY2MuRmxpcFgodHJ1ZSk7XG4gKi9cbmNjLkZsaXBYID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5GbGlwWCcsXG4gICAgZXh0ZW5kczogY2MuQWN0aW9uSW5zdGFudCxcblxuICAgIGN0b3I6ZnVuY3Rpb24oZmxpcCl7XG4gICAgICAgIHRoaXMuX2ZsaXBwZWRYID0gZmFsc2U7XG5cdFx0ZmxpcCAhPT0gdW5kZWZpbmVkICYmIHRoaXMuaW5pdFdpdGhGbGlwWChmbGlwKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBpbml0aWFsaXplcyB0aGUgYWN0aW9uIHdpdGggYSBzZXQgZmxpcFguXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBmbGlwXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpbml0V2l0aEZsaXBYOmZ1bmN0aW9uIChmbGlwKSB7XG4gICAgICAgIHRoaXMuX2ZsaXBwZWRYID0gZmxpcDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIHVwZGF0ZTpmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgdGhpcy50YXJnZXQuc2NhbGVYID0gTWF0aC5hYnModGhpcy50YXJnZXQuc2NhbGVYKSAqICh0aGlzLl9mbGlwcGVkWCA/IC0xIDogMSk7XG4gICAgfSxcblxuICAgIHJldmVyc2U6ZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IGNjLkZsaXBYKCF0aGlzLl9mbGlwcGVkWCk7XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuRmxpcFgoKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoRmxpcFgodGhpcy5fZmxpcHBlZFgpO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqICEjZW4gQ3JlYXRlIGEgRmxpcFggYWN0aW9uIHRvIGZsaXAgb3IgdW5mbGlwIHRoZSB0YXJnZXQuXG4gKiAhI3poIFjovbTnv7vovazjgIJcbiAqIEBtZXRob2QgZmxpcFhcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZmxpcCBJbmRpY2F0ZSB3aGV0aGVyIHRoZSB0YXJnZXQgc2hvdWxkIGJlIGZsaXBwZWQgb3Igbm90XG4gKiBAcmV0dXJuIHtBY3Rpb25JbnN0YW50fVxuICogQGV4YW1wbGVcbiAqIHZhciBmbGlwWEFjdGlvbiA9IGNjLmZsaXBYKHRydWUpO1xuICovXG5jYy5mbGlwWCA9IGZ1bmN0aW9uIChmbGlwKSB7XG4gICAgcmV0dXJuIG5ldyBjYy5GbGlwWChmbGlwKTtcbn07XG5cbi8qXG4gKiBGbGlwcyB0aGUgc3ByaXRlIHZlcnRpY2FsbHlcbiAqIEBjbGFzcyBGbGlwWVxuICogQGV4dGVuZHMgQWN0aW9uSW5zdGFudFxuICogQHBhcmFtIHtCb29sZWFufSBmbGlwXG4gKiBAZXhhbXBsZVxuICogdmFyIGZsaXBZQWN0aW9uID0gbmV3IGNjLkZsaXBZKHRydWUpO1xuICovXG5jYy5GbGlwWSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuRmxpcFknLFxuICAgIGV4dGVuZHM6IGNjLkFjdGlvbkluc3RhbnQsXG5cbiAgICBjdG9yOiBmdW5jdGlvbihmbGlwKXtcbiAgICAgICAgdGhpcy5fZmxpcHBlZFkgPSBmYWxzZTtcblx0XHRmbGlwICE9PSB1bmRlZmluZWQgJiYgdGhpcy5pbml0V2l0aEZsaXBZKGZsaXApO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIGluaXRpYWxpemVzIHRoZSBhY3Rpb24gd2l0aCBhIHNldCBmbGlwWS5cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGZsaXBcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGluaXRXaXRoRmxpcFk6ZnVuY3Rpb24gKGZsaXApIHtcbiAgICAgICAgdGhpcy5fZmxpcHBlZFkgPSBmbGlwO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOmZ1bmN0aW9uIChkdCkge1xuICAgICAgICB0aGlzLnRhcmdldC5zY2FsZVkgPSBNYXRoLmFicyh0aGlzLnRhcmdldC5zY2FsZVkpICogKHRoaXMuX2ZsaXBwZWRZID8gLTEgOiAxKTtcbiAgICB9LFxuXG4gICAgcmV2ZXJzZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2MuRmxpcFkoIXRoaXMuX2ZsaXBwZWRZKTtcbiAgICB9LFxuXG4gICAgY2xvbmU6ZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5GbGlwWSgpO1xuICAgICAgICBhY3Rpb24uaW5pdFdpdGhGbGlwWSh0aGlzLl9mbGlwcGVkWSk7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlbiBDcmVhdGUgYSBGbGlwWSBhY3Rpb24gdG8gZmxpcCBvciB1bmZsaXAgdGhlIHRhcmdldC5cbiAqICEjemggWei9tOe/u+i9rOOAglxuICogQG1ldGhvZCBmbGlwWVxuICogQHBhcmFtIHtCb29sZWFufSBmbGlwXG4gKiBAcmV0dXJuIHtBY3Rpb25JbnN0YW50fVxuICogQGV4YW1wbGVcbiAqIHZhciBmbGlwWUFjdGlvbiA9IGNjLmZsaXBZKHRydWUpO1xuICovXG5jYy5mbGlwWSA9IGZ1bmN0aW9uIChmbGlwKSB7XG4gICAgcmV0dXJuIG5ldyBjYy5GbGlwWShmbGlwKTtcbn07XG5cbi8qXG4gKiBQbGFjZXMgdGhlIG5vZGUgaW4gYSBjZXJ0YWluIHBvc2l0aW9uXG4gKiBAY2xhc3MgUGxhY2VcbiAqIEBleHRlbmRzIEFjdGlvbkluc3RhbnRcbiAqIEBwYXJhbSB7VmVjMnxOdW1iZXJ9IHBvc1xuICogQHBhcmFtIHtOdW1iZXJ9IFt5XVxuICogQGV4YW1wbGVcbiAqIHZhciBwbGFjZUFjdGlvbiA9IG5ldyBjYy5QbGFjZShjYy52MigyMDAsIDIwMCkpO1xuICogdmFyIHBsYWNlQWN0aW9uID0gbmV3IGNjLlBsYWNlKDIwMCwgMjAwKTtcbiAqL1xuY2MuUGxhY2UgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlBsYWNlJyxcbiAgICBleHRlbmRzOiBjYy5BY3Rpb25JbnN0YW50LFxuXG4gICAgY3RvcjpmdW5jdGlvbihwb3MsIHkpe1xuICAgICAgICB0aGlzLl94ID0gMDtcblx0ICAgIHRoaXMuX3kgPSAwO1xuXG5cdFx0aWYgKHBvcyAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRpZiAocG9zLnggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR5ID0gcG9zLnk7XG5cdFx0XHRcdHBvcyA9IHBvcy54O1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5pbml0V2l0aFBvc2l0aW9uKHBvcywgeSk7XG5cdFx0fVxuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEluaXRpYWxpemVzIGEgUGxhY2UgYWN0aW9uIHdpdGggYSBwb3NpdGlvblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHlcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGluaXRXaXRoUG9zaXRpb246IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHRoaXMuX3ggPSB4O1xuICAgICAgICB0aGlzLl95ID0geTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIHVwZGF0ZTpmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgdGhpcy50YXJnZXQuc2V0UG9zaXRpb24odGhpcy5feCwgdGhpcy5feSk7XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuUGxhY2UoKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoUG9zaXRpb24odGhpcy5feCwgdGhpcy5feSk7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlbiBDcmVhdGVzIGEgUGxhY2UgYWN0aW9uIHdpdGggYSBwb3NpdGlvbi5cbiAqICEjemgg5pS+572u5Zyo55uu5qCH5L2N572u44CCXG4gKiBAbWV0aG9kIHBsYWNlXG4gKiBAcGFyYW0ge1ZlYzJ8TnVtYmVyfSBwb3NcbiAqIEBwYXJhbSB7TnVtYmVyfSBbeV1cbiAqIEByZXR1cm4ge0FjdGlvbkluc3RhbnR9XG4gKiBAZXhhbXBsZVxuICogLy8gZXhhbXBsZVxuICogdmFyIHBsYWNlQWN0aW9uID0gY2MucGxhY2UoY2MudjIoMjAwLCAyMDApKTtcbiAqIHZhciBwbGFjZUFjdGlvbiA9IGNjLnBsYWNlKDIwMCwgMjAwKTtcbiAqL1xuY2MucGxhY2UgPSBmdW5jdGlvbiAocG9zLCB5KSB7XG4gICAgcmV0dXJuIG5ldyBjYy5QbGFjZShwb3MsIHkpO1xufTtcblxuXG4vKlxuICogQ2FsbHMgYSAnY2FsbGJhY2snLlxuICogQGNsYXNzIENhbGxGdW5jXG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnN0YW50XG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzZWxlY3RvclxuICogQHBhcmFtIHtvYmplY3R9IFtzZWxlY3RvclRhcmdldD1udWxsXVxuICogQHBhcmFtIHsqfSBbZGF0YT1udWxsXSBkYXRhIGZvciBmdW5jdGlvbiwgaXQgYWNjZXB0cyBhbGwgZGF0YSB0eXBlcy5cbiAqIEBleGFtcGxlXG4gKiAvLyBleGFtcGxlXG4gKiAvLyBDYWxsRnVuYyB3aXRob3V0IGRhdGFcbiAqIHZhciBmaW5pc2ggPSBuZXcgY2MuQ2FsbEZ1bmModGhpcy5yZW1vdmVTcHJpdGUsIHRoaXMpO1xuICpcbiAqIC8vIENhbGxGdW5jIHdpdGggZGF0YVxuICogdmFyIGZpbmlzaCA9IG5ldyBjYy5DYWxsRnVuYyh0aGlzLnJlbW92ZUZyb21QYXJlbnRBbmRDbGVhbnVwLCB0aGlzLCAgdHJ1ZSk7XG4gKi9cbmNjLkNhbGxGdW5jID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5DYWxsRnVuYycsXG4gICAgZXh0ZW5kczogY2MuQWN0aW9uSW5zdGFudCxcblxuICAgIC8qXG4gICAgICogQ29uc3RydWN0b3IgZnVuY3Rpb24sIG92ZXJyaWRlIGl0IHRvIGV4dGVuZCB0aGUgY29uc3RydWN0aW9uIGJlaGF2aW9yLCByZW1lbWJlciB0byBjYWxsIFwidGhpcy5fc3VwZXIoKVwiIGluIHRoZSBleHRlbmRlZCBcImN0b3JcIiBmdW5jdGlvbi4gPGJyIC8+XG5cdCAqIENyZWF0ZXMgYSBDYWxsRnVuYyBhY3Rpb24gd2l0aCB0aGUgY2FsbGJhY2suXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IHNlbGVjdG9yXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBbc2VsZWN0b3JUYXJnZXQ9bnVsbF1cblx0ICogQHBhcmFtIHsqfSBbZGF0YT1udWxsXSBkYXRhIGZvciBmdW5jdGlvbiwgaXQgYWNjZXB0cyBhbGwgZGF0YSB0eXBlcy5cblx0ICovXG4gICAgY3RvcjpmdW5jdGlvbihzZWxlY3Rvciwgc2VsZWN0b3JUYXJnZXQsIGRhdGEpe1xuICAgICAgICB0aGlzLl9zZWxlY3RvclRhcmdldCA9IG51bGw7XG4gICAgICAgIHRoaXMuX2Z1bmN0aW9uID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZGF0YSA9IG51bGw7XG4gICAgICAgIHRoaXMuaW5pdFdpdGhGdW5jdGlvbihzZWxlY3Rvciwgc2VsZWN0b3JUYXJnZXQsIGRhdGEpO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBhY3Rpb24gd2l0aCBhIGZ1bmN0aW9uIG9yIGZ1bmN0aW9uIGFuZCBpdHMgdGFyZ2V0XG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gc2VsZWN0b3JcbiAgICAgKiBAcGFyYW0ge29iamVjdHxOdWxsfSBzZWxlY3RvclRhcmdldFxuICAgICAqIEBwYXJhbSB7KnxOdWxsfSBbZGF0YV0gZGF0YSBmb3IgZnVuY3Rpb24sIGl0IGFjY2VwdHMgYWxsIGRhdGEgdHlwZXMuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpbml0V2l0aEZ1bmN0aW9uOmZ1bmN0aW9uIChzZWxlY3Rvciwgc2VsZWN0b3JUYXJnZXQsIGRhdGEpIHtcbiAgICAgICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICAgICAgICB0aGlzLl9mdW5jdGlvbiA9IHNlbGVjdG9yO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxlY3RvclRhcmdldCkge1xuICAgICAgICAgICAgdGhpcy5fc2VsZWN0b3JUYXJnZXQgPSBzZWxlY3RvclRhcmdldDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBleGVjdXRlIHRoZSBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBleGVjdXRlOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2Z1bmN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9mdW5jdGlvbi5jYWxsKHRoaXMuX3NlbGVjdG9yVGFyZ2V0LCB0aGlzLnRhcmdldCwgdGhpcy5fZGF0YSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlOmZ1bmN0aW9uIChkdCkge1xuICAgICAgICB0aGlzLmV4ZWN1dGUoKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBHZXQgc2VsZWN0b3JUYXJnZXQuXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxuICAgICAqL1xuICAgIGdldFRhcmdldENhbGxiYWNrOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdG9yVGFyZ2V0O1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIFNldCBzZWxlY3RvclRhcmdldC5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gc2VsXG4gICAgICovXG4gICAgc2V0VGFyZ2V0Q2FsbGJhY2s6ZnVuY3Rpb24gKHNlbCkge1xuICAgICAgICBpZiAoc2VsICE9PSB0aGlzLl9zZWxlY3RvclRhcmdldCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3NlbGVjdG9yVGFyZ2V0KVxuICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdG9yVGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdG9yVGFyZ2V0ID0gc2VsO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuQ2FsbEZ1bmMoKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoRnVuY3Rpb24odGhpcy5fZnVuY3Rpb24sIHRoaXMuX3NlbGVjdG9yVGFyZ2V0LCB0aGlzLl9kYXRhKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuIENyZWF0ZXMgdGhlIGFjdGlvbiB3aXRoIHRoZSBjYWxsYmFjay5cbiAqICEjemgg5omn6KGM5Zue6LCD5Ye95pWw44CCXG4gKiBAbWV0aG9kIGNhbGxGdW5jXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzZWxlY3RvclxuICogQHBhcmFtIHtvYmplY3R9IFtzZWxlY3RvclRhcmdldD1udWxsXVxuICogQHBhcmFtIHsqfSBbZGF0YT1udWxsXSAtIGRhdGEgZm9yIGZ1bmN0aW9uLCBpdCBhY2NlcHRzIGFsbCBkYXRhIHR5cGVzLlxuICogQHJldHVybiB7QWN0aW9uSW5zdGFudH1cbiAqIEBleGFtcGxlXG4gKiAvLyBleGFtcGxlXG4gKiAvLyBDYWxsRnVuYyB3aXRob3V0IGRhdGFcbiAqIHZhciBmaW5pc2ggPSBjYy5jYWxsRnVuYyh0aGlzLnJlbW92ZVNwcml0ZSwgdGhpcyk7XG4gKlxuICogLy8gQ2FsbEZ1bmMgd2l0aCBkYXRhXG4gKiB2YXIgZmluaXNoID0gY2MuY2FsbEZ1bmModGhpcy5yZW1vdmVGcm9tUGFyZW50QW5kQ2xlYW51cCwgdGhpcy5fZ3Jvc3NpbmksICB0cnVlKTtcbiAqL1xuY2MuY2FsbEZ1bmMgPSBmdW5jdGlvbiAoc2VsZWN0b3IsIHNlbGVjdG9yVGFyZ2V0LCBkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBjYy5DYWxsRnVuYyhzZWxlY3Rvciwgc2VsZWN0b3JUYXJnZXQsIGRhdGEpO1xufTtcbiJdLCJzb3VyY2VSb290IjoiLyJ9