
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/gfx/device.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _state = _interopRequireDefault(require("./state"));

var _enums = require("./enums");

var _texture2d = _interopRequireDefault(require("./texture-2d"));

var _textureCube = _interopRequireDefault(require("./texture-cube"));

var _type2uniformCommit2, _type2uniformArrayCom;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GL_INT = 5124;
var GL_FLOAT = 5126;
var GL_FLOAT_VEC2 = 35664;
var GL_FLOAT_VEC3 = 35665;
var GL_FLOAT_VEC4 = 35666;
var GL_INT_VEC2 = 35667;
var GL_INT_VEC3 = 35668;
var GL_INT_VEC4 = 35669;
var GL_BOOL = 35670;
var GL_BOOL_VEC2 = 35671;
var GL_BOOL_VEC3 = 35672;
var GL_BOOL_VEC4 = 35673;
var GL_FLOAT_MAT2 = 35674;
var GL_FLOAT_MAT3 = 35675;
var GL_FLOAT_MAT4 = 35676;
var GL_SAMPLER_2D = 35678;
var GL_SAMPLER_CUBE = 35680;
/**
 * _type2uniformCommit
 */

var _type2uniformCommit = (_type2uniformCommit2 = {}, _type2uniformCommit2[GL_INT] = function (gl, id, value) {
  gl.uniform1i(id, value);
}, _type2uniformCommit2[GL_FLOAT] = function (gl, id, value) {
  gl.uniform1f(id, value);
}, _type2uniformCommit2[GL_FLOAT_VEC2] = function (gl, id, value) {
  gl.uniform2fv(id, value);
}, _type2uniformCommit2[GL_FLOAT_VEC3] = function (gl, id, value) {
  gl.uniform3fv(id, value);
}, _type2uniformCommit2[GL_FLOAT_VEC4] = function (gl, id, value) {
  gl.uniform4fv(id, value);
}, _type2uniformCommit2[GL_INT_VEC2] = function (gl, id, value) {
  gl.uniform2iv(id, value);
}, _type2uniformCommit2[GL_INT_VEC3] = function (gl, id, value) {
  gl.uniform3iv(id, value);
}, _type2uniformCommit2[GL_INT_VEC4] = function (gl, id, value) {
  gl.uniform4iv(id, value);
}, _type2uniformCommit2[GL_BOOL] = function (gl, id, value) {
  gl.uniform1i(id, value);
}, _type2uniformCommit2[GL_BOOL_VEC2] = function (gl, id, value) {
  gl.uniform2iv(id, value);
}, _type2uniformCommit2[GL_BOOL_VEC3] = function (gl, id, value) {
  gl.uniform3iv(id, value);
}, _type2uniformCommit2[GL_BOOL_VEC4] = function (gl, id, value) {
  gl.uniform4iv(id, value);
}, _type2uniformCommit2[GL_FLOAT_MAT2] = function (gl, id, value) {
  gl.uniformMatrix2fv(id, false, value);
}, _type2uniformCommit2[GL_FLOAT_MAT3] = function (gl, id, value) {
  gl.uniformMatrix3fv(id, false, value);
}, _type2uniformCommit2[GL_FLOAT_MAT4] = function (gl, id, value) {
  gl.uniformMatrix4fv(id, false, value);
}, _type2uniformCommit2[GL_SAMPLER_2D] = function (gl, id, value) {
  gl.uniform1i(id, value);
}, _type2uniformCommit2[GL_SAMPLER_CUBE] = function (gl, id, value) {
  gl.uniform1i(id, value);
}, _type2uniformCommit2);
/**
 * _type2uniformArrayCommit
 */


var _type2uniformArrayCommit = (_type2uniformArrayCom = {}, _type2uniformArrayCom[GL_INT] = function (gl, id, value) {
  gl.uniform1iv(id, value);
}, _type2uniformArrayCom[GL_FLOAT] = function (gl, id, value) {
  gl.uniform1fv(id, value);
}, _type2uniformArrayCom[GL_FLOAT_VEC2] = function (gl, id, value) {
  gl.uniform2fv(id, value);
}, _type2uniformArrayCom[GL_FLOAT_VEC3] = function (gl, id, value) {
  gl.uniform3fv(id, value);
}, _type2uniformArrayCom[GL_FLOAT_VEC4] = function (gl, id, value) {
  gl.uniform4fv(id, value);
}, _type2uniformArrayCom[GL_INT_VEC2] = function (gl, id, value) {
  gl.uniform2iv(id, value);
}, _type2uniformArrayCom[GL_INT_VEC3] = function (gl, id, value) {
  gl.uniform3iv(id, value);
}, _type2uniformArrayCom[GL_INT_VEC4] = function (gl, id, value) {
  gl.uniform4iv(id, value);
}, _type2uniformArrayCom[GL_BOOL] = function (gl, id, value) {
  gl.uniform1iv(id, value);
}, _type2uniformArrayCom[GL_BOOL_VEC2] = function (gl, id, value) {
  gl.uniform2iv(id, value);
}, _type2uniformArrayCom[GL_BOOL_VEC3] = function (gl, id, value) {
  gl.uniform3iv(id, value);
}, _type2uniformArrayCom[GL_BOOL_VEC4] = function (gl, id, value) {
  gl.uniform4iv(id, value);
}, _type2uniformArrayCom[GL_FLOAT_MAT2] = function (gl, id, value) {
  gl.uniformMatrix2fv(id, false, value);
}, _type2uniformArrayCom[GL_FLOAT_MAT3] = function (gl, id, value) {
  gl.uniformMatrix3fv(id, false, value);
}, _type2uniformArrayCom[GL_FLOAT_MAT4] = function (gl, id, value) {
  gl.uniformMatrix4fv(id, false, value);
}, _type2uniformArrayCom[GL_SAMPLER_2D] = function (gl, id, value) {
  gl.uniform1iv(id, value);
}, _type2uniformArrayCom[GL_SAMPLER_CUBE] = function (gl, id, value) {
  gl.uniform1iv(id, value);
}, _type2uniformArrayCom);
/**
 * _commitBlendStates
 */


function _commitBlendStates(gl, cur, next) {
  // enable/disable blend
  if (cur.blend !== next.blend) {
    if (!next.blend) {
      gl.disable(gl.BLEND);
      return;
    }

    gl.enable(gl.BLEND);

    if (next.blendSrc === _enums.enums.BLEND_CONSTANT_COLOR || next.blendSrc === _enums.enums.BLEND_ONE_MINUS_CONSTANT_COLOR || next.blendDst === _enums.enums.BLEND_CONSTANT_COLOR || next.blendDst === _enums.enums.BLEND_ONE_MINUS_CONSTANT_COLOR) {
      gl.blendColor((next.blendColor >> 24) / 255, (next.blendColor >> 16 & 0xff) / 255, (next.blendColor >> 8 & 0xff) / 255, (next.blendColor & 0xff) / 255);
    }

    if (next.blendSep) {
      gl.blendFuncSeparate(next.blendSrc, next.blendDst, next.blendSrcAlpha, next.blendDstAlpha);
      gl.blendEquationSeparate(next.blendEq, next.blendAlphaEq);
    } else {
      gl.blendFunc(next.blendSrc, next.blendDst);
      gl.blendEquation(next.blendEq);
    }

    return;
  } // nothing to update


  if (next.blend === false) {
    return;
  } // blend-color


  if (cur.blendColor !== next.blendColor) {
    gl.blendColor((next.blendColor >> 24) / 255, (next.blendColor >> 16 & 0xff) / 255, (next.blendColor >> 8 & 0xff) / 255, (next.blendColor & 0xff) / 255);
  } // separate diff, reset all


  if (cur.blendSep !== next.blendSep) {
    if (next.blendSep) {
      gl.blendFuncSeparate(next.blendSrc, next.blendDst, next.blendSrcAlpha, next.blendDstAlpha);
      gl.blendEquationSeparate(next.blendEq, next.blendAlphaEq);
    } else {
      gl.blendFunc(next.blendSrc, next.blendDst);
      gl.blendEquation(next.blendEq);
    }

    return;
  }

  if (next.blendSep) {
    // blend-func-separate
    if (cur.blendSrc !== next.blendSrc || cur.blendDst !== next.blendDst || cur.blendSrcAlpha !== next.blendSrcAlpha || cur.blendDstAlpha !== next.blendDstAlpha) {
      gl.blendFuncSeparate(next.blendSrc, next.blendDst, next.blendSrcAlpha, next.blendDstAlpha);
    } // blend-equation-separate


    if (cur.blendEq !== next.blendEq || cur.blendAlphaEq !== next.blendAlphaEq) {
      gl.blendEquationSeparate(next.blendEq, next.blendAlphaEq);
    }
  } else {
    // blend-func
    if (cur.blendSrc !== next.blendSrc || cur.blendDst !== next.blendDst) {
      gl.blendFunc(next.blendSrc, next.blendDst);
    } // blend-equation


    if (cur.blendEq !== next.blendEq) {
      gl.blendEquation(next.blendEq);
    }
  }
}
/**
 * _commitDepthStates
 */


function _commitDepthStates(gl, cur, next) {
  // enable/disable depth-test
  if (cur.depthTest !== next.depthTest) {
    if (!next.depthTest) {
      gl.disable(gl.DEPTH_TEST);
      return;
    }

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(next.depthFunc);
    gl.depthMask(next.depthWrite);
    return;
  } // commit depth-write


  if (cur.depthWrite !== next.depthWrite) {
    gl.depthMask(next.depthWrite);
  } // check if depth-write enabled


  if (next.depthTest === false) {
    if (next.depthWrite) {
      next.depthTest = true;
      next.depthFunc = _enums.enums.DS_FUNC_ALWAYS;
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(next.depthFunc);
    }

    return;
  } // depth-func


  if (cur.depthFunc !== next.depthFunc) {
    gl.depthFunc(next.depthFunc);
  }
}
/**
 * _commitStencilStates
 */


function _commitStencilStates(gl, cur, next) {
  // inherit stencil states
  if (next.stencilTest === _enums.enums.STENCIL_INHERIT) {
    return;
  }

  if (next.stencilTest !== cur.stencilTest) {
    if (next.stencilTest === _enums.enums.STENCIL_DISABLE) {
      gl.disable(gl.STENCIL_TEST);
      return;
    }

    gl.enable(gl.STENCIL_TEST);

    if (next.stencilSep) {
      gl.stencilFuncSeparate(gl.FRONT, next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
      gl.stencilMaskSeparate(gl.FRONT, next.stencilWriteMaskFront);
      gl.stencilOpSeparate(gl.FRONT, next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
      gl.stencilFuncSeparate(gl.BACK, next.stencilFuncBack, next.stencilRefBack, next.stencilMaskBack);
      gl.stencilMaskSeparate(gl.BACK, next.stencilWriteMaskBack);
      gl.stencilOpSeparate(gl.BACK, next.stencilFailOpBack, next.stencilZFailOpBack, next.stencilZPassOpBack);
    } else {
      gl.stencilFunc(next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
      gl.stencilMask(next.stencilWriteMaskFront);
      gl.stencilOp(next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
    }

    return;
  } // fast return


  if (next.stencilTest === _enums.enums.STENCIL_DISABLE) {
    return;
  }

  if (cur.stencilSep !== next.stencilSep) {
    if (next.stencilSep) {
      gl.stencilFuncSeparate(gl.FRONT, next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
      gl.stencilMaskSeparate(gl.FRONT, next.stencilWriteMaskFront);
      gl.stencilOpSeparate(gl.FRONT, next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
      gl.stencilFuncSeparate(gl.BACK, next.stencilFuncBack, next.stencilRefBack, next.stencilMaskBack);
      gl.stencilMaskSeparate(gl.BACK, next.stencilWriteMaskBack);
      gl.stencilOpSeparate(gl.BACK, next.stencilFailOpBack, next.stencilZFailOpBack, next.stencilZPassOpBack);
    } else {
      gl.stencilFunc(next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
      gl.stencilMask(next.stencilWriteMaskFront);
      gl.stencilOp(next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
    }

    return;
  }

  if (next.stencilSep) {
    // front
    if (cur.stencilFuncFront !== next.stencilFuncFront || cur.stencilRefFront !== next.stencilRefFront || cur.stencilMaskFront !== next.stencilMaskFront) {
      gl.stencilFuncSeparate(gl.FRONT, next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
    }

    if (cur.stencilWriteMaskFront !== next.stencilWriteMaskFront) {
      gl.stencilMaskSeparate(gl.FRONT, next.stencilWriteMaskFront);
    }

    if (cur.stencilFailOpFront !== next.stencilFailOpFront || cur.stencilZFailOpFront !== next.stencilZFailOpFront || cur.stencilZPassOpFront !== next.stencilZPassOpFront) {
      gl.stencilOpSeparate(gl.FRONT, next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
    } // back


    if (cur.stencilFuncBack !== next.stencilFuncBack || cur.stencilRefBack !== next.stencilRefBack || cur.stencilMaskBack !== next.stencilMaskBack) {
      gl.stencilFuncSeparate(gl.BACK, next.stencilFuncBack, next.stencilRefBack, next.stencilMaskBack);
    }

    if (cur.stencilWriteMaskBack !== next.stencilWriteMaskBack) {
      gl.stencilMaskSeparate(gl.BACK, next.stencilWriteMaskBack);
    }

    if (cur.stencilFailOpBack !== next.stencilFailOpBack || cur.stencilZFailOpBack !== next.stencilZFailOpBack || cur.stencilZPassOpBack !== next.stencilZPassOpBack) {
      gl.stencilOpSeparate(gl.BACK, next.stencilFailOpBack, next.stencilZFailOpBack, next.stencilZPassOpBack);
    }
  } else {
    if (cur.stencilFuncFront !== next.stencilFuncFront || cur.stencilRefFront !== next.stencilRefFront || cur.stencilMaskFront !== next.stencilMaskFront) {
      gl.stencilFunc(next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
    }

    if (cur.stencilWriteMaskFront !== next.stencilWriteMaskFront) {
      gl.stencilMask(next.stencilWriteMaskFront);
    }

    if (cur.stencilFailOpFront !== next.stencilFailOpFront || cur.stencilZFailOpFront !== next.stencilZFailOpFront || cur.stencilZPassOpFront !== next.stencilZPassOpFront) {
      gl.stencilOp(next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
    }
  }
}
/**
 * _commitCullMode
 */


function _commitCullMode(gl, cur, next) {
  if (cur.cullMode === next.cullMode) {
    return;
  }

  if (next.cullMode === _enums.enums.CULL_NONE) {
    gl.disable(gl.CULL_FACE);
    return;
  }

  gl.enable(gl.CULL_FACE);
  gl.cullFace(next.cullMode);
}
/**
 * _commitVertexBuffers
 */


function _commitVertexBuffers(device, gl, cur, next) {
  var attrsDirty = false; // nothing changed for vertex buffer

  if (next.maxStream === -1) {
    return;
  }

  if (cur.maxStream !== next.maxStream) {
    attrsDirty = true;
  } else if (cur.program !== next.program) {
    attrsDirty = true;
  } else {
    for (var i = 0; i < next.maxStream + 1; ++i) {
      if (cur.vertexBuffers[i] !== next.vertexBuffers[i] || cur.vertexBufferOffsets[i] !== next.vertexBufferOffsets[i]) {
        attrsDirty = true;
        break;
      }
    }
  }

  if (attrsDirty) {
    for (var _i = 0; _i < device._caps.maxVertexAttribs; ++_i) {
      device._newAttributes[_i] = 0;
    }

    for (var _i2 = 0; _i2 < next.maxStream + 1; ++_i2) {
      var vb = next.vertexBuffers[_i2];
      var vbOffset = next.vertexBufferOffsets[_i2];

      if (!vb || vb._glID === -1) {
        continue;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, vb._glID);

      for (var j = 0; j < next.program._attributes.length; ++j) {
        var attr = next.program._attributes[j];

        var el = vb._format.element(attr.name);

        if (!el) {
          console.warn("Can not find vertex attribute: " + attr.name);
          continue;
        }

        if (device._enabledAttributes[attr.location] === 0) {
          gl.enableVertexAttribArray(attr.location);
          device._enabledAttributes[attr.location] = 1;
        }

        device._newAttributes[attr.location] = 1;
        gl.vertexAttribPointer(attr.location, el.num, el.type, el.normalize, el.stride, el.offset + vbOffset * el.stride);
      }
    } // disable unused attributes


    for (var _i3 = 0; _i3 < device._caps.maxVertexAttribs; ++_i3) {
      if (device._enabledAttributes[_i3] !== device._newAttributes[_i3]) {
        gl.disableVertexAttribArray(_i3);
        device._enabledAttributes[_i3] = 0;
      }
    }
  }
}
/**
 * _commitTextures
 */


function _commitTextures(gl, cur, next) {
  for (var i = 0; i < next.maxTextureSlot + 1; ++i) {
    if (cur.textureUnits[i] !== next.textureUnits[i]) {
      var texture = next.textureUnits[i];

      if (texture && texture._glID !== -1) {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(texture._target, texture._glID);
      }
    }
  }
}
/**
 * _attach
 */


function _attach(gl, location, attachment, face) {
  if (face === void 0) {
    face = 0;
  }

  if (attachment instanceof _texture2d["default"]) {
    gl.framebufferTexture2D(gl.FRAMEBUFFER, location, gl.TEXTURE_2D, attachment._glID, 0);
  } else if (attachment instanceof _textureCube["default"]) {
    gl.framebufferTexture2D(gl.FRAMEBUFFER, location, gl.TEXTURE_CUBE_MAP_POSITIVE_X + face, attachment._glID, 0);
  } else {
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, location, gl.RENDERBUFFER, attachment._glID);
  }
}

var Device = /*#__PURE__*/function () {
  /**
   * @param {HTMLElement} canvasEL
   * @param {object} opts
   */
  function Device(canvasEL, opts) {
    var gl; // default options

    opts = opts || {};

    if (opts.alpha === undefined) {
      opts.alpha = false;
    }

    if (opts.stencil === undefined) {
      opts.stencil = true;
    }

    if (opts.depth === undefined) {
      opts.depth = true;
    }

    if (opts.antialias === undefined) {
      opts.antialias = false;
    } // NOTE: it is said the performance improved in mobile device with this flag off.


    if (opts.preserveDrawingBuffer === undefined) {
      opts.preserveDrawingBuffer = false;
    }

    try {
      gl = canvasEL.getContext('webgl', opts) || canvasEL.getContext('experimental-webgl', opts) || canvasEL.getContext('webkit-3d', opts) || canvasEL.getContext('moz-webgl', opts);
    } catch (err) {
      console.error(err);
      return;
    } // No errors are thrown using try catch
    // Tested through ios baidu browser 4.14.1


    if (!gl) {
      console.error('This device does not support webgl');
    } // statics

    /**
     * @type {WebGLRenderingContext}
     */


    this._gl = gl;
    this._extensions = {};
    this._caps = {}; // capability

    this._stats = {
      texture: 0,
      vb: 0,
      ib: 0,
      drawcalls: 0
    }; // https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Using_Extensions

    this._initExtensions(['EXT_texture_filter_anisotropic', 'EXT_shader_texture_lod', 'OES_standard_derivatives', 'OES_texture_float', 'OES_texture_float_linear', 'OES_texture_half_float', 'OES_texture_half_float_linear', 'OES_vertex_array_object', 'WEBGL_compressed_texture_atc', 'WEBGL_compressed_texture_etc', 'WEBGL_compressed_texture_etc1', 'WEBGL_compressed_texture_pvrtc', 'WEBGL_compressed_texture_s3tc', 'WEBGL_depth_texture', 'WEBGL_draw_buffers']);

    this._initCaps();

    this._initStates(); // runtime


    _state["default"].initDefault(this);

    this._current = new _state["default"](this);
    this._next = new _state["default"](this);
    this._uniforms = {}; // name: { value, num, dirty }

    this._vx = this._vy = this._vw = this._vh = 0;
    this._sx = this._sy = this._sw = this._sh = 0;
    this._framebuffer = null; //

    this._enabledAttributes = new Array(this._caps.maxVertexAttribs);
    this._newAttributes = new Array(this._caps.maxVertexAttribs);

    for (var i = 0; i < this._caps.maxVertexAttribs; ++i) {
      this._enabledAttributes[i] = 0;
      this._newAttributes[i] = 0;
    }
  }

  var _proto = Device.prototype;

  _proto._initExtensions = function _initExtensions(extensions) {
    var gl = this._gl;

    for (var i = 0; i < extensions.length; ++i) {
      var name = extensions[i];
      var vendorPrefixes = ["", "WEBKIT_", "MOZ_"];

      for (var j = 0; j < vendorPrefixes.length; j++) {
        try {
          var ext = gl.getExtension(vendorPrefixes[j] + name);

          if (ext) {
            this._extensions[name] = ext;
            break;
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  _proto._initCaps = function _initCaps() {
    var gl = this._gl;
    var extDrawBuffers = this.ext('WEBGL_draw_buffers');
    this._caps.maxVertexStreams = 4;
    this._caps.maxVertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
    this._caps.maxFragUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
    this._caps.maxTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    this._caps.maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    this._caps.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    this._caps.maxDrawBuffers = extDrawBuffers ? gl.getParameter(extDrawBuffers.MAX_DRAW_BUFFERS_WEBGL) : 1;
    this._caps.maxColorAttachments = extDrawBuffers ? gl.getParameter(extDrawBuffers.MAX_COLOR_ATTACHMENTS_WEBGL) : 1;
  };

  _proto._initStates = function _initStates() {
    var gl = this._gl; // gl.frontFace(gl.CCW);

    gl.disable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ZERO);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendColor(1, 1, 1, 1);
    gl.colorMask(true, true, true, true);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.disable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    gl.depthMask(false);
    gl.disable(gl.POLYGON_OFFSET_FILL);
    gl.depthRange(0, 1);
    gl.disable(gl.STENCIL_TEST);
    gl.stencilFunc(gl.ALWAYS, 0, 0xFF);
    gl.stencilMask(0xFF);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP); // TODO:
    // this.setAlphaToCoverage(false);
    // this.setTransformFeedbackBuffer(null);
    // this.setRaster(true);
    // this.setDepthBias(false);

    gl.clearDepth(1);
    gl.clearColor(0, 0, 0, 0);
    gl.clearStencil(0);
    gl.disable(gl.SCISSOR_TEST);
  };

  _proto._restoreTexture = function _restoreTexture(unit) {
    var gl = this._gl;
    var texture = this._current.textureUnits[unit];

    if (texture && texture._glID !== -1) {
      gl.bindTexture(texture._target, texture._glID);
    } else {
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
  };

  _proto._restoreIndexBuffer = function _restoreIndexBuffer() {
    var gl = this._gl;
    var ib = this._current.indexBuffer;

    if (ib && ib._glID !== -1) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib._glID);
    } else {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
  }
  /**
   * @method ext
   * @param {string} name
   */
  ;

  _proto.ext = function ext(name) {
    return this._extensions[name];
  };

  _proto.allowFloatTexture = function allowFloatTexture() {
    return this.ext("OES_texture_float") != null;
  } // ===============================
  // Immediate Settings
  // ===============================

  /**
   * @method setFrameBuffer
   * @param {FrameBuffer} fb - null means use the backbuffer
   */
  ;

  _proto.setFrameBuffer = function setFrameBuffer(fb) {
    if (this._framebuffer === fb) {
      return;
    }

    this._framebuffer = fb;
    var gl = this._gl;

    if (!fb) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return;
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb._glID);
    var numColors = fb._colors.length;

    for (var i = 0; i < numColors; ++i) {
      var colorBuffer = fb._colors[i];

      _attach(gl, gl.COLOR_ATTACHMENT0 + i, colorBuffer); // TODO: what about cubemap face??? should be the target parameter for colorBuffer

    }

    for (var _i4 = numColors; _i4 < this._caps.maxColorAttachments; ++_i4) {
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + _i4, gl.TEXTURE_2D, null, 0);
    }

    if (fb._depth) {
      _attach(gl, gl.DEPTH_ATTACHMENT, fb._depth);
    }

    if (fb._stencil) {
      _attach(gl, gl.STENCIL_ATTACHMENT, fb._stencil);
    }

    if (fb._depthStencil) {
      _attach(gl, gl.DEPTH_STENCIL_ATTACHMENT, fb._depthStencil);
    }
  }
  /**
   * @method setViewport
   * @param {Number} x
   * @param {Number} y
   * @param {Number} w
   * @param {Number} h
   */
  ;

  _proto.setViewport = function setViewport(x, y, w, h) {
    if (this._vx !== x || this._vy !== y || this._vw !== w || this._vh !== h) {
      this._gl.viewport(x, y, w, h);

      this._vx = x;
      this._vy = y;
      this._vw = w;
      this._vh = h;
    }
  }
  /**
   * @method setScissor
   * @param {Number} x
   * @param {Number} y
   * @param {Number} w
   * @param {Number} h
   */
  ;

  _proto.setScissor = function setScissor(x, y, w, h) {
    if (this._sx !== x || this._sy !== y || this._sw !== w || this._sh !== h) {
      this._gl.scissor(x, y, w, h);

      this._sx = x;
      this._sy = y;
      this._sw = w;
      this._sh = h;
    }
  }
  /**
   * @method clear
   * @param {Object} opts
   * @param {Array} opts.color
   * @param {Number} opts.depth
   * @param {Number} opts.stencil
   */
  ;

  _proto.clear = function clear(opts) {
    if (opts.color === undefined && opts.depth === undefined && opts.stencil === undefined) {
      return;
    }

    var gl = this._gl;
    var flags = 0;

    if (opts.color !== undefined) {
      flags |= gl.COLOR_BUFFER_BIT;
      gl.clearColor(opts.color[0], opts.color[1], opts.color[2], opts.color[3]);
    }

    if (opts.depth !== undefined) {
      flags |= gl.DEPTH_BUFFER_BIT;
      gl.clearDepth(opts.depth);
      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(true);
      gl.depthFunc(gl.ALWAYS);
    }

    if (opts.stencil !== undefined) {
      flags |= gl.STENCIL_BUFFER_BIT;
      gl.clearStencil(opts.stencil);
    }

    gl.clear(flags); // restore depth-write

    if (opts.depth !== undefined) {
      if (this._current.depthTest === false) {
        gl.disable(gl.DEPTH_TEST);
      } else {
        if (this._current.depthWrite === false) {
          gl.depthMask(false);
        }

        if (this._current.depthFunc !== _enums.enums.DS_FUNC_ALWAYS) {
          gl.depthFunc(this._current.depthFunc);
        }
      }
    }
  } // ===============================
  // Deferred States
  // ===============================

  /**
   * @method enableBlend
   */
  ;

  _proto.enableBlend = function enableBlend() {
    this._next.blend = true;
  }
  /**
   * @method enableDepthTest
   */
  ;

  _proto.enableDepthTest = function enableDepthTest() {
    this._next.depthTest = true;
  }
  /**
   * @method enableDepthWrite
   */
  ;

  _proto.enableDepthWrite = function enableDepthWrite() {
    this._next.depthWrite = true;
  }
  /**
   * @method enableStencilTest
   * @param {Number} stencilTest
   */
  ;

  _proto.setStencilTest = function setStencilTest(stencilTest) {
    this._next.stencilTest = stencilTest;
  }
  /**
   * @method setStencilFunc
   * @param {DS_FUNC_*} func
   * @param {Number} ref
   * @param {Number} mask
   */
  ;

  _proto.setStencilFunc = function setStencilFunc(func, ref, mask) {
    this._next.stencilSep = false;
    this._next.stencilFuncFront = this._next.stencilFuncBack = func;
    this._next.stencilRefFront = this._next.stencilRefBack = ref;
    this._next.stencilMaskFront = this._next.stencilMaskBack = mask;
  }
  /**
   * @method setStencilFuncFront
   * @param {DS_FUNC_*} func
   * @param {Number} ref
   * @param {Number} mask
   */
  ;

  _proto.setStencilFuncFront = function setStencilFuncFront(func, ref, mask) {
    this._next.stencilSep = true;
    this._next.stencilFuncFront = func;
    this._next.stencilRefFront = ref;
    this._next.stencilMaskFront = mask;
  }
  /**
   * @method setStencilFuncBack
   * @param {DS_FUNC_*} func
   * @param {Number} ref
   * @param {Number} mask
   */
  ;

  _proto.setStencilFuncBack = function setStencilFuncBack(func, ref, mask) {
    this._next.stencilSep = true;
    this._next.stencilFuncBack = func;
    this._next.stencilRefBack = ref;
    this._next.stencilMaskBack = mask;
  }
  /**
   * @method setStencilOp
   * @param {STENCIL_OP_*} failOp
   * @param {STENCIL_OP_*} zFailOp
   * @param {STENCIL_OP_*} zPassOp
   * @param {Number} writeMask
   */
  ;

  _proto.setStencilOp = function setStencilOp(failOp, zFailOp, zPassOp, writeMask) {
    this._next.stencilFailOpFront = this._next.stencilFailOpBack = failOp;
    this._next.stencilZFailOpFront = this._next.stencilZFailOpBack = zFailOp;
    this._next.stencilZPassOpFront = this._next.stencilZPassOpBack = zPassOp;
    this._next.stencilWriteMaskFront = this._next.stencilWriteMaskBack = writeMask;
  }
  /**
   * @method setStencilOpFront
   * @param {STENCIL_OP_*} failOp
   * @param {STENCIL_OP_*} zFailOp
   * @param {STENCIL_OP_*} zPassOp
   * @param {Number} writeMask
   */
  ;

  _proto.setStencilOpFront = function setStencilOpFront(failOp, zFailOp, zPassOp, writeMask) {
    this._next.stencilSep = true;
    this._next.stencilFailOpFront = failOp;
    this._next.stencilZFailOpFront = zFailOp;
    this._next.stencilZPassOpFront = zPassOp;
    this._next.stencilWriteMaskFront = writeMask;
  }
  /**
   * @method setStencilOpBack
   * @param {STENCIL_OP_*} failOp
   * @param {STENCIL_OP_*} zFailOp
   * @param {STENCIL_OP_*} zPassOp
   * @param {Number} writeMask
   */
  ;

  _proto.setStencilOpBack = function setStencilOpBack(failOp, zFailOp, zPassOp, writeMask) {
    this._next.stencilSep = true;
    this._next.stencilFailOpBack = failOp;
    this._next.stencilZFailOpBack = zFailOp;
    this._next.stencilZPassOpBack = zPassOp;
    this._next.stencilWriteMaskBack = writeMask;
  }
  /**
   * @method setDepthFunc
   * @param {DS_FUNC_*} depthFunc
   */
  ;

  _proto.setDepthFunc = function setDepthFunc(depthFunc) {
    this._next.depthFunc = depthFunc;
  }
  /**
   * @method setBlendColor32
   * @param {Number} rgba
   */
  ;

  _proto.setBlendColor32 = function setBlendColor32(rgba) {
    this._next.blendColor = rgba;
  }
  /**
   * @method setBlendColor
   * @param {Number} r
   * @param {Number} g
   * @param {Number} b
   * @param {Number} a
   */
  ;

  _proto.setBlendColor = function setBlendColor(r, g, b, a) {
    this._next.blendColor = (r * 255 << 24 | g * 255 << 16 | b * 255 << 8 | a * 255) >>> 0;
  }
  /**
   * @method setBlendFunc
   * @param {BELND_*} src
   * @param {BELND_*} dst
   */
  ;

  _proto.setBlendFunc = function setBlendFunc(src, dst) {
    this._next.blendSep = false;
    this._next.blendSrc = src;
    this._next.blendDst = dst;
  }
  /**
   * @method setBlendFuncSep
   * @param {BELND_*} src
   * @param {BELND_*} dst
   * @param {BELND_*} srcAlpha
   * @param {BELND_*} dstAlpha
   */
  ;

  _proto.setBlendFuncSep = function setBlendFuncSep(src, dst, srcAlpha, dstAlpha) {
    this._next.blendSep = true;
    this._next.blendSrc = src;
    this._next.blendDst = dst;
    this._next.blendSrcAlpha = srcAlpha;
    this._next.blendDstAlpha = dstAlpha;
  }
  /**
   * @method setBlendEq
   * @param {BELND_FUNC_*} eq
   */
  ;

  _proto.setBlendEq = function setBlendEq(eq) {
    this._next.blendSep = false;
    this._next.blendEq = eq;
  }
  /**
   * @method setBlendEqSep
   * @param {BELND_FUNC_*} eq
   * @param {BELND_FUNC_*} alphaEq
   */
  ;

  _proto.setBlendEqSep = function setBlendEqSep(eq, alphaEq) {
    this._next.blendSep = true;
    this._next.blendEq = eq;
    this._next.blendAlphaEq = alphaEq;
  }
  /**
   * @method setCullMode
   * @param {CULL_*} mode
   */
  ;

  _proto.setCullMode = function setCullMode(mode) {
    this._next.cullMode = mode;
  }
  /**
   * @method setVertexBuffer
   * @param {Number} stream
   * @param {VertexBuffer} buffer
   * @param {Number} start - start vertex
   */
  ;

  _proto.setVertexBuffer = function setVertexBuffer(stream, buffer, start) {
    if (start === void 0) {
      start = 0;
    }

    this._next.vertexBuffers[stream] = buffer;
    this._next.vertexBufferOffsets[stream] = start;

    if (this._next.maxStream < stream) {
      this._next.maxStream = stream;
    }
  }
  /**
   * @method setIndexBuffer
   * @param {IndexBuffer} buffer
   */
  ;

  _proto.setIndexBuffer = function setIndexBuffer(buffer) {
    this._next.indexBuffer = buffer;
  }
  /**
   * @method setProgram
   * @param {Program} program
   */
  ;

  _proto.setProgram = function setProgram(program) {
    this._next.program = program;
  }
  /**
   * @method setTexture
   * @param {String} name
   * @param {Texture} texture
   * @param {Number} slot
   */
  ;

  _proto.setTexture = function setTexture(name, texture, slot) {
    if (slot >= this._caps.maxTextureUnits) {
      console.warn("Can not set texture " + name + " at stage " + slot + ", max texture exceed: " + this._caps.maxTextureUnits);
      return;
    }

    this._next.textureUnits[slot] = texture;
    this.setUniform(name, slot);

    if (this._next.maxTextureSlot < slot) {
      this._next.maxTextureSlot = slot;
    }
  }
  /**
   * @method setTextureArray
   * @param {String} name
   * @param {Array} textures
   * @param {Int32Array} slots
   */
  ;

  _proto.setTextureArray = function setTextureArray(name, textures, slots) {
    var len = textures.length;

    if (len >= this._caps.maxTextureUnits) {
      console.warn("Can not set " + len + " textures for " + name + ", max texture exceed: " + this._caps.maxTextureUnits);
      return;
    }

    for (var i = 0; i < len; ++i) {
      var slot = slots[i];
      this._next.textureUnits[slot] = textures[i];

      if (this._next.maxTextureSlot < slot) {
        this._next.maxTextureSlot = slot;
      }
    }

    this.setUniform(name, slots);
  }
  /**
   * @method setUniform
   * @param {String} name
   * @param {*} value
   */
  ;

  _proto.setUniform = function setUniform(name, value) {
    var uniform = this._uniforms[name];
    var sameType = false;
    var isArray = false,
        isFloat32Array = false,
        isInt32Array = false;

    do {
      if (!uniform) {
        break;
      }

      isFloat32Array = Array.isArray(value) || value instanceof Float32Array;
      isInt32Array = value instanceof Int32Array;
      isArray = isFloat32Array || isInt32Array;

      if (uniform.isArray !== isArray) {
        break;
      }

      if (uniform.isArray && uniform.value.length !== value.length) {
        break;
      }

      sameType = true;
    } while (false);

    if (!sameType) {
      var newValue = value;

      if (isFloat32Array) {
        newValue = new Float32Array(value);
      } else if (isInt32Array) {
        newValue = new Int32Array(value);
      }

      uniform = {
        dirty: true,
        value: newValue,
        isArray: isArray
      };
    } else {
      var oldValue = uniform.value;
      var dirty = false;

      if (uniform.isArray) {
        for (var i = 0, l = oldValue.length; i < l; i++) {
          if (oldValue[i] !== value[i]) {
            dirty = true;
            oldValue[i] = value[i];
          }
        }
      } else {
        if (oldValue !== value) {
          dirty = true;
          uniform.value = value;
        }
      }

      if (dirty) {
        uniform.dirty = true;
      }
    }

    this._uniforms[name] = uniform;
  };

  _proto.setUniformDirectly = function setUniformDirectly(name, value) {
    var uniform = this._uniforms[name];

    if (!uniform) {
      this._uniforms[name] = uniform = {};
    }

    uniform.dirty = true;
    uniform.value = value;
  }
  /**
   * @method setPrimitiveType
   * @param {PT_*} type
   */
  ;

  _proto.setPrimitiveType = function setPrimitiveType(type) {
    this._next.primitiveType = type;
  }
  /**
   * @method resetDrawCalls
   */
  ;

  _proto.resetDrawCalls = function resetDrawCalls() {
    this._stats.drawcalls = 0;
  }
  /**
   * @method getDrawCalls
   */
  ;

  _proto.getDrawCalls = function getDrawCalls() {
    return this._stats.drawcalls;
  }
  /**
   * @method draw
   * @param {Number} base
   * @param {Number} count
   */
  ;

  _proto.draw = function draw(base, count) {
    var gl = this._gl;
    var cur = this._current;
    var next = this._next; // commit blend

    _commitBlendStates(gl, cur, next); // commit depth


    _commitDepthStates(gl, cur, next); // commit stencil


    _commitStencilStates(gl, cur, next); // commit cull


    _commitCullMode(gl, cur, next); // commit vertex-buffer


    _commitVertexBuffers(this, gl, cur, next); // commit index-buffer


    if (cur.indexBuffer !== next.indexBuffer) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, next.indexBuffer && next.indexBuffer._glID !== -1 ? next.indexBuffer._glID : null);
    } // commit program


    var programDirty = false;

    if (cur.program !== next.program) {
      if (next.program._linked) {
        gl.useProgram(next.program._glID);
      } else {
        console.warn('Failed to use program: has not linked yet.');
      }

      programDirty = true;
    } // commit texture/sampler


    _commitTextures(gl, cur, next); // commit uniforms


    for (var i = 0; i < next.program._uniforms.length; ++i) {
      var uniformInfo = next.program._uniforms[i];
      var uniform = this._uniforms[uniformInfo.name];

      if (!uniform) {
        // console.warn(`Can not find uniform ${uniformInfo.name}`);
        continue;
      }

      if (!programDirty && !uniform.dirty) {
        continue;
      }

      uniform.dirty = false; // TODO: please consider array uniform: uniformInfo.size > 0

      var commitFunc = uniformInfo.size === undefined ? _type2uniformCommit[uniformInfo.type] : _type2uniformArrayCommit[uniformInfo.type];

      if (!commitFunc) {
        console.warn("Can not find commit function for uniform " + uniformInfo.name);
        continue;
      }

      commitFunc(gl, uniformInfo.location, uniform.value);
    }

    if (count) {
      // drawPrimitives
      if (next.indexBuffer) {
        gl.drawElements(this._next.primitiveType, count, next.indexBuffer._format, base * next.indexBuffer._bytesPerIndex);
      } else {
        gl.drawArrays(this._next.primitiveType, base, count);
      } // update stats


      this._stats.drawcalls++;
    } // TODO: autogen mipmap for color buffer
    // if (this._framebuffer && this._framebuffer.colors[0].mipmap) {
    //   gl.bindTexture(this._framebuffer.colors[i]._target, colors[i]._glID);
    //   gl.generateMipmap(this._framebuffer.colors[i]._target);
    // }
    // reset states


    cur.set(next);
    next.reset();
  };

  _createClass(Device, [{
    key: "caps",
    get:
    /**
     * @property caps
     */
    function get() {
      return this._caps;
    }
  }]);

  return Device;
}();

exports["default"] = Device;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9yZW5kZXJlci9nZngvZGV2aWNlLmpzIl0sIm5hbWVzIjpbIkdMX0lOVCIsIkdMX0ZMT0FUIiwiR0xfRkxPQVRfVkVDMiIsIkdMX0ZMT0FUX1ZFQzMiLCJHTF9GTE9BVF9WRUM0IiwiR0xfSU5UX1ZFQzIiLCJHTF9JTlRfVkVDMyIsIkdMX0lOVF9WRUM0IiwiR0xfQk9PTCIsIkdMX0JPT0xfVkVDMiIsIkdMX0JPT0xfVkVDMyIsIkdMX0JPT0xfVkVDNCIsIkdMX0ZMT0FUX01BVDIiLCJHTF9GTE9BVF9NQVQzIiwiR0xfRkxPQVRfTUFUNCIsIkdMX1NBTVBMRVJfMkQiLCJHTF9TQU1QTEVSX0NVQkUiLCJfdHlwZTJ1bmlmb3JtQ29tbWl0IiwiZ2wiLCJpZCIsInZhbHVlIiwidW5pZm9ybTFpIiwidW5pZm9ybTFmIiwidW5pZm9ybTJmdiIsInVuaWZvcm0zZnYiLCJ1bmlmb3JtNGZ2IiwidW5pZm9ybTJpdiIsInVuaWZvcm0zaXYiLCJ1bmlmb3JtNGl2IiwidW5pZm9ybU1hdHJpeDJmdiIsInVuaWZvcm1NYXRyaXgzZnYiLCJ1bmlmb3JtTWF0cml4NGZ2IiwiX3R5cGUydW5pZm9ybUFycmF5Q29tbWl0IiwidW5pZm9ybTFpdiIsInVuaWZvcm0xZnYiLCJfY29tbWl0QmxlbmRTdGF0ZXMiLCJjdXIiLCJuZXh0IiwiYmxlbmQiLCJkaXNhYmxlIiwiQkxFTkQiLCJlbmFibGUiLCJibGVuZFNyYyIsImVudW1zIiwiQkxFTkRfQ09OU1RBTlRfQ09MT1IiLCJCTEVORF9PTkVfTUlOVVNfQ09OU1RBTlRfQ09MT1IiLCJibGVuZERzdCIsImJsZW5kQ29sb3IiLCJibGVuZFNlcCIsImJsZW5kRnVuY1NlcGFyYXRlIiwiYmxlbmRTcmNBbHBoYSIsImJsZW5kRHN0QWxwaGEiLCJibGVuZEVxdWF0aW9uU2VwYXJhdGUiLCJibGVuZEVxIiwiYmxlbmRBbHBoYUVxIiwiYmxlbmRGdW5jIiwiYmxlbmRFcXVhdGlvbiIsIl9jb21taXREZXB0aFN0YXRlcyIsImRlcHRoVGVzdCIsIkRFUFRIX1RFU1QiLCJkZXB0aEZ1bmMiLCJkZXB0aE1hc2siLCJkZXB0aFdyaXRlIiwiRFNfRlVOQ19BTFdBWVMiLCJfY29tbWl0U3RlbmNpbFN0YXRlcyIsInN0ZW5jaWxUZXN0IiwiU1RFTkNJTF9JTkhFUklUIiwiU1RFTkNJTF9ESVNBQkxFIiwiU1RFTkNJTF9URVNUIiwic3RlbmNpbFNlcCIsInN0ZW5jaWxGdW5jU2VwYXJhdGUiLCJGUk9OVCIsInN0ZW5jaWxGdW5jRnJvbnQiLCJzdGVuY2lsUmVmRnJvbnQiLCJzdGVuY2lsTWFza0Zyb250Iiwic3RlbmNpbE1hc2tTZXBhcmF0ZSIsInN0ZW5jaWxXcml0ZU1hc2tGcm9udCIsInN0ZW5jaWxPcFNlcGFyYXRlIiwic3RlbmNpbEZhaWxPcEZyb250Iiwic3RlbmNpbFpGYWlsT3BGcm9udCIsInN0ZW5jaWxaUGFzc09wRnJvbnQiLCJCQUNLIiwic3RlbmNpbEZ1bmNCYWNrIiwic3RlbmNpbFJlZkJhY2siLCJzdGVuY2lsTWFza0JhY2siLCJzdGVuY2lsV3JpdGVNYXNrQmFjayIsInN0ZW5jaWxGYWlsT3BCYWNrIiwic3RlbmNpbFpGYWlsT3BCYWNrIiwic3RlbmNpbFpQYXNzT3BCYWNrIiwic3RlbmNpbEZ1bmMiLCJzdGVuY2lsTWFzayIsInN0ZW5jaWxPcCIsIl9jb21taXRDdWxsTW9kZSIsImN1bGxNb2RlIiwiQ1VMTF9OT05FIiwiQ1VMTF9GQUNFIiwiY3VsbEZhY2UiLCJfY29tbWl0VmVydGV4QnVmZmVycyIsImRldmljZSIsImF0dHJzRGlydHkiLCJtYXhTdHJlYW0iLCJwcm9ncmFtIiwiaSIsInZlcnRleEJ1ZmZlcnMiLCJ2ZXJ0ZXhCdWZmZXJPZmZzZXRzIiwiX2NhcHMiLCJtYXhWZXJ0ZXhBdHRyaWJzIiwiX25ld0F0dHJpYnV0ZXMiLCJ2YiIsInZiT2Zmc2V0IiwiX2dsSUQiLCJiaW5kQnVmZmVyIiwiQVJSQVlfQlVGRkVSIiwiaiIsIl9hdHRyaWJ1dGVzIiwibGVuZ3RoIiwiYXR0ciIsImVsIiwiX2Zvcm1hdCIsImVsZW1lbnQiLCJuYW1lIiwiY29uc29sZSIsIndhcm4iLCJfZW5hYmxlZEF0dHJpYnV0ZXMiLCJsb2NhdGlvbiIsImVuYWJsZVZlcnRleEF0dHJpYkFycmF5IiwidmVydGV4QXR0cmliUG9pbnRlciIsIm51bSIsInR5cGUiLCJub3JtYWxpemUiLCJzdHJpZGUiLCJvZmZzZXQiLCJkaXNhYmxlVmVydGV4QXR0cmliQXJyYXkiLCJfY29tbWl0VGV4dHVyZXMiLCJtYXhUZXh0dXJlU2xvdCIsInRleHR1cmVVbml0cyIsInRleHR1cmUiLCJhY3RpdmVUZXh0dXJlIiwiVEVYVFVSRTAiLCJiaW5kVGV4dHVyZSIsIl90YXJnZXQiLCJfYXR0YWNoIiwiYXR0YWNobWVudCIsImZhY2UiLCJUZXh0dXJlMkQiLCJmcmFtZWJ1ZmZlclRleHR1cmUyRCIsIkZSQU1FQlVGRkVSIiwiVEVYVFVSRV8yRCIsIlRleHR1cmVDdWJlIiwiVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YIiwiZnJhbWVidWZmZXJSZW5kZXJidWZmZXIiLCJSRU5ERVJCVUZGRVIiLCJEZXZpY2UiLCJjYW52YXNFTCIsIm9wdHMiLCJhbHBoYSIsInVuZGVmaW5lZCIsInN0ZW5jaWwiLCJkZXB0aCIsImFudGlhbGlhcyIsInByZXNlcnZlRHJhd2luZ0J1ZmZlciIsImdldENvbnRleHQiLCJlcnIiLCJlcnJvciIsIl9nbCIsIl9leHRlbnNpb25zIiwiX3N0YXRzIiwiaWIiLCJkcmF3Y2FsbHMiLCJfaW5pdEV4dGVuc2lvbnMiLCJfaW5pdENhcHMiLCJfaW5pdFN0YXRlcyIsIlN0YXRlIiwiaW5pdERlZmF1bHQiLCJfY3VycmVudCIsIl9uZXh0IiwiX3VuaWZvcm1zIiwiX3Z4IiwiX3Z5IiwiX3Z3IiwiX3ZoIiwiX3N4IiwiX3N5IiwiX3N3IiwiX3NoIiwiX2ZyYW1lYnVmZmVyIiwiQXJyYXkiLCJleHRlbnNpb25zIiwidmVuZG9yUHJlZml4ZXMiLCJleHQiLCJnZXRFeHRlbnNpb24iLCJlIiwiZXh0RHJhd0J1ZmZlcnMiLCJtYXhWZXJ0ZXhTdHJlYW1zIiwibWF4VmVydGV4VGV4dHVyZXMiLCJnZXRQYXJhbWV0ZXIiLCJNQVhfVkVSVEVYX1RFWFRVUkVfSU1BR0VfVU5JVFMiLCJtYXhGcmFnVW5pZm9ybXMiLCJNQVhfRlJBR01FTlRfVU5JRk9STV9WRUNUT1JTIiwibWF4VGV4dHVyZVVuaXRzIiwiTUFYX1RFWFRVUkVfSU1BR0VfVU5JVFMiLCJNQVhfVkVSVEVYX0FUVFJJQlMiLCJtYXhUZXh0dXJlU2l6ZSIsIk1BWF9URVhUVVJFX1NJWkUiLCJtYXhEcmF3QnVmZmVycyIsIk1BWF9EUkFXX0JVRkZFUlNfV0VCR0wiLCJtYXhDb2xvckF0dGFjaG1lbnRzIiwiTUFYX0NPTE9SX0FUVEFDSE1FTlRTX1dFQkdMIiwiT05FIiwiWkVSTyIsIkZVTkNfQUREIiwiY29sb3JNYXNrIiwiTEVTUyIsIlBPTFlHT05fT0ZGU0VUX0ZJTEwiLCJkZXB0aFJhbmdlIiwiQUxXQVlTIiwiS0VFUCIsImNsZWFyRGVwdGgiLCJjbGVhckNvbG9yIiwiY2xlYXJTdGVuY2lsIiwiU0NJU1NPUl9URVNUIiwiX3Jlc3RvcmVUZXh0dXJlIiwidW5pdCIsIl9yZXN0b3JlSW5kZXhCdWZmZXIiLCJpbmRleEJ1ZmZlciIsIkVMRU1FTlRfQVJSQVlfQlVGRkVSIiwiYWxsb3dGbG9hdFRleHR1cmUiLCJzZXRGcmFtZUJ1ZmZlciIsImZiIiwiYmluZEZyYW1lYnVmZmVyIiwibnVtQ29sb3JzIiwiX2NvbG9ycyIsImNvbG9yQnVmZmVyIiwiQ09MT1JfQVRUQUNITUVOVDAiLCJfZGVwdGgiLCJERVBUSF9BVFRBQ0hNRU5UIiwiX3N0ZW5jaWwiLCJTVEVOQ0lMX0FUVEFDSE1FTlQiLCJfZGVwdGhTdGVuY2lsIiwiREVQVEhfU1RFTkNJTF9BVFRBQ0hNRU5UIiwic2V0Vmlld3BvcnQiLCJ4IiwieSIsInciLCJoIiwidmlld3BvcnQiLCJzZXRTY2lzc29yIiwic2Npc3NvciIsImNsZWFyIiwiY29sb3IiLCJmbGFncyIsIkNPTE9SX0JVRkZFUl9CSVQiLCJERVBUSF9CVUZGRVJfQklUIiwiU1RFTkNJTF9CVUZGRVJfQklUIiwiZW5hYmxlQmxlbmQiLCJlbmFibGVEZXB0aFRlc3QiLCJlbmFibGVEZXB0aFdyaXRlIiwic2V0U3RlbmNpbFRlc3QiLCJzZXRTdGVuY2lsRnVuYyIsImZ1bmMiLCJyZWYiLCJtYXNrIiwic2V0U3RlbmNpbEZ1bmNGcm9udCIsInNldFN0ZW5jaWxGdW5jQmFjayIsInNldFN0ZW5jaWxPcCIsImZhaWxPcCIsInpGYWlsT3AiLCJ6UGFzc09wIiwid3JpdGVNYXNrIiwic2V0U3RlbmNpbE9wRnJvbnQiLCJzZXRTdGVuY2lsT3BCYWNrIiwic2V0RGVwdGhGdW5jIiwic2V0QmxlbmRDb2xvcjMyIiwicmdiYSIsInNldEJsZW5kQ29sb3IiLCJyIiwiZyIsImIiLCJhIiwic2V0QmxlbmRGdW5jIiwic3JjIiwiZHN0Iiwic2V0QmxlbmRGdW5jU2VwIiwic3JjQWxwaGEiLCJkc3RBbHBoYSIsInNldEJsZW5kRXEiLCJlcSIsInNldEJsZW5kRXFTZXAiLCJhbHBoYUVxIiwic2V0Q3VsbE1vZGUiLCJtb2RlIiwic2V0VmVydGV4QnVmZmVyIiwic3RyZWFtIiwiYnVmZmVyIiwic3RhcnQiLCJzZXRJbmRleEJ1ZmZlciIsInNldFByb2dyYW0iLCJzZXRUZXh0dXJlIiwic2xvdCIsInNldFVuaWZvcm0iLCJzZXRUZXh0dXJlQXJyYXkiLCJ0ZXh0dXJlcyIsInNsb3RzIiwibGVuIiwidW5pZm9ybSIsInNhbWVUeXBlIiwiaXNBcnJheSIsImlzRmxvYXQzMkFycmF5IiwiaXNJbnQzMkFycmF5IiwiRmxvYXQzMkFycmF5IiwiSW50MzJBcnJheSIsIm5ld1ZhbHVlIiwiZGlydHkiLCJvbGRWYWx1ZSIsImwiLCJzZXRVbmlmb3JtRGlyZWN0bHkiLCJzZXRQcmltaXRpdmVUeXBlIiwicHJpbWl0aXZlVHlwZSIsInJlc2V0RHJhd0NhbGxzIiwiZ2V0RHJhd0NhbGxzIiwiZHJhdyIsImJhc2UiLCJjb3VudCIsInByb2dyYW1EaXJ0eSIsIl9saW5rZWQiLCJ1c2VQcm9ncmFtIiwidW5pZm9ybUluZm8iLCJjb21taXRGdW5jIiwic2l6ZSIsImRyYXdFbGVtZW50cyIsIl9ieXRlc1BlckluZGV4IiwiZHJhd0FycmF5cyIsInNldCIsInJlc2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxNQUFNLEdBQUcsSUFBZjtBQUNBLElBQU1DLFFBQVEsR0FBRyxJQUFqQjtBQUNBLElBQU1DLGFBQWEsR0FBRyxLQUF0QjtBQUNBLElBQU1DLGFBQWEsR0FBRyxLQUF0QjtBQUNBLElBQU1DLGFBQWEsR0FBRyxLQUF0QjtBQUNBLElBQU1DLFdBQVcsR0FBRyxLQUFwQjtBQUNBLElBQU1DLFdBQVcsR0FBRyxLQUFwQjtBQUNBLElBQU1DLFdBQVcsR0FBRyxLQUFwQjtBQUNBLElBQU1DLE9BQU8sR0FBRyxLQUFoQjtBQUNBLElBQU1DLFlBQVksR0FBRyxLQUFyQjtBQUNBLElBQU1DLFlBQVksR0FBRyxLQUFyQjtBQUNBLElBQU1DLFlBQVksR0FBRyxLQUFyQjtBQUNBLElBQU1DLGFBQWEsR0FBRyxLQUF0QjtBQUNBLElBQU1DLGFBQWEsR0FBRyxLQUF0QjtBQUNBLElBQU1DLGFBQWEsR0FBRyxLQUF0QjtBQUNBLElBQU1DLGFBQWEsR0FBRyxLQUF0QjtBQUNBLElBQU1DLGVBQWUsR0FBRyxLQUF4QjtBQUVBO0FBQ0E7QUFDQTs7QUFDQSxJQUFJQyxtQkFBbUIsb0RBQ3BCakIsTUFEb0IsSUFDWCxVQUFVa0IsRUFBVixFQUFjQyxFQUFkLEVBQWtCQyxLQUFsQixFQUF5QjtBQUNqQ0YsRUFBQUEsRUFBRSxDQUFDRyxTQUFILENBQWFGLEVBQWIsRUFBaUJDLEtBQWpCO0FBQ0QsQ0FIb0IsdUJBS3BCbkIsUUFMb0IsSUFLVCxVQUFVaUIsRUFBVixFQUFjQyxFQUFkLEVBQWtCQyxLQUFsQixFQUF5QjtBQUNuQ0YsRUFBQUEsRUFBRSxDQUFDSSxTQUFILENBQWFILEVBQWIsRUFBaUJDLEtBQWpCO0FBQ0QsQ0FQb0IsdUJBU3BCbEIs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VztBQUNULGFBQU8sS0FBS3BPLEtBQVo7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdGF0ZSBmcm9tICcuL3N0YXRlJztcbmltcG9ydCB7IGVudW1zIH0gZnJvbSAnLi9lbnVtcyc7XG5cbmltcG9ydCBUZXh0dXJlMkQgZnJvbSAnLi90ZXh0dXJlLTJkJztcbmltcG9ydCBUZXh0dXJlQ3ViZSBmcm9tICcuL3RleHR1cmUtY3ViZSc7XG5cbmNvbnN0IEdMX0lOVCA9IDUxMjQ7XG5jb25zdCBHTF9GTE9BVCA9IDUxMjY7XG5jb25zdCBHTF9GTE9BVF9WRUMyID0gMzU2NjQ7XG5jb25zdCBHTF9GTE9BVF9WRUMzID0gMzU2NjU7XG5jb25zdCBHTF9GTE9BVF9WRUM0ID0gMzU2NjY7XG5jb25zdCBHTF9JTlRfVkVDMiA9IDM1NjY3O1xuY29uc3QgR0xfSU5UX1ZFQzMgPSAzNTY2ODtcbmNvbnN0IEdMX0lOVF9WRUM0ID0gMzU2Njk7XG5jb25zdCBHTF9CT09MID0gMzU2NzA7XG5jb25zdCBHTF9CT09MX1ZFQzIgPSAzNTY3MTtcbmNvbnN0IEdMX0JPT0xfVkVDMyA9IDM1NjcyO1xuY29uc3QgR0xfQk9PTF9WRUM0ID0gMzU2NzM7XG5jb25zdCBHTF9GTE9BVF9NQVQyID0gMzU2NzQ7XG5jb25zdCBHTF9GTE9BVF9NQVQzID0gMzU2NzU7XG5jb25zdCBHTF9GTE9BVF9NQVQ0ID0gMzU2NzY7XG5jb25zdCBHTF9TQU1QTEVSXzJEID0gMzU2Nzg7XG5jb25zdCBHTF9TQU1QTEVSX0NVQkUgPSAzNTY4MDtcblxuLyoqXG4gKiBfdHlwZTJ1bmlmb3JtQ29tbWl0XG4gKi9cbmxldCBfdHlwZTJ1bmlmb3JtQ29tbWl0ID0ge1xuICBbR0xfSU5UXTogZnVuY3Rpb24gKGdsLCBpZCwgdmFsdWUpIHtcbiAgICBnbC51bmlmb3JtMWkoaWQsIHZhbHVlKTtcbiAgfSxcblxuICBbR0xfRkxPQVRdOiBmdW5jdGlvbiAoZ2wsIGlkLCB2YWx1ZSkge1xuICAgIGdsLnVuaWZvcm0xZihpZCwgdmFsdWUpO1xuICB9LFxuXG4gIFtHTF9GTE9BVF9WRUMyXTogZnVuY3Rpb24gKGdsLCBpZCwgdmFsdWUpIHtcbiAgICBnbC51bmlmb3JtMmZ2KGlkLCB2YWx1ZSk7XG4gIH0sXG5cbiAgW0dMX0ZMT0FUX1ZFQzNdOiBmdW5jdGlvbiAoZ2wsIGlkLCB2YWx1ZSkge1xuICAgIGdsLnVuaWZvcm0zZnYoaWQsIHZhbHVlKTtcbiAgfSxcblxuICBbR0xfRkxPQVRfVkVDNF06IGZ1bmN0aW9uIChnbCwgaWQsIHZhbHVlKSB7XG4gICAgZ2wudW5pZm9ybTRmdihpZCwgdmFsdWUpO1xuICB9LFxuXG4gIFtHTF9JTlRfVkVDMl06IGZ1bmN0aW9uIChnbCwgaWQsIHZhbHVlKSB7XG4gICAgZ2wudW5pZm9ybTJpdihpZCwgdmFsdWUpO1xuICB9LFxuXG4gIFtHTF9JTlRfVkVDM106IGZ1bmN0aW9uIChnbCwgaWQsIHZhbHVlKSB7XG4gICAgZ2wudW5pZm9ybTNpdihpZCwgdmFsdWUpO1xuICB9LFxuXG4gIFtHTF9JTlRfVkVDNF06IGZ1bmN0aW9uIChnbCwgaWQsIHZhbHVlKSB7XG4gICAgZ2wudW5pZm9ybTRpdihpZCwgdmFsdWUpO1xuICB9LFxuXG4gIFtHTF9CT09MXTogZnVuY3Rpb24gKGdsLCBpZCwgdmFsdWUpIHtcbiAgICBnbC51bmlmb3JtMWkoaWQsIHZhbHVlKTtcbiAgfSxcblxuICBbR0xfQk9PTF9WRUMyXTogZnVuY3Rpb24gKGdsLCBpZCwgdmFsdWUpIHtcbiAgICBnbC51bmlmb3JtMml2KGlkLCB2YWx1ZSk7XG4gIH0sXG5cbiAgW0dMX0JPT0xfVkVDM106IGZ1bmN0aW9uIChnbCwgaWQsIHZhbHVlKSB7XG4gICAgZ2wudW5pZm9ybTNpdihpZCwgdmFsdWUpO1xuICB9LFxuXG4gIFtHTF9CT09MX1ZFQzRdOiBmdW5jdGlvbiAoZ2wsIGlkLCB2YWx1ZSkge1xuICAgIGdsLnVuaWZvcm00aXYoaWQsIHZhbHVlKTtcbiAgfSxcblxuICBbR0xfRkxPQVRfTUFUMl06IGZ1bmN0aW9uIChnbCwgaWQsIHZhbHVlKSB7XG4gICAgZ2wudW5pZm9ybU1hdHJpeDJmdihpZCwgZmFsc2UsIHZhbHVlKTtcbiAgfSxcblxuICBbR0xfRkxPQVRfTUFUM106IGZ1bmN0aW9uIChnbCwgaWQsIHZhbHVlKSB7XG4gICAgZ2wudW5pZm9ybU1hdHJpeDNmdihpZCwgZmFsc2UsIHZhbHVlKTtcbiAgfSxcblxuICBbR0xfRkxPQVRfTUFUNF06IGZ1bmN0aW9uIChnbCwgaWQsIHZhbHVlKSB7XG4gICAgZ2wudW5pZm9ybU1hdHJpeDRmdihpZCwgZmFsc2UsIHZhbHVlKTtcbiAgfSxcblxuICBbR0xfU0FNUExFUl8yRF06IGZ1bmN0aW9uIChnbCwgaWQsIHZhbHVlKSB7XG4gICAgZ2wudW5pZm9ybTFpKGlkLCB2YWx1ZSk7XG4gIH0sXG5cbiAgW0dMX1NBTVBMRVJfQ1VCRV06IGZ1bmN0aW9uIChnbCwgaWQsIHZhbHVlKSB7XG4gICAgZ2wudW5pZm9ybTFpKGlkLCB2YWx1ZSk7XG4gIH0sXG59O1xuXG4vKipcbiAqIF90eXBlMnVuaWZvcm1BcnJheUNvbW1pdFxuICovXG5sZXQgX3R5cGUydW5pZm9ybUFycmF5Q29tbWl0ID0ge1xuICBbR0xfSU5UXTogZnVuY3Rpb24gKGdsLCBpZCwgdmFsdWUpIHtcbiAgICBnbC51bmlmb3JtMWl2KGlkLCB2YWx1ZSk7XG4gIH0sXG5cbiAgW0dMX0ZMT0FUXTogZnVuY3Rpb24gKGdsLCBpZCwgdmFsdWUpIHtcbiAgICBnbC51bmlmb3JtMWZ2KGlkLCB2YWx1ZSk7XG4gIH0sXG5cbiAgW0dMX0ZMT0FUX1ZFQzJdOiBmdW5jdGlvbiAoZ2wsIGlkLCB2YWx1ZSkge1xuICAgIGdsLnVuaWZvcm0yZnYoaWQsIHZhbHVlKTtcbiAgfSxcblxuICBbR0xfRkxPQVRfVkVDM106IGZ1bmN0aW9uIChnbCwgaWQsIHZhbHVlKSB7XG4gICAgZ2wudW5pZm9ybTNmdihpZCwgdmFsdWUpO1xuICB9LFxuXG4gIFtHTF9GTE9BVF9WRUM0XTogZnVuY3Rpb24gKGdsLCBpZCwgdmFsdWUpIHtcbiAgICBnbC51bmlmb3JtNGZ2KGlkLCB2YWx1ZSk7XG4gIH0sXG5cbiAgW0dMX0lOVF9WRUMyXTogZnVuY3Rpb24gKGdsLCBpZCwgdmFsdWUpIHtcbiAgICBnbC51bmlmb3JtMml2KGlkLCB2YWx1ZSk7XG4gIH0sXG5cbiAgW0dMX0lOVF9WRUMzXTogZnVuY3Rpb24gKGdsLCBpZCwgdmFsdWUpIHtcbiAgICBnbC51bmlmb3JtM2l2KGlkLCB2YWx1ZSk7XG4gIH0sXG5cbiAgW0dMX0lOVF9WRUM0XTogZnVuY3Rpb24gKGdsLCBpZCwgdmFsdWUpIHtcbiAgICBnbC51bmlmb3JtNGl2KGlkLCB2YWx1ZSk7XG4gIH0sXG5cbiAgW0dMX0JPT0xdOiBmdW5jdGlvbiAoZ2wsIGlkLCB2YWx1ZSkge1xuICAgIGdsLnVuaWZvcm0xaXYoaWQsIHZhbHVlKTtcbiAgfSxcblxuICBbR0xfQk9PTF9WRUMyXTogZnVuY3Rpb24gKGdsLCBpZCwgdmFsdWUpIHtcbiAgICBnbC51bmlmb3JtMml2KGlkLCB2YWx1ZSk7XG4gIH0sXG5cbiAgW0dMX0JPT0xfVkVDM106IGZ1bmN0aW9uIChnbCwgaWQsIHZhbHVlKSB7XG4gICAgZ2wudW5pZm9ybTNpdihpZCwgdmFsdWUpO1xuICB9LFxuXG4gIFtHTF9CT09MX1ZFQzRdOiBmdW5jdGlvbiAoZ2wsIGlkLCB2YWx1ZSkge1xuICAgIGdsLnVuaWZvcm00aXYoaWQsIHZhbHVlKTtcbiAgfSxcblxuICBbR0xfRkxPQVRfTUFUMl06IGZ1bmN0aW9uIChnbCwgaWQsIHZhbHVlKSB7XG4gICAgZ2wudW5pZm9ybU1hdHJpeDJmdihpZCwgZmFsc2UsIHZhbHVlKTtcbiAgfSxcblxuICBbR0xfRkxPQVRfTUFUM106IGZ1bmN0aW9uIChnbCwgaWQsIHZhbHVlKSB7XG4gICAgZ2wudW5pZm9ybU1hdHJpeDNmdihpZCwgZmFsc2UsIHZhbHVlKTtcbiAgfSxcblxuICBbR0xfRkxPQVRfTUFUNF06IGZ1bmN0aW9uIChnbCwgaWQsIHZhbHVlKSB7XG4gICAgZ2wudW5pZm9ybU1hdHJpeDRmdihpZCwgZmFsc2UsIHZhbHVlKTtcbiAgfSxcblxuICBbR0xfU0FNUExFUl8yRF06IGZ1bmN0aW9uIChnbCwgaWQsIHZhbHVlKSB7XG4gICAgZ2wudW5pZm9ybTFpdihpZCwgdmFsdWUpO1xuICB9LFxuXG4gIFtHTF9TQU1QTEVSX0NVQkVdOiBmdW5jdGlvbiAoZ2wsIGlkLCB2YWx1ZSkge1xuICAgIGdsLnVuaWZvcm0xaXYoaWQsIHZhbHVlKTtcbiAgfSxcbn07XG5cbi8qKlxuICogX2NvbW1pdEJsZW5kU3RhdGVzXG4gKi9cbmZ1bmN0aW9uIF9jb21taXRCbGVuZFN0YXRlcyhnbCwgY3VyLCBuZXh0KSB7XG4gIC8vIGVuYWJsZS9kaXNhYmxlIGJsZW5kXG4gIGlmIChjdXIuYmxlbmQgIT09IG5leHQuYmxlbmQpIHtcbiAgICBpZiAoIW5leHQuYmxlbmQpIHtcbiAgICAgIGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGdsLmVuYWJsZShnbC5CTEVORCk7XG5cbiAgICBpZiAoXG4gICAgICBuZXh0LmJsZW5kU3JjID09PSBlbnVtcy5CTEVORF9DT05TVEFOVF9DT0xPUiB8fFxuICAgICAgbmV4dC5ibGVuZFNyYyA9PT0gZW51bXMuQkxFTkRfT05FX01JTlVTX0NPTlNUQU5UX0NPTE9SIHx8XG4gICAgICBuZXh0LmJsZW5kRHN0ID09PSBlbnVtcy5CTEVORF9DT05TVEFOVF9DT0xPUiB8fFxuICAgICAgbmV4dC5ibGVuZERzdCA9PT0gZW51bXMuQkxFTkRfT05FX01JTlVTX0NPTlNUQU5UX0NPTE9SXG4gICAgKSB7XG4gICAgICBnbC5ibGVuZENvbG9yKFxuICAgICAgICAobmV4dC5ibGVuZENvbG9yID4+IDI0KSAvIDI1NSxcbiAgICAgICAgKG5leHQuYmxlbmRDb2xvciA+PiAxNiAmIDB4ZmYpIC8gMjU1LFxuICAgICAgICAobmV4dC5ibGVuZENvbG9yID4+IDggJiAweGZmKSAvIDI1NSxcbiAgICAgICAgKG5leHQuYmxlbmRDb2xvciAmIDB4ZmYpIC8gMjU1XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChuZXh0LmJsZW5kU2VwKSB7XG4gICAgICBnbC5ibGVuZEZ1bmNTZXBhcmF0ZShuZXh0LmJsZW5kU3JjLCBuZXh0LmJsZW5kRHN0LCBuZXh0LmJsZW5kU3JjQWxwaGEsIG5leHQuYmxlbmREc3RBbHBoYSk7XG4gICAgICBnbC5ibGVuZEVxdWF0aW9uU2VwYXJhdGUobmV4dC5ibGVuZEVxLCBuZXh0LmJsZW5kQWxwaGFFcSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdsLmJsZW5kRnVuYyhuZXh0LmJsZW5kU3JjLCBuZXh0LmJsZW5kRHN0KTtcbiAgICAgIGdsLmJsZW5kRXF1YXRpb24obmV4dC5ibGVuZEVxKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBub3RoaW5nIHRvIHVwZGF0ZVxuICBpZiAobmV4dC5ibGVuZCA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBibGVuZC1jb2xvclxuICBpZiAoY3VyLmJsZW5kQ29sb3IgIT09IG5leHQuYmxlbmRDb2xvcikge1xuICAgIGdsLmJsZW5kQ29sb3IoXG4gICAgICAobmV4dC5ibGVuZENvbG9yID4+IDI0KSAvIDI1NSxcbiAgICAgIChuZXh0LmJsZW5kQ29sb3IgPj4gMTYgJiAweGZmKSAvIDI1NSxcbiAgICAgIChuZXh0LmJsZW5kQ29sb3IgPj4gOCAmIDB4ZmYpIC8gMjU1LFxuICAgICAgKG5leHQuYmxlbmRDb2xvciAmIDB4ZmYpIC8gMjU1XG4gICAgKTtcbiAgfVxuXG4gIC8vIHNlcGFyYXRlIGRpZmYsIHJlc2V0IGFsbFxuICBpZiAoY3VyLmJsZW5kU2VwICE9PSBuZXh0LmJsZW5kU2VwKSB7XG4gICAgaWYgKG5leHQuYmxlbmRTZXApIHtcbiAgICAgIGdsLmJsZW5kRnVuY1NlcGFyYXRlKG5leHQuYmxlbmRTcmMsIG5leHQuYmxlbmREc3QsIG5leHQuYmxlbmRTcmNBbHBoYSwgbmV4dC5ibGVuZERzdEFscGhhKTtcbiAgICAgIGdsLmJsZW5kRXF1YXRpb25TZXBhcmF0ZShuZXh0LmJsZW5kRXEsIG5leHQuYmxlbmRBbHBoYUVxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2wuYmxlbmRGdW5jKG5leHQuYmxlbmRTcmMsIG5leHQuYmxlbmREc3QpO1xuICAgICAgZ2wuYmxlbmRFcXVhdGlvbihuZXh0LmJsZW5kRXEpO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChuZXh0LmJsZW5kU2VwKSB7XG4gICAgLy8gYmxlbmQtZnVuYy1zZXBhcmF0ZVxuICAgIGlmIChcbiAgICAgIGN1ci5ibGVuZFNyYyAhPT0gbmV4dC5ibGVuZFNyYyB8fFxuICAgICAgY3VyLmJsZW5kRHN0ICE9PSBuZXh0LmJsZW5kRHN0IHx8XG4gICAgICBjdXIuYmxlbmRTcmNBbHBoYSAhPT0gbmV4dC5ibGVuZFNyY0FscGhhIHx8XG4gICAgICBjdXIuYmxlbmREc3RBbHBoYSAhPT0gbmV4dC5ibGVuZERzdEFscGhhXG4gICAgKSB7XG4gICAgICBnbC5ibGVuZEZ1bmNTZXBhcmF0ZShuZXh0LmJsZW5kU3JjLCBuZXh0LmJsZW5kRHN0LCBuZXh0LmJsZW5kU3JjQWxwaGEsIG5leHQuYmxlbmREc3RBbHBoYSk7XG4gICAgfVxuXG4gICAgLy8gYmxlbmQtZXF1YXRpb24tc2VwYXJhdGVcbiAgICBpZiAoXG4gICAgICBjdXIuYmxlbmRFcSAhPT0gbmV4dC5ibGVuZEVxIHx8XG4gICAgICBjdXIuYmxlbmRBbHBoYUVxICE9PSBuZXh0LmJsZW5kQWxwaGFFcVxuICAgICkge1xuICAgICAgZ2wuYmxlbmRFcXVhdGlvblNlcGFyYXRlKG5leHQuYmxlbmRFcSwgbmV4dC5ibGVuZEFscGhhRXEpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBibGVuZC1mdW5jXG4gICAgaWYgKFxuICAgICAgY3VyLmJsZW5kU3JjICE9PSBuZXh0LmJsZW5kU3JjIHx8XG4gICAgICBjdXIuYmxlbmREc3QgIT09IG5leHQuYmxlbmREc3RcbiAgICApIHtcbiAgICAgIGdsLmJsZW5kRnVuYyhuZXh0LmJsZW5kU3JjLCBuZXh0LmJsZW5kRHN0KTtcbiAgICB9XG5cbiAgICAvLyBibGVuZC1lcXVhdGlvblxuICAgIGlmIChjdXIuYmxlbmRFcSAhPT0gbmV4dC5ibGVuZEVxKSB7XG4gICAgICBnbC5ibGVuZEVxdWF0aW9uKG5leHQuYmxlbmRFcSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogX2NvbW1pdERlcHRoU3RhdGVzXG4gKi9cbmZ1bmN0aW9uIF9jb21taXREZXB0aFN0YXRlcyhnbCwgY3VyLCBuZXh0KSB7XG4gIC8vIGVuYWJsZS9kaXNhYmxlIGRlcHRoLXRlc3RcbiAgaWYgKGN1ci5kZXB0aFRlc3QgIT09IG5leHQuZGVwdGhUZXN0KSB7XG4gICAgaWYgKCFuZXh0LmRlcHRoVGVzdCkge1xuICAgICAgZ2wuZGlzYWJsZShnbC5ERVBUSF9URVNUKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBnbC5lbmFibGUoZ2wuREVQVEhfVEVTVCk7XG4gICAgZ2wuZGVwdGhGdW5jKG5leHQuZGVwdGhGdW5jKTtcbiAgICBnbC5kZXB0aE1hc2sobmV4dC5kZXB0aFdyaXRlKTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIGNvbW1pdCBkZXB0aC13cml0ZVxuICBpZiAoY3VyLmRlcHRoV3JpdGUgIT09IG5leHQuZGVwdGhXcml0ZSkge1xuICAgIGdsLmRlcHRoTWFzayhuZXh0LmRlcHRoV3JpdGUpO1xuICB9XG5cbiAgLy8gY2hlY2sgaWYgZGVwdGgtd3JpdGUgZW5hYmxlZFxuICBpZiAobmV4dC5kZXB0aFRlc3QgPT09IGZhbHNlKSB7XG4gICAgaWYgKG5leHQuZGVwdGhXcml0ZSkge1xuICAgICAgbmV4dC5kZXB0aFRlc3QgPSB0cnVlO1xuICAgICAgbmV4dC5kZXB0aEZ1bmMgPSBlbnVtcy5EU19GVU5DX0FMV0FZUztcblxuICAgICAgZ2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xuICAgICAgZ2wuZGVwdGhGdW5jKG5leHQuZGVwdGhGdW5jKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBkZXB0aC1mdW5jXG4gIGlmIChjdXIuZGVwdGhGdW5jICE9PSBuZXh0LmRlcHRoRnVuYykge1xuICAgIGdsLmRlcHRoRnVuYyhuZXh0LmRlcHRoRnVuYyk7XG4gIH1cbn1cblxuLyoqXG4gKiBfY29tbWl0U3RlbmNpbFN0YXRlc1xuICovXG5mdW5jdGlvbiBfY29tbWl0U3RlbmNpbFN0YXRlcyhnbCwgY3VyLCBuZXh0KSB7XG4gIC8vIGluaGVyaXQgc3RlbmNpbCBzdGF0ZXNcbiAgaWYgKG5leHQuc3RlbmNpbFRlc3QgPT09IGVudW1zLlNURU5DSUxfSU5IRVJJVCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChuZXh0LnN0ZW5jaWxUZXN0ICE9PSBjdXIuc3RlbmNpbFRlc3QpIHtcbiAgICBpZiAobmV4dC5zdGVuY2lsVGVzdCA9PT0gZW51bXMuU1RFTkNJTF9ESVNBQkxFKSB7XG4gICAgICBnbC5kaXNhYmxlKGdsLlNURU5DSUxfVEVTVCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZ2wuZW5hYmxlKGdsLlNURU5DSUxfVEVTVCk7XG5cbiAgICBpZiAobmV4dC5zdGVuY2lsU2VwKSB7XG4gICAgICBnbC5zdGVuY2lsRnVuY1NlcGFyYXRlKGdsLkZST05ULCBuZXh0LnN0ZW5jaWxGdW5jRnJvbnQsIG5leHQuc3RlbmNpbFJlZkZyb250LCBuZXh0LnN0ZW5jaWxNYXNrRnJvbnQpO1xuICAgICAgZ2wuc3RlbmNpbE1hc2tTZXBhcmF0ZShnbC5GUk9OVCwgbmV4dC5zdGVuY2lsV3JpdGVNYXNrRnJvbnQpO1xuICAgICAgZ2wuc3RlbmNpbE9wU2VwYXJhdGUoZ2wuRlJPTlQsIG5leHQuc3RlbmNpbEZhaWxPcEZyb250LCBuZXh0LnN0ZW5jaWxaRmFpbE9wRnJvbnQsIG5leHQuc3RlbmNpbFpQYXNzT3BGcm9udCk7XG4gICAgICBnbC5zdGVuY2lsRnVuY1NlcGFyYXRlKGdsLkJBQ0ssIG5leHQuc3RlbmNpbEZ1bmNCYWNrLCBuZXh0LnN0ZW5jaWxSZWZCYWNrLCBuZXh0LnN0ZW5jaWxNYXNrQmFjayk7XG4gICAgICBnbC5zdGVuY2lsTWFza1NlcGFyYXRlKGdsLkJBQ0ssIG5leHQuc3RlbmNpbFdyaXRlTWFza0JhY2spO1xuICAgICAgZ2wuc3RlbmNpbE9wU2VwYXJhdGUoZ2wuQkFDSywgbmV4dC5zdGVuY2lsRmFpbE9wQmFjaywgbmV4dC5zdGVuY2lsWkZhaWxPcEJhY2ssIG5leHQuc3RlbmNpbFpQYXNzT3BCYWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2wuc3RlbmNpbEZ1bmMobmV4dC5zdGVuY2lsRnVuY0Zyb250LCBuZXh0LnN0ZW5jaWxSZWZGcm9udCwgbmV4dC5zdGVuY2lsTWFza0Zyb250KTtcbiAgICAgIGdsLnN0ZW5jaWxNYXNrKG5leHQuc3RlbmNpbFdyaXRlTWFza0Zyb250KTtcbiAgICAgIGdsLnN0ZW5jaWxPcChuZXh0LnN0ZW5jaWxGYWlsT3BGcm9udCwgbmV4dC5zdGVuY2lsWkZhaWxPcEZyb250LCBuZXh0LnN0ZW5jaWxaUGFzc09wRnJvbnQpO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIGZhc3QgcmV0dXJuXG4gIGlmIChuZXh0LnN0ZW5jaWxUZXN0ID09PSBlbnVtcy5TVEVOQ0lMX0RJU0FCTEUpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY3VyLnN0ZW5jaWxTZXAgIT09IG5leHQuc3RlbmNpbFNlcCkge1xuICAgIGlmIChuZXh0LnN0ZW5jaWxTZXApIHtcbiAgICAgIGdsLnN0ZW5jaWxGdW5jU2VwYXJhdGUoZ2wuRlJPTlQsIG5leHQuc3RlbmNpbEZ1bmNGcm9udCwgbmV4dC5zdGVuY2lsUmVmRnJvbnQsIG5leHQuc3RlbmNpbE1hc2tGcm9udCk7XG4gICAgICBnbC5zdGVuY2lsTWFza1NlcGFyYXRlKGdsLkZST05ULCBuZXh0LnN0ZW5jaWxXcml0ZU1hc2tGcm9udCk7XG4gICAgICBnbC5zdGVuY2lsT3BTZXBhcmF0ZShnbC5GUk9OVCwgbmV4dC5zdGVuY2lsRmFpbE9wRnJvbnQsIG5leHQuc3RlbmNpbFpGYWlsT3BGcm9udCwgbmV4dC5zdGVuY2lsWlBhc3NPcEZyb250KTtcbiAgICAgIGdsLnN0ZW5jaWxGdW5jU2VwYXJhdGUoZ2wuQkFDSywgbmV4dC5zdGVuY2lsRnVuY0JhY2ssIG5leHQuc3RlbmNpbFJlZkJhY2ssIG5leHQuc3RlbmNpbE1hc2tCYWNrKTtcbiAgICAgIGdsLnN0ZW5jaWxNYXNrU2VwYXJhdGUoZ2wuQkFDSywgbmV4dC5zdGVuY2lsV3JpdGVNYXNrQmFjayk7XG4gICAgICBnbC5zdGVuY2lsT3BTZXBhcmF0ZShnbC5CQUNLLCBuZXh0LnN0ZW5jaWxGYWlsT3BCYWNrLCBuZXh0LnN0ZW5jaWxaRmFpbE9wQmFjaywgbmV4dC5zdGVuY2lsWlBhc3NPcEJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBnbC5zdGVuY2lsRnVuYyhuZXh0LnN0ZW5jaWxGdW5jRnJvbnQsIG5leHQuc3RlbmNpbFJlZkZyb250LCBuZXh0LnN0ZW5jaWxNYXNrRnJvbnQpO1xuICAgICAgZ2wuc3RlbmNpbE1hc2sobmV4dC5zdGVuY2lsV3JpdGVNYXNrRnJvbnQpO1xuICAgICAgZ2wuc3RlbmNpbE9wKG5leHQuc3RlbmNpbEZhaWxPcEZyb250LCBuZXh0LnN0ZW5jaWxaRmFpbE9wRnJvbnQsIG5leHQuc3RlbmNpbFpQYXNzT3BGcm9udCk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChuZXh0LnN0ZW5jaWxTZXApIHtcbiAgICAvLyBmcm9udFxuICAgIGlmIChcbiAgICAgIGN1ci5zdGVuY2lsRnVuY0Zyb250ICE9PSBuZXh0LnN0ZW5jaWxGdW5jRnJvbnQgfHxcbiAgICAgIGN1ci5zdGVuY2lsUmVmRnJvbnQgIT09IG5leHQuc3RlbmNpbFJlZkZyb250IHx8XG4gICAgICBjdXIuc3RlbmNpbE1hc2tGcm9udCAhPT0gbmV4dC5zdGVuY2lsTWFza0Zyb250XG4gICAgKSB7XG4gICAgICBnbC5zdGVuY2lsRnVuY1NlcGFyYXRlKGdsLkZST05ULCBuZXh0LnN0ZW5jaWxGdW5jRnJvbnQsIG5leHQuc3RlbmNpbFJlZkZyb250LCBuZXh0LnN0ZW5jaWxNYXNrRnJvbnQpO1xuICAgIH1cbiAgICBpZiAoY3VyLnN0ZW5jaWxXcml0ZU1hc2tGcm9udCAhPT0gbmV4dC5zdGVuY2lsV3JpdGVNYXNrRnJvbnQpIHtcbiAgICAgIGdsLnN0ZW5jaWxNYXNrU2VwYXJhdGUoZ2wuRlJPTlQsIG5leHQuc3RlbmNpbFdyaXRlTWFza0Zyb250KTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgY3VyLnN0ZW5jaWxGYWlsT3BGcm9udCAhPT0gbmV4dC5zdGVuY2lsRmFpbE9wRnJvbnQgfHxcbiAgICAgIGN1ci5zdGVuY2lsWkZhaWxPcEZyb250ICE9PSBuZXh0LnN0ZW5jaWxaRmFpbE9wRnJvbnQgfHxcbiAgICAgIGN1ci5zdGVuY2lsWlBhc3NPcEZyb250ICE9PSBuZXh0LnN0ZW5jaWxaUGFzc09wRnJvbnRcbiAgICApIHtcbiAgICAgIGdsLnN0ZW5jaWxPcFNlcGFyYXRlKGdsLkZST05ULCBuZXh0LnN0ZW5jaWxGYWlsT3BGcm9udCwgbmV4dC5zdGVuY2lsWkZhaWxPcEZyb250LCBuZXh0LnN0ZW5jaWxaUGFzc09wRnJvbnQpO1xuICAgIH1cblxuICAgIC8vIGJhY2tcbiAgICBpZiAoXG4gICAgICBjdXIuc3RlbmNpbEZ1bmNCYWNrICE9PSBuZXh0LnN0ZW5jaWxGdW5jQmFjayB8fFxuICAgICAgY3VyLnN0ZW5jaWxSZWZCYWNrICE9PSBuZXh0LnN0ZW5jaWxSZWZCYWNrIHx8XG4gICAgICBjdXIuc3RlbmNpbE1hc2tCYWNrICE9PSBuZXh0LnN0ZW5jaWxNYXNrQmFja1xuICAgICkge1xuICAgICAgZ2wuc3RlbmNpbEZ1bmNTZXBhcmF0ZShnbC5CQUNLLCBuZXh0LnN0ZW5jaWxGdW5jQmFjaywgbmV4dC5zdGVuY2lsUmVmQmFjaywgbmV4dC5zdGVuY2lsTWFza0JhY2spO1xuICAgIH1cbiAgICBpZiAoY3VyLnN0ZW5jaWxXcml0ZU1hc2tCYWNrICE9PSBuZXh0LnN0ZW5jaWxXcml0ZU1hc2tCYWNrKSB7XG4gICAgICBnbC5zdGVuY2lsTWFza1NlcGFyYXRlKGdsLkJBQ0ssIG5leHQuc3RlbmNpbFdyaXRlTWFza0JhY2spO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICBjdXIuc3RlbmNpbEZhaWxPcEJhY2sgIT09IG5leHQuc3RlbmNpbEZhaWxPcEJhY2sgfHxcbiAgICAgIGN1ci5zdGVuY2lsWkZhaWxPcEJhY2sgIT09IG5leHQuc3RlbmNpbFpGYWlsT3BCYWNrIHx8XG4gICAgICBjdXIuc3RlbmNpbFpQYXNzT3BCYWNrICE9PSBuZXh0LnN0ZW5jaWxaUGFzc09wQmFja1xuICAgICkge1xuICAgICAgZ2wuc3RlbmNpbE9wU2VwYXJhdGUoZ2wuQkFDSywgbmV4dC5zdGVuY2lsRmFpbE9wQmFjaywgbmV4dC5zdGVuY2lsWkZhaWxPcEJhY2ssIG5leHQuc3RlbmNpbFpQYXNzT3BCYWNrKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKFxuICAgICAgY3VyLnN0ZW5jaWxGdW5jRnJvbnQgIT09IG5leHQuc3RlbmNpbEZ1bmNGcm9udCB8fFxuICAgICAgY3VyLnN0ZW5jaWxSZWZGcm9udCAhPT0gbmV4dC5zdGVuY2lsUmVmRnJvbnQgfHxcbiAgICAgIGN1ci5zdGVuY2lsTWFza0Zyb250ICE9PSBuZXh0LnN0ZW5jaWxNYXNrRnJvbnRcbiAgICApIHtcbiAgICAgIGdsLnN0ZW5jaWxGdW5jKG5leHQuc3RlbmNpbEZ1bmNGcm9udCwgbmV4dC5zdGVuY2lsUmVmRnJvbnQsIG5leHQuc3RlbmNpbE1hc2tGcm9udCk7XG4gICAgfVxuICAgIGlmIChjdXIuc3RlbmNpbFdyaXRlTWFza0Zyb250ICE9PSBuZXh0LnN0ZW5jaWxXcml0ZU1hc2tGcm9udCkge1xuICAgICAgZ2wuc3RlbmNpbE1hc2sobmV4dC5zdGVuY2lsV3JpdGVNYXNrRnJvbnQpO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICBjdXIuc3RlbmNpbEZhaWxPcEZyb250ICE9PSBuZXh0LnN0ZW5jaWxGYWlsT3BGcm9udCB8fFxuICAgICAgY3VyLnN0ZW5jaWxaRmFpbE9wRnJvbnQgIT09IG5leHQuc3RlbmNpbFpGYWlsT3BGcm9udCB8fFxuICAgICAgY3VyLnN0ZW5jaWxaUGFzc09wRnJvbnQgIT09IG5leHQuc3RlbmNpbFpQYXNzT3BGcm9udFxuICAgICkge1xuICAgICAgZ2wuc3RlbmNpbE9wKG5leHQuc3RlbmNpbEZhaWxPcEZyb250LCBuZXh0LnN0ZW5jaWxaRmFpbE9wRnJvbnQsIG5leHQuc3RlbmNpbFpQYXNzT3BGcm9udCk7XG4gICAgfVxuICB9XG5cbn1cblxuLyoqXG4gKiBfY29tbWl0Q3VsbE1vZGVcbiAqL1xuZnVuY3Rpb24gX2NvbW1pdEN1bGxNb2RlKGdsLCBjdXIsIG5leHQpIHtcbiAgaWYgKGN1ci5jdWxsTW9kZSA9PT0gbmV4dC5jdWxsTW9kZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChuZXh0LmN1bGxNb2RlID09PSBlbnVtcy5DVUxMX05PTkUpIHtcbiAgICBnbC5kaXNhYmxlKGdsLkNVTExfRkFDRSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZ2wuZW5hYmxlKGdsLkNVTExfRkFDRSk7XG4gIGdsLmN1bGxGYWNlKG5leHQuY3VsbE1vZGUpO1xufVxuXG4vKipcbiAqIF9jb21taXRWZXJ0ZXhCdWZmZXJzXG4gKi9cbmZ1bmN0aW9uIF9jb21taXRWZXJ0ZXhCdWZmZXJzKGRldmljZSwgZ2wsIGN1ciwgbmV4dCkge1xuICBsZXQgYXR0cnNEaXJ0eSA9IGZhbHNlO1xuXG4gIC8vIG5vdGhpbmcgY2hhbmdlZCBmb3IgdmVydGV4IGJ1ZmZlclxuICBpZiAobmV4dC5tYXhTdHJlYW0gPT09IC0xKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGN1ci5tYXhTdHJlYW0gIT09IG5leHQubWF4U3RyZWFtKSB7XG4gICAgYXR0cnNEaXJ0eSA9IHRydWU7XG4gIH0gZWxzZSBpZiAoY3VyLnByb2dyYW0gIT09IG5leHQucHJvZ3JhbSkge1xuICAgIGF0dHJzRGlydHkgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV4dC5tYXhTdHJlYW0gKyAxOyArK2kpIHtcbiAgICAgIGlmIChcbiAgICAgICAgY3VyLnZlcnRleEJ1ZmZlcnNbaV0gIT09IG5leHQudmVydGV4QnVmZmVyc1tpXSB8fFxuICAgICAgICBjdXIudmVydGV4QnVmZmVyT2Zmc2V0c1tpXSAhPT0gbmV4dC52ZXJ0ZXhCdWZmZXJPZmZzZXRzW2ldXG4gICAgICApIHtcbiAgICAgICAgYXR0cnNEaXJ0eSA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChhdHRyc0RpcnR5KSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZXZpY2UuX2NhcHMubWF4VmVydGV4QXR0cmliczsgKytpKSB7XG4gICAgICBkZXZpY2UuX25ld0F0dHJpYnV0ZXNbaV0gPSAwO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV4dC5tYXhTdHJlYW0gKyAxOyArK2kpIHtcbiAgICAgIGxldCB2YiA9IG5leHQudmVydGV4QnVmZmVyc1tpXTtcbiAgICAgIGxldCB2Yk9mZnNldCA9IG5leHQudmVydGV4QnVmZmVyT2Zmc2V0c1tpXTtcbiAgICAgIGlmICghdmIgfHwgdmIuX2dsSUQgPT09IC0xKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdmIuX2dsSUQpO1xuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5leHQucHJvZ3JhbS5fYXR0cmlidXRlcy5sZW5ndGg7ICsraikge1xuICAgICAgICBsZXQgYXR0ciA9IG5leHQucHJvZ3JhbS5fYXR0cmlidXRlc1tqXTtcblxuICAgICAgICBsZXQgZWwgPSB2Yi5fZm9ybWF0LmVsZW1lbnQoYXR0ci5uYW1lKTtcbiAgICAgICAgaWYgKCFlbCkge1xuICAgICAgICAgIGNvbnNvbGUud2FybihgQ2FuIG5vdCBmaW5kIHZlcnRleCBhdHRyaWJ1dGU6ICR7YXR0ci5uYW1lfWApO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRldmljZS5fZW5hYmxlZEF0dHJpYnV0ZXNbYXR0ci5sb2NhdGlvbl0gPT09IDApIHtcbiAgICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhdHRyLmxvY2F0aW9uKTtcbiAgICAgICAgICBkZXZpY2UuX2VuYWJsZWRBdHRyaWJ1dGVzW2F0dHIubG9jYXRpb25dID0gMTtcbiAgICAgICAgfVxuICAgICAgICBkZXZpY2UuX25ld0F0dHJpYnV0ZXNbYXR0ci5sb2NhdGlvbl0gPSAxO1xuXG4gICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoXG4gICAgICAgICAgYXR0ci5sb2NhdGlvbixcbiAgICAgICAgICBlbC5udW0sXG4gICAgICAgICAgZWwudHlwZSxcbiAgICAgICAgICBlbC5ub3JtYWxpemUsXG4gICAgICAgICAgZWwuc3RyaWRlLFxuICAgICAgICAgIGVsLm9mZnNldCArIHZiT2Zmc2V0ICogZWwuc3RyaWRlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGlzYWJsZSB1bnVzZWQgYXR0cmlidXRlc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGV2aWNlLl9jYXBzLm1heFZlcnRleEF0dHJpYnM7ICsraSkge1xuICAgICAgaWYgKGRldmljZS5fZW5hYmxlZEF0dHJpYnV0ZXNbaV0gIT09IGRldmljZS5fbmV3QXR0cmlidXRlc1tpXSkge1xuICAgICAgICBnbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkoaSk7XG4gICAgICAgIGRldmljZS5fZW5hYmxlZEF0dHJpYnV0ZXNbaV0gPSAwO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIF9jb21taXRUZXh0dXJlc1xuICovXG5mdW5jdGlvbiBfY29tbWl0VGV4dHVyZXMoZ2wsIGN1ciwgbmV4dCkge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG5leHQubWF4VGV4dHVyZVNsb3QgKyAxOyArK2kpIHtcbiAgICBpZiAoY3VyLnRleHR1cmVVbml0c1tpXSAhPT0gbmV4dC50ZXh0dXJlVW5pdHNbaV0pIHtcbiAgICAgIGxldCB0ZXh0dXJlID0gbmV4dC50ZXh0dXJlVW5pdHNbaV07XG4gICAgICBpZiAodGV4dHVyZSAmJiB0ZXh0dXJlLl9nbElEICE9PSAtMSkge1xuICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgaSk7XG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKHRleHR1cmUuX3RhcmdldCwgdGV4dHVyZS5fZ2xJRCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogX2F0dGFjaFxuICovXG5mdW5jdGlvbiBfYXR0YWNoKGdsLCBsb2NhdGlvbiwgYXR0YWNobWVudCwgZmFjZSA9IDApIHtcbiAgaWYgKGF0dGFjaG1lbnQgaW5zdGFuY2VvZiBUZXh0dXJlMkQpIHtcbiAgICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChcbiAgICAgIGdsLkZSQU1FQlVGRkVSLFxuICAgICAgbG9jYXRpb24sXG4gICAgICBnbC5URVhUVVJFXzJELFxuICAgICAgYXR0YWNobWVudC5fZ2xJRCxcbiAgICAgIDBcbiAgICApO1xuICB9IGVsc2UgaWYgKGF0dGFjaG1lbnQgaW5zdGFuY2VvZiBUZXh0dXJlQ3ViZSkge1xuICAgIGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKFxuICAgICAgZ2wuRlJBTUVCVUZGRVIsXG4gICAgICBsb2NhdGlvbixcbiAgICAgIGdsLlRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCArIGZhY2UsXG4gICAgICBhdHRhY2htZW50Ll9nbElELFxuICAgICAgMFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgZ2wuZnJhbWVidWZmZXJSZW5kZXJidWZmZXIoXG4gICAgICBnbC5GUkFNRUJVRkZFUixcbiAgICAgIGxvY2F0aW9uLFxuICAgICAgZ2wuUkVOREVSQlVGRkVSLFxuICAgICAgYXR0YWNobWVudC5fZ2xJRFxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGV2aWNlIHtcbiAgLyoqXG4gICAqIEBwcm9wZXJ0eSBjYXBzXG4gICAqL1xuICBnZXQgY2FwcygpIHtcbiAgICByZXR1cm4gdGhpcy5fY2FwcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjYW52YXNFTFxuICAgKiBAcGFyYW0ge29iamVjdH0gb3B0c1xuICAgKi9cbiAgY29uc3RydWN0b3IoY2FudmFzRUwsIG9wdHMpIHtcbiAgICBsZXQgZ2w7XG5cbiAgICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgICBpZiAob3B0cy5hbHBoYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvcHRzLmFscGhhID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChvcHRzLnN0ZW5jaWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgb3B0cy5zdGVuY2lsID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKG9wdHMuZGVwdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgb3B0cy5kZXB0aCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChvcHRzLmFudGlhbGlhcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvcHRzLmFudGlhbGlhcyA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBOT1RFOiBpdCBpcyBzYWlkIHRoZSBwZXJmb3JtYW5jZSBpbXByb3ZlZCBpbiBtb2JpbGUgZGV2aWNlIHdpdGggdGhpcyBmbGFnIG9mZi5cbiAgICBpZiAob3B0cy5wcmVzZXJ2ZURyYXdpbmdCdWZmZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgb3B0cy5wcmVzZXJ2ZURyYXdpbmdCdWZmZXIgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgZ2wgPSBjYW52YXNFTC5nZXRDb250ZXh0KCd3ZWJnbCcsIG9wdHMpXG4gICAgICAgIHx8IGNhbnZhc0VMLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcsIG9wdHMpXG4gICAgICAgIHx8IGNhbnZhc0VMLmdldENvbnRleHQoJ3dlYmtpdC0zZCcsIG9wdHMpXG4gICAgICAgIHx8IGNhbnZhc0VMLmdldENvbnRleHQoJ21vei13ZWJnbCcsIG9wdHMpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIE5vIGVycm9ycyBhcmUgdGhyb3duIHVzaW5nIHRyeSBjYXRjaFxuICAgIC8vIFRlc3RlZCB0aHJvdWdoIGlvcyBiYWlkdSBicm93c2VyIDQuMTQuMVxuICAgIGlmICghZ2wpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoaXMgZGV2aWNlIGRvZXMgbm90IHN1cHBvcnQgd2ViZ2wnKTtcbiAgICB9XG5cbiAgICAvLyBzdGF0aWNzXG4gICAgLyoqXG4gICAgICogQHR5cGUge1dlYkdMUmVuZGVyaW5nQ29udGV4dH1cbiAgICAgKi9cbiAgICB0aGlzLl9nbCA9IGdsO1xuICAgIHRoaXMuX2V4dGVuc2lvbnMgPSB7fTtcbiAgICB0aGlzLl9jYXBzID0ge307IC8vIGNhcGFiaWxpdHlcbiAgICB0aGlzLl9zdGF0cyA9IHtcbiAgICAgIHRleHR1cmU6IDAsXG4gICAgICB2YjogMCxcbiAgICAgIGliOiAwLFxuICAgICAgZHJhd2NhbGxzOiAwLFxuICAgIH07XG5cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9BUEkvV2ViR0xfQVBJL1VzaW5nX0V4dGVuc2lvbnNcbiAgICB0aGlzLl9pbml0RXh0ZW5zaW9ucyhbXG4gICAgICAnRVhUX3RleHR1cmVfZmlsdGVyX2FuaXNvdHJvcGljJyxcbiAgICAgICdFWFRfc2hhZGVyX3RleHR1cmVfbG9kJyxcbiAgICAgICdPRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMnLFxuICAgICAgJ09FU190ZXh0dXJlX2Zsb2F0JyxcbiAgICAgICdPRVNfdGV4dHVyZV9mbG9hdF9saW5lYXInLFxuICAgICAgJ09FU190ZXh0dXJlX2hhbGZfZmxvYXQnLFxuICAgICAgJ09FU190ZXh0dXJlX2hhbGZfZmxvYXRfbGluZWFyJyxcbiAgICAgICdPRVNfdmVydGV4X2FycmF5X29iamVjdCcsXG4gICAgICAnV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2F0YycsXG4gICAgICAnV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2V0YycsXG4gICAgICAnV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2V0YzEnLFxuICAgICAgJ1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9wdnJ0YycsXG4gICAgICAnV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX3MzdGMnLFxuICAgICAgJ1dFQkdMX2RlcHRoX3RleHR1cmUnLFxuICAgICAgJ1dFQkdMX2RyYXdfYnVmZmVycycsXG4gICAgXSk7XG4gICAgdGhpcy5faW5pdENhcHMoKTtcbiAgICB0aGlzLl9pbml0U3RhdGVzKCk7XG5cbiAgICAvLyBydW50aW1lXG4gICAgU3RhdGUuaW5pdERlZmF1bHQodGhpcyk7XG4gICAgdGhpcy5fY3VycmVudCA9IG5ldyBTdGF0ZSh0aGlzKTtcbiAgICB0aGlzLl9uZXh0ID0gbmV3IFN0YXRlKHRoaXMpO1xuICAgIHRoaXMuX3VuaWZvcm1zID0ge307IC8vIG5hbWU6IHsgdmFsdWUsIG51bSwgZGlydHkgfVxuICAgIHRoaXMuX3Z4ID0gdGhpcy5fdnkgPSB0aGlzLl92dyA9IHRoaXMuX3ZoID0gMDtcbiAgICB0aGlzLl9zeCA9IHRoaXMuX3N5ID0gdGhpcy5fc3cgPSB0aGlzLl9zaCA9IDA7XG4gICAgdGhpcy5fZnJhbWVidWZmZXIgPSBudWxsO1xuXG4gICAgLy9cbiAgICB0aGlzLl9lbmFibGVkQXR0cmlidXRlcyA9IG5ldyBBcnJheSh0aGlzLl9jYXBzLm1heFZlcnRleEF0dHJpYnMpO1xuICAgIHRoaXMuX25ld0F0dHJpYnV0ZXMgPSBuZXcgQXJyYXkodGhpcy5fY2Fwcy5tYXhWZXJ0ZXhBdHRyaWJzKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fY2Fwcy5tYXhWZXJ0ZXhBdHRyaWJzOyArK2kpIHtcbiAgICAgIHRoaXMuX2VuYWJsZWRBdHRyaWJ1dGVzW2ldID0gMDtcbiAgICAgIHRoaXMuX25ld0F0dHJpYnV0ZXNbaV0gPSAwO1xuICAgIH1cbiAgfVxuXG4gIF9pbml0RXh0ZW5zaW9ucyhleHRlbnNpb25zKSB7XG4gICAgY29uc3QgZ2wgPSB0aGlzLl9nbDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXh0ZW5zaW9ucy5sZW5ndGg7ICsraSkge1xuICAgICAgbGV0IG5hbWUgPSBleHRlbnNpb25zW2ldO1xuICAgICAgbGV0IHZlbmRvclByZWZpeGVzID0gW1wiXCIsIFwiV0VCS0lUX1wiLCBcIk1PWl9cIl07XG5cbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmVuZG9yUHJlZml4ZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBsZXQgZXh0ID0gZ2wuZ2V0RXh0ZW5zaW9uKHZlbmRvclByZWZpeGVzW2pdICsgbmFtZSk7XG4gICAgICAgICAgaWYgKGV4dCkge1xuICAgICAgICAgICAgdGhpcy5fZXh0ZW5zaW9uc1tuYW1lXSA9IGV4dDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfaW5pdENhcHMoKSB7XG4gICAgY29uc3QgZ2wgPSB0aGlzLl9nbDtcbiAgICBjb25zdCBleHREcmF3QnVmZmVycyA9IHRoaXMuZXh0KCdXRUJHTF9kcmF3X2J1ZmZlcnMnKTtcblxuICAgIHRoaXMuX2NhcHMubWF4VmVydGV4U3RyZWFtcyA9IDQ7XG4gICAgdGhpcy5fY2Fwcy5tYXhWZXJ0ZXhUZXh0dXJlcyA9IGdsLmdldFBhcmFtZXRlcihnbC5NQVhfVkVSVEVYX1RFWFRVUkVfSU1BR0VfVU5JVFMpO1xuICAgIHRoaXMuX2NhcHMubWF4RnJhZ1VuaWZvcm1zID0gZ2wuZ2V0UGFyYW1ldGVyKGdsLk1BWF9GUkFHTUVOVF9VTklGT1JNX1ZFQ1RPUlMpO1xuICAgIHRoaXMuX2NhcHMubWF4VGV4dHVyZVVuaXRzID0gZ2wuZ2V0UGFyYW1ldGVyKGdsLk1BWF9URVhUVVJFX0lNQUdFX1VOSVRTKTtcbiAgICB0aGlzLl9jYXBzLm1heFZlcnRleEF0dHJpYnMgPSBnbC5nZXRQYXJhbWV0ZXIoZ2wuTUFYX1ZFUlRFWF9BVFRSSUJTKTtcbiAgICB0aGlzLl9jYXBzLm1heFRleHR1cmVTaXplID0gZ2wuZ2V0UGFyYW1ldGVyKGdsLk1BWF9URVhUVVJFX1NJWkUpO1xuXG4gICAgdGhpcy5fY2Fwcy5tYXhEcmF3QnVmZmVycyA9IGV4dERyYXdCdWZmZXJzID8gZ2wuZ2V0UGFyYW1ldGVyKGV4dERyYXdCdWZmZXJzLk1BWF9EUkFXX0JVRkZFUlNfV0VCR0wpIDogMTtcbiAgICB0aGlzLl9jYXBzLm1heENvbG9yQXR0YWNobWVudHMgPSBleHREcmF3QnVmZmVycyA/IGdsLmdldFBhcmFtZXRlcihleHREcmF3QnVmZmVycy5NQVhfQ09MT1JfQVRUQUNITUVOVFNfV0VCR0wpIDogMTtcbiAgfVxuXG4gIF9pbml0U3RhdGVzKCkge1xuICAgIGNvbnN0IGdsID0gdGhpcy5fZ2w7XG5cbiAgICAvLyBnbC5mcm9udEZhY2UoZ2wuQ0NXKTtcbiAgICBnbC5kaXNhYmxlKGdsLkJMRU5EKTtcbiAgICBnbC5ibGVuZEZ1bmMoZ2wuT05FLCBnbC5aRVJPKTtcbiAgICBnbC5ibGVuZEVxdWF0aW9uKGdsLkZVTkNfQUREKTtcbiAgICBnbC5ibGVuZENvbG9yKDEsMSwxLDEpO1xuXG4gICAgZ2wuY29sb3JNYXNrKHRydWUsIHRydWUsIHRydWUsIHRydWUpO1xuXG4gICAgZ2wuZW5hYmxlKGdsLkNVTExfRkFDRSk7XG4gICAgZ2wuY3VsbEZhY2UoZ2wuQkFDSyk7XG5cbiAgICBnbC5kaXNhYmxlKGdsLkRFUFRIX1RFU1QpO1xuICAgIGdsLmRlcHRoRnVuYyhnbC5MRVNTKTtcbiAgICBnbC5kZXB0aE1hc2soZmFsc2UpO1xuICAgIGdsLmRpc2FibGUoZ2wuUE9MWUdPTl9PRkZTRVRfRklMTCk7XG4gICAgZ2wuZGVwdGhSYW5nZSgwLDEpO1xuXG4gICAgZ2wuZGlzYWJsZShnbC5TVEVOQ0lMX1RFU1QpO1xuICAgIGdsLnN0ZW5jaWxGdW5jKGdsLkFMV0FZUywgMCwgMHhGRik7XG4gICAgZ2wuc3RlbmNpbE1hc2soMHhGRik7XG4gICAgZ2wuc3RlbmNpbE9wKGdsLktFRVAsIGdsLktFRVAsIGdsLktFRVApO1xuXG4gICAgLy8gVE9ETzpcbiAgICAvLyB0aGlzLnNldEFscGhhVG9Db3ZlcmFnZShmYWxzZSk7XG4gICAgLy8gdGhpcy5zZXRUcmFuc2Zvcm1GZWVkYmFja0J1ZmZlcihudWxsKTtcbiAgICAvLyB0aGlzLnNldFJhc3Rlcih0cnVlKTtcbiAgICAvLyB0aGlzLnNldERlcHRoQmlhcyhmYWxzZSk7XG5cbiAgICBnbC5jbGVhckRlcHRoKDEpO1xuICAgIGdsLmNsZWFyQ29sb3IoMCwgMCwgMCwgMCk7XG4gICAgZ2wuY2xlYXJTdGVuY2lsKDApO1xuXG4gICAgZ2wuZGlzYWJsZShnbC5TQ0lTU09SX1RFU1QpO1xuICB9XG5cbiAgX3Jlc3RvcmVUZXh0dXJlKHVuaXQpIHtcbiAgICBjb25zdCBnbCA9IHRoaXMuX2dsO1xuXG4gICAgbGV0IHRleHR1cmUgPSB0aGlzLl9jdXJyZW50LnRleHR1cmVVbml0c1t1bml0XTtcbiAgICBpZiAodGV4dHVyZSAmJiB0ZXh0dXJlLl9nbElEICE9PSAtMSkge1xuICAgICAgZ2wuYmluZFRleHR1cmUodGV4dHVyZS5fdGFyZ2V0LCB0ZXh0dXJlLl9nbElEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XG4gICAgfVxuICB9XG5cbiAgX3Jlc3RvcmVJbmRleEJ1ZmZlciAoKSB7XG4gICAgY29uc3QgZ2wgPSB0aGlzLl9nbDtcblxuICAgIGxldCBpYiA9IHRoaXMuX2N1cnJlbnQuaW5kZXhCdWZmZXI7XG4gICAgaWYgKGliICYmIGliLl9nbElEICE9PSAtMSkge1xuICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgaWIuX2dsSUQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIGV4dFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgKi9cbiAgZXh0KG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fZXh0ZW5zaW9uc1tuYW1lXTtcbiAgfVxuXG4gIGFsbG93RmxvYXRUZXh0dXJlKCkge1xuICAgIHJldHVybiB0aGlzLmV4dChcIk9FU190ZXh0dXJlX2Zsb2F0XCIpICE9IG51bGw7XG4gIH1cblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEltbWVkaWF0ZSBTZXR0aW5nc1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgLyoqXG4gICAqIEBtZXRob2Qgc2V0RnJhbWVCdWZmZXJcbiAgICogQHBhcmFtIHtGcmFtZUJ1ZmZlcn0gZmIgLSBudWxsIG1lYW5zIHVzZSB0aGUgYmFja2J1ZmZlclxuICAgKi9cbiAgc2V0RnJhbWVCdWZmZXIoZmIpIHtcbiAgICBpZiAodGhpcy5fZnJhbWVidWZmZXIgPT09IGZiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fZnJhbWVidWZmZXIgPSBmYjtcbiAgICBjb25zdCBnbCA9IHRoaXMuX2dsO1xuXG4gICAgaWYgKCFmYikge1xuICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGZiLl9nbElEKTtcblxuICAgIGxldCBudW1Db2xvcnMgPSBmYi5fY29sb3JzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bUNvbG9yczsgKytpKSB7XG4gICAgICBsZXQgY29sb3JCdWZmZXIgPSBmYi5fY29sb3JzW2ldO1xuICAgICAgX2F0dGFjaChnbCwgZ2wuQ09MT1JfQVRUQUNITUVOVDAgKyBpLCBjb2xvckJ1ZmZlcik7XG5cbiAgICAgIC8vIFRPRE86IHdoYXQgYWJvdXQgY3ViZW1hcCBmYWNlPz8/IHNob3VsZCBiZSB0aGUgdGFyZ2V0IHBhcmFtZXRlciBmb3IgY29sb3JCdWZmZXJcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IG51bUNvbG9yczsgaSA8IHRoaXMuX2NhcHMubWF4Q29sb3JBdHRhY2htZW50czsgKytpKSB7XG4gICAgICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChcbiAgICAgICAgZ2wuRlJBTUVCVUZGRVIsXG4gICAgICAgIGdsLkNPTE9SX0FUVEFDSE1FTlQwICsgaSxcbiAgICAgICAgZ2wuVEVYVFVSRV8yRCxcbiAgICAgICAgbnVsbCxcbiAgICAgICAgMFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoZmIuX2RlcHRoKSB7XG4gICAgICBfYXR0YWNoKGdsLCBnbC5ERVBUSF9BVFRBQ0hNRU5ULCBmYi5fZGVwdGgpO1xuICAgIH1cblxuICAgIGlmIChmYi5fc3RlbmNpbCkge1xuICAgICAgX2F0dGFjaChnbCwgZ2wuU1RFTkNJTF9BVFRBQ0hNRU5ULCBmYi5fc3RlbmNpbCk7XG4gICAgfVxuXG4gICAgaWYgKGZiLl9kZXB0aFN0ZW5jaWwpIHtcbiAgICAgIF9hdHRhY2goZ2wsIGdsLkRFUFRIX1NURU5DSUxfQVRUQUNITUVOVCwgZmIuX2RlcHRoU3RlbmNpbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2Qgc2V0Vmlld3BvcnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHdcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGhcbiAgICovXG4gIHNldFZpZXdwb3J0KHgsIHksIHcsIGgpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLl92eCAhPT0geCB8fFxuICAgICAgdGhpcy5fdnkgIT09IHkgfHxcbiAgICAgIHRoaXMuX3Z3ICE9PSB3IHx8XG4gICAgICB0aGlzLl92aCAhPT0gaFxuICAgICkge1xuICAgICAgdGhpcy5fZ2wudmlld3BvcnQoeCwgeSwgdywgaCk7XG4gICAgICB0aGlzLl92eCA9IHg7XG4gICAgICB0aGlzLl92eSA9IHk7XG4gICAgICB0aGlzLl92dyA9IHc7XG4gICAgICB0aGlzLl92aCA9IGg7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2Qgc2V0U2Npc3NvclxuICAgKiBAcGFyYW0ge051bWJlcn0geFxuICAgKiBAcGFyYW0ge051bWJlcn0geVxuICAgKiBAcGFyYW0ge051bWJlcn0gd1xuICAgKiBAcGFyYW0ge051bWJlcn0gaFxuICAgKi9cbiAgc2V0U2Npc3Nvcih4LCB5LCB3LCBoKSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5fc3ggIT09IHggfHxcbiAgICAgIHRoaXMuX3N5ICE9PSB5IHx8XG4gICAgICB0aGlzLl9zdyAhPT0gdyB8fFxuICAgICAgdGhpcy5fc2ggIT09IGhcbiAgICApIHtcbiAgICAgIHRoaXMuX2dsLnNjaXNzb3IoeCwgeSwgdywgaCk7XG4gICAgICB0aGlzLl9zeCA9IHg7XG4gICAgICB0aGlzLl9zeSA9IHk7XG4gICAgICB0aGlzLl9zdyA9IHc7XG4gICAgICB0aGlzLl9zaCA9IGg7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgY2xlYXJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAgICogQHBhcmFtIHtBcnJheX0gb3B0cy5jb2xvclxuICAgKiBAcGFyYW0ge051bWJlcn0gb3B0cy5kZXB0aFxuICAgKiBAcGFyYW0ge051bWJlcn0gb3B0cy5zdGVuY2lsXG4gICAqL1xuICBjbGVhcihvcHRzKSB7XG4gICAgaWYgKG9wdHMuY29sb3IgPT09IHVuZGVmaW5lZCAmJiBvcHRzLmRlcHRoID09PSB1bmRlZmluZWQgJiYgb3B0cy5zdGVuY2lsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBnbCA9IHRoaXMuX2dsO1xuICAgIGxldCBmbGFncyA9IDA7XG5cbiAgICBpZiAob3B0cy5jb2xvciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmbGFncyB8PSBnbC5DT0xPUl9CVUZGRVJfQklUO1xuICAgICAgZ2wuY2xlYXJDb2xvcihvcHRzLmNvbG9yWzBdLCBvcHRzLmNvbG9yWzFdLCBvcHRzLmNvbG9yWzJdLCBvcHRzLmNvbG9yWzNdKTtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5kZXB0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmbGFncyB8PSBnbC5ERVBUSF9CVUZGRVJfQklUO1xuICAgICAgZ2wuY2xlYXJEZXB0aChvcHRzLmRlcHRoKTtcblxuICAgICAgZ2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xuICAgICAgZ2wuZGVwdGhNYXNrKHRydWUpO1xuICAgICAgZ2wuZGVwdGhGdW5jKGdsLkFMV0FZUyk7XG4gICAgfVxuXG4gICAgaWYgKG9wdHMuc3RlbmNpbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmbGFncyB8PSBnbC5TVEVOQ0lMX0JVRkZFUl9CSVQ7XG4gICAgICBnbC5jbGVhclN0ZW5jaWwob3B0cy5zdGVuY2lsKTtcbiAgICB9XG5cbiAgICBnbC5jbGVhcihmbGFncyk7XG5cbiAgICAvLyByZXN0b3JlIGRlcHRoLXdyaXRlXG4gICAgaWYgKG9wdHMuZGVwdGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHRoaXMuX2N1cnJlbnQuZGVwdGhUZXN0ID09PSBmYWxzZSkge1xuICAgICAgICBnbC5kaXNhYmxlKGdsLkRFUFRIX1RFU1QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnQuZGVwdGhXcml0ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBnbC5kZXB0aE1hc2soZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50LmRlcHRoRnVuYyAhPT0gZW51bXMuRFNfRlVOQ19BTFdBWVMpIHtcbiAgICAgICAgICBnbC5kZXB0aEZ1bmModGhpcy5fY3VycmVudC5kZXB0aEZ1bmMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBEZWZlcnJlZCBTdGF0ZXNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIGVuYWJsZUJsZW5kXG4gICAqL1xuICBlbmFibGVCbGVuZCgpIHtcbiAgICB0aGlzLl9uZXh0LmJsZW5kID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIGVuYWJsZURlcHRoVGVzdFxuICAgKi9cbiAgZW5hYmxlRGVwdGhUZXN0KCkge1xuICAgIHRoaXMuX25leHQuZGVwdGhUZXN0ID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIGVuYWJsZURlcHRoV3JpdGVcbiAgICovXG4gIGVuYWJsZURlcHRoV3JpdGUoKSB7XG4gICAgdGhpcy5fbmV4dC5kZXB0aFdyaXRlID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIGVuYWJsZVN0ZW5jaWxUZXN0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzdGVuY2lsVGVzdFxuICAgKi9cbiAgc2V0U3RlbmNpbFRlc3Qoc3RlbmNpbFRlc3QpIHtcbiAgICB0aGlzLl9uZXh0LnN0ZW5jaWxUZXN0ID0gc3RlbmNpbFRlc3Q7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBzZXRTdGVuY2lsRnVuY1xuICAgKiBAcGFyYW0ge0RTX0ZVTkNfKn0gZnVuY1xuICAgKiBAcGFyYW0ge051bWJlcn0gcmVmXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtYXNrXG4gICAqL1xuICBzZXRTdGVuY2lsRnVuYyhmdW5jLCByZWYsIG1hc2spIHtcbiAgICB0aGlzLl9uZXh0LnN0ZW5jaWxTZXAgPSBmYWxzZTtcbiAgICB0aGlzLl9uZXh0LnN0ZW5jaWxGdW5jRnJvbnQgPSB0aGlzLl9uZXh0LnN0ZW5jaWxGdW5jQmFjayA9IGZ1bmM7XG4gICAgdGhpcy5fbmV4dC5zdGVuY2lsUmVmRnJvbnQgPSB0aGlzLl9uZXh0LnN0ZW5jaWxSZWZCYWNrID0gcmVmO1xuICAgIHRoaXMuX25leHQuc3RlbmNpbE1hc2tGcm9udCA9IHRoaXMuX25leHQuc3RlbmNpbE1hc2tCYWNrID0gbWFzaztcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIHNldFN0ZW5jaWxGdW5jRnJvbnRcbiAgICogQHBhcmFtIHtEU19GVU5DXyp9IGZ1bmNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHJlZlxuICAgKiBAcGFyYW0ge051bWJlcn0gbWFza1xuICAgKi9cbiAgc2V0U3RlbmNpbEZ1bmNGcm9udChmdW5jLCByZWYsIG1hc2spIHtcbiAgICB0aGlzLl9uZXh0LnN0ZW5jaWxTZXAgPSB0cnVlO1xuICAgIHRoaXMuX25leHQuc3RlbmNpbEZ1bmNGcm9udCA9IGZ1bmM7XG4gICAgdGhpcy5fbmV4dC5zdGVuY2lsUmVmRnJvbnQgPSByZWY7XG4gICAgdGhpcy5fbmV4dC5zdGVuY2lsTWFza0Zyb250ID0gbWFzaztcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIHNldFN0ZW5jaWxGdW5jQmFja1xuICAgKiBAcGFyYW0ge0RTX0ZVTkNfKn0gZnVuY1xuICAgKiBAcGFyYW0ge051bWJlcn0gcmVmXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtYXNrXG4gICAqL1xuICBzZXRTdGVuY2lsRnVuY0JhY2soZnVuYywgcmVmLCBtYXNrKSB7XG4gICAgdGhpcy5fbmV4dC5zdGVuY2lsU2VwID0gdHJ1ZTtcbiAgICB0aGlzLl9uZXh0LnN0ZW5jaWxGdW5jQmFjayA9IGZ1bmM7XG4gICAgdGhpcy5fbmV4dC5zdGVuY2lsUmVmQmFjayA9IHJlZjtcbiAgICB0aGlzLl9uZXh0LnN0ZW5jaWxNYXNrQmFjayA9IG1hc2s7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBzZXRTdGVuY2lsT3BcbiAgICogQHBhcmFtIHtTVEVOQ0lMX09QXyp9IGZhaWxPcFxuICAgKiBAcGFyYW0ge1NURU5DSUxfT1BfKn0gekZhaWxPcFxuICAgKiBAcGFyYW0ge1NURU5DSUxfT1BfKn0gelBhc3NPcFxuICAgKiBAcGFyYW0ge051bWJlcn0gd3JpdGVNYXNrXG4gICAqL1xuICBzZXRTdGVuY2lsT3AoZmFpbE9wLCB6RmFpbE9wLCB6UGFzc09wLCB3cml0ZU1hc2spIHtcbiAgICB0aGlzLl9uZXh0LnN0ZW5jaWxGYWlsT3BGcm9udCA9IHRoaXMuX25leHQuc3RlbmNpbEZhaWxPcEJhY2sgPSBmYWlsT3A7XG4gICAgdGhpcy5fbmV4dC5zdGVuY2lsWkZhaWxPcEZyb250ID0gdGhpcy5fbmV4dC5zdGVuY2lsWkZhaWxPcEJhY2sgPSB6RmFpbE9wO1xuICAgIHRoaXMuX25leHQuc3RlbmNpbFpQYXNzT3BGcm9udCA9IHRoaXMuX25leHQuc3RlbmNpbFpQYXNzT3BCYWNrID0gelBhc3NPcDtcbiAgICB0aGlzLl9uZXh0LnN0ZW5jaWxXcml0ZU1hc2tGcm9udCA9IHRoaXMuX25leHQuc3RlbmNpbFdyaXRlTWFza0JhY2sgPSB3cml0ZU1hc2s7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBzZXRTdGVuY2lsT3BGcm9udFxuICAgKiBAcGFyYW0ge1NURU5DSUxfT1BfKn0gZmFpbE9wXG4gICAqIEBwYXJhbSB7U1RFTkNJTF9PUF8qfSB6RmFpbE9wXG4gICAqIEBwYXJhbSB7U1RFTkNJTF9PUF8qfSB6UGFzc09wXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB3cml0ZU1hc2tcbiAgICovXG4gIHNldFN0ZW5jaWxPcEZyb250KGZhaWxPcCwgekZhaWxPcCwgelBhc3NPcCwgd3JpdGVNYXNrKSB7XG4gICAgdGhpcy5fbmV4dC5zdGVuY2lsU2VwID0gdHJ1ZTtcbiAgICB0aGlzLl9uZXh0LnN0ZW5jaWxGYWlsT3BGcm9udCA9IGZhaWxPcDtcbiAgICB0aGlzLl9uZXh0LnN0ZW5jaWxaRmFpbE9wRnJvbnQgPSB6RmFpbE9wO1xuICAgIHRoaXMuX25leHQuc3RlbmNpbFpQYXNzT3BGcm9udCA9IHpQYXNzT3A7XG4gICAgdGhpcy5fbmV4dC5zdGVuY2lsV3JpdGVNYXNrRnJvbnQgPSB3cml0ZU1hc2s7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBzZXRTdGVuY2lsT3BCYWNrXG4gICAqIEBwYXJhbSB7U1RFTkNJTF9PUF8qfSBmYWlsT3BcbiAgICogQHBhcmFtIHtTVEVOQ0lMX09QXyp9IHpGYWlsT3BcbiAgICogQHBhcmFtIHtTVEVOQ0lMX09QXyp9IHpQYXNzT3BcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHdyaXRlTWFza1xuICAgKi9cbiAgc2V0U3RlbmNpbE9wQmFjayhmYWlsT3AsIHpGYWlsT3AsIHpQYXNzT3AsIHdyaXRlTWFzaykge1xuICAgIHRoaXMuX25leHQuc3RlbmNpbFNlcCA9IHRydWU7XG4gICAgdGhpcy5fbmV4dC5zdGVuY2lsRmFpbE9wQmFjayA9IGZhaWxPcDtcbiAgICB0aGlzLl9uZXh0LnN0ZW5jaWxaRmFpbE9wQmFjayA9IHpGYWlsT3A7XG4gICAgdGhpcy5fbmV4dC5zdGVuY2lsWlBhc3NPcEJhY2sgPSB6UGFzc09wO1xuICAgIHRoaXMuX25leHQuc3RlbmNpbFdyaXRlTWFza0JhY2sgPSB3cml0ZU1hc2s7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBzZXREZXB0aEZ1bmNcbiAgICogQHBhcmFtIHtEU19GVU5DXyp9IGRlcHRoRnVuY1xuICAgKi9cbiAgc2V0RGVwdGhGdW5jKGRlcHRoRnVuYykge1xuICAgIHRoaXMuX25leHQuZGVwdGhGdW5jID0gZGVwdGhGdW5jO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2Qgc2V0QmxlbmRDb2xvcjMyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSByZ2JhXG4gICAqL1xuICBzZXRCbGVuZENvbG9yMzIocmdiYSkge1xuICAgIHRoaXMuX25leHQuYmxlbmRDb2xvciA9IHJnYmE7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBzZXRCbGVuZENvbG9yXG4gICAqIEBwYXJhbSB7TnVtYmVyfSByXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBnXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBiXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhXG4gICAqL1xuICBzZXRCbGVuZENvbG9yKHIsIGcsIGIsIGEpIHtcbiAgICB0aGlzLl9uZXh0LmJsZW5kQ29sb3IgPSAoKHIgKiAyNTUpIDw8IDI0IHwgKGcgKiAyNTUpIDw8IDE2IHwgKGIgKiAyNTUpIDw8IDggfCBhICogMjU1KSA+Pj4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIHNldEJsZW5kRnVuY1xuICAgKiBAcGFyYW0ge0JFTE5EXyp9IHNyY1xuICAgKiBAcGFyYW0ge0JFTE5EXyp9IGRzdFxuICAgKi9cbiAgc2V0QmxlbmRGdW5jKHNyYywgZHN0KSB7XG4gICAgdGhpcy5fbmV4dC5ibGVuZFNlcCA9IGZhbHNlO1xuICAgIHRoaXMuX25leHQuYmxlbmRTcmMgPSBzcmM7XG4gICAgdGhpcy5fbmV4dC5ibGVuZERzdCA9IGRzdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIHNldEJsZW5kRnVuY1NlcFxuICAgKiBAcGFyYW0ge0JFTE5EXyp9IHNyY1xuICAgKiBAcGFyYW0ge0JFTE5EXyp9IGRzdFxuICAgKiBAcGFyYW0ge0JFTE5EXyp9IHNyY0FscGhhXG4gICAqIEBwYXJhbSB7QkVMTkRfKn0gZHN0QWxwaGFcbiAgICovXG4gIHNldEJsZW5kRnVuY1NlcChzcmMsIGRzdCwgc3JjQWxwaGEsIGRzdEFscGhhKSB7XG4gICAgdGhpcy5fbmV4dC5ibGVuZFNlcCA9IHRydWU7XG4gICAgdGhpcy5fbmV4dC5ibGVuZFNyYyA9IHNyYztcbiAgICB0aGlzLl9uZXh0LmJsZW5kRHN0ID0gZHN0O1xuICAgIHRoaXMuX25leHQuYmxlbmRTcmNBbHBoYSA9IHNyY0FscGhhO1xuICAgIHRoaXMuX25leHQuYmxlbmREc3RBbHBoYSA9IGRzdEFscGhhO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2Qgc2V0QmxlbmRFcVxuICAgKiBAcGFyYW0ge0JFTE5EX0ZVTkNfKn0gZXFcbiAgICovXG4gIHNldEJsZW5kRXEoZXEpIHtcbiAgICB0aGlzLl9uZXh0LmJsZW5kU2VwID0gZmFsc2U7XG4gICAgdGhpcy5fbmV4dC5ibGVuZEVxID0gZXE7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBzZXRCbGVuZEVxU2VwXG4gICAqIEBwYXJhbSB7QkVMTkRfRlVOQ18qfSBlcVxuICAgKiBAcGFyYW0ge0JFTE5EX0ZVTkNfKn0gYWxwaGFFcVxuICAgKi9cbiAgc2V0QmxlbmRFcVNlcChlcSwgYWxwaGFFcSkge1xuICAgIHRoaXMuX25leHQuYmxlbmRTZXAgPSB0cnVlO1xuICAgIHRoaXMuX25leHQuYmxlbmRFcSA9IGVxO1xuICAgIHRoaXMuX25leHQuYmxlbmRBbHBoYUVxID0gYWxwaGFFcTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIHNldEN1bGxNb2RlXG4gICAqIEBwYXJhbSB7Q1VMTF8qfSBtb2RlXG4gICAqL1xuICBzZXRDdWxsTW9kZShtb2RlKSB7XG4gICAgdGhpcy5fbmV4dC5jdWxsTW9kZSA9IG1vZGU7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBzZXRWZXJ0ZXhCdWZmZXJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN0cmVhbVxuICAgKiBAcGFyYW0ge1ZlcnRleEJ1ZmZlcn0gYnVmZmVyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydCAtIHN0YXJ0IHZlcnRleFxuICAgKi9cbiAgc2V0VmVydGV4QnVmZmVyKHN0cmVhbSwgYnVmZmVyLCBzdGFydCA9IDApIHtcbiAgICB0aGlzLl9uZXh0LnZlcnRleEJ1ZmZlcnNbc3RyZWFtXSA9IGJ1ZmZlcjtcbiAgICB0aGlzLl9uZXh0LnZlcnRleEJ1ZmZlck9mZnNldHNbc3RyZWFtXSA9IHN0YXJ0O1xuICAgIGlmICh0aGlzLl9uZXh0Lm1heFN0cmVhbSA8IHN0cmVhbSkge1xuICAgICAgdGhpcy5fbmV4dC5tYXhTdHJlYW0gPSBzdHJlYW07XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2Qgc2V0SW5kZXhCdWZmZXJcbiAgICogQHBhcmFtIHtJbmRleEJ1ZmZlcn0gYnVmZmVyXG4gICAqL1xuICBzZXRJbmRleEJ1ZmZlcihidWZmZXIpIHtcbiAgICB0aGlzLl9uZXh0LmluZGV4QnVmZmVyID0gYnVmZmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2Qgc2V0UHJvZ3JhbVxuICAgKiBAcGFyYW0ge1Byb2dyYW19IHByb2dyYW1cbiAgICovXG4gIHNldFByb2dyYW0ocHJvZ3JhbSkge1xuICAgIHRoaXMuX25leHQucHJvZ3JhbSA9IHByb2dyYW07XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBzZXRUZXh0dXJlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAqIEBwYXJhbSB7VGV4dHVyZX0gdGV4dHVyZVxuICAgKiBAcGFyYW0ge051bWJlcn0gc2xvdFxuICAgKi9cbiAgc2V0VGV4dHVyZShuYW1lLCB0ZXh0dXJlLCBzbG90KSB7XG4gICAgaWYgKHNsb3QgPj0gdGhpcy5fY2Fwcy5tYXhUZXh0dXJlVW5pdHMpIHtcbiAgICAgIGNvbnNvbGUud2FybihgQ2FuIG5vdCBzZXQgdGV4dHVyZSAke25hbWV9IGF0IHN0YWdlICR7c2xvdH0sIG1heCB0ZXh0dXJlIGV4Y2VlZDogJHt0aGlzLl9jYXBzLm1heFRleHR1cmVVbml0c31gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9uZXh0LnRleHR1cmVVbml0c1tzbG90XSA9IHRleHR1cmU7XG4gICAgdGhpcy5zZXRVbmlmb3JtKG5hbWUsIHNsb3QpO1xuXG4gICAgaWYgKHRoaXMuX25leHQubWF4VGV4dHVyZVNsb3QgPCBzbG90KSB7XG4gICAgICB0aGlzLl9uZXh0Lm1heFRleHR1cmVTbG90ID0gc2xvdDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBzZXRUZXh0dXJlQXJyYXlcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgICogQHBhcmFtIHtBcnJheX0gdGV4dHVyZXNcbiAgICogQHBhcmFtIHtJbnQzMkFycmF5fSBzbG90c1xuICAgKi9cbiAgc2V0VGV4dHVyZUFycmF5KG5hbWUsIHRleHR1cmVzLCBzbG90cykge1xuICAgIGxldCBsZW4gPSB0ZXh0dXJlcy5sZW5ndGg7XG4gICAgaWYgKGxlbiA+PSB0aGlzLl9jYXBzLm1heFRleHR1cmVVbml0cykge1xuICAgICAgY29uc29sZS53YXJuKGBDYW4gbm90IHNldCAke2xlbn0gdGV4dHVyZXMgZm9yICR7bmFtZX0sIG1heCB0ZXh0dXJlIGV4Y2VlZDogJHt0aGlzLl9jYXBzLm1heFRleHR1cmVVbml0c31gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgbGV0IHNsb3QgPSBzbG90c1tpXTtcbiAgICAgIHRoaXMuX25leHQudGV4dHVyZVVuaXRzW3Nsb3RdID0gdGV4dHVyZXNbaV07XG5cbiAgICAgIGlmICh0aGlzLl9uZXh0Lm1heFRleHR1cmVTbG90IDwgc2xvdCkge1xuICAgICAgICB0aGlzLl9uZXh0Lm1heFRleHR1cmVTbG90ID0gc2xvdDtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zZXRVbmlmb3JtKG5hbWUsIHNsb3RzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIHNldFVuaWZvcm1cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKi9cbiAgc2V0VW5pZm9ybShuYW1lLCB2YWx1ZSkge1xuICAgIGxldCB1bmlmb3JtID0gdGhpcy5fdW5pZm9ybXNbbmFtZV07XG5cbiAgICBsZXQgc2FtZVR5cGUgPSBmYWxzZTtcbiAgICBsZXQgaXNBcnJheSA9IGZhbHNlLCBpc0Zsb2F0MzJBcnJheSA9IGZhbHNlLCBpc0ludDMyQXJyYXkgPSBmYWxzZTtcbiAgICBkbyB7XG4gICAgICBpZiAoIXVuaWZvcm0pIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlzRmxvYXQzMkFycmF5ID0gQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgdmFsdWUgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXk7XG4gICAgICBpc0ludDMyQXJyYXkgPSB2YWx1ZSBpbnN0YW5jZW9mIEludDMyQXJyYXk7XG4gICAgICBpc0FycmF5ID0gaXNGbG9hdDMyQXJyYXkgfHwgaXNJbnQzMkFycmF5O1xuICAgICAgaWYgKHVuaWZvcm0uaXNBcnJheSAhPT0gaXNBcnJheSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgaWYgKHVuaWZvcm0uaXNBcnJheSAmJiB1bmlmb3JtLnZhbHVlLmxlbmd0aCAhPT0gdmFsdWUubGVuZ3RoKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBzYW1lVHlwZSA9IHRydWU7XG4gICAgfSB3aGlsZSAoZmFsc2UpO1xuXG4gICAgaWYgKCFzYW1lVHlwZSkge1xuICAgICAgbGV0IG5ld1ZhbHVlID0gdmFsdWU7XG4gICAgICBpZiAoaXNGbG9hdDMyQXJyYXkpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBuZXcgRmxvYXQzMkFycmF5KHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGlzSW50MzJBcnJheSkge1xuICAgICAgICBuZXdWYWx1ZSA9IG5ldyBJbnQzMkFycmF5KHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgdW5pZm9ybSA9IHtcbiAgICAgICAgZGlydHk6IHRydWUsXG4gICAgICAgIHZhbHVlOiBuZXdWYWx1ZSxcbiAgICAgICAgaXNBcnJheTogaXNBcnJheVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG9sZFZhbHVlID0gdW5pZm9ybS52YWx1ZTtcbiAgICAgIGxldCBkaXJ0eSA9IGZhbHNlO1xuICAgICAgaWYgKHVuaWZvcm0uaXNBcnJheSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IG9sZFZhbHVlLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIGlmIChvbGRWYWx1ZVtpXSAhPT0gdmFsdWVbaV0pIHtcbiAgICAgICAgICAgIGRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIG9sZFZhbHVlW2ldID0gdmFsdWVbaV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgaWYgKG9sZFZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICAgIGRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICB1bmlmb3JtLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGRpcnR5KSB7XG4gICAgICAgIHVuaWZvcm0uZGlydHkgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl91bmlmb3Jtc1tuYW1lXSA9IHVuaWZvcm07XG4gIH1cblxuICBzZXRVbmlmb3JtRGlyZWN0bHkobmFtZSwgdmFsdWUpIHtcbiAgICBsZXQgdW5pZm9ybSA9IHRoaXMuX3VuaWZvcm1zW25hbWVdO1xuICAgIGlmICghdW5pZm9ybSkge1xuICAgICAgdGhpcy5fdW5pZm9ybXNbbmFtZV0gPSB1bmlmb3JtID0ge307XG4gICAgfVxuICAgIHVuaWZvcm0uZGlydHkgPSB0cnVlO1xuICAgIHVuaWZvcm0udmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIHNldFByaW1pdGl2ZVR5cGVcbiAgICogQHBhcmFtIHtQVF8qfSB0eXBlXG4gICAqL1xuICBzZXRQcmltaXRpdmVUeXBlKHR5cGUpIHtcbiAgICB0aGlzLl9uZXh0LnByaW1pdGl2ZVR5cGUgPSB0eXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgcmVzZXREcmF3Q2FsbHNcbiAgICovXG4gIHJlc2V0RHJhd0NhbGxzICgpIHtcbiAgICB0aGlzLl9zdGF0cy5kcmF3Y2FsbHMgPSAwO1xuICB9XG4gIFxuICAvKipcbiAgICogQG1ldGhvZCBnZXREcmF3Q2FsbHNcbiAgICovXG4gIGdldERyYXdDYWxscyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRzLmRyYXdjYWxscztcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIGRyYXdcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGJhc2VcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50XG4gICAqL1xuICBkcmF3KGJhc2UsIGNvdW50KSB7XG4gICAgY29uc3QgZ2wgPSB0aGlzLl9nbDtcbiAgICBsZXQgY3VyID0gdGhpcy5fY3VycmVudDtcbiAgICBsZXQgbmV4dCA9IHRoaXMuX25leHQ7XG5cbiAgICAvLyBjb21taXQgYmxlbmRcbiAgICBfY29tbWl0QmxlbmRTdGF0ZXMoZ2wsIGN1ciwgbmV4dCk7XG5cbiAgICAvLyBjb21taXQgZGVwdGhcbiAgICBfY29tbWl0RGVwdGhTdGF0ZXMoZ2wsIGN1ciwgbmV4dCk7XG5cbiAgICAvLyBjb21taXQgc3RlbmNpbFxuICAgIF9jb21taXRTdGVuY2lsU3RhdGVzKGdsLCBjdXIsIG5leHQpO1xuXG4gICAgLy8gY29tbWl0IGN1bGxcbiAgICBfY29tbWl0Q3VsbE1vZGUoZ2wsIGN1ciwgbmV4dCk7XG5cbiAgICAvLyBjb21taXQgdmVydGV4LWJ1ZmZlclxuICAgIF9jb21taXRWZXJ0ZXhCdWZmZXJzKHRoaXMsIGdsLCBjdXIsIG5leHQpO1xuXG4gICAgLy8gY29tbWl0IGluZGV4LWJ1ZmZlclxuICAgIGlmIChjdXIuaW5kZXhCdWZmZXIgIT09IG5leHQuaW5kZXhCdWZmZXIpIHtcbiAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG5leHQuaW5kZXhCdWZmZXIgJiYgbmV4dC5pbmRleEJ1ZmZlci5fZ2xJRCAhPT0gLTEgPyBuZXh0LmluZGV4QnVmZmVyLl9nbElEIDogbnVsbCk7XG4gICAgfVxuXG4gICAgLy8gY29tbWl0IHByb2dyYW1cbiAgICBsZXQgcHJvZ3JhbURpcnR5ID0gZmFsc2U7XG4gICAgaWYgKGN1ci5wcm9ncmFtICE9PSBuZXh0LnByb2dyYW0pIHtcbiAgICAgIGlmIChuZXh0LnByb2dyYW0uX2xpbmtlZCkge1xuICAgICAgICBnbC51c2VQcm9ncmFtKG5leHQucHJvZ3JhbS5fZ2xJRCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0ZhaWxlZCB0byB1c2UgcHJvZ3JhbTogaGFzIG5vdCBsaW5rZWQgeWV0LicpO1xuICAgICAgfVxuICAgICAgcHJvZ3JhbURpcnR5ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBjb21taXQgdGV4dHVyZS9zYW1wbGVyXG4gICAgX2NvbW1pdFRleHR1cmVzKGdsLCBjdXIsIG5leHQpO1xuXG4gICAgLy8gY29tbWl0IHVuaWZvcm1zXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXh0LnByb2dyYW0uX3VuaWZvcm1zLmxlbmd0aDsgKytpKSB7XG4gICAgICBsZXQgdW5pZm9ybUluZm8gPSBuZXh0LnByb2dyYW0uX3VuaWZvcm1zW2ldO1xuICAgICAgbGV0IHVuaWZvcm0gPSB0aGlzLl91bmlmb3Jtc1t1bmlmb3JtSW5mby5uYW1lXTtcbiAgICAgIGlmICghdW5pZm9ybSkge1xuICAgICAgICAvLyBjb25zb2xlLndhcm4oYENhbiBub3QgZmluZCB1bmlmb3JtICR7dW5pZm9ybUluZm8ubmFtZX1gKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICghcHJvZ3JhbURpcnR5ICYmICF1bmlmb3JtLmRpcnR5KSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB1bmlmb3JtLmRpcnR5ID0gZmFsc2U7XG5cbiAgICAgIC8vIFRPRE86IHBsZWFzZSBjb25zaWRlciBhcnJheSB1bmlmb3JtOiB1bmlmb3JtSW5mby5zaXplID4gMFxuXG4gICAgICBsZXQgY29tbWl0RnVuYyA9ICh1bmlmb3JtSW5mby5zaXplID09PSB1bmRlZmluZWQpID8gX3R5cGUydW5pZm9ybUNvbW1pdFt1bmlmb3JtSW5mby50eXBlXSA6IF90eXBlMnVuaWZvcm1BcnJheUNvbW1pdFt1bmlmb3JtSW5mby50eXBlXTtcbiAgICAgIGlmICghY29tbWl0RnVuYykge1xuICAgICAgICBjb25zb2xlLndhcm4oYENhbiBub3QgZmluZCBjb21taXQgZnVuY3Rpb24gZm9yIHVuaWZvcm0gJHt1bmlmb3JtSW5mby5uYW1lfWApO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29tbWl0RnVuYyhnbCwgdW5pZm9ybUluZm8ubG9jYXRpb24sIHVuaWZvcm0udmFsdWUpO1xuICAgIH1cblxuICAgIGlmIChjb3VudCkge1xuICAgICAgLy8gZHJhd1ByaW1pdGl2ZXNcbiAgICAgIGlmIChuZXh0LmluZGV4QnVmZmVyKSB7XG4gICAgICAgIGdsLmRyYXdFbGVtZW50cyhcbiAgICAgICAgICB0aGlzLl9uZXh0LnByaW1pdGl2ZVR5cGUsXG4gICAgICAgICAgY291bnQsXG4gICAgICAgICAgbmV4dC5pbmRleEJ1ZmZlci5fZm9ybWF0LFxuICAgICAgICAgIGJhc2UgKiBuZXh0LmluZGV4QnVmZmVyLl9ieXRlc1BlckluZGV4XG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnbC5kcmF3QXJyYXlzKFxuICAgICAgICAgIHRoaXMuX25leHQucHJpbWl0aXZlVHlwZSxcbiAgICAgICAgICBiYXNlLFxuICAgICAgICAgIGNvdW50XG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIC8vIHVwZGF0ZSBzdGF0c1xuICAgICAgdGhpcy5fc3RhdHMuZHJhd2NhbGxzKys7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogYXV0b2dlbiBtaXBtYXAgZm9yIGNvbG9yIGJ1ZmZlclxuICAgIC8vIGlmICh0aGlzLl9mcmFtZWJ1ZmZlciAmJiB0aGlzLl9mcmFtZWJ1ZmZlci5jb2xvcnNbMF0ubWlwbWFwKSB7XG4gICAgLy8gICBnbC5iaW5kVGV4dHVyZSh0aGlzLl9mcmFtZWJ1ZmZlci5jb2xvcnNbaV0uX3RhcmdldCwgY29sb3JzW2ldLl9nbElEKTtcbiAgICAvLyAgIGdsLmdlbmVyYXRlTWlwbWFwKHRoaXMuX2ZyYW1lYnVmZmVyLmNvbG9yc1tpXS5fdGFyZ2V0KTtcbiAgICAvLyB9XG5cbiAgICAvLyByZXNldCBzdGF0ZXNcbiAgICBjdXIuc2V0KG5leHQpO1xuICAgIG5leHQucmVzZXQoKTtcbiAgfVxufSJdLCJzb3VyY2VSb290IjoiLyJ9