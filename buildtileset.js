const path = require("path");
const log = require("log-less-fancy")();
const Map = require("./map");
const Mbtiles = require("./mbtiles");

const dbPath = "raster_indexed.3857.mbtiles";
const geojsonFile = "LA_4326.geojson";
const maxzoom = 12;

const mbtiles = new Mbtiles(dbPath);

const map = new Map(geojsonFile, maxzoom);
const coords = map.tileCoords();
coords.forEach(co => {
  const png = map.render(co.z, co.y, co.x);
  mbtiles.writeTile(co, png);
});

mbtiles.writeMetadata({
  bounds: map.bounds.join(","),
  maxzoom: map.maxzoom,
  format: "png"
});
mbtiles.close();
