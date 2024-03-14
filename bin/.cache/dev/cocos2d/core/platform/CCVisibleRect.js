
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCVisibleRect.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
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
 * cc.visibleRect is a singleton object which defines the actual visible rect of the current view,
 * it should represent the same rect as cc.view.getViewportRect()
 *
 * @class visibleRect
 */
cc.visibleRect = {
  topLeft: cc.v2(0, 0),
  topRight: cc.v2(0, 0),
  top: cc.v2(0, 0),
  bottomLeft: cc.v2(0, 0),
  bottomRight: cc.v2(0, 0),
  bottom: cc.v2(0, 0),
  center: cc.v2(0, 0),
  left: cc.v2(0, 0),
  right: cc.v2(0, 0),
  width: 0,
  height: 0,

  /**
   * initialize
   * @static
   * @method init
   * @param {Rect} visibleRect
   */
  init: function init(visibleRect) {
    var w = this.width = visibleRect.width;
    var h = this.height = visibleRect.height;
    var l = visibleRect.x,
        b = visibleRect.y,
        t = b + h,
        r = l + w; //top

    this.topLeft.x = l;
    this.topLeft.y = t;
    this.topRight.x = r;
    this.topRight.y = t;
    this.top.x = l + w / 2;
    this.top.y = t; //bottom

    this.bottomLeft.x = l;
    this.bottomLeft.y = b;
    this.bottomRight.x = r;
    this.bottomRight.y = b;
    this.bottom.x = l + w / 2;
    this.bottom.y = b; //center

    this.center.x = l + w / 2;
    this.center.y = b + h / 2; //left

    this.left.x = l;
    this.left.y = b + h / 2; //right

    this.right.x = r;
    this.right.y = b + h / 2;
  }
};
/**
 * Top left coordinate of the screen related to the game scene.
 * @static
 * @property {Vec2} topLeft
 */

/**
 * Top right coordinate of the screen related to the game scene.
 * @static
 * @property {Vec2} topRight
 */

/**
 * Top center coordinate of the screen related to the game scene.
 * @static
 * @property {Vec2} top
 */

/**
 * Bottom left coordinate of the screen related to the game scene.
 * @static
 * @property {Vec2} bottomLeft
 */

/**
 * Bottom right coordinate of the screen related to the game scene.
 * @static
 * @property {Vec2} bottomRight
 */

/**
 * Bottom center coordinate of the screen related to the game scene.
 * @static
 * @property {Vec2} bottom
 */

/**
 * Center coordinate of the screen related to the game scene.
 * @static
 * @property {Vec2} center
 */

/**
 * Left center coordinate of the screen related to the game scene.
 * @static
 * @property {Vec2} left
 */

/**
 * Right center coordinate of the screen related to the game scene.
 * @static
 * @property {Vec2} right
 */

/**
 * Width of the screen.
 * @static
 * @property {Number} width
 */

/**
 * Height of the screen.
 * @static
 * @property {Number} height
 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BsYXRmb3JtL0NDVmlzaWJsZVJlY3QuanMiXSwibmFtZXMiOlsiY2MiLCJ2aXNpYmxlUmVjdCIsInRvcExlZnQiLCJ2MiIsInRvcFJpZ2h0IiwidG9wIiwiYm90dG9tTGVmdCIsImJvdHRvbVJpZ2h0IiwiYm90dG9tIiwiY2VudGVyIiwibGVmdCIsInJpZ2h0Iiwid2lkdGgiLCJoZWlnaHQiLCJpbml0IiwidyIsImgiLCJsIiwieCIsImIiLCJ5IiwidCIsInIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBQSxFQUFFLENBQUNDLFdBQUgsR0FBaUI7QUFDYkMsRUFBQUEsT0FBTyxFQUFDRixFQUFFLENBQUNHLEVBQUgsQ0FBTSxDQUFOLEVBQVEsQ0FBUixDQURLO0FBRWJDLEVBQUFBLFFBQVEsRUFBQ0osRUFBRSxDQUFDRyxFQUFILENBQU0sQ0FBTixFQUFRLENBQVIsQ0FGSTtBQUdiRSxFQUFBQSxHQUFHLEVBQUNMLEVBQUUsQ0FBQ0csRUFBSCxDQUFNLENBQU4sRUFBUSxDQUFSLENBSFM7QUFJYkcsRUFBQUEsVUFBVSxFQUFDTixFQUFFLENBQUNHLEVBQUgsQ0FBTSxDQUFOLEVBQVEsQ0FBUixDQUpFO0FBS2JJLEVBQUFBLFdBQVcsRUFBQ1AsRUFBRSxDQUFDRyxFQUFILENBQU0sQ0FBTixFQUFRLENBQVIsQ0FMQztBQU1iSyxFQUFBQSxNQUFNLEVBQUNSLEVBQUUsQ0FBQ0csRUFBSCxDQUFNLENBQU4sRUFBUSxDQUFSLENBTk07QUFPYk0sRUFBQUEsTUFBTSxFQUFDVCxFQUFFLENBQUNHLEVBQUgsQ0FBTSxDQUFO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KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDExLTIwMTIgY29jb3MyZC14Lm9yZ1xuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZ1xuXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKipcbiAqIGNjLnZpc2libGVSZWN0IGlzIGEgc2luZ2xldG9uIG9iamVjdCB3aGljaCBkZWZpbmVzIHRoZSBhY3R1YWwgdmlzaWJsZSByZWN0IG9mIHRoZSBjdXJyZW50IHZpZXcsXG4gKiBpdCBzaG91bGQgcmVwcmVzZW50IHRoZSBzYW1lIHJlY3QgYXMgY2Mudmlldy5nZXRWaWV3cG9ydFJlY3QoKVxuICpcbiAqIEBjbGFzcyB2aXNpYmxlUmVjdFxuICovXG5jYy52aXNpYmxlUmVjdCA9IHtcbiAgICB0b3BMZWZ0OmNjLnYyKDAsMCksXG4gICAgdG9wUmlnaHQ6Y2MudjIoMCwwKSxcbiAgICB0b3A6Y2MudjIoMCwwKSxcbiAgICBib3R0b21MZWZ0OmNjLnYyKDAsMCksXG4gICAgYm90dG9tUmlnaHQ6Y2MudjIoMCwwKSxcbiAgICBib3R0b206Y2MudjIoMCwwKSxcbiAgICBjZW50ZXI6Y2MudjIoMCwwKSxcbiAgICBsZWZ0OmNjLnYyKDAsMCksXG4gICAgcmlnaHQ6Y2MudjIoMCwwKSxcbiAgICB3aWR0aDowLFxuICAgIGhlaWdodDowLFxuXG4gICAgLyoqXG4gICAgICogaW5pdGlhbGl6ZVxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWV0aG9kIGluaXRcbiAgICAgKiBAcGFyYW0ge1JlY3R9IHZpc2libGVSZWN0XG4gICAgICovXG4gICAgaW5pdDpmdW5jdGlvbih2aXNpYmxlUmVjdCl7XG5cbiAgICAgICAgdmFyIHcgPSB0aGlzLndpZHRoID0gdmlzaWJsZVJlY3Qud2lkdGg7XG4gICAgICAgIHZhciBoID0gdGhpcy5oZWlnaHQgPSB2aXNpYmxlUmVjdC5oZWlnaHQ7XG4gICAgICAgIHZhciBsID0gdmlzaWJsZVJlY3QueCxcbiAgICAgICAgICAgIGIgPSB2aXNpYmxlUmVjdC55LFxuICAgICAgICAgICAgdCA9IGIgKyBoLFxuICAgICAgICAgICAgciA9IGwgKyB3O1xuXG4gICAgICAgIC8vdG9wXG4gICAgICAgIHRoaXMudG9wTGVmdC54ID0gbDtcbiAgICAgICAgdGhpcy50b3BMZWZ0LnkgPSB0O1xuICAgICAgICB0aGlzLnRvcFJpZ2h0LnggPSByO1xuICAgICAgICB0aGlzLnRvcFJpZ2h0LnkgPSB0O1xuICAgICAgICB0aGlzLnRvcC54ID0gbCArIHcvMjtcbiAgICAgICAgdGhpcy50b3AueSA9IHQ7XG5cbiAgICAgICAgLy9ib3R0b21cbiAgICAgICAgdGhpcy5ib3R0b21MZWZ0LnggPSBsO1xuICAgICAgICB0aGlzLmJvdHRvbUxlZnQueSA9IGI7XG4gICAgICAgIHRoaXMuYm90dG9tUmlnaHQueCA9IHI7XG4gICAgICAgIHRoaXMuYm90dG9tUmlnaHQueSA9IGI7XG4gICAgICAgIHRoaXMuYm90dG9tLnggPSBsICsgdy8yO1xuICAgICAgICB0aGlzLmJvdHRvbS55ID0gYjtcblxuICAgICAgICAvL2NlbnRlclxuICAgICAgICB0aGlzLmNlbnRlci54ID0gbCArIHcvMjtcbiAgICAgICAgdGhpcy5jZW50ZXIueSA9IGIgKyBoLzI7XG5cbiAgICAgICAgLy9sZWZ0XG4gICAgICAgIHRoaXMubGVmdC54ID0gbDtcbiAgICAgICAgdGhpcy5sZWZ0LnkgPSBiICsgaC8yO1xuXG4gICAgICAgIC8vcmlnaHRcbiAgICAgICAgdGhpcy5yaWdodC54ID0gcjtcbiAgICAgICAgdGhpcy5yaWdodC55ID0gYiArIGgvMjtcbiAgICB9XG59O1xuXG4vKipcbiAqIFRvcCBsZWZ0IGNvb3JkaW5hdGUgb2YgdGhlIHNjcmVlbiByZWxhdGVkIHRvIHRoZSBnYW1lIHNjZW5lLlxuICogQHN0YXRpY1xuICogQHByb3BlcnR5IHtWZWMyfSB0b3BMZWZ0XG4gKi9cblxuLyoqXG4gKiBUb3AgcmlnaHQgY29vcmRpbmF0ZSBvZiB0aGUgc2NyZWVuIHJlbGF0ZWQgdG8gdGhlIGdhbWUgc2NlbmUuXG4gKiBAc3RhdGljXG4gKiBAcHJvcGVydHkge1ZlYzJ9IHRvcFJpZ2h0XG4gKi9cblxuLyoqXG4gKiBUb3AgY2VudGVyIGNvb3JkaW5hdGUgb2YgdGhlIHNjcmVlbiByZWxhdGVkIHRvIHRoZSBnYW1lIHNjZW5lLlxuICogQHN0YXRpY1xuICogQHByb3BlcnR5IHtWZWMyfSB0b3BcbiAqL1xuXG4vKipcbiAqIEJvdHRvbSBsZWZ0IGNvb3JkaW5hdGUgb2YgdGhlIHNjcmVlbiByZWxhdGVkIHRvIHRoZSBnYW1lIHNjZW5lLlxuICogQHN0YXRpY1xuICogQHByb3BlcnR5IHtWZWMyfSBib3R0b21MZWZ0XG4gKi9cblxuLyoqXG4gKiBCb3R0b20gcmlnaHQgY29vcmRpbmF0ZSBvZiB0aGUgc2NyZWVuIHJlbGF0ZWQgdG8gdGhlIGdhbWUgc2NlbmUuXG4gKiBAc3RhdGljXG4gKiBAcHJvcGVydHkge1ZlYzJ9IGJvdHRvbVJpZ2h0XG4gKi9cblxuLyoqXG4gKiBCb3R0b20gY2VudGVyIGNvb3JkaW5hdGUgb2YgdGhlIHNjcmVlbiByZWxhdGVkIHRvIHRoZSBnYW1lIHNjZW5lLlxuICogQHN0YXRpY1xuICogQHByb3BlcnR5IHtWZWMyfSBib3R0b21cbiAqL1xuXG4vKipcbiAqIENlbnRlciBjb29yZGluYXRlIG9mIHRoZSBzY3JlZW4gcmVsYXRlZCB0byB0aGUgZ2FtZSBzY2VuZS5cbiAqIEBzdGF0aWNcbiAqIEBwcm9wZXJ0eSB7VmVjMn0gY2VudGVyXG4gKi9cblxuLyoqXG4gKiBMZWZ0IGNlbnRlciBjb29yZGluYXRlIG9mIHRoZSBzY3JlZW4gcmVsYXRlZCB0byB0aGUgZ2FtZSBzY2VuZS5cbiAqIEBzdGF0aWNcbiAqIEBwcm9wZXJ0eSB7VmVjMn0gbGVmdFxuICovXG5cbi8qKlxuICogUmlnaHQgY2VudGVyIGNvb3JkaW5hdGUgb2YgdGhlIHNjcmVlbiByZWxhdGVkIHRvIHRoZSBnYW1lIHNjZW5lLlxuICogQHN0YXRpY1xuICogQHByb3BlcnR5IHtWZWMyfSByaWdodFxuICovXG5cbi8qKlxuICogV2lkdGggb2YgdGhlIHNjcmVlbi5cbiAqIEBzdGF0aWNcbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB3aWR0aFxuICovXG5cbi8qKlxuICogSGVpZ2h0IG9mIHRoZSBzY3JlZW4uXG4gKiBAc3RhdGljXG4gKiBAcHJvcGVydHkge051bWJlcn0gaGVpZ2h0XG4gKi9cblxuIl0sInNvdXJjZVJvb3QiOiIvIn0=