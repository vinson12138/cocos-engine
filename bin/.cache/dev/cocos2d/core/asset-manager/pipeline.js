
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/asset-manager/pipeline.js';
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

/**
 * @module cc.AssetManager
 */
var Task = require('./task');

var _pipelineId = 0;
/**
 * !#en
 * Pipeline can execute the task for some effect.
 * 
 * !#zh
 * 管线能执行任务达到某个效果
 * 
 * @class Pipeline
 */

function Pipeline(name, funcs) {
  if (!Array.isArray(funcs)) {
    cc.warn('funcs must be an array');
    return;
  }
  /**
   * !#en
   * The id of pipeline
   * 
   * !#zh
   * 管线的 id
   * 
   * @property id
   * @type {Number}
   */


  this.id = _pipelineId++;
  /**
   * !#en
   * The name of pipeline
   * 
   * !#zh
   * 管线的名字
   * 
   * @property name
   * @type {String}
   */

  this.name = name;
  /**
   * !#en
   * All pipes of pipeline
   * 
   * !#zh
   * 所有的管道
   * 
   * @property pipes
   * @type {Function[]}
   */

  this.pipes = [];

  for (var i = 0, l = funcs.length; i < l; i++) {
    if (typeof funcs[i] === 'function') {
      this.pipes.push(funcs[i]);
    }
  }
}

Pipeline.prototype = {
  /**
   * !#en
   * Create a new pipeline
   * 
   * !#zh
   * 创建一个管线
   * 
   * @method constructor
   * @param {string} name - The name of pipeline
   * @param {Function[]} funcs - The array of pipe, every pipe must be function which take two parameters, the first is a `Task` flowed in pipeline, the second is complete callback
   * 
   * @example
   * var pipeline = new Pipeline('download', [
   * (task, done) => {
   *      var url = task.input;
   *      cc.assetManager.downloader.downloadFile(url, null, null, (err, result) => {
   *          task.output = result;
   *          done(err);
   *      });
   * },
   * (task, done) => {
   *      var text = task.input;
   *      var json = JSON.stringify(text);
   *      task.output = json;
   *      done();
   * }
   * ]);
   * 
   * @typescript
   * constructor(name: string, funcs: Array<(task: Task, done?: (err: Error) => void) => void>)
   */
  constructor: Pipeline,

  /**
   * !#en
   * At specific point insert a new pipe to pipeline
   * 
   * !#zh
   * 在某个特定的点为管线插入一个新的 pipe
   * 
   * @method insert
   * @param {Function} func - The new pipe
   * @param {Task} func.task - The task handled with pipeline will be transferred to this function
   * @param {Function} [func.callback] - Callback you need to invoke manually when this pipe is finished. if the pipeline is synchronous, callback is unnecessary.
   * @param {number} index - The specific point you want to insert at.
   * @return {Pipeline} pipeline
   * 
   * @example
   * var pipeline = new Pipeline('test', []);
   * pipeline.insert((task, done) => {
   *      // do something
   *      done();
   * }, 0);
   * 
   * @typescript
   * insert(func: (task: Task, callback?: (err: Error) => void) => void, index: number): Pipeline
   */
  insert: function insert(func, index) {
    if (typeof func !== 'function' || index > this.pipes.length) {
      cc.warnID(4921);
      return;
    }

    this.pipes.splice(index, 0, func);
    return this;
  },

  /**
   * !#en
   * Append a new pipe to the pipeline
   * 
   * !#zh
   * 添加一个管道到管线中
   * 
   * @method append
   * @param {Function} func - The new pipe
   * @param {Task} func.task - The task handled with pipeline will be transferred to this function
   * @param {Function} [func.callback] - Callback you need to invoke manually when this pipe is finished. if the pipeline is synchronous, callback is unnecessary.
   * @return {Pipeline} pipeline
   * 
   * @example
   * var pipeline = new Pipeline('test', []);
   * pipeline.append((task, done) => {
   *      // do something
   *      done();
   * });
   * 
   * @typescript
   * append(func: (task: Task, callback?: (err: Error) => void) => void): Pipeline
   */
  append: function append(func) {
    if (typeof func !== 'function') {
      return;
    }

    this.pipes.push(func);
    return this;
  },

  /**
   * !#en
   * Remove pipe which at specific point
   * 
   * !#zh
   * 移除特定位置的管道
   * 
   * @method remove
   * @param {number} index - The specific point
   * @return {Pipeline} pipeline
   * 
   * @example
   * var pipeline = new Pipeline('test', (task, done) => {
   *      // do something
   *      done();  
   * });
   * pipeline.remove(0);
   * 
   * @typescript
   * remove(index: number): Pipeline
   */
  remove: function remove(index) {
    if (typeof index !== 'number') {
      return;
    }

    this.pipes.splice(index, 1);
    return this;
  },

  /**
   * !#en
   * Execute task synchronously
   * 
   * !#zh
   * 同步执行任务
   * 
   * @method sync
   * @param {Task} task - The task will be executed
   * @returns {*} result
   * 
   * @example
   * var pipeline = new Pipeline('sync', [(task) => {
   *      let input = task.input;
   *      task.output = doSomething(task.input);
   * }]);
   * 
   * var task = new Task({input: 'test'});
   * console.log(pipeline.sync(task));
   * 
   * @typescript
   * sync(task: Task): any 
   */
  sync: function sync(task) {
    var pipes = this.pipes;
    if (!(task instanceof Task) || pipes.length === 0) return;

    if (task.output != null) {
      task.input = task.output;
      task.output = null;
    }

    task._isFinish = false;

    for (var i = 0, l = pipes.length; i < l;) {
      var pipe = pipes[i];
      var result = pipe(task);

      if (result) {
        task._isFinish = true;
        return result;
      }

      i++;

      if (i !== l) {
        task.input = task.output;
        task.output = null;
      }
    }

    task._isFinish = true;
    return task.output;
  },

  /**
   * !#en
   * Execute task asynchronously
   * 
   * !#zh
   * 异步执行任务
   * 
   * @method async
   * @param {Task} task - The task will be executed
   * 
   * @example
   * var pipeline = new Pipeline('sync', [(task, done) => {
   *      let input = task.input;
   *      task.output = doSomething(task.input);
   *      done();
   * }]);
   * var task = new Task({input: 'test', onComplete: (err, result) => console.log(result)});
   * pipeline.async(task);
   *  
   * @typescript
   * async(task: Task): void
   */
  async: function async(task) {
    var pipes = this.pipes;
    if (!(task instanceof Task) || pipes.length === 0) return;

    if (task.output != null) {
      task.input = task.output;
      task.output = null;
    }

    task._isFinish = false;

    this._flow(0, task);
  },
  _flow: function _flow(index, task) {
    var self = this;
    var pipe = this.pipes[index];
    pipe(task, function (result) {
      if (result) {
        task._isFinish = true;
        task.onComplete && task.onComplete(result);
      } else {
        index++;

        if (index < self.pipes.length) {
          // move output to input
          task.input = task.output;
          task.output = null;

          self._flow(index, task);
        } else {
          task._isFinish = true;
          task.onComplete && task.onComplete(result, task.output);
        }
      }
    });
  }
};
module.exports = Pipeline;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2Fzc2V0LW1hbmFnZXIvcGlwZWxpbmUuanMiXSwibmFtZXMiOlsiVGFzayIsInJlcXVpcmUiLCJfcGlwZWxpbmVJZCIsIlBpcGVsaW5lIiwibmFtZSIsImZ1bmNzIiwiQXJyYXkiLCJpc0FycmF5IiwiY2MiLCJ3YXJuIiwiaWQiLCJwaXBlcyIsImkiLCJsIiwibGVuZ3RoIiwicHVzaCIsInByb3RvdHlwZSIsImNvbnN0cnVjdG9yIiwiaW5zZXJ0IiwiZnVuYyIsImluZGV4Iiwid2FybklEIiwic3BsaWNlIiwiYXBwZW5kIiwicmVtb3ZlIiwic3luYyIsInRhc2siLCJvdXRwdXQiLCJpbnB1dCIsIl9pc0ZpbmlzaCIsInBpcGUiLCJyZXN1bHQiLCJhc3luYyIsIl9mbG93Iiwic2VsZiIsIm9uQ29tcGxldGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLElBQUksR0FBR0MsT0FBTyxDQUFDLFFBQUQsQ0FBcEI7O0FBRUEsSUFBSUMsV0FBVyxHQUFHLENBQWxCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFNBQVNDLFFBQVQsQ0FBbUJDLElBQW5CLEVBQXlCQyxLQUF6QixFQUFnQztBQUM1QixNQUFJLENBQUNDLEtBQUssQ0FBQ0MsT0FBTixDQUFjRixLQUFkLENBQUwsRUFBMkI7QUFDdkJHLElBQUFBLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRLHdCQUFSO0FBQ0E7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDSSxP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VUFBQUEsSUFBSSxDQUFDRyxTQUFMLEdBQWlCLElBQWpCO0FBQ0FILFVBQUFBLElBQUksQ0FBQ1MsVUFBTCxJQUFtQlQsSUFBSSxDQUFDUyxVQUFMLENBQWdCSixNQUFoQixFQUF3QkwsSUFBSSxDQUFDQyxNQUE3QixDQUFuQjtBQUNIO0FBQ0o7QUFDSixLQWxCRyxDQUFKO0FBbUJIO0FBNU9nQixDQUFyQjtBQStPQVMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCbEMsUUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKipcbiAqIEBtb2R1bGUgY2MuQXNzZXRNYW5hZ2VyXG4gKi9cblxuY29uc3QgVGFzayA9IHJlcXVpcmUoJy4vdGFzaycpO1xuXG52YXIgX3BpcGVsaW5lSWQgPSAwO1xuLyoqXG4gKiAhI2VuXG4gKiBQaXBlbGluZSBjYW4gZXhlY3V0ZSB0aGUgdGFzayBmb3Igc29tZSBlZmZlY3QuXG4gKiBcbiAqICEjemhcbiAqIOeuoee6v+iDveaJp+ihjOS7u+WKoei+vuWIsOafkOS4quaViOaenFxuICogXG4gKiBAY2xhc3MgUGlwZWxpbmVcbiAqL1xuZnVuY3Rpb24gUGlwZWxpbmUgKG5hbWUsIGZ1bmNzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGZ1bmNzKSkge1xuICAgICAgICBjYy53YXJuKCdmdW5jcyBtdXN0IGJlIGFuIGFycmF5Jyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9IFxuICAgIFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBUaGUgaWQgb2YgcGlwZWxpbmVcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog566h57q/55qEIGlkXG4gICAgICogXG4gICAgICogQHByb3BlcnR5IGlkXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmlkID0gX3BpcGVsaW5lSWQrKztcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBUaGUgbmFtZSBvZiBwaXBlbGluZVxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDnrqHnur/nmoTlkI3lrZdcbiAgICAgKiBcbiAgICAgKiBAcHJvcGVydHkgbmFtZVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBbGwgcGlwZXMgb2YgcGlwZWxpbmVcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog5omA5pyJ55qE566h6YGTXG4gICAgICogXG4gICAgICogQHByb3BlcnR5IHBpcGVzXG4gICAgICogQHR5cGUge0Z1bmN0aW9uW119XG4gICAgICovXG4gICAgdGhpcy5waXBlcyA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBmdW5jcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKHR5cGVvZiBmdW5jc1tpXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5waXBlcy5wdXNoKGZ1bmNzW2ldKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5QaXBlbGluZS5wcm90b3R5cGUgPSB7XG5cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDcmVhdGUgYSBuZXcgcGlwZWxpbmVcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog5Yib5bu65LiA5Liq566h57q/XG4gICAgICogXG4gICAgICogQG1ldGhvZCBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgcGlwZWxpbmVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IGZ1bmNzIC0gVGhlIGFycmF5IG9mIHBpcGUsIGV2ZXJ5IHBpcGUgbXVzdCBiZSBmdW5jdGlvbiB3aGljaCB0YWtlIHR3byBwYXJhbWV0ZXJzLCB0aGUgZmlyc3QgaXMgYSBgVGFza2AgZmxvd2VkIGluIHBpcGVsaW5lLCB0aGUgc2Vjb25kIGlzIGNvbXBsZXRlIGNhbGxiYWNrXG4gICAgICogXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgcGlwZWxpbmUgPSBuZXcgUGlwZWxpbmUoJ2Rvd25sb2FkJywgW1xuICAgICAqICh0YXNrLCBkb25lKSA9PiB7XG4gICAgICogICAgICB2YXIgdXJsID0gdGFzay5pbnB1dDtcbiAgICAgKiAgICAgIGNjLmFzc2V0TWFuYWdlci5kb3dubG9hZGVyLmRvd25sb2FkRmlsZSh1cmwsIG51bGwsIG51bGwsIChlcnIsIHJlc3VsdCkgPT4ge1xuICAgICAqICAgICAgICAgIHRhc2sub3V0cHV0ID0gcmVzdWx0O1xuICAgICAqICAgICAgICAgIGRvbmUoZXJyKTtcbiAgICAgKiAgICAgIH0pO1xuICAgICAqIH0sXG4gICAgICogKHRhc2ssIGRvbmUpID0+IHtcbiAgICAgKiAgICAgIHZhciB0ZXh0ID0gdGFzay5pbnB1dDtcbiAgICAgKiAgICAgIHZhciBqc29uID0gSlNPTi5zdHJpbmdpZnkodGV4dCk7XG4gICAgICogICAgICB0YXNrLm91dHB1dCA9IGpzb247XG4gICAgICogICAgICBkb25lKCk7XG4gICAgICogfVxuICAgICAqIF0pO1xuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBmdW5jczogQXJyYXk8KHRhc2s6IFRhc2ssIGRvbmU/OiAoZXJyOiBFcnJvcikgPT4gdm9pZCkgPT4gdm9pZD4pXG4gICAgICovXG4gICAgY29uc3RydWN0b3I6IFBpcGVsaW5lLFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEF0IHNwZWNpZmljIHBvaW50IGluc2VydCBhIG5ldyBwaXBlIHRvIHBpcGVsaW5lXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOWcqOafkOS4queJueWumueahOeCueS4uueuoee6v+aPkuWFpeS4gOS4quaWsOeahCBwaXBlXG4gICAgICogXG4gICAgICogQG1ldGhvZCBpbnNlcnRcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIC0gVGhlIG5ldyBwaXBlXG4gICAgICogQHBhcmFtIHtUYXNrfSBmdW5jLnRhc2sgLSBUaGUgdGFzayBoYW5kbGVkIHdpdGggcGlwZWxpbmUgd2lsbCBiZSB0cmFuc2ZlcnJlZCB0byB0aGlzIGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2Z1bmMuY2FsbGJhY2tdIC0gQ2FsbGJhY2sgeW91IG5lZWQgdG8gaW52b2tlIG1hbnVhbGx5IHdoZW4gdGhpcyBwaXBlIGlzIGZpbmlzaGVkLiBpZiB0aGUgcGlwZWxpbmUgaXMgc3luY2hyb25vdXMsIGNhbGxiYWNrIGlzIHVubmVjZXNzYXJ5LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIFRoZSBzcGVjaWZpYyBwb2ludCB5b3Ugd2FudCB0byBpbnNlcnQgYXQuXG4gICAgICogQHJldHVybiB7UGlwZWxpbmV9IHBpcGVsaW5lXG4gICAgICogXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgcGlwZWxpbmUgPSBuZXcgUGlwZWxpbmUoJ3Rlc3QnLCBbXSk7XG4gICAgICogcGlwZWxpbmUuaW5zZXJ0KCh0YXNrLCBkb25lKSA9PiB7XG4gICAgICogICAgICAvLyBkbyBzb21ldGhpbmdcbiAgICAgKiAgICAgIGRvbmUoKTtcbiAgICAgKiB9LCAwKTtcbiAgICAgKiBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGluc2VydChmdW5jOiAodGFzazogVGFzaywgY2FsbGJhY2s/OiAoZXJyOiBFcnJvcikgPT4gdm9pZCkgPT4gdm9pZCwgaW5kZXg6IG51bWJlcik6IFBpcGVsaW5lXG4gICAgICovXG4gICAgaW5zZXJ0IChmdW5jLCBpbmRleCkge1xuICAgICAgICBpZiAodHlwZW9mIGZ1bmMgIT09ICdmdW5jdGlvbicgfHwgaW5kZXggPiB0aGlzLnBpcGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgY2Mud2FybklEKDQ5MjEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIHRoaXMucGlwZXMuc3BsaWNlKGluZGV4LCAwLCBmdW5jKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEFwcGVuZCBhIG5ldyBwaXBlIHRvIHRoZSBwaXBlbGluZVxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDmt7vliqDkuIDkuKrnrqHpgZPliLDnrqHnur/kuK1cbiAgICAgKiBcbiAgICAgKiBAbWV0aG9kIGFwcGVuZFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgLSBUaGUgbmV3IHBpcGVcbiAgICAgKiBAcGFyYW0ge1Rhc2t9IGZ1bmMudGFzayAtIFRoZSB0YXNrIGhhbmRsZWQgd2l0aCBwaXBlbGluZSB3aWxsIGJlIHRyYW5zZmVycmVkIHRvIHRoaXMgZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZnVuYy5jYWxsYmFja10gLSBDYWxsYmFjayB5b3UgbmVlZCB0byBpbnZva2UgbWFudWFsbHkgd2hlbiB0aGlzIHBpcGUgaXMgZmluaXNoZWQuIGlmIHRoZSBwaXBlbGluZSBpcyBzeW5jaHJvbm91cywgY2FsbGJhY2sgaXMgdW5uZWNlc3NhcnkuXG4gICAgICogQHJldHVybiB7UGlwZWxpbmV9IHBpcGVsaW5lXG4gICAgICogXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgcGlwZWxpbmUgPSBuZXcgUGlwZWxpbmUoJ3Rlc3QnLCBbXSk7XG4gICAgICogcGlwZWxpbmUuYXBwZW5kKCh0YXNrLCBkb25lKSA9PiB7XG4gICAgICogICAgICAvLyBkbyBzb21ldGhpbmdcbiAgICAgKiAgICAgIGRvbmUoKTtcbiAgICAgKiB9KTtcbiAgICAgKiBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGFwcGVuZChmdW5jOiAodGFzazogVGFzaywgY2FsbGJhY2s/OiAoZXJyOiBFcnJvcikgPT4gdm9pZCkgPT4gdm9pZCk6IFBpcGVsaW5lXG4gICAgICovXG4gICAgYXBwZW5kIChmdW5jKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZnVuYyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIHRoaXMucGlwZXMucHVzaChmdW5jKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZW1vdmUgcGlwZSB3aGljaCBhdCBzcGVjaWZpYyBwb2ludFxuICAgICAqIFxuICAgICAqICEjemhcbiAgICAgKiDnp7vpmaTnibnlrprkvY3nva7nmoTnrqHpgZNcbiAgICAgKiBcbiAgICAgKiBAbWV0aG9kIHJlbW92ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIFRoZSBzcGVjaWZpYyBwb2ludFxuICAgICAqIEByZXR1cm4ge1BpcGVsaW5lfSBwaXBlbGluZVxuICAgICAqIFxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHBpcGVsaW5lID0gbmV3IFBpcGVsaW5lKCd0ZXN0JywgKHRhc2ssIGRvbmUpID0+IHtcbiAgICAgKiAgICAgIC8vIGRvIHNvbWV0aGluZ1xuICAgICAqICAgICAgZG9uZSgpOyAgXG4gICAgICogfSk7XG4gICAgICogcGlwZWxpbmUucmVtb3ZlKDApO1xuICAgICAqIFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcmVtb3ZlKGluZGV4OiBudW1iZXIpOiBQaXBlbGluZVxuICAgICAqL1xuICAgIHJlbW92ZSAoaW5kZXgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICB0aGlzLnBpcGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogRXhlY3V0ZSB0YXNrIHN5bmNocm9ub3VzbHlcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog5ZCM5q2l5omn6KGM5Lu75YqhXG4gICAgICogXG4gICAgICogQG1ldGhvZCBzeW5jXG4gICAgICogQHBhcmFtIHtUYXNrfSB0YXNrIC0gVGhlIHRhc2sgd2lsbCBiZSBleGVjdXRlZFxuICAgICAqIEByZXR1cm5zIHsqfSByZXN1bHRcbiAgICAgKiBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBwaXBlbGluZSA9IG5ldyBQaXBlbGluZSgnc3luYycsIFsodGFzaykgPT4ge1xuICAgICAqICAgICAgbGV0IGlucHV0ID0gdGFzay5pbnB1dDtcbiAgICAgKiAgICAgIHRhc2sub3V0cHV0ID0gZG9Tb21ldGhpbmcodGFzay5pbnB1dCk7XG4gICAgICogfV0pO1xuICAgICAqIFxuICAgICAqIHZhciB0YXNrID0gbmV3IFRhc2soe2lucHV0OiAndGVzdCd9KTtcbiAgICAgKiBjb25zb2xlLmxvZyhwaXBlbGluZS5zeW5jKHRhc2spKTtcbiAgICAgKiBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN5bmModGFzazogVGFzayk6IGFueSBcbiAgICAgKi9cbiAgICBzeW5jICh0YXNrKSB7XG4gICAgICAgIHZhciBwaXBlcyA9IHRoaXMucGlwZXM7XG4gICAgICAgIGlmICghKHRhc2sgaW5zdGFuY2VvZiBUYXNrKSB8fCBwaXBlcy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICAgICAgaWYgKHRhc2sub3V0cHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRhc2suaW5wdXQgPSB0YXNrLm91dHB1dDtcbiAgICAgICAgICAgIHRhc2sub3V0cHV0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB0YXNrLl9pc0ZpbmlzaCA9IGZhbHNlO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHBpcGVzLmxlbmd0aDsgaSA8IGw7KSB7XG4gICAgICAgICAgICB2YXIgcGlwZSA9IHBpcGVzW2ldO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHBpcGUodGFzayk7XG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdGFzay5faXNGaW5pc2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgICBpZiAoaSAhPT0gbCkge1xuICAgICAgICAgICAgICAgIHRhc2suaW5wdXQgPSB0YXNrLm91dHB1dDtcbiAgICAgICAgICAgICAgICB0YXNrLm91dHB1dCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGFzay5faXNGaW5pc2ggPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGFzay5vdXRwdXQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBFeGVjdXRlIHRhc2sgYXN5bmNocm9ub3VzbHlcbiAgICAgKiBcbiAgICAgKiAhI3poXG4gICAgICog5byC5q2l5omn6KGM5Lu75YqhXG4gICAgICogXG4gICAgICogQG1ldGhvZCBhc3luY1xuICAgICAqIEBwYXJhbSB7VGFza30gdGFzayAtIFRoZSB0YXNrIHdpbGwgYmUgZXhlY3V0ZWRcbiAgICAgKiBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBwaXBlbGluZSA9IG5ldyBQaXBlbGluZSgnc3luYycsIFsodGFzaywgZG9uZSkgPT4ge1xuICAgICAqICAgICAgbGV0IGlucHV0ID0gdGFzay5pbnB1dDtcbiAgICAgKiAgICAgIHRhc2sub3V0cHV0ID0gZG9Tb21ldGhpbmcodGFzay5pbnB1dCk7XG4gICAgICogICAgICBkb25lKCk7XG4gICAgICogfV0pO1xuICAgICAqIHZhciB0YXNrID0gbmV3IFRhc2soe2lucHV0OiAndGVzdCcsIG9uQ29tcGxldGU6IChlcnIsIHJlc3VsdCkgPT4gY29uc29sZS5sb2cocmVzdWx0KX0pO1xuICAgICAqIHBpcGVsaW5lLmFzeW5jKHRhc2spO1xuICAgICAqICBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGFzeW5jKHRhc2s6IFRhc2spOiB2b2lkXG4gICAgICovXG4gICAgYXN5bmMgKHRhc2spIHtcbiAgICAgICAgdmFyIHBpcGVzID0gdGhpcy5waXBlcztcbiAgICAgICAgaWYgKCEodGFzayBpbnN0YW5jZW9mIFRhc2spIHx8IHBpcGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgICAgICBpZiAodGFzay5vdXRwdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGFzay5pbnB1dCA9IHRhc2sub3V0cHV0O1xuICAgICAgICAgICAgdGFzay5vdXRwdXQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHRhc2suX2lzRmluaXNoID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2Zsb3coMCwgdGFzayk7XG4gICAgfSxcblxuICAgIF9mbG93IChpbmRleCwgdGFzaykge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBwaXBlID0gdGhpcy5waXBlc1tpbmRleF07XG4gICAgICAgIHBpcGUodGFzaywgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHRhc2suX2lzRmluaXNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0YXNrLm9uQ29tcGxldGUgJiYgdGFzay5vbkNvbXBsZXRlKHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IHNlbGYucGlwZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG1vdmUgb3V0cHV0IHRvIGlucHV0XG4gICAgICAgICAgICAgICAgICAgIHRhc2suaW5wdXQgPSB0YXNrLm91dHB1dDtcbiAgICAgICAgICAgICAgICAgICAgdGFzay5vdXRwdXQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9mbG93KGluZGV4LCB0YXNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRhc2suX2lzRmluaXNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGFzay5vbkNvbXBsZXRlICYmIHRhc2sub25Db21wbGV0ZShyZXN1bHQsIHRhc2sub3V0cHV0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGlwZWxpbmU7XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==