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
const map = new Map(geojsonFile, 11);
const coords = map.tileCoords();
coords.forEach(co => {
  const png = map.render(co.z, co.y, co.x);
  save(dbPath, co, png);
});
const z = db.close();

function save(dbPath, tileCoord, png) {
  const row = (2 << (tileCoord.z - 1)) - 1 - tileCoord.y;
  const x = cmd.run(tileCoord.z, tileCoord.x, row, png);
}
