
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/asset-manager/preprocess.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
var Task = require('./task');

var _require = require('./shared'),
    transformPipeline = _require.transformPipeline,
    RequestType = _require.RequestType;

function preprocess(task, done) {
  var options = task.options,
      subOptions = Object.create(null),
      leftOptions = Object.create(null);

  for (var op in options) {
    switch (op) {
      // can't set these attributes in options
      case RequestType.PATH:
      case RequestType.UUID:
      case RequestType.DIR:
      case RequestType.SCENE:
      case RequestType.URL:
        break;
      // only need these attributes to transform url

      case '__requestType__':
      case '__isNative__':
      case 'ext':
      case 'type':
      case '__nativeName__':
      case 'audioLoadMode':
      case 'bundle':
        subOptions[op] = options[op];
        break;
      // other settings, left to next pipe

      case '__exclude__':
      case '__outputAsArray__':
        leftOptions[op] = options[op];
        break;

      default:
        subOptions[op] = options[op];
        leftOptions[op] = options[op];
        break;
    }
  }

  task.options = leftOptions; // transform url

  var subTask = Task.create({
    input: task.input,
    options: subOptions
  });
  var err = null;

  try {
    task.output = task.source = transformPipeline.sync(subTask);
  } catch (e) {
    err = e;

    for (var i = 0, l = subTask.output.length; i < l; i++) {
      subTask.output[i].recycle();
    }
  }

  subTask.recycle();
  done(err);
}

module.exports = preprocess;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0LW1hbmFnZXIvcHJlcHJvY2Vzcy5qcyJdLCJuYW1lcyI6WyJUYXNrIiwicmVxdWlyZSIsInRyYW5zZm9ybVBpcGVsaW5lIiwiUmVxdWVzdFR5cGUiLCJwcmVwcm9jZXNzIiwidGFzayIsImRvbmUiLCJvcHRpb25zIiwic3ViT3B0aW9ucyIsIk9iamVjdCIsImNyZWF0ZSIsImxlZnRPcHRpb25zIiwib3AiLCJQQVRIIiwiVVVJRCIsIkRJUiIsIlNDRU5FIiwiVVJMIiwic3ViVGFzayIsImlucHV0IiwiZXJyIiwib3V0cHV0Iiwic291cmNlIiwic3luYyIsImUiLCJpIiwibCIsImxlbmd0aCIsInJlY3ljbGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTUEsSUFBSSxHQUFHQyxPQUFPLENBQUMsUUFBRCxDQUFwQjs7ZUFDMkNBLE9BQU8sQ0FBQyxVQUFEO0lBQTFDQyw2QkFBQUE7SUFBbUJDLHVCQUFBQTs7QUFFM0IsU0FBU0MsVUFBVCxDQUFxQkMsSUFBckIsRUFBMkJDLElBQTNCLEVBQWlDO0FBQzdCLE1BQUlDLE9BQU8sR0FBR0YsSUFBSSxDQUFDRSxPQUFuQjtBQUFBLE1BQTRCQyxVQUFVLEdBQUdDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLElBQWQsQ0FBekM7QUFBQSxNQUE4REMsV0FBVyxHQUFHRixNQUFNLENBQUNDLE1BQVAsQ0FBYyxJQUFkLENBQTVFOztBQUVBLE9BQUssSUFBSUUsRUFBVCxJQUFlTCxPQUFmLEVBQXdCO0FBQ3BCLFlBQVFLLEVBQVI7QUFDSTtBQUNBLFdBQUtULFdBQVcsQ0FBQ1UsSUFBakI7QUFDQSxXQUFLVixXQUFXLENBQUNXLElBQWpCO0FBQ0EsV0FBS1gsV0FBVyxDQUFDWSxHQUFqQjtBQUNBLFdBQUtaLFdBQVcsQ0FBQ2EsS0FBakI7QUFDQSxXQUFLYixXQUFXLENBQUNjLEdBQWpCO0FBQXVCO0FBQ3ZCOztBQUNBLFdBQUssaUJBQUw7QUFDQSxXQUFLLGNBQUw7QUFDQSxXQUFLLEtBQUw7QUFDQSxXQUFLLE1BQUw7QUFDQSxXQUFLLGdCQUFMO0FBQ0EsV0FBSyxlQUFMO0FBQ0EsV0FBSyxRQUFMO0FBQ0lULFFBQUFBLFVBQVUsQ0FBQ0ksRUFBRCxDQUFWLEdBQWlCTCxPQUFPLENBQUNLLEVBQUQsQ0FBeEI7QUFDQTtBQUNKOztBQUNBLFdBQUssYUFBTDtBQUNBLFdBQUssbUJBQUw7QUFDSUQsUUFBQUEsV0FBVyxDQUFDQyxFQUFELENBQVgsR0FBa0JMLE9BQU8sQ0FBQ0ssRUFBRCxDQUF6QjtBQUNBOztBQUNKO0FBQ0lKLFFBQUFBLFVBQVUsQ0FBQ0ksRUFBRCxDQUFWLEdBQWlCTCxPQUFPLENBQUNLLEVBQUQsQ0FBeEI7QUFDQUQsUUFBQUEsV0FBVyxDQUFDQyxFQUFELENBQVgsR0FBa0JMLE9BQU8sQ0FBQ0ssRUFBRCxDQUF6QjtBQUNBO0FBekJSO0FBMkJIOztBQUNEUCxFQUFBQSxJQUFJLENBQUNFLE9BQUwsR0FBZUksV0FBZixDQWhDNkIsQ0FrQzdCOztBQUNBLE1BQUlPLE9BQU8sR0FBR2xCLElBQUksQ0FBQ1UsTUFBTCxDQUFZO0FBQUNTLElBQUFBLEtBQUssRUFBRWQsSUFBSSxDQUFDYyxLQUFiO0FBQW9CWixJQUFBQSxPQUFPLEVBQUVDO0FBQTdCLEdBQVosQ0FBZDtBQUNBLE1BQUlZLEdBQUcsR0FBRyxJQUFWOztBQUNBLE1BQUk7QUFDQWYsSUFBQUEsSUFBSSxDQUFDZ0IsTUFBTCxHQUFjaEIsSUFBSSxDQUFDaUIsTUFBTCxHQUFjcEIsaUJBQWlCLENBQUNxQixJQUFsQixDQUF1QkwsT0FBdkIsQ0FBNUI7QUFDSCxHQUZELENBR0EsT0FBT00sQ0FBUCxFQUFVO0FBQ05KLElBQUFBLEdBQUcsR0FBR0ksQ0FBTjs7QUFDQSxTQUFLLElBQUlDLENBQUMsR0FBRyxDQUFSLEVBQVdDLENBQUMsR0FBR1IsT0FBTyxDQUFDRyxNQUFSLENBQWVNLE1BQW5DLEVBQTJDRixDQUFDLEdBQUdDLENBQS9DLEVBQWtERCxDQUFDLEVBQW5ELEVBQXVEO0FBQ25EUCxNQUFBQSxPQUFPLENBQUNHLE1BQVIsQ0FBZUksQ0FBZixFQUFrQkcsT0FBbEI7QUFDSDtBQUNKOztBQUNEVixFQUFBQSxPQUFPLENBQUNVLE9BQVI7QUFDQXRCLEVBQUFBLElBQUksQ0FBQ2MsR0FBRCxDQUFKO0FBQ0g7O0FBRURTLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjFCLFVBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuY29uc3QgVGFzayA9IHJlcXVpcmUoJy4vdGFzaycpO1xuY29uc3QgeyB0cmFuc2Zvcm1QaXBlbGluZSwgUmVxdWVzdFR5cGUgfSA9IHJlcXVpcmUoJy4vc2hhcmVkJyk7XG5cbmZ1bmN0aW9uIHByZXByb2Nlc3MgKHRhc2ssIGRvbmUpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRhc2sub3B0aW9ucywgc3ViT3B0aW9ucyA9IE9iamVjdC5jcmVhdGUobnVsbCksIGxlZnRPcHRpb25zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAgIGZvciAodmFyIG9wIGluIG9wdGlvbnMpIHtcbiAgICAgICAgc3dpdGNoIChvcCkge1xuICAgICAgICAgICAgLy8gY2FuJ3Qgc2V0IHRoZXNlIGF0dHJpYnV0ZXMgaW4gb3B0aW9uc1xuICAgICAgICAgICAgY2FzZSBSZXF1ZXN0VHlwZS5QQVRIOlxuICAgICAgICAgICAgY2FzZSBSZXF1ZXN0VHlwZS5VVUlEOlxuICAgICAgICAgICAgY2FzZSBSZXF1ZXN0VHlwZS5ESVI6XG4gICAgICAgICAgICBjYXNlIFJlcXVlc3RUeXBlLlNDRU5FOlxuICAgICAgICAgICAgY2FzZSBSZXF1ZXN0VHlwZS5VUkwgOiBicmVhaztcbiAgICAgICAgICAgIC8vIG9ubHkgbmVlZCB0aGVzZSBhdHRyaWJ1dGVzIHRvIHRyYW5zZm9ybSB1cmxcbiAgICAgICAgICAgIGNhc2UgJ19fcmVxdWVzdFR5cGVfXyc6XG4gICAgICAgICAgICBjYXNlICdfX2lzTmF0aXZlX18nOlxuICAgICAgICAgICAgY2FzZSAnZXh0JyA6XG4gICAgICAgICAgICBjYXNlICd0eXBlJzpcbiAgICAgICAgICAgIGNhc2UgJ19fbmF0aXZlTmFtZV9fJzpcbiAgICAgICAgICAgIGNhc2UgJ2F1ZGlvTG9hZE1vZGUnOlxuICAgICAgICAgICAgY2FzZSAnYnVuZGxlJzpcbiAgICAgICAgICAgICAgICBzdWJPcHRpb25zW29wXSA9IG9wdGlvbnNbb3BdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLy8gb3RoZXIgc2V0dGluZ3MsIGxlZnQgdG8gbmV4dCBwaXBlXG4gICAgICAgICAgICBjYXNlICdfX2V4Y2x1ZGVfXyc6XG4gICAgICAgICAgICBjYXNlICdfX291dHB1dEFzQXJyYXlfXyc6XG4gICAgICAgICAgICAgICAgbGVmdE9wdGlvbnNbb3BdID0gb3B0aW9uc1tvcF07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OiBcbiAgICAgICAgICAgICAgICBzdWJPcHRpb25zW29wXSA9IG9wdGlvbnNbb3BdO1xuICAgICAgICAgICAgICAgIGxlZnRPcHRpb25zW29wXSA9IG9wdGlvbnNbb3BdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRhc2sub3B0aW9ucyA9IGxlZnRPcHRpb25zO1xuXG4gICAgLy8gdHJhbnNmb3JtIHVybFxuICAgIGxldCBzdWJUYXNrID0gVGFzay5jcmVhdGUoe2lucHV0OiB0YXNrLmlucHV0LCBvcHRpb25zOiBzdWJPcHRpb25zfSk7XG4gICAgdmFyIGVyciA9IG51bGw7XG4gICAgdHJ5IHtcbiAgICAgICAgdGFzay5vdXRwdXQgPSB0YXNrLnNvdXJjZSA9IHRyYW5zZm9ybVBpcGVsaW5lLnN5bmMoc3ViVGFzayk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGVyciA9IGU7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gc3ViVGFzay5vdXRwdXQubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBzdWJUYXNrLm91dHB1dFtpXS5yZWN5Y2xlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3ViVGFzay5yZWN5Y2xlKCk7XG4gICAgZG9uZShlcnIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHByZXByb2Nlc3M7Il0sInNvdXJjZVJvb3QiOiIvIn0=