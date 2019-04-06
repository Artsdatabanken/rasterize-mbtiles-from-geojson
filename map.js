const geojson = require("./geojson");
const geojsonvt = require("geojson-vt");
const render = require("./render");

class Map {
  constructor(fn, maxzoom = 9) {
    const gj = geojson.read(fn);
    const options = {
      maxZoom: maxzoom,
      indexMaxZoom: maxzoom,
      indexMaxPoints: 0
    };
    this.tileIndex = geojsonvt(gj, options);
    this.bounds = getBounds(gj);
    this.maxzoom = maxzoom;
    debugger;
  }

  render(z, y, x) {
    var tile = this.tileIndex.getTile(parseInt(z), parseInt(x), parseInt(y));
    if (!tile) return null;
    const f = tile.features;
    return render(f, { stroke: "#f0f", antialias: "none" });
  }

  list() {
    return JSON.stringify(this.tileIndex.tileCoords);
  }

  tileCoords() {
    return this.tileIndex.tileCoords;
  }
}

function getBounds(geojson) {
  const bounds = [180, 90, -180, -90];
  geojson.features.forEach(feature => {
    feature.geometry.coordinates.forEach(geoms => {
      geoms.forEach(g => {
        const [lon, lat] = g;
        bounds[0] = Math.min(bounds[0], lon);
        bounds[2] = Math.max(bounds[2], lon);
        bounds[1] = Math.min(bounds[1], lat);
        bounds[3] = Math.max(bounds[3], lat);
      });
    });
  });
  return bounds;
}

module.exports = Map;
