
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCScrollView.js';
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
var NodeEvent = require('../CCNode').EventType;

var NUMBER_OF_GATHERED_TOUCHES_FOR_MOVE_SPEED = 5;
var OUT_OF_BOUNDARY_BREAKING_FACTOR = 0.05;
var EPSILON = 1e-4;
var MOVEMENT_FACTOR = 0.7;

var _tempPoint = cc.v2();

var _tempPrevPoint = cc.v2();

var quintEaseOut = function quintEaseOut(time) {
  time -= 1;
  return time * time * time * time * time + 1;
};

var getTimeInMilliseconds = function getTimeInMilliseconds() {
  var currentTime = new Date();
  return currentTime.getMilliseconds();
};
/**
 * !#en Enum for ScrollView event type.
 * !#zh 滚动视图事件类型
 * @enum ScrollView.EventType
 */


var EventType = cc.Enum({
  /**
   * !#en The event emmitted when ScrollView scroll to the top boundary of inner container
   * !#zh 滚动视图滚动到顶部边界事件
   * @property {Number} SCROLL_TO_TOP
   */
  SCROLL_TO_TOP: 0,

  /**
   * !#en The event emmitted when ScrollView scroll to the bottom boundary of inner container
   * !#zh 滚动视图滚动到底部边界事件
   * @property {Number} SCROLL_TO_BOTTOM
   */
  SCROLL_TO_BOTTOM: 1,

  /**
   * !#en The event emmitted when ScrollView scroll to the left boundary of inner container
   * !#zh 滚动视图滚动到左边界事件
   * @property {Number} SCROLL_TO_LEFT
   */
  SCROLL_TO_LEFT: 2,

  /**
   * !#en The event emmitted when ScrollView scroll to the right boundary of inner container
   * !#zh 滚动视图滚动到右边界事件
   * @property {Number} SCROLL_TO_RIGHT
   */
  SCROLL_TO_RIGHT: 3,

  /**
   * !#en The event emmitted when ScrollView is scrolling
   * !#zh 滚动视图正在滚动时发出的事件
   * @property {Number} SCROLLING
   */
  SCROLLING: 4,

  /**
   * !#en The event emmitted when ScrollView scroll to the top boundary of inner container and start bounce
   * !#zh 滚动视图滚动到顶部边界并且开始回弹时发出的事件
   * @property {Number} BOUNCE_TOP
   */
  BOUNCE_TOP: 5,

  /**
   * !#en The event emmitted when ScrollView scroll to the bottom boundary of inner container and start bounce
   * !#zh 滚动视图滚动到底部边界并且开始回弹时发出的事件
   * @property {Number} BOUNCE_BOTTOM
   */
  BOUNCE_BOTTOM: 6,

  /**
   * !#en The event emmitted when ScrollView scroll to the left boundary of inner container and start bounce
   * !#zh 滚动视图滚动到左边界并且开始回弹时发出的事件
   * @property {Number} BOUNCE_LEFT
   */
  BOUNCE_LEFT: 7,

  /**
   * !#en The event emmitted when ScrollView scroll to the right boundary of inner container and start bounce
   * !#zh 滚动视图滚动到右边界并且开始回弹时发出的事件
   * @property {Number} BOUNCE_RIGHT
   */
  BOUNCE_RIGHT: 8,

  /**
   * !#en The event emmitted when ScrollView auto scroll ended
   * !#zh 滚动视图滚动结束的时候发出的事件
   * @property {Number} SCROLL_ENDED
   */
  SCROLL_ENDED: 9,

  /**
   * !#en The event emmitted when user release the touch
   * !#zh 当用户松手的时候会发出一个事件
   * @property {Number} TOUCH_UP
   */
  TOUCH_UP: 10,

  /**
   * !#en The event emmitted when ScrollView auto scroll ended with a threshold
   * !#zh 滚动视图自动滚动快要结束的时候发出的事件
   * @property {Number} AUTOSCROLL_ENDED_WITH_THRESHOLD
   */
  AUTOSCROLL_ENDED_WITH_THRESHOLD: 11,

  /**
   * !#en The event emmitted when ScrollView scroll began
   * !#zh 滚动视图滚动开始时发出的事件
   * @property {Number} SCROLL_BEGAN
   */
  SCROLL_BEGAN: 12
});
var eventMap = {
  'scroll-to-top': EventType.SCROLL_TO_TOP,
  'scroll-to-bottom': EventType.SCROLL_TO_BOTTOM,
  'scroll-to-left': EventType.SCROLL_TO_LEFT,
  'scroll-to-right': EventType.SCROLL_TO_RIGHT,
  'scrolling': EventType.SCROLLING,
  'bounce-bottom': EventType.BOUNCE_BOTTOM,
  'bounce-left': EventType.BOUNCE_LEFT,
  'bounce-right': EventType.BOUNCE_RIGHT,
  'bounce-top': EventType.BOUNCE_TOP,
  'scroll-ended': EventType.SCROLL_ENDED,
  'touch-up': EventType.TOUCH_UP,
  'scroll-ended-with-threshold': EventType.AUTOSCROLL_ENDED_WITH_THRESHOLD,
  'scroll-began': EventType.SCROLL_BEGAN
};
/**
 * !#en
 * Layout container for a view hierarchy that can be scrolled by the user,
 * allowing it to be larger than the physical display.
 *
 * !#zh
 * 滚动视图组件
 * @class ScrollView
 * @extends Component
 */

var ScrollView = cc.Class({
  name: 'cc.ScrollView',
  "extends": require('./CCViewGroup'),
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.ui/ScrollView',
    help: 'i18n:COMPONENT.help_url.scrollview',
    inspector: 'packages://inspector/inspectors/comps/scrollview.js',
    executeInEditMode: false
  },
  ctor: function ctor() {
    this._topBoundary = 0;
    this._bottomBoundary = 0;
    this._leftBoundary = 0;
    this._rightBoundary = 0;
    this._touchMoveDisplacements = [];
    this._touchMoveTimeDeltas = [];
    this._touchMovePreviousTimestamp = 0;
    this._touchMoved = false;
    this._autoScrolling = false;
    this._autoScrollAttenuate = false;
    this._autoScrollStartPosition = cc.v2(0, 0);
    this._autoScrollTargetDelta = cc.v2(0, 0);
    this._autoScrollTotalTime = 0;
    this._autoScrollAccumulatedTime = 0;
    this._autoScrollCurrentlyOutOfBoundary = false;
    this._autoScrollBraking = false;
    this._autoScrollBrakingStartPosition = cc.v2(0, 0);
    this._outOfBoundaryAmount = cc.v2(0, 0);
    this._outOfBoundaryAmountDirty = true;
    this._stopMouseWheel = false;
    this._mouseWheelEventElapsedTime = 0.0;
    this._isScrollEndedWithThresholdEventFired = false; //use bit wise operations to indicate the direction

    this._scrollEventEmitMask = 0;
    this._isBouncing = false;
    this._scrolling = false;
  },
  properties: {
    /**
     * !#en This is a reference to the UI element to be scrolled.
     * !#zh 可滚动展示内容的节点。
     * @property {Node} content
     */
    content: {
      "default": undefined,
      type: cc.Node,
      tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.content',
      formerlySerializedAs: 'content',
      notify: function notify(oldValue) {
        this._calculateBoundary();
      }
    },

    /**
     * !#en Enable horizontal scroll.
     * !#zh 是否开启水平滚动。
     * @property {Boolean} horizontal
     */
    horizontal: {
      "default": true,
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.horizontal'
    },

    /**
     * !#en Enable vertical scroll.
     * !#zh 是否开启垂直滚动。
     * @property {Boolean} vertical
     */
    vertical: {
      "default": true,
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.vertical'
    },

    /**
     * !#en When inertia is set, the content will continue to move when touch ended.
     * !#zh 是否开启滚动惯性。
     * @property {Boolean} inertia
     */
    inertia: {
      "default": true,
      tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.inertia'
    },

    /**
     * !#en
     * It determines how quickly the content stop moving. A value of 1 will stop the movement immediately.
     * A value of 0 will never stop the movement until it reaches to the boundary of scrollview.
     * !#zh
     * 开启惯性后，在用户停止触摸后滚动多快停止，0表示永不停止，1表示立刻停止。
     * @property {Number} brake
     */
    brake: {
      "default": 0.5,
      type: cc.Float,
      range: [0, 1, 0.1],
      tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.brake'
    },

    /**
     * !#en When elastic is set, the content will be bounce back when move out of boundary.
     * !#zh 是否允许滚动内容超过边界，并在停止触摸后回弹。
     * @property {Boolean} elastic
     */
    elastic: {
      "default": true,
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.elastic'
    },

    /**
     * !#en The elapse time of bouncing back. A value of 0 will bounce back immediately.
     * !#zh 回弹持续的时间，0 表示将立即反弹。
     * @property {Number} bounceDuration
     */
    bounceDuration: {
      "default": 1,
      range: [0, 10],
      tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.bounceDuration'
    },

    /**
     * !#en The horizontal scrollbar reference.
     * !#zh 水平滚动的 ScrollBar。
     * @property {Scrollbar} horizontalScrollBar
     */
    horizontalScrollBar: {
      "default": undefined,
      type: cc.Scrollbar,
      tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.horizontal_bar',
      notify: function notify() {
        if (this.horizontalScrollBar) {
          this.horizontalScrollBar.setTargetScrollView(this);

          this._updateScrollBar(0);
        }
      },
      animatable: false
    },

    /**
     * !#en The vertical scrollbar reference.
     * !#zh 垂直滚动的 ScrollBar。
     * @property {Scrollbar} verticalScrollBar
     */
    verticalScrollBar: {
      "default": undefined,
      type: cc.Scrollbar,
      tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.vertical_bar',
      notify: function notify() {
        if (this.verticalScrollBar) {
          this.verticalScrollBar.setTargetScrollView(this);

          this._updateScrollBar(0);
        }
      },
      animatable: false
    },

    /**
     * !#en Scrollview events callback
     * !#zh 滚动视图的事件回调函数
     * @property {Component.EventHandler[]} scrollEvents
     */
    scrollEvents: {
      "default": [],
      type: cc.Component.EventHandler,
      tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.scrollEvents'
    },

    /**
     * !#en If cancelInnerEvents is set to true, the scroll behavior will cancel touch events on inner content nodes
     * It's set to true by default.
     * !#zh 如果这个属性被设置为 true，那么滚动行为会取消子节点上注册的触摸事件，默认被设置为 true。
     * 注意，子节点上的 touchstart 事件仍然会触发，触点移动距离非常短的情况下 touchmove 和 touchend 也不会受影响。
     * @property {Boolean} cancelInnerEvents
     */
    cancelInnerEvents: {
      "default": true,
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.cancelInnerEvents'
    },
    // private object
    _view: {
      get: function get() {
        if (this.content) {
          return this.content.parent;
        }
      }
    }
  },
  statics: {
    EventType: EventType
  },

  /**
   * !#en Scroll the content to the bottom boundary of ScrollView.
   * !#zh 视图内容将在规定时间内滚动到视图底部。
   * @method scrollToBottom
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the bottom boundary immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * @example
   * // Scroll to the bottom of the view.
   * scrollView.scrollToBottom(0.1);
   */
  scrollToBottom: function scrollToBottom(timeInSecond, attenuated) {
    var moveDelta = this._calculateMovePercentDelta({
      anchor: cc.v2(0, 0),
      applyToHorizontal: false,
      applyToVertical: true
    });

    if (timeInSecond) {
      this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
    } else {
      this._moveContent(moveDelta, true);
    }
  },

  /**
   * !#en Scroll the content to the top boundary of ScrollView.
   * !#zh 视图内容将在规定时间内滚动到视图顶部。
   * @method scrollToTop
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the top boundary immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * @example
   * // Scroll to the top of the view.
   * scrollView.scrollToTop(0.1);
   */
  scrollToTop: function scrollToTop(timeInSecond, attenuated) {
    var moveDelta = this._calculateMovePercentDelta({
      anchor: cc.v2(0, 1),
      applyToHorizontal: false,
      applyToVertical: true
    });

    if (timeInSecond) {
      this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
    } else {
      this._moveContent(moveDelta);
    }
  },

  /**
   * !#en Scroll the content to the left boundary of ScrollView.
   * !#zh 视图内容将在规定时间内滚动到视图左边。
   * @method scrollToLeft
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the left boundary immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * @example
   * // Scroll to the left of the view.
   * scrollView.scrollToLeft(0.1);
   */
  scrollToLeft: function scrollToLeft(timeInSecond, attenuated) {
    var moveDelta = this._calculateMovePercentDelta({
      anchor: cc.v2(0, 0),
      applyToHorizontal: true,
      applyToVertical: false
    });

    if (timeInSecond) {
      this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
    } else {
      this._moveContent(moveDelta);
    }
  },

  /**
   * !#en Scroll the content to the right boundary of ScrollView.
   * !#zh 视图内容将在规定时间内滚动到视图右边。
   * @method scrollToRight
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the right boundary immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * @example
   * // Scroll to the right of the view.
   * scrollView.scrollToRight(0.1);
   */
  scrollToRight: function scrollToRight(timeInSecond, attenuated) {
    var moveDelta = this._calculateMovePercentDelta({
      anchor: cc.v2(1, 0),
      applyToHorizontal: true,
      applyToVertical: false
    });

    if (timeInSecond) {
      this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
    } else {
      this._moveContent(moveDelta);
    }
  },

  /**
   * !#en Scroll the content to the top left boundary of ScrollView.
   * !#zh 视图内容将在规定时间内滚动到视图左上角。
   * @method scrollToTopLeft
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the top left boundary immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * @example
   * // Scroll to the upper left corner of the view.
   * scrollView.scrollToTopLeft(0.1);
   */
  scrollToTopLeft: function scrollToTopLeft(timeInSecond, attenuated) {
    var moveDelta = this._calculateMovePercentDelta({
      anchor: cc.v2(0, 1),
      applyToHorizontal: true,
      applyToVertical: true
    });

    if (timeInSecond) {
      this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
    } else {
      this._moveContent(moveDelta);
    }
  },

  /**
   * !#en Scroll the content to the top right boundary of ScrollView.
   * !#zh 视图内容将在规定时间内滚动到视图右上角。
   * @method scrollToTopRight
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the top right boundary immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * @example
   * // Scroll to the top right corner of the view.
   * scrollView.scrollToTopRight(0.1);
   */
  scrollToTopRight: function scrollToTopRight(timeInSecond, attenuated) {
    var moveDelta = this._calculateMovePercentDelta({
      anchor: cc.v2(1, 1),
      applyToHorizontal: true,
      applyToVertical: true
    });

    if (timeInSecond) {
      this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
    } else {
      this._moveContent(moveDelta);
    }
  },

  /**
   * !#en Scroll the content to the bottom left boundary of ScrollView.
   * !#zh 视图内容将在规定时间内滚动到视图左下角。
   * @method scrollToBottomLeft
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the bottom left boundary immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * @example
   * // Scroll to the lower left corner of the view.
   * scrollView.scrollToBottomLeft(0.1);
   */
  scrollToBottomLeft: function scrollToBottomLeft(timeInSecond, attenuated) {
    var moveDelta = this._calculateMovePercentDelta({
      anchor: cc.v2(0, 0),
      applyToHorizontal: true,
      applyToVertical: true
    });

    if (timeInSecond) {
      this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
    } else {
      this._moveContent(moveDelta);
    }
  },

  /**
   * !#en Scroll the content to the bottom right boundary of ScrollView.
   * !#zh 视图内容将在规定时间内滚动到视图右下角。
   * @method scrollToBottomRight
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the bottom right boundary immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * @example
   * // Scroll to the lower right corner of the view.
   * scrollView.scrollToBottomRight(0.1);
   */
  scrollToBottomRight: function scrollToBottomRight(timeInSecond, attenuated) {
    var moveDelta = this._calculateMovePercentDelta({
      anchor: cc.v2(1, 0),
      applyToHorizontal: true,
      applyToVertical: true
    });

    if (timeInSecond) {
      this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
    } else {
      this._moveContent(moveDelta);
    }
  },

  /**
   * !#en Scroll with an offset related to the ScrollView's top left origin, if timeInSecond is omitted, then it will jump to the
   *       specific offset immediately.
   * !#zh 视图内容在规定时间内将滚动到 ScrollView 相对左上角原点的偏移位置, 如果 timeInSecond参数不传，则立即滚动到指定偏移位置。
   * @method scrollToOffset
   * @param {Vec2} offset - A Vec2, the value of which each axis between 0 and maxScrollOffset
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the specific offset of ScrollView immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * @example
   * // Scroll to middle position in 0.1 second in x-axis
   * let maxScrollOffset = this.getMaxScrollOffset();
   * scrollView.scrollToOffset(cc.v2(maxScrollOffset.x / 2, 0), 0.1);
   */
  scrollToOffset: function scrollToOffset(offset, timeInSecond, attenuated) {
    var maxScrollOffset = this.getMaxScrollOffset();
    var anchor = cc.v2(0, 0); //if maxScrollOffset is 0, then always align the content's top left origin to the top left corner of its parent

    if (maxScrollOffset.x === 0) {
      anchor.x = 0;
    } else {
      anchor.x = offset.x / maxScrollOffset.x;
    }

    if (maxScrollOffset.y === 0) {
      anchor.y = 1;
    } else {
      anchor.y = (maxScrollOffset.y - offset.y) / maxScrollOffset.y;
    }

    this.scrollTo(anchor, timeInSecond, attenuated);
  },

  /**
   * !#en  Get the positive offset value corresponds to the content's top left boundary.
   * !#zh  获取滚动视图相对于左上角原点的当前滚动偏移
   * @method getScrollOffset
   * @return {Vec2}  - A Vec2 value indicate the current scroll offset.
   */
  getScrollOffset: function getScrollOffset() {
    var topDelta = this._getContentTopBoundary() - this._topBoundary;

    var leftDeta = this._getContentLeftBoundary() - this._leftBoundary;

    return cc.v2(leftDeta, topDelta);
  },

  /**
   * !#en Get the maximize available  scroll offset
   * !#zh 获取滚动视图最大可以滚动的偏移量
   * @method getMaxScrollOffset
   * @return {Vec2} - A Vec2 value indicate the maximize scroll offset in x and y axis.
   */
  getMaxScrollOffset: function getMaxScrollOffset() {
    var viewSize = this._view.getContentSize();

    var contentSize = this.content.getContentSize();
    var horizontalMaximizeOffset = contentSize.width - viewSize.width;
    var verticalMaximizeOffset = contentSize.height - viewSize.height;
    horizontalMaximizeOffset = horizontalMaximizeOffset >= 0 ? horizontalMaximizeOffset : 0;
    verticalMaximizeOffset = verticalMaximizeOffset >= 0 ? verticalMaximizeOffset : 0;
    return cc.v2(horizontalMaximizeOffset, verticalMaximizeOffset);
  },

  /**
   * !#en Scroll the content to the horizontal percent position of ScrollView.
   * !#zh 视图内容在规定时间内将滚动到 ScrollView 水平方向的百分比位置上。
   * @method scrollToPercentHorizontal
   * @param {Number} percent - A value between 0 and 1.
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the horizontal percent position of ScrollView immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * @example
   * // Scroll to middle position.
   * scrollView.scrollToBottomRight(0.5, 0.1);
   */
  scrollToPercentHorizontal: function scrollToPercentHorizontal(percent, timeInSecond, attenuated) {
    var moveDelta = this._calculateMovePercentDelta({
      anchor: cc.v2(percent, 0),
      applyToHorizontal: true,
      applyToVertical: false
    });

    if (timeInSecond) {
      this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
    } else {
      this._moveContent(moveDelta);
    }
  },

  /**
   * !#en Scroll the content to the percent position of ScrollView in any direction.
   * !#zh 视图内容在规定时间内进行垂直方向和水平方向的滚动，并且滚动到指定百分比位置上。
   * @method scrollTo
   * @param {Vec2} anchor - A point which will be clamp between cc.v2(0,0) and cc.v2(1,1).
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the percent position of ScrollView immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * @example
   * // Vertical scroll to the bottom of the view.
   * scrollView.scrollTo(cc.v2(0, 1), 0.1);
   *
   * // Horizontal scroll to view right.
   * scrollView.scrollTo(cc.v2(1, 0), 0.1);
   */
  scrollTo: function scrollTo(anchor, timeInSecond, attenuated) {
    var moveDelta = this._calculateMovePercentDelta({
      anchor: cc.v2(anchor),
      applyToHorizontal: true,
      applyToVertical: true
    });

    if (timeInSecond) {
      this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
    } else {
      this._moveContent(moveDelta);
    }
  },

  /**
   * !#en Scroll the content to the vertical percent position of ScrollView.
   * !#zh 视图内容在规定时间内滚动到 ScrollView 垂直方向的百分比位置上。
   * @method scrollToPercentVertical
   * @param {Number} percent - A value between 0 and 1.
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the vertical percent position of ScrollView immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * // Scroll to middle position.
   * scrollView.scrollToPercentVertical(0.5, 0.1);
   */
  scrollToPercentVertical: function scrollToPercentVertical(percent, timeInSecond, attenuated) {
    var moveDelta = this._calculateMovePercentDelta({
      anchor: cc.v2(0, percent),
      applyToHorizontal: false,
      applyToVertical: true
    });

    if (timeInSecond) {
      this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
    } else {
      this._moveContent(moveDelta);
    }
  },

  /**
   * !#en  Stop auto scroll immediately
   * !#zh  停止自动滚动, 调用此 API 可以让 Scrollview 立即停止滚动
   * @method stopAutoScroll
   */
  stopAutoScroll: function stopAutoScroll() {
    this._autoScrolling = false;
    this._autoScrollAccumulatedTime = this._autoScrollTotalTime;
  },

  /**
   * !#en Modify the content position.
   * !#zh 设置当前视图内容的坐标点。
   * @method setContentPosition
   * @param {Vec2} position - The position in content's parent space.
   */
  setContentPosition: function setContentPosition(position) {
    if (position.fuzzyEquals(this.getContentPosition(), EPSILON)) {
      return;
    }

    this.content.setPosition(position);
    this._outOfBoundaryAmountDirty = true;
  },

  /**
   * !#en Query the content's position in its parent space.
   * !#zh 获取当前视图内容的坐标点。
   * @method getContentPosition
   * @returns {Vec2} - The content's position in its parent space.
   */
  getContentPosition: function getContentPosition() {
    return this.content.getPosition();
  },

  /**
   * !#en Query whether the user is currently dragging the ScrollView to scroll it
   * !#zh 用户是否在拖拽当前滚动视图
   * @method isScrolling
   * @returns {Boolean} - Whether the user is currently dragging the ScrollView to scroll it
   */
  isScrolling: function isScrolling() {
    return this._scrolling;
  },

  /**
   * !#en Query whether the ScrollView is currently scrolling because of a bounceback or inertia slowdown.
   * !#zh 当前滚动视图是否在惯性滚动
   * @method isAutoScrolling
   * @returns {Boolean} - Whether the ScrollView is currently scrolling because of a bounceback or inertia slowdown.
   */
  isAutoScrolling: function isAutoScrolling() {
    return this._autoScrolling;
  },
  //private methods
  _registerEvent: function _registerEvent() {
    this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, true);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, true);
    this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, true);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
    this.node.on(cc.Node.EventType.MOUSE_WHEEL, this._onMouseWheel, this, true);
  },
  _unregisterEvent: function _unregisterEvent() {
    this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, true);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, true);
    this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, true);
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
    this.node.off(cc.Node.EventType.MOUSE_WHEEL, this._onMouseWheel, this, true);
  },
  _onMouseWheel: function _onMouseWheel(event, captureListeners) {
    if (!this.enabledInHierarchy) return;
    if (this._hasNestedViewGroup(event, captureListeners)) return;
    var deltaMove = cc.v2(0, 0);
    var wheelPrecision = -0.1; //On the windows platform, the scrolling speed of the mouse wheel of ScrollView on chrome and firebox is different

    if (cc.sys.os === cc.sys.OS_WINDOWS && cc.sys.browserType === cc.sys.BROWSER_TYPE_FIREFOX) {
      wheelPrecision = -0.1 / 3;
    }

    if (CC_JSB || CC_RUNTIME) {
      wheelPrecision = -7;
    }

    if (this.vertical) {
      deltaMove = cc.v2(0, event.getScrollY() * wheelPrecision);
    } else if (this.horizontal) {
      deltaMove = cc.v2(event.getScrollY() * wheelPrecision, 0);
    }

    this._mouseWheelEventElapsedTime = 0;

    this._processDeltaMove(deltaMove);

    if (!this._stopMouseWheel) {
      this._handlePressLogic();

      this.schedule(this._checkMouseWheel, 1.0 / 60);
      this._stopMouseWheel = true;
    }

    this._stopPropagationIfTargetIsMe(event);
  },
  _checkMouseWheel: function _checkMouseWheel(dt) {
    var currentOutOfBoundary = this._getHowMuchOutOfBoundary();

    var maxElapsedTime = 0.1;

    if (!currentOutOfBoundary.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
      this._processInertiaScroll();

      this.unschedule(this._checkMouseWheel);

      this._dispatchEvent('scroll-ended');

      this._stopMouseWheel = false;
      return;
    }

    this._mouseWheelEventElapsedTime += dt; // mouse wheel event is ended

    if (this._mouseWheelEventElapsedTime > maxElapsedTime) {
      this._onScrollBarTouchEnded();

      this.unschedule(this._checkMouseWheel);

      this._dispatchEvent('scroll-ended');

      this._stopMouseWheel = false;
    }
  },
  _calculateMovePercentDelta: function _calculateMovePercentDelta(options) {
    var anchor = options.anchor;
    var applyToHorizontal = options.applyToHorizontal;
    var applyToVertical = options.applyToVertical;

    this._calculateBoundary();

    anchor = anchor.clampf(cc.v2(0, 0), cc.v2(1, 1));

    var scrollSize = this._view.getContentSize();

    var contentSize = this.content.getContentSize();

    var bottomDeta = this._getContentBottomBoundary() - this._bottomBoundary;

    bottomDeta = -bottomDeta;

    var leftDeta = this._getContentLeftBoundary() - this._leftBoundary;

    leftDeta = -leftDeta;
    var moveDelta = cc.v2(0, 0);
    var totalScrollDelta = 0;

    if (applyToHorizontal) {
      totalScrollDelta = contentSize.width - scrollSize.width;
      moveDelta.x = leftDeta - totalScrollDelta * anchor.x;
    }

    if (applyToVertical) {
      totalScrollDelta = contentSize.height - scrollSize.height;
      moveDelta.y = bottomDeta - totalScrollDelta * anchor.y;
    }

    return moveDelta;
  },
  _moveContentToTopLeft: function _moveContentToTopLeft(scrollViewSize) {
    var contentSize = this.content.getContentSize();

    var bottomDeta = this._getContentBottomBoundary() - this._bottomBoundary;

    bottomDeta = -bottomDeta;
    var moveDelta = cc.v2(0, 0);
    var totalScrollDelta = 0;

    var leftDeta = this._getContentLeftBoundary() - this._leftBoundary;

    leftDeta = -leftDeta;

    if (contentSize.height < scrollViewSize.height) {
      totalScrollDelta = contentSize.height - scrollViewSize.height;
      moveDelta.y = bottomDeta - totalScrollDelta;
    }

    if (contentSize.width < scrollViewSize.width) {
      totalScrollDelta = contentSize.width - scrollViewSize.width;
      moveDelta.x = leftDeta;
    }

    this._updateScrollBarState();

    this._moveContent(moveDelta);

    this._adjustContentOutOfBoundary();
  },
  _calculateBoundary: function _calculateBoundary() {
    if (this.content) {
      //refresh content size
      var layout = this.content.getComponent(cc.Layout);

      if (layout && layout.enabledInHierarchy) {
        layout.updateLayout();
      }

      var viewSize = this._view.getContentSize();

      var anchorX = viewSize.width * this._view.anchorX;
      var anchorY = viewSize.height * this._view.anchorY;
      this._leftBoundary = -anchorX;
      this._bottomBoundary = -anchorY;
      this._rightBoundary = this._leftBoundary + viewSize.width;
      this._topBoundary = this._bottomBoundary + viewSize.height;

      this._moveContentToTopLeft(viewSize);
    }
  },
  //this is for nested scrollview
  _hasNestedViewGroup: function _hasNestedViewGroup(event, captureListeners) {
    if (event.eventPhase !== cc.Event.CAPTURING_PHASE) return;

    if (captureListeners) {
      //captureListeners are arranged from child to parent
      for (var i = 0; i < captureListeners.length; ++i) {
        var item = captureListeners[i];

        if (this.node === item) {
          if (event.target.getComponent(cc.ViewGroup)) {
            return true;
          }

          return false;
        }

        if (item.getComponent(cc.ViewGroup)) {
          return true;
        }
      }
    }

    return false;
  },
  //This is for Scrollview as children of a Button
  _stopPropagationIfTargetIsMe: function _stopPropagationIfTargetIsMe(event) {
    if (event.eventPhase === cc.Event.AT_TARGET && event.target === this.node) {
      event.stopPropagation();
    }
  },
  // touch event handler
  _onTouchBegan: function _onTouchBegan(event, captureListeners) {
    if (!this.enabledInHierarchy) return;
    if (this._hasNestedViewGroup(event, captureListeners)) return;
    var touch = event.touch;

    if (this.content) {
      this._handlePressLogic(touch);
    }

    this._touchMoved = false;

    this._stopPropagationIfTargetIsMe(event);
  },
  _onTouchMoved: function _onTouchMoved(event, captureListeners) {
    if (!this.enabledInHierarchy) return;
    if (this._hasNestedViewGroup(event, captureListeners)) return;
    var touch = event.touch;

    if (this.content) {
      this._handleMoveLogic(touch);
    } // Do not prevent touch events in inner nodes


    if (!this.cancelInnerEvents) {
      return;
    }

    var deltaMove = touch.getLocation().sub(touch.getStartLocation()); //FIXME: touch move delta should be calculated by DPI.

    if (deltaMove.mag() > 7) {
      if (!this._touchMoved && event.target !== this.node) {
        // Simulate touch cancel for target node
        var cancelEvent = new cc.Event.EventTouch(event.getTouches(), event.bubbles);
        cancelEvent.type = cc.Node.EventType.TOUCH_CANCEL;
        cancelEvent.touch = event.touch;
        cancelEvent.simulate = true;
        event.target.dispatchEvent(cancelEvent);
        this._touchMoved = true;
      }
    }

    this._stopPropagationIfTargetIsMe(event);
  },
  _onTouchEnded: function _onTouchEnded(event, captureListeners) {
    if (!this.enabledInHierarchy) return;
    if (this._hasNestedViewGroup(event, captureListeners)) return;

    this._dispatchEvent('touch-up');

    var touch = event.touch;

    if (this.content) {
      this._handleReleaseLogic(touch);
    }

    if (this._touchMoved) {
      event.stopPropagation();
    } else {
      this._stopPropagationIfTargetIsMe(event);
    }
  },
  _onTouchCancelled: function _onTouchCancelled(event, captureListeners) {
    if (!this.enabledInHierarchy) return;
    if (this._hasNestedViewGroup(event, captureListeners)) return; // Filte touch cancel event send from self

    if (!event.simulate) {
      var touch = event.touch;

      if (this.content) {
        this._handleReleaseLogic(touch);
      }
    }

    this._stopPropagationIfTargetIsMe(event);
  },
  _processDeltaMove: function _processDeltaMove(deltaMove) {
    this._scrollChildren(deltaMove);

    this._gatherTouchMove(deltaMove);
  },
  // Contains node angle calculations
  _getLocalAxisAlignDelta: function _getLocalAxisAlignDelta(touch) {
    this.node.convertToNodeSpaceAR(touch.getLocation(), _tempPoint);
    this.node.convertToNodeSpaceAR(touch.getPreviousLocation(), _tempPrevPoint);
    return _tempPoint.sub(_tempPrevPoint);
  },
  _handleMoveLogic: function _handleMoveLogic(touch) {
    var deltaMove = this._getLocalAxisAlignDelta(touch);

    this._processDeltaMove(deltaMove);
  },
  _scrollChildren: function _scrollChildren(deltaMove) {
    deltaMove = this._clampDelta(deltaMove);
    var realMove = deltaMove;
    var outOfBoundary;

    if (this.elastic) {
      outOfBoundary = this._getHowMuchOutOfBoundary();
      realMove.x *= outOfBoundary.x === 0 ? 1 : 0.5;
      realMove.y *= outOfBoundary.y === 0 ? 1 : 0.5;
    }

    if (!this.elastic) {
      outOfBoundary = this._getHowMuchOutOfBoundary(realMove);
      realMove = realMove.add(outOfBoundary);
    }

    var scrollEventType = -1;

    if (realMove.y > 0) {
      //up
      var icBottomPos = this.content.y - this.content.anchorY * this.content.height;

      if (icBottomPos + realMove.y >= this._bottomBoundary) {
        scrollEventType = 'scroll-to-bottom';
      }
    } else if (realMove.y < 0) {
      //down
      var icTopPos = this.content.y - this.content.anchorY * this.content.height + this.content.height;

      if (icTopPos + realMove.y <= this._topBoundary) {
        scrollEventType = 'scroll-to-top';
      }
    }

    if (realMove.x < 0) {
      //left
      var icRightPos = this.content.x - this.content.anchorX * this.content.width + this.content.width;

      if (icRightPos + realMove.x <= this._rightBoundary) {
        scrollEventType = 'scroll-to-right';
      }
    } else if (realMove.x > 0) {
      //right
      var icLeftPos = this.content.x - this.content.anchorX * this.content.width;

      if (icLeftPos + realMove.x >= this._leftBoundary) {
        scrollEventType = 'scroll-to-left';
      }
    }

    this._moveContent(realMove, false);

    if (realMove.x !== 0 || realMove.y !== 0) {
      if (!this._scrolling) {
        this._scrolling = true;

        this._dispatchEvent('scroll-began');
      }

      this._dispatchEvent('scrolling');
    }

    if (scrollEventType !== -1) {
      this._dispatchEvent(scrollEventType);
    }
  },
  _handlePressLogic: function _handlePressLogic() {
    if (this._autoScrolling) {
      this._dispatchEvent('scroll-ended');
    }

    this._autoScrolling = false;
    this._isBouncing = false;
    this._touchMovePreviousTimestamp = getTimeInMilliseconds();
    this._touchMoveDisplacements.length = 0;
    this._touchMoveTimeDeltas.length = 0;

    this._onScrollBarTouchBegan();
  },
  _clampDelta: function _clampDelta(delta) {
    var contentSize = this.content.getContentSize();

    var scrollViewSize = this._view.getContentSize();

    if (contentSize.width < scrollViewSize.width) {
      delta.x = 0;
    }

    if (contentSize.height < scrollViewSize.height) {
      delta.y = 0;
    }

    return delta;
  },
  _gatherTouchMove: function _gatherTouchMove(delta) {
    delta = this._clampDelta(delta);

    while (this._touchMoveDisplacements.length >= NUMBER_OF_GATHERED_TOUCHES_FOR_MOVE_SPEED) {
      this._touchMoveDisplacements.shift();

      this._touchMoveTimeDeltas.shift();
    }

    this._touchMoveDisplacements.push(delta);

    var timeStamp = getTimeInMilliseconds();

    this._touchMoveTimeDeltas.push((timeStamp - this._touchMovePreviousTimestamp) / 1000);

    this._touchMovePreviousTimestamp = timeStamp;
  },
  _startBounceBackIfNeeded: function _startBounceBackIfNeeded() {
    if (!this.elastic) {
      return false;
    }

    var bounceBackAmount = this._getHowMuchOutOfBoundary();

    bounceBackAmount = this._clampDelta(bounceBackAmount);

    if (bounceBackAmount.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
      return false;
    }

    var bounceBackTime = Math.max(this.bounceDuration, 0);

    this._startAutoScroll(bounceBackAmount, bounceBackTime, true);

    if (!this._isBouncing) {
      if (bounceBackAmount.y > 0) this._dispatchEvent('bounce-top');
      if (bounceBackAmount.y < 0) this._dispatchEvent('bounce-bottom');
      if (bounceBackAmount.x > 0) this._dispatchEvent('bounce-right');
      if (bounceBackAmount.x < 0) this._dispatchEvent('bounce-left');
      this._isBouncing = true;
    }

    return true;
  },
  _processInertiaScroll: function _processInertiaScroll() {
    var bounceBackStarted = this._startBounceBackIfNeeded();

    if (!bounceBackStarted && this.inertia) {
      var touchMoveVelocity = this._calculateTouchMoveVelocity();

      if (!touchMoveVelocity.fuzzyEquals(cc.v2(0, 0), EPSILON) && this.brake < 1) {
        this._startInertiaScroll(touchMoveVelocity);
      }
    }

    this._onScrollBarTouchEnded();
  },
  _handleReleaseLogic: function _handleReleaseLogic(touch) {
    var delta = this._getLocalAxisAlignDelta(touch);

    this._gatherTouchMove(delta);

    this._processInertiaScroll();

    if (this._scrolling) {
      this._scrolling = false;

      if (!this._autoScrolling) {
        this._dispatchEvent('scroll-ended');
      }
    }
  },
  _isOutOfBoundary: function _isOutOfBoundary() {
    var outOfBoundary = this._getHowMuchOutOfBoundary();

    return !outOfBoundary.fuzzyEquals(cc.v2(0, 0), EPSILON);
  },
  _isNecessaryAutoScrollBrake: function _isNecessaryAutoScrollBrake() {
    if (this._autoScrollBraking) {
      return true;
    }

    if (this._isOutOfBoundary()) {
      if (!this._autoScrollCurrentlyOutOfBoundary) {
        this._autoScrollCurrentlyOutOfBoundary = true;
        this._autoScrollBraking = true;
        this._autoScrollBrakingStartPosition = this.getContentPosition();
        return true;
      }
    } else {
      this._autoScrollCurrentlyOutOfBoundary = false;
    }

    return false;
  },
  getScrollEndedEventTiming: function getScrollEndedEventTiming() {
    return EPSILON;
  },
  _processAutoScrolling: function _processAutoScrolling(dt) {
    var isAutoScrollBrake = this._isNecessaryAutoScrollBrake();

    var brakingFactor = isAutoScrollBrake ? OUT_OF_BOUNDARY_BREAKING_FACTOR : 1;
    this._autoScrollAccumulatedTime += dt * (1 / brakingFactor);
    var percentage = Math.min(1, this._autoScrollAccumulatedTime / this._autoScrollTotalTime);

    if (this._autoScrollAttenuate) {
      percentage = quintEaseOut(percentage);
    }

    var newPosition = this._autoScrollStartPosition.add(this._autoScrollTargetDelta.mul(percentage));

    var reachedEnd = Math.abs(percentage - 1) <= EPSILON;
    var fireEvent = Math.abs(percentage - 1) <= this.getScrollEndedEventTiming();

    if (fireEvent && !this._isScrollEndedWithThresholdEventFired) {
      this._dispatchEvent('scroll-ended-with-threshold');

      this._isScrollEndedWithThresholdEventFired = true;
    }

    if (this.elastic) {
      var brakeOffsetPosition = newPosition.sub(this._autoScrollBrakingStartPosition);

      if (isAutoScrollBrake) {
        brakeOffsetPosition = brakeOffsetPosition.mul(brakingFactor);
      }

      newPosition = this._autoScrollBrakingStartPosition.add(brakeOffsetPosition);
    } else {
      var moveDelta = newPosition.sub(this.getContentPosition());

      var outOfBoundary = this._getHowMuchOutOfBoundary(moveDelta);

      if (!outOfBoundary.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
        newPosition = newPosition.add(outOfBoundary);
        reachedEnd = true;
      }
    }

    if (reachedEnd) {
      this._autoScrolling = false;
    }

    var deltaMove = newPosition.sub(this.getContentPosition());

    this._moveContent(this._clampDelta(deltaMove), reachedEnd);

    this._dispatchEvent('scrolling'); // scollTo API controll move


    if (!this._autoScrolling) {
      this._isBouncing = false;
      this._scrolling = false;

      this._dispatchEvent('scroll-ended');
    }
  },
  _startInertiaScroll: function _startInertiaScroll(touchMoveVelocity) {
    var inertiaTotalMovement = touchMoveVelocity.mul(MOVEMENT_FACTOR);

    this._startAttenuatingAutoScroll(inertiaTotalMovement, touchMoveVelocity);
  },
  _calculateAttenuatedFactor: function _calculateAttenuatedFactor(distance) {
    if (this.brake <= 0) {
      return 1 - this.brake;
    } //attenuate formula from: http://learnopengl.com/#!Lighting/Light-casters


    return (1 - this.brake) * (1 / (1 + distance * 0.000014 + distance * distance * 0.000000008));
  },
  _startAttenuatingAutoScroll: function _startAttenuatingAutoScroll(deltaMove, initialVelocity) {
    var time = this._calculateAutoScrollTimeByInitalSpeed(initialVelocity.mag());

    var targetDelta = deltaMove.normalize();
    var contentSize = this.content.getContentSize();

    var scrollviewSize = this._view.getContentSize();

    var totalMoveWidth = contentSize.width - scrollviewSize.width;
    var totalMoveHeight = contentSize.height - scrollviewSize.height;

    var attenuatedFactorX = this._calculateAttenuatedFactor(totalMoveWidth);

    var attenuatedFactorY = this._calculateAttenuatedFactor(totalMoveHeight);

    targetDelta = cc.v2(targetDelta.x * totalMoveWidth * (1 - this.brake) * attenuatedFactorX, targetDelta.y * totalMoveHeight * attenuatedFactorY * (1 - this.brake));
    var originalMoveLength = deltaMove.mag();
    var factor = targetDelta.mag() / originalMoveLength;
    targetDelta = targetDelta.add(deltaMove);

    if (this.brake > 0 && factor > 7) {
      factor = Math.sqrt(factor);
      targetDelta = deltaMove.mul(factor).add(deltaMove);
    }

    if (this.brake > 0 && factor > 3) {
      factor = 3;
      time = time * factor;
    }

    if (this.brake === 0 && factor > 1) {
      time = time * factor;
    }

    this._startAutoScroll(targetDelta, time, true);
  },
  _calculateAutoScrollTimeByInitalSpeed: function _calculateAutoScrollTimeByInitalSpeed(initalSpeed) {
    return Math.sqrt(Math.sqrt(initalSpeed / 5));
  },
  _startAutoScroll: function _startAutoScroll(deltaMove, timeInSecond, attenuated) {
    var adjustedDeltaMove = this._flattenVectorByDirection(deltaMove);

    this._autoScrolling = true;
    this._autoScrollTargetDelta = adjustedDeltaMove;
    this._autoScrollAttenuate = attenuated;
    this._autoScrollStartPosition = this.getContentPosition();
    this._autoScrollTotalTime = timeInSecond;
    this._autoScrollAccumulatedTime = 0;
    this._autoScrollBraking = false;
    this._isScrollEndedWithThresholdEventFired = false;
    this._autoScrollBrakingStartPosition = cc.v2(0, 0);

    var currentOutOfBoundary = this._getHowMuchOutOfBoundary();

    if (!currentOutOfBoundary.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
      this._autoScrollCurrentlyOutOfBoundary = true;
    }
  },
  _calculateTouchMoveVelocity: function _calculateTouchMoveVelocity() {
    var totalTime = 0;
    totalTime = this._touchMoveTimeDeltas.reduce(function (a, b) {
      return a + b;
    }, totalTime);

    if (totalTime <= 0 || totalTime >= 0.5) {
      return cc.v2(0, 0);
    }

    var totalMovement = cc.v2(0, 0);
    totalMovement = this._touchMoveDisplacements.reduce(function (a, b) {
      return a.add(b);
    }, totalMovement);
    return cc.v2(totalMovement.x * (1 - this.brake) / totalTime, totalMovement.y * (1 - this.brake) / totalTime);
  },
  _flattenVectorByDirection: function _flattenVectorByDirection(vector) {
    var result = vector;
    result.x = this.horizontal ? result.x : 0;
    result.y = this.vertical ? result.y : 0;
    return result;
  },
  _moveContent: function _moveContent(deltaMove, canStartBounceBack) {
    var adjustedMove = this._flattenVectorByDirection(deltaMove);

    var newPosition = this.getContentPosition().add(adjustedMove);
    this.setContentPosition(newPosition);

    var outOfBoundary = this._getHowMuchOutOfBoundary();

    this._updateScrollBar(outOfBoundary);

    if (this.elastic && canStartBounceBack) {
      this._startBounceBackIfNeeded();
    }
  },
  _getContentLeftBoundary: function _getContentLeftBoundary() {
    var contentPos = this.getContentPosition();
    return contentPos.x - this.content.getAnchorPoint().x * this.content.getContentSize().width;
  },
  _getContentRightBoundary: function _getContentRightBoundary() {
    var contentSize = this.content.getContentSize();
    return this._getContentLeftBoundary() + contentSize.width;
  },
  _getContentTopBoundary: function _getContentTopBoundary() {
    var contentSize = this.content.getContentSize();
    return this._getContentBottomBoundary() + contentSize.height;
  },
  _getContentBottomBoundary: function _getContentBottomBoundary() {
    var contentPos = this.getContentPosition();
    return contentPos.y - this.content.getAnchorPoint().y * this.content.getContentSize().height;
  },
  _getHowMuchOutOfBoundary: function _getHowMuchOutOfBoundary(addition) {
    addition = addition || cc.v2(0, 0);

    if (addition.fuzzyEquals(cc.v2(0, 0), EPSILON) && !this._outOfBoundaryAmountDirty) {
      return this._outOfBoundaryAmount;
    }

    var outOfBoundaryAmount = cc.v2(0, 0);

    if (this._getContentLeftBoundary() + addition.x > this._leftBoundary) {
      outOfBoundaryAmount.x = this._leftBoundary - (this._getContentLeftBoundary() + addition.x);
    } else if (this._getContentRightBoundary() + addition.x < this._rightBoundary) {
      outOfBoundaryAmount.x = this._rightBoundary - (this._getContentRightBoundary() + addition.x);
    }

    if (this._getContentTopBoundary() + addition.y < this._topBoundary) {
      outOfBoundaryAmount.y = this._topBoundary - (this._getContentTopBoundary() + addition.y);
    } else if (this._getContentBottomBoundary() + addition.y > this._bottomBoundary) {
      outOfBoundaryAmount.y = this._bottomBoundary - (this._getContentBottomBoundary() + addition.y);
    }

    if (addition.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
      this._outOfBoundaryAmount = outOfBoundaryAmount;
      this._outOfBoundaryAmountDirty = false;
    }

    outOfBoundaryAmount = this._clampDelta(outOfBoundaryAmount);
    return outOfBoundaryAmount;
  },
  _updateScrollBarState: function _updateScrollBarState() {
    if (!this.content) {
      return;
    }

    var contentSize = this.content.getContentSize();

    var scrollViewSize = this._view.getContentSize();

    if (this.verticalScrollBar) {
      if (contentSize.height < scrollViewSize.height) {
        this.verticalScrollBar.hide();
      } else {
        this.verticalScrollBar.show();
      }
    }

    if (this.horizontalScrollBar) {
      if (contentSize.width < scrollViewSize.width) {
        this.horizontalScrollBar.hide();
      } else {
        this.horizontalScrollBar.show();
      }
    }
  },
  _updateScrollBar: function _updateScrollBar(outOfBoundary) {
    if (this.horizontalScrollBar) {
      this.horizontalScrollBar._onScroll(outOfBoundary);
    }

    if (this.verticalScrollBar) {
      this.verticalScrollBar._onScroll(outOfBoundary);
    }
  },
  _onScrollBarTouchBegan: function _onScrollBarTouchBegan() {
    if (this.horizontalScrollBar) {
      this.horizontalScrollBar._onTouchBegan();
    }

    if (this.verticalScrollBar) {
      this.verticalScrollBar._onTouchBegan();
    }
  },
  _onScrollBarTouchEnded: function _onScrollBarTouchEnded() {
    if (this.horizontalScrollBar) {
      this.horizontalScrollBar._onTouchEnded();
    }

    if (this.verticalScrollBar) {
      this.verticalScrollBar._onTouchEnded();
    }
  },
  _dispatchEvent: function _dispatchEvent(event) {
    if (event === 'scroll-ended') {
      this._scrollEventEmitMask = 0;
    } else if (event === 'scroll-to-top' || event === 'scroll-to-bottom' || event === 'scroll-to-left' || event === 'scroll-to-right') {
      var flag = 1 << eventMap[event];

      if (this._scrollEventEmitMask & flag) {
        return;
      } else {
        this._scrollEventEmitMask |= flag;
      }
    }

    cc.Component.EventHandler.emitEvents(this.scrollEvents, this, eventMap[event]);
    this.node.emit(event, this);
  },
  _adjustContentOutOfBoundary: function _adjustContentOutOfBoundary() {
    this._outOfBoundaryAmountDirty = true;

    if (this._isOutOfBoundary()) {
      var outOfBoundary = this._getHowMuchOutOfBoundary(cc.v2(0, 0));

      var newPosition = this.getContentPosition().add(outOfBoundary);

      if (this.content) {
        this.content.setPosition(newPosition);

        this._updateScrollBar(0);
      }
    }
  },
  start: function start() {
    this._calculateBoundary(); //Because widget component will adjust content position and scrollview position is correct after visit
    //So this event could make sure the content is on the correct position after loading.


    if (this.content) {
      cc.director.once(cc.Director.EVENT_BEFORE_DRAW, this._adjustContentOutOfBoundary, this);
    }
  },
  _hideScrollbar: function _hideScrollbar() {
    if (this.horizontalScrollBar) {
      this.horizontalScrollBar.hide();
    }

    if (this.verticalScrollBar) {
      this.verticalScrollBar.hide();
    }
  },
  onDisable: function onDisable() {
    if (!CC_EDITOR) {
      this._unregisterEvent();

      if (this.content) {
        this.content.off(NodeEvent.SIZE_CHANGED, this._calculateBoundary, this);
        this.content.off(NodeEvent.SCALE_CHANGED, this._calculateBoundary, this);

        if (this._view) {
          this._view.off(NodeEvent.POSITION_CHANGED, this._calculateBoundary, this);

          this._view.off(NodeEvent.SCALE_CHANGED, this._calculateBoundary, this);

          this._view.off(NodeEvent.SIZE_CHANGED, this._calculateBoundary, this);
        }
      }
    }

    this._hideScrollbar();

    this.stopAutoScroll();
  },
  onEnable: function onEnable() {
    if (!CC_EDITOR) {
      this._registerEvent();

      if (this.content) {
        this.content.on(NodeEvent.SIZE_CHANGED, this._calculateBoundary, this);
        this.content.on(NodeEvent.SCALE_CHANGED, this._calculateBoundary, this);

        if (this._view) {
          this._view.on(NodeEvent.POSITION_CHANGED, this._calculateBoundary, this);

          this._view.on(NodeEvent.SCALE_CHANGED, this._calculateBoundary, this);

          this._view.on(NodeEvent.SIZE_CHANGED, this._calculateBoundary, this);
        }
      }
    }

    this._updateScrollBarState();
  },
  update: function update(dt) {
    if (this._autoScrolling) {
      this._processAutoScrolling(dt);
    }
  }
});
cc.ScrollView = module.exports = ScrollView;
/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scroll-to-top
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scroll-to-bottom
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scroll-to-left
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scroll-to-right
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scrolling
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event bounce-bottom
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event bounce-top
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event bounce-left
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event bounce-right
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scroll-ended
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event touch-up
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
* !#en
* Note: This event is emitted from the node to which the component belongs.
* !#zh
* 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
* @event scroll-began
* @param {Event.EventCustom} event
* @param {ScrollView} scrollView - The ScrollView component.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvQ0NTY3JvbGxWaWV3LmpzIl0sIm5hbWVzIjpbIk5vZGVFdmVudCIsInJlcXVpcmUiLCJFdmVudFR5cGUiLCJOVU1CRVJfT0ZfR0FUSEVSRURfVE9VQ0hFU19GT1JfTU9WRV9TUEVFRCIsIk9VVF9PRl9CT1VOREFSWV9CUkVBS0lOR19GQUNUT1IiLCJFUFNJTE9OIiwiTU9WRU1FTlRfRkFDVE9SIiwiX3RlbXBQb2ludCIsImNjIiwidjIiLCJfdGVtcFByZXZQb2ludCIsInF1aW50RWFzZU91dCIsInRpbWUiLCJnZXRUaW1lSW5NaWxsaXNlY29uZHMiLCJjdXJyZW50VGltZSIsIkRhdGUiLCJnZXRNaWxsaXNlY29uZHMiLCJFbnVtIiwiU0NST0xMX1RPX1RPUCIsIlNDUk9MTF9UT19CT1RUT00iLCJTQ1JPTExfVE9fTEVGVCIsIlNDUk9MTF9UT19SSUdIVCIsIlNDUk9MTElORyIsIkJPVU5DRV9UT1AiLCJCT1VOQ0VfQk9UVE9NIiwiQk9VTkNFX0xFRlQiLCJCT1VOQ0VfUklHSFQiLCJTQ1JPTExfRU5ERUQiLCJUT1VDSF9VUCIsIkFVVE9TQ1JPTExfRU5ERURfV0lUSF9USFJFU0hPTEQiLCJTQ1JPTExfQkVHQU4iLCJldmVudE1hcCIsIlNjcm9sbFZpZXciLCJDbGFzcyIsIm5hbWUiLCJlZGl0b3IiLCJDQ19FRElUT1IiLCJtZW51IiwiaGVscCIsImluc3BlY3RvciIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiY3RvciIsIl90b3BCb3VuZGFyeSIsIl9ib3R0b21Cb3VuZGFyeSIsIl9sZWZ0Qm91bmRhcnkiLCJfcmlnaHRCb3VuZGFyeSIsIl90b3VjaE1vdmVEaXNwbGFjZW1lbnRzIiwiX3RvdWNoTW92ZVRpbWVEZWx0YXMiLCJfdG91Y2hNb3ZlUHJldmlvdXNUaW1lc3RhbXAiLCJfdG91Y2hNb3ZlZCIsIl9hdXRvU2Nyb2xsaW5nIiwiX2F1dG9TY3JvbGxBdHRlbnVhdGUiLCJfYXV0b1Njcm9sbFN0YXJ0UG9zaXRpb24iLCJfYXV0b1Njcm9sbFRhcmdldERlbHRhIiwiX2F1dG9TY3JvbGxUb3RhbFRpbWUiLCJfYXV0b1Njcm9sbEFjY3VtdWxhdGVkVGltZSIsIl9hdXRvU2Nyb2xsQ3VycmVudGx5T3V0T2ZCb3VuZGFyeSIsIl9hdXRvU2Nyb2xsQnJha2luZyIsIl9hdXRvU2Nyb2xsQnJha2luZ1N0YXJ0UG9zaXRpb24iLCJfb3V0T2ZCb3VuZGFyeUFtb3VudCIsIl9vdXRPZkJvdW5kYXJ5QW1vdW50RGlydHkiLCJfc3RvcE1vdXNlV2hlZWwiLCJfbW91c2VXaGVlbEV2ZW50RWxhcHNlZFRpbWUiLCJfaXNTY3JvbGxFbmRlZFdpdGhUaHJlc2hvbGRFdmVudEZpcmVkIiwiX3Njcm9sbEV2ZW50RW1pdE1hc2siLCJfaXNCb3VuY2luZyIsIl9zY3JvbGxpbmciLCJwcm9wZXJ0aWVzIiwiY29udGVudCIsInVuZGVmaW5lZCIsInR5cGUiLCJOb2RlIiwidG9vbHRpcCIsIkNDX0RFViIsImZvcm1lcmx5U2VyaWFsaXplZEFzIiwibm90aWZ5Iiwib2xkVmFsdWUiLCJfY2FsY3VsYXRlQm91bmRhcnkiLCJob3Jpem9udGFsIiwiYW5pbWF0YWJsZSIsInZlcnRpY2FsIiwiaW5lcnRpYSIsImJyYWtlIiwiRmxvYXQiLCJyYW5nZSIsImVsYXN0aWMiLCJib3VuY2VEdXJhdGlvbiIsImhvcml6b250YWxTY3JvbGxCYXIiLCJTY3JvbGxiYXIiLCJzZXRUYXJnZXRTY3JvbGxWaWV3IiwiX3VwZGF0ZVNjcm9sbEJhciIsInZlcnRpY2FsU2Nyb2xsQmFyIiwic2Nyb2xsRXZlbnRzIiwiQ29tcG9uZW50IiwiRXZlbnRIYW5kbGVyIiwiY2FuY2VsSW5uZXJFdmVudHMiLCJfdmlldyIsImdldCIsInBhcmVudCIsInN0YXRpY3MiLCJzY3JvbGxUb0JvdHRvbSIsInRpbWVJblNlY29uZCIsImF0dGVudWF0ZWQiLCJtb3ZlRGVsdGEiLCJfY2FsY3VsYXRlTW92ZVBlcmNlbnREZWx0YSIsImFuY2hvciIsImFwcGx5VG9Ib3Jpem9udGFsIiwiYXBwbHlUb1ZlcnRpY2FsIiwiX3N0YXJ0QXV0b1Njcm9sbCIsIl9tb3ZlQ29udGVudCIsInNjcm9sbFRvVG9wIiwic2Nyb2xsVG9MZWZ0Iiwic2Nyb2xsVG9SaWdodCIsInNjcm9sbFRvVG9wTGVmdCIsInNjcm9sbFRvVG9wUmlnaHQiLCJzY3JvbGxUb0JvdHRvbUxlZnQiLCJzY3JvbGxUb0JvdHRvbVJpZ2h0Iiwic2Nyb2xsVG9PZmZzZXQiLCJvZmZzZXQiLCJtYXhTY3JvbGxPZmZzZXQiLCJnZXRNYXhTY3JvbGxPZmZzZXQiLCJ4IiwieSIsInNjcm9sbFRvIiwiZ2V0U2Nyb2xsT2Zmc2V0IiwidG9wRGVsdGEiLCJfZ2V0Q29udGVudFRvcEJvdW5kYXJ5IiwibGVmdERldGEiLCJfZ2V0Q29udGVudExlZnRCb3VuZGFyeSIsInZpZXdTaXplIiwiZ2V0Q29udGVudFNpemUiLCJjb250ZW50U2l6ZSIsImhvcml6b250YWxNYXhpbWl6ZU9mZnNldCIsIndpZHRoIiwidmVydGljYWxNYXhpbWl6ZU9mZnNldCIsImhlaWdodCIsInNjcm9sbFRvUGVyY2VudEhvcml6b250YWwiLCJwZXJjZW50Iiwic2Nyb2xsVG9QZXJjZW50VmVydGljYWwiLCJzdG9wQXV0b1Njcm9sbCIsInNldENvbnRlbnRQb3NpdGlvbiIsInBvc2l0aW9uIiwiZnV6enlFcXVhbHMiLCJnZXRDb250ZW50UG9zaXRpb24iLCJzZXRQb3NpdGlvbiIsImdldFBvc2l0aW9uIiwiaXNTY3JvbGxpbmciLCJpc0F1dG9TY3JvbGxpbmciLCJfcmVnaXN0ZXJFdmVudCIsIm5vZGUiLCJvbiIsIlRPVUNIX1NUQVJUIiwiX29uVG91Y2hCZWdhbiIsIlRPVUNIX01PVkUiLCJfb25Ub3VjaE1vdmVkIiwiVE9VQ0hfRU5EIiwiX29uVG91Y2hFbmRlZCIsIlRPVUNIX0NBTkNFTCIsIl9vblRvdWNoQ2FuY2VsbGVkIiwiTU9VU0VfV0hFRUwiLCJfb25Nb3VzZVdoZWVsIiwiX3VucmVnaXN0ZXJFdmVudCIsIm9mZiIsImV2ZW50IiwiY2FwdHVyZUxpc3RlbmVycyIsImVuYWJsZWRJbkhpZXJhcmNoeSIsIl9oYXNOZXN0ZWRWaWV3R3JvdXAiLCJkZWx0YU1vdmUiLCJ3aGVlbFByZWNpc2lvbiIsInN5cyIsIm9zIiwiT1NfV0lORE9XUyIsImJyb3dzZXJUeXBlIiwiQlJPV1NFUl9UWVBFX0ZJUkVGT1giLCJDQ19KU0IiLCJDQ19SVU5USU1FIiwiZ2V0U2Nyb2xsWSIsIl9wcm9jZXNzRGVsdGFNb3ZlIiwiX2hhbmRsZVByZXNzTG9naWMiLCJzY2hlZHVsZSIsIl9jaGVja01vdXNlV2hlZWwiLCJfc3RvcFByb3BhZ2F0aW9uSWZUYXJnZXRJc01lIiwiZHQiLCJjdXJyZW50T3V0T2ZCb3VuZGFyeSIsIl9nZXRIb3dNdWNoT3V0T2ZCb3VuZGFyeSIsIm1heEVsYXBzZWRUaW1lIiwiX3Byb2Nlc3NJbmVydGlhU2Nyb2xsIiwidW5zY2hlZHVsZSIsIl9kaXNwYXRjaEV2ZW50IiwiX29uU2Nyb2xsQmFyVG91Y2hFbmRlZCIsIm9wdGlvbnMiLCJjbGFtcGYiLCJzY3JvbGxTaXplIiwiYm90dG9tRGV0YSIsIl9nZXRDb250ZW50Qm90dG9tQm91bmRhcnkiLCJ0b3RhbFNjcm9sbERlbHRhIiwiX21vdmVDb250ZW50VG9Ub3BMZWZ0Iiwic2Nyb2xsVmlld1NpemUiLCJfdXBkYXRlU2Nyb2xsQmFyU3RhdGUiLCJfYWRqdXN0Q29udGVudE91dE9mQm91bmRhcnkiLCJsYXlvdXQiLCJnZXRDb21wb25lbnQiLCJMYXlvdXQiLCJ1cGRhdGVMYXlvdXQiLCJhbmNob3JYIiwiYW5jaG9yWSIsImV2ZW50UGhhc2UiLCJFdmVudCIsIkNBUFRVUklOR19QSEFTRSIsImkiLCJsZW5ndGgiLCJpdGVtIiwidGFyZ2V0IiwiVmlld0dyb3VwIiwiQVRfVEFSR0VUIiwic3RvcFByb3BhZ2F0aW9uIiwidG91Y2giLCJfaGFuZGxlTW92ZUxvZ2ljIiwiZ2V0TG9jYXRpb24iLCJzdWIiLCJnZXRTdGFydExvY2F0aW9uIiwibWFnIiwiY2FuY2VsRXZlbnQiLCJFdmVudFRvdWNoIiwiZ2V0VG91Y2hlcyIsImJ1YmJsZXMiLCJzaW11bGF0ZSIsImRpc3BhdGNoRXZlbnQiLCJfaGFuZGxlUmVsZWFzZUxvZ2ljIiwiX3Njcm9sbENoaWxkcmVuIiwiX2dhdGhlclRvdWNoTW92ZSIsIl9nZXRMb2NhbEF4aXNBbGlnbkRlbHRhIiwiY29udmVydFRvTm9kZVNwYWNlQVIiLCJnZXRQcmV2aW91c0xvY2F0aW9uIiwiX2NsYW1wRGVsdGEiLCJyZWFsTW92ZSIsIm91dE9mQm91bmRhcnkiLCJhZGQiLCJzY3JvbGxFdmVudFR5cGUiLCJpY0JvdHRvbVBvcyIsImljVG9wUG9zIiwiaWNSaWdodFBvcyIsImljTGVmdFBvcyIsIl9vblNjcm9sbEJhclRvdWNoQmVnYW4iLCJkZWx0YSIsInNoaWZ0IiwicHVzaCIsInRpbWVTdGFtcCIsIl9zdGFydEJvdW5jZUJhY2tJZk5lZWRlZCIsImJvdW5jZUJhY2tBbW91bnQiLCJib3VuY2VCYWNrVGltZSIsIk1hdGgiLCJtYXgiLCJib3VuY2VCYWNrU3RhcnRlZCIsInRvdWNoTW92ZVZlbG9jaXR5IiwiX2NhbGN1bGF0ZVRvdWNoTW92ZVZlbG9jaXR5IiwiX3N0YXJ0SW5lcnRpYVNjcm9sbCIsIl9pc091dE9mQm91bmRhcnkiLCJfaXNOZWNlc3NhcnlBdXRvU2Nyb2xsQnJha2UiLCJnZXRTY3JvbGxFbmRlZEV2ZW50VGltaW5nIiwiX3Byb2Nlc3NBdXRvU2Nyb2xsaW5nIiwiaXNBdXRvU2Nyb2xsQnJha2UiLCJicmFraW5nRmFjdG9yIiwicGVyY2VudGFnZSIsIm1pbiIsIm5ld1Bvc2l0aW9uIiwibXVsIiwicmVhY2hlZEVuZCIsImFicyIsImZpcmVFdmVudCIsImJyYWtlT2Zmc2V0UG9zaXRpb24iLCJpbmVydGlhVG90YWxNb3ZlbWVudCIsIl9zdGFydEF0dGVudWF0aW5nQXV0b1Njcm9sbCIsIl9jYWxjdWxhdGVBdHRlbnVhdGVkRmFjdG9yIiwiZGlzdGFuY2UiLCJpbml0aWFsVmVsb2NpdHkiLCJfY2FsY3VsYXRlQXV0b1Njcm9sbFRpbWVCeUluaXRhbFNwZWVkIiwidGFyZ2V0RGVsdGEiLCJub3JtYWxpemUiLCJzY3JvbGx2aWV3U2l6ZSIsInRvdGFsTW92ZVdpZHRoIiwidG90YWxNb3ZlSGVpZ2h0IiwiYXR0ZW51YXRlZEZhY3RvclgiLCJhdHRlbnVhdGVkRmFjdG9yWSIsIm9yaWdpbmFsTW92ZUxlbmd0aCIsImZhY3RvciIsInNxcnQiLCJpbml0YWxTcGVlZCIsImFkanVzdGVkRGVsdGFNb3ZlIiwiX2ZsYXR0ZW5WZWN0b3JCeURpcmVjdGlvbiIsInRvdGFsVGltZSIsInJlZHVjZSIsImEiLCJiIiwidG90YWxNb3ZlbWVudCIsInZlY3RvciIsInJlc3VsdCIsImNhblN0YXJ0Qm91bmNlQmFjayIsImFkanVzdGVkTW92ZSIsImNvbnRlbnRQb3MiLCJnZXRBbmNob3JQb2ludCIsIl9nZXRDb250ZW50UmlnaHRCb3VuZGFyeSIsImFkZGl0aW9uIiwib3V0T2ZCb3VuZGFyeUFtb3VudCIsImhpZGUiLCJzaG93IiwiX29uU2Nyb2xsIiwiZmxhZyIsImVtaXRFdmVudHMiLCJlbWl0Iiwic3RhcnQiLCJkaXJlY3RvciIsIm9uY2UiLCJEaXJlY3RvciIsIkVWRU5UX0JFRk9SRV9EUkFXIiwiX2hpZGVTY3JvbGxiYXIiLCJvbkRpc2FibGUiLCJTSVpFX0NIQU5HRUQiLCJTQ0FMRV9DSEFOR0VEIiwiUE9TSVRJT05fQ0hBTkdFRCIsIm9uRW5hYmxlIiwidXBkYXRlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsU0FBUyxHQUFHQyxPQUFPLENBQUMsV0FBRCxDQUFQLENBQXFCQyxTQUF2Qzs7QUFFQSxJQUFNQyx5Q0FBeUMsR0FBRyxDQUFsRDtBQUNBLElBQU1DLCtCQUErQixHQUFHLElBQXhDO0FBQ0Es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O0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IE5vZGVFdmVudCA9IHJlcXVpcmUoJy4uL0NDTm9kZScpLkV2ZW50VHlwZTtcblxuY29uc3QgTlVNQkVSX09GX0dBVEhFUkVEX1RPVUNIRVNfRk9SX01PVkVfU1BFRUQgPSA1O1xuY29uc3QgT1VUX09GX0JPVU5EQVJZX0JSRUFLSU5HX0ZBQ1RPUiA9IDAuMDU7XG5jb25zdCBFUFNJTE9OID0gMWUtNDtcbmNvbnN0IE1PVkVNRU5UX0ZBQ1RPUiA9IDAuNztcblxubGV0IF90ZW1wUG9pbnQgPSBjYy52MigpO1xubGV0IF90ZW1wUHJldlBvaW50ID0gY2MudjIoKTtcblxubGV0IHF1aW50RWFzZU91dCA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICB0aW1lIC09IDE7XG4gICAgcmV0dXJuICh0aW1lICogdGltZSAqIHRpbWUgKiB0aW1lICogdGltZSArIDEpO1xufTtcblxubGV0IGdldFRpbWVJbk1pbGxpc2Vjb25kcyA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBjdXJyZW50VGltZSA9IG5ldyBEYXRlKCk7XG4gICAgcmV0dXJuIGN1cnJlbnRUaW1lLmdldE1pbGxpc2Vjb25kcygpO1xufTtcblxuLyoqXG4gKiAhI2VuIEVudW0gZm9yIFNjcm9sbFZpZXcgZXZlbnQgdHlwZS5cbiAqICEjemgg5rua5Yqo6KeG5Zu+5LqL5Lu257G75Z6LXG4gKiBAZW51bSBTY3JvbGxWaWV3LkV2ZW50VHlwZVxuICovXG5jb25zdCBFdmVudFR5cGUgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCBlbW1pdHRlZCB3aGVuIFNjcm9sbFZpZXcgc2Nyb2xsIHRvIHRoZSB0b3AgYm91bmRhcnkgb2YgaW5uZXIgY29udGFpbmVyXG4gICAgICogISN6aCDmu5rliqjop4blm77mu5rliqjliLDpobbpg6jovrnnlYzkuovku7ZcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU0NST0xMX1RPX1RPUFxuICAgICAqL1xuICAgIFNDUk9MTF9UT19UT1AgOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IGVtbWl0dGVkIHdoZW4gU2Nyb2xsVmlldyBzY3JvbGwgdG8gdGhlIGJvdHRvbSBib3VuZGFyeSBvZiBpbm5lciBjb250YWluZXJcbiAgICAgKiAhI3poIOa7muWKqOinhuWbvua7muWKqOWIsOW6lemDqOi+ueeVjOS6i+S7tlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTQ1JPTExfVE9fQk9UVE9NXG4gICAgICovXG4gICAgU0NST0xMX1RPX0JPVFRPTSA6IDEsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZXZlbnQgZW1taXR0ZWQgd2hlbiBTY3JvbGxWaWV3IHNjcm9sbCB0byB0aGUgbGVmdCBib3VuZGFyeSBvZiBpbm5lciBjb250YWluZXJcbiAgICAgKiAhI3poIOa7muWKqOinhuWbvua7muWKqOWIsOW3pui+ueeVjOS6i+S7tlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTQ1JPTExfVE9fTEVGVFxuICAgICAqL1xuICAgIFNDUk9MTF9UT19MRUZUIDogMixcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCBlbW1pdHRlZCB3aGVuIFNjcm9sbFZpZXcgc2Nyb2xsIHRvIHRoZSByaWdodCBib3VuZGFyeSBvZiBpbm5lciBjb250YWluZXJcbiAgICAgKiAhI3poIOa7muWKqOinhuWbvua7muWKqOWIsOWPs+i+ueeVjOS6i+S7tlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTQ1JPTExfVE9fUklHSFRcbiAgICAgKi9cbiAgICBTQ1JPTExfVE9fUklHSFQgOiAzLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IGVtbWl0dGVkIHdoZW4gU2Nyb2xsVmlldyBpcyBzY3JvbGxpbmdcbiAgICAgKiAhI3poIOa7muWKqOinhuWbvuato+WcqOa7muWKqOaXtuWPkeWHuueahOS6i+S7tlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTQ1JPTExJTkdcbiAgICAgKi9cbiAgICBTQ1JPTExJTkcgOiA0LFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IGVtbWl0dGVkIHdoZW4gU2Nyb2xsVmlldyBzY3JvbGwgdG8gdGhlIHRvcCBib3VuZGFyeSBvZiBpbm5lciBjb250YWluZXIgYW5kIHN0YXJ0IGJvdW5jZVxuICAgICAqICEjemgg5rua5Yqo6KeG5Zu+5rua5Yqo5Yiw6aG26YOo6L6555WM5bm25LiU5byA5aeL5Zue5by55pe25Y+R5Ye655qE5LqL5Lu2XG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEJPVU5DRV9UT1BcbiAgICAgKi9cbiAgICBCT1VOQ0VfVE9QIDogNSxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCBlbW1pdHRlZCB3aGVuIFNjcm9sbFZpZXcgc2Nyb2xsIHRvIHRoZSBib3R0b20gYm91bmRhcnkgb2YgaW5uZXIgY29udGFpbmVyIGFuZCBzdGFydCBib3VuY2VcbiAgICAgKiAhI3poIOa7muWKqOinhuWbvua7muWKqOWIsOW6lemDqOi+ueeVjOW5tuS4lOW8gOWni+WbnuW8ueaXtuWPkeWHuueahOS6i+S7tlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBCT1VOQ0VfQk9UVE9NXG4gICAgICovXG4gICAgQk9VTkNFX0JPVFRPTSA6IDYsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZXZlbnQgZW1taXR0ZWQgd2hlbiBTY3JvbGxWaWV3IHNjcm9sbCB0byB0aGUgbGVmdCBib3VuZGFyeSBvZiBpbm5lciBjb250YWluZXIgYW5kIHN0YXJ0IGJvdW5jZVxuICAgICAqICEjemgg5rua5Yqo6KeG5Zu+5rua5Yqo5Yiw5bem6L6555WM5bm25LiU5byA5aeL5Zue5by55pe25Y+R5Ye655qE5LqL5Lu2XG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEJPVU5DRV9MRUZUXG4gICAgICovXG4gICAgQk9VTkNFX0xFRlQgOiA3LFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IGVtbWl0dGVkIHdoZW4gU2Nyb2xsVmlldyBzY3JvbGwgdG8gdGhlIHJpZ2h0IGJvdW5kYXJ5IG9mIGlubmVyIGNvbnRhaW5lciBhbmQgc3RhcnQgYm91bmNlXG4gICAgICogISN6aCDmu5rliqjop4blm77mu5rliqjliLDlj7PovrnnlYzlubbkuJTlvIDlp4vlm57lvLnml7blj5Hlh7rnmoTkuovku7ZcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gQk9VTkNFX1JJR0hUXG4gICAgICovXG4gICAgQk9VTkNFX1JJR0hUIDogOCxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCBlbW1pdHRlZCB3aGVuIFNjcm9sbFZpZXcgYXV0byBzY3JvbGwgZW5kZWRcbiAgICAgKiAhI3poIOa7muWKqOinhuWbvua7muWKqOe7k+adn+eahOaXtuWAmeWPkeWHuueahOS6i+S7tlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTQ1JPTExfRU5ERURcbiAgICAgKi9cbiAgICBTQ1JPTExfRU5ERUQgOiA5LFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IGVtbWl0dGVkIHdoZW4gdXNlciByZWxlYXNlIHRoZSB0b3VjaFxuICAgICAqICEjemgg5b2T55So5oi35p2+5omL55qE5pe25YCZ5Lya5Y+R5Ye65LiA5Liq5LqL5Lu2XG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFRPVUNIX1VQXG4gICAgICovXG4gICAgVE9VQ0hfVVAgOiAxMCxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCBlbW1pdHRlZCB3aGVuIFNjcm9sbFZpZXcgYXV0byBzY3JvbGwgZW5kZWQgd2l0aCBhIHRocmVzaG9sZFxuICAgICAqICEjemgg5rua5Yqo6KeG5Zu+6Ieq5Yqo5rua5Yqo5b+r6KaB57uT5p2f55qE5pe25YCZ5Y+R5Ye655qE5LqL5Lu2XG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEFVVE9TQ1JPTExfRU5ERURfV0lUSF9USFJFU0hPTERcbiAgICAgKi9cbiAgICBBVVRPU0NST0xMX0VOREVEX1dJVEhfVEhSRVNIT0xEOiAxMSxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCBlbW1pdHRlZCB3aGVuIFNjcm9sbFZpZXcgc2Nyb2xsIGJlZ2FuXG4gICAgICogISN6aCDmu5rliqjop4blm77mu5rliqjlvIDlp4vml7blj5Hlh7rnmoTkuovku7ZcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU0NST0xMX0JFR0FOXG4gICAgICovXG4gICAgU0NST0xMX0JFR0FOOiAxMlxufSk7XG5cbmNvbnN0IGV2ZW50TWFwID0ge1xuICAgICdzY3JvbGwtdG8tdG9wJyA6IEV2ZW50VHlwZS5TQ1JPTExfVE9fVE9QLFxuICAgICdzY3JvbGwtdG8tYm90dG9tJzogRXZlbnRUeXBlLlNDUk9MTF9UT19CT1RUT00sXG4gICAgJ3Njcm9sbC10by1sZWZ0JyA6IEV2ZW50VHlwZS5TQ1JPTExfVE9fTEVGVCxcbiAgICAnc2Nyb2xsLXRvLXJpZ2h0JyA6IEV2ZW50VHlwZS5TQ1JPTExfVE9fUklHSFQsXG4gICAgJ3Njcm9sbGluZycgOiBFdmVudFR5cGUuU0NST0xMSU5HLFxuICAgICdib3VuY2UtYm90dG9tJyA6IEV2ZW50VHlwZS5CT1VOQ0VfQk9UVE9NLFxuICAgICdib3VuY2UtbGVmdCcgOiBFdmVudFR5cGUuQk9VTkNFX0xFRlQsXG4gICAgJ2JvdW5jZS1yaWdodCcgOiBFdmVudFR5cGUuQk9VTkNFX1JJR0hULFxuICAgICdib3VuY2UtdG9wJyA6IEV2ZW50VHlwZS5CT1VOQ0VfVE9QLFxuICAgICdzY3JvbGwtZW5kZWQnOiBFdmVudFR5cGUuU0NST0xMX0VOREVELFxuICAgICd0b3VjaC11cCcgOiBFdmVudFR5cGUuVE9VQ0hfVVAsXG4gICAgJ3Njcm9sbC1lbmRlZC13aXRoLXRocmVzaG9sZCcgOiBFdmVudFR5cGUuQVVUT1NDUk9MTF9FTkRFRF9XSVRIX1RIUkVTSE9MRCxcbiAgICAnc2Nyb2xsLWJlZ2FuJzogRXZlbnRUeXBlLlNDUk9MTF9CRUdBTlxufTtcblxuLyoqXG4gKiAhI2VuXG4gKiBMYXlvdXQgY29udGFpbmVyIGZvciBhIHZpZXcgaGllcmFyY2h5IHRoYXQgY2FuIGJlIHNjcm9sbGVkIGJ5IHRoZSB1c2VyLFxuICogYWxsb3dpbmcgaXQgdG8gYmUgbGFyZ2VyIHRoYW4gdGhlIHBoeXNpY2FsIGRpc3BsYXkuXG4gKlxuICogISN6aFxuICog5rua5Yqo6KeG5Zu+57uE5Lu2XG4gKiBAY2xhc3MgU2Nyb2xsVmlld1xuICogQGV4dGVuZHMgQ29tcG9uZW50XG4gKi9cbmxldCBTY3JvbGxWaWV3ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5TY3JvbGxWaWV3JyxcbiAgICBleHRlbmRzOiByZXF1aXJlKCcuL0NDVmlld0dyb3VwJyksXG5cbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQudWkvU2Nyb2xsVmlldycsXG4gICAgICAgIGhlbHA6ICdpMThuOkNPTVBPTkVOVC5oZWxwX3VybC5zY3JvbGx2aWV3JyxcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9zY3JvbGx2aWV3LmpzJyxcbiAgICAgICAgZXhlY3V0ZUluRWRpdE1vZGU6IGZhbHNlLFxuICAgIH0sXG5cbiAgICBjdG9yICgpIHtcbiAgICAgICAgdGhpcy5fdG9wQm91bmRhcnkgPSAwO1xuICAgICAgICB0aGlzLl9ib3R0b21Cb3VuZGFyeSA9IDA7XG4gICAgICAgIHRoaXMuX2xlZnRCb3VuZGFyeSA9IDA7XG4gICAgICAgIHRoaXMuX3JpZ2h0Qm91bmRhcnkgPSAwO1xuXG4gICAgICAgIHRoaXMuX3RvdWNoTW92ZURpc3BsYWNlbWVudHMgPSBbXTtcbiAgICAgICAgdGhpcy5fdG91Y2hNb3ZlVGltZURlbHRhcyA9IFtdO1xuICAgICAgICB0aGlzLl90b3VjaE1vdmVQcmV2aW91c1RpbWVzdGFtcCA9IDA7XG4gICAgICAgIHRoaXMuX3RvdWNoTW92ZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2F1dG9TY3JvbGxBdHRlbnVhdGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbFN0YXJ0UG9zaXRpb24gPSBjYy52MigwLCAwKTtcbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbFRhcmdldERlbHRhID0gY2MudjIoMCwgMCk7XG4gICAgICAgIHRoaXMuX2F1dG9TY3JvbGxUb3RhbFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsQWNjdW11bGF0ZWRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbEN1cnJlbnRseU91dE9mQm91bmRhcnkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbEJyYWtpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbEJyYWtpbmdTdGFydFBvc2l0aW9uID0gY2MudjIoMCwgMCk7XG5cbiAgICAgICAgdGhpcy5fb3V0T2ZCb3VuZGFyeUFtb3VudCA9IGNjLnYyKDAsIDApO1xuICAgICAgICB0aGlzLl9vdXRPZkJvdW5kYXJ5QW1vdW50RGlydHkgPSB0cnVlO1xuICAgICAgICB0aGlzLl9zdG9wTW91c2VXaGVlbCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9tb3VzZVdoZWVsRXZlbnRFbGFwc2VkVGltZSA9IDAuMDtcbiAgICAgICAgdGhpcy5faXNTY3JvbGxFbmRlZFdpdGhUaHJlc2hvbGRFdmVudEZpcmVkID0gZmFsc2U7XG4gICAgICAgIC8vdXNlIGJpdCB3aXNlIG9wZXJhdGlvbnMgdG8gaW5kaWNhdGUgdGhlIGRpcmVjdGlvblxuICAgICAgICB0aGlzLl9zY3JvbGxFdmVudEVtaXRNYXNrID0gMDtcbiAgICAgICAgdGhpcy5faXNCb3VuY2luZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9zY3JvbGxpbmcgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGlzIGlzIGEgcmVmZXJlbmNlIHRvIHRoZSBVSSBlbGVtZW50IHRvIGJlIHNjcm9sbGVkLlxuICAgICAgICAgKiAhI3poIOWPr+a7muWKqOWxleekuuWGheWuueeahOiKgueCueOAglxuICAgICAgICAgKiBAcHJvcGVydHkge05vZGV9IGNvbnRlbnRcbiAgICAgICAgICovXG4gICAgICAgIGNvbnRlbnQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGUsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNjcm9sbHZpZXcuY29udGVudCcsXG4gICAgICAgICAgICBmb3JtZXJseVNlcmlhbGl6ZWRBczogJ2NvbnRlbnQnLFxuICAgICAgICAgICAgbm90aWZ5IChvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZUJvdW5kYXJ5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gRW5hYmxlIGhvcml6b250YWwgc2Nyb2xsLlxuICAgICAgICAgKiAhI3poIOaYr+WQpuW8gOWQr+awtOW5s+a7muWKqOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGhvcml6b250YWxcbiAgICAgICAgICovXG4gICAgICAgIGhvcml6b250YWw6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuc2Nyb2xsdmlldy5ob3Jpem9udGFsJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBFbmFibGUgdmVydGljYWwgc2Nyb2xsLlxuICAgICAgICAgKiAhI3poIOaYr+WQpuW8gOWQr+WeguebtOa7muWKqOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IHZlcnRpY2FsXG4gICAgICAgICAqL1xuICAgICAgICB2ZXJ0aWNhbDoge1xuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zY3JvbGx2aWV3LnZlcnRpY2FsJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBXaGVuIGluZXJ0aWEgaXMgc2V0LCB0aGUgY29udGVudCB3aWxsIGNvbnRpbnVlIHRvIG1vdmUgd2hlbiB0b3VjaCBlbmRlZC5cbiAgICAgICAgICogISN6aCDmmK/lkKblvIDlkK/mu5rliqjmg6/mgKfjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBpbmVydGlhXG4gICAgICAgICAqL1xuICAgICAgICBpbmVydGlhOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zY3JvbGx2aWV3LmluZXJ0aWEnLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIEl0IGRldGVybWluZXMgaG93IHF1aWNrbHkgdGhlIGNvbnRlbnQgc3RvcCBtb3ZpbmcuIEEgdmFsdWUgb2YgMSB3aWxsIHN0b3AgdGhlIG1vdmVtZW50IGltbWVkaWF0ZWx5LlxuICAgICAgICAgKiBBIHZhbHVlIG9mIDAgd2lsbCBuZXZlciBzdG9wIHRoZSBtb3ZlbWVudCB1bnRpbCBpdCByZWFjaGVzIHRvIHRoZSBib3VuZGFyeSBvZiBzY3JvbGx2aWV3LlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOW8gOWQr+aDr+aAp+WQju+8jOWcqOeUqOaIt+WBnOatouinpuaRuOWQjua7muWKqOWkmuW/q+WBnOatou+8jDDooajnpLrmsLjkuI3lgZzmraLvvIwx6KGo56S656uL5Yi75YGc5q2i44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBicmFrZVxuICAgICAgICAgKi9cbiAgICAgICAgYnJha2U6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAuNSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkZsb2F0LFxuICAgICAgICAgICAgcmFuZ2U6IFswLCAxLCAwLjFdLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zY3JvbGx2aWV3LmJyYWtlJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBXaGVuIGVsYXN0aWMgaXMgc2V0LCB0aGUgY29udGVudCB3aWxsIGJlIGJvdW5jZSBiYWNrIHdoZW4gbW92ZSBvdXQgb2YgYm91bmRhcnkuXG4gICAgICAgICAqICEjemgg5piv5ZCm5YWB6K645rua5Yqo5YaF5a656LaF6L+H6L6555WM77yM5bm25Zyo5YGc5q2i6Kem5pG45ZCO5Zue5by544CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZWxhc3RpY1xuICAgICAgICAgKi9cbiAgICAgICAgZWxhc3RpYzoge1xuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zY3JvbGx2aWV3LmVsYXN0aWMnLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBlbGFwc2UgdGltZSBvZiBib3VuY2luZyBiYWNrLiBBIHZhbHVlIG9mIDAgd2lsbCBib3VuY2UgYmFjayBpbW1lZGlhdGVseS5cbiAgICAgICAgICogISN6aCDlm57lvLnmjIHnu63nmoTml7bpl7TvvIwwIOihqOekuuWwhueri+WNs+WPjeW8ueOAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gYm91bmNlRHVyYXRpb25cbiAgICAgICAgICovXG4gICAgICAgIGJvdW5jZUR1cmF0aW9uOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAxLFxuICAgICAgICAgICAgcmFuZ2U6IFswLCAxMF0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNjcm9sbHZpZXcuYm91bmNlRHVyYXRpb24nLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBob3Jpem9udGFsIHNjcm9sbGJhciByZWZlcmVuY2UuXG4gICAgICAgICAqICEjemgg5rC05bmz5rua5Yqo55qEIFNjcm9sbEJhcuOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1Njcm9sbGJhcn0gaG9yaXpvbnRhbFNjcm9sbEJhclxuICAgICAgICAgKi9cbiAgICAgICAgaG9yaXpvbnRhbFNjcm9sbEJhcjoge1xuICAgICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdHlwZTogY2MuU2Nyb2xsYmFyLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zY3JvbGx2aWV3Lmhvcml6b250YWxfYmFyJyxcbiAgICAgICAgICAgIG5vdGlmeSAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaG9yaXpvbnRhbFNjcm9sbEJhcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvcml6b250YWxTY3JvbGxCYXIuc2V0VGFyZ2V0U2Nyb2xsVmlldyh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlU2Nyb2xsQmFyKDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSB2ZXJ0aWNhbCBzY3JvbGxiYXIgcmVmZXJlbmNlLlxuICAgICAgICAgKiAhI3poIOWeguebtOa7muWKqOeahCBTY3JvbGxCYXLjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtTY3JvbGxiYXJ9IHZlcnRpY2FsU2Nyb2xsQmFyXG4gICAgICAgICAqL1xuICAgICAgICB2ZXJ0aWNhbFNjcm9sbEJhcjoge1xuICAgICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdHlwZTogY2MuU2Nyb2xsYmFyLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zY3JvbGx2aWV3LnZlcnRpY2FsX2JhcicsXG4gICAgICAgICAgICBub3RpZnkgKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZlcnRpY2FsU2Nyb2xsQmFyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGljYWxTY3JvbGxCYXIuc2V0VGFyZ2V0U2Nyb2xsVmlldyh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlU2Nyb2xsQmFyKDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFNjcm9sbHZpZXcgZXZlbnRzIGNhbGxiYWNrXG4gICAgICAgICAqICEjemgg5rua5Yqo6KeG5Zu+55qE5LqL5Lu25Zue6LCD5Ye95pWwXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Q29tcG9uZW50LkV2ZW50SGFuZGxlcltdfSBzY3JvbGxFdmVudHNcbiAgICAgICAgICovXG4gICAgICAgIHNjcm9sbEV2ZW50czoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zY3JvbGx2aWV3LnNjcm9sbEV2ZW50cydcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBJZiBjYW5jZWxJbm5lckV2ZW50cyBpcyBzZXQgdG8gdHJ1ZSwgdGhlIHNjcm9sbCBiZWhhdmlvciB3aWxsIGNhbmNlbCB0b3VjaCBldmVudHMgb24gaW5uZXIgY29udGVudCBub2Rlc1xuICAgICAgICAgKiBJdCdzIHNldCB0byB0cnVlIGJ5IGRlZmF1bHQuXG4gICAgICAgICAqICEjemgg5aaC5p6c6L+Z5Liq5bGe5oCn6KKr6K6+572u5Li6IHRydWXvvIzpgqPkuYjmu5rliqjooYzkuLrkvJrlj5bmtojlrZDoioLngrnkuIrms6jlhoznmoTop6bmkbjkuovku7bvvIzpu5jorqTooqvorr7nva7kuLogdHJ1ZeOAglxuICAgICAgICAgKiDms6jmhI/vvIzlrZDoioLngrnkuIrnmoQgdG91Y2hzdGFydCDkuovku7bku43nhLbkvJrop6blj5HvvIzop6bngrnnp7vliqjot53nprvpnZ7luLjnn63nmoTmg4XlhrXkuIsgdG91Y2htb3ZlIOWSjCB0b3VjaGVuZCDkuZ/kuI3kvJrlj5flvbHlk43jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBjYW5jZWxJbm5lckV2ZW50c1xuICAgICAgICAgKi9cbiAgICAgICAgY2FuY2VsSW5uZXJFdmVudHM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuc2Nyb2xsdmlldy5jYW5jZWxJbm5lckV2ZW50cydcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBwcml2YXRlIG9iamVjdFxuICAgICAgICBfdmlldzoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udGVudCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50LnBhcmVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICBFdmVudFR5cGU6IEV2ZW50VHlwZSxcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTY3JvbGwgdGhlIGNvbnRlbnQgdG8gdGhlIGJvdHRvbSBib3VuZGFyeSBvZiBTY3JvbGxWaWV3LlxuICAgICAqICEjemgg6KeG5Zu+5YaF5a655bCG5Zyo6KeE5a6a5pe26Ze05YaF5rua5Yqo5Yiw6KeG5Zu+5bqV6YOo44CCXG4gICAgICogQG1ldGhvZCBzY3JvbGxUb0JvdHRvbVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbdGltZUluU2Vjb25kPTBdIC0gU2Nyb2xsIHRpbWUgaW4gc2Vjb25kLCBpZiB5b3UgZG9uJ3QgcGFzcyB0aW1lSW5TZWNvbmQsXG4gICAgICogdGhlIGNvbnRlbnQgd2lsbCBqdW1wIHRvIHRoZSBib3R0b20gYm91bmRhcnkgaW1tZWRpYXRlbHkuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbYXR0ZW51YXRlZD10cnVlXSAtIFdoZXRoZXIgdGhlIHNjcm9sbCBhY2NlbGVyYXRpb24gYXR0ZW51YXRlZCwgZGVmYXVsdCBpcyB0cnVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gU2Nyb2xsIHRvIHRoZSBib3R0b20gb2YgdGhlIHZpZXcuXG4gICAgICogc2Nyb2xsVmlldy5zY3JvbGxUb0JvdHRvbSgwLjEpO1xuICAgICAqL1xuICAgIHNjcm9sbFRvQm90dG9tICh0aW1lSW5TZWNvbmQsIGF0dGVudWF0ZWQpIHtcbiAgICAgICAgbGV0IG1vdmVEZWx0YSA9IHRoaXMuX2NhbGN1bGF0ZU1vdmVQZXJjZW50RGVsdGEoe1xuICAgICAgICAgICAgYW5jaG9yOiBjYy52MigwLCAwKSxcbiAgICAgICAgICAgIGFwcGx5VG9Ib3Jpem9udGFsOiBmYWxzZSxcbiAgICAgICAgICAgIGFwcGx5VG9WZXJ0aWNhbDogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRpbWVJblNlY29uZCkge1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRBdXRvU2Nyb2xsKG1vdmVEZWx0YSwgdGltZUluU2Vjb25kLCBhdHRlbnVhdGVkICE9PSBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlQ29udGVudChtb3ZlRGVsdGEsIHRydWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2Nyb2xsIHRoZSBjb250ZW50IHRvIHRoZSB0b3AgYm91bmRhcnkgb2YgU2Nyb2xsVmlldy5cbiAgICAgKiAhI3poIOinhuWbvuWGheWuueWwhuWcqOinhOWumuaXtumXtOWGhea7muWKqOWIsOinhuWbvumhtumDqOOAglxuICAgICAqIEBtZXRob2Qgc2Nyb2xsVG9Ub3BcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3RpbWVJblNlY29uZD0wXSAtIFNjcm9sbCB0aW1lIGluIHNlY29uZCwgaWYgeW91IGRvbid0IHBhc3MgdGltZUluU2Vjb25kLFxuICAgICAqIHRoZSBjb250ZW50IHdpbGwganVtcCB0byB0aGUgdG9wIGJvdW5kYXJ5IGltbWVkaWF0ZWx5LlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2F0dGVudWF0ZWQ9dHJ1ZV0gLSBXaGV0aGVyIHRoZSBzY3JvbGwgYWNjZWxlcmF0aW9uIGF0dGVudWF0ZWQsIGRlZmF1bHQgaXMgdHJ1ZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vIFNjcm9sbCB0byB0aGUgdG9wIG9mIHRoZSB2aWV3LlxuICAgICAqIHNjcm9sbFZpZXcuc2Nyb2xsVG9Ub3AoMC4xKTtcbiAgICAgKi9cbiAgICBzY3JvbGxUb1RvcCAodGltZUluU2Vjb25kLCBhdHRlbnVhdGVkKSB7XG4gICAgICAgIGxldCBtb3ZlRGVsdGEgPSB0aGlzLl9jYWxjdWxhdGVNb3ZlUGVyY2VudERlbHRhKHtcbiAgICAgICAgICAgIGFuY2hvcjogY2MudjIoMCwgMSksXG4gICAgICAgICAgICBhcHBseVRvSG9yaXpvbnRhbDogZmFsc2UsXG4gICAgICAgICAgICBhcHBseVRvVmVydGljYWw6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aW1lSW5TZWNvbmQpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0QXV0b1Njcm9sbChtb3ZlRGVsdGEsIHRpbWVJblNlY29uZCwgYXR0ZW51YXRlZCAhPT0gZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbW92ZUNvbnRlbnQobW92ZURlbHRhKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNjcm9sbCB0aGUgY29udGVudCB0byB0aGUgbGVmdCBib3VuZGFyeSBvZiBTY3JvbGxWaWV3LlxuICAgICAqICEjemgg6KeG5Zu+5YaF5a655bCG5Zyo6KeE5a6a5pe26Ze05YaF5rua5Yqo5Yiw6KeG5Zu+5bem6L6544CCXG4gICAgICogQG1ldGhvZCBzY3JvbGxUb0xlZnRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3RpbWVJblNlY29uZD0wXSAtIFNjcm9sbCB0aW1lIGluIHNlY29uZCwgaWYgeW91IGRvbid0IHBhc3MgdGltZUluU2Vjb25kLFxuICAgICAqIHRoZSBjb250ZW50IHdpbGwganVtcCB0byB0aGUgbGVmdCBib3VuZGFyeSBpbW1lZGlhdGVseS5cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFthdHRlbnVhdGVkPXRydWVdIC0gV2hldGhlciB0aGUgc2Nyb2xsIGFjY2VsZXJhdGlvbiBhdHRlbnVhdGVkLCBkZWZhdWx0IGlzIHRydWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyBTY3JvbGwgdG8gdGhlIGxlZnQgb2YgdGhlIHZpZXcuXG4gICAgICogc2Nyb2xsVmlldy5zY3JvbGxUb0xlZnQoMC4xKTtcbiAgICAgKi9cbiAgICBzY3JvbGxUb0xlZnQgKHRpbWVJblNlY29uZCwgYXR0ZW51YXRlZCkge1xuICAgICAgICBsZXQgbW92ZURlbHRhID0gdGhpcy5fY2FsY3VsYXRlTW92ZVBlcmNlbnREZWx0YSh7XG4gICAgICAgICAgICBhbmNob3I6IGNjLnYyKDAsIDApLFxuICAgICAgICAgICAgYXBwbHlUb0hvcml6b250YWw6IHRydWUsXG4gICAgICAgICAgICBhcHBseVRvVmVydGljYWw6IGZhbHNlLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGltZUluU2Vjb25kKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGFydEF1dG9TY3JvbGwobW92ZURlbHRhLCB0aW1lSW5TZWNvbmQsIGF0dGVudWF0ZWQgIT09IGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX21vdmVDb250ZW50KG1vdmVEZWx0YSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTY3JvbGwgdGhlIGNvbnRlbnQgdG8gdGhlIHJpZ2h0IGJvdW5kYXJ5IG9mIFNjcm9sbFZpZXcuXG4gICAgICogISN6aCDop4blm77lhoXlrrnlsIblnKjop4Tlrprml7bpl7TlhoXmu5rliqjliLDop4blm77lj7PovrnjgIJcbiAgICAgKiBAbWV0aG9kIHNjcm9sbFRvUmlnaHRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3RpbWVJblNlY29uZD0wXSAtIFNjcm9sbCB0aW1lIGluIHNlY29uZCwgaWYgeW91IGRvbid0IHBhc3MgdGltZUluU2Vjb25kLFxuICAgICAqIHRoZSBjb250ZW50IHdpbGwganVtcCB0byB0aGUgcmlnaHQgYm91bmRhcnkgaW1tZWRpYXRlbHkuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbYXR0ZW51YXRlZD10cnVlXSAtIFdoZXRoZXIgdGhlIHNjcm9sbCBhY2NlbGVyYXRpb24gYXR0ZW51YXRlZCwgZGVmYXVsdCBpcyB0cnVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gU2Nyb2xsIHRvIHRoZSByaWdodCBvZiB0aGUgdmlldy5cbiAgICAgKiBzY3JvbGxWaWV3LnNjcm9sbFRvUmlnaHQoMC4xKTtcbiAgICAgKi9cbiAgICBzY3JvbGxUb1JpZ2h0ICh0aW1lSW5TZWNvbmQsIGF0dGVudWF0ZWQpIHtcbiAgICAgICAgbGV0IG1vdmVEZWx0YSA9IHRoaXMuX2NhbGN1bGF0ZU1vdmVQZXJjZW50RGVsdGEoe1xuICAgICAgICAgICAgYW5jaG9yOiBjYy52MigxLCAwKSxcbiAgICAgICAgICAgIGFwcGx5VG9Ib3Jpem9udGFsOiB0cnVlLFxuICAgICAgICAgICAgYXBwbHlUb1ZlcnRpY2FsOiBmYWxzZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRpbWVJblNlY29uZCkge1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRBdXRvU2Nyb2xsKG1vdmVEZWx0YSwgdGltZUluU2Vjb25kLCBhdHRlbnVhdGVkICE9PSBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlQ29udGVudChtb3ZlRGVsdGEpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2Nyb2xsIHRoZSBjb250ZW50IHRvIHRoZSB0b3AgbGVmdCBib3VuZGFyeSBvZiBTY3JvbGxWaWV3LlxuICAgICAqICEjemgg6KeG5Zu+5YaF5a655bCG5Zyo6KeE5a6a5pe26Ze05YaF5rua5Yqo5Yiw6KeG5Zu+5bem5LiK6KeS44CCXG4gICAgICogQG1ldGhvZCBzY3JvbGxUb1RvcExlZnRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3RpbWVJblNlY29uZD0wXSAtIFNjcm9sbCB0aW1lIGluIHNlY29uZCwgaWYgeW91IGRvbid0IHBhc3MgdGltZUluU2Vjb25kLFxuICAgICAqIHRoZSBjb250ZW50IHdpbGwganVtcCB0byB0aGUgdG9wIGxlZnQgYm91bmRhcnkgaW1tZWRpYXRlbHkuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbYXR0ZW51YXRlZD10cnVlXSAtIFdoZXRoZXIgdGhlIHNjcm9sbCBhY2NlbGVyYXRpb24gYXR0ZW51YXRlZCwgZGVmYXVsdCBpcyB0cnVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gU2Nyb2xsIHRvIHRoZSB1cHBlciBsZWZ0IGNvcm5lciBvZiB0aGUgdmlldy5cbiAgICAgKiBzY3JvbGxWaWV3LnNjcm9sbFRvVG9wTGVmdCgwLjEpO1xuICAgICAqL1xuICAgIHNjcm9sbFRvVG9wTGVmdCAodGltZUluU2Vjb25kLCBhdHRlbnVhdGVkKSB7XG4gICAgICAgIGxldCBtb3ZlRGVsdGEgPSB0aGlzLl9jYWxjdWxhdGVNb3ZlUGVyY2VudERlbHRhKHtcbiAgICAgICAgICAgIGFuY2hvcjogY2MudjIoMCwgMSksXG4gICAgICAgICAgICBhcHBseVRvSG9yaXpvbnRhbDogdHJ1ZSxcbiAgICAgICAgICAgIGFwcGx5VG9WZXJ0aWNhbDogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRpbWVJblNlY29uZCkge1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRBdXRvU2Nyb2xsKG1vdmVEZWx0YSwgdGltZUluU2Vjb25kLCBhdHRlbnVhdGVkICE9PSBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlQ29udGVudChtb3ZlRGVsdGEpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2Nyb2xsIHRoZSBjb250ZW50IHRvIHRoZSB0b3AgcmlnaHQgYm91bmRhcnkgb2YgU2Nyb2xsVmlldy5cbiAgICAgKiAhI3poIOinhuWbvuWGheWuueWwhuWcqOinhOWumuaXtumXtOWGhea7muWKqOWIsOinhuWbvuWPs+S4iuinkuOAglxuICAgICAqIEBtZXRob2Qgc2Nyb2xsVG9Ub3BSaWdodFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbdGltZUluU2Vjb25kPTBdIC0gU2Nyb2xsIHRpbWUgaW4gc2Vjb25kLCBpZiB5b3UgZG9uJ3QgcGFzcyB0aW1lSW5TZWNvbmQsXG4gICAgICogdGhlIGNvbnRlbnQgd2lsbCBqdW1wIHRvIHRoZSB0b3AgcmlnaHQgYm91bmRhcnkgaW1tZWRpYXRlbHkuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbYXR0ZW51YXRlZD10cnVlXSAtIFdoZXRoZXIgdGhlIHNjcm9sbCBhY2NlbGVyYXRpb24gYXR0ZW51YXRlZCwgZGVmYXVsdCBpcyB0cnVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gU2Nyb2xsIHRvIHRoZSB0b3AgcmlnaHQgY29ybmVyIG9mIHRoZSB2aWV3LlxuICAgICAqIHNjcm9sbFZpZXcuc2Nyb2xsVG9Ub3BSaWdodCgwLjEpO1xuICAgICAqL1xuICAgIHNjcm9sbFRvVG9wUmlnaHQgKHRpbWVJblNlY29uZCwgYXR0ZW51YXRlZCkge1xuICAgICAgICBsZXQgbW92ZURlbHRhID0gdGhpcy5fY2FsY3VsYXRlTW92ZVBlcmNlbnREZWx0YSh7XG4gICAgICAgICAgICBhbmNob3I6IGNjLnYyKDEsIDEpLFxuICAgICAgICAgICAgYXBwbHlUb0hvcml6b250YWw6IHRydWUsXG4gICAgICAgICAgICBhcHBseVRvVmVydGljYWw6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aW1lSW5TZWNvbmQpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0QXV0b1Njcm9sbChtb3ZlRGVsdGEsIHRpbWVJblNlY29uZCwgYXR0ZW51YXRlZCAhPT0gZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbW92ZUNvbnRlbnQobW92ZURlbHRhKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNjcm9sbCB0aGUgY29udGVudCB0byB0aGUgYm90dG9tIGxlZnQgYm91bmRhcnkgb2YgU2Nyb2xsVmlldy5cbiAgICAgKiAhI3poIOinhuWbvuWGheWuueWwhuWcqOinhOWumuaXtumXtOWGhea7muWKqOWIsOinhuWbvuW3puS4i+inkuOAglxuICAgICAqIEBtZXRob2Qgc2Nyb2xsVG9Cb3R0b21MZWZ0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFt0aW1lSW5TZWNvbmQ9MF0gLSBTY3JvbGwgdGltZSBpbiBzZWNvbmQsIGlmIHlvdSBkb24ndCBwYXNzIHRpbWVJblNlY29uZCxcbiAgICAgKiB0aGUgY29udGVudCB3aWxsIGp1bXAgdG8gdGhlIGJvdHRvbSBsZWZ0IGJvdW5kYXJ5IGltbWVkaWF0ZWx5LlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2F0dGVudWF0ZWQ9dHJ1ZV0gLSBXaGV0aGVyIHRoZSBzY3JvbGwgYWNjZWxlcmF0aW9uIGF0dGVudWF0ZWQsIGRlZmF1bHQgaXMgdHJ1ZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vIFNjcm9sbCB0byB0aGUgbG93ZXIgbGVmdCBjb3JuZXIgb2YgdGhlIHZpZXcuXG4gICAgICogc2Nyb2xsVmlldy5zY3JvbGxUb0JvdHRvbUxlZnQoMC4xKTtcbiAgICAgKi9cbiAgICBzY3JvbGxUb0JvdHRvbUxlZnQgKHRpbWVJblNlY29uZCwgYXR0ZW51YXRlZCkge1xuICAgICAgICBsZXQgbW92ZURlbHRhID0gdGhpcy5fY2FsY3VsYXRlTW92ZVBlcmNlbnREZWx0YSh7XG4gICAgICAgICAgICBhbmNob3I6IGNjLnYyKDAsIDApLFxuICAgICAgICAgICAgYXBwbHlUb0hvcml6b250YWw6IHRydWUsXG4gICAgICAgICAgICBhcHBseVRvVmVydGljYWw6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aW1lSW5TZWNvbmQpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0QXV0b1Njcm9sbChtb3ZlRGVsdGEsIHRpbWVJblNlY29uZCwgYXR0ZW51YXRlZCAhPT0gZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbW92ZUNvbnRlbnQobW92ZURlbHRhKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNjcm9sbCB0aGUgY29udGVudCB0byB0aGUgYm90dG9tIHJpZ2h0IGJvdW5kYXJ5IG9mIFNjcm9sbFZpZXcuXG4gICAgICogISN6aCDop4blm77lhoXlrrnlsIblnKjop4Tlrprml7bpl7TlhoXmu5rliqjliLDop4blm77lj7PkuIvop5LjgIJcbiAgICAgKiBAbWV0aG9kIHNjcm9sbFRvQm90dG9tUmlnaHRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3RpbWVJblNlY29uZD0wXSAtIFNjcm9sbCB0aW1lIGluIHNlY29uZCwgaWYgeW91IGRvbid0IHBhc3MgdGltZUluU2Vjb25kLFxuICAgICAqIHRoZSBjb250ZW50IHdpbGwganVtcCB0byB0aGUgYm90dG9tIHJpZ2h0IGJvdW5kYXJ5IGltbWVkaWF0ZWx5LlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2F0dGVudWF0ZWQ9dHJ1ZV0gLSBXaGV0aGVyIHRoZSBzY3JvbGwgYWNjZWxlcmF0aW9uIGF0dGVudWF0ZWQsIGRlZmF1bHQgaXMgdHJ1ZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vIFNjcm9sbCB0byB0aGUgbG93ZXIgcmlnaHQgY29ybmVyIG9mIHRoZSB2aWV3LlxuICAgICAqIHNjcm9sbFZpZXcuc2Nyb2xsVG9Cb3R0b21SaWdodCgwLjEpO1xuICAgICAqL1xuICAgIHNjcm9sbFRvQm90dG9tUmlnaHQgKHRpbWVJblNlY29uZCwgYXR0ZW51YXRlZCkge1xuICAgICAgICBsZXQgbW92ZURlbHRhID0gdGhpcy5fY2FsY3VsYXRlTW92ZVBlcmNlbnREZWx0YSh7XG4gICAgICAgICAgICBhbmNob3I6IGNjLnYyKDEsIDApLFxuICAgICAgICAgICAgYXBwbHlUb0hvcml6b250YWw6IHRydWUsXG4gICAgICAgICAgICBhcHBseVRvVmVydGljYWw6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aW1lSW5TZWNvbmQpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0QXV0b1Njcm9sbChtb3ZlRGVsdGEsIHRpbWVJblNlY29uZCwgYXR0ZW51YXRlZCAhPT0gZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbW92ZUNvbnRlbnQobW92ZURlbHRhKTtcbiAgICAgICAgfVxuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqICEjZW4gU2Nyb2xsIHdpdGggYW4gb2Zmc2V0IHJlbGF0ZWQgdG8gdGhlIFNjcm9sbFZpZXcncyB0b3AgbGVmdCBvcmlnaW4sIGlmIHRpbWVJblNlY29uZCBpcyBvbWl0dGVkLCB0aGVuIGl0IHdpbGwganVtcCB0byB0aGVcbiAgICAgKiAgICAgICBzcGVjaWZpYyBvZmZzZXQgaW1tZWRpYXRlbHkuXG4gICAgICogISN6aCDop4blm77lhoXlrrnlnKjop4Tlrprml7bpl7TlhoXlsIbmu5rliqjliLAgU2Nyb2xsVmlldyDnm7jlr7nlt6bkuIrop5Lljp/ngrnnmoTlgY/np7vkvY3nva4sIOWmguaenCB0aW1lSW5TZWNvbmTlj4LmlbDkuI3kvKDvvIzliJnnq4vljbPmu5rliqjliLDmjIflrprlgY/np7vkvY3nva7jgIJcbiAgICAgKiBAbWV0aG9kIHNjcm9sbFRvT2Zmc2V0XG4gICAgICogQHBhcmFtIHtWZWMyfSBvZmZzZXQgLSBBIFZlYzIsIHRoZSB2YWx1ZSBvZiB3aGljaCBlYWNoIGF4aXMgYmV0d2VlbiAwIGFuZCBtYXhTY3JvbGxPZmZzZXRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3RpbWVJblNlY29uZD0wXSAtIFNjcm9sbCB0aW1lIGluIHNlY29uZCwgaWYgeW91IGRvbid0IHBhc3MgdGltZUluU2Vjb25kLFxuICAgICAqIHRoZSBjb250ZW50IHdpbGwganVtcCB0byB0aGUgc3BlY2lmaWMgb2Zmc2V0IG9mIFNjcm9sbFZpZXcgaW1tZWRpYXRlbHkuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbYXR0ZW51YXRlZD10cnVlXSAtIFdoZXRoZXIgdGhlIHNjcm9sbCBhY2NlbGVyYXRpb24gYXR0ZW51YXRlZCwgZGVmYXVsdCBpcyB0cnVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gU2Nyb2xsIHRvIG1pZGRsZSBwb3NpdGlvbiBpbiAwLjEgc2Vjb25kIGluIHgtYXhpc1xuICAgICAqIGxldCBtYXhTY3JvbGxPZmZzZXQgPSB0aGlzLmdldE1heFNjcm9sbE9mZnNldCgpO1xuICAgICAqIHNjcm9sbFZpZXcuc2Nyb2xsVG9PZmZzZXQoY2MudjIobWF4U2Nyb2xsT2Zmc2V0LnggLyAyLCAwKSwgMC4xKTtcbiAgICAgKi9cbiAgICBzY3JvbGxUb09mZnNldCAob2Zmc2V0LCB0aW1lSW5TZWNvbmQsIGF0dGVudWF0ZWQpIHtcbiAgICAgICAgbGV0IG1heFNjcm9sbE9mZnNldCA9IHRoaXMuZ2V0TWF4U2Nyb2xsT2Zmc2V0KCk7XG5cbiAgICAgICAgbGV0IGFuY2hvciA9IGNjLnYyKDAsIDApO1xuICAgICAgICAvL2lmIG1heFNjcm9sbE9mZnNldCBpcyAwLCB0aGVuIGFsd2F5cyBhbGlnbiB0aGUgY29udGVudCdzIHRvcCBsZWZ0IG9yaWdpbiB0byB0aGUgdG9wIGxlZnQgY29ybmVyIG9mIGl0cyBwYXJlbnRcbiAgICAgICAgaWYgKG1heFNjcm9sbE9mZnNldC54ID09PSAwKSB7XG4gICAgICAgICAgICBhbmNob3IueCA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbmNob3IueCA9IG9mZnNldC54IC8gbWF4U2Nyb2xsT2Zmc2V0Lng7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWF4U2Nyb2xsT2Zmc2V0LnkgPT09IDApIHtcbiAgICAgICAgICAgIGFuY2hvci55ID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFuY2hvci55ID0gKG1heFNjcm9sbE9mZnNldC55IC0gb2Zmc2V0LnkgKSAvIG1heFNjcm9sbE9mZnNldC55O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zY3JvbGxUbyhhbmNob3IsIHRpbWVJblNlY29uZCwgYXR0ZW51YXRlZCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gIEdldCB0aGUgcG9zaXRpdmUgb2Zmc2V0IHZhbHVlIGNvcnJlc3BvbmRzIHRvIHRoZSBjb250ZW50J3MgdG9wIGxlZnQgYm91bmRhcnkuXG4gICAgICogISN6aCAg6I635Y+W5rua5Yqo6KeG5Zu+55u45a+55LqO5bem5LiK6KeS5Y6f54K555qE5b2T5YmN5rua5Yqo5YGP56e7XG4gICAgICogQG1ldGhvZCBnZXRTY3JvbGxPZmZzZXRcbiAgICAgKiBAcmV0dXJuIHtWZWMyfSAgLSBBIFZlYzIgdmFsdWUgaW5kaWNhdGUgdGhlIGN1cnJlbnQgc2Nyb2xsIG9mZnNldC5cbiAgICAgKi9cbiAgICBnZXRTY3JvbGxPZmZzZXQgKCkge1xuICAgICAgICBsZXQgdG9wRGVsdGEgPSAgdGhpcy5fZ2V0Q29udGVudFRvcEJvdW5kYXJ5KCkgLSB0aGlzLl90b3BCb3VuZGFyeTtcbiAgICAgICAgbGV0IGxlZnREZXRhID0gdGhpcy5fZ2V0Q29udGVudExlZnRCb3VuZGFyeSgpIC0gdGhpcy5fbGVmdEJvdW5kYXJ5O1xuXG4gICAgICAgIHJldHVybiBjYy52MihsZWZ0RGV0YSwgdG9wRGVsdGEpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldCB0aGUgbWF4aW1pemUgYXZhaWxhYmxlICBzY3JvbGwgb2Zmc2V0XG4gICAgICogISN6aCDojrflj5bmu5rliqjop4blm77mnIDlpKflj6/ku6Xmu5rliqjnmoTlgY/np7vph49cbiAgICAgKiBAbWV0aG9kIGdldE1heFNjcm9sbE9mZnNldFxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IC0gQSBWZWMyIHZhbHVlIGluZGljYXRlIHRoZSBtYXhpbWl6ZSBzY3JvbGwgb2Zmc2V0IGluIHggYW5kIHkgYXhpcy5cbiAgICAgKi9cbiAgICBnZXRNYXhTY3JvbGxPZmZzZXQgKCkge1xuICAgICAgICBsZXQgdmlld1NpemUgPSB0aGlzLl92aWV3LmdldENvbnRlbnRTaXplKCk7XG4gICAgICAgIGxldCBjb250ZW50U2l6ZSA9IHRoaXMuY29udGVudC5nZXRDb250ZW50U2l6ZSgpO1xuICAgICAgICBsZXQgaG9yaXpvbnRhbE1heGltaXplT2Zmc2V0ID0gIGNvbnRlbnRTaXplLndpZHRoIC0gdmlld1NpemUud2lkdGg7XG4gICAgICAgIGxldCB2ZXJ0aWNhbE1heGltaXplT2Zmc2V0ID0gY29udGVudFNpemUuaGVpZ2h0IC0gdmlld1NpemUuaGVpZ2h0O1xuICAgICAgICBob3Jpem9udGFsTWF4aW1pemVPZmZzZXQgPSBob3Jpem9udGFsTWF4aW1pemVPZmZzZXQgPj0gMCA/IGhvcml6b250YWxNYXhpbWl6ZU9mZnNldCA6IDA7XG4gICAgICAgIHZlcnRpY2FsTWF4aW1pemVPZmZzZXQgPSB2ZXJ0aWNhbE1heGltaXplT2Zmc2V0ID49MCA/IHZlcnRpY2FsTWF4aW1pemVPZmZzZXQgOiAwO1xuXG4gICAgICAgIHJldHVybiBjYy52Mihob3Jpem9udGFsTWF4aW1pemVPZmZzZXQsIHZlcnRpY2FsTWF4aW1pemVPZmZzZXQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNjcm9sbCB0aGUgY29udGVudCB0byB0aGUgaG9yaXpvbnRhbCBwZXJjZW50IHBvc2l0aW9uIG9mIFNjcm9sbFZpZXcuXG4gICAgICogISN6aCDop4blm77lhoXlrrnlnKjop4Tlrprml7bpl7TlhoXlsIbmu5rliqjliLAgU2Nyb2xsVmlldyDmsLTlubPmlrnlkJHnmoTnmb7liIbmr5TkvY3nva7kuIrjgIJcbiAgICAgKiBAbWV0aG9kIHNjcm9sbFRvUGVyY2VudEhvcml6b250YWxcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcGVyY2VudCAtIEEgdmFsdWUgYmV0d2VlbiAwIGFuZCAxLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbdGltZUluU2Vjb25kPTBdIC0gU2Nyb2xsIHRpbWUgaW4gc2Vjb25kLCBpZiB5b3UgZG9uJ3QgcGFzcyB0aW1lSW5TZWNvbmQsXG4gICAgICogdGhlIGNvbnRlbnQgd2lsbCBqdW1wIHRvIHRoZSBob3Jpem9udGFsIHBlcmNlbnQgcG9zaXRpb24gb2YgU2Nyb2xsVmlldyBpbW1lZGlhdGVseS5cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFthdHRlbnVhdGVkPXRydWVdIC0gV2hldGhlciB0aGUgc2Nyb2xsIGFjY2VsZXJhdGlvbiBhdHRlbnVhdGVkLCBkZWZhdWx0IGlzIHRydWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyBTY3JvbGwgdG8gbWlkZGxlIHBvc2l0aW9uLlxuICAgICAqIHNjcm9sbFZpZXcuc2Nyb2xsVG9Cb3R0b21SaWdodCgwLjUsIDAuMSk7XG4gICAgICovXG4gICAgc2Nyb2xsVG9QZXJjZW50SG9yaXpvbnRhbCAocGVyY2VudCwgdGltZUluU2Vjb25kLCBhdHRlbnVhdGVkKSB7XG4gICAgICAgIGxldCBtb3ZlRGVsdGEgPSB0aGlzLl9jYWxjdWxhdGVNb3ZlUGVyY2VudERlbHRhKHtcbiAgICAgICAgICAgIGFuY2hvcjogY2MudjIocGVyY2VudCwgMCksXG4gICAgICAgICAgICBhcHBseVRvSG9yaXpvbnRhbDogdHJ1ZSxcbiAgICAgICAgICAgIGFwcGx5VG9WZXJ0aWNhbDogZmFsc2UsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aW1lSW5TZWNvbmQpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0QXV0b1Njcm9sbChtb3ZlRGVsdGEsIHRpbWVJblNlY29uZCwgYXR0ZW51YXRlZCAhPT0gZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbW92ZUNvbnRlbnQobW92ZURlbHRhKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNjcm9sbCB0aGUgY29udGVudCB0byB0aGUgcGVyY2VudCBwb3NpdGlvbiBvZiBTY3JvbGxWaWV3IGluIGFueSBkaXJlY3Rpb24uXG4gICAgICogISN6aCDop4blm77lhoXlrrnlnKjop4Tlrprml7bpl7TlhoXov5vooYzlnoLnm7TmlrnlkJHlkozmsLTlubPmlrnlkJHnmoTmu5rliqjvvIzlubbkuJTmu5rliqjliLDmjIflrprnmb7liIbmr5TkvY3nva7kuIrjgIJcbiAgICAgKiBAbWV0aG9kIHNjcm9sbFRvXG4gICAgICogQHBhcmFtIHtWZWMyfSBhbmNob3IgLSBBIHBvaW50IHdoaWNoIHdpbGwgYmUgY2xhbXAgYmV0d2VlbiBjYy52MigwLDApIGFuZCBjYy52MigxLDEpLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbdGltZUluU2Vjb25kPTBdIC0gU2Nyb2xsIHRpbWUgaW4gc2Vjb25kLCBpZiB5b3UgZG9uJ3QgcGFzcyB0aW1lSW5TZWNvbmQsXG4gICAgICogdGhlIGNvbnRlbnQgd2lsbCBqdW1wIHRvIHRoZSBwZXJjZW50IHBvc2l0aW9uIG9mIFNjcm9sbFZpZXcgaW1tZWRpYXRlbHkuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbYXR0ZW51YXRlZD10cnVlXSAtIFdoZXRoZXIgdGhlIHNjcm9sbCBhY2NlbGVyYXRpb24gYXR0ZW51YXRlZCwgZGVmYXVsdCBpcyB0cnVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gVmVydGljYWwgc2Nyb2xsIHRvIHRoZSBib3R0b20gb2YgdGhlIHZpZXcuXG4gICAgICogc2Nyb2xsVmlldy5zY3JvbGxUbyhjYy52MigwLCAxKSwgMC4xKTtcbiAgICAgKlxuICAgICAqIC8vIEhvcml6b250YWwgc2Nyb2xsIHRvIHZpZXcgcmlnaHQuXG4gICAgICogc2Nyb2xsVmlldy5zY3JvbGxUbyhjYy52MigxLCAwKSwgMC4xKTtcbiAgICAgKi9cbiAgICBzY3JvbGxUbyAoYW5jaG9yLCB0aW1lSW5TZWNvbmQsIGF0dGVudWF0ZWQpIHtcbiAgICAgICAgbGV0IG1vdmVEZWx0YSA9IHRoaXMuX2NhbGN1bGF0ZU1vdmVQZXJjZW50RGVsdGEoe1xuICAgICAgICAgICAgYW5jaG9yOiBjYy52MihhbmNob3IpLFxuICAgICAgICAgICAgYXBwbHlUb0hvcml6b250YWw6IHRydWUsXG4gICAgICAgICAgICBhcHBseVRvVmVydGljYWw6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aW1lSW5TZWNvbmQpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0QXV0b1Njcm9sbChtb3ZlRGVsdGEsIHRpbWVJblNlY29uZCwgYXR0ZW51YXRlZCAhPT0gZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbW92ZUNvbnRlbnQobW92ZURlbHRhKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNjcm9sbCB0aGUgY29udGVudCB0byB0aGUgdmVydGljYWwgcGVyY2VudCBwb3NpdGlvbiBvZiBTY3JvbGxWaWV3LlxuICAgICAqICEjemgg6KeG5Zu+5YaF5a655Zyo6KeE5a6a5pe26Ze05YaF5rua5Yqo5YiwIFNjcm9sbFZpZXcg5Z6C55u05pa55ZCR55qE55m+5YiG5q+U5L2N572u5LiK44CCXG4gICAgICogQG1ldGhvZCBzY3JvbGxUb1BlcmNlbnRWZXJ0aWNhbFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwZXJjZW50IC0gQSB2YWx1ZSBiZXR3ZWVuIDAgYW5kIDEuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFt0aW1lSW5TZWNvbmQ9MF0gLSBTY3JvbGwgdGltZSBpbiBzZWNvbmQsIGlmIHlvdSBkb24ndCBwYXNzIHRpbWVJblNlY29uZCxcbiAgICAgKiB0aGUgY29udGVudCB3aWxsIGp1bXAgdG8gdGhlIHZlcnRpY2FsIHBlcmNlbnQgcG9zaXRpb24gb2YgU2Nyb2xsVmlldyBpbW1lZGlhdGVseS5cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFthdHRlbnVhdGVkPXRydWVdIC0gV2hldGhlciB0aGUgc2Nyb2xsIGFjY2VsZXJhdGlvbiBhdHRlbnVhdGVkLCBkZWZhdWx0IGlzIHRydWUuXG4gICAgICogLy8gU2Nyb2xsIHRvIG1pZGRsZSBwb3NpdGlvbi5cbiAgICAgKiBzY3JvbGxWaWV3LnNjcm9sbFRvUGVyY2VudFZlcnRpY2FsKDAuNSwgMC4xKTtcbiAgICAgKi9cbiAgICBzY3JvbGxUb1BlcmNlbnRWZXJ0aWNhbCAocGVyY2VudCwgdGltZUluU2Vjb25kLCBhdHRlbnVhdGVkKSB7XG4gICAgICAgIGxldCBtb3ZlRGVsdGEgPSB0aGlzLl9jYWxjdWxhdGVNb3ZlUGVyY2VudERlbHRhKHtcbiAgICAgICAgICAgIGFuY2hvcjogY2MudjIoMCwgcGVyY2VudCksXG4gICAgICAgICAgICBhcHBseVRvSG9yaXpvbnRhbDogZmFsc2UsXG4gICAgICAgICAgICBhcHBseVRvVmVydGljYWw6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aW1lSW5TZWNvbmQpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0QXV0b1Njcm9sbChtb3ZlRGVsdGEsIHRpbWVJblNlY29uZCwgYXR0ZW51YXRlZCAhPT0gZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbW92ZUNvbnRlbnQobW92ZURlbHRhKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuICBTdG9wIGF1dG8gc2Nyb2xsIGltbWVkaWF0ZWx5XG4gICAgICogISN6aCAg5YGc5q2i6Ieq5Yqo5rua5YqoLCDosIPnlKjmraQgQVBJIOWPr+S7peiuqSBTY3JvbGx2aWV3IOeri+WNs+WBnOatoua7muWKqFxuICAgICAqIEBtZXRob2Qgc3RvcEF1dG9TY3JvbGxcbiAgICAgKi9cbiAgICBzdG9wQXV0b1Njcm9sbCAoKSB7XG4gICAgICAgIHRoaXMuX2F1dG9TY3JvbGxpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbEFjY3VtdWxhdGVkVGltZSA9IHRoaXMuX2F1dG9TY3JvbGxUb3RhbFRpbWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gTW9kaWZ5IHRoZSBjb250ZW50IHBvc2l0aW9uLlxuICAgICAqICEjemgg6K6+572u5b2T5YmN6KeG5Zu+5YaF5a6555qE5Z2Q5qCH54K544CCXG4gICAgICogQG1ldGhvZCBzZXRDb250ZW50UG9zaXRpb25cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHBvc2l0aW9uIC0gVGhlIHBvc2l0aW9uIGluIGNvbnRlbnQncyBwYXJlbnQgc3BhY2UuXG4gICAgICovXG4gICAgc2V0Q29udGVudFBvc2l0aW9uIChwb3NpdGlvbikge1xuICAgICAgICBpZiAocG9zaXRpb24uZnV6enlFcXVhbHModGhpcy5nZXRDb250ZW50UG9zaXRpb24oKSwgRVBTSUxPTikpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29udGVudC5zZXRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICAgIHRoaXMuX291dE9mQm91bmRhcnlBbW91bnREaXJ0eSA9IHRydWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUXVlcnkgdGhlIGNvbnRlbnQncyBwb3NpdGlvbiBpbiBpdHMgcGFyZW50IHNwYWNlLlxuICAgICAqICEjemgg6I635Y+W5b2T5YmN6KeG5Zu+5YaF5a6555qE5Z2Q5qCH54K544CCXG4gICAgICogQG1ldGhvZCBnZXRDb250ZW50UG9zaXRpb25cbiAgICAgKiBAcmV0dXJucyB7VmVjMn0gLSBUaGUgY29udGVudCdzIHBvc2l0aW9uIGluIGl0cyBwYXJlbnQgc3BhY2UuXG4gICAgICovXG4gICAgZ2V0Q29udGVudFBvc2l0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5nZXRQb3NpdGlvbigpO1xuICAgIH0sXG4gICAgXG4gICAgLyoqXG4gICAgICogISNlbiBRdWVyeSB3aGV0aGVyIHRoZSB1c2VyIGlzIGN1cnJlbnRseSBkcmFnZ2luZyB0aGUgU2Nyb2xsVmlldyB0byBzY3JvbGwgaXRcbiAgICAgKiAhI3poIOeUqOaIt+aYr+WQpuWcqOaLluaLveW9k+WJjea7muWKqOinhuWbvlxuICAgICAqIEBtZXRob2QgaXNTY3JvbGxpbmdcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gLSBXaGV0aGVyIHRoZSB1c2VyIGlzIGN1cnJlbnRseSBkcmFnZ2luZyB0aGUgU2Nyb2xsVmlldyB0byBzY3JvbGwgaXRcbiAgICAgKi9cbiAgICBpc1Njcm9sbGluZyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxpbmc7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUXVlcnkgd2hldGhlciB0aGUgU2Nyb2xsVmlldyBpcyBjdXJyZW50bHkgc2Nyb2xsaW5nIGJlY2F1c2Ugb2YgYSBib3VuY2ViYWNrIG9yIGluZXJ0aWEgc2xvd2Rvd24uXG4gICAgICogISN6aCDlvZPliY3mu5rliqjop4blm77mmK/lkKblnKjmg6/mgKfmu5rliqhcbiAgICAgKiBAbWV0aG9kIGlzQXV0b1Njcm9sbGluZ1xuICAgICAqIEByZXR1cm5zIHtCb29sZWFufSAtIFdoZXRoZXIgdGhlIFNjcm9sbFZpZXcgaXMgY3VycmVudGx5IHNjcm9sbGluZyBiZWNhdXNlIG9mIGEgYm91bmNlYmFjayBvciBpbmVydGlhIHNsb3dkb3duLlxuICAgICAqL1xuICAgIGlzQXV0b1Njcm9sbGluZyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hdXRvU2Nyb2xsaW5nO1xuICAgIH0sXG4gICAgXG4gICAgLy9wcml2YXRlIG1ldGhvZHNcbiAgICBfcmVnaXN0ZXJFdmVudCAoKSB7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5fb25Ub3VjaEJlZ2FuLCB0aGlzLCB0cnVlKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMuX29uVG91Y2hNb3ZlZCwgdGhpcywgdHJ1ZSk7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMuX29uVG91Y2hFbmRlZCwgdGhpcywgdHJ1ZSk7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9DQU5DRUwsIHRoaXMuX29uVG91Y2hDYW5jZWxsZWQsIHRoaXMsIHRydWUpO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfV0hFRUwsIHRoaXMuX29uTW91c2VXaGVlbCwgdGhpcywgdHJ1ZSk7XG4gICAgfSxcblxuICAgIF91bnJlZ2lzdGVyRXZlbnQgKCkge1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLl9vblRvdWNoQmVnYW4sIHRoaXMsIHRydWUpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMuX29uVG91Y2hNb3ZlZCwgdGhpcywgdHJ1ZSk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLl9vblRvdWNoRW5kZWQsIHRoaXMsIHRydWUpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0NBTkNFTCwgdGhpcy5fb25Ub3VjaENhbmNlbGxlZCwgdGhpcywgdHJ1ZSk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfV0hFRUwsIHRoaXMuX29uTW91c2VXaGVlbCwgdGhpcywgdHJ1ZSk7XG4gICAgfSxcblxuICAgIF9vbk1vdXNlV2hlZWwgKGV2ZW50LCBjYXB0dXJlTGlzdGVuZXJzKSB7XG4gICAgICAgIGlmICghdGhpcy5lbmFibGVkSW5IaWVyYXJjaHkpIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMuX2hhc05lc3RlZFZpZXdHcm91cChldmVudCwgY2FwdHVyZUxpc3RlbmVycykpIHJldHVybjtcblxuICAgICAgICBsZXQgZGVsdGFNb3ZlID0gY2MudjIoMCwgMCk7XG4gICAgICAgIGxldCB3aGVlbFByZWNpc2lvbiA9IC0wLjE7XG4gICAgICAgIC8vT24gdGhlIHdpbmRvd3MgcGxhdGZvcm0sIHRoZSBzY3JvbGxpbmcgc3BlZWQgb2YgdGhlIG1vdXNlIHdoZWVsIG9mIFNjcm9sbFZpZXcgb24gY2hyb21lIGFuZCBmaXJlYm94IGlzIGRpZmZlcmVudFxuICAgICAgICBpZiAoY2Muc3lzLm9zID09PSBjYy5zeXMuT1NfV0lORE9XUyAmJiBjYy5zeXMuYnJvd3NlclR5cGUgPT09IGNjLnN5cy5CUk9XU0VSX1RZUEVfRklSRUZPWCkge1xuICAgICAgICAgICAgd2hlZWxQcmVjaXNpb24gPSAtMC4xLzM7XG4gICAgICAgIH1cbiAgICAgICAgaWYoQ0NfSlNCIHx8IENDX1JVTlRJTUUpIHtcbiAgICAgICAgICAgIHdoZWVsUHJlY2lzaW9uID0gLTc7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy52ZXJ0aWNhbCkge1xuICAgICAgICAgICAgZGVsdGFNb3ZlID0gY2MudjIoMCwgZXZlbnQuZ2V0U2Nyb2xsWSgpICogd2hlZWxQcmVjaXNpb24pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodGhpcy5ob3Jpem9udGFsKSB7XG4gICAgICAgICAgICBkZWx0YU1vdmUgPSBjYy52MihldmVudC5nZXRTY3JvbGxZKCkgKiB3aGVlbFByZWNpc2lvbiwgMCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9tb3VzZVdoZWVsRXZlbnRFbGFwc2VkVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX3Byb2Nlc3NEZWx0YU1vdmUoZGVsdGFNb3ZlKTtcblxuICAgICAgICBpZighdGhpcy5fc3RvcE1vdXNlV2hlZWwpIHtcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZVByZXNzTG9naWMoKTtcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGUodGhpcy5fY2hlY2tNb3VzZVdoZWVsLCAxLjAgLyA2MCk7XG4gICAgICAgICAgICB0aGlzLl9zdG9wTW91c2VXaGVlbCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zdG9wUHJvcGFnYXRpb25JZlRhcmdldElzTWUoZXZlbnQpO1xuICAgIH0sXG5cbiAgICBfY2hlY2tNb3VzZVdoZWVsIChkdCkge1xuICAgICAgICBsZXQgY3VycmVudE91dE9mQm91bmRhcnkgPSB0aGlzLl9nZXRIb3dNdWNoT3V0T2ZCb3VuZGFyeSgpO1xuICAgICAgICBsZXQgbWF4RWxhcHNlZFRpbWUgPSAwLjE7XG5cbiAgICAgICAgaWYgKCFjdXJyZW50T3V0T2ZCb3VuZGFyeS5mdXp6eUVxdWFscyhjYy52MigwLCAwKSwgRVBTSUxPTikpIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NJbmVydGlhU2Nyb2xsKCk7XG4gICAgICAgICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5fY2hlY2tNb3VzZVdoZWVsKTtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoJ3Njcm9sbC1lbmRlZCcpO1xuICAgICAgICAgICAgdGhpcy5fc3RvcE1vdXNlV2hlZWwgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21vdXNlV2hlZWxFdmVudEVsYXBzZWRUaW1lICs9IGR0O1xuXG4gICAgICAgIC8vIG1vdXNlIHdoZWVsIGV2ZW50IGlzIGVuZGVkXG4gICAgICAgIGlmICh0aGlzLl9tb3VzZVdoZWVsRXZlbnRFbGFwc2VkVGltZSA+IG1heEVsYXBzZWRUaW1lKSB7XG4gICAgICAgICAgICB0aGlzLl9vblNjcm9sbEJhclRvdWNoRW5kZWQoKTtcbiAgICAgICAgICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLl9jaGVja01vdXNlV2hlZWwpO1xuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudCgnc2Nyb2xsLWVuZGVkJyk7XG4gICAgICAgICAgICB0aGlzLl9zdG9wTW91c2VXaGVlbCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9jYWxjdWxhdGVNb3ZlUGVyY2VudERlbHRhIChvcHRpb25zKSB7XG4gICAgICAgIGxldCBhbmNob3IgPSBvcHRpb25zLmFuY2hvcjtcbiAgICAgICAgbGV0IGFwcGx5VG9Ib3Jpem9udGFsID0gb3B0aW9ucy5hcHBseVRvSG9yaXpvbnRhbDtcbiAgICAgICAgbGV0IGFwcGx5VG9WZXJ0aWNhbCA9IG9wdGlvbnMuYXBwbHlUb1ZlcnRpY2FsO1xuICAgICAgICB0aGlzLl9jYWxjdWxhdGVCb3VuZGFyeSgpO1xuXG4gICAgICAgIGFuY2hvciA9IGFuY2hvci5jbGFtcGYoY2MudjIoMCwgMCksIGNjLnYyKDEsIDEpKTtcblxuICAgICAgICBsZXQgc2Nyb2xsU2l6ZSA9IHRoaXMuX3ZpZXcuZ2V0Q29udGVudFNpemUoKTtcbiAgICAgICAgbGV0IGNvbnRlbnRTaXplID0gdGhpcy5jb250ZW50LmdldENvbnRlbnRTaXplKCk7XG4gICAgICAgIGxldCBib3R0b21EZXRhID0gdGhpcy5fZ2V0Q29udGVudEJvdHRvbUJvdW5kYXJ5KCkgLSB0aGlzLl9ib3R0b21Cb3VuZGFyeTtcbiAgICAgICAgYm90dG9tRGV0YSA9IC1ib3R0b21EZXRhO1xuXG4gICAgICAgIGxldCBsZWZ0RGV0YSA9IHRoaXMuX2dldENvbnRlbnRMZWZ0Qm91bmRhcnkoKSAtIHRoaXMuX2xlZnRCb3VuZGFyeTtcbiAgICAgICAgbGVmdERldGEgPSAtbGVmdERldGE7XG5cbiAgICAgICAgbGV0IG1vdmVEZWx0YSA9IGNjLnYyKDAsIDApO1xuICAgICAgICBsZXQgdG90YWxTY3JvbGxEZWx0YSA9IDA7XG4gICAgICAgIGlmIChhcHBseVRvSG9yaXpvbnRhbCkge1xuICAgICAgICAgICAgdG90YWxTY3JvbGxEZWx0YSA9IGNvbnRlbnRTaXplLndpZHRoIC0gc2Nyb2xsU2l6ZS53aWR0aDtcbiAgICAgICAgICAgIG1vdmVEZWx0YS54ID0gbGVmdERldGEgLSB0b3RhbFNjcm9sbERlbHRhICogYW5jaG9yLng7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXBwbHlUb1ZlcnRpY2FsKSB7XG4gICAgICAgICAgICB0b3RhbFNjcm9sbERlbHRhID0gY29udGVudFNpemUuaGVpZ2h0IC0gc2Nyb2xsU2l6ZS5oZWlnaHQ7XG4gICAgICAgICAgICBtb3ZlRGVsdGEueSA9IGJvdHRvbURldGEgLSB0b3RhbFNjcm9sbERlbHRhICogYW5jaG9yLnk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbW92ZURlbHRhO1xuICAgIH0sXG5cbiAgICBfbW92ZUNvbnRlbnRUb1RvcExlZnQgKHNjcm9sbFZpZXdTaXplKSB7XG4gICAgICAgIGxldCBjb250ZW50U2l6ZSA9IHRoaXMuY29udGVudC5nZXRDb250ZW50U2l6ZSgpO1xuXG4gICAgICAgIGxldCBib3R0b21EZXRhID0gdGhpcy5fZ2V0Q29udGVudEJvdHRvbUJvdW5kYXJ5KCkgLSB0aGlzLl9ib3R0b21Cb3VuZGFyeTtcbiAgICAgICAgYm90dG9tRGV0YSA9IC1ib3R0b21EZXRhO1xuICAgICAgICBsZXQgbW92ZURlbHRhID0gY2MudjIoMCwgMCk7XG4gICAgICAgIGxldCB0b3RhbFNjcm9sbERlbHRhID0gMDtcblxuICAgICAgICBsZXQgbGVmdERldGEgPSB0aGlzLl9nZXRDb250ZW50TGVmdEJvdW5kYXJ5KCkgLSB0aGlzLl9sZWZ0Qm91bmRhcnk7XG4gICAgICAgIGxlZnREZXRhID0gLWxlZnREZXRhO1xuXG4gICAgICAgIGlmIChjb250ZW50U2l6ZS5oZWlnaHQgPCBzY3JvbGxWaWV3U2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICAgIHRvdGFsU2Nyb2xsRGVsdGEgPSBjb250ZW50U2l6ZS5oZWlnaHQgLSBzY3JvbGxWaWV3U2l6ZS5oZWlnaHQ7XG4gICAgICAgICAgICBtb3ZlRGVsdGEueSA9IGJvdHRvbURldGEgLSB0b3RhbFNjcm9sbERlbHRhO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRlbnRTaXplLndpZHRoIDwgc2Nyb2xsVmlld1NpemUud2lkdGgpIHtcbiAgICAgICAgICAgIHRvdGFsU2Nyb2xsRGVsdGEgPSBjb250ZW50U2l6ZS53aWR0aCAtIHNjcm9sbFZpZXdTaXplLndpZHRoO1xuICAgICAgICAgICAgbW92ZURlbHRhLnggPSBsZWZ0RGV0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3VwZGF0ZVNjcm9sbEJhclN0YXRlKCk7XG4gICAgICAgIHRoaXMuX21vdmVDb250ZW50KG1vdmVEZWx0YSk7XG4gICAgICAgIHRoaXMuX2FkanVzdENvbnRlbnRPdXRPZkJvdW5kYXJ5KCk7XG4gICAgfSxcblxuICAgIF9jYWxjdWxhdGVCb3VuZGFyeSAoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnQpIHtcbiAgICAgICAgICAgIC8vcmVmcmVzaCBjb250ZW50IHNpemVcbiAgICAgICAgICAgIGxldCBsYXlvdXQgPSB0aGlzLmNvbnRlbnQuZ2V0Q29tcG9uZW50KGNjLkxheW91dCk7XG4gICAgICAgICAgICBpZihsYXlvdXQgJiYgbGF5b3V0LmVuYWJsZWRJbkhpZXJhcmNoeSkge1xuICAgICAgICAgICAgICAgIGxheW91dC51cGRhdGVMYXlvdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCB2aWV3U2l6ZSA9IHRoaXMuX3ZpZXcuZ2V0Q29udGVudFNpemUoKTtcblxuICAgICAgICAgICAgbGV0IGFuY2hvclggPSB2aWV3U2l6ZS53aWR0aCAqIHRoaXMuX3ZpZXcuYW5jaG9yWDtcbiAgICAgICAgICAgIGxldCBhbmNob3JZID0gdmlld1NpemUuaGVpZ2h0ICogdGhpcy5fdmlldy5hbmNob3JZO1xuXG4gICAgICAgICAgICB0aGlzLl9sZWZ0Qm91bmRhcnkgPSAtYW5jaG9yWDtcbiAgICAgICAgICAgIHRoaXMuX2JvdHRvbUJvdW5kYXJ5ID0gLWFuY2hvclk7XG5cbiAgICAgICAgICAgIHRoaXMuX3JpZ2h0Qm91bmRhcnkgPSB0aGlzLl9sZWZ0Qm91bmRhcnkgKyB2aWV3U2l6ZS53aWR0aDtcbiAgICAgICAgICAgIHRoaXMuX3RvcEJvdW5kYXJ5ID0gdGhpcy5fYm90dG9tQm91bmRhcnkgKyB2aWV3U2l6ZS5oZWlnaHQ7XG5cbiAgICAgICAgICAgIHRoaXMuX21vdmVDb250ZW50VG9Ub3BMZWZ0KHZpZXdTaXplKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvL3RoaXMgaXMgZm9yIG5lc3RlZCBzY3JvbGx2aWV3XG4gICAgX2hhc05lc3RlZFZpZXdHcm91cCAoZXZlbnQsIGNhcHR1cmVMaXN0ZW5lcnMpIHtcbiAgICAgICAgaWYgKGV2ZW50LmV2ZW50UGhhc2UgIT09IGNjLkV2ZW50LkNBUFRVUklOR19QSEFTRSkgcmV0dXJuO1xuXG4gICAgICAgIGlmIChjYXB0dXJlTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAvL2NhcHR1cmVMaXN0ZW5lcnMgYXJlIGFycmFuZ2VkIGZyb20gY2hpbGQgdG8gcGFyZW50XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhcHR1cmVMaXN0ZW5lcnMubGVuZ3RoOyArK2kpe1xuICAgICAgICAgICAgICAgIGxldCBpdGVtID0gY2FwdHVyZUxpc3RlbmVyc1tpXTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm5vZGUgPT09IGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5nZXRDb21wb25lbnQoY2MuVmlld0dyb3VwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKGl0ZW0uZ2V0Q29tcG9uZW50KGNjLlZpZXdHcm91cCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy9UaGlzIGlzIGZvciBTY3JvbGx2aWV3IGFzIGNoaWxkcmVuIG9mIGEgQnV0dG9uXG4gICAgX3N0b3BQcm9wYWdhdGlvbklmVGFyZ2V0SXNNZSAoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LmV2ZW50UGhhc2UgPT09IGNjLkV2ZW50LkFUX1RBUkdFVCAmJiBldmVudC50YXJnZXQgPT09IHRoaXMubm9kZSkge1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdG91Y2ggZXZlbnQgaGFuZGxlclxuICAgIF9vblRvdWNoQmVnYW4gKGV2ZW50LCBjYXB0dXJlTGlzdGVuZXJzKSB7XG4gICAgICAgIGlmICghdGhpcy5lbmFibGVkSW5IaWVyYXJjaHkpIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMuX2hhc05lc3RlZFZpZXdHcm91cChldmVudCwgY2FwdHVyZUxpc3RlbmVycykpIHJldHVybjtcblxuICAgICAgICBsZXQgdG91Y2ggPSBldmVudC50b3VjaDtcbiAgICAgICAgaWYgKHRoaXMuY29udGVudCkge1xuICAgICAgICAgICAgdGhpcy5faGFuZGxlUHJlc3NMb2dpYyh0b3VjaCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdG91Y2hNb3ZlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9zdG9wUHJvcGFnYXRpb25JZlRhcmdldElzTWUoZXZlbnQpO1xuICAgIH0sXG5cbiAgICBfb25Ub3VjaE1vdmVkIChldmVudCwgY2FwdHVyZUxpc3RlbmVycykge1xuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZEluSGllcmFyY2h5KSByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLl9oYXNOZXN0ZWRWaWV3R3JvdXAoZXZlbnQsIGNhcHR1cmVMaXN0ZW5lcnMpKSByZXR1cm47XG5cbiAgICAgICAgbGV0IHRvdWNoID0gZXZlbnQudG91Y2g7XG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZU1vdmVMb2dpYyh0b3VjaCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRG8gbm90IHByZXZlbnQgdG91Y2ggZXZlbnRzIGluIGlubmVyIG5vZGVzXG4gICAgICAgIGlmICghdGhpcy5jYW5jZWxJbm5lckV2ZW50cykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRlbHRhTW92ZSA9IHRvdWNoLmdldExvY2F0aW9uKCkuc3ViKHRvdWNoLmdldFN0YXJ0TG9jYXRpb24oKSk7XG4gICAgICAgIC8vRklYTUU6IHRvdWNoIG1vdmUgZGVsdGEgc2hvdWxkIGJlIGNhbGN1bGF0ZWQgYnkgRFBJLlxuICAgICAgICBpZiAoZGVsdGFNb3ZlLm1hZygpID4gNykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl90b3VjaE1vdmVkICYmIGV2ZW50LnRhcmdldCAhPT0gdGhpcy5ub2RlKSB7XG4gICAgICAgICAgICAgICAgLy8gU2ltdWxhdGUgdG91Y2ggY2FuY2VsIGZvciB0YXJnZXQgbm9kZVxuICAgICAgICAgICAgICAgIGxldCBjYW5jZWxFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudFRvdWNoKGV2ZW50LmdldFRvdWNoZXMoKSwgZXZlbnQuYnViYmxlcyk7XG4gICAgICAgICAgICAgICAgY2FuY2VsRXZlbnQudHlwZSA9IGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0NBTkNFTDtcbiAgICAgICAgICAgICAgICBjYW5jZWxFdmVudC50b3VjaCA9IGV2ZW50LnRvdWNoO1xuICAgICAgICAgICAgICAgIGNhbmNlbEV2ZW50LnNpbXVsYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBldmVudC50YXJnZXQuZGlzcGF0Y2hFdmVudChjYW5jZWxFdmVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG91Y2hNb3ZlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc3RvcFByb3BhZ2F0aW9uSWZUYXJnZXRJc01lKGV2ZW50KTtcbiAgICB9LFxuXG4gICAgX29uVG91Y2hFbmRlZCAoZXZlbnQsIGNhcHR1cmVMaXN0ZW5lcnMpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5faGFzTmVzdGVkVmlld0dyb3VwKGV2ZW50LCBjYXB0dXJlTGlzdGVuZXJzKSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoJ3RvdWNoLXVwJyk7XG5cbiAgICAgICAgbGV0IHRvdWNoID0gZXZlbnQudG91Y2g7XG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZVJlbGVhc2VMb2dpYyh0b3VjaCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3RvdWNoTW92ZWQpIHtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fc3RvcFByb3BhZ2F0aW9uSWZUYXJnZXRJc01lKGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfb25Ub3VjaENhbmNlbGxlZCAoZXZlbnQsIGNhcHR1cmVMaXN0ZW5lcnMpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5faGFzTmVzdGVkVmlld0dyb3VwKGV2ZW50LCBjYXB0dXJlTGlzdGVuZXJzKSkgcmV0dXJuO1xuXG4gICAgICAgIC8vIEZpbHRlIHRvdWNoIGNhbmNlbCBldmVudCBzZW5kIGZyb20gc2VsZlxuICAgICAgICBpZiAoIWV2ZW50LnNpbXVsYXRlKSB7XG4gICAgICAgICAgICBsZXQgdG91Y2ggPSBldmVudC50b3VjaDtcbiAgICAgICAgICAgIGlmKHRoaXMuY29udGVudCl7XG4gICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlUmVsZWFzZUxvZ2ljKHRvdWNoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zdG9wUHJvcGFnYXRpb25JZlRhcmdldElzTWUoZXZlbnQpO1xuICAgIH0sXG5cbiAgICBfcHJvY2Vzc0RlbHRhTW92ZSAoZGVsdGFNb3ZlKSB7XG4gICAgICAgIHRoaXMuX3Njcm9sbENoaWxkcmVuKGRlbHRhTW92ZSk7XG4gICAgICAgIHRoaXMuX2dhdGhlclRvdWNoTW92ZShkZWx0YU1vdmUpO1xuICAgIH0sXG5cbiAgICAvLyBDb250YWlucyBub2RlIGFuZ2xlIGNhbGN1bGF0aW9uc1xuICAgIF9nZXRMb2NhbEF4aXNBbGlnbkRlbHRhICh0b3VjaCkge1xuICAgICAgICB0aGlzLm5vZGUuY29udmVydFRvTm9kZVNwYWNlQVIodG91Y2guZ2V0TG9jYXRpb24oKSwgX3RlbXBQb2ludCk7XG4gICAgICAgIHRoaXMubm9kZS5jb252ZXJ0VG9Ob2RlU3BhY2VBUih0b3VjaC5nZXRQcmV2aW91c0xvY2F0aW9uKCksIF90ZW1wUHJldlBvaW50KTtcbiAgICAgICAgcmV0dXJuIF90ZW1wUG9pbnQuc3ViKF90ZW1wUHJldlBvaW50KTtcbiAgICB9LFxuXG4gICAgX2hhbmRsZU1vdmVMb2dpYyAodG91Y2gpIHtcbiAgICAgICAgbGV0IGRlbHRhTW92ZSA9IHRoaXMuX2dldExvY2FsQXhpc0FsaWduRGVsdGEodG91Y2gpO1xuICAgICAgICB0aGlzLl9wcm9jZXNzRGVsdGFNb3ZlKGRlbHRhTW92ZSk7XG4gICAgfSxcblxuICAgIF9zY3JvbGxDaGlsZHJlbiAoZGVsdGFNb3ZlKSB7XG4gICAgICAgIGRlbHRhTW92ZSA9IHRoaXMuX2NsYW1wRGVsdGEoZGVsdGFNb3ZlKTtcblxuICAgICAgICBsZXQgcmVhbE1vdmUgPSBkZWx0YU1vdmU7XG4gICAgICAgIGxldCBvdXRPZkJvdW5kYXJ5O1xuICAgICAgICBpZiAodGhpcy5lbGFzdGljKSB7XG4gICAgICAgICAgICBvdXRPZkJvdW5kYXJ5ID0gdGhpcy5fZ2V0SG93TXVjaE91dE9mQm91bmRhcnkoKTtcbiAgICAgICAgICAgIHJlYWxNb3ZlLnggKj0gKG91dE9mQm91bmRhcnkueCA9PT0gMCA/IDEgOiAwLjUpO1xuICAgICAgICAgICAgcmVhbE1vdmUueSAqPSAob3V0T2ZCb3VuZGFyeS55ID09PSAwID8gMSA6IDAuNSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuZWxhc3RpYykge1xuICAgICAgICAgICAgb3V0T2ZCb3VuZGFyeSA9IHRoaXMuX2dldEhvd011Y2hPdXRPZkJvdW5kYXJ5KHJlYWxNb3ZlKTtcbiAgICAgICAgICAgIHJlYWxNb3ZlID0gcmVhbE1vdmUuYWRkKG91dE9mQm91bmRhcnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNjcm9sbEV2ZW50VHlwZSA9IC0xO1xuXG4gICAgICAgIGlmIChyZWFsTW92ZS55ID4gMCkgeyAvL3VwXG4gICAgICAgICAgICBsZXQgaWNCb3R0b21Qb3MgPSB0aGlzLmNvbnRlbnQueSAtIHRoaXMuY29udGVudC5hbmNob3JZICogdGhpcy5jb250ZW50LmhlaWdodDtcblxuICAgICAgICAgICAgaWYgKGljQm90dG9tUG9zICsgcmVhbE1vdmUueSA+PSB0aGlzLl9ib3R0b21Cb3VuZGFyeSkge1xuICAgICAgICAgICAgICAgIHNjcm9sbEV2ZW50VHlwZSA9ICdzY3JvbGwtdG8tYm90dG9tJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyZWFsTW92ZS55IDwgMCkgeyAvL2Rvd25cbiAgICAgICAgICAgIGxldCBpY1RvcFBvcyA9IHRoaXMuY29udGVudC55IC0gdGhpcy5jb250ZW50LmFuY2hvclkgKiB0aGlzLmNvbnRlbnQuaGVpZ2h0ICsgdGhpcy5jb250ZW50LmhlaWdodDtcblxuICAgICAgICAgICAgaWYgKGljVG9wUG9zICsgcmVhbE1vdmUueSA8PSB0aGlzLl90b3BCb3VuZGFyeSkge1xuICAgICAgICAgICAgICAgIHNjcm9sbEV2ZW50VHlwZSA9ICdzY3JvbGwtdG8tdG9wJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVhbE1vdmUueCA8IDApIHsgLy9sZWZ0XG4gICAgICAgICAgICBsZXQgaWNSaWdodFBvcyA9IHRoaXMuY29udGVudC54IC0gdGhpcy5jb250ZW50LmFuY2hvclggKiB0aGlzLmNvbnRlbnQud2lkdGggKyB0aGlzLmNvbnRlbnQud2lkdGg7XG4gICAgICAgICAgICBpZiAoaWNSaWdodFBvcyArIHJlYWxNb3ZlLnggPD0gdGhpcy5fcmlnaHRCb3VuZGFyeSkge1xuICAgICAgICAgICAgICAgIHNjcm9sbEV2ZW50VHlwZSA9ICdzY3JvbGwtdG8tcmlnaHQnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHJlYWxNb3ZlLnggPiAwKSB7IC8vcmlnaHRcbiAgICAgICAgICAgIGxldCBpY0xlZnRQb3MgPSB0aGlzLmNvbnRlbnQueCAtIHRoaXMuY29udGVudC5hbmNob3JYICogdGhpcy5jb250ZW50LndpZHRoO1xuICAgICAgICAgICAgaWYgKGljTGVmdFBvcyArIHJlYWxNb3ZlLnggPj0gdGhpcy5fbGVmdEJvdW5kYXJ5KSB7XG4gICAgICAgICAgICAgICAgc2Nyb2xsRXZlbnRUeXBlID0gJ3Njcm9sbC10by1sZWZ0JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21vdmVDb250ZW50KHJlYWxNb3ZlLCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKHJlYWxNb3ZlLnggIT09IDAgfHwgcmVhbE1vdmUueSAhPT0gMCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9zY3JvbGxpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoJ3Njcm9sbC1iZWdhbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudCgnc2Nyb2xsaW5nJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2Nyb2xsRXZlbnRUeXBlICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudChzY3JvbGxFdmVudFR5cGUpO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgX2hhbmRsZVByZXNzTG9naWMgKCkge1xuICAgICAgICBpZiAodGhpcy5fYXV0b1Njcm9sbGluZykge1xuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudCgnc2Nyb2xsLWVuZGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pc0JvdW5jaW5nID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5fdG91Y2hNb3ZlUHJldmlvdXNUaW1lc3RhbXAgPSBnZXRUaW1lSW5NaWxsaXNlY29uZHMoKTtcbiAgICAgICAgdGhpcy5fdG91Y2hNb3ZlRGlzcGxhY2VtZW50cy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLl90b3VjaE1vdmVUaW1lRGVsdGFzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgdGhpcy5fb25TY3JvbGxCYXJUb3VjaEJlZ2FuKCk7XG4gICAgfSxcblxuICAgIF9jbGFtcERlbHRhIChkZWx0YSkge1xuICAgICAgICBsZXQgY29udGVudFNpemUgPSB0aGlzLmNvbnRlbnQuZ2V0Q29udGVudFNpemUoKTtcbiAgICAgICAgbGV0IHNjcm9sbFZpZXdTaXplID0gdGhpcy5fdmlldy5nZXRDb250ZW50U2l6ZSgpO1xuICAgICAgICBpZiAoY29udGVudFNpemUud2lkdGggPCBzY3JvbGxWaWV3U2l6ZS53aWR0aCkge1xuICAgICAgICAgICAgZGVsdGEueCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbnRlbnRTaXplLmhlaWdodCA8IHNjcm9sbFZpZXdTaXplLmhlaWdodCkge1xuICAgICAgICAgICAgZGVsdGEueSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVsdGE7XG4gICAgfSxcblxuICAgIF9nYXRoZXJUb3VjaE1vdmUgKGRlbHRhKSB7XG4gICAgICAgIGRlbHRhID0gdGhpcy5fY2xhbXBEZWx0YShkZWx0YSk7XG5cbiAgICAgICAgd2hpbGUgKHRoaXMuX3RvdWNoTW92ZURpc3BsYWNlbWVudHMubGVuZ3RoID49IE5VTUJFUl9PRl9HQVRIRVJFRF9UT1VDSEVTX0ZPUl9NT1ZFX1NQRUVEKSB7XG4gICAgICAgICAgICB0aGlzLl90b3VjaE1vdmVEaXNwbGFjZW1lbnRzLnNoaWZ0KCk7XG4gICAgICAgICAgICB0aGlzLl90b3VjaE1vdmVUaW1lRGVsdGFzLnNoaWZ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl90b3VjaE1vdmVEaXNwbGFjZW1lbnRzLnB1c2goZGVsdGEpO1xuXG4gICAgICAgIGxldCB0aW1lU3RhbXAgPSBnZXRUaW1lSW5NaWxsaXNlY29uZHMoKTtcbiAgICAgICAgdGhpcy5fdG91Y2hNb3ZlVGltZURlbHRhcy5wdXNoKCh0aW1lU3RhbXAgLSB0aGlzLl90b3VjaE1vdmVQcmV2aW91c1RpbWVzdGFtcCkgLyAxMDAwKTtcbiAgICAgICAgdGhpcy5fdG91Y2hNb3ZlUHJldmlvdXNUaW1lc3RhbXAgPSB0aW1lU3RhbXA7XG4gICAgfSxcblxuICAgIF9zdGFydEJvdW5jZUJhY2tJZk5lZWRlZCAoKSB7XG4gICAgICAgIGlmICghdGhpcy5lbGFzdGljKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYm91bmNlQmFja0Ftb3VudCA9IHRoaXMuX2dldEhvd011Y2hPdXRPZkJvdW5kYXJ5KCk7XG4gICAgICAgIGJvdW5jZUJhY2tBbW91bnQgPSB0aGlzLl9jbGFtcERlbHRhKGJvdW5jZUJhY2tBbW91bnQpO1xuXG4gICAgICAgIGlmIChib3VuY2VCYWNrQW1vdW50LmZ1enp5RXF1YWxzKGNjLnYyKDAsIDApLCBFUFNJTE9OKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGJvdW5jZUJhY2tUaW1lID0gTWF0aC5tYXgodGhpcy5ib3VuY2VEdXJhdGlvbiwgMCk7XG4gICAgICAgIHRoaXMuX3N0YXJ0QXV0b1Njcm9sbChib3VuY2VCYWNrQW1vdW50LCBib3VuY2VCYWNrVGltZSwgdHJ1ZSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9pc0JvdW5jaW5nKSB7XG4gICAgICAgICAgICBpZiAoYm91bmNlQmFja0Ftb3VudC55ID4gMCkgdGhpcy5fZGlzcGF0Y2hFdmVudCgnYm91bmNlLXRvcCcpO1xuICAgICAgICAgICAgaWYgKGJvdW5jZUJhY2tBbW91bnQueSA8IDApIHRoaXMuX2Rpc3BhdGNoRXZlbnQoJ2JvdW5jZS1ib3R0b20nKTtcbiAgICAgICAgICAgIGlmIChib3VuY2VCYWNrQW1vdW50LnggPiAwKSB0aGlzLl9kaXNwYXRjaEV2ZW50KCdib3VuY2UtcmlnaHQnKTtcbiAgICAgICAgICAgIGlmIChib3VuY2VCYWNrQW1vdW50LnggPCAwKSB0aGlzLl9kaXNwYXRjaEV2ZW50KCdib3VuY2UtbGVmdCcpO1xuICAgICAgICAgICAgdGhpcy5faXNCb3VuY2luZyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgX3Byb2Nlc3NJbmVydGlhU2Nyb2xsICgpIHtcbiAgICAgICAgbGV0IGJvdW5jZUJhY2tTdGFydGVkID0gdGhpcy5fc3RhcnRCb3VuY2VCYWNrSWZOZWVkZWQoKTtcbiAgICAgICAgaWYgKCFib3VuY2VCYWNrU3RhcnRlZCAmJiB0aGlzLmluZXJ0aWEpIHtcbiAgICAgICAgICAgIGxldCB0b3VjaE1vdmVWZWxvY2l0eSA9IHRoaXMuX2NhbGN1bGF0ZVRvdWNoTW92ZVZlbG9jaXR5KCk7XG4gICAgICAgICAgICBpZiAoIXRvdWNoTW92ZVZlbG9jaXR5LmZ1enp5RXF1YWxzKGNjLnYyKDAsIDApLCBFUFNJTE9OKSAmJiB0aGlzLmJyYWtlIDwgMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXJ0SW5lcnRpYVNjcm9sbCh0b3VjaE1vdmVWZWxvY2l0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9vblNjcm9sbEJhclRvdWNoRW5kZWQoKTtcbiAgICB9LFxuXG4gICAgX2hhbmRsZVJlbGVhc2VMb2dpYyAodG91Y2gpIHtcbiAgICAgICAgbGV0IGRlbHRhID0gdGhpcy5fZ2V0TG9jYWxBeGlzQWxpZ25EZWx0YSh0b3VjaCk7XG4gICAgICAgIHRoaXMuX2dhdGhlclRvdWNoTW92ZShkZWx0YSk7XG4gICAgICAgIHRoaXMuX3Byb2Nlc3NJbmVydGlhU2Nyb2xsKCk7XG4gICAgICAgIGlmICh0aGlzLl9zY3JvbGxpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9hdXRvU2Nyb2xsaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudCgnc2Nyb2xsLWVuZGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2lzT3V0T2ZCb3VuZGFyeSAoKSB7XG4gICAgICAgIGxldCBvdXRPZkJvdW5kYXJ5ID0gdGhpcy5fZ2V0SG93TXVjaE91dE9mQm91bmRhcnkoKTtcbiAgICAgICAgcmV0dXJuICFvdXRPZkJvdW5kYXJ5LmZ1enp5RXF1YWxzKGNjLnYyKDAsIDApLCBFUFNJTE9OKTtcbiAgICB9LFxuXG4gICAgX2lzTmVjZXNzYXJ5QXV0b1Njcm9sbEJyYWtlICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2F1dG9TY3JvbGxCcmFraW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9pc091dE9mQm91bmRhcnkoKSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9hdXRvU2Nyb2xsQ3VycmVudGx5T3V0T2ZCb3VuZGFyeSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2F1dG9TY3JvbGxDdXJyZW50bHlPdXRPZkJvdW5kYXJ5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsQnJha2luZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXV0b1Njcm9sbEJyYWtpbmdTdGFydFBvc2l0aW9uID0gdGhpcy5nZXRDb250ZW50UG9zaXRpb24oKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fYXV0b1Njcm9sbEN1cnJlbnRseU91dE9mQm91bmRhcnkgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgZ2V0U2Nyb2xsRW5kZWRFdmVudFRpbWluZyAoKSB7XG4gICAgICAgIHJldHVybiBFUFNJTE9OO1xuICAgIH0sXG5cbiAgICBfcHJvY2Vzc0F1dG9TY3JvbGxpbmcgKGR0KSB7XG4gICAgICAgIGxldCBpc0F1dG9TY3JvbGxCcmFrZSA9IHRoaXMuX2lzTmVjZXNzYXJ5QXV0b1Njcm9sbEJyYWtlKCk7XG4gICAgICAgIGxldCBicmFraW5nRmFjdG9yID0gaXNBdXRvU2Nyb2xsQnJha2UgPyBPVVRfT0ZfQk9VTkRBUllfQlJFQUtJTkdfRkFDVE9SIDogMTtcbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbEFjY3VtdWxhdGVkVGltZSArPSBkdCAqICgxIC8gYnJha2luZ0ZhY3Rvcik7XG5cbiAgICAgICAgbGV0IHBlcmNlbnRhZ2UgPSBNYXRoLm1pbigxLCB0aGlzLl9hdXRvU2Nyb2xsQWNjdW11bGF0ZWRUaW1lIC8gdGhpcy5fYXV0b1Njcm9sbFRvdGFsVGltZSk7XG4gICAgICAgIGlmICh0aGlzLl9hdXRvU2Nyb2xsQXR0ZW51YXRlKSB7XG4gICAgICAgICAgICBwZXJjZW50YWdlID0gcXVpbnRFYXNlT3V0KHBlcmNlbnRhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG5ld1Bvc2l0aW9uID0gdGhpcy5fYXV0b1Njcm9sbFN0YXJ0UG9zaXRpb24uYWRkKHRoaXMuX2F1dG9TY3JvbGxUYXJnZXREZWx0YS5tdWwocGVyY2VudGFnZSkpO1xuICAgICAgICBsZXQgcmVhY2hlZEVuZCA9IE1hdGguYWJzKHBlcmNlbnRhZ2UgLSAxKSA8PSBFUFNJTE9OO1xuXG4gICAgICAgIGxldCBmaXJlRXZlbnQgPSBNYXRoLmFicyhwZXJjZW50YWdlIC0gMSkgPD0gdGhpcy5nZXRTY3JvbGxFbmRlZEV2ZW50VGltaW5nKCk7XG4gICAgICAgIGlmIChmaXJlRXZlbnQgJiYgIXRoaXMuX2lzU2Nyb2xsRW5kZWRXaXRoVGhyZXNob2xkRXZlbnRGaXJlZCkge1xuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudCgnc2Nyb2xsLWVuZGVkLXdpdGgtdGhyZXNob2xkJyk7XG4gICAgICAgICAgICB0aGlzLl9pc1Njcm9sbEVuZGVkV2l0aFRocmVzaG9sZEV2ZW50RmlyZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZWxhc3RpYykge1xuICAgICAgICAgICAgbGV0IGJyYWtlT2Zmc2V0UG9zaXRpb24gPSBuZXdQb3NpdGlvbi5zdWIodGhpcy5fYXV0b1Njcm9sbEJyYWtpbmdTdGFydFBvc2l0aW9uKTtcbiAgICAgICAgICAgIGlmIChpc0F1dG9TY3JvbGxCcmFrZSkge1xuICAgICAgICAgICAgICAgIGJyYWtlT2Zmc2V0UG9zaXRpb24gPSBicmFrZU9mZnNldFBvc2l0aW9uLm11bChicmFraW5nRmFjdG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld1Bvc2l0aW9uID0gdGhpcy5fYXV0b1Njcm9sbEJyYWtpbmdTdGFydFBvc2l0aW9uLmFkZChicmFrZU9mZnNldFBvc2l0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBtb3ZlRGVsdGEgPSBuZXdQb3NpdGlvbi5zdWIodGhpcy5nZXRDb250ZW50UG9zaXRpb24oKSk7XG4gICAgICAgICAgICBsZXQgb3V0T2ZCb3VuZGFyeSA9IHRoaXMuX2dldEhvd011Y2hPdXRPZkJvdW5kYXJ5KG1vdmVEZWx0YSk7XG4gICAgICAgICAgICBpZiAoIW91dE9mQm91bmRhcnkuZnV6enlFcXVhbHMoY2MudjIoMCwgMCksIEVQU0lMT04pKSB7XG4gICAgICAgICAgICAgICAgbmV3UG9zaXRpb24gPSBuZXdQb3NpdGlvbi5hZGQob3V0T2ZCb3VuZGFyeSk7XG4gICAgICAgICAgICAgICAgcmVhY2hlZEVuZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVhY2hlZEVuZCkge1xuICAgICAgICAgICAgdGhpcy5fYXV0b1Njcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRlbHRhTW92ZSA9IG5ld1Bvc2l0aW9uLnN1Yih0aGlzLmdldENvbnRlbnRQb3NpdGlvbigpKTtcbiAgICAgICAgdGhpcy5fbW92ZUNvbnRlbnQodGhpcy5fY2xhbXBEZWx0YShkZWx0YU1vdmUpLCByZWFjaGVkRW5kKTtcbiAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudCgnc2Nyb2xsaW5nJyk7XG5cbiAgICAgICAgLy8gc2NvbGxUbyBBUEkgY29udHJvbGwgbW92ZVxuICAgICAgICBpZiAoIXRoaXMuX2F1dG9TY3JvbGxpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuX2lzQm91bmNpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudCgnc2Nyb2xsLWVuZGVkJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3N0YXJ0SW5lcnRpYVNjcm9sbCAodG91Y2hNb3ZlVmVsb2NpdHkpIHtcbiAgICAgICAgbGV0IGluZXJ0aWFUb3RhbE1vdmVtZW50ID0gdG91Y2hNb3ZlVmVsb2NpdHkubXVsKE1PVkVNRU5UX0ZBQ1RPUik7XG4gICAgICAgIHRoaXMuX3N0YXJ0QXR0ZW51YXRpbmdBdXRvU2Nyb2xsKGluZXJ0aWFUb3RhbE1vdmVtZW50LCB0b3VjaE1vdmVWZWxvY2l0eSk7XG4gICAgfSxcblxuICAgIF9jYWxjdWxhdGVBdHRlbnVhdGVkRmFjdG9yIChkaXN0YW5jZSkge1xuICAgICAgICBpZiAodGhpcy5icmFrZSA8PSAwKXtcbiAgICAgICAgICAgIHJldHVybiAoMSAtIHRoaXMuYnJha2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9hdHRlbnVhdGUgZm9ybXVsYSBmcm9tOiBodHRwOi8vbGVhcm5vcGVuZ2wuY29tLyMhTGlnaHRpbmcvTGlnaHQtY2FzdGVyc1xuICAgICAgICByZXR1cm4gKDEgLSB0aGlzLmJyYWtlKSAqICgxIC8gKDEgKyBkaXN0YW5jZSAqIDAuMDAwMDE0ICsgZGlzdGFuY2UgKiBkaXN0YW5jZSAqIDAuMDAwMDAwMDA4KSk7XG4gICAgfSxcblxuICAgIF9zdGFydEF0dGVudWF0aW5nQXV0b1Njcm9sbCAoZGVsdGFNb3ZlLCBpbml0aWFsVmVsb2NpdHkpIHtcbiAgICAgICAgbGV0IHRpbWUgPSB0aGlzLl9jYWxjdWxhdGVBdXRvU2Nyb2xsVGltZUJ5SW5pdGFsU3BlZWQoaW5pdGlhbFZlbG9jaXR5Lm1hZygpKTtcblxuXG4gICAgICAgIGxldCB0YXJnZXREZWx0YSA9IGRlbHRhTW92ZS5ub3JtYWxpemUoKTtcbiAgICAgICAgbGV0IGNvbnRlbnRTaXplID0gdGhpcy5jb250ZW50LmdldENvbnRlbnRTaXplKCk7XG4gICAgICAgIGxldCBzY3JvbGx2aWV3U2l6ZSA9IHRoaXMuX3ZpZXcuZ2V0Q29udGVudFNpemUoKTtcblxuICAgICAgICBsZXQgdG90YWxNb3ZlV2lkdGggPSAoY29udGVudFNpemUud2lkdGggLSBzY3JvbGx2aWV3U2l6ZS53aWR0aCk7XG4gICAgICAgIGxldCB0b3RhbE1vdmVIZWlnaHQgPSAoY29udGVudFNpemUuaGVpZ2h0IC0gc2Nyb2xsdmlld1NpemUuaGVpZ2h0KTtcblxuICAgICAgICBsZXQgYXR0ZW51YXRlZEZhY3RvclggPSB0aGlzLl9jYWxjdWxhdGVBdHRlbnVhdGVkRmFjdG9yKHRvdGFsTW92ZVdpZHRoKTtcbiAgICAgICAgbGV0IGF0dGVudWF0ZWRGYWN0b3JZID0gdGhpcy5fY2FsY3VsYXRlQXR0ZW51YXRlZEZhY3Rvcih0b3RhbE1vdmVIZWlnaHQpO1xuXG4gICAgICAgIHRhcmdldERlbHRhID0gY2MudjIodGFyZ2V0RGVsdGEueCAqIHRvdGFsTW92ZVdpZHRoICogKDEgLSB0aGlzLmJyYWtlKSAqIGF0dGVudWF0ZWRGYWN0b3JYLCB0YXJnZXREZWx0YS55ICogdG90YWxNb3ZlSGVpZ2h0ICogYXR0ZW51YXRlZEZhY3RvclkgKiAoMSAtIHRoaXMuYnJha2UpKTtcblxuICAgICAgICBsZXQgb3JpZ2luYWxNb3ZlTGVuZ3RoID0gZGVsdGFNb3ZlLm1hZygpO1xuICAgICAgICBsZXQgZmFjdG9yID0gdGFyZ2V0RGVsdGEubWFnKCkgLyBvcmlnaW5hbE1vdmVMZW5ndGg7XG4gICAgICAgIHRhcmdldERlbHRhID0gdGFyZ2V0RGVsdGEuYWRkKGRlbHRhTW92ZSk7XG5cbiAgICAgICAgaWYgKHRoaXMuYnJha2UgPiAwICYmIGZhY3RvciA+IDcpIHtcbiAgICAgICAgICAgIGZhY3RvciA9IE1hdGguc3FydChmYWN0b3IpO1xuICAgICAgICAgICAgdGFyZ2V0RGVsdGEgPSBkZWx0YU1vdmUubXVsKGZhY3RvcikuYWRkKGRlbHRhTW92ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5icmFrZSA+IDAgJiYgZmFjdG9yID4gMykge1xuICAgICAgICAgICAgZmFjdG9yID0gMztcbiAgICAgICAgICAgIHRpbWUgPSB0aW1lICogZmFjdG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYnJha2UgPT09IDAgJiYgZmFjdG9yID4gMSkge1xuICAgICAgICAgICAgdGltZSA9IHRpbWUgKiBmYWN0b3I7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zdGFydEF1dG9TY3JvbGwodGFyZ2V0RGVsdGEsIHRpbWUsIHRydWUpO1xuICAgIH0sXG5cbiAgICBfY2FsY3VsYXRlQXV0b1Njcm9sbFRpbWVCeUluaXRhbFNwZWVkIChpbml0YWxTcGVlZCkge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGguc3FydChpbml0YWxTcGVlZCAvIDUpKTtcbiAgICB9LFxuXG4gICAgX3N0YXJ0QXV0b1Njcm9sbCAoZGVsdGFNb3ZlLCB0aW1lSW5TZWNvbmQsIGF0dGVudWF0ZWQpIHtcbiAgICAgICAgbGV0IGFkanVzdGVkRGVsdGFNb3ZlID0gdGhpcy5fZmxhdHRlblZlY3RvckJ5RGlyZWN0aW9uKGRlbHRhTW92ZSk7XG5cbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuX2F1dG9TY3JvbGxUYXJnZXREZWx0YSA9IGFkanVzdGVkRGVsdGFNb3ZlO1xuICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsQXR0ZW51YXRlID0gYXR0ZW51YXRlZDtcbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbFN0YXJ0UG9zaXRpb24gPSB0aGlzLmdldENvbnRlbnRQb3NpdGlvbigpO1xuICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsVG90YWxUaW1lID0gdGltZUluU2Vjb25kO1xuICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsQWNjdW11bGF0ZWRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbEJyYWtpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faXNTY3JvbGxFbmRlZFdpdGhUaHJlc2hvbGRFdmVudEZpcmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2F1dG9TY3JvbGxCcmFraW5nU3RhcnRQb3NpdGlvbiA9IGNjLnYyKDAsIDApO1xuXG4gICAgICAgIGxldCBjdXJyZW50T3V0T2ZCb3VuZGFyeSA9IHRoaXMuX2dldEhvd011Y2hPdXRPZkJvdW5kYXJ5KCk7XG4gICAgICAgIGlmICghY3VycmVudE91dE9mQm91bmRhcnkuZnV6enlFcXVhbHMoY2MudjIoMCwgMCksIEVQU0lMT04pKSB7XG4gICAgICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsQ3VycmVudGx5T3V0T2ZCb3VuZGFyeSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2NhbGN1bGF0ZVRvdWNoTW92ZVZlbG9jaXR5ICgpIHtcbiAgICAgICAgbGV0IHRvdGFsVGltZSA9IDA7XG4gICAgICAgIHRvdGFsVGltZSA9IHRoaXMuX3RvdWNoTW92ZVRpbWVEZWx0YXMucmVkdWNlKGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhICsgYjtcbiAgICAgICAgfSwgdG90YWxUaW1lKTtcblxuICAgICAgICBpZiAodG90YWxUaW1lIDw9IDAgfHwgdG90YWxUaW1lID49IDAuNSkge1xuICAgICAgICAgICAgcmV0dXJuIGNjLnYyKDAsIDApO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHRvdGFsTW92ZW1lbnQgPSBjYy52MigwLCAwKTtcbiAgICAgICAgdG90YWxNb3ZlbWVudCA9IHRoaXMuX3RvdWNoTW92ZURpc3BsYWNlbWVudHMucmVkdWNlKGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhLmFkZChiKTtcbiAgICAgICAgfSwgdG90YWxNb3ZlbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIGNjLnYyKHRvdGFsTW92ZW1lbnQueCAqICgxIC0gdGhpcy5icmFrZSkgLyB0b3RhbFRpbWUsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsTW92ZW1lbnQueSAqICgxIC0gdGhpcy5icmFrZSkgLyB0b3RhbFRpbWUpO1xuICAgIH0sXG5cbiAgICBfZmxhdHRlblZlY3RvckJ5RGlyZWN0aW9uICh2ZWN0b3IpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHZlY3RvcjtcbiAgICAgICAgcmVzdWx0LnggPSB0aGlzLmhvcml6b250YWwgPyByZXN1bHQueCA6IDA7XG4gICAgICAgIHJlc3VsdC55ID0gdGhpcy52ZXJ0aWNhbCA/IHJlc3VsdC55IDogMDtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgX21vdmVDb250ZW50IChkZWx0YU1vdmUsIGNhblN0YXJ0Qm91bmNlQmFjaykge1xuICAgICAgICBsZXQgYWRqdXN0ZWRNb3ZlID0gdGhpcy5fZmxhdHRlblZlY3RvckJ5RGlyZWN0aW9uKGRlbHRhTW92ZSk7XG4gICAgICAgIGxldCBuZXdQb3NpdGlvbiA9IHRoaXMuZ2V0Q29udGVudFBvc2l0aW9uKCkuYWRkKGFkanVzdGVkTW92ZSk7XG5cbiAgICAgICAgdGhpcy5zZXRDb250ZW50UG9zaXRpb24obmV3UG9zaXRpb24pO1xuXG4gICAgICAgIGxldCBvdXRPZkJvdW5kYXJ5ID0gdGhpcy5fZ2V0SG93TXVjaE91dE9mQm91bmRhcnkoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlU2Nyb2xsQmFyKG91dE9mQm91bmRhcnkpO1xuXG4gICAgICAgIGlmICh0aGlzLmVsYXN0aWMgJiYgY2FuU3RhcnRCb3VuY2VCYWNrKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGFydEJvdW5jZUJhY2tJZk5lZWRlZCgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9nZXRDb250ZW50TGVmdEJvdW5kYXJ5ICgpIHtcbiAgICAgICAgbGV0IGNvbnRlbnRQb3MgPSB0aGlzLmdldENvbnRlbnRQb3NpdGlvbigpO1xuICAgICAgICByZXR1cm4gY29udGVudFBvcy54IC0gdGhpcy5jb250ZW50LmdldEFuY2hvclBvaW50KCkueCAqIHRoaXMuY29udGVudC5nZXRDb250ZW50U2l6ZSgpLndpZHRoO1xuICAgIH0sXG5cbiAgICBfZ2V0Q29udGVudFJpZ2h0Qm91bmRhcnkgKCkge1xuICAgICAgICBsZXQgY29udGVudFNpemUgPSB0aGlzLmNvbnRlbnQuZ2V0Q29udGVudFNpemUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldENvbnRlbnRMZWZ0Qm91bmRhcnkoKSArIGNvbnRlbnRTaXplLndpZHRoO1xuICAgIH0sXG5cbiAgICBfZ2V0Q29udGVudFRvcEJvdW5kYXJ5ICgpIHtcbiAgICAgICAgbGV0IGNvbnRlbnRTaXplID0gdGhpcy5jb250ZW50LmdldENvbnRlbnRTaXplKCk7XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRDb250ZW50Qm90dG9tQm91bmRhcnkoKSArIGNvbnRlbnRTaXplLmhlaWdodDtcbiAgICB9LFxuXG4gICAgX2dldENvbnRlbnRCb3R0b21Cb3VuZGFyeSAoKSB7XG4gICAgICAgIGxldCBjb250ZW50UG9zID0gdGhpcy5nZXRDb250ZW50UG9zaXRpb24oKTtcbiAgICAgICAgcmV0dXJuIGNvbnRlbnRQb3MueSAtIHRoaXMuY29udGVudC5nZXRBbmNob3JQb2ludCgpLnkgKiB0aGlzLmNvbnRlbnQuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQ7XG4gICAgfSxcblxuICAgIF9nZXRIb3dNdWNoT3V0T2ZCb3VuZGFyeSAoYWRkaXRpb24pIHtcbiAgICAgICAgYWRkaXRpb24gPSBhZGRpdGlvbiB8fCBjYy52MigwLCAwKTtcbiAgICAgICAgaWYgKGFkZGl0aW9uLmZ1enp5RXF1YWxzKGNjLnYyKDAsIDApLCBFUFNJTE9OKSAmJiAhdGhpcy5fb3V0T2ZCb3VuZGFyeUFtb3VudERpcnR5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3V0T2ZCb3VuZGFyeUFtb3VudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBvdXRPZkJvdW5kYXJ5QW1vdW50ID0gY2MudjIoMCwgMCk7XG4gICAgICAgIGlmICh0aGlzLl9nZXRDb250ZW50TGVmdEJvdW5kYXJ5KCkgKyBhZGRpdGlvbi54ID4gdGhpcy5fbGVmdEJvdW5kYXJ5KSB7XG4gICAgICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50LnggPSB0aGlzLl9sZWZ0Qm91bmRhcnkgLSAodGhpcy5fZ2V0Q29udGVudExlZnRCb3VuZGFyeSgpICsgYWRkaXRpb24ueCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fZ2V0Q29udGVudFJpZ2h0Qm91bmRhcnkoKSArIGFkZGl0aW9uLnggPCB0aGlzLl9yaWdodEJvdW5kYXJ5KSB7XG4gICAgICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50LnggPSB0aGlzLl9yaWdodEJvdW5kYXJ5IC0gKHRoaXMuX2dldENvbnRlbnRSaWdodEJvdW5kYXJ5KCkgKyBhZGRpdGlvbi54KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9nZXRDb250ZW50VG9wQm91bmRhcnkoKSArIGFkZGl0aW9uLnkgPCB0aGlzLl90b3BCb3VuZGFyeSkge1xuICAgICAgICAgICAgb3V0T2ZCb3VuZGFyeUFtb3VudC55ID0gdGhpcy5fdG9wQm91bmRhcnkgLSAodGhpcy5fZ2V0Q29udGVudFRvcEJvdW5kYXJ5KCkgKyBhZGRpdGlvbi55KTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9nZXRDb250ZW50Qm90dG9tQm91bmRhcnkoKSArIGFkZGl0aW9uLnkgPiB0aGlzLl9ib3R0b21Cb3VuZGFyeSkge1xuICAgICAgICAgICAgb3V0T2ZCb3VuZGFyeUFtb3VudC55ID0gdGhpcy5fYm90dG9tQm91bmRhcnkgLSAodGhpcy5fZ2V0Q29udGVudEJvdHRvbUJvdW5kYXJ5KCkgKyBhZGRpdGlvbi55KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhZGRpdGlvbi5mdXp6eUVxdWFscyhjYy52MigwLCAwKSwgRVBTSUxPTikpIHtcbiAgICAgICAgICAgIHRoaXMuX291dE9mQm91bmRhcnlBbW91bnQgPSBvdXRPZkJvdW5kYXJ5QW1vdW50O1xuICAgICAgICAgICAgdGhpcy5fb3V0T2ZCb3VuZGFyeUFtb3VudERpcnR5ID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50ID0gdGhpcy5fY2xhbXBEZWx0YShvdXRPZkJvdW5kYXJ5QW1vdW50KTtcblxuICAgICAgICByZXR1cm4gb3V0T2ZCb3VuZGFyeUFtb3VudDtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZVNjcm9sbEJhclN0YXRlICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRlbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY29udGVudFNpemUgPSB0aGlzLmNvbnRlbnQuZ2V0Q29udGVudFNpemUoKTtcbiAgICAgICAgbGV0IHNjcm9sbFZpZXdTaXplID0gdGhpcy5fdmlldy5nZXRDb250ZW50U2l6ZSgpO1xuICAgICAgICBpZiAodGhpcy52ZXJ0aWNhbFNjcm9sbEJhcikge1xuICAgICAgICAgICAgaWYgKGNvbnRlbnRTaXplLmhlaWdodCA8IHNjcm9sbFZpZXdTaXplLmhlaWdodCkge1xuICAgICAgICAgICAgICAgIHRoaXMudmVydGljYWxTY3JvbGxCYXIuaGlkZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2FsU2Nyb2xsQmFyLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmhvcml6b250YWxTY3JvbGxCYXIpIHtcbiAgICAgICAgICAgIGlmIChjb250ZW50U2l6ZS53aWR0aCA8IHNjcm9sbFZpZXdTaXplLndpZHRoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsU2Nyb2xsQmFyLmhpZGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsU2Nyb2xsQmFyLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXBkYXRlU2Nyb2xsQmFyIChvdXRPZkJvdW5kYXJ5KSB7XG4gICAgICAgIGlmICh0aGlzLmhvcml6b250YWxTY3JvbGxCYXIpIHtcbiAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbFNjcm9sbEJhci5fb25TY3JvbGwob3V0T2ZCb3VuZGFyeSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy52ZXJ0aWNhbFNjcm9sbEJhcikge1xuICAgICAgICAgICAgdGhpcy52ZXJ0aWNhbFNjcm9sbEJhci5fb25TY3JvbGwob3V0T2ZCb3VuZGFyeSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX29uU2Nyb2xsQmFyVG91Y2hCZWdhbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmhvcml6b250YWxTY3JvbGxCYXIpIHtcbiAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbFNjcm9sbEJhci5fb25Ub3VjaEJlZ2FuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy52ZXJ0aWNhbFNjcm9sbEJhcikge1xuICAgICAgICAgICAgdGhpcy52ZXJ0aWNhbFNjcm9sbEJhci5fb25Ub3VjaEJlZ2FuKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX29uU2Nyb2xsQmFyVG91Y2hFbmRlZCAoKSB7XG4gICAgICAgIGlmICh0aGlzLmhvcml6b250YWxTY3JvbGxCYXIpIHtcbiAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbFNjcm9sbEJhci5fb25Ub3VjaEVuZGVkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy52ZXJ0aWNhbFNjcm9sbEJhcikge1xuICAgICAgICAgICAgdGhpcy52ZXJ0aWNhbFNjcm9sbEJhci5fb25Ub3VjaEVuZGVkKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2Rpc3BhdGNoRXZlbnQgKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudCA9PT0gJ3Njcm9sbC1lbmRlZCcpIHtcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbEV2ZW50RW1pdE1hc2sgPSAwO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgPT09ICdzY3JvbGwtdG8tdG9wJ1xuICAgICAgICAgICAgICAgICAgIHx8IGV2ZW50ID09PSAnc2Nyb2xsLXRvLWJvdHRvbSdcbiAgICAgICAgICAgICAgICAgICB8fCBldmVudCA9PT0gJ3Njcm9sbC10by1sZWZ0J1xuICAgICAgICAgICAgICAgICAgIHx8IGV2ZW50ID09PSAnc2Nyb2xsLXRvLXJpZ2h0Jykge1xuXG4gICAgICAgICAgICBsZXQgZmxhZyA9ICgxIDw8IGV2ZW50TWFwW2V2ZW50XSk7XG4gICAgICAgICAgICBpZiAodGhpcy5fc2Nyb2xsRXZlbnRFbWl0TWFzayAmIGZsYWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbEV2ZW50RW1pdE1hc2sgfD0gZmxhZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIuZW1pdEV2ZW50cyh0aGlzLnNjcm9sbEV2ZW50cywgdGhpcywgZXZlbnRNYXBbZXZlbnRdKTtcbiAgICAgICAgdGhpcy5ub2RlLmVtaXQoZXZlbnQsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfYWRqdXN0Q29udGVudE91dE9mQm91bmRhcnkgKCkge1xuICAgICAgICB0aGlzLl9vdXRPZkJvdW5kYXJ5QW1vdW50RGlydHkgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5faXNPdXRPZkJvdW5kYXJ5KCkpIHtcbiAgICAgICAgICAgIGxldCBvdXRPZkJvdW5kYXJ5ID0gdGhpcy5fZ2V0SG93TXVjaE91dE9mQm91bmRhcnkoY2MudjIoMCwgMCkpO1xuICAgICAgICAgICAgbGV0IG5ld1Bvc2l0aW9uID0gdGhpcy5nZXRDb250ZW50UG9zaXRpb24oKS5hZGQob3V0T2ZCb3VuZGFyeSk7XG4gICAgICAgICAgICBpZiAodGhpcy5jb250ZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnNldFBvc2l0aW9uKG5ld1Bvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVTY3JvbGxCYXIoMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RhcnQgKCkge1xuICAgICAgICB0aGlzLl9jYWxjdWxhdGVCb3VuZGFyeSgpO1xuICAgICAgICAvL0JlY2F1c2Ugd2lkZ2V0IGNvbXBvbmVudCB3aWxsIGFkanVzdCBjb250ZW50IHBvc2l0aW9uIGFuZCBzY3JvbGx2aWV3IHBvc2l0aW9uIGlzIGNvcnJlY3QgYWZ0ZXIgdmlzaXRcbiAgICAgICAgLy9TbyB0aGlzIGV2ZW50IGNvdWxkIG1ha2Ugc3VyZSB0aGUgY29udGVudCBpcyBvbiB0aGUgY29ycmVjdCBwb3NpdGlvbiBhZnRlciBsb2FkaW5nLlxuICAgICAgICBpZiAodGhpcy5jb250ZW50KSB7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5vbmNlKGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9EUkFXLCB0aGlzLl9hZGp1c3RDb250ZW50T3V0T2ZCb3VuZGFyeSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2hpZGVTY3JvbGxiYXIgKCkge1xuICAgICAgICBpZiAodGhpcy5ob3Jpem9udGFsU2Nyb2xsQmFyKSB7XG4gICAgICAgICAgICB0aGlzLmhvcml6b250YWxTY3JvbGxCYXIuaGlkZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudmVydGljYWxTY3JvbGxCYXIpIHtcbiAgICAgICAgICAgIHRoaXMudmVydGljYWxTY3JvbGxCYXIuaGlkZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRGlzYWJsZSAoKSB7XG4gICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB0aGlzLl91bnJlZ2lzdGVyRXZlbnQoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQub2ZmKE5vZGVFdmVudC5TSVpFX0NIQU5HRUQsIHRoaXMuX2NhbGN1bGF0ZUJvdW5kYXJ5LCB0aGlzKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQub2ZmKE5vZGVFdmVudC5TQ0FMRV9DSEFOR0VELCB0aGlzLl9jYWxjdWxhdGVCb3VuZGFyeSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3ZpZXcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlldy5vZmYoTm9kZUV2ZW50LlBPU0lUSU9OX0NIQU5HRUQsIHRoaXMuX2NhbGN1bGF0ZUJvdW5kYXJ5LCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlldy5vZmYoTm9kZUV2ZW50LlNDQUxFX0NIQU5HRUQsIHRoaXMuX2NhbGN1bGF0ZUJvdW5kYXJ5LCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlldy5vZmYoTm9kZUV2ZW50LlNJWkVfQ0hBTkdFRCwgdGhpcy5fY2FsY3VsYXRlQm91bmRhcnksIHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9oaWRlU2Nyb2xsYmFyKCk7XG4gICAgICAgIHRoaXMuc3RvcEF1dG9TY3JvbGwoKTtcbiAgICB9LFxuXG4gICAgb25FbmFibGUgKCkge1xuICAgICAgICBpZiAoIUNDX0VESVRPUikge1xuICAgICAgICAgICAgdGhpcy5fcmVnaXN0ZXJFdmVudCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuY29udGVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5vbihOb2RlRXZlbnQuU0laRV9DSEFOR0VELCB0aGlzLl9jYWxjdWxhdGVCb3VuZGFyeSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50Lm9uKE5vZGVFdmVudC5TQ0FMRV9DSEFOR0VELCB0aGlzLl9jYWxjdWxhdGVCb3VuZGFyeSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3ZpZXcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlldy5vbihOb2RlRXZlbnQuUE9TSVRJT05fQ0hBTkdFRCwgdGhpcy5fY2FsY3VsYXRlQm91bmRhcnksIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl92aWV3Lm9uKE5vZGVFdmVudC5TQ0FMRV9DSEFOR0VELCB0aGlzLl9jYWxjdWxhdGVCb3VuZGFyeSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXcub24oTm9kZUV2ZW50LlNJWkVfQ0hBTkdFRCwgdGhpcy5fY2FsY3VsYXRlQm91bmRhcnksIHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl91cGRhdGVTY3JvbGxCYXJTdGF0ZSgpO1xuICAgIH0sXG5cbiAgICB1cGRhdGUgKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLl9hdXRvU2Nyb2xsaW5nKSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzQXV0b1Njcm9sbGluZyhkdCk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuU2Nyb2xsVmlldyA9IG1vZHVsZS5leHBvcnRzID0gU2Nyb2xsVmlldztcblxuLyoqXG4gKiAhI2VuXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXG4gKiAhI3poXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcbiAqIEBldmVudCBzY3JvbGwtdG8tdG9wXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxuICogQHBhcmFtIHtTY3JvbGxWaWV3fSBzY3JvbGxWaWV3IC0gVGhlIFNjcm9sbFZpZXcgY29tcG9uZW50LlxuICovXG5cbi8qKlxuICogISNlblxuICogTm90ZTogVGhpcyBldmVudCBpcyBlbWl0dGVkIGZyb20gdGhlIG5vZGUgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBiZWxvbmdzLlxuICogISN6aFxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXG4gKiBAZXZlbnQgc2Nyb2xsLXRvLWJvdHRvbVxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqIEBwYXJhbSB7U2Nyb2xsVmlld30gc2Nyb2xsVmlldyAtIFRoZSBTY3JvbGxWaWV3IGNvbXBvbmVudC5cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IHNjcm9sbC10by1sZWZ0XG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxuICogQHBhcmFtIHtTY3JvbGxWaWV3fSBzY3JvbGxWaWV3IC0gVGhlIFNjcm9sbFZpZXcgY29tcG9uZW50LlxuICovXG5cbi8qKlxuICogISNlblxuICogTm90ZTogVGhpcyBldmVudCBpcyBlbWl0dGVkIGZyb20gdGhlIG5vZGUgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBiZWxvbmdzLlxuICogISN6aFxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXG4gKiBAZXZlbnQgc2Nyb2xsLXRvLXJpZ2h0XG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxuICogQHBhcmFtIHtTY3JvbGxWaWV3fSBzY3JvbGxWaWV3IC0gVGhlIFNjcm9sbFZpZXcgY29tcG9uZW50LlxuICovXG5cbi8qKlxuICogISNlblxuICogTm90ZTogVGhpcyBldmVudCBpcyBlbWl0dGVkIGZyb20gdGhlIG5vZGUgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBiZWxvbmdzLlxuICogISN6aFxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXG4gKiBAZXZlbnQgc2Nyb2xsaW5nXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxuICogQHBhcmFtIHtTY3JvbGxWaWV3fSBzY3JvbGxWaWV3IC0gVGhlIFNjcm9sbFZpZXcgY29tcG9uZW50LlxuICovXG5cbi8qKlxuICogISNlblxuICogTm90ZTogVGhpcyBldmVudCBpcyBlbWl0dGVkIGZyb20gdGhlIG5vZGUgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBiZWxvbmdzLlxuICogISN6aFxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXG4gKiBAZXZlbnQgYm91bmNlLWJvdHRvbVxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqIEBwYXJhbSB7U2Nyb2xsVmlld30gc2Nyb2xsVmlldyAtIFRoZSBTY3JvbGxWaWV3IGNvbXBvbmVudC5cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IGJvdW5jZS10b3BcbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XG4gKiBAcGFyYW0ge1Njcm9sbFZpZXd9IHNjcm9sbFZpZXcgLSBUaGUgU2Nyb2xsVmlldyBjb21wb25lbnQuXG4gKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXG4gKiAhI3poXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcbiAqIEBldmVudCBib3VuY2UtbGVmdFxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqIEBwYXJhbSB7U2Nyb2xsVmlld30gc2Nyb2xsVmlldyAtIFRoZSBTY3JvbGxWaWV3IGNvbXBvbmVudC5cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IGJvdW5jZS1yaWdodFxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqIEBwYXJhbSB7U2Nyb2xsVmlld30gc2Nyb2xsVmlldyAtIFRoZSBTY3JvbGxWaWV3IGNvbXBvbmVudC5cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IHNjcm9sbC1lbmRlZFxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqIEBwYXJhbSB7U2Nyb2xsVmlld30gc2Nyb2xsVmlldyAtIFRoZSBTY3JvbGxWaWV3IGNvbXBvbmVudC5cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IHRvdWNoLXVwXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxuICogQHBhcmFtIHtTY3JvbGxWaWV3fSBzY3JvbGxWaWV3IC0gVGhlIFNjcm9sbFZpZXcgY29tcG9uZW50LlxuICovXG5cbiAvKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IHNjcm9sbC1iZWdhblxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqIEBwYXJhbSB7U2Nyb2xsVmlld30gc2Nyb2xsVmlldyAtIFRoZSBTY3JvbGxWaWV3IGNvbXBvbmVudC5cbiAqL1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=