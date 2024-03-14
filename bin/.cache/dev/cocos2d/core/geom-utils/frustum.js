
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/geom-utils/frustum.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _valueTypes = require("../value-types");

var _enums = _interopRequireDefault(require("./enums"));

var _plane = _interopRequireDefault(require("./plane"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _v = new Array(8);

_v[0] = new _valueTypes.Vec3(1, 1, 1);
_v[1] = new _valueTypes.Vec3(-1, 1, 1);
_v[2] = new _valueTypes.Vec3(-1, -1, 1);
_v[3] = new _valueTypes.Vec3(1, -1, 1);
_v[4] = new _valueTypes.Vec3(1, 1, -1);
_v[5] = new _valueTypes.Vec3(-1, 1, -1);
_v[6] = new _valueTypes.Vec3(-1, -1, -1);
_v[7] = new _valueTypes.Vec3(1, -1, -1);
/**
 * !#en frustum
 * !#zh 平截头体
 * @class geomUtils.Frustum
 */

var frustum = /*#__PURE__*/function () {
  /**
   * create a new frustum
   * @method create
   * @static
   * @return {Frustum}
   */
  frustum.create = function create() {
    return new frustum();
  }
  /**
   * Clone a frustum
   * @method clone
   * @param {Frustum} f
   * @static
   * @return {Frustum}
   */
  ;

  frustum.clone = function clone(f) {
    return frustum.copy(new frustum(), f);
  }
  /**
   * Copy the values from one frustum to another
   * @method copy
   * @param {Frustum} out
   * @param {Frustum} f
   * @return {Frustum}
   */
  ;

  frustum.copy = function copy(out, f) {
    out._type = f._type;

    for (var i = 0; i < 6; ++i) {
      _plane["default"].copy(out.planes[i], f.planes[i]);
    }

    for (var _i = 0; _i < 8; ++_i) {
      _valueTypes.Vec3.copy(out.vertices[_i], f.vertices[_i]);
    }

    return out;
  }
  /**
   * @property {Plane[]} planes
   */
  ;

  function frustum() {
    this.planes = void 0;
    this.vertices = void 0;
    this._type = void 0;
    this._type = _enums["default"].SHAPE_FRUSTUM;
    this.planes = new Array(6);

    for (var i = 0; i < 6; ++i) {
      this.planes[i] = _plane["default"].create(0, 0, 0, 0);
    }

    this.vertices = new Array(8);

    for (var _i2 = 0; _i2 < 8; ++_i2) {
      this.vertices[_i2] = new _valueTypes.Vec3();
    }
  }
  /**
   * !#en Update the frustum information according to the given transform matrix.
   * Note that the resulting planes are not normalized under normal mode.
   * @method update
   * @param {Mat4} m the view-projection matrix
   * @param {Mat4} inv the inverse view-projection matrix
   */


  var _proto = frustum.prototype;

  _proto.update = function update(m, inv) {
    // RTR4, ch. 22.14.1, p. 983
    // extract frustum planes from view-proj matrix.
    var mm = m.m; // left plane

    _valueTypes.Vec3.set(this.planes[0].n, mm[3] + mm[0], mm[7] + mm[4], mm[11] + mm[8]);

    this.planes[0].d = -(mm[15] + mm[12]); // right plane

    _valueTypes.Vec3.set(this.planes[1].n, mm[3] - mm[0], mm[7] - mm[4], mm[11] - mm[8]);

    this.planes[1].d = -(mm[15] - mm[12]); // bottom plane

    _valueTypes.Vec3.set(this.planes[2].n, mm[3] + mm[1], mm[7] + mm[5], mm[11] + mm[9]);

    this.planes[2].d = -(mm[15] + mm[13]); // top plane

    _valueTypes.Vec3.set(this.planes[3].n, mm[3] - mm[1], mm[7] - mm[5], mm[11] - mm[9]);

    this.planes[3].d = -(mm[15] - mm[13]); // near plane

    _valueTypes.Vec3.set(this.planes[4].n, mm[3] + mm[2], mm[7] + mm[6], mm[11] + mm[10]);

    this.planes[4].d = -(mm[15] + mm[14]); // far plane

    _valueTypes.Vec3.set(this.planes[5].n, mm[3] - mm[2], mm[7] - mm[6], mm[11] - mm[10]);

    this.planes[5].d = -(mm[15] - mm[14]);

    if (this._type !== _enums["default"].SHAPE_FRUSTUM_ACCURATE) {
      return;
    } // normalize planes


    for (var i = 0; i < 6; i++) {
      var pl = this.planes[i];
      var invDist = 1 / pl.n.length();

      _valueTypes.Vec3.multiplyScalar(pl.n, pl.n, invDist);

      pl.d *= invDist;
    } // update frustum vertices


    for (var _i3 = 0; _i3 < 8; _i3++) {
      _valueTypes.Vec3.transformMat4(this.vertices[_i3], _v[_i3], inv);
    }
  }
  /**
   * !#en transform by matrix
   * @method transform
   * @param {Mat4} mat
   */
  ;

  _proto.transform = function transform(mat) {
    if (this._type !== _enums["default"].SHAPE_FRUSTUM_ACCURATE) {
      return;
    }

    for (var i = 0; i < 8; i++) {
      _valueTypes.Vec3.transformMat4(this.vertices[i], this.vertices[i], mat);
    }

    _plane["default"].fromPoints(this.planes[0], this.vertices[1], this.vertices[5], this.vertices[6]);

    _plane["default"].fromPoints(this.planes[1], this.vertices[3], this.vertices[7], this.vertices[4]);

    _plane["default"].fromPoints(this.planes[2], this.vertices[6], this.vertices[7], this.vertices[3]);

    _plane["default"].fromPoints(this.planes[3], this.vertices[0], this.vertices[4], this.vertices[5]);

    _plane["default"].fromPoints(this.planes[4], this.vertices[2], this.vertices[3], this.vertices[0]);

    _plane["default"].fromPoints(this.planes[0], this.vertices[7], this.vertices[6], this.vertices[5]);
  };

  _createClass(frustum, [{
    key: "accurate",
    set:
    /**
     * Set whether to use accurate intersection testing function on this frustum
     * @property {boolean} accurate
     */
    function set(b) {
      this._type = b ? _enums["default"].SHAPE_FRUSTUM_ACCURATE : _enums["default"].SHAPE_FRUSTUM;
    }
  }]);

  return frustum;
}();

exports["default"] = frustum;

frustum.createOrtho = function () {
  var _temp_v3 = new _valueTypes.Vec3();

  return function (out, width, height, near, far, transform) {
    var halfWidth = width / 2;
    var halfHeight = height / 2;

    _valueTypes.Vec3.set(_temp_v3, halfWidth, halfHeight, near);

    _valueTypes.Vec3.transformMat4(out.vertices[0], _temp_v3, transform);

    _valueTypes.Vec3.set(_temp_v3, -halfWidth, halfHeight, near);

    _valueTypes.Vec3.transformMat4(out.vertices[1], _temp_v3, transform);

    _valueTypes.Vec3.set(_temp_v3, -halfWidth, -halfHeight, near);

    _valueTypes.Vec3.transformMat4(out.vertices[2], _temp_v3, transform);

    _valueTypes.Vec3.set(_temp_v3, halfWidth, -halfHeight, near);

    _valueTypes.Vec3.transformMat4(out.vertices[3], _temp_v3, transform);

    _valueTypes.Vec3.set(_temp_v3, halfWidth, halfHeight, far);

    _valueTypes.Vec3.transformMat4(out.vertices[4], _temp_v3, transform);

    _valueTypes.Vec3.set(_temp_v3, -halfWidth, halfHeight, far);

    _valueTypes.Vec3.transformMat4(out.vertices[5], _temp_v3, transform);

    _valueTypes.Vec3.set(_temp_v3, -halfWidth, -halfHeight, far);

    _valueTypes.Vec3.transformMat4(out.vertices[6], _temp_v3, transform);

    _valueTypes.Vec3.set(_temp_v3, halfWidth, -halfHeight, far);

    _valueTypes.Vec3.transformMat4(out.vertices[7], _temp_v3, transform);

    _plane["default"].fromPoints(out.planes[0], out.vertices[1], out.vertices[6], out.vertices[5]);

    _plane["default"].fromPoints(out.planes[1], out.vertices[3], out.vertices[4], out.vertices[7]);

    _plane["default"].fromPoints(out.planes[2], out.vertices[6], out.vertices[3], out.vertices[7]);

    _plane["default"].fromPoints(out.planes[3], out.vertices[0], out.vertices[5], out.vertices[4]);

    _plane["default"].fromPoints(out.planes[4], out.vertices[2], out.vertices[0], out.vertices[3]);

    _plane["default"].fromPoints(out.planes[0], out.vertices[7], out.vertices[5], out.vertices[6]);
  };
}();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2dlb20tdXRpbHMvZnJ1c3R1bS50cyJdLCJuYW1lcyI6WyJfdiIsIkFycmF5IiwiVmVjMyIsImZydXN0dW0iLCJjcmVhdGUiLCJjbG9uZSIsImYiLCJjb3B5Iiwib3V0IiwiX3R5cGUiLCJpIiwicGxhbmUiLCJwbGFuZXMiLCJ2ZXJ0aWNlcyIsImVudW1zIiwiU0hBUEVfRlJVU1RVTSIsInVwZGF0ZSIsIm0iLCJpbnYiLCJtbSIsInNldCIsIm4iLCJkIiwiU0hBUEVfRlJVU1RVTV9BQ0NVUkFURSIsInBsIiwiaW52RGlzdCIsImxlbmd0aCIsIm11bHRpcGx5U2NhbGFyIiwidHJhbnNmb3JtTWF0NCIsInRyYW5zZm9ybSIsIm1hdCIsImZyb21Qb2ludHMiLCJiIiwiY3JlYXRlT3J0aG8iLCJfdGVtcF92MyIsIndpZHRoIiwiaGVpZ2h0IiwibmVhciIsImZhciIsImhhbGZXaWR0aCIsImhhbGZIZWlnaHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTUEsRUFBRSxHQUFHLElBQUlDLEtBQUosQ0FBVSxDQUFWLENBQVg7O0FBQ0FELEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUSxJQUFJRSxnQkFBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFSO0FBQ0FGLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUSxJQUFJRSxnQkFBSixDQUFTLENBQUMsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsQ0FBUjtBQUNBRixFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEsSUFBSUUsZ0JBQUosQ0FBUyxDQUFDLENBQVYsRUFBYSxDQUFDLENBQWQsRUFBaUIsQ0FBakIsQ0FBUjtBQUNBRixFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEsSUFBSUUsZ0JBQUosQ0FBUyxDQUFULEVBQVksQ0FBQyxDQUFiLEVBQWdCLENBQWhCLENBQVI7QUFDQUYsRUFBRSxDQUFD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QUFHLENBQUNLLFFBQUosQ0FBYSxDQUFiLENBQWpELEVBQWtFTCxHQUFHLENBQUNLLFFBQUosQ0FBYSxDQUFiLENBQWxFOztBQUNBRixzQkFBTW9CLFVBQU4sQ0FBaUJ2QixHQUFHLENBQUNJLE1BQUosQ0FBVyxDQUFYLENBQWpCLEVBQWdDSixHQUFHLENBQUNLLFFBQUosQ0FBYSxDQUFiLENBQWhDLEVBQWlETCxHQUFHLENBQUNLLFFBQUosQ0FBYSxDQUFiLENBQWpELEVBQWtFTCxHQUFHLENBQUNLLFFBQUosQ0FBYSxDQUFiLENBQWxFO0FBQ0gsR0ExQkQ7QUEyQkgsQ0E3QjJCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCB7IE1hdDQsIFZlYzMgfSBmcm9tICcuLi92YWx1ZS10eXBlcyc7XG5pbXBvcnQgZW51bXMgZnJvbSAnLi9lbnVtcyc7XG5pbXBvcnQgcGxhbmUgZnJvbSAnLi9wbGFuZSc7XG5cbmNvbnN0IF92ID0gbmV3IEFycmF5KDgpO1xuX3ZbMF0gPSBuZXcgVmVjMygxLCAxLCAxKTtcbl92WzFdID0gbmV3IFZlYzMoLTEsIDEsIDEpO1xuX3ZbMl0gPSBuZXcgVmVjMygtMSwgLTEsIDEpO1xuX3ZbM10gPSBuZXcgVmVjMygxLCAtMSwgMSk7XG5fdls0XSA9IG5ldyBWZWMzKDEsIDEsIC0xKTtcbl92WzVdID0gbmV3IFZlYzMoLTEsIDEsIC0xKTtcbl92WzZdID0gbmV3IFZlYzMoLTEsIC0xLCAtMSk7XG5fdls3XSA9IG5ldyBWZWMzKDEsIC0xLCAtMSk7XG5cbi8qKlxuICogISNlbiBmcnVzdHVtXG4gKiAhI3poIOW5s+aIquWktOS9k1xuICogQGNsYXNzIGdlb21VdGlscy5GcnVzdHVtXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGZydXN0dW0ge1xuXG4gICAgLyoqXG4gICAgICogU2V0IHdoZXRoZXIgdG8gdXNlIGFjY3VyYXRlIGludGVyc2VjdGlvbiB0ZXN0aW5nIGZ1bmN0aW9uIG9uIHRoaXMgZnJ1c3R1bVxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gYWNjdXJhdGVcbiAgICAgKi9cbiAgICBzZXQgYWNjdXJhdGUgKGI6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fdHlwZSA9IGIgPyBlbnVtcy5TSEFQRV9GUlVTVFVNX0FDQ1VSQVRFIDogZW51bXMuU0hBUEVfRlJVU1RVTTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZU9ydGhvID0gKCgpID0+IHtcbiAgICAgICAgY29uc3QgX3RlbXBfdjMgPSBuZXcgVmVjMygpO1xuICAgICAgICByZXR1cm4gKG91dDogZnJ1c3R1bSwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIG5lYXI6IG51bWJlciwgZmFyOiBudW1iZXIsIHRyYW5zZm9ybTogTWF0NCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaGFsZldpZHRoID0gd2lkdGggLyAyO1xuICAgICAgICAgICAgY29uc3QgaGFsZkhlaWdodCA9IGhlaWdodCAvIDI7XG4gICAgICAgICAgICBWZWMzLnNldChfdGVtcF92MywgaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCBuZWFyKTtcbiAgICAgICAgICAgIFZlYzMudHJhbnNmb3JtTWF0NChvdXQudmVydGljZXNbMF0sIF90ZW1wX3YzLCB0cmFuc2Zvcm0pO1xuICAgICAgICAgICAgVmVjMy5zZXQoX3RlbXBfdjMsIC1oYWxmV2lkdGgsIGhhbGZIZWlnaHQsIG5lYXIpO1xuICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KG91dC52ZXJ0aWNlc1sxXSwgX3RlbXBfdjMsIHRyYW5zZm9ybSk7XG4gICAgICAgICAgICBWZWMzLnNldChfdGVtcF92MywgLWhhbGZXaWR0aCwgLWhhbGZIZWlnaHQsIG5lYXIpO1xuICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KG91dC52ZXJ0aWNlc1syXSwgX3RlbXBfdjMsIHRyYW5zZm9ybSk7XG4gICAgICAgICAgICBWZWMzLnNldChfdGVtcF92MywgaGFsZldpZHRoLCAtaGFsZkhlaWdodCwgbmVhcik7XG4gICAgICAgICAgICBWZWMzLnRyYW5zZm9ybU1hdDQob3V0LnZlcnRpY2VzWzNdLCBfdGVtcF92MywgdHJhbnNmb3JtKTtcbiAgICAgICAgICAgIFZlYzMuc2V0KF90ZW1wX3YzLCBoYWxmV2lkdGgsIGhhbGZIZWlnaHQsIGZhcik7XG4gICAgICAgICAgICBWZWMzLnRyYW5zZm9ybU1hdDQob3V0LnZlcnRpY2VzWzRdLCBfdGVtcF92MywgdHJhbnNmb3JtKTtcbiAgICAgICAgICAgIFZlYzMuc2V0KF90ZW1wX3YzLCAtaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCBmYXIpO1xuICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KG91dC52ZXJ0aWNlc1s1XSwgX3RlbXBfdjMsIHRyYW5zZm9ybSk7XG4gICAgICAgICAgICBWZWMzLnNldChfdGVtcF92MywgLWhhbGZXaWR0aCwgLWhhbGZIZWlnaHQsIGZhcik7XG4gICAgICAgICAgICBWZWMzLnRyYW5zZm9ybU1hdDQob3V0LnZlcnRpY2VzWzZdLCBfdGVtcF92MywgdHJhbnNmb3JtKTtcbiAgICAgICAgICAgIFZlYzMuc2V0KF90ZW1wX3YzLCBoYWxmV2lkdGgsIC1oYWxmSGVpZ2h0LCBmYXIpO1xuICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KG91dC52ZXJ0aWNlc1s3XSwgX3RlbXBfdjMsIHRyYW5zZm9ybSk7XG5cbiAgICAgICAgICAgIHBsYW5lLmZyb21Qb2ludHMob3V0LnBsYW5lc1swXSwgb3V0LnZlcnRpY2VzWzFdLCBvdXQudmVydGljZXNbNl0sIG91dC52ZXJ0aWNlc1s1XSk7XG4gICAgICAgICAgICBwbGFuZS5mcm9tUG9pbnRzKG91dC5wbGFuZXNbMV0sIG91dC52ZXJ0aWNlc1szXSwgb3V0LnZlcnRpY2VzWzRdLCBvdXQudmVydGljZXNbN10pO1xuICAgICAgICAgICAgcGxhbmUuZnJvbVBvaW50cyhvdXQucGxhbmVzWzJdLCBvdXQudmVydGljZXNbNl0sIG91dC52ZXJ0aWNlc1szXSwgb3V0LnZlcnRpY2VzWzddKTtcbiAgICAgICAgICAgIHBsYW5lLmZyb21Qb2ludHMob3V0LnBsYW5lc1szXSwgb3V0LnZlcnRpY2VzWzBdLCBvdXQudmVydGljZXNbNV0sIG91dC52ZXJ0aWNlc1s0XSk7XG4gICAgICAgICAgICBwbGFuZS5mcm9tUG9pbnRzKG91dC5wbGFuZXNbNF0sIG91dC52ZXJ0aWNlc1syXSwgb3V0LnZlcnRpY2VzWzBdLCBvdXQudmVydGljZXNbM10pO1xuICAgICAgICAgICAgcGxhbmUuZnJvbVBvaW50cyhvdXQucGxhbmVzWzBdLCBvdXQudmVydGljZXNbN10sIG91dC52ZXJ0aWNlc1s1XSwgb3V0LnZlcnRpY2VzWzZdKTtcbiAgICAgICAgfTtcbiAgICB9KSgpO1xuXG4gICAgLyoqXG4gICAgICogY3JlYXRlIGEgbmV3IGZydXN0dW1cbiAgICAgKiBAbWV0aG9kIGNyZWF0ZVxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcmV0dXJuIHtGcnVzdHVtfVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBmcnVzdHVtKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xvbmUgYSBmcnVzdHVtXG4gICAgICogQG1ldGhvZCBjbG9uZVxuICAgICAqIEBwYXJhbSB7RnJ1c3R1bX0gZlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcmV0dXJuIHtGcnVzdHVtfVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY2xvbmUgKGY6IGZydXN0dW0pOiBmcnVzdHVtIHtcbiAgICAgICAgcmV0dXJuIGZydXN0dW0uY29weShuZXcgZnJ1c3R1bSgpLCBmKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgZnJ1c3R1bSB0byBhbm90aGVyXG4gICAgICogQG1ldGhvZCBjb3B5XG4gICAgICogQHBhcmFtIHtGcnVzdHVtfSBvdXRcbiAgICAgKiBAcGFyYW0ge0ZydXN0dW19IGZcbiAgICAgKiBAcmV0dXJuIHtGcnVzdHVtfVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY29weSAob3V0OiBmcnVzdHVtLCBmOiBmcnVzdHVtKTogZnJ1c3R1bSB7XG4gICAgICAgIG91dC5fdHlwZSA9IGYuX3R5cGU7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjsgKytpKSB7XG4gICAgICAgICAgICBwbGFuZS5jb3B5KG91dC5wbGFuZXNbaV0sIGYucGxhbmVzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDg7ICsraSkge1xuICAgICAgICAgICAgVmVjMy5jb3B5KG91dC52ZXJ0aWNlc1tpXSwgZi52ZXJ0aWNlc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge1BsYW5lW119IHBsYW5lc1xuICAgICAqL1xuICAgIHB1YmxpYyBwbGFuZXM6IHBsYW5lW107XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtWZWMzW119IHBsYW5lc1xuICAgICAqL1xuICAgIHB1YmxpYyB2ZXJ0aWNlczogVmVjM1tdO1xuICAgIHByaXZhdGUgX3R5cGU6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy5fdHlwZSA9IGVudW1zLlNIQVBFX0ZSVVNUVU07XG4gICAgICAgIHRoaXMucGxhbmVzID0gbmV3IEFycmF5KDYpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDY7ICsraSkge1xuICAgICAgICAgICAgdGhpcy5wbGFuZXNbaV0gPSBwbGFuZS5jcmVhdGUoMCwgMCwgMCwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52ZXJ0aWNlcyA9IG5ldyBBcnJheSg4KTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA4OyArK2kpIHtcbiAgICAgICAgICAgIHRoaXMudmVydGljZXNbaV0gPSBuZXcgVmVjMygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBVcGRhdGUgdGhlIGZydXN0dW0gaW5mb3JtYXRpb24gYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiB0cmFuc2Zvcm0gbWF0cml4LlxuICAgICAqIE5vdGUgdGhhdCB0aGUgcmVzdWx0aW5nIHBsYW5lcyBhcmUgbm90IG5vcm1hbGl6ZWQgdW5kZXIgbm9ybWFsIG1vZGUuXG4gICAgICogQG1ldGhvZCB1cGRhdGVcbiAgICAgKiBAcGFyYW0ge01hdDR9IG0gdGhlIHZpZXctcHJvamVjdGlvbiBtYXRyaXhcbiAgICAgKiBAcGFyYW0ge01hdDR9IGludiB0aGUgaW52ZXJzZSB2aWV3LXByb2plY3Rpb24gbWF0cml4XG4gICAgICovXG4gICAgcHVibGljIHVwZGF0ZSAobTogTWF0NCwgaW52OiBNYXQ0KSB7XG4gICAgICAgIC8vIFJUUjQsIGNoLiAyMi4xNC4xLCBwLiA5ODNcbiAgICAgICAgLy8gZXh0cmFjdCBmcnVzdHVtIHBsYW5lcyBmcm9tIHZpZXctcHJvaiBtYXRyaXguXG5cbiAgICAgICAgbGV0IG1tID0gbS5tO1xuXG4gICAgICAgIC8vIGxlZnQgcGxhbmVcbiAgICAgICAgVmVjMy5zZXQodGhpcy5wbGFuZXNbMF0ubiwgbW1bM10gKyBtbVswXSwgbW1bN10gKyBtbVs0XSwgbW1bMTFdICsgbW1bOF0pO1xuICAgICAgICB0aGlzLnBsYW5lc1swXS5kID0gLShtbVsxNV0gKyBtbVsxMl0pO1xuICAgICAgICAvLyByaWdodCBwbGFuZVxuICAgICAgICBWZWMzLnNldCh0aGlzLnBsYW5lc1sxXS5uLCBtbVszXSAtIG1tWzBdLCBtbVs3XSAtIG1tWzRdLCBtbVsxMV0gLSBtbVs4XSk7XG4gICAgICAgIHRoaXMucGxhbmVzWzFdLmQgPSAtKG1tWzE1XSAtIG1tWzEyXSk7XG4gICAgICAgIC8vIGJvdHRvbSBwbGFuZVxuICAgICAgICBWZWMzLnNldCh0aGlzLnBsYW5lc1syXS5uLCBtbVszXSArIG1tWzFdLCBtbVs3XSArIG1tWzVdLCBtbVsxMV0gKyBtbVs5XSk7XG4gICAgICAgIHRoaXMucGxhbmVzWzJdLmQgPSAtKG1tWzE1XSArIG1tWzEzXSk7XG4gICAgICAgIC8vIHRvcCBwbGFuZVxuICAgICAgICBWZWMzLnNldCh0aGlzLnBsYW5lc1szXS5uLCBtbVszXSAtIG1tWzFdLCBtbVs3XSAtIG1tWzVdLCBtbVsxMV0gLSBtbVs5XSk7XG4gICAgICAgIHRoaXMucGxhbmVzWzNdLmQgPSAtKG1tWzE1XSAtIG1tWzEzXSk7XG4gICAgICAgIC8vIG5lYXIgcGxhbmVcbiAgICAgICAgVmVjMy5zZXQodGhpcy5wbGFuZXNbNF0ubiwgbW1bM10gKyBtbVsyXSwgbW1bN10gKyBtbVs2XSwgbW1bMTFdICsgbW1bMTBdKTtcbiAgICAgICAgdGhpcy5wbGFuZXNbNF0uZCA9IC0obW1bMTVdICsgbW1bMTRdKTtcbiAgICAgICAgLy8gZmFyIHBsYW5lXG4gICAgICAgIFZlYzMuc2V0KHRoaXMucGxhbmVzWzVdLm4sIG1tWzNdIC0gbW1bMl0sIG1tWzddIC0gbW1bNl0sIG1tWzExXSAtIG1tWzEwXSk7XG4gICAgICAgIHRoaXMucGxhbmVzWzVdLmQgPSAtKG1tWzE1XSAtIG1tWzE0XSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX3R5cGUgIT09IGVudW1zLlNIQVBFX0ZSVVNUVU1fQUNDVVJBVEUpIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgLy8gbm9ybWFsaXplIHBsYW5lc1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDY7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcGwgPSB0aGlzLnBsYW5lc1tpXTtcbiAgICAgICAgICAgIGNvbnN0IGludkRpc3QgPSAxIC8gcGwubi5sZW5ndGgoKTtcbiAgICAgICAgICAgIFZlYzMubXVsdGlwbHlTY2FsYXIocGwubiwgcGwubiwgaW52RGlzdCk7XG4gICAgICAgICAgICBwbC5kICo9IGludkRpc3Q7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1cGRhdGUgZnJ1c3R1bSB2ZXJ0aWNlc1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDg7IGkrKykge1xuICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KHRoaXMudmVydGljZXNbaV0sIF92W2ldLCBpbnYpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiB0cmFuc2Zvcm0gYnkgbWF0cml4XG4gICAgICogQG1ldGhvZCB0cmFuc2Zvcm1cbiAgICAgKiBAcGFyYW0ge01hdDR9IG1hdFxuICAgICAqL1xuICAgIHB1YmxpYyB0cmFuc2Zvcm0gKG1hdDogTWF0NCkge1xuICAgICAgICBpZiAodGhpcy5fdHlwZSAhPT0gZW51bXMuU0hBUEVfRlJVU1RVTV9BQ0NVUkFURSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgODsgaSsrKSB7XG4gICAgICAgICAgICBWZWMzLnRyYW5zZm9ybU1hdDQodGhpcy52ZXJ0aWNlc1tpXSwgdGhpcy52ZXJ0aWNlc1tpXSwgbWF0KTtcbiAgICAgICAgfVxuICAgICAgICBwbGFuZS5mcm9tUG9pbnRzKHRoaXMucGxhbmVzWzBdLCB0aGlzLnZlcnRpY2VzWzFdLCB0aGlzLnZlcnRpY2VzWzVdLCB0aGlzLnZlcnRpY2VzWzZdKTtcbiAgICAgICAgcGxhbmUuZnJvbVBvaW50cyh0aGlzLnBsYW5lc1sxXSwgdGhpcy52ZXJ0aWNlc1szXSwgdGhpcy52ZXJ0aWNlc1s3XSwgdGhpcy52ZXJ0aWNlc1s0XSk7XG4gICAgICAgIHBsYW5lLmZyb21Qb2ludHModGhpcy5wbGFuZXNbMl0sIHRoaXMudmVydGljZXNbNl0sIHRoaXMudmVydGljZXNbN10sIHRoaXMudmVydGljZXNbM10pO1xuICAgICAgICBwbGFuZS5mcm9tUG9pbnRzKHRoaXMucGxhbmVzWzNdLCB0aGlzLnZlcnRpY2VzWzBdLCB0aGlzLnZlcnRpY2VzWzRdLCB0aGlzLnZlcnRpY2VzWzVdKTtcbiAgICAgICAgcGxhbmUuZnJvbVBvaW50cyh0aGlzLnBsYW5lc1s0XSwgdGhpcy52ZXJ0aWNlc1syXSwgdGhpcy52ZXJ0aWNlc1szXSwgdGhpcy52ZXJ0aWNlc1swXSk7XG4gICAgICAgIHBsYW5lLmZyb21Qb2ludHModGhpcy5wbGFuZXNbMF0sIHRoaXMudmVydGljZXNbN10sIHRoaXMudmVydGljZXNbNl0sIHRoaXMudmVydGljZXNbNV0pO1xuICAgIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiLyJ9