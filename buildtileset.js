const path = require("path");
const log = require("log-less-fancy")();
const Map = require("./map");
var sqlite3 = require("sqlite3"); //.verbose();
const Database = require("better-sqlite3");

const dbPath = "raster_indexed.3857.mbtiles";
//var db = new sqlite3.Database(dbPath); //":memory:");
const db = new Database(dbPath, { verbose: console.log });
const cmd = db.prepare("INSERT INTO tiles VALUES (?,?,?,?)");

/*
4|7|12|�PNG
4|8|11|�PNG
4|8|12|�PNG
4|9|11|�PNG
4|9|12|�PNG

(2 << zoom_level - 1) - 1 - tile_row AS row
2 << 3 = 16
16 -1 = 15
15 - 12 = 3-4
15
*/
const geojsonFile = "LA_4326.geojson";
const map = new Map(geojsonFile);
const coords = map.tileCoords();
coords.forEach(co => {
  const png = map.render(co.z, co.y, co.x);
  save(dbPath, co, png);
});
const z = db.close();

function save(dbPath, co, png) {
  //  db.serialize(function() {
  //  db.run("CREATE TABLE lorem (info TEXT)");
  //  var stmt = db.prepare(sql);
  const row = (2 << (co.z - 1)) - 1 - co.y;
  const x = cmd.run(co.z, co.x, row, png);
  //  const y = stmt.finalize();-
  // });
}
