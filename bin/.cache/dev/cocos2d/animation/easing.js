
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/animation/easing.js';
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
 * @module cc
 */

/**
 * !#en
 * This class provide easing methods for {{#crossLink "tween"}}{{/crossLink}} class.<br>
 * Demonstratio: https://easings.net/
 * !#zh
 * 缓动函数类，为 {{#crossLink "Tween"}}{{/crossLink}} 提供缓动效果函数。<br>
 * 函数效果演示： https://easings.net/
 * @class Easing
 */
var easing = {
  constant: function constant() {
    return 0;
  },
  linear: function linear(k) {
    return k;
  },
  // quad
  //  easing equation function for a quadratic (t^2)
  //  @param t: Current time (in frames or seconds).
  //  @return: The correct value.

  /**
   * !#en Easing in with quadratic formula. From slow to fast.
   * !#zh 平方曲线缓入函数。运动由慢到快。
   * @method quadIn
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value
   */
  quadIn: function quadIn(k) {
    return k * k;
  },

  /**
   * !#en Easing out with quadratic formula. From fast to slow.
   * !#zh 平方曲线缓出函数。运动由快到慢。
   * @method quadOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value
   */
  quadOut: function quadOut(k) {
    return k * (2 - k);
  },

  /**
   * !#en Easing in and out with quadratic formula. From slow to fast, then back to slow.
   * !#zh 平方曲线缓入缓出函数。运动由慢到快再到慢。
   * @method quadInOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value
   */
  quadInOut: function quadInOut(k) {
    if ((k *= 2) < 1) {
      return 0.5 * k * k;
    }

    return -0.5 * (--k * (k - 2) - 1);
  },
  // cubic
  //  easing equation function for a cubic (t^3)
  //  @param t: Current time (in frames or seconds).
  //  @return: The correct value.

  /**
   * !#en Easing in with cubic formula. From slow to fast.
   * !#zh 立方曲线缓入函数。运动由慢到快。
   * @method cubicIn
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  cubicIn: function cubicIn(k) {
    return k * k * k;
  },

  /**
   * !#en Easing out with cubic formula. From slow to fast.
   * !#zh 立方曲线缓出函数。运动由快到慢。
   * @method cubicOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  cubicOut: function cubicOut(k) {
    return --k * k * k + 1;
  },

  /**
   * !#en Easing in and out with cubic formula. From slow to fast, then back to slow.
   * !#zh 立方曲线缓入缓出函数。运动由慢到快再到慢。
   * @method cubicInOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  cubicInOut: function cubicInOut(k) {
    if ((k *= 2) < 1) {
      return 0.5 * k * k * k;
    }

    return 0.5 * ((k -= 2) * k * k + 2);
  },
  // quart
  //  easing equation function for a quartic (t^4)
  //  @param t: Current time (in frames or seconds).
  //  @return: The correct value.

  /**
   * !#en Easing in with quartic formula. From slow to fast.
   * !#zh 四次方曲线缓入函数。运动由慢到快。
   * @method quartIn
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  quartIn: function quartIn(k) {
    return k * k * k * k;
  },

  /**
   * !#en Easing out with quartic formula. From fast to slow.
   * !#zh 四次方曲线缓出函数。运动由快到慢。
   * @method quartOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  quartOut: function quartOut(k) {
    return 1 - --k * k * k * k;
  },

  /**
   * !#en Easing in and out with quartic formula. From slow to fast, then back to slow.
   * !#zh 四次方曲线缓入缓出函数。运动由慢到快再到慢。
   * @method quartInOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  quartInOut: function quartInOut(k) {
    if ((k *= 2) < 1) {
      return 0.5 * k * k * k * k;
    }

    return -0.5 * ((k -= 2) * k * k * k - 2);
  },
  // quint
  //  easing equation function for a quintic (t^5)
  //  @param t: Current time (in frames or seconds).
  //  @return: The correct value.

  /**
   * !#en Easing in with quintic formula. From slow to fast.
   * !#zh 五次方曲线缓入函数。运动由慢到快。
   * @method quintIn
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  quintIn: function quintIn(k) {
    return k * k * k * k * k;
  },

  /**
   * !#en Easing out with quintic formula. From fast to slow.
   * !#zh 五次方曲线缓出函数。运动由快到慢。
   * @method quintOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  quintOut: function quintOut(k) {
    return --k * k * k * k * k + 1;
  },

  /**
   * !#en Easing in and out with quintic formula. From slow to fast, then back to slow.
   * !#zh 五次方曲线缓入缓出函数。运动由慢到快再到慢。
   * @method quintInOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  quintInOut: function quintInOut(k) {
    if ((k *= 2) < 1) {
      return 0.5 * k * k * k * k * k;
    }

    return 0.5 * ((k -= 2) * k * k * k * k + 2);
  },
  // sine
  //  easing equation function for a sinusoidal (sin(t))
  //  @param t: Current time (in frames or seconds).
  //  @return: The correct value.

  /**
   * !#en Easing in and out with sine formula. From slow to fast.
   * !#zh 正弦曲线缓入函数。运动由慢到快。
   * @method sineIn
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  sineIn: function sineIn(k) {
    return 1 - Math.cos(k * Math.PI / 2);
  },

  /**
   * !#en Easing in and out with sine formula. From fast to slow.
   * !#zh 正弦曲线缓出函数。运动由快到慢。
   * @method sineOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  sineOut: function sineOut(k) {
    return Math.sin(k * Math.PI / 2);
  },

  /**
   * !#en Easing in and out with sine formula. From slow to fast, then back to slow.
   * !#zh 正弦曲线缓入缓出函数。运动由慢到快再到慢。
   * @method sineInOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  sineInOut: function sineInOut(k) {
    return 0.5 * (1 - Math.cos(Math.PI * k));
  },
  // expo
  //  easing equation function for an exponential (2^t)
  //  param t: Current time (in frames or seconds).
  //  return: The correct value.

  /**
   * !#en Easing in and out with exponential formula. From slow to fast.
   * !#zh 指数曲线缓入函数。运动由慢到快。
   * @method expoIn
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  expoIn: function expoIn(k) {
    return k === 0 ? 0 : Math.pow(1024, k - 1);
  },

  /**
   * !#en Easing in and out with exponential formula. From fast to slow.
   * !#zh 指数曲线缓出函数。运动由快到慢。
   * @method expoOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  expoOut: function expoOut(k) {
    return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
  },

  /**
   * !#en Easing in and out with exponential formula. From slow to fast.
   * !#zh 指数曲线缓入和缓出函数。运动由慢到很快再到慢。
   * @method expoInOut
   * @param {Number} t The current time as a percentage of the total time, then back to slow.
   * @return {Number} The correct value.
   */
  expoInOut: function expoInOut(k) {
    if (k === 0) {
      return 0;
    }

    if (k === 1) {
      return 1;
    }

    if ((k *= 2) < 1) {
      return 0.5 * Math.pow(1024, k - 1);
    }

    return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
  },
  // circ
  //  easing equation function for a circular (sqrt(1-t^2))
  //  @param t: Current time (in frames or seconds).
  //  @return:	The correct value.

  /**
   * !#en Easing in and out with circular formula. From slow to fast.
   * !#zh 循环公式缓入函数。运动由慢到快。
   * @method circIn
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  circIn: function circIn(k) {
    return 1 - Math.sqrt(1 - k * k);
  },

  /**
   * !#en Easing in and out with circular formula. From fast to slow.
   * !#zh 循环公式缓出函数。运动由快到慢。
   * @method circOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  circOut: function circOut(k) {
    return Math.sqrt(1 - --k * k);
  },

  /**
   * !#en Easing in and out with circular formula. From slow to fast.
   * !#zh 指数曲线缓入缓出函数。运动由慢到很快再到慢。
   * @method circInOut
   * @param {Number} t The current time as a percentage of the total time, then back to slow.
   * @return {Number} The correct value.
   */
  circInOut: function circInOut(k) {
    if ((k *= 2) < 1) {
      return -0.5 * (Math.sqrt(1 - k * k) - 1);
    }

    return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
  },
  // elastic
  //  easing equation function for an elastic (exponentially decaying sine wave)
  //  @param t: Current time (in frames or seconds).
  //  @return: The correct value.
  //  recommand value: elastic (t)

  /**
   * !#en Easing in action with a spring oscillating effect.
   * !#zh 弹簧回震效果的缓入函数。
   * @method elasticIn
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  elasticIn: function elasticIn(k) {
    var s,
        a = 0.1,
        p = 0.4;

    if (k === 0) {
      return 0;
    }

    if (k === 1) {
      return 1;
    }

    if (!a || a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = p * Math.asin(1 / a) / (2 * Math.PI);
    }

    return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
  },

  /**
   * !#en Easing out action with a spring oscillating effect.
   * !#zh 弹簧回震效果的缓出函数。
   * @method elasticOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  elasticOut: function elasticOut(k) {
    var s,
        a = 0.1,
        p = 0.4;

    if (k === 0) {
      return 0;
    }

    if (k === 1) {
      return 1;
    }

    if (!a || a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = p * Math.asin(1 / a) / (2 * Math.PI);
    }

    return a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1;
  },

  /**
   * !#en Easing in and out action with a spring oscillating effect.
   * !#zh 弹簧回震效果的缓入缓出函数。
   * @method elasticInOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  elasticInOut: function elasticInOut(k) {
    var s,
        a = 0.1,
        p = 0.4;

    if (k === 0) {
      return 0;
    }

    if (k === 1) {
      return 1;
    }

    if (!a || a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = p * Math.asin(1 / a) / (2 * Math.PI);
    }

    if ((k *= 2) < 1) {
      return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
    }

    return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
  },
  // back
  //  easing equation function for a back (overshooting cubic easing: (s+1)*t^3 - s*t^2)
  //  @param t: Current time (in frames or seconds).
  //  @return: The correct value.

  /**
   * !#en Easing in action with "back up" behavior.
   * !#zh 回退效果的缓入函数。
   * @method backIn
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  backIn: function backIn(k) {
    var s = 1.70158;
    return k * k * ((s + 1) * k - s);
  },

  /**
   * !#en Easing out action with "back up" behavior.
   * !#zh 回退效果的缓出函数。
   * @method backOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  backOut: function backOut(k) {
    var s = 1.70158;
    return --k * k * ((s + 1) * k + s) + 1;
  },

  /**
   * !#en Easing in and out action with "back up" behavior.
   * !#zh 回退效果的缓入缓出函数。
   * @method backInOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  backInOut: function backInOut(k) {
    var s = 1.70158 * 1.525;

    if ((k *= 2) < 1) {
      return 0.5 * (k * k * ((s + 1) * k - s));
    }

    return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
  },
  // bounce
  //  easing equation function for a bounce (exponentially decaying parabolic bounce)
  //  @param t: Current time (in frames or seconds).
  //  @return: The correct value.

  /**
   * !#en Easing in action with bouncing effect.
   * !#zh 弹跳效果的缓入函数。
   * @method bounceIn
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  bounceIn: function bounceIn(k) {
    return 1 - easing.bounceOut(1 - k);
  },

  /**
   * !#en Easing out action with bouncing effect.
   * !#zh 弹跳效果的缓出函数。
   * @method bounceOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  bounceOut: function bounceOut(k) {
    if (k < 1 / 2.75) {
      return 7.5625 * k * k;
    } else if (k < 2 / 2.75) {
      return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
    } else if (k < 2.5 / 2.75) {
      return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
    } else {
      return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
    }
  },

  /**
   * !#en Easing in and out action with bouncing effect.
   * !#zh 弹跳效果的缓入缓出函数。
   * @method bounceInOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  bounceInOut: function bounceInOut(k) {
    if (k < 0.5) {
      return easing.bounceIn(k * 2) * 0.5;
    }

    return easing.bounceOut(k * 2 - 1) * 0.5 + 0.5;
  },

  /**
   * !#en Target will run action with smooth effect.
   * !#zh 平滑效果函数。
   * @method smooth
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  // t<=0: 0 | 0<t<1: 3*t^2 - 2*t^3 | t>=1: 1
  smooth: function smooth(t) {
    if (t <= 0) {
      return 0;
    }

    if (t >= 1) {
      return 1;
    }

    return t * t * (3 - 2 * t);
  },

  /**
   * !#en Target will run action with fade effect.
   * !#zh 渐褪效果函数。
   * @method fade
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  // t<=0: 0 | 0<t<1: 6*t^5 - 15*t^4 + 10*t^3 | t>=1: 1
  fade: function fade(t) {
    if (t <= 0) {
      return 0;
    }

    if (t >= 1) {
      return 1;
    }

    return t * t * t * (t * (t * 6 - 15) + 10);
  }
};

function _makeOutIn(fnIn, fnOut) {
  return function (k) {
    if (k < 0.5) {
      return fnOut(k * 2) / 2;
    }

    return fnIn(2 * k - 1) / 2 + 0.5;
  };
}

easing.quadOutIn = _makeOutIn(easing.quadIn, easing.quadOut);
easing.cubicOutIn = _makeOutIn(easing.cubicIn, easing.cubicOut);
easing.quartOutIn = _makeOutIn(easing.quartIn, easing.quartOut);
easing.quintOutIn = _makeOutIn(easing.quintIn, easing.quintOut);
easing.sineOutIn = _makeOutIn(easing.sineIn, easing.sineOut);
easing.expoOutIn = _makeOutIn(easing.expoIn, easing.expoOut);
easing.circOutIn = _makeOutIn(easing.circIn, easing.circOut);
easing.backOutIn = _makeOutIn(easing.backIn, easing.backOut);

easing.bounceIn = function (k) {
  return 1 - easing.bounceOut(1 - k);
};

easing.bounceInOut = function (k) {
  if (k < 0.5) {
    return easing.bounceIn(k * 2) * 0.5;
  }

  return easing.bounceOut(k * 2 - 1) * 0.5 + 0.5;
};

easing.bounceOutIn = _makeOutIn(easing.bounceIn, easing.bounceOut);
/**
 * @module cc
 */

/**
 * !#en This is a Easing instance.
 * !#zh 这是一个 Easing 类实例。
 * @property easing
 * @type Easing
 */

cc.easing = module.exports = easing;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9hbmltYXRpb24vZWFzaW5nLmpzIl0sIm5hbWVzIjpbImVhc2luZyIsImNvbnN0YW50IiwibGluZWFyIiwiayIsInF1YWRJbiIsInF1YWRPdXQiLCJxdWFkSW5PdXQiLCJjdWJpY0luIiwiY3ViaWNPdXQiLCJjdWJpY0luT3V0IiwicXVhcnRJbiIsInF1YXJ0T3V0IiwicXVhcnRJbk91dCIsInF1aW50SW4iLCJxdWludE91dCIsInF1aW50SW5PdXQiLCJzaW5lSW4iLCJNYXRoIiwiY29zIiwiUEkiLCJzaW5lT3V0Iiwic2luIiwic2luZUluT3V0IiwiZXhwb0luIiwicG93IiwiZXhwb091dCIsImV4cG9Jbk91dCIsImNpcmNJbiIsInNxcnQiLCJjaXJjT3V0IiwiY2lyY0luT3V0IiwiZWxhc3RpY0luIiwicyIsImEiLCJwIiwiYXNpbiIsImVsYXN0aWNPdXQiLCJlbGFzdGljSW5PdXQiLCJiYWNrSW4iLCJiYWNrT3V0IiwiYmFja0luT3V0IiwiYm91bmNlSW4iLCJib3VuY2VPdXQiLCJib3VuY2VJbk91dCIsInNtb290aCIsInQiLCJmYWRlIiwiX21ha2VPdXRJbiIsImZuSW4iLCJmbk91dCIsInF1YWRPdXRJbiIsImN1YmljT3V0SW4iLCJxdWFydE91dEluIiwicXVpbnRPdXRJbiIsInNpbmVPdXRJbiIsImV4cG9PdXRJbiIsImNpcmNPdXRJbiIsImJhY2tPdXRJbiIsImJvdW5jZU91dEluIiwiY2MiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFJ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KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqXG4gKiBAbW9kdWxlIGNjXG4gKi9cblxuIC8qKlxuICAqICEjZW5cbiAgKiBUaGlzIGNsYXNzIHByb3ZpZGUgZWFzaW5nIG1ldGhvZHMgZm9yIHt7I2Nyb3NzTGluayBcInR3ZWVuXCJ9fXt7L2Nyb3NzTGlua319IGNsYXNzLjxicj5cbiAgKiBEZW1vbnN0cmF0aW86IGh0dHBzOi8vZWFzaW5ncy5uZXQvXG4gICogISN6aFxuICAqIOe8k+WKqOWHveaVsOexu++8jOS4uiB7eyNjcm9zc0xpbmsgXCJUd2VlblwifX17ey9jcm9zc0xpbmt9fSDmj5DkvpvnvJPliqjmlYjmnpzlh73mlbDjgII8YnI+XG4gICog5Ye95pWw5pWI5p6c5ryU56S677yaIGh0dHBzOi8vZWFzaW5ncy5uZXQvXG4gICogQGNsYXNzIEVhc2luZ1xuICAqL1xuXG52YXIgZWFzaW5nID0ge1xuICAgIGNvbnN0YW50OiBmdW5jdGlvbiAoKSB7IHJldHVybiAwOyB9LFxuICAgIGxpbmVhcjogZnVuY3Rpb24gKGspIHsgcmV0dXJuIGs7IH0sXG5cbiAgICAvLyBxdWFkXG4gICAgLy8gIGVhc2luZyBlcXVhdGlvbiBmdW5jdGlvbiBmb3IgYSBxdWFkcmF0aWMgKHReMilcbiAgICAvLyAgQHBhcmFtIHQ6IEN1cnJlbnQgdGltZSAoaW4gZnJhbWVzIG9yIHNlY29uZHMpLlxuICAgIC8vICBAcmV0dXJuOiBUaGUgY29ycmVjdCB2YWx1ZS5cblxuICAgIC8qKlxuICAgICAqICEjZW4gRWFzaW5nIGluIHdpdGggcXVhZHJhdGljIGZvcm11bGEuIEZyb20gc2xvdyB0byBmYXN0LlxuICAgICAqICEjemgg5bmz5pa55puy57q/57yT5YWl5Ye95pWw44CC6L+Q5Yqo55Sx5oWi5Yiw5b+r44CCXG4gICAgICogQG1ldGhvZCBxdWFkSW5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCBUaGUgY3VycmVudCB0aW1lIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgdGltZS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBjb3JyZWN0IHZhbHVlXG4gICAgICovXG4gICAgcXVhZEluOiBmdW5jdGlvbiAoaykgeyByZXR1cm4gayAqIGs7IH0sXG4gICAgLyoqXG4gICAgICogISNlbiBFYXNpbmcgb3V0IHdpdGggcXVhZHJhdGljIGZvcm11bGEuIEZyb20gZmFzdCB0byBzbG93LlxuICAgICAqICEjemgg5bmz5pa55puy57q/57yT5Ye65Ye95pWw44CC6L+Q5Yqo55Sx5b+r5Yiw5oWi44CCXG4gICAgICogQG1ldGhvZCBxdWFkT3V0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZVxuICAgICAqL1xuICAgIHF1YWRPdXQ6IGZ1bmN0aW9uIChrKSB7IHJldHVybiBrICogKCAyIC0gayApOyB9LFxuICAgIC8qKlxuICAgICAqICEjZW4gRWFzaW5nIGluIGFuZCBvdXQgd2l0aCBxdWFkcmF0aWMgZm9ybXVsYS4gRnJvbSBzbG93IHRvIGZhc3QsIHRoZW4gYmFjayB0byBzbG93LlxuICAgICAqICEjemgg5bmz5pa55puy57q/57yT5YWl57yT5Ye65Ye95pWw44CC6L+Q5Yqo55Sx5oWi5Yiw5b+r5YaN5Yiw5oWi44CCXG4gICAgICogQG1ldGhvZCBxdWFkSW5PdXRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCBUaGUgY3VycmVudCB0aW1lIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgdGltZS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBjb3JyZWN0IHZhbHVlXG4gICAgICovXG4gICAgcXVhZEluT3V0OiBmdW5jdGlvbiAoaykge1xuICAgICAgICBpZiAoKCBrICo9IDIgKSA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiAwLjUgKiBrICogaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTAuNSAqICggLS1rICogKCBrIC0gMiApIC0gMSApO1xuICAgIH0sXG5cbiAgICAvLyBjdWJpY1xuICAgIC8vICBlYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGEgY3ViaWMgKHReMylcbiAgICAvLyAgQHBhcmFtIHQ6IEN1cnJlbnQgdGltZSAoaW4gZnJhbWVzIG9yIHNlY29uZHMpLlxuICAgIC8vICBAcmV0dXJuOiBUaGUgY29ycmVjdCB2YWx1ZS5cblxuICAgIC8qKlxuICAgICAqICEjZW4gRWFzaW5nIGluIHdpdGggY3ViaWMgZm9ybXVsYS4gRnJvbSBzbG93IHRvIGZhc3QuXG4gICAgICogISN6aCDnq4vmlrnmm7Lnur/nvJPlhaXlh73mlbDjgILov5DliqjnlLHmhaLliLDlv6vjgIJcbiAgICAgKiBAbWV0aG9kIGN1YmljSW5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCBUaGUgY3VycmVudCB0aW1lIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgdGltZS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBjb3JyZWN0IHZhbHVlLlxuICAgICAqL1xuICAgIGN1YmljSW46IGZ1bmN0aW9uIChrKSB7IHJldHVybiBrICogayAqIGs7IH0sXG4gICAgLyoqXG4gICAgICogISNlbiBFYXNpbmcgb3V0IHdpdGggY3ViaWMgZm9ybXVsYS4gRnJvbSBzbG93IHRvIGZhc3QuXG4gICAgICogISN6aCDnq4vmlrnmm7Lnur/nvJPlh7rlh73mlbDjgILov5DliqjnlLHlv6vliLDmhaLjgIJcbiAgICAgKiBAbWV0aG9kIGN1YmljT3V0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZS5cbiAgICAgKi9cbiAgICBjdWJpY091dDogZnVuY3Rpb24gKGspIHsgcmV0dXJuIC0tayAqIGsgKiBrICsgMTsgfSxcbiAgICAvKipcbiAgICAgKiAhI2VuIEVhc2luZyBpbiBhbmQgb3V0IHdpdGggY3ViaWMgZm9ybXVsYS4gRnJvbSBzbG93IHRvIGZhc3QsIHRoZW4gYmFjayB0byBzbG93LlxuICAgICAqICEjemgg56uL5pa55puy57q/57yT5YWl57yT5Ye65Ye95pWw44CC6L+Q5Yqo55Sx5oWi5Yiw5b+r5YaN5Yiw5oWi44CCXG4gICAgICogQG1ldGhvZCBjdWJpY0luT3V0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZS5cbiAgICAgKi9cbiAgICBjdWJpY0luT3V0OiBmdW5jdGlvbiAoaykge1xuICAgICAgICBpZiAoKCBrICo9IDIgKSA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiAwLjUgKiBrICogayAqIGs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDAuNSAqICggKCBrIC09IDIgKSAqIGsgKiBrICsgMiApO1xuICAgIH0sXG5cbiAgICAvLyBxdWFydFxuICAgIC8vICBlYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGEgcXVhcnRpYyAodF40KVxuICAgIC8vICBAcGFyYW0gdDogQ3VycmVudCB0aW1lIChpbiBmcmFtZXMgb3Igc2Vjb25kcykuXG4gICAgLy8gIEByZXR1cm46IFRoZSBjb3JyZWN0IHZhbHVlLlxuXG4gICAgLyoqXG4gICAgICogISNlbiBFYXNpbmcgaW4gd2l0aCBxdWFydGljIGZvcm11bGEuIEZyb20gc2xvdyB0byBmYXN0LlxuICAgICAqICEjemgg5Zub5qyh5pa55puy57q/57yT5YWl5Ye95pWw44CC6L+Q5Yqo55Sx5oWi5Yiw5b+r44CCXG4gICAgICogQG1ldGhvZCBxdWFydEluXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZS5cbiAgICAgKi9cbiAgICBxdWFydEluOiBmdW5jdGlvbiAoaykgeyByZXR1cm4gayAqIGsgKiBrICogazsgfSxcbiAgICAvKipcbiAgICAgKiAhI2VuIEVhc2luZyBvdXQgd2l0aCBxdWFydGljIGZvcm11bGEuIEZyb20gZmFzdCB0byBzbG93LlxuICAgICAqICEjemgg5Zub5qyh5pa55puy57q/57yT5Ye65Ye95pWw44CC6L+Q5Yqo55Sx5b+r5Yiw5oWi44CCXG4gICAgICogQG1ldGhvZCBxdWFydE91dFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IFRoZSBjdXJyZW50IHRpbWUgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCB0aW1lLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGNvcnJlY3QgdmFsdWUuXG4gICAgICovXG4gICAgcXVhcnRPdXQ6IGZ1bmN0aW9uIChrKSB7IHJldHVybiAxIC0gKCAtLWsgKiBrICogayAqIGsgKTsgfSxcbiAgICAvKipcbiAgICAgKiAhI2VuIEVhc2luZyBpbiBhbmQgb3V0IHdpdGggcXVhcnRpYyBmb3JtdWxhLiBGcm9tIHNsb3cgdG8gZmFzdCwgdGhlbiBiYWNrIHRvIHNsb3cuXG4gICAgICogISN6aCDlm5vmrKHmlrnmm7Lnur/nvJPlhaXnvJPlh7rlh73mlbDjgILov5DliqjnlLHmhaLliLDlv6vlho3liLDmhaLjgIJcbiAgICAgKiBAbWV0aG9kIHF1YXJ0SW5PdXRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCBUaGUgY3VycmVudCB0aW1lIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgdGltZS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBjb3JyZWN0IHZhbHVlLlxuICAgICAqL1xuICAgIHF1YXJ0SW5PdXQ6ICBmdW5jdGlvbiAoaykge1xuICAgICAgICBpZiAoKCBrICo9IDIgKSA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiAwLjUgKiBrICogayAqIGsgKiBrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMC41ICogKCAoIGsgLT0gMiApICogayAqIGsgKiBrIC0gMiApO1xuICAgIH0sXG5cbiAgICAvLyBxdWludFxuICAgIC8vICBlYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGEgcXVpbnRpYyAodF41KVxuICAgIC8vICBAcGFyYW0gdDogQ3VycmVudCB0aW1lIChpbiBmcmFtZXMgb3Igc2Vjb25kcykuXG4gICAgLy8gIEByZXR1cm46IFRoZSBjb3JyZWN0IHZhbHVlLlxuXG4gICAgLyoqXG4gICAgICogISNlbiBFYXNpbmcgaW4gd2l0aCBxdWludGljIGZvcm11bGEuIEZyb20gc2xvdyB0byBmYXN0LlxuICAgICAqICEjemgg5LqU5qyh5pa55puy57q/57yT5YWl5Ye95pWw44CC6L+Q5Yqo55Sx5oWi5Yiw5b+r44CCXG4gICAgICogQG1ldGhvZCBxdWludEluXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZS5cbiAgICAgKi9cbiAgICBxdWludEluOiBmdW5jdGlvbiAoaykgeyByZXR1cm4gayAqIGsgKiBrICogayAqIGs7IH0sXG4gICAgLyoqXG4gICAgICogISNlbiBFYXNpbmcgb3V0IHdpdGggcXVpbnRpYyBmb3JtdWxhLiBGcm9tIGZhc3QgdG8gc2xvdy5cbiAgICAgKiAhI3poIOS6lOasoeaWueabsue6v+e8k+WHuuWHveaVsOOAgui/kOWKqOeUseW/q+WIsOaFouOAglxuICAgICAqIEBtZXRob2QgcXVpbnRPdXRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCBUaGUgY3VycmVudCB0aW1lIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgdGltZS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBjb3JyZWN0IHZhbHVlLlxuICAgICAqL1xuICAgIHF1aW50T3V0OiBmdW5jdGlvbiAoaykgeyByZXR1cm4gLS1rICogayAqIGsgKiBrICogayArIDE7IH0sXG4gICAgLyoqXG4gICAgICogISNlbiBFYXNpbmcgaW4gYW5kIG91dCB3aXRoIHF1aW50aWMgZm9ybXVsYS4gRnJvbSBzbG93IHRvIGZhc3QsIHRoZW4gYmFjayB0byBzbG93LlxuICAgICAqICEjemgg5LqU5qyh5pa55puy57q/57yT5YWl57yT5Ye65Ye95pWw44CC6L+Q5Yqo55Sx5oWi5Yiw5b+r5YaN5Yiw5oWi44CCXG4gICAgICogQG1ldGhvZCBxdWludEluT3V0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZS5cbiAgICAgKi9cbiAgICBxdWludEluT3V0OiBmdW5jdGlvbiAoaykge1xuICAgICAgICBpZiAoKCBrICo9IDIgKSA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiAwLjUgKiBrICogayAqIGsgKiBrICogaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMC41ICogKCAoIGsgLT0gMiApICogayAqIGsgKiBrICogayArIDIgKTtcbiAgICB9LFxuXG4gICAgLy8gc2luZVxuICAgIC8vICBlYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGEgc2ludXNvaWRhbCAoc2luKHQpKVxuICAgIC8vICBAcGFyYW0gdDogQ3VycmVudCB0aW1lIChpbiBmcmFtZXMgb3Igc2Vjb25kcykuXG4gICAgLy8gIEByZXR1cm46IFRoZSBjb3JyZWN0IHZhbHVlLlxuXG4gICAgLyoqXG4gICAgICogISNlbiBFYXNpbmcgaW4gYW5kIG91dCB3aXRoIHNpbmUgZm9ybXVsYS4gRnJvbSBzbG93IHRvIGZhc3QuXG4gICAgICogISN6aCDmraPlvKbmm7Lnur/nvJPlhaXlh73mlbDjgILov5DliqjnlLHmhaLliLDlv6vjgIJcbiAgICAgKiBAbWV0aG9kIHNpbmVJblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IFRoZSBjdXJyZW50IHRpbWUgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCB0aW1lLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGNvcnJlY3QgdmFsdWUuXG4gICAgICovXG4gICAgc2luZUluOiBmdW5jdGlvbiAoaykgeyByZXR1cm4gMSAtIE1hdGguY29zKGsgKiBNYXRoLlBJIC8gMik7IH0sXG4gICAgLyoqXG4gICAgICogISNlbiBFYXNpbmcgaW4gYW5kIG91dCB3aXRoIHNpbmUgZm9ybXVsYS4gRnJvbSBmYXN0IHRvIHNsb3cuXG4gICAgICogISN6aCDmraPlvKbmm7Lnur/nvJPlh7rlh73mlbDjgILov5DliqjnlLHlv6vliLDmhaLjgIJcbiAgICAgKiBAbWV0aG9kIHNpbmVPdXRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCBUaGUgY3VycmVudCB0aW1lIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgdGltZS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBjb3JyZWN0IHZhbHVlLlxuICAgICAqL1xuICAgIHNpbmVPdXQ6IGZ1bmN0aW9uIChrKSB7IHJldHVybiBNYXRoLnNpbihrICogTWF0aC5QSSAvIDIpOyB9LFxuICAgIC8qKlxuICAgICAqICEjZW4gRWFzaW5nIGluIGFuZCBvdXQgd2l0aCBzaW5lIGZvcm11bGEuIEZyb20gc2xvdyB0byBmYXN0LCB0aGVuIGJhY2sgdG8gc2xvdy5cbiAgICAgKiAhI3poIOato+W8puabsue6v+e8k+WFpee8k+WHuuWHveaVsOOAgui/kOWKqOeUseaFouWIsOW/q+WGjeWIsOaFouOAglxuICAgICAqIEBtZXRob2Qgc2luZUluT3V0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZS5cbiAgICAgKi9cbiAgICBzaW5lSW5PdXQ6IGZ1bmN0aW9uIChrKSB7IHJldHVybiAwLjUgKiAoIDEgLSBNYXRoLmNvcyhNYXRoLlBJICogaykgKTsgfSxcblxuICAgIC8vIGV4cG9cbiAgICAvLyAgZWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhbiBleHBvbmVudGlhbCAoMl50KVxuICAgIC8vICBwYXJhbSB0OiBDdXJyZW50IHRpbWUgKGluIGZyYW1lcyBvciBzZWNvbmRzKS5cbiAgICAvLyAgcmV0dXJuOiBUaGUgY29ycmVjdCB2YWx1ZS5cblxuICAgIC8qKlxuICAgICAqICEjZW4gRWFzaW5nIGluIGFuZCBvdXQgd2l0aCBleHBvbmVudGlhbCBmb3JtdWxhLiBGcm9tIHNsb3cgdG8gZmFzdC5cbiAgICAgKiAhI3poIOaMh+aVsOabsue6v+e8k+WFpeWHveaVsOOAgui/kOWKqOeUseaFouWIsOW/q+OAglxuICAgICAqIEBtZXRob2QgZXhwb0luXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZS5cbiAgICAgKi9cbiAgICBleHBvSW46IGZ1bmN0aW9uIChrKSB7IHJldHVybiBrID09PSAwID8gMCA6IE1hdGgucG93KDEwMjQsIGsgLSAxKTsgfSxcbiAgICAvKipcbiAgICAgKiAhI2VuIEVhc2luZyBpbiBhbmQgb3V0IHdpdGggZXhwb25lbnRpYWwgZm9ybXVsYS4gRnJvbSBmYXN0IHRvIHNsb3cuXG4gICAgICogISN6aCDmjIfmlbDmm7Lnur/nvJPlh7rlh73mlbDjgILov5DliqjnlLHlv6vliLDmhaLjgIJcbiAgICAgKiBAbWV0aG9kIGV4cG9PdXRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCBUaGUgY3VycmVudCB0aW1lIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgdGltZS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBjb3JyZWN0IHZhbHVlLlxuICAgICAqL1xuICAgIGV4cG9PdXQ6IGZ1bmN0aW9uIChrKSB7IHJldHVybiBrID09PSAxID8gMSA6IDEgLSBNYXRoLnBvdygyLCAtMTAgKiBrKTsgfSxcbiAgICAvKipcbiAgICAgKiAhI2VuIEVhc2luZyBpbiBhbmQgb3V0IHdpdGggZXhwb25lbnRpYWwgZm9ybXVsYS4gRnJvbSBzbG93IHRvIGZhc3QuXG4gICAgICogISN6aCDmjIfmlbDmm7Lnur/nvJPlhaXlkoznvJPlh7rlh73mlbDjgILov5DliqjnlLHmhaLliLDlvojlv6vlho3liLDmhaLjgIJcbiAgICAgKiBAbWV0aG9kIGV4cG9Jbk91dFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IFRoZSBjdXJyZW50IHRpbWUgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCB0aW1lLCB0aGVuIGJhY2sgdG8gc2xvdy5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBjb3JyZWN0IHZhbHVlLlxuICAgICAqL1xuICAgIGV4cG9Jbk91dDogZnVuY3Rpb24gKGspIHtcbiAgICAgICAgaWYgKGsgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChrID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKCBrICo9IDIgKSA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiAwLjUgKiBNYXRoLnBvdygxMDI0LCBrIC0gMSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDAuNSAqICggLU1hdGgucG93KDIsIC0xMCAqICggayAtIDEgKSkgKyAyICk7XG4gICAgfSxcblxuICAgIC8vIGNpcmNcbiAgICAvLyAgZWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhIGNpcmN1bGFyIChzcXJ0KDEtdF4yKSlcbiAgICAvLyAgQHBhcmFtIHQ6IEN1cnJlbnQgdGltZSAoaW4gZnJhbWVzIG9yIHNlY29uZHMpLlxuICAgIC8vICBAcmV0dXJuOlx0VGhlIGNvcnJlY3QgdmFsdWUuXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEVhc2luZyBpbiBhbmQgb3V0IHdpdGggY2lyY3VsYXIgZm9ybXVsYS4gRnJvbSBzbG93IHRvIGZhc3QuXG4gICAgICogISN6aCDlvqrnjq/lhazlvI/nvJPlhaXlh73mlbDjgILov5DliqjnlLHmhaLliLDlv6vjgIJcbiAgICAgKiBAbWV0aG9kIGNpcmNJblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IFRoZSBjdXJyZW50IHRpbWUgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCB0aW1lLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGNvcnJlY3QgdmFsdWUuXG4gICAgICovXG4gICAgY2lyY0luOiBmdW5jdGlvbiAoaykgeyByZXR1cm4gMSAtIE1hdGguc3FydCgxIC0gayAqIGspOyB9LFxuICAgIC8qKlxuICAgICAqICEjZW4gRWFzaW5nIGluIGFuZCBvdXQgd2l0aCBjaXJjdWxhciBmb3JtdWxhLiBGcm9tIGZhc3QgdG8gc2xvdy5cbiAgICAgKiAhI3poIOW+queOr+WFrOW8j+e8k+WHuuWHveaVsOOAgui/kOWKqOeUseW/q+WIsOaFouOAglxuICAgICAqIEBtZXRob2QgY2lyY091dFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IFRoZSBjdXJyZW50IHRpbWUgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCB0aW1lLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGNvcnJlY3QgdmFsdWUuXG4gICAgICovXG4gICAgY2lyY091dDogZnVuY3Rpb24gKGspIHsgcmV0dXJuIE1hdGguc3FydCgxIC0gKCAtLWsgKiBrICkpOyB9LFxuICAgIC8qKlxuICAgICAqICEjZW4gRWFzaW5nIGluIGFuZCBvdXQgd2l0aCBjaXJjdWxhciBmb3JtdWxhLiBGcm9tIHNsb3cgdG8gZmFzdC5cbiAgICAgKiAhI3poIOaMh+aVsOabsue6v+e8k+WFpee8k+WHuuWHveaVsOOAgui/kOWKqOeUseaFouWIsOW+iOW/q+WGjeWIsOaFouOAglxuICAgICAqIEBtZXRob2QgY2lyY0luT3V0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUsIHRoZW4gYmFjayB0byBzbG93LlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGNvcnJlY3QgdmFsdWUuXG4gICAgICovXG4gICAgY2lyY0luT3V0OiBmdW5jdGlvbiAoaykge1xuICAgICAgICBpZiAoKCBrICo9IDIgKSA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiAtMC41ICogKCBNYXRoLnNxcnQoMSAtIGsgKiBrKSAtIDEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwLjUgKiAoIE1hdGguc3FydCgxIC0gKCBrIC09IDIpICogaykgKyAxKTtcbiAgICB9LFxuXG4gICAgLy8gZWxhc3RpY1xuICAgIC8vICBlYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGFuIGVsYXN0aWMgKGV4cG9uZW50aWFsbHkgZGVjYXlpbmcgc2luZSB3YXZlKVxuICAgIC8vICBAcGFyYW0gdDogQ3VycmVudCB0aW1lIChpbiBmcmFtZXMgb3Igc2Vjb25kcykuXG4gICAgLy8gIEByZXR1cm46IFRoZSBjb3JyZWN0IHZhbHVlLlxuICAgIC8vICByZWNvbW1hbmQgdmFsdWU6IGVsYXN0aWMgKHQpXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEVhc2luZyBpbiBhY3Rpb24gd2l0aCBhIHNwcmluZyBvc2NpbGxhdGluZyBlZmZlY3QuXG4gICAgICogISN6aCDlvLnnsKflm57pnIfmlYjmnpznmoTnvJPlhaXlh73mlbDjgIJcbiAgICAgKiBAbWV0aG9kIGVsYXN0aWNJblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IFRoZSBjdXJyZW50IHRpbWUgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCB0aW1lLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGNvcnJlY3QgdmFsdWUuXG4gICAgICovXG4gICAgZWxhc3RpY0luOiBmdW5jdGlvbiAoaykge1xuICAgICAgICB2YXIgcywgYSA9IDAuMSwgcCA9IDAuNDtcbiAgICAgICAgaWYgKGsgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChrID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWEgfHwgYSA8IDEpIHtcbiAgICAgICAgICAgIGEgPSAxO1xuICAgICAgICAgICAgcyA9IHAgLyA0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcyA9IHAgKiBNYXRoLmFzaW4oMSAvIGEpIC8gKCAyICogTWF0aC5QSSApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtKCBhICogTWF0aC5wb3coMiwgMTAgKiAoIGsgLT0gMSApKSAqIE1hdGguc2luKCggayAtIHMgKSAqICggMiAqIE1hdGguUEkgKSAvIHApICk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiAhI2VuIEVhc2luZyBvdXQgYWN0aW9uIHdpdGggYSBzcHJpbmcgb3NjaWxsYXRpbmcgZWZmZWN0LlxuICAgICAqICEjemgg5by557Cn5Zue6ZyH5pWI5p6c55qE57yT5Ye65Ye95pWw44CCXG4gICAgICogQG1ldGhvZCBlbGFzdGljT3V0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZS5cbiAgICAgKi9cbiAgICBlbGFzdGljT3V0OiBmdW5jdGlvbiAoaykge1xuICAgICAgICB2YXIgcywgYSA9IDAuMSwgcCA9IDAuNDtcbiAgICAgICAgaWYgKGsgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChrID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWEgfHwgYSA8IDEpIHtcbiAgICAgICAgICAgIGEgPSAxO1xuICAgICAgICAgICAgcyA9IHAgLyA0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcyA9IHAgKiBNYXRoLmFzaW4oMSAvIGEpIC8gKCAyICogTWF0aC5QSSApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoIGEgKiBNYXRoLnBvdygyLCAtMTAgKiBrKSAqIE1hdGguc2luKCggayAtIHMgKSAqICggMiAqIE1hdGguUEkgKSAvIHApICsgMSApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogISNlbiBFYXNpbmcgaW4gYW5kIG91dCBhY3Rpb24gd2l0aCBhIHNwcmluZyBvc2NpbGxhdGluZyBlZmZlY3QuXG4gICAgICogISN6aCDlvLnnsKflm57pnIfmlYjmnpznmoTnvJPlhaXnvJPlh7rlh73mlbDjgIJcbiAgICAgKiBAbWV0aG9kIGVsYXN0aWNJbk91dFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IFRoZSBjdXJyZW50IHRpbWUgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCB0aW1lLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGNvcnJlY3QgdmFsdWUuXG4gICAgICovXG4gICAgZWxhc3RpY0luT3V0OiBmdW5jdGlvbiAoaykge1xuICAgICAgICB2YXIgcywgYSA9IDAuMSwgcCA9IDAuNDtcbiAgICAgICAgaWYgKGsgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChrID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWEgfHwgYSA8IDEpIHtcbiAgICAgICAgICAgIGEgPSAxO1xuICAgICAgICAgICAgcyA9IHAgLyA0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcyA9IHAgKiBNYXRoLmFzaW4oMSAvIGEpIC8gKCAyICogTWF0aC5QSSApO1xuICAgICAgICB9XG4gICAgICAgIGlmICgoIGsgKj0gMiApIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuIC0wLjUgKlxuICAgICAgICAgICAgICAgICAgICggYSAqIE1hdGgucG93KDIsIDEwICogKCBrIC09IDEgKSkgKiBNYXRoLnNpbigoIGsgLSBzICkgKiAoIDIgKiBNYXRoLlBJICkgLyBwKSApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhICogTWF0aC5wb3coMiwgLTEwICogKCBrIC09IDEgKSkgKiBNYXRoLnNpbigoIGsgLSBzICkgKiAoIDIgKiBNYXRoLlBJICkgLyBwKSAqIDAuNSArIDE7XG4gICAgfSxcblxuICAgIC8vIGJhY2tcbiAgICAvLyAgZWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhIGJhY2sgKG92ZXJzaG9vdGluZyBjdWJpYyBlYXNpbmc6IChzKzEpKnReMyAtIHMqdF4yKVxuICAgIC8vICBAcGFyYW0gdDogQ3VycmVudCB0aW1lIChpbiBmcmFtZXMgb3Igc2Vjb25kcykuXG4gICAgLy8gIEByZXR1cm46IFRoZSBjb3JyZWN0IHZhbHVlLlxuXG4gICAgLyoqXG4gICAgICogISNlbiBFYXNpbmcgaW4gYWN0aW9uIHdpdGggXCJiYWNrIHVwXCIgYmVoYXZpb3IuXG4gICAgICogISN6aCDlm57pgIDmlYjmnpznmoTnvJPlhaXlh73mlbDjgIJcbiAgICAgKiBAbWV0aG9kIGJhY2tJblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IFRoZSBjdXJyZW50IHRpbWUgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCB0aW1lLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGNvcnJlY3QgdmFsdWUuXG4gICAgICovXG4gICAgYmFja0luOiBmdW5jdGlvbiAoaykge1xuICAgICAgICB2YXIgcyA9IDEuNzAxNTg7XG4gICAgICAgIHJldHVybiBrICogayAqICggKCBzICsgMSApICogayAtIHMgKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqICEjZW4gRWFzaW5nIG91dCBhY3Rpb24gd2l0aCBcImJhY2sgdXBcIiBiZWhhdmlvci5cbiAgICAgKiAhI3poIOWbnumAgOaViOaenOeahOe8k+WHuuWHveaVsOOAglxuICAgICAqIEBtZXRob2QgYmFja091dFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IFRoZSBjdXJyZW50IHRpbWUgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCB0aW1lLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGNvcnJlY3QgdmFsdWUuXG4gICAgICovXG4gICAgYmFja091dDogZnVuY3Rpb24gKGspIHtcbiAgICAgICAgdmFyIHMgPSAxLjcwMTU4O1xuICAgICAgICByZXR1cm4gLS1rICogayAqICggKCBzICsgMSApICogayArIHMgKSArIDE7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiAhI2VuIEVhc2luZyBpbiBhbmQgb3V0IGFjdGlvbiB3aXRoIFwiYmFjayB1cFwiIGJlaGF2aW9yLlxuICAgICAqICEjemgg5Zue6YCA5pWI5p6c55qE57yT5YWl57yT5Ye65Ye95pWw44CCXG4gICAgICogQG1ldGhvZCBiYWNrSW5PdXRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCBUaGUgY3VycmVudCB0aW1lIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgdGltZS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBjb3JyZWN0IHZhbHVlLlxuICAgICAqL1xuICAgIGJhY2tJbk91dDogZnVuY3Rpb24gKGspIHtcbiAgICAgICAgdmFyIHMgPSAxLjcwMTU4ICogMS41MjU7XG4gICAgICAgIGlmICgoIGsgKj0gMiApIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuIDAuNSAqICggayAqIGsgKiAoICggcyArIDEgKSAqIGsgLSBzICkgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMC41ICogKCAoIGsgLT0gMiApICogayAqICggKCBzICsgMSApICogayArIHMgKSArIDIgKTtcbiAgICB9LFxuXG4gICAgLy8gYm91bmNlXG4gICAgLy8gIGVhc2luZyBlcXVhdGlvbiBmdW5jdGlvbiBmb3IgYSBib3VuY2UgKGV4cG9uZW50aWFsbHkgZGVjYXlpbmcgcGFyYWJvbGljIGJvdW5jZSlcbiAgICAvLyAgQHBhcmFtIHQ6IEN1cnJlbnQgdGltZSAoaW4gZnJhbWVzIG9yIHNlY29uZHMpLlxuICAgIC8vICBAcmV0dXJuOiBUaGUgY29ycmVjdCB2YWx1ZS5cblxuICAgIC8qKlxuICAgICAqICEjZW4gRWFzaW5nIGluIGFjdGlvbiB3aXRoIGJvdW5jaW5nIGVmZmVjdC5cbiAgICAgKiAhI3poIOW8uei3s+aViOaenOeahOe8k+WFpeWHveaVsOOAglxuICAgICAqIEBtZXRob2QgYm91bmNlSW5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCBUaGUgY3VycmVudCB0aW1lIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgdGltZS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBjb3JyZWN0IHZhbHVlLlxuICAgICAqL1xuICAgIGJvdW5jZUluOiBmdW5jdGlvbiAoaykge1xuICAgICAgICByZXR1cm4gMSAtIGVhc2luZy5ib3VuY2VPdXQoMSAtIGspO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogISNlbiBFYXNpbmcgb3V0IGFjdGlvbiB3aXRoIGJvdW5jaW5nIGVmZmVjdC5cbiAgICAgKiAhI3poIOW8uei3s+aViOaenOeahOe8k+WHuuWHveaVsOOAglxuICAgICAqIEBtZXRob2QgYm91bmNlT3V0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZS5cbiAgICAgKi9cbiAgICBib3VuY2VPdXQ6IGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIGlmIChrIDwgKCAxIC8gMi43NSApKSB7XG4gICAgICAgICAgICByZXR1cm4gNy41NjI1ICogayAqIGs7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoayA8ICggMiAvIDIuNzUgKSkge1xuICAgICAgICAgICAgcmV0dXJuIDcuNTYyNSAqICggayAtPSAoIDEuNSAvIDIuNzUgKSApICogayArIDAuNzU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoayA8ICggMi41IC8gMi43NSApKSB7XG4gICAgICAgICAgICByZXR1cm4gNy41NjI1ICogKCBrIC09ICggMi4yNSAvIDIuNzUgKSApICogayArIDAuOTM3NTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiA3LjU2MjUgKiAoIGsgLT0gKCAyLjYyNSAvIDIuNzUgKSApICogayArIDAuOTg0Mzc1O1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiAhI2VuIEVhc2luZyBpbiBhbmQgb3V0IGFjdGlvbiB3aXRoIGJvdW5jaW5nIGVmZmVjdC5cbiAgICAgKiAhI3poIOW8uei3s+aViOaenOeahOe8k+WFpee8k+WHuuWHveaVsOOAglxuICAgICAqIEBtZXRob2QgYm91bmNlSW5PdXRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCBUaGUgY3VycmVudCB0aW1lIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgdGltZS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBjb3JyZWN0IHZhbHVlLlxuICAgICAqL1xuICAgIGJvdW5jZUluT3V0OiBmdW5jdGlvbiAoaykge1xuICAgICAgICBpZiAoayA8IDAuNSkge1xuICAgICAgICAgICAgcmV0dXJuIGVhc2luZy5ib3VuY2VJbihrICogMikgKiAwLjU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVhc2luZy5ib3VuY2VPdXQoayAqIDIgLSAxKSAqIDAuNSArIDAuNTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUYXJnZXQgd2lsbCBydW4gYWN0aW9uIHdpdGggc21vb3RoIGVmZmVjdC5cbiAgICAgKiAhI3poIOW5s+a7keaViOaenOWHveaVsOOAglxuICAgICAqIEBtZXRob2Qgc21vb3RoXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZS5cbiAgICAgKi9cbiAgICAvLyB0PD0wOiAwIHwgMDx0PDE6IDMqdF4yIC0gMip0XjMgfCB0Pj0xOiAxXG4gICAgc21vb3RoOiBmdW5jdGlvbiAodCkge1xuICAgICAgICBpZiAodCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodCA+PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdCAqIHQgKiAoMyAtIDIgKiB0KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUYXJnZXQgd2lsbCBydW4gYWN0aW9uIHdpdGggZmFkZSBlZmZlY3QuXG4gICAgICogISN6aCDmuJDopKrmlYjmnpzlh73mlbDjgIJcbiAgICAgKiBAbWV0aG9kIGZhZGVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCBUaGUgY3VycmVudCB0aW1lIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgdGltZS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBjb3JyZWN0IHZhbHVlLlxuICAgICAqL1xuICAgIC8vIHQ8PTA6IDAgfCAwPHQ8MTogNip0XjUgLSAxNSp0XjQgKyAxMCp0XjMgfCB0Pj0xOiAxXG4gICAgZmFkZTogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKHQgPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHQgPj0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQgKiB0ICogdCAqICh0ICogKHQgKiA2IC0gMTUpICsgMTApO1xuICAgIH0sXG59O1xuXG5mdW5jdGlvbiBfbWFrZU91dEluIChmbkluLCBmbk91dCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoaykge1xuICAgICAgICBpZiAoayA8IDAuNSkge1xuICAgICAgICAgICAgcmV0dXJuIGZuT3V0KGsgKiAyKSAvIDI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZuSW4oMiAqIGsgLSAxKSAvIDIgKyAwLjU7XG4gICAgfTtcbn1cbmVhc2luZy5xdWFkT3V0SW4gPSBfbWFrZU91dEluKGVhc2luZy5xdWFkSW4sIGVhc2luZy5xdWFkT3V0KTtcbmVhc2luZy5jdWJpY091dEluID0gX21ha2VPdXRJbihlYXNpbmcuY3ViaWNJbiwgZWFzaW5nLmN1YmljT3V0KTtcbmVhc2luZy5xdWFydE91dEluID0gX21ha2VPdXRJbihlYXNpbmcucXVhcnRJbiwgZWFzaW5nLnF1YXJ0T3V0KTtcbmVhc2luZy5xdWludE91dEluID0gX21ha2VPdXRJbihlYXNpbmcucXVpbnRJbiwgZWFzaW5nLnF1aW50T3V0KTtcbmVhc2luZy5zaW5lT3V0SW4gPSBfbWFrZU91dEluKGVhc2luZy5zaW5lSW4sIGVhc2luZy5zaW5lT3V0KTtcbmVhc2luZy5leHBvT3V0SW4gPSBfbWFrZU91dEluKGVhc2luZy5leHBvSW4sIGVhc2luZy5leHBvT3V0KTtcbmVhc2luZy5jaXJjT3V0SW4gPSBfbWFrZU91dEluKGVhc2luZy5jaXJjSW4sIGVhc2luZy5jaXJjT3V0KTtcbmVhc2luZy5iYWNrT3V0SW4gPSBfbWFrZU91dEluKGVhc2luZy5iYWNrSW4sIGVhc2luZy5iYWNrT3V0KTtcbmVhc2luZy5ib3VuY2VJbiA9IGZ1bmN0aW9uIChrKSB7IHJldHVybiAxIC0gZWFzaW5nLmJvdW5jZU91dCgxIC0gayk7IH07XG5lYXNpbmcuYm91bmNlSW5PdXQgPSBmdW5jdGlvbiAoaykge1xuICAgIGlmIChrIDwgMC41KSB7XG4gICAgICAgIHJldHVybiBlYXNpbmcuYm91bmNlSW4oayAqIDIpICogMC41O1xuICAgIH1cbiAgICByZXR1cm4gZWFzaW5nLmJvdW5jZU91dChrICogMiAtIDEpICogMC41ICsgMC41O1xufTtcbmVhc2luZy5ib3VuY2VPdXRJbiA9IF9tYWtlT3V0SW4oZWFzaW5nLmJvdW5jZUluLCBlYXNpbmcuYm91bmNlT3V0KTtcblxuLyoqXG4gKiBAbW9kdWxlIGNjXG4gKi9cblxuLyoqXG4gKiAhI2VuIFRoaXMgaXMgYSBFYXNpbmcgaW5zdGFuY2UuXG4gKiAhI3poIOi/meaYr+S4gOS4qiBFYXNpbmcg57G75a6e5L6L44CCXG4gKiBAcHJvcGVydHkgZWFzaW5nXG4gKiBAdHlwZSBFYXNpbmdcbiAqL1xuXG5jYy5lYXNpbmcgPSBtb2R1bGUuZXhwb3J0cyA9IGVhc2luZztcbiJdLCJzb3VyY2VSb290IjoiLyJ9