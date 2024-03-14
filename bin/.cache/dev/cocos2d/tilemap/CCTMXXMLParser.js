
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/tilemap/CCTMXXMLParser.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}/****************************************************************************
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
'use strict';

var codec = require('../compression/ZipUtils');

var zlib = require('../compression/zlib.min');

var js = require('../core/platform/js');

require('../core/platform/CCSAXParser');

function uint8ArrayToUint32Array(uint8Arr) {
  if (uint8Arr.length % 4 !== 0) return null;
  var arrLen = uint8Arr.length / 4;
  var retArr = window.Uint32Array ? new Uint32Array(arrLen) : [];

  for (var i = 0; i < arrLen; i++) {
    var offset = i * 4;
    retArr[i] = uint8Arr[offset] + uint8Arr[offset + 1] * (1 << 8) + uint8Arr[offset + 2] * (1 << 16) + uint8Arr[offset + 3] * (1 << 24);
  }

  return retArr;
} // Bits on the far end of the 32-bit global tile ID (GID's) are used for tile flags

/**
 * cc.TMXLayerInfo contains the information about the layers like:
 * - Layer name
 * - Layer size
 * - Layer opacity at creation time (it can be modified at runtime)
 * - Whether the layer is visible (if it's not visible, then the CocosNode won't be created)
 * This information is obtained from the TMX file.
 * @class TMXLayerInfo
 */

/**
 * Properties of the layer info.
 * @property {Object} properties 
 */


cc.TMXLayerInfo = function () {
  this.properties = {};
  this.name = "";
  this._layerSize = null;
  this._tiles = [];
  this.visible = true;
  this._opacity = 0;
  this.ownTiles = true;
  this._minGID = 100000;
  this._maxGID = 0;
  this.offset = cc.v2(0, 0);
};

cc.TMXLayerInfo.prototype = {
  constructor: cc.TMXLayerInfo,

  /**
   * Gets the Properties.
   * @return {Object}
   */
  getProperties: function getProperties() {
    return this.properties;
  },

  /**
   * Set the Properties.
   * @param {object} value
   */
  setProperties: function setProperties(value) {
    this.properties = value;
  }
};
/**
 * cc.TMXImageLayerInfo contains the information about the image layers.
 * This information is obtained from the TMX file.
 * @class TMXImageLayerInfo
 */

cc.TMXImageLayerInfo = function () {
  this.name = "";
  this.visible = true;
  this.width = 0;
  this.height = 0;
  this.offset = cc.v2(0, 0);
  this._opacity = 0;
  this._trans = new cc.Color(255, 255, 255, 255);
  this.sourceImage = null;
};
/**
 * <p>cc.TMXObjectGroupInfo contains the information about the object group like:
 * - group name
 * - group size
 * - group opacity at creation time (it can be modified at runtime)
 * - Whether the group is visible
 *
 * This information is obtained from the TMX file.</p>
 * @class TMXObjectGroupInfo
 */

/**
 * Properties of the ObjectGroup info.
 * @property {Array} properties
 */


cc.TMXObjectGroupInfo = function () {
  this.properties = {};
  this.name = "";
  this._objects = [];
  this.visible = true;
  this._opacity = 0;
  this._color = new cc.Color(255, 255, 255, 255);
  this.offset = cc.v2(0, 0);
  this._draworder = 'topdown';
};

cc.TMXObjectGroupInfo.prototype = {
  constructor: cc.TMXObjectGroupInfo,

  /**
   * Gets the Properties.
   * @return {Array}
   */
  getProperties: function getProperties() {
    return this.properties;
  },

  /**
   * Set the Properties.
   * @param {object} value
   */
  setProperties: function setProperties(value) {
    this.properties = value;
  }
};
/**
 * <p>cc.TMXTilesetInfo contains the information about the tilesets like: <br />
 * - Tileset name<br />
 * - Tileset spacing<br />
 * - Tileset margin<br />
 * - size of the tiles<br />
 * - Image used for the tiles<br />
 * - Image size<br />
 *
 * This information is obtained from the TMX file. </p>
 * @class TMXTilesetInfo
 */

/**
 * Tileset name
 * @property {string} name
 */

/**
 * First grid
 * @property {number} firstGid 
 */

/**
 * Spacing
 * @property {number} spacing
 */

/**
 * Margin
 * @property {number} margin 
 */

/**
 * Texture containing the tiles (should be sprite sheet / texture atlas)
 * @property {any} sourceImage
 */

/**
 * Size in pixels of the image
 * @property {cc.Size} imageSize
 */

cc.TMXTilesetInfo = function () {
  // Tileset name
  this.name = ""; // First grid

  this.firstGid = 0; // Spacing

  this.spacing = 0; // Margin

  this.margin = 0; // Texture containing the tiles (should be sprite sheet / texture atlas)

  this.sourceImage = null; // Size in pixels of the image

  this.imageSize = cc.size(0, 0);
  this.tileOffset = cc.v2(0, 0);
  this._tileSize = cc.size(0, 0);
};

cc.TMXTilesetInfo.prototype = {
  constructor: cc.TMXTilesetInfo,

  /**
   * Return rect
   * @param {Number} gid
   * @return {Rect}
   */
  rectForGID: function rectForGID(gid, result) {
    var rect = result || cc.rect(0, 0, 0, 0);
    rect.width = this._tileSize.width;
    rect.height = this._tileSize.height;
    gid &= cc.TiledMap.TileFlag.FLIPPED_MASK;
    gid = gid - parseInt(this.firstGid, 10);
    var max_x = parseInt((this.imageSize.width - this.margin * 2 + this.spacing) / (this._tileSize.width + this.spacing), 10);
    rect.x = parseInt(gid % max_x * (this._tileSize.width + this.spacing) + this.margin, 10);
    rect.y = parseInt(parseInt(gid / max_x, 10) * (this._tileSize.height + this.spacing) + this.margin, 10);
    return rect;
  }
};

function strToHAlign(value) {
  var hAlign = cc.Label.HorizontalAlign;

  switch (value) {
    case 'center':
      return hAlign.CENTER;

    case 'right':
      return hAlign.RIGHT;

    default:
      return hAlign.LEFT;
  }
}

function strToVAlign(value) {
  var vAlign = cc.Label.VerticalAlign;

  switch (value) {
    case 'center':
      return vAlign.CENTER;

    case 'bottom':
      return vAlign.BOTTOM;

    default:
      return vAlign.TOP;
  }
}

function strToColor(value) {
  if (!value) {
    return cc.color(0, 0, 0, 255);
  }

  value = value.indexOf('#') !== -1 ? value.substring(1) : value;

  if (value.length === 8) {
    var a = parseInt(value.substr(0, 2), 16) || 255;
    var r = parseInt(value.substr(2, 2), 16) || 0;
    var g = parseInt(value.substr(4, 2), 16) || 0;
    var b = parseInt(value.substr(6, 2), 16) || 0;
    return cc.color(r, g, b, a);
  } else {
    var _r = parseInt(value.substr(0, 2), 16) || 0;

    var _g = parseInt(value.substr(2, 2), 16) || 0;

    var _b = parseInt(value.substr(4, 2), 16) || 0;

    return cc.color(_r, _g, _b, 255);
  }
}

function getPropertyList(node, map) {
  var res = [];
  var properties = node.getElementsByTagName("properties");

  for (var i = 0; i < properties.length; ++i) {
    var property = properties[i].getElementsByTagName("property");

    for (var j = 0; j < property.length; ++j) {
      res.push(property[j]);
    }
  }

  map = map || {};

  for (var _i = 0; _i < res.length; _i++) {
    var element = res[_i];
    var name = element.getAttribute('name');
    var type = element.getAttribute('type') || 'string';
    var value = element.getAttribute('value');

    if (type === 'int') {
      value = parseInt(value);
    } else if (type === 'float') {
      value = parseFloat(value);
    } else if (type === 'bool') {
      value = value === 'true';
    } else if (type === 'color') {
      value = strToColor(value);
    }

    map[name] = value;
  }

  return map;
}
/**
 * <p>cc.TMXMapInfo contains the information about the map like: <br/>
 *- Map orientation (hexagonal, isometric or orthogonal)<br/>
 *- Tile size<br/>
 *- Map size</p>
 *
 * <p>And it also contains: <br/>
 * - Layers (an array of TMXLayerInfo objects)<br/>
 * - Tilesets (an array of TMXTilesetInfo objects) <br/>
 * - ObjectGroups (an array of TMXObjectGroupInfo objects) </p>
 *
 * <p>This information is obtained from the TMX file. </p>
 * @class TMXMapInfo
 */

/**
 * Properties of the map info.
 * @property {Array}    properties          
 */

/**
 * Map orientation.
 * @property {Number}   orientation         
 */

/**
 * Parent element.
 * @property {Object}   parentElement       
 */

/**
 * Parent GID.
 * @property {Number}   parentGID           
 */

/**
 * Layer attributes.
 * @property {Object}   layerAttrs        
 */

/**
 * Is reading storing characters stream.
 * @property {Boolean}  storingCharacters   
 */

/**
 * Current string stored from characters stream.
 * @property {String}   currentString       
 */

/**
 * Width of the map
 * @property {Number}   mapWidth            
 */

/**
 * Height of the map
 * @property {Number}   mapHeight           
 */

/**
 * Width of a tile
 * @property {Number}   tileWidth           
 */

/** 
 * Height of a tile
 * @property {Number}   tileHeight          
 */

/**
 * @example
 * 1.
 * //create a TMXMapInfo with file name
 * let tmxMapInfo = new cc.TMXMapInfo("res/orthogonal-test1.tmx");
 * 2.
 * //create a TMXMapInfo with content string and resource path
 * let resources = "res/TileMaps";
 * let filePath = "res/TileMaps/orthogonal-test1.tmx";
 * let xmlStr = cc.resources.get(filePath);
 * let tmxMapInfo = new cc.TMXMapInfo(xmlStr, resources);
 */

/**
 * Creates a TMX Format with a tmx file or content string
 */


cc.TMXMapInfo = function (tmxFile, tsxMap, textures, textureSizes, imageLayerTextures) {
  this.properties = [];
  this.orientation = null;
  this.parentElement = null;
  this.parentGID = null;
  this.layerAttrs = 0;
  this.storingCharacters = false;
  this.currentString = null;
  this.renderOrder = cc.TiledMap.RenderOrder.RightDown;
  this._supportVersion = [1, 2, 0];
  this._parser = new cc.SAXParser();
  this._objectGroups = [];
  this._allChildren = [];
  this._mapSize = cc.size(0, 0);
  this._tileSize = cc.size(0, 0);
  this._layers = [];
  this._tilesets = [];
  this._imageLayers = [];
  this._tileProperties = {};
  this._tileAnimations = {};
  this._tsxMap = null; // map of textures indexed by name

  this._textures = null; // hex map values

  this._staggerAxis = null;
  this._staggerIndex = null;
  this._hexSideLength = 0;
  this._imageLayerTextures = null;
  this.initWithXML(tmxFile, tsxMap, textures, textureSizes, imageLayerTextures);
};

cc.TMXMapInfo.prototype = {
  constructor: cc.TMXMapInfo,

  /**
   * Gets Map orientation.
   * @return {Number}
   */
  getOrientation: function getOrientation() {
    return this.orientation;
  },

  /**
   * Set the Map orientation.
   * @param {Number} value
   */
  setOrientation: function setOrientation(value) {
    this.orientation = value;
  },

  /**
   * Gets the staggerAxis of map.
   * @return {cc.TiledMap.StaggerAxis}
   */
  getStaggerAxis: function getStaggerAxis() {
    return this._staggerAxis;
  },

  /**
   * Set the staggerAxis of map.
   * @param {cc.TiledMap.StaggerAxis} value
   */
  setStaggerAxis: function setStaggerAxis(value) {
    this._staggerAxis = value;
  },

  /**
   * Gets stagger index
   * @return {cc.TiledMap.StaggerIndex}
   */
  getStaggerIndex: function getStaggerIndex() {
    return this._staggerIndex;
  },

  /**
   * Set the stagger index.
   * @param {cc.TiledMap.StaggerIndex} value
   */
  setStaggerIndex: function setStaggerIndex(value) {
    this._staggerIndex = value;
  },

  /**
   * Gets Hex side length.
   * @return {Number}
   */
  getHexSideLength: function getHexSideLength() {
    return this._hexSideLength;
  },

  /**
   * Set the Hex side length.
   * @param {Number} value
   */
  setHexSideLength: function setHexSideLength(value) {
    this._hexSideLength = value;
  },

  /**
   * Map width & height
   * @return {Size}
   */
  getMapSize: function getMapSize() {
    return cc.size(this._mapSize.width, this._mapSize.height);
  },

  /**
   * Map width & height
   * @param {Size} value
   */
  setMapSize: function setMapSize(value) {
    this._mapSize.width = value.width;
    this._mapSize.height = value.height;
  },
  _getMapWidth: function _getMapWidth() {
    return this._mapSize.width;
  },
  _setMapWidth: function _setMapWidth(width) {
    this._mapSize.width = width;
  },
  _getMapHeight: function _getMapHeight() {
    return this._mapSize.height;
  },
  _setMapHeight: function _setMapHeight(height) {
    this._mapSize.height = height;
  },

  /**
   * Tiles width & height
   * @return {Size}
   */
  getTileSize: function getTileSize() {
    return cc.size(this._tileSize.width, this._tileSize.height);
  },

  /**
   * Tiles width & height
   * @param {Size} value
   */
  setTileSize: function setTileSize(value) {
    this._tileSize.width = value.width;
    this._tileSize.height = value.height;
  },
  _getTileWidth: function _getTileWidth() {
    return this._tileSize.width;
  },
  _setTileWidth: function _setTileWidth(width) {
    this._tileSize.width = width;
  },
  _getTileHeight: function _getTileHeight() {
    return this._tileSize.height;
  },
  _setTileHeight: function _setTileHeight(height) {
    this._tileSize.height = height;
  },

  /**
   * Layers
   * @return {Array}
   */
  getLayers: function getLayers() {
    return this._layers;
  },

  /**
   * Layers
   * @param {cc.TMXLayerInfo} value
   */
  setLayers: function setLayers(value) {
    this._allChildren.push(value);

    this._layers.push(value);
  },

  /**
   * ImageLayers
   * @return {Array}
   */
  getImageLayers: function getImageLayers() {
    return this._imageLayers;
  },

  /**
   * ImageLayers
   * @param {cc.TMXImageLayerInfo} value
   */
  setImageLayers: function setImageLayers(value) {
    this._allChildren.push(value);

    this._imageLayers.push(value);
  },

  /**
   * tilesets
   * @return {Array}
   */
  getTilesets: function getTilesets() {
    return this._tilesets;
  },

  /**
   * tilesets
   * @param {cc.TMXTilesetInfo} value
   */
  setTilesets: function setTilesets(value) {
    this._tilesets.push(value);
  },

  /**
   * ObjectGroups
   * @return {Array}
   */
  getObjectGroups: function getObjectGroups() {
    return this._objectGroups;
  },

  /**
   * ObjectGroups
   * @param {cc.TMXObjectGroup} value
   */
  setObjectGroups: function setObjectGroups(value) {
    this._allChildren.push(value);

    this._objectGroups.push(value);
  },
  getAllChildren: function getAllChildren() {
    return this._allChildren;
  },

  /**
   * parent element
   * @return {Object}
   */
  getParentElement: function getParentElement() {
    return this.parentElement;
  },

  /**
   * parent element
   * @param {Object} value
   */
  setParentElement: function setParentElement(value) {
    this.parentElement = value;
  },

  /**
   * parent GID
   * @return {Number}
   */
  getParentGID: function getParentGID() {
    return this.parentGID;
  },

  /**
   * parent GID
   * @param {Number} value
   */
  setParentGID: function setParentGID(value) {
    this.parentGID = value;
  },

  /**
   * Layer attribute
   * @return {Object}
   */
  getLayerAttribs: function getLayerAttribs() {
    return this.layerAttrs;
  },

  /**
   * Layer attribute
   * @param {Object} value
   */
  setLayerAttribs: function setLayerAttribs(value) {
    this.layerAttrs = value;
  },

  /**
   * Is reading storing characters stream
   * @return {Boolean}
   */
  getStoringCharacters: function getStoringCharacters() {
    return this.storingCharacters;
  },

  /**
   * Is reading storing characters stream
   * @param {Boolean} value
   */
  setStoringCharacters: function setStoringCharacters(value) {
    this.storingCharacters = value;
  },

  /**
   * Properties
   * @return {Array}
   */
  getProperties: function getProperties() {
    return this.properties;
  },

  /**
   * Properties
   * @param {object} value
   */
  setProperties: function setProperties(value) {
    this.properties = value;
  },

  /**
   * initializes a TMX format with an XML string and a TMX resource path
   * @param {String} tmxString
   * @param {Object} tsxMap
   * @param {Object} textures
   * @return {Boolean}
   */
  initWithXML: function initWithXML(tmxString, tsxMap, textures, textureSizes, imageLayerTextures) {
    this._tilesets.length = 0;
    this._layers.length = 0;
    this._imageLayers.length = 0;
    this._tsxMap = tsxMap;
    this._textures = textures;
    this._imageLayerTextures = imageLayerTextures;
    this._textureSizes = textureSizes;
    this._objectGroups.length = 0;
    this._allChildren.length = 0;
    this.properties.length = 0;
    this._tileProperties = {};
    this._tileAnimations = {}; // tmp vars

    this.currentString = "";
    this.storingCharacters = false;
    this.layerAttrs = cc.TMXLayerInfo.ATTRIB_NONE;
    this.parentElement = cc.TiledMap.NONE;
    return this.parseXMLString(tmxString);
  },

  /**
   * Initializes parsing of an XML string, either a tmx (Map) string or tsx (Tileset) string
   * @param {String} xmlString
   * @param {Number} tilesetFirstGid
   * @return {Element}
   */
  parseXMLString: function parseXMLString(xmlStr, tilesetFirstGid) {
    var mapXML = this._parser._parseXML(xmlStr);

    var i; // PARSE <map>

    var map = mapXML.documentElement;
    var orientationStr = map.getAttribute('orientation');
    var staggerAxisStr = map.getAttribute('staggeraxis');
    var staggerIndexStr = map.getAttribute('staggerindex');
    var hexSideLengthStr = map.getAttribute('hexsidelength');
    var renderorderStr = map.getAttribute('renderorder');
    var version = map.getAttribute('version') || '1.0.0';

    if (map.nodeName === "map") {
      var versionArr = version.split('.');
      var supportVersion = this._supportVersion;

      for (var _i2 = 0; _i2 < supportVersion.length; _i2++) {
        var v = parseInt(versionArr[_i2]) || 0;
        var sv = supportVersion[_i2];

        if (sv < v) {
          cc.logID(7216, version);
          break;
        }
      }

      if (orientationStr === "orthogonal") this.orientation = cc.TiledMap.Orientation.ORTHO;else if (orientationStr === "isometric") this.orientation = cc.TiledMap.Orientation.ISO;else if (orientationStr === "hexagonal") this.orientation = cc.TiledMap.Orientation.HEX;else if (orientationStr !== null) cc.logID(7217, orientationStr);

      if (renderorderStr === 'right-up') {
        this.renderOrder = cc.TiledMap.RenderOrder.RightUp;
      } else if (renderorderStr === 'left-up') {
        this.renderOrder = cc.TiledMap.RenderOrder.LeftUp;
      } else if (renderorderStr === 'left-down') {
        this.renderOrder = cc.TiledMap.RenderOrder.LeftDown;
      } else {
        this.renderOrder = cc.TiledMap.RenderOrder.RightDown;
      }

      if (staggerAxisStr === 'x') {
        this.setStaggerAxis(cc.TiledMap.StaggerAxis.STAGGERAXIS_X);
      } else if (staggerAxisStr === 'y') {
        this.setStaggerAxis(cc.TiledMap.StaggerAxis.STAGGERAXIS_Y);
      }

      if (staggerIndexStr === 'odd') {
        this.setStaggerIndex(cc.TiledMap.StaggerIndex.STAGGERINDEX_ODD);
      } else if (staggerIndexStr === 'even') {
        this.setStaggerIndex(cc.TiledMap.StaggerIndex.STAGGERINDEX_EVEN);
      }

      if (hexSideLengthStr) {
        this.setHexSideLength(parseFloat(hexSideLengthStr));
      }

      var mapSize = cc.size(0, 0);
      mapSize.width = parseFloat(map.getAttribute('width'));
      mapSize.height = parseFloat(map.getAttribute('height'));
      this.setMapSize(mapSize);
      mapSize = cc.size(0, 0);
      mapSize.width = parseFloat(map.getAttribute('tilewidth'));
      mapSize.height = parseFloat(map.getAttribute('tileheight'));
      this.setTileSize(mapSize); // The parent element is the map

      this.properties = getPropertyList(map);
    } // PARSE <tileset>


    var tilesets = map.getElementsByTagName('tileset');

    if (map.nodeName !== "map") {
      tilesets = [];
      tilesets.push(map);
    }

    for (i = 0; i < tilesets.length; i++) {
      var selTileset = tilesets[i]; // If this is an external tileset then start parsing that

      var tsxName = selTileset.getAttribute('source');

      if (tsxName) {
        var currentFirstGID = parseInt(selTileset.getAttribute('firstgid'));
        var tsxXmlString = this._tsxMap[tsxName];

        if (tsxXmlString) {
          this.parseXMLString(tsxXmlString, currentFirstGID);
        }
      } else {
        var images = selTileset.getElementsByTagName('image');
        var multiTextures = images.length > 1;
        var image = images[0];
        var firstImageName = image.getAttribute('source');
        firstImageName = firstImageName.replace(/\\/g, '\/');
        var tiles = selTileset.getElementsByTagName('tile');
        var tileCount = tiles && tiles.length || 1;
        var tile = null;
        var tilesetName = selTileset.getAttribute('name') || "";
        var tilesetSpacing = parseInt(selTileset.getAttribute('spacing')) || 0;
        var tilesetMargin = parseInt(selTileset.getAttribute('margin')) || 0;
        var fgid = parseInt(tilesetFirstGid);

        if (!fgid) {
          fgid = parseInt(selTileset.getAttribute('firstgid')) || 0;
        }

        var tilesetSize = cc.size(0, 0);
        tilesetSize.width = parseFloat(selTileset.getAttribute('tilewidth'));
        tilesetSize.height = parseFloat(selTileset.getAttribute('tileheight')); // parse tile offset

        var offset = selTileset.getElementsByTagName('tileoffset')[0];
        var tileOffset = cc.v2(0, 0);

        if (offset) {
          tileOffset.x = parseFloat(offset.getAttribute('x'));
          tileOffset.y = parseFloat(offset.getAttribute('y'));
        }

        var tileset = null;

        for (var tileIdx = 0; tileIdx < tileCount; tileIdx++) {
          if (!tileset || multiTextures) {
            tileset = new cc.TMXTilesetInfo();
            tileset.name = tilesetName;
            tileset.firstGid = fgid;
            tileset.spacing = tilesetSpacing;
            tileset.margin = tilesetMargin;
            tileset._tileSize = tilesetSize;
            tileset.tileOffset = tileOffset;
            tileset.sourceImage = this._textures[firstImageName];
            tileset.imageSize = this._textureSizes[firstImageName] || tileset.imageSize;

            if (!tileset.sourceImage) {
              cc.errorID(7221, firstImageName);
            }

            this.setTilesets(tileset);
          }

          tile = tiles && tiles[tileIdx];
          if (!tile) continue;
          this.parentGID = parseInt(fgid) + parseInt(tile.getAttribute('id') || 0);
          var tileImages = tile.getElementsByTagName('image');

          if (tileImages && tileImages.length > 0) {
            image = tileImages[0];
            var imageName = image.getAttribute('source');
            imageName = imageName.replace(/\\/g, '\/');
            tileset.sourceImage = this._textures[imageName];

            if (!tileset.sourceImage) {
              cc.errorID(7221, imageName);
            }

            var tileSize = cc.size(0, 0);
            tileSize.width = parseFloat(image.getAttribute('width'));
            tileSize.height = parseFloat(image.getAttribute('height'));
            tileset._tileSize = tileSize;
            tileset.firstGid = this.parentGID;
          }

          this._tileProperties[this.parentGID] = getPropertyList(tile);
          var animations = tile.getElementsByTagName('animation');

          if (animations && animations.length > 0) {
            var animation = animations[0];
            var framesData = animation.getElementsByTagName('frame');
            var animationProp = {
              frames: [],
              dt: 0,
              frameIdx: 0
            };
            this._tileAnimations[this.parentGID] = animationProp;
            var frames = animationProp.frames;

            for (var frameIdx = 0; frameIdx < framesData.length; frameIdx++) {
              var frame = framesData[frameIdx];
              var tileid = parseInt(fgid) + parseInt(frame.getAttribute('tileid'));
              var duration = parseFloat(frame.getAttribute('duration'));
              frames.push({
                tileid: tileid,
                duration: duration / 1000,
                grid: null
              });
            }
          }
        }
      }
    } // PARSE <layer> & <objectgroup> in order


    var childNodes = map.childNodes;

    for (i = 0; i < childNodes.length; i++) {
      var childNode = childNodes[i];

      if (this._shouldIgnoreNode(childNode)) {
        continue;
      }

      if (childNode.nodeName === 'imagelayer') {
        var imageLayer = this._parseImageLayer(childNode);

        if (imageLayer) {
          this.setImageLayers(imageLayer);
        }
      }

      if (childNode.nodeName === 'layer') {
        var layer = this._parseLayer(childNode);

        this.setLayers(layer);
      }

      if (childNode.nodeName === 'objectgroup') {
        var objectGroup = this._parseObjectGroup(childNode);

        this.setObjectGroups(objectGroup);
      }
    }

    return map;
  },
  _shouldIgnoreNode: function _shouldIgnoreNode(node) {
    return node.nodeType === 3 // text
    || node.nodeType === 8 // comment
    || node.nodeType === 4; // cdata
  },
  _parseImageLayer: function _parseImageLayer(selLayer) {
    var datas = selLayer.getElementsByTagName('image');
    if (!datas || datas.length == 0) return null;
    var imageLayer = new cc.TMXImageLayerInfo();
    imageLayer.name = selLayer.getAttribute('name');
    imageLayer.offset.x = parseFloat(selLayer.getAttribute('offsetx')) || 0;
    imageLayer.offset.y = parseFloat(selLayer.getAttribute('offsety')) || 0;
    var visible = selLayer.getAttribute('visible');
    imageLayer.visible = !(visible === "0");
    var opacity = selLayer.getAttribute('opacity') || 1;
    imageLayer.opacity = parseInt(255 * parseFloat(opacity)) || 255;
    var data = datas[0];
    var source = data.getAttribute('source');
    imageLayer.sourceImage = this._imageLayerTextures[source];
    imageLayer.width = parseInt(data.getAttribute('width')) || 0;
    imageLayer.height = parseInt(data.getAttribute('height')) || 0;
    imageLayer.trans = strToColor(data.getAttribute('trans'));

    if (!imageLayer.sourceImage) {
      cc.errorID(7221, source);
      return null;
    }

    return imageLayer;
  },
  _parseLayer: function _parseLayer(selLayer) {
    var data = selLayer.getElementsByTagName('data')[0];
    var layer = new cc.TMXLayerInfo();
    layer.name = selLayer.getAttribute('name');
    var layerSize = cc.size(0, 0);
    layerSize.width = parseFloat(selLayer.getAttribute('width'));
    layerSize.height = parseFloat(selLayer.getAttribute('height'));
    layer._layerSize = layerSize;
    var visible = selLayer.getAttribute('visible');
    layer.visible = !(visible === "0");
    var opacity = selLayer.getAttribute('opacity') || 1;
    if (opacity) layer._opacity = parseInt(255 * parseFloat(opacity));else layer._opacity = 255;
    layer.offset = cc.v2(parseFloat(selLayer.getAttribute('offsetx')) || 0, parseFloat(selLayer.getAttribute('offsety')) || 0);
    var nodeValue = '';

    for (var j = 0; j < data.childNodes.length; j++) {
      nodeValue += data.childNodes[j].nodeValue;
    }

    nodeValue = nodeValue.trim(); // Unpack the tilemap data

    var compression = data.getAttribute('compression');
    var encoding = data.getAttribute('encoding');

    if (compression && compression !== "gzip" && compression !== "zlib") {
      cc.logID(7218);
      return null;
    }

    var tiles;

    switch (compression) {
      case 'gzip':
        tiles = codec.unzipBase64AsArray(nodeValue, 4);
        break;

      case 'zlib':
        var inflator = new zlib.Inflate(codec.Base64.decodeAsArray(nodeValue, 1));
        tiles = uint8ArrayToUint32Array(inflator.decompress());
        break;

      case null:
      case '':
        // Uncompressed
        if (encoding === "base64") tiles = codec.Base64.decodeAsArray(nodeValue, 4);else if (encoding === "csv") {
          tiles = [];
          var csvTiles = nodeValue.split(',');

          for (var csvIdx = 0; csvIdx < csvTiles.length; csvIdx++) {
            tiles.push(parseInt(csvTiles[csvIdx]));
          }
        } else {
          //XML format
          var selDataTiles = data.getElementsByTagName("tile");
          tiles = [];

          for (var xmlIdx = 0; xmlIdx < selDataTiles.length; xmlIdx++) {
            tiles.push(parseInt(selDataTiles[xmlIdx].getAttribute("gid")));
          }
        }
        break;

      default:
        if (this.layerAttrs === cc.TMXLayerInfo.ATTRIB_NONE) cc.logID(7219);
        break;
    }

    if (tiles) {
      layer._tiles = new Uint32Array(tiles);
    } // The parent element is the last layer


    layer.properties = getPropertyList(selLayer);
    return layer;
  },
  _parseObjectGroup: function _parseObjectGroup(selGroup) {
    var objectGroup = new cc.TMXObjectGroupInfo();
    objectGroup.name = selGroup.getAttribute('name') || '';
    objectGroup.offset = cc.v2(parseFloat(selGroup.getAttribute('offsetx')), parseFloat(selGroup.getAttribute('offsety')));
    var opacity = selGroup.getAttribute('opacity') || 1;
    if (opacity) objectGroup._opacity = parseInt(255 * parseFloat(opacity));else objectGroup._opacity = 255;
    var visible = selGroup.getAttribute('visible');
    if (visible && parseInt(visible) === 0) objectGroup.visible = false;
    var color = selGroup.getAttribute('color');
    if (color) objectGroup._color.fromHEX(color);
    var draworder = selGroup.getAttribute('draworder');
    if (draworder) objectGroup._draworder = draworder; // set the properties to the group

    objectGroup.setProperties(getPropertyList(selGroup));
    var objects = selGroup.getElementsByTagName('object');

    if (objects) {
      for (var j = 0; j < objects.length; j++) {
        var selObj = objects[j]; // The value for "type" was blank or not a valid class name
        // Create an instance of TMXObjectInfo to store the object and its properties

        var objectProp = {}; // Set the id of the object

        objectProp['id'] = selObj.getAttribute('id') || j; // Set the name of the object to the value for "name"

        objectProp["name"] = selObj.getAttribute('name') || ""; // Assign all the attributes as key/name pairs in the properties dictionary

        objectProp["width"] = parseFloat(selObj.getAttribute('width')) || 0;
        objectProp["height"] = parseFloat(selObj.getAttribute('height')) || 0;
        objectProp["x"] = parseFloat(selObj.getAttribute('x')) || 0;
        objectProp["y"] = parseFloat(selObj.getAttribute('y')) || 0;
        objectProp["rotation"] = parseFloat(selObj.getAttribute('rotation')) || 0;
        getPropertyList(selObj, objectProp); // visible

        var visibleAttr = selObj.getAttribute('visible');
        objectProp['visible'] = !(visibleAttr && parseInt(visibleAttr) === 0); // text

        var texts = selObj.getElementsByTagName('text');

        if (texts && texts.length > 0) {
          var text = texts[0];
          objectProp['type'] = cc.TiledMap.TMXObjectType.TEXT;
          objectProp['wrap'] = text.getAttribute('wrap') == '1';
          objectProp['color'] = strToColor(text.getAttribute('color'));
          objectProp['halign'] = strToHAlign(text.getAttribute('halign'));
          objectProp['valign'] = strToVAlign(text.getAttribute('valign'));
          objectProp['pixelsize'] = parseInt(text.getAttribute('pixelsize')) || 16;
          objectProp['text'] = text.childNodes[0].nodeValue;
        } // image


        var gid = selObj.getAttribute('gid');

        if (gid) {
          objectProp['gid'] = parseInt(gid);
          objectProp['type'] = cc.TiledMap.TMXObjectType.IMAGE;
        } // ellipse


        var ellipse = selObj.getElementsByTagName('ellipse');

        if (ellipse && ellipse.length > 0) {
          objectProp['type'] = cc.TiledMap.TMXObjectType.ELLIPSE;
        } //polygon


        var polygonProps = selObj.getElementsByTagName("polygon");

        if (polygonProps && polygonProps.length > 0) {
          objectProp['type'] = cc.TiledMap.TMXObjectType.POLYGON;
          var selPgPointStr = polygonProps[0].getAttribute('points');
          if (selPgPointStr) objectProp["points"] = this._parsePointsString(selPgPointStr);
        } //polyline


        var polylineProps = selObj.getElementsByTagName("polyline");

        if (polylineProps && polylineProps.length > 0) {
          objectProp['type'] = cc.TiledMap.TMXObjectType.POLYLINE;
          var selPlPointStr = polylineProps[0].getAttribute('points');
          if (selPlPointStr) objectProp["polylinePoints"] = this._parsePointsString(selPlPointStr);
        }

        if (!objectProp['type']) {
          objectProp['type'] = cc.TiledMap.TMXObjectType.RECT;
        } // Add the object to the objectGroup


        objectGroup._objects.push(objectProp);
      }

      if (draworder !== 'index') {
        objectGroup._objects.sort(function (a, b) {
          return a.y - b.y;
        });
      }
    }

    return objectGroup;
  },
  _parsePointsString: function _parsePointsString(pointsString) {
    if (!pointsString) return null;
    var points = [];
    var pointsStr = pointsString.split(' ');

    for (var i = 0; i < pointsStr.length; i++) {
      var selPointStr = pointsStr[i].split(',');
      points.push({
        'x': parseFloat(selPointStr[0]),
        'y': parseFloat(selPointStr[1])
      });
    }

    return points;
  },

  /**
   * Sets the tile animations.
   * @return {Object}
   */
  setTileAnimations: function setTileAnimations(animations) {
    this._tileAnimations = animations;
  },

  /**
   * Gets the tile animations.
   * @return {Object}
   */
  getTileAnimations: function getTileAnimations() {
    return this._tileAnimations;
  },

  /**
   * Gets the tile properties.
   * @return {Object}
   */
  getTileProperties: function getTileProperties() {
    return this._tileProperties;
  },

  /**
   * Set the tile properties.
   * @param {Object} tileProperties
   */
  setTileProperties: function setTileProperties(tileProperties) {
    this._tileProperties = tileProperties;
  },

  /**
   * Gets the currentString
   * @return {String}
   */
  getCurrentString: function getCurrentString() {
    return this.currentString;
  },

  /**
   * Set the currentString
   * @param {String} currentString
   */
  setCurrentString: function setCurrentString(currentString) {
    this.currentString = currentString;
  }
};
var _p = cc.TMXMapInfo.prototype; // Extended properties

js.getset(_p, "mapWidth", _p._getMapWidth, _p._setMapWidth);
js.getset(_p, "mapHeight", _p._getMapHeight, _p._setMapHeight);
js.getset(_p, "tileWidth", _p._getTileWidth, _p._setTileWidth);
js.getset(_p, "tileHeight", _p._getTileHeight, _p._setTileHeight);
/**
 * @property ATTRIB_NONE
 * @constant
 * @static
 * @type {Number}
 * @default 1
 */

cc.TMXLayerInfo.ATTRIB_NONE = 1 << 0;
/**
 * @property ATTRIB_BASE64
 * @constant
 * @static
 * @type {Number}
 * @default 2
 */

cc.TMXLayerInfo.ATTRIB_BASE64 = 1 << 1;
/**
 * @property ATTRIB_GZIP
 * @constant
 * @static
 * @type {Number}
 * @default 4
 */

cc.TMXLayerInfo.ATTRIB_GZIP = 1 << 2;
/**
 * @property ATTRIB_ZLIB
 * @constant
 * @static
 * @type {Number}
 * @default 8
 */

cc.TMXLayerInfo.ATTRIB_ZLIB = 1 << 3;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC90aWxlbWFwL0NDVE1YWE1MUGFyc2VyLmpzIl0sIm5hbWVzIjpbImNvZGVjIiwicmVxdWlyZSIsInpsaWIiLCJqcyIsInVpbnQ4QXJyYXlUb1VpbnQzMkFycmF5IiwidWludDhBcnIiLCJsZW5ndGgiLCJhcnJMZW4iLCJyZXRBcnIiLCJ3aW5kb3ciLCJVaW50MzJBcnJheSIsImkiLCJvZmZzZXQiLCJjYyIsIlRNWExheWVySW5mbyIsInByb3BlcnRpZXMiLCJuYW1lIiwiX2xheWVyU2l6ZSIsIl90aWxlcyIsInZpc2libGUiLCJfb3BhY2l0eSIsIm93blRpbGVzIiwiX21pbkdJRCIsIl9tYXhHSUQiLCJ2MiIsInByb3RvdHlwZSIsImNvbnN0cnVjdG9yIiwiZ2V0UHJvcGVydGllcyIsInNldFByb3BlcnRpZXMiLCJ2YWx1ZSIsIlRNWEltYWdlTGF5ZXJJbmZvIiwid2lkdGgiLCJoZWlnaHQiLCJfdHJhbnMiLCJDb2xvciIsInNvdXJjZUltYWdlIiwiVE1YT2JqZWN0R3JvdXBJbmZvIiwiX29iamVjdHMiLCJfY29sb3IiLCJfZHJhd29yZGVyIiwiVE1YVGlsZXNldEluZm8iLCJmaXJzdEdpZCIsInNwYWNpbmciLCJtYXJnaW4iLCJpbWFnZVNpemUiLCJzaXplIiwidGlsZU9mZnNldCIsIl90aWxlU2l6ZSIsInJlY3RGb3JHSUQiLCJnaWQiLCJyZXN1bHQiLCJyZWN0IiwiVGlsZWRNYXAiLCJUaWxlRmxhZyIsIkZMSVBQRURfTUFTSyIsInBhcnNlSW50IiwibWF4X3giLCJ4IiwieSIsInN0clRvSEFsaWduIiwiaEFsaWduIiwiTGFiZWwiLCJIb3Jpem9udGFsQWxpZ24iLCJDRU5URVIiLCJSSUdIVCIsIkxFRlQiLCJzdHJUb1ZBbGlnbiIsInZBbGlnbiIsIlZlcnRpY2FsQWxpZ24iLCJCT1RUT00iLCJUT1AiLCJzdHJUb0NvbG9yIiwiY29sb3IiLCJpbmRleE9mIiwic3Vic3RyaW5nIiwiYSIsInN1YnN0ciIsInIiLCJnIiwiYiIsImdldFByb3BlcnR5TGlzdCIsIm5vZGUiLCJtYXAiLCJyZXMiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsInByb3BlcnR5IiwiaiIsInB1c2giLCJlbGVtZW50IiwiZ2V0QXR0cmlidXRlIiwidHlwZSIsInBhcnNlRmxvYXQiLCJUTVhNYXBJbmZvIiwidG14RmlsZSIsInRzeE1hcCIsInRleHR1cmVzIiwidGV4dHVyZVNpemVzIiwiaW1hZ2VMYXllclRleHR1cmVzIiwib3JpZW50YXRpb24iLCJwYXJlbnRFbGVtZW50IiwicGFyZW50R0lEIiwibGF5ZXJBdHRycyIsInN0b3JpbmdDaGFyYWN0ZXJzIiwiY3VycmVudFN0cmluZyIsInJlbmRlck9yZGVyIiwiUmVuZGVyT3JkZXIiLCJSaWdodERvd24iLCJfc3VwcG9ydFZlcnNpb24iLCJfcGFyc2VyIiwiU0FYUGFyc2VyIiwiX29iamVjdEdyb3VwcyIsIl9hbGxDaGlsZHJlbiIsIl9tYXBTaXplIiwiX2xheWVycyIsIl90aWxlc2V0cyIsIl9pbWFnZUxheWVycyIsIl90aWxlUHJvcGVydGllcyIsIl90aWxlQW5pbWF0aW9ucyIsIl90c3hNYXAiLCJfdGV4dHVyZXMiLCJfc3RhZ2dlckF4aXMiLCJfc3RhZ2dlckluZGV4IiwiX2hleFNpZGVMZW5ndGgiLCJfaW1hZ2VMYXllclRleHR1cmVzIiwiaW5pdFdpdGhYTUwiLCJnZXRPcmllbnRhdGlvbiIsInNldE9yaWVudGF0aW9uIiwiZ2V0U3RhZ2dlckF4aXMiLCJzZXRTdGFnZ2VyQXhpcyIsImdldFN0YWdnZXJJbmRleCIsInNldFN0YWdnZXJJbmRleCIsImdldEhleFNpZGVMZW5ndGgiLCJzZXRIZXhTaWRlTGVuZ3RoIiwiZ2V0TWFwU2l6ZSIsInNldE1hcFNpemUiLCJfZ2V0TWFwV2lkdGgiLCJfc2V0TWFwV2lkdGgiLCJfZ2V0TWFwSGVpZ2h0IiwiX3NldE1hcEhlaWdodCIsImdldFRpbGVTaXplIiwic2V0VGlsZVNpemUiLCJfZ2V0VGlsZVdpZHRoIiwiX3NldFRpbGVXaWR0aCIsIl9nZXRUaWxlSGVpZ2h0IiwiX3NldFRpbGVIZWlnaHQiLCJnZXRMYXllcnMiLCJzZXRMYXllcnMiLCJnZXRJbWFnZUxheWVycyIsInNldEltYWdlTGF5ZXJzIiwiZ2V0VGlsZXNldHMiLCJzZXRUaWxlc2V0cyIsImdldE9iamVjdEdyb3VwcyIsInNldE9iamVjdEdyb3VwcyIsImdldEFsbENoaWxkcmVuIiwiZ2V0UGFyZW50RWxlbWVudCIsInNldFBhcmVudEVsZW1lbnQiLCJnZXRQYXJlbnRHSUQiLCJzZXRQYXJlbnRHSUQiLCJnZXRMYXllckF0dHJpYnMiLCJzZXRMYXllckF0dHJpYnMiLCJnZXRTdG9yaW5nQ2hhcmFjdGVycyIsInNldFN0b3JpbmdDaGFyYWN0ZXJzIiwidG14U3RyaW5nIiwiX3RleHR1cmVTaXplcyIsIkFUVFJJQl9OT05FIiwiTk9ORSIsInBhcnNlWE1MU3RyaW5nIiwieG1sU3RyIiwidGlsZXNldEZpcnN0R2lkIiwibWFwWE1MIiwiX3BhcnNlWE1MIiwiZG9jdW1lbnRFbGVtZW50Iiwib3JpZW50YXRpb25TdHIiLCJzdGFnZ2VyQXhpc1N0ciIsInN0YWdnZXJJbmRleFN0ciIsImhleFNpZGVMZW5ndGhTdHIiLCJyZW5kZXJvcmRlclN0ciIsInZlcnNpb24iLCJub2RlTmFtZSIsInZlcnNpb25BcnIiLCJzcGxpdCIsInN1cHBvcnRWZXJzaW9uIiwidiIsInN2IiwibG9nSUQiLCJPcmllbnRhdGlvbiIsIk9SVEhPIiwiSVNPIiwiSEVYIiwiUmlnaHRVcCIsIkxlZnRVcCIsIkxlZnREb3duIiwiU3RhZ2dlckF4aXMiLCJTVEFHR0VSQVhJU19YIiwiU1RBR0dFUkFYSVNfWSIsIlN0YWdnZXJJbmRleCIsIlNUQUdHRVJJTkRFWF9PREQiLCJTVEFHR0VSSU5ERVhfRVZFTiIsIm1hcFNpemUiLCJ0aWxlc2V0cyIsInNlbFRpbGVzZXQiLCJ0c3hOYW1lIiwiY3VycmVudEZpcnN0R0lEIiwidHN4WG1sU3RyaW5nIiwiaW1hZ2VzIiwibXVsdGlUZXh0dXJlcyIsImltYWdlIiwiZmlyc3RJbWFnZU5hbWUiLCJyZXBsYWNlIiwidGlsZXMiLCJ0aWxlQ291bnQiLCJ0aWxlIiwidGlsZXNldE5hbWUiLCJ0aWxlc2V0U3BhY2luZyIsInRpbGVzZXRNYXJnaW4iLCJmZ2lkIiwidGlsZXNldFNpemUiLCJ0aWxlc2V0IiwidGlsZUlkeCIsImVycm9ySUQiLCJ0aWxlSW1hZ2VzIiwiaW1hZ2VOYW1lIiwidGlsZVNpemUiLCJhbmltYXRpb25zIiwiYW5pbWF0aW9uIiwiZnJhbWVzRGF0YSIsImFuaW1hdGlvblByb3AiLCJmcmFtZXMiLCJkdCIsImZyYW1lSWR4IiwiZnJhbWUiLCJ0aWxlaWQiLCJkdXJhdGlvbiIsImdyaWQiLCJjaGlsZE5vZGVzIiwiY2hpbGROb2RlIiwiX3Nob3VsZElnbm9yZU5vZGUiLCJpbWFnZUxheWVyIiwiX3BhcnNlSW1hZ2VMYXllciIsImxheWVyIiwiX3BhcnNlTGF5ZXIiLCJvYmplY3RHcm91cCIsIl9wYXJzZU9iamVjdEdyb3VwIiwibm9kZVR5cGUiLCJzZWxMYXllciIsImRhdGFzIiwib3BhY2l0eSIsImRhdGEiLCJzb3VyY2UiLCJ0cmFucyIsImxheWVyU2l6ZSIsIm5vZGVWYWx1ZSIsInRyaW0iLCJjb21wcmVzc2lvbiIsImVuY29kaW5nIiwidW56aXBCYXNlNjRBc0FycmF5IiwiaW5mbGF0b3IiLCJJbmZsYXRlIiwiQmFzZTY0IiwiZGVjb2RlQXNBcnJheSIsImRlY29tcHJlc3MiLCJjc3ZUaWxlcyIsImNzdklkeCIsInNlbERhdGFUaWxlcyIsInhtbElkeCIsInNlbEdyb3VwIiwiZnJvbUhFWCIsImRyYXdvcmRlciIsIm9iamVjdHMiLCJzZWxPYmoiLCJvYmplY3RQcm9wIiwidmlzaWJsZUF0dHIiLCJ0ZXh0cyIsInRleHQiLCJUTVhPYmplY3RUeXBlIiwiVEVYVCIsIklNQUdFIiwiZWxsaXBzZSIsIkVMTElQU0UiLCJwb2x5Z29uUHJvcHMiLCJQT0xZR09OIiwic2VsUGdQb2ludFN0ciIsIl9wYXJzZVBvaW50c1N0cmluZyIsInBvbHlsaW5lUHJvcHMiLCJQT0xZTElORSIsInNlbFBsUG9pbnRTdHIiLCJSRUNUIiwic29ydCIsInBvaW50c1N0cmluZyIsInBvaW50cyIsInBvaW50c1N0ciIsInNlbFBvaW50U3RyIiwic2V0VGlsZUFuaW1hdGlvbnMiLCJnZXRUaWxlQW5pbWF0aW9ucyIsImdldFRpbGVQcm9wZXJ0aWVzIiwic2V0VGlsZVByb3BlcnRpZXMiLCJ0aWxlUHJvcGVydGllcyIsImdldEN1cnJlbnRTdHJpbmciLCJzZXRDdXJyZW50U3RyaW5nIiwiX3AiLCJnZXRzZXQiLCJBVFRSSUJfQkFTRTY0IiwiQVRUUklCX0daSVAiLCJBVFRSSUJfWkxJQiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBRUEsSUFBTUEsS0FBSyxHQUFHQyxPQUFPLENBQUMseUJBQUQsQ0FBckI7O0FBQ0EsSUFBTUMsSUFBSSxHQUFHRCxPQUFPLENBQUMseUJBQUQsQ0FBcEI7O0FBQ0EsSUFBTUUsRUFBRSxHQUFHRixPQUFPLENBQUMscUJBQUQsQ0FBbEI7O0FBQ0FBLE9BQU8sQ0FBQyw4QkFBRCxDQUFQOztBQUVBLFNBQVNHLHVCQUFULENBQWtDQyxRQUFsQyxFQUE0QztBQUN4QyxNQUFHQSxRQUFRLENBQUNDLE1BQVQsR0FBa0IsQ0FBbEIsS0FBd0IsQ0FBM0IsRUFDSSxPQUFPLElBQVA7QUFFSixNQUFJQyxNQUFNLEdBQUdGLFFBQVEsQ0FBQ0MsTUFBVCxHQUFpQixDQUE5QjtBQUNBLE1BQUlFLE1BQU0sR0FBR0MsTUFBTSxDQUFDQyxXQUFQLEdBQW9CLElBQUlBLFdBQUosQ0FBZ0JILE1BQWhCLENBQXBCLEdBQThDLEVBQTNEOztBQUNBLE9BQUksSUFBSUksQ0FBQyxHQUFHLENBQVosRUFBZUEsQ0FBQyxHQUFHSixNQUFuQixFQUEyQkksQ0FBQyxF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LENBQVVELEVBQVYsRUFBYyxXQUFkLEVBQTJCQSxFQUFFLENBQUM5SixhQUE5QixFQUE2QzhKLEVBQUUsQ0FBQzdKLGFBQWhEO0FBQ0EzSSxFQUFFLENBQUN5UyxNQUFILENBQVVELEVBQVYsRUFBYyxZQUFkLEVBQTRCQSxFQUFFLENBQUM1SixjQUEvQixFQUErQzRKLEVBQUUsQ0FBQzNKLGNBQWxEO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0FuSSxFQUFFLENBQUNDLFlBQUgsQ0FBZ0JzSixXQUFoQixHQUE4QixLQUFLLENBQW5DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0F2SixFQUFFLENBQUNDLFlBQUgsQ0FBZ0IrUixhQUFoQixHQUFnQyxLQUFLLENBQXJDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0FoUyxFQUFFLENBQUNDLFlBQUgsQ0FBZ0JnUyxXQUFoQixHQUE4QixLQUFLLENBQW5DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0FqUyxFQUFFLENBQUNDLFlBQUgsQ0FBZ0JpUyxXQUFoQixHQUE4QixLQUFLLENBQW5DIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMDgtMjAxMCBSaWNhcmRvIFF1ZXNhZGFcbiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxMiBjb2NvczJkLXgub3JnXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IGNvZGVjID0gcmVxdWlyZSgnLi4vY29tcHJlc3Npb24vWmlwVXRpbHMnKTtcbmNvbnN0IHpsaWIgPSByZXF1aXJlKCcuLi9jb21wcmVzc2lvbi96bGliLm1pbicpO1xuY29uc3QganMgPSByZXF1aXJlKCcuLi9jb3JlL3BsYXRmb3JtL2pzJyk7XG5yZXF1aXJlKCcuLi9jb3JlL3BsYXRmb3JtL0NDU0FYUGFyc2VyJyk7XG5cbmZ1bmN0aW9uIHVpbnQ4QXJyYXlUb1VpbnQzMkFycmF5ICh1aW50OEFycikge1xuICAgIGlmKHVpbnQ4QXJyLmxlbmd0aCAlIDQgIT09IDApXG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgbGV0IGFyckxlbiA9IHVpbnQ4QXJyLmxlbmd0aCAvNDtcbiAgICBsZXQgcmV0QXJyID0gd2luZG93LlVpbnQzMkFycmF5PyBuZXcgVWludDMyQXJyYXkoYXJyTGVuKSA6IFtdO1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBhcnJMZW47IGkrKyl7XG4gICAgICAgIGxldCBvZmZzZXQgPSBpICogNDtcbiAgICAgICAgcmV0QXJyW2ldID0gdWludDhBcnJbb2Zmc2V0XSAgKyB1aW50OEFycltvZmZzZXQgKyAxXSAqICgxIDw8IDgpICsgdWludDhBcnJbb2Zmc2V0ICsgMl0gKiAoMSA8PCAxNikgKyB1aW50OEFycltvZmZzZXQgKyAzXSAqICgxPDwyNCk7XG4gICAgfVxuICAgIHJldHVybiByZXRBcnI7XG59XG5cbi8vIEJpdHMgb24gdGhlIGZhciBlbmQgb2YgdGhlIDMyLWJpdCBnbG9iYWwgdGlsZSBJRCAoR0lEJ3MpIGFyZSB1c2VkIGZvciB0aWxlIGZsYWdzXG5cbi8qKlxuICogY2MuVE1YTGF5ZXJJbmZvIGNvbnRhaW5zIHRoZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgbGF5ZXJzIGxpa2U6XG4gKiAtIExheWVyIG5hbWVcbiAqIC0gTGF5ZXIgc2l6ZVxuICogLSBMYXllciBvcGFjaXR5IGF0IGNyZWF0aW9uIHRpbWUgKGl0IGNhbiBiZSBtb2RpZmllZCBhdCBydW50aW1lKVxuICogLSBXaGV0aGVyIHRoZSBsYXllciBpcyB2aXNpYmxlIChpZiBpdCdzIG5vdCB2aXNpYmxlLCB0aGVuIHRoZSBDb2Nvc05vZGUgd29uJ3QgYmUgY3JlYXRlZClcbiAqIFRoaXMgaW5mb3JtYXRpb24gaXMgb2J0YWluZWQgZnJvbSB0aGUgVE1YIGZpbGUuXG4gKiBAY2xhc3MgVE1YTGF5ZXJJbmZvXG4gKi9cbi8qKlxuICogUHJvcGVydGllcyBvZiB0aGUgbGF5ZXIgaW5mby5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBwcm9wZXJ0aWVzIFxuICovXG5jYy5UTVhMYXllckluZm8gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0ge307XG4gICAgdGhpcy5uYW1lID0gXCJcIjtcbiAgICB0aGlzLl9sYXllclNpemUgPSBudWxsO1xuICAgIHRoaXMuX3RpbGVzID0gW107XG4gICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcbiAgICB0aGlzLl9vcGFjaXR5ID0gMDtcbiAgICB0aGlzLm93blRpbGVzID0gdHJ1ZTtcbiAgICB0aGlzLl9taW5HSUQgPSAxMDAwMDA7XG4gICAgdGhpcy5fbWF4R0lEID0gMDtcbiAgICB0aGlzLm9mZnNldCA9IGNjLnYyKDAsMCk7XG59O1xuXG5jYy5UTVhMYXllckluZm8ucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBjYy5UTVhMYXllckluZm8sXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgUHJvcGVydGllcy5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0UHJvcGVydGllcyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BlcnRpZXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgUHJvcGVydGllcy5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdmFsdWVcbiAgICAgKi9cbiAgICBzZXRQcm9wZXJ0aWVzICh2YWx1ZSkge1xuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSB2YWx1ZTtcbiAgICB9XG59O1xuXG4vKipcbiAqIGNjLlRNWEltYWdlTGF5ZXJJbmZvIGNvbnRhaW5zIHRoZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgaW1hZ2UgbGF5ZXJzLlxuICogVGhpcyBpbmZvcm1hdGlvbiBpcyBvYnRhaW5lZCBmcm9tIHRoZSBUTVggZmlsZS5cbiAqIEBjbGFzcyBUTVhJbWFnZUxheWVySW5mb1xuICovXG5jYy5UTVhJbWFnZUxheWVySW5mbyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm5hbWU9IFwiXCI7XG4gICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcbiAgICB0aGlzLndpZHRoID0gMDtcbiAgICB0aGlzLmhlaWdodCA9IDA7XG4gICAgdGhpcy5vZmZzZXQgPSBjYy52MigwLDApO1xuICAgIHRoaXMuX29wYWNpdHkgPSAwO1xuICAgIHRoaXMuX3RyYW5zID0gbmV3IGNjLkNvbG9yKDI1NSwgMjU1LCAyNTUsIDI1NSk7XG4gICAgdGhpcy5zb3VyY2VJbWFnZSA9IG51bGw7XG59O1xuXG4vKipcbiAqIDxwPmNjLlRNWE9iamVjdEdyb3VwSW5mbyBjb250YWlucyB0aGUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIG9iamVjdCBncm91cCBsaWtlOlxuICogLSBncm91cCBuYW1lXG4gKiAtIGdyb3VwIHNpemVcbiAqIC0gZ3JvdXAgb3BhY2l0eSBhdCBjcmVhdGlvbiB0aW1lIChpdCBjYW4gYmUgbW9kaWZpZWQgYXQgcnVudGltZSlcbiAqIC0gV2hldGhlciB0aGUgZ3JvdXAgaXMgdmlzaWJsZVxuICpcbiAqIFRoaXMgaW5mb3JtYXRpb24gaXMgb2J0YWluZWQgZnJvbSB0aGUgVE1YIGZpbGUuPC9wPlxuICogQGNsYXNzIFRNWE9iamVjdEdyb3VwSW5mb1xuICovXG5cbi8qKlxuICogUHJvcGVydGllcyBvZiB0aGUgT2JqZWN0R3JvdXAgaW5mby5cbiAqIEBwcm9wZXJ0eSB7QXJyYXl9IHByb3BlcnRpZXNcbiAqL1xuY2MuVE1YT2JqZWN0R3JvdXBJbmZvID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucHJvcGVydGllcyA9IHt9O1xuICAgIHRoaXMubmFtZSA9IFwiXCI7XG4gICAgdGhpcy5fb2JqZWN0cyA9IFtdO1xuICAgIHRoaXMudmlzaWJsZSA9IHRydWU7XG4gICAgdGhpcy5fb3BhY2l0eSA9IDA7XG4gICAgdGhpcy5fY29sb3IgPSBuZXcgY2MuQ29sb3IoMjU1LCAyNTUsIDI1NSwgMjU1KTtcbiAgICB0aGlzLm9mZnNldCA9IGNjLnYyKDAsMCk7XG4gICAgdGhpcy5fZHJhd29yZGVyID0gJ3RvcGRvd24nO1xufTtcblxuY2MuVE1YT2JqZWN0R3JvdXBJbmZvLnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogY2MuVE1YT2JqZWN0R3JvdXBJbmZvLFxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIFByb3BlcnRpZXMuXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgZ2V0UHJvcGVydGllcyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BlcnRpZXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgUHJvcGVydGllcy5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdmFsdWVcbiAgICAgKi9cbiAgICBzZXRQcm9wZXJ0aWVzICh2YWx1ZSkge1xuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSB2YWx1ZTtcbiAgICB9XG59O1xuXG4vKipcbiAqIDxwPmNjLlRNWFRpbGVzZXRJbmZvIGNvbnRhaW5zIHRoZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgdGlsZXNldHMgbGlrZTogPGJyIC8+XG4gKiAtIFRpbGVzZXQgbmFtZTxiciAvPlxuICogLSBUaWxlc2V0IHNwYWNpbmc8YnIgLz5cbiAqIC0gVGlsZXNldCBtYXJnaW48YnIgLz5cbiAqIC0gc2l6ZSBvZiB0aGUgdGlsZXM8YnIgLz5cbiAqIC0gSW1hZ2UgdXNlZCBmb3IgdGhlIHRpbGVzPGJyIC8+XG4gKiAtIEltYWdlIHNpemU8YnIgLz5cbiAqXG4gKiBUaGlzIGluZm9ybWF0aW9uIGlzIG9idGFpbmVkIGZyb20gdGhlIFRNWCBmaWxlLiA8L3A+XG4gKiBAY2xhc3MgVE1YVGlsZXNldEluZm9cbiAqL1xuXG4vKipcbiAqIFRpbGVzZXQgbmFtZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IG5hbWVcbiAqL1xuXG4vKipcbiAqIEZpcnN0IGdyaWRcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBmaXJzdEdpZCBcbiAqL1xuXG4vKipcbiAqIFNwYWNpbmdcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzcGFjaW5nXG4gKi9cblxuLyoqXG4gKiBNYXJnaW5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtYXJnaW4gXG4gKi9cblxuLyoqXG4gKiBUZXh0dXJlIGNvbnRhaW5pbmcgdGhlIHRpbGVzIChzaG91bGQgYmUgc3ByaXRlIHNoZWV0IC8gdGV4dHVyZSBhdGxhcylcbiAqIEBwcm9wZXJ0eSB7YW55fSBzb3VyY2VJbWFnZVxuICovXG5cbi8qKlxuICogU2l6ZSBpbiBwaXhlbHMgb2YgdGhlIGltYWdlXG4gKiBAcHJvcGVydHkge2NjLlNpemV9IGltYWdlU2l6ZVxuICovXG5jYy5UTVhUaWxlc2V0SW5mbyA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUaWxlc2V0IG5hbWVcbiAgICB0aGlzLm5hbWUgPSBcIlwiO1xuICAgIC8vIEZpcnN0IGdyaWRcbiAgICB0aGlzLmZpcnN0R2lkID0gMDtcbiAgICAvLyBTcGFjaW5nXG4gICAgdGhpcy5zcGFjaW5nID0gMDtcbiAgICAvLyBNYXJnaW5cbiAgICB0aGlzLm1hcmdpbiA9IDA7XG4gICAgLy8gVGV4dHVyZSBjb250YWluaW5nIHRoZSB0aWxlcyAoc2hvdWxkIGJlIHNwcml0ZSBzaGVldCAvIHRleHR1cmUgYXRsYXMpXG4gICAgdGhpcy5zb3VyY2VJbWFnZSA9IG51bGw7XG4gICAgLy8gU2l6ZSBpbiBwaXhlbHMgb2YgdGhlIGltYWdlXG4gICAgdGhpcy5pbWFnZVNpemUgPSBjYy5zaXplKDAsIDApO1xuXG4gICAgdGhpcy50aWxlT2Zmc2V0ID0gY2MudjIoMCwgMCk7XG5cbiAgICB0aGlzLl90aWxlU2l6ZSA9IGNjLnNpemUoMCwgMCk7XG59O1xuXG5jYy5UTVhUaWxlc2V0SW5mby5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IGNjLlRNWFRpbGVzZXRJbmZvLFxuICAgIC8qKlxuICAgICAqIFJldHVybiByZWN0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGdpZFxuICAgICAqIEByZXR1cm4ge1JlY3R9XG4gICAgICovXG4gICAgcmVjdEZvckdJRCAoZ2lkLCByZXN1bHQpIHtcbiAgICAgICAgbGV0IHJlY3QgPSByZXN1bHQgfHwgY2MucmVjdCgwLCAwLCAwLCAwKTtcbiAgICAgICAgcmVjdC53aWR0aCA9IHRoaXMuX3RpbGVTaXplLndpZHRoO1xuICAgICAgICByZWN0LmhlaWdodCA9IHRoaXMuX3RpbGVTaXplLmhlaWdodDtcbiAgICAgICAgZ2lkICY9IGNjLlRpbGVkTWFwLlRpbGVGbGFnLkZMSVBQRURfTUFTSztcbiAgICAgICAgZ2lkID0gZ2lkIC0gcGFyc2VJbnQodGhpcy5maXJzdEdpZCwgMTApO1xuICAgICAgICBsZXQgbWF4X3ggPSBwYXJzZUludCgodGhpcy5pbWFnZVNpemUud2lkdGggLSB0aGlzLm1hcmdpbiAqIDIgKyB0aGlzLnNwYWNpbmcpIC8gKHRoaXMuX3RpbGVTaXplLndpZHRoICsgdGhpcy5zcGFjaW5nKSwgMTApO1xuICAgICAgICByZWN0LnggPSBwYXJzZUludCgoZ2lkICUgbWF4X3gpICogKHRoaXMuX3RpbGVTaXplLndpZHRoICsgdGhpcy5zcGFjaW5nKSArIHRoaXMubWFyZ2luLCAxMCk7XG4gICAgICAgIHJlY3QueSA9IHBhcnNlSW50KHBhcnNlSW50KGdpZCAvIG1heF94LCAxMCkgKiAodGhpcy5fdGlsZVNpemUuaGVpZ2h0ICsgdGhpcy5zcGFjaW5nKSArIHRoaXMubWFyZ2luLCAxMCk7XG4gICAgICAgIHJldHVybiByZWN0O1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIHN0clRvSEFsaWduICh2YWx1ZSkge1xuICAgIGNvbnN0IGhBbGlnbiA9IGNjLkxhYmVsLkhvcml6b250YWxBbGlnbjtcbiAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICAgIGNhc2UgJ2NlbnRlcic6XG4gICAgICAgICAgICByZXR1cm4gaEFsaWduLkNFTlRFUjtcbiAgICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICAgICAgcmV0dXJuIGhBbGlnbi5SSUdIVDtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBoQWxpZ24uTEVGVDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHN0clRvVkFsaWduICh2YWx1ZSkge1xuICAgIGNvbnN0IHZBbGlnbiA9IGNjLkxhYmVsLlZlcnRpY2FsQWxpZ247XG4gICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgICBjYXNlICdjZW50ZXInOlxuICAgICAgICAgICAgcmV0dXJuIHZBbGlnbi5DRU5URVI7XG4gICAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgICAgICByZXR1cm4gdkFsaWduLkJPVFRPTTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiB2QWxpZ24uVE9QO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc3RyVG9Db2xvciAodmFsdWUpIHtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHJldHVybiBjYy5jb2xvcigwLCAwLCAwLCAyNTUpO1xuICAgIH1cbiAgICB2YWx1ZSA9ICh2YWx1ZS5pbmRleE9mKCcjJykgIT09IC0xKSA/IHZhbHVlLnN1YnN0cmluZygxKSA6IHZhbHVlO1xuICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDgpIHtcbiAgICAgICAgbGV0IGEgPSBwYXJzZUludCh2YWx1ZS5zdWJzdHIoMCwgMiksIDE2KSB8fCAyNTU7XG4gICAgICAgIGxldCByID0gcGFyc2VJbnQodmFsdWUuc3Vic3RyKDIsIDIpLCAxNikgfHwgMDtcbiAgICAgICAgbGV0IGcgPSBwYXJzZUludCh2YWx1ZS5zdWJzdHIoNCwgMiksIDE2KSB8fCAwO1xuICAgICAgICBsZXQgYiA9IHBhcnNlSW50KHZhbHVlLnN1YnN0cig2LCAyKSwgMTYpIHx8IDA7XG4gICAgICAgIHJldHVybiBjYy5jb2xvcihyLCBnLCBiLCBhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgciA9IHBhcnNlSW50KHZhbHVlLnN1YnN0cigwLCAyKSwgMTYpIHx8IDA7XG4gICAgICAgIGxldCBnID0gcGFyc2VJbnQodmFsdWUuc3Vic3RyKDIsIDIpLCAxNikgfHwgMDtcbiAgICAgICAgbGV0IGIgPSBwYXJzZUludCh2YWx1ZS5zdWJzdHIoNCwgMiksIDE2KSB8fCAwO1xuICAgICAgICByZXR1cm4gY2MuY29sb3IociwgZywgYiwgMjU1KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldFByb3BlcnR5TGlzdCAobm9kZSwgbWFwKSB7XG4gICAgbGV0IHJlcyA9IFtdO1xuICAgIGxldCBwcm9wZXJ0aWVzID0gbm9kZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInByb3BlcnRpZXNcIik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGxldCBwcm9wZXJ0eSA9IHByb3BlcnRpZXNbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJwcm9wZXJ0eVwiKTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwcm9wZXJ0eS5sZW5ndGg7ICsraikge1xuICAgICAgICAgICAgcmVzLnB1c2gocHJvcGVydHlbal0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWFwID0gbWFwIHx8IHt9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBlbGVtZW50ID0gcmVzW2ldO1xuICAgICAgICBsZXQgbmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gICAgICAgIGxldCB0eXBlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSB8fCAnc3RyaW5nJztcblxuICAgICAgICBsZXQgdmFsdWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcbiAgICAgICAgaWYgKHR5cGUgPT09ICdpbnQnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHBhcnNlSW50KHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlID09PSAnZmxvYXQnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGUgPT09ICdib29sJykge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSA9PT0gJ3RydWUnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGUgPT09ICdjb2xvcicpIHtcbiAgICAgICAgICAgIHZhbHVlID0gc3RyVG9Db2xvcih2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBtYXBbbmFtZV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWFwO1xufVxuXG4vKipcbiAqIDxwPmNjLlRNWE1hcEluZm8gY29udGFpbnMgdGhlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBtYXAgbGlrZTogPGJyLz5cbiAqLSBNYXAgb3JpZW50YXRpb24gKGhleGFnb25hbCwgaXNvbWV0cmljIG9yIG9ydGhvZ29uYWwpPGJyLz5cbiAqLSBUaWxlIHNpemU8YnIvPlxuICotIE1hcCBzaXplPC9wPlxuICpcbiAqIDxwPkFuZCBpdCBhbHNvIGNvbnRhaW5zOiA8YnIvPlxuICogLSBMYXllcnMgKGFuIGFycmF5IG9mIFRNWExheWVySW5mbyBvYmplY3RzKTxici8+XG4gKiAtIFRpbGVzZXRzIChhbiBhcnJheSBvZiBUTVhUaWxlc2V0SW5mbyBvYmplY3RzKSA8YnIvPlxuICogLSBPYmplY3RHcm91cHMgKGFuIGFycmF5IG9mIFRNWE9iamVjdEdyb3VwSW5mbyBvYmplY3RzKSA8L3A+XG4gKlxuICogPHA+VGhpcyBpbmZvcm1hdGlvbiBpcyBvYnRhaW5lZCBmcm9tIHRoZSBUTVggZmlsZS4gPC9wPlxuICogQGNsYXNzIFRNWE1hcEluZm9cbiAqL1xuXG4vKipcbiAqIFByb3BlcnRpZXMgb2YgdGhlIG1hcCBpbmZvLlxuICogQHByb3BlcnR5IHtBcnJheX0gICAgcHJvcGVydGllcyAgICAgICAgICBcbiAqL1xuXG4vKipcbiAqIE1hcCBvcmllbnRhdGlvbi5cbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSAgIG9yaWVudGF0aW9uICAgICAgICAgXG4gKi9cblxuLyoqXG4gKiBQYXJlbnQgZWxlbWVudC5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSAgIHBhcmVudEVsZW1lbnQgICAgICAgXG4gKi9cblxuLyoqXG4gKiBQYXJlbnQgR0lELlxuICogQHByb3BlcnR5IHtOdW1iZXJ9ICAgcGFyZW50R0lEICAgICAgICAgICBcbiAqL1xuXG4vKipcbiAqIExheWVyIGF0dHJpYnV0ZXMuXG4gKiBAcHJvcGVydHkge09iamVjdH0gICBsYXllckF0dHJzICAgICAgICBcbiAqL1xuXG4vKipcbiAqIElzIHJlYWRpbmcgc3RvcmluZyBjaGFyYWN0ZXJzIHN0cmVhbS5cbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gIHN0b3JpbmdDaGFyYWN0ZXJzICAgXG4gKi9cblxuLyoqXG4gKiBDdXJyZW50IHN0cmluZyBzdG9yZWQgZnJvbSBjaGFyYWN0ZXJzIHN0cmVhbS5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSAgIGN1cnJlbnRTdHJpbmcgICAgICAgXG4gKi9cblxuLyoqXG4gKiBXaWR0aCBvZiB0aGUgbWFwXG4gKiBAcHJvcGVydHkge051bWJlcn0gICBtYXBXaWR0aCAgICAgICAgICAgIFxuICovXG5cbi8qKlxuICogSGVpZ2h0IG9mIHRoZSBtYXBcbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSAgIG1hcEhlaWdodCAgICAgICAgICAgXG4gKi9cblxuLyoqXG4gKiBXaWR0aCBvZiBhIHRpbGVcbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSAgIHRpbGVXaWR0aCAgICAgICAgICAgXG4gKi9cblxuLyoqIFxuICogSGVpZ2h0IG9mIGEgdGlsZVxuICogQHByb3BlcnR5IHtOdW1iZXJ9ICAgdGlsZUhlaWdodCAgICAgICAgICBcbiAqL1xuXG4vKipcbiAqIEBleGFtcGxlXG4gKiAxLlxuICogLy9jcmVhdGUgYSBUTVhNYXBJbmZvIHdpdGggZmlsZSBuYW1lXG4gKiBsZXQgdG14TWFwSW5mbyA9IG5ldyBjYy5UTVhNYXBJbmZvKFwicmVzL29ydGhvZ29uYWwtdGVzdDEudG14XCIpO1xuICogMi5cbiAqIC8vY3JlYXRlIGEgVE1YTWFwSW5mbyB3aXRoIGNvbnRlbnQgc3RyaW5nIGFuZCByZXNvdXJjZSBwYXRoXG4gKiBsZXQgcmVzb3VyY2VzID0gXCJyZXMvVGlsZU1hcHNcIjtcbiAqIGxldCBmaWxlUGF0aCA9IFwicmVzL1RpbGVNYXBzL29ydGhvZ29uYWwtdGVzdDEudG14XCI7XG4gKiBsZXQgeG1sU3RyID0gY2MucmVzb3VyY2VzLmdldChmaWxlUGF0aCk7XG4gKiBsZXQgdG14TWFwSW5mbyA9IG5ldyBjYy5UTVhNYXBJbmZvKHhtbFN0ciwgcmVzb3VyY2VzKTtcbiAqL1xuXG4vKipcbiAqIENyZWF0ZXMgYSBUTVggRm9ybWF0IHdpdGggYSB0bXggZmlsZSBvciBjb250ZW50IHN0cmluZ1xuICovXG5jYy5UTVhNYXBJbmZvID0gZnVuY3Rpb24gKHRteEZpbGUsIHRzeE1hcCwgdGV4dHVyZXMsIHRleHR1cmVTaXplcywgaW1hZ2VMYXllclRleHR1cmVzKSB7XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gW107XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG51bGw7XG4gICAgdGhpcy5wYXJlbnRFbGVtZW50ID0gbnVsbDtcbiAgICB0aGlzLnBhcmVudEdJRCA9IG51bGw7XG4gICAgdGhpcy5sYXllckF0dHJzID0gMDtcbiAgICB0aGlzLnN0b3JpbmdDaGFyYWN0ZXJzID0gZmFsc2U7XG4gICAgdGhpcy5jdXJyZW50U3RyaW5nID0gbnVsbDtcbiAgICB0aGlzLnJlbmRlck9yZGVyID0gY2MuVGlsZWRNYXAuUmVuZGVyT3JkZXIuUmlnaHREb3duO1xuXG4gICAgdGhpcy5fc3VwcG9ydFZlcnNpb24gPSBbMSwgMiwgMF07XG4gICAgdGhpcy5fcGFyc2VyID0gbmV3IGNjLlNBWFBhcnNlcigpO1xuICAgIHRoaXMuX29iamVjdEdyb3VwcyA9IFtdO1xuICAgIHRoaXMuX2FsbENoaWxkcmVuID0gW107XG4gICAgdGhpcy5fbWFwU2l6ZSA9IGNjLnNpemUoMCwgMCk7XG4gICAgdGhpcy5fdGlsZVNpemUgPSBjYy5zaXplKDAsIDApO1xuICAgIHRoaXMuX2xheWVycyA9IFtdO1xuICAgIHRoaXMuX3RpbGVzZXRzID0gW107XG4gICAgdGhpcy5faW1hZ2VMYXllcnMgPSBbXTtcbiAgICB0aGlzLl90aWxlUHJvcGVydGllcyA9IHt9O1xuICAgIHRoaXMuX3RpbGVBbmltYXRpb25zID0ge307XG4gICAgdGhpcy5fdHN4TWFwID0gbnVsbDtcblxuICAgIC8vIG1hcCBvZiB0ZXh0dXJlcyBpbmRleGVkIGJ5IG5hbWVcbiAgICB0aGlzLl90ZXh0dXJlcyA9IG51bGw7XG5cbiAgICAvLyBoZXggbWFwIHZhbHVlc1xuICAgIHRoaXMuX3N0YWdnZXJBeGlzID0gbnVsbDtcbiAgICB0aGlzLl9zdGFnZ2VySW5kZXggPSBudWxsO1xuICAgIHRoaXMuX2hleFNpZGVMZW5ndGggPSAwO1xuXG4gICAgdGhpcy5faW1hZ2VMYXllclRleHR1cmVzID0gbnVsbDtcblxuICAgIHRoaXMuaW5pdFdpdGhYTUwodG14RmlsZSwgdHN4TWFwLCB0ZXh0dXJlcywgdGV4dHVyZVNpemVzLCBpbWFnZUxheWVyVGV4dHVyZXMpO1xufTtcbmNjLlRNWE1hcEluZm8ucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBjYy5UTVhNYXBJbmZvLFxuICAgIC8qKlxuICAgICAqIEdldHMgTWFwIG9yaWVudGF0aW9uLlxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRPcmllbnRhdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9yaWVudGF0aW9uO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIE1hcCBvcmllbnRhdGlvbi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWVcbiAgICAgKi9cbiAgICBzZXRPcmllbnRhdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHZhbHVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBzdGFnZ2VyQXhpcyBvZiBtYXAuXG4gICAgICogQHJldHVybiB7Y2MuVGlsZWRNYXAuU3RhZ2dlckF4aXN9XG4gICAgICovXG4gICAgZ2V0U3RhZ2dlckF4aXMgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3RhZ2dlckF4aXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgc3RhZ2dlckF4aXMgb2YgbWFwLlxuICAgICAqIEBwYXJhbSB7Y2MuVGlsZWRNYXAuU3RhZ2dlckF4aXN9IHZhbHVlXG4gICAgICovXG4gICAgc2V0U3RhZ2dlckF4aXMgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3N0YWdnZXJBeGlzID0gdmFsdWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldHMgc3RhZ2dlciBpbmRleFxuICAgICAqIEByZXR1cm4ge2NjLlRpbGVkTWFwLlN0YWdnZXJJbmRleH1cbiAgICAgKi9cbiAgICBnZXRTdGFnZ2VySW5kZXggKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3RhZ2dlckluZGV4O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIHN0YWdnZXIgaW5kZXguXG4gICAgICogQHBhcmFtIHtjYy5UaWxlZE1hcC5TdGFnZ2VySW5kZXh9IHZhbHVlXG4gICAgICovXG4gICAgc2V0U3RhZ2dlckluZGV4ICh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9zdGFnZ2VySW5kZXggPSB2YWx1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyBIZXggc2lkZSBsZW5ndGguXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldEhleFNpZGVMZW5ndGggKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faGV4U2lkZUxlbmd0aDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBIZXggc2lkZSBsZW5ndGguXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlXG4gICAgICovXG4gICAgc2V0SGV4U2lkZUxlbmd0aCAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5faGV4U2lkZUxlbmd0aCA9IHZhbHVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBNYXAgd2lkdGggJiBoZWlnaHRcbiAgICAgKiBAcmV0dXJuIHtTaXplfVxuICAgICAqL1xuICAgIGdldE1hcFNpemUgKCkge1xuICAgICAgICByZXR1cm4gY2Muc2l6ZSh0aGlzLl9tYXBTaXplLndpZHRoLCB0aGlzLl9tYXBTaXplLmhlaWdodCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE1hcCB3aWR0aCAmIGhlaWdodFxuICAgICAqIEBwYXJhbSB7U2l6ZX0gdmFsdWVcbiAgICAgKi9cbiAgICBzZXRNYXBTaXplICh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9tYXBTaXplLndpZHRoID0gdmFsdWUud2lkdGg7XG4gICAgICAgIHRoaXMuX21hcFNpemUuaGVpZ2h0ID0gdmFsdWUuaGVpZ2h0O1xuICAgIH0sXG5cbiAgICBfZ2V0TWFwV2lkdGggKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFwU2l6ZS53aWR0aDtcbiAgICB9LFxuICAgIF9zZXRNYXBXaWR0aCAod2lkdGgpIHtcbiAgICAgICAgdGhpcy5fbWFwU2l6ZS53aWR0aCA9IHdpZHRoO1xuICAgIH0sXG4gICAgX2dldE1hcEhlaWdodCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXBTaXplLmhlaWdodDtcbiAgICB9LFxuICAgIF9zZXRNYXBIZWlnaHQgKGhlaWdodCkge1xuICAgICAgICB0aGlzLl9tYXBTaXplLmhlaWdodCA9IGhlaWdodDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVGlsZXMgd2lkdGggJiBoZWlnaHRcbiAgICAgKiBAcmV0dXJuIHtTaXplfVxuICAgICAqL1xuICAgIGdldFRpbGVTaXplICgpIHtcbiAgICAgICAgcmV0dXJuIGNjLnNpemUodGhpcy5fdGlsZVNpemUud2lkdGgsIHRoaXMuX3RpbGVTaXplLmhlaWdodCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRpbGVzIHdpZHRoICYgaGVpZ2h0XG4gICAgICogQHBhcmFtIHtTaXplfSB2YWx1ZVxuICAgICAqL1xuICAgIHNldFRpbGVTaXplICh2YWx1ZSkge1xuICAgICAgICB0aGlzLl90aWxlU2l6ZS53aWR0aCA9IHZhbHVlLndpZHRoO1xuICAgICAgICB0aGlzLl90aWxlU2l6ZS5oZWlnaHQgPSB2YWx1ZS5oZWlnaHQ7XG4gICAgfSxcblxuICAgIF9nZXRUaWxlV2lkdGggKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGlsZVNpemUud2lkdGg7XG4gICAgfSxcbiAgICBfc2V0VGlsZVdpZHRoICh3aWR0aCkge1xuICAgICAgICB0aGlzLl90aWxlU2l6ZS53aWR0aCA9IHdpZHRoO1xuICAgIH0sXG4gICAgX2dldFRpbGVIZWlnaHQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGlsZVNpemUuaGVpZ2h0O1xuICAgIH0sXG4gICAgX3NldFRpbGVIZWlnaHQgKGhlaWdodCkge1xuICAgICAgICB0aGlzLl90aWxlU2l6ZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIExheWVyc1xuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIGdldExheWVycyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sYXllcnM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIExheWVyc1xuICAgICAqIEBwYXJhbSB7Y2MuVE1YTGF5ZXJJbmZvfSB2YWx1ZVxuICAgICAqL1xuICAgIHNldExheWVycyAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fYWxsQ2hpbGRyZW4ucHVzaCh2YWx1ZSk7XG4gICAgICAgIHRoaXMuX2xheWVycy5wdXNoKHZhbHVlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSW1hZ2VMYXllcnNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKi9cbiAgICBnZXRJbWFnZUxheWVycyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbWFnZUxheWVycztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSW1hZ2VMYXllcnNcbiAgICAgKiBAcGFyYW0ge2NjLlRNWEltYWdlTGF5ZXJJbmZvfSB2YWx1ZVxuICAgICAqL1xuICAgIHNldEltYWdlTGF5ZXJzICh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9hbGxDaGlsZHJlbi5wdXNoKHZhbHVlKTtcbiAgICAgICAgdGhpcy5faW1hZ2VMYXllcnMucHVzaCh2YWx1ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHRpbGVzZXRzXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgZ2V0VGlsZXNldHMgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGlsZXNldHM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHRpbGVzZXRzXG4gICAgICogQHBhcmFtIHtjYy5UTVhUaWxlc2V0SW5mb30gdmFsdWVcbiAgICAgKi9cbiAgICBzZXRUaWxlc2V0cyAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fdGlsZXNldHMucHVzaCh2YWx1ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE9iamVjdEdyb3Vwc1xuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIGdldE9iamVjdEdyb3VwcyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vYmplY3RHcm91cHM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE9iamVjdEdyb3Vwc1xuICAgICAqIEBwYXJhbSB7Y2MuVE1YT2JqZWN0R3JvdXB9IHZhbHVlXG4gICAgICovXG4gICAgc2V0T2JqZWN0R3JvdXBzICh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9hbGxDaGlsZHJlbi5wdXNoKHZhbHVlKTtcbiAgICAgICAgdGhpcy5fb2JqZWN0R3JvdXBzLnB1c2godmFsdWUpO1xuICAgIH0sXG5cbiAgICBnZXRBbGxDaGlsZHJlbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hbGxDaGlsZHJlbjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcGFyZW50IGVsZW1lbnRcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0UGFyZW50RWxlbWVudCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudEVsZW1lbnQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHBhcmVudCBlbGVtZW50XG4gICAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlXG4gICAgICovXG4gICAgc2V0UGFyZW50RWxlbWVudCAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50ID0gdmFsdWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHBhcmVudCBHSURcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0UGFyZW50R0lEICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50R0lEO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBwYXJlbnQgR0lEXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlXG4gICAgICovXG4gICAgc2V0UGFyZW50R0lEICh2YWx1ZSkge1xuICAgICAgICB0aGlzLnBhcmVudEdJRCA9IHZhbHVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBMYXllciBhdHRyaWJ1dGVcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0TGF5ZXJBdHRyaWJzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGF5ZXJBdHRycztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTGF5ZXIgYXR0cmlidXRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlXG4gICAgICovXG4gICAgc2V0TGF5ZXJBdHRyaWJzICh2YWx1ZSkge1xuICAgICAgICB0aGlzLmxheWVyQXR0cnMgPSB2YWx1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSXMgcmVhZGluZyBzdG9yaW5nIGNoYXJhY3RlcnMgc3RyZWFtXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBnZXRTdG9yaW5nQ2hhcmFjdGVycyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JpbmdDaGFyYWN0ZXJzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJcyByZWFkaW5nIHN0b3JpbmcgY2hhcmFjdGVycyBzdHJlYW1cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHZhbHVlXG4gICAgICovXG4gICAgc2V0U3RvcmluZ0NoYXJhY3RlcnMgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuc3RvcmluZ0NoYXJhY3RlcnMgPSB2YWx1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUHJvcGVydGllc1xuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIGdldFByb3BlcnRpZXMgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBQcm9wZXJ0aWVzXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHZhbHVlXG4gICAgICovXG4gICAgc2V0UHJvcGVydGllcyAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gdmFsdWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGluaXRpYWxpemVzIGEgVE1YIGZvcm1hdCB3aXRoIGFuIFhNTCBzdHJpbmcgYW5kIGEgVE1YIHJlc291cmNlIHBhdGhcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdG14U3RyaW5nXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRzeE1hcFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0ZXh0dXJlc1xuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaW5pdFdpdGhYTUwgKHRteFN0cmluZywgdHN4TWFwLCB0ZXh0dXJlcywgdGV4dHVyZVNpemVzLCBpbWFnZUxheWVyVGV4dHVyZXMpIHtcbiAgICAgICAgdGhpcy5fdGlsZXNldHMubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5fbGF5ZXJzLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuX2ltYWdlTGF5ZXJzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgdGhpcy5fdHN4TWFwID0gdHN4TWFwO1xuICAgICAgICB0aGlzLl90ZXh0dXJlcyA9IHRleHR1cmVzO1xuICAgICAgICB0aGlzLl9pbWFnZUxheWVyVGV4dHVyZXMgPSBpbWFnZUxheWVyVGV4dHVyZXM7XG4gICAgICAgIHRoaXMuX3RleHR1cmVTaXplcyA9IHRleHR1cmVTaXplcztcblxuICAgICAgICB0aGlzLl9vYmplY3RHcm91cHMubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5fYWxsQ2hpbGRyZW4ubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuX3RpbGVQcm9wZXJ0aWVzID0ge307XG4gICAgICAgIHRoaXMuX3RpbGVBbmltYXRpb25zID0ge307XG5cbiAgICAgICAgLy8gdG1wIHZhcnNcbiAgICAgICAgdGhpcy5jdXJyZW50U3RyaW5nID0gXCJcIjtcbiAgICAgICAgdGhpcy5zdG9yaW5nQ2hhcmFjdGVycyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxheWVyQXR0cnMgPSBjYy5UTVhMYXllckluZm8uQVRUUklCX05PTkU7XG4gICAgICAgIHRoaXMucGFyZW50RWxlbWVudCA9IGNjLlRpbGVkTWFwLk5PTkU7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VYTUxTdHJpbmcodG14U3RyaW5nKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgcGFyc2luZyBvZiBhbiBYTUwgc3RyaW5nLCBlaXRoZXIgYSB0bXggKE1hcCkgc3RyaW5nIG9yIHRzeCAoVGlsZXNldCkgc3RyaW5nXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHhtbFN0cmluZ1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0aWxlc2V0Rmlyc3RHaWRcbiAgICAgKiBAcmV0dXJuIHtFbGVtZW50fVxuICAgICAqL1xuICAgIHBhcnNlWE1MU3RyaW5nICh4bWxTdHIsIHRpbGVzZXRGaXJzdEdpZCkge1xuICAgICAgICBsZXQgbWFwWE1MID0gdGhpcy5fcGFyc2VyLl9wYXJzZVhNTCh4bWxTdHIpO1xuICAgICAgICBsZXQgaTtcblxuICAgICAgICAvLyBQQVJTRSA8bWFwPlxuICAgICAgICBsZXQgbWFwID0gbWFwWE1MLmRvY3VtZW50RWxlbWVudDtcblxuICAgICAgICBsZXQgb3JpZW50YXRpb25TdHIgPSBtYXAuZ2V0QXR0cmlidXRlKCdvcmllbnRhdGlvbicpO1xuICAgICAgICBsZXQgc3RhZ2dlckF4aXNTdHIgPSBtYXAuZ2V0QXR0cmlidXRlKCdzdGFnZ2VyYXhpcycpO1xuICAgICAgICBsZXQgc3RhZ2dlckluZGV4U3RyID0gbWFwLmdldEF0dHJpYnV0ZSgnc3RhZ2dlcmluZGV4Jyk7XG4gICAgICAgIGxldCBoZXhTaWRlTGVuZ3RoU3RyID0gbWFwLmdldEF0dHJpYnV0ZSgnaGV4c2lkZWxlbmd0aCcpO1xuICAgICAgICBsZXQgcmVuZGVyb3JkZXJTdHIgPSBtYXAuZ2V0QXR0cmlidXRlKCdyZW5kZXJvcmRlcicpO1xuICAgICAgICBsZXQgdmVyc2lvbiA9IG1hcC5nZXRBdHRyaWJ1dGUoJ3ZlcnNpb24nKSB8fCAnMS4wLjAnO1xuXG4gICAgICAgIGlmIChtYXAubm9kZU5hbWUgPT09IFwibWFwXCIpIHtcbiAgICAgICAgICAgIGxldCB2ZXJzaW9uQXJyID0gdmVyc2lvbi5zcGxpdCgnLicpO1xuICAgICAgICAgICAgbGV0IHN1cHBvcnRWZXJzaW9uID0gdGhpcy5fc3VwcG9ydFZlcnNpb247XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1cHBvcnRWZXJzaW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHYgPSBwYXJzZUludCh2ZXJzaW9uQXJyW2ldKSB8fCAwO1xuICAgICAgICAgICAgICAgIGxldCBzdiA9IHN1cHBvcnRWZXJzaW9uW2ldO1xuICAgICAgICAgICAgICAgIGlmIChzdiA8IHYpIHtcbiAgICAgICAgICAgICAgICAgICAgY2MubG9nSUQoNzIxNiwgdmVyc2lvbik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gICBcblxuICAgICAgICAgICAgaWYgKG9yaWVudGF0aW9uU3RyID09PSBcIm9ydGhvZ29uYWxcIilcbiAgICAgICAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gY2MuVGlsZWRNYXAuT3JpZW50YXRpb24uT1JUSE87XG4gICAgICAgICAgICBlbHNlIGlmIChvcmllbnRhdGlvblN0ciA9PT0gXCJpc29tZXRyaWNcIilcbiAgICAgICAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gY2MuVGlsZWRNYXAuT3JpZW50YXRpb24uSVNPO1xuICAgICAgICAgICAgZWxzZSBpZiAob3JpZW50YXRpb25TdHIgPT09IFwiaGV4YWdvbmFsXCIpXG4gICAgICAgICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IGNjLlRpbGVkTWFwLk9yaWVudGF0aW9uLkhFWDtcbiAgICAgICAgICAgIGVsc2UgaWYgKG9yaWVudGF0aW9uU3RyICE9PSBudWxsKVxuICAgICAgICAgICAgICAgIGNjLmxvZ0lEKDcyMTcsIG9yaWVudGF0aW9uU3RyKTtcblxuICAgICAgICAgICAgaWYgKHJlbmRlcm9yZGVyU3RyID09PSAncmlnaHQtdXAnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJPcmRlciA9IGNjLlRpbGVkTWFwLlJlbmRlck9yZGVyLlJpZ2h0VXA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlbmRlcm9yZGVyU3RyID09PSAnbGVmdC11cCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlck9yZGVyID0gY2MuVGlsZWRNYXAuUmVuZGVyT3JkZXIuTGVmdFVwO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyZW5kZXJvcmRlclN0ciA9PT0gJ2xlZnQtZG93bicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlck9yZGVyID0gY2MuVGlsZWRNYXAuUmVuZGVyT3JkZXIuTGVmdERvd247XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyT3JkZXIgPSBjYy5UaWxlZE1hcC5SZW5kZXJPcmRlci5SaWdodERvd247XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdGFnZ2VyQXhpc1N0ciA9PT0gJ3gnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGFnZ2VyQXhpcyhjYy5UaWxlZE1hcC5TdGFnZ2VyQXhpcy5TVEFHR0VSQVhJU19YKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHN0YWdnZXJBeGlzU3RyID09PSAneScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YWdnZXJBeGlzKGNjLlRpbGVkTWFwLlN0YWdnZXJBeGlzLlNUQUdHRVJBWElTX1kpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc3RhZ2dlckluZGV4U3RyID09PSAnb2RkJykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhZ2dlckluZGV4KGNjLlRpbGVkTWFwLlN0YWdnZXJJbmRleC5TVEFHR0VSSU5ERVhfT0REKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHN0YWdnZXJJbmRleFN0ciA9PT0gJ2V2ZW4nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGFnZ2VySW5kZXgoY2MuVGlsZWRNYXAuU3RhZ2dlckluZGV4LlNUQUdHRVJJTkRFWF9FVkVOKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGhleFNpZGVMZW5ndGhTdHIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEhleFNpZGVMZW5ndGgocGFyc2VGbG9hdChoZXhTaWRlTGVuZ3RoU3RyKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBtYXBTaXplID0gY2Muc2l6ZSgwLCAwKTtcbiAgICAgICAgICAgIG1hcFNpemUud2lkdGggPSBwYXJzZUZsb2F0KG1hcC5nZXRBdHRyaWJ1dGUoJ3dpZHRoJykpO1xuICAgICAgICAgICAgbWFwU2l6ZS5oZWlnaHQgPSBwYXJzZUZsb2F0KG1hcC5nZXRBdHRyaWJ1dGUoJ2hlaWdodCcpKTtcbiAgICAgICAgICAgIHRoaXMuc2V0TWFwU2l6ZShtYXBTaXplKTtcblxuICAgICAgICAgICAgbWFwU2l6ZSA9IGNjLnNpemUoMCwgMCk7XG4gICAgICAgICAgICBtYXBTaXplLndpZHRoID0gcGFyc2VGbG9hdChtYXAuZ2V0QXR0cmlidXRlKCd0aWxld2lkdGgnKSk7XG4gICAgICAgICAgICBtYXBTaXplLmhlaWdodCA9IHBhcnNlRmxvYXQobWFwLmdldEF0dHJpYnV0ZSgndGlsZWhlaWdodCcpKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VGlsZVNpemUobWFwU2l6ZSk7XG5cbiAgICAgICAgICAgIC8vIFRoZSBwYXJlbnQgZWxlbWVudCBpcyB0aGUgbWFwXG4gICAgICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBnZXRQcm9wZXJ0eUxpc3QobWFwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBBUlNFIDx0aWxlc2V0PlxuICAgICAgICBsZXQgdGlsZXNldHMgPSBtYXAuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RpbGVzZXQnKTtcbiAgICAgICAgaWYgKG1hcC5ub2RlTmFtZSAhPT0gXCJtYXBcIikge1xuICAgICAgICAgICAgdGlsZXNldHMgPSBbXTtcbiAgICAgICAgICAgIHRpbGVzZXRzLnB1c2gobWFwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aWxlc2V0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHNlbFRpbGVzZXQgPSB0aWxlc2V0c1tpXTtcbiAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgYW4gZXh0ZXJuYWwgdGlsZXNldCB0aGVuIHN0YXJ0IHBhcnNpbmcgdGhhdFxuICAgICAgICAgICAgbGV0IHRzeE5hbWUgPSBzZWxUaWxlc2V0LmdldEF0dHJpYnV0ZSgnc291cmNlJyk7XG4gICAgICAgICAgICBpZiAodHN4TmFtZSkge1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50Rmlyc3RHSUQgPSBwYXJzZUludChzZWxUaWxlc2V0LmdldEF0dHJpYnV0ZSgnZmlyc3RnaWQnKSk7XG4gICAgICAgICAgICAgICAgbGV0IHRzeFhtbFN0cmluZyA9IHRoaXMuX3RzeE1hcFt0c3hOYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAodHN4WG1sU3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VYTUxTdHJpbmcodHN4WG1sU3RyaW5nLCBjdXJyZW50Rmlyc3RHSUQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGltYWdlcyA9IHNlbFRpbGVzZXQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ltYWdlJyk7XG4gICAgICAgICAgICAgICAgbGV0IG11bHRpVGV4dHVyZXMgPSBpbWFnZXMubGVuZ3RoID4gMTtcbiAgICAgICAgICAgICAgICBsZXQgaW1hZ2UgPSBpbWFnZXNbMF07XG4gICAgICAgICAgICAgICAgbGV0IGZpcnN0SW1hZ2VOYW1lID0gaW1hZ2UuZ2V0QXR0cmlidXRlKCdzb3VyY2UnKTtcbiAgICAgICAgICAgICAgICBmaXJzdEltYWdlTmFtZSA9IGZpcnN0SW1hZ2VOYW1lLnJlcGxhY2UoL1xcXFwvZywgJ1xcLycpO1xuXG4gICAgICAgICAgICAgICAgbGV0IHRpbGVzID0gc2VsVGlsZXNldC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGlsZScpO1xuICAgICAgICAgICAgICAgIGxldCB0aWxlQ291bnQgPSB0aWxlcyAmJiB0aWxlcy5sZW5ndGggfHwgMTtcbiAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICBsZXQgdGlsZXNldE5hbWUgPSBzZWxUaWxlc2V0LmdldEF0dHJpYnV0ZSgnbmFtZScpIHx8IFwiXCI7XG4gICAgICAgICAgICAgICAgbGV0IHRpbGVzZXRTcGFjaW5nID0gcGFyc2VJbnQoc2VsVGlsZXNldC5nZXRBdHRyaWJ1dGUoJ3NwYWNpbmcnKSkgfHwgMDtcbiAgICAgICAgICAgICAgICBsZXQgdGlsZXNldE1hcmdpbiA9IHBhcnNlSW50KHNlbFRpbGVzZXQuZ2V0QXR0cmlidXRlKCdtYXJnaW4nKSkgfHwgMDtcbiAgICAgICAgICAgICAgICBsZXQgZmdpZCA9IHBhcnNlSW50KHRpbGVzZXRGaXJzdEdpZCk7XG4gICAgICAgICAgICAgICAgaWYgKCFmZ2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZnaWQgPSBwYXJzZUludChzZWxUaWxlc2V0LmdldEF0dHJpYnV0ZSgnZmlyc3RnaWQnKSkgfHwgMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgdGlsZXNldFNpemUgPSBjYy5zaXplKDAsIDApO1xuICAgICAgICAgICAgICAgIHRpbGVzZXRTaXplLndpZHRoID0gcGFyc2VGbG9hdChzZWxUaWxlc2V0LmdldEF0dHJpYnV0ZSgndGlsZXdpZHRoJykpO1xuICAgICAgICAgICAgICAgIHRpbGVzZXRTaXplLmhlaWdodCA9IHBhcnNlRmxvYXQoc2VsVGlsZXNldC5nZXRBdHRyaWJ1dGUoJ3RpbGVoZWlnaHQnKSk7XG5cbiAgICAgICAgICAgICAgICAvLyBwYXJzZSB0aWxlIG9mZnNldFxuICAgICAgICAgICAgICAgIGxldCBvZmZzZXQgPSBzZWxUaWxlc2V0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aWxlb2Zmc2V0JylbMF07XG4gICAgICAgICAgICAgICAgbGV0IHRpbGVPZmZzZXQgPSBjYy52MigwLCAwKTtcbiAgICAgICAgICAgICAgICBpZiAob2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRpbGVPZmZzZXQueCA9IHBhcnNlRmxvYXQob2Zmc2V0LmdldEF0dHJpYnV0ZSgneCcpKTtcbiAgICAgICAgICAgICAgICAgICAgdGlsZU9mZnNldC55ID0gcGFyc2VGbG9hdChvZmZzZXQuZ2V0QXR0cmlidXRlKCd5JykpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCB0aWxlc2V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB0aWxlSWR4ID0gMDsgdGlsZUlkeCA8IHRpbGVDb3VudDsgdGlsZUlkeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGlsZXNldCB8fCBtdWx0aVRleHR1cmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlc2V0ID0gbmV3IGNjLlRNWFRpbGVzZXRJbmZvKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlc2V0Lm5hbWUgPSB0aWxlc2V0TmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVzZXQuZmlyc3RHaWQgPSBmZ2lkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlc2V0LnNwYWNpbmcgPSB0aWxlc2V0U3BhY2luZztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVzZXQubWFyZ2luID0gdGlsZXNldE1hcmdpbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVzZXQuX3RpbGVTaXplID0gdGlsZXNldFNpemU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlc2V0LnRpbGVPZmZzZXQgPSB0aWxlT2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZXNldC5zb3VyY2VJbWFnZSA9IHRoaXMuX3RleHR1cmVzW2ZpcnN0SW1hZ2VOYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVzZXQuaW1hZ2VTaXplID0gdGhpcy5fdGV4dHVyZVNpemVzW2ZpcnN0SW1hZ2VOYW1lXSB8fCB0aWxlc2V0LmltYWdlU2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGlsZXNldC5zb3VyY2VJbWFnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoNzIyMSwgZmlyc3RJbWFnZU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRUaWxlc2V0cyh0aWxlc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRpbGUgPSB0aWxlcyAmJiB0aWxlc1t0aWxlSWR4XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aWxlKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcmVudEdJRCA9IHBhcnNlSW50KGZnaWQpICsgcGFyc2VJbnQodGlsZS5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0aWxlSW1hZ2VzID0gdGlsZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW1hZ2UnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRpbGVJbWFnZXMgJiYgdGlsZUltYWdlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZSA9IHRpbGVJbWFnZXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW1hZ2VOYW1lID0gaW1hZ2UuZ2V0QXR0cmlidXRlKCdzb3VyY2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlTmFtZSA9IGltYWdlTmFtZS5yZXBsYWNlKC9cXFxcL2csICdcXC8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVzZXQuc291cmNlSW1hZ2UgPSB0aGlzLl90ZXh0dXJlc1tpbWFnZU5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aWxlc2V0LnNvdXJjZUltYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3JJRCg3MjIxLCBpbWFnZU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZVNpemUgPSBjYy5zaXplKDAsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZVNpemUud2lkdGggPSBwYXJzZUZsb2F0KGltYWdlLmdldEF0dHJpYnV0ZSgnd2lkdGgnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlU2l6ZS5oZWlnaHQgPSBwYXJzZUZsb2F0KGltYWdlLmdldEF0dHJpYnV0ZSgnaGVpZ2h0JykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZXNldC5fdGlsZVNpemUgPSB0aWxlU2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVzZXQuZmlyc3RHaWQgPSB0aGlzLnBhcmVudEdJRDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RpbGVQcm9wZXJ0aWVzW3RoaXMucGFyZW50R0lEXSA9IGdldFByb3BlcnR5TGlzdCh0aWxlKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFuaW1hdGlvbnMgPSB0aWxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhbmltYXRpb24nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuaW1hdGlvbnMgJiYgYW5pbWF0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYW5pbWF0aW9uID0gYW5pbWF0aW9uc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmcmFtZXNEYXRhID0gYW5pbWF0aW9uLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdmcmFtZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFuaW1hdGlvblByb3AgPSB7ZnJhbWVzOltdLCBkdDowLCBmcmFtZUlkeDowfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3RpbGVBbmltYXRpb25zW3RoaXMucGFyZW50R0lEXSA9IGFuaW1hdGlvblByb3A7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZnJhbWVzID0gYW5pbWF0aW9uUHJvcC5mcmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmcmFtZUlkeCA9IDA7IGZyYW1lSWR4IDwgZnJhbWVzRGF0YS5sZW5ndGg7IGZyYW1lSWR4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZnJhbWUgPSBmcmFtZXNEYXRhW2ZyYW1lSWR4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZWlkID0gcGFyc2VJbnQoZmdpZCkgKyBwYXJzZUludChmcmFtZS5nZXRBdHRyaWJ1dGUoJ3RpbGVpZCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZHVyYXRpb24gPSBwYXJzZUZsb2F0KGZyYW1lLmdldEF0dHJpYnV0ZSgnZHVyYXRpb24nKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJhbWVzLnB1c2goe3RpbGVpZCA6IHRpbGVpZCwgZHVyYXRpb24gOiBkdXJhdGlvbiAvIDEwMDAsIGdyaWQ6IG51bGx9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBBUlNFIDxsYXllcj4gJiA8b2JqZWN0Z3JvdXA+IGluIG9yZGVyXG4gICAgICAgIGxldCBjaGlsZE5vZGVzID0gbWFwLmNoaWxkTm9kZXM7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGROb2RlID0gY2hpbGROb2Rlc1tpXTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9zaG91bGRJZ25vcmVOb2RlKGNoaWxkTm9kZSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNoaWxkTm9kZS5ub2RlTmFtZSA9PT0gJ2ltYWdlbGF5ZXInKSB7XG4gICAgICAgICAgICAgICAgbGV0IGltYWdlTGF5ZXIgPSB0aGlzLl9wYXJzZUltYWdlTGF5ZXIoY2hpbGROb2RlKTtcbiAgICAgICAgICAgICAgICBpZiAoaW1hZ2VMYXllcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEltYWdlTGF5ZXJzKGltYWdlTGF5ZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNoaWxkTm9kZS5ub2RlTmFtZSA9PT0gJ2xheWVyJykge1xuICAgICAgICAgICAgICAgIGxldCBsYXllciA9IHRoaXMuX3BhcnNlTGF5ZXIoY2hpbGROb2RlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldExheWVycyhsYXllcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjaGlsZE5vZGUubm9kZU5hbWUgPT09ICdvYmplY3Rncm91cCcpIHtcbiAgICAgICAgICAgICAgICBsZXQgb2JqZWN0R3JvdXAgPSB0aGlzLl9wYXJzZU9iamVjdEdyb3VwKGNoaWxkTm9kZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRPYmplY3RHcm91cHMob2JqZWN0R3JvdXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICB9LFxuXG4gICAgX3Nob3VsZElnbm9yZU5vZGUgKG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IDMgLy8gdGV4dFxuICAgICAgICAgICAgfHwgbm9kZS5ub2RlVHlwZSA9PT0gOCAgIC8vIGNvbW1lbnRcbiAgICAgICAgICAgIHx8IG5vZGUubm9kZVR5cGUgPT09IDQ7ICAvLyBjZGF0YVxuICAgIH0sXG5cbiAgICBfcGFyc2VJbWFnZUxheWVyIChzZWxMYXllcikge1xuICAgICAgICBsZXQgZGF0YXMgPSBzZWxMYXllci5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW1hZ2UnKTtcbiAgICAgICAgaWYgKCFkYXRhcyB8fCBkYXRhcy5sZW5ndGggPT0gMCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgbGV0IGltYWdlTGF5ZXIgPSBuZXcgY2MuVE1YSW1hZ2VMYXllckluZm8oKTtcbiAgICAgICAgaW1hZ2VMYXllci5uYW1lID0gc2VsTGF5ZXIuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gICAgICAgIGltYWdlTGF5ZXIub2Zmc2V0LnggPSBwYXJzZUZsb2F0KHNlbExheWVyLmdldEF0dHJpYnV0ZSgnb2Zmc2V0eCcpKSB8fCAwO1xuICAgICAgICBpbWFnZUxheWVyLm9mZnNldC55ID0gcGFyc2VGbG9hdChzZWxMYXllci5nZXRBdHRyaWJ1dGUoJ29mZnNldHknKSkgfHwgMDtcbiAgICAgICAgbGV0IHZpc2libGUgPSBzZWxMYXllci5nZXRBdHRyaWJ1dGUoJ3Zpc2libGUnKTtcbiAgICAgICAgaW1hZ2VMYXllci52aXNpYmxlID0gISh2aXNpYmxlID09PSBcIjBcIik7XG5cbiAgICAgICAgbGV0IG9wYWNpdHkgPSBzZWxMYXllci5nZXRBdHRyaWJ1dGUoJ29wYWNpdHknKSB8fCAxO1xuICAgICAgICBpbWFnZUxheWVyLm9wYWNpdHkgPSBwYXJzZUludCgyNTUgKiBwYXJzZUZsb2F0KG9wYWNpdHkpKSB8fCAyNTU7XG5cbiAgICAgICAgbGV0IGRhdGEgPSBkYXRhc1swXTtcbiAgICAgICAgbGV0IHNvdXJjZSA9IGRhdGEuZ2V0QXR0cmlidXRlKCdzb3VyY2UnKTtcbiAgICAgICAgaW1hZ2VMYXllci5zb3VyY2VJbWFnZSA9IHRoaXMuX2ltYWdlTGF5ZXJUZXh0dXJlc1tzb3VyY2VdO1xuICAgICAgICBpbWFnZUxheWVyLndpZHRoID0gcGFyc2VJbnQoZGF0YS5nZXRBdHRyaWJ1dGUoJ3dpZHRoJykpIHx8IDA7XG4gICAgICAgIGltYWdlTGF5ZXIuaGVpZ2h0ID0gcGFyc2VJbnQoZGF0YS5nZXRBdHRyaWJ1dGUoJ2hlaWdodCcpKSB8fCAwO1xuICAgICAgICBpbWFnZUxheWVyLnRyYW5zID0gc3RyVG9Db2xvcihkYXRhLmdldEF0dHJpYnV0ZSgndHJhbnMnKSk7XG5cbiAgICAgICAgaWYgKCFpbWFnZUxheWVyLnNvdXJjZUltYWdlKSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDcyMjEsIHNvdXJjZSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW1hZ2VMYXllcjtcbiAgICB9LFxuIFxuICAgIF9wYXJzZUxheWVyIChzZWxMYXllcikge1xuICAgICAgICBsZXQgZGF0YSA9IHNlbExheWVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkYXRhJylbMF07XG5cbiAgICAgICAgbGV0IGxheWVyID0gbmV3IGNjLlRNWExheWVySW5mbygpO1xuICAgICAgICBsYXllci5uYW1lID0gc2VsTGF5ZXIuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG5cbiAgICAgICAgbGV0IGxheWVyU2l6ZSA9IGNjLnNpemUoMCwgMCk7XG4gICAgICAgIGxheWVyU2l6ZS53aWR0aCA9IHBhcnNlRmxvYXQoc2VsTGF5ZXIuZ2V0QXR0cmlidXRlKCd3aWR0aCcpKTtcbiAgICAgICAgbGF5ZXJTaXplLmhlaWdodCA9IHBhcnNlRmxvYXQoc2VsTGF5ZXIuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKSk7XG4gICAgICAgIGxheWVyLl9sYXllclNpemUgPSBsYXllclNpemU7XG5cbiAgICAgICAgbGV0IHZpc2libGUgPSBzZWxMYXllci5nZXRBdHRyaWJ1dGUoJ3Zpc2libGUnKTtcbiAgICAgICAgbGF5ZXIudmlzaWJsZSA9ICEodmlzaWJsZSA9PT0gXCIwXCIpO1xuXG4gICAgICAgIGxldCBvcGFjaXR5ID0gc2VsTGF5ZXIuZ2V0QXR0cmlidXRlKCdvcGFjaXR5JykgfHwgMTtcbiAgICAgICAgaWYgKG9wYWNpdHkpXG4gICAgICAgICAgICBsYXllci5fb3BhY2l0eSA9IHBhcnNlSW50KDI1NSAqIHBhcnNlRmxvYXQob3BhY2l0eSkpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBsYXllci5fb3BhY2l0eSA9IDI1NTtcbiAgICAgICAgbGF5ZXIub2Zmc2V0ID0gY2MudjIocGFyc2VGbG9hdChzZWxMYXllci5nZXRBdHRyaWJ1dGUoJ29mZnNldHgnKSkgfHwgMCwgcGFyc2VGbG9hdChzZWxMYXllci5nZXRBdHRyaWJ1dGUoJ29mZnNldHknKSkgfHwgMCk7XG5cbiAgICAgICAgbGV0IG5vZGVWYWx1ZSA9ICcnO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRhdGEuY2hpbGROb2Rlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgbm9kZVZhbHVlICs9IGRhdGEuY2hpbGROb2Rlc1tqXS5ub2RlVmFsdWVcbiAgICAgICAgfVxuICAgICAgICBub2RlVmFsdWUgPSBub2RlVmFsdWUudHJpbSgpO1xuXG4gICAgICAgIC8vIFVucGFjayB0aGUgdGlsZW1hcCBkYXRhXG4gICAgICAgIGxldCBjb21wcmVzc2lvbiA9IGRhdGEuZ2V0QXR0cmlidXRlKCdjb21wcmVzc2lvbicpO1xuICAgICAgICBsZXQgZW5jb2RpbmcgPSBkYXRhLmdldEF0dHJpYnV0ZSgnZW5jb2RpbmcnKTtcbiAgICAgICAgaWYgKGNvbXByZXNzaW9uICYmIGNvbXByZXNzaW9uICE9PSBcImd6aXBcIiAmJiBjb21wcmVzc2lvbiAhPT0gXCJ6bGliXCIpIHtcbiAgICAgICAgICAgIGNjLmxvZ0lEKDcyMTgpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHRpbGVzO1xuICAgICAgICBzd2l0Y2ggKGNvbXByZXNzaW9uKSB7XG4gICAgICAgICAgICBjYXNlICdnemlwJzpcbiAgICAgICAgICAgICAgICB0aWxlcyA9IGNvZGVjLnVuemlwQmFzZTY0QXNBcnJheShub2RlVmFsdWUsIDQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnemxpYic6XG4gICAgICAgICAgICAgICAgbGV0IGluZmxhdG9yID0gbmV3IHpsaWIuSW5mbGF0ZShjb2RlYy5CYXNlNjQuZGVjb2RlQXNBcnJheShub2RlVmFsdWUsIDEpKTtcbiAgICAgICAgICAgICAgICB0aWxlcyA9IHVpbnQ4QXJyYXlUb1VpbnQzMkFycmF5KGluZmxhdG9yLmRlY29tcHJlc3MoKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIG51bGw6XG4gICAgICAgICAgICBjYXNlICcnOlxuICAgICAgICAgICAgICAgIC8vIFVuY29tcHJlc3NlZFxuICAgICAgICAgICAgICAgIGlmIChlbmNvZGluZyA9PT0gXCJiYXNlNjRcIilcbiAgICAgICAgICAgICAgICAgICAgdGlsZXMgPSBjb2RlYy5CYXNlNjQuZGVjb2RlQXNBcnJheShub2RlVmFsdWUsIDQpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGVuY29kaW5nID09PSBcImNzdlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpbGVzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGxldCBjc3ZUaWxlcyA9IG5vZGVWYWx1ZS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBjc3ZJZHggPSAwOyBjc3ZJZHggPCBjc3ZUaWxlcy5sZW5ndGg7IGNzdklkeCsrKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZXMucHVzaChwYXJzZUludChjc3ZUaWxlc1tjc3ZJZHhdKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9YTUwgZm9ybWF0XG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxEYXRhVGlsZXMgPSBkYXRhLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGlsZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGlsZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgeG1sSWR4ID0gMDsgeG1sSWR4IDwgc2VsRGF0YVRpbGVzLmxlbmd0aDsgeG1sSWR4KyspXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlcy5wdXNoKHBhcnNlSW50KHNlbERhdGFUaWxlc1t4bWxJZHhdLmdldEF0dHJpYnV0ZShcImdpZFwiKSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGF5ZXJBdHRycyA9PT0gY2MuVE1YTGF5ZXJJbmZvLkFUVFJJQl9OT05FKVxuICAgICAgICAgICAgICAgICAgICBjYy5sb2dJRCg3MjE5KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGlsZXMpIHtcbiAgICAgICAgICAgIGxheWVyLl90aWxlcyA9IG5ldyBVaW50MzJBcnJheSh0aWxlcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgcGFyZW50IGVsZW1lbnQgaXMgdGhlIGxhc3QgbGF5ZXJcbiAgICAgICAgbGF5ZXIucHJvcGVydGllcyA9IGdldFByb3BlcnR5TGlzdChzZWxMYXllcik7XG5cbiAgICAgICAgcmV0dXJuIGxheWVyO1xuICAgIH0sXG5cbiAgICBfcGFyc2VPYmplY3RHcm91cCAoc2VsR3JvdXApIHtcbiAgICAgICAgbGV0IG9iamVjdEdyb3VwID0gbmV3IGNjLlRNWE9iamVjdEdyb3VwSW5mbygpO1xuICAgICAgICBvYmplY3RHcm91cC5uYW1lID0gc2VsR3JvdXAuZ2V0QXR0cmlidXRlKCduYW1lJykgfHwgJyc7XG4gICAgICAgIG9iamVjdEdyb3VwLm9mZnNldCA9IGNjLnYyKHBhcnNlRmxvYXQoc2VsR3JvdXAuZ2V0QXR0cmlidXRlKCdvZmZzZXR4JykpLCBwYXJzZUZsb2F0KHNlbEdyb3VwLmdldEF0dHJpYnV0ZSgnb2Zmc2V0eScpKSk7XG5cbiAgICAgICAgbGV0IG9wYWNpdHkgPSBzZWxHcm91cC5nZXRBdHRyaWJ1dGUoJ29wYWNpdHknKSB8fCAxO1xuICAgICAgICBpZiAob3BhY2l0eSlcbiAgICAgICAgICAgIG9iamVjdEdyb3VwLl9vcGFjaXR5ID0gcGFyc2VJbnQoMjU1ICogcGFyc2VGbG9hdChvcGFjaXR5KSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG9iamVjdEdyb3VwLl9vcGFjaXR5ID0gMjU1O1xuXG4gICAgICAgIGxldCB2aXNpYmxlID0gc2VsR3JvdXAuZ2V0QXR0cmlidXRlKCd2aXNpYmxlJyk7XG4gICAgICAgIGlmICh2aXNpYmxlICYmIHBhcnNlSW50KHZpc2libGUpID09PSAwKVxuICAgICAgICAgICAgb2JqZWN0R3JvdXAudmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgIGxldCBjb2xvciA9IHNlbEdyb3VwLmdldEF0dHJpYnV0ZSgnY29sb3InKTtcbiAgICAgICAgaWYgKGNvbG9yKVxuICAgICAgICAgICAgb2JqZWN0R3JvdXAuX2NvbG9yLmZyb21IRVgoY29sb3IpO1xuXG4gICAgICAgIGxldCBkcmF3b3JkZXIgPSBzZWxHcm91cC5nZXRBdHRyaWJ1dGUoJ2RyYXdvcmRlcicpO1xuICAgICAgICBpZiAoZHJhd29yZGVyKVxuICAgICAgICAgICAgb2JqZWN0R3JvdXAuX2RyYXdvcmRlciA9IGRyYXdvcmRlcjtcblxuICAgICAgICAvLyBzZXQgdGhlIHByb3BlcnRpZXMgdG8gdGhlIGdyb3VwXG4gICAgICAgIG9iamVjdEdyb3VwLnNldFByb3BlcnRpZXMoZ2V0UHJvcGVydHlMaXN0KHNlbEdyb3VwKSk7XG5cbiAgICAgICAgbGV0IG9iamVjdHMgPSBzZWxHcm91cC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnb2JqZWN0Jyk7XG4gICAgICAgIGlmIChvYmplY3RzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG9iamVjdHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgc2VsT2JqID0gb2JqZWN0c1tqXTtcbiAgICAgICAgICAgICAgICAvLyBUaGUgdmFsdWUgZm9yIFwidHlwZVwiIHdhcyBibGFuayBvciBub3QgYSB2YWxpZCBjbGFzcyBuYW1lXG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGFuIGluc3RhbmNlIG9mIFRNWE9iamVjdEluZm8gdG8gc3RvcmUgdGhlIG9iamVjdCBhbmQgaXRzIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICBsZXQgb2JqZWN0UHJvcCA9IHt9O1xuXG4gICAgICAgICAgICAgICAgLy8gU2V0IHRoZSBpZCBvZiB0aGUgb2JqZWN0XG4gICAgICAgICAgICAgICAgb2JqZWN0UHJvcFsnaWQnXSA9IHNlbE9iai5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgajtcblxuICAgICAgICAgICAgICAgIC8vIFNldCB0aGUgbmFtZSBvZiB0aGUgb2JqZWN0IHRvIHRoZSB2YWx1ZSBmb3IgXCJuYW1lXCJcbiAgICAgICAgICAgICAgICBvYmplY3RQcm9wW1wibmFtZVwiXSA9IHNlbE9iai5nZXRBdHRyaWJ1dGUoJ25hbWUnKSB8fCBcIlwiO1xuXG4gICAgICAgICAgICAgICAgLy8gQXNzaWduIGFsbCB0aGUgYXR0cmlidXRlcyBhcyBrZXkvbmFtZSBwYWlycyBpbiB0aGUgcHJvcGVydGllcyBkaWN0aW9uYXJ5XG4gICAgICAgICAgICAgICAgb2JqZWN0UHJvcFtcIndpZHRoXCJdID0gcGFyc2VGbG9hdChzZWxPYmouZ2V0QXR0cmlidXRlKCd3aWR0aCcpKSB8fCAwO1xuICAgICAgICAgICAgICAgIG9iamVjdFByb3BbXCJoZWlnaHRcIl0gPSBwYXJzZUZsb2F0KHNlbE9iai5nZXRBdHRyaWJ1dGUoJ2hlaWdodCcpKSB8fCAwO1xuXG4gICAgICAgICAgICAgICAgb2JqZWN0UHJvcFtcInhcIl0gPSBwYXJzZUZsb2F0KHNlbE9iai5nZXRBdHRyaWJ1dGUoJ3gnKSkgfHwgMDtcbiAgICAgICAgICAgICAgICBvYmplY3RQcm9wW1wieVwiXSA9IHBhcnNlRmxvYXQoc2VsT2JqLmdldEF0dHJpYnV0ZSgneScpKSB8fCAwO1xuXG4gICAgICAgICAgICAgICAgb2JqZWN0UHJvcFtcInJvdGF0aW9uXCJdID0gcGFyc2VGbG9hdChzZWxPYmouZ2V0QXR0cmlidXRlKCdyb3RhdGlvbicpKSB8fCAwO1xuXG4gICAgICAgICAgICAgICAgZ2V0UHJvcGVydHlMaXN0KHNlbE9iaiwgb2JqZWN0UHJvcCk7XG5cbiAgICAgICAgICAgICAgICAvLyB2aXNpYmxlXG4gICAgICAgICAgICAgICAgbGV0IHZpc2libGVBdHRyID0gc2VsT2JqLmdldEF0dHJpYnV0ZSgndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgIG9iamVjdFByb3BbJ3Zpc2libGUnXSA9ICEodmlzaWJsZUF0dHIgJiYgcGFyc2VJbnQodmlzaWJsZUF0dHIpID09PSAwKTtcblxuICAgICAgICAgICAgICAgIC8vIHRleHRcbiAgICAgICAgICAgICAgICBsZXQgdGV4dHMgPSBzZWxPYmouZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RleHQnKTtcbiAgICAgICAgICAgICAgICBpZiAodGV4dHMgJiYgdGV4dHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGV4dCA9IHRleHRzWzBdO1xuICAgICAgICAgICAgICAgICAgICBvYmplY3RQcm9wWyd0eXBlJ10gPSBjYy5UaWxlZE1hcC5UTVhPYmplY3RUeXBlLlRFWFQ7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFByb3BbJ3dyYXAnXSA9IHRleHQuZ2V0QXR0cmlidXRlKCd3cmFwJykgPT0gJzEnO1xuICAgICAgICAgICAgICAgICAgICBvYmplY3RQcm9wWydjb2xvciddID0gc3RyVG9Db2xvcih0ZXh0LmdldEF0dHJpYnV0ZSgnY29sb3InKSk7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFByb3BbJ2hhbGlnbiddID0gc3RyVG9IQWxpZ24odGV4dC5nZXRBdHRyaWJ1dGUoJ2hhbGlnbicpKTtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0UHJvcFsndmFsaWduJ10gPSBzdHJUb1ZBbGlnbih0ZXh0LmdldEF0dHJpYnV0ZSgndmFsaWduJykpO1xuICAgICAgICAgICAgICAgICAgICBvYmplY3RQcm9wWydwaXhlbHNpemUnXSA9IHBhcnNlSW50KHRleHQuZ2V0QXR0cmlidXRlKCdwaXhlbHNpemUnKSkgfHwgMTY7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFByb3BbJ3RleHQnXSA9IHRleHQuY2hpbGROb2Rlc1swXS5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gaW1hZ2VcbiAgICAgICAgICAgICAgICBsZXQgZ2lkID0gc2VsT2JqLmdldEF0dHJpYnV0ZSgnZ2lkJyk7XG4gICAgICAgICAgICAgICAgaWYgKGdpZCkge1xuICAgICAgICAgICAgICAgICAgICBvYmplY3RQcm9wWydnaWQnXSA9IHBhcnNlSW50KGdpZCk7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFByb3BbJ3R5cGUnXSA9IGNjLlRpbGVkTWFwLlRNWE9iamVjdFR5cGUuSU1BR0U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gZWxsaXBzZVxuICAgICAgICAgICAgICAgIGxldCBlbGxpcHNlID0gc2VsT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdlbGxpcHNlJyk7XG4gICAgICAgICAgICAgICAgaWYgKGVsbGlwc2UgJiYgZWxsaXBzZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFByb3BbJ3R5cGUnXSA9IGNjLlRpbGVkTWFwLlRNWE9iamVjdFR5cGUuRUxMSVBTRTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL3BvbHlnb25cbiAgICAgICAgICAgICAgICBsZXQgcG9seWdvblByb3BzID0gc2VsT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwicG9seWdvblwiKTtcbiAgICAgICAgICAgICAgICBpZiAocG9seWdvblByb3BzICYmIHBvbHlnb25Qcm9wcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFByb3BbJ3R5cGUnXSA9IGNjLlRpbGVkTWFwLlRNWE9iamVjdFR5cGUuUE9MWUdPTjtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbFBnUG9pbnRTdHIgPSBwb2x5Z29uUHJvcHNbMF0uZ2V0QXR0cmlidXRlKCdwb2ludHMnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbFBnUG9pbnRTdHIpXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RQcm9wW1wicG9pbnRzXCJdID0gdGhpcy5fcGFyc2VQb2ludHNTdHJpbmcoc2VsUGdQb2ludFN0cik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9wb2x5bGluZVxuICAgICAgICAgICAgICAgIGxldCBwb2x5bGluZVByb3BzID0gc2VsT2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwicG9seWxpbmVcIik7XG4gICAgICAgICAgICAgICAgaWYgKHBvbHlsaW5lUHJvcHMgJiYgcG9seWxpbmVQcm9wcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFByb3BbJ3R5cGUnXSA9IGNjLlRpbGVkTWFwLlRNWE9iamVjdFR5cGUuUE9MWUxJTkU7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxQbFBvaW50U3RyID0gcG9seWxpbmVQcm9wc1swXS5nZXRBdHRyaWJ1dGUoJ3BvaW50cycpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsUGxQb2ludFN0cilcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFByb3BbXCJwb2x5bGluZVBvaW50c1wiXSA9IHRoaXMuX3BhcnNlUG9pbnRzU3RyaW5nKHNlbFBsUG9pbnRTdHIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghb2JqZWN0UHJvcFsndHlwZSddKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFByb3BbJ3R5cGUnXSA9IGNjLlRpbGVkTWFwLlRNWE9iamVjdFR5cGUuUkVDVDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgdGhlIG9iamVjdCB0byB0aGUgb2JqZWN0R3JvdXBcbiAgICAgICAgICAgICAgICBvYmplY3RHcm91cC5fb2JqZWN0cy5wdXNoKG9iamVjdFByb3ApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZHJhd29yZGVyICE9PSAnaW5kZXgnKSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0R3JvdXAuX29iamVjdHMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS55IC0gYi55O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmplY3RHcm91cDtcbiAgICB9LFxuXG4gICAgX3BhcnNlUG9pbnRzU3RyaW5nIChwb2ludHNTdHJpbmcpIHtcbiAgICAgICAgaWYgKCFwb2ludHNTdHJpbmcpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICBsZXQgcG9pbnRzID0gW107XG4gICAgICAgIGxldCBwb2ludHNTdHIgPSBwb2ludHNTdHJpbmcuc3BsaXQoJyAnKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHNTdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBzZWxQb2ludFN0ciA9IHBvaW50c1N0cltpXS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgcG9pbnRzLnB1c2goeyd4JzogcGFyc2VGbG9hdChzZWxQb2ludFN0clswXSksICd5JzogcGFyc2VGbG9hdChzZWxQb2ludFN0clsxXSl9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcG9pbnRzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSB0aWxlIGFuaW1hdGlvbnMuXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIHNldFRpbGVBbmltYXRpb25zIChhbmltYXRpb25zKSB7XG4gICAgICAgIHRoaXMuX3RpbGVBbmltYXRpb25zID0gYW5pbWF0aW9ucztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdGlsZSBhbmltYXRpb25zLlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRUaWxlQW5pbWF0aW9ucyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90aWxlQW5pbWF0aW9ucztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdGlsZSBwcm9wZXJ0aWVzLlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRUaWxlUHJvcGVydGllcyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90aWxlUHJvcGVydGllcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSB0aWxlIHByb3BlcnRpZXMuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRpbGVQcm9wZXJ0aWVzXG4gICAgICovXG4gICAgc2V0VGlsZVByb3BlcnRpZXMgKHRpbGVQcm9wZXJ0aWVzKSB7XG4gICAgICAgIHRoaXMuX3RpbGVQcm9wZXJ0aWVzID0gdGlsZVByb3BlcnRpZXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGN1cnJlbnRTdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgZ2V0Q3VycmVudFN0cmluZyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdHJpbmc7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgY3VycmVudFN0cmluZ1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjdXJyZW50U3RyaW5nXG4gICAgICovXG4gICAgc2V0Q3VycmVudFN0cmluZyAoY3VycmVudFN0cmluZykge1xuICAgICAgICB0aGlzLmN1cnJlbnRTdHJpbmcgPSBjdXJyZW50U3RyaW5nO1xuICAgIH1cbn07XG5cbmxldCBfcCA9IGNjLlRNWE1hcEluZm8ucHJvdG90eXBlO1xuXG4vLyBFeHRlbmRlZCBwcm9wZXJ0aWVzXG5qcy5nZXRzZXQoX3AsIFwibWFwV2lkdGhcIiwgX3AuX2dldE1hcFdpZHRoLCBfcC5fc2V0TWFwV2lkdGgpO1xuanMuZ2V0c2V0KF9wLCBcIm1hcEhlaWdodFwiLCBfcC5fZ2V0TWFwSGVpZ2h0LCBfcC5fc2V0TWFwSGVpZ2h0KTtcbmpzLmdldHNldChfcCwgXCJ0aWxlV2lkdGhcIiwgX3AuX2dldFRpbGVXaWR0aCwgX3AuX3NldFRpbGVXaWR0aCk7XG5qcy5nZXRzZXQoX3AsIFwidGlsZUhlaWdodFwiLCBfcC5fZ2V0VGlsZUhlaWdodCwgX3AuX3NldFRpbGVIZWlnaHQpO1xuXG4vKipcbiAqIEBwcm9wZXJ0eSBBVFRSSUJfTk9ORVxuICogQGNvbnN0YW50XG4gKiBAc3RhdGljXG4gKiBAdHlwZSB7TnVtYmVyfVxuICogQGRlZmF1bHQgMVxuICovXG5jYy5UTVhMYXllckluZm8uQVRUUklCX05PTkUgPSAxIDw8IDA7XG4vKipcbiAqIEBwcm9wZXJ0eSBBVFRSSUJfQkFTRTY0XG4gKiBAY29uc3RhbnRcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKiBAZGVmYXVsdCAyXG4gKi9cbmNjLlRNWExheWVySW5mby5BVFRSSUJfQkFTRTY0ID0gMSA8PCAxO1xuLyoqXG4gKiBAcHJvcGVydHkgQVRUUklCX0daSVBcbiAqIEBjb25zdGFudFxuICogQHN0YXRpY1xuICogQHR5cGUge051bWJlcn1cbiAqIEBkZWZhdWx0IDRcbiAqL1xuY2MuVE1YTGF5ZXJJbmZvLkFUVFJJQl9HWklQID0gMSA8PCAyO1xuLyoqXG4gKiBAcHJvcGVydHkgQVRUUklCX1pMSUJcbiAqIEBjb25zdGFudFxuICogQHN0YXRpY1xuICogQHR5cGUge051bWJlcn1cbiAqIEBkZWZhdWx0IDhcbiAqL1xuY2MuVE1YTGF5ZXJJbmZvLkFUVFJJQl9aTElCID0gMSA8PCAzO1xuIl0sInNvdXJjZVJvb3QiOiIvIn0=