
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/utils/label/bmfont.js';
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

var Overflow = Label.Overflow;

var shareLabelInfo = require('../utils').shareLabelInfo;

var LetterInfo = function LetterInfo() {
  this["char"] = '';
  this.valid = true;
  this.x = 0;
  this.y = 0;
  this.line = 0;
  this.hash = "";
};

var _tmpRect = cc.rect();

var _comp = null;
var _horizontalKernings = [];
var _lettersInfo = [];
var _linesWidth = [];
var _linesOffsetX = [];
var _fntConfig = null;
var _numberOfLines = 0;
var _textDesiredHeight = 0;
var _letterOffsetY = 0;
var _tailoredTopY = 0;
var _tailoredBottomY = 0;
var _bmfontScale = 1.0;
var _lineBreakWithoutSpaces = false;
var _spriteFrame = null;
var _lineSpacing = 0;

var _contentSize = cc.size();

var _string = '';
var _fontSize = 0;
var _originFontSize = 0;
var _hAlign = 0;
var _vAlign = 0;
var _spacingX = 0;
var _lineHeight = 0;
var _overflow = 0;
var _isWrapText = false;
var _labelWidth = 0;
var _labelHeight = 0;
var _maxLineWidth = 0;

var BmfontAssembler = /*#__PURE__*/function (_Assembler2D) {
  _inheritsLoose(BmfontAssembler, _Assembler2D);

  function BmfontAssembler() {
    return _Assembler2D.apply(this, arguments) || this;
  }

  var _proto = BmfontAssembler.prototype;

  _proto.updateRenderData = function updateRenderData(comp) {
    if (!comp._vertsDirty) return;
    if (_comp === comp) return;
    _comp = comp;

    this._reserveQuads(comp, comp.string.toString().length);

    this._updateFontFamily(comp);

    this._updateProperties(comp);

    this._updateLabelInfo(comp);

    this._updateContent();

    this.updateWorldVerts(comp);
    _comp._actualFontSize = _fontSize;

    _comp.node.setContentSize(_contentSize);

    _comp._vertsDirty = false;
    _comp = null;

    this._resetProperties();
  };

  _proto._updateFontScale = function _updateFontScale() {
    _bmfontScale = _fontSize / _originFontSize;
  };

  _proto._updateFontFamily = function _updateFontFamily(comp) {
    var fontAsset = comp.font;
    _spriteFrame = fontAsset.spriteFrame;
    _fntConfig = fontAsset._fntConfig;
    shareLabelInfo.fontAtlas = fontAsset._fontDefDictionary;
    this.packToDynamicAtlas(comp, _spriteFrame);
  };

  _proto._updateLabelInfo = function _updateLabelInfo() {
    // clear
    shareLabelInfo.hash = "";
    shareLabelInfo.margin = 0;
  };

  _proto._updateProperties = function _updateProperties(comp) {
    _string = comp.string.toString();
    _fontSize = comp.fontSize;
    _originFontSize = _fntConfig ? _fntConfig.fontSize : comp.fontSize;
    _hAlign = comp.horizontalAlign;
    _vAlign = comp.verticalAlign;
    _spacingX = comp.spacingX;
    _overflow = comp.overflow;
    _lineHeight = comp._lineHeight;
    _contentSize.width = comp.node.width;
    _contentSize.height = comp.node.height; // should wrap text

    if (_overflow === Overflow.NONE) {
      _isWrapText = false;
      _contentSize.width += shareLabelInfo.margin * 2;
      _contentSize.height += shareLabelInfo.margin * 2;
    } else if (_overflow === Overflow.RESIZE_HEIGHT) {
      _isWrapText = true;
      _contentSize.height += shareLabelInfo.margin * 2;
    } else {
      _isWrapText = comp.enableWrapText;
    }

    shareLabelInfo.lineHeight = _lineHeight;
    shareLabelInfo.fontSize = _fontSize;

    this._setupBMFontOverflowMetrics();
  };

  _proto._resetProperties = function _resetProperties() {
    _fntConfig = null;
    _spriteFrame = null;
    shareLabelInfo.hash = "";
    shareLabelInfo.margin = 0;
  };

  _proto._updateContent = function _updateContent() {
    this._updateFontScale();

    this._computeHorizontalKerningForText();

    this._alignText();
  };

  _proto._computeHorizontalKerningForText = function _computeHorizontalKerningForText() {
    var string = _string;
    var stringLen = string.length;
    var horizontalKernings = _horizontalKernings;
    var kerningDict;
    _fntConfig && (kerningDict = _fntConfig.kerningDict);

    if (kerningDict && !cc.js.isEmptyObject(kerningDict)) {
      var prev = -1;

      for (var i = 0; i < stringLen; ++i) {
        var key = string.charCodeAt(i);
        var kerningAmount = kerningDict[prev << 16 | key & 0xffff] || 0;

        if (i < stringLen - 1) {
          horizontalKernings[i] = kerningAmount;
        } else {
          horizontalKernings[i] = 0;
        }

        prev = key;
      }
    } else {
      horizontalKernings.length = 0;
    }
  };

  _proto._multilineTextWrap = function _multilineTextWrap(nextTokenFunc) {
    var textLen = _string.length;
    var lineIndex = 0;
    var nextTokenX = 0;
    var nextTokenY = 0;
    var longestLine = 0;
    var letterRight = 0;
    var highestY = 0;
    var lowestY = 0;
    var letterDef = null;
    var letterPosition = cc.v2(0, 0);

    for (var index = 0; index < textLen;) {
      var character = _string.charAt(index);

      if (character === "\n") {
        _linesWidth.push(letterRight);

        letterRight = 0;
        lineIndex++;
        nextTokenX = 0;
        nextTokenY -= _lineHeight * this._getFontScale() + _lineSpacing;

        this._recordPlaceholderInfo(index, character);

        index++;
        continue;
      }

      var tokenLen = nextTokenFunc(_string, index, textLen);
      var tokenHighestY = highestY;
      var tokenLowestY = lowestY;
      var tokenRight = letterRight;
      var nextLetterX = nextTokenX;
      var newLine = false;

      for (var tmp = 0; tmp < tokenLen; ++tmp) {
        var letterIndex = index + tmp;
        character = _string.charAt(letterIndex);

        if (character === "\r") {
          this._recordPlaceholderInfo(letterIndex, character);

          continue;
        }

        letterDef = shareLabelInfo.fontAtlas.getLetterDefinitionForChar(character, shareLabelInfo);

        if (!letterDef) {
          this._recordPlaceholderInfo(letterIndex, character);

          var atlasName = "";
          _fntConfig && (atlasName = _fntConfig.atlasName);
          console.log("Can't find letter definition in texture atlas " + atlasName + " for letter:" + character);
          continue;
        }

        var letterX = nextLetterX + letterDef.offsetX * _bmfontScale - shareLabelInfo.margin;

        if (_isWrapText && _maxLineWidth > 0 && nextTokenX > 0 && letterX + letterDef.w * _bmfontScale > _maxLineWidth && !textUtils.isUnicodeSpace(character)) {
          _linesWidth.push(letterRight);

          letterRight = 0;
          lineIndex++;
          nextTokenX = 0;
          nextTokenY -= _lineHeight * this._getFontScale() + _lineSpacing;
          newLine = true;
          break;
        } else {
          letterPosition.x = letterX;
        }

        letterPosition.y = nextTokenY - letterDef.offsetY * _bmfontScale + shareLabelInfo.margin;

        this._recordLetterInfo(letterPosition, character, letterIndex, lineIndex);

        if (letterIndex + 1 < _horizontalKernings.length && letterIndex < textLen - 1) {
          nextLetterX += _horizontalKernings[letterIndex + 1];
        }

        nextLetterX += letterDef.xAdvance * _bmfontScale + _spacingX - shareLabelInfo.margin * 2;
        tokenRight = letterPosition.x + letterDef.w * _bmfontScale - shareLabelInfo.margin;

        if (tokenHighestY < letterPosition.y) {
          tokenHighestY = letterPosition.y;
        }

        if (tokenLowestY > letterPosition.y - letterDef.h * _bmfontScale) {
          tokenLowestY = letterPosition.y - letterDef.h * _bmfontScale;
        }
      } //end of for loop


      if (newLine) continue;
      nextTokenX = nextLetterX;
      letterRight = tokenRight;

      if (highestY < tokenHighestY) {
        highestY = tokenHighestY;
      }

      if (lowestY > tokenLowestY) {
        lowestY = tokenLowestY;
      }

      if (longestLine < letterRight) {
        longestLine = letterRight;
      }

      index += tokenLen;
    } //end of for loop


    _linesWidth.push(letterRight);

    _numberOfLines = lineIndex + 1;
    _textDesiredHeight = _numberOfLines * _lineHeight * this._getFontScale();

    if (_numberOfLines > 1) {
      _textDesiredHeight += (_numberOfLines - 1) * _lineSpacing;
    }

    _contentSize.width = _labelWidth;
    _contentSize.height = _labelHeight;

    if (_labelWidth <= 0) {
      _contentSize.width = parseFloat(longestLine.toFixed(2)) + shareLabelInfo.margin * 2;
    }

    if (_labelHeight <= 0) {
      _contentSize.height = parseFloat(_textDesiredHeight.toFixed(2)) + shareLabelInfo.margin * 2;
    }

    _tailoredTopY = _contentSize.height;
    _tailoredBottomY = 0;

    if (_overflow !== Overflow.CLAMP) {
      if (highestY > 0) {
        _tailoredTopY = _contentSize.height + highestY;
      }

      if (lowestY < -_textDesiredHeight) {
        _tailoredBottomY = _textDesiredHeight + lowestY;
      }
    }

    return true;
  };

  _proto._getFirstCharLen = function _getFirstCharLen() {
    return 1;
  };

  _proto._getFontScale = function _getFontScale() {
    return _overflow === Overflow.SHRINK ? _bmfontScale : 1;
  };

  _proto._getFirstWordLen = function _getFirstWordLen(text, startIndex, textLen) {
    var character = text.charAt(startIndex);

    if (textUtils.isUnicodeCJK(character) || character === "\n" || textUtils.isUnicodeSpace(character)) {
      return 1;
    }

    var len = 1;
    var letterDef = shareLabelInfo.fontAtlas.getLetterDefinitionForChar(character, shareLabelInfo);

    if (!letterDef) {
      return len;
    }

    var nextLetterX = letterDef.xAdvance * _bmfontScale + _spacingX;
    var letterX;

    for (var index = startIndex + 1; index < textLen; ++index) {
      character = text.charAt(index);
      letterDef = shareLabelInfo.fontAtlas.getLetterDefinitionForChar(character, shareLabelInfo);

      if (!letterDef) {
        break;
      }

      letterX = nextLetterX + letterDef.offsetX * _bmfontScale;

      if (letterX + letterDef.w * _bmfontScale > _maxLineWidth && !textUtils.isUnicodeSpace(character) && _maxLineWidth > 0) {
        return len;
      }

      nextLetterX += letterDef.xAdvance * _bmfontScale + _spacingX;

      if (character === "\n" || textUtils.isUnicodeSpace(character) || textUtils.isUnicodeCJK(character)) {
        break;
      }

      len++;
    }

    return len;
  };

  _proto._multilineTextWrapByWord = function _multilineTextWrapByWord() {
    return this._multilineTextWrap(this._getFirstWordLen);
  };

  _proto._multilineTextWrapByChar = function _multilineTextWrapByChar() {
    return this._multilineTextWrap(this._getFirstCharLen);
  };

  _proto._recordPlaceholderInfo = function _recordPlaceholderInfo(letterIndex, _char) {
    if (letterIndex >= _lettersInfo.length) {
      var tmpInfo = new LetterInfo();

      _lettersInfo.push(tmpInfo);
    }

    _lettersInfo[letterIndex]["char"] = _char;
    _lettersInfo[letterIndex].hash = _char.charCodeAt(0) + shareLabelInfo.hash;
    _lettersInfo[letterIndex].valid = false;
  };

  _proto._recordLetterInfo = function _recordLetterInfo(letterPosition, character, letterIndex, lineIndex) {
    if (letterIndex >= _lettersInfo.length) {
      var tmpInfo = new LetterInfo();

      _lettersInfo.push(tmpInfo);
    }

    var _char2 = character.charCodeAt(0);

    var key = _char2 + shareLabelInfo.hash;
    _lettersInfo[letterIndex].line = lineIndex;
    _lettersInfo[letterIndex]["char"] = character;
    _lettersInfo[letterIndex].hash = key;
    _lettersInfo[letterIndex].valid = shareLabelInfo.fontAtlas.getLetter(key).valid;
    _lettersInfo[letterIndex].x = letterPosition.x;
    _lettersInfo[letterIndex].y = letterPosition.y;
  };

  _proto._alignText = function _alignText() {
    _textDesiredHeight = 0;
    _linesWidth.length = 0;

    if (!_lineBreakWithoutSpaces) {
      this._multilineTextWrapByWord();
    } else {
      this._multilineTextWrapByChar();
    }

    this._computeAlignmentOffset(); //shrink


    if (_overflow === Overflow.SHRINK) {
      if (_fontSize > 0 && this._isVerticalClamp()) {
        this._shrinkLabelToContentSize(this._isVerticalClamp);
      }
    }

    if (!this._updateQuads()) {
      if (_overflow === Overflow.SHRINK) {
        this._shrinkLabelToContentSize(this._isHorizontalClamp);
      }
    }
  };

  _proto._scaleFontSizeDown = function _scaleFontSizeDown(fontSize) {
    var shouldUpdateContent = true;

    if (!fontSize) {
      fontSize = 0.1;
      shouldUpdateContent = false;
    }

    _fontSize = fontSize;

    if (shouldUpdateContent) {
      this._updateContent();
    }
  };

  _proto._shrinkLabelToContentSize = function _shrinkLabelToContentSize(lambda) {
    var fontSize = _fontSize;
    var left = 0,
        right = fontSize | 0,
        mid = 0;

    while (left < right) {
      mid = left + right + 1 >> 1;
      var newFontSize = mid;

      if (newFontSize <= 0) {
        break;
      }

      _bmfontScale = newFontSize / _originFontSize;

      if (!_lineBreakWithoutSpaces) {
        this._multilineTextWrapByWord();
      } else {
        this._multilineTextWrapByChar();
      }

      this._computeAlignmentOffset();

      if (lambda()) {
        right = mid - 1;
      } else {
        left = mid;
      }
    }

    var actualFontSize = left;

    if (actualFontSize >= 0) {
      this._scaleFontSizeDown(actualFontSize);
    }
  };

  _proto._isVerticalClamp = function _isVerticalClamp() {
    if (_textDesiredHeight > _contentSize.height) {
      return true;
    } else {
      return false;
    }
  };

  _proto._isHorizontalClamp = function _isHorizontalClamp() {
    var letterClamp = false;

    for (var ctr = 0, l = _string.length; ctr < l; ++ctr) {
      var letterInfo = _lettersInfo[ctr];

      if (letterInfo.valid) {
        var letterDef = shareLabelInfo.fontAtlas.getLetter(letterInfo.hash);
        var px = letterInfo.x + letterDef.w * _bmfontScale;
        var lineIndex = letterInfo.line;

        if (_labelWidth > 0) {
          if (!_isWrapText) {
            if (px > _contentSize.width) {
              letterClamp = true;
              break;
            }
          } else {
            var wordWidth = _linesWidth[lineIndex];

            if (wordWidth > _contentSize.width && (px > _contentSize.width || px < 0)) {
              letterClamp = true;
              break;
            }
          }
        }
      }
    }

    return letterClamp;
  };

  _proto._isHorizontalClamped = function _isHorizontalClamped(px, lineIndex) {
    var wordWidth = _linesWidth[lineIndex];
    var letterOverClamp = px > _contentSize.width || px < 0;

    if (!_isWrapText) {
      return letterOverClamp;
    } else {
      return wordWidth > _contentSize.width && letterOverClamp;
    }
  };

  _proto._updateQuads = function _updateQuads() {
    var texture = _spriteFrame ? _spriteFrame._texture : shareLabelInfo.fontAtlas.getTexture();
    var node = _comp.node;
    this.verticesCount = this.indicesCount = 0; // Need to reset dataLength in Canvas rendering mode.

    this._renderData && (this._renderData.dataLength = 0);
    var contentSize = _contentSize,
        appx = node._anchorPoint.x * contentSize.width,
        appy = node._anchorPoint.y * contentSize.height;
    var ret = true;

    for (var ctr = 0, l = _string.length; ctr < l; ++ctr) {
      var letterInfo = _lettersInfo[ctr];
      if (!letterInfo.valid) continue;
      var letterDef = shareLabelInfo.fontAtlas.getLetter(letterInfo.hash);
      _tmpRect.height = letterDef.h;
      _tmpRect.width = letterDef.w;
      _tmpRect.x = letterDef.u;
      _tmpRect.y = letterDef.v;
      var py = letterInfo.y + _letterOffsetY;

      if (_labelHeight > 0) {
        if (py > _tailoredTopY) {
          var clipTop = py - _tailoredTopY;
          _tmpRect.y += clipTop;
          _tmpRect.height -= clipTop;
          py = py - clipTop;
        }

        if (py - letterDef.h * _bmfontScale < _tailoredBottomY && _overflow === Overflow.CLAMP) {
          _tmpRect.height = py < _tailoredBottomY ? 0 : (py - _tailoredBottomY) / _bmfontScale;
        }
      }

      var lineIndex = letterInfo.line;
      var px = letterInfo.x + letterDef.w / 2 * _bmfontScale + _linesOffsetX[lineIndex];

      if (_labelWidth > 0) {
        if (this._isHorizontalClamped(px, lineIndex)) {
          if (_overflow === Overflow.CLAMP) {
            _tmpRect.width = 0;
          } else if (_overflow === Overflow.SHRINK) {
            if (_contentSize.width > letterDef.w) {
              ret = false;
              break;
            } else {
              _tmpRect.width = 0;
            }
          }
        }
      }

      if (_tmpRect.height > 0 && _tmpRect.width > 0) {
        var isRotated = this._determineRect(_tmpRect);

        var letterPositionX = letterInfo.x + _linesOffsetX[letterInfo.line];
        this.appendQuad(_comp, texture, _tmpRect, isRotated, letterPositionX - appx, py - appy, _bmfontScale);
      }
    }

    this._quadsUpdated(_comp);

    return ret;
  };

  _proto._determineRect = function _determineRect(tempRect) {
    var isRotated = _spriteFrame.isRotated();

    var originalSize = _spriteFrame._originalSize;
    var rect = _spriteFrame._rect;
    var offset = _spriteFrame._offset;
    var trimmedLeft = offset.x + (originalSize.width - rect.width) / 2;
    var trimmedTop = offset.y - (originalSize.height - rect.height) / 2;

    if (!isRotated) {
      tempRect.x += rect.x - trimmedLeft;
      tempRect.y += rect.y + trimmedTop;
    } else {
      var originalX = tempRect.x;
      tempRect.x = rect.x + rect.height - tempRect.y - tempRect.height - trimmedTop;
      tempRect.y = originalX + rect.y - trimmedLeft;

      if (tempRect.y < 0) {
        tempRect.height = tempRect.height + trimmedTop;
      }
    }

    return isRotated;
  };

  _proto._computeAlignmentOffset = function _computeAlignmentOffset() {
    _linesOffsetX.length = 0;

    switch (_hAlign) {
      case macro.TextAlignment.LEFT:
        for (var i = 0; i < _numberOfLines; ++i) {
          _linesOffsetX.push(0);
        }

        break;

      case macro.TextAlignment.CENTER:
        for (var _i = 0, l = _linesWidth.length; _i < l; _i++) {
          _linesOffsetX.push((_contentSize.width - _linesWidth[_i]) / 2);
        }

        break;

      case macro.TextAlignment.RIGHT:
        for (var _i2 = 0, _l = _linesWidth.length; _i2 < _l; _i2++) {
          _linesOffsetX.push(_contentSize.width - _linesWidth[_i2]);
        }

        break;

      default:
        break;
    } // TOP


    _letterOffsetY = _contentSize.height;

    if (_vAlign !== macro.VerticalTextAlignment.TOP) {
      var blank = _contentSize.height - _textDesiredHeight + _lineHeight * this._getFontScale() - _originFontSize * _bmfontScale;

      if (_vAlign === macro.VerticalTextAlignment.BOTTOM) {
        // BOTTOM
        _letterOffsetY -= blank;
      } else {
        // CENTER:
        _letterOffsetY -= blank / 2;
      }
    }
  };

  _proto._setupBMFontOverflowMetrics = function _setupBMFontOverflowMetrics() {
    var newWidth = _contentSize.width,
        newHeight = _contentSize.height;

    if (_overflow === Overflow.RESIZE_HEIGHT) {
      newHeight = 0;
    }

    if (_overflow === Overflow.NONE) {
      newWidth = 0;
      newHeight = 0;
    }

    _labelWidth = newWidth;
    _labelHeight = newHeight;
    _maxLineWidth = newWidth;
  };

  _proto.updateWorldVerts = function updateWorldVerts() {};

  _proto.appendQuad = function appendQuad(comp, texture, rect, rotated, x, y, scale) {};

  _proto._quadsUpdated = function _quadsUpdated(comp) {};

  _proto._reserveQuads = function _reserveQuads() {};

  return BmfontAssembler;
}(_assembler2d["default"]);

exports["default"] = BmfontAssembler;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL3V0aWxzL2xhYmVsL2JtZm9udC5qcyJdLCJuYW1lcyI6WyJ0ZXh0VXRpbHMiLCJyZXF1aXJlIiwibWFjcm8iLCJMYWJlbCIsIk92ZXJmbG93Iiwic2hhcmVMYWJlbEluZm8iLCJMZXR0ZXJJbmZvIiwidmFsaWQiLCJ4IiwieSIsImxpbmUiLCJoYXNoIiwiX3RtcFJlY3QiLCJjYyIsInJlY3QiLCJfY29tcCIsIl9ob3Jpem9udGFsS2VybmluZ3MiLCJfbGV0dGVyc0luZm8iLCJfbGluZXNXaWR0aCIsIl9saW5lc09mZnNldFgiLCJfZm50Q29uZmlnIiwiX251bWJlck9mTGluZXMiLCJfdGV4dERlc2lyZWRIZWlnaHQiLCJfbGV0dGVyT2Zmc2V0WSIsIl90YWlsb3JlZFRvcFkiLCJfdGFpbG9yZWRCb3R0b21ZIiwiX2JtZm9udFNjYWxlIiwiX2xpbmVCcmVha1dpdGhvdXRTcGFjZXMiLCJfc3ByaXRlRnJhbWUiLCJfbGluZVNwYWNpbmciLCJfY29udGVudFNpemUiLCJzaXplIiwiX3N0cmluZyIsIl9mb250U2l6ZSIsIl9vcmlnaW5Gb250U2l6ZSIsIl9oQWxpZ24iLCJfdkFsaWduIiwiX3NwYWNpbmdYIiwiX2xpbmVIZWlnaHQiLCJfb3ZlcmZsb3ciLCJfaXNXcmFwVGV4dCIsIl9sYWJlbFdpZHRoIiwiX2xhYmVsSGVpZ2h0IiwiX21heExpbmVXaWR0aCIsIkJtZm9udEFzc2VtYmxlciIsInVwZGF0ZVJlbmRlckRhdGEiLCJjb21wIiwiX3ZlcnRzRGlydHkiLCJfcmVzZXJ2ZVF1YWRzIiwic3RyaW5nIiwidG9TdHJpbmciLCJsZW5ndGgiLCJfdXBkYXRlRm9udEZhbWlseSIsIl91cGRhdGVQcm9wZXJ0aWVzIiwiX3VwZGF0ZUxhYmVsSW5mbyIsIl91cGRhdGVDb250ZW50IiwidXBkYXRlV29ybGRWZXJ0cyIsIl9hY3R1YWxGb250U2l6ZSIsIm5vZGUiLCJzZXRDb250ZW50U2l6ZSIsIl9yZXNldFByb3BlcnRpZXMiLCJfdXBkYXRlRm9udFNjYWxlIiwiZm9udEFzc2V0IiwiZm9udCIsInNwcml0ZUZyYW1lIiwiZm9udEF0bGFzIiwiX2ZvbnREZWZEaWN0aW9uYXJ5IiwicGFja1RvRHluYW1pY0F0bGFzIiwibWFyZ2luIiwiZm9udFNpemUiLCJob3Jpem9udGFsQWxpZ24iLCJ2ZXJ0aWNhbEFsaWduIiwic3BhY2luZ1giLCJvdmVyZmxvdyIsIndpZHRoIiwiaGVpZ2h0IiwiTk9ORSIsIlJFU0laRV9IRUlHSFQiLCJlbmFibGVXcmFwVGV4dCIsImxpbmVIZWlnaHQiLCJfc2V0dXBCTUZvbnRPdmVyZmxvd01ldHJpY3MiLCJfY29tcHV0ZUhvcml6b250YWxLZXJuaW5nRm9yVGV4dCIsIl9hbGlnblRleHQiLCJzdHJpbmdMZW4iLCJob3Jpem9udGFsS2VybmluZ3MiLCJrZXJuaW5nRGljdCIsImpzIiwiaXNFbXB0eU9iamVjdCIsInByZXYiLCJpIiwia2V5IiwiY2hhckNvZGVBdCIsImtlcm5pbmdBbW91bnQiLCJfbXVsdGlsaW5lVGV4dFdyYXAiLCJuZXh0VG9rZW5GdW5jIiwidGV4dExlbiIsImxpbmVJbmRleCIsIm5leHRUb2tlblgiLCJuZXh0VG9rZW5ZIiwibG9uZ2VzdExpbmUiLCJsZXR0ZXJSaWdodCIsImhpZ2hlc3RZIiwibG93ZXN0WSIsImxldHRlckRlZiIsImxldHRlclBvc2l0aW9uIiwidjIiLCJpbmRleCIsImNoYXJhY3RlciIsImNoYXJBdCIsInB1c2giLCJfZ2V0Rm9udFNjYWxlIiwiX3JlY29yZFBsYWNlaG9sZGVySW5mbyIsInRva2VuTGVuIiwidG9rZW5IaWdoZXN0WSIsInRva2VuTG93ZXN0WSIsInRva2VuUmlnaHQiLCJuZXh0TGV0dGVyWCIsIm5ld0xpbmUiLCJ0bXAiLCJsZXR0ZXJJbmRleCIsImdldExldHRlckRlZmluaXRpb25Gb3JDaGFyIiwiYXRsYXNOYW1lIiwiY29uc29sZSIsImxvZyIsImxldHRlclgiLCJvZmZzZXRYIiwidyIsImlzVW5pY29kZVNwYWNlIiwib2Zmc2V0WSIsIl9yZWNvcmRMZXR0ZXJJbmZvIiwieEFkdmFuY2UiLCJoIiwicGFyc2VGbG9hdCIsInRvRml4ZWQiLCJDTEFNUCIsIl9nZXRGaXJzdENoYXJMZW4iLCJTSFJJTksiLCJfZ2V0Rmlyc3RXb3JkTGVuIiwidGV4dCIsInN0YXJ0SW5kZXgiLCJpc1VuaWNvZGVDSksiLCJsZW4iLCJfbXVsdGlsaW5lVGV4dFdyYXBCeVdvcmQiLCJfbXVsdGlsaW5lVGV4dFdyYXBCeUNoYXIiLCJjaGFyIiwidG1wSW5mbyIsImdldExldHRlciIsIl9jb21wdXRlQWxpZ25tZW50T2Zmc2V0IiwiX2lzVmVydGljYWxDbGFtcCIsIl9zaHJpbmtMYWJlbFRvQ29udGVudFNpemUiLCJfdXBkYXRlUXVhZHMiLCJfaXNIb3Jpem9udGFsQ2xhbXAiLCJfc2NhbGVGb250U2l6ZURvd24iLCJzaG91bGRVcGRhdGVDb250ZW50IiwibGFtYmRhIiwibGVmdCIsInJpZ2h0IiwibWlkIiwibmV3Rm9udFNpemUiLCJhY3R1YWxGb250U2l6ZSIsImxldHRlckNsYW1wIiwiY3RyIiwibCIsImxldHRlckluZm8iLCJweCIsIndvcmRXaWR0aCIsIl9pc0hvcml6b250YWxDbGFtcGVkIiwibGV0dGVyT3ZlckNsYW1wIiwidGV4dHVyZSIsIl90ZXh0dXJlIiwiZ2V0VGV4dHVyZSIsInZlcnRpY2VzQ291bnQiLCJpbmRpY2VzQ291bnQiLCJfcmVuZGVyRGF0YSIsImRhdGFMZW5ndGgiLCJjb250ZW50U2l6ZSIsImFwcHgiLCJfYW5jaG9yUG9pbnQiLCJhcHB5IiwicmV0IiwidSIsInYiLCJweSIsImNsaXBUb3AiLCJpc1JvdGF0ZWQiLCJfZGV0ZXJtaW5lUmVjdCIsImxldHRlclBvc2l0aW9uWCIsImFwcGVuZFF1YWQiLCJfcXVhZHNVcGRhdGVkIiwidGVtcFJlY3QiLCJvcmlnaW5hbFNpemUiLCJfb3JpZ2luYWxTaXplIiwiX3JlY3QiLCJvZmZzZXQiLCJfb2Zmc2V0IiwidHJpbW1lZExlZnQiLCJ0cmltbWVkVG9wIiwib3JpZ2luYWxYIiwiVGV4dEFsaWdubWVudCIsIkxFRlQiLCJDRU5URVIiLCJSSUdIVCIsIlZlcnRpY2FsVGV4dEFsaWdubWVudCIsIlRPUCIsImJsYW5rIiwiQk9UVE9NIiwibmV3V2lkdGgiLCJuZXdIZWlnaHQiLCJyb3RhdGVkIiwic2NhbGUiLCJBc3NlbWJsZXIyRCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTLEdBQUdDLE9BQU8sQ0FBQywyQkFBRCxDQUF6Qjs7QUFDQSxJQUFNQyxLQUFLLEdBQUdELE9BQU8sQ0FBQywyQkFBRCxDQUFyQjs7QUFDQSxJQUFNRSxLQUFLLEdBQUdGLE9BQU8sQ0FBQyw2QkFBRCxDQUFyQjs7QUFDQSxJQUFNRyxRQUFRLEdBQUdELEtBQUssQ0FBQ0MsUUFBdkI7O0FBRUEsSUFBTUMsY0FBYyxHQUFHSixPQUFPLENBQUMsVUFBRCxDQUFQLENBQW9CSSxjQUEzQzs7QUFFQSxJQUFJQyxVQUFVLEdBQUcsU0FBYkEsVUFBYSxHQUFXO0FBQ3hCLGlCQUFZLEVBQVo7QUFDQSxPQUFLQyxLQUFMLEdBQWEsSUFBYjtBQUNBLE9BQUtDLENBQUwsR0FBUyxDQUFUO0FBQ0EsT0FBS0MsQ0FBTCxHQUFTLENBQVQ7QUFDQSxPQUFLQyxJQUFMLEdBQVksQ0FBWjtBQUNBLE9BQUtDLElBQUwsR0FBWSxFQUFaO0FBQ0gsQ0FQRDs7QUFTQSxJQUFJQyxRQUFRLEdBQUdDLEVBQUUsQ0FBQ0MsSUFBSCxFQUFmOztBQUVBLElBQUlDLEtBQUssR0FBRyxJQUFaO0FBRUEsSUFBSUMsbUJBQW1CLEdBQUcsRUFBMUI7QUFDQSxJQUFJQyxZQUFZLEdBQUcsRUFBbkI7QUFDQSxJQUFJQyxXQUFXLEdBQUcsRUFBbEI7QUFDQSxJQUFJQyxhQUFhLEdBQUcsRUFBcEI7QUFFQSxJQUFJQyxVQUFVLEdBQUcsSUFBakI7QUFDQSxJQUFJQyxjQUFjLEdBQUcsQ0FBckI7QUFDQSxJQUFJQyxrQkFBa0IsR0FBSSxDQUExQjtBQUNBLElBQUlDLGNBQWMsR0FBSSxDQUF0QjtB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KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBBc3NlbWJsZXIyRCBmcm9tICcuLi8uLi9hc3NlbWJsZXItMmQnO1xuXG5jb25zdCB0ZXh0VXRpbHMgPSByZXF1aXJlKCcuLi8uLi8uLi91dGlscy90ZXh0LXV0aWxzJyk7XG5jb25zdCBtYWNybyA9IHJlcXVpcmUoJy4uLy4uLy4uL3BsYXRmb3JtL0NDTWFjcm8nKTtcbmNvbnN0IExhYmVsID0gcmVxdWlyZSgnLi4vLi4vLi4vY29tcG9uZW50cy9DQ0xhYmVsJyk7XG5jb25zdCBPdmVyZmxvdyA9IExhYmVsLk92ZXJmbG93O1xuXG5jb25zdCBzaGFyZUxhYmVsSW5mbyA9IHJlcXVpcmUoJy4uL3V0aWxzJykuc2hhcmVMYWJlbEluZm87XG5cbmxldCBMZXR0ZXJJbmZvID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jaGFyID0gJyc7XG4gICAgdGhpcy52YWxpZCA9IHRydWU7XG4gICAgdGhpcy54ID0gMDtcbiAgICB0aGlzLnkgPSAwO1xuICAgIHRoaXMubGluZSA9IDA7XG4gICAgdGhpcy5oYXNoID0gXCJcIjtcbn07XG5cbmxldCBfdG1wUmVjdCA9IGNjLnJlY3QoKTtcblxubGV0IF9jb21wID0gbnVsbDtcblxubGV0IF9ob3Jpem9udGFsS2VybmluZ3MgPSBbXTtcbmxldCBfbGV0dGVyc0luZm8gPSBbXTtcbmxldCBfbGluZXNXaWR0aCA9IFtdO1xubGV0IF9saW5lc09mZnNldFggPSBbXTtcblxubGV0IF9mbnRDb25maWcgPSBudWxsO1xubGV0IF9udW1iZXJPZkxpbmVzID0gMDtcbmxldCBfdGV4dERlc2lyZWRIZWlnaHQgPSAgMDtcbmxldCBfbGV0dGVyT2Zmc2V0WSA9ICAwO1xubGV0IF90YWlsb3JlZFRvcFkgPSAgMDtcblxubGV0IF90YWlsb3JlZEJvdHRvbVkgPSAgMDtcbmxldCBfYm1mb250U2NhbGUgPSAgMS4wO1xuXG5sZXQgX2xpbmVCcmVha1dpdGhvdXRTcGFjZXMgPSAgZmFsc2U7XG5sZXQgX3Nwcml0ZUZyYW1lID0gbnVsbDtcbmxldCBfbGluZVNwYWNpbmcgPSAwO1xubGV0IF9jb250ZW50U2l6ZSA9IGNjLnNpemUoKTtcbmxldCBfc3RyaW5nID0gJyc7XG5sZXQgX2ZvbnRTaXplID0gMDtcbmxldCBfb3JpZ2luRm9udFNpemUgPSAwO1xubGV0IF9oQWxpZ24gPSAwO1xubGV0IF92QWxpZ24gPSAwO1xubGV0IF9zcGFjaW5nWCA9IDA7XG5sZXQgX2xpbmVIZWlnaHQgPSAwO1xubGV0IF9vdmVyZmxvdyA9IDA7XG5sZXQgX2lzV3JhcFRleHQgPSBmYWxzZTtcbmxldCBfbGFiZWxXaWR0aCA9IDA7XG5sZXQgX2xhYmVsSGVpZ2h0ID0gMDtcbmxldCBfbWF4TGluZVdpZHRoID0gMDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm1mb250QXNzZW1ibGVyIGV4dGVuZHMgQXNzZW1ibGVyMkQge1xuICAgIHVwZGF0ZVJlbmRlckRhdGEgKGNvbXApIHtcbiAgICAgICAgaWYgKCFjb21wLl92ZXJ0c0RpcnR5KSByZXR1cm47XG4gICAgICAgIGlmIChfY29tcCA9PT0gY29tcCkgcmV0dXJuO1xuXG4gICAgICAgIF9jb21wID0gY29tcDtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuX3Jlc2VydmVRdWFkcyhjb21wLCBjb21wLnN0cmluZy50b1N0cmluZygpLmxlbmd0aCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUZvbnRGYW1pbHkoY29tcCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVByb3BlcnRpZXMoY29tcCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUxhYmVsSW5mbyhjb21wKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlQ29udGVudCgpO1xuICAgICAgICB0aGlzLnVwZGF0ZVdvcmxkVmVydHMoY29tcCk7XG4gICAgICAgIFxuICAgICAgICBfY29tcC5fYWN0dWFsRm9udFNpemUgPSBfZm9udFNpemU7XG4gICAgICAgIF9jb21wLm5vZGUuc2V0Q29udGVudFNpemUoX2NvbnRlbnRTaXplKTtcblxuICAgICAgICBfY29tcC5fdmVydHNEaXJ0eSA9IGZhbHNlO1xuICAgICAgICBfY29tcCA9IG51bGw7XG4gICAgICAgIHRoaXMuX3Jlc2V0UHJvcGVydGllcygpO1xuICAgIH1cblxuICAgIF91cGRhdGVGb250U2NhbGUgKCkge1xuICAgICAgICBfYm1mb250U2NhbGUgPSBfZm9udFNpemUgLyBfb3JpZ2luRm9udFNpemU7XG4gICAgfVxuXG4gICAgX3VwZGF0ZUZvbnRGYW1pbHkgKGNvbXApIHtcbiAgICAgICAgbGV0IGZvbnRBc3NldCA9IGNvbXAuZm9udDtcbiAgICAgICAgX3Nwcml0ZUZyYW1lID0gZm9udEFzc2V0LnNwcml0ZUZyYW1lO1xuICAgICAgICBfZm50Q29uZmlnID0gZm9udEFzc2V0Ll9mbnRDb25maWc7XG4gICAgICAgIHNoYXJlTGFiZWxJbmZvLmZvbnRBdGxhcyA9IGZvbnRBc3NldC5fZm9udERlZkRpY3Rpb25hcnk7XG5cbiAgICAgICAgdGhpcy5wYWNrVG9EeW5hbWljQXRsYXMoY29tcCwgX3Nwcml0ZUZyYW1lKTtcbiAgICB9XG5cbiAgICBfdXBkYXRlTGFiZWxJbmZvKCkge1xuICAgICAgICAvLyBjbGVhclxuICAgICAgICBzaGFyZUxhYmVsSW5mby5oYXNoID0gXCJcIjtcbiAgICAgICAgc2hhcmVMYWJlbEluZm8ubWFyZ2luID0gMDtcbiAgICB9XG5cbiAgICBfdXBkYXRlUHJvcGVydGllcyAoY29tcCkge1xuICAgICAgICBfc3RyaW5nID0gY29tcC5zdHJpbmcudG9TdHJpbmcoKTtcbiAgICAgICAgX2ZvbnRTaXplID0gY29tcC5mb250U2l6ZTtcbiAgICAgICAgX29yaWdpbkZvbnRTaXplID0gX2ZudENvbmZpZyA/IF9mbnRDb25maWcuZm9udFNpemUgOiBjb21wLmZvbnRTaXplO1xuICAgICAgICBfaEFsaWduID0gY29tcC5ob3Jpem9udGFsQWxpZ247XG4gICAgICAgIF92QWxpZ24gPSBjb21wLnZlcnRpY2FsQWxpZ247XG4gICAgICAgIF9zcGFjaW5nWCA9IGNvbXAuc3BhY2luZ1g7XG4gICAgICAgIF9vdmVyZmxvdyA9IGNvbXAub3ZlcmZsb3c7XG4gICAgICAgIF9saW5lSGVpZ2h0ID0gY29tcC5fbGluZUhlaWdodDtcbiAgICAgICAgXG4gICAgICAgIF9jb250ZW50U2l6ZS53aWR0aCA9IGNvbXAubm9kZS53aWR0aDtcbiAgICAgICAgX2NvbnRlbnRTaXplLmhlaWdodCA9IGNvbXAubm9kZS5oZWlnaHQ7XG5cbiAgICAgICAgLy8gc2hvdWxkIHdyYXAgdGV4dFxuICAgICAgICBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5OT05FKSB7XG4gICAgICAgICAgICBfaXNXcmFwVGV4dCA9IGZhbHNlO1xuICAgICAgICAgICAgX2NvbnRlbnRTaXplLndpZHRoICs9IHNoYXJlTGFiZWxJbmZvLm1hcmdpbiAqIDI7XG4gICAgICAgICAgICBfY29udGVudFNpemUuaGVpZ2h0ICs9IHNoYXJlTGFiZWxJbmZvLm1hcmdpbiAqIDI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5SRVNJWkVfSEVJR0hUKSB7XG4gICAgICAgICAgICBfaXNXcmFwVGV4dCA9IHRydWU7XG4gICAgICAgICAgICBfY29udGVudFNpemUuaGVpZ2h0ICs9IHNoYXJlTGFiZWxJbmZvLm1hcmdpbiAqIDI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBfaXNXcmFwVGV4dCA9IGNvbXAuZW5hYmxlV3JhcFRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHNoYXJlTGFiZWxJbmZvLmxpbmVIZWlnaHQgPSBfbGluZUhlaWdodDtcbiAgICAgICAgc2hhcmVMYWJlbEluZm8uZm9udFNpemUgPSBfZm9udFNpemU7XG5cbiAgICAgICAgdGhpcy5fc2V0dXBCTUZvbnRPdmVyZmxvd01ldHJpY3MoKTtcbiAgICB9XG5cbiAgICBfcmVzZXRQcm9wZXJ0aWVzICgpIHtcbiAgICAgICAgX2ZudENvbmZpZyA9IG51bGw7XG4gICAgICAgIF9zcHJpdGVGcmFtZSA9IG51bGw7XG4gICAgICAgIHNoYXJlTGFiZWxJbmZvLmhhc2ggPSBcIlwiO1xuICAgICAgICBzaGFyZUxhYmVsSW5mby5tYXJnaW4gPSAwO1xuICAgIH1cblxuICAgIF91cGRhdGVDb250ZW50ICgpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlRm9udFNjYWxlKCk7XG4gICAgICAgIHRoaXMuX2NvbXB1dGVIb3Jpem9udGFsS2VybmluZ0ZvclRleHQoKTtcbiAgICAgICAgdGhpcy5fYWxpZ25UZXh0KCk7XG4gICAgfVxuXG4gICAgX2NvbXB1dGVIb3Jpem9udGFsS2VybmluZ0ZvclRleHQgKCkge1xuICAgICAgICBsZXQgc3RyaW5nID0gX3N0cmluZztcbiAgICAgICAgbGV0IHN0cmluZ0xlbiA9IHN0cmluZy5sZW5ndGg7XG5cbiAgICAgICAgbGV0IGhvcml6b250YWxLZXJuaW5ncyA9IF9ob3Jpem9udGFsS2VybmluZ3M7XG4gICAgICAgIGxldCBrZXJuaW5nRGljdDtcbiAgICAgICAgX2ZudENvbmZpZyAmJiAoa2VybmluZ0RpY3QgPSBfZm50Q29uZmlnLmtlcm5pbmdEaWN0KTtcbiAgICAgICAgaWYgKGtlcm5pbmdEaWN0ICYmICFjYy5qcy5pc0VtcHR5T2JqZWN0KGtlcm5pbmdEaWN0KSkge1xuICAgICAgICAgICAgbGV0IHByZXYgPSAtMTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyaW5nTGVuOyArK2kpIHtcbiAgICAgICAgICAgICAgICBsZXQga2V5ID0gc3RyaW5nLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgICAgICAgICAgbGV0IGtlcm5pbmdBbW91bnQgPSBrZXJuaW5nRGljdFsocHJldiA8PCAxNikgfCAoa2V5ICYgMHhmZmZmKV0gfHwgMDtcbiAgICAgICAgICAgICAgICBpZiAoaSA8IHN0cmluZ0xlbiAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaG9yaXpvbnRhbEtlcm5pbmdzW2ldID0ga2VybmluZ0Ftb3VudDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBob3Jpem9udGFsS2VybmluZ3NbaV0gPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcmV2ID0ga2V5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaG9yaXpvbnRhbEtlcm5pbmdzLmxlbmd0aCA9IDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfbXVsdGlsaW5lVGV4dFdyYXAgKG5leHRUb2tlbkZ1bmMpIHtcbiAgICAgICAgbGV0IHRleHRMZW4gPSBfc3RyaW5nLmxlbmd0aDtcblxuICAgICAgICBsZXQgbGluZUluZGV4ID0gMDtcbiAgICAgICAgbGV0IG5leHRUb2tlblggPSAwO1xuICAgICAgICBsZXQgbmV4dFRva2VuWSA9IDA7XG4gICAgICAgIGxldCBsb25nZXN0TGluZSA9IDA7XG4gICAgICAgIGxldCBsZXR0ZXJSaWdodCA9IDA7XG5cbiAgICAgICAgbGV0IGhpZ2hlc3RZID0gMDtcbiAgICAgICAgbGV0IGxvd2VzdFkgPSAwO1xuICAgICAgICBsZXQgbGV0dGVyRGVmID0gbnVsbDtcbiAgICAgICAgbGV0IGxldHRlclBvc2l0aW9uID0gY2MudjIoMCwgMCk7XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRleHRMZW47KSB7XG4gICAgICAgICAgICBsZXQgY2hhcmFjdGVyID0gX3N0cmluZy5jaGFyQXQoaW5kZXgpO1xuICAgICAgICAgICAgaWYgKGNoYXJhY3RlciA9PT0gXCJcXG5cIikge1xuICAgICAgICAgICAgICAgIF9saW5lc1dpZHRoLnB1c2gobGV0dGVyUmlnaHQpO1xuICAgICAgICAgICAgICAgIGxldHRlclJpZ2h0ID0gMDtcbiAgICAgICAgICAgICAgICBsaW5lSW5kZXgrKztcbiAgICAgICAgICAgICAgICBuZXh0VG9rZW5YID0gMDtcbiAgICAgICAgICAgICAgICBuZXh0VG9rZW5ZIC09IF9saW5lSGVpZ2h0ICogdGhpcy5fZ2V0Rm9udFNjYWxlKCkgKyBfbGluZVNwYWNpbmc7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjb3JkUGxhY2Vob2xkZXJJbmZvKGluZGV4LCBjaGFyYWN0ZXIpO1xuICAgICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB0b2tlbkxlbiA9IG5leHRUb2tlbkZ1bmMoX3N0cmluZywgaW5kZXgsIHRleHRMZW4pO1xuICAgICAgICAgICAgbGV0IHRva2VuSGlnaGVzdFkgPSBoaWdoZXN0WTtcbiAgICAgICAgICAgIGxldCB0b2tlbkxvd2VzdFkgPSBsb3dlc3RZO1xuICAgICAgICAgICAgbGV0IHRva2VuUmlnaHQgPSBsZXR0ZXJSaWdodDtcbiAgICAgICAgICAgIGxldCBuZXh0TGV0dGVyWCA9IG5leHRUb2tlblg7XG4gICAgICAgICAgICBsZXQgbmV3TGluZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmb3IgKGxldCB0bXAgPSAwOyB0bXAgPCB0b2tlbkxlbjsgKyt0bXApIHtcbiAgICAgICAgICAgICAgICBsZXQgbGV0dGVySW5kZXggPSBpbmRleCArIHRtcDtcbiAgICAgICAgICAgICAgICBjaGFyYWN0ZXIgPSBfc3RyaW5nLmNoYXJBdChsZXR0ZXJJbmRleCk7XG4gICAgICAgICAgICAgICAgaWYgKGNoYXJhY3RlciA9PT0gXCJcXHJcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWNvcmRQbGFjZWhvbGRlckluZm8obGV0dGVySW5kZXgsIGNoYXJhY3Rlcik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXR0ZXJEZWYgPSBzaGFyZUxhYmVsSW5mby5mb250QXRsYXMuZ2V0TGV0dGVyRGVmaW5pdGlvbkZvckNoYXIoY2hhcmFjdGVyLCBzaGFyZUxhYmVsSW5mbyk7XG4gICAgICAgICAgICAgICAgaWYgKCFsZXR0ZXJEZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVjb3JkUGxhY2Vob2xkZXJJbmZvKGxldHRlckluZGV4LCBjaGFyYWN0ZXIpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYXRsYXNOYW1lID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgX2ZudENvbmZpZyAmJiAoYXRsYXNOYW1lID0gX2ZudENvbmZpZy5hdGxhc05hbWUpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNhbid0IGZpbmQgbGV0dGVyIGRlZmluaXRpb24gaW4gdGV4dHVyZSBhdGxhcyBcIiArIGF0bGFzTmFtZSArIFwiIGZvciBsZXR0ZXI6XCIgKyBjaGFyYWN0ZXIpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgbGV0dGVyWCA9IG5leHRMZXR0ZXJYICsgbGV0dGVyRGVmLm9mZnNldFggKiBfYm1mb250U2NhbGUgLSBzaGFyZUxhYmVsSW5mby5tYXJnaW47XG5cbiAgICAgICAgICAgICAgICBpZiAoX2lzV3JhcFRleHRcbiAgICAgICAgICAgICAgICAgICAgJiYgX21heExpbmVXaWR0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgJiYgbmV4dFRva2VuWCA+IDBcbiAgICAgICAgICAgICAgICAgICAgJiYgbGV0dGVyWCArIGxldHRlckRlZi53ICogX2JtZm9udFNjYWxlID4gX21heExpbmVXaWR0aFxuICAgICAgICAgICAgICAgICAgICAmJiAhdGV4dFV0aWxzLmlzVW5pY29kZVNwYWNlKGNoYXJhY3RlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgX2xpbmVzV2lkdGgucHVzaChsZXR0ZXJSaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIGxldHRlclJpZ2h0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgbGluZUluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgIG5leHRUb2tlblggPSAwO1xuICAgICAgICAgICAgICAgICAgICBuZXh0VG9rZW5ZIC09IChfbGluZUhlaWdodCAqIHRoaXMuX2dldEZvbnRTY2FsZSgpICsgX2xpbmVTcGFjaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldHRlclBvc2l0aW9uLnggPSBsZXR0ZXJYO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldHRlclBvc2l0aW9uLnkgPSBuZXh0VG9rZW5ZIC0gbGV0dGVyRGVmLm9mZnNldFkgKiBfYm1mb250U2NhbGUgICsgc2hhcmVMYWJlbEluZm8ubWFyZ2luO1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlY29yZExldHRlckluZm8obGV0dGVyUG9zaXRpb24sIGNoYXJhY3RlciwgbGV0dGVySW5kZXgsIGxpbmVJbmRleCk7XG5cbiAgICAgICAgICAgICAgICBpZiAobGV0dGVySW5kZXggKyAxIDwgX2hvcml6b250YWxLZXJuaW5ncy5sZW5ndGggJiYgbGV0dGVySW5kZXggPCB0ZXh0TGVuIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBuZXh0TGV0dGVyWCArPSBfaG9yaXpvbnRhbEtlcm5pbmdzW2xldHRlckluZGV4ICsgMV07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbmV4dExldHRlclggKz0gbGV0dGVyRGVmLnhBZHZhbmNlICogX2JtZm9udFNjYWxlICsgX3NwYWNpbmdYICAtIHNoYXJlTGFiZWxJbmZvLm1hcmdpbiAqIDI7XG5cbiAgICAgICAgICAgICAgICB0b2tlblJpZ2h0ID0gbGV0dGVyUG9zaXRpb24ueCArIGxldHRlckRlZi53ICogX2JtZm9udFNjYWxlICAtIHNoYXJlTGFiZWxJbmZvLm1hcmdpbjtcblxuICAgICAgICAgICAgICAgIGlmICh0b2tlbkhpZ2hlc3RZIDwgbGV0dGVyUG9zaXRpb24ueSkge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbkhpZ2hlc3RZID0gbGV0dGVyUG9zaXRpb24ueTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodG9rZW5Mb3dlc3RZID4gbGV0dGVyUG9zaXRpb24ueSAtIGxldHRlckRlZi5oICogX2JtZm9udFNjYWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuTG93ZXN0WSA9IGxldHRlclBvc2l0aW9uLnkgLSBsZXR0ZXJEZWYuaCAqIF9ibWZvbnRTY2FsZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gLy9lbmQgb2YgZm9yIGxvb3BcblxuICAgICAgICAgICAgaWYgKG5ld0xpbmUpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBuZXh0VG9rZW5YID0gbmV4dExldHRlclg7XG4gICAgICAgICAgICBsZXR0ZXJSaWdodCA9IHRva2VuUmlnaHQ7XG5cbiAgICAgICAgICAgIGlmIChoaWdoZXN0WSA8IHRva2VuSGlnaGVzdFkpIHtcbiAgICAgICAgICAgICAgICBoaWdoZXN0WSA9IHRva2VuSGlnaGVzdFk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobG93ZXN0WSA+IHRva2VuTG93ZXN0WSkge1xuICAgICAgICAgICAgICAgIGxvd2VzdFkgPSB0b2tlbkxvd2VzdFk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobG9uZ2VzdExpbmUgPCBsZXR0ZXJSaWdodCkge1xuICAgICAgICAgICAgICAgIGxvbmdlc3RMaW5lID0gbGV0dGVyUmlnaHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGluZGV4ICs9IHRva2VuTGVuO1xuICAgICAgICB9IC8vZW5kIG9mIGZvciBsb29wXG5cbiAgICAgICAgX2xpbmVzV2lkdGgucHVzaChsZXR0ZXJSaWdodCk7XG5cbiAgICAgICAgX251bWJlck9mTGluZXMgPSBsaW5lSW5kZXggKyAxO1xuICAgICAgICBfdGV4dERlc2lyZWRIZWlnaHQgPSBfbnVtYmVyT2ZMaW5lcyAqIF9saW5lSGVpZ2h0ICogdGhpcy5fZ2V0Rm9udFNjYWxlKCk7XG4gICAgICAgIGlmIChfbnVtYmVyT2ZMaW5lcyA+IDEpIHtcbiAgICAgICAgICAgIF90ZXh0RGVzaXJlZEhlaWdodCArPSAoX251bWJlck9mTGluZXMgLSAxKSAqIF9saW5lU3BhY2luZztcbiAgICAgICAgfVxuXG4gICAgICAgIF9jb250ZW50U2l6ZS53aWR0aCA9IF9sYWJlbFdpZHRoO1xuICAgICAgICBfY29udGVudFNpemUuaGVpZ2h0ID0gX2xhYmVsSGVpZ2h0O1xuICAgICAgICBpZiAoX2xhYmVsV2lkdGggPD0gMCkge1xuICAgICAgICAgICAgX2NvbnRlbnRTaXplLndpZHRoID0gcGFyc2VGbG9hdChsb25nZXN0TGluZS50b0ZpeGVkKDIpKSArIHNoYXJlTGFiZWxJbmZvLm1hcmdpbiAqIDI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF9sYWJlbEhlaWdodCA8PSAwKSB7XG4gICAgICAgICAgICBfY29udGVudFNpemUuaGVpZ2h0ID0gcGFyc2VGbG9hdChfdGV4dERlc2lyZWRIZWlnaHQudG9GaXhlZCgyKSkgKyBzaGFyZUxhYmVsSW5mby5tYXJnaW4gKiAyO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RhaWxvcmVkVG9wWSA9IF9jb250ZW50U2l6ZS5oZWlnaHQ7XG4gICAgICAgIF90YWlsb3JlZEJvdHRvbVkgPSAwO1xuXG4gICAgICAgIGlmIChfb3ZlcmZsb3cgIT09IE92ZXJmbG93LkNMQU1QKSB7XG4gICAgICAgICAgICBpZiAoaGlnaGVzdFkgPiAwKSB7XG4gICAgICAgICAgICAgICAgX3RhaWxvcmVkVG9wWSA9IF9jb250ZW50U2l6ZS5oZWlnaHQgKyBoaWdoZXN0WTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGlmIChsb3dlc3RZIDwgLV90ZXh0RGVzaXJlZEhlaWdodCkge1xuICAgICAgICAgICAgICAgIF90YWlsb3JlZEJvdHRvbVkgPSBfdGV4dERlc2lyZWRIZWlnaHQgKyBsb3dlc3RZO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgX2dldEZpcnN0Q2hhckxlbiAoKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIF9nZXRGb250U2NhbGUgKCkge1xuICAgICAgICByZXR1cm4gX292ZXJmbG93ID09PSBPdmVyZmxvdy5TSFJJTksgPyBfYm1mb250U2NhbGUgOiAxO1xuICAgIH1cblxuICAgIF9nZXRGaXJzdFdvcmRMZW4gKHRleHQsIHN0YXJ0SW5kZXgsIHRleHRMZW4pIHtcbiAgICAgICAgbGV0IGNoYXJhY3RlciA9IHRleHQuY2hhckF0KHN0YXJ0SW5kZXgpO1xuICAgICAgICBpZiAodGV4dFV0aWxzLmlzVW5pY29kZUNKSyhjaGFyYWN0ZXIpXG4gICAgICAgICAgICB8fCBjaGFyYWN0ZXIgPT09IFwiXFxuXCJcbiAgICAgICAgICAgIHx8IHRleHRVdGlscy5pc1VuaWNvZGVTcGFjZShjaGFyYWN0ZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBsZW4gPSAxO1xuICAgICAgICBsZXQgbGV0dGVyRGVmID0gc2hhcmVMYWJlbEluZm8uZm9udEF0bGFzLmdldExldHRlckRlZmluaXRpb25Gb3JDaGFyKGNoYXJhY3Rlciwgc2hhcmVMYWJlbEluZm8pO1xuICAgICAgICBpZiAoIWxldHRlckRlZikge1xuICAgICAgICAgICAgcmV0dXJuIGxlbjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbmV4dExldHRlclggPSBsZXR0ZXJEZWYueEFkdmFuY2UgKiBfYm1mb250U2NhbGUgKyBfc3BhY2luZ1g7XG4gICAgICAgIGxldCBsZXR0ZXJYO1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IHN0YXJ0SW5kZXggKyAxOyBpbmRleCA8IHRleHRMZW47ICsraW5kZXgpIHtcbiAgICAgICAgICAgIGNoYXJhY3RlciA9IHRleHQuY2hhckF0KGluZGV4KTtcblxuICAgICAgICAgICAgbGV0dGVyRGVmID0gc2hhcmVMYWJlbEluZm8uZm9udEF0bGFzLmdldExldHRlckRlZmluaXRpb25Gb3JDaGFyKGNoYXJhY3Rlciwgc2hhcmVMYWJlbEluZm8pO1xuICAgICAgICAgICAgaWYgKCFsZXR0ZXJEZWYpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldHRlclggPSBuZXh0TGV0dGVyWCArIGxldHRlckRlZi5vZmZzZXRYICogX2JtZm9udFNjYWxlO1xuXG4gICAgICAgICAgICBpZihsZXR0ZXJYICsgbGV0dGVyRGVmLncgKiBfYm1mb250U2NhbGUgPiBfbWF4TGluZVdpZHRoXG4gICAgICAgICAgICAgICAmJiAhdGV4dFV0aWxzLmlzVW5pY29kZVNwYWNlKGNoYXJhY3RlcilcbiAgICAgICAgICAgICAgICYmIF9tYXhMaW5lV2lkdGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5leHRMZXR0ZXJYICs9IGxldHRlckRlZi54QWR2YW5jZSAqIF9ibWZvbnRTY2FsZSArIF9zcGFjaW5nWDtcbiAgICAgICAgICAgIGlmIChjaGFyYWN0ZXIgPT09IFwiXFxuXCJcbiAgICAgICAgICAgICAgICB8fCB0ZXh0VXRpbHMuaXNVbmljb2RlU3BhY2UoY2hhcmFjdGVyKVxuICAgICAgICAgICAgICAgIHx8IHRleHRVdGlscy5pc1VuaWNvZGVDSksoY2hhcmFjdGVyKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGVuKys7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGVuO1xuICAgIH1cblxuICAgIF9tdWx0aWxpbmVUZXh0V3JhcEJ5V29yZCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tdWx0aWxpbmVUZXh0V3JhcCh0aGlzLl9nZXRGaXJzdFdvcmRMZW4pO1xuICAgIH1cblxuICAgIF9tdWx0aWxpbmVUZXh0V3JhcEJ5Q2hhciAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tdWx0aWxpbmVUZXh0V3JhcCh0aGlzLl9nZXRGaXJzdENoYXJMZW4pO1xuICAgIH1cblxuICAgIF9yZWNvcmRQbGFjZWhvbGRlckluZm8gKGxldHRlckluZGV4LCBjaGFyKSB7XG4gICAgICAgIGlmIChsZXR0ZXJJbmRleCA+PSBfbGV0dGVyc0luZm8ubGVuZ3RoKSB7XG4gICAgICAgICAgICBsZXQgdG1wSW5mbyA9IG5ldyBMZXR0ZXJJbmZvKCk7XG4gICAgICAgICAgICBfbGV0dGVyc0luZm8ucHVzaCh0bXBJbmZvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9sZXR0ZXJzSW5mb1tsZXR0ZXJJbmRleF0uY2hhciA9IGNoYXI7XG4gICAgICAgIF9sZXR0ZXJzSW5mb1tsZXR0ZXJJbmRleF0uaGFzaCA9IGNoYXIuY2hhckNvZGVBdCgwKSArIHNoYXJlTGFiZWxJbmZvLmhhc2g7XG4gICAgICAgIF9sZXR0ZXJzSW5mb1tsZXR0ZXJJbmRleF0udmFsaWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBfcmVjb3JkTGV0dGVySW5mbyAobGV0dGVyUG9zaXRpb24sIGNoYXJhY3RlciwgbGV0dGVySW5kZXgsIGxpbmVJbmRleCkge1xuICAgICAgICBpZiAobGV0dGVySW5kZXggPj0gX2xldHRlcnNJbmZvLmxlbmd0aCkge1xuICAgICAgICAgICAgbGV0IHRtcEluZm8gPSBuZXcgTGV0dGVySW5mbygpO1xuICAgICAgICAgICAgX2xldHRlcnNJbmZvLnB1c2godG1wSW5mbyk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNoYXIgPSBjaGFyYWN0ZXIuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgbGV0IGtleSA9IGNoYXIgKyBzaGFyZUxhYmVsSW5mby5oYXNoO1xuXG4gICAgICAgIF9sZXR0ZXJzSW5mb1tsZXR0ZXJJbmRleF0ubGluZT0gbGluZUluZGV4O1xuICAgICAgICBfbGV0dGVyc0luZm9bbGV0dGVySW5kZXhdLmNoYXIgPSBjaGFyYWN0ZXI7XG4gICAgICAgIF9sZXR0ZXJzSW5mb1tsZXR0ZXJJbmRleF0uaGFzaCA9IGtleTtcbiAgICAgICAgX2xldHRlcnNJbmZvW2xldHRlckluZGV4XS52YWxpZCA9IHNoYXJlTGFiZWxJbmZvLmZvbnRBdGxhcy5nZXRMZXR0ZXIoa2V5KS52YWxpZDtcbiAgICAgICAgX2xldHRlcnNJbmZvW2xldHRlckluZGV4XS54ID0gbGV0dGVyUG9zaXRpb24ueDtcbiAgICAgICAgX2xldHRlcnNJbmZvW2xldHRlckluZGV4XS55ID0gbGV0dGVyUG9zaXRpb24ueTtcbiAgICB9XG5cbiAgICBfYWxpZ25UZXh0ICgpIHtcbiAgICAgICAgX3RleHREZXNpcmVkSGVpZ2h0ID0gMDtcbiAgICAgICAgX2xpbmVzV2lkdGgubGVuZ3RoID0gMDtcblxuICAgICAgICBpZiAoIV9saW5lQnJlYWtXaXRob3V0U3BhY2VzKSB7XG4gICAgICAgICAgICB0aGlzLl9tdWx0aWxpbmVUZXh0V3JhcEJ5V29yZCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbXVsdGlsaW5lVGV4dFdyYXBCeUNoYXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2NvbXB1dGVBbGlnbm1lbnRPZmZzZXQoKTtcblxuICAgICAgICAvL3Nocmlua1xuICAgICAgICBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5TSFJJTkspIHtcbiAgICAgICAgICAgIGlmIChfZm9udFNpemUgPiAwICYmIHRoaXMuX2lzVmVydGljYWxDbGFtcCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2hyaW5rTGFiZWxUb0NvbnRlbnRTaXplKHRoaXMuX2lzVmVydGljYWxDbGFtcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuX3VwZGF0ZVF1YWRzKCkpIHtcbiAgICAgICAgICAgIGlmIChfb3ZlcmZsb3cgPT09IE92ZXJmbG93LlNIUklOSykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Nocmlua0xhYmVsVG9Db250ZW50U2l6ZSh0aGlzLl9pc0hvcml6b250YWxDbGFtcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfc2NhbGVGb250U2l6ZURvd24gKGZvbnRTaXplKSB7XG4gICAgICAgIGxldCBzaG91bGRVcGRhdGVDb250ZW50ID0gdHJ1ZTtcbiAgICAgICAgaWYgKCFmb250U2l6ZSkge1xuICAgICAgICAgICAgZm9udFNpemUgPSAwLjE7XG4gICAgICAgICAgICBzaG91bGRVcGRhdGVDb250ZW50ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgX2ZvbnRTaXplID0gZm9udFNpemU7XG5cbiAgICAgICAgaWYgKHNob3VsZFVwZGF0ZUNvbnRlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUNvbnRlbnQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9zaHJpbmtMYWJlbFRvQ29udGVudFNpemUgKGxhbWJkYSkge1xuICAgICAgICBsZXQgZm9udFNpemUgPSBfZm9udFNpemU7XG5cbiAgICAgICAgbGV0IGxlZnQgPSAwLCByaWdodCA9IGZvbnRTaXplIHwgMCwgbWlkID0gMDtcbiAgICAgICAgd2hpbGUgKGxlZnQgPCByaWdodCkge1xuICAgICAgICAgICAgbWlkID0gKGxlZnQgKyByaWdodCArIDEpID4+IDE7XG5cbiAgICAgICAgICAgIGxldCBuZXdGb250U2l6ZSA9IG1pZDtcbiAgICAgICAgICAgIGlmIChuZXdGb250U2l6ZSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF9ibWZvbnRTY2FsZSA9IG5ld0ZvbnRTaXplIC8gX29yaWdpbkZvbnRTaXplO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIV9saW5lQnJlYWtXaXRob3V0U3BhY2VzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbXVsdGlsaW5lVGV4dFdyYXBCeVdvcmQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbXVsdGlsaW5lVGV4dFdyYXBCeUNoYXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2NvbXB1dGVBbGlnbm1lbnRPZmZzZXQoKTtcblxuICAgICAgICAgICAgaWYgKGxhbWJkYSgpKSB7XG4gICAgICAgICAgICAgICAgcmlnaHQgPSBtaWQgLSAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZWZ0ID0gbWlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGFjdHVhbEZvbnRTaXplID0gbGVmdDtcbiAgICAgICAgaWYgKGFjdHVhbEZvbnRTaXplID49IDApIHtcbiAgICAgICAgICAgIHRoaXMuX3NjYWxlRm9udFNpemVEb3duKGFjdHVhbEZvbnRTaXplKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9pc1ZlcnRpY2FsQ2xhbXAgKCkge1xuICAgICAgICBpZiAoX3RleHREZXNpcmVkSGVpZ2h0ID4gX2NvbnRlbnRTaXplLmhlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfaXNIb3Jpem9udGFsQ2xhbXAgKCkge1xuICAgICAgICBsZXQgbGV0dGVyQ2xhbXAgPSBmYWxzZTtcbiAgICAgICAgZm9yIChsZXQgY3RyID0gMCwgbCA9IF9zdHJpbmcubGVuZ3RoOyBjdHIgPCBsOyArK2N0cikge1xuICAgICAgICAgICAgbGV0IGxldHRlckluZm8gPSBfbGV0dGVyc0luZm9bY3RyXTtcbiAgICAgICAgICAgIGlmIChsZXR0ZXJJbmZvLnZhbGlkKSB7XG4gICAgICAgICAgICAgICAgbGV0IGxldHRlckRlZiA9IHNoYXJlTGFiZWxJbmZvLmZvbnRBdGxhcy5nZXRMZXR0ZXIobGV0dGVySW5mby5oYXNoKTtcblxuICAgICAgICAgICAgICAgIGxldCBweCA9IGxldHRlckluZm8ueCArIGxldHRlckRlZi53ICogX2JtZm9udFNjYWxlO1xuICAgICAgICAgICAgICAgIGxldCBsaW5lSW5kZXggPSBsZXR0ZXJJbmZvLmxpbmU7XG4gICAgICAgICAgICAgICAgaWYgKF9sYWJlbFdpZHRoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIV9pc1dyYXBUZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihweCA+IF9jb250ZW50U2l6ZS53aWR0aCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyQ2xhbXAgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB3b3JkV2lkdGggPSBfbGluZXNXaWR0aFtsaW5lSW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmRXaWR0aCA+IF9jb250ZW50U2l6ZS53aWR0aCAmJiAocHggPiBfY29udGVudFNpemUud2lkdGggfHwgcHggPCAwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlckNsYW1wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsZXR0ZXJDbGFtcDtcbiAgICB9XG5cbiAgICBfaXNIb3Jpem9udGFsQ2xhbXBlZCAocHgsIGxpbmVJbmRleCkge1xuICAgICAgICBsZXQgd29yZFdpZHRoID0gX2xpbmVzV2lkdGhbbGluZUluZGV4XTtcbiAgICAgICAgbGV0IGxldHRlck92ZXJDbGFtcCA9IChweCA+IF9jb250ZW50U2l6ZS53aWR0aCB8fCBweCA8IDApO1xuXG4gICAgICAgIGlmKCFfaXNXcmFwVGV4dCl7XG4gICAgICAgICAgICByZXR1cm4gbGV0dGVyT3ZlckNsYW1wO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHJldHVybiAod29yZFdpZHRoID4gX2NvbnRlbnRTaXplLndpZHRoICYmIGxldHRlck92ZXJDbGFtcCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfdXBkYXRlUXVhZHMgKCkge1xuICAgICAgICBsZXQgdGV4dHVyZSA9IF9zcHJpdGVGcmFtZSA/IF9zcHJpdGVGcmFtZS5fdGV4dHVyZSA6IHNoYXJlTGFiZWxJbmZvLmZvbnRBdGxhcy5nZXRUZXh0dXJlKCk7XG5cbiAgICAgICAgbGV0IG5vZGUgPSBfY29tcC5ub2RlO1xuXG4gICAgICAgIHRoaXMudmVydGljZXNDb3VudCA9IHRoaXMuaW5kaWNlc0NvdW50ID0gMDtcbiAgICAgICAgXG4gICAgICAgIC8vIE5lZWQgdG8gcmVzZXQgZGF0YUxlbmd0aCBpbiBDYW52YXMgcmVuZGVyaW5nIG1vZGUuXG4gICAgICAgIHRoaXMuX3JlbmRlckRhdGEgJiYgKHRoaXMuX3JlbmRlckRhdGEuZGF0YUxlbmd0aCA9IDApO1xuXG4gICAgICAgIGxldCBjb250ZW50U2l6ZSA9IF9jb250ZW50U2l6ZSxcbiAgICAgICAgICAgIGFwcHggPSBub2RlLl9hbmNob3JQb2ludC54ICogY29udGVudFNpemUud2lkdGgsXG4gICAgICAgICAgICBhcHB5ID0gbm9kZS5fYW5jaG9yUG9pbnQueSAqIGNvbnRlbnRTaXplLmhlaWdodDtcbiAgICAgICAgXG4gICAgICAgIGxldCByZXQgPSB0cnVlO1xuICAgICAgICBmb3IgKGxldCBjdHIgPSAwLCBsID0gX3N0cmluZy5sZW5ndGg7IGN0ciA8IGw7ICsrY3RyKSB7XG4gICAgICAgICAgICBsZXQgbGV0dGVySW5mbyA9IF9sZXR0ZXJzSW5mb1tjdHJdO1xuICAgICAgICAgICAgaWYgKCFsZXR0ZXJJbmZvLnZhbGlkKSBjb250aW51ZTtcbiAgICAgICAgICAgIGxldCBsZXR0ZXJEZWYgPSBzaGFyZUxhYmVsSW5mby5mb250QXRsYXMuZ2V0TGV0dGVyKGxldHRlckluZm8uaGFzaCk7XG5cbiAgICAgICAgICAgIF90bXBSZWN0LmhlaWdodCA9IGxldHRlckRlZi5oO1xuICAgICAgICAgICAgX3RtcFJlY3Qud2lkdGggPSBsZXR0ZXJEZWYudztcbiAgICAgICAgICAgIF90bXBSZWN0LnggPSBsZXR0ZXJEZWYudTtcbiAgICAgICAgICAgIF90bXBSZWN0LnkgPSBsZXR0ZXJEZWYudjtcblxuICAgICAgICAgICAgbGV0IHB5ID0gbGV0dGVySW5mby55ICsgX2xldHRlck9mZnNldFk7XG5cbiAgICAgICAgICAgIGlmIChfbGFiZWxIZWlnaHQgPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHB5ID4gX3RhaWxvcmVkVG9wWSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2xpcFRvcCA9IHB5IC0gX3RhaWxvcmVkVG9wWTtcbiAgICAgICAgICAgICAgICAgICAgX3RtcFJlY3QueSArPSBjbGlwVG9wO1xuICAgICAgICAgICAgICAgICAgICBfdG1wUmVjdC5oZWlnaHQgLT0gY2xpcFRvcDtcbiAgICAgICAgICAgICAgICAgICAgcHkgPSBweSAtIGNsaXBUb3A7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKChweSAtIGxldHRlckRlZi5oICogX2JtZm9udFNjYWxlIDwgX3RhaWxvcmVkQm90dG9tWSkgJiYgX292ZXJmbG93ID09PSBPdmVyZmxvdy5DTEFNUCkge1xuICAgICAgICAgICAgICAgICAgICBfdG1wUmVjdC5oZWlnaHQgPSAocHkgPCBfdGFpbG9yZWRCb3R0b21ZKSA/IDAgOiAocHkgLSBfdGFpbG9yZWRCb3R0b21ZKSAvIF9ibWZvbnRTY2FsZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBsaW5lSW5kZXggPSBsZXR0ZXJJbmZvLmxpbmU7XG4gICAgICAgICAgICBsZXQgcHggPSBsZXR0ZXJJbmZvLnggKyBsZXR0ZXJEZWYudyAvIDIgKiBfYm1mb250U2NhbGUgKyBfbGluZXNPZmZzZXRYW2xpbmVJbmRleF07XG5cbiAgICAgICAgICAgIGlmIChfbGFiZWxXaWR0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faXNIb3Jpem9udGFsQ2xhbXBlZChweCwgbGluZUluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5DTEFNUCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RtcFJlY3Qud2lkdGggPSAwO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKF9vdmVyZmxvdyA9PT0gT3ZlcmZsb3cuU0hSSU5LKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2NvbnRlbnRTaXplLndpZHRoID4gbGV0dGVyRGVmLncpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RtcFJlY3Qud2lkdGggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX3RtcFJlY3QuaGVpZ2h0ID4gMCAmJiBfdG1wUmVjdC53aWR0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBsZXQgaXNSb3RhdGVkID0gdGhpcy5fZGV0ZXJtaW5lUmVjdChfdG1wUmVjdCk7XG4gICAgICAgICAgICAgICAgbGV0IGxldHRlclBvc2l0aW9uWCA9IGxldHRlckluZm8ueCArIF9saW5lc09mZnNldFhbbGV0dGVySW5mby5saW5lXTtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGVuZFF1YWQoX2NvbXAsIHRleHR1cmUsIF90bXBSZWN0LCBpc1JvdGF0ZWQsIGxldHRlclBvc2l0aW9uWCAtIGFwcHgsIHB5IC0gYXBweSwgX2JtZm9udFNjYWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9xdWFkc1VwZGF0ZWQoX2NvbXApO1xuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgX2RldGVybWluZVJlY3QgKHRlbXBSZWN0KSB7XG4gICAgICAgIGxldCBpc1JvdGF0ZWQgPSBfc3ByaXRlRnJhbWUuaXNSb3RhdGVkKCk7XG5cbiAgICAgICAgbGV0IG9yaWdpbmFsU2l6ZSA9IF9zcHJpdGVGcmFtZS5fb3JpZ2luYWxTaXplO1xuICAgICAgICBsZXQgcmVjdCA9IF9zcHJpdGVGcmFtZS5fcmVjdDtcbiAgICAgICAgbGV0IG9mZnNldCA9IF9zcHJpdGVGcmFtZS5fb2Zmc2V0O1xuICAgICAgICBsZXQgdHJpbW1lZExlZnQgPSBvZmZzZXQueCArIChvcmlnaW5hbFNpemUud2lkdGggLSByZWN0LndpZHRoKSAvIDI7XG4gICAgICAgIGxldCB0cmltbWVkVG9wID0gb2Zmc2V0LnkgLSAob3JpZ2luYWxTaXplLmhlaWdodCAtIHJlY3QuaGVpZ2h0KSAvIDI7XG5cbiAgICAgICAgaWYoIWlzUm90YXRlZCkge1xuICAgICAgICAgICAgdGVtcFJlY3QueCArPSAocmVjdC54IC0gdHJpbW1lZExlZnQpO1xuICAgICAgICAgICAgdGVtcFJlY3QueSArPSAocmVjdC55ICsgdHJpbW1lZFRvcCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgb3JpZ2luYWxYID0gdGVtcFJlY3QueDtcbiAgICAgICAgICAgIHRlbXBSZWN0LnggPSByZWN0LnggKyByZWN0LmhlaWdodCAtIHRlbXBSZWN0LnkgLSB0ZW1wUmVjdC5oZWlnaHQgLSB0cmltbWVkVG9wO1xuICAgICAgICAgICAgdGVtcFJlY3QueSA9IG9yaWdpbmFsWCArIHJlY3QueSAtIHRyaW1tZWRMZWZ0O1xuICAgICAgICAgICAgaWYgKHRlbXBSZWN0LnkgPCAwKSB7XG4gICAgICAgICAgICAgICAgdGVtcFJlY3QuaGVpZ2h0ID0gdGVtcFJlY3QuaGVpZ2h0ICsgdHJpbW1lZFRvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpc1JvdGF0ZWQ7XG4gICAgfVxuXG4gICAgX2NvbXB1dGVBbGlnbm1lbnRPZmZzZXQgKCkge1xuICAgICAgICBfbGluZXNPZmZzZXRYLmxlbmd0aCA9IDA7XG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggKF9oQWxpZ24pIHtcbiAgICAgICAgICAgIGNhc2UgbWFjcm8uVGV4dEFsaWdubWVudC5MRUZUOlxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgX251bWJlck9mTGluZXM7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICBfbGluZXNPZmZzZXRYLnB1c2goMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBtYWNyby5UZXh0QWxpZ25tZW50LkNFTlRFUjpcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IF9saW5lc1dpZHRoLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBfbGluZXNPZmZzZXRYLnB1c2goKF9jb250ZW50U2l6ZS53aWR0aCAtIF9saW5lc1dpZHRoW2ldKSAvIDIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgbWFjcm8uVGV4dEFsaWdubWVudC5SSUdIVDpcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IF9saW5lc1dpZHRoLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBfbGluZXNPZmZzZXRYLnB1c2goX2NvbnRlbnRTaXplLndpZHRoIC0gX2xpbmVzV2lkdGhbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUT1BcbiAgICAgICAgX2xldHRlck9mZnNldFkgPSBfY29udGVudFNpemUuaGVpZ2h0O1xuICAgICAgICBpZiAoX3ZBbGlnbiAhPT0gbWFjcm8uVmVydGljYWxUZXh0QWxpZ25tZW50LlRPUCkge1xuICAgICAgICAgICAgbGV0IGJsYW5rID0gX2NvbnRlbnRTaXplLmhlaWdodCAtIF90ZXh0RGVzaXJlZEhlaWdodCArIF9saW5lSGVpZ2h0ICogdGhpcy5fZ2V0Rm9udFNjYWxlKCkgLSBfb3JpZ2luRm9udFNpemUgKiBfYm1mb250U2NhbGU7XG4gICAgICAgICAgICBpZiAoX3ZBbGlnbiA9PT0gbWFjcm8uVmVydGljYWxUZXh0QWxpZ25tZW50LkJPVFRPTSkge1xuICAgICAgICAgICAgICAgIC8vIEJPVFRPTVxuICAgICAgICAgICAgICAgIF9sZXR0ZXJPZmZzZXRZIC09IGJsYW5rO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBDRU5URVI6XG4gICAgICAgICAgICAgICAgX2xldHRlck9mZnNldFkgLT0gYmxhbmsgLyAyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3NldHVwQk1Gb250T3ZlcmZsb3dNZXRyaWNzICgpIHtcbiAgICAgICAgbGV0IG5ld1dpZHRoID0gX2NvbnRlbnRTaXplLndpZHRoLFxuICAgICAgICAgICAgbmV3SGVpZ2h0ID0gX2NvbnRlbnRTaXplLmhlaWdodDtcblxuICAgICAgICBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5SRVNJWkVfSEVJR0hUKSB7XG4gICAgICAgICAgICBuZXdIZWlnaHQgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF9vdmVyZmxvdyA9PT0gT3ZlcmZsb3cuTk9ORSkge1xuICAgICAgICAgICAgbmV3V2lkdGggPSAwO1xuICAgICAgICAgICAgbmV3SGVpZ2h0ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIF9sYWJlbFdpZHRoID0gbmV3V2lkdGg7XG4gICAgICAgIF9sYWJlbEhlaWdodCA9IG5ld0hlaWdodDtcbiAgICAgICAgX21heExpbmVXaWR0aCA9IG5ld1dpZHRoO1xuICAgIH1cblxuICAgIHVwZGF0ZVdvcmxkVmVydHMoKSB7fVxuXG4gICAgYXBwZW5kUXVhZCAoY29tcCwgdGV4dHVyZSwgcmVjdCwgcm90YXRlZCwgeCwgeSwgc2NhbGUpIHt9XG4gICAgX3F1YWRzVXBkYXRlZCAoY29tcCkge31cblxuICAgIF9yZXNlcnZlUXVhZHMgKCkge31cbn0iXSwic291cmNlUm9vdCI6Ii8ifQ==