
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/particle/CCTIFFReader.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2011 Gordon P. Hemsley
 http://gphemsley.org/

 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
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
var debug = require('../core/CCDebug');
/**
 * cc.tiffReader is a singleton object, it's a tiff file reader, it can parse byte array to draw into a canvas
 * @class
 * @name tiffReader
 */


var tiffReader =
/** @lends tiffReader# */
{
  _littleEndian: false,
  _tiffData: null,
  _fileDirectories: [],
  getUint8: function getUint8(offset) {
    return this._tiffData[offset];
  },
  getUint16: function getUint16(offset) {
    if (this._littleEndian) return this._tiffData[offset + 1] << 8 | this._tiffData[offset];else return this._tiffData[offset] << 8 | this._tiffData[offset + 1];
  },
  getUint32: function getUint32(offset) {
    var a = this._tiffData;
    if (this._littleEndian) return a[offset + 3] << 24 | a[offset + 2] << 16 | a[offset + 1] << 8 | a[offset];else return a[offset] << 24 | a[offset + 1] << 16 | a[offset + 2] << 8 | a[offset + 3];
  },
  checkLittleEndian: function checkLittleEndian() {
    var BOM = this.getUint16(0);

    if (BOM === 0x4949) {
      this.littleEndian = true;
    } else if (BOM === 0x4D4D) {
      this.littleEndian = false;
    } else {
      console.log(BOM);
      throw TypeError(debug.getError(6019));
    }

    return this.littleEndian;
  },
  hasTowel: function hasTowel() {
    // Check for towel.
    if (this.getUint16(2) !== 42) {
      throw RangeError(debug.getError(6020));
      return false;
    }

    return true;
  },
  getFieldTypeName: function getFieldTypeName(fieldType) {
    var typeNames = this.fieldTypeNames;

    if (fieldType in typeNames) {
      return typeNames[fieldType];
    }

    return null;
  },
  getFieldTagName: function getFieldTagName(fieldTag) {
    var tagNames = this.fieldTagNames;

    if (fieldTag in tagNames) {
      return tagNames[fieldTag];
    } else {
      cc.logID(6021, fieldTag);
      return "Tag" + fieldTag;
    }
  },
  getFieldTypeLength: function getFieldTypeLength(fieldTypeName) {
    if (['BYTE', 'ASCII', 'SBYTE', 'UNDEFINED'].indexOf(fieldTypeName) !== -1) {
      return 1;
    } else if (['SHORT', 'SSHORT'].indexOf(fieldTypeName) !== -1) {
      return 2;
    } else if (['LONG', 'SLONG', 'FLOAT'].indexOf(fieldTypeName) !== -1) {
      return 4;
    } else if (['RATIONAL', 'SRATIONAL', 'DOUBLE'].indexOf(fieldTypeName) !== -1) {
      return 8;
    }

    return null;
  },
  getFieldValues: function getFieldValues(fieldTagName, fieldTypeName, typeCount, valueOffset) {
    var fieldValues = [];
    var fieldTypeLength = this.getFieldTypeLength(fieldTypeName);
    var fieldValueSize = fieldTypeLength * typeCount;

    if (fieldValueSize <= 4) {
      // The value is stored at the big end of the valueOffset.
      if (this.littleEndian === false) fieldValues.push(valueOffset >>> (4 - fieldTypeLength) * 8);else fieldValues.push(valueOffset);
    } else {
      for (var i = 0; i < typeCount; i++) {
        var indexOffset = fieldTypeLength * i;

        if (fieldTypeLength >= 8) {
          if (['RATIONAL', 'SRATIONAL'].indexOf(fieldTypeName) !== -1) {
            // Numerator
            fieldValues.push(this.getUint32(valueOffset + indexOffset)); // Denominator

            fieldValues.push(this.getUint32(valueOffset + indexOffset + 4));
          } else {
            cc.logID(8000);
          }
        } else {
          fieldValues.push(this.getBytes(fieldTypeLength, valueOffset + indexOffset));
        }
      }
    }

    if (fieldTypeName === 'ASCII') {
      fieldValues.forEach(function (e, i, a) {
        a[i] = String.fromCharCode(e);
      });
    }

    return fieldValues;
  },
  getBytes: function getBytes(numBytes, offset) {
    if (numBytes <= 0) {
      cc.logID(8001);
    } else if (numBytes <= 1) {
      return this.getUint8(offset);
    } else if (numBytes <= 2) {
      return this.getUint16(offset);
    } else if (numBytes <= 3) {
      return this.getUint32(offset) >>> 8;
    } else if (numBytes <= 4) {
      return this.getUint32(offset);
    } else {
      cc.logID(8002);
    }
  },
  getBits: function getBits(numBits, byteOffset, bitOffset) {
    bitOffset = bitOffset || 0;
    var extraBytes = Math.floor(bitOffset / 8);
    var newByteOffset = byteOffset + extraBytes;
    var totalBits = bitOffset + numBits;
    var shiftRight = 32 - numBits;
    var shiftLeft, rawBits;

    if (totalBits <= 0) {
      cc.logID(6023);
    } else if (totalBits <= 8) {
      shiftLeft = 24 + bitOffset;
      rawBits = this.getUint8(newByteOffset);
    } else if (totalBits <= 16) {
      shiftLeft = 16 + bitOffset;
      rawBits = this.getUint16(newByteOffset);
    } else if (totalBits <= 32) {
      shiftLeft = bitOffset;
      rawBits = this.getUint32(newByteOffset);
    } else {
      cc.logID(6022);
    }

    return {
      'bits': rawBits << shiftLeft >>> shiftRight,
      'byteOffset': newByteOffset + Math.floor(totalBits / 8),
      'bitOffset': totalBits % 8
    };
  },
  parseFileDirectory: function parseFileDirectory(byteOffset) {
    var numDirEntries = this.getUint16(byteOffset);
    var tiffFields = [];

    for (var i = byteOffset + 2, entryCount = 0; entryCount < numDirEntries; i += 12, entryCount++) {
      var fieldTag = this.getUint16(i);
      var fieldType = this.getUint16(i + 2);
      var typeCount = this.getUint32(i + 4);
      var valueOffset = this.getUint32(i + 8);
      var fieldTagName = this.getFieldTagName(fieldTag);
      var fieldTypeName = this.getFieldTypeName(fieldType);
      var fieldValues = this.getFieldValues(fieldTagName, fieldTypeName, typeCount, valueOffset);
      tiffFields[fieldTagName] = {
        type: fieldTypeName,
        values: fieldValues
      };
    }

    this._fileDirectories.push(tiffFields);

    var nextIFDByteOffset = this.getUint32(i);

    if (nextIFDByteOffset !== 0x00000000) {
      this.parseFileDirectory(nextIFDByteOffset);
    }
  },
  clampColorSample: function clampColorSample(colorSample, bitsPerSample) {
    var multiplier = Math.pow(2, 8 - bitsPerSample);
    return Math.floor(colorSample * multiplier + (multiplier - 1));
  },

  /**
   * @function
   * @param {Array} tiffData
   * @param {HTMLCanvasElement} canvas
   * @returns {*}
   */
  parseTIFF: function parseTIFF(tiffData, canvas) {
    canvas = canvas || document.createElement('canvas');
    this._tiffData = tiffData;
    this.canvas = canvas;
    this.checkLittleEndian();

    if (!this.hasTowel()) {
      return;
    }

    var firstIFDByteOffset = this.getUint32(4);
    this._fileDirectories.length = 0;
    this.parseFileDirectory(firstIFDByteOffset);
    var fileDirectory = this._fileDirectories[0];
    var imageWidth = fileDirectory['ImageWidth'].values[0];
    var imageLength = fileDirectory['ImageLength'].values[0];
    this.canvas.width = imageWidth;
    this.canvas.height = imageLength;
    var strips = [];
    var compression = fileDirectory['Compression'] ? fileDirectory['Compression'].values[0] : 1;
    var samplesPerPixel = fileDirectory['SamplesPerPixel'].values[0];
    var sampleProperties = [];
    var bitsPerPixel = 0;
    var hasBytesPerPixel = false;
    fileDirectory['BitsPerSample'].values.forEach(function (bitsPerSample, i, bitsPerSampleValues) {
      sampleProperties[i] = {
        bitsPerSample: bitsPerSample,
        hasBytesPerSample: false,
        bytesPerSample: undefined
      };

      if (bitsPerSample % 8 === 0) {
        sampleProperties[i].hasBytesPerSample = true;
        sampleProperties[i].bytesPerSample = bitsPerSample / 8;
      }

      bitsPerPixel += bitsPerSample;
    }, this);

    if (bitsPerPixel % 8 === 0) {
      hasBytesPerPixel = true;
      var bytesPerPixel = bitsPerPixel / 8;
    }

    var stripOffsetValues = fileDirectory['StripOffsets'].values;
    var numStripOffsetValues = stripOffsetValues.length; // StripByteCounts is supposed to be required, but see if we can recover anyway.

    if (fileDirectory['StripByteCounts']) {
      var stripByteCountValues = fileDirectory['StripByteCounts'].values;
    } else {
      cc.logID(8003); // Infer StripByteCounts, if possible.

      if (numStripOffsetValues === 1) {
        var stripByteCountValues = [Math.ceil(imageWidth * imageLength * bitsPerPixel / 8)];
      } else {
        throw Error(debug.getError(6024));
      }
    } // Loop through strips and decompress as necessary.


    for (var i = 0; i < numStripOffsetValues; i++) {
      var stripOffset = stripOffsetValues[i];
      strips[i] = [];
      var stripByteCount = stripByteCountValues[i]; // Loop through pixels.

      for (var byteOffset = 0, bitOffset = 0, jIncrement = 1, getHeader = true, pixel = [], numBytes = 0, sample = 0, currentSample = 0; byteOffset < stripByteCount; byteOffset += jIncrement) {
        // Decompress strip.
        switch (compression) {
          // Uncompressed
          case 1:
            // Loop through samples (sub-pixels).
            for (var m = 0, pixel = []; m < samplesPerPixel; m++) {
              if (sampleProperties[m].hasBytesPerSample) {
                // XXX: This is wrong!
                var sampleOffset = sampleProperties[m].bytesPerSample * m;
                pixel.push(this.getBytes(sampleProperties[m].bytesPerSample, stripOffset + byteOffset + sampleOffset));
              } else {
                var sampleInfo = this.getBits(sampleProperties[m].bitsPerSample, stripOffset + byteOffset, bitOffset);
                pixel.push(sampleInfo.bits);
                byteOffset = sampleInfo.byteOffset - stripOffset;
                bitOffset = sampleInfo.bitOffset;
                throw RangeError(debug.getError(6025));
              }
            }

            strips[i].push(pixel);

            if (hasBytesPerPixel) {
              jIncrement = bytesPerPixel;
            } else {
              jIncrement = 0;
              throw RangeError(debug.getError(6026));
            }

            break;
          // CITT Group 3 1-Dimensional Modified Huffman run-length encoding

          case 2:
            // XXX: Use PDF.js code?
            break;
          // Group 3 Fax

          case 3:
            // XXX: Use PDF.js code?
            break;
          // Group 4 Fax

          case 4:
            // XXX: Use PDF.js code?
            break;
          // LZW

          case 5:
            // XXX: Use PDF.js code?
            break;
          // Old-style JPEG (TIFF 6.0)

          case 6:
            // XXX: Use PDF.js code?
            break;
          // New-style JPEG (TIFF Specification Supplement 2)

          case 7:
            // XXX: Use PDF.js code?
            break;
          // PackBits

          case 32773:
            // Are we ready for a new block?
            if (getHeader) {
              getHeader = false;
              var blockLength = 1;
              var iterations = 1; // The header byte is signed.

              var header = this.getInt8(stripOffset + byteOffset);

              if (header >= 0 && header <= 127) {
                // Normal pixels.
                blockLength = header + 1;
              } else if (header >= -127 && header <= -1) {
                // Collapsed pixels.
                iterations = -header + 1;
              } else
                /*if (header === -128)*/
                {
                  // Placeholder byte?
                  getHeader = true;
                }
            } else {
              var currentByte = this.getUint8(stripOffset + byteOffset); // Duplicate bytes, if necessary.

              for (var m = 0; m < iterations; m++) {
                if (sampleProperties[sample].hasBytesPerSample) {
                  // We're reading one byte at a time, so we need to handle multi-byte samples.
                  currentSample = currentSample << 8 * numBytes | currentByte;
                  numBytes++; // Is our sample complete?

                  if (numBytes === sampleProperties[sample].bytesPerSample) {
                    pixel.push(currentSample);
                    currentSample = numBytes = 0;
                    sample++;
                  }
                } else {
                  throw RangeError(debug.getError(6025));
                } // Is our pixel complete?


                if (sample === samplesPerPixel) {
                  strips[i].push(pixel);
                  pixel = [];
                  sample = 0;
                }
              }

              blockLength--; // Is our block complete?

              if (blockLength === 0) {
                getHeader = true;
              }
            }

            jIncrement = 1;
            break;
          // Unknown compression algorithm

          default:
            // Do not attempt to parse the image data.
            break;
        }
      }
    }

    if (canvas.getContext) {
      var ctx = this.canvas.getContext("2d"); // Set a default fill style.

      ctx.fillStyle = "rgba(255, 255, 255, 0)"; // If RowsPerStrip is missing, the whole image is in one strip.

      var rowsPerStrip = fileDirectory['RowsPerStrip'] ? fileDirectory['RowsPerStrip'].values[0] : imageLength;
      var numStrips = strips.length;
      var imageLengthModRowsPerStrip = imageLength % rowsPerStrip;
      var rowsInLastStrip = imageLengthModRowsPerStrip === 0 ? rowsPerStrip : imageLengthModRowsPerStrip;
      var numRowsInStrip = rowsPerStrip;
      var numRowsInPreviousStrip = 0;
      var photometricInterpretation = fileDirectory['PhotometricInterpretation'].values[0];
      var extraSamplesValues = [];
      var numExtraSamples = 0;

      if (fileDirectory['ExtraSamples']) {
        extraSamplesValues = fileDirectory['ExtraSamples'].values;
        numExtraSamples = extraSamplesValues.length;
      }

      if (fileDirectory['ColorMap']) {
        var colorMapValues = fileDirectory['ColorMap'].values;
        var colorMapSampleSize = Math.pow(2, sampleProperties[0].bitsPerSample);
      } // Loop through the strips in the image.


      for (var i = 0; i < numStrips; i++) {
        // The last strip may be short.
        if (i + 1 === numStrips) {
          numRowsInStrip = rowsInLastStrip;
        }

        var numPixels = strips[i].length;
        var yPadding = numRowsInPreviousStrip * i; // Loop through the rows in the strip.

        for (var y = 0, j = 0; y < numRowsInStrip, j < numPixels; y++) {
          // Loop through the pixels in the row.
          for (var x = 0; x < imageWidth; x++, j++) {
            var pixelSamples = strips[i][j];
            var red = 0;
            var green = 0;
            var blue = 0;
            var opacity = 1.0;

            if (numExtraSamples > 0) {
              for (var k = 0; k < numExtraSamples; k++) {
                if (extraSamplesValues[k] === 1 || extraSamplesValues[k] === 2) {
                  // Clamp opacity to the range [0,1].
                  opacity = pixelSamples[3 + k] / 256;
                  break;
                }
              }
            }

            switch (photometricInterpretation) {
              // Bilevel or Grayscale
              // WhiteIsZero
              case 0:
                if (sampleProperties[0].hasBytesPerSample) {
                  var invertValue = Math.pow(0x10, sampleProperties[0].bytesPerSample * 2);
                } // Invert samples.


                pixelSamples.forEach(function (sample, index, samples) {
                  samples[index] = invertValue - sample;
                });
              // Bilevel or Grayscale
              // BlackIsZero

              case 1:
                red = green = blue = this.clampColorSample(pixelSamples[0], sampleProperties[0].bitsPerSample);
                break;
              // RGB Full Color

              case 2:
                red = this.clampColorSample(pixelSamples[0], sampleProperties[0].bitsPerSample);
                green = this.clampColorSample(pixelSamples[1], sampleProperties[1].bitsPerSample);
                blue = this.clampColorSample(pixelSamples[2], sampleProperties[2].bitsPerSample);
                break;
              // RGB Color Palette

              case 3:
                if (colorMapValues === undefined) {
                  throw Error(debug.getError(6027));
                }

                var colorMapIndex = pixelSamples[0];
                red = this.clampColorSample(colorMapValues[colorMapIndex], 16);
                green = this.clampColorSample(colorMapValues[colorMapSampleSize + colorMapIndex], 16);
                blue = this.clampColorSample(colorMapValues[2 * colorMapSampleSize + colorMapIndex], 16);
                break;
              // Unknown Photometric Interpretation

              default:
                throw RangeError(debug.getError(6028, photometricInterpretation));
                break;
            }

            ctx.fillStyle = "rgba(" + red + ", " + green + ", " + blue + ", " + opacity + ")";
            ctx.fillRect(x, yPadding + y, 1, 1);
          }
        }

        numRowsInPreviousStrip = numRowsInStrip;
      }
    }

    return this.canvas;
  },
  // See: http://www.digitizationguidelines.gov/guidelines/TIFF_Metadata_Final.pdf
  // See: http://www.digitalpreservation.gov/formats/content/tiff_tags.shtml
  fieldTagNames: {
    // TIFF Baseline
    0x013B: 'Artist',
    0x0102: 'BitsPerSample',
    0x0109: 'CellLength',
    0x0108: 'CellWidth',
    0x0140: 'ColorMap',
    0x0103: 'Compression',
    0x8298: 'Copyright',
    0x0132: 'DateTime',
    0x0152: 'ExtraSamples',
    0x010A: 'FillOrder',
    0x0121: 'FreeByteCounts',
    0x0120: 'FreeOffsets',
    0x0123: 'GrayResponseCurve',
    0x0122: 'GrayResponseUnit',
    0x013C: 'HostComputer',
    0x010E: 'ImageDescription',
    0x0101: 'ImageLength',
    0x0100: 'ImageWidth',
    0x010F: 'Make',
    0x0119: 'MaxSampleValue',
    0x0118: 'MinSampleValue',
    0x0110: 'Model',
    0x00FE: 'NewSubfileType',
    0x0112: 'Orientation',
    0x0106: 'PhotometricInterpretation',
    0x011C: 'PlanarConfiguration',
    0x0128: 'ResolutionUnit',
    0x0116: 'RowsPerStrip',
    0x0115: 'SamplesPerPixel',
    0x0131: 'Software',
    0x0117: 'StripByteCounts',
    0x0111: 'StripOffsets',
    0x00FF: 'SubfileType',
    0x0107: 'Threshholding',
    0x011A: 'XResolution',
    0x011B: 'YResolution',
    // TIFF Extended
    0x0146: 'BadFaxLines',
    0x0147: 'CleanFaxData',
    0x0157: 'ClipPath',
    0x0148: 'ConsecutiveBadFaxLines',
    0x01B1: 'Decode',
    0x01B2: 'DefaultImageColor',
    0x010D: 'DocumentName',
    0x0150: 'DotRange',
    0x0141: 'HalftoneHints',
    0x015A: 'Indexed',
    0x015B: 'JPEGTables',
    0x011D: 'PageName',
    0x0129: 'PageNumber',
    0x013D: 'Predictor',
    0x013F: 'PrimaryChromaticities',
    0x0214: 'ReferenceBlackWhite',
    0x0153: 'SampleFormat',
    0x022F: 'StripRowCounts',
    0x014A: 'SubIFDs',
    0x0124: 'T4Options',
    0x0125: 'T6Options',
    0x0145: 'TileByteCounts',
    0x0143: 'TileLength',
    0x0144: 'TileOffsets',
    0x0142: 'TileWidth',
    0x012D: 'TransferFunction',
    0x013E: 'WhitePoint',
    0x0158: 'XClipPathUnits',
    0x011E: 'XPosition',
    0x0211: 'YCbCrCoefficients',
    0x0213: 'YCbCrPositioning',
    0x0212: 'YCbCrSubSampling',
    0x0159: 'YClipPathUnits',
    0x011F: 'YPosition',
    // EXIF
    0x9202: 'ApertureValue',
    0xA001: 'ColorSpace',
    0x9004: 'DateTimeDigitized',
    0x9003: 'DateTimeOriginal',
    0x8769: 'Exif IFD',
    0x9000: 'ExifVersion',
    0x829A: 'ExposureTime',
    0xA300: 'FileSource',
    0x9209: 'Flash',
    0xA000: 'FlashpixVersion',
    0x829D: 'FNumber',
    0xA420: 'ImageUniqueID',
    0x9208: 'LightSource',
    0x927C: 'MakerNote',
    0x9201: 'ShutterSpeedValue',
    0x9286: 'UserComment',
    // IPTC
    0x83BB: 'IPTC',
    // ICC
    0x8773: 'ICC Profile',
    // XMP
    0x02BC: 'XMP',
    // GDAL
    0xA480: 'GDAL_METADATA',
    0xA481: 'GDAL_NODATA',
    // Photoshop
    0x8649: 'Photoshop'
  },
  fieldTypeNames: {
    0x0001: 'BYTE',
    0x0002: 'ASCII',
    0x0003: 'SHORT',
    0x0004: 'LONG',
    0x0005: 'RATIONAL',
    0x0006: 'SBYTE',
    0x0007: 'UNDEFINED',
    0x0008: 'SSHORT',
    0x0009: 'SLONG',
    0x000A: 'SRATIONAL',
    0x000B: 'FLOAT',
    0x000C: 'DOUBLE'
  }
};
module.exports = tiffReader;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9wYXJ0aWNsZS9DQ1RJRkZSZWFkZXIuanMiXSwibmFtZXMiOlsiZGVidWciLCJyZXF1aXJlIiwidGlmZlJlYWRlciIsIl9saXR0bGVFbmRpYW4iLCJfdGlmZkRhdGEiLCJfZmlsZURpcmVjdG9yaWVzIiwiZ2V0VWludDgiLCJvZmZzZXQiLCJnZXRVaW50MTYiLCJnZXRVaW50MzIiLCJhIiwiY2hlY2tMaXR0bGVFbmRpYW4iLCJCT00iLCJsaXR0bGVFbmRpYW4iLCJjb25zb2xlIiwibG9nIiwiVHlwZUVycm9yIiwiZ2V0RXJyb3IiLCJoYXNUb3dlbCIsIlJhbmdlRXJyb3IiLCJnZXRGaWVsZFR5cGVOYW1lIiwiZmllbGRUeXBlIiwidHlwZU5hbWVzIiwiZmllbGRUeXBlTmFtZXMiLCJnZXRGaWVsZFRhZ05hbWUiLCJmaWVsZFRhZyIsInRhZ05hbWVzIiwiZmllbGRUYWdOYW1lcyIsImNjIiwibG9nSUQiLCJnZXRGaWVsZFR5cGVMZW5ndGgiLCJmaWVsZFR5cGVOYW1lIiwiaW5kZXhPZiIsImdldEZpZWxkVmFsdWVzIiwiZmllbGRUYWdOYW1lIiwidHlwZUNvdW50IiwidmFsdWVPZmZzZXQiLCJmaWVsZFZhbHVlcyIsImZpZWxkVHlwZUxlbmd0aCIsImZpZWxkVmFsdWVTaXplIiwicHVzaCIsImkiLCJpbmRleE9mZnNldCIsImdldEJ5dGVzIiwiZm9yRWFjaCIsImUiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJudW1CeXRlcyIsImdldEJpdHMiLCJudW1CaXRzIiwiYnl0ZU9mZnNldCIsImJpdE9mZnNldCIsImV4dHJhQnl0ZXMiLCJNYXRoIiwiZmxvb3IiLCJuZXdCeXRlT2Zmc2V0IiwidG90YWxCaXRzIiwic2hpZnRSaWdodCIsInNoaWZ0TGVmdCIsInJhd0JpdHMiLCJwYXJzZUZpbGVEaXJlY3RvcnkiLCJudW1EaXJFbnRyaWVzIiwidGlmZkZpZWxkcyIsImVudHJ5Q291bnQiLCJ0eXBlIiwidmFsdWVzIiwibmV4dElGREJ5dGVPZmZzZXQiLCJjbGFtcENvbG9yU2FtcGxlIiwiY29sb3JTYW1wbGUiLCJiaXRzUGVyU2FtcGxlIiwibXVsdGlwbGllciIsInBvdyIsInBhcnNlVElGRiIsInRpZmZEYXRhIiwiY2FudmFzIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiZmlyc3RJRkRCeXRlT2Zmc2V0IiwibGVuZ3RoIiwiZmlsZURpcmVjdG9yeSIsImltYWdlV2lkdGgiLCJpbWFnZUxlbmd0aCIsIndpZHRoIiwiaGVpZ2h0Iiwic3RyaXBzIiwiY29tcHJlc3Npb24iLCJzYW1wbGVzUGVyUGl4ZWwiLCJzYW1wbGVQcm9wZXJ0aWVzIiwiYml0c1BlclBpeGVsIiwiaGFzQnl0ZXNQZXJQaXhlbCIsImJpdHNQZXJTYW1wbGVWYWx1ZXMiLCJoYXNCeXRlc1BlclNhbXBsZSIsImJ5dGVzUGVyU2FtcGxlIiwidW5kZWZpbmVkIiwiYnl0ZXNQZXJQaXhlbCIsInN0cmlwT2Zmc2V0VmFsdWVzIiwibnVtU3RyaXBPZmZzZXRWYWx1ZXMiLCJzdHJpcEJ5dGVDb3VudFZhbHVlcyIsImNlaWwiLCJFcnJvciIsInN0cmlwT2Zmc2V0Iiwic3RyaXBCeXRlQ291bnQiLCJqSW5jcmVtZW50IiwiZ2V0SGVhZGVyIiwicGl4ZWwiLCJzYW1wbGUiLCJjdXJyZW50U2FtcGxlIiwibSIsInNhbXBsZU9mZnNldCIsInNhbXBsZUluZm8iLCJiaXRzIiwiYmxvY2tMZW5ndGgiLCJpdGVyYXRpb25zIiwiaGVhZGVyIiwiZ2V0SW50OCIsImN1cnJlbnRCeXRlIiwiZ2V0Q29udGV4dCIsImN0eCIsImZpbGxTdHlsZSIsInJvd3NQZXJTdHJpcCIsIm51bVN0cmlwcyIsImltYWdlTGVuZ3RoTW9kUm93c1BlclN0cmlwIiwicm93c0luTGFzdFN0cmlwIiwibnVtUm93c0luU3RyaXAiLCJudW1Sb3dzSW5QcmV2aW91c1N0cmlwIiwicGhvdG9tZXRyaWNJbnRlcnByZXRhdGlvbiIsImV4dHJhU2FtcGxlc1ZhbHVlcyIsIm51bUV4dHJhU2FtcGxlcyIsImNvbG9yTWFwVmFsdWVzIiwiY29sb3JNYXBTYW1wbGVTaXplIiwibnVtUGl4ZWxzIiwieVBhZGRpbmciLCJ5IiwiaiIsIngiLCJwaXhlbFNhbXBsZXMiLCJyZWQiLCJncmVlbiIsImJsdWUiLCJvcGFjaXR5IiwiayIsImludmVydFZhbHVlIiwiaW5kZXgiLCJzYW1wbGVzIiwiY29sb3JNYXBJbmRleCIsImZpbGxSZWN0IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLEtBQUssR0FBR0MsT0FBTyxDQUFDLGlCQUFELENBQXJCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBSUMsVUFBVTtBQUFHO0FBQXlCO0FBQ3RDQyxFQUFBQSxhQUFhLEVBQUUsS0FEdUI7QUFFdENDLEVBQUFBLFNBQVMsRUFBRSxJQUYyQjtBQUd0Q0MsRUFBQUEsZ0JBQWdCLEVBQUUsRUFIb0I7QUFLdENDLEVBQUFBLFFBQVEsRUFBRSxrQkFBVUMsTUFBVixFQUFrQjtBQUN4QixXQUFPLEtBQUtILFNBQUwsQ0FBZUcsTUFBZixDQUFQO0FBQ0gsR0FQcUM7QUFTdENDLEVBQUFBLFNBQVMsRUFBRSxtQkFBVUQsTUFBVixFQUFrQjtBQUN6QixRQUFJLEtBQUtKLGFBQVQsRUFDSSxPQUFRLEtBQUtDLFNBQUwsQ0FBZUcsTUFBTSxHQUFHLENBQXhCLEtBQThCLENBQS9CLEdBQXFDLEtBQUtILFNBQUwsQ0FBZUcsTUFBZixDQUE1QyxDQURKLEtBR0ksT0FBUSxLQUFLSCxTQUFMLENBQWVHLE1BQWYsS0FBMEIsQ0FBM0IsR0FBaUMsS0FBS0gsU0FBTCxDQUFlRyxNQUFNLEdBQUcsQ0FBeEIsQ0FBeEM7QUFDUCxH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QUFRLGtCQXRFRztBQXVFWCxZQUFRLGtCQXZFRztBQXdFWCxZQUFRLGdCQXhFRztBQXlFWCxZQUFRLFdBekVHO0FBMkVYO0FBQ0EsWUFBUSxlQTVFRztBQTZFWCxZQUFRLFlBN0VHO0FBOEVYLFlBQVEsbUJBOUVHO0FBK0VYLFlBQVEsa0JBL0VHO0FBZ0ZYLFlBQVEsVUFoRkc7QUFpRlgsWUFBUSxhQWpGRztBQWtGWCxZQUFRLGNBbEZHO0FBbUZYLFlBQVEsWUFuRkc7QUFvRlgsWUFBUSxPQXBGRztBQXFGWCxZQUFRLGlCQXJGRztBQXNGWCxZQUFRLFNBdEZHO0FBdUZYLFlBQVEsZUF2Rkc7QUF3RlgsWUFBUSxhQXhGRztBQXlGWCxZQUFRLFdBekZHO0FBMEZYLFlBQVEsbUJBMUZHO0FBMkZYLFlBQVEsYUEzRkc7QUE2Rlg7QUFDQSxZQUFRLE1BOUZHO0FBZ0dYO0FBQ0EsWUFBUSxhQWpHRztBQW1HWDtBQUNBLFlBQVEsS0FwR0c7QUFzR1g7QUFDQSxZQUFRLGVBdkdHO0FBd0dYLFlBQVEsYUF4R0c7QUEwR1g7QUFDQSxZQUFRO0FBM0dHLEdBcmhCdUI7QUFtb0J0Q0osRUFBQUEsY0FBYyxFQUFFO0FBQ1osWUFBUSxNQURJO0FBRVosWUFBUSxPQUZJO0FBR1osWUFBUSxPQUhJO0FBSVosWUFBUSxNQUpJO0FBS1osWUFBUSxVQUxJO0FBTVosWUFBUSxPQU5JO0FBT1osWUFBUSxXQVBJO0FBUVosWUFBUSxRQVJJO0FBU1osWUFBUSxPQVRJO0FBVVosWUFBUSxXQVZJO0FBV1osWUFBUSxPQVhJO0FBWVosWUFBUTtBQVpJO0FBbm9Cc0IsQ0FBMUM7QUFtcEJBNEgsTUFBTSxDQUFDQyxPQUFQLEdBQWlCbEosVUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMSBHb3Jkb24gUC4gSGVtc2xleVxuIGh0dHA6Ly9ncGhlbXNsZXkub3JnL1xuXG4gQ29weXJpZ2h0IChjKSAyMDA4LTIwMTAgUmljYXJkbyBRdWVzYWRhXG4gQ29weXJpZ2h0IChjKSAyMDExLTIwMTIgY29jb3MyZC14Lm9yZ1xuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3QgZGVidWcgPSByZXF1aXJlKCcuLi9jb3JlL0NDRGVidWcnKTtcblxuLyoqXG4gKiBjYy50aWZmUmVhZGVyIGlzIGEgc2luZ2xldG9uIG9iamVjdCwgaXQncyBhIHRpZmYgZmlsZSByZWFkZXIsIGl0IGNhbiBwYXJzZSBieXRlIGFycmF5IHRvIGRyYXcgaW50byBhIGNhbnZhc1xuICogQGNsYXNzXG4gKiBAbmFtZSB0aWZmUmVhZGVyXG4gKi9cbnZhciB0aWZmUmVhZGVyID0gLyoqIEBsZW5kcyB0aWZmUmVhZGVyIyAqL3tcbiAgICBfbGl0dGxlRW5kaWFuOiBmYWxzZSxcbiAgICBfdGlmZkRhdGE6IG51bGwsXG4gICAgX2ZpbGVEaXJlY3RvcmllczogW10sXG5cbiAgICBnZXRVaW50ODogZnVuY3Rpb24gKG9mZnNldCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGlmZkRhdGFbb2Zmc2V0XTtcbiAgICB9LFxuXG4gICAgZ2V0VWludDE2OiBmdW5jdGlvbiAob2Zmc2V0KSB7XG4gICAgICAgIGlmICh0aGlzLl9saXR0bGVFbmRpYW4pXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuX3RpZmZEYXRhW29mZnNldCArIDFdIDw8IDgpIHwgKHRoaXMuX3RpZmZEYXRhW29mZnNldF0pO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuX3RpZmZEYXRhW29mZnNldF0gPDwgOCkgfCAodGhpcy5fdGlmZkRhdGFbb2Zmc2V0ICsgMV0pO1xuICAgIH0sXG5cbiAgICBnZXRVaW50MzI6IGZ1bmN0aW9uIChvZmZzZXQpIHtcbiAgICAgICAgdmFyIGEgPSB0aGlzLl90aWZmRGF0YTtcbiAgICAgICAgaWYgKHRoaXMuX2xpdHRsZUVuZGlhbilcbiAgICAgICAgICAgIHJldHVybiAoYVtvZmZzZXQgKyAzXSA8PCAyNCkgfCAoYVtvZmZzZXQgKyAyXSA8PCAxNikgfCAoYVtvZmZzZXQgKyAxXSA8PCA4KSB8IChhW29mZnNldF0pO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gKGFbb2Zmc2V0XSA8PCAyNCkgfCAoYVtvZmZzZXQgKyAxXSA8PCAxNikgfCAoYVtvZmZzZXQgKyAyXSA8PCA4KSB8IChhW29mZnNldCArIDNdKTtcbiAgICB9LFxuXG4gICAgY2hlY2tMaXR0bGVFbmRpYW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIEJPTSA9IHRoaXMuZ2V0VWludDE2KDApO1xuXG4gICAgICAgIGlmIChCT00gPT09IDB4NDk0OSkge1xuICAgICAgICAgICAgdGhpcy5saXR0bGVFbmRpYW4gPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKEJPTSA9PT0gMHg0RDREKSB7XG4gICAgICAgICAgICB0aGlzLmxpdHRsZUVuZGlhbiA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coQk9NKTtcbiAgICAgICAgICAgIHRocm93IFR5cGVFcnJvcihkZWJ1Zy5nZXRFcnJvcig2MDE5KSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5saXR0bGVFbmRpYW47XG4gICAgfSxcblxuICAgIGhhc1Rvd2VsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIENoZWNrIGZvciB0b3dlbC5cbiAgICAgICAgaWYgKHRoaXMuZ2V0VWludDE2KDIpICE9PSA0Mikge1xuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvcihkZWJ1Zy5nZXRFcnJvcig2MDIwKSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgZ2V0RmllbGRUeXBlTmFtZTogZnVuY3Rpb24gKGZpZWxkVHlwZSkge1xuICAgICAgICB2YXIgdHlwZU5hbWVzID0gdGhpcy5maWVsZFR5cGVOYW1lcztcbiAgICAgICAgaWYgKGZpZWxkVHlwZSBpbiB0eXBlTmFtZXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlTmFtZXNbZmllbGRUeXBlXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgZ2V0RmllbGRUYWdOYW1lOiBmdW5jdGlvbiAoZmllbGRUYWcpIHtcbiAgICAgICAgdmFyIHRhZ05hbWVzID0gdGhpcy5maWVsZFRhZ05hbWVzO1xuXG4gICAgICAgIGlmIChmaWVsZFRhZyBpbiB0YWdOYW1lcykge1xuICAgICAgICAgICAgcmV0dXJuIHRhZ05hbWVzW2ZpZWxkVGFnXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLmxvZ0lEKDYwMjEsIGZpZWxkVGFnKTtcbiAgICAgICAgICAgIHJldHVybiBcIlRhZ1wiICsgZmllbGRUYWc7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0RmllbGRUeXBlTGVuZ3RoOiBmdW5jdGlvbiAoZmllbGRUeXBlTmFtZSkge1xuICAgICAgICBpZiAoWydCWVRFJywgJ0FTQ0lJJywgJ1NCWVRFJywgJ1VOREVGSU5FRCddLmluZGV4T2YoZmllbGRUeXBlTmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfSBlbHNlIGlmIChbJ1NIT1JUJywgJ1NTSE9SVCddLmluZGV4T2YoZmllbGRUeXBlTmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gMjtcbiAgICAgICAgfSBlbHNlIGlmIChbJ0xPTkcnLCAnU0xPTkcnLCAnRkxPQVQnXS5pbmRleE9mKGZpZWxkVHlwZU5hbWUpICE9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIDQ7XG4gICAgICAgIH0gZWxzZSBpZiAoWydSQVRJT05BTCcsICdTUkFUSU9OQUwnLCAnRE9VQkxFJ10uaW5kZXhPZihmaWVsZFR5cGVOYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiA4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICBnZXRGaWVsZFZhbHVlczogZnVuY3Rpb24gKGZpZWxkVGFnTmFtZSwgZmllbGRUeXBlTmFtZSwgdHlwZUNvdW50LCB2YWx1ZU9mZnNldCkge1xuICAgICAgICB2YXIgZmllbGRWYWx1ZXMgPSBbXTtcbiAgICAgICAgdmFyIGZpZWxkVHlwZUxlbmd0aCA9IHRoaXMuZ2V0RmllbGRUeXBlTGVuZ3RoKGZpZWxkVHlwZU5hbWUpO1xuICAgICAgICB2YXIgZmllbGRWYWx1ZVNpemUgPSBmaWVsZFR5cGVMZW5ndGggKiB0eXBlQ291bnQ7XG5cbiAgICAgICAgaWYgKGZpZWxkVmFsdWVTaXplIDw9IDQpIHtcbiAgICAgICAgICAgIC8vIFRoZSB2YWx1ZSBpcyBzdG9yZWQgYXQgdGhlIGJpZyBlbmQgb2YgdGhlIHZhbHVlT2Zmc2V0LlxuICAgICAgICAgICAgaWYgKHRoaXMubGl0dGxlRW5kaWFuID09PSBmYWxzZSlcbiAgICAgICAgICAgICAgICBmaWVsZFZhbHVlcy5wdXNoKHZhbHVlT2Zmc2V0ID4+PiAoKDQgLSBmaWVsZFR5cGVMZW5ndGgpICogOCkpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGZpZWxkVmFsdWVzLnB1c2godmFsdWVPZmZzZXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0eXBlQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpbmRleE9mZnNldCA9IGZpZWxkVHlwZUxlbmd0aCAqIGk7XG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkVHlwZUxlbmd0aCA+PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChbJ1JBVElPTkFMJywgJ1NSQVRJT05BTCddLmluZGV4T2YoZmllbGRUeXBlTmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBOdW1lcmF0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkVmFsdWVzLnB1c2godGhpcy5nZXRVaW50MzIodmFsdWVPZmZzZXQgKyBpbmRleE9mZnNldCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGVub21pbmF0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkVmFsdWVzLnB1c2godGhpcy5nZXRVaW50MzIodmFsdWVPZmZzZXQgKyBpbmRleE9mZnNldCArIDQpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmxvZ0lEKDgwMDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRWYWx1ZXMucHVzaCh0aGlzLmdldEJ5dGVzKGZpZWxkVHlwZUxlbmd0aCwgdmFsdWVPZmZzZXQgKyBpbmRleE9mZnNldCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaWVsZFR5cGVOYW1lID09PSAnQVNDSUknKSB7XG4gICAgICAgICAgICBmaWVsZFZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uIChlLCBpLCBhKSB7XG4gICAgICAgICAgICAgICAgYVtpXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmllbGRWYWx1ZXM7XG4gICAgfSxcblxuICAgIGdldEJ5dGVzOiBmdW5jdGlvbiAobnVtQnl0ZXMsIG9mZnNldCkge1xuICAgICAgICBpZiAobnVtQnl0ZXMgPD0gMCkge1xuICAgICAgICAgICAgY2MubG9nSUQoODAwMSk7XG4gICAgICAgIH0gZWxzZSBpZiAobnVtQnl0ZXMgPD0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VWludDgob2Zmc2V0KTtcbiAgICAgICAgfSBlbHNlIGlmIChudW1CeXRlcyA8PSAyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRVaW50MTYob2Zmc2V0KTtcbiAgICAgICAgfSBlbHNlIGlmIChudW1CeXRlcyA8PSAzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRVaW50MzIob2Zmc2V0KSA+Pj4gODtcbiAgICAgICAgfSBlbHNlIGlmIChudW1CeXRlcyA8PSA0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRVaW50MzIob2Zmc2V0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLmxvZ0lEKDgwMDIpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGdldEJpdHM6IGZ1bmN0aW9uIChudW1CaXRzLCBieXRlT2Zmc2V0LCBiaXRPZmZzZXQpIHtcbiAgICAgICAgYml0T2Zmc2V0ID0gYml0T2Zmc2V0IHx8IDA7XG4gICAgICAgIHZhciBleHRyYUJ5dGVzID0gTWF0aC5mbG9vcihiaXRPZmZzZXQgLyA4KTtcbiAgICAgICAgdmFyIG5ld0J5dGVPZmZzZXQgPSBieXRlT2Zmc2V0ICsgZXh0cmFCeXRlcztcbiAgICAgICAgdmFyIHRvdGFsQml0cyA9IGJpdE9mZnNldCArIG51bUJpdHM7XG4gICAgICAgIHZhciBzaGlmdFJpZ2h0ID0gMzIgLSBudW1CaXRzO1xuICAgICAgICB2YXIgc2hpZnRMZWZ0LHJhd0JpdHM7XG5cbiAgICAgICAgaWYgKHRvdGFsQml0cyA8PSAwKSB7XG4gICAgICAgICAgICBjYy5sb2dJRCg2MDIzKTtcbiAgICAgICAgfSBlbHNlIGlmICh0b3RhbEJpdHMgPD0gOCkge1xuICAgICAgICAgICAgc2hpZnRMZWZ0ID0gMjQgKyBiaXRPZmZzZXQ7XG4gICAgICAgICAgICByYXdCaXRzID0gdGhpcy5nZXRVaW50OChuZXdCeXRlT2Zmc2V0KTtcbiAgICAgICAgfSBlbHNlIGlmICh0b3RhbEJpdHMgPD0gMTYpIHtcbiAgICAgICAgICAgIHNoaWZ0TGVmdCA9IDE2ICsgYml0T2Zmc2V0O1xuICAgICAgICAgICAgcmF3Qml0cyA9IHRoaXMuZ2V0VWludDE2KG5ld0J5dGVPZmZzZXQpO1xuICAgICAgICB9IGVsc2UgaWYgKHRvdGFsQml0cyA8PSAzMikge1xuICAgICAgICAgICAgc2hpZnRMZWZ0ID0gYml0T2Zmc2V0O1xuICAgICAgICAgICAgcmF3Qml0cyA9IHRoaXMuZ2V0VWludDMyKG5ld0J5dGVPZmZzZXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2MubG9nSUQoNjAyMik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ2JpdHMnOiAoKHJhd0JpdHMgPDwgc2hpZnRMZWZ0KSA+Pj4gc2hpZnRSaWdodCksXG4gICAgICAgICAgICAnYnl0ZU9mZnNldCc6IG5ld0J5dGVPZmZzZXQgKyBNYXRoLmZsb29yKHRvdGFsQml0cyAvIDgpLFxuICAgICAgICAgICAgJ2JpdE9mZnNldCc6IHRvdGFsQml0cyAlIDhcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgcGFyc2VGaWxlRGlyZWN0b3J5OiBmdW5jdGlvbiAoYnl0ZU9mZnNldCkge1xuICAgICAgICB2YXIgbnVtRGlyRW50cmllcyA9IHRoaXMuZ2V0VWludDE2KGJ5dGVPZmZzZXQpO1xuICAgICAgICB2YXIgdGlmZkZpZWxkcyA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSBieXRlT2Zmc2V0ICsgMiwgZW50cnlDb3VudCA9IDA7IGVudHJ5Q291bnQgPCBudW1EaXJFbnRyaWVzOyBpICs9IDEyLCBlbnRyeUNvdW50KyspIHtcbiAgICAgICAgICAgIHZhciBmaWVsZFRhZyA9IHRoaXMuZ2V0VWludDE2KGkpO1xuICAgICAgICAgICAgdmFyIGZpZWxkVHlwZSA9IHRoaXMuZ2V0VWludDE2KGkgKyAyKTtcbiAgICAgICAgICAgIHZhciB0eXBlQ291bnQgPSB0aGlzLmdldFVpbnQzMihpICsgNCk7XG4gICAgICAgICAgICB2YXIgdmFsdWVPZmZzZXQgPSB0aGlzLmdldFVpbnQzMihpICsgOCk7XG5cbiAgICAgICAgICAgIHZhciBmaWVsZFRhZ05hbWUgPSB0aGlzLmdldEZpZWxkVGFnTmFtZShmaWVsZFRhZyk7XG4gICAgICAgICAgICB2YXIgZmllbGRUeXBlTmFtZSA9IHRoaXMuZ2V0RmllbGRUeXBlTmFtZShmaWVsZFR5cGUpO1xuICAgICAgICAgICAgdmFyIGZpZWxkVmFsdWVzID0gdGhpcy5nZXRGaWVsZFZhbHVlcyhmaWVsZFRhZ05hbWUsIGZpZWxkVHlwZU5hbWUsIHR5cGVDb3VudCwgdmFsdWVPZmZzZXQpO1xuXG4gICAgICAgICAgICB0aWZmRmllbGRzW2ZpZWxkVGFnTmFtZV0gPSB7IHR5cGU6IGZpZWxkVHlwZU5hbWUsIHZhbHVlczogZmllbGRWYWx1ZXMgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2ZpbGVEaXJlY3Rvcmllcy5wdXNoKHRpZmZGaWVsZHMpO1xuXG4gICAgICAgIHZhciBuZXh0SUZEQnl0ZU9mZnNldCA9IHRoaXMuZ2V0VWludDMyKGkpO1xuICAgICAgICBpZiAobmV4dElGREJ5dGVPZmZzZXQgIT09IDB4MDAwMDAwMDApIHtcbiAgICAgICAgICAgIHRoaXMucGFyc2VGaWxlRGlyZWN0b3J5KG5leHRJRkRCeXRlT2Zmc2V0KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjbGFtcENvbG9yU2FtcGxlOiBmdW5jdGlvbihjb2xvclNhbXBsZSwgYml0c1BlclNhbXBsZSkge1xuICAgICAgICB2YXIgbXVsdGlwbGllciA9IE1hdGgucG93KDIsIDggLSBiaXRzUGVyU2FtcGxlKTtcblxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoY29sb3JTYW1wbGUgKiBtdWx0aXBsaWVyKSArIChtdWx0aXBsaWVyIC0gMSkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge0FycmF5fSB0aWZmRGF0YVxuICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR9IGNhbnZhc1xuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIHBhcnNlVElGRjogZnVuY3Rpb24gKHRpZmZEYXRhLCBjYW52YXMpIHtcbiAgICAgICAgY2FudmFzID0gY2FudmFzIHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXG4gICAgICAgIHRoaXMuX3RpZmZEYXRhID0gdGlmZkRhdGE7XG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuXG4gICAgICAgIHRoaXMuY2hlY2tMaXR0bGVFbmRpYW4oKTtcblxuICAgICAgICBpZiAoIXRoaXMuaGFzVG93ZWwoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpcnN0SUZEQnl0ZU9mZnNldCA9IHRoaXMuZ2V0VWludDMyKDQpO1xuXG4gICAgICAgIHRoaXMuX2ZpbGVEaXJlY3Rvcmllcy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLnBhcnNlRmlsZURpcmVjdG9yeShmaXJzdElGREJ5dGVPZmZzZXQpO1xuXG4gICAgICAgIHZhciBmaWxlRGlyZWN0b3J5ID0gdGhpcy5fZmlsZURpcmVjdG9yaWVzWzBdO1xuXG4gICAgICAgIHZhciBpbWFnZVdpZHRoID0gZmlsZURpcmVjdG9yeVsnSW1hZ2VXaWR0aCddLnZhbHVlc1swXTtcbiAgICAgICAgdmFyIGltYWdlTGVuZ3RoID0gZmlsZURpcmVjdG9yeVsnSW1hZ2VMZW5ndGgnXS52YWx1ZXNbMF07XG5cbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSBpbWFnZVdpZHRoO1xuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBpbWFnZUxlbmd0aDtcblxuICAgICAgICB2YXIgc3RyaXBzID0gW107XG5cbiAgICAgICAgdmFyIGNvbXByZXNzaW9uID0gKGZpbGVEaXJlY3RvcnlbJ0NvbXByZXNzaW9uJ10pID8gZmlsZURpcmVjdG9yeVsnQ29tcHJlc3Npb24nXS52YWx1ZXNbMF0gOiAxO1xuXG4gICAgICAgIHZhciBzYW1wbGVzUGVyUGl4ZWwgPSBmaWxlRGlyZWN0b3J5WydTYW1wbGVzUGVyUGl4ZWwnXS52YWx1ZXNbMF07XG5cbiAgICAgICAgdmFyIHNhbXBsZVByb3BlcnRpZXMgPSBbXTtcblxuICAgICAgICB2YXIgYml0c1BlclBpeGVsID0gMDtcbiAgICAgICAgdmFyIGhhc0J5dGVzUGVyUGl4ZWwgPSBmYWxzZTtcblxuICAgICAgICBmaWxlRGlyZWN0b3J5WydCaXRzUGVyU2FtcGxlJ10udmFsdWVzLmZvckVhY2goZnVuY3Rpb24gKGJpdHNQZXJTYW1wbGUsIGksIGJpdHNQZXJTYW1wbGVWYWx1ZXMpIHtcbiAgICAgICAgICAgIHNhbXBsZVByb3BlcnRpZXNbaV0gPSB7XG4gICAgICAgICAgICAgICAgYml0c1BlclNhbXBsZTogYml0c1BlclNhbXBsZSxcbiAgICAgICAgICAgICAgICBoYXNCeXRlc1BlclNhbXBsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgYnl0ZXNQZXJTYW1wbGU6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKChiaXRzUGVyU2FtcGxlICUgOCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBzYW1wbGVQcm9wZXJ0aWVzW2ldLmhhc0J5dGVzUGVyU2FtcGxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzYW1wbGVQcm9wZXJ0aWVzW2ldLmJ5dGVzUGVyU2FtcGxlID0gYml0c1BlclNhbXBsZSAvIDg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJpdHNQZXJQaXhlbCArPSBiaXRzUGVyU2FtcGxlO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICBpZiAoKGJpdHNQZXJQaXhlbCAlIDgpID09PSAwKSB7XG4gICAgICAgICAgICBoYXNCeXRlc1BlclBpeGVsID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBieXRlc1BlclBpeGVsID0gYml0c1BlclBpeGVsIC8gODtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdHJpcE9mZnNldFZhbHVlcyA9IGZpbGVEaXJlY3RvcnlbJ1N0cmlwT2Zmc2V0cyddLnZhbHVlcztcbiAgICAgICAgdmFyIG51bVN0cmlwT2Zmc2V0VmFsdWVzID0gc3RyaXBPZmZzZXRWYWx1ZXMubGVuZ3RoO1xuXG4gICAgICAgIC8vIFN0cmlwQnl0ZUNvdW50cyBpcyBzdXBwb3NlZCB0byBiZSByZXF1aXJlZCwgYnV0IHNlZSBpZiB3ZSBjYW4gcmVjb3ZlciBhbnl3YXkuXG4gICAgICAgIGlmIChmaWxlRGlyZWN0b3J5WydTdHJpcEJ5dGVDb3VudHMnXSkge1xuICAgICAgICAgICAgdmFyIHN0cmlwQnl0ZUNvdW50VmFsdWVzID0gZmlsZURpcmVjdG9yeVsnU3RyaXBCeXRlQ291bnRzJ10udmFsdWVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2MubG9nSUQoODAwMyk7XG5cbiAgICAgICAgICAgIC8vIEluZmVyIFN0cmlwQnl0ZUNvdW50cywgaWYgcG9zc2libGUuXG4gICAgICAgICAgICBpZiAobnVtU3RyaXBPZmZzZXRWYWx1ZXMgPT09IDEpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3RyaXBCeXRlQ291bnRWYWx1ZXMgPSBbTWF0aC5jZWlsKChpbWFnZVdpZHRoICogaW1hZ2VMZW5ndGggKiBiaXRzUGVyUGl4ZWwpIC8gOCldO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihkZWJ1Zy5nZXRFcnJvcig2MDI0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBMb29wIHRocm91Z2ggc3RyaXBzIGFuZCBkZWNvbXByZXNzIGFzIG5lY2Vzc2FyeS5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1TdHJpcE9mZnNldFZhbHVlczsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc3RyaXBPZmZzZXQgPSBzdHJpcE9mZnNldFZhbHVlc1tpXTtcbiAgICAgICAgICAgIHN0cmlwc1tpXSA9IFtdO1xuXG4gICAgICAgICAgICB2YXIgc3RyaXBCeXRlQ291bnQgPSBzdHJpcEJ5dGVDb3VudFZhbHVlc1tpXTtcblxuICAgICAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHBpeGVscy5cbiAgICAgICAgICAgIGZvciAodmFyIGJ5dGVPZmZzZXQgPSAwLCBiaXRPZmZzZXQgPSAwLCBqSW5jcmVtZW50ID0gMSwgZ2V0SGVhZGVyID0gdHJ1ZSwgcGl4ZWwgPSBbXSwgbnVtQnl0ZXMgPSAwLCBzYW1wbGUgPSAwLCBjdXJyZW50U2FtcGxlID0gMDtcbiAgICAgICAgICAgICAgICAgYnl0ZU9mZnNldCA8IHN0cmlwQnl0ZUNvdW50OyBieXRlT2Zmc2V0ICs9IGpJbmNyZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAvLyBEZWNvbXByZXNzIHN0cmlwLlxuICAgICAgICAgICAgICAgIHN3aXRjaCAoY29tcHJlc3Npb24pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVW5jb21wcmVzc2VkXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCBzYW1wbGVzIChzdWItcGl4ZWxzKS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIG0gPSAwLCBwaXhlbCA9IFtdOyBtIDwgc2FtcGxlc1BlclBpeGVsOyBtKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2FtcGxlUHJvcGVydGllc1ttXS5oYXNCeXRlc1BlclNhbXBsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBYWFg6IFRoaXMgaXMgd3JvbmchXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzYW1wbGVPZmZzZXQgPSBzYW1wbGVQcm9wZXJ0aWVzW21dLmJ5dGVzUGVyU2FtcGxlICogbTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGl4ZWwucHVzaCh0aGlzLmdldEJ5dGVzKHNhbXBsZVByb3BlcnRpZXNbbV0uYnl0ZXNQZXJTYW1wbGUsIHN0cmlwT2Zmc2V0ICsgYnl0ZU9mZnNldCArIHNhbXBsZU9mZnNldCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzYW1wbGVJbmZvID0gdGhpcy5nZXRCaXRzKHNhbXBsZVByb3BlcnRpZXNbbV0uYml0c1BlclNhbXBsZSwgc3RyaXBPZmZzZXQgKyBieXRlT2Zmc2V0LCBiaXRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaXhlbC5wdXNoKHNhbXBsZUluZm8uYml0cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5dGVPZmZzZXQgPSBzYW1wbGVJbmZvLmJ5dGVPZmZzZXQgLSBzdHJpcE9mZnNldDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYml0T2Zmc2V0ID0gc2FtcGxlSW5mby5iaXRPZmZzZXQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvcihkZWJ1Zy5nZXRFcnJvcig2MDI1KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpcHNbaV0ucHVzaChwaXhlbCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNCeXRlc1BlclBpeGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgakluY3JlbWVudCA9IGJ5dGVzUGVyUGl4ZWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpJbmNyZW1lbnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IoZGVidWcuZ2V0RXJyb3IoNjAyNikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ0lUVCBHcm91cCAzIDEtRGltZW5zaW9uYWwgTW9kaWZpZWQgSHVmZm1hbiBydW4tbGVuZ3RoIGVuY29kaW5nXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFhYWDogVXNlIFBERi5qcyBjb2RlP1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gR3JvdXAgMyBGYXhcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gWFhYOiBVc2UgUERGLmpzIGNvZGU/XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAvLyBHcm91cCA0IEZheFxuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBYWFg6IFVzZSBQREYuanMgY29kZT9cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIExaV1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBYWFg6IFVzZSBQREYuanMgY29kZT9cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIE9sZC1zdHlsZSBKUEVHIChUSUZGIDYuMClcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gWFhYOiBVc2UgUERGLmpzIGNvZGU/XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAvLyBOZXctc3R5bGUgSlBFRyAoVElGRiBTcGVjaWZpY2F0aW9uIFN1cHBsZW1lbnQgMilcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gWFhYOiBVc2UgUERGLmpzIGNvZGU/XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAvLyBQYWNrQml0c1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDMyNzczOlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXJlIHdlIHJlYWR5IGZvciBhIG5ldyBibG9jaz9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnZXRIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRIZWFkZXIgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBibG9ja0xlbmd0aCA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAxO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGhlYWRlciBieXRlIGlzIHNpZ25lZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5nZXRJbnQ4KHN0cmlwT2Zmc2V0ICsgYnl0ZU9mZnNldCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGhlYWRlciA+PSAwKSAmJiAoaGVhZGVyIDw9IDEyNykpIHsgLy8gTm9ybWFsIHBpeGVscy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tMZW5ndGggPSBoZWFkZXIgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoKGhlYWRlciA+PSAtMTI3KSAmJiAoaGVhZGVyIDw9IC0xKSkgeyAvLyBDb2xsYXBzZWQgcGl4ZWxzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVyYXRpb25zID0gLWhlYWRlciArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIC8qaWYgKGhlYWRlciA9PT0gLTEyOCkqLyB7IC8vIFBsYWNlaG9sZGVyIGJ5dGU/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEhlYWRlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudEJ5dGUgPSB0aGlzLmdldFVpbnQ4KHN0cmlwT2Zmc2V0ICsgYnl0ZU9mZnNldCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEdXBsaWNhdGUgYnl0ZXMsIGlmIG5lY2Vzc2FyeS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IGl0ZXJhdGlvbnM7IG0rKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2FtcGxlUHJvcGVydGllc1tzYW1wbGVdLmhhc0J5dGVzUGVyU2FtcGxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSdyZSByZWFkaW5nIG9uZSBieXRlIGF0IGEgdGltZSwgc28gd2UgbmVlZCB0byBoYW5kbGUgbXVsdGktYnl0ZSBzYW1wbGVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFNhbXBsZSA9IChjdXJyZW50U2FtcGxlIDw8ICg4ICogbnVtQnl0ZXMpKSB8IGN1cnJlbnRCeXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtQnl0ZXMrKztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSXMgb3VyIHNhbXBsZSBjb21wbGV0ZT9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChudW1CeXRlcyA9PT0gc2FtcGxlUHJvcGVydGllc1tzYW1wbGVdLmJ5dGVzUGVyU2FtcGxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGl4ZWwucHVzaChjdXJyZW50U2FtcGxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2FtcGxlID0gbnVtQnl0ZXMgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhbXBsZSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvcihkZWJ1Zy5nZXRFcnJvcig2MDI1KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJcyBvdXIgcGl4ZWwgY29tcGxldGU/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzYW1wbGUgPT09IHNhbXBsZXNQZXJQaXhlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaXBzW2ldLnB1c2gocGl4ZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGl4ZWwgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhbXBsZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9ja0xlbmd0aC0tO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSXMgb3VyIGJsb2NrIGNvbXBsZXRlP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChibG9ja0xlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRIZWFkZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgakluY3JlbWVudCA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAvLyBVbmtub3duIGNvbXByZXNzaW9uIGFsZ29yaXRobVxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG8gbm90IGF0dGVtcHQgdG8gcGFyc2UgdGhlIGltYWdlIGRhdGEuXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2FudmFzLmdldENvbnRleHQpIHtcbiAgICAgICAgICAgIHZhciBjdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgICAgICAgICAgIC8vIFNldCBhIGRlZmF1bHQgZmlsbCBzdHlsZS5cbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMClcIjtcblxuICAgICAgICAgICAgLy8gSWYgUm93c1BlclN0cmlwIGlzIG1pc3NpbmcsIHRoZSB3aG9sZSBpbWFnZSBpcyBpbiBvbmUgc3RyaXAuXG4gICAgICAgICAgICB2YXIgcm93c1BlclN0cmlwID0gZmlsZURpcmVjdG9yeVsnUm93c1BlclN0cmlwJ10gPyBmaWxlRGlyZWN0b3J5WydSb3dzUGVyU3RyaXAnXS52YWx1ZXNbMF0gOiBpbWFnZUxlbmd0aDtcblxuICAgICAgICAgICAgdmFyIG51bVN0cmlwcyA9IHN0cmlwcy5sZW5ndGg7XG5cbiAgICAgICAgICAgIHZhciBpbWFnZUxlbmd0aE1vZFJvd3NQZXJTdHJpcCA9IGltYWdlTGVuZ3RoICUgcm93c1BlclN0cmlwO1xuICAgICAgICAgICAgdmFyIHJvd3NJbkxhc3RTdHJpcCA9IChpbWFnZUxlbmd0aE1vZFJvd3NQZXJTdHJpcCA9PT0gMCkgPyByb3dzUGVyU3RyaXAgOiBpbWFnZUxlbmd0aE1vZFJvd3NQZXJTdHJpcDtcblxuICAgICAgICAgICAgdmFyIG51bVJvd3NJblN0cmlwID0gcm93c1BlclN0cmlwO1xuICAgICAgICAgICAgdmFyIG51bVJvd3NJblByZXZpb3VzU3RyaXAgPSAwO1xuXG4gICAgICAgICAgICB2YXIgcGhvdG9tZXRyaWNJbnRlcnByZXRhdGlvbiA9IGZpbGVEaXJlY3RvcnlbJ1Bob3RvbWV0cmljSW50ZXJwcmV0YXRpb24nXS52YWx1ZXNbMF07XG5cbiAgICAgICAgICAgIHZhciBleHRyYVNhbXBsZXNWYWx1ZXMgPSBbXTtcbiAgICAgICAgICAgIHZhciBudW1FeHRyYVNhbXBsZXMgPSAwO1xuXG4gICAgICAgICAgICBpZiAoZmlsZURpcmVjdG9yeVsnRXh0cmFTYW1wbGVzJ10pIHtcbiAgICAgICAgICAgICAgICBleHRyYVNhbXBsZXNWYWx1ZXMgPSBmaWxlRGlyZWN0b3J5WydFeHRyYVNhbXBsZXMnXS52YWx1ZXM7XG4gICAgICAgICAgICAgICAgbnVtRXh0cmFTYW1wbGVzID0gZXh0cmFTYW1wbGVzVmFsdWVzLmxlbmd0aDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGZpbGVEaXJlY3RvcnlbJ0NvbG9yTWFwJ10pIHtcbiAgICAgICAgICAgICAgICB2YXIgY29sb3JNYXBWYWx1ZXMgPSBmaWxlRGlyZWN0b3J5WydDb2xvck1hcCddLnZhbHVlcztcbiAgICAgICAgICAgICAgICB2YXIgY29sb3JNYXBTYW1wbGVTaXplID0gTWF0aC5wb3coMiwgc2FtcGxlUHJvcGVydGllc1swXS5iaXRzUGVyU2FtcGxlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZSBzdHJpcHMgaW4gdGhlIGltYWdlLlxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1TdHJpcHM7IGkrKykge1xuICAgICAgICAgICAgICAgIC8vIFRoZSBsYXN0IHN0cmlwIG1heSBiZSBzaG9ydC5cbiAgICAgICAgICAgICAgICBpZiAoKGkgKyAxKSA9PT0gbnVtU3RyaXBzKSB7XG4gICAgICAgICAgICAgICAgICAgIG51bVJvd3NJblN0cmlwID0gcm93c0luTGFzdFN0cmlwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBudW1QaXhlbHMgPSBzdHJpcHNbaV0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHZhciB5UGFkZGluZyA9IG51bVJvd3NJblByZXZpb3VzU3RyaXAgKiBpO1xuXG4gICAgICAgICAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZSByb3dzIGluIHRoZSBzdHJpcC5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciB5ID0gMCwgaiA9IDA7IHkgPCBudW1Sb3dzSW5TdHJpcCwgaiA8IG51bVBpeGVsczsgeSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCB0aGUgcGl4ZWxzIGluIHRoZSByb3cuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgaW1hZ2VXaWR0aDsgeCsrLCBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwaXhlbFNhbXBsZXMgPSBzdHJpcHNbaV1bal07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdyZWVuID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBibHVlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvcGFjaXR5ID0gMS4wO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobnVtRXh0cmFTYW1wbGVzID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgbnVtRXh0cmFTYW1wbGVzOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4dHJhU2FtcGxlc1ZhbHVlc1trXSA9PT0gMSB8fCBleHRyYVNhbXBsZXNWYWx1ZXNba10gPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENsYW1wIG9wYWNpdHkgdG8gdGhlIHJhbmdlIFswLDFdLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eSA9IHBpeGVsU2FtcGxlc1szICsga10gLyAyNTY7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCaWxldmVsIG9yIEdyYXlzY2FsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdoaXRlSXNaZXJvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2FtcGxlUHJvcGVydGllc1swXS5oYXNCeXRlc1BlclNhbXBsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGludmVydFZhbHVlID0gTWF0aC5wb3coMHgxMCwgc2FtcGxlUHJvcGVydGllc1swXS5ieXRlc1BlclNhbXBsZSAqIDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW52ZXJ0IHNhbXBsZXMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpeGVsU2FtcGxlcy5mb3JFYWNoKGZ1bmN0aW9uIChzYW1wbGUsIGluZGV4LCBzYW1wbGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYW1wbGVzW2luZGV4XSA9IGludmVydFZhbHVlIC0gc2FtcGxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJpbGV2ZWwgb3IgR3JheXNjYWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmxhY2tJc1plcm9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZCA9IGdyZWVuID0gYmx1ZSA9IHRoaXMuY2xhbXBDb2xvclNhbXBsZShwaXhlbFNhbXBsZXNbMF0sIHNhbXBsZVByb3BlcnRpZXNbMF0uYml0c1BlclNhbXBsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUkdCIEZ1bGwgQ29sb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZCA9IHRoaXMuY2xhbXBDb2xvclNhbXBsZShwaXhlbFNhbXBsZXNbMF0sIHNhbXBsZVByb3BlcnRpZXNbMF0uYml0c1BlclNhbXBsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyZWVuID0gdGhpcy5jbGFtcENvbG9yU2FtcGxlKHBpeGVsU2FtcGxlc1sxXSwgc2FtcGxlUHJvcGVydGllc1sxXS5iaXRzUGVyU2FtcGxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmx1ZSA9IHRoaXMuY2xhbXBDb2xvclNhbXBsZShwaXhlbFNhbXBsZXNbMl0sIHNhbXBsZVByb3BlcnRpZXNbMl0uYml0c1BlclNhbXBsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUkdCIENvbG9yIFBhbGV0dGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2xvck1hcFZhbHVlcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihkZWJ1Zy5nZXRFcnJvcig2MDI3KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29sb3JNYXBJbmRleCA9IHBpeGVsU2FtcGxlc1swXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWQgPSB0aGlzLmNsYW1wQ29sb3JTYW1wbGUoY29sb3JNYXBWYWx1ZXNbY29sb3JNYXBJbmRleF0sIDE2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JlZW4gPSB0aGlzLmNsYW1wQ29sb3JTYW1wbGUoY29sb3JNYXBWYWx1ZXNbY29sb3JNYXBTYW1wbGVTaXplICsgY29sb3JNYXBJbmRleF0sIDE2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmx1ZSA9IHRoaXMuY2xhbXBDb2xvclNhbXBsZShjb2xvck1hcFZhbHVlc1soMiAqIGNvbG9yTWFwU2FtcGxlU2l6ZSkgKyBjb2xvck1hcEluZGV4XSwgMTYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFVua25vd24gUGhvdG9tZXRyaWMgSW50ZXJwcmV0YXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yKGRlYnVnLmdldEVycm9yKDYwMjgsIHBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcInJnYmEoXCIgKyByZWQgKyBcIiwgXCIgKyBncmVlbiArIFwiLCBcIiArIGJsdWUgKyBcIiwgXCIgKyBvcGFjaXR5ICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoeCwgeVBhZGRpbmcgKyB5LCAxLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG51bVJvd3NJblByZXZpb3VzU3RyaXAgPSBudW1Sb3dzSW5TdHJpcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhcztcbiAgICB9LFxuXG4gICAgLy8gU2VlOiBodHRwOi8vd3d3LmRpZ2l0aXphdGlvbmd1aWRlbGluZXMuZ292L2d1aWRlbGluZXMvVElGRl9NZXRhZGF0YV9GaW5hbC5wZGZcbiAgICAvLyBTZWU6IGh0dHA6Ly93d3cuZGlnaXRhbHByZXNlcnZhdGlvbi5nb3YvZm9ybWF0cy9jb250ZW50L3RpZmZfdGFncy5zaHRtbFxuICAgIGZpZWxkVGFnTmFtZXM6IHtcbiAgICAgICAgLy8gVElGRiBCYXNlbGluZVxuICAgICAgICAweDAxM0I6ICdBcnRpc3QnLFxuICAgICAgICAweDAxMDI6ICdCaXRzUGVyU2FtcGxlJyxcbiAgICAgICAgMHgwMTA5OiAnQ2VsbExlbmd0aCcsXG4gICAgICAgIDB4MDEwODogJ0NlbGxXaWR0aCcsXG4gICAgICAgIDB4MDE0MDogJ0NvbG9yTWFwJyxcbiAgICAgICAgMHgwMTAzOiAnQ29tcHJlc3Npb24nLFxuICAgICAgICAweDgyOTg6ICdDb3B5cmlnaHQnLFxuICAgICAgICAweDAxMzI6ICdEYXRlVGltZScsXG4gICAgICAgIDB4MDE1MjogJ0V4dHJhU2FtcGxlcycsXG4gICAgICAgIDB4MDEwQTogJ0ZpbGxPcmRlcicsXG4gICAgICAgIDB4MDEyMTogJ0ZyZWVCeXRlQ291bnRzJyxcbiAgICAgICAgMHgwMTIwOiAnRnJlZU9mZnNldHMnLFxuICAgICAgICAweDAxMjM6ICdHcmF5UmVzcG9uc2VDdXJ2ZScsXG4gICAgICAgIDB4MDEyMjogJ0dyYXlSZXNwb25zZVVuaXQnLFxuICAgICAgICAweDAxM0M6ICdIb3N0Q29tcHV0ZXInLFxuICAgICAgICAweDAxMEU6ICdJbWFnZURlc2NyaXB0aW9uJyxcbiAgICAgICAgMHgwMTAxOiAnSW1hZ2VMZW5ndGgnLFxuICAgICAgICAweDAxMDA6ICdJbWFnZVdpZHRoJyxcbiAgICAgICAgMHgwMTBGOiAnTWFrZScsXG4gICAgICAgIDB4MDExOTogJ01heFNhbXBsZVZhbHVlJyxcbiAgICAgICAgMHgwMTE4OiAnTWluU2FtcGxlVmFsdWUnLFxuICAgICAgICAweDAxMTA6ICdNb2RlbCcsXG4gICAgICAgIDB4MDBGRTogJ05ld1N1YmZpbGVUeXBlJyxcbiAgICAgICAgMHgwMTEyOiAnT3JpZW50YXRpb24nLFxuICAgICAgICAweDAxMDY6ICdQaG90b21ldHJpY0ludGVycHJldGF0aW9uJyxcbiAgICAgICAgMHgwMTFDOiAnUGxhbmFyQ29uZmlndXJhdGlvbicsXG4gICAgICAgIDB4MDEyODogJ1Jlc29sdXRpb25Vbml0JyxcbiAgICAgICAgMHgwMTE2OiAnUm93c1BlclN0cmlwJyxcbiAgICAgICAgMHgwMTE1OiAnU2FtcGxlc1BlclBpeGVsJyxcbiAgICAgICAgMHgwMTMxOiAnU29mdHdhcmUnLFxuICAgICAgICAweDAxMTc6ICdTdHJpcEJ5dGVDb3VudHMnLFxuICAgICAgICAweDAxMTE6ICdTdHJpcE9mZnNldHMnLFxuICAgICAgICAweDAwRkY6ICdTdWJmaWxlVHlwZScsXG4gICAgICAgIDB4MDEwNzogJ1RocmVzaGhvbGRpbmcnLFxuICAgICAgICAweDAxMUE6ICdYUmVzb2x1dGlvbicsXG4gICAgICAgIDB4MDExQjogJ1lSZXNvbHV0aW9uJyxcblxuICAgICAgICAvLyBUSUZGIEV4dGVuZGVkXG4gICAgICAgIDB4MDE0NjogJ0JhZEZheExpbmVzJyxcbiAgICAgICAgMHgwMTQ3OiAnQ2xlYW5GYXhEYXRhJyxcbiAgICAgICAgMHgwMTU3OiAnQ2xpcFBhdGgnLFxuICAgICAgICAweDAxNDg6ICdDb25zZWN1dGl2ZUJhZEZheExpbmVzJyxcbiAgICAgICAgMHgwMUIxOiAnRGVjb2RlJyxcbiAgICAgICAgMHgwMUIyOiAnRGVmYXVsdEltYWdlQ29sb3InLFxuICAgICAgICAweDAxMEQ6ICdEb2N1bWVudE5hbWUnLFxuICAgICAgICAweDAxNTA6ICdEb3RSYW5nZScsXG4gICAgICAgIDB4MDE0MTogJ0hhbGZ0b25lSGludHMnLFxuICAgICAgICAweDAxNUE6ICdJbmRleGVkJyxcbiAgICAgICAgMHgwMTVCOiAnSlBFR1RhYmxlcycsXG4gICAgICAgIDB4MDExRDogJ1BhZ2VOYW1lJyxcbiAgICAgICAgMHgwMTI5OiAnUGFnZU51bWJlcicsXG4gICAgICAgIDB4MDEzRDogJ1ByZWRpY3RvcicsXG4gICAgICAgIDB4MDEzRjogJ1ByaW1hcnlDaHJvbWF0aWNpdGllcycsXG4gICAgICAgIDB4MDIxNDogJ1JlZmVyZW5jZUJsYWNrV2hpdGUnLFxuICAgICAgICAweDAxNTM6ICdTYW1wbGVGb3JtYXQnLFxuICAgICAgICAweDAyMkY6ICdTdHJpcFJvd0NvdW50cycsXG4gICAgICAgIDB4MDE0QTogJ1N1YklGRHMnLFxuICAgICAgICAweDAxMjQ6ICdUNE9wdGlvbnMnLFxuICAgICAgICAweDAxMjU6ICdUNk9wdGlvbnMnLFxuICAgICAgICAweDAxNDU6ICdUaWxlQnl0ZUNvdW50cycsXG4gICAgICAgIDB4MDE0MzogJ1RpbGVMZW5ndGgnLFxuICAgICAgICAweDAxNDQ6ICdUaWxlT2Zmc2V0cycsXG4gICAgICAgIDB4MDE0MjogJ1RpbGVXaWR0aCcsXG4gICAgICAgIDB4MDEyRDogJ1RyYW5zZmVyRnVuY3Rpb24nLFxuICAgICAgICAweDAxM0U6ICdXaGl0ZVBvaW50JyxcbiAgICAgICAgMHgwMTU4OiAnWENsaXBQYXRoVW5pdHMnLFxuICAgICAgICAweDAxMUU6ICdYUG9zaXRpb24nLFxuICAgICAgICAweDAyMTE6ICdZQ2JDckNvZWZmaWNpZW50cycsXG4gICAgICAgIDB4MDIxMzogJ1lDYkNyUG9zaXRpb25pbmcnLFxuICAgICAgICAweDAyMTI6ICdZQ2JDclN1YlNhbXBsaW5nJyxcbiAgICAgICAgMHgwMTU5OiAnWUNsaXBQYXRoVW5pdHMnLFxuICAgICAgICAweDAxMUY6ICdZUG9zaXRpb24nLFxuXG4gICAgICAgIC8vIEVYSUZcbiAgICAgICAgMHg5MjAyOiAnQXBlcnR1cmVWYWx1ZScsXG4gICAgICAgIDB4QTAwMTogJ0NvbG9yU3BhY2UnLFxuICAgICAgICAweDkwMDQ6ICdEYXRlVGltZURpZ2l0aXplZCcsXG4gICAgICAgIDB4OTAwMzogJ0RhdGVUaW1lT3JpZ2luYWwnLFxuICAgICAgICAweDg3Njk6ICdFeGlmIElGRCcsXG4gICAgICAgIDB4OTAwMDogJ0V4aWZWZXJzaW9uJyxcbiAgICAgICAgMHg4MjlBOiAnRXhwb3N1cmVUaW1lJyxcbiAgICAgICAgMHhBMzAwOiAnRmlsZVNvdXJjZScsXG4gICAgICAgIDB4OTIwOTogJ0ZsYXNoJyxcbiAgICAgICAgMHhBMDAwOiAnRmxhc2hwaXhWZXJzaW9uJyxcbiAgICAgICAgMHg4MjlEOiAnRk51bWJlcicsXG4gICAgICAgIDB4QTQyMDogJ0ltYWdlVW5pcXVlSUQnLFxuICAgICAgICAweDkyMDg6ICdMaWdodFNvdXJjZScsXG4gICAgICAgIDB4OTI3QzogJ01ha2VyTm90ZScsXG4gICAgICAgIDB4OTIwMTogJ1NodXR0ZXJTcGVlZFZhbHVlJyxcbiAgICAgICAgMHg5Mjg2OiAnVXNlckNvbW1lbnQnLFxuXG4gICAgICAgIC8vIElQVENcbiAgICAgICAgMHg4M0JCOiAnSVBUQycsXG5cbiAgICAgICAgLy8gSUNDXG4gICAgICAgIDB4ODc3MzogJ0lDQyBQcm9maWxlJyxcblxuICAgICAgICAvLyBYTVBcbiAgICAgICAgMHgwMkJDOiAnWE1QJyxcblxuICAgICAgICAvLyBHREFMXG4gICAgICAgIDB4QTQ4MDogJ0dEQUxfTUVUQURBVEEnLFxuICAgICAgICAweEE0ODE6ICdHREFMX05PREFUQScsXG5cbiAgICAgICAgLy8gUGhvdG9zaG9wXG4gICAgICAgIDB4ODY0OTogJ1Bob3Rvc2hvcCdcbiAgICB9LFxuXG4gICAgZmllbGRUeXBlTmFtZXM6IHtcbiAgICAgICAgMHgwMDAxOiAnQllURScsXG4gICAgICAgIDB4MDAwMjogJ0FTQ0lJJyxcbiAgICAgICAgMHgwMDAzOiAnU0hPUlQnLFxuICAgICAgICAweDAwMDQ6ICdMT05HJyxcbiAgICAgICAgMHgwMDA1OiAnUkFUSU9OQUwnLFxuICAgICAgICAweDAwMDY6ICdTQllURScsXG4gICAgICAgIDB4MDAwNzogJ1VOREVGSU5FRCcsXG4gICAgICAgIDB4MDAwODogJ1NTSE9SVCcsXG4gICAgICAgIDB4MDAwOTogJ1NMT05HJyxcbiAgICAgICAgMHgwMDBBOiAnU1JBVElPTkFMJyxcbiAgICAgICAgMHgwMDBCOiAnRkxPQVQnLFxuICAgICAgICAweDAwMEM6ICdET1VCTEUnXG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0aWZmUmVhZGVyOyJdLCJzb3VyY2VSb290IjoiLyJ9