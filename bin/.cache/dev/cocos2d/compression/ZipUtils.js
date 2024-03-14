
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/compression/ZipUtils.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/*--
 Copyright 2009-2010 by Stefan Rusterholz.
 All rights reserved.
 You can choose between MIT and BSD-3-Clause license. License file will be added later.
 --*/
var codec = {
  name: 'Jacob__Codec'
};
codec.Base64 = require('./base64');
codec.GZip = require('./gzip');
/**
 * Unpack a gzipped byte array
 * @param {Array} input Byte array
 * @returns {String} Unpacked byte string
 */

codec.unzip = function () {
  return codec.GZip.gunzip.apply(codec.GZip, arguments);
};
/**
 * Unpack a gzipped byte string encoded as base64
 * @param {String} input Byte string encoded as base64
 * @returns {String} Unpacked byte string
 */


codec.unzipBase64 = function () {
  var buffer = codec.Base64.decode.apply(codec.Base64, arguments);

  try {
    return codec.GZip.gunzip.call(codec.GZip, buffer);
  } catch (e) {
    // if not zipped, just skip
    return buffer.slice(7); // get image data
  }
};
/**
 * Unpack a gzipped byte string encoded as base64
 * @param {String} input Byte string encoded as base64
 * @param {Number} bytes Bytes per array item
 * @returns {Array} Unpacked byte array
 */


codec.unzipBase64AsArray = function (input, bytes) {
  bytes = bytes || 1;
  var dec = this.unzipBase64(input),
      ar = [],
      i,
      j,
      len;

  for (i = 0, len = dec.length / bytes; i < len; i++) {
    ar[i] = 0;

    for (j = bytes - 1; j >= 0; --j) {
      ar[i] += dec.charCodeAt(i * bytes + j) << j * 8;
    }
  }

  return ar;
};
/**
 * Unpack a gzipped byte array
 * @param {Array} input Byte array
 * @param {Number} bytes Bytes per array item
 * @returns {Array} Unpacked byte array
 */


codec.unzipAsArray = function (input, bytes) {
  bytes = bytes || 1;
  var dec = this.unzip(input),
      ar = [],
      i,
      j,
      len;

  for (i = 0, len = dec.length / bytes; i < len; i++) {
    ar[i] = 0;

    for (j = bytes - 1; j >= 0; --j) {
      ar[i] += dec.charCodeAt(i * bytes + j) << j * 8;
    }
  }

  return ar;
};

cc.codec = module.exports = codec;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb21wcmVzc2lvbi9aaXBVdGlscy5qcyJdLCJuYW1lcyI6WyJjb2RlYyIsIm5hbWUiLCJCYXNlNjQiLCJyZXF1aXJlIiwiR1ppcCIsInVuemlwIiwiZ3VuemlwIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJ1bnppcEJhc2U2NCIsImJ1ZmZlciIsImRlY29kZSIsImNhbGwiLCJlIiwic2xpY2UiLCJ1bnppcEJhc2U2NEFzQXJyYXkiLCJpbnB1dCIsImJ5dGVzIiwiZGVjIiwiYXIiLCJpIiwiaiIsImxlbiIsImxlbmd0aCIsImNoYXJDb2RlQXQiLCJ1bnppcEFzQXJyYXkiLCJjYyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBSUEsS0FBSyxHQUFHO0FBQUNDLEVBQUFBLElBQUksRUFBQztBQUFOLENBQVo7QUFFQUQsS0FBSyxDQUFDRSxNQUFOLEdBQWVDLE9BQU8sQ0FBQyxVQUFELENBQXRCO0FBQ0FILEtBQUssQ0FBQ0ksSUFBTixHQUFhRCxPQUFPLENBQUMsUUFBRCxDQUFwQjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0FILEtBQUssQ0FBQ0ssS0FBTixHQUFjLFlBQVk7QUFDdEIsU0FBT0wsS0FBSyxDQUFDSSxJQUFOLENBQVdFLE1BQVgsQ0FBa0JDLEtBQWxCLENBQXdCUCxLQUFLLENBQUNJLElBQTlCLEVBQW9DSSxTQUFwQyxDQUFQO0FBQ0gsQ0FGRDtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBUixLQUFLLENBQUNTLFdBQU4sR0FBb0IsWUFBWTtBQUM1QixNQUFJQyxNQUFNLEdBQUdWLEtBQUssQ0FBQ0UsTUFBTixDQUFhUyxNQUFiLENBQW9CSixLQUFwQixDQUEwQlAsS0FBSyxDQUFDRSxNQUFoQyxFQUF3Q00sU0FBeEMsQ0FBYjs7QUFDQSxNQUFJO0FBQ0EsV0FBT1IsS0FBSyxDQUFDSSxJQUFOLENBQVdFLE1BQVgsQ0FBa0JNLElBQWxCLENBQXVCWixLQUFLLENBQUNJLElBQTdCLEVBQW1DTSxNQUFuQyxDQUFQO0FBQ0gsR0FGRCxDQUdBLE9BQU1HLENBQU4sRUFBUztBQUNMO0FBQ0EsV0FBT0gsTUFBTSxDQUFDSSxLQUFQLENBQWEsQ0FBYixDQUFQLENBRkssQ0FFbUI7QUFDM0I7QUFDSixDQVREO0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQWQsS0FBSyxDQUFDZSxrQkFBTixHQUEyQixVQUFVQyxLQUFWLEVBQWlCQyxLQUFqQixFQUF3QjtBQUMvQ0EsRUFBQUEsS0FBSyxHQUFHQSxLQUFLLElBQUksQ0FBakI7QUFFQSxNQUFJQyxHQUFHLEdBQUcsS0FBS1QsV0FBTCxDQUFpQk8sS0FBakIsQ0FBVjtBQUFBLE1BQ0lHLEVBQUUsR0FBRyxFQURUO0FBQUEsTUFDYUMsQ0FEYjtBQUFBLE1BQ2dCQyxDQURoQjtBQUFBLE1BQ21CQyxHQURuQjs7QUFFQSxPQUFLRixDQUFDLEdBQUcsQ0FBSixFQUFPRSxHQUFHLEdBQUdKLEdBQUcsQ0FBQ0ssTUFBSixHQUFhTixLQUEvQixFQUFzQ0csQ0FBQyxHQUFHRSxHQUExQyxFQUErQ0YsQ0FBQyxFQUFoRCxFQUFvRDtBQUNoREQsSUFBQUEsRUFBRSxDQUFDQyxDQUFELENBQUYsR0FBUSxDQUFSOztBQUNBLFNBQUtDLENBQUMsR0FBR0osS0FBSyxHQUFHLENBQWpCLEVBQW9CSSxDQUFDLElBQUksQ0FBekIsRUFBNEIsRUFBRUEsQ0FBOUIsRUFBaUM7QUFDN0JGLE1BQUFBLEVBQUUsQ0FBQ0MsQ0FBRCxDQUFGLElBQVNGLEdBQUcsQ0FBQ00sVUFBSixDQUFnQkosQ0FBQyxHQUFHSCxLQUFMLEdBQWNJLENBQTdCLEtBQW9DQSxDQUFDLEdBQUcsQ0FBakQ7QUFDSDtBQUNKOztBQUNELFNBQU9GLEVBQVA7QUFDSCxDQVpEO0FBY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQW5CLEtBQUssQ0FBQ3lCLFlBQU4sR0FBcUIsVUFBVVQsS0FBVixFQUFpQkMsS0FBakIsRUFBd0I7QUFDekNBLEVBQUFBLEtBQUssR0FBR0EsS0FBSyxJQUFJLENBQWpCO0FBRUEsTUFBSUMsR0FBRyxHQUFHLEtBQUtiLEtBQUwsQ0FBV1csS0FBWCxDQUFWO0FBQUEsTUFDSUcsRUFBRSxHQUFHLEVBRFQ7QUFBQSxNQUNhQyxDQURiO0FBQUEsTUFDZ0JDLENBRGhCO0FBQUEsTUFDbUJDLEdBRG5COztBQUVBLE9BQUtGLENBQUMsR0FBRyxDQUFKLEVBQU9FLEdBQUcsR0FBR0osR0FBRyxDQUFDSyxNQUFKLEdBQWFOLEtBQS9CLEVBQXNDRyxDQUFDLEdBQUdFLEdBQTFDLEVBQStDRixDQUFDLEVBQWhELEVBQW9EO0FBQ2hERCxJQUFBQSxFQUFFLENBQUNDLENBQUQsQ0FBRixHQUFRLENBQVI7O0FBQ0EsU0FBS0MsQ0FBQyxHQUFHSixLQUFLLEdBQUcsQ0FBakIsRUFBb0JJLENBQUMsSUFBSSxDQUF6QixFQUE0QixFQUFFQSxDQUE5QixFQUFpQztBQUM3QkYsTUFBQUEsRUFBRSxDQUFDQyxDQUFELENBQUYsSUFBU0YsR0FBRyxDQUFDTSxVQUFKLENBQWdCSixDQUFDLEdBQUdILEtBQUwsR0FBY0ksQ0FBN0IsS0FBb0NBLENBQUMsR0FBRyxDQUFqRDtBQUNIO0FBQ0o7O0FBQ0QsU0FBT0YsRUFBUDtBQUNILENBWkQ7O0FBY0FPLEVBQUUsQ0FBQzFCLEtBQUgsR0FBVzJCLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjVCLEtBQTVCIiwic291cmNlc0NvbnRlbnQiOlsiLyotLVxuIENvcHlyaWdodCAyMDA5LTIwMTAgYnkgU3RlZmFuIFJ1c3RlcmhvbHouXG4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiBZb3UgY2FuIGNob29zZSBiZXR3ZWVuIE1JVCBhbmQgQlNELTMtQ2xhdXNlIGxpY2Vuc2UuIExpY2Vuc2UgZmlsZSB3aWxsIGJlIGFkZGVkIGxhdGVyLlxuIC0tKi9cblxudmFyIGNvZGVjID0ge25hbWU6J0phY29iX19Db2RlYyd9O1xuXG5jb2RlYy5CYXNlNjQgPSByZXF1aXJlKCcuL2Jhc2U2NCcpO1xuY29kZWMuR1ppcCA9IHJlcXVpcmUoJy4vZ3ppcCcpO1xuXG4vKipcbiAqIFVucGFjayBhIGd6aXBwZWQgYnl0ZSBhcnJheVxuICogQHBhcmFtIHtBcnJheX0gaW5wdXQgQnl0ZSBhcnJheVxuICogQHJldHVybnMge1N0cmluZ30gVW5wYWNrZWQgYnl0ZSBzdHJpbmdcbiAqL1xuY29kZWMudW56aXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNvZGVjLkdaaXAuZ3VuemlwLmFwcGx5KGNvZGVjLkdaaXAsIGFyZ3VtZW50cyk7XG59O1xuXG4vKipcbiAqIFVucGFjayBhIGd6aXBwZWQgYnl0ZSBzdHJpbmcgZW5jb2RlZCBhcyBiYXNlNjRcbiAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBCeXRlIHN0cmluZyBlbmNvZGVkIGFzIGJhc2U2NFxuICogQHJldHVybnMge1N0cmluZ30gVW5wYWNrZWQgYnl0ZSBzdHJpbmdcbiAqL1xuY29kZWMudW56aXBCYXNlNjQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJ1ZmZlciA9IGNvZGVjLkJhc2U2NC5kZWNvZGUuYXBwbHkoY29kZWMuQmFzZTY0LCBhcmd1bWVudHMpO1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBjb2RlYy5HWmlwLmd1bnppcC5jYWxsKGNvZGVjLkdaaXAsIGJ1ZmZlcik7XG4gICAgfVxuICAgIGNhdGNoKGUpIHtcbiAgICAgICAgLy8gaWYgbm90IHppcHBlZCwganVzdCBza2lwXG4gICAgICAgIHJldHVybiBidWZmZXIuc2xpY2UoNyk7IC8vIGdldCBpbWFnZSBkYXRhXG4gICAgfVxufTtcblxuLyoqXG4gKiBVbnBhY2sgYSBnemlwcGVkIGJ5dGUgc3RyaW5nIGVuY29kZWQgYXMgYmFzZTY0XG4gKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgQnl0ZSBzdHJpbmcgZW5jb2RlZCBhcyBiYXNlNjRcbiAqIEBwYXJhbSB7TnVtYmVyfSBieXRlcyBCeXRlcyBwZXIgYXJyYXkgaXRlbVxuICogQHJldHVybnMge0FycmF5fSBVbnBhY2tlZCBieXRlIGFycmF5XG4gKi9cbmNvZGVjLnVuemlwQmFzZTY0QXNBcnJheSA9IGZ1bmN0aW9uIChpbnB1dCwgYnl0ZXMpIHtcbiAgICBieXRlcyA9IGJ5dGVzIHx8IDE7XG5cbiAgICB2YXIgZGVjID0gdGhpcy51bnppcEJhc2U2NChpbnB1dCksXG4gICAgICAgIGFyID0gW10sIGksIGosIGxlbjtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBkZWMubGVuZ3RoIC8gYnl0ZXM7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBhcltpXSA9IDA7XG4gICAgICAgIGZvciAoaiA9IGJ5dGVzIC0gMTsgaiA+PSAwOyAtLWopIHtcbiAgICAgICAgICAgIGFyW2ldICs9IGRlYy5jaGFyQ29kZUF0KChpICogYnl0ZXMpICsgaikgPDwgKGogKiA4KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXI7XG59O1xuXG4vKipcbiAqIFVucGFjayBhIGd6aXBwZWQgYnl0ZSBhcnJheVxuICogQHBhcmFtIHtBcnJheX0gaW5wdXQgQnl0ZSBhcnJheVxuICogQHBhcmFtIHtOdW1iZXJ9IGJ5dGVzIEJ5dGVzIHBlciBhcnJheSBpdGVtXG4gKiBAcmV0dXJucyB7QXJyYXl9IFVucGFja2VkIGJ5dGUgYXJyYXlcbiAqL1xuY29kZWMudW56aXBBc0FycmF5ID0gZnVuY3Rpb24gKGlucHV0LCBieXRlcykge1xuICAgIGJ5dGVzID0gYnl0ZXMgfHwgMTtcblxuICAgIHZhciBkZWMgPSB0aGlzLnVuemlwKGlucHV0KSxcbiAgICAgICAgYXIgPSBbXSwgaSwgaiwgbGVuO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGRlYy5sZW5ndGggLyBieXRlczsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGFyW2ldID0gMDtcbiAgICAgICAgZm9yIChqID0gYnl0ZXMgLSAxOyBqID49IDA7IC0taikge1xuICAgICAgICAgICAgYXJbaV0gKz0gZGVjLmNoYXJDb2RlQXQoKGkgKiBieXRlcykgKyBqKSA8PCAoaiAqIDgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcjtcbn07XG5cbmNjLmNvZGVjID0gbW9kdWxlLmV4cG9ydHMgPSBjb2RlYzsiXSwic291cmNlUm9vdCI6Ii8ifQ==