
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/gfx/program.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _genID = 0;

function _parseError(out, type, errorLog) {
  if (!errorLog) {
    return;
  }

  errorLog.split('\n').forEach(function (msg) {
    if (msg.length < 5) {
      return;
    }

    var parts = /^ERROR:\s+(\d+):(\d+):\s*(.*)$/.exec(msg);

    if (parts) {
      out.push({
        type: type,
        fileID: parts[1] | 0,
        line: parts[2] | 0,
        message: parts[3].trim()
      });
    } else if (msg.length > 0) {
      out.push({
        type: type,
        fileID: -1,
        line: 0,
        message: msg
      });
    }
  });
}

var Program = /*#__PURE__*/function () {
  /**
   * @param {ef.GraphicsDevice} device - graphic device
   * @param {object} options - shader definition
   * @param {string} options.vert - vertex shader source code
   * @param {string} options.frag - fragment shader shader source code
   * @example
   * let prog = new Program(device, {
   *   vert: `
   *     attribute vec3 a_position;
   *     void main() {
   *       gl_Position = vec4( a_position, 1.0 );
   *     }
   *   `,
   *   frag: `
   *     precision mediump float;
   *     void main() {
   *       gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );
   *     }
   *   `
   * });
   */
  function Program(device, options) {
    this._device = device; // stores gl information: { location, type }

    this._attributes = [];
    this._uniforms = [];
    this._samplers = [];
    this._errors = [];
    this._linked = false;
    this._vertSource = options.vert;
    this._fragSource = options.frag;
    this._glID = null;
    this._id = _genID++;
  }

  var _proto = Program.prototype;

  _proto.link = function link() {
    if (this._linked) {
      return;
    }

    var gl = this._device._gl;

    var vertShader = _createShader(gl, gl.VERTEX_SHADER, this._vertSource);

    var fragShader = _createShader(gl, gl.FRAGMENT_SHADER, this._fragSource);

    var program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    var failed = false;
    var errors = this._errors;

    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
      _parseError(errors, 'vs', gl.getShaderInfoLog(vertShader));

      failed = true;
    }

    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      _parseError(errors, 'fs', gl.getShaderInfoLog(fragShader));

      failed = true;
    }

    gl.deleteShader(vertShader);
    gl.deleteShader(fragShader);

    if (failed) {
      return errors;
    }

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      errors.push({
        info: "Failed to link shader program: " + gl.getProgramInfoLog(program)
      });
      return errors;
    }

    this._glID = program; // parse attribute

    var numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

    for (var i = 0; i < numAttributes; ++i) {
      var info = gl.getActiveAttrib(program, i);
      var location = gl.getAttribLocation(program, info.name);

      this._attributes.push({
        name: info.name,
        location: location,
        type: info.type
      });
    } // parse uniform


    var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (var _i = 0; _i < numUniforms; ++_i) {
      var _info = gl.getActiveUniform(program, _i);

      var name = _info.name;

      var _location = gl.getUniformLocation(program, name);

      var isArray = name.substr(name.length - 3) === '[0]';

      if (isArray) {
        name = name.substr(0, name.length - 3);
      }

      var uniform = {
        name: name,
        location: _location,
        type: _info.type,
        size: isArray ? _info.size : undefined // used when uniform is an array

      };

      this._uniforms.push(uniform);
    }

    this._linked = true;
  };

  _proto.destroy = function destroy() {
    var gl = this._device._gl;
    gl.deleteProgram(this._glID);
    this._linked = false;
    this._glID = null;
    this._attributes = [];
    this._uniforms = [];
    this._samplers = [];
  };

  _createClass(Program, [{
    key: "id",
    get: function get() {
      return this._id;
    }
  }]);

  return Program;
}(); // ====================
// internal
// ====================


exports["default"] = Program;

function _createShader(gl, type, src) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9yZW5kZXJlci9nZngvcHJvZ3JhbS5qcyJdLCJuYW1lcyI6WyJfZ2VuSUQiLCJfcGFyc2VFcnJvciIsIm91dCIsInR5cGUiLCJlcnJvckxvZyIsInNwbGl0IiwiZm9yRWFjaCIsIm1zZyIsImxlbmd0aCIsInBhcnRzIiwiZXhlYyIsInB1c2giLCJmaWxlSUQiLCJsaW5lIiwibWVzc2FnZSIsInRyaW0iLCJQcm9ncmFtIiwiZGV2aWNlIiwib3B0aW9ucyIsIl9kZXZpY2UiLCJfYXR0cmlidXRlcyIsIl91bmlmb3JtcyIsIl9zYW1wbGVycyIsIl9lcnJvcnMiLCJfbGlua2VkIiwiX3ZlcnRTb3VyY2UiLCJ2ZXJ0IiwiX2ZyYWdTb3VyY2UiLCJmcmFnIiwiX2dsSUQiLCJfaWQiLCJsaW5rIiwiZ2wiLCJfZ2wiLCJ2ZXJ0U2hhZGVyIiwiX2NyZWF0ZVNoYWRlciIsIlZFUlRFWF9TSEFERVIiLCJmcmFnU2hhZGVyIiwiRlJBR01FTlRfU0hBREVSIiwicHJvZ3JhbSIsImNyZWF0ZVByb2dyYW0iLCJhdHRhY2hTaGFkZXIiLCJsaW5rUHJvZ3JhbSIsImZhaWxlZCIsImVycm9ycyIsImdldFNoYWRlclBhcmFtZXRlciIsIkNPTVBJTEVfU1RBVFVTIiwiZ2V0U2hhZGVySW5mb0xvZyIsImRlbGV0ZVNoYWRlciIsImdldFByb2dyYW1QYXJhbWV0ZXIiLCJMSU5LX1NUQVRVUyIsImluZm8iLCJnZXRQcm9ncmFtSW5mb0xvZyIsIm51bUF0dHJpYnV0ZXMiLCJBQ1RJVkVfQVRUUklCVVRFUyIsImkiLCJnZXRBY3RpdmVBdHRyaWIiLCJsb2NhdGlvbiIsImdldEF0dHJpYkxvY2F0aW9uIiwibmFtZSIsIm51bVVuaWZvcm1zIiwiQUNUSVZFX1VOSUZPUk1TIiwiZ2V0QWN0aXZlVW5pZm9ybSIsImdldFVuaWZvcm1Mb2NhdGlvbiIsImlzQXJyYXkiLCJzdWJzdHIiLCJ1bmlmb3JtIiwic2l6ZSIsInVuZGVmaW5lZCIsImRlc3Ryb3kiLCJkZWxldGVQcm9ncmFtIiwic3JjIiwic2hhZGVyIiwiY3JlYXRlU2hhZGVyIiwic2hhZGVyU291cmNlIiwiY29tcGlsZVNoYWRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxNQUFNLEdBQUcsQ0FBYjs7QUFFQSxTQUFTQyxXQUFULENBQXFCQyxHQUFyQixFQUEwQkMsSUFBMUIsRUFBZ0NDLFFBQWhDLEVBQTBDO0FBQ3hDLE1BQUcsQ0FBQ0EsUUFBSixFQUFhO0FBQ1g7QUFDRDs7QUFDREEsRUFBQUEsUUFBUSxDQUFDQyxLQUFULENBQWUsSUFBZixFQUFxQkMsT0FBckIsQ0FBNkIsVUFBQUMsR0FBRyxFQUFJO0FBQ2xDLFFBQUlBLEdBQUcsQ0FBQ0MsTUFBSixHQUFhLENBQWpCLEVBQW9CO0FBQ2xCO0FBQ0Q7O0FBRUQsUUFBSUMsS0FBSyxHQUFHLGlDQUFpQ0MsSUFBakMsQ0FBc0NILEdBQXRDLENBQVo7O0FBQ0EsUUFBSUUsS0FBSixFQUFXO0FBQ1RQLE1BQUFBLEdBQUcsQ0FBQ1MsSUFBSixDQUFTO0FBQ1BSLFFBQUFBLElBQUksRUFBRUEsSUFEQztBQUVQUyxRQUFBQSxNQUFNLEVBQUVILEtBQUssQ0FBQyxDQUFELENBQUwsR0FBVyxDQUZaO0FBR1BJLFFBQUFBLElBQUksRUFBRUosS0FBSyxDQUFDLENBQUQsQ0FBTCxHQUFXLENBSFY7QUFJUEssUUFBQUEsT0FBTyxFQUFFTCxLQUFLLENBQUMsQ0FBRCxDQUFMLENBQVNNLElBQVQ7QUFKRixPQUFUO0FBTUQsS0FQRCxNQU9PLElBQUlSLEdBQUcsQ0FBQ0MsTUFBSixHQUFhLENBQWpCLEVBQW9CO0FBQ3pCTixNQUFBQSxHQUFHLENBQUNTLElBQUosQ0FBUztBQUNQUixRQUFBQSxJQUFJLEVBQUVBLElBREM7QUFFUFMsUUFBQUEsTUFBTSxFQUFFLENBQUMsQ0FGRjtBQUdQQyxRQUFBQSxJQUFJLEVBQUUsQ0FIQztBQUlQQyxRQUFBQSxPQUFPLEVBQUVQO0FBSkYsT0FBVDtBQU1EO0FBQ0YsR0FyQkQ7QUFzQkQ7O0lB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QXdCRCxHQUF4QjtBQUNBdkMsRUFBQUEsRUFBRSxDQUFDMkMsYUFBSCxDQUFpQkgsTUFBakI7QUFFQSxTQUFPQSxNQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgX2dlbklEID0gMDtcblxuZnVuY3Rpb24gX3BhcnNlRXJyb3Iob3V0LCB0eXBlLCBlcnJvckxvZykge1xuICBpZighZXJyb3JMb2cpe1xuICAgIHJldHVybjtcbiAgfVxuICBlcnJvckxvZy5zcGxpdCgnXFxuJykuZm9yRWFjaChtc2cgPT4ge1xuICAgIGlmIChtc2cubGVuZ3RoIDwgNSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBwYXJ0cyA9IC9eRVJST1I6XFxzKyhcXGQrKTooXFxkKyk6XFxzKiguKikkLy5leGVjKG1zZyk7XG4gICAgaWYgKHBhcnRzKSB7XG4gICAgICBvdXQucHVzaCh7XG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIGZpbGVJRDogcGFydHNbMV0gfCAwLFxuICAgICAgICBsaW5lOiBwYXJ0c1syXSB8IDAsXG4gICAgICAgIG1lc3NhZ2U6IHBhcnRzWzNdLnRyaW0oKVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKG1zZy5sZW5ndGggPiAwKSB7XG4gICAgICBvdXQucHVzaCh7XG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIGZpbGVJRDogLTEsXG4gICAgICAgIGxpbmU6IDAsXG4gICAgICAgIG1lc3NhZ2U6IG1zZ1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvZ3JhbSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge2VmLkdyYXBoaWNzRGV2aWNlfSBkZXZpY2UgLSBncmFwaGljIGRldmljZVxuICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyAtIHNoYWRlciBkZWZpbml0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLnZlcnQgLSB2ZXJ0ZXggc2hhZGVyIHNvdXJjZSBjb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmZyYWcgLSBmcmFnbWVudCBzaGFkZXIgc2hhZGVyIHNvdXJjZSBjb2RlXG4gICAqIEBleGFtcGxlXG4gICAqIGxldCBwcm9nID0gbmV3IFByb2dyYW0oZGV2aWNlLCB7XG4gICAqICAgdmVydDogYFxuICAgKiAgICAgYXR0cmlidXRlIHZlYzMgYV9wb3NpdGlvbjtcbiAgICogICAgIHZvaWQgbWFpbigpIHtcbiAgICogICAgICAgZ2xfUG9zaXRpb24gPSB2ZWM0KCBhX3Bvc2l0aW9uLCAxLjAgKTtcbiAgICogICAgIH1cbiAgICogICBgLFxuICAgKiAgIGZyYWc6IGBcbiAgICogICAgIHByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xuICAgKiAgICAgdm9pZCBtYWluKCkge1xuICAgKiAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KCAxLjAsIDEuMCwgMS4wLCAxLjAgKTtcbiAgICogICAgIH1cbiAgICogICBgXG4gICAqIH0pO1xuICAgKi9cbiAgY29uc3RydWN0b3IoZGV2aWNlLCBvcHRpb25zKSB7XG4gICAgdGhpcy5fZGV2aWNlID0gZGV2aWNlO1xuXG4gICAgLy8gc3RvcmVzIGdsIGluZm9ybWF0aW9uOiB7IGxvY2F0aW9uLCB0eXBlIH1cbiAgICB0aGlzLl9hdHRyaWJ1dGVzID0gW107XG4gICAgdGhpcy5fdW5pZm9ybXMgPSBbXTtcbiAgICB0aGlzLl9zYW1wbGVycyA9IFtdO1xuICAgIHRoaXMuX2Vycm9ycyA9IFtdO1xuICAgIHRoaXMuX2xpbmtlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3ZlcnRTb3VyY2UgPSBvcHRpb25zLnZlcnQ7XG4gICAgdGhpcy5fZnJhZ1NvdXJjZSA9IG9wdGlvbnMuZnJhZztcbiAgICB0aGlzLl9nbElEID0gbnVsbDtcbiAgICB0aGlzLl9pZCA9IF9nZW5JRCsrO1xuICB9XG5cbiAgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLl9pZDtcbiAgfVxuXG4gIGxpbmsoKSB7XG4gICAgaWYgKHRoaXMuX2xpbmtlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBnbCA9IHRoaXMuX2RldmljZS5fZ2w7XG5cbiAgICBsZXQgdmVydFNoYWRlciA9IF9jcmVhdGVTaGFkZXIoZ2wsIGdsLlZFUlRFWF9TSEFERVIsIHRoaXMuX3ZlcnRTb3VyY2UpO1xuICAgIGxldCBmcmFnU2hhZGVyID0gX2NyZWF0ZVNoYWRlcihnbCwgZ2wuRlJBR01FTlRfU0hBREVSLCB0aGlzLl9mcmFnU291cmNlKTtcblxuICAgIGxldCBwcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCB2ZXJ0U2hhZGVyKTtcbiAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnJhZ1NoYWRlcik7XG4gICAgZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XG5cbiAgICBsZXQgZmFpbGVkID0gZmFsc2U7XG4gICAgbGV0IGVycm9ycyA9IHRoaXMuX2Vycm9ycztcblxuICAgIGlmICghZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHZlcnRTaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSkge1xuICAgICAgX3BhcnNlRXJyb3IoZXJyb3JzLCAndnMnLCBnbC5nZXRTaGFkZXJJbmZvTG9nKHZlcnRTaGFkZXIpKTtcbiAgICAgIGZhaWxlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoZnJhZ1NoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpKSB7XG4gICAgICBfcGFyc2VFcnJvcihlcnJvcnMsICdmcycsIGdsLmdldFNoYWRlckluZm9Mb2coZnJhZ1NoYWRlcikpO1xuICAgICAgZmFpbGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBnbC5kZWxldGVTaGFkZXIodmVydFNoYWRlcik7XG4gICAgZ2wuZGVsZXRlU2hhZGVyKGZyYWdTaGFkZXIpO1xuXG4gICAgaWYgKGZhaWxlZCkge1xuICAgICAgcmV0dXJuIGVycm9ycztcbiAgICB9XG5cbiAgICBpZiAoIWdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpKSB7XG4gICAgICBlcnJvcnMucHVzaCh7aW5mbzogYEZhaWxlZCB0byBsaW5rIHNoYWRlciBwcm9ncmFtOiAke2dsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW0pfWB9KTtcbiAgICAgIHJldHVybiBlcnJvcnM7XG4gICAgfVxuXG4gICAgdGhpcy5fZ2xJRCA9IHByb2dyYW07XG5cbiAgICAvLyBwYXJzZSBhdHRyaWJ1dGVcbiAgICBsZXQgbnVtQXR0cmlidXRlcyA9IGdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgZ2wuQUNUSVZFX0FUVFJJQlVURVMpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQXR0cmlidXRlczsgKytpKSB7XG4gICAgICBsZXQgaW5mbyA9IGdsLmdldEFjdGl2ZUF0dHJpYihwcm9ncmFtLCBpKTtcbiAgICAgIGxldCBsb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW0sIGluZm8ubmFtZSk7XG5cbiAgICAgIHRoaXMuX2F0dHJpYnV0ZXMucHVzaCh7XG4gICAgICAgIG5hbWU6IGluZm8ubmFtZSxcbiAgICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxuICAgICAgICB0eXBlOiBpbmZvLnR5cGUsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBwYXJzZSB1bmlmb3JtXG4gICAgbGV0IG51bVVuaWZvcm1zID0gZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtLCBnbC5BQ1RJVkVfVU5JRk9STVMpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtVW5pZm9ybXM7ICsraSkge1xuICAgICAgbGV0IGluZm8gPSBnbC5nZXRBY3RpdmVVbmlmb3JtKHByb2dyYW0sIGkpO1xuICAgICAgbGV0IG5hbWUgPSBpbmZvLm5hbWU7XG4gICAgICBsZXQgbG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbSwgbmFtZSk7XG4gICAgICBsZXQgaXNBcnJheSA9IG5hbWUuc3Vic3RyKG5hbWUubGVuZ3RoIC0gMykgPT09ICdbMF0nO1xuICAgICAgaWYgKGlzQXJyYXkpIHtcbiAgICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDAsIG5hbWUubGVuZ3RoIC0gMyk7XG4gICAgICB9XG5cbiAgICAgIGxldCB1bmlmb3JtID0ge1xuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICBsb2NhdGlvbjogbG9jYXRpb24sXG4gICAgICAgIHR5cGU6IGluZm8udHlwZSxcbiAgICAgICAgc2l6ZTogaXNBcnJheSA/IGluZm8uc2l6ZSA6IHVuZGVmaW5lZCwgLy8gdXNlZCB3aGVuIHVuaWZvcm0gaXMgYW4gYXJyYXlcbiAgICAgIH07XG4gICAgICB0aGlzLl91bmlmb3Jtcy5wdXNoKHVuaWZvcm0pO1xuICAgIH1cblxuICAgIHRoaXMuX2xpbmtlZCA9IHRydWU7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIGxldCBnbCA9IHRoaXMuX2RldmljZS5fZ2w7XG4gICAgZ2wuZGVsZXRlUHJvZ3JhbSh0aGlzLl9nbElEKTtcblxuICAgIHRoaXMuX2xpbmtlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2dsSUQgPSBudWxsO1xuICAgIHRoaXMuX2F0dHJpYnV0ZXMgPSBbXTtcbiAgICB0aGlzLl91bmlmb3JtcyA9IFtdO1xuICAgIHRoaXMuX3NhbXBsZXJzID0gW107XG4gIH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT1cbi8vIGludGVybmFsXG4vLyA9PT09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBfY3JlYXRlU2hhZGVyKGdsLCB0eXBlLCBzcmMpIHtcbiAgbGV0IHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0eXBlKTtcbiAgZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc3JjKTtcbiAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xuXG4gIHJldHVybiBzaGFkZXI7XG59Il0sInNvdXJjZVJvb3QiOiIvIn0=