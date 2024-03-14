
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/collider/CCCollider.js';
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
 * !#en Collider component base class.
 * !#zh 碰撞组件基类
 * @class Collider
 * @extends Component
 */
var Collider = cc.Class({
  name: 'cc.Collider',
  "extends": cc.Component,
  properties: {
    editing: {
      "default": false,
      serializable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.collider.editing'
    },

    /**
     * !#en Tag. If a node has several collider components, you can judge which type of collider is collided according to the tag.
     * !#zh 标签。当一个节点上有多个碰撞组件时，在发生碰撞后，可以使用此标签来判断是节点上的哪个碰撞组件被碰撞了。
     * @property tag
     * @type {Integer}
     * @default 0
     */
    tag: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.tag',
      "default": 0,
      range: [0, 10e6],
      type: cc.Integer
    }
  },
  onDisable: function onDisable() {
    cc.director.getCollisionManager().removeCollider(this);
  },
  onEnable: function onEnable() {
    cc.director.getCollisionManager().addCollider(this);
  }
});
cc.Collider = module.exports = Collider;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbGxpZGVyL0NDQ29sbGlkZXIuanMiXSwibmFtZXMiOlsiQ29sbGlkZXIiLCJjYyIsIkNsYXNzIiwibmFtZSIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJlZGl0aW5nIiwic2VyaWFsaXphYmxlIiwidG9vbHRpcCIsIkNDX0RFViIsInRhZyIsInJhbmdlIiwidHlwZSIsIkludGVnZXIiLCJvbkRpc2FibGUiLCJkaXJlY3RvciIsImdldENvbGxpc2lvbk1hbmFnZXIiLCJyZW1vdmVDb2xsaWRlciIsIm9uRW5hYmxlIiwiYWRkQ29sbGlkZXIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSUEsUUFBUSxHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNwQkMsRUFBQUEsSUFBSSxFQUFFLGFBRGM7QUFFcEIsYUFBU0YsRUFBRSxDQUFDRyxTQUZRO0FBSXBCQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsT0FBTyxFQUFFO0FBQ0wsaUJBQVMsS0FESjtBQUVMQyxNQUFBQSxZQUFZLEVBQUUsS0FGVDtBQUdMQyxNQUFBQSxPQUFPLEVBQUVDLE1BQU0sSUFBSTtBQUhkLEtBREQ7O0FBT1I7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDUUMsSUFBQUEsR0FBRyxFQUFFO0FBQ0RGLE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxJQUFJLDZDQURsQjtBQUVELGlCQUFTLENBRlI7QUFHREUsTUFBQUEsS0FBSyxFQUFFLENBQUMsQ0FBRCxFQUFJLElBQUosQ0FITjtBQUlEQyxNQUFBQSxJQUFJLEVBQUVYLEVBQUUsQ0FBQ1k7QUFKUjtBQWRHLEdBSlE7QUEwQnBCQyxFQUFBQSxTQUFTLEVBQUUscUJBQVk7QUFDbkJiLElBQUFBLEVBQUUsQ0FBQ2MsUUFBSCxDQUFZQyxtQkFBWixHQUFrQ0MsY0FBbEMsQ0FBaUQsSUFBakQ7QUFDSCxHQTVCbUI7QUE4QnBCQyxFQUFBQSxRQUFRLEVBQUUsb0JBQVk7QUFDbEJqQixJQUFBQSxFQUFFLENBQUNjLFFBQUgsQ0FBWUMsbUJBQVosR0FBa0NHLFdBQWxDLENBQThDLElBQTlDO0FBQ0g7QUFoQ21CLENBQVQsQ0FBZjtBQW1DQWxCLEVBQUUsQ0FBQ0QsUUFBSCxHQUFjb0IsTUFBTSxDQUFDQyxPQUFQLEdBQWlCckIsUUFBL0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogISNlbiBDb2xsaWRlciBjb21wb25lbnQgYmFzZSBjbGFzcy5cbiAqICEjemgg56Kw5pKe57uE5Lu25Z+657G7XG4gKiBAY2xhc3MgQ29sbGlkZXJcbiAqIEBleHRlbmRzIENvbXBvbmVudFxuICovXG52YXIgQ29sbGlkZXIgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkNvbGxpZGVyJyxcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGVkaXRpbmc6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgc2VyaWFsaXphYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuY29sbGlkZXIuZWRpdGluZydcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUYWcuIElmIGEgbm9kZSBoYXMgc2V2ZXJhbCBjb2xsaWRlciBjb21wb25lbnRzLCB5b3UgY2FuIGp1ZGdlIHdoaWNoIHR5cGUgb2YgY29sbGlkZXIgaXMgY29sbGlkZWQgYWNjb3JkaW5nIHRvIHRoZSB0YWcuXG4gICAgICAgICAqICEjemgg5qCH562+44CC5b2T5LiA5Liq6IqC54K55LiK5pyJ5aSa5Liq56Kw5pKe57uE5Lu25pe277yM5Zyo5Y+R55Sf56Kw5pKe5ZCO77yM5Y+v5Lul5L2/55So5q2k5qCH562+5p2l5Yik5pat5piv6IqC54K55LiK55qE5ZOq5Liq56Kw5pKe57uE5Lu26KKr56Kw5pKe5LqG44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB0YWdcbiAgICAgICAgICogQHR5cGUge0ludGVnZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRhZzoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnBoeXNpY3NfY29sbGlkZXIudGFnJywgICAgICAgICAgICBcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgICAgICByYW5nZTogWzAsIDEwZTZdLFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5nZXRDb2xsaXNpb25NYW5hZ2VyKCkucmVtb3ZlQ29sbGlkZXIodGhpcyk7XG4gICAgfSxcblxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldENvbGxpc2lvbk1hbmFnZXIoKS5hZGRDb2xsaWRlcih0aGlzKTtcbiAgICB9XG59KTtcblxuY2MuQ29sbGlkZXIgPSBtb2R1bGUuZXhwb3J0cyA9IENvbGxpZGVyO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=