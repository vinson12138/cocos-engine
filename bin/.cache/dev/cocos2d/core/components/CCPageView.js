
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCPageView.js';
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

/**
 * !#en The Page View Size Mode
 * !#zh 页面视图每个页面统一的大小类型
 * @enum PageView.SizeMode
 */
var SizeMode = cc.Enum({
  /**
   * !#en Each page is unified in size
   * !#zh 每个页面统一大小
   * @property {Number} Unified
   */
  Unified: 0,

  /**
   * !#en Each page is in free size
   * !#zh 每个页面大小随意
   * @property {Number} Free
   */
  Free: 1
});
/**
 * !#en The Page View Direction
 * !#zh 页面视图滚动类型
 * @enum PageView.Direction
 */

var Direction = cc.Enum({
  /**
   * !#en Horizontal scroll.
   * !#zh 水平滚动
   * @property {Number} Horizontal
   */
  Horizontal: 0,

  /**
   * !#en Vertical scroll.
   * !#zh 垂直滚动
   * @property {Number} Vertical
   */
  Vertical: 1
});
/**
 * !#en Enum for ScrollView event type.
 * !#zh 滚动视图事件类型
 * @enum PageView.EventType
 */

var EventType = cc.Enum({
  /**
   * !#en The page turning event
   * !#zh 翻页事件
   * @property {Number} PAGE_TURNING
   */
  PAGE_TURNING: 0
});
/**
 * !#en The PageView control
 * !#zh 页面视图组件
 * @class PageView
 * @extends ScrollView
 */

var PageView = cc.Class({
  name: 'cc.PageView',
  "extends": cc.ScrollView,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.ui/PageView',
    help: 'i18n:COMPONENT.help_url.pageview',
    inspector: 'packages://inspector/inspectors/comps/ccpageview.js',
    executeInEditMode: false
  },
  ctor: function ctor() {
    this._curPageIdx = 0;
    this._lastPageIdx = 0;
    this._pages = [];
    this._initContentPos = cc.v2();
    this._scrollCenterOffsetX = []; // 每一个页面居中时需要的偏移量（X）

    this._scrollCenterOffsetY = []; // 每一个页面居中时需要的偏移量（Y）
  },
  properties: {
    /**
     * !#en Specify the size type of each page in PageView.
     * !#zh 页面视图中每个页面大小类型
     * @property {PageView.SizeMode} sizeMode
     */
    sizeMode: {
      "default": SizeMode.Unified,
      type: SizeMode,
      tooltip: CC_DEV && 'i18n:COMPONENT.pageview.sizeMode',
      notify: function notify() {
        this._syncSizeMode();
      }
    },

    /**
     * !#en The page view direction
     * !#zh 页面视图滚动类型
     * @property {PageView.Direction} direction
     */
    direction: {
      "default": Direction.Horizontal,
      type: Direction,
      tooltip: CC_DEV && 'i18n:COMPONENT.pageview.direction',
      notify: function notify() {
        this._syncScrollDirection();
      }
    },

    /**
     * !#en
     * The scroll threshold value, when drag exceeds this value,
     * release the next page will automatically scroll, less than the restore
     * !#zh 滚动临界值，默认单位百分比，当拖拽超出该数值时，松开会自动滚动下一页，小于时则还原。
     * @property {Number} scrollThreshold
     */
    scrollThreshold: {
      "default": 0.5,
      type: cc.Float,
      slide: true,
      range: [0, 1, 0.01],
      tooltip: CC_DEV && 'i18n:COMPONENT.pageview.scrollThreshold'
    },

    /**
     * !#en
     * Auto page turning velocity threshold. When users swipe the PageView quickly,
     * it will calculate a velocity based on the scroll distance and time,
     * if the calculated velocity is larger than the threshold, then it will trigger page turning.
     * !#zh
     * 快速滑动翻页临界值。
     * 当用户快速滑动时，会根据滑动开始和结束的距离与时间计算出一个速度值，
     * 该值与此临界值相比较，如果大于临界值，则进行自动翻页。
     * @property {Number} autoPageTurningThreshold
     */
    autoPageTurningThreshold: {
      "default": 100,
      type: cc.Float,
      tooltip: CC_DEV && 'i18n:COMPONENT.pageview.autoPageTurningThreshold'
    },

    /**
     * !#en Change the PageTurning event timing of PageView.
     * !#zh 设置 PageView PageTurning 事件的发送时机。
     * @property {Number} pageTurningEventTiming
     */
    pageTurningEventTiming: {
      "default": 0.1,
      type: cc.Float,
      range: [0, 1, 0.01],
      tooltip: CC_DEV && 'i18n:COMPONENT.pageview.pageTurningEventTiming'
    },

    /**
     * !#en The Page View Indicator
     * !#zh 页面视图指示器组件
     * @property {PageViewIndicator} indicator
     */
    indicator: {
      "default": null,
      type: cc.PageViewIndicator,
      tooltip: CC_DEV && 'i18n:COMPONENT.pageview.indicator',
      notify: function notify() {
        if (this.indicator) {
          this.indicator.setPageView(this);
        }
      }
    },

    /**
     * !#en The time required to turn over a page. unit: second
     * !#zh 每个页面翻页时所需时间。单位：秒
     * @property {Number} pageTurningSpeed
     */
    pageTurningSpeed: {
      "default": 0.3,
      type: cc.Float,
      tooltip: CC_DEV && 'i18n:COMPONENT.pageview.pageTurningSpeed'
    },

    /**
     * !#en PageView events callback
     * !#zh 滚动视图的事件回调函数
     * @property {Component.EventHandler[]} pageEvents
     */
    pageEvents: {
      "default": [],
      type: cc.Component.EventHandler,
      tooltip: CC_DEV && 'i18n:COMPONENT.pageview.pageEvents'
    }
  },
  statics: {
    SizeMode: SizeMode,
    Direction: Direction,
    EventType: EventType
  },
  onEnable: function onEnable() {
    this._super();

    this.node.on(cc.Node.EventType.SIZE_CHANGED, this._updateAllPagesSize, this);

    if (!CC_EDITOR) {
      this.node.on('scroll-ended-with-threshold', this._dispatchPageTurningEvent, this);
    }
  },
  onDisable: function onDisable() {
    this._super();

    this.node.off(cc.Node.EventType.SIZE_CHANGED, this._updateAllPagesSize, this);

    if (!CC_EDITOR) {
      this.node.off('scroll-ended-with-threshold', this._dispatchPageTurningEvent, this);
    }
  },
  onLoad: function onLoad() {
    this._initPages();

    if (this.indicator) {
      this.indicator.setPageView(this);
    }
  },

  /**
   * !#en Returns current page index
   * !#zh 返回当前页面索引
   * @method getCurrentPageIndex
   * @returns {Number}
   */
  getCurrentPageIndex: function getCurrentPageIndex() {
    return this._curPageIdx;
  },

  /**
   * !#en Set current page index
   * !#zh 设置当前页面索引
   * @method setCurrentPageIndex
   * @param {Number} index
   */
  setCurrentPageIndex: function setCurrentPageIndex(index) {
    this.scrollToPage(index, true);
  },

  /**
   * !#en Returns all pages of pageview
   * !#zh 返回视图中的所有页面
   * @method getPages
   * @returns {Node[]}
   */
  getPages: function getPages() {
    return this._pages;
  },

  /**
   * !#en At the end of the current page view to insert a new view
   * !#zh 在当前页面视图的尾部插入一个新视图
   * @method addPage
   * @param {Node} page
   */
  addPage: function addPage(page) {
    if (!page || this._pages.indexOf(page) !== -1 || !this.content) return;
    this.content.addChild(page);

    this._pages.push(page);

    this._updatePageView();
  },

  /**
   * !#en Inserts a page in the specified location
   * !#zh 将页面插入指定位置中
   * @method insertPage
   * @param {Node} page
   * @param {Number} index
   */
  insertPage: function insertPage(page, index) {
    if (index < 0 || !page || this._pages.indexOf(page) !== -1 || !this.content) return;
    var pageCount = this._pages.length;
    if (index >= pageCount) this.addPage(page);else {
      this._pages.splice(index, 0, page);

      this.content.addChild(page);

      this._updatePageView();
    }
  },

  /**
   * !#en Removes a page from PageView.
   * !#zh 移除指定页面
   * @method removePage
   * @param {Node} page
   */
  removePage: function removePage(page) {
    if (!page || !this.content) return;

    var index = this._pages.indexOf(page);

    if (index === -1) {
      cc.warnID(4300, page.name);
      return;
    }

    this.removePageAtIndex(index);
  },

  /**
   * !#en Removes a page at index of PageView.
   * !#zh 移除指定下标的页面
   * @method removePageAtIndex
   * @param {Number} index
   */
  removePageAtIndex: function removePageAtIndex(index) {
    var pageList = this._pages;
    if (index < 0 || index >= pageList.length) return;
    var page = pageList[index];
    if (!page) return;
    this.content.removeChild(page);
    pageList.splice(index, 1);

    this._updatePageView();
  },

  /**
   * !#en Removes all pages from PageView
   * !#zh 移除所有页面
   * @method removeAllPages
   */
  removeAllPages: function removeAllPages() {
    if (!this.content) {
      return;
    }

    var locPages = this._pages;

    for (var i = 0, len = locPages.length; i < len; i++) {
      this.content.removeChild(locPages[i]);
    }

    this._pages.length = 0;

    this._updatePageView();
  },

  /**
   * !#en Scroll PageView to index.
   * !#zh 滚动到指定页面
   * @method scrollToPage
   * @param {Number} idx index of page.
   * @param {Number} timeInSecond scrolling time
   */
  scrollToPage: function scrollToPage(idx, timeInSecond) {
    if (idx < 0 || idx >= this._pages.length) return;
    timeInSecond = timeInSecond !== undefined ? timeInSecond : 0.3;
    this._curPageIdx = idx;
    this.scrollToOffset(this._moveOffsetValue(idx), timeInSecond, true);

    if (this.indicator) {
      this.indicator._changedState();
    }
  },
  //override the method of ScrollView
  getScrollEndedEventTiming: function getScrollEndedEventTiming() {
    return this.pageTurningEventTiming;
  },
  _syncScrollDirection: function _syncScrollDirection() {
    this.horizontal = this.direction === Direction.Horizontal;
    this.vertical = this.direction === Direction.Vertical;
  },
  _syncSizeMode: function _syncSizeMode() {
    if (!this.content) {
      return;
    }

    var layout = this.content.getComponent(cc.Layout);

    if (layout) {
      if (this.sizeMode === SizeMode.Free && this._pages.length > 0) {
        var lastPage = this._pages[this._pages.length - 1];

        if (this.direction === Direction.Horizontal) {
          layout.paddingLeft = (this._view.width - this._pages[0].width) / 2;
          layout.paddingRight = (this._view.width - lastPage.width) / 2;
        } else if (this.direction === Direction.Vertical) {
          layout.paddingTop = (this._view.height - this._pages[0].height) / 2;
          layout.paddingBottom = (this._view.height - lastPage.height) / 2;
        }
      }

      layout.updateLayout();
    }
  },
  // 刷新页面视图
  _updatePageView: function _updatePageView() {
    // 当页面数组变化时修改 content 大小
    var layout = this.content.getComponent(cc.Layout);

    if (layout && layout.enabled) {
      layout.updateLayout();
    }

    var pageCount = this._pages.length;

    if (this._curPageIdx >= pageCount) {
      this._curPageIdx = pageCount === 0 ? 0 : pageCount - 1;
      this._lastPageIdx = this._curPageIdx;
    } // 进行排序


    var contentPos = this._initContentPos;

    for (var i = 0; i < pageCount; ++i) {
      var page = this._pages[i];
      page.setSiblingIndex(i);

      if (this.direction === Direction.Horizontal) {
        this._scrollCenterOffsetX[i] = Math.abs(contentPos.x + page.x);
      } else {
        this._scrollCenterOffsetY[i] = Math.abs(contentPos.y + page.y);
      }
    } // 刷新 indicator 信息与状态


    if (this.indicator) {
      this.indicator._refresh();
    }
  },
  // 刷新所有页面的大小
  _updateAllPagesSize: function _updateAllPagesSize() {
    if (this.sizeMode !== SizeMode.Unified || !this._view) {
      return;
    }

    var locPages = CC_EDITOR ? this.content.children : this._pages;

    var selfSize = this._view.getContentSize();

    for (var i = 0, len = locPages.length; i < len; i++) {
      locPages[i].setContentSize(selfSize);
    }
  },
  // 初始化页面
  _initPages: function _initPages() {
    if (!this.content) {
      return;
    }

    this._initContentPos = this.content.position;
    var children = this.content.children;

    for (var i = 0; i < children.length; ++i) {
      var page = children[i];

      if (this._pages.indexOf(page) >= 0) {
        continue;
      }

      this._pages.push(page);
    }

    this._syncScrollDirection();

    this._syncSizeMode();

    this._updatePageView();
  },
  _dispatchPageTurningEvent: function _dispatchPageTurningEvent() {
    if (this._lastPageIdx === this._curPageIdx) return;
    this._lastPageIdx = this._curPageIdx;
    cc.Component.EventHandler.emitEvents(this.pageEvents, this, EventType.PAGE_TURNING);
    this.node.emit('page-turning', this);
  },
  // 是否超过自动滚动临界值
  _isScrollable: function _isScrollable(offset, index, nextIndex) {
    if (this.sizeMode === SizeMode.Free) {
      var curPageCenter, nextPageCenter;

      if (this.direction === Direction.Horizontal) {
        curPageCenter = this._scrollCenterOffsetX[index];
        nextPageCenter = this._scrollCenterOffsetX[nextIndex];
        return Math.abs(offset.x) >= Math.abs(curPageCenter - nextPageCenter) * this.scrollThreshold;
      } else if (this.direction === Direction.Vertical) {
        curPageCenter = this._scrollCenterOffsetY[index];
        nextPageCenter = this._scrollCenterOffsetY[nextIndex];
        return Math.abs(offset.y) >= Math.abs(curPageCenter - nextPageCenter) * this.scrollThreshold;
      }
    } else {
      if (this.direction === Direction.Horizontal) {
        return Math.abs(offset.x) >= this._view.width * this.scrollThreshold;
      } else if (this.direction === Direction.Vertical) {
        return Math.abs(offset.y) >= this._view.height * this.scrollThreshold;
      }
    }
  },
  // 快速滑动
  _isQuicklyScrollable: function _isQuicklyScrollable(touchMoveVelocity) {
    if (this.direction === Direction.Horizontal) {
      if (Math.abs(touchMoveVelocity.x) > this.autoPageTurningThreshold) {
        return true;
      }
    } else if (this.direction === Direction.Vertical) {
      if (Math.abs(touchMoveVelocity.y) > this.autoPageTurningThreshold) {
        return true;
      }
    }

    return false;
  },
  // 通过 idx 获取偏移值数值
  _moveOffsetValue: function _moveOffsetValue(idx) {
    var offset = cc.v2(0, 0);

    if (this.sizeMode === SizeMode.Free) {
      if (this.direction === Direction.Horizontal) {
        offset.x = this._scrollCenterOffsetX[idx];
      } else if (this.direction === Direction.Vertical) {
        offset.y = this._scrollCenterOffsetY[idx];
      }
    } else {
      if (this.direction === Direction.Horizontal) {
        offset.x = idx * this._view.width;
      } else if (this.direction === Direction.Vertical) {
        offset.y = idx * this._view.height;
      }
    }

    return offset;
  },
  _getDragDirection: function _getDragDirection(moveOffset) {
    if (this.direction === Direction.Horizontal) {
      if (moveOffset.x === 0) {
        return 0;
      }

      return moveOffset.x > 0 ? 1 : -1;
    } else if (this.direction === Direction.Vertical) {
      // 由于滚动 Y 轴的原点在在右上角所以应该是小于 0
      if (moveOffset.y === 0) {
        return 0;
      }

      return moveOffset.y < 0 ? 1 : -1;
    }
  },
  _handleReleaseLogic: function _handleReleaseLogic(touch) {
    this._autoScrollToPage();

    if (this._scrolling) {
      this._scrolling = false;

      if (!this._autoScrolling) {
        this._dispatchEvent('scroll-ended');
      }
    }
  },
  _autoScrollToPage: function _autoScrollToPage() {
    var bounceBackStarted = this._startBounceBackIfNeeded();

    if (bounceBackStarted) {
      var bounceBackAmount = this._getHowMuchOutOfBoundary();

      bounceBackAmount = this._clampDelta(bounceBackAmount);

      if (bounceBackAmount.x > 0 || bounceBackAmount.y < 0) {
        this._curPageIdx = this._pages.length === 0 ? 0 : this._pages.length - 1;
      }

      if (bounceBackAmount.x < 0 || bounceBackAmount.y > 0) {
        this._curPageIdx = 0;
      }

      if (this.indicator) {
        this.indicator._changedState();
      }
    } else {
      var moveOffset = this._touchBeganPosition.sub(this._touchEndPosition);

      var index = this._curPageIdx,
          nextIndex = index + this._getDragDirection(moveOffset);

      var timeInSecond = this.pageTurningSpeed * Math.abs(index - nextIndex);

      if (nextIndex < this._pages.length) {
        if (this._isScrollable(moveOffset, index, nextIndex)) {
          this.scrollToPage(nextIndex, timeInSecond);
          return;
        } else {
          var touchMoveVelocity = this._calculateTouchMoveVelocity();

          if (this._isQuicklyScrollable(touchMoveVelocity)) {
            this.scrollToPage(nextIndex, timeInSecond);
            return;
          }
        }
      }

      this.scrollToPage(index, timeInSecond);
    }
  },
  _onTouchBegan: function _onTouchBegan(event, captureListeners) {
    this._touchBeganPosition = event.touch.getLocation();

    this._super(event, captureListeners);
  },
  _onTouchMoved: function _onTouchMoved(event, captureListeners) {
    this._super(event, captureListeners);
  },
  _onTouchEnded: function _onTouchEnded(event, captureListeners) {
    this._touchEndPosition = event.touch.getLocation();

    this._super(event, captureListeners);
  },
  _onTouchCancelled: function _onTouchCancelled(event, captureListeners) {
    this._touchEndPosition = event.touch.getLocation();

    this._super(event, captureListeners);
  },
  _onMouseWheel: function _onMouseWheel() {}
});
cc.PageView = module.exports = PageView;
/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event page-turning
 * @param {Event.EventCustom} event
 * @param {PageView} pageView - The PageView component.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvQ0NQYWdlVmlldy5qcyJdLCJuYW1lcyI6WyJTaXplTW9kZSIsImNjIiwiRW51bSIsIlVuaWZpZWQiLCJGcmVlIiwiRGlyZWN0aW9uIiwiSG9yaXpvbnRhbCIsIlZlcnRpY2FsIiwiRXZlbnRUeXBlIiwiUEFHRV9UVVJOSU5HIiwiUGFnZVZpZXciLCJDbGFzcyIsIm5hbWUiLCJTY3JvbGxWaWV3IiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwibWVudSIsImhlbHAiLCJpbnNwZWN0b3IiLCJleGVjdXRlSW5FZGl0TW9kZSIsImN0b3IiLCJfY3VyUGFnZUlkeCIsIl9sYXN0UGFnZUlkeCIsIl9wYWdlcyIsIl9pbml0Q29udGVudFBvcyIsInYyIiwiX3Njcm9sbENlbnRlck9mZnNldFgiLCJfc2Nyb2xsQ2VudGVyT2Zmc2V0WSIsInByb3BlcnRpZXMiLCJzaXplTW9kZSIsInR5cGUiLCJ0b29sdGlwIiwiQ0NfREVWIiwibm90aWZ5IiwiX3N5bmNTaXplTW9kZSIsImRpcmVjdGlvbiIsIl9zeW5jU2Nyb2xsRGlyZWN0aW9uIiwic2Nyb2xsVGhyZXNob2xkIiwiRmxvYXQiLCJzbGlkZSIsInJhbmdlIiwiYXV0b1BhZ2VUdXJuaW5nVGhyZXNob2xkIiwicGFnZVR1cm5pbmdFdmVudFRpbWluZyIsImluZGljYXRvciIsIlBhZ2VWaWV3SW5kaWNhdG9yIiwic2V0UGFnZVZpZXciLCJwYWdlVHVybmluZ1NwZWVkIiwicGFnZUV2ZW50cyIsIkNvbXBvbmVudCIsIkV2ZW50SGFuZGxlciIsInN0YXRpY3MiLCJvbkVuYWJsZSIsIl9zdXBlciIsIm5vZGUiLCJvbiIsIk5vZGUiLCJTSVpFX0NIQU5HRUQiLCJfdXBkYXRlQWxsUGFnZXNTaXplIiwiX2Rpc3BhdGNoUGFnZVR1cm5pbmdFdmVudCIsIm9uRGlzYWJsZSIsIm9mZiIsIm9uTG9hZCIsIl9pbml0UGFnZXMiLCJnZXRDdXJyZW50UGFnZUluZGV4Iiwic2V0Q3VycmVudFBhZ2VJbmRleCIsImluZGV4Iiwic2Nyb2xsVG9QYWdlIiwiZ2V0UGFnZXMiLCJhZGRQYWdlIiwicGFnZSIsImluZGV4T2YiLCJjb250ZW50IiwiYWRkQ2hpbGQiLCJwdXNoIiwiX3VwZGF0ZVBhZ2VWaWV3IiwiaW5zZXJ0UGFnZSIsInBhZ2VDb3VudCIsImxlbmd0aCIsInNwbGljZSIsInJlbW92ZVBhZ2UiLCJ3YXJuSUQiLCJyZW1vdmVQYWdlQXRJbmRleCIsInBhZ2VMaXN0IiwicmVtb3ZlQ2hpbGQiLCJyZW1vdmVBbGxQYWdlcyIsImxvY1BhZ2VzIiwiaSIsImxlbiIsImlkeCIsInRpbWVJblNlY29uZCIsInVuZGVmaW5lZCIsInNjcm9sbFRvT2Zmc2V0IiwiX21vdmVPZmZzZXRWYWx1ZSIsIl9jaGFuZ2VkU3RhdGUiLCJnZXRTY3JvbGxFbmRlZEV2ZW50VGltaW5nIiwiaG9yaXpvbnRhbCIsInZlcnRpY2FsIiwibGF5b3V0IiwiZ2V0Q29tcG9uZW50IiwiTGF5b3V0IiwibGFzdFBhZ2UiLCJwYWRkaW5nTGVmdCIsIl92aWV3Iiwid2lkdGgiLCJwYWRkaW5nUmlnaHQiLCJwYWRkaW5nVG9wIiwiaGVpZ2h0IiwicGFkZGluZ0JvdHRvbSIsInVwZGF0ZUxheW91dCIsImVuYWJsZWQiLCJjb250ZW50UG9zIiwic2V0U2libGluZ0luZGV4IiwiTWF0aCIsImFicyIsIngiLCJ5IiwiX3JlZnJlc2giLCJjaGlsZHJlbiIsInNlbGZTaXplIiwiZ2V0Q29udGVudFNpemUiLCJzZXRDb250ZW50U2l6ZSIsInBvc2l0aW9uIiwiZW1pdEV2ZW50cyIsImVtaXQiLCJfaXNTY3JvbGxhYmxlIiwib2Zmc2V0IiwibmV4dEluZGV4IiwiY3VyUGFnZUNlbnRlciIsIm5leHRQYWdlQ2VudGVyIiwiX2lzUXVpY2tseVNjcm9sbGFibGUiLCJ0b3VjaE1vdmVWZWxvY2l0eSIsIl9nZXREcmFnRGlyZWN0aW9uIiwibW92ZU9mZnNldCIsIl9oYW5kbGVSZWxlYXNlTG9naWMiLCJ0b3VjaCIsIl9hdXRvU2Nyb2xsVG9QYWdlIiwiX3Njcm9sbGluZyIsIl9hdXRvU2Nyb2xsaW5nIiwiX2Rpc3BhdGNoRXZlbnQiLCJib3VuY2VCYWNrU3RhcnRlZCIsIl9zdGFydEJvdW5jZUJhY2tJZk5lZWRlZCIsImJvdW5jZUJhY2tBbW91bnQiLCJfZ2V0SG93TXVjaE91dE9mQm91bmRhcnkiLCJfY2xhbXBEZWx0YSIsIl90b3VjaEJlZ2FuUG9zaXRpb24iLCJzdWIiLCJfdG91Y2hFbmRQb3NpdGlvbiIsIl9jYWxjdWxhdGVUb3VjaE1vdmVWZWxvY2l0eSIsIl9vblRvdWNoQmVnYW4iLCJldmVudCIsImNhcHR1cmVMaXN0ZW5lcnMiLCJnZXRMb2NhdGlvbiIsIl9vblRvdWNoTW92ZWQiLCJfb25Ub3VjaEVuZGVkIiwiX29uVG91Y2hDYW5jZWxsZWQiLCJfb25Nb3VzZVdoZWVsIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJQSxRQUFRLEdBQUdDLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQ25CO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsT0FBTyxFQUFFLENBTlU7O0FBT25CO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsSUFBSSxFQUFFO0FBWmEsQ0FBUixDQUFmO0FBZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFJQyxTQUFTLEdBQUdKLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQ3BCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSUksRUFBQUEsVUFBVSxFQUFFLENBTlE7O0FBT3BCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsUUFBUSxFQUFFO0FBWlUsQ0FBUixD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LE1BQUwsQ0FBWWlHLEtBQVosRUFBbUJDLGdCQUFuQjtBQUNILEdBOWZtQjtBQWdnQnBCRSxFQUFBQSxhQUFhLEVBQUUsdUJBQVVILEtBQVYsRUFBaUJDLGdCQUFqQixFQUFtQztBQUM5QyxTQUFLbEcsTUFBTCxDQUFZaUcsS0FBWixFQUFtQkMsZ0JBQW5CO0FBQ0gsR0FsZ0JtQjtBQW9nQnBCRyxFQUFBQSxhQUFhLEVBQUUsdUJBQVVKLEtBQVYsRUFBaUJDLGdCQUFqQixFQUFtQztBQUM5QyxTQUFLSixpQkFBTCxHQUF5QkcsS0FBSyxDQUFDZixLQUFOLENBQVlpQixXQUFaLEVBQXpCOztBQUNBLFNBQUtuRyxNQUFMLENBQVlpRyxLQUFaLEVBQW1CQyxnQkFBbkI7QUFDSCxHQXZnQm1CO0FBeWdCcEJJLEVBQUFBLGlCQUFpQixFQUFFLDJCQUFVTCxLQUFWLEVBQWlCQyxnQkFBakIsRUFBbUM7QUFDbEQsU0FBS0osaUJBQUwsR0FBeUJHLEtBQUssQ0FBQ2YsS0FBTixDQUFZaUIsV0FBWixFQUF6Qjs7QUFDQSxTQUFLbkcsTUFBTCxDQUFZaUcsS0FBWixFQUFtQkMsZ0JBQW5CO0FBQ0gsR0E1Z0JtQjtBQThnQnBCSyxFQUFBQSxhQUFhLEVBQUUseUJBQVksQ0FBRztBQTlnQlYsQ0FBVCxDQUFmO0FBaWhCQTFKLEVBQUUsQ0FBQ1MsUUFBSCxHQUFja0osTUFBTSxDQUFDQyxPQUFQLEdBQWlCbkosUUFBL0I7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqXG4gKiAhI2VuIFRoZSBQYWdlIFZpZXcgU2l6ZSBNb2RlXG4gKiAhI3poIOmhtemdouinhuWbvuavj+S4qumhtemdoue7n+S4gOeahOWkp+Wwj+exu+Wei1xuICogQGVudW0gUGFnZVZpZXcuU2l6ZU1vZGVcbiAqL1xudmFyIFNpemVNb2RlID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBFYWNoIHBhZ2UgaXMgdW5pZmllZCBpbiBzaXplXG4gICAgICogISN6aCDmr4/kuKrpobXpnaLnu5/kuIDlpKflsI9cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gVW5pZmllZFxuICAgICAqL1xuICAgIFVuaWZpZWQ6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBFYWNoIHBhZ2UgaXMgaW4gZnJlZSBzaXplXG4gICAgICogISN6aCDmr4/kuKrpobXpnaLlpKflsI/pmo/mhI9cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gRnJlZVxuICAgICAqL1xuICAgIEZyZWU6IDFcbn0pO1xuXG4vKipcbiAqICEjZW4gVGhlIFBhZ2UgVmlldyBEaXJlY3Rpb25cbiAqICEjemgg6aG16Z2i6KeG5Zu+5rua5Yqo57G75Z6LXG4gKiBAZW51bSBQYWdlVmlldy5EaXJlY3Rpb25cbiAqL1xudmFyIERpcmVjdGlvbiA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqICEjZW4gSG9yaXpvbnRhbCBzY3JvbGwuXG4gICAgICogISN6aCDmsLTlubPmu5rliqhcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gSG9yaXpvbnRhbFxuICAgICAqL1xuICAgIEhvcml6b250YWw6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBWZXJ0aWNhbCBzY3JvbGwuXG4gICAgICogISN6aCDlnoLnm7Tmu5rliqhcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gVmVydGljYWxcbiAgICAgKi9cbiAgICBWZXJ0aWNhbDogMVxufSk7XG5cbi8qKlxuICogISNlbiBFbnVtIGZvciBTY3JvbGxWaWV3IGV2ZW50IHR5cGUuXG4gKiAhI3poIOa7muWKqOinhuWbvuS6i+S7tuexu+Wei1xuICogQGVudW0gUGFnZVZpZXcuRXZlbnRUeXBlXG4gKi9cbnZhciBFdmVudFR5cGUgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBwYWdlIHR1cm5pbmcgZXZlbnRcbiAgICAgKiAhI3poIOe/u+mhteS6i+S7tlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBQQUdFX1RVUk5JTkdcbiAgICAgKi9cbiAgICBQQUdFX1RVUk5JTkc6IDBcblxufSk7XG5cbi8qKlxuICogISNlbiBUaGUgUGFnZVZpZXcgY29udHJvbFxuICogISN6aCDpobXpnaLop4blm77nu4Tku7ZcbiAqIEBjbGFzcyBQYWdlVmlld1xuICogQGV4dGVuZHMgU2Nyb2xsVmlld1xuICovXG52YXIgUGFnZVZpZXcgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlBhZ2VWaWV3JyxcbiAgICBleHRlbmRzOiBjYy5TY3JvbGxWaWV3LFxuXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnVpL1BhZ2VWaWV3JyxcbiAgICAgICAgaGVscDogJ2kxOG46Q09NUE9ORU5ULmhlbHBfdXJsLnBhZ2V2aWV3JyxcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9jY3BhZ2V2aWV3LmpzJyxcbiAgICAgICAgZXhlY3V0ZUluRWRpdE1vZGU6IGZhbHNlXG4gICAgfSxcblxuICAgIGN0b3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fY3VyUGFnZUlkeCA9IDA7XG4gICAgICAgIHRoaXMuX2xhc3RQYWdlSWR4ID0gMDtcbiAgICAgICAgdGhpcy5fcGFnZXMgPSBbXTtcbiAgICAgICAgdGhpcy5faW5pdENvbnRlbnRQb3MgPSBjYy52MigpO1xuICAgICAgICB0aGlzLl9zY3JvbGxDZW50ZXJPZmZzZXRYID0gW107IC8vIOavj+S4gOS4qumhtemdouWxheS4reaXtumcgOimgeeahOWBj+enu+mHj++8iFjvvIlcbiAgICAgICAgdGhpcy5fc2Nyb2xsQ2VudGVyT2Zmc2V0WSA9IFtdOyAvLyDmr4/kuIDkuKrpobXpnaLlsYXkuK3ml7bpnIDopoHnmoTlgY/np7vph4/vvIhZ77yJXG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBTcGVjaWZ5IHRoZSBzaXplIHR5cGUgb2YgZWFjaCBwYWdlIGluIFBhZ2VWaWV3LlxuICAgICAgICAgKiAhI3poIOmhtemdouinhuWbvuS4reavj+S4qumhtemdouWkp+Wwj+exu+Wei1xuICAgICAgICAgKiBAcHJvcGVydHkge1BhZ2VWaWV3LlNpemVNb2RlfSBzaXplTW9kZVxuICAgICAgICAgKi9cbiAgICAgICAgc2l6ZU1vZGU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFNpemVNb2RlLlVuaWZpZWQsXG4gICAgICAgICAgICB0eXBlOiBTaXplTW9kZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGFnZXZpZXcuc2l6ZU1vZGUnLFxuICAgICAgICAgICAgbm90aWZ5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zeW5jU2l6ZU1vZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgcGFnZSB2aWV3IGRpcmVjdGlvblxuICAgICAgICAgKiAhI3poIOmhtemdouinhuWbvua7muWKqOexu+Wei1xuICAgICAgICAgKiBAcHJvcGVydHkge1BhZ2VWaWV3LkRpcmVjdGlvbn0gZGlyZWN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBkaXJlY3Rpb246IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IERpcmVjdGlvbi5Ib3Jpem9udGFsLFxuICAgICAgICAgICAgdHlwZTogRGlyZWN0aW9uLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5wYWdldmlldy5kaXJlY3Rpb24nLFxuICAgICAgICAgICAgbm90aWZ5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zeW5jU2Nyb2xsRGlyZWN0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIHNjcm9sbCB0aHJlc2hvbGQgdmFsdWUsIHdoZW4gZHJhZyBleGNlZWRzIHRoaXMgdmFsdWUsXG4gICAgICAgICAqIHJlbGVhc2UgdGhlIG5leHQgcGFnZSB3aWxsIGF1dG9tYXRpY2FsbHkgc2Nyb2xsLCBsZXNzIHRoYW4gdGhlIHJlc3RvcmVcbiAgICAgICAgICogISN6aCDmu5rliqjkuLTnlYzlgLzvvIzpu5jorqTljZXkvY3nmb7liIbmr5TvvIzlvZPmi5bmi73otoXlh7ror6XmlbDlgLzml7bvvIzmnb7lvIDkvJroh6rliqjmu5rliqjkuIvkuIDpobXvvIzlsI/kuo7ml7bliJnov5jljp/jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHNjcm9sbFRocmVzaG9sZFxuICAgICAgICAgKi9cbiAgICAgICAgc2Nyb2xsVGhyZXNob2xkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAwLjUsXG4gICAgICAgICAgICB0eXBlOiBjYy5GbG9hdCxcbiAgICAgICAgICAgIHNsaWRlOiB0cnVlLFxuICAgICAgICAgICAgcmFuZ2U6IFswLCAxLCAwLjAxXSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGFnZXZpZXcuc2Nyb2xsVGhyZXNob2xkJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIEF1dG8gcGFnZSB0dXJuaW5nIHZlbG9jaXR5IHRocmVzaG9sZC4gV2hlbiB1c2VycyBzd2lwZSB0aGUgUGFnZVZpZXcgcXVpY2tseSxcbiAgICAgICAgICogaXQgd2lsbCBjYWxjdWxhdGUgYSB2ZWxvY2l0eSBiYXNlZCBvbiB0aGUgc2Nyb2xsIGRpc3RhbmNlIGFuZCB0aW1lLFxuICAgICAgICAgKiBpZiB0aGUgY2FsY3VsYXRlZCB2ZWxvY2l0eSBpcyBsYXJnZXIgdGhhbiB0aGUgdGhyZXNob2xkLCB0aGVuIGl0IHdpbGwgdHJpZ2dlciBwYWdlIHR1cm5pbmcuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5b+r6YCf5ruR5Yqo57+76aG15Li055WM5YC844CCXG4gICAgICAgICAqIOW9k+eUqOaIt+W/q+mAn+a7keWKqOaXtu+8jOS8muagueaNrua7keWKqOW8gOWni+WSjOe7k+adn+eahOi3neemu+S4juaXtumXtOiuoeeul+WHuuS4gOS4qumAn+W6puWAvO+8jFxuICAgICAgICAgKiDor6XlgLzkuI7mraTkuLTnlYzlgLznm7jmr5TovoPvvIzlpoLmnpzlpKfkuo7kuLTnlYzlgLzvvIzliJnov5vooYzoh6rliqjnv7vpobXjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGF1dG9QYWdlVHVybmluZ1RocmVzaG9sZFxuICAgICAgICAgKi9cbiAgICAgICAgYXV0b1BhZ2VUdXJuaW5nVGhyZXNob2xkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAxMDAsXG4gICAgICAgICAgICB0eXBlOiBjYy5GbG9hdCxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGFnZXZpZXcuYXV0b1BhZ2VUdXJuaW5nVGhyZXNob2xkJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIENoYW5nZSB0aGUgUGFnZVR1cm5pbmcgZXZlbnQgdGltaW5nIG9mIFBhZ2VWaWV3LlxuICAgICAgICAgKiAhI3poIOiuvue9riBQYWdlVmlldyBQYWdlVHVybmluZyDkuovku7bnmoTlj5HpgIHml7bmnLrjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHBhZ2VUdXJuaW5nRXZlbnRUaW1pbmdcbiAgICAgICAgICovXG4gICAgICAgIHBhZ2VUdXJuaW5nRXZlbnRUaW1pbmc6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAuMSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkZsb2F0LFxuICAgICAgICAgICAgcmFuZ2U6IFswLCAxLCAwLjAxXSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGFnZXZpZXcucGFnZVR1cm5pbmdFdmVudFRpbWluZydcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgUGFnZSBWaWV3IEluZGljYXRvclxuICAgICAgICAgKiAhI3poIOmhtemdouinhuWbvuaMh+ekuuWZqOe7hOS7tlxuICAgICAgICAgKiBAcHJvcGVydHkge1BhZ2VWaWV3SW5kaWNhdG9yfSBpbmRpY2F0b3JcbiAgICAgICAgICovXG4gICAgICAgIGluZGljYXRvcjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlBhZ2VWaWV3SW5kaWNhdG9yLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5wYWdldmlldy5pbmRpY2F0b3InLFxuICAgICAgICAgICAgbm90aWZ5OiAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5kaWNhdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kaWNhdG9yLnNldFBhZ2VWaWV3KHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgdGltZSByZXF1aXJlZCB0byB0dXJuIG92ZXIgYSBwYWdlLiB1bml0OiBzZWNvbmRcbiAgICAgICAgICogISN6aCDmr4/kuKrpobXpnaLnv7vpobXml7bmiYDpnIDml7bpl7TjgILljZXkvY3vvJrnp5JcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHBhZ2VUdXJuaW5nU3BlZWRcbiAgICAgICAgICovXG4gICAgICAgIHBhZ2VUdXJuaW5nU3BlZWQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAuMyxcbiAgICAgICAgICAgIHR5cGU6IGNjLkZsb2F0LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5wYWdldmlldy5wYWdlVHVybmluZ1NwZWVkJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFBhZ2VWaWV3IGV2ZW50cyBjYWxsYmFja1xuICAgICAgICAgKiAhI3poIOa7muWKqOinhuWbvueahOS6i+S7tuWbnuiwg+WHveaVsFxuICAgICAgICAgKiBAcHJvcGVydHkge0NvbXBvbmVudC5FdmVudEhhbmRsZXJbXX0gcGFnZUV2ZW50c1xuICAgICAgICAgKi9cbiAgICAgICAgcGFnZUV2ZW50czoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5wYWdldmlldy5wYWdlRXZlbnRzJ1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgU2l6ZU1vZGU6IFNpemVNb2RlLFxuICAgICAgICBEaXJlY3Rpb246IERpcmVjdGlvbixcbiAgICAgICAgRXZlbnRUeXBlOiBFdmVudFR5cGVcbiAgICB9LFxuXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgdGhpcy5fdXBkYXRlQWxsUGFnZXNTaXplLCB0aGlzKTtcbiAgICAgICAgaWYoIUNDX0VESVRPUikge1xuICAgICAgICAgICAgdGhpcy5ub2RlLm9uKCdzY3JvbGwtZW5kZWQtd2l0aC10aHJlc2hvbGQnLCB0aGlzLl9kaXNwYXRjaFBhZ2VUdXJuaW5nRXZlbnQsIHRoaXMpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgdGhpcy5fdXBkYXRlQWxsUGFnZXNTaXplLCB0aGlzKTtcbiAgICAgICAgaWYoIUNDX0VESVRPUikge1xuICAgICAgICAgICAgdGhpcy5ub2RlLm9mZignc2Nyb2xsLWVuZGVkLXdpdGgtdGhyZXNob2xkJywgdGhpcy5fZGlzcGF0Y2hQYWdlVHVybmluZ0V2ZW50LCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5faW5pdFBhZ2VzKCk7XG4gICAgICAgIGlmICh0aGlzLmluZGljYXRvcikge1xuICAgICAgICAgICAgdGhpcy5pbmRpY2F0b3Iuc2V0UGFnZVZpZXcodGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIGN1cnJlbnQgcGFnZSBpbmRleFxuICAgICAqICEjemgg6L+U5Zue5b2T5YmN6aG16Z2i57Si5byVXG4gICAgICogQG1ldGhvZCBnZXRDdXJyZW50UGFnZUluZGV4XG4gICAgICogQHJldHVybnMge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRDdXJyZW50UGFnZUluZGV4OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJQYWdlSWR4O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCBjdXJyZW50IHBhZ2UgaW5kZXhcbiAgICAgKiAhI3poIOiuvue9ruW9k+WJjemhtemdoue0ouW8lVxuICAgICAqIEBtZXRob2Qgc2V0Q3VycmVudFBhZ2VJbmRleFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICAgICAqL1xuICAgIHNldEN1cnJlbnRQYWdlSW5kZXg6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB0aGlzLnNjcm9sbFRvUGFnZShpbmRleCwgdHJ1ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyBhbGwgcGFnZXMgb2YgcGFnZXZpZXdcbiAgICAgKiAhI3poIOi/lOWbnuinhuWbvuS4reeahOaJgOaciemhtemdolxuICAgICAqIEBtZXRob2QgZ2V0UGFnZXNcbiAgICAgKiBAcmV0dXJucyB7Tm9kZVtdfVxuICAgICAqL1xuICAgIGdldFBhZ2VzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYWdlcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBBdCB0aGUgZW5kIG9mIHRoZSBjdXJyZW50IHBhZ2UgdmlldyB0byBpbnNlcnQgYSBuZXcgdmlld1xuICAgICAqICEjemgg5Zyo5b2T5YmN6aG16Z2i6KeG5Zu+55qE5bC+6YOo5o+S5YWl5LiA5Liq5paw6KeG5Zu+XG4gICAgICogQG1ldGhvZCBhZGRQYWdlXG4gICAgICogQHBhcmFtIHtOb2RlfSBwYWdlXG4gICAgICovXG4gICAgYWRkUGFnZTogZnVuY3Rpb24gKHBhZ2UpIHtcbiAgICAgICAgaWYgKCFwYWdlIHx8IHRoaXMuX3BhZ2VzLmluZGV4T2YocGFnZSkgIT09IC0xIHx8ICF0aGlzLmNvbnRlbnQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuY29udGVudC5hZGRDaGlsZChwYWdlKTtcbiAgICAgICAgdGhpcy5fcGFnZXMucHVzaChwYWdlKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlUGFnZVZpZXcoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBJbnNlcnRzIGEgcGFnZSBpbiB0aGUgc3BlY2lmaWVkIGxvY2F0aW9uXG4gICAgICogISN6aCDlsIbpobXpnaLmj5LlhaXmjIflrprkvY3nva7kuK1cbiAgICAgKiBAbWV0aG9kIGluc2VydFBhZ2VcbiAgICAgKiBAcGFyYW0ge05vZGV9IHBhZ2VcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXhcbiAgICAgKi9cbiAgICBpbnNlcnRQYWdlOiBmdW5jdGlvbiAocGFnZSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGluZGV4IDwgMCB8fCAhcGFnZSB8fCB0aGlzLl9wYWdlcy5pbmRleE9mKHBhZ2UpICE9PSAtMSB8fCAhdGhpcy5jb250ZW50KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgcGFnZUNvdW50ID0gdGhpcy5fcGFnZXMubGVuZ3RoO1xuICAgICAgICBpZiAoaW5kZXggPj0gcGFnZUNvdW50KVxuICAgICAgICAgICAgdGhpcy5hZGRQYWdlKHBhZ2UpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3BhZ2VzLnNwbGljZShpbmRleCwgMCwgcGFnZSk7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuYWRkQ2hpbGQocGFnZSk7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVQYWdlVmlldygpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmVtb3ZlcyBhIHBhZ2UgZnJvbSBQYWdlVmlldy5cbiAgICAgKiAhI3poIOenu+mZpOaMh+WumumhtemdolxuICAgICAqIEBtZXRob2QgcmVtb3ZlUGFnZVxuICAgICAqIEBwYXJhbSB7Tm9kZX0gcGFnZVxuICAgICAqL1xuICAgIHJlbW92ZVBhZ2U6IGZ1bmN0aW9uIChwYWdlKSB7XG4gICAgICAgIGlmICghcGFnZSB8fCAhdGhpcy5jb250ZW50KSByZXR1cm47XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuX3BhZ2VzLmluZGV4T2YocGFnZSk7XG4gICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgIGNjLndhcm5JRCg0MzAwLCBwYWdlLm5hbWUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVtb3ZlUGFnZUF0SW5kZXgoaW5kZXgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJlbW92ZXMgYSBwYWdlIGF0IGluZGV4IG9mIFBhZ2VWaWV3LlxuICAgICAqICEjemgg56e76Zmk5oyH5a6a5LiL5qCH55qE6aG16Z2iXG4gICAgICogQG1ldGhvZCByZW1vdmVQYWdlQXRJbmRleFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICAgICAqL1xuICAgIHJlbW92ZVBhZ2VBdEluZGV4OiBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgdmFyIHBhZ2VMaXN0ID0gdGhpcy5fcGFnZXM7XG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gcGFnZUxpc3QubGVuZ3RoKSByZXR1cm47XG4gICAgICAgIHZhciBwYWdlID0gcGFnZUxpc3RbaW5kZXhdO1xuICAgICAgICBpZiAoIXBhZ2UpIHJldHVybjtcbiAgICAgICAgdGhpcy5jb250ZW50LnJlbW92ZUNoaWxkKHBhZ2UpO1xuICAgICAgICBwYWdlTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB0aGlzLl91cGRhdGVQYWdlVmlldygpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJlbW92ZXMgYWxsIHBhZ2VzIGZyb20gUGFnZVZpZXdcbiAgICAgKiAhI3poIOenu+mZpOaJgOaciemhtemdolxuICAgICAqIEBtZXRob2QgcmVtb3ZlQWxsUGFnZXNcbiAgICAgKi9cbiAgICByZW1vdmVBbGxQYWdlczogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuY29udGVudCkgeyByZXR1cm47IH1cbiAgICAgICAgdmFyIGxvY1BhZ2VzID0gdGhpcy5fcGFnZXM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsb2NQYWdlcy5sZW5ndGg7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5yZW1vdmVDaGlsZChsb2NQYWdlc1tpXSk7XG4gICAgICAgIHRoaXMuX3BhZ2VzLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVBhZ2VWaWV3KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2Nyb2xsIFBhZ2VWaWV3IHRvIGluZGV4LlxuICAgICAqICEjemgg5rua5Yqo5Yiw5oyH5a6a6aG16Z2iXG4gICAgICogQG1ldGhvZCBzY3JvbGxUb1BhZ2VcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaWR4IGluZGV4IG9mIHBhZ2UuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVJblNlY29uZCBzY3JvbGxpbmcgdGltZVxuICAgICAqL1xuICAgIHNjcm9sbFRvUGFnZTogZnVuY3Rpb24gKGlkeCwgdGltZUluU2Vjb25kKSB7XG4gICAgICAgIGlmIChpZHggPCAwIHx8IGlkeCA+PSB0aGlzLl9wYWdlcy5sZW5ndGgpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRpbWVJblNlY29uZCA9IHRpbWVJblNlY29uZCAhPT0gdW5kZWZpbmVkID8gdGltZUluU2Vjb25kIDogMC4zO1xuICAgICAgICB0aGlzLl9jdXJQYWdlSWR4ID0gaWR4O1xuICAgICAgICB0aGlzLnNjcm9sbFRvT2Zmc2V0KHRoaXMuX21vdmVPZmZzZXRWYWx1ZShpZHgpLCB0aW1lSW5TZWNvbmQsIHRydWUpO1xuICAgICAgICBpZiAodGhpcy5pbmRpY2F0b3IpIHtcbiAgICAgICAgICAgIHRoaXMuaW5kaWNhdG9yLl9jaGFuZ2VkU3RhdGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvL292ZXJyaWRlIHRoZSBtZXRob2Qgb2YgU2Nyb2xsVmlld1xuICAgIGdldFNjcm9sbEVuZGVkRXZlbnRUaW1pbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFnZVR1cm5pbmdFdmVudFRpbWluZztcbiAgICB9LFxuXG4gICAgX3N5bmNTY3JvbGxEaXJlY3Rpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5ob3Jpem9udGFsID0gdGhpcy5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5Ib3Jpem9udGFsO1xuICAgICAgICB0aGlzLnZlcnRpY2FsID0gdGhpcy5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5WZXJ0aWNhbDtcbiAgICB9LFxuXG4gICAgX3N5bmNTaXplTW9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuY29udGVudCkgeyByZXR1cm47IH1cbiAgICAgICAgdmFyIGxheW91dCA9IHRoaXMuY29udGVudC5nZXRDb21wb25lbnQoY2MuTGF5b3V0KTtcbiAgICAgICAgaWYgKGxheW91dCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2l6ZU1vZGUgPT09IFNpemVNb2RlLkZyZWUgJiYgdGhpcy5fcGFnZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBsYXN0UGFnZSA9IHRoaXMuX3BhZ2VzW3RoaXMuX3BhZ2VzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkhvcml6b250YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgbGF5b3V0LnBhZGRpbmdMZWZ0ID0gKHRoaXMuX3ZpZXcud2lkdGggLSB0aGlzLl9wYWdlc1swXS53aWR0aCkgLyAyO1xuICAgICAgICAgICAgICAgICAgICBsYXlvdXQucGFkZGluZ1JpZ2h0ID0gKHRoaXMuX3ZpZXcud2lkdGggLSBsYXN0UGFnZS53aWR0aCkgLyAyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLlZlcnRpY2FsKSB7XG4gICAgICAgICAgICAgICAgICAgIGxheW91dC5wYWRkaW5nVG9wID0gKHRoaXMuX3ZpZXcuaGVpZ2h0IC0gdGhpcy5fcGFnZXNbMF0uaGVpZ2h0KSAvIDI7XG4gICAgICAgICAgICAgICAgICAgIGxheW91dC5wYWRkaW5nQm90dG9tID0gKHRoaXMuX3ZpZXcuaGVpZ2h0IC0gbGFzdFBhZ2UuaGVpZ2h0KSAvIDI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGF5b3V0LnVwZGF0ZUxheW91dCgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOWIt+aWsOmhtemdouinhuWbvlxuICAgIF91cGRhdGVQYWdlVmlldzogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyDlvZPpobXpnaLmlbDnu4Tlj5jljJbml7bkv67mlLkgY29udGVudCDlpKflsI9cbiAgICAgICAgdmFyIGxheW91dCA9IHRoaXMuY29udGVudC5nZXRDb21wb25lbnQoY2MuTGF5b3V0KTtcbiAgICAgICAgaWYgKGxheW91dCAmJiBsYXlvdXQuZW5hYmxlZCkge1xuICAgICAgICAgICAgbGF5b3V0LnVwZGF0ZUxheW91dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHBhZ2VDb3VudCA9IHRoaXMuX3BhZ2VzLmxlbmd0aDtcblxuICAgICAgICBpZiAodGhpcy5fY3VyUGFnZUlkeCA+PSBwYWdlQ291bnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2N1clBhZ2VJZHggPSBwYWdlQ291bnQgPT09IDAgPyAwIDogcGFnZUNvdW50IC0gMTtcbiAgICAgICAgICAgIHRoaXMuX2xhc3RQYWdlSWR4ID0gdGhpcy5fY3VyUGFnZUlkeDtcbiAgICAgICAgfVxuICAgICAgICAvLyDov5vooYzmjpLluo9cbiAgICAgICAgdmFyIGNvbnRlbnRQb3MgPSB0aGlzLl9pbml0Q29udGVudFBvcztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlQ291bnQ7ICsraSkge1xuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLl9wYWdlc1tpXTtcbiAgICAgICAgICAgIHBhZ2Uuc2V0U2libGluZ0luZGV4KGkpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uSG9yaXpvbnRhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbENlbnRlck9mZnNldFhbaV0gPSBNYXRoLmFicyhjb250ZW50UG9zLnggKyBwYWdlLngpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsQ2VudGVyT2Zmc2V0WVtpXSA9IE1hdGguYWJzKGNvbnRlbnRQb3MueSArIHBhZ2UueSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyDliLfmlrAgaW5kaWNhdG9yIOS/oeaBr+S4jueKtuaAgVxuICAgICAgICBpZiAodGhpcy5pbmRpY2F0b3IpIHtcbiAgICAgICAgICAgIHRoaXMuaW5kaWNhdG9yLl9yZWZyZXNoKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g5Yi35paw5omA5pyJ6aG16Z2i55qE5aSn5bCPXG4gICAgX3VwZGF0ZUFsbFBhZ2VzU2l6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5zaXplTW9kZSAhPT0gU2l6ZU1vZGUuVW5pZmllZCB8fCAhdGhpcy5fdmlldykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsb2NQYWdlcyA9IENDX0VESVRPUiA/IHRoaXMuY29udGVudC5jaGlsZHJlbiA6IHRoaXMuX3BhZ2VzO1xuICAgICAgICB2YXIgc2VsZlNpemUgPSB0aGlzLl92aWV3LmdldENvbnRlbnRTaXplKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsb2NQYWdlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbG9jUGFnZXNbaV0uc2V0Q29udGVudFNpemUoc2VsZlNpemUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOWIneWni+WMlumhtemdolxuICAgIF9pbml0UGFnZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRlbnQpIHsgcmV0dXJuOyB9XG4gICAgICAgIHRoaXMuX2luaXRDb250ZW50UG9zID0gdGhpcy5jb250ZW50LnBvc2l0aW9uO1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmNvbnRlbnQuY2hpbGRyZW47XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBwYWdlID0gY2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAodGhpcy5fcGFnZXMuaW5kZXhPZihwYWdlKSA+PSAwKSB7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICB0aGlzLl9wYWdlcy5wdXNoKHBhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N5bmNTY3JvbGxEaXJlY3Rpb24oKTtcbiAgICAgICAgdGhpcy5fc3luY1NpemVNb2RlKCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVBhZ2VWaWV3KCk7XG4gICAgfSxcblxuICAgIF9kaXNwYXRjaFBhZ2VUdXJuaW5nRXZlbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2xhc3RQYWdlSWR4ID09PSB0aGlzLl9jdXJQYWdlSWR4KSByZXR1cm47XG4gICAgICAgIHRoaXMuX2xhc3RQYWdlSWR4ID0gdGhpcy5fY3VyUGFnZUlkeDtcbiAgICAgICAgY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlci5lbWl0RXZlbnRzKHRoaXMucGFnZUV2ZW50cywgdGhpcywgRXZlbnRUeXBlLlBBR0VfVFVSTklORyk7XG4gICAgICAgIHRoaXMubm9kZS5lbWl0KCdwYWdlLXR1cm5pbmcnLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLy8g5piv5ZCm6LaF6L+H6Ieq5Yqo5rua5Yqo5Li055WM5YC8XG4gICAgX2lzU2Nyb2xsYWJsZTogZnVuY3Rpb24gKG9mZnNldCwgaW5kZXgsIG5leHRJbmRleCkge1xuICAgICAgICBpZiAodGhpcy5zaXplTW9kZSA9PT0gU2l6ZU1vZGUuRnJlZSkge1xuICAgICAgICAgICAgdmFyIGN1clBhZ2VDZW50ZXIsIG5leHRQYWdlQ2VudGVyO1xuICAgICAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uSG9yaXpvbnRhbCkge1xuICAgICAgICAgICAgICAgIGN1clBhZ2VDZW50ZXIgPSB0aGlzLl9zY3JvbGxDZW50ZXJPZmZzZXRYW2luZGV4XTtcbiAgICAgICAgICAgICAgICBuZXh0UGFnZUNlbnRlciA9IHRoaXMuX3Njcm9sbENlbnRlck9mZnNldFhbbmV4dEluZGV4XTtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMob2Zmc2V0LngpID49IE1hdGguYWJzKGN1clBhZ2VDZW50ZXIgLSBuZXh0UGFnZUNlbnRlcikgKiB0aGlzLnNjcm9sbFRocmVzaG9sZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uVmVydGljYWwpIHtcbiAgICAgICAgICAgICAgICBjdXJQYWdlQ2VudGVyID0gdGhpcy5fc2Nyb2xsQ2VudGVyT2Zmc2V0WVtpbmRleF07XG4gICAgICAgICAgICAgICAgbmV4dFBhZ2VDZW50ZXIgPSB0aGlzLl9zY3JvbGxDZW50ZXJPZmZzZXRZW25leHRJbmRleF07XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguYWJzKG9mZnNldC55KSA+PSBNYXRoLmFicyhjdXJQYWdlQ2VudGVyIC0gbmV4dFBhZ2VDZW50ZXIpICogdGhpcy5zY3JvbGxUaHJlc2hvbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5Ib3Jpem9udGFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguYWJzKG9mZnNldC54KSA+PSB0aGlzLl92aWV3LndpZHRoICogdGhpcy5zY3JvbGxUaHJlc2hvbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLlZlcnRpY2FsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguYWJzKG9mZnNldC55KSA+PSB0aGlzLl92aWV3LmhlaWdodCAqIHRoaXMuc2Nyb2xsVGhyZXNob2xkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOW/q+mAn+a7keWKqFxuICAgIF9pc1F1aWNrbHlTY3JvbGxhYmxlOiBmdW5jdGlvbiAodG91Y2hNb3ZlVmVsb2NpdHkpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uSG9yaXpvbnRhbCkge1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKHRvdWNoTW92ZVZlbG9jaXR5LngpID4gdGhpcy5hdXRvUGFnZVR1cm5pbmdUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLlZlcnRpY2FsKSB7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnModG91Y2hNb3ZlVmVsb2NpdHkueSkgPiB0aGlzLmF1dG9QYWdlVHVybmluZ1RocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8g6YCa6L+HIGlkeCDojrflj5blgY/np7vlgLzmlbDlgLxcbiAgICBfbW92ZU9mZnNldFZhbHVlOiBmdW5jdGlvbiAoaWR4KSB7XG4gICAgICAgIHZhciBvZmZzZXQgPSBjYy52MigwLCAwKTtcbiAgICAgICAgaWYgKHRoaXMuc2l6ZU1vZGUgPT09IFNpemVNb2RlLkZyZWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkhvcml6b250YWwpIHtcbiAgICAgICAgICAgICAgICBvZmZzZXQueCA9IHRoaXMuX3Njcm9sbENlbnRlck9mZnNldFhbaWR4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uVmVydGljYWwpIHtcbiAgICAgICAgICAgICAgICBvZmZzZXQueSA9IHRoaXMuX3Njcm9sbENlbnRlck9mZnNldFlbaWR4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkhvcml6b250YWwpIHtcbiAgICAgICAgICAgICAgICBvZmZzZXQueCA9IGlkeCAqIHRoaXMuX3ZpZXcud2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLlZlcnRpY2FsKSB7XG4gICAgICAgICAgICAgICAgb2Zmc2V0LnkgPSBpZHggKiB0aGlzLl92aWV3LmhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2Zmc2V0O1xuICAgIH0sXG5cbiAgICBfZ2V0RHJhZ0RpcmVjdGlvbjogZnVuY3Rpb24gKG1vdmVPZmZzZXQpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uSG9yaXpvbnRhbCkge1xuICAgICAgICAgICAgaWYgKG1vdmVPZmZzZXQueCA9PT0gMCkgeyByZXR1cm4gMDsgfVxuICAgICAgICAgICAgcmV0dXJuIChtb3ZlT2Zmc2V0LnggPiAwID8gMSA6IC0xKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLlZlcnRpY2FsKSB7XG4gICAgICAgICAgICAvLyDnlLHkuo7mu5rliqggWSDovbTnmoTljp/ngrnlnKjlnKjlj7PkuIrop5LmiYDku6XlupTor6XmmK/lsI/kuo4gMFxuICAgICAgICAgICAgaWYgKG1vdmVPZmZzZXQueSA9PT0gMCkgeyByZXR1cm4gMDsgfVxuICAgICAgICAgICAgcmV0dXJuIChtb3ZlT2Zmc2V0LnkgPCAwID8gMSA6IC0xKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfaGFuZGxlUmVsZWFzZUxvZ2ljOiBmdW5jdGlvbih0b3VjaCkge1xuICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsVG9QYWdlKCk7XG4gICAgICAgIGlmICh0aGlzLl9zY3JvbGxpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9hdXRvU2Nyb2xsaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudCgnc2Nyb2xsLWVuZGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2F1dG9TY3JvbGxUb1BhZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGJvdW5jZUJhY2tTdGFydGVkID0gdGhpcy5fc3RhcnRCb3VuY2VCYWNrSWZOZWVkZWQoKTtcbiAgICAgICAgaWYgKGJvdW5jZUJhY2tTdGFydGVkKSB7XG4gICAgICAgICAgICBsZXQgYm91bmNlQmFja0Ftb3VudCA9IHRoaXMuX2dldEhvd011Y2hPdXRPZkJvdW5kYXJ5KCk7XG4gICAgICAgICAgICBib3VuY2VCYWNrQW1vdW50ID0gdGhpcy5fY2xhbXBEZWx0YShib3VuY2VCYWNrQW1vdW50KTtcbiAgICAgICAgICAgIGlmIChib3VuY2VCYWNrQW1vdW50LnggPiAwIHx8IGJvdW5jZUJhY2tBbW91bnQueSA8IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJQYWdlSWR4ID0gdGhpcy5fcGFnZXMubGVuZ3RoID09PSAwID8gMCA6IHRoaXMuX3BhZ2VzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYm91bmNlQmFja0Ftb3VudC54IDwgMCB8fCBib3VuY2VCYWNrQW1vdW50LnkgPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyUGFnZUlkeCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmluZGljYXRvcikge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kaWNhdG9yLl9jaGFuZ2VkU3RhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBtb3ZlT2Zmc2V0ID0gdGhpcy5fdG91Y2hCZWdhblBvc2l0aW9uLnN1Yih0aGlzLl90b3VjaEVuZFBvc2l0aW9uKTtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuX2N1clBhZ2VJZHgsIG5leHRJbmRleCA9IGluZGV4ICsgdGhpcy5fZ2V0RHJhZ0RpcmVjdGlvbihtb3ZlT2Zmc2V0KTtcbiAgICAgICAgICAgIHZhciB0aW1lSW5TZWNvbmQgPSB0aGlzLnBhZ2VUdXJuaW5nU3BlZWQgKiBNYXRoLmFicyhpbmRleCAtIG5leHRJbmRleCk7XG4gICAgICAgICAgICBpZiAobmV4dEluZGV4IDwgdGhpcy5fcGFnZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lzU2Nyb2xsYWJsZShtb3ZlT2Zmc2V0LCBpbmRleCwgbmV4dEluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvUGFnZShuZXh0SW5kZXgsIHRpbWVJblNlY29uZCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0b3VjaE1vdmVWZWxvY2l0eSA9IHRoaXMuX2NhbGN1bGF0ZVRvdWNoTW92ZVZlbG9jaXR5KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pc1F1aWNrbHlTY3JvbGxhYmxlKHRvdWNoTW92ZVZlbG9jaXR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUb1BhZ2UobmV4dEluZGV4LCB0aW1lSW5TZWNvbmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zY3JvbGxUb1BhZ2UoaW5kZXgsIHRpbWVJblNlY29uZCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX29uVG91Y2hCZWdhbjogZnVuY3Rpb24gKGV2ZW50LCBjYXB0dXJlTGlzdGVuZXJzKSB7XG4gICAgICAgIHRoaXMuX3RvdWNoQmVnYW5Qb3NpdGlvbiA9IGV2ZW50LnRvdWNoLmdldExvY2F0aW9uKCk7XG4gICAgICAgIHRoaXMuX3N1cGVyKGV2ZW50LCBjYXB0dXJlTGlzdGVuZXJzKTtcbiAgICB9LFxuXG4gICAgX29uVG91Y2hNb3ZlZDogZnVuY3Rpb24gKGV2ZW50LCBjYXB0dXJlTGlzdGVuZXJzKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKGV2ZW50LCBjYXB0dXJlTGlzdGVuZXJzKTtcbiAgICB9LFxuXG4gICAgX29uVG91Y2hFbmRlZDogZnVuY3Rpb24gKGV2ZW50LCBjYXB0dXJlTGlzdGVuZXJzKSB7XG4gICAgICAgIHRoaXMuX3RvdWNoRW5kUG9zaXRpb24gPSBldmVudC50b3VjaC5nZXRMb2NhdGlvbigpO1xuICAgICAgICB0aGlzLl9zdXBlcihldmVudCwgY2FwdHVyZUxpc3RlbmVycyk7XG4gICAgfSxcblxuICAgIF9vblRvdWNoQ2FuY2VsbGVkOiBmdW5jdGlvbiAoZXZlbnQsIGNhcHR1cmVMaXN0ZW5lcnMpIHtcbiAgICAgICAgdGhpcy5fdG91Y2hFbmRQb3NpdGlvbiA9IGV2ZW50LnRvdWNoLmdldExvY2F0aW9uKCk7XG4gICAgICAgIHRoaXMuX3N1cGVyKGV2ZW50LCBjYXB0dXJlTGlzdGVuZXJzKTtcbiAgICB9LFxuXG4gICAgX29uTW91c2VXaGVlbDogZnVuY3Rpb24gKCkgeyB9XG59KTtcblxuY2MuUGFnZVZpZXcgPSBtb2R1bGUuZXhwb3J0cyA9IFBhZ2VWaWV3O1xuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IHBhZ2UtdHVybmluZ1xuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqIEBwYXJhbSB7UGFnZVZpZXd9IHBhZ2VWaWV3IC0gVGhlIFBhZ2VWaWV3IGNvbXBvbmVudC5cbiAqL1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=