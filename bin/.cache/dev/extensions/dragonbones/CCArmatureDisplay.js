
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/dragonbones/CCArmatureDisplay.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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
var EventTarget = require('../../cocos2d/core/event/event-target');

dragonBones.CCArmatureDisplay = cc.Class({
  name: 'dragonBones.CCArmatureDisplay',
  properties: {
    // adapt old api
    node: {
      get: function get() {
        return this;
      }
    }
  },
  ctor: function ctor() {
    this._eventTarget = new EventTarget();
  },
  setEventTarget: function setEventTarget(eventTarget) {
    this._eventTarget = eventTarget;
  },
  getRootDisplay: function getRootDisplay() {
    var parentSlot = this._armature._parent;

    if (!parentSlot) {
      return this;
    }

    var slot;

    while (parentSlot) {
      slot = parentSlot;
      parentSlot = parentSlot._armature._parent;
    }

    return slot._armature.getDisplay();
  },
  convertToRootSpace: function convertToRootSpace(pos) {
    var slot = this._armature._parent;

    if (!slot) {
      return pos;
    }

    slot.updateWorldMatrix();
    var worldMatrix = slot._worldMatrix;
    var worldMatrixm = worldMatrix.m;
    var newPos = cc.v2(0, 0);
    newPos.x = pos.x * worldMatrixm[0] + pos.y * worldMatrixm[4] + worldMatrixm[12];
    newPos.y = pos.x * worldMatrixm[1] + pos.y * worldMatrixm[5] + worldMatrixm[13];
    return newPos;
  },
  convertToWorldSpace: function convertToWorldSpace(point) {
    var newPos = this.convertToRootSpace(point);
    var ccNode = this.getRootNode();
    var finalPos = ccNode.convertToWorldSpaceAR(newPos);
    return finalPos;
  },
  getRootNode: function getRootNode() {
    var rootDisplay = this.getRootDisplay();
    return rootDisplay && rootDisplay._ccNode;
  },
  ////////////////////////////////////
  // dragonbones api
  dbInit: function dbInit(armature) {
    this._armature = armature;
  },
  dbClear: function dbClear() {
    this._armature = null;
  },
  dbUpdate: function dbUpdate() {},
  advanceTimeBySelf: function advanceTimeBySelf(on) {
    this.shouldAdvanced = !!on;
  },
  hasDBEventListener: function hasDBEventListener(type) {
    return this._eventTarget.hasEventListener(type);
  },
  addDBEventListener: function addDBEventListener(type, listener, target) {
    this._eventTarget.on(type, listener, target);
  },
  removeDBEventListener: function removeDBEventListener(type, listener, target) {
    this._eventTarget.off(type, listener, target);
  },
  dispatchDBEvent: function dispatchDBEvent(type, eventObject) {
    this._eventTarget.emit(type, eventObject);
  } ////////////////////////////////////

});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvZXh0ZW5zaW9ucy9kcmFnb25ib25lcy9DQ0FybWF0dXJlRGlzcGxheS5qcyJdLCJuYW1lcyI6WyJFdmVudFRhcmdldCIsInJlcXVpcmUiLCJkcmFnb25Cb25lcyIsIkNDQXJtYXR1cmVEaXNwbGF5IiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJwcm9wZXJ0aWVzIiwibm9kZSIsImdldCIsImN0b3IiLCJfZXZlbnRUYXJnZXQiLCJzZXRFdmVudFRhcmdldCIsImV2ZW50VGFyZ2V0IiwiZ2V0Um9vdERpc3BsYXkiLCJwYXJlbnRTbG90IiwiX2FybWF0dXJlIiwiX3BhcmVudCIsInNsb3QiLCJnZXREaXNwbGF5IiwiY29udmVydFRvUm9vdFNwYWNlIiwicG9zIiwidXBkYXRlV29ybGRNYXRyaXgiLCJ3b3JsZE1hdHJpeCIsIl93b3JsZE1hdHJpeCIsIndvcmxkTWF0cml4bSIsIm0iLCJuZXdQb3MiLCJ2MiIsIngiLCJ5IiwiY29udmVydFRvV29ybGRTcGFjZSIsInBvaW50IiwiY2NOb2RlIiwiZ2V0Um9vdE5vZGUiLCJmaW5hbFBvcyIsImNvbnZlcnRUb1dvcmxkU3BhY2VBUiIsInJvb3REaXNwbGF5IiwiX2NjTm9kZSIsImRiSW5pdCIsImFybWF0dXJlIiwiZGJDbGVhciIsImRiVXBkYXRlIiwiYWR2YW5jZVRpbWVCeVNlbGYiLCJvbiIsInNob3VsZEFkdmFuY2VkIiwiaGFzREJFdmVudExpc3RlbmVyIiwidHlwZSIsImhhc0V2ZW50TGlzdGVuZXIiLCJhZGREQkV2ZW50TGlzdGVuZXIiLCJsaXN0ZW5lciIsInRhcmdldCIsInJlbW92ZURCRXZlbnRMaXN0ZW5lciIsIm9mZiIsImRpc3BhdGNoREJFdmVudCIsImV2ZW50T2JqZWN0IiwiZW1pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUlBLFdBQVcsR0FBR0MsT0FBTyxDQUFDLHVDQUFELENBQXpCOztBQUVBQyxXQUFXLENBQUNDLGlCQUFaLEdBQWdDQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNyQ0MsRUFBQUEsSUFBSSxFQUFFLCtCQUQrQjtBQUdyQ0MsRUFBQUEsVUFBVSxFQUFFO0FBQ1I7QUFDQUMsSUFBQUEsSUFBSSxFQUFFO0FBQ0ZDLE1BQUFBLEdBREUsaUJBQ0s7QUFDSCxlQUFPLElBQVA7QUFDSDtBQUhDO0FBRkUsR0FIeUI7QUFZckNDLEVBQUFBLElBWnFDLGtCQVk3QjtBQUNKLFNBQUtDLFlBQUwsR0FBb0IsSUFBSVgsV0FBSixFQUFwQjtBQUNILEdBZG9DO0FBZ0JyQ1ksRUFBQUEsY0FoQnFDLDBCQWdCckJDLFdBaEJxQixFQWdCUjtBQUN6QixTQUFLRixZQUFMLEdBQW9CRSxXQUFwQjtBQUNILEdBbEJvQztBQW9CckNDLEVBQUFBLGNBcEJxQyw0QkFvQm5CO0FBQ2QsUUFBSUMsVUFBVSxHQUFHLEtBQUtDLFNBQUwsQ0FBZUMsT0FBaEM7O0FBQ0EsUUFBSSxDQUFDRixVQUFMLEVBQWlCO0FBQ2IsYUFBTyxJQUFQO0FBQ0g7O0FBRUQsUUFBSUcsSUFBSjs7QUFDQSxXQUFPSCxVQUFQLEVBQ0E7QUFDSUcsTUFBQUEsSUFBSSxHQUFHSCxVQUFQO0FBQ0FBLE1BQUFBLFVBQVUsR0FBR0EsVUFBVSxDQUFDQyxTQUFYLENBQXFCQyxPQUFsQztBQUNIOztBQUNELFdBQU9DLElBQUksQ0FBQ0YsU0FBTCxDQUFlRyxVQUFmLEVBQVA7QUFDSCxHQWpDb0M7QUFtQ3JDQyxFQUFBQSxrQkFuQ3FDLDhCQW1DakJDLEdBbkNpQixFQW1DWjtBQUNyQixRQUFJSCxJQUFJLEdBQUcsS0FBS0YsU0FBTCxDQUFlQyxPQUExQjs7QUFDQSxRQUFJLENBQUNDLElBQUwsRUFDQTtBQUNJLGFBQU9HLEdBQVA7QUFDSDs7QUFDREgsSUFBQUEsSUFBSSxDQUFDSSxpQkFBTDtBQUVBLFFBQUlDLFdBQVcsR0FBR0wsSUFBSSxDQUFDTSxZQUF2QjtBQUNBLFFBQUlDLFlBQVksR0FBR0YsV0FBVyxDQUFDRyxDQUEvQjtBQUNBLFFBQUlDLE1BQU0sR0FBR3ZCLEVBQUUsQ0FBQ3dCLEVBQUgsQ0FBTSxDQUFOLEVBQVEsQ0FBUixDQUFiO0FBQ0FELElBQUFBLE1BQU0sQ0FBQ0UsQ0FBUCxHQUFXUixHQUFHLENBQUNRLENBQUosR0FBUUosWUFBWSxDQUFDLENBQUQsQ0FBcEIsR0FBMEJKLEdBQUcsQ0FBQ1MsQ0FBSixHQUFRTCxZQUFZLENBQUMsQ0FBRCxDQUE5QyxHQUFvREEsWUFBWSxDQUFDLEVBQUQsQ0FBM0U7QUFDQUUsSUFBQUEsTUFBTSxDQUFDRyxDQUFQLEdBQVdULEdBQUcsQ0FBQ1EsQ0FBSixHQUFRSixZQUFZLENBQUMsQ0FBRCxDQUFwQixHQUEwQkosR0FBRyxDQUFDUyxDQUFKLEdBQVFMLFlBQVksQ0FBQyxDQUFELENBQTlDLEdBQW9EQSxZQUFZLENBQUMsRUFBRCxDQUEzRTtBQUNBLFdBQU9FLE1BQVA7QUFDSCxHQWpEb0M7QUFtRHJDSSxFQUFBQSxtQkFuRHFDLCtCQW1EaEJDLEtBbkRnQixFQW1EVDtBQUN4QixRQUFJTCxNQUFNLEdBQUcsS0FBS1Asa0JBQUwsQ0FBd0JZLEtBQXhCLENBQWI7QUFDQSxRQUFJQyxNQUFNLEdBQUcsS0FBS0MsV0FBTCxFQUFiO0FBQ0EsUUFBSUMsUUFBUSxHQUFHRixNQUFNLENBQUNHLHFCQUFQLENBQTZCVCxNQUE3QixDQUFmO0FBQ0EsV0FBT1EsUUFBUDtBQUNILEdBeERvQztBQTBEckNELEVBQUFBLFdBMURxQyx5QkEwRHRCO0FBQ1gsUUFBSUcsV0FBVyxHQUFHLEtBQUt2QixjQUFMLEVBQWxCO0FBQ0EsV0FBT3VCLFdBQVcsSUFBSUEsV0FBVyxDQUFDQyxPQUFsQztBQUNILEdBN0RvQztBQStEckM7QUFDQTtBQUNBQyxFQUFBQSxNQWpFcUMsa0JBaUU3QkMsUUFqRTZCLEVBaUVuQjtBQUNkLFNBQUt4QixTQUFMLEdBQWlCd0IsUUFBakI7QUFDSCxHQW5Fb0M7QUFxRXJDQyxFQUFBQSxPQXJFcUMscUJBcUUxQjtBQUNQLFNBQUt6QixTQUFMLEdBQWlCLElBQWpCO0FBQ0gsR0F2RW9DO0FBeUVyQzBCLEVBQUFBLFFBekVxQyxzQkF5RXpCLENBRVgsQ0EzRW9DO0FBNkVyQ0MsRUFBQUEsaUJBN0VxQyw2QkE2RWpCQyxFQTdFaUIsRUE2RWI7QUFDcEIsU0FBS0MsY0FBTCxHQUFzQixDQUFDLENBQUNELEVBQXhCO0FBQ0gsR0EvRW9DO0FBaUZyQ0UsRUFBQUEsa0JBakZxQyw4QkFpRmpCQyxJQWpGaUIsRUFpRlg7QUFDdEIsV0FBTyxLQUFLcEMsWUFBTCxDQUFrQnFDLGdCQUFsQixDQUFtQ0QsSUFBbkMsQ0FBUDtBQUNILEdBbkZvQztBQXFGckNFLEVBQUFBLGtCQXJGcUMsOEJBcUZqQkYsSUFyRmlCLEVBcUZYRyxRQXJGVyxFQXFGREMsTUFyRkMsRUFxRk87QUFDeEMsU0FBS3hDLFlBQUwsQ0FBa0JpQyxFQUFsQixDQUFxQkcsSUFBckIsRUFBMkJHLFFBQTNCLEVBQXFDQyxNQUFyQztBQUNILEdBdkZvQztBQXlGckNDLEVBQUFBLHFCQXpGcUMsaUNBeUZkTCxJQXpGYyxFQXlGUkcsUUF6RlEsRUF5RkVDLE1BekZGLEVBeUZVO0FBQzNDLFNBQUt4QyxZQUFMLENBQWtCMEMsR0FBbEIsQ0FBc0JOLElBQXRCLEVBQTRCRyxRQUE1QixFQUFzQ0MsTUFBdEM7QUFDSCxHQTNGb0M7QUE2RnJDRyxFQUFBQSxlQTdGcUMsMkJBNkZuQlAsSUE3Rm1CLEVBNkZiUSxXQTdGYSxFQTZGQTtBQUNqQyxTQUFLNUMsWUFBTCxDQUFrQjZDLElBQWxCLENBQXVCVCxJQUF2QixFQUE2QlEsV0FBN0I7QUFDSCxHQS9Gb0MsQ0FnR3JDOztBQWhHcUMsQ0FBVCxDQUFoQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xubGV0IEV2ZW50VGFyZ2V0ID0gcmVxdWlyZSgnLi4vLi4vY29jb3MyZC9jb3JlL2V2ZW50L2V2ZW50LXRhcmdldCcpO1xuXG5kcmFnb25Cb25lcy5DQ0FybWF0dXJlRGlzcGxheSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnZHJhZ29uQm9uZXMuQ0NBcm1hdHVyZURpc3BsYXknLFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBhZGFwdCBvbGQgYXBpXG4gICAgICAgIG5vZGU6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIGN0b3IgKCkge1xuICAgICAgICB0aGlzLl9ldmVudFRhcmdldCA9IG5ldyBFdmVudFRhcmdldCgpO1xuICAgIH0sXG5cbiAgICBzZXRFdmVudFRhcmdldCAoZXZlbnRUYXJnZXQpIHtcbiAgICAgICAgdGhpcy5fZXZlbnRUYXJnZXQgPSBldmVudFRhcmdldDtcbiAgICB9LFxuXG4gICAgZ2V0Um9vdERpc3BsYXkgKCkge1xuICAgICAgICB2YXIgcGFyZW50U2xvdCA9IHRoaXMuX2FybWF0dXJlLl9wYXJlbnQ7XG4gICAgICAgIGlmICghcGFyZW50U2xvdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHZhciBzbG90O1xuICAgICAgICB3aGlsZSAocGFyZW50U2xvdClcbiAgICAgICAge1xuICAgICAgICAgICAgc2xvdCA9IHBhcmVudFNsb3Q7XG4gICAgICAgICAgICBwYXJlbnRTbG90ID0gcGFyZW50U2xvdC5fYXJtYXR1cmUuX3BhcmVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2xvdC5fYXJtYXR1cmUuZ2V0RGlzcGxheSgpO1xuICAgIH0sXG5cbiAgICBjb252ZXJ0VG9Sb290U3BhY2UgKHBvcykge1xuICAgICAgICB2YXIgc2xvdCA9IHRoaXMuX2FybWF0dXJlLl9wYXJlbnQ7XG4gICAgICAgIGlmICghc2xvdClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHBvcztcbiAgICAgICAgfVxuICAgICAgICBzbG90LnVwZGF0ZVdvcmxkTWF0cml4KCk7XG5cbiAgICAgICAgbGV0IHdvcmxkTWF0cml4ID0gc2xvdC5fd29ybGRNYXRyaXg7XG4gICAgICAgIGxldCB3b3JsZE1hdHJpeG0gPSB3b3JsZE1hdHJpeC5tO1xuICAgICAgICBsZXQgbmV3UG9zID0gY2MudjIoMCwwKTtcbiAgICAgICAgbmV3UG9zLnggPSBwb3MueCAqIHdvcmxkTWF0cml4bVswXSArIHBvcy55ICogd29ybGRNYXRyaXhtWzRdICsgd29ybGRNYXRyaXhtWzEyXTtcbiAgICAgICAgbmV3UG9zLnkgPSBwb3MueCAqIHdvcmxkTWF0cml4bVsxXSArIHBvcy55ICogd29ybGRNYXRyaXhtWzVdICsgd29ybGRNYXRyaXhtWzEzXTtcbiAgICAgICAgcmV0dXJuIG5ld1BvcztcbiAgICB9LFxuXG4gICAgY29udmVydFRvV29ybGRTcGFjZSAocG9pbnQpIHtcbiAgICAgICAgdmFyIG5ld1BvcyA9IHRoaXMuY29udmVydFRvUm9vdFNwYWNlKHBvaW50KTtcbiAgICAgICAgdmFyIGNjTm9kZSA9IHRoaXMuZ2V0Um9vdE5vZGUoKTtcbiAgICAgICAgdmFyIGZpbmFsUG9zID0gY2NOb2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihuZXdQb3MpO1xuICAgICAgICByZXR1cm4gZmluYWxQb3M7XG4gICAgfSxcblxuICAgIGdldFJvb3ROb2RlICgpIHtcbiAgICAgICAgdmFyIHJvb3REaXNwbGF5ID0gdGhpcy5nZXRSb290RGlzcGxheSgpO1xuICAgICAgICByZXR1cm4gcm9vdERpc3BsYXkgJiYgcm9vdERpc3BsYXkuX2NjTm9kZTtcbiAgICB9LFxuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gZHJhZ29uYm9uZXMgYXBpXG4gICAgZGJJbml0IChhcm1hdHVyZSkge1xuICAgICAgICB0aGlzLl9hcm1hdHVyZSA9IGFybWF0dXJlO1xuICAgIH0sXG5cbiAgICBkYkNsZWFyICgpIHtcbiAgICAgICAgdGhpcy5fYXJtYXR1cmUgPSBudWxsO1xuICAgIH0sXG5cbiAgICBkYlVwZGF0ZSAoKSB7XG4gICAgICAgIFxuICAgIH0sXG5cbiAgICBhZHZhbmNlVGltZUJ5U2VsZiAgKG9uKSB7XG4gICAgICAgIHRoaXMuc2hvdWxkQWR2YW5jZWQgPSAhIW9uO1xuICAgIH0sXG5cbiAgICBoYXNEQkV2ZW50TGlzdGVuZXIgKHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50VGFyZ2V0Lmhhc0V2ZW50TGlzdGVuZXIodHlwZSk7XG4gICAgfSxcblxuICAgIGFkZERCRXZlbnRMaXN0ZW5lciAodHlwZSwgbGlzdGVuZXIsIHRhcmdldCkge1xuICAgICAgICB0aGlzLl9ldmVudFRhcmdldC5vbih0eXBlLCBsaXN0ZW5lciwgdGFyZ2V0KTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlREJFdmVudExpc3RlbmVyICh0eXBlLCBsaXN0ZW5lciwgdGFyZ2V0KSB7XG4gICAgICAgIHRoaXMuX2V2ZW50VGFyZ2V0Lm9mZih0eXBlLCBsaXN0ZW5lciwgdGFyZ2V0KTtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hEQkV2ZW50ICAodHlwZSwgZXZlbnRPYmplY3QpIHtcbiAgICAgICAgdGhpcy5fZXZlbnRUYXJnZXQuZW1pdCh0eXBlLCBldmVudE9iamVjdCk7XG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG59KTtcbiJdLCJzb3VyY2VSb290IjoiLyJ9