
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCMacro.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * Predefined constants
 * @class macro
 * @static
 */
cc.macro = {
  /**
   * PI / 180
   * @property RAD
   * @type {Number}
   */
  RAD: Math.PI / 180,

  /**
   * One degree
   * @property DEG
   * @type {Number}
   */
  DEG: 180 / Math.PI,

  /**
   * @property REPEAT_FOREVER
   * @type {Number}
   */
  REPEAT_FOREVER: Number.MAX_VALUE - 1,

  /**
   * @property FLT_EPSILON
   * @type {Number}
   */
  FLT_EPSILON: 0.0000001192092896,

  /**
   * Minimum z index value for node
   * @property MIN_ZINDEX
   * @type {Number}
   */
  MIN_ZINDEX: -Math.pow(2, 15),

  /**
   * Maximum z index value for node
   * @property MAX_ZINDEX
   * @type {Number}
   */
  MAX_ZINDEX: Math.pow(2, 15) - 1,
  //some gl constant variable

  /**
   * @property ONE
   * @type {Number}
   */
  ONE: 1,

  /**
   * @property ZERO
   * @type {Number}
   */
  ZERO: 0,

  /**
   * @property SRC_ALPHA
   * @type {Number}
   */
  SRC_ALPHA: 0x0302,

  /**
   * @property SRC_ALPHA_SATURATE
   * @type {Number}
   */
  SRC_ALPHA_SATURATE: 0x308,

  /**
   * @property SRC_COLOR
   * @type {Number}
   */
  SRC_COLOR: 0x300,

  /**
   * @property DST_ALPHA
   * @type {Number}
   */
  DST_ALPHA: 0x304,

  /**
   * @property DST_COLOR
   * @type {Number}
   */
  DST_COLOR: 0x306,

  /**
   * @property ONE_MINUS_SRC_ALPHA
   * @type {Number}
   */
  ONE_MINUS_SRC_ALPHA: 0x0303,

  /**
   * @property ONE_MINUS_SRC_COLOR
   * @type {Number}
   */
  ONE_MINUS_SRC_COLOR: 0x301,

  /**
   * @property ONE_MINUS_DST_ALPHA
   * @type {Number}
   */
  ONE_MINUS_DST_ALPHA: 0x305,

  /**
   * @property ONE_MINUS_DST_COLOR
   * @type {Number}
   */
  ONE_MINUS_DST_COLOR: 0x0307,

  /**
   * @property ONE_MINUS_CONSTANT_ALPHA
   * @type {Number}
   */
  ONE_MINUS_CONSTANT_ALPHA: 0x8004,

  /**
   * @property ONE_MINUS_CONSTANT_COLOR
   * @type {Number}
   */
  ONE_MINUS_CONSTANT_COLOR: 0x8002,
  //Possible device orientations

  /**
   * Oriented vertically
   * @property ORIENTATION_PORTRAIT
   * @type {Number}
   */
  ORIENTATION_PORTRAIT: 1,

  /**
   * Oriented horizontally
   * @property ORIENTATION_LANDSCAPE
   * @type {Number}
   */
  ORIENTATION_LANDSCAPE: 2,

  /**
   * Oriented automatically
   * @property ORIENTATION_AUTO
   * @type {Number}
   */
  ORIENTATION_AUTO: 3,
  DENSITYDPI_DEVICE: 'device-dpi',
  DENSITYDPI_HIGH: 'high-dpi',
  DENSITYDPI_MEDIUM: 'medium-dpi',
  DENSITYDPI_LOW: 'low-dpi',
  // General configurations

  /**
   * <p>
   *   If enabled, the texture coordinates will be calculated by using this formula: <br/>
   *      - texCoord.left = (rect.x*2+1) / (texture.wide*2);                  <br/>
   *      - texCoord.right = texCoord.left + (rect.width*2-2)/(texture.wide*2); <br/>
   *                                                                                 <br/>
   *  The same for bottom and top.                                                   <br/>
   *                                                                                 <br/>
   *  This formula prevents artifacts by using 99% of the texture.                   <br/>
   *  The "correct" way to prevent artifacts is by expand the texture's border with the same color by 1 pixel<br/>
   *                                                                                  <br/>
   *  Affected component:                                                                 <br/>
   *      - cc.TMXLayer                                                       <br/>
   *                                                                                  <br/>
   *  Enabled by default. To disabled set it to 0. <br/>
   *  To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
   * </p>
   *
   * @property {Number} FIX_ARTIFACTS_BY_STRECHING_TEXEL_TMX
   */
  FIX_ARTIFACTS_BY_STRECHING_TEXEL_TMX: true,

  /**
   * Position of the FPS (Default: 0,0 (bottom-left corner))<br/>
   * To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
   * @property {Vec2} DIRECTOR_STATS_POSITION
   */
  DIRECTOR_STATS_POSITION: cc.v2(0, 0),

  /**
   * <p>
   *    If enabled, actions that alter the position property (eg: CCMoveBy, CCJumpBy, CCBezierBy, etc..) will be stacked.                  <br/>
   *    If you run 2 or more 'position' actions at the same time on a node, then end position will be the sum of all the positions.        <br/>
   *    If disabled, only the last run action will take effect.
   * </p>
   * @property {Number} ENABLE_STACKABLE_ACTIONS
   */
  ENABLE_STACKABLE_ACTIONS: true,

  /**
   * !#en 
   * The timeout to determine whether a touch is no longer active and should be removed.
   * The reason to add this timeout is due to an issue in X5 browser core, 
   * when X5 is presented in wechat on Android, if a touch is glissed from the bottom up, and leave the page area,
   * no touch cancel event is triggered, and the touch will be considered active forever. 
   * After multiple times of this action, our maximum touches number will be reached and all new touches will be ignored.
   * So this new mechanism can remove the touch that should be inactive if it's not updated during the last 5000 milliseconds.
   * Though it might remove a real touch if it's just not moving for the last 5 seconds which is not easy with the sensibility of mobile touch screen.
   * You can modify this value to have a better behavior if you find it's not enough.
   * !#zh
   * 用于甄别一个触点对象是否已经失效并且可以被移除的延时时长
   * 添加这个时长的原因是 X5 内核在微信浏览器中出现的一个 bug。
   * 在这个环境下，如果用户将一个触点从底向上移出页面区域，将不会触发任何 touch cancel 或 touch end 事件，而这个触点会被永远当作停留在页面上的有效触点。
   * 重复这样操作几次之后，屏幕上的触点数量将达到我们的事件系统所支持的最高触点数量，之后所有的触摸事件都将被忽略。
   * 所以这个新的机制可以在触点在一定时间内没有任何更新的情况下视为失效触点并从事件系统中移除。
   * 当然，这也可能移除一个真实的触点，如果用户的触点真的在一定时间段内完全没有移动（这在当前手机屏幕的灵敏度下会很难）。
   * 你可以修改这个值来获得你需要的效果，默认值是 5000 毫秒。
   * @property {Number} TOUCH_TIMEOUT
   */
  TOUCH_TIMEOUT: 5000,

  /**
   * !#en 
   * The maximum vertex count for a single batched draw call.
   * !#zh
   * 最大可以被单次批处理渲染的顶点数量。
   * @property {Number} BATCH_VERTEX_COUNT
   */
  BATCH_VERTEX_COUNT: 20000,

  /**
   * !#en 
   * Whether or not enabled tiled map auto culling. If you set the TiledMap skew or rotation, then need to manually disable this, otherwise, the rendering will be wrong.
   * !#zh
   * 是否开启瓦片地图的自动裁减功能。瓦片地图如果设置了 skew, rotation 或者采用了摄像机的话，需要手动关闭，否则渲染会出错。
   * @property {Boolean} ENABLE_TILEDMAP_CULLING
   * @default true
   */
  ENABLE_TILEDMAP_CULLING: true,

  /**
   * !#en 
   * Boolean that indicates if the canvas contains an alpha channel, default sets to false for better performance.
   * Though if you want to make your canvas background transparent and show other dom elements at the background, 
   * you can set it to true before `cc.game.run`.
   * Web only.
   * !#zh
   * 用于设置 Canvas 背景是否支持 alpha 通道，默认为 false，这样可以有更高的性能表现。
   * 如果你希望 Canvas 背景是透明的，并显示背后的其他 DOM 元素，你可以在 `cc.game.run` 之前将这个值设为 true。
   * 仅支持 Web
   * @property {Boolean} ENABLE_TRANSPARENT_CANVAS
   * @default false
   */
  ENABLE_TRANSPARENT_CANVAS: false,

  /**
   * !#en
   * Boolean that indicates if the WebGL context is created with `antialias` option turned on, default value is false.
   * Set it to true could make your game graphics slightly smoother, like texture hard edges when rotated.
   * Whether to use this really depend on your game design and targeted platform, 
   * device with retina display usually have good detail on graphics with or without this option, 
   * you probably don't want antialias if your game style is pixel art based.
   * Also, it could have great performance impact with some browser / device using software MSAA.
   * You can set it to true before `cc.game.run`.
   * Web only.
   * !#zh
   * 用于设置在创建 WebGL Context 时是否开启抗锯齿选项，默认值是 false。
   * 将这个选项设置为 true 会让你的游戏画面稍稍平滑一些，比如旋转硬边贴图时的锯齿。是否开启这个选项很大程度上取决于你的游戏和面向的平台。
   * 在大多数拥有 retina 级别屏幕的设备上用户往往无法区分这个选项带来的变化；如果你的游戏选择像素艺术风格，你也多半不会想开启这个选项。
   * 同时，在少部分使用软件级别抗锯齿算法的设备或浏览器上，这个选项会对性能产生比较大的影响。
   * 你可以在 `cc.game.run` 之前设置这个值，否则它不会生效。
   * 仅支持 Web
   * @property {Boolean} ENABLE_WEBGL_ANTIALIAS
   * @default false
   */
  ENABLE_WEBGL_ANTIALIAS: false,

  /**
   * !#en
   * Whether or not enable auto culling.
   * This feature have been removed in v2.0 new renderer due to overall performance consumption.
   * We have no plan currently to re-enable auto culling.
   * If your game have more dynamic objects, we suggest to disable auto culling.
   * If your game have more static objects, we suggest to enable auto culling.
   * !#zh
   * 是否开启自动裁减功能，开启裁减功能将会把在屏幕外的物体从渲染队列中去除掉。
   * 这个功能在 v2.0 的新渲染器中被移除了，因为它在大多数游戏中所带来的损耗要高于性能的提升，目前我们没有计划重新支持自动裁剪。
   * 如果游戏中的动态物体比较多的话，建议将此选项关闭。
   * 如果游戏中的静态物体比较多的话，建议将此选项打开。
   * @property {Boolean} ENABLE_CULLING
   * @deprecated since v2.0
   * @default false
   */
  ENABLE_CULLING: false,

  /**
   * !#en
   * Whether to clear the original image cache after uploaded a texture to GPU. If cleared, [Dynamic Atlas](https://docs.cocos.com/creator/manual/en/advanced-topics/dynamic-atlas.html) will not be supported.
   * Normally you don't need to enable this option on the web platform, because Image object doesn't consume too much memory.
   * But on WeChat Game platform, the current version cache decoded data in Image object, which has high memory usage.
   * So we enabled this option by default on WeChat, so that we can release Image cache immediately after uploaded to GPU.
   * !#zh
   * 是否在将贴图上传至 GPU 之后删除原始图片缓存，删除之后图片将无法进行 [动态合图](https://docs.cocos.com/creator/manual/zh/advanced-topics/dynamic-atlas.html)。
   * 在 Web 平台，你通常不需要开启这个选项，因为在 Web 平台 Image 对象所占用的内存很小。
   * 但是在微信小游戏平台的当前版本，Image 对象会缓存解码后的图片数据，它所占用的内存空间很大。
   * 所以我们在微信平台默认开启了这个选项，这样我们就可以在上传 GL 贴图之后立即释放 Image 对象的内存，避免过高的内存占用。
   * @property {Boolean} CLEANUP_IMAGE_CACHE
   * @default false
   */
  CLEANUP_IMAGE_CACHE: false,

  /**
   * !#en
   * Whether or not show mesh wire frame.
   * !#zh
   * 是否显示网格的线框。
   * @property {Boolean} SHOW_MESH_WIREFRAME
   * @default false
   */
  SHOW_MESH_WIREFRAME: false,

  /**
   * !#en
   * Whether or not show mesh normal.
   * !#zh
   * 是否显示网格的法线。
   * @property {Boolean} SHOW_MESH_NORMAL
   * @default false
   */
  SHOW_MESH_NORMAL: false,

  /**
   * !#en
   * Whether to enable multi-touch.
   * !#zh
   * 是否开启多点触摸
   * @property {Boolean} ENABLE_MULTI_TOUCH
   * @default true
   */
  ENABLE_MULTI_TOUCH: true,

  /**
   * References: 
   * https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap
   * https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/createImageBitmap
   * 
   * !#en
   * Whether to use image bitmap first. If enabled, memory usage will increase.
   * 
   * !#zh
   * 是否优先使用 image bitmap，启用之后，内存占用会变高
   * 
   * @property {Boolean} ALLOW_IMAGE_BITMAP
   * @default true
   */
  ALLOW_IMAGE_BITMAP: !cc.sys.isMobile,

  /**
   * !#en
   * Whether to use native TTF renderer which is faster but layout slightly different.
   * 
   * !#zh
   * 是否使用原生的文本渲染机制, 布局和编辑器有差异.
   * 
   * @property {Boolean} ENABLE_NATIVE_TTF_RENDERER
   * @default true
   */
  ENABLE_NATIVE_TTF_RENDERER: true
};
Object.defineProperty(cc.macro, 'ROTATE_ACTION_CCW', {
  set: function set(value) {
    if (cc.RotateTo && cc.RotateBy) {
      cc.RotateTo._reverse = cc.RotateBy._reverse = value;
    }
  }
});
var SUPPORT_TEXTURE_FORMATS = ['.pkm', '.pvr', '.webp', '.jpg', '.jpeg', '.bmp', '.png'];
/**
 * !#en
 * The image format supported by the engine defaults, and the supported formats may differ in different build platforms and device types.
 * Currently all platform and device support ['.webp', '.jpg', '.jpeg', '.bmp', '.png'], The iOS mobile platform also supports the PVR format。
 * !#zh
 * 引擎默认支持的图片格式，支持的格式可能在不同的构建平台和设备类型上有所差别。
 * 目前所有平台和设备支持的格式有 ['.webp', '.jpg', '.jpeg', '.bmp', '.png']. 另外 Ios 手机平台还额外支持了 PVR 格式。
 * @property {String[]} SUPPORT_TEXTURE_FORMATS
 */

cc.macro.SUPPORT_TEXTURE_FORMATS = SUPPORT_TEXTURE_FORMATS;
/**
 * !#en Key map for keyboard event
 * !#zh 键盘事件的按键值
 * @enum macro.KEY
 * @example {@link cocos2d/core/platform/CCCommon/KEY.js}
 */

cc.macro.KEY = {
  /**
   * !#en None
   * !#zh 没有分配
   * @property none
   * @type {Number}
   * @readonly
   */
  none: 0,
  // android

  /**
   * !#en The back key
   * !#zh 返回键
   * @property back
   * @type {Number}
   * @readonly
   */
  back: 6,

  /**
   * !#en The menu key
   * !#zh 菜单键
   * @property menu
   * @type {Number}
   * @readonly
   */
  menu: 18,

  /**
   * !#en The backspace key
   * !#zh 退格键
   * @property backspace
   * @type {Number}
   * @readonly
   */
  backspace: 8,

  /**
   * !#en The tab key
   * !#zh Tab 键
   * @property tab
   * @type {Number}
   * @readonly
   */
  tab: 9,

  /**
   * !#en The enter key
   * !#zh 回车键
   * @property enter
   * @type {Number}
   * @readonly
   */
  enter: 13,

  /**
   * !#en The shift key
   * !#zh Shift 键
   * @property shift
   * @type {Number}
   * @readonly
   */
  shift: 16,
  //should use shiftkey instead

  /**
   * !#en The ctrl key
   * !#zh Ctrl 键
   * @property ctrl
   * @type {Number}
   * @readonly
   */
  ctrl: 17,
  //should use ctrlkey

  /**
   * !#en The alt key
   * !#zh Alt 键
   * @property alt
   * @type {Number}
   * @readonly
   */
  alt: 18,
  //should use altkey

  /**
   * !#en The pause key
   * !#zh 暂停键
   * @property pause
   * @type {Number}
   * @readonly
   */
  pause: 19,

  /**
   * !#en The caps lock key
   * !#zh 大写锁定键
   * @property capslock
   * @type {Number}
   * @readonly
   */
  capslock: 20,

  /**
   * !#en The esc key
   * !#zh ESC 键
   * @property escape
   * @type {Number}
   * @readonly
   */
  escape: 27,

  /**
   * !#en The space key
   * !#zh 空格键
   * @property space
   * @type {Number}
   * @readonly
   */
  space: 32,

  /**
   * !#en The page up key
   * !#zh 向上翻页键
   * @property pageup
   * @type {Number}
   * @readonly
   */
  pageup: 33,

  /**
   * !#en The page down key
   * !#zh 向下翻页键
   * @property pagedown
   * @type {Number}
   * @readonly
   */
  pagedown: 34,

  /**
   * !#en The end key
   * !#zh 结束键
   * @property end
   * @type {Number}
   * @readonly
   */
  end: 35,

  /**
   * !#en The home key
   * !#zh 主菜单键
   * @property home
   * @type {Number}
   * @readonly
   */
  home: 36,

  /**
   * !#en The left key
   * !#zh 向左箭头键
   * @property left
   * @type {Number}
   * @readonly
   */
  left: 37,

  /**
   * !#en The up key
   * !#zh 向上箭头键
   * @property up
   * @type {Number}
   * @readonly
   */
  up: 38,

  /**
   * !#en The right key
   * !#zh 向右箭头键
   * @property right
   * @type {Number}
   * @readonly
   */
  right: 39,

  /**
   * !#en The down key
   * !#zh 向下箭头键
   * @property down
   * @type {Number}
   * @readonly
   */
  down: 40,

  /**
   * !#en The select key
   * !#zh Select 键
   * @property select
   * @type {Number}
   * @readonly
   */
  select: 41,

  /**
   * !#en The insert key
   * !#zh 插入键
   * @property insert
   * @type {Number}
   * @readonly
   */
  insert: 45,

  /**
   * !#en The Delete key
   * !#zh 删除键
   * @property Delete
   * @type {Number}
   * @readonly
   */
  Delete: 46,

  /**
   * !#en The '0' key on the top of the alphanumeric keyboard.
   * !#zh 字母键盘上的 0 键
   * @property 0
   * @type {Number}
   * @readonly
   */
  0: 48,

  /**
   * !#en The '1' key on the top of the alphanumeric keyboard.
   * !#zh 字母键盘上的 1 键
   * @property 1
   * @type {Number}
   * @readonly
   */
  1: 49,

  /**
   * !#en The '2' key on the top of the alphanumeric keyboard.
   * !#zh 字母键盘上的 2 键
   * @property 2
   * @type {Number}
   * @readonly
   */
  2: 50,

  /**
   * !#en The '3' key on the top of the alphanumeric keyboard.
   * !#zh 字母键盘上的 3 键
   * @property 3
   * @type {Number}
   * @readonly
   */
  3: 51,

  /**
   * !#en The '4' key on the top of the alphanumeric keyboard.
   * !#zh 字母键盘上的 4 键
   * @property 4
   * @type {Number}
   * @readonly
   */
  4: 52,

  /**
   * !#en The '5' key on the top of the alphanumeric keyboard.
   * !#zh 字母键盘上的 5 键
   * @property 5
   * @type {Number}
   * @readonly
   */
  5: 53,

  /**
   * !#en The '6' key on the top of the alphanumeric keyboard.
   * !#zh 字母键盘上的 6 键
   * @property 6
   * @type {Number}
   * @readonly
   */
  6: 54,

  /**
   * !#en The '7' key on the top of the alphanumeric keyboard.
   * !#zh 字母键盘上的 7 键
   * @property 7
   * @type {Number}
   * @readonly
   */
  7: 55,

  /**
   * !#en The '8' key on the top of the alphanumeric keyboard.
   * !#zh 字母键盘上的 8 键
   * @property 8
   * @type {Number}
   * @readonly
   */
  8: 56,

  /**
   * !#en The '9' key on the top of the alphanumeric keyboard.
   * !#zh 字母键盘上的 9 键
   * @property 9
   * @type {Number}
   * @readonly
   */
  9: 57,

  /**
   * !#en The a key
   * !#zh A 键
   * @property a
   * @type {Number}
   * @readonly
   */
  a: 65,

  /**
   * !#en The b key
   * !#zh B 键
   * @property b
   * @type {Number}
   * @readonly
   */
  b: 66,

  /**
   * !#en The c key
   * !#zh C 键
   * @property c
   * @type {Number}
   * @readonly
   */
  c: 67,

  /**
   * !#en The d key
   * !#zh D 键
   * @property d
   * @type {Number}
   * @readonly
   */
  d: 68,

  /**
   * !#en The e key
   * !#zh E 键
   * @property e
   * @type {Number}
   * @readonly
   */
  e: 69,

  /**
   * !#en The f key
   * !#zh F 键
   * @property f
   * @type {Number}
   * @readonly
   */
  f: 70,

  /**
   * !#en The g key
   * !#zh G 键
   * @property g
   * @type {Number}
   * @readonly
   */
  g: 71,

  /**
   * !#en The h key
   * !#zh H 键
   * @property h
   * @type {Number}
   * @readonly
   */
  h: 72,

  /**
   * !#en The i key
   * !#zh I 键
   * @property i
   * @type {Number}
   * @readonly
   */
  i: 73,

  /**
   * !#en The j key
   * !#zh J 键
   * @property j
   * @type {Number}
   * @readonly
   */
  j: 74,

  /**
   * !#en The k key
   * !#zh K 键
   * @property k
   * @type {Number}
   * @readonly
   */
  k: 75,

  /**
   * !#en The l key
   * !#zh L 键
   * @property l
   * @type {Number}
   * @readonly
   */
  l: 76,

  /**
   * !#en The m key
   * !#zh M 键
   * @property m
   * @type {Number}
   * @readonly
   */
  m: 77,

  /**
   * !#en The n key
   * !#zh N 键
   * @property n
   * @type {Number}
   * @readonly
   */
  n: 78,

  /**
   * !#en The o key
   * !#zh O 键
   * @property o
   * @type {Number}
   * @readonly
   */
  o: 79,

  /**
   * !#en The p key
   * !#zh P 键
   * @property p
   * @type {Number}
   * @readonly
   */
  p: 80,

  /**
   * !#en The q key
   * !#zh Q 键
   * @property q
   * @type {Number}
   * @readonly
   */
  q: 81,

  /**
   * !#en The r key
   * !#zh R 键
   * @property r
   * @type {Number}
   * @readonly
   */
  r: 82,

  /**
   * !#en The s key
   * !#zh S 键
   * @property s
   * @type {Number}
   * @readonly
   */
  s: 83,

  /**
   * !#en The t key
   * !#zh T 键
   * @property t
   * @type {Number}
   * @readonly
   */
  t: 84,

  /**
   * !#en The u key
   * !#zh U 键
   * @property u
   * @type {Number}
   * @readonly
   */
  u: 85,

  /**
   * !#en The v key
   * !#zh V 键
   * @property v
   * @type {Number}
   * @readonly
   */
  v: 86,

  /**
   * !#en The w key
   * !#zh W 键
   * @property w
   * @type {Number}
   * @readonly
   */
  w: 87,

  /**
   * !#en The x key
   * !#zh X 键
   * @property x
   * @type {Number}
   * @readonly
   */
  x: 88,

  /**
   * !#en The y key
   * !#zh Y 键
   * @property y
   * @type {Number}
   * @readonly
   */
  y: 89,

  /**
   * !#en The z key
   * !#zh Z 键
   * @property z
   * @type {Number}
   * @readonly
   */
  z: 90,

  /**
   * !#en The numeric keypad 0
   * !#zh 数字键盘 0
   * @property num0
   * @type {Number}
   * @readonly
   */
  num0: 96,

  /**
   * !#en The numeric keypad 1
   * !#zh 数字键盘 1
   * @property num1
   * @type {Number}
   * @readonly
   */
  num1: 97,

  /**
   * !#en The numeric keypad 2
   * !#zh 数字键盘 2
   * @property num2
   * @type {Number}
   * @readonly
   */
  num2: 98,

  /**
   * !#en The numeric keypad 3
   * !#zh 数字键盘 3
   * @property num3
   * @type {Number}
   * @readonly
   */
  num3: 99,

  /**
   * !#en The numeric keypad 4
   * !#zh 数字键盘 4
   * @property num4
   * @type {Number}
   * @readonly
   */
  num4: 100,

  /**
   * !#en The numeric keypad 5
   * !#zh 数字键盘 5
   * @property num5
   * @type {Number}
   * @readonly
   */
  num5: 101,

  /**
   * !#en The numeric keypad 6
   * !#zh 数字键盘 6
   * @property num6
   * @type {Number}
   * @readonly
   */
  num6: 102,

  /**
   * !#en The numeric keypad 7
   * !#zh 数字键盘 7
   * @property num7
   * @type {Number}
   * @readonly
   */
  num7: 103,

  /**
   * !#en The numeric keypad 8
   * !#zh 数字键盘 8
   * @property num8
   * @type {Number}
   * @readonly
   */
  num8: 104,

  /**
   * !#en The numeric keypad 9
   * !#zh 数字键盘 9
   * @property num9
   * @type {Number}
   * @readonly
   */
  num9: 105,

  /**
   * !#en The numeric keypad '*'
   * !#zh 数字键盘 *
   * @property *
   * @type {Number}
   * @readonly
   */
  '*': 106,

  /**
   * !#en The numeric keypad '+'
   * !#zh 数字键盘 +
   * @property +
   * @type {Number}
   * @readonly
   */
  '+': 107,

  /**
   * !#en The numeric keypad '-'
   * !#zh 数字键盘 -
   * @property -
   * @type {Number}
   * @readonly
   */
  '-': 109,

  /**
   * !#en The numeric keypad 'delete'
   * !#zh 数字键盘删除键
   * @property numdel
   * @type {Number}
   * @readonly
   */
  'numdel': 110,

  /**
   * !#en The numeric keypad '/'
   * !#zh 数字键盘 /
   * @property /
   * @type {Number}
   * @readonly
   */
  '/': 111,

  /**
   * !#en The F1 function key
   * !#zh F1 功能键
   * @property f1
   * @type {Number}
   * @readonly
   */
  f1: 112,
  //f1-f12 dont work on ie

  /**
   * !#en The F2 function key
   * !#zh F2 功能键
   * @property f2
   * @type {Number}
   * @readonly
   */
  f2: 113,

  /**
   * !#en The F3 function key
   * !#zh F3 功能键
   * @property f3
   * @type {Number}
   * @readonly
   */
  f3: 114,

  /**
   * !#en The F4 function key
   * !#zh F4 功能键
   * @property f4
   * @type {Number}
   * @readonly
   */
  f4: 115,

  /**
   * !#en The F5 function key
   * !#zh F5 功能键
   * @property f5
   * @type {Number}
   * @readonly
   */
  f5: 116,

  /**
   * !#en The F6 function key
   * !#zh F6 功能键
   * @property f6
   * @type {Number}
   * @readonly
   */
  f6: 117,

  /**
   * !#en The F7 function key
   * !#zh F7 功能键
   * @property f7
   * @type {Number}
   * @readonly
   */
  f7: 118,

  /**
   * !#en The F8 function key
   * !#zh F8 功能键
   * @property f8
   * @type {Number}
   * @readonly
   */
  f8: 119,

  /**
   * !#en The F9 function key
   * !#zh F9 功能键
   * @property f9
   * @type {Number}
   * @readonly
   */
  f9: 120,

  /**
   * !#en The F10 function key
   * !#zh F10 功能键
   * @property f10
   * @type {Number}
   * @readonly
   */
  f10: 121,

  /**
   * !#en The F11 function key
   * !#zh F11 功能键
   * @property f11
   * @type {Number}
   * @readonly
   */
  f11: 122,

  /**
   * !#en The F12 function key
   * !#zh F12 功能键
   * @property f12
   * @type {Number}
   * @readonly
   */
  f12: 123,

  /**
   * !#en The numlock key
   * !#zh 数字锁定键
   * @property numlock
   * @type {Number}
   * @readonly
   */
  numlock: 144,

  /**
   * !#en The scroll lock key
   * !#zh 滚动锁定键
   * @property scrolllock
   * @type {Number}
   * @readonly
   */
  scrolllock: 145,

  /**
   * !#en The ';' key.
   * !#zh 分号键
   * @property ;
   * @type {Number}
   * @readonly
   */
  ';': 186,

  /**
   * !#en The ';' key.
   * !#zh 分号键
   * @property semicolon
   * @type {Number}
   * @readonly
   */
  semicolon: 186,

  /**
   * !#en The '=' key.
   * !#zh 等于号键
   * @property equal
   * @type {Number}
   * @readonly
   */
  equal: 187,

  /**
   * !#en The '=' key.
   * !#zh 等于号键
   * @property =
   * @type {Number}
   * @readonly
   */
  '=': 187,

  /**
   * !#en The ',' key.
   * !#zh 逗号键
   * @property ,
   * @type {Number}
   * @readonly
   */
  ',': 188,

  /**
   * !#en The ',' key.
   * !#zh 逗号键
   * @property comma
   * @type {Number}
   * @readonly
   */
  comma: 188,

  /**
   * !#en The dash '-' key.
   * !#zh 中划线键
   * @property dash
   * @type {Number}
   * @readonly
   */
  dash: 189,

  /**
   * !#en The '.' key.
   * !#zh 句号键
   * @property .
   * @type {Number}
   * @readonly
   */
  '.': 190,

  /**
   * !#en The '.' key
   * !#zh 句号键
   * @property period
   * @type {Number}
   * @readonly
   */
  period: 190,

  /**
   * !#en The forward slash key
   * !#zh 正斜杠键
   * @property forwardslash
   * @type {Number}
   * @readonly
   */
  forwardslash: 191,

  /**
   * !#en The grave key
   * !#zh 按键 `
   * @property grave
   * @type {Number}
   * @readonly
   */
  grave: 192,

  /**
   * !#en The '[' key
   * !#zh 按键 [
   * @property [
   * @type {Number}
   * @readonly
   */
  '[': 219,

  /**
   * !#en The '[' key
   * !#zh 按键 [
   * @property openbracket
   * @type {Number}
   * @readonly
   */
  openbracket: 219,

  /**
   * !#en The '\' key
   * !#zh 反斜杠键
   * @property backslash
   * @type {Number}
   * @readonly
   */
  backslash: 220,

  /**
   * !#en The ']' key
   * !#zh 按键 ]
   * @property ]
   * @type {Number}
   * @readonly
   */
  ']': 221,

  /**
   * !#en The ']' key
   * !#zh 按键 ]
   * @property closebracket
   * @type {Number}
   * @readonly
   */
  closebracket: 221,

  /**
   * !#en The quote key
   * !#zh 单引号键
   * @property quote
   * @type {Number}
   * @readonly
   */
  quote: 222,
  // gamepad controll

  /**
   * !#en The dpad left key
   * !#zh 导航键 向左
   * @property dpadLeft
   * @type {Number}
   * @readonly
   */
  dpadLeft: 1000,

  /**
   * !#en The dpad right key
   * !#zh 导航键 向右
   * @property dpadRight
   * @type {Number}
   * @readonly
   */
  dpadRight: 1001,

  /**
   * !#en The dpad up key
   * !#zh 导航键 向上
   * @property dpadUp
   * @type {Number}
   * @readonly
   */
  dpadUp: 1003,

  /**
   * !#en The dpad down key
   * !#zh 导航键 向下
   * @property dpadDown
   * @type {Number}
   * @readonly
   */
  dpadDown: 1004,

  /**
   * !#en The dpad center key
   * !#zh 导航键 确定键
   * @property dpadCenter
   * @type {Number}
   * @readonly
   */
  dpadCenter: 1005
};
/**
 * Image formats
 * @enum macro.ImageFormat
 */

cc.macro.ImageFormat = cc.Enum({
  /**
   * Image Format:JPG
   * @property JPG
   * @type {Number}
   */
  JPG: 0,

  /**
   * Image Format:PNG
   * @property PNG
   * @type {Number}
   */
  PNG: 1,

  /**
   * Image Format:TIFF
   * @property TIFF
   * @type {Number}
   */
  TIFF: 2,

  /**
   * Image Format:WEBP
   * @property WEBP
   * @type {Number}
   */
  WEBP: 3,

  /**
   * Image Format:PVR
   * @property PVR
   * @type {Number}
   */
  PVR: 4,

  /**
   * Image Format:ETC
   * @property ETC
   * @type {Number}
   */
  ETC: 5,

  /**
   * Image Format:S3TC
   * @property S3TC
   * @type {Number}
   */
  S3TC: 6,

  /**
   * Image Format:ATITC
   * @property ATITC
   * @type {Number}
   */
  ATITC: 7,

  /**
   * Image Format:TGA
   * @property TGA
   * @type {Number}
   */
  TGA: 8,

  /**
   * Image Format:RAWDATA
   * @property RAWDATA
   * @type {Number}
   */
  RAWDATA: 9,

  /**
   * Image Format:UNKNOWN
   * @property UNKNOWN
   * @type {Number}
   */
  UNKNOWN: 10
});
/**
 * !#en
 * Enum for blend factor
 * Refer to: http://www.andersriggelsen.dk/glblendfunc.php
 * !#zh
 * 混合因子
 * 可参考: http://www.andersriggelsen.dk/glblendfunc.php
 * @enum macro.BlendFactor
 */

cc.macro.BlendFactor = cc.Enum({
  /**
   * !#en All use
   * !#zh 全部使用
   * @property {Number} ONE
   */
  ONE: 1,
  //cc.macro.ONE

  /**
   * !#en Not all
   * !#zh 全部不用
   * @property {Number} ZERO
   */
  ZERO: 0,
  //cc.ZERO

  /**
   * !#en Using the source alpha
   * !#zh 使用源颜色的透明度
   * @property {Number} SRC_ALPHA
   */
  SRC_ALPHA: 0x302,
  //cc.SRC_ALPHA

  /**
   * !#en Using the source color
   * !#zh 使用源颜色
   * @property {Number} SRC_COLOR
   */
  SRC_COLOR: 0x300,
  //cc.SRC_COLOR

  /**
   * !#en Using the target alpha
   * !#zh 使用目标颜色的透明度
   * @property {Number} DST_ALPHA
   */
  DST_ALPHA: 0x304,
  //cc.DST_ALPHA

  /**
   * !#en Using the target color
   * !#zh 使用目标颜色
   * @property {Number} DST_COLOR
   */
  DST_COLOR: 0x306,
  //cc.DST_COLOR

  /**
   * !#en Minus the source alpha
   * !#zh 减去源颜色的透明度
   * @property {Number} ONE_MINUS_SRC_ALPHA
   */
  ONE_MINUS_SRC_ALPHA: 0x303,
  //cc.ONE_MINUS_SRC_ALPHA

  /**
   * !#en Minus the source color
   * !#zh 减去源颜色
   * @property {Number} ONE_MINUS_SRC_COLOR
   */
  ONE_MINUS_SRC_COLOR: 0x301,
  //cc.ONE_MINUS_SRC_COLOR

  /**
   * !#en Minus the target alpha
   * !#zh 减去目标颜色的透明度
   * @property {Number} ONE_MINUS_DST_ALPHA
   */
  ONE_MINUS_DST_ALPHA: 0x305,
  //cc.ONE_MINUS_DST_ALPHA

  /**
   * !#en Minus the target color
   * !#zh 减去目标颜色
   * @property {Number} ONE_MINUS_DST_COLOR
   */
  ONE_MINUS_DST_COLOR: 0x307 //cc.ONE_MINUS_DST_COLOR

});
/**
 * @enum macro.TextAlignment
 */

cc.macro.TextAlignment = cc.Enum({
  /**
   * @property {Number} LEFT
   */
  LEFT: 0,

  /**
   * @property {Number} CENTER
   */
  CENTER: 1,

  /**
   * @property {Number} RIGHT
   */
  RIGHT: 2
});
/**
 * @enum VerticalTextAlignment
 */

cc.macro.VerticalTextAlignment = cc.Enum({
  /**
   * @property {Number} TOP
   */
  TOP: 0,

  /**
   * @property {Number} CENTER
   */
  CENTER: 1,

  /**
   * @property {Number} BOTTOM
   */
  BOTTOM: 2
});
module.exports = cc.macro;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3BsYXRmb3JtL0NDTWFjcm8uanMiXSwibmFtZXMiOlsiY2MiLCJtYWNybyIsIlJBRCIsIk1hdGgiLCJQSSIsIkRFRyIsIlJFUEVBVF9GT1JFVkVSIiwiTnVtYmVyIiwiTUFYX1ZBTFVFIiwiRkxUX0VQU0lMT04iLCJNSU5fWklOREVYIiwicG93IiwiTUFYX1pJTkRFWCIsIk9ORSIsIlpFUk8iLCJTUkNfQUxQSEEiLCJTUkNfQUxQSEFfU0FUVVJBVEUiLCJTUkNfQ09MT1IiLCJEU1RfQUxQSEEiLCJEU1RfQ09MT1IiLCJPTkVfTUlOVVNfU1JDX0FMUEhBIiwiT05FX01JTlVTX1NSQ19DT0xPUiIsIk9ORV9NSU5VU19EU1RfQUxQSEEiLCJPTkVfTUlOVVNfRFNUX0NPTE9SIiwiT05FX01JTlVTX0NPTlNUQU5UX0FMUEhBIiwiT05FX01JTlVTX0NPTlNUQU5UX0NPTE9SIiwiT1JJRU5UQVRJT05fUE9SVFJBSVQiLCJPUklFTlRBVElPTl9MQU5EU0NBUEUiLCJPUklFTlRBVElPTl9BVVRPIiwiREVOU0lUWURQSV9ERVZJQ0UiLCJERU5TSVRZRFBJX0hJR0giLCJERU5TSVRZRFBJX01FRElVTSIsIkRFTlNJVFlEUElfTE9XIiwiRklYX0FSVElGQUNUU19CWV9TVFJFQ0hJTkdfVEVYRUxfVE1YIiwiRElSRUNUT1JfU1RBVFNfUE9TSVRJT04iLCJ2MiIsIkVOQUJMRV9TVEFDS0FCTEVfQUNUSU9OUyIsIlRPVUNIX1RJTUVPVVQiLCJCQVRDSF9WRVJURVhfQ09VTlQiLCJFTkFCTEVfVElMRURNQVBfQ1VMTElORyIsIkVOQUJMRV9UUkFOU1BBUkVOVF9DQU5WQVMiLCJFTkFCTEVfV0VCR0xfQU5USUFMSUFTIiwiRU5BQkxFX0NVTExJTkciLCJDTEVBTlVQX0lNQUdFX0NBQ0hFIiwiU0hPV19NRVNIX1dJUkVGUkFNRSIsIlNIT1dfTUVTSF9OT1JNQUwiLCJFTkFCTEVfTVVMVElfVE9VQ0giLCJBTExPV19JTUFHRV9CSVRNQVAiLCJzeXMiLCJpc01vYmlsZSIsIkVOQUJMRV9OQVRJVkVfVFRGX1JFTkRFUkVSIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJzZXQiLCJ2YWx1ZSIsIlJvdGF0ZVRvIiwiUm90YXRlQnkiLCJfcmV2ZXJzZSIsIlNVUFBPUlRfVEVYVFVSRV9GT1JNQVRTIiwiS0VZIiwibm9uZSIsImJhY2siLCJtZW51IiwiYmFja3NwYWNlIiwidGFiIiwiZW50ZXIiLCJzaGlmdCIsImN0cmwiLCJhbHQiLCJwYXVzZSIsImNhcHNsb2NrIiwiZXNjYXBlIiwic3BhY2UiLCJwYWdldXAiLCJwYWdlZG93biIsImVuZCIsImhvbWUiLCJsZWZ0IiwidXAiLCJyaWdodCIsImRvd24iLCJzZWxlY3QiLCJpbnNlcnQiLCJEZWxldGUiLCJhIiwiYiIsImMiLCJkIiwiZSIsImYiLCJnIiwiaCIsImkiLCJqIiwiayIsImwiLCJtIiwibiIsIm8iLCJwIiwicSIsInIiLCJzIiwidCIsInUiLCJ2IiwidyIsIngiLCJ5IiwieiIsIm51bTAiLCJudW0xIiwibnVtMiIsIm51bTMiLCJudW00IiwibnVtNSIsIm51bTYiLCJudW03IiwibnVtOCIsIm51bTkiLCJmMSIsImYyIiwiZjMiLCJmNCIsImY1IiwiZjYiLCJmNyIsImY4IiwiZjkiLCJmMTAiLCJmMTEiLCJmMTIiLCJudW1sb2NrIiwic2Nyb2xsbG9jayIsInNlbWljb2xvbiIsImVxdWFsIiwiY29tbWEiLCJkYXNoIiwicGVyaW9kIiwiZm9yd2FyZHNsYXNoIiwiZ3JhdmUiLCJvcGVuYnJhY2tldCIsImJhY2tzbGFzaCIsImNsb3NlYnJhY2tldCIsInF1b3RlIiwiZHBhZExlZnQiLCJkcGFkUmlnaHQiLCJkcGFkVXAiLCJkcGFkRG93biIsImRwYWRDZW50ZXIiLCJJbWFnZUZvcm1hdCIsIkVudW0iLCJKUEciLCJQTkciLCJUSUZGIiwiV0VCUCIsIlBWUiIsIkVUQyIsIlMzVEMiLCJBVElUQyIsIlRHQSIsIlJBV0RBVEEiLCJVTktOT1dOIiwiQmxlbmRGYWN0b3IiLCJUZXh0QWxpZ25tZW50IiwiTEVGVCIsIkNFTlRFUiIsIlJJR0hUIiwiVmVydGljYWxUZXh0QWxpZ25tZW50IiwiVE9QIiwiQk9UVE9NIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBQSxFQUFFLENBQUNDLEtBQUgsR0FBVztBQUNQO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsR0FBRyxFQUFFQyxJQUFJLENBQUNDLEVBQUwsR0FBVSxHQU5SOztBQVFQO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsR0FBRyxFQUFFLE1BQU1GLElBQUksQ0FBQ0MsRUFiVDs7QUFlUDtBQUNKO0FBQ0E7QUFDQTtBQUNJRSxFQUFBQSxjQUFjLEVBQUdDLE1BQU0sQ0FBQ0MsU0FBUCxHQUFtQixDQW5CN0I7O0FBcUJQO0FBQ0o7QUFDQTtBQUNBO0FBQ0lDLEVBQUFBLFdBQVcsRUFBRSxrQkF6Qk47O0FBMkJQO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsVUFBVSxFQUFFLENBQUNQLElBQUksQ0FBQ1EsR0FBTCxDQUFTLENBQVQsRUFBWSxFQUFaLENBaENOOztBQWtDUDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLEVBQUFBLFVBQVUsRUFBRVQsSUFBSSxDQUFDUSxHQUFMLENBQVMsQ0FBVCxFQUFZLEVBQVosSUFBa0IsQ0F2Q3ZCO0FBeUNQOztBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0lFLEVBQUFBLEdBQUcsRUFBRSxDQTlDRTs7QUFnRFA7QUFDSjtBQUNBO0FBQ0E7QUFDSUMsRUFBQUEsSUFBSSxFQUFFLENBcERDOztBQXNEUDtBQUNKO0FBQ0E7QUFDQTtBQUNJQyxFQUFBQSxT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RSxDQUFDdUosSUFBSCxDQUFRO0FBQ3JDO0FBQ0o7QUFDQTtBQUNJa0IsRUFBQUEsR0FBRyxFQUFFLENBSmdDOztBQUtyQztBQUNKO0FBQ0E7QUFDSUgsRUFBQUEsTUFBTSxFQUFFLENBUjZCOztBQVNyQztBQUNKO0FBQ0E7QUFDSUksRUFBQUEsTUFBTSxFQUFFO0FBWjZCLENBQVIsQ0FBakM7QUFlQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCNUssRUFBRSxDQUFDQyxLQUFwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDA4LTIwMTAgUmljYXJkbyBRdWVzYWRhXG4gQ29weXJpZ2h0IChjKSAyMDExLTIwMTIgY29jb3MyZC14Lm9yZ1xuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZ1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqXG4gKiBQcmVkZWZpbmVkIGNvbnN0YW50c1xuICogQGNsYXNzIG1hY3JvXG4gKiBAc3RhdGljXG4gKi9cbmNjLm1hY3JvID0ge1xuICAgIC8qKlxuICAgICAqIFBJIC8gMTgwXG4gICAgICogQHByb3BlcnR5IFJBRFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgUkFEOiBNYXRoLlBJIC8gMTgwLFxuXG4gICAgLyoqXG4gICAgICogT25lIGRlZ3JlZVxuICAgICAqIEBwcm9wZXJ0eSBERUdcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIERFRzogMTgwIC8gTWF0aC5QSSxcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBSRVBFQVRfRk9SRVZFUlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgUkVQRUFUX0ZPUkVWRVI6IChOdW1iZXIuTUFYX1ZBTFVFIC0gMSksXG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgRkxUX0VQU0lMT05cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIEZMVF9FUFNJTE9OOiAwLjAwMDAwMDExOTIwOTI4OTYsXG5cbiAgICAvKipcbiAgICAgKiBNaW5pbXVtIHogaW5kZXggdmFsdWUgZm9yIG5vZGVcbiAgICAgKiBAcHJvcGVydHkgTUlOX1pJTkRFWFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgTUlOX1pJTkRFWDogLU1hdGgucG93KDIsIDE1KSxcblxuICAgIC8qKlxuICAgICAqIE1heGltdW0geiBpbmRleCB2YWx1ZSBmb3Igbm9kZVxuICAgICAqIEBwcm9wZXJ0eSBNQVhfWklOREVYXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBNQVhfWklOREVYOiBNYXRoLnBvdygyLCAxNSkgLSAxLFxuXG4gICAgLy9zb21lIGdsIGNvbnN0YW50IHZhcmlhYmxlXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IE9ORVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgT05FOiAxLFxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IFpFUk9cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFpFUk86IDAsXG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgU1JDX0FMUEhBXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBTUkNfQUxQSEE6IDB4MDMwMixcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBTUkNfQUxQSEFfU0FUVVJBVEVcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFNSQ19BTFBIQV9TQVRVUkFURTogMHgzMDgsXG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgU1JDX0NPTE9SXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBTUkNfQ09MT1I6IDB4MzAwLFxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IERTVF9BTFBIQVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgRFNUX0FMUEhBOiAweDMwNCxcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBEU1RfQ09MT1JcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIERTVF9DT0xPUjogMHgzMDYsXG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgT05FX01JTlVTX1NSQ19BTFBIQVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgT05FX01JTlVTX1NSQ19BTFBIQTogMHgwMzAzLFxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IE9ORV9NSU5VU19TUkNfQ09MT1JcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIE9ORV9NSU5VU19TUkNfQ09MT1I6IDB4MzAxLFxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IE9ORV9NSU5VU19EU1RfQUxQSEFcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIE9ORV9NSU5VU19EU1RfQUxQSEE6IDB4MzA1LFxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IE9ORV9NSU5VU19EU1RfQ09MT1JcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIE9ORV9NSU5VU19EU1RfQ09MT1I6IDB4MDMwNyxcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBPTkVfTUlOVVNfQ09OU1RBTlRfQUxQSEFcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIE9ORV9NSU5VU19DT05TVEFOVF9BTFBIQTogMHg4MDA0LFxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IE9ORV9NSU5VU19DT05TVEFOVF9DT0xPUlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgT05FX01JTlVTX0NPTlNUQU5UX0NPTE9SOiAweDgwMDIsXG5cbiAgICAvL1Bvc3NpYmxlIGRldmljZSBvcmllbnRhdGlvbnNcbiAgICAvKipcbiAgICAgKiBPcmllbnRlZCB2ZXJ0aWNhbGx5XG4gICAgICogQHByb3BlcnR5IE9SSUVOVEFUSU9OX1BPUlRSQUlUXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBPUklFTlRBVElPTl9QT1JUUkFJVDogMSxcblxuICAgIC8qKlxuICAgICAqIE9yaWVudGVkIGhvcml6b250YWxseVxuICAgICAqIEBwcm9wZXJ0eSBPUklFTlRBVElPTl9MQU5EU0NBUEVcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIE9SSUVOVEFUSU9OX0xBTkRTQ0FQRTogMixcblxuICAgIC8qKlxuICAgICAqIE9yaWVudGVkIGF1dG9tYXRpY2FsbHlcbiAgICAgKiBAcHJvcGVydHkgT1JJRU5UQVRJT05fQVVUT1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgT1JJRU5UQVRJT05fQVVUTzogMyxcblxuICAgIERFTlNJVFlEUElfREVWSUNFOiAnZGV2aWNlLWRwaScsXG4gICAgREVOU0lUWURQSV9ISUdIOiAnaGlnaC1kcGknLFxuICAgIERFTlNJVFlEUElfTUVESVVNOiAnbWVkaXVtLWRwaScsXG4gICAgREVOU0lUWURQSV9MT1c6ICdsb3ctZHBpJyxcblxuICAgIC8vIEdlbmVyYWwgY29uZmlndXJhdGlvbnNcblxuICAgIC8qKlxuICAgICAqIDxwPlxuICAgICAqICAgSWYgZW5hYmxlZCwgdGhlIHRleHR1cmUgY29vcmRpbmF0ZXMgd2lsbCBiZSBjYWxjdWxhdGVkIGJ5IHVzaW5nIHRoaXMgZm9ybXVsYTogPGJyLz5cbiAgICAgKiAgICAgIC0gdGV4Q29vcmQubGVmdCA9IChyZWN0LngqMisxKSAvICh0ZXh0dXJlLndpZGUqMik7ICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgIC0gdGV4Q29vcmQucmlnaHQgPSB0ZXhDb29yZC5sZWZ0ICsgKHJlY3Qud2lkdGgqMi0yKS8odGV4dHVyZS53aWRlKjIpOyA8YnIvPlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgVGhlIHNhbWUgZm9yIGJvdHRvbSBhbmQgdG9wLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqICBUaGlzIGZvcm11bGEgcHJldmVudHMgYXJ0aWZhY3RzIGJ5IHVzaW5nIDk5JSBvZiB0aGUgdGV4dHVyZS4gICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgVGhlIFwiY29ycmVjdFwiIHdheSB0byBwcmV2ZW50IGFydGlmYWN0cyBpcyBieSBleHBhbmQgdGhlIHRleHR1cmUncyBib3JkZXIgd2l0aCB0aGUgc2FtZSBjb2xvciBieSAxIHBpeGVsPGJyLz5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqICBBZmZlY3RlZCBjb21wb25lbnQ6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqICAgICAgLSBjYy5UTVhMYXllciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogIEVuYWJsZWQgYnkgZGVmYXVsdC4gVG8gZGlzYWJsZWQgc2V0IGl0IHRvIDAuIDxici8+XG4gICAgICogIFRvIG1vZGlmeSBpdCwgaW4gV2ViIGVuZ2luZSBwbGVhc2UgcmVmZXIgdG8gQ0NNYWNyby5qcywgaW4gSlNCIHBsZWFzZSByZWZlciB0byBDQ0NvbmZpZy5oXG4gICAgICogPC9wPlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEZJWF9BUlRJRkFDVFNfQllfU1RSRUNISU5HX1RFWEVMX1RNWFxuICAgICAqL1xuICAgIEZJWF9BUlRJRkFDVFNfQllfU1RSRUNISU5HX1RFWEVMX1RNWDogdHJ1ZSxcblxuICAgIC8qKlxuICAgICAqIFBvc2l0aW9uIG9mIHRoZSBGUFMgKERlZmF1bHQ6IDAsMCAoYm90dG9tLWxlZnQgY29ybmVyKSk8YnIvPlxuICAgICAqIFRvIG1vZGlmeSBpdCwgaW4gV2ViIGVuZ2luZSBwbGVhc2UgcmVmZXIgdG8gQ0NNYWNyby5qcywgaW4gSlNCIHBsZWFzZSByZWZlciB0byBDQ0NvbmZpZy5oXG4gICAgICogQHByb3BlcnR5IHtWZWMyfSBESVJFQ1RPUl9TVEFUU19QT1NJVElPTlxuICAgICAqL1xuICAgIERJUkVDVE9SX1NUQVRTX1BPU0lUSU9OOiBjYy52MigwLCAwKSxcblxuICAgIC8qKlxuICAgICAqIDxwPlxuICAgICAqICAgIElmIGVuYWJsZWQsIGFjdGlvbnMgdGhhdCBhbHRlciB0aGUgcG9zaXRpb24gcHJvcGVydHkgKGVnOiBDQ01vdmVCeSwgQ0NKdW1wQnksIENDQmV6aWVyQnksIGV0Yy4uKSB3aWxsIGJlIHN0YWNrZWQuICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICBJZiB5b3UgcnVuIDIgb3IgbW9yZSAncG9zaXRpb24nIGFjdGlvbnMgYXQgdGhlIHNhbWUgdGltZSBvbiBhIG5vZGUsIHRoZW4gZW5kIHBvc2l0aW9uIHdpbGwgYmUgdGhlIHN1bSBvZiBhbGwgdGhlIHBvc2l0aW9ucy4gICAgICAgIDxici8+XG4gICAgICogICAgSWYgZGlzYWJsZWQsIG9ubHkgdGhlIGxhc3QgcnVuIGFjdGlvbiB3aWxsIHRha2UgZWZmZWN0LlxuICAgICAqIDwvcD5cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gRU5BQkxFX1NUQUNLQUJMRV9BQ1RJT05TXG4gICAgICovXG4gICAgRU5BQkxFX1NUQUNLQUJMRV9BQ1RJT05TOiB0cnVlLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBcbiAgICAgKiBUaGUgdGltZW91dCB0byBkZXRlcm1pbmUgd2hldGhlciBhIHRvdWNoIGlzIG5vIGxvbmdlciBhY3RpdmUgYW5kIHNob3VsZCBiZSByZW1vdmVkLlxuICAgICAqIFRoZSByZWFzb24gdG8gYWRkIHRoaXMgdGltZW91dCBpcyBkdWUgdG8gYW4gaXNzdWUgaW4gWDUgYnJvd3NlciBjb3JlLCBcbiAgICAgKiB3aGVuIFg1IGlzIHByZXNlbnRlZCBpbiB3ZWNoYXQgb24gQW5kcm9pZCwgaWYgYSB0b3VjaCBpcyBnbGlzc2VkIGZyb20gdGhlIGJvdHRvbSB1cCwgYW5kIGxlYXZlIHRoZSBwYWdlIGFyZWEsXG4gICAgICogbm8gdG91Y2ggY2FuY2VsIGV2ZW50IGlzIHRyaWdnZXJlZCwgYW5kIHRoZSB0b3VjaCB3aWxsIGJlIGNvbnNpZGVyZWQgYWN0aXZlIGZvcmV2ZXIuIFxuICAgICAqIEFmdGVyIG11bHRpcGxlIHRpbWVzIG9mIHRoaXMgYWN0aW9uLCBvdXIgbWF4aW11bSB0b3VjaGVzIG51bWJlciB3aWxsIGJlIHJlYWNoZWQgYW5kIGFsbCBuZXcgdG91Y2hlcyB3aWxsIGJlIGlnbm9yZWQuXG4gICAgICogU28gdGhpcyBuZXcgbWVjaGFuaXNtIGNhbiByZW1vdmUgdGhlIHRvdWNoIHRoYXQgc2hvdWxkIGJlIGluYWN0aXZlIGlmIGl0J3Mgbm90IHVwZGF0ZWQgZHVyaW5nIHRoZSBsYXN0IDUwMDAgbWlsbGlzZWNvbmRzLlxuICAgICAqIFRob3VnaCBpdCBtaWdodCByZW1vdmUgYSByZWFsIHRvdWNoIGlmIGl0J3MganVzdCBub3QgbW92aW5nIGZvciB0aGUgbGFzdCA1IHNlY29uZHMgd2hpY2ggaXMgbm90IGVhc3kgd2l0aCB0aGUgc2Vuc2liaWxpdHkgb2YgbW9iaWxlIHRvdWNoIHNjcmVlbi5cbiAgICAgKiBZb3UgY2FuIG1vZGlmeSB0aGlzIHZhbHVlIHRvIGhhdmUgYSBiZXR0ZXIgYmVoYXZpb3IgaWYgeW91IGZpbmQgaXQncyBub3QgZW5vdWdoLlxuICAgICAqICEjemhcbiAgICAgKiDnlKjkuo7nlITliKvkuIDkuKrop6bngrnlr7nosaHmmK/lkKblt7Lnu4/lpLHmlYjlubbkuJTlj6/ku6Xooqvnp7vpmaTnmoTlu7bml7bml7bplb9cbiAgICAgKiDmt7vliqDov5nkuKrml7bplb/nmoTljp/lm6DmmK8gWDUg5YaF5qC45Zyo5b6u5L+h5rWP6KeI5Zmo5Lit5Ye6546w55qE5LiA5LiqIGJ1Z+OAglxuICAgICAqIOWcqOi/meS4queOr+Wig+S4i++8jOWmguaenOeUqOaIt+WwhuS4gOS4quinpueCueS7juW6leWQkeS4iuenu+WHuumhtemdouWMuuWfn++8jOWwhuS4jeS8muinpuWPkeS7u+S9lSB0b3VjaCBjYW5jZWwg5oiWIHRvdWNoIGVuZCDkuovku7bvvIzogIzov5nkuKrop6bngrnkvJrooqvmsLjov5zlvZPkvZzlgZznlZnlnKjpobXpnaLkuIrnmoTmnInmlYjop6bngrnjgIJcbiAgICAgKiDph43lpI3ov5nmoLfmk43kvZzlh6DmrKHkuYvlkI7vvIzlsY/luZXkuIrnmoTop6bngrnmlbDph4/lsIbovr7liLDmiJHku6znmoTkuovku7bns7vnu5/miYDmlK/mjIHnmoTmnIDpq5jop6bngrnmlbDph4/vvIzkuYvlkI7miYDmnInnmoTop6bmkbjkuovku7bpg73lsIbooqvlv73nlaXjgIJcbiAgICAgKiDmiYDku6Xov5nkuKrmlrDnmoTmnLrliLblj6/ku6XlnKjop6bngrnlnKjkuIDlrprml7bpl7TlhoXmsqHmnInku7vkvZXmm7TmlrDnmoTmg4XlhrXkuIvop4bkuLrlpLHmlYjop6bngrnlubbku47kuovku7bns7vnu5/kuK3np7vpmaTjgIJcbiAgICAgKiDlvZPnhLbvvIzov5nkuZ/lj6/og73np7vpmaTkuIDkuKrnnJ/lrp7nmoTop6bngrnvvIzlpoLmnpznlKjmiLfnmoTop6bngrnnnJ/nmoTlnKjkuIDlrprml7bpl7TmrrXlhoXlrozlhajmsqHmnInnp7vliqjvvIjov5nlnKjlvZPliY3miYvmnLrlsY/luZXnmoTngbXmlY/luqbkuIvkvJrlvojpmr7vvInjgIJcbiAgICAgKiDkvaDlj6/ku6Xkv67mlLnov5nkuKrlgLzmnaXojrflvpfkvaDpnIDopoHnmoTmlYjmnpzvvIzpu5jorqTlgLzmmK8gNTAwMCDmr6vnp5LjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gVE9VQ0hfVElNRU9VVFxuICAgICAqL1xuICAgIFRPVUNIX1RJTUVPVVQ6IDUwMDAsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFxuICAgICAqIFRoZSBtYXhpbXVtIHZlcnRleCBjb3VudCBmb3IgYSBzaW5nbGUgYmF0Y2hlZCBkcmF3IGNhbGwuXG4gICAgICogISN6aFxuICAgICAqIOacgOWkp+WPr+S7peiiq+WNleasoeaJueWkhOeQhua4suafk+eahOmhtueCueaVsOmHj+OAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBCQVRDSF9WRVJURVhfQ09VTlRcbiAgICAgKi9cbiAgICBCQVRDSF9WRVJURVhfQ09VTlQ6IDIwMDAwLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBcbiAgICAgKiBXaGV0aGVyIG9yIG5vdCBlbmFibGVkIHRpbGVkIG1hcCBhdXRvIGN1bGxpbmcuIElmIHlvdSBzZXQgdGhlIFRpbGVkTWFwIHNrZXcgb3Igcm90YXRpb24sIHRoZW4gbmVlZCB0byBtYW51YWxseSBkaXNhYmxlIHRoaXMsIG90aGVyd2lzZSwgdGhlIHJlbmRlcmluZyB3aWxsIGJlIHdyb25nLlxuICAgICAqICEjemhcbiAgICAgKiDmmK/lkKblvIDlkK/nk6bniYflnLDlm77nmoToh6rliqjoo4Hlh4/lip/og73jgILnk6bniYflnLDlm77lpoLmnpzorr7nva7kuoYgc2tldywgcm90YXRpb24g5oiW6ICF6YeH55So5LqG5pGE5YOP5py655qE6K+d77yM6ZyA6KaB5omL5Yqo5YWz6Zet77yM5ZCm5YiZ5riy5p+T5Lya5Ye66ZSZ44CCXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBFTkFCTEVfVElMRURNQVBfQ1VMTElOR1xuICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgKi9cbiAgICBFTkFCTEVfVElMRURNQVBfQ1VMTElORzogdHJ1ZSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gXG4gICAgICogQm9vbGVhbiB0aGF0IGluZGljYXRlcyBpZiB0aGUgY2FudmFzIGNvbnRhaW5zIGFuIGFscGhhIGNoYW5uZWwsIGRlZmF1bHQgc2V0cyB0byBmYWxzZSBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlLlxuICAgICAqIFRob3VnaCBpZiB5b3Ugd2FudCB0byBtYWtlIHlvdXIgY2FudmFzIGJhY2tncm91bmQgdHJhbnNwYXJlbnQgYW5kIHNob3cgb3RoZXIgZG9tIGVsZW1lbnRzIGF0IHRoZSBiYWNrZ3JvdW5kLCBcbiAgICAgKiB5b3UgY2FuIHNldCBpdCB0byB0cnVlIGJlZm9yZSBgY2MuZ2FtZS5ydW5gLlxuICAgICAqIFdlYiBvbmx5LlxuICAgICAqICEjemhcbiAgICAgKiDnlKjkuo7orr7nva4gQ2FudmFzIOiDjOaZr+aYr+WQpuaUr+aMgSBhbHBoYSDpgJrpgZPvvIzpu5jorqTkuLogZmFsc2XvvIzov5nmoLflj6/ku6XmnInmm7Tpq5jnmoTmgKfog73ooajnjrDjgIJcbiAgICAgKiDlpoLmnpzkvaDluIzmnJsgQ2FudmFzIOiDjOaZr+aYr+mAj+aYjueahO+8jOW5tuaYvuekuuiDjOWQjueahOWFtuS7liBET00g5YWD57Sg77yM5L2g5Y+v5Lul5ZyoIGBjYy5nYW1lLnJ1bmAg5LmL5YmN5bCG6L+Z5Liq5YC86K6+5Li6IHRydWXjgIJcbiAgICAgKiDku4XmlK/mjIEgV2ViXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBFTkFCTEVfVFJBTlNQQVJFTlRfQ0FOVkFTXG4gICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgKi9cbiAgICBFTkFCTEVfVFJBTlNQQVJFTlRfQ0FOVkFTOiBmYWxzZSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBCb29sZWFuIHRoYXQgaW5kaWNhdGVzIGlmIHRoZSBXZWJHTCBjb250ZXh0IGlzIGNyZWF0ZWQgd2l0aCBgYW50aWFsaWFzYCBvcHRpb24gdHVybmVkIG9uLCBkZWZhdWx0IHZhbHVlIGlzIGZhbHNlLlxuICAgICAqIFNldCBpdCB0byB0cnVlIGNvdWxkIG1ha2UgeW91ciBnYW1lIGdyYXBoaWNzIHNsaWdodGx5IHNtb290aGVyLCBsaWtlIHRleHR1cmUgaGFyZCBlZGdlcyB3aGVuIHJvdGF0ZWQuXG4gICAgICogV2hldGhlciB0byB1c2UgdGhpcyByZWFsbHkgZGVwZW5kIG9uIHlvdXIgZ2FtZSBkZXNpZ24gYW5kIHRhcmdldGVkIHBsYXRmb3JtLCBcbiAgICAgKiBkZXZpY2Ugd2l0aCByZXRpbmEgZGlzcGxheSB1c3VhbGx5IGhhdmUgZ29vZCBkZXRhaWwgb24gZ3JhcGhpY3Mgd2l0aCBvciB3aXRob3V0IHRoaXMgb3B0aW9uLCBcbiAgICAgKiB5b3UgcHJvYmFibHkgZG9uJ3Qgd2FudCBhbnRpYWxpYXMgaWYgeW91ciBnYW1lIHN0eWxlIGlzIHBpeGVsIGFydCBiYXNlZC5cbiAgICAgKiBBbHNvLCBpdCBjb3VsZCBoYXZlIGdyZWF0IHBlcmZvcm1hbmNlIGltcGFjdCB3aXRoIHNvbWUgYnJvd3NlciAvIGRldmljZSB1c2luZyBzb2Z0d2FyZSBNU0FBLlxuICAgICAqIFlvdSBjYW4gc2V0IGl0IHRvIHRydWUgYmVmb3JlIGBjYy5nYW1lLnJ1bmAuXG4gICAgICogV2ViIG9ubHkuXG4gICAgICogISN6aFxuICAgICAqIOeUqOS6juiuvue9ruWcqOWIm+W7uiBXZWJHTCBDb250ZXh0IOaXtuaYr+WQpuW8gOWQr+aKl+mUr+m9v+mAiemhue+8jOm7mOiupOWAvOaYryBmYWxzZeOAglxuICAgICAqIOWwhui/meS4qumAiemhueiuvue9ruS4uiB0cnVlIOS8muiuqeS9oOeahOa4uOaIj+eUu+mdoueojeeojeW5s+a7keS4gOS6m++8jOavlOWmguaXi+i9rOehrOi+uei0tOWbvuaXtueahOmUr+m9v+OAguaYr+WQpuW8gOWQr+i/meS4qumAiemhueW+iOWkp+eoi+W6puS4iuWPluWGs+S6juS9oOeahOa4uOaIj+WSjOmdouWQkeeahOW5s+WPsOOAglxuICAgICAqIOWcqOWkp+WkmuaVsOaLpeaciSByZXRpbmEg57qn5Yir5bGP5bmV55qE6K6+5aSH5LiK55So5oi35b6A5b6A5peg5rOV5Yy65YiG6L+Z5Liq6YCJ6aG55bim5p2l55qE5Y+Y5YyW77yb5aaC5p6c5L2g55qE5ri45oiP6YCJ5oup5YOP57Sg6Im65pyv6aOO5qC877yM5L2g5Lmf5aSa5Y2K5LiN5Lya5oOz5byA5ZCv6L+Z5Liq6YCJ6aG544CCXG4gICAgICog5ZCM5pe277yM5Zyo5bCR6YOo5YiG5L2/55So6L2v5Lu257qn5Yir5oqX6ZSv6b2/566X5rOV55qE6K6+5aSH5oiW5rWP6KeI5Zmo5LiK77yM6L+Z5Liq6YCJ6aG55Lya5a+55oCn6IO95Lqn55Sf5q+U6L6D5aSn55qE5b2x5ZON44CCXG4gICAgICog5L2g5Y+v5Lul5ZyoIGBjYy5nYW1lLnJ1bmAg5LmL5YmN6K6+572u6L+Z5Liq5YC877yM5ZCm5YiZ5a6D5LiN5Lya55Sf5pWI44CCXG4gICAgICog5LuF5pSv5oyBIFdlYlxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gRU5BQkxFX1dFQkdMX0FOVElBTElBU1xuICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgRU5BQkxFX1dFQkdMX0FOVElBTElBUzogZmFsc2UsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogV2hldGhlciBvciBub3QgZW5hYmxlIGF1dG8gY3VsbGluZy5cbiAgICAgKiBUaGlzIGZlYXR1cmUgaGF2ZSBiZWVuIHJlbW92ZWQgaW4gdjIuMCBuZXcgcmVuZGVyZXIgZHVlIHRvIG92ZXJhbGwgcGVyZm9ybWFuY2UgY29uc3VtcHRpb24uXG4gICAgICogV2UgaGF2ZSBubyBwbGFuIGN1cnJlbnRseSB0byByZS1lbmFibGUgYXV0byBjdWxsaW5nLlxuICAgICAqIElmIHlvdXIgZ2FtZSBoYXZlIG1vcmUgZHluYW1pYyBvYmplY3RzLCB3ZSBzdWdnZXN0IHRvIGRpc2FibGUgYXV0byBjdWxsaW5nLlxuICAgICAqIElmIHlvdXIgZ2FtZSBoYXZlIG1vcmUgc3RhdGljIG9iamVjdHMsIHdlIHN1Z2dlc3QgdG8gZW5hYmxlIGF1dG8gY3VsbGluZy5cbiAgICAgKiAhI3poXG4gICAgICog5piv5ZCm5byA5ZCv6Ieq5Yqo6KOB5YeP5Yqf6IO977yM5byA5ZCv6KOB5YeP5Yqf6IO95bCG5Lya5oqK5Zyo5bGP5bmV5aSW55qE54mp5L2T5LuO5riy5p+T6Zif5YiX5Lit5Y676Zmk5o6J44CCXG4gICAgICog6L+Z5Liq5Yqf6IO95ZyoIHYyLjAg55qE5paw5riy5p+T5Zmo5Lit6KKr56e76Zmk5LqG77yM5Zug5Li65a6D5Zyo5aSn5aSa5pWw5ri45oiP5Lit5omA5bim5p2l55qE5o2f6ICX6KaB6auY5LqO5oCn6IO955qE5o+Q5Y2H77yM55uu5YmN5oiR5Lus5rKh5pyJ6K6h5YiS6YeN5paw5pSv5oyB6Ieq5Yqo6KOB5Ymq44CCXG4gICAgICog5aaC5p6c5ri45oiP5Lit55qE5Yqo5oCB54mp5L2T5q+U6L6D5aSa55qE6K+d77yM5bu66K6u5bCG5q2k6YCJ6aG55YWz6Zet44CCXG4gICAgICog5aaC5p6c5ri45oiP5Lit55qE6Z2Z5oCB54mp5L2T5q+U6L6D5aSa55qE6K+d77yM5bu66K6u5bCG5q2k6YCJ6aG55omT5byA44CCXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBFTkFCTEVfQ1VMTElOR1xuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAqL1xuICAgIEVOQUJMRV9DVUxMSU5HOiBmYWxzZSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBXaGV0aGVyIHRvIGNsZWFyIHRoZSBvcmlnaW5hbCBpbWFnZSBjYWNoZSBhZnRlciB1cGxvYWRlZCBhIHRleHR1cmUgdG8gR1BVLiBJZiBjbGVhcmVkLCBbRHluYW1pYyBBdGxhc10oaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9hZHZhbmNlZC10b3BpY3MvZHluYW1pYy1hdGxhcy5odG1sKSB3aWxsIG5vdCBiZSBzdXBwb3J0ZWQuXG4gICAgICogTm9ybWFsbHkgeW91IGRvbid0IG5lZWQgdG8gZW5hYmxlIHRoaXMgb3B0aW9uIG9uIHRoZSB3ZWIgcGxhdGZvcm0sIGJlY2F1c2UgSW1hZ2Ugb2JqZWN0IGRvZXNuJ3QgY29uc3VtZSB0b28gbXVjaCBtZW1vcnkuXG4gICAgICogQnV0IG9uIFdlQ2hhdCBHYW1lIHBsYXRmb3JtLCB0aGUgY3VycmVudCB2ZXJzaW9uIGNhY2hlIGRlY29kZWQgZGF0YSBpbiBJbWFnZSBvYmplY3QsIHdoaWNoIGhhcyBoaWdoIG1lbW9yeSB1c2FnZS5cbiAgICAgKiBTbyB3ZSBlbmFibGVkIHRoaXMgb3B0aW9uIGJ5IGRlZmF1bHQgb24gV2VDaGF0LCBzbyB0aGF0IHdlIGNhbiByZWxlYXNlIEltYWdlIGNhY2hlIGltbWVkaWF0ZWx5IGFmdGVyIHVwbG9hZGVkIHRvIEdQVS5cbiAgICAgKiAhI3poXG4gICAgICog5piv5ZCm5Zyo5bCG6LS05Zu+5LiK5Lyg6IezIEdQVSDkuYvlkI7liKDpmaTljp/lp4vlm77niYfnvJPlrZjvvIzliKDpmaTkuYvlkI7lm77niYflsIbml6Dms5Xov5vooYwgW+WKqOaAgeWQiOWbvl0oaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC96aC9hZHZhbmNlZC10b3BpY3MvZHluYW1pYy1hdGxhcy5odG1sKeOAglxuICAgICAqIOWcqCBXZWIg5bmz5Y+w77yM5L2g6YCa5bi45LiN6ZyA6KaB5byA5ZCv6L+Z5Liq6YCJ6aG577yM5Zug5Li65ZyoIFdlYiDlubPlj7AgSW1hZ2Ug5a+56LGh5omA5Y2g55So55qE5YaF5a2Y5b6I5bCP44CCXG4gICAgICog5L2G5piv5Zyo5b6u5L+h5bCP5ri45oiP5bmz5Y+w55qE5b2T5YmN54mI5pys77yMSW1hZ2Ug5a+56LGh5Lya57yT5a2Y6Kej56CB5ZCO55qE5Zu+54mH5pWw5o2u77yM5a6D5omA5Y2g55So55qE5YaF5a2Y56m66Ze05b6I5aSn44CCXG4gICAgICog5omA5Lul5oiR5Lus5Zyo5b6u5L+h5bmz5Y+w6buY6K6k5byA5ZCv5LqG6L+Z5Liq6YCJ6aG577yM6L+Z5qC35oiR5Lus5bCx5Y+v5Lul5Zyo5LiK5LygIEdMIOi0tOWbvuS5i+WQjueri+WNs+mHiuaUviBJbWFnZSDlr7nosaHnmoTlhoXlrZjvvIzpgb/lhY3ov4fpq5jnmoTlhoXlrZjljaDnlKjjgIJcbiAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IENMRUFOVVBfSU1BR0VfQ0FDSEVcbiAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAqL1xuICAgIENMRUFOVVBfSU1BR0VfQ0FDSEU6IGZhbHNlLFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFdoZXRoZXIgb3Igbm90IHNob3cgbWVzaCB3aXJlIGZyYW1lLlxuICAgICAqICEjemhcbiAgICAgKiDmmK/lkKbmmL7npLrnvZHmoLznmoTnur/moYbjgIJcbiAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IFNIT1dfTUVTSF9XSVJFRlJBTUVcbiAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAqL1xuICAgIFNIT1dfTUVTSF9XSVJFRlJBTUU6IGZhbHNlLFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFdoZXRoZXIgb3Igbm90IHNob3cgbWVzaCBub3JtYWwuXG4gICAgICogISN6aFxuICAgICAqIOaYr+WQpuaYvuekuue9keagvOeahOazlee6v+OAglxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gU0hPV19NRVNIX05PUk1BTFxuICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgU0hPV19NRVNIX05PUk1BTDogZmFsc2UsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogV2hldGhlciB0byBlbmFibGUgbXVsdGktdG91Y2guXG4gICAgICogISN6aFxuICAgICAqIOaYr+WQpuW8gOWQr+WkmueCueinpuaRuFxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gRU5BQkxFX01VTFRJX1RPVUNIXG4gICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAqL1xuICAgIEVOQUJMRV9NVUxUSV9UT1VDSDogdHJ1ZSxcblxuICAgIC8qKlxuICAgICAqIFJlZmVyZW5jZXM6IFxuICAgICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9JbWFnZUJpdG1hcFxuICAgICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XaW5kb3dPcldvcmtlckdsb2JhbFNjb3BlL2NyZWF0ZUltYWdlQml0bWFwXG4gICAgICogXG4gICAgICogISNlblxuICAgICAqIFdoZXRoZXIgdG8gdXNlIGltYWdlIGJpdG1hcCBmaXJzdC4gSWYgZW5hYmxlZCwgbWVtb3J5IHVzYWdlIHdpbGwgaW5jcmVhc2UuXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOaYr+WQpuS8mOWFiOS9v+eUqCBpbWFnZSBiaXRtYXDvvIzlkK/nlKjkuYvlkI7vvIzlhoXlrZjljaDnlKjkvJrlj5jpq5hcbiAgICAgKiBcbiAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IEFMTE9XX0lNQUdFX0JJVE1BUFxuICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgKi9cbiAgICBBTExPV19JTUFHRV9CSVRNQVA6ICFjYy5zeXMuaXNNb2JpbGUsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogV2hldGhlciB0byB1c2UgbmF0aXZlIFRURiByZW5kZXJlciB3aGljaCBpcyBmYXN0ZXIgYnV0IGxheW91dCBzbGlnaHRseSBkaWZmZXJlbnQuXG4gICAgICogXG4gICAgICogISN6aFxuICAgICAqIOaYr+WQpuS9v+eUqOWOn+eUn+eahOaWh+acrOa4suafk+acuuWItiwg5biD5bGA5ZKM57yW6L6R5Zmo5pyJ5beu5byCLlxuICAgICAqIFxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gRU5BQkxFX05BVElWRV9UVEZfUkVOREVSRVJcbiAgICAgKiBAZGVmYXVsdCB0cnVlXG4gICAgICovXG4gICAgRU5BQkxFX05BVElWRV9UVEZfUkVOREVSRVI6IHRydWVcblxufTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGNjLm1hY3JvLCAnUk9UQVRFX0FDVElPTl9DQ1cnLCB7XG4gICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICBpZiAoY2MuUm90YXRlVG8gJiYgY2MuUm90YXRlQnkpIHtcbiAgICAgICAgICAgIGNjLlJvdGF0ZVRvLl9yZXZlcnNlID0gY2MuUm90YXRlQnkuX3JldmVyc2UgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5sZXQgU1VQUE9SVF9URVhUVVJFX0ZPUk1BVFMgPSBbJy5wa20nLCAnLnB2cicsICcud2VicCcsICcuanBnJywgJy5qcGVnJywgJy5ibXAnLCAnLnBuZyddO1xuXG4vKipcbiAqICEjZW5cbiAqIFRoZSBpbWFnZSBmb3JtYXQgc3VwcG9ydGVkIGJ5IHRoZSBlbmdpbmUgZGVmYXVsdHMsIGFuZCB0aGUgc3VwcG9ydGVkIGZvcm1hdHMgbWF5IGRpZmZlciBpbiBkaWZmZXJlbnQgYnVpbGQgcGxhdGZvcm1zIGFuZCBkZXZpY2UgdHlwZXMuXG4gKiBDdXJyZW50bHkgYWxsIHBsYXRmb3JtIGFuZCBkZXZpY2Ugc3VwcG9ydCBbJy53ZWJwJywgJy5qcGcnLCAnLmpwZWcnLCAnLmJtcCcsICcucG5nJ10sIFRoZSBpT1MgbW9iaWxlIHBsYXRmb3JtIGFsc28gc3VwcG9ydHMgdGhlIFBWUiBmb3JtYXTjgIJcbiAqICEjemhcbiAqIOW8leaTjum7mOiupOaUr+aMgeeahOWbvueJh+agvOW8j++8jOaUr+aMgeeahOagvOW8j+WPr+iDveWcqOS4jeWQjOeahOaehOW7uuW5s+WPsOWSjOiuvuWkh+exu+Wei+S4iuacieaJgOW3ruWIq+OAglxuICog55uu5YmN5omA5pyJ5bmz5Y+w5ZKM6K6+5aSH5pSv5oyB55qE5qC85byP5pyJIFsnLndlYnAnLCAnLmpwZycsICcuanBlZycsICcuYm1wJywgJy5wbmcnXS4g5Y+m5aSWIElvcyDmiYvmnLrlubPlj7Dov5jpop3lpJbmlK/mjIHkuoYgUFZSIOagvOW8j+OAglxuICogQHByb3BlcnR5IHtTdHJpbmdbXX0gU1VQUE9SVF9URVhUVVJFX0ZPUk1BVFNcbiAqL1xuY2MubWFjcm8uU1VQUE9SVF9URVhUVVJFX0ZPUk1BVFMgPSBTVVBQT1JUX1RFWFRVUkVfRk9STUFUUztcblxuXG4vKipcbiAqICEjZW4gS2V5IG1hcCBmb3Iga2V5Ym9hcmQgZXZlbnRcbiAqICEjemgg6ZSu55uY5LqL5Lu255qE5oyJ6ZSu5YC8XG4gKiBAZW51bSBtYWNyby5LRVlcbiAqIEBleGFtcGxlIHtAbGluayBjb2NvczJkL2NvcmUvcGxhdGZvcm0vQ0NDb21tb24vS0VZLmpzfVxuICovXG5jYy5tYWNyby5LRVkgPSB7XG4gICAgLyoqXG4gICAgICogISNlbiBOb25lXG4gICAgICogISN6aCDmsqHmnInliIbphY1cbiAgICAgKiBAcHJvcGVydHkgbm9uZVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgbm9uZTowLFxuXG4gICAgLy8gYW5kcm9pZFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGJhY2sga2V5XG4gICAgICogISN6aCDov5Tlm57plK5cbiAgICAgKiBAcHJvcGVydHkgYmFja1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgYmFjazo2LFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG1lbnUga2V5XG4gICAgICogISN6aCDoj5zljZXplK5cbiAgICAgKiBAcHJvcGVydHkgbWVudVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgbWVudToxOCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGJhY2tzcGFjZSBrZXlcbiAgICAgKiAhI3poIOmAgOagvOmUrlxuICAgICAqIEBwcm9wZXJ0eSBiYWNrc3BhY2VcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGJhY2tzcGFjZTo4LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgdGFiIGtleVxuICAgICAqICEjemggVGFiIOmUrlxuICAgICAqIEBwcm9wZXJ0eSB0YWJcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRhYjo5LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZW50ZXIga2V5XG4gICAgICogISN6aCDlm57ovabplK5cbiAgICAgKiBAcHJvcGVydHkgZW50ZXJcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGVudGVyOjEzLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgc2hpZnQga2V5XG4gICAgICogISN6aCBTaGlmdCDplK5cbiAgICAgKiBAcHJvcGVydHkgc2hpZnRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHNoaWZ0OjE2LCAvL3Nob3VsZCB1c2Ugc2hpZnRrZXkgaW5zdGVhZFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgY3RybCBrZXlcbiAgICAgKiAhI3poIEN0cmwg6ZSuXG4gICAgICogQHByb3BlcnR5IGN0cmxcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGN0cmw6MTcsIC8vc2hvdWxkIHVzZSBjdHJsa2V5XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBhbHQga2V5XG4gICAgICogISN6aCBBbHQg6ZSuXG4gICAgICogQHByb3BlcnR5IGFsdFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgYWx0OjE4LCAvL3Nob3VsZCB1c2UgYWx0a2V5XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBwYXVzZSBrZXlcbiAgICAgKiAhI3poIOaaguWBnOmUrlxuICAgICAqIEBwcm9wZXJ0eSBwYXVzZVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgcGF1c2U6MTksXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBjYXBzIGxvY2sga2V5XG4gICAgICogISN6aCDlpKflhpnplIHlrprplK5cbiAgICAgKiBAcHJvcGVydHkgY2Fwc2xvY2tcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGNhcHNsb2NrOjIwLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZXNjIGtleVxuICAgICAqICEjemggRVNDIOmUrlxuICAgICAqIEBwcm9wZXJ0eSBlc2NhcGVcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGVzY2FwZToyNyxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHNwYWNlIGtleVxuICAgICAqICEjemgg56m65qC86ZSuXG4gICAgICogQHByb3BlcnR5IHNwYWNlXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBzcGFjZTozMixcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHBhZ2UgdXAga2V5XG4gICAgICogISN6aCDlkJHkuIrnv7vpobXplK5cbiAgICAgKiBAcHJvcGVydHkgcGFnZXVwXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBwYWdldXA6MzMsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBwYWdlIGRvd24ga2V5XG4gICAgICogISN6aCDlkJHkuIvnv7vpobXplK5cbiAgICAgKiBAcHJvcGVydHkgcGFnZWRvd25cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHBhZ2Vkb3duOjM0LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZW5kIGtleVxuICAgICAqICEjemgg57uT5p2f6ZSuXG4gICAgICogQHByb3BlcnR5IGVuZFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgZW5kOjM1LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgaG9tZSBrZXlcbiAgICAgKiAhI3poIOS4u+iPnOWNlemUrlxuICAgICAqIEBwcm9wZXJ0eSBob21lXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBob21lOjM2LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbGVmdCBrZXlcbiAgICAgKiAhI3poIOWQkeW3pueureWktOmUrlxuICAgICAqIEBwcm9wZXJ0eSBsZWZ0XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBsZWZ0OjM3LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgdXAga2V5XG4gICAgICogISN6aCDlkJHkuIrnrq3lpLTplK5cbiAgICAgKiBAcHJvcGVydHkgdXBcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHVwOjM4LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgcmlnaHQga2V5XG4gICAgICogISN6aCDlkJHlj7Pnrq3lpLTplK5cbiAgICAgKiBAcHJvcGVydHkgcmlnaHRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHJpZ2h0OjM5LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZG93biBrZXlcbiAgICAgKiAhI3poIOWQkeS4i+eureWktOmUrlxuICAgICAqIEBwcm9wZXJ0eSBkb3duXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBkb3duOjQwLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgc2VsZWN0IGtleVxuICAgICAqICEjemggU2VsZWN0IOmUrlxuICAgICAqIEBwcm9wZXJ0eSBzZWxlY3RcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHNlbGVjdDo0MSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGluc2VydCBrZXlcbiAgICAgKiAhI3poIOaPkuWFpemUrlxuICAgICAqIEBwcm9wZXJ0eSBpbnNlcnRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGluc2VydDo0NSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIERlbGV0ZSBrZXlcbiAgICAgKiAhI3poIOWIoOmZpOmUrlxuICAgICAqIEBwcm9wZXJ0eSBEZWxldGVcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIERlbGV0ZTo0NixcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlICcwJyBrZXkgb24gdGhlIHRvcCBvZiB0aGUgYWxwaGFudW1lcmljIGtleWJvYXJkLlxuICAgICAqICEjemgg5a2X5q+N6ZSu55uY5LiK55qEIDAg6ZSuXG4gICAgICogQHByb3BlcnR5IDBcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIDA6NDgsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSAnMScga2V5IG9uIHRoZSB0b3Agb2YgdGhlIGFscGhhbnVtZXJpYyBrZXlib2FyZC5cbiAgICAgKiAhI3poIOWtl+avjemUruebmOS4iueahCAxIOmUrlxuICAgICAqIEBwcm9wZXJ0eSAxXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICAxOjQ5LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgJzInIGtleSBvbiB0aGUgdG9wIG9mIHRoZSBhbHBoYW51bWVyaWMga2V5Ym9hcmQuXG4gICAgICogISN6aCDlrZfmr43plK7nm5jkuIrnmoQgMiDplK5cbiAgICAgKiBAcHJvcGVydHkgMlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgMjo1MCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlICczJyBrZXkgb24gdGhlIHRvcCBvZiB0aGUgYWxwaGFudW1lcmljIGtleWJvYXJkLlxuICAgICAqICEjemgg5a2X5q+N6ZSu55uY5LiK55qEIDMg6ZSuXG4gICAgICogQHByb3BlcnR5IDNcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIDM6NTEsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSAnNCcga2V5IG9uIHRoZSB0b3Agb2YgdGhlIGFscGhhbnVtZXJpYyBrZXlib2FyZC5cbiAgICAgKiAhI3poIOWtl+avjemUruebmOS4iueahCA0IOmUrlxuICAgICAqIEBwcm9wZXJ0eSA0XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICA0OjUyLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgJzUnIGtleSBvbiB0aGUgdG9wIG9mIHRoZSBhbHBoYW51bWVyaWMga2V5Ym9hcmQuXG4gICAgICogISN6aCDlrZfmr43plK7nm5jkuIrnmoQgNSDplK5cbiAgICAgKiBAcHJvcGVydHkgNVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgNTo1MyxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlICc2JyBrZXkgb24gdGhlIHRvcCBvZiB0aGUgYWxwaGFudW1lcmljIGtleWJvYXJkLlxuICAgICAqICEjemgg5a2X5q+N6ZSu55uY5LiK55qEIDYg6ZSuXG4gICAgICogQHByb3BlcnR5IDZcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIDY6NTQsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSAnNycga2V5IG9uIHRoZSB0b3Agb2YgdGhlIGFscGhhbnVtZXJpYyBrZXlib2FyZC5cbiAgICAgKiAhI3poIOWtl+avjemUruebmOS4iueahCA3IOmUrlxuICAgICAqIEBwcm9wZXJ0eSA3XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICA3OjU1LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgJzgnIGtleSBvbiB0aGUgdG9wIG9mIHRoZSBhbHBoYW51bWVyaWMga2V5Ym9hcmQuXG4gICAgICogISN6aCDlrZfmr43plK7nm5jkuIrnmoQgOCDplK5cbiAgICAgKiBAcHJvcGVydHkgOFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgODo1NixcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlICc5JyBrZXkgb24gdGhlIHRvcCBvZiB0aGUgYWxwaGFudW1lcmljIGtleWJvYXJkLlxuICAgICAqICEjemgg5a2X5q+N6ZSu55uY5LiK55qEIDkg6ZSuXG4gICAgICogQHByb3BlcnR5IDlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIDk6NTcsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBhIGtleVxuICAgICAqICEjemggQSDplK5cbiAgICAgKiBAcHJvcGVydHkgYVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgYTo2NSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGIga2V5XG4gICAgICogISN6aCBCIOmUrlxuICAgICAqIEBwcm9wZXJ0eSBiXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBiOjY2LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgYyBrZXlcbiAgICAgKiAhI3poIEMg6ZSuXG4gICAgICogQHByb3BlcnR5IGNcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGM6NjcsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBkIGtleVxuICAgICAqICEjemggRCDplK5cbiAgICAgKiBAcHJvcGVydHkgZFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgZDo2OCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGUga2V5XG4gICAgICogISN6aCBFIOmUrlxuICAgICAqIEBwcm9wZXJ0eSBlXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBlOjY5LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZiBrZXlcbiAgICAgKiAhI3poIEYg6ZSuXG4gICAgICogQHByb3BlcnR5IGZcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGY6NzAsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBnIGtleVxuICAgICAqICEjemggRyDplK5cbiAgICAgKiBAcHJvcGVydHkgZ1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgZzo3MSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGgga2V5XG4gICAgICogISN6aCBIIOmUrlxuICAgICAqIEBwcm9wZXJ0eSBoXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBoOjcyLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgaSBrZXlcbiAgICAgKiAhI3poIEkg6ZSuXG4gICAgICogQHByb3BlcnR5IGlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGk6NzMsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBqIGtleVxuICAgICAqICEjemggSiDplK5cbiAgICAgKiBAcHJvcGVydHkgalxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgajo3NCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGsga2V5XG4gICAgICogISN6aCBLIOmUrlxuICAgICAqIEBwcm9wZXJ0eSBrXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBrOjc1LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbCBrZXlcbiAgICAgKiAhI3poIEwg6ZSuXG4gICAgICogQHByb3BlcnR5IGxcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGw6NzYsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBtIGtleVxuICAgICAqICEjemggTSDplK5cbiAgICAgKiBAcHJvcGVydHkgbVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgbTo3NyxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG4ga2V5XG4gICAgICogISN6aCBOIOmUrlxuICAgICAqIEBwcm9wZXJ0eSBuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBuOjc4LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbyBrZXlcbiAgICAgKiAhI3poIE8g6ZSuXG4gICAgICogQHByb3BlcnR5IG9cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIG86NzksXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBwIGtleVxuICAgICAqICEjemggUCDplK5cbiAgICAgKiBAcHJvcGVydHkgcFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgcDo4MCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHEga2V5XG4gICAgICogISN6aCBRIOmUrlxuICAgICAqIEBwcm9wZXJ0eSBxXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBxOjgxLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgciBrZXlcbiAgICAgKiAhI3poIFIg6ZSuXG4gICAgICogQHByb3BlcnR5IHJcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHI6ODIsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBzIGtleVxuICAgICAqICEjemggUyDplK5cbiAgICAgKiBAcHJvcGVydHkgc1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgczo4MyxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHQga2V5XG4gICAgICogISN6aCBUIOmUrlxuICAgICAqIEBwcm9wZXJ0eSB0XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0Ojg0LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgdSBrZXlcbiAgICAgKiAhI3poIFUg6ZSuXG4gICAgICogQHByb3BlcnR5IHVcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHU6ODUsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSB2IGtleVxuICAgICAqICEjemggViDplK5cbiAgICAgKiBAcHJvcGVydHkgdlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdjo4NixcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHcga2V5XG4gICAgICogISN6aCBXIOmUrlxuICAgICAqIEBwcm9wZXJ0eSB3XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB3Ojg3LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgeCBrZXlcbiAgICAgKiAhI3poIFgg6ZSuXG4gICAgICogQHByb3BlcnR5IHhcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHg6ODgsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSB5IGtleVxuICAgICAqICEjemggWSDplK5cbiAgICAgKiBAcHJvcGVydHkgeVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgeTo4OSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHoga2V5XG4gICAgICogISN6aCBaIOmUrlxuICAgICAqIEBwcm9wZXJ0eSB6XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB6OjkwLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbnVtZXJpYyBrZXlwYWQgMFxuICAgICAqICEjemgg5pWw5a2X6ZSu55uYIDBcbiAgICAgKiBAcHJvcGVydHkgbnVtMFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgbnVtMDo5NixcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG51bWVyaWMga2V5cGFkIDFcbiAgICAgKiAhI3poIOaVsOWtl+mUruebmCAxXG4gICAgICogQHByb3BlcnR5IG51bTFcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIG51bTE6OTcsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBudW1lcmljIGtleXBhZCAyXG4gICAgICogISN6aCDmlbDlrZfplK7nm5ggMlxuICAgICAqIEBwcm9wZXJ0eSBudW0yXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBudW0yOjk4LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbnVtZXJpYyBrZXlwYWQgM1xuICAgICAqICEjemgg5pWw5a2X6ZSu55uYIDNcbiAgICAgKiBAcHJvcGVydHkgbnVtM1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgbnVtMzo5OSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG51bWVyaWMga2V5cGFkIDRcbiAgICAgKiAhI3poIOaVsOWtl+mUruebmCA0XG4gICAgICogQHByb3BlcnR5IG51bTRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIG51bTQ6MTAwLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbnVtZXJpYyBrZXlwYWQgNVxuICAgICAqICEjemgg5pWw5a2X6ZSu55uYIDVcbiAgICAgKiBAcHJvcGVydHkgbnVtNVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgbnVtNToxMDEsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBudW1lcmljIGtleXBhZCA2XG4gICAgICogISN6aCDmlbDlrZfplK7nm5ggNlxuICAgICAqIEBwcm9wZXJ0eSBudW02XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBudW02OjEwMixcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG51bWVyaWMga2V5cGFkIDdcbiAgICAgKiAhI3poIOaVsOWtl+mUruebmCA3XG4gICAgICogQHByb3BlcnR5IG51bTdcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIG51bTc6MTAzLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbnVtZXJpYyBrZXlwYWQgOFxuICAgICAqICEjemgg5pWw5a2X6ZSu55uYIDhcbiAgICAgKiBAcHJvcGVydHkgbnVtOFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgbnVtODoxMDQsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBudW1lcmljIGtleXBhZCA5XG4gICAgICogISN6aCDmlbDlrZfplK7nm5ggOVxuICAgICAqIEBwcm9wZXJ0eSBudW05XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBudW05OjEwNSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG51bWVyaWMga2V5cGFkICcqJ1xuICAgICAqICEjemgg5pWw5a2X6ZSu55uYICpcbiAgICAgKiBAcHJvcGVydHkgKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgJyonOjEwNixcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG51bWVyaWMga2V5cGFkICcrJ1xuICAgICAqICEjemgg5pWw5a2X6ZSu55uYICtcbiAgICAgKiBAcHJvcGVydHkgK1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgJysnOjEwNyxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG51bWVyaWMga2V5cGFkICctJ1xuICAgICAqICEjemgg5pWw5a2X6ZSu55uYIC1cbiAgICAgKiBAcHJvcGVydHkgLVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgJy0nOjEwOSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG51bWVyaWMga2V5cGFkICdkZWxldGUnXG4gICAgICogISN6aCDmlbDlrZfplK7nm5jliKDpmaTplK5cbiAgICAgKiBAcHJvcGVydHkgbnVtZGVsXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICAnbnVtZGVsJzoxMTAsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBudW1lcmljIGtleXBhZCAnLydcbiAgICAgKiAhI3poIOaVsOWtl+mUruebmCAvXG4gICAgICogQHByb3BlcnR5IC9cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgICcvJzoxMTEsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBGMSBmdW5jdGlvbiBrZXlcbiAgICAgKiAhI3poIEYxIOWKn+iDvemUrlxuICAgICAqIEBwcm9wZXJ0eSBmMVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgZjE6MTEyLCAvL2YxLWYxMiBkb250IHdvcmsgb24gaWVcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIEYyIGZ1bmN0aW9uIGtleVxuICAgICAqICEjemggRjIg5Yqf6IO96ZSuXG4gICAgICogQHByb3BlcnR5IGYyXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBmMjoxMTMsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBGMyBmdW5jdGlvbiBrZXlcbiAgICAgKiAhI3poIEYzIOWKn+iDvemUrlxuICAgICAqIEBwcm9wZXJ0eSBmM1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgZjM6MTE0LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgRjQgZnVuY3Rpb24ga2V5XG4gICAgICogISN6aCBGNCDlip/og73plK5cbiAgICAgKiBAcHJvcGVydHkgZjRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGY0OjExNSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIEY1IGZ1bmN0aW9uIGtleVxuICAgICAqICEjemggRjUg5Yqf6IO96ZSuXG4gICAgICogQHByb3BlcnR5IGY1XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBmNToxMTYsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBGNiBmdW5jdGlvbiBrZXlcbiAgICAgKiAhI3poIEY2IOWKn+iDvemUrlxuICAgICAqIEBwcm9wZXJ0eSBmNlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgZjY6MTE3LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgRjcgZnVuY3Rpb24ga2V5XG4gICAgICogISN6aCBGNyDlip/og73plK5cbiAgICAgKiBAcHJvcGVydHkgZjdcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGY3OjExOCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIEY4IGZ1bmN0aW9uIGtleVxuICAgICAqICEjemggRjgg5Yqf6IO96ZSuXG4gICAgICogQHByb3BlcnR5IGY4XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBmODoxMTksXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBGOSBmdW5jdGlvbiBrZXlcbiAgICAgKiAhI3poIEY5IOWKn+iDvemUrlxuICAgICAqIEBwcm9wZXJ0eSBmOVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgZjk6MTIwLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgRjEwIGZ1bmN0aW9uIGtleVxuICAgICAqICEjemggRjEwIOWKn+iDvemUrlxuICAgICAqIEBwcm9wZXJ0eSBmMTBcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGYxMDoxMjEsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBGMTEgZnVuY3Rpb24ga2V5XG4gICAgICogISN6aCBGMTEg5Yqf6IO96ZSuXG4gICAgICogQHByb3BlcnR5IGYxMVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgZjExOjEyMixcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIEYxMiBmdW5jdGlvbiBrZXlcbiAgICAgKiAhI3poIEYxMiDlip/og73plK5cbiAgICAgKiBAcHJvcGVydHkgZjEyXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBmMTI6MTIzLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbnVtbG9jayBrZXlcbiAgICAgKiAhI3poIOaVsOWtl+mUgeWumumUrlxuICAgICAqIEBwcm9wZXJ0eSBudW1sb2NrXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBudW1sb2NrOjE0NCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHNjcm9sbCBsb2NrIGtleVxuICAgICAqICEjemgg5rua5Yqo6ZSB5a6a6ZSuXG4gICAgICogQHByb3BlcnR5IHNjcm9sbGxvY2tcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHNjcm9sbGxvY2s6MTQ1LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgJzsnIGtleS5cbiAgICAgKiAhI3poIOWIhuWPt+mUrlxuICAgICAqIEBwcm9wZXJ0eSA7XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICAnOyc6MTg2LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgJzsnIGtleS5cbiAgICAgKiAhI3poIOWIhuWPt+mUrlxuICAgICAqIEBwcm9wZXJ0eSBzZW1pY29sb25cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHNlbWljb2xvbjoxODYsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSAnPScga2V5LlxuICAgICAqICEjemgg562J5LqO5Y+36ZSuXG4gICAgICogQHByb3BlcnR5IGVxdWFsXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBlcXVhbDoxODcsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSAnPScga2V5LlxuICAgICAqICEjemgg562J5LqO5Y+36ZSuXG4gICAgICogQHByb3BlcnR5ID1cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgICc9JzoxODcsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSAnLCcga2V5LlxuICAgICAqICEjemgg6YCX5Y+36ZSuXG4gICAgICogQHByb3BlcnR5ICxcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgICcsJzoxODgsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSAnLCcga2V5LlxuICAgICAqICEjemgg6YCX5Y+36ZSuXG4gICAgICogQHByb3BlcnR5IGNvbW1hXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBjb21tYToxODgsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBkYXNoICctJyBrZXkuXG4gICAgICogISN6aCDkuK3liJLnur/plK5cbiAgICAgKiBAcHJvcGVydHkgZGFzaFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgZGFzaDoxODksXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSAnLicga2V5LlxuICAgICAqICEjemgg5Y+l5Y+36ZSuXG4gICAgICogQHByb3BlcnR5IC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgICcuJzoxOTAsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSAnLicga2V5XG4gICAgICogISN6aCDlj6Xlj7fplK5cbiAgICAgKiBAcHJvcGVydHkgcGVyaW9kXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBwZXJpb2Q6MTkwLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZm9yd2FyZCBzbGFzaCBrZXlcbiAgICAgKiAhI3poIOato+aWnOadoOmUrlxuICAgICAqIEBwcm9wZXJ0eSBmb3J3YXJkc2xhc2hcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGZvcndhcmRzbGFzaDoxOTEsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBncmF2ZSBrZXlcbiAgICAgKiAhI3poIOaMiemUriBgXG4gICAgICogQHByb3BlcnR5IGdyYXZlXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBncmF2ZToxOTIsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSAnWycga2V5XG4gICAgICogISN6aCDmjInplK4gW1xuICAgICAqIEBwcm9wZXJ0eSBbXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICAnWyc6MjE5LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgJ1snIGtleVxuICAgICAqICEjemgg5oyJ6ZSuIFtcbiAgICAgKiBAcHJvcGVydHkgb3BlbmJyYWNrZXRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIG9wZW5icmFja2V0OjIxOSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlICdcXCcga2V5XG4gICAgICogISN6aCDlj43mlpzmnaDplK5cbiAgICAgKiBAcHJvcGVydHkgYmFja3NsYXNoXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBiYWNrc2xhc2g6MjIwLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgJ10nIGtleVxuICAgICAqICEjemgg5oyJ6ZSuIF1cbiAgICAgKiBAcHJvcGVydHkgXVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgJ10nOjIyMSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlICddJyBrZXlcbiAgICAgKiAhI3poIOaMiemUriBdXG4gICAgICogQHByb3BlcnR5IGNsb3NlYnJhY2tldFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgY2xvc2VicmFja2V0OjIyMSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHF1b3RlIGtleVxuICAgICAqICEjemgg5Y2V5byV5Y+36ZSuXG4gICAgICogQHByb3BlcnR5IHF1b3RlXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBxdW90ZToyMjIsXG5cbiAgICAvLyBnYW1lcGFkIGNvbnRyb2xsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBkcGFkIGxlZnQga2V5XG4gICAgICogISN6aCDlr7zoiKrplK4g5ZCR5bemXG4gICAgICogQHByb3BlcnR5IGRwYWRMZWZ0XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBkcGFkTGVmdDoxMDAwLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZHBhZCByaWdodCBrZXlcbiAgICAgKiAhI3poIOWvvOiIqumUriDlkJHlj7NcbiAgICAgKiBAcHJvcGVydHkgZHBhZFJpZ2h0XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBkcGFkUmlnaHQ6MTAwMSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGRwYWQgdXAga2V5XG4gICAgICogISN6aCDlr7zoiKrplK4g5ZCR5LiKXG4gICAgICogQHByb3BlcnR5IGRwYWRVcFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgZHBhZFVwOjEwMDMsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBkcGFkIGRvd24ga2V5XG4gICAgICogISN6aCDlr7zoiKrplK4g5ZCR5LiLXG4gICAgICogQHByb3BlcnR5IGRwYWREb3duXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBkcGFkRG93bjoxMDA0LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZHBhZCBjZW50ZXIga2V5XG4gICAgICogISN6aCDlr7zoiKrplK4g56Gu5a6a6ZSuXG4gICAgICogQHByb3BlcnR5IGRwYWRDZW50ZXJcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGRwYWRDZW50ZXI6MTAwNVxufTtcblxuLyoqXG4gKiBJbWFnZSBmb3JtYXRzXG4gKiBAZW51bSBtYWNyby5JbWFnZUZvcm1hdFxuICovXG5jYy5tYWNyby5JbWFnZUZvcm1hdCA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqIEltYWdlIEZvcm1hdDpKUEdcbiAgICAgKiBAcHJvcGVydHkgSlBHXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBKUEc6IDAsXG4gICAgLyoqXG4gICAgICogSW1hZ2UgRm9ybWF0OlBOR1xuICAgICAqIEBwcm9wZXJ0eSBQTkdcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFBORzogMSxcbiAgICAvKipcbiAgICAgKiBJbWFnZSBGb3JtYXQ6VElGRlxuICAgICAqIEBwcm9wZXJ0eSBUSUZGXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBUSUZGOiAyLFxuICAgIC8qKlxuICAgICAqIEltYWdlIEZvcm1hdDpXRUJQXG4gICAgICogQHByb3BlcnR5IFdFQlBcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFdFQlA6IDMsXG4gICAgLyoqXG4gICAgICogSW1hZ2UgRm9ybWF0OlBWUlxuICAgICAqIEBwcm9wZXJ0eSBQVlJcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFBWUjogNCxcbiAgICAvKipcbiAgICAgKiBJbWFnZSBGb3JtYXQ6RVRDXG4gICAgICogQHByb3BlcnR5IEVUQ1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgRVRDOiA1LFxuICAgIC8qKlxuICAgICAqIEltYWdlIEZvcm1hdDpTM1RDXG4gICAgICogQHByb3BlcnR5IFMzVENcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFMzVEM6IDYsXG4gICAgLyoqXG4gICAgICogSW1hZ2UgRm9ybWF0OkFUSVRDXG4gICAgICogQHByb3BlcnR5IEFUSVRDXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBBVElUQzogNyxcbiAgICAvKipcbiAgICAgKiBJbWFnZSBGb3JtYXQ6VEdBXG4gICAgICogQHByb3BlcnR5IFRHQVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgVEdBOiA4LFxuICAgIC8qKlxuICAgICAqIEltYWdlIEZvcm1hdDpSQVdEQVRBXG4gICAgICogQHByb3BlcnR5IFJBV0RBVEFcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFJBV0RBVEE6IDksXG4gICAgLyoqXG4gICAgICogSW1hZ2UgRm9ybWF0OlVOS05PV05cbiAgICAgKiBAcHJvcGVydHkgVU5LTk9XTlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgVU5LTk9XTjogMTBcbn0pO1xuXG4vKipcbiAqICEjZW5cbiAqIEVudW0gZm9yIGJsZW5kIGZhY3RvclxuICogUmVmZXIgdG86IGh0dHA6Ly93d3cuYW5kZXJzcmlnZ2Vsc2VuLmRrL2dsYmxlbmRmdW5jLnBocFxuICogISN6aFxuICog5re35ZCI5Zug5a2QXG4gKiDlj6/lj4LogIM6IGh0dHA6Ly93d3cuYW5kZXJzcmlnZ2Vsc2VuLmRrL2dsYmxlbmRmdW5jLnBocFxuICogQGVudW0gbWFjcm8uQmxlbmRGYWN0b3JcbiAqL1xuY2MubWFjcm8uQmxlbmRGYWN0b3IgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIEFsbCB1c2VcbiAgICAgKiAhI3poIOWFqOmDqOS9v+eUqFxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBPTkVcbiAgICAgKi9cbiAgICBPTkU6ICAgICAgICAgICAgICAgICAgICAxLCAgLy9jYy5tYWNyby5PTkVcbiAgICAvKipcbiAgICAgKiAhI2VuIE5vdCBhbGxcbiAgICAgKiAhI3poIOWFqOmDqOS4jeeUqFxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBaRVJPXG4gICAgICovXG4gICAgWkVSTzogICAgICAgICAgICAgICAgICAgMCwgICAgICAvL2NjLlpFUk9cbiAgICAvKipcbiAgICAgKiAhI2VuIFVzaW5nIHRoZSBzb3VyY2UgYWxwaGFcbiAgICAgKiAhI3poIOS9v+eUqOa6kOminOiJsueahOmAj+aYjuW6plxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTUkNfQUxQSEFcbiAgICAgKi9cbiAgICBTUkNfQUxQSEE6ICAgICAgICAgICAgICAweDMwMiwgIC8vY2MuU1JDX0FMUEhBXG4gICAgLyoqXG4gICAgICogISNlbiBVc2luZyB0aGUgc291cmNlIGNvbG9yXG4gICAgICogISN6aCDkvb/nlKjmupDpopzoibJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU1JDX0NPTE9SXG4gICAgICovXG4gICAgU1JDX0NPTE9SOiAgICAgICAgICAgICAgMHgzMDAsICAvL2NjLlNSQ19DT0xPUlxuICAgIC8qKlxuICAgICAqICEjZW4gVXNpbmcgdGhlIHRhcmdldCBhbHBoYVxuICAgICAqICEjemgg5L2/55So55uu5qCH6aKc6Imy55qE6YCP5piO5bqmXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IERTVF9BTFBIQVxuICAgICAqL1xuICAgIERTVF9BTFBIQTogICAgICAgICAgICAgIDB4MzA0LCAgLy9jYy5EU1RfQUxQSEFcbiAgICAvKipcbiAgICAgKiAhI2VuIFVzaW5nIHRoZSB0YXJnZXQgY29sb3JcbiAgICAgKiAhI3poIOS9v+eUqOebruagh+minOiJslxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBEU1RfQ09MT1JcbiAgICAgKi9cbiAgICBEU1RfQ09MT1I6ICAgICAgICAgICAgICAweDMwNiwgIC8vY2MuRFNUX0NPTE9SXG4gICAgLyoqXG4gICAgICogISNlbiBNaW51cyB0aGUgc291cmNlIGFscGhhXG4gICAgICogISN6aCDlh4/ljrvmupDpopzoibLnmoTpgI/mmI7luqZcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gT05FX01JTlVTX1NSQ19BTFBIQVxuICAgICAqL1xuICAgIE9ORV9NSU5VU19TUkNfQUxQSEE6ICAgIDB4MzAzLCAgLy9jYy5PTkVfTUlOVVNfU1JDX0FMUEhBXG4gICAgLyoqXG4gICAgICogISNlbiBNaW51cyB0aGUgc291cmNlIGNvbG9yXG4gICAgICogISN6aCDlh4/ljrvmupDpopzoibJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gT05FX01JTlVTX1NSQ19DT0xPUlxuICAgICAqL1xuICAgIE9ORV9NSU5VU19TUkNfQ09MT1I6ICAgIDB4MzAxLCAgLy9jYy5PTkVfTUlOVVNfU1JDX0NPTE9SXG4gICAgLyoqXG4gICAgICogISNlbiBNaW51cyB0aGUgdGFyZ2V0IGFscGhhXG4gICAgICogISN6aCDlh4/ljrvnm67moIfpopzoibLnmoTpgI/mmI7luqZcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gT05FX01JTlVTX0RTVF9BTFBIQVxuICAgICAqL1xuICAgIE9ORV9NSU5VU19EU1RfQUxQSEE6ICAgIDB4MzA1LCAgLy9jYy5PTkVfTUlOVVNfRFNUX0FMUEhBXG4gICAgLyoqXG4gICAgICogISNlbiBNaW51cyB0aGUgdGFyZ2V0IGNvbG9yXG4gICAgICogISN6aCDlh4/ljrvnm67moIfpopzoibJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gT05FX01JTlVTX0RTVF9DT0xPUlxuICAgICAqL1xuICAgIE9ORV9NSU5VU19EU1RfQ09MT1I6ICAgIDB4MzA3LCAgLy9jYy5PTkVfTUlOVVNfRFNUX0NPTE9SXG59KTtcblxuLyoqXG4gKiBAZW51bSBtYWNyby5UZXh0QWxpZ25tZW50XG4gKi9cbmNjLm1hY3JvLlRleHRBbGlnbm1lbnQgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gTEVGVFxuICAgICAqL1xuICAgIExFRlQ6IDAsXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IENFTlRFUlxuICAgICAqL1xuICAgIENFTlRFUjogMSxcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUklHSFRcbiAgICAgKi9cbiAgICBSSUdIVDogMlxufSk7XG5cbi8qKlxuICogQGVudW0gVmVydGljYWxUZXh0QWxpZ25tZW50XG4gKi9cbmNjLm1hY3JvLlZlcnRpY2FsVGV4dEFsaWdubWVudCA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBUT1BcbiAgICAgKi9cbiAgICBUT1A6IDAsXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IENFTlRFUlxuICAgICAqL1xuICAgIENFTlRFUjogMSxcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gQk9UVE9NXG4gICAgICovXG4gICAgQk9UVE9NOiAyXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBjYy5tYWNybztcbiJdLCJzb3VyY2VSb290IjoiLyJ9