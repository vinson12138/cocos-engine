
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/core/program-lib.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _gfx = _interopRequireDefault(require("../gfx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
var _shdID = 0;

function _generateDefines(tmpDefines, defines) {
  var results = [];

  for (var i = 0; i < tmpDefines.length; i++) {
    var name = tmpDefines[i].name;
    var value = defines[name];

    if (typeof value !== 'number') {
      value = value ? 1 : 0;
    }

    results.push("#define " + name + " " + value);
  }

  return results.join('\n') + '\n';
}

function _replaceMacroNums(string, tmpDefines, defines) {
  var tmp = string;

  for (var i = 0; i < tmpDefines.length; i++) {
    var name = tmpDefines[i].name;
    var value = defines[name];

    if (Number.isInteger(value)) {
      var reg = new RegExp(name, 'g');
      tmp = tmp.replace(reg, value);
    }
  }

  return tmp;
}

function _unrollLoops(string) {
  var pattern = /#pragma for (\w+) in range\(\s*(\d+)\s*,\s*(\d+)\s*\)([\s\S]+?)#pragma endFor/g;

  function replace(match, index, begin, end, snippet) {
    var unroll = '';
    var parsedBegin = parseInt(begin);
    var parsedEnd = parseInt(end);

    if (parsedBegin.isNaN || parsedEnd.isNaN) {
      console.error('Unroll For Loops Error: begin and end of range must be an int num.');
    }

    for (var i = parsedBegin; i < parsedEnd; ++i) {
      unroll += snippet.replace(new RegExp("{" + index + "}", 'g'), i);
    }

    return unroll;
  }

  return string.replace(pattern, replace);
}

function _replaceHighp(string) {
  return string.replace(/\bhighp\b/g, 'mediump');
}

var ProgramLib = /*#__PURE__*/function () {
  /**
   * @param {gfx.Device} device
   */
  function ProgramLib(device) {
    this._device = device; // register templates

    this._templates = {};
    this._cache = {};

    this._checkPrecision();
  }

  var _proto = ProgramLib.prototype;

  _proto.clear = function clear() {
    this._templates = {};
    this._cache = {};
  }
  /**
   * @param {string} name
   * @param {string} vert
   * @param {string} frag
   * @param {Object[]} defines
   *
   * @example:
   *   // this object is auto-generated from your actual shaders
   *   let program = {
   *     name: 'foobar',
   *     vert: vertTmpl,
   *     frag: fragTmpl,
   *     defines: [
   *       { name: 'shadow', type: 'boolean' },
   *       { name: 'lightCount', type: 'number', min: 1, max: 4 }
   *     ],
   *     attributes: [{ name: 'a_position', type: 'vec3' }],
   *     uniforms: [{ name: 'color', type: 'vec4' }],
   *     extensions: ['GL_OES_standard_derivatives'],
   *   };
   *   programLib.define(program);
   */
  ;

  _proto.define = function define(prog) {
    var name = prog.name,
        defines = prog.defines,
        glsl1 = prog.glsl1;

    var _ref = glsl1 || prog,
        vert = _ref.vert,
        frag = _ref.frag;

    if (this._templates[name]) {
      // console.warn(`Failed to define shader ${name}: already exists.`);
      return;
    }

    var id = ++_shdID; // calculate option mask offset

    var offset = 0;

    for (var i = 0; i < defines.length; ++i) {
      var def = defines[i];
      var cnt = 1;

      if (def.type === 'number') {
        var range = def.range || [];
        def.min = range[0] || 0;
        def.max = range[1] || 4;
        cnt = Math.ceil(Math.log2(def.max - def.min));

        def._map = function (value) {
          return value - this.min << this._offset;
        }.bind(def);
      } else {
        // boolean
        def._map = function (value) {
          if (value) {
            return 1 << this._offset;
          }

          return 0;
        }.bind(def);
      }

      def._offset = offset;
      offset += cnt;
    }

    var uniforms = prog.uniforms || [];

    if (prog.samplers) {
      for (var _i = 0; _i < prog.samplers.length; _i++) {
        uniforms.push(prog.samplers[_i]);
      }
    }

    if (prog.blocks) {
      for (var _i2 = 0; _i2 < prog.blocks.length; _i2++) {
        var _defines = prog.blocks[_i2].defines;
        var members = prog.blocks[_i2].members;

        for (var j = 0; j < members.length; j++) {
          uniforms.push({
            defines: _defines,
            name: members[j].name,
            type: members[j].type
          });
        }
      }
    } // store it


    this._templates[name] = {
      id: id,
      name: name,
      vert: vert,
      frag: frag,
      defines: defines,
      attributes: prog.attributes,
      uniforms: uniforms,
      extensions: prog.extensions
    };
  };

  _proto.getTemplate = function getTemplate(name) {
    return this._templates[name];
  }
  /**
   * Does this library has the specified program?
   * @param {string} name
   * @returns {boolean}
   */
  ;

  _proto.hasProgram = function hasProgram(name) {
    return this._templates[name] !== undefined;
  };

  _proto.getKey = function getKey(name, defines) {
    var tmpl = this._templates[name];
    var key = 0;

    for (var i = 0; i < tmpl.defines.length; ++i) {
      var tmplDefs = tmpl.defines[i];
      var value = defines[tmplDefs.name];

      if (value === undefined) {
        continue;
      }

      key |= tmplDefs._map(value);
    } // return key << 8 | tmpl.id;
    // key number maybe bigger than 32 bit, need use string to store value.


    return tmpl.id + ':' + key;
  };

  _proto.getProgram = function getProgram(pass, defines, errPrefix) {
    var key = pass._programKey = pass._programKey || this.getKey(pass._programName, defines);
    var program = this._cache[key];

    if (program) {
      return program;
    } // get template


    var tmpl = this._templates[pass._programName];

    var customDef = _generateDefines(tmpl.defines, defines);

    var vert = _replaceMacroNums(tmpl.vert, tmpl.defines, defines);

    vert = customDef + _unrollLoops(vert);

    if (!this._highpSupported) {
      vert = _replaceHighp(vert);
    }

    var frag = _replaceMacroNums(tmpl.frag, tmpl.defines, defines);

    frag = customDef + _unrollLoops(frag);

    if (!this._highpSupported) {
      frag = _replaceHighp(frag);
    }

    program = new _gfx["default"].Program(this._device, {
      vert: vert,
      frag: frag
    });
    var errors = program.link();

    if (errors) {
      var vertLines = vert.split('\n');
      var fragLines = frag.split('\n');
      var defineLength = tmpl.defines.length;
      errors.forEach(function (err) {
        var line = err.line - 1;
        var originLine = err.line - defineLength;
        var lines = err.type === 'vs' ? vertLines : fragLines; // let source = ` ${lines[line-1]}\n>${lines[line]}\n ${lines[line+1]}`;

        var source = lines[line];
        var info = err.info || "Failed to compile " + err.type + " " + err.fileID + " (ln " + originLine + "): \n " + err.message + ": \n  " + source;
        cc.error(errPrefix + " : " + info);
      });
    }

    this._cache[key] = program;
    return program;
  };

  _proto._checkPrecision = function _checkPrecision() {
    var gl = this._device._gl;
    var highpSupported = false;

    if (gl.getShaderPrecisionFormat) {
      var vertHighp = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT);
      var fragHighp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
      highpSupported = vertHighp && vertHighp.precision > 0 && fragHighp && fragHighp.precision > 0;
    }

    if (!highpSupported) {
      cc.warnID(9102);
    }

    this._highpSupported = highpSupported;
  };

  return ProgramLib;
}();

exports["default"] = ProgramLib;
module.exports = exports["default"];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9yZW5kZXJlci9jb3JlL3Byb2dyYW0tbGliLmpzIl0sIm5hbWVzIjpbIl9zaGRJRCIsIl9nZW5lcmF0ZURlZmluZXMiLCJ0bXBEZWZpbmVzIiwiZGVmaW5lcyIsInJlc3VsdHMiLCJpIiwibGVuZ3RoIiwibmFtZSIsInZhbHVlIiwicHVzaCIsImpvaW4iLCJfcmVwbGFjZU1hY3JvTnVtcyIsInN0cmluZyIsInRtcCIsIk51bWJlciIsImlzSW50ZWdlciIsInJlZyIsIlJlZ0V4cCIsInJlcGxhY2UiLCJfdW5yb2xsTG9vcHMiLCJwYXR0ZXJuIiwibWF0Y2giLCJpbmRleCIsImJlZ2luIiwiZW5kIiwic25pcHBldCIsInVucm9sbCIsInBhcnNlZEJlZ2luIiwicGFyc2VJbnQiLCJwYXJzZWRFbmQiLCJpc05hTiIsImNvbnNvbGUiLCJlcnJvciIsIl9yZXBsYWNlSGlnaHAiLCJQcm9ncmFtTGliIiwiZGV2aWNlIiwiX2RldmljZSIsIl90ZW1wbGF0ZXMiLCJfY2FjaGUiLCJfY2hlY2tQcmVjaXNpb24iLCJjbGVhciIsImRlZmluZSIsInByb2ciLCJnbHNsMSIsInZlcnQiLCJmcmFnIiwiaWQiLCJvZmZzZXQiLCJkZWYiLCJjbnQiLCJ0eXBlIiwicmFuZ2UiLCJtaW4iLCJtYXgiLCJNYXRoIiwiY2VpbCIsImxvZzIiLCJfbWFwIiwiX29mZnNldCIsImJpbmQiLCJ1bmlmb3JtcyIsInNhbXBsZXJzIiwiYmxvY2tzIiwibWVtYmVycyIsImoiLCJhdHRyaWJ1dGVzIiwiZXh0ZW5zaW9ucyIsImdldFRlbXBsYXRlIiwiaGFzUHJvZ3JhbSIsInVuZGVmaW5lZCIsImdldEtleSIsInRtcGwiLCJrZXkiLCJ0bXBsRGVmcyIsImdldFByb2dyYW0iLCJwYXNzIiwiZXJyUHJlZml4IiwiX3Byb2dyYW1LZXkiLCJfcHJvZ3JhbU5hbWUiLCJwcm9ncmFtIiwiY3VzdG9tRGVmIiwiX2hpZ2hwU3VwcG9ydGVkIiwiZ2Z4IiwiUHJvZ3JhbSIsImVycm9ycyIsImxpbmsiLCJ2ZXJ0TGluZXMiLCJzcGxpdCIsImZyYWdMaW5lcyIsImRlZmluZUxlbmd0aCIsImZvckVhY2giLCJlcnIiLCJsaW5lIiwib3JpZ2luTGluZSIsImxpbmVzIiwic291cmNlIiwiaW5mbyIsImZpbGVJRCIsIm1lc3NhZ2UiLCJjYyIsImdsIiwiX2dsIiwiaGlnaHBTdXBwb3J0ZWQiLCJnZXRTaGFkZXJQcmVjaXNpb25Gb3JtYXQiLCJ2ZXJ0SGlnaHAiLCJWRVJURVhfU0hBREVSIiwiSElHSF9GTE9BVCIsImZyYWdIaWdocCIsIkZSQUdNRU5UX1NIQURFUiIsInByZWNpc2lvbiIsIndhcm5JRCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUVBOzs7O0FBRkE7QUFJQSxJQUFJQSxNQUFNLEdBQUcsQ0FBYjs7QUFFQSxTQUFTQyxnQkFBVCxDQUEwQkMsVUFBMUIsRUFBc0NDLE9BQXRDLEVBQStDO0FBQzdDLE1BQUlDLE9BQU8sR0FBRyxFQUFkOztBQUNBLE9BQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0gsVUFBVSxDQUFDSSxNQUEvQixFQUF1Q0QsQ0FBQyxFQUF4QyxFQUE0QztBQUMxQyxRQUFJRSxJQUFJLEdBQUdMLFVBQVUsQ0FBQ0csQ0FBRCxDQUFWLENBQWNFLElBQXpCO0FBQ0EsUUFBSUMsS0FBSyxHQUFHTCxPQUFPLENBQUNJLElBQUQsQ0FBbkI7O0FBQ0EsUUFBSSxPQUFPQyxLQUFQLEtBQWlCLFFBQXJCLEVBQStCO0FBQzdCQSxNQUFBQSxLQUFLLEdBQUdBLEtBQUssR0FBRyxDQUFILEdBQU8sQ0FBcEI7QUFDRDs7QUFDREosSUFBQUEsT0FBTyxDQUFDSyxJQUFSLGNBQXdCRixJQUF4QixTQUFnQ0MsS0FBaEM7QUFDRDs7QUFDRCxTQUFPSixPQUFPLENBQUNNLElBQVIsQ0FBYSxJQUFiLElBQXFCLElBQTVCO0FBQ0Q7O0FBRUQsU0FBU0MsaUJBQVQsQ0FBMkJDLE1BQTNCLEVBQW1DVixVQUFuQyxFQUErQ0MsT0FBL0MsRUFBd0Q7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QUFDSyxJQUFKLDJCQUFpQ0wsR0FBRyxDQUFDekMsSUFBckMsU0FBNkN5QyxHQUFHLENBQUNNLE1BQWpELGFBQStESixVQUEvRCxjQUFrRkYsR0FBRyxDQUFDTyxPQUF0RixjQUFzR0gsTUFBakg7QUFDQUksUUFBQUEsRUFBRSxDQUFDbkUsS0FBSCxDQUFZNEMsU0FBWixXQUEyQm9CLElBQTNCO0FBQ0QsT0FWRDtBQVdEOztBQUNELFNBQUsxRCxNQUFMLENBQVlrQyxHQUFaLElBQW1CTyxPQUFuQjtBQUVBLFdBQU9BLE9BQVA7QUFDRDs7U0FFRHhDLGtCQUFBLDJCQUFtQjtBQUNqQixRQUFJNkQsRUFBRSxHQUFHLEtBQUtoRSxPQUFMLENBQWFpRSxHQUF0QjtBQUNBLFFBQUlDLGNBQWMsR0FBRyxLQUFyQjs7QUFDQSxRQUFJRixFQUFFLENBQUNHLHdCQUFQLEVBQWlDO0FBQzdCLFVBQUlDLFNBQVMsR0FBR0osRUFBRSxDQUFDRyx3QkFBSCxDQUE0QkgsRUFBRSxDQUFDSyxhQUEvQixFQUE4Q0wsRUFBRSxDQUFDTSxVQUFqRCxDQUFoQjtBQUNBLFVBQUlDLFNBQVMsR0FBR1AsRUFBRSxDQUFDRyx3QkFBSCxDQUE0QkgsRUFBRSxDQUFDUSxlQUEvQixFQUFnRFIsRUFBRSxDQUFDTSxVQUFuRCxDQUFoQjtBQUNBSixNQUFBQSxjQUFjLEdBQUlFLFNBQVMsSUFBSUEsU0FBUyxDQUFDSyxTQUFWLEdBQXNCLENBQXBDLElBQ2RGLFNBQVMsSUFBSUEsU0FBUyxDQUFDRSxTQUFWLEdBQXNCLENBRHRDO0FBRUg7O0FBQ0QsUUFBSSxDQUFDUCxjQUFMLEVBQXFCO0FBQ25CSCxNQUFBQSxFQUFFLENBQUNXLE1BQUgsQ0FBVSxJQUFWO0FBQ0Q7O0FBQ0QsU0FBSzdCLGVBQUwsR0FBdUJxQixjQUF2QjtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbmltcG9ydCBnZnggZnJvbSAnLi4vZ2Z4JztcblxubGV0IF9zaGRJRCA9IDA7XG5cbmZ1bmN0aW9uIF9nZW5lcmF0ZURlZmluZXModG1wRGVmaW5lcywgZGVmaW5lcykge1xuICBsZXQgcmVzdWx0cyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHRtcERlZmluZXMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgbmFtZSA9IHRtcERlZmluZXNbaV0ubmFtZTtcbiAgICBsZXQgdmFsdWUgPSBkZWZpbmVzW25hbWVdO1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlID8gMSA6IDA7XG4gICAgfVxuICAgIHJlc3VsdHMucHVzaChgI2RlZmluZSAke25hbWV9ICR7dmFsdWV9YCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdHMuam9pbignXFxuJykgKyAnXFxuJztcbn1cblxuZnVuY3Rpb24gX3JlcGxhY2VNYWNyb051bXMoc3RyaW5nLCB0bXBEZWZpbmVzLCBkZWZpbmVzKSB7XG4gIGxldCB0bXAgPSBzdHJpbmc7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0bXBEZWZpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IG5hbWUgPSB0bXBEZWZpbmVzW2ldLm5hbWU7XG4gICAgbGV0IHZhbHVlID0gZGVmaW5lc1tuYW1lXTtcbiAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSkpIHtcbiAgICAgIGxldCByZWcgPSBuZXcgUmVnRXhwKG5hbWUsICdnJyk7XG4gICAgICB0bXAgPSB0bXAucmVwbGFjZShyZWcsIHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRtcDtcbn1cblxuZnVuY3Rpb24gX3Vucm9sbExvb3BzKHN0cmluZykge1xuICBsZXQgcGF0dGVybiA9IC8jcHJhZ21hIGZvciAoXFx3KykgaW4gcmFuZ2VcXChcXHMqKFxcZCspXFxzKixcXHMqKFxcZCspXFxzKlxcKShbXFxzXFxTXSs/KSNwcmFnbWEgZW5kRm9yL2c7XG4gIGZ1bmN0aW9uIHJlcGxhY2UobWF0Y2gsIGluZGV4LCBiZWdpbiwgZW5kLCBzbmlwcGV0KSB7XG4gICAgbGV0IHVucm9sbCA9ICcnO1xuICAgIGxldCBwYXJzZWRCZWdpbiA9IHBhcnNlSW50KGJlZ2luKTtcbiAgICBsZXQgcGFyc2VkRW5kID0gcGFyc2VJbnQoZW5kKTtcbiAgICBpZiAocGFyc2VkQmVnaW4uaXNOYU4gfHwgcGFyc2VkRW5kLmlzTmFOKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdVbnJvbGwgRm9yIExvb3BzIEVycm9yOiBiZWdpbiBhbmQgZW5kIG9mIHJhbmdlIG11c3QgYmUgYW4gaW50IG51bS4nKTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IHBhcnNlZEJlZ2luOyBpIDwgcGFyc2VkRW5kOyArK2kpIHtcbiAgICAgIHVucm9sbCArPSBzbmlwcGV0LnJlcGxhY2UobmV3IFJlZ0V4cChgeyR7aW5kZXh9fWAsICdnJyksIGkpO1xuICAgIH1cbiAgICByZXR1cm4gdW5yb2xsO1xuICB9XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShwYXR0ZXJuLCByZXBsYWNlKTtcbn1cblxuZnVuY3Rpb24gX3JlcGxhY2VIaWdocChzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9cXGJoaWdocFxcYi9nLCAnbWVkaXVtcCcpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm9ncmFtTGliIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7Z2Z4LkRldmljZX0gZGV2aWNlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkZXZpY2UpIHtcbiAgICB0aGlzLl9kZXZpY2UgPSBkZXZpY2U7XG5cbiAgICAvLyByZWdpc3RlciB0ZW1wbGF0ZXNcbiAgICB0aGlzLl90ZW1wbGF0ZXMgPSB7fTtcbiAgICB0aGlzLl9jYWNoZSA9IHt9O1xuXG4gICAgdGhpcy5fY2hlY2tQcmVjaXNpb24oKTtcbiAgfVxuXG4gIGNsZWFyICgpIHtcbiAgICB0aGlzLl90ZW1wbGF0ZXMgPSB7fTtcbiAgICB0aGlzLl9jYWNoZSA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2ZXJ0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmcmFnXG4gICAqIEBwYXJhbSB7T2JqZWN0W119IGRlZmluZXNcbiAgICpcbiAgICogQGV4YW1wbGU6XG4gICAqICAgLy8gdGhpcyBvYmplY3QgaXMgYXV0by1nZW5lcmF0ZWQgZnJvbSB5b3VyIGFjdHVhbCBzaGFkZXJzXG4gICAqICAgbGV0IHByb2dyYW0gPSB7XG4gICAqICAgICBuYW1lOiAnZm9vYmFyJyxcbiAgICogICAgIHZlcnQ6IHZlcnRUbXBsLFxuICAgKiAgICAgZnJhZzogZnJhZ1RtcGwsXG4gICAqICAgICBkZWZpbmVzOiBbXG4gICAqICAgICAgIHsgbmFtZTogJ3NoYWRvdycsIHR5cGU6ICdib29sZWFuJyB9LFxuICAgKiAgICAgICB7IG5hbWU6ICdsaWdodENvdW50JywgdHlwZTogJ251bWJlcicsIG1pbjogMSwgbWF4OiA0IH1cbiAgICogICAgIF0sXG4gICAqICAgICBhdHRyaWJ1dGVzOiBbeyBuYW1lOiAnYV9wb3NpdGlvbicsIHR5cGU6ICd2ZWMzJyB9XSxcbiAgICogICAgIHVuaWZvcm1zOiBbeyBuYW1lOiAnY29sb3InLCB0eXBlOiAndmVjNCcgfV0sXG4gICAqICAgICBleHRlbnNpb25zOiBbJ0dMX09FU19zdGFuZGFyZF9kZXJpdmF0aXZlcyddLFxuICAgKiAgIH07XG4gICAqICAgcHJvZ3JhbUxpYi5kZWZpbmUocHJvZ3JhbSk7XG4gICAqL1xuICBkZWZpbmUocHJvZykge1xuICAgIGxldCB7IG5hbWUsIGRlZmluZXMsIGdsc2wxIH0gPSBwcm9nO1xuICAgIGxldCB7IHZlcnQsIGZyYWcgfSA9IGdsc2wxIHx8IHByb2c7XG4gICAgaWYgKHRoaXMuX3RlbXBsYXRlc1tuYW1lXSkge1xuICAgICAgLy8gY29uc29sZS53YXJuKGBGYWlsZWQgdG8gZGVmaW5lIHNoYWRlciAke25hbWV9OiBhbHJlYWR5IGV4aXN0cy5gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgaWQgPSArK19zaGRJRDtcblxuICAgIC8vIGNhbGN1bGF0ZSBvcHRpb24gbWFzayBvZmZzZXRcbiAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlZmluZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGxldCBkZWYgPSBkZWZpbmVzW2ldO1xuICAgICAgbGV0IGNudCA9IDE7XG5cbiAgICAgIGlmIChkZWYudHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgbGV0IHJhbmdlID0gZGVmLnJhbmdlIHx8IFtdO1xuICAgICAgICBkZWYubWluID0gcmFuZ2VbMF0gfHwgMDtcbiAgICAgICAgZGVmLm1heCA9IHJhbmdlWzFdIHx8IDQ7XG4gICAgICAgIGNudCA9IE1hdGguY2VpbChNYXRoLmxvZzIoZGVmLm1heCAtIGRlZi5taW4pKTtcblxuICAgICAgICBkZWYuX21hcCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiAodmFsdWUgLSB0aGlzLm1pbikgPDwgdGhpcy5fb2Zmc2V0O1xuICAgICAgICB9LmJpbmQoZGVmKTtcbiAgICAgIH0gZWxzZSB7IC8vIGJvb2xlYW5cbiAgICAgICAgZGVmLl9tYXAgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAxIDw8IHRoaXMuX29mZnNldDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0uYmluZChkZWYpO1xuICAgICAgfVxuXG4gICAgICBkZWYuX29mZnNldCA9IG9mZnNldDtcbiAgICAgIG9mZnNldCArPSBjbnQ7XG4gICAgfVxuXG4gICAgbGV0IHVuaWZvcm1zID0gcHJvZy51bmlmb3JtcyB8fCBbXTtcblxuICAgIGlmIChwcm9nLnNhbXBsZXJzKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2cuc2FtcGxlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdW5pZm9ybXMucHVzaChwcm9nLnNhbXBsZXJzW2ldKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHJvZy5ibG9ja3MpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvZy5ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGRlZmluZXMgPSBwcm9nLmJsb2Nrc1tpXS5kZWZpbmVzO1xuICAgICAgICBsZXQgbWVtYmVycyA9IHByb2cuYmxvY2tzW2ldLm1lbWJlcnM7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWVtYmVycy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIHVuaWZvcm1zLnB1c2goe1xuICAgICAgICAgICAgZGVmaW5lcyxcbiAgICAgICAgICAgIG5hbWU6IG1lbWJlcnNbal0ubmFtZSxcbiAgICAgICAgICAgIHR5cGU6IG1lbWJlcnNbal0udHlwZSxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gc3RvcmUgaXRcbiAgICB0aGlzLl90ZW1wbGF0ZXNbbmFtZV0gPSB7XG4gICAgICBpZCxcbiAgICAgIG5hbWUsXG4gICAgICB2ZXJ0LFxuICAgICAgZnJhZyxcbiAgICAgIGRlZmluZXMsXG4gICAgICBhdHRyaWJ1dGVzOiBwcm9nLmF0dHJpYnV0ZXMsXG4gICAgICB1bmlmb3JtcyxcbiAgICAgIGV4dGVuc2lvbnM6IHByb2cuZXh0ZW5zaW9uc1xuICAgIH07XG4gIH1cblxuICBnZXRUZW1wbGF0ZShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RlbXBsYXRlc1tuYW1lXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb2VzIHRoaXMgbGlicmFyeSBoYXMgdGhlIHNwZWNpZmllZCBwcm9ncmFtP1xuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGhhc1Byb2dyYW0obmFtZSkge1xuICAgIHJldHVybiB0aGlzLl90ZW1wbGF0ZXNbbmFtZV0gIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGdldEtleShuYW1lLCBkZWZpbmVzKSB7XG4gICAgbGV0IHRtcGwgPSB0aGlzLl90ZW1wbGF0ZXNbbmFtZV07XG4gICAgbGV0IGtleSA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0bXBsLmRlZmluZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGxldCB0bXBsRGVmcyA9IHRtcGwuZGVmaW5lc1tpXTtcblxuICAgICAgbGV0IHZhbHVlID0gZGVmaW5lc1t0bXBsRGVmcy5uYW1lXTtcbiAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBrZXkgfD0gdG1wbERlZnMuX21hcCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gcmV0dXJuIGtleSA8PCA4IHwgdG1wbC5pZDtcbiAgICAvLyBrZXkgbnVtYmVyIG1heWJlIGJpZ2dlciB0aGFuIDMyIGJpdCwgbmVlZCB1c2Ugc3RyaW5nIHRvIHN0b3JlIHZhbHVlLlxuICAgIHJldHVybiB0bXBsLmlkICsgJzonICsga2V5O1xuICB9XG5cbiAgZ2V0UHJvZ3JhbShwYXNzLCBkZWZpbmVzLCBlcnJQcmVmaXgpIHtcbiAgICBsZXQga2V5ID0gcGFzcy5fcHJvZ3JhbUtleSA9IHBhc3MuX3Byb2dyYW1LZXkgfHwgdGhpcy5nZXRLZXkocGFzcy5fcHJvZ3JhbU5hbWUsIGRlZmluZXMpO1xuICAgIGxldCBwcm9ncmFtID0gdGhpcy5fY2FjaGVba2V5XTtcbiAgICBpZiAocHJvZ3JhbSkge1xuICAgICAgcmV0dXJuIHByb2dyYW07XG4gICAgfVxuXG4gICAgLy8gZ2V0IHRlbXBsYXRlXG4gICAgbGV0IHRtcGwgPSB0aGlzLl90ZW1wbGF0ZXNbcGFzcy5fcHJvZ3JhbU5hbWVdO1xuICAgIGxldCBjdXN0b21EZWYgPSBfZ2VuZXJhdGVEZWZpbmVzKHRtcGwuZGVmaW5lcywgZGVmaW5lcyk7XG4gICAgbGV0IHZlcnQgPSBfcmVwbGFjZU1hY3JvTnVtcyh0bXBsLnZlcnQsIHRtcGwuZGVmaW5lcywgZGVmaW5lcyk7XG4gICAgdmVydCA9IGN1c3RvbURlZiArIF91bnJvbGxMb29wcyh2ZXJ0KTtcbiAgICBpZiAoIXRoaXMuX2hpZ2hwU3VwcG9ydGVkKSB7XG4gICAgICB2ZXJ0ID0gX3JlcGxhY2VIaWdocCh2ZXJ0KTtcbiAgICB9XG5cbiAgICBsZXQgZnJhZyA9IF9yZXBsYWNlTWFjcm9OdW1zKHRtcGwuZnJhZywgdG1wbC5kZWZpbmVzLCBkZWZpbmVzKTtcbiAgICBmcmFnID0gY3VzdG9tRGVmICsgX3Vucm9sbExvb3BzKGZyYWcpO1xuICAgIGlmICghdGhpcy5faGlnaHBTdXBwb3J0ZWQpIHtcbiAgICAgIGZyYWcgPSBfcmVwbGFjZUhpZ2hwKGZyYWcpO1xuICAgIH1cblxuICAgIHByb2dyYW0gPSBuZXcgZ2Z4LlByb2dyYW0odGhpcy5fZGV2aWNlLCB7XG4gICAgICB2ZXJ0LFxuICAgICAgZnJhZ1xuICAgIH0pO1xuICAgIGxldCBlcnJvcnMgPSBwcm9ncmFtLmxpbmsoKTtcbiAgICBpZiAoZXJyb3JzKSB7XG4gICAgICBsZXQgdmVydExpbmVzID0gdmVydC5zcGxpdCgnXFxuJyk7XG4gICAgICBsZXQgZnJhZ0xpbmVzID0gZnJhZy5zcGxpdCgnXFxuJyk7XG4gICAgICBsZXQgZGVmaW5lTGVuZ3RoID0gdG1wbC5kZWZpbmVzLmxlbmd0aDtcbiAgICAgIGVycm9ycy5mb3JFYWNoKGVyciA9PiB7XG4gICAgICAgIGxldCBsaW5lID0gZXJyLmxpbmUgLSAxO1xuICAgICAgICBsZXQgb3JpZ2luTGluZSA9IGVyci5saW5lIC0gZGVmaW5lTGVuZ3RoO1xuXG4gICAgICAgIGxldCBsaW5lcyA9IGVyci50eXBlID09PSAndnMnID8gdmVydExpbmVzIDogZnJhZ0xpbmVzO1xuICAgICAgICAvLyBsZXQgc291cmNlID0gYCAke2xpbmVzW2xpbmUtMV19XFxuPiR7bGluZXNbbGluZV19XFxuICR7bGluZXNbbGluZSsxXX1gO1xuICAgICAgICBsZXQgc291cmNlID0gbGluZXNbbGluZV07XG5cbiAgICAgICAgbGV0IGluZm8gPSBlcnIuaW5mbyB8fCBgRmFpbGVkIHRvIGNvbXBpbGUgJHtlcnIudHlwZX0gJHtlcnIuZmlsZUlEfSAobG4gJHtvcmlnaW5MaW5lfSk6IFxcbiAke2Vyci5tZXNzYWdlfTogXFxuICAke3NvdXJjZX1gO1xuICAgICAgICBjYy5lcnJvcihgJHtlcnJQcmVmaXh9IDogJHtpbmZvfWApO1xuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5fY2FjaGVba2V5XSA9IHByb2dyYW07XG5cbiAgICByZXR1cm4gcHJvZ3JhbTtcbiAgfVxuXG4gIF9jaGVja1ByZWNpc2lvbiAoKSB7XG4gICAgbGV0IGdsID0gdGhpcy5fZGV2aWNlLl9nbDtcbiAgICBsZXQgaGlnaHBTdXBwb3J0ZWQgPSBmYWxzZTtcbiAgICBpZiAoZ2wuZ2V0U2hhZGVyUHJlY2lzaW9uRm9ybWF0KSB7XG4gICAgICAgIGxldCB2ZXJ0SGlnaHAgPSBnbC5nZXRTaGFkZXJQcmVjaXNpb25Gb3JtYXQoZ2wuVkVSVEVYX1NIQURFUiwgZ2wuSElHSF9GTE9BVCk7XG4gICAgICAgIGxldCBmcmFnSGlnaHAgPSBnbC5nZXRTaGFkZXJQcmVjaXNpb25Gb3JtYXQoZ2wuRlJBR01FTlRfU0hBREVSLCBnbC5ISUdIX0ZMT0FUKTtcbiAgICAgICAgaGlnaHBTdXBwb3J0ZWQgPSAodmVydEhpZ2hwICYmIHZlcnRIaWdocC5wcmVjaXNpb24gPiAwKSAmJlxuICAgICAgICAgIChmcmFnSGlnaHAgJiYgZnJhZ0hpZ2hwLnByZWNpc2lvbiA+IDApO1xuICAgIH1cbiAgICBpZiAoIWhpZ2hwU3VwcG9ydGVkKSB7XG4gICAgICBjYy53YXJuSUQoOTEwMik7XG4gICAgfVxuICAgIHRoaXMuX2hpZ2hwU3VwcG9ydGVkID0gaGlnaHBTdXBwb3J0ZWQ7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiLyJ9