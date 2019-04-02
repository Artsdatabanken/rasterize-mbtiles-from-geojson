const geojson = require("./geojson");
const geojsonvt = require("geojson-vt");
const render = require("./render");

class Map {
  constructor(fn, zoom = 9) {
    const gj = geojson.read(fn);
    const options = {
      maxZoom: zoom,
      indexMaxZoom: zoom,
      indexMaxPoints: 0
    };
    this.tileIndex = geojsonvt(gj, options);
  }

  render(z, y, x) {
    this.tileIndex.tileCoords.forEach(t => {
      if (t.x == x && t.y == y && t.z == z) console.log(t);
    });
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

module.exports = Map;
