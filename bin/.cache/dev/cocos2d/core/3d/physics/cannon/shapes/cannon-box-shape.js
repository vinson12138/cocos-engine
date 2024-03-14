
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/cannon/shapes/cannon-box-shape.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.CannonBoxShape = void 0;

var _cannon = _interopRequireDefault(require("../../../../../../external/cannon/cannon"));

var _cannonUtil = require("../cannon-util");

var _cannonShape = require("./cannon-shape");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Vec3 = cc.Vec3;
var v3_0 = new Vec3();

var CannonBoxShape = /*#__PURE__*/function (_CannonShape) {
  _inheritsLoose(CannonBoxShape, _CannonShape);

  function CannonBoxShape(size) {
    var _this;

    _this = _CannonShape.call(this) || this;
    _this.halfExtent = new _cannon["default"].Vec3();
    Vec3.multiplyScalar(_this.halfExtent, size, 0.5);
    _this._shape = new _cannon["default"].Box(_this.halfExtent.clone());
    return _this;
  }

  var _proto = CannonBoxShape.prototype;

  _proto.onLoad = function onLoad() {
    _CannonShape.prototype.onLoad.call(this);

    this.size = this.boxCollider.size;
  };

  _proto.setScale = function setScale(scale) {
    _CannonShape.prototype.setScale.call(this, scale);

    this.size = this.boxCollider.size;
  };

  _createClass(CannonBoxShape, [{
    key: "boxCollider",
    get: function get() {
      return this.collider;
    }
  }, {
    key: "box",
    get: function get() {
      return this._shape;
    }
  }, {
    key: "size",
    set: function set(v) {
      this.collider.node.getWorldScale(v3_0);
      v3_0.x = Math.abs(v3_0.x);
      v3_0.y = Math.abs(v3_0.y);
      v3_0.z = Math.abs(v3_0.z);
      Vec3.multiplyScalar(this.halfExtent, v, 0.5);
      Vec3.multiply(this.box.halfExtents, this.halfExtent, v3_0);
      this.box.updateConvexPolyhedronRepresentation();

      if (this._index != -1) {
        (0, _cannonUtil.commitShapeUpdates)(this._body);
      }
    }
  }]);

  return CannonBoxShape;
}(_cannonShape.CannonShape);

exports.CannonBoxShape = CannonBoxShape;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlLzNkL3BoeXNpY3MvY2Fubm9uL3NoYXBlcy9jYW5ub24tYm94LXNoYXBlLnRzIl0sIm5hbWVzIjpbIlZlYzMiLCJjYyIsInYzXzAiLCJDYW5ub25Cb3hTaGFwZSIsInNpemUiLCJoYWxmRXh0ZW50IiwiQ0FOTk9OIiwibXVsdGlwbHlTY2FsYXIiLCJfc2hhcGUiLCJCb3giLCJjbG9uZSIsIm9uTG9hZCIsImJveENvbGxpZGVyIiwic2V0U2NhbGUiLCJzY2FsZSIsImNvbGxpZGVyIiwidiIsIm5vZGUiLCJnZXRXb3JsZFNjYWxlIiwieCIsIk1hdGgiLCJhYnMiLCJ5IiwieiIsIm11bHRpcGx5IiwiYm94IiwiaGFsZkV4dGVudHMiLCJ1cGRhdGVDb252ZXhQb2x5aGVkcm9uUmVwcmVzZW50YXRpb24iLCJfaW5kZXgiLCJfYm9keSIsIkNhbm5vblNoYXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFLQSxJQUFNQSxJQUFJLEdBQUdDLEVBQUUsQ0FBQ0QsSUFBaEI7QUFDQSxJQUFNRSxJQUFJLEdBQUcsSUFBSUYsSUFBSixFQUFiOztJQUVhRzs7O0FBV1QsMEJBQWFDLElBQWIsRUFBNEI7QUFBQTs7QUFDeEI7QUFEd0IsVUFEbkJDLFVBQ21CLEdBRE8sSUFBSUMsbUJBQU9OLElBQVgsRUFDUDtBQUV4QkEsSUFBQUEsSUFBSSxDQUFDTyxjQUFMLENBQW9CLE1BQUtGLFVBQXpCLEVBQXFDRCxJQUFyQyxFQUEyQyxHQUEzQztBQUNBLFVBQUtJLE1BQUwsR0FBYyxJQUFJRixtQkFBT0csR0FBWCxDQUFlLE1BQUtKLFVBQUwsQ0FBZ0JLLEtBQWhCLEVBQWYsQ0FBZDtBQUh3QjtBQUkzQjs7OztTQWVEQyxTQUFBLGtCQUFVO0FBQ04sMkJBQU1BLE1BQU47O0FBQ0EsU0FBS1AsSUFBTCxHQUFZLEtBQUtRLFdBQUwsQ0FBaUJSLElBQTdCO0FBQ0g7O1NBRURTLFdBQUEsa0JBQVVDLEtBQVYsRUFBZ0M7QUFDNUIsMkJBQU1ELFFBQU4sWUFBZUMsS0FBZjs7QUFDQSxTQUFLVixJQUFMLEdBQVksS0FBS1EsV0FBTCxDQUFpQlIsSUFBN0I7QUFDSDs7OztTQXBDRCxlQUEwQjtBQUN0QixhQUFPLEtBQUtXLFFBQVo7QUFDSDs7O1NBRUQsZUFBa0I7QUFDZCxhQUFPLEtBQUtQLE1BQVo7QUFDSDs7O1NBU0QsYUFBVVEsQ0FBVixFQUF3QjtBQUNwQixXQUFLRCxRQUFMLENBQWNFLElBQWQsQ0FBbUJDLGFBQW5CLENBQWlDaEIsSUFBakM7QUFDQUEsTUFBQUEsSUFBSSxDQUFDaUIsQ0FBTCxHQUFTQyxJQUFJLENBQUNDLEdBQUwsQ0FBU25CLElBQUksQ0FBQ2lCLENBQWQsQ0FBVDtBQUNBakIsTUFBQUEsSUFBSSxDQUFDb0IsQ0FBTCxHQUFTRixJQUFJLENBQUNDLEdBQUwsQ0FBU25CLElBQUksQ0FBQ29CLENBQWQsQ0FBVDtBQUNBcEIsTUFBQUEsSUFBSSxDQUFDcUIsQ0FBTCxHQUFTSCxJQUFJLENBQUNDLEdBQUwsQ0FBU25CLElBQUksQ0FBQ3FCLENBQWQsQ0FBVDtBQUNBdkIsTUFBQUEsSUFBSSxDQUFDTyxjQUFMLENBQW9CLEtBQUtGLFVBQXpCLEVBQXFDVyxDQUFyQyxFQUF3QyxHQUF4QztBQUNBaEIsTUFBQUEsSUFBSSxDQUFDd0IsUUFBTCxDQUFjLEtBQUtDLEdBQUwsQ0FBU0MsV0FBdkIsRUFBb0MsS0FBS3JCLFVBQXpDLEVBQXFESCxJQUFyRDtBQUNBLFdBQUt1QixHQUFMLENBQVNFLG9DQUFUOztBQUNBLFVBQUksS0FBS0MsTUFBTCxJQUFlLENBQUMsQ0FBcEIsRUFBdUI7QUFDbkIsNENBQW1CLEtBQUtDLEtBQXhCO0FBQ0g7QUFDSjs7OztFQTVCK0JDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBDQU5OT04gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vZXh0ZXJuYWwvY2Fubm9uL2Nhbm5vbic7XG5pbXBvcnQgeyBjb21taXRTaGFwZVVwZGF0ZXMgfSBmcm9tICcuLi9jYW5ub24tdXRpbCc7XG5pbXBvcnQgeyBDYW5ub25TaGFwZSB9IGZyb20gJy4vY2Fubm9uLXNoYXBlJztcbmltcG9ydCB7IElCb3hTaGFwZSB9IGZyb20gJy4uLy4uL3NwZWMvaS1waHlzaWNzLXNoYXBlJztcbmltcG9ydCB7IElWZWMzTGlrZSB9IGZyb20gJy4uLy4uL3NwZWMvaS1jb21tb24nO1xuaW1wb3J0IHsgQm94Q29sbGlkZXIzRCB9IGZyb20gJy4uLy4uL2V4cG9ydHMvcGh5c2ljcy1mcmFtZXdvcmsnO1xuXG5jb25zdCBWZWMzID0gY2MuVmVjMztcbmNvbnN0IHYzXzAgPSBuZXcgVmVjMygpO1xuXG5leHBvcnQgY2xhc3MgQ2Fubm9uQm94U2hhcGUgZXh0ZW5kcyBDYW5ub25TaGFwZSBpbXBsZW1lbnRzIElCb3hTaGFwZSB7XG5cbiAgICBwdWJsaWMgZ2V0IGJveENvbGxpZGVyICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sbGlkZXIgYXMgQm94Q29sbGlkZXIzRDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGJveCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFwZSBhcyBDQU5OT04uQm94O1xuICAgIH1cblxuICAgIHJlYWRvbmx5IGhhbGZFeHRlbnQ6IENBTk5PTi5WZWMzID0gbmV3IENBTk5PTi5WZWMzKCk7XG4gICAgY29uc3RydWN0b3IgKHNpemU6IGNjLlZlYzMpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgVmVjMy5tdWx0aXBseVNjYWxhcih0aGlzLmhhbGZFeHRlbnQsIHNpemUsIDAuNSk7XG4gICAgICAgIHRoaXMuX3NoYXBlID0gbmV3IENBTk5PTi5Cb3godGhpcy5oYWxmRXh0ZW50LmNsb25lKCkpO1xuICAgIH1cblxuICAgIHNldCBzaXplICh2OiBJVmVjM0xpa2UpIHtcbiAgICAgICAgdGhpcy5jb2xsaWRlci5ub2RlLmdldFdvcmxkU2NhbGUodjNfMCk7XG4gICAgICAgIHYzXzAueCA9IE1hdGguYWJzKHYzXzAueCk7XG4gICAgICAgIHYzXzAueSA9IE1hdGguYWJzKHYzXzAueSk7XG4gICAgICAgIHYzXzAueiA9IE1hdGguYWJzKHYzXzAueik7XG4gICAgICAgIFZlYzMubXVsdGlwbHlTY2FsYXIodGhpcy5oYWxmRXh0ZW50LCB2LCAwLjUpO1xuICAgICAgICBWZWMzLm11bHRpcGx5KHRoaXMuYm94LmhhbGZFeHRlbnRzLCB0aGlzLmhhbGZFeHRlbnQsIHYzXzApO1xuICAgICAgICB0aGlzLmJveC51cGRhdGVDb252ZXhQb2x5aGVkcm9uUmVwcmVzZW50YXRpb24oKTtcbiAgICAgICAgaWYgKHRoaXMuX2luZGV4ICE9IC0xKSB7XG4gICAgICAgICAgICBjb21taXRTaGFwZVVwZGF0ZXModGhpcy5fYm9keSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkxvYWQgKCkge1xuICAgICAgICBzdXBlci5vbkxvYWQoKTtcbiAgICAgICAgdGhpcy5zaXplID0gdGhpcy5ib3hDb2xsaWRlci5zaXplO1xuICAgIH1cblxuICAgIHNldFNjYWxlIChzY2FsZTogY2MuVmVjMyk6IHZvaWQge1xuICAgICAgICBzdXBlci5zZXRTY2FsZShzY2FsZSk7XG4gICAgICAgIHRoaXMuc2l6ZSA9IHRoaXMuYm94Q29sbGlkZXIuc2l6ZTtcbiAgICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==