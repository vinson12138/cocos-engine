
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/utils/label/ttf.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _assembler2d = _interopRequireDefault(require("../../assembler-2d"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var textUtils = require('../../../utils/text-utils');

var macro = require('../../../platform/CCMacro');

var Label = require('../../../components/CCLabel');

var LabelOutline = require('../../../components/CCLabelOutline');

var LabelShadow = require('../../../components/CCLabelShadow');

var Overflow = Label.Overflow;

var deleteFromDynamicAtlas = require('../utils').deleteFromDynamicAtlas;

var getFontFamily = require('../utils').getFontFamily;

var MAX_SIZE = 2048;

var _invisibleAlpha = (1 / 255).toFixed(3);

var _context = null;
var _canvas = null;
var _texture = null;
var _fontDesc = '';
var _string = '';
var _fontSize = 0;
var _drawFontSize = 0;
var _splitedStrings = [];
var _canvasSize = cc.Size.ZERO;
var _lineHeight = 0;
var _hAlign = 0;
var _vAlign = 0;
var _color = null;
var _fontFamily = '';
var _overflow = Overflow.NONE;
var _isWrapText = false;
var _premultiply = false; // outline

var _outlineComp = null;
var _outlineColor = cc.Color.WHITE; // shadow

var _shadowComp = null;
var _shadowColor = cc.Color.BLACK;

var _canvasPadding = cc.rect();

var _contentSizeExtend = cc.Size.ZERO;
var _nodeContentSize = cc.Size.ZERO;
var _enableBold = false;
var _enableItalic = false;
var _enableUnderline = false;
var _underlineThickness = 0;
var _drawUnderlinePos = cc.Vec2.ZERO;
var _drawUnderlineWidth = 0;

var _sharedLabelData;

var Alignment = ['left', // macro.TextAlignment.LEFT
'center', // macro.TextAlignment.CENTER
'right' // macro.TextAlignment.RIGHT
];

var TTFAssembler = /*#__PURE__*/function (_Assembler2D) {
  _inheritsLoose(TTFAssembler, _Assembler2D);

  function TTFAssembler() {
    return _Assembler2D.apply(this, arguments) || this;
  }

  var _proto = TTFAssembler.prototype;

  _proto._getAssemblerData = function _getAssemblerData() {
    _sharedLabelData = Label._canvasPool.get();
    _sharedLabelData.canvas.width = _sharedLabelData.canvas.height = 1;
    return _sharedLabelData;
  };

  _proto._resetAssemblerData = function _resetAssemblerData(assemblerData) {
    if (assemblerData) {
      Label._canvasPool.put(assemblerData);
    }
  };

  _proto.updateRenderData = function updateRenderData(comp) {
    _Assembler2D.prototype.updateRenderData.call(this, comp);

    if (!comp._vertsDirty) return;

    this._updateProperties(comp);

    this._calculateLabelFont();

    this._updateLabelDimensions();

    this._updateTexture(comp);

    this._calDynamicAtlas(comp);

    comp._actualFontSize = _fontSize;
    comp.node.setContentSize(_nodeContentSize);
    this.updateVerts(comp);
    comp._vertsDirty = false;
    _context = null;
    _canvas = null;
    _texture = null;
  };

  _proto.updateVerts = function updateVerts() {};

  _proto._updatePaddingRect = function _updatePaddingRect() {
    var top = 0,
        bottom = 0,
        left = 0,
        right = 0;
    var outlineWidth = 0;
    _contentSizeExtend.width = _contentSizeExtend.height = 0;

    if (_outlineComp) {
      outlineWidth = _outlineComp.width;
      top = bottom = left = right = outlineWidth;
      _contentSizeExtend.width = _contentSizeExtend.height = outlineWidth * 2;
    }

    if (_shadowComp) {
      var shadowWidth = _shadowComp.blur + outlineWidth;
      left = Math.max(left, -_shadowComp._offset.x + shadowWidth);
      right = Math.max(right, _shadowComp._offset.x + shadowWidth);
      top = Math.max(top, _shadowComp._offset.y + shadowWidth);
      bottom = Math.max(bottom, -_shadowComp._offset.y + shadowWidth);
    }

    if (_enableItalic) {
      //0.0174532925 = 3.141592653 / 180
      var offset = _drawFontSize * Math.tan(12 * 0.0174532925);

      right += offset;
      _contentSizeExtend.width += offset;
    }

    _canvasPadding.x = left;
    _canvasPadding.y = top;
    _canvasPadding.width = left + right;
    _canvasPadding.height = top + bottom;
  };

  _proto._updateProperties = function _updateProperties(comp) {
    var assemblerData = comp._assemblerData;
    _context = assemblerData.context;
    _canvas = assemblerData.canvas;
    _texture = comp._frame._original ? comp._frame._original._texture : comp._frame._texture;
    _string = comp.string.toString();
    _fontSize = comp._fontSize;
    _drawFontSize = _fontSize;
    _underlineThickness = comp.underlineHeight || _drawFontSize / 8;
    _overflow = comp.overflow;
    _canvasSize.width = comp.node.width;
    _canvasSize.height = comp.node.height;
    _nodeContentSize = comp.node.getContentSize();
    _lineHeight = comp._lineHeight;
    _hAlign = comp.horizontalAlign;
    _vAlign = comp.verticalAlign;
    _color = comp.node.color;
    _enableBold = comp.enableBold;
    _enableItalic = comp.enableItalic;
    _enableUnderline = comp.enableUnderline;
    _fontFamily = getFontFamily(comp);
    _premultiply = comp.srcBlendFactor === cc.macro.BlendFactor.ONE;

    if (CC_NATIVERENDERER) {
      _context._setPremultiply(_premultiply);
    }

    if (_overflow === Overflow.NONE) {
      _isWrapText = false;
    } else if (_overflow === Overflow.RESIZE_HEIGHT) {
      _isWrapText = true;
    } else {
      _isWrapText = comp.enableWrapText;
    } // outline


    _outlineComp = LabelOutline && comp.getComponent(LabelOutline);
    _outlineComp = _outlineComp && _outlineComp.enabled && _outlineComp.width > 0 ? _outlineComp : null;

    if (_outlineComp) {
      _outlineColor.set(_outlineComp.color);
    } // shadow


    _shadowComp = LabelShadow && comp.getComponent(LabelShadow);
    _shadowComp = _shadowComp && _shadowComp.enabled ? _shadowComp : null;

    if (_shadowComp) {
      _shadowColor.set(_shadowComp.color); // TODO: temporary solution, cascade opacity for outline color


      _shadowColor.a = _shadowColor.a * comp.node.color.a / 255.0;
    }

    this._updatePaddingRect();
  };

  _proto._calculateFillTextStartPosition = function _calculateFillTextStartPosition() {
    var labelX = 0;

    if (_hAlign === macro.TextAlignment.RIGHT) {
      labelX = _canvasSize.width - _canvasPadding.width;
    } else if (_hAlign === macro.TextAlignment.CENTER) {
      labelX = (_canvasSize.width - _canvasPadding.width) / 2;
    }

    var lineHeight = this._getLineHeight();

    var drawStartY = lineHeight * (_splitedStrings.length - 1); // TOP

    var firstLinelabelY = _fontSize * (1 - textUtils.BASELINE_RATIO / 2);

    if (_vAlign !== macro.VerticalTextAlignment.TOP) {
      // free space in vertical direction
      var blank = drawStartY + _canvasPadding.height + _fontSize - _canvasSize.height;

      if (_vAlign === macro.VerticalTextAlignment.BOTTOM) {
        // Unlike BMFont, needs to reserve space below.
        blank += textUtils.BASELINE_RATIO / 2 * _fontSize; // BOTTOM

        firstLinelabelY -= blank;
      } else {
        // CENTER
        firstLinelabelY -= blank / 2;
      }
    }

    firstLinelabelY += textUtils.BASELINE_OFFSET * _fontSize;
    return cc.v2(labelX + _canvasPadding.x, firstLinelabelY + _canvasPadding.y);
  };

  _proto._setupOutline = function _setupOutline() {
    _context.strokeStyle = "rgba(" + _outlineColor.r + ", " + _outlineColor.g + ", " + _outlineColor.b + ", " + _outlineColor.a / 255 + ")";
    _context.lineWidth = _outlineComp.width * 2;
  };

  _proto._setupShadow = function _setupShadow() {
    _context.shadowColor = "rgba(" + _shadowColor.r + ", " + _shadowColor.g + ", " + _shadowColor.b + ", " + _shadowColor.a / 255 + ")";
    _context.shadowBlur = _shadowComp.blur;
    _context.shadowOffsetX = _shadowComp.offset.x;
    _context.shadowOffsetY = -_shadowComp.offset.y;
  };

  _proto._drawTextEffect = function _drawTextEffect(startPosition, lineHeight) {
    if (!_shadowComp && !_outlineComp && !_enableUnderline) return;
    var isMultiple = _splitedStrings.length > 1 && _shadowComp;

    var measureText = this._measureText(_context, _fontDesc);

    var drawTextPosX = 0,
        drawTextPosY = 0; // only one set shadow and outline

    if (_shadowComp) {
      this._setupShadow();
    }

    if (_outlineComp) {
      this._setupOutline();
    } // draw shadow and (outline or text)


    for (var i = 0; i < _splitedStrings.length; ++i) {
      drawTextPosX = startPosition.x;
      drawTextPosY = startPosition.y + i * lineHeight; // multiple lines need to be drawn outline and fill text

      if (isMultiple) {
        if (_outlineComp) {
          _context.strokeText(_splitedStrings[i], drawTextPosX, drawTextPosY);
        }

        _context.fillText(_splitedStrings[i], drawTextPosX, drawTextPosY);
      } // draw underline


      if (_enableUnderline) {
        _drawUnderlineWidth = measureText(_splitedStrings[i]);

        if (_hAlign === macro.TextAlignment.RIGHT) {
          _drawUnderlinePos.x = startPosition.x - _drawUnderlineWidth;
        } else if (_hAlign === macro.TextAlignment.CENTER) {
          _drawUnderlinePos.x = startPosition.x - _drawUnderlineWidth / 2;
        } else {
          _drawUnderlinePos.x = startPosition.x;
        }

        _drawUnderlinePos.y = drawTextPosY + _drawFontSize / 8;

        _context.fillRect(_drawUnderlinePos.x, _drawUnderlinePos.y, _drawUnderlineWidth, _underlineThickness);
      }
    }

    if (isMultiple) {
      _context.shadowColor = 'transparent';
    }
  };

  _proto._updateTexture = function _updateTexture() {
    _context.clearRect(0, 0, _canvas.width, _canvas.height); // use round for line join to avoid sharp intersect point


    _context.lineJoin = 'round'; //Add a white background to avoid black edges.

    if (!_premultiply) {
      //TODO: it is best to add alphaTest to filter out the background color.
      var _fillColor = _outlineComp ? _outlineColor : _color;

      _context.fillStyle = "rgba(" + _fillColor.r + ", " + _fillColor.g + ", " + _fillColor.b + ", " + _invisibleAlpha + ")";

      _context.fillRect(0, 0, _canvas.width, _canvas.height);

      _context.fillStyle = "rgba(" + _color.r + ", " + _color.g + ", " + _color.b + ", 1)";
    } else {
      _context.fillStyle = "rgba(" + _color.r + ", " + _color.g + ", " + _color.b + ", " + _color.a / 255.0 + ")";
    }

    var startPosition = this._calculateFillTextStartPosition();

    var lineHeight = this._getLineHeight();

    var drawTextPosX = startPosition.x,
        drawTextPosY = 0; // draw shadow and underline

    this._drawTextEffect(startPosition, lineHeight); // draw text and outline


    for (var i = 0; i < _splitedStrings.length; ++i) {
      drawTextPosY = startPosition.y + i * lineHeight;

      if (_outlineComp) {
        _context.strokeText(_splitedStrings[i], drawTextPosX, drawTextPosY);
      }

      _context.fillText(_splitedStrings[i], drawTextPosX, drawTextPosY);
    }

    if (_shadowComp) {
      _context.shadowColor = 'transparent';
    }

    _texture.handleLoadedTexture();
  };

  _proto._calDynamicAtlas = function _calDynamicAtlas(comp) {
    if (comp.cacheMode !== Label.CacheMode.BITMAP) return;
    var frame = comp._frame; // Delete cache in atlas.

    deleteFromDynamicAtlas(comp, frame);

    if (!frame._original) {
      frame.setRect(cc.rect(0, 0, _canvas.width, _canvas.height));
    }

    this.packToDynamicAtlas(comp, frame);
  };

  _proto._updateLabelDimensions = function _updateLabelDimensions() {
    _canvasSize.width = Math.min(_canvasSize.width, MAX_SIZE);
    _canvasSize.height = Math.min(_canvasSize.height, MAX_SIZE);
    var recreate = false;

    if (_canvas.width !== _canvasSize.width) {
      _canvas.width = _canvasSize.width;
      recreate = true;
    }

    if (_canvas.height !== _canvasSize.height) {
      _canvas.height = _canvasSize.height;
      recreate = true;
    }

    recreate && (_context.font = _fontDesc); // align

    _context.textAlign = Alignment[_hAlign];
  };

  _proto._getFontDesc = function _getFontDesc() {
    var fontDesc = _fontSize.toString() + 'px ';
    fontDesc = fontDesc + _fontFamily;

    if (_enableBold) {
      fontDesc = "bold " + fontDesc;
    }

    if (_enableItalic) {
      fontDesc = "italic " + fontDesc;
    }

    return fontDesc;
  };

  _proto._getLineHeight = function _getLineHeight() {
    var nodeSpacingY = _lineHeight;

    if (nodeSpacingY === 0) {
      nodeSpacingY = _fontSize;
    } else {
      nodeSpacingY = nodeSpacingY * _fontSize / _drawFontSize;
    }

    return nodeSpacingY | 0;
  };

  _proto._calculateParagraphLength = function _calculateParagraphLength(paragraphedStrings, ctx) {
    var paragraphLength = [];

    for (var i = 0; i < paragraphedStrings.length; ++i) {
      var width = textUtils.safeMeasureText(ctx, paragraphedStrings[i], _fontDesc);
      paragraphLength.push(width);
    }

    return paragraphLength;
  };

  _proto._measureText = function _measureText(ctx, fontDesc) {
    return function (string) {
      return textUtils.safeMeasureText(ctx, string, fontDesc);
    };
  };

  _proto._calculateShrinkFont = function _calculateShrinkFont(paragraphedStrings) {
    var paragraphLength = this._calculateParagraphLength(paragraphedStrings, _context);

    var i = 0;
    var totalHeight = 0;
    var maxLength = 0;

    if (_isWrapText) {
      var canvasWidthNoMargin = _nodeContentSize.width;
      var canvasHeightNoMargin = _nodeContentSize.height;

      if (canvasWidthNoMargin < 0 || canvasHeightNoMargin < 0) {
        return;
      }

      totalHeight = canvasHeightNoMargin + 1;
      var actualFontSize = _fontSize + 1;
      var textFragment = ""; //let startShrinkFontSize = actualFontSize | 0;

      var left = 0,
          right = actualFontSize | 0,
          mid = 0;

      while (left < right) {
        mid = left + right + 1 >> 1;

        if (mid <= 0) {
          cc.logID(4003);
          break;
        }

        _fontSize = mid;
        _fontDesc = this._getFontDesc();
        _context.font = _fontDesc;

        var lineHeight = this._getLineHeight();

        totalHeight = 0;

        for (i = 0; i < paragraphedStrings.length; ++i) {
          var allWidth = textUtils.safeMeasureText(_context, paragraphedStrings[i], _fontDesc);
          textFragment = textUtils.fragmentText(paragraphedStrings[i], allWidth, canvasWidthNoMargin, this._measureText(_context, _fontDesc));
          totalHeight += textFragment.length * lineHeight;
        }

        if (totalHeight > canvasHeightNoMargin) {
          right = mid - 1;
        } else {
          left = mid;
        }
      }

      if (left === 0) {
        cc.logID(4003);
      } else {
        _fontSize = left;
        _fontDesc = this._getFontDesc();
        _context.font = _fontDesc;
      }
    } else {
      totalHeight = paragraphedStrings.length * this._getLineHeight();

      for (i = 0; i < paragraphedStrings.length; ++i) {
        if (maxLength < paragraphLength[i]) {
          maxLength = paragraphLength[i];
        }
      }

      var scaleX = (_canvasSize.width - _canvasPadding.width) / maxLength;
      var scaleY = _canvasSize.height / totalHeight;
      _fontSize = _drawFontSize * Math.min(1, scaleX, scaleY) | 0;
      _fontDesc = this._getFontDesc();
      _context.font = _fontDesc;
    }
  };

  _proto._calculateWrapText = function _calculateWrapText(paragraphedStrings) {
    if (!_isWrapText) return;
    _splitedStrings = [];
    var canvasWidthNoMargin = _nodeContentSize.width;

    for (var i = 0; i < paragraphedStrings.length; ++i) {
      var allWidth = textUtils.safeMeasureText(_context, paragraphedStrings[i], _fontDesc);
      var textFragment = textUtils.fragmentText(paragraphedStrings[i], allWidth, canvasWidthNoMargin, this._measureText(_context, _fontDesc));
      _splitedStrings = _splitedStrings.concat(textFragment);
    }
  };

  _proto._calculateLabelFont = function _calculateLabelFont() {
    var paragraphedStrings = _string.split('\n');

    _splitedStrings = paragraphedStrings;
    _fontDesc = this._getFontDesc();
    _context.font = _fontDesc;

    switch (_overflow) {
      case Overflow.NONE:
        {
          var canvasSizeX = 0;
          var canvasSizeY = 0;

          for (var i = 0; i < paragraphedStrings.length; ++i) {
            var paraLength = textUtils.safeMeasureText(_context, paragraphedStrings[i], _fontDesc);
            canvasSizeX = canvasSizeX > paraLength ? canvasSizeX : paraLength;
          }

          canvasSizeY = (_splitedStrings.length + textUtils.BASELINE_RATIO) * this._getLineHeight();
          var rawWidth = parseFloat(canvasSizeX.toFixed(2));
          var rawHeight = parseFloat(canvasSizeY.toFixed(2));
          _canvasSize.width = rawWidth + _canvasPadding.width;
          _canvasSize.height = rawHeight + _canvasPadding.height;
          _nodeContentSize.width = rawWidth + _contentSizeExtend.width;
          _nodeContentSize.height = rawHeight + _contentSizeExtend.height;
          break;
        }

      case Overflow.SHRINK:
        {
          this._calculateShrinkFont(paragraphedStrings);

          this._calculateWrapText(paragraphedStrings);

          break;
        }

      case Overflow.CLAMP:
        {
          this._calculateWrapText(paragraphedStrings);

          break;
        }

      case Overflow.RESIZE_HEIGHT:
        {
          this._calculateWrapText(paragraphedStrings);

          var _rawHeight = (_splitedStrings.length + textUtils.BASELINE_RATIO) * this._getLineHeight();

          _canvasSize.height = _rawHeight + _canvasPadding.height; // set node height

          _nodeContentSize.height = _rawHeight + _contentSizeExtend.height;
          break;
        }
    }
  };

  return TTFAssembler;
}(_assembler2d["default"]);

exports["default"] = TTFAssembler;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL3V0aWxzL2xhYmVsL3R0Zi5qcyJdLCJuYW1lcyI6WyJ0ZXh0VXRpbHMiLCJyZXF1aXJlIiwibWFjcm8iLCJMYWJlbCIsIkxhYmVsT3V0bGluZSIsIkxhYmVsU2hhZG93IiwiT3ZlcmZsb3ciLCJkZWxldGVGcm9tRHluYW1pY0F0bGFzIiwiZ2V0Rm9udEZhbWlseSIsIk1BWF9TSVpFIiwiX2ludmlzaWJsZUFscGhhIiwidG9GaXhlZCIsIl9jb250ZXh0IiwiX2NhbnZhcyIsIl90ZXh0dXJlIiwiX2ZvbnREZXNjIiwiX3N0cmluZyIsIl9mb250U2l6ZSIsIl9kcmF3Rm9udFNpemUiLCJfc3BsaXRlZFN0cmluZ3MiLCJfY2FudmFzU2l6ZSIsImNjIiwiU2l6ZSIsIlpFUk8iLCJfbGluZUhlaWdodCIsIl9oQWxpZ24iLCJfdkFsaWduIiwiX2NvbG9yIiwiX2ZvbnRGYW1pbHkiLCJfb3ZlcmZsb3ciLCJOT05FIiwiX2lzV3JhcFRleHQiLCJfcHJlbXVsdGlwbHkiLCJfb3V0bGluZUNvbXAiLCJfb3V0bGluZUNvbG9yIiwiQ29sb3IiLCJXSElURSIsIl9zaGFkb3dDb21wIiwiX3NoYWRvd0NvbG9yIiwiQkxBQ0siLCJfY2FudmFzUGFkZGluZyIsInJlY3QiLCJfY29udGVudFNpemVFeHRlbmQiLCJfbm9kZUNvbnRlbnRTaXplIiwiX2VuYWJsZUJvbGQiLCJfZW5hYmxlSXRhbGljIiwiX2VuYWJsZVVuZGVybGluZSIsIl91bmRlcmxpbmVUaGlja25lc3MiLCJfZHJhd1VuZGVybGluZVBvcyIsIlZlYzIiLCJfZHJhd1VuZGVybGluZVdpZHRoIiwiX3NoYXJlZExhYmVsRGF0YSIsIkFsaWdubWVudCIsIlRURkFzc2VtYmxlciIsIl9nZXRBc3NlbWJsZXJEYXRhIiwiX2NhbnZhc1Bvb2wiLCJnZXQiLCJjYW52YXMiLCJ3aWR0aCIsImhlaWdodCIsIl9yZXNldEFzc2VtYmxlckRhdGEiLCJhc3NlbWJsZXJEYXRhIiwicHV0IiwidXBkYXRlUmVuZGVyRGF0YSIsImNvbXAiLCJfdmVydHNEaXJ0eSIsIl91cGRhdGVQcm9wZXJ0aWVzIiwiX2NhbGN1bGF0ZUxhYmVsRm9udCIsIl91cGRhdGVMYWJlbERpbWVuc2lvbnMiLCJfdXBkYXRlVGV4dHVyZSIsIl9jYWxEeW5hbWljQXRsYXMiLCJfYWN0dWFsRm9udFNpemUiLCJub2RlIiwic2V0Q29udGVudFNpemUiLCJ1cGRhdGVWZXJ0cyIsIl91cGRhdGVQYWRkaW5nUmVjdCIsInRvcCIsImJvdHRvbSIsImxlZnQiLCJyaWdodCIsIm91dGxpbmVXaWR0aCIsInNoYWRvd1dpZHRoIiwiYmx1ciIsIk1hdGgiLCJtYXgiLCJfb2Zmc2V0IiwieCIsInkiLCJvZmZzZXQiLCJ0YW4iLCJfYXNzZW1ibGVyRGF0YSIsImNvbnRleHQiLCJfZnJhbWUiLCJfb3JpZ2luYWwiLCJzdHJpbmciLCJ0b1N0cmluZyIsInVuZGVybGluZUhlaWdodCIsIm92ZXJmbG93IiwiZ2V0Q29udGVudFNpemUiLCJob3Jpem9udGFsQWxpZ24iLCJ2ZXJ0aWNhbEFsaWduIiwiY29sb3IiLCJlbmFibGVCb2xkIiwiZW5hYmxlSXRhbGljIiwiZW5hYmxlVW5kZXJsaW5lIiwic3JjQmxlbmRGYWN0b3IiLCJCbGVuZEZhY3RvciIsIk9ORSIsIkNDX05BVElWRVJFTkRFUkVSIiwiX3NldFByZW11bHRpcGx5IiwiUkVTSVpFX0hFSUdIVCIsImVuYWJsZVdyYXBUZXh0IiwiZ2V0Q29tcG9uZW50IiwiZW5hYmxlZCIsInNldCIsImEiLCJfY2FsY3VsYXRlRmlsbFRleHRTdGFydFBvc2l0aW9uIiwibGFiZWxYIiwiVGV4dEFsaWdubWVudCIsIlJJR0hUIiwiQ0VOVEVSIiwibGluZUhlaWdodCIsIl9nZXRMaW5lSGVpZ2h0IiwiZHJhd1N0YXJ0WSIsImxlbmd0aCIsImZpcnN0TGluZWxhYmVsWSIsIkJBU0VMSU5FX1JBVElPIiwiVmVydGljYWxUZXh0QWxpZ25tZW50IiwiVE9QIiwiYmxhbmsiLCJCT1RUT00iLCJCQVNFTElORV9PRkZTRVQiLCJ2MiIsIl9zZXR1cE91dGxpbmUiLCJzdHJva2VTdHlsZSIsInIiLCJnIiwiYiIsImxpbmVXaWR0aCIsIl9zZXR1cFNoYWRvdyIsInNoYWRvd0NvbG9yIiwic2hhZG93Qmx1ciIsInNoYWRvd09mZnNldFgiLCJzaGFkb3dPZmZzZXRZIiwiX2RyYXdUZXh0RWZmZWN0Iiwic3RhcnRQb3NpdGlvbiIsImlzTXVsdGlwbGUiLCJtZWFzdXJlVGV4dCIsIl9tZWFzdXJlVGV4dCIsImRyYXdUZXh0UG9zWCIsImRyYXdUZXh0UG9zWSIsImkiLCJzdHJva2VUZXh0IiwiZmlsbFRleHQiLCJmaWxsUmVjdCIsImNsZWFyUmVjdCIsImxpbmVKb2luIiwiX2ZpbGxDb2xvciIsImZpbGxTdHlsZSIsImhhbmRsZUxvYWRlZFRleHR1cmUiLCJjYWNoZU1vZGUiLCJDYWNoZU1vZGUiLCJCSVRNQVAiLCJmcmFtZSIsInNldFJlY3QiLCJwYWNrVG9EeW5hbWljQXRsYXMiLCJtaW4iLCJyZWNyZWF0ZSIsImZvbnQiLCJ0ZXh0QWxpZ24iLCJfZ2V0Rm9udERlc2MiLCJmb250RGVzYyIsIm5vZGVTcGFjaW5nWSIsIl9jYWxjdWxhdGVQYXJhZ3JhcGhMZW5ndGgiLCJwYXJhZ3JhcGhlZFN0cmluZ3MiLCJjdHgiLCJwYXJhZ3JhcGhMZW5ndGgiLCJzYWZlTWVhc3VyZVRleHQiLCJwdXNoIiwiX2NhbGN1bGF0ZVNocmlua0ZvbnQiLCJ0b3RhbEhlaWdodCIsIm1heExlbmd0aCIsImNhbnZhc1dpZHRoTm9NYXJnaW4iLCJjYW52YXNIZWlnaHROb01hcmdpbiIsImFjdHVhbEZvbnRTaXplIiwidGV4dEZyYWdtZW50IiwibWlkIiwibG9nSUQiLCJhbGxXaWR0aCIsImZyYWdtZW50VGV4dCIsInNjYWxlWCIsInNjYWxlWSIsIl9jYWxjdWxhdGVXcmFwVGV4dCIsImNvbmNhdCIsInNwbGl0IiwiY2FudmFzU2l6ZVgiLCJjYW52YXNTaXplWSIsInBhcmFMZW5ndGgiLCJyYXdXaWR0aCIsInBhcnNlRmxvYXQiLCJyYXdI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a0JBQXhCOztBQUNBO0FBQ0g7O0FBQ0QsV0FBS3hLLFFBQVEsQ0FBQ29NLEtBQWQ7QUFBcUI7QUFDakIsZUFBS1Ysa0JBQUwsQ0FBd0JsQixrQkFBeEI7O0FBQ0E7QUFDSDs7QUFDRCxXQUFLeEssUUFBUSxDQUFDd0csYUFBZDtBQUE2QjtBQUN6QixlQUFLa0Ysa0JBQUwsQ0FBd0JsQixrQkFBeEI7O0FBQ0EsY0FBSTBCLFVBQVMsR0FBRyxDQUFDckwsZUFBZSxDQUFDeUcsTUFBaEIsR0FBeUI1SCxTQUFTLENBQUM4SCxjQUFwQyxJQUFzRCxLQUFLSixjQUFMLEVBQXRFOztBQUNBdEcsVUFBQUEsV0FBVyxDQUFDdUMsTUFBWixHQUFxQjZJLFVBQVMsR0FBR2hLLGNBQWMsQ0FBQ21CLE1BQWhELENBSHlCLENBSXpCOztBQUNBaEIsVUFBQUEsZ0JBQWdCLENBQUNnQixNQUFqQixHQUEwQjZJLFVBQVMsR0FBRzlKLGtCQUFrQixDQUFDaUIsTUFBekQ7QUFDQTtBQUNIO0FBakNMO0FBbUNIOzs7RUFwY3FDZ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgQXNzZW1ibGVyMkQgZnJvbSAnLi4vLi4vYXNzZW1ibGVyLTJkJztcblxubGV0IHRleHRVdGlscyA9IHJlcXVpcmUoJy4uLy4uLy4uL3V0aWxzL3RleHQtdXRpbHMnKTtcbmNvbnN0IG1hY3JvID0gcmVxdWlyZSgnLi4vLi4vLi4vcGxhdGZvcm0vQ0NNYWNybycpO1xuY29uc3QgTGFiZWwgPSByZXF1aXJlKCcuLi8uLi8uLi9jb21wb25lbnRzL0NDTGFiZWwnKTtcbmNvbnN0IExhYmVsT3V0bGluZSA9IHJlcXVpcmUoJy4uLy4uLy4uL2NvbXBvbmVudHMvQ0NMYWJlbE91dGxpbmUnKTtcbmNvbnN0IExhYmVsU2hhZG93ID0gcmVxdWlyZSgnLi4vLi4vLi4vY29tcG9uZW50cy9DQ0xhYmVsU2hhZG93Jyk7XG5jb25zdCBPdmVyZmxvdyA9IExhYmVsLk92ZXJmbG93O1xuY29uc3QgZGVsZXRlRnJvbUR5bmFtaWNBdGxhcyA9IHJlcXVpcmUoJy4uL3V0aWxzJykuZGVsZXRlRnJvbUR5bmFtaWNBdGxhcztcbmNvbnN0IGdldEZvbnRGYW1pbHkgPSByZXF1aXJlKCcuLi91dGlscycpLmdldEZvbnRGYW1pbHk7XG5cbmNvbnN0IE1BWF9TSVpFID0gMjA0ODtcbmNvbnN0IF9pbnZpc2libGVBbHBoYSA9ICgxIC8gMjU1KS50b0ZpeGVkKDMpO1xuXG5sZXQgX2NvbnRleHQgPSBudWxsO1xubGV0IF9jYW52YXMgPSBudWxsO1xubGV0IF90ZXh0dXJlID0gbnVsbDtcblxubGV0IF9mb250RGVzYyA9ICcnO1xubGV0IF9zdHJpbmcgPSAnJztcbmxldCBfZm9udFNpemUgPSAwO1xubGV0IF9kcmF3Rm9udFNpemUgPSAwO1xubGV0IF9zcGxpdGVkU3RyaW5ncyA9IFtdO1xubGV0IF9jYW52YXNTaXplID0gY2MuU2l6ZS5aRVJPO1xubGV0IF9saW5lSGVpZ2h0ID0gMDtcbmxldCBfaEFsaWduID0gMDtcbmxldCBfdkFsaWduID0gMDtcbmxldCBfY29sb3IgPSBudWxsO1xubGV0IF9mb250RmFtaWx5ID0gJyc7XG5sZXQgX292ZXJmbG93ID0gT3ZlcmZsb3cuTk9ORTtcbmxldCBfaXNXcmFwVGV4dCA9IGZhbHNlO1xubGV0IF9wcmVtdWx0aXBseSA9IGZhbHNlO1xuXG4vLyBvdXRsaW5lXG5sZXQgX291dGxpbmVDb21wID0gbnVsbDtcbmxldCBfb3V0bGluZUNvbG9yID0gY2MuQ29sb3IuV0hJVEU7XG5cbi8vIHNoYWRvd1xubGV0IF9zaGFkb3dDb21wID0gbnVsbDtcbmxldCBfc2hhZG93Q29sb3IgPSBjYy5Db2xvci5CTEFDSztcblxubGV0IF9jYW52YXNQYWRkaW5nID0gY2MucmVjdCgpO1xubGV0IF9jb250ZW50U2l6ZUV4dGVuZCA9IGNjLlNpemUuWkVSTztcbmxldCBfbm9kZUNvbnRlbnRTaXplID0gY2MuU2l6ZS5aRVJPO1xuXG5sZXQgX2VuYWJsZUJvbGQgPSBmYWxzZTtcbmxldCBfZW5hYmxlSXRhbGljID0gZmFsc2U7XG5sZXQgX2VuYWJsZVVuZGVybGluZSA9IGZhbHNlO1xubGV0IF91bmRlcmxpbmVUaGlja25lc3MgPSAwO1xuXG5sZXQgX2RyYXdVbmRlcmxpbmVQb3MgPSBjYy5WZWMyLlpFUk87XG5sZXQgX2RyYXdVbmRlcmxpbmVXaWR0aCA9IDA7XG5cbmxldCBfc2hhcmVkTGFiZWxEYXRhO1xuXG5jb25zdCBBbGlnbm1lbnQgPSBbXG4gICAgJ2xlZnQnLCAvLyBtYWNyby5UZXh0QWxpZ25tZW50LkxFRlRcbiAgICAnY2VudGVyJywgLy8gbWFjcm8uVGV4dEFsaWdubWVudC5DRU5URVJcbiAgICAncmlnaHQnIC8vIG1hY3JvLlRleHRBbGlnbm1lbnQuUklHSFRcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRURkFzc2VtYmxlciBleHRlbmRzIEFzc2VtYmxlcjJEIHtcbiAgICBfZ2V0QXNzZW1ibGVyRGF0YSAoKSB7XG4gICAgICAgIF9zaGFyZWRMYWJlbERhdGEgPSBMYWJlbC5fY2FudmFzUG9vbC5nZXQoKTtcbiAgICAgICAgX3NoYXJlZExhYmVsRGF0YS5jYW52YXMud2lkdGggPSBfc2hhcmVkTGFiZWxEYXRhLmNhbnZhcy5oZWlnaHQgPSAxO1xuICAgICAgICByZXR1cm4gX3NoYXJlZExhYmVsRGF0YTtcbiAgICB9XG5cbiAgICBfcmVzZXRBc3NlbWJsZXJEYXRhIChhc3NlbWJsZXJEYXRhKSB7XG4gICAgICAgIGlmIChhc3NlbWJsZXJEYXRhKSB7XG4gICAgICAgICAgICBMYWJlbC5fY2FudmFzUG9vbC5wdXQoYXNzZW1ibGVyRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVSZW5kZXJEYXRhIChjb21wKSB7XG4gICAgICAgIHN1cGVyLnVwZGF0ZVJlbmRlckRhdGEoY29tcCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWNvbXAuX3ZlcnRzRGlydHkpIHJldHVybjtcblxuICAgICAgICB0aGlzLl91cGRhdGVQcm9wZXJ0aWVzKGNvbXApO1xuICAgICAgICB0aGlzLl9jYWxjdWxhdGVMYWJlbEZvbnQoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlTGFiZWxEaW1lbnNpb25zKCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVRleHR1cmUoY29tcCk7XG4gICAgICAgIHRoaXMuX2NhbER5bmFtaWNBdGxhcyhjb21wKTtcblxuICAgICAgICBjb21wLl9hY3R1YWxGb250U2l6ZSA9IF9mb250U2l6ZTtcbiAgICAgICAgY29tcC5ub2RlLnNldENvbnRlbnRTaXplKF9ub2RlQ29udGVudFNpemUpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlVmVydHMoY29tcCk7XG5cbiAgICAgICAgY29tcC5fdmVydHNEaXJ0eSA9IGZhbHNlO1xuXG4gICAgICAgIF9jb250ZXh0ID0gbnVsbDtcbiAgICAgICAgX2NhbnZhcyA9IG51bGw7XG4gICAgICAgIF90ZXh0dXJlID0gbnVsbDtcbiAgICB9XG5cbiAgICB1cGRhdGVWZXJ0cyAoKSB7XG4gICAgfVxuXG4gICAgX3VwZGF0ZVBhZGRpbmdSZWN0ICgpIHtcbiAgICAgICAgbGV0IHRvcCA9IDAsIGJvdHRvbSA9IDAsIGxlZnQgPSAwLCByaWdodCA9IDA7XG4gICAgICAgIGxldCBvdXRsaW5lV2lkdGggPSAwO1xuICAgICAgICBfY29udGVudFNpemVFeHRlbmQud2lkdGggPSBfY29udGVudFNpemVFeHRlbmQuaGVpZ2h0ID0gMDtcbiAgICAgICAgaWYgKF9vdXRsaW5lQ29tcCkge1xuICAgICAgICAgICAgb3V0bGluZVdpZHRoID0gX291dGxpbmVDb21wLndpZHRoO1xuICAgICAgICAgICAgdG9wID0gYm90dG9tID0gbGVmdCA9IHJpZ2h0ID0gb3V0bGluZVdpZHRoO1xuICAgICAgICAgICAgX2NvbnRlbnRTaXplRXh0ZW5kLndpZHRoID0gX2NvbnRlbnRTaXplRXh0ZW5kLmhlaWdodCA9IG91dGxpbmVXaWR0aCAqIDI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF9zaGFkb3dDb21wKSB7XG4gICAgICAgICAgICBsZXQgc2hhZG93V2lkdGggPSBfc2hhZG93Q29tcC5ibHVyICsgb3V0bGluZVdpZHRoO1xuICAgICAgICAgICAgbGVmdCA9IE1hdGgubWF4KGxlZnQsIC1fc2hhZG93Q29tcC5fb2Zmc2V0LnggKyBzaGFkb3dXaWR0aCk7XG4gICAgICAgICAgICByaWdodCA9IE1hdGgubWF4KHJpZ2h0LCBfc2hhZG93Q29tcC5fb2Zmc2V0LnggKyBzaGFkb3dXaWR0aCk7XG4gICAgICAgICAgICB0b3AgPSBNYXRoLm1heCh0b3AsIF9zaGFkb3dDb21wLl9vZmZzZXQueSArIHNoYWRvd1dpZHRoKTtcbiAgICAgICAgICAgIGJvdHRvbSA9IE1hdGgubWF4KGJvdHRvbSwgLV9zaGFkb3dDb21wLl9vZmZzZXQueSArIHNoYWRvd1dpZHRoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoX2VuYWJsZUl0YWxpYykge1xuICAgICAgICAgICAgLy8wLjAxNzQ1MzI5MjUgPSAzLjE0MTU5MjY1MyAvIDE4MFxuICAgICAgICAgICAgbGV0IG9mZnNldCA9IF9kcmF3Rm9udFNpemUgKiBNYXRoLnRhbigxMiAqIDAuMDE3NDUzMjkyNSk7XG4gICAgICAgICAgICByaWdodCArPSBvZmZzZXQ7XG4gICAgICAgICAgICBfY29udGVudFNpemVFeHRlbmQud2lkdGggKz0gb2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIF9jYW52YXNQYWRkaW5nLnggPSBsZWZ0O1xuICAgICAgICBfY2FudmFzUGFkZGluZy55ID0gdG9wO1xuICAgICAgICBfY2FudmFzUGFkZGluZy53aWR0aCA9IGxlZnQgKyByaWdodDtcbiAgICAgICAgX2NhbnZhc1BhZGRpbmcuaGVpZ2h0ID0gdG9wICsgYm90dG9tO1xuICAgIH1cblxuICAgIF91cGRhdGVQcm9wZXJ0aWVzIChjb21wKSB7XG4gICAgICAgIGxldCBhc3NlbWJsZXJEYXRhID0gY29tcC5fYXNzZW1ibGVyRGF0YTtcbiAgICAgICAgX2NvbnRleHQgPSBhc3NlbWJsZXJEYXRhLmNvbnRleHQ7XG4gICAgICAgIF9jYW52YXMgPSBhc3NlbWJsZXJEYXRhLmNhbnZhcztcbiAgICAgICAgX3RleHR1cmUgPSBjb21wLl9mcmFtZS5fb3JpZ2luYWwgPyBjb21wLl9mcmFtZS5fb3JpZ2luYWwuX3RleHR1cmUgOiBjb21wLl9mcmFtZS5fdGV4dHVyZTtcblxuICAgICAgICBfc3RyaW5nID0gY29tcC5zdHJpbmcudG9TdHJpbmcoKTtcbiAgICAgICAgX2ZvbnRTaXplID0gY29tcC5fZm9udFNpemU7XG4gICAgICAgIF9kcmF3Rm9udFNpemUgPSBfZm9udFNpemU7XG4gICAgICAgIF91bmRlcmxpbmVUaGlja25lc3MgPSBjb21wLnVuZGVybGluZUhlaWdodCB8fCBfZHJhd0ZvbnRTaXplIC8gODtcbiAgICAgICAgX292ZXJmbG93ID0gY29tcC5vdmVyZmxvdztcbiAgICAgICAgX2NhbnZhc1NpemUud2lkdGggPSBjb21wLm5vZGUud2lkdGg7XG4gICAgICAgIF9jYW52YXNTaXplLmhlaWdodCA9IGNvbXAubm9kZS5oZWlnaHQ7XG4gICAgICAgIF9ub2RlQ29udGVudFNpemUgPSBjb21wLm5vZGUuZ2V0Q29udGVudFNpemUoKTtcbiAgICAgICAgX2xpbmVIZWlnaHQgPSBjb21wLl9saW5lSGVpZ2h0O1xuICAgICAgICBfaEFsaWduID0gY29tcC5ob3Jpem9udGFsQWxpZ247XG4gICAgICAgIF92QWxpZ24gPSBjb21wLnZlcnRpY2FsQWxpZ247XG4gICAgICAgIF9jb2xvciA9IGNvbXAubm9kZS5jb2xvcjtcbiAgICAgICAgX2VuYWJsZUJvbGQgPSBjb21wLmVuYWJsZUJvbGQ7XG4gICAgICAgIF9lbmFibGVJdGFsaWMgPSBjb21wLmVuYWJsZUl0YWxpYztcbiAgICAgICAgX2VuYWJsZVVuZGVybGluZSA9IGNvbXAuZW5hYmxlVW5kZXJsaW5lO1xuICAgICAgICBfZm9udEZhbWlseSA9IGdldEZvbnRGYW1pbHkoY29tcCk7XG4gICAgICAgIF9wcmVtdWx0aXBseSA9IGNvbXAuc3JjQmxlbmRGYWN0b3IgPT09IGNjLm1hY3JvLkJsZW5kRmFjdG9yLk9ORTtcblxuICAgICAgICBpZiAoQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICAgICAgICAgIF9jb250ZXh0Ll9zZXRQcmVtdWx0aXBseShfcHJlbXVsdGlwbHkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF9vdmVyZmxvdyA9PT0gT3ZlcmZsb3cuTk9ORSkge1xuICAgICAgICAgICAgX2lzV3JhcFRleHQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChfb3ZlcmZsb3cgPT09IE92ZXJmbG93LlJFU0laRV9IRUlHSFQpIHtcbiAgICAgICAgICAgIF9pc1dyYXBUZXh0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIF9pc1dyYXBUZXh0ID0gY29tcC5lbmFibGVXcmFwVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG91dGxpbmVcbiAgICAgICAgX291dGxpbmVDb21wID0gTGFiZWxPdXRsaW5lICYmIGNvbXAuZ2V0Q29tcG9uZW50KExhYmVsT3V0bGluZSk7XG4gICAgICAgIF9vdXRsaW5lQ29tcCA9IChfb3V0bGluZUNvbXAgJiYgX291dGxpbmVDb21wLmVuYWJsZWQgJiYgX291dGxpbmVDb21wLndpZHRoID4gMCkgPyBfb3V0bGluZUNvbXAgOiBudWxsO1xuICAgICAgICBpZiAoX291dGxpbmVDb21wKSB7XG4gICAgICAgICAgICBfb3V0bGluZUNvbG9yLnNldChfb3V0bGluZUNvbXAuY29sb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2hhZG93XG4gICAgICAgIF9zaGFkb3dDb21wID0gTGFiZWxTaGFkb3cgJiYgY29tcC5nZXRDb21wb25lbnQoTGFiZWxTaGFkb3cpO1xuICAgICAgICBfc2hhZG93Q29tcCA9IChfc2hhZG93Q29tcCAmJiBfc2hhZG93Q29tcC5lbmFibGVkKSA/IF9zaGFkb3dDb21wIDogbnVsbDtcbiAgICAgICAgaWYgKF9zaGFkb3dDb21wKSB7XG4gICAgICAgICAgICBfc2hhZG93Q29sb3Iuc2V0KF9zaGFkb3dDb21wLmNvbG9yKTtcbiAgICAgICAgICAgIC8vIFRPRE86IHRlbXBvcmFyeSBzb2x1dGlvbiwgY2FzY2FkZSBvcGFjaXR5IGZvciBvdXRsaW5lIGNvbG9yXG4gICAgICAgICAgICBfc2hhZG93Q29sb3IuYSA9IF9zaGFkb3dDb2xvci5hICogY29tcC5ub2RlLmNvbG9yLmEgLyAyNTUuMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3VwZGF0ZVBhZGRpbmdSZWN0KCk7XG4gICAgfVxuXG4gICAgX2NhbGN1bGF0ZUZpbGxUZXh0U3RhcnRQb3NpdGlvbiAoKSB7XG4gICAgICAgIGxldCBsYWJlbFggPSAwO1xuICAgICAgICBpZiAoX2hBbGlnbiA9PT0gbWFjcm8uVGV4dEFsaWdubWVudC5SSUdIVCkge1xuICAgICAgICAgICAgbGFiZWxYID0gX2NhbnZhc1NpemUud2lkdGggLSBfY2FudmFzUGFkZGluZy53aWR0aDtcbiAgICAgICAgfSBlbHNlIGlmIChfaEFsaWduID09PSBtYWNyby5UZXh0QWxpZ25tZW50LkNFTlRFUikge1xuICAgICAgICAgICAgbGFiZWxYID0gKF9jYW52YXNTaXplLndpZHRoIC0gX2NhbnZhc1BhZGRpbmcud2lkdGgpIC8gMjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBsaW5lSGVpZ2h0ID0gdGhpcy5fZ2V0TGluZUhlaWdodCgpO1xuICAgICAgICBsZXQgZHJhd1N0YXJ0WSA9IGxpbmVIZWlnaHQgKiAoX3NwbGl0ZWRTdHJpbmdzLmxlbmd0aCAtIDEpO1xuICAgICAgICAvLyBUT1BcbiAgICAgICAgbGV0IGZpcnN0TGluZWxhYmVsWSA9IF9mb250U2l6ZSAqICgxIC0gdGV4dFV0aWxzLkJBU0VMSU5FX1JBVElPIC8gMik7XG4gICAgICAgIGlmIChfdkFsaWduICE9PSBtYWNyby5WZXJ0aWNhbFRleHRBbGlnbm1lbnQuVE9QKSB7XG4gICAgICAgICAgICAvLyBmcmVlIHNwYWNlIGluIHZlcnRpY2FsIGRpcmVjdGlvblxuICAgICAgICAgICAgbGV0IGJsYW5rID0gZHJhd1N0YXJ0WSArIF9jYW52YXNQYWRkaW5nLmhlaWdodCArIF9mb250U2l6ZSAtIF9jYW52YXNTaXplLmhlaWdodDtcbiAgICAgICAgICAgIGlmIChfdkFsaWduID09PSBtYWNyby5WZXJ0aWNhbFRleHRBbGlnbm1lbnQuQk9UVE9NKSB7XG4gICAgICAgICAgICAgICAgLy8gVW5saWtlIEJNRm9udCwgbmVlZHMgdG8gcmVzZXJ2ZSBzcGFjZSBiZWxvdy5cbiAgICAgICAgICAgICAgICBibGFuayArPSB0ZXh0VXRpbHMuQkFTRUxJTkVfUkFUSU8gLyAyICogX2ZvbnRTaXplO1xuICAgICAgICAgICAgICAgIC8vIEJPVFRPTVxuICAgICAgICAgICAgICAgIGZpcnN0TGluZWxhYmVsWSAtPSBibGFuaztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gQ0VOVEVSXG4gICAgICAgICAgICAgICAgZmlyc3RMaW5lbGFiZWxZIC09IGJsYW5rIC8gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZpcnN0TGluZWxhYmVsWSArPSB0ZXh0VXRpbHMuQkFTRUxJTkVfT0ZGU0VUICogX2ZvbnRTaXplO1xuXG4gICAgICAgIHJldHVybiBjYy52MihsYWJlbFggKyBfY2FudmFzUGFkZGluZy54LCBmaXJzdExpbmVsYWJlbFkgKyBfY2FudmFzUGFkZGluZy55KTtcbiAgICB9XG5cbiAgICBfc2V0dXBPdXRsaW5lICgpIHtcbiAgICAgICAgX2NvbnRleHQuc3Ryb2tlU3R5bGUgPSBgcmdiYSgke19vdXRsaW5lQ29sb3Iucn0sICR7X291dGxpbmVDb2xvci5nfSwgJHtfb3V0bGluZUNvbG9yLmJ9LCAke19vdXRsaW5lQ29sb3IuYSAvIDI1NX0pYDtcbiAgICAgICAgX2NvbnRleHQubGluZVdpZHRoID0gX291dGxpbmVDb21wLndpZHRoICogMjtcbiAgICB9XG5cbiAgICBfc2V0dXBTaGFkb3cgKCkge1xuICAgICAgICBfY29udGV4dC5zaGFkb3dDb2xvciA9IGByZ2JhKCR7X3NoYWRvd0NvbG9yLnJ9LCAke19zaGFkb3dDb2xvci5nfSwgJHtfc2hhZG93Q29sb3IuYn0sICR7X3NoYWRvd0NvbG9yLmEgLyAyNTV9KWA7XG4gICAgICAgIF9jb250ZXh0LnNoYWRvd0JsdXIgPSBfc2hhZG93Q29tcC5ibHVyO1xuICAgICAgICBfY29udGV4dC5zaGFkb3dPZmZzZXRYID0gX3NoYWRvd0NvbXAub2Zmc2V0Lng7XG4gICAgICAgIF9jb250ZXh0LnNoYWRvd09mZnNldFkgPSAtX3NoYWRvd0NvbXAub2Zmc2V0Lnk7XG4gICAgfVxuXG4gICAgX2RyYXdUZXh0RWZmZWN0IChzdGFydFBvc2l0aW9uLCBsaW5lSGVpZ2h0KSB7XG4gICAgICAgIGlmICghX3NoYWRvd0NvbXAgJiYgIV9vdXRsaW5lQ29tcCAmJiAhX2VuYWJsZVVuZGVybGluZSkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBpc011bHRpcGxlID0gX3NwbGl0ZWRTdHJpbmdzLmxlbmd0aCA+IDEgJiYgX3NoYWRvd0NvbXA7XG4gICAgICAgIGxldCBtZWFzdXJlVGV4dCA9IHRoaXMuX21lYXN1cmVUZXh0KF9jb250ZXh0LCBfZm9udERlc2MpO1xuICAgICAgICBsZXQgZHJhd1RleHRQb3NYID0gMCwgZHJhd1RleHRQb3NZID0gMDtcblxuICAgICAgICAvLyBvbmx5IG9uZSBzZXQgc2hhZG93IGFuZCBvdXRsaW5lXG4gICAgICAgIGlmIChfc2hhZG93Q29tcCkge1xuICAgICAgICAgICAgdGhpcy5fc2V0dXBTaGFkb3coKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKF9vdXRsaW5lQ29tcCkge1xuICAgICAgICAgICAgdGhpcy5fc2V0dXBPdXRsaW5lKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkcmF3IHNoYWRvdyBhbmQgKG91dGxpbmUgb3IgdGV4dClcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfc3BsaXRlZFN0cmluZ3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGRyYXdUZXh0UG9zWCA9IHN0YXJ0UG9zaXRpb24ueDtcbiAgICAgICAgICAgIGRyYXdUZXh0UG9zWSA9IHN0YXJ0UG9zaXRpb24ueSArIGkgKiBsaW5lSGVpZ2h0O1xuICAgICAgICAgICAgLy8gbXVsdGlwbGUgbGluZXMgbmVlZCB0byBiZSBkcmF3biBvdXRsaW5lIGFuZCBmaWxsIHRleHRcbiAgICAgICAgICAgIGlmIChpc011bHRpcGxlKSB7XG4gICAgICAgICAgICAgICAgaWYgKF9vdXRsaW5lQ29tcCkge1xuICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5zdHJva2VUZXh0KF9zcGxpdGVkU3RyaW5nc1tpXSwgZHJhd1RleHRQb3NYLCBkcmF3VGV4dFBvc1kpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfY29udGV4dC5maWxsVGV4dChfc3BsaXRlZFN0cmluZ3NbaV0sIGRyYXdUZXh0UG9zWCwgZHJhd1RleHRQb3NZKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZHJhdyB1bmRlcmxpbmVcbiAgICAgICAgICAgIGlmIChfZW5hYmxlVW5kZXJsaW5lKSB7XG4gICAgICAgICAgICAgICAgX2RyYXdVbmRlcmxpbmVXaWR0aCA9IG1lYXN1cmVUZXh0KF9zcGxpdGVkU3RyaW5nc1tpXSk7XG4gICAgICAgICAgICAgICAgaWYgKF9oQWxpZ24gPT09IG1hY3JvLlRleHRBbGlnbm1lbnQuUklHSFQpIHtcbiAgICAgICAgICAgICAgICAgICAgX2RyYXdVbmRlcmxpbmVQb3MueCA9IHN0YXJ0UG9zaXRpb24ueCAtIF9kcmF3VW5kZXJsaW5lV2lkdGg7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChfaEFsaWduID09PSBtYWNyby5UZXh0QWxpZ25tZW50LkNFTlRFUikge1xuICAgICAgICAgICAgICAgICAgICBfZHJhd1VuZGVybGluZVBvcy54ID0gc3RhcnRQb3NpdGlvbi54IC0gKF9kcmF3VW5kZXJsaW5lV2lkdGggLyAyKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfZHJhd1VuZGVybGluZVBvcy54ID0gc3RhcnRQb3NpdGlvbi54O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfZHJhd1VuZGVybGluZVBvcy55ID0gZHJhd1RleHRQb3NZICsgX2RyYXdGb250U2l6ZSAvIDg7XG4gICAgICAgICAgICAgICAgX2NvbnRleHQuZmlsbFJlY3QoX2RyYXdVbmRlcmxpbmVQb3MueCwgX2RyYXdVbmRlcmxpbmVQb3MueSwgX2RyYXdVbmRlcmxpbmVXaWR0aCwgX3VuZGVybGluZVRoaWNrbmVzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNNdWx0aXBsZSkge1xuICAgICAgICAgICAgX2NvbnRleHQuc2hhZG93Q29sb3IgPSAndHJhbnNwYXJlbnQnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3VwZGF0ZVRleHR1cmUgKCkge1xuICAgICAgICBfY29udGV4dC5jbGVhclJlY3QoMCwgMCwgX2NhbnZhcy53aWR0aCwgX2NhbnZhcy5oZWlnaHQpO1xuICAgICAgICAvLyB1c2Ugcm91bmQgZm9yIGxpbmUgam9pbiB0byBhdm9pZCBzaGFycCBpbnRlcnNlY3QgcG9pbnRcbiAgICAgICAgX2NvbnRleHQubGluZUpvaW4gPSAncm91bmQnO1xuICAgICAgICAvL0FkZCBhIHdoaXRlIGJhY2tncm91bmQgdG8gYXZvaWQgYmxhY2sgZWRnZXMuXG4gICAgICAgIGlmICghX3ByZW11bHRpcGx5KSB7XG4gICAgICAgICAgICAvL1RPRE86IGl0IGlzIGJlc3QgdG8gYWRkIGFscGhhVGVzdCB0byBmaWx0ZXIgb3V0IHRoZSBiYWNrZ3JvdW5kIGNvbG9yLlxuICAgICAgICAgICAgbGV0IF9maWxsQ29sb3IgPSBfb3V0bGluZUNvbXAgPyBfb3V0bGluZUNvbG9yIDogX2NvbG9yO1xuICAgICAgICAgICAgX2NvbnRleHQuZmlsbFN0eWxlID0gYHJnYmEoJHtfZmlsbENvbG9yLnJ9LCAke19maWxsQ29sb3IuZ30sICR7X2ZpbGxDb2xvci5ifSwgJHtfaW52aXNpYmxlQWxwaGF9KWA7XG4gICAgICAgICAgICBfY29udGV4dC5maWxsUmVjdCgwLCAwLCBfY2FudmFzLndpZHRoLCBfY2FudmFzLmhlaWdodCk7XG4gICAgICAgICAgICBfY29udGV4dC5maWxsU3R5bGUgPSBgcmdiYSgke19jb2xvci5yfSwgJHtfY29sb3IuZ30sICR7X2NvbG9yLmJ9LCAxKWA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfY29udGV4dC5maWxsU3R5bGUgPSBgcmdiYSgke19jb2xvci5yfSwgJHtfY29sb3IuZ30sICR7X2NvbG9yLmJ9LCAke19jb2xvci5hIC8gMjU1LjB9KWA7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc3RhcnRQb3NpdGlvbiA9IHRoaXMuX2NhbGN1bGF0ZUZpbGxUZXh0U3RhcnRQb3NpdGlvbigpO1xuICAgICAgICBsZXQgbGluZUhlaWdodCA9IHRoaXMuX2dldExpbmVIZWlnaHQoKTtcbiAgICAgICAgbGV0IGRyYXdUZXh0UG9zWCA9IHN0YXJ0UG9zaXRpb24ueCwgZHJhd1RleHRQb3NZID0gMDtcbiAgICAgICAgLy8gZHJhdyBzaGFkb3cgYW5kIHVuZGVybGluZVxuICAgICAgICB0aGlzLl9kcmF3VGV4dEVmZmVjdChzdGFydFBvc2l0aW9uLCBsaW5lSGVpZ2h0KTtcbiAgICAgICAgLy8gZHJhdyB0ZXh0IGFuZCBvdXRsaW5lXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgX3NwbGl0ZWRTdHJpbmdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBkcmF3VGV4dFBvc1kgPSBzdGFydFBvc2l0aW9uLnkgKyBpICogbGluZUhlaWdodDtcbiAgICAgICAgICAgIGlmIChfb3V0bGluZUNvbXApIHtcbiAgICAgICAgICAgICAgICBfY29udGV4dC5zdHJva2VUZXh0KF9zcGxpdGVkU3RyaW5nc1tpXSwgZHJhd1RleHRQb3NYLCBkcmF3VGV4dFBvc1kpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX2NvbnRleHQuZmlsbFRleHQoX3NwbGl0ZWRTdHJpbmdzW2ldLCBkcmF3VGV4dFBvc1gsIGRyYXdUZXh0UG9zWSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3NoYWRvd0NvbXApIHtcbiAgICAgICAgICAgIF9jb250ZXh0LnNoYWRvd0NvbG9yID0gJ3RyYW5zcGFyZW50JztcbiAgICAgICAgfVxuXG4gICAgICAgIF90ZXh0dXJlLmhhbmRsZUxvYWRlZFRleHR1cmUoKTtcbiAgICB9XG5cbiAgICBfY2FsRHluYW1pY0F0bGFzIChjb21wKSB7XG4gICAgICAgIGlmKGNvbXAuY2FjaGVNb2RlICE9PSBMYWJlbC5DYWNoZU1vZGUuQklUTUFQKSByZXR1cm47XG4gICAgICAgIGxldCBmcmFtZSA9IGNvbXAuX2ZyYW1lO1xuICAgICAgICAvLyBEZWxldGUgY2FjaGUgaW4gYXRsYXMuXG4gICAgICAgIGRlbGV0ZUZyb21EeW5hbWljQXRsYXMoY29tcCwgZnJhbWUpO1xuICAgICAgICBpZiAoIWZyYW1lLl9vcmlnaW5hbCkge1xuICAgICAgICAgICAgZnJhbWUuc2V0UmVjdChjYy5yZWN0KDAsIDAsIF9jYW52YXMud2lkdGgsIF9jYW52YXMuaGVpZ2h0KSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYWNrVG9EeW5hbWljQXRsYXMoY29tcCwgZnJhbWUpO1xuICAgIH1cblxuICAgIF91cGRhdGVMYWJlbERpbWVuc2lvbnMgKCkge1xuICAgICAgICBfY2FudmFzU2l6ZS53aWR0aCA9IE1hdGgubWluKF9jYW52YXNTaXplLndpZHRoLCBNQVhfU0laRSk7XG4gICAgICAgIF9jYW52YXNTaXplLmhlaWdodCA9IE1hdGgubWluKF9jYW52YXNTaXplLmhlaWdodCwgTUFYX1NJWkUpO1xuXG4gICAgICAgIGxldCByZWNyZWF0ZSA9IGZhbHNlO1xuICAgICAgICBpZiAoX2NhbnZhcy53aWR0aCAhPT0gX2NhbnZhc1NpemUud2lkdGgpIHtcbiAgICAgICAgICAgIF9jYW52YXMud2lkdGggPSBfY2FudmFzU2l6ZS53aWR0aDtcbiAgICAgICAgICAgIHJlY3JlYXRlID0gdHJ1ZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF9jYW52YXMuaGVpZ2h0ICE9PSBfY2FudmFzU2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICAgIF9jYW52YXMuaGVpZ2h0ID0gX2NhbnZhc1NpemUuaGVpZ2h0O1xuICAgICAgICAgICAgcmVjcmVhdGUgPSB0cnVlXG4gICAgICAgIH1cblxuICAgICAgICByZWNyZWF0ZSAmJiAoX2NvbnRleHQuZm9udCA9IF9mb250RGVzYyk7XG4gICAgICAgIC8vIGFsaWduXG4gICAgICAgIF9jb250ZXh0LnRleHRBbGlnbiA9IEFsaWdubWVudFtfaEFsaWduXTtcbiAgICB9XG5cbiAgICBfZ2V0Rm9udERlc2MgKCkge1xuICAgICAgICBsZXQgZm9udERlc2MgPSBfZm9udFNpemUudG9TdHJpbmcoKSArICdweCAnO1xuICAgICAgICBmb250RGVzYyA9IGZvbnREZXNjICsgX2ZvbnRGYW1pbHk7XG4gICAgICAgIGlmIChfZW5hYmxlQm9sZCkge1xuICAgICAgICAgICAgZm9udERlc2MgPSBcImJvbGQgXCIgKyBmb250RGVzYztcbiAgICAgICAgfVxuICAgICAgICBpZiAoX2VuYWJsZUl0YWxpYykge1xuICAgICAgICAgICAgZm9udERlc2MgPSBcIml0YWxpYyBcIiArIGZvbnREZXNjO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmb250RGVzYztcbiAgICB9XG5cbiAgICBfZ2V0TGluZUhlaWdodCAoKSB7XG4gICAgICAgIGxldCBub2RlU3BhY2luZ1kgPSBfbGluZUhlaWdodDtcbiAgICAgICAgaWYgKG5vZGVTcGFjaW5nWSA9PT0gMCkge1xuICAgICAgICAgICAgbm9kZVNwYWNpbmdZID0gX2ZvbnRTaXplO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZVNwYWNpbmdZID0gbm9kZVNwYWNpbmdZICogX2ZvbnRTaXplIC8gX2RyYXdGb250U2l6ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlU3BhY2luZ1kgfCAwO1xuICAgIH1cblxuICAgIF9jYWxjdWxhdGVQYXJhZ3JhcGhMZW5ndGggKHBhcmFncmFwaGVkU3RyaW5ncywgY3R4KSB7XG4gICAgICAgIGxldCBwYXJhZ3JhcGhMZW5ndGggPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcmFncmFwaGVkU3RyaW5ncy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgbGV0IHdpZHRoID0gdGV4dFV0aWxzLnNhZmVNZWFzdXJlVGV4dChjdHgsIHBhcmFncmFwaGVkU3RyaW5nc1tpXSwgX2ZvbnREZXNjKTtcbiAgICAgICAgICAgIHBhcmFncmFwaExlbmd0aC5wdXNoKHdpZHRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYXJhZ3JhcGhMZW5ndGg7XG4gICAgfVxuXG4gICAgX21lYXN1cmVUZXh0IChjdHgsIGZvbnREZXNjKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGV4dFV0aWxzLnNhZmVNZWFzdXJlVGV4dChjdHgsIHN0cmluZywgZm9udERlc2MpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIF9jYWxjdWxhdGVTaHJpbmtGb250IChwYXJhZ3JhcGhlZFN0cmluZ3MpIHtcbiAgICAgICAgbGV0IHBhcmFncmFwaExlbmd0aCA9IHRoaXMuX2NhbGN1bGF0ZVBhcmFncmFwaExlbmd0aChwYXJhZ3JhcGhlZFN0cmluZ3MsIF9jb250ZXh0KTtcbiAgICAgICAgXG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgbGV0IHRvdGFsSGVpZ2h0ID0gMDtcbiAgICAgICAgbGV0IG1heExlbmd0aCA9IDA7XG5cbiAgICAgICAgaWYgKF9pc1dyYXBUZXh0KSB7XG4gICAgICAgICAgICBsZXQgY2FudmFzV2lkdGhOb01hcmdpbiA9IF9ub2RlQ29udGVudFNpemUud2lkdGg7XG4gICAgICAgICAgICBsZXQgY2FudmFzSGVpZ2h0Tm9NYXJnaW4gPSBfbm9kZUNvbnRlbnRTaXplLmhlaWdodDtcbiAgICAgICAgICAgIGlmIChjYW52YXNXaWR0aE5vTWFyZ2luIDwgMCB8fCBjYW52YXNIZWlnaHROb01hcmdpbiA8IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b3RhbEhlaWdodCA9IGNhbnZhc0hlaWdodE5vTWFyZ2luICsgMTtcbiAgICAgICAgICAgIGxldCBhY3R1YWxGb250U2l6ZSA9IF9mb250U2l6ZSArIDE7XG4gICAgICAgICAgICBsZXQgdGV4dEZyYWdtZW50ID0gXCJcIjtcbiAgICAgICAgICAgIC8vbGV0IHN0YXJ0U2hyaW5rRm9udFNpemUgPSBhY3R1YWxGb250U2l6ZSB8IDA7XG4gICAgICAgICAgICBsZXQgbGVmdCA9IDAsIHJpZ2h0ID0gYWN0dWFsRm9udFNpemUgfCAwLCBtaWQgPSAwO1xuXG4gICAgICAgICAgICB3aGlsZSAobGVmdCA8IHJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgbWlkID0gKGxlZnQgKyByaWdodCArIDEpID4+IDE7XG5cbiAgICAgICAgICAgICAgICBpZiAobWlkIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY2MubG9nSUQoNDAwMyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIF9mb250U2l6ZSA9IG1pZDtcbiAgICAgICAgICAgICAgICBfZm9udERlc2MgPSB0aGlzLl9nZXRGb250RGVzYygpO1xuICAgICAgICAgICAgICAgIF9jb250ZXh0LmZvbnQgPSBfZm9udERlc2M7XG4gICAgICAgICAgICAgICAgbGV0IGxpbmVIZWlnaHQgPSB0aGlzLl9nZXRMaW5lSGVpZ2h0KCk7XG5cbiAgICAgICAgICAgICAgICB0b3RhbEhlaWdodCA9IDA7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHBhcmFncmFwaGVkU3RyaW5ncy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYWxsV2lkdGggPSB0ZXh0VXRpbHMuc2FmZU1lYXN1cmVUZXh0KF9jb250ZXh0LCBwYXJhZ3JhcGhlZFN0cmluZ3NbaV0sIF9mb250RGVzYyk7XG4gICAgICAgICAgICAgICAgICAgIHRleHRGcmFnbWVudCA9IHRleHRVdGlscy5mcmFnbWVudFRleHQocGFyYWdyYXBoZWRTdHJpbmdzW2ldLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FudmFzV2lkdGhOb01hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWVhc3VyZVRleHQoX2NvbnRleHQsIF9mb250RGVzYykpO1xuICAgICAgICAgICAgICAgICAgICB0b3RhbEhlaWdodCArPSB0ZXh0RnJhZ21lbnQubGVuZ3RoICogbGluZUhlaWdodDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodG90YWxIZWlnaHQgPiBjYW52YXNIZWlnaHROb01hcmdpbikge1xuICAgICAgICAgICAgICAgICAgICByaWdodCA9IG1pZCAtIDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdCA9IG1pZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChsZWZ0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY2MubG9nSUQoNDAwMyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF9mb250U2l6ZSA9IGxlZnQ7XG4gICAgICAgICAgICAgICAgX2ZvbnREZXNjID0gdGhpcy5fZ2V0Rm9udERlc2MoKTtcbiAgICAgICAgICAgICAgICBfY29udGV4dC5mb250ID0gX2ZvbnREZXNjO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG90YWxIZWlnaHQgPSBwYXJhZ3JhcGhlZFN0cmluZ3MubGVuZ3RoICogdGhpcy5fZ2V0TGluZUhlaWdodCgpO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcGFyYWdyYXBoZWRTdHJpbmdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1heExlbmd0aCA8IHBhcmFncmFwaExlbmd0aFtpXSkge1xuICAgICAgICAgICAgICAgICAgICBtYXhMZW5ndGggPSBwYXJhZ3JhcGhMZW5ndGhbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHNjYWxlWCA9IChfY2FudmFzU2l6ZS53aWR0aCAtIF9jYW52YXNQYWRkaW5nLndpZHRoKSAvIG1heExlbmd0aDtcbiAgICAgICAgICAgIGxldCBzY2FsZVkgPSBfY2FudmFzU2l6ZS5oZWlnaHQgLyB0b3RhbEhlaWdodDtcblxuICAgICAgICAgICAgX2ZvbnRTaXplID0gKF9kcmF3Rm9udFNpemUgKiBNYXRoLm1pbigxLCBzY2FsZVgsIHNjYWxlWSkpIHwgMDtcbiAgICAgICAgICAgIF9mb250RGVzYyA9IHRoaXMuX2dldEZvbnREZXNjKCk7XG4gICAgICAgICAgICBfY29udGV4dC5mb250ID0gX2ZvbnREZXNjO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2NhbGN1bGF0ZVdyYXBUZXh0IChwYXJhZ3JhcGhlZFN0cmluZ3MpIHtcbiAgICAgICAgaWYgKCFfaXNXcmFwVGV4dCkgcmV0dXJuO1xuXG4gICAgICAgIF9zcGxpdGVkU3RyaW5ncyA9IFtdO1xuICAgICAgICBsZXQgY2FudmFzV2lkdGhOb01hcmdpbiA9IF9ub2RlQ29udGVudFNpemUud2lkdGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyYWdyYXBoZWRTdHJpbmdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBsZXQgYWxsV2lkdGggPSB0ZXh0VXRpbHMuc2FmZU1lYXN1cmVUZXh0KF9jb250ZXh0LCBwYXJhZ3JhcGhlZFN0cmluZ3NbaV0sIF9mb250RGVzYyk7XG4gICAgICAgICAgICBsZXQgdGV4dEZyYWdtZW50ID0gdGV4dFV0aWxzLmZyYWdtZW50VGV4dChwYXJhZ3JhcGhlZFN0cmluZ3NbaV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FudmFzV2lkdGhOb01hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tZWFzdXJlVGV4dChfY29udGV4dCwgX2ZvbnREZXNjKSk7XG4gICAgICAgICAgICBfc3BsaXRlZFN0cmluZ3MgPSBfc3BsaXRlZFN0cmluZ3MuY29uY2F0KHRleHRGcmFnbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfY2FsY3VsYXRlTGFiZWxGb250ICgpIHtcbiAgICAgICAgbGV0IHBhcmFncmFwaGVkU3RyaW5ncyA9IF9zdHJpbmcuc3BsaXQoJ1xcbicpO1xuXG4gICAgICAgIF9zcGxpdGVkU3RyaW5ncyA9IHBhcmFncmFwaGVkU3RyaW5ncztcbiAgICAgICAgX2ZvbnREZXNjID0gdGhpcy5fZ2V0Rm9udERlc2MoKTtcbiAgICAgICAgX2NvbnRleHQuZm9udCA9IF9mb250RGVzYztcblxuICAgICAgICBzd2l0Y2ggKF9vdmVyZmxvdykge1xuICAgICAgICAgICAgY2FzZSBPdmVyZmxvdy5OT05FOiB7XG4gICAgICAgICAgICAgICAgbGV0IGNhbnZhc1NpemVYID0gMDtcbiAgICAgICAgICAgICAgICBsZXQgY2FudmFzU2l6ZVkgPSAwO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyYWdyYXBoZWRTdHJpbmdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXJhTGVuZ3RoID0gdGV4dFV0aWxzLnNhZmVNZWFzdXJlVGV4dChfY29udGV4dCwgcGFyYWdyYXBoZWRTdHJpbmdzW2ldLCBfZm9udERlc2MpO1xuICAgICAgICAgICAgICAgICAgICBjYW52YXNTaXplWCA9IGNhbnZhc1NpemVYID4gcGFyYUxlbmd0aCA/IGNhbnZhc1NpemVYIDogcGFyYUxlbmd0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FudmFzU2l6ZVkgPSAoX3NwbGl0ZWRTdHJpbmdzLmxlbmd0aCArIHRleHRVdGlscy5CQVNFTElORV9SQVRJTykgKiB0aGlzLl9nZXRMaW5lSGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgbGV0IHJhd1dpZHRoID0gcGFyc2VGbG9hdChjYW52YXNTaXplWC50b0ZpeGVkKDIpKTtcbiAgICAgICAgICAgICAgICBsZXQgcmF3SGVpZ2h0ID0gcGFyc2VGbG9hdChjYW52YXNTaXplWS50b0ZpeGVkKDIpKTtcbiAgICAgICAgICAgICAgICBfY2FudmFzU2l6ZS53aWR0aCA9IHJhd1dpZHRoICsgX2NhbnZhc1BhZGRpbmcud2lkdGg7XG4gICAgICAgICAgICAgICAgX2NhbnZhc1NpemUuaGVpZ2h0ID0gcmF3SGVpZ2h0ICsgX2NhbnZhc1BhZGRpbmcuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIF9ub2RlQ29udGVudFNpemUud2lkdGggPSByYXdXaWR0aCArIF9jb250ZW50U2l6ZUV4dGVuZC53aWR0aDtcbiAgICAgICAgICAgICAgICBfbm9kZUNvbnRlbnRTaXplLmhlaWdodCA9IHJhd0hlaWdodCArIF9jb250ZW50U2l6ZUV4dGVuZC5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIE92ZXJmbG93LlNIUklOSzoge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVNocmlua0ZvbnQocGFyYWdyYXBoZWRTdHJpbmdzKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVXcmFwVGV4dChwYXJhZ3JhcGhlZFN0cmluZ3MpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBPdmVyZmxvdy5DTEFNUDoge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVdyYXBUZXh0KHBhcmFncmFwaGVkU3RyaW5ncyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIE92ZXJmbG93LlJFU0laRV9IRUlHSFQ6IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVXcmFwVGV4dChwYXJhZ3JhcGhlZFN0cmluZ3MpO1xuICAgICAgICAgICAgICAgIGxldCByYXdIZWlnaHQgPSAoX3NwbGl0ZWRTdHJpbmdzLmxlbmd0aCArIHRleHRVdGlscy5CQVNFTElORV9SQVRJTykgKiB0aGlzLl9nZXRMaW5lSGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgX2NhbnZhc1NpemUuaGVpZ2h0ID0gcmF3SGVpZ2h0ICsgX2NhbnZhc1BhZGRpbmcuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIC8vIHNldCBub2RlIGhlaWdodFxuICAgICAgICAgICAgICAgIF9ub2RlQ29udGVudFNpemUuaGVpZ2h0ID0gcmF3SGVpZ2h0ICsgX2NvbnRlbnRTaXplRXh0ZW5kLmhlaWdodDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuIl0sInNvdXJjZVJvb3QiOiIvIn0=