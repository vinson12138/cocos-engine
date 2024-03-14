
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/webgl/assemblers/label/2d/nativeTTF.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _materialVariant = _interopRequireDefault(require("../../../../../assets/material/material-variant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Label = require('../../../../../components/CCLabel');

var LabelShadow = require('../../../../../components/CCLabelShadow');

var LabelOutline = require('../../../../../components/CCLabelOutline');

var Material = require('../../../../../assets/material/CCMaterial');

var UPDATE_CONTENT = 1 << 0;
var UPDATE_FONT = 1 << 1;
var UPDATE_EFFECT = 1 << 2;

var NativeTTF = /*#__PURE__*/function () {
  function NativeTTF() {}

  var _proto = NativeTTF.prototype;

  _proto.init = function init(comp) {
    this.labelMaterial = null;
    this._label = this._renderComp = comp;
    renderer.CustomAssembler.prototype.ctor.call(this);

    comp.node._proxy.setAssembler(this);

    this._layout = new jsb.LabelRenderer();

    this._layout.init(comp);

    this._cfg = new DataView(this._layout._cfg);
    this._layoutInfo = new DataView(this._layout._layout);
    this._cfgFields = jsb.LabelRenderer._cfgFields;
    this._layoutFields = jsb.LabelRenderer._layoutFields;

    this._layout.bindNodeProxy(comp.node._proxy);

    this._bindMaterial(comp);
  };

  _proto._setBufferFlag = function _setBufferFlag(dv, offset, size, type, flag) {
    if (type == "int8" && size == 1) {
      var v = dv.getInt8(offset);
      dv.setInt8(offset, flag | v);
    } else if (type == "int32" && size == 4) {
      var _v = dv.getInt32(offset, jsb.__isLittleEndian__);

      dv.setInt32(offset, flag | _v, jsb.__isLittleEndian__);
    } else {
      cc.warn("flag storage type should be int8/int32 only, type/size -> " + type + "/" + size + ".");
    }
  };

  _proto._updateCfgFlag = function _updateCfgFlag(flag) {
    var field = this._cfgFields.updateFlags;

    this._setBufferFlag(this._cfg, field.offset, field.size, field.type, flag);
  };

  _proto._setBufferValue = function _setBufferValue(dv, offset, size, type, value) {
    if (type == "float" && size == 4) {
      dv.setFloat32(offset, value, jsb.__isLittleEndian__);
    } else if (type == "int32" && size == 4) {
      dv.setInt32(offset, value, jsb.__isLittleEndian__);
    } else if (type == "bool" && size == 1) {
      dv.setInt8(offset, !!value ? 1 : 0, jsb.__isLittleEndian__);
    } else if (type == "Color4B" && size == 4) {
      dv.setUint8(offset, value.r);
      dv.setUint8(offset + 1, value.g);
      dv.setUint8(offset + 2, value.b);
      dv.setUint8(offset + 3, value.a);
    } else if (type == "int8" && size == 1) {
      dv.setUint8(offset, value);
    } else {
      cc.warn("dont know how to set value to buffer, type/size -> " + type + "/" + size + ".");
    }
  };

  _proto._setFieldValue = function _setFieldValue(dv, desc, field_name, value) {
    var field = desc[field_name];

    this._setBufferValue(dv, field.offset, field.size, field.type, value);
  };

  _proto._getBufferValue = function _getBufferValue(dv, offset, size, type) {
    if (type == "float" && size == 4) {
      return dv.getFloat32(offset, jsb.__isLittleEndian__);
    } else if (type == "int32" && size == 4) {
      return dv.getInt32(offset, jsb.__isLittleEndian__);
    } else if (type == "bool" && size == 1) {
      return dv.getInt8(offset, jsb.__isLittleEndian__) != 0;
    } else if (type == "Color4B" && size == 4) {
      var r = dv.getUint8(offset);
      var g = dv.getUint8(offset + 1);
      var b = dv.getUint8(offset + 2);
      var a = dv.getUint8(offset + 3);
      return {
        r: r,
        g: g,
        b: b,
        a: a
      };
    } else if (type == "int8" && size == 1) {
      return dv.getUint8(offset);
    } else {
      cc.warn("dont know how to get value from buffer, type/size -> " + type + "/" + size + ".");
      return undefined;
    }
  };

  _proto._getFieldValue = function _getFieldValue(dv, desc, field_name) {
    var field = desc[field_name];
    return this._getBufferValue(dv, field.offset, field.size, field.type);
  };

  _proto._getLayoutValue = function _getLayoutValue(field_name) {
    return this._getFieldValue(this._layoutInfo, this._layoutFields, field_name);
  };

  _proto._setLayoutValue = function _setLayoutValue(field_name, value) {
    return this._setFieldValue(this._layoutInfo, this._layoutFields, field_name, value);
  };

  _proto._updateCfgFlag_Content = function _updateCfgFlag_Content() {
    this._updateCfgFlag(UPDATE_CONTENT);
  };

  _proto._updateCfgFlag_Font = function _updateCfgFlag_Font() {
    this._updateCfgFlag(UPDATE_FONT);
  };

  _proto._colorEqual = function _colorEqual(a, b) {
    return a.r == b.r && a.g == b.g && a.b == b.b && a.a == b.a;
  };

  _proto._colorToObj = function _colorToObj(r, g, b, a) {
    return {
      r: r,
      g: g,
      b: b,
      a: a
    };
  };

  _proto.setString = function setString(str) {
    if (str != this._layout.string) {
      this._layout.string = str;

      this._updateCfgFlag_Content();
    }
  };

  _proto.setFontPath = function setFontPath(path) {
    if (path != this._layout.fontPath) {
      this._layout.fontPath = path;

      this._updateCfgFlag_Font();
    }
  };

  _proto.setFontSize = function setFontSize(fontSize, fontSizeRetina) {
    var oldfontsize = this._getFieldValue(this._cfg, this._cfgFields, "fontSize");

    if (oldfontsize != fontSize) {
      this._setFieldValue(this._cfg, this._cfgFields, "fontSize", fontSize);

      this._setFieldValue(this._cfg, this._cfgFields, "fontSizeRetina", fontSizeRetina);

      this._updateCfgFlag_Font();
    }
  };

  _proto.setOutline = function setOutline(outline) {
    var oldOutline = this._getLayoutValue("outlineSize");

    if (oldOutline > 0 != outline > 0) {
      this._updateCfgFlag_Font();
    }

    if (oldOutline != outline) {
      this._updateCfgFlag_Content();

      this._setLayoutValue("outlineSize", outline);
    }
  };

  _proto.setOutlineColor = function setOutlineColor(color) {
    var oldColor = this._getLayoutValue("outlineColor");

    if (!this._colorEqual(oldColor, color)) {
      this._setLayoutValue("outlineColor", color);

      this._updateCfgFlag_Content();
    }
  };

  _proto.setLineHeight = function setLineHeight(lineHeight) {
    var oldLineHeight = this._getLayoutValue("lineHeight");

    if (oldLineHeight != lineHeight) {
      this._setLayoutValue("lineHeight", lineHeight);

      this._updateCfgFlag_Content();
    }
  };

  _proto.setOverFlow = function setOverFlow(overflow) {
    var oldValue = this._getLayoutValue("overflow");

    if (oldValue != overflow) {
      this._setLayoutValue("overflow", overflow);

      this._updateCfgFlag_Content();
    }
  };

  _proto.setEnableWrap = function setEnableWrap(value) {
    var oldValue = this._getLayoutValue("wrap");

    if (oldValue != value) {
      this._setLayoutValue("wrap", value);

      this._updateCfgFlag_Content();
    }
  };

  _proto.setVerticalAlign = function setVerticalAlign(value) {
    var oldValue = this._getLayoutValue("valign");

    if (oldValue != value) {
      this._setLayoutValue("valign", value);

      this._updateCfgFlag_Content();
    }
  };

  _proto.setHorizontalAlign = function setHorizontalAlign(value) {
    var oldValue = this._getLayoutValue("halign");

    if (oldValue != value) {
      this._setLayoutValue("halign", value);

      this._updateCfgFlag_Content();
    }
  };

  _proto.setContentSize = function setContentSize(width, height) {
    var oldWidth = this._getLayoutValue("width");

    var oldHeight = this._getLayoutValue("height");

    if (oldWidth != width || oldHeight != height) {
      this._setLayoutValue("height", height);

      this._setLayoutValue("width", width);

      this._updateCfgFlag_Content();
    }
  };

  _proto.setAnchorPoint = function setAnchorPoint(x, y) {
    var oldX = this._getLayoutValue("anchorX");

    var oldY = this._getLayoutValue("anchorY");

    if (oldX != x || oldY != y) {
      this._setLayoutValue("anchorX", x);

      this._setLayoutValue("anchorY", y);

      this._updateCfgFlag_Content();
    }
  };

  _proto.setColor = function setColor(color) {
    var oldColor = this._getLayoutValue("color");

    if (!this._colorEqual(oldColor, color)) {
      this._setLayoutValue("color", color);

      this._updateCfgFlag_Content();
    }
  };

  _proto.setShadow = function setShadow(x, y, blur) {
    var oldBlur = this._getLayoutValue("shadowBlur");

    var oldX = this._getLayoutValue("shadowX");

    var oldY = this._getLayoutValue("shadowY");

    if (oldBlur > 0 != blur > 0) {
      this._updateCfgFlag_Font();
    }

    var updateContent = false;

    if (oldBlur != blur) {
      this._setLayoutValue("shadowBlur", blur);

      updateContent = true;
    }

    if (oldX != x) {
      this._setLayoutValue("shadowX", x);

      updateContent = true;
    }

    if (oldY != y) {
      this._setLayoutValue("shadowY", y);

      updateContent = true;
    }

    if (updateContent) {
      this._updateCfgFlag_Content();
    }
  };

  _proto.setShadowColor = function setShadowColor(color) {
    var oldColor = this._getLayoutValue("shadowColor");

    if (!this._colorEqual(oldColor, color)) {
      this._setLayoutValue("shadowColor", color);

      this._updateCfgFlag_Content();
    }
  };

  _proto.setItalic = function setItalic(enabled) {
    var oldItalic = this._getLayoutValue("italic");

    if (oldItalic != enabled) {
      this._setLayoutValue("italic", enabled);

      this._updateCfgFlag_Content();
    }
  };

  _proto.setBold = function setBold(bold) {
    var oldBold = this._getLayoutValue("bold");

    if (oldBold != bold) {
      this._setLayoutValue("bold", bold);

      this._updateCfgFlag_Content();

      this._updateCfgFlag_Font(); //enable sdf

    }
  };

  _proto.setUnderline = function setUnderline(underline) {
    var oldBold = this._getLayoutValue("underline");

    if (oldBold != underline) {
      this._setLayoutValue("underline", underline);

      this._updateCfgFlag_Content();
    }
  };

  _proto.setSpacingX = function setSpacingX(x) {
    var oldX = this._getLayoutValue("spaceX");

    if (oldX != x && typeof x == "number" && !isNaN(x)) {
      this._setLayoutValue("spaceX", x);

      this._updateCfgFlag_Content();
    }
  };

  _proto.updateRenderData = function updateRenderData(comp) {
    if (!comp._vertsDirty) return;

    if (comp.font && comp.font.nativeUrl) {
      this.setFontPath(cc.assetManager.cacheManager.getCache(comp.font.nativeUrl) || comp.font.nativeUrl);
    }

    var layout = this._layout;
    var c = comp.node.color;
    var node = comp.node;
    var retinaSize = comp.fontSize;
    this.setString(comp.string);
    this.setFontSize(comp.fontSize, retinaSize / 72 * comp.fontSize);
    this.setLineHeight(comp.lineHeight);
    this.setEnableWrap(comp.enableWrapText);
    this.setItalic(comp.enableItalic);
    this.setUnderline(comp.enableUnderline);
    this.setBold(comp.enableBold);
    this.setOverFlow(comp.overflow);
    this.setVerticalAlign(comp.verticalAlign);
    this.setHorizontalAlign(comp.horizontalAlign);
    this.setSpacingX(comp.spacingX);
    this.setContentSize(node.getContentSize().width, node.getContentSize().height);
    this.setAnchorPoint(node.anchorX, node.anchorY);
    this.setColor(this._colorToObj(c.getR(), c.getG(), c.getB(), Math.ceil(c.getA() * node.opacity / 255)));
    var shadow = node.getComponent(cc.LabelShadow);

    if (shadow && shadow.enabled) {
      var shadowColor = shadow.color;
      this.setShadow(shadow.offset.x, shadow.offset.y, shadow.blur);
      this.setShadowColor(this._colorToObj(shadowColor.getR(), shadowColor.getG(), shadowColor.getB(), Math.ceil(shadowColor.getA() * node.opacity / 255)));
    } else {
      this.setShadow(0, 0, -1);
    }

    this._updateTTFMaterial(comp);

    layout.render(); //comp._vertsDirty = false;
  };

  _proto._bindMaterial = function _bindMaterial(comp) {
    var material = this.labelMaterial;

    if (!material) {
      material = _materialVariant["default"].createWithBuiltin("2d-label", comp);
      this.labelMaterial = material;
    }

    return material;
  };

  _proto._updateTTFMaterial = function _updateTTFMaterial(comp) {
    var material = this._bindMaterial(comp);

    var node = this._label.node;
    var layout = this._layout;
    var outline = node.getComponent(cc.LabelOutline);
    var outlineSize = 0;

    if (outline && outline.enabled && outline.width > 0) {
      outlineSize = Math.max(Math.min(outline.width / 10, 0.4), 0.1);
      var c = outline.color;
      this.setOutlineColor(this._colorToObj(c.getR(), c.getG(), c.getB(), Math.ceil(c.getA() * node.opacity / 255)));
    }

    this.setOutline(outlineSize);
    material.define('CC_USE_MODEL', true);
    material.define('USE_TEXTURE_ALPHAONLY', true);
    material.define('USE_SDF', outlineSize > 0.0 || comp.enableBold);
    material.define('USE_SDF_EXTEND', comp.enableBold ? 1 : 0);

    if (material.getDefine('CC_SUPPORT_standard_derivatives') !== undefined && cc.sys.glExtension('OES_standard_derivatives')) {
      material.define('CC_SUPPORT_standard_derivatives', true);
    }

    layout.setEffect(material.effect._nativeObj);
  };

  _proto.fillBuffers = function fillBuffers(comp, renderer) {
    this._layout.render();
  };

  _proto.getVfmt = function getVfmt() {};

  return NativeTTF;
}();

exports["default"] = NativeTTF;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL3dlYmdsL2Fzc2VtYmxlcnMvbGFiZWwvMmQvbmF0aXZlVFRGLmpzIl0sIm5hbWVzIjpbIkxhYmVsIiwicmVxdWlyZSIsIkxhYmVsU2hhZG93IiwiTGFiZWxPdXRsaW5lIiwiTWF0ZXJpYWwiLCJVUERBVEVfQ09OVEVOVCIsIlVQREFURV9GT05UIiwiVVBEQVRFX0VGRkVDVCIsIk5hdGl2ZVRURiIsImluaXQiLCJjb21wIiwibGFiZWxNYXRlcmlhbCIsIl9sYWJlbCIsIl9yZW5kZXJDb21wIiwicmVuZGVyZXIiLCJDdXN0b21Bc3NlbWJsZXIiLCJwcm90b3R5cGUiLCJjdG9yIiwiY2FsbCIsIm5vZGUiLCJfcHJveHkiLCJzZXRBc3NlbWJsZXIiLCJfbGF5b3V0IiwianNiIiwiTGFiZWxSZW5kZXJlciIsIl9jZmciLCJEYXRhVmlldyIsIl9sYXlvdXRJbmZvIiwiX2NmZ0ZpZWxkcyIsIl9sYXlvdXRGaWVsZHMiLCJiaW5kTm9kZVByb3h5IiwiX2JpbmRNYXRlcmlhbCIsIl9zZXRCdWZmZXJGbGFnIiwiZHYiLCJvZmZzZXQiLCJzaXplIiwidHlwZSIsImZsYWciLCJ2IiwiZ2V0SW50OCIsInNldEludDgiLCJnZXRJbnQzMiIsIl9faXNMaXR0bGVFbmRpYW5fXyIsInNldEludDMyIiwiY2MiLCJ3YXJuIiwiX3VwZGF0ZUNmZ0ZsYWciLCJmaWVsZCIsInVwZGF0ZUZsYWdzIiwiX3NldEJ1ZmZlclZhbHVlIiwidmFsdWUiLCJzZXRGbG9hdDMyIiwic2V0VWludDgiLCJyIiwiZyIsImIiLCJhIiwiX3NldEZpZWxkVmFsdWUiLCJkZXNjIiwiZmllbGRfbmFtZSIsIl9nZXRCdWZmZXJWYWx1ZSIsImdldEZsb2F0MzIiLCJnZXRVaW50OCIsInVuZGVmaW5lZCIsIl9nZXRGaWVsZFZhbHVlIiwiX2dldExheW91dFZhbHVlIiwiX3NldExheW91dFZhbHVlIiwiX3VwZGF0ZUNmZ0ZsYWdfQ29udGVudCIsIl91cGRhdGVDZmdGbGFnX0ZvbnQiLCJfY29sb3JFcXVhbCIsIl9jb2xvclRvT2JqIiwic2V0U3RyaW5nIiwic3RyIiwic3RyaW5nIiwic2V0Rm9udFBhdGgiLCJwYXRoIiwiZm9udFBhdGgiLCJzZXRGb250U2l6ZSIsImZvbnRTaXplIiwiZm9udFNpemVSZXRpbmEiLCJvbGRmb250c2l6ZSIsInNldE91dGxpbmUiLCJvdXRsaW5lIiwib2xkT3V0bGluZSIsInNldE91dGxpbmVDb2xvciIsImNvbG9yIiwib2xkQ29sb3IiLCJzZXRMaW5lSGVpZ2h0IiwibGluZUhlaWdodCIsIm9sZExpbmVIZWlnaHQiLCJzZXRPdmVyRmxvdyIsIm92ZXJmbG93Iiwib2xkVmFsdWUiLCJzZXRFbmFibGVXcmFwIiwic2V0VmVydGljYWxBbGlnbiIsInNldEhvcml6b250YWxBbGlnbiIsInNldENvbnRlbnRTaXplIiwid2lkdGgiLCJoZWlnaHQiLCJvbGRXaWR0aCIsIm9sZEhlaWdodCIsInNldEFuY2hvclBvaW50IiwieCIsInkiLCJvbGRYIiwib2xkWSIsInNldENvbG9yIiwic2V0U2hhZG93IiwiYmx1ciIsIm9sZEJsdXIiLCJ1cGRhdGVDb250ZW50Iiwic2V0U2hhZG93Q29sb3IiLCJzZXRJdGFsaWMiLCJlbmFibGVkIiwib2xkSXRhbGljIiwic2V0Qm9sZCIsImJvbGQiLCJvbGRCb2xkIiwic2V0VW5kZXJsaW5lIiwidW5kZXJsaW5lIiwic2V0U3BhY2luZ1giLCJpc05hTiIsInVwZGF0ZVJlbmRlckRhdGEiLCJfdmVydHNEaXJ0eSIsImZvbnQiLCJuYXRpdmVVcmwiLCJhc3NldE1hbmFnZXIiLCJjYWNoZU1hbmFnZXIiLCJnZXRDYWNoZSIsImxheW91dCIsImMiLCJyZXRpbmFTaXplIiwiZW5hYmxlV3JhcFRleHQiLCJlbmFibGVJdGFsaWMiLCJlbmFibGVVbmRlcmxpbmUiLCJlbmFibGVCb2xkIiwidmVydGljYWxBbGlnbiIsImhvcml6b250YWxBbGlnbiIsInNwYWNpbmdYIiwiZ2V0Q29udGVudFNpemUiLCJhbmNob3JYIiwiYW5jaG9yWSIsImdldFIiLCJnZXRHIiwiZ2V0QiIsIk1hdGgiLCJjZWlsIiwiZ2V0QSIsIm9wYWNpdHkiLCJzaGFkb3ciLCJnZXRDb21wb25lbnQiLCJzaGFkb3dDb2xvciIsIl91cGRhdGVUVEZNYXRlcmlhbCIsInJlbmRlciIsIm1hdGVyaWFsIiwiTWF0ZXJpYWxWYXJpYW50IiwiY3JlYXRlV2l0aEJ1aWx0aW4iLCJvdXRsaW5lU2l6ZSIsIm1heCIsIm1pbiIsImRlZmluZSIsImdldERlZmluZSIsInN5cyIsImdsRXh0ZW5zaW9uIiwic2V0RWZmZWN0IiwiZWZmZWN0IiwiX25hdGl2ZU9iaiIsImZpbGxCdWZmZXJzIiwiZ2V0VmZtdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOzs7O0FBRUEsSUFBTUEsS0FBSyxHQUFHQyxPQUFPLENBQUMsbUNBQUQsQ0FBckI7O0FBQ0EsSUFBTUMsV0FBVyxHQUFHRCxPQUFPLENBQUMseUNBQUQsQ0FBM0I7O0FBQ0EsSUFBTUUsWUFBWSxHQUFHRixPQUFPLENBQUMsMENBQUQsQ0FBNUI7O0FBQ0EsSUFBTUcsUUFBUSxHQUFHSCxPQUFPLENBQUMsMkNBQUQsQ0FBeEI7O0FBSUEsSUFBTUksY0FBYyxHQUFHLEtBQUssQ0FBNUI7QUFDQSxJQUFNQyxXQUFXLEdBQUcsS0FBSyxDQUF6QjtBQUNBLElBQU1DLGFBQWEsR0FBRyxLQUFLLENBQTNCOztJQUVxQkM7Ozs7O1NBR2pCQyxPQUFBLGNBQUtDLElBQUwsRUFBVztBQUNQLFNBQUtDLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxTQUFLQyxNQUFMLEdBQWMsS0FBS0MsV0FBTCxHQUFtQkgsSUFBakM7QUFDQUksSUFBQUEsUUFBUSxDQUFDQyxlQUFULENBQXlCQyxTQUF6QixDQUFtQ0MsSUFBbkMsQ0FBd0NDLElBQXhDLENBQTZDLElBQTdDOztBQUNBUixJQUFBQSxJQUFJLENBQUNTLElBQUwsQ0FBVUMsTUFBVixDQUFpQkMsWUFBakIsQ0FBOEIsSUFBOUI7O0FBQ0EsU0FBS0MsT0FBTCxHQUFlLElB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TSxNQUFULENBQWdCLGNBQWhCLEVBQWdDLElBQWhDO0FBQ0FOLElBQUFBLFFBQVEsQ0FBQ00sTUFBVCxDQUFnQix1QkFBaEIsRUFBeUMsSUFBekM7QUFDQU4sSUFBQUEsUUFBUSxDQUFDTSxNQUFULENBQWdCLFNBQWhCLEVBQTJCSCxXQUFXLEdBQUcsR0FBZCxJQUFxQm5KLElBQUksQ0FBQzZILFVBQXJEO0FBQ0FtQixJQUFBQSxRQUFRLENBQUNNLE1BQVQsQ0FBZ0IsZ0JBQWhCLEVBQWtDdEosSUFBSSxDQUFDNkgsVUFBTCxHQUFrQixDQUFsQixHQUFzQixDQUF4RDs7QUFDQSxRQUFJbUIsUUFBUSxDQUFDTyxTQUFULENBQW1CLGlDQUFuQixNQUEwRGxHLFNBQTFELElBQXVFbkIsRUFBRSxDQUFDc0gsR0FBSCxDQUFPQyxXQUFQLENBQW1CLDBCQUFuQixDQUEzRSxFQUEySDtBQUN2SFQsTUFBQUEsUUFBUSxDQUFDTSxNQUFULENBQWdCLGlDQUFoQixFQUFtRCxJQUFuRDtBQUNIOztBQUNEL0IsSUFBQUEsTUFBTSxDQUFDbUMsU0FBUCxDQUFpQlYsUUFBUSxDQUFDVyxNQUFULENBQWdCQyxVQUFqQztBQUNIOztTQUVEQyxjQUFBLHFCQUFhN0osSUFBYixFQUFtQkksUUFBbkIsRUFBNkI7QUFDekIsU0FBS1EsT0FBTCxDQUFhbUksTUFBYjtBQUNIOztTQUNEZSxVQUFBLG1CQUFVLENBQ1QiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBNYXRlcmlhbFZhcmlhbnQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vYXNzZXRzL21hdGVyaWFsL21hdGVyaWFsLXZhcmlhbnQnO1xuXG5jb25zdCBMYWJlbCA9IHJlcXVpcmUoJy4uLy4uLy4uLy4uLy4uL2NvbXBvbmVudHMvQ0NMYWJlbCcpO1xuY29uc3QgTGFiZWxTaGFkb3cgPSByZXF1aXJlKCcuLi8uLi8uLi8uLi8uLi9jb21wb25lbnRzL0NDTGFiZWxTaGFkb3cnKTtcbmNvbnN0IExhYmVsT3V0bGluZSA9IHJlcXVpcmUoJy4uLy4uLy4uLy4uLy4uL2NvbXBvbmVudHMvQ0NMYWJlbE91dGxpbmUnKTtcbmNvbnN0IE1hdGVyaWFsID0gcmVxdWlyZSgnLi4vLi4vLi4vLi4vLi4vYXNzZXRzL21hdGVyaWFsL0NDTWF0ZXJpYWwnKTtcblxuXG5cbmNvbnN0IFVQREFURV9DT05URU5UID0gMSA8PCAwO1xuY29uc3QgVVBEQVRFX0ZPTlQgPSAxIDw8IDE7XG5jb25zdCBVUERBVEVfRUZGRUNUID0gMSA8PCAyO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOYXRpdmVUVEYge1xuXG5cbiAgICBpbml0KGNvbXApIHtcbiAgICAgICAgdGhpcy5sYWJlbE1hdGVyaWFsID0gbnVsbDtcbiAgICAgICAgdGhpcy5fbGFiZWwgPSB0aGlzLl9yZW5kZXJDb21wID0gY29tcDtcbiAgICAgICAgcmVuZGVyZXIuQ3VzdG9tQXNzZW1ibGVyLnByb3RvdHlwZS5jdG9yLmNhbGwodGhpcyk7XG4gICAgICAgIGNvbXAubm9kZS5fcHJveHkuc2V0QXNzZW1ibGVyKHRoaXMpO1xuICAgICAgICB0aGlzLl9sYXlvdXQgPSBuZXcganNiLkxhYmVsUmVuZGVyZXIoKTtcbiAgICAgICAgdGhpcy5fbGF5b3V0LmluaXQoY29tcCk7XG4gICAgICAgIHRoaXMuX2NmZyA9IG5ldyBEYXRhVmlldyh0aGlzLl9sYXlvdXQuX2NmZyk7XG4gICAgICAgIHRoaXMuX2xheW91dEluZm8gPSBuZXcgRGF0YVZpZXcodGhpcy5fbGF5b3V0Ll9sYXlvdXQpO1xuXG4gICAgICAgIHRoaXMuX2NmZ0ZpZWxkcyA9IGpzYi5MYWJlbFJlbmRlcmVyLl9jZmdGaWVsZHM7XG4gICAgICAgIHRoaXMuX2xheW91dEZpZWxkcyA9IGpzYi5MYWJlbFJlbmRlcmVyLl9sYXlvdXRGaWVsZHM7XG4gICAgICAgIHRoaXMuX2xheW91dC5iaW5kTm9kZVByb3h5KGNvbXAubm9kZS5fcHJveHkpO1xuICAgICAgICB0aGlzLl9iaW5kTWF0ZXJpYWwoY29tcCk7XG4gICAgfVxuXG5cbiAgICBfc2V0QnVmZmVyRmxhZyhkdiwgb2Zmc2V0LCBzaXplLCAgdHlwZSwgZmxhZyl7XG4gICAgICAgIGlmICggdHlwZSA9PSBcImludDhcIiAgJiYgc2l6ZSA9PSAxKSB7XG4gICAgICAgICAgICBsZXQgdiA9IGR2LmdldEludDgob2Zmc2V0KTtcbiAgICAgICAgICAgIGR2LnNldEludDgob2Zmc2V0LCBmbGFnIHwgdik7XG4gICAgICAgIH0gZWxzZSBpZih0eXBlID09IFwiaW50MzJcIiAmJiBzaXplID09IDQpIHtcbiAgICAgICAgICAgIGxldCB2ID0gZHYuZ2V0SW50MzIob2Zmc2V0LCBqc2IuX19pc0xpdHRsZUVuZGlhbl9fKTtcbiAgICAgICAgICAgIGR2LnNldEludDMyKG9mZnNldCwgZmxhZ3x2ICwganNiLl9faXNMaXR0bGVFbmRpYW5fXyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYy53YXJuKFwiZmxhZyBzdG9yYWdlIHR5cGUgc2hvdWxkIGJlIGludDgvaW50MzIgb25seSwgdHlwZS9zaXplIC0+IFwiICsgdHlwZStcIi9cIitzaXplICsgXCIuXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3VwZGF0ZUNmZ0ZsYWcoZmxhZykge1xuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLl9jZmdGaWVsZHMudXBkYXRlRmxhZ3M7XG4gICAgICAgIHRoaXMuX3NldEJ1ZmZlckZsYWcodGhpcy5fY2ZnLCBmaWVsZC5vZmZzZXQsIGZpZWxkLnNpemUsIGZpZWxkLnR5cGUsIGZsYWcpO1xuICAgIH1cblxuICAgIF9zZXRCdWZmZXJWYWx1ZShkdiwgb2Zmc2V0LCBzaXplLCB0eXBlLCB2YWx1ZSkge1xuICAgICAgICBpZih0eXBlID09IFwiZmxvYXRcIiAmJiBzaXplID09IDQpIHtcbiAgICAgICAgICAgIGR2LnNldEZsb2F0MzIob2Zmc2V0LCB2YWx1ZSwganNiLl9faXNMaXR0bGVFbmRpYW5fXyk7XG4gICAgICAgIH0gZWxzZSBpZih0eXBlID09IFwiaW50MzJcIiAmJiBzaXplID09IDQpIHtcbiAgICAgICAgICAgIGR2LnNldEludDMyKG9mZnNldCwgdmFsdWUsIGpzYi5fX2lzTGl0dGxlRW5kaWFuX18pO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJib29sXCIgJiYgc2l6ZSA9PSAxKSB7XG4gICAgICAgICAgICBkdi5zZXRJbnQ4KG9mZnNldCwgISF2YWx1ZSA/IDEgOiAwLCBqc2IuX19pc0xpdHRsZUVuZGlhbl9fKTtcbiAgICAgICAgfSBlbHNlIGlmKHR5cGUgPT0gXCJDb2xvcjRCXCIgJiYgc2l6ZSA9PSA0KSB7XG4gICAgICAgICAgICBkdi5zZXRVaW50OChvZmZzZXQsIHZhbHVlLnIpO1xuICAgICAgICAgICAgZHYuc2V0VWludDgob2Zmc2V0ICsgMSwgdmFsdWUuZyk7XG4gICAgICAgICAgICBkdi5zZXRVaW50OChvZmZzZXQgKyAyLCB2YWx1ZS5iKTtcbiAgICAgICAgICAgIGR2LnNldFVpbnQ4KG9mZnNldCArIDMsIHZhbHVlLmEpO1xuICAgICAgICB9IGVsc2UgaWYodHlwZSA9PSBcImludDhcIiAmJiBzaXplID09IDEpIHtcbiAgICAgICAgICAgIGR2LnNldFVpbnQ4KG9mZnNldCwgdmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2Mud2FybihcImRvbnQga25vdyBob3cgdG8gc2V0IHZhbHVlIHRvIGJ1ZmZlciwgdHlwZS9zaXplIC0+IFwiICsgdHlwZStcIi9cIitzaXplICsgXCIuXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3NldEZpZWxkVmFsdWUoZHYsIGRlc2MsIGZpZWxkX25hbWUsIHZhbHVlKSB7XG4gICAgICAgIGxldCBmaWVsZCA9IGRlc2NbZmllbGRfbmFtZV07XG4gICAgICAgIHRoaXMuX3NldEJ1ZmZlclZhbHVlKGR2LCBmaWVsZC5vZmZzZXQsIGZpZWxkLnNpemUsIGZpZWxkLnR5cGUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBfZ2V0QnVmZmVyVmFsdWUoZHYsIG9mZnNldCwgc2l6ZSwgdHlwZSkge1xuICAgICAgICBpZih0eXBlID09IFwiZmxvYXRcIiAmJiBzaXplID09IDQpIHtcbiAgICAgICAgICAgIHJldHVybiBkdi5nZXRGbG9hdDMyKG9mZnNldCwganNiLl9faXNMaXR0bGVFbmRpYW5fXyk7XG4gICAgICAgIH0gZWxzZSBpZih0eXBlID09IFwiaW50MzJcIiAmJiBzaXplID09IDQpIHtcbiAgICAgICAgICAgIHJldHVybiBkdi5nZXRJbnQzMihvZmZzZXQsIGpzYi5fX2lzTGl0dGxlRW5kaWFuX18pO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJib29sXCIgJiYgc2l6ZSA9PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gZHYuZ2V0SW50OChvZmZzZXQsIGpzYi5fX2lzTGl0dGxlRW5kaWFuX18pICE9IDA7XG4gICAgICAgIH0gZWxzZSBpZih0eXBlID09IFwiQ29sb3I0QlwiICYmIHNpemUgPT0gNCkge1xuICAgICAgICAgICAgbGV0IHIgPSBkdi5nZXRVaW50OChvZmZzZXQpO1xuICAgICAgICAgICAgbGV0IGcgPSBkdi5nZXRVaW50OChvZmZzZXQgKyAxKTtcbiAgICAgICAgICAgIGxldCBiID0gZHYuZ2V0VWludDgob2Zmc2V0ICsgMik7XG4gICAgICAgICAgICBsZXQgYSA9IGR2LmdldFVpbnQ4KG9mZnNldCArIDMpO1xuICAgICAgICAgICAgcmV0dXJuIHtyLCBnLCBiLCBhfTtcbiAgICAgICAgfSBlbHNlIGlmKHR5cGUgPT0gXCJpbnQ4XCIgJiYgc2l6ZSA9PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gZHYuZ2V0VWludDgob2Zmc2V0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLndhcm4oXCJkb250IGtub3cgaG93IHRvIGdldCB2YWx1ZSBmcm9tIGJ1ZmZlciwgdHlwZS9zaXplIC0+IFwiICsgdHlwZStcIi9cIitzaXplICsgXCIuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9nZXRGaWVsZFZhbHVlKGR2LCBkZXNjLCBmaWVsZF9uYW1lKSB7XG4gICAgICAgIGxldCBmaWVsZCA9IGRlc2NbZmllbGRfbmFtZV07XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRCdWZmZXJWYWx1ZShkdiwgZmllbGQub2Zmc2V0LCBmaWVsZC5zaXplLCBmaWVsZC50eXBlKTtcbiAgICB9XG5cbiAgICBfZ2V0TGF5b3V0VmFsdWUoZmllbGRfbmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0RmllbGRWYWx1ZSh0aGlzLl9sYXlvdXRJbmZvLCB0aGlzLl9sYXlvdXRGaWVsZHMsIGZpZWxkX25hbWUpO1xuICAgIH1cblxuICAgIF9zZXRMYXlvdXRWYWx1ZShmaWVsZF9uYW1lLCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2V0RmllbGRWYWx1ZSh0aGlzLl9sYXlvdXRJbmZvLCB0aGlzLl9sYXlvdXRGaWVsZHMsIGZpZWxkX25hbWUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBfdXBkYXRlQ2ZnRmxhZ19Db250ZW50KCkge1xuICAgICAgICB0aGlzLl91cGRhdGVDZmdGbGFnKFVQREFURV9DT05URU5UKTtcbiAgICB9XG5cbiAgICBfdXBkYXRlQ2ZnRmxhZ19Gb250KCkge1xuICAgICAgICB0aGlzLl91cGRhdGVDZmdGbGFnKFVQREFURV9GT05UKTtcbiAgICB9XG4gICAgXG4gICAgX2NvbG9yRXF1YWwoYSwgYikge1xuICAgICAgICByZXR1cm4gYS5yID09IGIuciAmJiBhLmcgPT0gYi5nICYmIGEuYiA9PSBiLmIgJiYgYS5hID09IGIuYTtcbiAgICB9IFxuXG4gICAgX2NvbG9yVG9PYmoociwgZywgYiwgYSkge1xuICAgICAgICByZXR1cm4ge3IsIGcsIGIsIGF9O1xuICAgIH1cblxuICAgIHNldFN0cmluZyhzdHIpXG4gICAge1xuICAgICAgICBpZihzdHIgIT0gdGhpcy5fbGF5b3V0LnN0cmluZykge1xuICAgICAgICAgICAgdGhpcy5fbGF5b3V0LnN0cmluZyA9IHN0cjtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUNmZ0ZsYWdfQ29udGVudCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0Rm9udFBhdGgocGF0aCkge1xuICAgICAgICBpZihwYXRoICE9IHRoaXMuX2xheW91dC5mb250UGF0aCkge1xuICAgICAgICAgICAgdGhpcy5fbGF5b3V0LmZvbnRQYXRoID0gcGF0aDtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUNmZ0ZsYWdfRm9udCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0Rm9udFNpemUoZm9udFNpemUsIGZvbnRTaXplUmV0aW5hKVxuICAgIHtcbiAgICAgICAgbGV0IG9sZGZvbnRzaXplID0gdGhpcy5fZ2V0RmllbGRWYWx1ZSh0aGlzLl9jZmcsIHRoaXMuX2NmZ0ZpZWxkcywgXCJmb250U2l6ZVwiKTtcbiAgICAgICAgaWYob2xkZm9udHNpemUgIT0gZm9udFNpemUpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldEZpZWxkVmFsdWUodGhpcy5fY2ZnLCB0aGlzLl9jZmdGaWVsZHMsIFwiZm9udFNpemVcIiwgZm9udFNpemUpO1xuICAgICAgICAgICAgdGhpcy5fc2V0RmllbGRWYWx1ZSh0aGlzLl9jZmcsIHRoaXMuX2NmZ0ZpZWxkcywgXCJmb250U2l6ZVJldGluYVwiLCBmb250U2l6ZVJldGluYSk7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVDZmdGbGFnX0ZvbnQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldE91dGxpbmUob3V0bGluZSkge1xuICAgICAgICBsZXQgb2xkT3V0bGluZSA9IHRoaXMuX2dldExheW91dFZhbHVlKFwib3V0bGluZVNpemVcIik7XG4gICAgICAgIGlmKChvbGRPdXRsaW5lID4gMCkgIT0gKG91dGxpbmUgPiAwKSkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ2ZnRmxhZ19Gb250KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYob2xkT3V0bGluZSAhPSBvdXRsaW5lKSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVDZmdGbGFnX0NvbnRlbnQoKTtcbiAgICAgICAgICAgIHRoaXMuX3NldExheW91dFZhbHVlKFwib3V0bGluZVNpemVcIiwgb3V0bGluZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRPdXRsaW5lQ29sb3IoY29sb3IpIHtcbiAgICAgICAgbGV0IG9sZENvbG9yID0gdGhpcy5fZ2V0TGF5b3V0VmFsdWUoIFwib3V0bGluZUNvbG9yXCIpO1xuICAgICAgICBpZighdGhpcy5fY29sb3JFcXVhbChvbGRDb2xvciwgY29sb3IpKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRMYXlvdXRWYWx1ZShcIm91dGxpbmVDb2xvclwiLCBjb2xvcik7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVDZmdGbGFnX0NvbnRlbnQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldExpbmVIZWlnaHQobGluZUhlaWdodCkge1xuICAgICAgICBsZXQgb2xkTGluZUhlaWdodCA9IHRoaXMuX2dldExheW91dFZhbHVlKFwibGluZUhlaWdodFwiKTtcbiAgICAgICAgaWYob2xkTGluZUhlaWdodCAhPSBsaW5lSGVpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRMYXlvdXRWYWx1ZShcImxpbmVIZWlnaHRcIiwgbGluZUhlaWdodCk7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVDZmdGbGFnX0NvbnRlbnQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldE92ZXJGbG93KG92ZXJmbG93KSB7XG4gICAgICAgIGxldCBvbGRWYWx1ZSA9IHRoaXMuX2dldExheW91dFZhbHVlKFwib3ZlcmZsb3dcIik7XG4gICAgICAgIGlmKG9sZFZhbHVlICE9IG92ZXJmbG93KSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRMYXlvdXRWYWx1ZShcIm92ZXJmbG93XCIsIG92ZXJmbG93KTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUNmZ0ZsYWdfQ29udGVudCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0RW5hYmxlV3JhcCh2YWx1ZSkge1xuICAgICAgICBsZXQgb2xkVmFsdWUgPSB0aGlzLl9nZXRMYXlvdXRWYWx1ZShcIndyYXBcIik7XG4gICAgICAgIGlmKG9sZFZhbHVlICE9IHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRMYXlvdXRWYWx1ZShcIndyYXBcIiwgdmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ2ZnRmxhZ19Db250ZW50KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRWZXJ0aWNhbEFsaWduKHZhbHVlKSB7XG4gICAgICAgIGxldCBvbGRWYWx1ZSA9IHRoaXMuX2dldExheW91dFZhbHVlKFwidmFsaWduXCIpO1xuICAgICAgICBpZihvbGRWYWx1ZSAhPSB2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fc2V0TGF5b3V0VmFsdWUoXCJ2YWxpZ25cIiwgdmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ2ZnRmxhZ19Db250ZW50KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRIb3Jpem9udGFsQWxpZ24odmFsdWUpIHtcbiAgICAgICAgbGV0IG9sZFZhbHVlID0gdGhpcy5fZ2V0TGF5b3V0VmFsdWUoXCJoYWxpZ25cIik7XG4gICAgICAgIGlmKG9sZFZhbHVlICE9IHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRMYXlvdXRWYWx1ZShcImhhbGlnblwiLCB2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVDZmdGbGFnX0NvbnRlbnQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldENvbnRlbnRTaXplKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgbGV0IG9sZFdpZHRoID0gdGhpcy5fZ2V0TGF5b3V0VmFsdWUoXCJ3aWR0aFwiKTtcbiAgICAgICAgbGV0IG9sZEhlaWdodCA9IHRoaXMuX2dldExheW91dFZhbHVlKFwiaGVpZ2h0XCIpO1xuICAgICAgICBpZihvbGRXaWR0aCAhPSB3aWR0aCB8fCBvbGRIZWlnaHQgIT0gaGVpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRMYXlvdXRWYWx1ZShcImhlaWdodFwiLCBoZWlnaHQpO1xuICAgICAgICAgICAgdGhpcy5fc2V0TGF5b3V0VmFsdWUoXCJ3aWR0aFwiLCB3aWR0aCk7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVDZmdGbGFnX0NvbnRlbnQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldEFuY2hvclBvaW50KHgsIHkpIHtcbiAgICAgICAgbGV0IG9sZFggPSB0aGlzLl9nZXRMYXlvdXRWYWx1ZShcImFuY2hvclhcIik7XG4gICAgICAgIGxldCBvbGRZID0gdGhpcy5fZ2V0TGF5b3V0VmFsdWUoXCJhbmNob3JZXCIpO1xuICAgICAgICBpZihvbGRYICE9IHggfHwgb2xkWSAhPSB5KSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRMYXlvdXRWYWx1ZShcImFuY2hvclhcIiwgeCk7XG4gICAgICAgICAgICB0aGlzLl9zZXRMYXlvdXRWYWx1ZShcImFuY2hvcllcIiwgeSk7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVDZmdGbGFnX0NvbnRlbnQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldENvbG9yKGNvbG9yKSB7XG4gICAgICAgIGxldCBvbGRDb2xvciA9IHRoaXMuX2dldExheW91dFZhbHVlKFwiY29sb3JcIik7XG4gICAgICAgIGlmKCF0aGlzLl9jb2xvckVxdWFsKG9sZENvbG9yLCBjb2xvcikpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldExheW91dFZhbHVlKFwiY29sb3JcIiwgY29sb3IpO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ2ZnRmxhZ19Db250ZW50KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRTaGFkb3coIHgsIHksIGJsdXIpIHtcbiAgICAgICAgbGV0IG9sZEJsdXIgPSB0aGlzLl9nZXRMYXlvdXRWYWx1ZShcInNoYWRvd0JsdXJcIik7XG4gICAgICAgIGxldCBvbGRYID0gdGhpcy5fZ2V0TGF5b3V0VmFsdWUoXCJzaGFkb3dYXCIpO1xuICAgICAgICBsZXQgb2xkWSA9IHRoaXMuX2dldExheW91dFZhbHVlKFwic2hhZG93WVwiKTtcbiAgICAgICAgaWYoKG9sZEJsdXIgPiAwKSAhPSAoYmx1ciA+IDApKSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVDZmdGbGFnX0ZvbnQoKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdXBkYXRlQ29udGVudCA9IGZhbHNlO1xuICAgICAgICBpZihvbGRCbHVyICE9IGJsdXIpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldExheW91dFZhbHVlKFwic2hhZG93Qmx1clwiLCBibHVyKTtcbiAgICAgICAgICAgIHVwZGF0ZUNvbnRlbnQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmKG9sZFggIT0geCkge1xuICAgICAgICAgICAgdGhpcy5fc2V0TGF5b3V0VmFsdWUoXCJzaGFkb3dYXCIsIHgpO1xuICAgICAgICAgICAgdXBkYXRlQ29udGVudCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYob2xkWSAhPSB5KSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRMYXlvdXRWYWx1ZShcInNoYWRvd1lcIiwgeSk7XG4gICAgICAgICAgICB1cGRhdGVDb250ZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZih1cGRhdGVDb250ZW50KSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVDZmdGbGFnX0NvbnRlbnQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldFNoYWRvd0NvbG9yKGNvbG9yKSB7XG4gICAgICAgIGxldCBvbGRDb2xvciA9IHRoaXMuX2dldExheW91dFZhbHVlKFwic2hhZG93Q29sb3JcIik7XG4gICAgICAgIGlmKCF0aGlzLl9jb2xvckVxdWFsKG9sZENvbG9yLCBjb2xvcikpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldExheW91dFZhbHVlKFwic2hhZG93Q29sb3JcIiwgY29sb3IpO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ2ZnRmxhZ19Db250ZW50KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRJdGFsaWMoZW5hYmxlZCkge1xuICAgICAgICBsZXQgb2xkSXRhbGljID0gdGhpcy5fZ2V0TGF5b3V0VmFsdWUoXCJpdGFsaWNcIik7XG4gICAgICAgIGlmKG9sZEl0YWxpYyE9ZW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5fc2V0TGF5b3V0VmFsdWUoXCJpdGFsaWNcIiwgZW5hYmxlZCk7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVDZmdGbGFnX0NvbnRlbnQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldEJvbGQoYm9sZCkge1xuICAgICAgICBsZXQgb2xkQm9sZCA9IHRoaXMuX2dldExheW91dFZhbHVlKFwiYm9sZFwiKTtcbiAgICAgICAgaWYob2xkQm9sZCE9Ym9sZCkge1xuICAgICAgICAgICAgdGhpcy5fc2V0TGF5b3V0VmFsdWUoXCJib2xkXCIsIGJvbGQpO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ2ZnRmxhZ19Db250ZW50KCk7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVDZmdGbGFnX0ZvbnQoKTsgLy9lbmFibGUgc2RmXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRVbmRlcmxpbmUodW5kZXJsaW5lKVxuICAgIHtcbiAgICAgICAgbGV0IG9sZEJvbGQgPSB0aGlzLl9nZXRMYXlvdXRWYWx1ZShcInVuZGVybGluZVwiKTtcbiAgICAgICAgaWYob2xkQm9sZCAhPSB1bmRlcmxpbmUpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldExheW91dFZhbHVlKFwidW5kZXJsaW5lXCIsIHVuZGVybGluZSk7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVDZmdGbGFnX0NvbnRlbnQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldFNwYWNpbmdYKHgpIHtcbiAgICAgICAgbGV0IG9sZFggPSB0aGlzLl9nZXRMYXlvdXRWYWx1ZShcInNwYWNlWFwiKTtcbiAgICAgICAgaWYob2xkWCAhPSB4ICYmIHR5cGVvZiB4ID09IFwibnVtYmVyXCIgICYmICEgaXNOYU4oeCkpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldExheW91dFZhbHVlKFwic3BhY2VYXCIsIHgpO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ2ZnRmxhZ19Db250ZW50KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVSZW5kZXJEYXRhKGNvbXApIHtcblxuICAgICAgICBpZiAoIWNvbXAuX3ZlcnRzRGlydHkpIHJldHVybjtcblxuICAgICAgICBpZiAoY29tcC5mb250ICYmIGNvbXAuZm9udC5uYXRpdmVVcmwpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0Rm9udFBhdGgoY2MuYXNzZXRNYW5hZ2VyLmNhY2hlTWFuYWdlci5nZXRDYWNoZShjb21wLmZvbnQubmF0aXZlVXJsKSB8fCBjb21wLmZvbnQubmF0aXZlVXJsKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbGF5b3V0ID0gdGhpcy5fbGF5b3V0O1xuICAgICAgICBsZXQgYyA9IGNvbXAubm9kZS5jb2xvcjtcbiAgICAgICAgbGV0IG5vZGUgPSBjb21wLm5vZGU7XG4gICAgICAgIGxldCByZXRpbmFTaXplID0gY29tcC5mb250U2l6ZTtcblxuICAgICAgICB0aGlzLnNldFN0cmluZyhjb21wLnN0cmluZyk7XG4gICAgICAgIHRoaXMuc2V0Rm9udFNpemUoY29tcC5mb250U2l6ZSwgcmV0aW5hU2l6ZSAvIDcyICogY29tcC5mb250U2l6ZSk7XG4gICAgICAgIHRoaXMuc2V0TGluZUhlaWdodChjb21wLmxpbmVIZWlnaHQpO1xuICAgICAgICB0aGlzLnNldEVuYWJsZVdyYXAoY29tcC5lbmFibGVXcmFwVGV4dCk7XG4gICAgICAgIHRoaXMuc2V0SXRhbGljKGNvbXAuZW5hYmxlSXRhbGljKTtcbiAgICAgICAgdGhpcy5zZXRVbmRlcmxpbmUoY29tcC5lbmFibGVVbmRlcmxpbmUpO1xuICAgICAgICB0aGlzLnNldEJvbGQoY29tcC5lbmFibGVCb2xkKTtcbiAgICAgICAgdGhpcy5zZXRPdmVyRmxvdyhjb21wLm92ZXJmbG93KTtcbiAgICAgICAgdGhpcy5zZXRWZXJ0aWNhbEFsaWduKGNvbXAudmVydGljYWxBbGlnbik7XG4gICAgICAgIHRoaXMuc2V0SG9yaXpvbnRhbEFsaWduKGNvbXAuaG9yaXpvbnRhbEFsaWduKTtcbiAgICAgICAgdGhpcy5zZXRTcGFjaW5nWChjb21wLnNwYWNpbmdYKTtcbiAgICAgICAgdGhpcy5zZXRDb250ZW50U2l6ZShub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGgsIG5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQpO1xuICAgICAgICB0aGlzLnNldEFuY2hvclBvaW50KG5vZGUuYW5jaG9yWCwgbm9kZS5hbmNob3JZKTtcbiAgICAgICAgdGhpcy5zZXRDb2xvcih0aGlzLl9jb2xvclRvT2JqKGMuZ2V0UigpLCBjLmdldEcoKSwgYy5nZXRCKCksIE1hdGguY2VpbChjLmdldEEoKSAqIG5vZGUub3BhY2l0eSAvIDI1NSkpKTtcblxuXG4gICAgICAgIGxldCBzaGFkb3cgPSBub2RlLmdldENvbXBvbmVudChjYy5MYWJlbFNoYWRvdyk7XG4gICAgICAgIGlmIChzaGFkb3cgJiYgc2hhZG93LmVuYWJsZWQpIHtcbiAgICAgICAgICAgIGxldCBzaGFkb3dDb2xvciA9IHNoYWRvdy5jb2xvcjtcbiAgICAgICAgICAgIHRoaXMuc2V0U2hhZG93KHNoYWRvdy5vZmZzZXQueCwgc2hhZG93Lm9mZnNldC55LCBzaGFkb3cuYmx1cik7XG4gICAgICAgICAgICB0aGlzLnNldFNoYWRvd0NvbG9yKHRoaXMuX2NvbG9yVG9PYmooc2hhZG93Q29sb3IuZ2V0UigpLCBzaGFkb3dDb2xvci5nZXRHKCksIHNoYWRvd0NvbG9yLmdldEIoKSwgTWF0aC5jZWlsKHNoYWRvd0NvbG9yLmdldEEoKSAqIG5vZGUub3BhY2l0eSAvIDI1NSkpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U2hhZG93KDAsIDAsIC0xKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3VwZGF0ZVRURk1hdGVyaWFsKGNvbXApO1xuICAgICAgICBcbiAgICAgICAgbGF5b3V0LnJlbmRlcigpO1xuICAgICAgICAvL2NvbXAuX3ZlcnRzRGlydHkgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBfYmluZE1hdGVyaWFsKGNvbXApIHtcbiAgICAgICAgbGV0IG1hdGVyaWFsID0gdGhpcy5sYWJlbE1hdGVyaWFsO1xuICAgICAgICBpZighbWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIG1hdGVyaWFsID0gTWF0ZXJpYWxWYXJpYW50LmNyZWF0ZVdpdGhCdWlsdGluKFwiMmQtbGFiZWxcIiwgY29tcCk7XG4gICAgICAgICAgICB0aGlzLmxhYmVsTWF0ZXJpYWwgPSBtYXRlcmlhbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWF0ZXJpYWw7XG4gICAgfVxuXG4gICAgX3VwZGF0ZVRURk1hdGVyaWFsKGNvbXApIHtcbiAgICAgICAgbGV0IG1hdGVyaWFsID0gdGhpcy5fYmluZE1hdGVyaWFsKGNvbXApXG4gICAgICAgIGxldCBub2RlID0gdGhpcy5fbGFiZWwubm9kZTtcbiAgICAgICAgbGV0IGxheW91dCA9IHRoaXMuX2xheW91dDtcbiAgICAgICAgbGV0IG91dGxpbmUgPSBub2RlLmdldENvbXBvbmVudChjYy5MYWJlbE91dGxpbmUpO1xuICAgICAgICBsZXQgb3V0bGluZVNpemUgPSAwO1xuICAgICAgICBpZiAob3V0bGluZSAmJiBvdXRsaW5lLmVuYWJsZWQgJiYgb3V0bGluZS53aWR0aCA+IDApIHtcbiAgICAgICAgICAgIG91dGxpbmVTaXplID0gTWF0aC5tYXgoTWF0aC5taW4ob3V0bGluZS53aWR0aCAvIDEwLCAwLjQpLCAwLjEpO1xuICAgICAgICAgICAgbGV0IGMgPSBvdXRsaW5lLmNvbG9yO1xuICAgICAgICAgICAgdGhpcy5zZXRPdXRsaW5lQ29sb3IodGhpcy5fY29sb3JUb09iaihjLmdldFIoKSwgYy5nZXRHKCksIGMuZ2V0QigpLCBNYXRoLmNlaWwoYy5nZXRBKCkgKiBub2RlLm9wYWNpdHkgLyAyNTUpKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRPdXRsaW5lKG91dGxpbmVTaXplKTtcbiAgICAgICAgbWF0ZXJpYWwuZGVmaW5lKCdDQ19VU0VfTU9ERUwnLCB0cnVlKTtcbiAgICAgICAgbWF0ZXJpYWwuZGVmaW5lKCdVU0VfVEVYVFVSRV9BTFBIQU9OTFknLCB0cnVlKTtcbiAgICAgICAgbWF0ZXJpYWwuZGVmaW5lKCdVU0VfU0RGJywgb3V0bGluZVNpemUgPiAwLjAgfHwgY29tcC5lbmFibGVCb2xkICk7XG4gICAgICAgIG1hdGVyaWFsLmRlZmluZSgnVVNFX1NERl9FWFRFTkQnLCBjb21wLmVuYWJsZUJvbGQgPyAxIDogMCk7XG4gICAgICAgIGlmIChtYXRlcmlhbC5nZXREZWZpbmUoJ0NDX1NVUFBPUlRfc3RhbmRhcmRfZGVyaXZhdGl2ZXMnKSAhPT0gdW5kZWZpbmVkICYmIGNjLnN5cy5nbEV4dGVuc2lvbignT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzJykpIHtcbiAgICAgICAgICAgIG1hdGVyaWFsLmRlZmluZSgnQ0NfU1VQUE9SVF9zdGFuZGFyZF9kZXJpdmF0aXZlcycsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGxheW91dC5zZXRFZmZlY3QobWF0ZXJpYWwuZWZmZWN0Ll9uYXRpdmVPYmopO1xuICAgIH1cblxuICAgIGZpbGxCdWZmZXJzIChjb21wLCByZW5kZXJlcikge1xuICAgICAgICB0aGlzLl9sYXlvdXQucmVuZGVyKCk7XG4gICAgfVxuICAgIGdldFZmbXQoKSB7XG4gICAgfVxufSJdLCJzb3VyY2VSb290IjoiLyJ9