
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/asset-manager/request-item.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
 * @module cc.AssetManager
 */
var MAX_DEAD_NUM = 500;
var _deadPool = [];
/**
 * !#en
 * A collection of information about a request
 * 
 * !#zh
 * 请求的相关信息集合
 * 
 * @class RequestItem
 */

function RequestItem() {
  this._id = '';
  /**
   * !#en 
   * The uuid of request
   * 
   * !#zh 
   * 请求资源的uuid
   * 
   * @property uuid
   * @type {String}
   */

  this.uuid = '';
  /**
   * !#en 
   * The final url of request
   * 
   * !#zh
   * 请求的最终url
   * 
   * @property url
   * @type {String}
   */

  this.url = '';
  /**
   * !#en
   * The extension name of asset
   * 
   * !#zh
   * 资源的扩展名
   * 
   * @property ext
   * @type {String}
   */

  this.ext = '.json';
  /**
   * !#en
   * The content of asset
   * 
   * !#zh
   * 资源的内容
   * 
   * @property content
   * @type {*}
   */

  this.content = null;
  /**
   * !#en
   * The file of asset
   * 
   * !#zh
   * 资源的文件
   * 
   * @property file
   * @type {*}
   */

  this.file = null;
  /**
   * !#en
   * The information of asset
   * 
   * !#zh
   * 资源的相关信息
   * 
   * @property info
   * @type {Object}
   */

  this.info = null;
  this.config = null;
  /**
   * !#en
   * Whether or not it is native asset
   * 
   * !#zh
   * 资源是否是原生资源
   * 
   * @property isNative
   * @type {Boolean}
   */

  this.isNative = false;
  /**
   * !#en
   * Custom options
   * 
   * !#zh
   * 自定义参数
   * 
   * @property options
   * @type {Object}
   */

  this.options = Object.create(null);
}

RequestItem.prototype = {
  /**
   * !#en
   * Create a request item
   * 
   * !#zh
   * 创建一个 request item
   * 
   * @method constructor
   * 
   * @typescript
   * constructor()
   */
  constructor: RequestItem,

  /**
   * !#en
   * The id of request, combined from uuid and isNative
   * 
   * !#zh
   * 请求的 id, 由 uuid 和 isNative 组合而成
   * 
   * @property id
   * @type {String}
   */
  get id() {
    if (!this._id) {
      this._id = this.uuid + '@' + (this.isNative ? 'native' : 'import');
    }

    return this._id;
  },

  /**
   * !#en
   * Recycle this for reuse
   * 
   * !#zh
   * 回收 requestItem 用于复用
   * 
   * @method recycle
   * 
   * @typescript
   * recycle(): void
   */
  recycle: function recycle() {
    if (_deadPool.length === MAX_DEAD_NUM) return;
    this._id = '';
    this.uuid = '';
    this.url = '';
    this.ext = '.json';
    this.content = null;
    this.file = null;
    this.info = null;
    this.config = null;
    this.isNative = false;
    this.options = Object.create(null);

    _deadPool.push(this);
  }
};
/**
 * !#en
 * Create a new request item from pool
 * 
 * !#zh
 * 从对象池中创建 requestItem
 * 
 * @static
 * @method create
 * @returns {RequestItem} requestItem
 * 
 * @typescript 
 * create(): RequestItem
 */

RequestItem.create = function () {
  var out = null;

  if (_deadPool.length !== 0) {
    out = _deadPool.pop();
  } else {
    out = new RequestItem();
  }

  return out;
};

module.exports = RequestItem;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0LW1hbmFnZXIvcmVxdWVzdC1pdGVtLmpzIl0sIm5hbWVzIjpbIk1BWF9ERUFEX05VTSIsIl9kZWFkUG9vbCIsIlJlcXVlc3RJdGVtIiwiX2lkIiwidXVpZCIsInVybCIsImV4dCIsImNvbnRlbnQiLCJmaWxlIiwiaW5mbyIsImNvbmZpZyIsImlzTmF0aXZlIiwib3B0aW9ucyIsIk9iamVjdCIsImNyZWF0ZSIsInByb3RvdHlwZSIsImNvbnN0cnVjdG9yIiwiaWQiLCJyZWN5Y2xlIiwibGVuZ3RoIiwicHVzaCIsIm91dCIsInBvcCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUEsSUFBSUEsWUFBWSxHQUFHLEdBQW5CO0FBQ0EsSUFBSUMsU0FBUyxHQUFHLEVBQWhCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFNBQVNDLFdBQVQsR0FBd0I7QUFFcEIsT0FBS0MsR0FBTCxHQUFXLEVBQVg7QUFFQTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDSSxPQUFLQyxJQUFMLEdBQVksRUFBWjtBQUVBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNJLE9BQUtDLEdBQUwsR0FBVyxFQUFYO0FBRUE7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0ksT0FBS0MsR0FBTCxHQUFXLE9BQVg7QUFFQTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDSSxPQUFLQyxPQUFMLEdBQWUsSUFBZjtBQUVBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNJLE9BQUtDLElBQUwsR0FBWSxJQUFaO0FBRUE7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0ksT0FBS0MsSUFBTCxHQUFZLElBQVo7QUFFQSxPQUFLQyxNQUFMLEdBQWMsSUFBZDtBQUVBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNJLE9BQUtDLFFBQUwsR0FBZ0IsS0FBaEI7QUFFQTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDSSxPQUFLQyxPQUFMLEdBQWVDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLElBQWQsQ0FBZjtBQUNIOztBQUVEWixXQUFXLENBQUNhLFNBQVosR0FBd0I7QUFFcEI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLEVBQUFBLFdBQVcsRUFBRWQsV0FkTzs7QUFnQnBCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0ksTUFBSWUsRUFBSixHQUFVO0FBQ04sUUFBSSxDQUFDLEtBQUtkLEdBQVYsRUFBZTtBQUNYLFdBQUtBLEdBQUwsR0FBVyxLQUFLQyxJQUFMLEdBQVksR0FBWixJQUFtQixLQUFLTyxRQUFMLEdBQWdCLFFBQWhCLEdBQTJCLFFBQTlDLENBQVg7QUFDSDs7QUFDRCxXQUFPLEtBQUtSLEdBQVo7QUFDSCxHQS9CbUI7O0FBaUNwQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSWUsRUFBQUEsT0E3Q29CLHFCQTZDVDtBQUNQLFFBQUlqQixTQUFTLENBQUNrQixNQUFWLEtBQXFCbkIsWUFBekIsRUFBdUM7QUFDdkMsU0FBS0csR0FBTCxHQUFXLEVBQVg7QUFDQSxTQUFLQyxJQUFMLEdBQVksRUFBWjtBQUNBLFNBQUtDLEdBQUwsR0FBVyxFQUFYO0FBQ0EsU0FBS0MsR0FBTCxHQUFXLE9BQVg7QUFDQSxTQUFLQyxPQUFMLEdBQWUsSUFBZjtBQUNBLFNBQUtDLElBQUwsR0FBWSxJQUFaO0FBQ0EsU0FBS0MsSUFBTCxHQUFZLElBQVo7QUFDQSxTQUFLQyxNQUFMLEdBQWMsSUFBZDtBQUNBLFNBQUtDLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQSxTQUFLQyxPQUFMLEdBQWVDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLElBQWQsQ0FBZjs7QUFDQWIsSUFBQUEsU0FBUyxDQUFDbUIsSUFBVixDQUFlLElBQWY7QUFDSDtBQTFEbUIsQ0FBeEI7QUE2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQWxCLFdBQVcsQ0FBQ1ksTUFBWixHQUFxQixZQUFZO0FBQzdCLE1BQUlPLEdBQUcsR0FBRyxJQUFWOztBQUNBLE1BQUlwQixTQUFTLENBQUNrQixNQUFWLEtBQXFCLENBQXpCLEVBQTRCO0FBQ3hCRSxJQUFBQSxHQUFHLEdBQUdwQixTQUFTLENBQUNxQixHQUFWLEVBQU47QUFDSCxHQUZELE1BR0s7QUFDREQsSUFBQUEsR0FBRyxHQUFHLElBQUluQixXQUFKLEVBQU47QUFDSDs7QUFFRCxTQUFPbUIsR0FBUDtBQUNILENBVkQ7O0FBWUFFLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnRCLFdBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKipcbiAqIEBtb2R1bGUgY2MuQXNzZXRNYW5hZ2VyXG4gKi9cblxudmFyIE1BWF9ERUFEX05VTSA9IDUwMDtcbnZhciBfZGVhZFBvb2wgPSBbXTtcblxuLyoqXG4gKiAhI2VuXG4gKiBBIGNvbGxlY3Rpb24gb2YgaW5mb3JtYXRpb24gYWJvdXQgYSByZXF1ZXN0XG4gKiBcbiAqICEjemhcbiAqIOivt+axgueahOebuOWFs+S/oeaBr+mbhuWQiFxuICogXG4gKiBAY2xhc3MgUmVxdWVzdEl0ZW1cbiAqL1xuZnVuY3Rpb24gUmVxdWVzdEl0ZW0gKCkge1xuXG4gICAgdGhpcy5faWQgPSAnJztcblxuICAgIC8qKlxuICAgICAqICEjZW4gXG4gICAgICogVGhlIHV1aWQgb2YgcmVxdWVzdFxuICAgICAqIFxuICAgICAqICEjemggXG4gICAgICog6K+35rGC6LWE5rqQ55qEdXVpZFxuICAgICAqIFxuICAgICAqIEBwcm9wZXJ0eSB1dWlkXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLnV1aWQgPSAnJztcblxuICAgIC8qKlxuICAgICAqICEjZW4gXG4gICAgICogVGhlIGZpbmFsIHVybCBvZiByZXF1ZXN0XG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOivt+axgueahOacgOe7iHVybFxuICAgICAqIFxuICAgICAqIEBwcm9wZXJ0eSB1cmxcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMudXJsID0gJyc7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVGhlIGV4dGVuc2lvbiBuYW1lIG9mIGFzc2V0XG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOi1hOa6kOeahOaJqeWxleWQjVxuICAgICAqIFxuICAgICAqIEBwcm9wZXJ0eSBleHRcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuZXh0ID0gJy5qc29uJztcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBUaGUgY29udGVudCBvZiBhc3NldFxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDotYTmupDnmoTlhoXlrrlcbiAgICAgKiBcbiAgICAgKiBAcHJvcGVydHkgY29udGVudFxuICAgICAqIEB0eXBlIHsqfVxuICAgICAqL1xuICAgIHRoaXMuY29udGVudCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVGhlIGZpbGUgb2YgYXNzZXRcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog6LWE5rqQ55qE5paH5Lu2XG4gICAgICogXG4gICAgICogQHByb3BlcnR5IGZpbGVcbiAgICAgKiBAdHlwZSB7Kn1cbiAgICAgKi9cbiAgICB0aGlzLmZpbGUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFRoZSBpbmZvcm1hdGlvbiBvZiBhc3NldFxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDotYTmupDnmoTnm7jlhbPkv6Hmga9cbiAgICAgKiBcbiAgICAgKiBAcHJvcGVydHkgaW5mb1xuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5pbmZvID0gbnVsbDtcblxuICAgIHRoaXMuY29uZmlnID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBXaGV0aGVyIG9yIG5vdCBpdCBpcyBuYXRpdmUgYXNzZXRcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog6LWE5rqQ5piv5ZCm5piv5Y6f55Sf6LWE5rqQXG4gICAgICogXG4gICAgICogQHByb3BlcnR5IGlzTmF0aXZlXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5pc05hdGl2ZSA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEN1c3RvbSBvcHRpb25zXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOiHquWumuS5ieWPguaVsFxuICAgICAqIFxuICAgICAqIEBwcm9wZXJ0eSBvcHRpb25zXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xufVxuXG5SZXF1ZXN0SXRlbS5wcm90b3R5cGUgPSB7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ3JlYXRlIGEgcmVxdWVzdCBpdGVtXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOWIm+W7uuS4gOS4qiByZXF1ZXN0IGl0ZW1cbiAgICAgKiBcbiAgICAgKiBAbWV0aG9kIGNvbnN0cnVjdG9yXG4gICAgICogXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdHJ1Y3RvcigpXG4gICAgICovXG4gICAgY29uc3RydWN0b3I6IFJlcXVlc3RJdGVtLFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFRoZSBpZCBvZiByZXF1ZXN0LCBjb21iaW5lZCBmcm9tIHV1aWQgYW5kIGlzTmF0aXZlXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOivt+axgueahCBpZCwg55SxIHV1aWQg5ZKMIGlzTmF0aXZlIOe7hOWQiOiAjOaIkFxuICAgICAqIFxuICAgICAqIEBwcm9wZXJ0eSBpZFxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgZ2V0IGlkICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pZCkge1xuICAgICAgICAgICAgdGhpcy5faWQgPSB0aGlzLnV1aWQgKyAnQCcgKyAodGhpcy5pc05hdGl2ZSA/ICduYXRpdmUnIDogJ2ltcG9ydCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9pZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJlY3ljbGUgdGhpcyBmb3IgcmV1c2VcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog5Zue5pS2IHJlcXVlc3RJdGVtIOeUqOS6juWkjeeUqFxuICAgICAqIFxuICAgICAqIEBtZXRob2QgcmVjeWNsZVxuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcmVjeWNsZSgpOiB2b2lkXG4gICAgICovXG4gICAgcmVjeWNsZSAoKSB7XG4gICAgICAgIGlmIChfZGVhZFBvb2wubGVuZ3RoID09PSBNQVhfREVBRF9OVU0pIHJldHVybjtcbiAgICAgICAgdGhpcy5faWQgPSAnJztcbiAgICAgICAgdGhpcy51dWlkID0gJyc7XG4gICAgICAgIHRoaXMudXJsID0gJyc7XG4gICAgICAgIHRoaXMuZXh0ID0gJy5qc29uJztcbiAgICAgICAgdGhpcy5jb250ZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5maWxlID0gbnVsbDtcbiAgICAgICAgdGhpcy5pbmZvID0gbnVsbDtcbiAgICAgICAgdGhpcy5jb25maWcgPSBudWxsO1xuICAgICAgICB0aGlzLmlzTmF0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIF9kZWFkUG9vbC5wdXNoKHRoaXMpO1xuICAgIH1cbn07XG5cbi8qKlxuICogISNlblxuICogQ3JlYXRlIGEgbmV3IHJlcXVlc3QgaXRlbSBmcm9tIHBvb2xcbiAqIFxuICogISN6aFxuICog5LuO5a+56LGh5rGg5Lit5Yib5bu6IHJlcXVlc3RJdGVtXG4gKiBcbiAqIEBzdGF0aWNcbiAqIEBtZXRob2QgY3JlYXRlXG4gKiBAcmV0dXJucyB7UmVxdWVzdEl0ZW19IHJlcXVlc3RJdGVtXG4gKiBcbiAqIEB0eXBlc2NyaXB0IFxuICogY3JlYXRlKCk6IFJlcXVlc3RJdGVtXG4gKi9cblJlcXVlc3RJdGVtLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3V0ID0gbnVsbDtcbiAgICBpZiAoX2RlYWRQb29sLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICBvdXQgPSBfZGVhZFBvb2wucG9wKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBvdXQgPSBuZXcgUmVxdWVzdEl0ZW0oKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZXF1ZXN0SXRlbTsiXSwic291cmNlUm9vdCI6Ii8ifQ==