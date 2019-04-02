const { createCanvas, loadImage } = require("canvas");

// http://localhost:8000/AO.mbtiles/4/8/3?format=png&border=rgba(128,128,128,0.2)&size=768&font=8px%20Tahoma&fontColor=rgba(0,0,0,0.3)&stroke=rgba(0,0,0,0.4)

function render(features, option) {
  const size = parseInt(option.size) || 512;
  const scaling = size / 4096; // Coordinates 0-4095 in MVT

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  ctx.antialias = option.antialias || "none";
  ctx.quality = "nearest";
  ctx.patternQuality = "nearest";
  ctx.imageSmoothingEnabled = false;
  ctx.imageRendering = "pixelated";
  debugger;

  ctx.clearRect(0, 0, size, size);
  border(ctx, option.border, size);
  ctx.strokeStyle = option.stroke || "none";
  ctx.lineWidth = 1;
  drawGeometries(ctx, features, scaling);

  return canvas.toBuffer();
}

function drawGeometries(ctx, features, scaling) {
  features.forEach(feature => {
    let { g, b } = feature.tags;
    let idx = g * 256 + b;
    //    g = 1;
    //  b = idx % 2 === 1 ? 289 - 256 : 291 - 256;
    ctx.fillStyle = `rgb(0,${g},${b})`;
    ctx.strokeStyle = ctx.fillStyle;
    feature.geometry.forEach(geom =>
      drawGeometry(ctx, feature.type, geom, scaling)
    );
  });
}

function border(ctx, color, size) {
  if (!color) return;
  ctx.strokeStyle = color;
  ctx.rect(0.5, 0.5, size - 0.5, size - 0.5);
  ctx.stroke();
}

function calcBboxCenter(geom) {
  let min = { x: 1e9, y: 1e9 };
  let max = { x: 0, y: 0 };
  geom.forEach(co => {
    min.x = Math.min(min.x, co.x);
    max.x = Math.max(max.x, co.x);
    min.y = Math.min(min.y, co.y);
    max.y = Math.max(max.y, co.y);
  });
  const count = geom.length;
  return { x: 0.5 * (min.x + max.x), y: 0.5 * (min.y + max.y) };
}

function drawGeometry(ctx, type, geom, scaling) {
  ctx.beginPath();
  geom.forEach(coord => {
    ctx.lineTo(coord[0] * scaling, coord[1] * scaling);
  });
  // HACK: Gap between polygons - why?
  ctx.stroke();
  // HACK: end
  ctx.fill();
}

module.exports = render;
