
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL3V0aWxzL2xhYmVsL2JtZm9udC5qcyJdLCJuYW1lcyI6WyJ0ZXh0VXRpbHMiLCJyZXF1aXJlIiwibWFjcm8iLCJMYWJlbCIsIk92ZXJmbG93Iiwic2hhcmVMYWJlbEluZm8iLCJMZXR0ZXJJbmZvIiwidmFsaWQiLCJ4IiwieSIsImxpbmUiLCJoYXNoIiwiX3RtcFJlY3QiLCJjYyIsInJlY3QiLCJfY29tcCIsIl9ob3Jpem9udGFsS2VybmluZ3MiLCJfbGV0dGVyc0luZm8iLCJfbGluZXNXaWR0aCIsIl9saW5lc09mZnNldFgiLCJfZm50Q29uZmlnIiwiX251bWJlck9mTGluZXMiLCJfdGV4dERlc2lyZWRIZWlnaHQiLCJfbGV0dGVyT2Zmc2V0WSIsIl90YWlsb3JlZFRvcFkiLCJfdGFpbG9yZWRCb3R0b21ZIiwiX2JtZm9udFNjYWxlIiwiX2xpbmVCcmVha1dpdGhvdXRTcGFjZXMiLCJfc3ByaXRlRnJhbWUiLCJfbGluZVNwYWNpbmciLCJfY29udGVudFNpemUiLCJzaXplIiwiX3N0cmluZyIsIl9mb250U2l6ZSIsIl9vcmlnaW5Gb250U2l6ZSIsIl9oQWxpZ24iLCJfdkFsaWduIiwiX3NwYWNpbmdYIiwiX2xpbmVIZWlnaHQiLCJfb3ZlcmZsb3ciLCJfaXNXcmFwVGV4dCIsIl9sYWJlbFdpZHRoIiwiX2xhYmVsSGVpZ2h0IiwiX21heExpbmVXaWR0aCIsIkJtZm9udEFzc2VtYmxlciIsInVwZGF0ZVJlbmRlckRhdGEiLCJjb21wIiwiX3ZlcnRzRGlydHkiLCJfcmVzZXJ2ZVF1YWRzIiwic3RyaW5nIiwidG9TdHJpbmciLCJsZW5ndGgiLCJfdXBkYXRlRm9udEZhbWlseSIsIl91cGRhdGVQcm9wZXJ0aWVzIiwiX3VwZGF0ZUxhYmVsSW5mbyIsIl91cGRhdGVDb250ZW50IiwidXBkYXRlV29ybGRWZXJ0cyIsIl9hY3R1YWxGb250U2l6ZSIsIm5vZGUiLCJzZXRDb250ZW50U2l6ZSIsIl9yZXNldFByb3BlcnRpZXMiLCJfdXBkYXRlRm9udFNjYWxlIiwiZm9udEFzc2V0IiwiZm9udCIsInNwcml0ZUZyYW1lIiwiZm9udEF0bGFzIiwiX2ZvbnREZWZEaWN0aW9uYXJ5IiwicGFja1RvRHluYW1pY0F0bGFzIiwibWFyZ2luIiwiZm9udFNpemUiLCJob3Jpem9udGFsQWxpZ24iLCJ2ZXJ0aWNhbEFsaWduIiwic3BhY2luZ1giLCJvdmVyZmxvdyIsIndpZHRoIiwiaGVpZ2h0IiwiTk9ORSIsIlJFU0laRV9IRUlHSFQiLCJlbmFibGVXcmFwVGV4dCIsImxpbmVIZWlnaHQiLCJfc2V0dXBCTUZvbnRPdmVyZmxvd01ldHJpY3MiLCJfY29tcHV0ZUhvcml6b250YWxLZXJuaW5nRm9yVGV4dCIsIl9hbGlnblRleHQiLCJzdHJpbmdMZW4iLCJob3Jpem9udGFsS2VybmluZ3MiLCJrZXJuaW5nRGljdCIsImpzIiwiaXNFbXB0eU9iamVjdCIsInByZXYiLCJpIiwia2V5IiwiY2hhckNvZGVBdCIsImtlcm5pbmdBbW91bnQiLCJfbXVsdGlsaW5lVGV4dFdyYXAiLCJuZXh0VG9rZW5GdW5jIiwidGV4dExlbiIsImxpbmVJbmRleCIsIm5leHRUb2tlblgiLCJuZXh0VG9rZW5ZIiwibG9uZ2VzdExpbmUiLCJsZXR0ZXJSaWdodCIsImhpZ2hlc3RZIiwibG93ZXN0WSIsImxldHRlckRlZiIsImxldHRlclBvc2l0aW9uIiwidjIiLCJpbmRleCIsImNoYXJhY3RlciIsImNoYXJBdCIsInB1c2giLCJfZ2V0Rm9udFNjYWxlIiwiX3JlY29yZFBsYWNlaG9sZGVySW5mbyIsInRva2VuTGVuIiwidG9rZW5IaWdoZXN0WSIsInRva2VuTG93ZXN0WSIsInRva2VuUmlnaHQiLCJuZXh0TGV0dGVyWCIsIm5ld0xpbmUiLCJ0bXAiLCJsZXR0ZXJJbmRleCIsImdldExldHRlckRlZmluaXRpb25Gb3JDaGFyIiwiYXRsYXNOYW1lIiwiY29uc29sZSIsImxvZyIsImxldHRlclgiLCJvZmZzZXRYIiwidyIsImlzVW5pY29kZVNwYWNlIiwib2Zmc2V0WSIsIl9yZWNvcmRMZXR0ZXJJbmZvIiwieEFkdmFuY2UiLCJoIiwicGFyc2VGbG9hdCIsInRvRml4ZWQiLCJDTEFNUCIsIl9nZXRGaXJzdENoYXJMZW4iLCJTSFJJTksiLCJfZ2V0Rmlyc3RXb3JkTGVuIiwidGV4dCIsInN0YXJ0SW5kZXgiLCJpc1VuaWNvZGVDSksiLCJsZW4iLCJfbXVsdGlsaW5lVGV4dFdyYXBCeVdvcmQiLCJfbXVsdGlsaW5lVGV4dFdyYXBCeUNoYXIiLCJjaGFyIiwidG1wSW5mbyIsImdldExldHRlciIsIl9jb21wdXRlQWxpZ25tZW50T2Zmc2V0IiwiX2lzVmVydGljYWxDbGFtcCIsIl9zaHJpbmtMYWJlbFRvQ29udGVudFNpemUiLCJfdXBkYXRlUXVhZHMiLCJfaXNIb3Jpem9udGFsQ2xhbXAiLCJfc2NhbGVGb250U2l6ZURvd24iLCJzaG91bGRVcGRhdGVDb250ZW50IiwibGFtYmRhIiwibGVmdCIsInJpZ2h0IiwibWlkIiwibmV3Rm9udFNpemUiLCJhY3R1YWxGb250U2l6ZSIsImxldHRlckNsYW1wIiwiY3RyIiwibCIsImxldHRlckluZm8iLCJweCIsIndvcmRXaWR0aCIsIl9pc0hvcml6b250YWxDbGFtcGVkIiwibGV0dGVyT3ZlckNsYW1wIiwidGV4dHVyZSIsIl90ZXh0dXJlIiwiZ2V0VGV4dHVyZSIsInZlcnRpY2VzQ291bnQiLCJpbmRpY2VzQ291bnQiLCJfcmVuZGVyRGF0YSIsImRhdGFMZW5ndGgiLCJjb250ZW50U2l6ZSIsImFwcHgiLCJfYW5jaG9yUG9pbnQiLCJhcHB5IiwicmV0IiwidSIsInYiLCJweSIsImNsaXBUb3AiLCJpc1JvdGF0ZWQiLCJfZGV0ZXJtaW5lUmVjdCIsImxldHRlclBvc2l0aW9uWCIsImFwcGVuZFF1YWQiLCJfcXVhZHNVcGRhdGVkIiwidGVtcFJlY3QiLCJvcmlnaW5hbFNpemUiLCJfb3JpZ2luYWxTaXplIiwiX3JlY3QiLCJvZmZzZXQiLCJfb2Zmc2V0IiwidHJpbW1lZExlZnQiLCJ0cmltbWVkVG9wIiwib3JpZ2luYWxYIiwiVGV4dEFsaWdubWVudCIsIkxFRlQiLCJDRU5URVIiLCJSSUdIVCIsIlZlcnRpY2FsVGV4dEFsaWdubWVudCIsIlRPUCIsImJsYW5rIiwiQk9UVE9NIiwibmV3V2lkdGgiLCJuZXdIZWlnaHQiLCJyb3RhdGVkIiwic2NhbGUiLCJBc3NlbWJsZXIyRCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTLEdBQUdDLE9BQU8sQ0FBQywyQkFBRCxDQUF6Qjs7QUFDQSxJQUFNQyxLQUFLLEdBQUdELE9BQU8sQ0FBQywyQkFBRCxDQUFyQjs7QUFDQSxJQUFNRSxLQUFLLEdBQUdGLE9BQU8sQ0FBQyw2QkFBRCxDQUFyQjs7QUFDQSxJQUFNRyxRQUFRLEdBQUdELEtBQUssQ0FBQ0MsUUFBdkI7O0FBRUEsSUFBTUMsY0FBYyxHQUFHSixPQUFPLENBQUMsVUFBRCxDQUFQLENBQW9CSSxjQUEzQzs7QUFFQSxJQUFJQyxVQUFVLEdBQUcsU0FBYkEsVUFBYSxHQUFZO0FBQ3pCLGlCQUFZLEVBQVo7QUFDQSxPQUFLQyxLQUFMLEdBQWEsSUFBYjtBQUNBLE9BQUtDLENBQUwsR0FBUyxDQUFUO0FBQ0EsT0FBS0MsQ0FBTCxHQUFTLENBQVQ7QUFDQSxPQUFLQyxJQUFMLEdBQVksQ0FBWjtBQUNBLE9BQUtDLElBQUwsR0FBWSxFQUFaO0FBQ0gsQ0FQRDs7QUFTQSxJQUFJQyxRQUFRLEdBQUdDLEVBQUUsQ0FBQ0MsSUFBSCxFQUFmOztBQUVBLElBQUlDLEtBQUssR0FBRyxJQUFaO0FBRUEsSUFBSUMsbUJBQW1CLEdBQUcsRUFBMUI7QUFDQSxJQUFJQyxZQUFZLEdBQUcsRUFBbkI7QUFDQSxJQUFJQyxXQUFXLEdBQUcsRUFBbEI7QUFDQSxJQUFJQyxhQUFhLEdBQUcsRUFBcEI7QUFFQSxJQUFJQyxVQUFVLEdBQUcsSUFBakI7QUFDQSxJQUFJQyxjQUFjLEdBQUcsQ0FBckI7QUFDQSxJQUFJQyxrQkFBa0IsR0FBRyxDQUF6QjtBQUNBLElBQUlDLGNBQWMsR0FBRyxDQUFyQjtB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KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBBc3NlbWJsZXIyRCBmcm9tICcuLi8uLi9hc3NlbWJsZXItMmQnO1xuXG5jb25zdCB0ZXh0VXRpbHMgPSByZXF1aXJlKCcuLi8uLi8uLi91dGlscy90ZXh0LXV0aWxzJyk7XG5jb25zdCBtYWNybyA9IHJlcXVpcmUoJy4uLy4uLy4uL3BsYXRmb3JtL0NDTWFjcm8nKTtcbmNvbnN0IExhYmVsID0gcmVxdWlyZSgnLi4vLi4vLi4vY29tcG9uZW50cy9DQ0xhYmVsJyk7XG5jb25zdCBPdmVyZmxvdyA9IExhYmVsLk92ZXJmbG93O1xuXG5jb25zdCBzaGFyZUxhYmVsSW5mbyA9IHJlcXVpcmUoJy4uL3V0aWxzJykuc2hhcmVMYWJlbEluZm87XG5cbmxldCBMZXR0ZXJJbmZvID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuY2hhciA9ICcnO1xuICAgIHRoaXMudmFsaWQgPSB0cnVlO1xuICAgIHRoaXMueCA9IDA7XG4gICAgdGhpcy55ID0gMDtcbiAgICB0aGlzLmxpbmUgPSAwO1xuICAgIHRoaXMuaGFzaCA9IFwiXCI7XG59O1xuXG5sZXQgX3RtcFJlY3QgPSBjYy5yZWN0KCk7XG5cbmxldCBfY29tcCA9IG51bGw7XG5cbmxldCBfaG9yaXpvbnRhbEtlcm5pbmdzID0gW107XG5sZXQgX2xldHRlcnNJbmZvID0gW107XG5sZXQgX2xpbmVzV2lkdGggPSBbXTtcbmxldCBfbGluZXNPZmZzZXRYID0gW107XG5cbmxldCBfZm50Q29uZmlnID0gbnVsbDtcbmxldCBfbnVtYmVyT2ZMaW5lcyA9IDA7XG5sZXQgX3RleHREZXNpcmVkSGVpZ2h0ID0gMDtcbmxldCBfbGV0dGVyT2Zmc2V0WSA9IDA7XG5sZXQgX3RhaWxvcmVkVG9wWSA9IDA7XG5cbmxldCBfdGFpbG9yZWRCb3R0b21ZID0gMDtcbmxldCBfYm1mb250U2NhbGUgPSAxLjA7XG5cbmxldCBfbGluZUJyZWFrV2l0aG91dFNwYWNlcyA9IGZhbHNlO1xubGV0IF9zcHJpdGVGcmFtZSA9IG51bGw7XG5sZXQgX2xpbmVTcGFjaW5nID0gMDtcbmxldCBfY29udGVudFNpemUgPSBjYy5zaXplKCk7XG5sZXQgX3N0cmluZyA9ICcnO1xubGV0IF9mb250U2l6ZSA9IDA7XG5sZXQgX29yaWdpbkZvbnRTaXplID0gMDtcbmxldCBfaEFsaWduID0gMDtcbmxldCBfdkFsaWduID0gMDtcbmxldCBfc3BhY2luZ1ggPSAwO1xubGV0IF9saW5lSGVpZ2h0ID0gMDtcbmxldCBfb3ZlcmZsb3cgPSAwO1xubGV0IF9pc1dyYXBUZXh0ID0gZmFsc2U7XG5sZXQgX2xhYmVsV2lkdGggPSAwO1xubGV0IF9sYWJlbEhlaWdodCA9IDA7XG5sZXQgX21heExpbmVXaWR0aCA9IDA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJtZm9udEFzc2VtYmxlciBleHRlbmRzIEFzc2VtYmxlcjJEIHtcbiAgICB1cGRhdGVSZW5kZXJEYXRhKGNvbXApIHtcbiAgICAgICAgaWYgKCFjb21wLl92ZXJ0c0RpcnR5KSByZXR1cm47XG4gICAgICAgIGlmIChfY29tcCA9PT0gY29tcCkgcmV0dXJuO1xuXG4gICAgICAgIF9jb21wID0gY29tcDtcblxuICAgICAgICB0aGlzLl9yZXNlcnZlUXVhZHMoY29tcCwgY29tcC5zdHJpbmcudG9TdHJpbmcoKS5sZW5ndGgpO1xuICAgICAgICB0aGlzLl91cGRhdGVGb250RmFtaWx5KGNvbXApO1xuICAgICAgICB0aGlzLl91cGRhdGVQcm9wZXJ0aWVzKGNvbXApO1xuICAgICAgICB0aGlzLl91cGRhdGVMYWJlbEluZm8oY29tcCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUNvbnRlbnQoKTtcbiAgICAgICAgdGhpcy51cGRhdGVXb3JsZFZlcnRzKGNvbXApO1xuXG4gICAgICAgIF9jb21wLl9hY3R1YWxGb250U2l6ZSA9IF9mb250U2l6ZTtcbiAgICAgICAgX2NvbXAubm9kZS5zZXRDb250ZW50U2l6ZShfY29udGVudFNpemUpO1xuXG4gICAgICAgIF9jb21wLl92ZXJ0c0RpcnR5ID0gZmFsc2U7XG4gICAgICAgIF9jb21wID0gbnVsbDtcbiAgICAgICAgdGhpcy5fcmVzZXRQcm9wZXJ0aWVzKCk7XG4gICAgfVxuXG4gICAgX3VwZGF0ZUZvbnRTY2FsZSgpIHtcbiAgICAgICAgX2JtZm9udFNjYWxlID0gX2ZvbnRTaXplIC8gX29yaWdpbkZvbnRTaXplO1xuICAgIH1cblxuICAgIF91cGRhdGVGb250RmFtaWx5KGNvbXApIHtcbiAgICAgICAgbGV0IGZvbnRBc3NldCA9IGNvbXAuZm9udDtcbiAgICAgICAgX3Nwcml0ZUZyYW1lID0gZm9udEFzc2V0LnNwcml0ZUZyYW1lO1xuICAgICAgICBfZm50Q29uZmlnID0gZm9udEFzc2V0Ll9mbnRDb25maWc7XG4gICAgICAgIHNoYXJlTGFiZWxJbmZvLmZvbnRBdGxhcyA9IGZvbnRBc3NldC5fZm9udERlZkRpY3Rpb25hcnk7XG5cbiAgICAgICAgdGhpcy5wYWNrVG9EeW5hbWljQXRsYXMoY29tcCwgX3Nwcml0ZUZyYW1lKTtcbiAgICB9XG5cbiAgICBfdXBkYXRlTGFiZWxJbmZvKCkge1xuICAgICAgICAvLyBjbGVhclxuICAgICAgICBzaGFyZUxhYmVsSW5mby5oYXNoID0gXCJcIjtcbiAgICAgICAgc2hhcmVMYWJlbEluZm8ubWFyZ2luID0gMDtcbiAgICB9XG5cbiAgICBfdXBkYXRlUHJvcGVydGllcyhjb21wKSB7XG4gICAgICAgIF9zdHJpbmcgPSBjb21wLnN0cmluZy50b1N0cmluZygpO1xuICAgICAgICBfZm9udFNpemUgPSBjb21wLmZvbnRTaXplO1xuICAgICAgICBfb3JpZ2luRm9udFNpemUgPSBfZm50Q29uZmlnID8gX2ZudENvbmZpZy5mb250U2l6ZSA6IGNvbXAuZm9udFNpemU7XG4gICAgICAgIF9oQWxpZ24gPSBjb21wLmhvcml6b250YWxBbGlnbjtcbiAgICAgICAgX3ZBbGlnbiA9IGNvbXAudmVydGljYWxBbGlnbjtcbiAgICAgICAgX3NwYWNpbmdYID0gY29tcC5zcGFjaW5nWDtcbiAgICAgICAgX292ZXJmbG93ID0gY29tcC5vdmVyZmxvdztcbiAgICAgICAgX2xpbmVIZWlnaHQgPSBjb21wLl9saW5lSGVpZ2h0O1xuXG4gICAgICAgIF9jb250ZW50U2l6ZS53aWR0aCA9IGNvbXAubm9kZS53aWR0aDtcbiAgICAgICAgX2NvbnRlbnRTaXplLmhlaWdodCA9IGNvbXAubm9kZS5oZWlnaHQ7XG5cbiAgICAgICAgLy8gc2hvdWxkIHdyYXAgdGV4dFxuICAgICAgICBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5OT05FKSB7XG4gICAgICAgICAgICBfaXNXcmFwVGV4dCA9IGZhbHNlO1xuICAgICAgICAgICAgX2NvbnRlbnRTaXplLndpZHRoICs9IHNoYXJlTGFiZWxJbmZvLm1hcmdpbiAqIDI7XG4gICAgICAgICAgICBfY29udGVudFNpemUuaGVpZ2h0ICs9IHNoYXJlTGFiZWxJbmZvLm1hcmdpbiAqIDI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5SRVNJWkVfSEVJR0hUKSB7XG4gICAgICAgICAgICBfaXNXcmFwVGV4dCA9IHRydWU7XG4gICAgICAgICAgICBfY29udGVudFNpemUuaGVpZ2h0ICs9IHNoYXJlTGFiZWxJbmZvLm1hcmdpbiAqIDI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBfaXNXcmFwVGV4dCA9IGNvbXAuZW5hYmxlV3JhcFRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBzaGFyZUxhYmVsSW5mby5saW5lSGVpZ2h0ID0gX2xpbmVIZWlnaHQ7XG4gICAgICAgIHNoYXJlTGFiZWxJbmZvLmZvbnRTaXplID0gX2ZvbnRTaXplO1xuXG4gICAgICAgIHRoaXMuX3NldHVwQk1Gb250T3ZlcmZsb3dNZXRyaWNzKCk7XG4gICAgfVxuXG4gICAgX3Jlc2V0UHJvcGVydGllcygpIHtcbiAgICAgICAgX2ZudENvbmZpZyA9IG51bGw7XG4gICAgICAgIF9zcHJpdGVGcmFtZSA9IG51bGw7XG4gICAgICAgIHNoYXJlTGFiZWxJbmZvLmhhc2ggPSBcIlwiO1xuICAgICAgICBzaGFyZUxhYmVsSW5mby5tYXJnaW4gPSAwO1xuICAgIH1cblxuICAgIF91cGRhdGVDb250ZW50KCkge1xuICAgICAgICB0aGlzLl91cGRhdGVGb250U2NhbGUoKTtcbiAgICAgICAgdGhpcy5fY29tcHV0ZUhvcml6b250YWxLZXJuaW5nRm9yVGV4dCgpO1xuICAgICAgICB0aGlzLl9hbGlnblRleHQoKTtcbiAgICB9XG5cbiAgICBfY29tcHV0ZUhvcml6b250YWxLZXJuaW5nRm9yVGV4dCgpIHtcbiAgICAgICAgbGV0IHN0cmluZyA9IF9zdHJpbmc7XG4gICAgICAgIGxldCBzdHJpbmdMZW4gPSBzdHJpbmcubGVuZ3RoO1xuXG4gICAgICAgIGxldCBob3Jpem9udGFsS2VybmluZ3MgPSBfaG9yaXpvbnRhbEtlcm5pbmdzO1xuICAgICAgICBsZXQga2VybmluZ0RpY3Q7XG4gICAgICAgIF9mbnRDb25maWcgJiYgKGtlcm5pbmdEaWN0ID0gX2ZudENvbmZpZy5rZXJuaW5nRGljdCk7XG4gICAgICAgIGlmIChrZXJuaW5nRGljdCAmJiAhY2MuanMuaXNFbXB0eU9iamVjdChrZXJuaW5nRGljdCkpIHtcbiAgICAgICAgICAgIGxldCBwcmV2ID0gLTE7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0cmluZ0xlbjsgKytpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGtleSA9IHN0cmluZy5jaGFyQ29kZUF0KGkpO1xuICAgICAgICAgICAgICAgIGxldCBrZXJuaW5nQW1vdW50ID0ga2VybmluZ0RpY3RbKHByZXYgPDwgMTYpIHwgKGtleSAmIDB4ZmZmZildIHx8IDA7XG4gICAgICAgICAgICAgICAgaWYgKGkgPCBzdHJpbmdMZW4gLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGhvcml6b250YWxLZXJuaW5nc1tpXSA9IGtlcm5pbmdBbW91bnQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaG9yaXpvbnRhbEtlcm5pbmdzW2ldID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJldiA9IGtleTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhvcml6b250YWxLZXJuaW5ncy5sZW5ndGggPSAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX211bHRpbGluZVRleHRXcmFwKG5leHRUb2tlbkZ1bmMpIHtcbiAgICAgICAgbGV0IHRleHRMZW4gPSBfc3RyaW5nLmxlbmd0aDtcblxuICAgICAgICBsZXQgbGluZUluZGV4ID0gMDtcbiAgICAgICAgbGV0IG5leHRUb2tlblggPSAwO1xuICAgICAgICBsZXQgbmV4dFRva2VuWSA9IDA7XG4gICAgICAgIGxldCBsb25nZXN0TGluZSA9IDA7XG4gICAgICAgIGxldCBsZXR0ZXJSaWdodCA9IDA7XG5cbiAgICAgICAgbGV0IGhpZ2hlc3RZID0gMDtcbiAgICAgICAgbGV0IGxvd2VzdFkgPSAwO1xuICAgICAgICBsZXQgbGV0dGVyRGVmID0gbnVsbDtcbiAgICAgICAgbGV0IGxldHRlclBvc2l0aW9uID0gY2MudjIoMCwgMCk7XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRleHRMZW47KSB7XG4gICAgICAgICAgICBsZXQgY2hhcmFjdGVyID0gX3N0cmluZy5jaGFyQXQoaW5kZXgpO1xuICAgICAgICAgICAgaWYgKGNoYXJhY3RlciA9PT0gXCJcXG5cIikge1xuICAgICAgICAgICAgICAgIF9saW5lc1dpZHRoLnB1c2gobGV0dGVyUmlnaHQpO1xuICAgICAgICAgICAgICAgIGxldHRlclJpZ2h0ID0gMDtcbiAgICAgICAgICAgICAgICBsaW5lSW5kZXgrKztcbiAgICAgICAgICAgICAgICBuZXh0VG9rZW5YID0gMDtcbiAgICAgICAgICAgICAgICBuZXh0VG9rZW5ZIC09IF9saW5lSGVpZ2h0ICogdGhpcy5fZ2V0Rm9udFNjYWxlKCkgKyBfbGluZVNwYWNpbmc7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjb3JkUGxhY2Vob2xkZXJJbmZvKGluZGV4LCBjaGFyYWN0ZXIpO1xuICAgICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB0b2tlbkxlbiA9IG5leHRUb2tlbkZ1bmMoX3N0cmluZywgaW5kZXgsIHRleHRMZW4pO1xuICAgICAgICAgICAgbGV0IHRva2VuSGlnaGVzdFkgPSBoaWdoZXN0WTtcbiAgICAgICAgICAgIGxldCB0b2tlbkxvd2VzdFkgPSBsb3dlc3RZO1xuICAgICAgICAgICAgbGV0IHRva2VuUmlnaHQgPSBsZXR0ZXJSaWdodDtcbiAgICAgICAgICAgIGxldCBuZXh0TGV0dGVyWCA9IG5leHRUb2tlblg7XG4gICAgICAgICAgICBsZXQgbmV3TGluZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmb3IgKGxldCB0bXAgPSAwOyB0bXAgPCB0b2tlbkxlbjsgKyt0bXApIHtcbiAgICAgICAgICAgICAgICBsZXQgbGV0dGVySW5kZXggPSBpbmRleCArIHRtcDtcbiAgICAgICAgICAgICAgICBjaGFyYWN0ZXIgPSBfc3RyaW5nLmNoYXJBdChsZXR0ZXJJbmRleCk7XG4gICAgICAgICAgICAgICAgaWYgKGNoYXJhY3RlciA9PT0gXCJcXHJcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWNvcmRQbGFjZWhvbGRlckluZm8obGV0dGVySW5kZXgsIGNoYXJhY3Rlcik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXR0ZXJEZWYgPSBzaGFyZUxhYmVsSW5mby5mb250QXRsYXMuZ2V0TGV0dGVyRGVmaW5pdGlvbkZvckNoYXIoY2hhcmFjdGVyLCBzaGFyZUxhYmVsSW5mbyk7XG4gICAgICAgICAgICAgICAgaWYgKCFsZXR0ZXJEZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVjb3JkUGxhY2Vob2xkZXJJbmZvKGxldHRlckluZGV4LCBjaGFyYWN0ZXIpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYXRsYXNOYW1lID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgX2ZudENvbmZpZyAmJiAoYXRsYXNOYW1lID0gX2ZudENvbmZpZy5hdGxhc05hbWUpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNhbid0IGZpbmQgbGV0dGVyIGRlZmluaXRpb24gaW4gdGV4dHVyZSBhdGxhcyBcIiArIGF0bGFzTmFtZSArIFwiIGZvciBsZXR0ZXI6XCIgKyBjaGFyYWN0ZXIpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgbGV0dGVyWCA9IG5leHRMZXR0ZXJYICsgbGV0dGVyRGVmLm9mZnNldFggKiBfYm1mb250U2NhbGUgLSBzaGFyZUxhYmVsSW5mby5tYXJnaW47XG5cbiAgICAgICAgICAgICAgICBpZiAoX2lzV3JhcFRleHRcbiAgICAgICAgICAgICAgICAgICAgJiYgX21heExpbmVXaWR0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgJiYgbmV4dFRva2VuWCA+IDBcbiAgICAgICAgICAgICAgICAgICAgJiYgbGV0dGVyWCArIGxldHRlckRlZi53ICogX2JtZm9udFNjYWxlID4gX21heExpbmVXaWR0aFxuICAgICAgICAgICAgICAgICAgICAmJiAhdGV4dFV0aWxzLmlzVW5pY29kZVNwYWNlKGNoYXJhY3RlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgX2xpbmVzV2lkdGgucHVzaChsZXR0ZXJSaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIGxldHRlclJpZ2h0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgbGluZUluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgIG5leHRUb2tlblggPSAwO1xuICAgICAgICAgICAgICAgICAgICBuZXh0VG9rZW5ZIC09IChfbGluZUhlaWdodCAqIHRoaXMuX2dldEZvbnRTY2FsZSgpICsgX2xpbmVTcGFjaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldHRlclBvc2l0aW9uLnggPSBsZXR0ZXJYO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldHRlclBvc2l0aW9uLnkgPSBuZXh0VG9rZW5ZIC0gbGV0dGVyRGVmLm9mZnNldFkgKiBfYm1mb250U2NhbGUgKyBzaGFyZUxhYmVsSW5mby5tYXJnaW47XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjb3JkTGV0dGVySW5mbyhsZXR0ZXJQb3NpdGlvbiwgY2hhcmFjdGVyLCBsZXR0ZXJJbmRleCwgbGluZUluZGV4KTtcblxuICAgICAgICAgICAgICAgIGlmIChsZXR0ZXJJbmRleCArIDEgPCBfaG9yaXpvbnRhbEtlcm5pbmdzLmxlbmd0aCAmJiBsZXR0ZXJJbmRleCA8IHRleHRMZW4gLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRMZXR0ZXJYICs9IF9ob3Jpem9udGFsS2VybmluZ3NbbGV0dGVySW5kZXggKyAxXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBuZXh0TGV0dGVyWCArPSBsZXR0ZXJEZWYueEFkdmFuY2UgKiBfYm1mb250U2NhbGUgKyBfc3BhY2luZ1ggLSBzaGFyZUxhYmVsSW5mby5tYXJnaW4gKiAyO1xuXG4gICAgICAgICAgICAgICAgdG9rZW5SaWdodCA9IGxldHRlclBvc2l0aW9uLnggKyBsZXR0ZXJEZWYudyAqIF9ibWZvbnRTY2FsZSAtIHNoYXJlTGFiZWxJbmZvLm1hcmdpbjtcblxuICAgICAgICAgICAgICAgIGlmICh0b2tlbkhpZ2hlc3RZIDwgbGV0dGVyUG9zaXRpb24ueSkge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbkhpZ2hlc3RZID0gbGV0dGVyUG9zaXRpb24ueTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodG9rZW5Mb3dlc3RZID4gbGV0dGVyUG9zaXRpb24ueSAtIGxldHRlckRlZi5oICogX2JtZm9udFNjYWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuTG93ZXN0WSA9IGxldHRlclBvc2l0aW9uLnkgLSBsZXR0ZXJEZWYuaCAqIF9ibWZvbnRTY2FsZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gLy9lbmQgb2YgZm9yIGxvb3BcblxuICAgICAgICAgICAgaWYgKG5ld0xpbmUpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBuZXh0VG9rZW5YID0gbmV4dExldHRlclg7XG4gICAgICAgICAgICBsZXR0ZXJSaWdodCA9IHRva2VuUmlnaHQ7XG5cbiAgICAgICAgICAgIGlmIChoaWdoZXN0WSA8IHRva2VuSGlnaGVzdFkpIHtcbiAgICAgICAgICAgICAgICBoaWdoZXN0WSA9IHRva2VuSGlnaGVzdFk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobG93ZXN0WSA+IHRva2VuTG93ZXN0WSkge1xuICAgICAgICAgICAgICAgIGxvd2VzdFkgPSB0b2tlbkxvd2VzdFk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobG9uZ2VzdExpbmUgPCBsZXR0ZXJSaWdodCkge1xuICAgICAgICAgICAgICAgIGxvbmdlc3RMaW5lID0gbGV0dGVyUmlnaHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGluZGV4ICs9IHRva2VuTGVuO1xuICAgICAgICB9IC8vZW5kIG9mIGZvciBsb29wXG5cbiAgICAgICAgX2xpbmVzV2lkdGgucHVzaChsZXR0ZXJSaWdodCk7XG5cbiAgICAgICAgX251bWJlck9mTGluZXMgPSBsaW5lSW5kZXggKyAxO1xuICAgICAgICBfdGV4dERlc2lyZWRIZWlnaHQgPSBfbnVtYmVyT2ZMaW5lcyAqIF9saW5lSGVpZ2h0ICogdGhpcy5fZ2V0Rm9udFNjYWxlKCk7XG4gICAgICAgIGlmIChfbnVtYmVyT2ZMaW5lcyA+IDEpIHtcbiAgICAgICAgICAgIF90ZXh0RGVzaXJlZEhlaWdodCArPSAoX251bWJlck9mTGluZXMgLSAxKSAqIF9saW5lU3BhY2luZztcbiAgICAgICAgfVxuXG4gICAgICAgIF9jb250ZW50U2l6ZS53aWR0aCA9IF9sYWJlbFdpZHRoO1xuICAgICAgICBfY29udGVudFNpemUuaGVpZ2h0ID0gX2xhYmVsSGVpZ2h0O1xuICAgICAgICBpZiAoX2xhYmVsV2lkdGggPD0gMCkge1xuICAgICAgICAgICAgX2NvbnRlbnRTaXplLndpZHRoID0gcGFyc2VGbG9hdChsb25nZXN0TGluZS50b0ZpeGVkKDIpKSArIHNoYXJlTGFiZWxJbmZvLm1hcmdpbiAqIDI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF9sYWJlbEhlaWdodCA8PSAwKSB7XG4gICAgICAgICAgICBfY29udGVudFNpemUuaGVpZ2h0ID0gcGFyc2VGbG9hdChfdGV4dERlc2lyZWRIZWlnaHQudG9GaXhlZCgyKSkgKyBzaGFyZUxhYmVsSW5mby5tYXJnaW4gKiAyO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RhaWxvcmVkVG9wWSA9IF9jb250ZW50U2l6ZS5oZWlnaHQ7XG4gICAgICAgIF90YWlsb3JlZEJvdHRvbVkgPSAwO1xuXG4gICAgICAgIGlmIChfb3ZlcmZsb3cgIT09IE92ZXJmbG93LkNMQU1QKSB7XG4gICAgICAgICAgICBpZiAoaGlnaGVzdFkgPiAwKSB7XG4gICAgICAgICAgICAgICAgX3RhaWxvcmVkVG9wWSA9IF9jb250ZW50U2l6ZS5oZWlnaHQgKyBoaWdoZXN0WTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGxvd2VzdFkgPCAtX3RleHREZXNpcmVkSGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgX3RhaWxvcmVkQm90dG9tWSA9IF90ZXh0RGVzaXJlZEhlaWdodCArIGxvd2VzdFk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBfZ2V0Rmlyc3RDaGFyTGVuKCkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICBfZ2V0Rm9udFNjYWxlKCkge1xuICAgICAgICByZXR1cm4gX292ZXJmbG93ID09PSBPdmVyZmxvdy5TSFJJTksgPyBfYm1mb250U2NhbGUgOiAxO1xuICAgIH1cblxuICAgIF9nZXRGaXJzdFdvcmRMZW4odGV4dCwgc3RhcnRJbmRleCwgdGV4dExlbikge1xuICAgICAgICBsZXQgY2hhcmFjdGVyID0gdGV4dC5jaGFyQXQoc3RhcnRJbmRleCk7XG4gICAgICAgIGlmICh0ZXh0VXRpbHMuaXNVbmljb2RlQ0pLKGNoYXJhY3RlcilcbiAgICAgICAgICAgIHx8IGNoYXJhY3RlciA9PT0gXCJcXG5cIlxuICAgICAgICAgICAgfHwgdGV4dFV0aWxzLmlzVW5pY29kZVNwYWNlKGNoYXJhY3RlcikpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGxlbiA9IDE7XG4gICAgICAgIGxldCBsZXR0ZXJEZWYgPSBzaGFyZUxhYmVsSW5mby5mb250QXRsYXMuZ2V0TGV0dGVyRGVmaW5pdGlvbkZvckNoYXIoY2hhcmFjdGVyLCBzaGFyZUxhYmVsSW5mbyk7XG4gICAgICAgIGlmICghbGV0dGVyRGVmKSB7XG4gICAgICAgICAgICByZXR1cm4gbGVuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBuZXh0TGV0dGVyWCA9IGxldHRlckRlZi54QWR2YW5jZSAqIF9ibWZvbnRTY2FsZSArIF9zcGFjaW5nWDtcbiAgICAgICAgbGV0IGxldHRlclg7XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gc3RhcnRJbmRleCArIDE7IGluZGV4IDwgdGV4dExlbjsgKytpbmRleCkge1xuICAgICAgICAgICAgY2hhcmFjdGVyID0gdGV4dC5jaGFyQXQoaW5kZXgpO1xuXG4gICAgICAgICAgICBsZXR0ZXJEZWYgPSBzaGFyZUxhYmVsSW5mby5mb250QXRsYXMuZ2V0TGV0dGVyRGVmaW5pdGlvbkZvckNoYXIoY2hhcmFjdGVyLCBzaGFyZUxhYmVsSW5mbyk7XG4gICAgICAgICAgICBpZiAoIWxldHRlckRlZikge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0dGVyWCA9IG5leHRMZXR0ZXJYICsgbGV0dGVyRGVmLm9mZnNldFggKiBfYm1mb250U2NhbGU7XG5cbiAgICAgICAgICAgIGlmIChsZXR0ZXJYICsgbGV0dGVyRGVmLncgKiBfYm1mb250U2NhbGUgPiBfbWF4TGluZVdpZHRoXG4gICAgICAgICAgICAgICAgJiYgIXRleHRVdGlscy5pc1VuaWNvZGVTcGFjZShjaGFyYWN0ZXIpXG4gICAgICAgICAgICAgICAgJiYgX21heExpbmVXaWR0aCA+IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV4dExldHRlclggKz0gbGV0dGVyRGVmLnhBZHZhbmNlICogX2JtZm9udFNjYWxlICsgX3NwYWNpbmdYO1xuICAgICAgICAgICAgaWYgKGNoYXJhY3RlciA9PT0gXCJcXG5cIlxuICAgICAgICAgICAgICAgIHx8IHRleHRVdGlscy5pc1VuaWNvZGVTcGFjZShjaGFyYWN0ZXIpXG4gICAgICAgICAgICAgICAgfHwgdGV4dFV0aWxzLmlzVW5pY29kZUNKSyhjaGFyYWN0ZXIpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZW4rKztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsZW47XG4gICAgfVxuXG4gICAgX211bHRpbGluZVRleHRXcmFwQnlXb3JkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbXVsdGlsaW5lVGV4dFdyYXAodGhpcy5fZ2V0Rmlyc3RXb3JkTGVuKTtcbiAgICB9XG5cbiAgICBfbXVsdGlsaW5lVGV4dFdyYXBCeUNoYXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tdWx0aWxpbmVUZXh0V3JhcCh0aGlzLl9nZXRGaXJzdENoYXJMZW4pO1xuICAgIH1cblxuICAgIF9yZWNvcmRQbGFjZWhvbGRlckluZm8obGV0dGVySW5kZXgsIGNoYXIpIHtcbiAgICAgICAgaWYgKGxldHRlckluZGV4ID49IF9sZXR0ZXJzSW5mby5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCB0bXBJbmZvID0gbmV3IExldHRlckluZm8oKTtcbiAgICAgICAgICAgIF9sZXR0ZXJzSW5mby5wdXNoKHRtcEluZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgX2xldHRlcnNJbmZvW2xldHRlckluZGV4XS5jaGFyID0gY2hhcjtcbiAgICAgICAgX2xldHRlcnNJbmZvW2xldHRlckluZGV4XS5oYXNoID0gY2hhci5jaGFyQ29kZUF0KDApICsgc2hhcmVMYWJlbEluZm8uaGFzaDtcbiAgICAgICAgX2xldHRlcnNJbmZvW2xldHRlckluZGV4XS52YWxpZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIF9yZWNvcmRMZXR0ZXJJbmZvKGxldHRlclBvc2l0aW9uLCBjaGFyYWN0ZXIsIGxldHRlckluZGV4LCBsaW5lSW5kZXgpIHtcbiAgICAgICAgaWYgKGxldHRlckluZGV4ID49IF9sZXR0ZXJzSW5mby5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCB0bXBJbmZvID0gbmV3IExldHRlckluZm8oKTtcbiAgICAgICAgICAgIF9sZXR0ZXJzSW5mby5wdXNoKHRtcEluZm8pO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjaGFyID0gY2hhcmFjdGVyLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgIGxldCBrZXkgPSBjaGFyICsgc2hhcmVMYWJlbEluZm8uaGFzaDtcblxuICAgICAgICBfbGV0dGVyc0luZm9bbGV0dGVySW5kZXhdLmxpbmUgPSBsaW5lSW5kZXg7XG4gICAgICAgIF9sZXR0ZXJzSW5mb1tsZXR0ZXJJbmRleF0uY2hhciA9IGNoYXJhY3RlcjtcbiAgICAgICAgX2xldHRlcnNJbmZvW2xldHRlckluZGV4XS5oYXNoID0ga2V5O1xuICAgICAgICBfbGV0dGVyc0luZm9bbGV0dGVySW5kZXhdLnZhbGlkID0gc2hhcmVMYWJlbEluZm8uZm9udEF0bGFzLmdldExldHRlcihrZXkpLnZhbGlkO1xuICAgICAgICBfbGV0dGVyc0luZm9bbGV0dGVySW5kZXhdLnggPSBsZXR0ZXJQb3NpdGlvbi54O1xuICAgICAgICBfbGV0dGVyc0luZm9bbGV0dGVySW5kZXhdLnkgPSBsZXR0ZXJQb3NpdGlvbi55O1xuICAgIH1cblxuICAgIF9hbGlnblRleHQoKSB7XG4gICAgICAgIF90ZXh0RGVzaXJlZEhlaWdodCA9IDA7XG4gICAgICAgIF9saW5lc1dpZHRoLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgaWYgKCFfbGluZUJyZWFrV2l0aG91dFNwYWNlcykge1xuICAgICAgICAgICAgdGhpcy5fbXVsdGlsaW5lVGV4dFdyYXBCeVdvcmQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX211bHRpbGluZVRleHRXcmFwQnlDaGFyKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jb21wdXRlQWxpZ25tZW50T2Zmc2V0KCk7XG5cbiAgICAgICAgLy9zaHJpbmtcbiAgICAgICAgaWYgKF9vdmVyZmxvdyA9PT0gT3ZlcmZsb3cuU0hSSU5LKSB7XG4gICAgICAgICAgICBpZiAoX2ZvbnRTaXplID4gMCAmJiB0aGlzLl9pc1ZlcnRpY2FsQ2xhbXAoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Nocmlua0xhYmVsVG9Db250ZW50U2l6ZSh0aGlzLl9pc1ZlcnRpY2FsQ2xhbXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLl91cGRhdGVRdWFkcygpKSB7XG4gICAgICAgICAgICBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5TSFJJTkspIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zaHJpbmtMYWJlbFRvQ29udGVudFNpemUodGhpcy5faXNIb3Jpem9udGFsQ2xhbXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3NjYWxlRm9udFNpemVEb3duKGZvbnRTaXplKSB7XG4gICAgICAgIGxldCBzaG91bGRVcGRhdGVDb250ZW50ID0gdHJ1ZTtcbiAgICAgICAgaWYgKCFmb250U2l6ZSkge1xuICAgICAgICAgICAgZm9udFNpemUgPSAwLjE7XG4gICAgICAgICAgICBzaG91bGRVcGRhdGVDb250ZW50ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgX2ZvbnRTaXplID0gZm9udFNpemU7XG5cbiAgICAgICAgaWYgKHNob3VsZFVwZGF0ZUNvbnRlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUNvbnRlbnQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9zaHJpbmtMYWJlbFRvQ29udGVudFNpemUobGFtYmRhKSB7XG4gICAgICAgIGxldCBmb250U2l6ZSA9IF9mb250U2l6ZTtcblxuICAgICAgICBsZXQgbGVmdCA9IDAsIHJpZ2h0ID0gZm9udFNpemUgfCAwLCBtaWQgPSAwO1xuICAgICAgICB3aGlsZSAobGVmdCA8IHJpZ2h0KSB7XG4gICAgICAgICAgICBtaWQgPSAobGVmdCArIHJpZ2h0ICsgMSkgPj4gMTtcblxuICAgICAgICAgICAgbGV0IG5ld0ZvbnRTaXplID0gbWlkO1xuICAgICAgICAgICAgaWYgKG5ld0ZvbnRTaXplIDw9IDApIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX2JtZm9udFNjYWxlID0gbmV3Rm9udFNpemUgLyBfb3JpZ2luRm9udFNpemU7XG5cbiAgICAgICAgICAgIGlmICghX2xpbmVCcmVha1dpdGhvdXRTcGFjZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tdWx0aWxpbmVUZXh0V3JhcEJ5V29yZCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tdWx0aWxpbmVUZXh0V3JhcEJ5Q2hhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fY29tcHV0ZUFsaWdubWVudE9mZnNldCgpO1xuXG4gICAgICAgICAgICBpZiAobGFtYmRhKCkpIHtcbiAgICAgICAgICAgICAgICByaWdodCA9IG1pZCAtIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxlZnQgPSBtaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYWN0dWFsRm9udFNpemUgPSBsZWZ0O1xuICAgICAgICBpZiAoYWN0dWFsRm9udFNpemUgPj0gMCkge1xuICAgICAgICAgICAgdGhpcy5fc2NhbGVGb250U2l6ZURvd24oYWN0dWFsRm9udFNpemUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2lzVmVydGljYWxDbGFtcCgpIHtcbiAgICAgICAgaWYgKF90ZXh0RGVzaXJlZEhlaWdodCA+IF9jb250ZW50U2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2lzSG9yaXpvbnRhbENsYW1wKCkge1xuICAgICAgICBsZXQgbGV0dGVyQ2xhbXAgPSBmYWxzZTtcbiAgICAgICAgZm9yIChsZXQgY3RyID0gMCwgbCA9IF9zdHJpbmcubGVuZ3RoOyBjdHIgPCBsOyArK2N0cikge1xuICAgICAgICAgICAgbGV0IGxldHRlckluZm8gPSBfbGV0dGVyc0luZm9bY3RyXTtcbiAgICAgICAgICAgIGlmIChsZXR0ZXJJbmZvLnZhbGlkKSB7XG4gICAgICAgICAgICAgICAgbGV0IGxldHRlckRlZiA9IHNoYXJlTGFiZWxJbmZvLmZvbnRBdGxhcy5nZXRMZXR0ZXIobGV0dGVySW5mby5oYXNoKTtcblxuICAgICAgICAgICAgICAgIGxldCBweCA9IGxldHRlckluZm8ueCArIGxldHRlckRlZi53ICogX2JtZm9udFNjYWxlO1xuICAgICAgICAgICAgICAgIGxldCBsaW5lSW5kZXggPSBsZXR0ZXJJbmZvLmxpbmU7XG4gICAgICAgICAgICAgICAgaWYgKF9sYWJlbFdpZHRoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIV9pc1dyYXBUZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHggPiBfY29udGVudFNpemUud2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJDbGFtcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgd29yZFdpZHRoID0gX2xpbmVzV2lkdGhbbGluZUluZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3b3JkV2lkdGggPiBfY29udGVudFNpemUud2lkdGggJiYgKHB4ID4gX2NvbnRlbnRTaXplLndpZHRoIHx8IHB4IDwgMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJDbGFtcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGV0dGVyQ2xhbXA7XG4gICAgfVxuXG4gICAgX2lzSG9yaXpvbnRhbENsYW1wZWQocHgsIGxpbmVJbmRleCkge1xuICAgICAgICBsZXQgd29yZFdpZHRoID0gX2xpbmVzV2lkdGhbbGluZUluZGV4XTtcbiAgICAgICAgbGV0IGxldHRlck92ZXJDbGFtcCA9IChweCA+IF9jb250ZW50U2l6ZS53aWR0aCB8fCBweCA8IDApO1xuXG4gICAgICAgIGlmICghX2lzV3JhcFRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiBsZXR0ZXJPdmVyQ2xhbXA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKHdvcmRXaWR0aCA+IF9jb250ZW50U2l6ZS53aWR0aCAmJiBsZXR0ZXJPdmVyQ2xhbXApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3VwZGF0ZVF1YWRzKCkge1xuICAgICAgICBsZXQgdGV4dHVyZSA9IF9zcHJpdGVGcmFtZSA/IF9zcHJpdGVGcmFtZS5fdGV4dHVyZSA6IHNoYXJlTGFiZWxJbmZvLmZvbnRBdGxhcy5nZXRUZXh0dXJlKCk7XG5cbiAgICAgICAgbGV0IG5vZGUgPSBfY29tcC5ub2RlO1xuXG4gICAgICAgIHRoaXMudmVydGljZXNDb3VudCA9IHRoaXMuaW5kaWNlc0NvdW50ID0gMDtcblxuICAgICAgICAvLyBOZWVkIHRvIHJlc2V0IGRhdGFMZW5ndGggaW4gQ2FudmFzIHJlbmRlcmluZyBtb2RlLlxuICAgICAgICB0aGlzLl9yZW5kZXJEYXRhICYmICh0aGlzLl9yZW5kZXJEYXRhLmRhdGFMZW5ndGggPSAwKTtcblxuICAgICAgICBsZXQgY29udGVudFNpemUgPSBfY29udGVudFNpemUsXG4gICAgICAgICAgICBhcHB4ID0gbm9kZS5fYW5jaG9yUG9pbnQueCAqIGNvbnRlbnRTaXplLndpZHRoLFxuICAgICAgICAgICAgYXBweSA9IG5vZGUuX2FuY2hvclBvaW50LnkgKiBjb250ZW50U2l6ZS5oZWlnaHQ7XG5cbiAgICAgICAgbGV0IHJldCA9IHRydWU7XG4gICAgICAgIGZvciAobGV0IGN0ciA9IDAsIGwgPSBfc3RyaW5nLmxlbmd0aDsgY3RyIDwgbDsgKytjdHIpIHtcbiAgICAgICAgICAgIGxldCBsZXR0ZXJJbmZvID0gX2xldHRlcnNJbmZvW2N0cl07XG4gICAgICAgICAgICBpZiAoIWxldHRlckluZm8udmFsaWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgbGV0IGxldHRlckRlZiA9IHNoYXJlTGFiZWxJbmZvLmZvbnRBdGxhcy5nZXRMZXR0ZXIobGV0dGVySW5mby5oYXNoKTtcblxuICAgICAgICAgICAgX3RtcFJlY3QuaGVpZ2h0ID0gbGV0dGVyRGVmLmg7XG4gICAgICAgICAgICBfdG1wUmVjdC53aWR0aCA9IGxldHRlckRlZi53O1xuICAgICAgICAgICAgX3RtcFJlY3QueCA9IGxldHRlckRlZi51O1xuICAgICAgICAgICAgX3RtcFJlY3QueSA9IGxldHRlckRlZi52O1xuXG4gICAgICAgICAgICBsZXQgcHkgPSBsZXR0ZXJJbmZvLnkgKyBfbGV0dGVyT2Zmc2V0WTtcblxuICAgICAgICAgICAgaWYgKF9sYWJlbEhlaWdodCA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAocHkgPiBfdGFpbG9yZWRUb3BZKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjbGlwVG9wID0gcHkgLSBfdGFpbG9yZWRUb3BZO1xuICAgICAgICAgICAgICAgICAgICBfdG1wUmVjdC55ICs9IGNsaXBUb3A7XG4gICAgICAgICAgICAgICAgICAgIF90bXBSZWN0LmhlaWdodCAtPSBjbGlwVG9wO1xuICAgICAgICAgICAgICAgICAgICBweSA9IHB5IC0gY2xpcFRvcDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoKHB5IC0gbGV0dGVyRGVmLmggKiBfYm1mb250U2NhbGUgPCBfdGFpbG9yZWRCb3R0b21ZKSAmJiBfb3ZlcmZsb3cgPT09IE92ZXJmbG93LkNMQU1QKSB7XG4gICAgICAgICAgICAgICAgICAgIF90bXBSZWN0LmhlaWdodCA9IChweSA8IF90YWlsb3JlZEJvdHRvbVkpID8gMCA6IChweSAtIF90YWlsb3JlZEJvdHRvbVkpIC8gX2JtZm9udFNjYWxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGxpbmVJbmRleCA9IGxldHRlckluZm8ubGluZTtcbiAgICAgICAgICAgIGxldCBweCA9IGxldHRlckluZm8ueCArIGxldHRlckRlZi53IC8gMiAqIF9ibWZvbnRTY2FsZSArIF9saW5lc09mZnNldFhbbGluZUluZGV4XTtcblxuICAgICAgICAgICAgaWYgKF9sYWJlbFdpZHRoID4gMCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pc0hvcml6b250YWxDbGFtcGVkKHB4LCBsaW5lSW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfb3ZlcmZsb3cgPT09IE92ZXJmbG93LkNMQU1QKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdG1wUmVjdC53aWR0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5TSFJJTkspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfY29udGVudFNpemUud2lkdGggPiBsZXR0ZXJEZWYudykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdG1wUmVjdC53aWR0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfdG1wUmVjdC5oZWlnaHQgPiAwICYmIF90bXBSZWN0LndpZHRoID4gMCkge1xuICAgICAgICAgICAgICAgIGxldCBpc1JvdGF0ZWQgPSB0aGlzLl9kZXRlcm1pbmVSZWN0KF90bXBSZWN0KTtcbiAgICAgICAgICAgICAgICBsZXQgbGV0dGVyUG9zaXRpb25YID0gbGV0dGVySW5mby54ICsgX2xpbmVzT2Zmc2V0WFtsZXR0ZXJJbmZvLmxpbmVdO1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kUXVhZChfY29tcCwgdGV4dHVyZSwgX3RtcFJlY3QsIGlzUm90YXRlZCwgbGV0dGVyUG9zaXRpb25YIC0gYXBweCwgcHkgLSBhcHB5LCBfYm1mb250U2NhbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3F1YWRzVXBkYXRlZChfY29tcCk7XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBfZGV0ZXJtaW5lUmVjdCh0ZW1wUmVjdCkge1xuICAgICAgICBsZXQgaXNSb3RhdGVkID0gX3Nwcml0ZUZyYW1lLmlzUm90YXRlZCgpO1xuXG4gICAgICAgIGxldCBvcmlnaW5hbFNpemUgPSBfc3ByaXRlRnJhbWUuX29yaWdpbmFsU2l6ZTtcbiAgICAgICAgbGV0IHJlY3QgPSBfc3ByaXRlRnJhbWUuX3JlY3Q7XG4gICAgICAgIGxldCBvZmZzZXQgPSBfc3ByaXRlRnJhbWUuX29mZnNldDtcbiAgICAgICAgbGV0IHRyaW1tZWRMZWZ0ID0gb2Zmc2V0LnggKyAob3JpZ2luYWxTaXplLndpZHRoIC0gcmVjdC53aWR0aCkgLyAyO1xuICAgICAgICBsZXQgdHJpbW1lZFRvcCA9IG9mZnNldC55IC0gKG9yaWdpbmFsU2l6ZS5oZWlnaHQgLSByZWN0LmhlaWdodCkgLyAyO1xuXG4gICAgICAgIGlmICghaXNSb3RhdGVkKSB7XG4gICAgICAgICAgICB0ZW1wUmVjdC54ICs9IChyZWN0LnggLSB0cmltbWVkTGVmdCk7XG4gICAgICAgICAgICB0ZW1wUmVjdC55ICs9IChyZWN0LnkgKyB0cmltbWVkVG9wKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBvcmlnaW5hbFggPSB0ZW1wUmVjdC54O1xuICAgICAgICAgICAgdGVtcFJlY3QueCA9IHJlY3QueCArIHJlY3QuaGVpZ2h0IC0gdGVtcFJlY3QueSAtIHRlbXBSZWN0LmhlaWdodCAtIHRyaW1tZWRUb3A7XG4gICAgICAgICAgICB0ZW1wUmVjdC55ID0gb3JpZ2luYWxYICsgcmVjdC55IC0gdHJpbW1lZExlZnQ7XG4gICAgICAgICAgICBpZiAodGVtcFJlY3QueSA8IDApIHtcbiAgICAgICAgICAgICAgICB0ZW1wUmVjdC5oZWlnaHQgPSB0ZW1wUmVjdC5oZWlnaHQgKyB0cmltbWVkVG9wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzUm90YXRlZDtcbiAgICB9XG5cbiAgICBfY29tcHV0ZUFsaWdubWVudE9mZnNldCgpIHtcbiAgICAgICAgX2xpbmVzT2Zmc2V0WC5sZW5ndGggPSAwO1xuXG4gICAgICAgIHN3aXRjaCAoX2hBbGlnbikge1xuICAgICAgICAgICAgY2FzZSBtYWNyby5UZXh0QWxpZ25tZW50LkxFRlQ6XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfbnVtYmVyT2ZMaW5lczsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIF9saW5lc09mZnNldFgucHVzaCgwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIG1hY3JvLlRleHRBbGlnbm1lbnQuQ0VOVEVSOlxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gX2xpbmVzV2lkdGgubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIF9saW5lc09mZnNldFgucHVzaCgoX2NvbnRlbnRTaXplLndpZHRoIC0gX2xpbmVzV2lkdGhbaV0pIC8gMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBtYWNyby5UZXh0QWxpZ25tZW50LlJJR0hUOlxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gX2xpbmVzV2lkdGgubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIF9saW5lc09mZnNldFgucHVzaChfY29udGVudFNpemUud2lkdGggLSBfbGluZXNXaWR0aFtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPUFxuICAgICAgICBfbGV0dGVyT2Zmc2V0WSA9IF9jb250ZW50U2l6ZS5oZWlnaHQ7XG4gICAgICAgIGlmIChfdkFsaWduICE9PSBtYWNyby5WZXJ0aWNhbFRleHRBbGlnbm1lbnQuVE9QKSB7XG4gICAgICAgICAgICBsZXQgYmxhbmsgPSBfY29udGVudFNpemUuaGVpZ2h0IC0gX3RleHREZXNpcmVkSGVpZ2h0ICsgX2xpbmVIZWlnaHQgKiB0aGlzLl9nZXRGb250U2NhbGUoKSAtIF9vcmlnaW5Gb250U2l6ZSAqIF9ibWZvbnRTY2FsZTtcbiAgICAgICAgICAgIGlmIChfdkFsaWduID09PSBtYWNyby5WZXJ0aWNhbFRleHRBbGlnbm1lbnQuQk9UVE9NKSB7XG4gICAgICAgICAgICAgICAgLy8gQk9UVE9NXG4gICAgICAgICAgICAgICAgX2xldHRlck9mZnNldFkgLT0gYmxhbms7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIENFTlRFUjpcbiAgICAgICAgICAgICAgICBfbGV0dGVyT2Zmc2V0WSAtPSBibGFuayAvIDI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfc2V0dXBCTUZvbnRPdmVyZmxvd01ldHJpY3MoKSB7XG4gICAgICAgIGxldCBuZXdXaWR0aCA9IF9jb250ZW50U2l6ZS53aWR0aCxcbiAgICAgICAgICAgIG5ld0hlaWdodCA9IF9jb250ZW50U2l6ZS5oZWlnaHQ7XG5cbiAgICAgICAgaWYgKF9vdmVyZmxvdyA9PT0gT3ZlcmZsb3cuUkVTSVpFX0hFSUdIVCkge1xuICAgICAgICAgICAgbmV3SGVpZ2h0ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfb3ZlcmZsb3cgPT09IE92ZXJmbG93Lk5PTkUpIHtcbiAgICAgICAgICAgIG5ld1dpZHRoID0gMDtcbiAgICAgICAgICAgIG5ld0hlaWdodCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBfbGFiZWxXaWR0aCA9IG5ld1dpZHRoO1xuICAgICAgICBfbGFiZWxIZWlnaHQgPSBuZXdIZWlnaHQ7XG4gICAgICAgIF9tYXhMaW5lV2lkdGggPSBuZXdXaWR0aDtcbiAgICB9XG5cbiAgICB1cGRhdGVXb3JsZFZlcnRzKCkgeyB9XG5cbiAgICBhcHBlbmRRdWFkKGNvbXAsIHRleHR1cmUsIHJlY3QsIHJvdGF0ZWQsIHgsIHksIHNjYWxlKSB7IH1cbiAgICBfcXVhZHNVcGRhdGVkKGNvbXApIHsgfVxuXG4gICAgX3Jlc2VydmVRdWFkcygpIHsgfVxufSJdLCJzb3VyY2VSb290IjoiLyJ9