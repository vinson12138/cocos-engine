
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/asset-manager/deserialize.js';
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
var helper = require('./helper');

var MissingClass = CC_EDITOR && Editor.require('app://editor/page/scene-utils/missing-class-reporter').MissingClass;

require('../platform/deserialize');

function deserialize(json, options) {
  var classFinder, missingClass;

  if (CC_EDITOR) {
    missingClass = MissingClass;

    classFinder = function classFinder(type, data, owner, propName) {
      var res = missingClass.classFinder(type, data, owner, propName);

      if (res) {
        return res;
      }

      return cc._MissingScript;
    };

    classFinder.onDereferenced = missingClass.classFinder.onDereferenced;
  } else {
    classFinder = cc._MissingScript.safeFindClass;
  }

  var pool = null;

  if (!CC_PREVIEW) {
    pool = cc.deserialize.Details.pool;
  } else {
    var _require = require('../platform/deserialize-compiled'),
        deserializeForCompiled = _require["default"];

    var deserializeForEditor = require('../platform/deserialize-editor');

    if (deserializeForCompiled.isCompiledJson(json)) {
      pool = deserializeForCompiled.Details.pool;
    } else {
      pool = deserializeForEditor.Details.pool;
    }
  }

  var tdInfo = pool.get();
  var asset;

  try {
    asset = cc.deserialize(json, tdInfo, {
      classFinder: classFinder,
      customEnv: options
    });
  } catch (e) {
    pool.put(tdInfo);
    throw e;
  }

  if (CC_EDITOR && missingClass) {
    missingClass.reportMissingClass(asset);
    missingClass.reset();
  }

  var uuidList = tdInfo.uuidList;
  var objList = tdInfo.uuidObjList;
  var propList = tdInfo.uuidPropList;
  var depends = [];

  for (var i = 0; i < uuidList.length; i++) {
    var dependUuid = uuidList[i];
    depends[i] = {
      uuid: helper.decodeUuid(dependUuid),
      owner: objList[i],
      prop: propList[i]
    };
  } // non-native deps


  asset.__depends__ = depends; // native dep

  asset._native && (asset.__nativeDepend__ = true);
  pool.put(tdInfo);
  return asset;
}

module.exports = deserialize;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0LW1hbmFnZXIvZGVzZXJpYWxpemUuanMiXSwibmFtZXMiOlsiaGVscGVyIiwicmVxdWlyZSIsIk1pc3NpbmdDbGFzcyIsIkNDX0VESVRPUiIsIkVkaXRvciIsImRlc2VyaWFsaXplIiwianNvbiIsIm9wdGlvbnMiLCJjbGFzc0ZpbmRlciIsIm1pc3NpbmdDbGFzcyIsInR5cGUiLCJkYXRhIiwib3duZXIiLCJwcm9wTmFtZSIsInJlcyIsImNjIiwiX01pc3NpbmdTY3JpcHQiLCJvbkRlcmVmZXJlbmNlZCIsInNhZmVGaW5kQ2xhc3MiLCJwb29sIiwiQ0NfUFJFVklFVyIsIkRldGFpbHMiLCJkZXNlcmlhbGl6ZUZvckNvbXBpbGVkIiwiZGVzZXJpYWxpemVGb3JFZGl0b3IiLCJpc0NvbXBpbGVkSnNvbiIsInRkSW5mbyIsImdldCIsImFzc2V0IiwiY3VzdG9tRW52IiwiZSIsInB1dCIsInJlcG9ydE1pc3NpbmdDbGFzcyIsInJlc2V0IiwidXVpZExpc3QiLCJvYmpMaXN0IiwidXVpZE9iakxpc3QiLCJwcm9wTGlzdCIsInV1aWRQcm9wTGlzdCIsImRlcGVuZHMiLCJpIiwibGVuZ3RoIiwiZGVwZW5kVXVpZCIsInV1aWQiLCJkZWNvZGVVdWlkIiwicHJvcCIsIl9fZGVwZW5kc19fIiwiX25hdGl2ZSIsIl9fbmF0aXZlRGVwZW5kX18iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsTUFBTSxHQUFHQyxPQUFPLENBQUMsVUFBRCxDQUF0Qjs7QUFDQSxJQUFNQyxZQUFZLEdBQUdDLFNBQVMsSUFBSUMsTUFBTSxDQUFDSCxPQUFQLENBQWUsc0RB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QixNQUFBQSxLQUFLLEVBQUVzQixPQUFPLENBQUNLLENBQUQsQ0FGTDtBQUdUSyxNQUFBQSxJQUFJLEVBQUVSLFFBQVEsQ0FBQ0csQ0FBRDtBQUhMLEtBQWI7QUFLSCxHQTlEZ0MsQ0FnRWpDOzs7QUFDQVosRUFBQUEsS0FBSyxDQUFDa0IsV0FBTixHQUFvQlAsT0FBcEIsQ0FqRWlDLENBa0VqQzs7QUFDQVgsRUFBQUEsS0FBSyxDQUFDbUIsT0FBTixLQUFrQm5CLEtBQUssQ0FBQ29CLGdCQUFOLEdBQXlCLElBQTNDO0FBQ0E1QixFQUFBQSxJQUFJLENBQUNXLEdBQUwsQ0FBU0wsTUFBVDtBQUNBLFNBQU9FLEtBQVA7QUFFSDs7QUFFRHFCLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjVDLFdBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBoZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcicpO1xuY29uc3QgTWlzc2luZ0NsYXNzID0gQ0NfRURJVE9SICYmIEVkaXRvci5yZXF1aXJlKCdhcHA6Ly9lZGl0b3IvcGFnZS9zY2VuZS11dGlscy9taXNzaW5nLWNsYXNzLXJlcG9ydGVyJykuTWlzc2luZ0NsYXNzO1xucmVxdWlyZSgnLi4vcGxhdGZvcm0vZGVzZXJpYWxpemUnKTtcblxuZnVuY3Rpb24gZGVzZXJpYWxpemUgKGpzb24sIG9wdGlvbnMpIHtcbiAgICB2YXIgY2xhc3NGaW5kZXIsIG1pc3NpbmdDbGFzcztcbiAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgIG1pc3NpbmdDbGFzcyA9IE1pc3NpbmdDbGFzcztcbiAgICAgICAgY2xhc3NGaW5kZXIgPSBmdW5jdGlvbiAodHlwZSwgZGF0YSwgb3duZXIsIHByb3BOYW1lKSB7XG4gICAgICAgICAgICB2YXIgcmVzID0gbWlzc2luZ0NsYXNzLmNsYXNzRmluZGVyKHR5cGUsIGRhdGEsIG93bmVyLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICBpZiAocmVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjYy5fTWlzc2luZ1NjcmlwdDtcbiAgICAgICAgfTtcbiAgICAgICAgY2xhc3NGaW5kZXIub25EZXJlZmVyZW5jZWQgPSBtaXNzaW5nQ2xhc3MuY2xhc3NGaW5kZXIub25EZXJlZmVyZW5jZWQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjbGFzc0ZpbmRlciA9IGNjLl9NaXNzaW5nU2NyaXB0LnNhZmVGaW5kQ2xhc3M7XG4gICAgfVxuXG4gICAgbGV0IHBvb2wgPSBudWxsO1xuICAgIGlmICghQ0NfUFJFVklFVykge1xuICAgICAgICBwb29sID0gY2MuZGVzZXJpYWxpemUuRGV0YWlscy5wb29sO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbGV0IHsgZGVmYXVsdDogZGVzZXJpYWxpemVGb3JDb21waWxlZCB9ID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vZGVzZXJpYWxpemUtY29tcGlsZWQnKTtcbiAgICAgICAgbGV0IGRlc2VyaWFsaXplRm9yRWRpdG9yID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vZGVzZXJpYWxpemUtZWRpdG9yJyk7XG4gICAgICAgIGlmIChkZXNlcmlhbGl6ZUZvckNvbXBpbGVkLmlzQ29tcGlsZWRKc29uKGpzb24pKSB7XG4gICAgICAgICAgICBwb29sID0gZGVzZXJpYWxpemVGb3JDb21waWxlZC5EZXRhaWxzLnBvb2w7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwb29sID0gZGVzZXJpYWxpemVGb3JFZGl0b3IuRGV0YWlscy5wb29sO1xuICAgICAgICB9XG4gICAgfVxuICAgIHZhciB0ZEluZm8gPSBwb29sLmdldCgpO1xuXG4gICAgdmFyIGFzc2V0O1xuICAgIHRyeSB7XG4gICAgICAgIGFzc2V0ID0gY2MuZGVzZXJpYWxpemUoanNvbiwgdGRJbmZvLCB7XG4gICAgICAgICAgICBjbGFzc0ZpbmRlcjogY2xhc3NGaW5kZXIsXG4gICAgICAgICAgICBjdXN0b21FbnY6IG9wdGlvbnNcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIHBvb2wucHV0KHRkSW5mbyk7XG4gICAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgaWYgKENDX0VESVRPUiAmJiBtaXNzaW5nQ2xhc3MpIHtcbiAgICAgICAgbWlzc2luZ0NsYXNzLnJlcG9ydE1pc3NpbmdDbGFzcyhhc3NldCk7XG4gICAgICAgIG1pc3NpbmdDbGFzcy5yZXNldCgpO1xuICAgIH1cblxuICAgIHZhciB1dWlkTGlzdCA9IHRkSW5mby51dWlkTGlzdDtcbiAgICB2YXIgb2JqTGlzdCA9IHRkSW5mby51dWlkT2JqTGlzdDtcbiAgICB2YXIgcHJvcExpc3QgPSB0ZEluZm8udXVpZFByb3BMaXN0O1xuICAgIHZhciBkZXBlbmRzID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHV1aWRMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBkZXBlbmRVdWlkID0gdXVpZExpc3RbaV07XG4gICAgICAgIGRlcGVuZHNbaV0gPSB7XG4gICAgICAgICAgICB1dWlkOiBoZWxwZXIuZGVjb2RlVXVpZChkZXBlbmRVdWlkKSxcbiAgICAgICAgICAgIG93bmVyOiBvYmpMaXN0W2ldLFxuICAgICAgICAgICAgcHJvcDogcHJvcExpc3RbaV1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBub24tbmF0aXZlIGRlcHNcbiAgICBhc3NldC5fX2RlcGVuZHNfXyA9IGRlcGVuZHM7XG4gICAgLy8gbmF0aXZlIGRlcFxuICAgIGFzc2V0Ll9uYXRpdmUgJiYgKGFzc2V0Ll9fbmF0aXZlRGVwZW5kX18gPSB0cnVlKTtcbiAgICBwb29sLnB1dCh0ZEluZm8pO1xuICAgIHJldHVybiBhc3NldDtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlc2VyaWFsaXplO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=