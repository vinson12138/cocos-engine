
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCPrefab.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
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

/**
 * !#zh
 * Prefab 创建实例所用的优化策略，配合 {{#crossLink "Prefab.optimizationPolicy"}}cc.Prefab#optimizationPolicy{{/crossLink}} 使用。
 * !#en
 * An enumeration used with the {{#crossLink "Prefab.optimizationPolicy"}}cc.Prefab#optimizationPolicy{{/crossLink}}
 * to specify how to optimize the instantiate operation.
 *
 * @enum Prefab.OptimizationPolicy
 * @since 1.10.0
 */
var OptimizationPolicy = cc.Enum({
  /**
   * !#zh
   * 根据创建次数自动调整优化策略。初次创建实例时，行为等同 SINGLE_INSTANCE，多次创建后将自动采用 MULTI_INSTANCE。
   * !#en
   * The optimization policy is automatically chosen based on the number of instantiations.
   * When you first create an instance, the behavior is the same as SINGLE_INSTANCE. MULTI_INSTANCE will be automatically used after multiple creation.
   * @property {Number} AUTO
   */
  AUTO: 0,

  /**
   * !#zh
   * 优化单次创建性能。<br>
   * 该选项会跳过针对这个 prefab 的代码生成优化操作。当该 prefab 加载后，一般只会创建一个实例时，请选择此项。
   * !#en
   * Optimize for single instance creation.<br>
   * This option skips code generation for this prefab.
   * When this prefab will usually create only one instances, please select this option.
   * @property {Number} SINGLE_INSTANCE
   */
  SINGLE_INSTANCE: 1,

  /**
   * !#zh
   * 优化多次创建性能。<br>
   * 该选项会启用针对这个 prefab 的代码生成优化操作。当该 prefab 加载后，一般会创建多个实例时，请选择此项。如果该 prefab 在场景中的节点启用了自动关联，并且在场景中有多份实例，也建议选择此项。
   * !#en
   * Optimize for creating instances multiple times.<br>
   * This option enables code generation for this prefab.
   * When this prefab will usually create multiple instances, please select this option.
   * It is also recommended to select this option if the prefab instance in the scene has Auto Sync enabled and there are multiple instances in the scene.
   * @property {Number} MULTI_INSTANCE
   */
  MULTI_INSTANCE: 2
});
/**
 * !#en Class for prefab handling.
 * !#zh 预制资源类。
 * @class Prefab
 * @extends Asset
 */

var Prefab = cc.Class({
  name: 'cc.Prefab',
  "extends": cc.Asset,
  ctor: function ctor() {
    /**
     * Cache function to optimize instance creaton.
     * @property {Function} _createFunction
     * @private
     */
    this._createFunction = null;
    this._instantiatedTimes = 0;
  },
  properties: {
    /**
     * @property {Node} data - the main cc.Node in the prefab
     */
    data: null,

    /**
     * !#zh
     * 设置实例化这个 prefab 时所用的优化策略。根据使用情况设置为合适的值，能优化该 prefab 实例化所用的时间。
     * !#en
     * Indicates the optimization policy for instantiating this prefab.
     * Set to a suitable value based on usage, can optimize the time it takes to instantiate this prefab.
     *
     * @property {Prefab.OptimizationPolicy} optimizationPolicy
     * @default Prefab.OptimizationPolicy.AUTO
     * @since 1.10.0
     * @example
     * prefab.optimizationPolicy = cc.Prefab.OptimizationPolicy.MULTI_INSTANCE;
     */
    optimizationPolicy: OptimizationPolicy.AUTO,

    /**
     * !#en Indicates the raw assets of this prefab can be load after prefab loaded.
     * !#zh 指示该 Prefab 依赖的资源可否在 Prefab 加载后再延迟加载。
     * @property {Boolean} asyncLoadAssets
     * @default false
     */
    asyncLoadAssets: false,

    /**
     * @property {Boolean} readonly
     * @default false
     */
    readonly: {
      "default": false,
      editorOnly: true
    }
  },
  statics: {
    OptimizationPolicy: OptimizationPolicy,
    OptimizationPolicyThreshold: 3
  },
  createNode: CC_EDITOR && function (cb) {
    var node = cc.instantiate(this);
    node.name = this.name;
    cb(null, node);
  },

  /**
   * Dynamically translation prefab data into minimized code.<br/>
   * This method will be called automatically before the first time the prefab being instantiated,
   * but you can re-call to refresh the create function once you modified the original prefab data in script.
   * @method compileCreateFunction
   */
  compileCreateFunction: function compileCreateFunction() {
    var jit = require('../platform/instantiate-jit');

    this._createFunction = jit.compile(this.data);
  },
  // just instantiate, will not initialize the Node, this will be called during Node's initialization.
  // @param {Node} [rootToRedirect] - specify an instantiated prefabRoot that all references to prefabRoot in prefab
  //                                  will redirect to
  _doInstantiate: function _doInstantiate(rootToRedirect) {
    if (!this.data._prefab) {
      // temp guard code
      cc.warnID(3700);
    }

    if (!this._createFunction) {
      this.compileCreateFunction();
    }

    return this._createFunction(rootToRedirect); // this.data._instantiate();
  },
  _instantiate: function _instantiate() {
    var node,
        useJit = false;

    if (CC_SUPPORT_JIT) {
      if (this.optimizationPolicy === OptimizationPolicy.SINGLE_INSTANCE) {
        useJit = false;
      } else if (this.optimizationPolicy === OptimizationPolicy.MULTI_INSTANCE) {
        useJit = true;
      } else {
        // auto
        useJit = this._instantiatedTimes + 1 >= Prefab.OptimizationPolicyThreshold;
      }
    }

    if (useJit) {
      // instantiate node
      node = this._doInstantiate(); // initialize node

      this.data._instantiate(node);
    } else {
      // instantiate node
      node = this.data._instantiate();
    }

    ++this._instantiatedTimes; // link prefab in editor

    if (CC_EDITOR || CC_TEST) {
      var PrefabUtils = Editor.require('scene://utils/prefab'); // This operation is not necessary, but some old prefab asset may not contain complete data.


      PrefabUtils.linkPrefab(this, node);
    }

    return node;
  },
  destroy: function destroy() {
    this.data && this.data.destroy();

    this._super();
  }
});
cc.Prefab = module.exports = Prefab;
cc.js.obsolete(cc, 'cc._Prefab', 'Prefab');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0cy9DQ1ByZWZhYi5qcyJdLCJuYW1lcyI6WyJPcHRpbWl6YXRpb25Qb2xpY3kiLCJjYyIsIkVudW0iLCJBVVRPIiwiU0lOR0xFX0lOU1RBTkNFIiwiTVVMVElfSU5TVEFOQ0UiLCJQcmVmYWIiLCJDbGFzcyIsIm5hbWUiLCJBc3NldCIsImN0b3IiLCJfY3JlYXRlRnVuY3Rpb24iLCJfaW5zdGFudGlhdGVkVGltZXMiLCJwcm9wZXJ0aWVzIiwiZGF0YSIsIm9wdGltaXphdGlvblBvbGljeSIsImFzeW5jTG9hZEFzc2V0cyIsInJlYWRvbmx5IiwiZWRpdG9yT25seSIsInN0YXRpY3MiLCJPcHRpbWl6YXRpb25Qb2xpY3lUaHJlc2hvbGQiLCJjcmVhdGVOb2RlIiwiQ0NfRURJVE9SIiwiY2IiLCJub2RlIiwiaW5zdGFudGlhdGUiLCJjb21waWxlQ3JlYXRlRnVuY3Rpb24iLCJqaXQiLCJyZXF1aXJlIiwiY29tcGlsZSIsIl9kb0luc3RhbnRpYXRlIiwicm9vdFRvUmVkaXJlY3QiLCJfcHJlZmFiIiwid2FybklEIiwiX2luc3RhbnRpYXRlIiwidXNlSml0IiwiQ0NfU1VQUE9SVF9KSVQiLCJDQ19URVNUIiwiUHJlZmFiVXRpbHMiLCJFZGl0b3IiLCJsaW5rUHJlZmFiIiwiZGVzdHJveSIsIl9zdXBlciIsIm1vZHVsZSIsImV4cG9ydHMiLCJqcyIsIm9ic29sZXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJQSxrQkFBa0IsR0FBR0MsRUFBRSxDQUFDQyxJQUFILENBQVE7QUFD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KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKipcbiAqICEjemhcbiAqIFByZWZhYiDliJvlu7rlrp7kvovmiYDnlKjnmoTkvJjljJbnrZbnlaXvvIzphY3lkIgge3sjY3Jvc3NMaW5rIFwiUHJlZmFiLm9wdGltaXphdGlvblBvbGljeVwifX1jYy5QcmVmYWIjb3B0aW1pemF0aW9uUG9saWN5e3svY3Jvc3NMaW5rfX0g5L2/55So44CCXG4gKiAhI2VuXG4gKiBBbiBlbnVtZXJhdGlvbiB1c2VkIHdpdGggdGhlIHt7I2Nyb3NzTGluayBcIlByZWZhYi5vcHRpbWl6YXRpb25Qb2xpY3lcIn19Y2MuUHJlZmFiI29wdGltaXphdGlvblBvbGljeXt7L2Nyb3NzTGlua319XG4gKiB0byBzcGVjaWZ5IGhvdyB0byBvcHRpbWl6ZSB0aGUgaW5zdGFudGlhdGUgb3BlcmF0aW9uLlxuICpcbiAqIEBlbnVtIFByZWZhYi5PcHRpbWl6YXRpb25Qb2xpY3lcbiAqIEBzaW5jZSAxLjEwLjBcbiAqL1xudmFyIE9wdGltaXphdGlvblBvbGljeSA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqICEjemhcbiAgICAgKiDmoLnmja7liJvlu7rmrKHmlbDoh6rliqjosIPmlbTkvJjljJbnrZbnlaXjgILliJ3mrKHliJvlu7rlrp7kvovml7bvvIzooYzkuLrnrYnlkIwgU0lOR0xFX0lOU1RBTkNF77yM5aSa5qyh5Yib5bu65ZCO5bCG6Ieq5Yqo6YeH55SoIE1VTFRJX0lOU1RBTkNF44CCXG4gICAgICogISNlblxuICAgICAqIFRoZSBvcHRpbWl6YXRpb24gcG9saWN5IGlzIGF1dG9tYXRpY2FsbHkgY2hvc2VuIGJhc2VkIG9uIHRoZSBudW1iZXIgb2YgaW5zdGFudGlhdGlvbnMuXG4gICAgICogV2hlbiB5b3UgZmlyc3QgY3JlYXRlIGFuIGluc3RhbmNlLCB0aGUgYmVoYXZpb3IgaXMgdGhlIHNhbWUgYXMgU0lOR0xFX0lOU1RBTkNFLiBNVUxUSV9JTlNUQU5DRSB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgdXNlZCBhZnRlciBtdWx0aXBsZSBjcmVhdGlvbi5cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gQVVUT1xuICAgICAqL1xuICAgIEFVVE86IDAsXG4gICAgLyoqXG4gICAgICogISN6aFxuICAgICAqIOS8mOWMluWNleasoeWIm+W7uuaAp+iDveOAgjxicj5cbiAgICAgKiDor6XpgInpobnkvJrot7Pov4fpkojlr7nov5nkuKogcHJlZmFiIOeahOS7o+eggeeUn+aIkOS8mOWMluaTjeS9nOOAguW9k+ivpSBwcmVmYWIg5Yqg6L295ZCO77yM5LiA6Iis5Y+q5Lya5Yib5bu65LiA5Liq5a6e5L6L5pe277yM6K+36YCJ5oup5q2k6aG544CCXG4gICAgICogISNlblxuICAgICAqIE9wdGltaXplIGZvciBzaW5nbGUgaW5zdGFuY2UgY3JlYXRpb24uPGJyPlxuICAgICAqIFRoaXMgb3B0aW9uIHNraXBzIGNvZGUgZ2VuZXJhdGlvbiBmb3IgdGhpcyBwcmVmYWIuXG4gICAgICogV2hlbiB0aGlzIHByZWZhYiB3aWxsIHVzdWFsbHkgY3JlYXRlIG9ubHkgb25lIGluc3RhbmNlcywgcGxlYXNlIHNlbGVjdCB0aGlzIG9wdGlvbi5cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU0lOR0xFX0lOU1RBTkNFXG4gICAgICovXG4gICAgU0lOR0xFX0lOU1RBTkNFOiAxLFxuICAgIC8qKlxuICAgICAqICEjemhcbiAgICAgKiDkvJjljJblpJrmrKHliJvlu7rmgKfog73jgII8YnI+XG4gICAgICog6K+l6YCJ6aG55Lya5ZCv55So6ZKI5a+56L+Z5LiqIHByZWZhYiDnmoTku6PnoIHnlJ/miJDkvJjljJbmk43kvZzjgILlvZPor6UgcHJlZmFiIOWKoOi9veWQju+8jOS4gOiIrOS8muWIm+W7uuWkmuS4quWunuS+i+aXtu+8jOivt+mAieaLqeatpOmhueOAguWmguaenOivpSBwcmVmYWIg5Zyo5Zy65pmv5Lit55qE6IqC54K55ZCv55So5LqG6Ieq5Yqo5YWz6IGU77yM5bm25LiU5Zyo5Zy65pmv5Lit5pyJ5aSa5Lu95a6e5L6L77yM5Lmf5bu66K6u6YCJ5oup5q2k6aG544CCXG4gICAgICogISNlblxuICAgICAqIE9wdGltaXplIGZvciBjcmVhdGluZyBpbnN0YW5jZXMgbXVsdGlwbGUgdGltZXMuPGJyPlxuICAgICAqIFRoaXMgb3B0aW9uIGVuYWJsZXMgY29kZSBnZW5lcmF0aW9uIGZvciB0aGlzIHByZWZhYi5cbiAgICAgKiBXaGVuIHRoaXMgcHJlZmFiIHdpbGwgdXN1YWxseSBjcmVhdGUgbXVsdGlwbGUgaW5zdGFuY2VzLCBwbGVhc2Ugc2VsZWN0IHRoaXMgb3B0aW9uLlxuICAgICAqIEl0IGlzIGFsc28gcmVjb21tZW5kZWQgdG8gc2VsZWN0IHRoaXMgb3B0aW9uIGlmIHRoZSBwcmVmYWIgaW5zdGFuY2UgaW4gdGhlIHNjZW5lIGhhcyBBdXRvIFN5bmMgZW5hYmxlZCBhbmQgdGhlcmUgYXJlIG11bHRpcGxlIGluc3RhbmNlcyBpbiB0aGUgc2NlbmUuXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IE1VTFRJX0lOU1RBTkNFXG4gICAgICovXG4gICAgTVVMVElfSU5TVEFOQ0U6IDIsXG59KTtcblxuLyoqXG4gKiAhI2VuIENsYXNzIGZvciBwcmVmYWIgaGFuZGxpbmcuXG4gKiAhI3poIOmihOWItui1hOa6kOexu+OAglxuICogQGNsYXNzIFByZWZhYlxuICogQGV4dGVuZHMgQXNzZXRcbiAqL1xudmFyIFByZWZhYiA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuUHJlZmFiJyxcbiAgICBleHRlbmRzOiBjYy5Bc3NldCxcbiAgICBjdG9yICgpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhY2hlIGZ1bmN0aW9uIHRvIG9wdGltaXplIGluc3RhbmNlIGNyZWF0b24uXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IF9jcmVhdGVGdW5jdGlvblxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fY3JlYXRlRnVuY3Rpb24gPSBudWxsO1xuXG4gICAgICAgIHRoaXMuX2luc3RhbnRpYXRlZFRpbWVzID0gMDtcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvKipcbiAgICAgICAgICogQHByb3BlcnR5IHtOb2RlfSBkYXRhIC0gdGhlIG1haW4gY2MuTm9kZSBpbiB0aGUgcHJlZmFiXG4gICAgICAgICAqL1xuICAgICAgICBkYXRhOiBudWxsLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOiuvue9ruWunuS+i+WMlui/meS4qiBwcmVmYWIg5pe25omA55So55qE5LyY5YyW562W55Wl44CC5qC55o2u5L2/55So5oOF5Ya16K6+572u5Li65ZCI6YCC55qE5YC877yM6IO95LyY5YyW6K+lIHByZWZhYiDlrp7kvovljJbmiYDnlKjnmoTml7bpl7TjgIJcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBJbmRpY2F0ZXMgdGhlIG9wdGltaXphdGlvbiBwb2xpY3kgZm9yIGluc3RhbnRpYXRpbmcgdGhpcyBwcmVmYWIuXG4gICAgICAgICAqIFNldCB0byBhIHN1aXRhYmxlIHZhbHVlIGJhc2VkIG9uIHVzYWdlLCBjYW4gb3B0aW1pemUgdGhlIHRpbWUgaXQgdGFrZXMgdG8gaW5zdGFudGlhdGUgdGhpcyBwcmVmYWIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7UHJlZmFiLk9wdGltaXphdGlvblBvbGljeX0gb3B0aW1pemF0aW9uUG9saWN5XG4gICAgICAgICAqIEBkZWZhdWx0IFByZWZhYi5PcHRpbWl6YXRpb25Qb2xpY3kuQVVUT1xuICAgICAgICAgKiBAc2luY2UgMS4xMC4wXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIHByZWZhYi5vcHRpbWl6YXRpb25Qb2xpY3kgPSBjYy5QcmVmYWIuT3B0aW1pemF0aW9uUG9saWN5Lk1VTFRJX0lOU1RBTkNFO1xuICAgICAgICAgKi9cbiAgICAgICAgb3B0aW1pemF0aW9uUG9saWN5OiBPcHRpbWl6YXRpb25Qb2xpY3kuQVVUTyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBJbmRpY2F0ZXMgdGhlIHJhdyBhc3NldHMgb2YgdGhpcyBwcmVmYWIgY2FuIGJlIGxvYWQgYWZ0ZXIgcHJlZmFiIGxvYWRlZC5cbiAgICAgICAgICogISN6aCDmjIfnpLror6UgUHJlZmFiIOS+nei1lueahOi1hOa6kOWPr+WQpuWcqCBQcmVmYWIg5Yqg6L295ZCO5YaN5bu26L+f5Yqg6L2944CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gYXN5bmNMb2FkQXNzZXRzXG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICBhc3luY0xvYWRBc3NldHM6IGZhbHNlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IHJlYWRvbmx5XG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seToge1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgICBlZGl0b3JPbmx5OiB0cnVlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICBPcHRpbWl6YXRpb25Qb2xpY3ksXG4gICAgICAgIE9wdGltaXphdGlvblBvbGljeVRocmVzaG9sZDogMyxcbiAgICB9LFxuXG4gICAgY3JlYXRlTm9kZTogQ0NfRURJVE9SICYmIGZ1bmN0aW9uIChjYikge1xuICAgICAgICB2YXIgbm9kZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMpO1xuICAgICAgICBub2RlLm5hbWUgPSB0aGlzLm5hbWU7XG4gICAgICAgIGNiKG51bGwsIG5vZGUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEeW5hbWljYWxseSB0cmFuc2xhdGlvbiBwcmVmYWIgZGF0YSBpbnRvIG1pbmltaXplZCBjb2RlLjxici8+XG4gICAgICogVGhpcyBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgYXV0b21hdGljYWxseSBiZWZvcmUgdGhlIGZpcnN0IHRpbWUgdGhlIHByZWZhYiBiZWluZyBpbnN0YW50aWF0ZWQsXG4gICAgICogYnV0IHlvdSBjYW4gcmUtY2FsbCB0byByZWZyZXNoIHRoZSBjcmVhdGUgZnVuY3Rpb24gb25jZSB5b3UgbW9kaWZpZWQgdGhlIG9yaWdpbmFsIHByZWZhYiBkYXRhIGluIHNjcmlwdC5cbiAgICAgKiBAbWV0aG9kIGNvbXBpbGVDcmVhdGVGdW5jdGlvblxuICAgICAqL1xuICAgIGNvbXBpbGVDcmVhdGVGdW5jdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaml0ID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vaW5zdGFudGlhdGUtaml0Jyk7XG4gICAgICAgIHRoaXMuX2NyZWF0ZUZ1bmN0aW9uID0gaml0LmNvbXBpbGUodGhpcy5kYXRhKTtcbiAgICB9LFxuXG4gICAgLy8ganVzdCBpbnN0YW50aWF0ZSwgd2lsbCBub3QgaW5pdGlhbGl6ZSB0aGUgTm9kZSwgdGhpcyB3aWxsIGJlIGNhbGxlZCBkdXJpbmcgTm9kZSdzIGluaXRpYWxpemF0aW9uLlxuICAgIC8vIEBwYXJhbSB7Tm9kZX0gW3Jvb3RUb1JlZGlyZWN0XSAtIHNwZWNpZnkgYW4gaW5zdGFudGlhdGVkIHByZWZhYlJvb3QgdGhhdCBhbGwgcmVmZXJlbmNlcyB0byBwcmVmYWJSb290IGluIHByZWZhYlxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbGwgcmVkaXJlY3QgdG9cbiAgICBfZG9JbnN0YW50aWF0ZTogZnVuY3Rpb24gKHJvb3RUb1JlZGlyZWN0KSB7XG4gICAgICAgIGlmICghdGhpcy5kYXRhLl9wcmVmYWIpIHtcbiAgICAgICAgICAgIC8vIHRlbXAgZ3VhcmQgY29kZVxuICAgICAgICAgICAgY2Mud2FybklEKDM3MDApO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fY3JlYXRlRnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMuY29tcGlsZUNyZWF0ZUZ1bmN0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUZ1bmN0aW9uKHJvb3RUb1JlZGlyZWN0KTsgIC8vIHRoaXMuZGF0YS5faW5zdGFudGlhdGUoKTtcbiAgICB9LFxuXG4gICAgX2luc3RhbnRpYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBub2RlLCB1c2VKaXQgPSBmYWxzZTtcbiAgICAgICAgaWYgKENDX1NVUFBPUlRfSklUKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpbWl6YXRpb25Qb2xpY3kgPT09IE9wdGltaXphdGlvblBvbGljeS5TSU5HTEVfSU5TVEFOQ0UpIHtcbiAgICAgICAgICAgICAgICB1c2VKaXQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMub3B0aW1pemF0aW9uUG9saWN5ID09PSBPcHRpbWl6YXRpb25Qb2xpY3kuTVVMVElfSU5TVEFOQ0UpIHtcbiAgICAgICAgICAgICAgICB1c2VKaXQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gYXV0b1xuICAgICAgICAgICAgICAgIHVzZUppdCA9ICh0aGlzLl9pbnN0YW50aWF0ZWRUaW1lcyArIDEpID49IFByZWZhYi5PcHRpbWl6YXRpb25Qb2xpY3lUaHJlc2hvbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVzZUppdCkge1xuICAgICAgICAgICAgLy8gaW5zdGFudGlhdGUgbm9kZVxuICAgICAgICAgICAgbm9kZSA9IHRoaXMuX2RvSW5zdGFudGlhdGUoKTtcbiAgICAgICAgICAgIC8vIGluaXRpYWxpemUgbm9kZVxuICAgICAgICAgICAgdGhpcy5kYXRhLl9pbnN0YW50aWF0ZShub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGluc3RhbnRpYXRlIG5vZGVcbiAgICAgICAgICAgIG5vZGUgPSB0aGlzLmRhdGEuX2luc3RhbnRpYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgKyt0aGlzLl9pbnN0YW50aWF0ZWRUaW1lcztcblxuICAgICAgICAvLyBsaW5rIHByZWZhYiBpbiBlZGl0b3JcbiAgICAgICAgaWYgKENDX0VESVRPUiB8fCBDQ19URVNUKSB7XG4gICAgICAgICAgICB2YXIgUHJlZmFiVXRpbHMgPSBFZGl0b3IucmVxdWlyZSgnc2NlbmU6Ly91dGlscy9wcmVmYWInKTtcbiAgICAgICAgICAgIC8vIFRoaXMgb3BlcmF0aW9uIGlzIG5vdCBuZWNlc3NhcnksIGJ1dCBzb21lIG9sZCBwcmVmYWIgYXNzZXQgbWF5IG5vdCBjb250YWluIGNvbXBsZXRlIGRhdGEuXG4gICAgICAgICAgICBQcmVmYWJVdGlscy5saW5rUHJlZmFiKHRoaXMsIG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH0sXG5cbiAgICBkZXN0cm95ICgpIHtcbiAgICAgICAgdGhpcy5kYXRhICYmIHRoaXMuZGF0YS5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgfSxcbn0pO1xuXG5jYy5QcmVmYWIgPSBtb2R1bGUuZXhwb3J0cyA9IFByZWZhYjtcbmNjLmpzLm9ic29sZXRlKGNjLCAnY2MuX1ByZWZhYicsICdQcmVmYWInKTtcbiJdLCJzb3VyY2VSb290IjoiLyJ9