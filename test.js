const fs = require("fs");
const geojsonvt = require("geojson-vt");

//const fn = "LA_3857.geojson"
const fn = "polygon.4326.geojson";
const geoJSON = JSON.parse(fs.readFileSync(fn));

const zoom = 5;
const options = {
  maxZoom: zoom,
  indexMaxZoom: zoom,
  indexMaxPoints: 0
};
var tileIndex = geojsonvt(geoJSON, options);

console.log(tileIndex.tileCoords); // [{z: 0, x: 0, y: 0}, ...]
/*
let z = 5;
let x = 17;
let y = 8;
z = 0;
x = 0;
y = 0;*/
const tiles = tileIndex.tiles;
const tile = tiles[Object.keys(tiles)[3]];
debugger;
const { x, y, z } = tile;
var allfeatures = tileIndex.getTile(z, x, y);
const feature = allfeatures.features[0];
const geom = feature.geometry;
const tags = feature.tags;
debugger;
const g = tags.g;
const b = tags.b;

// show an array of tile coordinates created so far
console.log(tileIndex.tileCoords); // [{z: 0, x: 0, y: 0}, ...]

debugger;
