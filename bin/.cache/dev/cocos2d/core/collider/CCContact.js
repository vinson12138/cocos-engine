
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/collider/CCContact.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
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
var Intersection = require('./CCIntersection');

var CollisionType = cc.Enum({
  None: 0,
  CollisionEnter: 1,
  CollisionStay: 2,
  CollisionExit: 3
});

function Contact(collider1, collider2) {
  this.collider1 = collider1;
  this.collider2 = collider2;
  this.touching = false;
  var isCollider1Polygon = collider1 instanceof cc.BoxCollider || collider1 instanceof cc.PolygonCollider;
  var isCollider2Polygon = collider2 instanceof cc.BoxCollider || collider2 instanceof cc.PolygonCollider;
  var isCollider1Circle = collider1 instanceof cc.CircleCollider;
  var isCollider2Circle = collider2 instanceof cc.CircleCollider;

  if (isCollider1Polygon && isCollider2Polygon) {
    this.testFunc = Intersection.polygonPolygon;
  } else if (isCollider1Circle && isCollider2Circle) {
    this.testFunc = Intersection.circleCircle;
  } else if (isCollider1Polygon && isCollider2Circle) {
    this.testFunc = Intersection.polygonCircle;
  } else if (isCollider1Circle && isCollider2Polygon) {
    this.testFunc = Intersection.polygonCircle;
    this.collider1 = collider2;
    this.collider2 = collider1;
  } else {
    cc.errorID(6601, cc.js.getClassName(collider1), cc.js.getClassName(collider2));
  }
}

Contact.prototype.test = function () {
  var world1 = this.collider1.world;
  var world2 = this.collider2.world;

  if (!world1.aabb.intersects(world2.aabb)) {
    return false;
  }

  if (this.testFunc === Intersection.polygonPolygon) {
    return this.testFunc(world1.points, world2.points);
  } else if (this.testFunc === Intersection.circleCircle) {
    return this.testFunc(world1, world2);
  } else if (this.testFunc === Intersection.polygonCircle) {
    return this.testFunc(world1.points, world2);
  }

  return false;
};

Contact.prototype.updateState = function () {
  var result = this.test();
  var type = CollisionType.None;

  if (result && !this.touching) {
    this.touching = true;
    type = CollisionType.CollisionEnter;
  } else if (result && this.touching) {
    type = CollisionType.CollisionStay;
  } else if (!result && this.touching) {
    this.touching = false;
    type = CollisionType.CollisionExit;
  }

  return type;
};

Contact.CollisionType = CollisionType;
module.exports = Contact;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbGxpZGVyL0NDQ29udGFjdC5qcyJdLCJuYW1lcyI6WyJJbnRlcnNlY3Rpb24iLCJyZXF1aXJlIiwiQ29sbGlzaW9uVHlwZSIsImNjIiwiRW51bSIsIk5vbmUiLCJDb2xsaXNpb25FbnRlciIsIkNvbGxpc2lvblN0YXkiLCJDb2xsaXNpb25FeGl0IiwiQ29udGFjdCIsImNvbGxpZGVyMSIsImNvbGxpZGVyMiIsInRvdWNoaW5nIiwiaXNDb2xsaWRlcjFQb2x5Z29uIiwiQm94Q29sbGlkZXIiLCJQb2x5Z29uQ29sbGlkZXIiLCJpc0NvbGxpZGVyMlBvbHlnb24iLCJpc0NvbGxpZGVyMUNpcmNsZSIsIkNpcmNsZUNvbGxpZGVyIiwiaXNDb2xsaWRlcjJDaXJjbGUiLCJ0ZXN0RnVuYyIsInBvbHlnb25Qb2x5Z29uIiwiY2lyY2xlQ2lyY2xlIiwicG9seWdvbkNpcmNsZSIsImVycm9ySUQiLCJqcyIsImdldENsYXNzTmFtZSIsInByb3RvdHlwZSIsInRlc3QiLCJ3b3JsZDEiLCJ3b3JsZCIsIndvcmxkMiIsImFhYmIiLCJpbnRlcnNlY3RzIiwicG9pbnRzIiwidXBkYXRlU3RhdGUiLCJyZXN1bHQiLCJ0eXBlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBLElBQUlBLFlBQVksR0FBR0MsT0FBTyxDQUFDLGtCQUFELENBQTFCOztBQUVBLElBQUlDLGFBQWEsR0FBR0MsRUFBRSxDQUFDQyxJQUFILENBQVE7QUFDeEJDLEVBQUFBLElBQUksRUFBRSxDQURrQjtBQUV4QkMsRUFBQUEsY0FBYyxFQUFFLENBRlE7QUFHeEJDLEVBQUFBLGFBQWEsRUFBRSxDQUhTO0FB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ekI7O0FBQ0EsTUFBSStCLE1BQU0sSUFBSSxDQUFDLEtBQUt4QixRQUFwQixFQUE4QjtBQUMxQixTQUFLQSxRQUFMLEdBQWdCLElBQWhCO0FBQ0F5QixJQUFBQSxJQUFJLEdBQUduQyxhQUFhLENBQUNJLGNBQXJCO0FBQ0gsR0FIRCxNQUlLLElBQUk4QixNQUFNLElBQUksS0FBS3hCLFFBQW5CLEVBQTZCO0FBQzlCeUIsSUFBQUEsSUFBSSxHQUFHbkMsYUFBYSxDQUFDSyxhQUFyQjtBQUNILEdBRkksTUFHQSxJQUFJLENBQUM2QixNQUFELElBQVcsS0FBS3hCLFFBQXBCLEVBQThCO0FBQy9CLFNBQUtBLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQXlCLElBQUFBLElBQUksR0FBR25DLGFBQWEsQ0FBQ00sYUFBckI7QUFDSDs7QUFFRCxTQUFPNkIsSUFBUDtBQUNILENBakJEOztBQW9CQTVCLE9BQU8sQ0FBQ1AsYUFBUixHQUF3QkEsYUFBeEI7QUFFQW9DLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjlCLE9BQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG52YXIgSW50ZXJzZWN0aW9uID0gcmVxdWlyZSgnLi9DQ0ludGVyc2VjdGlvbicpO1xuXG52YXIgQ29sbGlzaW9uVHlwZSA9IGNjLkVudW0oe1xuICAgIE5vbmU6IDAsXG4gICAgQ29sbGlzaW9uRW50ZXI6IDEsXG4gICAgQ29sbGlzaW9uU3RheTogMixcbiAgICBDb2xsaXNpb25FeGl0OiAzXG59KTtcblxuZnVuY3Rpb24gQ29udGFjdCAoY29sbGlkZXIxLCBjb2xsaWRlcjIpIHtcbiAgICB0aGlzLmNvbGxpZGVyMSA9IGNvbGxpZGVyMTtcbiAgICB0aGlzLmNvbGxpZGVyMiA9IGNvbGxpZGVyMjtcblxuICAgIHRoaXMudG91Y2hpbmcgPSBmYWxzZTtcblxuICAgIHZhciBpc0NvbGxpZGVyMVBvbHlnb24gPSAoY29sbGlkZXIxIGluc3RhbmNlb2YgY2MuQm94Q29sbGlkZXIpIHx8IChjb2xsaWRlcjEgaW5zdGFuY2VvZiBjYy5Qb2x5Z29uQ29sbGlkZXIpO1xuICAgIHZhciBpc0NvbGxpZGVyMlBvbHlnb24gPSAoY29sbGlkZXIyIGluc3RhbmNlb2YgY2MuQm94Q29sbGlkZXIpIHx8IChjb2xsaWRlcjIgaW5zdGFuY2VvZiBjYy5Qb2x5Z29uQ29sbGlkZXIpO1xuICAgIHZhciBpc0NvbGxpZGVyMUNpcmNsZSA9IGNvbGxpZGVyMSBpbnN0YW5jZW9mIGNjLkNpcmNsZUNvbGxpZGVyO1xuICAgIHZhciBpc0NvbGxpZGVyMkNpcmNsZSA9IGNvbGxpZGVyMiBpbnN0YW5jZW9mIGNjLkNpcmNsZUNvbGxpZGVyO1xuXG4gICAgaWYgKGlzQ29sbGlkZXIxUG9seWdvbiAmJiBpc0NvbGxpZGVyMlBvbHlnb24pIHtcbiAgICAgICAgdGhpcy50ZXN0RnVuYyA9IEludGVyc2VjdGlvbi5wb2x5Z29uUG9seWdvbjtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNDb2xsaWRlcjFDaXJjbGUgJiYgaXNDb2xsaWRlcjJDaXJjbGUpIHtcbiAgICAgICAgdGhpcy50ZXN0RnVuYyA9IEludGVyc2VjdGlvbi5jaXJjbGVDaXJjbGU7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzQ29sbGlkZXIxUG9seWdvbiAmJiBpc0NvbGxpZGVyMkNpcmNsZSkge1xuICAgICAgICB0aGlzLnRlc3RGdW5jID0gSW50ZXJzZWN0aW9uLnBvbHlnb25DaXJjbGU7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzQ29sbGlkZXIxQ2lyY2xlICYmIGlzQ29sbGlkZXIyUG9seWdvbikge1xuICAgICAgICB0aGlzLnRlc3RGdW5jID0gSW50ZXJzZWN0aW9uLnBvbHlnb25DaXJjbGU7XG4gICAgICAgIHRoaXMuY29sbGlkZXIxID0gY29sbGlkZXIyO1xuICAgICAgICB0aGlzLmNvbGxpZGVyMiA9IGNvbGxpZGVyMTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNjLmVycm9ySUQoNjYwMSwgY2MuanMuZ2V0Q2xhc3NOYW1lKGNvbGxpZGVyMSksIGNjLmpzLmdldENsYXNzTmFtZShjb2xsaWRlcjIpKTtcbiAgICB9XG59XG5cbkNvbnRhY3QucHJvdG90eXBlLnRlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHdvcmxkMSA9IHRoaXMuY29sbGlkZXIxLndvcmxkO1xuICAgIHZhciB3b3JsZDIgPSB0aGlzLmNvbGxpZGVyMi53b3JsZDtcblxuICAgIGlmICghd29ybGQxLmFhYmIuaW50ZXJzZWN0cyh3b3JsZDIuYWFiYikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRlc3RGdW5jID09PSBJbnRlcnNlY3Rpb24ucG9seWdvblBvbHlnb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGVzdEZ1bmMod29ybGQxLnBvaW50cywgd29ybGQyLnBvaW50cyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMudGVzdEZ1bmMgPT09IEludGVyc2VjdGlvbi5jaXJjbGVDaXJjbGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGVzdEZ1bmMod29ybGQxLCB3b3JsZDIpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0aGlzLnRlc3RGdW5jID09PSBJbnRlcnNlY3Rpb24ucG9seWdvbkNpcmNsZSkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXN0RnVuYyh3b3JsZDEucG9pbnRzLCB3b3JsZDIpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn07XG5cbkNvbnRhY3QucHJvdG90eXBlLnVwZGF0ZVN0YXRlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHQgPSB0aGlzLnRlc3QoKTtcblxuICAgIHZhciB0eXBlID0gQ29sbGlzaW9uVHlwZS5Ob25lO1xuICAgIGlmIChyZXN1bHQgJiYgIXRoaXMudG91Y2hpbmcpIHtcbiAgICAgICAgdGhpcy50b3VjaGluZyA9IHRydWU7XG4gICAgICAgIHR5cGUgPSBDb2xsaXNpb25UeXBlLkNvbGxpc2lvbkVudGVyO1xuICAgIH1cbiAgICBlbHNlIGlmIChyZXN1bHQgJiYgdGhpcy50b3VjaGluZykge1xuICAgICAgICB0eXBlID0gQ29sbGlzaW9uVHlwZS5Db2xsaXNpb25TdGF5O1xuICAgIH1cbiAgICBlbHNlIGlmICghcmVzdWx0ICYmIHRoaXMudG91Y2hpbmcpIHtcbiAgICAgICAgdGhpcy50b3VjaGluZyA9IGZhbHNlO1xuICAgICAgICB0eXBlID0gQ29sbGlzaW9uVHlwZS5Db2xsaXNpb25FeGl0O1xuICAgIH1cblxuICAgIHJldHVybiB0eXBlO1xufTtcblxuXG5Db250YWN0LkNvbGxpc2lvblR5cGUgPSBDb2xsaXNpb25UeXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRhY3Q7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==