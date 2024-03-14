
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/compression/base64.js';
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
var misc = require('../core/utils/misc');

var strValue = misc.BASE64_VALUES;
/**
 * mixin cc.Codec.Base64
 */

var Base64 = {
  name: 'Jacob__Codec__Base64'
};
/**
 * <p>
 *    cc.Codec.Base64.decode(input[, unicode=false]) -> String (http://en.wikipedia.org/wiki/Base64).
 * </p>
 * @function
 * @param {String} input The base64 encoded string to decode
 * @return {String} Decodes a base64 encoded String
 * @example
 * //decode string
 * cc.Codec.Base64.decode("U29tZSBTdHJpbmc="); // => "Some String"
 */

Base64.decode = function Jacob__Codec__Base64__decode(input) {
  var output = [],
      chr1,
      chr2,
      chr3,
      enc1,
      enc2,
      enc3,
      enc4,
      i = 0;
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

  while (i < input.length) {
    enc1 = strValue[input.charCodeAt(i++)];
    enc2 = strValue[input.charCodeAt(i++)];
    enc3 = strValue[input.charCodeAt(i++)];
    enc4 = strValue[input.charCodeAt(i++)];
    chr1 = enc1 << 2 | enc2 >> 4;
    chr2 = (enc2 & 15) << 4 | enc3 >> 2;
    chr3 = (enc3 & 3) << 6 | enc4;
    output.push(String.fromCharCode(chr1));

    if (enc3 !== 64) {
      output.push(String.fromCharCode(chr2));
    }

    if (enc4 !== 64) {
      output.push(String.fromCharCode(chr3));
    }
  }

  output = output.join('');
  return output;
};
/**
 * <p>
 *    Converts an input string encoded in base64 to an array of integers whose<br/>
 *    values represent the decoded string's characters' bytes.
 * </p>
 * @function
 * @param {String} input The String to convert to an array of Integers
 * @param {Number} bytes
 * @return {Array}
 * @example
 * //decode string to array
 * var decodeArr = cc.Codec.Base64.decodeAsArray("U29tZSBTdHJpbmc=");
 */


Base64.decodeAsArray = function Jacob__Codec__Base64___decodeAsArray(input, bytes) {
  var dec = this.decode(input),
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

module.exports = Base64;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb21wcmVzc2lvbi9iYXNlNjQuanMiXSwibmFtZXMiOlsibWlzYyIsInJlcXVpcmUiLCJzdHJWYWx1ZSIsIkJBU0U2NF9WQUxVRVMiLCJCYXNlNjQiLCJuYW1lIiwiZGVjb2RlIiwiSmFjb2JfX0NvZGVjX19CYXNlNjRfX2RlY29kZSIsImlucHV0Iiwib3V0cHV0IiwiY2hyMSIsImNocjIiLCJjaHIzIiwiZW5jMSIsImVuYzIiLCJlbmMzIiwiZW5jNCIsImkiLCJyZXBsYWNlIiwibGVuZ3RoIiwiY2hhckNvZGVBdCIsInB1c2giLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJqb2luIiwiZGVjb2RlQXNBcnJheSIsIkphY29iX19Db2RlY19fQmFzZTY0X19fZGVjb2RlQXNBcnJheSIsImJ5dGVzIiwiZGVjIiwiYXIiLCJqIiwibGVuIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFJQSxJQUFJLEdBQUdDLE9BQU8sQ0FBQyxvQkFBRCxDQUFsQjs7QUFDQSxJQUFJQyxRQUFRLEdBQUdGLElBQUksQ0FBQ0csYUFBcEI7QUFFQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBSUMsTUFBTSxHQUFHO0FBQUNDLEVBQUFBLElBQUksRUFBQztBQUFOLENBQWI7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBRCxNQUFNLENBQUNFLE1BQVAsR0FBZ0IsU0FBU0MsNEJBQVQsQ0FBc0NDLEtBQXRDLEVBQTZDO0FBQ3pELE1BQUlDLE1BQU0sR0FBRyxFQUFiO0FBQUEsTUFDSUMsSUFESjtBQUFBLE1BQ1VDLElBRFY7QUFBQSxNQUNnQkMsSUFEaEI7QUFBQSxNQUVJQyxJQUZKO0FBQUEsTUFFVUMsSUFGVjtBQUFBLE1BRWdCQyxJQUZoQjtBQUFBLE1BRXNCQyxJQUZ0QjtBQUFBLE1BR0lDLENBQUMsR0FBRyxDQUhSO0FBS0FULEVBQUFBLEtBQUssR0FBR0EsS0FBSyxDQUFDVSxPQUFOLENBQWMscUJBQWQsRUFBcUMsRUFBckMsQ0FBUjs7QUFFQSxTQUFPRCxDQUFDLEdBQUdULEtBQUssQ0FBQ1csTUFBakIsRUFBeUI7QUFDckJOLElBQUFBLElBQUksR0FBR1gsUUFBUSxDQUFDTSxLQUFLLENBQUNZLFVBQU4sQ0FBaUJILENBQUMsRUFBbEIsQ0FBRCxDQUFmO0FBQ0FILElBQUFBLElBQUksR0FBR1osUUFBUSxDQUFDTSxLQUFLLENBQUNZLFVBQU4sQ0FBaUJILENBQUMsRUFBbEIsQ0FBRCxDQUFmO0FBQ0FGLElBQUFBLElBQUksR0FBR2IsUUFBUSxDQUFDTSxLQUFLLENBQUNZLFVBQU4sQ0FBaUJILENBQUMsRUFBbEIsQ0FBRCxDQUFmO0FBQ0FELElBQUFBLElBQUksR0FBR2QsUUFBUSxDQUFDTSxLQUFLLENBQUNZLFVBQU4sQ0FBaUJILENBQUMsRUFBbEIsQ0FBRCxDQUFmO0FBRUFQLElBQUFBLElBQUksR0FBSUcsSUFBSSxJQUFJLENBQVQsR0FBZUMsSUFBSSxJQUFJLENBQTlCO0FBQ0FILElBQUFBLElBQUksR0FBSSxDQUFDRyxJQUFJLEdBQUcsRUFBUixLQUFlLENBQWhCLEdBQXNCQyxJQUFJLElBQUksQ0FBckM7QUFDQUgsSUFBQUEsSUFBSSxHQUFJLENBQUNHLElBQUksR0FBRyxDQUFSLEtBQWMsQ0FBZixHQUFvQkMsSUFBM0I7QUFFQVAsSUFBQUEsTUFBTSxDQUFDWSxJQUFQLENBQVlDLE1BQU0sQ0FBQ0MsWUFBUCxDQUFvQmIsSUFBcEIsQ0FBWjs7QUFFQSxRQUFJSyxJQUFJLEtBQUssRUFBYixFQUFpQjtBQUNiTixNQUFBQSxNQUFNLENBQUNZLElBQVAsQ0FBWUMsTUFBTSxDQUFDQyxZQUFQLENBQW9CWixJQUFwQixDQUFaO0FBQ0g7O0FBQ0QsUUFBSUssSUFBSSxLQUFLLEVBQWIsRUFBaUI7QUFDYlAsTUFBQUEsTUFBTSxDQUFDWSxJQUFQLENBQVlDLE1BQU0sQ0FBQ0MsWUFBUCxDQUFvQlgsSUFBcEIsQ0FBWjtBQUNIO0FBQ0o7O0FBRURILEVBQUFBLE1BQU0sR0FBR0EsTUFBTSxDQUFDZSxJQUFQLENBQVksRUFBWixDQUFUO0FBRUEsU0FBT2YsTUFBUDtBQUNILENBL0JEO0FBaUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQUwsTUFBTSxDQUFDcUIsYUFBUCxHQUF1QixTQUFTQyxvQ0FBVCxDQUE4Q2xCLEtBQTlDLEVBQXFEbUIsS0FBckQsRUFBNEQ7QUFDL0UsTUFBSUMsR0FBRyxHQUFHLEtBQUt0QixNQUFMLENBQVlFLEtBQVosQ0FBVjtBQUFBLE1BQ0lxQixFQUFFLEdBQUcsRUFEVDtBQUFBLE1BQ2FaLENBRGI7QUFBQSxNQUNnQmEsQ0FEaEI7QUFBQSxNQUNtQkMsR0FEbkI7O0FBRUEsT0FBS2QsQ0FBQyxHQUFHLENBQUosRUFBT2MsR0FBRyxHQUFHSCxHQUFHLENBQUNULE1BQUosR0FBYVEsS0FBL0IsRUFBc0NWLENBQUMsR0FBR2MsR0FBMUMsRUFBK0NkLENBQUMsRUFBaEQsRUFBb0Q7QUFDaERZLElBQUFBLEVBQUUsQ0FBQ1osQ0FBRCxDQUFGLEdBQVEsQ0FBUjs7QUFDQSxTQUFLYSxDQUFDLEdBQUdILEtBQUssR0FBRyxDQUFqQixFQUFvQkcsQ0FBQyxJQUFJLENBQXpCLEVBQTRCLEVBQUVBLENBQTlCLEVBQWlDO0FBQzdCRCxNQUFBQSxFQUFFLENBQUNaLENBQUQsQ0FBRixJQUFTVyxHQUFHLENBQUNSLFVBQUosQ0FBZ0JILENBQUMsR0FBR1UsS0FBTCxHQUFjRyxDQUE3QixLQUFvQ0EsQ0FBQyxHQUFHLENBQWpEO0FBQ0g7QUFDSjs7QUFFRCxTQUFPRCxFQUFQO0FBQ0gsQ0FYRDs7QUFhQUcsTUFBTSxDQUFDQyxPQUFQLEdBQWlCN0IsTUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKi0tXG4gQ29weXJpZ2h0IDIwMDktMjAxMCBieSBTdGVmYW4gUnVzdGVyaG9sei5cbiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuIFlvdSBjYW4gY2hvb3NlIGJldHdlZW4gTUlUIGFuZCBCU0QtMy1DbGF1c2UgbGljZW5zZS4gTGljZW5zZSBmaWxlIHdpbGwgYmUgYWRkZWQgbGF0ZXIuXG4gLS0qL1xuXG52YXIgbWlzYyA9IHJlcXVpcmUoJy4uL2NvcmUvdXRpbHMvbWlzYycpO1xudmFyIHN0clZhbHVlID0gbWlzYy5CQVNFNjRfVkFMVUVTO1xuXG4vKipcbiAqIG1peGluIGNjLkNvZGVjLkJhc2U2NFxuICovXG52YXIgQmFzZTY0ID0ge25hbWU6J0phY29iX19Db2RlY19fQmFzZTY0J307XG5cbi8qKlxuICogPHA+XG4gKiAgICBjYy5Db2RlYy5CYXNlNjQuZGVjb2RlKGlucHV0WywgdW5pY29kZT1mYWxzZV0pIC0+IFN0cmluZyAoaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9CYXNlNjQpLlxuICogPC9wPlxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIGJhc2U2NCBlbmNvZGVkIHN0cmluZyB0byBkZWNvZGVcbiAqIEByZXR1cm4ge1N0cmluZ30gRGVjb2RlcyBhIGJhc2U2NCBlbmNvZGVkIFN0cmluZ1xuICogQGV4YW1wbGVcbiAqIC8vZGVjb2RlIHN0cmluZ1xuICogY2MuQ29kZWMuQmFzZTY0LmRlY29kZShcIlUyOXRaU0JUZEhKcGJtYz1cIik7IC8vID0+IFwiU29tZSBTdHJpbmdcIlxuICovXG5CYXNlNjQuZGVjb2RlID0gZnVuY3Rpb24gSmFjb2JfX0NvZGVjX19CYXNlNjRfX2RlY29kZShpbnB1dCkge1xuICAgIHZhciBvdXRwdXQgPSBbXSxcbiAgICAgICAgY2hyMSwgY2hyMiwgY2hyMyxcbiAgICAgICAgZW5jMSwgZW5jMiwgZW5jMywgZW5jNCxcbiAgICAgICAgaSA9IDA7XG5cbiAgICBpbnB1dCA9IGlucHV0LnJlcGxhY2UoL1teQS1aYS16MC05XFwrXFwvXFw9XS9nLCBcIlwiKTtcblxuICAgIHdoaWxlIChpIDwgaW5wdXQubGVuZ3RoKSB7XG4gICAgICAgIGVuYzEgPSBzdHJWYWx1ZVtpbnB1dC5jaGFyQ29kZUF0KGkrKyldO1xuICAgICAgICBlbmMyID0gc3RyVmFsdWVbaW5wdXQuY2hhckNvZGVBdChpKyspXTtcbiAgICAgICAgZW5jMyA9IHN0clZhbHVlW2lucHV0LmNoYXJDb2RlQXQoaSsrKV07XG4gICAgICAgIGVuYzQgPSBzdHJWYWx1ZVtpbnB1dC5jaGFyQ29kZUF0KGkrKyldO1xuXG4gICAgICAgIGNocjEgPSAoZW5jMSA8PCAyKSB8IChlbmMyID4+IDQpO1xuICAgICAgICBjaHIyID0gKChlbmMyICYgMTUpIDw8IDQpIHwgKGVuYzMgPj4gMik7XG4gICAgICAgIGNocjMgPSAoKGVuYzMgJiAzKSA8PCA2KSB8IGVuYzQ7XG5cbiAgICAgICAgb3V0cHV0LnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZShjaHIxKSk7XG5cbiAgICAgICAgaWYgKGVuYzMgIT09IDY0KSB7XG4gICAgICAgICAgICBvdXRwdXQucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKGNocjIpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW5jNCAhPT0gNjQpIHtcbiAgICAgICAgICAgIG91dHB1dC5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoY2hyMykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb3V0cHV0ID0gb3V0cHV0LmpvaW4oJycpO1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogPHA+XG4gKiAgICBDb252ZXJ0cyBhbiBpbnB1dCBzdHJpbmcgZW5jb2RlZCBpbiBiYXNlNjQgdG8gYW4gYXJyYXkgb2YgaW50ZWdlcnMgd2hvc2U8YnIvPlxuICogICAgdmFsdWVzIHJlcHJlc2VudCB0aGUgZGVjb2RlZCBzdHJpbmcncyBjaGFyYWN0ZXJzJyBieXRlcy5cbiAqIDwvcD5cbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBTdHJpbmcgdG8gY29udmVydCB0byBhbiBhcnJheSBvZiBJbnRlZ2Vyc1xuICogQHBhcmFtIHtOdW1iZXJ9IGJ5dGVzXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBleGFtcGxlXG4gKiAvL2RlY29kZSBzdHJpbmcgdG8gYXJyYXlcbiAqIHZhciBkZWNvZGVBcnIgPSBjYy5Db2RlYy5CYXNlNjQuZGVjb2RlQXNBcnJheShcIlUyOXRaU0JUZEhKcGJtYz1cIik7XG4gKi9cbkJhc2U2NC5kZWNvZGVBc0FycmF5ID0gZnVuY3Rpb24gSmFjb2JfX0NvZGVjX19CYXNlNjRfX19kZWNvZGVBc0FycmF5KGlucHV0LCBieXRlcykge1xuICAgIHZhciBkZWMgPSB0aGlzLmRlY29kZShpbnB1dCksXG4gICAgICAgIGFyID0gW10sIGksIGosIGxlbjtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBkZWMubGVuZ3RoIC8gYnl0ZXM7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBhcltpXSA9IDA7XG4gICAgICAgIGZvciAoaiA9IGJ5dGVzIC0gMTsgaiA+PSAwOyAtLWopIHtcbiAgICAgICAgICAgIGFyW2ldICs9IGRlYy5jaGFyQ29kZUF0KChpICogYnl0ZXMpICsgaikgPDwgKGogKiA4KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhcjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZTY0O1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=