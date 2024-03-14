
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/preprocess-class.js';
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
var js = require('./js');

var Attrs = require('./attribute'); // 增加预处理属性这个步骤的目的是降低 CCClass 的实现难度，将比较稳定的通用逻辑和一些需求比较灵活的属性需求分隔开。


var SerializableAttrs = {
  "default": {},
  serializable: {},
  editorOnly: {},
  formerlySerializedAs: {}
};
var TYPO_TO_CORRECT_DEV = CC_DEV && {
  extend: 'extends',
  property: 'properties',
  "static": 'statics',
  constructor: 'ctor'
}; // 预处理 notify 等扩展属性

function parseNotify(val, propName, notify, properties) {
  if (val.get || val.set) {
    if (CC_DEV) {
      cc.warnID(5500);
    }

    return;
  }

  if (val.hasOwnProperty('default')) {
    // 添加新的内部属性，将原来的属性修改为 getter/setter 形式
    // （以 _ 开头将自动设置property 为 visible: false）
    var newKey = "_N$" + propName;

    val.get = function () {
      return this[newKey];
    };

    val.set = function (value) {
      var oldValue = this[newKey];
      this[newKey] = value;
      notify.call(this, oldValue);
    };

    if (CC_EDITOR) {
      val.notifyFor = newKey;
    }

    var newValue = {};
    properties[newKey] = newValue; // 将不能用于get方法中的属性移动到newValue中

    for (var attr in SerializableAttrs) {
      var v = SerializableAttrs[attr];

      if (val.hasOwnProperty(attr)) {
        newValue[attr] = val[attr];

        if (!v.canUsedInGet) {
          delete val[attr];
        }
      }
    }
  } else if (CC_DEV) {
    cc.warnID(5501);
  }
}

function parseType(val, type, className, propName) {
  var STATIC_CHECK = CC_EDITOR && CC_DEV || CC_TEST;

  if (Array.isArray(type)) {
    if (STATIC_CHECK && 'default' in val) {
      var isArray = require('./CCClass').isArray; // require lazily to avoid circular require() calls


      if (!isArray(val["default"])) {
        cc.warnID(5507, className, propName);
      }
    }

    if (type.length > 0) {
      val.type = type = type[0];
    } else {
      return cc.errorID(5508, className, propName);
    }
  }

  if (typeof type === 'function') {
    if (type === String) {
      val.type = cc.String;

      if (STATIC_CHECK) {
        cc.warnID(3608, "\"" + className + "." + propName + "\"");
      }
    } else if (type === Boolean) {
      val.type = cc.Boolean;

      if (STATIC_CHECK) {
        cc.warnID(3609, "\"" + className + "." + propName + "\"");
      }
    } else if (type === Number) {
      val.type = cc.Float;

      if (STATIC_CHECK) {
        cc.warnID(3610, "\"" + className + "." + propName + "\"");
      }
    }
  } else if (STATIC_CHECK) {
    switch (type) {
      case 'Number':
        cc.warnID(5510, className, propName);
        break;

      case 'String':
        cc.warn("The type of \"" + className + "." + propName + "\" must be cc.String, not \"String\".");
        break;

      case 'Boolean':
        cc.warn("The type of \"" + className + "." + propName + "\" must be cc.Boolean, not \"Boolean\".");
        break;

      case 'Float':
        cc.warn("The type of \"" + className + "." + propName + "\" must be cc.Float, not \"Float\".");
        break;

      case 'Integer':
        cc.warn("The type of \"" + className + "." + propName + "\" must be cc.Integer, not \"Integer\".");
        break;

      case null:
        cc.warnID(5511, className, propName);
        break;
    }
  }

  if (CC_EDITOR && typeof type === 'function') {
    if (cc.Class._isCCClass(type) && val.serializable !== false && !js._getClassId(type, false)) {
      cc.warnID(5512, className, propName, className, propName);
    }
  }
}

function getBaseClassWherePropertyDefined_DEV(propName, cls) {
  if (CC_DEV) {
    var res;

    for (; cls && cls.__props__ && cls.__props__.indexOf(propName) !== -1; cls = cls.$super) {
      res = cls;
    }

    if (!res) {
      cc.error('unknown error');
    }

    return res;
  }
}

function _wrapOptions(isES6Getset, _default, type) {
  var res = isES6Getset ? {
    _short: true
  } : {
    _short: true,
    "default": _default
  };

  if (type) {
    res.type = type;
  }

  return res;
}

exports.getFullFormOfProperty = function (options, isES6Getset) {
  var isLiteral = options && options.constructor === Object;

  if (isLiteral) {
    return null;
  }

  if (Array.isArray(options) && options.length > 0) {
    return _wrapOptions(isES6Getset, [], options);
  } else if (typeof options === 'function') {
    return _wrapOptions(isES6Getset, js.isChildClassOf(options, cc.ValueType) ? new options() : null, options);
  } else if (options instanceof Attrs.PrimitiveType) {
    return _wrapOptions(isES6Getset, options["default"]);
  } else {
    return _wrapOptions(isES6Getset, options);
  }
};

exports.preprocessAttrs = function (properties, className, cls, es6) {
  for (var propName in properties) {
    var val = properties[propName];
    var fullForm = exports.getFullFormOfProperty(val, false);

    if (fullForm) {
      val = properties[propName] = fullForm;
    }

    if (val) {
      if (CC_EDITOR) {
        if ('default' in val) {
          if (val.get) {
            cc.errorID(5513, className, propName);
          } else if (val.set) {
            cc.errorID(5514, className, propName);
          } else if (cc.Class._isCCClass(val["default"])) {
            val["default"] = null;
            cc.errorID(5515, className, propName);
          }
        } else if (!val.get && !val.set) {
          var maybeTypeScript = es6;

          if (!maybeTypeScript) {
            cc.errorID(5516, className, propName);
          }
        }
      }

      if (CC_DEV && !val.override && cls.__props__.indexOf(propName) !== -1) {
        // check override
        var baseClass = js.getClassName(getBaseClassWherePropertyDefined_DEV(propName, cls));
        cc.warnID(5517, className, propName, baseClass, propName);
      }

      var notify = val.notify;

      if (notify) {
        if (CC_DEV && es6) {
          cc.error('not yet support notify attribute for ES6 Classes');
        } else {
          parseNotify(val, propName, notify, properties);
        }
      }

      if ('type' in val) {
        parseType(val, val.type, className, propName);
      }
    }
  }
};

if (CC_DEV) {
  var CALL_SUPER_DESTROY_REG_DEV = /\b\._super\b|destroy\s*\.\s*call\s*\(\s*\w+\s*[,|)]/;

  exports.doValidateMethodWithProps_DEV = function (func, funcName, className, cls, base) {
    if (cls.__props__ && cls.__props__.indexOf(funcName) >= 0) {
      // find class that defines this method as a property
      var baseClassName = js.getClassName(getBaseClassWherePropertyDefined_DEV(funcName, cls));
      cc.errorID(3648, className, funcName, baseClassName);
      return false;
    }

    if (funcName === 'destroy' && js.isChildClassOf(base, cc.Component) && !CALL_SUPER_DESTROY_REG_DEV.test(func)) {
      cc.error("Overwriting '" + funcName + "' function in '" + className + "' class without calling super is not allowed. Call the super function in '" + funcName + "' please.");
    }
  };
}

exports.validateMethodWithProps = function (func, funcName, className, cls, base) {
  if (CC_DEV && funcName === 'constructor') {
    cc.errorID(3643, className);
    return false;
  }

  if (typeof func === 'function' || func === null) {
    if (CC_DEV) {
      this.doValidateMethodWithProps_DEV(func, funcName, className, cls, base);
    }
  } else {
    if (CC_DEV) {
      if (func === false && base && base.prototype) {
        // check override
        var overrided = base.prototype[funcName];

        if (typeof overrided === 'function') {
          var baseFuc = js.getClassName(base) + '.' + funcName;
          var subFuc = className + '.' + funcName;
          cc.warnID(3624, subFuc, baseFuc, subFuc, subFuc);
        }
      }

      var correct = TYPO_TO_CORRECT_DEV[funcName];

      if (correct) {
        cc.warnID(3621, className, funcName, correct);
      } else if (func) {
        cc.errorID(3622, className, funcName);
      }
    }

    return false;
  }

  return true;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BsYXRmb3JtL3ByZXByb2Nlc3MtY2xhc3MuanMiXSwibmFtZXMiOlsianMiLCJyZXF1aXJlIiwiQXR0cnMiLCJTZXJpYWxpemFibGVBdHRycyIsInNlcmlhbGl6YWJsZSIsImVkaXRvck9ubHkiLCJmb3JtZXJseVNlcmlhbGl6ZWRBcyIsIlRZUE9fVE9fQ09SUkVDVF9ERVYiLCJDQ19ERVYiLCJleHRlbmQiLCJwcm9wZXJ0eSIsImNvbnN0cnVjdG9yIiwicGFyc2VOb3RpZnkiLCJ2YWwiLCJwcm9wTmFtZSIsIm5vdGlmeSIsInByb3BlcnRpZXMiLCJnZXQiLCJzZXQiLCJjYyIsIndhcm5JRCIsImhhc093blByb3BlcnR5IiwibmV3S2V5IiwidmFsdWUiLCJvbGRWYWx1ZSIsImNhbGwiLCJDQ19FRElUT1IiLCJub3RpZnlGb3IiLCJuZXdWYWx1ZSIsImF0dHIiLCJ2IiwiY2FuVXNlZEluR2V0IiwicGFyc2VUeXBlIiwidHlwZSIsImNsYXNzTmFtZSIsIlNUQVRJQ19DSEVDSyIsIkNDX1RFU1QiLCJBcnJheSIsImlzQXJyYXkiLCJsZW5ndGgiLCJlcnJvcklEIiwiU3RyaW5nIiwiQm9vbGVhbiIsIk51bWJlciIsIkZsb2F0Iiwid2FybiIsIkNsYXNzIiwiX2lzQ0NDbGFzcyIsIl9nZXRDbGFzc0lkIiwiZ2V0QmFzZUNsYXNzV2hlcmVQcm9wZXJ0eURlZmluZWRfREVWIiwiY2xzIiwicmVzIiwiX19wcm9wc19fIiwiaW5kZXhPZiIsIiRzdXBlciIsImVycm9yIiwiX3dyYXBPcHRpb25zIiwiaXNFUzZHZXRzZXQiLCJfZGVmYXVsdCIsIl9zaG9ydCIsImV4cG9ydHMiLCJnZXRGdWxsRm9ybU9mUHJvcGVydHkiLCJvcHRpb25zIiwiaXNMaXRlcmFsIiwiT2JqZWN0IiwiaXNDaGlsZENsYXNzT2YiLCJWYWx1ZVR5cGUiLCJQcmltaXRpdmVUeXBlIiwicHJlcHJvY2Vzc0F0dHJzIiwiZXM2IiwiZnVsbEZvcm0iLCJtYXliZVR5cGVTY3JpcHQiLCJvdmVycmlkZSIsImJhc2VDbGFzcyIsImdldENsYXNzTmFtZSIsIkNBTExfU1VQRVJfREVTVFJPWV9SRUdfREVWIiwiZG9WYWxpZGF0ZU1ldGhvZFdpdGhQcm9wc19ERVYiLCJmdW5jIiwiZnVuY05hbWUiLCJiYXNlIiwiYmFzZUNsYXNzTmFtZSIsIkNvbXBvbmVudCIsInRlc3QiLCJ2YWxpZGF0ZU1ldGhvZFdpdGhQcm9wcyIsInByb3RvdHlwZSIsIm92ZXJyaWRlZCIsImJhc2VGdWMiLCJzdWJGdWMiLCJjb3JyZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxNQUFELENBQWxCOztBQUNBLElBQU1DLEtBQUssR0FBR0QsT0FBTyxDQUFDLGFBQUQsQ0FBckIsRUFFQTs7O0FBRUEsSUFBSUUsaUJBQWlCLEdBQUc7QUFDcEIsYUFBUyxFQURXO0FBRXBCQyxFQUFBQSxZQUFZLEVBQUUsRUFGTTtBQUdwQkMsRUFBQUEsVUFBVSxFQUFFLEVBSFE7QUFJcEJDLEVBQUFBLG9CQUFvQixFQUFFO0FBSkYsQ0FBeEI7QUFPQSxJQUFJQyxtQkFBbUIsR0FBR0MsTUFBTSxJQUFJO0FBQ2hDQyxFQUFBQSxNQUFNLEVBQUUsU0FEd0I7QUFFaENDLEVBQUFBLFFBQVEsRUFBRSxZQUZzQjtBQUdoQyxZQUFRLFNBSHdCO0FBSWhDQyxFQUFBQSxXQUFXLEVBQUU7QUFKbUIsQ0FBcEMsRUFPQTs7QUFDQSxTQUFTQyxXQUFULENBQXNCQyxHQUF0QixFQUEyQkMsUUFBM0IsRUFBcUNDLE1BQXJDLEVBQTZDQyxVQUE3QyxFQUF5RDtBQUNyRCxNQUFJSCxHQUFHLENBQUNJLEdBQUosSUFBV0osR0FBRyxDQUFDSyxHQUFu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QUFuRTtBQUNIO0FBQ0osR0FKRCxNQUtLO0FBQ0QsUUFBSXZFLE1BQUosRUFBWTtBQUNSLFVBQUlxRSxJQUFJLEtBQUssS0FBVCxJQUFrQkUsSUFBbEIsSUFBMEJBLElBQUksQ0FBQ0ssU0FBbkMsRUFBOEM7QUFDMUM7QUFDQSxZQUFJQyxTQUFTLEdBQUdOLElBQUksQ0FBQ0ssU0FBTCxDQUFlTixRQUFmLENBQWhCOztBQUNBLFlBQUksT0FBT08sU0FBUCxLQUFxQixVQUF6QixFQUFxQztBQUNqQyxjQUFJQyxPQUFPLEdBQUd0RixFQUFFLENBQUMwRSxZQUFILENBQWdCSyxJQUFoQixJQUF3QixHQUF4QixHQUE4QkQsUUFBNUM7QUFDQSxjQUFJUyxNQUFNLEdBQUdyRCxTQUFTLEdBQUcsR0FBWixHQUFrQjRDLFFBQS9CO0FBQ0EzRCxVQUFBQSxFQUFFLENBQUNDLE1BQUgsQ0FBVSxJQUFWLEVBQWdCbUUsTUFBaEIsRUFBd0JELE9BQXhCLEVBQWlDQyxNQUFqQyxFQUF5Q0EsTUFBekM7QUFDSDtBQUNKOztBQUNELFVBQUlDLE9BQU8sR0FBR2pGLG1CQUFtQixDQUFDdUUsUUFBRCxDQUFqQzs7QUFDQSxVQUFJVSxPQUFKLEVBQWE7QUFDVHJFLFFBQUFBLEVBQUUsQ0FBQ0MsTUFBSCxDQUFVLElBQVYsRUFBZ0JjLFNBQWhCLEVBQTJCNEMsUUFBM0IsRUFBcUNVLE9BQXJDO0FBQ0gsT0FGRCxNQUdLLElBQUlYLElBQUosRUFBVTtBQUNYMUQsUUFBQUEsRUFBRSxDQUFDcUIsT0FBSCxDQUFXLElBQVgsRUFBaUJOLFNBQWpCLEVBQTRCNEMsUUFBNUI7QUFDSDtBQUNKOztBQUNELFdBQU8sS0FBUDtBQUNIOztBQUNELFNBQU8sSUFBUDtBQUNILENBaENEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBqcyA9IHJlcXVpcmUoJy4vanMnKTtcbmNvbnN0IEF0dHJzID0gcmVxdWlyZSgnLi9hdHRyaWJ1dGUnKTtcblxuLy8g5aKe5Yqg6aKE5aSE55CG5bGe5oCn6L+Z5Liq5q2l6aqk55qE55uu55qE5piv6ZmN5L2OIENDQ2xhc3Mg55qE5a6e546w6Zq+5bqm77yM5bCG5q+U6L6D56iz5a6a55qE6YCa55So6YC76L6R5ZKM5LiA5Lqb6ZyA5rGC5q+U6L6D54G15rS755qE5bGe5oCn6ZyA5rGC5YiG6ZqU5byA44CCXG5cbnZhciBTZXJpYWxpemFibGVBdHRycyA9IHtcbiAgICBkZWZhdWx0OiB7fSxcbiAgICBzZXJpYWxpemFibGU6IHt9LFxuICAgIGVkaXRvck9ubHk6IHt9LFxuICAgIGZvcm1lcmx5U2VyaWFsaXplZEFzOiB7fVxufTtcblxudmFyIFRZUE9fVE9fQ09SUkVDVF9ERVYgPSBDQ19ERVYgJiYge1xuICAgIGV4dGVuZDogJ2V4dGVuZHMnLFxuICAgIHByb3BlcnR5OiAncHJvcGVydGllcycsXG4gICAgc3RhdGljOiAnc3RhdGljcycsXG4gICAgY29uc3RydWN0b3I6ICdjdG9yJ1xufTtcblxuLy8g6aKE5aSE55CGIG5vdGlmeSDnrYnmianlsZXlsZ7mgKdcbmZ1bmN0aW9uIHBhcnNlTm90aWZ5ICh2YWwsIHByb3BOYW1lLCBub3RpZnksIHByb3BlcnRpZXMpIHtcbiAgICBpZiAodmFsLmdldCB8fCB2YWwuc2V0KSB7XG4gICAgICAgIGlmIChDQ19ERVYpIHtcbiAgICAgICAgICAgIGNjLndhcm5JRCg1NTAwKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh2YWwuaGFzT3duUHJvcGVydHkoJ2RlZmF1bHQnKSkge1xuICAgICAgICAvLyDmt7vliqDmlrDnmoTlhoXpg6jlsZ7mgKfvvIzlsIbljp/mnaXnmoTlsZ7mgKfkv67mlLnkuLogZ2V0dGVyL3NldHRlciDlvaLlvI9cbiAgICAgICAgLy8g77yI5LulIF8g5byA5aS05bCG6Ieq5Yqo6K6+572ucHJvcGVydHkg5Li6IHZpc2libGU6IGZhbHNl77yJXG4gICAgICAgIHZhciBuZXdLZXkgPSBcIl9OJFwiICsgcHJvcE5hbWU7XG5cbiAgICAgICAgdmFsLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW25ld0tleV07XG4gICAgICAgIH07XG4gICAgICAgIHZhbC5zZXQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IHRoaXNbbmV3S2V5XTtcbiAgICAgICAgICAgIHRoaXNbbmV3S2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgbm90aWZ5LmNhbGwodGhpcywgb2xkVmFsdWUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHZhbC5ub3RpZnlGb3IgPSBuZXdLZXk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbmV3VmFsdWUgPSB7fTtcbiAgICAgICAgcHJvcGVydGllc1tuZXdLZXldID0gbmV3VmFsdWU7XG4gICAgICAgIC8vIOWwhuS4jeiDveeUqOS6jmdldOaWueazleS4reeahOWxnuaAp+enu+WKqOWIsG5ld1ZhbHVl5LitXG4gICAgICAgIGZvciAodmFyIGF0dHIgaW4gU2VyaWFsaXphYmxlQXR0cnMpIHtcbiAgICAgICAgICAgIHZhciB2ID0gU2VyaWFsaXphYmxlQXR0cnNbYXR0cl07XG4gICAgICAgICAgICBpZiAodmFsLmhhc093blByb3BlcnR5KGF0dHIpKSB7XG4gICAgICAgICAgICAgICAgbmV3VmFsdWVbYXR0cl0gPSB2YWxbYXR0cl07XG4gICAgICAgICAgICAgICAgaWYgKCF2LmNhblVzZWRJbkdldCkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdmFsW2F0dHJdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChDQ19ERVYpIHtcbiAgICAgICAgY2Mud2FybklEKDU1MDEpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VUeXBlICh2YWwsIHR5cGUsIGNsYXNzTmFtZSwgcHJvcE5hbWUpIHtcbiAgICBjb25zdCBTVEFUSUNfQ0hFQ0sgPSAoQ0NfRURJVE9SICYmIENDX0RFVikgfHwgQ0NfVEVTVDtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KHR5cGUpKSB7XG4gICAgICAgIGlmIChTVEFUSUNfQ0hFQ0sgJiYgJ2RlZmF1bHQnIGluIHZhbCkge1xuICAgICAgICAgICAgdmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL0NDQ2xhc3MnKS5pc0FycmF5OyAgIC8vIHJlcXVpcmUgbGF6aWx5IHRvIGF2b2lkIGNpcmN1bGFyIHJlcXVpcmUoKSBjYWxsc1xuICAgICAgICAgICAgaWYgKCFpc0FycmF5KHZhbC5kZWZhdWx0KSkge1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCg1NTA3LCBjbGFzc05hbWUsIHByb3BOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YWwudHlwZSA9IHR5cGUgPSB0eXBlWzBdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGNjLmVycm9ySUQoNTUwOCwgY2xhc3NOYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGlmICh0eXBlID09PSBTdHJpbmcpIHtcbiAgICAgICAgICAgIHZhbC50eXBlID0gY2MuU3RyaW5nO1xuICAgICAgICAgICAgaWYgKFNUQVRJQ19DSEVDSykge1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzNjA4LCBgXCIke2NsYXNzTmFtZX0uJHtwcm9wTmFtZX1cImApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGUgPT09IEJvb2xlYW4pIHtcbiAgICAgICAgICAgIHZhbC50eXBlID0gY2MuQm9vbGVhbjtcbiAgICAgICAgICAgIGlmIChTVEFUSUNfQ0hFQ0spIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuSUQoMzYwOSwgYFwiJHtjbGFzc05hbWV9LiR7cHJvcE5hbWV9XCJgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlID09PSBOdW1iZXIpIHtcbiAgICAgICAgICAgIHZhbC50eXBlID0gY2MuRmxvYXQ7XG4gICAgICAgICAgICBpZiAoU1RBVElDX0NIRUNLKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybklEKDM2MTAsIGBcIiR7Y2xhc3NOYW1lfS4ke3Byb3BOYW1lfVwiYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoU1RBVElDX0NIRUNLKSB7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlICdOdW1iZXInOlxuICAgICAgICAgICAgY2Mud2FybklEKDU1MTAsIGNsYXNzTmFtZSwgcHJvcE5hbWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ1N0cmluZyc6XG4gICAgICAgICAgICBjYy53YXJuKGBUaGUgdHlwZSBvZiBcIiR7Y2xhc3NOYW1lfS4ke3Byb3BOYW1lfVwiIG11c3QgYmUgY2MuU3RyaW5nLCBub3QgXCJTdHJpbmdcIi5gKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdCb29sZWFuJzpcbiAgICAgICAgICAgIGNjLndhcm4oYFRoZSB0eXBlIG9mIFwiJHtjbGFzc05hbWV9LiR7cHJvcE5hbWV9XCIgbXVzdCBiZSBjYy5Cb29sZWFuLCBub3QgXCJCb29sZWFuXCIuYCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnRmxvYXQnOlxuICAgICAgICAgICAgY2Mud2FybihgVGhlIHR5cGUgb2YgXCIke2NsYXNzTmFtZX0uJHtwcm9wTmFtZX1cIiBtdXN0IGJlIGNjLkZsb2F0LCBub3QgXCJGbG9hdFwiLmApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0ludGVnZXInOlxuICAgICAgICAgICAgY2Mud2FybihgVGhlIHR5cGUgb2YgXCIke2NsYXNzTmFtZX0uJHtwcm9wTmFtZX1cIiBtdXN0IGJlIGNjLkludGVnZXIsIG5vdCBcIkludGVnZXJcIi5gKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIG51bGw6XG4gICAgICAgICAgICBjYy53YXJuSUQoNTUxMSwgY2xhc3NOYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChDQ19FRElUT1IgJiYgdHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaWYgKGNjLkNsYXNzLl9pc0NDQ2xhc3ModHlwZSkgJiYgdmFsLnNlcmlhbGl6YWJsZSAhPT0gZmFsc2UgJiYgIWpzLl9nZXRDbGFzc0lkKHR5cGUsIGZhbHNlKSkge1xuICAgICAgICAgICAgY2Mud2FybklEKDU1MTIsIGNsYXNzTmFtZSwgcHJvcE5hbWUsIGNsYXNzTmFtZSwgcHJvcE5hbWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRCYXNlQ2xhc3NXaGVyZVByb3BlcnR5RGVmaW5lZF9ERVYgKHByb3BOYW1lLCBjbHMpIHtcbiAgICBpZiAoQ0NfREVWKSB7XG4gICAgICAgIHZhciByZXM7XG4gICAgICAgIGZvciAoOyBjbHMgJiYgY2xzLl9fcHJvcHNfXyAmJiBjbHMuX19wcm9wc19fLmluZGV4T2YocHJvcE5hbWUpICE9PSAtMTsgY2xzID0gY2xzLiRzdXBlcikge1xuICAgICAgICAgICAgcmVzID0gY2xzO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcmVzKSB7XG4gICAgICAgICAgICBjYy5lcnJvcigndW5rbm93biBlcnJvcicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBfd3JhcE9wdGlvbnMgKGlzRVM2R2V0c2V0LCBfZGVmYXVsdCwgdHlwZSkge1xuICAgIGxldCByZXMgPSBpc0VTNkdldHNldCA/IHsgX3Nob3J0OiB0cnVlIH0gOiB7IF9zaG9ydDogdHJ1ZSwgZGVmYXVsdDogX2RlZmF1bHQgfTtcbiAgICBpZiAodHlwZSkge1xuICAgICAgICByZXMudHlwZSA9IHR5cGU7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbmV4cG9ydHMuZ2V0RnVsbEZvcm1PZlByb3BlcnR5ID0gZnVuY3Rpb24gKG9wdGlvbnMsIGlzRVM2R2V0c2V0KSB7XG4gICAgdmFyIGlzTGl0ZXJhbCA9IG9wdGlvbnMgJiYgb3B0aW9ucy5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0O1xuICAgIGlmIChpc0xpdGVyYWwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KG9wdGlvbnMpICYmIG9wdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gX3dyYXBPcHRpb25zKGlzRVM2R2V0c2V0LCBbXSwgb3B0aW9ucyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBfd3JhcE9wdGlvbnMoaXNFUzZHZXRzZXQsIGpzLmlzQ2hpbGRDbGFzc09mKG9wdGlvbnMsIGNjLlZhbHVlVHlwZSkgPyBuZXcgb3B0aW9ucygpIDogbnVsbCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKG9wdGlvbnMgaW5zdGFuY2VvZiBBdHRycy5QcmltaXRpdmVUeXBlKSB7XG4gICAgICAgIHJldHVybiBfd3JhcE9wdGlvbnMoaXNFUzZHZXRzZXQsIG9wdGlvbnMuZGVmYXVsdCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gX3dyYXBPcHRpb25zKGlzRVM2R2V0c2V0LCBvcHRpb25zKTtcbiAgICB9XG59O1xuXG5leHBvcnRzLnByZXByb2Nlc3NBdHRycyA9IGZ1bmN0aW9uIChwcm9wZXJ0aWVzLCBjbGFzc05hbWUsIGNscywgZXM2KSB7XG4gICAgZm9yICh2YXIgcHJvcE5hbWUgaW4gcHJvcGVydGllcykge1xuICAgICAgICB2YXIgdmFsID0gcHJvcGVydGllc1twcm9wTmFtZV07XG4gICAgICAgIHZhciBmdWxsRm9ybSA9IGV4cG9ydHMuZ2V0RnVsbEZvcm1PZlByb3BlcnR5KHZhbCwgZmFsc2UpO1xuICAgICAgICBpZiAoZnVsbEZvcm0pIHtcbiAgICAgICAgICAgIHZhbCA9IHByb3BlcnRpZXNbcHJvcE5hbWVdID0gZnVsbEZvcm07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgIGlmICgnZGVmYXVsdCcgaW4gdmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwuZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDU1MTMsIGNsYXNzTmFtZSwgcHJvcE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZhbC5zZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoNTUxNCwgY2xhc3NOYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoY2MuQ2xhc3MuX2lzQ0NDbGFzcyh2YWwuZGVmYXVsdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbC5kZWZhdWx0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoNTUxNSwgY2xhc3NOYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIXZhbC5nZXQgJiYgIXZhbC5zZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1heWJlVHlwZVNjcmlwdCA9IGVzNjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFtYXliZVR5cGVTY3JpcHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoNTUxNiwgY2xhc3NOYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoQ0NfREVWICYmICF2YWwub3ZlcnJpZGUgJiYgY2xzLl9fcHJvcHNfXy5pbmRleE9mKHByb3BOYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBvdmVycmlkZVxuICAgICAgICAgICAgICAgIHZhciBiYXNlQ2xhc3MgPSBqcy5nZXRDbGFzc05hbWUoZ2V0QmFzZUNsYXNzV2hlcmVQcm9wZXJ0eURlZmluZWRfREVWKHByb3BOYW1lLCBjbHMpKTtcbiAgICAgICAgICAgICAgICBjYy53YXJuSUQoNTUxNywgY2xhc3NOYW1lLCBwcm9wTmFtZSwgYmFzZUNsYXNzLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbm90aWZ5ID0gdmFsLm5vdGlmeTtcbiAgICAgICAgICAgIGlmIChub3RpZnkpIHtcbiAgICAgICAgICAgICAgICBpZiAoQ0NfREVWICYmIGVzNikge1xuICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcignbm90IHlldCBzdXBwb3J0IG5vdGlmeSBhdHRyaWJ1dGUgZm9yIEVTNiBDbGFzc2VzJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwYXJzZU5vdGlmeSh2YWwsIHByb3BOYW1lLCBub3RpZnksIHByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCd0eXBlJyBpbiB2YWwpIHtcbiAgICAgICAgICAgICAgICBwYXJzZVR5cGUodmFsLCB2YWwudHlwZSwgY2xhc3NOYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5pZiAoQ0NfREVWKSB7XG4gICAgY29uc3QgQ0FMTF9TVVBFUl9ERVNUUk9ZX1JFR19ERVYgPSAvXFxiXFwuX3N1cGVyXFxifGRlc3Ryb3lcXHMqXFwuXFxzKmNhbGxcXHMqXFwoXFxzKlxcdytcXHMqWyx8KV0vO1xuICAgIGV4cG9ydHMuZG9WYWxpZGF0ZU1ldGhvZFdpdGhQcm9wc19ERVYgPSBmdW5jdGlvbiAoZnVuYywgZnVuY05hbWUsIGNsYXNzTmFtZSwgY2xzLCBiYXNlKSB7XG4gICAgICAgIGlmIChjbHMuX19wcm9wc19fICYmIGNscy5fX3Byb3BzX18uaW5kZXhPZihmdW5jTmFtZSkgPj0gMCkge1xuICAgICAgICAgICAgLy8gZmluZCBjbGFzcyB0aGF0IGRlZmluZXMgdGhpcyBtZXRob2QgYXMgYSBwcm9wZXJ0eVxuICAgICAgICAgICAgdmFyIGJhc2VDbGFzc05hbWUgPSBqcy5nZXRDbGFzc05hbWUoZ2V0QmFzZUNsYXNzV2hlcmVQcm9wZXJ0eURlZmluZWRfREVWKGZ1bmNOYW1lLCBjbHMpKTtcbiAgICAgICAgICAgIGNjLmVycm9ySUQoMzY0OCwgY2xhc3NOYW1lLCBmdW5jTmFtZSwgYmFzZUNsYXNzTmFtZSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZ1bmNOYW1lID09PSAnZGVzdHJveScgJiZcbiAgICAgICAgICAgIGpzLmlzQ2hpbGRDbGFzc09mKGJhc2UsIGNjLkNvbXBvbmVudCkgJiZcbiAgICAgICAgICAgICFDQUxMX1NVUEVSX0RFU1RST1lfUkVHX0RFVi50ZXN0KGZ1bmMpXG4gICAgICAgICkge1xuICAgICAgICAgICAgY2MuZXJyb3IoYE92ZXJ3cml0aW5nICcke2Z1bmNOYW1lfScgZnVuY3Rpb24gaW4gJyR7Y2xhc3NOYW1lfScgY2xhc3Mgd2l0aG91dCBjYWxsaW5nIHN1cGVyIGlzIG5vdCBhbGxvd2VkLiBDYWxsIHRoZSBzdXBlciBmdW5jdGlvbiBpbiAnJHtmdW5jTmFtZX0nIHBsZWFzZS5gKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydHMudmFsaWRhdGVNZXRob2RXaXRoUHJvcHMgPSBmdW5jdGlvbiAoZnVuYywgZnVuY05hbWUsIGNsYXNzTmFtZSwgY2xzLCBiYXNlKSB7XG4gICAgaWYgKENDX0RFViAmJiBmdW5jTmFtZSA9PT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgICBjYy5lcnJvcklEKDM2NDMsIGNsYXNzTmFtZSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBmdW5jID09PSAnZnVuY3Rpb24nIHx8IGZ1bmMgPT09IG51bGwpIHtcbiAgICAgICAgaWYgKENDX0RFVikge1xuICAgICAgICAgICAgdGhpcy5kb1ZhbGlkYXRlTWV0aG9kV2l0aFByb3BzX0RFVihmdW5jLCBmdW5jTmFtZSwgY2xhc3NOYW1lLCBjbHMsIGJhc2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAoQ0NfREVWKSB7XG4gICAgICAgICAgICBpZiAoZnVuYyA9PT0gZmFsc2UgJiYgYmFzZSAmJiBiYXNlLnByb3RvdHlwZSkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIG92ZXJyaWRlXG4gICAgICAgICAgICAgICAgdmFyIG92ZXJyaWRlZCA9IGJhc2UucHJvdG90eXBlW2Z1bmNOYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG92ZXJyaWRlZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmFzZUZ1YyA9IGpzLmdldENsYXNzTmFtZShiYXNlKSArICcuJyArIGZ1bmNOYW1lO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3ViRnVjID0gY2xhc3NOYW1lICsgJy4nICsgZnVuY05hbWU7XG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzNjI0LCBzdWJGdWMsIGJhc2VGdWMsIHN1YkZ1Yywgc3ViRnVjKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY29ycmVjdCA9IFRZUE9fVE9fQ09SUkVDVF9ERVZbZnVuY05hbWVdO1xuICAgICAgICAgICAgaWYgKGNvcnJlY3QpIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuSUQoMzYyMSwgY2xhc3NOYW1lLCBmdW5jTmFtZSwgY29ycmVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChmdW5jKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjIyLCBjbGFzc05hbWUsIGZ1bmNOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufTtcbiJdLCJzb3VyY2VSb290IjoiLyJ9