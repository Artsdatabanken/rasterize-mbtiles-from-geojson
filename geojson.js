const fs = require("fs");

function read(fn) {
  const geoJSON = JSON.parse(fs.readFileSync(fn));
  if (geoJSON.crs.properties.name.endsWith("32633")) {
    transformCoordinatesToFakeLatLon(geoJSON.features);
    geoJSON.crs = {
      type: "name",
      properties: { name: "urn:ogc:def:crs:EPSG::3857" }
    };
  }
  fs.writeFileSync("la_pseudo_3857.geojson", JSON.stringify(geoJSON));
  return geoJSON;
}

// [ -20037508.342789247632027, -20036051.919336814433336 ]
// [ 20037508.342789247632027, 20036051.919336788356304 ]

function transformCoordinatesToFakeLatLon(features) {
  // const bounds = [180, 85.05, -180, -85.05];
  const minLon = -120000;
  const minLat = 6300000;
  //  const scale = 1 / 10000;
  const bounds = [
    20037508.342789247632027,
    20037508.342789247632027,
    -20037508.342789247632027,
    -20037508.342789247632027
  ];
  const scale = 1 / 0.044;
  features.forEach(feature => {
    feature.geometry.coordinates.forEach(geoms => {
      geoms.forEach(g => {
        const [lon, lat] = g;
        g[0] = (g[0] - minLon) * scale + bounds[2];
        g[1] = (g[1] - minLat) * scale + bounds[3];
      });
    });
  });
  return bounds;
}

function projectX(x) {
  return x / 360 + 0.5;
}

function unprojectX(x) {
  return (x - 0.5) * 360;
}

function projectY(y) {
  var sin = Math.sin((y * Math.PI) / 180);
  var y2 = 0.5 - (0.25 * Math.log((1 + sin) / (1 - sin))) / Math.PI;
  return y2 < 0 ? 0 : y2 > 1 ? 1 : y2;
}

function unprojectY(y) {
  var sin = Math.sin((y * Math.PI) / 180);
  var y2 = 0.5 - (0.25 * Math.log((1 + sin) / (1 - sin))) / Math.PI;
  return y2 < 0 ? 0 : y2 > 1 ? 1 : y2;
}

module.exports = { read };
