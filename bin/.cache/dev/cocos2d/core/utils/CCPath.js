
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/utils/CCPath.js';
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
require('../platform/CCSys');

var EXTNAME_RE = /(\.[^\.\/\?\\]*)(\?.*)?$/;
var DIRNAME_RE = /((.*)(\/|\\|\\\\))?(.*?\..*$)?/;
var NORMALIZE_RE = /[^\.\/]+\/\.\.\//;
/**
 * !#en The module provides utilities for working with file and directory paths
 * !#zh 用于处理文件与目录的路径的模块
 * @class path
 * @static
 */

cc.path =
/** @lends cc.path# */
{
  /**
   * !#en Join strings to be a path.
   * !#zh 拼接字符串为 Path
   * @method join
   * @example {@link cocos2d/core/utils/CCPath/join.js}
   * @returns {String}
   */
  join: function join() {
    var l = arguments.length;
    var result = "";

    for (var i = 0; i < l; i++) {
      result = (result + (result === "" ? "" : "/") + arguments[i]).replace(/(\/|\\\\)$/, "");
    }

    return result;
  },

  /**
   * !#en Get the ext name of a path including '.', like '.png'.
   * !#zh 返回 Path 的扩展名，包括 '.'，例如 '.png'。
   * @method extname
   * @example {@link cocos2d/core/utils/CCPath/extname.js}
   * @param {String} pathStr
   * @returns {*}
   */
  extname: function extname(pathStr) {
    var temp = EXTNAME_RE.exec(pathStr);
    return temp ? temp[1] : '';
  },

  /**
   * !#en Get the main name of a file name
   * !#zh 获取文件名的主名称
   * @method mainFileName
   * @param {String} fileName
   * @returns {String}
   * @deprecated
   */
  mainFileName: function mainFileName(fileName) {
    if (fileName) {
      var idx = fileName.lastIndexOf(".");
      if (idx !== -1) return fileName.substring(0, idx);
    }

    return fileName;
  },

  /**
   * !#en Get the file name of a file path.
   * !#zh 获取文件路径的文件名。
   * @method basename
   * @example {@link cocos2d/core/utils/CCPath/basename.js}
   * @param {String} pathStr
   * @param {String} [extname]
   * @returns {*}
   */
  basename: function basename(pathStr, extname) {
    var index = pathStr.indexOf("?");
    if (index > 0) pathStr = pathStr.substring(0, index);
    var reg = /(\/|\\)([^\/\\]+)$/g;
    var result = reg.exec(pathStr.replace(/(\/|\\)$/, ""));
    if (!result) return pathStr;
    var baseName = result[2];
    if (extname && pathStr.substring(pathStr.length - extname.length).toLowerCase() === extname.toLowerCase()) return baseName.substring(0, baseName.length - extname.length);
    return baseName;
  },

  /**
   * !#en Get dirname of a file path.
   * !#zh 获取文件路径的目录名。
   * @method dirname
   * @example {@link cocos2d/core/utils/CCPath/dirname.js}
   * @param {String} pathStr
   * @returns {*}
   */
  dirname: function dirname(pathStr) {
    var temp = DIRNAME_RE.exec(pathStr);
    return temp ? temp[2] : '';
  },

  /**
   * !#en Change extname of a file path.
   * !#zh 更改文件路径的扩展名。
   * @method changeExtname
   * @example {@link cocos2d/core/utils/CCPath/changeExtname.js}
   * @param {String} pathStr
   * @param {String} [extname]
   * @returns {String}
   */
  changeExtname: function changeExtname(pathStr, extname) {
    extname = extname || "";
    var index = pathStr.indexOf("?");
    var tempStr = "";

    if (index > 0) {
      tempStr = pathStr.substring(index);
      pathStr = pathStr.substring(0, index);
    }

    index = pathStr.lastIndexOf(".");
    if (index < 0) return pathStr + extname + tempStr;
    return pathStr.substring(0, index) + extname + tempStr;
  },

  /**
   * !#en Change file name of a file path.
   * !#zh 更改文件路径的文件名。
   * @example {@link cocos2d/core/utils/CCPath/changeBasename.js}
   * @param {String} pathStr
   * @param {String} basename
   * @param {Boolean} [isSameExt]
   * @returns {String}
   */
  changeBasename: function changeBasename(pathStr, basename, isSameExt) {
    if (basename.indexOf(".") === 0) return this.changeExtname(pathStr, basename);
    var index = pathStr.indexOf("?");
    var tempStr = "";
    var ext = isSameExt ? this.extname(pathStr) : "";

    if (index > 0) {
      tempStr = pathStr.substring(index);
      pathStr = pathStr.substring(0, index);
    }

    index = pathStr.lastIndexOf("/");
    index = index <= 0 ? 0 : index + 1;
    return pathStr.substring(0, index) + basename + ext + tempStr;
  },
  //todo make public after verification
  _normalize: function _normalize(url) {
    var oldUrl = url = String(url); //removing all ../

    do {
      oldUrl = url;
      url = url.replace(NORMALIZE_RE, "");
    } while (oldUrl.length !== url.length);

    return url;
  },
  // The platform-specific file separator. '\\' or '/'.
  sep: cc.sys.os === cc.sys.OS_WINDOWS ? '\\' : '/',
  // @param {string} path
  stripSep: function stripSep(path) {
    return path.replace(/[\/\\]$/, '');
  }
};
module.exports = cc.path;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3V0aWxzL0NDUGF0aC5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiRVhUTkFNRV9SRSIsIkRJUk5BTUVfUkUiLCJOT1JNQUxJWkVfUkUiLCJjYyIsInBhdGgiLCJqb2luIiwibCIsImFyZ3VtZW50cyIsImxlbmd0aCIsInJlc3VsdCIsImkiLCJyZXBsYWNlIiwiZXh0bmFtZSIsInBhdGhTdHIiLCJ0ZW1wIiwiZXhlYyIsIm1haW5GaWxlTmFtZSIsImZpbGVOYW1lIiwiaWR4IiwibGFzdEluZGV4T2YiLCJzdWJzdHJpbmciLCJiYXNlbmFtZSIsImluZGV4IiwiaW5kZXhPZiIsInJlZyIsImJhc2VOYW1lIiwidG9Mb3dlckNhc2UiLCJkaXJuYW1lIiwiY2hhbmdlRXh0bmFtZSIsInRlbXBTdHIiLCJjaGFuZ2VCYXNlbmFtZSIsImlzU2FtZUV4dCIsImV4dCIsIl9ub3JtYWxpemUiLCJ1cmwiLCJvbGRVcmwiLCJTdHJpbmciLCJzZXAiLCJzeXMiLCJvcyIsIk9TX1dJTkRPV1MiLCJzdHJpcFNlcCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQSxPQUFPLENBQUMsbUJBQUQsQ0FBUDs7QUFFQSxJQUFJQyxVQUFVLEdBQUcsMEJBQWpCO0FBQ0EsSUFBSUMsVUFBVSxHQUFHLGdDQUFqQjtBQUNBLElBQUlDLFlBQVksR0FBRyxrQkFBbkI7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0FDLEVBQUUsQ0FBQ0MsSUFBSDtBQUFVO0FBQXNCO0FBQzVCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLEVBQUFBLElBQUksRUFBRSxnQkFBWTtBQUNkLFFBQUlDLENBQUMsR0FBR0MsU0FBUyxDQUFDQyxNQUFsQjtBQUNBLFFBQUlDLE1BQU0sR0FBRyxFQUFiOztBQUNBLFNBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0osQ0FBcEIsRUFBdUJJLENBQUMsRUFBeEIsRUFBNEI7QUFDeEJELE1BQUFBLE1BQU0sR0FBRyxDQUFDQSxNQUFNLElBQUlBLE1BQU0sS0FBSyxFQUFYLEdBQWdCLEVBQWhCLEdBQXFCLEdBQXpCLENBQU4sR0FBc0NGLFNBQVMsQ0FBQ0csQ0FBRCxDQUFoRCxFQUFxREMsT0FBckQsQ0FBNkQsWUFBN0QsRUFBMkUsRUFBM0UsQ0FBVDtBQUNIOztBQUNELFdBQU9GLE1BQVA7QUFDSCxHQWYyQjs7QUFpQjVCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSUcsRUFBQUEsT0FBTyxFQUFFLGlCQUFVQyxPQUFWLEVBQW1CO0FBQ3hCLFFBQUlDLElBQUksR0FBR2QsVUFBVSxDQUFDZSxJQUFYLENBQWdCRixPQUFoQixDQUFYO0FBQ0EsV0FBT0MsSUFBSSxHQUFHQSxJQUFJLENBQUMsQ0FBRCxDQUFQLEdBQWEsRUFBeEI7QUFDSCxHQTVCMkI7O0FBOEI1QjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0lFLEVBQUFBLFlBQVksRUFBRSxzQkFBVUMsUUFBVixFQUFvQjtBQUM5QixRQUFJQSxRQUFKLEVBQWM7QUFDVixVQUFJQyxHQUFHLEdBQUdELFFBQVEsQ0FBQ0UsV0FBVCxDQUFxQixHQUFyQixDQUFWO0FBQ0EsVUFBSUQsR0FBRyxLQUFLLENBQUMsQ0FBYixFQUNJLE9BQU9ELFFBQVEsQ0FBQ0csU0FBVCxDQUFtQixDQUFuQixFQUFzQkYsR0FBdEIsQ0FBUDtBQUNQOztBQUNELFdBQU9ELFFBQVA7QUFDSCxHQTdDMkI7O0FBK0M1QjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSUksRUFBQUEsUUFBUSxFQUFFLGtCQUFVUixPQUFWLEVBQW1CRCxPQUFuQixFQUE0QjtBQUNsQyxRQUFJVSxLQUFLLEdBQUdULE9BQU8sQ0FBQ1UsT0FBUixDQUFnQixHQUFoQixDQUFaO0FBQ0EsUUFBSUQsS0FBSyxHQUFHLENBQVosRUFBZVQsT0FBTyxHQUFHQSxPQUFPLENBQUNPLFNBQVIsQ0FBa0IsQ0FBbEIsRUFBcUJFLEtBQXJCLENBQVY7QUFDZixRQUFJRSxHQUFHLEdBQUcscUJBQVY7QUFDQSxRQUFJZixNQUFNLEdBQUdlLEdBQUcsQ0FBQ1QsSUFBSixDQUFTRixPQUFPLENBQUNGLE9BQVIsQ0FBZ0IsVUFBaEIsRUFBNEIsRUFBNUIsQ0FBVCxDQUFiO0FBQ0EsUUFBSSxDQUFDRixNQUFMLEVBQWEsT0FBT0ksT0FBUDtBQUNiLFFBQUlZLFFBQVEsR0FBR2hCLE1BQU0sQ0FBQyxDQUFELENBQXJCO0FBQ0EsUUFBSUcsT0FBTyxJQUFJQyxPQUFPLENBQUNPLFNBQVIsQ0FBa0JQLE9BQU8sQ0FBQ0wsTUFBUixHQUFpQkksT0FBTyxDQUFDSixNQUEzQyxFQUFtRGtCLFdBQW5ELE9BQXFFZCxPQUFPLENBQUNjLFdBQVIsRUFBcEYsRUFDSSxPQUFPRCxRQUFRLENBQUNMLFNBQVQsQ0FBbUIsQ0FBbkIsRUFBc0JLLFFBQVEsQ0FBQ2pCLE1BQVQsR0FBa0JJLE9BQU8sQ0FBQ0osTUFBaEQsQ0FBUDtBQUNKLFdBQU9pQixRQUFQO0FBQ0gsR0FsRTJCOztBQW9FNUI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJRSxFQUFBQSxPQUFPLEVBQUUsaUJBQVVkLE9BQVYsRUFBbUI7QUFDeEIsUUFBSUMsSUFBSSxHQUFHYixVQUFVLENBQUNjLElBQVgsQ0FBZ0JGLE9BQWhCLENBQVg7QUFDQSxXQUFPQyxJQUFJLEdBQUdBLElBQUksQ0FBQyxDQUFELENBQVAsR0FBYSxFQUF4QjtBQUNILEdBL0UyQjs7QUFpRjVCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJYyxFQUFBQSxhQUFhLEVBQUUsdUJBQVVmLE9BQVYsRUFBbUJELE9BQW5CLEVBQTRCO0FBQ3ZDQSxJQUFBQSxPQUFPLEdBQUdBLE9BQU8sSUFBSSxFQUFyQjtBQUNBLFFBQUlVLEtBQUssR0FBR1QsT0FBTyxDQUFDVSxPQUFSLENBQWdCLEdBQWhCLENBQVo7QUFDQSxRQUFJTSxPQUFPLEdBQUcsRUFBZDs7QUFDQSxRQUFJUCxLQUFLLEdBQUcsQ0FBWixFQUFlO0FBQ1hPLE1BQUFBLE9BQU8sR0FBR2hCLE9BQU8sQ0FBQ08sU0FBUixDQUFrQkUsS0FBbEIsQ0FBVjtBQUNBVCxNQUFBQSxPQUFPLEdBQUdBLE9BQU8sQ0FBQ08sU0FBUixDQUFrQixDQUFsQixFQUFxQkUsS0FBckIsQ0FBVjtBQUNIOztBQUNEQSxJQUFBQSxLQUFLLEdBQUdULE9BQU8sQ0FBQ00sV0FBUixDQUFvQixHQUFwQixDQUFSO0FBQ0EsUUFBSUcsS0FBSyxHQUFHLENBQVosRUFBZSxPQUFPVCxPQUFPLEdBQUdELE9BQVYsR0FBb0JpQixPQUEzQjtBQUNmLFdBQU9oQixPQUFPLENBQUNPLFNBQVIsQ0FBa0IsQ0FBbEIsRUFBcUJFLEtBQXJCLElBQThCVixPQUE5QixHQUF3Q2lCLE9BQS9DO0FBQ0gsR0FyRzJCOztBQXNHNUI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLEVBQUFBLGNBQWMsRUFBRSx3QkFBVWpCLE9BQVYsRUFBbUJRLFFBQW5CLEVBQTZCVSxTQUE3QixFQUF3QztBQUNwRCxRQUFJVixRQUFRLENBQUNFLE9BQVQsQ0FBaUIsR0FBakIsTUFBMEIsQ0FBOUIsRUFBaUMsT0FBTyxLQUFLSyxhQUFMLENBQW1CZixPQUFuQixFQUE0QlEsUUFBNUIsQ0FBUDtBQUNqQyxRQUFJQyxLQUFLLEdBQUdULE9BQU8sQ0FBQ1UsT0FBUixDQUFnQixHQUFoQixDQUFaO0FBQ0EsUUFBSU0sT0FBTyxHQUFHLEVBQWQ7QUFDQSxRQUFJRyxHQUFHLEdBQUdELFNBQVMsR0FBRyxLQUFLbkIsT0FBTCxDQUFhQyxPQUFiLENBQUgsR0FBMkIsRUFBOUM7O0FBQ0EsUUFBSVMsS0FBSyxHQUFHLENBQVosRUFBZTtBQUNYTyxNQUFBQSxPQUFPLEdBQUdoQixPQUFPLENBQUNPLFNBQVIsQ0FBa0JFLEtBQWxCLENBQVY7QUFDQVQsTUFBQUEsT0FBTyxHQUFHQSxPQUFPLENBQUNPLFNBQVIsQ0FBa0IsQ0FBbEIsRUFBcUJFLEtBQXJCLENBQVY7QUFDSDs7QUFDREEsSUFBQUEsS0FBSyxHQUFHVCxPQUFPLENBQUNNLFdBQVIsQ0FBb0IsR0FBcEIsQ0FBUjtBQUNBRyxJQUFBQSxLQUFLLEdBQUdBLEtBQUssSUFBSSxDQUFULEdBQWEsQ0FBYixHQUFpQkEsS0FBSyxHQUFHLENBQWpDO0FBQ0EsV0FBT1QsT0FBTyxDQUFDTyxTQUFSLENBQWtCLENBQWxCLEVBQXFCRSxLQUFyQixJQUE4QkQsUUFBOUIsR0FBeUNXLEdBQXpDLEdBQStDSCxPQUF0RDtBQUNILEdBM0gyQjtBQTRINUI7QUFDQUksRUFBQUEsVUFBVSxFQUFFLG9CQUFVQyxHQUFWLEVBQWU7QUFDdkIsUUFBSUMsTUFBTSxHQUFHRCxHQUFHLEdBQUdFLE1BQU0sQ0FBQ0YsR0FBRCxDQUF6QixDQUR1QixDQUd2Qjs7QUFDQSxPQUFHO0FBQ0NDLE1BQUFBLE1BQU0sR0FBR0QsR0FBVDtBQUNBQSxNQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ3ZCLE9BQUosQ0FBWVQsWUFBWixFQUEwQixFQUExQixDQUFOO0FBQ0gsS0FIRCxRQUdTaUMsTUFBTSxDQUFDM0IsTUFBUCxLQUFrQjBCLEdBQUcsQ0FBQzFCLE1BSC9COztBQUlBLFdBQU8wQixHQUFQO0FBQ0gsR0F0STJCO0FBd0k1QjtBQUNBRyxFQUFBQSxHQUFHLEVBQUdsQyxFQUFFLENBQUNtQyxHQUFILENBQU9DLEVBQVAsS0FBY3BDLEVBQUUsQ0FBQ21DLEdBQUgsQ0FBT0UsVUFBckIsR0FBa0MsSUFBbEMsR0FBeUMsR0F6SW5CO0FBMkk1QjtBQUNBQyxFQUFBQSxRQTVJNEIsb0JBNElsQnJDLElBNUlrQixFQTRJWjtBQUNaLFdBQU9BLElBQUksQ0FBQ08sT0FBTCxDQUFhLFNBQWIsRUFBd0IsRUFBeEIsQ0FBUDtBQUNIO0FBOUkyQixDQUFoQztBQWlKQStCLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnhDLEVBQUUsQ0FBQ0MsSUFBcEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnJlcXVpcmUoJy4uL3BsYXRmb3JtL0NDU3lzJyk7XG5cbnZhciBFWFROQU1FX1JFID0gLyhcXC5bXlxcLlxcL1xcP1xcXFxdKikoXFw/LiopPyQvO1xudmFyIERJUk5BTUVfUkUgPSAvKCguKikoXFwvfFxcXFx8XFxcXFxcXFwpKT8oLio/XFwuLiokKT8vO1xudmFyIE5PUk1BTElaRV9SRSA9IC9bXlxcLlxcL10rXFwvXFwuXFwuXFwvLztcblxuLyoqXG4gKiAhI2VuIFRoZSBtb2R1bGUgcHJvdmlkZXMgdXRpbGl0aWVzIGZvciB3b3JraW5nIHdpdGggZmlsZSBhbmQgZGlyZWN0b3J5IHBhdGhzXG4gKiAhI3poIOeUqOS6juWkhOeQhuaWh+S7tuS4juebruW9leeahOi3r+W+hOeahOaooeWdl1xuICogQGNsYXNzIHBhdGhcbiAqIEBzdGF0aWNcbiAqL1xuY2MucGF0aCA9IC8qKiBAbGVuZHMgY2MucGF0aCMgKi97XG4gICAgLyoqXG4gICAgICogISNlbiBKb2luIHN0cmluZ3MgdG8gYmUgYSBwYXRoLlxuICAgICAqICEjemgg5ou85o6l5a2X56ym5Liy5Li6IFBhdGhcbiAgICAgKiBAbWV0aG9kIGpvaW5cbiAgICAgKiBAZXhhbXBsZSB7QGxpbmsgY29jb3MyZC9jb3JlL3V0aWxzL0NDUGF0aC9qb2luLmpzfVxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAgICovXG4gICAgam9pbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIHZhciByZXN1bHQgPSBcIlwiO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgcmVzdWx0ID0gKHJlc3VsdCArIChyZXN1bHQgPT09IFwiXCIgPyBcIlwiIDogXCIvXCIpICsgYXJndW1lbnRzW2ldKS5yZXBsYWNlKC8oXFwvfFxcXFxcXFxcKSQvLCBcIlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldCB0aGUgZXh0IG5hbWUgb2YgYSBwYXRoIGluY2x1ZGluZyAnLicsIGxpa2UgJy5wbmcnLlxuICAgICAqICEjemgg6L+U5ZueIFBhdGgg55qE5omp5bGV5ZCN77yM5YyF5ousICcuJ++8jOS+i+WmgiAnLnBuZyfjgIJcbiAgICAgKiBAbWV0aG9kIGV4dG5hbWVcbiAgICAgKiBAZXhhbXBsZSB7QGxpbmsgY29jb3MyZC9jb3JlL3V0aWxzL0NDUGF0aC9leHRuYW1lLmpzfVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoU3RyXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgZXh0bmFtZTogZnVuY3Rpb24gKHBhdGhTdHIpIHtcbiAgICAgICAgdmFyIHRlbXAgPSBFWFROQU1FX1JFLmV4ZWMocGF0aFN0cik7XG4gICAgICAgIHJldHVybiB0ZW1wID8gdGVtcFsxXSA6ICcnO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldCB0aGUgbWFpbiBuYW1lIG9mIGEgZmlsZSBuYW1lXG4gICAgICogISN6aCDojrflj5bmlofku7blkI3nmoTkuLvlkI3np7BcbiAgICAgKiBAbWV0aG9kIG1haW5GaWxlTmFtZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlTmFtZVxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAgICogQGRlcHJlY2F0ZWRcbiAgICAgKi9cbiAgICBtYWluRmlsZU5hbWU6IGZ1bmN0aW9uIChmaWxlTmFtZSkge1xuICAgICAgICBpZiAoZmlsZU5hbWUpIHtcbiAgICAgICAgICAgIHZhciBpZHggPSBmaWxlTmFtZS5sYXN0SW5kZXhPZihcIi5cIik7XG4gICAgICAgICAgICBpZiAoaWR4ICE9PSAtMSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsZU5hbWUuc3Vic3RyaW5nKDAsIGlkeCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbGVOYW1lO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldCB0aGUgZmlsZSBuYW1lIG9mIGEgZmlsZSBwYXRoLlxuICAgICAqICEjemgg6I635Y+W5paH5Lu26Lev5b6E55qE5paH5Lu25ZCN44CCXG4gICAgICogQG1ldGhvZCBiYXNlbmFtZVxuICAgICAqIEBleGFtcGxlIHtAbGluayBjb2NvczJkL2NvcmUvdXRpbHMvQ0NQYXRoL2Jhc2VuYW1lLmpzfVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoU3RyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtleHRuYW1lXVxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGJhc2VuYW1lOiBmdW5jdGlvbiAocGF0aFN0ciwgZXh0bmFtZSkge1xuICAgICAgICB2YXIgaW5kZXggPSBwYXRoU3RyLmluZGV4T2YoXCI/XCIpO1xuICAgICAgICBpZiAoaW5kZXggPiAwKSBwYXRoU3RyID0gcGF0aFN0ci5zdWJzdHJpbmcoMCwgaW5kZXgpO1xuICAgICAgICB2YXIgcmVnID0gLyhcXC98XFxcXCkoW15cXC9cXFxcXSspJC9nO1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVnLmV4ZWMocGF0aFN0ci5yZXBsYWNlKC8oXFwvfFxcXFwpJC8sIFwiXCIpKTtcbiAgICAgICAgaWYgKCFyZXN1bHQpIHJldHVybiBwYXRoU3RyO1xuICAgICAgICB2YXIgYmFzZU5hbWUgPSByZXN1bHRbMl07XG4gICAgICAgIGlmIChleHRuYW1lICYmIHBhdGhTdHIuc3Vic3RyaW5nKHBhdGhTdHIubGVuZ3RoIC0gZXh0bmFtZS5sZW5ndGgpLnRvTG93ZXJDYXNlKCkgPT09IGV4dG5hbWUudG9Mb3dlckNhc2UoKSlcbiAgICAgICAgICAgIHJldHVybiBiYXNlTmFtZS5zdWJzdHJpbmcoMCwgYmFzZU5hbWUubGVuZ3RoIC0gZXh0bmFtZS5sZW5ndGgpO1xuICAgICAgICByZXR1cm4gYmFzZU5hbWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0IGRpcm5hbWUgb2YgYSBmaWxlIHBhdGguXG4gICAgICogISN6aCDojrflj5bmlofku7bot6/lvoTnmoTnm67lvZXlkI3jgIJcbiAgICAgKiBAbWV0aG9kIGRpcm5hbWVcbiAgICAgKiBAZXhhbXBsZSB7QGxpbmsgY29jb3MyZC9jb3JlL3V0aWxzL0NDUGF0aC9kaXJuYW1lLmpzfVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoU3RyXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgZGlybmFtZTogZnVuY3Rpb24gKHBhdGhTdHIpIHtcbiAgICAgICAgdmFyIHRlbXAgPSBESVJOQU1FX1JFLmV4ZWMocGF0aFN0cik7XG4gICAgICAgIHJldHVybiB0ZW1wID8gdGVtcFsyXSA6ICcnO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENoYW5nZSBleHRuYW1lIG9mIGEgZmlsZSBwYXRoLlxuICAgICAqICEjemgg5pu05pS55paH5Lu26Lev5b6E55qE5omp5bGV5ZCN44CCXG4gICAgICogQG1ldGhvZCBjaGFuZ2VFeHRuYW1lXG4gICAgICogQGV4YW1wbGUge0BsaW5rIGNvY29zMmQvY29yZS91dGlscy9DQ1BhdGgvY2hhbmdlRXh0bmFtZS5qc31cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFN0clxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbZXh0bmFtZV1cbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgICAqL1xuICAgIGNoYW5nZUV4dG5hbWU6IGZ1bmN0aW9uIChwYXRoU3RyLCBleHRuYW1lKSB7XG4gICAgICAgIGV4dG5hbWUgPSBleHRuYW1lIHx8IFwiXCI7XG4gICAgICAgIHZhciBpbmRleCA9IHBhdGhTdHIuaW5kZXhPZihcIj9cIik7XG4gICAgICAgIHZhciB0ZW1wU3RyID0gXCJcIjtcbiAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgdGVtcFN0ciA9IHBhdGhTdHIuc3Vic3RyaW5nKGluZGV4KTtcbiAgICAgICAgICAgIHBhdGhTdHIgPSBwYXRoU3RyLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgaW5kZXggPSBwYXRoU3RyLmxhc3RJbmRleE9mKFwiLlwiKTtcbiAgICAgICAgaWYgKGluZGV4IDwgMCkgcmV0dXJuIHBhdGhTdHIgKyBleHRuYW1lICsgdGVtcFN0cjtcbiAgICAgICAgcmV0dXJuIHBhdGhTdHIuc3Vic3RyaW5nKDAsIGluZGV4KSArIGV4dG5hbWUgKyB0ZW1wU3RyO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogISNlbiBDaGFuZ2UgZmlsZSBuYW1lIG9mIGEgZmlsZSBwYXRoLlxuICAgICAqICEjemgg5pu05pS55paH5Lu26Lev5b6E55qE5paH5Lu25ZCN44CCXG4gICAgICogQGV4YW1wbGUge0BsaW5rIGNvY29zMmQvY29yZS91dGlscy9DQ1BhdGgvY2hhbmdlQmFzZW5hbWUuanN9XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhTdHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYmFzZW5hbWVcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtpc1NhbWVFeHRdXG4gICAgICogQHJldHVybnMge1N0cmluZ31cbiAgICAgKi9cbiAgICBjaGFuZ2VCYXNlbmFtZTogZnVuY3Rpb24gKHBhdGhTdHIsIGJhc2VuYW1lLCBpc1NhbWVFeHQpIHtcbiAgICAgICAgaWYgKGJhc2VuYW1lLmluZGV4T2YoXCIuXCIpID09PSAwKSByZXR1cm4gdGhpcy5jaGFuZ2VFeHRuYW1lKHBhdGhTdHIsIGJhc2VuYW1lKTtcbiAgICAgICAgdmFyIGluZGV4ID0gcGF0aFN0ci5pbmRleE9mKFwiP1wiKTtcbiAgICAgICAgdmFyIHRlbXBTdHIgPSBcIlwiO1xuICAgICAgICB2YXIgZXh0ID0gaXNTYW1lRXh0ID8gdGhpcy5leHRuYW1lKHBhdGhTdHIpIDogXCJcIjtcbiAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgdGVtcFN0ciA9IHBhdGhTdHIuc3Vic3RyaW5nKGluZGV4KTtcbiAgICAgICAgICAgIHBhdGhTdHIgPSBwYXRoU3RyLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgaW5kZXggPSBwYXRoU3RyLmxhc3RJbmRleE9mKFwiL1wiKTtcbiAgICAgICAgaW5kZXggPSBpbmRleCA8PSAwID8gMCA6IGluZGV4ICsgMTtcbiAgICAgICAgcmV0dXJuIHBhdGhTdHIuc3Vic3RyaW5nKDAsIGluZGV4KSArIGJhc2VuYW1lICsgZXh0ICsgdGVtcFN0cjtcbiAgICB9LFxuICAgIC8vdG9kbyBtYWtlIHB1YmxpYyBhZnRlciB2ZXJpZmljYXRpb25cbiAgICBfbm9ybWFsaXplOiBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgIHZhciBvbGRVcmwgPSB1cmwgPSBTdHJpbmcodXJsKTtcblxuICAgICAgICAvL3JlbW92aW5nIGFsbCAuLi9cbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgb2xkVXJsID0gdXJsO1xuICAgICAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoTk9STUFMSVpFX1JFLCBcIlwiKTtcbiAgICAgICAgfSB3aGlsZSAob2xkVXJsLmxlbmd0aCAhPT0gdXJsLmxlbmd0aCk7XG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfSxcblxuICAgIC8vIFRoZSBwbGF0Zm9ybS1zcGVjaWZpYyBmaWxlIHNlcGFyYXRvci4gJ1xcXFwnIG9yICcvJy5cbiAgICBzZXA6IChjYy5zeXMub3MgPT09IGNjLnN5cy5PU19XSU5ET1dTID8gJ1xcXFwnIDogJy8nKSxcblxuICAgIC8vIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gICAgc3RyaXBTZXAgKHBhdGgpIHtcbiAgICAgICAgcmV0dXJuIHBhdGgucmVwbGFjZSgvW1xcL1xcXFxdJC8sICcnKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNjLnBhdGg7Il0sInNvdXJjZVJvb3QiOiIvIn0=