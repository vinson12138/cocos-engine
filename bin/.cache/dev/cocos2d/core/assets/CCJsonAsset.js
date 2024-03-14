
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCJsonAsset.js';
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

/**
 * !#en
 * Class for JSON file. When the JSON file is loaded, this object is returned.
 * The parsed JSON object can be accessed through the `json` attribute in it.<br>
 * If you want to get the original JSON text, you should modify the extname to `.txt`
 * so that it is loaded as a `TextAsset` instead of a `JsonAsset`.
 *
 * !#zh
 * JSON 资源类。JSON 文件加载后，将会返回该对象。可以通过其中的 `json` 属性访问解析后的 JSON 对象。<br>
 * 如果你想要获得 JSON 的原始文本，那么应该修改源文件的后缀为 `.txt`，这样就会加载为一个 `TextAsset` 而不是 `JsonAsset`。
 *
 * @class JsonAsset
 * @extends Asset
 */
var JsonAsset = cc.Class({
  name: 'cc.JsonAsset',
  "extends": cc.Asset,
  properties: {
    /**
     * @property {Object} json - The loaded JSON object.
     */
    json: null
  }
});
module.exports = cc.JsonAsset = JsonAsset;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0cy9DQ0pzb25Bc3NldC5qcyJdLCJuYW1lcyI6WyJKc29uQXNzZXQiLCJjYyIsIkNsYXNzIiwibmFtZSIsIkFzc2V0IiwicHJvcGVydGllcyIsImpzb24iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJQSxTQUFTLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ3JCQyxFQUFBQSxJQUFJLEVBQUUsY0FEZTtBQUVyQixhQUFTRixFQUFFLENBQUNHLEtBRlM7QUFHckJDLEVBQUFBLFVBQVUsRUFBRTtBQUNSO0FBQ1I7QUFDQTtBQUNRQyxJQUFBQSxJQUFJLEVBQUU7QUFKRTtBQUhTLENBQVQsQ0FBaEI7QUFXQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCUCxFQUFFLENBQUNELFNBQUgsR0FBZUEsU0FBaEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBDbGFzcyBmb3IgSlNPTiBmaWxlLiBXaGVuIHRoZSBKU09OIGZpbGUgaXMgbG9hZGVkLCB0aGlzIG9iamVjdCBpcyByZXR1cm5lZC5cbiAqIFRoZSBwYXJzZWQgSlNPTiBvYmplY3QgY2FuIGJlIGFjY2Vzc2VkIHRocm91Z2ggdGhlIGBqc29uYCBhdHRyaWJ1dGUgaW4gaXQuPGJyPlxuICogSWYgeW91IHdhbnQgdG8gZ2V0IHRoZSBvcmlnaW5hbCBKU09OIHRleHQsIHlvdSBzaG91bGQgbW9kaWZ5IHRoZSBleHRuYW1lIHRvIGAudHh0YFxuICogc28gdGhhdCBpdCBpcyBsb2FkZWQgYXMgYSBgVGV4dEFzc2V0YCBpbnN0ZWFkIG9mIGEgYEpzb25Bc3NldGAuXG4gKlxuICogISN6aFxuICogSlNPTiDotYTmupDnsbvjgIJKU09OIOaWh+S7tuWKoOi9veWQju+8jOWwhuS8mui/lOWbnuivpeWvueixoeOAguWPr+S7pemAmui/h+WFtuS4reeahCBganNvbmAg5bGe5oCn6K6/6Zeu6Kej5p6Q5ZCO55qEIEpTT04g5a+56LGh44CCPGJyPlxuICog5aaC5p6c5L2g5oOz6KaB6I635b6XIEpTT04g55qE5Y6f5aeL5paH5pys77yM6YKj5LmI5bqU6K+l5L+u5pS55rqQ5paH5Lu255qE5ZCO57yA5Li6IGAudHh0YO+8jOi/meagt+WwseS8muWKoOi9veS4uuS4gOS4qiBgVGV4dEFzc2V0YCDogIzkuI3mmK8gYEpzb25Bc3NldGDjgIJcbiAqXG4gKiBAY2xhc3MgSnNvbkFzc2V0XG4gKiBAZXh0ZW5kcyBBc3NldFxuICovXG52YXIgSnNvbkFzc2V0ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5Kc29uQXNzZXQnLFxuICAgIGV4dGVuZHM6IGNjLkFzc2V0LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBqc29uIC0gVGhlIGxvYWRlZCBKU09OIG9iamVjdC5cbiAgICAgICAgICovXG4gICAgICAgIGpzb246IG51bGwsXG4gICAgfSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNjLkpzb25Bc3NldCA9IEpzb25Bc3NldDtcbiJdLCJzb3VyY2VSb290IjoiLyJ9