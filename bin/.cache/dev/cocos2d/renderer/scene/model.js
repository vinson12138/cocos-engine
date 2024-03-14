
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/scene/model.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

/**
 * A representation of a model
 */
var Model = /*#__PURE__*/function () {
  /**
   * Setup a default empty model
   */
  function Model() {
    this._type = 'default';
    this._poolID = -1;
    this._node = null;
    this._inputAssembler = null;
    this._effect = null;
    this._viewID = -1;
    this._cameraID = -1;
    this._userKey = -1;
    this._castShadow = false;
    this._boundingShape = null;
  }
  /**
   * Set the hosting node of this model
   * @param {Node} node the hosting node
   */


  var _proto = Model.prototype;

  _proto.setNode = function setNode(node) {
    this._node = node;
  }
  /**
   * Set the input assembler
   * @param {InputAssembler} ia
   */
  ;

  _proto.setInputAssembler = function setInputAssembler(ia) {
    this._inputAssembler = ia;
  }
  /**
   * Set the model effect
   * @param {?Effect} effect the effect to use
   */
  ;

  _proto.setEffect = function setEffect(effect) {
    this._effect = effect;
  }
  /**
   * Set the user key
   * @param {number} key
   */
  ;

  _proto.setUserKey = function setUserKey(key) {
    this._userKey = key;
  }
  /**
   * Extract a drawing item
   * @param {Object} out the receiving item
   */
  ;

  _proto.extractDrawItem = function extractDrawItem(out) {
    out.model = this;
    out.node = this._node;
    out.ia = this._inputAssembler;
    out.effect = this._effect;
  };

  return Model;
}();

exports["default"] = Model;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9yZW5kZXJlci9zY2VuZS9tb2RlbC5qcyJdLCJuYW1lcyI6WyJNb2RlbCIsIl90eXBlIiwiX3Bvb2xJRCIsIl9ub2RlIiwiX2lucHV0QXNzZW1ibGVyIiwiX2VmZmVjdCIsIl92aWV3SUQiLCJfY2FtZXJhSUQiLCJfdXNlcktleSIsIl9jYXN0U2hhZG93IiwiX2JvdW5kaW5nU2hhcGUiLCJzZXROb2RlIiwibm9kZSIsInNldElucHV0QXNzZW1ibGVyIiwiaWEiLCJzZXRFZmZlY3QiLCJlZmZlY3QiLCJzZXRVc2VyS2V5Iiwia2V5IiwiZXh0cmFjdERyYXdJdGVtIiwib3V0IiwibW9kZWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7SUFDcUJBO0FBQ25CO0FBQ0Y7QUFDQTtBQUNFLG1CQUFjO0FBQ1osU0FBS0MsS0FBTCxHQUFhLFNBQWI7QUFDQSxTQUFLQyxPQUFMLEdBQWUsQ0FBQyxDQUFoQjtBQUNBLFNBQUtDLEtBQUwsR0FBYSxJQUFiO0FBQ0EsU0FBS0MsZUFBTCxHQUF1QixJQUF2QjtBQUNBLFNBQUtDLE9BQUwsR0FBZSxJQUFmO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLENBQUMsQ0FBaEI7QUFDQSxTQUFLQyxTQUFMLEdBQWlCLENBQUMsQ0FBbEI7QUFDQSxTQUFLQyxRQUFMLEdBQWdCLENBQUMsQ0FBakI7QUFDQSxTQUFLQyxXQUFMLEdBQW1CLEtBQW5CO0FBQ0EsU0FBS0MsY0FBTCxHQUFzQixJQUF0QjtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7Ozs7O1NBQ0VDLFVBQUEsaUJBQVFDLElBQVIsRUFBYztBQUNaLFNBQUtULEtBQUwsR0FBYVMsSUFBYjtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7OztTQUNFQyxvQkFBQSwyQkFBa0JDLEVBQWxCLEVBQXNCO0FBQ3BCLFNBQUtWLGVBQUwsR0FBdUJVLEVBQXZCO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTs7O1NBQ0VDLFlBQUEsbUJBQVVDLE1BQVYsRUFBa0I7QUFDaEIsU0FBS1gsT0FBTCxHQUFlVyxNQUFmO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTs7O1NBQ0VDLGFBQUEsb0JBQVdDLEdBQVgsRUFBZ0I7QUFDZCxTQUFLVixRQUFMLEdBQWdCVSxHQUFoQjtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7OztTQUNFQyxrQkFBQSx5QkFBZ0JDLEdBQWhCLEVBQXFCO0FBQ25CQSxJQUFBQSxHQUFHLENBQUNDLEtBQUosR0FBWSxJQUFaO0FBQ0FELElBQUFBLEdBQUcsQ0FBQ1IsSUFBSixHQUFXLEtBQUtULEtBQWhCO0FBQ0FpQixJQUFBQSxHQUFHLENBQUNOLEVBQUosR0FBUyxLQUFLVixlQUFkO0FBQ0FnQixJQUFBQSxHQUFHLENBQUNKLE1BQUosR0FBYSxLQUFLWCxPQUFsQjtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbi8qKlxuICogQSByZXByZXNlbnRhdGlvbiBvZiBhIG1vZGVsXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vZGVsIHtcbiAgLyoqXG4gICAqIFNldHVwIGEgZGVmYXVsdCBlbXB0eSBtb2RlbFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fdHlwZSA9ICdkZWZhdWx0JztcbiAgICB0aGlzLl9wb29sSUQgPSAtMTtcbiAgICB0aGlzLl9ub2RlID0gbnVsbDtcbiAgICB0aGlzLl9pbnB1dEFzc2VtYmxlciA9IG51bGw7XG4gICAgdGhpcy5fZWZmZWN0ID0gbnVsbDtcbiAgICB0aGlzLl92aWV3SUQgPSAtMTtcbiAgICB0aGlzLl9jYW1lcmFJRCA9IC0xO1xuICAgIHRoaXMuX3VzZXJLZXkgPSAtMTtcbiAgICB0aGlzLl9jYXN0U2hhZG93ID0gZmFsc2U7XG4gICAgdGhpcy5fYm91bmRpbmdTaGFwZSA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBob3N0aW5nIG5vZGUgb2YgdGhpcyBtb2RlbFxuICAgKiBAcGFyYW0ge05vZGV9IG5vZGUgdGhlIGhvc3Rpbmcgbm9kZVxuICAgKi9cbiAgc2V0Tm9kZShub2RlKSB7XG4gICAgdGhpcy5fbm9kZSA9IG5vZGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBpbnB1dCBhc3NlbWJsZXJcbiAgICogQHBhcmFtIHtJbnB1dEFzc2VtYmxlcn0gaWFcbiAgICovXG4gIHNldElucHV0QXNzZW1ibGVyKGlhKSB7XG4gICAgdGhpcy5faW5wdXRBc3NlbWJsZXIgPSBpYTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIG1vZGVsIGVmZmVjdFxuICAgKiBAcGFyYW0gez9FZmZlY3R9IGVmZmVjdCB0aGUgZWZmZWN0IHRvIHVzZVxuICAgKi9cbiAgc2V0RWZmZWN0KGVmZmVjdCkge1xuICAgIHRoaXMuX2VmZmVjdCA9IGVmZmVjdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHVzZXIga2V5XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBrZXlcbiAgICovXG4gIHNldFVzZXJLZXkoa2V5KSB7XG4gICAgdGhpcy5fdXNlcktleSA9IGtleTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0IGEgZHJhd2luZyBpdGVtXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvdXQgdGhlIHJlY2VpdmluZyBpdGVtXG4gICAqL1xuICBleHRyYWN0RHJhd0l0ZW0ob3V0KSB7XG4gICAgb3V0Lm1vZGVsID0gdGhpcztcbiAgICBvdXQubm9kZSA9IHRoaXMuX25vZGU7XG4gICAgb3V0LmlhID0gdGhpcy5faW5wdXRBc3NlbWJsZXI7XG4gICAgb3V0LmVmZmVjdCA9IHRoaXMuX2VmZmVjdDtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvIn0=