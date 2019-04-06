const path = require("path");
const log = require("log-less-fancy")();
const Map = require("./map");
var sqlite3 = require("sqlite3"); //.verbose();
const Database = require("better-sqlite3");

const dbPath = "raster_indexed.3857.mbtiles";
//const db = new Database(dbPath, { verbose: console.log });
const db = new Database(dbPath, {});
db.exec("DELETE FROM tiles");
const cmd = db.prepare("INSERT INTO tiles VALUES (?,?,?,?)");

const geojsonFile = "LA_4326.geojson";
const map = new Map(geojsonFile, 5);
const coords = map.tileCoords();
coords.forEach(co => {
  const png = map.render(co.z, co.y, co.x);
  save(dbPath, co, png);
});

writeMeta("bounds", map.bounds.join(","));
writeMeta("maxzoom", map.maxzoom);
writeMeta("format", "png");
db.close();

function writeMeta(name, value) {
  db.exec(`UPDATE metadata SET VALUE='${value}' WHERE name='${name}'`);
}

function createMbtilesFile() {
  db.exec("CREATE TABLE metadata (name text, value text)");
}

function save(dbPath, tileCoord, png) {
  const row = (2 << (tileCoord.z - 1)) - 1 - tileCoord.y;
  const x = cmd.run(tileCoord.z, tileCoord.x, row, png);
}
