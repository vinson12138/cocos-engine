
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/index.js';
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
require('./CCComponent');

require('./CCComponentEventHandler');

require('./missing-script'); // In case subContextView modules are excluded


var SubContextView = require('./SubContextView');

if (!SubContextView) {
  SubContextView = cc.Class({
    name: 'cc.SubContextView',
    "extends": cc.Component
  });
  cc.SubContextView = cc.WXSubContextView = cc.SwanSubContextView = SubContextView;
}

var components = [require('./CCSprite'), require('./CCWidget'), require('./CCCanvas'), require('./CCAudioSource'), require('./CCAnimation'), require('./CCButton'), require('./CCLabel'), require('./CCProgressBar'), require('./CCMask'), require('./CCScrollBar'), require('./CCScrollView'), require('./CCPageViewIndicator'), require('./CCPageView'), require('./CCSlider'), require('./CCLayout'), require('./editbox/CCEditBox'), require('./CCLabelOutline'), require('./CCLabelShadow'), require('./CCRichText'), require('./CCToggleContainer'), require('./CCToggleGroup'), require('./CCToggle'), require('./CCBlockInputEvents'), require('./CCMotionStreak'), require('./CCSafeArea'), SubContextView];
module.exports = components;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvaW5kZXguanMiXSwibmFtZXMiOlsicmVxdWlyZSIsIlN1YkNvbnRleHRWaWV3IiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJDb21wb25lbnQiLCJXWFN1YkNvbnRleHRWaWV3IiwiU3dhblN1YkNvbnRleHRWaWV3IiwiY29tcG9uZW50cyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQSxPQUFPLENBQUMsZUFBRCxDQUFQOztBQUNBQSxPQUFPLENBQUMsMkJBQUQsQ0FBUDs7QUFDQUEsT0FBTyxDQUFDLGtCQUFELENBQVAsRUFFQTs7O0FBQ0EsSUFBSUMsY0FBYyxHQUFHRCxPQUFPLENBQUMsa0JBQUQsQ0FBNUI7O0FBQ0EsSUFBSSxDQUFDQyxjQUFMLEVBQXFCO0FBQ2pCQSxFQUFBQSxjQUFjLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ3RCQyxJQUFBQSxJQUFJLEVBQUUsbUJBRGdCO0FBRXRCLGVBQVNGLEVBQUUsQ0FBQ0c7QUFGVSxHQUFULENBQWpCO0FBSUFILEVBQUFBLEVBQUUsQ0FBQ0QsY0FBSCxHQUFvQkMsRUFBRSxDQUFDSSxnQkFBSCxHQUFzQkosRUFBRSxDQUFDSyxrQkFBSCxHQUF3Qk4sY0FBbEU7QUFDSDs7QUFFRCxJQUFJTyxVQUFVLEdBQUcsQ0FDYlIsT0FBTyxDQUFDLFlBQUQsQ0FETSxFQUViQSxPQUFPLENBQUMsWUFBRCxDQUZNLEVBR2JBLE9BQU8sQ0FBQyxZQUFELENBSE0sRUFJYkEsT0FBTyxDQUFDLGlCQUFELENBSk0sRUFLYkEsT0FBTyxDQUFDLGVBQUQsQ0FMTSxFQU1iQSxPQUFPLENBQUMsWUFBRCxDQU5NLEVBT2JBLE9BQU8sQ0FBQyxXQUFELENBUE0sRUFRYkEsT0FBTyxDQUFDLGlCQUFELENBUk0sRUFTYkEsT0FBTyxDQUFDLFVBQUQsQ0FUTSxFQVViQSxPQUFPLENBQUMsZUFBRCxDQVZNLEVBV2JBLE9BQU8sQ0FBQyxnQkFBRCxDQVhNLEVBWWJBLE9BQU8sQ0FBQyx1QkFBRCxDQVpNLEVBYWJBLE9BQU8sQ0FBQyxjQUFELENBYk0sRUFjYkEsT0FBTyxDQUFDLFlBQUQsQ0FkTSxFQWViQSxPQUFPLENBQUMsWUFBRCxDQWZNLEVBZ0JiQSxPQUFPLENBQUMscUJBQUQsQ0FoQk0sRUFpQmJBLE9BQU8sQ0FBQyxrQkFBRCxDQWpCTSxFQWtCYkEsT0FBTyxDQUFDLGlCQUFELENBbEJNLEVBbUJiQSxPQUFPLENBQUMsY0FBRCxDQW5CTSxFQW9CYkEsT0FBTyxDQUFDLHFCQUFELENBcEJNLEVBcUJiQSxPQUFPLENBQUMsaUJBQUQsQ0FyQk0sRUFzQmJBLE9BQU8sQ0FBQyxZQUFELENBdEJNLEVBdUJiQSxPQUFPLENBQUMsc0JBQUQsQ0F2Qk0sRUF3QmJBLE9BQU8sQ0FBQyxrQkFBRCxDQXhCTSxFQXlCYkEsT0FBTyxDQUFDLGNBQUQsQ0F6Qk0sRUEwQmJDLGNBMUJhLENBQWpCO0FBNkJBUSxNQUFNLENBQUNDLE9BQVAsR0FBaUJGLFVBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5yZXF1aXJlKCcuL0NDQ29tcG9uZW50Jyk7XG5yZXF1aXJlKCcuL0NDQ29tcG9uZW50RXZlbnRIYW5kbGVyJyk7XG5yZXF1aXJlKCcuL21pc3Npbmctc2NyaXB0Jyk7XG5cbi8vIEluIGNhc2Ugc3ViQ29udGV4dFZpZXcgbW9kdWxlcyBhcmUgZXhjbHVkZWRcbmxldCBTdWJDb250ZXh0VmlldyA9IHJlcXVpcmUoJy4vU3ViQ29udGV4dFZpZXcnKTtcbmlmICghU3ViQ29udGV4dFZpZXcpIHtcbiAgICBTdWJDb250ZXh0VmlldyA9IGNjLkNsYXNzKHtcbiAgICAgICAgbmFtZTogJ2NjLlN1YkNvbnRleHRWaWV3JyxcbiAgICAgICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIH0pO1xuICAgIGNjLlN1YkNvbnRleHRWaWV3ID0gY2MuV1hTdWJDb250ZXh0VmlldyA9IGNjLlN3YW5TdWJDb250ZXh0VmlldyA9IFN1YkNvbnRleHRWaWV3O1xufVxuXG52YXIgY29tcG9uZW50cyA9IFtcbiAgICByZXF1aXJlKCcuL0NDU3ByaXRlJyksXG4gICAgcmVxdWlyZSgnLi9DQ1dpZGdldCcpLFxuICAgIHJlcXVpcmUoJy4vQ0NDYW52YXMnKSxcbiAgICByZXF1aXJlKCcuL0NDQXVkaW9Tb3VyY2UnKSxcbiAgICByZXF1aXJlKCcuL0NDQW5pbWF0aW9uJyksXG4gICAgcmVxdWlyZSgnLi9DQ0J1dHRvbicpLFxuICAgIHJlcXVpcmUoJy4vQ0NMYWJlbCcpLFxuICAgIHJlcXVpcmUoJy4vQ0NQcm9ncmVzc0JhcicpLFxuICAgIHJlcXVpcmUoJy4vQ0NNYXNrJyksXG4gICAgcmVxdWlyZSgnLi9DQ1Njcm9sbEJhcicpLFxuICAgIHJlcXVpcmUoJy4vQ0NTY3JvbGxWaWV3JyksXG4gICAgcmVxdWlyZSgnLi9DQ1BhZ2VWaWV3SW5kaWNhdG9yJyksXG4gICAgcmVxdWlyZSgnLi9DQ1BhZ2VWaWV3JyksXG4gICAgcmVxdWlyZSgnLi9DQ1NsaWRlcicpLFxuICAgIHJlcXVpcmUoJy4vQ0NMYXlvdXQnKSxcbiAgICByZXF1aXJlKCcuL2VkaXRib3gvQ0NFZGl0Qm94JyksXG4gICAgcmVxdWlyZSgnLi9DQ0xhYmVsT3V0bGluZScpLFxuICAgIHJlcXVpcmUoJy4vQ0NMYWJlbFNoYWRvdycpLFxuICAgIHJlcXVpcmUoJy4vQ0NSaWNoVGV4dCcpLFxuICAgIHJlcXVpcmUoJy4vQ0NUb2dnbGVDb250YWluZXInKSxcbiAgICByZXF1aXJlKCcuL0NDVG9nZ2xlR3JvdXAnKSxcbiAgICByZXF1aXJlKCcuL0NDVG9nZ2xlJyksXG4gICAgcmVxdWlyZSgnLi9DQ0Jsb2NrSW5wdXRFdmVudHMnKSxcbiAgICByZXF1aXJlKCcuL0NDTW90aW9uU3RyZWFrJyksXG4gICAgcmVxdWlyZSgnLi9DQ1NhZmVBcmVhJyksXG4gICAgU3ViQ29udGV4dFZpZXcsXG5dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBvbmVudHM7Il0sInNvdXJjZVJvb3QiOiIvIn0=