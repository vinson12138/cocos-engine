
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/cannon/cannon-util.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.groupIndexToBitMask = groupIndexToBitMask;
exports.toCannonRaycastOptions = toCannonRaycastOptions;
exports.fillRaycastResult = fillRaycastResult;
exports.commitShapeUpdates = commitShapeUpdates;
exports.deprecatedEventMap = void 0;

var _util = require("../framework/util");

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
var Vec3 = cc.Vec3;

function groupIndexToBitMask(groupIndex, out) {
  var categoryBits = 1 << groupIndex;
  var maskBits = 0;
  var bits = cc.game.collisionMatrix[groupIndex];

  if (!bits) {
    cc.error("cannon-utils: group is not exist", groupIndex);
    return;
  }

  for (var i = 0; i < bits.length; i++) {
    if (!bits[i]) continue;
    maskBits |= 1 << i;
  }

  out.collisionFilterGroup = categoryBits;
  out.collisionFilterMask = maskBits;
}

function toCannonRaycastOptions(out, options) {
  out.checkCollisionResponse = !options.queryTrigger;
  groupIndexToBitMask(options.groupIndex, out);
  out.skipBackFaces = false;
}

function fillRaycastResult(result, cannonResult) {
  result._assign(Vec3.copy(new Vec3(), cannonResult.hitPointWorld), cannonResult.distance, (0, _util.getWrap)(cannonResult.shape).collider);
}

function commitShapeUpdates(body) {
  body.aabbNeedsUpdate = true;
  body.updateMassProperties();
  body.updateBoundingRadius();
}

var deprecatedEventMap = {
  'onCollisionEnter': 'collision-enter',
  'onCollisionStay': 'collision-stay',
  'onCollisionExit': 'collision-exit',
  'onTriggerEnter': 'trigger-enter',
  'onTriggerStay': 'trigger-stay',
  'onTriggerExit': 'trigger-exit'
};
exports.deprecatedEventMap = deprecatedEventMap;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BoeXNpY3MvY2Fubm9uL2Nhbm5vbi11dGlsLnRzIl0sIm5hbWVzIjpbIlZlYzMiLCJjYyIsImdyb3VwSW5kZXhUb0JpdE1hc2siLCJncm91cEluZGV4Iiwib3V0IiwiY2F0ZWdvcnlCaXRzIiwibWFza0JpdHMiLCJiaXRzIiwiZ2FtZSIsImNvbGxpc2lvbk1hdHJpeCIsImVycm9yIiwiaSIsImxlbmd0aCIsImNvbGxpc2lvbkZpbHRlckdyb3VwIiwiY29sbGlzaW9uRmlsdGVyTWFzayIsInRvQ2Fubm9uUmF5Y2FzdE9wdGlvbnMiLCJvcHRpb25zIiwiY2hlY2tDb2xsaXNpb25SZXNwb25zZSIsInF1ZXJ5VHJpZ2dlciIsInNraXBCYWNrRmFjZXMiLCJmaWxsUmF5Y2FzdFJlc3VsdCIsInJlc3VsdCIsImNhbm5vblJlc3VsdCIsIl9hc3NpZ24iLCJjb3B5IiwiaGl0UG9pbnRXb3JsZCIsImRpc3RhbmNlIiwic2hhcGUiLCJjb2xsaWRlciIsImNvbW1pdFNoYXBlVXBkYXRlcyIsImJvZHkiLCJhYWJiTmVlZHNVcGRhdGUiLCJ1cGRhdGVNYXNzUHJvcGVydGllcyIsInVwZGF0ZUJvdW5kaW5nUmFkaXVzIiwiZGVwcmVjYXRlZEV2ZW50TWFwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQTs7QUExQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUUEsSUFBTUEsSUFBSSxHQUFHQyxFQUFFLENBQUNELElBQWhCOztBQUVPLFNBQVNFLG1CQUFULENBQThCQyxVQUE5QixFQUFrREMsR0FBbEQsRUFBdUg7QUFDMUgsTUFBSUMsWUFBWSxHQUFHLEtBQUtGLFVBQXhCO0FBQ0EsTUFBSUcsUUFBUSxHQUFHLENBQWY7QUFDQSxNQUFJQyxJQUFJLEdBQUdOLEVBQUUsQ0FBQ08sSUFBSCxDQUFRQyxlQUFSLENBQXdCTixVQUF4QixDQUFYOztBQUNBLE1BQUksQ0FBQ0ksSUFBTCxFQUFXO0FBQ1BOLElBQUFBLEVBQUUsQ0FBQ1MsS0FBSCxDQUFTLGtDQUFULEVBQTZDUCxVQUE3QztBQUNBO0FBQ0g7O0FBQ0QsT0FBSyxJQUFJUSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHSixJQUFJLENBQUNLLE1BQXpCLEVBQWlDRCxDQUFDLEVBQWxDLEVBQXNDO0FBQ2xDLFFBQUksQ0FBQ0osSUFBSSxDQUFDSSxDQUFELENBQVQsRUFBYztBQUNkTCxJQUFBQSxRQUFRLElBQUksS0FBS0ssQ0FBakI7QUFDSDs7QUFDRFAsRUFBQUEsR0FBRyxDQUFDUyxvQkFBSixHQUEyQlIsWUFBM0I7QUFDQUQsRUFBQUEsR0FBRyxDQUFDVSxtQkFBSixHQUEwQlIsUUFBMUI7QUFDSDs7QUFFTSxTQUFTUyxzQkFBVCxDQUFpQ1gsR0FBakMsRUFBOERZLE9BQTlELEVBQXdGO0FBQzNGWixFQUFBQSxHQUFHLENBQUNhLHNCQUFKLEdBQTZCLENBQUNELE9BQU8sQ0FBQ0UsWUFBdEM7QUFDQWhCLEVBQUFBLG1CQUFtQixDQUFDYyxPQUFPLENBQUNiLFVBQVQsRUFBcUJDLEdBQXJCLENBQW5CO0FBQ0FBLEVBQUFBLEdBQUcsQ0FBQ2UsYUFBSixHQUFvQixLQUFwQjtBQUNIOztBQUVNLFNBQVNDLGlCQUFULENBQTRCQyxNQUE1QixFQUFzREMsWUFBdEQsRUFBMEY7QUFDN0ZELEVBQUFBLE1BQU0sQ0FBQ0UsT0FBUCxDQUNJdkIsSUFBSSxDQUFDd0IsSUFBTCxDQUFVLElBQUl4QixJQUFKLEVBQVYsRUFBc0JzQixZQUFZLENBQUNHLGFBQW5DLENBREosRUFFSUgsWUFBWSxDQUFDSSxRQUZqQixFQUdJLG1CQUFvQkosWUFBWSxDQUFDSyxLQUFqQyxFQUF3Q0MsUUFINUM7QUFLSDs7QUFFTSxTQUFTQyxrQkFBVCxDQUE2QkMsSUFBN0IsRUFBZ0Q7QUFDbkRBLEVBQUFBLElBQUksQ0FBQ0MsZUFBTCxHQUF1QixJQUF2QjtBQUNBRCxFQUFBQSxJQUFJLENBQUNFLG9CQUFMO0FBQ0FGLEVBQUFBLElBQUksQ0FBQ0csb0JBQUw7QUFDSDs7QUFFTSxJQUFNQyxrQkFBa0IsR0FBRztBQUM5QixzQkFBb0IsaUJBRFU7QUFFOUIscUJBQW1CLGdCQUZXO0FBRzlCLHFCQUFtQixnQkFIVztBQUk5QixvQkFBa0IsZUFKWTtBQUs5QixtQkFBaUIsY0FMYTtBQU05QixtQkFBaUI7QUFOYSxDQUEzQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgQ0FOTk9OIGZyb20gJy4uLy4uLy4uLy4uLy4uL2V4dGVybmFsL2Nhbm5vbi9jYW5ub24nO1xuaW1wb3J0IHsgZ2V0V3JhcCB9IGZyb20gJy4uL2ZyYW1ld29yay91dGlsJztcbmltcG9ydCB7IElCYXNlU2hhcGUgfSBmcm9tICcuLi9zcGVjL2ktcGh5c2ljcy1zaGFwZSc7XG5pbXBvcnQgeyBQaHlzaWNzUmF5UmVzdWx0IH0gZnJvbSAnLi4vZnJhbWV3b3JrJztcbmltcG9ydCB7IElSYXljYXN0T3B0aW9ucyB9IGZyb20gJy4uL3NwZWMvaS1waHlzaWNzLXdvcmxkJztcblxuY29uc3QgVmVjMyA9IGNjLlZlYzM7XG5cbmV4cG9ydCBmdW5jdGlvbiBncm91cEluZGV4VG9CaXRNYXNrIChncm91cEluZGV4OiBudW1iZXIsIG91dDogeyBjb2xsaXNpb25GaWx0ZXJHcm91cDogbnVtYmVyOyBjb2xsaXNpb25GaWx0ZXJNYXNrOiBudW1iZXI7IH0pIHtcbiAgICBsZXQgY2F0ZWdvcnlCaXRzID0gMSA8PCBncm91cEluZGV4O1xuICAgIGxldCBtYXNrQml0cyA9IDA7XG4gICAgbGV0IGJpdHMgPSBjYy5nYW1lLmNvbGxpc2lvbk1hdHJpeFtncm91cEluZGV4XTtcbiAgICBpZiAoIWJpdHMpIHtcbiAgICAgICAgY2MuZXJyb3IoXCJjYW5ub24tdXRpbHM6IGdyb3VwIGlzIG5vdCBleGlzdFwiLCBncm91cEluZGV4KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJpdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKCFiaXRzW2ldKSBjb250aW51ZTtcbiAgICAgICAgbWFza0JpdHMgfD0gMSA8PCBpO1xuICAgIH1cbiAgICBvdXQuY29sbGlzaW9uRmlsdGVyR3JvdXAgPSBjYXRlZ29yeUJpdHM7XG4gICAgb3V0LmNvbGxpc2lvbkZpbHRlck1hc2sgPSBtYXNrQml0cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ2Fubm9uUmF5Y2FzdE9wdGlvbnMgKG91dDogQ0FOTk9OLklSYXljYXN0T3B0aW9ucywgb3B0aW9uczogSVJheWNhc3RPcHRpb25zKSB7XG4gICAgb3V0LmNoZWNrQ29sbGlzaW9uUmVzcG9uc2UgPSAhb3B0aW9ucy5xdWVyeVRyaWdnZXI7XG4gICAgZ3JvdXBJbmRleFRvQml0TWFzayhvcHRpb25zLmdyb3VwSW5kZXgsIG91dCk7XG4gICAgb3V0LnNraXBCYWNrRmFjZXMgPSBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbGxSYXljYXN0UmVzdWx0IChyZXN1bHQ6IFBoeXNpY3NSYXlSZXN1bHQsIGNhbm5vblJlc3VsdDogQ0FOTk9OLlJheWNhc3RSZXN1bHQpIHtcbiAgICByZXN1bHQuX2Fzc2lnbihcbiAgICAgICAgVmVjMy5jb3B5KG5ldyBWZWMzKCksIGNhbm5vblJlc3VsdC5oaXRQb2ludFdvcmxkKSxcbiAgICAgICAgY2Fubm9uUmVzdWx0LmRpc3RhbmNlLFxuICAgICAgICBnZXRXcmFwPElCYXNlU2hhcGU+KGNhbm5vblJlc3VsdC5zaGFwZSkuY29sbGlkZXJcbiAgICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tbWl0U2hhcGVVcGRhdGVzIChib2R5OiBDQU5OT04uQm9keSkge1xuICAgIGJvZHkuYWFiYk5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICBib2R5LnVwZGF0ZU1hc3NQcm9wZXJ0aWVzKCk7XG4gICAgYm9keS51cGRhdGVCb3VuZGluZ1JhZGl1cygpO1xufVxuXG5leHBvcnQgY29uc3QgZGVwcmVjYXRlZEV2ZW50TWFwID0ge1xuICAgICdvbkNvbGxpc2lvbkVudGVyJzogJ2NvbGxpc2lvbi1lbnRlcicsXG4gICAgJ29uQ29sbGlzaW9uU3RheSc6ICdjb2xsaXNpb24tc3RheScsXG4gICAgJ29uQ29sbGlzaW9uRXhpdCc6ICdjb2xsaXNpb24tZXhpdCcsXG4gICAgJ29uVHJpZ2dlckVudGVyJzogJ3RyaWdnZXItZW50ZXInLFxuICAgICdvblRyaWdnZXJTdGF5JzogJ3RyaWdnZXItc3RheScsXG4gICAgJ29uVHJpZ2dlckV4aXQnOiAndHJpZ2dlci1leGl0Jyxcbn07XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==