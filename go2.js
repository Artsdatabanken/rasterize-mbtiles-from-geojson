const fs = require("fs");

const json = read("la.geojson", "S_kode");
convert("LA");

function read(fn, kodeAttributt) {
  const json = JSON.parse(fs.readFileSync(fn));
  console.log("Feature count: " + json.features.length);
  json.features.forEach(f => {
    const kode = _hack(f.properties[kodeAttributt]);
    f.properties = { kode: kode };
  });
  return json;
}

function _hack(kode) {
  if (kode.length < 5) return kode;
  if (kode[4] == "-") return kode;
  return kode.substring(0, 4) + "-" + kode.substring(4);
}

function convert(baseName) {
  const keys = {};
  let watermark = 1;

  json.features.forEach(f => {
    const kode = f.properties.kode.replace("LA", "NN-LA-TI");
    if (!keys[kode]) {
      keys[kode] = watermark;
      watermark++;
    }
    const farge = keys[kode];
    f.properties.g = farge >> 8;
    f.properties.b = farge & 255;
    //    if (farge > 255) console.log(f.properties);
  });
  //  console.log(keys);

  basename = basename.toLowerCase();
  fs.writeFileSync(baseName + "_index.json", JSON.stringify(keys));
  fs.writeFileSync(baseName + ".geojson", JSON.stringify(json));
}
