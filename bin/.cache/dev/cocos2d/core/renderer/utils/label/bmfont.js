
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

var emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

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
    var emojisMap = {};

    _string.replace(emojiRegex, function (match, index) {
      return emojisMap[index] = match;
    });

    for (var index = 0; index < textLen;) {
      var character = emojisMap[index] || _string.charAt(index);

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

      var tokenLen = nextTokenFunc(_string, index, textLen, !!emojisMap[index]);
      var tokenHighestY = highestY;
      var tokenLowestY = lowestY;
      var tokenRight = letterRight;
      var nextLetterX = nextTokenX;
      var newLine = false;

      for (var tmp = 0; tmp < tokenLen; ++tmp) {
        var letterIndex = index + tmp;
        character = emojisMap[letterIndex] || _string.charAt(letterIndex);

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

      if (emojisMap[index]) {
        var v = _lettersInfo[index + 1];
        if (v) v.valid = false;
        index += 2;
      } else {
        index += tokenLen;
      }
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

  _proto._getFirstWordLen = function _getFirstWordLen(text, startIndex, textLen, isEmoji) {
    if (isEmoji) return 1;
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
    _lettersInfo[letterIndex].hash = _char.codePointAt() + shareLabelInfo.hash;
    _lettersInfo[letterIndex].valid = false;
  };

  _proto._recordLetterInfo = function _recordLetterInfo(letterPosition, character, letterIndex, lineIndex) {
    if (letterIndex >= _lettersInfo.length) {
      var tmpInfo = new LetterInfo();

      _lettersInfo.push(tmpInfo);
    }

    var key = character.codePointAt() + shareLabelInfo.hash;
    _lettersInfo[letterIndex].line = lineIndex;
    _lettersInfo[letterIndex]["char"] = character;
    _lettersInfo[letterIndex].hash = key;
    var letter = shareLabelInfo.fontAtlas.getLetter(key);
    _lettersInfo[letterIndex].valid = letter ? letter.valid : false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL3V0aWxzL2xhYmVsL2JtZm9udC5qcyJdLCJuYW1lcyI6WyJ0ZXh0VXRpbHMiLCJyZXF1aXJlIiwibWFjcm8iLCJMYWJlbCIsIk92ZXJmbG93Iiwic2hhcmVMYWJlbEluZm8iLCJlbW9qaVJlZ2V4IiwiTGV0dGVySW5mbyIsInZhbGlkIiwieCIsInkiLCJsaW5lIiwiaGFzaCIsIl90bXBSZWN0IiwiY2MiLCJyZWN0IiwiX2NvbXAiLCJfaG9yaXpvbnRhbEtlcm5pbmdzIiwiX2xldHRlcnNJbmZvIiwiX2xpbmVzV2lkdGgiLCJfbGluZXNPZmZzZXRYIiwiX2ZudENvbmZpZyIsIl9udW1iZXJPZkxpbmVzIiwiX3RleHREZXNpcmVkSGVpZ2h0IiwiX2xldHRlck9mZnNldFkiLCJfdGFpbG9yZWRUb3BZIiwiX3RhaWxvcmVkQm90dG9tWSIsIl9ibWZvbnRTY2FsZSIsIl9saW5lQnJlYWtXaXRob3V0U3BhY2VzIiwiX3Nwcml0ZUZyYW1lIiwiX2xpbmVTcGFjaW5nIiwiX2NvbnRlbnRTaXplIiwic2l6ZSIsIl9zdHJpbmciLCJfZm9udFNpemUiLCJfb3JpZ2luRm9udFNpemUiLCJfaEFsaWduIiwiX3ZBbGlnbiIsIl9zcGFjaW5nWCIsIl9saW5lSGVpZ2h0IiwiX292ZXJmbG93IiwiX2lzV3JhcFRleHQiLCJfbGFiZWxXaWR0aCIsIl9sYWJlbEhlaWdodCIsIl9tYXhMaW5lV2lkdGgiLCJCbWZvbnRBc3NlbWJsZXIiLCJ1cGRhdGVSZW5kZXJEYXRhIiwiY29tcCIsIl92ZXJ0c0RpcnR5IiwiX3Jlc2VydmVRdWFkcyIsInN0cmluZyIsInRvU3RyaW5nIiwibGVuZ3RoIiwiX3VwZGF0ZUZvbnRGYW1pbHkiLCJfdXBkYXRlUHJvcGVydGllcyIsIl91cGRhdGVMYWJlbEluZm8iLCJfdXBkYXRlQ29udGVudCIsInVwZGF0ZVdvcmxkVmVydHMiLCJfYWN0dWFsRm9udFNpemUiLCJub2RlIiwic2V0Q29udGVudFNpemUiLCJfcmVzZXRQcm9wZXJ0aWVzIiwiX3VwZGF0ZUZvbnRTY2FsZSIsImZvbnRBc3NldCIsImZvbnQiLCJzcHJpdGVGcmFtZSIsImZvbnRBdGxhcyIsIl9mb250RGVmRGljdGlvbmFyeSIsInBhY2tUb0R5bmFtaWNBdGxhcyIsIm1hcmdpbiIsImZvbnRTaXplIiwiaG9yaXpvbnRhbEFsaWduIiwidmVydGljYWxBbGlnbiIsInNwYWNpbmdYIiwib3ZlcmZsb3ciLCJ3aWR0aCIsImhlaWdodCIsIk5PTkUiLCJSRVNJWkVfSEVJR0hUIiwiZW5hYmxlV3JhcFRleHQiLCJsaW5lSGVpZ2h0IiwiX3NldHVwQk1Gb250T3ZlcmZsb3dNZXRyaWNzIiwiX2NvbXB1dGVIb3Jpem9udGFsS2VybmluZ0ZvclRleHQiLCJfYWxpZ25UZXh0Iiwic3RyaW5nTGVuIiwiaG9yaXpvbnRhbEtlcm5pbmdzIiwia2VybmluZ0RpY3QiLCJqcyIsImlzRW1wdHlPYmplY3QiLCJwcmV2IiwiaSIsImtleSIsImNoYXJDb2RlQXQiLCJrZXJuaW5nQW1vdW50IiwiX211bHRpbGluZVRleHRXcmFwIiwibmV4dFRva2VuRnVuYyIsInRleHRMZW4iLCJsaW5lSW5kZXgiLCJuZXh0VG9rZW5YIiwibmV4dFRva2VuWSIsImxvbmdlc3RMaW5lIiwibGV0dGVyUmlnaHQiLCJoaWdoZXN0WSIsImxvd2VzdFkiLCJsZXR0ZXJEZWYiLCJsZXR0ZXJQb3NpdGlvbiIsInYyIiwiZW1vamlzTWFwIiwicmVwbGFjZSIsIm1hdGNoIiwiaW5kZXgiLCJjaGFyYWN0ZXIiLCJjaGFyQXQiLCJwdXNoIiwiX2dldEZvbnRTY2FsZSIsIl9yZWNvcmRQbGFjZWhvbGRlckluZm8iLCJ0b2tlbkxlbiIsInRva2VuSGlnaGVzdFkiLCJ0b2tlbkxvd2VzdFkiLCJ0b2tlblJpZ2h0IiwibmV4dExldHRlclgiLCJuZXdMaW5lIiwidG1wIiwibGV0dGVySW5kZXgiLCJnZXRMZXR0ZXJEZWZpbml0aW9uRm9yQ2hhciIsImF0bGFzTmFtZSIsImNvbnNvbGUiLCJsb2ciLCJsZXR0ZXJYIiwib2Zmc2V0WCIsInciLCJpc1VuaWNvZGVTcGFjZSIsIm9mZnNldFkiLCJfcmVjb3JkTGV0dGVySW5mbyIsInhBZHZhbmNlIiwiaCIsInYiLCJwYXJzZUZsb2F0IiwidG9GaXhlZCIsIkNMQU1QIiwiX2dldEZpcnN0Q2hhckxlbiIsIlNIUklOSyIsIl9nZXRGaXJzdFdvcmRMZW4iLCJ0ZXh0Iiwic3RhcnRJbmRleCIsImlzRW1vamkiLCJpc1VuaWNvZGVDSksiLCJsZW4iLCJfbXVsdGlsaW5lVGV4dFdyYXBCeVdvcmQiLCJfbXVsdGlsaW5lVGV4dFdyYXBCeUNoYXIiLCJjaGFyIiwidG1wSW5mbyIsImNvZGVQb2ludEF0IiwibGV0dGVyIiwiZ2V0TGV0dGVyIiwiX2NvbXB1dGVBbGlnbm1lbnRPZmZzZXQiLCJfaXNWZXJ0aWNhbENsYW1wIiwiX3Nocmlua0xhYmVsVG9Db250ZW50U2l6ZSIsIl91cGRhdGVRdWFkcyIsIl9pc0hvcml6b250YWxDbGFtcCIsIl9zY2FsZUZvbnRTaXplRG93biIsInNob3VsZFVwZGF0ZUNvbnRlbnQiLCJsYW1iZGEiLCJsZWZ0IiwicmlnaHQiLCJtaWQiLCJuZXdGb250U2l6ZSIsImFjdHVhbEZvbnRTaXplIiwibGV0dGVyQ2xhbXAiLCJjdHIiLCJsIiwibGV0dGVySW5mbyIsInB4Iiwid29yZFdpZHRoIiwiX2lzSG9yaXpvbnRhbENsYW1wZWQiLCJsZXR0ZXJPdmVyQ2xhbXAiLCJ0ZXh0dXJlIiwiX3RleHR1cmUiLCJnZXRUZXh0dXJlIiwidmVydGljZXNDb3VudCIsImluZGljZXNDb3VudCIsIl9yZW5kZXJEYXRhIiwiZGF0YUxlbmd0aCIsImNvbnRlbnRTaXplIiwiYXBweCIsIl9hbmNob3JQb2ludCIsImFwcHkiLCJyZXQiLCJ1IiwicHkiLCJjbGlwVG9wIiwiaXNSb3RhdGVkIiwiX2RldGVybWluZVJlY3QiLCJsZXR0ZXJQb3NpdGlvblgiLCJhcHBlbmRRdWFkIiwiX3F1YWRzVXBkYXRlZCIsInRlbXBSZWN0Iiwib3JpZ2luYWxTaXplIiwiX29yaWdpbmFsU2l6ZSIsIl9yZWN0Iiwib2Zmc2V0IiwiX29mZnNldCIsInRyaW1tZWRMZWZ0IiwidHJpbW1lZFRvcCIsIm9yaWdpbmFsWCIsIlRleHRBbGlnbm1lbnQiLCJMRUZUIiwiQ0VOVEVSIiwiUklHSFQiLCJWZXJ0aWNhbFRleHRBbGlnbm1lbnQiLCJUT1AiLCJibGFuayIsIkJPVFRPTSIsIm5ld1dpZHRoIiwibmV3SGVpZ2h0Iiwicm90YXRlZCIsInNjYWxlIiwiQXNzZW1ibGVyMkQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7Ozs7Ozs7O0FBRUEsSUFBTUEsU0FBUyxHQUFHQyxPQUFPLENBQUMsMkJBQUQsQ0FBekI7O0FBQ0EsSUFBTUMsS0FBSyxHQUFHRCxPQUFPLENBQUMsMkJBQUQsQ0FBckI7O0FBQ0EsSUFBTUUsS0FBSyxHQUFHRixPQUFPLENBQUMsNkJBQUQsQ0FBckI7O0FBQ0EsSUFBTUcsUUFBUSxHQUFHRCxLQUFLLENBQUNDLFFBQXZCOztBQUVBLElBQU1DLGNBQWMsR0FBR0osT0FBTyxDQUFDLFVBQUQsQ0FBUCxDQUFvQkksY0FBM0M7O0FBR0EsSUFBTUMsVUFBVSxHQUFHLGlDQUFuQjs7QUFFQSxJQUFJQyxVQUFVLEdBQUcsU0FBYkEsVUFBYSxHQUFZO0FBQ3pCLGlCQUFZLEVBQVo7QUFDQSxPQUFLQyxLQUFMLEdBQWEsSUFBYjtBQUNBLE9BQUtDLENBQUwsR0FBUyxDQUFUO0FBQ0EsT0FBS0MsQ0FBTCxHQUFTLENBQVQ7QUFDQSxPQUFLQyxJQUFMLEdBQVksQ0FBWjtBQUNBLE9BQUtDLElBQUwsR0FBWSxFQUFaO0FBQ0gsQ0FQRDs7QUFTQSxJQUFJQyxRQUFRLEdBQUdDLEVBQUUsQ0FBQ0MsSUFBSCxFQUFmOztBQUVBLElBQUlDLEtBQUssR0FBRyxJQUFaO0FBRUEsSUFBSUMsbUJBQW1CLEdBQUcsRUFBMUI7QUFDQSxJQUFJQyxZQUFZLEdBQUcsRUFBbkI7QUFDQSxJQUFJQyxXQUFXLEdBQUcsRUFBbEI7QUFDQSxJQUFJQyxhQUFhLEdBQUcsRUFBcEI7QUFFQSxJ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LFFBQ0kySSxTQUFTLEdBQUd2TCxZQUFZLENBQUM2QyxNQUQ3Qjs7QUFHQSxRQUFJcEMsU0FBUyxLQUFLcEMsUUFBUSxDQUFDMEUsYUFBM0IsRUFBMEM7QUFDdEN3SSxNQUFBQSxTQUFTLEdBQUcsQ0FBWjtBQUNIOztBQUVELFFBQUk5SyxTQUFTLEtBQUtwQyxRQUFRLENBQUN5RSxJQUEzQixFQUFpQztBQUM3QndJLE1BQUFBLFFBQVEsR0FBRyxDQUFYO0FBQ0FDLE1BQUFBLFNBQVMsR0FBRyxDQUFaO0FBQ0g7O0FBRUQ1SyxJQUFBQSxXQUFXLEdBQUcySyxRQUFkO0FBQ0ExSyxJQUFBQSxZQUFZLEdBQUcySyxTQUFmO0FBQ0ExSyxJQUFBQSxhQUFhLEdBQUd5SyxRQUFoQjtBQUNIOztTQUVENUosbUJBQUEsNEJBQW1CLENBQUc7O1NBRXRCeUksYUFBQSxvQkFBV25KLElBQVgsRUFBaUJpSSxPQUFqQixFQUEwQmpLLElBQTFCLEVBQWdDd00sT0FBaEMsRUFBeUM5TSxDQUF6QyxFQUE0Q0MsQ0FBNUMsRUFBK0M4TSxLQUEvQyxFQUFzRCxDQUFHOztTQUN6RHJCLGdCQUFBLHVCQUFjcEosSUFBZCxFQUFvQixDQUFHOztTQUV2QkUsZ0JBQUEseUJBQWdCLENBQUc7OztFQTltQnNCd0siLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgQXNzZW1ibGVyMkQgZnJvbSAnLi4vLi4vYXNzZW1ibGVyLTJkJztcblxuY29uc3QgdGV4dFV0aWxzID0gcmVxdWlyZSgnLi4vLi4vLi4vdXRpbHMvdGV4dC11dGlscycpO1xuY29uc3QgbWFjcm8gPSByZXF1aXJlKCcuLi8uLi8uLi9wbGF0Zm9ybS9DQ01hY3JvJyk7XG5jb25zdCBMYWJlbCA9IHJlcXVpcmUoJy4uLy4uLy4uL2NvbXBvbmVudHMvQ0NMYWJlbCcpO1xuY29uc3QgT3ZlcmZsb3cgPSBMYWJlbC5PdmVyZmxvdztcblxuY29uc3Qgc2hhcmVMYWJlbEluZm8gPSByZXF1aXJlKCcuLi91dGlscycpLnNoYXJlTGFiZWxJbmZvO1xuXG5cbmNvbnN0IGVtb2ppUmVnZXggPSAvW1xcdUQ4MDAtXFx1REJGRl1bXFx1REMwMC1cXHVERkZGXS9nO1xuXG5sZXQgTGV0dGVySW5mbyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNoYXIgPSAnJztcbiAgICB0aGlzLnZhbGlkID0gdHJ1ZTtcbiAgICB0aGlzLnggPSAwO1xuICAgIHRoaXMueSA9IDA7XG4gICAgdGhpcy5saW5lID0gMDtcbiAgICB0aGlzLmhhc2ggPSBcIlwiO1xufTtcblxubGV0IF90bXBSZWN0ID0gY2MucmVjdCgpO1xuXG5sZXQgX2NvbXAgPSBudWxsO1xuXG5sZXQgX2hvcml6b250YWxLZXJuaW5ncyA9IFtdO1xubGV0IF9sZXR0ZXJzSW5mbyA9IFtdO1xubGV0IF9saW5lc1dpZHRoID0gW107XG5sZXQgX2xpbmVzT2Zmc2V0WCA9IFtdO1xuXG5sZXQgX2ZudENvbmZpZyA9IG51bGw7XG5sZXQgX251bWJlck9mTGluZXMgPSAwO1xubGV0IF90ZXh0RGVzaXJlZEhlaWdodCA9IDA7XG5sZXQgX2xldHRlck9mZnNldFkgPSAwO1xubGV0IF90YWlsb3JlZFRvcFkgPSAwO1xuXG5sZXQgX3RhaWxvcmVkQm90dG9tWSA9IDA7XG5sZXQgX2JtZm9udFNjYWxlID0gMS4wO1xuXG5sZXQgX2xpbmVCcmVha1dpdGhvdXRTcGFjZXMgPSBmYWxzZTtcbmxldCBfc3ByaXRlRnJhbWUgPSBudWxsO1xubGV0IF9saW5lU3BhY2luZyA9IDA7XG5sZXQgX2NvbnRlbnRTaXplID0gY2Muc2l6ZSgpO1xubGV0IF9zdHJpbmcgPSAnJztcbmxldCBfZm9udFNpemUgPSAwO1xubGV0IF9vcmlnaW5Gb250U2l6ZSA9IDA7XG5sZXQgX2hBbGlnbiA9IDA7XG5sZXQgX3ZBbGlnbiA9IDA7XG5sZXQgX3NwYWNpbmdYID0gMDtcbmxldCBfbGluZUhlaWdodCA9IDA7XG5sZXQgX292ZXJmbG93ID0gMDtcbmxldCBfaXNXcmFwVGV4dCA9IGZhbHNlO1xubGV0IF9sYWJlbFdpZHRoID0gMDtcbmxldCBfbGFiZWxIZWlnaHQgPSAwO1xubGV0IF9tYXhMaW5lV2lkdGggPSAwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCbWZvbnRBc3NlbWJsZXIgZXh0ZW5kcyBBc3NlbWJsZXIyRCB7XG4gICAgdXBkYXRlUmVuZGVyRGF0YShjb21wKSB7XG4gICAgICAgIGlmICghY29tcC5fdmVydHNEaXJ0eSkgcmV0dXJuO1xuICAgICAgICBpZiAoX2NvbXAgPT09IGNvbXApIHJldHVybjtcblxuICAgICAgICBfY29tcCA9IGNvbXA7XG5cbiAgICAgICAgdGhpcy5fcmVzZXJ2ZVF1YWRzKGNvbXAsIGNvbXAuc3RyaW5nLnRvU3RyaW5nKCkubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlRm9udEZhbWlseShjb21wKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlUHJvcGVydGllcyhjb21wKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlTGFiZWxJbmZvKGNvbXApO1xuICAgICAgICB0aGlzLl91cGRhdGVDb250ZW50KCk7XG4gICAgICAgIHRoaXMudXBkYXRlV29ybGRWZXJ0cyhjb21wKTtcblxuICAgICAgICBfY29tcC5fYWN0dWFsRm9udFNpemUgPSBfZm9udFNpemU7XG4gICAgICAgIF9jb21wLm5vZGUuc2V0Q29udGVudFNpemUoX2NvbnRlbnRTaXplKTtcblxuICAgICAgICBfY29tcC5fdmVydHNEaXJ0eSA9IGZhbHNlO1xuICAgICAgICBfY29tcCA9IG51bGw7XG4gICAgICAgIHRoaXMuX3Jlc2V0UHJvcGVydGllcygpO1xuICAgIH1cblxuICAgIF91cGRhdGVGb250U2NhbGUoKSB7XG4gICAgICAgIF9ibWZvbnRTY2FsZSA9IF9mb250U2l6ZSAvIF9vcmlnaW5Gb250U2l6ZTtcbiAgICB9XG5cbiAgICBfdXBkYXRlRm9udEZhbWlseShjb21wKSB7XG4gICAgICAgIGxldCBmb250QXNzZXQgPSBjb21wLmZvbnQ7XG4gICAgICAgIF9zcHJpdGVGcmFtZSA9IGZvbnRBc3NldC5zcHJpdGVGcmFtZTtcbiAgICAgICAgX2ZudENvbmZpZyA9IGZvbnRBc3NldC5fZm50Q29uZmlnO1xuICAgICAgICBzaGFyZUxhYmVsSW5mby5mb250QXRsYXMgPSBmb250QXNzZXQuX2ZvbnREZWZEaWN0aW9uYXJ5O1xuXG4gICAgICAgIHRoaXMucGFja1RvRHluYW1pY0F0bGFzKGNvbXAsIF9zcHJpdGVGcmFtZSk7XG4gICAgfVxuXG4gICAgX3VwZGF0ZUxhYmVsSW5mbygpIHtcbiAgICAgICAgLy8gY2xlYXJcbiAgICAgICAgc2hhcmVMYWJlbEluZm8uaGFzaCA9IFwiXCI7XG4gICAgICAgIHNoYXJlTGFiZWxJbmZvLm1hcmdpbiA9IDA7XG4gICAgfVxuXG4gICAgX3VwZGF0ZVByb3BlcnRpZXMoY29tcCkge1xuICAgICAgICBfc3RyaW5nID0gY29tcC5zdHJpbmcudG9TdHJpbmcoKTtcbiAgICAgICAgX2ZvbnRTaXplID0gY29tcC5mb250U2l6ZTtcbiAgICAgICAgX29yaWdpbkZvbnRTaXplID0gX2ZudENvbmZpZyA/IF9mbnRDb25maWcuZm9udFNpemUgOiBjb21wLmZvbnRTaXplO1xuICAgICAgICBfaEFsaWduID0gY29tcC5ob3Jpem9udGFsQWxpZ247XG4gICAgICAgIF92QWxpZ24gPSBjb21wLnZlcnRpY2FsQWxpZ247XG4gICAgICAgIF9zcGFjaW5nWCA9IGNvbXAuc3BhY2luZ1g7XG4gICAgICAgIF9vdmVyZmxvdyA9IGNvbXAub3ZlcmZsb3c7XG4gICAgICAgIF9saW5lSGVpZ2h0ID0gY29tcC5fbGluZUhlaWdodDtcblxuICAgICAgICBfY29udGVudFNpemUud2lkdGggPSBjb21wLm5vZGUud2lkdGg7XG4gICAgICAgIF9jb250ZW50U2l6ZS5oZWlnaHQgPSBjb21wLm5vZGUuaGVpZ2h0O1xuXG4gICAgICAgIC8vIHNob3VsZCB3cmFwIHRleHRcbiAgICAgICAgaWYgKF9vdmVyZmxvdyA9PT0gT3ZlcmZsb3cuTk9ORSkge1xuICAgICAgICAgICAgX2lzV3JhcFRleHQgPSBmYWxzZTtcbiAgICAgICAgICAgIF9jb250ZW50U2l6ZS53aWR0aCArPSBzaGFyZUxhYmVsSW5mby5tYXJnaW4gKiAyO1xuICAgICAgICAgICAgX2NvbnRlbnRTaXplLmhlaWdodCArPSBzaGFyZUxhYmVsSW5mby5tYXJnaW4gKiAyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKF9vdmVyZmxvdyA9PT0gT3ZlcmZsb3cuUkVTSVpFX0hFSUdIVCkge1xuICAgICAgICAgICAgX2lzV3JhcFRleHQgPSB0cnVlO1xuICAgICAgICAgICAgX2NvbnRlbnRTaXplLmhlaWdodCArPSBzaGFyZUxhYmVsSW5mby5tYXJnaW4gKiAyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgX2lzV3JhcFRleHQgPSBjb21wLmVuYWJsZVdyYXBUZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgc2hhcmVMYWJlbEluZm8ubGluZUhlaWdodCA9IF9saW5lSGVpZ2h0O1xuICAgICAgICBzaGFyZUxhYmVsSW5mby5mb250U2l6ZSA9IF9mb250U2l6ZTtcblxuICAgICAgICB0aGlzLl9zZXR1cEJNRm9udE92ZXJmbG93TWV0cmljcygpO1xuICAgIH1cblxuICAgIF9yZXNldFByb3BlcnRpZXMoKSB7XG4gICAgICAgIF9mbnRDb25maWcgPSBudWxsO1xuICAgICAgICBfc3ByaXRlRnJhbWUgPSBudWxsO1xuICAgICAgICBzaGFyZUxhYmVsSW5mby5oYXNoID0gXCJcIjtcbiAgICAgICAgc2hhcmVMYWJlbEluZm8ubWFyZ2luID0gMDtcbiAgICB9XG5cbiAgICBfdXBkYXRlQ29udGVudCgpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlRm9udFNjYWxlKCk7XG4gICAgICAgIHRoaXMuX2NvbXB1dGVIb3Jpem9udGFsS2VybmluZ0ZvclRleHQoKTtcbiAgICAgICAgdGhpcy5fYWxpZ25UZXh0KCk7XG4gICAgfVxuXG4gICAgX2NvbXB1dGVIb3Jpem9udGFsS2VybmluZ0ZvclRleHQoKSB7XG4gICAgICAgIGxldCBzdHJpbmcgPSBfc3RyaW5nO1xuICAgICAgICBsZXQgc3RyaW5nTGVuID0gc3RyaW5nLmxlbmd0aDtcblxuICAgICAgICBsZXQgaG9yaXpvbnRhbEtlcm5pbmdzID0gX2hvcml6b250YWxLZXJuaW5ncztcbiAgICAgICAgbGV0IGtlcm5pbmdEaWN0O1xuICAgICAgICBfZm50Q29uZmlnICYmIChrZXJuaW5nRGljdCA9IF9mbnRDb25maWcua2VybmluZ0RpY3QpO1xuICAgICAgICBpZiAoa2VybmluZ0RpY3QgJiYgIWNjLmpzLmlzRW1wdHlPYmplY3Qoa2VybmluZ0RpY3QpKSB7XG4gICAgICAgICAgICBsZXQgcHJldiA9IC0xO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHJpbmdMZW47ICsraSkge1xuICAgICAgICAgICAgICAgIGxldCBrZXkgPSBzdHJpbmcuY2hhckNvZGVBdChpKTtcbiAgICAgICAgICAgICAgICBsZXQga2VybmluZ0Ftb3VudCA9IGtlcm5pbmdEaWN0WyhwcmV2IDw8IDE2KSB8IChrZXkgJiAweGZmZmYpXSB8fCAwO1xuICAgICAgICAgICAgICAgIGlmIChpIDwgc3RyaW5nTGVuIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBob3Jpem9udGFsS2VybmluZ3NbaV0gPSBrZXJuaW5nQW1vdW50O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGhvcml6b250YWxLZXJuaW5nc1tpXSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByZXYgPSBrZXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBob3Jpem9udGFsS2VybmluZ3MubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9tdWx0aWxpbmVUZXh0V3JhcChuZXh0VG9rZW5GdW5jKSB7XG4gICAgICAgIGxldCB0ZXh0TGVuID0gX3N0cmluZy5sZW5ndGg7XG5cbiAgICAgICAgbGV0IGxpbmVJbmRleCA9IDA7XG4gICAgICAgIGxldCBuZXh0VG9rZW5YID0gMDtcbiAgICAgICAgbGV0IG5leHRUb2tlblkgPSAwO1xuICAgICAgICBsZXQgbG9uZ2VzdExpbmUgPSAwO1xuICAgICAgICBsZXQgbGV0dGVyUmlnaHQgPSAwO1xuXG4gICAgICAgIGxldCBoaWdoZXN0WSA9IDA7XG4gICAgICAgIGxldCBsb3dlc3RZID0gMDtcbiAgICAgICAgbGV0IGxldHRlckRlZiA9IG51bGw7XG4gICAgICAgIGxldCBsZXR0ZXJQb3NpdGlvbiA9IGNjLnYyKDAsIDApO1xuXG4gICAgICAgIGxldCBlbW9qaXNNYXAgPSB7fTtcbiAgICAgICAgX3N0cmluZy5yZXBsYWNlKGVtb2ppUmVnZXgsIChtYXRjaCwgaW5kZXgpID0+IGVtb2ppc01hcFtpbmRleF0gPSBtYXRjaCk7XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRleHRMZW47KSB7XG4gICAgICAgICAgICBsZXQgY2hhcmFjdGVyID0gZW1vamlzTWFwW2luZGV4XSB8fCBfc3RyaW5nLmNoYXJBdChpbmRleCk7XG4gICAgICAgICAgICBpZiAoY2hhcmFjdGVyID09PSBcIlxcblwiKSB7XG4gICAgICAgICAgICAgICAgX2xpbmVzV2lkdGgucHVzaChsZXR0ZXJSaWdodCk7XG4gICAgICAgICAgICAgICAgbGV0dGVyUmlnaHQgPSAwO1xuICAgICAgICAgICAgICAgIGxpbmVJbmRleCsrO1xuICAgICAgICAgICAgICAgIG5leHRUb2tlblggPSAwO1xuICAgICAgICAgICAgICAgIG5leHRUb2tlblkgLT0gX2xpbmVIZWlnaHQgKiB0aGlzLl9nZXRGb250U2NhbGUoKSArIF9saW5lU3BhY2luZztcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWNvcmRQbGFjZWhvbGRlckluZm8oaW5kZXgsIGNoYXJhY3Rlcik7XG4gICAgICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHRva2VuTGVuID0gbmV4dFRva2VuRnVuYyhfc3RyaW5nLCBpbmRleCwgdGV4dExlbiwgISFlbW9qaXNNYXBbaW5kZXhdKTtcbiAgICAgICAgICAgIGxldCB0b2tlbkhpZ2hlc3RZID0gaGlnaGVzdFk7XG4gICAgICAgICAgICBsZXQgdG9rZW5Mb3dlc3RZID0gbG93ZXN0WTtcbiAgICAgICAgICAgIGxldCB0b2tlblJpZ2h0ID0gbGV0dGVyUmlnaHQ7XG4gICAgICAgICAgICBsZXQgbmV4dExldHRlclggPSBuZXh0VG9rZW5YO1xuICAgICAgICAgICAgbGV0IG5ld0xpbmUgPSBmYWxzZTtcblxuICAgICAgICAgICAgZm9yIChsZXQgdG1wID0gMDsgdG1wIDwgdG9rZW5MZW47ICsrdG1wKSB7XG4gICAgICAgICAgICAgICAgbGV0IGxldHRlckluZGV4ID0gaW5kZXggKyB0bXA7XG4gICAgICAgICAgICAgICAgY2hhcmFjdGVyID0gZW1vamlzTWFwW2xldHRlckluZGV4XSB8fCBfc3RyaW5nLmNoYXJBdChsZXR0ZXJJbmRleCk7XG4gICAgICAgICAgICAgICAgaWYgKGNoYXJhY3RlciA9PT0gXCJcXHJcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWNvcmRQbGFjZWhvbGRlckluZm8obGV0dGVySW5kZXgsIGNoYXJhY3Rlcik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXR0ZXJEZWYgPSBzaGFyZUxhYmVsSW5mby5mb250QXRsYXMuZ2V0TGV0dGVyRGVmaW5pdGlvbkZvckNoYXIoY2hhcmFjdGVyLCBzaGFyZUxhYmVsSW5mbyk7XG4gICAgICAgICAgICAgICAgaWYgKCFsZXR0ZXJEZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVjb3JkUGxhY2Vob2xkZXJJbmZvKGxldHRlckluZGV4LCBjaGFyYWN0ZXIpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYXRsYXNOYW1lID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgX2ZudENvbmZpZyAmJiAoYXRsYXNOYW1lID0gX2ZudENvbmZpZy5hdGxhc05hbWUpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNhbid0IGZpbmQgbGV0dGVyIGRlZmluaXRpb24gaW4gdGV4dHVyZSBhdGxhcyBcIiArIGF0bGFzTmFtZSArIFwiIGZvciBsZXR0ZXI6XCIgKyBjaGFyYWN0ZXIpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgbGV0dGVyWCA9IG5leHRMZXR0ZXJYICsgbGV0dGVyRGVmLm9mZnNldFggKiBfYm1mb250U2NhbGUgLSBzaGFyZUxhYmVsSW5mby5tYXJnaW47XG5cbiAgICAgICAgICAgICAgICBpZiAoX2lzV3JhcFRleHRcbiAgICAgICAgICAgICAgICAgICAgJiYgX21heExpbmVXaWR0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgJiYgbmV4dFRva2VuWCA+IDBcbiAgICAgICAgICAgICAgICAgICAgJiYgbGV0dGVyWCArIGxldHRlckRlZi53ICogX2JtZm9udFNjYWxlID4gX21heExpbmVXaWR0aFxuICAgICAgICAgICAgICAgICAgICAmJiAhdGV4dFV0aWxzLmlzVW5pY29kZVNwYWNlKGNoYXJhY3RlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgX2xpbmVzV2lkdGgucHVzaChsZXR0ZXJSaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIGxldHRlclJpZ2h0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgbGluZUluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgIG5leHRUb2tlblggPSAwO1xuICAgICAgICAgICAgICAgICAgICBuZXh0VG9rZW5ZIC09IChfbGluZUhlaWdodCAqIHRoaXMuX2dldEZvbnRTY2FsZSgpICsgX2xpbmVTcGFjaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldHRlclBvc2l0aW9uLnggPSBsZXR0ZXJYO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldHRlclBvc2l0aW9uLnkgPSBuZXh0VG9rZW5ZIC0gbGV0dGVyRGVmLm9mZnNldFkgKiBfYm1mb250U2NhbGUgKyBzaGFyZUxhYmVsSW5mby5tYXJnaW47XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjb3JkTGV0dGVySW5mbyhsZXR0ZXJQb3NpdGlvbiwgY2hhcmFjdGVyLCBsZXR0ZXJJbmRleCwgbGluZUluZGV4KTtcblxuICAgICAgICAgICAgICAgIGlmIChsZXR0ZXJJbmRleCArIDEgPCBfaG9yaXpvbnRhbEtlcm5pbmdzLmxlbmd0aCAmJiBsZXR0ZXJJbmRleCA8IHRleHRMZW4gLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRMZXR0ZXJYICs9IF9ob3Jpem9udGFsS2VybmluZ3NbbGV0dGVySW5kZXggKyAxXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBuZXh0TGV0dGVyWCArPSBsZXR0ZXJEZWYueEFkdmFuY2UgKiBfYm1mb250U2NhbGUgKyBfc3BhY2luZ1ggLSBzaGFyZUxhYmVsSW5mby5tYXJnaW4gKiAyO1xuXG4gICAgICAgICAgICAgICAgdG9rZW5SaWdodCA9IGxldHRlclBvc2l0aW9uLnggKyBsZXR0ZXJEZWYudyAqIF9ibWZvbnRTY2FsZSAtIHNoYXJlTGFiZWxJbmZvLm1hcmdpbjtcblxuICAgICAgICAgICAgICAgIGlmICh0b2tlbkhpZ2hlc3RZIDwgbGV0dGVyUG9zaXRpb24ueSkge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbkhpZ2hlc3RZID0gbGV0dGVyUG9zaXRpb24ueTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodG9rZW5Mb3dlc3RZID4gbGV0dGVyUG9zaXRpb24ueSAtIGxldHRlckRlZi5oICogX2JtZm9udFNjYWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuTG93ZXN0WSA9IGxldHRlclBvc2l0aW9uLnkgLSBsZXR0ZXJEZWYuaCAqIF9ibWZvbnRTY2FsZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gLy9lbmQgb2YgZm9yIGxvb3BcblxuICAgICAgICAgICAgaWYgKG5ld0xpbmUpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBuZXh0VG9rZW5YID0gbmV4dExldHRlclg7XG4gICAgICAgICAgICBsZXR0ZXJSaWdodCA9IHRva2VuUmlnaHQ7XG5cbiAgICAgICAgICAgIGlmIChoaWdoZXN0WSA8IHRva2VuSGlnaGVzdFkpIHtcbiAgICAgICAgICAgICAgICBoaWdoZXN0WSA9IHRva2VuSGlnaGVzdFk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobG93ZXN0WSA+IHRva2VuTG93ZXN0WSkge1xuICAgICAgICAgICAgICAgIGxvd2VzdFkgPSB0b2tlbkxvd2VzdFk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobG9uZ2VzdExpbmUgPCBsZXR0ZXJSaWdodCkge1xuICAgICAgICAgICAgICAgIGxvbmdlc3RMaW5lID0gbGV0dGVyUmlnaHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlbW9qaXNNYXBbaW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgbGV0IHYgPSBfbGV0dGVyc0luZm9baW5kZXggKyAxXTtcbiAgICAgICAgICAgICAgICBpZiAodikgdi52YWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGluZGV4ICs9IDI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbmRleCArPSB0b2tlbkxlbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSAvL2VuZCBvZiBmb3IgbG9vcFxuXG4gICAgICAgIF9saW5lc1dpZHRoLnB1c2gobGV0dGVyUmlnaHQpO1xuXG4gICAgICAgIF9udW1iZXJPZkxpbmVzID0gbGluZUluZGV4ICsgMTtcbiAgICAgICAgX3RleHREZXNpcmVkSGVpZ2h0ID0gX251bWJlck9mTGluZXMgKiBfbGluZUhlaWdodCAqIHRoaXMuX2dldEZvbnRTY2FsZSgpO1xuICAgICAgICBpZiAoX251bWJlck9mTGluZXMgPiAxKSB7XG4gICAgICAgICAgICBfdGV4dERlc2lyZWRIZWlnaHQgKz0gKF9udW1iZXJPZkxpbmVzIC0gMSkgKiBfbGluZVNwYWNpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBfY29udGVudFNpemUud2lkdGggPSBfbGFiZWxXaWR0aDtcbiAgICAgICAgX2NvbnRlbnRTaXplLmhlaWdodCA9IF9sYWJlbEhlaWdodDtcbiAgICAgICAgaWYgKF9sYWJlbFdpZHRoIDw9IDApIHtcbiAgICAgICAgICAgIF9jb250ZW50U2l6ZS53aWR0aCA9IHBhcnNlRmxvYXQobG9uZ2VzdExpbmUudG9GaXhlZCgyKSkgKyBzaGFyZUxhYmVsSW5mby5tYXJnaW4gKiAyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfbGFiZWxIZWlnaHQgPD0gMCkge1xuICAgICAgICAgICAgX2NvbnRlbnRTaXplLmhlaWdodCA9IHBhcnNlRmxvYXQoX3RleHREZXNpcmVkSGVpZ2h0LnRvRml4ZWQoMikpICsgc2hhcmVMYWJlbEluZm8ubWFyZ2luICogMjtcbiAgICAgICAgfVxuXG4gICAgICAgIF90YWlsb3JlZFRvcFkgPSBfY29udGVudFNpemUuaGVpZ2h0O1xuICAgICAgICBfdGFpbG9yZWRCb3R0b21ZID0gMDtcblxuICAgICAgICBpZiAoX292ZXJmbG93ICE9PSBPdmVyZmxvdy5DTEFNUCkge1xuICAgICAgICAgICAgaWYgKGhpZ2hlc3RZID4gMCkge1xuICAgICAgICAgICAgICAgIF90YWlsb3JlZFRvcFkgPSBfY29udGVudFNpemUuaGVpZ2h0ICsgaGlnaGVzdFk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChsb3dlc3RZIDwgLV90ZXh0RGVzaXJlZEhlaWdodCkge1xuICAgICAgICAgICAgICAgIF90YWlsb3JlZEJvdHRvbVkgPSBfdGV4dERlc2lyZWRIZWlnaHQgKyBsb3dlc3RZO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgX2dldEZpcnN0Q2hhckxlbigpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgX2dldEZvbnRTY2FsZSgpIHtcbiAgICAgICAgcmV0dXJuIF9vdmVyZmxvdyA9PT0gT3ZlcmZsb3cuU0hSSU5LID8gX2JtZm9udFNjYWxlIDogMTtcbiAgICB9XG5cbiAgICBfZ2V0Rmlyc3RXb3JkTGVuKHRleHQsIHN0YXJ0SW5kZXgsIHRleHRMZW4sIGlzRW1vamkpIHtcbiAgICAgICAgaWYgKGlzRW1vamkpIHJldHVybiAxO1xuXG4gICAgICAgIGxldCBjaGFyYWN0ZXIgPSB0ZXh0LmNoYXJBdChzdGFydEluZGV4KTtcbiAgICAgICAgaWYgKHRleHRVdGlscy5pc1VuaWNvZGVDSksoY2hhcmFjdGVyKVxuICAgICAgICAgICAgfHwgY2hhcmFjdGVyID09PSBcIlxcblwiXG4gICAgICAgICAgICB8fCB0ZXh0VXRpbHMuaXNVbmljb2RlU3BhY2UoY2hhcmFjdGVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbGVuID0gMTtcbiAgICAgICAgbGV0IGxldHRlckRlZiA9IHNoYXJlTGFiZWxJbmZvLmZvbnRBdGxhcy5nZXRMZXR0ZXJEZWZpbml0aW9uRm9yQ2hhcihjaGFyYWN0ZXIsIHNoYXJlTGFiZWxJbmZvKTtcbiAgICAgICAgaWYgKCFsZXR0ZXJEZWYpIHtcbiAgICAgICAgICAgIHJldHVybiBsZW47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG5leHRMZXR0ZXJYID0gbGV0dGVyRGVmLnhBZHZhbmNlICogX2JtZm9udFNjYWxlICsgX3NwYWNpbmdYO1xuICAgICAgICBsZXQgbGV0dGVyWDtcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSBzdGFydEluZGV4ICsgMTsgaW5kZXggPCB0ZXh0TGVuOyArK2luZGV4KSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXIgPSB0ZXh0LmNoYXJBdChpbmRleCk7XG5cbiAgICAgICAgICAgIGxldHRlckRlZiA9IHNoYXJlTGFiZWxJbmZvLmZvbnRBdGxhcy5nZXRMZXR0ZXJEZWZpbml0aW9uRm9yQ2hhcihjaGFyYWN0ZXIsIHNoYXJlTGFiZWxJbmZvKTtcbiAgICAgICAgICAgIGlmICghbGV0dGVyRGVmKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXR0ZXJYID0gbmV4dExldHRlclggKyBsZXR0ZXJEZWYub2Zmc2V0WCAqIF9ibWZvbnRTY2FsZTtcblxuICAgICAgICAgICAgaWYgKGxldHRlclggKyBsZXR0ZXJEZWYudyAqIF9ibWZvbnRTY2FsZSA+IF9tYXhMaW5lV2lkdGhcbiAgICAgICAgICAgICAgICAmJiAhdGV4dFV0aWxzLmlzVW5pY29kZVNwYWNlKGNoYXJhY3RlcilcbiAgICAgICAgICAgICAgICAmJiBfbWF4TGluZVdpZHRoID4gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZW47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXh0TGV0dGVyWCArPSBsZXR0ZXJEZWYueEFkdmFuY2UgKiBfYm1mb250U2NhbGUgKyBfc3BhY2luZ1g7XG4gICAgICAgICAgICBpZiAoY2hhcmFjdGVyID09PSBcIlxcblwiXG4gICAgICAgICAgICAgICAgfHwgdGV4dFV0aWxzLmlzVW5pY29kZVNwYWNlKGNoYXJhY3RlcilcbiAgICAgICAgICAgICAgICB8fCB0ZXh0VXRpbHMuaXNVbmljb2RlQ0pLKGNoYXJhY3RlcikpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxlbisrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxlbjtcbiAgICB9XG5cbiAgICBfbXVsdGlsaW5lVGV4dFdyYXBCeVdvcmQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tdWx0aWxpbmVUZXh0V3JhcCh0aGlzLl9nZXRGaXJzdFdvcmRMZW4pO1xuICAgIH1cblxuICAgIF9tdWx0aWxpbmVUZXh0V3JhcEJ5Q2hhcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX211bHRpbGluZVRleHRXcmFwKHRoaXMuX2dldEZpcnN0Q2hhckxlbik7XG4gICAgfVxuXG4gICAgX3JlY29yZFBsYWNlaG9sZGVySW5mbyhsZXR0ZXJJbmRleCwgY2hhcikge1xuICAgICAgICBpZiAobGV0dGVySW5kZXggPj0gX2xldHRlcnNJbmZvLmxlbmd0aCkge1xuICAgICAgICAgICAgbGV0IHRtcEluZm8gPSBuZXcgTGV0dGVySW5mbygpO1xuICAgICAgICAgICAgX2xldHRlcnNJbmZvLnB1c2godG1wSW5mbyk7XG4gICAgICAgIH1cblxuICAgICAgICBfbGV0dGVyc0luZm9bbGV0dGVySW5kZXhdLmNoYXIgPSBjaGFyO1xuICAgICAgICBfbGV0dGVyc0luZm9bbGV0dGVySW5kZXhdLmhhc2ggPSBjaGFyLmNvZGVQb2ludEF0KCkgKyBzaGFyZUxhYmVsSW5mby5oYXNoO1xuICAgICAgICBfbGV0dGVyc0luZm9bbGV0dGVySW5kZXhdLnZhbGlkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgX3JlY29yZExldHRlckluZm8obGV0dGVyUG9zaXRpb24sIGNoYXJhY3RlciwgbGV0dGVySW5kZXgsIGxpbmVJbmRleCkge1xuICAgICAgICBpZiAobGV0dGVySW5kZXggPj0gX2xldHRlcnNJbmZvLmxlbmd0aCkge1xuICAgICAgICAgICAgbGV0IHRtcEluZm8gPSBuZXcgTGV0dGVySW5mbygpO1xuICAgICAgICAgICAgX2xldHRlcnNJbmZvLnB1c2godG1wSW5mbyk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQga2V5ID0gY2hhcmFjdGVyLmNvZGVQb2ludEF0KCkgKyBzaGFyZUxhYmVsSW5mby5oYXNoO1xuXG4gICAgICAgIF9sZXR0ZXJzSW5mb1tsZXR0ZXJJbmRleF0ubGluZSA9IGxpbmVJbmRleDtcbiAgICAgICAgX2xldHRlcnNJbmZvW2xldHRlckluZGV4XS5jaGFyID0gY2hhcmFjdGVyO1xuICAgICAgICBfbGV0dGVyc0luZm9bbGV0dGVySW5kZXhdLmhhc2ggPSBrZXk7XG4gICAgICAgIGxldCBsZXR0ZXIgPSBzaGFyZUxhYmVsSW5mby5mb250QXRsYXMuZ2V0TGV0dGVyKGtleSk7XG4gICAgICAgIF9sZXR0ZXJzSW5mb1tsZXR0ZXJJbmRleF0udmFsaWQgPSBsZXR0ZXIgPyBsZXR0ZXIudmFsaWQgOiBmYWxzZTtcbiAgICAgICAgX2xldHRlcnNJbmZvW2xldHRlckluZGV4XS54ID0gbGV0dGVyUG9zaXRpb24ueDtcbiAgICAgICAgX2xldHRlcnNJbmZvW2xldHRlckluZGV4XS55ID0gbGV0dGVyUG9zaXRpb24ueTtcbiAgICB9XG5cbiAgICBfYWxpZ25UZXh0KCkge1xuICAgICAgICBfdGV4dERlc2lyZWRIZWlnaHQgPSAwO1xuICAgICAgICBfbGluZXNXaWR0aC5sZW5ndGggPSAwO1xuXG4gICAgICAgIGlmICghX2xpbmVCcmVha1dpdGhvdXRTcGFjZXMpIHtcbiAgICAgICAgICAgIHRoaXMuX211bHRpbGluZVRleHRXcmFwQnlXb3JkKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9tdWx0aWxpbmVUZXh0V3JhcEJ5Q2hhcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY29tcHV0ZUFsaWdubWVudE9mZnNldCgpO1xuXG4gICAgICAgIC8vc2hyaW5rXG4gICAgICAgIGlmIChfb3ZlcmZsb3cgPT09IE92ZXJmbG93LlNIUklOSykge1xuICAgICAgICAgICAgaWYgKF9mb250U2l6ZSA+IDAgJiYgdGhpcy5faXNWZXJ0aWNhbENsYW1wKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zaHJpbmtMYWJlbFRvQ29udGVudFNpemUodGhpcy5faXNWZXJ0aWNhbENsYW1wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5fdXBkYXRlUXVhZHMoKSkge1xuICAgICAgICAgICAgaWYgKF9vdmVyZmxvdyA9PT0gT3ZlcmZsb3cuU0hSSU5LKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2hyaW5rTGFiZWxUb0NvbnRlbnRTaXplKHRoaXMuX2lzSG9yaXpvbnRhbENsYW1wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9zY2FsZUZvbnRTaXplRG93bihmb250U2l6ZSkge1xuICAgICAgICBsZXQgc2hvdWxkVXBkYXRlQ29udGVudCA9IHRydWU7XG4gICAgICAgIGlmICghZm9udFNpemUpIHtcbiAgICAgICAgICAgIGZvbnRTaXplID0gMC4xO1xuICAgICAgICAgICAgc2hvdWxkVXBkYXRlQ29udGVudCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIF9mb250U2l6ZSA9IGZvbnRTaXplO1xuXG4gICAgICAgIGlmIChzaG91bGRVcGRhdGVDb250ZW50KSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVDb250ZW50KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfc2hyaW5rTGFiZWxUb0NvbnRlbnRTaXplKGxhbWJkYSkge1xuICAgICAgICBsZXQgZm9udFNpemUgPSBfZm9udFNpemU7XG5cbiAgICAgICAgbGV0IGxlZnQgPSAwLCByaWdodCA9IGZvbnRTaXplIHwgMCwgbWlkID0gMDtcbiAgICAgICAgd2hpbGUgKGxlZnQgPCByaWdodCkge1xuICAgICAgICAgICAgbWlkID0gKGxlZnQgKyByaWdodCArIDEpID4+IDE7XG5cbiAgICAgICAgICAgIGxldCBuZXdGb250U2l6ZSA9IG1pZDtcbiAgICAgICAgICAgIGlmIChuZXdGb250U2l6ZSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF9ibWZvbnRTY2FsZSA9IG5ld0ZvbnRTaXplIC8gX29yaWdpbkZvbnRTaXplO1xuXG4gICAgICAgICAgICBpZiAoIV9saW5lQnJlYWtXaXRob3V0U3BhY2VzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbXVsdGlsaW5lVGV4dFdyYXBCeVdvcmQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbXVsdGlsaW5lVGV4dFdyYXBCeUNoYXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2NvbXB1dGVBbGlnbm1lbnRPZmZzZXQoKTtcblxuICAgICAgICAgICAgaWYgKGxhbWJkYSgpKSB7XG4gICAgICAgICAgICAgICAgcmlnaHQgPSBtaWQgLSAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZWZ0ID0gbWlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGFjdHVhbEZvbnRTaXplID0gbGVmdDtcbiAgICAgICAgaWYgKGFjdHVhbEZvbnRTaXplID49IDApIHtcbiAgICAgICAgICAgIHRoaXMuX3NjYWxlRm9udFNpemVEb3duKGFjdHVhbEZvbnRTaXplKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9pc1ZlcnRpY2FsQ2xhbXAoKSB7XG4gICAgICAgIGlmIChfdGV4dERlc2lyZWRIZWlnaHQgPiBfY29udGVudFNpemUuaGVpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9pc0hvcml6b250YWxDbGFtcCgpIHtcbiAgICAgICAgbGV0IGxldHRlckNsYW1wID0gZmFsc2U7XG4gICAgICAgIGZvciAobGV0IGN0ciA9IDAsIGwgPSBfc3RyaW5nLmxlbmd0aDsgY3RyIDwgbDsgKytjdHIpIHtcbiAgICAgICAgICAgIGxldCBsZXR0ZXJJbmZvID0gX2xldHRlcnNJbmZvW2N0cl07XG4gICAgICAgICAgICBpZiAobGV0dGVySW5mby52YWxpZCkge1xuICAgICAgICAgICAgICAgIGxldCBsZXR0ZXJEZWYgPSBzaGFyZUxhYmVsSW5mby5mb250QXRsYXMuZ2V0TGV0dGVyKGxldHRlckluZm8uaGFzaCk7XG5cbiAgICAgICAgICAgICAgICBsZXQgcHggPSBsZXR0ZXJJbmZvLnggKyBsZXR0ZXJEZWYudyAqIF9ibWZvbnRTY2FsZTtcbiAgICAgICAgICAgICAgICBsZXQgbGluZUluZGV4ID0gbGV0dGVySW5mby5saW5lO1xuICAgICAgICAgICAgICAgIGlmIChfbGFiZWxXaWR0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFfaXNXcmFwVGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHB4ID4gX2NvbnRlbnRTaXplLndpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyQ2xhbXAgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHdvcmRXaWR0aCA9IF9saW5lc1dpZHRoW2xpbmVJbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yZFdpZHRoID4gX2NvbnRlbnRTaXplLndpZHRoICYmIChweCA+IF9jb250ZW50U2l6ZS53aWR0aCB8fCBweCA8IDApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyQ2xhbXAgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxldHRlckNsYW1wO1xuICAgIH1cblxuICAgIF9pc0hvcml6b250YWxDbGFtcGVkKHB4LCBsaW5lSW5kZXgpIHtcbiAgICAgICAgbGV0IHdvcmRXaWR0aCA9IF9saW5lc1dpZHRoW2xpbmVJbmRleF07XG4gICAgICAgIGxldCBsZXR0ZXJPdmVyQ2xhbXAgPSAocHggPiBfY29udGVudFNpemUud2lkdGggfHwgcHggPCAwKTtcblxuICAgICAgICBpZiAoIV9pc1dyYXBUZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gbGV0dGVyT3ZlckNsYW1wO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICh3b3JkV2lkdGggPiBfY29udGVudFNpemUud2lkdGggJiYgbGV0dGVyT3ZlckNsYW1wKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF91cGRhdGVRdWFkcygpIHtcbiAgICAgICAgbGV0IHRleHR1cmUgPSBfc3ByaXRlRnJhbWUgPyBfc3ByaXRlRnJhbWUuX3RleHR1cmUgOiBzaGFyZUxhYmVsSW5mby5mb250QXRsYXMuZ2V0VGV4dHVyZSgpO1xuXG4gICAgICAgIGxldCBub2RlID0gX2NvbXAubm9kZTtcblxuICAgICAgICB0aGlzLnZlcnRpY2VzQ291bnQgPSB0aGlzLmluZGljZXNDb3VudCA9IDA7XG5cbiAgICAgICAgLy8gTmVlZCB0byByZXNldCBkYXRhTGVuZ3RoIGluIENhbnZhcyByZW5kZXJpbmcgbW9kZS5cbiAgICAgICAgdGhpcy5fcmVuZGVyRGF0YSAmJiAodGhpcy5fcmVuZGVyRGF0YS5kYXRhTGVuZ3RoID0gMCk7XG5cbiAgICAgICAgbGV0IGNvbnRlbnRTaXplID0gX2NvbnRlbnRTaXplLFxuICAgICAgICAgICAgYXBweCA9IG5vZGUuX2FuY2hvclBvaW50LnggKiBjb250ZW50U2l6ZS53aWR0aCxcbiAgICAgICAgICAgIGFwcHkgPSBub2RlLl9hbmNob3JQb2ludC55ICogY29udGVudFNpemUuaGVpZ2h0O1xuXG4gICAgICAgIGxldCByZXQgPSB0cnVlO1xuICAgICAgICBmb3IgKGxldCBjdHIgPSAwLCBsID0gX3N0cmluZy5sZW5ndGg7IGN0ciA8IGw7ICsrY3RyKSB7XG4gICAgICAgICAgICBsZXQgbGV0dGVySW5mbyA9IF9sZXR0ZXJzSW5mb1tjdHJdO1xuICAgICAgICAgICAgaWYgKCFsZXR0ZXJJbmZvLnZhbGlkKSBjb250aW51ZTtcbiAgICAgICAgICAgIGxldCBsZXR0ZXJEZWYgPSBzaGFyZUxhYmVsSW5mby5mb250QXRsYXMuZ2V0TGV0dGVyKGxldHRlckluZm8uaGFzaCk7XG5cbiAgICAgICAgICAgIF90bXBSZWN0LmhlaWdodCA9IGxldHRlckRlZi5oO1xuICAgICAgICAgICAgX3RtcFJlY3Qud2lkdGggPSBsZXR0ZXJEZWYudztcbiAgICAgICAgICAgIF90bXBSZWN0LnggPSBsZXR0ZXJEZWYudTtcbiAgICAgICAgICAgIF90bXBSZWN0LnkgPSBsZXR0ZXJEZWYudjtcblxuICAgICAgICAgICAgbGV0IHB5ID0gbGV0dGVySW5mby55ICsgX2xldHRlck9mZnNldFk7XG5cbiAgICAgICAgICAgIGlmIChfbGFiZWxIZWlnaHQgPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHB5ID4gX3RhaWxvcmVkVG9wWSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2xpcFRvcCA9IHB5IC0gX3RhaWxvcmVkVG9wWTtcbiAgICAgICAgICAgICAgICAgICAgX3RtcFJlY3QueSArPSBjbGlwVG9wO1xuICAgICAgICAgICAgICAgICAgICBfdG1wUmVjdC5oZWlnaHQgLT0gY2xpcFRvcDtcbiAgICAgICAgICAgICAgICAgICAgcHkgPSBweSAtIGNsaXBUb3A7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKChweSAtIGxldHRlckRlZi5oICogX2JtZm9udFNjYWxlIDwgX3RhaWxvcmVkQm90dG9tWSkgJiYgX292ZXJmbG93ID09PSBPdmVyZmxvdy5DTEFNUCkge1xuICAgICAgICAgICAgICAgICAgICBfdG1wUmVjdC5oZWlnaHQgPSAocHkgPCBfdGFpbG9yZWRCb3R0b21ZKSA/IDAgOiAocHkgLSBfdGFpbG9yZWRCb3R0b21ZKSAvIF9ibWZvbnRTY2FsZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBsaW5lSW5kZXggPSBsZXR0ZXJJbmZvLmxpbmU7XG4gICAgICAgICAgICBsZXQgcHggPSBsZXR0ZXJJbmZvLnggKyBsZXR0ZXJEZWYudyAvIDIgKiBfYm1mb250U2NhbGUgKyBfbGluZXNPZmZzZXRYW2xpbmVJbmRleF07XG5cbiAgICAgICAgICAgIGlmIChfbGFiZWxXaWR0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faXNIb3Jpem9udGFsQ2xhbXBlZChweCwgbGluZUluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5DTEFNUCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RtcFJlY3Qud2lkdGggPSAwO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKF9vdmVyZmxvdyA9PT0gT3ZlcmZsb3cuU0hSSU5LKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2NvbnRlbnRTaXplLndpZHRoID4gbGV0dGVyRGVmLncpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RtcFJlY3Qud2lkdGggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX3RtcFJlY3QuaGVpZ2h0ID4gMCAmJiBfdG1wUmVjdC53aWR0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBsZXQgaXNSb3RhdGVkID0gdGhpcy5fZGV0ZXJtaW5lUmVjdChfdG1wUmVjdCk7XG4gICAgICAgICAgICAgICAgbGV0IGxldHRlclBvc2l0aW9uWCA9IGxldHRlckluZm8ueCArIF9saW5lc09mZnNldFhbbGV0dGVySW5mby5saW5lXTtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGVuZFF1YWQoX2NvbXAsIHRleHR1cmUsIF90bXBSZWN0LCBpc1JvdGF0ZWQsIGxldHRlclBvc2l0aW9uWCAtIGFwcHgsIHB5IC0gYXBweSwgX2JtZm9udFNjYWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9xdWFkc1VwZGF0ZWQoX2NvbXApO1xuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgX2RldGVybWluZVJlY3QodGVtcFJlY3QpIHtcbiAgICAgICAgbGV0IGlzUm90YXRlZCA9IF9zcHJpdGVGcmFtZS5pc1JvdGF0ZWQoKTtcblxuICAgICAgICBsZXQgb3JpZ2luYWxTaXplID0gX3Nwcml0ZUZyYW1lLl9vcmlnaW5hbFNpemU7XG4gICAgICAgIGxldCByZWN0ID0gX3Nwcml0ZUZyYW1lLl9yZWN0O1xuICAgICAgICBsZXQgb2Zmc2V0ID0gX3Nwcml0ZUZyYW1lLl9vZmZzZXQ7XG4gICAgICAgIGxldCB0cmltbWVkTGVmdCA9IG9mZnNldC54ICsgKG9yaWdpbmFsU2l6ZS53aWR0aCAtIHJlY3Qud2lkdGgpIC8gMjtcbiAgICAgICAgbGV0IHRyaW1tZWRUb3AgPSBvZmZzZXQueSAtIChvcmlnaW5hbFNpemUuaGVpZ2h0IC0gcmVjdC5oZWlnaHQpIC8gMjtcblxuICAgICAgICBpZiAoIWlzUm90YXRlZCkge1xuICAgICAgICAgICAgdGVtcFJlY3QueCArPSAocmVjdC54IC0gdHJpbW1lZExlZnQpO1xuICAgICAgICAgICAgdGVtcFJlY3QueSArPSAocmVjdC55ICsgdHJpbW1lZFRvcCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgb3JpZ2luYWxYID0gdGVtcFJlY3QueDtcbiAgICAgICAgICAgIHRlbXBSZWN0LnggPSByZWN0LnggKyByZWN0LmhlaWdodCAtIHRlbXBSZWN0LnkgLSB0ZW1wUmVjdC5oZWlnaHQgLSB0cmltbWVkVG9wO1xuICAgICAgICAgICAgdGVtcFJlY3QueSA9IG9yaWdpbmFsWCArIHJlY3QueSAtIHRyaW1tZWRMZWZ0O1xuICAgICAgICAgICAgaWYgKHRlbXBSZWN0LnkgPCAwKSB7XG4gICAgICAgICAgICAgICAgdGVtcFJlY3QuaGVpZ2h0ID0gdGVtcFJlY3QuaGVpZ2h0ICsgdHJpbW1lZFRvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpc1JvdGF0ZWQ7XG4gICAgfVxuXG4gICAgX2NvbXB1dGVBbGlnbm1lbnRPZmZzZXQoKSB7XG4gICAgICAgIF9saW5lc09mZnNldFgubGVuZ3RoID0gMDtcblxuICAgICAgICBzd2l0Y2ggKF9oQWxpZ24pIHtcbiAgICAgICAgICAgIGNhc2UgbWFjcm8uVGV4dEFsaWdubWVudC5MRUZUOlxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgX251bWJlck9mTGluZXM7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICBfbGluZXNPZmZzZXRYLnB1c2goMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBtYWNyby5UZXh0QWxpZ25tZW50LkNFTlRFUjpcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IF9saW5lc1dpZHRoLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBfbGluZXNPZmZzZXRYLnB1c2goKF9jb250ZW50U2l6ZS53aWR0aCAtIF9saW5lc1dpZHRoW2ldKSAvIDIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgbWFjcm8uVGV4dEFsaWdubWVudC5SSUdIVDpcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IF9saW5lc1dpZHRoLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBfbGluZXNPZmZzZXRYLnB1c2goX2NvbnRlbnRTaXplLndpZHRoIC0gX2xpbmVzV2lkdGhbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUT1BcbiAgICAgICAgX2xldHRlck9mZnNldFkgPSBfY29udGVudFNpemUuaGVpZ2h0O1xuICAgICAgICBpZiAoX3ZBbGlnbiAhPT0gbWFjcm8uVmVydGljYWxUZXh0QWxpZ25tZW50LlRPUCkge1xuICAgICAgICAgICAgbGV0IGJsYW5rID0gX2NvbnRlbnRTaXplLmhlaWdodCAtIF90ZXh0RGVzaXJlZEhlaWdodCArIF9saW5lSGVpZ2h0ICogdGhpcy5fZ2V0Rm9udFNjYWxlKCkgLSBfb3JpZ2luRm9udFNpemUgKiBfYm1mb250U2NhbGU7XG4gICAgICAgICAgICBpZiAoX3ZBbGlnbiA9PT0gbWFjcm8uVmVydGljYWxUZXh0QWxpZ25tZW50LkJPVFRPTSkge1xuICAgICAgICAgICAgICAgIC8vIEJPVFRPTVxuICAgICAgICAgICAgICAgIF9sZXR0ZXJPZmZzZXRZIC09IGJsYW5rO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBDRU5URVI6XG4gICAgICAgICAgICAgICAgX2xldHRlck9mZnNldFkgLT0gYmxhbmsgLyAyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3NldHVwQk1Gb250T3ZlcmZsb3dNZXRyaWNzKCkge1xuICAgICAgICBsZXQgbmV3V2lkdGggPSBfY29udGVudFNpemUud2lkdGgsXG4gICAgICAgICAgICBuZXdIZWlnaHQgPSBfY29udGVudFNpemUuaGVpZ2h0O1xuXG4gICAgICAgIGlmIChfb3ZlcmZsb3cgPT09IE92ZXJmbG93LlJFU0laRV9IRUlHSFQpIHtcbiAgICAgICAgICAgIG5ld0hlaWdodCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5OT05FKSB7XG4gICAgICAgICAgICBuZXdXaWR0aCA9IDA7XG4gICAgICAgICAgICBuZXdIZWlnaHQgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgX2xhYmVsV2lkdGggPSBuZXdXaWR0aDtcbiAgICAgICAgX2xhYmVsSGVpZ2h0ID0gbmV3SGVpZ2h0O1xuICAgICAgICBfbWF4TGluZVdpZHRoID0gbmV3V2lkdGg7XG4gICAgfVxuXG4gICAgdXBkYXRlV29ybGRWZXJ0cygpIHsgfVxuXG4gICAgYXBwZW5kUXVhZChjb21wLCB0ZXh0dXJlLCByZWN0LCByb3RhdGVkLCB4LCB5LCBzY2FsZSkgeyB9XG4gICAgX3F1YWRzVXBkYXRlZChjb21wKSB7IH1cblxuICAgIF9yZXNlcnZlUXVhZHMoKSB7IH1cbn0iXSwic291cmNlUm9vdCI6Ii8ifQ==