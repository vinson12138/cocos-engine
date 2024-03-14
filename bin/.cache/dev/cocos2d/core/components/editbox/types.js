
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/editbox/types.js';
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
 * !#en Enum for keyboard return types
 * !#zh 键盘的返回键类型
 * @readonly
 * @enum EditBox.KeyboardReturnType
 */
var KeyboardReturnType = cc.Enum({
  /**
   * !#en TODO
   * !#zh 默认
   * @property {Number} DEFAULT
   */
  DEFAULT: 0,

  /**
   * !#en TODO
   * !#zh 完成类型
   * @property {Number} DONE
   */
  DONE: 1,

  /**
   * !#en TODO
   * !#zh 发送类型
   * @property {Number} SEND
   */
  SEND: 2,

  /**
   * !#en TODO
   * !#zh 搜索类型
   * @property {Number} SEARCH
   */
  SEARCH: 3,

  /**
   * !#en TODO
   * !#zh 跳转类型
   * @property {Number} GO
   */
  GO: 4,

  /**
   * !#en TODO
   * !#zh 下一个类型
   * @property {Number} NEXT
   */
  NEXT: 5
});
/**
 * !#en The EditBox's InputMode defines the type of text that the user is allowed to enter.
 * !#zh 输入模式
 * @readonly
 * @enum EditBox.InputMode
 */

var InputMode = cc.Enum({
  /**
   * !#en TODO
   * !#zh 用户可以输入任何文本，包括换行符。
   * @property {Number} ANY
   */
  ANY: 0,

  /**
   * !#en The user is allowed to enter an e-mail address.
   * !#zh 允许用户输入一个电子邮件地址。
   * @property {Number} EMAIL_ADDR
   */
  EMAIL_ADDR: 1,

  /**
   * !#en The user is allowed to enter an integer value.
   * !#zh 允许用户输入一个整数值。
   * @property {Number} NUMERIC
   */
  NUMERIC: 2,

  /**
   * !#en The user is allowed to enter a phone number.
   * !#zh 允许用户输入一个电话号码。
   * @property {Number} PHONE_NUMBER
   */
  PHONE_NUMBER: 3,

  /**
   * !#en The user is allowed to enter a URL.
   * !#zh 允许用户输入一个 URL。
   * @property {Number} URL
   */
  URL: 4,

  /**
   * !#en
   * The user is allowed to enter a real number value.
   * This extends kEditBoxInputModeNumeric by allowing a decimal point.
   * !#zh
   * 允许用户输入一个实数。
   * @property {Number} DECIMAL
   */
  DECIMAL: 5,

  /**
   * !#en The user is allowed to enter any text, except for line breaks.
   * !#zh 除了换行符以外，用户可以输入任何文本。
   * @property {Number} SINGLE_LINE
   */
  SINGLE_LINE: 6
});
/**
 * !#en Enum for the EditBox's input flags
 * !#zh 定义了一些用于设置文本显示和文本格式化的标志位。
 * @readonly
 * @enum EditBox.InputFlag
 */

var InputFlag = cc.Enum({
  /**
   * !#en
   * Indicates that the text entered is confidential data that should be
   * obscured whenever possible. This implies EDIT_BOX_INPUT_FLAG_SENSITIVE.
   * !#zh
   * 表明输入的文本是保密的数据，任何时候都应该隐藏起来，它隐含了 EDIT_BOX_INPUT_FLAG_SENSITIVE。
   * @property {Number} PASSWORD
   */
  PASSWORD: 0,

  /**
   * !#en
   * Indicates that the text entered is sensitive data that the
   * implementation must never store into a dictionary or table for use
   * in predictive, auto-completing, or other accelerated input schemes.
   * A credit card number is an example of sensitive data.
   * !#zh
   * 表明输入的文本是敏感数据，它禁止存储到字典或表里面，也不能用来自动补全和提示用户输入。
   * 一个信用卡号码就是一个敏感数据的例子。
   * @property {Number} SENSITIVE
   */
  SENSITIVE: 1,

  /**
   * !#en
   * This flag is a hint to the implementation that during text editing,
   * the initial letter of each word should be capitalized.
   * !#zh
   *  这个标志用来指定在文本编辑的时候，是否把每一个单词的首字母大写。
   * @property {Number} INITIAL_CAPS_WORD
   */
  INITIAL_CAPS_WORD: 2,

  /**
   * !#en
   * This flag is a hint to the implementation that during text editing,
   * the initial letter of each sentence should be capitalized.
   * !#zh
   * 这个标志用来指定在文本编辑是否每个句子的首字母大写。
   * @property {Number} INITIAL_CAPS_SENTENCE
   */
  INITIAL_CAPS_SENTENCE: 3,

  /**
   * !#en Capitalize all characters automatically.
   * !#zh 自动把输入的所有字符大写。
   * @property {Number} INITIAL_CAPS_ALL_CHARACTERS
   */
  INITIAL_CAPS_ALL_CHARACTERS: 4,

  /**
   * Don't do anything with the input text.
   * @property {Number} DEFAULT
   */
  DEFAULT: 5
});
module.exports = {
  KeyboardReturnType: KeyboardReturnType,
  InputMode: InputMode,
  InputFlag: InputFlag
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvZWRpdGJveC90eXBlcy5qcyJdLCJuYW1lcyI6WyJLZXlib2FyZFJldHVyblR5cGUiLCJjYyIsIkVudW0iLCJERUZBVUxUIiwiRE9ORSIsIlNFTkQiLCJTRUFSQ0giLCJHTyIsIk5FWFQiLCJJbnB1dE1vZGUiLCJBTlkiLCJFTUFJTF9BRERSIiwiTlVNRVJJQyIsIlBIT05FX05VTUJFUiIsIlVSTCIsIkRFQ0lNQUwiLCJTSU5HTEVfTElORSIsIklucHV0RmxhZyIsIlBBU1NXT1JEIiwiU0VOU0lUSVZFIiwiSU5JVElBTF9DQVBTX1dPUkQiLCJJTklUSUFMX0NBUFNfU0VOVEVOQ0UiLCJJTklUSUFMX0NBUFNfQUxMX0NIQVJBQ1RFUlMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUlBLGtCQUFrQixHQUFHQyxFQUFFLENBQUNDLElBQUgsQ0FBUTtBQUM3QjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLEVBQUFBLE9BQU8sRUFBRSxDQU5vQjs7QUFPN0I7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNJQyxFQUFBQSxJQUFJLEVBQUUsQ0FadUI7O0FBYTdCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsSUFBSSxFQUFFLENBbEJ1Qjs7QUFtQjdCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsTUFBTSxFQUFFLENBeEJxQjs7QUF5QjdCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsRUFBRSxFQUFFLENBOUJ5Qjs7QUErQjdCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsSUFBSSxFQUFFO0FBcEN1QixDQUFSLENBQXpCO0FBdUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFJQyxTQUFTLEdBQUdSLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQ3BCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSVEsRUFBQUEsR0FBRyxFQUFFLENBTmU7O0FBT3BCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsVUFBVSxFQUFFLENBWlE7O0FBYXBCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsT0FBTyxFQUFFLENBbEJXOztBQW1CcEI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNJQyxFQUFBQSxZQUFZLEVBQUUsQ0F4Qk07O0FBeUJwQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLEVBQUFBLEdBQUcsRUFBRSxDQTlCZTs7QUErQnBCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsT0FBTyxFQUFFLENBdkNXOztBQXdDcEI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNJQyxFQUFBQSxXQUFXLEVBQUU7QUE3Q08sQ0FBUixDQUFoQjtBQWdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBSUMsU0FBUyxHQUFHaEIsRUFBRSxDQUFDQyxJQUFILENBQVE7QUFDcEI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJZ0IsRUFBQUEsUUFBUSxFQUFFLENBVFU7O0FBVXBCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsU0FBUyxFQUFFLENBckJTOztBQXNCcEI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJQyxFQUFBQSxpQkFBaUIsRUFBRSxDQTlCQzs7QUErQnBCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEscUJBQXFCLEVBQUUsQ0F2Q0g7O0FBd0NwQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLEVBQUFBLDJCQUEyQixFQUFFLENBN0NUOztBQThDcEI7QUFDSjtBQUNBO0FBQ0E7QUFDSW5CLEVBQUFBLE9BQU8sRUFBRTtBQWxEVyxDQUFSLENBQWhCO0FBcURBb0IsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2J4QixFQUFBQSxrQkFBa0IsRUFBRUEsa0JBRFA7QUFFYlMsRUFBQUEsU0FBUyxFQUFFQSxTQUZFO0FBR2JRLEVBQUFBLFNBQVMsRUFBRUE7QUFIRSxDQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKipcbiAqICEjZW4gRW51bSBmb3Iga2V5Ym9hcmQgcmV0dXJuIHR5cGVzXG4gKiAhI3poIOmUruebmOeahOi/lOWbnumUruexu+Wei1xuICogQHJlYWRvbmx5XG4gKiBAZW51bSBFZGl0Qm94LktleWJvYXJkUmV0dXJuVHlwZVxuICovXG5sZXQgS2V5Ym9hcmRSZXR1cm5UeXBlID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBUT0RPXG4gICAgICogISN6aCDpu5jorqRcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gREVGQVVMVFxuICAgICAqL1xuICAgIERFRkFVTFQ6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBUT0RPXG4gICAgICogISN6aCDlrozmiJDnsbvlnotcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gRE9ORVxuICAgICAqL1xuICAgIERPTkU6IDEsXG4gICAgLyoqXG4gICAgICogISNlbiBUT0RPXG4gICAgICogISN6aCDlj5HpgIHnsbvlnotcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU0VORFxuICAgICAqL1xuICAgIFNFTkQ6IDIsXG4gICAgLyoqXG4gICAgICogISNlbiBUT0RPXG4gICAgICogISN6aCDmkJzntKLnsbvlnotcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU0VBUkNIXG4gICAgICovXG4gICAgU0VBUkNIOiAzLFxuICAgIC8qKlxuICAgICAqICEjZW4gVE9ET1xuICAgICAqICEjemgg6Lez6L2s57G75Z6LXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEdPXG4gICAgICovXG4gICAgR086IDQsXG4gICAgLyoqXG4gICAgICogISNlbiBUT0RPXG4gICAgICogISN6aCDkuIvkuIDkuKrnsbvlnotcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gTkVYVFxuICAgICAqL1xuICAgIE5FWFQ6IDVcbn0pO1xuXG4vKipcbiAqICEjZW4gVGhlIEVkaXRCb3gncyBJbnB1dE1vZGUgZGVmaW5lcyB0aGUgdHlwZSBvZiB0ZXh0IHRoYXQgdGhlIHVzZXIgaXMgYWxsb3dlZCB0byBlbnRlci5cbiAqICEjemgg6L6T5YWl5qih5byPXG4gKiBAcmVhZG9ubHlcbiAqIEBlbnVtIEVkaXRCb3guSW5wdXRNb2RlXG4gKi9cbmxldCBJbnB1dE1vZGUgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIFRPRE9cbiAgICAgKiAhI3poIOeUqOaIt+WPr+S7pei+k+WFpeS7u+S9leaWh+acrO+8jOWMheaLrOaNouihjOespuOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBBTllcbiAgICAgKi9cbiAgICBBTlk6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgdXNlciBpcyBhbGxvd2VkIHRvIGVudGVyIGFuIGUtbWFpbCBhZGRyZXNzLlxuICAgICAqICEjemgg5YWB6K6455So5oi36L6T5YWl5LiA5Liq55S15a2Q6YKu5Lu25Zyw5Z2A44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEVNQUlMX0FERFJcbiAgICAgKi9cbiAgICBFTUFJTF9BRERSOiAxLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHVzZXIgaXMgYWxsb3dlZCB0byBlbnRlciBhbiBpbnRlZ2VyIHZhbHVlLlxuICAgICAqICEjemgg5YWB6K6455So5oi36L6T5YWl5LiA5Liq5pW05pWw5YC844CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IE5VTUVSSUNcbiAgICAgKi9cbiAgICBOVU1FUklDOiAyLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHVzZXIgaXMgYWxsb3dlZCB0byBlbnRlciBhIHBob25lIG51bWJlci5cbiAgICAgKiAhI3poIOWFgeiuuOeUqOaIt+i+k+WFpeS4gOS4queUteivneWPt+eggeOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBQSE9ORV9OVU1CRVJcbiAgICAgKi9cbiAgICBQSE9ORV9OVU1CRVI6IDMsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgdXNlciBpcyBhbGxvd2VkIHRvIGVudGVyIGEgVVJMLlxuICAgICAqICEjemgg5YWB6K6455So5oi36L6T5YWl5LiA5LiqIFVSTOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBVUkxcbiAgICAgKi9cbiAgICBVUkw6IDQsXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFRoZSB1c2VyIGlzIGFsbG93ZWQgdG8gZW50ZXIgYSByZWFsIG51bWJlciB2YWx1ZS5cbiAgICAgKiBUaGlzIGV4dGVuZHMga0VkaXRCb3hJbnB1dE1vZGVOdW1lcmljIGJ5IGFsbG93aW5nIGEgZGVjaW1hbCBwb2ludC5cbiAgICAgKiAhI3poXG4gICAgICog5YWB6K6455So5oi36L6T5YWl5LiA5Liq5a6e5pWw44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IERFQ0lNQUxcbiAgICAgKi9cbiAgICBERUNJTUFMOiA1LFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHVzZXIgaXMgYWxsb3dlZCB0byBlbnRlciBhbnkgdGV4dCwgZXhjZXB0IGZvciBsaW5lIGJyZWFrcy5cbiAgICAgKiAhI3poIOmZpOS6huaNouihjOespuS7peWklu+8jOeUqOaIt+WPr+S7pei+k+WFpeS7u+S9leaWh+acrOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTSU5HTEVfTElORVxuICAgICAqL1xuICAgIFNJTkdMRV9MSU5FOiA2XG59KTtcblxuLyoqXG4gKiAhI2VuIEVudW0gZm9yIHRoZSBFZGl0Qm94J3MgaW5wdXQgZmxhZ3NcbiAqICEjemgg5a6a5LmJ5LqG5LiA5Lqb55So5LqO6K6+572u5paH5pys5pi+56S65ZKM5paH5pys5qC85byP5YyW55qE5qCH5b+X5L2N44CCXG4gKiBAcmVhZG9ubHlcbiAqIEBlbnVtIEVkaXRCb3guSW5wdXRGbGFnXG4gKi9cbmxldCBJbnB1dEZsYWcgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogSW5kaWNhdGVzIHRoYXQgdGhlIHRleHQgZW50ZXJlZCBpcyBjb25maWRlbnRpYWwgZGF0YSB0aGF0IHNob3VsZCBiZVxuICAgICAqIG9ic2N1cmVkIHdoZW5ldmVyIHBvc3NpYmxlLiBUaGlzIGltcGxpZXMgRURJVF9CT1hfSU5QVVRfRkxBR19TRU5TSVRJVkUuXG4gICAgICogISN6aFxuICAgICAqIOihqOaYjui+k+WFpeeahOaWh+acrOaYr+S/neWvhueahOaVsOaNru+8jOS7u+S9leaXtuWAmemDveW6lOivpemakOiXj+i1t+adpe+8jOWug+makOWQq+S6hiBFRElUX0JPWF9JTlBVVF9GTEFHX1NFTlNJVElWReOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBQQVNTV09SRFxuICAgICAqL1xuICAgIFBBU1NXT1JEOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBJbmRpY2F0ZXMgdGhhdCB0aGUgdGV4dCBlbnRlcmVkIGlzIHNlbnNpdGl2ZSBkYXRhIHRoYXQgdGhlXG4gICAgICogaW1wbGVtZW50YXRpb24gbXVzdCBuZXZlciBzdG9yZSBpbnRvIGEgZGljdGlvbmFyeSBvciB0YWJsZSBmb3IgdXNlXG4gICAgICogaW4gcHJlZGljdGl2ZSwgYXV0by1jb21wbGV0aW5nLCBvciBvdGhlciBhY2NlbGVyYXRlZCBpbnB1dCBzY2hlbWVzLlxuICAgICAqIEEgY3JlZGl0IGNhcmQgbnVtYmVyIGlzIGFuIGV4YW1wbGUgb2Ygc2Vuc2l0aXZlIGRhdGEuXG4gICAgICogISN6aFxuICAgICAqIOihqOaYjui+k+WFpeeahOaWh+acrOaYr+aVj+aEn+aVsOaNru+8jOWug+emgeatouWtmOWCqOWIsOWtl+WFuOaIluihqOmHjOmdou+8jOS5n+S4jeiDveeUqOadpeiHquWKqOihpeWFqOWSjOaPkOekuueUqOaIt+i+k+WFpeOAglxuICAgICAqIOS4gOS4quS/oeeUqOWNoeWPt+eggeWwseaYr+S4gOS4quaVj+aEn+aVsOaNrueahOS+i+WtkOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTRU5TSVRJVkVcbiAgICAgKi9cbiAgICBTRU5TSVRJVkU6IDEsXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFRoaXMgZmxhZyBpcyBhIGhpbnQgdG8gdGhlIGltcGxlbWVudGF0aW9uIHRoYXQgZHVyaW5nIHRleHQgZWRpdGluZyxcbiAgICAgKiB0aGUgaW5pdGlhbCBsZXR0ZXIgb2YgZWFjaCB3b3JkIHNob3VsZCBiZSBjYXBpdGFsaXplZC5cbiAgICAgKiAhI3poXG4gICAgICogIOi/meS4quagh+W/l+eUqOadpeaMh+WumuWcqOaWh+acrOe8lui+keeahOaXtuWAme+8jOaYr+WQpuaKiuavj+S4gOS4quWNleivjeeahOmmluWtl+avjeWkp+WGmeOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBJTklUSUFMX0NBUFNfV09SRFxuICAgICAqL1xuICAgIElOSVRJQUxfQ0FQU19XT1JEOiAyLFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBUaGlzIGZsYWcgaXMgYSBoaW50IHRvIHRoZSBpbXBsZW1lbnRhdGlvbiB0aGF0IGR1cmluZyB0ZXh0IGVkaXRpbmcsXG4gICAgICogdGhlIGluaXRpYWwgbGV0dGVyIG9mIGVhY2ggc2VudGVuY2Ugc2hvdWxkIGJlIGNhcGl0YWxpemVkLlxuICAgICAqICEjemhcbiAgICAgKiDov5nkuKrmoIflv5fnlKjmnaXmjIflrprlnKjmlofmnKznvJbovpHmmK/lkKbmr4/kuKrlj6XlrZDnmoTpppblrZfmr43lpKflhpnjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gSU5JVElBTF9DQVBTX1NFTlRFTkNFXG4gICAgICovXG4gICAgSU5JVElBTF9DQVBTX1NFTlRFTkNFOiAzLFxuICAgIC8qKlxuICAgICAqICEjZW4gQ2FwaXRhbGl6ZSBhbGwgY2hhcmFjdGVycyBhdXRvbWF0aWNhbGx5LlxuICAgICAqICEjemgg6Ieq5Yqo5oqK6L6T5YWl55qE5omA5pyJ5a2X56ym5aSn5YaZ44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IElOSVRJQUxfQ0FQU19BTExfQ0hBUkFDVEVSU1xuICAgICAqL1xuICAgIElOSVRJQUxfQ0FQU19BTExfQ0hBUkFDVEVSUzogNCxcbiAgICAvKipcbiAgICAgKiBEb24ndCBkbyBhbnl0aGluZyB3aXRoIHRoZSBpbnB1dCB0ZXh0LlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBERUZBVUxUXG4gICAgICovXG4gICAgREVGQVVMVDogNVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEtleWJvYXJkUmV0dXJuVHlwZTogS2V5Ym9hcmRSZXR1cm5UeXBlLFxuICAgIElucHV0TW9kZTogSW5wdXRNb2RlLFxuICAgIElucHV0RmxhZzogSW5wdXRGbGFnXG59O1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=