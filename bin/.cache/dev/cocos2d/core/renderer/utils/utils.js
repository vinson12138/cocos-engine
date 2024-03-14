
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/utils/utils.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var dynamicAtlasManager = require('./dynamic-atlas/manager');

var WHITE = cc.Color.WHITE; // share data of bmfont

var shareLabelInfo = {
  fontAtlas: null,
  fontSize: 0,
  lineHeight: 0,
  hAlign: 0,
  vAlign: 0,
  hash: "",
  fontFamily: "",
  fontDesc: "Arial",
  color: WHITE,
  isOutlined: false,
  out: WHITE,
  margin: 0
};
module.exports = {
  deleteFromDynamicAtlas: function deleteFromDynamicAtlas(comp, frame) {
    if (frame && !CC_TEST) {
      if (frame._original && dynamicAtlasManager) {
        dynamicAtlasManager.deleteAtlasSpriteFrame(frame);

        frame._resetDynamicAtlasFrame();
      }
    }
  },
  getFontFamily: function getFontFamily(comp) {
    if (!comp.useSystemFont) {
      if (comp.font) {
        if (comp.font._nativeAsset) {
          return comp.font._nativeAsset;
        }

        cc.assetManager.postLoadNative(comp.font, function (err) {
          comp.isValid && comp.setVertsDirty();
        });
        return 'Arial';
      }

      return 'Arial';
    } else {
      return comp.fontFamily || 'Arial';
    }
  },
  shareLabelInfo: shareLabelInfo
};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9jb3JlL3JlbmRlcmVyL3V0aWxzL3V0aWxzLmpzIl0sIm5hbWVzIjpbImR5bmFtaWNBdGxhc01hbmFnZXIiLCJyZXF1aXJlIiwiV0hJVEUiLCJjYyIsIkNvbG9yIiwic2hhcmVMYWJlbEluZm8iLCJmb250QXRsYXMiLCJmb250U2l6ZSIsImxpbmVIZWlnaHQiLCJoQWxpZ24iLCJ2QWxpZ24iLCJoYXNoIiwiZm9udEZhbWlseSIsImZvbnREZXNjIiwiY29sb3IiLCJpc091dGxpbmVkIiwib3V0IiwibWFyZ2luIiwibW9kdWxlIiwiZXhwb3J0cyIsImRlbGV0ZUZyb21EeW5hbWljQXRsYXMiLCJjb21wIiwiZnJhbWUiLCJDQ19URVNUIiwiX29yaWdpbmFsIiwiZGVsZXRlQXRsYXNTcHJpdGVGcmFtZSIsIl9yZXNldER5bmFtaWNBdGxhc0ZyYW1lIiwiZ2V0Rm9udEZhbWlseSIsInVzZVN5c3RlbUZvbnQiLCJmb250IiwiX25hdGl2ZUFzc2V0IiwiYXNzZXRNYW5hZ2VyIiwicG9zdExvYWROYXRpdmUiLCJlcnIiLCJpc1ZhbGlkIiwic2V0VmVydHNEaXJ0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLElBQU1BLG1CQUFtQixHQUFHQyxPQUFPLENBQUMseUJBQUQsQ0FBbkM7O0FBQ0EsSUFBTUMsS0FBSyxHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBU0YsS0FBdkIsRUFFQTs7QUFDQSxJQUFJRyxjQUFjLEdBQUc7QUFDakJDLEVBQUFBLFNBQVMsRUFBRSxJQURNO0FBR2pCQyxFQUFBQSxRQUFRLEVBQUMsQ0FIUTtBQUlqQkMsRUFBQUEsVUFBVSxFQUFDLENBSk07QUFLakJDLEVBQUFBLE1BQU0sRUFBQyxDQUxVO0FBTWpCQyxFQUFBQSxNQUFNLEVBQUMsQ0FOVTtBQVFqQkMsRUFBQUEsSUFBSSxFQUFDLEVBUlk7QUFTakJDLEVBQUFBLFVBQVUsRUFBQyxFQVRNO0FBVWpCQyxFQUFBQSxRQUFRLEVBQUMsT0FWUTtBQVdqQkMsRUFBQUEsS0FBSyxFQUFDWixLQVhXO0FBWWpCYSxFQUFBQSxVQUFVLEVBQUMsS0FaTTtBQWFqQkMsRUFBQUEsR0FBRyxFQUFDZCxLQWJhO0FBY2pCZSxFQUFBQSxNQUFNLEVBQUM7QUFkVSxDQUFyQjtBQWlCQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBRWJDLEVBQUFBLHNCQUZhLGtDQUVXQyxJQUZYLEVBRWlCQyxLQUZqQixFQUV3QjtBQUNqQyxRQUFJQSxLQUFLLElBQUksQ0FBQ0MsT0FBZCxFQUF1QjtBQUNuQixVQUFJRCxLQUFLLENBQUNFLFNBQU4sSUFBbUJ4QixtQkFBdkIsRUFBNEM7QUFDeENBLFFBQUFBLG1CQUFtQixDQUFDeUIsc0JBQXBCLENBQTJDSCxLQUEzQzs7QUFDQUEsUUFBQUEsS0FBSyxDQUFDSSx1QkFBTjtBQUNIO0FBQ0o7QUFDSixHQVRZO0FBV2JDLEVBQUFBLGFBWGEseUJBV0VOLElBWEYsRUFXUTtBQUNqQixRQUFJLENBQUNBLElBQUksQ0FBQ08sYUFBVixFQUF5QjtBQUNyQixVQUFJUCxJQUFJLENBQUNRLElBQVQsRUFBZTtBQUNYLFlBQUlSLElBQUksQ0FBQ1EsSUFBTCxDQUFVQyxZQUFkLEVBQTRCO0FBQ3hCLGlCQUFPVCxJQUFJLENBQUNRLElBQUwsQ0FBVUMsWUFBakI7QUFDSDs7QUFDRDNCLFFBQUFBLEVBQUUsQ0FBQzRCLFlBQUgsQ0FBZ0JDLGNBQWhCLENBQStCWCxJQUFJLENBQUNRLElBQXBDLEVBQTBDLFVBQVVJLEdBQVYsRUFBZTtBQUNyRFosVUFBQUEsSUFBSSxDQUFDYSxPQUFMLElBQWdCYixJQUFJLENBQUNjLGFBQUwsRUFBaEI7QUFDSCxTQUZEO0FBR0EsZUFBTyxPQUFQO0FBQ0g7O0FBRUQsYUFBTyxPQUFQO0FBQ0gsS0FaRCxNQWFLO0FBQ0QsYUFBT2QsSUFBSSxDQUFDVCxVQUFMLElBQW1CLE9BQTFCO0FBQ0g7QUFDSixHQTVCWTtBQThCYlAsRUFBQUEsY0FBYyxFQUFFQTtBQTlCSCxDQUFqQiIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGR5bmFtaWNBdGxhc01hbmFnZXIgPSByZXF1aXJlKCcuL2R5bmFtaWMtYXRsYXMvbWFuYWdlcicpO1xuY29uc3QgV0hJVEUgPSBjYy5Db2xvci5XSElURTtcblxuLy8gc2hhcmUgZGF0YSBvZiBibWZvbnRcbmxldCBzaGFyZUxhYmVsSW5mbyA9IHtcbiAgICBmb250QXRsYXM6IG51bGwsXG4gICAgXG4gICAgZm9udFNpemU6MCxcbiAgICBsaW5lSGVpZ2h0OjAsXG4gICAgaEFsaWduOjAsXG4gICAgdkFsaWduOjAsXG5cbiAgICBoYXNoOlwiXCIsXG4gICAgZm9udEZhbWlseTpcIlwiLFxuICAgIGZvbnREZXNjOlwiQXJpYWxcIixcbiAgICBjb2xvcjpXSElURSxcbiAgICBpc091dGxpbmVkOmZhbHNlLFxuICAgIG91dDpXSElURSxcbiAgICBtYXJnaW46MCxcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBkZWxldGVGcm9tRHluYW1pY0F0bGFzIChjb21wLCBmcmFtZSkge1xuICAgICAgICBpZiAoZnJhbWUgJiYgIUNDX1RFU1QpIHtcbiAgICAgICAgICAgIGlmIChmcmFtZS5fb3JpZ2luYWwgJiYgZHluYW1pY0F0bGFzTWFuYWdlcikge1xuICAgICAgICAgICAgICAgIGR5bmFtaWNBdGxhc01hbmFnZXIuZGVsZXRlQXRsYXNTcHJpdGVGcmFtZShmcmFtZSk7XG4gICAgICAgICAgICAgICAgZnJhbWUuX3Jlc2V0RHluYW1pY0F0bGFzRnJhbWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBnZXRGb250RmFtaWx5IChjb21wKSB7XG4gICAgICAgIGlmICghY29tcC51c2VTeXN0ZW1Gb250KSB7XG4gICAgICAgICAgICBpZiAoY29tcC5mb250KSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXAuZm9udC5fbmF0aXZlQXNzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXAuZm9udC5fbmF0aXZlQXNzZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNjLmFzc2V0TWFuYWdlci5wb3N0TG9hZE5hdGl2ZShjb21wLmZvbnQsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcC5pc1ZhbGlkICYmIGNvbXAuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiAnQXJpYWwnO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgcmV0dXJuICdBcmlhbCc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gY29tcC5mb250RmFtaWx5IHx8ICdBcmlhbCc7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2hhcmVMYWJlbEluZm86IHNoYXJlTGFiZWxJbmZvXG59XG4iXSwic291cmNlUm9vdCI6Ii8ifQ==