
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/tilemap/CCTiledTile.js';
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
 * !#en TiledTile can control the specified map tile. 
 * It will apply the node rotation, scale, translate to the map tile.
 * You can change the TiledTile's gid to change the map tile's style.
 * !#zh TiledTile 可以单独对某一个地图块进行操作。
 * 他会将节点的旋转，缩放，平移操作应用在这个地图块上，并可以通过更换当前地图块的 gid 来更换地图块的显示样式。
 * @class TiledTile
 * @extends Component
 */
var TiledTile = cc.Class({
  name: 'cc.TiledTile',
  "extends": cc.Component,
  editor: CC_EDITOR && {
    executeInEditMode: true,
    menu: 'i18n:MAIN_MENU.component.renderers/TiledTile'
  },
  ctor: function ctor() {
    this._layer = null;
  },
  properties: {
    _x: 0,
    _y: 0,

    /**
     * !#en Specify the TiledTile horizontal coordinate，use map tile as the unit.
     * !#zh 指定 TiledTile 的横向坐标，以地图块为单位
     * @property {Number} x
     * @default 0
     */
    x: {
      get: function get() {
        return this._x;
      },
      set: function set(value) {
        if (value === this._x) return;

        if (this._layer && this._layer._isInvalidPosition(value, this._y)) {
          cc.warn("Invalid x, the valid value is between [%s] ~ [%s]", 0, this._layer._layerSize.width);
          return;
        }

        this._resetTile();

        this._x = value;

        this._updateInfo();
      },
      type: cc.Integer
    },

    /**
     * !#en Specify the TiledTile vertical coordinate，use map tile as the unit.
     * !#zh 指定 TiledTile 的纵向坐标，以地图块为单位
     * @property {Number} y
     * @default 0
     */
    y: {
      get: function get() {
        return this._y;
      },
      set: function set(value) {
        if (value === this._y) return;

        if (this._layer && this._layer._isInvalidPosition(this._x, value)) {
          cc.warn("Invalid y, the valid value is between [%s] ~ [%s]", 0, this._layer._layerSize.height);
          return;
        }

        this._resetTile();

        this._y = value;

        this._updateInfo();
      },
      type: cc.Integer
    },

    /**
     * !#en Specify the TiledTile gid.
     * !#zh 指定 TiledTile 的 gid 值
     * @property {Number} gid
     * @default 0
     */
    gid: {
      get: function get() {
        if (this._layer) {
          return this._layer.getTileGIDAt(this._x, this._y);
        }

        return 0;
      },
      set: function set(value) {
        if (this._layer) {
          this._layer.setTileGIDAt(value, this._x, this._y);
        }
      },
      type: cc.Integer
    }
  },
  onEnable: function onEnable() {
    var parent = this.node.parent;
    this._layer = parent.getComponent(cc.TiledLayer);

    this._resetTile();

    this._updateInfo();
  },
  onDisable: function onDisable() {
    this._resetTile();
  },
  _resetTile: function _resetTile() {
    if (this._layer && this._layer.getTiledTileAt(this._x, this._y) === this) {
      this._layer.setTiledTileAt(this._x, this._y, null);
    }
  },
  _updateInfo: function _updateInfo() {
    if (!this._layer) return;
    var x = this._x,
        y = this._y;

    if (this._layer.getTiledTileAt(x, y)) {
      cc.warn('There is already a TiledTile at [%s, %s]', x, y);
      return;
    }

    this.node.setPosition(this._layer.getPositionAt(x, y));

    this._layer.setTiledTileAt(x, y, this);
  }
});
cc.TiledTile = module.exports = TiledTile;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC90aWxlbWFwL0NDVGlsZWRUaWxlLmpzIl0sIm5hbWVzIjpbIlRpbGVkVGlsZSIsImNjIiwiQ2xhc3MiLCJuYW1lIiwiQ29tcG9uZW50IiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwiZXhlY3V0ZUluRWRpdE1vZGUiLCJtZW51IiwiY3RvciIsIl9sYXllciIsInByb3BlcnRpZXMiLCJfeCIsIl95IiwieCIsImdldCIsInNldCIsInZhbHVlIiwiX2lzSW52YWxpZFBvc2l0aW9uIiwid2FybiIsIl9sYXllclNpemUiLCJ3aWR0aCIsIl9yZXNldFRpbGUiLCJfdXBkYXRlSW5mbyIsInR5cGUiLCJJbnRlZ2VyIiwieSIsImhlaWdodCIsImdpZCIsImdldFRpbGVHSURBdCIsInNldFRpbGVHSURBdCIsIm9uRW5hYmxlIiwicGFyZW50Iiwibm9kZSIsImdldENvbXBvbmVudCIsIlRpbGVkTGF5ZXIiLCJvbkRpc2FibGUiLCJnZXRUaWxlZFRpbGVBdCIsInNldFRpbGVkVGlsZUF0Iiwic2V0UG9zaXRpb24iLCJnZXRQb3NpdGlvbkF0IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUlBLFNBQVMsR0FBR0MsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDckJDLEVBQUFBLElBQUksRUFBRSxjQURlO0FBRXJCLGFBQVNGLEVBQUUsQ0FBQ0csU0FGUztBQUlyQkMsRUFBQUEsTUFBTSxFQUFFQyxTQUFTLElBQUk7QUFDakJDLElBQUFBLGlCQUFpQixFQUFFLElBREY7QUFFakJDLElBQUFBLElB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QUFBLFVBaEdxQix3QkFnR1A7QUFDVixRQUFJLEtBQUtaLE1BQUwsSUFBZSxLQUFLQSxNQUFMLENBQVkyQixjQUFaLENBQTJCLEtBQUt6QixFQUFoQyxFQUFvQyxLQUFLQyxFQUF6QyxNQUFpRCxJQUFwRSxFQUEwRTtBQUN0RSxXQUFLSCxNQUFMLENBQVk0QixjQUFaLENBQTJCLEtBQUsxQixFQUFoQyxFQUFvQyxLQUFLQyxFQUF6QyxFQUE2QyxJQUE3QztBQUNIO0FBQ0osR0FwR29CO0FBc0dyQlUsRUFBQUEsV0F0R3FCLHlCQXNHTjtBQUNYLFFBQUksQ0FBQyxLQUFLYixNQUFWLEVBQWtCO0FBRWxCLFFBQUlJLENBQUMsR0FBRyxLQUFLRixFQUFiO0FBQUEsUUFBa0JjLENBQUMsR0FBRyxLQUFLYixFQUEzQjs7QUFDQSxRQUFJLEtBQUtILE1BQUwsQ0FBWTJCLGNBQVosQ0FBMkJ2QixDQUEzQixFQUE4QlksQ0FBOUIsQ0FBSixFQUFzQztBQUNsQ3pCLE1BQUFBLEVBQUUsQ0FBQ2tCLElBQUgsQ0FBUSwwQ0FBUixFQUFvREwsQ0FBcEQsRUFBdURZLENBQXZEO0FBQ0E7QUFDSDs7QUFDRCxTQUFLTyxJQUFMLENBQVVNLFdBQVYsQ0FBc0IsS0FBSzdCLE1BQUwsQ0FBWThCLGFBQVosQ0FBMEIxQixDQUExQixFQUE2QlksQ0FBN0IsQ0FBdEI7O0FBQ0EsU0FBS2hCLE1BQUwsQ0FBWTRCLGNBQVosQ0FBMkJ4QixDQUEzQixFQUE4QlksQ0FBOUIsRUFBaUMsSUFBakM7QUFDSDtBQWhIb0IsQ0FBVCxDQUFoQjtBQW1IQXpCLEVBQUUsQ0FBQ0QsU0FBSCxHQUFleUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCMUMsU0FBaEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqXG4gKiAhI2VuIFRpbGVkVGlsZSBjYW4gY29udHJvbCB0aGUgc3BlY2lmaWVkIG1hcCB0aWxlLiBcbiAqIEl0IHdpbGwgYXBwbHkgdGhlIG5vZGUgcm90YXRpb24sIHNjYWxlLCB0cmFuc2xhdGUgdG8gdGhlIG1hcCB0aWxlLlxuICogWW91IGNhbiBjaGFuZ2UgdGhlIFRpbGVkVGlsZSdzIGdpZCB0byBjaGFuZ2UgdGhlIG1hcCB0aWxlJ3Mgc3R5bGUuXG4gKiAhI3poIFRpbGVkVGlsZSDlj6/ku6XljZXni6zlr7nmn5DkuIDkuKrlnLDlm77lnZfov5vooYzmk43kvZzjgIJcbiAqIOS7luS8muWwhuiKgueCueeahOaXi+i9rO+8jOe8qeaUvu+8jOW5s+enu+aTjeS9nOW6lOeUqOWcqOi/meS4quWcsOWbvuWdl+S4iu+8jOW5tuWPr+S7pemAmui/h+abtOaNouW9k+WJjeWcsOWbvuWdl+eahCBnaWQg5p2l5pu05o2i5Zyw5Zu+5Z2X55qE5pi+56S65qC35byP44CCXG4gKiBAY2xhc3MgVGlsZWRUaWxlXG4gKiBAZXh0ZW5kcyBDb21wb25lbnRcbiAqL1xubGV0IFRpbGVkVGlsZSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuVGlsZWRUaWxlJyxcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIGV4ZWN1dGVJbkVkaXRNb2RlOiB0cnVlLFxuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnJlbmRlcmVycy9UaWxlZFRpbGUnLFxuICAgIH0sXG5cbiAgICBjdG9yICgpIHtcbiAgICAgICAgdGhpcy5fbGF5ZXIgPSBudWxsO1xuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF94OiAwLFxuICAgICAgICBfeTogMCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBTcGVjaWZ5IHRoZSBUaWxlZFRpbGUgaG9yaXpvbnRhbCBjb29yZGluYXRl77yMdXNlIG1hcCB0aWxlIGFzIHRoZSB1bml0LlxuICAgICAgICAgKiAhI3poIOaMh+WumiBUaWxlZFRpbGUg55qE5qiq5ZCR5Z2Q5qCH77yM5Lul5Zyw5Zu+5Z2X5Li65Y2V5L2NXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB4XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHg6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3g7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5feCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9sYXllciAmJiB0aGlzLl9sYXllci5faXNJbnZhbGlkUG9zaXRpb24odmFsdWUsIHRoaXMuX3kpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm4oYEludmFsaWQgeCwgdGhlIHZhbGlkIHZhbHVlIGlzIGJldHdlZW4gWyVzXSB+IFslc11gLCAwLCB0aGlzLl9sYXllci5fbGF5ZXJTaXplLndpZHRoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNldFRpbGUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl94ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlSW5mbygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkludGVnZXJcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBTcGVjaWZ5IHRoZSBUaWxlZFRpbGUgdmVydGljYWwgY29vcmRpbmF0Ze+8jHVzZSBtYXAgdGlsZSBhcyB0aGUgdW5pdC5cbiAgICAgICAgICogISN6aCDmjIflrpogVGlsZWRUaWxlIOeahOe6teWQkeWdkOagh++8jOS7peWcsOWbvuWdl+S4uuWNleS9jVxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0geVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB5OiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl95O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMuX3kpIHJldHVybjtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbGF5ZXIgJiYgdGhpcy5fbGF5ZXIuX2lzSW52YWxpZFBvc2l0aW9uKHRoaXMuX3gsIHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuKGBJbnZhbGlkIHksIHRoZSB2YWxpZCB2YWx1ZSBpcyBiZXR3ZWVuIFslc10gfiBbJXNdYCwgMCwgdGhpcy5fbGF5ZXIuX2xheWVyU2l6ZS5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2V0VGlsZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3kgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVJbmZvKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFNwZWNpZnkgdGhlIFRpbGVkVGlsZSBnaWQuXG4gICAgICAgICAqICEjemgg5oyH5a6aIFRpbGVkVGlsZSDnmoQgZ2lkIOWAvFxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZ2lkXG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIGdpZDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xheWVyLmdldFRpbGVHSURBdCh0aGlzLl94LCB0aGlzLl95KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9sYXllcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sYXllci5zZXRUaWxlR0lEQXQodmFsdWUsIHRoaXMuX3gsIHRoaXMuX3kpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25FbmFibGUgKCkge1xuICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5ub2RlLnBhcmVudDtcbiAgICAgICAgdGhpcy5fbGF5ZXIgPSBwYXJlbnQuZ2V0Q29tcG9uZW50KGNjLlRpbGVkTGF5ZXIpO1xuICAgICAgICB0aGlzLl9yZXNldFRpbGUoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlSW5mbygpO1xuICAgIH0sXG5cbiAgICBvbkRpc2FibGUgKCkge1xuICAgICAgICB0aGlzLl9yZXNldFRpbGUoKTtcbiAgICB9LFxuXG4gICAgX3Jlc2V0VGlsZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9sYXllciAmJiB0aGlzLl9sYXllci5nZXRUaWxlZFRpbGVBdCh0aGlzLl94LCB0aGlzLl95KSA9PT0gdGhpcykge1xuICAgICAgICAgICAgdGhpcy5fbGF5ZXIuc2V0VGlsZWRUaWxlQXQodGhpcy5feCwgdGhpcy5feSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VwZGF0ZUluZm8gKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2xheWVyKSByZXR1cm47XG5cbiAgICAgICAgbGV0IHggPSB0aGlzLl94LCAgeSA9IHRoaXMuX3k7XG4gICAgICAgIGlmICh0aGlzLl9sYXllci5nZXRUaWxlZFRpbGVBdCh4LCB5KSkge1xuICAgICAgICAgICAgY2Mud2FybignVGhlcmUgaXMgYWxyZWFkeSBhIFRpbGVkVGlsZSBhdCBbJXMsICVzXScsIHgsIHkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubm9kZS5zZXRQb3NpdGlvbih0aGlzLl9sYXllci5nZXRQb3NpdGlvbkF0KHgsIHkpKTtcbiAgICAgICAgdGhpcy5fbGF5ZXIuc2V0VGlsZWRUaWxlQXQoeCwgeSwgdGhpcyk7XG4gICAgfSxcbn0pO1xuXG5jYy5UaWxlZFRpbGUgPSBtb2R1bGUuZXhwb3J0cyA9IFRpbGVkVGlsZTtcbiJdLCJzb3VyY2VSb290IjoiLyJ9