const fs = require("fs");

function read(fn) {
  const geoJSON = JSON.parse(fs.readFileSync(fn));
  return geoJSON;
}

module.exports = { read };
